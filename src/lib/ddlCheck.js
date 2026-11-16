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
// skiftläge, understreck eller å/ä/ö. Tabell- och kolumnordning är fri; en
// FK mot en tabell längre ner ger bara ett tips om körordningen (validate).

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
//
// Parsern återhämtar sig från syntaxfel i stället för att avbryta, som en
// mänsklig rättare som drar lite för ett fel och rättar resten. Varje fel
// noteras med radnummer i `syntax`, och tolkningen fortsätter som om det
// saknade fanns:
// - en tabell utan ");" före nästa CREATE TABLE (eller före slutet) avslutas
//   där;
// - ett saknat kommatecken mellan två rader i tabellen sätts in;
// - en kolumnlista utan ")" (UNIQUE (A1, B1 och sedan nästa rad) stängs;
// - ";" för mycket eller på fel ställe i en tabell hoppas över;
// - stavfel och förkortningar i reserverade ord (CREAT, PK) läses som det
//   ord som avsågs.
// Annat som inte går att tolka hoppar parsern över fram till nästa rad i
// tabellen (nästa "," på samma nivå) eller nästa CREATE TABLE, och resten
// rättas.

class SyntaxError_ extends Error {
  constructor(line, message) { super(message); this.line = line; }
}

const KW = (tok, ...words) => tok?.t === "id" && !tok.quoted && words.includes(tok.v.toUpperCase());
const OP = (tok, v) => tok?.t === "op" && tok.v === v;
const ABBREV = { PK: "PRIMARY KEY", FK: "FOREIGN KEY", UQ: "UNIQUE", REF: "REFERENCES" };
const describe = (tok) => (tok ? (tok.t === "op" ? `"${tok.v}"` : tok.v) : "slutet av texten");

// Stavfel i reserverade ord (CREAT, CONSTRANT, REFERENCS): högst två
// bokstäver fel, så att svaret säger vilket ord som avsågs i stället för
// ett missvisande "kommatecken saknas".
function editDistance(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  return d[a.length][b.length];
}
function misspelled(tok, words, minLength = 1) {
  if (tok?.t !== "id" || tok.quoted) return null;
  const v = tok.v.toUpperCase();
  if (v.length < minLength || words.includes(v)) return null;
  return words.find((w) => editDistance(v, w) <= (w.length <= 4 ? 1 : 2)) ?? null;
}
const typoMessage = (tok, word) => `Rad ${tok.line}: ${tok.v} är felstavat — skriv ${word}.`;
const abbrevMessage = (tok) => `Rad ${tok.line}: skriv ${ABBREV[tok.v.toUpperCase()]} utskrivet, inte ${tok.v} — reserverade ord förkortas inte.`;
const CONSTRAINT_WORDS = ["CONSTRAINT", "PRIMARY", "FOREIGN", "UNIQUE"];
const COLUMN_WORDS = ["NOT", "NULL", "IDENTITY", "PRIMARY", "UNIQUE", "FOREIGN", "REFERENCES", "DEFAULT", "CONSTRAINT"];
// Ord som aldrig är ett kolumnnamn i svaret: de börjar inte en ny kolumn.
const RESERVED = new Set([...COLUMN_WORDS, "KEY", "CHECK", "CREATE", "TABLE", "ON", "GO", "CLUSTERED", "NONCLUSTERED"]);

function parser(tokens) {
  let p = 0;
  const syntax = [];
  // Raden har redan ett noterat fel som förklarar var den tar slut (en ")"
  // som saknas, eller något som hoppades över): då noteras inget saknat
  // kommatecken efter den.
  let quiet = false;
  const peek = (k = 0) => tokens[p + k];
  const next = () => tokens[p++];
  const prev = () => tokens[p - 1];
  const lastLine = () => tokens[tokens.length - 1]?.line ?? 1;
  const lineOf = (tok) => tok?.line ?? lastLine();
  const fail = (tok, message) => { throw new SyntaxError_(lineOf(tok), message); };
  const note = (line, message) => { syntax.push({ line, message, kind: "syntax" }); };
  // Stavfel och förkortningar noteras, och ordet läses sedan som det avsedda:
  // PK blir PRIMARY KEY (två ord), CREAT blir CREATE.
  const fix = (tok, word, message) => {
    note(tok.line, message);
    const [first, ...rest] = word.split(" ");
    tok.v = first;
    const at = tokens.indexOf(tok);
    tokens.splice(at + 1, 0, ...rest.map((v) => ({ t: "id", v, line: tok.line })));
  };
  const fixAbbrev = (tok) => fix(tok, ABBREV[tok.v.toUpperCase()], abbrevMessage(tok));
  const fixTypo = (tok, word) => fix(tok, word, typoMessage(tok, word));
  const isCreate = (k = 0) => KW(peek(k), "CREATE") || (misspelled(peek(k), ["CREATE"]) && (KW(peek(k + 1), "TABLE") || misspelled(peek(k + 1), ["TABLE"])));

  const expectKw = (word, context) => {
    const tok = peek();
    if (KW(tok, word)) return next();
    if (tok?.t === "id" && ABBREV[tok.v.toUpperCase()]?.startsWith(word)) { fixAbbrev(tok); return next(); }
    if (misspelled(tok, [word])) { fixTypo(tok, word); return next(); }
    return fail(tok, `Rad ${lineOf(tok)}: väntade ${word}${context ? ` ${context}` : ""}, fick ${describe(tok)}.`);
  };
  const ident = (what) => {
    const tok = next();
    if (tok?.t !== "id") fail(tok, `Rad ${tok?.line ?? lastLine()}: väntade ${what}, fick ${describe(tok)}.`);
    // dbo.Tabell → Tabell
    let name = tok.v;
    while (OP(peek(), ".") && peek(1)?.t === "id") { next(); name = next().v; }
    return { name, line: tok.line };
  };

  // Börjar en ny rad i tabellen vid peek(k)? En constraint med kolumnlista
  // (PRIMARY KEY (…), UNIQUE (…), FOREIGN KEY (…), CONSTRAINT namn …), eller
  // på en ny rad ett namn följt av en typ. Används för att se ett saknat
  // kommatecken, och var en rad som inte gick att tolka tar slut.
  function startsItem(k = 0) {
    const tok = peek(k);
    if (tok?.t !== "id") return false;
    const before = tokens[p + k - 1];
    const newLine = Boolean(before) && tok.line > before.line;
    if (KW(tok, "PRIMARY", "FOREIGN")) {
      let j = k + 1;
      if (KW(peek(j), "KEY")) j++;
      if (KW(peek(j), "CLUSTERED", "NONCLUSTERED")) j++;
      return OP(peek(j), "(");
    }
    if (KW(tok, "UNIQUE")) {
      let j = k + 1;
      if (KW(peek(j), "CLUSTERED", "NONCLUSTERED")) j++;
      return OP(peek(j), "(");
    }
    if (KW(tok, "CONSTRAINT")) return peek(k + 1)?.t === "id" && (KW(peek(k + 2), "CHECK") ? newLine : startsItem(k + 2));
    if (tok.quoted || RESERVED.has(tok.v.toUpperCase())) return false;
    const type = peek(k + 1);
    return newLine && type?.t === "id" && type.line === tok.line;
  }

  // Kolumnlistan i PRIMARY KEY, UNIQUE, FOREIGN KEY och REFERENCES. Saknas
  // ")" noteras det, och listan slutar där nästa rad i tabellen börjar.
  const columnList = (what) => {
    const open = peek();
    if (!OP(open, "(")) {
      if (open?.t === "id" && !RESERVED.has(open.v.toUpperCase())) {
        note(open.line, `Rad ${open.line}: kolumnlistan efter ${what} skrivs inom parentes — ${what} (${open.v}).`);
        return [next().v];
      }
      fail(open, `Rad ${lineOf(open)}: väntade "(" efter ${what}, fick ${describe(open)}.`);
    }
    next();
    const cols = [ident("ett kolumnnamn")];
    for (;;) {
      const tok = peek();
      if (OP(tok, ",") && !(peek(1) && peek(1).line > tok.line && (startsItem(1) || isCreate(1)))) {
        next();
        cols.push(ident("ett kolumnnamn"));
        continue;
      }
      if (OP(tok, ")")) { next(); break; }
      const last = prev();
      if (!tok || OP(tok, ",") || OP(tok, ";") || tok.line > last.line || KW(tok, ...COLUMN_WORDS, "ON")) {
        note(last.line, `Rad ${last.line}: ${what} (${cols.map((c) => c.name).join(", ")} saknar ")" — lägg till den efter ${cols[cols.length - 1].name}.`);
        if (!OP(tok, ",")) quiet = true;
        break;
      }
      fail(tok, `Rad ${tok.line}: väntade "," eller ")" i kolumnlistan efter ${what}, fick ${describe(tok)}.`);
    }
    return cols.map((c) => c.name);
  };
  const skipParens = () => {
    if (!OP(next(), "(")) fail(prev(), `Rad ${lineOf(prev())}: väntade "(".`);
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
    if (OP(peek(), "(")) refCols = columnList(`REFERENCES ${target.name}`);
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
  const setPk = (table, cols, tok) => {
    if (table.pk) note(tok.line, `Rad ${tok.line}: ${table.name} har redan en PRIMARY KEY — en tabell har bara en (en sammansatt nyckel skrivs PRIMARY KEY (a, b)).`);
    else table.pk = { cols, line: tok.line };
  };

  // Första ordet i en rad i tabellen: PK (…) och stavfel i ett constraintord
  // rättas, när ordet efter visar att en constraint avsågs (PRIMRY KEY,
  // UNIQE (…), CONSTRANT namn PRIMARY …).
  function fixItemStart() {
    const tok = peek();
    if (tok?.t !== "id" || tok.quoted) return;
    const up = tok.v.toUpperCase();
    if (["PK", "FK", "UQ"].includes(up) && OP(peek(1), "(")) { fixAbbrev(tok); return; }
    const meant = misspelled(tok, CONSTRAINT_WORDS, 5);
    if (!meant) return;
    const after = peek(1);
    const isConstraintWord = (t) => KW(t, "PRIMARY", "UNIQUE", "FOREIGN", "CHECK") || misspelled(t, ["PRIMARY", "UNIQUE", "FOREIGN", "CHECK"]) || (t?.t === "id" && ["PK", "FK", "UQ"].includes(t.v.toUpperCase()));
    const confirmed = meant === "UNIQUE" ? OP(after, "(")
      : meant === "CONSTRAINT" ? after?.t === "id" && isConstraintWord(peek(2))
        : KW(after, "KEY") || Boolean(misspelled(after, ["KEY"]));
    if (confirmed) fixTypo(tok, meant);
  }

  function tableConstraint(table) {
    let tok = peek();
    if (KW(tok, "CONSTRAINT")) {
      next();
      ident("ett constraintnamn");
      tok = peek();
      if (tok?.t === "id" && !tok.quoted && ["PK", "FK", "UQ"].includes(tok.v.toUpperCase())) fixAbbrev(tok);
      else {
        const meant = misspelled(tok, ["PRIMARY", "UNIQUE", "FOREIGN", "CHECK"]);
        if (meant) fixTypo(tok, meant);
      }
    }
    if (KW(tok, "PRIMARY")) {
      next(); expectKw("KEY", "efter PRIMARY");
      if (KW(peek(), "CLUSTERED", "NONCLUSTERED")) next();
      setPk(table, columnList("PRIMARY KEY"), tok);
      return;
    }
    if (KW(tok, "UNIQUE")) {
      next();
      if (KW(peek(), "CLUSTERED", "NONCLUSTERED")) next();
      table.uniques.push({ cols: columnList("UNIQUE"), line: tok.line });
      return;
    }
    if (KW(tok, "FOREIGN")) {
      next(); expectKw("KEY", "efter FOREIGN");
      const cols = columnList("FOREIGN KEY");
      const ref = references();
      table.fks.push({ cols, ...ref, line: tok.line });
      return;
    }
    if (KW(tok, "CHECK")) { next(); skipParens(); return; }
    fail(tok, `Rad ${tok?.line ?? lastLine()}: väntade PRIMARY KEY, UNIQUE, FOREIGN KEY eller CHECK efter CONSTRAINT-namnet, fick ${describe(tok)}.`);
  }

  // En kolumn: namn, typ och det som står efter på samma rad. Returnerar
  // namnet, så att ett saknat kommatecken efter raden kan sägas vid namn.
  function columnDef(table) {
    const { name, line } = ident("ett kolumnnamn eller en constraint");
    const col = { name, type: "", notNull: false, identity: false, line };
    const typeTok = peek();
    if (typeTok?.t !== "id" || RESERVED.has(typeTok.v.toUpperCase())) {
      note(line, `Rad ${line}: kolumnen ${name} saknar datatyp — skriv till exempel ${name} INTEGER.`);
    } else {
      next();
      col.type = typeTok.v.toUpperCase();
      if (OP(peek(), "(")) skipParens();
    }
    for (;;) {
      let tok = peek();
      if (!tok || OP(tok, ",") || OP(tok, ")") || OP(tok, ";") || isCreate()) break;
      // Nästa rad i tabellen börjar utan kommatecken emellan: tabellen noterar det.
      if (startsItem()) break;
      if (tok.t === "id" && !tok.quoted && ABBREV[tok.v.toUpperCase()]) fixAbbrev(tok);
      else {
        const word = misspelled(tok, COLUMN_WORDS, 3);
        if (word) fixTypo(tok, word);
      }
      tok = peek();
      if (startsItem()) break;
      if (KW(tok, "CONSTRAINT")) { next(); ident("ett constraintnamn"); continue; }
      if (KW(tok, "NOT")) { next(); expectKw("NULL", "efter NOT"); col.notNull = true; continue; }
      if (KW(tok, "NULL")) { next(); continue; }
      if (KW(tok, "IDENTITY")) {
        next();
        if (OP(peek(), "(")) {
          next();
          if (peek()?.t !== "num") fail(peek(), `Rad ${tok.line}: IDENTITY skrivs IDENTITY(1,1) — startvärde och steg.`);
          next();
          if (!OP(next(), ",")) fail(prev(), `Rad ${tok.line}: IDENTITY skrivs IDENTITY(1,1) — startvärde och steg.`);
          if (peek()?.t !== "num") fail(peek(), `Rad ${tok.line}: IDENTITY skrivs IDENTITY(1,1) — startvärde och steg.`);
          next();
          if (OP(peek(), ")")) next();
          else note(tok.line, `Rad ${tok.line}: IDENTITY(1,1 saknar ")" — skriv IDENTITY(1,1).`);
        }
        col.identity = true;
        continue;
      }
      if (KW(tok, "PRIMARY")) {
        next(); expectKw("KEY", "efter PRIMARY");
        if (KW(peek(), "CLUSTERED", "NONCLUSTERED")) next();
        setPk(table, [name], tok);
        continue;
      }
      if (KW(tok, "UNIQUE")) {
        next();
        if (KW(peek(), "CLUSTERED", "NONCLUSTERED")) next();
        table.uniques.push({ cols: [name], line: tok.line });
        continue;
      }
      if (KW(tok, "FOREIGN")) {
        next(); expectKw("KEY", "efter FOREIGN");
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
      // Okänt efter en kolumn som redan gick att läsa: kolumnen behålls, och
      // resten av raden hoppas över.
      note(tok.line, `Rad ${tok.line}: kommatecken saknas, eller okänt ord ${describe(tok)} efter kolumnen ${name}.`);
      skipItem();
      quiet = true;
      break;
    }
    if (table.columns.some((c) => fold(c.name) === fold(name))) note(line, `Rad ${line}: kolumnen ${name} står två gånger i ${table.name}.`);
    else table.columns.push(col);
    return name;
  }

  // Hoppa över en rad i tabellen som inte gick att tolka: fram till nästa ","
  // eller tabellens ")" på samma nivå, nästa CREATE TABLE eller — när en
  // parentes aldrig stängs — nästa rad som börjar som en kolumn eller
  // constraint. Minst ett tecken hoppas alltid över.
  function skipItem() {
    const start = p;
    let depth = 0;
    while (p < tokens.length) {
      const tok = peek();
      if (isCreate()) break;
      if (p > start && depth > 0 && tok.line > prev().line && startsItem()) break;
      if (OP(tok, "(")) depth++;
      else if (OP(tok, ")")) { if (depth === 0) break; depth--; }
      else if ((OP(tok, ",") || OP(tok, ";")) && depth === 0) break;
      next();
    }
    if (p === start) next();
  }

  function createTable() {
    const start = peek();
    if (!KW(start, "CREATE")) {
      if (misspelled(start, ["CREATE"])) fixTypo(start, "CREATE");
      else fail(start, `Rad ${start.line}: väntade CREATE TABLE, fick ${describe(start)}. Svaret ska bara innehålla CREATE TABLE-satser.`);
    }
    next();
    expectKw("TABLE", "efter CREATE");
    const { name, line } = ident("ett tabellnamn");
    const table = { name, line, columns: [], pk: null, uniques: [], fks: [] };
    if (OP(peek(), "(")) next();
    else if (peek()?.t === "id" && !isCreate()) note(line, `Rad ${line}: "(" saknas efter CREATE TABLE ${name}.`);
    else fail(peek(), `Rad ${lineOf(peek())}: väntade "(" efter CREATE TABLE ${name}, fick ${describe(peek())}.`);
    const unclosed = () => {
      const last = prev();
      const at = peek();
      note(last.line, at
        ? `Rad ${last.line}: ${name} avslutas aldrig — lägg till ");" efter tabellens sista rad, före nästa CREATE TABLE (rad ${at.line}).`
        : `Rad ${last.line}: ${name} avslutas aldrig — lägg till ");" efter tabellens sista rad.`);
    };
    items: for (;;) {
      const tok = peek();
      if (!tok || isCreate()) { unclosed(); break; }
      if (OP(tok, ")")) { next(); break; }
      const itemStart = p;
      let colName = null;
      quiet = false;
      try {
        fixItemStart();
        if (KW(peek(), "CONSTRAINT", "PRIMARY", "UNIQUE", "FOREIGN", "CHECK")) tableConstraint(table);
        else colName = columnDef(table);
      } catch (err) {
        if (!(err instanceof SyntaxError_)) throw err;
        note(err.line, err.message);
        p = itemStart;
        skipItem();
        quiet = true;
      }
      // Det som står efter raden: "," före nästa rad eller ")" som avslutar tabellen.
      for (;;) {
        const s = peek();
        if (OP(s, ",")) {
          next();
          if (OP(peek(), ")")) {
            note(peek().line, `Rad ${peek().line}: kommatecken före ")" — den sista raden i tabellen ska inte ha komma efter sig.`);
            next();
            break items;
          }
          continue items;
        }
        if (OP(s, ")")) {
          if (OP(peek(1), ",")) { note(s.line, `Rad ${s.line}: ")" för mycket — den stänger ${name} mitt i tabellen.`); next(); continue; }
          next();
          break items;
        }
        if (OP(s, ";")) {
          const after = peek(1);
          if (OP(after, ")")) { note(s.line, `Rad ${s.line}: ";" för mycket före ")" — semikolonet står efter tabellens ")".`); next(); continue; }
          if (!after || isCreate(1)) { note(s.line, `Rad ${s.line}: ")" saknas före ";" — ${name} avslutas med ");".`); next(); break items; }
          note(s.line, `Rad ${s.line}: ";" mitt i ${name} — raderna i en tabell skiljs åt med ",".`);
          next();
          continue items;
        }
        if (!s || isCreate()) continue items;
        if (startsItem()) {
          const last = prev();
          if (!quiet) note(last.line, colName
            ? `Rad ${last.line}: kommatecken saknas efter kolumnen ${colName} — varje rad i tabellen utom den sista slutar med ",".`
            : `Rad ${last.line}: kommatecken saknas efter raden — varje rad i tabellen utom den sista slutar med ",".`);
          continue items;
        }
        note(s.line, `Rad ${s.line}: väntade "," eller ")" i ${name}, fick ${describe(s)}.`);
        skipItem();
        quiet = true;
      }
    }
    if (OP(peek(), ";")) next();
    return table;
  }

  const tables = [];
  while (p < tokens.length) {
    if (OP(peek(), ";")) { next(); continue; }
    if (KW(peek(), "GO")) { next(); continue; }
    const stmtStart = p;
    try {
      const table = createTable();
      if (tables.some((t) => fold(t.name) === fold(table.name))) note(table.line, `Rad ${table.line}: tabellen ${table.name} skapas två gånger.`);
      else tables.push(table);
    } catch (err) {
      if (!(err instanceof SyntaxError_)) throw err;
      note(err.line, err.message);
      // Satsen gick inte att börja tolka: fortsätt vid nästa CREATE TABLE.
      if (p <= stmtStart) p = stmtStart + 1;
      while (p < tokens.length && !isCreate()) next();
    }
  }
  return { tables, syntax };
}

// Kontroller som SQL Server gör när satsen körs: kolumner i constraints
// måste finnas, REFERENCES pekar på kolumner som finns i måltabellen, en
// FK har lika många kolumner på båda sidor, högst en IDENTITY per tabell.
// De tre sista räknas som syntaxfel (kind "syntax"): koden går inte att
// köra, men resten rättas. REFERENCES mot en kolumn som inte finns har ett
// eget avdrag (kind "referens").
//
// Tabellordningen bedöms inte: övningshäftets egna facit (18–20) står i en
// ordning som inte går att köra, och tentan rättar inte ordningen. En FK mot
// en tabell längre ner blir ett tips (`tips`), aldrig ett fel. Rättaren kör
// aldrig koden, så ordningen läses här (SQLite stoppar den inte heller).
function validate(tables) {
  const errors = [];
  const tips = [];
  const indexOf = (name) => tables.findIndex((t) => fold(t.name) === fold(name));
  tables.forEach((t, i) => {
    for (const fk of t.fks) {
      const j = indexOf(fk.target);
      const target = tables[j];
      // Två tabeller som pekar på varandra (C och D i uppsamlingens uppgift 2)
      // går inte att skapa i någon ordning; ett tips om att flytta den ena
      // vore fel, så paret får ett eget tips.
      const mutual = target && target !== t && target.fks.some((x) => fold(x.target) === fold(t.name));
      if (mutual && j > i) tips.push(`Tips: ${t.name} och ${target.name} pekar på varandra, så det finns ingen ordning där båda kan skapas med bara CREATE TABLE. På tentan bedöms inte ordningen.`);
      else if (j > i) tips.push(`Tips: om du kör koden i SQL Server måste ${target.name} skapas före ${t.name}, eftersom ${t.name} pekar på ${target.name}. På tentan bedöms inte ordningen.`);
      if (target && fk.refCols) {
        for (const c of fk.refCols) {
          if (!target.columns.some((col) => fold(col.name) === fold(c))) {
            errors.push({ kind: "referens", line: fk.line, message: `Rad ${fk.line}: REFERENCES ${target.name}(${c}) pekar på en kolumn som inte finns — ${target.name} har ${target.columns.map((col) => col.name).join(", ")}.` });
          }
        }
      }
    }
  });
  for (const t of tables) {
    const has = (c) => t.columns.some((col) => fold(col.name) === fold(c));
    const check = (cols, line, what) => {
      for (const c of cols) if (!has(c)) errors.push({ kind: "syntax", line, message: `Rad ${line}: ${c} i ${what} finns inte bland kolumnerna i ${t.name}.` });
    };
    if (t.pk) check(t.pk.cols, t.pk.line, "PRIMARY KEY");
    for (const u of t.uniques) check(u.cols, u.line, "UNIQUE");
    for (const fk of t.fks) {
      check(fk.cols, fk.line, "FOREIGN KEY");
      if (fk.refCols && fk.refCols.length !== fk.cols.length) errors.push({ kind: "syntax", line: fk.line, message: `Rad ${fk.line}: FOREIGN KEY har ${fk.cols.length} kolumn(er) men REFERENCES ${fk.target} har ${fk.refCols.length}.` });
    }
    const ids = t.columns.filter((c) => c.identity);
    if (ids.length > 1) errors.push({ kind: "syntax", line: ids[1].line, message: `Rad ${ids[1].line}: ${t.name} har två IDENTITY-kolumner — SQL Server tillåter bara en per tabell.` });
  }
  return { errors, tips: [...new Set(tips)] };
}

// errors: syntaxfel och fel som SQL Server stoppar på (kind "syntax"),
// sorterade på rad, och REFERENCES mot en kolumn som inte finns (kind
// "referens"). Tabellerna är allt som gick att tolka.
export function parseDdl(text) {
  const { tables, syntax } = parser(lex(text));
  const checked = validate(tables);
  const errors = [...syntax, ...checked.errors].sort((a, b) => (a.line ?? 0) - (b.line ?? 0));
  return { tables, errors, tips: checked.tips };
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

export const NOTHING_PARSED = "Inget i svaret gick att tolka som en CREATE TABLE-sats med kolumner.";

// Rätta en DDL-text mot en uppgift: { facit, rules, folded }.
//
// Syntaxfel stoppar inte rättningen: allt som gick att tolka rättas, och
// felen kommer tillbaka i `syntax` (ett per fel, med radnummer) så att
// Tenta kan dra en liten poäng för dem. Referensfel (REFERENCES till en
// kolumn som inte finns) står i `errors` med eget avdrag. Bara när ingen
// tabell med kolumner gick att läsa blir det "parse-error", med en
// sammanfattning först i `errors`.
export function checkDdl(text, exercise) {
  const parsed = typeof text === "string" ? parseDdl(text) : text;
  const syntax = parsed.errors.filter((e) => e.kind !== "referens");
  if (!parsed.tables.some((t) => t.columns.length)) {
    return { status: "parse-error", errors: [{ line: null, message: NOTHING_PARSED }, ...parsed.errors], syntax, tables: [], extra: [], remarks: [], tips: [] };
  }
  const refErrors = parsed.errors.filter((e) => e.kind === "referens");
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
  const types = new Set(parsed.tables.flatMap((t) => t.columns.map((c) => c.type)).filter((x) => x && x !== "INT" && x !== "INTEGER"));
  if (types.size) remarks.push(`Uppgiften säger att alla kolumner är INTEGER; du har också ${[...types].join(", ")}. Datatypen rättas inte här.`);
  const okCount = tables.filter((t) => t.status === "ok").length;
  let status;
  if (okCount === tables.length && extra.length === 0) status = refErrors.length || syntax.length ? "partial" : "correct";
  else if (okCount === 0) status = "wrong";
  else status = "partial";
  return { status, tables, extra, remarks, errors: refErrors, syntax, tips: parsed.tips ?? [] };
}
