// Frågebanken för Databaser: kopplingen till ämnena i topics.js och
// balansmåtten ur cc-prompt-databaser-fragebank.md. Måtten räknas på
// leveransens egna fält (options som strängar, correctIndex) så att
// framtida tillägg inte tyst återinför en snedfördelning.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  databaserQuestions,
  databaserTopicLabels,
  QUESTION_TOPIC_MAP,
  questions,
} from "../src/data/databaser/questions.js";
import { topics } from "../src/data/databaser/topics.js";
import { chapters } from "../src/data/databaser/reading.js";

test("varje fråga är komplett och kopplad till ett ämne i topics.js", () => {
  const ids = new Set();
  for (const q of databaserQuestions) {
    assert.ok(!ids.has(q.id), `dubblett ${q.id}`);
    ids.add(q.id);
    assert.equal(q.options.length, 4, `${q.id}: fyra alternativ`);
    assert.ok(q.correctIndex >= 0 && q.correctIndex < 4, `${q.id}: correctIndex`);
    assert.ok(q.explanation.length > 0, `${q.id}: förklaring saknas`);
    assert.ok(databaserTopicLabels[q.topic], `${q.id}: ämnet ${q.topic} saknar visningsnamn`);
    assert.ok(QUESTION_TOPIC_MAP[q.topic], `${q.id}: ämnet ${q.topic} saknar koppling`);
  }
  for (const [sub, topicId] of Object.entries(QUESTION_TOPIC_MAP)) {
    assert.ok(topics.some((t) => t.id === topicId), `${sub} → okänt ämne ${topicId}`);
  }
  assert.equal(questions.length, databaserQuestions.length);
  for (const q of questions) {
    assert.equal(typeof q.options[0].text, "string", q.id);
    assert.equal(typeof q.correct, "number", q.id);
    assert.ok(q.subtopicLabel, q.id);
  }
});

test("kapitel 1 och Fö4-kapitlen har täckta ämnen", () => {
  const covered = new Set(questions.map((q) => q.topic));
  const withQuestions = chapters
    .filter((c) => c.topics.some((id) => covered.has(id)))
    .map((c) => c.id);
  for (const id of ["kap1", "kap4", "kap5", "svaga"]) {
    assert.ok(withQuestions.includes(id), `${id} saknar frågor`);
  }
});

test("balansmåtten håller: positioner, längdkvot, unikt längst, spridning", () => {
  const n = databaserQuestions.length;
  const positions = [0, 0, 0, 0];
  let uniqueLongest = 0;
  let ratioSum = 0;
  let worstSpread = 0;
  let worstId = null;
  for (const q of databaserQuestions) {
    const lens = q.options.map((o) => o.length);
    const correctLen = lens[q.correctIndex];
    const distractors = lens.filter((_, i) => i !== q.correctIndex);
    positions[q.correctIndex]++;
    ratioSum += correctLen / (distractors.reduce((a, b) => a + b, 0) / distractors.length);
    const max = Math.max(...lens);
    if (lens.filter((l) => l === max).length === 1 && correctLen === max) uniqueLongest++;
    const spread = max / Math.min(...lens);
    if (spread > worstSpread) {
      worstSpread = spread;
      worstId = q.id;
    }
  }
  const lo = Math.ceil((n / 4) * 0.65);
  const hi = Math.floor((n / 4) * 1.35);
  for (const p of positions) {
    assert.ok(p >= lo && p <= hi, `positionsfördelning ${positions.join("/")} utanför ${lo}–${hi}`);
  }
  const ratio = ratioSum / n;
  assert.ok(ratio >= 0.9 && ratio <= 1.1, `längdkvot rätt/distraktor ${ratio.toFixed(2)}`);
  const share = uniqueLongest / n;
  assert.ok(share <= 0.25, `rätt svar unikt längst i ${(share * 100).toFixed(0)} % (> 25 %)`);
  assert.ok(worstSpread < 2, `längdspridning ${worstSpread.toFixed(2)} i ${worstId} (≥ 2x)`);
});
