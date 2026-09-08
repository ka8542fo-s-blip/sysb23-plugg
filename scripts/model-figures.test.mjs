// Varje modelluppgift har ett registrerat diagram, och varje diagram används.
import { test } from "node:test";
import assert from "node:assert/strict";
import { modelExercises } from "../src/data/databaser/modelExercises.js";
import { MODEL_FIGURE_IDS } from "../src/components/model/modelFigureIds.js";

test("uppgifternas diagram finns och används", () => {
  const used = new Set();
  for (const e of modelExercises) {
    assert.ok(MODEL_FIGURE_IDS.includes(e.diagram), `${e.id}: okänt diagram ${e.diagram}`);
    used.add(e.diagram);
  }
  for (const id of MODEL_FIGURE_IDS) assert.ok(used.has(id), `${id} används inte`);
});
