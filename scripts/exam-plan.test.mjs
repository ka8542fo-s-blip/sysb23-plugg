// Provets sammansättning per delkurs: Strategis prov ska vara exakt som
// förut (11 × 5 p, −1 för fel), BPM:s i HT25-tentans form.
import { test } from "node:test";
import assert from "node:assert/strict";
import { courses } from "../src/data/index.js";
import { pickExam, maxPoints, examConfig, DEFAULT_EXAM } from "../src/lib/examPlan.js";
import { scoreExam } from "../src/lib/scoring.js";

const strategi = courses.find((c) => c.id === "strategi");
const process = courses.find((c) => c.id === "process");

test("Strategi: standardformatet, 11 frågor à 5 p, max 55", () => {
  assert.equal(examConfig(strategi), DEFAULT_EXAM);
  for (let run = 0; run < 20; run++) {
    const items = pickExam(strategi);
    assert.equal(items.length, 11);
    assert.equal(maxPoints(items), 55);
    const perTopic = {};
    for (const it of items) perTopic[it.question.topic] = (perTopic[it.question.topic] || 0) + 1;
    assert.ok(Object.values(perTopic).every((n) => n <= 2));
  }
});

test("poängräkningen: gamla poster utan points ger samma resultat som förut", () => {
  const entries = [
    { choice: 0, correct: 0 }, { choice: 1, correct: 0 }, { choice: null, correct: 2 },
  ];
  const r = scoreExam(entries);
  assert.deepEqual([r.points, r.max, r.correct, r.wrong, r.skipped], [4, 15, 1, 1, 1]);
});

test("poängräkningen: egna poäng per fråga, −1 för fel oavsett poäng", () => {
  const r = scoreExam([
    { choice: 0, correct: 0, points: 7 }, { choice: 1, correct: 0, points: 6 }, { choice: 0, correct: 0, points: 5 },
  ]);
  assert.equal(r.points, 11);
  assert.equal(r.max, 18);
  assert.equal(r.gained, 12);
});

test("BPM: 10 BPM-frågor à 5 p, en BPMN-fråga à 3 p, tre körfrågor med egna poäng", () => {
  for (let run = 0; run < 30; run++) {
    const items = pickExam(process);
    assert.equal(items.length, 14);
    const bpm = items.slice(0, 10);
    assert.ok(bpm.every((it) => it.points === 5 && !["bpmn", "handelser"].includes(it.question.topic)));
    assert.equal(items[10].points, 3);
    assert.ok(["bpmn", "handelser"].includes(items[10].question.topic));
    const runs = items.slice(11);
    assert.ok(runs.every((it) => it.points >= 4 && it.points <= 7), runs.map((r) => r.points).join(","));
    assert.equal(new Set(runs.map((r) => r.diagram)).size, 3, "högst en uppgift per diagram");
    const max = maxPoints(items);
    assert.ok(max >= 50 + 3 + 12 && max <= 50 + 3 + 21, `max ${max}`);
    // Körfrågornas rätta alternativ pekar på ett existerande alternativ.
    for (const it of runs) assert.ok(it.view.correct >= 0 && it.view.correct < it.view.options.length);
  }
});

test("BPM: frågor i samma dubblettgrupp dras aldrig i samma prov", () => {
  const groups = new Set(process.questions.map((q) => q.group).filter(Boolean));
  assert.ok(groups.size >= 3, "grupperna finns");
  for (let run = 0; run < 200; run++) {
    const seen = new Set();
    for (const it of pickExam(process)) {
      const g = it.question.group;
      if (!g) continue;
      assert.ok(!seen.has(g), `gruppen ${g} två gånger`);
      seen.add(g);
    }
  }
});
