// Verksamhetsarkitektur läses av kursare som aldrig sett sajten förut
// (Kasper 2026-11-14): det som visas får inte bygga på interna förkortningar
// eller nivånamn. "UF" heter läraren, "HT25" förra årets tentor, "docx"
// Word-dokumentet, och "Troligt"/"Kärna" används inte.
//
// Sedan 2026-11-21 visar sidan bara lärarens tre moduldokument: Läs är
// lärarens egen text på engelska, Öva hans frågor, svar och förklaringar.
// Testet läser det som faktiskt visas (manifestet), inte de dolda texterna.
import { test } from "node:test";
import assert from "node:assert/strict";
import { getCourse } from "../src/data/index.js";
import { UF_INTRO, UF_TEXT } from "../src/data/arkitektur/ufText.js";
import { ufChapters } from "../src/data/arkitektur/ufView.js";

const JARGON = /\bUF\b|HT ?2[56]|docx|\bWord\b|råmaterial|\bTroligt\b|\bKärna\b/;
const course = getCourse("arkitektur");

const texts = () => [
  ["homeIntro", course.homeIntro ?? ""],
  ["modulerIntro", course.modulerIntro.sv],
  ...course.chapters.map((c) => [c.id, c.title]),
  ...course.moduler.flatMap((m) =>
    m.blocks.map((b) => [b.id, b.sv ?? [b.question.sv, b.explanation?.sv ?? "", b.modelAnswer?.sv ?? "", ...(b.options || []).map((o) => o.sv)].join(" ")]),
  ),
  ...course.questions.map((q) => [
    q.id,
    [q.question, ...(q.options || []).map((o) => (typeof o === "string" ? o : o.text)), q.explanation ?? "", q.source ?? "", q.note ?? ""].join(" "),
  ]),
  ...course.explainCards.map((card) => [
    card.id,
    card.prompts.map((p) => [p.label, p.question, p.source, p.modelAnswer, ...p.extraModelAnswers.map((e) => `${e.source} ${e.text}`)].join(" ")).join(" "),
  ]),
];

test("Verksamhetsarkitektur: inga interna förkortningar eller nivånamn i det som visas", () => {
  for (const [where, text] of texts()) {
    assert.equal(typeof text, "string", where);
    assert.doesNotMatch(text, JARGON, where);
  }
});

// Läs (lärarens engelska text) är dold sedan 2026-11-22, då fliken Moduler
// ersatte den; datat i ufView.js finns kvar och prövas här.
test("Läs och Tenta är dolda; Läs-datat är lärarens text utan våra tillägg", () => {
  assert.ok(!course.views.includes("las") && !course.views.includes("tenta"));
  assert.equal(ufChapters.length, 12);
  for (const chapter of ufChapters) {
    assert.equal(chapter.card, UF_TEXT[chapter.id], chapter.id);
    assert.equal(chapter.body, "", `${chapter.id}: ingen Läs mer`);
    assert.equal(chapter.lead, undefined, `${chapter.id}: ingen ingress`);
    assert.equal(chapter.cardOnly, true, chapter.id);
    assert.equal(chapter.likely, undefined, `${chapter.id}: ingen Zachman-ruta`);
    assert.equal(chapter.widget, undefined, `${chapter.id}: inget rutnät`);
    assert.deepEqual(chapter.sources, [`Modul ${chapter.number}`]);
    assert.doesNotMatch(chapter.card, /[åäöÅÄÖ]/, `${chapter.id}: lärarens engelska text, inget vi skrivit`);
  }
  assert.match(UF_INTRO, /^I have created 12 modules/);
  for (const key of ["examNote", "glossary", "essayIntro", "levels", "practiceBlocks", "examArchive"]) {
    assert.ok(course[key] === undefined || (Array.isArray(course[key]) && course[key].length === 0), `${key} visas inte`);
  }
  assert.ok(!course.views.includes("tentan"), "fliken Tentan är borttagen");
});

test("Läs har lärarens nyckeltexter i modul 12: de tio begreppen, fällorna, arkitektens test", () => {
  const kap12 = UF_TEXT.kap12;
  assert.match(kap12, /## The ten concepts/);
  assert.equal((kap12.match(/^\d+\. \*\*/gm) || []).length, 10 + 5, "tio begrepp och fem frågor i arkitektens test");
  assert.match(kap12, /## Common examination traps/);
  assert.match(kap12, /## The "architect's test"/);
  assert.match(kap12, /## Final examination checklist/);
});
