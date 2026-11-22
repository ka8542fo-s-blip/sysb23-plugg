// Modul 8 i fliken Moduler (modul-5-8.pdf), översatt. Se m01.js för formen.
// Modellsvaret till fråga 8 slutar med en trasig mening i PDF:en; den är
// översatt som den står. Lärarens not om frågorna som ligger i modul 7 står
// sist, som i PDF:en.
export default {
  id: "kap8",
  number: 8,
  title: {
    sv: "Principer, governance och beslut",
    en: "Principles, Governance and Decisions",
  },
  blocks: [
    {
      kind: "text",
      id: "m8-t1",
      sv: `## Lärandemål

Studenterna ska förstå:

- Architecture principles.
- Governance.
- Decision rights.
- Guardrails.
- Trade-offs.`,
      en: `## Learning objectives

Students should understand:

- Architecture principles.
- Governance.
- Decision rights.
- Guardrails.
- Trade-offs.`,
    },
    {
      kind: "text",
      id: "m8-t2",
      sv: `## Principexempel – "Information är en tillgång för hela enterprisen."

Den här principen kan påverka:

- Dataägarskap
- Applikationsdesign
- Integration
- Governance
- Säkerhet
- Investeringar`,
      en: `## Principle example - "Information is an enterprise asset."

This principle can influence:

- Data ownership
- Application design
- Integration
- Governance
- Security
- Investment`,
    },
    {
      kind: "text",
      id: "m8-t3",
      sv: `## Governance

Governance svarar på: Vem har befogenhet att fatta vilka beslut, under vilka begränsningar?`,
      en: `## Governance

Governance answers: Who has the authority to make which decisions, under what constraints?`,
    },
    { kind: "text", id: "m8-t4", sv: "## Flervalsfrågor", en: "## Question - multiple choice" },
    {
      kind: "fraga",
      id: "ea-m8-1",
      nr: "1",
      question: "Vad är en architecture principle?",
      options: [
        "En detaljerad teknisk implementering",
        "En generell regel eller riktlinje som vägleder arkitekturbeslut",
        "En projekttidplan",
        "Ett leverantörsavtal",
        "Endast en standard för källkod",
      ],
      explanation:
        "En architecture principle är en generell regel eller riktlinje som vägleder arkitekturbeslut. Principen \"Information är en tillgång för hela enterprisen\" kan till exempel påverka dataägarskap, applikationsdesign, integration, governance, säkerhet och investeringar.",
    },
    {
      kind: "fraga",
      id: "ea-m8-2",
      nr: "2",
      question: "Vilket påstående beskriver bäst governance för arkitektur?",
      options: [
        "Att leda utvecklare",
        "Att fastställa decision rights, ansvarsskyldighet och lämpliga kontroller för arkitekturbeslut",
        "Att rita diagram",
        "Att köpa hårdvara",
        "Att ersätta strategin",
      ],
      explanation:
        "Governance svarar på vem som har befogenhet att fatta vilka beslut och under vilka begränsningar. Det handlar alltså om decision rights, ansvarsskyldighet och kontroll, inte om att leda utvecklare eller rita diagram.",
    },
    {
      kind: "fraga",
      id: "ea-m8-3",
      nr: "3",
      question: "Varför kan principer stödja agilitet?",
      options: [
        "De eliminerar allt beslutsfattande.",
        "De ger guardrails inom vilka team kan fatta beslut mer självständigt.",
        "De kräver att varje beslut godkänns centralt.",
        "De förhindrar experimenterande.",
        "De eliminerar arkitektur.",
      ],
      explanation:
        "Tydliga principer ger återanvändbar vägledning, så team kan fatta många beslut själva utan att be om godkännande varje gång, så länge de håller sig inom de överenskomna gränserna. Principerna fungerar därmed som guardrails.",
    },
    {
      kind: "fraga",
      id: "ea-m8-4",
      nr: "4",
      question: "Vilket är en arkitektonisk trade-off?",
      options: [
        "Flexibilitet kontra standardisering",
        "Blå kontra röda diagram",
        "Måndag kontra tisdag",
        "Tangentbord kontra mus",
        "Märke på bärbar dator",
      ],
      explanation:
        "Flexibilitet och standardisering är mål som konkurrerar med varandra: standardisering ger effektivitet men kan minska flexibiliteten. De andra alternativen är val utan arkitektonisk betydelse.",
    },
    {
      kind: "fraga",
      id: "ea-m8-5",
      nr: "5",
      question: "Vad bör governance i första hand åstadkomma?",
      options: [
        "Maximal byråkrati",
        "Lämpligt beslutsfattande, ansvarsskyldighet och kontroll",
        "Att autonomin tas bort",
        "Centralisering av alla tekniska beslut",
        "Att architecture principles tas bort",
      ],
      explanation:
        "Governance svarar på vem som har befogenhet att fatta vilka beslut och under vilka begränsningar, med tydligt ansvar. Målet är lämpliga beslut och kontroll, inte maximal byråkrati eller att alla beslut centraliseras.",
    },
    {
      kind: "fraga",
      id: "ea-m8-6",
      nr: "6",
      question: "Vad är det huvudsakliga syftet med en architecture principle?",
      options: [
        "Att beskriva varje teknisk implementering",
        "Att ge enhetlig vägledning för arkitektoniska beslut",
        "Att ersätta governance för arkitekturen",
        "Att eliminera autonomi",
        "Att dokumentera projekttidplaner",
      ],
      explanation:
        "En princip ger en enhetlig riktning för beslut; \"Information är en tillgång för hela enterprisen\" ger till exempel en enhetlig riktning för beslut som rör enterprisens information. Den beskriver inte varje teknisk implementering.",
    },
    { kind: "text", id: "m8-t5", sv: "## Sant eller falskt", en: "## True or False" },
    {
      kind: "fraga",
      id: "ea-m8-7",
      nr: "7",
      question: "God governance kräver nödvändigtvis godkännande av varje tekniskt beslut.",
      explanation:
        "Governance kan fokusera på betydande risker och beroenden i stället för att kräva centralt godkännande av varje beslut. Inom principer och guardrails kan team fatta många beslut själva.",
    },
    { kind: "text", id: "m8-t6", sv: "## Essäfråga", en: "## Essay question" },
    {
      kind: "fritext",
      id: "ea-e8-8",
      typ: "essa",
      nr: "8",
      question: "Förklara hur architecture principles kan öka agiliteten.",
      modelAnswer:
        "Tydliga principer ger återanvändbar vägledning för beslut. Team kan fatta många beslut självständigt utan att be om godkännande varje gång, förutsatt att de håller sig inom de överenskomna gränserna. Principer fungerar därför som guardrails som kan öka riktningen samtidigt som lämpliga beslut delegeras till leveransteam. Arkitekturen bör fokusera på betydande risker och beroenden snarare än att kräva centralisera enhetlighet och beslutshastighet.",
    },
    {
      kind: "text",
      id: "m8-t7",
      sv: "OBS: flera av det förväntade antalet frågor ligger under modul 8 eftersom de är något sammanflätade. Detta för att få en bättre överblick.",
      en: "NOTE: several of the expected number of questions is under module 8 since those are somewhat intermingled. This for the purpose to get a better overwiev.",
    },
  ],
};
