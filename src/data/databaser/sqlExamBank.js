// SQL-flikens läge Tentanivå: frågor i tentans form på tentans tre tabeller.
// Tentans uppgift 4 är alltid en (1) fråga mot Student, Course och HasStudied,
// så träningen sker på just de tabellerna, stegvis från join och gruppering
// till sammansatta frågor som tentans egna, och sist det som går över tentan.
//
// Tabellerna har tentans rader plus några till: fyra studenter och fem rader
// räcker inte för att skilja rätt fråga från fel (se BANK_TABLES). Varje fråga
// körs dessutom mot BANK_CONTROL, dolda ändrade rader, så att en fråga med
// inskrivna värden inte går igenom. Rättas av gradeTask4 (lib/examGrade.js).
//
// Allt här är sajtens eget och ogranskat (reviewed: false, syns inte i UI).
// `traps` (fel svar som inte får gå igenom) och `also` (andra rätta svar)
// används bara av scripts/sql-exam-bank.test.mjs.
import { oldExams } from "./oldExams.js";

const STUDENT_COLUMNS = [["StudentNo", "VARCHAR(10)"], ["Name", "VARCHAR(50)"], ["Age", "INT"], ["Address", "VARCHAR(50)"]];
const COURSE_COLUMNS = [["Code", "VARCHAR(10)"], ["Name", "VARCHAR(50)"], ["Credits", "INT"]];
const STUDIED_COLUMNS = [["StudentNo", "VARCHAR(10)"], ["Code", "VARCHAR(10)"], ["Grade", "INT"]];

// S1–S4, C1–C3 och de fem första HasStudied-raderna är tentans. Tillägget ger
// de fall som avslöjar vanliga fel: två studenter som heter Max (GROUP BY på
// namn), två som är 27 (> mot >=), S4 och C5 utan rader (inner join), och
// studenter med ett lågt betyg bland flera (WHERE mot HAVING).
export const BANK_TABLES = [
  {
    name: "Student",
    columns: STUDENT_COLUMNS,
    rows: [
      ["S1", "Phoebe", 27, "Main street"],
      ["S2", "Olivia", 32, "Main street"],
      ["S3", "Max", 18, "Codd street"],
      ["S4", "Gary", 33, "Chen street"],
      ["S5", "Nora", 24, "Codd street"],
      ["S6", "Elias", 41, "Chen street"],
      ["S7", "Alma", 27, "Main street"],
      ["S8", "Max", 29, "Park road"],
    ],
  },
  {
    name: "Course",
    columns: COURSE_COLUMNS,
    rows: [
      ["C1", "Databases", 5],
      ["C2", "Java", 10],
      ["C3", "Artificial Intelligence", 15],
      ["C4", "Statistics", 10],
      ["C5", "Networks", 5],
    ],
  },
  {
    name: "HasStudied",
    columns: STUDIED_COLUMNS,
    rows: [
      ["S1", "C1", 7], ["S1", "C2", 8], ["S2", "C3", 6], ["S2", "C1", 9], ["S3", "C2", 5],
      ["S1", "C3", 9], ["S2", "C4", 8], ["S3", "C1", 6], ["S5", "C1", 8], ["S5", "C2", 9],
      ["S5", "C4", 7], ["S6", "C2", 6], ["S6", "C3", 8], ["S7", "C1", 10], ["S8", "C2", 7],
      ["S8", "C3", 8], ["S8", "C4", 5],
    ],
  },
];

// Samma studenter och kurser med andra åldrar, adresser, poäng och betyg, och
// raderna i omvänd ordning. S1 och S2 delar högsta betyget på C1 (fäller
// TOP 1), S6 har inte läst något i stället för S4, C4 i stället för C5, och
// flest kurser är fyra i stället för tre.
export const BANK_CONTROL = {
  label: "samma tabeller med andra värden",
  tables: [
    {
      name: "Student",
      columns: STUDENT_COLUMNS,
      rows: [
        ["S1", "Phoebe", 30, "Codd street"],
        ["S2", "Olivia", 40, "Main street"],
        ["S3", "Max", 22, "Codd street"],
        ["S4", "Gary", 19, "Chen street"],
        ["S5", "Nora", 30, "Codd street"],
        ["S6", "Elias", 38, "Park road"],
        ["S7", "Alma", 36, "Chen street"],
        ["S8", "Max", 29, "Park road"],
      ],
    },
    {
      name: "Course",
      columns: COURSE_COLUMNS,
      rows: [
        ["C1", "Databases", 15],
        ["C2", "Java", 5],
        ["C3", "Artificial Intelligence", 10],
        ["C4", "Statistics", 5],
        ["C5", "Networks", 10],
      ],
    },
    {
      name: "HasStudied",
      columns: STUDIED_COLUMNS,
      rows: [
        ["S8", "C5", 9], ["S8", "C3", 6], ["S7", "C5", 6], ["S7", "C2", 8], ["S7", "C1", 8],
        ["S5", "C3", 9], ["S5", "C1", 5], ["S4", "C2", 6], ["S3", "C2", 10], ["S3", "C3", 5],
        ["S3", "C1", 7], ["S2", "C3", 7], ["S2", "C2", 9], ["S2", "C1", 9], ["S1", "C5", 7],
        ["S1", "C3", 8], ["S1", "C2", 9], ["S1", "C1", 9],
      ],
    },
  ],
};

const task = (id, section, ask, solution, hint, explanation, extra = {}) => ({
  id,
  exam: true,
  section,
  ask,
  solution,
  hint,
  explanation,
  tables: BANK_TABLES,
  control: BANK_CONTROL,
  reviewed: false,
  ...extra,
});

const SH = "FROM Student AS s INNER JOIN HasStudied AS h ON h.StudentNo = s.StudentNo";
const CH = "FROM Course AS c INNER JOIN HasStudied AS h ON h.Code = c.Code";

const bank = [
  // ---- Steg 1: Join och gruppering ----
  task("tn-01", "join",
    "Studentnummer, namn och antal lästa kurser för samtliga studenter som har läst minst en kurs",
    `SELECT s.StudentNo, s.Name, COUNT(*) AS AntalKurser ${SH} GROUP BY s.StudentNo, s.Name;`,
    "En rad per student: GROUP BY på StudentNo och Name. COUNT(*) räknar studentens rader i HasStudied.",
    "Inner join tar bara med studenter som har rader i HasStudied, så S4 försvinner av sig själv. Grupperar du bara på Name slås de två som heter Max ihop.",
    { traps: [
      ["SELECT MIN(s.StudentNo), s.Name, COUNT(*) FROM Student AS s INNER JOIN HasStudied AS h ON h.StudentNo = s.StudentNo GROUP BY s.Name;", "grupperar på namn"],
      ["SELECT StudentNo, COUNT(*) FROM HasStudied GROUP BY StudentNo;", "saknar namn"],
    ] }),
  task("tn-02", "join",
    "Kurskod, namn och snittbetyg för samtliga kurser som någon student har läst",
    `SELECT c.Code, c.Name, AVG(h.Grade) AS Snittbetyg ${CH} GROUP BY c.Code, c.Name;`,
    "Samma form, men gruppen är kursen. Name här är kursens, så skriv c.Name.",
    "AVG över Grade räknas i heltal i SQL Server: C3 har snittet 7,75 men visas som 7. Rättningen här räknar likadant.",
    { also: [`SELECT c.Code, c.Name, AVG(CAST(h.Grade AS DECIMAL(5, 2))) ${CH} GROUP BY c.Code, c.Name;`],
      traps: [["SELECT Code, AVG(Grade) FROM HasStudied GROUP BY Code;", "saknar namn"]] }),
  task("tn-03", "join",
    "Studentnummer, namn och högsta betyg för samtliga studenter som har läst minst en kurs",
    `SELECT s.StudentNo, s.Name, MAX(h.Grade) AS HogstaBetyg ${SH} GROUP BY s.StudentNo, s.Name;`,
    "Högsta per student är MAX i en grupp per student.",
    "Aggregatet räknas per grupp. Utan GROUP BY vägrar SQL Server, eftersom StudentNo och Name då står i SELECT utan att vara aggregat.",
    { traps: [[`SELECT s.StudentNo, s.Name, MAX(h.Grade) ${SH};`, "saknar GROUP BY"]] }),
  task("tn-04", "join",
    "Kurskod, namn och antal studenter för kurser som ger minst 10 poäng och som minst en student har läst",
    `SELECT c.Code, c.Name, COUNT(*) AS AntalStudenter ${CH} WHERE c.Credits >= 10 GROUP BY c.Code, c.Name;`,
    "Poängen hör till varje rad i Course, så villkoret är ett radvillkor: WHERE, före grupperingen.",
    "WHERE tar bort rader före grupperingen. Credits är inget gruppvärde, så det hör inte hemma i HAVING.",
    { traps: [[`SELECT c.Code, c.Name, COUNT(*) ${CH} WHERE c.Credits > 10 GROUP BY c.Code, c.Name;`, "> i stället för >="]] }),
  task("tn-05", "join",
    "Studentens namn, kursens namn och betyg för alla betyg på 8 eller högre",
    "SELECT s.Name, c.Name, h.Grade FROM HasStudied AS h INNER JOIN Student AS s ON s.StudentNo = h.StudentNo INNER JOIN Course AS c ON c.Code = h.Code WHERE h.Grade >= 8;",
    "HasStudied binder ihop de andra två: joina både Student och Course mot den. Name finns i båda tabellerna, så alias krävs.",
    "Ingen gruppering här: en rad per betyg. Utan alias säger databasen att Name är tvetydigt.",
    { traps: [["SELECT s.Name, c.Name, h.Grade FROM HasStudied AS h INNER JOIN Student AS s ON s.StudentNo = h.StudentNo INNER JOIN Course AS c ON c.Code = h.Code WHERE h.Grade > 8;", "> i stället för >="]] }),

  // ---- Steg 2: Villkor på grupper ----
  task("tn-06", "having",
    "Studentnummer, namn och antal lästa kurser för studenter som har läst 3 eller fler kurser",
    `SELECT s.StudentNo, s.Name, COUNT(*) AS AntalKurser ${SH} GROUP BY s.StudentNo, s.Name HAVING COUNT(*) >= 3;`,
    "Antalet finns först efter grupperingen, så villkoret står i HAVING.",
    "WHERE ser en rad i taget och kan inte veta hur många rader studenten har. HAVING ser hela gruppen.",
    { traps: [[`SELECT s.StudentNo, s.Name, COUNT(*) ${SH} GROUP BY s.StudentNo, s.Name HAVING COUNT(*) > 3;`, "> i stället för >="]] }),
  task("tn-07", "having",
    "Kurskod, namn och snittbetyg för kurser med ett snittbetyg på minst 7",
    `SELECT c.Code, c.Name, AVG(h.Grade) AS Snittbetyg ${CH} GROUP BY c.Code, c.Name HAVING AVG(h.Grade) >= 7;`,
    "Snittet är ett gruppvärde: HAVING, inte WHERE.",
    "WHERE h.Grade >= 7 tar bort låga betyg innan snittet räknas, så både urvalet och snitten blir fel.",
    { traps: [[`SELECT c.Code, c.Name, AVG(h.Grade) ${CH} WHERE h.Grade >= 7 GROUP BY c.Code, c.Name;`, "radvillkor i stället för gruppvillkor"]] }),
  task("tn-08", "having",
    "Studentnummer, namn och snittbetyg för studenter som har läst minst två kurser och aldrig fått lägre betyg än 6",
    `SELECT s.StudentNo, s.Name, AVG(h.Grade) AS Snittbetyg ${SH} GROUP BY s.StudentNo, s.Name HAVING COUNT(*) >= 2 AND MIN(h.Grade) >= 6;`,
    "\"Aldrig lägre än 6\" handlar om hela gruppen: det lägsta betyget ska vara minst 6.",
    "WHERE h.Grade >= 6 tar bara bort de låga raderna. S8 har betygen 7, 8 och 5 och skulle då slinka med på sina två kvarvarande rader.",
    { traps: [[`SELECT s.StudentNo, s.Name, AVG(h.Grade) ${SH} WHERE h.Grade >= 6 GROUP BY s.StudentNo, s.Name HAVING COUNT(*) >= 2;`, "filtrerar rader i stället för att pröva gruppen"]] }),
  task("tn-09", "having",
    "Adress och antal studenter för adresser där minst två studenter bor",
    "SELECT Address, COUNT(*) AS AntalStudenter FROM Student GROUP BY Address HAVING COUNT(*) >= 2;",
    "Allt finns i Student. Ingen join behövs.",
    "En join mot HasStudied skulle räkna en student en gång per läst kurs. Läs vilken tabell frågan faktiskt handlar om.",
    { traps: [[`SELECT s.Address, COUNT(*) ${SH} GROUP BY s.Address HAVING COUNT(*) >= 2;`, "räknar rader i HasStudied i stället för studenter"]] }),
  task("tn-10", "having",
    "Studentnummer, namn och sammanlagda poäng för studenter som har läst kurser om minst 25 poäng sammanlagt",
    "SELECT s.StudentNo, s.Name, SUM(c.Credits) AS Poang FROM Student AS s INNER JOIN HasStudied AS h ON h.StudentNo = s.StudentNo INNER JOIN Course AS c ON c.Code = h.Code GROUP BY s.StudentNo, s.Name HAVING SUM(c.Credits) >= 25;",
    "Poängen står i Course, studenten i Student, och HasStudied binder ihop dem. Tre tabeller, en grupp per student.",
    "SUM(c.Credits) summerar en rad per läst kurs. Samma uttryck upprepas i HAVING, eftersom aliaset inte finns där ännu.",
    { traps: [["SELECT s.StudentNo, s.Name, SUM(c.Credits) FROM Student AS s INNER JOIN HasStudied AS h ON h.StudentNo = s.StudentNo INNER JOIN Course AS c ON c.Code = h.Code GROUP BY s.StudentNo, s.Name HAVING SUM(c.Credits) > 25;", "> i stället för >="]] }),

  // ---- Steg 3: Värde ur en annan rad ----
  task("tn-11", "skalar",
    "Studentnummer, namn och ålder för studenter som är äldre än student S1",
    "SELECT StudentNo, Name, Age FROM Student WHERE Age > (SELECT Age FROM Student WHERE StudentNo = 'S1');",
    "S1:s ålder hör till en annan rad än den som prövas. Hämta den med en skalär underfråga, skriv inte in talet.",
    "Underfrågan ger ett enda värde, så den kan stå direkt efter >. Inskrivet 27 ger rätt rader här men är fel svar på tentan.",
    { traps: [["SELECT StudentNo, Name, Age FROM Student WHERE Age > 27;", "inskrivet värde"]] }),
  task("tn-12", "skalar",
    "Studentnummer och namn för studenter som är lika gamla som student S1, men inte S1 själv",
    "SELECT StudentNo, Name FROM Student WHERE Age = (SELECT Age FROM Student WHERE StudentNo = 'S1') AND StudentNo <> 'S1';",
    "Två villkor på raden: samma ålder som underfrågan ger, och ett annat studentnummer.",
    "Utan StudentNo <> 'S1' matchar S1 sig själv.",
    { traps: [
      ["SELECT StudentNo, Name FROM Student WHERE Age = (SELECT Age FROM Student WHERE StudentNo = 'S1');", "S1 kommer med"],
      ["SELECT StudentNo, Name FROM Student WHERE Age = 27 AND StudentNo <> 'S1';", "inskrivet värde"],
      ["SELECT StudentNo, Name FROM Student WHERE StudentNo = 'S7';", "inskriven student"],
    ] }),
  task("tn-13", "skalar",
    "Studentnummer, namn och ålder för studenter som är yngre än medelåldern",
    "SELECT StudentNo, Name, Age FROM Student WHERE Age < (SELECT AVG(Age) FROM Student);",
    "Ett aggregat får inte stå direkt i WHERE. Räkna det i en underfråga.",
    "WHERE Age < AVG(Age) ger fel i SQL Server: WHERE körs före aggregeringen. Underfrågan räknar snittet för sig. AVG(Age) blir 28 i heltal, inte 28,875. Det ändrar inga rader här, men med < är AVG(Age * 1.0) säkrare.",
    { traps: [["SELECT StudentNo, Name, Age FROM Student WHERE Age < 28;", "inskrivet värde"]] }),
  task("tn-14", "skalar",
    "Kurskod, namn och poäng för kurser som ger fler poäng än kurs C1",
    "SELECT Code, Name, Credits FROM Course WHERE Credits > (SELECT Credits FROM Course WHERE Code = 'C1');",
    "Samma form som åldern, men i Course.",
    "Mönstret är detsamma som för \"äldre än S4\" på tentan, bara i en annan tabell.",
    { traps: [["SELECT Code, Name, Credits FROM Course WHERE Credits > 5;", "inskrivet värde"]] }),
  task("tn-15", "skalar",
    "Studentnummer, namn och betyg för studenter som fått högre betyg på kurs C1 än student S1 fick på samma kurs",
    `SELECT s.StudentNo, s.Name, h.Grade ${SH} WHERE h.Code = 'C1' AND h.Grade > (SELECT Grade FROM HasStudied WHERE StudentNo = 'S1' AND Code = 'C1');`,
    "Både den yttre frågan och underfrågan måste begränsas till C1.",
    "Utan Code = 'C1' i underfrågan ger den tre rader, och då vägrar SQL Server: en underfråga efter > får bara ge ett värde.",
    { traps: [
      [`SELECT s.StudentNo, s.Name, h.Grade ${SH} WHERE h.Code = 'C1' AND h.Grade > (SELECT Grade FROM HasStudied WHERE StudentNo = 'S1');`, "underfrågan ger flera rader"],
      [`SELECT s.StudentNo, s.Name, h.Grade ${SH} WHERE h.Grade > (SELECT Grade FROM HasStudied WHERE StudentNo = 'S1' AND Code = 'C1');`, "alla kurser, inte bara C1"],
    ] }),
  task("tn-16", "skalar",
    "Studentnummer, namn och betyg på kurs C2 för studenter vars betyg på C2 är högre än snittbetyget på C2",
    `SELECT s.StudentNo, s.Name, h.Grade ${SH} WHERE h.Code = 'C2' AND h.Grade > (SELECT AVG(Grade) FROM HasStudied WHERE Code = 'C2');`,
    "Jämförelsevärdet är självt ett aggregat. Underfrågan räknar snittet på C2, den yttre frågan prövar varje rad.",
    "Det här är kärnan i den ordinarie tentans fråga. Snittet hämtas med en underfråga, det skrivs aldrig in som 7.",
    { traps: [[`SELECT s.StudentNo, s.Name, h.Grade ${SH} WHERE h.Code = 'C2' AND h.Grade > 7;`, "inskrivet värde"]] }),
  task("tn-17", "skalar",
    "Kurskod, namn och högsta betyg för kurser vars högsta betyg är lägre än det högsta betyget på kurs C1",
    `SELECT c.Code, c.Name, MAX(h.Grade) AS HogstaBetyg ${CH} GROUP BY c.Code, c.Name HAVING MAX(h.Grade) < (SELECT MAX(Grade) FROM HasStudied WHERE Code = 'C1');`,
    "Båda sidor är aggregat. Kursens högsta är ett gruppvärde, så jämförelsen står i HAVING.",
    "Med villkoret i WHERE försvinner bara de höga raderna, och C1 skulle komma med på sina lägre betyg.",
    { traps: [[`SELECT c.Code, c.Name, MAX(h.Grade) ${CH} WHERE h.Grade < (SELECT MAX(Grade) FROM HasStudied WHERE Code = 'C1') GROUP BY c.Code, c.Name;`, "radvillkor i stället för gruppvillkor"]] }),

  // ---- Steg 4: X men inte Y ----
  task("tn-18", "mangd",
    "Kurskod och namn för kurser som läses av student S1 men inte av student S2",
    "SELECT Code, Name FROM Course WHERE Code IN (SELECT Code FROM HasStudied WHERE StudentNo = 'S1') AND Code NOT IN (SELECT Code FROM HasStudied WHERE StudentNo = 'S2');",
    "Två mängder: S1:s kurser och S2:s kurser. IN för den första, NOT IN för den andra.",
    "En rad i HasStudied gäller en student. WHERE h.StudentNo = 'S1' AND h.StudentNo <> 'S2' säger ingenting om S2:s rader.",
    { also: [
      "SELECT c.Code, c.Name FROM Course AS c WHERE EXISTS (SELECT 1 FROM HasStudied AS h WHERE h.Code = c.Code AND h.StudentNo = 'S1') AND NOT EXISTS (SELECT 1 FROM HasStudied AS h WHERE h.Code = c.Code AND h.StudentNo = 'S2');",
      `SELECT c.Code, c.Name ${CH} WHERE h.StudentNo = 'S1' EXCEPT SELECT c.Code, c.Name ${CH} WHERE h.StudentNo = 'S2';`,
    ], traps: [[`SELECT c.Code, c.Name ${CH} WHERE h.StudentNo = 'S1' AND h.StudentNo <> 'S2';`, "villkoret på samma rad säger inget om S2"]] }),
  task("tn-19", "mangd",
    "Studentnummer och namn för studenter som har läst kurs C1 men inte kurs C2",
    "SELECT StudentNo, Name FROM Student WHERE StudentNo IN (SELECT StudentNo FROM HasStudied WHERE Code = 'C1') AND StudentNo NOT IN (SELECT StudentNo FROM HasStudied WHERE Code = 'C2');",
    "Samma form, men nu är det studenter som väljs ut och kurserna som pekas ut.",
    "h.Code = 'C1' AND h.Code <> 'C2' är sant för varje C1-rad. Villkoret måste gälla studentens andra rader, till exempel med en underfråga.",
    { traps: [[`SELECT s.StudentNo, s.Name ${SH} WHERE h.Code = 'C1' AND h.Code <> 'C2';`, "villkoret på samma rad säger inget om C2"]] }),
  task("tn-20", "mangd",
    "Studentnummer, namn och ålder för studenter som inte har läst någon kurs",
    "SELECT StudentNo, Name, Age FROM Student WHERE StudentNo NOT IN (SELECT StudentNo FROM HasStudied);",
    "En inner join kan aldrig visa den som saknar rader. Pröva med NOT IN mot HasStudied.",
    "NOT EXISTS eller LEFT JOIN med h.StudentNo IS NULL ger samma resultat.",
    { also: [
      "SELECT s.StudentNo, s.Name, s.Age FROM Student AS s LEFT JOIN HasStudied AS h ON h.StudentNo = s.StudentNo WHERE h.StudentNo IS NULL;",
      "SELECT s.StudentNo, s.Name, s.Age FROM Student AS s WHERE NOT EXISTS (SELECT 1 FROM HasStudied AS h WHERE h.StudentNo = s.StudentNo);",
    ], traps: [["SELECT StudentNo, Name, Age FROM Student WHERE StudentNo = 'S4';", "inskriven student"]] }),
  task("tn-21", "mangd",
    "Kurskod, namn och poäng för kurser som ingen student har läst",
    "SELECT Code, Name, Credits FROM Course WHERE Code NOT IN (SELECT Code FROM HasStudied);",
    "Samma mönster från andra hållet.",
    "Tabellen du väljer ur är den där raden finns kvar, här Course.",
    { traps: [["SELECT Code, Name, Credits FROM Course WHERE Code = 'C5';", "inskriven kurs"]] }),
  task("tn-22", "mangd",
    "Studentnummer, namn och antal lästa kurser för studenter som har läst minst en kurs men inte kurs C1",
    `SELECT s.StudentNo, s.Name, COUNT(*) AS AntalKurser ${SH} WHERE s.StudentNo NOT IN (SELECT StudentNo FROM HasStudied WHERE Code = 'C1') GROUP BY s.StudentNo, s.Name;`,
    "Villkoret gäller studenten, inte raden. Lägg det på StudentNo, så räknas alla studentens rader.",
    "WHERE h.Code <> 'C1' behåller alla andra rader för studenter som visst läst C1, så de syns i resultatet med ett för lågt antal.",
    { traps: [[`SELECT s.StudentNo, s.Name, COUNT(*) ${SH} WHERE h.Code <> 'C1' GROUP BY s.StudentNo, s.Name;`, "filtrerar rader i stället för studenter"]] }),
  task("tn-23", "mangd",
    "Kurskod, namn och snittbetyg för kurser som läses av student S1 men inte av student S3",
    `SELECT c.Code, c.Name, AVG(h.Grade) AS Snittbetyg ${CH} WHERE c.Code IN (SELECT Code FROM HasStudied WHERE StudentNo = 'S1') AND c.Code NOT IN (SELECT Code FROM HasStudied WHERE StudentNo = 'S3') GROUP BY c.Code, c.Name;`,
    "Omtentans form. Snittet ska gälla alla som läst kursen, så S1 får inte filtreras på HasStudied-raden.",
    "Står h.StudentNo = 'S1' i WHERE blir snittet bara S1:s eget betyg. Villkoren läggs på kursen med underfrågor, och raderna får vara kvar.",
    { traps: [[`SELECT c.Code, c.Name, AVG(h.Grade) ${CH} WHERE h.StudentNo = 'S1' AND c.Code NOT IN (SELECT Code FROM HasStudied WHERE StudentNo = 'S3') GROUP BY c.Code, c.Name;`, "snittet blir bara S1:s betyg"]] }),

  // ---- Steg 5: Tentanivå ----
  task("tn-24", "blandat",
    "Studentnummer, namn och antal lästa kurser för studenter som är äldre än student S5 och har läst 2 eller fler kurser",
    `SELECT s.StudentNo, s.Name, COUNT(*) AS AntalKurser ${SH} WHERE s.Age > (SELECT Age FROM Student WHERE StudentNo = 'S5') GROUP BY s.StudentNo, s.Name HAVING COUNT(*) >= 2;`,
    "Åldern är ett radvillkor med ett värde ur en annan rad: WHERE med underfråga. Antalet är ett gruppvillkor: HAVING.",
    "Uppsamlingens form. Ett villkor av varje sort, och de står på var sin plats.",
    { traps: [[`SELECT s.StudentNo, s.Name, COUNT(*) ${SH} WHERE s.Age > 24 GROUP BY s.StudentNo, s.Name HAVING COUNT(*) >= 2;`, "inskrivet värde"]] }),
  task("tn-25", "blandat",
    "Studentnummer, namn och antal lästa kurser för studenter vars betyg på kurs C2 är högre än snittbetyget på C2",
    `SELECT s.StudentNo, s.Name, COUNT(*) AS AntalKurser ${SH} WHERE s.StudentNo IN (SELECT StudentNo FROM HasStudied WHERE Code = 'C2' AND Grade > (SELECT AVG(Grade) FROM HasStudied WHERE Code = 'C2')) GROUP BY s.StudentNo, s.Name;`,
    "Den ordinarie tentans form. Antalet gäller alla studentens kurser, så C2-villkoret får inte stå på raderna som räknas.",
    "Skriver du h.Code = 'C2' i den yttre frågan blir antalet alltid 1. Lägg hela urvalet i en underfråga på StudentNo.",
    { traps: [[`SELECT s.StudentNo, s.Name, COUNT(*) ${SH} WHERE h.Code = 'C2' AND h.Grade > (SELECT AVG(Grade) FROM HasStudied WHERE Code = 'C2') GROUP BY s.StudentNo, s.Name;`, "räknar bara C2-raden"]] }),
  task("tn-26", "blandat",
    "Kurskod, namn och högsta betyg för kurser som läses av student S5 men inte av student S7",
    `SELECT c.Code, c.Name, MAX(h.Grade) AS HogstaBetyg ${CH} WHERE c.Code IN (SELECT Code FROM HasStudied WHERE StudentNo = 'S5') AND c.Code NOT IN (SELECT Code FROM HasStudied WHERE StudentNo = 'S7') GROUP BY c.Code, c.Name;`,
    "Högsta betyget gäller hela kursen, inte bara S5:s rad.",
    "Filtrerar du på S5 i den yttre frågan blir MAX S5:s eget betyg. C4 skulle då visa 7 i stället för 8.",
    { traps: [[`SELECT c.Code, c.Name, MAX(h.Grade) ${CH} WHERE h.StudentNo = 'S5' AND c.Code NOT IN (SELECT Code FROM HasStudied WHERE StudentNo = 'S7') GROUP BY c.Code, c.Name;`, "högsta blir bara S5:s betyg"]] }),
  task("tn-27", "blandat",
    "Studentnummer, namn och högsta betyg för studenter som är yngre än student S7 och har läst 2 eller fler kurser",
    `SELECT s.StudentNo, s.Name, MAX(h.Grade) AS HogstaBetyg ${SH} WHERE s.Age < (SELECT Age FROM Student WHERE StudentNo = 'S7') GROUP BY s.StudentNo, s.Name HAVING COUNT(*) >= 2;`,
    "Tre delar: WHERE med underfråga för åldern, MAX per grupp, HAVING för antalet.",
    "SELECT räknar MAX medan HAVING räknar COUNT. De behöver inte vara samma aggregat.",
    { traps: [
      [`SELECT s.StudentNo, s.Name, MAX(h.Grade) ${SH} WHERE s.Age < (SELECT Age FROM Student WHERE StudentNo = 'S7') GROUP BY s.StudentNo, s.Name;`, "saknar villkoret på antalet"],
      [`SELECT s.StudentNo, s.Name, MAX(h.Grade) ${SH} WHERE s.Age < 27 GROUP BY s.StudentNo, s.Name HAVING COUNT(*) >= 2;`, "inskrivet värde"],
    ] }),
  task("tn-28", "blandat",
    "Studentnummer, namn och snittbetyg för studenter som bor på samma adress som student S1, men inte S1 själv",
    `SELECT s.StudentNo, s.Name, AVG(h.Grade) AS Snittbetyg ${SH} WHERE s.Address = (SELECT Address FROM Student WHERE StudentNo = 'S1') AND s.StudentNo <> 'S1' GROUP BY s.StudentNo, s.Name;`,
    "Adressen hämtas som åldern: med en skalär underfråga, som här ger en text.",
    "En underfråga kan ge vilket värde som helst, inte bara tal. Mönstret är detsamma.",
    { traps: [
      [`SELECT s.StudentNo, s.Name, AVG(h.Grade) ${SH} WHERE s.Address = 'Main street' AND s.StudentNo <> 'S1' GROUP BY s.StudentNo, s.Name;`, "inskrivet värde"],
      [`SELECT s.StudentNo, s.Name, AVG(h.Grade) ${SH} WHERE s.Address = (SELECT Address FROM Student WHERE StudentNo = 'S1') GROUP BY s.StudentNo, s.Name;`, "S1 kommer med"],
    ] }),
  task("tn-29", "blandat",
    "Kurskod, namn och antal studenter för kurser vars snittbetyg är högre än snittbetyget på kurs C4",
    `SELECT c.Code, c.Name, COUNT(*) AS AntalStudenter ${CH} GROUP BY c.Code, c.Name HAVING AVG(h.Grade) > (SELECT AVG(Grade) FROM HasStudied WHERE Code = 'C4');`,
    "Kursens snitt är ett gruppvärde, så jämförelsen står i HAVING. SELECT visar antalet, HAVING prövar snittet.",
    "Aggregatet i HAVING behöver inte finnas i SELECT. Underfrågan ger ett enda värde att jämföra med. Båda snitten räknas i heltal, så C4:s 6,67 blir 6.",
    { traps: [[`SELECT c.Code, c.Name, COUNT(*) ${CH} WHERE h.Grade > (SELECT AVG(Grade) FROM HasStudied WHERE Code = 'C4') GROUP BY c.Code, c.Name;`, "jämför varje betyg i stället för kursens snitt"]] }),
  task("tn-30", "blandat",
    "Studentnummer, namn och kursens namn för den eller de studenter som fått högst betyg på kurs C1",
    "SELECT s.StudentNo, s.Name, c.Name FROM HasStudied AS h INNER JOIN Student AS s ON s.StudentNo = h.StudentNo INNER JOIN Course AS c ON c.Code = h.Code WHERE h.Code = 'C1' AND h.Grade = (SELECT MAX(Grade) FROM HasStudied WHERE Code = 'C1');",
    "\"Den eller de\" betyder att flera kan dela förstaplatsen. Jämför med MAX i en underfråga.",
    "TOP 1 med ORDER BY ger bara en rad, också när två delar högsta betyget.",
    { traps: [
      ["SELECT TOP 1 s.StudentNo, s.Name, c.Name FROM HasStudied AS h INNER JOIN Student AS s ON s.StudentNo = h.StudentNo INNER JOIN Course AS c ON c.Code = h.Code WHERE h.Code = 'C1' ORDER BY h.Grade DESC;", "TOP 1 missar delad förstaplats"],
      ["SELECT s.StudentNo, s.Name, c.Name FROM HasStudied AS h INNER JOIN Student AS s ON s.StudentNo = h.StudentNo INNER JOIN Course AS c ON c.Code = h.Code WHERE h.Code = 'C1' AND h.Grade = (SELECT MAX(Grade) FROM HasStudied);", "högsta över alla kurser"],
    ] }),
  task("tn-31", "blandat",
    "Kurskod, namn och snittbetyg över alla studenter för kurser som läses av minst en student som bor på Main street",
    `SELECT c.Code, c.Name, AVG(h.Grade) AS Snittbetyg ${CH} WHERE c.Code IN (SELECT h2.Code FROM HasStudied AS h2 INNER JOIN Student AS s ON s.StudentNo = h2.StudentNo WHERE s.Address = 'Main street') GROUP BY c.Code, c.Name;`,
    "Adressvillkoret väljer ut kurser. Det får inte ta bort andra studenters betyg ur snittet.",
    "Joinar du Student i den yttre frågan och filtrerar på adressen räknas snittet bara över Main street.",
    { traps: [[`SELECT c.Code, c.Name, AVG(h.Grade) FROM Course AS c INNER JOIN HasStudied AS h ON h.Code = c.Code INNER JOIN Student AS s ON s.StudentNo = h.StudentNo WHERE s.Address = 'Main street' GROUP BY c.Code, c.Name;`, "snittet bara över Main street"]] }),
  task("tn-32", "blandat",
    "Studentnummer, namn och antal lästa kurser för studenter som är äldre än student S1 och har läst kurs C3 men inte kurs C4",
    `SELECT s.StudentNo, s.Name, COUNT(*) AS AntalKurser ${SH} WHERE s.StudentNo IN (SELECT StudentNo FROM HasStudied WHERE Code = 'C3') AND s.StudentNo NOT IN (SELECT StudentNo FROM HasStudied WHERE Code = 'C4') AND s.Age > (SELECT Age FROM Student WHERE StudentNo = 'S1') GROUP BY s.StudentNo, s.Name;`,
    "Tre villkor på studenten, alla i WHERE. Antalet räknas över det som är kvar.",
    "Alla tre gäller studenten som helhet, så inget av dem står på HasStudied-raderna som räknas.",
    { traps: [[`SELECT s.StudentNo, s.Name, COUNT(*) ${SH} WHERE h.Code = 'C3' AND s.StudentNo NOT IN (SELECT StudentNo FROM HasStudied WHERE Code = 'C4') AND s.Age > (SELECT Age FROM Student WHERE StudentNo = 'S1') GROUP BY s.StudentNo, s.Name;`, "räknar bara C3-raden"]] }),

  // ---- Över tentans nivå ----
  task("tn-33", "over",
    "Studentnummer, namn och antal lästa kurser för samtliga studenter, även de som inte har läst någon kurs",
    "SELECT s.StudentNo, s.Name, COUNT(h.Code) AS AntalKurser FROM Student AS s LEFT JOIN HasStudied AS h ON h.StudentNo = s.StudentNo GROUP BY s.StudentNo, s.Name;",
    "\"Även de som inte\" betyder LEFT JOIN. Tänk på vad COUNT räknar.",
    "LEFT JOIN ger studenten utan kurser en rad med NULL. COUNT(*) räknar den raden och ger 1, COUNT(h.Code) hoppar över NULL och ger 0.",
    { traps: [["SELECT s.StudentNo, s.Name, COUNT(*) FROM Student AS s LEFT JOIN HasStudied AS h ON h.StudentNo = s.StudentNo GROUP BY s.StudentNo, s.Name;", "COUNT(*) ger 1 för den som inte läst något"]] }),
  task("tn-34", "over",
    "Studentnummer, kurskod och betyg för alla betyg som är högre än snittbetyget på samma kurs",
    "SELECT h.StudentNo, h.Code, h.Grade FROM HasStudied AS h WHERE h.Grade > (SELECT AVG(h2.Grade) FROM HasStudied AS h2 WHERE h2.Code = h.Code);",
    "Snittet beror på vilken rad som prövas. Underfrågan behöver referera till den yttre radens kurs: en korrelerad underfråga.",
    "Två alias på samma tabell håller isär raden som prövas och raderna som snittet räknas över. Underfrågan körs en gång per rad.",
    { traps: [["SELECT h.StudentNo, h.Code, h.Grade FROM HasStudied AS h WHERE h.Grade > (SELECT AVG(Grade) FROM HasStudied);", "snittet över alla kurser"]] }),
  task("tn-35", "over",
    "Studentnummer och namn för studenter som har läst alla kurser som student S3 har läst, men inte S3 själv",
    "SELECT s.StudentNo, s.Name FROM Student AS s WHERE s.StudentNo <> 'S3' AND NOT EXISTS (SELECT 1 FROM HasStudied AS k WHERE k.StudentNo = 'S3' AND NOT EXISTS (SELECT 1 FROM HasStudied AS h WHERE h.StudentNo = s.StudentNo AND h.Code = k.Code));",
    "SQL har ingen färdig operator för \"har läst alla\". Vänd på frågan: det finns ingen av S3:s kurser som studenten inte har läst.",
    "Dubbel NOT EXISTS, relationell division. Det går också att räkna: HAVING COUNT(*) = antalet kurser S3 läst, med WHERE på S3:s kurser.",
    { also: [`SELECT s.StudentNo, s.Name ${SH} WHERE s.StudentNo <> 'S3' AND h.Code IN (SELECT Code FROM HasStudied WHERE StudentNo = 'S3') GROUP BY s.StudentNo, s.Name HAVING COUNT(*) = (SELECT COUNT(*) FROM HasStudied WHERE StudentNo = 'S3');`],
      traps: [[`SELECT DISTINCT s.StudentNo, s.Name ${SH} WHERE s.StudentNo <> 'S3' AND h.Code IN (SELECT Code FROM HasStudied WHERE StudentNo = 'S3');`, "minst en kurs, inte alla"]] }),
  task("tn-36", "over",
    "Kurskod och namn för kurser som alla studenter på Main street har läst",
    "SELECT c.Code, c.Name FROM Course AS c WHERE NOT EXISTS (SELECT 1 FROM Student AS s WHERE s.Address = 'Main street' AND NOT EXISTS (SELECT 1 FROM HasStudied AS h WHERE h.StudentNo = s.StudentNo AND h.Code = c.Code));",
    "Samma vändning: det finns ingen student på Main street som inte har läst kursen.",
    "Läs inifrån och ut. Innerst: har studenten läst kursen? I mitten: finns någon på Main street som inte har det? Ytterst: kurser där svaret är nej.",
    { also: [`SELECT c.Code, c.Name FROM Course AS c INNER JOIN HasStudied AS h ON h.Code = c.Code INNER JOIN Student AS s ON s.StudentNo = h.StudentNo WHERE s.Address = 'Main street' GROUP BY c.Code, c.Name HAVING COUNT(*) = (SELECT COUNT(*) FROM Student WHERE Address = 'Main street');`],
      traps: [
        [`SELECT DISTINCT c.Code, c.Name FROM Course AS c INNER JOIN HasStudied AS h ON h.Code = c.Code INNER JOIN Student AS s ON s.StudentNo = h.StudentNo WHERE s.Address = 'Main street';`, "minst en student, inte alla"],
        [`SELECT c.Code, c.Name FROM Course AS c INNER JOIN HasStudied AS h ON h.Code = c.Code INNER JOIN Student AS s ON s.StudentNo = h.StudentNo WHERE s.Address = 'Main street' GROUP BY c.Code, c.Name HAVING COUNT(*) = 3;`, "inskrivet antal"],
      ] }),
  task("tn-37", "over",
    "Studentnummer och namn för studenter som har läst kurs C1 eller kurs C2, men inte båda",
    `SELECT s.StudentNo, s.Name ${SH} WHERE h.Code IN ('C1', 'C2') GROUP BY s.StudentNo, s.Name HAVING COUNT(*) = 1;`,
    "Behåll bara raderna för C1 och C2. Den som läst exakt en av dem har då exakt en rad kvar.",
    "WHERE smalnar av till de två kurserna, HAVING prövar hur många av dem studenten har. Det går också att skriva med IN och NOT IN åt båda håll, förenade med OR.",
    { also: ["SELECT StudentNo, Name FROM Student WHERE (StudentNo IN (SELECT StudentNo FROM HasStudied WHERE Code = 'C1') AND StudentNo NOT IN (SELECT StudentNo FROM HasStudied WHERE Code = 'C2')) OR (StudentNo IN (SELECT StudentNo FROM HasStudied WHERE Code = 'C2') AND StudentNo NOT IN (SELECT StudentNo FROM HasStudied WHERE Code = 'C1'));"],
      traps: [[`SELECT DISTINCT s.StudentNo, s.Name ${SH} WHERE h.Code IN ('C1', 'C2');`, "tar med dem som läst båda"]] }),
  task("tn-38", "over",
    "Studentnummer, namn och antal lästa kurser för den eller de studenter som har läst flest kurser",
    `SELECT s.StudentNo, s.Name, COUNT(*) AS AntalKurser ${SH} GROUP BY s.StudentNo, s.Name HAVING COUNT(*) = (SELECT MAX(Antal) FROM (SELECT COUNT(*) AS Antal FROM HasStudied GROUP BY StudentNo) AS t);`,
    "Det högsta antalet är ett aggregat av ett aggregat. Räkna per student i en underfråga i FROM, och ta MAX av den.",
    "MAX(COUNT(*)) går inte att skriva direkt. Underfrågan i FROM måste ha ett alias i SQL Server.",
    { also: [`SELECT s.StudentNo, s.Name, COUNT(*) ${SH} GROUP BY s.StudentNo, s.Name HAVING COUNT(*) >= ALL (SELECT COUNT(*) FROM HasStudied GROUP BY StudentNo);`],
      traps: [
        [`SELECT TOP 1 s.StudentNo, s.Name, COUNT(*) ${SH} GROUP BY s.StudentNo, s.Name ORDER BY COUNT(*) DESC;`, "TOP 1 missar delad förstaplats"],
        [`SELECT s.StudentNo, s.Name, COUNT(*) ${SH} GROUP BY s.StudentNo, s.Name HAVING COUNT(*) = 3;`, "inskrivet antal"],
        [`SELECT TOP 4 s.StudentNo, s.Name, COUNT(*) ${SH} GROUP BY s.StudentNo, s.Name ORDER BY COUNT(*) DESC;`, "inskrivet antal rader"],
      ] }),
];

// Tentornas egna uppgift 4, ordagrant och på tentans egna rader. Id:t är det
// svaren sparades under när de låg i det gamla läget Tenta.
const realQuestions = oldExams.map((exam) => ({
  ...exam.task4,
  id: `sql-tenta:${exam.id}`,
  exam: true,
  section: "egna",
  label: exam.dateLabel.replace(/^(\d+) (\w{3})\w* (\d{4})$/, "$1 $2 $3"),
  source: `${exam.title} ${exam.dateLabel}`,
}));

export const sqlExamTasks = [...bank, ...realQuestions];

const DERIVED_NOTE = "Tabellerna är tentans med fler rader, så att fler fel syns.";

const METHOD = `
Stryk under i frågan innan du skriver:

1. **Vilka kolumner** ska ut?
2. **Per vad?** Det ger GROUP BY.
3. **Vilka villkor**, och gäller de raden eller gruppen?
4. **Vilka värden** måste hämtas ur andra rader?

Skriv sedan SELECT, FROM med joinarna, WHERE, GROUP BY och HAVING i den ordningen.

**Tre frågor innan du rättar:** Räknas rätt rader, eller har ett villkor tagit bort rader som skulle räknas? Är något värde inskrivet? Står varje villkor på rätt ställe?
`;

// Sektionerna i läget Tentanivå, lättast först. `level` pekar ut en nivå i
// sqlExercises.js i stället för egna frågor, `lessonFrom` en nivås genomgång.
export const examSections = [
  {
    id: "join",
    kicker: "Steg 1",
    title: "Join och gruppering",
    summary: "Grunden i varje tentafråga: tre tabeller och en rad per student eller kurs.",
    note: DERIVED_NOTE,
    guide: `
**HasStudied binder ihop** Student och Course. Student joinas på StudentNo, Course på Code.

**En rad per student eller kurs** betyder GROUP BY på den: allt i SELECT som inte är ett aggregat ska stå i GROUP BY.

**Name finns i både Student och Course.** Är båda tabellerna med måste du skriva s.Name eller c.Name, annars vägrar databasen.

    SELECT s.StudentNo, s.Name, MIN(h.Grade) AS LagstaBetyg
    FROM Student AS s
        INNER JOIN HasStudied AS h ON h.StudentNo = s.StudentNo
    GROUP BY s.StudentNo, s.Name;
`,
    checklist: [
      "Join på rätt kolumn: StudentNo mellan Student och HasStudied, Code mellan Course och HasStudied",
      "Allt i SELECT som inte är ett aggregat står i GROUP BY",
      "s.Name och c.Name, aldrig bara Name, när båda tabellerna är med",
    ],
  },
  {
    id: "having",
    kicker: "Steg 2",
    title: "Villkor på grupper",
    summary: "WHERE eller HAVING: gäller villkoret raden eller hela gruppen?",
    note: DERIVED_NOTE,
    guide: `
**WHERE** tar bort rader före grupperingen. **HAVING** tar bort grupper efter den.

Fråga dig: går villkoret att avgöra på en enda rad? Då WHERE. Behöver du se alla studentens rader, som antal, snitt eller lägsta betyg? Då HAVING.

    SELECT c.Code, COUNT(*) AS Antal
    FROM Course AS c
        INNER JOIN HasStudied AS h ON h.Code = c.Code
    GROUP BY c.Code
    HAVING MIN(h.Grade) >= 6;

Aliaset från SELECT finns inte i HAVING i SQL Server. Upprepa uttrycket.
`,
    checklist: [
      "Villkor på antal, snitt, högsta eller lägsta står i HAVING",
      "Villkor som går att avgöra på en rad står i WHERE",
      "\"Minst\" är >=, \"fler än\" är >",
    ],
  },
  {
    id: "skalar",
    kicker: "Steg 3",
    title: "Värde ur en annan rad",
    summary: "Äldre än S4, högre än snittet: jämför med ett värde som hämtas med en underfråga.",
    note: DERIVED_NOTE,
    guide: `
Hör jämförelsevärdet till **en annan rad** än den som prövas, eller är det ett **aggregat**, hämtas det med en skalär underfråga.

    WHERE s.Age < (SELECT Age FROM Student WHERE StudentNo = 'S2')

**Skriv aldrig in talet.** Det ger rätt rader på den här datan men är fel svar på uppgiften. Rättningen här kör därför frågan också på ändrade värden.

Underfrågan måste ge **ett enda värde**. Ger den flera rader vägrar SQL Server köra frågan.

Ett aggregat får inte stå direkt i WHERE. \`WHERE Age > AVG(Age)\` ger fel, medan underfrågan fungerar.
`,
    checklist: [
      "Värdet hämtas med en underfråga, det är inte inskrivet",
      "Underfrågan ger ett enda värde",
      "Är det som prövas ett aggregat per grupp står jämförelsen i HAVING",
    ],
  },
  {
    id: "mangd",
    kicker: "Steg 4",
    title: "X men inte Y",
    summary: "Läses av S1 men inte av S2: två mängder, aldrig två villkor på samma rad.",
    note: DERIVED_NOTE,
    guide: `
En rad i HasStudied gäller **en** student och **en** kurs. Därför kan \`h.StudentNo = 'S1' AND h.StudentNo <> 'S2'\` aldrig säga något om S2.

Tänk i två mängder och lägg dem på nyckeln:

    WHERE c.Code IN (SELECT Code FROM HasStudied WHERE StudentNo = 'S2')
      AND c.Code NOT IN (SELECT Code FROM HasStudied WHERE StudentNo = 'S3')

NOT EXISTS och EXCEPT fungerar också.

**Fällan:** vill du dessutom ha ett snitt över alla studenter får villkoret på den första studenten inte stå på raderna som räknas. Då blir snittet bara den studentens betyg.
`,
    checklist: [
      "Två mängder med IN och NOT IN, NOT EXISTS eller EXCEPT",
      "Villkoret ligger på nyckeln, inte på HasStudied-raderna som räknas",
      "Inner join visar aldrig den som saknar rader",
    ],
  },
  {
    id: "blandat",
    kicker: "Steg 5",
    title: "Tentanivå",
    summary: "Sammansatta frågor av samma slag som tentornas: flera villkor i en fråga.",
    note: DERIVED_NOTE,
    guide: METHOD,
    checklist: [
      "Villkor på studenten eller kursen tar inte bort rader som ska räknas",
      "Radvillkor i WHERE, gruppvillkor i HAVING",
      "Inga inskrivna värden",
      "En enda fråga med ett resultat",
    ],
  },
  {
    id: "egna",
    kicker: "Tentorna",
    title: "Tentornas egna frågor",
    summary: "Uppgift 4 från de tre tentorna, ordagrant och på tentans egna rader.",
    highlight: true,
    guide: METHOD,
  },
  {
    id: "andra",
    kicker: "Steg 6",
    title: "Samma form, andra tabeller",
    summary: "Kan du mönstret, eller bara tabellerna? Tentans form på Reader, Book och HasRead.",
    level: "tenta",
    tableNames: ["Reader", "Book", "HasRead"],
    lessonFrom: "tenta",
  },
  {
    id: "over",
    kicker: "Överkurs",
    title: "Över tentans nivå",
    summary: "LEFT JOIN med antal, korrelerade frågor och \"alla\". För den som vill ha marginal.",
    note: DERIVED_NOTE,
    lessonFrom: "n9",
    checklist: [
      "LEFT JOIN när de som saknar rader ska med, och COUNT på en kolumn från högra tabellen",
      "Korrelerad underfråga när värdet beror på den rad som prövas",
      "\"Alla\" skrivs som dubbel NOT EXISTS, eller som ett antal som ska stämma",
    ],
  },
];
