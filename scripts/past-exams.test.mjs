// Tentafrågor i Öva: listan över gamla tentor (data/<kurs>/pastExams.js)
// och logiken i lib/pastExams.js.
import { test } from "node:test";
import assert from "node:assert/strict";
import { courses } from "../src/data/index.js";
import {
  examParts,
  partState,
  pastExamItems,
  pointsSummary,
  tally,
} from "../src/lib/pastExams.js";
import { taskToQuestion } from "../src/lib/examPlan.js";
import { orderCandidates } from "../src/lib/practiceQueue.js";
import { shuffleQuestion } from "../src/lib/shuffle.js";

const bpm = courses.find((course) => course.id === "process");
const examById = (id) => bpm.pastExams.find((exam) => exam.id === id);

test("varje del pekar på exakt en post som finns, och numren är unika", () => {
  const examIds = courses.flatMap((course) => (course.pastExams || []).map((exam) => exam.id));
  assert.equal(new Set(examIds).size, examIds.length, "tent-id:n är unika");
  for (const course of courses) {
    for (const exam of course.pastExams || []) {
      assert.match(exam.date, /^\d{4}-\d{2}-\d{2}$/, exam.id);
      const nos = examParts(exam).map((part) => part.no);
      assert.equal(new Set(nos).size, nos.length, `${exam.id}: dubbla nummer`);
      for (const part of examParts(exam)) {
        const keys = ["question", "task", "essay"].filter((key) => part[key]);
        assert.equal(keys.length, 1, `${exam.id} ${part.no}: en post per del`);
        const pool = { question: course.questions, task: course.bpmnTasks, essay: course.essays }[keys[0]];
        assert.ok(pool?.some((item) => item.id === part[keys[0]]), `${exam.id} ${part.no}: ${part[keys[0]]} finns`);
        if (part.run) assert.ok(course.bpmnTasks.some((task) => task.id === part.run), `${part.run} finns`);
        assert.ok(part.points > 0, `${exam.id} ${part.no}: poäng`);
      }
    }
  }
});

test("BPM-tentorna har tentans poäng, 100 p var", () => {
  const points = (id) => examParts(examById(id)).map((part) => part.points);
  assert.deepEqual(points("bpm-ht25-ord"), [15, 15, ...Array(10).fill(5), 3, 6, 7, 4]);
  assert.deepEqual(points("bpm-ht25-om"), [15, 15, ...Array(10).fill(5), 5, 3, 7, 5]);
  for (const exam of bpm.pastExams) {
    assert.equal(examParts(exam).reduce((sum, part) => sum + part.points, 0), 100, exam.id);
  }
});

test("alla 25 bpm-t-frågor står på sin plats, och källan säger samma nummer", () => {
  const placed = new Map();
  for (const exam of bpm.pastExams) {
    for (const part of examParts(exam)) if (part.question) placed.set(part.question, { exam, part });
  }
  const bankExamQuestions = bpm.questions.filter((question) => /^bpm-t\d+$/.test(question.id));
  assert.equal(bankExamQuestions.length, 25);
  for (const question of bankExamQuestions) {
    const slot = placed.get(question.id);
    assert.ok(slot, `${question.id} saknas i tentalistan`);
    const match = question.source.match(/^Tenta HT25 (?:ord (\d\([a-j]\))|omtenta (?:fråga )?(\d{1,2}))/);
    assert.ok(match, `${question.id}: källan "${question.source}"`);
    const [, ordNo, omNo] = match;
    assert.equal(slot.exam.id, ordNo ? "bpm-ht25-ord" : "bpm-ht25-om", question.id);
    assert.equal(slot.part.no, ordNo || omNo, question.id);
  }
});

test("egna frågor som bara nämner tentan räknas inte", () => {
  const referenced = bpm.pastExams.flatMap((exam) => examParts(exam).map((part) => part.question)).filter(Boolean);
  assert.ok(referenced.every((id) => /^bpm-t\d+$/.test(id)), "bara bpm-t-frågor");
  for (const id of ["bpm-q33", "bpm-q35", "bpm-q43", "bpm-q53"]) assert.ok(!referenced.includes(id), id);
});

test("körfrågorna räknas en gång: banken där den finns, annars BPMN-övningar", () => {
  const tasks = bpm.pastExams.flatMap((exam) => examParts(exam).map((part) => part.task)).filter(Boolean);
  assert.deepEqual(tasks.sort(), ["kp-3c", "kp-om13", "kp-om15"]);
  const items = pastExamItems(bpm);
  assert.equal(items.length, 28);
  assert.equal(new Set(items.map((item) => item.id)).size, 28, "ingen fråga två gånger");
  for (const id of ["kp-3b", "kp-3d", "kp-om16"]) assert.ok(!items.some((item) => item.id === id), id);
  assert.deepEqual(
    items.filter((item) => item.run).map((item) => [item.no, item.run]),
    [["3(b)", "kp-3b"], ["3(c)", "kp-3c"], ["3(d)", "kp-3d"], ["13", "kp-om13"], ["15", "kp-om15"], ["16", "kp-om16"]],
  );
});

test("posterna bär tenta, nummer och poäng men inte svårighet eller källtext", () => {
  const items = pastExamItems(bpm);
  const first = items[0];
  assert.equal(first.id, "bpm-t01");
  assert.equal(first.exam, "bpm-ht25-ord");
  assert.equal(first.no, "2(a)");
  assert.equal(first.points, 5);
  assert.equal(first.section, "BPM");
  assert.equal(first.difficulty, undefined);
  assert.equal(first.source, undefined);
  // Tentornas ordning: ordinarien (nov 2025) före omtentan (jan 2026).
  assert.equal(items[13].no, "3(d)");
  assert.equal(items[14].no, "3");
  const ordered = orderCandidates({ questions: items, answers: {}, order: "grupp" });
  assert.deepEqual(ordered.slice(0, 3).map((item) => item.no), ["2(a)", "2(b)", "2(c)"]);
});

test("BPMN-uppgifterna blandas med Inget av övriga sist, och rätt svar följer med", () => {
  const items = pastExamItems(bpm);
  for (const id of ["kp-3c", "kp-om15"]) {
    const item = items.find((entry) => entry.id === id);
    const correctText = item.options[item.correct].text;
    for (let i = 0; i < 50; i++) {
      const view = shuffleQuestion(item);
      assert.equal(view.options.at(-1).text, "Inget av övriga alternativ", id);
      assert.equal(view.options[view.correct].text, correctText, id);
    }
  }
});

test("taskToQuestion behåller deluppgiftens bokstav men tar bort sidhänvisningar", () => {
  const task = (id) => bpm.bpmnTasks.find((entry) => entry.id === id);
  assert.equal(taskToQuestion(task("kp-3c")).source, "Tenta HT25 ord 3(c)");
  assert.equal(taskToQuestion(task("kp-om15")).source, "Tenta HT25 omtenta fråga 15");
  const own = bpm.bpmnTasks.find((entry) => / \(genomgången/.test(entry.source));
  assert.ok(own && !taskToQuestion(own).source.includes("("), own?.source);
});

test("status per del och summering", () => {
  assert.equal(partState(undefined), "obesvarad");
  assert.equal(partState({ correct: 0, wrong: 0, seen: 3 }), "obesvarad");
  assert.equal(partState({ correct: 0, wrong: 1, last: "wrong", recent: [false] }), "fel");
  assert.equal(partState({ correct: 1, wrong: 0, last: "correct", recent: [true] }), "ett-ratt");
  assert.equal(partState({ correct: 2, wrong: 0, last: "correct", recent: [true, true] }), "klar");
  const items = [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }];
  const answers = {
    a: { correct: 2, wrong: 0, last: "correct", recent: [true, true] },
    b: { correct: 0, wrong: 1, last: "wrong", recent: [false] },
    c: { correct: 1, wrong: 0, last: "correct", recent: [true] },
  };
  assert.deepEqual(tally(items, answers), { total: 4, done: 1, wrong: 1, pending: 1, unseen: 1 });
  assert.equal(pointsSummary([{ points: 5 }, { points: 5 }]), "2 × 5 p");
  assert.equal(pointsSummary([{ points: 3 }, { points: 7 }, { points: 4 }]), "3–7 p");
});

test("läget finns bara där det finns tentafrågor att visa", () => {
  assert.ok(pastExamItems(bpm).length > 0);
  for (const id of ["strategi", "databaser"]) {
    assert.equal(pastExamItems(courses.find((course) => course.id === id)).length, 0, id);
  }
});
