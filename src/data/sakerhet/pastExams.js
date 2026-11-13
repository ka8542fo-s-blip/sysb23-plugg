// HT25:s tre tentor i Säkerhet i informationssystem, i tentans egen ordning
// och i samma form som BPM:s (data/process/pastExams.js). Läget Tentafrågor
// i Öva och fliken Tenta läser härifrån.
//
// Varje del pekar på en fråga i examBank.js. Poäng och avdrag hämtas ur
// banken, så att de följer frågan och inte platsen: samma fråga har samma
// poäng på alla tentor där den finns. `order` är tentans alternativordning
// som index i bankens `options` (ur PDF:erna 2026-11-13; ordningen skiljer
// sig mellan tentorna). Fliken Tenta visar alternativen i den ordningen;
// Öva blandar som vanligt.
//
// Tentornas inledning säger att fråga 1–3 inte har något avdrag. Det
// stämmer för ordinarien och omtentan (sak-01–03), men uppsamlingens fråga 1
// (sak-04, −1) och fråga 3 (sak-20, −4) anger avdrag i själva frågan. Här
// gäller frågans egen rad.
import { examBank } from "./examBank.js";

const bank = Object.fromEntries(examBank.map((question) => [question.id, question]));

const mc = (no, id, order) => {
  const question = bank[id];
  if (!question) throw new Error(`pastExams: ${id} saknas i examBank`);
  return { no: String(no), points: question.points, penalty: question.penalty, question: id, order };
};

export const pastExams = [
  {
    id: "sak-ht25-ord",
    term: "HT25",
    date: "2025-11-25",
    title: "Ordinarie tenta",
    dateLabel: "25 nov 2025",
    short: "Ordinarie nov 2025",
    sections: [
      {
        title: "Flerval",
        parts: [
          mc(1, "sak-01", [0, 1, 2, 3]),
          mc(2, "sak-02", [0, 1, 2, 3]),
          mc(3, "sak-03", [0, 1, 2]),
          mc(4, "sak-04", [0, 2, 1, 3]),
          mc(5, "sak-05", [0, 1, 2, 3]),
          mc(6, "sak-06", [0, 1, 2, 3]),
          mc(7, "sak-07", [0, 1, 2, 3]),
          mc(8, "sak-08", [0, 1, 2, 3]),
          mc(9, "sak-09", [0, 1, 2, 3]),
          mc(10, "sak-10", [0, 1, 2, 3]),
          mc(11, "sak-11", [0, 1, 2, 3]),
          mc(12, "sak-12", [0, 1, 2, 3]),
          mc(13, "sak-13", [0, 1, 2, 3]),
          mc(14, "sak-14", [0, 1, 2, 3]),
          mc(15, "sak-15", [0, 1, 2, 3]),
          mc(16, "sak-16", [0, 1, 2, 3]),
          mc(17, "sak-17", [0, 1, 2, 3]),
          mc(18, "sak-18", [0, 1, 2, 3]),
          mc(19, "sak-19", [0, 1, 2, 3]),
          mc(20, "sak-20", [0, 1, 2, 3]),
        ],
      },
    ],
  },
  {
    id: "sak-ht25-om",
    term: "HT25",
    date: "2026-01-14",
    title: "Omtenta",
    dateLabel: "14 jan 2026",
    short: "Omtenta jan 2026",
    sections: [
      {
        title: "Flerval",
        parts: [
          mc(1, "sak-01", [0, 1, 2, 3]),
          mc(2, "sak-02", [3, 0, 1, 2]),
          mc(3, "sak-03", [0, 2, 1]),
          mc(4, "sak-04", [0, 2, 3, 1]),
          mc(5, "sak-05", [1, 0, 3, 2]),
          mc(6, "sak-21", [0, 1, 2, 3]),
          mc(7, "sak-07", [0, 2, 1, 3]),
          mc(8, "sak-08", [0, 2, 3, 1]),
          mc(9, "sak-09", [1, 0, 3, 2]),
          mc(10, "sak-10", [1, 2, 3, 0]),
          mc(11, "sak-11", [1, 2, 0, 3]),
          mc(12, "sak-12", [2, 1, 0, 3]),
          mc(13, "sak-13", [0, 1, 3, 2]),
          mc(14, "sak-14", [3, 1, 0, 2]),
          mc(15, "sak-15", [1, 0, 3, 2]),
          mc(16, "sak-16", [0, 1, 3, 2]),
          mc(17, "sak-17", [0, 1, 2, 3]),
          mc(18, "sak-18", [3, 1, 0, 2]),
          mc(19, "sak-22", [0, 1, 2, 3]),
          mc(20, "sak-20", [1, 2, 3, 0]),
        ],
      },
    ],
  },
  {
    id: "sak-ht25-upps",
    term: "HT25",
    date: "2026-05-18",
    title: "Uppsamlingstenta",
    dateLabel: "18 maj 2026",
    short: "Uppsamling maj 2026",
    sections: [
      {
        title: "Flerval",
        parts: [
          mc(1, "sak-04", [0, 1, 2, 3]),
          mc(2, "sak-23", [0, 1, 2, 3]),
          mc(3, "sak-20", [2, 3, 1, 0]),
          mc(4, "sak-11", [2, 3, 1, 0]),
          mc(5, "sak-18", [2, 0, 3, 1]),
          mc(6, "sak-16", [2, 0, 1, 3]),
          mc(7, "sak-24", [0, 1, 2, 3]),
          mc(8, "sak-22", [0, 2, 1, 3]),
          mc(9, "sak-12", [3, 0, 2, 1]),
          mc(10, "sak-17", [0, 1, 2, 3]),
          mc(11, "sak-25", [0, 1, 2, 3]),
          mc(12, "sak-14", [2, 1, 3, 0]),
          mc(13, "sak-08", [2, 1, 3, 0]),
          mc(14, "sak-10", [3, 0, 1, 2]),
          mc(15, "sak-09", [3, 0, 1, 2]),
          mc(16, "sak-07", [2, 3, 1, 0]),
          mc(17, "sak-26", [0, 1, 2]),
          mc(18, "sak-13", [0, 2, 1, 3]),
          mc(19, "sak-15", [3, 2, 1, 0]),
          mc(20, "sak-21", [1, 2, 3, 0]),
        ],
      },
    ],
  },
];

// "När lönar det sig att svara?" Svara om sannolikheten att du har rätt är
// större än avdrag / (poäng + avdrag). Varje par (poäng, avdrag) som finns
// i banken står på en rad; testet sakerhet-tenta håller tabellen och banken
// i takt och räknar om procenten.
export const ANSWER_RULE =
  "Svara om sannolikheten att du har rätt är större än avdrag / (poäng + avdrag). En ren gissning bland fyra alternativ har 25 %.";

export const ANSWER_TABLE = [
  { pairs: [[5, 0]], percent: 0, advice: "Svara alltid" },
  { pairs: [[5, 1]], percent: 17, advice: "Svara alltid" },
  { pairs: [[4, 1]], percent: 20, advice: "Svara alltid" },
  { pairs: [[3, 1]], percent: 25, advice: "Svara om du kan stryka ett alternativ" },
  { pairs: [[6, 2]], percent: 25, advice: "Svara om du kan stryka ett alternativ", label: "publik nyckel" },
  { pairs: [[5, 2]], percent: 29, advice: "Svara om du kan stryka ett alternativ" },
  { pairs: [[4, 2], [8, 4]], percent: 33, advice: "Svara om du kan stryka ett alternativ" },
  { pairs: [[7, 4]], percent: 36, advice: "Svara om du kan stryka ett alternativ" },
  { pairs: [[5, 3]], percent: 38, advice: "Svara om du kan stryka ett alternativ" },
  { pairs: [[4, 4], [6, 6]], percent: 50, advice: "Svara bara om du lutar åt ett svar" },
  { pairs: [[3, 4]], percent: 57, advice: "Svara bara om du är ganska säker" },
];
