// Checklistorna ska följa samma fyra steg i varje essä — det är formen
// läraren premierar, och den ska inte glida isär när innehåll läggs till.
import { test } from "node:test";
import assert from "node:assert/strict";
import { essays } from "../src/data/strategi/essays.js";

const HEADINGS = ["Vad det är", "Varför det spelar roll", "Konkret", "Koppling"];

test("varje essä har de fyra rubrikerna i rätt ordning", () => {
  assert.ok(essays.length >= 6);
  for (const essay of essays) {
    assert.deepEqual(
      essay.checklist.map((group) => group.heading),
      HEADINGS,
      `${essay.id} har fel rubriker`,
    );
  }
});

test("två till fyra punkter under varje rubrik, ingen tom", () => {
  for (const essay of essays) {
    for (const group of essay.checklist) {
      const n = group.points.length;
      assert.ok(n >= 2 && n <= 4, `${essay.id} / ${group.heading}: ${n} punkter`);
      for (const point of group.points) {
        assert.equal(typeof point, "string");
        assert.ok(point.trim().length > 20, `${essay.id}: för kort punkt`);
      }
    }
  }
});

test("varje essä har fråga, kontext och disposition", () => {
  for (const essay of essays) {
    for (const field of ["id", "question", "context", "outline"]) {
      assert.ok(essay[field]?.trim(), `${essay.id} saknar ${field}`);
    }
  }
});

test("kopplingssteget namnger ett område ur kursen", () => {
  // Punkt 4 ska peka på något annat i kursen, inte bara säga "koppla till kursen".
  const OMRADEN = [
    "produktivitetsparadoxen", "resursbaserade", "vrio", "mjuka styrmedel",
    "dubbelkretslärande", "ittner", "balanced scorecard", "triple bottom line",
    "transparenstestet", "satisfiering", "intressentmodellen", "kassaflödesmodellen",
    "strategin", "medarbetarskapet",
  ];
  for (const essay of essays) {
    const text = essay.checklist[3].points.join(" ").toLowerCase();
    assert.ok(
      OMRADEN.some((name) => text.includes(name)),
      `${essay.id}: kopplingssteget namnger inget område`,
    );
  }
});
