// ⌘K ⌘F i kodrutorna för Java och DDL: indraget räknas om rad för rad. I
// DDL ändras bara blanktecken i radernas början och slut; i Java läggs också
// radbrytningar och mellanrum som i VS Code (tidyJava nedan). Strängar och
// kommentarers text ändras aldrig, så formateringen går att lita på och att
// ångra. SQL-frågor har en egen formaterare (lib/sqlIndent.js).
//
// Java följer lösningsförslagen (data/databaser/javaTasks.js): fyra blanksteg
// per {, åtta efter en rad som slutar med ( och tillbaka till den radens
// nivå vid ), åtta för en sats som fortsätter på nästa rad (+ "FROM …"),
// fyra för en if, for, while, else eller do utan klamrar, och en parentes som
// står öppen mitt på raden (try med två resurser) får nästa rad rakt under
// det som följer efter parentesen. DDL: ett steg innanför parentesen och
// ett till för en rad som fortsätter förra raden (CONSTRAINT … / PRIMARY KEY …).

const OPEN = { "(": ")", "{": "}", "[": "]" };
const CLOSE = { ")": "(", "}": "{", "]": "[" };
const ENDS_STATEMENT = new Set([";", "{", "}", ":"]);
const CONTROL = /^(if|else|for|while|do)$/;

// Raderna med det formateraren behöver veta: parenteser och klamrar utanför
// strängar och kommentarer (med kolumn), första och sista kodtecknet, första
// ordet, och om raden börjar eller slutar inne i en kommentar, ett Java-
// textblock eller en SQL-sträng över flera rader.
function scanLines(text, java) {
  let state = null;
  return text.split("\n").map((raw) => {
    const line = { raw, startsIn: state, tokens: [], code: false, first: null, last: null, head: null, annotation: false };
    let opening = true; // bara slutande parenteser hittills, som i "} else"
    let lastBracket = null;
    const note = (ch, bracket = null) => {
      if (!line.code) {
        line.code = true;
        line.first = ch;
      }
      line.last = ch;
      lastBracket = bracket;
      if (!CLOSE[ch]) opening = false;
    };
    const n = raw.length;
    let i = 0;
    while (i < n) {
      if (state === "comment") {
        const end = raw.indexOf("*/", i);
        if (end < 0) break;
        state = null;
        i = end + 2;
        continue;
      }
      if (state === "textblock" || state === "string") {
        let j = i;
        if (state === "textblock") {
          while (j < n && !raw.startsWith('"""', j)) j += raw[j] === "\\" ? 2 : 1;
        } else {
          while (j < n && !(raw[j] === "'" && raw[j + 1] !== "'")) j += raw[j] === "'" ? 2 : 1;
        }
        if (j >= n) break;
        i = j + (state === "textblock" ? 3 : 1);
        state = null;
        note("x");
        continue;
      }
      const ch = raw[i];
      if (/\s/.test(ch)) {
        i++;
      } else if (ch === "/" && raw[i + 1] === "*") {
        state = "comment";
        i += 2;
      } else if (java ? raw.startsWith("//", i) : raw.startsWith("--", i)) {
        break;
      } else if (java && raw.startsWith('"""', i)) {
        state = "textblock";
        i += 3;
        note("x");
      } else if (!java && ch === "'") {
        state = "string";
        i++;
        note("x");
      } else if (ch === '"' || (java && ch === "'")) {
        let j = i + 1;
        while (j < n && raw[j] !== ch) j += java && raw[j] === "\\" ? 2 : 1;
        i = j + 1;
        note("x");
      } else if (!java && ch === "[") {
        const end = raw.indexOf("]", i);
        i = end < 0 ? n : end + 1;
        note("x");
      } else if (OPEN[ch] || CLOSE[ch]) {
        const token = { ch, col: i, end: false };
        line.tokens.push(token);
        note(ch, token);
        i++;
      } else if (/[\p{L}_$]/u.test(ch)) {
        let j = i + 1;
        while (j < n && /[\p{L}\p{N}_$]/u.test(raw[j])) j++;
        if (opening && !line.head) line.head = raw.slice(i, j);
        note("x");
        i = j;
      } else {
        if (java && ch === "@" && !line.code) line.annotation = true;
        note(ch === ";" || ch === "," || ch === ":" ? ch : "x");
        i++;
      }
    }
    if (lastBracket) lastBracket.end = true;
    line.endsIn = state;
    return line;
  });
}

const leadOf = (raw) => raw.length - raw.trimStart().length;

// DDL: steget som raderna direkt innanför en parentes oftast har (2–8
// blanksteg), så att den som skriver med fyra som facit och den som skriver
// med två som rutans mall båda får behålla sitt. Annars rutans eget.
function detectWidth(lines, fallback) {
  const counts = new Map();
  let depth = 0;
  for (const line of lines) {
    const lead = leadOf(line.raw);
    if (depth === 1 && line.code && !line.startsIn && !CLOSE[line.first] && !line.raw.slice(0, lead).includes("\t") && lead >= 2 && lead <= 8) {
      counts.set(lead, (counts.get(lead) ?? 0) + 1);
    }
    for (const token of line.tokens) depth = Math.max(0, depth + (OPEN[token.ch] ? 1 : -1));
  }
  let best = fallback;
  let most = 0;
  for (const [width, count] of counts) {
    if (count > most || (count === most && width === fallback)) {
      best = width;
      most = count;
    }
  }
  return best;
}

export function reindent(text, { width = 4, after = {}, continuation = 1, statements = false, java = false } = {}) {
  const lines = scanLines(text, java);
  const step = (ch) => (after[ch] ?? 1) * width;
  const visual = (lead) => [...lead].reduce((sum, ch) => sum + (ch === "\t" ? width : 1), 0);
  const frame = (open, indent, close, aligned = false) => ({
    open, block: open === null || open === "{", aligned, indent, close,
    stmtOpen: false, stmtIndent: indent, stmtHead: null, itemOpen: false,
  });
  const stack = [frame(null, 0, 0)];
  const nearest = (open) => {
    for (let k = stack.length - 1; k > 0; k--) if (stack[k].open === open) return k;
    return -1;
  };
  let shift = 0; // flyttningen för raderna i en kommentar över flera rader

  return lines
    .map((line) => {
      const top = stack[stack.length - 1];
      const lead = leadOf(line.raw);
      const body = line.endsIn === "string" || line.endsIn === "textblock" ? line.raw.slice(lead) : line.raw.trim();
      let indent;
      let out;
      if (line.startsIn === "textblock" || line.startsIn === "string") {
        // Strängens innehåll: raden står kvar som den är.
        indent = lead;
        out = line.raw;
      } else if (line.startsIn === "comment") {
        indent = Math.max(0, visual(line.raw.slice(0, lead)) + shift);
        out = body ? " ".repeat(indent) + body : "";
      } else if (!body) {
        return "";
      } else {
        const closer = line.code && CLOSE[line.first] ? line.first : null;
        if (closer) {
          const k = nearest(CLOSE[closer]);
          indent = k > 0 ? stack[k].close : top.indent;
        } else if (top.block) {
          const continues = statements && top.stmtOpen && line.first !== "{";
          indent = top.indent + (continues ? (CONTROL.test(top.stmtHead ?? "") ? 1 : continuation) * width : 0);
          if (line.code && !top.stmtOpen) {
            top.stmtIndent = indent;
            top.stmtHead = line.head;
          }
        } else {
          indent = top.indent + (!top.aligned && top.itemOpen && line.code ? continuation * width : 0);
        }
        out = " ".repeat(indent) + body;
        if (line.endsIn === "comment") shift = indent - visual(line.raw.slice(0, lead));
      }

      for (const token of line.tokens) {
        if (CLOSE[token.ch]) {
          const k = nearest(CLOSE[token.ch]);
          if (k > 0) stack.length = k;
          continue;
        }
        const cur = stack[stack.length - 1];
        if (token.ch === "{" && cur.block) {
          stack.push(frame("{", cur.stmtIndent + step("{"), cur.stmtIndent));
        } else if (token.end) {
          stack.push(frame(token.ch, indent + step(token.ch), indent));
        } else {
          stack.push(frame(token.ch, indent + token.col - lead + 1, indent, true));
        }
      }

      if (line.code) {
        const now = stack[stack.length - 1];
        if (now.block) {
          const annotationOnly = line.annotation && (line.last === "x" || line.last === ")");
          now.stmtOpen = statements && !ENDS_STATEMENT.has(line.last) && !annotationOnly;
        } else {
          now.itemOpen = !(line.last === "," || line.last === ";" || OPEN[line.last]);
        }
      }
      return out;
    })
    .join("\n");
}

// ---------- Java: radbrytningar och mellanrum som i VS Code ----------
//
// Före indraget läggs koden ut som VS Code:s Java-formaterare (Eclipse-
// stilen) gör: "{" sist på raden (inte på egen rad), "}" på egen rad,
// "} else", "} catch" och "} finally" på samma rad, en sats per rad,
// mellanrum runt operatorer, efter komma och efter if/for/while/try/catch,
// inget mellanrum innanför parenteser eller före "(" i ett metodanrop, högst
// en tom rad i följd och ingen direkt efter "{" eller före "}". Bara
// blanktecken mellan tecknen ändras: strängar, tecken och kommentarer står
// orörda, och en radbrytning efter en //-kommentar tas aldrig bort.

const JAVA_OPS = ["...", "->", "::", "++", "--", "&&", "||", "==", "!=", "<=", ">=", "+=", "-=", "*=", "/=", "%=", "&=", "|=", "^="];
const BINARY = new Set(["=", "==", "!=", "<", ">", "<=", ">=", "+", "-", "*", "/", "%", "&&", "||", "&", "|", "^", "+=", "-=", "*=", "/=", "%=", "&=", "|=", "^=", "?", ":", "->"]);
const PAREN_KEYWORDS = new Set(["if", "for", "while", "switch", "catch", "synchronized", "try", "return", "throw", "else", "case", "assert", "yield", "do"]);
const UNARY_AFTER = new Set(["return", "case", "throw", "yield", "else", "assert"]);
const GENERIC_PARTS = new Set([",", ".", "?", "&", "[", "]", "<", ">"]);

function lexJava(text) {
  const tokens = [];
  const n = text.length;
  let i = 0;
  let gap = "";
  const push = (type, value) => {
    tokens.push({ type, value, nl: (gap.match(/\n/g) || []).length, sp: gap.length > 0 });
    gap = "";
  };
  while (i < n) {
    const ch = text[i];
    if (/\s/.test(ch)) {
      gap += ch;
      i++;
      continue;
    }
    let j;
    if (text.startsWith("//", i)) {
      j = text.indexOf("\n", i);
      if (j < 0) j = n;
      push("line-comment", text.slice(i, j));
    } else if (text.startsWith("/*", i)) {
      j = text.indexOf("*/", i + 2);
      j = j < 0 ? n : j + 2;
      push("comment", text.slice(i, j));
    } else if (text.startsWith('"""', i)) {
      j = i + 3;
      while (j < n && !text.startsWith('"""', j)) j += text[j] === "\\" ? 2 : 1;
      j = Math.min(n, j + 3);
      push("string", text.slice(i, j));
    } else if (ch === '"' || ch === "'") {
      j = i + 1;
      while (j < n && text[j] !== ch && text[j] !== "\n") j += text[j] === "\\" ? 2 : 1;
      if (text[j] === ch) j++;
      j = Math.min(j, n);
      push("string", text.slice(i, j));
    } else if (/[0-9]/.test(ch)) {
      j = i + 1;
      while (j < n && /[\p{L}\p{N}_.]/u.test(text[j])) j++;
      push("word", text.slice(i, j));
    } else if (/[\p{L}_$]/u.test(ch)) {
      j = i + 1;
      while (j < n && /[\p{L}\p{N}_$]/u.test(text[j])) j++;
      push("word", text.slice(i, j));
    } else {
      const op = JAVA_OPS.find((o) => text.startsWith(o, i)) ?? ch;
      j = i + op.length;
      push("op", op);
    }
    i = j;
  }
  return { tokens, trailing: gap };
}

// "<" och ">" i en typ (ArrayList<Product>, new ArrayList<>()) markeras som
// generiska: de får inga mellanrum, till skillnad från jämförelser.
function markGenerics(tokens) {
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.value !== "<" || t.generic) continue;
    const prev = tokens[i - 1];
    if (!prev || (prev.type !== "word" && prev.value !== ".")) continue;
    let depth = 0;
    let end = -1;
    for (let k = i; k < tokens.length; k++) {
      const x = tokens[k];
      if (x.value === "<") depth++;
      else if (x.value === ">") {
        depth--;
        if (depth === 0) {
          end = k;
          break;
        }
      } else if (!(x.type === "word" && !/^[0-9]/.test(x.value)) && !GENERIC_PARTS.has(x.value)) break;
    }
    if (end < 0) continue;
    for (let k = i; k <= end; k++) if (tokens[k].value === "<" || tokens[k].value === ">" || tokens[k].value === "?" || tokens[k].value === "&") tokens[k].generic = true;
  }
}

const isValue = (t) => t && (t.type === "word" || t.type === "string" || t.value === ")" || t.value === "]" || (t.value === ">" && t.generic));

function spaceBetween(a, b, ctx) {
  if (b.type === "line-comment" || b.type === "comment") return a.type === "comment" && !b.sp ? 0 : 1;
  if (a.type === "comment") return b.sp ? 1 : 0;
  const av = a.value;
  const bv = b.value;
  if (bv === "," || bv === ";") return 0;
  if (av === "," || av === ";") return 1;
  if (av === "." || bv === "." || av === "::" || bv === "::" || av === "@") return 0;
  if (bv === "...") return 0;
  if (av === "...") return 1;
  if (av === "(" || av === "[") return 0;
  if (bv === ")" || bv === "]") return 0;
  if (a.generic && av === "<") return 0;
  if (b.generic && (bv === "<" || bv === ">")) return 0;
  if (a.generic && av === ">") return bv === "(" || bv === "[" || bv === ">" ? 0 : 1;
  if (a.generic && (av === "?" || av === "&")) return bv === ">" ? 0 : 1;
  if (b.generic && (bv === "?" || bv === "&")) return 1;
  if (a.unary) return 0;
  if (bv === "++" || bv === "--") return b.postfix ? 0 : 1;
  if ((av === "++" || av === "--") && !a.postfix) return 0;
  if (bv === ":" && ctx.caseLabel) return 0;
  if (BINARY.has(bv) && !b.unary) return 1;
  if (BINARY.has(av)) return 1;
  if (bv === "!" || bv === "~") return av === "(" ? 0 : 1;
  if (av === "!" || av === "~") return 0;
  if (bv === "(") return a.type === "word" ? (PAREN_KEYWORDS.has(av) ? 1 : 0) : av === ")" || av === "]" ? 0 : 1;
  if (bv === "[") return a.type === "word" || av === "]" || av === ")" ? 0 : 1;
  if (bv === "{") return 1;
  if (av === "{") return bv === "}" ? 0 : 1;
  if (bv === "}") return 1;
  if (av === "}") return 1;
  if ((a.type === "word" || a.type === "string") && (b.type === "word" || b.type === "string")) return 1;
  if ((av === ")" || av === "]") && (b.type === "word" || b.type === "string")) return 1;
  return b.sp ? 1 : 0;
}

export function tidyJava(text) {
  const { tokens, trailing } = lexJava(text);
  if (!tokens.length) return text.trim() ? text : "";
  markGenerics(tokens);

  // Unära och postfixa operatorer, och klamrarnas slag (block eller
  // initierare, som new int[] { 1, 2 }).
  const braces = [];
  let paren = 0;
  let caseLine = false;
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    const prev = tokens[i - 1];
    if (t.nl) caseLine = false;
    if (t.type === "word" && (t.value === "case" || t.value === "default")) caseLine = true;
    t.caseLabel = caseLine && t.value === ":";
    if (t.type !== "op") continue;
    if ((t.value === "-" || t.value === "+") && !(isValue(prev) && !UNARY_AFTER.has(prev.value)) && !(prev && (prev.value === "++" || prev.value === "--") && prev.postfix)) t.unary = true;
    if (t.value === "!" || t.value === "~") t.unary = true;
    if ((t.value === "++" || t.value === "--") && isValue(prev) && !UNARY_AFTER.has(prev.value)) t.postfix = true;
    if (t.value === "(" || t.value === "[") paren++;
    if (t.value === ")" || t.value === "]") paren = Math.max(0, paren - 1);
    if (t.value === "{") {
      const outer = braces[braces.length - 1];
      const init = paren > 0 || (prev && (prev.value === "=" || prev.value === "]" || prev.value === "->" || ((prev.value === "{" || prev.value === ",") && outer && !outer.block)));
      const brace = { block: !init, isDo: prev?.value === "do", paren };
      t.brace = brace;
      braces.push(brace);
    } else if (t.value === "}") {
      t.brace = braces.pop() ?? { block: true, isDo: false, paren };
    }
  }

  // Radbrytningarna.
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    const prev = tokens[i - 1];
    t.nl = Math.min(t.nl, 2);
    if (!prev) {
      t.nl = 0;
      continue;
    }
    if (t.value === "{" && t.brace.block && t.nl > 0 && prev.type !== "line-comment" && prev.type !== "comment" && ![";", "{", "}"].includes(prev.value)) t.nl = 0;
    if (prev.value === "{" && prev.brace.block) {
      if (t.value === "}" && t.nl === 0) {
        // {} står kvar
      } else if (t.type === "line-comment" && t.nl === 0) {
        // { // kommentar
      } else t.nl = 1;
    }
    if (t.value === "}" && t.brace.block && prev.value !== "{") t.nl = 1;
    if (prev.value === "}" && prev.brace.block) {
      if (["else", "catch", "finally"].includes(t.value) || (t.value === "while" && prev.brace.isDo)) t.nl = 0;
      else if ([";", ")", ",", "."].includes(t.value)) t.nl = 0;
      else if (!(t.type === "line-comment" && t.nl === 0)) t.nl = Math.max(t.nl, 1);
    }
    if (prev.type === "line-comment") t.nl = Math.max(t.nl, 1);
  }
  // En sats per rad: efter ";" utanför parenteser.
  paren = 0;
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    const prev = tokens[i - 1];
    if (prev?.value === ";" && paren === 0 && t.nl === 0 && t.type !== "line-comment") t.nl = 1;
    if (t.value === "(" || t.value === "[") paren++;
    if (t.value === ")" || t.value === "]") paren = Math.max(0, paren - 1);
  }

  let out = "";
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (i > 0) out += t.nl > 0 ? "\n".repeat(t.nl) : " ".repeat(spaceBetween(tokens[i - 1], t, t));
    out += t.value;
  }
  return trailing.includes("\n") ? `${out}\n` : out;
}

export const formatJava = (text) =>
  reindent(tidyJava(text), { width: 4, after: { "{": 1, "(": 2, "[": 2 }, continuation: 2, statements: true, java: true });

// DDL-rutan drar in två blanksteg (mallen och Tab); den som skriver med
// fyra, som facit, får behålla fyra.
export const formatDdl = (text, fallback = 2) => {
  const width = detectWidth(scanLines(text, false), fallback);
  return reindent(text, { width, after: { "(": 1 }, continuation: 1 });
};
