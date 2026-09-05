// Kapiteltexterna bäddar in figurer som [[diagram:namn]]. Namnen är ett API
// mot reading.js: varje platshållare ska ha en registrerad figur, varje
// figur ska användas, och platshållaren ska stå ensam på sin rad (annars
// fångar inte styckerenderaren den).
import { test } from "node:test";
import assert from "node:assert/strict";
import { chapters } from "../src/data/databaser/reading.js";
import { chapters as strategi } from "../src/data/strategi/reading.js";
import { DIAGRAM_IDS, DIAGRAM_RE } from "../src/components/knowledge/diagrams/ids.js";

const all = [...chapters, ...strategi];

test("varje platshållare har en figur och varje figur används", () => {
  const used = new Set();
  for (const chapter of all) {
    for (const match of chapter.body.matchAll(/\[\[diagram:([^\]]*)\]\]/g)) {
      assert.ok(DIAGRAM_IDS.includes(match[1]), `${chapter.id}: okänt diagram "${match[1]}"`);
      used.add(match[1]);
    }
  }
  for (const id of DIAGRAM_IDS) assert.ok(used.has(id), `figuren "${id}" används inte i något kapitel`);
});

test("platshållaren står ensam på sin rad", () => {
  for (const chapter of all) {
    for (const line of chapter.body.split("\n")) {
      if (!line.includes("[[diagram:")) continue;
      assert.match(line.trim(), DIAGRAM_RE, `${chapter.id}: "${line.trim()}"`);
    }
  }
});
