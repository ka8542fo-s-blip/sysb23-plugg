// Byggstenar för kompendiernas begreppsfigurer (lager, steg, cykler,
// matriser, skalor, jämförelser och hierarkier). Varje figur ritas i två
// format: brett (WIDE, för skärmar från 640 px) och smalt (NARROW, för
// mobilen), så att texten aldrig blir mindre än cirka 12 px. Layouten räknas
// fram i JS: textens bredd uppskattas per tecken och radbryts, rutorna får
// höjd efter sin text. Varje tspan bär data-maxw, så att kontrollskriptet
// kan mäta den verkliga textbredden mot utrymmet.
//
// Färgerna är sajtens tokens (index.css). Appen har ett enda ljust tema, så
// tokens används rakt av i stället för currentColor.
import { CONCEPT_FIGURES } from "./conceptFigureMeta.js";

export const WIDE = 640;
export const NARROW = 340;
export const FS = 13; // brödtext i figurerna
export const FS_TITLE = 14; // rubriker i rutor
export const FS_SMALL = 12.5; // etiketter; lägsta storleken i smalt format

export const INK = "var(--ink)";
export const PINE = "var(--pine)";
export const BRASS = "var(--brass)";
export const BRASS_TEXT = "#7a5d14"; // mässing som text, med läsbar kontrast
export const LINE = "var(--line)";
export const MUTED = "rgba(34,40,42,0.66)";
export const ARROW = "rgba(34,40,42,0.55)";

export const TONE = {
  pine: { stroke: PINE, fill: "rgba(31,78,69,0.07)", title: PINE, text: INK },
  brass: { stroke: BRASS, fill: "rgba(185,147,47,0.12)", title: BRASS_TEXT, text: INK },
  plain: { stroke: "#cfc9ba", fill: "white", title: INK, text: INK },
  correct: { stroke: "var(--correct)", fill: "var(--correct-bg)", title: "var(--correct)", text: INK },
  wrong: { stroke: "var(--wrong)", fill: "var(--wrong-bg)", title: "var(--wrong)", text: INK },
  solid: { stroke: PINE, fill: PINE, title: "white", text: "white" },
  ghost: { stroke: "#cfc9ba", fill: "none", title: INK, text: INK, dash: "5 4" },
};

// ── Text ────────────────────────────────────────────────────────────────
// Ungefärliga teckenbredder i em för sajtens sans-serif (Inter).
const NARROW_CHARS = new Set("iljtfrI.,:;'()[]|!1 ·");
const WIDE_CHARS = new Set("mwMWåäöÅÄÖ@%");
function charWidth(ch) {
  if (NARROW_CHARS.has(ch)) return 0.31;
  if (WIDE_CHARS.has(ch)) return /[åäöÅÄÖ]/.test(ch) ? 0.6 : 0.86;
  if (/[A-Z]/.test(ch)) return 0.67;
  if (/[0-9]/.test(ch)) return 0.6;
  if (/[→⟷←↓↑]/.test(ch)) return 1;
  return 0.56;
}

// Uppskattad bredd utan marginal; används när texten tvingas till exakt den
// bredden med textLength (relationer med understrykningar).
export function measureRaw(text, size = FS, weight = 400) {
  let em = 0;
  for (const ch of String(text)) em += charWidth(ch);
  return em * size * (weight >= 600 ? 1.025 : 1); // kalibrerat mot Inter i Chrome
}

// 5 % marginal: uppskattningen ska hellre bryta en rad för tidigt än för sent.
export function measure(text, size = FS, weight = 400) {
  return measureRaw(text, size, weight) * 1.05;
}

// Radbryter girigt på ordgräns. Ett ord som ensamt är för långt får en egen rad.
export function wrap(text, maxW, size = FS, weight = 400) {
  if (!text) return [];
  const lines = [];
  for (const paragraph of String(text).split("\n")) {
    let current = "";
    // Delar bara på vanliga mellanslag, så att hårda mellanslag (\u00a0) håller ihop.
    for (const word of paragraph.split(/[ \t]+/).filter(Boolean)) {
      const candidate = current ? `${current} ${word}` : word;
      if (!current || measure(candidate, size, weight) <= maxW) current = candidate;
      else {
        lines.push(current);
        current = word;
      }
    }
    lines.push(current);
  }
  return lines;
}

export const lineHeight = (size) => Math.round(size * 1.32 * 10) / 10;
export const textHeight = (lines, size) => lines.length * lineHeight(size);

// Textblock med överkanten i y. anchor: start | middle | end.
export function Lines({ x, y, lines, size = FS, weight = 400, fill = INK, anchor = "start", maxW, italic = false }) {
  if (!lines?.length) return null;
  const lh = lineHeight(size);
  return (
    <text fontSize={size} fontWeight={weight} fill={fill} textAnchor={anchor} fontStyle={italic ? "italic" : undefined}>
      {lines.map((line, i) => (
        <tspan key={i} x={x} y={y + size * 0.93 + i * lh} data-maxw={maxW ? Math.round(maxW) : undefined}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

// Fri text som radbryts inom bredden w. Returnerar { h, node }.
export function textBlock({ x, y, w, text, size = FS, weight = 400, fill = INK, anchor = "start", italic = false }) {
  const lines = wrap(text, w, size, weight);
  const ax = anchor === "middle" ? x + w / 2 : anchor === "end" ? x + w : x;
  return {
    h: textHeight(lines, size),
    node: <Lines x={ax} y={y} lines={lines} size={size} weight={weight} fill={fill} anchor={anchor} maxW={w} italic={italic} />,
  };
}

// ── Rutor ───────────────────────────────────────────────────────────────
// Två steg: mät först (h), rita sedan med en gemensam höjd för en rad rutor.
// opts: { w, title, text, tone, align, pad, titleSize, textSize, rx }
export function card(opts) {
  const {
    w, title, text, tone = "pine", align = "start", pad = 10,
    titleSize = FS_TITLE, textSize = FS, rx = 8, kicker,
  } = opts;
  const t = TONE[tone] || TONE.pine;
  const inner = w - 2 * pad;
  const kLines = kicker ? wrap(kicker, inner, FS_SMALL, 600) : [];
  const tLines = title ? wrap(title, inner, titleSize, 600) : [];
  const xLines = text ? wrap(text, inner, textSize) : [];
  const gap1 = kLines.length && (tLines.length || xLines.length) ? 2 : 0;
  const gap2 = tLines.length && xLines.length ? 4 : 0;
  const h = pad * 2 + textHeight(kLines, FS_SMALL) + gap1 + textHeight(tLines, titleSize) + gap2 + textHeight(xLines, textSize);
  const render = (x, y, H = h) => {
    // Texten centreras lodrätt när rutan är högre än innehållet.
    const top = y + (H - h) / 2 + pad;
    const tx = align === "middle" ? x + w / 2 : x + pad;
    const kH = textHeight(kLines, FS_SMALL);
    const tH = textHeight(tLines, titleSize);
    return (
      <g>
        <rect x={x} y={y} width={w} height={H} rx={rx} fill={t.fill} stroke={t.stroke} strokeWidth={1.4} strokeDasharray={t.dash} />
        <Lines x={tx} y={top} lines={kLines} size={FS_SMALL} weight={600} fill={t.title === "white" ? "white" : BRASS_TEXT} anchor={align} maxW={inner} />
        <Lines x={tx} y={top + kH + gap1} lines={tLines} size={titleSize} weight={600} fill={t.title} anchor={align} maxW={inner} />
        <Lines x={tx} y={top + kH + gap1 + tH + gap2} lines={xLines} size={textSize} fill={t.text} anchor={align} maxW={inner} />
      </g>
    );
  };
  return { w, h, render };
}

// ── Pilar ───────────────────────────────────────────────────────────────
function head(x, y, angle, size, color) {
  const a1 = angle + Math.PI - 0.42;
  const a2 = angle + Math.PI + 0.42;
  const p = (a) => `${x + Math.cos(a) * size},${y + Math.sin(a) * size}`;
  return <polygon points={`${x},${y} ${p(a1)} ${p(a2)}`} fill={color} />;
}

export function Arrow({ x1, y1, x2, y2, color = ARROW, width = 1.6, dashed = false, size = 8, both = false }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const ex = x2 - Math.cos(angle) * size * 0.6;
  const ey = y2 - Math.sin(angle) * size * 0.6;
  const sx = both ? x1 + Math.cos(angle) * size * 0.6 : x1;
  const sy = both ? y1 + Math.sin(angle) * size * 0.6 : y1;
  return (
    <g>
      <line x1={sx} y1={sy} x2={ex} y2={ey} stroke={color} strokeWidth={width} strokeDasharray={dashed ? "5 4" : undefined} />
      {head(x2, y2, angle, size, color)}
      {both && head(x1, y1, angle + Math.PI, size, color)}
    </g>
  );
}

// Böjd pil (kvadratisk Bézier) med pilspets i tangentens riktning.
export function CurvedArrow({ x1, y1, cx, cy, x2, y2, color = ARROW, width = 1.6, dashed = false, size = 8 }) {
  const angle = Math.atan2(y2 - cy, x2 - cx);
  const ex = x2 - Math.cos(angle) * size * 0.6;
  const ey = y2 - Math.sin(angle) * size * 0.6;
  return (
    <g>
      <path d={`M${x1},${y1} Q${cx},${cy} ${ex},${ey}`} fill="none" stroke={color} strokeWidth={width} strokeDasharray={dashed ? "5 4" : undefined} />
      {head(x2, y2, angle, size, color)}
    </g>
  );
}

// ── Layouter ────────────────────────────────────────────────────────────
// En rad rutor med samma bredd och höjd, valfritt med pilar emellan.
export function row(specs, { x = 0, y = 0, w, gap = 14, arrows = false }) {
  const n = specs.length;
  const cw = (w - gap * (n - 1)) / n;
  const cards = specs.map((s) => card({ ...s, w: cw }));
  const H = Math.max(...cards.map((c) => c.h));
  const node = (
    <g>
      {cards.map((c, i) => (
        <g key={i}>{c.render(x + i * (cw + gap), y, H)}</g>
      ))}
      {arrows && cards.slice(1).map((_, i) => {
        const ax = x + (i + 1) * (cw + gap);
        return <Arrow key={`a${i}`} x1={ax - gap + 2} y1={y + H / 2} x2={ax - 2} y2={y + H / 2} size={7} />;
      })}
    </g>
  );
  return { h: H, node, cw, positions: cards.map((_, i) => ({ x: x + i * (cw + gap), y, w: cw, h: H })) };
}

// En kolumn rutor med full bredd, valfritt med pilar nedåt emellan.
export function column(specs, { x = 0, y = 0, w, gap = 12, arrows = false, sameHeight = false }) {
  const cards = specs.map((s) => card({ ...s, w }));
  const H = sameHeight ? Math.max(...cards.map((c) => c.h)) : null;
  let cy = y;
  const parts = [];
  const positions = [];
  cards.forEach((c, i) => {
    const h = H ?? c.h;
    parts.push(<g key={i}>{c.render(x, cy, h)}</g>);
    positions.push({ x, y: cy, w, h });
    if (arrows && i < cards.length - 1) {
      parts.push(<Arrow key={`a${i}`} x1={x + w / 2} y1={cy + h + 2} x2={x + w / 2} y2={cy + h + gap - 2} size={7} />);
    }
    cy += h + gap;
  });
  return { h: cy - y - gap, node: <g>{parts}</g>, positions };
}

// Stegflöde: rad med pilar i brett format, kolumn med pilar i smalt.
export function flow(specs, { x = 0, y = 0, w, narrow, gap }) {
  return narrow
    ? column(specs, { x, y, w, gap: gap ?? 22, arrows: true })
    : row(specs, { x, y, w, gap: gap ?? 26, arrows: true });
}

// Rubrik ovanför en figurdel, i mässing och versaler som kapitlens etiketter.
export function heading({ x, y, w, text, anchor = "start", fill = BRASS_TEXT }) {
  return textBlock({ x, y, w, text: text.toUpperCase(), size: FS_SMALL, weight: 600, fill, anchor });
}

// Staplar delar lodrätt: varje del är en funktion (y) => { h, node }.
export function stack(parts, { y = 0, gap = 14 } = {}) {
  let cy = y;
  const nodes = [];
  parts.filter(Boolean).forEach((part, i) => {
    const r = part(cy);
    nodes.push(<g key={i}>{r.node}</g>);
    cy += r.h + gap;
  });
  return { h: cy - y - gap, node: <g>{nodes}</g> };
}

// ── Ramen ───────────────────────────────────────────────────────────────
function Svg({ id, variant, w, h, title, desc, children, className }) {
  const tid = `${id}-${variant}-titel`;
  const did = `${id}-${variant}-beskr`;
  return (
    <svg
      viewBox={`0 0 ${w} ${Math.ceil(h)}`}
      role="img"
      aria-labelledby={`${tid} ${did}`}
      className={`mx-auto h-auto w-full ${className}`}
      style={{ maxWidth: variant === "bred" ? 680 : 420 }}
      fontFamily="inherit"
      data-figure-variant={variant}
    >
      <title id={tid}>{title}</title>
      <desc id={did}>{desc}</desc>
      {children}
    </svg>
  );
}

// build(W, narrow) => { h, node }. Figurtext, källa och tillgänglighetstexter
// kommer ur conceptFigureMeta.js, så att testet kan läsa dem utan JSX.
export function ConceptFigure({ id, build, pad = 2 }) {
  const meta = CONCEPT_FIGURES[id];
  const wide = build(WIDE, false);
  const narrow = build(NARROW, true);
  return (
    <figure className="my-8" data-tts-skip data-concept-figure={id}>
      <Svg id={id} variant="bred" w={WIDE} h={wide.h + pad * 2} title={meta.title} desc={meta.desc} className="hidden sm:block">
        <g transform={`translate(0,${pad})`}>{wide.node}</g>
      </Svg>
      <Svg id={id} variant="smal" w={NARROW} h={narrow.h + pad * 2} title={meta.title} desc={meta.desc} className="sm:hidden">
        <g transform={`translate(0,${pad})`}>{narrow.node}</g>
      </Svg>
      <figcaption className="mx-auto mt-3 max-w-reading text-sm leading-relaxed text-ink/70">
        <span className="font-medium text-ink">Figur {meta.number}</span> — {meta.caption}
        <span className="mt-0.5 block text-[13px] text-ink/60">{meta.source}</span>
      </figcaption>
    </figure>
  );
}

// ── Cykel ───────────────────────────────────────────────────────────────
// Brett: rutorna på en ellips med böjda pilar medurs. Smalt: en kolumn med
// pilar nedåt och en returpil längs högerkanten från sista till första.
// items: [{ title, text, tone }], center: valfri text i mitten (brett).
export function cycle(items, { W, narrow, cardW = 150, center, ry: ryOpt }) {
  if (narrow) {
    const colW = W - 34;
    const col = column(items.map((it) => ({ ...it, tone: it.tone || "pine", pad: 8 })), { w: colW, gap: 18, arrows: true });
    const first = col.positions[0];
    const last = col.positions[col.positions.length - 1];
    const node = (
      <g>
        {col.node}
        <path d={`M${colW},${last.y + last.h / 2} H${W - 8} V${first.y + first.h / 2} H${colW + 8}`} fill="none" stroke={BRASS} strokeWidth={1.6} />
        {head(colW + 2, first.y + first.h / 2, Math.PI, 8, BRASS)}
      </g>
    );
    return { h: col.h, node };
  }
  const n = items.length;
  const cards = items.map((it) => card({ ...it, w: cardW, tone: it.tone || "pine", pad: 8, titleSize: FS_TITLE - 1 }));
  const H = Math.max(...cards.map((c) => c.h));
  const rx = (W - cardW) / 2 - 2;
  const ry = ryOpt ?? Math.max(120, H * 1.9);
  const cx = W / 2;
  const cy = ry + H / 2;
  const pts = items.map((_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return { x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a), a };
  });
  const arrows = pts.map((p, i) => {
    const q = pts[(i + 1) % n];
    // Pilen går mellan rutornas kanter, böjd utåt från mitten.
    const mid = (p.a + (i + 1 === n ? q.a + 2 * Math.PI : q.a)) / 2;
    const bend = { x: cx + (rx + 30) * Math.cos(mid), y: cy + (ry + 30) * Math.sin(mid) };
    const edge = (from, to) => {
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const sx = Math.abs(dx) > 0 ? (cardW / 2 + 4) / Math.abs(dx) : Infinity;
      const sy = Math.abs(dy) > 0 ? (H / 2 + 4) / Math.abs(dy) : Infinity;
      const s = Math.min(sx, sy, 1);
      return { x: from.x + dx * s, y: from.y + dy * s };
    };
    const a = edge(p, bend);
    const b = edge(q, bend);
    return <CurvedArrow key={`c${i}`} x1={a.x} y1={a.y} cx={bend.x} cy={bend.y} x2={b.x} y2={b.y} color={BRASS} width={1.6} />;
  });
  const centerBlock = center ? textBlock({ x: cx - 110, y: cy - 20, w: 220, text: center, size: FS, fill: MUTED, anchor: "middle", italic: true }) : null;
  return {
    h: cy + ry + H / 2 + 4,
    node: (
      <g>
        {arrows}
        {cards.map((c, i) => <g key={i}>{c.render(pts[i].x - cardW / 2, pts[i].y - H / 2, H)}</g>)}
        {centerBlock && <g transform={`translate(0 ${-centerBlock.h / 2 + 10})`}>{centerBlock.node}</g>}
      </g>
    ),
  };
}

// ── Tidslinje ───────────────────────────────────────────────────────────
// Brett: lodrät axel i mitten med rutorna växelvis till vänster och höger.
// Smalt: axeln till vänster och rutorna till höger.
// items: [{ when, title, text, tone }]
export function timeline(items, { W, narrow, gap = 10 }) {
  const nodes = [];
  if (narrow) {
    const ax = 84;
    const cw = W - ax - 16;
    let y = 0;
    items.forEach((it, i) => {
      const c = card({ w: cw, title: it.title, text: it.text, tone: it.tone || "plain", pad: 8, titleSize: FS_TITLE - 1 });
      const when = wrap(it.when, ax - 14, FS_SMALL, 600);
      nodes.push(<g key={`c${i}`}>{c.render(ax + 16, y)}</g>);
      nodes.push(<circle key={`d${i}`} cx={ax} cy={y + 16} r={5} fill={BRASS} />);
      nodes.push(<Lines key={`w${i}`} x={ax - 10} y={y + 9} lines={when} size={FS_SMALL} weight={600} fill={BRASS_TEXT} anchor="end" maxW={ax - 14} />);
      y += Math.max(c.h, textHeight(when, FS_SMALL) + 12) + gap;
    });
    nodes.unshift(<line key="axis" x1={ax} y1={4} x2={ax} y2={y - gap - 4} stroke={BRASS} strokeWidth={2} />);
    return { h: y - gap, node: <g>{nodes}</g> };
  }
  const ax = W / 2;
  const cw = ax - 92;
  // En gemensam markör håller ordningen kronologisk; varje sida har sin egen
  // nederkant så att rutorna på samma sida inte överlappar.
  let cursor = 0;
  const bottom = { left: -Infinity, right: -Infinity };
  items.forEach((it, i) => {
    const side = i % 2 === 0 ? "left" : "right";
    const left = side === "left";
    const c = card({ w: cw, title: it.title, text: it.text, tone: it.tone || "plain", pad: 8, titleSize: FS_TITLE - 1 });
    const y = Math.max(cursor, bottom[side] + gap);
    const x = left ? ax - 82 - cw : ax + 82;
    nodes.push(<g key={`c${i}`}>{c.render(x, y)}</g>);
    nodes.push(<line key={`l${i}`} x1={left ? x + cw : ax} y1={y + 16} x2={left ? ax : x} y2={y + 16} stroke={BRASS} strokeWidth={1.2} />);
    nodes.push(<circle key={`d${i}`} cx={ax} cy={y + 16} r={5} fill={BRASS} />);
    nodes.push(<Lines key={`w${i}`} x={left ? ax + 10 : ax - 10} y={y + 2} lines={wrap(it.when, 70, FS_SMALL, 600)} size={FS_SMALL} weight={600} fill={BRASS_TEXT} anchor={left ? "start" : "end"} maxW={72} />);
    bottom[side] = y + c.h;
    cursor = y + 34;
  });
  const h = Math.max(bottom.left, bottom.right);
  nodes.unshift(<line key="axis" x1={ax} y1={4} x2={ax} y2={h} stroke={BRASS} strokeWidth={2} />);
  return { h, node: <g>{nodes}</g> };
}
