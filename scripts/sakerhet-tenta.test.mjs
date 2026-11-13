// Säkerhet i informationssystem: HT25:s tre tentor och frågebanken bakom
// dem (data/sakerhet). Läget Tentafrågor i Öva läser tentorna via
// lib/pastExams.js; fliken Tenta skriver en hel tenta.
import { test } from "node:test";
import assert from "node:assert/strict";
import { courses } from "../src/data/index.js";
import { examBank, correctIndexes } from "../src/data/sakerhet/examBank.js";
import { pastExams, ANSWER_TABLE } from "../src/data/sakerhet/pastExams.js";
import { examParts, occurrences, pastExamItems, partState, pointsLabel, tally, uniqueItems } from "../src/lib/pastExams.js";
import { EMPTY_PASS, passAnswers, recordPass } from "../src/lib/practiceQueue.js";
import { recordAnswer } from "../src/lib/storage.js";
import { isAccepted, shuffleQuestion, viewFor } from "../src/lib/shuffle.js";

const bank = Object.fromEntries(examBank.map((question) => [question.id, question]));
const sakerhet = courses.find((course) => course.id === "sakerhet");
const examById = Object.fromEntries(pastExams.map((exam) => [exam.id, exam]));
const ids = (examId) => examParts(examById[examId]).map((part) => part.question);

test("tre tentor med 20 frågor och 100 poäng var", () => {
  assert.deepEqual(pastExams.map((exam) => exam.id), ["sak-ht25-ord", "sak-ht25-om", "sak-ht25-upps"]);
  for (const exam of pastExams) {
    const parts = examParts(exam);
    assert.equal(parts.length, 20, exam.id);
    assert.deepEqual(parts.map((part) => part.no), Array.from({ length: 20 }, (_, i) => String(i + 1)), exam.id);
    assert.equal(parts.reduce((sum, part) => sum + part.points, 0), 100, exam.id);
  }
});

test("alla frågor i tentorna finns i banken, och alla 26 används", () => {
  const used = new Set(pastExams.flatMap((exam) => ids(exam.id)));
  for (const id of used) assert.ok(bank[id], `${id} finns i banken`);
  assert.equal(examBank.length, 26);
  assert.equal(new Set(examBank.map((question) => question.id)).size, 26, "unika id:n");
  assert.equal(used.size, 26, "varje bankfråga står på någon tenta");
  // 14 finns på alla tre (B2 säger 17, men sak-01, 02, 03 och 05 saknas i uppsamlingen).
  const inAll = examBank.filter((question) => pastExams.every((exam) => ids(exam.id).includes(question.id)));
  assert.equal(inAll.length, 14);
  for (const id of ["sak-01", "sak-02", "sak-03", "sak-05"]) assert.ok(!ids("sak-ht25-upps").includes(id), id);
});

test("tentaordningen är tentornas (B4)", () => {
  const short = (examId) => ids(examId).map((id) => id.slice(4)).join(" ");
  assert.equal(short("sak-ht25-ord"), "01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20");
  assert.equal(short("sak-ht25-om"), "01 02 03 04 05 21 07 08 09 10 11 12 13 14 15 16 17 18 22 20");
  assert.equal(short("sak-ht25-upps"), "04 23 20 11 18 16 24 22 12 17 25 14 08 10 09 07 26 13 15 21");
});

test("exakt ett rätt alternativ per fråga, utom sak-23 som har två", () => {
  for (const question of examBank) {
    const right = correctIndexes(question);
    assert.equal(right.length, question.id === "sak-23" ? 2 : 1, question.id);
    for (const index of right) assert.ok(question.options[index], `${question.id}: index ${index}`);
    assert.ok(question.explanation?.length > 40, `${question.id}: förklaring`);
  }
  // De två rätta i sak-23 är samma text bortsett från en punkt.
  const [a, b] = correctIndexes(bank["sak-23"]).map((index) => bank["sak-23"].options[index].text);
  assert.equal(a.replace(/\.$/, ""), b.replace(/\.$/, ""));
});

test("varje tentas alternativordning är en permutation av frågans alternativ", () => {
  for (const exam of pastExams) {
    for (const part of examParts(exam)) {
      const count = bank[part.question].options.length;
      assert.deepEqual([...part.order].sort((x, y) => x - y), Array.from({ length: count }, (_, i) => i), `${exam.id} ${part.no}`);
    }
  }
  for (const question of examBank) {
    assert.equal(question.options.length, ["sak-03", "sak-26"].includes(question.id) ? 3 : 4, question.id);
  }
});

test("poäng och avdrag följer frågan, med tentans specialfall", () => {
  for (const exam of pastExams) {
    for (const part of examParts(exam)) {
      assert.equal(part.points, bank[part.question].points, `${exam.id} ${part.no}`);
      assert.equal(part.penalty, bank[part.question].penalty, `${exam.id} ${part.no}`);
    }
  }
  // Publik nyckel: frågetexten säger 5 p, Totalpoäng 6.
  assert.deepEqual([bank["sak-16"].points, bank["sak-16"].penalty], [6, 2]);
  assert.ok(bank["sak-16"].note);
  // Inget avdrag angivet.
  for (const id of ["sak-01", "sak-02", "sak-03", "sak-23", "sak-24", "sak-26"]) assert.equal(bank[id].penalty, 0, id);
  // Ordinarien och omtentan: fråga 1–3 utan avdrag. Uppsamlingen: frågans egen rad gäller.
  for (const examId of ["sak-ht25-ord", "sak-ht25-om"]) {
    assert.deepEqual(examParts(examById[examId]).slice(0, 3).map((part) => part.penalty), [0, 0, 0], examId);
  }
  assert.deepEqual(examParts(examById["sak-ht25-upps"]).slice(0, 3).map((part) => part.penalty), [1, 0, 4]);
});

test("tabellen När lönar det sig att svara? stämmer med banken och räkningen", () => {
  for (const row of ANSWER_TABLE) {
    for (const [points, penalty] of row.pairs) {
      assert.equal(Math.round((100 * penalty) / (points + penalty)), row.percent, `${points}/${penalty}`);
    }
  }
  const inTable = new Set(ANSWER_TABLE.flatMap((row) => row.pairs.map(([p, d]) => `${p}/${d}`)));
  const inBank = new Set(examBank.map((question) => `${question.points}/${question.penalty}`));
  assert.deepEqual([...inBank].sort(), [...inTable].sort());
});

test("Öva: tentafrågorna hämtas ur examBank, 60 poster och 26 unika", () => {
  assert.equal(sakerhet.status, "aktiv");
  assert.equal(sakerhet.questions.length, 0, "inga kapitelfrågor än");
  const items = pastExamItems(sakerhet);
  assert.equal(items.length, 60);
  assert.equal(uniqueItems(items).length, 26);
  const first = items[0];
  assert.deepEqual([first.id, first.exam, first.no, first.points, first.penalty], ["sak-01", "sak-ht25-ord", "1", 5, 0]);
  assert.deepEqual(occurrences(items, "sak-04"), [
    { exam: "sak-ht25-ord", no: "4" },
    { exam: "sak-ht25-om", no: "4" },
    { exam: "sak-ht25-upps", no: "1" },
  ]);
  assert.equal(pointsLabel(bank["sak-08"]), "8 p · fel −4 p");
  assert.equal(pointsLabel(bank["sak-24"]), "5 p · inget avdrag");
  assert.equal(pointsLabel({ points: 5 }), "5 p", "BPM:s etikett är oförändrad");
});

test("samma fråga på flera tentor delar status, och Genomgången räknar unika", () => {
  const items = pastExamItems(sakerhet);
  let answers = recordAnswer({}, "sak-04", true);
  answers = recordAnswer(answers, "sak-04", true);
  const tiles = items.filter((item) => item.id === "sak-04").map((item) => partState(answers[item.id]));
  assert.deepEqual(tiles, ["klar", "klar", "klar"]);
  assert.equal(tally(uniqueItems(items), answers).done, 1);
  const pass = recordPass(EMPTY_PASS, "sak-20", true);
  const passStats = passAnswers(uniqueItems(items), pass);
  assert.equal(tally(uniqueItems(items), passStats).done, 1);
  assert.equal(tally(uniqueItems(items), passStats).total, 26);
});

test("flera rätta: blandningen följer med, och båda sak-23-alternativen godtas", () => {
  const question = bank["sak-23"];
  for (let i = 0; i < 50; i++) {
    const view = shuffleQuestion(question);
    assert.equal(view.accepted.length, 2);
    for (const index of view.accepted) assert.ok([2, 3].includes(view.options[index].originalIndex));
    assert.equal(view.correct, view.accepted[0]);
    for (const index of view.accepted) assert.ok(isAccepted(view, index));
    const wrong = view.options.findIndex((option) => option.originalIndex === 0);
    assert.equal(isAccepted(view, wrong), false);
  }
  // En fråga med ett rätt: som förut.
  const single = viewFor(bank["sak-01"], bank["sak-01"].options.map((option, originalIndex) => ({ ...option, originalIndex })));
  assert.deepEqual([single.correct, single.accepted], [2, [2]]);
  assert.equal(isAccepted(single, null), false);
});
