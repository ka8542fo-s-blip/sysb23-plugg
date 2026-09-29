// Uppgifterna i Kör processen. Varje uppgift har ett diagram (bpmnDiagrams.js),
// ett scenario som simulatorn kör, tentans alternativ och poäng, och ett
// facit (`answer`) som är skrivet för hand. Testet scripts/bpmn-sim.test.mjs
// kör simulatorn och kräver att den ger samma svar som facit — en avvikelse
// är ett fynd som ska rapporteras, inte rättas i tysthet.
//
// kind: "aktiviteter" (vilka aktiviteter inträffar) | "tid" (när är processen
// klar). Alternativen behåller tentans antal (5–6), eftersom gissningsregeln
// beror på det.
//
// answer: aktiviteter som bokstäver ("ABD") eller sluttid ("2025-12-06 kl. 02:01").

export const tasks = [
  {
    id: "kp-3b", diagram: "ht25-3b", kind: "aktiviteter", points: 6,
    source: "Tenta HT25 ord 3(b)",
    premises: ["Message A mottages", "Message B mottages 2 dagar efter att Activity A avslutats"],
    scenario: { messages: [{ name: "Message A", at: 0 }, { name: "Message B", after: "a", minutes: 2 * 1440 }] },
    options: ["Activity A, B, C, D", "Activity A, B, D", "Activity A", "Inget av övriga alternativ", "Activity A, C, D"],
    answer: "ABD",
  },
  {
    id: "kp-3c", diagram: "ht25-3c", kind: "aktiviteter", points: 7,
    source: "Tenta HT25 ord 3(c)",
    premises: [
      "Huvudprocessen startar",
      "Message A mottages 5 minuter efter att Activity A avslutats",
      "Event Subprocess A avslutas efter 20 minuter",
      "Message B skickas 10 minuter efter att Activity A avslutats",
    ],
    scenario: {
      messages: [{ name: "Message A", after: "a", minutes: 5 }],
      delays: { thB: 10 },
      durations: { ee: 10, ef: 10 },
    },
    options: ["Activity A, B, C, D", "Inget av övriga alternativ", "Activity A, B", "Activity A, B, C, D, E, F", "Activity A, E, F", "Activity A"],
    answer: "ABCDEF",
  },
  {
    id: "kp-3d", diagram: "ht25-3d", kind: "tid", points: 4,
    source: "Tenta HT25 ord 3(d)",
    premises: ["Huvudprocessen startar 2025-12-04 klockan 00.01", "Activity A tar 1 timme", "Activity B tar 1 timme"],
    scenario: { start: "2025-12-04 00:01", durations: { a: 60, b: 60 } },
    options: ["2025-12-05 kl. 00:01", "2025-12-06 kl. 00:01", "2025-12-06 kl. 01:01", "2025-12-06 kl. 03:01", "2025-12-06 kl. 02:01", "Inget av övriga alternativ"],
    answer: "2025-12-06 kl. 02:01",
  },
  {
    id: "kp-om15", diagram: "ht25-om15", kind: "aktiviteter", points: 7,
    source: "Tenta HT25 omtenta fråga 15",
    premises: ["Huvudprocessen startar", "Villkoret Missing Information är Yes"],
    scenario: { conditions: { gm: "Yes" } },
    options: ["Activity A, B, C, D", "Activity A, B, D, E", "Activity A, B", "Inget av övriga alternativ", "Activity A, B, C, F", "Activity A, B, C, D, E, F"],
    answer: "ABCF",
  },
  {
    id: "kp-om16", diagram: "ht25-om16", kind: "tid", points: 5,
    source: "Tenta HT25 omtenta fråga 16",
    premises: ["Huvudprocessen startar 2026-02-02 kl. 00.01", "Activity A tar två timmar", "Activity B tar två timmar"],
    scenario: { start: "2026-02-02 00:01", durations: { a: 120, b: 120 } },
    options: ["2026-02-03 kl. 14:01", "2026-02-04 kl. 16:01", "2026-02-03 kl. 16:01", "2026-02-03 kl. 18:01", "2026-02-04 kl. 14:01", "Inget av övriga alternativ"],
    answer: "2026-02-03 kl. 16:01",
  },

  // ── Elementfrågan ────────────────────────────────────────────────────
  {
    id: "kp-om13", kind: "element", points: 5,
    source: "Tenta HT25 omtenta fråga 13",
    question: "Vilket av följande BPMN-element (A–F) representerar en non-interrupting event subprocess som startar med ett message start event?",
    elements: [
      { letter: "A", variant: "callActivity", marker: ["chevron", "parallelMI"] },
      { letter: "B", variant: "eventSubprocess", startEvent: { event: "message", interrupting: false } },
      { letter: "C", taskType: "send" },
      { letter: "D", variant: "eventSubprocess", startEvent: { event: "message", interrupting: true } },
      { letter: "E", taskType: "receive" },
      { letter: "F", variant: "eventSubprocess", startEvent: { event: "timer", interrupting: false } },
    ],
    options: ["B", "A", "D", "C", "E", "F"],
    answer: "B",
    explain: [
      "B: streckad ram = event subprocess, streckad cirkel = non-interrupting, kuvert = meddelande.",
      "D är samma sak men interrupting (heldragen cirkel). F startar på en timer (klocka).",
      "C och E har heldragen ram: send task (fyllt kuvert) och receive task (ofyllt kuvert).",
      "A har tjock ram: en call activity, här med parallell multi-instance-markör.",
    ],
  },

  // ── Varianter: samma diagram, nya förutsättningar ────────────────────
  {
    id: "kp-3b-v1", diagram: "ht25-3b", kind: "aktiviteter", points: 6,
    source: "Variant av tenta HT25 ord 3(b)",
    premises: ["Message A mottages", "Message B mottages 5 dagar efter att Activity A avslutats"],
    scenario: { messages: [{ name: "Message A", at: 0 }, { name: "Message B", after: "a", minutes: 5 * 1440 }] },
    options: ["Activity A, B, C, D", "Activity A, B, D", "Activity A", "Inget av övriga alternativ", "Activity A, C, D"],
    answer: "ACD",
    note: "Timern på 4 dagar hinner före meddelandet, så timervägen vinner. Message B kommer när ingen längre väntar på det. D körs en gång, eftersom bara en token kommer fram.",
  },
  {
    id: "kp-3c-v1", diagram: "ht25-3c-int", kind: "aktiviteter", points: 7,
    source: "Variant av tenta HT25 ord 3(c)",
    premises: [
      "Huvudprocessen startar",
      "Message A mottages 5 minuter efter att Activity A avslutats",
      "Event Subprocess A avslutas efter 20 minuter",
      "Message B skickas 10 minuter efter att Activity A avslutats",
    ],
    scenario: {
      messages: [{ name: "Message A", after: "a", minutes: 5 }],
      delays: { thB: 10 },
      durations: { ee: 10, ef: 10 },
    },
    options: ["Activity A, B, C, D", "Inget av övriga alternativ", "Activity A, B", "Activity A, B, C, D, E, F", "Activity A, E, F", "Activity A"],
    answer: "AEF",
    note: "Enda skillnaden mot tentans diagram är startcirkeln i barndiagrammet: heldragen betyder interrupting. Vid 5 minuter avbryts huvudprocessen, innan Message B skickats.",
  },
  {
    id: "kp-3c-v2", diagram: "ht25-3c", kind: "aktiviteter", points: 7,
    source: "Variant av tenta HT25 ord 3(c)",
    premises: [
      "Huvudprocessen startar",
      "Message B skickas 10 minuter efter att Activity A avslutats",
      "Message A mottages 4 timmar efter att Activity A avslutats",
    ],
    scenario: {
      messages: [{ name: "Message A", after: "a", minutes: 240 }],
      delays: { thB: 10 },
    },
    options: ["Activity A, B, C, D", "Inget av övriga alternativ", "Activity A, B", "Activity A, B, C, D, E, F", "Activity A, E, F", "Activity A"],
    answer: "ABCD",
    note: "Processen är klar efter 3 timmar (timern), så när Message A kommer finns ingen process kvar som event subprocessen kan starta i.",
  },
  {
    id: "kp-3d-v1", diagram: "ht25-3d", kind: "tid", points: 4,
    source: "Variant av tenta HT25 ord 3(d)",
    premises: ["Huvudprocessen startar 2025-12-04 klockan 00.01", "Activity A tar 3 timmar", "Activity B tar 30 minuter"],
    scenario: { start: "2025-12-04 00:01", durations: { a: 180, b: 30 } },
    options: ["2025-12-06 kl. 00:31", "2025-12-06 kl. 03:01", "2025-12-06 kl. 03:31", "2025-12-06 kl. 04:01", "2025-12-07 kl. 03:31", "Inget av övriga alternativ"],
    answer: "2025-12-06 kl. 03:31",
    note: "A klar 03:01, timern räknar 48 timmar därifrån, sedan B på 30 minuter.",
  },
  {
    id: "kp-om16-v1", diagram: "ht25-om16", kind: "tid", points: 5,
    source: "Variant av tenta HT25 omtenta fråga 16",
    premises: ["Huvudprocessen startar 2026-02-02 kl. 22.30", "Activity A tar två timmar", "Activity B tar två timmar"],
    scenario: { start: "2026-02-02 22:30", durations: { a: 120, b: 120 } },
    options: ["2026-02-04 kl. 10:30", "2026-02-04 kl. 12:30", "2026-02-04 kl. 14:30", "2026-02-05 kl. 14:30", "2026-02-04 kl. 16:30", "Inget av övriga alternativ"],
    answer: "2026-02-04 kl. 14:30",
    note: "A går över midnatt och är klar 00:30. 36 timmar därifrån är 02-04 12:30, och B slutar 14:30.",
  },
  {
    id: "kp-om15-v1", diagram: "ht25-om15", kind: "aktiviteter", points: 7,
    source: "Variant av tenta HT25 omtenta fråga 15",
    premises: ["Huvudprocessen startar", "Villkoret Missing Information är No"],
    scenario: { conditions: { gm: "No" } },
    options: ["Activity A, B, C, D", "Activity A, B, D, E", "Activity A, B", "Inget av övriga alternativ", "Activity A, B, C, F", "Activity A, B, C, D, E, F"],
    answer: "ABDE",
    note: "Utan fel slutar subprocessen normalt i Verification Completed, och huvudflödet fortsätter till E. Error boundary aktiveras aldrig.",
  },
];

// Hjälp för vyn och testet: "Activity A, B, D" → "ABD"; övriga → null.
export function lettersOf(option) {
  const m = /^Activity ([A-Z](?:, [A-Z])*)$/.exec(option.trim());
  return m ? m[1].split(", ").join("") : null;
}

// Simulatorns resultat som svarssträng i uppgiftens form.
export function answerFromResult(task, result) {
  if (task.kind === "tid") return result.endClock;
  return result.started
    .map((label) => /^Activity ([A-Z])$/.exec(label)?.[1])
    .filter(Boolean)
    .sort()
    .join("");
}

// Vilket alternativ som är rätt, härlett ur facit.
export function correctIndex(task) {
  if (task.kind === "element") return task.options.indexOf(task.answer);
  const i = task.options.findIndex((opt) =>
    task.kind === "tid" ? opt === task.answer : lettersOf(opt) === task.answer,
  );
  return i >= 0 ? i : task.options.findIndex((opt) => opt.startsWith("Inget"));
}
