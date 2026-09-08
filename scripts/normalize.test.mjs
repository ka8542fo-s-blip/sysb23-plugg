// Normaliseringssteget: motorn för beroenden, facit 11–13 och rättningen.
import { test } from "node:test";
import assert from "node:assert/strict";
import { analyze, facitVariants, facitRules, checkNormalization, isLossless, preservesDependencies, relationIn3NF, attrsOf, parseFd } from "../src/lib/normalize.js";
import { parseSchema } from "../src/lib/modelCheck.js";
import { normalizeExercises } from "../src/data/databaser/normalizeExercises.js";

const byId = Object.fromEntries(normalizeExercises.map((e) => [e.id, e]));
const rel = (result, name) => result.relations.find((r) => r.name.toLowerCase() === name.toLowerCase());
const check = (id, nf, text) => checkNormalization(byId[id], { nf, text });

// Häftets 12:9 har R4(B, D); det är inte lossless (se normalizeExercises.js).
const KEY_ISSUES = { "norm-12-09": 0 }; // id -> variantindex som inte är lossless

test("38 poster: 12 + 14 + 12, unika id", () => {
  assert.equal(normalizeExercises.length, 38);
  assert.equal(new Set(normalizeExercises.map((e) => e.id)).size, 38);
  assert.equal(normalizeExercises.filter((e) => e.exercise === 12).length, 14);
});

test("motorn ger samma högsta normalform som facit för varje post", () => {
  for (const item of normalizeExercises) {
    const a = analyze(item.attrs, item.fds);
    assert.equal(a.nf, item.nf, `${item.id}: motorn ${a.nf}, facit ${item.nf} (${a.ckList})`);
    assert.equal(Boolean(item.facit), item.nf !== "3NF", `${item.id}: facit och 3NF hänger inte ihop`);
  }
});

test("varje facitvariant: alla relationer i 3NF, lossless join, beroendebevarande", () => {
  for (const item of normalizeExercises) {
    if (!item.facit) continue;
    const fds = item.fds.map(parseFd);
    facitVariants(item).forEach((text, i) => {
      const schema = parseSchema(text);
      assert.equal(schema.errors.length, 0, `${item.id} variant ${i} tolkas inte`);
      const parts = schema.relations.map((r) => r.attrs);
      const all = attrsOf(item.attrs);
      assert.ok(all.every((a) => parts.flat().includes(a)), `${item.id}: attribut tappas`);
      for (const r of schema.relations) assert.ok(relationIn3NF(r.attrs, fds), `${item.id} variant ${i}: ${r.name} är inte i 3NF`);
      assert.ok(preservesDependencies(parts, fds), `${item.id} variant ${i}: beroende tappas`);
      const expectLossless = KEY_ISSUES[item.id] !== i;
      assert.equal(isLossless(parts, fds), expectLossless, `${item.id} variant ${i}: lossless ${expectLossless ? "saknas" : "borde saknas"}`);
    });
  }
});

test("facit rättar sig självt, i alla PK-alternativ", () => {
  for (const item of normalizeExercises) {
    if (!item.facit) {
      assert.equal(check(item.id, "3NF", "").status, "correct", item.id);
      continue;
    }
    for (const text of facitVariants(item)) {
      const r = checkNormalization(item, { nf: item.nf, text });
      assert.equal(r.status, "correct", `${item.id}: ${JSON.stringify(r.relations.filter((x) => x.status !== "ok").map((x) => x.problems))} ${JSON.stringify(r.extra)}`);
      assert.equal(r.remarks.length, 0, `${item.id}: namnanmärkningar ska inte förekomma`);
    }
    const rules = facitRules(item, analyze(item.attrs, item.fds));
    for (const f of item.facit) assert.ok(rules[f.name.toLowerCase()], `${item.id}: ${f.name} saknar regeltagg`);
  }
});

test("rätt svar med det andra PK-valet ger rätt (11:7 med C, 12:12 med D)", () => {
  const r = check("norm-11-07", "2NF", `R1(A, B, C, D)\nPK = {C}\n\nR2(D, E, F)\nPK = {D}`);
  assert.equal(r.status, "correct");
  assert.equal(r.variant, 1);
  const s = check("norm-12-12", "2NF", `R1(A, B, C)\nPK = {A, B}\n\nR2(C, D)\nPK = {D}`);
  assert.equal(s.status, "correct");
});

test("relationsnamn och ordning spelar ingen roll i normaliseringen", () => {
  const r = check("norm-11-03", "1NF", `X(B, E)\nPK = {B}\n\nY(D, A)\nPK = {A}\n\nZ(C, B, A)\nPK = {B, A}`);
  assert.equal(r.status, "correct", JSON.stringify(r.relations.map((x) => x.problems)));
  assert.equal(r.remarks.length, 0);
});

test("'R är redan i 3NF' är rätt på 11:4, 11:6, 12:11, 13:2, 13:3", () => {
  for (const id of ["norm-11-04", "norm-11-06", "norm-12-11", "norm-13-02", "norm-13-03"]) {
    assert.equal(check(id, "3NF", "").status, "correct", id);
  }
});

test("'R är redan i 3NF' på 11:1 är fel, med skälet ur kapitel 8", () => {
  const r = check("norm-11-01", "3NF", "");
  assert.equal(r.status, "wrong");
  assert.match(r.nf.message, /^R är inte i 3NF utan i 2NF: kandidatnyckeln A är enkel/);
  assert.match(r.nf.message, /icke-primärattributet C är transitivt beroende av kandidatnyckeln A \(B → C, och B är ingen kandidatnyckel\)/);
  assert.ok(r.facit.relations.length === 2);
});

test("uppdelning av en relation som redan är i 3NF är övernormalisering (11:4)", () => {
  const r = check("norm-11-04", "2NF", `R1(A, B, C)\nPK = {A}\n\nR2(C, D, E)\nPK = {C}`);
  assert.equal(r.status, "wrong");
  assert.equal(r.overNormalized, true);
  assert.match(r.nf.message, /^R är redan i 3NF: varje beroende har en kandidatnyckel som vänsterled eller bara primärattribut till höger \(kandidatnycklar: A, B, C; icke-primärattribut: D, E\)/);
  assert.match(check("norm-11-06", "1NF", "R1(A)\nPK = {A}").nf.message, /alla attribut är primärattribut \(kandidatnycklar: \{A, B\}\)/);
  assert.equal(r.extra.length, 2);
  assert.match(r.extra[0].message, /^Övernormalisering: R1\(A, B, C\)/);
});

test("övernormalisering av 12:4 ger diff: R1 saknar D, E och två extra relationer", () => {
  const r = check("norm-12-04", "2NF", `R1(A, B, C)\nPK = {A, B}\n\nR2(C, D)\nPK = {C}\n\nR3(D, E)\nPK = {D}\n\nR4(E, F)\nPK = {E}\n\nR5(F, G)\nPK = {F}`);
  assert.equal(r.status, "partial");
  assert.equal(r.overNormalized, true);
  const r1 = rel(r, "R1");
  assert.equal(r1.status, "diff");
  assert.deepEqual(r1.problems, ["Saknar attribut: D, E."]);
  assert.equal(r1.rule.rule, "Kandidatnyckeln");
  assert.match(r1.rule.why, /C och D är själva kandidatnyckel/);
  assert.equal(rel(r, "R2").status, "ok");
  assert.equal(rel(r, "R3").status, "ok");
  assert.deepEqual(r.extra.map((e) => e.name), ["R2", "R3"]);
  assert.match(r.extra[0].message, /^Övernormalisering: R2\(C, D\) bryter ut något som redan är i 3NF inne i R1\(A, B, C, D, E\)\. C är en kandidatnyckel i R/);
});

test("rätt uppdelning men fel normalform är delvis rätt (11:1 som 1NF)", () => {
  const r = check("norm-11-01", "1NF", `R1(A, B)\nPK = {A}\n\nR2(B, C)\nPK = {B}`);
  assert.equal(r.status, "partial");
  assert.equal(r.nf.ok, false);
  assert.match(r.nf.message, /^Högsta normalform är 2NF, inte 1NF/);
  assert.ok(r.relations.every((x) => x.status === "ok"));
});

test("partiellt beroende i motiveringen (11:3)", () => {
  const a = analyze("A, B, C, D, E", ["{A, B} → C", "A → D", "B → E"]);
  assert.equal(a.nf, "1NF");
  assert.equal(a.reasons["1NF"], "äkta delmängden A av kandidatnyckeln {A, B} bestämmer funktionellt icke-primärattributet D");
});

test("saknad nyckelrelation (11:5 utan R3) och dess varför", () => {
  const r = check("norm-11-05", "1NF", `R1(A, B, C, D)\nPK = {A, B}\n\nR2(D, E)\nPK = {D}`);
  assert.equal(r.status, "partial");
  const r3 = rel(r, "R3");
  assert.equal(r3.status, "missing");
  assert.equal(r3.rule.rule, "Nyckelrelation");
  assert.match(r3.rule.why, /Kandidatnyckeln \{A, B, F\} måste stå i en egen relation/);
});

test("fel PK ger diff (11:3 med PK = {A} i R1)", () => {
  const r = check("norm-11-03", "1NF", `R1(A, B, C)\nPK = {A}\n\nR2(A, D)\nPK = {A}\n\nR3(B, E)\nPK = {B}`);
  assert.equal(r.status, "partial");
  assert.deepEqual(rel(r, "R1").problems, ["Primärnyckeln ska vara {A, B}, du har {A}. B saknas."]);
  assert.equal(rel(r, "R1").rule.rule, "Kandidatnyckeln");
});

test("regeltaggar: partiellt, transitivt, nyckelrelation (12:9)", () => {
  const item = byId["norm-12-09"];
  const rules = facitRules(item, analyze(item.attrs, item.fds));
  assert.equal(rules.r1.rule, "Partiellt beroende");
  assert.equal(rules.r2.rule, "Transitivt beroende");
  assert.equal(rules.r3.rule, "Partiellt beroende");
  assert.equal(rules.r4.rule, "Nyckelrelation");
  // Både häftets R4(B, D) och härledda R4(A, D) godtas.
  const base = `R1(A, B)\nPK = {A}\n\nR2(B, C)\nPK = {B}\n\nR3(D, C)\nPK = {D}\n\n`;
  assert.equal(check("norm-12-09", "1NF", base + `R4(A, D)\nPK = {A, D}`).status, "correct");
  assert.equal(check("norm-12-09", "1NF", base + `R4(B, D)\nPK = {B, D}`).status, "correct");
});

test("tolkningsfel går igenom oförändrat", () => {
  const r = check("norm-11-01", "2NF", `R1(A, B)\nPK = {X}`);
  assert.equal(r.status, "parse-error");
  assert.match(r.errors[0].message, /^Rad 2: X i PK finns inte/);
});
