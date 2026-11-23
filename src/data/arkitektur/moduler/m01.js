// Modul 1 i fliken Moduler: lärarens text och frågor i PDF:ens ordning
// (modul-1-4.pdf), översatt till svenska. Frågornas och modellsvarens
// engelska original och facit hämtas ur questions.js och essays.js
// (modulerView.js); textblocken har sitt original i `en`.
//
// Exemplen i inledningen: flervalsexemplet är en egen fråga (ea-m1-ex).
// Sant/falskt-exemplet och kortsvarsexemplet är samma frågor som fråga 6 och
// 9 och står därför som lärarens exempel med svaret utskrivet (planen).

// Lärarens inledning till hela materialet, överst i fliken Moduler.
export const INLEDNING = {
  sv: `Jag har skapat 12 moduler med studiematerial, uppdelade i tre delar. De kommer i viss mån att följa de tre föreläsningarna enligt nedan. Eftersom kursen är mycket liten i ECTS-poäng och det finns mycket material att ta till sig föreslår jag att ni betraktar kursen som krävande.

Kursens storlek bidrog också till att jag bestämde mig för att ge svaren på de flesta frågor. Tanken är att ni studerar alla frågor och försöker lära er frågorna brett, men också att förstå svaren på dem.

I kapitel 12 finns en genomgång av vad ni ska förstå och kunna förklara själva, tillsammans med mer djupgående fallfrågor. Börja alltså med att analysera det som sägs inom föreläsning 3 modul 3 (i kapitel 12). Börja sedan med föreläsning 1, modul 1–4 (enligt nedan), och så vidare.

**Föreläsning 1 — Grunderna i Enterprise Architecture**

Självstudiematerial – modul 1–4

1. Vad är en enterprise?
2. Vad är arkitektur?
3. Vad är Enterprise Architecture?
4. Zachman — ontology- och klassificeringsperspektivet

**Föreläsning 2 — Arkitekturutveckling med TOGAF**

Självstudiematerial – modul 5–8

5. TOGAF och ADM
6. Arkitekturdomäner och views
7. Capabilities, value streams och Business Architecture
8. Principer, governance och arkitekturbeslut

**Föreläsning 3 — Enterprise Agility och digital transformation**

Självstudiematerial – modul 9–12

9. Arkitektur och Agile
10. Digital transformation
11. Arkitektur i praktiken — fallstudie
12. Integration, bedömning och slutlig genomgång`,
  en: `I have created 12 modules of student study material split in three parts. Those will somewhat follow the three lectures as seen below. Since the course is very small in ECTS-points and there is a lot of material to consider, I propose that you perceive this course as a demanding one.

The size of the course also helped me to decide to provide the answers to most questions. The idea is that you study all questions and try to learn the questions broadly, but also to understand the answer for those.

In chapter 12 there is a presentation of what to understand and be able to explain yourself together with more deep case-questions. So, start by analyze what is said within lecture 3 Modul 3 (in chapter 12). Then start with lecture 1 modules 1-4 (as seen below) and so on.

**Lecture 1 — Foundations of Enterprise Architecture**

Self study material - Modules 1–4

1. What is an Enterprise?
2. What is Architecture?
3. What is Enterprise Architecture?
4. Zachman — the ontology and classification perspective

**Lecture 2 — Architecture Development with TOGAF**

Self study material - Modules 5–8

5. TOGAF and the ADM
6. Architecture Domains and Views
7. Capabilities, Value Streams and Business Architecture
8. Principles, Governance and Architecture Decisions

**Lecture 3 — Enterprise Agility and Digital Transformation**

Self study material - Modules 9–12

9. Architecture and Agile
10. Digital Transformation
11. Architecture in Practice — Case Study
12. Integration, Assessment and Final Review`,
};

export default {
  id: "kap1",
  number: 1,
  title: { sv: "Vad är en enterprise?", en: "What Is an Enterprise?" },
  blocks: [
    {
      kind: "text",
      id: "m1-t1",
      sv: "**Föreläsning 1 — Grunder**",
      en: "**Lecture 1 — Foundations**",
    },
    {
      kind: "text",
      id: "m1-t2",
      sv: `## Lärandemål

Efter den här modulen ska studenterna kunna:

- Definiera en enterprise.
- Förklara varför en enterprise är mer än en organisation.
- Identifiera gränserna och stakeholders för en enterprise.
- Förklara varför förståelsen av enterprisen är grundläggande för Enterprise Architecture.`,
      en: `## Learning objectives

By the end of this module, students should be able to:

- Define an enterprise.
- Explain why an enterprise is more than an organization.
- Identify the boundaries and stakeholders of an enterprise.
- Explain why understanding the enterprise is fundamental to Enterprise Architecture.`,
    },
    {
      kind: "text",
      id: "m1-t3",
      sv: `## Kärnbudskap

En enterprise är vilken samling som helst av organisationer, organisatoriska enheter eller capabilities som har en gemensam uppsättning mål.

Den kan därför vara:

- Ett företag
- En myndighet
- Ett universitet
- En kommun
- En grupp samverkande organisationer
- Ett ekosystem i en leveranskedja

Det viktiga är att arkitekten måste förstå den enterprise som arkitekturen utformas för, i stället för att automatiskt anta att enterprisen är den juridiska organisationen.`,
      en: `## Core teaching message

An enterprise is any collection of organizations, organizational units, or capabilities that has a common set of goals.

It can therefore be:

- A corporation
- A government agency
- A university
- A municipality
- A group of collaborating organizations
- A supply-chain ecosystem

The key point is that the architect must understand the enterprise that is being architected, rather than automatically assuming that the enterprise is the legal organization.`,
    },
    {
      kind: "text",
      id: "m1-t4",
      sv: `## Lärarens förklaring

"Om Volvo, en Volvohandlare, en logistikleverantör och en bank samarbetar för att förse en kund med en bil, vilka av dem hör till den enterprise vi försöker förstå?"

Det finns inte nödvändigtvis ett enda rätt svar. Det beror på arkitekturens avgränsning och syfte.

Arkitekturens avgränsning bestäms av det problem vi försöker lösa.

Detta inför en viktig princip för hur alla moduler är uppbyggda:

Först förklarar och i viss mån motiverar jag varje modul. Därefter har jag flervalsfrågor, sedan sant eller falskt, sedan korta essäfrågor följda av lite djupare essäfrågor i var och en av modulerna. Ibland har jag förklaringar, men oftast inte till flervals- och sant/falskt-frågorna (det skulle bli för mycket att läsa för er).

Exempel:

**Flerval –**`,
      en: `## Lecturer explanation

"If Volvo, a Volvo dealership, a logistics provider and a bank collaborate to provide a customer with a car, which of them belongs to the enterprise we are trying to understand?"

There isn't necessarily one correct answer. It depends on the scope and purpose of the architecture.

Architecture scope is determined by the problem we are trying to solve.

This introduces an important principle for how all modules are structured:

First, I explain and somewhat motivate every module. Secondly, I have multiple choice questions, then true or false, then short essay questions followed by little deeper essay questions in each of every module. Sometimes I have explanations but mostly not to the multiple choice and true or false questions (it would be too much to read for you).

Examples:

**Multiple choice –**`,
    },
    {
      kind: "fraga",
      id: "ea-m1-ex",
      nr: null,
      question: "Vilket är det VIKTIGASTE skälet till att definiera enterprisens avgränsning?",
      options: [
        "Att bestämma vilket programmeringsspråk som ska användas",
        "Att fastställa vilka delar av organisationen och ekosystemet som är relevanta för arkitekturproblemet",
        "Att bestämma hur många arkitekter som behövs",
        "Att definiera databasstrukturen",
        "Att välja molnleverantör",
      ],
      explanation:
        "Avgränsningen talar om vilka delar av organisationen och ekosystemet som hör till arkitekturproblemet. Modulen säger att arkitekturens avgränsning bestäms av det problem vi försöker lösa.",
    },
    // Lärarens två exempel här är samma frågor som fråga 6 och fråga 9
    // nedan (Kaspers beslut 23 nov): de ritas som riktiga frågekort med
    // samma id och status, så att facit inte syns innan man svarat.
    // `kalla` är exemplet som det står i PDF:en; det visas aldrig, men
    // moduler.test.mjs kontrollerar att det är samma fråga och samma facit.
    {
      kind: "upprepning",
      id: "m1-ex-sf",
      av: "ea-m1-6",
      kalla: {
        sv: `**Sant eller falskt:** En enterprise måste vara en enda juridisk organisation.

Svar: FALSKT`,
        en: `**True or False:** An enterprise must be a single legal organization.

Answer: FALSE`,
      },
    },
    {
      kind: "upprepning",
      id: "m1-ex-essa",
      av: "ea-e1-9",
      kalla: {
        sv: `**Kort essä**

Varför kan det vara svårt att definiera enterprisens gräns i ett digitalt ekosystem?

Modellsvar:

Digitala tjänster är ofta beroende av partner, leverantörer, plattformar, tillsynsmyndigheter och kunder. Följaktligen kan de capabilities som krävs för att leverera ett affärsresultat sträcka sig utanför en organisations juridiska gränser. Arkitekturens avgränsning behöver därför definieras utifrån syftet med och målen för arkitekturarbetet.`,
        en: `**Short essay**

Why can defining the enterprise boundary be difficult in a digital ecosystem?

Model answer:

Digital services often depend on partners, suppliers, platforms, regulators and customers. Consequently, the capabilities required to deliver a business outcome may extend beyond the legal boundaries of one organization. The architecture scope therefore needs to be defined according to the purpose and objectives of the architecture effort.`,
      },
    },
    { kind: "text", id: "m1-ex-slut", sv: "Så, då börjar det ☺", en: "So, it starts ☺" },
    { kind: "text", id: "m1-t5", sv: "## Flervalsfrågor modul 1", en: "## Multiple choice Module 1" },
    {
      kind: "fraga",
      id: "ea-m1-1",
      nr: "1",
      question: "Vilket påstående beskriver bäst en enterprise?",
      options: [
        "Ett företag med fler än 1 000 anställda",
        "En IT-avdelning",
        "En samling organisationer eller organisatoriska enheter med en gemensam uppsättning mål",
        "Endast en juridisk enhet",
        "Ett mjukvarusystem",
      ],
      explanation:
        "Enterprise Architecture kan gälla ett företag, en offentlig organisation, ett ekosystem, ett partnerskap eller någon annan samling enheter med gemensamma mål.",
    },
    {
      kind: "fraga",
      id: "ea-m1-2",
      nr: "2",
      question: "Varför är det viktigt att definiera en enterprises avgränsning?",
      options: [
        "Det avgör vilket programmeringsspråk som ska användas.",
        "Det fastställer vilka delar av enterprisen och dess omgivning som är relevanta för arkitekturproblemet.",
        "Det avgör projektets budget.",
        "Det avgör vilket arkitekturverktyg som används.",
        "Det eliminerar stakeholders.",
      ],
      explanation:
        "Avgränsningen talar om vilka delar av enterprisen och dess omgivning som hör till arkitekturproblemet. Modulen säger att arkitekturens avgränsning bestäms av det problem vi försöker lösa.",
    },
    {
      kind: "fraga",
      id: "ea-m1-3",
      nr: "3",
      question: "Vilket är det starkaste skälet till att en enterprise kan sträcka sig utanför en juridisk organisation?",
      options: [
        "Organisationer delar alltid samma IT-system.",
        "Affärsresultat kan bero på partner, leverantörer, tillsynsmyndigheter och andra externa aktörer.",
        "Juridiska enheter kan inte ha någon arkitektur.",
        "Teknik skapar automatiskt en enterprise.",
        "Enterprise Architecture gäller endast ekosystem.",
      ],
      explanation:
        "En enterprise definieras av gemensamma mål, inte nödvändigtvis av juridiskt ägande. När ett affärsresultat beror på partner, leverantörer och andra externa aktörer kan enterprisen sträcka sig utanför den egna juridiska organisationen, som i Volvoexemplet.",
    },
    {
      kind: "fraga",
      id: "ea-m1-4",
      nr: "4",
      question: "Vilken fråga bör en arkitekt ställa när avgränsningen definieras?",
      options: [
        "Vilken teknik är billigast?",
        "Vilken organisation har störst budget?",
        "Vilka delar av omgivningen är relevanta för att nå de arkitektoniska målen?",
        "Vilken applikation bör ersättas först?",
        "Vilken leverantör bör väljas?",
      ],
      explanation:
        "Avgränsningen bestäms av det problem arkitekturen ska lösa, så arkitekten behöver veta vilka delar av omgivningen som spelar roll för målen.",
    },
    {
      kind: "fraga",
      id: "ea-m1-5",
      nr: "5",
      question: "Vilket påstående är mest korrekt?",
      options: [
        "Gränserna för en enterprise är alltid fasta.",
        "Gränserna för en enterprise är alltid identiska med organisationens gränser.",
        "Gränserna för en enterprise beror delvis på syftet med och avgränsningen av arkitekturarbetet.",
        "Gränserna för en enterprise bestäms av CIO:n.",
        "Gränserna för en enterprise bestäms av arkitekturverktyget.",
      ],
      explanation:
        "Det finns inte nödvändigtvis ett enda rätt svar på var gränsen går; det beror på arkitekturens avgränsning och syfte. Därför är gränserna inte alltid fasta och inte alltid desamma som organisationens.",
    },
    { kind: "text", id: "m1-t6", sv: "## Sant eller falskt", en: "## True or False" },
    {
      kind: "fraga",
      id: "ea-m1-6",
      nr: "6",
      question: "En enterprise måste vara en enda juridisk organisation.",
      explanation:
        "En enterprise är vilken samling som helst av organisationer, organisatoriska enheter eller capabilities med gemensamma mål. Den kan vara en grupp samverkande organisationer eller ett ekosystem i en leveranskedja.",
    },
    {
      kind: "fraga",
      id: "ea-m1-7",
      nr: "7",
      question: "Enterprise Architecture kan omfatta relationer med externa partner och ekosystem.",
      explanation:
        "Affärsresultat kan bero på partner, leverantörer, tillsynsmyndigheter och andra externa aktörer. Därför kan relationerna till dem höra till det arkitekturen måste förstå.",
    },
    {
      kind: "fraga",
      id: "ea-m1-8",
      nr: "8",
      question: "Att definiera arkitekturens avgränsning är i sig en arkitektonisk concern.",
      explanation:
        "Avgränsningen avgör vilka delar av enterprisen och dess omgivning arkitekturen tar med, och den styrs av problemet som ska lösas. Att dra den gränsen är därför en del av arkitekturarbetet.",
    },
    { kind: "text", id: "m1-t7", sv: "## Kortsvarsfråga", en: "## Short-answer question" },
    {
      kind: "fritext",
      id: "ea-e1-9",
      typ: "kortsvar",
      nr: "9",
      question: "Varför kan det vara svårt att definiera enterprisens gräns i ett digitalt ekosystem?",
      modelAnswer:
        "Digitala produkter och tjänster är ofta beroende av organisationer utanför den juridiska enterprisen. Kunder, leverantörer, tillsynsmyndigheter, plattformar och teknikleverantörer kan alla bidra till ett affärsresultat. Arkitekten behöver därför avgöra vilka externa relationer som är relevanta för det arkitektoniska målet.",
      extraModelAnswers: [
        "Digitala tjänster är ofta beroende av partner, leverantörer, plattformar, tillsynsmyndigheter och kunder. Följaktligen kan de capabilities som krävs för att leverera ett affärsresultat sträcka sig utanför en organisations juridiska gränser. Arkitekturens avgränsning behöver därför definieras utifrån syftet med och målen för arkitekturarbetet.",
      ],
    },
    { kind: "text", id: "m1-t8", sv: "## Essäfråga", en: "## Essay question" },
    {
      kind: "fritext",
      id: "ea-e1-10",
      typ: "essa",
      nr: "10",
      question: "Förklara varför begreppet \"enterprise\" är viktigare för Enterprise Architecture än begreppet \"företag\".",
      modelAnswer:
        "Enterprise Architecture handlar om en enterprises struktur och utveckling i förhållande till dess mål. En enterprise kan sträcka sig utanför ett juridiskt företags gränser när affärsresultat beror på andra organisationer eller aktörer. Att endast fokusera på företaget kan därför ge en ofullständig bild av arkitekturen. Arkitekten måste fastställa den relevanta avgränsningen utifrån verksamhetsproblemet och det önskade resultatet.",
    },
  ],
};
