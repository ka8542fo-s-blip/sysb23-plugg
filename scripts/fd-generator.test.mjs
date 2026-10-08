// Slumpuppgifterna i normaliseringen (lib/fdGenerator.js): samma frö ger
// samma uppgift, vald normalform respekteras, beroendena är utan överflöd,
// och facit klarar samma prov som häftets facit — och rättas som rätt både
// av facitjämförelsen och av klartextåterkopplingen.
import { test } from "node:test";
import assert from "node:assert/strict";
import { randomExercise, synthesize, facitIsSound, rng } from "../src/lib/fdGenerator.js";
import { highestNF, attrsOf, closure, subset, NF_NAME, allCandidateKeys, toFds } from "../src/lib/fd.js";
import { checkNormalization, facitVariants } from "../src/lib/normalize.js";
import { decompositionFeedback } from "../src/lib/decompFeedback.js";
import { gradeAnswer } from "../src/lib/fdGrade.js";

const SEEDS = Array.from({ length: 600 }, (_, i) => i + 1);

test("samma frö ger samma uppgift; olika frön ger olika", () => {
  assert.deepEqual(randomExercise(42), randomExercise(42));
  assert.deepEqual(randomExercise(42, "2NF"), randomExercise(42, "2NF"));
  const distinct = new Set(SEEDS.slice(0, 100).map((s) => JSON.stringify([randomExercise(s).attrs, randomExercise(s).fds])));
  assert.ok(distinct.size > 40, `bara ${distinct.size} olika`);
  const r = rng(7);
  assert.ok([r(), r(), r()].every((x) => x >= 0 && x < 1));
});

test("varje frö ger en uppgift, och vald normalform respekteras", () => {
  for (const s of SEEDS) {
    for (const target of [null, "1NF", "2NF", "3NF"]) {
      const e = randomExercise(s, target);
      assert.ok(e, `frö ${s} ${target}: ingen uppgift`);
      assert.equal(NF_NAME[highestNF(e.attrs, e.fds).nf], e.nf, `frö ${s}`);
      if (target) assert.equal(e.nf, target, `frö ${s}: ${e.nf} i stället för ${target}`);
      assert.equal(e.id, `norm-slump-${s}`);
      assert.equal(e.exercise, "slump");
      assert.equal(Boolean(e.facit), e.nf !== "3NF");
    }
  }
});

test("övningshäftets stil: 3–6 attribut A…, 1–4 beroenden utan överflöd, ingen relation där allt är nyckel", () => {
  const nfs = {};
  for (const s of SEEDS) {
    const e = randomExercise(s);
    nfs[e.nf] = (nfs[e.nf] || 0) + 1;
    const R = attrsOf(e.attrs);
    assert.ok(R.length >= 3 && R.length <= 6);
    assert.deepEqual(R, "ABCDEF".slice(0, R.length).split(""));
    const fds = toFds(e.fds);
    assert.ok(fds.length >= 1 && fds.length <= 4, `frö ${s}: ${fds.length} beroenden`);
    fds.forEach((fd, i) => {
      const rest = fds.filter((_, k) => k !== i);
      assert.ok(!subset(fd.rhs, closure(fd.lhs, rest)), `frö ${s}: ${fd.text} följer av de andra`);
    });
    const cks = allCandidateKeys(R, fds);
    assert.ok(!(cks.length === 1 && cks[0].length === R.length), `frö ${s}: allt är nyckel`);
  }
  for (const nf of ["1NF", "2NF", "3NF"]) assert.ok(nfs[nf] > 60, `för få ${nf}: ${JSON.stringify(nfs)}`);
});

test("facit: 3NF, lossless, beroendebevarande, inga överflödiga tabeller, ingen nyckel två gånger", () => {
  for (const s of SEEDS) {
    const e = randomExercise(s);
    if (!e.facit) continue;
    assert.ok(facitIsSound(attrsOf(e.attrs), toFds(e.fds), e.facit), `frö ${s}`);
  }
});

test("facit rättas som rätt, i alla primärnyckelalternativ, och återkopplingen säger Rätt", () => {
  for (const s of SEEDS) {
    const e = randomExercise(s);
    if (!e.facit) {
      assert.equal(checkNormalization(e, { nf: "3NF", text: "" }).status, "correct", `frö ${s}`);
      continue;
    }
    for (const text of facitVariants(e)) {
      assert.equal(checkNormalization(e, { nf: e.nf, text }).status, "correct", `frö ${s}`);
      const f = decompositionFeedback(e, text);
      assert.equal(f.count, 0, `frö ${s}: ${f.lines.map((l) => l.text).join(" | ")}`);
    }
  }
});

test("ett helt rätt svar på en slumpuppgift ger rätt i alla fält", () => {
  for (const s of SEEDS.slice(0, 150)) {
    const e = randomExercise(s);
    const a = highestNF(e.attrs, e.fds);
    const roles = Object.fromEntries(attrsOf(e.attrs).map((x) => [x, a.prime.includes(x) ? "PA" : "NP"]));
    const need = a.nf === 1 ? "partial" : a.nf === 2 ? "transitive" : null;
    const v = need && a.violations.find((x) => x.type === need);
    const motivation = v ? { option: v.derived ? "d0" : `g${v.index}`, attr: v.attr, type: need } : {};
    const r = gradeAnswer(e, { cks: a.cks, roles, nf: e.nf, motivation, text: e.facit ? facitVariants(e)[0] : "" });
    assert.equal(r.status, "correct", `frö ${s}: ${JSON.stringify(Object.fromEntries(Object.entries(r.fields).map(([k, f]) => [k, f.ok])))}`);
  }
});

test("syntesen följer reglerna: en tabell per pilstart, ihopslagna ömsesidiga nycklar, nyckeltabell", () => {
  // A → B, B → A, B → C: A och B bestämmer varandra → en tabell.
  const f1 = synthesize(["A", "B", "C", "D"], toFds(["A → B", "B → {A, C}", "C → D"]));
  assert.deepEqual(f1.map((t) => [t.attrs, t.pk[0], t.pkAlso || []]), [["A, B, C", "A", ["B"]], ["C, D", "C", []]]);
  // Ingen tabell innehåller nyckeln {A, D} → nyckeltabell.
  const f2 = synthesize(["A", "B", "C", "D"], toFds(["A → B", "B → C", "D → C"]));
  assert.deepEqual(f2.map((t) => t.attrs), ["A, B", "B, C", "C, D", "A, D"]);
});
