// Modul 9 i fliken Moduler (modul-9-12.pdf), översatt. Se m01.js för formen.
// "Architect's thinking" är en fritextfråga (ea-e9-tankande) där läraren
// kallar svaret "Possible answers". Modellsvaret till fråga 9 har inklistrad
// text i PDF:en och är översatt som det står.
export default {
  id: "kap9",
  number: 9,
  title: { sv: "Arkitektur och Agile", en: "Architecture and Agile" },
  blocks: [
    {
      kind: "text",
      id: "m9-t1",
      sv: `## Lärandemål

Studenterna ska förstå:

- Agile och arkitektur.
- Kontinuerlig arkitektur.
- Just-enough architecture.
- Guardrails.
- Architecture debt.
- Decentraliserat beslutsfattande.`,
      en: `## Learning objectives

Students should understand:

- Agile and architecture.
- Continuous architecture.
- Just-enough architecture.
- Guardrails.
- Architecture debt.
- Decentralized decision-making.`,
    },
    {
      kind: "text",
      id: "m9-t2",
      sv: `## Kärnförklaring

Agile betyder inte: "Arkitektur är onödig."

Det betyder att arkitekturen måste rymma:

- Iteration
- Feedback
- Ändrade prioriteringar
- Inkrementell leverans
- Lärande

Arkitekturen bör ge tillräcklig riktning utan att försöka förutse varje detalj år i förväg.`,
      en: `## Core explanation

Agile does not mean: "Architecture is unnecessary."

It means that architecture must accommodate:

- Iteration
- Feedback
- Changing priorities
- Incremental delivery
- Learning

Architecture should provide sufficient direction without attempting to predict every detail year in advance.`,
    },
    {
      kind: "fritext",
      id: "ea-e9-tankande",
      typ: "tankande",
      nr: null,
      title: { sv: "\"Arkitektens tänkande\"", en: "\"Architect's thinking\"" },
      answerLabel: { sv: "Möjliga svar", en: "Possible answers" },
      question:
        "Du är Enterprise Architecten. VD:n säger: \"Vårt problem är att vi har för många applikationer.\" Vilka frågor skulle du ställa innan du accepterar den diagnosen?",
      modelAnswer: `Vilka business capabilities berörs?
Vilka applikationer stödjer dessa capabilities?
Är dubbleringen verkligen ett problem?
Är applikationerna redundanta eller avsiktligt differentierade?
Vilka affärsresultat påverkas?
Vilken information är dubblerad?
Vilka är kostnaderna och riskerna?
Vilket strategiskt mål ligger bakom denna concern?`,
    },
    { kind: "text", id: "m9-t3", sv: "## Flervalsfrågor", en: "## Questions – multiple choice" },
    {
      kind: "fraga",
      id: "ea-m9-1",
      nr: "1",
      question: "Vilket påstående beskriver bäst Agile-arkitektur?",
      options: [
        "Arkitekturen elimineras.",
        "Arkitekturen blir klar innan utvecklingen börjar.",
        "Arkitekturen utvecklas iterativt och ger samtidigt lämplig riktning och guardrails.",
        "Arkitektur sker endast efter implementering.",
        "Arkitekturen är uteslutande centraliserad.",
      ],
      explanation:
        "Agile betyder inte att arkitektur är onödig, utan att arkitekturen måste rymma iteration, feedback och lärande. Den bör ge tillräcklig riktning utan att försöka förutse varje detalj i förväg.",
    },
    {
      kind: "fraga",
      id: "ea-m9-2",
      nr: "2",
      question: "Vad betyder \"just-enough architecture\"?",
      options: [
        "Ingen arkitektur",
        "Endast den arkitektur som behövs för att ge lämplig riktning och hantera betydande risker och beroenden",
        "Fullständig arkitektur för varje framtida detalj",
        "Arkitektur som skapas efter driftsättning",
        "Arkitektur endast för mjukvara",
      ],
      explanation:
        "Just-enough architecture är den arkitektur som behövs för att ge lämplig riktning och hantera betydande risker och beroenden, utan att försöka förutse varje detalj i förväg. Det betyder alltså varken ingen arkitektur eller en fullständig arkitektur för varje framtida detalj.",
    },
    {
      kind: "fraga",
      id: "ea-m9-3",
      nr: "3",
      question: "Varför är kontinuerlig arkitektur viktig?",
      options: [
        "Enterprises förändras aldrig.",
        "Krav, teknik och affärsförutsättningar förändras.",
        "Arkitektur är endast en projektartefakt.",
        "Agile förbjuder planering.",
        "Governance är onödigt.",
      ],
      explanation:
        "Krav, teknik och affärsförutsättningar förändras, så arkitekturen kan inte göras en gång för alla. Den måste rymma iteration, feedback, ändrade prioriteringar och lärande.",
    },
    {
      kind: "fraga",
      id: "ea-m9-4",
      nr: "4",
      question: "Vilken är en lämplig arkitektonisk guardrail?",
      options: [
        "Varje utvecklare måste använda samma editor.",
        "Alla system måste följa definierade säkerhets- och integrationsprinciper.",
        "Varje team måste be arkitekten om lov att skriva kod.",
        "Inget experimenterande är tillåtet.",
        "Alla beslut måste centraliseras.",
      ],
      explanation:
        "Guardrails är gränser inom vilka team kan fatta beslut själva, som gemensamma säkerhets- och integrationsprinciper för alla system. Att be om lov för all kod eller centralisera alla beslut riskerar i stället att göra arkitekten till en flaskhals.",
    },
    {
      kind: "fraga",
      id: "ea-m9-5",
      nr: "5",
      question: "Vad är architecture debt?",
      options: [
        "Ett ekonomiskt lån",
        "Ackumulerade arkitektoniska kompromisser som kan skapa framtida kostnader, risker eller begränsningar",
        "En projektbudget",
        "En tekniklicens",
        "En governance-kommitté",
      ],
      explanation:
        "Architecture debt uppstår när arkitektoniska kompromisser ackumuleras och med tiden ger högre kostnader, ökad risk och mindre flexibilitet. Det har inget med ekonomiska lån att göra.",
    },
    { kind: "text", id: "m9-t4", sv: "## Sant eller falskt", en: "## True or False" },
    {
      kind: "fraga",
      id: "ea-m9-6",
      nr: "6",
      question: "Agile betyder att arkitekturen bör överges.",
      explanation:
        "Agile betyder inte att arkitektur är onödig. Det betyder att arkitekturen måste rymma iteration, feedback, ändrade prioriteringar, inkrementell leverans och lärande.",
    },
    {
      kind: "fraga",
      id: "ea-m9-7",
      nr: "7",
      question: "Arkitektur kan utvecklas inkrementellt.",
      explanation:
        "Arkitekturen måste rymma iteration och inkrementell leverans och utvecklas med lärandet. Den ger tillräcklig riktning för nästa steg i stället för att bestämma allt i förväg.",
    },
    {
      kind: "fraga",
      id: "ea-m9-8",
      nr: "8",
      question: "Att centralisera varje arkitekturbeslut är nödvändigt för agilitet.",
      explanation:
        "Arkitekten behöver inte styra varje beslut. Med principer, standarder, guardrails och decision rights kan team fatta rutinbeslut självständigt, medan arkitekten fokuserar på betydande beroenden mellan team, strategiska beslut och systemrisker.",
    },
    { kind: "text", id: "m9-t5", sv: "## Kortsvarsfråga", en: "## Short-answer question" },
    {
      kind: "fritext",
      id: "ea-e9-9",
      typ: "kortsvar",
      nr: "9",
      question: "Hur kan en arkitekt undvika att bli en flaskhals i en Agile-organisation?",
      modelAnswer:
        "Arkitekten kan etablera principer, standarder, guardrails och decision rights, så att team kan fatta rutinbeslut självständigt. Arkitekten bör fokusera på betydande beroenden mellan team, strategiska beslut, systemrisker och frågor autonomi. Arkitekturen bör utvecklas med lärandet och fokusera på beslut med betydande påverkan på enterprisen. Detta gör det möjligt som kräver samordning på enterprise-nivå.",
    },
    { kind: "text", id: "m9-t6", sv: "## Essäfråga", en: "## Essay question" },
    {
      kind: "fritext",
      id: "ea-e9-10",
      typ: "essa",
      nr: "10",
      question: "Förklara hur Enterprise Architecture kan stödja Agile utan att bli ett hinder för leveransen.",
      modelAnswer:
        "Enterprise Architecture bör ge riktning, principer, återanvändbara capabilities och guardrails och samtidigt ge leveransteamen lämplig autonomi. Arkitekturen bör utvecklas med lärandet och fokusera på beslut med betydande påverkan på enterprisen. Detta möjliggör agilitet samtidigt som sammanhållningen bevaras och systemrisker hanteras.",
    },
  ],
};
