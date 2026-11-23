// Modul 5 i fliken Moduler (modul-5-8.pdf), översatt. Se m01.js för formen.
// Fråga 1 har en variant (ea-m5-1b) som läraren inleder på svenska; raden
// står som han skrev den. Variantens alternativ B och fråga 5 alternativ E
// har inklistrad text i PDF:en och står rensade som i frågebanken.
export default {
  id: "kap5",
  number: 5,
  title: { sv: "TOGAF och ADM", en: "TOGAF and the ADM" },
  blocks: [
    {
      kind: "text",
      id: "m5-t1",
      sv: "**Föreläsning 2 — TOGAF och arkitekturpraktik**",
      en: "**Lecture 2 — TOGAF and Architecture Practice**",
    },
    {
      kind: "text",
      id: "m5-t2",
      sv: `## Lärandemål

Efter den här modulen ska du förstå:

- Vad TOGAF är.
- Syftet med ADM.
- Varför ADM är iterativ.
- Hur TOGAF skiljer sig från Zachman.
- Arkitekturutveckling.
- Skillnaden mellan vägledningen i ett ramverk och en organisations faktiska arkitektur.`,
      en: `## Learning objectives

Students should understand:

- What TOGAF is.
- The purpose of the ADM.
- Why the ADM is iterative.
- How TOGAF differs from Zachman.
- Architecture development.
- The distinction between framework guidance and an organization's actual architecture.`,
    },
    {
      kind: "text",
      id: "m5-t3",
      sv: `## Kärnbudskap

TOGAF-standarden ger en samlad vägledning och ett tillvägagångssätt för Enterprise Architecture. Architecture Development Method (ADM) ger ett iterativt tillvägagångssätt för att utveckla och förvalta arkitektur. ADM:s huvudsakliga syfte är alltså att utveckla och vidareutveckla Enterprise Architecture, inte att utveckla mjukvara.

### ADM:s faser

En förenklad bild av ADM omfattar:

- Preliminary
- Architecture Vision
- Business Architecture
- Information Systems Architectures
- Technology Architecture
- Opportunities and Solutions
- Migration Planning
- Implementation Governance
- Architecture Change Management

ADM är ett strukturerat tillvägagångssätt för att utveckla, kommunicera, styra och vidareutveckla Enterprise Architecture. Den hjälper arkitekten att gå från att förstå arkitekturvisionen via domänarkitektur, möjligheter och migrering till Implementation Governance.

Architecture Vision ska skapa en gemensam övergripande bild av den önskade arkitektoniska riktningen och säkra lämplig uppslutning (commitment) från stakeholders. Den svarar på vad man vill uppnå, varför det spelar roll och vilken den arkitektoniska riktningen är. Arkitekturen börjar alltså med syftet, inte med tekniken.

### Inget vattenfall

ADM ska **inte** behandlas som en alltför enkel, linjär vattenfallsprocess. Den stödjer iteration och anpassning. Arkitekturarbete är iterativt och anpassas efter förändrade krav, nya lärdomar och förändrade omständigheter. Under arbetet lär man sig mer om problemet, om enterprisen och om lösningen, och då kan tidigare antaganden behöva ses över. Arkitekturarbetet kan därför behöva itereras. Iteration är inte ett misslyckande, utan lärande.

### TOGAF är inte arkitekturen

TOGAF hjälper oss att ta fram arkitektur, men TOGAF är inte enterprisens arkitektur. Organisationen måste själv bestämma sina mål, sina principer, sin arkitektur och sitt önskade framtida läge, sin target architecture. Två organisationer kan båda använda TOGAF och ändå ha helt olika arkitekturer.

Organisationer skiljer sig åt i storlek, governance, regelverk, arkitekturmognad, kultur, affärsmodell och förändringsbehov. Ett ramverk ger vägledning, men organisationen måste anpassa arkitekturpraktiken till sina förhållanden.

### TOGAF och Zachman

Zachman ger i första hand en ontology och en klassificeringsstruktur för att organisera arkitekturbeskrivningar. Den hjälper till att besvara vilka slags beskrivningar som behövs. TOGAF ger vägledning och en metod för arkitekturutveckling, särskilt genom ADM, alltså ett strukturerat tillvägagångssätt för att utveckla och förvalta arkitektur. Ramverken svarar på olika frågor och kan därför komplettera varandra: Zachman kan hjälpa till att se om viktiga beskrivningar eller perspektiv saknas medan arkitekturen tas fram med ADM.`,
      en: `## Core message

The TOGAF Standard provides a body of guidance and an approach for Enterprise Architecture. The Architecture Development Method (ADM) provides an iterative approach to developing and managing architecture.

A simplified view includes:

- Preliminary
- Architecture Vision
- Business Architecture
- Information Systems Architectures
- Technology Architecture
- Opportunities and Solutions
- Migration Planning
- Implementation Governance
- Architecture Change Management

The ADM should NOT be treated as a simplistic linear waterfall process.`,
    },
    { kind: "text", id: "m5-t4", sv: "## Flervalsfrågor", en: "## Question -Multiple choice" },
    {
      kind: "fraga",
      id: "ea-m5-1",
      nr: "1",
      question: "Vad är det huvudsakliga syftet med ADM?",
      options: [
        "Mjukvaruutveckling",
        "Utveckling och vidareutveckling av Enterprise Architecture",
        "Leverantörshantering",
        "Ekonomisk planering",
        "Nätverksadministration",
      ],
      explanation:
        "ADM tillhandahåller ett iterativt tillvägagångssätt för att utveckla och förvalta arkitektur. Den hjälper arkitekter att gå från arkitekturvisionen via domänarkitekturer, möjligheter och migrering till Implementation Governance.",
    },
    {
      kind: "text",
      id: "m5-t5",
      sv: `Den här frågan är också relevant. Det är samma fråga med andra svarsalternativ:`,
      en: "Men också denna är relevant (samma fråga olika svarsalternativ):",
    },
    {
      kind: "fraga",
      id: "ea-m5-1b",
      nr: null,
      question: "Vad är det huvudsakliga syftet med TOGAF:s ADM?",
      options: [
        "Mjukvarukodning",
        "Projektbudgetering",
        "Att utveckla och vidareutveckla Enterprise Architecture",
        "Att välja leverantörer",
        "Att leda anställda",
      ],
      explanation:
        "ADM är ett strukturerat tillvägagångssätt för att utveckla, kommunicera, styra och vidareutveckla Enterprise Architecture. Kodning, budgetering och leverantörsval är inte dess syfte.",
    },
    {
      kind: "fraga",
      id: "ea-m5-2",
      nr: "2",
      question: "Vad är ett viktigt kännetecken för ADM?",
      options: [
        "Den måste alltid genomföras en gång från början till slut.",
        "Den stödjer iteration och anpassning.",
        "Den eliminerar governance.",
        "Den gäller endast teknik.",
        "Den ersätter strategin.",
      ],
      explanation:
        "ADM är ett iterativt tillvägagångssätt och ska inte behandlas som en alltför enkel linjär vattenfallsprocess. Arkitekturarbetet behöver kunna itereras och anpassas när förutsättningarna förändras.",
    },
    {
      kind: "fraga",
      id: "ea-m5-3",
      nr: "3",
      question: "Vad är Architecture Vision avsedd att åstadkomma?",
      options: [
        "Att specificera varje implementeringsdetalj",
        "Att skapa en gemensam övergripande bild av den önskade arkitektoniska riktningen och säkra lämpligt engagemang från stakeholders",
        "Att ersätta Business Architecture",
        "Att definiera källkod",
        "Att välja en databas",
      ],
      explanation:
        "Architecture Vision ska besvara vad vi försöker uppnå, varför det spelar roll och vilken den arkitektoniska riktningen är; typiska frågor gäller stakeholders, avgränsning och mål. Implementeringsdetaljer, källkod och databasval hör inte dit.",
    },
    {
      kind: "fraga",
      id: "ea-m5-4",
      nr: "4",
      question: "Varför bör ADM inte tolkas som ett stelt vattenfall?",
      options: [
        "Arkitektur förändras aldrig.",
        "Arkitekturarbete är iterativt och svarar på förändrade krav, lärande och omständigheter.",
        "ADM innehåller inga faser.",
        "TOGAF förbjuder planering.",
        "Governance är onödigt.",
      ],
      explanation:
        "ADM är ett iterativt tillvägagångssätt för att utveckla och förvalta arkitektur. Arkitekturarbetet kan behöva itereras när krav och omständigheter förändras, så faserna behöver inte följas en gång i fast ordning.",
    },
    {
      kind: "fraga",
      id: "ea-m5-5",
      nr: "5",
      question: "Vilket påstående är mest korrekt?",
      options: [
        "TOGAF definierar exakt den arkitektur som varje organisation bör införa.",
        "TOGAF tar bort behovet av arkitektoniskt omdöme.",
        "Organisationer anpassar arkitekturpraktiken till sitt eget sammanhang.",
        "ADM är en livscykel för mjukvaruutveckling.",
        "TOGAF är endast till för myndigheter.",
      ],
      explanation:
        "Ett ramverk ger vägledning, men organisationen måste anpassa arkitekturpraktiken efter sina förhållanden. Organisationer skiljer sig i storlek, governance, regelverk, arkitekturmognad, kultur och affärsmodell.",
    },
    { kind: "text", id: "m5-t6", sv: "## Sant/falskt-frågor", en: "## True or False questions" },
    {
      kind: "fraga",
      id: "ea-m5-6",
      nr: "6",
      question: "ADM bör alltid tolkas som en stel vattenfallssekvens.",
      explanation:
        "ADM är ett iterativt tillvägagångssätt och ska inte behandlas som en alltför enkel linjär vattenfallsprocess.",
    },
    {
      kind: "fraga",
      id: "ea-m5-7",
      nr: "7",
      question: "ADM bör behandlas som en helt stel sekvens.",
      explanation:
        "ADM stödjer iteration och anpassning, och arkitekturarbetet kan behöva itereras när omständigheterna förändras.",
    },
    {
      kind: "fraga",
      id: "ea-m5-8",
      nr: "8",
      question: "Arkitekturarbete kan behöva itereras eftersom omständigheterna förändras.",
      explanation:
        "Arkitekturarbete är iterativt och svarar på förändrade krav, lärande och omständigheter. Därför stödjer ADM iteration och anpassning.",
    },
    {
      kind: "fraga",
      id: "ea-m5-9",
      nr: "9",
      question: "TOGAF i sig är en organisations target architecture.",
      explanation:
        "TOGAF är en samlad vägledning och ett tillvägagångssätt för Enterprise Architecture. Modulen skiljer mellan ramverkets vägledning och organisationens faktiska arkitektur, som organisationen själv måste ta fram.",
    },
    { kind: "text", id: "m5-t7", sv: "## Kortsvarsfråga", en: "## Short-answer question" },
    {
      kind: "fritext",
      id: "ea-e5-10",
      typ: "kortsvar",
      nr: "10",
      question: "Varför måste en organisation anpassa sin användning av TOGAF till sitt eget sammanhang?",
      modelAnswer:
        "Organisationer skiljer sig åt i storlek, governance, regelverk, arkitekturmognad, kultur, affärsmodell och förändringsbehov. Ett ramverk ger vägledning, men organisationen måste anpassa arkitekturpraktiken till sina förhållanden.",
    },
    { kind: "text", id: "m5-t8", sv: "## Essäfråga", en: "## Essay question" },
    {
      kind: "fritext",
      id: "ea-e5-11",
      typ: "essa",
      nr: "11",
      question: "Förklara ADM:s roll i Enterprise Architecture.",
      modelAnswer:
        "ADM tillhandahåller ett strukturerat tillvägagångssätt för att utveckla, kommunicera, styra och vidareutveckla Enterprise Architecture. Den hjälper arkitekter att gå från förståelsen av arkitekturvisionen via domänarkitektur, möjligheter, migrering och implementation governance, och tillåter samtidigt iteration och anpassning.",
    },
    {
      kind: "fritext",
      id: "ea-e5-12",
      typ: "essa",
      nr: "12",
      question: "Jämför Zachman och TOGAF. Vad skiljer dem åt?",
      modelAnswer:
        "Zachman tillhandahåller i första hand en ontology och en klassificeringsstruktur för att organisera arkitekturbeskrivningar. TOGAF tillhandahåller vägledning och en metod för arkitekturutveckling, särskilt genom ADM. Zachman hjälper till att besvara vilka slags beskrivningar som behövs, medan TOGAF tillhandahåller ett strukturerat tillvägagångssätt för att utveckla och förvalta arkitektur.",
    },
  ],
};
