// Kortet "Hur långt du har kommit" i Statistik (Verksamhetsarkitektur):
// modulerna, Zachman utöver modul 4 och Fördjupning räknas ur samma lagring
// som Öva (answers, klar = två rätt i rad), Essä (essayState.done) och
// Zachman (modelProgress).
import { test } from "node:test";
import assert from "node:assert/strict";
import { getCourse } from "../src/data/index.js";
import { levelStats, moduleProgress } from "../src/lib/levels.js";

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

test("modulerna räknar klara Öva-frågor och genomgångna essäer, Zachman-delen fliken och essän", () => {
  const answers = { "ea-m12-1": done, "ea-m1-1": wrong, "ea-d5-2": done };
  const essayState = { "ea-e12-29": { done: true }, "ea-e-zachman": { done: true }, "ea-e1-9": { draft: "x" } };
  const modelProgress = { "zachman-minne": "solved", "zp-java": "solved" };
  const s = levelStats(course, { answers, essayState, modelProgress, troligtTaskIds: ids });
  assert.equal(s.karna.done, 2, "en klar fråga + en genomgången essä (utkast räknas inte)");
  assert.equal(s.troligt.done, 3, "två Zachman-uppgifter + Zachman-essän");
  assert.equal(s.fordjupning.done, 1);
});

test("per modul (Hem och Statistik): Öva-frågor och förklarakort i ordningen 12, 1–11", () => {
  const rows = moduleProgress(course, { "ea-m1-1": done, "ea-f-e1-9": done, "ea-f-e1-10": wrong });
  assert.deepEqual(rows.map((r) => r.number), [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  assert.equal(rows.reduce((t, r) => t + r.ova.total, 0), 135);
  assert.equal(rows.reduce((t, r) => t + r.cards.total, 0), 47);
  assert.deepEqual(rows[0].cards, { done: 0, total: 0 }, "Start här har inga förklarakort");
  const kap1 = rows.find((r) => r.chapterId === "kap1");
  assert.deepEqual(kap1.ova.done, 1);
  assert.deepEqual(kap1.cards, { done: 1, total: 2 });
});

test("Hem har tre steg i stället för introt", () => {
  assert.equal(course.homeSteps.length, 3);
  assert.match(course.homeSteps[0], /modulkortet/);
  assert.match(course.homeSteps[1], /förklarakort/);
  assert.match(course.homeSteps[2], /provtentorna.*när alla moduler är klara/);
});

test("rubrikerna är vanlig svenska, inte interna nivånamn", () => {
  const s = levelStats(course, { troligtTaskIds: ids });
  for (const level of [s.karna, s.troligt, s.fordjupning]) {
    assert.doesNotMatch(`${level.label} ${level.note}`, /Kärna|Troligt|UF|docx|HT25/, level.key);
    assert.ok(level.note.length > 0, level.key);
  }
});
