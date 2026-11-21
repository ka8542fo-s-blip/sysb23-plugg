// Provtentorna i fliken Tenta (Verksamhetsarkitektur): varje modulfråga
// finns i exakt en provtenta, varje provtenta har två fritextfrågor,
// alternativens ordning är låst, och resultatet räknas per uppgift och modul.
import { test } from "node:test";
import assert from "node:assert/strict";
import { getCourse } from "../src/data/index.js";
import { MOCK_FREE_TEXT, mockExams } from "../src/data/arkitektur/mockExams.js";
import { ufQuestions } from "../src/data/arkitektur/ufView.js";
// Provtentorna bygger på modulfrågorna, inte exempelfrågan (2026-11-21).
const questions = ufQuestions.filter((q) => !q.example);
import { buildMockExams, examParts, isStatement, lockedOrder, migrateMockState, mockExamResult } from "../src/lib/mockExam.js";

const course = getCourse("arkitektur");
const choiceParts = (exam) => exam.tasks.filter((task) => task.no !== 1).flatMap((task) => task.parts);

test("tre provtentor i manifestet och fliken Tenta", () => {
  assert.equal(course.mockExams, mockExams);
  assert.equal(mockExams.length, 3);
  assert.ok(course.views.includes("tenta"));
  assert.match(course.mockExamNote, /0 poäng/);
});

test("varje modulfråga finns i exakt en provtenta", () => {
  const ids = mockExams.flatMap((exam) => choiceParts(exam).map((part) => part.item.id));
  assert.equal(ids.length, questions.length);
  assert.equal(new Set(ids).size, questions.length);
});

test("varje provtenta har två fritextfrågor: en essä och ett scenario, i den angivna ordningen", () => {
  mockExams.forEach((exam, index) => {
    const free = exam.tasks[0].parts;
    assert.equal(free.length, 2, exam.id);
    assert.deepEqual(free.map((part) => part.essay.id), MOCK_FREE_TEXT[index]);
    assert.ok(free.every((part) => part.kind === "fritext"));
  });
  assert.deepEqual(MOCK_FREE_TEXT, [
    ["ea-e12-essay-2", "ea-e12-scenario-1"],
    ["ea-e12-essay-3", "ea-e12-scenario-2"],
    ["ea-e12-essay-4", "ea-e12-slututmaning"],
  ]);
});

test("uppgift 2 är flerval (med Zachman or TOGAF), uppgift 3 sant/falskt", () => {
  for (const exam of mockExams) {
    assert.ok(exam.tasks[1].parts.every((part) => !isStatement(part.item)), exam.id);
    assert.ok(exam.tasks[2].parts.every((part) => isStatement(part.item)), exam.id);
  }
  const pairs = mockExams.flatMap((exam) => exam.tasks[1].parts.filter((part) => /^Zachman or TOGAF\?/.test(part.item.question)));
  assert.equal(pairs.length, 6);
});

test("ungefär en tredjedel av varje moduls frågor per provtenta", () => {
  const counts = {};
  for (const [index, exam] of mockExams.entries()) {
    for (const part of choiceParts(exam)) {
      const key = `${part.chapter}:${isStatement(part.item) ? "sant" : "val"}`;
      counts[key] ||= [0, 0, 0];
      counts[key][index]++;
    }
  }
  for (const [key, list] of Object.entries(counts)) {
    assert.ok(Math.max(...list) - Math.min(...list) <= 1, `${key}: ${list}`);
  }
});

test("alternativens ordning är låst: samma vid varje bygge, en permutation, sant/falskt orört", () => {
  const again = buildMockExams({
    questions,
    essays: [],
    chapterOf: (q) => mockExams.flatMap(choiceParts).find((part) => part.item.id === q.id).chapter,
    chapterOrder: course.chapters.map((c) => c.id),
    freeText: [],
  });
  for (const [index, exam] of mockExams.entries()) {
    const other = Object.fromEntries(choiceParts(again[index]).map((part) => [part.item.id, part.order]));
    for (const part of choiceParts(exam)) {
      assert.deepEqual(part.order, other[part.item.id], part.item.id);
      assert.deepEqual([...part.order].sort(), part.item.options.map((_, i) => i), part.item.id);
      if (part.item.fixedOrder) assert.deepEqual(part.order, part.item.options.map((_, i) => i));
    }
  }
  const q = questions.find((item) => !item.fixedOrder);
  assert.deepEqual(lockedOrder(q, "x"), lockedOrder(q, "x"));
});

test("resultatet: x av y rätt per uppgift och fel per modul i kursens ordning", () => {
  const exam = mockExams[0];
  const order = course.chapters.map((c) => c.id);
  const [first, second] = exam.tasks[1].parts;
  const choices = {
    [first.no]: Array.isArray(first.item.correct) ? first.item.correct[0] : first.item.correct,
    [second.no]: (Array.isArray(second.item.correct) ? second.item.correct[0] : second.item.correct) === 0 ? 1 : 0,
  };
  const result = mockExamResult(exam, { choices, texts: { "1a": "text" }, checks: { "1a": { "0:0": true } }, submittedAt: "x" }, order);
  assert.equal(result.tasks[2].right, 1);
  assert.equal(result.tasks[2].total, exam.tasks[1].parts.length);
  assert.equal(result.tasks[3].right, 0);
  assert.equal(result.tasks[1].checked, 1);
  assert.equal(result.answered, 3);
  const chapters = result.wrongByChapter.map((group) => group.chapterId);
  assert.deepEqual(chapters, [...chapters].sort((a, b) => order.indexOf(a) - order.indexOf(b)));
  const allWrong = result.wrongByChapter.flatMap((group) => group.parts);
  assert.ok(!allWrong.includes(first.no));
  assert.ok(allWrong.includes(second.no));
  assert.equal(allWrong.length, choiceParts(exam).length - 1, "fel och obesvarade räknas");
  assert.equal(examParts(exam).length, choiceParts(exam).length + 2);
});

test("provtentorna innehåller bara id:n som finns i Öva eller bland förklarakorten", () => {
  const ova = new Set(course.questions.map((q) => q.id));
  const onCards = new Set(course.explainCards.flatMap((card) => card.essayIds));
  for (const exam of mockExams) {
    for (const part of examParts(exam)) {
      if (part.kind === "fritext") assert.ok(onCards.has(part.essay.id), `${exam.id} ${part.no}: ${part.essay.id}`);
      else assert.ok(ova.has(part.item.id), `${exam.id} ${part.no}: ${part.item.id}`);
    }
  }
});

test("Zachman-essäns text i provtenta 1 flyttas undan, och val utanför alternativen släpps", () => {
  const exam = mockExams[0];
  assert.deepEqual(exam.previousFreeText, { "1a": "ea-e-zachman" });
  const m12 = choiceParts(exam).find((part) => part.item.id === "ea-m12-3");
  const old = { choices: { ...(m12 ? { [m12.no]: 3 } : {}) }, texts: { "1a": "Rader och kolumner", "1b": "AI" }, checks: { "1a": { "0:0": true } }, submittedAt: null };
  const next = migrateMockState(exam, old);
  assert.equal(next.texts["1a"], undefined, "visas inte under Essay 2");
  assert.equal(next.texts["1a@ea-e-zachman"], "Rader och kolumner", "men finns kvar");
  assert.deepEqual(next.checks["1a@ea-e-zachman"], { "0:0": true });
  assert.equal(next.texts["1b"], "AI");
  assert.equal(next.freeText["1a"], "ea-e12-essay-2");
  if (m12) assert.equal(next.choices[m12.no], undefined, "alternativ D finns inte längre");
  // Ny text på Essay 2 flyttas inte igen.
  const again = migrateMockState(exam, { ...next, texts: { ...next.texts, "1a": "Zachman klassificerar" } });
  assert.equal(again.texts["1a"], "Zachman klassificerar");
});
