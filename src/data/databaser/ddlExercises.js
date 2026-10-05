// "ER-diagram till DDL": tentans uppgift 2 (25 p) som övning. Ett
// Chen-diagram blir CREATE TABLE-kod direkt, utan logiskt steg. Rättas som
// struktur av lib/ddlCheck.js — se filens huvudkommentar för formatet.
//
// Häftets uppgift 18–22 har facit som SQL; här är det omskrivet till
// strukturdata och läst mot diagrammen. Avvikelser mellan häftets facit och
// diagrammet (2026-10-05):
//   19: kommatecken saknas i tabell C (efter BID) och i R4 (efter DID) — rättat.
//   21: R3 är 1:1, men facit ger C.DID ingen UNIQUE. Utan den kan flera C
//       peka på samma D. Båda godtas (optionalUnique) i väntan på Björn.
//   18–22: facit skapar tabeller som refererar tabeller längre ned (A före
//       B i 18, D före E i 19 …), så koden kör inte i den ordningen i SQL
//       Server. Ordningen rättas inte; facit här skrivs ut med refererade
//       tabeller först.
// Uppgift 18 är i UML-stil i häftet och är omritad i Chen, så att alla
// uppgifter tränar tentans notation. B:s sammansatta primärnyckel {b1, b2}
// ritas som den sammansatta identifieraren BK med delarna B1 och B2, samma
// form som D1 i uppgift 19 och 22.
//
// De egna uppgifterna (E1–E4) använder befintliga figurer: kapitel 6:s tre
// genomgångsdiagram och Modellera-uppgiften Festival. Föreningens facit är
// exakt kapitel 9:s ("Från diagram till kod: föreningen"). reviewed: false.

const r = (rule, why) => ({ rule, why });

export const ddlExercises = [
  {
    id: "ddl-18", number: 18, title: "A, B, C, D med R1–R3", diagram: "ddl-18",
    source: "Övningshäftet uppgift 18 (i häftet UML-stil, här omritad i Chen)",
    intro: "Fyra vanliga entiteter. R1 och R3 är 1:N med totalt deltagande på många-sidan, R2 är M:N med attributet R2attr. B identifieras av det sammansatta attributet BK.",
    composites: ["BK"],
    facit: [
      { name: "A", kind: "entity", surrogate: "AID", columns: [{ name: "A1", notNull: true }, { name: "A2" }, { name: "A3" }], fks: [{ name: "BID", to: "B", notNull: true, rel: "R1", tag: "1:N" }], unique: [["A1"]] },
      { name: "B", kind: "entity", surrogate: "BID", columns: [{ name: "B1", notNull: true }, { name: "B2", notNull: true }, { name: "B3" }], fks: [], unique: [["B1", "B2"]] },
      { name: "C", kind: "entity", surrogate: "CID", columns: [{ name: "C1", notNull: true }, { name: "C2" }], fks: [{ name: "DID", to: "D", notNull: true, rel: "R3", tag: "1:N" }], unique: [["C1"]] },
      { name: "D", kind: "entity", surrogate: "DID", columns: [{ name: "D1", notNull: true }, { name: "D2" }], fks: [], unique: [["D1"]] },
      { name: "R2", kind: "junction", columns: [{ name: "R2attr" }], fks: [{ name: "BID", to: "B" }, { name: "CID", to: "C" }], pk: ["BID", "CID"] },
    ],
    folded: {
      R1: { tag: "1:N", why: "R1 är 1:N och blir en främmande nyckel i A, många-sidan — inte en egen tabell." },
      R3: { tag: "1:N", why: "R3 är 1:N och blir en främmande nyckel i C, många-sidan — inte en egen tabell." },
    },
    rules: {
      a: r("Vanlig entitet, 1:N", "Surrogatnyckel som PRIMARY KEY, A1 som NOT NULL + UNIQUE, och B:s nyckel som NOT NULL främmande nyckel för R1 — dubbel linje vid A."),
      b: r("Sammansatt identifierare", "BK blir sina delar B1 och B2, båda NOT NULL, med en gemensam UNIQUE (B1, B2) — inte två separata."),
      c: r("Vanlig entitet, 1:N", "C1 som NOT NULL + UNIQUE och D:s nyckel som NOT NULL främmande nyckel för R3 — dubbel linje vid C."),
      d: r("Vanlig entitet", "Surrogatnyckel som PRIMARY KEY och D1 som NOT NULL + UNIQUE."),
      r2: r("M:N", "Egen tabell utan surrogatnyckel: PRIMARY KEY (BID, CID), båda främmande nycklar, och R2attr som vanlig kolumn."),
    },
  },
  {
    id: "ddl-19", number: 19, title: "Svag B, unära R3 och R6", diagram: "ddl-19",
    source: "Övningshäftet uppgift 19 (facit saknar två kommatecken, rättat)",
    intro: "B är svag under A via R1, med den partiella nyckeln B1 och flervärdesattributet B3. C har två identifierare. R3 är unär M:N, R6 unär 1:M med dubbel linje på M-sidan. D identifieras av det sammansatta D1.",
    composites: ["D1"],
    facit: [
      { name: "A", kind: "entity", surrogate: "AID", columns: [{ name: "A1", notNull: true }, { name: "A2" }], fks: [], unique: [["A1"]] },
      { name: "B", kind: "weak", surrogate: "BID", columns: [{ name: "B1", notNull: true }, { name: "B2" }], fks: [{ name: "AID", to: "A", notNull: true, rel: "R1", tag: "svag entitet" }], unique: [["B1", "AID"]] },
      { name: "B3", aliases: ["BB3", "B_B3"], kind: "multivalued", columns: [{ name: "B3" }], fks: [{ name: "BID", to: "B" }], pk: ["BID", "B3"] },
      { name: "C", kind: "entity", surrogate: "CID", columns: [{ name: "C1", notNull: true }, { name: "C2", notNull: true }, { name: "C3" }], fks: [{ name: "BID", to: "B", notNull: true, rel: "R2", tag: "1:N" }], unique: [["C1"], ["C2"]] },
      { name: "R3", kind: "junction", columns: [], fks: [{ name: "CID", to: "C" }, { name: "C1r3", to: "C" }], pk: ["CID", "C1r3"] },
      { name: "D", kind: "entity", surrogate: "DID", columns: [{ name: "D2", notNull: true }, { name: "D3", notNull: true }], fks: [{ name: "EID", to: "E", notNull: false, rel: "R5", tag: "1:N" }], unique: [["D2", "D3"]] },
      { name: "R4", kind: "junction", columns: [], fks: [{ name: "CID", to: "C" }, { name: "DID", to: "D" }], pk: ["CID", "DID"] },
      { name: "E", kind: "entity", surrogate: "EID", columns: [{ name: "E1", notNull: true }, { name: "E2" }], fks: [{ name: "E1r6", to: "E", notNull: true, rel: "R6", tag: "unär" }], unique: [["E1"]] },
    ],
    folded: {
      R1: { tag: "svag entitet", why: "R1 är den identifierande relationen: ägarens nyckel läggs i B, och UNIQUE (B1, AID) uttrycker beroendet." },
      R2: { tag: "1:N", why: "R2 är 1:N och blir en främmande nyckel i C — inte en egen tabell." },
      R5: { tag: "1:N", why: "R5 är 1:N och blir en nullbar främmande nyckel i D — inte en egen tabell." },
      R6: { tag: "unär", why: "R6 är unär 1:M och blir en främmande nyckel i E mot E självt — inte en egen tabell." },
    },
    rules: {
      a: r("Vanlig entitet", "Surrogatnyckel som PRIMARY KEY och A1 som NOT NULL + UNIQUE."),
      b: r("Svag entitet", "Egen surrogatnyckel, ägarens nyckel AID som NOT NULL främmande nyckel och UNIQUE (B1, AID): B1 är unik bara inom A."),
      b3: r("Flervärt attribut", "Egen tabell med ägarens främmande nyckel plus värdet som PRIMARY KEY (BID, B3), utan surrogatnyckel."),
      c: r("Två identifierare, 1:N", "C1 och C2 är var sin identifierare: båda NOT NULL med var sin UNIQUE. R2 ger B:s nyckel som NOT NULL främmande nyckel — dubbel linje vid C."),
      r3: r("Unär M:N", "Sambandstabell med två kolumner som båda refererar C och tillsammans är PRIMARY KEY."),
      d: r("Sammansatt identifierare, 1:N", "D1 blir D2 och D3 med en gemensam UNIQUE (D2, D3). R5 ger E:s nyckel som nullbar främmande nyckel — enkel linje vid D."),
      r4: r("M:N", "Egen tabell utan surrogatnyckel: PRIMARY KEY (CID, DID)."),
      e: r("Unär 1:M", "Främmande nyckel i E mot E självt, på M-rollen. Linjen på M-sidan är dubbel, så kolumnen är NOT NULL."),
    },
  },
  {
    id: "ddl-20", number: 20, title: "Två svaga entiteter och unära R1", diagram: "ddl-20",
    source: "Övningshäftet uppgift 20",
    intro: "B är svag under C via R3, med den sammansatta partiella nyckeln B1 (B2, B3, B4). A är svag under D via R5 och har den unära relationen R1. R2 är M:N med R2a, R4 är 1:M med totalt deltagande vid D.",
    composites: ["B1"],
    facit: [
      { name: "A", kind: "weak", surrogate: "AID", columns: [{ name: "A1", notNull: true }, { name: "A2" }], fks: [{ name: "AIDR1", to: "A", notNull: false, rel: "R1", tag: "unär" }, { name: "DID", to: "D", notNull: true, rel: "R5", tag: "svag entitet" }], unique: [["A1", "DID"]] },
      { name: "B", kind: "weak", surrogate: "BID", columns: [{ name: "B2", notNull: true }, { name: "B3", notNull: true }, { name: "B4", notNull: true }, { name: "B5" }], fks: [{ name: "CID", to: "C", notNull: true, rel: "R3", tag: "svag entitet" }], unique: [["B2", "B3", "B4", "CID"]] },
      { name: "C", kind: "entity", surrogate: "CID", columns: [{ name: "C1", notNull: true }, { name: "C2", notNull: true }], fks: [], unique: [["C1"], ["C2"]] },
      { name: "D", kind: "entity", surrogate: "DID", columns: [{ name: "D1", notNull: true }, { name: "D2" }], fks: [{ name: "CID", to: "C", notNull: true, rel: "R4", tag: "1:N" }], unique: [["D1"]] },
      { name: "R2", kind: "junction", columns: [{ name: "R2a" }], fks: [{ name: "AID", to: "A" }, { name: "BID", to: "B" }], pk: ["AID", "BID"] },
    ],
    folded: {
      R1: { tag: "unär", why: "R1 är unär 1:M och blir en nullbar främmande nyckel i A mot A självt — inte en egen tabell." },
      R3: { tag: "svag entitet", why: "R3 är identifierande: C:s nyckel läggs i B och ingår i B:s UNIQUE." },
      R4: { tag: "1:N", why: "R4 är 1:M och blir en främmande nyckel i D — inte en egen tabell." },
      R5: { tag: "svag entitet", why: "R5 är identifierande: D:s nyckel läggs i A och ingår i A:s UNIQUE." },
    },
    rules: {
      a: r("Svag entitet med unär 1:M", "Surrogatnyckel, D:s nyckel som NOT NULL främmande nyckel, UNIQUE (A1, DID), och för R1 en främmande nyckel mot A självt. Linjen på M-rollen i R1 är enkel, så den får vara NULL."),
      b: r("Svag entitet, sammansatt partiell nyckel", "B1 blir sina delar B2, B3 och B4, alla NOT NULL, och UNIQUE (B2, B3, B4, CID) tillsammans med ägarens nyckel."),
      c: r("Två identifierare", "C1 och C2 är var sin identifierare: båda NOT NULL med var sin UNIQUE."),
      d: r("Vanlig entitet, 1:M", "D1 som NOT NULL + UNIQUE och C:s nyckel som NOT NULL främmande nyckel för R4 — dubbel linje vid D."),
      r2: r("M:N", "Egen tabell utan surrogatnyckel: PRIMARY KEY (AID, BID) och R2a som vanlig kolumn."),
    },
  },
  {
    id: "ddl-21", number: 21, title: "Kedjad svag entitet och 1:1", diagram: "ddl-21",
    source: "Övningshäftet uppgift 21 (1:1-relationen R3: UNIQUE på C.DID godtas med och utan)",
    intro: "B är svag under C via R2 och A svag under B via R1 — två led. A har flervärdesattributet A2. R3 är 1:1 med totalt deltagande vid C, R4 unär M:N på D, R5 1:M mellan D och A.",
    composites: ["B2"],
    facit: [
      { name: "A", kind: "weak", surrogate: "AID", columns: [{ name: "A1", notNull: true }], fks: [{ name: "BID", to: "B", notNull: true, rel: "R1", tag: "svag entitet" }, { name: "DID", to: "D", notNull: false, rel: "R5", tag: "1:N" }], unique: [["A1", "BID"]] },
      { name: "A2", aliases: ["AA2", "A_A2"], kind: "multivalued", columns: [{ name: "A2" }], fks: [{ name: "AID", to: "A" }], pk: ["AID", "A2"] },
      { name: "B", kind: "weak", surrogate: "BID", columns: [{ name: "B1", notNull: true }, { name: "B3" }, { name: "B4" }], fks: [{ name: "CID", to: "C", notNull: true, rel: "R2", tag: "svag entitet" }], unique: [["B1", "CID"]] },
      { name: "C", kind: "entity", surrogate: "CID", columns: [{ name: "C1", notNull: true }, { name: "C2" }], fks: [{ name: "DID", to: "D", notNull: true, rel: "R3", tag: "1:N" }], unique: [["C1"]], optionalUnique: [["DID"]] },
      { name: "D", kind: "entity", surrogate: "DID", columns: [{ name: "D1", notNull: true }, { name: "D2", notNull: true }], fks: [], unique: [["D1"], ["D2"]] },
      { name: "R4", kind: "junction", columns: [], fks: [{ name: "DID", to: "D" }, { name: "R4DID", to: "D" }], pk: ["DID", "R4DID"] },
    ],
    folded: {
      R1: { tag: "svag entitet", why: "R1 är identifierande: B:s nyckel läggs i A och ingår i A:s UNIQUE." },
      R2: { tag: "svag entitet", why: "R2 är identifierande: C:s nyckel läggs i B och ingår i B:s UNIQUE." },
      R3: { tag: "1:N", why: "R3 är 1:1 och blir en främmande nyckel i C, sidan med totalt deltagande — inte en egen tabell." },
      R5: { tag: "1:N", why: "R5 är 1:M och blir en nullbar främmande nyckel i A — inte en egen tabell." },
    },
    rules: {
      a: r("Kedjad svag entitet", "A:s ägare är B, som själv är svag. A refererar bara B:s surrogatnyckel och har UNIQUE (A1, BID); C kommer med via B. R5 ger en nullbar främmande nyckel mot D."),
      a2: r("Flervärt attribut", "Egen tabell med PRIMARY KEY (AID, A2), utan surrogatnyckel."),
      b: r("Svag entitet", "B2 är sammansatt och blir sina delar B3 och B4 — utan NOT NULL, eftersom B2 inte är identifierare. UNIQUE (B1, CID) med ägarens nyckel."),
      c: r("Vanlig entitet, 1:1", "R3 är 1:1 med dubbel linje vid C: D:s nyckel läggs i C som NOT NULL. Häftets facit har ingen UNIQUE på den; UNIQUE (DID) gör 1:1 strikt och godtas också."),
      d: r("Två identifierare", "D1 och D2 är var sin identifierare: båda NOT NULL med var sin UNIQUE."),
      r4: r("Unär M:N", "Sambandstabell med två kolumner som båda refererar D och tillsammans är PRIMARY KEY."),
    },
  },
  {
    id: "ddl-22", number: 22, title: "Svag B med unära R2, flervärt D4", diagram: "ddl-22",
    source: "Övningshäftet uppgift 22",
    intro: "B är svag under C via R3 och har den unära 1:M-relationen R2. A är svag under D via R5. R1 är 1:M med totalt deltagande vid B, R4 M:N med R4a. D har det sammansatta D1 och flervärdesattributet D4.",
    composites: ["D1"],
    facit: [
      { name: "A", kind: "weak", surrogate: "AID", columns: [{ name: "A1", notNull: true }, { name: "A2" }], fks: [{ name: "DID", to: "D", notNull: true, rel: "R5", tag: "svag entitet" }], unique: [["A1", "DID"]] },
      { name: "B", kind: "weak", surrogate: "BID", columns: [{ name: "B1", notNull: true }], fks: [{ name: "AID", to: "A", notNull: true, rel: "R1", tag: "1:N" }, { name: "R2BID", to: "B", notNull: false, rel: "R2", tag: "unär" }, { name: "CID", to: "C", notNull: true, rel: "R3", tag: "svag entitet" }], unique: [["B1", "CID"]] },
      { name: "C", kind: "entity", surrogate: "CID", columns: [{ name: "C1", notNull: true }, { name: "C2", notNull: true }], fks: [], unique: [["C1"], ["C2"]] },
      { name: "D", kind: "entity", surrogate: "DID", columns: [{ name: "D2", notNull: true }, { name: "D3", notNull: true }], fks: [], unique: [["D2", "D3"]] },
      { name: "D4", aliases: ["DD4", "D_D4"], kind: "multivalued", columns: [{ name: "D4" }], fks: [{ name: "DID", to: "D" }], pk: ["DID", "D4"] },
      { name: "R4", kind: "junction", columns: [{ name: "R4a" }], fks: [{ name: "CID", to: "C" }, { name: "DID", to: "D" }], pk: ["CID", "DID"] },
    ],
    folded: {
      R1: { tag: "1:N", why: "R1 är 1:M och blir en främmande nyckel i B — inte en egen tabell." },
      R2: { tag: "unär", why: "R2 är unär 1:M och blir en nullbar främmande nyckel i B mot B självt — inte en egen tabell." },
      R3: { tag: "svag entitet", why: "R3 är identifierande: C:s nyckel läggs i B och ingår i B:s UNIQUE." },
      R5: { tag: "svag entitet", why: "R5 är identifierande: D:s nyckel läggs i A och ingår i A:s UNIQUE." },
    },
    rules: {
      a: r("Svag entitet", "Surrogatnyckel, D:s nyckel som NOT NULL främmande nyckel och UNIQUE (A1, DID)."),
      b: r("Svag entitet med 1:M och unär 1:M", "UNIQUE (B1, CID) med ägaren C, A:s nyckel NOT NULL för R1 (dubbel linje vid B) och en nullbar främmande nyckel mot B självt för R2."),
      c: r("Två identifierare", "C1 och C2 är var sin identifierare: båda NOT NULL med var sin UNIQUE."),
      d: r("Sammansatt identifierare", "D1 blir D2 och D3 med en gemensam UNIQUE (D2, D3)."),
      d4: r("Flervärt attribut", "Egen tabell med PRIMARY KEY (DID, D4), utan surrogatnyckel."),
      r4: r("M:N", "Egen tabell utan surrogatnyckel: PRIMARY KEY (CID, DID) och R4a som vanlig kolumn."),
    },
  },

  // ── Egna uppgifter på befintliga figurer ─────────────────────────────
  {
    id: "ddl-forening", number: "E1", title: "Föreningen", diagram: "pastaenden-forening", reviewed: false,
    source: "Egen uppgift på kapitel 6:s diagram; facit är kapitel 9:s genomgång",
    intro: "Förening, Lag (svag under Förening via Har), Spelare (medlem i exakt en förening), Arena, SpelarI (M:N) och Hemma (ett lag har högst en hemmaarena, frivilligt).",
    facit: [
      { name: "Forening", kind: "entity", surrogate: "ForeningID", columns: [{ name: "ForeningsNo", notNull: true }, { name: "Namn" }], fks: [], unique: [["ForeningsNo"]] },
      { name: "Arena", kind: "entity", surrogate: "ArenaID", columns: [{ name: "ArenaNo", notNull: true }, { name: "Ort" }], fks: [], unique: [["ArenaNo"]] },
      { name: "Lag", kind: "weak", surrogate: "LagID", columns: [{ name: "LagNo", notNull: true }, { name: "Division" }], fks: [{ name: "ForeningID", to: "Forening", notNull: true, rel: "Har", tag: "svag entitet" }, { name: "ArenaID", to: "Arena", notNull: false, rel: "Hemma", tag: "1:N" }], unique: [["LagNo", "ForeningID"]] },
      { name: "Spelare", kind: "entity", surrogate: "SpelareID", columns: [{ name: "SpelarNo", notNull: true }, { name: "Namn" }], fks: [{ name: "ForeningID", to: "Forening", notNull: true, rel: "MedlemI", tag: "1:N" }], unique: [["SpelarNo"]] },
      { name: "SpelarI", kind: "junction", columns: [], fks: [{ name: "SpelareID", to: "Spelare" }, { name: "LagID", to: "Lag" }], pk: ["SpelareID", "LagID"] },
    ],
    folded: {
      Har: { tag: "svag entitet", why: "Har är identifierande: föreningens nyckel läggs i Lag och ingår i UNIQUE (LagNo, ForeningID)." },
      MedlemI: { tag: "1:N", why: "MedlemI är 1:N och blir en NOT NULL främmande nyckel i Spelare — inte en egen tabell." },
      Hemma: { tag: "1:N", why: "Hemma är N:1 och blir en nullbar främmande nyckel i Lag — inte en egen tabell." },
    },
    rules: {
      forening: r("Vanlig entitet", "Surrogatnyckel och föreningsNo som NOT NULL + UNIQUE."),
      arena: r("Vanlig entitet", "Surrogatnyckel och arenaNo som NOT NULL + UNIQUE."),
      lag: r("Svag entitet, 1:N", "UNIQUE (LagNo, ForeningID) med ägaren, ForeningID NOT NULL för Har och ArenaID nullbar för Hemma — enkel linje vid Lag."),
      spelare: r("Vanlig entitet, 1:N", "MedlemI: dubbel linje vid Spelare, så ForeningID är NOT NULL."),
      spelari: r("M:N", "Kopplingstabell utan surrogatnyckel. Dubbellinjen vid Lag (minst en spelare) kan ingen constraint uttrycka — det kostar inga poäng."),
    },
  },
  {
    id: "ddl-bibliotek", number: "E2", title: "Biblioteket", diagram: "pastaenden-bibliotek", reviewed: false,
    source: "Egen uppgift på kapitel 6:s diagram (genomgång 2)",
    intro: "Bok, Exemplar (svag under Bok via FinnsSom), Låntagare med den unära Fadder, Författare och SkrivenAv (M:N). Lånar är 1:N mellan Låntagare och Exemplar.",
    facit: [
      { name: "Bok", kind: "entity", surrogate: "BokID", columns: [{ name: "Isbn", notNull: true }, { name: "Titel" }], fks: [], unique: [["Isbn"]] },
      { name: "Exemplar", kind: "weak", surrogate: "ExemplarID", columns: [{ name: "ExNo", notNull: true }, { name: "Skick" }], fks: [{ name: "BokID", to: "Bok", notNull: true, rel: "FinnsSom", tag: "svag entitet" }, { name: "LantagareID", to: "Lantagare", notNull: false, rel: "Lånar", tag: "1:N" }], unique: [["ExNo", "BokID"]] },
      { name: "Lantagare", kind: "entity", surrogate: "LantagareID", columns: [{ name: "LantagarNo", notNull: true }, { name: "Namn" }], fks: [{ name: "FadderID", to: "Lantagare", notNull: false, rel: "Fadder", tag: "unär" }], unique: [["LantagarNo"]] },
      { name: "Forfattare", kind: "entity", surrogate: "ForfattareID", columns: [{ name: "ForfattarNo", notNull: true }, { name: "Namn" }], fks: [], unique: [["ForfattarNo"]] },
      { name: "SkrivenAv", kind: "junction", columns: [], fks: [{ name: "ForfattareID", to: "Forfattare" }, { name: "BokID", to: "Bok" }], pk: ["ForfattareID", "BokID"] },
    ],
    folded: {
      FinnsSom: { tag: "svag entitet", why: "FinnsSom är identifierande: bokens nyckel läggs i Exemplar och ingår i UNIQUE (ExNo, BokID)." },
      Lanar: { tag: "1:N", why: "Lånar är 1:N och blir en nullbar främmande nyckel i Exemplar — inte en egen tabell." },
      Fadder: { tag: "unär", why: "Fadder är unär 1:N och blir en nullbar främmande nyckel i Låntagare mot Låntagare själv." },
    },
    rules: {
      bok: r("Vanlig entitet", "Surrogatnyckel och isbn som NOT NULL + UNIQUE."),
      exemplar: r("Svag entitet, 1:N", "UNIQUE (ExNo, BokID) med ägaren och BokID NOT NULL. Lånar: enkel linje vid Exemplar, så låntagarens nyckel får vara NULL."),
      lantagare: r("Unär 1:N", "Fadder: varje låntagare har högst en fadder, så adepten bär en främmande nyckel mot fadderns rad i samma tabell — nullbar, enkla linjer."),
      forfattare: r("Vanlig entitet", "Surrogatnyckel och författarNo som NOT NULL + UNIQUE."),
      skrivenav: r("M:N", "Kopplingstabell utan surrogatnyckel. Dubbellinjen vid Bok (minst en författare) går inte att uttrycka med en constraint."),
    },
  },
  {
    id: "ddl-rederi", number: "E3", title: "Rederiet", diagram: "pastaenden-rederi", reviewed: false,
    source: "Egen uppgift på kapitel 6:s diagram (genomgång 3, tvåstegs identifierande kedja)",
    intro: "Rederi äger Fartyg (svagt), som gör Resor (svaga under Fartyg). Varje resa anlöper exakt en Hamn, som identifieras av det sammansatta hamnId (namn, land).",
    composites: ["hamnId"],
    facit: [
      { name: "Rederi", kind: "entity", surrogate: "RederiID", columns: [{ name: "RederiNo", notNull: true }, { name: "Namn" }], fks: [], unique: [["RederiNo"]] },
      { name: "Fartyg", kind: "weak", surrogate: "FartygID", columns: [{ name: "Fartygsnamn", notNull: true }, { name: "Byggar" }], fks: [{ name: "RederiID", to: "Rederi", notNull: true, rel: "Äger", tag: "svag entitet" }], unique: [["Fartygsnamn", "RederiID"]] },
      { name: "Resa", kind: "weak", surrogate: "ResaID", columns: [{ name: "Avgangsdatum", notNull: true }, { name: "Last" }], fks: [{ name: "FartygID", to: "Fartyg", notNull: true, rel: "Gör", tag: "svag entitet" }, { name: "HamnID", to: "Hamn", notNull: true, rel: "Anlöper", tag: "1:N" }], unique: [["Avgangsdatum", "FartygID"]] },
      { name: "Hamn", kind: "entity", surrogate: "HamnID", columns: [{ name: "Namn", notNull: true }, { name: "Land", notNull: true }], fks: [], unique: [["Namn", "Land"]] },
    ],
    folded: {
      Ager: { tag: "svag entitet", why: "Äger är identifierande: rederiets nyckel läggs i Fartyg och ingår i UNIQUE (Fartygsnamn, RederiID)." },
      Gor: { tag: "svag entitet", why: "Gör är identifierande: fartygets nyckel läggs i Resa och ingår i UNIQUE (Avgangsdatum, FartygID)." },
      Anloper: { tag: "1:N", why: "Anlöper är N:1 och blir en NOT NULL främmande nyckel i Resa — inte en egen tabell." },
    },
    rules: {
      rederi: r("Vanlig entitet", "Surrogatnyckel och rederiNo som NOT NULL + UNIQUE."),
      fartyg: r("Svag entitet", "UNIQUE (Fartygsnamn, RederiID): fartygsnamnet är unikt bara inom rederiet."),
      resa: r("Kedjad svag entitet", "Resa refererar bara Fartygs surrogatnyckel; rederiet följer med via Fartyg. Därför räcker UNIQUE (Avgangsdatum, FartygID) — i den logiska modellen hade nyckeln haft tre delar. Anlöper: dubbel linje vid Resa, HamnID NOT NULL."),
      hamn: r("Sammansatt identifierare", "hamnId blir sina delar namn och land, båda NOT NULL, med en gemensam UNIQUE (Namn, Land)."),
    },
  },
  {
    id: "ddl-festival", number: "E4", title: "Festival, Stage och Slot", diagram: "mod-festival", reviewed: false,
    source: "Egen uppgift på Modellera-uppgiften Festival (tre nivåer)",
    intro: "Festival identifieras av Name och har City. Stage är svag under Festival via Has, Slot svag under Stage via Hosts, med attributet Artist.",
    facit: [
      { name: "Festival", kind: "entity", surrogate: "FestivalID", columns: [{ name: "Name", notNull: true }, { name: "City" }], fks: [], unique: [["Name"]] },
      { name: "Stage", kind: "weak", surrogate: "StageID", columns: [{ name: "StageName", notNull: true }], fks: [{ name: "FestivalID", to: "Festival", notNull: true, rel: "Has", tag: "svag entitet" }], unique: [["StageName", "FestivalID"]] },
      { name: "Slot", kind: "weak", surrogate: "SlotID", columns: [{ name: "StartTime", notNull: true }, { name: "Artist" }], fks: [{ name: "StageID", to: "Stage", notNull: true, rel: "Hosts", tag: "svag entitet" }], unique: [["StartTime", "StageID"]] },
    ],
    folded: {
      Has: { tag: "svag entitet", why: "Has är identifierande: festivalens nyckel läggs i Stage." },
      Hosts: { tag: "svag entitet", why: "Hosts är identifierande: scenens nyckel läggs i Slot." },
    },
    rules: {
      festival: r("Vanlig entitet", "Surrogatnyckel och Name som NOT NULL + UNIQUE."),
      stage: r("Svag entitet", "UNIQUE (StageName, FestivalID): scennamnet är unikt bara inom festivalen."),
      slot: r("Kedjad svag entitet", "Slot refererar Stages surrogatnyckel, inte festivalen. UNIQUE (StartTime, StageID) räcker, eftersom StageID redan pekar ut en scen på en bestämd festival."),
    },
  },
];
