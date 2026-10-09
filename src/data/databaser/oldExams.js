// Fliken Tenta: de tre HT25-tentorna i Databaser, med exakt deras uppgifter.
// Uppgiftstexterna är tentornas, ordagrant (Inspera-text som "Skriv ditt svar
// här" och sidhuvuden är borttagna); diagrammen är omritade som SVG i
// components/model/modelFigures.jsx. Tentorna har inget facit — allt facit
// här är sajtens eget. Kasper granskade facit för uppgift 1, 3a–g och 4
// mot tentorna 2026-10-09 (reviewed: true per uppgift); DDL-facit i uppgift
// 2 är ogranskat tills han gjort uppgiften själv.
//
// Uppgift 1: sant/falskt per påstående avgjort ur diagrammet med kapitel 6:s
// regler, med ett skäl per påstående. Uppgift 2: facit som strukturdata för
// lib/ddlCheck.js (samma format som ddlExercises.js). Uppgift 3a–e: varje
// påstående är en strukturerad utsaga (`claim`) som FD-motorn avgör — inget
// sant/falskt står här; testet låser vad motorn ska komma fram till. 3f–g:
// relationer i normaliseringsflikens form, rättade av lib/fdGrade.js.
// Uppgift 4: tentans tabeller med tentans data och en verifierad facitfråga.
//
// Osäkert facit (2026-10-09), se HANDOFF:
// - Ordinarie 1.1 "måste svara chef för minst en annan anställd": dubbel
//   linje vid chef_för ger minst ett deltagande, men diagrammet hindrar inte
//   att någon är chef för sig själv. Satt som sant (det påståendet prövar
//   dubbellinjen).
// - Ordinarie 1.6 "en bil har en unik kombination av namn och id": Namn och Id
//   är två separata identifierare; kombinationen är unik men inte minimal.
//   Satt som sant.
// - Ordinarie uppgift 4 "högre än snittbetyg på kurs C1": tolkat som betyget
//   på C1 högre än snittet på C1. Tolkningen "något betyg högre än snittet på
//   C1" ger samma resultat på tentans data.
// - Uppsamlingen uppgift 4 har tomt resultat på tentans data (ingen är äldre
//   än S4). Därför rättas den också mot kontrolldata där S4 är 26 år, så att
//   en fråga som alltid ger tomt resultat inte får full poäng.

const st = (text, truth, why) => ({ text, truth, why });
const r = (rule, why) => ({ rule, why });
const R = (name, attrs, pk, pkAlso) => ({ name, attrs, pk: [pk], ...(pkAlso ? { pkAlso } : {}) });

const TASK1_RULES = [
  "+5 poäng för varje korrekt påstående som du markerar",
  "–3 poäng för varje felaktigt påstående som du markerar",
  "Om du markerar alla och endast de korrekta påståendena får du totalt 25 poäng, oavsett hur många korrekta det finns (mellan 4 och 6 stycken)",
  "Obesvarad uppgift (inga påståenden markerade) ger 0 poäng",
];

const TASK2_TEXT = [
  "Transformera den konceptuella datamodellen (ER-diagrammet) nedan till en fysisk datamodell. Skriv Data Definition Language-kod i SQL för implementation av ER-diagrammet, inklusive alla restriktioner (constraints), i SQL. Du får anta att samtliga kolumner är av datatypen INTEGER.",
  "Använd inte förkortningar för reserverade ord: Reserverade ord, såsom PRIMARY KEY och CONSTRAINT, ska skrivas ut i sin helhet. Du behöver inte namnge dina constraints.",
  "Tabeller som motsvarar vanliga (regular) och svaga (weak) entiteter ska använda automatiskt inkrementerande surrogatnycklar (surrogate keys).",
];
const FORMAT_LINE = "All SQL-kod ska vara tydligt formaterad och indenterad för att underlätta läsbarhet.";

const TASK3_RULE = "Ta ställning till nedanstående påstående. Rätt svar ger 2 poäng. Fel svar ger -1 poäng. Obesvarad uppgift ger 0 poäng.";
const TASK3_INTRO = "Ovanstående relation har brutits ned i följande scheman med relationer (primärnycklar har ej markerats):";
const TASK3FG_TEXT = [
  "Specificera högsta normalform (1NF - 3NF) för relationen. Motivera ditt svar genom att hänvisa till definitioner och specifika attribut. Använd endast definitioner och begrepp från kurslitteraturen, från föreläsningsmaterialet, eller från tentamens medföljande bilaga. Motivering krävs ej för relationer i 3NF.",
  "Om relationen inte är i 3NF ska du normalisera den till 3NF. Din nedbrytning ska sträva efter att bibehålla Lossless Join och Dependency Preservation. Övernormalisering ger poängavdrag.",
  "Markera primärnyckel för varje relation i din nedbrytning genom att stryka under dem. Eventuella främmande nycklar (foreign keys) behöver inte markeras.",
];

// Tentans tre tabeller, samma data i alla tre tentorna.
const TABLES = [
  {
    name: "Student",
    columns: [["StudentNo", "VARCHAR(10)"], ["Name", "VARCHAR(50)"], ["Age", "INT"], ["Address", "VARCHAR(50)"]],
    rows: [["S1", "Phoebe", 27, "Main street"], ["S2", "Olivia", 32, "Main street"], ["S3", "Max", 18, "Codd street"], ["S4", "Gary", 33, "Chen street"]],
  },
  {
    name: "Course",
    columns: [["Code", "VARCHAR(10)"], ["Name", "VARCHAR(50)"], ["Credits", "INT"]],
    rows: [["C1", "Databases", 5], ["C2", "Java", 10], ["C3", "Artificial Intelligence", 15]],
  },
  {
    name: "HasStudied",
    columns: [["StudentNo", "VARCHAR(10)"], ["Code", "VARCHAR(10)"], ["Grade", "INT"]],
    rows: [["S1", "C1", 7], ["S1", "C2", 8], ["S2", "C3", 6], ["S2", "C1", 9], ["S3", "C2", 5]],
  },
];

const TASK4_TAIL = "Ovanstående ska returneras av en och samma fråga (query) i ett och samma result set.";

export const oldExams = [
  {
    id: "tenta-250916",
    date: "2025-09-16",
    title: "Ordinarie tentamen",
    dateLabel: "16 september 2025",
    task1: {
      reviewed: true,
      diagram: "tenta-250916-1",
      intro: "Givet är följande ER-diagram:",
      instruction: "Markera samtliga påståenden som är korrekta utifrån det givna ER-diagrammet.",
      rules: TASK1_RULES,
      statements: [
        st("En anställd måste svara chef för minst en annan anställd", true, "Linjen vid rollen chef_för i den unära relationen Chef är dubbel: varje anställd deltar minst en gång som chef. (Diagrammet hindrar inte att någon är chef för sig själv — påståendet prövar dubbellinjen.)"),
        st("En leverans identifieras av dess namn", true, "Namn under Leverans är heldraget understruket, och Leverans är en vanlig entitet (enkel rektangel, Utför är en vanlig romb). Namn är identifieraren."),
        st("En bil måste tillhöra minst en avdelning", false, "Linjen vid Bil i Tillhör är enkel: en bil får finnas utan avdelning. Dubbellinjen sitter vid Avdelning."),
        st("Två bilar kan ha samma namn", false, "Namn under Bil är understruket: en identifierare, unik för varje bil."),
        st("Två anställda kan ha samma namn", true, "Anställd är svag och Namn är streckat understruket: en partiell identifierare, unik bara inom avdelningen. Två anställda på olika avdelningar kan heta lika."),
        st("En bil har en unik kombination av namn och id", true, "Namn och Id är understrukna var för sig — två identifierare. Är Namn unikt är också kombinationen av namn och id unik (men den är ingen identifierare, eftersom den inte är minimal)."),
        st("En anställd måste arbeta vid exakt en avdelning", true, "Linjen vid Anställd i Arbeta är dubbel (minst en) och ratiot bredvid Avdelning är 1 (högst en): exakt en."),
        st("En anställd måste ha minst en chef", false, "Linjen vid rollen har_som_chef är enkel: en anställd får sakna chef. Dubbellinjen sitter vid chef_för."),
        st("En leverans identifieras endast av kombinationen av\n1. dess namn,\n2. samt namn eller email för den anställda som utfört leveransen", false, "Leverans är en stark entitet (enkel rektangel, Utför är ingen identifierande relation). Den identifieras av sitt namn ensamt; den anställdas attribut ingår inte."),
        st("En leverans identifieras av dess id", false, "Id under Leverans är inte understruket. Identifieraren är Namn."),
        st("Två avdelningar kan ha samma namn", true, "Avdelnings identifierare är det sammansatta Id med delarna Namn och Adress. Namn ensamt är inte unikt — två avdelningar med samma namn och olika adress är tillåtna."),
        st("En leverans identifieras endast av kombinationen av\n1. dess namn,\n2. samt namn eller email för den anställda som utfört leveransen\n3. samt namn och address för avdelningen som den anställda som utfört leveransen arbetar vid", false, "Leverans är stark och identifieras av Namn ensamt. Kedjan av svaga entiteter går från Anställd till Avdelning, inte från Leverans."),
      ],
    },
    task2: {
      reviewed: false,
      diagram: "tenta-250916-2",
      text: TASK2_TEXT,
      composites: ["D1"],
      facit: [
        { name: "A", kind: "entity", surrogate: "AID", columns: [{ name: "A1", notNull: true }, { name: "A2" }], fks: [], unique: [["A1"]] },
        { name: "B", kind: "weak", surrogate: "BID", columns: [{ name: "B1", notNull: true }, { name: "B2" }], fks: [{ name: "AID", to: "A", notNull: true, rel: "R1", tag: "svag entitet" }, { name: "BIDR2", to: "B", notNull: false, rel: "R2", tag: "unär" }], unique: [["B1", "AID"]] },
        { name: "C", kind: "weak", surrogate: "CID", columns: [{ name: "C1", notNull: true }, { name: "R4a" }], fks: [{ name: "BID", to: "B", notNull: true, rel: "R3", tag: "svag entitet" }, { name: "DID", to: "D", notNull: true, rel: "R4", tag: "1:N" }], unique: [["C1", "BID"]] },
        { name: "C2", aliases: ["CC2", "C_C2"], kind: "multivalued", columns: [{ name: "C2" }], fks: [{ name: "CID", to: "C" }], pk: ["CID", "C2"] },
        { name: "D", kind: "entity", surrogate: "DID", columns: [{ name: "D2", notNull: true }, { name: "D3", notNull: true }, { name: "D4" }], fks: [], unique: [["D2", "D3"]] },
        { name: "R5", kind: "junction", columns: [{ name: "R5a" }], fks: [{ name: "AID", to: "A" }, { name: "DID", to: "D" }], pk: ["AID", "DID"] },
      ],
      folded: {
        R1: { tag: "svag entitet", why: "R1 är identifierande: A:s nyckel läggs i B och ingår i B:s UNIQUE." },
        R2: { tag: "unär", why: "R2 är unär 1:M och blir en nullbar främmande nyckel i B mot B självt — inte en egen tabell." },
        R3: { tag: "svag entitet", why: "R3 är identifierande: B:s nyckel läggs i C och ingår i C:s UNIQUE." },
        R4: { tag: "1:N", why: "R4 är 1:M och blir en främmande nyckel i C, M-sidan, med relationsattributet R4a — inte en egen tabell." },
      },
      rules: {
        a: r("Vanlig entitet", "Surrogatnyckel som PRIMARY KEY och A1 som NOT NULL + UNIQUE."),
        b: r("Svag entitet med unär 1:M", "Egen surrogatnyckel, A:s nyckel som NOT NULL främmande nyckel och UNIQUE (B1, AID): B1 är unik bara inom A. R2 ger en främmande nyckel mot B självt; linjerna är enkla, så den får vara NULL."),
        c: r("Kedjad svag entitet, 1:M med attribut", "C:s ägare är B, som själv är svag: C refererar B:s surrogatnyckel och har UNIQUE (C1, BID). R4 är 1:M med dubbel linje vid C, så D:s nyckel blir NOT NULL i C, och relationsattributet R4a följer med till C."),
        c2: r("Flervärt attribut", "Egen tabell med ägarens främmande nyckel plus värdet som PRIMARY KEY (CID, C2), utan surrogatnyckel."),
        d: r("Sammansatt identifierare", "D1 blir sina delar D2 och D3, båda NOT NULL, med en gemensam UNIQUE (D2, D3)."),
        r5: r("M:N med attribut", "Egen tabell utan surrogatnyckel: PRIMARY KEY (AID, DID) och R5a som vanlig kolumn."),
      },
    },
    task3: {
      reviewed: true,
      relation: "R(A, B, C, D, E, F, G)",
      attrs: "A, B, C, D, E, F, G",
      fds: ["{A, B} → C", "A → D", "B → {E, F}", "F → G"],
      schemas: [
        { name: "Schema 1", relations: [["R", "A, B, C, D, E, F, G"]] },
        { name: "Schema 2", relations: [["R1", "A, B, C, D, E, F"], ["R2", "F, G"]] },
        { name: "Schema 3", relations: [["R1", "A, C"], ["R2", "B, C"], ["R3", "A, D"], ["R4", "B, E, F"], ["R5", "F, G"]] },
      ],
      statements: [
        { label: "3a", text: "Schema 3 är en nedbrytning (decomposition) av relation R som har egenskapen Lossless Join", claim: { type: "lossless", schema: 3 } },
        { label: "3b", text: "Schema 2 är en nedbrytning (decomposition) av relation R där samtliga funktionella beroenden från R är bevarade.", claim: { type: "preserving", schema: 2 } },
        { label: "3c", text: "Samtliga relationer i Schema 3 är i 3NF", claim: { type: "allNF", schema: 3, min: 3 } },
        { label: "3d", text: "Samtliga relationer i Schema 2 är i 2NF eller högre", claim: { type: "allNF", schema: 2, min: 2 } },
        { label: "3e", text: "Attribut A är en kandidatnyckel i relation R1 i Schema 3", claim: { type: "isCK", schema: 3, relation: "R1", attrs: ["A"] } },
      ],
      f: { id: "tenta-250916-3f", label: "3f", relation: "R(A, B, C, D, E, F, G)", attrs: "A, B, C, D, E, F, G", fds: ["{A, B} → C", "A → D", "B → E", "C → F"], nf: "1NF",
        facit: [R("R1", "A, B, C", "A, B"), R("R2", "A, D", "A"), R("R3", "B, E", "B"), R("R4", "C, F", "C"), R("R5", "A, B, G", "A, B, G")] },
      g: { id: "tenta-250916-3g", label: "3g", relation: "R(A, B, C, D, E, F)", attrs: "A, B, C, D, E, F", fds: ["A → B", "B → {A, C}", "C → {B, D}", "D → {C, E, F}"], nf: "3NF", facit: null },
    },
    task4: {
      reviewed: true,
      tables: TABLES,
      ask: "Studentnummer, namn och antal lästa kurser för samtliga studenter som fått högre än snittbetyg på kurs C1",
      tail: [TASK4_TAIL + " Indentera din kod för läsbarhet."],
      solution: `SELECT
    s.StudentNo,
    s.Name,
    COUNT(*) AS AntalKurser
FROM
    Student AS s
    INNER JOIN HasStudied AS h ON h.StudentNo = s.StudentNo
WHERE
    s.StudentNo IN (
        SELECT StudentNo
        FROM HasStudied
        WHERE Code = 'C1'
          AND Grade > (
              SELECT AVG(Grade)
              FROM HasStudied
              WHERE Code = 'C1'
          )
    )
GROUP BY
    s.StudentNo,
    s.Name;`,
      expected: { columns: ["StudentNo", "Name", "AntalKurser"], values: [["S2", "Olivia", 2]] },
      explanation: "Snittet på C1 är (7 + 9) / 2 = 8. Bara S2 har högre (9). Antalet kurser räknas över alla S2:s rader, inte bara C1 — därför står C1-villkoret i en underfråga och inte i den yttre WHERE.",
      checklist: [
        "Join mellan Student och HasStudied på StudentNo",
        "Snittbetyget på C1 hämtat med en skalär underfråga (AVG), inte inskrivet som 8",
        "Villkoret på C1-betyget filtrerar studenter, inte de rader som räknas",
        "GROUP BY på StudentNo och Name, COUNT per student",
        "En enda fråga med ett resultat",
      ],
    },
  },

  {
    id: "tenta-251024",
    date: "2025-10-24",
    title: "Omtentamen",
    dateLabel: "24 oktober 2025",
    task1: {
      reviewed: true,
      diagram: "tenta-251024-1",
      intro: "Givet är följande ER-diagram:",
      instruction: "Markera samtliga påståenden som är korrekta utifrån det givna ER-diagrammet.",
      rules: TASK1_RULES,
      statements: [
        st("En student måste ha examinerats (fått ett betyg)", false, "Linjen vid Student i Examination är enkel: en student får finnas utan examination."),
        st("En avdelning och ett universitet kan ha olika adresser", true, "Avdelning och Universitet har var sitt attribut Adress, och inget i diagrammet binder dem till samma värde."),
        st("En kurs kan vara delkurs för flera andra kurser", false, "Delkurs är unär med 1 vid båda rollerna: en kurs är delkurs för högst en kurs."),
        st("Två universitet kan ha samma namn", true, "Namn under Universitet är inte understruket; identifieraren är Adress."),
        st("Två universitet kan ha samma adress", false, "Adress under Universitet är understruket: identifieraren, unik för varje universitet."),
        st("En student måste vara inskriven på ett universitet", false, "Linjen vid Student i Inskriven är enkel. Dubbellinjen sitter vid Universitet: varje universitet har minst en inskriven student."),
        st("En kurs måste ha minst en delkurs och kan ha flera", false, "Första halvan stämmer — linjen vid rollen har_som_delkurs är dubbel — men ratiot 1 vid delkurs_för säger högst en delkurs. \"Kan ha flera\" är fel."),
        st("En kurs måste ha minst en examinerad student", false, "Linjen vid Kurs i Examination är enkel: en kurs får sakna examinerade studenter."),
        st("En kurs identifieras av kombinationen av dess namn samt namnet på den avdelning som erbjuder kursen", false, "Kurs är svag under Avdelning, som själv är svag under Universitet. Kursens kompletta identitet är {universitetets Adress, avdelningens Namn, kursens Namn}; universitetets adress saknas i påståendet."),
        st("En student kan examineras på en kurs som erbjuds av en avdelning vid ett universitet där studenten inte är inskriven", true, "Flerstegspåstående: Examination, Erbjuder, Tillhör och Inskriven är obundna av varandra. Ingen symbol säger att kursens universitet ska vara studentens."),
        st("En kurs måste ha exakt en delkurs", true, "Linjen vid rollen har_som_delkurs är dubbel (minst en delkurs) och ratiot vid delkurs_för är 1 (högst en): exakt en."),
      ],
    },
    task2: {
      reviewed: false,
      diagram: "tenta-251024-2",
      text: TASK2_TEXT,
      composites: ["C2"],
      facit: [
        { name: "A", kind: "entity", surrogate: "AID", columns: [{ name: "A1", notNull: true }], fks: [], unique: [["A1"]] },
        { name: "A2", aliases: ["AA2", "A_A2"], kind: "multivalued", columns: [{ name: "A2" }], fks: [{ name: "AID", to: "A" }], pk: ["AID", "A2"] },
        { name: "B", kind: "weak", surrogate: "BID", columns: [{ name: "B1", notNull: true }, { name: "B2" }], fks: [{ name: "AID", to: "A", notNull: true, rel: "R1", tag: "svag entitet" }, { name: "CID", to: "C", notNull: true, rel: "R3", tag: "1:N" }], unique: [["B1", "AID"]] },
        { name: "R2", kind: "junction", columns: [], fks: [{ name: "BID", to: "B" }, { name: "R2BID", to: "B" }], pk: ["BID", "R2BID"] },
        { name: "C", kind: "weak", surrogate: "CID", columns: [{ name: "C1", notNull: true }, { name: "C3" }, { name: "C4" }], fks: [{ name: "DID", to: "D", notNull: true, rel: "R4", tag: "svag entitet" }], unique: [["C1", "DID"]] },
        { name: "D", kind: "entity", surrogate: "DID", columns: [{ name: "D1", notNull: true }, { name: "D2", notNull: true }, { name: "R5a" }], fks: [{ name: "AID", to: "A", notNull: false, rel: "R5", tag: "1:N" }], unique: [["D1"], ["D2"]] },
      ],
      folded: {
        R1: { tag: "svag entitet", why: "R1 är identifierande: A:s nyckel läggs i B och ingår i B:s UNIQUE." },
        R3: { tag: "1:N", why: "R3 är 1:M och blir en främmande nyckel i B, M-sidan — inte en egen tabell." },
        R4: { tag: "svag entitet", why: "R4 är identifierande: D:s nyckel läggs i C och ingår i C:s UNIQUE." },
        R5: { tag: "1:N", why: "R5 är 1:N och blir en nullbar främmande nyckel i D med relationsattributet R5a — inte en egen tabell." },
      },
      rules: {
        a: r("Vanlig entitet med flervärt attribut", "Surrogatnyckel som PRIMARY KEY och A1 som NOT NULL + UNIQUE. A2 är flervärt och blir en egen tabell."),
        a2: r("Flervärt attribut", "Egen tabell med PRIMARY KEY (AID, A2), utan surrogatnyckel."),
        b: r("Svag entitet, 1:M", "Egen surrogatnyckel, A:s nyckel som NOT NULL främmande nyckel och UNIQUE (B1, AID). R3 är 1:M med dubbel linje vid B: C:s nyckel som NOT NULL främmande nyckel."),
        r2: r("Unär M:N", "Sambandstabell med två kolumner som båda refererar B och tillsammans är PRIMARY KEY."),
        c: r("Svag entitet, sammansatt attribut", "Egen surrogatnyckel, D:s nyckel som NOT NULL främmande nyckel och UNIQUE (C1, DID). C2 är sammansatt och blir sina delar C3 och C4 — utan NOT NULL, eftersom C2 inte är identifierare."),
        d: r("Två identifierare, 1:N med attribut", "D1 och D2 är var sin identifierare: båda NOT NULL med var sin UNIQUE. R5 ger A:s nyckel som nullbar främmande nyckel i D (enkla linjer) och relationsattributet R5a som kolumn i D."),
      },
    },
    task3: {
      reviewed: true,
      relation: "R(A, B, C, D, E, F, G, H)",
      attrs: "A, B, C, D, E, F, G, H",
      fds: ["{A, B} → {C, D}", "D → {E, F}", "E → G", "F → H"],
      schemas: [
        { name: "Schema 1", relations: [["R", "A, B, C, D, E, F, G, H"]] },
        { name: "Schema 2", relations: [["R1", "A, B, C, D"], ["R2", "D, E, F, G, H"]] },
        { name: "Schema 3", relations: [["R1", "A, B, C"], ["R2", "A, B, D"], ["R3", "D, E, F"], ["R4", "E, G"], ["R5", "F, H"]] },
      ],
      statements: [
        { label: "3a", text: "Relation R i Schema 1 är i 2NF eller högre", claim: { type: "allNF", schema: 1, min: 2 } },
        { label: "3b", text: "Schema 3 är en nedbrytning (decomposition) av relation R där samtliga funktionella beroenden från R är bevarade.", claim: { type: "preserving", schema: 3 } },
        { label: "3c", text: "Schema 3 är en nedbrytning (decomposition) av relation R som har egenskapen Lossless Join", claim: { type: "lossless", schema: 3 } },
        { label: "3d", text: "Relation R1 i Schema 2 har fler än en (1) kandidatnyckel", claim: { type: "manyCK", schema: 2, relation: "R1" } },
        { label: "3e", text: "Samtliga relationer i Schema 2 är i 3NF", claim: { type: "allNF", schema: 2, min: 3 } },
      ],
      f: { id: "tenta-251024-3f", label: "3f", relation: "R(A, B, C, D, E, F, G)", attrs: "A, B, C, D, E, F, G", fds: ["{A, B} → C", "A → {D, E}", "B → {E, F}"], nf: "1NF",
        facit: [R("R1", "A, B, C", "A, B"), R("R2", "A, D, E", "A"), R("R3", "B, E, F", "B"), R("R4", "A, B, G", "A, B, G")] },
      g: { id: "tenta-251024-3g", label: "3g", relation: "R(A, B, C, D, E, F)", attrs: "A, B, C, D, E, F", fds: ["A → B", "B → {A, C}", "C → {D, E}", "E → {C, F}"], nf: "2NF",
        facit: [{ name: "R1", attrs: "A, B, C", pk: ["A", "B"] }, { name: "R2", attrs: "C, D, E, F", pk: ["C", "E"] }] },
    },
    task4: {
      reviewed: true,
      tables: TABLES,
      ask: "Kurskod, namn, och snittresultat för kurser som läses av student S1, men inte av student S2",
      tail: [TASK4_TAIL + " Indentera din kod för läsbarhet."],
      solution: `SELECT
    c.Code,
    c.Name,
    AVG(h.Grade) AS Snittresultat
FROM
    Course AS c
    INNER JOIN HasStudied AS h ON h.Code = c.Code
WHERE
    c.Code IN (
        SELECT Code
        FROM HasStudied
        WHERE StudentNo = 'S1'
    )
    AND c.Code NOT IN (
        SELECT Code
        FROM HasStudied
        WHERE StudentNo = 'S2'
    )
GROUP BY
    c.Code,
    c.Name;`,
      // SQL Server: AVG över INT trunkerar, (8 + 5) / 2 = 6. SQLite ger 6,5.
      expected: { columns: ["Code", "Name", "Snittresultat"], values: [["C2", "Java", 6]] },
      avgNote: "Snittet på C2 är (8 + 5) / 2. SQL Server räknar AVG över INTEGER som heltal och ger 6; övningsmotorn här är SQLite och ger 6,5. Båda godtas. Vill du ha decimaler även i SQL Server skriver du AVG(CAST(h.Grade AS DECIMAL(4, 2))).",
      explanation: "S1 läser C1 och C2, S2 läser C1 och C3: kvar blir C2. Snittet räknas över alla som läser C2 (S1 med 8, S3 med 5), inte bara S1 — därför står S1-villkoret i en underfråga och inte i den yttre WHERE.",
      checklist: [
        "Join mellan Course och HasStudied på Code",
        "\"Läses av S1\" som IN, EXISTS eller join mot S1:s rader — utan att begränsa snittet till S1",
        "\"Men inte av S2\" som NOT IN, NOT EXISTS eller EXCEPT",
        "AVG över alla som läser kursen, GROUP BY på Code och Name",
        "En enda fråga med ett resultat",
      ],
    },
  },

  {
    id: "tenta-260525",
    date: "2026-05-25",
    title: "Uppsamlingstentamen",
    dateLabel: "25 maj 2026",
    task1: {
      reviewed: true,
      diagram: "tenta-260525-1",
      intro: "Givet är följande ER-diagram:",
      instruction: "Markera samtliga påståenden som är korrekta utifrån det givna ER-diagrammet.",
      rules: TASK1_RULES,
      statements: [
        st("Två kunder kan ha samma email", true, "Kund är svag och Email är streckat understruket: en partiell identifierare, unik bara inom adressen. Två kunder på olika adresser kan ha samma email."),
        st("En order måste tillhöra en kund", true, "Linjen vid Order i Skapa är dubbel: varje order deltar. Skapa är dessutom identifierande — en order kan inte finnas utan sin kund."),
        st("En produkt måste tillhöra en order", false, "Linjen vid Produkt i Tillhör är enkel: en produkt får finnas utan order. Dubbellinjen sitter vid Order."),
        st("Kombinationen av gata och stad är unik för adress", true, "Adress identifieras av det sammansatta Id med delarna Gata och Stad: kombinationen är unik."),
        st("En order måste innehålla exakt en (1) produkt", true, "Linjen vid Order i Tillhör är dubbel (minst en) och ratiot bredvid Produkt är 1 (högst en): exakt en."),
        st("En kund måste skapa minst en order", false, "Linjen vid Kund i Skapa är enkel: en kund får finnas utan order."),
        st("Två kunder kan bo på samma adress", true, "Ratiot bredvid Kund i Bor är M, läst tvärs över: en adress får ha många kunder."),
        st("En produkt kan levereras till fler än en adress", false, "Ratiot bredvid Adress i Leverans är 1: varje produkt levereras till högst en adress."),
        st("Två produkter kan ha samma namn", false, "Namn under Produkt är understruket: identifieraren, unik för varje produkt."),
        st("En produkt som ingår i en order som skapats av en kund kan levereras till en adress där kunden inte bor", true, "Flerstegspåstående: Leverans binder produkten till en adress och Bor binder kunden till en adress, men ingen symbol säger att det ska vara samma adress."),
      ],
    },
    task2: {
      reviewed: false,
      diagram: "tenta-260525-2",
      text: [...TASK2_TEXT, FORMAT_LINE],
      composites: [],
      facit: [
        { name: "A", kind: "entity", surrogate: "AID", columns: [{ name: "A1", notNull: true }, { name: "A2", notNull: true }], fks: [], unique: [["A1"], ["A2"]] },
        { name: "B", kind: "weak", surrogate: "BID", columns: [{ name: "B1", notNull: true }, { name: "B2" }], fks: [{ name: "AID", to: "A", notNull: true, rel: "R1", tag: "svag entitet" }], unique: [["B1", "AID"]] },
        { name: "C", kind: "entity", surrogate: "CID", columns: [{ name: "C1", notNull: true }, { name: "R2a" }], fks: [{ name: "BID", to: "B", notNull: false, rel: "R2", tag: "1:N" }, { name: "DIDR5", to: "D", notNull: true, rel: "R5", tag: "1:N" }], unique: [["C1"]], oneToOneUnique: [{ cols: ["DIDR5"], rel: "R5" }] },
        { name: "R3", kind: "junction", columns: [{ name: "R3a" }], fks: [{ name: "CID", to: "C" }, { name: "R3CID", to: "C" }], pk: ["CID", "R3CID"] },
        { name: "D", kind: "entity", surrogate: "DID", columns: [{ name: "D1", notNull: true }], fks: [{ name: "CIDR4", to: "C", notNull: false, rel: "R4", tag: "1:N" }], unique: [["D1"]] },
        { name: "D2", aliases: ["DD2", "D_D2"], kind: "multivalued", columns: [{ name: "D2" }], fks: [{ name: "DID", to: "D" }], pk: ["DID", "D2"] },
      ],
      folded: {
        R1: { tag: "svag entitet", why: "R1 är identifierande: A:s nyckel läggs i B och ingår i B:s UNIQUE." },
        R2: { tag: "1:N", why: "R2 är 1:M och blir en nullbar främmande nyckel i C med relationsattributet R2a — inte en egen tabell." },
        R4: { tag: "1:N", why: "R4 är 1:M och blir en nullbar främmande nyckel i D, M-sidan — inte en egen tabell." },
        R5: { tag: "1:N", why: "R5 är 1:1 och blir en främmande nyckel i C, sidan med totalt deltagande — inte en egen tabell." },
      },
      rules: {
        a: r("Två identifierare", "A1 och A2 är var sin identifierare: båda NOT NULL med var sin UNIQUE."),
        b: r("Svag entitet", "Egen surrogatnyckel, A:s nyckel som NOT NULL främmande nyckel och UNIQUE (B1, AID): B1 är unik bara inom A."),
        c: r("1:M med attribut och 1:1", "R2 är 1:M med enkla linjer: B:s nyckel som nullbar främmande nyckel i C, och R2a som kolumn i C. R5 är 1:1 med dubbel linje vid C: D:s nyckel i C som NOT NULL och UNIQUE — den främmande nyckeln är också kandidatnyckel, annars bevaras inte 1:1. Ett svar utan UNIQUE ger inget avdrag (häftets uppgift 21 saknar den) men en anmärkning. C och D refererar varandra; i SQL Server läggs den ena FOREIGN KEY till med ALTER TABLE efteråt, vilket inte rättas här."),
        r3: r("Unär M:N med attribut", "Sambandstabell med två kolumner som båda refererar C och tillsammans är PRIMARY KEY, och R3a som vanlig kolumn."),
        d: r("Vanlig entitet, 1:M", "D1 som NOT NULL + UNIQUE. R4 är 1:M med enkla linjer: C:s nyckel som nullbar främmande nyckel i D. D2 är flervärt och blir en egen tabell."),
        d2: r("Flervärt attribut", "Egen tabell med PRIMARY KEY (DID, D2), utan surrogatnyckel."),
      },
    },
    task3: {
      reviewed: true,
      relation: "R(A, B, C, D, E, F, G)",
      attrs: "A, B, C, D, E, F, G",
      fds: ["{A, B} → C", "C → {D, E}", "E → F", "F → G"],
      schemas: [
        { name: "Schema 1", relations: [["R", "A, B, C, D, E, F, G"]] },
        { name: "Schema 2", relations: [["R1", "A, B, C, D, E"], ["R2", "E, F, G"]] },
        { name: "Schema 3", relations: [["R1", "A, B, C"], ["R2", "C, D, E"], ["R3", "E, F, G"]] },
      ],
      statements: [
        { label: "3a", text: "Relation R i Schema 1 är i 2NF", claim: { type: "allNF", schema: 1, min: 2 } },
        { label: "3b", text: "Samtliga relationer i Schema 2 är i 3NF", claim: { type: "allNF", schema: 2, min: 3 } },
        { label: "3c", text: "Schema 3 är en nedbrytning (decomposition) av relation R som har egenskapen Lossless Join", claim: { type: "lossless", schema: 3 } },
        { label: "3d", text: "Schema 2 är en nedbrytning (decomposition) av relation R där samtliga funktionella beroenden från R är bevarade.", claim: { type: "preserving", schema: 2 } },
        { label: "3e", text: "Attribut C är ett primärattribut i relation R1 i Schema 3", claim: { type: "prime", schema: 3, relation: "R1", attr: "C" } },
      ],
      f: { id: "tenta-260525-3f", label: "3f", relation: "R(A, B, C, D, E, F, G)", attrs: "A, B, C, D, E, F, G", fds: ["{A, B} → C", "A → {D, E}", "B → F"], nf: "1NF",
        facit: [R("R1", "A, B, C", "A, B"), R("R2", "A, D, E", "A"), R("R3", "B, F", "B"), R("R4", "A, B, G", "A, B, G")] },
      g: { id: "tenta-260525-3g", label: "3g", relation: "R(A, B, C, D, E, F)", attrs: "A, B, C, D, E, F", fds: ["{A, B} → C", "C → D", "D → E", "E → F"], nf: "2NF",
        facit: [R("R1", "A, B, C", "A, B"), R("R2", "C, D", "C"), R("R3", "D, E", "D"), R("R4", "E, F", "E")] },
    },
    task4: {
      reviewed: true,
      tables: TABLES,
      ask: "Studentnummer, namn, och högsta betyg för studenter som är äldre än student S4 och har läst 2 eller fler kurser",
      tail: [TASK4_TAIL, FORMAT_LINE],
      solution: `SELECT
    s.StudentNo,
    s.Name,
    MAX(h.Grade) AS HogstaBetyg
FROM
    Student AS s
    INNER JOIN HasStudied AS h ON h.StudentNo = s.StudentNo
WHERE
    s.Age > (
        SELECT Age
        FROM Student
        WHERE StudentNo = 'S4'
    )
GROUP BY
    s.StudentNo,
    s.Name
HAVING
    COUNT(*) >= 2;`,
      expected: { columns: ["StudentNo", "Name", "HogstaBetyg"], values: [] },
      // Tentans data ger tomt resultat. Kontrolldatan ändrar bara S4:s ålder.
      control: { label: "S4 är 26 år", changes: [{ table: "Student", key: "S4", column: "Age", value: 26 }], expected: { columns: ["StudentNo", "Name", "HogstaBetyg"], values: [["S1", "Phoebe", 8], ["S2", "Olivia", 9]] } },
      explanation: "S4 är 33 år och äldst av alla, så på tentans data blir resultatet tomt — det är rätt svar. Frågan rättas därför också mot kontrolldata där S4 är 26 år: då är S1 (27) och S2 (32) äldre, båda har läst två kurser, och högsta betyget är 8 respektive 9.",
      checklist: [
        "Join mellan Student och HasStudied på StudentNo",
        "S4:s ålder hämtad med en skalär underfråga, inte inskriven som 33",
        "Åldersvillkoret i WHERE, antalet kurser i HAVING COUNT(*) >= 2",
        "MAX(Grade) och GROUP BY på StudentNo och Name",
        "En enda fråga med ett resultat",
      ],
    },
  },
];

export const TASK_POINTS = { 1: 25, 2: 25, 3: 20, 4: 30 };

// Betygsskalan från tentornas instruktionssida, i procent av 100 poäng.
export const GRADE_LIMITS = [["A", 85], ["B", 75], ["C", 65], ["D", 55], ["E", 50]];
export const gradeFor = (points) => GRADE_LIMITS.find(([, min]) => points >= min)?.[0] ?? "U";
export { TASK3_RULE, TASK3_INTRO, TASK3FG_TEXT };
