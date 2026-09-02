export const levels = [
  {
    id: "n1",
    number: 1,
    name: "SELECT, FROM, WHERE",
    lesson: `
En SQL-fråga börjar alltid med vad du vill se och varifrån:

    SELECT kolumn1, kolumn2 FROM Tabell;

**SELECT** anger kolumnerna, **FROM** tabellen. Vill du ha alla kolumner skriver du \`SELECT *\` — praktiskt när du snabbt vill titta, men i skarpa frågor räknar man upp kolumnerna så att frågan inte ändrar beteende när tabellen får en ny kolumn.

**SQL är deklarativt.** Det är enligt föreläsaren den viktigaste principen i hela språket, och det som skiljer SQL från Java. I Java är du imperativ: du beskriver steg för steg *hur* något ska göras — loopa igenom listan, jämför varje element. I SQL beskriver du bara *vad* du vill ha. "Ge mig alla patienter i Lund." Hur databasen hittar dem — vilken ordning den läser raderna i, vilket index den använder — bestämmer dess frågeoptimerare. Två frågor som är skrivna olika men betyder samma sak kan köras på exakt samma sätt.

**AS ger alias.** Både kolumner och uttryck kan döpas om:

    SELECT EmpName AS Namn, EmpSalary / 12 AS Manadslon FROM Employee;

Ett **uttryck utan AS** får inget namn alls — SQL Server visar "(No column name)". Ge därför alltid uttryck ett alias.

**WHERE** filtrerar rader med operatorerna \`=\`, \`<>\` (eller \`!=\`), \`<\`, \`>\`, \`<=\`, \`>=\`. Observera att \`=\` i SQL betyder *jämförelse*, inte tilldelning som i Java. Villkoret utvärderas till sant eller falskt per rad, och bara sanna rader kommer med.

**Text jämförs lexikografiskt**, alltså i bokstavsordning tecken för tecken: \`'S2' > 'S1'\` är sant eftersom 2 kommer efter 1, och \`'Max' > 'Mary'\` är sant eftersom x kommer efter r på tredje positionen. Textvärden omges av enkla citattecken.

**DISTINCT** tar bort dubblettrader ur resultatet.

**ORDER BY** sorterar, \`ASC\` (standard) eller \`DESC\`. Flera kolumner kan anges: \`ORDER BY Brand ASC, Price DESC\` sorterar först på märke och inom varje märke på pris. Man kan även skriva \`ORDER BY 3\` för tredje kolumnen, men föreläsaren avråder — det gör frågan svårläst och den går sönder om kolumnordningen ändras.

**Skrivordning:** SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY. **Utförandeordning:** FROM → WHERE → GROUP BY → aggregat → HAVING → SELECT → ORDER BY. Skillnaden förklarar varför du inte kan använda ett SELECT-alias i WHERE (WHERE körs före SELECT) men däremot i ORDER BY (som körs sist).

Avsluta satser med semikolon. Nyckelord är inte skiftlägeskänsliga, men var konsekvent — versaler för nyckelord är kursens standard.
`
  },
  {
    id: "n2",
    number: 2,
    name: "Predikat: BETWEEN, LIKE, IN, NULL",
    lesson: `
Logiska operatorer kombinerar villkor i WHERE.

**AND** — båda villkoren måste stämma. **OR** — minst ett. **NOT** — vänder villkoret. De kan blandas fritt, men då avgör parenteser vad som hör ihop:

    WHERE (EmpAddress = 'Lund' OR EmpAddress = 'Eslöv') AND EmpSalary > 20000

Utan parenteserna binder AND hårdare än OR, och frågan betyder något annat än du tänkt. Sätt alltid parenteser när AND och OR förekommer tillsammans.

**BETWEEN** är inklusive i båda ändar: \`WHERE Price BETWEEN 30000 AND 50000\`.

**IN** ersätter en kedja av OR: \`WHERE UnitID IN (1, 3)\`.

**LIKE** matchar textmönster. \`%\` betyder noll eller fler tecken, \`_\` betyder exakt ett tecken. \`LIKE 'A%'\` hittar allt som börjar på A; \`LIKE '%son'\` allt som slutar på son; \`LIKE '_o%'\` allt där andra bokstaven är o.

**NULL** är det mest missförstådda. NULL betyder "värde saknas" — inte noll och inte tom sträng, och inte samma sak som null i Java. Därför är \`WHERE EmployeeID = NULL\` **alltid falskt**, även för rader som saknar värde. Du måste skriva:

    WHERE EmployeeID IS NULL
    WHERE EmployeeID IS NOT NULL

**Literaler i SELECT.** Du kan välja ut ett konstant värde: \`SELECT LicenseNo, 'Tjanstebil' AS Typ FROM Car\` ger texten Tjanstebil på varje rad. Nyttigt för att märka rader i en UNION.

**Strängar kan sättas ihop.** I SQL Server med \`+\`: \`EmpNo + '-' + EmpName\`. I SQLite (här) med \`||\`. Funktionerna \`LOWER()\` och \`SUBSTRING(text, start, längd)\` (i SQLite \`SUBSTR\`) omvandlar text. \`ISNULL(kolumn, ersättning)\` i SQL Server, \`IFNULL\` i SQLite, ger ett annat värde där kolumnen är NULL — \`ISNULL(StudentAddress, 'Unknown')\`.

**Begränsa antal rader:** SQL Server använder \`SELECT TOP 3 ...\` eller \`SET ROWCOUNT 3\`. SQLite använder \`LIMIT 3\` sist i frågan.
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

**Kartesisk produkt** är utgångspunkten. \`SELECT * FROM Student, HasStudied\` ger varje rad i den första tabellen kombinerad med varje rad i den andra: 3 × 3 = 9 rader, 5 + 3 = 8 kolumner. Nästan alltid meningslöst som resultat, men det är vad en join *filtrerar*.

**INNER JOIN** behåller bara de kombinationer där join-villkoret är sant:

    SELECT e.EmpName, u.UnitName
    FROM Employee e
    INNER JOIN Unit u ON e.UnitID = u.UnitID;

Bara \`JOIN\` betyder samma sak som \`INNER JOIN\`. Den äldre syntaxen \`FROM Employee e, Unit u WHERE e.UnitID = u.UnitID\` ger också samma resultat, men ON-formen är tydligare och är kursens standard.

Ett join-villkor med annat än likhet — \`ON a.x > b.y\` — kallas **theta join**. Ovanligt, men det förekommer i föreläsningen.

**LEFT OUTER JOIN** behåller **alla** rader från vänstra tabellen och fyller på med NULL där motpart saknas. Rätt verktyg när frågan innehåller "även de som inte …". **RIGHT OUTER JOIN** gör samma sak åt andra hållet, och **FULL OUTER JOIN** behåller alla rader från båda sidor. I praktiken skriver man om RIGHT som LEFT genom att byta plats på tabellerna; FULL används när du vill se både anställda utan bil *och* bilar utan ägare i samma resultat.

Kombinationen LEFT JOIN + COUNT har en fälla: \`COUNT(*)\` räknar NULL-raden och ger 1 för en tom grupp. Räkna på den högra tabellens nyckel — \`COUNT(c.CarID)\` — då blir det 0.

**Flera joins** kedjas för att gå via en mellantabell. Examines kopplar Employee till Patient, Suffers kopplar Patient till Illness.

**Self join** är en tabell joinad mot sig själv med två olika alias. Föreläsaren ägnar tre slides åt hur det går fel:

- \`WHERE StudentAddress = StudentAddress\` — jämför en kolumn med sig själv. Alltid sant, ger hela tabellen.
- \`FROM Student s1, Student s2 WHERE s1.Address = s2.Address\` — matchar varje student med sig själv, så alla kommer med.
- Rätt: lägg till \`AND s1.StudentNo <> s2.StudentNo\` så att ingen paras med sig själv. Vill du dessutom ha varje par bara en gång: \`<\` i stället för \`<>\`.

En **rekursiv self join** kopplar en rad till en annan rad i samma tabell via en främmande nyckel — anställd till chef via ManagerID.

**Alias** i joins gör frågan läsbar. Förkorta konsekvent: \`e\` för Employee, \`u\` för Unit.
`
  },
  {
    id: "n6",
    number: 6,
    name: "Underfrågor",
    lesson: `
En underfråga (subquery) är en fråga inuti en fråga. Vanligast i WHERE:

    SELECT EmpName FROM Employee
    WHERE EmpSalary > (SELECT AVG(EmpSalary) FROM Employee);

Det här går inte att skriva utan underfråga, eftersom aggregat inte får stå direkt i WHERE.

**"One query per question."** Föreläsarens metod: bryt ned frågan i delfrågor och skriv en SQL-fråga per del. "Vem bor på samma adress som S1?" är två frågor — vilken adress har S1, och vilka bor där. Underfrågan är bara den första frågan nästlad i den andra.

Tre former:

- **Skalär** underfråga returnerar ett värde och jämförs med \`=\`, \`>\` osv.
- **Lista** används med \`IN\`: \`WHERE IllnessID IN (SELECT IllnessID FROM Suffers)\`.
- **Korrelerad** underfråga refererar till den yttre frågans rad och körs en gång per rad — nästa nivå.

**Föreläsarens hållning: underfrågor avråds när en JOIN kan ersätta dem.** Skälet är att underfrågor kan nästlas i oändlighet och gör frågor svåra och tidskrävande att läsa. Men i vissa lägen behövs de — jämförelse med ett aggregat är typexemplet.

**INSERT … SELECT** kopierar rader från en fråga in i en tabell:

    INSERT INTO PatientCopy (PatientNo, PatientName)
    SELECT PatientNo, PatientName FROM Patient WHERE PatientAddress = 'Lund';

**UPDATE** och **DELETE** kan använda underfrågor i WHERE precis som SELECT: \`WHERE EmployeeID IN (SELECT ...)\` eller \`WHERE NOT EXISTS (...)\`.
`
  },
  {
    id: "n7",
    number: 7,
    name: "EXISTS och mängdoperatorer",
    lesson: `
**EXISTS** testar om en underfråga returnerar minst en rad. Föreläsarens formulering: "Finns det någon?"

    SELECT PatientName FROM Patient p
    WHERE NOT EXISTS (SELECT 1 FROM Suffers s WHERE s.PatientID = p.PatientID);

Underfrågan är **korrelerad** — \`p.PatientID\` refererar till den yttre raden, så den körs en gång per patient. \`SELECT 1\` används för att innehållet inte spelar roll, bara om det finns rader.

**Samma fråga på tre sätt.** "Vilka patienter undersöks av någon?" kan skrivas med IN, med EXISTS eller med INNER JOIN, och alla tre ger samma svar:

    WHERE PatientID IN (SELECT PatientID FROM Examines)
    WHERE EXISTS (SELECT 1 FROM Examines x WHERE x.PatientID = p.PatientID)
    FROM Patient p INNER JOIN Examines x ON p.PatientID = x.PatientID

Skillnaderna: IN och EXISTS visar bara kolumner från den yttre tabellen; JOIN kan visa kolumner från båda men ger en rad per match (därför DISTINCT). EXISTS är ofta snabbast på stora tabeller. NOT EXISTS är säkrare än NOT IN, eftersom NOT IN ger tom resultatmängd om underfrågan innehåller ett enda NULL.

**Mängdoperatorer** kombinerar två kompletta frågor:

- **UNION** — allt ur båda, dubbletter borttagna.
- **UNION ALL** — allt ur båda, dubbletter kvar. Snabbare, och rätt val när dubbletter betyder något.
- **INTERSECT** — bara det som finns i båda.
- **EXCEPT** — det som finns i den första men inte i den andra.

**Union compatibility** krävs: frågorna måste ha **samma antal kolumner** och kolumnerna måste ha **jämförbara datatyper**. Fel antal ger "All queries combined using a UNION ... must have an equal number of expressions". Olika typer ger "Error converting data type varchar to numeric". Kolumnnamnen i resultatet tas från den första frågan.
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

Räkna upp kolumnerna. Identitetskolumner ska inte anges — databasen sätter dem.

    UPDATE Employee SET EmpSalary = EmpSalary + 2000 WHERE UnitID = 1;
    DELETE FROM Car WHERE EmployeeID IS NULL;

**Glömmer du WHERE ändrar eller raderar du varje rad.** Skriv satsen som SELECT först, kontrollera träffarna, byt sedan till UPDATE eller DELETE.

**Främmande nycklar** sätter gränser: du kan inte radera en enhet som har anställda. Det är referensintegritet, och det är databasen som upprätthåller den — inte din kod.

**DDL** ändrar strukturen: \`CREATE\`, \`ALTER\`, \`DROP\`. \`TRUNCATE TABLE\` tömmer en tabell men behåller strukturen — snabbare än \`DELETE\` utan WHERE. **DML** ändrar data: \`INSERT\`, \`UPDATE\`, \`DELETE\`. Läsning (\`SELECT\`) räknas ibland som egen kategori, **DQL**. **DCL** styr behörigheter (\`GRANT\`, \`REVOKE\`). Kursen använder DDL, DML, DQL och DCL.

**Vyer** är namngivna frågor som beter sig som tabeller. Föreläsaren anger tre syften:

- **Förenkla** komplexa frågor och dölja underliggande databasobjekt.
- **Begränsa åtkomst** — till vissa kolumner (**vertikal** vy), till vissa rader (**horisontell** vy), eller båda.
- **Aggregera** — en vy med GROUP BY kan förbättra läsprestanda.

    CREATE VIEW EmployeeContact AS SELECT EmpName, EmpPhoneNumber FROM Employee;

Vyn lagrar ingen data — den kör sin fråga varje gång. Tre regler: en vy exponerar bara de kolumner den valt (\`SELECT Address FROM VerticalView\` ger fel om Address inte ingår); vyer kan ofta uppdateras med INSERT, UPDATE och DELETE, och ändringen slår igenom i bastabellen; och **ORDER BY är inte tillåtet** i en vy-definition.

**Namngivning:** undvik reserverade ord som tabellnamn — skriv \`ShopOrder\` i stället för \`Order\`, \`StudentNo\` i stället för \`No\`. Tabellnamn i singular. Surrogatnyckelkolumnen döps efter tabellen: \`StudentCopyID\` i tabellen StudentCopy.
`
  },
  {
    id: "n9",
    number: 9,
    name: "Korrelerade frågor och EXISTS hard mode",
    lesson: `
  Det här är nivån föreläsaren kallar "hard mode", och den ägnar tolv slides åt en enda fråga: **Vem har läst alla kurser?**

  Frågan är svår för att SQL inte har någon "alla"-operator. Två lösningar finns.

  **Lösning 1: räkna.** Räkna kurser per student med GROUP BY och jämför med totala antalet kurser i HAVING:

      SELECT s.StudentNo, COUNT(*) AS Nbr
      FROM Student s JOIN HasStudied hs ON s.StudentID = hs.StudentID
      GROUP BY s.StudentNo
      HAVING COUNT(hs.CourseID) = (SELECT COUNT(*) FROM Course);

  Enkel att förstå. Fungerar bara om samma student inte kan ha läst samma kurs två gånger — annars behövs \`COUNT(DISTINCT ...)\`.

  **Lösning 2: dubbel NOT EXISTS.** Formulera om frågan: "Vilka studenter är det så att det **inte finns** någon kurs som studenten **inte har** läst?"

      SELECT s.StudentNo FROM Student s
      WHERE NOT EXISTS (
          SELECT 1 FROM Course c
          WHERE NOT EXISTS (
              SELECT 1 FROM HasStudied hs
              WHERE hs.StudentID = s.StudentID AND hs.CourseID = c.CourseID
          )
      );

  Läs inifrån och ut. Innersta frågan: "har studenten s läst kursen c?" Mellersta: "finns det någon kurs c som s *inte* läst?" Yttersta: "ta med de studenter där svaret är nej". Dubbla negationen är just det som uttrycker "alla".

  Det här mönstret kallas **relationell division**, och det är den svåraste standardfrågan i SQL. Kan du den kan du EXISTS.

  **Korrelerade underfrågor i allmänhet** körs en gång per rad i den yttre frågan och kan referera till dess kolumner. "Anställda som tjänar mer än snittet *på sin egen enhet*" kräver en korrelerad underfråga — snittet är olika för varje rad.
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
    tsql: "Identiskt i SQL Server. Där kan du dessutom lägga till WITH SCHEMABINDING för att hindra att tabellerna bakom vyn ändras.", reviewed: true },

  // ---- Nivå 1 ----
  { id: "sql-33", level: "n1", task: "Visa varje anställds namn som Namn, lön som Lon, och månadslön (lönen delat med 12) som Manadslon.",
    solution: "SELECT EmpName AS Namn, EmpSalary AS Lon, EmpSalary / 12 AS Manadslon FROM Employee;",
    hint: "AS ger alias. Uttrycket EmpSalary / 12 behöver ett alias för att få ett kolumnnamn.",
    tsql: "Identiskt. Notera att INT / INT ger heltalsdivision i både SQL Server och SQLite — 25000 / 12 blir 2083.", reviewed: true },

  { id: "sql-34", level: "n1", ordered: true,
    task: "Visa märke och pris för alla bilar, sorterade på märke i stigande ordning och inom varje märke på pris i fallande ordning.",
    solution: "SELECT Brand, Price FROM Car ORDER BY Brand ASC, Price DESC;",
    hint: "ORDER BY tar flera kolumner, var och en med egen riktning.",
    reviewed: true },

  { id: "sql-35", level: "n1", task: "Visa namnen på de anställda vars namn kommer efter 'Eva' i bokstavsordning.",
    solution: "SELECT EmpName FROM Employee WHERE EmpName > 'Eva';",
    hint: "Text jämförs lexikografiskt, tecken för tecken. 'Hans' > 'Eva' eftersom H kommer efter E.",
    tsql: "Identiskt. I SQL Server kan resultatet bero på databasens collation (skiftlägeskänslighet).", reviewed: true },

  // ---- Nivå 2 ----
  { id: "sql-36", level: "n2", task: "Visa namn, adress och lön för de anställda som bor i Lund eller Eslöv OCH tjänar mer än 20 000.",
    solution: "SELECT EmpName, EmpAddress, EmpSalary FROM Employee WHERE (EmpAddress = 'Lund' OR EmpAddress = 'Eslöv') AND EmpSalary > 20000;",
    hint: "Utan parenteser binder AND hårdare än OR och frågan betyder något annat. Testa båda och jämför.",
    reviewed: true },

  { id: "sql-37", level: "n2", task: "Visa namn och adress för alla patienter som INTE bor i Lund.",
    solution: "SELECT PatientName, PatientAddress FROM Patient WHERE NOT PatientAddress = 'Lund';",
    hint: "NOT vänder villkoret. <> 'Lund' ger samma resultat.", reviewed: true },

  { id: "sql-38", level: "n2", task: "Visa registreringsnummer som RegNr och den fasta texten Tjanstebil som Typ, för alla bilar som har en ägare.",
    solution: "SELECT LicenseNo AS RegNr, 'Tjanstebil' AS Typ FROM Car WHERE EmployeeID IS NOT NULL;",
    hint: "En literal i SELECT upprepas på varje rad. Kom ihåg IS NOT NULL, inte <> NULL.", reviewed: true },

  { id: "sql-39", level: "n2", task: "Visa en kolumn Etikett som slår ihop anställningsnummer, ett bindestreck och namn, t.ex. E1-Anna, för alla anställda.",
    solution: "SELECT EmpNo || '-' || EmpName AS Etikett FROM Employee;",
    hint: "I SQLite slås strängar ihop med ||.",
    tsql: "I SQL Server: EmpNo + '-' + EmpName, eller CONCAT(EmpNo, '-', EmpName).", reviewed: true },

  { id: "sql-40", level: "n2", task: "Visa varje patients namn i gemener som Gemener, och namnets två första tecken som Kort.",
    solution: "SELECT LOWER(PatientName) AS Gemener, SUBSTR(PatientName, 1, 2) AS Kort FROM Patient;",
    hint: "LOWER() och SUBSTR(text, startposition, antal tecken). Positioner räknas från 1.",
    tsql: "I SQL Server heter funktionen SUBSTRING, med samma argument.", reviewed: true },

  { id: "sql-41", level: "n2", task: "Visa registreringsnummer och ägarens EmployeeID som Agare för alla bilar — men visa 0 i stället för tomt värde för bilar utan ägare.",
    solution: "SELECT LicenseNo, IFNULL(EmployeeID, 0) AS Agare FROM Car;",
    hint: "IFNULL(kolumn, ersättning) ger ersättningen där kolumnen är NULL.",
    tsql: "I SQL Server: ISNULL(EmployeeID, 0). COALESCE fungerar i båda.", reviewed: true },

  // ---- Nivå 5 ----
  { id: "sql-42", level: "n5", task: "Hur många rader ger den kartesiska produkten av Unit och Illness? Svara med en enda kolumn med antalet.",
    solution: "SELECT COUNT(*) FROM Unit, Illness;",
    hint: "FROM A, B utan villkor ger varje rad i A kombinerad med varje rad i B: 3 × 6.",
    reviewed: true },

  { id: "sql-43", level: "n5", task: "Visa registreringsnummer och ägarens namn med RIGHT JOIN från Car till Employee, så att alla anställda kommer med även utan bil.",
    solution: "SELECT c.LicenseNo, e.EmpName FROM Car c RIGHT JOIN Employee e ON c.EmployeeID = e.EmployeeID;",
    hint: "RIGHT JOIN behåller alla rader från tabellen till höger om JOIN. Samma resultat som LEFT JOIN med tabellerna i omvänd ordning.",
    tsql: "Fullt stöd i SQL Server. SQLite stöder RIGHT JOIN först från version 3.39.", reviewed: true },

  { id: "sql-44", level: "n5", task: "Visa anställdas namn och bilars registreringsnummer så att BÅDE anställda utan bil och bilar utan ägare kommer med.",
    solution: "SELECT e.EmpName, c.LicenseNo FROM Employee e FULL OUTER JOIN Car c ON e.EmployeeID = c.EmployeeID;",
    hint: "FULL OUTER JOIN behåller alla rader från båda sidor. Resultatet ska ha 8 rader: 6 anställda plus 2 ägarlösa bilar.",
    tsql: "Fullt stöd i SQL Server. SQLite först från 3.39.", reviewed: true },

  // ---- Nivå 6 ----
  { id: "sql-45", level: "n6", kind: "dml",
    task: "Skapa en tabell PatientCopy med kolumnerna PatientCopyID (surrogatnyckel), PatientNo och PatientName, och kopiera in alla patienter som bor i Lund från Patient.",
    solution: "CREATE TABLE PatientCopy (PatientCopyID INTEGER PRIMARY KEY AUTOINCREMENT, PatientNo CHAR(11) NOT NULL, PatientName VARCHAR(50)); INSERT INTO PatientCopy (PatientNo, PatientName) SELECT PatientNo, PatientName FROM Patient WHERE PatientAddress = 'Lund';",
    check: "SELECT PatientNo, PatientName FROM PatientCopy ORDER BY PatientNo;",
    hint: "INSERT INTO ... SELECT kopierar rader från en fråga. Surrogatnyckeln ska inte anges i INSERT.",
    tsql: "I SQL Server: PatientCopyID INTEGER IDENTITY(1,1) plus CONSTRAINT PK_PatientCopy_PatientCopyID PRIMARY KEY.", reviewed: true },

  { id: "sql-46", level: "n6", kind: "dml",
    task: "Höj lönen med 1 000 för alla anställda som undersöker minst en patient.",
    solution: "UPDATE Employee SET EmpSalary = EmpSalary + 1000 WHERE EmployeeID IN (SELECT EmployeeID FROM Examines);",
    check: "SELECT EmpNo, EmpSalary FROM Employee ORDER BY EmpNo;",
    hint: "En underfråga i UPDATE:s WHERE fungerar precis som i SELECT.", reviewed: true },

  { id: "sql-47", level: "n6", kind: "dml",
    task: "Radera alla sjukdomar som ingen lider av nu och som ingen heller har lidit av tidigare.",
    solution: "DELETE FROM Illness WHERE NOT EXISTS (SELECT 1 FROM Suffers s WHERE s.IllnessID = Illness.IllnessID) AND NOT EXISTS (SELECT 1 FROM HasSuffered h WHERE h.IllnessID = Illness.IllnessID);",
    check: "SELECT IllnessName FROM Illness ORDER BY IllnessName;",
    hint: "Två NOT EXISTS med AND. Skriv som SELECT först och kontrollera att exakt en sjukdom träffas.",
    reviewed: true },

  // ---- Nivå 7 ----
  { id: "sql-48", level: "n7", task: "Visa patientnummer och namn för alla patienter som undersöks av minst en anställd. Skriv den med IN.",
    solution: "SELECT PatientNo, PatientName FROM Patient WHERE PatientID IN (SELECT PatientID FROM Examines);",
    hint: "Underfrågan ger listan över patient-id som förekommer i Examines.", reviewed: true },

  { id: "sql-49", level: "n7", task: "Samma fråga som föregående — patienter som undersöks av minst en anställd — men skriv den med EXISTS.",
    solution: "SELECT PatientNo, PatientName FROM Patient p WHERE EXISTS (SELECT 1 FROM Examines x WHERE x.PatientID = p.PatientID);",
    hint: "Korrelerad underfråga: x.PatientID = p.PatientID kopplar till den yttre raden.",
    reviewed: true },

  { id: "sql-50", level: "n7", task: "Samma fråga en tredje gång — patienter som undersöks av minst en anställd — men skriv den med INNER JOIN. Varje patient ska visas en gång.",
    solution: "SELECT DISTINCT p.PatientNo, p.PatientName FROM Patient p INNER JOIN Examines x ON p.PatientID = x.PatientID;",
    hint: "Joinen ger en rad per undersökning, så patienter med flera undersökningar dubbleras. DISTINCT löser det — men på patientnummer, inte bara namn, eftersom två patienter heter Anna.",
    reviewed: true },

  { id: "sql-51", level: "n7", task: "Visa alla adresser som förekommer bland anställda OCH patienter i en enda kolumn Ort, med dubbletter kvar.",
    solution: "SELECT EmpAddress AS Ort FROM Employee UNION ALL SELECT PatientAddress FROM Patient;",
    hint: "UNION ALL behåller dubbletter — resultatet ska ha 12 rader. UNION skulle ge 6.",
    reviewed: true },

  // ---- Nivå 9 ----
  { id: "sql-52", level: "n9", task: "Visa namn och lön för de anställda som tjänar mer än medellönen PÅ SIN EGEN ENHET.",
    solution: "SELECT e.EmpName, e.EmpSalary FROM Employee e WHERE e.EmpSalary > (SELECT AVG(e2.EmpSalary) FROM Employee e2 WHERE e2.UnitID = e.UnitID);",
    hint: "Snittet är olika per enhet, så underfrågan måste referera till den yttre radens UnitID.",
    reviewed: true },

  { id: "sql-53", level: "n9", task: "Vilka anställda undersöker ALLA patienter på enheten Trauma? Visa namnen.",
    solution: "SELECT e.EmpName FROM Employee e WHERE NOT EXISTS (SELECT 1 FROM Patient p INNER JOIN Unit u ON p.UnitID = u.UnitID WHERE u.UnitName = 'Trauma' AND NOT EXISTS (SELECT 1 FROM Examines x WHERE x.EmployeeID = e.EmployeeID AND x.PatientID = p.PatientID));",
    hint: "Dubbel NOT EXISTS: anställda där det inte finns någon Trauma-patient som de inte undersöker. Alternativet är COUNT(DISTINCT p.PatientID) i HAVING jämfört med antalet Trauma-patienter — båda ger samma svar.",
    reviewed: true }
];
