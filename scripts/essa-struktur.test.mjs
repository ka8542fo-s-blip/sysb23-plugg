// Checklistorna ska följa samma fyra steg i varje essä — det är formen
// läraren premierar, och den ska inte glida isär när innehåll läggs till.
import { test } from "node:test";
import assert from "node:assert/strict";
import { essays as strategiEssays } from "../src/data/strategi/essays.js";
import { essays as processEssays } from "../src/data/process/essays.js";
import { essays as arkitekturEssays } from "../src/data/arkitektur/essays.js";
import { getCourse } from "../src/data/index.js";
import { ZACHMAN_WHY } from "../src/data/arkitektur/cards.js";

const essays = [...strategiEssays, ...processEssays];

const HEADINGS = ["Vad det är", "Varför det spelar roll", "Konkret", "Koppling"];

test("varje essä har de fyra rubrikerna i rätt ordning", () => {
  assert.ok(strategiEssays.length >= 6);
  assert.equal(processEssays.length, 6);
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
    "balanserat styrkort", "strategic alignment",
    "strategin", "medarbetarskapet",
    // BPM
    "bpr", "hammer", "produktivitetsparadoxen", "7fe", "huset", "sustainability",
    "scenarierna", "strategy-led",
  ];
  for (const essay of essays) {
    const text = essay.checklist[3].points.join(" ").toLowerCase();
    assert.ok(
      OMRADEN.some((name) => text.includes(name)),
      `${essay.id}: kopplingssteget namnger inget område`,
    );
  }
});

// Verksamhetsarkitektur har en annan form: UF:s modellsvar är facit, och
// checklistan bryter ner just det modellsvaret (essays.js förklarar). Därför
// gäller inte fyrstegsrubrikerna ovan, men varje post ska ha UF:s fråga,
// modellsvar, källa och en checklista. Ordningen är modul 12, 1–11 som i
// Läs; modul 12:s scenarier och Final challenge är "UF:s fördjupade
// fallfrågor"; Zachman-essän står efter modul 4:s frågor, märkt Troligt.
test("Verksamhetsarkitektur: lärarens 53 frågor i ordningen 12, 1–11, Zachman-essän med förklaring", () => {
  const zachman = arkitekturEssays.find((essay) => essay.id === "ea-e-zachman");
  const rest = arkitekturEssays.filter((essay) => essay !== zachman);
  assert.equal(arkitekturEssays[0].id, "ea-e12-29", "modul 12 först");
  const order = [...new Set(arkitekturEssays.map((e) => e.chapter))];
  assert.deepEqual(order, ["kap12", "kap1", "kap2", "kap3", "kap4", "kap5", "kap6", "kap7", "kap8", "kap9", "kap10", "kap11"]);
  assert.equal(zachman.chapter, "kap4");
  assert.equal(zachman.level, "troligt");
  assert.ok(zachman.levelNote.includes(ZACHMAN_WHY), "förklaringen i klartext");
  assert.ok(!zachman.pinned && !zachman.priority, "Zachman-essän är inte särskilt prioriterad");
  assert.equal(arkitekturEssays.indexOf(zachman), arkitekturEssays.findIndex((e) => e.id === "ea-e4-11") + 1);
  assert.match(zachman.question, /raderna och kolumnerna i Zachmans ramverk/);
  assert.equal(rest.length, 53);
  const fall = arkitekturEssays.filter((e) => e.group).map((e) => e.id);
  assert.deepEqual(fall, ["ea-e12-scenario-1", "ea-e12-scenario-2", "ea-e12-scenario-3", "ea-e12-scenario-4", "ea-e12-scenario-5", "ea-e12-slututmaning"]);
  for (const id of fall) assert.equal(arkitekturEssays.find((e) => e.id === id).group, "Lärarens fördjupade fallfrågor");
  const chapters = new Set(getCourse("arkitektur").chapters.map((c) => c.id));
  const ids = new Set();
  for (const essay of arkitekturEssays) {
    assert.ok(!ids.has(essay.id), `dubblett ${essay.id}`);
    ids.add(essay.id);
    for (const field of ["question", "context", "source", "label"]) {
      assert.ok(essay[field]?.trim(), `${essay.id} saknar ${field}`);
    }
    assert.ok(chapters.has(essay.chapter), `${essay.id}: kapitlet ${essay.chapter} finns inte`);
    if (essay !== zachman) assert.ok(essay.modelAnswer?.trim().length > 40, `${essay.id}: UF:s modellsvar`);
    assert.ok(essay.checklist.length >= 1 && essay.checklist.length <= 5, `${essay.id}: grupper`);
    for (const group of essay.checklist) {
      assert.ok(group.heading?.trim(), `${essay.id}: rubrik`);
      assert.ok(group.points.length >= 1 && group.points.length <= 8, `${essay.id} / ${group.heading}: ${group.points.length} punkter`);
      for (const point of group.points) assert.ok(point.trim().length > 20, `${essay.id}: för kort punkt`);
    }
  }
  // Modul 7:s fråga 24 och 27 hör till kapitel 8 (UF:s not i modul 8).
  for (const id of ["ea-e7-24", "ea-e7-27"]) {
    assert.equal(arkitekturEssays.find((e) => e.id === id).chapter, "kap8", id);
  }
  // Tentan anger inget ordtak.
  assert.equal(getCourse("arkitektur").essayWordLimit, null);
});
