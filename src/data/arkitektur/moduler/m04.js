// Modul 4 i fliken Moduler (modul-1-4.pdf), översatt. Se m01.js för formen.
// Fråga 5 alternativ E är avbrutet i PDF:en och står avbrutet här också.
export default {
  id: "kap4",
  number: 4,
  title: { sv: "Zachman-ramverket", en: "Zachman Framework" },
  blocks: [
    {
      kind: "text",
      id: "m4-t1",
      sv: `## Lärandemål

Efter den här modulen ska du förstå:

- Syftet med Zachman.
- De sex interrogatives.
- De olika perspektiven.
- Varför Zachman är en ontology och ett klassificeringsschema snarare än en metodik.

Zachman-ramverket förstås bäst som en ontology och ett klassificeringsschema för beskrivningar av en enterprise.`,
      en: `## Learning objectives

Students should understand:

- a. Zachman's purpose.
- b. The six interrogatives.
- c. The different perspectives.
- d. Why Zachman is an ontology/classification schema rather than a methodology.

The Zachman Framework is best understood as an ontology and classification schema for enterprise descriptions.`,
    },
    {
      kind: "text",
      id: "m4-t2",
      sv: `## De sex frågorna

Zachman ger en struktur för att klassificera och organisera beskrivningar av en enterprise. Ramverket hjälper arkitekten att systematiskt tänka igenom vad som behöver beskrivas och från vilket perspektiv. Det ställs upp som ett rutnät med kolumner och rader.

Kolumnerna är sex interrogatives, alltså grundläggande frågor om enterprisen:

- **What?** — saker/data
- **How?** — processer/funktioner
- **Where?** — platser
- **Who?** — människor/ansvar
- **When?** — tid/händelser
- **Why?** — motivation/mål

Varje fråga visar en egen dimension av samma enterprise.

### Raderna: perspektiv

Raderna representerar i första hand olika perspektiv eller abstraktionsnivåer. Olika stakeholders behöver olika beskrivningar av samma enterprise. Någon i företagsledningen kan till exempel behöva se avgränsning, strategi, verksamhetsmål och de viktigaste capabilities. En teknikspecialist kan behöva se fysisk implementering, infrastruktur, plattformar och konfigurationer.

Varje cell i rutnätet klassificerar alltså en viss sorts beskrivning (kolumnen) från ett visst perspektiv (raden). Därför kan Zachman hjälpa till att visa var beskrivningar saknas eller är ofullständiga. En arkitektur som beskriver How och What väl men bortser från Why och Who kan till exempel beskriva processer, information och system korrekt men ändå inte koppla dem till mål, ägarskap och ansvar.`,
      en: `## The six questions

- **What?** — things/data
- **How?** — processes/functions
- **Where?** — locations
- **Who?** — people/responsibilities
- **When?** — time/events
- **Why?** — motivation/goals`,
    },
    {
      kind: "text",
      id: "m4-t3",
      sv: `## Viktig poäng

Zachman säger inte: "Gör det här, sedan det här, sedan det här." Ramverket säger i stället: "Här är olika dimensioner och perspektiv genom vilka enterprisen kan beskrivas." Det är därför ramverket inte ska förväxlas med en metodik.

### Ontology eller metodik

En metodik föreskriver aktiviteter, processer eller steg för att åstadkomma något. Den svarar på frågan: vad ska vi göra härnäst?

En ontology fastställer begrepp och relationer som beskriver vad som finns inom en domän och hur det kan klassificeras. Zachman är i första hand en ontology, en klassificeringsstruktur, snarare än en utvecklingsmetodik. Ramverket klassificerar och organiserar beskrivningar av en enterprise utifrån perspektiv och interrogatives. Det föreskriver inte en sekvens av aktiviteter för att utveckla arkitektur.

Rutnätet kan se ut som en ordning att arbeta i, men det är det inte. Raderna är inga projektfaser, och ramverket föreskriver ingen bestämd ordning att fylla i cellerna. Struktur är inte detsamma som sekvens. Zachman är inte heller en metod för projektledning eller mjukvaruutveckling.

### Zachman och TOGAF

TOGAF ger vägledning och ett tillvägagångssätt för att utveckla arkitektur, särskilt genom ADM (Architecture Development Method). TOGAF ger alltså en metod för att utveckla och styra arkitektur. Zachman hjälper i stället till att organisera vilka slags beskrivningar som kan behövas. Ramverken svarar på olika frågor och kan därför komplettera varandra.`,
      en: `## Key teaching point

Zachman doesn't say: "Do this, then this, then this." Instead: "Here are different dimensions and perspectives through which the enterprise can be described." - That is why it should not be confused with a methodology.`,
    },
    { kind: "text", id: "m4-t4", sv: "## Flervalsfrågor", en: "## Question multiple choice" },
    {
      kind: "fraga",
      id: "ea-m4-1",
      nr: "1",
      question: "Vilken är den BÄSTA beskrivningen av Zachman?",
      options: [
        "Metodik för mjukvaruutveckling",
        "Metodik för projektledning",
        "Ontology/klassificeringsschema för Enterprise Architecture",
        "Governance-process",
        "Teknikramverk",
      ],
      explanation:
        "Zachman förstås bäst som en ontology och ett klassificeringsschema för beskrivningar av en enterprise. Ramverket säger inte \"gör det här, sedan det här\", så det är ingen metodik.",
    },
    {
      kind: "fraga",
      id: "ea-m4-2",
      nr: "2",
      question: "Vilken interrogative i Zachman gäller i första hand processer och funktioner?",
      options: ["What", "How", "Where", "Who", "Why"],
      explanation: "How? gäller processer och funktioner. What? gäller i stället saker och data.",
    },
    {
      kind: "fraga",
      id: "ea-m4-3",
      nr: "3",
      question: "Vilken interrogative gäller motivation?",
      options: ["What", "How", "When", "Why", "Where"],
      explanation: "Why? gäller motivation och mål. When? gäller i stället tid och händelser.",
    },
    {
      kind: "fraga",
      id: "ea-m4-4",
      nr: "4",
      question: "Vad representerar raderna i första hand?",
      options: [
        "Projektfaser",
        "Teknikleverantörer",
        "Olika perspektiv eller abstraktionsnivåer",
        "Organisationens avdelningar",
        "Budgetkategorier",
      ],
      explanation:
        "Raderna visar olika perspektiv eller abstraktionsnivåer, medan kolumnerna är de sex interrogatives. Raderna är inga projektfaser, eftersom Zachman inte föreskriver någon ordning att arbeta i.",
    },
    {
      kind: "fraga",
      id: "ea-m4-5",
      nr: "5",
      question: "Varför beskrivs Zachman normalt inte som en metodik?",
      options: [
        "Det innehåller inga arkitekturbegrepp.",
        "Det föreskriver inte en sekvens av aktiviteter för att utveckla arkitektur.",
        "Det används endast för mjukvara.",
        "Det kan inte beskriva Business Architecture.",
        "Det är en projektlednings-",
      ],
      explanation:
        "En metodik föreskriver aktiviteter eller steg för att nå ett mål. Zachman visar i stället genom vilka dimensioner och perspektiv enterprisen kan beskrivas, men inte i vilken ordning man ska arbeta.",
    },
    { kind: "text", id: "m4-t5", sv: "## Sant eller falskt", en: "## True or False" },
    {
      kind: "fraga",
      id: "ea-m4-6",
      nr: "6",
      question: "Zachman föreskriver en obligatorisk sekvens av arkitekturaktiviteter.",
      explanation:
        "Zachman säger inte \"gör det här, sedan det här\". Ramverket klassificerar beskrivningar efter interrogatives och perspektiv och föreskriver ingen ordning.",
    },
    {
      kind: "fraga",
      id: "ea-m4-7",
      nr: "7",
      question: "De sex kolumnerna representerar olika interrogatives.",
      explanation:
        "Kolumnerna är de sex frågorna What?, How?, Where?, Who?, When? och Why? Raderna visar i stället de olika perspektiven.",
    },
    {
      kind: "fraga",
      id: "ea-m4-8",
      nr: "8",
      question: "Zachman kan hjälpa till att identifiera saknade eller ofullständiga arkitekturbeskrivningar.",
      explanation:
        "Ramverket ordnar de slags beskrivningar som kan behövas efter interrogatives och perspektiv. Därför kan man se var en beskrivning saknas eller är ofullständig.",
    },
    { kind: "text", id: "m4-t6", sv: "## Kortsvarsfråga", en: "## Short-answer question" },
    {
      kind: "fritext",
      id: "ea-e4-9",
      typ: "kortsvar",
      nr: "9",
      question: "Förklara skillnaden mellan en metodik och en ontology inom Enterprise Architecture.",
      modelAnswer:
        "En metodik föreskriver aktiviteter, processer eller steg för att åstadkomma något. En ontology fastställer begrepp och relationer som beskriver vad som finns inom en domän och hur det kan klassificeras. Zachman är i första hand en ontology/klassificeringsstruktur snarare än en utvecklingsmetodik.",
    },
    { kind: "text", id: "m4-t7", sv: "## Essäfrågor", en: "## Essay Questions" },
    {
      kind: "fritext",
      id: "ea-e4-10",
      typ: "essa",
      nr: "10",
      question: "Jämför Zachman och TOGAF.",
      modelAnswer:
        "Zachman tillhandahåller en ontology och en klassificeringsstruktur för att organisera beskrivningar av en enterprise utifrån perspektiv och interrogatives. TOGAF tillhandahåller vägledning och ett tillvägagångssätt för arkitekturutveckling, särskilt genom ADM. Zachman hjälper till att organisera vilka slags beskrivningar som kan behövas; TOGAF tillhandahåller en metod för att utveckla och styra arkitektur. De kan därför komplettera varandra.",
    },
    {
      kind: "fritext",
      id: "ea-e4-11",
      typ: "essa",
      nr: "11",
      question: "Varför är det missvisande att beskriva Zachman som en metodik?",
      modelAnswer:
        "En metodik föreskriver aktiviteter eller procedurer för att nå ett mål. Zachman tillhandahåller i första hand en struktur för att klassificera och organisera beskrivningar av en enterprise utifrån olika perspektiv och interrogatives. Det föreskriver inte en sekvens av aktiviteter för att utveckla arkitektur.",
    },
  ],
};
