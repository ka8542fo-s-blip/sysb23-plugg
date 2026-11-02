// Läget Tentanivå: varje fråga ska gå att lösa med sitt facit, och de vanliga
// felen ska inte gå igenom. Det är provet på att tabellerna skiljer rätt
// fråga från fel: fungerar facit men inte fällorna säger inte frågan något.
import { test } from "node:test";
import assert from "node:assert/strict";
import initSqlJs from "sql.js";
import { BANK_CONTROL, BANK_TABLES, examSections, sqlExamTasks } from "../src/data/databaser/sqlExamBank.js";
import { gradeTask4 } from "../src/lib/examGrade.js";
import { compareResults } from "../src/lib/sqlCheck.js";
import { integerAvg } from "../src/lib/tsql.js";

const SQL = await initSqlJs();
const bank = sqlExamTasks.filter((task) => !task.id.startsWith("sql-tenta:"));

test("frågorna är unika och hör till en sektion", () => {
  const ids = sqlExamTasks.map((task) => task.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(new Set(sqlExamTasks.map((task) => task.ask)).size, ids.length);
  const sections = new Set(examSections.map((section) => section.id));
  for (const task of sqlExamTasks) assert.ok(sections.has(task.section), task.id);
});

test("varje fråga har ledtråd, förklaring och minst en fälla", () => {
  for (const task of bank) {
    assert.ok(task.hint?.length > 15, `${task.id}: ledtråd`);
    assert.ok(task.explanation?.length > 20, `${task.id}: förklaring`);
    assert.ok(task.traps?.length > 0, `${task.id}: fällor`);
    assert.equal(task.reviewed, false, task.id);
  }
});

test("tabellerna har tentans rader först", () => {
  const exam = sqlExamTasks.find((task) => task.id === "sql-tenta:tenta-250916").tables;
  for (const table of exam) {
    const own = BANK_TABLES.find((t) => t.name === table.name);
    assert.deepEqual(own.columns, table.columns);
    assert.deepEqual(own.rows.slice(0, table.rows.length), table.rows, table.name);
  }
});

test("kontrolldatan har samma nycklar men andra värden", () => {
  for (const table of BANK_CONTROL.tables) {
    const own = BANK_TABLES.find((t) => t.name === table.name);
    assert.deepEqual(table.columns, own.columns);
    assert.notDeepEqual(table.rows, own.rows, table.name);
  }
});

test("facit går igenom och ger rader", () => {
  for (const task of bank) {
    const result = gradeTask4(SQL, task, task.solution);
    assert.equal(result.status, "correct", `${task.id}: ${result.message}`);
    assert.ok(result.user.values.length > 0, `${task.id}: tomt resultat`);
    assert.ok(!result.user.values.some((row) => row.some((cell) => cell === null)), `${task.id}: NULL i resultatet`);
  }
});

test("andra rätta svar går igenom", () => {
  for (const task of bank) {
    for (const sql of task.also ?? []) {
      const result = gradeTask4(SQL, task, sql);
      assert.equal(result.status, "correct", `${task.id}: ${result.message}\n${sql}`);
    }
  }
});

test("fällorna går inte igenom", () => {
  for (const task of bank) {
    for (const [sql, why] of task.traps) {
      const result = gradeTask4(SQL, task, sql);
      assert.notEqual(result.status, "correct", `${task.id} (${why}) gick igenom:\n${sql}`);
    }
  }
});

test("SQL Servers heltalssnitt och decimalsnitt väljer samma rader", () => {
  // Annars skulle frågan bero på en skillnad som inte är vad den tränar.
  for (const task of bank) {
    if (!/AVG\(/.test(task.solution)) continue;
    const graded = gradeTask4(SQL, task, task.solution);
    const keys = (rows) => rows.values.map((row) => row[0]).sort();
    assert.deepEqual(keys(graded.user), keys(graded.sqlite), task.id);
  }
});

test("AVG över en kolumn räknas i heltal, CAST ger decimaler", () => {
  assert.equal(integerAvg("SELECT AVG(h.Grade) FROM h"), "SELECT (SUM(h.Grade) / COUNT(h.Grade)) FROM h");
  assert.equal(integerAvg("SELECT AVG(Grade * 1.0) FROM h"), "SELECT AVG(Grade * 1.0) FROM h");
  assert.equal(integerAvg("SELECT 'AVG(x)' FROM h"), "SELECT 'AVG(x)' FROM h");
  const task = sqlExamTasks.find((item) => item.id === "tn-02");
  const plain = gradeTask4(SQL, task, "SELECT c.Code, c.Name, AVG(h.Grade) FROM Course AS c INNER JOIN HasStudied AS h ON h.Code = c.Code GROUP BY c.Code, c.Name;");
  assert.deepEqual(plain.user.columns, ["Code", "Name", "(No column name)"]);
  assert.deepEqual(plain.user.values.map((row) => row[2]), [8, 7, 7, 6]);
});

test("en underfråga som ger flera rader stoppas som i SQL Server", () => {
  const task = sqlExamTasks.find((item) => item.id === "tn-11");
  const result = gradeTask4(SQL, task, "SELECT StudentNo, Name, Age FROM Student WHERE Age > (SELECT Age FROM Student WHERE Address = 'Main street');");
  assert.equal(result.status, "error");
  assert.match(result.raw, /more than 1 value/);
  assert.match(result.message, /3 rader/);
  // IN får ge flera rader, och en korrelerad underfråga prövas inte för sig.
  assert.equal(gradeTask4(SQL, task, "SELECT StudentNo, Name, Age FROM Student WHERE Age IN (SELECT Age FROM Student WHERE Age > 27);").status, "wrong");
});

test("tvetydigt Name förklaras", () => {
  const task = sqlExamTasks.find((item) => item.id === "tn-05");
  const result = gradeTask4(SQL, task, "SELECT Name FROM HasStudied AS h INNER JOIN Student AS s ON s.StudentNo = h.StudentNo INNER JOIN Course AS c ON c.Code = h.Code;");
  assert.equal(result.status, "error");
  assert.match(result.message, /finns i flera av tabellerna/);
});

const SH = "FROM Student AS s INNER JOIN HasStudied AS h ON h.StudentNo = s.StudentNo";
const CH = "FROM Course AS c INNER JOIN HasStudied AS h ON h.Code = c.Code";
const three = "FROM HasStudied AS h INNER JOIN Student AS s ON s.StudentNo = h.StudentNo INNER JOIN Course AS c ON c.Code = h.Code";

test("giltiga svar i andra former än facit går igenom", () => {
  const answers = [
    ["tn-01", `SELECT s.StudentNo, s.Name, (SELECT COUNT(*) FROM HasStudied AS h WHERE h.StudentNo = s.StudentNo) FROM Student AS s WHERE s.StudentNo IN (SELECT StudentNo FROM HasStudied);`],
    ["tn-01", `SELECT s.Name, s.StudentNo, COUNT(*) ${SH} GROUP BY s.StudentNo, s.Name;`],
    ["tn-01", `SELECT s.StudentNo, s.Name, COUNT_BIG(*) ${SH} GROUP BY s.StudentNo, s.Name;`],
    ["tn-02", `SELECT c.Code, c.Name, ROUND(AVG(h.Grade * 1.0), 2) ${CH} GROUP BY c.Code, c.Name;`],
    ["tn-02", `SELECT c.Code, c.Name, AVG(CONVERT(DECIMAL(5, 2), h.Grade)) ${CH} GROUP BY c.Code, c.Name;`],
    ["tn-03", `SELECT s.StudentNo, s.Name, MAX(h.Grade) Högsta ${SH} GROUP BY s.StudentNo, s.Name;`],
    ["tn-06", `SELECT s.StudentNo, s.Name, COUNT(*) AS Count ${SH} GROUP BY s.StudentNo, s.Name HAVING COUNT(*) >= 3;`],
    ["tn-07", `SELECT c.Code, c.Name, AVG(h.Grade) AS Grade ${CH} GROUP BY c.Code, c.Name HAVING AVG(h.Grade) >= 7;`],
    ["tn-07", `SELECT c.Code, c.Name, AVG(CAST(h.Grade AS DECIMAL(5, 2))) ${CH} GROUP BY c.Code, c.Name HAVING AVG(CAST(h.Grade AS DECIMAL(5, 2))) >= 7;`],
    ["tn-11", "SELECT StudentNo, Name, Age FROM dbo.Student WHERE Age > (SELECT Age FROM dbo.Student WHERE StudentNo = N'S1');"],
    ["tn-11", "SELECT StudentNo, Name, Age FROM Student WHERE Age > (SELECT Age FROM Student WHERE StudentNo = 'S1');\nGO"],
    ["tn-17", `SELECT c.Code, c.Name, MAX(h.Grade) ${CH} GROUP BY c.Code, c.Name HAVING MAX(h.Grade) < ANY (SELECT Grade FROM HasStudied WHERE Code = 'C1');`],
    ["tn-18", `(SELECT c.Code, c.Name ${CH} WHERE h.StudentNo = 'S1') EXCEPT (SELECT c.Code, c.Name ${CH} WHERE h.StudentNo = 'S2');`],
    ["tn-20", "SELECT StudentNo, Name, Age FROM Student WHERE StudentNo <> ALL (SELECT StudentNo FROM HasStudied);"],
    ["tn-30", `SELECT s.StudentNo, s.Name, c.Name ${three} WHERE h.Code = 'C1' AND h.Grade = (SELECT TOP 1 Grade FROM HasStudied WHERE Code = 'C1' ORDER BY Grade DESC);`],
    ["tn-34", "SELECT h.StudentNo, h.Code, h.Grade FROM HasStudied AS h WHERE h.Grade > ALL (SELECT 0 + AVG(h2.Grade) FROM HasStudied AS h2 WHERE h2.Code = h.Code);"],
    ["tn-34", "SELECT StudentNo, Code, Grade FROM (SELECT StudentNo, Code, Grade, AVG(Grade) OVER (PARTITION BY Code) AS Snitt FROM HasStudied) AS t WHERE Grade > Snitt;"],
    ["tn-37", `(SELECT s.StudentNo, s.Name ${SH} WHERE h.Code = 'C1' EXCEPT SELECT s.StudentNo, s.Name ${SH} WHERE h.Code = 'C2') UNION (SELECT s.StudentNo, s.Name ${SH} WHERE h.Code = 'C2' EXCEPT SELECT s.StudentNo, s.Name ${SH} WHERE h.Code = 'C1');`],
  ];
  for (const [id, sql] of answers) {
    const result = gradeTask4(SQL, sqlExamTasks.find((task) => task.id === id), sql);
    assert.equal(result.status, "correct", `${id}: ${result.message}\n${sql}`);
  }
});

test("det motorn inte kan köra säger den, utan att det ser ut som ett stavfel", () => {
  const ties = gradeTask4(SQL, sqlExamTasks.find((task) => task.id === "tn-30"), `SELECT TOP 1 WITH TIES s.StudentNo, s.Name, c.Name ${three} WHERE h.Code = 'C1' ORDER BY h.Grade DESC;`);
  assert.match(ties.message, /WITH TIES är giltig T-SQL/);
  const alias = gradeTask4(SQL, sqlExamTasks.find((task) => task.id === "tn-06"), `SELECT s.StudentNo, s.Name, Antal = COUNT(*) ${SH} GROUP BY s.StudentNo, s.Name HAVING COUNT(*) >= 3;`);
  assert.match(alias.message, /AS Antal/);
});

test("avrundade decimaler godtas, men inte ett annat värde", () => {
  const close = { columns: ["a"], values: [[6.67]] };
  const exact = { columns: ["a"], values: [[20 / 3]] };
  assert.equal(compareResults(close, exact).ok, true);
  assert.equal(compareResults({ columns: ["a"], values: [[6.8]] }, exact).ok, false);
  assert.equal(compareResults({ columns: ["a"], values: [[6]] }, { columns: ["a"], values: [[7]] }).ok, false);
  assert.equal(compareResults({ columns: ["a"], values: [[7]] }, { columns: ["a"], values: [[7]] }).ok, true);
});
