// Modulkorten i Läs för Verksamhetsarkitektur: det tentan bygger på (Kärna).
// Varje kort har UF:s lärandemål ordagrant, kärnbudskapet i några meningar
// och de distinktioner han upprepar, högst cirka 300 ord. Den längre
// kapiteltexten (reading.js) ligger kvar under "Läs mer".
//
// Ordningen i Läs är 12, 1, 2 … 11: UF säger i modul 1 att man ska börja
// med modul 12. Inga hänvisningar till gamla tentor här — det som gäller
// HT25 står i Troligt-rutan (LIKELY) och i Fördjupning. Modul 11 saknar
// lärandemål i PDF:en; där står UF:s "Student task".

export const TROLIGT_NOTE = "Inte i modulerna, men på alla UF:s tidigare tentor och i årets bilder";
export const FORDJUPNING_NOTE = "Utanför UF:s tips";

export const CARDS = {
  kap12: `
## Lärandemål

By the end of this module, students should be able to:

- Explain the purpose of Enterprise Architecture.
- Distinguish Enterprise Architecture from IT architecture.
- Explain the role of Zachman and TOGAF and why they are different.
- Explain the relationship between strategy, capabilities, value streams, processes and solutions.
- Explain the role of architecture principles and governance.
- Explain how architecture can support Agile and digital transformation.
- Analyze an architectural problem from multiple perspectives.
- Make and justify architectural recommendations.
- Recognize common misconceptions about Enterprise Architecture.

## Kärnan

Modul 12 knyter ihop kursen. Målet är inte att minnas definitioner utan att koppla ihop begrepp, skilja närliggande idéer och tänka som en arkitekt. Kedjan är **strategy → capabilities → architectural change → implementation → outcomes**. Var misstänksam mot always, never, only, must, automatically, completely och exclusively: i Enterprise Architecture är sådana påståenden ofta för absoluta.

## De tio begreppen

| Begrepp | UF:s definition |
|---|---|
| Enterprise | A collection of organizations, organizational units, or capabilities with a common set of goals. |
| Architecture | The fundamental organization of something, including its components, relationships, principles and constraints. |
| Enterprise Architecture | Addresses the structure and evolution of the enterprise in relation to its objectives. |
| Business capability | Describes what an organization can do. |
| Value stream | Describes how value is created and delivered to a stakeholder. |
| Architecture principle | Provides enduring guidance for architectural decisions. |
| Governance | Establishes decision rights, accountability, direction and control. |
| Zachman | Provides an ontology/classification schema for organizing descriptions of an enterprise. |
| TOGAF | Provides guidance and an approach for developing and governing Enterprise Architecture, including the ADM. |
| Digital transformation | Involves using digital capabilities to fundamentally change how an enterprise operates and creates or delivers value. |
`,
  kap1: `
## Lärandemål

By the end of this module, students should be able to:

- Define an enterprise.
- Explain why an enterprise is more than an organization.
- Identify the boundaries and stakeholders of an enterprise.
- Explain why understanding the enterprise is fundamental to Enterprise Architecture.

## Kärnan

> An enterprise is any collection of organizations, organizational units, or capabilities that has a common set of goals.

Arkitekten måste förstå vilken enterprise som arkitekteras, i stället för att anta att det är den juridiska organisationen. Gränsen sätts av problemet: "Architecture scope is determined by the problem we are trying to solve." I ett digitalt ekosystem beror utfallen ofta på partner, leverantörer, plattformar, myndigheter och kunder, så förmågorna kan sträcka sig utanför en organisations juridiska gränser.

## Håll isär

| Inte | Utan |
|---|---|
| En enterprise är ett juridiskt företag | En samling organisationer, enheter eller förmågor med gemensamma mål |
| Gränsen är fast och lika med organisationens | Gränsen beror delvis på arkitekturarbetets syfte och scope |
| Scope bestäms av CIO:n, budgeten eller verktyget | Scope bestäms av problemet som ska lösas |
`,
  kap2: `
## Lärandemål

Students should understand:

- Architecture as structure and relationships.
- Architecture as abstraction.
- The difference between architecture, design and implementation.
- Why architecture exists.

## Kärnan

> The fundamental organization of something, including its components, relationships, principles and constraints.

Arkitektur handlar om relationer och konsekvenser: om den här förmågan ändras, vad mer påverkas? Kedjan capability → process → information → application → technology gör det möjligt att se det. Abstraktion döljer det som inte är relevant, så att olika intressenter kan arbeta på olika nivåer och ändå tala om samma enterprise. Arkitektur, design och implementation är olika nivåer av beslut: grundläggande struktur, detaljerad lösning inom ramarna och förverkligande i drift.

## Håll isär

| Inte | Utan |
|---|---|
| Diagrammet är arkitekturen | Diagrammet är en representation av arkitekturen |
| Arkitektur är en lista över komponenter | Komponenter och deras relationer, principer och begränsningar |
| Arkitektur och implementation är samma sak | Arkitekturen organiserar; implementationen förverkligar |
| Arkitekturen beskriver varje detalj | Abstraktion visar det som är relevant för frågan |
`,
  kap3: `
## Lärandemål

Students should be able to:

- Define Enterprise Architecture.
- Distinguish Enterprise Architecture from IT architecture.
- Explain its relationship to strategy.
- Explain why Enterprise Architecture enables change.

## Kärnan

> Enterprise Architecture is the practice of understanding, designing, communicating and governing the fundamental structure and evolution of an enterprise to achieve its objectives.

Nyckelfrågan är inte vilken teknik vi ska köpa, utan vad enterprisen behöver bli kapabel att göra och vilka förändringar som krävs. IT-arkitektur frågar hur tekniken ska struktureras; EA frågar hur enterprisen ska utvecklas för att nå sina mål, och tekniken kan vara en del av svaret. EA kopplar strategi till förändring och drivs av verksamhetens mål och intressenternas frågor.

## Håll isär

| Inte | Utan |
|---|---|
| EA handlar främst om teknik | EA handlar om hur enterprisen ska utvecklas |
| EA är dokumentation av IT-system | EA stödjer beslut, transformation och styrning |
| EA och IT-arkitektur är samma sak | IT-arkitekturen är en del av EA-landskapet |
| Först teknik, sedan arkitektur | Fråga varför innan du frågar vilken teknik |
`,
  kap4: `
## Lärandemål

Students should understand:

- a. Zachman's purpose.
- b. The six interrogatives.
- c. The different perspectives.
- d. Why Zachman is an ontology/classification schema rather than a methodology.

## Kärnan

> The Zachman Framework is best understood as an ontology and classification schema for enterprise descriptions.

De sex frågeorden: **What** (things/data), **How** (processes/functions), **Where** (locations), **Who** (people/responsibilities), **When** (time/events) och **Why** (motivation/goals). Raderna är olika perspektiv eller abstraktionsnivåer. Zachman säger inte "gör det här, sedan det här", utan visar de dimensioner och perspektiv genom vilka enterprisen kan beskrivas. Därför är det ingen metod. Ramverket kan visa vilka beskrivningar som saknas. Zachman klassificerar beskrivningar, TOGAF ger en metod (ADM), och de kan komplettera varandra.

## Håll isär

| Inte | Utan |
|---|---|
| Zachman är en metod | En ontologi och ett klassificeringsschema |
| Raderna är projektfaser | Raderna är perspektiv eller abstraktionsnivåer |
| Zachman föreskriver en ordning | Ramverket föreskriver ingen ordning |
| Zachman ger ADM | TOGAF ger ADM; Zachman klassificerar |
`,
  kap5: `
## Lärandemål

Students should understand:

- What TOGAF is.
- The purpose of the ADM.
- Why the ADM is iterative.
- How TOGAF differs from Zachman.
- Architecture development.
- The distinction between framework guidance and an organization's actual architecture.

## Kärnan

> The TOGAF Standard provides a body of guidance and an approach for Enterprise Architecture. The Architecture Development Method (ADM) provides an iterative approach to developing and managing architecture.

ADM:s faser är Preliminary, Architecture Vision, Business Architecture, Information Systems Architectures, Technology Architecture, Opportunities and Solutions, Migration Planning, Implementation Governance och Architecture Change Management. ADM ska inte behandlas som ett linjärt vattenfall: arkitekturen itererar när krav, lärande och omständigheter ändras. TOGAF är vägledning som organisationen anpassar; den måste själv ta fram sin arkitektur.

## Håll isär

| Inte | Utan |
|---|---|
| ADM är ett rigitt vattenfall | ADM stödjer iteration och anpassning |
| TOGAF är organisationens målarkitektur | TOGAF är vägledning för att göra arkitektur |
| TOGAF anger exakt vilken arkitektur alla ska ha | Organisationen anpassar arbetet efter sitt sammanhang |
| TOGAF klassificerar beskrivningar | Det gör Zachman; TOGAF ger metoden |
`,
  kap6: `
## Lärandemål

Students should understand:

- Business Architecture
- Data Architecture
- Application Architecture
- Technology Architecture
- Views and viewpoints
- Stakeholder concerns

## Kärnan

De fyra domänerna är Business (capabilities, processes, organization, value och business services), Data (information, datastrukturer, ägarskap, styrning och flöden), Application (applikationer och applikationstjänster) och Technology (infrastruktur, plattformar, nätverk och tekniktjänster). De är inga silor: de intressanta frågorna gäller relationerna, eftersom de visar beroenden och följder av förändring. Olika intressenter har olika frågor och behöver därför olika vyer.

> A viewpoint defines how a particular stakeholder concern should be addressed and represented. A view is the actual representation created using that viewpoint.

## Håll isär

| Inte | Utan |
|---|---|
| View och viewpoint är samma sak | Viewpoint = reglerna för vyn; view = representationen |
| Domänerna ska behandlas var för sig | Domänerna är sammankopplade; relationerna är det viktiga |
| Alla intressenter har samma frågor | Olika intressenter behöver olika vyer och abstraktionsnivåer |
`,
  kap7: `
## Lärandemål

Students should understand:

- Business capabilities.
- Business processes.
- Value streams.
- Their relationship to strategy.
- Business architecture.
- Capability-based planning.

## Kärnan

En **capability** är vad organisationen kan göra, en **process** hur arbetet utförs och en **value stream** hur värde skapas och levereras till en intressent. Förmågorna är relativt stabila när organisationsstrukturer och processer ändras, och blir därför en bro mellan strategi och arkitektur. UF:s exempel: strategin "Become the easiest bank for first-time home buyers" kräver förmågan Digital Mortgage Origination, med värdeflödet Discover → Apply → Verify → Approve → Complete. Förmågor kan kopplas till processer, människor, information, applikationer och teknik.

## Håll isär

| Inte | Utan |
|---|---|
| Förmåga och process är utbytbara | Förmåga = vad man kan göra; process = hur arbetet utförs |
| En förmåga beskriver aktiviteternas ordning | Det är processperspektivet |
| En förmågekarta är hela EA | Den är en representation bland flera |
| Förmågor följer avdelningarna | Förmågor finns kvar när organisationen ändras |
`,
  kap8: `
## Lärandemål

Students should understand:

- Architecture principles.
- Governance.
- Decision rights.
- Guardrails.
- Trade-offs.

## Kärnan

En arkitekturprincip är en generell regel som vägleder beslut. UF:s exempel "Information is an enterprise asset" påverkar dataägarskap, applikationsdesign, integration, styrning, säkerhet och investeringar.

> Governance answers: Who has the authority to make which decisions, under what constraints?

Principer fungerar som guardrails: team kan fatta många beslut själva inom överenskomna gränser, och styrningen kan fokusera på betydande risker och beroenden. Arkitektur innebär avvägningar, till exempel flexibilitet mot standardisering, snarare än perfekta lösningar.

## Håll isär

| Inte | Utan |
|---|---|
| Styrning = allt godkänns centralt | Beslutsrätter, ansvar och lämpliga kontroller |
| En princip är en teknisk detaljlösning | En princip är varaktig vägledning för beslut |
| Det finns en perfekt arkitektur | Arkitektur är att göra avvägningar explicita |
`,
  kap9: `
## Lärandemål

Students should understand:

- Agile and architecture.
- Continuous architecture.
- Just-enough architecture.
- Guardrails.
- Architecture debt.
- Decentralized decision-making.

## Kärnan

Agilt betyder inte att arkitektur är onödig. Arkitekturen måste rymma iteration, återkoppling, ändrade prioriteringar, inkrementell leverans och lärande, och ge tillräcklig riktning utan att förutsäga varje detalj. **Just-enough architecture** är bara den arkitektur som behövs för att ge riktning och hantera betydande risker och beroenden. **Architecture debt** är ackumulerade kompromisser som ger framtida kostnad, risk eller begränsning. Arkitekten undviker att bli en flaskhals genom principer, standarder, guardrails och beslutsrätter, och fokuserar på beslut med betydande påverkan på enterprisen.

## Håll isär

| Inte | Utan |
|---|---|
| Agilt betyder att arkitekturen överges | Arkitekturen utvecklas iterativt med riktning och guardrails |
| Just enough = ingen arkitektur | Just enough = det som behövs för riktning och risker |
| Agilitet kräver att allt centraliseras | Rutinbeslut delegeras; betydande beslut samordnas |
`,
  kap10: `
## Lärandemål

Students should be able to distinguish between:

- Digitization
- Digitalization
- Digital transformation
- Digital business models
- Digital ecosystems

## Kärnan

| Begrepp | UF:s definition |
|---|---|
| Digitization | Converting analog information into digital form |
| Digitalization | Using digital technologies to improve existing activities and processes |
| Digital transformation | Using digital capabilities to fundamentally change how an enterprise creates, delivers and captures value |

> Technology alone does not constitute transformation.

Ett transformationsinitiativ ska drivas av ett tydligt affärsutfall och strategiskt mål. Eftersom det kan påverka affärsmodeller, förmågor, värdeflöden, organisation, information, applikationer och teknik är det en fråga för hela enterprisens arkitektur.

## Håll isär

| Inte | Utan |
|---|---|
| Att skanna dokument är transformation | Det är digitization |
| Molnmigrering är digital transformation | Att flytta tekniken ändrar inte nödvändigtvis hur värde skapas |
| Transformation kräver AI | AI kan vara en möjliggörare men är inget krav |
`,
  kap11: `
## Uppgiften

UF:s modul 11 har inga egna lärandemål utan en uppgift, "Student task":

- Analyze the situation from an Enterprise Architecture perspective.

Fallet: en traditionell bank med flera kunddatabaser, en 25 år gammal kärnbankplattform, fristående digitala kanaler, långsamma releaser, många dubblerade applikationer och konkurrens från digitala banker. Vd:n säger: "We need to become a digital bank within two years."

## Kärnan

Börja med de strategiska målen och kundutfallen, inte med tekniken. Bedöm nuläget (förmågor, värdeflöden, information, applikationer och teknik), låt en målarkitektur ange riktningen med stöd av principer och styrning, och ta dig dit via övergångsarkitekturer prioriterade efter affärsvärde, risk och beroenden. Agil leverans kan bygga förmågorna stegvis. En strategisk förmåga i fallet är digital customer onboarding, och ett arkitekturproblem är splittrad kundinformation.

## Håll isär

| Inte | Utan |
|---|---|
| Välj teknikplattform först | Det är anti-mönstret: mål, förmågor och begränsningar först |
| Byt kärnsystemet på en gång | Big bang ger stora risker; övergångsarkitekturer |
| Målarkitekturen förutsäger allt | Den ger en sammanhängande riktning |
`,
};

// Troligt-rutan i modul 4-kortet: Zachman utöver modulens egna frågor.
export const LIKELY = {
  kap4: {
    label: "Troligt",
    note: TROLIGT_NOTE,
    text: "Ramverkets rader, kolumner och celler, och placering av modeller i rutnätet, går längre än modul 4:s frågor. Öva det i Zachman-fliken och skriv Zachman-essän.",
    links: [
      { view: "zachman", label: "Zachman (modul 4)" },
      { view: "essa", params: { essayId: "ea-e-zachman" }, label: "Zachman-essän" },
    ],
    // Flyttat hit ur kapitel 4:s text (2026-11-13): det som gäller de gamla tentorna.
    more: `
## Hur Zachman prövades på UF:s tidigare tentor

HT25-tentorna (okt 2025, dec 2025, maj 2026) hade ett annat format än årets: en Zachman-essä, placering i rutnätet och sant/falskt om artiklar som inte ingår i år.

- **Uppgift 1 (30 p):** "Beskriv och förklara raderna och kolumnerna i Zachmans ramverk." För höga poäng ska perspektiven förklaras ("vad är Planner?") och exempel på cellinnehåll ges: listor på rad 1, konceptuella modeller på rad 2 och så vidare. På två av tentorna krävdes minst 15 p för godkänt.
- **Uppgift 2 (20 p):** tio modeller att placera, eller sju flervalsfrågor med cellkoder (maj 2026). På omtentan i december 2025 fick man svara med två celler om man motiverade det. Det finns inget officiellt facit till placeringsuppgifterna.
`,
  },
};
