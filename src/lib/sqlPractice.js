// Kopplar generatorn till den riktiga databasen: läser ut vilka värden som
// faktiskt finns, och kastar de kandidater som inte duger.
//
// En genererad uppgift släpps fram först när dess lösning har körts och
// gett ett vettigt resultat — då kan slumpen aldrig producera en fråga
// som saknar svar eller som filtrerar bort ingenting.

import { buildCandidate } from "./sqlGenerator.js";

// Kolumner som får bära textvärden respektive tal i uppgifterna.
const TEXT_COLUMNS = [
  ["Employee", "EmpName"],
  ["Employee", "EmpAddress"],
  ["Patient", "PatientName"],
  ["Patient", "PatientAddress"],
  ["Unit", "UnitName"],
  ["Unit", "UnitAddress"],
  ["Illness", "IllnessName"],
  ["Car", "Brand"],
];

const NUMBER_COLUMNS = [
  ["Employee", "EmpSalary"],
  ["Car", "Price"],
];

const TABLES = ["Unit", "Employee", "Patient", "Illness", "Car", "Examines", "Suffers", "HasSuffered"];

export function collectFacts(db, runSelect) {
  const values = {};
  const initials = {};
  const numbers = {};
  const counts = {};

  for (const table of TABLES) {
    counts[table] = runSelect(db, `SELECT COUNT(*) FROM ${table};`).values[0][0];
  }

  for (const [table, column] of TEXT_COLUMNS) {
    const rows = runSelect(db, `SELECT DISTINCT ${column} FROM ${table} WHERE ${column} IS NOT NULL;`).values;
    values[`${table}.${column}`] = rows.map((row) => String(row[0]));
    // Begynnelsebokstäver som finns men inte hos alla — annars blir LIKE
    // en fråga som släpper igenom hela tabellen.
    const total = counts[table];
    const letters = [];
    for (const letter of new Set(values[`${table}.${column}`].map((v) => v[0]?.toUpperCase()).filter(Boolean))) {
      const hits = runSelect(
        db,
        `SELECT COUNT(*) FROM ${table} WHERE ${column} LIKE '${letter}%';`,
      ).values[0][0];
      if (hits > 0 && hits < total) letters.push(letter);
    }
    initials[`${table}.${column}`] = letters;
  }

  for (const [table, column] of NUMBER_COLUMNS) {
    const rows = runSelect(db, `SELECT ${column} FROM ${table} WHERE ${column} IS NOT NULL ORDER BY ${column};`).values;
    numbers[`${table}.${column}`] = rows.map((row) => Number(row[0]));
  }

  return { values, initials, numbers, counts };
}

// Jämförbar form för att känna igen en lösning vi redan har som kursövning.
export function normalizeSql(sql) {
  return String(sql).toLowerCase().replace(/\s+/g, " ").replace(/;\s*$/, "").trim();
}

const MAX_ROWS = 40;

// Familjer där ett filter ska ha filtrerat bort något.
const FILTERING = new Set([
  "filter-text",
  "filter-tal",
  "between",
  "in-lista",
  "like",
  "null-test",
  "kombinerat-villkor",
  "having",
  "underfraga",
  "exists",
  "korrelerad",
]);

export function validateCandidate(candidate, { db, runSelect, facts, taken }) {
  if (!candidate) return { ok: false, reason: "kunde inte byggas" };
  if (taken?.has(normalizeSql(candidate.solution))) {
    return { ok: false, reason: "samma fråga finns redan" };
  }

  let result;
  try {
    result = runSelect(db, candidate.solution);
  } catch (error) {
    return { ok: false, reason: `lösningen kraschade: ${error.message}` };
  }

  const rows = result.values.length;
  if (rows === 0) return { ok: false, reason: "tomt resultat" };
  if (rows > MAX_ROWS) return { ok: false, reason: "för många rader" };

  if (FILTERING.has(candidate.family)) {
    const base = candidate.tables[0];
    if (facts.counts[base] !== undefined && rows >= facts.counts[base]) {
      return { ok: false, reason: "filtret släpper igenom allt" };
    }
  }

  return { ok: true, rows };
}

// Slumpar fram en giltig övning. Kastade kandidater räknas inte som fel —
// det är så generatorn håller kvaliteten uppe.
export function generateExercise({
  db,
  runSelect,
  facts,
  taken,
  difficulty = 0,
  seed = Math.floor(Math.random() * 2 ** 31),
  attempts = 60,
}) {
  let current = seed >>> 0;
  for (let i = 0; i < attempts; i++) {
    const candidate = buildCandidate(current, facts, difficulty);
    const verdict = validateCandidate(candidate, { db, runSelect, facts, taken });
    if (verdict.ok) return { ...candidate, rows: verdict.rows };
    current = (current + 0x9e3779b9) >>> 0;
  }
  return null;
}
