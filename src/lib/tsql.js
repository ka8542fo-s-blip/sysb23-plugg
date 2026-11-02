// T-SQL först. Kursen (och tentan) kör Microsoft SQL Server / Azure SQL,
// medan motorn i webbläsaren är SQLite. Den som pluggar ska bara behöva
// kunna kursens dialekt, så allt som körs går genom två steg:
//
//   1. checkTsqlRules — säger nej där SQL Server säger nej men SQLite är
//      slapp (GROUP BY-regeln), med SQL Servers eget felmeddelande.
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
const TEXT_COLUMNS = new Set();
for (const table of hospitalSchema) {
  for (const column of table.columns) {
    if (TEXT_TYPE.test(column.type)) TEXT_COLUMNS.add(column.name.toLowerCase());
  }
}

const TEXT_FUNCTIONS = new Set([
  "lower", "upper", "substring", "substr", "concat", "ltrim", "rtrim", "trim",
  "replace", "left", "right", "str", "format", "reverse",
]);
const RENAMES = { isnull: "IFNULL", substring: "SUBSTR", len: "LENGTH", count_big: "COUNT" };
const AGGREGATES = new Set(["count", "count_big", "sum", "avg", "min", "max", "total", "group_concat", "string_agg"]);
// Tabellernas kolumnnamn. Ett alias med samma namn som en kolumn pekar i WHERE
// och HAVING på kolumnen, inte på aliaset. Tentans tabeller står inte i seeden.
const COLUMN_NAMES = new Set([
  ...hospitalSchema.flatMap((table) => table.columns.map((column) => column.name.toLowerCase())),
  "studentno", "name", "age", "address", "code", "credits", "grade",
]);
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
    if (isOp(token, "+")) {
      const left = prevSig(out, i);
      const right = nextSig(out, i);
      if (operandIsText(out, left, "left") || operandIsText(out, right, "right")) {
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

// ── SQL Server-stränghet: GROUP BY-regeln ────────────────────────────────
// Varje kolumn i SELECT måste finnas i GROUP BY eller inuti ett aggregat.
// SQLite släpper igenom och väljer ett värde på måfå — SQL Server vägrar.
function selectSegments(tokens) {
  const segments = [];
  let current = [];
  let depth = 0;
  for (const token of tokens) {
    if (isOp(token, "(")) depth++;
    if (isOp(token, ")")) depth--;
    if (depth === 0 && ["UNION", "INTERSECT", "EXCEPT"].includes(upper(token))) {
      segments.push(current);
      current = [];
    } else {
      current.push(token);
    }
  }
  segments.push(current);
  return segments;
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

// Giltig T-SQL som övningsmotorn inte kan köra: säg det, i stället för ett
// syntaxfel som låter som ett stavfel.
const UNSUPPORTED = [
  [/\bWITH TIES\b/, "TOP ... WITH TIES är giltig T-SQL, men övningsmotorn kan inte köra det. Skriv i stället frågan med en underfråga, till exempel WHERE Grade = (SELECT MAX(Grade) ...) eller HAVING COUNT(*) = (...)."],
  [/\b(CROSS|OUTER) APPLY\b/, "APPLY är giltig T-SQL, men övningsmotorn kan inte köra det, och det ingår inte i kursen. Skriv i stället frågan med JOIN eller en underfråga."],
];

function unsupportedSyntax(tokens) {
  const words = tokens.filter((token) => token.type === "ident").map((token) => token.text.toUpperCase()).join(" ");
  const hit = UNSUPPORTED.find(([pattern]) => pattern.test(words));
  return hit ? { raw: null, message: hit[1] } : null;
}

// Ett alias på ett aggregat finns inte i WHERE och HAVING: SQL Server räknar ut
// SELECT efter dem. SQLite släpper igenom det. Bara det yttersta i villkoret
// prövas: en funktion och en underfråga har egna namn.
function aggregateAliasError(segment, selectAt, fromAt) {
  const aliases = new Set();
  for (const item of splitDepthZero(segment.slice(selectAt + 1, fromAt), ",")) {
    const sig = item.filter(isSig);
    const as = depthZeroIndex(sig, (token) => upper(token) === "AS");
    if (as < 1 || sig.length !== as + 2 || sig[as + 1].type !== "ident") continue;
    const name = sig[as + 1].text.toLowerCase();
    if (hasAggregate(sig.slice(0, as)) && !COLUMN_NAMES.has(name)) aliases.add(name);
  }
  if (aliases.size === 0) return null;
  for (const word of ["WHERE", "HAVING"]) {
    const at = depthZeroIndex(segment, (token) => upper(token) === word, fromAt);
    if (at === -1) continue;
    const end = depthZeroIndex(segment, (token) => ["GROUP", "HAVING", "ORDER"].includes(upper(token)), at + 1);
    const clause = segment.slice(at + 1, end === -1 ? segment.length : end);
    const hitAt = depthZeroIndex(clause, (token, i) => (
      token.type === "ident" && aliases.has(token.text.toLowerCase()) && !isOp(clause[nextSig(clause, i)], "(")
    ));
    if (hitAt !== -1) {
      const name = clause[hitAt].text;
      return {
        raw: `Invalid column name '${name}'.`,
        message: `Aliaset ${name} finns inte i ${word}, eftersom SQL Server räknar ut SELECT efter ${word}. Upprepa uttrycket i stället, till exempel HAVING COUNT(*) >= 2.`,
      };
    }
  }
  return null;
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

export function checkTsqlRules(sql) {
  const unsupported = unsupportedSyntax(tokenize(sql));
  if (unsupported) return unsupported;
  for (const statement of splitTokens(tokenize(sql))) {
    for (const segment of selectSegments(statement)) {
      const sig = segment.filter(isSig);
      if (upper(sig[0]) !== "SELECT") continue;
      const selectAt = segment.findIndex((t) => upper(t) === "SELECT");
      const fromAt = depthZeroIndex(segment, (t) => upper(t) === "FROM", selectAt + 1);
      if (fromAt === -1) continue;
      const alias = aggregateAliasError(segment, selectAt, fromAt);
      if (alias) return alias;
      let listStart = selectAt + 1;
      // Hoppa över DISTINCT / TOP n.
      let guard = nextSig(segment, selectAt);
      while (guard !== -1 && ["DISTINCT", "ALL", "TOP"].includes(upper(segment[guard]))) {
        if (upper(segment[guard]) === "TOP") {
          const n = nextSig(segment, guard);
          guard = isOp(segment[n], "(") ? nextSig(segment, nextSig(segment, n)) : n;
        }
        listStart = guard + 1;
        guard = nextSig(segment, guard);
      }
      const list = segment.slice(listStart, fromAt);
      const groupAt = depthZeroIndex(segment, (t, i) => upper(t) === "GROUP" && upper(segment[nextSig(segment, i)]) === "BY", fromAt);
      let groupSet = null;
      if (groupAt !== -1) {
        const byAt = nextSig(segment, groupAt);
        const endAt = depthZeroIndex(segment, (t) => ["HAVING", "ORDER", "LIMIT", "UNION"].includes(upper(t)), byAt + 1);
        const groupTokens = segment.slice(byAt + 1, endAt === -1 ? segment.length : endAt);
        groupSet = new Set();
        for (const part of splitDepthZero(groupTokens, ",")) {
          for (const ref of columnRefs([...part, { type: "op", text: "+" }])) {
            groupSet.add(ref.toLowerCase());
            groupSet.add(ref.split(".").pop().toLowerCase());
          }
        }
      }
      const items = splitDepthZero(list, ",");
      const equalsAlias = equalsAliasError(items);
      if (equalsAlias) return equalsAlias;
      const anyAggregate = items.some(hasAggregate);
      if (!groupSet && !anyAggregate) continue;
      for (const item of items) {
        const sigItem = item.filter(isSig);
        if (hasAggregate(item)) continue;
        if (sigItem.some((t) => upper(t) === "SELECT")) continue;
        const star = sigItem.some((t) => isOp(t, "*"));
        const offenders = star ? ["*"] : columnRefs(item).filter((ref) => {
          if (!groupSet) return true;
          return !groupSet.has(ref.toLowerCase()) && !groupSet.has(ref.split(".").pop().toLowerCase());
        });
        if (offenders.length) {
          const ref = offenders[0];
          return {
            raw: `Column '${ref}' is invalid in the select list because it is not contained in either an aggregate function or the GROUP BY clause.`,
            message: `${ref} står i SELECT men varken i GROUP BY eller inuti en aggregatfunktion. SQL Server vägrar köra frågan — lägg kolumnen i GROUP BY eller slå in den i ett aggregat.`,
          };
        }
      }
    }
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

// ── SQL Server-stränghet: en underfråga efter en jämförelse ─────────────
// SQLite tar första raden, SQL Server vägrar. Bara underfrågor som går att
// köra för sig prövas; en korrelerad underfråga ger fel och hoppas över.
const COMPARISONS = new Set(["=", "<>", "!=", "<", ">", "<=", ">="]);
export function checkScalarSubqueries(sql, run) {
  const tokens = tokenize(sql);
  for (let i = 0; i < tokens.length; i++) {
    if (!isOp(tokens[i], "(") || upper(tokens[nextSig(tokens, i)]) !== "SELECT") continue;
    const before = tokens[prevSig(tokens, i)];
    if (before?.type !== "op" || !COMPARISONS.has(before.text)) continue;
    const close = matchingClose(tokens, i);
    if (close === -1) continue;
    let rows = 0;
    try {
      rows = run(tokens.slice(i + 1, close).map((token) => token.text).join("")).values.length;
    } catch {
      continue;
    }
    if (rows > 1) {
      return {
        raw: "Subquery returned more than 1 value. This is not permitted when the subquery follows =, !=, <, <= , >, >= or when the subquery is used as an expression.",
        message: `Underfrågan efter ${before.text} ger ${rows} rader, och då vägrar SQL Server köra frågan. Lägg till villkor så att den ger ett enda värde, eller använd IN om du menar flera.`,
      };
    }
  }
  return null;
}
