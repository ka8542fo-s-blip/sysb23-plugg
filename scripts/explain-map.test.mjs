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

// 2026-11-21: Zachman-essän (förra årets tentor, inte i PDF:erna) är borta
// ur mappningen; lärarens 53 fritextfrågor ligger på 46 kort.
const UF_ESSAYS = essays.filter((e) => e.id !== "ea-e-zachman");
test("46 kort, och varje fritextfråga ur PDF:erna finns på exakt ett kort", () => {
  assert.equal(cards.length, 46);
  const ids = cards.flat();
  assert.equal(ids.length, UF_ESSAYS.length);
  assert.equal(new Set(ids).size, ids.length, "ingen fråga på två kort");
  assert.deepEqual([...ids].sort(), UF_ESSAYS.map((e) => e.id).sort());
  assert.ok(!ids.includes("ea-e-zachman"));
  assert.equal(new Set(cards.map(explainCardId)).size, 46, "unika kort-id");
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

test("förklarakorten i manifestet: 46 kort med frågor, lärarens svar och två val, utan kärnsvar", () => {
  const course = getCourse("arkitektur");
  assert.equal(course.explainCards, explainCards);
  assert.equal(explainCards.length, 46);
  assert.equal(course.questions.length, 136);
  assert.deepEqual(course.views, ["las", "ova", "tenta", "statistik"]);
  assert.equal(course.practiceBlocks, undefined, "Memorera visas inte");
  for (const card of explainCards) {
    assert.equal(card.kind, "forklara");
    assert.deepEqual(card.options.map((o) => o.text), ["Kunde", "Kunde inte"]);
    assert.equal(card.correct, 0);
    assert.ok(card.fixedOrder);
    assert.ok(card.topic, card.id);
    assert.equal(card.karnsvar, undefined, `${card.id}: inget kärnsvar`);
    for (const prompt of card.prompts) {
      assert.ok(prompt.modelAnswer, `${card.id}: lärarens modellsvar`);
      assert.match(prompt.source, /^Modul (1[0-2]|[1-9])(,|$)/, `${card.id}: ${prompt.source}`);
      assert.doesNotMatch(prompt.source, /\(/, `${card.id}: källan utan våra noter`);
    }
  }
  assert.ok(!explainCards.some((card) => card.essayIds.includes("ea-e-zachman")), "Zachman-essän finns inte");
  const q9 = explainCards.find((card) => card.essayIds.includes("ea-e1-9"));
  assert.deepEqual(q9.prompts[0].extraModelAnswers.map((extra) => extra.source), ["Modul 1, exempel i inledningen"]);
});
