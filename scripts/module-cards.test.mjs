// Modulkorten i Läs för Verksamhetsarkitektur (omgjorda 2026-11-14): modul
// 12 är Start här; modul 1–11 börjar med kärnsvaret och har sedan Håll isär;
// det som stod på korten förut ligger under Läs mer; modultexterna nämner
// inte de gamla tentorna, och Zachman-rutan förklarar varför Zachman får
// mer plats.
import { test } from "node:test";
import assert from "node:assert/strict";
import { FORMAT_QUOTES, KARNSVAR, LEARNING, LIKELY, ZACHMAN_WHY } from "../src/data/arkitektur/cards.js";
import { zachmanTasks } from "../src/data/arkitektur/zachman.js";
import { chapters, examNote, glossary, intro } from "../src/data/arkitektur/reading.js";
import { topics } from "../src/data/arkitektur/topics.js";
import { questions } from "../src/data/arkitektur/questions.js";

const words = (text) => text.replace(/[|#>*`-]/g, " ").split(/\s+/).filter(Boolean).length;
const OLD_EXAMS = /HT25|HT 25|gamla tentor|tidigare tentor|omtentan|uppsamlingen|ordinarie tentan/i;

test("modul 12 är Start här med tentans form, begreppen, testet och fällorna", () => {
  assert.equal(chapters.length, 12);
  assert.equal(chapters[0].id, "kap12");
  const card = chapters[0].card;
  for (const heading of ["Start här", "Så ser tentan ut", "De tio begreppen", "Arkitektens test", "Fällorna i sant/falskt"]) {
    assert.match(card, new RegExp(`## ${heading}`), heading);
  }
  for (const quote of FORMAT_QUOTES) assert.ok(card.includes(quote), "kursinformationen ordagrant");
  assert.match(card, /0 poäng, inte minuspoäng/);
  assert.match(card, /fem timmar oavsett/);
  assert.equal((card.match(/^\| [A-Z]/gm) || []).length - 1, 10, "tio begrepp (plus rubrikraden)");
});

test("modul 1–11: kärnsvaret först (80–120 ord, med källor), sedan Håll isär", () => {
  for (const chapter of chapters.filter((c) => c.id !== "kap12")) {
    const k = KARNSVAR[chapter.id];
    assert.ok(k, chapter.id);
    const n = words(k.text);
    assert.ok(n >= 80 && n <= 120, `${chapter.id}: ${n} ord`);
    if (!k.noExample) assert.match(k.text, /Lärarens exempel/, `${chapter.id}: ett av lärarens exempel`);
    else assert.match(k.text, /Läraren säger det så här/, `${chapter.id}: lärarens formulering i stället`);
    assert.ok(chapter.card.startsWith("## Kärnsvaret"), chapter.id);
    assert.match(chapter.card, /\*Bygger på lärarens modellsvar till /, chapter.id);
    assert.match(chapter.card, /## Håll isär/, chapter.id);
    assert.ok(chapter.card.indexOf("## Kärnsvaret") < chapter.card.indexOf("## Håll isär"), chapter.id);
    // Ett exempel står bara en gång på kortet: i kärnsvaret, inte också under rubriken.
    assert.ok((chapter.card.match(/## Lärarens exempel/g) || []).length <= 1, chapter.id);
  }
});

test("det som stod på korten förut ligger överst under Läs mer", () => {
  for (const chapter of chapters) {
    const first = chapter.id === "kap11" ? "## Uppgiften" : "## Lärandemål";
    assert.ok(chapter.body.trimStart().startsWith(first), chapter.id);
    assert.ok(chapter.body.includes(LEARNING[chapter.id].trim()), chapter.id);
    assert.match(chapter.body, /## Kärnan/, chapter.id);
  }
});

test("modul 4: rutnätet som visning och tre lösta placeringar med regeln", () => {
  const kap4 = chapters.find((c) => c.id === "kap4");
  assert.equal(kap4.widget, "zachman-grid");
  for (const [model, cell] of [["Java", "R5K2 (Program)"], ["arbetsflödesmodell", "R2K4 (Work Flow Model)"], ["verksamhetsregler", "R3K6 (Business Rule Model)"]]) {
    assert.match(kap4.cardAfter, new RegExp(`${model}.*${cell.replace(/[()]/g, "\\$&")}`), model);
    const code = cell.slice(0, 4);
    const task = zachmanTasks.find((t) => t.cells?.[0] === code && new RegExp(model, "i").test(t.text));
    assert.ok(task, `${model}: samma facit som placeringsuppgiften`);
  }
  assert.match(kap4.cardAfter, /Kolumnen är frågan modellen svarar på/);
  assert.match(kap4.cardAfter, /Raden är perspektivet och detaljnivån/);
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
