// Provtentor i årets format (Säkerhet): lib/yearExam.js drar en tenta ur
// kapitelfrågorna enligt manifestets yearExam, och fliken Tenta rättar den
// med lib/choiceExam.js som vilken tenta som helst.
import { test } from "node:test";
import assert from "node:assert/strict";
import { getCourse } from "../src/data/index.js";
import { drawYearExam, yearExamMax, yearExamPools } from "../src/lib/yearExam.js";
import { examResult, writtenParts } from "../src/lib/choiceExam.js";

const real = getCourse("sakerhet");
const config = real.yearExam;

// En konstruerad delkurs med gott om frågor i varje pool: två föreläsningar
// och fem bokkapitel, varianter av sex gamla frågor (två av en av dem).
function fakeCourse() {
  const chapters = [
    ...["f1", "f2"].map((id) => ({ id, kind: "forelasning" })),
    ...["b1", "b2", "b3", "b4", "b5"].map((id) => ({ id, kind: "bok" })),
  ];
  const topics = chapters.map((c) => ({ id: `t-${c.id}`, chapter: c.id }));
  const q = (id, chapter, extra = {}) => ({
    id, topic: `t-${chapter}`, question: id, correct: 0,
    options: ["a", "b", "c", "d"].map((text) => ({ text })), ...extra,
  });
  const questions = [];
  for (const c of chapters) for (let i = 1; i <= 4; i++) questions.push(q(`${c.id}-${i}`, c.id));
  ["01", "02", "03", "04", "05", "06"].forEach((n, i) => questions.push(q(`v-${n}`, chapters[i % chapters.length].id, { variantOf: `sak-${n}` })));
  questions.push(q("v-01b", "b2", { variantOf: "sak-01" }));
  const essays = ["e1", "e2", "e3", "e4", "e5"].map((id) => ({ id, checklist: [] }));
  return { id: "fake", chapters, topics, questions, essays, yearExam: config };
}

test("manifestet: 5 varianter, 5 föreläsningsfrågor, 8 bokfrågor à 1 p utan avdrag, 2 essäer, inget betyg", () => {
  assert.deepEqual(config.sections.map((s) => [s.pool, s.count, s.points, s.penalty]), [
    ["variant", 5, 1, 0],
    ["forelasning", 5, 1, 0],
    ["bok", 8, 1, 0],
  ]);
  assert.equal(config.essays, 2);
  assert.equal(config.showGrade, false);
  assert.equal(yearExamMax(config), 18);
  for (const field of ["intro", "rule", "pastNote"]) assert.ok(config[field]?.length > 40, field);
});

test("poolerna delar kapitelfrågorna utan överlapp: varianter, föreläsningar, boken", () => {
  const pools = yearExamPools(real);
  const all = [...pools.variant, ...pools.forelasning, ...pools.bok].map((q) => q.id);
  assert.equal(new Set(all).size, all.length, "ingen fråga i två pooler");
  assert.equal(all.length, real.questions.length, "varje kapitelfråga i någon pool");
  assert.ok(pools.variant.every((q) => q.variantOf));
  assert.ok(pools.forelasning.length >= 5, "tillräckligt med föreläsningsfrågor");
});

test("en dragen provtenta har rätt antal ur varje pool, numrerad 1–20, utan dubbletter", () => {
  const course = fakeCourse();
  const exam = drawYearExam(course, "frö-1", 1, "2026-11-22T10:00:00Z");
  const [variants, lectures, book, essays] = exam.sections.map((s) => s.parts);
  assert.deepEqual([variants.length, lectures.length, book.length, essays.length], [5, 5, 8, 2]);
  const nos = exam.sections.flatMap((s) => s.parts.map((p) => p.no));
  assert.deepEqual(nos, Array.from({ length: 20 }, (_, i) => String(i + 1)));
  const ids = exam.sections.slice(0, 3).flatMap((s) => s.parts.map((p) => p.question));
  assert.equal(new Set(ids).size, 18);
  // Varianterna: högst en per gammal fråga.
  const byId = Object.fromEntries(course.questions.map((q) => [q.id, q]));
  const olds = variants.map((p) => byId[p.question].variantOf);
  assert.equal(new Set(olds).size, olds.length);
  // Föreläsningsfrågorna ur föreläsningarna, bokfrågorna ur boken och spridda.
  assert.ok(lectures.every((p) => /^f/.test(p.question)));
  assert.ok(book.every((p) => /^b/.test(p.question)));
  const perChapter = {};
  for (const p of book) perChapter[p.question.split("-")[0]] = (perChapter[p.question.split("-")[0]] || 0) + 1;
  assert.ok(Math.max(...Object.values(perChapter)) <= 2, "bokfrågorna spridda över kapitlen");
  // Poäng ur manifestet, alternativordningen en permutation, essäerna ur essays.
  for (const p of exam.sections.slice(0, 3).flatMap((s) => s.parts)) {
    assert.deepEqual([p.points, p.penalty], [1, 0]);
    assert.deepEqual([...p.order].sort(), [0, 1, 2, 3]);
  }
  assert.ok(essays.every((p) => course.essays.some((e) => e.id === p.essay)));
  assert.equal(new Set(essays.map((p) => p.essay)).size, 2);
  assert.equal(exam.title, "Provtenta 1");
  assert.equal(exam.generated, true);
});

test("samma frö ger samma tenta, ett annat frö en annan", () => {
  const course = fakeCourse();
  const a = drawYearExam(course, "frö-1", 1, "2026-11-22T10:00:00Z");
  const b = drawYearExam(course, "frö-1", 1, "2026-11-22T10:00:00Z");
  const c = drawYearExam(course, "frö-2", 2, "2026-11-22T10:00:00Z");
  assert.deepEqual(a, b);
  assert.notDeepEqual(a.sections, c.sections);
});

test("den riktiga delkursen: provtentan rättas av choiceExam med 1 p per fråga", () => {
  const exam = drawYearExam(real, "riktig", 1, "2026-11-22T10:00:00Z");
  const parts = writtenParts(real, exam);
  assert.ok(parts.length > 0 && parts.every((p) => p.points === 1 && p.penalty === 0));
  const right = Object.fromEntries(parts.map((p) => [p.no, Array.isArray(p.item.correct) ? p.item.correct[0] : p.item.correct]));
  const result = examResult(parts, right);
  assert.equal(result.points, parts.length);
  assert.equal(result.max, parts.length);
  // Fel svar kostar inget.
  const wrong = Object.fromEntries(parts.map((p) => [p.no, (right[p.no] + 1) % p.item.options.length]));
  assert.equal(examResult(parts, wrong).points, 0);
});
