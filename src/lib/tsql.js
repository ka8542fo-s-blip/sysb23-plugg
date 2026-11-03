// T-SQL först. Kursen (och tentan) kör Microsoft SQL Server / Azure SQL,
// medan motorn i webbläsaren är SQLite. Den som pluggar ska bara behöva
// kunna kursens dialekt, så allt som körs går genom två steg:
//
//   1. checkTsqlRules — säger nej där SQL Server säger nej men SQLite är
//      slapp (GROUP BY, alias i WHERE, LIMIT, JOIN utan ON och mer), med SQL
//      Servers eget felmeddelande. Det som beror på raderna prövas mot
//      tabellerna: checkScalarSubqueries, checkDivisionByZero och
//      checkIdentityInsert.
//   2. toSqlite — skriver om de syntaxskillnader kursen berör (TOP, ISNULL,
//      SUBSTRING, LEN, GETDATE, + för text, IDENTITY, [hakparenteser],
//      TRUNCATE, GO, SET ROWCOUNT) och annat giltigt T-SQL (ALL/ANY, CONVERT,
//      N'text', dbo.Tabell, parenteser kring mängdoperatorer) precis innan
//      frågan når motorn.
//
// Seeden skrivs i T-SQL-form och översätts vid start; textkolumner får då
// COLLATE NOCASE så att = och ORDER BY är skiftlägesokänsliga som i SQL
// Servers standardcollation. Strängliteraler och kommentarer rörs aldrig.

import { hospitalSchema } from "../data/databaser/hospitalSchema.js";

const TEXT_TYPE = /^(N?VARCHAR|N?CHAR|TEXT)\b/i;
const NUMBER_TYPE = /^((BIG|SMALL|TINY)?INT|INTEGER|BIT|DEC|DECIMAL|NUMERIC|MONEY|SMALLMONEY|FLOAT|REAL)\b/i;
// Tentans tabeller (Student, Course och HasStudied) står inte i seeden. Samma
// kolumner som i data/databaser/oldExams.js; sql-server-rules.test.mjs håller dem lika.
const EXAM_COLUMNS = [
  ["StudentNo", "VARCHAR(10)"], ["Name", "VARCHAR(50)"], ["Age", "INT"], ["Address", "VARCHAR(50)"],
  ["Code", "VARCHAR(10)"], ["Credits", "INT"], ["Grade", "INT"],
];
const KNOWN_COLUMNS = [
  ...hospitalSchema.flatMap((table) => table.columns.map((column) => [column.name, column.type])),
  ...EXAM_COLUMNS,
];
const columnsOfType = (type) => new Set(KNOWN_COLUMNS.filter(([, declared]) => type.test(declared)).map(([name]) => name.toLowerCase()));
const TEXT_COLUMNS = columnsOfType(TEXT_TYPE);
const NUMBER_COLUMNS = columnsOfType(NUMBER_TYPE);

const TEXT_FUNCTIONS = new Set([
  "lower", "upper", "substring", "substr", "concat", "ltrim", "rtrim", "trim",
  "replace", "left", "right", "str", "format", "reverse",
]);
const NUMBER_FUNCTIONS = new Set([
  "count", "count_big", "sum", "avg", "len", "datalength", "abs", "round", "ceiling", "floor", "power", "sqrt",
  "charindex", "datediff", "year", "month", "day", "row_number", "rank", "dense_rank",
]);
const RENAMES = { isnull: "IFNULL", substring: "SUBSTR", len: "LENGTH", count_big: "COUNT" };
const AGGREGATES = new Set(["count", "count_big", "sum", "avg", "min", "max", "total", "group_concat", "string_agg"]);
// Tabellernas kolumnnamn. Ett alias med samma namn som en kolumn pekar i WHERE
// och HAVING på kolumnen, inte på aliaset.
const COLUMN_NAMES = new Set(KNOWN_COLUMNS.map(([name]) => name.toLowerCase()));
const KEYWORDS = new Set([
  "case", "when", "then", "else", "end", "as", "and", "or", "not", "null", "is", "in",
  "like", "between", "distinct", "top", "asc", "desc", "exists", "all", "any", "some",
]);

// ── Tokenisering ─────────────────────────────────────────────────────────
export function tokenize(sql) {
  const tokens = [];
  let i = 0;
  while (i < sql.length) {
    const ch = sql[i];
    const next = sql[i + 1];
    const start = i;
    if (/\s/.test(ch)) {
      let j = i;
      while (j < sql.length && /\s/.test(sql[j])) j++;
      tokens.push({ type: "ws", text: sql.slice(i, j) });
      i = j;
    } else if (ch === "-" && next === "-") {
      let j = sql.indexOf("\n", i);
      if (j === -1) j = sql.length;
      tokens.push({ type: "comment", text: sql.slice(i, j) });
      i = j;
    } else if (ch === "/" && next === "*") {
      let j = sql.indexOf("*/", i + 2);
      j = j === -1 ? sql.length : j + 2;
      tokens.push({ type: "comment", text: sql.slice(i, j) });
      i = j;
    } else if (ch === "'") {
      let j = i + 1;
      while (j < sql.length) {
        if (sql[j] === "'") {
          if (sql[j + 1] === "'") {
            j += 2;
            continue;
          }
          break;
        }
        j++;
      }
      tokens.push({ type: "string", text: sql.slice(i, j + 1) });
      i = j + 1;
    } else if (ch === "[") {
      // T-SQL:s [identifierare] → standardens "identifierare".
      let j = sql.indexOf("]", i);
      if (j === -1) j = sql.length - 1;
      tokens.push({ type: "ident", text: `"${sql.slice(i + 1, j)}"` });
      i = j + 1;
    } else if (ch === '"') {
      let j = sql.indexOf('"', i + 1);
      if (j === -1) j = sql.length - 1;
      tokens.push({ type: "ident", text: sql.slice(i, j + 1) });
      i = j + 1;
    } else if (/[\p{L}_@#]/u.test(ch)) {
      let j = i;
      while (j < sql.length && /[\p{L}\p{N}_@#$.]/u.test(sql[j])) j++;
      tokens.push({ type: "ident", text: sql.slice(i, j) });
      i = j;
    } else if (/[0-9]/.test(ch)) {
      let j = i;
      while (j < sql.length && /[0-9.]/.test(sql[j])) j++;
      tokens.push({ type: "number", text: sql.slice(i, j) });
      i = j;
    } else {
      const two = sql.slice(i, i + 2);
      if (["<>", "!=", "<=", ">=", "||"].includes(two)) {
        tokens.push({ type: "op", text: two });
        i += 2;
      } else {
        tokens.push({ type: "op", text: ch });
        i += 1;
      }
    }
    // Var token står i texten, för den som ska peka ut en plats i frågan.
    Object.assign(tokens[tokens.length - 1], { start, end: i });
  }
  return tokens;
}

const isSig = (token) => token.type !== "ws" && token.type !== "comment";
const upper = (token) => (token?.type === "ident" ? token.text.toUpperCase() : null);
const isOp = (token, text) => token?.type === "op" && token.text === text;

function prevSig(tokens, i) {
  for (let j = i - 1; j >= 0; j--) if (isSig(tokens[j])) return j;
  return -1;
}
function nextSig(tokens, i) {
  for (let j = i + 1; j < tokens.length; j++) if (isSig(tokens[j])) return j;
  return -1;
}
function matchingOpen(tokens, closeIndex) {
  let depth = 0;
  for (let j = closeIndex; j >= 0; j--) {
    if (isOp(tokens[j], ")")) depth++;
    else if (isOp(tokens[j], "(")) {
      depth--;
      if (depth === 0) return j;
    }
  }
  return -1;
}
function matchingClose(tokens, openIndex) {
  let depth = 0;
  for (let j = openIndex; j < tokens.length; j++) {
    if (isOp(tokens[j], "(")) depth++;
    else if (isOp(tokens[j], ")")) {
      depth--;
      if (depth === 0) return j;
    }
  }
  return -1;
}

// Delar en tokenlista i satser vid ; på djup 0. GO räknas som separator.
function splitTokens(tokens) {
  const statements = [];
  let current = [];
  let depth = 0;
  for (const token of tokens) {
    if (isOp(token, "(")) depth++;
    if (isOp(token, ")")) depth--;
    const isGo = token.type === "ident" && token.text.toUpperCase() === "GO" && depth === 0;
    if ((isOp(token, ";") && depth === 0) || isGo) {
      current.push({ type: "op", text: ";" });
      statements.push(current);
      current = [];
    } else {
      current.push(token);
    }
  }
  if (current.length) statements.push(current);
  return statements;
}

// ── Är operanden text? Avgör om + betyder sammanslagning ─────────────────
function callIsText(tokens, nameIndex) {
  const name = tokens[nameIndex].text.toLowerCase();
  if (TEXT_FUNCTIONS.has(name)) return true;
  if (name === "cast") {
    const open = nextSig(tokens, nameIndex);
    const close = matchingClose(tokens, open);
    for (let j = open; j < close; j++) {
      if (upper(tokens[j]) === "AS") {
        const type = tokens[nextSig(tokens, j)];
        return type ? TEXT_TYPE.test(type.text) : false;
      }
    }
  }
  return false;
}

function operandIsText(tokens, index, side) {
  const token = tokens[index];
  if (!token) return false;
  if (token.type === "string") return true;
  if (token.type === "number") return false;
  if (token.type === "ident") {
    const after = nextSig(tokens, index);
    if (side === "right" && isOp(tokens[after], "(")) return callIsText(tokens, index);
    const column = token.text.replace(/"/g, "").split(".").pop().toLowerCase();
    return TEXT_COLUMNS.has(column);
  }
  if (side === "left" && isOp(token, ")")) {
    const open = matchingOpen(tokens, index);
    const before = prevSig(tokens, open);
    if (before >= 0 && tokens[before].type === "ident" && !KEYWORDS.has(tokens[before].text.toLowerCase())) {
      return callIsText(tokens, before);
    }
    return operandIsText(tokens, nextSig(tokens, open), "right");
  }
  if (side === "right" && isOp(token, "(")) {
    return operandIsText(tokens, nextSig(tokens, index), "right");
  }
  return false;
}

// Är operanden säkert ett tal? Text och tal räknas ihop i SQL Server: '5' + 1 är 6.
function callIsNumber(tokens, nameIndex) {
  const name = tokens[nameIndex].text.toLowerCase();
  if (NUMBER_FUNCTIONS.has(name)) return true;
  if (name === "cast") {
    const open = nextSig(tokens, nameIndex);
    const close = matchingClose(tokens, open);
    for (let j = open; j < close; j++) {
      if (upper(tokens[j]) === "AS") return NUMBER_TYPE.test(tokens[nextSig(tokens, j)]?.text ?? "");
    }
  }
  return false;
}

function operandIsNumber(tokens, index, side) {
  const token = tokens[index];
  if (!token || token.type === "string") return false;
  if (token.type === "number") return true;
  if (token.type === "ident") {
    if (side === "right" && isOp(tokens[nextSig(tokens, index)], "(")) return callIsNumber(tokens, index);
    return NUMBER_COLUMNS.has(token.text.replace(/"/g, "").split(".").pop().toLowerCase());
  }
  if (side === "left" && isOp(token, ")")) {
    const open = matchingOpen(tokens, index);
    const before = prevSig(tokens, open);
    if (before >= 0 && tokens[before].type === "ident" && !KEYWORDS.has(tokens[before].text.toLowerCase())) {
      return callIsNumber(tokens, before);
    }
    return operandIsNumber(tokens, nextSig(tokens, open), "right");
  }
  if (side === "right" && isOp(token, "(")) return operandIsNumber(tokens, nextSig(tokens, index), "right");
  return false;
}

// ── Giltig T-SQL som SQLite inte kan ────────────────────────────────────
const raw = (text) => ({ type: "raw", text });

// CONVERT(typ, värde) → CAST(värde AS typ).
function rewriteConvert(out) {
  for (let i = out.length - 1; i >= 0; i--) {
    if (upper(out[i]) !== "CONVERT") continue;
    const open = nextSig(out, i);
    const close = isOp(out[open], "(") ? matchingClose(out, open) : -1;
    if (close === -1) continue;
    const [type, value] = splitDepthZero(out.slice(open + 1, close), ",");
    if (value) out.splice(i, close - i + 1, raw("CAST("), ...value, raw(" AS "), ...type, raw(")"));
  }
}

// x > ALL (fråga) är x > största värdet, x < ANY (fråga) x < största, osv.;
// = ANY är IN och <> ALL är NOT IN. Underfrågan får ett eget namn på sin kolumn
// i en WITH, eftersom kolumnen kan vara ett uttryck. En tom underfråga ger här
// inget värde, medan ALL då är sant i SQL Server.
function rewriteQuantified(out) {
  for (let i = out.length - 1; i >= 0; i--) {
    const word = upper(out[i]);
    if (word !== "ALL" && word !== "ANY" && word !== "SOME") continue;
    const before = out[prevSig(out, i)];
    const open = nextSig(out, i);
    if (before?.type !== "op" || !isOp(out[open], "(") || upper(out[nextSig(out, open)]) !== "SELECT") continue;
    const close = matchingClose(out, open);
    if (close === -1) continue;
    const all = word === "ALL";
    const op = before.text;
    if (op === (all ? "<>" : "=") || (all && op === "!=")) {
      before.text = all ? "NOT IN" : "IN";
    } else if ([">", ">=", "<", "<="].includes(op)) {
      const largest = op.startsWith(">") === all;
      out[close] = raw(`) SELECT ${largest ? "MAX" : "MIN"}(kvantor) FROM kvantorer)`);
      out[open] = raw("(WITH kvantorer(kvantor) AS (");
    } else continue;
    out.splice(i, 1);
  }
}

// (fråga) EXCEPT (fråga): SQLite tar inga parenteser runt delarna, men de kan
// inte bara tas bort, eftersom de bestämmer ordningen vid flera operatorer.
function rewriteBracketedSets(out) {
  let depth = 0;
  for (let i = 0; i < out.length; i++) {
    if (isOp(out[i], "(")) {
      const before = upper(out[prevSig(out, i)]);
      const startsPart = prevSig(out, i) === -1 || ["UNION", "ALL", "EXCEPT", "INTERSECT"].includes(before);
      const close = depth === 0 && startsPart && upper(out[nextSig(out, i)]) === "SELECT" ? matchingClose(out, i) : -1;
      if (close !== -1) {
        out[i] = raw("SELECT * FROM (");
        out[close] = raw(")");
        continue;
      }
      depth++;
    }
    if (isOp(out[i], ")")) depth--;
  }
}

// ── Satsvisa omskrivningar ───────────────────────────────────────────────
function rewriteStatement(tokens, state) {
  const sig = tokens.filter(isSig);
  const first = upper(sig[0]);

  // SET ROWCOUNT n gäller nästa SELECT; själva satsen försvinner.
  if (first === "SET" && upper(sig[1]) === "ROWCOUNT" && sig[2]?.type === "number") {
    state.rowcount = Number(sig[2].text) || null;
    return [];
  }

  // DDL översätts på textnivå — enklare och robust nog för CREATE TABLE.
  if (first === "CREATE" && upper(sig[1]) === "TABLE") {
    return [{ type: "raw", text: toSqliteDdl(tokens.map((t) => t.text).join("")) }];
  }

  const out = tokens.map((token) => ({ ...token }));
  for (let i = out.length - 2; i >= 0; i--) {
    if (/^n$/i.test(out[i].text) && out[i].type === "ident" && out[i + 1].type === "string") out.splice(i, 1);
  }
  rewriteConvert(out);
  rewriteQuantified(out);
  rewriteBracketedSets(out);
  let limit = null;

  for (let i = 0; i < out.length; i++) {
    const token = out[i];
    if (token.type === "ident") {
      const name = token.text.toLowerCase();
      const after = nextSig(out, i);
      const isCall = isOp(out[after], "(");
      if (name.startsWith("dbo.")) token.text = token.text.slice(4);
      if (isCall && RENAMES[name]) token.text = RENAMES[name];
      else if (isCall && (name === "getdate" || name === "sysdatetime")) {
        const close = nextSig(out, after);
        if (isOp(out[close], ")")) {
          token.text = name === "getdate" ? "date" : "datetime";
          out[after].text = "('now'";
        }
      } else if (name === "truncate" && upper(out[after]) === "TABLE") {
        token.text = "DELETE";
        out[after].text = "FROM";
      }
    }
    // + slår ihop text, men text och tal räknas ihop: SQL Server gör om texten.
    if (isOp(token, "+")) {
      const left = prevSig(out, i);
      const right = nextSig(out, i);
      if ((operandIsText(out, left, "left") && !operandIsNumber(out, right, "right"))
        || (operandIsText(out, right, "right") && !operandIsNumber(out, left, "left"))) {
        token.text = "||";
      }
    }
  }

  // TOP n i en underfråga → LIMIT n före parentesen som stänger den.
  for (let i = out.length - 1; i >= 0; i--) {
    if (upper(out[i]) !== "TOP" || !["SELECT", "DISTINCT"].includes(upper(out[prevSig(out, i)]))) continue;
    let open = 0;
    let close = -1;
    for (let j = i + 1; j < out.length && close === -1; j++) {
      if (isOp(out[j], "(")) open++;
      else if (isOp(out[j], ")")) {
        if (open === 0) close = j;
        else open--;
      }
    }
    if (close === -1) continue;
    const a = nextSig(out, i);
    const bracketed = isOp(out[a], "(");
    const count = bracketed ? out[nextSig(out, a)] : out[a];
    if (count?.type !== "number") continue;
    out.splice(close, 0, { type: "ws", text: " " }, { type: "ident", text: "LIMIT" }, { type: "ws", text: " " }, { type: "number", text: count.text });
    let removeTo = bracketed ? nextSig(out, nextSig(out, a)) : a;
    if (out[removeTo + 1]?.type === "ws") removeTo++;
    out.splice(i, removeTo - i + 1);
  }

  // TOP n på djup 0 → LIMIT n sist i satsen.
  let depth = 0;
  for (let i = 0; i < out.length; i++) {
    const token = out[i];
    if (isOp(token, "(")) depth++;
    if (isOp(token, ")")) depth--;
    if (depth !== 0 || upper(token) !== "TOP") continue;
    const before = upper(out[prevSig(out, i)]);
    if (!["SELECT", "DISTINCT", "ALL"].includes(before)) continue;
    const a = nextSig(out, i);
    let end = a;
    let count = null;
    if (out[a]?.type === "number") count = out[a].text;
    else if (isOp(out[a], "(") && out[nextSig(out, a)]?.type === "number") {
      count = out[nextSig(out, a)].text;
      end = nextSig(out, nextSig(out, a));
    }
    if (count === null) continue;
    limit = count;
    // Ta bort TOP … och ett blanksteg efter.
    let removeTo = end;
    if (out[removeTo + 1]?.type === "ws") removeTo++;
    out.splice(i, removeTo - i + 1);
    break;
  }

  if (limit === null && state.rowcount && first === "SELECT") {
    limit = String(state.rowcount);
  }
  const hasLimit = depthZeroIndex(out, (t) => upper(t) === "LIMIT") !== -1;
  if (limit !== null && !hasLimit) {
    const semicolon = out.length && isOp(out[out.length - 1], ";") ? out.pop() : null;
    while (out.length && !isSig(out[out.length - 1])) out.pop();
    out.push({ type: "ws", text: " " }, { type: "ident", text: "LIMIT" }, { type: "ws", text: " " }, { type: "number", text: limit });
    if (semicolon) out.push(semicolon);
  }
  return out;
}

// CREATE TABLE i T-SQL-form → SQLite: IDENTITY blir AUTOINCREMENT (och den
// separata PK-constrainten på samma kolumn tas bort), textkolumner får
// COLLATE NOCASE som SQL Servers standardcollation.
export function toSqliteDdl(ddl) {
  let out = ddl;
  const identity = /(\w+)\s+INT(?:EGER)?\s+IDENTITY(?:\s*\(\s*\d+\s*,\s*\d+\s*\))?/gi;
  const columns = [];
  out = out.replace(identity, (_, name) => {
    columns.push(name);
    return `${name} INTEGER PRIMARY KEY AUTOINCREMENT`;
  });
  for (const name of columns) {
    const leading = new RegExp(`,\\s*CONSTRAINT\\s+\\w+\\s+PRIMARY\\s+KEY\\s*\\(\\s*${name}\\s*\\)`, "i");
    const trailing = new RegExp(`CONSTRAINT\\s+\\w+\\s+PRIMARY\\s+KEY\\s*\\(\\s*${name}\\s*\\)\\s*,`, "i");
    if (leading.test(out)) out = out.replace(leading, "");
    else out = out.replace(trailing, "");
    out = out.replace(/AUTOINCREMENT(\s+NOT\s+NULL)?\s+PRIMARY\s+KEY/i, "AUTOINCREMENT$1");
  }
  out = out.replace(/\b(N?VARCHAR|N?CHAR|TEXT)(\s*\(\s*(?:\d+|MAX)\s*\))?(?!\s*COLLATE)/gi, "$1$2 COLLATE NOCASE");
  return out;
}

export function toSqlite(sql) {
  const state = { rowcount: null };
  const statements = splitTokens(tokenize(sql));
  const pieces = statements.map((tokens) => rewriteStatement(tokens, state).map((t) => t.text).join(""));
  return pieces.join("");
}

// Seeden i T-SQL-form → körbar SQLite med främmande nycklar påslagna.
export function sqliteSeed(ddl) {
  return `PRAGMA foreign_keys = ON;\n${toSqlite(ddl)}`;
}

// ── SQL Server-stränghet ─────────────────────────────────────────────────
// SQLite släpper igenom mycket som SQL Server stoppar: kolumner utanför GROUP
// BY, alias i WHERE, LIMIT, IFNULL, JOIN utan ON. Det ska stoppas här också,
// med SQL Servers eget felmeddelande (`raw`) och klartext som pekar ut raden
// (`message`). Bara det säkra flaggas: en form som en regel inte känner igen
// släpps igenom, så att ett korrekt svar aldrig stoppas.
const COMPARISONS = new Set(["=", "<>", "!=", "<", ">", "<=", ">="]);
const SET_WORDS = new Set(["UNION", "EXCEPT", "INTERSECT"]);
const JOIN_WORDS = new Set(["JOIN", "INNER", "LEFT", "RIGHT", "FULL", "CROSS", "OUTER"]);
// SQL Servers reserverade ord. Ett syntaxfel vid ett av dem säger "near the keyword".
const RESERVED_WORDS = new Set([
  "ALL", "AND", "ANY", "AS", "ASC", "BETWEEN", "BY", "CASE", "CROSS", "DELETE", "DESC", "DISTINCT", "ELSE", "END",
  "EXCEPT", "EXISTS", "FROM", "FULL", "GROUP", "HAVING", "IN", "INNER", "INSERT", "INTERSECT", "INTO", "IS", "JOIN",
  "LEFT", "LIKE", "NOT", "NULL", "ON", "OPTION", "OR", "ORDER", "OUTER", "RIGHT", "SELECT", "SET", "SOME", "THEN",
  "TOP", "UNION", "UPDATE", "VALUES", "WHEN", "WHERE", "WITH",
]);

const isSubquery = (tokens, i) => isOp(tokens[i], "(") && upper(tokens[nextSig(tokens, i)]) === "SELECT";
const textOf = (tokens, start, end) => tokens.slice(start, end).map((token) => token.text).join("").trim();
const lowerName = (token) => (token?.type === "ident" ? token.text.replace(/"/g, "").toLowerCase() : null);

// Ett fel på en plats i frågan, i samma form som typkontrollen (tsqlTypes.js).
function problem(sql, first, last, raw, why) {
  const from = first.start ?? 0;
  const to = last?.end ?? first.end ?? from;
  const line = sql.slice(0, from).split("\n").length;
  const where = sql.slice(from, to).replace(/\s+/g, " ");
  const shown = where.length > 60 ? `${where.slice(0, 59)}…` : where;
  return { raw, line, at: from, message: `SQL Server skulle stoppa frågan på rad ${line} (${shown}): ${why}` };
}

// Ett syntaxfel pekar på stället där SQL Server slutade förstå frågan.
function syntaxError(token) {
  if (token.type === "ident" && RESERVED_WORDS.has(token.text.toUpperCase())) return `Incorrect syntax near the keyword '${token.text}'.`;
  const text = token.type === "string" ? token.text.slice(1, -1) : token.text.replace(/"/g, "");
  return `Incorrect syntax near '${text}'.`;
}

function depthZeroIndex(tokens, predicate, from = 0) {
  let depth = 0;
  for (let i = from; i < tokens.length; i++) {
    if (isOp(tokens[i], "(")) depth++;
    if (isOp(tokens[i], ")")) depth--;
    if (depth === 0 && predicate(tokens[i], i)) return i;
  }
  return -1;
}

function splitDepthZero(tokens, separator) {
  const parts = [];
  let current = [];
  let depth = 0;
  for (const token of tokens) {
    if (isOp(token, "(")) depth++;
    if (isOp(token, ")")) depth--;
    if (depth === 0 && isOp(token, separator)) {
      parts.push(current);
      current = [];
    } else current.push(token);
  }
  parts.push(current);
  return parts;
}

// ── En SELECT och dess satser ────────────────────────────────────────────
// Satserna är intervall [början, slut) av index i tokens. En underfråga slutar
// vid parentesen som stänger den, en del av en UNION vid mängdoperatorn.
function parseSelect(tokens, at, depth) {
  const marks = {};
  let end = tokens.length;
  let level = 0;
  for (let i = at + 1; i < tokens.length; i++) {
    const token = tokens[i];
    if (isOp(token, "(")) level++;
    else if (isOp(token, ")")) {
      if (level === 0) {
        end = i;
        break;
      }
      level--;
    } else if (level === 0) {
      const word = upper(token);
      if (isOp(token, ";") || SET_WORDS.has(word)) {
        end = i;
        break;
      }
      if (["INTO", "FROM", "WHERE", "HAVING", "OPTION"].includes(word)) marks[word] ??= i;
      else if ((word === "GROUP" || word === "ORDER") && upper(tokens[nextSig(tokens, i)]) === "BY") marks[word] ??= i;
    }
  }
  const positions = Object.values(marks);
  const range = (word) => {
    if (marks[word] === undefined) return null;
    const start = word === "GROUP" || word === "ORDER" ? nextSig(tokens, marks[word]) + 1 : marks[word] + 1;
    return [start, Math.min(...positions.filter((position) => position > marks[word]), end)];
  };
  // DISTINCT, ALL och TOP n står före kolumnerna.
  let listStart = at + 1;
  let distinct = false;
  let top = false;
  for (let guard = nextSig(tokens, at); guard !== -1 && guard < end; guard = nextSig(tokens, guard)) {
    const word = upper(tokens[guard]);
    if (word === "DISTINCT") distinct = true;
    else if (word === "TOP") {
      top = true;
      const count = nextSig(tokens, guard);
      guard = isOp(tokens[count], "(") ? matchingClose(tokens, count) : count;
      if (guard === -1) break;
      for (const option of ["PERCENT", "WITH", "TIES"]) {
        if (upper(tokens[nextSig(tokens, guard)]) === option) guard = nextSig(tokens, guard);
      }
    } else if (word !== "ALL") break;
    listStart = guard + 1;
  }
  return {
    at, end, depth, distinct, top,
    list: [listStart, Math.min(...positions, end)],
    from: range("FROM"),
    where: range("WHERE"),
    group: range("GROUP"),
    having: range("HAVING"),
    order: range("ORDER"),
    orderAt: marks.ORDER,
  };
}

function selectsOf(tokens) {
  const selects = [];
  let depth = 0;
  for (let i = 0; i < tokens.length; i++) {
    if (isOp(tokens[i], "(")) depth++;
    else if (isOp(tokens[i], ")")) depth--;
    else if (upper(tokens[i]) === "SELECT") selects.push(parseSelect(tokens, i, depth));
  }
  return selects;
}

// En del av en UNION, EXCEPT eller INTERSECT: ORDER BY gäller då hela frågan.
function isCompound(tokens, select) {
  const before = prevSig(tokens, select.at);
  const word = upper(tokens[before]);
  return SET_WORDS.has(upper(tokens[select.end]))
    || SET_WORDS.has(word)
    || (word === "ALL" && SET_WORDS.has(upper(tokens[prevSig(tokens, before)])));
}

function enclosingOpen(tokens, at) {
  let depth = 0;
  for (let j = at - 1; j >= 0; j--) {
    if (isOp(tokens[j], ")")) depth++;
    else if (isOp(tokens[j], "(")) {
      if (depth === 0) return j;
      depth--;
    }
  }
  return -1;
}

// Kolumnerna i SELECT, var och en med uttryck (expr) och eventuellt alias.
function selectItems(tokens, [start, end]) {
  const items = [];
  let from = start;
  let depth = 0;
  for (let i = start; i <= end; i++) {
    if (i === end || (depth === 0 && isOp(tokens[i], ","))) {
      items.push(selectItem(tokens, from, i));
      from = i + 1;
    } else if (isOp(tokens[i], "(")) depth++;
    else if (isOp(tokens[i], ")")) depth--;
  }
  return items;
}

const aliasText = (token) => (token?.type === "ident" || token?.type === "string" ? token.text.replace(/^["']|["']$/g, "") : null);

function selectItem(tokens, start, end) {
  const sig = [];
  for (let i = start; i < end; i++) if (isSig(tokens[i])) sig.push(i);
  const last = tokens[sig.at(-1)];
  const before = tokens[sig.at(-2)];
  const star = isOp(last, "*") && (sig.length === 1 || isOp(before, ".") || (before?.type === "ident" && before.text.endsWith(".")));
  const item = { start, end, expr: [start, end], alias: null, star };
  let depth = 0;
  for (const i of sig) {
    if (isOp(tokens[i], "(")) depth++;
    else if (isOp(tokens[i], ")")) depth--;
    else if (depth === 0 && upper(tokens[i]) === "AS") {
      return { ...item, expr: [start, i], alias: aliasText(tokens[nextSig(tokens, i)]) };
    }
  }
  // EmpName Namn och COUNT(*) Antal: aliaset utan AS.
  const lowerBefore = before?.type === "ident" ? before.text.toLowerCase() : null;
  const operandEnd = before?.type === "number" || before?.type === "string" || isOp(before, ")")
    || (lowerBefore !== null && (!KEYWORDS.has(lowerBefore) || lowerBefore === "end" || lowerBefore === "null"));
  if (sig.length >= 2 && last.type === "ident" && !KEYWORDS.has(last.text.toLowerCase()) && !last.text.endsWith(".") && operandEnd) {
    return { ...item, expr: [start, sig.at(-1)], alias: aliasText(last) };
  }
  return item;
}

// Namn som inte är kolumner: nyckelord, typer i CAST och CONVERT och datumdelar.
const NOT_COLUMNS = new Set([
  ...KEYWORDS, "escape", "collate", "by", "with", "ties", "percent", "over", "partition",
  "offset", "fetch", "next", "rows", "row", "only", "first",
]);
const TYPE_FIRST = new Set(["convert", "try_convert", "dateadd", "datediff", "datediff_big", "datepart", "datename", "datetrunc"]);

// Kolumnnamnen i ett intervall, utanför underfrågor. Med aggregates: true
// hoppas det över som står inuti COUNT(…), SUM(…) och de andra aggregaten.
function columnTokens(tokens, [start, end], { aggregates = true } = {}) {
  const found = [];
  for (let i = start; i < end; i++) {
    const token = tokens[i];
    if (isSubquery(tokens, i)) {
      i = matchingClose(tokens, i);
      if (i === -1) break;
      continue;
    }
    if (token.type !== "ident") continue;
    const name = lowerName(token);
    const after = nextSig(tokens, i);
    if (isOp(tokens[after], "(")) {
      const close = matchingClose(tokens, after);
      if (close === -1) break;
      if ((aggregates && AGGREGATES.has(name)) || name === "over") i = close;
      continue;
    }
    const before = tokens[prevSig(tokens, i)];
    if (NOT_COLUMNS.has(name) || /^[@#]/.test(name) || name.endsWith(".") || ["AS", "COLLATE"].includes(upper(before))) continue;
    if (isOp(before, "(") && TYPE_FIRST.has(lowerName(tokens[prevSig(tokens, prevSig(tokens, i))]))) continue;
    let last = i;
    let full = token.text.replace(/"/g, "");
    while (isOp(tokens[last + 1], ".") && tokens[last + 2]?.type === "ident") {
      full += `.${tokens[last + 2].text.replace(/"/g, "")}`;
      last += 2;
    }
    found.push({ index: i, last, name: full });
    i = last;
  }
  return found;
}

function columnRefs(tokens) {
  const refs = [];
  const sig = tokens.filter(isSig);
  // Alias sist ("EmpName AS Namn" eller "EmpName Namn") räknas inte som kolumn.
  let end = sig.length;
  const asIndex = sig.findIndex((t) => upper(t) === "AS");
  if (asIndex !== -1) end = asIndex;
  else if (sig.length >= 2 && sig[end - 1].type === "ident" && sig[end - 2].type !== "op") end -= 1;
  for (let i = 0; i < end; i++) {
    const token = sig[i];
    if (token.type !== "ident") continue;
    const lower = token.text.toLowerCase();
    if (KEYWORDS.has(lower)) continue;
    if (isOp(sig[i + 1], "(")) continue; // funktionsanrop
    if (lower.endsWith(".")) continue;    // "e." före *
    refs.push(token.text.replace(/"/g, ""));
  }
  return refs;
}

// Aggregat i den här frågan: en underfråga aggregerar för sig, och
// COUNT(*) OVER (...) är en fönsterfunktion, som inte grupperar.
function hasAggregate(tokens) {
  const sig = withoutSubqueries(tokens).filter(isSig);
  return sig.some((t, i) => {
    if (t.type !== "ident" || !AGGREGATES.has(t.text.toLowerCase()) || !isOp(sig[i + 1], "(")) return false;
    return upper(sig[matchingClose(sig, i + 1) + 1]) !== "OVER";
  });
}

function withoutSubqueries(tokens) {
  const kept = [];
  for (let i = 0; i < tokens.length; i++) {
    const close = isOp(tokens[i], "(") && upper(tokens[nextSig(tokens, i)]) === "SELECT" ? matchingClose(tokens, i) : -1;
    if (close === -1) kept.push(tokens[i]);
    else i = close;
  }
  return kept;
}

// ── Det övningsmotorn inte kan köra ──────────────────────────────────────
// Giltig T-SQL som motorn inte klarar: säg det, i stället för ett syntaxfel
// som låter som ett stavfel. raw är null, eftersom SQL Server kör frågan.
const UNSUPPORTED = [
  [/\bWITH TIES\b/, "TOP ... WITH TIES är giltig T-SQL, men övningsmotorn kan inte köra det. Skriv i stället frågan med en underfråga, till exempel WHERE Grade = (SELECT MAX(Grade) ...) eller HAVING COUNT(*) = (...)."],
  [/\b(CROSS|OUTER) APPLY\b/, "APPLY är giltig T-SQL, men övningsmotorn kan inte köra det, och det ingår inte i kursen. Skriv i stället frågan med JOIN eller en underfråga."],
];

function unsupportedSyntax(tokens) {
  const words = tokens.filter((token) => token.type === "ident").map((token) => token.text.toUpperCase()).join(" ");
  const hit = UNSUPPORTED.find(([pattern]) => pattern.test(words));
  return hit ? { raw: null, message: hit[1] } : null;
}

// SELECT Antal = COUNT(*): giltig T-SQL, men kursens alias skrivs med AS.
function equalsAliasError(items) {
  for (const item of items) {
    const sig = item.filter(isSig);
    if (sig[0]?.type === "ident" && isOp(sig[1], "=")) {
      return {
        raw: null,
        message: `Alias med = är giltig T-SQL, men övningsmotorn kan inte köra det och kursens form är AS. Skriv uttrycket först och sedan AS ${sig[0].text}.`,
      };
    }
  }
  return null;
}

// ── Syntax som bara SQLite förstår ───────────────────────────────────────
// == finns inte i T-SQL.
function doubleEquals(sql, tokens) {
  for (let i = 1; i < tokens.length; i++) {
    const [first, second] = [tokens[i - 1], tokens[i]];
    if (!isOp(first, "=") || !isOp(second, "=") || first.end !== second.start) continue;
    const left = tokens[prevSig(tokens, i - 1)];
    const right = tokens[nextSig(tokens, i)];
    const example = left && right && left.type !== "op" && right.type !== "op" ? `${left.text} = ${right.text}` : "x = 1";
    return problem(sql, first, second, "Incorrect syntax near '='.", `== finns inte i SQL. Likhet skrivs med ett enda =: ${example}.`);
  }
  return null;
}

// LIMIT n är SQLite. SQL Server skriver antalet med TOP direkt efter SELECT.
function limitClause(sql, tokens) {
  for (let i = 0; i < tokens.length; i++) {
    if (upper(tokens[i]) !== "LIMIT") continue;
    const count = nextSig(tokens, i);
    if (tokens[count]?.type !== "number") continue;
    // FROM Student LIMIT 3: SQL Server läser LIMIT som ett alias och fastnar på talet.
    const before = prevSig(tokens, i);
    const asAlias = tokens[before]?.type === "ident" && !RESERVED_WORDS.has(upper(tokens[before]))
      && ["FROM", "JOIN"].includes(upper(tokens[prevSig(tokens, before)]));
    return problem(sql, tokens[i], tokens[count], syntaxError(asAlias ? tokens[count] : tokens[i]),
      `LIMIT finns inte i SQL Server. Där skrivs antalet med TOP direkt efter SELECT: SELECT TOP ${tokens[count].text} … ORDER BY ….`);
  }
  return null;
}

// Funktioner som SQLite har men inte SQL Server. use: samma funktion med ett
// annat namn och samma argument; hint: vad SQL Server har i stället.
const SQLITE_FUNCTIONS = {
  ifnull: { use: "ISNULL" },
  substr: { use: "SUBSTRING" },
  length: { use: "LEN" },
  total: { use: "SUM" },
  ceil: { use: "CEILING" },
  pow: { use: "POWER" },
  ln: { use: "LOG" },
  group_concat: { hint: "STRING_AGG(kolumn, ', ')" },
  instr: { hint: "CHARINDEX(sökt, text), med argumenten i omvänd ordning" },
  printf: { hint: "FORMAT eller CONCAT" },
  strftime: { hint: "FORMAT eller DATEPART" },
  date: { hint: "GETDATE() eller CAST(… AS DATE)" },
  datetime: { hint: "GETDATE()" },
  time: { hint: "CAST(… AS TIME)" },
  julianday: { hint: "DATEDIFF" },
  unixepoch: { hint: "DATEDIFF" },
  random: { hint: "RAND() eller NEWID()" },
  log2: { hint: "LOG(x, 2)" },
  mod: { hint: "operatorn %, till exempel a % b" },
  trunc: { hint: "ROUND(x, 0, 1)" },
  glob: { hint: "LIKE" },
  octet_length: { hint: "DATALENGTH" },
  last_insert_rowid: { hint: "SCOPE_IDENTITY()" },
  typeof: {}, hex: {}, quote: {}, zeroblob: {}, randomblob: {}, likely: {}, unlikely: {}, likelihood: {},
  changes: {}, total_changes: {}, sqlite_version: {}, nth_value: {},
};
// Där ett namn följt av ( är en tabell eller en typ, inte ett anrop.
const NOT_A_CALL_AFTER = new Set([
  "INTO", "TABLE", "REFERENCES", "VIEW", "INDEX", "ON", "FROM", "JOIN", "UPDATE", "KEY", "AS", "PROCEDURE", "FUNCTION",
  "EXEC", "EXECUTE", "TYPE",
]);

function sqliteFunction(sql, tokens) {
  // I CREATE TABLE och DECLARE är TIME(7) och liknande typer.
  const [first, second] = tokens.filter(isSig).slice(0, 2).map(upper);
  if (((first === "CREATE" || first === "ALTER") && second === "TABLE") || first === "DECLARE") return null;
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const open = nextSig(tokens, i);
    if (token.type !== "ident" || !isOp(tokens[open], "(") || token.text.startsWith('"')) continue;
    const before = tokens[prevSig(tokens, i)];
    if (NOT_A_CALL_AFTER.has(upper(before)) || isOp(before, ".")) continue;
    if (isOp(before, "(") && TYPE_FIRST.has(lowerName(tokens[prevSig(tokens, prevSig(tokens, i))]))) continue;
    const name = token.text.toLowerCase();
    const close = matchingClose(tokens, open);
    if (close === -1) continue;
    const call = textOf(tokens, i, close + 1);
    if ((name === "max" || name === "min") && splitDepthZero(tokens.slice(open + 1, close), ",").length > 1) {
      return problem(sql, token, tokens[close], `The ${name} function requires 1 argument(s).`,
        `${token.text.toUpperCase()} tar ett enda argument i SQL Server och räknar över raderna. Det ${name === "max" ? "största" : "minsta"} av två värden skrivs med CASE: CASE WHEN a ${name === "max" ? ">" : "<"} b THEN a ELSE b END.`);
    }
    if (!Object.hasOwn(SQLITE_FUNCTIONS, name)) continue;
    const { use, hint } = SQLITE_FUNCTIONS[name];
    const advice = use
      ? `Där heter den ${use}: ${use}${call.slice(token.text.length)}.`
      : hint ? `Använd ${hint} i stället.` : "Det finns ingen motsvarighet i kursens SQL.";
    return problem(sql, token, tokens[close], `'${token.text}' is not a recognized built-in function name.`,
      `${token.text.toUpperCase()} finns i SQLite men inte i SQL Server. ${advice}`);
  }
  return null;
}

// Tabellen efter JOIN, med alias och tabelltips: indexet efter den.
function afterTable(tokens, join) {
  let i = nextSig(tokens, join);
  if (i === -1) return -1;
  if (isOp(tokens[i], "(")) i = matchingClose(tokens, i);
  else while (isOp(tokens[nextSig(tokens, i)], ".")) i = nextSig(tokens, nextSig(tokens, i));
  if (i === -1) return -1;
  let next = nextSig(tokens, i);
  const word = upper(tokens[next]);
  if (word === "AS") next = nextSig(tokens, nextSig(tokens, next));
  else if (tokens[next]?.type === "ident" && !RESERVED_WORDS.has(word) && !JOIN_WORDS.has(word)) next = nextSig(tokens, next);
  if (upper(tokens[next]) === "WITH" && isOp(tokens[nextSig(tokens, next)], "(")) {
    const close = matchingClose(tokens, nextSig(tokens, next));
    next = close === -1 ? -1 : nextSig(tokens, close);
  }
  return next;
}

// Varje JOIN utom CROSS JOIN kräver ON. SQLite gör om den till en kartesisk produkt.
function joinWithoutOn(sql, tokens, select) {
  const [start, end] = select.from;
  const joins = [];
  let ons = 0;
  for (let i = start; i < end; i++) {
    if (isSubquery(tokens, i)) {
      i = matchingClose(tokens, i);
      if (i === -1) return null;
      continue;
    }
    const word = upper(tokens[i]);
    if (word === "ON") ons++;
    else if (word === "JOIN" && upper(tokens[prevSig(tokens, i)]) !== "CROSS") joins.push(i);
  }
  if (joins.length <= ons) return null;
  // Den första JOIN utan ON pekas ut. SQL Server fastnar på ordet där ON skulle stått.
  const lacking = joins.find((join) => upper(tokens[afterTable(tokens, join)]) !== "ON") ?? joins.at(-1);
  const stop = joins.map((join) => afterTable(tokens, join)).find((next) => next !== -1 && next < end && !JOIN_WORDS.has(upper(tokens[next])) && upper(tokens[next]) !== "ON");
  const near = tokens[stop ?? end] ?? tokens[prevSig(tokens, end)];
  let phrase = lacking;
  while (["INNER", "LEFT", "RIGHT", "FULL", "OUTER"].includes(upper(tokens[prevSig(tokens, phrase)]))) phrase = prevSig(tokens, phrase);
  const after = afterTable(tokens, lacking);
  const tableEnd = after === -1 || after > end ? prevSig(tokens, end) : prevSig(tokens, after);
  const join = textOf(tokens, phrase, tableEnd + 1);
  return problem(sql, tokens[phrase], tokens[tableEnd], syntaxError(near),
    `${join} saknar ON. I SQL Server ska varje JOIN följas av ON och villkoret som kopplar ihop tabellerna: ${join} ON …. Ett villkor i WHERE räcker inte, och vill du ha alla kombinationer skriver du CROSS JOIN.`);
}

// En delfråga i FROM måste ha ett alias i SQL Server.
function derivedWithoutAlias(sql, tokens, select) {
  const [start, end] = select.from;
  let depth = 0;
  for (let i = start; i < end; i++) {
    if (isSubquery(tokens, i)) {
      const close = matchingClose(tokens, i);
      if (close === -1) return null;
      const before = upper(tokens[prevSig(tokens, i)]);
      if (depth === 0 && (["FROM", "JOIN", "APPLY"].includes(before) || isOp(tokens[prevSig(tokens, i)], ","))) {
        const next = nextSig(tokens, close);
        const word = upper(tokens[next]);
        const named = word === "AS" || (tokens[next]?.type === "ident" && !RESERVED_WORDS.has(word) && !JOIN_WORDS.has(word));
        if (!named) {
          return problem(sql, tokens[i], tokens[close], syntaxError(tokens[next] ?? tokens[close]),
            "delfrågan i FROM saknar namn. I SQL Server måste en delfråga i FROM få ett alias efter parentesen: (SELECT …) AS t.");
        }
      }
      i = close;
    } else if (isOp(tokens[i], "(")) depth++;
    else if (isOp(tokens[i], ")")) depth--;
  }
  return null;
}

// ── Villkor som inte är villkor ──────────────────────────────────────────
// WHERE Grade och HAVING COUNT(*): SQLite räknar allt utom 0 som sant, SQL
// Server kräver en jämförelse.
const PREDICATE_WORDS = new Set(["LIKE", "IN", "BETWEEN", "IS", "EXISTS"]);

// Delarna mellan AND och OR på översta nivån. AND i BETWEEN a AND b delar inte.
function logicalParts(tokens, start, end, words) {
  const parts = [];
  let from = start;
  let depth = 0;
  let cases = 0;
  let between = false;
  for (let i = start; i < end; i++) {
    const token = tokens[i];
    if (isOp(token, "(")) depth++;
    else if (isOp(token, ")")) depth--;
    else if (depth === 0) {
      const word = upper(token);
      if (word === "CASE") cases++;
      else if (word === "END" && cases > 0) cases--;
      else if (cases === 0 && word === "BETWEEN") between = true;
      else if (cases === 0 && word === "AND" && between) between = false;
      else if (cases === 0 && words.includes(word)) {
        parts.push([from, i]);
        from = i + 1;
      }
    }
  }
  parts.push([from, end]);
  return parts;
}

// Utan blanktecken, och utan NOT först.
function trimPart(tokens, [start, end], { not = false } = {}) {
  let a = start;
  let b = end;
  while (a < b && (!isSig(tokens[a]) || (not && upper(tokens[a]) === "NOT"))) a++;
  while (b > a && !isSig(tokens[b - 1])) b--;
  return [a, b];
}

function hasPredicate(tokens, start, end) {
  let depth = 0;
  let cases = 0;
  for (let i = start; i < end; i++) {
    const token = tokens[i];
    if (isOp(token, "(")) depth++;
    else if (isOp(token, ")")) depth--;
    else if (depth === 0) {
      const word = upper(token);
      if (word === "CASE") cases++;
      else if (word === "END" && cases > 0) cases--;
      else if (cases > 0) continue;
      else if (token.type === "op" && (COMPARISONS.has(token.text) || token.text === "!")) return true;
      else if (PREDICATE_WORDS.has(word)) return true;
      else if ((word === "CONTAINS" || word === "FREETEXT") && isOp(tokens[nextSig(tokens, i)], "(")) return true;
    }
  }
  return false;
}

function nonBoolean(tokens, start, end) {
  for (const part of logicalParts(tokens, start, end, ["AND", "OR"])) {
    const [a, b] = trimPart(tokens, part, { not: true });
    if (a >= b) continue;
    if (isOp(tokens[a], "(") && matchingClose(tokens, a) === b - 1) {
      if (isSubquery(tokens, a)) return [a, b];
      const inner = nonBoolean(tokens, a + 1, b - 1);
      if (inner) return inner;
    } else if (!hasPredicate(tokens, a, b)) return [a, b];
  }
  return null;
}

// Villkoren i en sats: WHERE, HAVING, ON, WHEN i ett CASE och WHERE i UPDATE och DELETE.
function conditionRanges(tokens, selects) {
  const ranges = [];
  for (const select of selects) {
    if (select.where) ranges.push(select.where);
    if (select.having) ranges.push(select.having);
    if (!select.from) continue;
    const [start, end] = select.from;
    let depth = 0;
    for (let i = start; i < end; i++) {
      if (isSubquery(tokens, i)) {
        i = matchingClose(tokens, i);
        if (i === -1) break;
      } else if (isOp(tokens[i], "(")) depth++;
      else if (isOp(tokens[i], ")")) depth--;
      else if (depth === 0 && upper(tokens[i]) === "ON") {
        let stop = i + 1;
        for (let level = 0; stop < end; stop++) {
          if (isOp(tokens[stop], "(")) level++;
          else if (isOp(tokens[stop], ")")) level--;
          else if (level === 0 && (JOIN_WORDS.has(upper(tokens[stop])) || upper(tokens[stop]) === "ON" || isOp(tokens[stop], ","))) break;
        }
        ranges.push([i + 1, stop]);
      }
    }
  }
  const first = upper(tokens.find(isSig));
  if (first === "UPDATE" || first === "DELETE") {
    const where = depthZeroIndex(tokens, (token) => upper(token) === "WHERE");
    if (where !== -1) {
      const stop = depthZeroIndex(tokens, (token) => isOp(token, ";") || upper(token) === "OPTION", where);
      ranges.push([where + 1, stop === -1 ? tokens.length : stop]);
    }
  }
  for (let i = 0; i < tokens.length; i++) {
    if (upper(tokens[i]) !== "CASE" || upper(tokens[nextSig(tokens, i)]) !== "WHEN") continue;
    let depth = 0;
    let cases = 0;
    let when = -1;
    for (let j = nextSig(tokens, i); j < tokens.length; j++) {
      if (isOp(tokens[j], "(")) depth++;
      else if (isOp(tokens[j], ")")) {
        if (depth === 0) break;
        depth--;
      } else if (depth === 0) {
        const word = upper(tokens[j]);
        if (word === "CASE") cases++;
        else if (word === "END") {
          if (cases === 0) break;
          cases--;
        } else if (cases === 0 && word === "WHEN") when = j;
        else if (cases === 0 && word === "THEN" && when !== -1) {
          ranges.push([when + 1, j]);
          when = -1;
        }
      }
    }
  }
  return ranges;
}

function nonBooleanCondition(sql, tokens, selects) {
  for (const [start, end] of conditionRanges(tokens, selects)) {
    const found = nonBoolean(tokens, start, end);
    if (!found) continue;
    const [a, b] = found;
    const next = nextSig(tokens, b - 1);
    const near = tokens[next] ?? tokens[b - 1];
    const nearText = near.type === "string" ? near.text.slice(1, -1) : near.text.replace(/"/g, "");
    const value = textOf(tokens, a, b);
    return problem(sql, tokens[a], tokens[b - 1],
      `An expression of non-boolean type specified in a context where a condition is expected, near '${nearText}'.`,
      `${value} är ett värde, inte ett villkor: det står inte vad det ska jämföras med. SQLite räknar allt utom 0 som sant, men SQL Server kräver en jämförelse, till exempel ${value} >= 2.`);
  }
  return null;
}

function syntaxProblems(sql, tokens, selects) {
  const found = [doubleEquals(sql, tokens), limitClause(sql, tokens), sqliteFunction(sql, tokens), nonBooleanCondition(sql, tokens, selects)];
  for (const select of selects) {
    if (select.from) found.push(joinWithoutOn(sql, tokens, select), derivedWithoutAlias(sql, tokens, select));
  }
  return found.filter(Boolean);
}

// ── GROUP BY, alias och ORDER BY ─────────────────────────────────────────
// Namn som en delfråga, WITH eller CREATE TABLE definierar kan vara en kolumn
// där: WHERE Kod kan peka på Kod i (SELECT Code AS Kod …) AS t.
function namesDefinedElsewhere(tokens, selects, select) {
  const names = new Set();
  for (const other of selects) {
    if (other === select) continue;
    for (const item of selectItems(tokens, other.list)) if (item.alias) names.add(item.alias.toLowerCase());
  }
  for (let i = 0; i < tokens.length; i++) {
    if (!isOp(tokens[i], "(") || isSubquery(tokens, i)) continue;
    const close = matchingClose(tokens, i);
    if (close === -1) break;
    const name = prevSig(tokens, i);
    const before = upper(tokens[prevSig(tokens, name)]);
    const cte = upper(tokens[nextSig(tokens, close)]) === "AS" && isSubquery(tokens, nextSig(tokens, nextSig(tokens, close)));
    if (tokens[name]?.type === "ident" && (cte || before === "AS" || before === "TABLE")) {
      for (const part of splitDepthZero(tokens.slice(i + 1, close), ",")) {
        const first = part.find(isSig);
        if (first?.type === "ident") names.add(lowerName(first));
      }
    }
  }
  return names;
}

// Alias från SELECT finns inte i WHERE, GROUP BY och HAVING: SQL Server räknar
// ut SELECT efter dem. Ett alias som också är ett kolumnnamn pekar där på
// kolumnen, och då prövas det inte.
function aliasInClause(sql, tokens, select, items, taken) {
  const aliases = new Map();
  for (const item of items) {
    const name = item.alias?.toLowerCase();
    if (name && !COLUMN_NAMES.has(name) && !taken.has(name)) aliases.set(name, item);
  }
  if (aliases.size === 0) return null;
  for (const [word, range] of [["WHERE", select.where], ["GROUP BY", select.group], ["HAVING", select.having]]) {
    if (!range) continue;
    const hit = columnTokens(tokens, range, { aggregates: false }).find((ref) => aliases.has(ref.name.toLowerCase()));
    if (!hit) continue;
    const name = hit.name;
    const expression = textOf(tokens, ...aliases.get(name.toLowerCase()).expr);
    return problem(sql, tokens[hit.index], tokens[hit.last], `Invalid column name '${name}'.`,
      `aliaset ${name} finns inte i ${word}, eftersom SQL Server räknar ut SELECT efter ${word}. Skriv uttrycket i stället: ${expression}.`);
  }
  return null;
}

function groupNames(tokens, [start, end]) {
  const names = new Set();
  for (const part of splitDepthZero(tokens.slice(start, end), ",")) {
    for (const ref of columnRefs([...part, { type: "op", text: "+" }])) {
      names.add(ref.toLowerCase());
      names.add(ref.split(".").pop().toLowerCase());
    }
  }
  return names;
}

const grouped = (names, name) => names.has(name.toLowerCase()) || names.has(name.split(".").pop().toLowerCase());

// Varje kolumn i SELECT måste finnas i GROUP BY eller inuti ett aggregat.
// SQLite släpper igenom och väljer ett värde på måfå — SQL Server vägrar.
function selectGroupError(sql, tokens, items, names) {
  for (const item of items) {
    const slice = tokens.slice(item.start, item.end);
    const sig = slice.filter(isSig);
    if (hasAggregate(slice) || sig.some((t) => upper(t) === "SELECT")) continue;
    const star = sig.find((t) => isOp(t, "*"));
    const ref = star ? "*" : columnRefs(slice).find((name) => !names || !grouped(names, name));
    if (!ref) continue;
    const at = star ?? sig.find((t) => t.type === "ident" && t.text.replace(/"/g, "") === ref) ?? sig[0];
    return problem(sql, at, at, `Column '${ref}' is invalid in the select list because it is not contained in either an aggregate function or the GROUP BY clause.`,
      `${ref} står i SELECT men varken i GROUP BY eller inuti en aggregatfunktion. Lägg kolumnen i GROUP BY eller slå in den i ett aggregat.`);
  }
  return null;
}

// HAVING prövar grupper: en kolumn där måste finnas i GROUP BY eller i ett aggregat.
function havingGroupError(sql, tokens, select, names) {
  const ref = columnTokens(tokens, select.having).find(({ name }) => !grouped(names, name));
  if (!ref) return null;
  return problem(sql, tokens[ref.index], tokens[ref.last],
    `Column '${ref.name}' is invalid in the HAVING clause because it is not contained in either an aggregate function or the GROUP BY clause.`,
    `${ref.name} står i HAVING men varken i GROUP BY eller inuti en aggregatfunktion. HAVING prövar hela grupper, och en grupp har inget eget värde på ${ref.name}. Gäller villkoret varje rad hör det hemma i WHERE; annars lägg ${ref.name} i GROUP BY.`);
}

// En grupperad fråga sorteras på det GROUP BY har, på ett aggregat eller på ett alias.
function orderGroupError(sql, tokens, select, items, names) {
  const aliases = new Set(items.map((item) => item.alias?.toLowerCase()).filter(Boolean));
  const ref = columnTokens(tokens, select.order).find(({ name }) => !aliases.has(name.toLowerCase()) && !grouped(names, name));
  if (!ref) return null;
  return problem(sql, tokens[ref.index], tokens[ref.last],
    `Column '${ref.name}' is invalid in the ORDER BY clause because it is not contained in either an aggregate function or the GROUP BY clause.`,
    `frågan grupperar, så den kan bara sorteras på det som står i GROUP BY, på ett aggregat eller på ett alias från SELECT. ${ref.name} är inget av dem: lägg ${ref.name} i GROUP BY, eller sortera på något som SELECT visar.`);
}

// Med SELECT DISTINCT sorteras det bara på det som står i SELECT. Bara ett
// ensamt kolumnnamn i ORDER BY prövas.
function distinctOrderError(sql, tokens, select, items) {
  if (items.some((item) => item.star)) return null;
  const listed = new Set();
  for (const item of items) {
    if (item.alias) listed.add(item.alias.toLowerCase());
    for (const { name } of columnTokens(tokens, item.expr, { aggregates: false })) {
      listed.add(name.toLowerCase());
      listed.add(name.split(".").pop().toLowerCase());
    }
  }
  for (const piece of splitByComma(tokens, select.order)) {
    const [a, b] = trimPart(tokens, piece);
    let last = b;
    while (last > a && ["ASC", "DESC"].includes(upper(tokens[prevSig(tokens, last)]))) last = prevSig(tokens, last);
    const refs = columnTokens(tokens, [a, last]);
    if (refs.length !== 1 || refs[0].index !== a || refs[0].last !== prevSig(tokens, last)) continue;
    const { name } = refs[0];
    if (listed.has(name.toLowerCase()) || listed.has(name.split(".").pop().toLowerCase())) continue;
    return problem(sql, tokens[refs[0].index], tokens[refs[0].last], "ORDER BY items must appear in the select list if SELECT DISTINCT is specified.",
      `med SELECT DISTINCT kan frågan bara sorteras på det som står i SELECT, och ${name} gör inte det. Sortera på en kolumn som SELECT visar, eller lägg till ${name} i SELECT.`);
  }
  return null;
}

function splitByComma(tokens, [start, end]) {
  const parts = [];
  let from = start;
  let depth = 0;
  for (let i = start; i < end; i++) {
    if (isOp(tokens[i], "(")) depth++;
    else if (isOp(tokens[i], ")")) depth--;
    else if (depth === 0 && isOp(tokens[i], ",")) {
      parts.push([from, i]);
      from = i + 1;
    }
  }
  parts.push([from, end]);
  return parts;
}

function groupingRules(sql, tokens, selects, select) {
  const items = selectItems(tokens, select.list);
  const alias = aliasInClause(sql, tokens, select, items, namesDefinedElsewhere(tokens, selects, select));
  if (alias) return alias;
  const names = select.group ? groupNames(tokens, select.group) : null;
  const anyAggregate = items.some((item) => hasAggregate(tokens.slice(item.start, item.end)));
  if (names || anyAggregate) {
    const found = selectGroupError(sql, tokens, items, names);
    if (found) return found;
  }
  if (select.having && (names || anyAggregate || hasAggregate(tokens.slice(...select.having)))) {
    const found = havingGroupError(sql, tokens, select, names ?? new Set());
    if (found) return found;
  }
  if (!select.order || isCompound(tokens, select)) return null;
  if (names || anyAggregate) {
    const found = orderGroupError(sql, tokens, select, items, names ?? new Set());
    if (found) return found;
  }
  return select.distinct ? distinctOrderError(sql, tokens, select, items) : null;
}

// ORDER BY i en underfråga, en delfråga i FROM, en WITH eller en vy kräver TOP.
const ORDER_1033 = "The ORDER BY clause is invalid in views, inline functions, derived tables, subqueries, and common table expressions, unless TOP, OFFSET or FOR XML is also specified.";

function orderInSubquery(sql, tokens, selects) {
  const words = tokens.filter(isSig).slice(0, 4).map(upper);
  const view = (words[0] === "CREATE" || words[0] === "ALTER") && words.includes("VIEW");
  for (const select of selects) {
    if (!select.order || select.top) continue;
    const orderWords = tokens.slice(...select.order).map(upper);
    if (orderWords.includes("OFFSET") || orderWords.includes("FOR")) continue;
    // (SELECT …) UNION (SELECT …) är ingen underfråga.
    const open = enclosingOpen(tokens, select.at);
    const before = prevSig(tokens, open);
    const word = upper(tokens[before]);
    const setPart = SET_WORDS.has(word) || (word === "ALL" && SET_WORDS.has(upper(tokens[prevSig(tokens, before)])));
    const nested = open === -1 ? view : before !== -1 && !setPart;
    if (!nested) continue;
    // TOP i någon del av samma UNION räcker för att inte flagga.
    if (selects.some((other) => other.top && other.depth === select.depth && enclosingOpen(tokens, other.at) === open)) continue;
    const where = open === -1 ? "en vy" : "en underfråga";
    return problem(sql, tokens[select.orderAt], tokens[prevSig(tokens, select.order[1])], ORDER_1033,
      `ORDER BY står i ${where} utan TOP. Där betyder ordningen inget för resultatet, så SQL Server vägrar. Ta bort ORDER BY där och sortera i den yttre frågan, eller skriv TOP 1 om du vill ha den första raden.`);
  }
  return null;
}

export function checkTsqlRules(sql) {
  const tokens = tokenize(sql);
  const unsupported = unsupportedSyntax(tokens);
  if (unsupported) return unsupported;
  const statements = splitTokens(tokens).map((statement) => ({ tokens: statement, selects: selectsOf(statement) }));
  // Det övningsmotorn inte kan köra först: det är inget fel i SQL Server.
  for (const { tokens: statement, selects } of statements) {
    for (const select of selects) {
      if (!select.from) continue;
      const equals = equalsAliasError(selectItems(statement, select.list).map(({ start, end }) => statement.slice(start, end)));
      if (equals) return equals;
    }
  }
  // Syntaxfel: SQL Server tolkar inte vidare, så det första i frågan gäller.
  const syntax = statements.flatMap(({ tokens: statement, selects }) => syntaxProblems(sql, statement, selects));
  if (syntax.length) return syntax.reduce((first, other) => (other.at < first.at ? other : first));
  for (const { tokens: statement, selects } of statements) {
    for (const select of selects) {
      if (select.depth !== 0 || !select.from) continue;
      const found = groupingRules(sql, statement, selects, select);
      if (found) return found;
    }
  }
  for (const { tokens: statement, selects } of statements) {
    const found = orderInSubquery(sql, statement, selects);
    if (found) return found;
  }
  return null;
}

// ── AVG i heltal ────────────────────────────────────────────────────────
// SQL Server räknar AVG över en INT-kolumn i heltal: snittet av 7 och 8 är 7.
// SQLite ger 7,5. Tentans kolumner är alla INT, så rättningen av tentans
// frågor räknar som SQL Server. Bara AVG(kolumn): AVG(Grade * 1.0) och
// AVG(CAST(Grade AS DECIMAL(5, 2))) ger decimaler också i SQL Server.
export const AVG_COLUMN = /^\(SUM\((.+)\) \/ COUNT\(\1\)\)$/;
export function integerAvg(sql) {
  const tokens = tokenize(sql);
  for (let i = 0; i < tokens.length; i++) {
    if (upper(tokens[i]) !== "AVG") continue;
    const open = nextSig(tokens, i);
    if (!isOp(tokens[open], "(")) continue;
    const column = nextSig(tokens, open);
    const close = nextSig(tokens, column);
    if (tokens[column]?.type !== "ident" || !isOp(tokens[close], ")")) continue;
    if (upper(tokens[nextSig(tokens, close)]) === "OVER") continue;
    const name = tokens[column].text;
    tokens.splice(i, close - i + 1, { type: "raw", text: `(SUM(${name}) / COUNT(${name}))` });
  }
  return tokens.map((token) => token.text).join("");
}

// ── SQL Server-stränghet med tabellerna ──────────────────────────────────
// Det som beror på värdena: en underfråga som ger flera rader, division med
// noll och ett eget värde i en IDENTITY-kolumn. `run(sql)` kör T-SQL mot
// tabellerna och ger { columns, values }.
//
// En regel flaggar bara en rad som SQL Server säkert räknar ut: i en fråga
// som körs i sin helhet (inte en vy, och inte en del av EXCEPT eller
// INTERSECT), för en rad där de andra villkoren i WHERE är sanna, och inte
// inuti CASE, IIF, COALESCE, ISNULL, NULLIF, en IN-lista, BETWEEN eller OR.
// Där kan SQL Server hoppa över uttrycket. En kontrollfråga på samma rader
// avgör om felet uppstår.
const RAW_512 = "Subquery returned more than 1 value. This is not permitted when the subquery follows =, !=, <, <= , >, >= or when the subquery is used as an expression.";
const CONDITIONAL = new Set(["iif", "coalesce", "isnull", "nullif", "choose"]);

function evaluatedSelects(tokens, selects) {
  const first = upper(tokens.find(isSig));
  if (first !== "SELECT" && first !== "WITH") return [];
  const top = selects.filter((select) => select.depth === 0);
  if (top.some((select) => ["EXCEPT", "INTERSECT"].includes(upper(tokens[select.end])))) return [];
  return top;
}

// Parenteserna och CASE som omsluter plats `at`, inifrån intervallets början.
function enclosing(tokens, start, at) {
  const stack = [];
  for (let i = start; i < at; i++) {
    const token = tokens[i];
    if (isOp(token, "(")) stack.push({ open: i });
    else if (isOp(token, ")")) stack.pop();
    else if (upper(token) === "CASE") stack.push({ case: i });
    else if (upper(token) === "END" && stack.at(-1)?.case !== undefined) stack.pop();
  }
  return stack;
}

function hasLogic(tokens, start, end) {
  let depth = 0;
  for (let i = start; i < end; i++) {
    if (isOp(tokens[i], "(")) depth++;
    else if (isOp(tokens[i], ")")) depth--;
    else if (depth === 0 && ["AND", "OR", "BETWEEN"].includes(upper(tokens[i]))) return true;
  }
  return false;
}

// Räknar SQL Server alltid ut det som står på plats `at` när det räknar ut [start, end)?
function certain(tokens, start, end, at) {
  const groups = enclosing(tokens, start, at);
  if (groups.some((group) => group.case !== undefined)) return false;
  const levels = [[start, end]];
  for (const { open } of groups) {
    const before = tokens[prevSig(tokens, open)];
    if (isSubquery(tokens, open) || CONDITIONAL.has(lowerName(before)) || ["IN", "EXISTS", "ALL", "ANY", "SOME"].includes(upper(before))) return false;
    levels.push([open + 1, matchingClose(tokens, open)]);
  }
  return levels.every(([a, b]) => b !== -1 && !hasLogic(tokens, a, b));
}

// Villkoret delat i det som alla måste vara sant: a AND (b AND c) ger a, b och c.
function conjuncts(tokens, [start, end]) {
  const parts = [];
  for (const part of logicalParts(tokens, start, end, ["AND"])) {
    const [a, b] = trimPart(tokens, part);
    if (a >= b) continue;
    if (isOp(tokens[a], "(") && matchingClose(tokens, a) === b - 1 && !isSubquery(tokens, a)) parts.push(...conjuncts(tokens, [a + 1, b - 1]));
    else parts.push([a, b]);
  }
  return parts;
}

// Var SQL Server säkert räknar ut det som står på plats `at`, eller null:
//   where   raderna i FROM där de andra villkoren i WHERE är sanna
//   having  grupperna där de andra villkoren i HAVING är sanna
//   list    raderna i resultatet
//   rows    raderna efter WHERE, för det som står inuti ett aggregat
function contextAt(tokens, select, at, { aggregateRows = false } = {}) {
  const clause = [select.where, select.having, select.list].find((range) => range && at >= range[0] && at < range[1]);
  if (!clause) return null;
  const aggregate = enclosing(tokens, clause[0], at)
    .filter(({ open }) => open !== undefined && AGGREGATES.has(lowerName(tokens[prevSig(tokens, open)])))
    .at(-1);
  if (aggregate) {
    if (!aggregateRows || clause === select.where) return null;
    const close = matchingClose(tokens, aggregate.open);
    if (close === -1 || !certain(tokens, aggregate.open + 1, close, at)) return null;
    return { kind: "rows", clause: "SELECT", others: select.where ? [select.where] : [] };
  }
  if (clause === select.list) {
    if (select.top) return null;
    const item = selectItems(tokens, select.list).find(({ expr }) => at >= expr[0] && at < expr[1]);
    return item && certain(tokens, item.expr[0], item.expr[1], at) ? { kind: "list", clause: "SELECT" } : null;
  }
  const parts = conjuncts(tokens, clause);
  const own = parts.find(([a, b]) => at >= a && at < b);
  if (!own || !certain(tokens, own[0], own[1], at)) return null;
  const where = clause === select.where;
  return { kind: where ? "where" : "having", clause: where ? "WHERE" : "HAVING", others: parts.filter((part) => part !== own) };
}

// En kontrollfråga: finns det en rad där `predicate` är sant, i det sammanhang
// där SQL Server räknar ut uttrycket?
function probeFor(tokens, select, prefix, run) {
  const text = (range) => textOf(tokens, ...range);
  const all = (parts) => parts.map((part) => `(${text(part)})`);
  return (context, predicate) => {
    const from = select.from ? ` FROM ${text(select.from)}` : "";
    let sql;
    if (context.kind === "where" || context.kind === "rows") {
      sql = `SELECT TOP 1 1${from} WHERE ${[...all(context.others), predicate].join(" AND ")}`;
    } else {
      const where = select.where ? ` WHERE ${text(select.where)}` : "";
      const group = select.group ? ` GROUP BY ${text(select.group)}` : "";
      const having = context.kind === "having" ? context.others : select.having ? [select.having] : [];
      const filter = having.length ? ` HAVING ${all(having).join(" AND ")}` : "";
      sql = `SELECT TOP 1 1 FROM (SELECT ${predicate} AS sqlserver_probe${from}${where}${group}${filter}) AS sqlserver_probes WHERE sqlserver_probe = 1`;
    }
    try {
      return run(`${prefix}${sql}`).values.length > 0;
    } catch {
      return false;
    }
  };
}

// Kontrollfrågorna för varje SELECT som SQL Server kör i sin helhet.
function evaluated(sql) {
  const found = [];
  for (const statement of splitTokens(tokenize(sql))) {
    const selects = evaluatedSelects(statement, selectsOf(statement));
    if (selects.length === 0) continue;
    const prefix = upper(statement.find(isSig)) === "WITH" ? `${textOf(statement, 0, selects[0].at)} ` : "";
    for (const select of selects) found.push({ tokens: statement, select, prefix });
  }
  return found;
}

// Underfrågorna och operatorerna i WHERE, HAVING och SELECT, utanför andra underfrågor.
function* clauseTokens(tokens, select) {
  for (const range of [select.where, select.having, select.list]) {
    if (!range) continue;
    for (let i = range[0]; i < range[1]; i++) {
      yield i;
      if (isSubquery(tokens, i)) {
        i = matchingClose(tokens, i);
        if (i === -1) return;
      }
    }
  }
}

// En underfråga efter en jämförelse ska ge ett enda värde. SQLite tar första
// raden, SQL Server vägrar. En underfråga som går att köra för sig prövas för
// sig; en korrelerad prövas rad för rad där SQL Server säkert räknar ut den.
export function checkScalarSubqueries(sql, run) {
  const tokens = tokenize(sql);
  for (let i = 0; i < tokens.length; i++) {
    if (!isSubquery(tokens, i)) continue;
    const before = tokens[prevSig(tokens, i)];
    if (before?.type !== "op" || !COMPARISONS.has(before.text)) continue;
    const close = matchingClose(tokens, i);
    if (close === -1) continue;
    let rows = 0;
    try {
      rows = run(textOf(tokens, i + 1, close)).values.length;
    } catch {
      continue;
    }
    if (rows > 1) {
      return problem(sql, tokens[i], tokens[close], RAW_512,
        `underfrågan efter ${before.text} ger ${rows} rader, men en jämförelse kräver ett enda värde. Lägg till villkor så att den ger ett enda värde, eller använd IN om du menar flera.`);
    }
  }
  for (const { tokens: statement, select, prefix } of evaluated(sql)) {
    const probe = probeFor(statement, select, prefix, run);
    for (const i of clauseTokens(statement, select)) {
      if (!isSubquery(statement, i)) continue;
      const before = statement[prevSig(statement, i)];
      if (["IN", "EXISTS", "ALL", "ANY", "SOME"].includes(upper(before))) continue;
      const close = matchingClose(statement, i);
      const context = contextAt(statement, select, i);
      if (!context || !probe(context, `(SELECT COUNT(*) FROM (${textOf(statement, i + 1, close)}) AS sqlserver_rows) > 1`)) continue;
      const after = statement[nextSig(statement, close)];
      const operator = before?.type === "op" && COMPARISONS.has(before.text) ? `efter ${before.text}`
        : after?.type === "op" && COMPARISONS.has(after.text) ? `före ${after.text}` : null;
      const why = operator
        ? `underfrågan ${operator} ger mer än en rad för minst en av raderna i den yttre frågan, men en jämförelse kräver ett enda värde.`
        : `underfrågan i ${context.clause} ger mer än en rad för minst en av raderna, men som värde måste den ge ett enda.`;
      return problem(sql, statement[i], statement[close], RAW_512,
        `${why} SQLite tar då första raden, SQL Server vägrar köra frågan. Se till att den ger ett värde per rad, till exempel med MAX, MIN eller AVG eller med fler villkor${operator ? ", eller använd IN om du menar flera värden" : ""}.`);
    }
  }
  return null;
}

// ── Division med noll ────────────────────────────────────────────────────
// SQLite ger NULL, SQL Server stoppar frågan.
function caseEnd(tokens, at) {
  let depth = 0;
  let cases = 0;
  for (let i = at; i < tokens.length; i++) {
    if (isOp(tokens[i], "(")) depth++;
    else if (isOp(tokens[i], ")")) {
      if (depth === 0) return -1;
      depth--;
    } else if (depth === 0) {
      const word = upper(tokens[i]);
      if (word === "CASE") cases++;
      else if (word === "END" && --cases === 0) return i;
    }
  }
  return -1;
}

function caseStart(tokens, at) {
  let depth = 0;
  let ends = 0;
  for (let i = at; i >= 0; i--) {
    if (isOp(tokens[i], ")")) depth++;
    else if (isOp(tokens[i], "(")) {
      if (depth === 0) return -1;
      depth--;
    } else if (depth === 0) {
      const word = upper(tokens[i]);
      if (word === "END") ends++;
      else if (word === "CASE" && --ends === 0) return i;
    }
  }
  return -1;
}

// Talet efter / eller %: ett namn, ett tal, ett anrop, en parentes eller CASE.
function rightOperand(tokens, at) {
  const start = nextSig(tokens, at);
  let i = start;
  while (i !== -1 && (isOp(tokens[i], "-") || isOp(tokens[i], "+"))) i = nextSig(tokens, i);
  if (i === -1) return null;
  const token = tokens[i];
  let end;
  if (isOp(token, "(")) end = matchingClose(tokens, i);
  else if (upper(token) === "CASE") end = caseEnd(tokens, i);
  else if (token.type === "ident" && isOp(tokens[nextSig(tokens, i)], "(")) {
    end = matchingClose(tokens, nextSig(tokens, i));
    if (end !== -1 && upper(tokens[nextSig(tokens, end)]) === "OVER") end = matchingClose(tokens, nextSig(tokens, nextSig(tokens, end)));
  } else if (["ident", "number", "string"].includes(token.type) && !RESERVED_WORDS.has(upper(token))) {
    end = i;
    while (isOp(tokens[end + 1], ".") && tokens[end + 2]?.type === "ident") end += 2;
  } else return null;
  return end === -1 ? null : [start, end + 1];
}

function operandStart(tokens, end) {
  const token = tokens[end];
  let start;
  if (isOp(token, ")")) {
    start = matchingOpen(tokens, end);
    if (start === -1) return -1;
    let name = prevSig(tokens, start);
    if (upper(tokens[name]) === "OVER") {
      const call = prevSig(tokens, name);
      if (!isOp(tokens[call], ")")) return -1;
      start = matchingOpen(tokens, call);
      name = prevSig(tokens, start);
    }
    if (tokens[name]?.type === "ident" && !KEYWORDS.has(lowerName(tokens[name])) && !RESERVED_WORDS.has(upper(tokens[name]))) start = name;
  } else if (upper(token) === "END") start = caseStart(tokens, end);
  else if (["ident", "number", "string"].includes(token?.type) && !RESERVED_WORDS.has(upper(token))) {
    start = end;
    while (isOp(tokens[start - 1], ".") && tokens[start - 2]?.type === "ident") start -= 2;
  } else return -1;
  if (start === -1) return -1;
  // Ett minustecken före är en del av talet, om det inte står efter ett annat tal.
  const sign = prevSig(tokens, start);
  const beforeSign = prevSig(tokens, sign);
  if ((isOp(tokens[sign], "-") || isOp(tokens[sign], "+"))
    && (beforeSign === -1 || (tokens[beforeSign].type === "op" && !isOp(tokens[beforeSign], ")")) || RESERVED_WORDS.has(upper(tokens[beforeSign])))) {
    start = sign;
  }
  return start;
}

// Talet före / eller %: a * b / c delar a * b med c.
function leftOperand(tokens, at) {
  const end = prevSig(tokens, at);
  if (end === -1) return null;
  let start = operandStart(tokens, end);
  while (start !== -1) {
    const before = prevSig(tokens, start);
    if (!["*", "/", "%"].some((op) => isOp(tokens[before], op))) break;
    start = operandStart(tokens, prevSig(tokens, before));
  }
  return start === -1 ? null : [start, end + 1];
}

export function checkDivisionByZero(sql, run) {
  for (const { tokens, select, prefix } of evaluated(sql)) {
    const probe = probeFor(tokens, select, prefix, run);
    for (const i of clauseTokens(tokens, select)) {
      if (!isOp(tokens[i], "/") && !isOp(tokens[i], "%")) continue;
      const divisor = rightOperand(tokens, i);
      const dividend = leftOperand(tokens, i);
      if (!divisor || !dividend) continue;
      const context = contextAt(tokens, select, i, { aggregateRows: true });
      const by = textOf(tokens, ...divisor);
      if (!context || !probe(context, `((${textOf(tokens, ...dividend)}) IS NOT NULL AND (${by}) = 0)`)) continue;
      const zero = /^[+-]?[0.]+$/.test(by);
      return problem(sql, tokens[dividend[0]], tokens[divisor[1] - 1], "Divide by zero error encountered.",
        zero
          ? "du delar med 0. SQLite ger då NULL och fortsätter, men SQL Server stoppar frågan."
          : `du delar med ${by}, som är 0 för minst en rad. SQLite ger då NULL och fortsätter, men SQL Server stoppar frågan. Skriv NULLIF(${by}, 0) om nollan kan förekomma: då blir kvoten NULL även i SQL Server.`);
    }
  }
  return null;
}

// ── IDENTITY i INSERT ────────────────────────────────────────────────────
// SQL Server sätter värdet i en IDENTITY-kolumn själv och tar inte emot ett
// eget utan SET IDENTITY_INSERT. SQLite tar emot det.
const bareName = (token) => token.text.replace(/"/g, "").split(".").pop();

// Tabellens kolumner och dess IDENTITY-kolumn, ur CREATE TABLE i T-SQL.
function createdTable(tokens) {
  const open = tokens.findIndex((token) => isOp(token, "("));
  const close = open === -1 ? -1 : matchingClose(tokens, open);
  if (close === -1) return null;
  const columns = splitDepthZero(tokens.slice(open + 1, close), ",")
    .map((part) => part.filter(isSig))
    .filter((part) => part[0]?.type === "ident" && !["CONSTRAINT", "PRIMARY", "FOREIGN", "UNIQUE", "CHECK", "INDEX"].includes(upper(part[0])));
  const identity = columns.find((part) => part.some((token) => upper(token) === "IDENTITY"));
  return { columns: columns.map((part) => bareName(part[0])), identity: identity ? bareName(identity[0]) : null };
}

// Samma sak för en tabell som redan finns: IDENTITY blev AUTOINCREMENT i SQLite.
function existingTable(name, run) {
  try {
    const ddl = run(`SELECT sql FROM sqlite_master WHERE type = 'table' AND LOWER(name) = '${name.toLowerCase().replace(/'/g, "''")}'`).values[0]?.[0];
    if (!ddl) return null;
    const identity = /(\w+)\s+INTEGER\s+PRIMARY\s+KEY\s+AUTOINCREMENT/i.exec(ddl)?.[1] ?? null;
    const columns = run(`PRAGMA table_info("${name.replace(/"/g, "")}")`).values.map(([, column]) => column);
    return { columns, identity };
  } catch {
    return null;
  }
}

export function checkIdentityInsert(sql, run) {
  const created = new Map();
  const allowed = new Set();
  for (const statement of splitTokens(tokenize(sql))) {
    const sig = statement.filter(isSig);
    const words = sig.slice(0, 3).map(upper);
    if (words[0] === "SET" && words[1] === "IDENTITY_INSERT" && sig[2]) allowed.add(bareName(sig[2]).toLowerCase());
    if (words[0] === "CREATE" && words[1] === "TABLE" && sig[2]) {
      const table = createdTable(sig);
      if (table) created.set(bareName(sig[2]).toLowerCase(), table);
    }
    if (words[0] !== "INSERT") continue;
    let at = upper(sig[1]) === "INTO" ? 2 : 1;
    while (isOp(sig[at + 1], ".") && sig[at + 2]?.type === "ident") at += 2;
    const target = sig[at];
    if (target?.type !== "ident") continue;
    const name = bareName(target);
    if (allowed.has(name.toLowerCase())) continue;
    const table = created.get(name.toLowerCase()) ?? existingTable(name, run);
    if (!table?.identity) continue;
    const next = sig[at + 1];
    if (isOp(next, "(") && upper(sig[at + 2]) !== "SELECT") {
      const close = matchingClose(sig, at + 1);
      const column = sig.slice(at + 2, close).find((token) => token.type === "ident" && bareName(token).toLowerCase() === table.identity.toLowerCase());
      if (!column) continue;
      return problem(sql, column, column, `Cannot insert explicit value for identity column in table '${name}' when IDENTITY_INSERT is set to OFF.`,
        `${bareName(column)} är en IDENTITY-kolumn: SQL Server sätter värdet själv och tar inte emot ett eget. Ta bort ${bareName(column)} ur kolumnlistan och värdet för den.`);
    }
    if (upper(next) === "VALUES" && isOp(sig[at + 2], "(")) {
      const close = matchingClose(sig, at + 2);
      const values = splitDepthZero(sig.slice(at + 3, close), ",").length;
      if (values !== table.columns.length) continue;
      const others = table.columns.filter((column) => column.toLowerCase() !== table.identity.toLowerCase());
      return problem(sql, sig[0], target, "Column name or number of supplied values does not match table definition.",
        `${name} har IDENTITY-kolumnen ${table.identity}, som SQL Server fyller i själv. Utan kolumnlista ska VALUES bara ha värden för de andra kolumnerna, men här finns ett värde för varje kolumn. Skriv kolumnlistan utan ${table.identity}: INSERT INTO ${name} (${others.join(", ")}) VALUES (…).`);
    }
  }
  return null;
}
