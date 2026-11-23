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
import { modulerCards } from "../src/data/arkitektur/modulerView.js";
import { SPLIT_CARDS, migrateSplitCards } from "../src/lib/splitCards.js";

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

// Sedan 2026-11-22 (fliken Moduler) visar Öva ett kort per fritextfråga, på
// svenska och med samma id som i Moduler (modulerView.js). Mappningen ovan
// och de 46 ihopslagna korten finns kvar som data men visas inte.
test("förklarakorten i manifestet: 53 kort, ett per fritextfråga, på svenska", () => {
  const course = getCourse("arkitektur");
  assert.equal(course.explainCards, modulerCards);
  assert.equal(modulerCards.length, 53);
  assert.equal(course.questions.length, 136);
  assert.deepEqual(course.views, ["moduler", "ova", "essa", "statistik"]);
  assert.equal(course.practiceBlocks, undefined, "Memorera visas inte");
  assert.equal(new Set(modulerCards.map((card) => card.id)).size, 53);
  for (const card of modulerCards) {
    assert.equal(card.kind, "forklara");
    assert.deepEqual(card.options.map((o) => o.text), ["Kunde", "Kunde inte"]);
    assert.equal(card.correct, 0);
    assert.ok(card.fixedOrder);
    assert.ok(card.topic, card.id);
    assert.deepEqual(card.essayIds, [card.prompts[0].id]);
    assert.equal(card.id, explainCardId(card.essayIds), "samma id som förut för det första kortet i en grupp");
    const [prompt] = card.prompts;
    assert.ok(prompt.modelAnswer, `${card.id}: lärarens modellsvar`);
    assert.match(prompt.source, /^Modul (1[0-2]|[1-9]), /, `${card.id}: ${prompt.source}`);
  }
  assert.ok(!modulerCards.some((card) => card.essayIds.includes("ea-e-zachman")), "Zachman-essän finns inte");
  const q9 = modulerCards.find((card) => card.id === "ea-f-e1-9");
  assert.deepEqual(q9.prompts[0].extraModelAnswers.map((extra) => extra.source), ["Exempelsvaret i modulens inledning"]);
  assert.equal(modulerCards.find((c) => c.id === "ea-f-e12-scenario-1").prompts[0].keyLesson.label, "Viktig lärdom");
  // Alla gamla kort-id finns kvar, så att sparad status och text hittas.
  for (const old of explainCards) assert.ok(modulerCards.some((card) => card.id === old.id), old.id);
});

test("de uppdelade korten ärver det ihopslagna kortets status en gång", () => {
  const merged = explainCards.filter((card) => card.essayIds.length > 1);
  const newIds = merged.flatMap((card) => card.essayIds.slice(1).map((id) => explainCardId([id])));
  assert.deepEqual(Object.keys(SPLIT_CARDS).sort(), newIds.sort());
  for (const card of merged) for (const id of card.essayIds.slice(1)) assert.equal(SPLIT_CARDS[explainCardId([id])], card.id);
  const stat = { correct: 2, wrong: 0, last: "correct", recent: [true, true] };
  const own = { correct: 0, wrong: 1, last: "wrong", recent: [false] };
  const migrated = migrateSplitCards({ "ea-f-e4-10": stat, "ea-f-e12-essay-2": own });
  assert.deepEqual(migrated["ea-f-e5-12"], stat, "ärver från det ihopslagna kortet");
  assert.deepEqual(migrated["ea-f-e12-essay-2"], own, "egen status skrivs inte över");
  assert.equal(migrated["ea-f-e4-11"], undefined, "inget att ärva");
  const empty = {};
  assert.equal(migrateSplitCards(empty), empty, "oförändrad lagring när inget ärvs");
});
