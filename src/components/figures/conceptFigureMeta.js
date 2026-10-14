// Begreppsfigurernas metadata: kapitel, figurnummer, figurtext, källa och
// tillgänglighetstexter (<title> och <desc>). Ren JS, så att testet
// scripts/diagram-ids.test.mjs kan låsa att varje figur står i rätt kapitel
// och att numren följer kapitlets nummer och ordningen i texten.
//
// Källraden: "Efter föreläsning …" eller "Efter Jeston (2022)" när figuren
// ritar kursens egen modell, "Egen illustration" när modellen är vår.
// Ritningarna finns i databaserFigures.jsx och processFigures.jsx.

export const CONCEPT_FIGURES = {
  // ── Databaser ─────────────────────────────────────────────────────────
  "db-designkedjan": {
    course: "databaser", chapter: "kap1", number: "1.1",
    caption: "Designprocessens tre steg: från verksamhetskrav i text till körbar kod. SQL kommer sist.",
    source: "Efter föreläsning 1",
    title: "Designprocessens tre steg",
    desc: "Fyra rutor med pilar emellan: verksamhetskrav i löpande text, konceptuell design (ER-diagram), logisk design (relationer och normalisering) och fysisk design (DDL med CREATE TABLE).",
  },
  "db-relationens-anatomi": {
    course: "databaser", chapter: "kap2", number: "2.1",
    caption: "Relationen EMPLOYEE: schemat bestämmer formen och graden, det aktuella värdet är tuplerna just nu och ger kardinaliteten.",
    source: "Egen illustration efter föreläsning 5",
    title: "Schema och aktuellt värde",
    desc: "Tabellen EMPLOYEE med attributen EmployeeNo, Name och WorkEmail och fyra tupler. Schemat har grad 3. Den fjärde tupeln E-422 Mary höjer kardinaliteten från 3 till 4 utan att graden ändras. Domänen för EmployeeNo är E- följt av tre siffror.",
  },
  "db-frammande-nyckel": {
    course: "databaser", chapter: "kap3", number: "3.1",
    caption: "En främmande nyckel lagrar en identifierare som måste träffa en kandidatnyckel i den refererade relationen. Samma värde får förekomma flera gånger.",
    source: "Egen illustration efter föreläsning 5",
    title: "Främmande nyckel som referens",
    desc: "PROJECT med LeaderEmployeeNo refererar EMPLOYEE. P-10 Atlas och P-20 Nova pekar båda på E-104 Mary, vilket är tillåtet. En tredje tupel pekar på E-999, som inte finns i EMPLOYEE, och bryter mot främmandenyckelvillkoret.",
  },
  "db-ternar-relation": {
    course: "databaser", chapter: "kap5", number: "5.1",
    caption: "Tre binära M:N-relationer kan inte säga vilken leverantör som levererade produkten till en viss kund. En ternär relation binder alla tre i samma instans.",
    source: "Egen illustration",
    title: "Tre binära relationer mot en ternär",
    desc: "Till vänster Leverantör, Produkt och Kund parvis kopplade med tre binära M:N-relationer, där informationen om trippeln saknas. Till höger samma tre entitetstyper kopplade till en enda relation av grad tre, som vid transformationen ger en relation med trippelsammansatt primärnyckel.",
  },
  "db-binara-regler": {
    course: "databaser", chapter: "kap6", number: "7.2",
    caption: "Var referensen hamnar i de tre binära reglerna: hos den totala sidan med en kandidatnyckel (1:1), på många-sidan (1:N) och i en ny relation (M:N).",
    source: "Efter föreläsning 5 (regel 3–5)",
    title: "Regel 3, 4 och 5 sida vid sida",
    desc: "Tre kolumner. 1:1: PROJECT får ResponsibleEmployeeNo som främmande nyckel och kandidatnyckel. 1:N: PROJECT får LeaderEmployeeNo som främmande nyckel, och värdet får upprepas. M:N: en ny relation WORKS_ON vars två främmande nycklar tillsammans är primärnyckel.",
  },
  "db-svag-nyckelkedja": {
    course: "databaser", chapter: "kap6", number: "7.1",
    caption: "Kedjade svaga entiteter: ägaren mappas först, och varje led refererar sin närmaste ägares kompletta nyckel. Nyckeln växer för varje led.",
    source: "Efter föreläsning 5 (regel 2)",
    title: "Nyckeln i kedjade svaga entiteter",
    desc: "PROJECT med primärnyckeln ProjectNo, PROJECT_TASK med primärnyckeln ProjectNo och TaskNo, och TASK_STEP med primärnyckeln ProjectNo, TaskNo och StepNo. PROJECT_TASK refererar PROJECT, och TASK_STEP refererar hela nyckeln i PROJECT_TASK, inte TaskNo ensamt.",
  },
  "db-anomalier": {
    course: "databaser", chapter: "kap7", number: "8.1",
    caption: "De tre anomalierna i EmployeeProject har samma orsak: projektets fakta lagras i en relation vars nyckel handlar om kopplingen mellan anställd och projekt.",
    source: "Efter föreläsning 6",
    title: "Anomaliernas gemensamma orsak",
    desc: "En orsaksruta överst och tre följder under: uppdateringsanomali (P3:s budget står i två celler), insättningsanomali (P5 kan inte registreras utan en anställd) och raderingsanomali (raderas E4 och E5 försvinner allt om P3).",
  },
  "db-normalformstrappan": {
    course: "databaser", chapter: "kap7", number: "8.2",
    caption: "Normalformerna bygger på varandra: varje steg kräver det förra och förbjuder ytterligare ett slags beroende.",
    source: "Efter föreläsning 6",
    title: "Normalformstrappan",
    desc: "En trappa i tre steg. 1NF: atomära värden. 2NF: 1NF och inget icke-primärattribut beror på en äkta delmängd av någon kandidatnyckel. 3NF: 2NF och varje icke-primärattribut är icke-transitivt beroende av varje kandidatnyckel. Högre normalform ger mindre redundans och färre anomalier.",
  },
  "db-beroendediagram": {
    course: "databaser", chapter: "kap7", number: "8.3",
    caption: "Det fullständiga exemplet: B → D är partiellt, E och F hänger transitivt på nyckeln. Ett beroende per relation ger 3NF.",
    source: "Egen illustration",
    title: "Beroendena i R(A, B, C, D, E, F)",
    desc: "Attributen A till F med beroendena {A, B} → C, B → D, D → E och C → F. B → D är partiellt eftersom B är en äkta delmängd av kandidatnyckeln {A, B}. E och F är transitivt beroende av nyckeln. Nedbrytningen ger R1(A, B, C), R2(B, D), R3(D, E) och R4(C, F).",
  },
  "db-ddl-fran-diagrammet": {
    course: "databaser", chapter: "kap8", number: "9.1",
    caption: "Från diagrammets symboler till DDL i tentans form: vad varje konstruktion blir i koden.",
    source: "Efter övningshäftets facit (uppgift 18–22)",
    title: "Från ER-diagram till DDL",
    desc: "Sju par. Vanlig eller svag entitet blir en tabell med IDENTITY-surrogatnyckel. Identifierare blir NOT NULL och UNIQUE. Svag entitet får UNIQUE över partiell nyckel och ägarens främmande nyckel. 1:N och 1:1 blir främmande nyckel på rätt sida. Dubbel linje blir NOT NULL på främmande nyckeln. M:N blir kopplingstabell utan IDENTITY. Flervärdesattribut blir egen tabell.",
  },
  "db-sql-ordning": {
    course: "databaser", chapter: "kap9", number: "10.2",
    caption: "SQL:s logiska utförandeordning. WHERE filtrerar rader före grupperingen, HAVING filtrerar grupper efter den.",
    source: "Efter föreläsning 2–3",
    title: "SQL:s logiska utförandeordning",
    desc: "Sju steg i ordning: FROM, WHERE, GROUP BY, aggregaten, HAVING, SELECT och ORDER BY. WHERE arbetar på rader och får inte innehålla aggregat. HAVING arbetar på grupper och är stället för villkor på aggregat.",
  },
  "db-join-kopplingstabell": {
    course: "databaser", chapter: "kap9", number: "10.1",
    caption: "Join över kopplingstabellen i två steg. Resultatet har en rad per HarLanat-rad.",
    source: "Egen illustration",
    title: "Join över kopplingstabellen",
    desc: "Bok, HarLanat och Lantagare. HarLanat står i mitten och joinas mot Bok på Isbn och mot Lantagare på LantagarNo. Resultatet har en rad per HarLanat-rad med bokens och låntagarens kolumner tillagda, och böcker som ingen lånat kommer inte med.",
  },
  "db-jdbc-kedjan": {
    course: "databaser", chapter: "kap10", number: "11.1",
    caption: "JDBC-kedjan: klienten når servern via drivrutinen, och koden går från anslutning till ResultSet. Varje steg kan kasta SQLException.",
    source: "Efter föreläsning 8–9",
    title: "JDBC-kedjan",
    desc: "Överst klienten, JDBC-drivrutinen och servern med SQL Server. Under kedjan DriverManager, Connection, PreparedStatement och ResultSet med metoderna getConnection, prepareStatement, executeQuery eller executeUpdate och next. SQLException kan kastas i varje steg.",
  },
  "db-fyra-lager": {
    course: "databaser", chapter: "kap10", number: "11.2",
    caption: "De fyra lagren i klientapplikationen. Bara data access-lagret har kontakt med databasen, och modellen används av alla lager.",
    source: "Efter föreläsning 8–9",
    title: "Applikationens fyra lager",
    desc: "View (FXML-filer), Controller (EmployeesViewController), Data access (EmployeeDao och ConnectionHandler) och databasen under. Model (Employee och Department) står vid sidan av och används av alla lager. SQL, JDBC och SQLException hör hemma i data access-lagret.",
  },
  "db-separationsnivaer": {
    course: "databaser", chapter: "kap10", number: "11.3",
    caption: "Tre nivåer av separation: var SQL och SQLException hamnar. Kursen siktar på nivå 2 eller 3.",
    source: "Efter föreläsning 8–9",
    title: "Tre nivåer av separation",
    desc: "Nivå 1: SQL, ResultSet och SQLException ligger i controllern. Nivå 2: en DAO finns, men den kastar SQLException som controllern måste fånga. Nivå 3: DAO:n fångar SQLException och kastar DaoException, och controllern innehåller ingen SQL.",
  },
};
