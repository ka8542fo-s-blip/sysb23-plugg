// Fliken Tenta: sajtens egna övningstentor i Databaser, i den form HT26-tentan
// väntas få (Björn, via Kasper): fem uppgifter à 20 poäng. Uppgift 1–4 har
// samma typ som HT25-tentorna (oldExams.js), uppgift 5 är en JDBC-uppgift i
// handoutens form (2026-jdbc-example-handout.pdf, som fliken Java).
//
// Allt innehåll är eget: nya domäner (gym, veterinärklinik), egna FD:er och
// egen data i Student/Course/HasStudied. Texterna följer HT25-tentornas
// ordalydelse, med 20 poäng per uppgift. Rättningen är de befintliga
// rättarna (lib/examGrade.js); poängreglerna står i PRACTICE_RULES och i
// vyn (views/PracticeExam.jsx).
//
// Uppgift 1: sant/falskt per påstående avgjort ur diagrammet med kapitel 6:s
// regler, exakt fyra sanna. Uppgift 2: facit som strukturdata för
// lib/ddlCheck.js. Uppgift 3a–e: strukturerade utsagor (`claim`) som
// FD-motorn avgör; 3f och 3g gäller samma R. Uppgift 4: egen data med
// tentans tre tabeller och en verifierad facitfråga. Uppgift 5: en uppgift i
// javaTasks.js-format, rättad av lib/javaCheck.js.
import { daoClass, examTail, SQL_IMPORTS } from "./javaTasks.js";

const st = (text, truth, why) => ({ text, truth, why });
const r = (rule, why) => ({ rule, why });
const R = (name, attrs, pk) => ({ name, attrs, pk: [pk] });

export const PRACTICE_POINTS = { 1: 20, 2: 20, 3: 20, 4: 20, 5: 20 };

// Poängreglerna som vyn visar per uppgift.
export const PRACTICE_RULES = {
  1: [
    "+5 poäng för varje korrekt påstående som du markerar",
    "–3 poäng för varje felaktigt påstående som du markerar",
    "Om du markerar alla och endast de korrekta påståendena får du totalt 20 poäng",
    "Obesvarad uppgift (inga påståenden markerade) ger 0 poäng",
  ],
};

const TASK2_TEXT = [
  "Transformera den konceptuella datamodellen (ER-diagrammet) nedan till en fysisk datamodell. Skriv Data Definition Language-kod i SQL för implementation av ER-diagrammet, inklusive alla restriktioner (constraints), i SQL. Du får anta att samtliga kolumner är av datatypen INTEGER.",
  "Använd inte förkortningar för reserverade ord: Reserverade ord, såsom PRIMARY KEY och CONSTRAINT, ska skrivas ut i sin helhet. Du behöver inte namnge dina constraints.",
  "Tabeller som motsvarar vanliga (regular) och svaga (weak) entiteter ska använda automatiskt inkrementerande surrogatnycklar (surrogate keys).",
  "All SQL-kod ska vara tydligt formaterad och indenterad för att underlätta läsbarhet.",
];

export const PRACTICE_TASK3_RULE = "Ta ställning till nedanstående påstående. Rätt svar ger 2 poäng. Fel svar ger -1 poäng. Obesvarad uppgift ger 0 poäng.";
export const PRACTICE_TASK3_INTRO = "Ovanstående relation har brutits ned i följande scheman med relationer (primärnycklar har ej markerats):";
export const PRACTICE_TASK3F_TEXT = "Specificera högsta normalform (1NF - 3NF) för relationen R ovan. Motivera ditt svar genom att hänvisa till definitioner och specifika attribut. Använd endast definitioner och begrepp från kurslitteraturen, från föreläsningsmaterialet, eller från tentamens medföljande bilaga. Motivering krävs ej för relationer i 3NF. (5 poäng)";
export const PRACTICE_TASK3G_TEXT = [
  "Om relationen R inte är i 3NF ska du normalisera den till 3NF. Din nedbrytning ska bibehålla Lossless Join och Dependency Preservation. Övernormalisering ger poängavdrag. (5 poäng)",
  "Markera primärnyckel för varje relation i din nedbrytning genom att stryka under dem. Eventuella främmande nycklar (foreign keys) behöver inte markeras.",
];

const TASK4_TAIL = "Ovanstående ska returneras av en och samma fråga (query) i ett och samma result set. All SQL-kod ska vara tydligt formaterad och indenterad för att underlätta läsbarhet.";

// Tentans tre tabeller med egen data (inte HT25-tentornas rader).
const TABLES_1 = [
  {
    name: "Student",
    columns: [["StudentNo", "VARCHAR(10)"], ["Name", "VARCHAR(50)"], ["Age", "INT"], ["Address", "VARCHAR(50)"]],
    rows: [
      ["S1", "Phoebe", 27, "Main street"],
      ["S2", "Olivia", 32, "Main street"],
      ["S3", "Max", 18, "Codd street"],
      ["S4", "Gary", 33, "Chen street"],
      ["S5", "Lisa", 24, "Codd street"],
      ["S6", "Omar", 19, "Main street"],
    ],
  },
  {
    name: "Course",
    columns: [["Code", "VARCHAR(10)"], ["Name", "VARCHAR(50)"], ["Credits", "INT"]],
    rows: [["C1", "Databases", 5], ["C2", "Java", 10], ["C3", "Artificial Intelligence", 15], ["C4", "Statistics", 7]],
  },
  {
    name: "HasStudied",
    columns: [["StudentNo", "VARCHAR(10)"], ["Code", "VARCHAR(10)"], ["Grade", "INT"]],
    rows: [
      ["S1", "C1", 7], ["S1", "C2", 8], ["S1", "C4", 6],
      ["S2", "C3", 6], ["S2", "C1", 9],
      ["S3", "C2", 5], ["S3", "C1", 4],
      ["S4", "C4", 8],
      ["S5", "C1", 6], ["S5", "C3", 7],
      ["S6", "C2", 9], ["S6", "C3", 8],
    ],
  },
];

const GYMCLASS_DDL = `CREATE TABLE GymClass (
    GymClassID      INT          IDENTITY(1, 1) NOT NULL,
    ClassCode       VARCHAR(10)  NOT NULL,
    Name            VARCHAR(50)  NOT NULL,
    Instructor      VARCHAR(50),
    MaxParticipants INT          NOT NULL,

    CONSTRAINT PK_GymClass_GymClassID
        PRIMARY KEY (GymClassID),
    CONSTRAINT UQ_GymClass_ClassCode
        UNIQUE (ClassCode)
);`;

export const practiceExams = [
  {
    id: "ovningstenta-1",
    title: "Övningstenta 1",
    subtitle: "Gym och veterinärklinik",
    task1: {
      diagram: "ovn1-1",
      intro: "Givet är följande ER-diagram:",
      instruction: "Markera samtliga påståenden som är korrekta utifrån det givna ER-diagrammet.",
      rules: PRACTICE_RULES[1],
      statements: [
        st("En sal identifieras av dess nummer", false, "Sal är svag (dubbel rektangel) och Nummer är streckat understruket: en partiell identifierare, unik bara inom anläggningen. Två anläggningar kan båda ha sal nummer 1."),
        st("Ett pass måste hållas i exakt en sal", true, "Linjen vid Pass i Hålls är dubbel (minst en sal) och ratiot bredvid Sal är 1 (högst en): exakt en."),
        st("Ett pass måste ledas av en instruktör", false, "Linjen vid Pass i Leder är enkel: ett pass får finnas utan instruktör."),
        st("Två medlemmar kan ha samma namn", true, "Namn under Medlem är inte understruket. Identifieraren är Medlemsnummer."),
        st("En instruktör kan ha flera handledare", false, "Ratiot vid rollen handledare_för är 1: en instruktör har högst en handledare. Det är handledaren som kan handleda flera (M vid handleds_av)."),
        st("En anläggning måste ha minst en sal", false, "Linjen vid Anläggning i Ingår är enkel: en anläggning får sakna salar. Dubbellinjen sitter vid Sal, som är svag och alltid hör till en anläggning."),
        st("En sal identifieras av kombinationen av dess nummer samt adressen för den anläggning som salen ingår i", true, "Sal är svag under Anläggning via den identifierande relationen Ingår (dubbel romb). Den partiella identifieraren Nummer plus ägarens identifierare Adress ger salens identitet."),
        st("En medlem måste ha bokat minst ett pass", false, "Linjen vid Medlem i Bokar är enkel: en medlem får finnas utan bokningar."),
        st("En medlem kan boka ett pass som hålls i en sal på en annan anläggning än den anläggning där medlemmen är registrerad", true, "Flerstegspåstående: Bokar, Hålls, Ingår och Registrerad är obundna av varandra. Ingen symbol säger att passets anläggning ska vara medlemmens."),
        st("Två pass kan ha samma id", false, "Id under Pass är understruket: identifieraren, unik för varje pass."),
      ],
    },
    task2: {
      diagram: "ovn1-2",
      text: TASK2_TEXT,
      composites: ["Legitimation"],
      facit: [
        { name: "Klinik", kind: "entity", surrogate: "KlinikID", columns: [{ name: "Orgnr", notNull: true }, { name: "Namn" }], fks: [], unique: [["Orgnr"]] },
        { name: "Veterinar", kind: "entity", surrogate: "VeterinarID", columns: [{ name: "Land", notNull: true }, { name: "Nummer", notNull: true }, { name: "Namn" }], fks: [{ name: "KlinikID", to: "Klinik", notNull: true, rel: "Arbetar", tag: "1:N" }, { name: "MentorID", to: "Veterinar", notNull: false, rel: "Mentor", tag: "unär" }], unique: [["Land", "Nummer"]] },
        { name: "Agare", kind: "entity", surrogate: "AgareID", columns: [{ name: "Personnr", notNull: true }, { name: "Namn" }], fks: [], unique: [["Personnr"]] },
        { name: "Telefon", aliases: ["AgareTelefon", "Agare_Telefon"], kind: "multivalued", columns: [{ name: "Telefon" }], fks: [{ name: "AgareID", to: "Agare" }], pk: ["AgareID", "Telefon"] },
        { name: "Djur", kind: "weak", surrogate: "DjurID", columns: [{ name: "Namn", notNull: true }, { name: "Art" }], fks: [{ name: "AgareID", to: "Agare", notNull: true, rel: "Ager", tag: "svag entitet" }], unique: [["Namn", "AgareID"]] },
        { name: "Besok", kind: "junction", columns: [{ name: "Datum" }], fks: [{ name: "VeterinarID", to: "Veterinar" }, { name: "DjurID", to: "Djur" }], pk: ["VeterinarID", "DjurID"] },
      ],
      folded: {
        Arbetar: { tag: "1:N", why: "Arbetar är 1:M och blir en främmande nyckel i Veterinär, M-sidan — inte en egen tabell." },
        Mentor: { tag: "unär", why: "Mentor är unär 1:M och blir en nullbar främmande nyckel i Veterinär mot Veterinär självt — inte en egen tabell." },
        Ager: { tag: "svag entitet", why: "Äger är identifierande: Ägares nyckel läggs i Djur och ingår i Djurs UNIQUE." },
      },
      rules: {
        klinik: r("Vanlig entitet", "Surrogatnyckel som PRIMARY KEY och Orgnr som NOT NULL + UNIQUE."),
        veterinar: r("Sammansatt identifierare, 1:M och unär 1:M", "Legitimation blir sina delar Land och Nummer, båda NOT NULL, med en gemensam UNIQUE (Land, Nummer). Arbetar har dubbel linje vid Veterinär, så Kliniks nyckel blir NOT NULL. Mentor ger en främmande nyckel mot Veterinär självt; linjerna är enkla, så den får vara NULL."),
        agare: r("Vanlig entitet med flervärt attribut", "Surrogatnyckel som PRIMARY KEY och Personnr som NOT NULL + UNIQUE. Telefon är flervärt och blir en egen tabell."),
        telefon: r("Flervärt attribut", "Egen tabell med ägarens främmande nyckel plus värdet som PRIMARY KEY (AgareID, Telefon), utan surrogatnyckel."),
        djur: r("Svag entitet", "Egen surrogatnyckel, Ägares nyckel som NOT NULL främmande nyckel och UNIQUE (Namn, AgareID): Namn är unikt bara inom ägaren."),
        besok: r("M:N med attribut", "Egen tabell utan surrogatnyckel: PRIMARY KEY (VeterinarID, DjurID) och Datum som vanlig kolumn."),
      },
    },
    task3: {
      relation: "R(A, B, C, D, E, F, G)",
      attrs: "A, B, C, D, E, F, G",
      fds: ["{A, B} → C", "A → D", "D → E", "B → {F, G}"],
      schemas: [
        { name: "Schema 1", relations: [["R1", "A, B, C, D, E"], ["R2", "B, F, G"]] },
        { name: "Schema 2", relations: [["R1", "A, B, C"], ["R2", "A, D, E"], ["R3", "B, F, G"]] },
        { name: "Schema 3", relations: [["R1", "A, C"], ["R2", "B, C"], ["R3", "A, D"], ["R4", "D, E"], ["R5", "B, F, G"]] },
      ],
      statements: [
        { label: "3a", text: "Schema 3 är en nedbrytning (decomposition) av relation R som har egenskapen Lossless Join", claim: { type: "lossless", schema: 3 } },
        { label: "3b", text: "Schema 1 är en nedbrytning (decomposition) av relation R där samtliga funktionella beroenden från R är bevarade.", claim: { type: "preserving", schema: 1 } },
        { label: "3c", text: "Samtliga relationer i Schema 2 är i 3NF", claim: { type: "allNF", schema: 2, min: 3 } },
        { label: "3d", text: "Samtliga relationer i Schema 1 är i 2NF eller högre", claim: { type: "allNF", schema: 1, min: 2 } },
        { label: "3e", text: "Attribut A är en kandidatnyckel i relation R2 i Schema 2", claim: { type: "isCK", schema: 2, relation: "R2", attrs: ["A"] } },
      ],
      // 3f och 3g gäller R ovan.
      fg: {
        id: "ovningstenta-1-3fg",
        label: "3f–3g",
        relation: "R(A, B, C, D, E, F, G)",
        attrs: "A, B, C, D, E, F, G",
        fds: ["{A, B} → C", "A → D", "D → E", "B → {F, G}"],
        nf: "1NF",
        facit: [R("R1", "A, B, C", "A, B"), R("R2", "A, D", "A"), R("R3", "D, E", "D"), R("R4", "B, F, G", "B")],
        // Det motiveringen ska innehålla; självbedömningen (0–3 p) görs mot den.
        checklist: [
          "Kandidatnyckeln är {A, B}: A och B står inte i något högerled, och {A, B}⁺ = alla attribut",
          "D (eller E) är ett icke-primärattribut",
          "A är en äkta delmängd av kandidatnyckeln {A, B} och bestämmer D: partiellt beroende, så 2NF bryts",
          "Slutsats: R är i 1NF men inte i 2NF",
        ],
      },
    },
    task4: {
      tables: TABLES_1,
      ask: "Studentnummer, namn och summan av poäng (Credits) för samtliga lästa kurser, för studenter som är äldre än 20 år och har läst två eller fler kurser",
      tail: [TASK4_TAIL],
      solution: `SELECT
    s.StudentNo,
    s.Name,
    SUM(c.Credits) AS TotalPoang
FROM
    Student AS s
    INNER JOIN HasStudied AS h ON h.StudentNo = s.StudentNo
    INNER JOIN Course AS c ON c.Code = h.Code
WHERE
    s.Age > 20
GROUP BY
    s.StudentNo,
    s.Name
HAVING
    COUNT(*) >= 2;`,
      expected: { columns: ["StudentNo", "Name", "TotalPoang"], values: [["S1", "Phoebe", 22], ["S2", "Olivia", 20], ["S5", "Lisa", 20]] },
      explanation: "Join genom HasStudied till både Student (namn, ålder) och Course (poäng). Åldern filtrerar rader och står i WHERE; antalet kurser gäller gruppen och står i HAVING. S4 (33 år) har bara en kurs och S3 (18) och S6 (19) är för unga.",
    },
    task5: {
      id: "ovningstenta-1-java",
      title: "Byt instruktör på gympass",
      blocks: [
        { p: "Givet är en databas i Microsoft SQL Server som innehåller följande tabell:" },
        { code: GYMCLASS_DDL, lang: "sql" },
        { p: "Följande klass `GymClassDao` är också given:" },
        { code: daoClass("GymClassDao", SQL_IMPORTS), lang: "java" },
        { p: "Implementera följande instansmetod i klassen `GymClassDao`:" },
        {
          lang: "java",
          code: `public int replaceInstructor(
        String oldInstructor,
        String newInstructor
) throws SQLException`,
        },
        { p: "Metoden ska sätta värdet i kolumnen `Instructor` till värdet av parametern `newInstructor` för samtliga rader i tabellen `GymClass` vars värde i kolumnen `Instructor` är lika med värdet av parametern `oldInstructor`. Övriga rader ska inte ändras." },
        { p: "Metoden ska returnera antalet rader som ändrades." },
        ...examTail("GymClassDao", "Du får anta att parametrarna `oldInstructor` och `newInstructor` inte är `null`."),
      ],
      solution: `public int replaceInstructor(
        String oldInstructor,
        String newInstructor
) throws SQLException {
    String sql = "UPDATE GymClass "
            + "SET Instructor = ? "
            + "WHERE Instructor = ?;";

    try (Connection connection = connectionHandler.getConnection();
         PreparedStatement statement = connection.prepareStatement(sql)) {
        statement.setString(1, newInstructor);
        statement.setString(2, oldInstructor);
        return statement.executeUpdate();
    }
}`,
      check: {
        method: { name: "replaceInstructor", returns: "int", params: [["String", "oldInstructor"], ["String", "newInstructor"]] },
        sql: {
          kind: "UPDATE",
          table: "GymClass",
          set: [{ column: "Instructor", expr: "?", param: "newInstructor" }],
          where: [{ column: "Instructor", op: "=", param: "oldInstructor" }],
        },
        binds: { newInstructor: "setString", oldInstructor: "setString" },
        result: { kind: "affected" },
      },
    },
  },
];
