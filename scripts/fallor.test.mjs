// Fällorna i sant/falskt på Start här-kortet (Verksamhetsarkitektur, modul
// 12): siffrorna räknas här ur frågebanken och måste stämma med kortet.
// Kaspers räkning 2026-11-14: 49 påståenden (utan de sex raderna i "Zachman
// or TOGAF"), 29 falska, alla 18 med absoluta ord falska, 11 andra falska.
import { test } from "node:test";
import assert from "node:assert/strict";
import { questions } from "../src/data/arkitektur/questions.js";
import { ABSOLUTE_WORDS, TRAPS } from "../src/data/arkitektur/cards.js";
import { chapters } from "../src/data/arkitektur/reading.js";

const texts = (q) => q.options.map((o) => (typeof o === "string" ? o : o.text));
const statements = questions.filter((q) => texts(q).length === 2 && /^true$/i.test(texts(q)[0]));
const pairs = questions.filter((q) => texts(q).length === 2 && !/^true$/i.test(texts(q)[0]));
const isFalse = (q) => /^false$/i.test(texts(q)[q.correct]);
const ABSOLUTE = new RegExp(`\\b(${ABSOLUTE_WORDS.join("|")})\\b`, "i");

test("frågebanken: 49 påståenden och sex Zachman-eller-TOGAF-rader", () => {
  assert.equal(statements.length, TRAPS.statements);
  assert.equal(pairs.length, 6);
  for (const q of pairs) assert.match(q.question, /^Zachman or TOGAF\?/, q.id);
});

test("29 falska; alla 18 med absoluta ord är falska; 11 andra falska", () => {
  const falska = statements.filter(isFalse);
  const absoluta = statements.filter((q) => ABSOLUTE.test(q.question));
  assert.equal(falska.length, TRAPS.falseStatements);
  assert.equal(absoluta.length, TRAPS.absolute);
  assert.deepEqual(absoluta.filter((q) => !isFalse(q)).map((q) => q.id), [], "inget sant påstående har ett absolut ord");
  assert.equal(falska.filter((q) => !ABSOLUTE.test(q.question)).length, TRAPS.otherFalse);
});

test("Start här-kortet visar samma siffror", () => {
  const card = chapters.find((c) => c.id === "kap12").card;
  assert.match(card, new RegExp(`Modulerna har ${TRAPS.statements} påståenden`));
  assert.match(card, new RegExp(`${TRAPS.falseStatements} av dem är falska`));
  assert.match(card, new RegExp(`${TRAPS.absolute} innehåller ett absolut ord`));
  assert.match(card, new RegExp(`De andra ${TRAPS.otherFalse} falska`));
  for (const word of ABSOLUTE_WORDS) assert.ok(card.includes(word), word);
});
