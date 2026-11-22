// Modul 11 i fliken Moduler (modul-9-12.pdf), översatt. Se m01.js för formen.
// Som i PDF:en: fråga 3 är en fritextfråga mitt bland flervalsfrågorna,
// fråga 5 saknas, numret 8 finns två gånger och den andra 8:an har "Answer:"
// i stället för "Model answer:". Fråga 2 alternativ D och fråga 4
// alternativ B har inklistrad text i PDF:en och står rensade.
export default {
  id: "kap11",
  number: 11,
  title: { sv: "Enterprise Architecture i praktiken", en: "Enterprise Architecture in Practice" },
  blocks: [
    {
      kind: "text",
      id: "m11-t1",
      sv: `## Fallstudie: Traditionell bank

En traditionell bank har:

- Flera kunddatabaser.
- En 25 år gammal kärnbanksplattform.
- Fristående digitala kanaler.
- Långsamma releasecykler.
- Många dubblerade applikationer.
- Ökande konkurrens från digitala banker.

VD:n säger: "Vi behöver bli en digital bank inom två år."`,
      en: `## Case Study: Traditional Bank

A traditional bank has:

- Multiple customer databases.
- A 25-year-old core banking platform.
- Independent digital channels.
- Slow-release cycles.
- Many duplicated applications.
- Increasing competition from digital banks.

The CEO states: "We need to become a digital bank within two years."`,
    },
    {
      kind: "text",
      id: "m11-t2",
      sv: `## Studentuppgift

Analysera situationen ur ett Enterprise Architecture-perspektiv.`,
      en: `## Student task

Analyze the situation from an Enterprise Architecture perspective.`,
    },
    { kind: "text", id: "m11-t3", sv: "## Flervalsfrågor", en: "## Questions - multiple choice" },
    {
      kind: "fraga",
      id: "ea-m11-1",
      nr: "1",
      question: "Vilken capability kan vara strategiskt viktig?",
      options: [
        "Serverunderhåll",
        "Digital onboarding av kunder",
        "Databasindexering",
        "Nätverkskablage",
        "Skript för driftsättning av applikationer",
      ],
      explanation:
        "Digital onboarding av kunder är något banken kan behöva kunna göra för att bli en digital bank, alltså en capability som hänger ihop med strategin. De andra alternativen är tekniska detaljer.",
    },
    {
      kind: "fraga",
      id: "ea-m11-2",
      nr: "2",
      question: "Vilket är ett exempel på ett potentiellt arkitektoniskt problem?",
      options: [
        "För många färger i diagram",
        "Fragmenterad kundinformation",
        "Anställda som använder olika tangentbord",
        "Ett projekt som har möten",
        "Utvecklare som använder olika skärmstorlekar",
      ],
      explanation:
        "Banken har flera kunddatabaser, så kundinformationen är fragmenterad. Det är ett arkitektoniskt problem som rör hur information och applikationer hänger ihop, till skillnad från diagramfärger eller tangentbord.",
    },
    {
      kind: "fritext",
      id: "ea-e11-3",
      typ: "fall",
      nr: "3",
      question: "Varför kan det vara riskabelt att omedelbart ersätta hela kärnbankssystemet?",
      modelAnswer:
        "Kärnsystemet kan stödja kritiska business capabilities och innehålla komplexa beroenden. En \"big bang\"-ersättning skulle kunna skapa stora operativa, ekonomiska och affärsmässiga risker. Inkrementella transition architectures kan låta banken modernisera samtidigt som den fortsätter att leverera värde.",
    },
    {
      kind: "fraga",
      id: "ea-m11-4",
      nr: "4",
      question: "Vad bör en target architecture ge?",
      options: [
        "En perfekt förutsägelse av varje framtida detalj",
        "En sammanhållen riktning för det önskade framtida läget",
        "En lista över leverantörer",
        "Endast en projekttidplan",
        "Källkod",
      ],
      explanation:
        "En target architecture bör fastställa den önskade riktningen, med stöd av principer och governance. Den förutsäger inte varje detalj; vägen dit går via transition architectures.",
    },
    {
      kind: "fraga",
      id: "ea-m11-6",
      nr: "6",
      question: "Vilken princip kan vara lämplig?",
      options: [
        "Varje avdelning äger sin egen kunddefinition.",
        "Kundinformation bör behandlas som en tillgång för hela enterprisen.",
        "Varje projekt väljer sina egna säkerhetsregler.",
        "Alla applikationer måste använda den nyaste tekniken.",
        "Inga standarder är tillåtna.",
      ],
      explanation:
        "Banken har flera kunddatabaser, och en princip om att kundinformation är en tillgång för hela enterprisen ger en gemensam riktning för hur den hanteras. Att varje avdelning äger sin egen kunddefinition skulle i stället öka fragmenteringen.",
    },
    { kind: "text", id: "m11-t4", sv: "## Kort essäfråga", en: "## Short essay question" },
    {
      kind: "fritext",
      id: "ea-e11-7",
      typ: "fall",
      nr: "7",
      question: "Vad skulle vara ett arkitektoniskt antimönster i den här situationen?",
      modelAnswer:
        "Att välja en teknikplattform innan verksamhetens mål, de capabilities som krävs och de arkitektoniska begränsningarna har fastställts.",
    },
    {
      kind: "fritext",
      id: "ea-e11-8",
      typ: "fall",
      nr: "8",
      question: "Vad bör arkitekten fråga innan teknik väljs?",
      modelAnswer:
        "Arkitekten bör fastställa de strategiska målen, önskade kundresultat, de capabilities som krävs, nuvarande begränsningar, stakeholders concerns och arkitektoniska principer innan tekniken utvärderas.",
    },
    {
      kind: "fritext",
      id: "ea-e11-8b",
      typ: "fall",
      nr: "8",
      answerLabel: { sv: "Svar", en: "Answer" },
      question: "Varför är transition architectures viktiga?",
      modelAnswer:
        "De ger praktiska mellanlägen som gör att en organisation kan gå från sin baseline architecture mot target architecture samtidigt som verksamheten fortsätter och värde levereras.",
    },
    { kind: "text", id: "m11-t5", sv: "## Essäfråga", en: "## Essay Question" },
    {
      kind: "fritext",
      id: "ea-e11-9",
      typ: "fall",
      nr: "9",
      question: "Utveckla ett arkitektoniskt tillvägagångssätt för banken.",
      modelAnswer:
        "Banken bör först klargöra sina strategiska mål och önskade kundresultat. Den bör sedan bedöma baseline capabilities, value streams, information, applikationer och teknik. En target architecture bör fastställa den önskade riktningen, med stöd av arkitektoniska principer och governance. I stället för att ersätta alla legacysystem samtidigt bör banken identifiera transition architectures och prioritera initiativ efter affärsvärde, risk och beroenden. Agile-leverans kan användas för att utveckla capabilities inkrementellt medan arkitekturen utvecklas genom feedback och lärande.",
    },
    {
      kind: "fritext",
      id: "ea-e11-10",
      typ: "fall",
      nr: "10",
      question: "Hur skulle Agile kunna påverka transformationen?",
      modelAnswer:
        "Transformationen skulle kunna organiseras kring inkrementella produkter och capabilities, där arkitekturen utvecklas parallellt med leveransen. Det skulle låta banken lära sig, leverera värde tidigare och justera arkitektoniska beslut allteftersom information blir tillgänglig.",
    },
  ],
};
