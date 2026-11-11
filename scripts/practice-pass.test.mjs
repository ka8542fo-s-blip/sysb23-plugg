// Genomgång i Öva: ett rätt räcker, fel kommer tillbaka, och varvet lever
// för sig så att inlärningens status (två rätt i rad) aldrig skrivs över.
import { test } from "node:test";
import assert from "node:assert/strict";
import { EMPTY_PASS, isDone, nextQuestion, passAnswers, progressFor, recordPass } from "../src/lib/practiceQueue.js";

const questions = ["a", "b", "c", "d"].map((id) => ({ id }));

test("ett rätt räcker för att en fråga ska vara avbetad", () => {
  const pass = recordPass(EMPTY_PASS, "a", true, "2026-11-11T10:00:00Z");
  assert.equal(isDone(passAnswers(questions, pass).a), true);
  assert.deepEqual(progressFor(questions, passAnswers(questions, pass)), { done: 1, total: 4 });
});

test("fel räknas inte och kommer tillbaka tills det blivit rätt", () => {
  let pass = recordPass(EMPTY_PASS, "b", false, "2026-11-11T10:00:00Z");
  assert.equal(isDone(passAnswers(questions, pass).b), false);
  assert.equal(passAnswers(questions, pass).b.last, "wrong");
  // Fel kommer först i kön (efter karensen), före obesvarade.
  const next = nextQuestion({ questions, answers: passAnswers(questions, pass), order: "grupp", recent: [] });
  assert.equal(next.id, "b");
  pass = recordPass(pass, "b", true, "2026-11-11T10:05:00Z");
  assert.equal(isDone(passAnswers(questions, pass).b), true);
  assert.deepEqual(pass.wrong, {});
});

test("avbetade frågor serveras inte igen, och ett helt varv tar slut", () => {
  let pass = EMPTY_PASS;
  for (const { id } of questions) pass = recordPass(pass, id, true);
  assert.equal(nextQuestion({ questions, answers: passAnswers(questions, pass), recent: [] }), null);
  assert.deepEqual(progressFor(questions, passAnswers(questions, pass)), { done: 4, total: 4 });
});

test("varvet rör inte inlärningens svar", () => {
  const answers = { a: { seen: 1, correct: 1, wrong: 0, last: "correct", lastAt: "x", recent: [true] } };
  const before = JSON.stringify(answers);
  recordPass(EMPTY_PASS, "a", true);
  passAnswers(questions, recordPass(EMPTY_PASS, "a", false));
  assert.equal(JSON.stringify(answers), before);
  assert.equal(isDone(answers.a), false);
});
