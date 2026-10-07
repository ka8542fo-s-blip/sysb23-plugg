// Svarspanelen: kandidatnycklar som mängd av mängder, PA/NP, normalform,
// motivering på valet (beroende + attribut + typ) och nedbrytningens
// egenskaper.
import { test } from "node:test";
import assert from "node:assert/strict";
import { gradeAnswer, motivationOptions, motivationText, explainKey, decompositionProperties } from "../src/lib/fdGrade.js";
import { highestNF } from "../src/lib/fd.js";
import { normalizeExercises } from "../src/data/databaser/normalizeExercises.js";
import { facitVariants } from "../src/lib/normalize.js";

const byId = Object.fromEntries(normalizeExercises.map((e) => [e.id, e]));

// Ett helt rätt svar byggt ur motorn, med första godtagbara motiveringen.
function perfect(item, text) {
  const a = highestNF(item.attrs, item.fds);
  const roles = Object.fromEntries(item.attrs.split(",").map((x) => x.trim()).map((x) => [x, a.prime.includes(x) ? "PA" : "NP"]));
  const need = a.nf === 1 ? "partial" : a.nf === 2 ? "transitive" : null;
  let motivation = null;
  if (need) {
    const v = a.violations.find((x) => x.type === need);
    const option = motivationOptions(item).find((o) => (v.derived ? o.derived : o.fd.index === v.index));
    motivation = { option: option.value, attr: v.attr, type: need };
  }
  return { cks: a.cks, roles, nf: `${a.nf}NF`, motivation, text: text ?? (item.facit ? facitVariants(item)[0] : "") };
}

test("ett helt rätt svar är rätt för alla 64 uppgifter", () => {
  for (const item of normalizeExercises) {
    const r = gradeAnswer(item, perfect(item));
    assert.equal(r.status, "correct", `${item.id}: ${JSON.stringify(Object.fromEntries(Object.entries(r.fields).map(([k, v]) => [k, v.ok])))}`);
    assert.equal(Boolean(r.fields.decomposition), Boolean(item.facit), item.id);
  }
});

test("kandidatnycklar rättas som mängd av mängder, med höljet som skäl", () => {
  const item = byId["norm-11-11"]; // CK: C och {A, B}
  const ok = gradeAnswer(item, { ...perfect(item), cks: [["B", "A"], ["C"]] });
  assert.equal(ok.fields.ck.ok, true);
  const missing = gradeAnswer(item, { ...perfect(item), cks: [["A", "B"]] });
  assert.equal(missing.fields.ck.ok, false);
  assert.match(missing.fields.ck.notes.find((n) => !n.ok).text, /^\{C\} saknas: \{C\}⁺ = \{A, B, C, D, E\} når alla attribut\.$/);
  const notMinimal = gradeAnswer(item, { ...perfect(item), cks: [["A", "B", "C"], ["C"]] });
  assert.match(notMinimal.fields.ck.notes[0].text, /superkey men inte minimal: redan \{C\}⁺ = \{A, B, C, D, E\} når alla attribut/);
  assert.match(explainKey(["A"], "A, B, C, D, E", item.fds), /^\{A\}⁺ = \{A, D\} når inte B, C, E, så A är ingen superkey\.$/);
  assert.match(explainKey(["A", "B"], "A, B, C, D, E", item.fds), /och ingen mindre del räcker \(\{B\}⁺ = \{B, E\}, \{A\}⁺ = \{A, D\}\)/);
});

test("PA/NP per attribut; ett tomt val är fel", () => {
  const item = byId["norm-13-02"]; // CK {A, B}, {B, C}: alla primära
  const r = gradeAnswer(item, { ...perfect(item), roles: { A: "PA", B: "PA" } });
  assert.equal(r.fields.roles.ok, false);
  const c = r.fields.roles.perAttr.find((p) => p.attr === "C");
  assert.equal(c.expected, "PA");
  assert.match(c.why, /C är med i kandidatnyckeln \{B, C\}/);
});

test("motiveringen: alla korrekta brytande beroenden godtas, typen måste stämma", () => {
  const item = byId["norm-10-03"]; // {A, B} → C, C → D, D → E: 2NF
  const opts = motivationOptions(item);
  const base = perfect(item);
  for (const [option, attr] of [["g1", "D"], ["g2", "E"]]) {
    assert.equal(gradeAnswer(item, { ...base, motivation: { option, attr, type: "transitive" } }).fields.motivation.ok, true, option);
  }
  const wrongType = gradeAnswer(item, { ...base, motivation: { option: "g1", attr: "D", type: "partial" } }).fields.motivation;
  assert.equal(wrongType.ok, false);
  assert.match(wrongType.why, /transitivt, inte partiellt/);
  const notViolating = gradeAnswer(item, { ...base, motivation: { option: "g0", attr: "C", type: "transitive" } }).fields.motivation;
  assert.equal(notViolating.ok, false);
  assert.match(notViolating.why, /superkey/);
  assert.equal(opts.length, 3);
  // Mallmeningarna med kursens formulering.
  const a = highestNF(item.attrs, item.fds);
  assert.equal(motivationText(a.violations[0], a.cks), "Non-prime attribute D is transitively dependent on candidate key {A, B} via C.");
  const b = highestNF("A, B, C, D", ["{A, B} → C", "B → D"]);
  assert.equal(motivationText(b.violations[0], b.cks), "Non-prime attribute D is functionally dependent on proper subset B of candidate key {A, B}.");
});

test("motiveringen i en 1NF-relation kräver ett partiellt beroende (Egen 8 och 10)", () => {
  const e8 = byId["norm-egen-08"];
  const t = gradeAnswer(e8, { ...perfect(e8), motivation: { option: "g2", attr: "E", type: "transitive" } }).fields.motivation;
  assert.equal(t.ok, false);
  assert.match(t.why, /högsta normalform är 1NF, så motiveringen ska visa ett partiellt beroende/);
  const e10 = byId["norm-egen-10"];
  const p = gradeAnswer(e10, { ...perfect(e10), motivation: { option: "g1", attr: "D", type: "partial" } }).fields.motivation;
  assert.equal(p.ok, false);
  assert.match(p.why, /ingen äkta delmängd av någon kandidatnyckel/);
});

test("prime höger sida som motivering får skälet", () => {
  const item = byId["norm-11-11"];
  const r = gradeAnswer(item, { ...perfect(item), motivation: { option: "g1", attr: "A", type: "partial" } }).fields.motivation;
  assert.equal(r.ok, false);
  assert.match(r.why, /A är ett primärattribut/);
});

test("nedbrytningens egenskaper: lossless med steg, beroendebevarande via flera relationer", () => {
  const item = byId["norm-12-09"];
  const good = decompositionProperties(item, "R1(A, B)\nPK = {A}\n\nR2(B, C)\nPK = {B}\n\nR3(D, C)\nPK = {D}\n\nR4(A, D)\nPK = {A, D}");
  assert.equal(good.lossless, true);
  assert.equal(good.preserving, true);
  assert.equal(good.lossText.length, 3);
  const bad = decompositionProperties(item, "R1(A, B)\nPK = {A}\n\nR2(B, C)\nPK = {B}\n\nR3(D, C)\nPK = {D}\n\nR4(B, D)\nPK = {B, D}");
  assert.equal(bad.lossless, false);
  assert.match(bad.lossText[0], /^Två i taget fastnar/);
  // Egen 6 med A → C bevarat via A → B och B → C.
  const chain = { attrs: "A, B, C", fds: ["A → B", "B → C", "A → C"] };
  const p = decompositionProperties(chain, "R1(A, B)\nPK = {A}\n\nR2(B, C)\nPK = {B}");
  assert.equal(p.preserving, true);
  assert.match(p.depText[2].text, /^A → C: bevarat via flera relationer/);
  const lost = decompositionProperties({ attrs: "A, B, C", fds: ["{A, B} → C", "C → B"] }, "R1(A, C)\nPK = {A, C}\n\nR2(C, B)\nPK = {C}");
  assert.equal(lost.preserving, false);
  assert.match(lost.depText[0].text, /förlorat/);
  assert.deepEqual(decompositionProperties(item, "R1(A, B)\nPK = {A}").missingAttrs, ["C", "D"]);
});

test("övernormalisering av en 3NF-relation: nedbrytningen fel, normalformen fel", () => {
  const item = byId["norm-egen-05"];
  const r = gradeAnswer(item, { ...perfect(item), nf: "2NF", text: "R1(A, B, C, D)\nPK = {A}\n\nR2(B, E)\nPK = {B}" });
  assert.equal(r.fields.nf.ok, false);
  assert.equal(r.fields.decomposition.ok, false);
  assert.equal(r.fields.decomposition.result.overNormalized, true);
  assert.equal(r.status, "partial");
});

test("uppgift 10 har ingen nedbrytning", () => {
  const item = byId["norm-10-02"];
  const r = gradeAnswer(item, perfect(item));
  assert.deepEqual(r.required, ["ck", "roles", "nf", "motivation"]);
});

test("sammanfattningen i den ihopfällda rättningsrutan räknar bara uppgiftens delar", async () => {
  const { partsSummary } = await import("../src/lib/fdGrade.js");
  assert.deepEqual(partsSummary(null), { ok: 0, total: 0 });
  assert.deepEqual(partsSummary({ fields: { ck: { ok: true }, roles: { ok: false }, nf: { ok: true }, motivation: undefined } }), { ok: 2, total: 3 });
  const item = normalizeExercises.find((e) => !e.nfOnly && e.facit);
  const r = gradeAnswer(item, { cks: [[]], roles: {}, nf: "1NF", motivation: {}, text: "" });
  const s = partsSummary(r);
  assert.equal(s.total, Object.values(r.fields).filter(Boolean).length);
  assert.ok(s.ok < s.total);
});
