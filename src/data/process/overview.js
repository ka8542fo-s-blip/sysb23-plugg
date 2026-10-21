// Översiktskapitlet: kartan man läser först. Det står först i Läs men har
// inget kapitelnummer i gränssnittet ("Översikt" i stället för "Kapitel N
// av 11"), så att kapitel 1–11 och alla hänvisningar till dem behåller sina
// nummer. number: 0 ger figurnumren 0.1–0.4. overview: true undantar
// kapitlet från Öva (inga frågor, se practiceAxis.js) och från snabbspårets
// nedtoning.
//
// Regel: inget nytt i sak. Allt här står redan i kapitel 1–11; texten
// sammanfattar och hänvisar dit ("Mer: kapitel N").
export const overviewChapter = {
  id: "oversikt",
  number: 0,
  overview: true,
  title: "Översikt: hela kursen på en sida",
  readingMinutes: 13, // ~1 900 ord i sajtens lästempo (~145 ord/min); skummad 10–12 min
  lead: "Kartan att läsa först: kursens viktigaste idéer i vanlig svenska, hur de hänger ihop och var du läser mer.",
  sources: ["Sammanfattning av kapitel 1–11"],
  body: `
## Grundidén

En strategi blir verklighet först när arbetet i verksamheten ändras. Arbetet består av **processer**, kedjor av aktiviteter från början till slut som ofta går genom flera avdelningar och slutar hos en kund.

- **Exempel:** en beställning på nätet tas emot av försäljningen, plockas på lagret, faktureras av ekonomi och levereras av transport. Varje avdelning ser sitt steg, men ingen äger hela kedjan.
- **BPM** (Business Process Management) är att styra och förbättra hela kedjorna så att strategin blir verklighet. Jeston (2022), som essäfrågorna alltid utgår från, definierar det som implementering, genomförande och styrning av processer (implementation, execution och governance).
- **Strategy execution void** är gapet mellan det organisationen vill och det den klarar att genomföra. Många misslyckas inte med att formulera strategin utan med att genomföra den, och BPM ska fylla gapet.
- **BPM är inte ett IT-system.** Det är en managementdisciplin; tekniken är ett stöd.
- **BPM är inte ett engångsprojekt.** En process blir aldrig klar, och BPM ska bli en löpande del av hur organisationen leds.

[[diagram:bpm-processkedjan]]

Mer: kapitel 1, 5, 6 och 8.

## Den röda tråden

Ett mönster går igen genom kursen: **strategi först, människor hela vägen, teknik sist**. "Teknik sist" gäller ordningen: processen förbättras innan tekniken införs, men tekniken är inte oviktig.

| Var | Vad den säger |
|---|---|
| **BPR** (kapitel 2) | Den radikala omdesignen på 90-talet tog ingen hänsyn till medarbetarnas acceptans och mötte starkt motstånd. |
| **Improve before automate** (kapitel 4) | Förbättra processen först och inför tekniken sedan. Tekniken är en möjliggörare, inte lösningen. |
| **Framgångspallen** (kapitel 5) | Strategin är drivkraften, och genomförandet vilar på tre ben: people, tech och process. |
| **Huset** (kapitel 5) | Jestons bild av allt som ska finnas på plats när BPM fungerar: grunden är strategisk, och taket är ledningen och kulturen. |
| **Foundations** (kapitel 6) | Första fasen i Jestons ramverk 7FE säkerställer linjeringen mellan strategin, processledningen och processerna. |
| **Essentials** (kapitel 8) | Tre förmågor som krävs genom alla faser, bland dem ledarskap och förändringsledning för människorna. |

Mer: kapitel 2, 4, 5, 6 och 8.

## Historien i fem steg

BPM är ingen uppfinning utan resultatet av flera strömningar som möttes kring år 2000. Tabellen visar huvudlinjen.

| Steg | När | Lärdomen |
|---|---|---|
| **Taylors scientific management** | 1880–1920 | Arbetet delas upp och effektiviseras steg för steg. |
| **Kvalitetsrörelsen** (TQM, Six Sigma, Lean) | från mitten av 80-talet | Förbättra lite i taget och mät felen. |
| **BPR** (Business Process Reengineering, radikal omdesign med IT) | 1990 | Gick för långt: för radikalt, för dyrt och för mycket motstånd. |
| **BPM** | från slutet av 90-talet | Hela processen i fokus, men stegvis, med människorna och med ständig förbättring. |
| **RPA och AI** | 2015 och framåt | Mjukvarurobotar som härmar en människas klick (RPA) var svåra att skala. Nu konkurrerar de med agentisk AI, där AI-agenter (AI som själv fattar beslut på vägen) ska sköta hela arbetsflöden. |

Mer: kapitel 2.

## När och hur man börjar

Något sätter igång arbetet: en **driver** (ett affärsskäl, ofta inifrån, som en flaskhals) eller en **trigger** (en händelse, ofta utifrån, som organisationen måste svara på, som en ny lag). Hur stort man kan köra beror på hur engagerad ledningen är, och utan ledningens stöd för ett stort program ska man enligt Jeston stoppa.

Jestons fyra scenarier:
- **Under the radar:** små, informella insatser med begränsat stöd från ledningen.
- **Pilot project:** ett projekt som ska bevisa vad BPM är värt.
- **In the driver's seat:** BPM är erkänt som strategiskt verktyg, och ledningen är fullt engagerad.
- **Business as usual:** BPM är helt inbäddat i hur organisationen arbetar.

Två regler att kunna:
- **Improve before automate:** automatisering förstärker det som redan finns, så en dålig process blir sämre, bara snabbare. Förbättra den först och automatisera sedan.
- **Outsourcing** (att lägga ut en process på en extern part): ger säkrast kortsiktiga besparingar men har flest höga risker. Att lägga ut en process ni vill vara bra på är hög risk, så försäkra er först om att den inte är strategisk.

Mer: kapitel 3 och 4.

## 7FE: ramverket

**7FE** är Jestons ramverk för hur BPM genomförs: tio faser i ordning och tre **essentials**, förmågor som krävs genom alla faser. Namnet läses bäst som "10P3E".

| Fas | Vad som händer | Vad fasen lämnar efter sig |
|---|---|---|
| **1 Foundations** | BPM-arbetet linjeras med strategin. Fasen skapar inte strategin. | **TOM** (target operating model, bilden av hur organisationen ska fungera i framtiden) |
| **2 Enablement** | Det som krävs för TOM byggs: styrning, arkitektur, människor och teknik. | Process governance (vem som styr processerna), processarkitektur (regler för hur processer designas och förvaltas) och process assets (arkivet där processerna beskrivs) |
| **3 Launch** | Den formella starten för en BPM-aktivitet. | Processmål, prioriterade processer och business case (nytta och kostnad) |
| **4 Understand** | En gemensam, faktabaserad bild av nuläget. | As-is-modeller (nuläget), baseline (mätningen av nuläget), rotorsaker och quick wins (små förbättringar med snabb effekt) |
| **5 Innovate** | De framtida processerna designas. | To-be-design (hur processerna ska se ut) och validerade lösningsförslag |
| **6 People** | Roller, organisation och mått för människorna i de nya processerna, parallellt med Develop. | Rollbeskrivningar, KPI:er (nyckeltal) och utbildningsplan |
| **7 Develop** | Eventuell teknik byggs, konfigureras och testas. | Lösningar och specifikationer |
| **8 Implement** | Lösningen tas i drift. | En lösning i drift som linjen har tagit över |
| **9 Realize** | Nyttorna i business case ska uppnås och bestå. | Nyttor som följs upp, var och en med en ägare |
| **10 Sustainability** | Förbättringarna hålls vid liv i vardagen. | Processer med ägare, aktuell dokumentation och KPI:er |

De tre essentials:
- **Leadership:** vision, förtroende och linjering med strategin, på alla nivåer.
- **BPM project management:** resurser, budget, tidplan, intressenter och leveranser.
- **People change management:** att alla berörda kan och vill ta till sig det nya.

[[diagram:bpm-7fe-tidslinje]]

**Huset** är Jestons målbild av allt som ska finnas på plats när BPM fungerar: strategin är grunden, processerna är rummen och ledningen och kulturen är taket (figur 5.1 i kapitel 5). **One size fits all** fungerar inte: organisationens **BPM-mognad** (hur långt den har kommit i att arbeta med processer) avgör var man börjar och hur fort man kan gå.

Mer: kapitel 5–8.

## Nyttan är en tråd, inte ett slutsteg

Nyttan kommer inte av sig själv i slutet; den planeras, mäts och följs upp genom hela ramverket. Tänk på ett gymkort: du betalar först, och resultatet kommer långsamt och bara om du följer upp.

| Fas | Vad som händer med nyttan |
|---|---|
| **Enablement** | Ett ramverk för nyttostyrning tas fram. |
| **Launch** | **Business case** (nytta och kostnad på vanligt språk, gärna på en sida) och **benefits register** (nyttoregistret, där varje nytta får ägare, värde och måldatum). |
| **Understand** | **Baseline**: nuläget mäts, som att väga sig innan man börjar banta. |
| **Innovate** | Nyttorna räknas om när lösningen tar form. |
| **Implement** | Uppföljningen av nyttorna börjar. |
| **Realize** | Nyttoägarna driver fram nyttorna och följer upp mot business case. |
| **Sustainability** | Nyttorna bevakas i vardagen, så att de inte försvinner. |

[[diagram:bpm-nyttotraden]]

Kostnaderna kommer först, och nyttan börjar efter införandet och växer långsamt (figur 8.2 i kapitel 8). Mät därför mer än pengar, till exempel resurser och vad kunderna tycker.

Mer: kapitel 7 och 8.

## Människorna: minst 60 procent

Enligt Jeston bör minst 60 procent av BPM-arbetet gå till människorna och kommunikationen. **People change management** betyder att folk både kan (genom utbildning) och vill (genom motivation och engagemang) arbeta på det nya sättet.

Fyra skäl:
- **Förändringen sker i människor, inte i modeller.** En ny process finns bara om de som arbetar i den förstår den, kan den och vill den.
- **Rädslan finns redan.** Folk oroar sig för nedskärningar, outsourcing och automatisering, och obesvarad blir oron motstånd.
- **Historien visar vad som händer annars.** BPR misslyckades bland annat för att det inte tog hänsyn till medarbetarnas acceptans.
- **Medarbetarna bär kvaliteten.** Medelbra processer med engagerade medarbetare slår ofta bra processer med oengagerade.

Mer: kapitel 8.

## Framåt: process mining och AI

BPM förändras när IT-systemen och AI kan se och göra mer själva. Samtidigt gäller grunderna ovan.

- **Process mining** (analys av systemens händelseloggar, event logs) visar hur processen faktiskt körs i systemen, inte bara hur den beskrivs i intervjuer och workshoppar. Det kompletterar dem men ersätter dem inte.
- **AI och agenter** (AI som själv fattar beslut på vägen): automatiseringen har gått från enskilda uppgifter via flöden och användarens klick till besluten. En autonom process fattar själv beslut och är, till skillnad från en automatiserad, inte förutsägbar.
- **Sustainability** i 7FE betyder uthållig konkurrensfördel (sustainable competitive advantage), inte miljö. **Green BPM** (att mäta och minska processernas miljöpåverkan) är något annat.

Mer: kapitel 8 och 9.

## BPMN: att rita processen

**BPMN** (Business Process Model and Notation) är standarden för att rita processer, med bestämda symboler och regler för vad de betyder. Den passar processer med en tydlig start och ett tydligt slut, som en order.

| Form | Ser ut som | Betyder |
|---|---|---|
| **Händelse** (event) | Cirkel: tunn kant vid start, dubbel mitt i, tjock vid slut | Något som inträffar |
| **Aktivitet** (activity) | Rektangel med rundade hörn, namngiven med verb och objekt | Ett arbete som tar tid |
| **Gateway** | Romb | Flödet delas eller slås ihop; en tom romb (XOR) betyder att exakt en väg följs |
| **Banor** (pool och lane) | Rektangel med namnet på kanten | Poolen är en process, och varje lane visar vem som utför arbetet |

[[diagram:bpm-bpmn-grundformer]]

**DMN** (Decision Model and Notation) beskriver besluten i beslutstabeller, och en business rule task (en aktivitet som anropar en beslutsregel) kopplar in dem i BPMN. På tentan ska du kunna följa flödet steg för steg: tänk dig en token, en markör som vandrar längs sekvensflödena (de heldragna pilarna) och stannar i varje aktivitet.

Mer: kapitel 10 och 11.

## Så läser du en tentafråga

Flera tentafrågor prövar gränserna mellan faserna: vad som händer var och vad varje fas lämnar efter sig. Leta efter nyckelordet i svarsalternativet:

| Nyckelord i alternativet | Fas |
|---|---|
| Linjering med strategin, TOM | Foundations |
| Bygga upp, styrning, processarkitektur | Enablement |
| Formell start, BPM-team, business case tas fram | Launch |
| Nuläge, as-is, rotorsak, baseline | Understand |
| To-be, design, lösningsförslag | Innovate |
| Roller, utbildningsplan | People |
| Nyttorna drivs fram och följs upp mot business case | Realize |
| Hålla vid liv, vardagen | Sustainability |

Kända fällor:
- **Innovates output** är to-be-design och validerade lösningsförslag, inte rotorsaker (Understand), riskregister (projektledningen) eller utbildningsplaner (People).
- **Modelleringen i Understand** ska ge en gemensam, faktabaserad bild av nuläget, inte körbara modeller, framtida KPI:er eller dokumentation för revision.
- **Launch** är den formella starten för en BPM-aktivitet: den startar projektet men avslutar det inte.
- **Fasnamn** som Execution, Evaluation, Engagement, Follow-up och Feedback finns inte i 7FE.
- **Nyttorealiseringen** börjar inte i Realize: tråden går från Enablement, och uppföljningen börjar i Implement.
- **Strategin** skapas inte av BPM-teamet: Foundations förstår strategin och linjerar arbetet mot den.

Mer: kapitel 5–8.

## Minilexikon

| Term | Betydelse |
|---|---|
| **Process** | En kedja av aktiviteter från början till slut, som ofta löper genom flera avdelningar; i kärnprocesserna skapas värdet för kunden. |
| **Process asset** | Ett centralt arkiv där processmodeller, regler, roller, system och risker hänger ihop; modellen är bara en del. |
| **TOM** (target operating model) | Bilden av hur organisationens delar ska fungera i framtiden, en sorts intern affärsmodell. |
| **Business case** | Nyttan och kostnaden för en BPM-aktivitet, på vanligt språk och gärna på en sida. |
| **Benefits register** | Nyttoregistret: varje förväntad nytta med ägare, värde och måldatum. |
| **Baseline** | Mätningen av nuläget som förbättringarna jämförs med. |
| **SMART** | Krav på processmål: specifika, mätbara, uppnåeliga, realistiska och tidsbundna. |
| **Process Worth Matrix** | Verktyg i Understand som sorterar processerna efter strategisk betydelse och ekonomiskt värde. |
| **People change management** | Att folk kan (utbildning) och vill (motivation) arbeta på det nya sättet. |
| **Quick win** | En liten förbättring som går att genomföra på fyra till åtta veckor och ger snabb effekt. |
| **As-is / to-be** | Processen som den är i dag, och som den ska bli. |

Mer: ordlistan under Läs, och kapitel 6–8.
`,
};
