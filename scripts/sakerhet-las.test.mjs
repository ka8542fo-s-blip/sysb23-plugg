// Säkerhet i informationssystem: Läs (kapitel, sammanfattning, ordlista) och
// Öva (kapitelfrågor och varianterna av förra årets tentafrågor).
import { test } from "node:test";
import assert from "node:assert/strict";
import { getCourse } from "../src/data/index.js";
import { examBank } from "../src/data/sakerhet/examBank.js";
import { questions } from "../src/data/sakerhet/questions.js";
import { chapters, glossary, summary, intro, examNote, ORDER } from "../src/data/sakerhet/reading.js";
import { topics } from "../src/data/sakerhet/topics.js";

const course = getCourse("sakerhet");
const bank = Object.fromEntries(examBank.map((question) => [question.id, question]));
const chapterOfTopic = Object.fromEntries(topics.map((topic) => [topic.id, topic.chapter]));

test("kapitlen: föreläsningar först, sedan boken, med kind, label och examArea", () => {
  assert.deepEqual(chapters.map((c) => c.id), ORDER);
  const kinds = chapters.map((c) => c.kind);
  for (const kind of kinds) assert.ok(["forelasning", "bok"].includes(kind), kind);
  // Ingen föreläsning efter ett bokkapitel.
  const firstBook = kinds.indexOf("bok");
  if (firstBook !== -1) assert.ok(kinds.slice(firstBook).every((k) => k === "bok"), "föreläsningarna står först");
  for (const chapter of chapters) {
    assert.ok(chapter.label, `${chapter.id}: label`);
    if (chapter.kind === "bok") assert.match(chapter.label, /^Bokens kapitel \d+$/, chapter.id);
    assert.equal(chapter.examArea, chapter.kind === "bok" ? "Bokfrågor" : "Föreläsningsfrågor", chapter.id);
    assert.ok(chapter.lead && chapter.body && chapter.readingMinutes > 0 && chapter.sources?.length, chapter.id);
  }
  assert.ok(chapters.filter((c) => c.kind === "forelasning").length >= 3);
});

test("varje kapitel har ett ämne, frågor och ordlistetermer", () => {
  for (const chapter of chapters) {
    assert.ok(topics.some((t) => t.chapter === chapter.id), `${chapter.id}: ämne`);
    assert.ok(questions.some((q) => chapterOfTopic[q.topic] === chapter.id), `${chapter.id}: frågor`);
    assert.ok(glossary.some((g) => g.chapter === chapter.id), `${chapter.id}: ordlista`);
  }
  for (const entry of glossary) assert.ok(chapters.some((c) => c.id === entry.chapter), `${entry.term}: kapitel`);
  const terms = glossary.map((g) => g.term.toLowerCase());
  assert.equal(new Set(terms).size, terms.length, "unika termer");
});

test("varianterna pekar på förra årets tentafrågor och skiljer sig från dem", () => {
  const variants = questions.filter((q) => q.variantOf);
  assert.ok(variants.length >= 8);
  for (const v of variants) {
    const original = bank[v.variantOf];
    assert.ok(original, `${v.id}: ${v.variantOf} finns i examBank`);
    assert.notEqual(v.question, original.question, `${v.id}: ny formulering`);
    assert.match(v.source, /^Variant av en tentafråga från förra året/, v.id);
    // Nya distraktorer: högst ett alternativ får vara ordagrant detsamma.
    const old = new Set(original.options.map((o) => o.text));
    assert.ok(v.options.filter((o) => old.has(o.text)).length <= 1, `${v.id}: nya alternativ`);
  }
  // En variant per tentafråga och kapitel räcker; ingen dubblett i samma kapitel.
  const seen = new Set();
  for (const v of variants) {
    const key = `${v.variantOf}@${chapterOfTopic[v.topic]}`;
    assert.ok(!seen.has(key), key);
    seen.add(key);
  }
});

test("manifestet: Läs, kapitelordning i Öva och sammanfattningen", () => {
  assert.deepEqual(course.views.slice(0, 2), ["las", "ova"]);
  assert.equal(course.practiceBy, "chapter");
  assert.equal(course.summary, summary);
  assert.match(intro, /\{lästid\}/);
  assert.ok(examNote.text.includes("3 december"));
});

// Essäerna: samma fyra steg som Strategi och BPM, märkta som egna
// övningsessäer (årets ämnen är okända), byggda på föreläsningarna.
test("essäerna: fem övningsessäer i fyrstegsform, märkta som egna, utan ordtak", () => {
  const HEADINGS = ["Vad det är", "Varför det spelar roll", "Konkret", "Koppling"];
  // Steg 4 ska namnge en annan del av delkursen, inte bara "koppla till kursen".
  const OMRADEN = ["composition viii", "riskbedömning", "zero trust", "cia", "introna", "schneier", "nist",
    "straub", "säkerhetspolicy", "data center", "konsekvensskalan", "red team", "pentest", "kryptering", "confidentiality"];
  assert.equal(course.essays.length, 5);
  assert.ok(course.views.includes("essa"));
  assert.equal(course.essayWordLimit, null);
  for (const essay of course.essays) {
    assert.deepEqual(essay.checklist.map((g) => g.heading), HEADINGS, essay.id);
    for (const group of essay.checklist) {
      assert.ok(group.points.length >= 2 && group.points.length <= 4, `${essay.id} / ${group.heading}`);
      for (const point of group.points) assert.ok(point.trim().length > 20, `${essay.id}: för kort punkt`);
    }
    assert.match(essay.context, /^Egen övningsessä – årets essäämnen är inte kända\./, essay.id);
    assert.ok(essay.question && essay.outline, essay.id);
    const step4 = essay.checklist[3].points.join(" ").toLowerCase();
    assert.ok(OMRADEN.some((name) => step4.includes(name)), `${essay.id}: kopplingen namnger inget område`);
  }
});

// Klartext (Kaspers regel 14 nov): det som visas ska förstås av en kursare
// som aldrig sett sajten. Inga interna förkortningar i det Säkerhet visar.
const JARGON = /\bHT2[56]\b|\bUF\b|docx|\bsak-\d{2}\b|\bFö\d\b/;
test("klartext i Säkerhets synliga texter", () => {
  const texts = [
    course.homeIntro, course.pastExamNote, intro, examNote.text,
    summary.title, summary.lead, summary.body,
    ...chapters.flatMap((c) => [c.title, c.lead, c.label, c.body, ...c.sources]),
    ...glossary.flatMap((g) => [g.term, g.definition]),
    ...topics.flatMap((t) => [t.name, t.summary, ...t.keyPoints, ...t.pitfalls]),
    ...questions.flatMap((q) => [q.question, q.source, ...q.options.flatMap((o) => [o.text, o.explain])]),
    ...course.pastExams.map((exam) => exam.term),
    ...(course.essayIntro || []),
    ...course.essays.flatMap((e) => [e.question, e.context, e.outline, ...e.checklist.flatMap((g) => g.points)]),
  ];
  for (const text of texts) assert.doesNotMatch(String(text), JARGON, String(text).slice(0, 80));
});
