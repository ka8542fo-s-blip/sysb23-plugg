// Rättaren för "ER-diagram till DDL" (tentans uppgift 2): tolkar CREATE
// TABLE-satser i SQL Servers form och jämför STRUKTUREN mot facit — aldrig
// texten. Varje tabell blir kolumner (NOT NULL, IDENTITY), primärnyckel som
// mängd, varje UNIQUE som mängd och varje främmande nyckel som (kolumner →
// tabell).
//
// Varför en egen parser och inte tsql.js + sql.js: toSqliteDdl skriver om
// IDENTITY till AUTOINCREMENT och stryker den separata PK-constrainten, så
// efter översättningen går det inte att se om en kopplingstabell fått en
// IDENTITY den inte ska ha, och SQLite:s felrader pekar på den omskrivna
// koden, inte på studentens. SQLite släpper dessutom igenom sådant SQL
// Server stoppar (REFERENCES mot tabeller som inte finns, okända typer), och
// sql.js laddas asynkront som WASM. Delmängden tentan kräver är liten nog
// att tolka direkt, med radnummer i varje fel.
//
// Namnfrihet: surrogat- och FK-kolumner får heta vad som helst (AID, A_ID,
// IdA). En FK-kolumn identifieras av vilken tabell den pekar på, som i
// modelCheck; två FK mot samma tabell (unära relationer) matchas som par.
// Tabellnamn matchas på entitets- och relationsnamnen, utan hänsyn till
// skiftläge, understreck eller å/ä/ö. Tabell- och kolumnordning är fri.

// Fäll skiftläge, blanksteg, understreck och diakritiska tecken: Förening = forening.
export const fold = (s) => String(s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[\s_]+/g, "");

// ---------- Tokenisering ----------

function lex(text) {
  const tokens = [];
  const src = String(text ?? "");
  let i = 0;
  let line = 1;
  while (i < src.length) {
    const ch = src[i];
    if (ch === "\n") { line++; i++; continue; }
    if (/\s/.test(ch)) { i++; continue; }
    if (ch === "-" && src[i + 1] === "-") { while (i < src.length && src[i] !== "\n") i++; continue; }
    if (ch === "/" && src[i + 1] === "*") {
      const end = src.indexOf("*/", i + 2);
      const stop = end === -1 ? src.length : end + 2;
      for (let k = i; k < stop; k++) if (src[k] === "\n") line++;
      i = stop;
      continue;
    }
    if (ch === "[" || ch === '"') {
      const close = ch === "[" ? "]" : '"';
      const end = src.indexOf(close, i + 1);
      const stop = end === -1 ? src.length : end;
      tokens.push({ t: "id", v: src.slice(i + 1, stop), line, quoted: true });
      i = stop + 1;
      continue;
    }
    if (ch === "'") {
      let j = i + 1;
      while (j < src.length && !(src[j] === "'" && src[j + 1] !== "'")) j += src[j] === "'" ? 2 : 1;
      tokens.push({ t: "str", v: src.slice(i, j + 1), line });
      i = j + 1;
      continue;
    }
    const word = /^[\p{L}_#@][\p{L}\p{N}_#@$]*/u.exec(src.slice(i, i + 200));
    if (word) { tokens.push({ t: "id", v: word[0], line }); i += word[0].length; continue; }
    const num = /^\d+(\.\d+)?/.exec(src.slice(i, i + 40));
    if (num) { tokens.push({ t: "num", v: num[0], line }); i += num[0].length; continue; }
    tokens.push({ t: "op", v: ch, line });
    i++;
  }
  return tokens;
}

// ---------- Tolkning ----------

class SyntaxError_ extends Error {
  constructor(line, message) { super(message); this.line = line; }
}

const KW = (tok, ...words) => tok?.t === "id" && !tok.quoted && words.includes(tok.v.toUpperCase());
const OP = (tok, v) => tok?.t === "op" && tok.v === v;
const ABBREV = { PK: "PRIMARY KEY", FK: "FOREIGN KEY", UQ: "UNIQUE", REF: "REFERENCES" };
const describe = (tok) => (tok ? (tok.t === "op" ? `"${tok.v}"` : tok.v) : "slutet av texten");

function parser(tokens) {
  let p = 0;
  const peek = (k = 0) => tokens[p + k];
  const next = () => tokens[p++];
  const lastLine = () => tokens[tokens.length - 1]?.line ?? 1;
  const fail = (tok, message) => { throw new SyntaxError_(tok?.line ?? lastLine(), message); };
  const expectKw = (word, context) => {
    const tok = next();
    if (!KW(tok, word)) {
      if (tok && ABBREV[tok.v?.toUpperCase()]) fail(tok, `Rad ${tok.line}: skriv ${ABBREV[tok.v.toUpperCase()]} utskrivet, inte ${tok.v} — reserverade ord förkortas inte.`);
      fail(tok, `Rad ${tok?.line ?? lastLine()}: väntade ${word}${context ? ` ${context}` : ""}, fick ${describe(tok)}.`);
    }
    return tok;
  };
  const expectOp = (v, context) => {
    const tok = next();
    if (!OP(tok, v)) fail(tok, `Rad ${tok?.line ?? lastLine()}: väntade "${v}"${context ? ` ${context}` : ""}, fick ${describe(tok)}.`);
    return tok;
  };
  const ident = (what) => {
    const tok = next();
    if (tok?.t !== "id") fail(tok, `Rad ${tok?.line ?? lastLine()}: väntade ${what}, fick ${describe(tok)}.`);
    // dbo.Tabell → Tabell
    let name = tok.v;
    while (OP(peek(), ".") && peek(1)?.t === "id") { next(); name = next().v; }
    return { name, line: tok.line };
  };
  const columnList = (context) => {
    expectOp("(", context);
    const cols = [ident("ett kolumnnamn")];
    while (OP(peek(), ",")) { next(); cols.push(ident("ett kolumnnamn")); }
    expectOp(")", "efter kolumnlistan");
    return cols.map((c) => c.name);
  };
  const skipParens = () => {
    expectOp("(");
    let depth = 1;
    while (depth > 0) {
      const tok = next();
      if (!tok) fail(tok, `Rad ${lastLine()}: en parentes stängs aldrig.`);
      if (OP(tok, "(")) depth++;
      if (OP(tok, ")")) depth--;
    }
  };
  const references = () => {
    expectKw("REFERENCES");
    const target = ident("tabellen som refereras");
    let refCols = null;
    if (OP(peek(), "(")) refCols = columnList("efter REFERENCES-tabellen");
    while (KW(peek(), "ON")) {
      next();
      if (!KW(peek(), "DELETE", "UPDATE")) fail(peek(), `Rad ${peek()?.line ?? lastLine()}: efter ON väntade DELETE eller UPDATE.`);
      next();
      if (KW(peek(), "CASCADE")) next();
      else if (KW(peek(), "NO")) { next(); expectKw("ACTION"); }
      else if (KW(peek(), "SET")) { next(); if (!KW(peek(), "NULL", "DEFAULT")) fail(peek(), `Rad ${peek()?.line ?? lastLine()}: SET NULL eller SET DEFAULT.`); next(); }
      else fail(peek(), `Rad ${peek()?.line ?? lastLine()}: väntade CASCADE, NO ACTION, SET NULL eller SET DEFAULT.`);
    }
    return { target: target.name, refCols };
  };

  const tables = [];

  function tableConstraint(table) {
    let tok = peek();
    if (KW(tok, "CONSTRAINT")) { next(); ident("ett constraintnamn"); tok = peek(); }
    if (KW(tok, "PRIMARY")) {
      next(); expectKw("KEY", "efter PRIMARY");
      if (KW(peek(), "CLUSTERED", "NONCLUSTERED")) next();
      const cols = columnList("efter PRIMARY KEY");
      if (table.pk) fail(tok, `Rad ${tok.line}: ${table.name} har redan en PRIMARY KEY — en tabell har bara en (en sammansatt nyckel skrivs PRIMARY KEY (a, b)).`);
      table.pk = { cols, line: tok.line };
      return;
    }
    if (KW(tok, "UNIQUE")) {
      next();
      if (KW(peek(), "CLUSTERED", "NONCLUSTERED")) next();
      table.uniques.push({ cols: columnList("efter UNIQUE"), line: tok.line });
      return;
    }
    if (KW(tok, "FOREIGN")) {
      next(); expectKw("KEY", "efter FOREIGN");
      const cols = columnList("efter FOREIGN KEY");
      const ref = references();
      table.fks.push({ cols, ...ref, line: tok.line });
      return;
    }
    if (KW(tok, "CHECK")) { next(); skipParens(); return; }
    if (tok && ABBREV[tok.v?.toUpperCase()]) fail(tok, `Rad ${tok.line}: skriv ${ABBREV[tok.v.toUpperCase()]} utskrivet, inte ${tok.v} — reserverade ord förkortas inte.`);
    fail(tok, `Rad ${tok?.line ?? lastLine()}: väntade PRIMARY KEY, UNIQUE, FOREIGN KEY eller CHECK efter CONSTRAINT-namnet, fick ${describe(tok)}.`);
  }

  function columnDef(table) {
    const nameTok = peek();
    if (nameTok?.t === "id" && ABBREV[nameTok.v.toUpperCase()] && OP(peek(1), "(")) {
      fail(nameTok, `Rad ${nameTok.line}: skriv ${ABBREV[nameTok.v.toUpperCase()]} utskrivet, inte ${nameTok.v} — reserverade ord förkortas inte.`);
    }
    const { name, line } = ident("ett kolumnnamn eller en constraint");
    const typeTok = next();
    if (typeTok?.t !== "id") fail(typeTok, `Rad ${typeTok?.line ?? lastLine()}: kolumnen ${name} saknar datatyp — skriv till exempel ${name} INTEGER.`);
    const col = { name, type: typeTok.v.toUpperCase(), notNull: false, identity: false, line };
    if (OP(peek(), "(") && !KW(typeTok, "IDENTITY")) skipParens();
    for (;;) {
      const tok = peek();
      if (!tok || OP(tok, ",") || OP(tok, ")")) break;
      if (KW(tok, "CONSTRAINT")) { next(); ident("ett constraintnamn"); continue; }
      if (KW(tok, "NOT")) { next(); expectKw("NULL", "efter NOT"); col.notNull = true; continue; }
      if (KW(tok, "NULL")) { next(); continue; }
      if (KW(tok, "IDENTITY")) {
        next();
        if (OP(peek(), "(")) {
          expectOp("(");
          if (peek()?.t !== "num") fail(peek(), `Rad ${tok.line}: IDENTITY skrivs IDENTITY(1,1) — startvärde och steg.`);
          next(); expectOp(",", "mellan IDENTITY:s startvärde och steg");
          if (peek()?.t !== "num") fail(peek(), `Rad ${tok.line}: IDENTITY skrivs IDENTITY(1,1) — startvärde och steg.`);
          next(); expectOp(")", "efter IDENTITY(1,1)");
        }
        col.identity = true;
        continue;
      }
      if (KW(tok, "PRIMARY")) {
        next(); expectKw("KEY", "efter PRIMARY");
        if (KW(peek(), "CLUSTERED", "NONCLUSTERED")) next();
        if (OP(peek(), "(")) fail(tok, `Rad ${tok.line}: kommatecken saknas efter kolumnen ${name} — en PRIMARY KEY med kolumnlista är en egen rad i tabellen och ska föregås av ",".`);
        if (table.pk) fail(tok, `Rad ${tok.line}: ${table.name} har redan en PRIMARY KEY — en sammansatt nyckel skrivs som tabellconstraint, PRIMARY KEY (a, b).`);
        table.pk = { cols: [name], line: tok.line };
        continue;
      }
      if (KW(tok, "UNIQUE")) {
        next();
        if (KW(peek(), "CLUSTERED", "NONCLUSTERED")) next();
        if (OP(peek(), "(")) fail(tok, `Rad ${tok.line}: kommatecken saknas efter kolumnen ${name} — UNIQUE med kolumnlista är en egen rad i tabellen och ska föregås av ",".`);
        table.uniques.push({ cols: [name], line: tok.line });
        continue;
      }
      if (KW(tok, "FOREIGN")) {
        next(); expectKw("KEY", "efter FOREIGN");
        if (OP(peek(), "(")) fail(tok, `Rad ${tok.line}: kommatecken saknas efter kolumnen ${name} — FOREIGN KEY (…) REFERENCES … är en egen rad i tabellen och ska föregås av ",".`);
        table.fks.push({ cols: [name], ...references(), line: tok.line });
        continue;
      }
      if (KW(tok, "REFERENCES")) { table.fks.push({ cols: [name], ...references(), line: tok.line }); continue; }
      if (KW(tok, "DEFAULT")) {
        next();
        if (OP(peek(), "(")) skipParens(); else next();
        continue;
      }
      if (KW(tok, "CHECK")) { next(); skipParens(); continue; }
      if (tok.t === "id" && ABBREV[tok.v.toUpperCase()]) fail(tok, `Rad ${tok.line}: skriv ${ABBREV[tok.v.toUpperCase()]} utskrivet, inte ${tok.v} — reserverade ord förkortas inte.`);
      fail(tok, `Rad ${tok.line}: kommatecken saknas, eller okänt ord ${describe(tok)} efter kolumnen ${name}.`);
    }
    if (table.columns.some((c) => fold(c.name) === fold(name))) fail(nameTok, `Rad ${line}: kolumnen ${name} står två gånger i ${table.name}.`);
    table.columns.push(col);
  }

  while (p < tokens.length) {
    if (OP(peek(), ";")) { next(); continue; }
    if (KW(peek(), "GO")) { next(); continue; }
    const start = peek();
    if (!KW(start, "CREATE")) fail(start, `Rad ${start.line}: väntade CREATE TABLE, fick ${describe(start)}. Svaret ska bara innehålla CREATE TABLE-satser.`);
    next();
    expectKw("TABLE", "efter CREATE");
    const { name, line } = ident("ett tabellnamn");
    if (tables.some((t) => fold(t.name) === fold(name))) fail(start, `Rad ${line}: tabellen ${name} skapas två gånger.`);
    const table = { name, line, columns: [], pk: null, uniques: [], fks: [] };
    expectOp("(", `efter CREATE TABLE ${name}`);
    for (;;) {
      const tok = peek();
      if (!tok) fail(tok, `Rad ${lastLine()}: parentesen efter CREATE TABLE ${name} stängs aldrig.`);
      if (KW(tok, "CONSTRAINT", "PRIMARY", "UNIQUE", "FOREIGN", "CHECK")) tableConstraint(table);
      else columnDef(table);
      if (OP(peek(), ",")) { next(); if (OP(peek(), ")")) fail(peek(), `Rad ${peek().line}: kommatecken före ")" — den sista raden i tabellen ska inte ha komma efter sig.`); continue; }
      if (OP(peek(), ")")) { next(); break; }
      fail(peek(), `Rad ${peek()?.line ?? lastLine()}: väntade "," eller ")" i ${name}, fick ${describe(peek())}.`);
    }
    if (OP(peek(), ";")) next();
    tables.push(table);
  }
  return tables;
}

// Kontroller som SQL Server gör när satsen körs: kolumner i constraints
// måste finnas, en FK har lika många kolumner på båda sidor, högst en
// IDENTITY per tabell.
function validate(tables) {
  const errors = [];
  for (const t of tables) {
    const has = (c) => t.columns.some((col) => fold(col.name) === fold(c));
    const check = (cols, line, what) => {
      for (const c of cols) if (!has(c)) errors.push({ line, message: `Rad ${line}: ${c} i ${what} finns inte bland kolumnerna i ${t.name}.` });
    };
    if (t.pk) check(t.pk.cols, t.pk.line, "PRIMARY KEY");
    for (const u of t.uniques) check(u.cols, u.line, "UNIQUE");
    for (const fk of t.fks) {
      check(fk.cols, fk.line, "FOREIGN KEY");
      if (fk.refCols && fk.refCols.length !== fk.cols.length) errors.push({ line: fk.line, message: `Rad ${fk.line}: FOREIGN KEY har ${fk.cols.length} kolumn(er) men REFERENCES ${fk.target} har ${fk.refCols.length}.` });
    }
    const ids = t.columns.filter((c) => c.identity);
    if (ids.length > 1) errors.push({ line: ids[1].line, message: `Rad ${ids[1].line}: ${t.name} har två IDENTITY-kolumner — SQL Server tillåter bara en per tabell.` });
  }
  return errors;
}

export function parseDdl(text) {
  const tokens = lex(text);
  try {
    const tables = parser(tokens);
    return { tables, errors: validate(tables) };
  } catch (err) {
    if (err instanceof SyntaxError_) return { tables: [], errors: [{ line: err.line, message: err.message }] };
    throw err;
  }
}

// ---------- Facit ----------
//
// Facit är strukturdata, inte SQL:
//   { name, aliases?, kind: "entity" | "weak" | "junction" | "multivalued",
//     surrogate?: "AID",                       // bara entity/weak
//     columns: [{ name, notNull? }],           // vanliga kolumner
//     fks: [{ name, to, notNull?, rel, tag }], // tag: "1:N", "svag entitet", "unär" …
//     pk?: ["BID", "CID"],                     // junction/multivalued; namn ur columns/fks
//     unique?: [["A1"], ["B1", "AID"]],
//     oneToOneUnique?: [{ cols: ["DID"], rel: "R3" }] } // 1:1: står i facit,
//       godtas utan (häftets uppgift 21 saknar den) men ger då en anmärkning

const SURR = "#surrogat";

function facitIndex(facit) {
  const byName = new Map();
  for (const t of facit) {
    byName.set(fold(t.name), t);
    for (const a of t.aliases ?? []) byName.set(fold(a), t);
  }
  return byName;
}

// Identitet för en facitkolumn: vanlig = namnet, FK = "→Mål", surrogat = SURR.
function facitIdentity(t, colName) {
  if (t.surrogate && fold(t.surrogate) === fold(colName)) return SURR;
  const fk = t.fks.find((f) => fold(f.name) === fold(colName));
  if (fk) return `→${fold(fk.to)}`;
  return fold(colName);
}

const sameMultiset = (a, b) => a.length === b.length && [...a].sort().join("|") === [...b].sort().join("|");
const setKey = (ids) => [...ids].sort().join("|");

// Kursens tentaform: utan constraintnamn, refererade tabeller först.
export function toDdl(facit) {
  const byFold = new Map(facit.map((t) => [fold(t.name), t]));
  const ordered = [];
  const seen = new Set();
  const visit = (t, stack = new Set()) => {
    if (seen.has(t.name) || stack.has(t.name)) return;
    stack.add(t.name);
    for (const fk of t.fks) {
      const target = byFold.get(fold(fk.to));
      if (target && target !== t) visit(target, stack);
    }
    seen.add(t.name);
    ordered.push(t);
  };
  facit.forEach((t) => visit(t));
  const surrogateOf = (name) => byFold.get(fold(name))?.surrogate ?? `${name}ID`;
  return ordered.map((t) => {
    const cols = [];
    if (t.surrogate) cols.push([t.surrogate, "INTEGER IDENTITY(1,1)"]);
    const plain = t.columns.map((c) => [c.name, `INTEGER${c.notNull ? " NOT NULL" : ""}`]);
    const keys = t.fks.map((f) => [f.name, `INTEGER${f.notNull ? " NOT NULL" : ""}`]);
    // Entiteter: egna kolumner först. Samband och flervärda: nycklarna först.
    cols.push(...(t.surrogate ? [...plain, ...keys] : [...keys, ...plain]));
    const width = Math.max(...cols.map(([n]) => n.length)) + 2;
    const rows = cols.map(([n, rest]) => `    ${n.padEnd(width)}${rest}`);
    rows.push(`    PRIMARY KEY (${(t.surrogate ? [t.surrogate] : t.pk).join(", ")})`);
    for (const u of [...(t.unique ?? []), ...(t.oneToOneUnique ?? []).map((x) => x.cols)]) rows.push(`    UNIQUE (${u.join(", ")})`);
    for (const f of t.fks) rows.push(`    FOREIGN KEY (${f.name}) REFERENCES ${f.to}(${surrogateOf(f.to)})`);
    return `CREATE TABLE ${t.name} (\n${rows.join(",\n")}\n);`;
  }).join("\n\n");
}

// ---------- Jämförelse ----------

const jaccard = (a, b) => {
  const A = new Set(a); const B = new Set(b);
  let inter = 0; for (const x of A) if (B.has(x)) inter++;
  const union = new Set([...A, ...B]).size;
  return union === 0 ? 0 : inter / union;
};

// Matcha svarets tabeller mot facits: namn och alias först, sedan bästa
// överlapp på vanliga kolumner och FK-mål (Jaccard ≥ 0,5).
function matchTables(answer, facit) {
  const index = facitIndex(facit);
  const pairs = new Map(); // facitTable -> answerTable
  const used = new Set();
  for (const a of answer) {
    const f = index.get(fold(a.name));
    if (f && !pairs.has(f)) { pairs.set(f, a); used.add(a); }
  }
  const label = (target) => {
    for (const [f, a] of pairs) if (fold(a.name) === fold(target)) return fold(f.name);
    return index.get(fold(target)) ? fold(index.get(fold(target)).name) : fold(target);
  };
  const sigA = (a) => [
    ...a.columns.filter((c) => !c.identity && !a.fks.some((fk) => fk.cols.some((x) => fold(x) === fold(c.name)))).map((c) => fold(c.name)),
    ...a.fks.map((fk) => `→${label(fk.target)}`),
  ];
  const sigF = (f) => [...f.columns.map((c) => fold(c.name)), ...f.fks.map((fk) => `→${fold(fk.to)}`)];
  let progress = true;
  while (progress) {
    progress = false;
    const candidates = [];
    for (const f of facit) {
      if (pairs.has(f)) continue;
      for (const a of answer) {
        if (used.has(a)) continue;
        const score = jaccard(sigF(f), sigA(a));
        if (score >= 0.5) candidates.push({ f, a, score });
      }
    }
    candidates.sort((x, y) => y.score - x.score);
    for (const c of candidates) {
      if (pairs.has(c.f) || used.has(c.a)) continue;
      pairs.set(c.f, c.a); used.add(c.a); progress = true;
    }
  }
  return { pairs, used, label };
}

const TAGS = {
  surrogat: "surrogat",
  natural: "naturlig nyckel",
  weak: "svag entitet",
  total: "total deltagande",
  oneN: "1:N",
  mn: "M:N",
  unary: "unär",
  multi: "flervärt",
};

function compareTable(f, a, ctx) {
  const problems = [];
  // kind: vad felet gäller (surrogat, pk, fk, unique, notnull, kolumn) —
  // används av tentaflikens poänguppskattning, inte av rättningen här.
  const addK = (kind, tag, text) => problems.push({ tag, text, kind });
  const notes = [];
  if (fold(a.name) !== fold(f.name) && !(f.aliases ?? []).some((x) => fold(x) === fold(a.name))) {
    notes.push(`Tabellen heter ${a.name} hos dig och ${f.name} i facit — samma sak.`);
  }
  const fkOfCol = (name) => a.fks.find((fk) => fk.cols.some((c) => fold(c) === fold(name)));
  const colOf = (name) => a.columns.find((c) => fold(c.name) === fold(name));
  const identityA = (name) => {
    const col = colOf(name);
    if (col?.identity) return SURR;
    const fk = fkOfCol(name);
    if (fk) return `→${ctx.label(fk.target)}`;
    return fold(name);
  };
  const isEntity = f.kind === "entity" || f.kind === "weak";
  const identityCols = a.columns.filter((c) => c.identity);
  const pkCols = a.pk?.cols ?? [];

  // 1. Surrogatnyckeln.
  if (isEntity) {
    if (identityCols.length === 0) {
      addK("surrogat", TAGS.surrogat, `Ingen surrogatnyckel: ${f.kind === "weak" ? "en svag entitet" : "en vanlig entitet"} ska ha en kolumn INTEGER IDENTITY(1,1) som PRIMARY KEY${pkCols.length ? ` — du har PRIMARY KEY (${pkCols.join(", ")})` : ""}.`);
    } else if (!a.pk) {
      addK("pk", TAGS.surrogat, `PRIMARY KEY saknas. IDENTITY gör inte ${identityCols[0].name} till primärnyckel — skriv PRIMARY KEY (${identityCols[0].name}).`);
    } else if (!(pkCols.length === 1 && fold(pkCols[0]) === fold(identityCols[0].name))) {
      addK("pk", TAGS.surrogat, `PRIMARY KEY ska vara surrogatnyckeln ${identityCols[0].name} ensam, du har (${pkCols.join(", ")}).`);
    }
  } else {
    if (identityCols.length) {
      addK("surrogat", TAGS.surrogat, `${identityCols[0].name} är IDENTITY, men en ${f.kind === "junction" ? "sambandstabell" : "tabell för ett flervärt attribut"} ska inte ha egen surrogatnyckel: primärnyckeln är ${f.kind === "junction" ? "de främmande nycklarna" : "ägarens främmande nyckel plus värdet"}.`);
    }
    const want = f.pk.map((c) => facitIdentity(f, c));
    const got = pkCols.map(identityA);
    if (!a.pk) addK("pk", f.kind === "junction" ? (f.fks.length === 2 && fold(f.fks[0].to) === fold(f.fks[1].to) ? TAGS.unary : TAGS.mn) : TAGS.multi, `PRIMARY KEY saknas — den ska vara (${f.pk.join(", ")}).`);
    else if (!sameMultiset(want, got)) {
      const tag = f.kind === "multivalued" ? TAGS.multi : f.fks.length === 2 && fold(f.fks[0].to) === fold(f.fks[1].to) ? TAGS.unary : TAGS.mn;
      addK("pk", tag, `PRIMARY KEY ska vara (${f.pk.join(", ")}), du har (${pkCols.join(", ")}).`);
    }
  }

  // 2. Vanliga kolumner.
  const plainA = a.columns.filter((c) => !c.identity && !fkOfCol(c.name));
  const wantPlain = f.columns.map((c) => fold(c.name));
  const missingFkTargets = new Set();
  // FK-mål räknas innan kolumnerna, så att en kolumn utan FOREIGN KEY kan förklaras.
  const fkTargetsF = f.fks.map((fk) => `→${fold(fk.to)}`);
  const fkTargetsA = a.fks.map((fk) => `→${ctx.label(fk.target)}`);
  for (const t of new Set(fkTargetsF)) {
    const want = fkTargetsF.filter((x) => x === t).length;
    const got = fkTargetsA.filter((x) => x === t).length;
    if (got < want) missingFkTargets.add(t);
  }
  const keyCols = new Set((f.unique ?? []).flat().map(fold));
  for (const c of f.columns) {
    if (plainA.some((x) => fold(x.name) === fold(c.name))) continue;
    const tag = f.kind === "multivalued" ? TAGS.multi : keyCols.has(fold(c.name)) ? (f.kind === "weak" && (f.unique ?? []).some((u) => u.length > 1 && u.some((x) => facitIdentity(f, x).startsWith("→")) && u.map(fold).includes(fold(c.name))) ? TAGS.weak : TAGS.natural) : f.kind === "junction" ? TAGS.mn : null;
    addK("kolumn", tag, `Kolumnen ${c.name} saknas.`);
  }
  for (const c of plainA) {
    if (wantPlain.includes(fold(c.name))) continue;
    const mv = ctx.multivalued.find((m) => fold(m.owner) === fold(f.name) && fold(m.attr) === fold(c.name));
    if (mv) { addK("kolumn", TAGS.multi, `${c.name} är flervärt (dubbel ellips) och ska vara en egen tabell ${mv.table} med (ägarens FK, ${mv.attr}) som PRIMARY KEY, inte en kolumn här.`); continue; }
    const looksFk = [...missingFkTargets].find((t) => fold(c.name).includes(t.slice(1)) || f.fks.some((fk) => fold(fk.name) === fold(c.name) && `→${fold(fk.to)}` === t));
    if (looksFk) { addK("fk", ctx.fkTag(f, looksFk), `${c.name} ser ut att vara främmande nyckeln mot ${ctx.realName(looksFk.slice(1))}, men saknar FOREIGN KEY (${c.name}) REFERENCES ${ctx.realName(looksFk.slice(1))}(…).`); continue; }
    addK("kolumn", ctx.isComposite(c.name) ? TAGS.natural : null, `Kolumnen ${c.name} finns inte i diagrammet${ctx.isComposite(c.name) ? " — det sammansatta attributet blir sina delar, inte en egen kolumn" : ""}.`);
  }

  // 3. Naturliga nycklar och svag entitets UNIQUE.
  const required = (f.unique ?? []).map((u) => ({ cols: u, key: setKey(u.map((c) => facitIdentity(f, c))) }));
  const optional = (f.oneToOneUnique ?? []).map((u) => setKey(u.cols.map((c) => facitIdentity(f, c))));
  const answerUniques = a.uniques.map((u) => ({ cols: u.cols, key: setKey(u.cols.map(identityA)) }));
  const pkKey = setKey(pkCols.map(identityA));
  for (const u of f.oneToOneUnique ?? []) {
    const key = setKey(u.cols.map((c) => facitIdentity(f, c)));
    if (answerUniques.some((x) => x.key === key)) continue;
    const fk = f.fks.find((x) => u.cols.some((c) => fold(c) === fold(x.name)));
    notes.push(`UNIQUE (${u.cols.join(", ")}) saknas i ${f.name}. ${u.rel} är 1:1: den främmande nyckeln ska också vara kandidatnyckel, annars kan flera ${f.name} peka på samma ${fk?.to ?? "rad"} och 1:1 bevaras inte. Det ger inget avdrag här, eftersom övningshäftets facit för uppgift 21 saknar den.`);
  }
  for (const u of required) {
    const isWeakKey = u.cols.some((c) => facitIdentity(f, c).startsWith("→"));
    if (!answerUniques.some((x) => x.key === u.key)) {
      if (isWeakKey) {
        const partial = u.cols.filter((c) => !facitIdentity(f, c).startsWith("→"));
        const alone = answerUniques.find((x) => x.key === setKey(partial.map(fold)));
        addK("unique", TAGS.weak, alone
          ? `UNIQUE (${alone.cols.join(", ")}) ensam är för strängt: den partiella nyckeln är unik bara inom ägaren. Skriv UNIQUE (${u.cols.join(", ")}) — partiell nyckel plus ägarens främmande nyckel.`
          : `UNIQUE (${u.cols.join(", ")}) saknas: den partiella nyckeln är unik bara tillsammans med ägarens främmande nyckel.`);
      } else if (u.cols.length > 1 && u.cols.every((c) => answerUniques.some((x) => x.key === fold(c)))) {
        addK("unique", TAGS.natural, `UNIQUE på ${u.cols.join(" och ")} var för sig är för strängt: identifieraren är kombinationen, UNIQUE (${u.cols.join(", ")}).`);
      } else if (pkKey === u.key && isEntity) {
        // Redan rapporterat under surrogat (naturlig nyckel som PRIMARY KEY).
      } else {
        addK("unique", TAGS.natural, `UNIQUE (${u.cols.join(", ")}) saknas: identifieraren i diagrammet ska vara både NOT NULL och UNIQUE när surrogatnyckeln tagit primärnyckelrollen.`);
      }
    }
    for (const c of u.cols) {
      if (facitIdentity(f, c).startsWith("→")) continue;
      const col = colOf(c);
      const inPk = pkCols.some((x) => fold(x) === fold(c));
      if (col && !col.notNull && !inPk) addK("notnull", isWeakKey ? TAGS.weak : TAGS.natural, `${col.name} ingår i ${isWeakKey ? "den partiella nyckeln" : "identifieraren"} och ska vara NOT NULL — UNIQUE släpper igenom NULL.`);
    }
  }
  const reportedSplit = new Set(required.filter((u) => u.cols.length > 1).flatMap((u) => u.cols.map(fold)));
  for (const x of answerUniques) {
    if (required.some((u) => u.key === x.key) || optional.includes(x.key) || x.key === pkKey) continue;
    if (x.cols.length === 1 && reportedSplit.has(x.key)) continue;
    // Kolumner som inte ska finnas alls är redan rapporterade ovan.
    if (x.cols.some((c) => !colOf(c) || (!fkOfCol(c) && !colOf(c).identity && !wantPlain.includes(fold(c))))) continue;
    if (required.some((u) => u.cols.some((c) => facitIdentity(f, c).startsWith("→")) && x.key === setKey(u.cols.filter((c) => !facitIdentity(f, c).startsWith("→")).map(fold)))) continue;
    addK("unique", TAGS.natural, `UNIQUE (${x.cols.join(", ")}) har inget stöd i diagrammet — bara identifierare (understrukna) blir UNIQUE.`);
  }

  // 4. Främmande nycklar: mål, antal, NOT NULL och vad de refererar.
  for (const t of new Set([...fkTargetsF, ...fkTargetsA])) {
    const want = f.fks.filter((fk) => `→${fold(fk.to)}` === t);
    const got = a.fks.filter((fk) => `→${ctx.label(fk.target)}` === t);
    const name = ctx.realName(t.slice(1));
    if (got.length < want.length) {
      const fk = want[got.length];
      addK("fk", fk.tag ?? TAGS.oneN, `Främmande nyckel mot ${name} saknas${fk.rel ? ` (${fk.rel})` : ""}.`);
      continue;
    }
    if (got.length > want.length) {
      const reversed = ctx.facitTable(t.slice(1))?.fks.some((fk) => fold(fk.to) === fold(f.name));
      addK("fk", TAGS.oneN, reversed
        ? `Främmande nyckeln mot ${name} sitter på fel sida: i facit pekar ${name} på ${f.name}, inte tvärtom. I 1:N läggs ett-sidans nyckel i många-sidans tabell.`
        : `Främmande nyckel mot ${name} hör inte hemma i ${f.name}.`);
      continue;
    }
    if (isEntity && want.length === 1) {
      const fk = want[0];
      const col = colOf(got[0].cols[0]);
      if (fk.notNull && col && !col.notNull) addK("notnull", TAGS.total, `${col.name} ska vara NOT NULL: dubbel linje${fk.rel ? ` vid ${f.name} i ${fk.rel}` : ""} betyder totalt deltagande — varje rad måste ha en ${name}.`);
      if (!fk.notNull && col?.notNull) addK("notnull", TAGS.total, `${col.name} ska få vara NULL: enkel linje${fk.rel ? ` vid ${f.name} i ${fk.rel}` : ""} betyder partiellt deltagande.`);
    }
    for (const g of got) {
      const target = ctx.answerTable(g.target);
      const targetPk = target?.pk?.cols ?? null;
      if (g.refCols && targetPk && !sameMultiset(g.refCols.map(fold), targetPk.map(fold))) {
        addK("fk", TAGS.surrogat, `REFERENCES ${g.target}(${g.refCols.join(", ")}) ska peka på ${g.target}:s primärnyckel (${targetPk.join(", ")}), surrogatnyckeln — inte på den naturliga nyckeln.`);
      }
    }
  }

  return { name: f.name, answerName: a.name, status: problems.length ? "diff" : "ok", problems, notes, rule: ctx.rules?.[fold(f.name)] ?? null };
}

// Rätta en DDL-text mot en uppgift: { facit, rules, folded }.
export function checkDdl(text, exercise) {
  const parsed = typeof text === "string" ? parseDdl(text) : text;
  if (parsed.errors.length) return { status: "parse-error", errors: parsed.errors, tables: [], extra: [], remarks: [] };
  const facit = exercise.facit;
  const { pairs, used, label } = matchTables(parsed.tables, facit);
  const index = facitIndex(facit);
  const answerByFold = new Map(parsed.tables.map((t) => [fold(t.name), t]));
  const ctx = {
    label,
    rules: exercise.rules,
    facitTable: (foldName) => index.get(foldName),
    realName: (foldName) => index.get(foldName)?.name ?? foldName,
    answerTable: (name) => {
      const direct = answerByFold.get(fold(name));
      if (direct) return direct;
      const f = index.get(fold(name));
      return f ? pairs.get(f) : null;
    },
    multivalued: facit.filter((t) => t.kind === "multivalued").map((t) => ({ table: t.name, owner: t.fks[0].to, attr: t.columns[0].name })),
    isComposite: (name) => (exercise.composites ?? []).some((c) => fold(c) === fold(name)),
    fkTag: (f, target) => f.fks.find((fk) => `→${fold(fk.to)}` === target)?.tag ?? TAGS.oneN,
  };
  const tables = facit.map((f) => {
    const a = pairs.get(f);
    if (!a) {
      const tag = f.kind === "junction" ? (f.fks.length === 2 && fold(f.fks[0].to) === fold(f.fks[1].to) ? TAGS.unary : TAGS.mn) : f.kind === "multivalued" ? TAGS.multi : f.kind === "weak" ? TAGS.weak : TAGS.surrogat;
      return { name: f.name, answerName: null, status: "missing", problems: [{ tag, text: `Tabellen ${f.name} saknas.`, kind: "tabell" }], notes: [], rule: exercise.rules?.[fold(f.name)] ?? null };
    }
    return compareTable(f, a, ctx);
  });
  const extra = parsed.tables.filter((t) => !used.has(t)).map((t) => {
    const folded = Object.entries(exercise.folded ?? {}).find(([rel]) => fold(rel) === fold(t.name));
    if (folded) return { name: t.name, tag: folded[1].tag, why: folded[1].why };
    return { name: t.name, tag: null, why: "Tabellen motsvarar ingen entitet, M:N-relation eller flervärt attribut i diagrammet." };
  });
  const remarks = tables.flatMap((t) => t.notes);
  const types = new Set(parsed.tables.flatMap((t) => t.columns.map((c) => c.type)).filter((x) => x !== "INT" && x !== "INTEGER"));
  if (types.size) remarks.push(`Uppgiften säger att alla kolumner är INTEGER; du har också ${[...types].join(", ")}. Datatypen rättas inte här.`);
  const okCount = tables.filter((t) => t.status === "ok").length;
  let status;
  if (okCount === tables.length && extra.length === 0) status = "correct";
  else if (okCount === 0) status = "wrong";
  else status = "partial";
  return { status, tables, extra, remarks, errors: [] };
}
