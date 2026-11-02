// Typkontrollen i rättningen. SQL Server gör om text till tal när text och tal
// jämförs eller räknas ihop, och stoppar hela frågan om något värde inte går
// att göra om. SQLite säger inget: där är text alltid större än tal, så
// WHERE Code >= 2 släpper igenom varje rad, och en fråga som SQL Server vägrar
// köra kunde bli rättad som rätt.
//
// checkConversions läser frågan till uttryck, tar kolumnernas typer ur
// tabelldefinitionerna (PRAGMA table_info) och går igenom de faktiska värdena
// när text möter tal. Bara det säkra flaggas: en okänd tabell, funktion eller
// ett skrivsätt ger okänd typ, och då säger kontrollen ingenting.
import { toSqlite, tokenize } from "./tsql.js";

const SAFE_NAME = /^[\p{L}\p{N}_#$]+$/u;

// `run(sql)` kör en fråga mot tabellerna och ger { columns, values }.
export function catalogOf(run) {
  const tables = new Map();
  const attempt = (sql) => {
    try {
      return run(sql).values;
    } catch {
      return null;
    }
  };
  return {
    columns(table) {
      const key = table.toLowerCase();
      if (!tables.has(key)) {
        const rows = SAFE_NAME.test(table) ? attempt(`PRAGMA table_info("${table}")`) : null;
        tables.set(key, rows?.length ? new Map(rows.map(([, name, type]) => [name.toLowerCase(), { name, type }])) : null);
      }
      return tables.get(key);
    },
    values(table, column) {
      return attempt(`SELECT DISTINCT "${column}" FROM "${table}"`)?.map(([value]) => value) ?? null;
    },
    // En delfråga som går att köra för sig; en korrelerad ger fel och null.
    query(sql) {
      return attempt(toSqlite(sql))?.map(([value]) => value) ?? null;
    },
  };
}

function typeOf(declared) {
  const name = String(declared).trim();
  if (/^N?(VAR)?CHAR\b|^N?TEXT\b/i.test(name)) return { family: "text", sqlName: /^N/i.test(name) ? "nvarchar" : "varchar" };
  if (/^((BIG|SMALL|TINY)?INT|INTEGER|BIT)\b/i.test(name)) return { family: "number", numeric: "int" };
  if (/^(DEC|DECIMAL|NUMERIC|MONEY|SMALLMONEY)\b/i.test(name)) return { family: "number", numeric: "decimal" };
  if (/^(FLOAT|REAL)\b/i.test(name)) return { family: "number", numeric: "float" };
  return { family: null };
}

// Det SQL Server kan göra om, efter att ha tagit bort blanksteg runt värdet.
// Tom text blir 0 i int och float men inte i decimal.
const CONVERTS = {
  int: /^[+-]?\d*$/,
  decimal: /^[+-]?(\d+\.?\d*|\.\d+)$/,
  float: /^([+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?)?$/,
};
const converts = (value, numeric) => CONVERTS[numeric].test(String(value).trim());
const widest = (a, b) => ["float", "decimal", "int"].find((kind) => kind === a || kind === b);

function serverError(text, number, bad) {
  const from = text.sqlName ?? "varchar";
  if (number.numeric === "int") return `Conversion failed when converting the ${from} value '${bad}' to data type int.`;
  return `Error converting data type ${from} to ${number.numeric === "decimal" ? "numeric" : "float"}.`;
}

const WORDS = { text: "text", number: "tal" };

function describe(node) {
  const word = WORDS[node.family];
  if (node.kind === "column") return `${word}kolumnen ${node.subject}`;
  if (node.kind === "number") return `talet ${node.literal}`;
  if (node.kind === "string") return `texten '${node.literal}'`;
  if (node.kind === "subquery") return `en delfråga som ger ${word}`;
  return `ett uttryck som ger ${word}`;
}

function whyNot(node, bad, numeric) {
  const target = numeric === "int" && converts(bad, "decimal") ? "heltal" : "tal";
  if (node.kind === "string") return `Texten '${bad}' går inte att göra om till ${target}.`;
  if (node.kind === "column") return `${node.subject} innehåller värden som '${bad}' som inte går att göra om till ${target}.`;
  const who = node.kind === "subquery" ? "Delfrågan" : "Uttrycket";
  return `${who} ger värden som '${bad}', som inte går att göra om till ${target}.`;
}

const UNKNOWN = Object.freeze({ family: null });
const COMPARISONS = new Set(["=", "<>", "!=", "<", ">", "<=", ">="]);
const SET_OPERATORS = new Set(["UNION", "EXCEPT", "INTERSECT"]);
const CLAUSE_ENDS = new Set(["WHERE", "GROUP", "HAVING", "ORDER", ...SET_OPERATORS]);
const RESERVED = new Set([
  ...CLAUSE_ENDS, "ALL", "AND", "AS", "ASC", "BETWEEN", "BY", "CASE", "CROSS", "DESC", "DISTINCT", "ELSE", "END", "EXISTS",
  "FROM", "FULL", "GO", "IN", "INNER", "INTO", "IS", "JOIN", "LEFT", "LIKE", "NOT", "NULL", "ON", "OR", "OUTER", "RIGHT",
  "SELECT", "SET", "THEN", "TOP", "VALUES", "WHEN", "WITH",
]);

const COUNTING = new Set([
  "COUNT", "COUNT_BIG", "LEN", "DATALENGTH", "CHARINDEX", "PATINDEX", "DATEDIFF", "DATEPART", "YEAR", "MONTH", "DAY",
  "ROW_NUMBER", "RANK", "DENSE_RANK", "NTILE",
]);
const SAME_NUMBER = new Set(["SUM", "AVG", "ABS", "ROUND", "CEILING", "FLOOR"]);
const SAME_VALUES = new Set(["MIN", "MAX", "ISNULL"]);
const SAME_TEXT = new Set(["UPPER", "LOWER", "LTRIM", "RTRIM", "TRIM"]);
const OTHER_TEXT = new Set(["SUBSTRING", "LEFT", "RIGHT", "REPLACE", "CONCAT", "CONCAT_WS", "REVERSE", "STR", "FORMAT", "STUFF", "REPLICATE", "STRING_AGG"]);

// Frågan går inte att läsa härifrån: resten av satsen lämnas utan kontroll.
const BAIL = Symbol("bail");

// `onGiveUp` anropas när en sats inte går att läsa till slutet, så att ett test
// kan se att en lösning verkligen har kontrollerats.
export function analyzeConversions(sql, catalog, onGiveUp = () => {}) {
  const tokens = tokenize(sql).filter((token) => token.type !== "ws" && token.type !== "comment");
  const problems = [];
  const ctes = new Map();
  let at = 0;

  const peek = (offset = 0) => tokens[at + offset];
  const word = (offset = 0) => (peek(offset)?.type === "ident" ? peek(offset).text.toUpperCase() : null);
  const isMark = (text, offset = 0) => peek(offset)?.type === "op" && peek(offset).text === text;
  const accept = (text) => {
    if (word() !== text) return false;
    at++;
    return true;
  };
  const acceptMark = (text) => {
    if (!isMark(text)) return false;
    at++;
    return true;
  };
  const expectMark = (text) => {
    if (!acceptMark(text)) throw BAIL;
  };
  const spanned = (from, node) => ({ ...node, start: tokens[from].start, end: tokens[at - 1].end });

  function skipParens() {
    let depth = 0;
    do {
      if (at >= tokens.length) throw BAIL;
      if (isMark("(")) depth++;
      if (isMark(")")) depth--;
      at++;
    } while (depth > 0);
  }

  // ── Namn ──────────────────────────────────────────────────────────────
  // s.Name, [s].[Name] och dbo.Student som delar.
  function identifier() {
    const parts = [];
    for (;;) {
      const token = peek();
      if (token?.type !== "ident") throw BAIL;
      at++;
      const piece = token.text.replace(/"/g, "");
      parts.push(...piece.split(".").filter(Boolean));
      if (!acceptMark(".") && !piece.endsWith(".")) return parts;
    }
  }

  function aliasName() {
    if (accept("AS")) {
      const token = peek();
      if (token?.type !== "ident" && token?.type !== "string") throw BAIL;
      at++;
      return token.text.replace(/["']/g, "");
    }
    if (peek()?.type !== "ident" || RESERVED.has(word())) return null;
    return identifier().at(-1);
  }

  function resolve(parts, scope) {
    const column = parts.at(-1).toLowerCase();
    const qualifier = parts.at(-2)?.toLowerCase();
    for (let current = scope; current; current = current.parent) {
      const sources = qualifier ? current.sources.filter((source) => source.name === qualifier) : current.sources;
      const hits = sources.map((source) => source.column(column)).filter(Boolean);
      if (hits.length > 0) return hits.length === 1 ? hits[0] : null;
      if (sources.some((source) => source.unknown) || (qualifier && sources.length > 0)) return null;
    }
    return null;
  }

  // ── FROM ──────────────────────────────────────────────────────────────
  function tableSource(name, table) {
    const columns = catalog.columns(table);
    return {
      name,
      unknown: !columns,
      column(key) {
        const found = columns?.get(key);
        if (!found) return null;
        return { ...typeOf(found.type), kind: "column", subject: found.name, values: () => catalog.values(table, found.name) };
      },
    };
  }

  function derivedSource(name, result, columnNames = null) {
    const items = result.items.map((item, index) => (item && columnNames?.[index] ? { ...item, name: columnNames[index] } : item));
    return {
      name,
      unknown: items.includes(null),
      column: (key) => items.find((item) => item?.name?.toLowerCase() === key) ?? null,
    };
  }

  const startsJoin = () => {
    const current = word();
    if (current === "LEFT" || current === "RIGHT") return !isMark("(", 1);
    return current === "JOIN" || current === "INNER" || current === "CROSS" || current === "FULL";
  };

  function acceptJoin() {
    if (!startsJoin()) return false;
    while (word() !== "JOIN") {
      if (at >= tokens.length) throw BAIL;
      at++;
    }
    at++;
    return true;
  }

  function skipCondition() {
    let depth = 0;
    for (; at < tokens.length; at++) {
      if (isMark("(")) depth++;
      else if (isMark(")")) {
        if (depth === 0) return;
        depth--;
      } else if (depth === 0 && (isMark(",") || isMark(";") || startsJoin() || CLAUSE_ENDS.has(word()))) return;
    }
  }

  function tableFactor(scope, conditions) {
    if (isMark("(")) {
      at++;
      if (word() === "SELECT") {
        const result = query(scope.parent);
        expectMark(")");
        scope.sources.push(derivedSource((aliasName() ?? "").toLowerCase(), result));
      } else {
        joinChain(scope, conditions);
        expectMark(")");
      }
      return;
    }
    const table = identifier().at(-1);
    const name = (aliasName() ?? table).toLowerCase();
    if (word() === "WITH" && isMark("(", 1)) {
      at++;
      skipParens();
    }
    const cte = ctes.get(table.toLowerCase());
    scope.sources.push(cte ? derivedSource(name, cte.result, cte.columns) : tableSource(name, table));
  }

  function joinChain(scope, conditions) {
    tableFactor(scope, conditions);
    for (;;) {
      if (acceptMark(",")) tableFactor(scope, conditions);
      else if (acceptJoin()) {
        tableFactor(scope, conditions);
        if (accept("ON")) {
          conditions.push(at);
          skipCondition();
        }
      } else return;
    }
  }

  // ON läses efter hela FROM, så att alla tabeller i satsen är kända.
  function fromClause(scope) {
    const conditions = [];
    joinChain(scope, conditions);
    const end = at;
    for (const start of conditions) {
      at = start;
      expression(scope);
    }
    at = end;
  }

  // ── Frågor ────────────────────────────────────────────────────────────
  function findFrom() {
    let depth = 0;
    for (let i = at; i < tokens.length; i++) {
      const token = tokens[i];
      if (token.type === "op" && token.text === "(") depth++;
      else if (token.type === "op" && token.text === ")") {
        if (depth === 0) return -1;
        depth--;
      } else if (token.type === "op" && token.text === ";") return -1;
      else if (depth === 0 && token.type === "ident") {
        const current = token.text.toUpperCase();
        if (current === "FROM") return i;
        if (CLAUSE_ENDS.has(current)) return -1;
      }
    }
    return -1;
  }

  function skipSelectOptions() {
    for (;;) {
      if (accept("DISTINCT") || accept("ALL")) continue;
      if (!accept("TOP")) return;
      if (isMark("(")) skipParens();
      else at++;
      accept("PERCENT");
      if (word() === "WITH" && word(1) === "TIES") at += 2;
    }
  }

  function selectList(scope) {
    const items = [];
    do {
      if (acceptMark("*")) items.push(null);
      else if (peek()?.text.endsWith(".") && isMark("*", 1)) {
        at += 2;
        items.push(null);
      } else {
        const before = at;
        const node = expression(scope);
        if (at === before) throw BAIL;
        items.push({ ...node, name: aliasName() ?? node.subject });
      }
    } while (acceptMark(","));
    return items;
  }

  // Satserna läses före SELECT-listan, som behöver tabellerna i FROM.
  function selectPart(outer) {
    if (acceptMark("(")) {
      const result = query(outer);
      expectMark(")");
      return result;
    }
    if (!accept("SELECT")) throw BAIL;
    skipSelectOptions();
    const scope = { sources: [], parent: outer };
    const listAt = at;
    const fromAt = findFrom();
    let end = null;
    if (fromAt !== -1) {
      at = fromAt + 1;
      fromClause(scope);
      if (accept("WHERE")) expression(scope);
      if (word() === "GROUP" && word(1) === "BY") {
        at += 2;
        do expression(scope);
        while (acceptMark(","));
      }
      if (accept("HAVING")) expression(scope);
      end = at;
      at = listAt;
    }
    const items = selectList(scope);
    if (end !== null) at = end;
    return { items, scope };
  }

  function query(outer) {
    const first = selectPart(outer);
    while (SET_OPERATORS.has(word())) {
      at++;
      accept("ALL");
      selectPart(outer);
    }
    if (word() === "ORDER" && word(1) === "BY") {
      at += 2;
      do {
        expression(first.scope);
        if (!accept("ASC")) accept("DESC");
      } while (acceptMark(","));
    }
    return first;
  }

  // Står på "(" före en SELECT. Värdena är delfrågans egna om den går att köra
  // för sig, annars kolumnens.
  function subquery(scope) {
    at++;
    if (!peek()) throw BAIL;
    const from = peek().start;
    const result = query(scope);
    const to = tokens[at - 1].end;
    expectMark(")");
    const first = result.items[0];
    if (!first) return UNKNOWN;
    return { ...first, kind: "subquery", values: () => catalog.query(sql.slice(from, to)) ?? first.values?.() ?? null };
  }

  // ── Text möter tal ────────────────────────────────────────────────────
  function checkPair(a, b, operator, phrase) {
    const [text, number] = a.family === "text" && b.family === "number" ? [a, b] : [b, a];
    if (text.family !== "text" || number.family !== "number") return;
    const bad = text.values?.()?.find((value) => value !== null && !converts(value, number.numeric));
    if (bad === undefined) return;
    problems.push({
      position: operator.start,
      from: Math.min(a.start, b.start),
      to: Math.max(a.end, b.end),
      raw: serverError(text, number, bad),
      why: `${phrase(describe(a), describe(b))}. ${whyNot(text, bad, number.numeric)}`,
    });
  }

  const compare = (a, b, operator) => checkPair(a, b, operator, (left, right) => `du jämför ${left} med ${right}`);

  function arithmetic(left, right, operator) {
    checkPair(left, right, operator, (a, b) => `du räknar med ${a} och ${b}`);
    if (left.family === "text" && right.family === "text") return { family: "text", kind: "expression" };
    if (!left.family || !right.family) return UNKNOWN;
    return { family: "number", kind: "expression", numeric: widest(left.numeric, right.numeric) };
  }

  // ── Uttryck ───────────────────────────────────────────────────────────
  function expression(scope) {
    let node = conjunction(scope);
    while (accept("OR")) {
      conjunction(scope);
      node = UNKNOWN;
    }
    return node;
  }

  function conjunction(scope) {
    let node = negation(scope);
    while (accept("AND")) {
      negation(scope);
      node = UNKNOWN;
    }
    return node;
  }

  function negation(scope) {
    while (accept("NOT"));
    return predicate(scope);
  }

  function predicate(scope) {
    if (word() === "EXISTS" && isMark("(", 1)) {
      at++;
      subquery(scope);
      return UNKNOWN;
    }
    const left = additive(scope);
    if (word() === "NOT" && ["BETWEEN", "IN", "LIKE"].includes(word(1))) at++;
    const operator = peek();
    if (accept("BETWEEN")) {
      compare(left, additive(scope), operator);
      if (!accept("AND")) throw BAIL;
      compare(left, additive(scope), operator);
      return UNKNOWN;
    }
    if (accept("IN")) {
      if (!isMark("(")) throw BAIL;
      if (word(1) === "SELECT") compare(left, spannedSubquery(scope), operator);
      else {
        at++;
        do compare(left, additive(scope), operator);
        while (acceptMark(","));
        expectMark(")");
      }
      return UNKNOWN;
    }
    if (accept("LIKE")) {
      additive(scope);
      if (accept("ESCAPE")) additive(scope);
      return UNKNOWN;
    }
    if (accept("IS")) {
      accept("NOT");
      if (!accept("NULL")) throw BAIL;
      return UNKNOWN;
    }
    if (operator?.type === "op" && COMPARISONS.has(operator.text)) {
      at++;
      const quantified = ["ALL", "ANY", "SOME"].includes(word()) && isMark("(", 1);
      if (quantified) at++;
      compare(left, quantified ? spannedSubquery(scope) : additive(scope), operator);
      return UNKNOWN;
    }
    return left;
  }

  function spannedSubquery(scope) {
    const from = at;
    return spanned(from, subquery(scope));
  }

  function additive(scope) {
    const from = at;
    let left = multiplicative(scope);
    while (isMark("+") || isMark("-")) {
      const operator = peek();
      at++;
      left = spanned(from, arithmetic(left, multiplicative(scope), operator));
    }
    return left;
  }

  function multiplicative(scope) {
    const from = at;
    let left = unary(scope);
    while (isMark("*") || isMark("/") || isMark("%")) {
      const operator = peek();
      at++;
      left = spanned(from, arithmetic(left, unary(scope), operator));
    }
    return left;
  }

  function unary(scope) {
    const from = at;
    if (!isMark("-") && !isMark("+")) return primary(scope);
    const sign = peek().text === "-" ? "-" : "";
    at++;
    const node = unary(scope);
    return spanned(from, node.kind === "number" ? { ...node, literal: `${sign}${node.literal}` } : node);
  }

  function primary(scope) {
    const from = at;
    const token = peek();
    if (token?.type === "number") {
      at++;
      return spanned(from, {
        family: "number",
        kind: "number",
        literal: token.text,
        numeric: token.text.includes(".") ? "decimal" : "int",
      });
    }
    if (word() === "N" && peek(1)?.type === "string" && peek(1).start === token.end) at++;
    if (peek()?.type === "string") {
      const literal = peek().text.slice(1, -1).replace(/''/g, "'");
      at++;
      return spanned(from, { family: "text", kind: "string", literal, values: () => [literal] });
    }
    if (isMark("(")) {
      if (word(1) === "SELECT") return spanned(from, subquery(scope));
      at++;
      const inner = expression(scope);
      expectMark(")");
      return spanned(from, inner);
    }
    if (accept("NULL")) return spanned(from, UNKNOWN);
    if (word() === "CASE") return spanned(from, caseExpression(scope));
    if (word() === "CAST" && isMark("(", 1)) return spanned(from, cast(scope));
    if (word() === "CONVERT" && isMark("(", 1)) return spanned(from, convert(scope));
    if (isMark("(", 1) && token?.type === "ident" && (!RESERVED.has(word()) || word() === "LEFT" || word() === "RIGHT")) {
      return spanned(from, call(scope));
    }
    if (token?.type !== "ident" || RESERVED.has(word())) throw BAIL;
    const found = resolve(identifier(), scope);
    return spanned(from, found ?? UNKNOWN);
  }

  function call(scope) {
    const name = word();
    at += 2;
    const args = [];
    if (!isMark(")")) {
      do {
        if (!accept("DISTINCT")) accept("ALL");
        if (acceptMark("*")) args.push(UNKNOWN);
        else args.push(expression(scope));
      } while (acceptMark(","));
    }
    expectMark(")");
    if (word() === "OVER" && isMark("(", 1)) {
      at++;
      skipParens();
    }
    const first = args[0] ?? UNKNOWN;
    if (COUNTING.has(name)) return { family: "number", kind: "call", numeric: "int" };
    if (SAME_NUMBER.has(name)) return first.family === "number" ? { ...first, kind: "call", values: null } : UNKNOWN;
    if (SAME_VALUES.has(name)) return first.family ? { ...first, kind: "call" } : UNKNOWN;
    if (SAME_TEXT.has(name)) return { family: "text", kind: "call", sqlName: first.sqlName, values: first.values };
    if (OTHER_TEXT.has(name)) return { family: "text", kind: "call" };
    return UNKNOWN;
  }

  function typeName() {
    const name = word();
    if (!name) throw BAIL;
    at++;
    if (isMark("(")) skipParens();
    return typeOf(name);
  }

  function checkCast(value, target, operator) {
    if (value.family !== "text" || target.family !== "number") return;
    const bad = value.values?.()?.find((item) => item !== null && !converts(item, target.numeric));
    if (bad === undefined) return;
    problems.push({
      position: operator.start,
      from: operator.start,
      to: tokens[at - 1].end,
      raw: serverError(value, target, bad),
      why: `du gör om ${describe(value)} till tal. ${whyNot(value, bad, target.numeric)}`,
    });
  }

  function cast(scope) {
    const operator = peek();
    at += 2;
    const value = expression(scope);
    if (!accept("AS")) throw BAIL;
    const target = typeName();
    expectMark(")");
    checkCast(value, target, operator);
    return { ...target, kind: "expression" };
  }

  function convert(scope) {
    const operator = peek();
    at += 2;
    const target = typeName();
    expectMark(",");
    const value = expression(scope);
    if (acceptMark(",")) expression(scope);
    expectMark(")");
    checkCast(value, target, operator);
    return { ...target, kind: "expression" };
  }

  function caseExpression(scope) {
    at++;
    if (word() !== "WHEN") expression(scope);
    const results = [];
    while (accept("WHEN")) {
      expression(scope);
      if (!accept("THEN")) throw BAIL;
      results.push(expression(scope));
    }
    if (accept("ELSE")) results.push(expression(scope));
    if (!accept("END")) throw BAIL;
    const first = results[0] ?? UNKNOWN;
    if (!first.family || !results.every((node) => node.family === first.family)) return UNKNOWN;
    return { family: first.family, kind: "expression", numeric: first.numeric, sqlName: first.sqlName };
  }

  // ── Satser ────────────────────────────────────────────────────────────
  function withClause() {
    do {
      const name = identifier().at(-1);
      let columns = null;
      if (acceptMark("(")) {
        columns = [];
        do columns.push(identifier().at(-1));
        while (acceptMark(","));
        expectMark(")");
      }
      if (!accept("AS")) throw BAIL;
      expectMark("(");
      const result = query(null);
      expectMark(")");
      ctes.set(name.toLowerCase(), { result, columns });
    } while (acceptMark(","));
  }

  function update() {
    const table = identifier().at(-1);
    if (!accept("SET")) throw BAIL;
    const scope = { sources: [tableSource(table.toLowerCase(), table)], parent: null };
    do {
      identifier();
      expectMark("=");
      expression(scope);
    } while (acceptMark(","));
    if (accept("FROM")) fromClause(scope);
    if (accept("WHERE")) expression(scope);
  }

  function deletion() {
    accept("FROM");
    const table = identifier().at(-1);
    const scope = { sources: [tableSource((aliasName() ?? table).toLowerCase(), table)], parent: null };
    if (accept("FROM")) fromClause(scope);
    if (accept("WHERE")) expression(scope);
  }

  function statement() {
    if (accept("WITH")) withClause();
    if (word() === "SELECT" || isMark("(")) query(null);
    else if (accept("UPDATE")) update();
    else if (accept("DELETE")) deletion();
    else {
      // INSERT INTO ... SELECT och CREATE VIEW ... AS SELECT.
      const from = at;
      while (at < tokens.length && !isMark(";")) {
        if (isMark("(")) skipParens();
        else if (word() === "SELECT") {
          query(null);
          return;
        } else at++;
      }
      at = from;
    }
  }

  while (at < tokens.length) {
    try {
      statement();
    } catch (signal) {
      if (signal !== BAIL) throw signal;
      onGiveUp(at);
    }
    while (at < tokens.length && !isMark(";") && word() !== "GO") at++;
    at++;
  }

  if (problems.length === 0) return null;
  const first = problems.reduce((earliest, problem) => (problem.position < earliest.position ? problem : earliest));
  const line = sql.slice(0, first.position).split("\n").length;
  const where = sql.slice(first.from, first.to).replace(/\s+/g, " ");
  const shown = where.length > 60 ? `${where.slice(0, 59)}…` : where;
  return { raw: first.raw, line, message: `SQL Server skulle stoppa frågan på rad ${line} (${shown}): ${first.why}` };
}

// null, eller { raw, line, message } för det första stället där SQL Server
// skulle stoppa frågan. Ett fel i kontrollen får aldrig stoppa en fråga.
export function checkConversions(sql, run) {
  try {
    return analyzeConversions(sql, catalogOf(run));
  } catch {
    return null;
  }
}
