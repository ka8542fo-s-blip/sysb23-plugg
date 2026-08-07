# PROMPT TILL CLAUDE CODE — Läsdel och begrepp för delkursen Databaser

## Vad du ska göra

Delkursen **Databaser** i SYSB23 Plugg har idag bara SQL-verkstaden. Tentan (3 hp, 17 nov, fem timmar) täcker **fyra områden**: ER-modellering, transformation från konceptuell till fysisk modell, normalisering och SQL. Bara det sista finns i appen.

Nu bygger vi in de tre övriga plus grunderna. Använd samma arkitektur som Strategi-delkursen redan har:

- `src/data/databaser/reading.js` — kompendium i åtta kapitel (innehåll nedan)
- `src/data/databaser/topics.js` — begreppskort, **enda källan** till korta punkter
- Ordlistan läggs i `reading.js` som `glossary`, samma schema som Strategi

Uppdatera manifestet så att Databaser får fler vyer:

```js
{ id: "databaser", name: "Databaser", status: "aktiv",
  views: ["las", "sql", "ova", "prov", "statistik"] }
```

`las` fungerar direkt med detta innehåll. `ova` och `prov` kräver frågebanken, som kommer i en separat prompt — skapa `questions.js` med en tom array nu och låt vyerna visa sitt tomläge tills den fylls.

Läs-vyn, Kunskapsnavets tre segment, kapitelavsluten ur `primaryTopics`, korsreferenserna och sökningen ska fungera **exakt som för Strategi** — all den koden finns och ska återanvändas, inte dupliceras. Enda skillnaden är vilken delkurs som är vald.

Kapitel–ämne-mappning:

| Kapitel | `topics` | `primaryTopics` |
|---|---|---|
| kap1 | grunder | grunder |
| kap2 | relationsmodellen | relationsmodellen |
| kap3 | nycklar | nycklar |
| kap4 | er | er |
| kap5 | relationstyper, er | relationstyper |
| kap6 | transformation, nycklar | transformation |
| kap7 | normalisering | normalisering |
| kap8 | fysisk, nycklar | fysisk |

## Innehållet är hämtat ur kursmaterialet

Kompendiet bygger på föreläsning 1 (introduktion), 4 (konceptuell design), 5 (logisk design), 6 (normalformer) och 7 (fysisk design), samt kursens kodstandard. Definitionerna är återgivna med kursens egen formulering där formuleringen är det som prövas — normalformernas definitioner särskilt, eftersom de är formella och tentan kan begära dem ordagrant. **Ändra dem inte.**

Notera att kursmaterialet är på engelska medan appen är på svenska. Kompendiet är skrivet på svenska men **behåller de engelska facktermerna** parallellt, eftersom tentan är på engelska: "kandidatnyckel (candidate key)". Detta är avsiktligt — ta inte bort de engelska termerna.

---

# INNEHÅLL A — `src/data/databaser/reading.js`

```js
export const reading = {
  title: "Databaser",
  subtitle: "Läskompendium",
  intro: "Delkursen handlar om hur man kommer från en verksamhets behov till en fungerande databas, och tentan prövar fyra saker: ER-modellering, transformation från konceptuell till fysisk modell, normalisering och SQL. Kompendiet följer den designprocessen i ordning — konceptuell design, logisk design, fysisk design — med relationsmodellen och nycklarna som grund. Läs kapitel 1 till 3 innan du börjar med SQL-verkstaden; resten av kapitlen kan läsas i vilken ordning som helst, men de bygger på varandra. Räkna med ungefär en och en halv timme. Fackterminologin ges på både svenska och engelska, eftersom tentan är på engelska.",
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
    title: "Konceptuell design: entiteter och attribut",
    readingMinutes: 10,
    lead: "ER-modellering i Chen-notation: entitetstyper, de fyra attributtyperna och hur identifierare markeras.",
    sources: ["Föreläsning 4"],
    body: `
**ER-modellering (Entity-Relationship modeling)** är konstruktionen av ER-diagram för att fånga verksamhetens krav på persistent datalagring, som underlag för design av relationsdatabaser som möter dessa krav. Metoden går tillbaka på Peter Chen.

Byggstenarna är:

- Vanlig entitetstyp (regular entity type)
- Svag entitetstyp (weak entity type)
- Vanlig relationstyp (regular relationship type)
- Svag relationstyp (weak relationship type)
- Attribut: enkelt, sammansatt, flervärdes- och härlett

## En modell är en abstraktion

En konceptuell datamodell är en **abstraktion av verkligheten**. Den är en abstraktion just därför att vi medvetet tagit med vissa attribut och uteslutit andra. En verklig student har ett närmast oändligt antal egenskaper som skulle kunna lagras — modellen väljer de som verksamheten behöver.

## Notationer

ER-diagram kan ritas i olika notationer, som skiljer sig både visuellt och i vilka byggstenar de erbjuder. Kursen fokuserar på **Chen-notation** och **Crow's foot-notation**.

En viktig avgränsning: ER-diagram kan visuellt likna **UML-klassdiagram** men är begreppsmässigt något helt annat. ER-diagram är för design av relationsdatabaser; UML-klassdiagram är för design av objektorienterade lösningar. UML används ibland som notation för ER-modellering eftersom notationen är välkänd, men det medför problem. **Principerna för ER-modellering är däremot desamma oavsett notation** — det är dem du ska förstå, inte en enskild ritteknik.

## Entitetstyp

> **Entitetstyp (entity type):** en mängd saker med samma egenskaper, vilka identifieras av en användare eller organisation som havande självständig existens.

Informellt sägs bara "entitet". Entiteter kan ha **fysisk existens** (Student) eller **begreppslig existens** (Course) — båda är fullt giltiga.

I Chen-notation ritas entiteten som en rektangel. Tänk inte på attributen som kolumner i en tabell ännu; på den här nivån är de egenskaper hos en informationsentitet.

## De fyra attributtyperna

**Enkelt attribut (simple):** ett odelbart värde. \`StudentNo\`, \`PhoneNumber\`.

**Sammansatt attribut (composite):** ett attribut som består av flera delattribut. \`Name\` bestående av \`FirstName\` och \`LastName\`, eller \`Address\` bestående av \`StreetName\` och \`StreetNumber\`. Ritas som ett attribut med underattribut hängande under.

**Flervärdesattribut (multivalued):** ett attribut som kan ha flera värden för samma entitetsinstans — en student med flera adresser. Ritas med dubbel ellips.

**Härlett attribut (derived):** ett attribut vars värde kan beräknas ur ett annat. \`Age\` kan härledas ur \`DateOfBirth\`. Ritas med streckad ellips. Härledda attribut lagras normalt inte, just för att de kan räknas fram — och för att lagrade härledda värden riskerar att bli inkonsekventa.

## Identifierande attribut

Identifierande attribut **stryks under**. Det är så unikhet uttrycks i Chen-notation.

Här finns en subtilitet som föreläsningen ägnar flera bilder åt. Betrakta en student med studentnummer, ett namn bestående av för- och efternamn, och en adress. Beroende på vilka verksamhetsregler som gäller kan olika saker vara unika:

- Bara \`StudentNo\` är unikt → bara det stryks under.
- Kombinationen \`{FirstName, LastName}\` är unik men inte \`StudentNo\` → delattributen stryks under, inte studentnummer.
- Både \`StudentNo\` och kombinationen \`{FirstName, LastName}\` är unika → båda markeras, alltså två kandidatnycklar.
- Även \`Address\` är unik → tre kandidatnycklar.

Kravtexten avgör alltså diagrammet, och exakt hur understrykningarna sätts är det som senare bestämmer relationens kandidatnycklar. När du löser en tentauppgift: läs kravtexten mening för mening och markera unikheten i takt med att den nämns.

## Flervärdesattribut eller relation?

Ett designval värt att förstå eftersom det avgör hur modellen transformeras.

Modelleras \`Address\` som ett **flervärdesattribut** hos \`Employee\` blir resultatet en separat relation \`EmployeeAddress(EmployeeNo, Address)\` — och där **kan två anställda dela samma adress**, eftersom adressen bara är ett värde.

Modelleras \`Address\` i stället som en **egen entitet** med en 1:M-relation till \`Employee\` kan anställda **inte** dela adress, eftersom varje adressinstans hör till en anställd.

Vilket som är rätt beror på verksamhetsregeln. Att kunna motivera valet är precis vad en modelleringsuppgift efterfrågar.
`
  },

  {
    id: "kap5",
    number: 5,
    title: "Relationer, kardinalitet och svaga entiteter",
    readingMinutes: 12,
    lead: "Binära relationer i alla tre former, obligatoriskt deltagande, relationsattribut, unära och ternära relationer, samt svaga entitetstyper.",
    sources: ["Föreläsning 4"],
    body: `
Entiteter utan relationer är bara lösa listor. Det är relationerna som gör modellen till en modell.

## Binär relation

En **binär relation** kopplar två entitetstyper och har alltid två saker: ett **namn** och **multipliciteter** (även kallade kardinaliteter). I Chen-notation ritas relationen som en romb mellan entiteterna.

    Student ---M--- (Study) ---1--- Course

Multipliciteten anges på vardera sidan och kan vara 1, M eller N. Tre former förekommer:

**Ett-till-många (1:M).** En kurs kan ha många studenter, en student läser en kurs.
**Ett-till-ett (1:1).** En student läser exakt en kurs och en kurs har exakt en student.
**Många-till-många (M:N).** En student kan läsa många kurser, en kurs kan ha många studenter.

En detalj som föreläsningen uttryckligen påpekar: **skriv alltid M:N, aldrig M:M.** Skriver du M:M påstår du att båda sidor har exakt samma multiplicitet, vilket inte är vad du menar.

## Obligatoriskt deltagande

Det här är den vanligaste felkällan i modelleringsuppgifter, och det som skiljer ett godkänt diagram från ett korrekt.

**Dubbla linjer betyder obligatoriskt deltagande (mandatory participation).** En enkel linje betyder frivilligt deltagande.

Frågan att ställa vid varje relation är: **vilken entitet måste delta?**

- "En student **måste** läsa en kurs" → dubbel linje på studentsidan. Studenten måste delta i relationen Study.
- "En student måste läsa en kurs, **och** en kurs måste ha minst en student" → dubbla linjer på båda sidor.
- "En student **kan** läsa en kurs, en kurs **kan** ha studenter" → enkla linjer på båda sidor.

Alla tre kombinationerna är möjliga för alla tre relationsformerna, vilket ger nio varianter. Kravtextens hjälpverb — *måste*, *kan*, *får* — är det som avgör.

I UML uttrycks samma sak med intervall: \`1..1\` eller bara \`1\` betyder obligatoriskt, \`0..*\` betyder frivilligt. Det är värt att kunna översätta mellan notationerna, eftersom kursen visar båda.

## Flera relationer mellan samma entiteter

Det kan finnas mer än en binär relation mellan två entitetstyper. Student och Course kan vara kopplade både genom \`Study\` (läser nu) och \`HasStudied\` (har läst) — två skilda relationer med egna multipliciteter.

## Relationsattribut

**Relationsattribut** representerar data som uppstår **som en följd av relationen**. Betyget \`Grade\` hör inte till studenten och inte till kursen, utan till kombinationen: bara en student som läst en kurs får ett betyg på den kursen.

Relationsattribut används mest för M:N-relationer men kan också förekomma på 1:M och 1:1. Ritas som ett attribut hängande från relationsromben.

Att kunna känna igen när ett attribut hör till relationen och inte till någon av entiteterna är en modelleringsfärdighet som transformationen sedan belönar — attributet hamnar i den nya kopplingsrelationen.

## Unär eller rekursiv relation

En **unär** (rekursiv) relation kopplar en entitetstyp till sig själv. En student kan mentorera andra studenter, och mentoreras av en student.

Unära relationer har ofta **rollnamn** på vardera sidan, eftersom relationen betyder olika saker beroende på riktning: \`mentors\` och \`is_mentored\`.

Föreläsningens eget tips för att tänka klart: **rita den unära relationen som om den vore binär**, med samma entitet i två kopior. Då blir det uppenbart att en student kan mentorera många andra (M-sidan) och mentoreras av en (1-sidan), alltså 1:M.

Notera att en unär 1:M-relation tillåter att någon inte mentoreras alls — det är inget fel i diagrammet.

## Ternär relation

En **ternär relation** kopplar tre entitetstyper samtidigt. Föreläsningens exempel: en leverantör kan leverera många produkter till en viss kund och en viss produkt till många kunder; en kund kan köpa produkter från många leverantörer; en produkt kan levereras av en leverantör till en viss kund.

Frestelsen är att modellera detta som tre binära M:N-relationer. Det går inte, och skälet är instruktivt: med tre separata relationer vet du att Amazon levererar stolar, att IKEA levererar stolar, och att Erdogan beställer stolar — men **du kan inte svara på vilken leverantör som levererade stolen till Erdogan**. Informationen om trippeln finns inte.

Lösningen är en relation som binder alla tre samtidigt, vilket vid transformationen blir en relation med en trippelsammansatt primärnyckel: \`Delivery(supplierName, productName, customerName)\`.

## Svag entitetstyp och svag relationstyp

En **svag entitetstyp (weak entity type)** är en entitet som inte kan identifieras med sina egna attribut ensamma — den behöver ägarentitetens nyckel.

Föreläsningens exempel är utmärkt eftersom det är verkligt: ett universitet har ett unikt namn och en budget. En kurs har en kurskod, ett namn och ett antal poäng. Men **kurskoden är unik inom det universitet som ger kursen**, inte nationellt. Lunds universitet ger SYSB23 om 30 poäng; Uppsala kan ge en helt annan kurs som också heter SYSB23.

Alltså går kursens namn och poäng inte att identifiera med kurskoden ensam — det krävs även universitetets namn.

Notationen:

- **Svag entitet** ritas med **dubbel ram**.
- **Svag relation** — relationen till ägarentiteten — ritas med **dubbel romb**.
- Kurskoden är en **partiell identifierare (partial key)**, markerad med streckad understrykning i stället för hel.

En svag entitet kan ha andra, vanliga relationer också: en lärare kan undervisa flera kurser, och en kurs måste ha en lärare — den relationen är helt vanlig även om Course är svag.

Att känna igen svaga entiteter i en kravtext handlar om att leta efter formuleringar av typen "X är unikt **inom** Y" eller "det kan finnas två X med samma kod hos olika Y".
`
  },

  {
    id: "kap6",
    number: 6,
    title: "Transformation till logisk modell",
    readingMinutes: 12,
    lead: "Alla transformationsregler samlade: vanliga och svaga entiteter, 1:M, 1:1, M:N, unära relationer, flervärdesattribut och ternära relationer.",
    sources: ["Föreläsning 5"],
    body: `
Det här är tentans andra område och det mest mekaniska i hela delkursen — vilket är goda nyheter, för mekaniska saker går att lära sig säkert. Reglerna nedan är kursens egna, och de ska tillämpas i ordning.

Notationen för en relation i logisk modell: relationsnamn följt av attributen i parentes, med **primärnyckeln understruken**. Främmande nycklar markeras vanligen med kursiv eller anges separat. Eftersom kompendiet är i text skrivs primärnyckeln här inom \`__dubbelt understruket__\` — i dina egna anteckningar stryker du under.

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
    number: 7,
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

Detta kallas ofta **partiellt beroende**. Notera att problemet bara kan uppstå när kandidatnyckeln är sammansatt — en relation med enkel kandidatnyckel som är i 1NF är automatiskt i 2NF, eftersom en enkel nyckel inte har några äkta delmängder att vara beroende av.

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

Att dela upp en relation är inte gratis. Två egenskaper avgör om uppdelningen är godtagbar, och båda förekommer i övningshäftets sant/falskt-frågor:

**Lossless join (förlustfri join).** Kan originalrelationen återskapas exakt genom att joina delrelationerna? Om joinen producerar rader som inte fanns i originalet — så kallade spurious tuples — är dekompositionen förlustbringande och därmed felaktig. Detta är det icke-förhandlingsbara kravet.

**Dependency preservation (beroendebevarande).** Kan alla funktionella beroenden från originalrelationen kontrolleras inom en enskild delrelation, utan att man behöver joina? Går ett beroende förlorat kan databasen inte längre upprätthålla den affärsregeln med en enkel constraint. Detta är önskvärt men går inte alltid att uppnå samtidigt som 3NF.
`
  },

  {
    id: "kap8",
    number: 8,
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

En **surrogatnyckel** är ett artificiellt, databasgenererat värde utan affärsbetydelse. I SQL Server skapas den med \`IDENTITY(1,1)\`, i SQLite med \`AUTOINCREMENT\`.

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
```

# INNEHÅLL B — `src/data/databaser/topics.js`

8 ämnen. Samma regel som för Strategi: **detta är enda källan** till `keyPoints` och `pitfalls`, och kapitelavsluten renderas härifrån via `primaryTopics`.

```js
export const topics = [
  {
    id: "grunder",
    name: "Databaser, servrar och designprocessen",
    chapter: "kap1",
    examWeight: "medel",
    summary: "En databas är en strukturerad samling data som lagras och nås elektroniskt. Applikationer som LADOK och TimeEdit är inte databaser — de kommunicerar med databaser via en server. Designprocessen går i tre steg: konceptuell design (ER-modellering), logisk design (transformation och normalisering) och fysisk design (DDL-kod).",
    keyPoints: [
      "Designprocessens tre steg: konceptuell databasdesign (ER-diagram) → logisk databasdesign (relationer i textform + normalisering) → fysisk databasdesign (CREATE TABLE-satser).",
      "Verksamhetskraven är utgångspunkten, och frågan som styr urvalet är vad verksamheten behöver lagra data om för att fungera — processer, kvalitetssäkring, regelefterlevnad, intern rapportering.",
      "Databasadministratören bestämmer inte ensidigt; verksamhetssidan måste alltid konsulteras.",
      "En server är i praktiken en dator som aldrig stängs av. Kursens miljö: SQL Server på en virtuell maskin i Microsoft Azure, ansluten från VS Code via mssql-tillägget, kod i GitHub.",
      "RDBMS = Relational Database Management System, lagrar data i tabeller och frågas med SQL.",
      "Volatil lagring (RAM, t.ex. en Java-ArrayList) försvinner när programmet stängs. Persistent lagring: filer, kalkylblad, RDBMS, dokumentorienterade databaser (NoSQL).",
      "SQL kommer sist i processen — modellen ska vara genomtänkt innan koden skrivs."
    ],
    pitfalls: [
      "LADOK och TimeEdit är applikationer, inte databaser.",
      "Blanda inte ihop stegen: normalisering hör till logisk design, surrogatnycklar till fysisk."
    ]
  },
  {
    id: "relationsmodellen",
    name: "Relationsmodellen",
    chapter: "kap2",
    examWeight: "hög",
    summary: "En relation är ett matematiskt begrepp byggt på mängdlära och första ordningens logik, som visuellt framställs som en tabell. Terminologin finns i tre lager: formellt (relation, attribut, tupel), alternativ 1 (tabell, kolumn, rad) och alternativ 2 (fil, fält, post).",
    keyPoints: [
      "Relation = en mängd tupler där varje element tillhör en domän. Attribut = ett namn parat med en domän. Tupel = en mängd attributvärden där inga två skilda element har samma attributnamn.",
      "Domän (domain) = alla värden ett dataelement kan innehålla. En domän bär affärsregeln (t.ex. lön mellan 10 000 och 30 000) och är inte samma sak som en datatyp.",
      "Grad (degree) = antalet attribut. Kardinalitet (cardinality) = antalet tupler.",
      "Terminologi: relation/tabell/fil, attribut/kolumn/fält, tupel/rad/post. På engelska: relation/table/file, attribute/column/field, tuple/row/post.",
      "Relationens sju egenskaper: unikt namn; atomära värden i varje cell; distinkta attributnamn; samma datatyp och domän för alla värden i ett attribut; attributens ordning saknar betydelse; tuplernas ordning saknar betydelse; inga dubblettupler.",
      "Att tuplernas ordning saknar betydelse är skälet till att en SQL-fråga utan ORDER BY inte har garanterad radordning.",
      "Kravet på atomära värden är samma krav som 1NF ställer — en tabell som bryter mot det är strikt sett inte en relation."
    ],
    pitfalls: [
      "Domän och datatyp är inte synonymer — domänen är snävare och uttrycker affärsregeln.",
      "Relationsmodellen förbjuder dubblettupler, men en SQL-tabell tillåter dem om ingen nyckel hindrar det. Känn skillnaden mellan modell och praktik."
    ]
  },
  {
    id: "nycklar",
    name: "Nycklar och referensintegritet",
    chapter: "kap3",
    examWeight: "hög",
    summary: "Kandidatnyckel är varje attribut eller attributuppsättning som kan identifiera en tupel unikt; primärnyckeln är den som arkitekten väljer. Främmande nycklar upprätthåller referensintegritet. Surrogatnycklar tillhör fysisk design, inte logisk.",
    keyPoints: [
      "Kandidatnyckel (candidate key): ett attribut eller en uppsättning attribut som kan användas för att unikt identifiera vilken tupel som helst i en relation. En relation kan ha flera.",
      "Primärnyckel (primary key): ett specifikt val av attribut som unikt identifierar en tupel. Skillnaden mot kandidatnyckel är just valet. Välj stabil, minimal och semantiskt meningsfull.",
      "Sammansatt nyckel (composite key): flera attribut som tillsammans är unika utan att vara det var för sig. Alla ingående attribut stryks under i notationen.",
      "Primärattribut (prime): medlem i NÅGON kandidatnyckel. Icke-primärattribut (non-prime): medlem i ingen kandidatnyckel.",
      "Främmande nyckel (foreign key): attribut som refererar till primärnyckeln i en annan eller samma relation. Den refererade relationen kallas parent, referenced eller master.",
      "Referensintegritet: databasen vägrar rader som pekar på något som inte finns, och vägrar radera det som fortfarande refereras.",
      "En främmande nyckel får vara NULL när deltagandet är frivilligt, och sätts NOT NULL när det är obligatoriskt.",
      "Naturlig nyckel har affärsbetydelse (anställningsnummer, ISBN). Surrogatnyckel är artificiell och databasgenererad.",
      "Surrogatnycklar införs i FYSISK design, inte logisk. Under logisk design används ER-modellens naturliga identifierare för att bevara semantik och innebörd. Motiven för surrogat är nyckelstabilitet och prestanda.",
      "Mönstret i praktiken: surrogatnyckel som PRIMARY KEY plus naturlig nyckel som UNIQUE — som EmployeeID och EmpNo i hospital-databasen."
    ],
    pitfalls: [
      "'Någon kandidatnyckel' i definitionen av primärattribut betyder att attribut ur flera kandidatnycklar alla räknas som primära.",
      "Att införa surrogatnycklar redan i logisk design är fel enligt kursens designprocess.",
      "Tas den naturliga nyckeln bort när surrogatnyckeln införs förloras affärsregeln om unikhet."
    ]
  },
  {
    id: "er",
    name: "ER-modellering: entiteter och attribut",
    chapter: "kap4",
    examWeight: "hög",
    summary: "ER-modellering är konstruktionen av ER-diagram för att fånga verksamhetens krav på persistent datalagring, som underlag för relationsdatabasdesign. En konceptuell datamodell är en abstraktion av verkligheten — vissa attribut är medvetet inkluderade, andra uteslutna.",
    keyPoints: [
      "Byggstenar: vanlig entitetstyp, svag entitetstyp, vanlig relationstyp, svag relationstyp, samt attribut i fyra former.",
      "Entitetstyp (entity type): en mängd saker med samma egenskaper som identifieras av en användare eller organisation som havande självständig existens. Kan ha fysisk existens (Student) eller begreppslig (Course).",
      "Enkelt attribut (simple): odelbart värde. Sammansatt (composite): består av delattribut, t.ex. Name av FirstName och LastName. Flervärdes (multivalued): flera värden per instans, ritas med dubbel ellips. Härlett (derived): kan beräknas ur annat attribut, ritas streckat.",
      "Identifierande attribut stryks under. Vad som stryks under följer direkt av kravtextens unikhetsregler, och avgör senare relationens kandidatnycklar.",
      "Kursens notationer är Chen och Crow's foot. ER-diagram är för relationsdatabasdesign; UML-klassdiagram är för objektorienterad design — de liknar varandra visuellt men är begreppsmässigt olika. Principerna för ER-modellering är desamma oavsett notation.",
      "Flervärdesattribut kontra egen entitet är ett designval med konsekvenser: som flervärdesattribut kan två anställda dela adress, som egen entitet i 1:M kan de inte."
    ],
    pitfalls: [
      "Härledda attribut lagras normalt inte — de beräknas, just för att lagrade härledda värden riskerar att bli inkonsekventa.",
      "Ett sammansatt attribut självt följer inte med till relationen vid transformation — bara dess atomära delattribut.",
      "UML är inte ER-notation, även om läroböcker använder den så."
    ]
  },
  {
    id: "relationstyper",
    name: "Relationer, kardinalitet och svaga entiteter",
    chapter: "kap5",
    examWeight: "hög",
    summary: "Binära relationer har namn och multipliciteter och förekommer som 1:1, 1:M och M:N. Dubbla linjer markerar obligatoriskt deltagande. Svaga entitetstyper kan inte identifieras utan ägarentitetens nyckel och ritas med dubbel ram.",
    keyPoints: [
      "En binär relation har alltid ett namn och multipliciteter (kardinaliteter) på båda sidor.",
      "Skriv M:N, aldrig M:M — M:M skulle påstå att båda sidor har exakt samma multiplicitet.",
      "Dubbla linjer = obligatoriskt deltagande (mandatory participation), enkel linje = frivilligt. Frågan att ställa är 'vilken entitet måste delta?', och kravtextens hjälpverb (måste/kan/får) avgör.",
      "Alla tre relationsformerna kan kombineras med obligatoriskt deltagande på ena sidan, båda sidor eller ingen sida.",
      "I UML uttrycks samma sak med intervall: 1..1 (eller 1) för obligatoriskt, 0..* för frivilligt.",
      "Det kan finnas flera olika binära relationer mellan samma två entiteter, t.ex. Study och HasStudied.",
      "Relationsattribut representerar data som uppstår som en följd av relationen — betyg finns bara för en student som läst en kurs. Vanligast på M:N men möjligt även på 1:M och 1:1.",
      "Unär (rekursiv) relation kopplar en entitet till sig själv och har ofta rollnamn per riktning (mentors / is_mentored). Tips: rita den som binär med två kopior av entiteten för att avgöra multipliciteten.",
      "Ternär relation kopplar tre entiteter samtidigt. Den kan inte ersättas av tre binära M:N-relationer — då förloras informationen om vilken trippel som hör samman.",
      "Svag entitetstyp (weak entity): kan inte identifieras av sina egna attribut ensamma. Ritas med dubbel ram, dess relation till ägaren med dubbel romb, och dess partiella identifierare (partial key) med streckad understrykning.",
      "Typexempel på svag entitet: kurskoden är unik inom det universitet som ger kursen, men inte nationellt — så kursens namn och poäng kräver även universitetets namn för att identifieras."
    ],
    pitfalls: [
      "Obligatoriskt deltagande glöms oftast bort. Läs kravtexten mening för mening och sätt dubbla linjer där det står 'måste'.",
      "Tre binära M:N-relationer är inte samma sak som en ternär relation.",
      "En svag entitet kan ha vanliga relationer också — dubbelrombens dubbelhet gäller bara relationen till ägaren."
    ]
  },
  {
    id: "transformation",
    name: "Transformation till logisk modell",
    chapter: "kap6",
    examWeight: "hög",
    summary: "Åtta regler tar ER-modellen till relationer i textform. Främmande nyckeln hamnar alltid på många-sidan i 1:M; M:N ger en ny relation med sammansatt primärnyckel; svaga entiteter får ägarens nyckel som del av sin egen primärnyckel.",
    keyPoints: [
      "Vanlig entitet: skapa en relation med samma namn och alla enkla, envärda attribut. Sammansatta attribut ersätts av sina atomära delattribut. Välj primärnyckel bland ER-modellens identifierare.",
      "Svag entitet: egen relation med alla enkla, envärda attribut PLUS ägarens primärnyckel som främmande nyckel. Primärnyckeln blir kombinationen av den främmande nyckeln och den partiella nyckeln.",
      "Binär 1:M: lägg ett-sidans primärnyckel i många-sidans relation som främmande nyckel. Relationens egna enkla attribut hamnar i samma relation. Ingen ny relation behövs.",
      "Binär 1:1 med ett obligatoriskt och ett frivilligt deltagande: lägg den FRIVILLIGA sidans primärnyckel i den OBLIGATORISKA sidans relation — då blir kolumnen aldrig NULL.",
      "Binär 1:1 med båda frivilliga: främmande nyckel i valfri riktning, arkitekten väljer. Med båda obligatoriska och ingen annan relation mellan entiteterna: kan slås samman till en enda relation, eller främmande nyckel som vanligt.",
      "Binär M:N: skapa en NY relation med primärnyckelattributen från båda entitetsrelationerna. De bildar tillsammans en sammansatt primärnyckel och är var för sig främmande nycklar. Relationens egna attribut läggs till som icke-nyckelattribut.",
      "Relationsattribut på en M:N-relation (t.ex. Hours) ingår INTE i primärnyckeln.",
      "Unära relationer: tillämpa den binära regeln av samma form. 1:M ger en främmande nyckel i samma relation (ManagerNo → EmployeeNo); M:N ger en ny relation med två attribut som båda refererar till samma relation.",
      "Flervärdesattribut: separat relation med ägarens primärnyckel som främmande nyckel plus attributet självt; kombinationen blir primärnyckel. Konsekvens: värdet kan delas mellan flera instanser.",
      "Ternär relation: en relation med primärnycklarna från alla tre entiteterna, tillsammans primärnyckel och var för sig främmande nycklar.",
      "Arbetsgång: vanliga entiteter → svaga entiteter → varje relation enligt sin form → flervärdesattribut → kontrollera att varje främmande nyckel har en primärnyckel att peka på → kontrollera normalform."
    ],
    pitfalls: [
      "Främmande nyckeln i 1:M hamnar på många-sidan, aldrig på ett-sidan.",
      "1:1-fallet med ett obligatoriskt och ett frivilligt deltagande går lätt fel — riktningen är från frivillig till obligatorisk.",
      "Glöm inte att relationsattribut på M:N ska med i den nya relationen, men utanför primärnyckeln."
    ]
  },
  {
    id: "normalisering",
    name: "Funktionella beroenden och normalformer",
    chapter: "kap7",
    examWeight: "hög",
    summary: "Redundans ger uppdaterings- och raderingsanomalier. Funktionella beroenden gör det möjligt att härleda kandidatnycklar och avgöra normalform. 1NF kräver atomära värden, 2NF förbjuder beroenden på äkta delmängder av kandidatnycklar, 3NF förbjuder transitiva beroenden.",
    keyPoints: [
      "Uppdateringsanomali: samma faktum lagrat i flera rader måste uppdateras på flera ställen, med risk för inkonsekvens. Raderingsanomali: att radera en entitet förstör information om en annan entitet.",
      "Funktionellt beroende: givet relation R funktionellt bestämmer X ett attribut Y om och endast om varje X-värde i R är associerat med precis ett Y-värde i R. Skrivs X → Y.",
      "Kandidatnyckeln är den minimala attributuppsättning som funktionellt bestämmer alla övriga attribut. Den härleds ur de funktionella beroendena.",
      "Äkta delmängd (proper subset) av {A,B} är en delmängd som inte är lika med {A,B} — både A och B är äkta delmängder.",
      "Transitivt beroende: X → Z indirekt, i kraft av X → Y och Y → Z, där det INTE gäller att Y → X.",
      "1NF: en relation är i första normalformen om värdena i varje attribut är atomära.",
      "2NF: en relation är i 2NF om och endast om den är i 1NF och inget icke-primärattribut är funktionellt beroende av någon äkta delmängd av någon kandidatnyckel i relationen.",
      "3NF: en relation är i 3NF om och endast om den är i 2NF och varje icke-primärattribut är icke-transitivt beroende av varje kandidatnyckel i relationen.",
      "Normalformerna bygger på varandra — 3NF förutsätter 2NF, som förutsätter 1NF. Högre normalform betyder mindre redundans och mindre risk för anomalier.",
      "En relation i 1NF med en ENKEL kandidatnyckel är automatiskt i 2NF, eftersom en enkel nyckel inte har några äkta delmängder.",
      "Arbetsgång: bestäm kandidatnycklarna → lista primär- och icke-primärattribut → testa 2NF (partiella beroenden) → testa 3NF (transitiva beroenden).",
      "Normalisering sker genom dekomposition: bryt ned relationen i mindre relationer som uppfyller den önskade normalformen. Transformationsreglerna producerar redan relationer i 3NF — de är normaliseringsteorins resultat i praktisk form.",
      "Lossless join: originalrelationen måste kunna återskapas exakt genom join av delrelationerna, utan spurious tuples. Icke-förhandlingsbart krav.",
      "Dependency preservation: alla funktionella beroenden ska kunna kontrolleras inom en enskild delrelation utan join. Önskvärt men inte alltid möjligt samtidigt som 3NF."
    ],
    pitfalls: [
      "2NF-definitionen säger 'någon äkta delmängd av NÅGON kandidatnyckel' — flera kandidatnycklar måste alla prövas.",
      "3NF-definitionen säger 'VARJE kandidatnyckel'. Nöj dig inte med att testa mot primärnyckeln.",
      "Ett beroende Y → Z är inte transitivt om även Y → X gäller, eftersom Y då själv är kandidatnyckel.",
      "Lär definitionerna ordagrant — omskrivningar i egna ord tappar nästan alltid en kvantifierare."
    ]
  },
  {
    id: "fysisk",
    name: "Fysisk design: DDL, constraints och kodstandard",
    chapter: "kap8",
    examWeight: "medel",
    summary: "Den logiska modellen blir körbar SQL. Här införs surrogatnycklar, datatyper väljs och affärsregler flyttas in i databasen som namngivna constraints enligt kursens kodstandard.",
    keyPoints: [
      "DDL (Data Definition Language) definierar strukturer: CREATE, ALTER, DROP. DML (Data Manipulation Language) hanterar data: SELECT, INSERT, UPDATE, DELETE.",
      "Fem constrainttyper: PRIMARY KEY (unik och NOT NULL, en per tabell), FOREIGN KEY (referensintegritet), UNIQUE (unikt men tillåter NULL), CHECK (villkor på värden), DEFAULT (värde när inget anges).",
      "CHECK-constraints är där kapitel 2:s domänbegrepp får sin tekniska motsvarighet.",
      "Namnge alltid constraints. Kursens prefix: PK_, FK_, UQ_, CK_, DF_ följt av tabell och kolumn. Ger begripliga felmeddelanden och något att referera till i ALTER TABLE.",
      "Surrogatnyckel skapas med IDENTITY(1,1) i SQL Server och AUTOINCREMENT i SQLite. Motiv: nyckelstabilitet och prestanda vid join och indexering.",
      "Priset för surrogatnycklar: raden går inte att identifiera meningsfullt utan uppslag, och den naturliga nyckeln måste behållas som UNIQUE för att affärsregeln inte ska förloras.",
      "Datatyper i SQL Server: INT/BIGINT för heltal, DECIMAL(p,s) för exakta decimaltal och belopp (aldrig FLOAT till pengar), VARCHAR(n)/NVARCHAR(n) för text där N klarar unicode, CHAR(n) för fast längd, DATE/DATETIME/DATETIME2 för tid, BIT för booleskt.",
      "Kodstandard v2.0: tabellnamn i PascalCase och singular (Employee, inte employees), kolumnnamn i PascalCase ofta med tabellprefix, camelCase för Java-variabler och metoder, PascalCase för Java-klasser, SCREAMING_SNAKE_CASE för miljövariabler.",
      "Inga hemligheter i repot — anslutningsuppgifter och lösenord i miljövariabler eller konfiguration utanför versionshanteringen. Detta prövas i databasprojektet."
    ],
    pitfalls: [
      "UNIQUE tillåter NULL, PRIMARY KEY gör det inte.",
      "FLOAT till penningbelopp ger avrundningsfel — DECIMAL är rätt val.",
      "Tabellnamn ska vara singular enligt kursens standard."
    ]
  }
];
```

# INNEHÅLL C — Ordlista (`glossary` i `reading.js`)

```js
export const glossary = [
  { term: "1NF (första normalformen)", definition: "En relation är i första normalformen om värdena i varje attribut är atomära.", chapter: "kap7" },
  { term: "2NF (andra normalformen)", definition: "En relation är i 2NF om och endast om den är i 1NF och inget icke-primärattribut är funktionellt beroende av någon äkta delmängd av någon kandidatnyckel i relationen.", chapter: "kap7" },
  { term: "3NF (tredje normalformen)", definition: "En relation är i 3NF om och endast om den är i 2NF och varje icke-primärattribut är icke-transitivt beroende av varje kandidatnyckel i relationen.", chapter: "kap7" },
  { term: "Atomärt värde", definition: "Ett odelbart värde i en cell. Kravet på atomära värden är både en av relationens egenskaper och innehållet i 1NF.", chapter: "kap2" },
  { term: "Attribut (attribute)", definition: "Formellt: ett namn parat med en domän. Informellt en kolumn eller ett fält.", chapter: "kap2" },
  { term: "AUTOINCREMENT", definition: "SQLites sätt att generera surrogatnyckelvärden. Motsvarar IDENTITY(1,1) i SQL Server.", chapter: "kap8" },
  { term: "Binär relation", definition: "En relation mellan två entitetstyper, med namn och multipliciteter på båda sidor. Förekommer som 1:1, 1:M och M:N.", chapter: "kap5" },
  { term: "CHECK-constraint", definition: "Villkor på tillåtna värden i en kolumn, t.ex. CHECK (EmpSalary >= 0). Domänbegreppets tekniska motsvarighet.", chapter: "kap8" },
  { term: "Chen-notation", definition: "ER-notation där entiteter ritas som rektanglar, relationer som romber och attribut som ellipser, med understrykning för identifierare.", chapter: "kap4" },
  { term: "Crow's foot-notation", definition: "Alternativ ER-notation där multipliciteter markeras med symboler vid linjeändarna. Används i kursen jämte Chen.", chapter: "kap4" },
  { term: "DDL (Data Definition Language)", definition: "Den del av SQL som definierar strukturer: CREATE, ALTER, DROP.", chapter: "kap8" },
  { term: "Dekomposition", definition: "Att bryta ned en relation i mindre relationer som uppfyller en önskad normalform.", chapter: "kap7" },
  { term: "Dependency preservation", definition: "Att alla funktionella beroenden i originalrelationen kan kontrolleras inom en enskild delrelation, utan join. Önskvärt men inte alltid möjligt samtidigt som 3NF.", chapter: "kap7" },
  { term: "DML (Data Manipulation Language)", definition: "Den del av SQL som hanterar data: SELECT, INSERT, UPDATE, DELETE.", chapter: "kap8" },
  { term: "Domän (domain)", definition: "Alla värden som ett dataelement kan innehålla. Snävare än datatyp och bär affärsregeln.", chapter: "kap2" },
  { term: "Entitetstyp (entity type)", definition: "En mängd saker med samma egenskaper som identifieras av en användare eller organisation som havande självständig existens.", chapter: "kap4" },
  { term: "ER-modellering", definition: "Konstruktion av ER-diagram för att fånga verksamhetens krav på persistent datalagring, som underlag för design av relationsdatabaser.", chapter: "kap4" },
  { term: "Främmande nyckel (foreign key)", definition: "Ett attribut som refererar till primärnyckeln i en annan eller samma relation, och därmed upprätthåller referensintegritet.", chapter: "kap3" },
  { term: "Funktionellt beroende", definition: "X bestämmer funktionellt Y om och endast om varje X-värde i relationen är associerat med precis ett Y-värde. Skrivs X → Y.", chapter: "kap7" },
  { term: "Grad (degree)", definition: "Antalet attribut i en relation.", chapter: "kap2" },
  { term: "Härlett attribut (derived)", definition: "Attribut vars värde kan beräknas ur ett annat, t.ex. Age ur DateOfBirth. Ritas streckat och lagras normalt inte.", chapter: "kap4" },
  { term: "Icke-primärattribut (non-prime)", definition: "Ett attribut som inte är medlem i någon kandidatnyckel.", chapter: "kap3" },
  { term: "IDENTITY(1,1)", definition: "SQL Servers sätt att generera surrogatnyckelvärden automatiskt.", chapter: "kap8" },
  { term: "Kandidatnyckel (candidate key)", definition: "Ett attribut eller en uppsättning attribut som kan användas för att unikt identifiera vilken tupel som helst i en relation. En relation kan ha flera.", chapter: "kap3" },
  { term: "Kardinalitet (cardinality)", definition: "Antalet tupler i en relation. Ordet används också löst om relationers multipliciteter.", chapter: "kap2" },
  { term: "Kodstandard", definition: "Kursens namngivningsregler: PascalCase och singular för tabeller, PascalCase för kolumner, constraintprefixen PK_, FK_, UQ_, CK_, DF_, camelCase för Java-variabler.", chapter: "kap8" },
  { term: "Konceptuell databasdesign", definition: "Första steget i designprocessen: verksamhetskraven blir ett ER-diagram.", chapter: "kap1" },
  { term: "Logisk databasdesign", definition: "Andra steget: den konceptuella modellen transformeras till relationer i textform och normaliseras om nödvändigt.", chapter: "kap1" },
  { term: "Lossless join", definition: "Att originalrelationen kan återskapas exakt genom join av delrelationerna, utan spurious tuples. Icke-förhandlingsbart krav på en dekomposition.", chapter: "kap7" },
  { term: "Mandatory participation", definition: "Obligatoriskt deltagande i en relation, markerat med dubbla linjer i Chen-notation.", chapter: "kap5" },
  { term: "M:N-relation", definition: "Många-till-många-relation. Transformeras till en ny relation med sammansatt primärnyckel bestående av båda entiteternas primärnycklar. Skrivs M:N, aldrig M:M.", chapter: "kap5" },
  { term: "Multiplicitet", definition: "Anger hur många instanser av en entitet som kan delta i en relation. Kallas även kardinalitet.", chapter: "kap5" },
  { term: "Naturlig nyckel", definition: "Nyckel med affärsbetydelse, t.ex. anställningsnummer eller ISBN. Motsats till surrogatnyckel.", chapter: "kap3" },
  { term: "NoSQL", definition: "Dokumentorienterade databaser, ett alternativ till relationsdatabaser för persistent lagring.", chapter: "kap1" },
  { term: "Partiell identifierare (partial key)", definition: "En svag entitets egen identifierare, unik bara i kombination med ägarens nyckel. Markeras med streckad understrykning.", chapter: "kap5" },
  { term: "Partiellt beroende", definition: "Ett icke-primärattribut som beror på en äkta delmängd av en kandidatnyckel. Bryter mot 2NF och kan bara uppstå vid sammansatt nyckel.", chapter: "kap7" },
  { term: "Persistent lagring", definition: "Lagring som överlever att programmet stängs: filer, kalkylblad, RDBMS, NoSQL. Motsats till volatil lagring i RAM.", chapter: "kap1" },
  { term: "Primärattribut (prime)", definition: "Ett attribut som är medlem i någon kandidatnyckel.", chapter: "kap3" },
  { term: "Primärnyckel (primary key)", definition: "Ett specifikt val av attribut som unikt identifierar en tupel i en relation. Bör vara stabil, minimal och semantiskt meningsfull.", chapter: "kap3" },
  { term: "RDBMS", definition: "Relational Database Management System. Lagrar data i tabeller och frågas med SQL. Kursens system är Microsoft SQL Server.", chapter: "kap1" },
  { term: "Referensintegritet", definition: "Att främmande nycklar alltid pekar på existerande rader. Databasen vägrar operationer som skulle bryta det.", chapter: "kap3" },
  { term: "Relation", definition: "Formellt en mängd tupler där varje element tillhör en domän. Visuellt en tabell. Bygger på mängdlära och första ordningens logik.", chapter: "kap2" },
  { term: "Relationsattribut", definition: "Attribut som representerar data som uppstår som en följd av en relation, t.ex. betyg på en kurs. Ingår inte i primärnyckeln vid M:N-transformation.", chapter: "kap5" },
  { term: "Rollnamn", definition: "Namn per riktning i en unär relation, t.ex. mentors och is_mentored.", chapter: "kap5" },
  { term: "Sammansatt attribut (composite)", definition: "Attribut som består av flera delattribut, t.ex. Name av FirstName och LastName. Följer inte självt med till relationen vid transformation.", chapter: "kap4" },
  { term: "Sammansatt nyckel (composite key)", definition: "Flera attribut som tillsammans identifierar en tupel unikt utan att göra det var för sig.", chapter: "kap3" },
  { term: "Server", definition: "I praktiken en dator som aldrig stängs av, och som betjänar klienter med data ur en databas.", chapter: "kap1" },
  { term: "Spurious tuples", definition: "Rader som uppstår vid join men inte fanns i originalrelationen. Tecken på att en dekomposition inte är lossless.", chapter: "kap7" },
  { term: "SQL (Structured Query Language)", definition: "Språket för att skapa, läsa, uppdatera och radera data samt administrera relationsdatabaser.", chapter: "kap1" },
  { term: "Surrogatnyckel", definition: "Artificiellt, databasgenererat nyckelvärde utan affärsbetydelse. Införs i fysisk design av skäl som nyckelstabilitet och prestanda.", chapter: "kap3" },
  { term: "Svag entitetstyp (weak entity)", definition: "Entitet som inte kan identifieras av sina egna attribut ensamma utan behöver ägarentitetens nyckel. Ritas med dubbel ram.", chapter: "kap5" },
  { term: "Svag relationstyp (weak relationship)", definition: "Relationen mellan en svag entitet och dess ägarentitet. Ritas med dubbel romb.", chapter: "kap5" },
  { term: "Ternär relation", definition: "Relation som kopplar tre entitetstyper samtidigt. Kan inte ersättas av tre binära M:N-relationer utan att information förloras.", chapter: "kap5" },
  { term: "Transitivt beroende", definition: "Ett funktionellt beroende där X → Z indirekt, i kraft av X → Y och Y → Z, och där det inte gäller att Y → X. Bryter mot 3NF.", chapter: "kap7" },
  { term: "Tupel (tuple)", definition: "Formellt en mängd attributvärden där inga två skilda element har samma attributnamn. Informellt en rad eller post.", chapter: "kap2" },
  { term: "Unär relation (rekursiv)", definition: "Relation som kopplar en entitetstyp till sig själv, ofta med rollnamn per riktning.", chapter: "kap5" },
  { term: "UNIQUE-constraint", definition: "Kräver unika värden men tillåter NULL. Här hamnar naturliga nycklar när en surrogatnyckel tagit primärnyckelrollen.", chapter: "kap8" },
  { term: "Uppdateringsanomali", definition: "Att samma faktum lagras i flera rader så att en ändring måste göras på flera ställen, med risk för inkonsekvens.", chapter: "kap7" },
  { term: "Flervärdesattribut (multivalued)", definition: "Attribut som kan ha flera värden för samma entitetsinstans. Ritas med dubbel ellips och transformeras till en egen relation.", chapter: "kap4" },
  { term: "Fysisk databasdesign", definition: "Tredje steget: den logiska modellen implementeras som DDL-satser, med surrogatnycklar, datatyper och constraints.", chapter: "kap1" },
  { term: "Raderingsanomali", definition: "Att radering av information om en entitet leder till att information om en separat entitet förloras.", chapter: "kap7" },
  { term: "Äkta delmängd (proper subset)", definition: "En delmängd av en mängd som inte är lika med mängden själv. Både A och B är äkta delmängder av {A,B}.", chapter: "kap7" },
  { term: "1:M-relation", definition: "Ett-till-många-relation. Transformeras genom att ett-sidans primärnyckel läggs som främmande nyckel i många-sidans relation.", chapter: "kap5" },
  { term: "1:1-relation", definition: "Ett-till-ett-relation. Transformationen beror på deltagandet: från frivillig till obligatorisk sida, valfri riktning när båda är frivilliga, och möjlig sammanslagning när båda är obligatoriska.", chapter: "kap5" }
];
```

## Regler för innehållet

- Normalformernas och nyckelbegreppens definitioner är kursens egna formuleringar. **Skriv inte om dem** — de kan prövas ordagrant.
- De engelska facktermerna i parentes ska behållas. Tentan är på engelska.
- Uppfinn inget innehåll. Saknas något du tycker borde finnas, flagga det i stället.

## Acceptanskriterier

- [ ] `npm run build` går igenom; inga konsolfel.
- [ ] Databaser har vyerna Läs, SQL, Öva, Prov och Statistik enligt manifestet. `questions.js` finns med en tom array, och Öva och Prov visar tomläge utan att krascha.
- [ ] Läs-vyn för Databaser fungerar med samma kod som för Strategi: tre segment, gemensam sökning, läsprogress, korsreferenser.
- [ ] Alla åtta kapitel har fullständig löptext; alla 8 ämneskort och alla 64 ordlisteposter finns.
- [ ] `keyPoints` och `pitfalls` förekommer bara i `topics.js` — kapitlen har inga egna kopior.
- [ ] Kapitelavsluten renderas ur `primaryTopics` enligt tabellen: kapitel 5 visar relationstyper men inte er, kapitel 6 visar transformation men inte nycklar, kapitel 8 visar fysisk men inte nycklar.
- [ ] "Öva på detta kapitel" fungerar inte förrän frågebanken finns — knappen ska då vara dold eller inaktiverad med förklaring, inte trasig.
- [ ] Läsprogressen är skild per delkurs: markera kapitel i Databaser och kontrollera att Strategis progress är oförändrad (`sysb23:read:databaser:*` respektive `sysb23:read:strategi:*`).
- [ ] Statistik visar lästa kapitel för Databaser jämte SQL-övningarna.
- [ ] Kodblocken i kapitel 6 och 8 renderas som kodblock, inte som brödtext. Tabellen i kapitel 2 renderas som tabell.
- [ ] Schemats "Plugga till denna tenta" för Databaser landar nu i Läs, inte SQL, eftersom `las` står först i `views`.
- [ ] Mobilvänligt, all UI-text på svenska, inga nya färger.

Bygg klart, läs igenom kapitel 6 och 7 i webbläsaren (de har mest kod och formler), verifiera mot listan och sammanfatta sedan kort.
