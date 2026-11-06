// ⌘K ⌘F i kodrutorna för Java och DDL: indraget räknas om rad för rad. Bara
// blanktecken i radernas början och slut ändras, aldrig radbrytningar,
// strängar eller kommentarers text, så att formateringen går att lita på
// och att ångra. SQL-frågor har en egen formaterare (lib/sqlIndent.js).
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

export const formatJava = (text) =>
  reindent(text, { width: 4, after: { "{": 1, "(": 2, "[": 2 }, continuation: 2, statements: true, java: true });

// DDL-rutan drar in två blanksteg (mallen och Tab); den som skriver med
// fyra, som facit, får behålla fyra.
export const formatDdl = (text, fallback = 2) => {
  const width = detectWidth(scanLines(text, false), fallback);
  return reindent(text, { width, after: { "(": 1 }, continuation: 1 });
};
