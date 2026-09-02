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
