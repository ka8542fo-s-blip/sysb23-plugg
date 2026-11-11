// T-SQL-lagret: det som kursen skriver ska köra oförändrat, det SQL Server
// vägrar ska stoppas, och SQLite ska aldrig synas.
import { test } from "node:test";
import assert from "node:assert/strict";
import initSqlJs from "sql.js";
import { hospitalSeed } from "../src/data/databaser/hospitalSeed.js";
import { hospitalSchema } from "../src/data/databaser/hospitalSchema.js";
import { checkTsqlRules, sqliteSeed, tableInfoFrom, toSqlite, toSqliteDdl } from "../src/lib/tsql.js";

const SQL = await initSqlJs();
function fresh() {
  const db = new SQL.Database();
  db.run(sqliteSeed(hospitalSeed));
  return db;
}
function rows(db, tsql) {
  const stmt = db.prepare(toSqlite(tsql));
  try {
    const values = [];
    while (stmt.step()) values.push(stmt.get());
    return { columns: stmt.getColumnNames(), values };
  } finally {
    stmt.free();
  }
}

// SQLite utan omskrivning, för det databasen själv vet (tableInfoFrom).
function plain(db, sql) {
  const stmt = db.prepare(sql);
  try {
    const values = [];
    while (stmt.step()) values.push(stmt.get());
    return { columns: stmt.getColumnNames(), values };
  } finally {
    stmt.free();
  }
}
const dml = (db, tsql) => db.run(toSqlite(tsql, tableInfoFrom((query) => plain(db, query))));

test("seeden är T-SQL och schemat visar IDENTITY, inte AUTOINCREMENT", () => {
  assert.doesNotMatch(hospitalSeed, /AUTOINCREMENT|PRAGMA/);
  const unit = hospitalSchema.find((t) => t.name === "Unit");
  assert.equal(unit.columns[0].type, "INTEGER IDENTITY(1,1)");
  assert.equal(unit.columns[0].pk, true);
  const db = fresh();
  assert.equal(rows(db, "SELECT COUNT(*) FROM Employee").values[0][0], 6);
});

test("funktionsnamn skrivs om, strängliteraler rörs inte", () => {
  assert.equal(toSqlite("SELECT ISNULL(EmployeeID, 0) FROM Car"), "SELECT IFNULL(EmployeeID, 0) FROM Car");
  assert.equal(toSqlite("SELECT SUBSTRING(EmpName, 1, 2), LEN(EmpName) FROM Employee"), "SELECT SUBSTR(EmpName, 1, 2), LENGTH(EmpName) FROM Employee");
  assert.equal(toSqlite("SELECT GETDATE()"), "SELECT date('now')");
  assert.equal(toSqlite("SELECT 'ISNULL(' + 'x' FROM Employee -- SUBSTRING("), "SELECT 'ISNULL(' || 'x' FROM Employee -- SUBSTRING(");
  assert.equal(toSqlite("SELECT [EmpName] FROM [Employee]"), 'SELECT "EmpName" FROM "Employee"');
});

test("+ blir || bara när en operand är text", () => {
  assert.equal(toSqlite("SELECT EmpNo + '-' + EmpName FROM Employee"), "SELECT EmpNo || '-' || EmpName FROM Employee");
  assert.equal(toSqlite("SELECT EmpSalary + 1000 FROM Employee"), "SELECT EmpSalary + 1000 FROM Employee");
  assert.equal(toSqlite("SELECT e.EmpName + ' ' + u.UnitName FROM Employee e, Unit u"), "SELECT e.EmpName || ' ' || u.UnitName FROM Employee e, Unit u");
  assert.equal(toSqlite("SELECT LOWER(EmpName) + '!' FROM Employee"), "SELECT LOWER(EmpName) || '!' FROM Employee");
  assert.equal(toSqlite("SELECT CAST(EmpSalary AS VARCHAR(10)) + ' kr' FROM Employee"), "SELECT CAST(EmpSalary AS VARCHAR(10)) || ' kr' FROM Employee");
  assert.equal(toSqlite("SELECT (EmpSalary + 1) * 12 FROM Employee"), "SELECT (EmpSalary + 1) * 12 FROM Employee");
  const db = fresh();
  assert.equal(rows(db, "SELECT EmpNo + '-' + EmpName FROM Employee WHERE EmpNo = 'E1'").values[0][0], "E1-Anna");
});

test("TOP och SET ROWCOUNT blir LIMIT", () => {
  assert.equal(toSqlite("SELECT TOP 3 EmpName FROM Employee ORDER BY EmpSalary DESC;"), "SELECT EmpName FROM Employee ORDER BY EmpSalary DESC LIMIT 3;");
  assert.equal(toSqlite("SELECT DISTINCT TOP (2) EmpAddress FROM Employee"), "SELECT DISTINCT EmpAddress FROM Employee LIMIT 2");
  assert.equal(toSqlite("SET ROWCOUNT 2; SELECT EmpName FROM Employee;"), " SELECT EmpName FROM Employee LIMIT 2;");
  const db = fresh();
  assert.equal(rows(db, "SELECT TOP 3 EmpName FROM Employee ORDER BY EmpSalary DESC").values.length, 3);
});

test("CREATE TABLE med IDENTITY och PK-constraint fungerar som i SQL Server", () => {
  const ddl = "CREATE TABLE T (TID INTEGER IDENTITY(1,1), Name VARCHAR(20) NOT NULL, CONSTRAINT PK_T_TID PRIMARY KEY (TID))";
  const out = toSqliteDdl(ddl);
  assert.match(out, /TID INTEGER PRIMARY KEY AUTOINCREMENT/);
  assert.doesNotMatch(out, /CONSTRAINT PK_T_TID/);
  assert.match(out, /VARCHAR\(20\) COLLATE NOCASE NOT NULL/);
  const db = fresh();
  db.run(toSqlite(`${ddl}; INSERT INTO T (Name) VALUES ('a'); INSERT INTO T (Name) VALUES ('b');`));
  assert.deepEqual(rows(db, "SELECT TID FROM T ORDER BY TID").values.flat(), [1, 2]);
  // TRUNCATE och GO
  db.run(toSqlite("TRUNCATE TABLE T\nGO\nINSERT INTO T (Name) VALUES ('c')"));
  assert.equal(rows(db, "SELECT COUNT(*) FROM T").values[0][0], 1);
});

test("textjämförelser är skiftlägesokänsliga som i SQL Server", () => {
  const db = fresh();
  assert.equal(rows(db, "SELECT COUNT(*) FROM Employee WHERE EmpAddress = 'lund'").values[0][0], rows(db, "SELECT COUNT(*) FROM Employee WHERE EmpAddress = 'Lund'").values[0][0]);
  assert.ok(rows(db, "SELECT COUNT(*) FROM Employee WHERE EmpAddress = 'LUND'").values[0][0] > 0);
});

test("GROUP BY-regeln stoppas med SQL Servers felmeddelande", () => {
  const fel = checkTsqlRules("SELECT EmpName, MAX(EmpSalary) FROM Employee");
  assert.ok(fel, "borde stoppas");
  assert.match(fel.raw, /Column 'EmpName' is invalid in the select list/);
  assert.ok(checkTsqlRules("SELECT UnitID, EmpName, COUNT(*) FROM Employee GROUP BY UnitID"));
  assert.ok(checkTsqlRules("SELECT * FROM Car GROUP BY Brand"));
  // Godkända former
  assert.equal(checkTsqlRules("SELECT UnitID, COUNT(*) FROM Employee GROUP BY UnitID"), null);
  assert.equal(checkTsqlRules("SELECT e.EmpName, COUNT(c.CarID) AS Antal FROM Employee e LEFT JOIN Car c ON e.EmployeeID = c.EmployeeID GROUP BY e.EmployeeID, e.EmpName"), null);
  assert.equal(checkTsqlRules("SELECT Brand, COUNT(*) FROM Car GROUP BY Brand HAVING COUNT(*) > 1 ORDER BY Brand"), null);
  assert.equal(checkTsqlRules("SELECT COUNT(*) FROM Car"), null);
  assert.equal(checkTsqlRules("SELECT EmpName, EmpSalary FROM Employee WHERE EmpSalary > (SELECT AVG(EmpSalary) FROM Employee)"), null);
  assert.equal(checkTsqlRules("SELECT u.UnitName, COUNT(p.PatientID) FROM Unit u LEFT JOIN Patient p ON u.UnitID = p.UnitID GROUP BY u.UnitName"), null);
  assert.equal(checkTsqlRules("SELECT EmpAddress AS Ort FROM Employee UNION ALL SELECT PatientAddress FROM Patient"), null);
});

test("alias på ett aggregat stoppas i WHERE och HAVING, som i SQL Server", () => {
  const having = checkTsqlRules("SELECT Brand, COUNT(*) AS Antal FROM Car GROUP BY Brand HAVING Antal > 2;");
  assert.match(having.raw, /Invalid column name 'Antal'/);
  assert.match(having.message, /finns inte i HAVING/);
  const where = checkTsqlRules("SELECT Brand, COUNT(*) AS Antal FROM Car WHERE Antal > 2 GROUP BY Brand;");
  assert.match(where.message, /finns inte i WHERE/);
  // Aliaset får användas i ORDER BY, och samma ord i en sträng stör inte.
  assert.equal(checkTsqlRules("SELECT Brand, COUNT(*) AS Antal FROM Car GROUP BY Brand ORDER BY Antal;"), null);
  assert.equal(checkTsqlRules("SELECT Brand, COUNT(*) AS Antal FROM Car GROUP BY Brand HAVING COUNT(*) > 2;"), null);
  assert.equal(checkTsqlRules("SELECT Brand, COUNT(*) AS Antal FROM Car WHERE Brand <> 'Antal' GROUP BY Brand;"), null);
});

test("alias-regeln läser inte in i en underfråga, den har egna namn", () => {
  assert.equal(checkTsqlRules("SELECT Brand, COUNT(*) AS Antal FROM Car GROUP BY Brand HAVING COUNT(*) = (SELECT MAX(Antal) FROM (SELECT COUNT(*) AS Antal FROM Car GROUP BY Brand) AS t);"), null);
});

test("TOP i en underfråga blir LIMIT i underfrågan", () => {
  assert.equal(
    toSqlite("SELECT EmpName FROM Employee WHERE EmpSalary = (SELECT TOP 1 EmpSalary FROM Employee ORDER BY EmpSalary DESC);"),
    "SELECT EmpName FROM Employee WHERE EmpSalary = (SELECT EmpSalary FROM Employee ORDER BY EmpSalary DESC LIMIT 1);",
  );
  assert.equal(toSqlite("SELECT a FROM t WHERE b IN (SELECT TOP (2) b FROM t)"), "SELECT a FROM t WHERE b IN (SELECT b FROM t LIMIT 2)");
  assert.equal(
    toSqlite("SELECT TOP 2 a FROM t WHERE b = (SELECT TOP 1 b FROM t)"),
    "SELECT a FROM t WHERE b = (SELECT b FROM t LIMIT 1) LIMIT 2",
  );
  const db = fresh();
  assert.equal(rows(db, "SELECT EmpName FROM Employee WHERE EmpSalary = (SELECT TOP 1 EmpSalary FROM Employee ORDER BY EmpSalary DESC);").values.length, 1);
  db.close();
});

test("giltig T-SQL som SQLite saknar skrivs om", () => {
  const db = fresh();
  const count = (sql) => rows(db, sql).values.length;
  // CONVERT, N'text' och dbo.
  assert.equal(toSqlite("SELECT CONVERT(DECIMAL(5, 2), EmpSalary) FROM dbo.Employee WHERE EmpName = N'Anna'"), "SELECT CAST( EmpSalary AS DECIMAL(5, 2)) FROM Employee WHERE EmpName = 'Anna'");
  assert.equal(count("SELECT CONVERT(VARCHAR(10), EmpSalary) FROM dbo.Employee WHERE EmpName = N'Anna'"), 2);
  // ALL och ANY, i alla riktningar.
  const salaries = rows(db, "SELECT EmpSalary FROM Employee").values.map(([value]) => value);
  const top = Math.max(...salaries);
  const bottom = Math.min(...salaries);
  const all = salaries.length;
  assert.equal(count("SELECT EmpName FROM Employee WHERE EmpSalary >= ALL (SELECT EmpSalary FROM Employee)"), salaries.filter((x) => x === top).length);
  assert.equal(count("SELECT EmpName FROM Employee WHERE EmpSalary <= ALL (SELECT EmpSalary FROM Employee)"), salaries.filter((x) => x === bottom).length);
  assert.equal(count("SELECT EmpName FROM Employee WHERE EmpSalary > ANY (SELECT EmpSalary FROM Employee)"), salaries.filter((x) => x > bottom).length);
  assert.equal(count("SELECT EmpName FROM Employee WHERE EmpSalary < SOME (SELECT EmpSalary FROM Employee)"), salaries.filter((x) => x < top).length);
  assert.equal(count("SELECT EmpName FROM Employee WHERE EmpSalary = ANY (SELECT EmpSalary FROM Employee)"), all);
  assert.equal(count("SELECT EmpName FROM Employee WHERE EmpSalary <> ALL (SELECT EmpSalary FROM Employee)"), 0);
  // Parenteserna bestämmer ordningen: A−B ∪ B−A, inte ((A−B) ∪ B) − A.
  const sides = "(SELECT EmpAddress FROM Employee EXCEPT SELECT PatientAddress FROM Patient) UNION (SELECT PatientAddress FROM Patient EXCEPT SELECT EmpAddress FROM Employee)";
  const emp = new Set(rows(db, "SELECT EmpAddress FROM Employee").values.flat());
  const pat = new Set(rows(db, "SELECT PatientAddress FROM Patient").values.flat());
  const expected = [...emp].filter((x) => !pat.has(x)).concat([...pat].filter((x) => !emp.has(x)));
  assert.deepEqual(rows(db, sides).values.flat().sort(), expected.sort());
  db.close();
});

test("en fönsterfunktion grupperar inte, och en underfråga aggregerar för sig", () => {
  assert.equal(checkTsqlRules("SELECT EmpName, COUNT(*) OVER (PARTITION BY UnitID) FROM Employee;"), null);
  assert.equal(checkTsqlRules("SELECT u.UnitName, (SELECT COUNT(*) FROM Employee AS e WHERE e.UnitID = u.UnitID) FROM Unit AS u;"), null);
  assert.notEqual(checkTsqlRules("SELECT EmpName, COUNT(*) FROM Employee;"), null);
});

test("alias som krockar med en funktion eller kolumn stoppas inte", () => {
  assert.equal(checkTsqlRules("SELECT Brand, COUNT(*) AS Count FROM Car GROUP BY Brand HAVING COUNT(*) > 2;"), null);
  assert.equal(checkTsqlRules("SELECT UnitID, AVG(EmpSalary) AS EmpSalary FROM Employee WHERE EmpSalary > 100 GROUP BY UnitID;"), null);
  assert.equal(checkTsqlRules("SELECT UnitID, AVG(CAST(EmpSalary AS DECIMAL(9, 2))) FROM Employee GROUP BY UnitID HAVING AVG(CAST(EmpSalary AS DECIMAL(9, 2))) > 1;"), null);
});

test("WITH TIES, APPLY och alias med = får ett eget besked", () => {
  assert.match(checkTsqlRules("SELECT TOP 1 WITH TIES EmpName FROM Employee ORDER BY EmpSalary DESC;").message, /WITH TIES/);
  assert.match(checkTsqlRules("SELECT e.EmpName FROM Employee AS e CROSS APPLY (SELECT 1 AS a) AS t;").message, /APPLY/);
  assert.match(checkTsqlRules("SELECT Antal = COUNT(*) FROM Employee;").message, /AS Antal/);
  // Samma ord i en sträng stör inte.
  assert.equal(checkTsqlRules("SELECT EmpName FROM Employee WHERE EmpName = 'WITH TIES';"), null);
});

test("LEFT och RIGHT skrivs om till SUBSTR och räknar som i SQL Server", () => {
  const db = fresh();
  const one = (sql) => rows(db, sql).values[0];
  assert.deepEqual(one("SELECT LEFT(EmpName, 2), RIGHT(EmpName, 2), LEFT(EmpName, 9), RIGHT(EmpName, 9), LEFT(EmpName, 0), RIGHT(EmpName, 0) FROM Employee WHERE EmpNo = 'E1'"), ["An", "na", "Anna", "Anna", "", ""]);
  assert.deepEqual(one("SELECT RIGHT(CAST(EmployeeID AS VARCHAR(5)), 1), LEFT(NULL, 1) FROM Car WHERE LicenseNo = 'C1'"), [null, null]);
  // Anrop i anrop, med kommatecken i argumenten.
  assert.deepEqual(one("SELECT LEFT(RIGHT(EmpName, 3), 2), LEFT(REPLACE(EmpName, 'n', 'N'), 3), LEFT(ISNULL(EmpPhoneNumber, 'x'), 2), RIGHT(EmpName,2) FROM Employee WHERE EmpNo = 'E1'"), ["nn", "ANN", "11", "na"]);
  // Resultatet är text, så + slår ihop.
  assert.equal(toSqlite("SELECT LEFT(EmpName, 1) + LEFT(EmpAddress, 1) FROM Employee"), "SELECT SUBSTR(EmpName, 1, 1) || SUBSTR(EmpAddress, 1, 1) FROM Employee");
  assert.deepEqual(one("SELECT LEFT(EmpName, 1) + '.' + LEFT(EmpAddress, 1), UPPER(LEFT(EmpName, 1)) + LOWER(RIGHT(EmpName, 3)) FROM Employee WHERE EmpNo = 'E1'"), ["A.L", "Anna"]);
  // LEFT JOIN och RIGHT JOIN är inga anrop, och inte heller en tabell som heter som en funktion.
  assert.equal(toSqlite("SELECT * FROM a LEFT JOIN b ON a.x = b.x RIGHT JOIN c ON c.x = b.x"), "SELECT * FROM a LEFT JOIN b ON a.x = b.x RIGHT JOIN c ON c.x = b.x");
  for (const sql of ["INSERT INTO Month (a) VALUES (1)", "INSERT INTO Day (a) VALUES (1)", "UPDATE Year SET a = 1", "SELECT * FROM Left JOIN Right ON 1 = 1", "SELECT Day, Month, Year FROM Calendar WHERE Day = 1"]) {
    assert.equal(toSqlite(sql), sql);
  }
  // En CAST i en CAST: det yttre AS avgör, så + slår ihop texten.
  assert.deepEqual(one("SELECT CAST(CAST(EmpSalary AS INTEGER) AS VARCHAR(10)) + ' kr', CAST(LEN(EmpName) AS VARCHAR(2)) + '!' FROM Employee WHERE EmpNo = 'E1'"), ["25000 kr", "4!"]);
});

test("YEAR, MONTH, DAY och DATEPART ger heltal ur datumet", () => {
  const db = fresh();
  const one = (sql) => rows(db, sql).values[0];
  assert.deepEqual(one("SELECT YEAR(StartDate), MONTH(StartDate), DAY(StartDate) FROM Suffers WHERE StartDate = '1953-01-12'"), [1953, 1, 12]);
  assert.deepEqual(one("SELECT DATEPART(year, StartDate), DATEPART(mm, StartDate), DATEPART(d, StartDate) FROM Suffers WHERE StartDate = '1953-01-12'"), [1953, 1, 12]);
  assert.deepEqual(one("SELECT YEAR(NULL), MONTH(NULL), DAY(NULL)"), [null, null, null]);
  // Ett heltal: + räknar, och sammanslagning kräver text.
  assert.deepEqual(one("SELECT YEAR(StartDate) + 1, YEAR(StartDate) + '1', 'ar ' + CAST(YEAR(StartDate) AS VARCHAR(4)) FROM Suffers WHERE StartDate = '1953-01-12'"), [1954, 1954, "ar 1953"]);
  assert.equal(rows(db, "SELECT COUNT(*) FROM Suffers WHERE YEAR(StartDate) = 1978").values[0][0], 2);
  const byYear = rows(db, "SELECT YEAR(StartDate) AS Ar, COUNT(*) FROM Suffers GROUP BY YEAR(StartDate) ORDER BY Ar").values;
  assert.deepEqual(byYear[0], [1953, 1]);
  assert.deepEqual(byYear.find(([year]) => year === 1978), [1978, 2]);
  assert.ok(one("SELECT YEAR(GETDATE())")[0] >= 2026);
});

test("DATEDIFF räknar skiften mellan datumen som SQL Server", () => {
  const db = fresh();
  const one = (sql) => rows(db, sql).values[0][0];
  assert.equal(one("SELECT DATEDIFF(day, '2020-01-01', '2020-03-01')"), 60);
  assert.equal(one("SELECT DATEDIFF(dd, '2020-03-01', '2020-01-01')"), -60);
  assert.equal(one("SELECT DATEDIFF(day, '2020-01-01 23:00', '2020-01-02 01:00')"), 1, "dygnsskiften, inte timmar");
  assert.equal(one("SELECT DATEDIFF(month, '2020-01-31', '2020-03-01')"), 2);
  assert.equal(one("SELECT DATEDIFF(mm, '2019-12-31', '2020-01-01')"), 1);
  assert.equal(one("SELECT DATEDIFF(year, '2019-12-31', '2020-01-01')"), 1);
  assert.equal(one("SELECT DATEDIFF(yy, '2020-01-01', '2020-12-31')"), 0);
  assert.equal(one("SELECT DATEDIFF(day, NULL, '2020-01-01')"), null);
  // Skillnaden räknas klart före * och +.
  assert.equal(one("SELECT DATEDIFF(month, '2020-01-31', '2020-03-01') * 10"), 20);
  assert.equal(one("SELECT 1 + DATEDIFF(year, '2019-12-31', '2020-01-01') * 10"), 11);
  // Mot GETDATE() och en kolumn.
  assert.equal(one("SELECT COUNT(*) FROM Suffers WHERE DATEDIFF(day, StartDate, GETDATE()) > 0"), 9);
  assert.equal(one("SELECT COUNT(*) FROM Suffers WHERE DATEDIFF(year, StartDate, GETDATE()) = YEAR(GETDATE()) - YEAR(StartDate)"), 9);
  assert.equal(one("SELECT DATEDIFF(day, MIN(StartDate), MAX(StartDate)) FROM Suffers"), Math.round((Date.UTC(2010, 11, 9) - Date.UTC(1953, 0, 12)) / 86400000));
});

test("schemat dbo skrivs bort, också med hakparenteser och citattecken", () => {
  const db = fresh();
  for (const from of ["[dbo].[Employee]", "dbo.[Employee]", "[dbo].Employee", "dbo.Employee", '"dbo"."Employee"', "DBO.Employee", "[DBO].[Employee]"]) {
    assert.equal(rows(db, `SELECT COUNT(*) FROM ${from}`).values[0][0], 6, from);
  }
  assert.equal(rows(db, "SELECT [e].[EmpName] FROM [dbo].[Employee] AS [e] WHERE [e].[EmpNo] = 'E1'").values[0][0], "Anna");
  assert.equal(toSqlite("INSERT INTO [dbo].[Unit] (UnitNo) VALUES ('U9')"), "INSERT INTO \"Unit\" (UnitNo) VALUES ('U9')");
  assert.equal(toSqlite("UPDATE [dbo].[Car] SET Price = 1"), 'UPDATE "Car" SET Price = 1');
  assert.equal(toSqlite("SELECT 'dbo.x', [dbo] FROM t"), "SELECT 'dbo.x', \"dbo\" FROM t", "bara ett schema före en punkt");
});

test("(SELECT …) AS t (a, b) döper om kolumnerna och jämför text som tabellerna", () => {
  const db = fresh();
  assert.deepEqual(rows(db, "SELECT t.n FROM (SELECT COUNT(*) FROM Employee) AS t (n)").values, [[6]]);
  const two = rows(db, "SELECT t.Enhet, t.Antal FROM (SELECT UnitID, COUNT(*) FROM Employee GROUP BY UnitID) t (Enhet, Antal) ORDER BY t.Enhet");
  assert.deepEqual(two.columns, ["Enhet", "Antal"]);
  assert.deepEqual(two.values, [[1, 3], [2, 2], [3, 1]]);
  // TOP och ORDER BY inuti, SELECT * utanför, och två kolumner som heter lika inuti.
  assert.deepEqual(rows(db, "SELECT t.Namn, t.Lon FROM (SELECT TOP 2 EmpName, EmpSalary FROM Employee ORDER BY EmpSalary DESC) AS t (Namn, Lon) ORDER BY t.Lon DESC").values, [["Eva", 279000], ["Eva", 55000]]);
  assert.deepEqual(rows(db, "SELECT * FROM (SELECT UnitNo, UnitName FROM Unit) AS t (a, b)").columns, ["a", "b"]);
  assert.deepEqual(rows(db, "SELECT t.a, t.b FROM (SELECT e1.EmpName, e2.EmpName FROM Employee e1, Employee e2 WHERE e1.EmpNo = 'E1' AND e2.EmpNo = 'E2') AS t (a, b)").values, [["Anna", "Eva"]]);
  assert.deepEqual(rows(db, "SELECT e.EmpName, t.Antal FROM Employee AS e INNER JOIN (SELECT UnitID, COUNT(*) FROM Employee GROUP BY UnitID) AS t (Enhet, Antal) ON t.Enhet = e.UnitID WHERE e.EmpNo = 'E1'").values, [["Anna", 3]]);
  assert.deepEqual(rows(db, "SELECT t.x FROM (SELECT (SELECT COUNT(*) FROM (SELECT UnitID FROM Employee) AS u (id)) FROM Unit WHERE UnitNo = 'U1') AS t (x)").values, [[6]], "nästlade");
  // Text jämförs utan hänsyn till skiftläge, som i en vanlig delfråga och som SQL Server gör.
  assert.equal(rows(db, "SELECT COUNT(*) FROM (SELECT EmpName FROM Employee) AS t (Namn) WHERE t.Namn = 'ANNA'").values[0][0], 2);
  assert.equal(rows(db, "SELECT COUNT(*) FROM (SELECT EmpName FROM Employee) AS t WHERE t.EmpName = 'ANNA'").values[0][0], 2);
  assert.equal(rows(db, "SELECT COUNT(*) FROM (SELECT EmpSalary FROM Employee) AS t (Lon) WHERE t.Lon = '25000'").values[0][0], 1, "tal mot text som går att göra om");
  // Det som bara ser ut som en kolumnlista skrivs inte om.
  for (const sql of ["SELECT 1 WHERE 1 IN (SELECT 1) AND (1 = 1)", "WITH t (a) AS (SELECT 1) SELECT * FROM t", "SELECT (SELECT 1) AS x, (2) AS y", "SELECT COUNT(*) OVER (PARTITION BY a) FROM t"]) {
    assert.equal(toSqlite(sql), sql);
  }
});

test("INSERT utan kolumnlista hoppar över IDENTITY-kolumnen, som SQL Server", () => {
  const db = fresh();
  dml(db, "INSERT INTO Unit VALUES ('U4', 'Radiology', 'Care road')");
  assert.deepEqual(rows(db, "SELECT UnitID, UnitNo, UnitName, UnitAddress FROM Unit WHERE UnitNo = 'U4'").values, [[4, "U4", "Radiology", "Care road"]]);
  dml(db, "INSERT INTO [dbo].[Unit] VALUES ('U5', 'X', 'Y'), ('U6', 'Z', 'W')");
  assert.equal(rows(db, "SELECT COUNT(*) FROM Unit").values[0][0], 6);
  dml(db, "INSERT INTO Employee VALUES ('E7', 'Kim', 'Lund', '777', 30000, 1)");
  assert.deepEqual(rows(db, "SELECT EmployeeID, EmpName, UnitID FROM Employee WHERE EmpNo = 'E7'").values, [[7, "Kim", 1]]);
  // En tabell som körningen själv skapar, med IDENTITY mitt i, och INSERT ... SELECT.
  dml(db, "CREATE TABLE Kopia (Namn VARCHAR(20), KopiaID INTEGER IDENTITY(1,1), Adress VARCHAR(20), CONSTRAINT PK_Kopia PRIMARY KEY (KopiaID)); INSERT INTO Kopia SELECT PatientName, PatientAddress FROM Patient WHERE PatientNo = 'PP1'");
  // ... och en som en tidigare körning skapade.
  dml(db, "INSERT INTO Kopia VALUES ('Hej', 'Hopp')");
  assert.deepEqual(rows(db, "SELECT Namn, KopiaID, Adress FROM Kopia ORDER BY KopiaID").values, [["Anna", 1, "Lund"], ["Hej", 2, "Hopp"]]);
  // Utan IDENTITY, med kolumnlista eller utan tabellkännedom är det som skrivet.
  const info = tableInfoFrom((query) => plain(db, query));
  for (const sql of ["INSERT INTO Examines VALUES (1, 2)", "INSERT INTO Unit (UnitNo) VALUES ('U9')", "INSERT INTO FinnsInte VALUES (1)", "INSERT INTO Unit DEFAULT VALUES"]) {
    assert.equal(toSqlite(sql, info), sql);
  }
  assert.equal(toSqlite("INSERT INTO Unit VALUES ('U4', 'x', 'y')"), "INSERT INTO Unit VALUES ('U4', 'x', 'y')");
});
