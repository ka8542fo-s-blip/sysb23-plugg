// Övningskön: klar = två rätt i rad; grupper på svar (inte visningar);
// rotation efter tidsstämpel; karens på åtta serverade frågor som viker
// när kön är kortare.
import { test } from "node:test";
import assert from "node:assert/strict";
import { COOLDOWN, isDone, nextQuestion, orderCandidates, progressFor } from "../src/lib/practiceQueue.js";
import { recordAnswer, recordSeen, clearAnswersFor } from "../src/lib/storage.js";

const qs = Array.from({ length: 12 }, (_, i) => ({ id: `q${i + 1}`, topic: i < 6 ? "a" : "b" }));
const at = (n) => `2026-09-0${n}T10:00:00.000Z`;

test("klar är två rätt i rad, och äldre poster utan recent tolkas rätt", () => {
  assert.equal(isDone({ correct: 5, wrong: 0, last: "correct", recent: [true, true] }), true);
  assert.equal(isDone({ correct: 5, wrong: 1, last: "correct", recent: [false, true] }), false);
  assert.equal(isDone({ correct: 3, wrong: 0, last: "correct" }), false, "gammal post: ett känt svar");
  assert.equal(isDone(undefined), false);
  let a = recordAnswer({}, "q1", true);
  a = recordAnswer(a, "q1", true);
  assert.equal(isDone(a.q1), true);
  a = recordAnswer(a, "q1", false);
  assert.deepEqual(a.q1.recent, [true, false]);
  assert.equal(a.q1.seen, 0, "visningar räknas separat");
});

test("visningar är statistik: en visad men obesvarad fråga är fortfarande obesvarad", () => {
  const answers = recordSeen({}, "q1");
  assert.equal(answers.q1.seen, 1);
  const ordered = orderCandidates({ questions: qs, answers, order: "grupp" });
  assert.equal(ordered.length, 12);
  assert.equal(ordered[0].id, "q1", "obesvarad i kapitelordning, inte bortfallen");
});

test("fel först (äldst först), sedan obesvarade, sedan ett rätt; klara utelämnas", () => {
  const answers = {
    q1: { correct: 2, wrong: 0, last: "correct", lastAt: at(1), recent: [true, true] },
    q2: { correct: 0, wrong: 1, last: "wrong", lastAt: at(3), recent: [false] },
    q3: { correct: 1, wrong: 0, last: "correct", lastAt: at(2), recent: [true] },
    q4: { correct: 0, wrong: 2, last: "wrong", lastAt: at(2), recent: [false, false] },
    q5: { correct: 1, wrong: 1, last: "correct", lastAt: at(1), recent: [false, true] },
  };
  const ordered = orderCandidates({ questions: qs, answers, order: "grupp" }).map((q) => q.id);
  assert.deepEqual(ordered.slice(0, 2), ["q4", "q2"]);
  assert.deepEqual(ordered.slice(2, 9), ["q6", "q7", "q8", "q9", "q10", "q11", "q12"]);
  assert.deepEqual(ordered.slice(9), ["q5", "q3"]);
  assert.ok(!ordered.includes("q1"));
  assert.deepEqual(progressFor(qs, answers), { done: 1, total: 12 });
  const withDone = orderCandidates({ questions: qs, answers, order: "grupp", includeDone: true }).map((q) => q.id);
  assert.equal(withDone.at(-1), "q1");
});

test("karens: en fråga återkommer inte förrän åtta andra serverats", () => {
  const answers = { q1: { correct: 0, wrong: 1, last: "wrong", lastAt: at(1), recent: [false] } };
  assert.equal(COOLDOWN, 8);
  const recent = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8"];
  const next = nextQuestion({ questions: qs, answers, recent, order: "grupp" });
  assert.equal(next.id, "q9", "q1 är felbesvarad men i karens");
  const later = nextQuestion({ questions: qs, answers, recent: [...recent, "q9"], order: "grupp" });
  assert.equal(later.id, "q1", "efter åtta andra är q1 tillbaka först");
});

test("kort kö: regeln viker i stället för att ge tomt", () => {
  const few = qs.slice(0, 3);
  const next = nextQuestion({ questions: few, answers: {}, recent: ["q1", "q2", "q3"], order: "grupp" });
  assert.equal(next.id, "q1");
  assert.equal(nextQuestion({ questions: [], answers: {}, recent: [] }), null);
});

test("tentafokus lägger kärnämnen först inom varje grupp, aldrig före en annan grupp", () => {
  const answers = { q7: { correct: 0, wrong: 1, last: "wrong", lastAt: at(1), recent: [false] } };
  const ordered = orderCandidates({ questions: qs, answers, order: "grupp", examFocus: true, coreTopics: new Set(["b"]) }).map((q) => q.id);
  assert.equal(ordered[0], "q7");
  assert.deepEqual(ordered.slice(1, 6), ["q8", "q9", "q10", "q11", "q12"]);
});

test("nollställning tar bara delkursens frågor", () => {
  const answers = { q1: { correct: 1, wrong: 0 }, x1: { correct: 1, wrong: 0 } };
  assert.deepEqual(Object.keys(clearAnswersFor(answers, ["q1"])), ["x1"]);
});
