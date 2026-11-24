// Provtentor i årets format (Säkerhet): lib/yearExam.js drar en tenta ur
// kapitelfrågorna enligt manifestets yearExam, och fliken Tenta rättar den
// med lib/choiceExam.js plus essäernas egna bedömning. Poängen följer
// lärarens besked (Canvas 24 nov 2026): 3/3/5 p, −1 för fel, 15 p per essä.
import { test } from "node:test";
import assert from "node:assert/strict";
import { getCourse } from "../src/data/index.js";
import {
  drawYearExam,
  essayScore,
  focusChapterIds,
  withYearPoints,
  yearExamMax,
  yearExamPools,
  yearExamResult,
  yearExamTotal,
} from "../src/lib/yearExam.js";
import { examResult, writtenParts } from "../src/lib/choiceExam.js";

const real = getCourse("sakerhet");
const config = real.yearExam;

// En konstruerad delkurs med gott om frågor i varje pool: två föreläsningar
// och nio bokkapitel (sju av dem fokuskapitel), varianter av sex gamla frågor
// (två av en av dem).
function fakeCourse() {
  const chapters = [
    ...["f1", "f2"].map((id) => ({ id, kind: "forelasning" })),
    ...["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9"].map((id, i) => ({
      id, kind: "bok", ...(i < 7 ? { focus: [`ämne ${id}`] } : {}),
    })),
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
  const essays = ["e1", "e2", "e3", "e4", "e5"].map((id) => ({
    id,
    checklist: [{ heading: "A", points: ["a1", "a2"] }, { heading: "B", points: ["b1", "b2"] }],
  }));
  return { id: "fake", chapters, topics, questions, essays, yearExam: config };
}

test("manifestet följer lärarens poäng: 3/3/5 p, −1 för fel, 2 essäer à 15 p, 100 totalt, betyg med anmärkning", () => {
  assert.deepEqual(config.sections.map((s) => [s.pool, s.count, s.points, s.penalty]), [
    ["variant", 5, 3, 1],
    ["forelasning", 5, 3, 1],
    ["bok", 8, 5, 1],
  ]);
  assert.equal(config.sections.find((s) => s.pool === "bok").focus, 7);
  assert.equal(config.essays, 2);
  assert.equal(config.essayPoints, 15);
  assert.equal(yearExamMax(config), 70);
  assert.equal(yearExamTotal(config), 100);
  assert.equal(config.showGrade, true);
  assert.match(config.gradeNote, /inte bekräftade/);
  for (const field of ["intro", "rule", "pastNote"]) assert.ok(config[field]?.length > 40, field);
  assert.match(config.rule, /−1/);
});

test("lärarens fokuskapitel: bokkapitlen med focus-fält, minst de tio läraren pekat ut", () => {
  const focus = focusChapterIds(real);
  for (const id of ["bok2", "bok4", "bok6", "bok7", "bok8", "bok9", "bok14", "bok15", "bok16", "bok17"]) {
    assert.ok(focus.includes(id), id);
  }
  for (const id of focus) {
    const chapter = real.chapters.find((c) => c.id === id);
    assert.equal(chapter.kind, "bok", id);
    assert.ok(chapter.focus.every((text) => typeof text === "string" && text.length > 5), id);
  }
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
  assert.deepEqual(exam.sections.slice(0, 3).map((s) => s.pool), ["variant", "forelasning", "bok"]);
  const nos = exam.sections.flatMap((s) => s.parts.map((p) => p.no));
  assert.deepEqual(nos, Array.from({ length: 20 }, (_, i) => String(i + 1)));
  const ids = exam.sections.slice(0, 3).flatMap((s) => s.parts.map((p) => p.question));
  assert.equal(new Set(ids).size, 18);
  // Varianterna: högst en per gammal fråga.
  const byId = Object.fromEntries(course.questions.map((q) => [q.id, q]));
  const olds = variants.map((p) => byId[p.question].variantOf);
  assert.equal(new Set(olds).size, olds.length);
  // Föreläsningsfrågorna ur föreläsningarna, bokfrågorna ur boken.
  assert.ok(lectures.every((p) => /^f/.test(p.question)));
  assert.ok(book.every((p) => /^b/.test(p.question)));
  // Poäng ur manifestet, alternativordningen en permutation, essäerna ur essays.
  for (const [section, points] of [[variants, 3], [lectures, 3], [book, 5]]) {
    for (const p of section) {
      assert.deepEqual([p.points, p.penalty], [points, 1]);
      assert.deepEqual([...p.order].sort(), [0, 1, 2, 3]);
    }
  }
  assert.ok(essays.every((p) => course.essays.some((e) => e.id === p.essay)));
  assert.equal(new Set(essays.map((p) => p.essay)).size, 2);
  assert.equal(exam.title, "Provtenta 1");
  assert.equal(exam.generated, true);
});

test("bokdelen: 7 frågor ur fokuskapitlen, högst en per kapitel, och 1 ur övriga", () => {
  const course = fakeCourse();
  const focus = new Set(focusChapterIds(course));
  assert.equal(focus.size, 7);
  for (const seed of ["a", "b", "c", "d", "e"]) {
    const exam = drawYearExam(course, seed, 1, "2026-11-22T10:00:00Z");
    const chapters = exam.sections[2].parts.map((p) => p.question.split("-")[0]);
    const inFocus = chapters.filter((c) => focus.has(c));
    assert.equal(inFocus.length, 7, seed);
    assert.equal(new Set(inFocus).size, 7, `${seed}: en per fokuskapitel`);
  }
  // Den riktiga delkursen: minst 7 av 8 ur lärarens fokuskapitel.
  const realFocus = new Set(focusChapterIds(real));
  const chapterOf = Object.fromEntries(real.topics.map((t) => [t.id, t.chapter]));
  const byId = Object.fromEntries(real.questions.map((q) => [q.id, q]));
  for (const seed of ["x", "y", "z"]) {
    const exam = drawYearExam(real, seed, 1, "2026-11-22T10:00:00Z");
    const book = exam.sections.find((s) => s.pool === "bok").parts;
    assert.ok(book.filter((p) => realFocus.has(chapterOf[byId[p.question].topic])).length >= 7, seed);
  }
});

test("samma frö ger samma tenta, ett annat frö en annan", () => {
  const course = fakeCourse();
  const a = drawYearExam(course, "frö-1", 1, "2026-11-22T10:00:00Z");
  const b = drawYearExam(course, "frö-1", 1, "2026-11-22T10:00:00Z");
  const c = drawYearExam(course, "frö-2", 2, "2026-11-22T10:00:00Z");
  assert.deepEqual(a, b);
  assert.notDeepEqual(a.sections, c.sections);
});

test("den riktiga delkursen: rätt ger 70 p, fel ger −1 per fråga, essäerna efter egen bedömning", () => {
  const exam = drawYearExam(real, "riktig", 1, "2026-11-22T10:00:00Z");
  const parts = writtenParts(real, exam);
  assert.equal(parts.length, 18);
  const right = Object.fromEntries(parts.map((p) => [p.no, Array.isArray(p.item.correct) ? p.item.correct[0] : p.item.correct]));
  const wrong = Object.fromEntries(parts.map((p) => [p.no, (right[p.no] + 1) % p.item.options.length]));
  assert.equal(examResult(parts, right).points, 70);
  assert.equal(examResult(parts, wrong).points, -18);
  // Essäerna: allt ibockat ger 15 p var, inget ger 0.
  const essays = exam.sections.flatMap((s) => s.parts).filter((p) => p.essay)
    .map((p) => ({ ...p, essayItem: real.essays.find((e) => e.id === p.essay) }));
  const all = Object.fromEntries(essays.map((p) => [p.no, p.essayItem.checklist.flatMap((g) => g.points).map(() => true)]));
  const full = yearExamResult(config, parts, essays, { choices: right, checks: all });
  assert.deepEqual([full.points, full.max, full.grade, full.essayPoints], [100, 100, "A", 30]);
  const noEssays = yearExamResult(config, parts, essays, { choices: right, checks: {} });
  assert.deepEqual([noEssays.points, noEssays.max, noEssays.grade], [70, 100, "C"]);
});

test("essäpoängen är andelen ibockade punkter, avrundad", () => {
  const essay = { checklist: [{ heading: "A", points: ["1", "2"] }, { heading: "B", points: ["3", "4"] }] };
  assert.equal(essayScore(essay, [true, true, false, false], 15), 8);
  assert.equal(essayScore(essay, [true, false, false, false], 15), 4);
  assert.equal(essayScore(essay, [], 15), 0);
  assert.equal(essayScore(essay, [true, true, true, true], 15), 15);
});

test("en provtenta dragen med de gamla poängen får manifestets poäng, svaren rörs inte", () => {
  const course = fakeCourse();
  const fresh = drawYearExam(course, "gammal", 1, "2026-11-22T10:00:00Z");
  // Som den sparades före 24 nov: 1 p utan avdrag och sektioner utan pool.
  const old = {
    ...fresh,
    sections: fresh.sections.map(({ pool, ...section }) => ({
      ...section,
      parts: section.parts.map((p) => (p.question ? { ...p, points: 1, penalty: 0 } : p)),
    })),
  };
  const updated = withYearPoints(course.yearExam, old);
  assert.deepEqual(updated.sections, fresh.sections);
  assert.equal(updated.id, old.id);
  // En tenta som redan har rätt poäng lämnas som den är.
  assert.equal(withYearPoints(course.yearExam, fresh), fresh);
  // Förra årets tentor (inte dragna) rörs aldrig.
  const past = { id: "x", sections: old.sections };
  assert.equal(withYearPoints(course.yearExam, past), past);
});
