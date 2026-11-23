// Modul 12 i fliken Moduler (modul-9-12.pdf), översatt. Se m01.js för formen.
// Läraren säger i inledningen att man ska börja här; i Moduler står modulen
// ändå sist, i dokumentens ordning.
//
// Som i PDF:en: fråga 3 är avbruten efter alternativ C och saknar svar
// (facit C, se questions.js). Jämförelsetabellen "Zachman or TOGAF?" är sex
// tvåvalsfrågor (ea-m12-34a–f). Modellsvaret till Essay 3 har inklistrad
// text i PDF:en; den svenska versionen är utan dubbletterna (se kommentaren
// vid svaret).
const tabellrad = (id, rad, explanation) => ({
  kind: "fraga",
  id,
  nr: null,
  rad,
  question: `Zachman eller TOGAF? Ange vilket som passar bäst: "${rad}"`,
  explanation,
});

export default {
  id: "kap12",
  number: 12,
  title: {
    sv: "Integration och förberedelse inför examinationen",
    en: "Integration and Examination Preparation",
  },
  blocks: [
    {
      kind: "text",
      id: "m12-t1",
      sv: `Den här modulen är medvetet annorlunda. Den ber dig att integrera begrepp från de tidigare elva modulerna.`,
      en: "This module is deliberately different. It asks students to integrate concepts from the previous eleven modules.",
    },
    {
      kind: "text",
      id: "m12-t2",
      sv: `## Helheten

En arkitektur ger ett sätt att förstå:

- vad som finns,
- varför det finns,
- hur saker hänger ihop,
- vad som behöver förändras,
- vilka konsekvenser förändringen kommer att få,
- och hur förändringen kan styras.`,
      en: `## The big picture

An architecture provides a way of understanding:

- what exists,
- why it exists,
- how things relate,
- what needs to change,
- what consequences change will have,
- and how change can be governed.`,
    },
    {
      kind: "text",
      id: "m12-t3",
      sv: `## De tio begrepp som du absolut bör kunna

Innan du ger dig på frågorna bör du kunna förklara de här tio begreppen utan att slå upp dem.

1. **Enterprise** — En enterprise är en samling organisationer, organisatoriska enheter eller capabilities med en gemensam uppsättning mål. Den behöver inte vara en enda juridisk organisation, och gränsen beror delvis på arkitekturens syfte och avgränsning.
2. **Arkitektur** — Arkitektur beskriver den grundläggande organisationen av något, inklusive dess komponenter, relationer, principer och begränsningar. Ett diagram är en representation av arkitekturen, inte arkitekturen själv.
3. **Enterprise Architecture** — Enterprise Architecture behandlar enterprisens struktur och utveckling i förhållande till dess mål. Den har en bredare avgränsning än IT architecture och kopplar strategi till förändring.
4. **Business capability** — En capability beskriver vad en organisation kan göra. Hur arbetet utförs beskriver i stället en process.
5. **Value stream** — En value stream beskriver hur värde skapas och levereras till en stakeholder, till exempel Upptäcka → Ansöka → Verifiera → Godkänna → Slutföra i bolånebankens exempel.
6. **Architecture principle** — En princip, till exempel "Information är en tillgång för hela enterprisen", ger varaktig vägledning för arkitektoniska beslut och kan fungera som en guardrail.
7. **Governance** — Governance fastställer decision rights, ansvarsskyldighet, riktning och kontroll. God governance kräver inte att varje beslut godkänns centralt.
8. **Zachman** — Zachman ger en ontology och ett klassificeringsschema för att organisera beskrivningar av en enterprise. Ramverket är ingen metodik och föreskriver ingen ordning att arbeta i.
9. **TOGAF** — TOGAF ger vägledning och ett tillvägagångssätt för att utveckla och styra Enterprise Architecture, inklusive ADM. ADM är iterativ och inget stelt vattenfall.
10. **Digital transformation** — Digital transformation innebär att använda digitala capabilities för att i grunden förändra hur en enterprise arbetar och skapar eller levererar värde. Teknik ensam utgör inte transformation.`,
      en: `## The ten concepts’ students absolutely should know

Before attempting the questions, students should be able to explain these ten concepts without looking them up.

1. **Enterprise** — An enterprise is a collection of organizations, organizational units, or capabilities with a common set of goals.
2. **Architecture** — Architecture describes the fundamental organization of something, including its components, relationships, principles and constraints.
3. **Enterprise Architecture** — Enterprise Architecture addresses the structure and evolution of the enterprise in relation to its objectives.
4. **Business capability** — A capability describes what an organization can do.
5. **Value stream** — A value stream describes how value is created and delivered to a stakeholder.
6. **Architecture principle** — A principle provides enduring guidance for architectural decisions.
7. **Governance** — Governance establishes decision rights, accountability, direction and control.
8. **Zachman** — Zachman provides an ontology/classification schema for organizing descriptions of an enterprise.
9. **TOGAF** — TOGAF provides guidance and an approach for developing and governing Enterprise Architecture, including the ADM.
10. **Digital transformation** — Digital transformation involves using digital capabilities to fundamentally change how an enterprise operates and creates or delivers value.`,
    },
    {
      kind: "text",
      id: "m12-t4",
      sv: "## Flervalsfrågor inför examinationen",
      en: "## Multiple-choice examination questions",
    },
    {
      kind: "text",
      id: "m12-t5",
      sv: `## Syftet med modulen

Den här avslutande modulen samlar de viktigaste idéerna från hela kursen i Enterprise Architecture.

Målet är inte bara att komma ihåg definitioner. Du ska kunna koppla ihop begrepp, skilja mellan närliggande idéer och använda Enterprise Architecture-tänkande i realistiska situationer.

Efter den här modulen ska du kunna:

- Förklara syftet med Enterprise Architecture.
- Skilja Enterprise Architecture från IT architecture.
- Förklara Zachmans och TOGAF:s roller och varför de är olika.
- Förklara relationen mellan strategi, capabilities, value streams, processer och lösningar.
- Förklara vilken roll architecture principles och governance har.
- Förklara hur arkitektur kan stödja Agile och digital transformation.
- Analysera ett arkitektoniskt problem ur flera perspektiv.
- Ge och motivera arkitektoniska rekommendationer.
- Känna igen vanliga missuppfattningar om Enterprise Architecture.`,
      en: `## Purpose of the module

This final module brings together the major ideas from the entire Enterprise Architecture course.

The objective is not simply to remember definitions. Students should be able to connect concepts, distinguish related ideas, and apply Enterprise Architecture thinking to realistic situations.

By the end of this module, students should be able to:

- Explain the purpose of Enterprise Architecture.
- Distinguish Enterprise Architecture from IT architecture.
- Explain the role of Zachman and TOGAF and why they are different.
- Explain the relationship between strategy, capabilities, value streams, processes and solutions.
- Explain the role of architecture principles and governance.
- Explain how architecture can support Agile and digital transformation.
- Analyze an architectural problem from multiple perspectives.
- Make and justify architectural recommendations.
- Recognize common misconceptions about Enterprise Architecture.`,
    },
    { kind: "text", id: "m12-t6", sv: "## Integrerade flervalsfrågor", en: "## Integrated multiple choice" },
    {
      kind: "fraga",
      id: "ea-m12-1",
      nr: "1",
      question: "En VD säger: \"Vi behöver AI.\" Vad bör Enterprise Architecten fråga först?",
      options: [
        "Vilken AI-leverantör ska vi välja?",
        "Hur många GPU:er krävs?",
        "Vilket affärsproblem eller resultat försöker vi förbättra?",
        "Vilken molnplattform är billigast?",
        "Vilken konkurrent har bäst AI?",
      ],
      explanation: "Arkitekturen bör koppla teknikbeslut till verksamhetens mål och resultaten för stakeholders.",
    },
    {
      kind: "fraga",
      id: "ea-m12-2",
      nr: "2",
      question: "Ett företag har tio applikationer som innehåller kunddata. Vad bör arkitekten göra först?",
      options: [
        "Radera nio applikationer.",
        "Välja ett nytt CRM.",
        "Förstå business capabilities, informationsbehov, beroenden och skälen till dubbleringen.",
        "Flytta allt till molnet.",
        "Centralisera allt omedelbart.",
      ],
      explanation:
        "Arkitekturen bör inte hoppa från ett observerat symptom till en teknisk lösning. Arkitekten behöver först förstå vilka capabilities och informationsbehov applikationerna stödjer, vilka beroenden som finns och varför dubbleringen finns.",
    },
    {
      kind: "fraga",
      id: "ea-m12-3",
      nr: "3",
      question: "En student säger: \"Zachman talar om för oss vilken arkitekturprocess vi ska följa.\" Vilket är det bästa svaret?",
      options: [
        "Korrekt.",
        "Korrekt endast för technology architecture.",
        "Felaktigt; Zachman tillhandahåller i första hand en ontology",
      ],
      explanation:
        "Zachman är i första hand en ontology/klassificeringsstruktur och föreskriver ingen sekvens av aktiviteter. Det är TOGAF som ger ett tillvägagångssätt för arkitekturutveckling, genom ADM.",
    },
    {
      kind: "fraga",
      id: "ea-m12-4",
      nr: "4",
      question: "Vilket påstående beskriver BÄST Enterprise Architecture?",
      options: [
        "Ledningen av en organisations IT-avdelning",
        "Dokumentationen av alla applikationer i enterprisen",
        "Praktiken att förstå, utforma och styra en enterprises struktur och utveckling",
        "Valet av teknikprodukter",
        "Ledningen av mjukvaruutveckling",
      ],
      explanation:
        "Enterprise Architecture har en bredare avgränsning än IT. Den gäller enterprisen, dess mål, struktur, capabilities, relationer och utveckling.",
    },
    {
      kind: "fraga",
      id: "ea-m12-5",
      nr: "5",
      question: "Vad är det huvudsakliga syftet med en arkitektur?",
      options: [
        "Att producera så många diagram som möjligt",
        "Att beskriva relationer och grundläggande strukturer på ett sätt som stödjer förståelse och förändring",
        "Att eliminera all organisatorisk komplexitet",
        "Att välja teknikleverantörer",
        "Att ersätta strategisk planering",
      ],
      explanation: "Arkitektur handlar om struktur, relationer, principer, begränsningar och konsekvenser av förändring.",
    },
    {
      kind: "fraga",
      id: "ea-m12-6",
      nr: "6",
      question: "Vilket påstående beskriver BÄST en business capability?",
      options: [
        "En sekvens av aktiviteter",
        "En avdelning i organisationen",
        "En förmåga som organisationen har eller behöver ha",
        "En mjukvaruapplikation",
        "Ett projekt",
      ],
      explanation:
        "En capability beskriver vad en organisation kan göra, alltså en förmåga den har eller behöver ha. En sekvens av aktiviteter är en process, och en avdelning är en del av organisationsstrukturen.",
    },
    {
      kind: "fraga",
      id: "ea-m12-7",
      nr: "7",
      question: "Vilket påstående skiljer BÄST en capability från en process?",
      options: [
        "En capability beskriver vad en organisation kan göra; en process beskriver hur arbetet utförs.",
        "En capability är alltid strategisk; en process är alltid operativ.",
        "En capability hör till IT; en process hör till verksamheten.",
        "En process är alltid mer stabil än en capability.",
        "Det finns ingen meningsfull skillnad.",
      ],
      explanation:
        "En process beskriver hur arbetet utförs, medan en capability beskriver en förmåga, alltså vad organisationen kan göra. Påståendena med \"alltid\" är för absoluta.",
    },
    {
      kind: "fraga",
      id: "ea-m12-8",
      nr: "8",
      question: "Vilket av följande beskriver BÄST Zachman-ramverket?",
      options: [
        "En metodik för projektledning",
        "En livscykel för mjukvaruutveckling",
        "En ontology och ett klassificeringsschema för beskrivningar av en enterprise",
        "En standard för technology architecture",
        "En governance-procedur",
      ],
      explanation:
        "Zachman tillhandahåller en ontology/ett klassificeringsschema för att organisera beskrivningar av en enterprise. Det föreskriver ingen sekvens av aktiviteter och är därför ingen metodik.",
    },
    {
      kind: "fraga",
      id: "ea-m12-9",
      nr: "9",
      question: "Vilket av följande är INTE en av Zachmans sex interrogatives?",
      options: ["What", "How", "Where", "Which", "Why"],
      explanation: "Zachmans sex interrogatives är What?, How?, Where?, Who?, When? och Why? Which hör inte dit.",
    },
    {
      kind: "fraga",
      id: "ea-m12-10",
      nr: "10",
      question: "Vad är det främsta syftet med TOGAF:s ADM?",
      options: [
        "Att klassificera artefakter i enterprisen",
        "Att utveckla och vidareutveckla Enterprise Architecture",
        "Att definiera standarder för mjukvarukodning",
        "Att leda anställda",
        "Att välja mjukvara för enterprisen",
      ],
      explanation:
        "TOGAF ger vägledning och ett tillvägagångssätt för att utveckla och styra Enterprise Architecture, och ADM är dess metod för att utveckla och vidareutveckla arkitektur. Att klassificera beskrivningar är i stället Zachmans roll.",
    },
    {
      kind: "fraga",
      id: "ea-m12-11",
      nr: "11",
      question: "Vilket påstående beskriver BÄST relationen mellan Zachman och TOGAF?",
      options: [
        "De är två konkurrerande metodiker för projektledning.",
        "Zachman tillhandahåller ADM medan TOGAF tillhandahåller en ontology.",
        "Zachman organiserar/klassificerar arkitekturbeskrivningar, medan TOGAF tillhandahåller vägledning och ett tillvägagångssätt för arkitekturutveckling.",
        "TOGAF ersatte Zachman.",
        "De är i grunden identiska.",
      ],
      explanation:
        "Zachman hjälper arkitekter att tänka på vad som behöver beskrivas och ur vilka perspektiv, medan TOGAF ger vägledning om hur arkitektur kan utvecklas och styras. De kan därför komplettera varandra snarare än konkurrera.",
    },
    {
      kind: "fraga",
      id: "ea-m12-12",
      nr: "12",
      question: "Vilket av följande är ett exempel på en architecture principle?",
      options: [
        "\"Projektet blir klart i december.\"",
        "\"Applikation X använder Java.\"",
        "\"Information är en tillgång för hela enterprisen.\"",
        "\"Databasen innehåller 500 tabeller.\"",
        "\"Utvecklingsteamet träffas varje måndag.\"",
      ],
      explanation:
        "En princip ger varaktig vägledning för arkitektoniska beslut, och \"Information är en tillgång för hela enterprisen\" kan påverka dataägarskap, integration, säkerhet och investeringar. De andra alternativen är enskilda fakta som inte vägleder några beslut.",
    },
    {
      kind: "fraga",
      id: "ea-m12-13",
      nr: "13",
      question: "Vad är det huvudsakliga syftet med governance för arkitektur?",
      options: [
        "Att förhindra all förändring",
        "Att säkerställa att varje tekniskt beslut fattas av chefsarkitekten",
        "Att fastställa lämpliga decision rights, ansvarsskyldighet och arkitektonisk riktning",
        "Att eliminera Agile-utveckling",
        "Att ersätta verksamhetsledningen",
      ],
      explanation:
        "Governance fastställer decision rights, ansvarsskyldighet, riktning och kontroll. Rutinbeslut kan delegeras, så det betyder inte att chefsarkitekten fattar varje tekniskt beslut.",
    },
    {
      kind: "fraga",
      id: "ea-m12-14",
      nr: "14",
      question: "Vilket påstående beskriver BÄST Agile-arkitektur?",
      options: [
        "Arkitekturen bör vara klar innan utvecklingen startar.",
        "Agile-organisationer behöver ingen arkitektur.",
        "Arkitekturen utvecklas iterativt och ger samtidigt lämplig riktning och guardrails.",
        "Alla arkitekturbeslut bör fattas centralt.",
        "Arkitektur gäller endast teknik.",
      ],
      explanation:
        "Agile-organisationer behöver fortfarande sammanhållning, principer, riktning och hantering av betydande beroenden och risker. Arkitekturen ger detta och utvecklas samtidigt kontinuerligt.",
    },
    {
      kind: "fraga",
      id: "ea-m12-15",
      nr: "15",
      question: "Vilket är det starkaste exemplet på digital transformation?",
      options: [
        "Att skanna pappersdokument",
        "Att köpa nya bärbara datorer",
        "Att installera ett snabbare nätverk",
        "Att i grunden förändra kundupplevelsen och operating modeln genom digitala capabilities",
        "Att byta en databas mot en annan",
      ],
      explanation:
        "Digital transformation innebär att digitala capabilities används för att i grunden förändra hur en enterprise arbetar och skapar eller levererar värde. Att skanna papper är digitization, och de övriga alternativen är enskilda teknikbyten.",
    },
    {
      kind: "fraga",
      id: "ea-m12-16",
      nr: "16",
      question:
        "En organisation har fem applikationer som i stort sett stödjer samma business capability. Vad bör arkitekten göra FÖRST?",
      options: [
        "Omedelbart ta bort fyra applikationer.",
        "Välja en ny applikation.",
        "Förstå business capabilityn, kraven, beroendena och skälen till dubbleringen.",
        "Flytta alla applikationer till molnet.",
        "Lägga ut capabilityn på entreprenad.",
      ],
      explanation: "Arkitekturen bör inte hoppa från ett observerat symptom till en teknisk lösning.",
    },
    {
      kind: "fraga",
      id: "ea-m12-17",
      nr: "17",
      question:
        "En VD säger: \"Vårt projekt för digital transformation är lyckat eftersom vi har migrerat allt till molnet.\" Vilket är det BÄSTA arkitektoniska svaret?",
      options: [
        "Hålla med, eftersom molnmigrering är digital transformation.",
        "Inte hålla med, eftersom molnteknik inte har något värde.",
        "Fråga vilka affärsresultat, capabilities eller värdeerbjudanden som har förändrats till följd av det.",
        "Fråga vilken molnleverantör som valdes.",
        "Fråga hur många servrar som togs bort.",
      ],
      explanation:
        "Molnmigrering är inte automatiskt digital transformation; molnet kan vara en enabler, men transformation handlar om förändring i värdeskapande, operating models, kundupplevelser, capabilities eller affärsmodeller. Därför bör arkitekten fråga vad som faktiskt har förändrats.",
    },
    {
      kind: "fraga",
      id: "ea-m12-18",
      nr: "18",
      question: "Vilken sekvens representerar BÄST relationen mellan strategi och implementering?",
      options: [
        "Teknik → applikationer → strategi → verksamhet",
        "Strategi → capabilities → arkitekturförändring → implementering → resultat",
        "Applikationer → teknik → processer → strategi",
        "Implementering → strategi → governance → capabilities",
        "Teknik → strategi → capability → organisation",
      ],
      explanation:
        "Strategin fastställer riktning och mål, capabilities översätter dem till vad enterprisen måste kunna göra, och därifrån följer arkitekturförändring och implementering. Alternativ som börjar i teknik eller applikationer vänder på ordningen.",
    },
    { kind: "text", id: "m12-t7", sv: "## Sant eller falskt", en: "## True or False" },
    {
      kind: "fraga",
      id: "ea-m12-19",
      nr: "19",
      question: "Enterprise Architecture handlar i första hand om IT-system.",
      explanation: "Enterprise Architecture har en bredare avgränsning, som gäller enterprisen.",
    },
    {
      kind: "fraga",
      id: "ea-m12-20",
      nr: "20",
      question: "Zachman föreskriver en sekvens av aktiviteter som arkitekter måste utföra.",
      explanation: "Zachman är i första hand en ontology/klassificeringsstruktur.",
    },
    {
      kind: "fraga",
      id: "ea-m12-21",
      nr: "21",
      question: "TOGAF:s ADM bör tolkas som en absolut stel vattenfallsprocess.",
      explanation: "ADM är avsedd att stödja iterativ arkitekturutveckling och vidareutveckling.",
    },
    {
      kind: "fraga",
      id: "ea-m12-22",
      nr: "22",
      question: "En capability beskriver vad en organisation har förmåga att göra.",
      explanation:
        "Det är modulens egen definition: en capability beskriver vad en organisation kan göra. Hur arbetet utförs beskrivs i stället av en process.",
    },
    {
      kind: "fraga",
      id: "ea-m12-23",
      nr: "23",
      question: "En verksamhetsprocess och en business capability är alltid samma sak.",
      explanation: "En process beskriver hur arbetet utförs; en capability beskriver en förmåga.",
    },
    {
      kind: "fraga",
      id: "ea-m12-24",
      nr: "24",
      question: "Architecture principles kan fungera som guardrails för decentraliserat beslutsfattande.",
      explanation:
        "Tydliga principer ger återanvändbar vägledning, så team kan fatta många beslut själva så länge de håller sig inom de överenskomna gränserna. Principerna fungerar då som guardrails.",
    },
    {
      kind: "fraga",
      id: "ea-m12-25",
      nr: "25",
      question: "God governance för arkitektur innebär att varje tekniskt beslut måste godkännas av Enterprise Architecten.",
      explanation: "God governance fastställer lämpliga decision rights och gränser.",
    },
    {
      kind: "fraga",
      id: "ea-m12-26",
      nr: "26",
      question: "Digital transformation kräver nödvändigtvis ny teknik.",
      explanation:
        "Teknik är ofta en enabler, men transformation handlar om förändring i värdeskapande, operating models, kundupplevelser, capabilities och/eller affärsmodeller.",
    },
    {
      kind: "fraga",
      id: "ea-m12-27",
      nr: "27",
      question: "Arkitekturen bör utvecklas i takt med att enterprisen och dess omgivning förändras.",
      explanation:
        "I en miljö med digital transformation och ständig förändring måste arkitekturen själv utvecklas i stället för att bli en statisk dokumentation. Agile-arbetssätt hjälper arkitekturen att utvecklas med förändringen.",
    },
    {
      kind: "fraga",
      id: "ea-m12-28",
      nr: "28",
      question: "En samling arkitekturdiagram är automatiskt en Enterprise Architecture.",
      explanation: "Diagram är representationer. Arkitektur omfattar också syfte, relationer, principer, beslut och utveckling.",
    },
    { kind: "text", id: "m12-t8", sv: "## Kortsvarsfrågor", en: "## Short answer questions" },
    {
      kind: "fritext",
      id: "ea-e12-29",
      typ: "kortsvar",
      nr: "29",
      question: "Varför bör en Enterprise Architect förstå affärsstrategin?",
      modelAnswer:
        "Arkitektur finns för att stödja enterprisens mål. Utan att förstå strategin kan arkitekten inte avgöra vilka capabilities som behöver utvecklas, förändras eller skyddas, och arkitektoniska beslut kan inte heller bedömas mot verksamhetens prioriteringar.",
    },
    {
      kind: "fritext",
      id: "ea-e12-30",
      typ: "kortsvar",
      nr: "30",
      question: "Varför är en capability ofta en användbar utgångspunkt för transformationsanalys?",
      modelAnswer:
        "En capability beskriver vad organisationen behöver kunna göra. Den kan därför koppla strategiska mål till processer, människor, information, applikationer och teknik utan att vara alltför bunden till den nuvarande organisationsstrukturen eller implementeringen.",
    },
    {
      kind: "fritext",
      id: "ea-e12-31",
      typ: "kortsvar",
      nr: "31",
      question: "Vad är skillnaden mellan en viewpoint och en view?",
      modelAnswer:
        "En viewpoint definierar hur en viss concern hos stakeholders bör hanteras och representeras. En view är den representation som skapas med hjälp av den viewpointen.",
    },
    {
      kind: "fritext",
      id: "ea-e12-32",
      typ: "kortsvar",
      nr: "32",
      question: "Varför bör arkitekter bry sig om trade-offs?",
      modelAnswer:
        "Arkitektoniska beslut har sällan endast fördelar. Ökad standardisering, säkerhet, flexibilitet, snabbhet eller kontroll kan medföra kostnader eller begränsningar på andra håll. Arkitekter behöver därför göra trade-offs tydliga och anpassa dem till verksamhetens mål.",
    },
    {
      kind: "fritext",
      id: "ea-e12-33",
      typ: "kortsvar",
      nr: "33",
      question: "Varför är arkitektur viktig i en Agile-organisation?",
      modelAnswer:
        "Agile-organisationer behöver fortfarande sammanhållning, principer, riktning och hantering av betydande beroenden och risker. Arkitekturen ger detta samtidigt som implementeringsbeslut kan fattas på lämplig nivå och arkitekturen själv kan utvecklas kontinuerligt.",
    },
    {
      kind: "text",
      id: "m12-t9",
      sv: `## Scenariofrågor

Här går du från att komma ihåg arkitektur till att tänka som en arkitekt.`,
      en: `## Scenario questions

Here you go from remembering architecture to thinking like an architect.`,
    },
    {
      kind: "fritext",
      id: "ea-e12-scenario-1",
      typ: "scenario",
      nr: null,
      title: { sv: "Scenario 1 — \"Vi behöver AI\"", en: "Scenario 1 — \"We need AI\"" },
      question:
        "VD:n säger till Enterprise Architecten: \"Varje konkurrent använder AI. Vi behöver en AI-strategi omedelbart.\"\nVad bör arkitekten göra?",
      modelAnswer: `Arkitekten bör först förstå vilka affärsmål och problem AI förväntas lösa. Relevanta frågor är bland annat:
a. Vilket affärsresultat försöker vi förbättra?
b. Vilka capabilities skulle kunna dra nytta av det?
c. Vilka kund- eller affärsproblem finns?
d. Vilken information/data krävs?
e. Vilka risker och regulatoriska begränsningar finns?
f. Vilka förändringar i processer och operating models skulle behövas?
g. Var skulle AI kunna ge meningsfullt värde?
Endast när affärsbehovet har fastställts bör specifika AI-tekniker utvärderas.`,
      keyLesson: "Börja inte med tekniken. Börja med syfte och resultat.",
    },
    {
      kind: "fritext",
      id: "ea-e12-scenario-2",
      typ: "scenario",
      nr: null,
      title: { sv: "Scenario 2 — Applikationsproblemet", en: "Scenario 2 — The application problem" },
      question:
        "Ett företag har 600 applikationer.\nCIO:n förklarar: \"Vi har för många applikationer. Vi behöver minska antalet till 300.\"\nÄr detta nödvändigtvis ett bra arkitektoniskt mål?",
      modelAnswer: `Inte nödvändigtvis.
Antalet applikationer är inte i sig ett arkitektoniskt problem.
Arkitekten bör undersöka:
Vilka capabilities de stödjer.
Om applikationerna dubblerar funktionalitet.
Om dubbleringen är avsiktlig.
Applikationskostnader.
Verksamhetskritikalitet.
Teknisk risk.
Integrationskomplexitet.
Dubblering av data.
Concerns kring säkerhet.
Strategisk relevans.
Målet bör grundas på affärsresultat och arkitektoniska concerns snarare än på ett godtyckligt antal applikationer.`,
      keyLesson: "Arkitektur bör hantera problem och resultat, inte godtyckliga siffror.",
    },
    {
      kind: "fritext",
      id: "ea-e12-scenario-3",
      typ: "scenario",
      nr: null,
      title: { sv: "Scenario 3 — Agile-konflikten", en: "Scenario 3 — The Agile conflict" },
      question:
        "Ett produktteam säger: \"Vi är Agile. Arkitekturgodkännanden saktar ner oss.\nVi vill inte ha med arkitekter.\"\nHur bör Enterprise Architecten svara?",
      modelAnswer: `Arkitekten bör avgöra vilka beslut som verkligen kräver samordning på enterprise-nivå och vilka som kan delegeras.
Arkitekturen kan tillhandahålla:
Principer
Standarder
Guardrails
Återanvändbara capabilities
Referensarkitekturer
Decision rights
Vägledning om betydande beroenden och risker
Målet bör vara att möjliggöra decentraliserad leverans inom lämpliga arkitektoniska gränser, i stället för att kräva centralt godkännande av varje beslut.`,
      keyLesson: "God governance för arkitektur bör möjliggöra agilitet, inte begränsa den i onödan.",
    },
    {
      kind: "fritext",
      id: "ea-e12-scenario-4",
      typ: "scenario",
      nr: null,
      title: { sv: "Scenario 4 — Legacysystemet", en: "Scenario 4 — The legacy system" },
      question:
        "En bank har ett 30 år gammalt kärnbankssystem.\nLedningen säger: \"Det är gammalt, så det måste ersättas.\"\nÄr ålder ensam ett tillräckligt arkitektoniskt skäl för att ersätta det?",
      modelAnswer: `Nej.
Arkitekten bör bedöma:
Affärsvärde
Verksamhetskritikalitet
Teknisk hälsa
Säkerhet
Underhållbarhet
Kostnad
Begränsningar för förändring
Integrationsbegränsningar
Tillgång till alternativ
Strategisk riktning
Ett tekniskt gammalt system kan fortfarande vara värdefullt och stabilt. Omvänt kan ett nyare system skapa betydande arkitektonisk risk.
Det lämpliga svaret kan innebära:
Ersättning
Inkapsling
Modernisering
Byte av plattform
Avveckling
Fortsatt användning beroende på omständigheterna.`,
      keyLesson: "Arkitektoniska beslut bör vara evidensbaserade snarare än styrda av etiketter som \"legacy\".",
    },
    {
      kind: "fritext",
      id: "ea-e12-scenario-5",
      typ: "scenario",
      nr: null,
      title: { sv: "Scenario 5 — Digital transformation", en: "Scenario 5 — Digital transformation" },
      question:
        "En detaljhandlare har lanserat en mobilapp och förklarar: \"Vi har slutfört vår digital transformation.\"\nVad bör arkitekten undersöka?",
      modelAnswer: `Arkitekten bör fråga om mobilapplikationen har förändrat hur enterprisen skapar och levererar värde.
Frågor kan vara:
Har kundupplevelsen förändrats?
Har nya produkter eller tjänster skapats?
Har operating modeln förändrats?
Är processerna i grunden annorlunda?
Är besluten mer datadrivna?
Har affärsmodellen förändrats?
Skapas nya digitala ekosystem?
Har organisationens capability förändrats?
Att bara lägga till en digital kanal kan vara digitalization snarare än bredare digital transformation.`,
    },
    {
      kind: "text",
      id: "m12-t10",
      sv: `## Integrerade jämförelsefrågor

De här är särskilt användbara inför examinationen.

## Zachman eller TOGAF?

Ange för varje påstående vilket som passar bäst.`,
      en: `## Integrated comparison questions

These are particularly useful before the examination.

## 34. Zachman or TOGAF?

For each statement, identify which is the better fit.`,
    },
    tabellrad(
      "ea-m12-34a",
      "Att klassificera beskrivningar av en enterprise",
      "Zachman tillhandahåller en ontology/ett klassificeringsschema för att organisera beskrivningar av en enterprise. TOGAF kan också använda klassificeringar, men det är Zachmans primära roll.",
    ),
    tabellrad(
      "ea-m12-34b",
      "Tillvägagångssätt för arkitekturutveckling",
      "TOGAF tillhandahåller vägledning och ett tillvägagångssätt för att utveckla och styra Enterprise Architecture, inklusive ADM. Zachman föreskriver ingen sekvens av aktiviteter.",
    ),
    tabellrad(
      "ea-m12-34c",
      "Sex interrogatives",
      "De sex interrogatives hör till Zachman, som organiserar beskrivningar av en enterprise utifrån perspektiv och interrogatives. De är inga steg i en process.",
    ),
    tabellrad(
      "ea-m12-34d",
      "ADM",
      "ADM, Architecture Development Method, ingår i TOGAF och är ett strukturerat tillvägagångssätt för att utveckla och vidareutveckla arkitektur.",
    ),
    tabellrad(
      "ea-m12-34e",
      "Perspektiv",
      "Zachman organiserar beskrivningar av en enterprise utifrån perspektiv och interrogatives, medan TOGAF ger vägledning för att utveckla och styra arkitektur.",
    ),
    tabellrad(
      "ea-m12-34f",
      "Vägledning för arkitekturens governance",
      "TOGAF ger vägledning om hur arkitektur kan utvecklas och styras. Zachmans primära roll är att klassificera beskrivningar.",
    ),
    {
      kind: "text",
      id: "m12-t11",
      sv: `**Viktig reservation**

Det här betyder inte att TOGAF inte kan använda klassificeringar, eller att Zachman saknar betydelse för arkitekturpraktiken. Poängen är vilken roll som är den primära för var och en.`,
      en: `**Important qualification**

This does not mean that TOGAF cannot use classifications or that Zachman has no relevance to architecture practice. The point is the primary role of each.`,
    },
    {
      kind: "fritext",
      id: "ea-e12-35",
      typ: "kortsvar",
      nr: "35",
      title: { sv: "Capability eller process?", en: "Capability or process?" },
      question: `Ett företag beskriver:
"Onboarding av kunder"
"Organisationen har förmåga att onboarda kunder."
"Verifiera kundens identitet."
"Digital onboarding."
Vilka är mest sannolikt processer och vilka är capabilities?`,
      modelAnswer: `Den exakta klassificeringen beror på modelleringssammanhanget, men generellt:
a. "Verifiera kundens identitet" → process/aktivitet
b. "Organisationen har förmåga att onboarda kunder" → capability
c. "Onboarding av kunder" → kan representera antingen en capability eller en process beroende på modelleringssammanhanget
d. "Digital onboarding" → kan representera en capability, ett steg i en value stream eller ett lösningssammanhang beroende på modellen`,
      keyLesson: "Namn ensamma avgör inte vilket arkitektoniskt begrepp det gäller. Sammanhanget spelar roll.",
      keyLessonLabel: { sv: "Viktig lärdom", en: "Important lesson" },
    },
    { kind: "text", id: "m12-t12", sv: "## Essäfrågor", en: "## Essay questions" },
    {
      kind: "fritext",
      id: "ea-e12-essay-1",
      typ: "essa",
      nr: null,
      title: { sv: "Essä 1", en: "Essay 1" },
      question:
        "Förklara varför Enterprise Architecture bör ses som en disciplin för att möjliggöra förändring snarare än att bara dokumentera den nuvarande enterprisen.",
      modelAnswer: `Enterprise Architecture ger ett strukturerat sätt att förstå enterprisen och avgöra hur den bör utvecklas för att nå strategiska mål. Dokumentation av nuläget är användbar eftersom den ger en förståelse av befintliga capabilities, processer, information, applikationer och teknik. Arkitekturen blir dock strategiskt värdefull när den förståelsen används för att fatta beslut om framtida lägen och övergångar.
Enterprise Architecture kopplar därför nuvarande förhållanden till önskade resultat. Den identifierar gap, beroenden, risker och möjligheter och stödjer beslut om hur enterprisen bör förändras. I en miljö som präglas av digital transformation och ständig förändring måste arkitekturen själv utvecklas i stället för att bli en statisk dokumentationsövning.`,
    },
    {
      kind: "fritext",
      id: "ea-e12-essay-2",
      typ: "essa",
      nr: null,
      title: { sv: "Essä 2", en: "Essay 2" },
      question: "Jämför Zachmans och TOGAF:s roller i Enterprise Architecture.",
      modelAnswer: `Zachman och TOGAF behandlar olika aspekter av Enterprise Architecture.
Zachman tillhandahåller en ontology och ett klassificeringsschema för att organisera beskrivningar av en enterprise utifrån perspektiv och interrogatives som What, How, Where, Who, When och Why.
TOGAF tillhandahåller en bredare samling vägledning för Enterprise Architecture och innefattar Architecture Development Method, som ger ett strukturerat tillvägagångssätt för att utveckla och vidareutveckla arkitektur.
Zachman hjälper därför arkitekter att tänka på vad som behöver beskrivas och ur vilka perspektiv, medan TOGAF ger vägledning om hur arkitektur kan utvecklas och styras.
De kan därför vara kompletterande snarare än konkurrerande tillvägagångssätt.`,
    },
    // Modellsvaret är hopblandat redan i lärarens PDF (meningar klippta och
    // dubblerade). Den svenska versionen har meningarna i rätt ordning, utan
    // dubbletter och fragment (Kaspers beslut 23 nov); engelskan i essays.js
    // står kvar som i PDF:en.
    {
      kind: "fritext",
      id: "ea-e12-essay-3",
      typ: "essa",
      nr: null,
      title: { sv: "Essä 3", en: "Essay 3" },
      question: "Förklara hur business capabilities kan koppla samman strategi, Enterprise Architecture och digital transformation.",
      modelAnswer: `Strategin fastställer enterprisens riktning och mål.
Capabilities översätter dessa mål till de förmågor som enterprisen behöver ha. Arkitekter kan sedan avgöra vilka processer och människor, vilken information, vilka applikationer och vilken teknik som krävs för att stödja eller transformera dessa capabilities.
Digital transformation innebär ofta att capabilities förändras eller att nya skapas. Capability-baserad analys utgör därför en brygga mellan strategisk avsikt och arkitektonisk implementering. Den hjälper också organisationer att prioritera investeringar efter affärsvärde snarare än att bara välja tekniker.`,
    },
    {
      kind: "fritext",
      id: "ea-e12-essay-4",
      typ: "essa",
      nr: null,
      title: { sv: "Essä 4", en: "Essay 4" },
      question: "Förklara varför governance för arkitektur bör utformas för att stödja snarare än förhindra agilitet.",
      modelAnswer: `Organisationer behöver governance för att upprätthålla sammanhållning, hantera risker och säkerställa att viktiga arkitektoniska beslut stödjer strategiska mål.
Alltför mycket centralt godkännande kan dock sakta ner leveransen och hindra team från att snabbt svara på förändrade omständigheter.
Effektiv governance för arkitektur fastställer därför principer, decision rights, guardrails och eskaleringsmekanismer. Rutinbeslut kan delegeras medan beslut med betydande konsekvenser för hela enterprisen kan få lämplig arkitektonisk tillsyn. På så sätt kan governance ge både enhetlighet och autonomi.`,
    },
    {
      kind: "fritext",
      id: "ea-e12-essay-5",
      typ: "essa",
      nr: null,
      title: { sv: "Essä 5", en: "Essay 5" },
      question: "\"Enterprise Architecture handlar om relationer och trade-offs.\" Diskutera.",
      modelAnswer: `Enterprise Architecture handlar inte endast om enskilda komponenter utan om relationerna mellan verksamhetens mål, capabilities, processer, information, applikationer, teknik, människor och organisationsstrukturer.
Förändringar i ett element kan påverka många andra. Att förändra en business capability kan till exempel kräva förändringar i processer, information, applikationer och teknik.
Arkitektoniska beslut innebär också trade-offs. Ökad standardisering kan förbättra effektiviteten men minska flexibiliteten. Ökad säkerhet kan medföra ytterligare friktion. Centralisering kan förbättra kontrollen men minska den lokala autonomin.
Enterprise Architecten hjälper därför stakeholders att förstå dessa relationer och att göra tydliga trade-offs som stödjer enterprisens mål.`,
    },
    {
      kind: "text",
      id: "m12-t13",
      sv: `## Vanliga examinationsfällor

Var särskilt försiktig med påståenden som innehåller ord som:

- alltid
- aldrig
- endast
- måste
- automatiskt
- helt
- uteslutande

Inom Enterprise Architecture är sådana ord ofta tecken på att ett påstående är för absolut.

Påståendet "Digital transformation kräver alltid molnteknik" är till exempel falskt. Samma sak gäller "Enterprise Architecture handlar uteslutande om IT" och "Varje arkitekturbeslut måste godkännas centralt".

Arkitektur är i hög grad beroende av sammanhanget.`,
      en: `## Common examination traps

Students should be particularly careful with statements containing words such as:

- always
- never
- only
- must
- automatically
- completely
- exclusively

In Enterprise Architecture, these are often clues that a statement is too absolute.

For example: "Digital transformation always requires cloud technology." False.

Or: "Enterprise Architecture is exclusively about IT." False.

Or: "Every architecture decision must be approved centrally." False.

Architecture is highly contextual.`,
    },
    {
      kind: "text",
      id: "m12-t14",
      sv: `## "Arkitektens test"

Innan du rekommenderar en lösning bör du lära dig att ställa fem frågor:

1. **Varför?** – Vilket affärsmål eller problem hanterar vi?
2. **Vad?** – Vilken capability, vilket värde, vilken information eller vilket resultat berörs?
3. **Vem?** – Vilka är stakeholders och beslutsfattare?
4. **Hur?** – Vilken arkitektonisk förändring skulle kunna lösa problemet?
5. **Vilka blir konsekvenserna?** – Vilka är kostnaderna, riskerna, beroendena, trade-offs och effekterna?

Det är en användbar tankemodell både för examinationen och för verkligt arkitekturarbete.`,
      en: `## The "architect's test"

Before recommending a solution, students should learn to ask five questions:

1. **Why?** - What business objective or problem are we addressing?
2. **What?** - What capability, value, information or outcome is involved?
3. **Who?** - Who are the stakeholders and decision-makers?
4. **How?** - What architectural change could address the problem?
5. **What are the consequences?** - What are the costs, risks, dependencies, trade-offs and impacts?

This is a useful mental model for the examination and for real architecture work.`,
    },
    {
      kind: "text",
      id: "m12-t15",
      sv: `## Slutlig checklista inför examinationen

Före examinationen bör du kunna förklara det här utan anteckningar:

**Grunderna i Enterprise Architecture**

- Vad är en enterprise?
- Vad är arkitektur?
- Vad är Enterprise Architecture?
- Hur skiljer sig EA från IT architecture?
- Varför är relationer viktiga?
- Vad är abstraktion?

**Business Architecture**

- Vad är en capability?
- Vad är en process?
- Vad är en value stream?
- Hur förhåller sig capabilities till strategi?
- Varför är capabilities användbara för transformation?

**Zachman**

- Vad är Zachman-ramverket?
- Varför beskrivs det bättre som en ontology och ett klassificeringsschema?
- Vilka är de sex interrogatives?
- Vad representerar perspektiven?
- Varför är Zachman inte en metodik?

**TOGAF**

- Vad är TOGAF?
- Vad är ADM?
- Varför är ADM iterativ?
- Vilka är arkitekturdomänerna?
- Vad är governance för arkitektur?
- Vad är architecture principles?

**Agilitet**

- Vad är Agile-arkitektur?
- Vad betyder "just enough architecture"?
- Vad är arkitektoniska guardrails?
- Hur kan governance stödja agilitet?

**Digital transformation**

- Vad är digitization?
- Vad är digitalization?
- Vad är digital transformation?
- Varför är transformation mer än teknik?
- Hur stödjer Enterprise Architecture transformation?

**Arkitektoniskt tänkande**

- Hur analyserar man ett problem innan man väljer en lösning?
- Hur identifierar man trade-offs?
- Hur kopplar man strategi till implementering?
- Hur hanterar man nuvarande arkitektur, target architecture och transition architectures?
- Hur kommunicerar man arkitektur till olika stakeholders?`,
      en: `## Final examination checklist

Before the examination, students should be able to explain, without notes:

**Enterprise Architecture fundamentals**

- What is an enterprise?
- What is architecture?
- What is Enterprise Architecture?
- How does EA differ from IT architecture?
- Why are relationships important?
- What is abstraction?

**Business architecture**

- What is a capability?
- What is a process?
- What is a value stream?
- How do capabilities relate to strategy?
- Why are capabilities useful for transformation?

**Zachman**

- What is the Zachman Framework?
- Why is it better described as an ontology/classification schema?
- What are the six interrogatives?
- What do the perspectives represent?
- Why isn't Zachman a methodology?

**TOGAF**

- What is TOGAF?
- What is the ADM?
- Why is the ADM iterative?
- What are the architecture domains?
- What is architecture governance?
- What are architecture principles?

**Agility**

- What is Agile architecture?
- What does "just enough architecture" mean?
- What are architectural guardrails?
- How can governance support agility?

**Digital transformation**

- What is digitization?
- What is digitalization?
- What is digital transformation?
- Why is transformation more than technology?
- How does Enterprise Architecture support transformation?

**Architecture thinking**

- How do you analyze a problem before selecting a solution?
- How do you identify trade-offs?
- How do you connect strategy to implementation?
- How do you manage current, target and transition architectures?
- How do you communicate architecture to different stakeholders?`,
    },
    {
      kind: "fritext",
      id: "ea-e12-slututmaning",
      typ: "scenario",
      nr: null,
      title: { sv: "Slutlig utmaning", en: "Final challenge" },
      question: `Givet följande påstående: – "Vårt företag behöver ett nytt CRM eftersom våra konkurrenter har bättre CRM-system."
"Du har utsetts till Enterprise Architect. – Vad gör du?"
En stark student bör inte omedelbart svara:
"Låt oss utvärdera CRM-produkter."`,
      modelAnswer: `I stället bör de börja fråga:
Vilket affärsproblem försöker vi lösa?
Vilket strategiskt mål driver detta?
Vilka capabilities berörs?
Hur ser den nuvarande kundresan ut?
Var finns capability gaps?
Vilken information berörs?
Vilka processer behöver förändras?
Vilka applikationer stödjer i dag dessa capabilities?
Vilka arkitektoniska principer gäller?
Vilka alternativ finns?
Vilka är trade-offs?
Vad är target architecture?
Vilken övergång är realistisk?
Hur bör förändringen styras?`,
    },
    {
      kind: "text",
      id: "m12-t16",
      sv: `Det är här du går från att lära dig Enterprise Architecture-terminologi till att tänka som en Enterprise Architect.`,
      en: "This is the point at which the student move from learning Enterprise Architecture terminology to thinking like an Enterprise Architect.",
    },
    {
      kind: "text",
      id: "m12-t17",
      sv: `## Slutord till studenten

Syftet med den här kursen är inte att lära dig memorera ett ramverk.

Det är att lära dig se på en enterprise som ett system, förstå dess syfte och struktur, känna igen relationer och beroenden, värdera arkitektoniska trade-offs och hjälpa organisationen att förändras medvetet.

Zachman ger dig ett sätt att tänka kring de olika beskrivningarna av enterprisen.

TOGAF ger dig vägledning för att utveckla och vidareutveckla arkitektur.

Business capabilities kopplar strategi till det som enterprisen måste kunna göra. Governance ger ramverket för beslut. Agile arbetssätt hjälper arkitekturen att utvecklas med förändringen. Digital transformation utmanar enterprisen att tänka om kring hur den skapar och levererar värde.`,
      en: `## Final message to the student

The purpose of this course is not to teach you to memorize a framework.

It is to teach you to look at an enterprise as a system, understand its purpose and structure, recognize relationships and dependencies, evaluate architectural trade-offs, and help the organization change deliberately.

Zachman gives you a way to think about the different descriptions of the enterprise.

TOGAF gives you guidance for developing and evolving architecture.

Business capabilities connect strategy with what the enterprise must be able to do. Governance provides the decision framework. Agile approaches help architecture evolve with change. Digital transformation challenges the enterprise to rethink how it creates and delivers value.`,
    },
  ],
};
