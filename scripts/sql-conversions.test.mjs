// Typkontrollen: det SQL Server stoppar, för att text inte går att göra om till
// tal, ska aldrig bli rättat som rätt. SQLite säger inget om sådant.
import { test } from "node:test";
import assert from "node:assert/strict";
import initSqlJs from "sql.js";
import { hospitalSeed } from "../src/data/databaser/hospitalSeed.js";
import { BANK_TABLES, sqlExamTasks } from "../src/data/databaser/sqlExamBank.js";
import { sqlExercises } from "../src/data/databaser/sqlExercises.js";
import { examSeed, gradeTask4 } from "../src/lib/examGrade.js";
import { checkExercise } from "../src/lib/sqlCheck.js";
import { collectFacts, generateExercise, normalizeSql } from "../src/lib/sqlPractice.js";
import { sqliteSeed } from "../src/lib/tsql.js";
import { analyzeConversions, catalogOf, checkConversions } from "../src/lib/tsqlTypes.js";

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
const examDb = open(examSeed(BANK_TABLES));
const hospitalDb = open(hospitalSeed);
const onExam = (sql) => checkConversions(sql, (query) => select(examDb, query));
const onHospital = (sql) => checkConversions(sql, (query) => select(hospitalDb, query));
const engine = { newDatabase: async () => open(hospitalSeed), runSelect: select, runScript: (db, sql) => db.run(sql) };

const flagged = (sql, why) => assert.ok(onExam(sql), `${why ?? "ska flaggas"}: ${sql}`);
const passes = (sql) => assert.equal(onExam(sql), null, sql);

test("fallet som blev godkänt: Code >= 2", () => {
  const task = sqlExamTasks.find((item) => item.id === "tn-01");
  const answer = `SELECT s.StudentNo, s.Name, COUNT(*) AS AntalKurser
FROM Student AS s
    INNER JOIN HasStudied AS h ON h.StudentNo = s.StudentNo
WHERE Code >= 2
GROUP BY s.StudentNo, s.Name;`;
  const result = gradeTask4(SQL, task, answer);
  assert.equal(result.status, "error");
  assert.equal(result.points, 0);
  assert.equal(result.raw, "Conversion failed when converting the varchar value 'C1' to data type int.");
  assert.equal(
    result.message,
    "SQL Server skulle stoppa frågan på rad 4 (Code >= 2): du jämför textkolumnen Code med talet 2. Code innehåller värden som 'C1' som inte går att göra om till tal.",
  );
});

test("testfallen i uppdraget", () => {
  flagged("SELECT * FROM HasStudied WHERE Code >= 2;");
  passes("SELECT * FROM HasStudied WHERE Grade >= 2;");
  passes("SELECT * FROM HasStudied WHERE Code = 'C1';");
  flagged("SELECT * FROM HasStudied WHERE StudentNo > 5;");
  flagged("SELECT * FROM Student WHERE Age > (SELECT Name FROM Student WHERE StudentNo = 'S1');", "delfråga som ger text");
  assert.match(onExam("SELECT * FROM Student WHERE Age > (SELECT Name FROM Student WHERE StudentNo = 'S1');").message, /delfråga som ger text.*'Phoebe'/);
});

test("alla jämförelser och all aritmetik", () => {
  for (const op of ["=", "<>", "!=", "<", ">", "<=", ">="]) flagged(`SELECT * FROM HasStudied WHERE Code ${op} 2;`);
  flagged("SELECT * FROM HasStudied WHERE Code BETWEEN 1 AND 2;");
  flagged("SELECT * FROM HasStudied WHERE Code NOT BETWEEN 1 AND 2;");
  flagged("SELECT * FROM HasStudied WHERE Code IN (1, 2);");
  flagged("SELECT * FROM HasStudied WHERE Code NOT IN (1, 2);");
  flagged("SELECT * FROM HasStudied WHERE Code IN ('C1', 2);", "talet gör om hela listan");
  flagged("SELECT * FROM Student WHERE Age IN (SELECT Code FROM HasStudied);");
  flagged("SELECT * FROM Student WHERE Age > ALL (SELECT Code FROM HasStudied);");
  for (const op of ["+", "-", "*", "/"]) {
    flagged(`SELECT Code ${op} 1 FROM HasStudied;`);
    flagged(`SELECT 1 ${op} Name FROM Student;`);
  }
  flagged("SELECT Credits + ' poäng' FROM Course;", "tal plus text är aritmetik, inte sammanslagning");
  flagged("SELECT Name + 1 + 'x' FROM Student;");
});

test("tal mot text som inte är ett tal", () => {
  flagged("SELECT * FROM HasStudied WHERE Grade = 'x';");
  flagged("SELECT * FROM HasStudied WHERE Grade <> 'bra';");
  flagged("SELECT * FROM HasStudied WHERE Grade IN (1, 'x');");
  assert.match(onExam("SELECT * FROM HasStudied WHERE Grade = 'x';").message, /talkolumnen Grade med texten 'x'\. Texten 'x' går inte/);
  passes("SELECT * FROM HasStudied WHERE Grade = '7';");
  passes("SELECT * FROM HasStudied WHERE Grade = ' 7 ';");
  assert.match(onExam("SELECT * FROM HasStudied WHERE Grade = '7.5';").message, /heltal/);
  passes("SELECT * FROM HasStudied WHERE Grade > 7.5;");
  passes("SELECT * FROM HasStudied WHERE CAST(Grade AS DECIMAL(5, 2)) = '7.5';");
  flagged("SELECT * FROM HasStudied WHERE CAST(Grade AS DECIMAL(5, 2)) = 'x';");
});

test("kolumn mot kolumn, med alias och utan", () => {
  flagged("SELECT * FROM Student AS s INNER JOIN HasStudied AS h ON h.Code = s.Age;");
  flagged("SELECT * FROM Student s, HasStudied h WHERE s.Name = h.Grade;");
  flagged("SELECT * FROM Student s INNER JOIN Course c ON s.Name = c.Credits WHERE c.Credits > 2;");
  flagged("SELECT * FROM [Student] AS [s] WHERE [s].[Name] > 5;");
  flagged("SELECT * FROM dbo.Student WHERE dbo.Student.Name > 5;");
  passes("SELECT * FROM Student AS s INNER JOIN HasStudied AS h ON h.StudentNo = s.StudentNo;");
  passes("SELECT * FROM Student s, HasStudied h WHERE s.Age = h.Grade;");
});

test("rätt kolumn väljs när namnet finns i flera tabeller", () => {
  // Code finns bara i HasStudied och Course, Name i Student och Course.
  flagged("SELECT * FROM Student AS s INNER JOIN HasStudied AS h ON h.StudentNo = s.StudentNo WHERE Code > 2;");
  passes("SELECT * FROM Student AS s WHERE s.Age > (SELECT MAX(Grade) FROM HasStudied);");
  // Den inre frågans tabell går före den yttre.
  passes("SELECT * FROM HasStudied AS h WHERE EXISTS (SELECT 1 FROM Student AS s WHERE s.Age > 20 AND s.Name = 'Max');");
  flagged("SELECT * FROM Course AS c WHERE EXISTS (SELECT 1 FROM HasStudied AS h WHERE h.Code = c.Credits);", "korrelerad");
  flagged("SELECT * FROM Student AS s WHERE EXISTS (SELECT 1 FROM HasStudied WHERE Code > s.Age);", "okvalificerad i inre");
});

test("alias i FROM, delfrågor och WITH", () => {
  flagged("SELECT * FROM (SELECT Code AS Kod, Grade FROM HasStudied) AS t WHERE t.Kod > 2;");
  flagged("SELECT * FROM (SELECT Code AS Kod FROM HasStudied) AS t WHERE Kod > 2;");
  passes("SELECT * FROM (SELECT Code AS Kod, Grade AS Betyg FROM HasStudied) AS t WHERE t.Betyg > 2;");
  flagged("WITH t AS (SELECT Code FROM HasStudied) SELECT * FROM t WHERE Code > 2;");
  flagged("WITH t (Kod) AS (SELECT Code FROM HasStudied) SELECT * FROM t WHERE Kod > 2;");
  passes("WITH t AS (SELECT COUNT(*) AS Antal FROM HasStudied) SELECT * FROM t WHERE Antal > 2;");
  passes("SELECT * FROM (SELECT * FROM HasStudied) AS t WHERE t.Grade > 2;");
});

test("en delfråga bedöms på vad den faktiskt ger", () => {
  // Inga rader: inget att göra om.
  passes("SELECT * FROM Student WHERE Age > (SELECT Name FROM Student WHERE 1 = 0);");
  // Går inte att köra för sig: kolumnens värden gäller.
  flagged("SELECT * FROM Student AS s WHERE s.Age > (SELECT h.Code FROM HasStudied AS h WHERE h.StudentNo = s.StudentNo AND h.Grade = 7);");
  // Tal ur en delfråga.
  flagged("SELECT * FROM HasStudied WHERE Code > (SELECT MAX(Grade) FROM HasStudied);");
  passes("SELECT * FROM HasStudied WHERE Grade > (SELECT AVG(Grade) FROM HasStudied WHERE Code = 'C1');");
  passes("SELECT * FROM HasStudied WHERE Code = (SELECT MIN(Code) FROM HasStudied);");
});

test("funktioner", () => {
  flagged("SELECT * FROM HasStudied WHERE UPPER(Code) > 2;");
  flagged("SELECT * FROM HasStudied WHERE MAX(Code) > 2;");
  flagged("SELECT Code, COUNT(*) FROM HasStudied GROUP BY Code HAVING MAX(Code) > 2;");
  passes("SELECT * FROM Student WHERE LEN(Name) > 3;");
  passes("SELECT Code, COUNT(*) FROM HasStudied GROUP BY Code HAVING COUNT(*) > 2;");
  passes("SELECT Code, AVG(Grade * 1.0) FROM HasStudied GROUP BY Code HAVING AVG(Grade) >= 7;");
  // Kolumnens värden säger inget om vad funktionen ger.
  passes("SELECT * FROM HasStudied WHERE SUBSTRING(Code, 2, 1) > 1;");
  passes("SELECT * FROM HasStudied WHERE LEFT(Code, 1) = 'C';");
});

test("CAST och CONVERT stoppas på samma sätt som en jämförelse", () => {
  assert.match(onExam("SELECT CAST(Code AS INT) FROM HasStudied;").message, /du gör om textkolumnen Code till tal/);
  flagged("SELECT CONVERT(INT, Code) FROM HasStudied;");
  flagged("SELECT CAST(Code AS DECIMAL(5, 2)) FROM HasStudied;");
  assert.equal(onExam("SELECT CAST(Code AS DECIMAL(5, 2)) FROM HasStudied;").raw, "Error converting data type varchar to numeric.");
  passes("SELECT CAST(Grade AS VARCHAR(5)) + ' p' FROM HasStudied;");
  passes("SELECT CAST(Age AS DECIMAL(5, 2)) FROM Student;");
  passes("SELECT CAST('7' AS INT) + 1 FROM Student;");
});

test("text som går att göra om är giltig T-SQL", () => {
  const phones = select(hospitalDb, "SELECT EmpPhoneNumber FROM Employee WHERE EmpPhoneNumber IS NOT NULL").values.flat();
  assert.ok(phones.length > 0 && phones.every((value) => /^\d+$/.test(value.trim())), "telefonnumren är bara siffror");
  assert.equal(onHospital("SELECT * FROM Employee WHERE EmpPhoneNumber = 111;"), null);
  assert.ok(onHospital("SELECT * FROM Employee WHERE EmpNo = 111;"));
  assert.equal(onHospital("SELECT * FROM Employee WHERE EmpName = 'Anna' AND EmpSalary > 100;"), null);
  assert.match(onHospital("SELECT * FROM Illness WHERE IllnessName = 1;").raw, /nvarchar value/);
});

test("satser som ändrar data", () => {
  assert.ok(onHospital("UPDATE Employee SET EmpSalary = 1 WHERE EmpNo > 5;"));
  assert.ok(onHospital("UPDATE Employee SET EmpSalary = EmpName + 1;"));
  assert.ok(onHospital("DELETE FROM Car WHERE LicenseNo > 5;"));
  assert.ok(onHospital("INSERT INTO Unit (UnitNo, UnitName) SELECT EmpNo, EmpName FROM Employee WHERE EmpNo > 5;"));
  assert.equal(onHospital("UPDATE Employee SET EmpName = 5 WHERE EmployeeID = 1;"), null, "en tilldelning gör om till kolumnens typ");
  assert.equal(onHospital("INSERT INTO Unit (UnitNo, UnitName, UnitAddress) VALUES ('U4', 'Radiology', 'Care road');"), null);
  assert.equal(onHospital("CREATE TABLE Ny (Id INT, Namn VARCHAR(5) DEFAULT 'x', CHECK (Id > 0));"), null);
});

test("raden pekas ut, också med tomma rader före, och det första felet gäller", () => {
  assert.equal(onExam("\n\nSELECT *\nFROM HasStudied\nWHERE Code >= 2;").line, 5);
  assert.equal(onExam("SELECT *\nFROM HasStudied\nWHERE Grade > 1\n  AND Code >= 2\n  AND StudentNo > 3;").line, 4);
  // I två satser, och i SELECT-listan som läses efter WHERE.
  assert.equal(onExam("SELECT 1 FROM Student;\nSELECT * FROM HasStudied WHERE Code > 2;").line, 2);
  assert.equal(onExam("SELECT Code + 1\nFROM HasStudied\nWHERE StudentNo > 3;").line, 1);
  const long = onExam("SELECT * FROM Student WHERE Age > (SELECT Name FROM Student WHERE StudentNo = 'S1' AND Address = 'Main street');");
  assert.ok(long.message.includes("…"), "långa ställen kortas");
});

test("strängar och kommentarer läses inte som kod", () => {
  passes("SELECT * FROM HasStudied WHERE Code = 'Code >= 2';");
  passes("SELECT * FROM HasStudied -- WHERE Code >= 2\nWHERE Grade > 1;");
  passes("SELECT * FROM HasStudied /* Code >= 2 */ WHERE Grade > 1;");
  passes("SELECT 'it''s' FROM Student WHERE Name = N'Max';");
});

test("okända tabeller och skrivsätt ger inget besked", () => {
  passes("SELECT * FROM FinnsInte WHERE Code >= 2;");
  passes("SELECT * FROM FinnsInte AS f, Student AS s WHERE Kolumn > 2;");
  passes("SELECT @x + 1 FROM Student;");
  passes("SELECT dbo.MinFunktion(Name) + 1 FROM Student;");
});

test("en rättad övning stoppas i Ämnen och Slump, som är samma väg", async () => {
  const exercise = sqlExercises.find((item) => item.id === "sql-02");
  const stopped = await checkExercise({ exercise, userSql: "SELECT EmpName FROM Employee WHERE EmpNo > 0;", engine });
  assert.equal(stopped.status, "error");
  assert.match(stopped.message, /textkolumnen EmpNo med talet 0/);
  assert.match(stopped.raw, /Conversion failed/);
  // Ett syntaxfel säger SQLite först.
  const broken = await checkExercise({ exercise, userSql: "SELECT EmpName FROM Employee WHERE EmpNo > ;", engine });
  assert.doesNotMatch(String(broken.message), /SQL Server skulle stoppa/);
});

test("det som ändrar data rättas mot tabellerna före ändringen", async () => {
  const exercise = sqlExercises.find((item) => item.id === "sql-31");
  const stopped = await checkExercise({ exercise, userSql: `${exercise.solution.replace(/;\s*$/, "")} AND LicenseNo > 5;`, engine });
  assert.equal(stopped.status, "error");
  assert.match(stopped.message, /textkolumnen LicenseNo/);
});

test("alla referenslösningar passerar", () => {
  const flaggedSolutions = [];
  for (const exercise of sqlExercises) {
    const hit = onHospital(exercise.solution);
    if (hit) flaggedSolutions.push(`${exercise.id}: ${hit.message}`);
  }
  for (const task of sqlExamTasks) {
    const db = open(examSeed(task.tables));
    for (const sql of [task.solution, ...(task.also ?? [])]) {
      const hit = checkConversions(sql, (query) => select(db, query));
      if (hit) flaggedSolutions.push(`${task.id}: ${hit.message}`);
    }
    db.close();
  }
  assert.deepEqual(flaggedSolutions, []);
});

test("kontrollen läser alla referenslösningar till slutet", () => {
  // Annars säger "ingen lösning flaggas" ingenting.
  const hospital = catalogOf((query) => select(hospitalDb, query));
  const exam = catalogOf((query) => select(examDb, query));
  const unread = [];
  for (const exercise of sqlExercises) analyzeConversions(exercise.solution, hospital, () => unread.push(exercise.id));
  for (const task of sqlExamTasks) {
    for (const sql of [task.solution, ...(task.also ?? []), ...(task.traps ?? []).map(([trap]) => trap)]) {
      analyzeConversions(sql, exam, () => unread.push(`${task.id}: ${sql}`));
    }
  }
  assert.deepEqual(unread, []);
});

test("slumpövningarnas lösningar passerar", () => {
  const facts = collectFacts(hospitalDb, select);
  const taken = new Set(sqlExercises.map((exercise) => normalizeSql(exercise.solution)));
  const catalog = catalogOf((query) => select(hospitalDb, query));
  let seen = 0;
  for (let round = 0; round < 600; round++) {
    const exercise = generateExercise({ db: hospitalDb, runSelect: select, facts, taken, difficulty: round % 4 });
    if (!exercise) continue;
    seen++;
    const hit = analyzeConversions(exercise.solution, catalog, () => assert.fail(`lästes inte: ${exercise.solution}`));
    assert.equal(hit, null, `${exercise.solution}\n${hit?.message}`);
  }
  assert.ok(seen > 500);
});

test("kontrollen klarar halvfärdiga frågor utan att krascha", () => {
  const catalog = catalogOf((query) => select(hospitalDb, query));
  const samples = [...sqlExercises, ...sqlExamTasks].map((item) => item.solution);
  for (const sql of samples) {
    for (let end = 0; end < sql.length; end += 7) analyzeConversions(sql.slice(0, end), catalog);
  }
  for (const junk of ["", ";", "(", ")", "((", "SELECT", "SELECT FROM", "SELECT * FROM", "SELECT * FROM (", "WITH", "WITH a AS", "UPDATE", "DELETE", "SELECT CAST(", "SELECT CASE", "SELECT a FROM b WHERE", "= = =", "'", "--", "/*"]) {
    analyzeConversions(junk, catalog);
  }
});
