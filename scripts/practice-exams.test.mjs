// Fliken Tenta: de egna övningstentorna (5 × 20 p). Facit ska klara sin egen
// rättning med full poäng, uppgift 1 ska ha exakt fyra sanna påståenden,
// 3a–e avgörs av FD-motorn (testet säger vad den ska komma fram till), och
// facitfrågan i uppgift 4 ska skilja sig från vanliga felvarianter.
import { test } from "node:test";
import assert from "node:assert/strict";
import initSqlJs from "sql.js";
import { practiceExams, PRACTICE_POINTS } from "../src/data/databaser/practiceExams.js";
import { scoreStatements } from "../src/lib/statementScore.js";
import { checkDdl, toDdl } from "../src/lib/ddlCheck.js";
import { gradeAnswer } from "../src/lib/fdGrade.js";
import { highestNF, NF_NAME, attrsOf, isLossless, dependencyReport, relationNF } from "../src/lib/fd.js";
import { checkJava } from "../src/lib/javaCheck.js";
import {
  claimTruth, scoreTask3ae, gradeTask4, scoreDdlShare, scoreJavaShare, scorePractice3f, scorePractice3g,
} from "../src/lib/examGrade.js";
import { MODEL_FIGURE_IDS } from "../src/components/model/modelFigureIds.js";
import { oldExams } from "../src/data/databaser/oldExams.js";

const SQL = await initSqlJs();
const byId = Object.fromEntries(practiceExams.map((e) => [e.id, e]));

test("övningstentor: fem uppgifter à 20 p, egna id, registrerade diagram", () => {
  assert.deepEqual(practiceExams.map((e) => e.id), ["ovningstenta-1"]);
  assert.deepEqual(Object.values(PRACTICE_POINTS), [20, 20, 20, 20, 20]);
  for (const e of practiceExams) {
    assert.ok(!oldExams.some((o) => o.id === e.id), e.id);
    for (const d of [e.task1.diagram, e.task2.diagram]) assert.ok(MODEL_FIGURE_IDS.includes(d), `${e.id}: ${d}`);
  }
});

// ---------- Uppgift 1 ----------

const SANNA = { "ovningstenta-1": [2, 4, 7, 9] };

test("uppgift 1: tio påståenden, exakt fyra sanna, skäl till varje", () => {
  for (const e of practiceExams) {
    assert.equal(e.task1.statements.length, 10, e.id);
    const sanna = e.task1.statements.map((s, i) => (s.truth ? i + 1 : null)).filter(Boolean);
    assert.deepEqual(sanna, SANNA[e.id], e.id);
    for (const s of e.task1.statements) assert.ok(s.why.length > 20, s.text);
  }
});

test("uppgift 1: +5/−3, golv 0, max 20", () => {
  const sts = byId["ovningstenta-1"].task1.statements;
  const truthIdx = sts.map((s, i) => (s.truth ? i : null)).filter((i) => i !== null);
  const falseIdx = sts.map((s, i) => (s.truth ? null : i)).filter((i) => i !== null);
  assert.equal(scoreStatements(sts, truthIdx, 20).points, 20);
  assert.equal(scoreStatements(sts, [truthIdx[0]], 20).points, 5);
  assert.equal(scoreStatements(sts, [...truthIdx, falseIdx[0]], 20).points, 17);
  assert.equal(scoreStatements(sts, falseIdx.slice(0, 3), 20).points, 0);
  assert.equal(scoreStatements(sts, [], 20).points, 0);
});

// ---------- Uppgift 2 ----------

test("uppgift 2: facit-DDL:en får full pott", () => {
  for (const e of practiceExams) {
    const result = checkDdl(toDdl(e.task2.facit), e.task2);
    assert.equal(result.status, "correct", e.id);
    assert.equal(scoreDdlShare(result, e.task2.facit).points, 20, e.id);
  }
});

test("uppgift 2: poängen är andelen uppfyllda regler, avrundad nedåt", () => {
  const t = byId["ovningstenta-1"].task2;
  const facit = toDdl(t.facit);
  // Utan Telefon-tabellen: dess fyra regler (PK, kolumn, FK och NULL-regel) faller.
  const missing = facit.replace(/CREATE TABLE Telefon \([\s\S]*?\);\n\n/, "");
  const r = scoreDdlShare(checkDdl(missing, t), t.facit);
  assert.equal(r.total, 33);
  assert.equal(r.passed, 29);
  assert.equal(r.points, Math.floor((20 * 29) / 33));
  assert.equal(scoreDdlShare(checkDdl("CREATE TABLE (", t), t.facit).points, 0);
});

// ---------- Uppgift 3 ----------

const SVAR_3AE = { "ovningstenta-1": ["F", "S", "F", "F", "S"] };
const HOGSTA_NF = { "ovningstenta-1": "1NF" };

test("uppgift 3a–e: FD-motorn avgör påståendena", () => {
  for (const e of practiceExams) {
    const got = e.task3.statements.map((s) => (claimTruth(e.task3, s.claim).truth ? "S" : "F"));
    assert.deepEqual(got, SVAR_3AE[e.id], e.id);
  }
});

test("uppgift 3a–e: +2/−1/0 och golv 0 i vyn", () => {
  const t = byId["ovningstenta-1"].task3;
  const right = Object.fromEntries(t.statements.map((s, i) => [s.label, SVAR_3AE["ovningstenta-1"][i]]));
  assert.equal(scoreTask3ae(t, right).points, 10);
  const wrong = Object.fromEntries(t.statements.map((s, i) => [s.label, SVAR_3AE["ovningstenta-1"][i] === "S" ? "F" : "S"]));
  assert.equal(scoreTask3ae(t, wrong).points, -5);
  assert.equal(Math.max(0, scoreTask3ae(t, wrong).points), 0);
});

test("uppgift 3f–g: högsta normalform, facit i 3NF, förlustfritt och beroendebevarande", () => {
  for (const e of practiceExams) {
    const fg = e.task3.fg;
    assert.equal(fg.relation, e.task3.relation);
    assert.deepEqual(fg.fds, e.task3.fds);
    const R = attrsOf(fg.attrs);
    assert.equal(NF_NAME[highestNF(R, fg.fds).nf], HOGSTA_NF[e.id]);
    assert.equal(fg.nf, HOGSTA_NF[e.id]);
    if (!fg.facit) continue;
    const dec = fg.facit.map((x) => attrsOf(x.attrs));
    assert.ok(isLossless(R, fg.fds, dec), e.id);
    assert.ok(dependencyReport(R, fg.fds, dec).every((x) => x.preserved), e.id);
    for (const d of dec) assert.equal(relationNF(d, fg.fds).nf, 3, `${e.id}: ${d}`);
  }
});

test("uppgift 3f–g: facit ger 2 + självbedömning i 3f och 5 i 3g", () => {
  const fg = byId["ovningstenta-1"].task3.fg;
  const text = fg.facit.map((x) => `${x.name}(${x.attrs})\nCK₁ = {${x.pk[0]}}\nPK = CK₁`).join("\n\n");
  const draft = { cks: [["A", "B"]], roles: {}, nf: "1NF", motivation: {}, text };
  const grade = gradeAnswer(fg, draft);
  assert.equal(scorePractice3f(grade, 3).points, 5);
  assert.equal(scorePractice3f(grade, null).points, 2);
  assert.equal(scorePractice3g(grade, draft).points, 5);
  // Fel normalform: 0 i 3f utan självbedömning; en nedbrytning som tappar ett beroende ger 0 i 3g.
  const wrongNf = gradeAnswer(fg, { ...draft, nf: "2NF" });
  assert.equal(scorePractice3f(wrongNf, 0).points, 0);
  const lossy = { ...draft, text: "R1(A, B, C)\nCK₁ = {A, B}\nPK = CK₁\n\nR2(A, D, E)\nCK₁ = {A}\nPK = CK₁\n\nR3(B, F, G)\nCK₁ = {B}\nPK = CK₁" };
  assert.equal(scorePractice3g(gradeAnswer(fg, lossy), lossy).points, 0);
  assert.equal(scorePractice3f(null, 3).points, 0);
});

// ---------- Uppgift 4 ----------

test("uppgift 4: facitfrågan ger 20 och ett resultat som inte är tomt", () => {
  for (const e of practiceExams) {
    const r = gradeTask4(SQL, e.task4, e.task4.solution, 20);
    assert.equal(r.status, "correct", e.id);
    assert.equal(r.points, 20);
    assert.ok(r.user.values.length > 0, e.id);
    assert.deepEqual(r.user.values, e.task4.expected.values, e.id);
  }
});

test("uppgift 4 i tenta 1: glömd HAVING, glömt åldersvillkor, > 2 och LEFT JOIN-varianten ger 0", () => {
  const t = byId["ovningstenta-1"].task4;
  const variants = [
    t.solution.replace(/\nHAVING\n    COUNT\(\*\) >= 2;/, ";").replace("s.Name;", "s.Name;"),
    t.solution.replace("WHERE\n    s.Age > 20\n", ""),
    t.solution.replace(">= 2", "> 2"),
    t.solution.replace("INNER JOIN HasStudied", "LEFT JOIN HasStudied").replace("INNER JOIN Course", "LEFT JOIN Course").replace("COUNT(*) >= 2", "COUNT(h.Code) >= 1"),
    t.solution.replace("SUM(c.Credits)", "COUNT(*)"),
  ];
  for (const v of variants) {
    assert.notEqual(v, t.solution);
    const r = gradeTask4(SQL, t, v, 20);
    assert.equal(r.points, 0, v);
  }
});

// ---------- Uppgift 5 ----------

test("uppgift 5: facit klarar alla regler och får 20", () => {
  for (const e of practiceExams) {
    const r = checkJava(e.task5.solution, e.task5);
    assert.equal(r.status, "correct", e.id);
    assert.deepEqual(r.errors, []);
    assert.equal(scoreJavaShare(r).points, 20);
  }
});

test("uppgift 5 i tenta 1: ändrar (UPDATE), och ett svar med strängsammanfogning tappar poäng", () => {
  const t = byId["ovningstenta-1"].task5;
  assert.equal(t.check.sql.kind, "UPDATE");
  const injected = t.solution
    .replace(`"WHERE Instructor = ?;";`, `"WHERE Instructor = '" + oldInstructor + "';";`)
    .replace("        statement.setString(2, oldInstructor);\n", "");
  const r = checkJava(injected, t);
  assert.notEqual(r.status, "correct");
  assert.ok(scoreJavaShare(r).points < 20);
  assert.equal(scoreJavaShare(checkJava("", t)).points, 0);
});
