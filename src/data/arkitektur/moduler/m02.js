// Modul 2 i fliken Moduler (modul-1-4.pdf), översatt. Se m01.js för formen.
// Essäfrågan utan nummer (mellan fråga 10 och 11) står som i PDF:en.
export default {
  id: "kap2",
  number: 2,
  title: { sv: "Vad är arkitektur?", en: "What Is Architecture?" },
  blocks: [
    {
      kind: "text",
      id: "m2-t1",
      sv: `## Lärandemål

Efter den här modulen ska du förstå:

- Arkitektur som struktur och relationer.
- Arkitektur som abstraktion.
- Skillnaden mellan arkitektur, design och implementering.
- Varför arkitektur finns.`,
      en: `## Learning objectives

Students should understand:

- Architecture as structure and relationships.
- Architecture as abstraction.
- The difference between architecture, design and implementation.
- Why architecture exists.`,
    },
    {
      kind: "text",
      id: "m2-t2",
      sv: `## Kärnbegrepp

Arkitektur är den grundläggande organisationen av något. Den omfattar delarna (komponenterna), relationerna mellan dem, principerna och hur helheten utvecklas över tid.

En arkitektur är inte bara ett diagram. Ett diagram är en representation av arkitekturen, alltså en bild av den. Diagrammet och arkitekturen är inte samma sak.`,
      en: `## Core concept

Architecture is concerned with:

The fundamental organization of something, including its components, relationships, principles and evolution.

An architecture isn't merely a diagram. A diagram is a representation of an architecture.`,
    },
    {
      kind: "text",
      id: "m2-t3",
      sv: `## Kärnförklaring

Arkitektur är inte bara en samling komponenter. Komponenterna ensamma förklarar inte hur enterprisen fungerar. Arkitektur handlar också om relationer, beroenden, ansvar, principer, begränsningar och syfte. Den handlar särskilt om relationer och konsekvenser.

Ett exempel är kedjan business capability → process → information → applikation → teknik. Med den kan arkitekten fråga: "Om den här capabilityn förändras, vad mer påverkas?" Arkitekturen handlar om relationerna mellan de här elementen. Det är arkitektoniskt tänkande. Ett exempel på en arkitektonisk fråga är: "Vilka beroenden finns mellan en kritisk business capability och de applikationer som stödjer den?"

Att förstå relationerna gör det möjligt för arkitekten att bedöma konsekvenserna av en förändring. Arkitektur finns för att möjliggöra förändring med ett syfte.

### Arkitektur som abstraktion

Enterprise Architecture hanterar en mycket komplex verklighet. Abstraktion är användbar för att dölja irrelevanta detaljer, så att en fråga kan förstås på en lämplig nivå. Man beskriver då något på en viss detaljnivå eller ur ett visst perspektiv. Det är de irrelevanta detaljerna som döljs, inte alla detaljer. Vilka detaljer som är relevanta beror på vilken concern man har.

Därför kan olika stakeholders arbeta med olika nivåer och ändå tala om samma enterprise. Samma enterprise kan beskrivas som capabilities, som processer, som applikationer eller som teknik. Beskrivningarna konkurrerar inte med varandra, utan de är olika abstraktioner av samma enterprise. En arkitektur behöver därför inte beskriva varje implementeringsdetalj.

### Arkitektur, design och implementering

- **Arkitektur** fastställer den grundläggande organisationen: relationerna, principerna och begränsningarna.
- **Design** tar fram mer detaljerade lösningar inom de ramar som arkitekturen sätter.
- **Implementering** förverkligar designen i praktiken, i en driftsmiljö.

Skillnaderna mellan de tre är inte absoluta, men de motsvarar olika nivåer av beslutsfattande och abstraktion. Arkitektur och implementering är alltså inte samma sak: arkitekturen gäller den grundläggande organisationen, och implementeringen förverkligar den organisationen i praktiken.`,
      en: `## Core explanation

Architecture is not simply a collection of components. It concerns the fundamental organization of something, including its components, relationships, principles, constraints and evolution. A diagram is a representation of architecture, not architecture itself. Architecture is particularly concerned with relationships and consequences.

For example: Business capability → process → information → application → technology

allows the architect to ask:

"If this capability changes, what else is affected?" - The architecture is concerned with the relationships between these elements.

That is architectural thinking.`,
    },
    { kind: "text", id: "m2-t4", sv: "## Flervalsfrågor", en: "## Questions - multiple choice" },
    {
      kind: "fraga",
      id: "ea-m2-1",
      nr: "1",
      question: "Vilket påstående beskriver BÄST arkitektur?",
      options: [
        "En lista över tekniker",
        "En samling diagram",
        "Den grundläggande organisationen av ett system och dess relationer",
        "En projektplan",
        "En mjukvaruimplementering",
      ],
      explanation:
        "Arkitektur är den grundläggande organisationen av något, inklusive komponenter, relationer, principer och utveckling. Ett diagram är bara en representation av arkitekturen, och en lista över tekniker saknar relationerna.",
    },
    {
      kind: "fraga",
      id: "ea-m2-2",
      nr: "2",
      question: "Varför är relationer viktiga i arkitektur?",
      options: [
        "Relationer avgör diagrammens färg.",
        "Relationer visar beroenden och konsekvenser av förändring.",
        "Relationer tar bort behovet av komponenter.",
        "Relationer är endast relevanta för mjukvara.",
        "Relationer är i första hand administrativa.",
      ],
      explanation:
        "Arkitektur handlar särskilt om relationer och konsekvenser. Kedjan business capability → process → information → applikation → teknik gör att arkitekten kan fråga vad mer som påverkas om en capability förändras.",
    },
    {
      kind: "fraga",
      id: "ea-m2-3",
      nr: "3",
      question: "Vad är abstraktion användbart till?",
      options: [
        "Att dölja irrelevanta detaljer så att en fråga kan förstås på en lämplig nivå",
        "Att eliminera arkitektur",
        "Att ersätta stakeholders",
        "Att undvika alla tekniska detaljer",
        "Att förhindra förändring",
      ],
      explanation:
        "Abstraktion låter arkitekter och stakeholders fokusera på det som är relevant för en viss concern utan onödiga detaljer. Det är de irrelevanta detaljerna som döljs, inte alla tekniska detaljer.",
    },
    {
      kind: "fraga",
      id: "ea-m2-4",
      nr: "4",
      question: "Vilket påstående skiljer bäst arkitektur från implementering?",
      options: [
        "Arkitektur gäller den grundläggande organisationen; implementering gäller att förverkliga den organisationen i praktiken.",
        "Arkitektur och implementering är identiska.",
        "Arkitektur sker endast efter implementering.",
        "Implementering är alltid strategisk.",
        "Arkitektur gäller endast hårdvara.",
      ],
      explanation:
        "Arkitektur fastställer den grundläggande organisationen, relationerna, principerna och begränsningarna, medan implementering förverkligar designen i en driftsmiljö. Gränserna är inte absoluta, men de motsvarar olika nivåer av beslut och abstraktion.",
    },
    {
      kind: "fraga",
      id: "ea-m2-5",
      nr: "5",
      question: "Vilket av följande är mest sannolikt en arkitektonisk fråga?",
      options: [
        "Vilken färg ska applikationens knapp ha?",
        "Vilket tangentbord ska utvecklarna använda?",
        "Vilka beroenden finns mellan en kritisk business capability och de applikationer som stödjer den?",
        "Vem ska skriva en viss kodrad?",
        "Vilket typsnitt ska en rapport ha?",
      ],
      explanation:
        "Arkitektur handlar om relationer och konsekvenser. Beroendet mellan en kritisk business capability och applikationerna som stödjer den visar vad som påverkas när capabilityn förändras.",
    },
    { kind: "text", id: "m2-t5", sv: "## Sant/falskt-frågor", en: "## True or False Questions" },
    {
      kind: "fraga",
      id: "ea-m2-6",
      nr: "6",
      question: "Ett diagram är samma sak som den arkitektur det representerar.",
      explanation:
        "Ett diagram är en representation av arkitektur, inte arkitekturen själv. Arkitekturen är den grundläggande organisationen med komponenter, relationer, principer och utveckling.",
    },
    {
      kind: "fraga",
      id: "ea-m2-7",
      nr: "7",
      question: "Arkitektur handlar om relationer såväl som komponenter.",
      explanation:
        "Arkitektur är inte bara en samling komponenter. Den handlar särskilt om relationerna mellan dem och om konsekvenserna när något förändras.",
    },
    {
      kind: "fraga",
      id: "ea-m2-8",
      nr: "8",
      question: "Arkitektur måste alltid beskriva varje implementeringsdetalj.",
      explanation:
        "Arkitektur fastställer den grundläggande organisationen, och design tar fram mer detaljerade lösningar inom de ramarna. Abstraktion gör att man kan undvika onödiga detaljer.",
    },
    {
      kind: "fraga",
      id: "ea-m2-9",
      nr: "9",
      question: "Arkitektur och implementering är samma sak.",
      explanation:
        "Arkitektur gäller den grundläggande organisationen, medan implementering förverkligar designen i en driftsmiljö. Gränsen är inte absolut, men det är olika nivåer av beslut och abstraktion.",
    },
    { kind: "text", id: "m2-t6", sv: "## Kortsvarsfråga", en: "## Short-answer question" },
    {
      kind: "fritext",
      id: "ea-e2-10",
      typ: "kortsvar",
      nr: "10",
      question: "Varför är abstraktion viktigt för Enterprise Architecture?",
      modelAnswer:
        "Enterprise Architecture hanterar en mycket komplex verklighet. Abstraktion gör det möjligt för arkitekter och stakeholders att fokusera på de aspekter som är relevanta för en viss concern och samtidigt undvika onödiga detaljer. Olika stakeholders kan därför arbeta med olika representationsnivåer och ändå diskutera samma enterprise.",
    },
    { kind: "text", id: "m2-t7", sv: "## Essäfråga", en: "## Essay question" },
    {
      kind: "fritext",
      id: "ea-e2-x",
      typ: "essa",
      nr: null,
      question: "Varför räcker det inte att beskriva en enterprise genom att bara räkna upp dess komponenter?",
      modelAnswer:
        "Komponenter förklarar inte i sig hur enterprisen fungerar. Arkitektur handlar också om relationer, beroenden, ansvar, principer, begränsningar och syfte. Att förstå dessa relationer gör det möjligt för arkitekter att bedöma konsekvenserna av förändring.",
    },
    {
      kind: "fritext",
      id: "ea-e2-11",
      typ: "essa",
      nr: "11",
      question: "Förklara skillnaden mellan arkitektur, design och implementering.",
      modelAnswer:
        "Arkitektur fastställer den grundläggande organisationen, relationerna, principerna och begränsningarna. Design tar fram mer detaljerade lösningar inom dessa arkitektoniska ramar. Implementering förverkligar designen i en driftsmiljö. Skillnaderna är inte absoluta, men de motsvarar olika nivåer av beslutsfattande och abstraktion.",
    },
  ],
};
