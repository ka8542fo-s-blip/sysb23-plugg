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
//
// bpm-q81, q83, q84, q87 (F5, 2026-10-12) — kapitel 10 har nått taket tio
// frågor i balanstestet. Method and Style (q83, q84) prövas i stället i Kör
// processen (kp-f5-ms-1, kp-f5-ms-2); q81 (Silvers begränsningar) och q87
// (DMN:s gräns) väntar på att taket höjs eller att en äldre kapitel 10-fråga
// byts ut.
// bpm-q85 (execution properties) parkerad 2026-10-13: Weaver säger i
// F5-videon att kursen inte går in på körbar BPMN alls ("good to know").
// I dess ställe kom q86 (rabattexemplet), som han betonar.
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

  { id: "bpm-q81", topic: "bpmn", difficulty: 2,
    question: "En chef vill använda BPMN-modellen av orderprocessen för att se handläggningstider, kostnader och resursutnyttjande. Vad säger Silver?",
    options: [
      { text: "BPMN passar sämre, eftersom den inte modellerar tider och kostnader direkt.", explain: "Process performance är en av Silvers fyra begränsningar: BPMN modellerar inte handläggningstid, kostnad eller resursutnyttjande direkt. Gäller frågan prestation snarare än processflöde passar BPMN sämre." },
      { text: "BPMN passar sämre, eftersom tider och kostnader är beslutslogik som hör till DMN.", explain: "Slutsatsen stämmer men inte skälet. Task logic gäller logiken i aktiviteter och komplexa affärsbeslut, och besluten kan beskrivas med DMN. Tider och kostnader är prestationsmått." },
      { text: "Det går, eftersom BPMN:s precisa semantik ger tider och kostnader för varje element.", explain: "Precise semantics betyder att elementen har formellt definierade betydelser, så att processens beteende blir entydigt. Det ger inga prestationsmått." },
      { text: "Det går, om resurserna läggs in som lanes och kostnaderna som textannoteringar.", explain: "En lane visar vem som utför arbetet, inte hur resurserna utnyttjas, och en textannotering är ingen modell av kostnader. Resurser hör enligt Silver till affärskontexten, som BPMN inte beskriver heltäckande." }
    ],
    correct: 0, source: "F5 (Silver 2019 enligt föreläsningen: fördelar och begränsningar; When NOT to use BPMN)", reviewed: false },

  { id: "bpm-q83", topic: "bpmn", difficulty: 2,
    question: "Ett diagram går från en starthändelse direkt till en XOR-gateway. Flödet Yes leder till \"Approve application\" och No till \"Reject application\", och båda slutar i samma sluthändelse. Vad är enligt Silver problemet med gatewayen?",
    options: [
      { text: "Diagrammet är ogiltig BPMN, eftersom en XOR inte får komma direkt efter en start.", explain: "Diagrammet är tekniskt korrekt. Silvers poäng är att giltig BPMN inte är detsamma som en bra processmodell." },
      { text: "Gatewayen borde heta \"Approve application\", så att den själv fattar beslutet.", explain: "Verb–objekt är en aktivitets form, och en gateway fattar inget beslut." },
      { text: "Gatewayen borde vara en AND-gateway, så att båda utfallen alltid hanteras.", explain: "En AND startar båda vägarna, men en ansökan ska antingen godkännas eller avslås." },
      { text: "Ingen aktivitet före gatewayen visar var ansökan bedöms och beslutet fattas.", explain: "Gatewayen styr flödet, men diagrammet visar inte var beslutet fattas. Silver vill att en XOR följer en aktivitet vars utfall avgör vägen. I hans förbättrade version är det Assess application." }
    ],
    correct: 3, source: "F5 (Silver 2019 enligt föreläsningen: dålig men tekniskt korrekt BPMN)", reviewed: false },

  { id: "bpm-q84", topic: "bpmn", difficulty: 2,
    question: "En XOR-gateway utan namn har flödena Yes och No, till \"Approve application\" och \"Reject application\". Båda vägarna slutar i samma sluthändelse. Vad rekommenderar Silver för etiketterna och slutet?",
    options: [
      { text: "Behåll både Yes/No och det gemensamma slutet, eftersom BPMN tillåter båda.", explain: "Det är tillåtet, men Silver kallar det dålig BPMN: Yes eller No till vad, och vilka utfall finns?" },
      { text: "Ta bort etiketterna, eftersom flödena från en XOR-gateway inte ska etiketteras.", explain: "Det gäller AND-gateways. Flödena från en XOR ska tvärtom visa vilket utfall de gäller." },
      { text: "Sätt etiketter som visar vad som avgjorts, och ge varje utfall ett eget slut.", explain: "Yes och No svarar här på en fråga som inte står någonstans. I Silvers förbättrade version heter flödena Approved och Rejected. Med kursens konvention ställer gatewayen frågan, och flödena svarar Yes och No. Två sluthändelser, Application approved och Application rejected, skiljer utfallen åt." },
      { text: "Låt båda vägarna sluta i ett terminate end, så att hela processen avslutas.", explain: "Terminate end avslutar hela processnivån, även parallella vägar. Det behövs inte här, och ett gemensamt slut skiljer fortfarande inte utfallen åt." }
    ],
    correct: 2, source: "F5 (Silver 2019 enligt föreläsningen: dålig och bra BPMN); BPMN Element naming conventions (Canvas)", reviewed: false },

  { id: "bpm-q87", topic: "bpmn", difficulty: 3,
    question: "En bank fattar lånebeslut med regler och en riskpoäng från en maskininlärningsmodell. Hur passar DMN in?",
    options: [
      { text: "DMN tar regeldelen, och riskpoängen från ML-modellen blir indata till den.", explain: "Det är ett hybridupplägg. DMN kan ta den regelbaserade delen och klarar logik ungefär lika komplex som den som ryms i ett kalkylark. ML-modeller modelleras normalt inte i DMN, men deras resultat kan vara indata." },
      { text: "DMN tar hela beslutet, eftersom ML-modellen kan skrivas om som en beslutstabell.", explain: "Datadrivna algoritmer ligger bortom DMN:s gräns. Där blir DMN beslutslagret som anropar externa tjänster eller AI-modeller." },
      { text: "DMN passar sämre, eftersom beslut med flera viktade kriterier kräver en ML-modell.", explain: "DMN kan modellera komplexa beslut med många kriterier, till exempel poängsättning av lånebehörighet och riskbedömning med flera viktade kriterier." },
      { text: "DMN behövs inte, eftersom generativ AI kan klassificera hela underlaget.", explain: "Generativ AI passar ostrukturerad information, som kundklagomål. Här finns explicita regler, och dem kan DMN ta." }
    ],
    correct: 0, source: "F5 (DMN:s gräns vid kalkylarkskomplexitet; sätt att fatta beslut)", reviewed: false },

  { id: "bpm-q85", topic: "bpmn", difficulty: 2,
    question: "Ett team har ritat \"Check inventory\" som en service task och vill att en processmotor ska köra den. Vad behöver läggas till?",
    options: [
      { text: "En lane för motorn, så att det syns vilket system som utför aktiviteten.", explain: "En lane visar vem som utför arbetet. Motorn behöver tekniska uppgifter, som vilken tjänst som anropas och vilka variabler som skickas." },
      { text: "Fler element i diagrammet, eftersom motorn bara läser det som syns visuellt.", explain: "Motorn läser BPMN XML. En körbar modell kan se lika enkel ut som en visuell, men detaljerna måste finnas under ytan." },
      { text: "En business rule task före, som talar om för motorn hur tasken ska köras.", explain: "En business rule task anropar beslutsregler. Hur en service task körs anges i dess egna egenskaper." },
      { text: "Execution properties i BPMN XML, som REST endpoint, variabler och retry.", explain: "Diagrammet visar vad som händer, och execution properties anger hur det utförs. De lagras i BPMN XML och ställs oftast in i verktygets properties-panel. Standardiserad XML och mer omfattande körsemantik kom med BPMN 2.0 år 2011." }
    ],
    correct: 3, source: "F5 (visuell och körbar BPMN; execution properties i BPMN XML)", reviewed: false },
];
