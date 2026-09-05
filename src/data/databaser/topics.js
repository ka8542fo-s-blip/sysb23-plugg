export const topics = [
  {
    id: "grunder",
    name: "Databaser, servrar och designprocessen",
    chapter: "kap1",
    examWeight: "medel",
    summary: "En databas är en strukturerad samling data som lagras och nås elektroniskt. Applikationer som LADOK och TimeEdit är inte databaser — de kommunicerar med databaser via en server. Designprocessen går i tre steg: konceptuell design (ER-modellering), logisk design (transformation och normalisering) och fysisk design (DDL-kod).",
    keyPoints: [
      "Designprocessens tre steg: konceptuell design (ER-diagram) → logisk design (relationer i textform + normalisering) → fysisk design (CREATE TABLE-satser). SQL kommer sist — modellen ska vara genomtänkt innan koden skrivs.",
      "Utgångspunkten: verksamhetskraven. Frågan som styr urvalet är vad verksamheten behöver lagra data om för att fungera — processer, kvalitetssäkring, regelefterlevnad, intern rapportering. Databasadministratören bestämmer inte ensam; verksamhetssidan konsulteras alltid.",
      "Lagring: volatil lagring (RAM, t.ex. en Java-ArrayList) försvinner när programmet stängs; persistent lagring är filer, kalkylblad, RDBMS eller dokumentorienterade databaser (NoSQL).",
      "RDBMS: Relational Database Management System — lagrar data i tabeller och frågas med SQL.",
      "Kursens miljö: SQL Server på en virtuell maskin i Microsoft Azure, ansluten från VS Code via mssql-tillägget, kod i GitHub. En server är i praktiken en dator som aldrig stängs av."
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
      "Relation: en mängd tupler där varje element tillhör en domän. Attribut: ett namn parat med en domän. Tupel: en mängd attributvärden där inga två skilda element har samma attributnamn.",
      "Domän (domain): alla värden ett dataelement kan innehålla. Den bär affärsregeln (t.ex. lön 10 000–30 000) och är inte samma sak som en datatyp.",
      "Grad och kardinalitet: grad (degree) = antalet attribut, kardinalitet (cardinality) = antalet tupler.",
      "Tre terminologilager: relation/tabell/fil, attribut/kolumn/fält, tupel/rad/post — på engelska relation/table/file, attribute/column/field, tuple/row/post.",
      "Relationens sju egenskaper: unikt namn; atomära värden i varje cell; distinkta attributnamn; samma datatyp och domän inom ett attribut; attributens ordning saknar betydelse; tuplernas ordning saknar betydelse; inga dubblettupler.",
      "Två konsekvenser: tuplernas fria ordning är skälet till att en SQL-fråga utan ORDER BY inte har garanterad radordning, och kravet på atomära värden är samma krav som 1NF — en tabell som bryter mot det är strikt sett inte en relation."
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
      "Kandidatnyckel (candidate key): ett attribut eller en uppsättning attribut som kan användas för att unikt identifiera vilken tupel som helst i en relation. En relation kan ha flera. Är nyckeln sammansatt (composite key) är attributen unika tillsammans, inte var för sig, och alla stryks under.",
      "Primärnyckel (primary key): den kandidatnyckel arkitekten väljer — stabil, minimal och semantiskt meningsfull. Skillnaden mot kandidatnyckel är just valet.",
      "Primärattribut (prime): medlem i NÅGON kandidatnyckel. Icke-primärattribut (non-prime): medlem i ingen. Har relationen flera kandidatnycklar räknas attribut ur alla som primära.",
      "Främmande nyckel (foreign key): refererar primärnyckeln i en annan eller samma relation (den refererade kallas parent, referenced eller master). Den upprätthåller referensintegritet: databasen vägrar rader som pekar på något som inte finns och vägrar radera det som fortfarande refereras. NULL tillåts när deltagandet är frivilligt, NOT NULL när det är obligatoriskt.",
      "Naturlig och surrogatnyckel: en naturlig nyckel har affärsbetydelse (anställningsnummer, ISBN), en surrogatnyckel är artificiell och databasgenererad. Surrogatnycklar hör till FYSISK design — logisk design använder ER-modellens naturliga identifierare för att bevara semantiken. Motiven är nyckelstabilitet och prestanda.",
      "Mönstret i praktiken: surrogatnyckel som PRIMARY KEY plus naturlig nyckel som UNIQUE — som EmployeeID och EmpNo i hospital-databasen."
    ],
    pitfalls: [
      "'Någon kandidatnyckel' i definitionen av primärattribut betyder att attribut ur flera kandidatnycklar alla räknas som primära.",
      "Att införa surrogatnycklar redan i logisk design är fel enligt kursens designprocess.",
      "Tas den naturliga nyckeln bort när surrogatnyckeln införs förloras affärsregeln om unikhet."
    ]
  },
  {
    id: "metamodell",
    name: "Metamodell, modell och representation",
    chapter: "kap4",
    examWeight: "hög",
    summary: "En metamodell säger vad en modell får uttrycka, modellen är fakta om en viss verklighet, och ett diagram är bara en av flera representationer av modellen. För ER: metamodell → modell → diagram → population. Entiteter och relationer finns på tre nivåer — typ, mängd och instans.",
    keyPoints: [
      "Tre begrepp: metamodellen är vokabulären (Line, Stop, Line has stops) och säger vad en modell får uttrycka; modellen är fakta om en viss verklighet (Central Line, Stop A, Stop B); en representation visar modellen — som text, XML eller diagram. Ingen representation är modellen, och Central Line tillhör modellen, inte metamodellen.",
      "Diagram: en grafisk representation som använder en notation, inte en annan modell. Placeringen på pappret är bara schematisk. Lägger man till Stop C ändras modellen (två nya fakta), inte metamodellen.",
      "Fyra lager för ER: metamodell (EntityType, Attribute, RelationshipType, Participation/Role, CardinalityConstraint) → modell (Employee : EntityType, WorksOn : RelationshipType) → diagram (rektanglar, romb, linjer) → population (Mary : Employee, Atlas : Project, Mary WorksOn Atlas). Metamodellen definierar språket, diagrammet representerar modellen, populationen instansierar modellens typer.",
      "Metamodellens regler: ett deltagande tillhör en relationstyp och refererar en entitetstyp; en relationstyp har två eller flera deltaganden; ett kardinalitetsvillkor har minimum och maximum; varje attribut ägs av antingen en entitetstyp eller en relationstyp, aldrig båda.",
      "Ingen universell ERD-standard: ER-kärnan är gemensam men notation och metod varierar — därför ser diagram olika ut i olika böcker och verktyg. Chens förslag (VLDB 1975, ACM TODS 1976) var två skilda saker: en datamodell (begreppen) och en diagramteknik (ritsättet).",
      "Tre nivåer, för både entiteter och relationer: typ = definitionen, det du ritar; mängd (set) = populationen vid en viss tidpunkt, kan växa, krympa eller vara tom; instans = en enskild förekomst, ritas aldrig. OOP-analogin (typ ≈ klass, mängd ≈ alla objekt just nu, instans ≈ objekt) gäller strukturen, inte paradigmet — ER har inga metoder, inget arv, och relationer är inte associationer.",
      "Konceptuell modell är inte relationsschema: den säger att anställda kan arbeta på projekt men bestämmer inga tabeller, kolumner, främmande nycklar eller datatyper — och den kan uttrycka regler schemat inte kan tvinga fram, som ett minimideltagande."
    ],
    pitfalls: [
      "Diagrammet är inte modellen — samma modell kan ritas på flera sätt, och ett annat ritsätt är inte en annan modell.",
      "Instanser ritas aldrig i ett ER-diagram; det som ritas är typerna.",
      "OOP-analogin förklarar nivåerna, inte beteendet: ER-relationer är inte associationer och entitetstyper har inget arv."
    ]
  },
  {
    id: "er",
    name: "Entiteter, attribut och identifierare",
    chapter: "kap4",
    examWeight: "hög",
    summary: "En entitet är en sak som kan skiljas från alla andra (Chen), och en entitetstyp grupperar entiteter med gemensamma egenskaper — en ändamålsbestämd abstraktion, inte en fullständig beskrivning. Attribut bär fem oberoende modelleringsbeslut, värdemängder dokumenteras utanför diagrammet, och en identifierare är en regel på modellnivå.",
    keyPoints: [
      "Entitet (Chen 1976): an entity is a 'thing' which can be distinctly identified — modellen kan skilja den från alla andra. Den är en informationsabstraktion: bara det verksamhetens processer behöver tas med; längd och vikt lämnas utanför Employee.",
      "Entitetstyp: rektangel, substantiv i singular, grupperar entiteter med relevanta gemensamma egenskaper. Stark entitetstyp identifierar varje entitet utan att bero på en entitet av annan typ — enkel rektangel.",
      "Attribut: en namngiven egenskap hos instanserna av en entitetstyp eller en relationstyp. Ovalens koppling visar ägaren — assignmentStartDate ägs av WorksOn, inte av Employee eller Project.",
      "Enkelt eller sammansatt: enkelt (simple) är odelbart för modellens syfte (name); sammansatt (composite) har meningsfulla delattribut (address av streetName, streetNumber, postalCode, city).",
      "Ett värde eller flera: envärt (single-valued) har högst ett värde åt gången, vanlig oval (workEmail); flervärdes (multivalued) flera samtidigt, dubbel oval (phoneNumber). Antalet värden är ett modelleringsbeslut. Som flervärdesattribut kan två anställda dela adress; som egen entitet i 1:N kan de inte.",
      "Obligatoriskt eller frivilligt: title måste finnas, description får saknas — båda ritas med vanlig oval, Chen saknar symbol. Skriv ut villkoret explicit.",
      "Lagrat eller härlett: lagrat (stored) är ett grundfaktum (hireDate); härlett (derived) kan beräknas, ritas streckat (yearsEmployed) och kan bero på relationer (numberOfEmployees via WorksOn). Härlett är ett begreppsligt beroende, inte en lagringsstrategi.",
      "Value set (domain): tillåtna värden och deras tolkning — employmentStatus ∈ {active, leave, ended}. Ovalen namnger bara attributet; domänen dokumenteras separat, som typ, intervall, format eller regel. Fem frågor per attribut: vem äger det, går det att dela upp, hur många värden, lagrat eller härlett, vilken värdemängd.",
      "Identifierare: ett attribute, eller en kombination av attributes, vars värden unikt skiljer varje entity i ett entity set. Regeln måste hålla för varje giltig population — att data råkar vara unik räcker inte. Understryks. Sammansatt identifierare: stryk under föräldern (projectNo), inte delarna. Flera identifierare (employeeNo, workEmail): separata understrykningar, inte en kombinerad."
    ],
    pitfalls: [
      "Härledda attribut lagras normalt inte — de beräknas, just för att lagrade härledda värden riskerar att bli inkonsekventa.",
      "Ett sammansatt attribut självt följer inte med till relationen vid transformation — bara dess atomära delattribut.",
      "Att data råkar vara unik just nu gör den inte till en identifierare; regeln gäller varje giltig population.",
      "Två separata understrykningar är två identifierare — inte en sammansatt. Den sammansatta stryks under som helhet.",
      "Ovalen namnger bara attributet. Värdemängden och obligatoriskt/frivilligt syns inte i Chen-diagrammet — de dokumenteras utanför."
    ]
  },
  {
    id: "relationstyper",
    name: "Relationer, kardinalitet och deltagande",
    chapter: "kap5",
    examWeight: "hög",
    summary: "En binär relationstyp har exakt två deltagande roller och finns på tre nivåer: typ, mängd och instans, där en instans är en tupel ⟨e1, p1⟩. Kardinalitet och deltagande är oberoende: ratio-etiketterna anger bara maxima och läses tvärs över, deltagandelinjerna läses vid sin egen ände. Kursens standard är ratio-etiketter plus linjer; min–max-tupler är alternativet.",
    keyPoints: [
      "Binär relationstyp: exakt två deltagande roller — romb för relationstypen, rektanglar för entitetstyperna. Employee — WorksOn — Project med rollerna worker och project.",
      "Tre nivåer: relationstyp (det du ritar), relationsmängd (alla instanser vid tid t, kan ändras utan att typen ändras) och relationsinstans — en entitet per deltagande roll, r1 = ⟨e1, p1⟩, en tupel där rollordningen spelar roll.",
      "Deltaganderoll (participant role): namnger ett deltagande. Nödvändig när samma entitetstyp deltar mer än en gång i samma relationstyp — annars är ändarna tvetydiga.",
      "Relationsattribut: ägs av relationstypen eftersom det beskriver paret — allocationPercentage mappar r1 = ⟨e1, p1⟩ till 60 %. Ownership follows meaning. Vanligast på M:N, möjligt även på 1:N och 1:1.",
      "Kardinalitet och deltagande är oberoende: maximal kardinalitet svarar på hur många entiteter i andra änden en fixerad entitet får ha (ratio-etiketterna 1, M, N); deltagande svarar på om en entitet får finnas utan att delta (enkel eller dubbel linje). Ingen av dem bestämmer den andra.",
      "Ratio-etiketter läses tvärs över: 1 bredvid Employee betyder att varje Project får ha högst en Employee, N bredvid Project att varje Employee får ha många Projects. De anger endast maxima — 1 betyder högst en, inte exakt en. M och N betyder båda 'många'; 1:M i äldre material är samma sak som 1:N.",
      "Deltagandelinjer läses vid sin egen ände: enkel linje = partial participation (får delta noll gånger), dubbel = total participation (deltar minst en gång). 'Exakt en' = 1 tvärs över plus dubbel linje. Frågan är 'vilken entitet måste delta?' — kravtextens måste/kan/får avgör, och alla tre deltagandekombinationerna är möjliga för alla tre mönstren.",
      "De tre mönstren: 1:1 ResponsibleFor — en anställd ansvarar för noll eller ett projekt, varje projekt har exakt en ansvarig; 1:N Leads — en anställd leder noll, ett eller många projekt, varje projekt leds av exakt en; M:N WorksOn — en anställd arbetar på noll, ett eller många projekt, varje projekt har en eller flera anställda. Flera relationstyper kan finnas mellan samma entitetstyper, var och en med egen relationsmängd.",
      "Min–max-notation: tupler (0,N), (1,1) som läses vid sin egen entitet, med enkla linjer genomgående; N tvärs över + enkel linje ⟷ (0,N), 1 tvärs över + dubbel linje ⟷ (1,1). Kursens standard är ratio-etiketter plus linjer — blanda aldrig konventionerna i samma diagram.",
      "Unär (rekursiv) relation: en deltagande entitetstyp, grad ett, rollnamn per deltagande (supervisor / report i Supervises), tupelordning ⟨supervisor, report⟩. Varje roll har egen kardinalitet läst tvärs över: N vid report = många underställda per handledare, 1 vid supervisor = högst en handledare. Ratiot tillåter ändå self-links och cykler — basic Chen saknar symbol för sådana regler, de blir textuella verksamhetsregler i constraints, triggers eller applikationskod.",
      "Grad och ternär relation: grad = antalet deltagande entitetstyper, metamodellen tillåter två eller flera. En ternär relation (grad tre) kan inte ersättas av tre binära M:N — då förloras informationen om vilken trippel som hör samman."
    ],
    pitfalls: [
      "Ratio-etiketten 1 betyder högst en. 'Exakt en' kräver dessutom dubbel linje.",
      "Läs ratio tvärs över och deltagande vid egen ände — att blanda läsriktningarna är den vanligaste felläsningen.",
      "Total participation glöms oftast bort. Läs kravtexten mening för mening och sätt dubbla linjer där det står 'måste'.",
      "Blanda aldrig min–max-tupler med dubbellinjer i samma diagram.",
      "Tre binära M:N-relationer är inte samma sak som en ternär relation."
    ]
  },
  {
    id: "svaga",
    name: "Svaga och associativa entiteter",
    chapter: "svaga",
    examWeight: "hög",
    summary: "En svag entitetstyp identifieras bara tillsammans med sin ägare — ProjectTask av projectNo + taskNo — och markeras med dubbel rektangel, dubbel romb och streckad understrykning. Svaghet kräver identitetsberoende, inte bara total participation, och ägaren syns inte i multipliciteterna. Reifiering gör en relation till en entitet när paret behöver egen identitet.",
    keyPoints: [
      "Svag entitet: fortfarande en entitet i Chens mening — den kan skiljas från alla andra, men bara med hjälp av ägaren. Project — Contains — ProjectTask (1:N): Project är stark ägare med egen identifierare och kan finnas utan uppgifter; ProjectTask är svag men identifierbar och har ingen självständig existens.",
      "Partiell identifierare: taskNo upprepas mellan projekt — (P101, 1) och (P205, 1) — men de kompletta identiteterna är distinkta. taskNo är unik bara inom sin ägare och får streckad understrykning.",
      "Tre markeringar: dubbel rektangel (svag entitetstyp), dubbel romb (identifierande relation, även kallad svag relationstyp), streckad understrykning (partiell identifierare).",
      "Två beroenden: identitetsberoende (den kompletta identiteten inkluderar ägaren) och existensberoende (kan inte finnas utan ägaren). 1 vid ägaren begränsar till ett projekt, dubbellinjen på den svaga sidan gör deltagandet obligatoriskt. En svag entitet kan ha vanliga relationer också (ProjectTask — AssignedTo — Employee); dubbelheten gäller bara den identifierande.",
      "Två tentafällor: total participation gör inte en entitet svag — Project i Leads har exakt en ledare men förblir stark, för projectNo identifierar det; och multipliciteterna avslöjar inte ägaren — Contains och AssignedTo har samma 1:N, det är dubbel romb och dubbel rektangel som pekar ut den identifierande relationen.",
      "Reifiering: behåll relationen när modellen bara beskriver paret — relationsattribut tvingar inte fram något. Reifiera när paret ska refereras till som begrepp, delta i andra relationer eller ha egen identitet eller livscykel: WorksOn blir entitetstypen Assignment med Holds (1:N) till Employee och Concerns (N:1) till Project, attributen följer med, vanliga Chen-konstruktioner utan särskild symbol.",
      "Priset: assignmentNo som identifierare skapar ett verkligt ansvar — organisationen måste tilldela, lagra och bevara ett unikt värde för varje uppdrag. Reifiering är inte gratis."
    ],
    pitfalls: [
      "Dubbellinje räcker inte för svaghet — det krävs att identiteten beror på ägaren.",
      "Leta inte efter ägaren i multipliciteterna; den syns bara i dubbel romb och dubbel rektangel.",
      "Reifiera inte bara för att relationen har attribut — det är ett val i Chen, inte ett tvång."
    ]
  },
  {
    id: "crowsfoot",
    name: "Crow's Foot-notation",
    chapter: "svaga",
    examWeight: "hög",
    summary: "Crow's Foot är en familj av besläktade notationer där relationsnamnet står på linjen och ändsymbolerna cirkel, streck och fork anger optional/required och one/many. Markörerna sitter vid den ändpunkt vars instanser de räknar. Kursen använder den konceptuella common IE-varianten, och notationen kan inte uttrycka allt som Chen kan.",
    keyPoints: [
      "Ursprung och dialekter: Everests inverted arrows 1976, spridning via Information Engineering (Finkelstein, CACI) och James Martin — Crow's Foot, IE-notation och Martin-notation är besläktade varianter, inte en fast syntax. Common IE (cirkel, streck, fork) är kursens; Barker/Oracle kodar may/must med bruten/heldragen halvlinje; vissa verktyg låter linjestilen betyda identifying/non-identifying. Läs alltid legenden.",
      "Entitetsboxen: rubrik med namnet, ID-märkta identifierare, vanliga attribut under avskiljaren; namnkonvention project_no. Samma identifierare som Chens understrykning, bara inuti boxen. Relationsnamnet står på linjen — ingen romb; roller läggs till när läsningen annars är tvetydig; instanser ritas inte.",
      "Fyra ändpunktsmönster: yttre märke cirkel = optional, streck = required; inre märke (närmast boxen) streck = one, fork = many — noll eller en, exakt en, noll eller många, en eller många.",
      "Läsriktning: Chens ratio-etiketter läses tvärs över och deltagandelinjer vid egen ände; Crow's Foot-markörerna sitter vid den ändpunkt vars instanser de räknar. Samma Leads-constraint, två läsriktningar.",
      "Rekursiv relation: samma entitetstyp i båda ändpunkterna, self-line med rollerna supervisor och report. Chens 1 och N blir optional-one och optional-many; enkla linjer blir cirklar.",
      "Svag identitet: vanlig box där två ID-markörer gör project_no och task_no till en sammansatt identifierare — ingen dubbel rektangel, dubbel romb eller streckad understrykning. Flervärdesattribut blir en relaterad entitet i 1:N (PHONE NUMBER).",
      "Attribut på relationer: en Crow's Foot-linje kan inte bära attribut, så M:N med attribut måste bli en associativ entitet — EMPLOYEE — Has — ASSIGNMENT — Is for — PROJECT med assignment_no tillagt som identifierare. Här tvingar notationen fram reifieringen.",
      "Vad som kodas direkt: entity types och vanliga attributes, identifying attributes, binary och unary relationship types, participant roles, de fyra endpoint-kombinationerna. Indirekt eller separat: instances och sets, value sets, multivalued/composite/derived/optional attributes, value domains, weak identity, attributes på relationship types. Kursens konvention: konceptuell IE-variant där en entitet får representera ett par och äga dess attribut."
    ],
    pitfalls: [
      "Samma linjestil betyder olika saker i olika verktyg — tolka aldrig utan legend.",
      "Crow's Foot-markörerna sitter vid den ände de räknar; Chens ratio läses tvärs över. Blanda inte läsriktningarna.",
      "Svag entitet, flervärdes-, härledda och relationsattribut finns inte direkt i Crow's Foot — de måste dokumenteras separat."
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
      "Binär 1:1 beror på deltagandet: ett obligatoriskt och ett frivilligt → lägg den FRIVILLIGA sidans primärnyckel i den OBLIGATORISKA sidans relation (kolumnen blir aldrig NULL); båda frivilliga → valfri riktning, arkitekten väljer; båda obligatoriska utan annan relation mellan entiteterna → kan slås samman till en relation, eller främmande nyckel som vanligt.",
      "Binär M:N: skapa en NY relation med primärnyckelattributen från båda entitetsrelationerna — tillsammans sammansatt primärnyckel, var för sig främmande nycklar. Relationens egna attribut (t.ex. Hours) läggs till som icke-nyckelattribut och ingår INTE i primärnyckeln.",
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
      "Anomalier: uppdateringsanomali — samma faktum lagrat i flera rader måste uppdateras på flera ställen, med risk för inkonsekvens; raderingsanomali — att radera en entitet förstör information om en annan entitet.",
      "Funktionellt beroende: givet relation R funktionellt bestämmer X ett attribut Y om och endast om varje X-värde i R är associerat med precis ett Y-värde i R. Skrivs X → Y.",
      "Kandidatnyckel ur beroendena: den minimala attributuppsättning som funktionellt bestämmer alla övriga attribut.",
      "Hjälpbegrepp: äkta delmängd (proper subset) av {A,B} är en delmängd som inte är lika med {A,B} — både A och B är äkta delmängder. Transitivt beroende: X → Z indirekt, i kraft av X → Y och Y → Z, där det INTE gäller att Y → X.",
      "1NF: en relation är i första normalformen om värdena i varje attribut är atomära.",
      "2NF: en relation är i 2NF om och endast om den är i 1NF och inget icke-primärattribut är funktionellt beroende av någon äkta delmängd av någon kandidatnyckel i relationen.",
      "3NF: en relation är i 3NF om och endast om den är i 2NF och varje icke-primärattribut är icke-transitivt beroende av varje kandidatnyckel i relationen.",
      "Bygger på varandra: 3NF förutsätter 2NF, som förutsätter 1NF. Högre normalform betyder mindre redundans och mindre risk för anomalier.",
      "2NF-genvägen: en relation i 1NF vars kandidatnycklar alla är enkla är automatiskt i 2NF, eftersom en enkel nyckel inte har några äkta delmängder — föreläsningens beslutssteg: är kandidatnyckeln sammansatt? Nej → 2NF kan inte brytas.",
      "Arbetsgång: bestäm kandidatnycklarna → lista primär- och icke-primärattribut → testa 2NF (partiella beroenden) → testa 3NF (transitiva beroenden).",
      "Dekomposition: bryt ned relationen i mindre relationer som uppfyller den önskade normalformen. Transformationsreglerna producerar redan relationer i 3NF — de är normaliseringsteorins resultat i praktisk form.",
      "Lossless join: en naturlig join av delrelationerna ska ge tillbaka originalrelationen. Saknar delrelationerna gemensamt attribut går det inte — då behövs kopplingsrelationen. Icke-förhandlingsbart krav.",
      "Dependency preservation: ett funktionellt beroende är bevarat om dess båda attribut finns i samma relation. Kontrollera beroende för beroende; ett förlorat beroende kan inte upprätthållas med en enkel constraint."
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
    summary: "Den logiska modellen blir körbar SQL. Här införs surrogatnycklar, datatyper väljs och affärsregler flyttas in i databasen som namngivna constraints enligt kursens kodstandard. Facit kräver dessutom NOT NULL på naturliga nycklar och vid totalt deltagande.",
    keyPoints: [
      "DDL och DML: DDL (Data Definition Language) definierar strukturer — CREATE, ALTER, DROP. DML (Data Manipulation Language) hanterar data — SELECT, INSERT, UPDATE, DELETE.",
      "Constrainttyper: PRIMARY KEY (unik och NOT NULL, en per tabell), FOREIGN KEY (referensintegritet), UNIQUE (unikt men tillåter NULL), CHECK (villkor på värden — kapitel 2:s domänbegrepp får här sin tekniska motsvarighet), DEFAULT (värde när inget anges) — och NOT NULL på kolumnen, utan eget namn.",
      "Namnge alltid constraints: kursens prefix PK_, FK_, UQ_, CK_, DF_ följt av tabell och kolumn. Ger begripliga felmeddelanden och något att referera till i ALTER TABLE.",
      "Surrogatnyckel: skapas med IDENTITY(1,1) i SQL Server; motiv nyckelstabilitet och prestanda vid join och indexering. Priset: raden går inte att identifiera meningsfullt utan uppslag, och den naturliga nyckeln måste behållas som UNIQUE och NOT NULL — annars förloras entitetsintegriteten. Surrogatnyckel får tabeller för vanliga och svaga entiteter; kopplingstabeller och flervärdestabeller får ingen egen — primärnyckeln är de två främmande nycklarna respektive ägarens nyckel plus värdet.",
      "NOT NULL på en främmande nyckel: tvingar fram totalt deltagande; får den vara NULL är deltagandet partiellt. Facit kommenterar varje sådan kolumn.",
      "Svag entitet i DDL: egen surrogatnyckel som primärnyckel, ägarens surrogatnyckel som främmande nyckel med NOT NULL, och UNIQUE över partiell nyckel plus ägarens främmande nyckel.",
      "Unär relation i DDL: främmande nyckel mot tabellens egen surrogatnyckel, namngiven efter rollen (AIDR1), NULL tillåtet vid partiellt deltagande. Unär M:N ger en kopplingstabell med två kolumner mot samma tabell.",
      "Datatyper i SQL Server: INT/BIGINT för heltal, DECIMAL(p,s) för exakta decimaltal och belopp (approximativa numeriska typer bara när exakt precision är mindre viktig), VARCHAR(n)/NVARCHAR(n) för text där N klarar unicode, CHAR(n) för fast längd, DATE/DATETIME/DATETIME2 för tid, BIT för booleskt.",
      "Kodstandard v2.0: tabellnamn i PascalCase och singular (Employee, inte employees), kolumnnamn i PascalCase ofta med tabellprefix, camelCase för Java-variabler och metoder, PascalCase för Java-klasser, SCREAMING_SNAKE_CASE för miljövariabler. Inga hemligheter i repot — anslutningsuppgifter och lösenord i miljövariabler eller konfiguration utanför versionshanteringen; det prövas i databasprojektet."
    ],
    pitfalls: [
      "UNIQUE tillåter NULL, PRIMARY KEY gör det inte.",
      "Belopp lagras med en exakt numerisk typ som DECIMAL — approximativa typer ger avrundningsfel.",
      "Tabellnamn ska vara singular enligt kursens standard.",
      "Naturlig nyckel med bara UNIQUE släpper igenom NULL — NOT NULL måste också anges.",
      "Kopplingstabeller får ingen egen surrogatnyckel; primärnyckeln är de två främmande nycklarna."
    ]
  }
];
