// Kompendiet (löptext) och ordlistan för delkursen Databaser.
//
// Samma ansvarsfördelning som för Strategi: löptexten ägs här, de korta
// punkterna ägs av topics.js, och kapitelavsluten renderas ur kapitlets
// primaryTopics via lib/topicLookup.js. Facktermerna ges på både svenska
// och engelska med flit — tentan är på engelska.

const reading = {
  title: "Databaser",
  subtitle: "Läskompendium",
  intro: "Delkursen handlar om hur man kommer från en verksamhets behov till en fungerande databas, och tentan prövar fyra saker: ER-modellering, transformation från konceptuell till fysisk modell, normalisering och SQL. Kompendiet följer den designprocessen i ordning — konceptuell design, logisk design, fysisk design — med relationsmodellen och nycklarna som grund. Läs kapitel 1 till 3 innan du börjar med SQL-verkstaden; resten av kapitlen kan läsas i vilken ordning som helst, men de bygger på varandra. Räkna med ungefär {lästid}. Fackterminologin ges på både svenska och engelska, eftersom tentan är på engelska.",
  chapters: [

  {
    id: "kap1",
    number: 1,
    title: "Databaser, servrar och designprocessen",
    readingMinutes: 8,
    lead: "Vad en databas faktiskt är, var den bor, och de tre stegen från verksamhetskrav till körbar SQL.",
    sources: ["Föreläsning 1"],
    body: `
En **databas** är en strukturerad samling data som lagras och nås elektroniskt, utformad för att effektivt lagra, hämta och hantera information.

Det är värt att vara noga med vad som är vad. LADOK och TimeEdit är inte databaser — de är applikationer som kommunicerar med databaser. När du kollar ditt schema i telefonen pratar din telefon med en **server** över internet, och servern hämtar data ur databasen och skickar tillbaka den till appen.

En server är i grunden "en dator som aldrig stängs av". I den här kursen kör vi **SQL Server** som databashanterare på en virtuell maskin i **Microsoft Azure**, och ansluter till den från VS Code med mssql-tillägget. Kod versionshanteras i GitHub.

## Varför inte bara filer?

Data i en Java-\`ArrayList\` ligger i RAM och försvinner när programmet stängs — det är **volatil** lagring. **Persistent** lagring kan göras med filer, kalkylblad, relationsdatabaser (RDBMS) eller dokumentorienterade databaser (NoSQL). Alla tjänar samma syfte: att lagra, skydda och hämta data.

Ett **relationsdatabashanteringssystem** (RDBMS) lagrar data i tabeller och frågas med **SQL** (Structured Query Language), ett språk för att skapa, läsa, uppdatera och radera data samt administrera databasen.

## Affärsfrågan som motiverar allt

Föreläsningens exempel är värt att hålla i minnet: *"Jag vill ha namn och telefonnummer på alla kunder som lagt mer än två ordrar de senaste tre månaderna, där en av dem innehöll minst åtta produkter ur kategorin Lyx."*

Hur lång tid skulle det ta en kontorist att svara på det manuellt? Och hur lång tid tar det med en databas och en välskriven fråga? Det är hela poängen med ämnet.

## Vem bestämmer vad som lagras?

Inte databasadministratören ensam. Frågan man ställer är: **vad behöver verksamheten lagra data om för att fungera?** Vilken data kräver processerna? Vad behövs för kvalitetssäkring, för regelefterlevnad, för intern rapportering? Verksamhetssidan måste alltid konsulteras, och resultatet av den dialogen mellan verksamhet och IT blir en lista på saker — som det visar sig går att modellera.

## Designprocessens tre steg

Detta är kompendiets ryggrad, och tentans struktur.

**Verksamhetskrav** formuleras i löpande text:

- En anställd har ett unikt anställningsnummer, ett namn och en lön.
- En anställd måste arbeta på exakt en avdelning.
- En avdelning har ett unikt namn och en budget.
- En avdelning kan ha flera anställda.

**1. Konceptuell databasdesign** — ER-modellering. Kraven blir ett **ER-diagram**, en abstraktion av verkligheten. Kapitel 4 och 5.

**2. Logisk databasdesign** — transformation av den konceptuella modellen till **relationer**, skrivna i textform: \`Employee(EmpNo, Name, Salary, DepartmentName)\`. Följt av **normalisering** om det behövs. Kapitel 6 och 7.

**3. Fysisk databasdesign** — implementation av den logiska modellen som **DDL-satser**, alltså körbar \`CREATE TABLE\`-kod. Kapitel 8.

Lägg märke till att SQL kommer sist. Det är först när modellen är genomtänkt som koden skrivs — och det är därför tentan prövar modellering minst lika hårt som SQL.
`
  },

  {
    id: "kap2",
    number: 2,
    title: "Relationsmodellen",
    readingMinutes: 8,
    lead: "Den formella grunden: relation, attribut, tupel, domän — och de sju egenskaper varje relation måste uppfylla.",
    sources: ["Föreläsning 5", "Föreläsning 6"],
    body: `
En **relation** är ett matematiskt begrepp, byggt på mängdlära och första ordningens logik, som visuellt framställs som en tabell. Att relationsdatabaser vilar på matematik är inte en kuriositet — det är vad som gör att normalformerna kan bevisas och att frågeoptimerare kan skriva om dina frågor utan att ändra svaret.

## Terminologin i tre lager

Samma sak har tre uppsättningar namn beroende på hur formell man är. Tabellen är värd att kunna åt båda hållen:

| Formellt | Alternativ 1 | Alternativ 2 |
|---|---|---|
| Relation | Tabell | Fil |
| Attribut | Kolumn | Fält |
| Tupel | Rad | Post |

På engelska: relation / table / file, attribute / column / field, tuple / row / post.

Definitionerna:

> **Relation:** en mängd tupler där varje element tillhör en domän.
> **Attribut:** ett namn parat med en domän.
> **Tupel:** en mängd attributvärden där inga två skilda element har samma attributnamn.
> **Domän (domain):** alla värden som ett dataelement kan innehålla.
> **Grad (degree):** antalet attribut i relationen.
> **Kardinalitet (cardinality):** antalet tupler i relationen.

En **domän** är inte samma sak som en datatyp, även om de överlappar. Domänen \`SalaryType\` kan definieras som numerisk med sju siffror i intervallet 10 000–30 000 — datatypen säger bara \`INT\`. Domänen bär alltså affärsregeln.

## Relationens sju egenskaper

Detta är en lista att kunna. En relation har:

1. **Unikt namn.** Två relationer i samma databas kan inte heta samma sak.
2. **Atomära värden i varje cell.** \`Name = "Alice, Bob"\` är inte tillåtet — det ska vara två tupler. Detta är exakt vad första normalformen kräver, och det är därför 1NF sällan är ett problem i praktiken: en tabell som bryter mot det är inte en relation till att börja med.
3. **Distinkta attributnamn.** Två kolumner i samma relation kan inte heta samma sak.
4. **Samma datatyp och domän för alla värden i ett attribut.**
5. **Attributens ordning saknar betydelse.** Byter du plats på kolumnerna är det samma relation.
6. **Tuplernas ordning saknar betydelse.** Detta är skälet till att en SQL-fråga utan \`ORDER BY\` inte har någon garanterad radordning.
7. **Inga dubblettupler.** Två identiska rader kan inte förekomma i en relation.

Punkt 5 till 7 är teoretiska sanningar som verkliga databaser bara delvis upprätthåller — SQL-tabeller kan innehålla dubbletter om du inte hindrar det med en nyckel. Att veta skillnaden mellan relationsmodellens ideal och SQL:s praktik är precis den sortens nyans en tenta gillar.

## Från relation till information

Poängen med hela apparaten är att en rad ska gå att läsa som en mening. Raden \`E1 | Alice | 20000 | Engineering | 500000\` betyder: den anställda med nummer E1, som heter Alice och har lönen 20 000, arbetar på avdelningen Engineering som har budgeten 500 000.

Håll den läsningen i huvudet när du kommer till normalisering. Problemet med raden ovan är nämligen att den berättar två saker samtidigt — en om en anställd och en om en avdelning — och det är därifrån alla anomalier kommer.
`
  },

  {
    id: "kap3",
    number: 3,
    title: "Nycklar och referensintegritet",
    readingMinutes: 9,
    lead: "Kandidatnyckel, primärnyckel, sammansatt nyckel, främmande nyckel — och varför surrogatnycklar väntar till sista steget.",
    sources: ["Föreläsning 5", "Föreläsning 7"],
    body: `
Nycklar är det som gör att rader går att hitta och tabeller går att koppla samman. De prövas i alla fyra tentaområden, så det här kapitlet lönar sig.

## Kandidatnyckel

> **Kandidatnyckel (candidate key):** ett attribut eller en uppsättning attribut som kan användas för att unikt identifiera vilken tupel som helst i en relation.

En relation kan ha **flera** kandidatnycklar. I \`Employee(EmployeeNo, Email, Name)\` är både \`EmployeeNo\` och \`Email\` kandidatnycklar, eftersom vardera identifierar en anställd unikt.

En **sammansatt kandidatnyckel (composite candidate key)** består av flera attribut tillsammans. I \`Employee(EmployeeNo, FirstName, LastName, Email)\` kan kandidatnycklarna vara \`EmployeeNo\` och kombinationen \`{FirstName, LastName}\` — den senare sammansatt. I skriftlig notation stryks båda attributen under.

## Primärnyckel

> **Primärnyckel (primary key):** ett specifikt val av ett attribut eller en uppsättning attribut som unikt identifierar en tupel i en relation.

Skillnaden mot kandidatnyckel är alltså **valet**. Kandidatnycklarna är alla som *kan* användas; primärnyckeln är den som databasarkitekten *väljer*. Kriterierna vid valet: nyckeln bör vara stabil (ändras inte över tid), minimal och semantiskt meningsfull.

Det här är en klassisk tentafråga i formen "hur många kandidatnycklar har relationen R?" — och svaret kräver att du kan läsa av funktionella beroenden, vilket kapitel 7 handlar om.

## Primärattribut och icke-primärattribut

Två begrepp som är nödvändiga för normalformerna:

> **Primärattribut (prime attribute):** ett attribut som är medlem i **någon** kandidatnyckel.
> **Icke-primärattribut (non-prime attribute):** ett attribut som inte är medlem i någon kandidatnyckel.

Notera "någon". Har relationen två kandidatnycklar räknas attribut ur båda som primärattribut. Det är en vanlig felkälla.

## Främmande nyckel

> **Främmande nyckel (foreign key):** ett attribut i en relation som refererar till primärnyckeln i en annan (eller samma) relation.

I \`Employee(EmployeeNo, Name, Address, Salary, ProjectNo)\` är \`ProjectNo\` en främmande nyckel som pekar på \`Project(ProjectNo, ...)\`. Den refererade relationen kallas **parent**, **referenced** eller **master**.

Främmande nycklar upprätthåller **referensintegritet**: du kan inte lägga in en anställd på ett projekt som inte finns, och du kan inte radera ett projekt som har anställda kopplade till sig. Det är hela poängen — databasen vägrar hamna i ett inkonsekvent tillstånd.

En främmande nyckel får vara **NULL** om deltagandet är frivilligt. En bil utan ägare har \`EmployeeID = NULL\`. Är deltagandet obligatoriskt sätts kolumnen till \`NOT NULL\`.

## Naturliga och surrogatnycklar

En **naturlig nyckel** är ett attribut som har betydelse i verksamheten: personnummer, anställningsnummer, ISBN. En **surrogatnyckel** är ett artificiellt värde som databasen genererar, typiskt ett löpnummer utan innebörd.

Här gör kursen en poäng som är lätt att missa och som mycket väl kan komma på tentan: **surrogatnycklar hör inte till den logiska designen.**

Under logisk design översätter du ER-modellen direkt till relationer, och målet är att **bevara modellens semantik och innebörd**. Du använder därför de naturliga identifierare som ER-modellen anger. Skälen: begreppslig klarhet, att naturliga nycklar speglar verkliga affärsregler, och att surrogatnycklar är en fysisk optimering — inte en begreppslig fråga.

Surrogatnycklarna kommer in i **fysisk design**, och då av praktiska skäl: nyckelstabilitet (undvika att nyckelvärden ändras) och prestanda (effektivare joins och index).

Det är därför kursens \`hospital-ddl.sql\` har både \`EmployeeID\` (surrogat, primärnyckel) och \`EmpNo\` (naturlig, unik) — den fysiska modellen har lagt till surrogatnyckeln medan den logiska modellens naturliga nyckel bevarats som en \`UNIQUE\`-constraint. Ser du det mönstret i en tentauppgift vet du vilket designsteg du befinner dig i.
`
  },

  {
    id: "kap4",
    number: 4,
    title: "Modell, entiteter och attribut",
    readingMinutes: 16,
    lead: "Metamodell, modell och diagram är tre olika saker; entitetstyp, entitetsmängd och entitet är tre nivåer. Attribut, värdemängder och identifierare i Chen-notation.",
    sources: ["Föreläsning 4"],
    body: `
**ER-modellering (Entity-Relationship modeling)** är konstruktionen av ER-diagram för att fånga verksamhetens krav på persistent datalagring, som underlag för design av relationsdatabaser som möter dessa krav. Metoden går tillbaka på Peter Chen: en konferensversion på den första VLDB-konferensen i september 1975 och den utökade tidskriftsartikeln *The Entity–Relationship Model — Toward a Unified View of Data* i ACM TODS i mars 1976.

Chens förslag hade två delar, och skillnaden mellan dem är det här kapitlets röda tråd. Den ena är **ER-datamodellen** — begreppen entities, relationships, attributes, roles och constraints, som gör verksamhetens semantik explicit. Den andra är en **diagramteknik** — rektanglar, romber, rollnamn och M:N-etiketter, som gör de valda begreppen synliga under designarbetet. En modell och ett ritsätt är alltså två skilda saker.

Föreläsningen täcker ett enda steg i databasdesignen: att bygga en **konceptuell datamodell** som ett ER-diagram, innan något bestäms om tabeller, nycklar eller SQL. Kapitel 1 visade kedjan från verksamhetskrav till DDL; här stannar vi i det första steget. Notera redan nu en gräns som återkommer: modellen kan uttrycka regler som schemat inte kan tvinga fram. Att varje projekt måste delta i \`WorksOn\` går att säga i modellen, men främmande nycklar kan inte upprätthålla ett sådant minimikrav.

## Metamodell, modell och representation

Efter 1979 växte ER till en hel familj av metoder, verktyg och läroböcker. Kärnan — entitetstyper, relationstyper, attribut och kardinalitetsvillkor — förblev igenkännbar, men detaljer, notation och metod varierade. **Det finns ingen enda universellt antagen ERD-specifikation.** Därför ser diagram olika ut i olika böcker och verktyg, och därför behöver du tre begrepp för att inte blanda ihop vad som är vad.

Föreläsningen använder en liten tunnelbana som exempel. **Metamodellen** är vokabulären: här bara tre påståenden — \`Line\`, \`Stop\` och \`Line has stops\`. Metamodellen säger vad en modell *får* uttrycka. **Modellen** består av fakta om en viss tunnelbana: att \`Central Line\` finns, att \`Stop A\` och \`Stop B\` finns, och att linjen har de stoppen. \`Central Line\` tillhör alltså modellen, inte metamodellen. En **representation** är ett sätt att visa modellen: samma fem fakta kan skrivas som vanlig text, som XML eller ritas som en karta. Olika syntax, samma modell — och **ingen av representationerna *är* modellen.**

Ett **diagram** är en grafisk representation som använder en **notation**. Det är inte en annan modell, och placeringen på pappret är bara schematisk. Lägger man till \`Stop C\` ändras modellen (två nya fakta), men metamodellen är oförändrad: \`Line\`, \`Stop\` och \`Line has stops\` är fortfarande de enda tillåtna begreppen.

Staplade på varandra blir det fyra lager: metamodellen *definierar språket* för modellen, modellen *representeras av* diagrammet, och modellen *beskriver* den modellerade verkligheten. Skrivsättet \`Central Line : Line\` anger vilken metamodelltyp ett element har.

### De fyra lagren för ER

[[diagram:fyra-lager]]

Samma fyra lager för ER-modellering ser ut så här:

- **ER-metamodellen:** \`EntityType\`, \`Attribute\`, \`RelationshipType\`, \`Participation/Role\`, \`CardinalityConstraint\`.
- **ER-modellen:** \`Employee : EntityType\`, \`WorksOn : RelationshipType\`, \`assignmentStartDate : Attribute\`, och faktumet att \`WorksOn\` äger \`assignmentStartDate\`.
- **ER-diagrammet:** rektanglar, en romb, deltagandelinjer, en ellips och etiketter.
- **Populationen:** \`Mary : Employee\`, \`Atlas : Project\`, \`Mary WorksOn Atlas\` med startdatum 2026-09-01.

Populationens objekt **instansierar** modellens typer. Diagrammet är bara ett av flera sätt att representera modellen — samma sak kunde stå som text eller XML.

Metamodellen säger också hur begreppen hänger ihop. Ett **deltagande (participation/role)** tillhör exakt en relationstyp och refererar exakt en entitetstyp; ett valfritt rollnamn skiljer deltagandena åt. En relationstyp har **två eller flera** deltaganden. Ett kardinalitetsvillkor har ett minimum och ett maximum. Och varje attribut ägs av **antingen** en entitetstyp **eller** en relationstyp — aldrig båda.

Kursens notation är en modern, Chen-härledd variant: **rektangel** för entitetstyp, **romb** för relationstyp, **ellips** för attribut. Vad ett sådant diagram säger är att anställda kan arbeta på projekt och att kopplingen kan ha ett startdatum. Vad det ännu inte bestämmer är tabeller, kolumner, främmande nycklar, lagringsformat eller datatyper — det kommer i logisk och fysisk design.

## Vad en entitet är

> **Entity (Chen 1976):** *An entity is a "thing" which can be distinctly identified.*

*Distinctly identified* betyder att modellen kan skilja en entitet från alla andra. Det är hela definitionen, och den bär långt: de svaga entiteterna i kapitel 6 är fortfarande entiteter, just för att de kan skiljas åt.

En entitet är en **informationsabstraktion**. En verklig person har namn, anställningsdatum, arbetsmejl, längd, vikt och oändligt mycket mer. Filtret är frågan *behövs det för verksamhetens processer?* Ja → in i modellen. Nej → utanför. En \`Employee\`-entitet är en **ändamålsbestämd informationsrepresentation** av en person, inte en fullständig beskrivning — längd och vikt lämnas utanför för att personaladministrationen inte behöver dem.

En **entitetstyp (entity type)** grupperar entiteter med relevanta gemensamma egenskaper. \`Employee\` och \`Project\` är två sorters saker som organisationen valt att representera. I Chen-notation ritas entitetstypen som en rektangel, och namnet är normalt ett **substantiv i singular**. En **stark entitetstyp (strong entity type)** kan identifiera varje entitet utan att bero på en entitet av annan typ; den ritas med enkel rektangel, och både \`Employee\` och \`Project\` är starka.

## Typ, mängd och instans

Tre nivåer som föreläsningen håller isär noggrant, och som du ska kunna skilja på:

- **Entitetstyp (entity type)** — definierar kategorin och de gemensamma egenskaperna. Det är det du ritar.
- **Entitetsmängd (entity set)** — samlingen av alla entiteter av typen som representeras **vid en viss tidpunkt**. Populationen kan växa, krympa eller vara tom.
- **Entitet (entity)** — en enskild medlem av entitetsmängden.

[[diagram:population-entiteter]]

Vid en tidpunkt *t* kan entitetsmängden för \`Employee\` innehålla \`e1\` Mary (E-104), \`e2\` Gary (E-207) och \`e3\` Sam (E-311). En vecka senare kan den se annorlunda ut, utan att entitetstypen ändrats.

Analogin till objektorienterad programmering fungerar bra just här: entitetstyp ≈ klass, entitetsmängd ≈ alla objekt av klassen just nu, entitet ≈ objekt. Precis som du aldrig ritar enskilda objekt i ett klassdiagram ritar du aldrig enskilda entiteter i ett ER-diagram. Men analogin gäller strukturen, inte paradigmet — ER har inga metoder, inget arv, och relationer beter sig inte som associationer.

## Attribut

Ett **attribut (attribute)** är en namngiven egenskap som beskriver instanserna av en entitetstyp *eller* en relationstyp. Det ritas som en oval kopplad till sin ägare, och kopplingen visar **vilket element som äger** attributet. \`name\` och \`hireDate\` beskriver \`Employee\`; \`title\` och \`budget\` beskriver \`Project\`. Vissa egenskaper beskriver i stället själva associationen: \`assignmentStartDate\` beskriver ett visst par av anställd och projekt, och samma anställd kan därför ha olika startdatum för olika projekt. Sådana relationsattribut återkommer i kapitel 5.

[[diagram:attribut]]

Varje attribut bär flera oberoende modelleringsbeslut, och besluten har egna symboler:

**Enkelt eller sammansatt.** Ett **enkelt attribut (simple)** behandlas som ett odelbart värde för modellens syfte, som \`name\`. Ett **sammansatt attribut (composite)** har meningsfulla delattribut: \`address\` med \`streetName\`, \`streetNumber\`, \`postalCode\` och \`city\`. Vad som är en nyttig uppdelning beror på modellens syfte, inte på ordet i sig.

**Ett värde eller flera.** Ett **envärt attribut (single-valued)** har högst ett värde vid en given tidpunkt, som \`workEmail\`, och ritas med vanlig oval. Ett **flervärdesattribut (multivalued)** kan ha flera värden samtidigt, som \`phoneNumber\`, och ritas med dubbel oval. Antalet värden är ett modelleringsbeslut, inte en egenskap hos ordet man valt som namn.

**Obligatoriskt eller frivilligt.** Varje \`Project\` måste ha ett \`title\` (**mandatory attribute**), men får sakna \`description\` (**optional attribute**). Båda ritas med vanlig oval — Chen-varianterna har ingen gemensam symbol för skillnaden. Skriv därför ut villkoret explicit och håll konventionen konsekvent.

**Lagrat eller härlett.** Ett **lagrat attribut (stored)** behandlas som ett grundfaktum, som \`hireDate\`. Ett **härlett attribut (derived)** kan beräknas — \`yearsEmployed\` ur \`hireDate\` och ett referensdatum — och ritas med streckad oval. Ett härlett attribut behöver inte bero på attribut i samma entitetstyp: \`numberOfEmployees\` på \`Project\` kan räknas fram ur de \`Employee\`-instanser som är kopplade via \`WorksOn\`. *Härlett* beskriver ett begreppsligt beroende; det föreskriver ingen lagringsstrategi.

### Flervärdesattribut eller egen entitet?

Ett designval värt att förstå eftersom det avgör hur modellen transformeras. Modelleras \`address\` som ett flervärdesattribut hos \`Employee\` blir resultatet en separat relation \`EmployeeAddress(employeeNo, address)\` — och där kan två anställda dela samma adress, eftersom adressen bara är ett värde. Modelleras adressen i stället som en egen entitet med en 1:N-relation till \`Employee\` kan anställda inte dela adress, eftersom varje adressinstans hör till en anställd. Vilket som är rätt beror på verksamhetsregeln, och att kunna motivera valet är precis vad en modelleringsuppgift efterfrågar.

## Värdemängder

Ett **value set (domain, värdemängd)** anger vilka värden som är tillåtna **och** hur de ska tolkas. \`employmentStatus\` ∈ {active, leave, ended}; \`hireDate\` är giltiga kalenderdatum; \`budget\` är icke-negativa belopp i angiven valuta. En värdemängd kan också definieras genom typ, intervall, format eller regel.

Det viktiga att veta inför tentan: i ett vanligt Chen-diagram **namnger ovalen bara attributet**. Domänen dokumenteras **utanför diagrammet**, som en separat specifikation — \`EmploymentStatus permits {active, leave, ended}\` plus vad värdena betyder — och regeln blir \`employmentStatus ∈ EmploymentStatus\`. Synligt i diagrammet är bara att \`Employee\` har ett attribut som heter \`employmentStatus\`.

Tänker man på värdemängden som en mängd blir tre saker tydliga. Varje \`Employee\` mappas till exakt ett värde, eftersom attributet är obligatoriskt och envärt. Värden kan delas — Mary och Gary är båda \`active\`. Och ett värde kan vara tillåtet men oanvänt: \`ended\` tillhör värdemängden även om ingen anställd har det just nu.

### Fem frågor om varje attribut

Föreläsningens sammanfattning av attributavsnittet är en tabell över de beslut varje attribut innebär. Frågorna beskriver kompletterande aspekter av samma attribut, inte alternativ:

| Modeling question | Choices | Examples |
|---|---|---|
| What owns it? | Entity type eller relationship type | \`name\`; \`assignmentStartDate\` |
| Can it be decomposed? | Simple eller composite | \`name\`; \`address\` |
| How many values may apply? | None, one, or several | \`description\`; \`title\`; \`phoneNumber\` |
| How is it obtained? | Stored as a base fact eller derived | \`hireDate\`; \`yearsEmployed\` |
| Which values are valid? | A documented value domain | \`EmploymentStatus\` |

## Identifierare

> **Identifier:** ett attribute, eller en kombination av attributes, vars värden unikt skiljer varje entity i ett entity set.

Regeln måste hålla för **varje giltig population**, inte bara för den data som råkar finnas just nu. Det är en regel på **modellnivå**. I Chen-notation markeras det identifierande attributet med **understrykning**.

Föreläsningen visar skillnaden med en population där fyra anställda finns och två av dem heter Sam (E-311 och E-422). Populationen uppfyller regeln — alla \`employeeNo\` skiljer sig — och de två Sam visar att \`name\` inte skiljer alla anställda. Att data råkar vara unik just nu gör den alltså inte till en identifierare; det är verksamhetsregeln som avgör.

Tre fall att känna igen:

- **Enkelt identifierande attribut.** \`projectNo\` identifierar \`Project\` på egen hand och stryks under.
- **Sammansatt identifierande attribut.** I en alternativ modell är \`projectNo\` ett attribut med delarna \`registrationYear\` och \`sequenceNo\`. Då stryks **den sammansatta föräldern** under, inte delarna, och identifikationen använder det kompletta värdet: \`2026-1\` och \`2026-2\` delar år men skiljer sig som helhet.
- **Flera identifierare.** \`employeeNo\` identifierar \`Employee\` på egen hand — det gör även \`workEmail\`. Två **separata** understrykningar betyder två olika identifierare, inte en kombinerad.

Ett fjärde fall — den **partiella identifieraren** med streckad understrykning, som bara skiljer entiteter med samma ägare — hör till svaga entiteter och tas upp i kapitel 6.

Kravtexten avgör alltså diagrammet, och exakt hur understrykningarna sätts är det som senare bestämmer relationens kandidatnycklar. När du löser en tentauppgift: läs kravtexten mening för mening och markera unikheten i takt med att den nämns.
`
  },

  {
    id: "kap5",
    number: 5,
    title: "Relationer, kardinalitet och deltagande",
    readingMinutes: 12,
    lead: "Binära relationer på tre nivåer, roller och relationsattribut. Ratio-etiketter läses tvärs över, deltagandelinjer vid egen ände. Min–max-notation, unära relationer och vad basic Chen inte kan uttrycka.",
    sources: ["Föreläsning 4"],
    body: `
Entiteter utan relationer är bara lösa listor. Det är relationerna som gör modellen till en modell — och det är i relationerna de flesta tentafelen görs.

## Binär relationstyp

En **binär relationstyp (binary relationship type)** är en relationstyp med **exakt två** deltagande roller. Romben är relationstypen, rektanglarna är de deltagande entitetstyperna. Grundexemplet genom hela föreläsningen är \`Employee — WorksOn — Project\`, med rollerna \`worker\` och \`project\`.

[[diagram:workson]]

Samma tre nivåer som för entiteter gäller för relationer, och de är värda att kunna exakt:

- **Relationstyp (relationship type)** — \`WorksOn\` associerar \`Employee\` och \`Project\` via rollerna \`worker\` och \`project\`, och äger attributet \`allocationPercentage\`. Det är det du ritar.
- **Relationsmängd (relationship set)** — alla relationsinstanser av en relationstyp vid en viss tidpunkt. Vid tid *t* innehåller mängden \`r1\`, \`r2\` och \`r3\`. Populationen kan ändras utan att relationstypen ändras.
- **Relationsinstans (relationship instance)** — en medlem av relationsmängden, bestående av **en entitet per deltagande roll**. \`r1 = ⟨e1, p1⟩\` är Mary som \`worker\` och Atlas som \`project\`, och \`r1 ∈ WorksOn\`.

[[diagram:population-relationer]]

En relationsinstans är alltså en **tupel**, och rollordningen spelar roll. Det låter formellt men blir avgörande i unära relationer längre ned, där båda positionerna fylls av samma entitetstyp.

## Roller

En **deltaganderoll (participant role)** namnger ett deltagande av en entitetstyp i en relationstyp: \`worker\` namnger \`Employee\`s deltagande i \`WorksOn\`, \`project\` namnger \`Project\`s. I en binär relation mellan två olika entitetstyper är rollnamnen ofta överflödiga. De blir nödvändiga när samma entitetstyp deltar **mer än en gång** i samma relationstyp — utan dem vore relationens två ändar tvetydiga.

## Relationsattribut

Ett **relationsattribut** ägs av relationstypen, inte av någon av de deltagande entitetstyperna. \`allocationPercentage\` tillhör \`WorksOn\` därför att värdet beskriver ett visst par av anställd och projekt: hur stor del av sin tid en viss anställd lägger på ett visst projekt. Varje relationsinstans har därför sitt eget värde — attributet mappar \`r1 = ⟨e1, p1⟩\` till 60 %, inte Mary till 60 %.

Regeln är **ownership follows meaning**: häng attributet på relationstypen när det beskriver associationen, på entitetstypen när det beskriver entiteten. Att känna igen skillnaden belönas vid transformationen, där relationsattributet hamnar i kopplingsrelationen.

## Kardinalitet och deltagande är oberoende

Två frågor ställs om varje relationsände, och de har olika svar och olika symboler:

- **Maximal kardinalitet:** *för en fixerad entitet i ena änden, hur många entiteter får vara relaterade i andra änden?* Svaret ges av **ratio-etiketterna** \`1\`, \`M\` och \`N\`.
- **Deltagande (participation):** *får en entitet finnas utan att delta i någon instans av relationstypen?* Svaret ges av **enkel eller dubbel deltagandelinje**.

**Ingen av dem bestämmer den andra.** Det är den vanligaste förväxlingen på tentan, och det som följer är hur man läser dem rätt.

### Ratio-etiketter läses tvärs över

[[diagram:lasriktningar]]

Ta \`Employee — Leads — Project\` med \`1\` vid Employee och \`N\` vid Project. Etiketterna läses **tvärs över** relationen:

- \`1\` bredvid Employee → **för varje Project** får högst **en** Employee delta.
- \`N\` bredvid Project → **för varje Employee** tillåts **många** Projects.

Talet bredvid A beskriver alltså hur många A varje B får ha. Och den kritiska detaljen: en ratio-etikett anger **endast maxima**. \`1\` betyder *högst en* — **inte** *exakt en*.

### Deltagandelinjer läses vid sin egen ände

[[diagram:deltagande]]

Till skillnad från ratio-etiketterna läses deltagandelinjerna **vid sin egen ände**. Med samma 1:N-ratio:

- **Partial participation** (enkel linje vid Project) — ett \`Project\` får delta **noll** gånger, alltså sakna ledare.
- **Total participation** (dubbel linje vid Project) — varje \`Project\` deltar **minst en** gång.

Ratiot är oförändrat; linjen ändrar **bara** deltagandekravet. Och nu syns varifrån "exakt en" kommer: \`1\` tvärs över (högst en) tillsammans med dubbel linje (minst en) ger exakt en ledare per projekt.

### De tre mönstren

**Ett-till-ett (1:1).** \`Employee — ResponsibleFor — Project\`. En anställd får vara ansvarig för noll eller ett projekt; med dubbel linje vid Project har varje projekt exakt en ansvarig.

**Ett-till-många (1:N).** \`Employee — Leads — Project\`. En anställd får leda noll, ett eller många projekt; varje projekt leds av exakt en anställd.

**Många-till-många (M:N).** \`Employee — WorksOn — Project\`. En anställd får arbeta på noll, ett eller många projekt; varje projekt har en eller flera anställda. \`M\` och \`N\` betyder båda "många" — bokstäverna skiljer bara de två positionerna åt. Äldre material och transformationskapitlet skriver 1:M för ett-till-många; det betyder samma sak som 1:N.

Frågan att ställa vid varje relation är **vilken entitet måste delta?** Kravtextens hjälpverb — *måste*, *kan*, *får* — avgör. Alla tre deltagandekombinationerna (ena sidan, båda, ingen) är möjliga för alla tre mönstren.

## Min–max-notation

Det finns en alternativ Chen-konvention där varje ände i stället bär en **tupel** som läses **vid** sin egen entitet: \`Employee (0,N)\` betyder minimum noll och maximum många projekt; \`Project (1,1)\` betyder minimum ett och maximum en anställd. Min–max-diagram använder **enkla linjer genomgående** — det är tupelns första värde som bär deltagandekravet.

Översättningen mellan konventionerna är enkel: \`N\` tvärs över plus enkel linje ⟷ \`(0,N)\`; \`1\` tvärs över plus dubbel linje ⟷ \`(1,1)\`. **Kursens standard** är ratio-etiketter plus deltagandelinjer. Regeln är att använda **en** komplett konvention per diagram: blanda **aldrig** min–max-tupler med dubbellinjer för total participation.

## Flera relationer mellan samma entitetstyper

Det kan finnas mer än en relationstyp mellan två entitetstyper. \`Employee\` och \`Project\` är i föreläsningens exempel kopplade genom tre — \`Leads\`, \`ResponsibleFor\` och \`WorksOn\` — med egna ratio-etiketter och egna deltagandekrav. Varje relationstyp har sin egen relationsmängd.

## Unär relation

En **unär relationstyp (unary relationship type)** har **en** deltagande entitetstyp; dess **grad (degree)** är ett. Den kallas också **rekursiv**, eftersom båda rollerna spelas av instanser av samma entitetstyp. Exemplet är \`Employee — Supervises\` med rollerna \`supervisor\` och \`report\`.

Här blir rollnamnen nödvändiga: \`Employee\` deltar två gånger i samma relation, och utan namn vore ändarna tvetydiga. Tupelordningen är \`⟨supervisor, report⟩\`: \`r1 = ⟨e3, e1⟩\` betyder att Sam handleder Mary, och \`r2 = ⟨e1, e2⟩\` att Mary handleder Gary. Mary är \`report\` i \`r1\` och \`supervisor\` i \`r2\`, och hamnar därför mitt i hierarkin. Varje förälder–barn-koppling i en sådan hierarki är en enda \`Supervises\`-instans.

Varje roll har sin egen kardinalitet, och etiketterna läses tvärs över precis som i det binära fallet: \`N\` bredvid \`report\` betyder att en handledare får ha många underställda; \`1\` bredvid \`supervisor\` betyder att varje underställd har högst en handledare. Enkla linjer på båda sidor betyder att båda rollerna får förekomma noll gånger — någon behöver varken handleda eller handledas. Ett sätt att tänka klart är att rita relationen som om den vore binär, med entitetstypen i två kopior: då syns det att en anställd handleder många (N-sidan) men handleds av högst en (1-sidan), alltså 1:N.

### Vad basic Chen inte kan uttrycka

Ratiot 1:N med enkla linjer tillåter fortfarande två populationer som troligen är ogiltiga: en **self-link** \`⟨e3, e3⟩\`, där Sam handleder sig själv, och en **tvåpersonscykel** \`⟨e3, e1⟩\` plus \`⟨e1, e3⟩\`, där Sam och Mary handleder varandra. Rimliga regler är att kräva \`supervisor ≠ report\` och att \`Supervises\` är acyklisk.

Detta är en **notationsgräns**: basic Chen har ingen symbol för någon av reglerna. De måste anges som **textuella verksamhetsregler** och upprätthållas varje gång \`Supervises\` ändras — i constraints, triggers eller applikationskod. Lärdomen återkommer genom hela kursen: diagrammet fångar struktur, inte alla regler.

## Ternär relation och grad

Graden säger hur många entitetstyper som deltar: en unär relation har grad ett, en binär grad två, och metamodellen tillåter **två eller flera** deltaganden i en relationstyp. En **ternär relation** har grad tre och kopplar tre entitetstyper samtidigt. Föreläsningens egna exempel är unära och binära, men principen är densamma.

Det klassiska exemplet är leverantör, produkt och kund. Frestelsen är att modellera det som tre binära M:N-relationer, och det går inte: med tre separata relationer vet du att Amazon levererar stolar, att IKEA levererar stolar och att en viss kund beställer stolar — men **inte vilken leverantör som levererade stolen till just den kunden**. Informationen om trippeln finns inte. Lösningen är en relation som binder alla tre samtidigt, vilket vid transformationen blir en relation med en trippelsammansatt primärnyckel.
`
  },

  {
    id: "svaga",
    number: 6,
    title: "Svaga entiteter, associativa entiteter och Crow's Foot",
    readingMinutes: 14,
    lead: "Svaga entiteter kräver identitetsberoende, reifiering gör en relation till en sak, och Crow's Foot uttrycker samma regler med andra symboler — men inte alla.",
    sources: ["Föreläsning 4"],
    body: `
Kapitlet samlar tre saker som alla handlar om identitet: entiteter som inte kan identifieras utan sin ägare, relationer som blir till entiteter, och en andra notation som uttrycker samma regler med andra symboler — och som inte kan uttrycka allt.

## Svag entitetstyp

Kom ihåg Chens definition: *an entity is a "thing" which can be distinctly identified.* Poängen med att repetera den här är att en svag entitet **fortfarande är en entitet** — den kan skiljas från alla andra. Det som skiljer den från en stark är *hur*.

Exemplet är \`Project — Contains — ProjectTask\`, ett 1:N-förhållande. \`Project\` är den **starka ägaren**: den har sin egen identifierare \`projectNo\` och kan finnas utan någon \`ProjectTask\`. En \`ProjectTask\` är **svag men identifierbar**: dess \`Project\` plus \`taskNo\` skiljer den från alla andra. Och den har **ingen självständig existens** — en \`ProjectTask\` kan inte finnas i modellen utan sitt ägande \`Project\`.

Datatabellen visar problemet konkret:

| projectNo | taskNo | taskName |
|---|---|---|
| P101 | 1 | Gather requirements |
| P101 | 2 | Draft data model |
| P205 | 1 | Configure test environment |
| P205 | 2 | Validate import |

\`taskNo\` upprepas mellan projekten, men de kompletta identiteterna förblir distinkta: \`(P101, 1) ≠ (P205, 1)\`. \`taskNo\` behöver bara vara unikt **inom sitt ägande Project**. Det gör \`taskNo\` till en **partiell identifierare (partial identifier)**: den skiljer svaga entiteter som har samma ägare och behöver inte vara globalt unik. Ägaren fullbordar identiteten: \`ProjectTask identity = projectNo + taskNo\`.

[[diagram:svag-entitet]]

Tre markeringar hör ihop, och alla tre ska finnas:

- **Dubbel rektangel** → \`ProjectTask\` är en **svag entitetstyp (weak entity type)**.
- **Dubbel romb** → \`Contains\` är den **identifierande relationen (identifying relationship)**. Den kallas även svag relationstyp.
- **Streckad understrykning** → \`taskNo\` är **partiell identifierare**.

En svag entitet beror på sin ägare på två sätt. **Identitetsberoende (identity dependence):** den kompletta identiteten inkluderar det ägande projektet. **Existensberoende (existence dependence):** uppgiften kan inte finnas utan sin ägare. Ratio och deltagande följer med: \`1\` bredvid Project begränsar varje uppgift till ett projekt, och **dubbellinjen på den svaga sidan** gör det deltagandet obligatoriskt.

En svag entitet kan ha andra, vanliga relationer också: en projektuppgift kan tilldelas en anställd genom \`AssignedTo\`, och den relationen är helt vanlig även om \`ProjectTask\` är svag. Att känna igen svaga entiteter i en kravtext handlar om att leta efter formuleringar av typen "X är unikt **inom** Y" eller "det kan finnas två X med samma nummer hos olika Y".

### Två tentafällor

**Total participation gör inte en entitet svag.** Ta \`Employee — Leads — Project\` med \`1\` : \`N\` och dubbellinje vid Project. Varje projekt har exakt en ledare — dubbellinjen kräver minst en, \`1\` begränsar till högst en. Men \`Project\` förblir **stark**, för \`projectNo\` identifierar det på egen hand. **Svaghet kräver identitetsberoende**, inte bara obligatoriskt deltagande. Klassisk tentafälla.

**Multipliciteterna avslöjar inte ägaren.** I \`Project — Contains — ProjectTask — AssignedTo — Employee\` har båda relationstyperna samma multipliciteter, \`1\` : \`N\`. Vem är ägaren? Det går **inte** att läsa ur etiketterna. Det är den dubbla romben och den dubbla rektangeln som pekar ut den identifierande relationen — ingenting annat.

## Associativ entitet och reifiering

Tillbaka till \`Employee — WorksOn — Project\`, M:N, med \`allocationPercentage\` och \`assignmentStartDate\` på relationen. En \`WorksOn\`-instans är **parspecifik**: den länkar en anställd med ett projekt, och attributen tillhör paret — inte den anställda och inte projektet var för sig.

Ibland räcker det inte att *beskriva* paret; paret måste bli en *sak*. **Behåll relationen** när modellen bara behöver beskriva paret — relationsattribut i sig **tvingar inte** fram något. **Reifiera** paret när det måste kunna

- refereras till som ett begrepp,
- delta i **andra** relationer, eller
- ha egen **identitet** eller egen **livscykel**.

[[diagram:reifiering]]

**Reifiering (reification)** är att göra om en relation till en sak. Före: relationstypen \`WorksOn\` med två attribut. Efter: entitetstypen \`Assignment\`, kopplad till \`Employee\` via \`Holds\` och till \`Project\` via \`Concerns\`, med \`1\` : \`N\` respektive \`N\` : \`1\`. Attributen följer med till \`Assignment\`. Det som uppstått kallas **associativ entitet (associative entity)** — men lägg märke till att den byggs av **vanliga Chen-konstruktioner**: \`Assignment\` är en vanlig entitet, \`Holds\` och \`Concerns\` vanliga relationer. Ingen särskild symbol behövs.

Reifiering är inte gratis. Understrykningen av \`assignmentNo\` deklarerar det som kandidatidentifierare för \`Assignment\`, och därmed måste organisationen **tilldela, lagra och bevara** ett unikt \`assignmentNo\` för varje uppdrag. Syftet är ett stabilt värde som människor och system kan referera till och följa — men det är ett verkligt datahanteringsansvar som inte fanns när \`WorksOn\` var en relation.

## Crow's Foot-notation

Crow's Foot är kursens andra notation. Historien förklarar varför den ser ut som den gör: **Gordon C. Everest** använde 1976 *inverted arrows* mellan entitetsboxar för att visa parent–dependent-strukturer, och forken gjorde "many" synligt utan att se ut som en pil som antydde en navigeringsriktning. Via **Information Engineering** (Finkelstein, CACI, sent 70-tal–1981) och **James Martins** böcker och CASE-verktyg på 80- och 90-talen spreds flera varianter. Namnen Crow's Foot, Information Engineering-notation och Martin-notation syftar på **besläktade varianter**, inte på en fast syntax skapad av en person.

Det får en praktisk konsekvens. Alla dialekter delar entitetsboxar, relationslinjer och fork för many, men resten beror på metod och verktyg:

- **Common IE** använder cirkel, streck och fork för optional/required och one/many. **Kursen använder denna konceptuella common IE-variant.**
- **Barker/Oracle** kodar *may* och *must* med brutna och heldragna halvlinjer; forken betyder fortfarande many, men cirkel–streck-vokabulären saknas.
- **Modelleringsverktyg** kan ge linjestilen en tredje betydelse: heldragen = identifying, streckad = non-identifying relationship. Då kodar den inte deltagande alls.

**Läs alltid legenden** och modelleringskontexten innan du tolkar ett verktygs linjer. Samma streck kan betyda tre olika saker i tre olika verktyg.

### Samma modell, två notationer

[[diagram:chen-crow]]

Entitetstyper, relationstyper och constraints är **ER-begrepp**. Rektanglar, romber, namngivna linjer och ändsymboler är **val som notationen gör**. Samma \`Employee–WorksOn–Project\`-modell kan ritas i båda.

I Crow's Foot skiljer **entitetsboxen** identifierare från övriga attribut: en rubrik namnger entitetstypen, \`ID\` bredvid \`project_no\` och \`employee_no\` markerar identifierande attribut, och vanliga attribut står under avskiljaren. Namnkonventionen byter \`projectNo\` mot \`project_no\`. Där Chen stryker under \`employeeNo\` och lägger \`name\` och \`hireDate\` i separata ovaler, samlar Crow's Foot allt i en uppdelad box — samma anställd, samma identifierare, samma attribut, bara notation och placering skiljer.

**Relationsnamnet står på linjen** — det finns ingen romb. Symbolerna i varje ände visar om deltagandet är optional och om det rör one eller many. Deltaganderoller (\`worker\`, \`project\`) läggs till när läsningen annars vore tvetydig. Faktiska Employee–Project-par tillhör populationen och ritas inte.

### De fyra ändpunktsmönstren

[[diagram:crow-andpunkter]]

Varje ändpunkt kombinerar **två** märken. Det **yttre märket** anger optional eller required: **cirkel** = optional (kan vara noll), **streck** = required (minst en). Märket **närmast boxen** anger one eller many: **streck** = one, **crow's foot** = many. Det ger fyra kombinationer — zero or one, exactly one, zero or many, one or many — och den bilden är värd att kunna utantill.

Här ligger den vanligaste källan till felläsning **mellan** notationerna: i Chen läses ratio-etiketterna tvärs över, medan deltagandelinjerna sätts vid sin egen ände. I Crow's Foot sitter markörerna **vid den ändpunkt vars instanser de räknar**. Samma \`Leads\`-constraint, två läsriktningar.

De tre mönstren i Crow's Foot: \`ResponsibleFor\` 1:1 — en anställd är ansvarig för högst ett projekt, varje projekt har exakt en ansvarig. \`Leads\` 1:N — en anställd får leda många projekt, varje projekt har exakt en ledare. \`WorksOn\` M:N — en anställd får arbeta på många projekt, varje projekt har en eller flera arbetande.

### Rekursion, svag identitet och M:N i Crow's Foot

En **rekursiv relation** får samma entitetstyp i båda ändpunkterna; romben blir en namngiven **self-line**, med rollerna \`supervisor\` och \`report\` oförändrade. Chens \`1\` bredvid supervisor och \`N\` bredvid report blir **optional-one** och **optional-many** vid samma ändpunkter, och Chens enkla linjer blir Crows optional-cirklar: en anställd har noll eller en handledare och får handleda noll eller många.

**Svag identitet** ritas utan dubbla ramar. \`ProjectTask\` får en vanlig entitetsbox där upprepade \`ID\`-markörer gör \`project_no\` och \`task_no\` till **en sammansatt identifierare**. Beroendet finns kvar — \`project_no\` binder varje uppgifts identitet till ett projekt — men Crow's Foot registrerar det direkt i identifieraren, utan Chens dubbla rektangel, dubbla romb och streckade understrykning. Samma regel, olika uttryckssätt.

**M:N med attribut** avslöjar notationens viktigaste begränsning. Chen kan hänga \`allocationPercentage\` direkt på \`WorksOn\`-romben. **En Crow's Foot-relationslinje har inget utrymme för attribut.** Paret måste därför representeras som en **associativ entitet**: \`EMPLOYEE — Has — ASSIGNMENT — Is for — PROJECT\`, med \`allocation_percentage\` inuti \`ASSIGNMENT\`-boxen och \`assignment_no\` **tillagt** som identifierare. Här **tvingar notationen fram reifieringen** — i Chen var det ett val.

På samma sätt blir ett **flervärdesattribut** en relaterad entitet: Chen behåller telefonnumren i en dubbel oval, Crow's Foot ritar dem som \`PHONE NUMBER\`-entiteter i en 1:N-relation.

### Vad Crow's Foot inte kodar direkt

Föreläsningens facit på vad notationen kostar i uttrycksförmåga:

- **Direkt kodat i Crow's Foot:** entity types och vanliga attributes; conceptual identifying attributes; binary och unary relationship types; participant roles; de fyra endpoint-kombinationerna.
- **Indirekt eller separat dokumenterat:** entity/relationship instances och sets, value sets; multivalued attributes (som relaterade entity types); composite, derived och optional attributes; value domains; weak identity; attributes på relationship types.

Kursens konvention, sammanfattad: en konceptuell Information Engineering-variant av Crow's Foot där ändsymbolerna visar optional/required och one/many, identifierare och attribut står inuti entitetsboxarna, och en entitet får representera ett par och äga dess attribut. Läroböcker och verktyg varierar i nyckelmarkörer, linjestilar och namn — läs alltid notationens legend.
`
  },

  {
    id: "kap6",
    number: 7,
    title: "Transformation till logisk modell",
    readingMinutes: 12,
    lead: "Alla transformationsregler samlade: vanliga och svaga entiteter, 1:M, 1:1, M:N, unära relationer, flervärdesattribut och ternära relationer.",
    sources: ["Föreläsning 5"],
    body: `
Det här är tentans andra område och det mest mekaniska i hela delkursen — vilket är goda nyheter, för mekaniska saker går att lära sig säkert. Reglerna nedan är kursens egna, och de ska tillämpas i ordning.

Notationen för en relation i logisk modell: relationsnamn följt av attributen i parentes, med **primärnyckeln understruken med hel linje** och **främmande nycklar understrukna med prickad linje**. Ett attribut som är både primär- och främmande nyckel, som \`EmployeeNo\` i en kopplingsrelation, får båda strecken. Så ser facit i övningshäftet ut, och så ska du skriva på tentan. Eftersom kompendiet är i text står primärnyckeln först i attributlistan här, sammansatta primärnycklar anges i en kommentar (\`-- PK:\`), och främmande nycklar känns igen på att de bär en annan relations primärnyckel.

## Regel 1 — Vanlig entitet

För varje vanlig (icke-svag) entitet: skapa en relation med samma namn. Inkludera alla attribut som är **enkla och envärda**. Har entiteten ett **sammansatt attribut** ska det sammansatta attributet självt **inte** ingå — bara dess atomära delattribut. Välj som primärnyckel ett av de identifierande attributen (eller en av de identifierande uppsättningarna) ur ER-modellen. Finns flera, välj den lämpligaste: stabil, minimal och semantiskt meningsfull.

    Employee(EmployeeNo, Name, Address, Salary)
    Project(ProjectNo, Name, Budget)

Flervärdesattribut och härledda attribut hanteras separat — se regel 6.

## Regel 2 — Svag entitet

För varje svag entitet: skapa en relation med alla dess enkla, envärda attribut. Inkludera dessutom **ägarentitetens primärnyckel som främmande nyckel**. Primärnyckeln blir **kombinationen av denna främmande nyckel och den svaga entitetens partiella nyckel**.

    Hotel(Name, Rating)
    Room(RoomNo, HotelName, Price)     -- PK: {RoomNo, HotelName}

Den sammansatta nyckeln är precis vad exemplet krävde: varken rumsnummer eller hotellnamn är unikt för sig, men kombinationen är. Det speglar beroendet som ER-modellen kodade.

## Regel 3 — Binär 1:M

För varje 1:M-relation: lägg **ett-sidans primärnyckel** i **många-sidans** relation som främmande nyckel. Har relationen egna enkla attribut läggs de i samma många-sidsrelation.

    Project(ProjectNo, Name, Budget)
    Employee(EmployeeNo, Name, Address, Salary, ProjectNo)

Ingen ny relation behövs. Både kopplingen och relationens beskrivande detaljer bevaras.

Minnesregeln: **främmande nyckeln hamnar alltid på många-sidan.** Tänk på varför — en anställd har ett projekt, så det går att lagra i anställdas rad; ett projekt har många anställda, vilket inte går att lagra i en enda cell.

## Regel 4 — Binär 1:1

Här beror svaret på deltagandet, och det är därför 1:1 är den regel som oftast blir fel.

**Ett obligatoriskt, ett frivilligt:** lägg primärnyckeln från den entitet som deltar **frivilligt** i relationen för den entitet som deltar **obligatoriskt**, som främmande nyckel. Logiken: den obligatoriska sidan har alltid en motpart, så kolumnen blir aldrig NULL.

**Båda frivilliga:** främmande nyckel-metoden kan tillämpas i valfri riktning. Arkitekten väljer.

**Båda obligatoriska:** om ingen annan relation finns mellan entiteterna kan de representeras som **en enda relation**, eller så används främmande nyckel-metoden som vanligt. Arkitekten väljer.

    -- Ett obligatoriskt (Employee), ett frivilligt (Project):
    Project(ProjectNo, Name, Budget)
    Employee(EmployeeNo, Name, Address, Salary, ProjectNo)

    -- Båda obligatoriska, sammanslaget alternativ:
    EmployeeProject(ProjectNo, ProjName, ProjBudget, EmployeeNo, EmpName, EmpAddress, EmpSalary)

## Regel 5 — Binär M:N

För varje M:N-relation: skapa en **ny relation** som representerar relationen själv. Den ska innehålla **primärnyckelattributen från båda deltagande entitetsrelationer**. Tillsammans bildar de en **sammansatt primärnyckel**, vilket garanterar att varje kombination förekommer högst en gång. Vart och ett av dessa attribut ska dessutom deklareras som **främmande nyckel** mot sin respektive entitetsrelation. Har relationen egna attribut läggs de till som ytterligare attribut.

    Employee(EmployeeNo, Name, Address, Salary)
    Project(ProjectNo, Name, Budget)
    Work(EmployeeNo, ProjectNo, Hours)     -- PK: {EmployeeNo, ProjectNo}

Observera det viktiga: **relationsattributet \`Hours\` ingår inte i primärnyckeln.** Det är ett icke-nyckelattribut. Skulle det ingå kunde samma anställd arbeta på samma projekt två gånger med olika timantal, vilket inte är vad modellen säger.

Det är alltså M:N-regeln som föder alla kopplingstabeller. I sjukhusdatabasen är \`Examines\`, \`Suffers\` och \`HasSuffered\` exakt sådana.

## Regel 6 — Flervärdesattribut

För varje flervärdesattribut: skapa en **separat relation** med två delar — **ägarentitetens primärnyckel** som främmande nyckel, och **flervärdesattributet självt**. Kombinationen av dessa två blir relationens primärnyckel.

    Employee(EmployeeNo, Name, Salary)
    EmployeeAddress(EmployeeNo, Address)     -- PK: {EmployeeNo, Address}

Konsekvensen är värd att notera, och föreläsningen frågar uttryckligen om den är avsedd: eftersom \`Address\` bara är ett värde **kan två anställda dela samma adress**. Ville du hindra det skulle adressen modellerats som en egen entitet i stället.

## Regel 7 — Unära relationer

Ingen egen regel — **tillämpa den binära regeln av samma form**, med skillnaden att både ett-sidan och många-sidan pekar på samma entitet.

**Unär 1:M** → främmande nyckel i samma relation, med rollnamn som attributnamn:

    Employee(EmployeeNo, Name, Address, Salary, ManagerNo)

\`ManagerNo\` refererar tillbaka till \`EmployeeNo\` i samma relation. Den högsta chefen har NULL där, vilket är korrekt.

**Unär M:N** → ny relation med två attribut som båda refererar till samma entitetsrelation:

    Employee(EmployeeNo, Name, Address, Salary)
    Manage(EmployeeNo, ManagerEmployeeNo)     -- PK: båda

## Regel 8 — Ternär relation

Skapa en relation som innehåller primärnycklarna från **alla tre** deltagande entiteter. Tillsammans bildar de primärnyckeln, och var och en är främmande nyckel.

    Supplier(Name)
    Product(Name)
    Customer(Name)
    Delivery(supplierName, productName, customerName)

Attributens ordning i primärnyckeln saknar betydelse — relationsmodellens egenskap 5 igen.

## Arbetsgång vid en tentauppgift

1. Transformera alla **vanliga entiteter** (regel 1) och skriv ned relationerna.
2. Transformera alla **svaga entiteter** (regel 2).
3. Gå igenom relationerna en efter en och tillämpa regel 3, 4, 5, 7 eller 8 beroende på form.
4. Hantera **flervärdesattribut** (regel 6).
5. Kontrollera att varje främmande nyckel har en motsvarande primärnyckel att peka på.
6. Kontrollera slutligen normalformen — nästa kapitel.

Skriv ut varje relation fullständigt med understruken primärnyckel. Poängen sitter i fullständigheten, inte i eleganta genvägar.
`
  },

  {
    id: "kap7",
    number: 8,
    title: "Funktionella beroenden och normalformer",
    readingMinutes: 14,
    lead: "Anomalierna som motiverar normalisering, funktionella beroenden, 1NF till 3NF med kursens exakta definitioner, och dekomposition.",
    sources: ["Föreläsning 6"],
    body: `
Tentans tredje område, och det mest formella. Definitionerna nedan är kursens egna och återges ordagrant, eftersom det är formuleringarna som prövas.

## Varför normalisera? Anomalierna

Utgångsfrågan är skarp: transformationsreglerna säger att en M:N-relation ska bli tre relationer. **Varför tre? Varför inte fyra, två eller en?** Vem kom på regeln och hur avgjordes att den producerar bra relationer? Finns det ett formellt sätt att mäta "godhet"?

Betrakta vad som händer om vi implementerar M:N-exemplet som **en enda** relation:

    EmployeeProject(EmployeeNo, Name, Address, ProjectNo, ProjectName, Budget)

    E1  Bob  Lund       P1  ERP upgrade           90000
    E2  Sam  Lund       P1  ERP upgrade           90000
    E3  Ham  Malmö      P2  Data migration        20000
    E4  Joe  New York   P3  WAC installation      15000
    E5  Ken  Hong Kong  P3  WAC installation      15000
    E6  Dan  London     P4  Network optimization  50000

**Uppdateringsanomali (update anomaly):** ska budgeten för P3 höjas måste **två celler** uppdateras i stället för en. Uppdateras bara den ena blir datan inkonsekvent.

**Raderingsanomali (deletion anomaly):** raderas de anställda E4 och E5 försvinner samtidigt **all information om projekt P3**. Att radera information om en entitet ska under normala förhållanden inte leda till att information om en separat entitet förloras.

Redundansen är alltså inte bara slöseri med lagring — den är en källa till fel. Och för att förhindra anomalierna måste man förstå varför de uppstår, vilket kräver teorin.

## Funktionellt beroende

> **Funktionellt beroende (functional dependency):** givet en relation R sägs ett attribut X funktionellt bestämma ett annat attribut Y om och endast om varje X-värde i R är associerat med precis ett Y-värde i R. R sägs då uppfylla det funktionella beroendet X → Y.

I exemplet ovan gäller:

    EmployeeNo → {Name, Address}
    ProjectNo  → {ProjectName, Budget}

Skrivsättet \`EmployeeNo → {Name, Address}\` betyder samma som två separata beroenden: \`EmployeeNo → Name\` och \`EmployeeNo → Address\`.

Att läsa av funktionella beroenden ur en kravtext eller ur exempeldata är den färdighet allt annat i kapitlet vilar på. Frågan att ställa: **om jag känner värdet på X, är då Y entydigt bestämt?**

## Kandidatnyckel ur beroendena

Med beroendena på plats går kandidatnyckeln att härleda. Kandidatnyckeln är den minimala attributuppsättning som funktionellt bestämmer **alla** övriga attribut.

I exemplet: \`EmployeeNo\` bestämmer bara namn och adress, \`ProjectNo\` bara projektnamn och budget. Men kombinationen bestämmer allt:

    Kandidatnyckel: {EmployeeNo, ProjectNo}

Därmed:

    Primärattribut (prime):      EmployeeNo, ProjectNo
    Icke-primärattribut (non-prime): Name, Address, ProjectName, Budget

## Tre hjälpbegrepp

> **Primärattribut (prime attribute):** ett attribut som är medlem i någon kandidatnyckel.
> **Icke-primärattribut (non-prime attribute):** ett attribut som inte är medlem i någon kandidatnyckel.
> **Äkta delmängd (proper subset):** en äkta delmängd av exempelvis {A,B} är en delmängd av {A,B} som inte är lika med {A,B}. Både A och B är äkta delmängder av {A,B}.
> **Transitivt beroende (transitive dependency):** ett funktionellt beroende där X → Z indirekt, i kraft av att X → Y och Y → Z (och där det inte gäller att Y → X).

Parentesen i den sista definitionen är viktig: gäller även Y → X är beroendet inte transitivt, eftersom Y då själv är en kandidatnyckel.

## Normalformerna

Generellt: relationer i högre normalform har **mindre redundans** och därmed mindre risk för uppdaterings- och raderingsanomalier. Normalformerna **bygger på varandra** — för att uppfylla 3NF måste relationen redan uppfylla 2NF.

> **Första normalformen (1NF):** en relation är i första normalformen om värdena i varje attribut är atomära.

> **Andra normalformen (2NF):** en relation är i 2NF om och endast om den är i 1NF och inget icke-primärattribut är funktionellt beroende av någon äkta delmängd av någon kandidatnyckel i relationen.

> **Tredje normalformen (3NF):** en relation är i 3NF om och endast om båda följande villkor gäller: relationen är i 2NF, och varje icke-primärattribut i relationen är icke-transitivt beroende av varje kandidatnyckel i relationen.

Lär dig dessa ordagrant. De är korta, de är exakta, och en omskrivning i egna ord tappar nästan alltid något — särskilt "äkta delmängd av **någon** kandidatnyckel" i 2NF och "**varje** kandidatnyckel" i 3NF.

### 1NF i praktiken

    ProjectNo = "P1, P5"     -- inte tillåtet, inte atomärt
    två rader, en per projekt -- tillåtet

Eftersom relationsmodellen redan kräver atomära värden (kapitel 2, egenskap 2) bryter en tabell som inte är i 1NF egentligen mot definitionen av relation.

### 2NF i praktiken

Exempelrelationen bryter mot 2NF. Kandidatnyckeln är \`{EmployeeNo, ProjectNo}\`. Det icke-primära attributet \`Name\` är funktionellt beroende av \`EmployeeNo\`, som är en **äkta delmängd** av kandidatnyckeln. Alltså inte 2NF.

Detta kallas ofta **partiellt beroende**. Notera att problemet bara kan uppstå när någon kandidatnyckel är sammansatt — en relation i 1NF vars kandidatnycklar alla är enkla är automatiskt i 2NF, eftersom en enkel nyckel inte har några äkta delmängder att vara beroende av. Föreläsningen gör det till ett beslutssteg i varje uppgift: *Is the candidate key a composite key? No → 2NF can't be broken.* Så löses uppgifterna, och så ser facit ut.

### 3NF i praktiken

Betrakta:

    R(A, B, C, D)
    A → {B, C}
    C → D

Kandidatnyckel: A. Primärattribut: A. Icke-primärattribut: B, C, D. Ingen sammansatt nyckel finns, så 2NF är uppfyllt. Men \`A → C\` och \`C → D\` ger \`A → D\` **transitivt**, och D är icke-primärt. Alltså inte 3NF, utan 2NF.

Jämför:

    R(A, B, C, D)
    {A, B} → C
    C → D

Kandidatnyckel: {A, B}. Primärattribut: A, B. Icke-primärattribut: C, D. Här är C beroende av hela nyckeln (inte en äkta delmängd), så 2NF är uppfyllt — men \`{A,B} → C → D\` är transitivt, så inte 3NF.

Arbetsgången vid varje sådan uppgift är alltid samma fyra steg:

1. **Bestäm kandidatnyckeln eller kandidatnycklarna** ur de funktionella beroendena.
2. **Lista primärattribut och icke-primärattribut.**
3. **Testa 2NF:** finns något icke-primärattribut som beror på en äkta delmängd av en kandidatnyckel?
4. **Testa 3NF:** finns något icke-primärattribut som beror transitivt på en kandidatnyckel?

## Normalisering genom dekomposition

Har du en relation i en oönskad normalform: **dekomponera** den, alltså bryt ned den i mindre relationer som uppfyller den önskade normalformens krav.

Exempelrelationen dekomponeras till precis de tre relationer transformationsregeln för M:N föreskrev:

    Employee(EmployeeNo, Name, Address)
    Project(ProjectNo, ProjectName, Budget)
    Work(EmployeeNo, ProjectNo)

Och där kommer svaret på kapitlets inledande fråga: **transformationsreglerna producerar relationer i 3NF.** Reglerna är inte påhittade — de är normaliseringsteorins resultat, förpackade som praktiska handgrepp. Följer du dem behöver du sällan normalisera i efterhand.

## Två kvalitetskrav på en dekomposition

Att dela upp en relation är inte gratis. Två egenskaper avgör om uppdelningen är godtagbar.

**Lossless join (förlustfri join, även non-additive join).** En dekomposition har egenskapen om en **naturlig join** av delrelationerna ger tillbaka originalrelationen. En naturlig join matchar automatiskt kolumner med samma namn, utan ON-villkor. Föreläsningens exempel: \`R(A,B,C,D,E,F)\` med \`A → {B,C}\` och \`D → {E,F}\` delas upp i \`R1(A,B,C)\` och \`R2(D,E,F)\`. Båda ser ut att vara i 3NF, men de har inget gemensamt attribut, så den naturliga joinen kan inte återskapa \`R\`. I Employee–Project-exemplet betyder det att ingen längre vet vem som arbetar i vilket projekt. Lösningen är kopplingsrelationen \`Work(EmployeeNo, ProjectNo)\`, precis den M:N-regeln föreskriver: med den på plats kan de tre relationerna joinas tillbaka till originalet. Detta är det icke-förhandlingsbara kravet.

**Dependency preservation (beroendebevarande).** Utöver lossless join kan en dekomposition ha egenskapen att beroendena bevaras. Regeln är operativ: **ett funktionellt beroende är bevarat om dess båda attribut finns i samma relation.** Gå igenom beroendena ett i taget och se var attributen hamnat. Föreläsningens exempel på förlust: \`EmployeeProject\` med \`EmployeeNo → {Name, Address, ProjectNo, ProjectName}\`, \`ProjectNo → {ProjectName, Budget}\` och \`ProjectName → {ProjectNo, Budget}\` delas upp i \`Employee(EmployeeNo, Name, Address, ProjectNo)\` och \`Project(ProjectNo, Name, Budget)\`. Alla beroenden utom ett återfinns i någon av delrelationerna — \`EmployeeNo → ProjectName\` har gått förlorat, eftersom attributen hamnat i olika relationer. Ett förlorat beroende kan databasen inte längre upprätthålla med en enkel constraint inom en tabell. Just den kontrollen, beroende för beroende, är vad övningshäftets sant/falskt-frågor om dekompositioner prövar (uppgift 16 och 17).
`
  },

  {
    id: "kap8",
    number: 9,
    title: "Fysisk design: DDL, constraints och kodstandard",
    readingMinutes: 9,
    lead: "Från logisk modell till körbar CREATE TABLE — datatyper, de fem constrainttyperna, surrogatnycklar och kursens namngivningsregler.",
    sources: ["Föreläsning 7", "Kodstandard v2.0"],
    body: `
Sista steget: den logiska modellen blir körbar SQL. Här kommer också de val som medvetet sköts upp under logisk design.

## DDL

**DDL (Data Definition Language)** är den del av SQL som definierar strukturer: \`CREATE\`, \`ALTER\`, \`DROP\`. Motsvarigheten för data är **DML (Data Manipulation Language)**: \`SELECT\`, \`INSERT\`, \`UPDATE\`, \`DELETE\`.

En relation ur den logiska modellen blir en \`CREATE TABLE\`-sats:

    CREATE TABLE Department (
        DepartmentID  INTEGER IDENTITY(1,1),
        DeptName      VARCHAR(100),
        Budget        DECIMAL(15, 2),
        CONSTRAINT PK_Department_DepartmentID PRIMARY KEY (DepartmentID),
        CONSTRAINT UQ_Department_DeptName UNIQUE (DeptName)
    );

    CREATE TABLE Employee (
        EmployeeID    INTEGER IDENTITY(1,1),
        EmpNo         VARCHAR(10),
        EmpName       VARCHAR(100),
        EmpSalary     DECIMAL(10, 2),
        DepartmentID  INTEGER,
        CONSTRAINT PK_Employee_EmployeeID PRIMARY KEY (EmployeeID),
        CONSTRAINT UQ_Employee_EmpNo UNIQUE (EmpNo),
        CONSTRAINT FK_Employee_Department_DepartmentID
            FOREIGN KEY (DepartmentID) REFERENCES Department(DepartmentID)
    );

## De fem constrainttyperna

Constraints är hur affärsregler flyttas från applikationskoden in i databasen, där de gäller för alla som ansluter.

- **PRIMARY KEY** — unik och \`NOT NULL\`. En per tabell.
- **FOREIGN KEY** — refererar till en primärnyckel och upprätthåller referensintegritet.
- **UNIQUE** — unikt men tillåter NULL. Här hamnar de naturliga nycklarna när en surrogatnyckel tagit över primärnyckelrollen.
- **CHECK** — villkor på värden, exempelvis \`CHECK (EmpSalary >= 0)\`. Det är här domänen ur kapitel 2 äntligen får en teknisk motsvarighet.
- **DEFAULT** — värde som sätts när inget anges.

Namnge dem alltid. Kursens kodstandard föreskriver prefixen \`PK_\`, \`FK_\`, \`UQ_\`, \`CK_\` och \`DF_\` följt av tabell och kolumn. Skälet är praktiskt: ett namngivet constraint ger ett felmeddelande du kan förstå, och ett du kan referera till i en \`ALTER TABLE\`.

## Surrogatnycklar — nu, inte tidigare

Kapitel 3 slog fast att surrogatnycklar hör till fysisk design. Här är de.

En **surrogatnyckel** är ett artificiellt, databasgenererat värde utan affärsbetydelse. I SQL Server skapas den med \`IDENTITY(1,1)\`.

Motiven är fysiska: **nyckelstabilitet** (ett anställningsnummer kan ändras vid omorganisation, ett löpnummer aldrig) och **prestanda** (ett heltal joinar och indexerar effektivare än en sammansatt textnyckel).

Priset är att raden inte längre går att identifiera meningsfullt utan uppslag, och att du måste behålla den naturliga nyckeln som \`UNIQUE\` — annars förlorar databasen affärsregeln att anställningsnummer är unika. Det mönstret ser du i \`hospital-ddl.sql\`: \`EmployeeID\` är surrogat primärnyckel, \`EmpNo\` är naturlig nyckel med \`UQ_\`-constraint.

## Datatyper

Grundvalet i SQL Server: \`INT\` och \`BIGINT\` för heltal, \`DECIMAL(p,s)\` för exakta decimaltal (pengar — använd aldrig \`FLOAT\` till belopp), \`VARCHAR(n)\` och \`NVARCHAR(n)\` för text där N-varianten klarar unicode, \`CHAR(n)\` för text med fast längd, \`DATE\`, \`DATETIME\` och \`DATETIME2\` för tid, \`BIT\` för booleskt.

Välj längder efter domänen, inte efter magkänsla. \`VARCHAR(50)\` för ett namn är ett beslut om vad verksamheten tillåter.

## Kursens kodstandard

Standarden (v2.0) gäller i laborationer, SQL-uppgiften och databasprojektet, och det är värt att följa den från början:

- **Tabellnamn i PascalCase och singular:** \`Employee\`, inte \`employees\`.
- **Kolumnnamn i PascalCase**, ofta med tabellprefix på beskrivande kolumner: \`EmpName\`, \`EmpSalary\`.
- **Constraintnamn** enligt prefixmönstret ovan.
- **Java:** camelCase för variabler och metoder, PascalCase för klasser, K&R-klammerstil.
- **Miljövariabler** i SCREAMING_SNAKE_CASE.
- **Inga hemligheter i repot** — anslutningsuppgifter och lösenord hör i miljövariabler eller en konfigurationsfil utanför versionshanteringen.

Den sista punkten är inte kosmetika. Den prövas i databasprojektet, och att checka in ett lösenord i GitHub är ett verkligt fel med verkliga konsekvenser.
`
  }

  ]
};

// Vilka ämnen varje kapitel berör (styr "Öva på detta kapitel") och vilka
// det introducerar (styr kapitelavslutet), enligt kursplanens tabell.
export const CHAPTER_TOPICS = {
  kap1: { topics: ["grunder"], primaryTopics: ["grunder"] },
  kap2: { topics: ["relationsmodellen"], primaryTopics: ["relationsmodellen"] },
  kap3: { topics: ["nycklar"], primaryTopics: ["nycklar"] },
  kap4: { topics: ["metamodell", "er"], primaryTopics: ["metamodell", "er"] },
  kap5: { topics: ["relationstyper", "er"], primaryTopics: ["relationstyper"] },
  svaga: { topics: ["svaga", "crowsfoot", "relationstyper"], primaryTopics: ["svaga", "crowsfoot"] },
  kap6: { topics: ["transformation", "nycklar"], primaryTopics: ["transformation"] },
  kap7: { topics: ["normalisering"], primaryTopics: ["normalisering"] },
  kap8: { topics: ["fysisk", "nycklar"], primaryTopics: ["fysisk"] },
};

// Tentans område per kapitel. Sedan föreläsarens besked 2026-08-31 (tentan
// görs om och väntas täcka det mesta av föreläsningsinnehållet) räknas alla
// kapitel som relevanta — inget märks som utanför tentan. Mekaniken finns
// kvar: null = utanför tentan, saknat fält = ingen områdesindelning alls.
// SQL-området motsvaras av SQL-verkstaden.
export const EXAM_AREAS = {
  kap1: "Grund",
  kap2: "Grund",
  kap3: "Grund",
  kap4: "ER-modellering",
  kap5: "ER-modellering",
  svaga: "ER-modellering",
  kap6: "Transformation",
  kap7: "Normalisering",
  kap8: "Transformation",
};

export const examNote = {
  text: "Tentan 17 november görs om jämfört med tidigare år och väntas täcka det mesta av föreläsningsinnehållet. Exakt omfattning meddelas under delkursen.",
  sqlHint: "SQL-området tränas i SQL-verkstaden.",
};

export const intro = reading.intro;

export const chapters = reading.chapters.map((chapter) => ({
  ...chapter,
  ...(CHAPTER_TOPICS[chapter.id] || { topics: [], primaryTopics: [] }),
  examArea: EXAM_AREAS[chapter.id] ?? null,
}));

export const glossary = [
  { term: "1NF (första normalformen)", definition: "En relation är i första normalformen om värdena i varje attribut är atomära.", chapter: "kap7" },
  { term: "2NF (andra normalformen)", definition: "En relation är i 2NF om och endast om den är i 1NF och inget icke-primärattribut är funktionellt beroende av någon äkta delmängd av någon kandidatnyckel i relationen.", chapter: "kap7" },
  { term: "3NF (tredje normalformen)", definition: "En relation är i 3NF om och endast om den är i 2NF och varje icke-primärattribut är icke-transitivt beroende av varje kandidatnyckel i relationen.", chapter: "kap7" },
  { term: "Atomärt värde", definition: "Ett odelbart värde i en cell. Kravet på atomära värden är både en av relationens egenskaper och innehållet i 1NF.", chapter: "kap2" },
  { term: "Attribut (attribute)", definition: "Formellt: ett namn parat med en domän. Informellt en kolumn eller ett fält.", chapter: "kap2" },
  { term: "CHECK-constraint", definition: "Villkor på tillåtna värden i en kolumn, t.ex. CHECK (EmpSalary >= 0). Domänbegreppets tekniska motsvarighet.", chapter: "kap8" },
  { term: "DDL (Data Definition Language)", definition: "Den del av SQL som definierar strukturer: CREATE, ALTER, DROP.", chapter: "kap8" },
  { term: "Dekomposition", definition: "Att bryta ned en relation i mindre relationer som uppfyller en önskad normalform.", chapter: "kap7" },
  { term: "Dependency preservation", definition: "Att varje funktionellt beroende i originalrelationen har sina båda attribut i samma delrelation, så att det kan kontrolleras utan join. Prövas i övningshäftets sant/falskt-frågor.", chapter: "kap7" },
  { term: "DML (Data Manipulation Language)", definition: "Den del av SQL som hanterar data: SELECT, INSERT, UPDATE, DELETE.", chapter: "kap8" },
  { term: "Domän (domain)", definition: "Alla värden som ett dataelement kan innehålla. Snävare än datatyp och bär affärsregeln.", chapter: "kap2" },
  { term: "Främmande nyckel (foreign key)", definition: "Ett attribut som refererar till primärnyckeln i en annan eller samma relation, och därmed upprätthåller referensintegritet.", chapter: "kap3" },
  { term: "Funktionellt beroende", definition: "X bestämmer funktionellt Y om och endast om varje X-värde i relationen är associerat med precis ett Y-värde. Skrivs X → Y.", chapter: "kap7" },
  { term: "Grad (degree)", definition: "Antalet attribut i en relation.", chapter: "kap2" },
  { term: "Icke-primärattribut (non-prime)", definition: "Ett attribut som inte är medlem i någon kandidatnyckel.", chapter: "kap3" },
  { term: "IDENTITY(1,1)", definition: "SQL Servers sätt att generera surrogatnyckelvärden automatiskt.", chapter: "kap8" },
  { term: "Kandidatnyckel (candidate key)", definition: "Ett attribut eller en uppsättning attribut som kan användas för att unikt identifiera vilken tupel som helst i en relation. En relation kan ha flera.", chapter: "kap3" },
  { term: "Kardinalitet (cardinality)", definition: "Antalet tupler i en relation. Ordet används också löst om relationers multipliciteter.", chapter: "kap2" },
  { term: "Kodstandard", definition: "Kursens namngivningsregler: PascalCase och singular för tabeller, PascalCase för kolumner, constraintprefixen PK_, FK_, UQ_, CK_, DF_, camelCase för Java-variabler.", chapter: "kap8" },
  { term: "Konceptuell databasdesign", definition: "Första steget i designprocessen: verksamhetskraven blir ett ER-diagram.", chapter: "kap1" },
  { term: "Logisk databasdesign", definition: "Andra steget: den konceptuella modellen transformeras till relationer i textform och normaliseras om nödvändigt.", chapter: "kap1" },
  { term: "Lossless join", definition: "Att en naturlig join av delrelationerna ger tillbaka originalrelationen. Saknar delrelationerna gemensamt attribut går det inte. Icke-förhandlingsbart krav på en dekomposition.", chapter: "kap7" },
  { term: "Naturlig nyckel", definition: "Nyckel med affärsbetydelse, t.ex. anställningsnummer eller ISBN. Motsats till surrogatnyckel.", chapter: "kap3" },
  { term: "NoSQL", definition: "Dokumentorienterade databaser, ett alternativ till relationsdatabaser för persistent lagring.", chapter: "kap1" },
  { term: "Partiellt beroende", definition: "Ett icke-primärattribut som beror på en äkta delmängd av en kandidatnyckel. Bryter mot 2NF och kan bara uppstå vid sammansatt nyckel.", chapter: "kap7" },
  { term: "Persistent lagring", definition: "Lagring som överlever att programmet stängs: filer, kalkylblad, RDBMS, NoSQL. Motsats till volatil lagring i RAM.", chapter: "kap1" },
  { term: "Primärattribut (prime)", definition: "Ett attribut som är medlem i någon kandidatnyckel.", chapter: "kap3" },
  { term: "Primärnyckel (primary key)", definition: "Ett specifikt val av attribut som unikt identifierar en tupel i en relation. Bör vara stabil, minimal och semantiskt meningsfull.", chapter: "kap3" },
  { term: "RDBMS", definition: "Relational Database Management System. Lagrar data i tabeller och frågas med SQL. Kursens system är Microsoft SQL Server.", chapter: "kap1" },
  { term: "Referensintegritet", definition: "Att främmande nycklar alltid pekar på existerande rader. Databasen vägrar operationer som skulle bryta det.", chapter: "kap3" },
  { term: "Relation", definition: "Formellt en mängd tupler där varje element tillhör en domän. Visuellt en tabell. Bygger på mängdlära och första ordningens logik.", chapter: "kap2" },
  { term: "Sammansatt nyckel (composite key)", definition: "Flera attribut som tillsammans identifierar en tupel unikt utan att göra det var för sig.", chapter: "kap3" },
  { term: "Server", definition: "I praktiken en dator som aldrig stängs av, och som betjänar klienter med data ur en databas.", chapter: "kap1" },
  { term: "SQL (Structured Query Language)", definition: "Språket för att skapa, läsa, uppdatera och radera data samt administrera relationsdatabaser.", chapter: "kap1" },
  { term: "Surrogatnyckel", definition: "Artificiellt, databasgenererat nyckelvärde utan affärsbetydelse. Införs i fysisk design av skäl som nyckelstabilitet och prestanda.", chapter: "kap3" },
  { term: "Transitivt beroende", definition: "Ett funktionellt beroende där X → Z indirekt, i kraft av X → Y och Y → Z, och där det inte gäller att Y → X. Bryter mot 3NF.", chapter: "kap7" },
  { term: "Tupel (tuple)", definition: "Formellt en mängd attributvärden där inga två skilda element har samma attributnamn. Informellt en rad eller post.", chapter: "kap2" },
  { term: "UNIQUE-constraint", definition: "Kräver unika värden men tillåter NULL. Här hamnar naturliga nycklar när en surrogatnyckel tagit primärnyckelrollen.", chapter: "kap8" },
  { term: "Uppdateringsanomali", definition: "Att samma faktum lagras i flera rader så att en ändring måste göras på flera ställen, med risk för inkonsekvens.", chapter: "kap7" },
  { term: "Fysisk databasdesign", definition: "Tredje steget: den logiska modellen implementeras som DDL-satser, med surrogatnycklar, datatyper och constraints.", chapter: "kap1" },
  { term: "Raderingsanomali", definition: "Att radering av information om en entitet leder till att information om en separat entitet förloras.", chapter: "kap7" },
  { term: "Äkta delmängd (proper subset)", definition: "En delmängd av en mängd som inte är lika med mängden själv. Både A och B är äkta delmängder av {A,B}.", chapter: "kap7" },
  { term: "Metamodell (metamodel)", definition: "Vokabulären som säger vad en modell får uttrycka. För ER: EntityType, Attribute, RelationshipType, Participation/Role och CardinalityConstraint. Ändras inte när modellen växer.", chapter: "kap4" },
  { term: "Modell (model)", definition: "Mängden fakta om en viss verklighet, uttryckt i metamodellens begrepp — att Employee är en entitetstyp, att WorksOn äger assignmentStartDate. Samma modell kan representeras som text, XML eller diagram utan att ändras.", chapter: "kap4" },
  { term: "Representation", definition: "Ett sätt att visa en modell: vanlig text, XML eller ett diagram. Ingen representation är modellen.", chapter: "kap4" },
  { term: "Diagram", definition: "En grafisk representation av en modell som använder en notation. Inte en annan modell; placeringen på pappret är bara schematisk.", chapter: "kap4" },
  { term: "Notation", definition: "Symbolerna ett diagram använder: rektangel, romb och ellips i kursens Chen-variant; boxar, namngivna linjer och ändsymboler i Crow's Foot. Det finns ingen enda universellt antagen ERD-specifikation, så läs alltid legenden.", chapter: "kap4" },
  { term: "Population", definition: "De instanser som finns vid en viss tidpunkt — Mary : Employee, Atlas : Project, Mary WorksOn Atlas. Populationens objekt instansierar modellens typer och ritas aldrig i diagrammet.", chapter: "kap4" },
  { term: "ER-modellering", definition: "Konstruktion av ER-diagram för att fånga verksamhetens krav på persistent datalagring, som underlag för design av relationsdatabaser. Chens förslag 1975–76 hade två delar: en datamodell (begreppen) och en diagramteknik (ritsättet).", chapter: "kap4" },
  { term: "Chen-notation", definition: "Kursens Chen-härledda notation (Elmasri & Navathe): rektangel för entitetstyp, romb för relationstyp, ellips för attribut, understrykning för identifierare, ratio-etiketter plus deltagandelinjer för kardinalitet och deltagande.", chapter: "kap4" },
  { term: "Entitet (entity)", definition: "Chen 1976: an entity is a 'thing' which can be distinctly identified. En enskild medlem av en entitetsmängd, och en ändamålsbestämd informationsrepresentation — inte en fullständig beskrivning.", chapter: "kap4" },
  { term: "Entitetstyp (entity type)", definition: "Grupperar entiteter med relevanta gemensamma egenskaper. Ritas som rektangel och namnges med ett substantiv i singular. Det du ritar — enskilda entiteter ritas aldrig.", chapter: "kap4" },
  { term: "Entitetsmängd (entity set)", definition: "Samlingen av alla entiteter av en entitetstyp som representeras vid en viss tidpunkt. Kan växa, krympa eller vara tom.", chapter: "kap4" },
  { term: "Stark entitetstyp (strong entity type)", definition: "Entitetstyp som kan identifiera varje entitet utan att bero på en entitet av annan typ. Ritas med enkel rektangel; Employee och Project är starka.", chapter: "kap4" },
  { term: "Attribut i ER-modellen", definition: "En namngiven egenskap som beskriver instanserna av en entitetstyp eller en relationstyp. Ritas som oval kopplad till sin ägare. Varje attribut ägs av antingen en entitetstyp eller en relationstyp, aldrig båda.", chapter: "kap4" },
  { term: "Sammansatt attribut (composite)", definition: "Attribut med meningsfulla delattribut, t.ex. address av streetName, streetNumber, postalCode och city. Följer inte självt med till relationen vid transformation — bara delarna.", chapter: "kap4" },
  { term: "Flervärdesattribut (multivalued)", definition: "Attribut som kan ha flera värden samtidigt för samma instans, t.ex. phoneNumber. Ritas med dubbel oval och transformeras till en egen relation.", chapter: "kap4" },
  { term: "Härlett attribut (derived)", definition: "Attribut vars värde kan beräknas, t.ex. yearsEmployed ur hireDate eller numberOfEmployees ur WorksOn. Ritas med streckad oval. Beskriver ett begreppsligt beroende, inte en lagringsstrategi.", chapter: "kap4" },
  { term: "Obligatoriskt och frivilligt attribut (mandatory/optional)", definition: "Om varje instans måste ha ett värde (title) eller får sakna det (description). Båda ritas med vanlig oval — Chen saknar symbol, så villkoret skrivs ut explicit.", chapter: "kap4" },
  { term: "Value set / value domain (värdemängd)", definition: "Anger vilka värden som är tillåtna och hur de ska tolkas, t.ex. EmploymentStatus permits {active, leave, ended}. Dokumenteras utanför Chen-diagrammet, där ovalen bara namnger attributet. Kan definieras genom typ, intervall, format eller regel.", chapter: "kap4" },
  { term: "Identifierare (identifier)", definition: "Ett attribute, eller en kombination av attributes, vars värden unikt skiljer varje entity i ett entity set. En regel på modellnivå som måste hålla för varje giltig population, inte bara för nuvarande data. Understryks i Chen-notation.", chapter: "kap4" },
  { term: "Sammansatt identifierare", definition: "Ett identifierande attribut med delattribut, t.ex. projectNo av registrationYear och sequenceNo. Den sammansatta föräldern stryks under, inte delarna; identifikationen använder det kompletta värdet.", chapter: "kap4" },
  { term: "Relationstyp (relationship type)", definition: "Associerar entitetstyper via deltaganderoller och kan äga attribut. Ritas som romb. Det du ritar — relationsinstanserna ritas aldrig.", chapter: "kap5" },
  { term: "Relationsmängd (relationship set)", definition: "Alla relationsinstanser av en relationstyp vid en viss tidpunkt. Kan ändras utan att relationstypen ändras.", chapter: "kap5" },
  { term: "Relationsinstans (relationship instance)", definition: "En medlem av en relationsmängd, med en entitet per deltagande roll: r1 = ⟨e1, p1⟩. En tupel där rollordningen spelar roll.", chapter: "kap5" },
  { term: "Binär relation", definition: "Relationstyp med exakt två deltagande roller, t.ex. Employee — WorksOn — Project. Förekommer som 1:1, 1:N och M:N.", chapter: "kap5" },
  { term: "Deltaganderoll (participant role)", definition: "Namnger ett deltagande av en entitetstyp i en relationstyp: worker och project i WorksOn. Nödvändig när samma entitetstyp deltar mer än en gång, som supervisor och report i Supervises.", chapter: "kap5" },
  { term: "Relationsattribut", definition: "Attribut som ägs av relationstypen eftersom det beskriver paret, t.ex. allocationPercentage på WorksOn. Ownership follows meaning. Ingår inte i primärnyckeln vid M:N-transformation.", chapter: "kap5" },
  { term: "Participation (deltagande)", definition: "Svarar på om en entitet får finnas utan att delta i någon instans av relationstypen. Total (dubbel linje) eller partial (enkel linje). Läses vid sin egen ände och sätts oberoende av kardinaliteten.", chapter: "kap5" },
  { term: "Total participation (totalt deltagande)", definition: "Varje instans av entitetstypen måste delta i relationen minst en gång. Markeras med dubbla linjer i Chen-notation och läses vid sin egen ände.", chapter: "kap5" },
  { term: "Partial participation (partiellt deltagande)", definition: "En instans av entitetstypen får finnas utan att delta i relationen. Markeras med enkel linje i Chen-notation.", chapter: "kap5" },
  { term: "Cardinality ratio (kardinalitetsförhållande, multiplicitet)", definition: "Etiketterna 1, M och N vid relationens ändar. Svarar på hur många entiteter i andra änden som får vara relaterade till en fixerad entitet. Anger endast maxima och läses tvärs över relationen: talet bredvid A säger hur många A varje B får ha.", chapter: "kap5" },
  { term: "Min–max-notation", definition: "Alternativ Chen-konvention där varje ände bär en tupel (minimum, maximum) som läses vid sin egen entitet: (0,N), (1,1). Enkla linjer genomgående. Blandas aldrig med dubbellinjer i samma diagram.", chapter: "kap5" },
  { term: "1:1-relation", definition: "Ett-till-ett-relation. Transformationen beror på deltagandet: från frivillig till obligatorisk sida, valfri riktning när båda är frivilliga, och möjlig sammanslagning när båda är obligatoriska.", chapter: "kap5" },
  { term: "1:N-relation (även 1:M)", definition: "Ett-till-många-relation. Transformeras genom att ett-sidans primärnyckel läggs som främmande nyckel i många-sidans relation.", chapter: "kap5" },
  { term: "M:N-relation", definition: "Många-till-många-relation. Transformeras till en ny relation med sammansatt primärnyckel bestående av båda entiteternas primärnycklar. M och N betyder båda många; bokstäverna skiljer positionerna åt.", chapter: "kap5" },
  { term: "Unär relation (rekursiv)", definition: "Relationstyp med en deltagande entitetstyp — grad ett — där båda rollerna spelas av samma entitetstyp: Employee — Supervises med supervisor och report.", chapter: "kap5" },
  { term: "Grad (degree) hos en relationstyp", definition: "Antalet deltagande entitetstyper: unär = 1, binär = 2, ternär = 3. Metamodellen tillåter två eller flera deltaganden. (Grad hos en relation i relationsmodellen är i stället antalet attribut.)", chapter: "kap5" },
  { term: "Ternär relation", definition: "Relationstyp av grad tre. Kan inte ersättas av tre binära M:N-relationer utan att informationen om vilken trippel som hör samman förloras.", chapter: "kap5" },
  { term: "Notationsgräns (notation boundary)", definition: "Regler som basic Chen saknar symbol för: inga self-links, inga cykler, ingen optionality på attribut, inga värdemängder. Anges som textuella verksamhetsregler och upprätthålls i constraints, triggers eller applikationskod.", chapter: "kap5" },
  { term: "Svag entitetstyp (weak entity type)", definition: "Entitetstyp vars kompletta identitet inkluderar ägaren: ProjectTask identifieras av projectNo + taskNo. Ritas med dubbel rektangel. Kräver identitetsberoende — total participation räcker inte.", chapter: "svaga" },
  { term: "Identifying relationship (identifierande relation)", definition: "Relationen mellan en svag entitet och dess ägarentitet, t.ex. Contains mellan Project och ProjectTask. Ritas med dubbel romb. Connolly & Begg kallar den svag relationstyp (weak relationship type).", chapter: "svaga" },
  { term: "Partiell identifierare (partial identifier)", definition: "Skiljer svaga entiteter som har samma ägare och behöver inte vara globalt unik — taskNo inom ett Project. Markeras med streckad understrykning. Kallas även partial key.", chapter: "svaga" },
  { term: "Identitetsberoende (identity dependence)", definition: "Den svaga entitetens kompletta identitet inkluderar det ägande objektet. Det som gör en entitet svag.", chapter: "svaga" },
  { term: "Existensberoende (existence dependence)", definition: "Den svaga entiteten kan inte finnas utan sin ägare. Uttrycks av dubbellinjen på den svaga sidan.", chapter: "svaga" },
  { term: "Associativ entitet (associative entity)", definition: "En entitetstyp som representerar ett par, t.ex. Assignment för Employee–Project. Byggs av vanliga Chen-konstruktioner utan särskild symbol. I Crow's Foot är den obligatorisk för relationer med attribut.", chapter: "svaga" },
  { term: "Reifiering (reification)", definition: "Att göra om en relation till en sak: WorksOn blir Assignment med Holds och Concerns. Görs när paret behöver egen identitet, egen livscykel eller ska delta i andra relationer — inte bara för att relationen har attribut. Skapar ett datahanteringsansvar, som assignmentNo.", chapter: "svaga" },
  { term: "Crow's foot-notation", definition: "Familj av besläktade notationer (Information Engineering, Martin) där relationsnamnet står på linjen och ändsymbolerna cirkel, streck och fork anger optional/required och one/many. Kursen använder den konceptuella common IE-varianten.", chapter: "svaga" },
  { term: "Ändpunktsmönster (endpoint patterns)", definition: "Crow's Foots fyra kombinationer: yttre märke cirkel = optional, streck = required; inre märke streck = one, fork = many. Markörerna sitter vid den ändpunkt vars instanser de räknar.", chapter: "svaga" }
];
