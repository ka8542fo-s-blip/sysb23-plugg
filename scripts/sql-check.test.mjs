// Formkraven i rättningen: rätt resultat räcker inte när uppgiften kräver
// en form — semikolon, kolumnnamn via AS eller en namngiven konstruktion.
import { test } from "node:test";
import assert from "node:assert/strict";
import initSqlJs from "sql.js";
import { hospitalSeed } from "../src/data/databaser/hospitalSeed.js";
import { sqliteSeed } from "../src/lib/tsql.js";
import { sqlExercises } from "../src/data/databaser/sqlExercises.js";
import { checkExercise } from "../src/lib/sqlCheck.js";

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
const byId = Object.fromEntries(sqlExercises.map((e) => [e.id, e]));
const run = (exercise, userSql) => checkExercise({ exercise, userSql, engine });

test("saknat semikolon ger nästan, inte rätt", async () => {
  const utan = await run(byId["sql-02"], "SELECT EmpName FROM Employee");
  assert.equal(utan.status, "wrong");
  assert.equal(utan.reason, "semicolon");
  // Tabellerna följer med så att man ser att resultatet i sig stämde.
  assert.equal(utan.userResult.values.length, 6);

  const med = await run(byId["sql-02"], "SELECT EmpName FROM Employee;");
  assert.equal(med.status, "correct");

  // Kommentar efter semikolonet är fortfarande en avslutad sats.
  const kommentar = await run(byId["sql-02"], "SELECT EmpName FROM Employee; -- klart");
  assert.equal(kommentar.status, "correct");
});

test("semikolonkravet gäller även DML med flera satser", async () => {
  const utan = await run(byId["sql-45"], byId["sql-45"].solution.replace(/;\s*$/, ""));
  assert.equal(utan.reason, "semicolon");
  const med = await run(byId["sql-45"], byId["sql-45"].solution);
  assert.equal(med.status, "correct");
});

test("kolumnnamn krävs där uppgiften säger 'som X'", async () => {
  const utanAlias = await run(byId["sql-33"], "SELECT EmpName, EmpSalary, EmpSalary / 12 FROM Employee;");
  assert.equal(utanAlias.status, "wrong");
  assert.equal(utanAlias.reason, "names");
  assert.match(utanAlias.message, /Namn, Lon, Manadslon/);

  // Skiftläge i aliaset ska inte fälla — SQL är inte skiftlägeskänsligt.
  const annatSkiftlage = await run(byId["sql-33"], "SELECT EmpName AS namn, EmpSalary AS lon, EmpSalary / 12 AS manadslon FROM Employee;");
  assert.equal(annatSkiftlage.status, "correct");
});

test("namngiven konstruktion krävs där uppgiften säger 'med IN/EXISTS/JOIN'", async () => {
  // sql-49 kräver EXISTS — en IN-lösning ger samma rader men fel form.
  const medIn = await run(byId["sql-49"], "SELECT PatientNo, PatientName FROM Patient WHERE PatientID IN (SELECT PatientID FROM Examines);");
  assert.equal(medIn.status, "wrong");
  assert.equal(medIn.reason, "requires");
  assert.match(medIn.message, /EXISTS/);
  assert.equal((await run(byId["sql-49"], byId["sql-49"].solution)).status, "correct");

  // sql-48 kräver IN — och 'IN' får inte råka matcha INNER JOIN.
  const medJoin = await run(byId["sql-48"], "SELECT DISTINCT p.PatientNo, p.PatientName FROM Patient p INNER JOIN Examines x ON p.PatientID = x.PatientID;");
  assert.equal(medJoin.reason, "requires");
  assert.equal((await run(byId["sql-48"], byId["sql-48"].solution)).status, "correct");

  // sql-43 kräver RIGHT JOIN — omskrivet som LEFT JOIN nekas.
  const medLeft = await run(byId["sql-43"], "SELECT c.LicenseNo, e.EmpName FROM Employee e LEFT JOIN Car c ON c.EmployeeID = e.EmployeeID;");
  assert.equal(medLeft.reason, "requires");
});

test("fel resultat rapporteras före formfel", async () => {
  // Både fel rader och saknat semikolon: resultatfelet är det som visas.
  const bada = await run(byId["sql-02"], "SELECT EmpName FROM Employee WHERE EmpSalary > 100000");
  assert.equal(bada.status, "wrong");
  assert.equal(bada.reason, "rows");
});

test("alla 53 kurslösningar uppfyller sina egna formkrav", async () => {
  for (const exercise of sqlExercises) {
    const outcome = await run(exercise, exercise.solution);
    assert.equal(outcome.status, "correct", `${exercise.id}: ${outcome.reason} ${outcome.message}`);
  }
});
