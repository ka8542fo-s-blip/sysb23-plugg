// "ER-diagram till DDL": rättaren jämför struktur, aldrig text. Ett fel
// här markerar tyst rätt svar som fel — eller släpper igenom det tentan
// drar poäng för. Varje feltyp har minst ett test.
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseDdl, checkDdl, toDdl } from "../src/lib/ddlCheck.js";
import { ddlExercises } from "../src/data/databaser/ddlExercises.js";

const ex = (id) => ddlExercises.find((e) => e.id === id);
const E18 = ex("ddl-18");
const E19 = ex("ddl-19");
const table = (r, name) => r.tables.find((t) => t.name.toLowerCase() === name.toLowerCase());
const tags = (r, name) => table(r, name).problems.map((p) => p.tag);

const A = `CREATE TABLE A (
    AID INTEGER IDENTITY(1,1),
    A1 INTEGER NOT NULL,
    A2 INTEGER,
    A3 INTEGER,
    BID INTEGER NOT NULL,
    PRIMARY KEY (AID),
    UNIQUE (A1),
    FOREIGN KEY (BID) REFERENCES B(BID)
);`;
const B = `CREATE TABLE B (
    BID INTEGER IDENTITY(1,1),
    B1 INTEGER NOT NULL,
    B2 INTEGER NOT NULL,
    B3 INTEGER,
    PRIMARY KEY (BID),
    UNIQUE (B1, B2)
);`;
const C = `CREATE TABLE C (
    CID INTEGER IDENTITY(1,1),
    C1 INTEGER NOT NULL,
    C2 INTEGER,
    DID INTEGER NOT NULL,
    PRIMARY KEY (CID),
    UNIQUE (C1),
    FOREIGN KEY (DID) REFERENCES D(DID)
);`;
const D = `CREATE TABLE D (
    DID INTEGER IDENTITY(1,1),
    D1 INTEGER NOT NULL,
    D2 INTEGER,
    PRIMARY KEY (DID),
    UNIQUE (D1)
);`;
const R2 = `CREATE TABLE R2 (
    BID INTEGER,
    CID INTEGER,
    R2attr INTEGER,
    PRIMARY KEY (BID, CID),
    FOREIGN KEY (BID) REFERENCES B(BID),
    FOREIGN KEY (CID) REFERENCES C(CID)
);`;
const ok18 = (parts = {}) => [parts.B ?? B, parts.D ?? D, parts.A ?? A, parts.C ?? C, parts.R2 ?? R2].join("\n\n");

test("varje facit passerar sin egen rättning", () => {
  for (const e of ddlExercises) {
    const r = checkDdl(toDdl(e.facit), e);
    assert.equal(r.status, "correct", `${e.id}: ${JSON.stringify(r.tables.filter((t) => t.status !== "ok"))}`);
  }
});

test("rätt svar i tentans form", () => {
  const r = checkDdl(ok18(), E18);
  assert.equal(r.status, "correct");
  assert.equal(r.extra.length, 0);
});

test("namnfrihet: omdöpta surrogat- och FK-kolumner, INT, constraintnamn, inline-constraints, omvänd ordning", () => {
  const text = `
CREATE TABLE R2 (
  b_id INT,
  IdC INT,
  R2attr INT,
  CONSTRAINT PK_R2 PRIMARY KEY (IdC, b_id),
  CONSTRAINT FK_R2_B FOREIGN KEY (b_id) REFERENCES B(B_ID),
  CONSTRAINT FK_R2_C FOREIGN KEY (IdC) REFERENCES C(IdC)
);
CREATE TABLE C (
  IdC INT IDENTITY(1,1) PRIMARY KEY,
  c1 INT NOT NULL UNIQUE,
  c2 INT,
  DIdent INT NOT NULL REFERENCES D(D_ID)
);
CREATE TABLE a (
  A_ID INTEGER IDENTITY(1,1) CONSTRAINT PK_A PRIMARY KEY,
  A1 INTEGER NOT NULL CONSTRAINT UQ_A_A1 UNIQUE,
  A2 INTEGER, A3 INTEGER,
  B_ID INTEGER NOT NULL FOREIGN KEY REFERENCES B(B_ID)
);
CREATE TABLE D (D_ID INT IDENTITY(1,1), D1 INT NOT NULL, D2 INT, PRIMARY KEY (D_ID), UNIQUE (D1));
CREATE TABLE B (B_ID INT IDENTITY(1,1), B1 INT NOT NULL, B2 INT NOT NULL, B3 INT, PRIMARY KEY (B_ID), UNIQUE (B2, B1));`;
  const r = checkDdl(text, E18);
  assert.equal(r.status, "correct", JSON.stringify(r.tables.filter((t) => t.status !== "ok")));
});

test("unär relation: två FK mot samma tabell matchas som par", () => {
  const text = toDdl(E19.facit).replace(/CREATE TABLE R3 \([\s\S]*?\);/, `CREATE TABLE R3 (
    Foralder INTEGER,
    Barn INTEGER,
    PRIMARY KEY (Barn, Foralder),
    FOREIGN KEY (Foralder) REFERENCES C(CID),
    FOREIGN KEY (Barn) REFERENCES C(CID)
);`);
  assert.equal(checkDdl(text, E19).status, "correct");
  const one = toDdl(E19.facit).replace(/CREATE TABLE R3 \([\s\S]*?\);/, `CREATE TABLE R3 (
    CID INTEGER,
    C1r3 INTEGER,
    PRIMARY KEY (CID, C1r3),
    FOREIGN KEY (CID) REFERENCES C(CID)
);`);
  const r = checkDdl(one, E19);
  assert.notEqual(r.status, "correct");
  assert.ok(tags(r, "R3").includes("unär"));
});

test("surrogat saknas på vanlig entitet", () => {
  const r = checkDdl(ok18({ D: `CREATE TABLE D (D1 INTEGER NOT NULL, D2 INTEGER, PRIMARY KEY (D1));` }), E18);
  assert.ok(tags(r, "D").includes("surrogat"));
});

test("surrogat på en sambandstabell är fel", () => {
  const r = checkDdl(ok18({ R2: R2.replace("BID INTEGER,", "R2ID INTEGER IDENTITY(1,1),\n    BID INTEGER,") }), E18);
  assert.ok(tags(r, "R2").includes("surrogat"));
});

test("IDENTITY utan PRIMARY KEY räcker inte", () => {
  const r = checkDdl(ok18({ D: D.replace("PRIMARY KEY (DID),", "") }), E18);
  assert.ok(table(r, "D").problems.some((p) => p.tag === "surrogat" && /PRIMARY KEY saknas/.test(p.text)));
});

test("naturlig nyckel utan NOT NULL, och utan UNIQUE", () => {
  const noNull = checkDdl(ok18({ D: D.replace("D1 INTEGER NOT NULL", "D1 INTEGER") }), E18);
  assert.ok(tags(noNull, "D").includes("naturlig nyckel"));
  const noUnique = checkDdl(ok18({ D: D.replace(",\n    UNIQUE (D1)", "") }), E18);
  assert.ok(tags(noUnique, "D").includes("naturlig nyckel"));
});

test("sammansatt identifierare som två separata UNIQUE är fel", () => {
  const r = checkDdl(ok18({ B: B.replace("UNIQUE (B1, B2)", "UNIQUE (B1),\n    UNIQUE (B2)") }), E18);
  assert.ok(table(r, "B").problems.some((p) => p.tag === "naturlig nyckel" && /var för sig/.test(p.text)));
});

test("svag entitet: UNIQUE utan ägarens FK", () => {
  const text = toDdl(E19.facit).replace("UNIQUE (B1, AID)", "UNIQUE (B1)");
  const r = checkDdl(text, E19);
  assert.ok(table(r, "B").problems.some((p) => p.tag === "svag entitet" && /ensam är för strängt/.test(p.text)));
});

test("total deltagande: FK utan NOT NULL; partiell deltagande: FK med NOT NULL", () => {
  const total = checkDdl(ok18({ A: A.replace("BID INTEGER NOT NULL", "BID INTEGER") }), E18);
  assert.ok(tags(total, "A").includes("total deltagande"));
  const partial = checkDdl(toDdl(E19.facit).replace("EID  INTEGER,", "EID  INTEGER NOT NULL,"), E19);
  assert.ok(tags(partial, "D").includes("total deltagande"));
});

test("flervärt attribut som kolumn i stället för egen tabell", () => {
  const text = toDdl(E19.facit)
    .replace(/CREATE TABLE B3 \([\s\S]*?\);/, "")
    .replace("B2   INTEGER,", "B2   INTEGER,\n    B3   INTEGER,");
  const r = checkDdl(text, E19);
  assert.ok(tags(r, "B").includes("flervärt"));
  assert.equal(table(r, "B3").status, "missing");
});

test("fel PK på sambandstabell", () => {
  const r = checkDdl(ok18({ R2: R2.replace("PRIMARY KEY (BID, CID)", "PRIMARY KEY (BID)") }), E18);
  assert.ok(tags(r, "R2").includes("M:N"));
});

test("FK på fel sida i 1:N", () => {
  const text = ok18({
    A: A.replace("    BID INTEGER NOT NULL,\n", "").replace(",\n    FOREIGN KEY (BID) REFERENCES B(BID)", ""),
    B: B.replace("B3 INTEGER,", "B3 INTEGER,\n    AID INTEGER,").replace("UNIQUE (B1, B2)", "UNIQUE (B1, B2),\n    FOREIGN KEY (AID) REFERENCES A(AID)"),
  });
  const r = checkDdl(text, E18);
  assert.ok(tags(r, "A").includes("1:N"));
  assert.ok(table(r, "B").problems.some((p) => p.tag === "1:N" && /fel sida/.test(p.text)));
});

test("kolumn utan FOREIGN KEY förklaras som saknad främmande nyckel", () => {
  const r = checkDdl(ok18({ A: A.replace(",\n    FOREIGN KEY (BID) REFERENCES B(BID)", "") }), E18);
  assert.ok(table(r, "A").problems.some((p) => /saknar FOREIGN KEY/.test(p.text)));
});

test("saknad tabell, saknad kolumn och överflödig tabell", () => {
  const missing = checkDdl([B, D, A, C].join("\n"), E18);
  assert.equal(table(missing, "R2").status, "missing");
  const col = checkDdl(ok18({ A: A.replace("    A3 INTEGER,\n", "") }), E18);
  assert.ok(table(col, "A").problems.some((p) => /A3 saknas/.test(p.text)));
  const extra = checkDdl(ok18() + `\nCREATE TABLE R1 (AID INTEGER, BID INTEGER, PRIMARY KEY (AID, BID));`, E18);
  assert.equal(extra.extra.length, 1);
  assert.equal(extra.extra[0].tag, "1:N");
});

test("REFERENCES mot den naturliga nyckeln i stället för surrogatnyckeln", () => {
  const r = checkDdl(ok18({ A: A.replace("REFERENCES B(BID)", "REFERENCES B(B1)").replace("    BID INTEGER NOT NULL,", "    BID INTEGER NOT NULL,") }), E18);
  assert.ok(table(r, "A").problems.some((p) => p.tag === "surrogat" && /naturliga nyckeln/.test(p.text)));
});

test("1:1 i uppgift 21: UNIQUE på C.DID godtas med och utan", () => {
  const e = ex("ddl-21");
  const base = toDdl(e.facit);
  assert.equal(checkDdl(base, e).status, "correct");
  assert.equal(checkDdl(base.replace("UNIQUE (C1),", "UNIQUE (C1),\n    UNIQUE (DID),"), e).status, "correct");
});

test("tabellnamn med å, ä, ö matchar facit utan", () => {
  const e = ex("ddl-forening");
  const text = toDdl(e.facit).replace(/\bForening\b/g, "Förening");
  assert.equal(checkDdl(text, e).status, "correct");
});

test("syntaxfel ger radnummer: saknat kommatecken och förkortningar", () => {
  const comma = checkDdl(`CREATE TABLE D (
    DID INTEGER IDENTITY(1,1),
    D1 INTEGER NOT NULL,
    D2 INTEGER
    PRIMARY KEY (DID),
    UNIQUE (D1)
);`, E18);
  assert.equal(comma.status, "parse-error");
  assert.match(comma.errors[0].message, /^Rad 5: kommatecken saknas/);
  const abbrev = parseDdl(`CREATE TABLE D (
    DID INTEGER IDENTITY(1,1),
    PK (DID)
);`);
  assert.match(abbrev.errors[0].message, /Rad 3: skriv PRIMARY KEY utskrivet/);
  const unknownCol = parseDdl(`CREATE TABLE D (DID INTEGER IDENTITY(1,1), PRIMARY KEY (XID));`);
  assert.match(unknownCol.errors[0].message, /XID i PRIMARY KEY finns inte/);
});

test("parsern: kommentarer, GO, semikolon och dbo.-prefix", () => {
  const r = parseDdl(`-- uppgift
CREATE TABLE dbo.X ( /* surrogat */ XID INT IDENTITY(1,1) PRIMARY KEY, Y INT NOT NULL UNIQUE )
GO
CREATE TABLE Z (ZID INT IDENTITY(1,1), XID INT REFERENCES dbo.X(XID) ON DELETE CASCADE, PRIMARY KEY (ZID));`);
  assert.deepEqual(r.errors, []);
  assert.equal(r.tables.length, 2);
  assert.equal(r.tables[0].name, "X");
  assert.equal(r.tables[1].fks[0].target, "X");
});
