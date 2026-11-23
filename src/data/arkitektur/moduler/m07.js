// Modul 7 i fliken Moduler (modul-5-8.pdf), översatt enligt planen som
// Kasper godkände 2026-11-22. Se m01.js för formen.
//
// Fråga 20–22 och essäfrågorna 24 och 27 står i modul 7 som i dokumentet
// (Kaspers beslut), både här och i Öva. Lärarens not om att de hör till
// modul 8 står sist i modul 8. Fråga 18 och 19 är sant/falskt men står under
// rubriken Flerval, som i PDF:en. Numret 11 finns två gånger i PDF:en
// (sant/falskt och kortsvarsfrågan).
export default {
  id: "kap7",
  number: 7,
  title: {
    sv: "Capabilities, value streams och Business Architecture",
    en: "Capabilities, Value Streams and Business Architecture",
  },
  blocks: [
    {
      kind: "text",
      id: "m7-t1",
      sv: `## Lärandemål

Efter den här modulen ska du förstå:

- Business capabilities.
- Verksamhetsprocesser.
- Value streams.
- Hur de hänger ihop med strategi.
- Business Architecture.
- Capability-based planning.

**Capability** – vad organisationen har förmåga att göra.

**Process** – hur organisationen utför aktiviteter.

**Value stream** – hur värde skapas och levereras till en stakeholder.`,
      en: `## Learning objectives

Students should understand:

- Business capabilities.
- Business processes.
- Value streams.
- Their relationship to strategy.
- Business architecture.
- Capability-based planning.

**Capability** - What the organization is capable of doing.

**Process** - How the organization performs activities.

**Value stream** - How value is created and delivered to a stakeholder.`,
    },
    {
      kind: "text",
      id: "m7-t2",
      sv: `## Exempel

- **Strategi:** "Bli den enklaste banken för den som köper sin första bostad."
- **Capability:** Digital bolåneutgivning
- **Value stream:** Upptäcka → Ansöka → Verifiera → Godkänna → Slutföra

Strategin pekar ut en capability som banken måste ha. Value streamen visar hur värdet skapas och levereras till kunden. Processer implementerar delar av value streamen.`,
      en: `## Example

Strategy: "Become the easiest bank for first-time home buyers."

Capability: Digital Mortgage Origination

Value stream: Discover → Apply → Verify → Approve → Complete

Processes implement parts of the value stream.`,
    },
    {
      kind: "text",
      id: "m7-t3",
      sv: `## Kärnförklaring

En capability beskriver vad organisationen har förmåga att göra. En process beskriver hur arbetet utförs: den är en sekvens eller uppsättning aktiviteter som används för att utföra arbete. En value stream beskriver hur värde skapas och levereras till en stakeholder. Capabilities, processer och value streams hör till Business Architecture.

Capabilities är särskilt användbara eftersom de kan förbli relativt stabila även när organisationsstrukturer och processer förändras.

### Capability och process är inte samma sak

En capability uttrycker vad organisationen kan göra. Den beskriver en förmåga som organisationen har eller behöver ha, men den föreskriver inte hur capabilityn implementeras. Sekvensen av aktiviteter som används för att utföra arbetet är i första hand ett processperspektiv. Därför går begreppen inte att byta ut mot varandra. Capabilities ger ofta en relativt stabil bild av organisationens förmåga, medan processer beskriver de sekvenser av aktiviteter som används för att utföra arbete.

En capability är en förmåga på verksamhetsnivå, som bolåneutgivning i bankens exempel. Ett enskilt steg, som att kunden klickar på en knapp, beskrivs snarare som en del av en process eller ett steg i en value stream. Servrar, databaser och ett REST API är teknik som kan stödja en capability men inte är den.

### En brygga mellan strategi och arkitektur

Strategin fastställer önskade resultat och prioriteringar. Av dem följer capabilities som enterprisen måste ha eller stärka. Capabilities översätter alltså strategisk avsikt till de förmågor som enterprisen behöver för att nå sina mål, och som organisationen måste utveckla, upprätthålla eller transformera.

Capabilities kan relateras till processer, människor, information och data, applikationer och teknik. När strategins prioriteringar är översatta till capabilities kan arkitekten därför analysera vilka människor, processer, vilken information, vilka applikationer och vilken teknik som behövs för att stödja dem. På så sätt kan strategiska mål spåras till arkitektur- och investeringsbeslut.

Capabilities blir därför en relativt stabil brygga mellan strategisk avsikt och implementering. De kopplar strategin till de organisationsstrukturer och den organisatoriska förändring som krävs för att nå den. Capability-based planning bygger på detta: i stället för att planera bara utifrån avdelningar eller applikationer kan enterprisen planera utifrån vilka capabilities som måste förändras för att nå det strategiska resultatet.

### När organisationen förändras

Organisationsstrukturer kan förändras ofta genom omorganisationer, sammanslagningar och omstruktureringar. Avdelningarna kan förändras medan de underliggande förmågor som enterprisen behöver finns kvar. Ett exempel är ett företag som omorganiserar sin marknadsavdelning tre gånger på fem år men hela tiden behöver kundinsikt, kampanjhantering och marknadsanalys. Organisationen kan ändra vem som utför en capability utan att capabilityn i sig försvinner.

Därför är capability maps användbara när en organisation omorganiseras. Capability mapping låter arkitekten fokusera på vad organisationen måste kunna göra i stället för på tillfälliga organisationsstrukturer. Det hjälper också till att identifiera capability gaps och prioritera transformation oberoende av nuvarande organisatoriska gränser.

En capability map är en arkitekturrepresentation. Den ger ett viktigt verksamhetsperspektiv, men den beskriver inte hela enterprisen och är inte i sig en fullständig Enterprise Architecture.`,
      en: `## Core explanation

A capability describes: What the organization is capable of doing.

A process describes: How work is performed.

A value stream describes: How value is created and delivered to a stakeholder.

Capabilities are particularly useful because they can remain relatively stable even when organizational structures and processes change.`,
    },
    { kind: "text", id: "m7-t4", sv: "## Flervalsfrågor", en: "## Question multiple choice" },
    {
      kind: "fraga",
      id: "ea-m7-1",
      nr: "1",
      question: "Vad är en capability?",
      options: ["En sekvens av aktiviteter", "Vad en organisation kan göra", "En mjukvaruprodukt", "Ett projekt", "En teknikstandard"],
      explanation:
        "En capability beskriver vad organisationen har förmåga att göra. En sekvens av aktiviteter beskriver i stället hur arbetet utförs, och det är en process.",
    },
    {
      kind: "fraga",
      id: "ea-m7-2",
      nr: "2",
      question: "Vilket beskriver bäst en process?",
      options: [
        "En organisatorisk förmåga",
        "En sekvens eller uppsättning aktiviteter som används för att utföra arbete",
        "En affärsstrategi",
        "En teknikplattform",
        "En stakeholder",
      ],
      explanation:
        "En process beskriver hur arbetet utförs. \"En organisatorisk förmåga\" beskriver i stället en capability, alltså vad organisationen kan göra.",
    },
    {
      kind: "fraga",
      id: "ea-m7-3",
      nr: "3",
      question: "Varför är capabilities användbara vid planering av transformation?",
      options: [
        "De identifierar programmeringsspråk.",
        "De utgör en relativt stabil brygga mellan strategi och organisatorisk förändring.",
        "De ersätter affärsstrategin.",
        "De eliminerar processer.",
        "De bestämmer leverantörer.",
      ],
      explanation:
        "Capabilities kan förbli relativt stabila även när organisationsstrukturer och processer förändras. Därför kan de koppla strategin till den förändring som behövs, utan att bero på hur organisationen ser ut just nu.",
    },
    {
      kind: "fraga",
      id: "ea-m7-4",
      nr: "4",
      question: "En bank behöver \"digital onboarding av kunder\". Vad representerar detta mest sannolikt?",
      options: ["En capability", "En server", "En databastabell", "En projekttidplan", "Ett nätverksprotokoll"],
      explanation:
        "Digital onboarding av kunder beskriver något banken behöver ha förmåga att göra, alltså en capability. Den kan stödjas av servrar, tabeller och protokoll, men är inte någon av dem.",
    },
    {
      kind: "fraga",
      id: "ea-m7-5",
      nr: "5",
      question: "Vilket påstående beskriver bäst en value stream?",
      options: [
        "En sekvens av tekniska komponenter",
        "En representation av hur värde skapas och levereras till en stakeholder",
        "En förteckning över applikationer",
        "En governance-kommitté",
        "En datamodell",
      ],
      explanation:
        "En value stream visar hur värde skapas och levereras till en stakeholder, som stegen Upptäcka → Ansöka → Verifiera → Godkänna → Slutföra i modulens bolåneexempel. Fokus ligger på värdet för stakeholdern, inte på tekniken.",
    },
    {
      kind: "fraga",
      id: "ea-m7-6",
      nr: "6",
      question: "Vilket påstående skiljer BÄST capability från process?",
      options: [
        "En capability beskriver vad organisationen kan göra; en process beskriver hur aktiviteter utförs.",
        "En capability är alltid en teknisk komponent.",
        "Processer är strategiska medan capabilities är operativa.",
        "De är synonymer.",
        "Capabilities finns endast inom IT.",
      ],
      explanation:
        "En capability beskriver vad organisationen kan göra, och en process hur arbetet utförs. Begreppen är alltså inte synonymer, och en capability är en förmåga hos organisationen, inte en teknisk komponent.",
    },
    { kind: "text", id: "m7-t5", sv: "## Sant eller falskt", en: "## True or False" },
    {
      kind: "fraga",
      id: "ea-m7-7",
      nr: "7",
      question: "Capabilities kan utgöra en relativt stabil brygga mellan strategi och implementering.",
      explanation:
        "Strategin pekar ut vilka capabilities organisationen måste ha eller stärka, och för dem kan man analysera vilka människor, processer, information, applikationer och vilken teknik som behövs. Eftersom capabilities kan förbli relativt stabila fungerar de som en brygga.",
    },
    {
      kind: "fraga",
      id: "ea-m7-8",
      nr: "8",
      question: "En capability och en process är alltid utbytbara.",
      explanation:
        "En capability beskriver vad organisationen kan göra, och en process hur arbetet utförs. Processen kan förändras medan capabilityn finns kvar, så begreppen går inte att byta ut mot varandra.",
    },
    {
      kind: "fraga",
      id: "ea-m7-9",
      nr: "9",
      question: "Capabilities kan förbli relativt stabila medan organisationsstrukturer förändras.",
      explanation:
        "Avdelningar kan omorganiseras medan de förmågor organisationen behöver finns kvar. Fråga 25 visar det: marknadsavdelningen omorganiseras tre gånger, men behovet av kundinsikt, kampanjhantering och marknadsanalys består.",
    },
    {
      kind: "fraga",
      id: "ea-m7-10",
      nr: "10",
      question: "Capabilities kan kopplas till applikationer, data, människor och teknik.",
      explanation:
        "En capability kan relateras till de processer, människor, den information, de applikationer och den teknik som stödjer den. Därför kan strategiska mål spåras vidare till arkitektur- och investeringsbeslut.",
    },
    {
      kind: "fraga",
      id: "ea-m7-11",
      nr: "11",
      question: "Capabilities kan relateras till applikationer, information, människor och teknik.",
      explanation:
        "Det är samma sak som i fråga 10, med information i stället för data. Capabilities kan relateras till processer, människor, information, applikationer och teknik.",
    },
    { kind: "text", id: "m7-t6", sv: "## Kortsvarsfråga", en: "## Short-answer question" },
    {
      kind: "fritext",
      id: "ea-e7-11",
      typ: "kortsvar",
      nr: "11",
      question: "Varför kan capability maps vara användbara när en organisation omorganiseras?",
      modelAnswer:
        "Organisationens avdelningar kan förändras medan de underliggande förmågor som enterprisen behöver finns kvar. Capability mapping gör det möjligt för arkitekten att fokusera på vad organisationen måste kunna göra i stället för på tillfälliga organisationsstrukturer.",
    },
    { kind: "text", id: "m7-t7", sv: "## Essäfrågor", en: "## Essay Questions" },
    {
      kind: "fritext",
      id: "ea-e7-12",
      typ: "essa",
      nr: "12",
      question: "Varför är capabilities användbara i Enterprise Architecture?",
      modelAnswer:
        "Capabilities ger ett stabilt sätt att uttrycka vad en organisation måste kunna göra för att nå sina mål. De kan relateras till processer, människor, information, applikationer och teknik, vilket gör att arkitekter kan spåra strategiska mål till arkitektur- och investeringsbeslut.",
    },
    {
      kind: "fritext",
      id: "ea-e7-13",
      typ: "essa",
      nr: "13",
      question: "Förklara hur capabilities kopplar strategi till arkitektur.",
      modelAnswer:
        "Strategin fastställer önskade resultat och prioriteringar. Av dessa följer capabilities som enterprisen måste ha eller stärka. Arkitekter kan sedan analysera vilka människor, processer, information, applikationer och vilken teknik som behövs för att stödja dessa capabilities. Capabilities utgör därför en brygga mellan strategisk avsikt och arkitekturförändring.",
    },
    {
      kind: "text",
      id: "m7-t8",
      sv: "## Övningsfrågor med förklaringar\n\n### Flerval",
      en: "## Practice Questions with explanations\n\n### Multiple choice",
    },
    {
      kind: "fraga",
      id: "ea-m7-14",
      nr: "14",
      question: "Vilket påstående beskriver bäst en business capability?",
      options: [
        "En sekvens av aktiviteter",
        "En applikationskomponent",
        "Vad en organisation har förmåga att göra",
        "En projektplan",
        "En teknikplattform",
      ],
      explanation:
        "En capability beskriver en förmåga som organisationen har eller behöver ha. Den föreskriver inte hur capabilityn implementeras.",
    },
    {
      kind: "fraga",
      id: "ea-m7-15",
      nr: "15",
      question: "Vilket påstående skiljer bäst en capability från en process?",
      options: [
        "En capability beskriver vad en organisation kan göra; en process beskriver hur aktiviteter utförs.",
        "En capability är alltid strategisk medan en process alltid är taktisk.",
        "En capability hör till IT medan en process hör till verksamheten.",
        "De är utbytbara begrepp.",
        "En process är mer stabil än en capability.",
      ],
      explanation:
        "Capabilities brukar ge en relativt stabil representation av organisationens förmåga, medan processer beskriver de sekvenser av aktiviteter som används för att utföra arbete.",
    },
    {
      kind: "fraga",
      id: "ea-m7-16",
      nr: "16",
      question: "Varför är capabilities särskilt användbara i Enterprise Architecture?",
      options: [
        "De identifierar specifika mjukvaruprodukter.",
        "De utgör en brygga mellan strategisk avsikt och de organisationsstrukturer som krävs för att uppnå den.",
        "De tar bort behovet av verksamhetsprocesser.",
        "De definierar teknikstandarder.",
        "De ersätter governance.",
      ],
      explanation:
        "Capabilities kopplar strategiska mål till de förmågor som organisationen måste utveckla, upprätthålla eller transformera.",
    },
    {
      kind: "fraga",
      id: "ea-m7-17",
      nr: "17",
      question:
        "En bank vill bli den bank där det är enklast för kunder att få bolån. Vilket är mest sannolikt en capability?",
      options: ["Klicka på \"Ansök\"", "Skicka bekräftelse via e-post", "Bolåneutgivning", "Kunden klickar på en knapp", "REST API"],
      explanation:
        "Bolåneutgivning är en förmåga banken behöver för sin strategi, som Digital bolåneutgivning i modulens exempel. Att klicka eller att skicka e-post är enskilda steg i ett flöde, och ett REST API är teknik som kan stödja förmågan.",
    },
    {
      kind: "fraga",
      id: "ea-m7-18",
      nr: "18",
      question: "En business capability beskriver nödvändigtvis den sekvens av aktiviteter som används för att utföra arbete.",
      explanation: "Det är i första hand ett processperspektiv. En capability uttrycker vad organisationen har förmåga att göra.",
    },
    {
      kind: "fraga",
      id: "ea-m7-19",
      nr: "19",
      question: "En capability map är i sig en fullständig Enterprise Architecture.",
      explanation:
        "En capability map är en arkitekturrepresentation. Den ger ett viktigt verksamhetsperspektiv men beskriver inte hela enterprisen.",
    },
    // Tillagt textblock (omskrivningen 23 nov): fråga 20–22 och 24 och 27
    // står i modul 7 (Kaspers beslut) men gäller modul 8:s ämne, som
    // modulens egen text inte rör. Bara svenska; inget original att visa.
    // Källor: modul 8:s text och frågor, modellsvaren till 24 och 27, och
    // Word-dokumentets avsnitt om trade-offs.
    {
      kind: "text",
      id: "m7-tillagg-1",
      tillagd: true,
      sv: `## Principer, governance och trade-offs

En architecture principle är en generell regel eller riktlinje som vägleder arkitekturbeslut. Ett exempel är principen "Information är en tillgång för hela enterprisen". Den kan påverka beslut om dataägarskap, integration, datakvalitet, säkerhet och applikationsdesign, och den ger en enhetlig riktning för beslut som rör enterprisens information.

Governance svarar på frågan: vem har befogenhet att fatta vilka beslut, under vilka begränsningar? Governance betyder inte nödvändigtvis att varje arkitekturbeslut måste godkännas centralt. Effektiv governance fastställer tydliga principer, decision rights och gränser och ger samtidigt team lämplig autonomi. I stället för att kräva centralt godkännande av varje beslut kan governance rikta uppmärksamheten mot betydande risker, beroenden tvärs över enterprisen och strategiska beslut.

Principerna kan då fungera som guardrails. Team kan fatta många beslut själva så länge de håller sig inom de överenskomna gränserna, och därför kan de arbeta snabbt. Governance kan alltså möjliggöra agilitet i stället för att begränsa den.

Det finns nästan aldrig en perfekt arkitektur. Arkitektur innebär ofta trade-offs snarare än perfekta lösningar. Standardisering kan till exempel ge effektivitet men mindre flexibilitet, och centralisering kan ge kontroll men långsammare beslut. Arkitektens uppgift är att göra sådana trade-offs tydliga och anpassa dem till enterprisens mål.`,
    },
    { kind: "text", id: "m7-t9", sv: "## Sant eller falskt", en: "## True or False" },
    {
      kind: "fraga",
      id: "ea-m7-20",
      nr: "20",
      question: "Governance innebär nödvändigtvis att varje arkitekturbeslut måste godkännas centralt.",
      explanation:
        "Governance svarar på vem som har befogenhet att fatta vilka beslut och under vilka begränsningar. Med tydliga principer, decision rights och gränser kan team fatta många beslut själva, och governance kan fokusera på betydande risker, beroenden och strategiska beslut.",
    },
    {
      kind: "fraga",
      id: "ea-m7-21",
      nr: "21",
      question: "Principer kan fungera som arkitektoniska guardrails.",
      explanation:
        "Principer ger återanvändbar vägledning för beslut. Team kan fatta många beslut själva så länge de håller sig inom de överenskomna gränserna, och därför fungerar principerna som guardrails.",
    },
    {
      kind: "fraga",
      id: "ea-m7-22",
      nr: "22",
      question: "Arkitektur innebär ofta trade-offs snarare än perfekta lösningar.",
      explanation:
        "Det finns nästan aldrig en perfekt arkitektur. Standardisering ger till exempel effektivitet men mindre flexibilitet, och centralisering ger kontroll men långsammare beslut; arkitektur handlar om att hantera sådana trade-offs.",
    },
    { kind: "text", id: "m7-t10", sv: "## Kortsvarsfrågor", en: "## Short answer questions" },
    {
      kind: "fritext",
      id: "ea-e7-23",
      typ: "kortsvar",
      nr: "23",
      question:
        "Varför kan capabilities vara mer användbara än organisationens avdelningar vid planering av transformation?",
      modelAnswer:
        "Organisationsstrukturer kan förändras ofta genom omorganisationer, sammanslagningar och omstruktureringar. Capabilities kan ge en mer stabil representation av vad enterprisen behöver kunna göra. Det gör dem användbara för att identifiera capability gaps och prioritera transformation oberoende av nuvarande organisatoriska gränser.",
    },
    {
      kind: "fritext",
      id: "ea-e7-24",
      typ: "kortsvar",
      nr: "24",
      question: "Ge ett exempel på en architecture principle och förklara hur den kan påverka beslut.",
      modelAnswer:
        "\"Information är en tillgång för hela enterprisen\" kan påverka beslut om dataägarskap, integration, datakvalitet, säkerhet och applikationsdesign. Den ger en enhetlig riktning för beslut som rör enterprisens information.",
    },
    {
      kind: "fritext",
      id: "ea-e7-25",
      typ: "kortsvar",
      nr: "25",
      question:
        "Ett företag omorganiserar sin marknadsavdelning tre gånger på fem år. Det behöver dock fortfarande kundinsikt, kampanjhantering och marknadsanalys. Vad visar detta om capabilities?",
      modelAnswer:
        "Det visar att capabilities kan förbli relativt stabila även när organisationsstrukturer förändras. Organisationen kan ändra vem som utför capabilityn utan att den underliggande capabilityn i sig försvinner.",
    },
    { kind: "text", id: "m7-t11", sv: "## Essäfrågor", en: "## Essay questions" },
    {
      kind: "fritext",
      id: "ea-e7-26",
      typ: "essa",
      nr: "26",
      question: "Förklara hur business capabilities kan koppla strategi till Enterprise Architecture.",
      modelAnswer:
        "Capabilities översätter strategisk avsikt till de förmågor som en enterprise behöver för att nå sina mål. När strategiska prioriteringar har översatts till nödvändiga capabilities kan arkitekter bedöma vilka människor, processer, information, applikationer och vilken teknik som behövs för att stödja dem. Capability-baserad analys utgör därför en brygga mellan strategisk planering och arkitekturförändring.",
    },
    {
      kind: "fritext",
      id: "ea-e7-27",
      typ: "essa",
      nr: "27",
      question: "Hur kan governance möjliggöra snarare än begränsa agilitet?",
      modelAnswer:
        "Effektiv governance fastställer tydliga principer, decision rights och gränser och ger samtidigt team lämplig autonomi. I stället för att kräva centralt godkännande av varje beslut kan governance rikta uppmärksamheten mot betydande risker, beroenden tvärs över enterprisen och strategiska beslut. Det skapar guardrails inom vilka team kan röra sig snabbt.",
    },
  ],
};
