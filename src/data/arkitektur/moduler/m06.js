// Modul 6 i fliken Moduler (modul-5-8.pdf), översatt. Se m01.js för formen.
// Domännamnen (Business, Data, Application, Technology) står kvar på
// engelska som i Business Architecture osv.
export default {
  id: "kap6",
  number: 6,
  title: { sv: "Arkitekturdomäner och views", en: "Architecture Domains and Views" },
  blocks: [
    {
      kind: "text",
      id: "m6-t1",
      sv: `## Lärandemål

Efter den här modulen ska du förstå:

- Business Architecture
- Data Architecture
- Application Architecture
- Technology Architecture
- views och viewpoints
- stakeholders concerns.`,
      en: `## Learning objectives

Students should understand:

- Business Architecture
- Data Architecture
- Application Architecture
- Technology Architecture
- Views and viewpoints
- Stakeholder concerns`,
    },
    {
      kind: "text",
      id: "m6-t2",
      sv: `## Fyra välbekanta domäner

- **Business** (Business Architecture) – capabilities, processer, organisation, värde och verksamhetstjänster.
- **Data** (Data Architecture) – information, datastrukturer, ägarskap, governance och flöden.
- **Application** (Application Architecture) – applikationer och applikationstjänster.
- **Technology** (Technology Architecture) – infrastruktur, plattformar, nätverk och tekniktjänster.`,
      en: `## Four familiar domains

- **Business** - Capabilities, processes, organization, value and business services.
- **Data** - Information, data structures, ownership, governance and flows.
- **Application** - Applications and application services.
- **Technology** - Infrastructure, platforms, networks and technology services.`,
    },
    {
      kind: "text",
      id: "m6-t3",
      sv: `## Viktig varning

Dessa domäner är inte oberoende silor. De intressanta arkitektoniska frågorna gäller deras relationer. Domänerna hänger ihop och är beroende av varandra: en business capability kan kräva viss information, vissa applikationer och viss teknik. En förändring i verksamheten kan därför kräva förändringar i information, applikationer och teknik.

Domänerna är användbara just för att deras relationer kan analyseras. Relationer visar beroenden, effekter och konsekvenser av förändring. När arkitekten förstår att en business capability beror på vissa processer, viss information, vissa applikationer och viss teknik, går det att bedöma hur en förändring sprider sig genom enterprisen. Därför är relationerna ofta viktigare än de enskilda komponenterna.

Ett problem kan också ligga i relationen mellan två domäner. Hur väl applikationerna stödjer en business capability är till exempel en fråga om relationen mellan Business och Application Architecture. Det syns inte om man tittar på en domän i taget.

Att utforma domänerna oberoende av varandra är därför farligt. Det kan skapa inkonsekvenser, dubblerade capabilities och lösningar som inte stödjer verksamhetens mål.

### Views och viewpoints

En stakeholder kan behöva en viss view av arkitekturen. Olika stakeholders har olika concerns och behöver därför olika information och olika abstraktionsnivåer. En chef kan till exempel behöva se affärsresultat, och en ingenjör kan behöva detaljer om implementeringen. Därför behövs flera views, och ett enda diagram räcker normalt inte för alla.

En viewpoint fastställer hur en view bör hantera en viss concern hos stakeholders. Den är alltså en specifikation av hur en view ska konstrueras och vad den ska representera. En view är den faktiska representationen som skapas med hjälp av viewpointen. En viewpoint och en view är därför inte samma sak.`,
      en: `## Important warning

These domains are not independent silos. The interesting architectural questions concern their relationships. These domains are interconnected. A stakeholder may need a particular view of the architecture. A viewpoint establishes how a view should address a particular stakeholder concern.`,
    },
    { kind: "text", id: "m6-t4", sv: "## Flervalsfrågor", en: "## Question - multiple choice" },
    {
      kind: "fraga",
      id: "ea-m6-1",
      nr: "1",
      question: "Vilket är tydligast en concern för Business Architecture?",
      options: ["CPU-arkitektur", "Business capability", "Databasindex", "Nätverksprotokoll", "Serverkonfiguration"],
      explanation:
        "Business Architecture omfattar capabilities, processer, organisation, värde och verksamhetstjänster, så en business capability hör tydligt dit. De andra alternativen är tekniska detaljer som hör till andra domäner.",
    },
    {
      kind: "fraga",
      id: "ea-m6-2",
      nr: "2",
      question: "Vilket är tydligast en concern för Data Architecture?",
      options: [
        "Organisationshierarki",
        "Verksamhetens motivation",
        "Ägarskap för information och datastrukturer",
        "Placering av serverrack",
        "Projekttidplan",
      ],
      explanation:
        "Data Architecture omfattar information, datastrukturer, ägarskap, governance och flöden. Organisationshierarkin hör till Business Architecture och placeringen av serverrack till Technology Architecture.",
    },
    {
      kind: "fraga",
      id: "ea-m6-3",
      nr: "3",
      question: "Vilket påstående beskriver bäst en viewpoint?",
      options: [
        "Implementeringen av en databas",
        "En specifikation av hur en view konstrueras för att hantera stakeholders concerns",
        "En projektplan",
        "En teknikplattform",
        "En avdelning i organisationen",
      ],
      explanation:
        "En viewpoint fastställer hur en view bör hantera en viss concern hos stakeholders. Själva representationen som tas fram med den är en view.",
    },
    {
      kind: "fraga",
      id: "ea-m6-4",
      nr: "4",
      question: "Varför behövs flera views?",
      options: [
        "Varje stakeholder har identiska concerns.",
        "Olika stakeholders behöver olika information och abstraktionsnivåer.",
        "Arkitekturen måste innehålla så många diagram som möjligt.",
        "Views ersätter governance.",
        "Views behövs endast av utvecklare.",
      ],
      explanation:
        "Olika stakeholders har olika concerns och kan behöva en egen view av arkitekturen. De behöver därför olika information och abstraktionsnivåer; målet är inte så många diagram som möjligt.",
    },
    {
      kind: "fraga",
      id: "ea-m6-5",
      nr: "5",
      question: "Vilket påstående är mest korrekt?",
      options: [
        "Arkitekturdomäner bör vara helt isolerade.",
        "Arkitekturdomäner är användbara just för att deras relationer kan analyseras.",
        "Business Architecture är underordnad Technology Architecture.",
        "Data har ingen relation till Business Architecture.",
        "Application Architecture är alltid den viktigaste domänen.",
      ],
      explanation:
        "Domänerna är inte oberoende silor, och de intressanta arkitektoniska frågorna gäller deras relationer. En förändring i verksamheten kan kräva förändringar i information, applikationer och teknik.",
    },
    {
      kind: "fraga",
      id: "ea-m6-6",
      nr: "6",
      question:
        "En business capability stöds dåligt av flera fragmenterade applikationer. Vilket arkitektoniskt perspektiv är MEST användbart för att förstå relationen?",
      options: [
        "Endast Technology Architecture",
        "Endast Business Architecture",
        "Relationen mellan Business och Application Architecture",
        "Endast nätverksarkitektur",
        "Endast säkerhetsarkitektur",
      ],
      explanation:
        "Problemet gäller hur en business capability stöds av applikationer, alltså relationen mellan Business och Application Architecture. En enda domän för sig visar inte det sambandet.",
    },
    { kind: "text", id: "m6-t5", sv: "## Sant/falskt-frågor", en: "## True or False Questions" },
    {
      kind: "fraga",
      id: "ea-m6-7",
      nr: "7",
      question: "Olika stakeholders kan behöva olika arkitektoniska views.",
      explanation:
        "Olika stakeholders har olika concerns och behöver olika information och abstraktionsnivåer. En viewpoint fastställer hur en view ska hantera en viss concern.",
    },
    {
      kind: "fraga",
      id: "ea-m6-8",
      nr: "8",
      question: "Arkitekturdomäner bör behandlas som orelaterade silor.",
      explanation:
        "Domänerna är inte oberoende silor utan hänger ihop. Att utforma dem var för sig kan ge inkonsekvenser, dubblerade capabilities och lösningar som inte stödjer verksamhetens mål.",
    },
    {
      kind: "fraga",
      id: "ea-m6-9",
      nr: "9",
      question: "En viewpoint och en view är exakt samma sak.",
      explanation:
        "En viewpoint definierar hur en viss concern hos stakeholders bör hanteras och representeras. En view är den faktiska representation som skapas med hjälp av den viewpointen.",
    },
    {
      kind: "fraga",
      id: "ea-m6-10",
      nr: "10",
      question: "Arkitekturdomäner bör betraktas helt oberoende av varandra.",
      explanation:
        "Business, Data, Application och Technology Architecture är beroende av varandra, och en verksamhetsförändring kan kräva förändringar i information, applikationer och teknik. De intressanta frågorna gäller just relationerna.",
    },
    { kind: "text", id: "m6-t6", sv: "## Kortsvarsfråga", en: "## Short answer question." },
    {
      kind: "fritext",
      id: "ea-e6-11",
      typ: "kortsvar",
      nr: "11",
      question: "Förklara skillnaden mellan en view och en viewpoint.",
      modelAnswer:
        "En viewpoint definierar hur en viss concern hos stakeholders bör hanteras och representeras. En view är den faktiska representation som skapas med hjälp av den viewpointen.",
    },
    { kind: "text", id: "m6-t7", sv: "## Essäfrågor", en: "## Essay questions" },
    {
      kind: "fritext",
      id: "ea-e6-12",
      typ: "essa",
      nr: "12",
      question: "Varför är arkitektoniska relationer ofta viktigare än enskilda arkitektoniska komponenter?",
      modelAnswer:
        "Relationer visar beroenden, effekter och konsekvenser av förändring. Att förstå att en business capability beror på vissa processer, viss information, vissa applikationer och viss teknik gör det möjligt för arkitekter att bedöma hur förändringar sprider sig genom enterprisen.",
    },
    {
      kind: "fritext",
      id: "ea-e6-13",
      typ: "essa",
      nr: "13",
      question: "Varför är det farligt att utforma arkitekturdomäner oberoende av varandra?",
      modelAnswer:
        "Business, data, application och technology architecture är beroende av varandra. En verksamhetsförändring kan kräva förändringar i information, applikationer och teknik. Att utforma domänerna oberoende av varandra kan därför skapa inkonsekvenser, dubblerade capabilities och lösningar som inte stödjer verksamhetens mål.",
    },
  ],
};
