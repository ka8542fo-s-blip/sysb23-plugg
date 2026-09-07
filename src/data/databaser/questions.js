// Frågebank Databaser — Öva speglar Läs: ett kapitel i Läs = en kvizz i Öva.
// Nio kapitel, 6–7 frågor var, alla besvarbara enbart ur kapiteltexten.
// Syfte: förståelsekontroll av läsmaterialet, inte tentasimulering.
//
// Samma designregler som strategi/questions.js: fyra jämnlånga alternativ
// (längsta högst 25 % längre än kortaste), inga skämtdistraktorer, jämn
// positionsfördelning, rätt svar inte det enda nyanserade, explain per
// alternativ. Låses av scripts/fragebank-balans.test.mjs.
//
// `topic` är ämnet i topics.js; Öva grupperar per kapitel via ämnets
// kapitel (manifestets practiceBy: "chapter"), så varje fråga hamnar i sitt
// kapitels kvizz. Frågor med id db1-/db4- är behållna ur leveransen
// 2026-09-05 (formuleringar och alternativ oförändrade, utom tre
// längdrättningar där det längsta alternativet var det rätta); dbq- är
// skrivna mot kapiteltexten och märkta reviewed: false tills de granskats.
//
// SQL-frågespråket saknar kapitel i Läs; de sex SQL-frågorna ur leveransen
// väntar i questions-pending.js.

// Frågor som får bryta spridningsregeln (längsta alternativ högst 25 % längre
// än kortaste). Varje post kräver ett skäl i klartext — testet vägrar tomma
// skäl, så listan kan ändras men inte i tysthet. Grundregeln: en distraktor
// får vara längst (längden avslöjar inte facit); är rätt svar längst ska
// alternativen rättas, inte flaggas.
export const LENGTH_FLAGGED = [
  { id: "db4-12", reason: "Behållen ur leveransen 2026-09-05; längsta alternativet är en distraktor (spridning 1,53)." },
  { id: "db4-14", reason: "Behållen ur leveransen 2026-09-05; längsta alternativet är en distraktor (spridning 1,46)." },
  { id: "db4-26", reason: "Behållen ur leveransen 2026-09-05; längsta alternativet är en distraktor (spridning 1,27)." },
];

export const questions = [
  { id: "db1-08", topic: "grunder", difficulty: 2,
    question: "Vad är normalisering, och var i designkedjan hör den hemma?",
    options: [
      { text: "En städning av tabellernas rader, efter att databasen implementerats", explain: "Normalisering är ett designsteg före implementationen, inte en städning av rader efteråt." },
      { text: "Ett obligatoriskt steg i konceptuell design, före ER-diagrammet ritas", explain: "Den hör till logisk design och görs bara om det behövs — inte alltid, inte före ER-diagrammet." },
      { text: "En kontroll av den logiska modellen, före den fysiska designens DDL", explain: "Steg två: transformation till relationer, följt av normalisering om det behövs, före DDL." },
      { text: "En optimering som databashanteraren utför automatiskt vid varje INSERT", explain: "Databashanteraren normaliserar ingenting automatiskt — normalformen är designerns beslut." }
    ],
    correct: 2, source: "Kompendiet kap. 1", reviewed: true },

  { id: "dbq-01", topic: "grunder", difficulty: 1,
    question: "Vem avgör vad databasen ska lagra data om?",
    options: [
      { text: "Databasadministratören ensam, eftersom det är ett tekniskt beslut", explain: "Kapitlet säger uttryckligen att administratören inte bestämmer ensam." },
      { text: "Verksamhetssidan i dialog med IT, utifrån vad processerna kräver", explain: "Frågan är vad verksamheten behöver lagra för att fungera, och verksamheten konsulteras alltid." },
      { text: "Systemleverantören, som levererar en färdig och generell datamodell", explain: "En generell modell svarar inte på vad just den här verksamheten kräver." },
      { text: "Utvecklarna, som vet vilka tabeller applikationens kod behöver", explain: "Tabellerna följer av verksamhetens behov, inte tvärtom." }
    ],
    correct: 1, source: "Kompendiet kap. 1", reviewed: false },

  { id: "dbq-02", topic: "grunder", difficulty: 2,
    question: "Vad producerar den logiska databasdesignen?",
    options: [
      { text: "Ett ER-diagram som abstraherar verksamhetens krav", explain: "Det är det konceptuella stegets resultat, före transformationen." },
      { text: "Körbara CREATE TABLE-satser för den valda databashanteraren", explain: "DDL-koden hör till fysisk design, det sista steget." },
      { text: "En kravlista i löpande text, avstämd med verksamheten", explain: "Kravtexten är designprocessens utgångspunkt, inte ett resultat." },
      { text: "Relationer i textform, normaliserade om det behövs", explain: "Den konceptuella modellen transformeras till relationer i textform och normaliseras vid behov." }
    ],
    correct: 3, source: "Kompendiet kap. 1", reviewed: false },

  { id: "dbq-04", topic: "relationsmodellen", difficulty: 2,
    question: "Vad skiljer en domän från en datatyp?",
    options: [
      { text: "Datatypen är snävare än domänen och anger det tillåtna intervallet", explain: "Omvänt: datatypen säger bara INT, domänen lägger till intervallet." },
      { text: "Domänen gäller bara textattribut, datatypen bara numeriska attribut", explain: "Båda gäller alla slags attribut; skillnaden ligger i vad de uttrycker." },
      { text: "Domänen bär affärsregeln, datatypen anger bara hur värdet lagras", explain: "SalaryType kan kräva 10 000–30 000; datatypen säger bara INT." },
      { text: "De är synonymer — domän är relationsmodellens ord för datatyp", explain: "De överlappar men är inte samma sak; domänen är det snävare begreppet." }
    ],
    correct: 2, source: "Kompendiet kap. 2", reviewed: false },

  { id: "dbq-07", topic: "relationsmodellen", difficulty: 3,
    question: "Vad gäller för dubblettupler?",
    options: [
      { text: "Relationsmodellen tillåter dem, men SQL Server avvisar dem alltid", explain: "Omvänt: modellen förbjuder dem, SQL-tabellen kan innehålla dem." },
      { text: "Relationsmodellen förbjuder dem, men en SQL-tabell kan innehålla dem utan nyckel", explain: "Egenskap 7 är ett ideal som SQL bara upprätthåller om en nyckel hindrar dubbletter." },
      { text: "Både modellen och SQL tillåter dem så länge raderna får olika radnummer", explain: "Radnummer finns inte i modellen, och identiska rader är ändå dubbletter." },
      { text: "Varken modellen eller SQL tillåter dem, oberoende av vilka nycklar som finns", explain: "SQL-tabeller utan nyckel tar emot identiska rader utan protest." }
    ],
    correct: 1, source: "Kompendiet kap. 2", reviewed: false },

  { id: "dbq-09", topic: "nycklar", difficulty: 1,
    question: "Vad skiljer en primärnyckel från en kandidatnyckel?",
    options: [
      { text: "Primärnyckeln är den kandidatnyckel som databasarkitekten väljer", explain: "Kandidatnycklarna är alla som kan användas; primärnyckeln är valet bland dem." },
      { text: "Primärnyckeln består alltid av ett attribut, kandidatnyckeln kan vara sammansatt", explain: "Båda kan vara sammansatta; skillnaden ligger i valet, inte i formen." },
      { text: "Kandidatnyckeln genereras av databasen, primärnyckeln är den naturliga", explain: "Generering hör till surrogatnycklar och har inget med indelningen att göra." },
      { text: "Kandidatnyckeln får innehålla NULL, primärnyckeln får det aldrig", explain: "Unik identifiering utesluter NULL för båda; det är inte skillnaden." }
    ],
    correct: 0, source: "Kompendiet kap. 3", reviewed: false },

  { id: "dbq-10", topic: "nycklar", difficulty: 3,
    question: "En relation har två kandidatnycklar. Vilka attribut är primärattribut?",
    options: [
      { text: "Bara attributen i den kandidatnyckel som har valts till primärnyckel", explain: "Definitionen säger någon kandidatnyckel, inte den valda." },
      { text: "Bara de attribut som ingår i båda kandidatnycklarna samtidigt", explain: "Det räcker att ingå i en av dem." },
      { text: "Alla attribut i relationen, eftersom två nycklar tillsammans täcker allt", explain: "Attribut utanför båda nycklarna är icke-primära." },
      { text: "Alla attribut som ingår i någon av de två kandidatnycklarna", explain: "Primärattribut är medlem i någon kandidatnyckel — attribut ur båda räknas." }
    ],
    correct: 3, source: "Kompendiet kap. 3", reviewed: false },

  { id: "dbq-12", topic: "nycklar", difficulty: 2,
    question: "När får en främmande nyckel vara NULL?",
    options: [
      { text: "När den refererade relationen saknar en egen primärnyckel", explain: "En främmande nyckel refererar alltid en primärnyckel; det är förutsättningen." },
      { text: "När den ingår i en sammansatt primärnyckel i sin egen relation", explain: "Primärnyckelattribut får aldrig vara NULL." },
      { text: "När deltagandet i relationen är frivilligt, som bilen utan ägare", explain: "Frivilligt deltagande ger NULL; obligatoriskt deltagande ger NOT NULL." },
      { text: "Aldrig — en främmande nyckel måste alltid peka på en existerande rad", explain: "Vid frivilligt deltagande får den vara NULL." }
    ],
    correct: 2, source: "Kompendiet kap. 3", reviewed: false },

  { id: "db4-02", topic: "metamodell", difficulty: 2,
    question: "Vad är förhållandet mellan en modell och ett diagram av den?",
    options: [
      { text: "Diagrammet är en representation av modellen, inte modellen självt", explain: "Samma modell kan ritas, skrivas som text eller XML — ingen representation är modellen." },
      { text: "Diagrammet är modellen, uttryckt i grafisk i stället för textuell form", explain: "Diagrammet är ett sätt att visa modellen, inte modellen i grafisk form." },
      { text: "Diagrammet är en förenklad modell där vissa fakta har utelämnats", explain: "Ett diagram utelämnar inte fakta; det representerar samma modell som texten." },
      { text: "Diagrammet är en instans av modellen på samma sätt som data är det", explain: "Instanser hör till populationen — diagrammet visar typerna, inte data." }
    ],
    correct: 0, source: "Kompendiet kap. 4", reviewed: true },

  { id: "db4-03", topic: "metamodell", difficulty: 2,
    question: "Ett nytt stopp läggs till på linjen. Vad förändras?",
    options: [
      { text: "Endast modellen — metamodellens begrepp är desamma som förut", explain: "Stop C är två nya fakta i modellen; metamodellens begrepp är desamma." },
      { text: "Varken modellen eller metamodellen, bara diagrammets utseende", explain: "Ett nytt stopp är ett nytt faktum, alltså en ändring i modellen." },
      { text: "Endast metamodellen, som måste tillåta det nya elementet", explain: "Metamodellen tillåter redan Stop; vokabulären behöver inte utökas." },
      { text: "Både modellen och metamodellen, eftersom vokabulären utökas", explain: "Bara modellen växer — metamodellen säger fortfarande Line, Stop och Line has stops." }
    ],
    correct: 0, source: "Kompendiet kap. 4", reviewed: true },

  { id: "db4-12", topic: "er", difficulty: 3,
    question: "En kolumn råkar ha unika värden i all data som finns i dag. Är den en identifier?",
    options: [
      { text: "Ja, unika värden i populationen är precis vad en identifier innebär i modellen", explain: "Unika värden just nu är data, inte en regel som håller för varje giltig population." },
      { text: "Ja, så länge inga dubbletter har uppstått är identifieringsregeln uppfylld", explain: "Att dubbletter inte uppstått ännu är ingen garanti för nästa population." },
      { text: "Nej, en identifier måste dessutom vara en simple attribute", explain: "En identifierare får vara sammansatt; enkelhet är inget krav." },
      { text: "Nej, regeln måste hålla för varje giltig population", explain: "Identifikation är en modellnivåregel som måste hålla för varje giltig population." }
    ],
    correct: 3, source: "Kompendiet kap. 4", reviewed: true },

  { id: "db4-13", topic: "er", difficulty: 3,
    question: "Hur markeras ett composite attribute som fungerar som identifier?",
    options: [
      { text: "Man understryker både parent och samtliga komponenter", explain: "Föräldern och delarna stryks inte under samtidigt — det vore två identifierare." },
      { text: "Man understryker varje komponent för sig, inte föräldern", explain: "Delarna identifierar inte var för sig; 2026-1 och 2026-2 delar år." },
      { text: "Man understryker the composite parent, inte komponenterna", explain: "Den sammansatta föräldern stryks under; identifikationen använder hela värdet." },
      { text: "Man ringar in komponenterna med en gemensam streckad ram", explain: "Streckad ram finns inte; streckat markerar partiell identifierare." }
    ],
    correct: 2, source: "Kompendiet kap. 4", reviewed: true },

  { id: "db4-14", topic: "er", difficulty: 2,
    question: "Vad betyder två separata understrykningar i samma entity type?",
    options: [
      { text: "Att de två attributen tillsammans bildar en composite identifier för entityn", explain: "En sammansatt identifierare stryks under som en helhet, inte som två." },
      { text: "Att det finns två identifiers som var för sig räcker", explain: "employeeNo och workEmail identifierar var för sig — två identifierare." },
      { text: "Att attributen är kandidater, men att ingen av dem har valts ännu", explain: "Understrykningen är själva regeln, inte en lista över kandidater." },
      { text: "Att det ena identifierar entityn och det andra dess owner", explain: "Ägarberoende markeras med streckad understrykning, inte en andra hel." }
    ],
    correct: 1, source: "Kompendiet kap. 4", reviewed: true },

  { id: "db4-18", topic: "relationstyper", difficulty: 2,
    question: "Hur förhåller sig maximum cardinality och participation till varandra?",
    options: [
      { text: "Participation följer av multipliciteten och sätts därför inte separat", explain: "Deltagandet följer inte av kardinaliteten; de sätts var för sig." },
      { text: "De sätts oberoende av varandra och besvarar olika frågor", explain: "Kardinalitet svarar på hur många, deltagande på om man måste delta alls." },
      { text: "Maximum cardinality anger minimum och participation anger maximum", explain: "Kardinalitetsetiketten anger maxima, inte minimum." },
      { text: "De är två namn på samma constraint i olika Chen-varianter", explain: "De är två olika constraints med olika symboler, inte två namn på en." }
    ],
    correct: 1, source: "Kompendiet kap. 5", reviewed: true },

  { id: "db4-19", topic: "relationstyper", difficulty: 3,
    question: "I `Employee — Leads — Project` står `1` bredvid Employee. Vad betyder det?",
    options: [
      { text: "Att varje Project får ha högst en Employee kopplad", explain: "Ratio-etiketten läses tvärs över: talet vid Employee gäller varje Project." },
      { text: "Att exakt en Employee finns för varje Project i modellen", explain: "Exakt en kräver också dubbel linje — etiketten anger bara ett maximum." },
      { text: "Att varje Employee får leda högst ett Project i modellen", explain: "Det vore att läsa etiketten vid sin egen ände; den läses tvärs över." },
      { text: "Att Employee måste delta i relationen Leads minst en gång", explain: "Deltagande uttrycks av linjen, inte av ratio-etiketten." }
    ],
    correct: 0, source: "Kompendiet kap. 5", reviewed: true },

  { id: "db4-25", topic: "relationstyper", difficulty: 3,
    question: "Ratiot 1:N med enkla linjer används för Supervises. Vad tillåter modellen fortfarande?",
    options: [
      { text: "Att en Employee har flera supervisors samtidigt", explain: "1 vid supervisor begränsar varje underställd till högst en handledare." },
      { text: "Att en Employee handleder sig själv och att cykler uppstår", explain: "Basic Chen saknar symbol för supervisor ≠ report och för acyklicitet." },
      { text: "Att en Employee saknar både supervisor och reports", explain: "Det tillåts av enkla linjer, men det är inget fel — frågan gäller ogiltiga populationer." },
      { text: "Att relationen läses i motsatt riktning mot rollnamnen", explain: "Läsriktningen styrs av rollnamnen och kan inte vändas godtyckligt." }
    ],
    correct: 1, source: "Kompendiet kap. 5", reviewed: true },

  { id: "db4-26", topic: "svaga", difficulty: 3,
    question: "Vad krävs för att en entity type ska vara weak?",
    options: [
      { text: "Att den deltar obligatoriskt i minst en relationship", explain: "Total participation gör inte en entitet svag — Project i Leads förblir stark." },
      { text: "Att den saknar egna attributes utöver sin partial identifier", explain: "Svaghet handlar om identitet, inte om antalet attribut." },
      { text: "Att den har färre instanser än den entity type den är kopplad till", explain: "Antalet instanser har inget med svaghet att göra." },
      { text: "Att dess identitet är beroende av en entity av annan type", explain: "Svaghet kräver identitetsberoende av en entitet av annan typ." }
    ],
    correct: 3, source: "Kompendiet kap. 6", reviewed: true },

  { id: "db4-27", topic: "svaga", difficulty: 3,
    question: "Två relationship types kring ProjectTask har båda multipliciteten 1:N. Vilken är owner?",
    options: [
      { text: "Den som har total participation på ProjectTask-sidan", explain: "Total participation pekar inte ut ägaren." },
      { text: "Den vars entity type har flest attributes av de två", explain: "Antalet attribut säger ingenting om vem som äger." },
      { text: "Det går inte att avgöra — double diamond avgör", explain: "Multipliciteterna avslöjar inte ägaren — dubbel romb och dubbel rektangel gör det." },
      { text: "Den som står till vänster enligt diagrammets läsordning", explain: "Diagrammets placering är bara schematisk." }
    ],
    correct: 2, source: "Kompendiet kap. 6", reviewed: true },

  { id: "db4-30", topic: "svaga", difficulty: 2,
    question: "När bör ett par reifieras till en egen entity type?",
    options: [
      { text: "När paret behöver egen identitet eller eget lifecycle", explain: "Reifiera när paret ska refereras, delta i andra relationer eller ha egen livscykel." },
      { text: "Så snart relationen äger minst ett eget attribute i modellen", explain: "Relationsattribut i sig tvingar inte fram reifiering." },
      { text: "När multipliciteten är M:N i stället för 1:N mellan de två", explain: "Multipliciteten avgör inte; ett M:N-par kan förbli en relation." },
      { text: "När de deltagande entity types hör till olika verksamhetsdelar", explain: "Organisatorisk hemvist är inget skäl i modellen." }
    ],
    correct: 0, source: "Kompendiet kap. 6", reviewed: true },

  { id: "db4-33", topic: "crowsfoot", difficulty: 2,
    question: "Hur läses de två märkena vid en endpoint i common IE?",
    options: [
      { text: "Det yttre visar one eller many, det inre visar optional eller required", explain: "Omvänt: det yttre märket är optional/required, det inre one/many." },
      { text: "Det yttre visar optional eller required, det inre visar one eller many", explain: "Yttre: cirkel = optional, streck = required. Inre: streck = one, fork = many." },
      { text: "Det yttre visar minimum och det inre visar maximum antal", explain: "Märkena anger inte minimum och maximum som tal." },
      { text: "Båda visar samma sak och det ena är enbart en förstärkning", explain: "De två märkena betyder olika saker och ger tillsammans fyra mönster." }
    ],
    correct: 1, source: "Kompendiet kap. 6", reviewed: true },

  { id: "dbq-13", topic: "transformation", difficulty: 1,
    question: "Var hamnar den främmande nyckeln vid en binär 1:M-relation?",
    options: [
      { text: "I ett-sidans relation, som referens till många-sidans primärnyckel", explain: "Ett projekt har många anställda — det går inte att lagra i en cell på ett-sidan." },
      { text: "I många-sidans relation, som referens till ett-sidans primärnyckel", explain: "En anställd har ett projekt, så projektets nyckel får plats i den anställdas rad." },
      { text: "I en ny kopplingsrelation som får båda primärnycklarna", explain: "Kopplingsrelationen är M:N-regeln; 1:M behöver ingen ny relation." },
      { text: "I båda relationerna, så att kopplingen kan följas åt båda hållen", explain: "En främmande nyckel räcker; joinen går åt båda hållen ändå." }
    ],
    correct: 1, source: "Kompendiet kap. 7", reviewed: true },

  { id: "dbq-14", topic: "transformation", difficulty: 3,
    question: "En 1:1-relation har ett obligatoriskt och ett frivilligt deltagande. Var läggs den främmande nyckeln?",
    options: [
      { text: "I den frivilliga sidans relation, så att NULL blir tillåtet där det behövs", explain: "Då blir kolumnen NULL för alla som inte deltar — precis det man vill undvika." },
      { text: "I en ny relation, eftersom 1:1 alltid transformeras med en kopplingstabell", explain: "1:1 kräver ingen ny relation; det är M:N-regelns lösning." },
      { text: "I valfri riktning — vid 1:1 väljer arkitekten oavsett deltagandet", explain: "Fri riktning finns bara när båda sidor deltar lika: båda frivilliga, eller båda obligatoriska." },
      { text: "I den obligatoriska sidans relation, så att kolumnen aldrig blir NULL", explain: "Den obligatoriska sidan har alltid en motpart, så nyckeln från den frivilliga sidan läggs där." }
    ],
    correct: 3, source: "Kompendiet kap. 7", reviewed: true },

  { id: "dbq-15", topic: "transformation", difficulty: 2,
    question: "Work(EmployeeNo, ProjectNo, Hours) uppstår ur en M:N-relation. Vad gäller för Hours?",
    options: [
      { text: "Det är ett icke-nyckelattribut utanför den sammansatta primärnyckeln", explain: "Ingick Hours i nyckeln kunde samma par förekomma två gånger med olika timmar." },
      { text: "Det ingår i primärnyckeln, eftersom det kommer från relationen själv", explain: "Då skulle samma anställd kunna finnas på samma projekt flera gånger." },
      { text: "Det blir en främmande nyckel mot en ny relation som lagrar timmarna", explain: "Relationsattribut läggs direkt i kopplingsrelationen som vanliga attribut." },
      { text: "Det flyttas till Employee, eftersom timmarna beskriver den anställda", explain: "Timmarna beskriver paret anställd–projekt, inte den anställda ensam." }
    ],
    correct: 0, source: "Kompendiet kap. 7", reviewed: true },

  { id: "dbq-16", topic: "transformation", difficulty: 2,
    question: "Hur bildas primärnyckeln i relationen för en svag entitet?",
    options: [
      { text: "Av den partiella nyckeln ensam, eftersom den är unik inom sin ägare", explain: "Unik inom ägaren räcker inte — RoomNo upprepas mellan hotellen." },
      { text: "Av ägarens primärnyckel ensam, eftersom den svaga entiteten saknar egen nyckel", explain: "Ägarens nyckel skiljer inte två rum på samma hotell åt." },
      { text: "Av ägarens primärnyckel som främmande nyckel tillsammans med den partiella nyckeln", explain: "Kombinationen HotelName + RoomNo är unik och speglar beroendet i ER-modellen." },
      { text: "Av ett nytt löpnummer, eftersom kombinationen inte kan vara nyckel", explain: "Löpnummer är fysisk design; kombinationen är precis vad regeln föreskriver." }
    ],
    correct: 2, source: "Kompendiet kap. 7", reviewed: true },

  { id: "dbq-31", topic: "transformation", difficulty: 3,
    question: "Häftets uppgift 8: Department identifieras av det sammansatta attributet Id med delarna Name och Address, och har dessutom Description. Hur ser facit ut för Department?",
    options: [
      { text: "Department(Name, Address, Description) med primärnyckel {Name, Address}", explain: "Det sammansatta Id följer inte med, bara delarna, och de bildar tillsammans nyckeln. Facit: uppgift 8." },
      { text: "Department(Id, Name, Address, Description) med primärnyckel Id", explain: "Regel 1: ett sammansatt attribut ingår inte självt i relationen, bara dess atomära delar." },
      { text: "Department(Id, Description) med Name och Address i en egen relation", explain: "Delarna ska in i samma relation som entiteten — en egen relation är flervärdesregeln, och Id är inte flervärt." },
      { text: "Department(Name, Address, Description) med primärnyckel Name ensamt", explain: "Identifieraren är hela kombinationen; Name ensamt är inte unikt enligt modellen." }
    ],
    correct: 0, source: "Kompendiet kap. 7 · övningshäftet uppgift 8", reviewed: true },

  { id: "dbq-21", topic: "normalisering", difficulty: 3,
    question: "A → B, B → A och B → C gäller. Är C transitivt beroende av A?",
    options: [
      { text: "Ja, eftersom A bestämmer B och B bestämmer C", explain: "Kedjan finns, men B → A gör att undantaget i definitionen slår till." },
      { text: "Ja, eftersom C inte ingår i någon kandidatnyckel", explain: "Att C är icke-primärt räcker inte; mellanledet får inte vara en nyckel." },
      { text: "Nej, eftersom C beror direkt på B och inte på A", explain: "C beror visserligen av B, men skälet är ett annat." },
      { text: "Nej, eftersom B → A gör B till en kandidatnyckel", explain: "Definitionen undantar fallet Y → X; då är Y själv en kandidatnyckel." }
    ],
    correct: 3, source: "Kompendiet kap. 8", reviewed: true },

  { id: "dbq-23", topic: "normalisering", difficulty: 3,
    question: "R(A, B, C, D, E) har beroendena {A,B} → C, C → D och D → E. Vilken är den högsta normalformen?",
    options: [
      { text: "1NF, eftersom nyckeln {A,B} är sammansatt och C beror på den", explain: "C beror på hela nyckeln {A,B}, inte på en äkta delmängd — inget partiellt beroende." },
      { text: "2NF, eftersom D och E beror transitivt på nyckeln via C", explain: "Kandidatnyckel {A,B}; C beror på hela nyckeln, men {A,B} → C → D → E är transitivt. Facit: 2NF." },
      { text: "3NF, eftersom inget attribut beror på en äkta delmängd av nyckeln", explain: "Det ger bara 2NF. 3NF kräver dessutom att inget icke-primärattribut beror transitivt." },
      { text: "3NF, eftersom D och E beror var för sig på ett enda attribut", explain: "Att determinanten är enkel spelar ingen roll; C och D är inte kandidatnycklar, så kedjan är transitiv." }
    ],
    correct: 1, source: "Kompendiet kap. 8 · övningshäftet uppgift 10:3", reviewed: true },

  { id: "dbq-26", topic: "fysisk", difficulty: 2,
    question: "Vad skiljer UNIQUE från PRIMARY KEY?",
    options: [
      { text: "UNIQUE gäller bara textkolumner, PRIMARY KEY bara heltalskolumner", explain: "Datatypen har inget med constrainttypen att göra." },
      { text: "UNIQUE upprätthåller referensintegritet, PRIMARY KEY gör det inte", explain: "Referensintegritet är FOREIGN KEY:s uppgift." },
      { text: "UNIQUE tillåter NULL; PRIMARY KEY är NOT NULL och det finns bara en per tabell", explain: "Därför hamnar naturliga nycklar som UNIQUE när surrogatnyckeln tagit över." },
      { text: "UNIQUE kontrolleras bara vid INSERT, PRIMARY KEY även vid UPDATE", explain: "Båda gäller alltid, oavsett operation." }
    ],
    correct: 2, source: "Kompendiet kap. 9", reviewed: true },

  { id: "dbq-28", topic: "fysisk", difficulty: 3,
    question: "Vad måste följa med när en surrogatnyckel blir primärnyckel?",
    options: [
      { text: "Den naturliga nyckeln tas bort, eftersom två nycklar ger redundans", explain: "Då förloras affärsregeln att till exempel anställningsnummer är unika." },
      { text: "Den naturliga nyckeln görs till främmande nyckel mot surrogatnyckeln", explain: "En kolumn i samma tabell refererar inte sin egen rad." },
      { text: "Surrogatnyckeln får ett CHECK-villkor som binder den till den naturliga", explain: "CHECK uttrycker domäner, inte kopplingen mellan två nycklar." },
      { text: "Den naturliga nyckeln behålls som UNIQUE, annars förloras affärsregeln om unikhet", explain: "EmployeeID är surrogat primärnyckel; EmpNo behålls som naturlig nyckel med UNIQUE och NOT NULL, så att entitetsintegriteten bevaras." }
    ],
    correct: 3, source: "Kompendiet kap. 9", reviewed: true },

  { id: "dbq-30", topic: "fysisk", difficulty: 2,
    question: "Varför ska constraints namnges enligt kodstandarden, som PK_Employee_EmployeeID?",
    options: [
      { text: "SQL Server vägrar att skapa constraints som saknar ett explicit angivet namn", explain: "Servern hittar på ett namn själv — men ett obegripligt." },
      { text: "Namnet avgör i vilken ordning constraints kontrolleras vid varje INSERT", explain: "Kontrollordningen styrs inte av namnen." },
      { text: "Namnet gör att constrainten indexeras automatiskt av databashanteraren", explain: "Namngivning skapar inga index." },
      { text: "Felmeddelanden blir begripliga och constrainten kan refereras i ALTER TABLE", explain: "Praktiska skäl: förstå felet och kunna peka på constrainten senare." }
    ],
    correct: 3, source: "Kompendiet kap. 9", reviewed: true },

  { id: "dbq-32", topic: "fysisk", difficulty: 3,
    question: "Häftets uppgift 18: entiteten B har den sammansatta identifieraren {b1, b2} och attributet b3, och tabellen ska använda surrogatnyckel. Vilka PRIMARY KEY- och UNIQUE-constraints har facit för B?",
    options: [
      { text: "PRIMARY KEY (B1, B2) direkt på den naturliga nyckeln; ingen surrogatnyckel behövs", explain: "Uppgiften kräver surrogatnyckel för varje entitetstabell; den naturliga nyckeln bevaras som UNIQUE." },
      { text: "BID INTEGER IDENTITY(1,1) som PRIMARY KEY, plus UNIQUE (B1) och UNIQUE (B2) var för sig", explain: "Två separata UNIQUE förbjuder upprepade b1-värden, men identifieraren är kombinationen — ett UNIQUE per nyckel." },
      { text: "BID INTEGER IDENTITY(1,1) som PRIMARY KEY och UNIQUE (BID); B1 och B2 som vanliga kolumner", explain: "Då förloras affärsregeln att kombinationen b1, b2 är unik, och UNIQUE på surrogatnyckeln tillför inget." },
      { text: "BID INTEGER IDENTITY(1,1) som PRIMARY KEY, plus UNIQUE (B1, B2) som ett enda constraint", explain: "Facit: PK_B_BID PRIMARY KEY (BID) och UQ_B_B1_B2 UNIQUE (B1, B2) — den sammansatta naturliga nyckeln bevaras med ett UNIQUE över båda, och B1 och B2 är dessutom NOT NULL." }
    ],
    correct: 3, source: "Kompendiet kap. 9 · övningshäftet uppgift 18", reviewed: true },

  // Kapitel 10 — ur de parkerade SQL-frågorna (Fö1-leveransen), omskrivna till mallens format.
  { id: "db1-11", topic: "sql", difficulty: 1,
    question: "Vad gör nyckelordet AS i en select list?",
    options: [
      { text: "Det byter namn på kolumnerna i den lagrade tabellen permanent", explain: "AS rör bara resultatet — kolumnnamnen i tabellen ändras med ALTER TABLE, inte med en SELECT." },
      { text: "Det namnger de härledda resultatkolumnerna i just den här frågan", explain: "AS namnger resultatkolumner, och ett uttryck utan AS får inget namn alls: '(No column name)'. Det ändrar inget i den lagrade tabellen." },
      { text: "Det skapar en vy som andra frågor sedan kan referera till", explain: "En vy skapas med CREATE VIEW. AS i en select list lever bara i den frågan." },
      { text: "Det konverterar kolumnens datatyp till den typ som anges efter aliaset", explain: "Konvertering görs med CAST. AS ger ett namn, ingen typ." },
    ],
    correct: 1, source: "Kompendiet kap. 10 · föreläsning 1–2", reviewed: false },

  { id: "db1-13", topic: "sql", difficulty: 2,
    question: "Frågan SELECT PatientName, UnitAddress FROM dbo.Patient ger felet \"Invalid column name 'UnitAddress'\". Varför?",
    options: [
      { text: "UnitAddress är felstavat i förhållande till kolumnnamnet i dbo.Unit", explain: "Namnet stämmer. Felet är att tabellen som har kolumnen inte är med i frågan." },
      { text: "Endast dbo.Patient är angiven efter FROM, så dbo.Unit ligger utanför frågans scope", explain: "PatientName finns i Patient och UnitAddress i Unit. En fråga kan bara se kolumner i de tabeller som står efter FROM — Unit måste joinas in." },
      { text: "UnitAddress kräver ett tabellprefix eftersom kolumnnamnet finns i två tabeller", explain: "Prefix behövs när ett namn är tvetydigt mellan tabeller i FROM. Här finns kolumnen inte alls i frågans tabeller." },
      { text: "Kolumnen är skyddad och kräver att schemat dbo anges explicit i frågan", explain: "Schemat är redan angivet. Ingen kolumn är 'skyddad' på det sättet." },
    ],
    correct: 1, source: "Kompendiet kap. 10 · föreläsning 1–2", reviewed: false },

  { id: "db1-15", topic: "sql", difficulty: 1,
    question: "Vad räknar COUNT(*)?",
    options: [
      { text: "Antalet unika värden i tabellens primärnyckelkolumn, dubbletter borträknade", explain: "COUNT(*) vet inget om nycklar och räknar inte unika värden — det gör COUNT(DISTINCT kolumn)." },
      { text: "Antalet rader i indata, oavsett vilka attribut som finns eller är NULL", explain: "COUNT(*) räknar rader, i hela resultatet eller per grupp med GROUP BY. COUNT(kolumn) räknar i stället raderna där kolumnen inte är NULL." },
      { text: "Antalet kolumner som räknas upp i frågans select list, inklusive uttryck", explain: "Asterisken betyder inte 'alla kolumner' här — COUNT räknar rader, inte kolumner." },
      { text: "Antalet rader där samtliga attribut har ett värde skilt från NULL", explain: "NULL-värden spelar ingen roll för COUNT(*); de spelar roll för COUNT(kolumn)." },
    ],
    correct: 1, source: "Kompendiet kap. 10 · föreläsning 2–3", reviewed: false },

  { id: "db1-16", topic: "sql", difficulty: 2,
    question: "Varför är det fel att slå upp E2:s lön och sedan skriva WHERE EmpSalary = 55000 i en andra fråga?",
    options: [
      { text: "Därför att literalen måste anges som N'55000' för att jämförelsen ska bli giltig i T-SQL", explain: "N-prefixet gäller unicode-strängar. En numerisk jämförelse med 55000 är giltig — problemet är ett annat." },
      { text: "Därför att jämförelser mot decimaltal alltid kräver en explicit CAST i T-SQL-dialekten", explain: "Ingen CAST behövs för att jämföra ett belopp med ett tal." },
      { text: "Därför att 55000 är kopierat ur dagens data och blir tyst inaktuellt när lönen ändras", explain: "Frågan svarar på 'vem tjänar 55000?' i stället för 'vem tjänar lika mycket som E2?'. Delfrågan 'vad tjänar E2?' ska stå som en skalär underfråga där värdet behövs — en fråga per delfråga." },
      { text: "Därför att två frågor alltid är långsammare än en enda fråga med en underfråga", explain: "Prestanda är inte skälet; en underfråga kan vara både snabbare och långsammare. Skälet är att svaret ska följa datan." },
    ],
    correct: 2, source: "Kompendiet kap. 10 · föreläsning 2–3", reviewed: false },

  // Punkt 7 (2026-09-07): omviktning mot tentan — påståenden mot diagram, tentans sant/falskt-form, DDL- och SQL-frågor med underlag. Alla reviewed: false.
  { id: "dbq-33", topic: "grunder", difficulty: 1,
    question: "Uppgift 1 på tentan ger +5 per rätt markerat påstående och −3 per fel markerat. Vad följer av det?",
    options: [
      { text: "Markera bara påståenden du kan härleda ur notationen, och för resten bara om du är mer än ungefär 40 procent säker", explain: "Brytpunkten är 3/8: vid 40 procent säkerhet är väntevärdet 0,4 · 5 − 0,6 · 3 = 0. Ett omarkerat sant påstående kostar inget." },
      { text: "Markera alla påståenden du inte kan utesluta — ett rätt är alltid värt mer än ett fel kostar", explain: "Ett rätt ger 5 och ett fel kostar 3; under 40 procents säkerhet förlorar du i snitt på att markera." },
      { text: "Lämna uppgiften obesvarad om fler än hälften av påståendena känns osäkra, för då är väntevärdet negativt", explain: "Obesvarad uppgift ger 0, men de påståenden du kan härleda ger säkra poäng — markera dem." },
      { text: "Markera exakt fem påståenden, eftersom fyra till sex alltid är sanna och fem är medelvärdet av dem", explain: "Antalet sanna är 4–6, men vilka de är avgörs av diagrammet, inte av statistik." },
    ],
    correct: 0, source: "Kompendiet kap. 1 · tentans uppgift 1", reviewed: false },

  { id: "dbq-34", topic: "relationsmodellen", difficulty: 2,
    question: "SELECT Name FROM Employee ger två identiska rader Mary från två olika anställda. Vad säger det om resultatet?",
    options: [
      { text: "Att SQL-resultatet är en bag som räknar upprepningar; relationen är en mängd och DISTINCT ger den", explain: "Med bara attributet Name är de två raderna samma kompletta tupel. SQL behåller båda — resultatet är en bag. DISTINCT tar bort dubblettraderna och ger mängden." },
      { text: "Att tabellen bryter mot relationsmodellens förbud mot dubblettupler och måste normaliseras om", explain: "Tabellen Employee har inga dubbletter — de två anställda skiljer sig i EmployeeNo. Det är resultatet som är en bag." },
      { text: "Att de två anställda är samma tupel i tabellen, eftersom alla värden i resultatet är lika", explain: "Resultatet visar bara Name. I tabellen är tuplerna olika, med olika EmployeeNo." },
      { text: "Att frågan saknar ORDER BY, vilket gör att samma rad kan visas mer än en gång i resultatet", explain: "ORDER BY styr ordningen, inte antalet rader. Upprepningen kommer av att SQL-resultatet är en bag." },
    ],
    correct: 0, source: "Kompendiet kap. 2 · föreläsning 5", reviewed: false },

  { id: "dbq-35", topic: "relationsmodellen", difficulty: 1,
    question: "En fjärde anställd registreras i EMPLOYEE(EmployeeNo, Name, WorkEmail). Vad har ändrats?",
    options: [
      { text: "Både schemat och värdet, eftersom varje ny tupel lägger till en rad i schemat", explain: "Schemat har inga rader — det namnger relationen och attributen." },
      { text: "Domänen för EmployeeNo, som nu måste rymma ytterligare ett tillåtet värde", explain: "Domänen är mängden tillåtna värden, inte de använda. E-422 var tillåtet redan innan tupeln fanns." },
      { text: "Det aktuella relationsvärdet — en tupel till, samma tre attribut, oförändrat schema", explain: "Relationsschemat bestämmer formen; det aktuella värdet är tuplerna just nu. En ny anställd är en ny tupel: kardinaliteten går från tre till fyra, graden är fortfarande tre." },
      { text: "Schemat, eftersom relationen nu har fler tupler än förut och graden ökar med en", explain: "Graden räknar attribut och ändras bara om schemat ändras. Fler tupler ändrar kardinaliteten." },
    ],
    correct: 2, source: "Kompendiet kap. 2 · föreläsning 5", reviewed: false },

  { id: "dbq-36", topic: "nycklar", difficulty: 2,
    question: "Regeln säger att EmployeeNo är unikt. Är {EmployeeNo, Name} en kandidatnyckel?",
    options: [
      { text: "Nej — Name kan tas bort utan att unikheten förloras, så mängden är inte minimal", explain: "Kandidatnyckel kräver både unikhet och minimalitet. {EmployeeNo, Name} är unik men inte minimal: EmployeeNo räcker ensamt." },
      { text: "Ja — mängden är unik i varje giltig population, och mer än så kräver definitionen inte", explain: "Definitionen har två villkor. Unikhet är det ena; minimalitet är det andra, och det brister här." },
      { text: "Ja, men bara om Name också är unikt; annars räknas det som en sammansatt nyckel", explain: "Om Name vore unikt vore {Name} en egen kandidatnyckel. Paret blir inte en kandidatnyckel av det." },
      { text: "Nej — en kandidatnyckel får bara bestå av ett enda attribut, aldrig av två", explain: "Sammansatta kandidatnycklar finns, som {EmployeeNo, ProjectNo} i WORKS_ON. Felet här är minimaliteten." },
    ],
    correct: 0, source: "Kompendiet kap. 3 · föreläsning 5", reviewed: false },

  { id: "dbq-37", topic: "nycklar", difficulty: 3,
    question: "WORKS_ON har en giltig främmande nyckel mot PROJECT och alla referenser träffar. Project deltar totalt i WorksOn. Vad garanterar den främmande nyckeln?",
    options: [
      { text: "Att ett projekt bara kan förekomma en gång i WORKS_ON, eftersom nyckeln refererar primärnyckeln", explain: "Ett främmandenyckelvärde får upprepas. Flera anställda på samma projekt är giltigt." },
      { text: "Att projekt inte kan raderas alls så länge tabellen WORKS_ON finns i databasen", explain: "Referensintegriteten hindrar radering av ett projekt som refereras — inte av alla projekt." },
      { text: "Att varje WORKS_ON-rad pekar på ett existerande projekt — inte att varje projekt pekas på", explain: "Främmande nycklar tvingar inte fram deltagande. Ett projekt utan WORKS_ON-rad bryter mot det totala deltagandet men mot ingen constraint — regeln ligger utanför det främmande nycklar kan garantera." },
      { text: "Att varje projekt förekommer i WORKS_ON minst en gång, eftersom deltagandet är totalt", explain: "Det totala deltagandet står i diagrammet, inte i den främmande nyckeln. Den kontrollerar bara referenserna." },
    ],
    correct: 2, source: "Kompendiet kap. 3 · föreläsning 5", reviewed: false },

  { id: "dbq-38", topic: "er", difficulty: 1,
    diagram: "pastaenden-forening",
    question: "Enligt diagrammet: kan två föreningar ha samma namn?",
    options: [
      { text: "Nej — namn är ett attribut på Förening, och attribut identifierar sin entitet", explain: "Bara understrukna attribut identifierar. Vanliga attribut får upprepas mellan entiteter." },
      { text: "Nej — föreningsNo och namn är tillsammans en sammansatt identifierare", explain: "En sammansatt identifierare ritas som en understruken förälder med delattribut. Här är bara föreningsNo understruket." },
      { text: "Ja, men bara om föreningarna har olika lag, eftersom Har skiljer dem åt", explain: "Har säger inget om namnen. Frågan avgörs av understrykningen ensam." },
      { text: "Ja — namn är inte understruket; bara föreningsNo identifierar en förening", explain: "'Två X kan ha samma Y' är sant när Y inte är understruket. Att föreningar sällan heter lika i verkligheten spelar ingen roll — diagrammet förbjuder det inte." },
    ],
    correct: 3, source: "Kompendiet kap. 6 · tentans uppgift 1", reviewed: false },

  { id: "dbq-39", topic: "er", difficulty: 2,
    diagram: "pastaenden-bibliotek",
    question: "Enligt diagrammet: identifieras en låntagare av kombinationen av låntagarNo och bokens ISBN?",
    options: [
      { text: "Nej — låntagarNo är understruket med hel linje och identifierar låntagaren ensamt", explain: "Låntagare är en stark entitetstyp med egen identifierare. Att låntagaren deltar i Lånar gör inte böckerna till en del av identiteten — bara en svag entitet med streckad partiell nyckel identifieras via en annan entitet." },
      { text: "Ja — Lånar kopplar varje låntagare till exemplar, så ISBN ingår i identiteten", explain: "Deltagande i en relation ändrar inte identiteten. Låntagare har enkel rektangel och hel understrykning." },
      { text: "Ja — N bredvid Exemplar gör låntagarens identitet beroende av vad som lånats", explain: "Ratio-etiketter handlar om antal, inte om identitet." },
      { text: "Nej — en låntagare identifieras av låntagarNo tillsammans med namn, båda attribut på Låntagare", explain: "Namn är inte understruket. Bara låntagarNo identifierar." },
    ],
    correct: 0, source: "Kompendiet kap. 6 · tentans uppgift 1", reviewed: false },

  { id: "dbq-40", topic: "relationstyper", difficulty: 1,
    diagram: "pastaenden-forening",
    question: "Enligt diagrammet: måste en förening ha minst ett lag?",
    options: [
      { text: "Ja — Har är en identifierande relation, och den är alltid obligatorisk åt båda håll", explain: "Den identifierande relationen gör deltagandet obligatoriskt för den svaga sidan, inte för ägaren. Ett projekt utan uppgifter är tillåtet." },
      { text: "Nej — 1 bredvid Förening betyder att en förening har högst ett lag, inte minst ett", explain: "1 bredvid Förening läses tvärs över: varje lag har högst en förening. Det är linjen vid Förening som avgör frågan." },
      { text: "Nej — linjen vid Förening i Har är enkel, så en förening får finnas utan lag", explain: "'Måste' läses vid den egna änden: enkel linje vid Förening betyder partiellt deltagande. Dubbellinjen sitter vid Lag och säger något om lagen, inte om föreningarna." },
      { text: "Ja — N bredvid Lag betyder att varje förening har många lag, alltså minst ett", explain: "N anger ett maximum, läst tvärs över: en förening får ha många lag. Det säger inget om minimum." },
    ],
    correct: 2, source: "Kompendiet kap. 6 · tentans uppgift 1", reviewed: false },

  { id: "dbq-41", topic: "relationstyper", difficulty: 2,
    diagram: "pastaenden-forening",
    question: "Enligt diagrammet: kan ett lag ha hemmaarena på flera arenor?",
    options: [
      { text: "Ja — N bredvid Lag i Hemma betyder att lag får ha många arenor", explain: "N bredvid Lag läses tvärs över och säger hur många lag en arena får ha. Fel ände." },
      { text: "Ja — linjen vid Lag i Hemma är enkel, och enkel linje betyder fritt antal", explain: "Linjen anger deltagande (noll eller minst en), aldrig antal. Antalet står i ratio-etiketten." },
      { text: "Nej — dubbellinjen vid Arena tvingar varje lag till exakt en arena", explain: "Det finns ingen dubbellinje i Hemma. Svaret är rätt, men skälet läser fel symbol." },
      { text: "Nej — 1 bredvid Arena, läst tvärs över, ger varje lag högst en arena", explain: "'Kan ha flera Y' avgörs av etiketten bredvid Y. Bredvid Arena står 1: varje lag får ha högst en arena. Enkel linje betyder bara att ett lag får sakna arena." },
    ],
    correct: 3, source: "Kompendiet kap. 6 · tentans uppgift 1", reviewed: false },

  { id: "dbq-42", topic: "relationstyper", difficulty: 2,
    diagram: "pastaenden-forening",
    question: "Enligt diagrammet: måste en spelare vara medlem i exakt en förening?",
    options: [
      { text: "Ja — linjen vid Spelare i MedlemI är dubbel och 1 bredvid Förening ger högst en", explain: "'Exakt en' kräver båda: dubbellinjen vid den egna änden ger minst en, och 1 tvärs över ger högst en. Båda finns." },
      { text: "Ja — men bara för att Förening deltar totalt i MedlemI, vilket dubbellinjen visar", explain: "Dubbellinjen sitter vid Spelare, inte vid Förening. Den säger något om spelarna." },
      { text: "Nej — dubbellinjen ger minst en förening, och N bredvid Spelare tillåter flera", explain: "N bredvid Spelare läses tvärs över: en förening får ha många spelare. Antalet föreningar per spelare står bredvid Förening, och där står 1." },
      { text: "Nej — spelaren måste vara medlem, men 1 bredvid Förening säger högst en, inte exakt en", explain: "Högst en tillsammans med minst en (dubbellinjen) är exakt en." },
    ],
    correct: 0, source: "Kompendiet kap. 6 · tentans uppgift 1", reviewed: false },

  { id: "dbq-43", topic: "relationstyper", difficulty: 3,
    diagram: "pastaenden-forening",
    question: "Enligt diagrammet: måste alla spelare i ett lag vara medlemmar i lagets förening?",
    options: [
      { text: "Nej — spelare får inte vara medlemmar alls, eftersom MedlemI bara gäller föreningar", explain: "MedlemI är relationen mellan Spelare och Förening; dubbellinjen vid Spelare gör medlemskap obligatoriskt." },
      { text: "Nej — ingen symbol binder ihop MedlemI och SpelarI; regeln skulle behöva stå i text", explain: "Flerstegspåstående. MedlemI binder spelaren till en förening, SpelarI till lag, Har lag till förening — men inget säger att vägarna ska sammanfalla. Ett 'måste' är sant bara om en restriktion kräver det." },
      { text: "Ja — MedlemI och SpelarI går båda via Förening, så kopplingen följer av diagrammet", explain: "Att två vägar leder till Förening betyder inte att de leder till samma förening. Den kopplingen saknar symbol." },
      { text: "Ja — dubbellinjen vid Spelare i MedlemI tvingar medlemskap i lagets förening", explain: "Dubbellinjen kräver medlemskap i någon förening, inte i en viss." },
    ],
    correct: 1, source: "Kompendiet kap. 6 · tentans uppgift 1", reviewed: false },

  { id: "dbq-44", topic: "svaga", difficulty: 2,
    diagram: "pastaenden-bibliotek",
    question: "Enligt diagrammet: identifieras ett exemplar av exemplarnumret ensamt?",
    options: [
      { text: "Ja — Exemplar har egen rektangel och därmed egen identitet oberoende av Bok", explain: "Rektangeln är dubbel: svag entitetstyp. Identiteten beror på ägaren." },
      { text: "Nej — ett exemplar identifieras av exNo tillsammans med låntagarnumret i Lånar", explain: "Lånar är en vanlig relation, inte identifierande (enkel romb). Ägaren är Bok, via dubbelromben FinnsSom." },
      { text: "Nej — streckad understrykning är partiell: identiteten är {isbn, exNo} via FinnsSom", explain: "Dubbel rektangel, dubbel romb och streckad understrykning hör ihop: Exemplar är svag under Bok, och exNo skiljer bara exemplar av samma bok åt. Två böcker kan båda ha ett exemplar nummer 1." },
      { text: "Ja — exNo är understruket, och varje understrykning i Chen-notation betyder identifierare", explain: "Hel understrykning betyder identifierare; streckad betyder partiell identifierare, som bara gäller inom ägaren." },
    ],
    correct: 2, source: "Kompendiet kap. 6 · tentans uppgift 1", reviewed: false },

  { id: "dbq-45", topic: "svaga", difficulty: 2,
    diagram: "pastaenden-bibliotek",
    question: "Enligt diagrammet: måste en låntagare ha en fadder?",
    options: [
      { text: "Ja — 1 vid fadderrollen betyder att varje låntagare har exakt en fadder", explain: "1 är ett maximum: högst en fadder. Exakt en hade krävt en dubbellinje." },
      { text: "Ja — en unär relation gäller alla instanser av entitetstypen, annars vore den meningslös", explain: "Unära relationer läses som binära: varje roll har sitt eget deltagande, och här är båda partiella." },
      { text: "Nej — N vid adeptrollen betyder att bara några av låntagarna kan vara adepter", explain: "N säger att en fadder får ha många adepter. Det säger inget om vilka som deltar." },
      { text: "Nej — linjerna i Fadder är enkla i båda rollerna, så en låntagare får sakna fadder", explain: "'Måste' avgörs av deltagandelinjen. Båda linjerna i den unära relationen är enkla: partiellt deltagande i båda rollerna. 1 vid fadderrollen anger högst en, inte minst en." },
    ],
    correct: 3, source: "Kompendiet kap. 6 · tentans uppgift 1", reviewed: false },

  { id: "dbq-46", topic: "svaga", difficulty: 3,
    diagram: "pastaenden-bibliotek",
    question: "Enligt diagrammet: kan en låntagare vara sin egen fadder?",
    options: [
      { text: "Ja — Chen-notationen saknar symbol för regeln; finns den står den i uppgiftstexten", explain: "Ratio och deltagandelinjer hindrar varken självlänkar eller cykler i en unär relation. Regler som 'ingen är sin egen fadder' blir textuella verksamhetsregler — det som inte förbjuds i diagrammet är tillåtet." },
      { text: "Nej — samma entitet kan aldrig fylla båda rollerna i en och samma unära relation", explain: "Inget i notationen hindrar att r = ⟨e1, e1⟩. Föreläsningen visar självlänken som ett giltigt, om än oönskat, fall." },
      { text: "Nej — 1 vid fadderrollen utesluter att fadder och adept kan vara samma person", explain: "1 begränsar antalet faddrar per adept till högst en. Det säger inget om vem faddern är." },
      { text: "Ja — dubbelrollen är just vad de två rollnamnen fadder och adept är till för att uttrycka", explain: "Rollnamnen skiljer ändarna åt så att diagrammet blir läsbart. Att samma person får inneha båda följer av att inget förbjuder det, inte av namnen." },
    ],
    correct: 0, source: "Kompendiet kap. 6 · tentans uppgift 1", reviewed: false },

  { id: "dbq-47", topic: "normalisering", difficulty: 2,
    context: "R(A, B, C, D, E, F, G)\n{A, B} → C\nB → D\nD → E\nC → {F, G}\n\nSchema 1: R(A, B, C, D, E, F, G)\nSchema 2: R1(A, B, C, F, G), R2(D, E)\nSchema 3: R1(A, B, C), R2(B, D), R3(D, E), R4(C, F, G)",
    question: "Påstående: relation R i schema 1 är i 2NF eller högre.",
    options: [
      { text: "Falskt — F och G beror transitivt på kandidatnyckeln via C, vilket 2NF förbjuder", explain: "Transitiva beroenden prövas i 3NF, inte i 2NF. Slutsatsen är rätt men skälet är fel: det är B → D som bryter 2NF." },
      { text: "Falskt — äkta delmängden B av kandidatnyckeln {A, B} bestämmer icke-primärattributet D", explain: "Kandidatnyckel {A, B} (A och B står inte till höger om någon pil). B → D: B är en äkta delmängd av nyckeln och D är icke-primärt. 2NF bryts; R är i 1NF." },
      { text: "Sant — kandidatnyckeln {A, B} bestämmer alla attribut, direkt eller transitivt", explain: "Att nyckeln når allt är vad som gör den till nyckel. 2NF frågar om någon äkta delmängd av nyckeln bestämmer ett icke-primärattribut, och B → D gör det." },
      { text: "Sant — alla attribut är atomära och inget icke-primärattribut beror på en annan kandidatnyckel", explain: "Atomära värden ger 1NF. Det finns bara en kandidatnyckel, och B → D är det partiella beroendet som fäller 2NF." },
    ],
    correct: 1, source: "Kompendiet kap. 8 · tentans uppgift 3a–e", reviewed: false },

  { id: "dbq-48", topic: "normalisering", difficulty: 3,
    context: "R(A, B, C, D, E, F, G)\n{A, B} → C\nB → D\nD → E\nC → {F, G}\n\nSchema 1: R(A, B, C, D, E, F, G)\nSchema 2: R1(A, B, C, F, G), R2(D, E)\nSchema 3: R1(A, B, C), R2(B, D), R3(D, E), R4(C, F, G)",
    question: "Påstående: schema 2 är en nedbrytning av R där samtliga funktionella beroenden är bevarade.",
    options: [
      { text: "Sant — {A, B} → C och C → {F, G} står i R1 och D → E i R2, alltså är alla bevarade", explain: "Fyra av fem beroenden är bevarade. Det femte, B → D, är det inte, och ett räcker för att fälla påståendet." },
      { text: "Falskt — ett beroende bevaras bara om hela R står kvar i en och samma relation", explain: "Då vore ingen nedbrytning beroendebevarande. Regeln gäller per beroende, inte per relation." },
      { text: "Falskt — B → D har B i R1 och D i R2, så beroendet finns inte i någon relation", explain: "Ett beroende är bevarat om dess attribut finns i samma relation. Gå igenom dem: {A, B} → C i R1, C → F och C → G i R1, D → E i R2 — men B → D har attributen i olika relationer. Ett förlorat beroende gör påståendet falskt." },
      { text: "Sant — varje attribut ur R återfinns i någon av de två relationerna, och det räcker", explain: "Att attributen finns kvar är ett annat krav. Bevarande kräver att båda attributen i ett beroende står i samma relation." },
    ],
    correct: 2, source: "Kompendiet kap. 8 · tentans uppgift 3a–e", reviewed: false },

  { id: "dbq-49", topic: "normalisering", difficulty: 2,
    context: "R(A, B, C, D, E, F, G)\n{A, B} → C\nB → D\nD → E\nC → {F, G}\n\nSchema 1: R(A, B, C, D, E, F, G)\nSchema 2: R1(A, B, C, F, G), R2(D, E)\nSchema 3: R1(A, B, C), R2(B, D), R3(D, E), R4(C, F, G)",
    question: "Påstående: schema 2 har egenskapen lossless join.",
    options: [
      { text: "Sant — båda relationerna har en kandidatnyckel som bestämmer sina övriga attribut", explain: "Nycklar inom delrelationerna säger inget om nedbrytningen. Egenskapen gäller joinen mellan dem." },
      { text: "Sant — R1 och R2 är disjunkta, så den naturliga joinen lägger inte till några extra rader", explain: "Utan gemensamt attribut blir joinen en kartesisk produkt av alla kombinationer — inte R." },
      { text: "Falskt — lossless join kräver att varje relation i schemat är i 3NF, och R1 är det inte", explain: "Normalformen hos delrelationerna och nedbrytningens egenskaper är två olika saker. Skälet här är det saknade gemensamma attributet." },
      { text: "Falskt — R1 och R2 saknar gemensamt attribut, så ingen naturlig join ger tillbaka R", explain: "Lossless join betyder att den naturliga joinen av delrelationerna ger tillbaka R. R1(A, B, C, F, G) och R2(D, E) har inget attribut gemensamt — precis föreläsningens exempel på när egenskapen saknas." },
    ],
    correct: 3, source: "Kompendiet kap. 8 · tentans uppgift 3a–e", reviewed: false },

  { id: "dbq-50", topic: "normalisering", difficulty: 2,
    context: "R(A, B, C, D)\nA → B\nB → A\nB → C\nC → D",
    question: "Påstående: relation R har fler än en kandidatnyckel.",
    options: [
      { text: "Sant — A och B bestämmer varandra och når var för sig C och D, så båda är kandidatnycklar", explain: "A → B → C → D ger att A bestämmer allt; B → A ger att B gör detsamma. Båda är unika och minimala. Leta efter cykler som A → B, B → A — de ger flera kandidatnycklar." },
      { text: "Falskt — bara A står först i en kedja som når alla attribut, så A är enda kandidatnyckeln", explain: "B når också allt: B → A, B → C, C → D. Att A står först i uppräkningen betyder inget." },
      { text: "Falskt — B bestäms av A och kan därför inte själv vara kandidatnyckel; A är den enda", explain: "Att B bestäms av A hindrar inte att B är kandidatnyckel, så länge B själv bestämmer alla attribut — och det gör den." },
      { text: "Sant — {A, B} tillsammans bildar en sammansatt kandidatnyckel utöver A, alltså två stycken", explain: "{A, B} är inte minimal: A ensamt räcker. Kandidatnycklarna är A och B var för sig." },
    ],
    correct: 0, source: "Kompendiet kap. 8 · tentans uppgift 3a–e", reviewed: false },

  { id: "dbq-51", topic: "normalisering", difficulty: 3,
    context: "R(A, B, C, D, E, F, G)\n{A, B} → C\nB → D\nD → E\nC → {F, G}\n\nSchema 1: R(A, B, C, D, E, F, G)\nSchema 2: R1(A, B, C, F, G), R2(D, E)\nSchema 3: R1(A, B, C), R2(B, D), R3(D, E), R4(C, F, G)",
    question: "Påstående: samtliga relationer i schema 3 är i 3NF.",
    options: [
      { text: "Sant — varje relation har högst tre attribut, och relationer med så få attribut är alltid i 3NF", explain: "Antalet attribut avgör inget: R(A, B, C) med A → B och B → C är inte i 3NF." },
      { text: "Sant — i varje relation bestämmer nyckeln allt annat direkt; inga partiella eller transitiva beroenden", explain: "Pröva var och en med dess egna beroenden: R1 har {A, B} → C, R2 har B → D, R3 har D → E, R4 har C → {F, G}. I ingen av dem bestämmer en äkta delmängd av nyckeln något, och inget icke-primärattribut nås via ett annat." },
      { text: "Falskt — R4(C, F, G) har två beroende attribut, F och G, vilket ger ett transitivt beroende", explain: "F och G beror båda direkt på nyckeln C. Två attribut från samma nyckel är inte transitivitet." },
      { text: "Falskt — R2(B, D) och R3(D, E) hänger ihop via D, så E beror transitivt på B i schemat som helhet", explain: "Normalformen prövas per relation. I R3 är D nyckeln och E beror direkt på den. Beroendet B → E finns inte inom någon relation." },
    ],
    correct: 1, source: "Kompendiet kap. 8 · tentans uppgift 3a–e", reviewed: false },

  { id: "dbq-52", topic: "normalisering", difficulty: 3,
    context: "R(A, B, C, D, E, F, G)\n{A, B} → C\nB → D\nD → E\nC → {F, G}\n\nSchema 1: R(A, B, C, D, E, F, G)\nSchema 2: R1(A, B, C, F, G), R2(D, E)\nSchema 3: R1(A, B, C), R2(B, D), R3(D, E), R4(C, F, G)",
    question: "Påstående: attribut C är ett primärattribut i relation R4 i schema 3.",
    options: [
      { text: "Falskt — primärattribut avgörs av hela schemat, och där är bara A och B primära", explain: "Ett schema har inga kandidatnycklar; det har relationerna. Varje relation prövas för sig." },
      { text: "Sant — C är primärattribut i alla relationer där det förekommer, eftersom det bestämmer F och G", explain: "I R1(A, B, C) är C icke-primärt: nyckeln där är {A, B}. Egenskapen gäller per relation." },
      { text: "Sant — i R4(C, F, G) gäller C → {F, G}, så C är R4:s kandidatnyckel och därmed primärt där", explain: "Primärattribut avgörs av relationens egna kandidatnycklar. I R4 bestämmer C de två andra attributen och är ensam kandidatnyckel. Att C är icke-primärt i R spelar ingen roll — fråga alltid 'i vilken relation?'." },
      { text: "Falskt — C är icke-primärt i R, eftersom kandidatnyckeln i R är {A, B}, och det ändras inte", explain: "Det ändras. Kandidatnycklar och primärattribut byter betydelse när relationen byter." },
    ],
    correct: 2, source: "Kompendiet kap. 8 · tentans uppgift 3a–e", reviewed: false },

  { id: "dbq-53", topic: "normalisering", difficulty: 3,
    context: "R(A, B, C, D, E)\nA → B\nB → A\nB → {C, D}\nD → E",
    question: "Vilken är den högsta normalformen för R, och varför?",
    options: [
      { text: "1NF — C beror på B, som är en äkta delmängd av kandidatnyckeln {A, B}", explain: "{A, B} är inte kandidatnyckel — den är inte minimal, för A och B räcker var för sig. Enkla nycklar har inga äkta delmängder." },
      { text: "3NF — A och B bestämmer varandra, så varje beroende går via någon kandidatnyckel", explain: "A → B → C är inte transitivt eftersom B → A gäller, men D → E är det: D är icke-primärt och D → A gäller inte." },
      { text: "3NF — D → E är inte transitivt, eftersom D bestäms direkt av en kandidatnyckel", explain: "Att D bestäms av nyckeln är just första steget i transitiviteten: A → D, D → E, inte D → A." },
      { text: "2NF — kandidatnycklarna A och B är enkla, men E beror transitivt på dem via D", explain: "A och B bestämmer varandra: två kandidatnycklar, båda enkla, så 2NF kan inte brytas. A → D och D → E, och D → A gäller inte: icke-primärattributet E är transitivt beroende av kandidatnyckeln A (och av B). Alltså 2NF." },
    ],
    correct: 3, source: "Kompendiet kap. 8 · tentans uppgift 3f–g", reviewed: false },

  { id: "dbq-54", topic: "normalisering", difficulty: 2,
    context: "R(A, B, C, D)\nA → {B, C, D}",
    question: "R ska normaliseras till 3NF. Vilket är rätt svar på tentan?",
    options: [
      { text: "Ingen nedbrytning — R är redan i 3NF; att dela upp den är övernormalisering och ger poängavdrag", explain: "Kandidatnyckel A, enkel, så 2NF kan inte brytas; B, C och D beror direkt på A, inga transitiva beroenden. R är i 3NF. Uppgiften säger uttryckligen att övernormalisering ger avdrag." },
      { text: "R1(A, B), R2(A, C), R3(A, D) — ett beroende per relation ger den renaste modellen", explain: "A → {B, C, D} är tre beroenden från samma nyckel och hör i samma relation. Tre relationer är tre joins utan att någon anomali försvinner." },
      { text: "R1(A, B, C), R2(A, D) — två relationer räcker för att skilja beroendena åt och bevara nyckeln", explain: "Det finns inget att skilja åt. Nedbrytningen är lossless och beroendebevarande men onödig — övernormalisering." },
      { text: "R1(A, B, C, D) plus en kopplingsrelation R2(A) för att garantera lossless join", explain: "Lossless join gäller nedbrytningar. En relation som inte bryts ned behöver ingen kopplingsrelation." },
    ],
    correct: 0, source: "Kompendiet kap. 8 · tentans uppgift 3f–g", reviewed: false },

  { id: "dbq-55", topic: "fysisk", difficulty: 2,
    context: "CREATE TABLE Lag (\n    LagID       INTEGER IDENTITY(1,1),\n    LagNo       INTEGER NOT NULL,\n    ForeningID  INTEGER NOT NULL,\n    PRIMARY KEY (LagID),\n    FOREIGN KEY (ForeningID) REFERENCES Forening(ForeningID)\n);",
    question: "Lag är en svag entitet under Förening med lagNo som partiell nyckel. Vad saknas i tabellen enligt facit?",
    options: [
      { text: "NOT NULL ska tas bort från ForeningID — beroendet uttrycks redan av den främmande nyckeln", explain: "NOT NULL är just hur det totala deltagandet skrivs. Den främmande nyckeln ensam tillåter NULL." },
      { text: "UNIQUE (LagNo, ForeningID) — lagnumret är unikt bara inom föreningen, och det ska koden säga", explain: "Facit för svaga entiteter: egen surrogatnyckel, ägarens främmande nyckel med NOT NULL, och UNIQUE över den partiella nyckeln tillsammans med ägarens främmande nyckel. Det sista saknas." },
      { text: "IDENTITY ska tas bort — en svag entitet får ingen egen surrogatnyckel utan ärver ägarens", explain: "Tentan kräver surrogatnyckel på tabeller för både vanliga och svaga entiteter." },
      { text: "UNIQUE (LagNo) — den partiella nyckeln är en naturlig nyckel och ska vara unik i hela tabellen", explain: "Två föreningar får båda ha ett lag nummer 1. Unikheten gäller inom ägaren, därför paret." },
    ],
    correct: 1, source: "Kompendiet kap. 9 · tentans uppgift 2", reviewed: false },

  { id: "dbq-56", topic: "fysisk", difficulty: 2,
    context: "CREATE TABLE SpelarI (\n    SpelarIID   INTEGER IDENTITY(1,1),\n    SpelareID   INTEGER,\n    LagID       INTEGER,\n    PRIMARY KEY (SpelarIID),\n    FOREIGN KEY (SpelareID) REFERENCES Spelare(SpelareID),\n    FOREIGN KEY (LagID) REFERENCES Lag(LagID)\n);",
    question: "SpelarI är kopplingstabellen för M:N-relationen mellan Spelare och Lag. Vad är fel?",
    options: [
      { text: "Tabellen behöver NOT NULL på SpelarIID, annars kan IDENTITY generera NULL-värden", explain: "IDENTITY genererar alltid ett värde, och PRIMARY KEY innebär NOT NULL. Felet är att kolumnen finns alls." },
      { text: "Inget — varje tabell i uppgiften ska ha en automatiskt inkrementerande surrogatnyckel", explain: "Kravet gäller tabeller för vanliga och svaga entiteter, inte kopplingstabeller." },
      { text: "Kopplingstabellen ska inte ha egen surrogatnyckel; primärnyckeln är (SpelareID, LagID)", explain: "En kopplingstabell får ingen egen IDENTITY. Primärnyckeln är kombinationen av de två främmande nycklarna — det är vad som garanterar att varje par förekommer högst en gång." },
      { text: "De främmande nycklarna ska peka på de naturliga nycklarna SpelarNo och LagNo, inte surrogaten", explain: "Referenser går mot surrogatnycklarna. Det är en av de vanliga avdragen att peka på den naturliga nyckeln." },
    ],
    correct: 2, source: "Kompendiet kap. 9 · tentans uppgift 2", reviewed: false },

  { id: "dbq-57", topic: "fysisk", difficulty: 1,
    question: "Varje spelare måste vara medlem i exakt en förening: dubbel linje vid Spelare, 1 vid Förening. Hur skrivs det i tabellen Spelare?",
    options: [
      { text: "ForeningID INTEGER, med en CHECK som kräver att värdet finns i Forening", explain: "Att värdet finns säkras av FOREIGN KEY, inte CHECK. Och utan NOT NULL får kolumnen vara tom." },
      { text: "ForeningID INTEGER UNIQUE, så att varje spelare får en egen förening", explain: "UNIQUE skulle förbjuda två spelare i samma förening — det är 1:1, inte 1:N." },
      { text: "En kopplingstabell MedlemI med SpelareID och ForeningID som sammansatt nyckel", explain: "Kopplingstabell är M:N-regeln. MedlemI är 1:N och blir en främmande nyckel i Spelare." },
      { text: "ForeningID INTEGER NOT NULL som främmande nyckel mot Forening(ForeningID)", explain: "1:N ger främmande nyckel på många-sidan, och dubbellinjen vid Spelare blir NOT NULL på den kolumnen. Facit kommenterar varje sådan kolumn: total participation." },
    ],
    correct: 3, source: "Kompendiet kap. 9 · tentans uppgift 2", reviewed: false },

  { id: "dbq-58", topic: "sql", difficulty: 2,
    context: "SELECT\n    b.Titel,\n    AVG(hl.Betyg) AS Snitt\nFROM\n    Bok AS b\n    INNER JOIN HarLanat AS hl ON hl.Isbn = b.Isbn\nGROUP BY\n    b.Isbn;",
    question: "Vad händer när frågan körs i SQL Server?",
    options: [
      { text: "Den stoppas: Titel står i SELECT utan att stå i GROUP BY eller i ett aggregat", explain: "GROUP BY-regeln: varje kolumn i SELECT måste stå i GROUP BY eller inuti en aggregatfunktion. Felmeddelandet: Column 'Titel' is invalid in the select list … Lägg b.Titel i GROUP BY." },
      { text: "Den kör och ger en rad per bok, eftersom Isbn bestämmer Titel entydigt", explain: "SQL Server resonerar inte om funktionella beroenden. Regeln är syntaktisk: kolumnen måste stå i GROUP BY." },
      { text: "Den kör men ger en rad per titel, eftersom SELECT-listan styr grupperingen", explain: "GROUP BY styr grupperingen, inte SELECT. Och frågan kör inte alls." },
      { text: "Den stoppas: AVG kan inte användas på en kolumn ur en annan tabell än den grupperade", explain: "Aggregat får räkna över vilken kolumn som helst i den joinade radmängden." },
    ],
    correct: 0, source: "Kompendiet kap. 10 · föreläsning 2–3", reviewed: false },

  { id: "dbq-59", topic: "sql", difficulty: 2,
    question: "Uppgiften lyder: låntagare som har lånat minst tre böcker. Var hör villkoret hemma, och varför?",
    options: [
      { text: "I SELECT, som COUNT(*) >= 3 AS Villkor, så att varje rad visar om den uppfyller det", explain: "SELECT visar, filtrerar inte. Uppgiften vill ha bara de låntagare som uppfyller villkoret." },
      { text: "I HAVING, som COUNT(*) >= 3 — antalet är ett villkor på gruppen och finns först efter GROUP BY", explain: "WHERE ser en rad i taget och får inte innehålla aggregat. Antalet lån per låntagare finns först när raderna grupperats, och villkor på grupper skrivs i HAVING." },
      { text: "I WHERE, som COUNT(*) >= 3, eftersom WHERE filtrerar innan resultatet byggs upp av grupperna", explain: "WHERE får inte innehålla aggregat — SQL Server stoppar frågan. Antalet finns inte förrän efter grupperingen." },
      { text: "I ON-villkoret för joinen, eftersom det är där raderna från HarLanat kommer in i frågan", explain: "ON avgör vilka rader som matchar, en i taget. Det kan inte räkna." },
    ],
    correct: 1, source: "Kompendiet kap. 10 · föreläsning 2–3", reviewed: false },

  { id: "dbq-60", topic: "sql", difficulty: 3,
    context: "SELECT Titel\nFROM Bok\nWHERE Isbn NOT IN (\n    SELECT Isbn\n    FROM HarLanat\n    WHERE LantagarNo = 'L2'\n);",
    question: "Underfrågans lista innehåller ett NULL. Vad returnerar frågan?",
    options: [
      { text: "Alla böcker utom dem med NULL som ISBN, eftersom NULL aldrig matchar NOT IN", explain: "Det är NULL i listan som spelar roll, inte i Bok. Resultatet blir tomt för alla rader." },
      { text: "Ett fel, eftersom NOT IN kräver att underfrågan bara returnerar icke-NULL-värden", explain: "Frågan kör utan fel. Det är det som gör fällan farlig: ett tyst tomt resultat." },
      { text: "Ingen rad alls — NOT IN mot en lista med NULL blir aldrig sant; NOT EXISTS undgår det", explain: "x NOT IN (a, b, NULL) betyder x <> a AND x <> b AND x <> NULL, och en jämförelse med NULL är varken sann eller falsk. Villkoret blir aldrig sant, resultatet tomt. NOT EXISTS jämför rad för rad och har inte problemet." },
      { text: "Alla böcker som L2 inte lånat, eftersom NULL ignoreras när listan jämförs", explain: "NULL ignoreras inte — det förgiftar jämförelsen. Det är hela poängen med IS NULL i stället för = NULL." },
    ],
    correct: 2, source: "Kompendiet kap. 10 · föreläsning 2–3", reviewed: false },

  { id: "dbq-61", topic: "sql", difficulty: 2,
    question: "Uppgiften lyder: låntagare som är äldre än låntagare L4. Hur skrivs villkoret?",
    options: [
      { text: "WHERE l.Alder > 33, efter att man slagit upp L4:s ålder och skrivit in den", explain: "Då svarar frågan på 'äldre än 33', inte på uppgiften, och blir tyst inaktuell när L4 fyller år." },
      { text: "WHERE l.Alder > l4.Alder efter JOIN Lantagare AS l4 ON l4.LantagarNo = l.LantagarNo", explain: "Joinvillkoret parar varje låntagare med sig själv, så l4.Alder är alltid den egna åldern. Villkoret blir aldrig sant." },
      { text: "HAVING MAX(l.Alder) > 'L4', eftersom jämförelsen gäller ett värde ur en annan rad", explain: "'L4' är ett låntagarnummer, inte en ålder, och HAVING är för villkor på grupper." },
      { text: "WHERE l.Alder > (SELECT l4.Alder FROM Lantagare AS l4 WHERE l4.LantagarNo = 'L4')", explain: "Värdet hör till en annan rad än den som prövas. En skalär underfråga hämtar exakt ett värde på platsen där det behövs — en fråga per delfråga, och det fallet där JOIN inte räcker." },
    ],
    correct: 3, source: "Kompendiet kap. 10 · föreläsning 2–3", reviewed: false },

  { id: "dbq-62", topic: "sql", difficulty: 3,
    context: "HarLanat\nLantagarNo  Isbn  Betyg\nL1          B1    7\nL1          B2    8\nL2          B1    9\nL3          B2    5\n\nSELECT Isbn, COUNT(*) AS Antal\nFROM HarLanat\nWHERE Betyg > 6\nGROUP BY Isbn\nHAVING COUNT(*) >= 2;",
    question: "Vad returnerar frågan?",
    options: [
      { text: "B1 2 — raden (L3, B2, 5) faller bort i WHERE innan grupperingen, så B2 får bara en", explain: "Logisk ordning: WHERE först, kvar är (L1, B1, 7), (L1, B2, 8), (L2, B1, 9). GROUP BY Isbn ger B1 med 2 och B2 med 1. HAVING >= 2 behåller bara B1." },
      { text: "B1 2 och B2 2 — WHERE påverkar inte antalet, bara vilka rader som visas i resultatet", explain: "WHERE tar bort rader innan de räknas. B2:s andra rad har betyg 5 och räknas inte." },
      { text: "B1 3 och B2 1 — HAVING filtrerar inte bort någon grupp utan visar antalet före WHERE", explain: "B1 har bara två rader totalt, och HAVING tar bort grupper som inte uppfyller villkoret." },
      { text: "B2 2 — L3:s betyg 5 räknas, eftersom HAVING utvärderas före WHERE i logisk ordning", explain: "Ordningen är WHERE, GROUP BY, HAVING. Betyget 5 faller bort först av allt." },
    ],
    correct: 0, source: "Kompendiet kap. 10 · föreläsning 2–3", reviewed: false },
];
