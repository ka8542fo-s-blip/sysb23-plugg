// SQL Server-reglerna: det SQL Server stoppar men SQLite kör ska stoppas i
// rättningen och bli en varning i Fritt läge. Varje regel prövas med det som
// ska flaggas och med den närmaste giltiga formen, och ingen referenslösning
// får flaggas.
import { test } from "node:test";
import assert from "node:assert/strict";
import initSqlJs from "sql.js";
import { hospitalSeed } from "../src/data/databaser/hospitalSeed.js";
import { BANK_TABLES, sqlExamTasks } from "../src/data/databaser/sqlExamBank.js";
import { sqlExercises } from "../src/data/databaser/sqlExercises.js";
import { examSeed, gradeTask4 } from "../src/lib/examGrade.js";
import { checkExercise, checkFreeQuery } from "../src/lib/sqlCheck.js";
import { collectFacts, generateExercise, normalizeSql } from "../src/lib/sqlPractice.js";
import { checkDivisionByZero, checkIdentityInsert, checkScalarSubqueries, checkTsqlRules, sqliteSeed, tableInfoFrom, toSqlite } from "../src/lib/tsql.js";
import { checkConversions } from "../src/lib/tsqlTypes.js";

const SQL = await initSqlJs();
const open = (seed) => {
  const db = new SQL.Database();
  db.run(sqliteSeed(seed));
  return db;
};
const select = (db, sql) => {
  const stmt = db.prepare(sql);
  try {
    const values = [];
    while (stmt.step()) values.push(stmt.get());
    return { columns: stmt.getColumnNames(), values };
  } finally {
    stmt.free();
  }
};
const engine = { newDatabase: async () => open(hospitalSeed), runSelect: select, runScript: (db, sql) => db.run(sql) };
const examDb = open(examSeed(BANK_TABLES));
const hospitalDb = open(hospitalSeed);
const onExam = (sql) => select(examDb, toSqlite(sql));
const onHospital = (sql) => select(hospitalDb, toSqlite(sql));

const task = (id) => sqlExamTasks.find((item) => item.id === id);
const exam = (id, sql) => gradeTask4(SQL, task(id), sql);
const practice = (id, sql) => checkExercise({ exercise: sqlExercises.find((item) => item.id === id), userSql: sql, engine });

// Stoppad med SQL Servers felmeddelande och klartext som pekar ut raden.
function stopped(result, raw, line = 1) {
  assert.equal(result.status, "error", `borde stoppas: ${result.message}`);
  assert.equal(result.points ?? 0, 0);
  if (raw instanceof RegExp) assert.match(result.raw, raw);
  else assert.equal(result.raw, raw);
  assert.match(result.message, new RegExp(`^SQL Server skulle stoppa frågan på rad ${line} \\(`));
}
const correct = (result) => assert.equal(result.status, "correct", result.message);

const SH = "FROM Student AS s INNER JOIN HasStudied AS h ON h.StudentNo = s.StudentNo";
const THREE = "FROM HasStudied AS h INNER JOIN Student AS s ON s.StudentNo = h.StudentNo INNER JOIN Course AS c ON c.Code = h.Code";

test("1: en kolumn i HAVING som varken grupperas eller aggregeras", () => {
  const sql = `SELECT s.StudentNo, s.Name, COUNT(*) AS AntalKurser ${SH} GROUP BY s.StudentNo, s.Name HAVING COUNT(*) >= 2 AND s.Age > (SELECT Age FROM Student WHERE StudentNo = 'S5');`;
  const result = exam("tn-24", sql);
  stopped(result, "Column 's.Age' is invalid in the HAVING clause because it is not contained in either an aggregate function or the GROUP BY clause.");
  assert.match(result.message, /hör det hemma i WHERE/);
  // Uppställd som på tentan pekar beskedet ut raden.
  const lines = `SELECT s.StudentNo, s.Name, COUNT(*) AS AntalKurser\n${SH}\nGROUP BY s.StudentNo, s.Name\nHAVING COUNT(*) >= 2\n    AND s.Age > (SELECT Age FROM Student WHERE StudentNo = 'S5');`;
  stopped(exam("tn-24", lines), /HAVING clause/, 5);
  assert.match(checkTsqlRules("SELECT COUNT(*) FROM Student HAVING Age > 20;").raw, /Column 'Age' is invalid in the HAVING clause/);
  // Villkoret i WHERE, och HAVING på det som grupperas eller aggregeras.
  correct(exam("tn-24", task("tn-24").solution));
  correct(exam("tn-24", `SELECT s.StudentNo, s.Name, COUNT(*) ${SH} GROUP BY s.StudentNo, s.Name HAVING COUNT(*) >= 2 AND MAX(s.Age) > (SELECT Age FROM Student WHERE StudentNo = 'S5');`));
  assert.equal(checkTsqlRules(`SELECT s.StudentNo, s.Name ${SH} GROUP BY s.StudentNo, s.Name HAVING s.Name <> 'Max' AND COUNT(*) > 1;`), null);
});

test("2: ORDER BY på en kolumn som inte grupperas", () => {
  stopped(exam("tn-01", `SELECT s.StudentNo, s.Name, COUNT(*) AS AntalKurser ${SH} GROUP BY s.StudentNo, s.Name ORDER BY s.Age;`),
    "Column 's.Age' is invalid in the ORDER BY clause because it is not contained in either an aggregate function or the GROUP BY clause.");
  assert.match(checkTsqlRules("SELECT COUNT(*) FROM Student ORDER BY Age;").raw, /ORDER BY clause/);
  // Det grupperade, ett aggregat, ett alias och en position går bra.
  for (const order of ["s.Name", "COUNT(*) DESC", "AntalKurser DESC", "3 DESC, s.StudentNo"]) {
    correct(exam("tn-01", `SELECT s.StudentNo, s.Name, COUNT(*) AS AntalKurser ${SH} GROUP BY s.StudentNo, s.Name ORDER BY ${order};`));
  }
  assert.equal(checkTsqlRules("SELECT Code, AVG(Grade) AS Grade FROM HasStudied GROUP BY Code ORDER BY Grade;"), null, "aliaset går före kolumnen i ORDER BY");
});

test("3: JOIN utan ON", () => {
  const result = exam("tn-05", "SELECT s.Name, c.Name, h.Grade FROM HasStudied AS h INNER JOIN Student AS s INNER JOIN Course AS c WHERE s.StudentNo = h.StudentNo AND c.Code = h.Code AND h.Grade >= 8;");
  stopped(result, "Incorrect syntax near the keyword 'WHERE'.");
  assert.match(result.message, /INNER JOIN Student AS s saknar ON/);
  assert.equal(checkTsqlRules("SELECT * FROM Student s JOIN HasStudied h;").raw, "Incorrect syntax near ';'.");
  assert.equal(checkTsqlRules("SELECT * FROM Student s LEFT JOIN HasStudied h, Course c WHERE 1 = 1;").raw, "Incorrect syntax near ','.");
  assert.equal(checkTsqlRules("SELECT * FROM Student AS s JOIN HasStudied AS h JOIN Course AS c ON c.Code = h.Code WHERE s.Age > 1;").raw, "Incorrect syntax near the keyword 'WHERE'.");
  // ON efter varje JOIN, CROSS JOIN, kommatecken och ON i nästlad form.
  correct(exam("tn-05", task("tn-05").solution));
  correct(exam("tn-05", "SELECT s.Name, c.Name, h.Grade FROM HasStudied AS h CROSS JOIN Student AS s CROSS JOIN Course AS c WHERE s.StudentNo = h.StudentNo AND c.Code = h.Code AND h.Grade >= 8;"));
  correct(exam("tn-05", "SELECT s.Name, c.Name, h.Grade FROM HasStudied AS h, Student AS s, Course AS c WHERE s.StudentNo = h.StudentNo AND c.Code = h.Code AND h.Grade >= 8;"));
  assert.equal(checkTsqlRules("SELECT * FROM Student AS s INNER JOIN HasStudied AS h INNER JOIN Course AS c ON c.Code = h.Code ON h.StudentNo = s.StudentNo;"), null);
  assert.equal(checkTsqlRules("SELECT * FROM Student AS s LEFT OUTER JOIN HasStudied AS h ON h.StudentNo = s.StudentNo FULL OUTER JOIN Course AS c ON c.Code = h.Code;"), null);
});

test("4: ett alias från SELECT i WHERE, GROUP BY eller HAVING", () => {
  const result = exam("tn-11", "SELECT StudentNo, Name, Age AS Alder FROM Student WHERE Alder > (SELECT Age FROM Student WHERE StudentNo = 'S1');");
  stopped(result, "Invalid column name 'Alder'.");
  assert.match(result.message, /aliaset Alder finns inte i WHERE.*Skriv uttrycket i stället: Age\./);
  assert.match(checkTsqlRules("SELECT Address AS Gata, COUNT(*) FROM Student GROUP BY Gata;").message, /finns inte i GROUP BY/);
  assert.match(checkTsqlRules("SELECT Address AS Gata, COUNT(*) FROM Student GROUP BY Address HAVING Gata <> 'x';").message, /finns inte i HAVING/);
  assert.match(checkTsqlRules("SELECT Age AS Alder FROM Student WHERE (Alder > 20 OR Alder < 5);").message, /finns inte i WHERE/, "också inom parentes");
  // Uttrycket i WHERE, aliaset i ORDER BY, ett alias som också är en kolumn och en delfrågas kolumn.
  correct(exam("tn-11", "SELECT StudentNo, Name, Age AS Alder FROM Student WHERE Age > (SELECT Age FROM Student WHERE StudentNo = 'S1') ORDER BY Alder;"));
  correct(exam("tn-11", "SELECT StudentNo, Name, Age AS Age FROM Student WHERE Age > (SELECT Age FROM Student WHERE StudentNo = 'S1');"));
  correct(exam("tn-11", "SELECT StudentNo, Name, Alder FROM (SELECT StudentNo, Name, Age AS Alder FROM Student) AS t WHERE Alder > (SELECT Age FROM Student WHERE StudentNo = 'S1');"));
  correct(exam("tn-11", "SELECT t.StudentNo, t.Name, t.Alder AS Alder FROM (SELECT StudentNo, Name, Age AS Alder FROM Student) AS t WHERE Alder > (SELECT Age FROM Student WHERE StudentNo = 'S1');"));
  assert.equal(checkTsqlRules("WITH t (Alder) AS (SELECT Age FROM Student) SELECT Alder AS Alder FROM t WHERE Alder > 20;"), null);
});

test("5: en delfråga i FROM utan alias", () => {
  stopped(exam("tn-34", "SELECT StudentNo, Code, Grade FROM (SELECT StudentNo, Code, Grade, AVG(Grade) OVER (PARTITION BY Code) AS Snitt FROM HasStudied) WHERE Grade > Snitt;"),
    "Incorrect syntax near the keyword 'WHERE'.");
  assert.equal(checkTsqlRules("SELECT * FROM (SELECT Name FROM Student)").raw, "Incorrect syntax near ')'.");
  assert.equal(checkTsqlRules("SELECT * FROM Student AS s INNER JOIN (SELECT StudentNo FROM HasStudied) ON 1 = 1;").raw, "Incorrect syntax near the keyword 'ON'.");
  correct(exam("tn-34", "SELECT StudentNo, Code, Grade FROM (SELECT StudentNo, Code, Grade, AVG(Grade) OVER (PARTITION BY Code) AS Snitt FROM HasStudied) AS t WHERE Grade > Snitt;"));
  correct(exam("tn-34", "SELECT StudentNo, Code, Grade FROM (SELECT StudentNo, Code, Grade, AVG(Grade) OVER (PARTITION BY Code) AS Snitt FROM HasStudied) t WHERE Grade > Snitt;"));
});

test("6: ORDER BY i en underfråga utan TOP", async () => {
  const raw = /^The ORDER BY clause is invalid in views, inline functions, derived tables, subqueries, and common table expressions, unless TOP, OFFSET or FOR XML is also specified\.$/;
  stopped(exam("tn-11", "SELECT StudentNo, Name, Age FROM Student WHERE Age > (SELECT Age FROM Student WHERE StudentNo = 'S1' ORDER BY Age);"), raw);
  stopped(exam("tn-20", "SELECT StudentNo, Name, Age FROM Student WHERE StudentNo NOT IN (SELECT StudentNo FROM HasStudied ORDER BY StudentNo);"), raw);
  assert.match(checkTsqlRules("SELECT * FROM (SELECT Name FROM Student ORDER BY Name) AS t;").raw, raw);
  assert.match(checkTsqlRules("WITH t AS (SELECT Name FROM Student ORDER BY Name) SELECT * FROM t;").raw, raw);
  assert.match(checkTsqlRules("SELECT Name FROM Student WHERE Age >= ALL (SELECT Age FROM Student ORDER BY Age);").raw, raw);
  stopped((await practice("sql-32", "CREATE VIEW HighEarner AS SELECT EmpName, EmpSalary FROM Employee WHERE EmpSalary > 30000 ORDER BY EmpName;")), raw);
  // TOP med ORDER BY, ORDER BY i den yttre frågan, i en fönsterfunktion och efter en UNION.
  correct(exam("tn-30", `SELECT s.StudentNo, s.Name, c.Name ${THREE} WHERE h.Code = 'C1' AND h.Grade = (SELECT TOP 1 Grade FROM HasStudied WHERE Code = 'C1' ORDER BY Grade DESC);`));
  correct(exam("tn-11", "SELECT StudentNo, Name, Age FROM Student WHERE Age > (SELECT Age FROM Student WHERE StudentNo = 'S1') ORDER BY Age;"));
  assert.equal(checkTsqlRules("SELECT Name, ROW_NUMBER() OVER (ORDER BY Age) AS Nr FROM Student;"), null);
  assert.equal(checkTsqlRules("(SELECT Name FROM Student) UNION (SELECT Name FROM Course) ORDER BY Name;"), null);
});

test("7: LIMIT i stället för TOP", () => {
  const result = exam("tn-30", `SELECT s.StudentNo, s.Name, c.Name ${THREE} WHERE h.Code = 'C1' AND h.Grade = (SELECT Grade FROM HasStudied WHERE Code = 'C1' ORDER BY Grade DESC LIMIT 1);`);
  stopped(result, "Incorrect syntax near 'LIMIT'.");
  assert.match(result.message, /SELECT TOP 1/);
  // Direkt efter tabellen läser SQL Server LIMIT som ett alias och fastnar på talet.
  assert.equal(checkTsqlRules("SELECT * FROM Student LIMIT 3;").raw, "Incorrect syntax near '3'.");
  assert.equal(checkTsqlRules("SELECT * FROM Student ORDER BY Age DESC LIMIT 3;").raw, "Incorrect syntax near 'LIMIT'.");
  correct(exam("tn-30", `SELECT s.StudentNo, s.Name, c.Name ${THREE} WHERE h.Code = 'C1' AND h.Grade = (SELECT TOP 1 Grade FROM HasStudied WHERE Code = 'C1' ORDER BY Grade DESC);`));
  assert.equal(checkTsqlRules("SELECT TOP 3 Name FROM Student ORDER BY Age DESC;"), null);
});

test("8: SQLite-funktioner som SQL Server saknar", async () => {
  const ifnull = await practice("sql-41", "SELECT LicenseNo, IFNULL(EmployeeID, 0) AS Agare FROM Car;");
  stopped(ifnull, "'IFNULL' is not a recognized built-in function name.");
  assert.match(ifnull.message, /Där heter den ISNULL: ISNULL\(EmployeeID, 0\)\./);
  stopped(await practice("sql-40", "SELECT LOWER(PatientName) AS Gemener, SUBSTR(PatientName, 1, 2) AS Kort FROM Patient;"), "'SUBSTR' is not a recognized built-in function name.");
  assert.match(checkTsqlRules("SELECT GROUP_CONCAT(Name) FROM Student;").message, /STRING_AGG/);
  assert.match(checkTsqlRules("SELECT INSTR(Name, 'a') FROM Student;").message, /CHARINDEX/);
  assert.equal(checkTsqlRules("SELECT MAX(Age, 30) FROM Student;").raw, "The max function requires 1 argument(s).");
  correct(await practice("sql-41", "SELECT LicenseNo, ISNULL(EmployeeID, 0) AS Agare FROM Car;"));
  correct(await practice("sql-41", "SELECT LicenseNo, COALESCE(EmployeeID, 0) AS Agare FROM Car;"));
  correct(await practice("sql-40", "SELECT LOWER(PatientName) AS Gemener, SUBSTRING(PatientName, 1, 2) AS Kort FROM Patient;"));
  // Typer med parentes och en tabell som heter som en funktion är inga anrop.
  assert.equal(checkTsqlRules("SELECT CAST(StartDate AS TIME(0)), CONVERT(DATE, StartDate) FROM Suffers;"), null);
  assert.equal(checkTsqlRules("SELECT MAX(DISTINCT IllnessID), MIN(StartDate) FROM Suffers;"), null);
  assert.equal(checkTsqlRules("CREATE TABLE Length (Id INT, Tid TIME(7)); INSERT INTO Length (Id) VALUES (1);"), null);
  assert.match(checkTsqlRules("CREATE VIEW Bilar AS SELECT LicenseNo, IFNULL(EmployeeID, 0) AS Agare FROM Car;").raw, /'IFNULL' is not a recognized/);
});

test("9: LENGTH i stället för LEN", () => {
  const result = exam("tn-11", "SELECT StudentNo, Name, Age FROM Student WHERE Age > (SELECT Age FROM Student WHERE StudentNo = 'S1') AND LENGTH(Name) > 0;");
  stopped(result, "'LENGTH' is not a recognized built-in function name.");
  assert.match(result.message, /LEN\(Name\)/);
  correct(exam("tn-11", "SELECT StudentNo, Name, Age FROM Student WHERE Age > (SELECT Age FROM Student WHERE StudentNo = 'S1') AND LEN(Name) > 0;"));
});

test("10: == i stället för =", () => {
  const result = exam("tn-11", "SELECT StudentNo, Name, Age FROM Student WHERE Age > (SELECT Age FROM Student WHERE StudentNo == 'S1');");
  stopped(result, "Incorrect syntax near '='.");
  assert.match(result.message, /StudentNo = 'S1'/);
  correct(exam("tn-11", task("tn-11").solution));
  assert.equal(checkTsqlRules("SELECT * FROM Student WHERE Age >= 20 AND Name <> 'Max';"), null);
});

test("11: text inom dubbla citattecken är ett namn i SQL Server", async () => {
  const result = exam("tn-11", 'SELECT StudentNo, Name, Age FROM Student WHERE Age > (SELECT Age FROM Student WHERE StudentNo = "S1");');
  stopped(result, "Invalid column name 'S1'.");
  assert.match(result.message, /enkla citattecken: 'S1'/);
  const onExamTables = (sql) => checkConversions(sql, (query) => select(examDb, query));
  assert.equal(onExamTables('SELECT * FROM HasStudied WHERE Code IN ("C1", "C2");').raw, "Invalid column name 'C1'.");
  assert.equal(onExamTables('SELECT * FROM Student WHERE Name LIKE "M%";').raw, "Invalid column name 'M%'.");
  const update = await practice("sql-30", 'UPDATE Employee SET EmpName = "Anna" WHERE EmpNo = \'E1\';');
  stopped(update, "Invalid column name 'Anna'.");
  const insert = await practice("sql-29", 'INSERT INTO Unit (UnitNo, UnitName, UnitAddress) VALUES ("U4", \'Radiology\', \'Care road\');');
  stopped(insert, /^The name "U4" is not permitted in this context\./);
  // Ett namn som finns är en kolumn, och ett alias går att sortera på.
  correct(exam("tn-11", task("tn-11").solution));
  assert.equal(onExamTables('SELECT "Name", [Age] FROM "Student" WHERE "StudentNo" = \'S1\';'), null);
  assert.equal(onExamTables('SELECT Name AS "Namn", COUNT(*) AS "Antal" FROM Student GROUP BY Name ORDER BY "Antal", "Namn";'), null);
  assert.equal(onExamTables('SELECT h."Grade" FROM HasStudied AS h;'), null);
});

test("12: ett värde där SQL Server väntar sig ett villkor", () => {
  const having = exam("tn-01", `SELECT s.StudentNo, s.Name, COUNT(*) AS AntalKurser ${SH} GROUP BY s.StudentNo, s.Name HAVING COUNT(*);`);
  stopped(having, "An expression of non-boolean type specified in a context where a condition is expected, near ';'.");
  assert.match(having.message, /COUNT\(\*\) är ett värde, inte ett villkor/);
  stopped(exam("tn-01", `SELECT s.StudentNo, s.Name, COUNT(*) AS AntalKurser ${SH} WHERE h.Grade GROUP BY s.StudentNo, s.Name;`),
    "An expression of non-boolean type specified in a context where a condition is expected, near 'GROUP'.");
  assert.match(checkTsqlRules("SELECT * FROM HasStudied WHERE Grade AND Code = 'C1';").raw, /near 'AND'/);
  assert.match(checkTsqlRules("SELECT * FROM HasStudied WHERE NOT (Grade);").raw, /non-boolean/);
  assert.match(checkTsqlRules("SELECT CASE WHEN Grade THEN 'x' END FROM HasStudied;").raw, /near 'THEN'/);
  assert.match(checkTsqlRules("SELECT * FROM Student AS s INNER JOIN HasStudied AS h ON h.Grade;").raw, /non-boolean/);
  assert.match(checkTsqlRules("DELETE FROM Car WHERE EmployeeID;").raw, /non-boolean/);
  // Jämförelser och predikat i alla former.
  correct(exam("tn-06", task("tn-06").solution));
  for (const condition of [
    "Grade >= 8", "NOT Grade = 8", "Grade BETWEEN 6 AND 8 AND Code = 'C1'", "(Grade > 8 OR Code = 'C1') AND NOT (Grade < 2)",
    "Code IN ('C1', 'C2')", "Code LIKE 'C%'", "StudentNo IS NOT NULL", "EXISTS (SELECT 1 FROM Student)",
    "CASE WHEN Grade > 8 THEN 1 ELSE 0 END = 1", "Grade !< 6", "(SELECT COUNT(*) FROM Student) > 1",
  ]) {
    assert.equal(checkTsqlRules(`SELECT * FROM HasStudied WHERE ${condition};`), null, condition);
  }
  assert.equal(checkTsqlRules("SELECT CASE Grade WHEN 7 THEN 'sju' END FROM HasStudied;"), null, "ett enkelt CASE jämför värden");
});

test("13: en korrelerad underfråga som ger flera rader", () => {
  // S1 har en rad, de andra två: SQLite tar S1:s ålder först och ger rätt rader.
  const sql = "SELECT StudentNo, Name FROM Student WHERE Age = (SELECT s2.Age FROM Student AS s2 WHERE s2.StudentNo = 'S1' OR s2.StudentNo = Student.StudentNo) AND StudentNo <> 'S1';";
  stopped(exam("tn-12", sql), /^Subquery returned more than 1 value\./);
  assert.match(exam("tn-12", sql).message, /underfrågan efter = ger mer än en rad/);
  const inList = checkScalarSubqueries("SELECT s.StudentNo, (SELECT h.Grade FROM HasStudied AS h WHERE h.StudentNo = s.StudentNo) FROM Student AS s;", onExam);
  assert.match(inList.message, /underfrågan i SELECT ger mer än en rad/);
  // Ett värde per rad, och rader som de andra villkoren tar bort, prövas inte.
  correct(exam("tn-12", task("tn-12").solution));
  correct(exam("tn-34", task("tn-34").solution));
  correct(exam("tn-01", `SELECT s.StudentNo, s.Name, (SELECT COUNT(*) FROM HasStudied AS h WHERE h.StudentNo = s.StudentNo) FROM Student AS s WHERE s.StudentNo IN (SELECT StudentNo FROM HasStudied);`));
  const many = "(SELECT h.Grade FROM HasStudied AS h WHERE h.StudentNo = s.StudentNo)";
  assert.equal(checkScalarSubqueries(`SELECT s.Name FROM Student AS s WHERE s.StudentNo = 'S7' AND s.Age > ${many};`, onExam), null, "S7 har en rad");
  assert.equal(checkScalarSubqueries(`SELECT s.Name FROM Student AS s WHERE s.Age > CASE WHEN s.StudentNo = 'S7' THEN ${many} END;`, onExam), null, "CASE kan hoppa över den");
  assert.equal(checkScalarSubqueries(`SELECT s.Name FROM Student AS s WHERE s.StudentNo IN (SELECT h2.StudentNo FROM HasStudied AS h2 WHERE h2.Grade > ${many});`, onExam), null);
});

test("14: SELECT DISTINCT sorterat på något som inte står i SELECT", async () => {
  stopped(await practice("sql-04", "SELECT DISTINCT EmpName FROM Employee ORDER BY EmpSalary;"), "ORDER BY items must appear in the select list if SELECT DISTINCT is specified.");
  correct(await practice("sql-04", "SELECT DISTINCT EmpName FROM Employee ORDER BY EmpName;"));
  correct(await practice("sql-04", "SELECT DISTINCT EmpName AS Namn FROM Employee ORDER BY Namn DESC;"));
  correct(await practice("sql-04", "SELECT DISTINCT e.EmpName FROM Employee AS e ORDER BY EmpName;"));
});

test("15: division med noll", async () => {
  stopped(await practice("sql-02", "SELECT EmpName FROM Employee WHERE EmpSalary / 0 IS NULL;"), "Divide by zero error encountered.");
  assert.match(checkDivisionByZero("SELECT EmpName, EmpSalary / 0 FROM Employee;", onHospital).message, /du delar med 0\./);
  const expression = checkDivisionByZero("SELECT Code, 10 / (Credits - 5) FROM Course;", onExam);
  assert.match(expression.message, /du delar med \(Credits - 5\), som är 0 för minst en rad.*NULLIF/);
  assert.ok(checkDivisionByZero("SELECT Code FROM HasStudied GROUP BY Code HAVING SUM(Grade % 0) > 1;", onExam), "inuti ett aggregat räknas varje rad");
  assert.ok(checkDivisionByZero("SELECT COUNT(*) / 0 FROM Course;", onExam));
  // En nämnare som aldrig är 0 på de rader som räknas.
  correct(await practice("sql-33", "SELECT EmpName AS Namn, EmpSalary AS Lon, EmpSalary / 12 AS Manadslon FROM Employee;"));
  assert.equal(checkDivisionByZero("SELECT Code, 10 / NULLIF(Credits - 5, 0) FROM Course;", onExam), null);
  assert.equal(checkDivisionByZero("SELECT Code FROM Course WHERE Credits <> 5 AND 10 / (Credits - 5) > 0;", onExam), null);
  assert.equal(checkDivisionByZero("SELECT CASE WHEN Credits = 5 THEN 0 ELSE 10 / (Credits - 5) END FROM Course;", onExam), null);
});

test("16: ett eget värde i en IDENTITY-kolumn", async () => {
  const result = await practice("sql-29", "INSERT INTO Unit (UnitID, UnitNo, UnitName, UnitAddress) VALUES (4, 'U4', 'Radiology', 'Care road');");
  stopped(result, "Cannot insert explicit value for identity column in table 'Unit' when IDENTITY_INSERT is set to OFF.");
  assert.match(result.message, /UnitID är en IDENTITY-kolumn/);
  const all = await practice("sql-29", "INSERT INTO Unit VALUES (4, 'U4', 'Radiology', 'Care road');");
  stopped(all, "Column name or number of supplied values does not match table definition.");
  assert.match(all.message, /INSERT INTO Unit \(UnitNo, UnitName, UnitAddress\) VALUES/);
  const copy = sqlExercises.find((item) => item.id === "sql-45").solution.replace("(PatientNo, PatientName) SELECT PatientNo", "(PatientCopyID, PatientNo, PatientName) SELECT PatientID, PatientNo");
  stopped(await practice("sql-45", copy), /identity column in table 'PatientCopy'/);
  correct(await practice("sql-29", sqlExercises.find((item) => item.id === "sql-29").solution));
  assert.equal(checkIdentityInsert("SET IDENTITY_INSERT Unit ON; INSERT INTO Unit (UnitID, UnitNo) VALUES (9, 'U9');", onHospital), null);
  assert.equal(checkIdentityInsert("INSERT INTO Examines (EmployeeID, PatientID) VALUES (1, 2);", onHospital), null, "en kopplingstabell har ingen IDENTITY");
});

test("text och tal: + slår ihop text också i tentans tabeller, och '5' + 1 är 6", () => {
  assert.equal(toSqlite("SELECT Name + ' ' + Address FROM Student"), "SELECT Name || ' ' || Address FROM Student");
  assert.deepEqual(onExam("SELECT Name + ' ' + Address FROM Student WHERE StudentNo = 'S1'").values, [["Phoebe Main street"]]);
  assert.deepEqual(onExam("SELECT c.Name + ' (' + c.Code + ')' FROM Course AS c WHERE c.Code = 'C2'").values, [["Java (C2)"]]);
  for (const table of BANK_TABLES) {
    for (const [column, type] of table.columns) {
      const text = /CHAR/.test(type);
      assert.equal(toSqlite(`SELECT ${column} + ${column} FROM ${table.name}`).includes("||"), text, `${table.name}.${column}`);
    }
  }
  assert.deepEqual(onExam("SELECT '5' + 1, 1 + '5', '5' + '1', Age + '1' FROM Student WHERE StudentNo = 'S1'").values, [[6, 6, "51", 28]]);
  assert.equal(toSqlite("SELECT CAST(Age AS VARCHAR(3)) + ' år' FROM Student"), "SELECT CAST(Age AS VARCHAR(3)) || ' år' FROM Student");
});

test("Fritt läge varnar för det SQL Server stoppar och kör ändå", () => {
  const run = (sql) => select(hospitalDb, sql);
  const cases = [
    "SELECT UnitID, COUNT(*) FROM Employee GROUP BY UnitID HAVING EmpSalary > 1000;",
    "SELECT UnitID, COUNT(*) FROM Employee GROUP BY UnitID ORDER BY EmpSalary;",
    "SELECT e.EmpName, u.UnitName FROM Employee e INNER JOIN Unit u WHERE e.UnitID = u.UnitID;",
    "SELECT EmpName AS Namn FROM Employee WHERE Namn = 'Anna';",
    "SELECT * FROM (SELECT EmpName FROM Employee) WHERE EmpName = 'Anna';",
    "SELECT EmpName FROM Employee WHERE UnitID IN (SELECT UnitID FROM Unit ORDER BY UnitName);",
    "SELECT EmpName FROM Employee ORDER BY EmpSalary DESC LIMIT 2;",
    "SELECT LicenseNo, IFNULL(EmployeeID, 0) FROM Car;",
    "SELECT EmpName, LENGTH(EmpName) FROM Employee;",
    "SELECT EmpName FROM Employee WHERE EmpNo == 'E1';",
    'SELECT EmpName FROM Employee WHERE EmpNo = "E1";',
    "SELECT EmpName FROM Employee WHERE EmpSalary;",
    "SELECT e.EmpName, (SELECT c.LicenseNo FROM Car AS c WHERE c.Brand = 'saab' AND c.Price >= e.EmpSalary) FROM Employee AS e;",
    "SELECT DISTINCT EmpName FROM Employee ORDER BY EmpSalary;",
    "SELECT EmpName, EmpSalary / 0 FROM Employee;",
    "INSERT INTO Unit (UnitID, UnitNo, UnitName) VALUES (9, 'U9', 'Test');",
    "SELECT EmpName, COUNT(*) FROM Employee;",
    "SELECT * FROM Employee WHERE EmpNo > 5;",
  ];
  for (const sql of cases) {
    const check = checkFreeQuery(sql, run);
    assert.equal(check.error, null, sql);
    assert.ok(check.warning?.raw, `ingen varning: ${sql}`);
    assert.doesNotThrow(() => hospitalDb.exec(toSqlite(sql)), `SQLite kör den: ${sql}`);
  }
  // Det övningsmotorn inte kan köra stoppas, och en giltig fråga ger ingenting.
  assert.match(checkFreeQuery("SELECT TOP 1 WITH TIES EmpName FROM Employee ORDER BY EmpSalary DESC;", run).error.message, /WITH TIES/);
  assert.deepEqual(checkFreeQuery("SELECT EmpName FROM Employee WHERE EmpNo = 'E1';", run), { error: null, warning: null });
});

// Alla reglerna som rättningen kör dem, mot en databas.
function flaggedBy(sql, db) {
  const tsql = (query) => select(db, toSqlite(query));
  return checkTsqlRules(sql) ?? checkScalarSubqueries(sql, tsql) ?? checkDivisionByZero(sql, tsql)
    ?? checkIdentityInsert(sql, tsql) ?? checkConversions(sql, (query) => select(db, query));
}

test("ingen referenslösning flaggas av någon regel", () => {
  const flagged = [];
  const check = (id, sql, db) => {
    const found = flaggedBy(sql, db);
    if (found) flagged.push(`${id}: ${found.message}\n  ${sql}`);
  };
  for (const exercise of sqlExercises) {
    const db = open(hospitalSeed);
    check(exercise.id, exercise.solution, db);
    db.close();
  }
  for (const item of sqlExamTasks) {
    const db = open(examSeed(item.tables));
    for (const sql of [item.solution, ...(item.also ?? [])]) check(item.id, sql, db);
    db.close();
  }
  const facts = collectFacts(hospitalDb, select);
  const taken = new Set(sqlExercises.map((exercise) => normalizeSql(exercise.solution)));
  let seen = 0;
  for (let round = 0; round < 600; round++) {
    const exercise = generateExercise({ db: hospitalDb, runSelect: select, facts, taken, difficulty: round % 4 });
    if (!exercise) continue;
    seen++;
    check(`slump ${round}`, exercise.solution, hospitalDb);
  }
  assert.ok(seen > 500);
  assert.deepEqual(flagged, []);
});

test("reglerna klarar halvfärdiga frågor utan att krascha", () => {
  const samples = [...sqlExercises, ...sqlExamTasks].map((item) => item.solution);
  for (const sql of samples) {
    for (let end = 0; end < sql.length; end += 5) {
      const part = sql.slice(0, end);
      checkTsqlRules(part);
      checkScalarSubqueries(part, onExam);
      checkDivisionByZero(part, onExam);
      checkIdentityInsert(part, onHospital);
    }
  }
  for (const junk of ["", ";", "(", ")", "((", "SELECT", "SELECT FROM", "SELECT * FROM (", "WITH", "JOIN", "INSERT INTO", "INSERT INTO Unit (", "a / ", "/ 0", "CASE WHEN", "LIMIT 1", "== =", "'", "--", "/*"]) {
    checkTsqlRules(junk);
    checkScalarSubqueries(junk, onExam);
    checkDivisionByZero(junk, onExam);
    checkIdentityInsert(junk, onHospital);
  }
});

// ── DATEDIFF, kolumnlistor, schemat dbo och INSERT utan kolumnlista ──────────
test("DATEDIFF och DATEPART med en datumdel som motorn inte räknar ger ett eget besked", () => {
  for (const part of ["week", "quarter", "hour", "minute", "dw", "dayofyear"]) {
    const result = checkTsqlRules(`SELECT DATEDIFF(${part}, StartDate, GETDATE()) FROM Suffers;`);
    assert.equal(result.raw, null, part);
    assert.match(result.message, /DATEDIFF och DATEPART är giltig T-SQL, men övningsmotorn räknar bara med year, month och day/);
  }
  assert.match(checkTsqlRules("SELECT DATEPART(quarter, StartDate) FROM Suffers;").message, /DATEPART/);
  // Dag, månad och år, med förkortningarna, går bra, och ett ord i en sträng stör inte.
  for (const part of ["day", "dd", "d", "month", "mm", "m", "year", "yy", "yyyy", "DAY"]) {
    assert.equal(checkTsqlRules(`SELECT DATEDIFF(${part}, StartDate, GETDATE()), DATEPART(${part}, StartDate) FROM Suffers;`), null, part);
  }
  assert.equal(checkTsqlRules("SELECT 'DATEDIFF week' FROM Suffers;"), null);
});

test("en JOIN mot en delfråga med kolumnlista har sin ON, och saknas den pekas den ut", () => {
  const ok = "SELECT e.EmpName FROM Employee AS e INNER JOIN (SELECT UnitID FROM Employee) AS t (Enhet) ON t.Enhet = e.UnitID;";
  assert.equal(checkTsqlRules(ok), null);
  assert.equal(checkTsqlRules(ok.replace("AS t (Enhet)", "t (Enhet)")), null, "utan AS");
  const missing = checkTsqlRules("SELECT e.EmpName FROM Employee AS e INNER JOIN (SELECT UnitID FROM Employee) AS t (Enhet) WHERE t.Enhet = e.UnitID;");
  assert.match(missing.message, /INNER JOIN \(SELECT UnitID FROM Employee\) AS t \(Enhet\) saknar ON/);
  // Kolumnnamnen i listan är namn i frågan, så ett alias med samma namn pekar på dem.
  assert.equal(checkTsqlRules("SELECT t.m AS m FROM (SELECT COUNT(*) FROM Student) AS t (m) WHERE m > 1;"), null);
  assert.equal(checkTsqlRules("SELECT t.m AS m FROM (SELECT COUNT(*) FROM Student) t (m) WHERE m > 1;"), null, "utan AS");
  assert.match(checkTsqlRules("SELECT t.n AS m FROM (SELECT COUNT(*) FROM Student) AS t (n) WHERE m > 1;").message, /aliaset m finns inte i WHERE/);
});

test("typkontrollen följer kolumnlistan efter ett delfrågealias", () => {
  const conv = (sql) => checkConversions(sql, (query) => select(examDb, query));
  assert.match(conv("SELECT * FROM (SELECT Code FROM HasStudied) AS t (Kod) WHERE t.Kod > 2;").message, /textkolumnen Code|text/);
  assert.equal(conv("SELECT * FROM (SELECT Code, Grade FROM HasStudied) AS t (Kod, Betyg) WHERE t.Betyg > 2;"), null);
  // Namnen sätts efter plats: Betyg är här Code, som är text.
  assert.ok(conv("SELECT * FROM (SELECT Grade, Code FROM HasStudied) t (Kod, Betyg) WHERE t.Betyg > 2;"));
  assert.equal(conv("SELECT * FROM (SELECT Grade, Code FROM HasStudied) t (Betyg, Kod) WHERE t.Betyg > 2;"), null);
});

test("de nya formerna rättas som rätt och stoppas inte av någon regel", async () => {
  correct(exam("tn-11", "SELECT StudentNo, Name, Age FROM [dbo].[Student] WHERE Age > (SELECT Age FROM Student WHERE StudentNo = 'S1') AND LEFT(Name, 1) <> '#' AND RIGHT(Name, 1) <> '#';"));
  correct(exam("tn-34", "SELECT t.s, t.c, t.g FROM (SELECT StudentNo, Code, Grade FROM HasStudied) AS t (s, c, g) WHERE t.g > (SELECT AVG(h2.Grade) FROM HasStudied AS h2 WHERE h2.Code = t.c);"));
  correct(await practice("sql-02", "SELECT EmpName FROM [dbo].[Employee];"));
  correct(await practice("sql-29", "INSERT INTO Unit VALUES ('U4', 'Radiology', 'Care road');"));
  correct(await practice("sql-29", "INSERT INTO [dbo].[Unit] VALUES ('U4', 'Radiology', 'Care road');"));
  // Med ett värde för varje kolumn står identitetskolumnen med, och SQL Server stoppar det.
  stopped(await practice("sql-29", "INSERT INTO Unit VALUES (4, 'U4', 'Radiology', 'Care road');"), "Column name or number of supplied values does not match table definition.");
  const free = (sql) => checkFreeQuery(sql, (query) => select(hospitalDb, query));
  assert.deepEqual(free("SELECT YEAR(StartDate), DATEDIFF(day, StartDate, GETDATE()), LEFT(PatientName, 1) FROM Suffers, Patient WHERE Suffers.PatientID = Patient.PatientID;"), { error: null, warning: null });
  assert.match(free("SELECT DATEDIFF(week, StartDate, GETDATE()) FROM Suffers;").error.message, /DATEDIFF/);
});

test("giltiga former flaggas inte av någon regel och går att köra", () => {
  const exam = [
    "SELECT s.StudentNo, s.Name, COUNT(h.Code) AS AntalKurser FROM Student s JOIN HasStudied h ON s.StudentNo = h.StudentNo GROUP BY s.StudentNo, s.Name HAVING COUNT(h.Code) >= 2 ORDER BY AntalKurser DESC, s.Name ASC;",
    "WITH Snitt AS (SELECT AVG(Grade) AS S FROM HasStudied WHERE Code = 'C1') SELECT s.StudentNo, s.Name FROM Student s WHERE s.StudentNo IN (SELECT StudentNo FROM HasStudied, Snitt WHERE Code = 'C1' AND Grade > Snitt.S);",
    "SELECT [s].[StudentNo], [s].[Name] FROM [dbo].[Student] AS [s] WHERE [s].[Age] > 20;",
    "SELECT DISTINCT s.StudentNo, s.Name FROM Student s INNER JOIN HasStudied h ON h.StudentNo = s.StudentNo WHERE h.Grade >= 8 ORDER BY s.Name;",
    "SELECT s.Name, CASE WHEN s.Age >= 30 THEN 'Äldre' ELSE 'Yngre' END AS Grupp FROM Student s ORDER BY Grupp;",
    "SELECT s.Name, CASE WHEN s.Age >= 30 THEN 'Äldre' ELSE 'Yngre' END Grupp FROM Student s ORDER BY Grupp;",
    "SELECT Code, COUNT(*) AS Antal FROM HasStudied GROUP BY Code HAVING COUNT(*) > (SELECT COUNT(*) FROM HasStudied WHERE Code = 'C3');",
    "SELECT s.StudentNo, s.Name, AVG(CAST(h.Grade AS DECIMAL(4,2))) AS Snitt FROM Student s, HasStudied h WHERE s.StudentNo = h.StudentNo GROUP BY s.StudentNo, s.Name;",
    "SELECT s.Name, t.Antal FROM Student AS s INNER JOIN (SELECT StudentNo, COUNT(*) AS Antal FROM HasStudied GROUP BY StudentNo) AS t ON t.StudentNo = s.StudentNo WHERE t.Antal >= 2;",
    "SELECT StudentNo FROM HasStudied WHERE Code = 'C1' INTERSECT SELECT StudentNo FROM HasStudied WHERE Code = 'C2';",
    "SELECT s.StudentNo, s.Name FROM Student s WHERE NOT EXISTS (SELECT * FROM HasStudied h WHERE h.StudentNo = s.StudentNo);",
    "SELECT s.StudentNo, s.Name, MAX(h.Grade) AS [Högsta betyg] FROM Student s JOIN HasStudied h ON h.StudentNo = s.StudentNo GROUP BY s.StudentNo, s.Name ORDER BY [Högsta betyg] DESC;",
    "SELECT c.Code, c.Name FROM Course c WHERE c.Code IN (SELECT h.Code FROM HasStudied h WHERE h.StudentNo = 'S1') AND c.Code NOT IN (SELECT h.Code FROM HasStudied h WHERE h.StudentNo = 'S2') ORDER BY c.Code;",
    "SELECT Name, Credits * 1.5 AS Poang, Credits / 5 AS Delar FROM Course WHERE Credits % 5 = 0;",
    "SELECT c.Code, (SELECT MAX(h.Grade) FROM HasStudied h WHERE h.Code = c.Code) AS Hogst FROM Course c;",
    "SELECT s.StudentNo, s.Name FROM Student s WHERE s.Age > ALL (SELECT Age FROM Student WHERE Address = 'Main street');",
    "SELECT s.Name FROM Student s WHERE s.Age = (SELECT MAX(Age) FROM Student);",
    "SELECT StudentNo, Grade, RANK() OVER (PARTITION BY Code ORDER BY Grade DESC) AS Plats FROM HasStudied;",
    "SELECT COUNT(*) AS Antal FROM Student WHERE Address LIKE '%street';",
    "SELECT s.Name + ' bor på ' + s.Address AS Text FROM Student s;",
    "-- Uppgift 4\nSELECT s.StudentNo,\n       s.Name /* namnet */\nFROM Student AS s\nWHERE s.Age > 20;",
    "SELECT h.StudentNo, SUM(c.Credits) AS Poang FROM HasStudied h JOIN Course c ON c.Code = h.Code GROUP BY h.StudentNo HAVING SUM(c.Credits) >= 20 ORDER BY SUM(c.Credits) DESC;",
    "SELECT s.StudentNo, s.Name FROM Student AS s WHERE s.StudentNo NOT IN (SELECT h.StudentNo FROM HasStudied AS h WHERE h.Grade < 6) AND s.StudentNo IN (SELECT StudentNo FROM HasStudied);",
    "SELECT Address, COUNT(*) AS Antal, AVG(Age) AS Snittalder FROM Student GROUP BY Address HAVING AVG(Age) > 25 ORDER BY Address;",
    "SELECT s.StudentNo, s.Name, COUNT(*) FROM Student s INNER JOIN HasStudied h ON s.StudentNo = h.StudentNo AND h.Grade >= 6 GROUP BY s.StudentNo, s.Name;",
    "SELECT * FROM Student WHERE Age BETWEEN 20 AND 30 AND Address <> 'Main street';",
    "SELECT s.StudentNo, s.Name, COUNT(*) AS AntalKurser FROM Student AS s INNER JOIN HasStudied AS h ON h.StudentNo = s.StudentNo WHERE s.Age > (SELECT Age FROM Student WHERE StudentNo = 'S5') GROUP BY s.StudentNo, s.Name HAVING COUNT(*) >= 2 ORDER BY COUNT(*) DESC;",
    "SELECT s.StudentNo, s.Name FROM Student s WHERE (SELECT COUNT(*) FROM HasStudied h WHERE h.StudentNo = s.StudentNo) >= 2;",
    "SELECT s.StudentNo, s.Name FROM Student s WHERE s.StudentNo = ANY (SELECT StudentNo FROM HasStudied WHERE Grade = 9);",
    "SELECT TOP 1 s.Name FROM Student s ORDER BY s.Age DESC;",
    "SELECT s.Name, h.Grade FROM Student s INNER JOIN HasStudied h ON h.StudentNo = s.StudentNo WHERE h.Grade = (SELECT MAX(h2.Grade) FROM HasStudied h2 WHERE h2.StudentNo = s.StudentNo);",
    "SELECT Code, COUNT(*) AS Antal FROM HasStudied GROUP BY Code HAVING COUNT(*) >= ALL (SELECT COUNT(*) FROM HasStudied GROUP BY Code);",
    "select s.studentno, s.name from student s where s.age > 20 order by s.name;",
    "SELECT Name, Age FROM Student WHERE Age != 27;",
    "SELECT c.Name, AVG(h.Grade * 1.0) AS Snitt FROM Course c JOIN HasStudied h ON h.Code = c.Code GROUP BY c.Name ORDER BY Snitt DESC;",
    "(SELECT Name FROM Student) EXCEPT (SELECT Name FROM Course);",
    "SELECT Name FROM Student UNION SELECT Name FROM Course ORDER BY Name;",
    "SELECT t.Nr FROM (SELECT StudentNo AS Nr FROM Student) AS t WHERE t.Nr <> 'S1' ORDER BY t.Nr;",
    "SELECT StudentNo, Code, Grade FROM HasStudied h WHERE Grade >= (SELECT AVG(Grade) FROM HasStudied WHERE Code = h.Code) ORDER BY Code, Grade DESC;",
    "SELECT 'a == b LIMIT 1 IFNULL(x)' AS Text FROM Student;",
    "SELECT Name -- LIMIT 1\nFROM Student;",
    "SELECT Name, IIF(Age > 30, 'Äldre', 'Yngre') AS Grupp, LEN(Name) AS Langd, UPPER(Name), SUBSTRING(Name, 1, 3), ISNULL(Address, '-') FROM Student;",
    "SELECT Name, CONVERT(VARCHAR(5), Age) + ' år' FROM Student;",
    "SELECT Code, STRING_AGG(StudentNo, ', ') AS Studenter FROM HasStudied GROUP BY Code;",
    // Nytt: LEFT och RIGHT, dbo, kolumnlistor.
    "SELECT LEFT(s.Name, 1) AS Bokstav, COUNT(*) AS Antal FROM Student s GROUP BY LEFT(s.Name, 1) HAVING COUNT(*) > 1 ORDER BY LEFT(s.Name, 1);",
    "SELECT s.StudentNo, RIGHT(s.StudentNo, 1) AS Nr FROM [dbo].[Student] AS s WHERE LEFT(s.Name, 1) <> '#';",
    "SELECT LEFT(Name, 1) + RIGHT(Name, 1) AS Ytterkanter FROM Student;",
    "SELECT t.Antal FROM (SELECT COUNT(*) FROM HasStudied) AS t (Antal) WHERE t.Antal > 1;",
    "SELECT s.Name, x.Antal FROM Student AS s INNER JOIN (SELECT StudentNo, COUNT(*) FROM HasStudied GROUP BY StudentNo) AS x (Nr, Antal) ON x.Nr = s.StudentNo WHERE x.Antal >= 2;",
    "SELECT t.Kod FROM (SELECT Code FROM HasStudied) t (Kod) WHERE t.Kod = 'C1';",
  ];
  const hospital = [
    "SELECT e.EmpName, u.UnitName FROM Employee e LEFT JOIN Unit u ON e.UnitID = u.UnitID ORDER BY u.UnitName, e.EmpName;",
    "SELECT e1.EmpName, e2.EmpName FROM Employee e1 JOIN Employee e2 ON e1.UnitID = e2.UnitID AND e1.EmployeeID < e2.EmployeeID;",
    "SELECT UnitID, COUNT(*) AS Antal FROM Employee GROUP BY UnitID ORDER BY Antal DESC;",
    "SELECT p.PatientName, COUNT(s.IllnessID) AS Sjukdomar FROM Patient p LEFT JOIN Suffers s ON p.PatientID = s.PatientID GROUP BY p.PatientID, p.PatientName ORDER BY Sjukdomar DESC, p.PatientName;",
    "SELECT TOP 3 EmpName, EmpSalary FROM Employee ORDER BY EmpSalary DESC;",
    "SELECT EmpName, EmpSalary FROM Employee e WHERE EmpSalary = (SELECT MAX(e2.EmpSalary) FROM Employee e2 WHERE e2.UnitID = e.UnitID);",
    "SELECT EmpName, ISNULL(EmpPhoneNumber, 'saknas') AS Telefon FROM Employee;",
    "SELECT u.UnitName, (SELECT COUNT(*) FROM Employee e WHERE e.UnitID = u.UnitID) AS Antal FROM Unit u ORDER BY Antal DESC;",
    "SELECT Brand, MAX(Price) - MIN(Price) AS Spann FROM Car GROUP BY Brand HAVING MAX(Price) - MIN(Price) > 0;",
    "SELECT EmpName AS \"Namn\" FROM Employee ORDER BY \"Namn\";",
    "SELECT EmpName Namn FROM Employee ORDER BY Namn;",
    "SELECT EmpName, EmpSalary * 100 / (SELECT SUM(EmpSalary) FROM Employee) AS Andel FROM Employee;",
    "SELECT EmpNo + '-' + EmpName AS Etikett FROM Employee;",
    "SELECT LicenseNo, Price / 1000 AS Tusen FROM Car WHERE Price % 2 = 0;",
    // Nytt: datum, LEFT och RIGHT, dbo och kolumnlistor.
    "SELECT YEAR(StartDate) AS Ar, COUNT(*) FROM Suffers GROUP BY YEAR(StartDate) ORDER BY Ar;",
    "SELECT DATEDIFF(day, StartDate, GETDATE()) AS Dagar FROM Suffers WHERE DATEDIFF(day, StartDate, GETDATE()) > 100;",
    "SELECT MONTH(StartDate), DAY(StartDate), DATEPART(year, StartDate), DATEDIFF(month, StartDate, GETDATE()), DATEDIFF(yy, StartDate, GETDATE()) FROM Suffers;",
    "SELECT CAST(YEAR(StartDate) AS VARCHAR(4)) + '-' + CAST(MONTH(StartDate) AS VARCHAR(2)) FROM Suffers;",
    "SELECT [e].[EmpName] FROM [dbo].[Employee] AS [e] WHERE [e].[EmpNo] = 'E1';",
    "SELECT t.n FROM (SELECT COUNT(*) FROM Patient) AS t (n);",
    "SELECT LEFT(EmpName, 1) + '.' AS Initial, RIGHT(EmpNo, 1) FROM Employee WHERE LEFT(EmpAddress, 2) = 'Lu';",
  ];
  const changing = [
    "UPDATE Employee SET EmpSalary = EmpSalary * 1.1 WHERE UnitID = 1;",
    "DELETE FROM Car WHERE EmployeeID IS NULL;",
    "INSERT INTO Unit (UnitNo, UnitName, UnitAddress) VALUES ('U4', 'Radiology', 'Care road'), ('U5', 'X', 'Y');",
    "INSERT INTO Employee (EmpNo, EmpName, UnitID) VALUES ('E7', 'Kim', (SELECT UnitID FROM Unit WHERE UnitNo = 'U1'));",
    "CREATE TABLE T (ID INT IDENTITY(1,1), Namn VARCHAR(20), CONSTRAINT PK_T PRIMARY KEY (ID)); INSERT INTO T (Namn) VALUES ('a'); SELECT * FROM T;",
    "CREATE VIEW Hog AS SELECT EmpName, EmpSalary FROM Employee WHERE EmpSalary > 30000;",
    "UPDATE Employee SET EmpSalary = EmpSalary + 1000 WHERE EmployeeID IN (SELECT EmployeeID FROM Examines);",
    "DELETE FROM Illness WHERE NOT EXISTS (SELECT 1 FROM Suffers s WHERE s.IllnessID = Illness.IllnessID);",
    // Nytt: INSERT utan kolumnlista i en tabell med IDENTITY, och med dbo.
    "INSERT INTO Unit VALUES ('U4', 'Radiology', 'Care road');",
    "INSERT INTO [dbo].[Unit] VALUES ('U5', 'X', 'Y'), ('U6', 'Z', 'W');",
    "INSERT INTO Employee VALUES ('E7', 'Kim', 'Lund', '777', 30000, 1);",
    "CREATE TABLE Kopia (Namn VARCHAR(20), KopiaID INTEGER IDENTITY(1,1), CONSTRAINT PK_Kopia PRIMARY KEY (KopiaID)); INSERT INTO Kopia SELECT PatientName FROM Patient;",
    "UPDATE [dbo].[Employee] SET EmpSalary = 1 WHERE EmpNo = 'E1';",
    "DELETE FROM dbo.[Car] WHERE EmployeeID IS NULL;",
  ];
  const problems = [];
  const seen = (list, db, runs) => {
    for (const sql of list) {
      const flagged = flaggedBy(sql, db);
      if (flagged) problems.push(`flaggad: ${sql}\n   ${flagged.message}`);
      try {
        runs(sql);
      } catch (error) {
        problems.push(`kör inte: ${sql}\n   ${error.message}`);
      }
    }
  };
  seen(exam, examDb, (sql) => select(examDb, toSqlite(sql)));
  seen(hospital, hospitalDb, (sql) => select(hospitalDb, toSqlite(sql)));
  for (const sql of changing) {
    const db = open(hospitalSeed);
    seen([sql], db, (statement) => db.exec(toSqlite(statement, tableInfoFrom((query) => select(db, query)))));
    db.close();
  }
  assert.deepEqual(problems, []);
});
