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
    id: "metamodell",
    name: "Metamodell, modell och representation",
    chapter: "kap4",
    examWeight: "hög",
    summary: "En metamodell säger vad en modell får uttrycka, modellen är fakta om en viss verklighet, och ett diagram är bara en av flera representationer av modellen. För ER: metamodell → modell → diagram → population. Entiteter och relationer finns på tre nivåer — typ, mängd och instans.",
    keyPoints: [
      "Metamodellen är vokabulären (Line, Stop, Line has stops) och säger vad en modell får uttrycka. Modellen är fakta om en viss verklighet (Central Line, Stop A, Stop B). Central Line tillhör modellen, inte metamodellen.",
      "Samma modell kan representeras som vanlig text, XML eller diagram. Olika syntax, samma modell — ingen av representationerna är modellen.",
      "Ett diagram är en grafisk representation som använder en notation, inte en annan modell. Placeringen på pappret är bara schematisk.",
      "Lägger man till Stop C ändras modellen (två nya fakta) men inte metamodellen. Fyra lager: metamodellen definierar språket, modellen representeras av diagrammet, modellen beskriver den modellerade verkligheten.",
      "ER i fyra lager: metamodell (EntityType, Attribute, RelationshipType, Participation/Role, CardinalityConstraint) → modell (Employee : EntityType, WorksOn : RelationshipType) → diagram (rektanglar, romb, linjer) → population (Mary : Employee, Atlas : Project, Mary WorksOn Atlas). Populationen instansierar modellens typer.",
      "Metamodellens regler: ett deltagande tillhör en relationstyp och refererar en entitetstyp; en relationstyp har två eller flera deltaganden; ett kardinalitetsvillkor har minimum och maximum; varje attribut ägs av antingen en entitetstyp eller en relationstyp, aldrig båda.",
      "Det finns ingen enda universellt antagen ERD-specifikation. ER-kärnan är gemensam, men notation och metod varierar — därför ser diagram olika ut i olika böcker och verktyg.",
      "Chens förslag (VLDB 1975, ACM TODS 1976) hade två delar: ER-datamodellen (begreppen) och en diagramteknik (ritsättet). En modell och ett ritsätt är två skilda saker.",
      "Tre nivåer för både entiteter och relationer: typ = definitionen, det du ritar; mängd (set) = populationen vid en viss tidpunkt, kan växa, krympa eller vara tom; instans = en enskild förekomst, ritas aldrig i diagrammet.",
      "OOP-analogin: entitetstyp ≈ klass, entitetsmängd ≈ alla objekt just nu, entitet ≈ objekt. Gäller strukturen, inte paradigmet — ER har inga metoder, inget arv, och relationer beter sig inte som associationer.",
      "En konceptuell ER-modell är inte ett relationsschema: den säger att anställda kan arbeta på projekt men bestämmer inga tabeller, kolumner, främmande nycklar eller datatyper. Modellen kan uttrycka regler schemat inte kan tvinga fram — främmande nycklar upprätthåller inte ett minimideltagande."
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
      "Chen 1976: an entity is a 'thing' which can be distinctly identified. Distinctly identified betyder att modellen kan skilja entiteten från alla andra.",
      "En entitet är en informationsabstraktion. Filtret är frågan om egenskapen behövs för verksamhetens processer — längd och vikt lämnas utanför Employee för att personaladministrationen inte behöver dem.",
      "Entitetstyp: rektangel, substantiv i singular, grupperar entiteter med relevanta gemensamma egenskaper. Stark entitetstyp identifierar varje entitet utan att bero på en entitet av annan typ — enkel rektangel.",
      "Attribut: en namngiven egenskap som beskriver instanserna av en entitetstyp eller en relationstyp. Ovalens koppling visar vem som äger attributet; assignmentStartDate ägs av WorksOn, inte av Employee eller Project.",
      "Enkelt attribut (simple): odelbart för modellens syfte, som name. Sammansatt (composite): meningsfulla delattribut, som address av streetName, streetNumber, postalCode och city.",
      "Envärt (single-valued): högst ett värde åt gången, vanlig oval (workEmail). Flervärdes (multivalued): flera värden samtidigt, dubbel oval (phoneNumber). Antalet värden är ett modelleringsbeslut.",
      "Obligatoriskt attribut (title) och frivilligt (description) ritas båda med vanlig oval — Chen saknar symbol för skillnaden. Skriv ut villkoret explicit.",
      "Lagrat attribut (stored) är ett grundfaktum (hireDate). Härlett (derived) kan beräknas, ritas streckat (yearsEmployed) och kan bero på relationer (numberOfEmployees via WorksOn). Härlett beskriver ett begreppsligt beroende, inte en lagringsstrategi.",
      "Value set (domain): tillåtna värden och deras tolkning — employmentStatus ∈ {active, leave, ended}. I Chen-diagrammet namnger ovalen bara attributet; domänen dokumenteras separat, som typ, intervall, format eller regel.",
      "Fem frågor om varje attribut: vem äger det, går det att dela upp, hur många värden, lagrat eller härlett, vilken värdemängd. Kompletterande aspekter, inte alternativ.",
      "Identifierare: ett attribute, eller en kombination av attributes, vars värden unikt skiljer varje entity i ett entity set. Regeln måste hålla för varje giltig population — att data råkar vara unik just nu räcker inte. Understryks.",
      "Sammansatt identifierare: understryk den sammansatta föräldern (projectNo), inte delarna (registrationYear, sequenceNo). Identifikationen använder det kompletta värdet.",
      "Flera identifierare: employeeNo och workEmail identifierar var för sig — två separata understrykningar betyder två identifierare, inte en kombinerad.",
      "Flervärdesattribut kontra egen entitet är ett designval med konsekvenser: som flervärdesattribut kan två anställda dela adress, som egen entitet i 1:N kan de inte."
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
      "Binär relationstyp: exakt två deltagande roller. Romb för relationstypen, rektanglar för entitetstyperna. Employee — WorksOn — Project med rollerna worker och project.",
      "Relationsinstans = en entitet per deltagande roll: r1 = ⟨e1, p1⟩, r1 ∈ WorksOn. En tupel där rollordningen spelar roll. Relationsmängd = alla instanser av en relationstyp vid tid t; kan ändras utan att typen ändras.",
      "Deltaganderoll (participant role) namnger ett deltagande. Nödvändig när samma entitetstyp deltar mer än en gång i samma relationstyp — annars är ändarna tvetydiga.",
      "Relationsattribut ägs av relationstypen eftersom de beskriver paret — allocationPercentage mappar r1 = ⟨e1, p1⟩ till 60 %. Ownership follows meaning. Vanligast på M:N men möjligt även på 1:N och 1:1.",
      "Maximal kardinalitet svarar på hur många entiteter i andra änden en fixerad entitet får ha → ratio-etiketterna 1, M, N. Deltagande svarar på om en entitet får finnas utan att delta → enkel eller dubbel linje. Ingen av dem bestämmer den andra.",
      "Ratio-etiketter läses tvärs över: 1 bredvid Employee betyder att varje Project får ha högst en Employee; N bredvid Project att varje Employee får ha många Projects. Etiketterna anger endast maxima — 1 betyder högst en, inte exakt en.",
      "Deltagandelinjer läses vid sin egen ände: enkel linje = partial participation (instansen får delta noll gånger), dubbel linje = total participation (varje instans deltar minst en gång). 'Exakt en' är kombinationen 1 tvärs över plus dubbel linje.",
      "1:1 ResponsibleFor: en anställd ansvarar för noll eller ett projekt, varje projekt har exakt en ansvarig. 1:N Leads: en anställd leder noll, ett eller många projekt, varje projekt leds av exakt en. M:N WorksOn: en anställd arbetar på noll, ett eller många projekt, varje projekt har en eller flera anställda.",
      "M och N betyder båda 'många' — bokstäverna skiljer bara de två positionerna åt, därför skrivs formen M:N. 1:M i äldre material betyder samma sak som 1:N.",
      "Frågan att ställa är 'vilken entitet måste delta?', och kravtextens hjälpverb (måste/kan/får) avgör. Alla tre deltagandekombinationerna är möjliga för alla tre mönstren.",
      "Min–max-notation: tupler (0,N), (1,1) som läses vid sin egen entitet, med enkla linjer genomgående. N tvärs över + enkel linje ⟷ (0,N); 1 tvärs över + dubbel linje ⟷ (1,1). Kursens standard är ratio-etiketter plus linjer; blanda aldrig konventionerna i samma diagram.",
      "Det kan finnas flera relationstyper mellan samma två entitetstyper, t.ex. Leads, ResponsibleFor och WorksOn mellan Employee och Project — var och en med egen relationsmängd.",
      "Unär (rekursiv) relation: en deltagande entitetstyp, grad ett, rollnamn per deltagande (supervisor / report i Supervises). Tupelordning ⟨supervisor, report⟩. Varje roll har egen kardinalitet, läst tvärs över: N vid report = många underställda per handledare, 1 vid supervisor = högst en handledare.",
      "Ratiot 1:N med enkla linjer tillåter fortfarande self-links (Sam handleder sig själv) och cykler. Basic Chen saknar symbol för sådana regler — de blir textuella verksamhetsregler i constraints, triggers eller applikationskod.",
      "Grad = antalet deltagande entitetstyper; metamodellen tillåter två eller flera. En ternär relation (grad tre) kan inte ersättas av tre binära M:N-relationer — då förloras informationen om vilken trippel som hör samman."
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
      "En svag entitet är fortfarande en entitet i Chens mening — den kan skiljas från alla andra, men bara med hjälp av ägaren.",
      "Project — Contains — ProjectTask (1:N): Project är stark ägare med egen identifierare och kan finnas utan uppgifter; ProjectTask är svag men identifierbar och har ingen självständig existens.",
      "taskNo upprepas mellan projekt — (P101, 1) och (P205, 1) — men de kompletta identiteterna är distinkta. taskNo är partiell identifierare: unik bara inom sin ägare, streckad understrykning.",
      "Tre markeringar: dubbel rektangel (svag entitetstyp), dubbel romb (identifierande relation, även kallad svag relationstyp), streckad understrykning (partiell identifierare).",
      "Två beroenden: identitetsberoende (den kompletta identiteten inkluderar ägaren) och existensberoende (kan inte finnas utan ägaren). 1 vid ägaren begränsar till ett projekt; dubbellinjen på den svaga sidan gör deltagandet obligatoriskt.",
      "Total participation gör inte en entitet svag: Project i Leads har exakt en ledare men förblir stark, för projectNo identifierar det. Svaghet kräver identitetsberoende.",
      "Multipliciteterna avslöjar inte ägaren: Contains och AssignedTo har samma 1:N. Det är dubbel romb och dubbel rektangel som pekar ut den identifierande relationen.",
      "Behåll relationen när modellen bara beskriver paret — relationsattribut tvingar inte fram reifiering. Reifiera när paret ska refereras till som begrepp, delta i andra relationer eller ha egen identitet eller livscykel.",
      "Reifiering: WorksOn blir entitetstypen Assignment med Holds (1:N) till Employee och Concerns (N:1) till Project. Attributen följer med. Vanliga Chen-konstruktioner — ingen särskild symbol för associativ entitet.",
      "assignmentNo som identifierare skapar ett verkligt ansvar: organisationen måste tilldela, lagra och bevara ett unikt värde för varje uppdrag. Reifiering är inte gratis.",
      "En svag entitet kan ha vanliga relationer också, t.ex. ProjectTask — AssignedTo — Employee. Dubbelheten gäller bara den identifierande relationen."
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
      "Ursprung: Everests inverted arrows 1976; spridning via Information Engineering (Finkelstein, CACI) och James Martin. Crow's Foot, IE-notation och Martin-notation är besläktade varianter, inte en fast syntax.",
      "Dialekter: common IE (cirkel, streck, fork — kursens variant), Barker/Oracle (bruten/heldragen halvlinje för may/must, ingen cirkel–streck-vokabulär), verktyg där linjestilen betyder identifying/non-identifying. Läs alltid legenden — samma streck betyder olika saker i olika verktyg.",
      "Entitetsboxen: rubrik med namnet, ID-märkta identifierare, vanliga attribut under avskiljaren. Namnkonvention project_no i stället för projectNo. Samma identifierare som Chens understrykning, bara placerad inuti boxen.",
      "Relationsnamnet står på linjen — ingen romb. Deltaganderoller läggs till när läsningen annars är tvetydig. Instanser ritas inte.",
      "Fyra ändpunktsmönster: yttre märke cirkel = optional, streck = required; inre märke (närmast boxen) streck = one, fork = many. Noll eller en, exakt en, noll eller många, en eller många.",
      "Läsriktning: Chens ratio-etiketter läses tvärs över och deltagandelinjer vid egen ände; Crow's Foot-markörerna sitter vid den ändpunkt vars instanser de räknar. Samma Leads-constraint, två läsriktningar.",
      "Rekursiv relation: samma entitetstyp i båda ändpunkterna, self-line med rollerna supervisor och report. Chens 1 och N blir optional-one och optional-many; enkla linjer blir cirklar.",
      "Svag identitet: vanlig box där två ID-markörer gör project_no och task_no till en sammansatt identifierare. Ingen dubbel rektangel, ingen dubbel romb, ingen streckad understrykning.",
      "En Crow's Foot-relationslinje kan inte bära attribut. M:N med attribut måste bli en associativ entitet: EMPLOYEE — Has — ASSIGNMENT — Is for — PROJECT, med assignment_no tillagt som identifierare. Här tvingar notationen fram reifieringen.",
      "Flervärdesattribut blir en relaterad entitet i 1:N (PHONE NUMBER).",
      "Direkt kodat: entity types och vanliga attributes, identifying attributes, binary och unary relationship types, participant roles, de fyra endpoint-kombinationerna. Indirekt: instances och sets, value sets, multivalued/composite/derived/optional attributes, value domains, weak identity, attributes på relationship types.",
      "Kursens konvention: konceptuell IE-variant; ändsymboler för optional/required och one/many; identifierare och attribut inuti boxarna; en entitet får representera ett par och äga dess attribut."
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
      "En relation i 1NF vars kandidatnycklar alla är enkla är automatiskt i 2NF, eftersom en enkel nyckel inte har några äkta delmängder — föreläsningens beslutssteg: är kandidatnyckeln sammansatt? Nej → 2NF kan inte brytas.",
      "Arbetsgång: bestäm kandidatnycklarna → lista primär- och icke-primärattribut → testa 2NF (partiella beroenden) → testa 3NF (transitiva beroenden).",
      "Normalisering sker genom dekomposition: bryt ned relationen i mindre relationer som uppfyller den önskade normalformen. Transformationsreglerna producerar redan relationer i 3NF — de är normaliseringsteorins resultat i praktisk form.",
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
    summary: "Den logiska modellen blir körbar SQL. Här införs surrogatnycklar, datatyper väljs och affärsregler flyttas in i databasen som namngivna constraints enligt kursens kodstandard.",
    keyPoints: [
      "DDL (Data Definition Language) definierar strukturer: CREATE, ALTER, DROP. DML (Data Manipulation Language) hanterar data: SELECT, INSERT, UPDATE, DELETE.",
      "Fem constrainttyper: PRIMARY KEY (unik och NOT NULL, en per tabell), FOREIGN KEY (referensintegritet), UNIQUE (unikt men tillåter NULL), CHECK (villkor på värden), DEFAULT (värde när inget anges).",
      "CHECK-constraints är där kapitel 2:s domänbegrepp får sin tekniska motsvarighet.",
      "Namnge alltid constraints. Kursens prefix: PK_, FK_, UQ_, CK_, DF_ följt av tabell och kolumn. Ger begripliga felmeddelanden och något att referera till i ALTER TABLE.",
      "Surrogatnyckel skapas med IDENTITY(1,1) i SQL Server. Motiv: nyckelstabilitet och prestanda vid join och indexering.",
      "Priset för surrogatnycklar: raden går inte att identifiera meningsfullt utan uppslag, och den naturliga nyckeln måste behållas som UNIQUE för att affärsregeln inte ska förloras.",
      "Datatyper i SQL Server: INT/BIGINT för heltal, DECIMAL(p,s) för exakta decimaltal och belopp (approximativa numeriska typer bara när exakt precision är mindre viktig), VARCHAR(n)/NVARCHAR(n) för text där N klarar unicode, CHAR(n) för fast längd, DATE/DATETIME/DATETIME2 för tid, BIT för booleskt.",
      "Kodstandard v2.0: tabellnamn i PascalCase och singular (Employee, inte employees), kolumnnamn i PascalCase ofta med tabellprefix, camelCase för Java-variabler och metoder, PascalCase för Java-klasser, SCREAMING_SNAKE_CASE för miljövariabler.",
      "Inga hemligheter i repot — anslutningsuppgifter och lösenord i miljövariabler eller konfiguration utanför versionshanteringen. Detta prövas i databasprojektet."
    ],
    pitfalls: [
      "UNIQUE tillåter NULL, PRIMARY KEY gör det inte.",
      "Belopp lagras med en exakt numerisk typ som DECIMAL — approximativa typer ger avrundningsfel.",
      "Tabellnamn ska vara singular enligt kursens standard."
    ]
  }
];
