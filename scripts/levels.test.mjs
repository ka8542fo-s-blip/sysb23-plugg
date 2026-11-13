// Nivåerna Kärna, Troligt och Fördjupning (fliken Tentan och Statistik):
// staplarna, modulstatusen och svaga punkter räknas ur samma lagring som
// Öva (answers, klar = två rätt i rad), Essä (essayState.done) och Zachman
// (modelProgress).
import { test } from "node:test";
import assert from "node:assert/strict";
import { getCourse } from "../src/data/index.js";
import { levelStats, moduleStatus, weakPoints } from "../src/lib/levels.js";

const course = getCourse("arkitektur");
const ids = course.levels.troligtTaskIds;
const done = { correct: 2, wrong: 0, last: "correct", recent: [true, true] };
const wrong = { correct: 0, wrong: 1, last: "wrong", recent: [false] };

test("tom lagring: allt 0 av rätt antal", () => {
  const s = levelStats(course, { troligtTaskIds: ids });
  assert.deepEqual([s.karna.done, s.karna.total], [0, 135 + 53]);
  assert.deepEqual([s.troligt.done, s.troligt.total], [0, ids.length + 1]);
  assert.equal(ids.length, 58, "57 placeringsuppgifter och memoreringen");
  assert.deepEqual([s.fordjupning.done, s.fordjupning.total], [0, 82]);
});

test("Kärna räknar klara modulfrågor och genomgångna essäer, Troligt Zachman och Zachman-essän", () => {
  const answers = { "ea-m12-1": done, "ea-m1-1": wrong, "ea-d5-2": done };
  const essayState = { "ea-e12-29": { done: true }, "ea-e-zachman": { done: true }, "ea-e1-9": { draft: "x" } };
  const modelProgress = { "zachman-minne": "solved", "zp-java": "solved" };
  const s = levelStats(course, { answers, essayState, modelProgress, troligtTaskIds: ids });
  assert.equal(s.karna.done, 2, "en klar fråga + en genomgången essä (utkast räknas inte)");
  assert.equal(s.troligt.done, 3, "två Zachman-uppgifter + Zachman-essän");
  assert.equal(s.fordjupning.done, 1);
});

test("modulstatus: tolv rader i ordningen 12, 1–11, klar när Öva och essäer är klara", () => {
  const rows = moduleStatus(course, {});
  assert.deepEqual(rows.map((r) => r.number), [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  assert.equal(rows.reduce((t, r) => t + r.ova.total, 0), 135);
  assert.equal(rows.reduce((t, r) => t + r.essa.total, 0), 53, "Zachman-essän (Troligt) räknas inte i modulerna");
  const kap8 = rows.find((r) => r.chapterId === "kap8");
  assert.equal(kap8.ova.total, 10, "modul 7:s fråga 20–22 hör till kapitel 8");
  // Gör modul 1 klar: alla frågor två rätt, alla essäer genomgångna, kapitlet läst.
  const q1 = course.questions.filter((q) => q.topic === "enterprise");
  const e1 = course.essays.filter((e) => e.chapter === "kap1" && !e.level);
  const answers = Object.fromEntries(q1.map((q) => [q.id, done]));
  const essayState = Object.fromEntries(e1.map((e) => [e.id, { done: true }]));
  const row = moduleStatus(course, { answers, essayState, readChapters: { kap1: true } }).find((r) => r.chapterId === "kap1");
  assert.deepEqual(row.ova, { done: q1.length, total: q1.length });
  assert.equal(row.read, true);
  assert.equal(row.complete, true);
  const half = moduleStatus(course, { answers, essayState: {} }).find((r) => r.chapterId === "kap1");
  assert.equal(half.complete, false, "essäerna inte genomgångna");
  assert.equal(half.firstOpenEssay, e1[0].id);
});

test("svaga punkter: senaste svaret fel, per modul i kursens ordning, Kärna och Fördjupning isär", () => {
  const answers = { "ea-m1-1": wrong, "ea-m12-2": wrong, "ea-d1-3": wrong, "ea-m2-1": done, "ea-m3-1": { ...wrong, last: "correct", recent: [false, true] } };
  const groups = weakPoints(course, answers);
  assert.deepEqual(groups.map((g) => g.number), [12, 1]);
  assert.deepEqual(groups[1].items.map((i) => [i.id, i.bank]), [["ea-m1-1", "karna"], ["ea-d1-3", "fordjupning"]]);
});
