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
    note: "Message B kommer efter 2 dagar, före timern på 4 dagar, så meddelandevägen vinner vid event-based gatewayen och C körs aldrig. D har två inkommande flöden, men bara en token kommer fram.",
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
    note: "Streckad startcirkel betyder non-interrupting: E och F körs vid sidan av, och huvudprocessen fortsätter med B, C (efter 3 timmar) och D. Distraktorn A, E, F är vad en interrupting event subprocess hade gett.",
  },
  {
    id: "kp-3d", diagram: "ht25-3d", kind: "tid", points: 4,
    source: "Tenta HT25 ord 3(d)",
    premises: ["Huvudprocessen startar 2025-12-04 klockan 00.01", "Activity A tar 1 timme", "Activity B tar 1 timme"],
    scenario: { start: "2025-12-04 00:01", durations: { a: 60, b: 60 } },
    options: ["2025-12-05 kl. 00:01", "2025-12-06 kl. 00:01", "2025-12-06 kl. 01:01", "2025-12-06 kl. 03:01", "2025-12-06 kl. 02:01", "Inget av övriga alternativ"],
    answer: "2025-12-06 kl. 02:01",
    note: "A är klar 12-04 01:01. Timern räknar 48 timmar därifrån, till 12-06 01:01, och B är klar 02:01.",
  },
  {
    id: "kp-om15", diagram: "ht25-om15", kind: "aktiviteter", points: 7,
    source: "Tenta HT25 omtenta fråga 15",
    premises: ["Huvudprocessen startar", "Villkoret Missing Information är Yes"],
    scenario: { conditions: { gm: "Yes" } },
    options: ["Activity A, B, C, D", "Activity A, B, D, E", "Activity A, B", "Inget av övriga alternativ", "Activity A, B, C, F", "Activity A, B, C, D, E, F"],
    answer: "ABCF",
    note: "Yes leder till C och error end. Felet fångas av error boundary på subprocessen, som avbryts, så normalflödet till E används aldrig. Undantagsflödet kör F.",
  },
  {
    id: "kp-om16", diagram: "ht25-om16", kind: "tid", points: 5,
    source: "Tenta HT25 omtenta fråga 16",
    premises: ["Huvudprocessen startar 2026-02-02 kl. 00.01", "Activity A tar två timmar", "Activity B tar två timmar"],
    scenario: { start: "2026-02-02 00:01", durations: { a: 120, b: 120 } },
    options: ["2026-02-03 kl. 14:01", "2026-02-04 kl. 16:01", "2026-02-03 kl. 16:01", "2026-02-03 kl. 18:01", "2026-02-04 kl. 14:01", "Inget av övriga alternativ"],
    answer: "2026-02-03 kl. 16:01",
    note: "Den manuella A är klar 02:01. 36 timmar därifrån är 02-03 14:01, och B är klar 16:01.",
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

  // ── Egna diagram ─────────────────────────────────────────────────────
  {
    id: "kp-egen-boundary-1", diagram: "egen-boundary", kind: "aktiviteter", points: 6,
    source: "Egen uppgift (genomgången s. 49–53)",
    premises: ["En låneansökan tas emot", "Activity A tar 3 dagar", "Ingen återkallelse kommer"],
    scenario: { messages: [{ name: "Loan application", at: 0 }], durations: { a: 3 * 1440 } },
    options: ["Activity A, B", "Activity A, B, D", "Activity A, C", "Activity A, C, D", "Activity A, B, C, D"],
    answer: "ABD",
    note: "Timern på kanten är streckad, alltså non-interrupting: efter 2 dagar startar D vid sidan av, och A fortsätter tills den är klar och går vidare till B.",
  },
  {
    id: "kp-egen-boundary-2", diagram: "egen-boundary", kind: "aktiviteter", points: 6,
    source: "Egen uppgift (genomgången s. 49–53)",
    premises: ["En låneansökan tas emot", "Activity A tar 3 dagar", "En återkallelse (Cancellation) kommer 1 dag efter att ansökan tagits emot"],
    scenario: { messages: [{ name: "Loan application", at: 0 }, { name: "Cancellation", at: 1440 }], durations: { a: 3 * 1440 } },
    options: ["Activity A, B", "Activity A, B, D", "Activity A, C", "Activity A, C, D", "Activity A, B, C, D"],
    answer: "AC",
    note: "Återkallelsen fångas av ett heldraget boundary event: A avbryts direkt och undantagsflödet till C tar över. Timern på 2 dagar hinner aldrig gå, eftersom A redan är avbruten.",
  },
  {
    id: "kp-egen-boundary-3", diagram: "egen-boundary", kind: "aktiviteter", points: 6,
    source: "Egen uppgift (genomgången s. 49–53)",
    premises: ["En låneansökan tas emot", "Activity A tar 3 dagar", "En återkallelse (Cancellation) kommer 2,5 dagar efter att ansökan tagits emot"],
    scenario: { messages: [{ name: "Loan application", at: 0 }, { name: "Cancellation", at: 3600 }], durations: { a: 3 * 1440 } },
    options: ["Activity A, B", "Activity A, B, D", "Activity A, C", "Activity A, C, D", "Activity A, B, C, D"],
    answer: "ACD",
    note: "Efter 2 dagar startar D (non-interrupting). Efter 2,5 dagar avbryter återkallelsen A, och C körs. B nås aldrig.",
  },
  {
    id: "kp-egen-or-1", diagram: "egen-or", kind: "aktiviteter", points: 6,
    source: "Egen uppgift efter Silvers exempel (genomgången s. 17–20)",
    premises: ["Insättningen är 5 000 USD", "Villkoren på gatewayen: över 10 000 USD, utländsk valuta (inte USD), alltid"],
    scenario: { conditions: { g: ["Alltid"] } },
    options: ["Activity A, E", "Activity A, D, E", "Activity A, B, D, E", "Activity A, C, D, E", "Activity A, B, C, D, E"],
    answer: "ADE",
    note: "Bara villkoret \"Alltid\" är sant. OR-joinen väntar bara på den väg som faktiskt aktiverades, så E körs direkt efter D.",
  },
  {
    id: "kp-egen-or-2", diagram: "egen-or", kind: "aktiviteter", points: 6,
    source: "Egen uppgift efter Silvers exempel (genomgången s. 17–20)",
    premises: ["Insättningen är 15 000 USD"],
    scenario: { conditions: { g: ["Över 10 000 USD", "Alltid"] } },
    options: ["Activity A, E", "Activity A, D, E", "Activity A, B, D, E", "Activity A, C, D, E", "Activity A, B, C, D, E"],
    answer: "ABDE",
    note: "Två villkor är sanna, över 10 000 USD och Alltid, så B och D körs. OR-joinen väntar in båda innan E.",
  },
  {
    id: "kp-egen-or-3", diagram: "egen-or", kind: "aktiviteter", points: 6,
    source: "Egen uppgift efter Silvers exempel (genomgången s. 17–20)",
    premises: ["Insättningen är 1 000 000 SEK (mer än 10 000 USD)"],
    scenario: { conditions: { g: ["Över 10 000 USD", "Utländsk valuta", "Alltid"] } },
    options: ["Activity A, E", "Activity A, D, E", "Activity A, B, D, E", "Activity A, C, D, E", "Activity A, B, C, D, E"],
    answer: "ABCDE",
    note: "Alla tre villkoren är sanna: beloppet är över 10 000 USD, valutan är inte USD, och Alltid gäller alltid. B, C och D körs, och OR-joinen väntar in alla tre.",
  },
  {
    id: "kp-egen-terminate-1", diagram: "egen-terminate", kind: "aktiviteter", points: 7,
    source: "Egen uppgift (genomgången s. 35–36)",
    premises: ["Processen startar", "Activity B tar 10 minuter", "Villkoret OK? är Nej"],
    scenario: { durations: { a: 30, b: 10 }, conditions: { gx: "Nej" } },
    options: ["Activity A, B", "Activity A, B, C", "Activity A, B, D, E", "Activity A, B, C, D, E", "Inget av övriga alternativ"],
    answer: "AB",
    note: "Terminate avslutar hela processen direkt, även den parallella vägen som väntar på timern. C hinner aldrig starta, och joinen nås aldrig — utan terminate hade AND-joinen väntat för evigt (deadlock).",
  },
  {
    id: "kp-egen-terminate-2", diagram: "egen-terminate", kind: "tid", points: 5,
    source: "Egen uppgift (genomgången s. 35–36)",
    premises: ["Processen startar 2026-03-02 kl. 09.00", "A tar 30 min, B 10 min, C 30 min, D 20 min, E 15 min", "Villkoret OK? är Ja"],
    scenario: { start: "2026-03-02 09:00", durations: { a: 30, b: 10, c: 30, d: 20, e: 15 }, conditions: { gx: "Ja" } },
    options: ["2026-03-02 kl. 10:15", "2026-03-02 kl. 10:45", "2026-03-02 kl. 11:15", "2026-03-02 kl. 11:45", "2026-03-02 kl. 12:15", "Inget av övriga alternativ"],
    answer: "2026-03-02 kl. 11:15",
    note: "Den övre vägen är klar 10:00, men AND-joinen väntar in den undre: timern räknar en timme från 09:30, C är klar 11:00, och E slutar 11:15.",
  },
  {
    id: "kp-egen-loop", diagram: "egen-loop", kind: "tid", points: 5,
    source: "Egen uppgift efter övningshäftets 1.1",
    premises: ["Processen startar 2026-03-02 kl. 09.00", "A tar 30 min, B 10 min, C 20 min, D 15 min", "Godkänd? blir Nej, Nej och sedan Ja"],
    scenario: { start: "2026-03-02 09:00", durations: { a: 30, b: 10, c: 20, d: 15 }, conditions: { gx: ["Nej", "Nej", "Ja"] } },
    options: ["2026-03-02 kl. 09:55", "2026-03-02 kl. 10:25", "2026-03-02 kl. 10:40", "2026-03-02 kl. 10:55", "2026-03-02 kl. 11:25", "Inget av övriga alternativ"],
    answer: "2026-03-02 kl. 10:55",
    note: "B körs tre gånger och C två: 09:30 A klar, 09:40 B, 10:00 C, 10:10 B, 10:30 C, 10:40 B (godkänd), 10:55 D.",
  },
  {
    id: "kp-egen-es-1", diagram: "egen-es-timer", kind: "aktiviteter", points: 5,
    source: "Egen uppgift (genomgången s. 66)",
    premises: ["Processen startar", "Activity A tar 3 dagar"],
    scenario: { durations: { a: 3 * 1440 } },
    options: ["Activity A", "Activity A, B", "Activity A, C", "Activity A, B, C", "Inget av övriga alternativ"],
    answer: "ABC",
    note: "Efter 2 dagar pågår processen fortfarande, så event subprocessen startar och C körs. Startcirkeln är streckad, så A fortsätter och processen går vidare till B.",
  },
  {
    id: "kp-egen-es-2", diagram: "egen-es-timer", kind: "aktiviteter", points: 5,
    source: "Egen uppgift (genomgången s. 66)",
    premises: ["Processen startar", "Activity A tar 1 dag", "Activity B tar 2 timmar"],
    scenario: { durations: { a: 1440, b: 120 } },
    options: ["Activity A", "Activity A, B", "Activity A, C", "Activity A, B, C", "Inget av övriga alternativ"],
    answer: "AB",
    note: "Processen är klar efter 1 dag och 2 timmar. En event subprocess kan bara starta medan processen den ligger i körs, så timern på 2 dagar hinner aldrig utlösa den.",
  },

  // ── Övningshäftet ────────────────────────────────────────────────────
  {
    id: "kp-hafte-1-1", diagram: "hafte-1-1-leverans", kind: "slut", points: 5,
    source: "Övningshäftet 1.1 (egen körfråga)",
    premises: ["Buketten lämnas över", "Notification of failure to deliver kommer 3 timmar efter överlämningen", "Confirmation of delivery kommer 5 timmar efter överlämningen"],
    scenario: { messages: [{ name: "Notification of failure to deliver", after: "h", minutes: 180 }, { name: "Confirmation of delivery", after: "h", minutes: 300 }] },
    question: "I vilket sluttillstånd slutar subprocessen, och vad betyder det i föräldradiagrammet?",
    options: [
      "Delivery succeeded — XOR:en efter subprocessen går vidare till fakturering",
      "Delivery failed — XOR:en efter subprocessen går till Arrange alternate delivery time",
      "Båda — subprocessen slutar i båda sluttillstånden",
      "Inget — subprocessen väntar på båda meddelandena",
    ],
    answer: "Delivery failed",
    note: "Event-based gateway: meddelandet som kommer först vinner. Björns regel: subprocessens två sluttillstånd motsvarar de två gates som XOR-gatewayen efter den har i föräldern.",
  },
  {
    id: "kp-hafte-1-3", diagram: "hafte-1-3-kritisk", kind: "aktiviteter", points: 7, named: true,
    source: "Övningshäftet 1.3 (egen körfråga)",
    premises: ["Uppskattningen blir 48 timmar eller mer", "Feedbacken ledde inte till förbättringar"],
    scenario: { conditions: { gx: "48 hours or more", gx2: "No enhancements" } },
    options: [
      "Estimate time for resolution, Inform customer of estimate",
      "Estimate time for resolution, Set review reminder, Engage second line support, Notify customer of escalation",
      "Estimate time for resolution, Set review reminder, Engage second line support, Notify customer of escalation, Notify customer of feedback result",
      "Estimate time for resolution, Engage second line support, Notify customer of escalation",
      "Inget av övriga alternativ",
    ],
    answer: "Engage second line support, Estimate time for resolution, Notify customer of escalation, Set review reminder",
    note: "AND-splitten kör båda vägarna, och joinen väntar in dem. Den sista XOR:en går direkt till OR-sammanslagningen, så Notify customer of feedback result körs inte.",
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
  if (task.kind === "slut") return result.endStates.join(", ");
  if (task.named) return [...result.started].sort().join(", ");
  return result.started
    .map((label) => /^Activity ([A-Z])$/.exec(label)?.[1])
    .filter(Boolean)
    .sort()
    .join("");
}

// Vilket alternativ som är rätt, härlett ur facit.
export function correctIndex(task) {
  if (task.kind === "element") return task.options.indexOf(task.answer);
  const i = task.options.findIndex((opt) => {
    if (task.kind === "tid") return opt === task.answer;
    if (task.kind === "slut") return opt.split(" — ")[0] === task.answer;
    if (task.named) return opt.split(", ").sort().join(", ") === task.answer;
    return lettersOf(opt) === task.answer;
  });
  return i >= 0 ? i : task.options.findIndex((opt) => opt.startsWith("Inget"));
}
