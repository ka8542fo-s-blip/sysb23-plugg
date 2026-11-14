// Modulkorten i Läs för Verksamhetsarkitektur (Kaspers omgörning 2026-11-14:
// enkel och tentafokuserad).
//
// - Modul 12 är "Start här": tentans form ur kursinformationen, de tio
//   begreppen, arkitektens test och fällorna i sant/falskt (siffrorna räknas
//   ur frågebanken och låses i scripts/fallor.test.mjs).
// - Modul 1–11 börjar med Kärnsvaret (KARNSVAR): modulens kärna i 80–120 ord
//   som besvarar modulens fritextfrågor (explainMap.js). Det bygger bara på
//   lärarens modellsvar (`source`, essä-id:n) och modultexten, och har ett av
//   lärarens exempel. Sedan "Håll isär" och "Lärarens exempel" (CARDS). Ett
//   exempel står aldrig två gånger på samma kort: står det i kärnsvaret
//   saknas avsnittet "Lärarens exempel" när modulen inte har något annat.
// - Det som stod på korten förut (lärandemålen ordagrant, "Kärnan", modul
//   11:s uppgift) ligger överst under "Läs mer" (LEARNING), inget är borttaget.
//
// Texterna skrivs för en kursare som aldrig sett sajten förut: inga interna
// förkortningar (UF, HT25, docx) och inga nivånamn som kräver förklaring.

// Varför Zachman får mer utrymme än modulernas egna frågor.
export const ZACHMAN_WHY =
  "Modulerna har bara några frågor om Zachmans ramverk. Men alla tre tentor förra året hade en stor Zachman-uppgift, och ramverket finns i årets föreläsningsbilder. Därför kommer det troligen på tentan. Det är vår bedömning, inte något läraren har sagt.";

// Vad fliken Fördjupning är (fliken är dold sedan 2026-11-14).
export const FORDJUPNING_WHY =
  "Läraren har sagt att tentan bygger på modulerna, och de finns i Läs, Öva och Essä. Det här är extra material utanför modulerna, för dig som har tid över.";

// Kursinformationen ordagrant.
export const FORMAT_QUOTES = [
  "Tentamen kommer att se likadan ut som dessa moduler med Sant/Falskt frågor, multiple-choice frågor samt någondera essäfråga (fritextfrågor).",
  "Det kan komma frågor på tentamen som överensstämmer med de frågorna som finns i modulerna, men det kan också tillkomma andra av liknande art kopplade också till litteraturen.",
];

// Fällorna i sant/falskt. Siffrorna räknas ur frågebanken i
// scripts/fallor.test.mjs och måste stämma med texten nedan.
export const ABSOLUTE_WORDS = [
  "always", "never", "only", "must", "automatically", "completely", "exclusively",
  "necessarily", "every", "exactly", "entirely", "solely", "absolutely", "all",
];
export const TRAPS = { statements: 49, falseStatements: 29, absolute: 18, otherFalse: 11 };

const START_HERE = `
## Start här

Läraren säger att man ska börja med modul 12. Här står det som gäller hela tentan: hur den ser ut, de tio begreppen, arkitektens test och fällorna i sant/falskt.

## Så ser tentan ut

Kursinformationen:

> ${FORMAT_QUOTES[0]}

> ${FORMAT_QUOTES[1]}

- Hur många frågor tentan har och vad de ger i poäng är inte känt.
- På alla tre tentorna förra året gav fel svar på sant/falskt 0 poäng, inte minuspoäng. Svara därför alltid.
- Salstentorna är fem timmar oavsett vad de innehåller. Tiden säger alltså ingenting om hur stor tentan är.

## De tio begreppen

| Begrepp | Lärarens definition |
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

## Arkitektens test

Innan du rekommenderar en lösning, ställ fem frågor:

1. **Why?** Vilket affärsmål eller problem tar vi oss an?
2. **What?** Vilken förmåga, vilket värde, vilken information eller vilket utfall gäller det?
3. **Who?** Vilka är intressenterna och beslutsfattarna?
4. **How?** Vilken arkitektonisk förändring kan lösa problemet?
5. **What are the consequences?** Vilka är kostnaderna, riskerna, beroendena, avvägningarna och effekterna?

## Fällorna i sant/falskt

Modulerna har ${TRAPS.statements} påståenden att bedöma som sanna eller falska, utan de sex raderna i "Zachman or TOGAF". ${TRAPS.falseStatements} av dem är falska.

- **${TRAPS.absolute} innehåller ett absolut ord:** ${ABSOLUTE_WORDS.join(", ")}. Alla ${TRAPS.absolute} är falska, och inget sant påstående innehåller ett sådant ord.
- **De andra ${TRAPS.otherFalse} falska** blandar ihop två saker som läraren håller isär, till exempel ett diagram och arkitekturen, TOGAF och organisationens målarkitektur, eller agilt och att överge arkitekturen.
`;

// Kärnsvaren. `source` = de modellsvar (essä-id) svaret bygger på; alla
// fritextfrågor på modulens förklarakort utom Zachman-essän, som saknar
// modellsvar (modul 4:s svar om raderna och kolumnerna bygger på modultexten).
export const KARNSVAR = {
  kap1: {
    source: ["ea-e1-9", "ea-e1-10"],
    text: `En **enterprise** är en samling organisationer, organisatoriska enheter eller förmågor med gemensamma mål. Enterprise Architecture handlar om enterprisens struktur och utveckling i förhållande till dess mål, och enterprisen kan sträcka sig utanför det juridiska företaget när affärsutfallen beror på andra aktörer. Att bara se till företaget kan därför ge en ofullständig bild. I ett digitalt ekosystem bidrar kunder, leverantörer, myndigheter, plattformar och teknikleverantörer till utfallen, så gränsen är svår att dra. Arkitekten avgör vilka externa relationer som är relevanta: scope bestäms av affärsproblemet och det önskade utfallet. Lärarens exempel: Volvo, en Volvohandlare, ett logistikföretag och en bank samarbetar för att en kund ska få sin bil. Vilka av dem som hör till enterprisen beror på arbetets syfte.`,
  },
  kap2: {
    source: ["ea-e2-10", "ea-e2-x", "ea-e2-11", "ea-e12-essay-5"],
    text: `**Architecture** är den grundläggande organisationen av något: komponenter, relationer, principer och begränsningar. En lista över komponenter förklarar inte hur enterprisen fungerar, eftersom arkitektur också gäller relationer, beroenden, ansvar och syfte. Först då går det att bedöma konsekvenserna av en förändring: en ändrad förmåga kan kräva ändringar i processer, information, applikationer och teknik. Besluten innebär också avvägningar (trade-offs). **Abstraction** låter varje intressent fokusera på det som är relevant för den egna frågan och ändå tala om samma enterprise. Lärarens exempel är samma enterprise på fem nivåer, från "We provide financial services" och förmågan Payments ned till tekniken som kör betalsystemet. **Architecture**, **design** och **implementation** är olika nivåer av beslut: grundstrukturen, detaljerade lösningar inom ramarna och förverkligandet i drift.`,
  },
  kap3: {
    source: ["ea-e3-10", "ea-e3-11", "ea-e12-29", "ea-e12-essay-1"],
    text: `**IT architecture** handlar främst om informationsteknikens strukturer och lösningar. **Enterprise Architecture** har bredare scope: strategi, förmågor, organisation, information, applikationer, teknik och relationerna mellan dem. IT-arkitekturen är alltså en del av EA-landskapet. EA kopplar strategi till förändring: strategin anger önskade utfall, och arkitekturen visar vilka förmågor, strukturer, information, applikationer och organisationsförändringar som krävs. Därför måste arkitekten förstå strategin, annars går besluten inte att värdera mot verksamhetens prioriteringar. Att dokumentera nuläget är användbart, men EA blir strategiskt värdefull först när förståelsen används för beslut om framtida lägen och övergångar. Lärarens exempel: hoppa inte från "vi behöver ett nytt CRM" till "välj Salesforce", utan fråga först vilken förmåga och vilket kundutfall som ska uppnås.`,
  },
  kap4: {
    source: ["ea-e4-9", "ea-e4-11", "ea-e4-10", "ea-e5-12", "ea-e12-essay-2"],
    moduleText: "modul 4:s text om raderna och kolumnerna",
    text: `En **methodology** föreskriver aktiviteter, processer eller steg. En **ontology** fastställer begrepp och relationer som beskriver vad som finns i en domän och hur det kan klassificeras. Zachman är främst en ontologi och ett klassificeringsschema för beskrivningar av en enterprise: kolumnerna är de sex frågeorden **What, How, Where, Who, When** och **Why**, och raderna är olika perspektiv. Ramverket föreskriver ingen ordning för arbetet, så det är missvisande att kalla det en metod. TOGAF ger vägledning och en metod för att utveckla och styra arkitektur, framför allt genom ADM. Zachman visar vilka beskrivningar som behövs och från vilka perspektiv, TOGAF hur arkitekturen tas fram. De kompletterar varandra. Lärarens exempel är universitetet: What kan vara student och kurs, How antagning och registrering.`,
  },
  kap5: {
    source: ["ea-e5-10", "ea-e5-11"],
    // Modul 5 har inget exempel i modultexten; kärnsvaret citerar i stället
    // lärarens formulering om TOGAF.
    noExample: true,
    text: `**TOGAF** är en standard och en samling vägledning för Enterprise Architecture, inte organisationens arkitektur. Läraren säger det så här: "TOGAF is a tool for doing architecture; it is not the architecture of your enterprise." Organisationer skiljer sig i storlek, styrning, regelverk, arkitekturmognad, kultur, affärsmodell och förändringsbehov, så varje organisation måste anpassa arbetet efter sina omständigheter. **ADM** (Architecture Development Method) ger ett strukturerat sätt att ta fram, kommunicera, styra och utveckla arkitekturen, från arkitekturvisionen via domänarkitekturerna, möjligheter och migrering till implementation governance. ADM är iterativ och inget vattenfall: arbetet går tillbaka när krav och förutsättningar ändras. Övergångsarkitekturer (transition architectures) leder från nuläget till målläget.`,
  },
  kap6: {
    source: ["ea-e6-11", "ea-e12-31", "ea-e6-12", "ea-e6-13"],
    text: `De fyra domänerna är **Business**, **Data**, **Application** och **Technology Architecture**, och de beror av varandra: en verksamhetsförändring kan kräva ändringar i information, applikationer och teknik. Att utforma domänerna var för sig kan därför ge inkonsekvenser, dubblerade förmågor och lösningar som inte stödjer verksamhetens mål. Relationerna är ofta viktigare än de enskilda komponenterna, eftersom de visar beroenden, påverkan och hur en förändring sprider sig genom enterprisen. Olika intressenter har olika frågor (concerns). En **viewpoint** anger hur en viss intressents fråga ska hanteras och representeras, och en **view** är den faktiska representationen som skapas med den. Lärarens exempel: när en förmåga stöds dåligt av flera splittrade applikationer är relationen mellan verksamhets- och applikationsarkitekturen det mest användbara perspektivet.`,
  },
  kap7: {
    source: ["ea-e7-11", "ea-e7-12", "ea-e7-13", "ea-e7-26", "ea-e7-23", "ea-e7-25", "ea-e12-30", "ea-e12-35", "ea-e12-essay-3"],
    text: `En **business capability** beskriver vad organisationen kan göra, en **process** hur arbetet utförs och ett **value stream** hur värde skapas och levereras till en intressent. Förmågorna är relativt stabila när avdelningar omorganiseras, och de kan kopplas till processer, människor, information, applikationer och teknik. Därför är de en bro mellan strategi och arkitektur: strategin anger utfall och prioriteringar, de kräver förmågor, och arkitekten analyserar vad som behövs för att stödja dem. Digital transformation innebär ofta att förmågor ändras eller nya skapas, och förmågorna hjälper till att prioritera investeringar efter affärsvärde. Om något är en förmåga eller en process beror på modelleringssammanhanget. Lärarens exempel: ett företag omorganiserar marknadsavdelningen tre gånger på fem år, men behöver hela tiden kundinsikt, kampanjhantering och marknadsanalys.`,
  },
  kap8: {
    source: ["ea-e7-24", "ea-e7-27", "ea-e12-essay-4", "ea-e8-8", "ea-e12-32"],
    text: `En **architecture principle** ger varaktig vägledning för beslut, och **governance** fastställer beslutsrätter, ansvar, riktning och kontroll. Styrning behövs för att hålla ihop helheten, hantera risk och se till att viktiga beslut stödjer de strategiska målen, men för mycket centralt godkännande gör leveransen långsam. Med tydliga principer, beslutsrätter och guardrails kan team fatta rutinbeslut själva inom överenskomna gränser, medan beslut med stora följder för hela enterprisen får arkitektonisk tillsyn. Så ger styrningen både enhetlighet och autonomi. Arkitekturbeslut har sällan bara fördelar: mer standardisering, säkerhet eller kontroll kostar något annat, så avvägningarna (trade-offs) ska göras tydliga. Lärarens exempel: principen "Information is an enterprise asset" påverkar beslut om dataägarskap, integration, datakvalitet, säkerhet och applikationsdesign.`,
  },
  kap9: {
    source: ["ea-e9-9", "ea-e9-10", "ea-e12-33", "ea-e12-scenario-3"],
    text: `Agila organisationer behöver fortfarande helhet, principer, riktning och hantering av betydande beroenden och risker. Enterprise Architecture ger det, men låter genomförandebesluten fattas på rätt nivå och utvecklas själv i takt med lärandet. Arkitekten undviker att bli en flaskhals genom att sätta principer, standarder, guardrails och beslutsrätter, så att team kan fatta rutinbeslut själva. Själv fokuserar arkitekten på beroenden mellan team, strategiska beslut och systemrisker som kräver samordning. **Just-enough architecture** är den arkitektur som behövs för att ge riktning och hantera betydande risker och beroenden. Lärarens exempel: ett produktteam säger "We are Agile. Architecture approval is slowing us down." Arkitekten avgör vilka beslut som verkligen kräver samordning för hela enterprisen och delegerar resten inom tydliga gränser.`,
  },
  kap10: {
    source: ["ea-e10-9", "ea-e10-10", "ea-e12-scenario-5"],
    text: `**Digitization** omvandlar analog information till digital form. **Digitalization** använder digital teknik för att förbättra befintliga processer och aktiviteter. **Digital transformation** är bredare: en grundläggande förändring av hur enterprisen skapar och levererar värde. Den kan påverka affärsmodeller, förmågor, värdeflöden, organisationsstrukturer, information, applikationer och teknik. Eftersom förändringarna hänger ihop kräver de ett arkitektoniskt perspektiv på hela enterprisen, inte ett isolerat teknikinitiativ. Teknik ensam är ingen transformation. Lärarens exempel: en detaljhandlare lanserar en mobilapp och säger att den digitala transformationen är klar. Arkitekten frågar om appen har ändrat hur värde skapas, till exempel kundupplevelsen, verksamhetsmodellen eller affärsmodellen. Att bara lägga till en digital kanal kan vara digitalization.`,
  },
  kap11: {
    source: [
      "ea-e9-tankande", "ea-e12-scenario-2", "ea-e11-3", "ea-e11-7", "ea-e11-8", "ea-e11-8b",
      "ea-e11-9", "ea-e11-10", "ea-e12-scenario-1", "ea-e12-scenario-4", "ea-e12-slututmaning",
    ],
    text: `Fallet är en traditionell bank som ska bli digital inom två år. Börja med syftet och utfallen, inte med tekniken: klargör de strategiska målen och kundutfallen, och bedöm sedan nuläget i förmågor, värdeflöden, information, applikationer och teknik. En målarkitektur (target architecture) anger riktningen, med stöd av principer och styrning. Att byta hela kärnbanksystemet på en gång är riskabelt, eftersom det bär kritiska förmågor och komplexa beroenden. Övergångsarkitekturer låter banken modernisera medan verksamheten fortsätter, och agil leverans bygger förmågorna stegvis efter affärsvärde, risk och beroenden. Anti-mönstret är att välja teknikplattform innan målen och förmågorna är klara. Lärarens exempel: 600 applikationer är i sig inget arkitekturproblem. Fråga vilka förmågor de stöder och om dubbleringen faktiskt är ett problem.`,
  },
};

// Resten av kortet efter kärnsvaret: "Håll isär" och "Lärarens exempel".
export const CARDS = {
  kap12: START_HERE,
  kap1: `
## Håll isär

| Inte | Utan |
|---|---|
| En enterprise är ett juridiskt företag | En samling organisationer, enheter eller förmågor med gemensamma mål |
| Gränsen är fast och lika med organisationens | Gränsen beror delvis på arkitekturarbetets syfte och scope |
| Scope bestäms av CIO:n, budgeten eller verktyget | Scope bestäms av problemet som ska lösas |
`,
  kap2: `
## Håll isär

| Inte | Utan |
|---|---|
| Diagrammet är arkitekturen | Diagrammet är en representation av arkitekturen |
| Arkitektur är en lista över komponenter | Komponenter och deras relationer, principer och begränsningar |
| Arkitektur och implementation är samma sak | Arkitekturen organiserar; implementationen förverkligar |
| Arkitekturen beskriver varje detalj | Abstraktion visar det som är relevant för frågan |

## Lärarens exempel

Arkitektoniska frågor gäller beroenden och konsekvenser, till exempel vilka beroenden som finns mellan en kritisk förmåga och applikationerna som stöder den. Färgen på en knapp, typsnittet i en rapport eller vem som skriver en viss kodrad är inte arkitektoniska frågor.
`,
  kap3: `
## Håll isär

| Inte | Utan |
|---|---|
| EA handlar främst om teknik | EA handlar om hur enterprisen ska utvecklas |
| EA är dokumentation av IT-system | EA stödjer beslut, transformation och styrning |
| EA och IT-arkitektur är samma sak | IT-arkitekturen är en del av EA-landskapet |
| Först teknik, sedan arkitektur | Fråga varför innan du frågar vilken teknik |
`,
  kap4: `
## Håll isär

| Inte | Utan |
|---|---|
| Zachman är en metod | En ontologi och ett klassificeringsschema |
| Raderna är projektfaser | Raderna är perspektiv eller abstraktionsnivåer |
| Zachman föreskriver en ordning | Ramverket föreskriver ingen ordning |
| Zachman ger ADM | TOGAF ger ADM; Zachman klassificerar |

## Rutnätet
`,
  kap5: `
## Håll isär

| Inte | Utan |
|---|---|
| ADM är ett rigitt vattenfall | ADM stödjer iteration och anpassning |
| TOGAF är organisationens målarkitektur | TOGAF är vägledning för att göra arkitektur |
| TOGAF anger exakt vilken arkitektur alla ska ha | Organisationen anpassar arbetet efter sitt sammanhang |
| TOGAF klassificerar beskrivningar | Det gör Zachman; TOGAF ger metoden |
`,
  kap6: `
## Håll isär

| Inte | Utan |
|---|---|
| View och viewpoint är samma sak | Viewpoint = reglerna för vyn; view = representationen |
| Domänerna ska behandlas var för sig | Domänerna är sammankopplade; relationerna är det viktiga |
| Alla intressenter har samma frågor | Olika intressenter behöver olika vyer och abstraktionsnivåer |
`,
  kap7: `
## Håll isär

| Inte | Utan |
|---|---|
| Förmåga och process är utbytbara | Förmåga = vad man kan göra; process = hur arbetet utförs |
| En förmåga beskriver aktiviteternas ordning | Det är processperspektivet |
| En förmågekarta är hela EA | Den är en representation bland flera |
| Förmågor följer avdelningarna | Förmågor finns kvar när organisationen ändras |

## Lärarens exempel

Strategin "Become the easiest bank for first-time home buyers" kräver förmågan Digital Mortgage Origination, med värdeflödet Discover → Apply → Verify → Approve → Complete. Processer som "Approve a mortgage application" genomför delar av värdeflödet, medan "Mortgage underwriting" är en förmåga.
`,
  kap8: `
## Håll isär

| Inte | Utan |
|---|---|
| Styrning = allt godkänns centralt | Beslutsrätter, ansvar och lämpliga kontroller |
| En princip är en teknisk detaljlösning | En princip är varaktig vägledning för beslut |
| Det finns en perfekt arkitektur | Arkitektur är att göra avvägningar explicita |

## Lärarens exempel

En lämplig guardrail är att alla system ska följa definierade säkerhets- och integrationsprinciper. En olämplig är att varje team måste be arkitekten om lov att skriva kod.
`,
  kap9: `
## Håll isär

| Inte | Utan |
|---|---|
| Agilt betyder att arkitekturen överges | Arkitekturen utvecklas iterativt med riktning och guardrails |
| Just enough = ingen arkitektur | Just enough = det som behövs för riktning och risker |
| Agilitet kräver att allt centraliseras | Rutinbeslut delegeras; betydande beslut samordnas |
`,
  kap10: `
## Håll isär

| Inte | Utan |
|---|---|
| Att skanna dokument är transformation | Det är digitization |
| Molnmigrering är digital transformation | Att flytta tekniken ändrar inte nödvändigtvis hur värde skapas |
| Transformation kräver AI | AI kan vara en möjliggörare men är inget krav |

## Lärarens exempel

| Begrepp | Exempel |
|---|---|
| Digitization | Skanna ett pappersdokument till PDF |
| Digitalization | Automatisera en befintlig process med mjukvara |
| Digital transformation | Förändra affärsmodell och kundupplevelse i grunden |
`,
  kap11: `
## Håll isär

| Inte | Utan |
|---|---|
| Välj teknikplattform först | Det är anti-mönstret: mål, förmågor och begränsningar först |
| Byt kärnsystemet på en gång | Big bang ger stora risker; övergångsarkitekturer |
| Målarkitekturen förutsäger allt | Den ger en sammanhängande riktning |

## Lärarens exempel

En API-plattform för hela enterprisen. Affärsmålet är att snabbt kunna skapa digitala produkter, och svaret är en plattform med API:er, identitet, säkerhet, datatjänster, integration, övervakning och stöd för utvecklarna, så att teamen kan bygga produkter av återanvändbara förmågor.
`,
};

// Modul 4: under rutnätet, tre lösta placeringar och regeln.
export const CARD_AFTER = {
  kap4: `
## Så placerar du en modell

Kolumnen är frågan modellen svarar på (What, How, Where, Who, When eller Why). Raden är perspektivet och detaljnivån, från planerarens listor på rad 1 till de detaljerade beskrivningarna på rad 5. Ställ alltså två frågor: vad handlar modellen om, och för vem och hur detaljerad är den?

| Modell | Cell | Varför |
|---|---|---|
| En metod implementerad i Java | R5K2 (Program) | Koden är en funktion, alltså hur något utförs (How), och en detaljerad representation på kodnivå (rad 5). |
| En arbetsflödesmodell | R2K4 (Work Flow Model) | Den visar vem som gör vilket arbete (Who), och affischen placerar den i verksamhetens modell (rad 2, Owner). |
| En modell över verksamhetsregler | R3K6 (Business Rule Model) | Regler hör till Varför-kolumnen (Why), och affischen placerar regelmodellen i systemmodellen (rad 3, Designer). |
`,
};

// Det som stod på korten före 2026-11-14 ligger överst under "Läs mer".
export const LEARNING = {
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

En **capability** är vad organisationen kan göra, en **process** hur arbetet utförs och en **value stream** hur värde skapas och levereras till en intressent. Förmågorna är relativt stabila när organisationsstrukturer och processer ändras, och blir därför en bro mellan strategi och arkitektur. Lärarens exempel: strategin "Become the easiest bank for first-time home buyers" kräver förmågan Digital Mortgage Origination, med värdeflödet Discover → Apply → Verify → Approve → Complete. Förmågor kan kopplas till processer, människor, information, applikationer och teknik.
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

En arkitekturprincip är en generell regel som vägleder beslut. Lärarens exempel "Information is an enterprise asset" påverkar dataägarskap, applikationsdesign, integration, styrning, säkerhet och investeringar.

> Governance answers: Who has the authority to make which decisions, under what constraints?

Principer fungerar som guardrails: team kan fatta många beslut själva inom överenskomna gränser, och styrningen kan fokusera på betydande risker och beroenden. Arkitektur innebär avvägningar, till exempel flexibilitet mot standardisering, snarare än perfekta lösningar.
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

| Begrepp | Lärarens definition |
|---|---|
| Digitization | Converting analog information into digital form |
| Digitalization | Using digital technologies to improve existing activities and processes |
| Digital transformation | Using digital capabilities to fundamentally change how an enterprise creates, delivers and captures value |

> Technology alone does not constitute transformation.

Ett transformationsinitiativ ska drivas av ett tydligt affärsutfall och strategiskt mål. Eftersom det kan påverka affärsmodeller, förmågor, värdeflöden, organisation, information, applikationer och teknik är det en fråga för hela enterprisens arkitektur.
`,
  kap11: `
## Uppgiften

Modul 11 har inga egna lärandemål utan en uppgift, "Student task":

- Analyze the situation from an Enterprise Architecture perspective.

Fallet: en traditionell bank med flera kunddatabaser, en 25 år gammal kärnbankplattform, fristående digitala kanaler, långsamma releaser, många dubblerade applikationer och konkurrens från digitala banker. Vd:n säger: "We need to become a digital bank within two years."

## Kärnan

Börja med de strategiska målen och kundutfallen, inte med tekniken. Bedöm nuläget (förmågor, värdeflöden, information, applikationer och teknik), låt en målarkitektur ange riktningen med stöd av principer och styrning, och ta dig dit via övergångsarkitekturer prioriterade efter affärsvärde, risk och beroenden. Agil leverans kan bygga förmågorna stegvis. En strategisk förmåga i fallet är digital customer onboarding, och ett arkitekturproblem är splittrad kundinformation.
`,
};

// Rutan i modul 4-kortet: Zachman utöver modulens egna frågor.
export const LIKELY = {
  kap4: {
    title: "Zachman kommer troligen på tentan",
    text: `${ZACHMAN_WHY} Lär dig därför rutnätet ovan. I Öva, modul 4, finns Memorera för rad- och kolumnnamnen och Zachman-essän som förklarakort.`,
    links: [{ view: "ova", params: { topics: ["kap4"], nonce: 4 }, label: "Öva modul 4" }],
    // Flyttat hit ur kapitel 4:s text (2026-11-13): det som gäller de gamla tentorna.
    moreLabel: "Så såg Zachman-uppgifterna ut förra året",
    more: `
Förra årets tre tentor (oktober 2025, december 2025 och maj 2026) var upplagda på ett annat sätt än årets. Hälften av poängen var Zachman, och hälften var sant/falskt om artiklar som inte ingår i år.

- **Uppgift 1 (30 poäng), en essä:** "Beskriv och förklara raderna och kolumnerna i Zachmans ramverk." För höga poäng skulle man förklara perspektiven (till exempel vad Planner är) och ge exempel på vad cellerna innehåller: listor på rad 1, konceptuella modeller på rad 2 och så vidare. På två av tentorna krävdes minst 15 poäng på uppgiften för att bli godkänd.
- **Uppgift 2 (20 poäng), placering:** tio modeller som skulle placeras i rätt cell i rutnätet, eller sju flervalsfrågor med cellkoder (maj 2026). På omtentan i december 2025 fick man svara med två celler om man motiverade valet. Det finns inget officiellt facit till placeringsuppgifterna.
`,
  },
};
