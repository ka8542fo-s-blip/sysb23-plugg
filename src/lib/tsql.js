// T-SQL först. Kursen (och tentan) kör Microsoft SQL Server / Azure SQL,
// medan motorn i webbläsaren är SQLite. Den som pluggar ska bara behöva
// kunna kursens dialekt, så allt som körs går genom två steg:
//
//   1. checkTsqlRules — säger nej där SQL Server säger nej men SQLite är
//      slapp (GROUP BY-regeln), med SQL Servers eget felmeddelande.
//   2. toSqlite — skriver om de syntaxskillnader kursen berör (TOP, ISNULL,
//      SUBSTRING, LEN, GETDATE, + för text, IDENTITY, [hakparenteser],
//      TRUNCATE, GO, SET ROWCOUNT) precis innan frågan når motorn.
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
const RENAMES = { isnull: "IFNULL", substring: "SUBSTR", len: "LENGTH" };
const AGGREGATES = new Set(["count", "sum", "avg", "min", "max", "total", "group_concat", "string_agg"]);
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
    } else if (/[A-Za-z_@#]/.test(ch)) {
      let j = i;
      while (j < sql.length && /[A-Za-z0-9_@#$.]/.test(sql[j])) j++;
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

  const out = [...tokens];
  let limit = null;

  for (let i = 0; i < out.length; i++) {
    const token = out[i];
    if (token.type === "ident") {
      const name = token.text.toLowerCase();
      const after = nextSig(out, i);
      const isCall = isOp(out[after], "(");
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
  const hasLimit = out.some((t, i) => upper(t) === "LIMIT" && isSig(t));
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

function hasAggregate(tokens) {
  const sig = tokens.filter(isSig);
  return sig.some((t, i) => t.type === "ident" && AGGREGATES.has(t.text.toLowerCase()) && isOp(sig[i + 1], "("));
}

export function checkTsqlRules(sql) {
  for (const statement of splitTokens(tokenize(sql))) {
    for (const segment of selectSegments(statement)) {
      const sig = segment.filter(isSig);
      if (upper(sig[0]) !== "SELECT") continue;
      const selectAt = segment.findIndex((t) => upper(t) === "SELECT");
      const fromAt = depthZeroIndex(segment, (t) => upper(t) === "FROM", selectAt + 1);
      if (fromAt === -1) continue;
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
