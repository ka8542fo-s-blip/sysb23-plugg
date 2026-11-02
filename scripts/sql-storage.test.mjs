// Inget får försvinna när SQL-sidan byggs om: svar och bock från det gamla
// läget Tenta ska gå att läsa i den nya formen.
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";

const store = new Map();
globalThis.localStorage = {
  getItem: (key) => (store.has(key) ? store.get(key) : null),
  setItem: (key, value) => store.set(key, String(value)),
  removeItem: (key) => store.delete(key),
};
const { loadDraft, loadSqlProgress, saveDraft, saveSqlResult } = await import("../src/lib/storage.js");

beforeEach(() => store.clear());

const ID = "sql-tenta:tenta-250916";

test("gammalt svar och bock flyttas till den vanliga formen", () => {
  saveDraft(ID, { code: "SELECT 1;", solved: true });
  assert.deepEqual(loadSqlProgress([ID]), { [ID]: "solved" });
  assert.equal(loadDraft(ID), "SELECT 1;");
});

test("gammalt svar utan bock får ingen bock", () => {
  saveDraft(ID, { code: "SELECT 2;", solved: false });
  assert.deepEqual(loadSqlProgress([ID]), {});
  assert.equal(loadDraft(ID), "SELECT 2;");
});

test("bock utan svar blir kvar", () => {
  saveDraft(ID, { code: "", solved: true });
  assert.deepEqual(loadSqlProgress([ID]), { [ID]: "solved" });
  assert.equal(loadDraft(ID), null);
});

test("nya svar rörs inte", () => {
  saveDraft("sql-01", "SELECT 3;");
  saveSqlResult("sql-01", "solved-with-help");
  assert.deepEqual(loadSqlProgress(["sql-01"]), { "sql-01": "solved-with-help" });
  assert.equal(loadDraft("sql-01"), "SELECT 3;");
});
