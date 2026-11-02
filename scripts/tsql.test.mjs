// T-SQL-lagret: det som kursen skriver ska köra oförändrat, det SQL Server
// vägrar ska stoppas, och SQLite ska aldrig synas.
import { test } from "node:test";
import assert from "node:assert/strict";
import initSqlJs from "sql.js";
import { hospitalSeed } from "../src/data/databaser/hospitalSeed.js";
import { hospitalSchema } from "../src/data/databaser/hospitalSchema.js";
import { checkTsqlRules, sqliteSeed, toSqlite, toSqliteDdl } from "../src/lib/tsql.js";

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
