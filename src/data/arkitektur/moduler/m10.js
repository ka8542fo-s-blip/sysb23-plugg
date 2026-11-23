// Modul 10 i fliken Moduler (modul-9-12.pdf), översatt. Se m01.js för formen.
// Modellsvaret till fråga 9 slutar med en avbruten mening i PDF:en; den
// svenska versionen fullbordar den (se kommentaren vid svaret).
export default {
  id: "kap10",
  number: 10,
  title: { sv: "Digital transformation", en: "Digital Transformation" },
  blocks: [
    {
      kind: "text",
      id: "m10-t1",
      sv: `## Lärandemål

Efter den här modulen ska du kunna skilja mellan:

- digitization
- digitalization
- digital transformation
- digitala affärsmodeller
- digitala ekosystem.`,
      en: `## Learning objectives

Students should be able to distinguish between:

- Digitization
- Digitalization
- Digital transformation
- Digital business models
- Digital ecosystems`,
    },
    {
      kind: "text",
      id: "m10-t2",
      sv: `## Kärnförklaring

**Digitization** – att omvandla analog information till digital form, till exempel att skanna pappersdokument.

**Digitalization** – att använda digitala tekniker för att förbättra befintliga aktiviteter och processer, till exempel att automatisera ett befintligt godkännandeflöde.

**Digital transformation** – att använda digitala capabilities för att i grunden förändra hur en enterprise skapar, levererar och fångar värde (tjänster).

Digital transformation är alltså bredare än de två andra. Den kan förändra affärsmodeller, kundupplevelser och operating modeln. Den kan påverka affärsmodeller, capabilities, value streams, organisationsstrukturer, information, applikationer och teknik. Ofta innebär den att capabilities förändras eller att nya skapas. Den kan också ge nya digitala affärsmodeller och digitala ekosystem, som sträcker sig utanför organisationens gränser och kan omfatta partner, plattformar och kunder. Eftersom dessa förändringar hänger ihop kräver de ett arkitektoniskt perspektiv över hela enterprisen snarare än ett isolerat teknikinitiativ. Därför är digital transformation en concern för Enterprise Architecture.

### Teknik är en enabler

Teknik ensam utgör inte transformation. Digital transformation är inte i grunden en teknikfråga, utan handlar om hur enterprisen skapar, levererar och fångar värde. Tekniken är en viktig enabler, alltså något som gör förändringen möjlig, men den är inte transformationen själv.

Att flytta teknik förändrar inte nödvändigtvis hur enterprisen skapar eller levererar värde. En molnmigrering är därför inte automatiskt digital transformation. Om någon säger att transformationen är lyckad för att allt har flyttats till molnet bör arkitekten fråga vilka affärsresultat, capabilities eller värdeerbjudanden som har förändrats. På samma sätt bör arkitekten fråga om en ny mobilapp har förändrat hur enterprisen skapar och levererar värde. Att bara lägga till en digital kanal kan vara digitalization snarare än bredare digital transformation.

Digital transformation kräver inte nödvändigtvis ny teknik. Artificiell intelligens kan vara en enabler i vissa fall, men den krävs inte för varje digital transformation.

Ett initiativ för digital transformation bör drivas av ett tydligt förstått affärsresultat och strategiskt mål, inte av teknikmode eller leverantörers marknadsföring. Capability-baserad analys hjälper då organisationen att prioritera investeringar efter affärsvärde snarare än att bara välja tekniker.`,
      en: `## Core explanation

**Digitization** - Converting analog information into digital form.

**Digitalization** - Using digital technologies to improve existing activities and processes.

**Digital transformation** - Using digital capabilities to fundamentally change how an enterprise creates, delivers and captures value (services).

Technology alone does not constitute transformation.`,
    },
    { kind: "text", id: "m10-t3", sv: "## Flervalsfrågor", en: "## Questions - Multiple choice" },
    {
      kind: "fraga",
      id: "ea-m10-1",
      nr: "1",
      question: "Att skanna ett pappersdokument till PDF är i första hand ett exempel på:",
      options: ["Digital transformation", "Digitization", "Affärsmodellinnovation", "Enterprise Architecture", "Transformation av ekosystem"],
      explanation:
        "Digitization betyder att analog information omvandlas till digital form, och att skanna ett pappersdokument till PDF är just det. Affärsmodellen kan förbli oförändrad, så det är inte i sig digital transformation.",
    },
    {
      kind: "fraga",
      id: "ea-m10-2",
      nr: "2",
      question: "Att automatisera en befintlig process med mjukvara förknippas närmast med:",
      options: ["Digitalization", "Pappershantering", "Organisationsarkitektur", "Zachman", "Governance"],
      explanation:
        "Digitalization innebär att digitala tekniker används för att förbättra befintliga aktiviteter och processer. Att automatisera en process som redan finns är ett sådant exempel.",
    },
    {
      kind: "fraga",
      id: "ea-m10-3",
      nr: "3",
      question: "Vad illustrerar bäst digital transformation?",
      options: [
        "Att köpa bärbara datorer",
        "Att skanna dokument",
        "Att flytta en server till ett annat rum",
        "Att i grunden förändra en affärsmodell och kundupplevelse genom digitala capabilities",
        "Att installera en skrivare",
      ],
      explanation:
        "Digital transformation innebär att digitala capabilities används för att i grunden förändra hur en enterprise skapar, levererar och fångar värde. Att skanna dokument är digitization, och de andra alternativen är enskilda teknikåtgärder.",
    },
    {
      kind: "fraga",
      id: "ea-m10-4",
      nr: "4",
      question: "Varför är molnmigrering inte automatiskt digital transformation?",
      options: [
        "Molnteknik är inte digital.",
        "Att flytta teknik förändrar inte nödvändigtvis hur enterprisen skapar eller levererar värde.",
        "Molnet kan inte stödja transformation.",
        "Molnet används endast av IT.",
        "Transformation kräver artificiell intelligens.",
      ],
      explanation:
        "Teknik ensam utgör inte transformation. Molnet kan vara en viktig enabler, men att flytta systemen ändrar inte i sig hur enterprisen skapar eller levererar värde.",
    },
    {
      kind: "fraga",
      id: "ea-m10-5",
      nr: "5",
      question: "Vad bör driva ett initiativ för digital transformation?",
      options: [
        "Teknikmode",
        "Ett tydligt förstått affärsresultat och strategiskt mål",
        "Leverantörers marknadsföring",
        "Att en ny databas finns tillgänglig",
        "Arkitekturverktyget",
      ],
      explanation:
        "Teknik ensam utgör inte transformation, så initiativet bör utgå från vilket affärsresultat och vilket strategiskt mål som ska nås. Teknikmode, marknadsföring eller en ny databas säger inget om vilket värde som ska skapas.",
    },
    { kind: "text", id: "m10-t4", sv: "## Sant eller falskt", en: "## True or False" },
    {
      kind: "fraga",
      id: "ea-m10-6",
      nr: "6",
      question: "Digital transformation är i grunden en teknikfråga.",
      explanation:
        "Digital transformation gäller hur en enterprise skapar, levererar och fångar värde, och teknik ensam utgör inte transformation. Tekniken är en enabler, inte själva transformationen.",
    },
    {
      kind: "fraga",
      id: "ea-m10-7",
      nr: "7",
      question: "Digital transformation kan förändra affärsmodeller och kundupplevelser.",
      explanation:
        "Digital transformation innebär att digitala capabilities används för att i grunden förändra hur en enterprise skapar, levererar och fångar värde. Det kan påverka både affärsmodeller och kundupplevelser.",
    },
    {
      kind: "fraga",
      id: "ea-m10-8",
      nr: "8",
      question: "Artificiell intelligens krävs för varje digital transformation.",
      explanation:
        "AI kan vara en enabler i vissa sammanhang men är inget krav. Transformationen avgörs av hur enterprisen förändrar sitt sätt att skapa och leverera värde, inte av en viss teknik.",
    },
    { kind: "text", id: "m10-t5", sv: "## Essäfrågor", en: "## Essay questions" },
    // Modellsvaret slutar med ett avbrutet fragment redan i lärarens PDF
    // ("Because these change."). Den svenska versionen fullbordar det med
    // lärarens egen mening ur nästa svar, ea-e10-10 (Kaspers beslut 23 nov);
    // engelskan i essays.js står kvar som i PDF:en.
    {
      kind: "fritext",
      id: "ea-e10-9",
      typ: "essa",
      nr: "9",
      question: "Förklara skillnaden mellan digitization, digitalization och digital transformation.",
      modelAnswer:
        "Digitization omvandlar analog information till digital form. Digitalization använder digital teknik för att förbättra befintliga processer eller aktiviteter. Digital transformation är bredare och innebär grundläggande förändringar i hur enterprisen skapar och levererar värde. Transformation kan påverka affärsmodeller, capabilities, value streams, organisationsstrukturer, information, applikationer och teknik. Eftersom dessa förändringar hänger ihop kräver de ett arkitektoniskt perspektiv över hela enterprisen snarare än ett isolerat teknikinitiativ.",
    },
    {
      kind: "fritext",
      id: "ea-e10-10",
      typ: "essa",
      nr: "10",
      question: "Varför bör digital transformation behandlas som en concern för Enterprise Architecture?",
      modelAnswer:
        "Digital transformation kan påverka affärsmodeller, capabilities, value streams, organisationsstrukturer, information, applikationer och teknik. Eftersom dessa förändringar hänger ihop kräver de ett arkitektoniskt perspektiv över hela enterprisen snarare än ett isolerat teknikinitiativ.",
    },
  ],
};
