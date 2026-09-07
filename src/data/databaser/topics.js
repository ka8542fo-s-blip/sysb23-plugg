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
      "Kursens miljö: SQL Server på en virtuell maskin i Microsoft Azure, ansluten från VS Code via mssql-tillägget, kod i GitHub. En server är i praktiken en dator som aldrig stängs av.",
      "Tentan: fyra uppgifter på fem timmar, 100 p, utskrivna slides och boken tillåtna — läsa ER-diagram (25 p, +5/−3 per markering), DDL direkt från ER (25 p, surrogatnycklar även på svaga entiteter), normalformer (20 p, sant/falskt à 2 p med −1 vid fel, två uppgifter om högsta normalform där övernormalisering ger avdrag) och en enda SQL-fråga (30 p)."
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
    summary: "En relation är en mängd likartat strukturerade fakta, formellt en mängd tupler över domäner. Schemat bestämmer formen, det aktuella värdet är tuplerna just nu. SQL:s resultat är en bag som räknar upprepningar; relationen är en mängd.",
    keyPoints: [
      "Relation: en mängd tupler där varje element tillhör en domän — fakta av ett slag. Attribut: ett namn parat med en domän. Tupel: en komplett fakta med ett värde per attribut, där inga två element har samma attributnamn. Relation är inte samma sak som ER-relationship: EMPLOYEE lagrar entitetsfakta, WORKS_ON relationsfakta, båda är relationer.",
      "Schema och aktuellt värde: schemat EMPLOYEE(EmployeeNo, Name, WorkEmail) bestämmer formen på varje giltig tupel; det aktuella värdet är tuplerna just nu och kan växa, krympa eller vara tomt. En ny anställd är en ny tupel, aldrig ett nytt attribut.",
      "Domän: mängden tillåtna värden enligt schemat, inte de värden som redan används — E-555 är tillåtet fast ingen tupel har det. Inte samma sak som datatyp: domänen bär affärsregeln (lön 10 000–30 000), datatypen säger bara INT.",
      "Grad och kardinalitet: grad = antalet attribut, ändras bara med schemat; kardinalitet = antalet tupler just nu, tomt värde = 0. ER-modellens kardinalitet är ett annat begrepp.",
      "Terminologi: tupel/rad/post, attribut/kolumn/fält; äldre material även relation/tabell/fil. 'Fält' kan betyda ett enskilt värde eller en kolumn beroende på källa.",
      "Relationens sju egenskaper: unikt namn; atomära värden i varje cell; distinkta attributnamn; samma datatyp och domän inom ett attribut; attributens ordning saknar betydelse; tuplernas ordning saknar betydelse; inga dubblettupler — enskilda värden får upprepas, den kompletta tupeln får det inte.",
      "SQL ger en bag, relationen är en mängd: SELECT Name kan ge två identiska Mary-rader; bagen räknar upprepningar, relationen innehåller tupeln en gång, DISTINCT tar bort dubblettraderna. Varken mängd eller bag har ordning — utan ORDER BY är radordningen inte garanterad. Kravet på atomära värden är samma krav som 1NF."
    ],
    pitfalls: [
      "Domän och datatyp är inte synonymer — domänen är snävare och uttrycker affärsregeln, och den anger tillåtna värden, inte förekommande.",
      "Relationsmodellen förbjuder dubblettupler, men en SQL-tabell tillåter dem om ingen nyckel hindrar det, och ett SQL-resultat är en bag. Känn skillnaden mellan modell och praktik.",
      "Kardinalitet betyder antalet tupler här men deltagandevillkor i ER-modellen — läs av vilket sammanhang ordet står i."
    ],
  },
  {
    id: "nycklar",
    name: "Nycklar och referensintegritet",
    chapter: "kap3",
    examWeight: "hög",
    summary: "Kandidatnyckel kräver både unikhet och minimalitet; primärnyckeln är den kandidatnyckel som väljs, PK = CK1. Främmande nycklar måste träffa en existerande nyckel, får upprepas och tvingar inte fram deltagande. Surrogatnycklar: kursen placerar dem olika, tentan kräver dem i DDL.",
    keyPoints: [
      "Unikhet är en verksamhetsregel: den gäller varje tillåten population. Aktuella rader kan motbevisa en identifierare men aldrig bevisa en regel — leta efter regeln i uppgiftstexten, inte efter mönster i exempeldatan.",
      "Kandidatnyckel (candidate key): en attributmängd K som uppfyller både unikhet (inga två skilda tupler har samma värden i K i något giltigt relationsvärde) och minimalitet (inget attribut kan tas bort ur K utan att unikheten förloras). {EmployeeNo, Name} är unik men inte minimal. En relation kan ha flera, en per unikhetsregel; en sammansatt kandidatnyckel som {EmployeeNo, ProjectNo} är unik som par, inte var för sig, och alla attributen stryks under.",
      "Primärnyckel (primary key): en utvald kandidatnyckel, PK = CK1. Valet skapar ingen ny kandidatnyckel och tar inte bort någon — WorkEmail förblir CK2 och måste vara unik. Välj stabil, minimal och semantiskt meningsfull.",
      "Primärattribut (prime): medlem i NÅGON kandidatnyckel. Icke-primärattribut (non-prime): medlem i ingen. Har relationen flera kandidatnycklar räknas attribut ur alla som primära — tentans 3e prövar det.",
      "Främmande nyckel (foreign key): attribut vars värden måste matcha en kandidatnyckel, normalt primärnyckeln, i en annan eller samma relation (parent/referenced/master). Värdet får upprepas — Mary leder både Atlas och Nova; den refererade tupeln måste finnas — E-999 har rätt form men bryter mot villkoret; ett tillåtet domänvärde är inte automatiskt en giltig referens.",
      "Främmande nycklar tvingar inte fram deltagande: att varje WORKS_ON-tupel träffar ett projekt hindrar inte att ett projekt saknas i WORKS_ON. NOT NULL på en främmande nyckel gör många-sidans deltagande obligatoriskt; ett-sidans och M:N-sidans totala deltagande blir en verksamhetsregel utanför constraints. NULL tillåts när deltagandet är frivilligt.",
      "Referensintegritet: databasen vägrar rader som pekar på något som inte finns och vägrar radera det som fortfarande refereras.",
      "Notation: CK1 = {…}, CK2 = {…}, PK = CK1, FK1 : (LeaderEmployeeNo) REF EMPLOYEE(EmployeeNo) — före REF den refererande attributlistan, efter REF den refererade relationen och nyckeln. Häftets facit stryker under: hel linje för PK, prickad för FK; tentans uppgift 3 kräver understrykningen.",
      "Naturlig och surrogatnyckel: naturlig har affärsbetydelse (anställningsnummer, ISBN), surrogat är artificiell och databasgenererad, motiven nyckelstabilitet och prestanda. Kursen placerar dem olika — Fö5 nämner dem inte, Fö1 lägger dem i logisk design, häftet i fysisk — men på tentan kommer de i uppgift 2: automatiskt inkrementerande surrogatnycklar på vanliga och svaga entiteter. I uppgift 3 stryks de naturliga nycklarna under.",
      "Mönstret i praktiken: surrogatnyckel som PRIMARY KEY plus naturlig nyckel som UNIQUE — som EmployeeID och EmpNo i hospital-databasen. Tas den naturliga nyckeln bort förloras affärsregeln om unikhet."
    ],
    pitfalls: [
      "'Någon kandidatnyckel' i definitionen av primärattribut betyder att attribut ur flera kandidatnycklar alla räknas som primära.",
      "Minimaliteten glöms: en attributmängd som är unik men innehåller ett onödigt attribut är ingen kandidatnyckel.",
      "En giltig främmande nyckel garanterar varken unikhet i den refererande relationen eller att alla refererade tupler deltar — 1:1 kräver en kandidatnyckel därtill, och totalt deltagande på ett-sidan går inte att tvinga fram med FK.",
      "Tas den naturliga nyckeln bort när surrogatnyckeln införs förloras affärsregeln om unikhet."
    ],
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
      "Priset: assignmentNo som identifierare skapar ett verkligt ansvar — organisationen måste tilldela, lagra och bevara ett unikt värde för varje uppdrag. Reifiering är inte gratis.",
      "Läsa påståenden (tentans uppgift 1): 'måste' ↔ dubbel linje vid den egna änden; 'kan ha flera' ↔ N bredvid den andra entiteten, läst tvärs över; 'exakt en' ↔ 1 tvärs över PLUS dubbel linje; 'två X kan ha samma Y' ↔ Y är inte understruket; 'identifieras av kombinationen' ↔ sammansatt identifierare eller svag entitet med partiell nyckel. Titta bara på den plats i diagrammet som påståendets slag pekar på.",
      "Flerstegspåståenden: ett 'kan' är sant om ingen restriktion i diagrammet utesluter det, ett 'måste' bara om en restriktion kräver det. Ingen symbol binder ihop två vägar (spelarens förening och lagets förening), och ingen symbol hindrar självlänkar i unära relationer — sådana regler står i uppgiftstexten eller inte alls."
    ],
    pitfalls: [
      "Dubbellinje räcker inte för svaghet — det krävs att identiteten beror på ägaren.",
      "Leta inte efter ägaren i multipliciteterna; den syns bara i dubbel romb och dubbel rektangel.",
      "Reifiera inte bara för att relationen har attribut — det är ett val i Chen, inte ett tvång.",
      "Vid ett påstående om hur många Y ett X får ha: läs etiketten bredvid Y, inte bredvid X. N bredvid Lag i Hemma säger hur många lag en arena får ha — inget om hur många arenor ett lag får ha."
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
    summary: "Sex regler i ordning tar ER-modellen till relationsscheman med nycklar och referenser: vanliga entiteter, svaga entiteter, 1:1, 1:N, M:N, flervärdesattribut. Entitetsrelationer och nycklar först, sedan resten som checklista. 1:1 kräver att den främmande nyckeln görs till kandidatnyckel; svaga kedjor refererar närmaste ägares hela nyckel.",
    keyPoints: [
      "Vad som produceras: relationsscheman, nycklar och constraints — inte SQL och inte fyllda tabeller. Sex regler i ordning: vanliga entiteter, svaga entiteter, 1:1, 1:N, M:N, flervärdesattribut. Entitetsrelationer och nycklar först, resten som checklista; alla modeller behöver inte alla sex.",
      "Regel 1, vanlig entitet: en relation med alla enkla attribut och de enkla delarna av sammansatta attribut; varje identifierare blir kandidatnyckel, en väljs som primärnyckel. Flera identifierare ger CK1 och CK2 — att välja en tar inte bort unikhetskravet på den andra. Sammansatt identifierare: alla delar tillsammans, inget separat ProjectNo.",
      "Regel 2, svag entitet: ägaren mappas först; relationen får de enkla attributen, ägarens primärnyckel som främmande nyckel, den identifierande relationens attribut (addedAt), och primärnyckel = ägarens nyckel + partiell nyckel. Ingen egen relation för den identifierande relationen. Sammansatt ägarnyckel tas med hel, som en främmande nyckel.",
      "Kedjade svaga entiteter: varje led refererar sin närmaste ägares kompletta nyckel — TASK_STEP(ProjectNo, TaskNo, StepNo) med FK (ProjectNo, TaskNo) REF PROJECT_TASK — inte TaskNo ensamt.",
      "Regel 3, binär 1:1: främmande nyckel i den ena relationen, helst hos den sida som deltar totalt; den främmande nyckeln görs till KANDIDATNYCKEL, annars bevaras inte 1:1; kräv referens där deltagandet är totalt; relationsattributen i värdrelationen. Båda totala: valfri sida med totalt deltagande upprätthållet på båda håll, eller sammanslagning till en relation där båda identifierarna förblir kandidatnycklar. Ett tredje, sällan föredraget alternativ: en separat relation.",
      "Regel 4, binär 1:N: 1-sidans primärnyckel som främmande nyckel i N-sidans relation; värdet får upprepas — den främmande nyckeln är INGEN kandidatnyckel, det är skillnaden mot 1:1; relationsattributen i N-sidans relation. Samma regel på en redan mappad svag relation utan att dess nyckel ändras.",
      "Regel 5, binär M:N: ny relation med båda deltagarnas primärnycklar som främmande nycklar, kombinationen som primärnyckel, relationsattributen utanför nyckeln — samma par två gånger med olika värden är en nyckelöverträdelse. Deltagandekraven hanteras separat: alla nycklar kan hålla medan ett projekt saknar tupel.",
      "Sammansatt främmande nyckel: en deltagare med sammansatt nyckel kopieras hel som EN referens, FK2 : (RegistrationYear, SequenceNo) REF PROJECT(…) — inte två oberoende, för SequenceNo ensamt är ingen projektnyckel.",
      "Regel 6, flervärdesattribut: ny relation med ägarens hela primärnyckel som främmande nyckel plus attributet; kombinationen är primärnyckel. Hela samlingen i en cell är en domänöverträdelse. En ägare utan värden har ingen tupel; ett nytt värde är en ny tupel, aldrig en ny kolumn. Konsekvens: värdet kan delas mellan flera ägare.",
      "Unära relationer: samma regel som den binära av samma form (häftets facit). 1:N ger en främmande nyckel i samma relation med rollnamn (ManagerNo REF EmployeeNo, NULL för högsta chefen); M:N ger en ny relation med två attribut mot samma relation.",
      "Arbetsgång: vanliga entiteter → svaga entiteter, ägare först → varje relationstyp efter form → flervärdesattribut → kontrollera att varje främmande nyckel träffar, att 1:1-nycklarna är kandidatnycklar och vilka deltagandekrav nycklarna inte täcker → kontrollera normalform."
    ],
    pitfalls: [
      "Främmande nyckeln i 1:N hamnar på många-sidan, aldrig på ett-sidan.",
      "1:1 med bara en främmande nyckel bevarar inte 1:1 — den måste göras till kandidatnyckel, och den ska helst sitta hos den sida som deltar totalt.",
      "Glöm inte att relationsattribut på M:N ska med i den nya relationen, men utanför primärnyckeln.",
      "En svag entitet i en kedja refererar sin närmaste ägares hela nyckel — inte bara den partiella nyckeln ovanför, och inte roten direkt.",
      "Sammansatt nyckel kopieras som en främmande nyckel med alla delar, inte som en per del."
    ],
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
      "Dependency preservation: ett funktionellt beroende är bevarat om dess båda attribut finns i samma relation. Kontrollera beroende för beroende; ett förlorat beroende kan inte upprätthållas med en enkel constraint.",
      "Sant/falskt om ett schema (3a–e): svara alltid. 2NF i en relation — sammansatt nyckel? annars kan den inte brytas. Alla i 3NF — pröva varje relation med dess egna beroenden; en relation utan beroenden är i 3NF. Fler än en kandidatnyckel — leta cykler (A → B, B → A). Primärattribut — avgörs av DEN relationens kandidatnycklar, inte R:s. Beroendebevarande — varje beroendes attribut i samma relation. Lossless join — kursbokens kontroll, två i taget: gemensamma attribut som är kandidatnyckel i minst en av dem (föreläsningen ger bara: inga gemensamma attribut → inte lossless).",
      "Motiveringens form (3f–g): kandidatnycklar, primär- och icke-primärattribut först; sedan 'Normalform: 1NF / Skäl: äkta delmängden B av kandidatnyckeln {A,B} bestämmer funktionellt icke-primärattributet D' eller 'icke-primärattributet D är transitivt beroende av kandidatnyckeln A (A → C, C → D, inte C → A)'. Motivering krävs inte för 3NF.",
      "Övernormalisering ger poängavdrag: dela inte upp mer än definitionerna kräver — bryt inte ned en relation som redan är i 3NF, dela inte {A,B} → {C,D} i två. Nedbrytningen ska sträva efter både lossless join och dependency preservation: ett beroende per relation med vänsterledet som primärnyckel, understruken."
    ],
    pitfalls: [
      "2NF-definitionen säger 'någon äkta delmängd av NÅGON kandidatnyckel' — flera kandidatnycklar måste alla prövas.",
      "3NF-definitionen säger 'VARJE kandidatnyckel'. Nöj dig inte med att testa mot primärnyckeln.",
      "Ett beroende Y → Z är inte transitivt om även Y → X gäller, eftersom Y då själv är kandidatnyckel.",
      "Lär definitionerna ordagrant — omskrivningar i egna ord tappar nästan alltid en kvantifierare.",
      "Kandidatnycklar och primärattribut byter betydelse när relationen byter — 'är C primärattribut i R i schema 3?' avgörs av delrelationens nycklar, inte av R:s.",
      "Delrelationer i 3NF säger inget om nedbrytningen: den kan ändå ha förlorat ett beroende eller lossless join. Kontrollera de två egenskaperna separat."
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
      "Kodstandard v2.0: tabellnamn i PascalCase och singular (Employee, inte employees), kolumnnamn i PascalCase ofta med tabellprefix, camelCase för Java-variabler och metoder, PascalCase för Java-klasser, SCREAMING_SNAKE_CASE för miljövariabler. Inga hemligheter i repot — anslutningsuppgifter och lösenord i miljövariabler eller konfiguration utanför versionshanteringen; det prövas i databasprojektet.",
      "Tentans uppgift 2: alla kolumner INTEGER (strukturen prövas, inte datatyperna); reserverade ord utskrivna — PRIMARY KEY, FOREIGN KEY, REFERENCES, CONSTRAINT, NOT NULL, UNIQUE; constraintnamn krävs inte, PRIMARY KEY (LagID) utan CONSTRAINT-rad är tillåtet; automatiskt inkrementerande surrogatnyckel stavas INTEGER IDENTITY(1,1) (seed, increment) på tabeller för vanliga OCH svaga entiteter, aldrig på kopplingstabeller; koden indenterad med en kolumn per rad och constraints sist.",
      "Poängen sitter i det facit läser mot diagrammet: naturliga nycklar UNIQUE och NOT NULL, NOT NULL på främmande nyckel där linjen är dubbel och nullbar där den är enkel, svag entitet med surrogatnyckel plus UNIQUE över partiell nyckel och ägarens främmande nyckel, REFERENCES mot surrogatnyckeln — och refererade tabeller före refererande."
    ],
    pitfalls: [
      "UNIQUE tillåter NULL, PRIMARY KEY gör det inte.",
      "Belopp lagras med en exakt numerisk typ som DECIMAL — approximativa typer ger avrundningsfel.",
      "Tabellnamn ska vara singular enligt kursens standard.",
      "Naturlig nyckel med bara UNIQUE släpper igenom NULL — NOT NULL måste också anges.",
      "Kopplingstabeller får ingen egen surrogatnyckel; primärnyckeln är de två främmande nycklarna.",
      "På tentan: en REFERENCES som pekar på den naturliga nyckeln i stället för surrogatnyckeln, en kopplingstabell med egen IDENTITY, eller NOT NULL som inte följer deltagandelinjerna — det är de vanliga avdragen."
    ]
  }
];
