// Kompendiet (löptext) och ordlistan för delkursen Verksamhetsarkitektur.
//
// Ansvarsfördelning som för de andra delkurserna: löptexten ägs HÄR, de
// korta punkterna (keyPoints, pitfalls) ägs av topics.js. Kapitelavslutet
// renderas ur `primaryTopics`.
//
// Källäget (2026-11-13): Umberto Fiaccadoris (UF) tolv moduler i tre PDF:er
// (modul 1–4, 5–8, 9–12), föreläsningsbilderna (104 bilder, Zachman-delen
// och arkitektens roller på svenska), de två Zachman-affischerna i bilderna
// (2003 från Intervista, version 3.0 från Zachman International) och
// kursinformationen. Kapitel 5:s fastabell (Phase A–H) kommer ur UF:s
// kursmaterial (docx), eftersom modulen bara räknar upp faserna utan
// bokstäver och Öva har docx-frågor om dem. Kursboken är inte namngiven och
// används inte. Inget innehåll om TOGAF eller ArchiMate utöver UF:s material.
//
// Kapitlen följer UF:s numrering och titlar: kapitel N = modul N, så att man
// kan gå direkt mellan sajten, PDF:en och föreläsningen. Bildnummer står
// bara i `sources`, aldrig i löptexten.
//
// Kapitelschema: { id, number, title, lead, readingMinutes, sources, body }
// plus `card` (modulkortet ur cards.js, visas först) och för kapitel 4
// `likely` (Troligt-rutan). `body` är den längre texten under "Läs mer".
//
// Ordningen är 12, 1, 2 … 11 (UF: börja med modul 12); numren ändras inte.
// Sammanfattningen (summary.js) står kvar som fil men är sedan 2026-11-13
// inget eget kort: modul 12-kortet har de tio begreppen, och
// sammanfattningens övriga avsnitt ligger under modul 12:s "Läs mer".
import { summary } from "./summary.js";
import { CARDS, CARD_AFTER, KARNSVAR, LEARNING, LIKELY } from "./cards.js";
import { essays } from "./essays.js";

export { summary };

export const CHAPTER_TOPICS = {
  kap12: { topics: ["integration"], primaryTopics: ["integration"] },
  kap1: { topics: ["enterprise"], primaryTopics: ["enterprise"] },
  kap2: { topics: ["arkitektur"], primaryTopics: ["arkitektur"] },
  kap3: { topics: ["ea"], primaryTopics: ["ea"] },
  kap4: { topics: ["zachman"], primaryTopics: ["zachman"] },
  kap5: { topics: ["togaf"], primaryTopics: ["togaf"] },
  kap6: { topics: ["domaner"], primaryTopics: ["domaner"] },
  kap7: { topics: ["formagor"], primaryTopics: ["formagor"] },
  kap8: { topics: ["styrning"], primaryTopics: ["styrning"] },
  kap9: { topics: ["agilt"], primaryTopics: ["agilt"] },
  kap10: { topics: ["digital"], primaryTopics: ["digital"] },
  kap11: { topics: ["praktik"], primaryTopics: ["praktik"] },
};

export const CHAPTER_ORDER = Object.keys(CHAPTER_TOPICS);

export const intro = "Kursen består av lärarens tolv moduler, och läraren har sagt att tentan ser ut som dem. Kapitel 1 här är modul 1 och så vidare. Börja med modul 12, Start här, som visar hur tentan ser ut. Varje annat kapitel börjar med kärnsvaret: modulens kärna i några meningar, som svarar på modulens fritextfrågor. Sedan kommer det du ska hålla isär och lärarens exempel. Lärandemålen och resten av texten ligger under ”Läs mer”. Räkna med ungefär {lästid} för hela texten. Begreppen står på engelska, som i modulerna och på tentan.";

export const examNote = {
  text: "Tentan ser ut som modulerna, enligt kursinformationen och läraren: sant/falskt, flervalsfrågor och någon essäfråga. Modulernas egna frågor kan komma, och även andra liknande frågor om litteraturen. Öva därför modulernas frågor i Öva och skriv essäfrågorna i Essä. Hur många poäng frågorna ger, och om fel svar ger minuspoäng, vet vi inte.",
  source: "Kursinformationen och läraren",
};

const rawChapters = [
  {
    id: "kap1",
    number: 1,
    title: "What Is an Enterprise?",
    readingMinutes: 4,
    lead: "En enterprise är inte samma sak som ett företag. Gränsen för det man arkitekterar sätts av problemet man ska lösa.",
    sources: ["Modul 1", "Föreläsningsbilder 21–24"],
    body: `
## Kärnan

Lärarens definition, som också är det första av modul 12:s tio begrepp:

> An enterprise is any collection of organizations, organizational units, or capabilities that has a common set of goals.

Det avgörande är **a common set of goals**, inte ägande eller juridisk form. En enterprise kan därför vara ett företag, en myndighet, ett universitet eller en kommun. Den kan också vara en grupp organisationer som samarbetar mot ett gemensamt mål, eller ett helt ekosystem i en leveranskedja (supply-chain ecosystem). Den behöver inte vara stor.

Poängen för arkitekten är att först förstå *vilken* enterprise som ska arkitekteras, i stället för att automatiskt utgå från den juridiska organisationen. Frågan att börja med är: vilken del av verkligheten måste vi förstå för att lösa det problem vi har framför oss?

## Scope bestäms av problemet

Lärarens exempel: Volvo, en Volvohandlare, ett logistikföretag och en bank samarbetar för att en kund ska få sin bil. Vilka av dem hör till den enterprise vi försöker förstå? Det finns inte nödvändigtvis ett rätt svar. Det beror på arkitekturarbetets scope och syfte:

> Architecture scope is determined by the problem we are trying to solve.

Samma sak med en digital banktjänst. Den kan involvera banken, kunderna, betalningsleverantörer, identifieringstjänster, tillsynsmyndigheter, molnleverantörer och fintechpartner. Beroende på den arkitektoniska frågan ligger några av dem, eller alla, inom den relevanta enterprisen.

Därför är gränserna inte alltid desamma som de juridiska eller organisatoriska gränserna. Att definiera scope är i sig ett arkitektoniskt beslut, inte något som chefen, budgeten eller verktyget bestämmer.

## Varför det spelar roll

Tror man att "enterprise" betyder "företag" börjar man också tro att Enterprise Architecture handlar om IT inne i ett företag. Det gör det inte. Arkitekturen beskriver enterprisen **som ett system**: verksamheten, informationen, människorna, processerna, tekniken och relationerna till omvärlden.

I ett digitalt ekosystem är gränsen särskilt svår att dra. Digitala tjänster beror ofta på partner, leverantörer, plattformar, tillsynsmyndigheter och kunder. Förmågorna som krävs för ett affärsutfall kan alltså sträcka sig utanför en enda organisations juridiska gränser, och arkitekten måste avgöra vilka externa relationer som är relevanta för målet med arkitekturarbetet.

## Arkitektens tänkande

- Vilket problem ska arkitekturen lösa, och vilket utfall eftersträvar vi?
- Vilka delar av omgivningen är relevanta för att nå de arkitektoniska målen?
- Vilka intressenter (stakeholders) finns, och vilka frågor har de?

## Håll isär

| Påstående som låter rätt | Hur det är |
|---|---|
| En enterprise är ett juridiskt företag | En enterprise är en samling organisationer, enheter eller förmågor med gemensamma mål |
| Gränsen är fast och lika med organisationens | Gränsen beror delvis på arkitekturarbetets syfte och scope |
| Scope bestäms av CIO:n, budgeten eller verktyget | Scope bestäms av problemet som ska lösas |
| EA gäller bara ekosystem | EA kan gälla ett företag, en myndighet eller ett ekosystem |
| Företaget räcker som utgångspunkt | Fokus på bara företaget kan ge en ofullständig bild när utfallet beror på andra |
`,
  },
  {
    id: "kap2",
    number: 2,
    title: "What Is Architecture?",
    readingMinutes: 4,
    lead: "Arkitektur är den grundläggande organisationen av något: komponenter, relationer, principer, begränsningar och utveckling. Ett diagram är bara en representation av den.",
    sources: ["Modul 2", "Föreläsningsbilder 26, 27 och 32", "Modul 12 (de tio begreppen)"],
    body: `
## Kärnan

Lärarens definition i modul 2:

> Architecture is concerned with the fundamental organization of something, including its components, relationships, principles and evolution.

I modul 12 står samma sak med constraints i stället för evolution: "the fundamental organization of something, including its components, relationships, principles and constraints". Tillsammans blir det komponenter, relationer, principer, begränsningar och utveckling. På föreläsningen sammanfattar läraren det som **components + relationships + principles + constraints + purpose**.

Två saker följer:

- **En arkitektur är inte ett diagram.** Diagrammet är en representation av arkitekturen.
- **En arkitektur är inte en lista över komponenter.** Komponenterna förklarar inte hur enterprisen fungerar. Det gör relationerna, beroendena, ansvaren, principerna, begränsningarna och syftet.

## Relationer och konsekvenser

Arkitektur handlar särskilt om relationer och konsekvenser. Lärarens kedja:

> Business capability → process → information → application → technology

Med kedjan kan arkitekten fråga: *om den här förmågan ändras, vad mer påverkas?* Det är arkitektoniskt tänkande. På föreläsningen går kedjan från kunden: kunden interagerar med en affärsprocess, som stöds av en förmåga, som möjliggörs av en applikation, som körs på en teknik. De intressanta frågorna gäller ofta relationerna mellan dem.

## Strategi, arkitektur, design och implementation

| Nivå | Frågan den svarar på |
|---|---|
| Strategy | Vart vill vi och varför? |
| Architecture | Vilken grundläggande struktur och vilka relationer gör att vi kommer dit? |
| Design | Hur ska en viss lösning konstrueras? |
| Implementation | Hur bygger och driftsätter vi den? |

Arkitekturen fastställer den grundläggande organisationen, relationerna, principerna och begränsningarna. Designen tar fram mer detaljerade lösningar inom de ramarna, och implementationen förverkligar designen i drift. Gränserna är inte absoluta, men de motsvarar olika nivåer av beslut och abstraktion.

## Abstraktion

Abstraktion döljer detaljer som inte är relevanta, så att en fråga kan förstås på rätt nivå. Det betyder inte att undvika all teknisk detalj. Lärarens exempel på samma enterprise på fem nivåer:

- **Mycket hög nivå:** "We provide financial services."
- **Förmåga:** Payments.
- **Process:** Process card transaction.
- **Applikation:** Payment Processing System.
- **Teknik:** ett Kubernetes-kluster som kör applikationen.

Ingen av beskrivningarna är "arkitekturen". De är olika abstraktioner av samma enterprise. Eftersom verkligheten är så komplex låter abstraktionen olika intressenter arbeta på olika nivåer och ändå tala om samma enterprise.

## Arkitektens tänkande

Arkitektoniska frågor gäller beroenden och konsekvenser, till exempel vilka beroenden som finns mellan en kritisk förmåga och applikationerna som stöder den. Färgen på en knapp, typsnittet i en rapport eller vem som skriver en viss kodrad är inte arkitektoniska frågor.

## Håll isär

| Påstående som låter rätt | Hur det är |
|---|---|
| Diagrammet är arkitekturen | Diagrammet representerar arkitekturen |
| Arkitektur är en samling komponenter | Arkitektur är komponenter och deras relationer, principer och begränsningar |
| Arkitektur och implementation är samma sak | Arkitektur gäller den grundläggande organisationen, implementation förverkligar den |
| En arkitektur måste beskriva varje implementationsdetalj | Abstraktion döljer det som inte är relevant för frågan |
`,
  },
  {
    id: "kap3",
    number: 3,
    title: "What Is Enterprise Architecture?",
    readingMinutes: 5,
    lead: "Enterprise Architecture är bredare än IT-arkitektur och handlar om hur enterprisen ska utvecklas för att nå sina mål. Kapitlet tar också upp arkitektens fem roller.",
    sources: ["Modul 3", "Föreläsningsbilder 25, 28, 44–46 och 56", "Modul 12 (de tio begreppen)"],
    body: `
## Kärnan

Lärarens definition i modul 3:

> Enterprise Architecture is the practice of understanding, designing, communicating and governing the fundamental structure and evolution of an enterprise to achieve its objectives.

Det kritiska ordet är **enterprise**. I modul 12:s tio begrepp står den kortare formen: "Enterprise Architecture addresses the structure and evolution of the enterprise in relation to its objectives."

Nyckelfrågan är inte "vilken teknik ska vi köpa?" utan **"vad behöver enterprisen bli kapabel att göra, och vilka förändringar krävs för att nå målen?"**

## EA och IT-arkitektur

| | IT-arkitektur | Enterprise Architecture |
|---|---|---|
| Frågan | "How should our technology be structured?" | "How should the enterprise evolve so that it can achieve its objectives?" |
| Scope | Informationsteknikens strukturer och lösningar | Hela enterprisen: strategi, förmågor, organisation, information, applikationer, teknik och relationerna mellan dem |
| Relation | En del av EA-landskapet | Omfattar IT-arkitekturen |

Tekniken kan vara en del av svaret, men den är inte definitionen av problemet.

## EA kopplar strategi till förändring

Strategin pekar ut önskade utfall. Arkitekturen pekar ut vilka förmågor, strukturer, information, applikationer, teknik och organisatoriska förändringar som krävs för att nå dem. EA översätter alltså strategiska mål till arkitektoniska konsekvenser och blir en bro mellan strategisk avsikt och genomförande.

Stora arkitekturbeslut ska därför drivas av **verksamhetens mål och intressenternas frågor** (business objectives and stakeholder concerns), inte av teknikmode, leverantörer, utvecklarnas smak eller ritkonventioner.

Lärarens exempel: arkitekten ska inte hoppa direkt från "vi behöver ett nytt CRM" till "välj Salesforce". Först kommer den arkitektoniska frågan: vilken förmåga och vilket kundutfall försöker vi uppnå, och vilken arkitektonisk förändring krävs?

## Arkitektur är till för förändring

Arkitektur handlar inte i första hand om att beskriva det som finns, utan om att möjliggöra målmedveten förändring (purposeful change). Enterprises måste hela tiden anpassa sig till strategi, marknader, teknik och omvärld, och därför handlar EA om förändring. Dokumentation av nuläget är användbar. Men om arkitekturens arkiv (architecture repository) blir ett museum av inaktuella diagram har det litet strategiskt värde. Den verkliga frågan är: **vilka beslut ska den här arkitekturinformationen hjälpa oss att fatta?**

EA kan stödja beslutsfattande, transformation och styrning. Den är inte bara dokumentation, inte en IT-förteckning och ersätter varken strategin eller ledningen.

## Arkitekten

Rollen går ut på att få verksamhetens olika delar att samspela för att nå mål och syfte. Det gäller människor, roller, processer och teknologi, och hur allt detta ska integreras i hela verksamheten för att ge de tänkta resultaten. Läraren kallar det "att skapa ordning ur kaos".

### Arkitektens fem roller

| Roll | Vad den innebär |
|---|---|
| Förändringsagent | Stödjer verksamhetens ledare att etablera och förankra den bästa strategin för att nå verksamhetens mål och syften |
| Kommunikatör | Hjälper chefer, analytiker, systemarkitekter och utvecklare att förstå strategins detaljer, så att de kan fatta beslut och vidta åtgärder för att nå verksamhetens idé |
| Ledare | Deltar i arbetet med en gemensam verksamhetsidé, motiverar medarbetarna att försöka nå den och förmedlar klara direktiv om vad strategin behöver för att nå mål och syften |
| Förvaltare | Organiserar arbetslaget av arkitekter och ser till att det finns tillräckliga resurser för arbetet med arkitekturen |
| Modellerare | Förser verksamheten med en representation av relationerna mellan verksamhetens delar, detaljerad nog och i ett format som kan ligga till grund för besluten som genomför den strategiska planen |

### Utan arkitekt

Läraren räknar upp vad som händer om ingen har rollen:

- större risk för kaos och missförstånd
- brist på information för beslutsfattande
- ökad komplexitet
- avgränsad i stället för övergripande optimering (suboptimering)
- begränsad produktivitet och effektivitet, som ökar risken för felaktiga beslut

## Håll isär

| Påstående som låter rätt | Hur det är |
|---|---|
| EA handlar främst om teknik | EA handlar om hur enterprisen ska utvecklas; tekniken kan vara en del av svaret |
| EA är dokumentation av IT-system | EA stödjer beslut, transformation och styrning |
| EA och IT-arkitektur är samma sak | IT-arkitekturen är en del av det bredare EA-landskapet |
| Arkitekturen finns för att bevara nuläget | Arkitekturen finns för att möjliggöra förändring |
| Först väljer man teknik, sedan arkitektur | Fråga varför innan du frågar vilken teknik |
`,
  },
  {
    id: "kap4",
    number: 4,
    title: "Zachman Framework",
    readingMinutes: 10,
    lead: "Zachmans ramverk är en ontologi och ett klassificeringsschema för beskrivningar av en enterprise, inte en metod. Kapitlet går igenom kolumnerna, raderna och cellerna och hur man placerar en modell.",
    sources: [
      "Modul 4",
      "Föreläsningsbilder 33–43 (Zachman-delen på svenska)",
      "Zachman-affischerna: 2003 (Intervista Institute) och version 3.0 (Zachman International)",
    ],
    body: `
## Kärnan

> The Zachman Framework is best understood as an ontology and classification schema for enterprise descriptions.

En **ontologi** fastställer begrepp och relationer som beskriver vad som finns inom ett område och hur det kan klassificeras. En **metod** (methodology) föreskriver aktiviteter, processer eller steg för att åstadkomma något. Zachman är det första.

Zachman säger inte "gör det här, sedan det här, sedan det här". Det säger i stället: här är olika dimensioner och perspektiv genom vilka enterprisen kan beskrivas. Frågan ramverket ställer är **vilka sorters beskrivningar behöver vi, och ur vilka perspektiv?** Därför ska det inte förväxlas med en metod: det föreskriver ingen ordning för hur arkitekturen tas fram. Det kan däremot visa vilka beskrivningar som saknas eller är ofullständiga.

## Zachman och TOGAF

| | Zachman | TOGAF |
|---|---|---|
| Vad det är | Ontologi och klassificeringsschema | Vägledning och en metod för att ta fram och styra arkitektur |
| Frågan | Vilka beskrivningar behövs, och ur vilka perspektiv? | Hur tas arkitekturen fram och styrs? |
| Kärnan | Sex frågeord och sex perspektiv | ADM (Architecture Development Method) |

De konkurrerar inte. Zachman hjälper till att organisera vilka sorters beskrivningar som behövs, och TOGAF ger en metod för att ta fram och styra arkitekturen. De kan komplettera varandra. Mer om TOGAF i kapitel 5.

## Principerna bakom rutnätet

Läraren formulerar ramverkets principer så här:

- Ramverket visar **kontexten** för olika modeller.
- Varje cell är **bara ett exempel** på vilken sorts modell som kan användas.
- Varje **rad** visar en nivå av abstraktion, intressant ur ett visst perspektiv.
- Varje **kolumn** visar en central aspekt av en verksamhet.
- Det måste finnas ett **sammanhang mellan cellerna i samma kolumn**: en transformation mellan modellabstraktioner.
- Transformationen mellan raderna är fortfarande **inte helt automatisk**, men det håller på att förändras med modelldriven utveckling och arkitektur.

## Kolumnerna: sex frågeord

| Kolumn | Frågeord | På affischen | Vad den handlar om | Lärarens exempel från universitetet |
|---|---|---|---|---|
| K1 | Vad | What / Data | Det verksamheten vill veta något om: begrepp, ontologier, semantiska modeller | Student, program, kurs, poäng, prov, helårsstudent |
| K2 | Hur | How / Function | Vad verksamheten sysslar med: processer och delprocesser | Antagning, registrering, kursutveckling, examination, undervisning |
| K3 | Var | Where / Network | Var arbetet utförs: platser och det logistiska systemet | Lund, EC2, institutionen för informatik |
| K4 | Vem | Who / People | Vem som utför arbetet och har ansvaret: organisatoriska enheter, personal, arbetsflödesmodeller, organisationsscheman, ansvarsmatriser | Antagningsavdelningen, Ekonomihögskolan, institutionen, kursansvarig, lärare, studenter |
| K5 | När | When / Time | När i tiden uppgifter ska utföras: händelser, flöden, cykler, ordningsföljd | Ansökan lämnas in innan förkunskaperna bedöms, bedömningen sker innan beslut om antagning, antagningen sker innan registrering |
| K6 | Varför | Why / Motivation | Verksamhetens grund: mål, syften, visioner och strategier | Syften och krav i högskolelagen och högskoleförordningen, antalet helårsstudenter och helårsprestationer, strategisk plan, lärandemål |

Några av lärarens poänger per kolumn:

- **Vad:** utan data finns inget att arbeta med. Begreppens betydelse måste vara klar — kund, klient, kontohavare och leverantör är besvärligt om man menar samma sak, för då blir datan ointegrerad. Begreppen måste också relateras till varandra; begreppsmodellen är termer relaterade till varandra, vilket ger fakta.
- **Hur:** hur data används och hanteras, vilka resurser som finns och hur de omvandlar input till output. Här hör processmodellerna hemma.
- **Var:** hur olika arbetsuppgifter är kopplade, och hur fysiskt åtskilda uppgifter utförs.
- **När:** ordningen måste schemaläggas noggrant.

**Om arbetsflöden:** läraren nämner arbetsflöden både under Hur ("processmodeller och arbetsflöden") och under Vem ("arbetsflödemodeller"). På affischen står *Work Flow Model* i Vem-kolumnen (rad 2), med begreppsparet organisationsenhet och arbetsprodukt. Tumregeln blir: processmodellen (vad som görs, i vilken ordning) hör till Hur, och arbetsflödesmodellen (vem som gör vilket arbete) till Vem.

## Raderna: sex perspektiv

Raderna är olika perspektiv eller abstraktionsnivåer. De är inte projektfaser.

| Rad | 2003-affischen | Version 3.0 | Vad raden innehåller |
|---|---|---|---|
| R1 | Scope — Planner | Executive Perspective (Business Context Planners) · Scope Contexts | Listor: verksamhetens omfång och sammanhang |
| R2 | Business Model — Owner | Business Mgmt Perspective (Business Concept Owners) · Business Concepts | Konceptuella modeller av verksamheten |
| R3 | System Model — Designer | Architect Perspective (Business Logic Designers) · System Logic | Logiska modeller av informationssystemen |
| R4 | Technology Model — Builder | Engineer Perspective (Business Physics Builders) · Technology Physics | Fysiska, teknikberoende modeller |
| R5 | Detailed Representations — Subcontractor | Technician Perspective (Business Component Implementers) · Tool Components | Detaljerade specifikationer av komponenter |
| R6 | Functioning Enterprise | Enterprise Perspective (Users) · Operations Instances | Den fungerande verksamheten själv |

Vad är Planner? Planner är perspektivet på rad 1: den som avgör verksamhetens omfång och sammanhang, och vars beskrivningar är listor. Owner (rad 2) äger verksamheten och beskriver den i konceptuella modeller. Designer (rad 3) gör den logiska systemmodellen, Builder (rad 4) den tekniska modellen och Subcontractor (rad 5) de detaljerade delarna. Rad 6 är den fungerande verksamheten.

## Cellerna på 2003-affischen

| | K1 What | K2 How | K3 Where | K4 Who | K5 When | K6 Why |
|---|---|---|---|---|---|---|
| R1 | List of Things | List of Processes | List of Locations | List of Organizations | List of Cycles | List of Goals |
| R2 | Semantic Model | Business Process Model | Logistics Network | Work Flow Model | Master Schedule | Business Plan |
| R3 | Logical Data Model | Application Architecture | Distributed System Architecture | Human Interface Architecture | Processing Structure | Business Rule Model |
| R4 | Data Design | System Design | Technology Architecture | Presentation Architecture | Control Structure | Rule Design |
| R5 | Data Definition | Program | Network Architecture | Security Architecture | Timing Definition | Rule Specification |
| R6 | Data | Function | Network | Organization | Schedule | Strategy |

Varje cell på affischen har också ett begreppspar som visar vad modellen byggs av. Några exempel:

- **R2K1** Semantic Model: ENTITY = Business Entity, RELATION = Business Relationship.
- **R3K1** Logical Data Model: ENTITY = Data Entity, RELATION = Data Relationship.
- **R4K1** Data Design: ENTITY = Table/Segment, RELATION = Key/Pointer.
- **R2K4** Work Flow Model: PEOPLE = Organization Unit, WORK = Work Product.
- **R3K4** Human Interface Architecture: PEOPLE = Role, WORK = Deliverable.
- **R2K6** Business Plan: ENDS = Business Objective, MEANS = Business Strategy.

Alla 36 celler med begreppspar och namn i version 3.0 finns i Zachman-vyn.

## Så placerar man en modell

Att placera en modell eller beskrivning i rätt cell, och motivera valet, är två frågor:

1. **Vilken fråga besvarar beskrivningen?** Det ger kolumnen: saker och begrepp (Vad), processer och funktioner (Hur), platser och nätverk (Var), människor, roller och ansvar (Vem), tid, händelser och scheman (När), mål, strategier och regler (Varför).
2. **Vems perspektiv och vilken abstraktionsnivå?** Det ger raden: en lista hör till rad 1, en konceptuell modell av verksamheten till rad 2, en logisk systemmodell till rad 3, en teknisk eller fysisk modell till rad 4 och en detaljerad specifikation eller ett program till rad 5.

Några placeringar som går att läsa direkt av affischen:

- En lista över affärshändelser hör till **R1K5**: en lista (rad 1) om tid och händelser (När).
- Ett företags processmodell hör till **R2K2** (Business Process Model).
- En modell över verksamhetsregler hör till **R3K6** (Business Rule Model).
- En metod implementerad i Java hör till **R5K2** (Program).

Ibland passar två celler, och då är motiveringen det som räknas.

## Håll isär

| Påstående som låter rätt | Hur det är |
|---|---|
| Zachman är en metod | Zachman är en ontologi och ett klassificeringsschema |
| Raderna är projektfaser | Raderna är perspektiv eller abstraktionsnivåer |
| Man fyller i cellerna uppifrån och ned | Ramverket föreskriver ingen ordning |
| Varje cell kräver just den modellen | Varje cell är bara ett exempel på vilken sorts modell som kan användas |
| Zachman ger ADM, TOGAF ger ontologin | Tvärtom: Zachman klassificerar, TOGAF ger metoden (ADM) |
| Zachman och TOGAF konkurrerar | De kompletterar varandra |
`,
  },
  {
    id: "kap5",
    number: 5,
    title: "TOGAF and the ADM",
    readingMinutes: 5,
    lead: "TOGAF är vägledning och en metod för Enterprise Architecture, inte organisationens arkitektur. ADM är iterativ, inte ett vattenfall.",
    sources: [
      "Modul 5",
      "Föreläsningsbilder 13, 47–49 och 65–66",
      "Fastabellen: lärarens kursmaterial (Word-dokumentet), ADM-avsnittet",
      "Modul 12 (de tio begreppen)",
    ],
    body: `
## Kärnan

> The TOGAF Standard provides a body of guidance and an approach for Enterprise Architecture. The Architecture Development Method (ADM) provides an iterative approach to developing and managing architecture.

I modul 12:s tio begrepp: "TOGAF provides guidance and an approach for developing and governing Enterprise Architecture, including the ADM."

## TOGAF är inte arkitekturen

TOGAF är en standard och en samling vägledning. Organisationen måste fortfarande själv bestämma sin arkitektur, sina principer, sina prioriteringar, sin styrning, sitt målläge och sin väg dit. TOGAF tar inte fram de svaren åt någon:

> TOGAF is a tool for doing architecture; it is not the architecture of your enterprise.

TOGAF:s tionde utgåva skiljer på grundinnehåll (Fundamental Content) och ämnesspecifika serieguider (Series Guides), så att organisationer kan anpassa sitt arkitekturarbete efter sina förhållanden. Det finns inget enda rigitt sätt att arbeta med arkitektur. Organisationer skiljer sig i storlek, styrning, regelverk, arkitekturmognad, kultur, affärsmodell och förändringsbehov. Ramverket ger vägledning, men organisationen måste anpassa (tailor) arbetet efter sina omständigheter.

## ADM:s faser

Lärarens förenklade bild av ADM:

| Fas | Namn | Frågan (lärarens kursmaterial) |
|---|---|---|
| Preliminary | Preliminary | Hur ska vi arbeta med arkitektur? Före arkitekturen behövs förmågan att göra arkitektur |
| A | Architecture Vision | Vad försöker vi uppnå, varför spelar det roll och vilken är den arkitektoniska riktningen? |
| B | Business Architecture | Hur måste verksamheten förändras? |
| C | Information Systems Architectures | Data Architecture och Application Architecture: vilken information och vilka applikationsförmågor kräver verksamhetsarkitekturen? |
| D | Technology Architecture | Vilka teknikförmågor krävs för att stödja informationssystemen och verksamhetsarkitekturen? |
| E | Opportunities and Solutions | Hur kan förändringarna organiseras i genomförbara initiativ? |
| F | Migration Planning | I vilken ordning ska förändringen ske? |
| G | Implementation Governance | Håller genomförandet sig i linje med den avsedda arkitekturen? |
| H | Architecture Change Management | Vad har ändrats, och behöver arkitekturen ändras med det? |

Kravhanteringen (Requirements Management) pågår genom alla faser.

**Architecture Vision** ska etablera en gemensam övergripande bild av den önskade riktningen och säkra intressenternas engagemang. Den specificerar inte varje detalj.

**Implementation Governance** betyder inte att arkitekter styr varje implementationsbeslut. Den betyder att arkitekturens avsikt och verkligheten i genomförandet hålls i linje.

## ADM är inte ett vattenfall

Ser man faserna i rad kan man tro att ADM är ett vattenfall: Preliminary, Vision, Business, Data/Application, Technology, Migration, Implementation. Men ADM är tänkt att vara iterativ. Arkitekturen utvecklas eftersom:

- antagandena ändras
- verksamhetens prioriteringar ändras
- tekniken ändras
- intressenterna lär sig
- genomförandet ger återkoppling

Därför behöver arkitekturarbetet återkopplingsslingor. Iterationerna kan ske över hela enterprisen, över förmågor, produkter och portföljer och inom enskilda initiativ. Det blir särskilt viktigt när TOGAF kombineras med agilt arbete (kapitel 9).

## Nuläge, målläge och övergång

Ett av de mest praktiska begreppen i arkitektur:

| Begrepp | Frågan |
|---|---|
| Baseline architecture | Var är vi nu? (de relevanta delarna av nuläget) |
| Target architecture | Var vill vi vara? |
| Transition architectures | Hur kommer vi dit utan att förstöra organisationen på vägen? |

Övergångsarkitekturerna är praktiska mellanlägen mellan nuläge och målläge. Det är här, säger läraren, som Enterprise Architecture blir en förändringsdisciplin och inte bara en dokumentationsdisciplin. Mer i kapitel 11.

## ADM:s roll

ADM ger ett strukturerat sätt att ta fram, kommunicera, styra och utveckla arkitekturen. Den leder från visionen, via domänarkitekturerna, möjligheterna och migreringen, till styrningen av genomförandet, och tillåter iteration och anpassning hela vägen.

## Håll isär

| Påstående som låter rätt | Hur det är |
|---|---|
| ADM är ett rigitt vattenfall som körs en gång | ADM stödjer iteration och anpassning |
| TOGAF är organisationens målarkitektur | TOGAF är ett verktyg för att göra arkitektur |
| TOGAF anger exakt vilken arkitektur alla ska ha | Organisationen anpassar arbetet efter sitt sammanhang |
| ADM är en livscykel för mjukvaruutveckling | ADM är en metod för att ta fram och utveckla EA |
| TOGAF klassificerar beskrivningar | Det gör Zachman; TOGAF ger metoden |
`,
  },
  {
    id: "kap6",
    number: 6,
    title: "Architecture Domains and Views",
    readingMinutes: 4,
    lead: "De fyra domänerna är inga silor, och olika intressenter behöver olika vyer. En viewpoint är reglerna för en vy; en view är det man faktiskt ser.",
    sources: ["Modul 6", "Föreläsningsbilder 53–55"],
    body: `
## De fyra domänerna

| Domän | Innehåll |
|---|---|
| Business Architecture | Förmågor, processer, organisation, värde och verksamhetstjänster (business services) |
| Data Architecture | Information, datastrukturer, ägarskap, styrning och flöden |
| Application Architecture | Applikationer och applikationstjänster |
| Technology Architecture | Infrastruktur, plattformar, nätverk och tekniktjänster |

En förmåga är tydligt en fråga för verksamhetsarkitekturen. Informationsägarskap och datastrukturer hör till dataarkitekturen. CPU-arkitektur, databasindex och serverkonfiguration hör till teknik- och applikationsnivån, inte till verksamheten.

## Domänerna är inga silor

Lärarens viktigaste varning i modulen: domänerna är inte oberoende. De intressanta arkitektoniska frågorna gäller deras relationer. Domänerna är användbara just därför att relationerna mellan dem kan analyseras.

- **Relationer avslöjar beroenden, påverkan och följder av förändring.** Vet man att en förmåga beror på vissa processer, viss information och vissa applikationer och tekniker kan man bedöma hur en förändring sprider sig genom enterprisen.
- **Det är farligt att designa domänerna var för sig.** En verksamhetsförändring kan kräva förändringar i information, applikationer och teknik. Designas domänerna oberoende kan resultatet bli inkonsekvenser, dubblerade förmågor och lösningar som inte stöder verksamhetens mål.
- **Lärarens exempel:** en förmåga stöds dåligt av flera splittrade applikationer. Då är relationen mellan verksamhets- och applikationsarkitekturen det mest användbara perspektivet, inte en enskild domän.

## Intressenterna och deras frågor

Arkitektur görs i sista hand för intressenterna, och de har radikalt olika frågor:

| Intressent | Frågan |
|---|---|
| CEO | Hur hjälper det här vår strategi? |
| CFO | Vad kommer det att kosta? |
| CIO | Vilka teknikförmågor behöver vi? |
| CISO | Vilka är riskerna? |
| Produktchef | Vilket kundvärde skapar det här? |
| Utvecklare | Hur implementerar jag det? |

Alla frågorna är legitima. Därför kräver arkitektur flera vyer och viewpoints. Det knyter an till både Zachman (perspektiven) och TOGAF.

## View och viewpoint

> A viewpoint defines how a particular stakeholder concern should be addressed and represented. A view is the actual representation created using that viewpoint.

Förenklat: **viewpoint = reglerna eller perspektivet för hur man tittar; view = det man faktiskt ser och dokumenterar.** Flera vyer behövs eftersom olika intressenter behöver olika information och olika abstraktionsnivåer, inte för att arkitekturen ska innehålla så många diagram som möjligt.

## Spårbarhet

Ett av de mest värdefulla begreppen i seriöst arkitekturarbete är spårbarhet (traceability): går ett beslut att spåra tillbaka till verksamhetsskälet som orsakade det? Lärarens kedja:

> Strategy: "Reduce customer onboarding time" → Capability: "Digital customer onboarding" → Requirement: "Automated identity verification" → Architecture: Identity verification service → Implementation: specific technology/service

Då kan man fråga "varför kör vi den här tekniken?" och följa svaret hela vägen tillbaka till strategin.

## Håll isär

| Påstående som låter rätt | Hur det är |
|---|---|
| View och viewpoint är samma sak | Viewpoint = reglerna för vyn; view = representationen |
| Domänerna ska behandlas som silor | Det intressanta är relationerna mellan dem |
| Alla intressenter har samma frågor | Olika intressenter behöver olika vyer |
| Verksamhetsarkitekturen är underordnad tekniken | Tekniken relateras till verksamheten, inte tvärtom |
`,
  },
  {
    id: "kap7",
    number: 7,
    title: "Capabilities, Value Streams and Business Architecture",
    readingMinutes: 4,
    lead: "En förmåga är vad organisationen kan göra, en process hur arbetet utförs och ett värdeflöde hur värde skapas och levereras. Förmågorna är den stabila bron mellan strategi och arkitektur.",
    sources: ["Modul 7 (fråga 1–19, 23, 25–26)", "Föreläsningsbilder 29–31", "Modul 12 (de tio begreppen och fråga 35)"],
    body: `
## Kärnan

| Begrepp | Lärarens definition |
|---|---|
| Capability | What the organization is capable of doing |
| Process | How the organization performs activities, how work is performed |
| Value stream | How value is created and delivered to a stakeholder |

Läraren kallar förmågan "ett av de begrepp jag skulle anse absolut nödvändigt". En förmåga föreskriver inte hur den genomförs. Processen kan ändras medan den underliggande förmågan finns kvar.

På föreläsningen formuleras processen en gång som "what the organization does". Modulerna, modul 12 och frågorna säger genomgående **how** work is performed, och det är den formuleringen som gäller.

**Lärarens exempel:** processen "Approve a mortgage application" och förmågan "Mortgage underwriting".

## Ett exempel i hela kedjan

- **Strategi:** "Become the easiest bank for first-time home buyers."
- **Förmåga:** Digital Mortgage Origination.
- **Värdeflöde:** Discover → Apply → Verify → Approve → Complete.
- **Processer:** genomför delar av värdeflödet.

Förmågan leder i sin tur till vilken information, vilka applikationer, processer, människor och vilken teknik som krävs. Det är här arkitekturen blir strategiskt användbar.

## Varför förmågor är kraftfulla

Förmågor kan förbli relativt **stabila** även när organisationsstrukturer och processer ändras. De ger därför en stabil bro mellan strategi, verksamhet, arkitektur och investering.

- **Lärarens exempel på stabilitet:** ett företag omorganiserar marknadsavdelningen tre gånger på fem år, men behöver hela tiden kundinsikt, kampanjhantering och marknadsanalys. Organisationen kan ändra *vem* som utför förmågan utan att förmågan försvinner.
- **Därför är förmågekartor användbara vid omorganisation.** Avdelningar kan ändras medan de underliggande förmågorna finns kvar, och arkitekten kan fokusera på vad organisationen måste kunna göra i stället för tillfälliga strukturer.
- **Förmågor kan kopplas till** processer, människor, information, applikationer och teknik. Därför kan arkitekten spåra strategiska mål till arkitektur- och investeringsbeslut.
- **Capability-based planning:** strategin anger önskade utfall och prioriteringar. De förutsätter förmågor som enterprisen måste ha eller stärka, och arkitekten analyserar sedan vilka människor, processer, information, applikationer och teknik som krävs. Det hjälper också till att hitta förmågeglapp (capability gaps) oberoende av dagens organisationsgränser.

En förmågekarta är en viktig verksamhetsrepresentation, men den är inte en fullständig Enterprise Architecture.

## Verksamhetsarkitektur är inte IT-arkitektur

Läraren gör det nästan till en regel: **om allt i ditt EA-diagram är applikationer eller teknik gör du förmodligen IT-arkitektur, inte Enterprise Architecture.** Verksamhetsarkitekturen ska ta upp förmågor, värdeflöden, organisation, verksamhetstjänster, affärsprocesser, kunder, produkter, affärsmodeller och strategi. Tekniken relateras till dem i efterhand.

## Namnet avgör inte

Är "Customer onboarding" en förmåga eller en process? Lärarens svar i modul 12 är att det beror på modelleringssammanhanget:

- "Verify customer identity": process eller aktivitet.
- "The organization is able to onboard customers": förmåga.
- "Customer onboarding": kan vara antingen förmåga eller process.
- "Digital onboarding": kan vara en förmåga, ett steg i ett värdeflöde eller ett lösningssammanhang.

> Names alone don't determine the architectural concept. Context matters.

På flervalsfrågorna är mönstret ändå tydligt. "Digital customer onboarding" och "Mortgage origination" är förmågor. "Click Apply", "Send email confirmation" och "REST API" är det inte.

## Håll isär

| Påstående som låter rätt | Hur det är |
|---|---|
| Förmåga och process är utbytbara | Förmågan är vad man kan göra; processen hur arbetet utförs |
| En förmåga beskriver aktiviteternas ordning | Det är processperspektivet |
| Processer är strategiska, förmågor operativa | Förmågorna är den stabila bron mot strategin |
| En förmåga är en avdelning eller en applikation | Förmågan finns kvar när avdelningar och system byts |
| En förmågekarta är hela EA | Den är en representation bland flera |
| Ett värdeflöde är ett tekniskt diagram | Värdeflödet visar hur värde skapas och levereras till en intressent |
`,
  },
  {
    id: "kap8",
    number: 8,
    title: "Principles, Governance and Decisions",
    readingMinutes: 4,
    lead: "Principer är varaktig vägledning för beslut, styrning är beslutsrätter och ansvar. Rätt utformade blir de guardrails som gör team snabbare, inte långsammare. Arkitektur är att hantera avvägningar.",
    sources: [
      "Modul 8",
      "Modul 7, fråga 20–22, 24 och 27 (lärarens not: modul 8:s frågor ligger insprängda i modul 7)",
      "Föreläsningsbilder 50–52, 63 och 84–87",
      "Modul 12 (de tio begreppen)",
    ],
    body: `
## Principer

En arkitekturprincip är en generell regel eller riktlinje som vägleder arkitekturbeslut. I modul 12:s tio begrepp: "A principle provides enduring guidance for architectural decisions."

Lärarens exempel: **"Information is an enterprise asset."** Den enda principen kan påverka hundratals beslut om:

- dataägarskap
- applikationsdesign
- integration
- styrning
- säkerhet
- investeringar

I stället för att granska varje beslut för sig ger principerna vägledning och guardrails. Det är särskilt viktigt när man går från traditionell arkitekturstyrning till agila, produktorienterade och decentraliserade organisationer. Ett annat exempel är **"Prefer reusable enterprise capabilities over duplicate implementations."** Den låter team fatta många beslut utan central godkännande.

## Styrning

> Governance answers: Who has the authority to make which decisions, under what constraints?

I modul 12: "Governance establishes decision rights, accountability, direction and control." Arkitekturstyrning (architecture governance) handlar om att fastställa beslutsrätter, ansvar och lämpliga kontroller för arkitekturbeslut. Målet är lämpligt beslutsfattande, ansvar och kontroll, inte maximal byråkrati, borttagen autonomi eller att allt tekniskt centraliseras.

### Governance och management

| | Frågan |
|---|---|
| Management | "Are we executing the plan?" |
| Governance | "Are we making the right decisions, within appropriate boundaries, and achieving the intended outcomes?" |

God arkitekturstyrning ger en tydligare bild av beslutsrätter, ansvar, principer, policyer, eskaleringsvägar och riskhantering.

### Beslutsrätter

Arkitekturstyrningen ska göra tydligt:

- Vem beslutar?
- Vad får teamen besluta själva?
- Vad kräver eskalering?
- Vad kräver godkännande på enterprisenivå?
- Vilka principer får inte brytas?

Tydliga beslutsrätter ökar farten.

### Agil styrning och arkitekturgranskning

Traditionell styrning frågar "följde du processen?". Agil styrning frågar om vi fattar rätt beslut, hanterar risken och levererar de avsedda utfallen.

En arkitekturgranskning ska fokusera på betydande beslut, risk, beroenden, säkerhet, regelefterlevnad, påverkan på enterprisen och långsiktiga konsekvenser. Den ska inte granska varje liten implementationsdetalj.

## Guardrails

Guardrails är gränser inom vilka team kan röra sig snabbt. Exempel:

- säkerhetsprinciper
- teknikstandarder
- datapolicyer
- integrationsprinciper
- regulatoriska krav
- arkitekturprinciper

Bra guardrails möjliggör autonomi. Ett exempel på en lämplig guardrail är att alla system ska följa definierade säkerhets- och integrationsprinciper. Ett olämpligt exempel är att varje team måste be arkitekten om lov att skriva kod.

## Hur styrning kan öka agiliteten

Tydliga principer är återanvändbar beslutsvägledning. Team kan fatta många beslut på egen hand utan att be om godkännande varje gång, så länge de håller sig inom de överenskomna gränserna. Styrningen kan i stället fokusera på betydande risker, beroenden över hela enterprisen och strategiska beslut. Det ger guardrails inom vilka teamen kan röra sig snabbt.

## Avvägningar

Arkitektur innebär nästan alltid avvägningar (trade-offs) snarare än perfekta lösningar:

| Val | Fördel | Kostnad eller risk |
|---|---|---|
| Standardisering | Effektivitet | Mindre flexibilitet |
| Flexibilitet | Anpassningsförmåga | Komplexitet |
| Centralisering | Kontroll | Långsammare beslut |
| Decentralisering | Agilitet | Dubblering |
| Säkerhet | Minskad risk | Friktion och kostnad |
| Snabbhet | Snabbt värde | Möjlig teknisk skuld |

> Architecture is the management of trade-offs.

Arkitektens jobb är inte att hitta lösningen utan nackdelar. Det är att göra avvägningarna explicita och lämpliga för enterprisens mål.

## Håll isär

| Påstående som låter rätt | Hur det är |
|---|---|
| Styrning betyder att allt godkänns centralt | Styrning är beslutsrätter, ansvar och lämpliga kontroller |
| God styrning kräver godkännande av varje tekniskt beslut | Rutinbeslut delegeras; betydande beslut granskas |
| Governance och management är samma sak | Management: följer vi planen? Governance: fattar vi rätt beslut inom rätt gränser? |
| En princip är en detaljerad teknisk lösning | En princip är varaktig vägledning för beslut |
| Det finns en perfekt arkitektur | Arkitektur är att hantera avvägningar |
`,
  },
  {
    id: "kap9",
    number: 9,
    title: "Architecture and Agile",
    readingMinutes: 6,
    lead: "Agilt betyder inte att arkitekturen behövs mindre, utan att den måste bli mer lyhörd: just enough, iterativ och med guardrails i stället för grindar.",
    sources: ["Modul 9", "Föreläsningsbilder 12, 14–20, 58, 60–71 och 88–90"],
    body: `
## Kärnan

Agilt betyder inte "arkitektur behövs inte". Det betyder att arkitekturen måste rymma:

- iteration
- återkoppling
- ändrade prioriteringar
- inkrementell leverans
- lärande

Arkitekturen ska ge tillräcklig riktning utan att försöka förutsäga varje detalj ett år i förväg. Lärarens formulering:

> If we are Agile, architecture must become more responsive.

Arkitekturen ger fortfarande riktning, begränsningar, återanvändbara förmågor, integrationsprinciper, teknikval, riskhantering och beslutsstöd.

## Varför det spelar roll

Organisationer möter snabb teknikutveckling, nya digitala affärsmodeller, kortare produktlivscykler, högre kundförväntningar, ständigt nya regler, komplexa äldre miljöer och ett växande beroende av digitala plattformar. Kärnfrågan blir: **hur kan Enterprise Architecture möjliggöra förändring utan att själv bli ett hinder för förändring?**

Organisationen behöver två saker samtidigt:

| Stabilitet | Förändring |
|---|---|
| Principer | Experimenterande |
| Styrning | Innovation |
| Standarder | Agil leverans |
| Delade förmågor | Digitala produkter |
| Arkitektonisk samstämmighet | Kontinuerlig transformation |

Arkitekturen ska ge guardrails utan att bli en flaskhals.

## Agile och Enterprise Agility

- **Agil utveckling** handlar om hur team utvecklar och levererar produkter.
- **Enterprise Agility** handlar om hur hela organisationen svarar på förändring: strategi, organisation, styrning, finansiering, portföljhantering, arkitektur, produktledning, teknik och leverans.

Enterprise Agility är organisationens förmåga att:

- uppfatta förändringar
- besluta snabbt
- mobilisera resurser
- anpassa förmågor
- leverera värde snabbt
- lära kontinuerligt

En agil enterprise har ofta snabba beslut, självständiga team, kontinuerligt lärande, korta återkopplingscykler, produkttänkande, inkrementell leverans, kundfokus och adaptiv planering.

## Från projekt till produkter

| Projekttänkande | Produkttänkande |
|---|---|
| Tillfällig organisation | Bestående team |
| Avgränsat scope | Kontinuerlig investering |
| Start- och slutdatum | Kundutfall |
| Leveransorienterat | Kontinuerlig utveckling |

Arkitekturen måste därför stödja produkterna under hela deras livscykel.

## Kontinuerlig arkitektur

Det traditionella flödet är **Strategy → Architecture → Projects → Implementation**. I en agil, digital enterprise blir det **Strategy ↔ Architecture ↔ Products ↔ Delivery ↔ Feedback**, och relationerna blir kontinuerliga.

Arkitekten står inte utanför leveransen och delar ut instruktioner. Hen blir en del av organisationens förmåga att uppfatta, besluta, förändra, lära och anpassa sig (sense → decide → change → learn → adapt). Kontinuerlig arkitektur behövs eftersom krav, teknik och affärsvillkor ändras.

Agil arkitektur ska vara:

- just enough
- just in time
- iterativ
- inkrementell
- samarbetande
- utfallsorienterad
- återanvändbar
- anpassningsbar

### Just enough architecture

Undvik Big Architecture Up Front. Sikta i stället på en minsta livskraftiga arkitektoniska riktning (minimum viable architectural direction). Just enough architecture betyder bara den arkitektur som behövs för att ge lämplig riktning och hantera betydande risker och beroenden. Målet är att fatta de beslut som behövs för nästa meningsfulla inkrement av värde.

### Beslutshorisonter

| Horisont | Beslut |
|---|---|
| Lång sikt | Enterpriseprinciper, strategiska förmågor, större plattformar |
| Mellanlång sikt | Målarkitekturer, färdplaner, övergångsarkitekturer |
| Kort sikt | Produktbeslut, lösningsbeslut, beslut på iterationsnivå |

### Centraliserad eller federerad arkitektur

| | Fördelar | Risker |
|---|---|---|
| Centraliserad | Samstämmighet, stark styrning, överblick över enterprisen | Långsamma beslut, flaskhalsar, avstånd till leveransteamen |
| Federerad | Snabbhet, lokalt ägarskap, linjering med produkterna | Dubblering, fragmentering, inkonsekventa beslut |

Målet är en lämplig balans.

### Arkitekturskuld

Architecture debt är ackumulerade arkitektoniska kompromisser som kan ge framtida kostnader, risker eller begränsningar.

## ADM i en agil miljö

ADM är iterativ (kapitel 5). Iterationerna kan ske över enterprisen, förmågorna, produkterna och portföljerna, och inom enskilda initiativ. Lärarens kedja för samspelet:

> Enterprise direction → Architecture iteration → Product / capability iteration → Sprint / increment → Feedback → Architecture adaptation

Inbäddat i allt detta finns arkitektrollens förmåga att lyfta fram behovet av förändring.

## Arkitektursprintar och backlog (bakgrund)

Läraren har inga modulfrågor om det här, men det finns på föreläsningen.

**En arkitektursprint** är en kort iteration kring en arkitektonisk fråga:

1. Fastställ målet.
2. Identifiera intressenterna.
3. Definiera den arkitektoniska frågan.
4. Ta fram ett arkitekturinkrement.
5. Granska.
6. Få återkoppling.
7. Förfina.
8. Publicera eller använd resultatet.

**En arkitekturbacklog** innehåller bland annat:

- arkitekturbeslut
- teknisk skuld
- förmågeglapp
- arkitekturrisker
- standarder och principer
- komponenter i målläget
- teknikutredningar
- krav på arkitekturens "runway"

**Backlogarna ska kopplas ihop.** Produktbackloggen svarar på vilket värde produkten ska leverera. Arkitekturbackloggen svarar på vilket arkitekturarbete som krävs för att leverera det värdet hållbart.

**Arkitekturen i sprintarna:**
- Före leverans ger den riktning, begränsningar och beslut.
- Under leverans ger den vägledning, granskningar och beslut.
- Efter leverans bidrar den med lärande, arkitekturens utveckling och hantering av teknisk skuld.

## Arkitekten som möjliggörare

| Traditionell roll | Ny roll |
|---|---|
| Arkitekten som auktoritet | Arkitekten som möjliggörare (enabler) |

Arkitekten faciliterar alltmer beslut, kopplar ihop intressenter, coachar team, sätter guardrails, hanterar arkitektonisk risk, möjliggör återanvändning och kommunicerar avvägningar.

Arkitekten är också en integratör mellan verksamhet, produkt, arkitektur, teknik och drift. Värdet kommer av att förstå relationerna snarare än att optimera en domän.

En effektiv arkitekt talar olika med olika mottagare:

| Mottagare | Arkitekten talar om |
|---|---|
| Ledning | Affärsutfall |
| Produkt | Kundvärde |
| Utveckling | Tekniska beslut |
| Säkerhet | Risk |
| Drift | Påverkan på driften |
| Ekonomi | Investering och värde |

## Arkitektens tänkande

Lärarens övning: du är Enterprise Architect, och vd:n säger "vårt problem är att vi har för många applikationer". Vilka frågor ställer du innan du godtar diagnosen?

- Vilka förmågor berörs?
- Vilka applikationer stöder dem?
- Är dubbleringen faktiskt ett problem?
- Är applikationerna överflödiga eller avsiktligt olika?
- Vilka affärsutfall påverkas?
- Vilken information är dubblerad?
- Vilka är kostnaderna och riskerna?
- Vilket strategiskt mål driver oron?

## Håll isär

| Påstående som låter rätt | Hur det är |
|---|---|
| Agilt betyder att arkitekturen överges | Agilt kräver en mer lyhörd arkitektur |
| Arkitekturen blir klar innan utvecklingen börjar | Arkitekturen utvecklas iterativt med riktning och guardrails |
| Just enough betyder ingen arkitektur | Just enough betyder den arkitektur som behövs för riktning och betydande risker |
| Agilitet kräver att allt centraliseras | Centralisera allt och arkitekten blir en flaskhals |
| Enterprise Agility gäller bara mjukvaruutveckling | Den gäller hela organisationen |
`,
  },
  {
    id: "kap10",
    number: 10,
    title: "Digital Transformation",
    readingMinutes: 5,
    lead: "Digitization, digitalization och digital transformation är tre olika saker. Transformation handlar om hur enterprisen skapar och levererar värde; tekniken är en möjliggörare, inte transformationen.",
    sources: ["Modul 10", "Föreläsningsbilder 57 och 72–83", "Modul 12 (de tio begreppen)"],
    body: `
## Tre begrepp

| Begrepp | Lärarens definition | Exempel |
|---|---|---|
| Digitization | Converting analog information into digital form | Skanna ett pappersdokument till PDF |
| Digitalization | Using digital technologies to improve existing activities and processes | Automatisera en befintlig process med mjukvara |
| Digital transformation | Using digital capabilities to fundamentally change how an enterprise creates, delivers and captures value | Förändra affärsmodell och kundupplevelse i grunden |

I modul 12:s tio begrepp: "Digital transformation involves using digital capabilities to fundamentally change how an enterprise operates and creates or delivers value."

> Technology alone does not constitute transformation.

## Vad digital transformation är och inte är

Digital transformation är inte "låt oss köpa lite ny teknik". Frågan är hur digitala förmågor i grunden förändrar sättet enterprisen skapar och levererar värde. Det kan gälla affärsmodellen, kundupplevelsen, verksamhetsmodellen, data, produkterna, plattformarna, ekosystemen, automatiseringen, AI och organisationen.

Det är **inte bara**:

- att flytta applikationer till molnet
- att automatisera processer
- att skapa en mobilapp
- att köpa ny teknik

Det handlar om att förändra hur enterprisen skapar värde, engagerar kunder, arbetar, fattar beslut, använder information och levererar produkter och tjänster. **Tekniken är en möjliggörare, inte transformationen.**

- **Molnmigrering är inte automatiskt digital transformation.** Att flytta tekniken ändrar inte nödvändigtvis hur enterprisen skapar eller levererar värde. Molntjänster kan ge elasticitet, snabbhet, automatisering, förmågor på begäran, global räckvidd och konsumtionsbaserad ekonomi. Men molnet ensamt är inte transformation.
- **AI krävs inte för varje transformation.**
- **Vad ska driva ett transformationsinitiativ?** Ett tydligt förstått affärsutfall och strategiskt mål. Inte teknikmode, leverantörers marknadsföring, en ny databas eller arkitekturverktyget.

## Varför transformation är en EA-fråga

Digital transformation kan påverka:

- affärsmodeller
- förmågor
- värdeflöden
- organisationsstrukturer
- information
- applikationer
- teknik

Eftersom förändringarna hänger ihop kräver de ett arkitektoniskt perspektiv över hela enterprisen, inte ett isolerat teknikinitiativ.

## Den digitala enterprisen

En digital enterprise använder digitala förmågor som en integrerad del av sin affärsmodell, och transformationen kan därför förändra organisationens ekonomiska modell. Exempel:

- digitala produkter och kanaler
- datadrivna beslut
- ekosystemplattformar
- automatiserad drift
- AI-baserade tjänster
- molnbaserade förmågor

Digitala enterprises organiserar sig alltmer kring kunderna i stället för kring den interna strukturen. Arkitekturen behöver därför koppla ihop kundresor, förmågor, värdeflöden, produkter och teknik.

## Arkitektens digitala frågor

Enterprisearkitekten behöver bland annat beakta:

- digitala plattformar
- API:er
- moln
- data
- AI
- automatisering
- integration
- cybersäkerhet
- kundupplevelse
- ekosystem

Tre av dem lyfter läraren särskilt:

- **Data som strategisk tillgång:** dataägarskap, datakvalitet, metadata, masterdata, dataprodukter, datastyrning, datadelning och analys. Arkitekten ska behandla data som en förmåga för hela enterprisen, inte bara som en applikationsfråga.
- **Plattformstänkande:** en plattform ger återanvändbara förmågor till flera produkter, som identitet, betalningar, kunddata, integration, analys och digitala kanaler. Principen är att bygga en återanvändbar förmåga en gång och använda den många gånger.
- **API:er och ekosystem:** API:er möjliggör återanvändning, integration, samarbete med partner, sammansättning av produkter och deltagande i ekosystem. Arkitekturen sträcker sig därmed alltmer utanför organisationens gränser (jämför kapitel 1).

## Teknikadoption (bakgrund)

Läraren har inga modulfrågor om detta. Det finns på föreläsningen.

- **Adoption är ett affärsbeslut.** Frågan är inte om tekniken är intressant, utan om den kan skapa meningsfullt affärsvärde i vårt sammanhang.
- **Mognaden (technology readiness)** bedöms på flera faktorer: affärsrelevans, organisatorisk beredskap, kompetens, arkitektonisk kompatibilitet, säkerhet, regelverk, investering, driftförmåga och ekosystemets mognad.
- **Livscykeln:** Explore → Assess → Experiment → Validate → Adopt → Scale → Retire/Replace. Inte varje ny teknik ska nå adoption, och det finns ett politiskt arbete bakom besluten om att förändra.
- **Teknikradarn** klassar teknik som Explore (värd att undersöka), Trial (värd att experimentera med), Adopt (rekommenderad för lämplig användning) eller Hold (inför inte utan tungt vägande skäl).

## Håll isär

| Påstående som låter rätt | Hur det är |
|---|---|
| Att skanna dokument är digital transformation | Det är digitization |
| Att automatisera en befintlig process är transformation | Det är digitalization |
| Digital transformation är i grunden en teknikfråga | Den handlar om hur värde skapas och levereras |
| Molnmigrering är digital transformation | Den kan möjliggöra transformation men utgör den inte |
| Transformation kräver AI | AI kan vara en möjliggörare men är inget krav |
`,
  },
  {
    id: "kap11",
    number: 11,
    title: "Enterprise Architecture in Practice",
    readingMinutes: 5,
    lead: "Lärarens fall med den traditionella banken som vill bli digital på två år: börja med syftet, inte tekniken, och ta dig från nuläge till målläge via övergångsarkitekturer.",
    sources: ["Modul 11", "Föreläsningsbilder 49 och 91–101", "Modul 5 (nuläge, målläge, övergång)"],
    body: `
## Fallet: en traditionell bank

Banken har:

- flera kunddatabaser
- en 25 år gammal kärnbankplattform
- fristående digitala kanaler
- långsamma releasecykler
- många dubblerade applikationer
- ökande konkurrens från digitala banker

Vd:n säger: **"We need to become a digital bank within two years."** Uppgiften är att analysera situationen ur ett EA-perspektiv.

## Vad arkitekten ser

- **En strategiskt viktig förmåga** är digital kundonboarding (digital customer onboarding). Serverunderhåll, databasindexering, nätverkskablage och deploymentskript är det inte.
- **Ett arkitektoniskt problem** är splittrad kundinformation. Diagramfärger, olika tangentbord och olika skärmstorlekar är det inte.
- **En lämplig princip** är att kundinformation ska behandlas som en tillgång för hela enterprisen. Olämpligt vore att varje avdelning äger sin egen kunddefinition, att varje projekt väljer sina egna säkerhetsregler eller att alla applikationer måste använda den nyaste tekniken.

## Varför inte byta allt på en gång?

Att ersätta hela kärnbanksystemet direkt är riskabelt. Kärnsystemet kan bära kritiska förmågor och innehålla komplexa beroenden, och en big bang-ersättning kan ge stora operativa, finansiella och affärsmässiga risker. Inkrementella övergångsarkitekturer låter banken modernisera och samtidigt fortsätta leverera värde.

- **Målarkitekturen** ger en sammanhängande riktning för det önskade framtida läget. Den är ingen perfekt förutsägelse av varje framtida detalj, ingen leverantörslista och inte bara en tidplan.
- **Övergångsarkitekturerna** är praktiska mellanlägen som låter organisationen gå från nuläge (baseline) mot målläge (target) och samtidigt fortsätta verksamheten och leverera värde. Det är här EA blir en förändringsdisciplin.

## Anti-mönstret

> Selecting a technology platform before establishing the business objectives, required capabilities and architectural constraints.

Innan arkitekten väljer teknik ska hen ha fastställt de strategiska målen, de önskade kundutfallen, de förmågor som krävs, de nuvarande begränsningarna, intressenternas frågor och arkitekturprinciperna.

## En arkitektonisk ansats för banken

Lärarens modellsvar i ordning:

1. Klargör de strategiska målen och de önskade kundutfallen.
2. Bedöm nuläget: förmågor, värdeflöden, information, applikationer och teknik.
3. Låt en målarkitektur ange riktningen, med stöd av arkitekturprinciper och styrning.
4. Ersätt inte alla äldre system samtidigt. Identifiera övergångsarkitekturer och prioritera initiativen efter affärsvärde, risk och beroenden.
5. Använd agil leverans för att utveckla förmågorna inkrementellt medan arkitekturen utvecklas genom återkoppling och lärande.

**Agilt i transformationen:** transformationen kan organiseras kring inkrementella produkter och förmågor, med arkitekturen som utvecklas parallellt med leveransen. Banken kan då lära sig, leverera värde tidigare och justera arkitekturbesluten när ny information kommer fram.

## Exemplet: från traditionell till digital bank

| Utgångsläge | Transformation |
|---|---|
| Äldre system | Digitala kanaler |
| Produktsilor | API:er |
| Batchbearbetning | Molnförmågor |
| Fysiska kanaler | Dataplattform |
| Långsamma releaser | Produktteam och kontinuerlig leverans |

Arkitektens roll är att ge övergångsvägen och samtidigt kontrollera risken och upprätthålla verksamhetens kontinuitet.

Lärarens andra exempel är en API-plattform för hela enterprisen. Affärsmålet är att snabbt kunna skapa digitala produkter. Svaret är en plattform med API:er, identitet, säkerhet, datatjänster, integration, övervakning och stöd för utvecklarna, så att teamen kan bygga produkter av återanvändbara förmågor.

## Att sätta ihop det

Enterprise Agility gör att organisationen kan förändras snabbt. Digital transformation förändrar vad organisationen förmår. Enterprise Architecture ger strukturen som kopplar ihop de två.

En mogen verksamhetsmodell kopplar ihop strategi → förmågor → värdeflöden → produkter → arkitektur → teknik → drift → återkoppling.

En praktisk transformationscykel:

1. Identifiera det strategiska målet.
2. Förstå dagens förmågor.
3. Identifiera förmågeglappen.
4. Definiera riktningen för målläget.
5. Prioritera utfallen.
6. Sätt arkitekturens guardrails.
7. Leverera inkrementellt.
8. Mät utfallen.
9. Lär.
10. Anpassa arkitekturen och strategin.

## Vanliga felsteg

Det här ska undvikas:

- att arkitekturen blir en grindvakt
- big design up front
- teknikdriven transformation
- överdriven styrning
- att ignorera de äldre systemens verklighet
- att se agilt som bara en utvecklingspraktik
- att se molnadoption som transformation
- brist på verksamhetsägarskap
- inga mätbara utfall

**God EA** har en tydlig strategisk riktning, lätt arkitekturstyrning, starka principer, självständiga team, återanvändbara plattformar, produktcentrerad leverans, kontinuerlig arkitektur, datadrivna beslut, effektiv teknikadoption och kontinuerligt lärande.

**Lärarens mognadsfrågor:**
- Hur snabbt kan arkitekturbeslut fattas?
- Kan produktteamen agera självständigt?
- Förstås arkitekturprinciperna?
- Finns återanvändbara förmågor?
- Är arkitekturen kopplad till strategin?
- Är den tekniska skulden synlig?
- Kan arkitekturen anpassas snabbt?
- Mäts utfallen?

## Håll isär

| Påstående som låter rätt | Hur det är |
|---|---|
| Ett gammalt system ska bytas för att det är gammalt | Bedöm värde, kritikalitet, teknisk hälsa, risk och kostnad (kapitel 12) |
| Målarkitekturen betyder att allt ändras direkt | Övergångsarkitekturerna finns för att transformationen tar tid |
| Börja med att jämföra molnleverantörer | Börja med mål, utfall, förmågor och principer |
| "Digital bank" betyder en mobilapp | Det kan kräva ändrad affärsmodell, verksamhetsmodell och kundresa |
`,
  },
  {
    id: "kap12",
    number: 12,
    title: "Integration and Examination Preparation",
    readingMinutes: 7,
    lead: "Start här: hur tentan ser ut, de tio begreppen, arkitektens test och fällorna i sant/falskt.",
    sources: ["Modul 12", "Föreläsningsbilder 59 och 102–103"],
    body: `
## Varför modul 12 är annorlunda

Modul 12 ber dig integrera begreppen från de elva tidigare modulerna. Målet är inte att komma ihåg definitioner, utan att kunna koppla ihop begrepp, skilja närliggande idéer och använda arkitektoniskt tänkande på realistiska situationer. Läraren säger uttryckligen att man ska börja med modul 12. De tio begreppen som ska kunnas utan att slå upp dem står i sammanfattningen.

## Den stora bilden

En arkitektur ger ett sätt att förstå:

- vad som finns
- varför det finns
- hur saker hänger ihop
- vad som behöver ändras
- vilka konsekvenser förändringen får
- hur förändringen kan styras

Lärarens mentala modell går från omvärlden till utfallen och tillbaka:

> Business environment → Strategy → Capabilities → Value streams → Architecture (Business, Information, Technology) → Solutions → Implementation → Outcomes → Feedback → back to Strategy

Kedjan mellan strategi och genomförande, som en av flervalsfrågorna prövar, är **strategy → capabilities → architectural change → implementation → outcomes**. Den går aldrig från tekniken till strategin.

## Arkitektens test

Innan du rekommenderar en lösning, ställ fem frågor:

1. **Why?** Vilket affärsmål eller problem tar vi oss an?
2. **What?** Vilken förmåga, vilket värde, vilken information eller vilket utfall gäller det?
3. **Who?** Vilka är intressenterna och beslutsfattarna?
4. **How?** Vilken arkitektonisk förändring kan lösa problemet?
5. **What are the consequences?** Vilka är kostnaderna, riskerna, beroendena, avvägningarna och effekterna?

Läraren kallar det en användbar mental modell både för tentan och för verkligt arkitekturarbete.

## Tentafällorna

Var särskilt uppmärksam på påståenden med orden **always, never, only, must, automatically, completely, exclusively**. I Enterprise Architecture är de ofta tecken på att påståendet är för absolut. Lärarens exempel, alla falska:

- "Digital transformation always requires cloud technology."
- "Enterprise Architecture is exclusively about IT."
- "Every architecture decision must be approved centrally."

> Architecture is highly contextual.

## Zachman eller TOGAF?

| Påstående | Passar bäst |
|---|---|
| Classifying enterprise descriptions | Zachman |
| Architecture development approach | TOGAF |
| Six interrogatives | Zachman |
| ADM | TOGAF |
| Perspectives | Zachman |
| Architecture governance guidance | TOGAF |

Lärarens förbehåll: det betyder inte att TOGAF inte kan använda klassificeringar, eller att Zachman saknar betydelse för arkitekturarbetet. Poängen är var och ens huvudsakliga roll.

## Fem scenarier

| Scenario | Vad arkitekten gör | Lärdom |
|---|---|---|
| "We need AI" — vd:n vill ha en AI-strategi direkt | Förstår först affärsmålen och problemen AI ska lösa: utfall, förmågor, kundproblem, data, risker och regler, förändringar i processer och verksamhetsmodell, var AI kan ge värde. Först därefter utvärderas AI-tekniken | Börja inte med tekniken. Börja med syfte och utfall |
| 600 applikationer — CIO:n vill ner till 300 | Antalet är inte i sig ett arkitekturproblem. Undersök vilka förmågor de stöder, dubblerad funktionalitet, om dubbleringen är avsiktlig, kostnad, kritikalitet, teknisk risk, integrationskomplexitet, dubblerad data, säkerhet och strategisk relevans | Arkitektur ska lösa problem och utfall, inte godtyckliga siffror |
| Ett agilt team vill inte ha arkitekter inblandade | Avgör vilka beslut som verkligen kräver samordning på enterprisenivå och vilka som kan delegeras. Ge principer, standarder, guardrails, återanvändbara förmågor, referensarkitekturer, beslutsrätter och vägledning om betydande beroenden och risker | God styrning ska möjliggöra agilitet, inte begränsa den i onödan |
| Ett 30 år gammalt kärnbanksystem "ska bytas för att det är gammalt" | Ålder räcker inte. Bedöm affärsvärde, kritikalitet, teknisk hälsa, säkerhet, underhållbarhet, kostnad, förändringsbegränsningar, integrationsbegränsningar, alternativ och strategisk riktning. Svaret kan vara att ersätta, kapsla in, modernisera, flytta till ny plattform, avveckla eller fortsätta använda | Besluten ska bygga på belägg, inte på etiketter som "legacy" |
| En detaljist har lanserat en app och säger att transformationen är klar | Fråga om appen ändrat hur enterprisen skapar och levererar värde: kundupplevelse, nya produkter och tjänster, verksamhetsmodell, processer, datadrivna beslut, affärsmodell, ekosystem och organisatorisk förmåga | En ny digital kanal kan vara digitalization snarare än transformation |

## Slututmaningen

"Vårt företag behöver ett nytt CRM eftersom konkurrenterna har bättre CRM-system." Du är Enterprise Architect — vad gör du? En stark student svarar inte "låt oss utvärdera CRM-produkter". Hen börjar fråga:

- Vilket affärsproblem försöker vi lösa?
- Vilket strategiskt mål driver detta?
- Vilka förmågor påverkas?
- Hur ser kundresan ut i dag?
- Var finns förmågeglappen?
- Vilken information berörs?
- Vilka processer behöver ändras?
- Vilka applikationer stöder förmågorna i dag?
- Vilka arkitekturprinciper gäller?
- Vilka alternativ finns?
- Vilka är avvägningarna?
- Vad är målarkitekturen?
- Vilken övergång är realistisk?
- Hur ska förändringen styras?

Här går man, enligt läraren, från att lära sig terminologin till att tänka som en enterprisearkitekt.

## Slutchecklistan

Före tentan ska du kunna förklara utan anteckningar:

- **Grunderna:** vad en enterprise, arkitektur och EA är, hur EA skiljer sig från IT-arkitektur, varför relationer är viktiga och vad abstraktion är.
- **Verksamhetsarkitektur:** förmåga, process, värdeflöde, hur förmågor hänger ihop med strategi och varför de är användbara för transformation.
- **Zachman:** vad ramverket är, varför det är en ontologi och ett klassificeringsschema, de sex frågeorden, vad perspektiven står för och varför det inte är en metod.
- **TOGAF:** vad TOGAF och ADM är, varför ADM är iterativ, arkitekturdomänerna, arkitekturstyrning och arkitekturprinciper.
- **Agilitet:** agil arkitektur, just enough architecture, guardrails och hur styrning kan stödja agilitet.
- **Digital transformation:** digitization, digitalization, digital transformation, varför transformation är mer än teknik och hur EA stöder transformationen.
- **Arkitektoniskt tänkande:** analysera ett problem innan du väljer lösning, identifiera avvägningar, koppla strategi till genomförande, hantera nuläge, målläge och övergång, och kommunicera arkitektur till olika intressenter.

## Kursens fem kärnbudskap

1. **Architecture must enable change** — not prevent it.
2. **Agile applies beyond software** — Enterprise Agility requires organizational change.
3. **Digital transformation is business transformation** — technology is an enabler.
4. **Governance should create guardrails** — not unnecessary gates.
5. **Architecture must continuously evolve** — the target is not a static end-state.

Lärarens sista budskap: kursen ska inte lära dig att memorera ett ramverk. Den ska lära dig att se en enterprise som ett system, förstå dess syfte och struktur, känna igen relationer och beroenden, värdera arkitektoniska avvägningar och hjälpa organisationen att förändras med avsikt.

- Zachman ger ett sätt att tänka om enterprisens olika beskrivningar.
- TOGAF ger vägledning för att ta fram och utveckla arkitekturen.
- Förmågorna kopplar ihop strategin med vad enterprisen måste kunna göra.
- Styrningen ger beslutsramen.
- Agila arbetssätt låter arkitekturen utvecklas med förändringen.
- Digital transformation utmanar enterprisen att tänka om hur den skapar och levererar värde.
`,
  },
];

// Sammanfattningens avsnitt som inte redan står i modul 12-kortet eller i
// kapitel 12:s egen text läggs sist under modul 12:s "Läs mer".
function summarySections(titles) {
  const parts = summary.body.split(/\n(?=## )/);
  return parts.filter((part) => titles.some((title) => part.startsWith(`## ${title}`))).join("\n");
}
const KAP12_EXTRA = summarySections(["Det tentan skiljer på", "Zachman i korthet"]);

const byId = Object.fromEntries(rawChapters.map((chapter) => [chapter.id, chapter]));

// Kärnsvaret överst på modul 1–11, med raden om vilka modellsvar det bygger
// på (essäernas källa, t.ex. "Modul 1, fråga 9").
function karnsvarMarkdown(id) {
  const k = KARNSVAR[id];
  if (!k) return "";
  const labels = k.source.map((essayId) => essays.find((essay) => essay.id === essayId).source);
  const also = k.moduleText ? ` och ${k.moduleText}` : "";
  return `## Kärnsvaret\n\n${k.text}\n\n*Bygger på lärarens modellsvar till ${labels.join("; ")}${also}.*\n`;
}

// Kortet: Start här (modul 12) eller kärnsvaret, Håll isär och lärarens
// exempel; modul 4 får rutnätet (widget) och placeringarna under det.
// "Läs mer": det som stod på korten förut (LEARNING) och sedan modultexten.
export const chapters = CHAPTER_ORDER.map((id) => {
  const chapter = byId[id];
  const body = id === "kap12" ? `${chapter.body}\n${KAP12_EXTRA}\n` : chapter.body;
  return {
    ...chapter,
    body: `${LEARNING[id] ?? ""}\n${body}`,
    card: `${karnsvarMarkdown(id)}${CARDS[id]}`,
    ...(id === "kap4" ? { widget: "zachman-grid" } : {}),
    ...(CARD_AFTER[id] ? { cardAfter: CARD_AFTER[id] } : {}),
    ...(LIKELY[id] ? { likely: LIKELY[id] } : {}),
    ...CHAPTER_TOPICS[id],
  };
});

// Ordlistan: termerna på engelska, som i modulerna och på tentan.
export const glossary = [
  { term: "Abstraction", definition: "Att dölja detaljer som inte är relevanta så att en fråga kan förstås på rätt nivå. Samma enterprise kan beskrivas på många nivåer; ingen av dem är \"arkitekturen\".", chapter: "kap2" },
  { term: "ADM (Architecture Development Method)", definition: "TOGAF:s iterativa metod för att ta fram och utveckla arkitektur, från Preliminary och Architecture Vision till Architecture Change Management. Inget vattenfall.", chapter: "kap5" },
  { term: "Agile architecture", definition: "Arkitektur som utvecklas iterativt och samtidigt ger lämplig riktning och guardrails: just enough, just in time, inkrementell och utfallsorienterad.", chapter: "kap9" },
  { term: "Anti-pattern", definition: "Ett vanligt felmönster. I bankfallet: att välja teknikplattform innan affärsmålen, förmågorna och de arkitektoniska begränsningarna är fastställda.", chapter: "kap11" },
  { term: "API", definition: "Gränssnitt som möjliggör återanvändning, integration, samarbete med partner, sammansättning av produkter och deltagande i ekosystem.", chapter: "kap10" },
  { term: "Application Architecture", definition: "Domänen för applikationer och applikationstjänster. Ingår i TOGAF:s fas C tillsammans med Data Architecture.", chapter: "kap6" },
  { term: "Architect's test", definition: "Lärarens fem frågor före en rekommendation: Why? What? Who? How? What are the consequences?", chapter: "kap12" },
  { term: "Architecture", definition: "Den grundläggande organisationen av något: komponenter, relationer, principer, begränsningar och utveckling. Ett diagram är bara en representation av den.", chapter: "kap2" },
  { term: "Architecture backlog", definition: "Arkitekturarbete som krävs för hållbar leverans: beslut, teknisk skuld, förmågeglapp, risker, standarder, principer och teknikutredningar. Ska kopplas till produktbackloggen.", chapter: "kap9" },
  { term: "Architecture Change Management", definition: "ADM:s fas H: vad har ändrats, och behöver arkitekturen ändras med det?", chapter: "kap5" },
  { term: "Architecture debt", definition: "Ackumulerade arkitektoniska kompromisser som kan ge framtida kostnad, risk eller begränsning.", chapter: "kap9" },
  { term: "Architecture domain", definition: "Ett av de fyra välkända områdena Business, Data, Application och Technology Architecture. Domänerna är sammankopplade, inga silor.", chapter: "kap6" },
  { term: "Architecture governance", definition: "Att fastställa beslutsrätter, ansvar och lämpliga kontroller för arkitekturbeslut.", chapter: "kap8" },
  { term: "Architecture principle", definition: "En generell regel eller riktlinje som ger varaktig vägledning för arkitekturbeslut, till exempel \"Information is an enterprise asset\".", chapter: "kap8" },
  { term: "Architecture repository", definition: "Arkitekturens samlade beskrivningar. Blir det ett museum av inaktuella diagram har det litet strategiskt värde.", chapter: "kap3" },
  { term: "Architecture review", definition: "Granskning som ska fokusera på betydande beslut, risk, beroenden, säkerhet, regelefterlevnad och påverkan på enterprisen, inte på varje implementationsdetalj.", chapter: "kap8" },
  { term: "Architecture sprint", definition: "En kort arkitekturiteration kring en avgränsad arkitektonisk fråga: mål, intressenter, fråga, inkrement, granskning, återkoppling, förfining och publicering.", chapter: "kap9" },
  { term: "Architecture Vision", definition: "ADM:s fas A: en gemensam övergripande bild av den önskade riktningen och intressenternas engagemang.", chapter: "kap5" },
  { term: "Baseline architecture", definition: "Nuläget: de relevanta delarna av dagens arkitektur. Var är vi nu?", chapter: "kap5" },
  { term: "Big bang replacement", definition: "Att ersätta ett kritiskt system i ett steg. Ger stora operativa, finansiella och affärsmässiga risker; övergångsarkitekturer är alternativet.", chapter: "kap11" },
  { term: "Big Architecture Up Front", definition: "Att försöka ta fram hela arkitekturen i förväg. Det agila alternativet är en minsta livskraftiga arkitektonisk riktning.", chapter: "kap9" },
  { term: "Builder", definition: "Perspektivet på Zachmans rad 4 (Technology Model): den som bygger. I version 3.0 Engineer Perspective (Business Physics Builders).", chapter: "kap4" },
  { term: "Business Architecture", definition: "Domänen för förmågor, värdeflöden, processer, organisation, värde och verksamhetstjänster. Ska inte reduceras till applikationer och teknik.", chapter: "kap6" },
  { term: "Business capability", definition: "Vad organisationen förmår göra. Relativt stabil när organisation och processer ändras, och därför en bro mellan strategi och arkitektur.", chapter: "kap7" },
  { term: "Capability gap", definition: "Ett glapp mellan de förmågor strategin kräver och dem organisationen har. Kan identifieras med capability-based planning.", chapter: "kap7" },
  { term: "Capability map", definition: "En karta över enterprisens förmågor. En viktig verksamhetsrepresentation, men inte en fullständig Enterprise Architecture.", chapter: "kap7" },
  { term: "Capability-based planning", definition: "Planering utifrån de förmågor strategin kräver, i stället för utifrån dagens avdelningar.", chapter: "kap7" },
  { term: "Centralized architecture", definition: "Arkitekturbeslut fattas centralt: samstämmighet och stark styrning, men risk för långsamma beslut och flaskhalsar.", chapter: "kap9" },
  { term: "Classification schema", definition: "En struktur för att klassificera och organisera beskrivningar. Zachman är ett klassificeringsschema för beskrivningar av en enterprise.", chapter: "kap4" },
  { term: "Continuous architecture", definition: "Arkitektur som utvecklas löpande med strategin, produkterna, leveransen och återkopplingen i stället för att göras en gång.", chapter: "kap9" },
  { term: "Data Architecture", definition: "Domänen för information, datastrukturer, ägarskap, styrning och flöden. Ingår i TOGAF:s fas C.", chapter: "kap6" },
  { term: "Decision horizons", definition: "Arkitekturbeslut på lång sikt (principer, strategiska förmågor, plattformar), mellanlång (mål- och övergångsarkitekturer, färdplaner) och kort sikt (produkt-, lösnings- och iterationsbeslut).", chapter: "kap9" },
  { term: "Decision rights", definition: "Vem som får fatta vilka beslut, vad team får besluta själva, vad som kräver eskalering eller godkännande på enterprisenivå. Tydliga beslutsrätter ökar farten.", chapter: "kap8" },
  { term: "Designer", definition: "Perspektivet på Zachmans rad 3 (System Model): den som gör den logiska systemmodellen. I version 3.0 Architect Perspective (Business Logic Designers).", chapter: "kap4" },
  { term: "Digital enterprise", definition: "En enterprise som använder digitala förmågor som en integrerad del av sin affärsmodell.", chapter: "kap10" },
  { term: "Digital transformation", definition: "Att använda digitala förmågor för att i grunden förändra hur enterprisen arbetar och skapar eller levererar värde. Tekniken är en möjliggörare, inte transformationen.", chapter: "kap10" },
  { term: "Digitalization", definition: "Att använda digital teknik för att förbättra befintliga aktiviteter och processer, till exempel automatisera en process.", chapter: "kap10" },
  { term: "Digitization", definition: "Att omvandla analog information till digital form, till exempel skanna papper till PDF.", chapter: "kap10" },
  { term: "Enterprise", definition: "En samling organisationer, organisatoriska enheter eller förmågor med en gemensam uppsättning mål. Inte nödvändigtvis ett juridiskt företag.", chapter: "kap1" },
  { term: "Enterprise Agility", definition: "Hela organisationens förmåga att uppfatta förändringar, besluta snabbt, mobilisera resurser, anpassa förmågor, leverera värde snabbt och lära kontinuerligt.", chapter: "kap9" },
  { term: "Enterprise Architecture (EA)", definition: "Att förstå, designa, kommunicera och styra enterprisens grundläggande struktur och utveckling för att nå dess mål. Bredare än IT-arkitektur.", chapter: "kap3" },
  { term: "Enterprise boundary", definition: "Gränsen för den enterprise som arkitekteras. Beror på arkitekturarbetets syfte och sammanfaller inte alltid med juridiska eller organisatoriska gränser.", chapter: "kap1" },
  { term: "Federated architecture", definition: "Arkitekturbeslut fattas nära produkterna: snabbhet och lokalt ägarskap, men risk för dubblering och fragmentering. Kan fungera inom starka principer och guardrails.", chapter: "kap9" },
  { term: "Functioning Enterprise", definition: "Zachmans rad 6: den fungerande verksamheten själv. I version 3.0 Enterprise Perspective (Users) och Operations Instances.", chapter: "kap4" },
  { term: "Governance", definition: "Beslutsrätter, ansvar, riktning och kontroll. Frågar om vi fattar rätt beslut inom rätt gränser och når de avsedda utfallen.", chapter: "kap8" },
  { term: "Guardrail", definition: "En gräns inom vilken team kan röra sig snabbt och självständigt, till exempel säkerhetsprinciper, teknikstandarder, datapolicyer och regulatoriska krav.", chapter: "kap8" },
  { term: "Implementation", definition: "Att bygga och driftsätta lösningen: förverkligandet av designen i drift.", chapter: "kap2" },
  { term: "Implementation Governance", definition: "ADM:s fas G: att genomförandet håller sig i linje med den avsedda arkitekturen. Inte att arkitekter styr varje implementationsbeslut.", chapter: "kap5" },
  { term: "Interrogative", definition: "Ett av Zachmans sex frågeord: What, How, Where, Who, When och Why. Varje frågeord är en kolumn.", chapter: "kap4" },
  { term: "IT architecture", definition: "Arkitektur för informationstekniken: hur tekniken ska struktureras. En del av det bredare EA-landskapet.", chapter: "kap3" },
  { term: "Just-enough architecture", definition: "Bara den arkitektur som behövs för att ge lämplig riktning och hantera betydande risker och beroenden, utan onödig detalj i förväg.", chapter: "kap9" },
  { term: "Management", definition: "Frågar om vi genomför planen. Skiljs från governance, som frågar om vi fattar rätt beslut inom rätt gränser.", chapter: "kap8" },
  { term: "Methodology", definition: "Föreskriver aktiviteter, processer eller steg för att åstadkomma något. TOGAF:s ADM är en metod; Zachman är det inte.", chapter: "kap4" },
  { term: "Migration Planning", definition: "ADM:s fas F: i vilken ordning förändringen ska ske, med hänsyn till investering, risk, beroenden och organisationens kapacitet.", chapter: "kap5" },
  { term: "Ontology", definition: "Begrepp och relationer som beskriver vad som finns inom ett område och hur det kan klassificeras. Zachman är en ontologi, inte en metod.", chapter: "kap4" },
  { term: "Opportunities and Solutions", definition: "ADM:s fas E: hur de arkitektoniska förändringarna kan organiseras i genomförbara initiativ.", chapter: "kap5" },
  { term: "Owner", definition: "Perspektivet på Zachmans rad 2 (Business Model): verksamhetens ägare, som beskriver den i konceptuella modeller. I version 3.0 Business Mgmt Perspective (Business Concept Owners).", chapter: "kap4" },
  { term: "Perspective", definition: "En rad i Zachmans ramverk: en abstraktionsnivå sedd ur ett visst perspektiv, från Planner till den fungerande verksamheten.", chapter: "kap4" },
  { term: "Planner", definition: "Perspektivet på Zachmans rad 1 (Scope): den som avgör omfång och sammanhang. Beskrivningarna är listor. I version 3.0 Executive Perspective (Business Context Planners).", chapter: "kap4" },
  { term: "Platform", definition: "Återanvändbara förmågor som flera produkter använder, som identitet, betalningar, kunddata och integration. Bygg en gång, använd många gånger.", chapter: "kap10" },
  { term: "Preliminary Phase", definition: "ADM:s inledande fas: hur ska vi arbeta med arkitektur? Före arkitekturen behövs förmågan att göra arkitektur.", chapter: "kap5" },
  { term: "Process", definition: "Hur organisationen utför aktiviteter: en sekvens eller mängd aktiviteter för att utföra arbete. Kan ändras medan förmågan finns kvar.", chapter: "kap7" },
  { term: "Product mindset", definition: "Bestående team, kontinuerlig investering, kundutfall och kontinuerlig utveckling, i stället för projektens tillfälliga organisation och fasta scope.", chapter: "kap9" },
  { term: "Scope", definition: "Det arkitekturarbetet omfattar. Bestäms av problemet som ska lösas. Också namnet på Zachmans rad 1.", chapter: "kap1" },
  { term: "Stakeholder", definition: "Intressent med egna frågor om arkitekturen, till exempel CEO, CFO, CIO, CISO, produktchef och utvecklare. Arkitektur görs i sista hand för dem.", chapter: "kap6" },
  { term: "Subcontractor", definition: "Perspektivet på Zachmans rad 5 (Detailed Representations): detaljerade specifikationer av komponenterna. I version 3.0 Technician Perspective (Business Component Implementers).", chapter: "kap4" },
  { term: "Target architecture", definition: "Målläget: en sammanhängande riktning för det önskade framtida läget, med stöd av principer och styrning. Ingen perfekt förutsägelse.", chapter: "kap5" },
  { term: "Technology adoption lifecycle", definition: "Explore → Assess → Experiment → Validate → Adopt → Scale → Retire/Replace. Inte varje ny teknik ska nå adoption.", chapter: "kap10" },
  { term: "Technology Architecture", definition: "Domänen för infrastruktur, plattformar, nätverk och tekniktjänster. TOGAF:s fas D.", chapter: "kap6" },
  { term: "Technology radar", definition: "Klassning av teknik som Explore, Trial, Adopt eller Hold.", chapter: "kap10" },
  { term: "TOGAF", definition: "The Open Groups standard: vägledning och en metod för att ta fram och styra Enterprise Architecture, inklusive ADM. Ett verktyg för att göra arkitektur, inte organisationens arkitektur.", chapter: "kap5" },
  { term: "Trade-off", definition: "En avvägning mellan konkurrerande mål, som standardisering mot flexibilitet. Arkitektur är att hantera avvägningar och göra dem explicita.", chapter: "kap8" },
  { term: "Traceability", definition: "Att kunna spåra ett beslut eller en teknik tillbaka till verksamhetsskälet: strategi → förmåga → krav → arkitektur → implementation.", chapter: "kap6" },
  { term: "Transition architecture", definition: "Ett praktiskt mellanläge mellan nuläge och målläge, så att organisationen kan fortsätta verksamheten och leverera värde under förändringen.", chapter: "kap5" },
  { term: "Value stream", definition: "Hur värde skapas och levereras till en intressent, till exempel Discover → Apply → Verify → Approve → Complete. Kan korsa organisationsgränser.", chapter: "kap7" },
  { term: "View", definition: "Den faktiska representationen av arkitekturen, skapad med en viewpoint för en intressents fråga.", chapter: "kap6" },
  { term: "Viewpoint", definition: "Reglerna eller perspektivet för hur en vy ska konstrueras och tolkas för en viss intressents fråga.", chapter: "kap6" },
  { term: "Zachman Framework", definition: "En ontologi och ett klassificeringsschema för beskrivningar av en enterprise: sex frågeord (kolumner) gånger sex perspektiv (rader).", chapter: "kap4" },
];
