// Fliken Tenta: de tre HT25-tentorna. Varje tentas facit ska klara sin egen
// rättning med full poäng, poängreglerna ska vara tentans, och 3a–e ska
// avgöras av FD-motorn (testet säger vad motorn ska komma fram till, datat
// säger det inte).
import { test } from "node:test";
import assert from "node:assert/strict";
import initSqlJs from "sql.js";
import { oldExams, TASK_POINTS, GRADE_LIMITS, gradeFor } from "../src/data/databaser/oldExams.js";
import { scoreStatements, MAX_POINTS } from "../src/lib/statementScore.js";
import { checkDdl, toDdl } from "../src/lib/ddlCheck.js";
import { gradeAnswer } from "../src/lib/fdGrade.js";
import { highestNF, NF_NAME } from "../src/lib/fd.js";
import { claimTruth, scoreTask3ae, scoreTask3fg, estimateDdl, DDL_DEDUCTIONS, gradeTask4, examSeed } from "../src/lib/examGrade.js";
import { MODEL_FIGURE_IDS } from "../src/components/model/modelFigureIds.js";

const SQL = await initSqlJs();
const byId = Object.fromEntries(oldExams.map((e) => [e.id, e]));

test("tre tentor, fyra uppgifter, 100 poäng; DDL-facit ogranskat, övrigt granskat", () => {
  assert.deepEqual(oldExams.map((e) => e.id), ["tenta-250916", "tenta-251024", "tenta-260525"]);
  assert.equal(Object.values(TASK_POINTS).reduce((a, b) => a + b, 0), 100);
  for (const e of oldExams) {
    assert.deepEqual([e.task1.reviewed, e.task2.reviewed, e.task3.reviewed, e.task4.reviewed], [true, false, true, true], e.id);
    assert.ok(MODEL_FIGURE_IDS.includes(e.task1.diagram), `${e.id}: diagram ${e.task1.diagram}`);
    assert.ok(MODEL_FIGURE_IDS.includes(e.task2.diagram), `${e.id}: diagram ${e.task2.diagram}`);
  }
});

// ---------- Uppgift 1 ----------

const SANNA = {
  "tenta-250916": [1, 2, 5, 6, 7, 11],
  "tenta-251024": [2, 4, 10, 11],
  "tenta-260525": [1, 2, 4, 5, 7, 10],
};

test("uppgift 1: sanna påståenden per tenta, 4–6 stycken som tentan säger, skäl till varje", () => {
  for (const e of oldExams) {
    const sanna = e.task1.statements.map((s, i) => (s.truth ? i + 1 : null)).filter(Boolean);
    assert.deepEqual(sanna, SANNA[e.id], e.id);
    assert.ok(sanna.length >= 4 && sanna.length <= 6, `${e.id}: ${sanna.length} sanna`);
    for (const s of e.task1.statements) assert.ok(s.why && s.why.length > 20, `${e.id}: skäl saknas för "${s.text}"`);
  }
});

test("uppgift 1: alla och endast de sanna ger 25 oavsett antal sanna, fel ger −3, golv 0", () => {
  for (const e of oldExams) {
    const truthIdx = e.task1.statements.map((s, i) => (s.truth ? i : null)).filter((i) => i !== null);
    const falseIdx = e.task1.statements.map((s, i) => (s.truth ? null : i)).filter((i) => i !== null);
    assert.equal(scoreStatements(e.task1.statements, truthIdx).points, MAX_POINTS, `${e.id}: facit ger 25`);
    assert.equal(scoreStatements(e.task1.statements, []).points, 0);
    // En sann och en falsk markerad: 5 − 3.
    assert.equal(scoreStatements(e.task1.statements, [truthIdx[0], falseIdx[0]]).points, 2);
    // Bara falska: golvet.
    assert.equal(scoreStatements(e.task1.statements, falseIdx).points, 0);
    // Alla sanna plus en falsk: inte exakt, 5n − 3, tak 25.
    const plusOne = scoreStatements(e.task1.statements, [...truthIdx, falseIdx[0]]);
    assert.equal(plusOne.points, Math.min(25, 5 * truthIdx.length - 3));
  }
  // Fyra sanna (omtentan): exakt rätt är 25, inte 20.
  const four = byId["tenta-251024"].task1.statements;
  assert.equal(scoreStatements(four, four.map((s, i) => (s.truth ? i : null)).filter((i) => i !== null)).points, 25);
});

// ---------- Uppgift 2 ----------

test("uppgift 2: varje tentas facit klarar rättaren och ger uppskattat 25", () => {
  for (const e of oldExams) {
    const ddl = toDdl(e.task2.facit);
    const result = checkDdl(ddl, e.task2);
    assert.equal(result.status, "correct", `${e.id}: ${JSON.stringify(result.tables.filter((t) => t.status !== "ok"))}`);
    assert.equal(estimateDdl(result).points, 25);
  }
});

test("uppgift 2: avdragstabellen ger väntad poäng för kända fel", () => {
  const e = byId["tenta-250916"];
  const facit = toDdl(e.task2.facit);
  const grade = (text) => estimateDdl(checkDdl(text, e.task2)).points;
  // Syntaxfel som hindrar tolkning: 0.
  assert.equal(grade("CREATE TABLE A ( AID INTEGER IDENTITY(1,1) PRIMARY KEY (AID)"), 0);
  // Flervärdestabellen C2 saknas: −5.
  const withoutC2 = facit.replace(/CREATE TABLE C2 \([\s\S]*?\);\n*/, "");
  assert.equal(grade(withoutC2), 25 - DDL_DEDUCTIONS.tabell);
  // NOT NULL saknas på B:s främmande nyckel mot A (totalt deltagande): −2.
  const nullableOwner = facit.replace(/(CREATE TABLE B \([\s\S]*?AID\s+INTEGER) NOT NULL/, "$1");
  assert.equal(grade(nullableOwner), 25 - DDL_DEDUCTIONS.notnull);
  // Kopplingstabellen R5 med egen IDENTITY: −2 (surrogat där den inte ska finnas).
  const r5Identity = facit.replace(/CREATE TABLE R5 \(\n/, "CREATE TABLE R5 (\n    R5ID INTEGER IDENTITY(1,1),\n");
  assert.equal(grade(r5Identity), 25 - DDL_DEDUCTIONS.surrogat);
  // En överflödig tabell för R4: −3.
  assert.equal(grade(`${facit}\n\nCREATE TABLE R4 (\n    CID INTEGER,\n    DID INTEGER,\n    PRIMARY KEY (CID, DID)\n);`), 25 - DDL_DEDUCTIONS.overflodig);
  // Golvet: tom men giltig kod med en enda tabell ger aldrig under 0.
  assert.equal(grade("CREATE TABLE X (\n    XID INTEGER\n);"), 0);
});

// ---------- Uppgift 3a–e ----------

const FACIT_3AE = {
  "tenta-250916": "FSSFF",
  "tenta-251024": "SSSFF",
  "tenta-260525": "SFSSF",
};

for (const e of oldExams) {
  for (const [i, s] of e.task3.statements.entries()) {
    test(`uppgift ${s.label}, ${e.title.toLowerCase()}: FD-motorn ger ${FACIT_3AE[e.id][i] === "S" ? "sant" : "falskt"}`, () => {
      const { truth, why } = claimTruth(e.task3, s.claim);
      assert.equal(truth ? "S" : "F", FACIT_3AE[e.id][i], `${e.id} ${s.label}: ${s.text}`);
      assert.ok(why.length > 20);
    });
  }
}

test("uppgift 3a–e: +2 rätt, −1 fel, 0 obesvarad; facit ger 10", () => {
  for (const e of oldExams) {
    const right = Object.fromEntries(e.task3.statements.map((s, i) => [s.label, FACIT_3AE[e.id][i]]));
    assert.equal(scoreTask3ae(e.task3, right).points, 10);
    assert.equal(scoreTask3ae(e.task3, {}).points, 0);
    const wrong = Object.fromEntries(e.task3.statements.map((s, i) => [s.label, FACIT_3AE[e.id][i] === "S" ? "F" : "S"]));
    assert.equal(scoreTask3ae(e.task3, wrong).points, -5);
  }
});

// ---------- Uppgift 3f–g ----------

// Facit som svarspanelen skulle fyllas i: CK, PA/NP, NF, en godtagbar
// motivering och nedbrytningen i föreläsningens notation.
function facitDraft(item) {
  const a = highestNF(item.attrs, item.fds);
  const roles = Object.fromEntries(item.attrs.split(", ").map((x) => [x, a.prime.includes(x) ? "PA" : "NP"]));
  const draft = { cks: a.cks, roles, nf: NF_NAME[a.nf], motivation: {}, text: "" };
  if (a.nf < 3) {
    const need = a.nf === 1 ? "partial" : "transitive";
    const v = a.violations.find((x) => x.type === need && !x.derived);
    draft.motivation = { option: `g${v.index}`, attr: v.attr, type: need };
    draft.text = item.facit.map((rel) => `${rel.name}(${rel.attrs})\nPK = {${rel.pk[0]}}`).join("\n\n");
  }
  return draft;
}

test("uppgift 3f–g: normalformen i datat stämmer med FD-motorn, och facit ger 5 av 5", () => {
  for (const e of oldExams) {
    for (const item of [e.task3.f, e.task3.g]) {
      assert.equal(NF_NAME[highestNF(item.attrs, item.fds).nf], item.nf, item.id);
      const draft = facitDraft(item);
      const grade = gradeAnswer(item, draft);
      const score = scoreTask3fg(item, grade, draft);
      assert.equal(score.points, 5, `${item.id}: ${JSON.stringify(score.parts)}`);
    }
  }
});

test("uppgift 3f–g: delpoäng — rätt NF utan nedbrytning, och nedbrytning när R redan är i 3NF", () => {
  const f = byId["tenta-250916"].task3.f;
  const draft = { ...facitDraft(f), text: "" };
  assert.equal(scoreTask3fg(f, gradeAnswer(f, draft), draft).points, 2);
  const g = byId["tenta-250916"].task3.g; // 3NF: rätt svar är att inte göra något
  const over = { ...facitDraft(g), nf: "2NF", text: "R1(A, B)\nPK = {A}\n\nR2(B, C, D, E, F)\nPK = {B}" };
  assert.equal(scoreTask3fg(g, gradeAnswer(g, over), over).points, 0);
});

// ---------- Uppgift 4 ----------

test("uppgift 4: facitfrågan ger väntat resultat på tentans data", () => {
  for (const e of oldExams) {
    const result = gradeTask4(SQL, e.task4, e.task4.solution);
    assert.equal(result.status, "correct", `${e.id}: ${result.message}`);
    assert.equal(result.points, 30);
  }
  // Uppsamlingen: tomt på tentans data, två rader på kontrolldatan.
  const upp = gradeTask4(SQL, byId["tenta-260525"].task4, byId["tenta-260525"].task4.solution);
  assert.equal(upp.user.values.length, 0);
  assert.equal(upp.control.user.values.length, 2);
});

test("uppgift 4: vanliga fel ger 0", () => {
  const ord = byId["tenta-250916"].task4;
  // Räknar bara C1-raden i stället för alla studentens kurser.
  assert.equal(gradeTask4(SQL, ord, "SELECT s.StudentNo, s.Name, COUNT(*) FROM Student AS s INNER JOIN HasStudied AS h ON h.StudentNo = s.StudentNo WHERE h.Code = 'C1' AND h.Grade > (SELECT AVG(Grade) FROM HasStudied WHERE Code = 'C1') GROUP BY s.StudentNo, s.Name;").points, 0);
  const omt = byId["tenta-251024"].task4;
  // Snittet bara över S1:s betyg: 8 i stället för 6.
  assert.equal(gradeTask4(SQL, omt, "SELECT c.Code, c.Name, AVG(h.Grade) FROM Course AS c INNER JOIN HasStudied AS h ON h.Code = c.Code WHERE h.StudentNo = 'S1' AND c.Code NOT IN (SELECT Code FROM HasStudied WHERE StudentNo = 'S2') GROUP BY c.Code, c.Name;").points, 0);
  const upp = byId["tenta-260525"].task4;
  // Alltid tomt: rätt på tentans data, fel på kontrolldatan.
  const empty = gradeTask4(SQL, upp, "SELECT StudentNo, Name, Age FROM Student WHERE 1 = 0;");
  assert.equal(empty.points, 0);
  assert.equal(empty.control.ok, false);
  // Inskriven ålder i stället för underfråga: fel på kontrolldatan.
  assert.equal(gradeTask4(SQL, upp, "SELECT s.StudentNo, s.Name, MAX(h.Grade) FROM Student AS s INNER JOIN HasStudied AS h ON h.StudentNo = s.StudentNo WHERE s.Age > 33 GROUP BY s.StudentNo, s.Name HAVING COUNT(*) >= 2;").points, 0);
});

test("uppgift 4: AVG över INTEGER — SQL Servers 6 och SQLites 6,5 godtas båda, andra omskrivningar också", () => {
  const omt = byId["tenta-251024"].task4;
  assert.deepEqual(omt.expected.values, [["C2", "Java", 6]]);
  // NOT EXISTS + EXCEPT-formen ger samma resultat.
  const viaExcept = "SELECT c.Code, c.Name, AVG(h.Grade) AS Snitt FROM Course AS c INNER JOIN HasStudied AS h ON h.Code = c.Code WHERE c.Code IN (SELECT Code FROM HasStudied WHERE StudentNo = 'S1' EXCEPT SELECT Code FROM HasStudied WHERE StudentNo = 'S2') GROUP BY c.Code, c.Name;";
  assert.equal(gradeTask4(SQL, omt, viaExcept).points, 30);
  // Heltalssnittet (SQL Servers svar) godtas också.
  const integer = "SELECT c.Code, c.Name, SUM(h.Grade) / COUNT(*) FROM Course AS c INNER JOIN HasStudied AS h ON h.Code = c.Code WHERE c.Code IN (SELECT Code FROM HasStudied WHERE StudentNo = 'S1') AND NOT EXISTS (SELECT 1 FROM HasStudied AS x WHERE x.Code = c.Code AND x.StudentNo = 'S2') GROUP BY c.Code, c.Name;";
  assert.equal(gradeTask4(SQL, omt, integer).points, 30);
  // Seeden innehåller exakt tentans rader.
  assert.match(examSeed(omt.tables), /\('S2', 'C1', 9\)/);
});

test("betygsgränserna från tentornas instruktionssida: A 85, B 75, C 65, D 55, E 50, U under", () => {
  assert.deepEqual(GRADE_LIMITS, [["A", 85], ["B", 75], ["C", 65], ["D", 55], ["E", 50]]);
  assert.deepEqual([100, 85, 84, 75, 74, 65, 64, 55, 54, 50, 49, 0].map(gradeFor), ["A", "A", "B", "B", "C", "C", "D", "D", "E", "E", "U", "U"]);
});

test("1:1 i uppsamlingens uppgift 2: facit har UNIQUE på FK:n, svar utan ger anmärkning men inget avdrag", () => {
  const e = byId["tenta-260525"];
  const facit = toDdl(e.task2.facit);
  assert.match(facit, /UNIQUE \(DIDR5\)/);
  const without = facit.replace(/,\n    UNIQUE \(DIDR5\)/, "");
  const r = checkDdl(without, e.task2);
  assert.equal(r.status, "correct");
  assert.equal(estimateDdl(r).points, 25);
  assert.ok(r.remarks.some((n) => /R5 är 1:1/.test(n)), JSON.stringify(r.remarks));
  assert.ok(!checkDdl(facit, e.task2).remarks.some((n) => /1:1/.test(n)));
});
