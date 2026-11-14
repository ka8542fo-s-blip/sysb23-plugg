// Modulkorten i Läs för Verksamhetsarkitektur: varje kort har lärarens
// lärandemål, kärnan och distinktionerna, högst cirka 300 ord; modultexterna
// nämner inte de gamla tentorna (det står i Zachman-rutan i modul 4 och i
// Fördjupning), och rutan förklarar i klartext varför Zachman får mer plats.
import { test } from "node:test";
import assert from "node:assert/strict";
import { CARDS, LIKELY, ZACHMAN_WHY } from "../src/data/arkitektur/cards.js";
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

test("modultexterna nämner inte de gamla tentorna", () => {
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

test("Zachman-rutan i modul 4 förklarar varför och pekar på Zachman och essän", () => {
  assert.deepEqual(Object.keys(LIKELY), ["kap4"]);
  const box = chapters.find((c) => c.id === "kap4").likely;
  assert.equal(box.title, "Zachman kommer troligen på tentan");
  assert.ok(box.text.includes(ZACHMAN_WHY));
  assert.match(ZACHMAN_WHY, /förra året/);
  assert.match(ZACHMAN_WHY, /inte något läraren har sagt/, "bedömningen är vår, inte lärarens");
  assert.deepEqual(box.links.map((l) => l.view), ["zachman", "essa"]);
  assert.equal(box.links[1].params.essayId, "ea-e-zachman");
  assert.match(box.more, /förra årets tre tentor/i, "det som gäller de gamla tentorna står här");
});

test("modul 12:s Läs mer har sammanfattningens avsnitt", () => {
  const kap12 = chapters.find((c) => c.id === "kap12");
  assert.match(kap12.body, /## Det tentan skiljer på/);
  assert.match(kap12.body, /## Zachman i korthet/);
});
