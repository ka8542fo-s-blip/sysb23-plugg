// Frågebanken för Databaser: "Öva speglar Läs" (varje kapitel 5–8 frågor),
// mallens designregler (strategi/questions.js) och balansmåtten. Låser att
// framtida tillägg varken bryter speglingen eller tyst återinför en
// snedfördelning.
import { test } from "node:test";
import assert from "node:assert/strict";
import { questions, LENGTH_FLAGGED } from "../src/data/databaser/questions.js";
import { pendingQuestions } from "../src/data/databaser/questions-pending.js";
import { topics } from "../src/data/databaser/topics.js";
import { chapters } from "../src/data/databaser/reading.js";

const chapterOf = Object.fromEntries(topics.map((t) => [t.id, t.chapter]));

test("varje fråga är komplett: fyra alternativ med förklaring, ämne i topics.js, källa", () => {
  const ids = new Set();
  for (const q of questions) {
    assert.ok(!ids.has(q.id), `dubblett ${q.id}`);
    ids.add(q.id);
    assert.equal(q.options.length, 4, `${q.id}: fyra alternativ`);
    for (const option of q.options) {
      assert.ok(option.text && option.explain, `${q.id}: text och explain per alternativ`);
    }
    assert.ok(q.correct >= 0 && q.correct < 4, `${q.id}: correct`);
    assert.ok([1, 2, 3].includes(q.difficulty), `${q.id}: difficulty 1–3`);
    assert.ok(q.source, `${q.id}: källa`);
    assert.ok(chapterOf[q.topic], `${q.id}: ämnet ${q.topic} finns inte i topics.js`);
  }
});

test("Öva speglar Läs: varje kapitel har 5–8 frågor och inga frågor saknar kapitel", () => {
  const counts = Object.fromEntries(chapters.map((c) => [c.id, 0]));
  for (const q of questions) {
    const chapter = chapterOf[q.topic];
    assert.ok(chapter in counts, `${q.id}: kapitlet ${chapter} finns inte`);
    counts[chapter]++;
  }
  for (const c of chapters) {
    assert.ok(counts[c.id] >= 5 && counts[c.id] <= 8, `${c.id} har ${counts[c.id]} frågor (spann 5–8)`);
  }
});

test("balansmåtten håller mallens regler", () => {
  const n = questions.length;
  const positions = [0, 0, 0, 0];
  let uniqueLongest = 0;
  let ratioSum = 0;
  for (const q of questions) {
    const lens = q.options.map((o) => o.text.length);
    const correctLen = lens[q.correct];
    const max = Math.max(...lens);
    const min = Math.min(...lens);
    const distractors = lens.filter((_, i) => i !== q.correct);
    positions[q.correct]++;
    ratioSum += correctLen / (distractors.reduce((a, b) => a + b, 0) / distractors.length);
    const isUniqueLongest = lens.filter((l) => l === max).length === 1 && correctLen === max;
    if (isUniqueLongest) uniqueLongest++;
    const spread = max / min;
    if (LENGTH_FLAGGED.includes(q.id)) {
      assert.ok(!isUniqueLongest, `${q.id} är flaggad men rätt svar är ensamt längst`);
    } else {
      assert.ok(spread <= 1.25, `${q.id}: längdspridning ${spread.toFixed(2)} (> 1,25)`);
    }
  }
  for (const id of LENGTH_FLAGGED) assert.ok(questions.some((q) => q.id === id), `flaggad ${id} finns inte`);
  const lo = Math.ceil((n / 4) * 0.65);
  const hi = Math.floor((n / 4) * 1.35);
  for (const p of positions) {
    assert.ok(p >= lo && p <= hi, `positionsfördelning ${positions.join("/")} utanför ${lo}–${hi}`);
  }
  const ratio = ratioSum / n;
  assert.ok(ratio >= 0.9 && ratio <= 1.1, `längdkvot rätt/distraktor ${ratio.toFixed(2)}`);
  assert.ok(uniqueLongest / n <= 0.25, `rätt svar unikt längst i ${Math.round((100 * uniqueLongest) / n)} % (> 25 %)`);
});

test("parkerade SQL-frågor står utanför banken", () => {
  assert.equal(pendingQuestions.length, 6);
  const ids = new Set(questions.map((q) => q.id));
  for (const q of pendingQuestions) assert.ok(!ids.has(q.id), `${q.id} är både parkerad och aktiv`);
});
