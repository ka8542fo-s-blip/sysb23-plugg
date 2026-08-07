// SQLite i webbläsaren via sql.js (WebAssembly).
//
// Modulen laddas lazy — WASM-filen hämtas först när SQL-läget öppnas.
// Varje körning får en färsk databas byggd ur seed-skriptet, så att en
// DELETE i ett svar inte förstör resten av passet.

import { hospitalSeed } from "../data/databaser/hospitalSeed.js";

let enginePromise = null;

export function loadEngine() {
  if (!enginePromise) {
    enginePromise = import("sql.js").then((module) =>
      module.default({
        // WASM-filen ligger i public/ och måste pekas ut explicit —
        // Vite bundlar den inte åt oss. BASE_URL gör att den hittas
        // även när sidan ligger i en underkatalog på GitHub Pages.
        locateFile: (file) => `${import.meta.env.BASE_URL}${file}`,
      }),
    );
  }
  return enginePromise;
}

export async function newDatabase() {
  const SQL = await loadEngine();
  const db = new SQL.Database();
  db.run(hospitalSeed);
  return db;
}

// Kör en fråga som returnerar rader. prepare/step används i stället för
// exec eftersom exec ger en tom array när frågan inte matchar någon rad —
// då vill vi ändå veta vilka kolumner den skulle ha gett.
export function runSelect(db, sql) {
  const stmt = db.prepare(sql);
  try {
    const values = [];
    while (stmt.step()) values.push(stmt.get());
    return { columns: stmt.getColumnNames(), values };
  } finally {
    stmt.free();
  }
}

// Kör en eller flera satser utan att bry sig om returvärden.
export function runScript(db, sql) {
  db.run(sql);
}

export const engineApi = { newDatabase, runSelect, runScript };
