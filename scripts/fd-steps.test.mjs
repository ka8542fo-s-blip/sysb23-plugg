// Stegflödet i normaliseringen (lib/fdSteps.js): vilka steg som gäller,
// migrering av gamla sparade svar, förifyllda PA/NP, föreslagen typ, pil
// som val i motiveringen, sammanfattningar och navigering.
import { test } from "node:test";
import assert from "node:assert/strict";
import { stepsFor, migrateDraft, emptyDraft, prefillRoles, suggestType, optionForPair, stepSummary, nextStep, nextItemId, STEP_DEFINITION } from "../src/lib/fdSteps.js";
import { normalizeExercises } from "../src/data/databaser/normalizeExercises.js";

const byId = Object.fromEntries(normalizeExercises.map((e) => [e.id, e]));

test("stegen: motivering bara under 3NF, nedbrytning aldrig i uppgift 10", () => {
  const e8 = byId["norm-egen-08"];
  assert.deepEqual(stepsFor(e8, emptyDraft()), ["draw", "ck", "roles", "nf"]);
  assert.deepEqual(stepsFor(e8, { ...emptyDraft(), nf: "3NF" }), ["draw", "ck", "roles", "nf"]);
  assert.deepEqual(stepsFor(e8, { ...emptyDraft(), nf: "1NF" }), ["draw", "ck", "roles", "nf", "motivation", "decomposition"]);
  assert.deepEqual(stepsFor(byId["norm-10-02"], { ...emptyDraft(), nf: "1NF" }), ["draw", "ck", "roles", "nf", "motivation"]);
});

test("inget förvalt: ett tomt utkast har ingen normalform och öppnar ritsteget", () => {
  const d = migrateDraft(null, byId["norm-11-01"]);
  assert.equal(d.nf, null);
  assert.equal(d.step, "draw");
  assert.deepEqual(d.done, {});
});

test("migrering: gamla svar får steg, och det första ofärdiga steget öppnas", () => {
  const item = byId["norm-11-03"];
  const old = { cks: [["A", "B"]], roles: { A: "PA" }, nf: "1NF", motivation: {}, text: "" };
  const d = migrateDraft(old, item);
  assert.deepEqual(d.done, { draw: true, ck: true, roles: true, nf: true });
  assert.equal(d.step, "motivation");
  assert.equal(d.rolesEdited, true);
  assert.equal(d.v, 2);
  // Helt ifyllt → sammanfattningen.
  const full = migrateDraft({ ...old, motivation: { option: "g1", attr: "D", type: "partial" }, text: "R1(A, D)\nPK = {A}" }, item);
  assert.equal(full.step, "summary");
  // Redan migrerat lämnas orört.
  assert.equal(migrateDraft({ ...d, step: "ck" }, item).step, "ck");
  // Skräp ger ett tomt utkast.
  assert.deepEqual(migrateDraft("x", item), emptyDraft());
});

test("PA/NP förifylls ur dina kandidatnycklar", () => {
  assert.deepEqual(prefillRoles("A, B, C, D", [["A", "B"], ["A", "C"]]), { A: "PA", B: "PA", C: "PA", D: "NP" });
  assert.deepEqual(prefillRoles("A, B", []), { A: "NP", B: "NP" });
});

test("typen föreslås ur dina kandidatnycklar, inte ur facit", () => {
  const R = "A, B, C, D, E";
  const F = ["{A, B} → C", "B → D", "D → E"];
  assert.equal(suggestType(["B"], [["A", "B"]], R, F), "partial");
  assert.equal(suggestType(["D"], [["A", "B"]], R, F), "transitive");
  // Med fel CK ({B}) blir förslaget annorlunda — det följer svaret.
  assert.equal(suggestType(["B"], [["B"]], R, F), "transitive");
  assert.equal(suggestType(["A", "B"], [["A", "B"]], R, F), null, "superkey bryter inget");
});

test("en ritad pil blir motiveringens val när den motsvarar ett givet beroende", () => {
  const item = byId["norm-egen-08"]; // {A, B} → C, B → D, D → E
  assert.equal(optionForPair(item, { lhs: ["B"], attr: "D" }).value, "g1");
  assert.equal(optionForPair(item, { lhs: ["B", "A"], attr: "C" }).value, "g0");
  assert.equal(optionForPair(item, { lhs: ["A"], attr: "E" }), null);
  // A → {B, C}: pilen A → C motsvarar det givna beroendet.
  assert.equal(optionForPair(byId["norm-egen-02"], { lhs: ["A"], attr: "C" }).value, "g0");
});

test("sammanfattning per steg", () => {
  const item = byId["norm-egen-08"];
  const d = { ...emptyDraft(), cks: [["A", "B"]], roles: { A: "PA", B: "PA", C: "NP", D: "NP", E: "NP" }, nf: "1NF", motivation: { option: "g1", attr: "D", type: "partial" }, text: "R1(A, B, C)\nPK = {A, B}\n\nR2(B, D)\nPK = {B}" };
  assert.equal(stepSummary("draw", item, d, { arrows: [1, 2, 3] }), "3 pilar ritade");
  assert.equal(stepSummary("draw", item, d, { arrows: [] }), "Hoppade över ritningen");
  assert.equal(stepSummary("ck", item, d), "{A, B}");
  assert.equal(stepSummary("roles", item, d), "PA: A, B · NP: C, D, E");
  assert.equal(stepSummary("nf", item, d), "1NF");
  assert.equal(stepSummary("motivation", item, d), "B → D, partial");
  assert.equal(stepSummary("decomposition", item, d), "2 relationer");
});

test("nästa steg: hoppar över klara, sist sammanfattningen", () => {
  const item = byId["norm-egen-08"];
  const d = { ...emptyDraft(), nf: "1NF", done: { draw: true, ck: true } };
  assert.equal(nextStep(item, d, "draw"), "roles");
  assert.equal(nextStep(item, { ...d, done: { draw: true, ck: true, roles: true, nf: true, motivation: true } }, "decomposition"), "summary");
  // Ändrat ett tidigare steg: tillbaka till första ofärdiga efter det.
  assert.equal(nextStep(item, { ...d, done: { draw: true, roles: true } }, "ck"), "nf");
  // Uppgift 10 slutar efter motiveringen.
  assert.equal(nextStep(byId["norm-10-02"], { ...emptyDraft(), nf: "1NF", done: { draw: true, ck: true, roles: true, nf: true } }, "motivation"), "summary");
});

test("nästa uppgift: första ej klara efter den aktuella, runt listan", () => {
  const items = [{ id: "a" }, { id: "b" }, { id: "c" }];
  assert.equal(nextItemId(items, "a", { b: "solved" }), "c");
  assert.equal(nextItemId(items, "c", {}), "a");
  assert.equal(nextItemId(items, "b", { a: "solved", b: "solved", c: "solved" }), "c");
});

test("varje steg har en definition att öppna med ?", () => {
  for (const s of ["draw", "ck", "roles", "nf", "motivation", "decomposition"]) assert.ok(STEP_DEFINITION[s], s);
});
