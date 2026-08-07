export const levels = [
  {
    id: "n1",
    number: 1,
    name: "SELECT, FROM, WHERE",
    lesson: `
En SQL-fråga börjar alltid med vad du vill se och varifrån:

    SELECT kolumn1, kolumn2 FROM Tabell;

**SELECT** anger kolumnerna, **FROM** tabellen. Vill du ha alla kolumner skriver du \`SELECT *\`, men i skarp kod är det bättre att räkna upp kolumnerna — då slutar frågan inte fungera bara för att någon lägger till en kolumn i tabellen.

**WHERE** filtrerar rader:

    SELECT EmpName, EmpSalary FROM Employee WHERE EmpSalary > 30000;

Operatorer: \`=\`, \`<>\` (skilt från), \`<\`, \`>\`, \`<=\`, \`>=\`, och de kan kombineras med \`AND\`, \`OR\` och \`NOT\`. Textvärden omges av enkla citattecken: \`WHERE EmpAddress = 'Lund'\`.

**DISTINCT** tar bort dubbletter ur resultatet: \`SELECT DISTINCT EmpName FROM Employee\`.

**ORDER BY** sorterar, \`ASC\` (stigande, standard) eller \`DESC\` (fallande). Sorteringen är det sista som händer, så du kan sortera på en kolumn du beräknat i SELECT.

Tänk på ordningen frågan **skrivs** i: SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY. Databasen **utför** den däremot i en annan ordning: FROM först, sedan WHERE, sedan gruppering, och SELECT näst sist. Det förklarar varför du inte kan använda ett kolumnalias från SELECT i WHERE.
`
  },
  {
    id: "n2",
    number: 2,
    name: "Predikat: BETWEEN, LIKE, IN, NULL",
    lesson: `
Fyra predikat som gör WHERE-villkor läsbara.

**BETWEEN** är inklusive i båda ändar:

    WHERE Price BETWEEN 30000 AND 50000

**IN** ersätter en kedja av OR: \`WHERE UnitID IN (1, 3)\`.

**LIKE** matchar textmönster. \`%\` betyder noll eller fler tecken, \`_\` betyder exakt ett tecken. \`LIKE 'A%'\` hittar allt som börjar på A; \`LIKE '%son'\` allt som slutar på son; \`LIKE '_o%'\` allt där andra bokstaven är o.

**NULL** är det viktigaste och mest missförstådda. NULL betyder "värde saknas" — inte noll och inte tom sträng. Därför är \`WHERE EmployeeID = NULL\` **alltid falskt**, även för rader som saknar värde. Du måste skriva:

    WHERE EmployeeID IS NULL
    WHERE EmployeeID IS NOT NULL

Samma fälla gäller jämförelser: \`NULL > 5\` är varken sant eller falskt, det är okänt. Och \`NOT IN\` med en underfråga som kan returnera NULL ger tom resultatmängd — en klassisk bugg.
`
  },
  {
    id: "n3",
    number: 3,
    name: "Aggregatfunktioner",
    lesson: `
Aggregatfunktioner räknar ihop många rader till ett värde:

- \`COUNT(*)\` — antal rader
- \`COUNT(kolumn)\` — antal rader där kolumnen **inte** är NULL
- \`SUM\`, \`AVG\`, \`MIN\`, \`MAX\`

Skillnaden mellan \`COUNT(*)\` och \`COUNT(kolumn)\` är en tentafälla värd att minnas: har fem bilar men bara tre en ägare, ger \`COUNT(*)\` fem och \`COUNT(EmployeeID)\` tre.

Aggregat ignorerar NULL. \`AVG(EmpSalary)\` räknar bara på rader som har en lön — den behandlar inte saknade löner som nollor, vilket är rätt beteende men lätt att glömma.

Du kan ge resultatet ett läsbart namn med alias: \`SELECT AVG(EmpSalary) AS Medellon FROM Employee\`.
`
  },
  {
    id: "n4",
    number: 4,
    name: "GROUP BY och HAVING",
    lesson: `
**GROUP BY** delar raderna i grupper och kör aggregatet per grupp:

    SELECT Brand, SUM(Price) FROM Car GROUP BY Brand;

Regeln som orsakar flest felmeddelanden: **varje kolumn i SELECT måste antingen finnas i GROUP BY eller vara inuti en aggregatfunktion.** Skriver du \`SELECT Brand, LicenseNo, SUM(Price) ... GROUP BY Brand\` är det ologiskt — vilket av registreringsnumren i gruppen skulle visas? SQL Server ger fel; SQLite är slappare och plockar ett värde på måfå, vilket är värre eftersom felet blir tyst.

**HAVING** filtrerar grupperna efter att de bildats:

    SELECT Brand, COUNT(*) FROM Car GROUP BY Brand HAVING COUNT(*) > 2;

Skillnaden mot WHERE: WHERE filtrerar **rader före** grupperingen, HAVING filtrerar **grupper efter**. Vill du bara räkna dyra bilar per märke använder du WHERE; vill du bara visa märken med många bilar använder du HAVING. Båda kan förekomma i samma fråga.
`
  },
  {
    id: "n5",
    number: 5,
    name: "Joins",
    lesson: `
Joins kopplar samman tabeller på en gemensam kolumn — nästan alltid en främmande nyckel mot en primärnyckel.

    SELECT e.EmpName, u.UnitName
    FROM Employee e
    INNER JOIN Unit u ON e.UnitID = u.UnitID;

**INNER JOIN** ger bara rader som har en motpart i båda tabellerna. Har en anställd \`UnitID = NULL\` försvinner den ur resultatet.

**LEFT JOIN** (eller LEFT OUTER JOIN) behåller **alla** rader från vänstra tabellen och fyller på med NULL där motpart saknas. Det är rätt verktyg när frågan innehåller ordet "även de som inte…": alla anställda även de utan bil, alla enheter även de utan anställda.

Kombinationen LEFT JOIN + COUNT har en fälla: \`COUNT(*)\` räknar NULL-raden och ger 1 för en tom grupp. Räkna på den högra tabellens nyckel i stället — \`COUNT(e.EmployeeID)\` — då blir det 0.

**Flera joins** kedjas för att gå via en mellantabell. Många-till-många-relationer i denna databas är just sådana: Examines kopplar Employee till Patient, Suffers kopplar Patient till Illness.

**Self join** är en tabell joinad mot sig själv, med två olika alias. Används för att jämföra rader inom samma tabell, till exempel för att hitta kollegor på samma enhet. Villkoret \`e1.EmployeeID < e2.EmployeeID\` gör att varje par bara dyker upp en gång och att ingen paras med sig själv.
`
  },
  {
    id: "n6",
    number: 6,
    name: "Underfrågor",
    lesson: `
En underfråga är en fråga inuti en fråga. Vanligast i WHERE:

    SELECT EmpName FROM Employee
    WHERE EmpSalary > (SELECT AVG(EmpSalary) FROM Employee);

Det här går inte att skriva utan underfråga, eftersom du inte kan använda ett aggregat direkt i WHERE — \`WHERE EmpSalary > AVG(EmpSalary)\` är ogiltigt.

Tre former:

- **Skalär underfråga** returnerar ett enda värde och kan jämföras med \`=\`, \`>\` och så vidare.
- **Underfråga som lista** används med \`IN\`: \`WHERE IllnessID IN (SELECT IllnessID FROM Suffers)\`.
- **Korrelerad underfråga** refererar till den yttre frågan och körs en gång per yttre rad — se nästa nivå om EXISTS.

Underfråga eller join? Ofta går båda. Joinen är i regel snabbare och visar kolumner från båda tabellerna; underfrågan är läsbarare när du bara vill filtrera och inte visa något från den andra tabellen.
`
  },
  {
    id: "n7",
    number: 7,
    name: "EXISTS och mängdoperatorer",
    lesson: `
**EXISTS** testar om en underfråga returnerar minst en rad. Underfrågan är korrelerad — den refererar till den yttre raden:

    SELECT PatientName FROM Patient p
    WHERE NOT EXISTS (SELECT 1 FROM Suffers s WHERE s.PatientID = p.PatientID);

Detta är standardmönstret för "hitta de som inte har någon…". \`SELECT 1\` används för att innehållet inte spelar någon roll — bara om det finns rader eller inte.

\`NOT EXISTS\` är säkrare än \`NOT IN\`, eftersom NOT IN ger tom resultatmängd om underfrågan innehåller ett enda NULL.

**Mängdoperatorer** kombinerar två kompletta frågor som måste ha samma antal kolumner med jämförbara typer:

- **UNION** — allt ur båda, dubbletter borttagna. \`UNION ALL\` behåller dubbletter och är snabbare.
- **INTERSECT** — bara det som finns i båda.
- **EXCEPT** — det som finns i den första men inte i den andra. (I Oracle heter den MINUS.)

EXCEPT är ett elegant sätt att svara på "vilka finns inte med": alla sjukdomar minus de sjukdomar någon lider av, ger de sjukdomar ingen lider av.
`
  },
  {
    id: "n8",
    number: 8,
    name: "INSERT, UPDATE, DELETE och vyer",
    lesson: `
Hittills har du läst. Nu ändrar du.

    INSERT INTO Unit (UnitNo, UnitName, UnitAddress)
    VALUES ('U4', 'Radiology', 'Care road');

Räkna upp kolumnerna. Utan kolumnlista måste du ange värden för alla kolumner i tabellens ordning, och frågan slutar fungera så fort tabellen ändras. Identitetskolumner (\`UnitID\`) ska inte anges — databasen sätter dem.

    UPDATE Employee SET EmpSalary = EmpSalary + 2000 WHERE UnitID = 1;
    DELETE FROM Car WHERE EmployeeID IS NULL;

**Glömmer du WHERE ändrar eller raderar du varje rad i tabellen.** Vanan att skriva satsen som en SELECT först, kontrollera vilka rader som träffas, och sedan byta ut SELECT mot UPDATE eller DELETE, är värd att ta med sig ut i arbetslivet.

Främmande nycklar sätter gränser: du kan inte radera en enhet som har anställda, och inte lägga in en anställd på en enhet som inte finns. Det är hela poängen med referensintegritet.

**Vyer** är namngivna frågor som beter sig som tabeller:

    CREATE VIEW HighEarner AS
    SELECT EmpName, EmpSalary FROM Employee WHERE EmpSalary > 30000;

Därefter kan du köra \`SELECT * FROM HighEarner\`. Vyn lagrar ingen data — den kör sin fråga varje gång. Nyttan: du kapslar in komplicerad logik, och du kan ge läsrättighet till en vy utan att ge tillgång till hela tabellen bakom.
`
  }
];

export const sqlExercises = [
  { id: "sql-01", level: "n1", task: "Visa alla kolumner för samtliga enheter i sjukhuset.",
    solution: "SELECT * FROM Unit;", starter: "SELECT ", reviewed: true },

  { id: "sql-02", level: "n1", task: "Visa namnen på alla anställda.",
    solution: "SELECT EmpName FROM Employee;", reviewed: true },

  { id: "sql-03", level: "n1", task: "Visa namn och adress för alla patienter som bor i Lund.",
    solution: "SELECT PatientName, PatientAddress FROM Patient WHERE PatientAddress = 'Lund';",
    hint: "Textvärden omges av enkla citattecken.", reviewed: true },

  { id: "sql-04", level: "n1", task: "Visa varje förnamn som förekommer bland de anställda, men bara en gång per namn.",
    solution: "SELECT DISTINCT EmpName FROM Employee;",
    hint: "Två anställda heter Anna och två heter Eva.", reviewed: true },

  { id: "sql-05", level: "n1", ordered: true,
    task: "Visa namn och lön för alla anställda, sorterade med högsta lönen först.",
    solution: "SELECT EmpName, EmpSalary FROM Employee ORDER BY EmpSalary DESC;",
    hint: "ORDER BY med DESC. Den här övningen kontrollerar radordningen.", reviewed: true },

  { id: "sql-06", level: "n2", task: "Visa namn och lön för de anställda som tjänar mer än 30 000.",
    solution: "SELECT EmpName, EmpSalary FROM Employee WHERE EmpSalary > 30000;", reviewed: true },

  { id: "sql-07", level: "n2", task: "Visa registreringsnummer, märke och pris för alla bilar som kostar mellan 30 000 och 50 000 kronor, gränserna inkluderade.",
    solution: "SELECT LicenseNo, Brand, Price FROM Car WHERE Price BETWEEN 30000 AND 50000;",
    tsql: "Identiskt i SQL Server.", reviewed: true },

  { id: "sql-08", level: "n2", task: "Visa namnen på alla patienter vars namn börjar på bokstaven A.",
    solution: "SELECT PatientName FROM Patient WHERE PatientName LIKE 'A%';",
    hint: "LIKE med jokertecknet %.", reviewed: true },

  { id: "sql-09", level: "n2", task: "Visa registreringsnummer och märke för de bilar som inte tillhör någon anställd.",
    solution: "SELECT LicenseNo, Brand FROM Car WHERE EmployeeID IS NULL;",
    hint: "EmployeeID = NULL fungerar inte — fundera på varför.",
    tsql: "Identiskt i SQL Server. NULL-hanteringen är standard-SQL.", reviewed: true },

  { id: "sql-10", level: "n3", task: "Hur många patienter finns registrerade? Svara med en enda kolumn.",
    solution: "SELECT COUNT(*) FROM Patient;", reviewed: true },

  { id: "sql-11", level: "n3", task: "Vad är medellönen bland de anställda?",
    solution: "SELECT AVG(EmpSalary) FROM Employee;",
    hint: "Svaret blir ett decimaltal — det är väntat.", reviewed: true },

  { id: "sql-12", level: "n3", task: "Visa den lägsta och den högsta lönen i samma resultatrad, i den ordningen.",
    solution: "SELECT MIN(EmpSalary), MAX(EmpSalary) FROM Employee;", reviewed: true },

  { id: "sql-13", level: "n4", task: "Visa varje bilmärke tillsammans med det totala värdet av bilarna i det märket.",
    solution: "SELECT Brand, SUM(Price) FROM Car GROUP BY Brand;", reviewed: true },

  { id: "sql-14", level: "n4", task: "Visa varje patientadress tillsammans med antalet patienter som bor där.",
    solution: "SELECT PatientAddress, COUNT(*) FROM Patient GROUP BY PatientAddress;", reviewed: true },

  { id: "sql-15", level: "n4", task: "Visa de bilmärken som det finns fler än två bilar av, tillsammans med antalet.",
    solution: "SELECT Brand, COUNT(*) FROM Car GROUP BY Brand HAVING COUNT(*) > 2;",
    hint: "Filtret gäller grupper, inte rader.", reviewed: true },

  { id: "sql-16", level: "n5", task: "Visa varje anställds namn tillsammans med namnet på den enhet personen arbetar på.",
    solution: "SELECT e.EmpName, u.UnitName FROM Employee e INNER JOIN Unit u ON e.UnitID = u.UnitID;",
    starter: "SELECT e.EmpName, u.UnitName\nFROM Employee e\n", reviewed: true },

  { id: "sql-17", level: "n5", task: "Visa namnen på de patienter som ligger på enheten Trauma.",
    solution: "SELECT p.PatientName FROM Patient p INNER JOIN Unit u ON p.UnitID = u.UnitID WHERE u.UnitName = 'Trauma';",
    hint: "Du behöver joina för att kunna filtrera på enhetens namn i stället för dess id.", reviewed: true },

  { id: "sql-18", level: "n5", task: "Visa varje anställds namn tillsammans med märket på personens bil. Anställda utan bil ska också med, med tomt värde för märket.",
    solution: "SELECT e.EmpName, c.Brand FROM Employee e LEFT JOIN Car c ON e.EmployeeID = c.EmployeeID;",
    hint: "\"Ska också med\" är signalordet för LEFT JOIN.",
    tsql: "Identiskt i SQL Server. Observera däremot att RIGHT JOIN och FULL OUTER JOIN finns i SQL Server men inte i alla SQLite-versioner — kan du inte köra dem här betyder det inte att de är fel på tentan.", reviewed: true },

  { id: "sql-19", level: "n5", task: "Visa vilka anställda som undersöker vilka patienter. Två kolumner: den anställdes namn och patientens namn.",
    solution: "SELECT e.EmpName, p.PatientName FROM Employee e INNER JOIN Examines x ON e.EmployeeID = x.EmployeeID INNER JOIN Patient p ON x.PatientID = p.PatientID;",
    hint: "Examines är en mellantabell — du behöver två joins.", reviewed: true },

  { id: "sql-20", level: "n5", task: "Visa vilka sjukdomar patienten med patientnummer PP1 lider av just nu, tillsammans med startdatum.",
    solution: "SELECT i.IllnessName, s.StartDate FROM Suffers s INNER JOIN Illness i ON s.IllnessID = i.IllnessID INNER JOIN Patient p ON s.PatientID = p.PatientID WHERE p.PatientNo = 'PP1';",
    reviewed: true },

  { id: "sql-21", level: "n5", task: "Visa varje enhets namn tillsammans med antalet anställda på enheten. Enheter utan anställda ska visas med noll.",
    solution: "SELECT u.UnitName, COUNT(e.EmployeeID) FROM Unit u LEFT JOIN Employee e ON u.UnitID = e.UnitID GROUP BY u.UnitName;",
    hint: "COUNT(*) skulle ge 1 för en tom enhet. Räkna på den anställdes nyckel i stället.", reviewed: true },

  { id: "sql-22", level: "n5", ordered: true,
    task: "Visa varje patients namn tillsammans med antalet sjukdomar personen lider av just nu, med flest sjukdomar först. Patienter utan sjukdom ska med.",
    solution: "SELECT p.PatientName, COUNT(s.IllnessID) FROM Patient p LEFT JOIN Suffers s ON p.PatientID = s.PatientID GROUP BY p.PatientID, p.PatientName ORDER BY COUNT(s.IllnessID) DESC;",
    hint: "Gruppera på patientens id, inte bara namnet — flera patienter heter Anna.", reviewed: true },

  { id: "sql-23", level: "n5", task: "Visa alla par av anställda som arbetar på samma enhet. Varje par ska bara förekomma en gång, och ingen ska paras med sig själv.",
    solution: "SELECT e1.EmpName, e2.EmpName FROM Employee e1 INNER JOIN Employee e2 ON e1.UnitID = e2.UnitID AND e1.EmployeeID < e2.EmployeeID;",
    hint: "Joina tabellen mot sig själv med två alias, och använd < mellan nycklarna.", reviewed: true },

  { id: "sql-24", level: "n6", task: "Visa namn och lön för de anställda som tjänar mer än medellönen.",
    solution: "SELECT EmpName, EmpSalary FROM Employee WHERE EmpSalary > (SELECT AVG(EmpSalary) FROM Employee);",
    hint: "Medellönen måste beräknas i en underfråga — aggregat får inte stå direkt i WHERE.", reviewed: true },

  { id: "sql-25", level: "n6", task: "Visa namn och antal för de anställda som undersöker minst tre patienter.",
    solution: "SELECT e.EmpName, COUNT(*) FROM Employee e INNER JOIN Examines x ON e.EmployeeID = x.EmployeeID GROUP BY e.EmployeeID, e.EmpName HAVING COUNT(*) >= 3;",
    reviewed: true },

  { id: "sql-26", level: "n7", task: "Visa namnen på de patienter som inte lider av någon sjukdom just nu.",
    solution: "SELECT PatientName FROM Patient p WHERE NOT EXISTS (SELECT 1 FROM Suffers s WHERE s.PatientID = p.PatientID);",
    hint: "NOT EXISTS med en korrelerad underfråga.", reviewed: true },

  { id: "sql-27", level: "n7", task: "Visa namnen på de sjukdomar som ingen patient lider av just nu.",
    solution: "SELECT IllnessName FROM Illness EXCEPT SELECT i.IllnessName FROM Illness i INNER JOIN Suffers s ON i.IllnessID = s.IllnessID;",
    hint: "Alla sjukdomar minus de som förekommer i Suffers.",
    tsql: "EXCEPT finns i SQL Server med samma syntax. I Oracle heter operatorn MINUS.", reviewed: true },

  { id: "sql-28", level: "n7", task: "Visa namnen på de sjukdomar som både någon lider av just nu och som någon har lidit av tidigare.",
    solution: "SELECT IllnessName FROM Illness WHERE IllnessID IN (SELECT IllnessID FROM Suffers) INTERSECT SELECT IllnessName FROM Illness WHERE IllnessID IN (SELECT IllnessID FROM HasSuffered);",
    hint: "INTERSECT mellan två frågor som var för sig ger en lista av sjukdomsnamn.", reviewed: true },

  { id: "sql-29", level: "n8", kind: "dml",
    task: "Lägg till en ny enhet med enhetsnummer U4, namnet Radiology och adressen Care road.",
    solution: "INSERT INTO Unit (UnitNo, UnitName, UnitAddress) VALUES ('U4', 'Radiology', 'Care road');",
    check: "SELECT UnitNo, UnitName, UnitAddress FROM Unit ORDER BY UnitNo;",
    hint: "Ange inte UnitID — den sätts av databasen.",
    tsql: "Identiskt i SQL Server.", reviewed: true },

  { id: "sql-30", level: "n8", kind: "dml",
    task: "Höj lönen med 2 000 kronor för alla anställda på enheten med enhetsnummer U1.",
    solution: "UPDATE Employee SET EmpSalary = EmpSalary + 2000 WHERE UnitID = (SELECT UnitID FROM Unit WHERE UnitNo = 'U1');",
    check: "SELECT EmpNo, EmpSalary FROM Employee ORDER BY EmpNo;",
    hint: "Du kan använda en underfråga i WHERE för att slå upp enhetens id.", reviewed: true },

  { id: "sql-31", level: "n8", kind: "dml",
    task: "Radera alla bilar som inte tillhör någon anställd.",
    solution: "DELETE FROM Car WHERE EmployeeID IS NULL;",
    check: "SELECT LicenseNo FROM Car ORDER BY LicenseNo;",
    hint: "Glöm inte WHERE. Utan den raderas allt.", reviewed: true },

  { id: "sql-32", level: "n8", kind: "dml",
    task: "Skapa en vy som heter HighEarner och som visar namn och lön för de anställda som tjänar mer än 30 000.",
    solution: "CREATE VIEW HighEarner AS SELECT EmpName, EmpSalary FROM Employee WHERE EmpSalary > 30000;",
    check: "SELECT * FROM HighEarner ORDER BY EmpName;",
    tsql: "Identiskt i SQL Server. Där kan du dessutom lägga till WITH SCHEMABINDING för att hindra att tabellerna bakom vyn ändras.", reviewed: true }
];
