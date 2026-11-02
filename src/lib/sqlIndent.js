// Indrag i SQL-editorn. Ren logik utan DOM, så att reglerna går att testa;
// components/sql/SqlEditor.jsx lägger ändringarna i textfältet.
//
// Stilen är sajtens (samma som tentafacit i oldExams.js): kodstandarden säger
// inget om indrag i frågor, tentorna har inget facit och häftet ingen SQL.
// Föreläsning 2-3 har JOIN i vänsterkanten och tre blanksteg, se HANDOFF. Här:
// fyra blanksteg per steg, SELECT/FROM/WHERE/GROUP BY/HAVING/ORDER BY på
// frågans nivå, JOIN och AND/OR ett steg in, en delfrågas innehåll ett steg
// in från raden som öppnar parentesen och ")" tillbaka på den radens nivå.
export const STEP = 4;
const PAD = " ".repeat(STEP);

// En ändring av texten: `from`–`to` byts mot `insert`, markören hamnar på
// selStart–selEnd i den nya texten. null = ingen ändring.
const edit = (from, to, insert, selStart, selEnd = selStart) => ({ from, to, insert, selStart, selEnd });

// --- Tokens -----------------------------------------------------------------

const WORD = /[\p{L}\p{N}_#@$.]/u;

// Whitespace blir inga tokens. `nl` räknar radbrytningarna före token, `gap`
// säger om det stod något blanktecken där: mer ska formateraren inte veta.
function tokenize(text) {
  const tokens = [];
  let i = 0;
  let nl = 0;
  let gap = false;
  const push = (type, end) => {
    tokens.push({ type, start: i, end, text: text.slice(i, end), nl, gap });
    i = end;
    nl = 0;
    gap = false;
  };
  const closing = (mark, from) => {
    const at = text.indexOf(mark, from);
    return at < 0 ? text.length : at + mark.length;
  };

  while (i < text.length) {
    const char = text[i];
    if (char === "\n") nl++;
    if (/\s/.test(char)) {
      gap = true;
      i++;
    } else if (char === "-" && text[i + 1] === "-") {
      const end = text.indexOf("\n", i);
      push("comment", end < 0 ? text.length : end);
    } else if (char === "/" && text[i + 1] === "*") {
      push("comment", closing("*/", i + 2));
    } else if (char === "'" || char === '"') {
      // '' inuti en sträng blir två strängar i rad utan mellanrum, vilket
      // skrivs ut precis som det stod.
      push("string", closing(char, i + 1));
    } else if (char === "[") {
      push("string", closing("]", i + 1));
    } else if (WORD.test(char)) {
      let end = i + 1;
      while (end < text.length && WORD.test(text[end])) end++;
      push("word", end);
    } else {
      push("mark", i + 1);
    }
  }
  return tokens;
}

const isWord = (token, re) => token?.type === "word" && re.test(token.text);
const CLAUSE = /^(SELECT|FROM|WHERE|HAVING)$/i;
const TWO_WORD = /^(GROUP|ORDER)$/i;
const SET_OP = /^(UNION|EXCEPT|INTERSECT)$/i;
const JOIN_LEAD = /^(INNER|LEFT|RIGHT|FULL|CROSS)$/i;

function nextCode(tokens, i) {
  let at = i + 1;
  while (tokens[at]?.type === "comment") at++;
  return tokens[at];
}

const isClauseAt = (tokens, i) =>
  isWord(tokens[i], CLAUSE) ||
  (isWord(tokens[i], TWO_WORD) && isWord(nextCode(tokens, i), /^BY$/i));

const isJoinAt = (tokens, i) =>
  isWord(tokens[i], /^JOIN$/i) ||
  (isWord(tokens[i], JOIN_LEAD) && isWord(nextCode(tokens, i), /^(JOIN|OUTER)$/i));

// JOIN i "INNER JOIN" börjar inte något eget, det gjorde INNER.
const isJoinTail = (tokens, i) =>
  isWord(tokens[i], /^(JOIN|OUTER)$/i) && isWord(tokens[i - 1], /^(INNER|LEFT|RIGHT|FULL|CROSS|OUTER)$/i);

const frame = (kind, closeLevel) => ({ kind, closeLevel, clause: null, between: false, cases: 0 });

// --- Var i frågan står vi? --------------------------------------------------

const indentAt = (text, at) => {
  const lineStart = text.lastIndexOf("\n", at - 1) + 1;
  return width(/^[ \t]*/.exec(text.slice(lineStart))[0]);
};
const width = (lead) => [...lead].reduce((sum, c) => sum + (c === "\t" ? STEP : 1), 0);

// Går igenom texten fram till `at`: öppna parenteser (med indraget på raden
// som öppnade dem), senaste satsord på samma nivå, och om `at` står inuti en
// sträng eller kommentar.
function scan(text, at) {
  const stack = [frame("top", -STEP)];
  let inside = false;
  const tokens = tokenize(text);
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.start >= at) break;
    if (token.end > at) {
      inside = token.type !== "word" && token.type !== "mark";
      break;
    }
    // En obruten sträng eller kommentar sist i texten fortsätter till `at`.
    if (token.end === at && token.type !== "word" && token.type !== "mark" && unterminated(token)) inside = true;
    const top = stack[stack.length - 1];
    if (token.text === "(") stack.push(frame("paren", indentAt(text, token.start)));
    else if (token.text === ")") {
      if (stack.length > 1) stack.pop();
    } else if (token.text === ";") {
      stack.length = 1;
      stack[0] = frame("top", -STEP);
    } else if (isClauseAt(tokens, i)) {
      top.clause = { word: token.text.toUpperCase(), indent: indentAt(text, token.start) };
      top.between = false;
    } else if (isWord(token, SET_OP)) top.clause = null;
    else if (isWord(token, /^BETWEEN$/i)) top.between = true;
    else if (isWord(token, /^AND$/i)) top.between = false;
    else if (isWord(token, /^CASE$/i)) top.cases++;
    else if (isWord(token, /^END$/i) && top.cases > 0) top.cases--;
  }
  return { top: stack[stack.length - 1], inside };
}

function unterminated(token) {
  const { type, text } = token;
  if (type !== "string" && type !== "comment") return false;
  if (text.startsWith("--")) return true;
  if (text.startsWith("/*")) return !(text.length >= 4 && text.endsWith("*/"));
  const mark = text[0] === "[" ? "]" : text[0];
  return text.length < 2 || !text.endsWith(mark);
}

// Indraget en rad som börjar på `lineStart` med `head` ska ha (ett ord från
// lineHead eller ")"), eller null om raden ska stå kvar.
function targetIndent(text, lineStart, head) {
  const { top, inside } = scan(text, lineStart);
  if (inside) return null;
  if (head === ")") return top.kind === "top" ? null : top.closeLevel;
  const level = top.closeLevel + STEP; // top: -STEP + STEP = vänsterkanten
  if (/^(SELECT|FROM|WHERE|GROUP|HAVING|ORDER)$/.test(head)) return level;
  if (/^(INNER|LEFT|RIGHT|FULL|CROSS)? ?(OUTER )?JOIN$/.test(head)) {
    return top.clause?.word === "FROM" ? top.clause.indent + STEP : null;
  }
  if (head === "AND" || head === "OR") {
    if (top.between || top.cases > 0) return null;
    return /^(WHERE|HAVING)$/.test(top.clause?.word) ? top.clause.indent + STEP : null;
  }
  return null;
}

// Radens inledande ord, om det är ett ord som har en bestämd plats. Kräver
// hela ordet: OR ska inte slå till på väg mot ORDER BY.
function lineHead(code) {
  const text = code.trim().toUpperCase().replace(/\s+/g, " ");
  const join = /^((?:INNER|LEFT|RIGHT|FULL|CROSS)(?: OUTER)? JOIN|JOIN)(?![\p{L}\p{N}_.])/u.exec(text);
  if (join) return join[1];
  const word = /^(SELECT|FROM|WHERE|GROUP|HAVING|ORDER|AND|OR)(?![\p{L}\p{N}_.])/u.exec(text);
  return word ? word[1] : null;
}

const lineStartOf = (text, at) => text.lastIndexOf("\n", at - 1) + 1;

// Sätter den aktuella radens indrag. Rör bara den raden.
function moveLine(text, lineStart, target, caret) {
  const lead = /^[ \t]*/.exec(text.slice(lineStart))[0];
  const indent = " ".repeat(target);
  if (lead === indent) return null;
  return edit(lineStart, lineStart + lead.length, indent, caret - lead.length + indent.length);
}

// --- Tangenterna ------------------------------------------------------------

const words = (code) => code.trim().toUpperCase().replace(/\s+/g, " ");

// Består raden av bara ett ord med bestämd plats? GROUP BY och ORDER BY räknas
// som GROUP och ORDER.
function soleHead(code) {
  const text = words(code).replace(/^(GROUP|ORDER) BY$/, "$1");
  return lineHead(text) === text ? text : null;
}

// Efter att ett tecken skrivits, med markören direkt efter det: blanksteg
// eller "(" avslutar ordet som inleder raden, och ")" först på raden hoppar
// tillbaka. Hanteras efter tecknet, så att Ctrl/Cmd + Z först tar bort hoppet.
export function afterTyped(text, caret, char) {
  const lineStart = lineStartOf(text, caret);
  const before = text.slice(lineStart, caret);
  const code = before.slice(0, -1);
  let head = null;
  if (char === ")") head = code.trim() === "" ? ")" : null;
  else if ((char === " " || char === "(") && !/\s$/.test(code)) head = soleHead(code);
  if (!head) return null;
  const target = targetIndent(text, lineStart, head);
  return target === null ? null : moveLine(text, lineStart, target, caret);
}

// Enter: samma indrag som raden ovanför, ett steg extra efter "(". Texten
// efter markören flyttar med ner och får sin plats om den börjar med ett
// satsord. Ett ord som avslutas med Enter (JOIN på egen rad) får också sin.
export function enter(text, start, end) {
  const lineStart = lineStartOf(text, start);
  const before = text.slice(lineStart, start);
  const lineEnd = text.indexOf("\n", end);
  const after = text.slice(end, lineEnd < 0 ? text.length : lineEnd);
  const skipped = /^[ \t]*/.exec(after)[0].length;
  const rest = after.slice(skipped);

  const lead = /^[ \t]*/.exec(before)[0];
  const code = before.slice(lead.length);
  const head = soleHead(code);
  const moved = head ? targetIndent(text, lineStart, head) : null;
  const own = moved ?? width(lead);
  const { inside } = scan(text, start);
  const opens = !scan(text, lineStart).inside && endsWithOpenParen(code);

  // ( | ) blir tre rader, med markören indragen på den mittersta.
  if (opens && rest.startsWith(")")) {
    const inner = " ".repeat(own + STEP);
    return edit(start, end + skipped, `\n${inner}\n${" ".repeat(own)}`, start + 1 + inner.length);
  }

  let below = own + (opens ? STEP : 0);
  const restHead = rest.startsWith(")") ? ")" : lineHead(rest);
  if (restHead && !inside) {
    const target = targetIndent(`${text.slice(0, start)}\n`, start + 1, restHead);
    if (target !== null) below = target;
  }
  const indent = " ".repeat(below);
  if (moved !== null && moved !== width(lead)) {
    const insert = `${" ".repeat(moved)}${code}\n${indent}`;
    return edit(lineStart, end + skipped, insert, lineStart + insert.length);
  }
  return edit(start, end + skipped, `\n${indent}`, start + 1 + indent.length);
}

// Radens kod slutar med "(" (en kommentar efter parentesen räknas inte).
function endsWithOpenParen(code) {
  const tokens = tokenize(code).filter((token) => token.type !== "comment");
  return tokens[tokens.length - 1]?.text === "(";
}

// Tab och Shift+Tab: exakt ett steg, på alla rader markeringen täcker. En
// markering som slutar först på en rad tar inte med den raden. Utan
// markering mitt i text skriver Tab ett steg blanksteg där markören står.
export function shift(text, start, end, direction) {
  const first = lineStartOf(text, start);
  const endAt = end > start && text[end - 1] === "\n" ? end - 1 : end;
  let last = text.indexOf("\n", endAt);
  if (last < 0) last = text.length;
  const block = text.slice(first, last);
  const multi = block.includes("\n");

  if (direction > 0 && !multi && start === end) {
    if (text.slice(first, start).trim() !== "") return edit(start, end, PAD, start + STEP);
    return edit(first, first, PAD, start + STEP);
  }

  const delta = [];
  const lines = block.split("\n").map((line, index) => {
    if (direction > 0) {
      const add = line.trim() || !multi ? STEP : 0;
      delta[index] = add;
      return " ".repeat(add) + line;
    }
    const remove = line[0] === "\t" ? 1 : Math.min(STEP, /^ */.exec(line)[0].length);
    delta[index] = -remove;
    return line.slice(remove);
  });
  const next = lines.join("\n");
  if (next === block) return null;

  const firstDelta = delta[0];
  if (start === end) {
    const caret = Math.max(first, start + firstDelta);
    return edit(first, last, next, caret);
  }
  const total = next.length - block.length;
  return edit(first, last, next, Math.max(first, start + firstDelta), Math.max(first, end + total));
}

// Backspace i indragsytan tar ett helt steg: ner till närmaste jämna steg.
export function backspace(text, start, end) {
  if (start !== end) return null;
  const lineStart = lineStartOf(text, start);
  const before = text.slice(lineStart, start);
  if (!before || /[^ ]/.test(before)) return null;
  const remove = before.length % STEP || STEP;
  return edit(start - remove, start, "", start - remove);
}

// --- Formatera --------------------------------------------------------------

// Hela texten i stilen ovan. Ändrar bara blanktecken utanför strängar och
// kommentarer. Radbrytningar inuti en sats står kvar (en SELECT-lista på flera
// rader förblir det) och får ett steg in. Annat än SELECT och WITH, som
// CREATE TABLE och INSERT, lämnas orört: där finns ingen stil att följa här.
export function formatSql(text) {
  const tokens = tokenize(text);
  const out = [];
  let i = 0;
  while (i < tokens.length) {
    let end = i;
    let depth = 0;
    while (end < tokens.length) {
      if (tokens[end].text === "(") depth++;
      else if (tokens[end].text === ")") depth = Math.max(0, depth - 1);
      else if (tokens[end].text === ";" && depth === 0) break;
      end++;
    }
    const stop = Math.min(end, tokens.length - 1);
    const statement = tokens.slice(i, stop + 1);
    const first = statement.find((token) => token.type !== "comment");
    const blankBefore = i > 0 && tokens[i].nl > 1;
    out.push((blankBefore ? "\n" : "") + (
      isWord(first, /^(SELECT|WITH)$/i)
        ? formatStatement(statement)
        : text.slice(statement[0].start, statement[statement.length - 1].end)
    ));
    i = stop + 1;
  }
  return out.join("\n");
}

function formatStatement(tokens) {
  const lines = [];
  let line = "";
  let lineLevel = 0;
  let cont = 0; // indraget för en radbrytning som inget satsord kräver
  const stack = [frame("top", -1)];
  const breakAt = (level) => {
    if (line) lines.push(line);
    line = " ".repeat(level * STEP);
    lineLevel = level;
  };
  const write = (token) => {
    const fresh = !line.trim();
    if (!fresh && token.gap) line += " ";
    line += token.text;
    // En radkommentar äter allt som står efter den på raden.
    if (token.text.startsWith("--")) {
      lines.push(line);
      line = "";
    }
  };

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const top = stack[stack.length - 1];
    const clauseLevel = top.closeLevel + 1;
    const structural = top.kind !== "paren"; // inte FROM i EXTRACT(... FROM ...)

    if (token.text === "(" && token.type === "mark") {
      if (token.nl) breakAt(cont);
      write(token);
      const opensQuery = isWord(nextCode(tokens, i), /^(SELECT|WITH)$/i);
      stack.push({ ...frame(opensQuery ? "query" : "paren", lineLevel), cont });
      cont = lineLevel + 1;
      continue;
    }
    if (token.text === ")" && token.type === "mark") {
      const closing = stack.length > 1 ? stack.pop() : null;
      if (closing && (closing.kind === "query" || token.nl)) breakAt(closing.closeLevel);
      else if (token.nl) breakAt(cont);
      if (closing) cont = closing.kind === "query" ? closing.closeLevel + 1 : closing.cont;
      write(token);
      continue;
    }
    if (token.text === ";" && line.trim()) {
      line += ";";
      continue;
    }

    const clause = structural && (isClauseAt(tokens, i) || isWord(token, SET_OP));
    const join = structural && isJoinAt(tokens, i) && !isJoinTail(tokens, i);
    const logic =
      structural &&
      isWord(token, /^(AND|OR)$/i) &&
      /^(WHERE|HAVING)$/.test(top.clause) &&
      !top.between &&
      top.cases === 0;

    if (clause) {
      if (line.trim() || i > 0) breakAt(clauseLevel);
      cont = clauseLevel + 1;
      top.clause = isWord(token, SET_OP) ? null : token.text.toUpperCase();
      top.between = false;
    } else if (join || logic) {
      breakAt(clauseLevel + 1);
      cont = clauseLevel + 2;
    } else if (token.type === "comment" && token.nl) {
      const next = i + 1;
      const toClause = next < tokens.length && (isClauseAt(tokens, next) || isWord(tokens[next], SET_OP));
      breakAt(i === 0 ? 0 : toClause && structural ? clauseLevel : cont);
    } else if (token.nl || !line) {
      if (i > 0) breakAt(cont);
    }

    if (isWord(token, /^BETWEEN$/i)) top.between = true;
    else if (isWord(token, /^AND$/i)) top.between = false;
    else if (isWord(token, /^CASE$/i)) top.cases++;
    else if (isWord(token, /^END$/i) && top.cases > 0) top.cases--;
    write(token);
  }
  if (line.trim()) lines.push(line);
  return lines.join("\n");
}
