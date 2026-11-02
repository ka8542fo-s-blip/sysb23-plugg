// Indragen i SQL-editorn: tangenternas regler och knappen Formatera, som bara
// får röra blanktecken. `|` i testtexterna är markören.
import { test } from "node:test";
import assert from "node:assert/strict";
import initSqlJs from "sql.js";
import { afterTyped, backspace, enter, formatSql, shift } from "../src/lib/sqlIndent.js";
import { hospitalSeed } from "../src/data/databaser/hospitalSeed.js";
import { oldExams } from "../src/data/databaser/oldExams.js";
import { sqlExercises } from "../src/data/databaser/sqlExercises.js";
import { checkExercise } from "../src/lib/sqlCheck.js";
import { sqliteSeed } from "../src/lib/tsql.js";

function cursor(marked) {
  const start = marked.indexOf("|");
  const rest = marked.slice(start + 1);
  const second = rest.indexOf("|");
  if (second < 0) return { text: rest ? marked.slice(0, start) + rest : marked.slice(0, start), start, end: start };
  return { text: marked.slice(0, start) + rest.replace("|", ""), start, end: start + second };
}

function run(fn, marked) {
  const state = cursor(marked);
  const change = fn(state);
  if (!change) return marked;
  const { text } = state;
  const next = `${text.slice(0, change.from)}${change.insert}${text.slice(change.to)}`;
  if (change.selStart !== change.selEnd) {
    return `${next.slice(0, change.selStart)}|${next.slice(change.selStart, change.selEnd)}|${next.slice(change.selEnd)}`;
  }
  return `${next.slice(0, change.selStart)}|${next.slice(change.selStart)}`;
}

const pressEnter = (marked) => run(({ text, start, end }) => enter(text, start, end), marked);
const pressTab = (marked, direction = 1) => run(({ text, start, end }) => shift(text, start, end, direction), marked);
const pressBackspace = (marked) => run(({ text, start, end }) => backspace(text, start, end), marked);
// Tecknet står redan i texten; markören är direkt efter det.
const typed = (marked) =>
  run(({ text, start }) => afterTyped(text, start, text[start - 1]), marked);

test("Enter behåller indraget", () => {
  assert.equal(pressEnter("SELECT a|"), "SELECT a\n|");
  assert.equal(pressEnter("FROM a\n    JOIN b|"), "FROM a\n    JOIN b\n    |");
});

test("Enter efter ( ger ett steg extra", () => {
  assert.equal(pressEnter("WHERE a IN (|"), "WHERE a IN (\n    |");
  assert.equal(pressEnter("WHERE a IN (\n    SELECT b\n    FROM c\n    WHERE d IN (|"), "WHERE a IN (\n    SELECT b\n    FROM c\n    WHERE d IN (\n        |");
  assert.equal(pressEnter("WHERE a IN ( -- delfrågan|"), "WHERE a IN ( -- delfrågan\n    |");
});

test("Enter efter ( i en sträng eller kommentar ger inget extra steg", () => {
  assert.equal(pressEnter("-- öppna (|"), "-- öppna (\n|");
  assert.equal(pressEnter("WHERE a = '(|"), "WHERE a = '(\n|");
});

test("Enter mellan ( och ) lägger parentesen på egen rad", () => {
  assert.equal(pressEnter("WHERE a IN (|)"), "WHERE a IN (\n    |\n)");
});

test("Enter före ett satsord lägger det på sin plats", () => {
  assert.equal(pressEnter("SELECT a|   FROM b"), "SELECT a\n|FROM b");
  assert.equal(pressEnter("WHERE a = 1| AND b = 2"), "WHERE a = 1\n    |AND b = 2");
});

test("ett ord som avslutas med Enter får sin plats", () => {
  assert.equal(pressEnter("FROM a\nJOIN|"), "FROM a\n    JOIN\n    |");
});

test("JOIN hamnar ett steg in under FROM", () => {
  assert.equal(typed("FROM a\nJOIN |"), "FROM a\n    JOIN |");
  assert.equal(typed("FROM a\ninner join |"), "FROM a\n    inner join |");
  assert.equal(typed("FROM a\nLEFT JOIN |"), "FROM a\n    LEFT JOIN |");
  assert.equal(typed("FROM a\nLEFT OUTER JOIN |"), "FROM a\n    LEFT OUTER JOIN |");
  assert.equal(typed("SELECT * FROM a\nJOIN |"), "SELECT * FROM a\n    JOIN |");
  assert.equal(typed("FROM a\n    JOIN b ON c\n        JOIN |"), "FROM a\n    JOIN b ON c\n    JOIN |");
});

test("JOIN i en delfråga följer delfrågans FROM", () => {
  const before = "WHERE a IN (\n    SELECT b\n    FROM c\n    JOIN |";
  assert.equal(typed(before), "WHERE a IN (\n    SELECT b\n    FROM c\n        JOIN |");
});

test("AND och OR hamnar ett steg in under WHERE och HAVING", () => {
  assert.equal(typed("WHERE a = 1\nAND |"), "WHERE a = 1\n    AND |");
  assert.equal(typed("HAVING a = 1\nor |"), "HAVING a = 1\n    or |");
  assert.equal(typed("WHERE a = 1\nAND(|"), "WHERE a = 1\n    AND(|");
});

test("AND i ON, BETWEEN och CASE står kvar", () => {
  assert.equal(typed("FROM a\n    JOIN b ON c = d\n    AND |"), "FROM a\n    JOIN b ON c = d\n    AND |");
  assert.equal(typed("WHERE a BETWEEN 1\nAND |"), "WHERE a BETWEEN 1\nAND |");
  assert.equal(typed("WHERE CASE WHEN a = 1\nAND |"), "WHERE CASE WHEN a = 1\nAND |");
});

test("satsorden hoppar tillbaka till sin nivå", () => {
  assert.equal(typed("FROM a\n    JOIN b\n    WHERE |"), "FROM a\n    JOIN b\nWHERE |");
  assert.equal(typed("WHERE a\n    AND b\n    GROUP |"), "WHERE a\n    AND b\nGROUP |");
  assert.equal(typed("WHERE a\n    AND b\n    ORDER BY |"), "WHERE a\n    AND b\nORDER BY |");
  assert.equal(typed("WHERE a IN (\n        FROM |"), "WHERE a IN (\n    FROM |");
  assert.equal(typed("WHERE a IN (\nSELECT |"), "WHERE a IN (\n    SELECT |");
});

test("OR slår inte till på väg mot ORDER BY, och ord som bara börjar lika står kvar", () => {
  assert.equal(typed("WHERE a\n    OR|DER"), "WHERE a\n    OR|DER");
  assert.equal(typed("    FROMAGE |"), "    FROMAGE |");
  assert.equal(typed("    Andel |"), "    Andel |");
});

test(") först på en rad hoppar till öppningsradens nivå", () => {
  assert.equal(typed("WHERE a IN (\n    SELECT b\n    )|"), "WHERE a IN (\n    SELECT b\n)|");
  assert.equal(typed("WHERE a\n    AND b IN (\n        SELECT c\n        )|"), "WHERE a\n    AND b IN (\n        SELECT c\n    )|");
  assert.equal(typed("    )|"), "    )|");
  assert.equal(typed("    SELECT a)|"), "    SELECT a)|");
});

test("delfråga i två nivåer", () => {
  // Skrivs tecken för tecken ner till sista parentesen.
  const write = (marked, more) => marked.replace("|", `${more}|`);
  let text = pressEnter("SELECT a\nFROM b\nWHERE c IN (|");
  assert.equal(text.split("\n").pop(), "    |");
  text = pressEnter(write(text, "SELECT d"));
  text = pressEnter(write(text, "FROM e"));
  text = pressEnter(write(text, "WHERE f > ("));
  assert.equal(text.split("\n").pop(), "        |");
  text = pressEnter(write(text, "SELECT MAX(g)"));
  text = pressEnter(write(text, "FROM h"));
  text = typed(write(text, ")"));
  assert.equal(text.split("\n").pop(), "    )|");
  text = pressEnter(text);
  text = typed(write(text, ")"));
  assert.equal(text, "SELECT a\nFROM b\nWHERE c IN (\n    SELECT d\n    FROM e\n    WHERE f > (\n        SELECT MAX(g)\n        FROM h\n    )\n)|");
});

test("automatiken rör bara raden man står på", () => {
  const above = "SELECT a\n  FROM b\n      WHERE c\n";
  const change = afterTyped(`${above}AND `, `${above}AND `.length, " ");
  assert.ok(change.from >= above.length, "ändringen börjar på aktuell rad");
  const text = `${above}    JOIN `;
  assert.equal(afterTyped(text, text.length, " "), null);
  assert.equal(enter(above, above.length, above.length).from, above.length);
});

test("satsord i strängar och kommentarer rör ingenting", () => {
  assert.equal(typed("/* text\n    WHERE |"), "/* text\n    WHERE |");
  assert.equal(typed("SELECT 'text\n    WHERE |"), "SELECT 'text\n    WHERE |");
});

test("Tab och Shift+Tab tar ett steg", () => {
  assert.equal(pressTab("|SELECT a"), "    |SELECT a");
  assert.equal(pressTab("SELECT|"), "SELECT    |");
  assert.equal(pressTab("    |FROM a", -1), "|FROM a");
  assert.equal(pressTab("FROM a|", -1), "FROM a|");
  assert.equal(pressTab("        FROM| a", -1), "    FROM| a");
});

test("Tab och Shift+Tab på flera markerade rader", () => {
  assert.equal(pressTab("|a\n\nb|"), "    |a\n\n    b|");
  assert.equal(pressTab("    |a\n        b\nc|\nd", -1), "|a\n    b\nc|\nd");
  // En markering som slutar först på en rad tar inte med den raden.
  assert.equal(pressTab("    |a\n    b\n|    c", -1), "|a\nb\n|    c");
  assert.equal(pressTab("|a\n|b"), "    |a\n|b");
});

test("Backspace i indragsytan tar ett helt steg", () => {
  assert.equal(pressBackspace("        |a"), "    |a");
  assert.equal(pressBackspace("    |"), "|");
  assert.equal(pressBackspace("      |a"), "    |a");
});

test("Backspace utanför indragsytan gör som vanligt", () => {
  assert.equal(backspace("    a", 5, 5), null);
  assert.equal(backspace("    a b", 6, 6), null);
  assert.equal(backspace("    a", 1, 4), null);
  assert.equal(backspace("a\n", 2, 2), null);
});

test("Formatera en fråga skriven helt utan indrag", () => {
  const raw = `select s.StudentNo, COUNT(*) as Antal
from Student s
inner join HasStudied h on h.StudentNo = s.StudentNo
left join Course c on c.Code = h.Code
where s.Age > (
select AVG(Age)
from Student
where Age > 18
and Name <> 'Max'
)
and h.Grade between 5 and 8
or s.Name like 'A%'
group by s.StudentNo
having COUNT(*) >= 2
order by Antal desc;`;
  assert.equal(formatSql(raw), `select s.StudentNo, COUNT(*) as Antal
from Student s
    inner join HasStudied h on h.StudentNo = s.StudentNo
    left join Course c on c.Code = h.Code
where s.Age > (
    select AVG(Age)
    from Student
    where Age > 18
        and Name <> 'Max'
)
    and h.Grade between 5 and 8
    or s.Name like 'A%'
group by s.StudentNo
having COUNT(*) >= 2
order by Antal desc;`);
});

test("Formatera en fråga på en enda rad, med delfråga i två nivåer", () => {
  const raw = "SELECT a FROM b WHERE c IN (SELECT d FROM e WHERE f > (SELECT MAX(g) FROM h) AND i = 1) ORDER BY a;";
  assert.equal(formatSql(raw), `SELECT a
FROM b
WHERE c IN (
    SELECT d
    FROM e
    WHERE f > (
        SELECT MAX(g)
        FROM h
    )
        AND i = 1
)
ORDER BY a;`);
});

test("Formatera låter radbrytningar i en sats stå kvar", () => {
  assert.equal(
    formatSql("SELECT\ns.Id,\ns.Name\nFROM\nStudent s\nJOIN\nCourse c\nON a = b"),
    "SELECT\n    s.Id,\n    s.Name\nFROM\n    Student s\n    JOIN\n        Course c\n        ON a = b",
  );
});

test("Formatera rör inte parenteser som inte är delfrågor", () => {
  assert.equal(formatSql("SELECT COUNT(*), EXTRACT(year FROM d) FROM a WHERE b IN (1, 2) AND (c = 1 OR d = 2)"),
    "SELECT COUNT(*), EXTRACT(year FROM d)\nFROM a\nWHERE b IN (1, 2)\n    AND (c = 1 OR d = 2)");
  assert.equal(formatSql("SELECT ROW_NUMBER() OVER (PARTITION BY a ORDER BY b) FROM c"),
    "SELECT ROW_NUMBER() OVER (PARTITION BY a ORDER BY b)\nFROM c");
});

test("Formatera låter strängar och kommentarer vara som de är", () => {
  const raw = "SELECT 'a  FROM   b' -- kommentar  FROM\n, c /* WHERE   x */ FROM d WHERE e = 'it''s'";
  assert.equal(formatSql(raw), "SELECT 'a  FROM   b' -- kommentar  FROM\n    , c /* WHERE   x */\nFROM d\nWHERE e = 'it''s'");
});

test("Formatera lämnar annat än frågor orört", () => {
  const ddl = "CREATE TABLE A (\n  Id INT,\n  CONSTRAINT PK_A PRIMARY KEY (Id)\n);\nSELECT a FROM A;";
  assert.equal(formatSql(ddl), "CREATE TABLE A (\n  Id INT,\n  CONSTRAINT PK_A PRIMARY KEY (Id)\n);\nSELECT a\nFROM A;");
  const insert = "INSERT INTO A (Id) SELECT 1 FROM B";
  assert.equal(formatSql(insert), insert);
});

test("Formatera klarar halvfärdiga frågor", () => {
  assert.equal(formatSql("SELECT a FROM (SELECT b"), "SELECT a\nFROM (\n    SELECT b");
  assert.equal(formatSql("SELECT a) FROM b"), "SELECT a)\nFROM b");
  assert.equal(formatSql("SELECT 'a"), "SELECT 'a");
  assert.equal(formatSql(""), "");
  assert.equal(formatSql("  \n "), "");
});

const solutions = [
  ...sqlExercises.map((exercise) => exercise.solution),
  ...oldExams.map((exam) => exam.task4.solution),
  "SELECT 'a'+'b' AS [Fult  namn], -1 - -2 FROM t WHERE a=1 AND b<>2 OR(c=3);",
  "WITH x AS (SELECT 1 AS a) SELECT a FROM x UNION ALL SELECT 2 EXCEPT SELECT 3;",
];
const code = (sql) => sql.replace(/'(?:[^']|'')*'|\s+/g, (hit) => (hit[0] === "'" ? hit : ""));

test("Formatera ändrar bara blanktecken och ger samma resultat en andra gång", () => {
  for (const sql of solutions) {
    const once = formatSql(sql);
    assert.equal(code(once), code(sql), sql);
    assert.equal(formatSql(once), once, sql);
    const flat = sql.replace(/\s+/g, " ");
    assert.equal(formatSql(formatSql(flat)), formatSql(flat), sql);
    assert.equal(code(formatSql(flat)), code(sql), sql);
    for (const line of once.split("\n")) {
      assert.equal(/^ */.exec(line)[0].length % 4, 0, `${sql}\n${line}`);
      assert.equal(line, line.trimEnd());
    }
  }
});

test("tentafacit behåller sin form", () => {
  for (const exam of oldExams) {
    const lines = formatSql(exam.task4.solution).split("\n");
    assert.equal(lines[0], "SELECT");
    assert.ok(lines.includes("FROM"));
    assert.ok(lines.some((line) => line.startsWith("    INNER JOIN HasStudied AS h ON ")));
  }
});

test("Formatera påverkar inte rättningen", async () => {
  const SQL = await initSqlJs();
  const engine = {
    newDatabase: async () => {
      const db = new SQL.Database();
      db.run(sqliteSeed(hospitalSeed));
      return db;
    },
    runSelect(db, sql) {
      const stmt = db.prepare(sql);
      try {
        const values = [];
        while (stmt.step()) values.push(stmt.get());
        return { columns: stmt.getColumnNames(), values };
      } finally {
        stmt.free();
      }
    },
    runScript: (db, sql) => db.run(sql),
  };
  for (const exercise of sqlExercises) {
    const plain = await checkExercise({ exercise, userSql: exercise.solution, engine });
    const flat = exercise.solution.replace(/\s+/g, " ");
    const formatted = await checkExercise({ exercise, userSql: formatSql(flat), engine });
    assert.equal(formatted.status, plain.status, exercise.id);
    assert.equal(formatted.reason, plain.reason, exercise.id);
  }
});
