// FD-motorn i src/lib/fd.js: hölje, alla kandidatnycklar, normalform med
// brytande beroenden, lossless join och beroendebevarande — och att den
// stämmer mot häftets facit och de egna uppgifterna.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  closure, allCandidateKeys, prime, nonPrime, isSuperkey, highestNF, neverDetermined,
  isLossless, losslessSteps, isDependencyPreserving, dependencyReport, projectFds, relationNF, attrsOf, NF_NAME,
} from "../src/lib/fd.js";
import { normalizeExercises } from "../src/data/databaser/normalizeExercises.js";
import { facitVariants, checkNormalization } from "../src/lib/normalize.js";
import { parseSchema } from "../src/lib/modelCheck.js";

const byId = Object.fromEntries(normalizeExercises.map((e) => [e.id, e]));
const keys = (R, F) => allCandidateKeys(R, F).map((k) => k.join(""));

test("closure: startar med X och använder ett beroende när hela vänsterledet finns", () => {
  const F = ["{A, B} → C", "C → D", "D → E"];
  assert.deepEqual(closure(["A"], F), ["A"]);
  assert.deepEqual(closure(["A", "B"], F), ["A", "B", "C", "D", "E"]);
  assert.deepEqual(closure(["C"], F), ["C", "D", "E"]);
  assert.deepEqual(closure(["b", "a"], F), ["b", "a", "C", "D", "E"], "skiftläge spelar ingen roll");
  assert.ok(isSuperkey(["A", "B"], "A, B, C, D, E", F));
  assert.ok(!isSuperkey(["A", "C"], "A, B, C, D, E", F));
});

test("allCandidateKeys hittar alla nycklar, inte bara en", () => {
  assert.deepEqual(keys("A, B, C", ["A → B", "B → A", "B → C"]), ["A", "B"]);
  assert.deepEqual(keys("A, B, C, D, E", ["{A, B} → C", "C → A", "C → B", "A → D", "B → E"]), ["C", "AB"]);
  assert.deepEqual(keys("A, B, C", ["{A, B} → C", "C → A"]), ["AB", "BC"]);
  assert.deepEqual(keys("A, B, C, D", []), ["ABCD"]);
  assert.deepEqual(keys("A, B, C, D, E, F", ["A → B", "B → C", "C → D", "D → A", "D → {E, F}"]), ["A", "B", "C", "D"]);
  // Attribut som aldrig står till höger måste ingå i varje nyckel.
  assert.deepEqual(neverDetermined("A, B, C, D, E, F", ["A → B", "B → C", "D → E", "E → C"]), ["A", "D", "F"]);
  assert.deepEqual(keys("A, B, C, D, E, F", ["A → B", "B → C", "D → E", "E → C"]), ["ADF"]);
});

test("prime och nonPrime räknar alla kandidatnycklar", () => {
  const R = "A, B, C, D";
  const F = ["{A, B} → {C, D}", "C → B"];
  assert.deepEqual(prime(R, F), ["A", "B", "C"]);
  assert.deepEqual(nonPrime(R, F), ["D"]);
});

test("häftets uppgift 10: motorn ger häftets facit för alla 16", () => {
  const facit = { 1: 3, 2: 1, 3: 2, 4: 2, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1, 10: 3, 11: 3, 12: 2, 13: 3, 14: 3, 15: 2, 16: 3 };
  const items = normalizeExercises.filter((e) => e.exercise === 10);
  assert.equal(items.length, 16);
  for (const item of items) {
    const { nf } = highestNF(item.attrs, item.fds);
    assert.equal(nf, facit[item.number], `10:${item.number}: motorn ${nf}NF, häftet ${facit[item.number]}NF`);
    assert.equal(NF_NAME[nf], item.nf, `10:${item.number}: datat och häftet skiljer sig`);
  }
});

test("häftets uppgift 11–13: motorn ger samma normalform som facit", () => {
  for (const item of normalizeExercises.filter((e) => [11, 12, 13].includes(e.exercise))) {
    assert.equal(NF_NAME[highestNF(item.attrs, item.fds).nf], item.nf, item.id);
  }
});

test("violations citerar givna beroenden och typen partial/transitive", () => {
  // 10:9: {A, B} → C, B → D — B → D är partiellt.
  const a = highestNF("A, B, C, D", ["{A, B} → C", "B → D"]);
  assert.equal(a.nf, 1);
  assert.deepEqual(a.violations.map((v) => [v.index, v.type, v.attr, v.ck.join("")]), [[1, "partial", "D", "AB"]]);
  // 10:3: {A, B} → C, C → D, D → E — två transitiva.
  const b = highestNF("A, B, C, D, E", ["{A, B} → C", "C → D", "D → E"]);
  assert.equal(b.nf, 2);
  assert.deepEqual(b.violations.map((v) => [v.index, v.type, v.attr, v.via.join("")]), [[1, "transitive", "D", "C"], [2, "transitive", "E", "D"]]);
  // Egen 8: både partiellt och transitivt i samma relation.
  const c = highestNF("A, B, C, D, E", ["{A, B} → C", "B → D", "D → E"]);
  assert.equal(c.nf, 1);
  assert.deepEqual(c.violations.map((v) => `${v.index}:${v.type}:${v.attr}`), ["1:partial:D", "2:transitive:E"]);
  assert.ok(c.violations.every((v) => !v.derived));
  // Egen 10: sammansatt determinant utanför nyckeln ger transitivt, inte partiellt.
  const d = highestNF("A, B, C, D", ["A → B", "{B, C} → D"]);
  assert.deepEqual(d.violations.map((v) => `${v.index}:${v.type}:${v.attr}`), ["0:partial:B", "1:transitive:D"]);
  // Prime höger sida bryter inget (13:2, Egen 4).
  assert.deepEqual(highestNF("A, B, C", ["{A, B} → C", "C → A"]).violations, []);
  assert.deepEqual(highestNF("A, B, C, D", ["{A, B} → {C, D}", "C → B"]).violations, []);
});

test("violations: givna beroenden räcker alltid för att visa ett 3NF-brott", () => {
  for (const item of normalizeExercises) {
    const { nf, violations } = highestNF(item.attrs, item.fds);
    if (nf === 3) assert.equal(violations.length, 0, item.id);
    if (nf === 2) assert.ok(violations.length && violations.every((v) => v.type === "transitive" && !v.derived), item.id);
    if (nf === 1) assert.ok(violations.some((v) => v.type === "partial"), item.id);
  }
});

test("härlett partiellt beroende läggs bara till när inget givet visar 2NF-brottet", () => {
  // C → D med C ⊂ {B, C}: partiellt syns i ett givet beroende.
  const a = highestNF("A, B, C, D", ["A → C", "C → A", "C → D"]);
  assert.equal(a.nf, 1);
  assert.ok(a.violations.some((v) => v.type === "partial" && !v.derived));
  // {A, C} → D är transitivt ({A, C} är ingen del av {A, B} eller {B, C}),
  // men A⁺ = {A, C, D}: A → D är partiellt och bara härlett.
  const b = highestNF("A, B, C, D", ["A → C", "C → A", "{A, C} → D"]);
  assert.equal(b.nf, 1);
  assert.deepEqual(b.violations.filter((v) => !v.derived).map((v) => v.type), ["transitive"]);
  assert.ok(b.violations.some((v) => v.derived && v.type === "partial" && v.attr === "D" && v.via.join("") === "A"));
});

test("isLossless: två delar — de gemensamma attributen bestämmer en av dem", () => {
  const F = ["A → B", "B → C"];
  assert.ok(isLossless("A, B, C", F, [["A", "B"], ["B", "C"]]));
  assert.ok(!isLossless("A, B, C", ["A → B"], [["A", "B"], ["B", "C"]]), "B bestämmer varken A eller C");
  // Föreläsningens exempel: inga gemensamma attribut.
  assert.ok(!isLossless("A, B, C, D, E, F", ["A → {B, C}", "D → {E, F}"], [["A", "B", "C"], ["D", "E", "F"]]));
  assert.ok(isLossless("A, B, C, D, E, F", ["A → {B, C}", "D → {E, F}"], [["A", "B", "C"], ["D", "E", "F"], ["A", "D"]]));
  // 12:9: häftets R4(B, D) är inte lossless, R4(A, D) är det.
  const R = "A, B, C, D", G = ["A → B", "B → C", "D → C"];
  assert.ok(!isLossless(R, G, [["A", "B"], ["B", "C"], ["D", "C"], ["B", "D"]]));
  assert.ok(isLossless(R, G, [["A", "B"], ["B", "C"], ["D", "C"], ["A", "D"]]));
  const steps = losslessSteps(R, G, [["A", "B"], ["B", "C"], ["D", "C"], ["A", "D"]]);
  assert.ok(steps.lossless && steps.byPairs && steps.steps.length === 3);
  assert.equal(losslessSteps(R, G, [["A", "B"], ["B", "C"], ["D", "C"], ["B", "D"]]).byPairs, false);
});

test("isDependencyPreserving: unionen av lokala beroenden, inte samma relation", () => {
  // A → B i R1, B → C i R2 ⇒ A → C bevaras fast A och C står i olika relationer.
  const R = "A, B, C";
  const F = ["A → B", "B → C", "A → C"];
  assert.ok(isDependencyPreserving(R, F, [["A", "B"], ["B", "C"]]));
  const rep = dependencyReport(R, F, [["A", "B"], ["B", "C"]]);
  assert.deepEqual(rep.map((r) => [r.preserved, r.direct]), [[true, 0], [true, 1], [true, null]]);
  // Förlorat: {A, B} → C kan inte härledas ur (A, C) och (B, C), där bara C → B gäller lokalt.
  assert.ok(!isDependencyPreserving("A, B, C", ["{A, B} → C", "C → B"], [["A", "C"], ["B", "C"]]));
  // Föreläsningens exempel: EmployeeNo → ProjectName följer av EmployeeNo → ProjectNo och ProjectNo → ProjectName.
  const E = "EmployeeNo, Name, Address, ProjectNo, ProjectName, Budget";
  const EF = ["EmployeeNo → {Name, Address, ProjectNo, ProjectName}", "ProjectNo → {ProjectName, Budget}", "ProjectName → {ProjectNo, Budget}"];
  const parts = [["EmployeeNo", "Name", "Address", "ProjectNo"], ["ProjectNo", "ProjectName", "Budget"]];
  assert.ok(isDependencyPreserving(E, EF, parts));
  assert.equal(dependencyReport(E, EF, parts)[0].direct, null);
});

test("projectFds och relationNF för en delrelation", () => {
  const F = ["A → B", "B → C"];
  assert.deepEqual(projectFds(["A", "C"], F), [{ lhs: ["A"], rhs: ["C"] }]);
  assert.equal(relationNF(["A", "B", "C"], F).nf, 2);
  assert.equal(relationNF(["A", "C"], F).nf, 3);
});

test("egna uppgifter: 10 st, normalform, nycklar och facit verifierade i motorn", () => {
  const own = normalizeExercises.filter((e) => e.exercise === "egen");
  assert.equal(own.length, 10);
  const expectedKeys = {
    1: ["A", "B"], 2: ["AE"], 3: ["ABC"], 4: ["AB", "AC"], 5: ["A", "B", "C", "D"],
    6: ["A"], 7: ["A", "B"], 8: ["AB"], 9: ["AB"], 10: ["AC"],
  };
  for (const item of own) {
    const a = highestNF(item.attrs, item.fds);
    assert.equal(NF_NAME[a.nf], item.nf, `Egen ${item.number}`);
    assert.deepEqual(a.cks.map((k) => k.join("")), expectedKeys[item.number], `Egen ${item.number}: nycklar`);
    assert.ok(item.trap, `Egen ${item.number}: fällan saknas`);
    assert.equal(Boolean(item.facit), item.nf !== "3NF");
    if (!item.facit) {
      assert.equal(checkNormalization(item, { nf: "3NF", text: "" }).status, "correct");
      continue;
    }
    for (const text of facitVariants(item)) {
      const parts = parseSchema(text).relations.map((r) => r.attrs);
      for (const p of parts) assert.equal(relationNF(p, item.fds).nf, 3, `Egen ${item.number}: ${p} inte i 3NF`);
      assert.ok(attrsOf(item.attrs).every((x) => parts.flat().includes(x)), `Egen ${item.number}: attribut tappas`);
      assert.ok(isLossless(item.attrs, item.fds, parts), `Egen ${item.number}: inte lossless`);
      assert.ok(isDependencyPreserving(item.attrs, item.fds, parts), `Egen ${item.number}: beroende tappas`);
      assert.equal(checkNormalization(item, { nf: item.nf, text }).status, "correct", `Egen ${item.number}: facit rättar inte sig självt`);
    }
  }
  // Fällorna: Egen 6 med två relationer är inte i 3NF, Egen 7 uppdelad är övernormaliserad.
  assert.equal(relationNF(["A", "B", "C"], byId["norm-egen-06"].fds).nf, 2);
  const over = checkNormalization(byId["norm-egen-07"], { nf: "2NF", text: "R1(A, B)\nPK = {A}\n\nR2(A, C)\nPK = {A}\n\nR3(C, D)\nPK = {C}" });
  assert.equal(over.overNormalized, true);
  // Egen 2 utan nyckelrelation är inte lossless.
  assert.ok(!isLossless("A, B, C, D, E", byId["norm-egen-02"].fds, [["A", "B", "C"], ["C", "D"]]));
});
