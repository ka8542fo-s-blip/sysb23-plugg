# PROMPT TILL CLAUDE CODE — Strategi: föreläsning 1 in i appen (nytt kapitel, tillägg, frågor)

## Varför

Weavers första föreläsning (3 sep 2026) finns nu i projektet. Tentan 21 september bygger enligt honom på **litteraturen och föreläsningarna**, och HT24-tentans frågor om produktivitetsparadoxen och alignment kom från just den här föreläsningen. Kompendiet täcker litteraturen fullständigt men saknar föreläsningens huvudtema: enterprise IT och digital transformation. Den här prompten lägger till det som ett nytt kapitel, kompletterar två befintliga kapitel, och utökar begrepp, ordlista och frågebank.

Allt innehåll är hämtat ur slidesen. Kopiera exakt; skriv inte om.

## Ändringar i struktur

**Nytt kapitel** med `id: "digital"` läggs in i `reading.chapters` **mellan kap8 och kap9**. Fältet `number` är visningsordning: det nya kapitlet får `number: 9`, befintliga kap9 får `number: 10`, kap10 får `number: 11`. **Ändra inga `id`-värden** — topics.chapter, glossary.chapter och läsprogress i localStorage pekar på id, inte nummer. Kontrollera att alla "Kapitel N"-etiketter i UI:t hämtar N från `number` via uppslag och inte från id-strängen.

Kapitel–ämne-tabellen får en ny rad: `digital` → topics `["digital", "it"]`, primaryTopics `["digital"]`.

Total lästid och "X av 11 kapitel" ska uppdateras automatiskt ur datat.

---

# INNEHÅLL A — Nytt kapitel (`reading.chapters`)

```js
  {
    id: "digital",
    number: 9,
    title: "Enterprise IT och digital transformation",
    readingMinutes: 12,
    lead: "Från ENIAC till AI-strategi: hur IT gick från räknemaskin till strategisk fråga, varför produktivitetsparadoxen uppstod, och vad som krävs av datastrategin idag.",
    sources: ["Weaver, föreläsning 1"],
    body: `
Det här kapitlet är föreläsningens egen berättelse, och den förklarar varför informatikprogrammet läser strategi över huvud taget. Utgångspunkten är att **strategi är grunden för all ekonomisk aktivitet**: strukturer och processer utformas för att genomföra strategin, och ekonomistyrning omfattar de styrmedel som används för att implementera strategin över tid. Chandlers klassiska formulering är **"structure follows strategy"** — men samspelet är kontinuerligt, strategi och struktur utvecklas och förändras tillsammans. Samma logik gäller informationssystem: de ska utformas med strategin som utgångspunkt.

## De första datorerna: en process i taget

De första datorerna var avancerade räknemaskiner med mycket specifika syften — ENIAC 1946, Apollo Guidance Computer 1966. De tidiga enterprise-systemen byggdes av stora företag, banker och statliga myndigheter som utvecklade sina egna applikationer: lönehantering, redovisning, lagerhantering, batchbaserad dataanalys, processkontroll. **En sak i taget**, varje system för sig.

**Moores lag** skapade efterhand förutsättningar för datorisering av fler företag och processer: IBM System/360 mainframe på 60- och 70-talet, DEC minidatorer på 70-talet, PC:n från 80-talet.

## 80- och 90-talet: IT-explosion och kaos

PC-revolutionen ledde till att alla företag satsade stort på IT — ofta **ostrukturerat och ogenomtänkt**. Resultatet var system- och informationskaos, det som brukar kallas **enterprise application spaghetti**: en härva av system utan sammanhang.

Föreläsningen pekar ut tre orsaker. Företagen leddes av en generation som inte var digital, så IT sågs inte som en strategisk aktivitet och det fanns ingen strategisk koppling mellan IT och företagens kärnaffärer. IT befann sig i en **organisatorisk silo** — IT-avdelningen sågs som "vaktmästare". Och samtidigt tog Japan över som världsledare inom högteknologi och elektronik.

## Produktivitetsparadoxen

Trots enorma IT-investeringar syntes ingen produktivitetsökning i statistiken. Robert Solows formulering från 1987 är den som citeras:

> "You can see the computer age everywhere but in the productivity statistics."

NIST beskrev 1989 samma sak som **integrationens paradox** (Appleton): systemen fanns, men de hängde inte ihop.

Förklaringen som föreläsningen ger — och som Weaver prövar på tentan — är att **det tar tid för företag att anpassa sina processer och organisationer till nya teknologier**. Tekniken i sig ger ingen vinst; vinsten kommer när arbetssätten ändras. Notera vad som *inte* är svaret: att tekniken bara påverkar små företag, att teknisk utveckling alltid ger omedelbar effekt, eller att innovation automatiskt ökar lönsamheten.

## Lösningen: IT kopplas till affärsstrategin

Svaret på paradoxen blev att koppla IT till affärsstrategin genom tre idéer: **kärnkompetens, strategic alignment och IT governance**. På 90-talet kom en våg av IT-drivna managementmetoder som till slut "löste" paradoxen — citattecknen är föreläsningens egna:

- Total Quality Management (TQM)
- Kaizen, Lean manufacturing, Six Sigma
- Just-in-time (JIT) och Kanban
- Business Process Reengineering (BPR)
- ERP — Enterprise Resource Planning
- CRM — Customer Relationship Management
- Supply chain management
- Knowledge management
- Data warehousing
- Outsourcing

Lägg märke till att flera av dessa är exakt de metoder AJK kapitel 3 nämner som svar på omvärldsförändringarna — kursens två halvor beskriver samma decennium från var sitt håll.

## Clinger Cohen Act 1996

En reform av IT-arbetet inom amerikansk offentlig sektor (Information Technology Management Reform Act) som enligt föreläsningen skapade förutsättningarna för den moderna IT-industrin:

- **CIO-rollen** legitimerades som en strategisk ledningsfunktion.
- **Enterprise Architecture (EA)** etablerades som managementdisciplin.
- **IT governance:** IT började styras som en strategisk investering.
- **COTS** (commercial off-the-shelf) fick stort genomslag — färdiga system som ERP och CRM i stället för egenutveckling.
- **Strategic alignment** blev ett centralt managementkoncept.

## Strategic Alignment Model

Henderson & Venkatramans modell från 1993 (kapitel 10 går igenom domänerna) sammanfattas i föreläsningen med ett citat som är värt att kunna, eftersom det förenar alignment med det resursbaserade synsättet:

> "No single IT application — however sophisticated and state of the art it may be — could deliver a sustained competitive advantage. Rather, advantage is obtained through the capability of an organization to exploit IT functionality on a continuous basis."

Det kräver, fortsätter de, en grundläggande förändring i hur ledningen tänker om IT:s roll i organisatorisk transformation, och en förståelse av IT-strategins roll i att både **stödja och forma** affärsstrategiska beslut. Databaser är föreläsningens eget exempel på alignment i praktiken: en databasarkitektur ska utformas efter vad verksamheten behöver kunna svara på.

## AI-strategi: data som bränsle

Föreläsningen tar berättelsen fram till idag med tre ramverk.

**The AI factory** (Iansiti & Lakhani 2020) beskriver AI-driven verksamhet som en industriell process med fyra delar:

1. **Data pipeline** — samlar in, rensar och lagrar data.
2. **Algorithm development** — konstruktion och (offline-)träning av ML-modeller.
3. **Experimentation platform** — A/B-testning av olika modeller för att se vad som fungerar.
4. **IT infrastructure** — systemets generella arkitektur.

Deras exempel: ingen mänsklig auktionsförrättare deltar i Googles miljontals dagliga annonsauktioner, ingen dispatcher väljer bil hos Uber, ingen banktjänsteman godkänner varje lån hos Ant Financial. Processerna är digitaliserade och möjliggjorda av en AI-fabrik som behandlar beslutsfattande som en industriell process.

**Den AI-anpassade organisationen** (Fountaine, McCarthy & Saleh 2019) kräver en ny verksamhetsarkitektur med data i fokus. Två begrepp: **SSoT** — single source of truth, en gemensam sanning för organisationens kärndata — och **MVoT** — multiple versions of the truth, lokala vyer anpassade för olika verksamhetsdelar.

**Datastrategi** (DalleMule & Davenport 2017) är en balans mellan två inriktningar:

- **Data defense** — minimera datarisk: regelefterlevnad, upptäcka och begränsa bedrägerier, förhindra intrång och datastöld, intern dataintegritet genom single source of truth.
- **Data offense** — maximera avkastningen på data: datainsamlingsstrategier, dataintegration och analys, data mining, BI och AI/ML, realtidsupptäckt av bedrägerier, multiple versions of the truth.

Var balansen ska ligga beror på **riskkontexten**. I ena änden av spektrumet finns high-stakes-sektorer — rättsväsende, polis, sjukvård, socialtjänst, utbildning — där defense dominerar. I mitten banker, finansinstitut och försäkring. I andra änden detaljhandel, onlinetjänster, media och hotell, där offense väger tyngre.

Skillnaden mellan USA och EU är stor: USA är "vilda västern" med lite reglering, medan EU har regleringsfokus. **GDPR** har redan gjort de flesta sektorer high-stakes vad gäller personuppgifter, och **AI Act** inför en riskbaserad ansats. Externa krav — dataskydd, personuppgifter, datasäkerhet — skapar juridiska utmaningar, gör efterlevnad alltmer komplex och kostsam, och gör **data resilience** (backuper med mera) verksamhetskritisk för AI-drivna organisationer.

## Löste vi alla IT-problem?

Nej. Trots alla metoder förekommer ständiga, ofta spektakulära IT-misslyckanden. Ökande komplexitet — inklusive IT och mjukvara — leder till ökad risk för misslyckande.

På **makronivå** skapar varje ny IT-epok nya utmaningar som kräver nya integrationer och en ny helhetssyn. Komplexiteten är **kumulativ**: spagettiarkitektur, sedan ERP/CRM och legacysystem, sedan SOA/API/webbtjänster, sedan SaaS/mobilt/moln, sedan big data/ML/AI, sedan cybersäkerhet och integritet, och nu agentisk AI. Varje lager ligger kvar under nästa.

På **mikronivå** tenderar produktivitetsparadoxen att **upprepa sig inom varje nytt område som digitaliseras**. Det vi idag kallar digital transformation eller AI-transformation är samma mönster som PC-revolutionen: tekniken finns före förmågan att använda den.

## Drivkrafter mot kontinuerlig systemförbättring

Fyra drivkrafter gör att databaser, enterprise architecture, processer och säkerhet aldrig blir "klara":

- **Ökad konkurrens på globala marknader** — internet, snabbare produktcykler, distribution och logistik.
- **Nya regleringar** — SOX, GDPR, CSRD, AI Act.
- **Frivillig efterlevnad** — standarder, certifieringar, miljömärkning; kan vara krav i upphandlingar.
- **Accelererande teknikutveckling** — IoT, cloud, SaaS, AI.

## Föreläsningens egen sammanfattning

Datorer användes initialt för en process åt gången. PC-revolutionen skapade en omfattande datorisering av företag och processer på 70- och 80-talet. Produktivitetsparadoxen: ogenomtänkta IT-investeringar skapade IT-kaos och brist på strategisk integration med verksamheten. Från 1990 och framåt har managementtrender för att uppnå strategic alignment "löst" paradoxen. Men ständig utveckling av samhälle, marknader, verksamheter och teknik kräver konstant förändring och anpassning av IS-system.

Slutsatsen för dig som läser informatik: framtidens IT-arbetsmarknad kräver **holistisk kunskap om verksamheter, informationssystem och strategi**. När AI tar över traditionella färdigheter krävs en förflyttning uppåt i tech-stacken — från att utföra till att förstå varför.
`
  },
```

# INNEHÅLL B — Tillägg till kapitel 3 (`kap3`, målmodellerna)

Lägg in följande avsnitt i `body` för kap3, **direkt efter avsnittet "Vinstmaximeringsmodellen"** och före "Företagsledarmodeller":

```
## Marknadens osynliga hand

Neoklassisk teori analyserar främst företag och marknader på **samhällsnivå**. Grundtanken är att ekonomin fungerar optimalt när människor kan agera fritt efter sitt egenintresse på öppna marknader; staten bör minimera sin reglering (laissez-faire); marknaden är självreglerande eftersom pris och efterfrågan belönar effektiva företag och straffar sämre; och samhället gynnas genom tillväxt och innovation. Modellens antaganden — perfekt information, perfekt rationella människor, resursallokering som inte är ett problem — är precis de som kritiken riktar in sig på.

## Transaktionskostnadsteori: marknad eller hierarki?

Varför finns företag över huvud taget — varför inte en enda stor marknad av individer? Transaktionskostnadsteorins svar är att **marknadens transaktionskostnader** (att söka, förhandla, skriva kontrakt, övervaka) gör det mer effektivt för ett företag att själv utföra vissa aktiviteter. Men efterhand som företag växer uppstår **interna** transaktionskostnader i stället. Gränsen mellan företag och marknad dras där kostnaderna möts, och den praktiska frågan är **make or buy** — tillverka själv eller köpa på marknaden? Fokus i praktiken: kontrakt.

## Managementrevolutionen

Chandler beskrev i *The Visible Hand* (1977) hur det var företagsledares initiativ, inte marknadens osynliga hand, som ledde till allt större företag. Med **separationen mellan ägande och styrning** kontrollerar ledningen företagets strategi, utnyttjar effektiviserings- och skalfördelar för att växa, och ersätter marknaden med **vertikal integration** och administrativa mekanismer. Det är bakgrunden till företagsledarmodellerna: när ledningen har kontrollen uppstår frågan vad ledningen egentligen maximerar.
```

Lägg dessutom in i avsnittet "Företagsledarmodeller" efter Williamson-stycket:

```
Föreläsningen använder de engelska beteckningarna: Baumols **Managerial Utility Maximization Theory** och Williamsons **Managerial Discretion Theory**. Gemensamt är att ledningen fokuserar på sin egen nytta — Baumol genom försäljning och tillväxt (prestige och ersättning växer med storlek snarare än vinst), Williamson genom höga löner, stor administrativ personal och investeringar i lyx som kontor, inredning och resor.
```

Lägg in före avsnittet "Satisfieringsmodellen":

```
## Beteendeteorier om företaget

Cyert & March (1963) ser företaget som **en koalition av olika intressenter med olika behov och motiv**. Beslutsprocesserna blir komplexa eftersom många intressenter måste tillgodoses; perfekt information om marknaden är orealistiskt, så allt beslutsfattande baseras på imperfekt information; och företagets agerande är resultatet av intern politik, konflikter och kompromisser mellan ägare, ledning och anställda. Föreläsningens poäng: detta **påvisar behovet av tydliga interna visioner, strategier och styrsystem** för att skapa samsyn och alignment — vilket är exakt vad kapitel 2 och 5 handlar om. Både satisfieringsmodellen och intressentmodellen hör hit.
```

Komplettera Satisfieringsmodellen med en mening efter "Vinsten måste dock vara tillräckligt hög…":

```
Föreläsningen preciserar vad anspråksnivån beror på: **yttre faktorer** i företagets omvärld, **tradition och ägarpreferenser**, och **kultur**. Simon fick Nobelpriset 1978.
```

Komplettera Intressentmodellen med en inledande mening:

```
Modellen förknippas i Sverige med **Eric Rhenman**.
```

Komplettera Kassaflödesbaserade modeller efter meningen om kalkylränta:

```
Kalkylräntan tar hänsyn till skillnaden mellan pengars värde idag och i framtiden genom tre komponenter: **inflation, alternativa investeringsmöjligheter och risk**. Föreläsningen påpekar att nuvärdesanalysen ger beslutsstöd för enskilda investeringar och kan användas för att beräkna ett företags nuvarande värde, att den i praktiken motsvarar räntabilitet/avkastning, och att den är svår att tillämpa när förutsättningarna förändras snabbt.
```

# INNEHÅLL C — Tillägg till kapitel 9 → nu nummer 10 (`kap9`, IT/AI)

I avsnittet "Produktivitetsparadoxen", lägg till efter första stycket:

```
Solows formulering från 1987 är den som brukar citeras: "You can see the computer age everywhere but in the productivity statistics." Kapitel 9 ger hela bakgrunden. Väsentligt för tentan: föreläsningens förklaring är att **det tar tid för företag att anpassa sina processer och organisationer** till ny teknik, och att paradoxen **upprepar sig i varje nytt område som digitaliseras** — senast med AI.
```

I avsnittet "Strategic Alignment Model", lägg till sist:

```
Modellens egna upphovsmän formulerar slutsatsen så här: ingen enskild IT-applikation, hur avancerad den än är, kan ge uthållig konkurrensfördel; fördelen kommer av organisationens förmåga att kontinuerligt utnyttja IT. Det är samma slutsats som Barney drar om AI trettio år senare.
```

# INNEHÅLL D — Nytt begreppskort (`topics.js`)

Lägg till som nytt objekt i `topics`, placerat mellan `tbl` och `it`:

```js
  {
    id: "digital",
    name: "Enterprise IT och digital transformation",
    chapter: "digital",
    examWeight: "hög",
    summary: "Föreläsning 1: IT gick från räknemaskiner med ett syfte, via PC-revolutionens systemkaos och produktivitetsparadoxen, till att kopplas till affärsstrategin genom strategic alignment, IT governance och 90-talets managementmetoder. Idag ställer AI, data och reglering nya krav på datastrategin — och paradoxen upprepar sig i varje nytt område som digitaliseras.",
    keyPoints: [
      "Strategi är utgångspunkten för all ekonomisk aktivitet: strukturer, processer och informationssystem utformas för att genomföra strategin. Chandler: 'structure follows strategy', men samspelet är kontinuerligt.",
      "Historik: ENIAC 1946 och Apollo Guidance Computer 1966 var räknemaskiner med specifika syften. Tidiga enterprise-system (banker, myndigheter, storföretag) körde en process i taget: lön, redovisning, lager, batchanalys, processkontroll.",
      "Moores lag möjliggjorde bredare datorisering: IBM System/360 (60–70-tal), DEC minidator (70-tal), PC (80-tal).",
      "80–90-tal: 'enterprise application spaghetti'. Orsaker: ostrukturerade IT-satsningar, en icke-digital ledargeneration som inte såg IT som strategiskt, IT i organisatorisk silo ('vaktmästare'). Samtidigt tog Japan ledningen inom högteknologi.",
      "Produktivitetsparadoxen: IT-investeringar syntes inte i produktivitetsstatistiken. Solow 1987: 'You can see the computer age everywhere but in the productivity statistics.' NIST 1989 (Appleton): integrationens paradox.",
      "Förklaringen som prövas på tentan: det tar tid för företag att anpassa sina processer och organisationer till ny teknik. Inte: att tekniken bara påverkar små företag, alltid ger omedelbar effekt eller automatiskt ökar lönsamheten.",
      "Lösningen: koppla IT till affärsstrategin via kärnkompetens, strategic alignment och IT governance. 90-talets IT-drivna managementmetoder som 'löste' paradoxen: TQM, Kaizen/Lean/Six Sigma, JIT/Kanban, BPR, ERP, CRM, supply chain management, knowledge management, data warehousing, outsourcing.",
      "Clinger Cohen Act 1996 (USA, offentlig sektor): legitimerade CIO-rollen som strategisk ledningsfunktion, etablerade Enterprise Architecture som managementdisciplin, införde IT governance (IT som strategisk investering), gav COTS-system genomslag, gjorde strategic alignment centralt.",
      "Henderson & Venkatraman (1993): ingen enskild IT-applikation kan ge uthållig konkurrensfördel; fördelen kommer av organisationens förmåga att kontinuerligt utnyttja IT. IT-strategin ska både stödja och forma affärsstrategin.",
      "AI factory (Iansiti & Lakhani 2020): data pipeline, algorithm development, experimentation platform, IT infrastructure. Beslutsfattande som industriell process — inga mänskliga auktionsförrättare hos Google, inga dispatchers hos Uber.",
      "AI-anpassad organisation (Fountaine, McCarthy & Saleh 2019) kräver ny verksamhetsarkitektur: SSoT (single source of truth) för kärndata och MVoT (multiple versions of the truth) för lokala vyer.",
      "Datastrategi (DalleMule & Davenport 2017): data defense (regelefterlevnad, bedrägeri, intrång, SSoT) mot data offense (datainsamling, analys, BI/AI/ML, MVoT). Balansen beror på riskkontext: high stakes (rättsväsende, sjukvård, utbildning) → banker/försäkring → low stakes (detaljhandel, media, hotell).",
      "USA är 'vilda västern' med lite reglering, EU har regleringsfokus: GDPR har gjort de flesta sektorer high stakes för personuppgifter, AI Act är riskbaserad. Data resilience (backuper) är verksamhetskritiskt för AI-drivna organisationer.",
      "IT-problemen är inte lösta: spektakulära misslyckanden fortsätter och komplexiteten är kumulativ (spagetti → ERP/CRM/legacy → SOA/API → SaaS/moln → big data/AI → cybersäkerhet → agentisk AI). Paradoxen upprepar sig i varje nytt digitaliserat område.",
      "Drivkrafter mot kontinuerlig systemförbättring: global konkurrens (internet, produktcykler, logistik), nya regleringar (SOX, GDPR, CSRD, AI Act), frivillig efterlevnad (standarder, certifieringar, upphandlingskrav), accelererande teknik (IoT, cloud, SaaS, AI)."
    ],
    pitfalls: [
      "Produktivitetsparadoxens förklaring är organisatorisk anpassning som tar tid — inte tekniska brister och inte att paradoxen bara gäller små företag.",
      "'Löste' i föreläsningen står med citattecken: 90-talsmetoderna löste den dåvarande paradoxen, men den återkommer i varje ny teknikvåg.",
      "Data defense och offense är en balans, inte ett val — och var balansen ligger beror på sektorns riskkontext.",
      "Blanda inte ihop SSoT (en gemensam sanning för kärndata) med MVoT (anpassade lokala vyer) — organisationen behöver båda."
    ]
  },
```

# INNEHÅLL E — Tillägg till befintliga begreppskort

Lägg till dessa `keyPoints` **sist** i respektive kort (befintliga punkter behålls):

```js
// topic "mal" — nya keyPoints:
      "Neoklassisk teori analyserar företag och marknader på samhällsnivå: marknadens osynliga hand, laissez-faire, självreglerande marknad som belönar effektiva företag. Antaganden: perfekt information, perfekt rationalitet, resursallokering som inte är ett problem.",
      "Transaktionskostnadsteori: företag finns för att marknadens transaktionskostnader gör det effektivare att utföra vissa aktiviteter internt; växande företag får i stället interna transaktionskostnader. Praktisk fråga: make or buy, med fokus på kontrakt.",
      "Managementrevolutionen (Chandler, The Visible Hand 1977): företagsledares initiativ, inte marknaden, skapade storföretagen. Separation mellan ägande och styrning; tillväxt genom skalfördelar och vertikal integration.",
      "Föreläsningens namn: Baumol = Managerial Utility Maximization Theory, Williamson = Managerial Discretion Theory. Båda: ledningen fokuserar på egen nytta.",
      "Beteendeteorier (Cyert & March 1963): företaget som koalition av intressenter med olika motiv, imperfekt information, intern politik och kompromisser — visar behovet av tydliga visioner, strategier och styrsystem för alignment.",
      "Simons anspråksnivå beror på yttre faktorer, tradition/ägarpreferenser och kultur. Nobelpris 1978. Intressentmodellen förknippas med Eric Rhenman.",
      "Kalkylräntan i nuvärdesanalys tar hänsyn till inflation, alternativa investeringsmöjligheter och risk. I praktiken samma som räntabilitet/avkastning; svår att tillämpa när förutsättningar ändras snabbt."

// topic "it" — nya keyPoints:
      "Solow 1987: 'You can see the computer age everywhere but in the productivity statistics.' Föreläsningens förklaring: det tar tid att anpassa processer och organisation till ny teknik — och paradoxen upprepar sig i varje nytt digitaliserat område.",
      "Henderson & Venkatraman: ingen enskild IT-applikation ger uthållig fördel; fördelen ligger i förmågan att kontinuerligt utnyttja IT. IT-strategin ska både stödja och forma affärsstrategin."
```

# INNEHÅLL F — Nya ordlistetermer (`glossary`)

```js
  { term: "AI Act", definition: "EU:s reglering av artificiell intelligens med en riskbaserad ansats. En av de nya regleringar som driver kontinuerlig systemförbättring.", chapter: "digital" },
  { term: "AI factory", definition: "Iansiti & Lakhanis modell för AI-driven verksamhet i fyra delar: data pipeline, algorithm development, experimentation platform och IT infrastructure. Beslutsfattande som industriell process.", chapter: "digital" },
  { term: "Beteendeteorier om företaget", definition: "Cyert & March (1963): företaget som en koalition av intressenter med olika motiv, imperfekt information och intern politik. Grunden för satisfierings- och intressentmodellen.", chapter: "kap3" },
  { term: "BPR (Business Process Reengineering)", definition: "90-talsmetod för radikal omdesign av affärsprocesser; en av de IT-drivna managementmetoder som 'löste' produktivitetsparadoxen.", chapter: "digital" },
  { term: "CIO", definition: "Chief Information Officer. Rollen legitimerades som strategisk ledningsfunktion genom Clinger Cohen Act 1996.", chapter: "digital" },
  { term: "Clinger Cohen Act", definition: "Amerikansk IT-reform 1996 för offentlig sektor som legitimerade CIO-rollen, etablerade Enterprise Architecture, införde IT governance och gav COTS-system genomslag.", chapter: "digital" },
  { term: "COTS", definition: "Commercial off-the-shelf: färdiga standardsystem som ERP och CRM i stället för egenutvecklade applikationer.", chapter: "digital" },
  { term: "CRM", definition: "Customer Relationship Management. Standardsystem för kundhantering; typiskt COTS.", chapter: "digital" },
  { term: "Data defense", definition: "Datastrategins riskminimerande sida: regelefterlevnad, bedrägeribekämpning, intrångsskydd och intern dataintegritet via single source of truth.", chapter: "digital" },
  { term: "Data offense", definition: "Datastrategins avkastningsmaximerande sida: datainsamling, integration och analys, BI och AI/ML, multiple versions of the truth.", chapter: "digital" },
  { term: "Data resilience", definition: "Förmågan att skydda och återställa data (backuper m.m.); verksamhetskritisk för AI-drivna organisationer.", chapter: "digital" },
  { term: "Datastrategi", definition: "DalleMule & Davenport (2017): balansen mellan data defense och data offense, avgjord av verksamhetens riskkontext.", chapter: "digital" },
  { term: "Digital transformation", definition: "Dagens beteckning på den genomgripande digitaliseringen av verksamheter; enligt föreläsningen samma mönster som PC-revolutionen, inklusive en upprepad produktivitetsparadox.", chapter: "digital" },
  { term: "Enterprise application spaghetti", definition: "80–90-talets härva av osammanhängande system som följde av ostrukturerade IT-satsningar utan strategisk koppling.", chapter: "digital" },
  { term: "Enterprise Architecture (EA)", definition: "Managementdisciplin för att beskriva och styra verksamhetens samlade struktur av processer, information och IT. Etablerades genom Clinger Cohen Act.", chapter: "digital" },
  { term: "ERP", definition: "Enterprise Resource Planning: integrerat affärssystem för ekonomi, produktion, lager m.m.; typiskt COTS och en av 90-talets lösningar på systemkaoset.", chapter: "digital" },
  { term: "GDPR", definition: "EU:s dataskyddsförordning. Har enligt föreläsningen gjort de flesta sektorer 'high stakes' vad gäller personuppgifter.", chapter: "digital" },
  { term: "IT governance", definition: "Att styra IT som en strategisk investering, med tydligt ansvar och koppling till verksamhetens mål.", chapter: "digital" },
  { term: "Kumulativ komplexitet", definition: "Att varje ny IT-epok lägger ett lager ovanpå de tidigare — spagettiarkitektur, ERP/legacy, SOA/API, moln, AI, säkerhet, agentisk AI — och därmed ökar risken för misslyckanden.", chapter: "digital" },
  { term: "Make or buy", definition: "Transaktionskostnadsteorins praktiska fråga: tillverka själv eller köpa på marknaden.", chapter: "kap3" },
  { term: "Managementrevolutionen", definition: "Chandlers beskrivning (The Visible Hand, 1977) av hur företagsledares initiativ skapade storföretagen genom skalfördelar och vertikal integration, med separation mellan ägande och styrning.", chapter: "kap3" },
  { term: "Moores lag", definition: "Att datorkraften fördubblas med jämna mellanrum; skapade förutsättningarna för datorisering av allt fler företag och processer.", chapter: "digital" },
  { term: "MVoT (multiple versions of the truth)", definition: "Lokala datavyer anpassade för olika verksamhetsdelar; komplement till SSoT i en AI-anpassad organisation.", chapter: "digital" },
  { term: "Osynliga handen", definition: "Neoklassisk idé att marknaden självreglerar när individer agerar fritt efter egenintresse; motiverar laissez-faire.", chapter: "kap3" },
  { term: "Produktivitetsparadoxen", definition: "Att IT-investeringar inte syns i produktivitetsstatistiken (Solow 1987). Förklaring: det tar tid att anpassa processer och organisation till ny teknik. Upprepar sig i varje nytt digitaliserat område.", chapter: "digital" },
  { term: "SSoT (single source of truth)", definition: "En gemensam, auktoritativ källa för organisationens kärndata; grunden för intern dataintegritet.", chapter: "digital" },
  { term: "Structure follows strategy", definition: "Chandlers tes att organisationens struktur ska följa av dess strategi; i föreläsningen kompletterad med att samspelet är kontinuerligt.", chapter: "digital" },
  { term: "Transaktionskostnadsteori", definition: "Förklarar företagets existens och gränser med att marknadens transaktionskostnader gör intern samordning effektivare — tills interna transaktionskostnader tar över.", chapter: "kap3" }
```

Ta bort den befintliga posten "Produktivitetsparadoxen" (chapter kap9) och ersätt med den nya ovan, så att termen bara finns en gång.

# INNEHÅLL G — Nya frågor (`questions.js`)

Lägg till sist i `questions`. Samma designregler som filens kommentar anger. Frågorna str-q50 till str-q56 är skrivna i Weavers egen quizstil — korta, direkta, en per kärnbegrepp, `difficulty: 1` — som uppvärmning. Resten följer vår vanliga nivå. Kör mätskriptet efteråt och rapportera siffrorna för hela banken (66 frågor). Förväntat: unikt längst 16/66 (24 %), längdkvot 1,00, positioner 19/20/14/13, största spridning 1,24. Avviker siffrorna har inklistringen gått fel.

```js
  { id: "str-q50", topic: "mal", difficulty: 1,
    question: "Hur betraktas företaget i den neoklassiska teorin?",
    options: [
      { text: "Som ett öppet system med intressenter", explain: "Det är intressentmodellens bild, inte den neoklassiska." },
      { text: "Som en svart låda som omvandlar resurser", explain: "Rätt. Inflöde omvandlas till utflöde; hur det sker bortses från." },
      { text: "Som en koalition av olika intressegrupper", explain: "Det är beteendeteoriernas bild av företaget." },
      { text: "Som en samling perfekt rationella individer", explain: "Individerna bortses från helt i den neoklassiska modellen." }
    ],
    correct: 1, source: "Weaver, fö 1 / quiz F1", reviewed: true },

  { id: "str-q51", topic: "mal", difficulty: 1,
    question: "Vad är företagets mål enligt neoklassisk teori?",
    options: [
      { text: "Att maximera företagets vinst", explain: "Rätt. Vinsten är det enda målet och enda måttet på effektivitet." },
      { text: "Att optimera sina kassaflöden", explain: "Det är de kassaflödesbaserade modellernas mål." },
      { text: "Att nå en godtagbar vinstnivå", explain: "Det är satisfieringsmodellens mål." },
      { text: "Att balansera intressenters krav", explain: "Det är intressentmodellens mål." }
    ],
    correct: 0, source: "Weaver, fö 1 / quiz F1", reviewed: true },

  { id: "str-q52", topic: "mal", difficulty: 1,
    question: "Vilken teori säger att företag söker en tillfredsställande snarare än maximal vinst?",
    options: [
      { text: "Den neoklassiska teorin", explain: "Den antar tvärtom vinstmaximering." },
      { text: "Kassaflödesbaserad modell", explain: "Den maximerar nuvärdet av framtida kassaflöden." },
      { text: "Transaktionskostnadsteorin", explain: "Den förklarar företagets gränser, inte dess vinstmål." },
      { text: "Satisfieringsmodellen", explain: "Rätt. Simon: begränsad rationalitet ger en anspråksnivå i stället för maximum." }
    ],
    correct: 3, source: "Weaver, fö 1 / quiz F1", reviewed: true },

  { id: "str-q53", topic: "mal", difficulty: 1,
    question: "Vad är företagets huvudsakliga mål enligt intressentmodellen?",
    options: [
      { text: "Att minimera verksamhetens kostnader", explain: "Kostnadsminimering är inte modellens mål." },
      { text: "Att maximera försäljningsvolymen", explain: "Det är Baumols modell." },
      { text: "Att balansera intressenters krav", explain: "Rätt. Målet är en kompromiss som ger långsiktig stabilitet." },
      { text: "Att maximera ägarnas avkastning", explain: "Ägarna är en av flera intressenter, inte den enda." }
    ],
    correct: 2, source: "Weaver, fö 1 / quiz F1", reviewed: true },

  { id: "str-q54", topic: "it", difficulty: 1,
    question: "Vilken är en möjlig förklaring till produktivitetsparadoxen?",
    options: [
      { text: "Ny teknik ger alltid omedelbar effektivitetsvinst", explain: "Om det stämde skulle paradoxen inte finnas." },
      { text: "Anpassning av processer och organisation tar tid", explain: "Rätt. Vinsten kommer först när arbetssätten ändras." },
      { text: "Ny teknik påverkar bara små och medelstora företag", explain: "Paradoxen observerades i hela ekonomin." },
      { text: "Innovationer höjer lönsamheten helt automatiskt", explain: "Automatik är precis vad paradoxen motsäger." }
    ],
    correct: 1, source: "Weaver, fö 1 / quiz F1", reviewed: true },

  { id: "str-q55", topic: "mal", difficulty: 1,
    question: "Vad innebär den neoklassiska teorin om vinstmaximering?",
    options: [
      { text: "Företag strävar efter att maximera försäljningen", explain: "Försäljningsmaximering är Baumols modell." },
      { text: "Företag strävar efter att optimera kundnöjdhet", explain: "Kundnöjdhet är ett icke-finansiellt mål, inte modellens." },
      { text: "Företag strävar efter att minimera sina kostnader", explain: "Kostnader är ena sidan; målet är vinsten som helhet." },
      { text: "Företag strävar efter att maximera sin vinst", explain: "Rätt. Intäkt minus kostnad ska bli så stor som möjligt." }
    ],
    correct: 3, source: "Weaver, fö 1 / quiz F1", reviewed: true },

  { id: "str-q56", topic: "mal", difficulty: 1,
    question: "Vad fokuserar intressentmodellen på?",
    options: [
      { text: "Ett stabilt kassaflöde över tid", explain: "Kassaflödet hör till en annan modell." },
      { text: "Att begränsa ledningens inflytande", explain: "Ledningen är en intressent bland flera, inget som ska begränsas." },
      { text: "Att maximera ägarnas avkastning", explain: "Ägarna är bara en av intressenterna." },
      { text: "Balans mellan intressenternas krav", explain: "Rätt. Balansen ger företaget långsiktig stabilitet." }
    ],
    correct: 3, source: "Weaver, fö 1 / quiz F1", reviewed: true },

  { id: "str-q57", topic: "digital", difficulty: 2,
    question: "Vad kännetecknade de tidiga enterprise-systemen på 1960-talet?",
    options: [
      { text: "Standardsystem köpta färdiga från leverantörer och anpassade till verksamheten.", explain: "COTS-systemens genomslag kom först på 90-talet efter Clinger Cohen." },
      { text: "Egenutvecklade applikationer som hanterade en process i taget, var för sig.", explain: "Rätt. Lön, redovisning, lager — varje system för sig, hos storföretag och myndigheter." },
      { text: "Integrerade affärssystem som band samman företagets alla huvudprocesser.", explain: "Integrerade ERP-system är en 90-talslösning på det tidigare kaoset." },
      { text: "Persondatorbaserade lösningar som spreds snabbt till små och medelstora företag.", explain: "PC:n kom på 80-talet; de tidiga systemen körde på stordatorer." }
    ],
    correct: 1, source: "Weaver, fö 1", reviewed: true },

  { id: "str-q58", topic: "digital", difficulty: 2,
    question: "Vilken orsak anger föreläsningen till 80- och 90-talets 'enterprise application spaghetti'?",
    options: [
      { text: "Att företagen leddes av en generation som inte såg IT som en strategisk fråga.", explain: "Rätt. IT hamnade i en silo utan koppling till kärnaffären." },
      { text: "Att lagstiftningen krävde separata system för olika typer av affärsdata.", explain: "Reglering var inte drivkraften bakom systemkaoset." },
      { text: "Att stordatorernas kapacitet inte räckte för integrerade lösningar.", explain: "Problemet var organisatoriskt, inte tekniskt." },
      { text: "Att leverantörerna medvetet byggde system som inte kunde kommunicera.", explain: "Inlåsning fanns, men föreläsningen pekar på företagens egna satsningar." }
    ],
    correct: 0, source: "Weaver, fö 1", reviewed: true },

  { id: "str-q59", topic: "digital", difficulty: 2,
    question: "Vem formulerade 1987 att datoråldern syns överallt utom i produktivitetsstatistiken?",
    options: [
      { text: "Michael Porter, i samband med analysen av branschers konkurrenskrafter.", explain: "Porter arbetade med positionering, inte med produktivitetsstatistik." },
      { text: "Alfred Chandler, i argumentet om att struktur följer strategi.", explain: "Chandlers bidrag rör organisationens struktur, inte IT-produktivitet." },
      { text: "Robert Solow, som sammanfattade produktivitetsparadoxen i en mening.", explain: "Rätt. Citatet är föreläsningens illustration av paradoxen." },
      { text: "Henderson och Venkatraman, i modellen om strategic alignment.", explain: "Deras bidrag kom 1993 och handlade om lösningen, inte problemet." }
    ],
    correct: 2, source: "Weaver, fö 1", reviewed: true },

  { id: "str-q60", topic: "digital", difficulty: 2,
    question: "Vilka tre idéer pekar föreläsningen ut som lösningen på produktivitetsparadoxen?",
    options: [
      { text: "Outsourcing, standardisering och centraliserad IT-avdelning.", explain: "Outsourcing var en av metoderna, men inte en av de tre bärande idéerna." },
      { text: "Kärnkompetens, strategic alignment och IT governance.", explain: "Rätt. IT kopplades till affärsstrategin genom dessa tre." },
      { text: "Moores lag, persondatorn och internet som infrastruktur.", explain: "Det är teknikens utveckling, som snarare skapade paradoxen." },
      { text: "Balanserat styrkort, benchmarking och målkostnadskalkyl.", explain: "Detta är styrmetoder ur AJK, inte föreläsningens svar." }
    ],
    correct: 1, source: "Weaver, fö 1", reviewed: true },

  { id: "str-q61", topic: "digital", difficulty: 2,
    question: "Vad innebar Clinger Cohen Act 1996 enligt föreläsningen?",
    options: [
      { text: "Att amerikanska myndigheter förbjöds använda standardsystem från privata leverantörer.", explain: "Tvärtom: COTS-system fick stort genomslag." },
      { text: "Att CIO-rollen legitimerades och Enterprise Architecture etablerades som disciplin.", explain: "Rätt. Dessutom IT governance, COTS och strategic alignment som centralt koncept." },
      { text: "Att EU och USA enades om gemensamma regler för dataskydd i offentlig sektor.", explain: "Lagen var amerikansk och rörde IT-styrning, inte dataskydd." },
      { text: "Att IT-avdelningar skulle rapportera till ekonomichefen i stället för till vd.", explain: "Poängen var det motsatta: IT lyftes till strategisk ledningsnivå." }
    ],
    correct: 1, source: "Weaver, fö 1", reviewed: true },

  { id: "str-q62", topic: "digital", difficulty: 3,
    question: "Vilka fyra delar ingår i 'the AI factory' enligt Iansiti och Lakhani?",
    options: [
      { text: "Data pipeline, algorithm development, experimentation platform, IT infrastructure.", explain: "Rätt. Tillsammans gör de beslutsfattande till en industriell process." },
      { text: "Data defense, data offense, single source of truth, multiple versions of the truth.", explain: "Det är begrepp ur datastrategin och den AI-anpassade organisationen." },
      { text: "Affärsstrategi, IT-strategi, organisationsinfrastruktur, IT-infrastruktur.", explain: "Det är Strategic Alignment Models fyra domäner." },
      { text: "Datainsamling, regelefterlevnad, modellträning, kundgränssnitt och support.", explain: "Regelefterlevnad och kundgränssnitt ingår inte i modellen." }
    ],
    correct: 0, source: "Weaver, fö 1 / Iansiti & Lakhani", reviewed: true },

  { id: "str-q63", topic: "digital", difficulty: 2,
    question: "Vad hör till data defense i DalleMule och Davenports datastrategi?",
    options: [
      { text: "Data mining, BI och maskininlärning för att maximera avkastningen på data.", explain: "Det är data offense — att maximera datans ROI." },
      { text: "Datainsamlingsstrategier och integration av externa datakällor i analysen.", explain: "Datainsamling hör till offense-sidan." },
      { text: "Multiple versions of the truth anpassade för olika delar av verksamheten.", explain: "MVoT är offense; defense bygger på single source of truth." },
      { text: "Regelefterlevnad, intrångsskydd och dataintegritet via en gemensam sanning.", explain: "Rätt. Defense minimerar datarisk; SSoT är dess grund." }
    ],
    correct: 3, source: "Weaver, fö 1 / DalleMule & Davenport", reviewed: true },

  { id: "str-q64", topic: "digital", difficulty: 3,
    question: "Vilken sektor ligger enligt föreläsningen i high-stakes-änden av datastrategins riskspektrum?",
    options: [
      { text: "Detaljhandel och onlinetjänster, där kunddata utgör kärnan i hela affären.", explain: "Detaljhandel ligger i low-stakes-änden där offense väger tyngre." },
      { text: "Sjukvård, rättsväsende och socialtjänst, där felaktig data får allvarliga följder.", explain: "Rätt. Här dominerar data defense." },
      { text: "Media och underhållning, där personuppgifter används för rekommendationer.", explain: "Media räknas till low stakes tillsammans med detaljhandel." },
      { text: "Tillverkningsindustrin, där produktionsdata styr automatiserade processer.", explain: "Tillverkning nämns inte som high-stakes-exempel i föreläsningen." }
    ],
    correct: 1, source: "Weaver, fö 1", reviewed: true },

  { id: "str-q65", topic: "mal", difficulty: 3,
    question: "Vad förklarar transaktionskostnadsteorin?",
    options: [
      { text: "Varför företag existerar och var gränsen mellan företag och marknad dras.", explain: "Rätt. Marknadens transaktionskostnader gör intern samordning effektivare — till en gräns." },
      { text: "Varför företagsledningen maximerar sin egen nytta snarare än vinsten.", explain: "Det är företagsledarmodellernas fråga." },
      { text: "Varför företag söker en tillfredsställande i stället för maximal vinst.", explain: "Det är satisfieringsmodellen." },
      { text: "Varför marknaden självreglerar när individer följer sitt egenintresse.", explain: "Det är den neoklassiska osynliga handen." }
    ],
    correct: 0, source: "Weaver, fö 1", reviewed: true },

  { id: "str-q66", topic: "digital", difficulty: 3,
    question: "Vad menar föreläsningen med att komplexiteten i IT-landskapet är kumulativ?",
    options: [
      { text: "Att kostnaden för IT-projekt ökar exponentiellt med antalet inblandade leverantörer.", explain: "Kostnadsutveckling är inte det som avses med kumulativ." },
      { text: "Att varje ny teknikepok lägger ett lager ovanpå de tidigare, som ligger kvar.", explain: "Rätt. Spagetti, ERP, SOA, moln, AI — inget försvinner, allt ska integreras." },
      { text: "Att allt fler användare gör systemen svårare att administrera och säkra.", explain: "Användarantal är inte föreläsningens poäng." },
      { text: "Att äldre system måste ersättas helt innan nya kan införas i verksamheten.", explain: "Tvärtom: legacysystemen blir kvar och skapar komplexiteten." }
    ],
    correct: 1, source: "Weaver, fö 1", reviewed: true }
```

## Acceptanskriterier

- [ ] `npm run build` går igenom; inga konsolfel.
- [ ] Nytt kapitel visas som nummer 9, kap9 som 10, kap10 som 11; inga id ändrade; läsprogress för redan lästa kapitel är intakt efter uppdateringen.
- [ ] Alla "Kapitel N"-referenser (begreppskort, ordlista, sökträffar) visar rätt nummer efter omnumreringen.
- [ ] Kapitel 3 och 9 (nu 10) har tilläggen på angivna platser; inget befintligt innehåll borttaget.
- [ ] Nytt ämne "digital" finns med 15 keyPoints och 4 pitfalls; kapitelavslutet för det nya kapitlet visar dem.
- [ ] Ämnena "mal" och "it" har sina nya keyPoints sist; ordlistan har de nya termerna och bara en "Produktivitetsparadoxen".
- [ ] Frågebanken har 66 frågor. Mätskriptet rapporterar: unikt längst under 35 %, längdkvot 0,90–1,10, varje position 12–22, ingen fråga över 1,25 i spridning. Rapportera siffrorna.
- [ ] Öva och Prov inkluderar de nya frågorna; ämnesfiltret visar "Enterprise IT och digital transformation".
- [ ] All UI-text på svenska, inga nya färger.

Bygg klart, verifiera och sammanfatta med mätsiffrorna först.
