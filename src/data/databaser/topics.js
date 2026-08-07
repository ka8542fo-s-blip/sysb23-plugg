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
