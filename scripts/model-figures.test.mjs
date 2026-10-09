// Varje modelluppgift har ett registrerat diagram, och varje diagram används.
import { test } from "node:test";
import assert from "node:assert/strict";
import { modelExercises } from "../src/data/databaser/modelExercises.js";
import { MODEL_FIGURE_IDS } from "../src/components/model/modelFigureIds.js";
import { ddlExercises } from "../src/data/databaser/ddlExercises.js";
import { statementExercises } from "../src/data/databaser/statementExercises.js";
import { DIAGRAM_IDS } from "../src/components/knowledge/diagrams/ids.js";
import { oldExams } from "../src/data/databaser/oldExams.js";

test("uppgifternas diagram finns och används", () => {
  const used = new Set();
  for (const e of modelExercises) {
    assert.ok(MODEL_FIGURE_IDS.includes(e.diagram), `${e.id}: okänt diagram ${e.diagram}`);
    used.add(e.diagram);
  }
  // DDL-fliken och Läsa diagram får också peka på kompendiets diagram.
  for (const e of [...ddlExercises, ...statementExercises]) {
    assert.ok(MODEL_FIGURE_IDS.includes(e.diagram) || DIAGRAM_IDS.includes(e.diagram), `${e.id}: okänt diagram ${e.diagram}`);
    used.add(e.diagram);
  }
  // Fliken Tenta: varje gammal tentas diagram för uppgift 1 och 2.
  for (const e of oldExams) for (const d of [e.task1.diagram, e.task2.diagram]) {
    assert.ok(MODEL_FIGURE_IDS.includes(d), `${e.id}: okänt diagram ${d}`);
    used.add(d);
  }
  for (const id of MODEL_FIGURE_IDS) assert.ok(used.has(id), `${id} används inte`);
});
