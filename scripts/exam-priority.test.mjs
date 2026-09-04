// Tentaprioriteten: klassningen, kapitlens härledning och bevisraderna.
// Prioriteten informerar — inget innehåll får försvinna för att ett ämne
// klassats som bakgrund.
import { test } from "node:test";
import assert from "node:assert/strict";
import { topics } from "../src/data/strategi/topics.js";
import { chapters } from "../src/data/strategi/reading.js";
import { topics as dbTopics } from "../src/data/databaser/topics.js";
import {
  chapterPriority,
  evidenceSentence,
  hasPriorities,
  isFastTrack,
  priorityOf,
} from "../src/lib/examPriority.js";

const byId = Object.fromEntries(topics.map((topic) => [topic.id, topic]));

test("varje ämne har en giltig prioritet, och klassningen stämmer", () => {
  const karna = ["tbl", "vision", "effektivitet", "organisation", "porter", "strategiutveckling", "bsc", "mal", "it"];
  const essa = ["it", "rbv", "nyamatt", "organisation"];
  const bakgrund = ["grunder", "matt", "digital"];
  for (const topic of topics) {
    const levels = priorityOf(topic);
    assert.ok(levels.length > 0, `${topic.id} saknar examPriority`);
    assert.equal(levels.includes("karna"), karna.includes(topic.id), topic.id);
    assert.equal(levels.includes("essa"), essa.includes(topic.id), topic.id);
    assert.equal(levels.includes("bakgrund"), bakgrund.includes(topic.id), topic.id);
  }
  // Bakgrund utesluter de andra två.
  for (const id of bakgrund) assert.deepEqual(priorityOf(byId[id]), ["bakgrund"]);
  assert.deepEqual(priorityOf(byId.it), ["karna", "essa"]);
});

test("kapitel ärver prioritet av det de introducerar", () => {
  const of = (id) => chapterPriority(chapters.find((c) => c.id === id), topics);
  assert.deepEqual(of("kap1"), ["bakgrund"]); // grunder
  assert.deepEqual(of("kap3"), ["karna"]); // mal
  assert.deepEqual(of("kap9"), ["karna", "essa"]); // it + rbv
  assert.deepEqual(of("digital"), ["bakgrund"]);
  // kap7 introducerar bsc (kärna) och matt (bakgrund) — kärna vinner.
  assert.deepEqual(of("kap7"), ["karna"]);
  const fast = chapters.filter((c) => isFastTrack(chapterPriority(c, topics)));
  // Alla utom kap1 (grunder) och digital, som båda är ren bakgrund.
  assert.equal(fast.length, 9, "nio kapitel i snabbspåret");
  assert.equal(chapters.length, 11, "inget kapitel har försvunnit");
});

test("bevisraden formuleras bara när underlaget finns", () => {
  assert.equal(evidenceSentence(byId.tbl.examEvidence), "Prövat HT24: 1 flervalsfråga");
  assert.equal(evidenceSentence(byId.mal.examEvidence), "Prövat i quiz F1: 6 frågor");
  assert.equal(evidenceSentence(byId.rbv.examEvidence), "Prövat som essä HT24");
  assert.equal(
    evidenceSentence(byId.it.examEvidence),
    "Prövat HT24: 1 flervalsfråga · Prövat i quiz F1: 1 fråga · Prövat som essä HT24",
  );
  // Odokumenterat underlag ger ingen rad i stället för en påhittad siffra.
  assert.equal(evidenceSentence(byId.vision.examEvidence), null);
  assert.equal(evidenceSentence(undefined), null);
  assert.equal(evidenceSentence({ mcq: 0, essay: false }), null);
  assert.equal(evidenceSentence({ mcq: 2 }), "Prövat HT24: 2 flervalsfrågor");
});

test("delkurser utan klassning påverkas inte", () => {
  assert.equal(hasPriorities(topics), true);
  assert.equal(hasPriorities(dbTopics), false);
  for (const topic of dbTopics) assert.deepEqual(priorityOf(topic), []);
  assert.deepEqual(chapterPriority({ primaryTopics: ["kap1"] }, dbTopics), []);
});
