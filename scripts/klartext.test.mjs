// Verksamhetsarkitektur läses av kursare som aldrig sett sajten förut
// (Kasper 2026-11-14): det som visas får inte bygga på interna förkortningar
// eller nivånamn. "UF" heter läraren, "HT25" förra årets tentor, "docx"
// Word-dokumentet, och "Troligt"/"Kärna" förklaras med vanliga ord.
import { test } from "node:test";
import assert from "node:assert/strict";
import { getCourse } from "../src/data/index.js";
import { LIKELY, ZACHMAN_WHY, FORDJUPNING_WHY } from "../src/data/arkitektur/cards.js";
import { ARTICLE_NOTE } from "../src/data/arkitektur/examArchive.js";
import { TASK_GROUPS, zachmanTasks } from "../src/data/arkitektur/zachman.js";
import { levelStats } from "../src/lib/levels.js";

const JARGON = /\bUF\b|HT ?2[56]|docx|råmaterial|\bTroligt\b|\bKärna\b/;
const course = getCourse("arkitektur");

const texts = () => {
  const out = [
    ["homeIntro", course.homeIntro],
    ["readingIntro", course.readingIntro],
    ["examNote", `${course.examNote.text} ${course.examNote.source}`],
    ...course.essayIntro.map((t, i) => [`essayIntro ${i}`, t]),
    ["ZACHMAN_WHY", ZACHMAN_WHY],
    ["FORDJUPNING_WHY", FORDJUPNING_WHY],
    ["ARTICLE_NOTE", ARTICLE_NOTE],
    ...Object.entries(LIKELY).map(([id, box]) => [`ruta ${id}`, `${box.title} ${box.text} ${box.moreLabel} ${box.more} ${box.links.map((l) => l.label).join(" ")}`]),
    ...course.chapters.map((c) => [c.id, [c.title, c.lead, c.card, c.body, ...(c.sources || [])].join(" ")]),
    ...course.topics.map((t) => [`ämne ${t.id}`, [t.title, t.summary, ...(t.keyPoints || []), ...(t.pitfalls || []), t.examEvidence?.note ?? ""].join(" ")]),
    ...course.glossary.map((g) => [`ordlista ${g.term}`, `${g.term} ${g.definition}`]),
    ...[...course.questions, ...course.extraQuestions].map((q) => [
      q.id,
      [q.question, ...(q.options || []).map((o) => (typeof o === "string" ? o : o.text)), q.explanation ?? "", q.source ?? "", q.note ?? ""].join(" "),
    ]),
    ...course.essays.map((e) => [e.id, [e.label, e.context, e.source, e.levelNote ?? "", e.group ?? ""].join(" ")]),
    ...TASK_GROUPS.map((g) => [`grupp ${g.key}`, `${g.title} ${g.note}`]),
    ...zachmanTasks.map((t) => [t.id, [t.text ?? "", t.why ?? ""].join(" ")]),
  ];
  const s = levelStats(course, { troligtTaskIds: course.levels.troligtTaskIds });
  for (const level of [s.karna, s.troligt, s.fordjupning]) {
    out.push([`Statistik ${level.key}`, [level.label, level.note, ...level.parts.map((p) => p.label)].join(" ")]);
  }
  return out;
};

test("Verksamhetsarkitektur: inga interna förkortningar eller nivånamn i det som visas", () => {
  for (const [where, text] of texts()) {
    assert.equal(typeof text, "string", where);
    assert.doesNotMatch(text, JARGON, where);
  }
});

test("läraren nämns som läraren, och Zachman-förklaringen säger att det är vår bedömning", () => {
  assert.match(course.readingIntro, /läraren/);
  assert.match(ZACHMAN_WHY, /troligen på tentan/);
  assert.match(ZACHMAN_WHY, /inte något läraren har sagt/);
  assert.ok(!course.views.includes("tentan"), "fliken Tentan är borttagen");
});
