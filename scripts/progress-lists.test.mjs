// Varje övningslista som en vy visar bockar för (modelProgress) måste finnas
// i det App läser in vid start (data/progressLists.js). Annars ligger
// "solved" kvar i localStorage men syns aldrig efter omladdning — så
// försvann bockarna för ER-diagram till DDL.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { modelProgressIds } from "../src/data/progressLists.js";

const views = new URL("../src/views/", import.meta.url);
const loaded = new Set(modelProgressIds());

test("App läser in progressLists, inte en egen lista", () => {
  const app = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
  assert.match(app, /loadModelProgress\(modelProgressIds\(\)\)/);
});

test("varje lista som en vy visar bockar för laddas in av App", async () => {
  let checked = 0;
  for (const file of readdirSync(views).filter((f) => f.endsWith(".jsx"))) {
    const src = readFileSync(new URL(file, views), "utf8");
    if (!/modelProgress\[/.test(src)) continue;
    for (const [, names, path] of src.matchAll(/import\s*\{([^}]+)\}\s*from\s*"\.\.\/data\/([^"]+)"/g)) {
      const mod = await import(new URL(`../src/data/${path}`, import.meta.url));
      for (const spec of names.split(",").map((x) => x.trim()).filter(Boolean)) {
        const name = spec.split(/\s+as\s+/)[0].trim();
        const list = mod[name];
        if (!Array.isArray(list) || !list.every((x) => x && typeof x.id === "string")) continue;
        checked++;
        const missing = list.map((x) => x.id).filter((id) => !loaded.has(id));
        assert.deepEqual(missing, [], `${file} visar bockar för ${name} (${path}), men App läser inte in dem`);
      }
    }
  }
  assert.ok(checked >= 5, `bara ${checked} listor kontrollerades`);
});
