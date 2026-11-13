// Modulkorten i Läs för Verksamhetsarkitektur (Kärna): varje kort har UF:s
// lärandemål, kärnan och distinktionerna, högst cirka 300 ord; Kärna-texterna
// nämner inte de gamla tentorna (det står i Troligt-rutan och i
// Fördjupning); Troligt-märkningen står ordagrant.
import { test } from "node:test";
import assert from "node:assert/strict";
import { CARDS, LIKELY, TROLIGT_NOTE, FORDJUPNING_NOTE } from "../src/data/arkitektur/cards.js";
import { chapters, examNote, glossary, intro } from "../src/data/arkitektur/reading.js";
import { topics } from "../src/data/arkitektur/topics.js";
import { questions } from "../src/data/arkitektur/questions.js";

const words = (text) => text.replace(/[|#>*`-]/g, " ").split(/\s+/).filter(Boolean).length;
const OLD_EXAMS = /HT25|HT 25|gamla tentor|tidigare tentor|omtentan|uppsamlingen|ordinarie tentan/i;

test("tolv kort, ett per modul, med lärandemål, kärnan och distinktioner", () => {
  assert.equal(chapters.length, 12);
  for (const chapter of chapters) {
    const card = CARDS[chapter.id];
    assert.equal(chapter.card, card, chapter.id);
    assert.ok(words(card) <= 300, `${chapter.id}: ${words(card)} ord`);
    if (chapter.id === "kap11") assert.match(card, /Student task/);
    else assert.match(card, /## Lärandemål/, chapter.id);
    assert.match(card, /## Kärnan/, chapter.id);
    if (chapter.id !== "kap12") assert.match(card, /## Håll isär/, chapter.id);
    assert.ok(chapter.body.length > card.length, `${chapter.id}: den längre texten finns kvar under Läs mer`);
  }
  assert.match(CARDS.kap12, /## De tio begreppen/);
});

test("Kärna-texterna nämner inte de gamla tentorna", () => {
  const texts = [
    ["intro", intro],
    ["examNote", examNote.text],
    ...chapters.flatMap((c) => [[`${c.id} kort`, c.card], [`${c.id} läs mer`, c.body], [`${c.id} lead`, c.lead], [`${c.id} källor`, c.sources.join(" ")]]),
    ...topics.map((t) => [`ämne ${t.id}`, [t.summary, ...t.keyPoints, ...t.pitfalls].join(" ")]),
    ...glossary.map((g) => [`ordlista ${g.term}`, g.definition]),
    ...questions.map((q) => [q.id, `${q.question} ${q.explanation ?? ""} ${q.source}`]),
  ];
  for (const [where, text] of texts) assert.doesNotMatch(text, OLD_EXAMS, where);
});

test("Troligt-rutan i modul 4 har den exakta märkningen och pekar på Zachman och essän", () => {
  assert.equal(TROLIGT_NOTE, "Inte i modulerna, men på alla UF:s tidigare tentor och i årets bilder");
  assert.equal(FORDJUPNING_NOTE, "Utanför UF:s tips");
  assert.deepEqual(Object.keys(LIKELY), ["kap4"]);
  const box = chapters.find((c) => c.id === "kap4").likely;
  assert.equal(box.label, "Troligt");
  assert.equal(box.note, TROLIGT_NOTE);
  assert.deepEqual(box.links.map((l) => l.view), ["zachman", "essa"]);
  assert.equal(box.links[1].params.essayId, "ea-e-zachman");
  assert.match(box.more, /HT25/, "det som gäller de gamla tentorna står här");
});

test("modul 12:s Läs mer har sammanfattningens avsnitt", () => {
  const kap12 = chapters.find((c) => c.id === "kap12");
  assert.match(kap12.body, /## Det tentan skiljer på/);
  assert.match(kap12.body, /## Zachman i korthet/);
});
