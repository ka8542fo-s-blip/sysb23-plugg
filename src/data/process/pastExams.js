// Gamla tentor i tentans egen ordning: det enda stället som vet vilken tenta
// en fråga kommer från, vilket nummer den hade där och vad den gav i poäng.
// Läget Tentafrågor i Öva läser härifrån, aldrig ur fritexten i `source` —
// flera egna frågor nämner tentan i källan utan att vara tentafrågor
// (bpm-q33, q35, q43, q53). Testet past-exams håller listan och källorna i takt.
//
// En del pekar på exakt en post:
//   question: id i questions.js (tentans flervalsfråga i banken)
//   task:     id i bpmnTasks.js (bara när banken saknar delen: 3(c), omtenta 13 och 15)
//   essay:    id i essays.js    (visas som länk till Essä, räknas inte)
// run: BPMN-övningens uppgift med samma diagram, för "Kör diagrammet".
// 3(b), 3(d) och omtenta 16 finns både i banken (Canvas-quizzets
// alternativordning, förklaring per alternativ) och i BPMN-övningar; banken
// räknas och uppgiften är bara länken.
// Ny tenta = ett nytt objekt här (plus nya bpm-t-frågor i banken).
const mc = (no, question, points = 5) => ({ no, points, question });

export const pastExams = [
  {
    id: "bpm-ht25-ord",
    term: "HT25",
    date: "2025-11-21",
    title: "Ordinarie tenta",
    dateLabel: "21 nov 2025",
    short: "Ordinarie nov 2025",
    sections: [
      {
        title: "Essäer",
        parts: [
          { no: "1(a)", points: 15, essay: "bpm-e1" },
          { no: "1(b)", points: 15, essay: "bpm-e2" },
        ],
      },
      {
        title: "BPM",
        parts: [
          mc("2(a)", "bpm-t01"), mc("2(b)", "bpm-t02"), mc("2(c)", "bpm-t08"),
          mc("2(d)", "bpm-t11"), mc("2(e)", "bpm-t19"), mc("2(f)", "bpm-t09"),
          mc("2(g)", "bpm-t04"), mc("2(h)", "bpm-t18"), mc("2(i)", "bpm-t12"),
          mc("2(j)", "bpm-t13"),
        ],
      },
      {
        title: "BPMN",
        parts: [
          mc("3(a)", "bpm-t21", 3),
          { no: "3(b)", points: 6, question: "bpm-t24", run: "kp-3b" },
          { no: "3(c)", points: 7, task: "kp-3c" },
          { no: "3(d)", points: 4, question: "bpm-t23", run: "kp-3d" },
        ],
      },
    ],
  },
  {
    id: "bpm-ht25-om",
    term: "HT25",
    date: "2026-01-09",
    title: "Omtenta",
    dateLabel: "9 jan 2026",
    short: "Omtenta jan 2026",
    sections: [
      {
        title: "Essäer",
        parts: [
          { no: "1", points: 15, essay: "bpm-e3" },
          { no: "2", points: 15, essay: "bpm-e4" },
        ],
      },
      {
        title: "BPM",
        parts: [
          mc("3", "bpm-t14"), mc("4", "bpm-t15"), mc("5", "bpm-t16"), mc("6", "bpm-t17"),
          mc("7", "bpm-t05"), mc("8", "bpm-t03"), mc("9", "bpm-t06"), mc("10", "bpm-t07"),
          mc("11", "bpm-t20"), mc("12", "bpm-t10"),
        ],
      },
      {
        title: "BPMN",
        parts: [
          { no: "13", points: 5, task: "kp-om13" },
          mc("14", "bpm-t22", 3),
          { no: "15", points: 7, task: "kp-om15" },
          { no: "16", points: 5, question: "bpm-t25", run: "kp-om16" },
        ],
      },
    ],
  },
];
