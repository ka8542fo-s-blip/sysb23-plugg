// Modul 10 i fliken Moduler (modul-9-12.pdf), översatt. Se m01.js för formen.
// Modellsvaret till fråga 9 slutar med en avbruten mening i PDF:en och är
// översatt som det står.
export default {
  id: "kap10",
  number: 10,
  title: { sv: "Digital transformation", en: "Digital Transformation" },
  blocks: [
    {
      kind: "text",
      id: "m10-t1",
      sv: `## Lärandemål

Studenterna ska kunna skilja mellan:

- Digitization
- Digitalization
- Digital transformation
- Digitala affärsmodeller
- Digitala ekosystem`,
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

**Digitization** – Att omvandla analog information till digital form.

**Digitalization** – Att använda digitala tekniker för att förbättra befintliga aktiviteter och processer.

**Digital transformation** – Att använda digitala capabilities för att i grunden förändra hur en enterprise skapar, levererar och fångar värde (tjänster).

Teknik ensam utgör inte transformation.`,
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
    {
      kind: "fritext",
      id: "ea-e10-9",
      typ: "essa",
      nr: "9",
      question: "Förklara skillnaden mellan digitization, digitalization och digital transformation.",
      modelAnswer:
        "Digitization omvandlar analog information till digital form. Digitalization använder digital teknik för att förbättra befintliga processer eller aktiviteter. Digital transformation är bredare och innebär grundläggande förändringar i hur enterprisen skapar och levererar värde. Transformation kan påverka affärsmodeller, capabilities, value streams, organisationsstrukturer, information, applikationer och teknik. Eftersom dessa förändras.",
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
