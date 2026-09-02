// Låser generatorn för slumpövningar: varje uppgift den släpper fram ska
// vara lösbar, ha ett svar och rättas som rätt av samma motor som appen
// använder. Går något sönder ska det synas här, inte hos den som pluggar.
import { test } from "node:test";
import assert from "node:assert/strict";
import initSqlJs from "sql.js";
import { hospitalSeed } from "../src/data/databaser/hospitalSeed.js";
import { sqlExercises } from "../src/data/databaser/sqlExercises.js";
import { checkExercise } from "../src/lib/sqlCheck.js";
import { FAMILY_IDS, buildCandidate } from "../src/lib/sqlGenerator.js";
import {
  collectFacts,
  generateExercise,
  normalizeSql,
  validateCandidate,
} from "../src/lib/sqlPractice.js";

const SQL = await initSqlJs();
const fresh = () => {
  const db = new SQL.Database();
  db.run(hospitalSeed);
  return db;
};
const runSelect = (db, sql) => {
  const stmt = db.prepare(sql);
  try {
    const values = [];
    while (stmt.step()) values.push(stmt.get());
    return { columns: stmt.getColumnNames(), values };
  } finally {
    stmt.free();
  }
};
const engine = { newDatabase: async () => fresh(), runSelect, runScript: (db, sql) => db.run(sql) };

const db = fresh();
const facts = collectFacts(db, runSelect);
const taken = new Set(sqlExercises.map((exercise) => normalizeSql(exercise.solution)));

function generateMany(count, difficulty = 0) {
  const made = [];
  for (let i = 0; i < count; i++) {
    const exercise = generateExercise({
      db,
      runSelect,
      facts,
      taken,
      difficulty,
      seed: i * 7919 + difficulty * 104729 + 13,
    });
    if (exercise) made.push(exercise);
  }
  return made;
}

test("collectFacts läser verkliga värden ur databasen", () => {
  assert.equal(facts.counts.Employee, 6);
  assert.ok(facts.values["Employee.EmpAddress"].includes("Lund"));
  assert.ok(facts.numbers["Car.Price"].length > 0);
  // Sorterade tal krävs för att BETWEEN-gränserna ska bli vettiga.
  const prices = facts.numbers["Car.Price"];
  assert.deepEqual(prices, [...prices].sort((a, b) => a - b));
  // Begynnelsebokstäver som täcker hela tabellen ska inte erbjudas.
  assert.ok(facts.initials["Patient.PatientName"].length > 0);
});

test("alla 200 genererade övningar rättas som rätt av motorn", async () => {
  const made = generateMany(200);
  assert.ok(made.length >= 190, `bara ${made.length} av 200 gick att generera`);
  for (const exercise of made) {
    const outcome = await checkExercise({ exercise, userSql: exercise.solution, engine });
    assert.equal(
      outcome.status,
      "correct",
      `${exercise.id} (${exercise.family}): ${outcome.message || outcome.raw}\n${exercise.solution}`,
    );
  }
});

test("uppgifterna är kompletta och läsbara", () => {
  for (const exercise of generateMany(120)) {
    assert.ok(exercise.task.length > 20, `för kort uppgift: ${exercise.task}`);
    assert.match(exercise.task, /[.?]$/, `uppgiften saknar avslutning: ${exercise.task}`);
    assert.ok(exercise.hint && exercise.hint.length > 10, `${exercise.id} saknar ledtråd`);
    assert.ok(exercise.tables.length > 0, `${exercise.id} saknar tabeller`);
    assert.ok([1, 2, 3].includes(exercise.difficulty));
    // Inga oersatta platshållare eller tomma listor i texten.
    assert.doesNotMatch(exercise.task, /undefined|null|\[object/i, exercise.task);
    assert.doesNotMatch(exercise.solution, /undefined|NaN/, exercise.solution);
  }
});

test("ingen slumpövning är en kopia av en kursövning", () => {
  for (const exercise of generateMany(200)) {
    assert.ok(
      !taken.has(normalizeSql(exercise.solution)),
      `${exercise.id} är identisk med en kursövning: ${exercise.solution}`,
    );
  }
});

test("svårighetsvalet styr vilka familjer som kommer fram", () => {
  for (const difficulty of [1, 2, 3]) {
    const made = generateMany(40, difficulty);
    assert.ok(made.length > 30, `nivå ${difficulty} gav bara ${made.length} övningar`);
    for (const exercise of made) assert.equal(exercise.difficulty, difficulty);
  }
});

test("alla mallfamiljer går att nå", () => {
  const seen = new Set(generateMany(400).map((exercise) => exercise.family));
  const missing = FAMILY_IDS.filter((id) => !seen.has(id));
  assert.deepEqual(missing, [], `familjer som aldrig kom fram: ${missing.join(", ")}`);
});

test("valideringen kastar tomma och degenererade kandidater", () => {
  const tomt = validateCandidate(
    { family: "filter-text", tables: ["Employee"], solution: "SELECT EmpName FROM Employee WHERE EmpAddress = 'Paris';" },
    { db, runSelect, facts, taken: new Set() },
  );
  assert.equal(tomt.ok, false);
  assert.equal(tomt.reason, "tomt resultat");

  const allt = validateCandidate(
    { family: "filter-tal", tables: ["Employee"], solution: "SELECT EmpName FROM Employee WHERE EmpSalary > 0;" },
    { db, runSelect, facts, taken: new Set() },
  );
  assert.equal(allt.ok, false);
  assert.equal(allt.reason, "filtret släpper igenom allt");

  const kopia = validateCandidate(
    { family: "projektion", tables: ["Unit"], solution: "SELECT * FROM Unit;" },
    { db, runSelect, facts, taken: new Set([normalizeSql("SELECT * FROM Unit;")]) },
  );
  assert.equal(kopia.ok, false);
});

test("samma frö ger samma övning", () => {
  const a = buildCandidate(4242, facts, 0);
  const b = buildCandidate(4242, facts, 0);
  assert.deepEqual(a, b);
});
