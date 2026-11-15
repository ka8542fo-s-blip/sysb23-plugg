// Ritningarna i tentornas uppgift 3 har egna nycklar per tenta och relation.
// "Börja om" på en tenta raderar bara den tentans ritningar, aldrig
// Modelleras (fdritning:<uppgift>) eller en annan tentas.
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";

const store = new Map();
globalThis.localStorage = {
  get length() { return store.size; },
  key: (i) => [...store.keys()][i] ?? null,
  getItem: (key) => (store.has(key) ? store.get(key) : null),
  setItem: (key, value) => store.set(key, String(value)),
  removeItem: (key) => store.delete(key),
};
const { examFdKey, clearExamFdDrawings, save, load } = await import("../src/lib/storage.js");

beforeEach(() => store.clear());

const drawing = { boxes: [{ id: "b1", attr: "A", x: 0, y: 0 }], groups: [], arrows: [] };

test("nyckeln är per tenta och deluppgift", () => {
  assert.equal(examFdKey("tenta-250916", "3f"), "fdritning:tenta:tenta-250916:3f");
  assert.notEqual(examFdKey("tenta-250916", "R"), examFdKey("tenta-251024", "R"));
});

test("Börja om raderar bara den tentans ritningar", () => {
  for (const part of ["R", "3f", "3g"]) save(examFdKey("tenta-250916", part), drawing);
  save(examFdKey("tenta-251024", "R"), drawing);
  save("fdritning:normalisering-1", drawing);
  clearExamFdDrawings("tenta-250916");
  for (const part of ["R", "3f", "3g"]) assert.equal(load(examFdKey("tenta-250916", part), null), null);
  assert.deepEqual(load(examFdKey("tenta-251024", "R"), null), drawing);
  assert.deepEqual(load("fdritning:normalisering-1", null), drawing);
});
