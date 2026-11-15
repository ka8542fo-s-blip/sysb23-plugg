import { test } from "node:test";
import assert from "node:assert/strict";
import { pickRandomJavaTask } from "../src/lib/javaPick.js";
import { javaTasks } from "../src/data/databaser/javaTasks.js";

const ids = javaTasks.map((t) => t.id);
const solvedAll = (except = []) => Object.fromEntries(ids.filter((id) => !except.includes(id)).map((id) => [id, { status: "solved" }]));
const every = (states, current) => {
  const seen = new Set();
  for (let i = 0; i < 400; i++) seen.add(pickRandomJavaTask(javaTasks, states, current, () => i / 400));
  return seen;
};

test("slumpa: bara övning 14 är markerad som svårare", () => {
  assert.deepEqual(javaTasks.filter((t) => t.hard).map((t) => t.id), ["java-ov-14"]);
});

test("slumpa: väljer bland exempeltentan och övningarna, aldrig övning 14 eller den öppna", () => {
  const seen = every({}, "java-ov-1");
  assert.ok(!seen.has("java-ov-14"));
  assert.ok(!seen.has("java-ov-1"));
  assert.ok(seen.has("java-ex-1") && seen.has("java-ex-2") && seen.has("java-ov-22"));
  assert.equal(seen.size, ids.length - 2);
});

test("slumpa: i första hand uppgifter som inte är klara", () => {
  const states = solvedAll(["java-ov-3", "java-ov-20"]);
  assert.deepEqual([...every(states, "java-ex-1")].sort(), ["java-ov-20", "java-ov-3"]);
  // Den enda oklara är den öppna: då väljs bland alla andra.
  const seen = every(solvedAll(["java-ov-3"]), "java-ov-3");
  assert.ok(!seen.has("java-ov-3") && !seen.has("java-ov-14"));
  assert.equal(seen.size, ids.length - 2);
});

test("slumpa: när alla är klara väljs bland alla utom den öppna och övning 14", () => {
  const seen = every(solvedAll(), "java-ov-5");
  assert.ok(!seen.has("java-ov-5") && !seen.has("java-ov-14"));
  assert.equal(seen.size, ids.length - 2);
});

test("slumpa: en oklar övning 14 räknas inte som oklar", () => {
  const seen = every(solvedAll(["java-ov-14"]), "java-ov-1");
  assert.ok(!seen.has("java-ov-14"));
  assert.equal(seen.size, ids.length - 2);
});
