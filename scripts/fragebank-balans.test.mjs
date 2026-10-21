// Frågebankerna för Databaser och Processorienterad verksamhetsutveckling:
// "Öva speglar Läs" (varje kapitel har ett spann av frågor), mallens
// designregler (strategi/questions.js) och balansmåtten. Låser att framtida
// tillägg varken bryter speglingen eller tyst återinför en snedfördelning.
//
// Gränserna står per delkurs. Databaser har de strängare (spridning 1,25,
// unikt längst ≤ 25 %) sedan 2026-09-07. BPM följer Strategis mall
// (spridning 1,5, unikt längst < 35 %), och dess ordagranna tentafrågor
// står i LENGTH_FLAGGED och räknas inte in i balansmåtten: på HT25-tentan
// var rätt svar ofta längst, och de ska se ut som på tentan.
//
// Mallen är fyra alternativ. En fråga får ha 2–6 bara om den är flaggad
// (Weavers ordagranna körfrågor har fem–sex); positionsmåttet räknar
// frågorna med fyra alternativ. "Inget av övriga alternativ" har last: true,
// står sist och blandas inte.
import { test } from "node:test";
import assert from "node:assert/strict";
import { shuffleQuestion } from "../src/lib/shuffle.js";
import { diagramById as bpmnDiagramById } from "../src/data/process/bpmnDiagrams.js";
import * as dbQ from "../src/data/databaser/questions.js";
import { pendingQuestions } from "../src/data/databaser/questions-pending.js";
import { topics as dbTopics } from "../src/data/databaser/topics.js";
import { chapters as dbChapters } from "../src/data/databaser/reading.js";
import * as bpmQ from "../src/data/process/questions.js";
import { pendingQuestions as bpmPending } from "../src/data/process/questions-pending.js";
import { topics as bpmTopics } from "../src/data/process/topics.js";
import { chapters as bpmChapters } from "../src/data/process/reading.js";
import { DIAGRAM_IDS } from "../src/components/knowledge/diagrams/ids.js";

const BANKS = [
  {
    name: "databaser",
    questions: dbQ.questions,
    flagged: dbQ.LENGTH_FLAGGED,
    topics: dbTopics,
    chapters: dbChapters,
    perChapter: [4, 10],
    maxSpread: 1.25,
    maxUniqueLongest: 0.25,
    // Flaggade frågor är undantagna spridningen men får inte ha rätt svar
    // ensamt längst, och räknas in i helhetsmåtten.
    flaggedInTotals: true,
  },
  {
    name: "process",
    questions: bpmQ.questions,
    flagged: bpmQ.LENGTH_FLAGGED,
    topics: bpmTopics,
    chapters: bpmChapters,
    perChapter: [4, 10],
    maxSpread: 1.5,
    maxUniqueLongest: 0.35,
    flaggedInTotals: false,
  },
];

for (const bank of BANKS) {
  const { name, questions, flagged: flaggedList, topics, chapters } = bank;
  const chapterOf = Object.fromEntries(topics.map((t) => [t.id, t.chapter]));

  test(`${name}: varje fråga är komplett — 2–6 alternativ med förklaring, ämne, källa`, () => {
    const flagged = new Set(flaggedList.map((entry) => entry.id));
    const ids = new Set();
    for (const q of questions) {
      assert.ok(!ids.has(q.id), `dubblett ${q.id}`);
      ids.add(q.id);
      const n = q.options.length;
      assert.ok(n >= 2 && n <= 6, `${q.id}: ${n} alternativ (2–6)`);
      if (n !== 4) assert.ok(flagged.has(q.id), `${q.id}: ${n} alternativ men inte i LENGTH_FLAGGED`);
      for (const option of q.options) {
        assert.ok(option.text && option.explain, `${q.id}: text och explain per alternativ`);
        if (/^Inget av övriga alternativ/.test(option.text)) assert.equal(option.last, true, `${q.id}: "${option.text}" ska ha last: true`);
      }
      // Alternativ som står kvar sist får bara följas av fler sådana.
      const firstLast = q.options.findIndex((option) => option.last);
      if (firstLast >= 0) assert.ok(q.options.slice(firstLast).every((option) => option.last), `${q.id}: last-alternativen ska stå sist`);
      assert.ok(q.correct >= 0 && q.correct < n, `${q.id}: correct`);
      assert.ok([1, 2, 3].includes(q.difficulty), `${q.id}: difficulty 1–3`);
      assert.ok(q.source, `${q.id}: källa`);
      assert.ok(chapterOf[q.topic], `${q.id}: ämnet ${q.topic} finns inte i topics.js`);
      if (q.diagram) assert.ok(DIAGRAM_IDS.includes(q.diagram), `${q.id}: okänt diagram ${q.diagram}`);
      if (q.bpmnDiagram) assert.ok(bpmnDiagramById[q.bpmnDiagram], `${q.id}: okänt BPMN-diagram ${q.bpmnDiagram}`);
      if (q.context) assert.equal(typeof q.context, "string", `${q.id}: context ska vara text`);
      if (q.lead) assert.equal(typeof q.lead, "string", `${q.id}: lead ska vara text`);
    }
  });

  test(`${name}: Öva speglar Läs — varje kapitel har ${bank.perChapter.join("–")} frågor`, () => {
    const [lo, hi] = bank.perChapter;
    // Översiktskapitlet (overview: true) är uttryckligen undantaget: det har
    // inga frågor och är ingen grupp i Öva (practiceAxis.js).
    const practiced = chapters.filter((c) => !c.overview);
    const counts = Object.fromEntries(practiced.map((c) => [c.id, 0]));
    for (const q of questions) {
      const chapter = chapterOf[q.topic];
      assert.ok(chapter in counts, `${q.id}: kapitlet ${chapter} finns inte eller är en översikt`);
      counts[chapter]++;
    }
    for (const c of practiced) {
      assert.ok(counts[c.id] >= lo && counts[c.id] <= hi, `${c.id} har ${counts[c.id]} frågor (spann ${lo}–${hi})`);
    }
  });

  test(`${name}: varje flaggad fråga har ett skäl i klartext och finns i banken`, () => {
    // Listan får ändras, men inte i tysthet: en post utan skäl stoppar testet.
    for (const entry of flaggedList) {
      assert.ok(entry && typeof entry.id === "string", "flaggad post saknar id");
      assert.ok(
        typeof entry.reason === "string" && entry.reason.trim().length >= 20,
        `${entry.id}: flaggad utan skäl i klartext`,
      );
      assert.ok(questions.some((q) => q.id === entry.id), `flaggad ${entry.id} finns inte i banken`);
    }
  });

  test(`${name}: balansmåtten håller mallens regler`, () => {
    const flagged = new Set(flaggedList.map((entry) => entry.id));
    const positions = [0, 0, 0, 0];
    let fourOption = 0;
    let counted = 0;
    let uniqueLongest = 0;
    let ratioSum = 0;
    for (const q of questions) {
      const lens = q.options.map((o) => o.text.length);
      const correctLen = lens[q.correct];
      const max = Math.max(...lens);
      const min = Math.min(...lens);
      const distractors = lens.filter((_, i) => i !== q.correct);
      const isUniqueLongest = lens.filter((l) => l === max).length === 1 && correctLen === max;
      // Positionen räknas för alla frågor med fyra alternativ, flaggade
      // eller inte; Öva blandar ändå alternativen.
      if (q.options.length === 4) {
        positions[q.correct]++;
        fourOption++;
      }
      if (flagged.has(q.id)) {
        if (bank.flaggedInTotals) {
          assert.ok(!isUniqueLongest, `${q.id} är flaggad men rätt svar är ensamt längst — rätta alternativen`);
        } else {
          continue;
        }
      } else {
        const spread = max / min;
        assert.ok(spread <= bank.maxSpread, `${q.id}: längdspridning ${spread.toFixed(2)} (> ${bank.maxSpread})`);
      }
      counted++;
      ratioSum += correctLen / (distractors.reduce((a, b) => a + b, 0) / distractors.length);
      if (isUniqueLongest) uniqueLongest++;
    }
    const lo = Math.ceil((fourOption / 4) * 0.65);
    const hi = Math.floor((fourOption / 4) * 1.35);
    for (const p of positions) {
      assert.ok(p >= lo && p <= hi, `positionsfördelning ${positions.join("/")} utanför ${lo}–${hi}`);
    }
    const ratio = ratioSum / counted;
    assert.ok(ratio >= 0.9 && ratio <= 1.1, `längdkvot rätt/distraktor ${ratio.toFixed(2)}`);
    const share = uniqueLongest / counted;
    const limitOk = bank.flaggedInTotals ? share <= bank.maxUniqueLongest : share < bank.maxUniqueLongest;
    assert.ok(limitOk, `rätt svar unikt längst i ${Math.round(100 * share)} %`);
  });
}

test("databaser: påståenden mot diagram — under hälften sanna per diagram, som på tentan", () => {
  const byDiagram = {};
  for (const q of dbQ.questions) {
    if (!q.diagram) continue;
    const truthy = /^Ja\b/.test(q.options[q.correct].text);
    (byDiagram[q.diagram] ??= { total: 0, sanna: 0 }).total++;
    if (truthy) byDiagram[q.diagram].sanna++;
  }
  for (const [id, c] of Object.entries(byDiagram)) {
    assert.ok(c.total >= 2, `${id}: bara ${c.total} påstående`);
    assert.ok(c.sanna / c.total < 0.5, `${id}: ${c.sanna} av ${c.total} sanna (ska vara under hälften)`);
  }
});

test("databaser: parkerade SQL-frågor står utanför banken", () => {
  assert.equal(pendingQuestions.length, 2);
  const ids = new Set(dbQ.questions.map((q) => q.id));
  for (const q of pendingQuestions) assert.ok(!ids.has(q.id), `${q.id} är både parkerad och aktiv`);
});

test("process: HT25-frågorna står i LENGTH_FLAGGED och har tentan som källa", () => {
  const flagged = new Set(bpmQ.LENGTH_FLAGGED.map((e) => e.id));
  for (const q of bpmQ.questions.filter((x) => x.id.startsWith("bpm-t"))) {
    assert.ok(flagged.has(q.id), `${q.id} saknas i LENGTH_FLAGGED`);
    assert.match(q.source, /^Tenta HT25/, `${q.id}: källan ska vara tentan`);
  }
});

test("process: Canvas-quizzens tolv frågor är granskade och har quizzet som källa", () => {
  const quiz = bpmQ.questions.filter((q) => q.source.includes("Canvas-quiz (Weaver) HT26"));
  assert.deepEqual(
    quiz.map((q) => q.id).sort(),
    ["bpm-t04", "bpm-t05", "bpm-t09", "bpm-t10", "bpm-t11", "bpm-t16", "bpm-t19", "bpm-t21", "bpm-t22", "bpm-t23", "bpm-t24", "bpm-t25"],
  );
  for (const q of quiz) assert.equal(q.reviewed, true, `${q.id}: reviewed`);
});

test("process: Inget av övriga alternativ står sist när Öva blandar, och rätt svar följer med", () => {
  const withLast = bpmQ.questions.filter((q) => q.options.some((o) => o.last));
  assert.equal(withLast.length, 3);
  for (const q of withLast) {
    for (let run = 0; run < 50; run++) {
      const view = shuffleQuestion(q);
      assert.equal(view.options.at(-1).text, "Inget av övriga alternativ", q.id);
      assert.equal(view.options[view.correct].originalIndex, q.correct, q.id);
    }
  }
});

test("process: parkerade frågor står utanför banken, och ingen aktiv fråga har HT24 som källa", () => {
  // HT24 är den förra lärarens tentor; Weaver säger att de kan strunta i.
  const ids = new Set(bpmQ.questions.map((q) => q.id));
  for (const q of bpmPending) assert.ok(!ids.has(q.id), `${q.id} är både parkerad och aktiv`);
  for (const q of bpmQ.questions) assert.doesNotMatch(q.source, /HT24/, `${q.id}: HT24 som källa`);
});

test("process: kompendiet har inte HT24 som källa, varken i sources eller i löptexten", () => {
  for (const c of bpmChapters) {
    for (const s of c.sources ?? []) assert.doesNotMatch(s, /HT24/, `${c.id}: HT24 i sources`);
    assert.doesNotMatch(c.body, /HT24/, `${c.id}: HT24 i texten`);
  }
});
