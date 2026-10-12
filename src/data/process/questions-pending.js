// Parkerade BPM-frågor — INTE med i Öva.
//
// 2026-09-30: HT24-tentorna gjordes av den förra läraren, och Weaver säger
// på F1 att de kan strunta i (hans egna HT25-tentor ligger som övningsquiz
// på Canvas). Frågor vars begrepp bara har stöd i HT24 står här tills F4
// eller Canvas-quizzarna ger ett eget stöd. bpm-q16 prövar F-gruppernas namn,
// som Weaver själv säger att kursen inte använder.
//
// Skäl per fråga:
//   bpm-q16 — F-gruppernas namn (F3: "spelar ingen roll", används inte).
// bpm-q18, bpm-q30 och bpm-q32 är tillbaka i Öva sedan 2026-10-12, med F4 som
// källa (q32 med rätt svar omskrivet efter F4).
export const pendingQuestions = [
  { id: "bpm-q16", topic: "ramverk", difficulty: 1,
    question: "Vilka tre faser ingår i F-gruppen Fulfilment i 7FE?",
    options: [
      { text: "Implement, Realize och Sustainability.", explain: "Realize och Sustainability är gruppen Future." },
      { text: "Understand, Innovate och People.", explain: "Understand och Innovate är Findings & solutions." },
      { text: "Launch, Understand och Develop.", explain: "Launch hör till Foundations-gruppen." },
      { text: "People, Develop och Implement.", explain: "Fulfilment förverkligar lösningarna." }
    ],
    correct: 3, source: "F2 (7FE = 10P3E)", reviewed: false },

];
