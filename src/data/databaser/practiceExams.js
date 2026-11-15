// Fliken Tenta: sajtens egna övningstentor i Databaser, i den form HT26-tentan
// väntas få (Björn, via Kasper): fem uppgifter à 20 poäng. Uppgift 1–4 har
// samma typ som HT25-tentorna (oldExams.js), uppgift 5 är en JDBC-uppgift i
// handoutens form (2026-jdbc-example-handout.pdf, som fliken Java).
//
// Allt innehåll är eget: nya domäner i uppgift 1 (gym, teater, skidort) och,
// som på HT25, abstrakta diagram med bokstäver i uppgift 2, egna FD:er och
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
import { daoClass, examTail, SQL_IMPORTS, QUERY_IMPORTS, LIST_IMPORTS } from "./javaTasks.js";

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

const STUDENT = [["StudentNo", "VARCHAR(10)"], ["Name", "VARCHAR(50)"], ["Age", "INT"], ["Address", "VARCHAR(50)"]];
const COURSE = [["Code", "VARCHAR(10)"], ["Name", "VARCHAR(50)"], ["Credits", "INT"]];
const HASSTUDIED = [["StudentNo", "VARCHAR(10)"], ["Code", "VARCHAR(10)"], ["Grade", "INT"]];

// Tenta 2: S6 har inte läst någon kurs (fångar en inre join).
const TABLES_2 = [
  {
    name: "Student",
    columns: STUDENT,
    rows: [
      ["S1", "Anna", 22, "Main street"],
      ["S2", "Bo", 31, "Codd street"],
      ["S3", "Cleo", 19, "Chen street"],
      ["S4", "Dan", 27, "Main street"],
      ["S5", "Eva", 24, "Codd street"],
      ["S6", "Femi", 35, "Chen street"],
    ],
  },
  {
    name: "Course",
    columns: COURSE,
    rows: [["C1", "Databases", 5], ["C2", "Java", 10], ["C3", "Artificial Intelligence", 15], ["C4", "Statistics", 7], ["C5", "Ethics", 3]],
  },
  {
    name: "HasStudied",
    columns: HASSTUDIED,
    rows: [
      ["S1", "C1", 8], ["S1", "C4", 7],
      ["S2", "C2", 6], ["S2", "C1", 9],
      ["S3", "C5", 5], ["S3", "C4", 8],
      ["S4", "C3", 9],
      ["S5", "C1", 4], ["S5", "C2", 7],
    ],
  },
];

// Tenta 3: medelåldern är 25,5 (25 i SQL Server), så heltalsdivisionen
// ändrar inte svaret.
const TABLES_3 = [
  {
    name: "Student",
    columns: STUDENT,
    rows: [
      ["S1", "Hugo", 21, "Main street"],
      ["S2", "Ida", 34, "Codd street"],
      ["S3", "Jon", 26, "Chen street"],
      ["S4", "Kim", 19, "Main street"],
      ["S5", "Lea", 30, "Codd street"],
      ["S6", "Mo", 23, "Chen street"],
    ],
  },
  {
    name: "Course",
    columns: COURSE,
    rows: [["C1", "Databases", 5], ["C2", "Java", 10], ["C3", "Artificial Intelligence", 15], ["C4", "Statistics", 7]],
  },
  {
    name: "HasStudied",
    columns: HASSTUDIED,
    rows: [
      ["S1", "C2", 7], ["S1", "C1", 8],
      ["S2", "C2", 9], ["S2", "C3", 6],
      ["S3", "C1", 5], ["S3", "C2", 6],
      ["S4", "C2", 8],
      ["S5", "C1", 9], ["S5", "C4", 7],
      ["S6", "C2", 5],
    ],
  },
];

const MOVIE_DDL = `CREATE TABLE Movie (
    MovieID     INT          IDENTITY(1, 1) NOT NULL,
    MovieCode   VARCHAR(10)  NOT NULL,
    Title       VARCHAR(100) NOT NULL,
    Genre       VARCHAR(30)  NOT NULL,
    ReleaseYear INT          NOT NULL,

    CONSTRAINT PK_Movie_MovieID
        PRIMARY KEY (MovieID),
    CONSTRAINT UQ_Movie_MovieCode
        UNIQUE (MovieCode)
);`;

const MOVIE_CLASS = `public class Movie {
    private int id;
    private String movieCode;
    private String title;
    private String genre;
    private int releaseYear;

    public Movie() {
    }

    public Movie(int id, String movieCode, String title,
                 String genre, int releaseYear) {
        this.id = id;
        this.movieCode = movieCode;
        this.title = title;
        this.genre = genre;
        this.releaseYear = releaseYear;
    }

    // Du får anta att get- och set-metoder finns för samtliga instansvariabler.
}`;

const VEHICLE_DDL = `CREATE TABLE Vehicle (
    VehicleID      INT         IDENTITY(1, 1) NOT NULL,
    RegistrationNo VARCHAR(10) NOT NULL,
    Brand          VARCHAR(50) NOT NULL,
    Model          VARCHAR(50) NOT NULL,
    ModelYear      INT         NOT NULL,

    CONSTRAINT PK_Vehicle_VehicleID
        PRIMARY KEY (VehicleID),
    CONSTRAINT UQ_Vehicle_RegistrationNo
        UNIQUE (RegistrationNo)
);`;

const VEHICLE_CLASS = `public class Vehicle {
    private int id;
    private String registrationNo;
    private String brand;
    private String model;
    private int modelYear;

    public Vehicle() {
    }

    public Vehicle(int id, String registrationNo, String brand,
                   String model, int modelYear) {
        this.id = id;
        this.registrationNo = registrationNo;
        this.brand = brand;
        this.model = model;
        this.modelYear = modelYear;
    }

    // Du får anta att get- och set-metoder finns för samtliga instansvariabler.
}`;

export const practiceExams = [
  {
    id: "ovningstenta-1",
    title: "Övningstenta 1",
    subtitle: "Gym",
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
      composites: ["B1"],
      facit: [
        { name: "A", kind: "entity", surrogate: "AID", columns: [{ name: "A1", notNull: true }, { name: "A2" }], fks: [], unique: [["A1"]] },
        { name: "B", kind: "entity", surrogate: "BID", columns: [{ name: "B2", notNull: true }, { name: "B3", notNull: true }, { name: "B4" }], fks: [{ name: "AID", to: "A", notNull: true, rel: "R1", tag: "1:N" }, { name: "BIDR2", to: "B", notNull: false, rel: "R2", tag: "unär" }], unique: [["B2", "B3"]] },
        { name: "C", kind: "entity", surrogate: "CID", columns: [{ name: "C1", notNull: true }, { name: "C2" }], fks: [], unique: [["C1"]] },
        { name: "C3", aliases: ["CC3", "C_C3"], kind: "multivalued", columns: [{ name: "C3" }], fks: [{ name: "CID", to: "C" }], pk: ["CID", "C3"] },
        { name: "D", kind: "weak", surrogate: "DID", columns: [{ name: "D1", notNull: true }, { name: "D2" }], fks: [{ name: "CID", to: "C", notNull: true, rel: "R4", tag: "svag entitet" }], unique: [["D1", "CID"]] },
        { name: "R3", kind: "junction", columns: [{ name: "R3a" }], fks: [{ name: "BID", to: "B" }, { name: "DID", to: "D" }], pk: ["BID", "DID"] },
      ],
      folded: {
        R1: { tag: "1:N", why: "R1 är 1:M och blir en främmande nyckel i B, M-sidan — inte en egen tabell." },
        R2: { tag: "unär", why: "R2 är unär 1:M och blir en nullbar främmande nyckel i B mot B självt — inte en egen tabell." },
        R4: { tag: "svag entitet", why: "R4 är identifierande: C:s nyckel läggs i D och ingår i D:s UNIQUE." },
      },
      rules: {
        a: r("Vanlig entitet", "Surrogatnyckel som PRIMARY KEY och A1 som NOT NULL + UNIQUE."),
        b: r("Sammansatt identifierare, 1:M och unär 1:M", "B1 blir sina delar B2 och B3, båda NOT NULL, med en gemensam UNIQUE (B2, B3). R1 har dubbel linje vid B, så A:s nyckel blir NOT NULL. R2 ger en främmande nyckel mot B självt; linjerna är enkla, så den får vara NULL."),
        c: r("Vanlig entitet med flervärt attribut", "Surrogatnyckel som PRIMARY KEY och C1 som NOT NULL + UNIQUE. C3 är flervärt och blir en egen tabell."),
        c3: r("Flervärt attribut", "Egen tabell med ägarens främmande nyckel plus värdet som PRIMARY KEY (CID, C3), utan surrogatnyckel."),
        d: r("Svag entitet", "Egen surrogatnyckel, C:s nyckel som NOT NULL främmande nyckel och UNIQUE (D1, CID): D1 är unikt bara inom C."),
        r3: r("M:N med attribut", "Egen tabell utan surrogatnyckel: PRIMARY KEY (BID, DID) och R3a som vanlig kolumn."),
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
  {
    id: "ovningstenta-2",
    title: "Övningstenta 2",
    subtitle: "Teater",
    task1: {
      diagram: "ovn2-1",
      intro: "Givet är följande ER-diagram:",
      instruction: "Markera samtliga påståenden som är korrekta utifrån det givna ER-diagrammet.",
      rules: PRACTICE_RULES[1],
      statements: [
        st("En salong identifieras av kombinationen av dess nummer samt namnet på den teater som salongen tillhör", true, "Salong är svag under Teater via den identifierande relationen Har (dubbel romb). Den partiella identifieraren Nummer plus ägarens identifierare Namn ger salongens identitet."),
        st("Två teatrar kan ha samma namn", false, "Namn under Teater är understruket: identifieraren, unik för varje teater."),
        st("En föreställning måste visas i exakt en salong", true, "Linjen vid Föreställning i Visas är dubbel (minst en salong) och ratiot bredvid Salong är 1 (högst en): exakt en."),
        st("En föreställning måste ha minst en medverkande skådespelare", false, "Linjen vid Föreställning i Medverkar är enkel: en föreställning får sakna skådespelare. Dubbellinjen sitter vid Skådespelare."),
        st("En pjäs kan vara en bearbetning av flera olika pjäser", false, "Ratiot vid rollen original är 1: en pjäs är bearbetning av högst en pjäs. Det är originalet som kan ha flera bearbetningar (M vid bearbetning_av)."),
        st("Två skådespelare kan ha samma förnamn", true, "Skådespelares identifierare är det sammansatta Id med delarna Förnamn och Efternamn. Förnamn ensamt är inte unikt — två skådespelare med samma förnamn och olika efternamn är tillåtna."),
        st("En teater måste ha minst en salong", false, "Linjen vid Teater i Har är enkel: en teater får sakna salonger. Dubbellinjen sitter vid Salong, som är svag och alltid hör till en teater."),
        st("En skådespelare måste medverka i minst en föreställning", true, "Linjen vid Skådespelare i Medverkar är dubbel: varje skådespelare deltar minst en gång."),
        st("En skådespelare identifieras endast av kombinationen av\n1. dess förnamn och efternamn,\n2. samt namnet på teatern där skådespelaren medverkar", false, "Skådespelare är en stark entitet (enkel rektangel, Medverkar är ingen identifierande relation). Den identifieras av Id, alltså förnamn och efternamn; teatern ingår inte."),
        st("En föreställning identifieras av sitt datum", false, "Datum under Föreställning är inte understruket. Identifieraren är Id."),
      ],
    },
    task2: {
      diagram: "ovn2-2",
      text: TASK2_TEXT,
      composites: ["D3"],
      facit: [
        { name: "A", kind: "entity", surrogate: "AID", columns: [{ name: "A1", notNull: true }, { name: "A2" }], fks: [], unique: [["A1"]] },
        { name: "B", kind: "weak", surrogate: "BID", columns: [{ name: "B1", notNull: true }, { name: "B2" }], fks: [{ name: "AID", to: "A", notNull: true, rel: "R1", tag: "svag entitet" }], unique: [["B1", "AID"]] },
        { name: "C", kind: "entity", surrogate: "CID", columns: [{ name: "C1", notNull: true }, { name: "R3a" }], fks: [{ name: "DID", to: "D", notNull: true, rel: "R3", tag: "1:N" }], unique: [["C1"]] },
        { name: "R2", kind: "junction", columns: [{ name: "R2a" }], fks: [{ name: "AID", to: "A" }, { name: "CID", to: "C" }], pk: ["AID", "CID"] },
        { name: "D", kind: "entity", surrogate: "DID", columns: [{ name: "D1", notNull: true }, { name: "D2" }, { name: "D4" }, { name: "D5" }], fks: [], unique: [["D1"]] },
        { name: "R4", kind: "junction", columns: [], fks: [{ name: "DID", to: "D" }, { name: "R4DID", to: "D" }], pk: ["DID", "R4DID"] },
      ],
      folded: {
        R1: { tag: "svag entitet", why: "R1 är identifierande: A:s nyckel läggs i B och ingår i B:s UNIQUE." },
        R3: { tag: "1:N", why: "R3 är 1:M och blir en främmande nyckel i C, M-sidan, med relationsattributet R3a — inte en egen tabell." },
      },
      rules: {
        a: r("Vanlig entitet", "Surrogatnyckel som PRIMARY KEY och A1 som NOT NULL + UNIQUE."),
        b: r("Svag entitet", "Egen surrogatnyckel, A:s nyckel som NOT NULL främmande nyckel och UNIQUE (B1, AID): B1 är unikt bara inom A."),
        c: r("Vanlig entitet, 1:M med attribut", "Surrogatnyckel och C1 som NOT NULL + UNIQUE. R3 har dubbel linje vid C, så D:s nyckel blir NOT NULL i C, och relationsattributet R3a följer med."),
        r2: r("M:N med attribut", "Egen tabell utan surrogatnyckel: PRIMARY KEY (AID, CID) och R2a som vanlig kolumn."),
        d: r("Vanlig entitet med sammansatt attribut", "Surrogatnyckel och D1 som NOT NULL + UNIQUE. D3 är sammansatt (inte en identifierare) och blir sina delar D4 och D5, vanliga kolumner."),
        r4: r("Unär M:N", "Egen tabell med två främmande nycklar mot D, båda i PRIMARY KEY, utan surrogatnyckel."),
      },
    },
    task3: {
      relation: "R(A, B, C, D, E, F, G)",
      attrs: "A, B, C, D, E, F, G",
      fds: ["{A, B} → {C, D}", "D → E", "C → {F, G}"],
      schemas: [
        { name: "Schema 1", relations: [["R1", "A, B, C, D, E"], ["R2", "C, F, G"]] },
        { name: "Schema 2", relations: [["R1", "A, B, C, D"], ["R2", "D, E"], ["R3", "C, F, G"]] },
        { name: "Schema 3", relations: [["R1", "A, B, D"], ["R2", "A, C"], ["R3", "D, E"], ["R4", "C, F, G"]] },
      ],
      statements: [
        { label: "3a", text: "Schema 2 är en nedbrytning (decomposition) av relation R som har egenskapen Lossless Join", claim: { type: "lossless", schema: 2 } },
        { label: "3b", text: "Schema 3 är en nedbrytning (decomposition) av relation R där samtliga funktionella beroenden från R är bevarade.", claim: { type: "preserving", schema: 3 } },
        { label: "3c", text: "Samtliga relationer i Schema 1 är i 3NF", claim: { type: "allNF", schema: 1, min: 3 } },
        { label: "3d", text: "Samtliga relationer i Schema 1 är i 2NF eller högre", claim: { type: "allNF", schema: 1, min: 2 } },
        { label: "3e", text: "Relation R1 i Schema 3 har fler än en kandidatnyckel", claim: { type: "manyCK", schema: 3, relation: "R1" } },
      ],
      fg: {
        id: "ovningstenta-2-3fg",
        label: "3f–3g",
        relation: "R(A, B, C, D, E, F, G)",
        attrs: "A, B, C, D, E, F, G",
        fds: ["{A, B} → {C, D}", "D → E", "C → {F, G}"],
        nf: "2NF",
        facit: [R("R1", "A, B, C, D", "A, B"), R("R2", "D, E", "D"), R("R3", "C, F, G", "C")],
        checklist: [
          "Kandidatnyckeln är {A, B}: A och B står inte i något högerled, och {A, B}⁺ = alla attribut",
          "2NF håller: varken A eller B ensamt bestämmer något icke-primärattribut",
          "D är ingen superkey och bestämmer icke-primärattributet E (eller C bestämmer F och G): transitivt beroende, så 3NF bryts",
          "Slutsats: R är i 2NF men inte i 3NF",
        ],
      },
    },
    task4: {
      tables: TABLES_2,
      ask: "Studentnummer och namn för samtliga studenter som inte har läst någon kurs som omfattar 10 poäng (Credits) eller mer",
      tail: [TASK4_TAIL],
      solution: `SELECT
    s.StudentNo,
    s.Name
FROM
    Student AS s
WHERE
    NOT EXISTS (
        SELECT *
        FROM
            HasStudied AS h
            INNER JOIN Course AS c ON c.Code = h.Code
        WHERE
            h.StudentNo = s.StudentNo
            AND c.Credits >= 10
    );`,
      expected: { columns: ["StudentNo", "Name"], values: [["S1", "Anna"], ["S3", "Cleo"], ["S6", "Femi"]] },
      explanation: "Mängddifferens: alla studenter utom de som har minst en kurs på 10 poäng eller mer (C2 och C3). S2, S4 och S5 har en sådan kurs. S6 har inte läst något alls och ska med — en inre join mot HasStudied tappar S6, och WHERE Credits < 10 på join-raderna tar med S2 och S5, som också har en kurs under 10 poäng. NOT IN eller EXCEPT ger samma svar.",
    },
    task5: {
      id: "ovningstenta-2-java",
      title: "Hämta filmer som släppts efter ett givet år",
      blocks: [
        { p: "Givet är en databas i Microsoft SQL Server som innehåller följande tabell:" },
        { code: MOVIE_DDL, lang: "sql" },
        { p: "Givet är även följande klass `Movie`:" },
        { code: MOVIE_CLASS, lang: "java" },
        { p: "Följande klass `MovieDao` är också given:" },
        { code: daoClass("MovieDao", LIST_IMPORTS), lang: "java" },
        { p: "Implementera följande instansmetod i klassen `MovieDao`:" },
        {
          lang: "java",
          code: `public ArrayList<Movie> findMoviesReleasedAfter(
        int year
) throws SQLException`,
        },
        { p: "Metoden ska hämta samtliga rader i tabellen `Movie` vars värde i kolumnen `ReleaseYear` är **större än** värdet av parametern `year`." },
        { p: "Metoden ska returnera ett objekt av typen `ArrayList<Movie>` som innehåller ett objekt av typen `Movie` för varje rad som uppfyller villkoret. Samtliga instansvariabler i varje `Movie`-objekt ska tilldelas värden från motsvarande kolumner i raden. Instansvariabeln `id` motsvarar kolumnen `MovieID`." },
        { p: "Objekten i listan ska vara ordnade efter värdet i kolumnen `Title` i stigande (alfabetisk) ordning. Ordningen ska bestämmas i SQL-frågan." },
        { p: "Om inga rader uppfyller villkoret ska metoden returnera en tom `ArrayList<Movie>`, inte `null`." },
        ...examTail("MovieDao", "Du får anta att parametern `year` är större än `0`.", "Movie"),
      ],
      solution: `public ArrayList<Movie> findMoviesReleasedAfter(
        int year
) throws SQLException {
    String sql = "SELECT MovieID, MovieCode, Title, Genre, ReleaseYear "
            + "FROM Movie "
            + "WHERE ReleaseYear > ? "
            + "ORDER BY Title ASC;";
    ArrayList<Movie> movies = new ArrayList<>();

    try (Connection connection = connectionHandler.getConnection();
         PreparedStatement statement = connection.prepareStatement(sql)) {
        statement.setInt(1, year);

        try (ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                Movie movie = new Movie(
                        resultSet.getInt("MovieID"),
                        resultSet.getString("MovieCode"),
                        resultSet.getString("Title"),
                        resultSet.getString("Genre"),
                        resultSet.getInt("ReleaseYear")
                );
                movies.add(movie);
            }
        }
    }

    return movies;
}`,
      check: {
        method: { name: "findMoviesReleasedAfter", returns: "ArrayList<Movie>", params: [["int", "year"]] },
        sql: {
          kind: "SELECT",
          table: "Movie",
          select: ["MovieID", "MovieCode", "Title", "Genre", "ReleaseYear"],
          where: [{ column: "ReleaseYear", op: ">", param: "year" }],
          orderBy: [{ column: "Title", dir: "ASC" }],
        },
        binds: { year: "setInt" },
        result: {
          kind: "list",
          rows: "many",
          model: "Movie",
          fields: [
            { column: "MovieID", getter: "getInt" },
            { column: "MovieCode", getter: "getString" },
            { column: "Title", getter: "getString" },
            { column: "Genre", getter: "getString" },
            { column: "ReleaseYear", getter: "getInt" },
          ],
        },
      },
    },
  },
  {
    id: "ovningstenta-3",
    title: "Övningstenta 3",
    subtitle: "Skidort",
    task1: {
      diagram: "ovn3-1",
      intro: "Givet är följande ER-diagram:",
      instruction: "Markera samtliga påståenden som är korrekta utifrån det givna ER-diagrammet.",
      rules: PRACTICE_RULES[1],
      statements: [
        st("En backe identifieras av kombinationen av dess namn samt numret på den lift som backen nås via", false, "Backe är svag under Lift, men Lift är själv svag under Skidort. Backens kompletta identitet är {skidortens Namn, liftens Nummer, backens Namn}; skidortens namn saknas i påståendet."),
        st("En backe identifieras av kombinationen av\n1. dess namn,\n2. numret på den lift som backen nås via,\n3. samt namnet på den skidort där liften finns", true, "Kedjan av svaga entiteter: Backe identifieras via Nås_via av Lift, och Lift via Ligger av Skidort. Alla tre delarna behövs."),
        st("Två liftar kan ha samma nummer", true, "Lift är svag och Nummer är streckat understruket: en partiell identifierare, unik bara inom skidorten. Två skidorter kan båda ha lift nummer 1."),
        st("En skidort måste ha minst en anställd skidlärare", true, "Linjen vid Skidort i Anställd är dubbel: varje skidort deltar minst en gång."),
        st("En skidlärare måste vara anställd vid en skidort", false, "Linjen vid Skidlärare i Anställd är enkel: en skidlärare får sakna anställning. Dubbellinjen sitter vid Skidort."),
        st("En skidlärare kan tala flera språk", true, "Språk är ett flervärt attribut (dubbel ellips): en skidlärare kan ha flera värden."),
        st("En gäst måste ha fått undervisning av minst en skidlärare", false, "Linjen vid Gäst i Undervisar är enkel: en gäst får sakna undervisning. Dubbellinjen sitter vid Skidlärare."),
        st("En skidlärare kan vara anställd vid flera skidorter", false, "Ratiot bredvid Skidort i Anställd är 1: en skidlärare är anställd vid högst en skidort."),
        st("En backe kan nås via flera liftar", false, "Ratiot bredvid Lift i Nås_via är 1: en backe nås via högst en lift (och via exakt en, eftersom linjen vid Backe är dubbel)."),
        st("Två gäster kan ha samma gästnummer", false, "Gästnr under Gäst är understruket: identifieraren, unik för varje gäst."),
      ],
    },
    task2: {
      diagram: "ovn3-2",
      text: TASK2_TEXT,
      composites: [],
      facit: [
        { name: "A", kind: "entity", surrogate: "AID", columns: [{ name: "A1", notNull: true }, { name: "A2" }], fks: [], unique: [["A1"]] },
        { name: "A3", aliases: ["AA3", "A_A3"], kind: "multivalued", columns: [{ name: "A3" }], fks: [{ name: "AID", to: "A" }], pk: ["AID", "A3"] },
        { name: "B", kind: "entity", surrogate: "BID", columns: [{ name: "B1", notNull: true }, { name: "B2" }], fks: [{ name: "AID", to: "A", notNull: true, rel: "R2", tag: "1:N" }], unique: [["B1"]] },
        { name: "R1", kind: "junction", columns: [{ name: "R1a" }], fks: [{ name: "AID", to: "A" }, { name: "BID", to: "B" }], pk: ["AID", "BID"] },
        { name: "C", kind: "weak", surrogate: "CID", columns: [{ name: "C1", notNull: true }, { name: "C2" }], fks: [{ name: "BID", to: "B", notNull: true, rel: "R3", tag: "svag entitet" }], unique: [["C1", "BID"]] },
        { name: "D", kind: "weak", surrogate: "DID", columns: [{ name: "D1", notNull: true }], fks: [{ name: "CID", to: "C", notNull: true, rel: "R4", tag: "svag entitet" }], unique: [["D1", "CID"]] },
      ],
      folded: {
        R2: { tag: "1:N", why: "R2 är 1:M och blir en främmande nyckel i B, M-sidan — inte en egen tabell." },
        R3: { tag: "svag entitet", why: "R3 är identifierande: B:s nyckel läggs i C och ingår i C:s UNIQUE." },
        R4: { tag: "svag entitet", why: "R4 är identifierande: C:s nyckel läggs i D och ingår i D:s UNIQUE." },
      },
      rules: {
        a: r("Vanlig entitet med flervärt attribut", "Surrogatnyckel som PRIMARY KEY och A1 som NOT NULL + UNIQUE. A3 är flervärt och blir en egen tabell."),
        a3: r("Flervärt attribut", "Egen tabell med ägarens främmande nyckel plus värdet som PRIMARY KEY (AID, A3), utan surrogatnyckel."),
        b: r("Vanlig entitet, 1:M", "Surrogatnyckel och B1 som NOT NULL + UNIQUE. R2 har dubbel linje vid B, så A:s nyckel blir NOT NULL i B."),
        r1: r("M:N med attribut", "Egen tabell utan surrogatnyckel: PRIMARY KEY (AID, BID) och R1a som vanlig kolumn."),
        c: r("Svag entitet", "Egen surrogatnyckel, B:s nyckel som NOT NULL främmande nyckel och UNIQUE (C1, BID)."),
        d: r("Kedjad svag entitet", "D:s ägare är C, som själv är svag: D refererar C:s surrogatnyckel och har UNIQUE (D1, CID)."),
      },
    },
    task3: {
      relation: "R(A, B, C, D, E)",
      attrs: "A, B, C, D, E",
      fds: ["{A, B} → {C, D, E}", "C → A"],
      schemas: [
        { name: "Schema 1", relations: [["R", "A, B, C, D, E"]] },
        { name: "Schema 2", relations: [["R1", "A, B, D, E"], ["R2", "C, A"]] },
        { name: "Schema 3", relations: [["R1", "B, C, D, E"], ["R2", "C, A"]] },
      ],
      statements: [
        { label: "3a", text: "Schema 3 är en nedbrytning (decomposition) av relation R som har egenskapen Lossless Join", claim: { type: "lossless", schema: 3 } },
        { label: "3b", text: "Schema 3 är en nedbrytning (decomposition) av relation R där samtliga funktionella beroenden från R är bevarade.", claim: { type: "preserving", schema: 3 } },
        { label: "3c", text: "Samtliga relationer i Schema 3 är i 3NF", claim: { type: "allNF", schema: 3, min: 3 } },
        { label: "3d", text: "Relation R i Schema 1 har fler än en kandidatnyckel", claim: { type: "manyCK", schema: 1, relation: "R" } },
        { label: "3e", text: "Schema 2 är en nedbrytning (decomposition) av relation R som har egenskapen Lossless Join", claim: { type: "lossless", schema: 2 } },
      ],
      fg: {
        id: "ovningstenta-3-3fg",
        label: "3f–3g",
        relation: "R(A, B, C, D, E)",
        attrs: "A, B, C, D, E",
        fds: ["{A, B} → {C, D, E}", "C → A"],
        nf: "3NF",
        facit: null,
        checklist: [],
      },
    },
    task4: {
      tables: TABLES_3,
      ask: "Studentnummer, namn och ålder för samtliga studenter som har läst kursen Java och är äldre än medelåldern bland samtliga studenter",
      tail: [TASK4_TAIL],
      solution: `SELECT
    s.StudentNo,
    s.Name,
    s.Age
FROM
    Student AS s
    INNER JOIN HasStudied AS h ON h.StudentNo = s.StudentNo
    INNER JOIN Course AS c ON c.Code = h.Code
WHERE
    c.Name = 'Java'
    AND s.Age > (
        SELECT AVG(Age)
        FROM Student
    );`,
      expected: { columns: ["StudentNo", "Name", "Age"], values: [["S2", "Ida", 34], ["S3", "Jon", 26]] },
      // Kontrolldata: med Ida 60 år blir medelåldern 29,8 och Jon (26) faller bort.
      control: { label: "Ida är 60 år", changes: [{ table: "Student", key: "S2", column: "Age", value: 60 }], expected: { columns: ["StudentNo", "Name", "Age"], values: [["S2", "Ida", 60]] } },
      explanation: "Medelåldern hämtas med en skalär delfråga, (21 + 34 + 26 + 19 + 30 + 23) / 6 = 25,5 (25 i SQL Server, heltal). Av dem som läst Java (S1, S2, S3, S4, S6) är S2 och S3 äldre. Frågan rättas också mot kontrolldata där Ida är 60 år, så att ett inskrivet 25 i stället för delfrågan inte får full poäng.",
    },
    task5: {
      id: "ovningstenta-3-java",
      title: "Hämta ett fordon med ett givet registreringsnummer",
      blocks: [
        { p: "Givet är en databas i Microsoft SQL Server som innehåller följande tabell:" },
        { code: VEHICLE_DDL, lang: "sql" },
        { p: "Givet är även följande klass `Vehicle`:" },
        { code: VEHICLE_CLASS, lang: "java" },
        { p: "Följande klass `VehicleDao` är också given:" },
        { code: daoClass("VehicleDao", QUERY_IMPORTS), lang: "java" },
        { p: "Implementera följande instansmetod i klassen `VehicleDao`:" },
        {
          lang: "java",
          code: `public Vehicle findVehicleByRegistrationNo(
        String registrationNo
) throws SQLException`,
        },
        { p: "Metoden ska hämta den rad i tabellen `Vehicle` vars värde i kolumnen `RegistrationNo` är lika med värdet av parametern `registrationNo`." },
        { p: "Om en sådan rad finns ska metoden returnera ett objekt av typen `Vehicle`. Samtliga instansvariabler i objektet ska tilldelas värden från motsvarande kolumner i raden. Instansvariabeln `id` motsvarar kolumnen `VehicleID`." },
        { p: "Om ingen rad uppfyller villkoret ska metoden returnera `null`." },
        ...examTail("VehicleDao", "Du får anta att parametern `registrationNo` inte är `null`.", "Vehicle"),
      ],
      solution: `public Vehicle findVehicleByRegistrationNo(
        String registrationNo
) throws SQLException {
    String sql = "SELECT VehicleID, RegistrationNo, Brand, Model, ModelYear "
            + "FROM Vehicle "
            + "WHERE RegistrationNo = ?;";

    try (Connection connection = connectionHandler.getConnection();
         PreparedStatement statement = connection.prepareStatement(sql)) {
        statement.setString(1, registrationNo);

        try (ResultSet resultSet = statement.executeQuery()) {
            if (resultSet.next()) {
                return new Vehicle(
                        resultSet.getInt("VehicleID"),
                        resultSet.getString("RegistrationNo"),
                        resultSet.getString("Brand"),
                        resultSet.getString("Model"),
                        resultSet.getInt("ModelYear")
                );
            }
        }
    }

    return null;
}`,
      check: {
        method: { name: "findVehicleByRegistrationNo", returns: "Vehicle", params: [["String", "registrationNo"]] },
        sql: {
          kind: "SELECT",
          table: "Vehicle",
          select: ["VehicleID", "RegistrationNo", "Brand", "Model", "ModelYear"],
          where: [{ column: "RegistrationNo", op: "=", param: "registrationNo" }],
        },
        binds: { registrationNo: "setString" },
        result: {
          kind: "single",
          rows: "one",
          model: "Vehicle",
          fields: [
            { column: "VehicleID", getter: "getInt" },
            { column: "RegistrationNo", getter: "getString" },
            { column: "Brand", getter: "getString" },
            { column: "Model", getter: "getString" },
            { column: "ModelYear", getter: "getInt" },
          ],
        },
      },
    },
  },
];
