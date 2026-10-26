// Figurerna i Databaser-sammanfattningen (S.1–S.3). Samma byggstenar och
// regler som de andra begreppsfigurerna: build(W, narrow) => { h, node },
// tokens i stället för fasta färger och ett smalt format för mobilen. De
// visar samband mellan kapitlen, som bara en sammanfattning kan visa.
import {
  ConceptFigure, card, textBlock, Lines, wrap, lineHeight, Arrow, INK, PINE, BRASS,
  BRASS_TEXT, MUTED, TONE, FS, FS_SMALL, heading,
} from "./conceptFigures.jsx";

// Kod i monospace. Bredden uppskattas per tecken (monospace ≈ 0,6 em) med
// samma marginal som measure(), och radbryts på vanliga mellanslag — hårda
// mellanslag håller ihop "NOT NULL".
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const monoWidth = (text, size) => String(text).length * size * 0.6 * 1.05;
function wrapMono(text, maxW, size) {
  const lines = [];
  let current = "";
  for (const word of String(text).split(" ")) {
    const candidate = current ? `${current} ${word}` : word;
    if (!current || monoWidth(candidate, size) <= maxW) current = candidate;
    else {
      lines.push(current);
      current = word;
    }
  }
  lines.push(current);
  return lines;
}

// En ruta med kicker och blandade rader: { text } eller { code }.
function cell({ w, kicker, rows, tone = "plain", pad = 8 }) {
  const t = TONE[tone];
  const inner = w - 2 * pad;
  const kLines = kicker ? wrap(kicker, inner, FS_SMALL, 600) : [];
  const parts = rows.map((r) =>
    r.code
      ? { code: true, lines: wrapMono(r.code, inner, FS_SMALL), size: FS_SMALL }
      : { code: false, lines: wrap(r.text, inner, FS, r.bold ? 600 : 400), size: FS, bold: r.bold },
  );
  const kH = kLines.length * lineHeight(FS_SMALL);
  const bodyH = parts.reduce((sum, p) => sum + p.lines.length * lineHeight(p.size), 0) + (parts.length - 1) * 3;
  const h = pad * 2 + kH + (kH ? 3 : 0) + bodyH;
  const render = (x, y, H = h) => {
    let cy = y + (H - h) / 2 + pad;
    const nodes = [
      <rect key="r" x={x} y={y} width={w} height={H} rx={8} fill={t.fill} stroke={t.stroke} strokeWidth={1.4} />,
    ];
    if (kLines.length) {
      nodes.push(<Lines key="k" x={x + pad} y={cy} lines={kLines} size={FS_SMALL} weight={600} fill={BRASS_TEXT} maxW={inner} />);
      cy += kH + 3;
    }
    parts.forEach((p, i) => {
      if (p.code) {
        nodes.push(
          <text key={`c${i}`} fontFamily={MONO} fontSize={p.size} fill={INK}>
            {p.lines.map((line, j) => (
              <tspan key={j} x={x + pad} y={cy + p.size * 0.93 + j * lineHeight(p.size)} data-maxw={Math.round(inner)}>
                {line}
              </tspan>
            ))}
          </text>,
        );
      } else {
        nodes.push(<Lines key={`t${i}`} x={x + pad} y={cy} lines={p.lines} size={p.size} weight={p.bold ? 600 : 400} fill={p.bold ? t.title : INK} maxW={inner} />);
      }
      cy += p.lines.length * lineHeight(p.size) + 3;
    });
    return <g>{nodes}</g>;
  };
  return { w, h, render };
}

// ── S.1 Kurskartan ──────────────────────────────────────────────────────
const STAGES = [
  { title: "Krav i text", text: "Verksamhetens regler i löpande text", ch: "Kapitel 1" },
  { title: "Konceptuell design", text: "ER-diagram i Chen-notation", ch: "Kapitel 4–6", task: "Uppgift 1 · 25 p" },
  { title: "Logisk design", text: "Relationer med nycklar", ch: "Kapitel 7", task: "Tankemodellen bakom uppgift 2", quiet: true },
  { title: "Normalisering", text: "Del av logisk design: relationer i 3NF", ch: "Kapitel 8", task: "Uppgift 3 · 20 p" },
  { title: "Fysisk design", text: "CREATE TABLE med constraints", ch: "Kapitel 9", task: "Uppgift 2 · 25 p" },
  { title: "SQL", text: "En fråga mot databasen", ch: "Kapitel 10", task: "Uppgift 4 · 30 p" },
  { title: "Applikation", text: "Java via JDBC", ch: "Kapitel 11", task: "Java-frågan · en DAO-metod, poäng okänd", quiet: true },
];

function kurskartan(W, narrow) {
  const nodes = [];
  const gap = 18;
  const chipW = narrow ? 118 : 210;
  const cardW = W - chipW - (narrow ? 14 : 40);
  const cards = STAGES.map((s) => card({ w: cardW, kicker: s.ch, title: s.title, text: s.text, tone: "pine", pad: 8, titleSize: FS }));
  const chips = STAGES.map((s) => (s.task ? textBlock({ x: 0, y: 0, w: chipW - 16, text: s.task, size: FS_SMALL, weight: 600, fill: s.quiet ? MUTED : BRASS_TEXT }) : null));
  let y = 0;
  cards.forEach((c, i) => {
    const H = Math.max(c.h, chips[i] ? chips[i].h + 16 : 0);
    nodes.push(<g key={`c${i}`}>{c.render(0, y, H)}</g>);
    const chip = chips[i];
    if (chip) {
      const cx = W - chipW;
      const ch = chip.h + 12;
      const cy = y + (H - ch) / 2;
      const s = STAGES[i];
      nodes.push(
        <rect key={`cr${i}`} x={cx} y={cy} width={chipW} height={ch} rx={ch / 2 > 16 ? 10 : ch / 2}
          fill={s.quiet ? "none" : "rgb(var(--brass-rgb) / 0.12)"} stroke={s.quiet ? "var(--line-strong)" : BRASS} strokeWidth={1.3}
          strokeDasharray={s.quiet ? "5 4" : undefined} />,
      );
      nodes.push(<g key={`ct${i}`} transform={`translate(${cx + 8} ${cy + 6})`}>{chip.node}</g>);
      nodes.push(<line key={`cl${i}`} x1={cardW + 2} y1={y + H / 2} x2={cx - 2} y2={y + H / 2} stroke={s.quiet ? "var(--line-strong)" : BRASS} strokeWidth={1.2} strokeDasharray="4 3" />);
    }
    y += H;
    if (i < cards.length - 1) {
      nodes.push(<Arrow key={`a${i}`} x1={cardW / 2} y1={y + 2} x2={cardW / 2} y2={y + gap - 2} size={7} />);
      y += gap;
    }
  });
  // Grunden: relationsmodellen och nycklarna.
  const base = card({ w: W, title: "Grunden", text: "Relationsmodellen och nycklarna, kapitel 2–3", tone: "brass", align: "middle", pad: 8, titleSize: FS });
  nodes.push(<g key="base">{base.render(0, y + 14)}</g>);
  return { h: y + 14 + base.h, node: <g>{nodes}</g> };
}

// ── S.2 Tre regler genom kedjan ─────────────────────────────────────────
const COLUMNS = ["ER-diagram\nkapitel 4–6", "Logisk modell\nkapitel 7", "DDL\nkapitel 9", "Och sedan"];
const RULES = [
  {
    name: "Identifieraren",
    cells: [
      [{ text: "employeeNo är understruket" }],
      [{ code: "CK1 = {EmpNo}" }],
      [{ code: "EmpNo NOT\u00a0NULL" }, { code: "UNIQUE (EmpNo)" }],
      [{ text: "Java (kapitel 11): en dubblett ger felkod 2627" }],
    ],
  },
  {
    name: "Deltagandet",
    cells: [
      [{ text: "Dubbel linje vid Employee" }],
      [{ text: "Referensen krävs för varje anställd" }],
      [{ code: "DepartmentID INTEGER NOT\u00a0NULL" }],
      [{ text: "Gräns (kapitel 3 och 9): minst en på ett-sidan eller i M:N kan ingen constraint uttrycka" }],
    ],
    lastTone: "wrong",
  },
  {
    name: "M:N",
    cells: [
      [{ text: "WorksOn mellan Employee och Project" }],
      [{ text: "WORKS_ON med båda nycklarna som primärnyckel" }],
      [{ text: "Kopplingstabell utan" }, { code: "IDENTITY" }],
      [{ text: "SQL (kapitel 10): frågan joinar över kopplingstabellen" }],
    ],
  },
];

function treRegler(W, narrow) {
  const nodes = [];
  if (!narrow) {
    const labelW = 90;
    const gap = 14;
    const cw = (W - labelW - gap * 3) / 4;
    const x0 = labelW;
    let y = 0;
    COLUMNS.forEach((c, i) => {
      nodes.push(<g key={`h${i}`}>{textBlock({ x: x0 + i * (cw + gap), y: 0, w: cw, text: c, size: FS_SMALL, weight: 600, fill: BRASS_TEXT }).node}</g>);
    });
    y = Math.max(...COLUMNS.map((c) => wrap(c, cw, FS_SMALL, 600).length)) * lineHeight(FS_SMALL) + 8;
    RULES.forEach((rule, r) => {
      const cells = rule.cells.map((rows, i) => cell({ w: cw, rows, tone: i === 3 && rule.lastTone ? rule.lastTone : i === 3 ? "correct" : "plain" }));
      const H = Math.max(...cells.map((c) => c.h));
      const label = textBlock({ x: 0, y: 0, w: labelW - 4, text: rule.name, size: FS, weight: 600, fill: PINE });
      nodes.push(<g key={`l${r}`} transform={`translate(0 ${y + (H - label.h) / 2})`}>{label.node}</g>);
      cells.forEach((c, i) => {
        const x = x0 + i * (cw + gap);
        nodes.push(<g key={`c${r}${i}`}>{c.render(x, y, H)}</g>);
        if (i > 0) nodes.push(<Arrow key={`a${r}${i}`} x1={x - gap + 1} y1={y + H / 2} x2={x - 1} y2={y + H / 2} size={6} />);
      });
      y += H + 14;
    });
    return { h: y - 14, node: <g>{nodes}</g> };
  }
  // Smalt: varje regel som en egen kolumn uppifrån och ned.
  let y = 0;
  RULES.forEach((rule, r) => {
    const h = heading({ x: 0, y, w: W, text: rule.name, fill: PINE });
    nodes.push(<g key={`h${r}`}>{h.node}</g>);
    y += h.h + 6;
    rule.cells.forEach((rows, i) => {
      const c = cell({ w: W, kicker: COLUMNS[i].replace("\n", " · "), rows, tone: i === 3 && rule.lastTone ? rule.lastTone : i === 3 ? "correct" : "plain" });
      nodes.push(<g key={`c${r}${i}`}>{c.render(0, y)}</g>);
      y += c.h;
      if (i < 3) {
        nodes.push(<Arrow key={`a${r}${i}`} x1={W / 2} y1={y + 2} x2={W / 2} y2={y + 14} size={6} />);
        y += 16;
      }
    });
    y += r < RULES.length - 1 ? 22 : 0;
  });
  return { h: y, node: <g>{nodes}</g> };
}

// ── S.3 Beslutsvägen i uppgift 3 ────────────────────────────────────────
// Huvudspåret går nedåt; varje fråga har ett utfall åt sidan (brett) eller
// indraget under sig (smalt).
const PATH = [
  { kind: "step", title: "Hitta alla kandidatnycklar", text: "Attribut som inte står till höger om någon pil ingår i varje nyckel." },
  { kind: "step", title: "Dela in attributen", text: "Primärattribut och icke-primärattribut." },
  { kind: "q", title: "1. Är någon kandidatnyckel sammansatt?", side: { kicker: "Nej", text: "2NF kan inte brytas. Gå till fråga 3." }, down: "Ja" },
  { kind: "q", title: "2. Beror ett icke-primärattribut på en äkta delmängd av den?", side: { kicker: "Ja", text: "Högsta normalform: 1NF" , tone: "wrong" }, down: "Nej" },
  { kind: "q", title: "3. Beror ett icke-primärattribut transitivt på en kandidatnyckel?", side: { kicker: "Ja", text: "Högsta normalform: 2NF", tone: "wrong" }, down: "Nej" },
  { kind: "end", title: "3NF: ange det och stanna", text: "Ingen motivering krävs, och varje uppdelning vore övernormalisering." },
];

function beslutsvagen(W, narrow) {
  const nodes = [];
  const mainW = narrow ? W : 330;
  const sideX = narrow ? 22 : mainW + 46;
  const sideW = narrow ? W - 22 : W - sideX;
  const gap = 26;
  let y = 0;
  PATH.forEach((p, i) => {
    const tone = p.kind === "q" ? "brass" : p.kind === "end" ? "correct" : "pine";
    const c = card({ w: mainW, title: p.title, text: p.text, tone, pad: 8, titleSize: FS });
    let H = c.h;
    let side = null;
    if (p.side) side = card({ w: sideW, kicker: p.side.kicker, text: p.side.text, tone: p.side.tone || "plain", pad: 8 });
    if (side && !narrow) H = Math.max(H, side.h);
    nodes.push(<g key={`m${i}`}>{c.render(0, y, H)}</g>);
    if (side && !narrow) {
      nodes.push(<g key={`s${i}`}>{side.render(sideX, y + (H - side.h) / 2)}</g>);
      nodes.push(<Arrow key={`sa${i}`} x1={mainW + 2} y1={y + H / 2} x2={sideX - 2} y2={y + H / 2} size={7} color={BRASS} />);
      y += H;
    } else if (side) {
      y += H + 8;
      nodes.push(<path key={`sl${i}`} d={`M8,${y - 8} V${y + side.h / 2} H${sideX - 2}`} fill="none" stroke={BRASS} strokeWidth={1.3} />);
      nodes.push(<g key={`s${i}`}>{side.render(sideX, y)}</g>);
      y += side.h;
    } else {
      y += H;
    }
    if (i < PATH.length - 1) {
      const ax = narrow ? W / 2 : mainW / 2;
      nodes.push(<Arrow key={`a${i}`} x1={ax} y1={y + 2} x2={ax} y2={y + gap - 2} size={7} />);
      if (p.down) nodes.push(<g key={`d${i}`}>{textBlock({ x: ax + 8, y: y + 5, w: 40, text: p.down, size: FS_SMALL, weight: 600, fill: INK }).node}</g>);
      y += gap;
    }
  });
  const note = card({
    w: W,
    title: "Inte i 3NF?",
    text: "Bryt ut beroendena till relationer med vänsterledet som primärnyckel, sträva efter lossless join och dependency preservation, och stanna när varje relation är i 3NF.",
    tone: "plain",
    pad: 8,
    titleSize: FS,
  });
  nodes.push(<g key="note">{note.render(0, y + 18)}</g>);
  return { h: y + 18 + note.h, node: <g>{nodes}</g> };
}

// ── Registrering ────────────────────────────────────────────────────────
const fig = (id, build) => {
  const Component = () => <ConceptFigure id={id} build={build} />;
  Component.displayName = `Figur(${id})`;
  return Component;
};

export const DATABASER_SUMMARY_FIGURES = {
  "db-kurskartan": fig("db-kurskartan", kurskartan),
  "db-tre-regler": fig("db-tre-regler", treRegler),
  "db-beslutsvagen": fig("db-beslutsvagen", beslutsvagen),
};
