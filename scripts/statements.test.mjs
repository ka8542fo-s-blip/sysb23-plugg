// Tentans uppgift 1 som övning: form, andel sanna och poängregeln.
import { test } from "node:test";
import assert from "node:assert/strict";
import { statementExercises } from "../src/data/databaser/statementExercises.js";
import { DIAGRAM_IDS } from "../src/components/knowledge/diagrams/ids.js";
import { scoreStatements, MAX_POINTS } from "../src/lib/statementScore.js";

test("varje uppgift: 8–10 påståenden, under hälften sanna, känt diagram, skäl på alla", () => {
  assert.equal(new Set(statementExercises.map((e) => e.id)).size, statementExercises.length);
  for (const ex of statementExercises) {
    assert.ok(DIAGRAM_IDS.includes(ex.diagram), `${ex.id}: okänt diagram ${ex.diagram}`);
    const n = ex.statements.length;
    assert.ok(n >= 8 && n <= 10, `${ex.id}: ${n} påståenden`);
    const truths = ex.statements.filter((s) => s.truth).length;
    assert.ok(truths * 2 < n, `${ex.id}: ${truths} sanna av ${n} är inte under hälften`);
    assert.ok(truths >= 3, `${ex.id}: för få sanna`);
    for (const s of ex.statements) assert.ok(s.why && s.text && typeof s.truth === "boolean", `${ex.id}: ofullständigt påstående`);
    assert.equal(new Set(ex.statements.map((s) => s.text)).size, n, `${ex.id}: dubblett`);
  }
});

const ex = statementExercises[0];
const trueIdx = ex.statements.map((s, i) => (s.truth ? i : -1)).filter((i) => i >= 0);
const falseIdx = ex.statements.map((s, i) => (s.truth ? -1 : i)).filter((i) => i >= 0);

test("alla och endast de sanna ger 25 oavsett antal", () => {
  const r = scoreStatements(ex.statements, trueIdx);
  assert.equal(r.points, MAX_POINTS);
  assert.equal(r.status, "correct");
  assert.equal(r.exact, true);
});

test("+5 per rätt markerat, −3 per fel markerat, 0 för omarkerat", () => {
  const r = scoreStatements(ex.statements, [trueIdx[0], trueIdx[1], falseIdx[0]]);
  assert.equal(r.raw, 10 - 3);
  assert.equal(r.points, 7);
  assert.equal(r.status, "partial");
  assert.equal(r.hits, 2); assert.equal(r.falseAlarms, 1); assert.equal(r.misses, trueIdx.length - 2);
  assert.equal(r.rows[trueIdx[0]].outcome, "hit");
  assert.equal(r.rows[falseIdx[0]].outcome, "false-alarm");
  assert.equal(r.rows[trueIdx[2]].outcome, "miss");
  assert.equal(r.rows[falseIdx[1]].outcome, "correct-blank");
});

test("inget markerat ger 0, och summan golvas vid 0", () => {
  assert.equal(scoreStatements(ex.statements, []).points, 0);
  assert.equal(scoreStatements(ex.statements, []).status, "blank");
  const r = scoreStatements(ex.statements, falseIdx);
  assert.ok(r.raw < 0);
  assert.equal(r.points, 0);
});
