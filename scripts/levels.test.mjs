// Kortet "Hur långt du har kommit" i Statistik (Verksamhetsarkitektur):
// modulerna, Zachman utöver modul 4 och Fördjupning räknas ur samma lagring
// som Öva (answers, klar = två rätt i rad), Essä (essayState.done) och
// Zachman (modelProgress).
import { test } from "node:test";
import assert from "node:assert/strict";
import { getCourse } from "../src/data/index.js";
import { levelStats, moduleProgress } from "../src/lib/levels.js";
import { zachmanTasks } from "../src/data/arkitektur/zachman.js";
import { extraQuestions } from "../src/data/arkitektur/questions.js";

const course = getCourse("arkitektur");
// levelStats visas inte längre (2026-11-21) men finns kvar; den testas med
// docx-frågorna inlagda, som när kortet visades.
const legacy = { ...course, extraQuestions };
// levels finns inte längre i manifestet (2026-11-21); funktionen testas
// med Zachman-flikens id:n direkt.
const ids = zachmanTasks.map((task) => task.id);
const done = { correct: 2, wrong: 0, last: "correct", recent: [true, true] };
const wrong = { correct: 0, wrong: 1, last: "wrong", recent: [false] };

test("tom lagring: allt 0 av rätt antal", () => {
  const s = levelStats(legacy, { troligtTaskIds: ids });
  assert.deepEqual([s.karna.done, s.karna.total], [0, 136 + 53]);
  assert.deepEqual([s.troligt.done, s.troligt.total], [0, ids.length + 1]);
  assert.equal(ids.length, 58, "57 placeringsuppgifter och memoreringen");
  assert.deepEqual([s.fordjupning.done, s.fordjupning.total], [0, 82]);
});

test("modulerna räknar klara Öva-frågor och genomgångna essäer, Zachman-delen fliken och essän", () => {
  const answers = { "ea-m12-1": done, "ea-m1-1": wrong, "ea-d5-2": done };
  const essayState = { "ea-e12-29": { done: true }, "ea-e-zachman": { done: true }, "ea-e1-9": { draft: "x" } };
  const modelProgress = { "zachman-minne": "solved", "zp-java": "solved" };
  const s = levelStats(legacy, { answers, essayState, modelProgress, troligtTaskIds: ids });
  assert.equal(s.karna.done, 2, "en klar fråga + en genomgången essä (utkast räknas inte)");
  assert.equal(s.troligt.done, 3, "två Zachman-uppgifter + Zachman-essän");
  assert.equal(s.fordjupning.done, 1);
});

// Sedan 2026-11-22 (fliken Moduler): ordningen 1–12, 53 fritextfrågor, och
// en fritextfråga räknas när senaste bedömningen är Kunde.
test("per modul (Hem och Statistik): frågor klara och fritextfrågor Kunde i ordningen 1–12", () => {
  const onceKunde = { correct: 1, wrong: 0, last: "correct", recent: [true] };
  const answers = { "ea-m1-1": done, "ea-m1-2": onceKunde, "ea-f-e1-9": onceKunde, "ea-f-e1-10": wrong };
  const rows = moduleProgress(course, answers);
  assert.deepEqual(rows.map((r) => r.number), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  assert.equal(rows.reduce((t, r) => t + r.ova.total, 0), 136);
  assert.equal(rows.reduce((t, r) => t + r.cards.total, 0), 53);
  const kap1 = rows.find((r) => r.chapterId === "kap1");
  assert.equal(kap1.ova.done, 1, "en fråga är klar först efter två rätt i rad, som i Öva");
  assert.deepEqual(kap1.cards, { done: 1, total: 2 }, "ett Kunde räcker för en fritextfråga");
  const kap7 = rows.find((r) => r.chapterId === "kap7");
  assert.deepEqual([kap7.ova.total, kap7.cards.total], [20, 8], "fråga 20–22 och essä 24 och 27 i modul 7");
  assert.equal(rows.find((r) => r.chapterId === "kap12").cards.total, 17);
});

test("Hem har en mening om lärarens tre moduldokument och var man börjar", () => {
  assert.equal(course.homeSteps, undefined, "de tre stegen visas inte");
  assert.match(course.homeIntro, /lärarens tre moduldokument, översatt till svenska/);
  assert.match(course.homeIntro, /Börja i Moduler och fortsätt sedan i Öva/);
});

test("rubrikerna är vanlig svenska, inte interna nivånamn", () => {
  const s = levelStats(legacy, { troligtTaskIds: ids });
  for (const level of [s.karna, s.troligt, s.fordjupning]) {
    assert.doesNotMatch(`${level.label} ${level.note}`, /Kärna|Troligt|UF|docx|HT25/, level.key);
    assert.ok(level.note.length > 0, level.key);
  }
});
