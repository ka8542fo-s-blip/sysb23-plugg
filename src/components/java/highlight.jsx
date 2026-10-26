// Syntaxfärgning för kodblocken och kodrutan i fliken Java: nyckelord,
// strängar och kommentarer, i Java eller SQL. Färgerna är husets tokens på
// den mörka kodytan (bg-code, mörk i båda temana), uträknade mot den i båda
// temana: mässing för nyckelord (5,2:1 ljust, 8,3:1 mörkt), grönt blandat
// med kodtexten för strängar (6,1:1 / 11,1:1) och kodtexten på 65 % för
// kommentarer (6,9:1 / 6,3:1). Inga egna färger.
//
// Tolken är tolerant: en sträng som inte stängs slutar vid radslutet, en
// kommentar som inte stängs vid textens slut. Den ändrar aldrig texten —
// tokenernas text i följd är exakt koden, så att färglagret i kodrutan
// ligger tecken för tecken under textfältet.

const JAVA_KEYWORDS = new Set(
  ("abstract assert boolean break byte case catch char class const continue default do double else enum " +
    "extends final finally float for goto if implements import instanceof int interface long native new " +
    "package private protected public record return short static strictfp super switch synchronized this " +
    "throw throws transient try var void volatile while yield true false null").split(" "),
);

const SQL_KEYWORDS = new Set(
  ("ADD ALTER AND AS ASC BETWEEN BY CHAR CHECK CONSTRAINT COUNT CREATE DATE DECIMAL DEFAULT DELETE DESC " +
    "DISTINCT DROP FOREIGN FROM GROUP HAVING IDENTITY IN INNER INSERT INT INTEGER INTO IS JOIN KEY LEFT LIKE " +
    "NOT NULL ON OR ORDER PRIMARY REFERENCES SELECT SET TABLE TOP UNIQUE UPDATE VALUES VARCHAR WHERE").split(" "),
);

const STRING_COLOR = "color-mix(in srgb, rgb(var(--correct-rgb)) 60%, rgb(var(--code-ink-rgb)))";

export function tokenize(code, lang) {
  const tokens = [];
  let plain = "";
  const push = (kind, text) => {
    if (plain) tokens.push({ kind: "plain", text: plain });
    plain = "";
    tokens.push({ kind, text });
  };
  const lineComment = lang === "sql" ? "--" : "//";
  let i = 0;
  while (i < code.length) {
    const ch = code[i];
    if (code.startsWith("/*", i)) {
      const end = code.indexOf("*/", i + 2);
      const stop = end < 0 ? code.length : end + 2;
      push("comment", code.slice(i, stop));
      i = stop;
      continue;
    }
    if (code.startsWith(lineComment, i)) {
      const end = code.indexOf("\n", i);
      const stop = end < 0 ? code.length : end;
      push("comment", code.slice(i, stop));
      i = stop;
      continue;
    }
    if (ch === '"' || ch === "'") {
      // Java: "…" och '…' med \-escape, aldrig över radslut. SQL: '…' med ''.
      let j = i + 1;
      if (lang === "sql") {
        while (j < code.length && code[j] !== "\n") {
          if (code[j] === ch) {
            if (code[j + 1] === ch) { j += 2; continue; }
            break;
          }
          j++;
        }
      } else {
        while (j < code.length && code[j] !== ch && code[j] !== "\n") {
          if (code[j] === "\\" && j + 1 < code.length && code[j + 1] !== "\n") j++;
          j++;
        }
      }
      const stop = code[j] === ch ? j + 1 : j;
      push("string", code.slice(i, stop));
      i = stop;
      continue;
    }
    if (/[A-Za-z_$@]/.test(ch)) {
      let j = i + 1;
      while (j < code.length && /[\w$]/.test(code[j])) j++;
      const word = code.slice(i, j);
      const keyword = lang === "sql"
        ? SQL_KEYWORDS.has(word.toUpperCase())
        : JAVA_KEYWORDS.has(word) || (word.startsWith("@") && word.length > 1);
      if (keyword) push("keyword", word);
      else plain += word;
      i = j;
      continue;
    }
    plain += ch;
    i++;
  }
  if (plain) tokens.push({ kind: "plain", text: plain });
  return tokens;
}

// Koden som spans, färgade efter sort. Vanlig text ärver färgen (text-code-ink).
export function Highlighted({ code, lang }) {
  return tokenize(code, lang).map((t, i) => {
    if (t.kind === "keyword") return <span key={i} className="text-brass">{t.text}</span>;
    if (t.kind === "string") return <span key={i} style={{ color: STRING_COLOR }}>{t.text}</span>;
    if (t.kind === "comment") return <span key={i} className="text-code-ink/65">{t.text}</span>;
    return <span key={i}>{t.text}</span>;
  });
}
