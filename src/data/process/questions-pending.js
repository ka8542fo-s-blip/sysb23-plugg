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
//   bpm-q18 — essentials-definitionen av Leadership, bara ur HT24 fråga 32.
//   bpm-q30 — Realize-fasen, bara ur HT24 fråga 43 (Realize gås igenom på F4).
//   bpm-q32 — appreciative inquiry, bara ur HT24 fråga 33.
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

  { id: "bpm-q18", topic: "ramverk", difficulty: 2,
    question: "Vilken beskrivning passar essential-förmågan Leadership i 7FE?",
    options: [
      { text: "Att resurser, budget, tidplan, intressenter och leveranser hanteras i hela aktiviteten.", explain: "Det är BPM project management." },
      { text: "Att ledarna ger stöd och vägledning så att aktiviteten och organisationen är linjerade.", explain: "Leadership är ledarnas stöd och vägledning; de andra två essentials hanterar resurser respektive acceptans." },
      { text: "Att alla berörda kan och vill ta till sig och bidra till den framtida lösningen.", explain: "Det är people change management." },
      { text: "Att en Chief Process Officer ansvarar för alla processer i hela organisationen.", explain: "CPO är en governance-roll i Enablement, inte en essential." }
    ],
    correct: 1, source: "HT24 fråga 32", reviewed: false },

  { id: "bpm-q30", topic: "fullfoljd", difficulty: 2,
    question: "Vad är syftet med Realize-fasen i 7FE?",
    options: [
      { text: "Att bygga alla de komponenter som krävs för att kunna införa de nya processerna.", explain: "HT24:s alternativ för något annat än Realize; enligt tentans ordval troligen Develop (HT24 saknar facit)." },
      { text: "Att säkerställa att nyttan som beskrevs i business case faktiskt realiseras.", explain: "Realize följer upp business case från Launch." },
      { text: "Att föreställa sig det framtida tillståndet i en visionsövning.", explain: "Det är Red Wine Test i Foundations." },
      { text: "Att hålla igång styrning och ständig förbättring efter projektet.", explain: "Det är Sustainability." }
    ],
    correct: 1, source: "HT24 fråga 43", reviewed: false },

  { id: "bpm-q32", topic: "manniskor", difficulty: 2,
    question: "Vad kännetecknar appreciative inquiry som förändringsansats?",
    options: [
      { text: "Den söker rotorsakerna till fel och åtgärdar dem en i taget.", explain: "Tvärtom: den söker rotorsakerna till framgång." },
      { text: "Den fokuserar på vad som är fel för att skapa en känsla av kris.", explain: "Det är motsatsen till appreciative inquiry." },
      { text: "Den behandlar hinder som barriärer som ska rivas uppifrån.", explain: "Så beskrivs inte ansatsen." },
      { text: "Den utgår från det som fungerar och söker orsakerna till framgång.", explain: "Ansatsen bygger förändringen på organisationens styrkor." }
    ],
    correct: 3, source: "HT24 fråga 33 (preliminärt)", reviewed: false },
];
