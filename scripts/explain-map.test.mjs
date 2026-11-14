// Förklarakortens mappning (Verksamhetsarkitektur): varje fritextfråga finns
// på exakt ett kort, 54 frågor blir 47 kort, och varje kärnsvar bygger på
// exakt modulens modellsvar.
import { test } from "node:test";
import assert from "node:assert/strict";
import { essays } from "../src/data/arkitektur/essays.js";
import { EXPLAIN_MAP, explainCardId } from "../src/data/arkitektur/explainMap.js";
import { KARNSVAR } from "../src/data/arkitektur/cards.js";
import { explainCards } from "../src/data/arkitektur/explainCards.js";
import { getCourse } from "../src/data/index.js";

const cards = Object.values(EXPLAIN_MAP).flat();

test("47 kort, och varje fritextfråga finns på exakt ett kort", () => {
  assert.equal(cards.length, 47);
  const ids = cards.flat();
  assert.equal(ids.length, essays.length);
  assert.equal(new Set(ids).size, ids.length, "ingen fråga på två kort");
  assert.deepEqual([...ids].sort(), essays.map((e) => e.id).sort());
  assert.equal(new Set(cards.map(explainCardId)).size, 47, "unika kort-id");
});

test("modul 1–11 har kort, modul 12 (Start här) har inga; trade-offs ligger i modul 8", () => {
  assert.deepEqual(Object.keys(EXPLAIN_MAP), ["kap1", "kap2", "kap3", "kap4", "kap5", "kap6", "kap7", "kap8", "kap9", "kap10", "kap11"]);
  assert.ok(EXPLAIN_MAP.kap8.some((card) => card.includes("ea-e12-32")));
});

test("kärnsvarets källor är modulens modellsvar, utom Zachman-essän som saknar modellsvar", () => {
  for (const [chapter, list] of Object.entries(EXPLAIN_MAP)) {
    const expected = list.flat().filter((id) => essays.find((e) => e.id === id).modelAnswer);
    assert.deepEqual([...KARNSVAR[chapter].source].sort(), expected.sort(), chapter);
  }
});

test("förklarakorten i manifestet: 47 kort med frågor, svar och två val, i Öva men inte i questions", () => {
  const course = getCourse("arkitektur");
  assert.equal(course.explainCards, explainCards);
  assert.equal(explainCards.length, 47);
  assert.equal(course.questions.length, 135, "provtentorna bygger på de 135 modulfrågorna");
  assert.deepEqual(course.views, ["las", "ova", "tenta", "statistik"]);
  assert.deepEqual(course.practiceBlocks, { kap4: "zachman-minne" });
  for (const card of explainCards) {
    assert.equal(card.kind, "forklara");
    assert.deepEqual(card.options.map((o) => o.text), ["Kunde", "Kunde inte"]);
    assert.equal(card.correct, 0);
    assert.ok(card.fixedOrder);
    assert.ok(card.topic, card.id);
    assert.ok(card.karnsvar, `${card.id}: kärnsvaret`);
    for (const prompt of card.prompts) assert.ok(prompt.modelAnswer || prompt.checklist?.length, `${card.id}: svar`);
  }
  const zachman = explainCards.find((card) => card.essayIds.includes("ea-e-zachman"));
  assert.doesNotMatch(zachman.question, /Finkelstein|artiklarna/);
  assert.match(zachman.prompts[0].note, /^Från tidigare tentor/);
});
