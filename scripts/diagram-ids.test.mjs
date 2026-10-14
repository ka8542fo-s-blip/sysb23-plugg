// Kapiteltexterna bäddar in figurer som [[diagram:namn]]. Namnen är ett API
// mot reading.js: varje platshållare ska ha en registrerad figur, varje
// figur ska användas, och platshållaren ska stå ensam på sin rad (annars
// fångar inte styckerenderaren den).
import { test } from "node:test";
import assert from "node:assert/strict";
import { chapters } from "../src/data/databaser/reading.js";
import { chapters as strategi } from "../src/data/strategi/reading.js";
import { chapters as processChapters } from "../src/data/process/reading.js";
import { DIAGRAM_IDS, DIAGRAM_RE } from "../src/components/knowledge/diagrams/ids.js";
import { CONCEPT_FIGURES } from "../src/components/figures/conceptFigureMeta.js";

const courses = [["databaser", chapters], ["strategi", strategi], ["process", processChapters]];
const all = courses.flatMap(([, list]) => list);

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

test("begreppsfigurerna: rätt delkurs och kapitel, nummer i textens ordning, figurtext och tillgänglighetstexter", () => {
  const seen = new Set();
  for (const [course, list] of courses) {
    for (const chapter of list) {
      let n = 0;
      for (const match of chapter.body.matchAll(/\[\[diagram:([^\]]*)\]\]/g)) {
        const meta = CONCEPT_FIGURES[match[1]];
        if (!meta) continue;
        n++;
        assert.ok(!seen.has(match[1]), `${match[1]} används två gånger`);
        seen.add(match[1]);
        assert.equal(meta.course, course, `${match[1]}: delkurs`);
        assert.equal(meta.chapter, chapter.id, `${match[1]}: kapitel`);
        assert.equal(meta.number, `${chapter.number}.${n}`, `${match[1]}: figurnummer`);
        for (const field of ["caption", "source", "title", "desc"]) {
          assert.ok(typeof meta[field] === "string" && meta[field].length > 0, `${match[1]}: ${field} saknas`);
        }
        assert.match(meta.source, /^(Efter |Egen illustration)/, `${match[1]}: källraden`);
      }
    }
  }
  assert.deepEqual([...seen].sort(), Object.keys(CONCEPT_FIGURES).sort(), "varje begreppsfigur står i ett kapitel");
  assert.ok(Object.values(CONCEPT_FIGURES).every((meta) => meta.course !== "strategi"), "Strategi har inga begreppsfigurer");
});
