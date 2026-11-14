// Provtentorna i fliken Tenta (Verksamhetsarkitektur): varje modulfråga
// finns i exakt en provtenta, varje provtenta har två fritextfrågor,
// alternativens ordning är låst, och resultatet räknas per uppgift och modul.
import { test } from "node:test";
import assert from "node:assert/strict";
import { getCourse } from "../src/data/index.js";
import { MOCK_FREE_TEXT, mockExams } from "../src/data/arkitektur/mockExams.js";
import { questions } from "../src/data/arkitektur/questions.js";
import { buildMockExams, examParts, isStatement, lockedOrder, mockExamResult } from "../src/lib/mockExam.js";

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
    ["ea-e-zachman", "ea-e12-scenario-1"],
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
