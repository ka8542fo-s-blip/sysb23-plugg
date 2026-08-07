// Kontrollerar att en frågebank följer designreglerna i
// src/data/strategi/questions.js (kommentaren överst):
// rätt svar får inte avslöjas av alternativens längd eller position.
//
//   node scripts/check-fragebank.mjs [sökväg till questions.js]
//
// Utan argument kontrolleras Strategi-banken. Avslutar med felkod
// om något mått ligger utanför gränserna.
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const fil = resolve(process.argv[2] ?? "src/data/strategi/questions.js");
const { questions } = await import(pathToFileURL(fil));

const n = questions.length;
let uniktLangst = 0;
const positioner = [0, 0, 0, 0];
let summaKvot = 0;
let varstaSpridning = 0;
let varstaSpridningId = null;
const spridningsBrott = [];

for (const q of questions) {
  const lens = q.options.map((o) => o.text.length);
  const correctLen = lens[q.correct];
  const maxLen = Math.max(...lens);
  const minLen = Math.min(...lens);

  // Räknas bara om rätt svar är strikt längre än alla andra —
  // delad förstaplats går inte att utnyttja.
  if (lens.filter((l) => l === maxLen).length === 1 && correctLen === maxLen) {
    uniktLangst++;
  }

  positioner[q.correct]++;
  summaKvot += correctLen / (lens.reduce((a, b) => a + b, 0) / lens.length);

  const spridning = maxLen / minLen;
  if (spridning > varstaSpridning) {
    varstaSpridning = spridning;
    varstaSpridningId = q.id;
  }
  if (spridning > 1.25) spridningsBrott.push(`${q.id} (${spridning.toFixed(2)})`);
}

const andelLangst = (uniktLangst / n) * 100;
const medelKvot = summaKvot / n;
// Gränserna skalar med bankens storlek; vid 49 frågor blir de 8–16,
// vilket är promptens ursprungliga krav.
const posMin = Math.ceil((n / 4) * 0.65);
const posMax = Math.floor((n / 4) * 1.35);
const ok = {
  langst: andelLangst < 35,
  kvot: medelKvot >= 0.9 && medelKvot <= 1.1,
  positioner: positioner.every((p) => p >= posMin && p <= posMax),
  spridning: spridningsBrott.length === 0,
};

console.log(`Frågebank: ${fil}`);
console.log(`Antal frågor: ${n}`);
console.log(
  `Rätt svar unikt längst: ${uniktLangst}/${n} (${andelLangst.toFixed(0)} %) — krav < 35 %: ${ok.langst ? "OK" : "BROTT"}`
);
console.log(
  `Längdkvot rätt/medel: ${medelKvot.toFixed(2)} — krav 0,9–1,1: ${ok.kvot ? "OK" : "BROTT"}`
);
console.log(
  `Positionsfördelning 0–3: ${positioner.join("/")} — krav ${posMin}–${posMax} per position: ${ok.positioner ? "OK" : "BROTT"}`
);
console.log(
  `Största längdspridning inom en fråga: ${varstaSpridning.toFixed(2)} (${varstaSpridningId}) — krav ≤ 1,25: ${ok.spridning ? "OK" : "BROTT: " + spridningsBrott.join(", ")}`
);

process.exitCode = Object.values(ok).every(Boolean) ? 0 : 1;
