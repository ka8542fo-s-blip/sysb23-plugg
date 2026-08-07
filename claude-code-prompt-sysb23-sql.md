# PROMPT TILL CLAUDE CODE — SQL-verkstad för SYSB23 Plugg

## Vad du ska bygga

Ett nytt läge i **SYSB23 Plugg** för delkursen **Databaser**: en **SQL-verkstad** där användaren skriver riktiga SQL-frågor mot kursens egen sjukhusdatabas, kör dem i webbläsaren och får svaret automatiskt rättat mot en referenslösning.

Detta är inte flervalsfrågor om SQL. Det är en körbar databas. Användaren skriver `SELECT`, trycker Kör, ser resultatet som en tabell, och får veta om det stämmer med vad frågan efterfrågade.

Databasen och samtliga 32 övningar med lösningar finns färdiga längre ned och är **testade mot SQLite 3.45** — alla lösningar kör och returnerar icke-tomma resultat. Ändra dem inte.

## Teknik

- **`sql.js`** (SQLite kompilerad till WebAssembly) via npm: `npm install sql.js`. WASM-filen måste kopieras till `public/` och laddas med explicit `locateFile` — Vite bundlar den inte automatiskt. Lägg initieringen i `src/lib/sqlEngine.js`.
- Databasen skapas **i minnet vid sidladdning** genom att köra seed-skriptet nedan. Ingen data persisteras — det är avsiktligt, eftersom varje övning ska köras mot ett känt utgångsläge.
- **En färsk databas per körning.** Före varje `Kör` skapas en ny databasinstans från seed-skriptet. Det gör att en användare som råkar köra `DELETE FROM Patient` inte förstör resten av passet. Håll seed-skriptet som en sträng och `new SQL.Database()` per körning; det tar millisekunder på en databas av denna storlek.
- Ladda `sql.js` **lazy** — bara när SQL-läget öppnas, inte vid appens start. Visa "Startar databasen…" under laddningen.
- Textredigerare: en vanlig `<textarea>` med monospace-font räcker. Installera **inte** CodeMirror eller Monaco — det är onödig vikt för detta. Ge den `spellcheck="false"`, `autocapitalize="off"`, tab-storlek 2, och låt `Ctrl/Cmd + Enter` köra frågan.

## Navigation — generalisera per delkurs

Delkursen Databaser behöver inte Essä-läget, och Strategi behöver inte SQL-läget. Lös det i manifestet i stället för med villkor utspridda i koden:

```js
// src/data/index.js
{ id: "strategi",  name: "Strategi och ekonomistyrning", status: "aktiv",
  views: ["las", "ova", "prov", "essa", "statistik"] },
{ id: "databaser", name: "Databaser", status: "aktiv",
  views: ["sql", "statistik"] }
```

Navigationsraden byggs ur `views` för den valda delkursen, plus de globala flikarna Hem och Schema som alltid visas. Databaser får alltså: **Hem · SQL · Statistik · Schema**. Läs, Öva, Prov och Essä för Databaser läggs till senare när materialet finns — lägg inga tomma vyer nu.

I `schedule.js` sätts `contentId: "databaser"` för delkursen Databaser, så att schemavyns "Plugga till denna tenta" börjar fungera även för den. Knappen ska då navigera till det första läget i `views` — för Databaser blir det SQL.

## SQL-vyn

Två flikar högst upp i vyn: **Övningar** och **Fritt läge**.

### Övningar

Vänsterkolumn (eller överst på mobil): övningslistan grupperad i åtta nivåer med rubrik per nivå, status per övning (oförsökt / löst / löst med hjälp) och en progressrad per nivå. Nivåerna låses **inte** — man ska kunna hoppa.

Huvudytan för valda övningen, uppifrån och ned:

1. **Nivårubrik och lektion.** Första gången man öppnar en övning i en ny nivå visas nivåns `lesson`-text utfälld; därefter kollapsad med rubriken "Vad du behöver veta" som man kan fälla ut igen. Lektionen är kort teori med syntaxexempel.
2. **Uppgiften** (`task`) som tydlig fråga, plus eventuell `hint` bakom en "Ledtråd"-knapp.
3. **Redigeraren** med `starter`-texten förifylld om fältet finns, annars tom. Knappar: **Kör** (primär), **Rensa**, **Ledtråd**, **Visa lösning** (sekundär, med bekräftelse "Vill du se lösningen? Övningen markeras som löst med hjälp.").
4. **Resultatet** efter körning — se nedan.
5. **Skillnad mot SQL Server** om övningen har fältet `tsql`. Detta är viktigt: tentan och kursens laborationer körs i **SQL Server (T-SQL) på Azure**, inte i SQLite. Där syntaxen skiljer sig ska det stå.

### Resultatvisning

Efter `Kör` inträffar ett av fyra utfall:

- **Syntaxfel.** Visa databasens felmeddelande ordagrant i ett kort med `--wrong-bg`, plus en egen rad som tolkar de vanligaste felen på svenska (okänd tabell, okänd kolumn, saknad `FROM`, obalanserade parenteser). Tolka bara det du säkert kan tolka — gissa aldrig.
- **Rätt.** Kort med `--correct-bg`: "Rätt." följt av resultattabellen. Markera övningen som löst i `localStorage` under `sysb23:sql:<övningsId>` med värdet `solved` eller `solved-with-help`.
- **Kör men fel resultat.** Visa **båda** tabellerna sida vid sida (staplade på mobil): "Ditt resultat" och "Förväntat resultat", med radantal i rubriken. Lägg till en rad som pekar på den mest sannolika skillnaden: fel antal kolumner, fel antal rader, samma rader men olika ordning (då: "Raderna stämmer men ordningen skiljer sig — övningen kräver ORDER BY"), eller rätt antal men avvikande värden. Visa inte lösningen.
- **Tom resultatmängd** när något förväntades: säg det uttryckligen, eftersom en tom tabell annars ser ut som ingenting.

### Rättningslogik (`src/lib/sqlCheck.js`)

Kör användarens fråga och övningens `solution` mot två färska databaser och jämför resultatmängderna:

- **Kolumnantalet måste stämma.** Kolumn*namn* jämförs inte — `SELECT EmpName` och `SELECT EmpName AS Namn` ska båda godkännas.
- **Radordning ignoreras** om inte övningen har `ordered: true`. Sortera då båda mängderna deterministiskt före jämförelse (t.ex. genom att stringifiera varje rad och sortera listan).
- **Värdejämförelse:** jämför som strängar efter normalisering. Tal avrundas till fyra decimaler, `null` blir en egen markör som inte är lika med tom sträng.
- **Dubbletter räknas.** Två identiska rader är inte samma som en — annars går `DISTINCT`-övningen att lösa fel.
- **DML-övningar** (`kind: "dml"`): kör användarens sats mot en färsk databas, kör därefter övningens `check`-fråga mot samma databas. Kör parallellt `solution` + `check` mot en annan färsk databas. Jämför de två `check`-resultaten. Det gör att vilken korrekt formulering som helst av en UPDATE godkänns, så länge databasens tillstånd blir rätt.
- Tillåt **flera satser** i användarens input för DML-övningar, men bara en för SELECT-övningar (fler satser där är nästan alltid ett misstag — säg det).

### Fritt läge

Samma redigerare utan uppgift och utan rättning. Under redigeraren en **schemapanel** som alltid är synlig: de åtta tabellerna med kolumnnamn, primärnycklar markerade med nyckelikon eller `PK`, och främmande nycklar som `FK → Unit.UnitID`. Klick på ett tabellnamn klistrar in `SELECT * FROM <tabell>;` i redigeraren. Knapp "Återställ databasen" som bygger om från seed (relevant efter en DELETE).

Schemapanelen ska också vara nåbar från övningsläget, som utfällbar panel — man behöver hela tiden veta vad kolumnerna heter.

## Statistik

Lägg till en rad för Databaser: "SQL-övningar: 12 av 32 lösta (3 med hjälp)". Nollställningen ska rensa `sysb23:sql:*`.

## Design

Inga nya färger. Resultattabeller: `--line` som hairline-kanter, monospace för värden, `--paper` som zebra-rand på varannan rad, tabellhuvud i `--pine` med papper som text. Redigeraren får vit bakgrund, 1 px `--line`, och `--pine` som fokusram. `NULL` visas som kursiv, nedtonad text — inte som tom cell.

Håll resultattabeller horisontellt scrollbara i egen container så att breda resultat inte spränger layouten.

---

# INNEHÅLL A — Databasen (`src/data/databaser/hospitalSeed.js`)

Detta är kursens `hospital-ddl.sql` översatt till SQLite: `INTEGER IDENTITY(1,1)` + separat `PRIMARY KEY`-constraint har blivit `INTEGER PRIMARY KEY AUTOINCREMENT`, i övrigt är tabeller, kolumner, constraint-namn och all testdata identiska med kursens fil. Verifierat: laddar felfritt och ger 3 enheter, 6 anställda, 6 patienter, 6 sjukdomar, 11 rader i Examines, 9 i Suffers, 9 i HasSuffered och 7 bilar.

Exportera som en enda strängkonstant:

```js
export const hospitalSeed = `
PRAGMA foreign_keys = ON;

CREATE TABLE Unit (
    UnitID      INTEGER PRIMARY KEY AUTOINCREMENT,
    UnitNo      CHAR(5) NOT NULL,
    UnitName    VARCHAR(50),
    UnitAddress VARCHAR(100),
    CONSTRAINT UQ_Unit_UnitNo UNIQUE(UnitNo)
);

CREATE TABLE Employee (
    EmployeeID      INTEGER PRIMARY KEY AUTOINCREMENT,
    EmpNo           CHAR(11) NOT NULL,
    EmpName         VARCHAR(50),
    EmpAddress      VARCHAR(100),
    EmpPhoneNumber  CHAR(10),
    EmpSalary       INT,
    UnitID          INTEGER,
    CONSTRAINT UQ_Employee_EmpNo UNIQUE(EmpNo),
    CONSTRAINT FK_Employee_Unit_UnitID FOREIGN KEY(UnitID) REFERENCES Unit(UnitID)
);

CREATE TABLE Patient (
    PatientID       INTEGER PRIMARY KEY AUTOINCREMENT,
    PatientNo       CHAR(11) NOT NULL,
    PatientName     VARCHAR(50) NOT NULL,
    PatientAddress  VARCHAR(100),
    PatientPhoneNumber CHAR(10),
    UnitID          INTEGER,
    CONSTRAINT UQ_Patient_PatientNo UNIQUE(PatientNo),
    CONSTRAINT FK_Patient_Unit_UnitID FOREIGN KEY(UnitID) REFERENCES Unit(UnitID)
);

CREATE TABLE Illness (
    IllnessID       INTEGER PRIMARY KEY AUTOINCREMENT,
    IllnessName     NVARCHAR(50) NOT NULL,
    CONSTRAINT UQ_Illness_IllnessName UNIQUE(IllnessName)
);

CREATE TABLE Examines (
    EmployeeID  INTEGER,
    PatientID   INTEGER,
    CONSTRAINT PK_Examines PRIMARY KEY(EmployeeID, PatientID),
    CONSTRAINT FK_Examines_Employee FOREIGN KEY(EmployeeID) REFERENCES Employee(EmployeeID),
    CONSTRAINT FK_Examines_Patient FOREIGN KEY(PatientID) REFERENCES Patient(PatientID)
);

CREATE TABLE Suffers (
    IllnessID   INTEGER NOT NULL,
    PatientID   INTEGER NOT NULL,
    StartDate   DATETIME,
    CONSTRAINT PK_Suffers PRIMARY KEY(IllnessID, PatientID),
    CONSTRAINT FK_Suffers_Illness FOREIGN KEY(IllnessID) REFERENCES Illness(IllnessID),
    CONSTRAINT FK_Suffers_Patient FOREIGN KEY(PatientID) REFERENCES Patient(PatientID)
);

CREATE TABLE HasSuffered (
    IllnessID   INTEGER NOT NULL,
    PatientID   INTEGER NOT NULL,
    CONSTRAINT PK_HasSuffered PRIMARY KEY(IllnessID, PatientID),
    CONSTRAINT FK_HasSuffered_Illness FOREIGN KEY(IllnessID) REFERENCES Illness(IllnessID),
    CONSTRAINT FK_HasSuffered_Patient FOREIGN KEY(PatientID) REFERENCES Patient(PatientID)
);

CREATE TABLE Car (
    CarID           INTEGER PRIMARY KEY AUTOINCREMENT,
    LicenseNo       CHAR(10) NOT NULL,
    Brand           VARCHAR(50),
    Price           INT,
    EmployeeID      INTEGER NULL,
    CONSTRAINT UQ_Car_LicenseNo UNIQUE(LicenseNo),
    CONSTRAINT FK_Car_Employee FOREIGN KEY(EmployeeID) REFERENCES Employee(EmployeeID)
);

INSERT INTO Unit (UnitNo, UnitName, UnitAddress) VALUES
    ('U1', 'General Surgery', 'Hospital road'),
    ('U2', 'Rehabilitation', 'Hospital road'),
    ('U3', 'Trauma', 'Care road');

INSERT INTO Employee (EmpNo, EmpName, EmpAddress, EmpPhoneNumber, EmpSalary, UnitID) VALUES
    ('E1', 'Anna', 'Lund', '111', 25000, (SELECT UnitID FROM Unit WHERE UnitNo = 'U1')),
    ('E2', 'Eva', 'Eslöv', '222', 55000, (SELECT UnitID FROM Unit WHERE UnitNo = 'U1')),
    ('E3', 'Anna', 'Lund', '333', 37500, (SELECT UnitID FROM Unit WHERE UnitNo = 'U2')),
    ('E4', 'Hans', 'Eslöv', '444', 18000, (SELECT UnitID FROM Unit WHERE UnitNo = 'U2')),
    ('E5', 'Eva', 'Malmö', '555', 279000, (SELECT UnitID FROM Unit WHERE UnitNo = 'U3')),
    ('E6', 'Peter', 'Dalby', '666', 32000, (SELECT UnitID FROM Unit WHERE UnitNo = 'U1'));

INSERT INTO Patient (PatientNo, PatientName, PatientAddress, PatientPhoneNumber, UnitID) VALUES
    ('PP1', 'Anna', 'Lund', '111', (SELECT UnitID FROM Unit WHERE UnitNo = 'U1')),
    ('PP2', 'Hans', 'Dalby', '777', (SELECT UnitID FROM Unit WHERE UnitNo = 'U1')),
    ('PP3', 'Bo', 'Lund', '888', (SELECT UnitID FROM Unit WHERE UnitNo = 'U3')),
    ('PP4', 'Peter', 'Lund', '999', (SELECT UnitID FROM Unit WHERE UnitNo = 'U3')),
    ('PP5', 'Anna', 'London', '100', (SELECT UnitID FROM Unit WHERE UnitNo = 'U2')),
    ('PP6', 'Anna', 'Berlin', '111', (SELECT UnitID FROM Unit WHERE UnitNo = 'U1'));

INSERT INTO Examines (EmployeeID, PatientID) VALUES
    ((SELECT EmployeeID FROM Employee WHERE EmpNo='E1'), (SELECT PatientID FROM Patient WHERE PatientNo='PP1')),
    ((SELECT EmployeeID FROM Employee WHERE EmpNo='E1'), (SELECT PatientID FROM Patient WHERE PatientNo='PP2')),
    ((SELECT EmployeeID FROM Employee WHERE EmpNo='E1'), (SELECT PatientID FROM Patient WHERE PatientNo='PP3')),
    ((SELECT EmployeeID FROM Employee WHERE EmpNo='E2'), (SELECT PatientID FROM Patient WHERE PatientNo='PP1')),
    ((SELECT EmployeeID FROM Employee WHERE EmpNo='E2'), (SELECT PatientID FROM Patient WHERE PatientNo='PP3')),
    ((SELECT EmployeeID FROM Employee WHERE EmpNo='E3'), (SELECT PatientID FROM Patient WHERE PatientNo='PP3')),
    ((SELECT EmployeeID FROM Employee WHERE EmpNo='E3'), (SELECT PatientID FROM Patient WHERE PatientNo='PP4')),
    ((SELECT EmployeeID FROM Employee WHERE EmpNo='E3'), (SELECT PatientID FROM Patient WHERE PatientNo='PP5')),
    ((SELECT EmployeeID FROM Employee WHERE EmpNo='E4'), (SELECT PatientID FROM Patient WHERE PatientNo='PP5')),
    ((SELECT EmployeeID FROM Employee WHERE EmpNo='E4'), (SELECT PatientID FROM Patient WHERE PatientNo='PP3')),
    ((SELECT EmployeeID FROM Employee WHERE EmpNo='E4'), (SELECT PatientID FROM Patient WHERE PatientNo='PP4'));

INSERT INTO Illness (IllnessName) VALUES
    ('Insomnia'), ('Love sickness'), ('Cough'), ('Amnesia'), ('Incontinence'), ('Chickenpox');

INSERT INTO Suffers (IllnessID, PatientID, StartDate) VALUES
    ((SELECT IllnessID FROM Illness WHERE IllnessName='Insomnia'), (SELECT PatientID FROM Patient WHERE PatientNo='PP1'), '1953-01-12'),
    ((SELECT IllnessID FROM Illness WHERE IllnessName='Insomnia'), (SELECT PatientID FROM Patient WHERE PatientNo='PP2'), '2006-10-16'),
    ((SELECT IllnessID FROM Illness WHERE IllnessName='Insomnia'), (SELECT PatientID FROM Patient WHERE PatientNo='PP3'), '1978-01-05'),
    ((SELECT IllnessID FROM Illness WHERE IllnessName='Love sickness'), (SELECT PatientID FROM Patient WHERE PatientNo='PP1'), '2008-08-08'),
    ((SELECT IllnessID FROM Illness WHERE IllnessName='Love sickness'), (SELECT PatientID FROM Patient WHERE PatientNo='PP2'), '2003-01-22'),
    ((SELECT IllnessID FROM Illness WHERE IllnessName='Cough'), (SELECT PatientID FROM Patient WHERE PatientNo='PP4'), '1998-06-07'),
    ((SELECT IllnessID FROM Illness WHERE IllnessName='Cough'), (SELECT PatientID FROM Patient WHERE PatientNo='PP3'), '1978-05-23'),
    ((SELECT IllnessID FROM Illness WHERE IllnessName='Incontinence'), (SELECT PatientID FROM Patient WHERE PatientNo='PP6'), '1989-11-11'),
    ((SELECT IllnessID FROM Illness WHERE IllnessName='Amnesia'), (SELECT PatientID FROM Patient WHERE PatientNo='PP6'), '2010-12-09');

INSERT INTO HasSuffered (IllnessID, PatientID) VALUES
    ((SELECT IllnessID FROM Illness WHERE IllnessName='Love sickness'), (SELECT PatientID FROM Patient WHERE PatientNo='PP1')),
    ((SELECT IllnessID FROM Illness WHERE IllnessName='Love sickness'), (SELECT PatientID FROM Patient WHERE PatientNo='PP2')),
    ((SELECT IllnessID FROM Illness WHERE IllnessName='Cough'), (SELECT PatientID FROM Patient WHERE PatientNo='PP3')),
    ((SELECT IllnessID FROM Illness WHERE IllnessName='Cough'), (SELECT PatientID FROM Patient WHERE PatientNo='PP1')),
    ((SELECT IllnessID FROM Illness WHERE IllnessName='Love sickness'), (SELECT PatientID FROM Patient WHERE PatientNo='PP3')),
    ((SELECT IllnessID FROM Illness WHERE IllnessName='Cough'), (SELECT PatientID FROM Patient WHERE PatientNo='PP4')),
    ((SELECT IllnessID FROM Illness WHERE IllnessName='Insomnia'), (SELECT PatientID FROM Patient WHERE PatientNo='PP3')),
    ((SELECT IllnessID FROM Illness WHERE IllnessName='Insomnia'), (SELECT PatientID FROM Patient WHERE PatientNo='PP6')),
    ((SELECT IllnessID FROM Illness WHERE IllnessName='Amnesia'), (SELECT PatientID FROM Patient WHERE PatientNo='PP6'));

INSERT INTO Car (LicenseNo, Brand, Price, EmployeeID) VALUES
    ('C1', 'saab', 30000, NULL),
    ('C2', 'saab', 40000, (SELECT EmployeeID FROM Employee WHERE EmpNo='E1')),
    ('C3', 'volvo', 50000, (SELECT EmployeeID FROM Employee WHERE EmpNo='E2')),
    ('C4', 'volvo', 60000, (SELECT EmployeeID FROM Employee WHERE EmpNo='E3')),
    ('C5', 'audi', 70000, (SELECT EmployeeID FROM Employee WHERE EmpNo='E4')),
    ('C6', 'audi', 30000, NULL),
    ('C7', 'saab', 30000, (SELECT EmployeeID FROM Employee WHERE EmpNo='E5'));
`;
```

# INNEHÅLL B — Nivåer och övningar (`src/data/databaser/sqlExercises.js`)

Samtliga 32 lösningar är körda mot databasen ovan och returnerar icke-tomma resultat. Kopiera exakt.

```js
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
```

# INNEHÅLL C — Skillnader mot SQL Server (visas i Fritt läge)

Lägg detta som en utfällbar panel i Fritt läge, rubricerad "Kör du i SQLite här — men SQL Server på tentan". Innehållet är viktigt eftersom kursens laborationer och tentan använder T-SQL på Azure.

```js
export const dialectNotes = [
  { topic: "Begränsa antal rader", sqlite: "SELECT ... LIMIT 5", tsql: "SELECT TOP 5 ..." },
  { topic: "Slå samman text", sqlite: "'a' || 'b'", tsql: "'a' + 'b' eller CONCAT('a','b')" },
  { topic: "Ersätt NULL", sqlite: "IFNULL(kolumn, 0) eller COALESCE", tsql: "ISNULL(kolumn, 0) eller COALESCE" },
  { topic: "Dagens datum", sqlite: "date('now')", tsql: "GETDATE() eller SYSDATETIME()" },
  { topic: "Identitetskolumn", sqlite: "INTEGER PRIMARY KEY AUTOINCREMENT", tsql: "INTEGER IDENTITY(1,1)" },
  { topic: "Datatyper", sqlite: "Typerna är rådgivande — text kan hamna i en INT-kolumn", tsql: "Typerna kontrolleras strikt" },
  { topic: "RIGHT och FULL OUTER JOIN", sqlite: "Stöds först från version 3.39 — kan saknas här", tsql: "Stöds fullt ut" },
  { topic: "GROUP BY-regeln", sqlite: "Tillåter kolumner utanför GROUP BY och väljer ett värde på måfå", tsql: "Ger fel — varje kolumn måste vara i GROUP BY eller i ett aggregat" },
  { topic: "Strängjämförelse", sqlite: "LIKE är skiftlägesokänsligt för ASCII", tsql: "Beror på databasens collation" },
  { topic: "Radera tabellinnehåll", sqlite: "DELETE FROM Tabell", tsql: "DELETE FROM Tabell eller TRUNCATE TABLE Tabell" }
];
```

## Regler för innehållet

- Ändra inte övningarnas `solution`, `check` eller databasens seed — allt är testat mot SQLite 3.45 och ger icke-tomma resultat.
- Uppfinn inga nya övningar. Ska fler läggas till senare gäller samma krav: lösningen ska vara körd och verifierad innan den läggs in, och `reviewed: true` sätts först då.
- Kursens kodstandard (`codingstandards.pdf`) föreskriver PascalCase och singularform på tabellnamn samt constraint-prefixen `PK_`, `FK_`, `UQ_`, `CK_` och `DF_`. Följ den i alla exempel du visar i UI-text.

## Acceptanskriterier

- [ ] `npm install && npm run build` går igenom; WASM-filen hamnar i `public/` och laddas i produktionsbygget, inte bara i dev.
- [ ] `sql.js` laddas lazy — nätverksfliken visar ingen WASM-hämtning innan SQL-läget öppnas.
- [ ] Navigationen byggs ur `views` i manifestet. Databaser visar Hem · SQL · Statistik · Schema; Strategi är oförändrad och visar inte SQL.
- [ ] Databasen byggs färskt före varje körning: kör `DELETE FROM Patient;` i Fritt läge, kör sedan en övning, och verifiera att patienterna finns kvar.
- [ ] Alla 32 övningar går att lösa med sin egen `solution` inklistrad, och alla ger utfallet "Rätt". Detta ska du testa igenom — det är den viktigaste kontrollen i hela bygget.
- [ ] Ett alias godkänns: `SELECT EmpName AS Namn FROM Employee` löser övning sql-02.
- [ ] Radordning ignoreras utom i sql-05 och sql-22. Verifiera genom att lösa sql-02 med ett ORDER BY tillagt (ska godkännas) och sql-05 utan ORDER BY (ska nekas med meddelandet om ordning).
- [ ] Dubbletter räknas: sql-04 kan inte lösas utan DISTINCT.
- [ ] De fyra DML-övningarna rättas via `check`-frågan, och en alternativ men korrekt formulering godkänns (testa sql-30 med `WHERE UnitID = 1` i stället för underfrågan).
- [ ] Syntaxfel visar databasens eget felmeddelande, inte ett generiskt fel.
- [ ] Fel resultat visar båda tabellerna med radantal, och skillnadsraden pekar rätt vid fel kolumnantal respektive fel radantal.
- [ ] "Visa lösning" kräver bekräftelse och markerar övningen som löst med hjälp, särskilt från de självlösta i övningslistan.
- [ ] Schemapanelen visar alla åtta tabeller med PK- och FK-markeringar, och klick klistrar in en SELECT.
- [ ] "Återställ databasen" i Fritt läge fungerar efter en DELETE.
- [ ] NULL visas som nedtonad kursiv text, inte som tom cell.
- [ ] Statistik visar antal lösta SQL-övningar; nollställning rensar `sysb23:sql:*`.
- [ ] Ctrl/Cmd + Enter kör frågan. Resultattabeller är horisontellt scrollbara. Mobilvänligt. All UI-text på svenska.

Bygg klart, kör igenom **alla 32 övningar med sina egna lösningar** och de fem specifika testfallen ovan, verifiera mot listan och sammanfatta sedan kort vad du byggt och vilka övningar som eventuellt inte gick igenom.
