// Figurerna i BPM-sammanfattningen (S.1–S.4). Samma byggstenar och regler som
// processFigures.jsx: build(W, narrow) => { h, node }, tokens i stället för
// fasta färger, och smalt format för mobilen. 7FE-tidslinjen och nyttotråden
// delar geometri (phaseTimeline), så att de läses som samma linje.
import {
  ConceptFigure, card, textBlock, Lines, measure, lineHeight, Arrow, INK, PINE, BRASS,
  BRASS_TEXT, MUTED, LINE_STRONG, SURFACE, FS, FS_SMALL, heading,
} from "./conceptFigures.jsx";
import { EventShape, GatewayShape } from "../bpmn/BpmnDiagram.jsx";

const clamp = (value, lo, hi) => Math.min(Math.max(value, lo), hi);

// ── S.1 Processkedjan ───────────────────────────────────────────────────
const STEPS = [
  { kicker: "Försäljning", title: "Tar emot ordern" },
  { kicker: "Lager", title: "Plockar och packar" },
  { kicker: "Ekonomi", title: "Tar betalt" },
  { kicker: "Transport", title: "Levererar" },
];

function Customer({ cx, cy }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={22} fill={SURFACE} stroke={INK} strokeWidth={1.5} />
      <Lines x={cx} y={cy - 8} lines={["Kund"]} size={FS_SMALL} weight={600} anchor="middle" maxW={40} />
    </g>
  );
}

function processkedjan(W, narrow) {
  const nodes = [];
  const spec = (s) => ({ ...s, tone: "pine", align: "middle", pad: 8, titleSize: FS, textSize: FS });
  if (!narrow) {
    const frameLabel = textBlock({ x: 70, y: 0, w: W - 140, text: "BPM: styr och förbättrar hela kedjan", size: FS_SMALL, weight: 600, fill: PINE });
    nodes.push(<g key="fl">{frameLabel.node}</g>);
    const frameTop = frameLabel.h + 6;
    const fx = 58;
    const fw = W - 2 * fx;
    const gap = 18;
    const bw = (fw - 24 - gap * 3) / 4;
    const cards = STEPS.map((s) => card({ ...spec(s), w: bw }));
    const H = Math.max(...cards.map((c) => c.h));
    const by = frameTop + 14;
    const cy = by + H / 2;
    cards.forEach((c, i) => {
      const x = fx + 12 + i * (bw + gap);
      nodes.push(<g key={`c${i}`}>{c.render(x, by, H)}</g>);
      if (i > 0) nodes.push(<Arrow key={`a${i}`} x1={x - gap + 2} y1={cy} x2={x - 2} y2={cy} size={7} />);
    });
    const frameH = H + 28;
    nodes.unshift(<rect key="frame" x={fx} y={frameTop} width={fw} height={frameH} rx={10} fill="rgb(var(--pine-rgb) / 0.04)" stroke={PINE} strokeWidth={1.4} strokeDasharray="6 4" />);
    nodes.push(<Customer key="k1" cx={22} cy={cy} />, <Customer key="k2" cx={W - 22} cy={cy} />);
    nodes.push(<Arrow key="in" x1={46} y1={cy} x2={fx + 10} y2={cy} size={7} />);
    nodes.push(<Arrow key="out" x1={W - fx - 10} y1={cy} x2={W - 46} y2={cy} size={7} />);
    const ly = cy + 28;
    nodes.push(<g key="l1">{textBlock({ x: 0, y: ly, w: 54, text: "Köper på nätet", size: FS_SMALL, fill: MUTED }).node}</g>);
    nodes.push(<g key="l2">{textBlock({ x: W - 54, y: ly, w: 54, text: "Får paketet", size: FS_SMALL, fill: MUTED, anchor: "end" }).node}</g>);
    const ny = frameTop + frameH + 12;
    const note = textBlock({ x: fx, y: ny, w: fw, text: "Varje avdelning äger sitt steg. Ingen avdelning äger hela kedjan.", size: FS, fill: MUTED, anchor: "middle" });
    nodes.push(<g key="n">{note.node}</g>);
    return { h: Math.max(ny + note.h, ly + 3 * lineHeight(FS_SMALL)), node: <g>{nodes}</g> };
  }
  // Smalt: kedjan uppifrån och ned, kunden före och efter ramen.
  let y = 0;
  const k1 = 22;
  nodes.push(<Customer key="k1" cx={W / 2} cy={y + k1} />);
  nodes.push(<g key="l1">{textBlock({ x: W / 2 + 30, y: y + k1 - 9, w: W / 2 - 30, text: "Köper på nätet", size: FS_SMALL, fill: MUTED }).node}</g>);
  y += 2 * k1 + 4;
  nodes.push(<Arrow key="in" x1={W / 2} y1={y} x2={W / 2} y2={y + 22} size={7} />);
  y += 26;
  const fl = textBlock({ x: 12, y: y + 8, w: W - 24, text: "BPM: styr och förbättrar hela kedjan", size: FS_SMALL, weight: 600, fill: PINE });
  const top = y;
  nodes.push(<g key="fl">{fl.node}</g>);
  y += fl.h + 14;
  STEPS.forEach((s, i) => {
    const c = card({ ...spec(s), w: W - 24 });
    nodes.push(<g key={`c${i}`}>{c.render(12, y)}</g>);
    y += c.h;
    if (i < STEPS.length - 1) {
      nodes.push(<Arrow key={`a${i}`} x1={W / 2} y1={y + 2} x2={W / 2} y2={y + 16} size={6} />);
      y += 18;
    }
  });
  y += 12;
  nodes.unshift(<rect key="frame" x={0} y={top} width={W} height={y - top} rx={10} fill="rgb(var(--pine-rgb) / 0.04)" stroke={PINE} strokeWidth={1.4} strokeDasharray="6 4" />);
  nodes.push(<Arrow key="out" x1={W / 2} y1={y + 4} x2={W / 2} y2={y + 26} size={7} />);
  y += 30;
  nodes.push(<Customer key="k2" cx={W / 2} cy={y + k1} />);
  nodes.push(<g key="l2">{textBlock({ x: W / 2 + 30, y: y + k1 - 9, w: W / 2 - 30, text: "Får paketet", size: FS_SMALL, fill: MUTED }).node}</g>);
  y += 2 * k1 + 12;
  const note = textBlock({ x: 0, y, w: W, text: "Varje avdelning äger sitt steg. Ingen avdelning äger hela kedjan.", size: FS, fill: MUTED, anchor: "middle" });
  nodes.push(<g key="n">{note.node}</g>);
  return { h: y + note.h, node: <g>{nodes}</g> };
}

// ── Faslinjen (S.2 och S.3) ─────────────────────────────────────────────
// Nio lägen på linjen: People och Develop delar ett, eftersom de löper
// parallellt.
const PHASES = [
  ["1 Foundations"], ["2 Enablement"], ["3 Launch"], ["4 Understand"], ["5 Innovate"],
  ["6 People", "7 Develop"], ["8 Implement"], ["9 Realize"], ["10 Sustainability"],
];
const GROUPS = [
  { from: 0, to: 1, label: "Kapitel 6" },
  { from: 2, to: 3, label: "Kapitel 7" },
  { from: 4, to: 8, label: "Kapitel 8" },
];

// notes: [{ slot, text }] — markeringar under linjen (brett) eller till höger
// (smalt). band: { title, text } — ett band under hela linjen.
function phaseTimeline(W, narrow, { groups = false, notes = [], band = null }) {
  const nodes = [];
  const LH = lineHeight(FS);
  const noteAt = new Map(notes.map((n) => [n.slot, n]));
  const dot = (x, y, marked, key) => (
    <circle key={key} cx={x} cy={y} r={6} fill={marked ? BRASS : SURFACE} stroke={marked ? BRASS : PINE} strokeWidth={2} />
  );

  if (!narrow) {
    const pad = 62;
    const step = (W - 2 * pad) / 8;
    const xs = PHASES.map((_, i) => pad + i * step);
    let y = 0;
    if (groups) {
      const gh = lineHeight(FS_SMALL);
      GROUPS.forEach((g, gi) => {
        const x1 = clamp(xs[g.from] - step / 2 + 6, 0, W);
        const x2 = clamp(xs[g.to] + step / 2 - 6, 0, W);
        nodes.push(<g key={`g${gi}`}>{textBlock({ x: x1, y: 0, w: x2 - x1, text: g.label, size: FS_SMALL, weight: 600, fill: BRASS_TEXT, anchor: "middle" }).node}</g>);
        nodes.push(<path key={`gb${gi}`} d={`M${x1},${gh + 10} v-6 H${x2} v6`} fill="none" stroke={BRASS} strokeWidth={1.4} />);
      });
      y = gh + 18;
    }
    const rowA = y;
    const rowB = y + LH + 8;
    const axisY = rowB + 2 * LH + 14;
    PHASES.forEach((lines, i) => {
      const row = i % 2 === 0 ? rowA : rowB;
      const width = Math.max(...lines.map((l) => measure(l, FS, 600)));
      const cx = clamp(xs[i], width / 2, W - width / 2);
      nodes.push(<Lines key={`p${i}`} x={cx} y={row} lines={lines} size={FS} weight={600} anchor="middle" fill={INK} maxW={width + 2} />);
      nodes.push(<line key={`pl${i}`} x1={xs[i]} y1={row + lines.length * LH + 3} x2={xs[i]} y2={axisY - 9} stroke={LINE_STRONG} strokeWidth={1} />);
    });
    nodes.push(<Arrow key="axis" x1={pad - 30} y1={axisY} x2={W - pad + 34} y2={axisY} color={PINE} width={2} size={9} />);
    xs.forEach((x, i) => nodes.push(dot(x, axisY, noteAt.has(i), `d${i}`)));
    let bottom = axisY + 8;
    if (notes.length) {
      const maxW = 112;
      const rows = [[], []];
      notes.forEach((n, k) => rows[k % 2].push(n));
      const blocks = rows.map((list) => list.map((n) => ({ n, lines: textBlock({ x: 0, y: 0, w: maxW, text: n.text, size: FS_SMALL }).h })));
      const rowH = blocks.map((list) => Math.max(0, ...list.map((b) => b.lines)));
      const tops = [axisY + 18, axisY + 18 + rowH[0] + 12];
      rows.forEach((list, r) => list.forEach((n) => {
        const x = clamp(xs[n.slot] - maxW / 2, 0, W - maxW);
        nodes.push(<g key={`n${n.slot}`}>{textBlock({ x, y: tops[r], w: maxW, text: n.text, size: FS_SMALL, fill: INK, anchor: "middle" }).node}</g>);
        nodes.push(<line key={`nl${n.slot}`} x1={xs[n.slot]} y1={axisY + 8} x2={xs[n.slot]} y2={tops[r] - 3} stroke={BRASS} strokeWidth={1.2} />);
      }));
      bottom = tops[1] + rowH[1];
    }
    if (band) {
      const bx = pad - 30;
      const bw = W - 2 * bx;
      const c = card({ w: bw, title: band.title, text: band.text, tone: "brass", align: "middle", pad: 8, titleSize: FS });
      nodes.push(<g key="band">{c.render(bx, bottom + 14)}</g>);
      bottom += 14 + c.h;
    }
    return { h: bottom, node: <g>{nodes}</g> };
  }

  // Smalt: lodrät linje till vänster, faserna till höger om den.
  const ax = 14;
  const lx = 30;
  const nx = notes.length ? 168 : null;
  let y = 0;
  const dots = [];
  PHASES.forEach((lines, i) => {
    const group = groups && GROUPS.find((g) => g.from === i);
    if (group) {
      const h = heading({ x: lx, y: y + (i ? 6 : 0), w: W - lx, text: group.label });
      nodes.push(<g key={`g${i}`}>{h.node}</g>);
      y += h.h + (i ? 12 : 6);
    }
    const width = Math.max(...lines.map((l) => measure(l, FS, 600)));
    nodes.push(<Lines key={`p${i}`} x={lx} y={y} lines={lines} size={FS} weight={600} fill={INK} maxW={width + 2} />);
    let h = lines.length * LH;
    const note = noteAt.get(i);
    if (note) {
      const t = textBlock({ x: nx, y, w: W - nx, text: note.text, size: FS_SMALL, fill: INK });
      nodes.push(<g key={`n${i}`}>{t.node}</g>);
      nodes.push(<line key={`nl${i}`} x1={lx + width + 6} y1={y + LH / 2} x2={nx - 6} y2={y + LH / 2} stroke={BRASS} strokeWidth={1.2} />);
      h = Math.max(h, t.h);
    }
    dots.push({ y: y + LH / 2, marked: Boolean(note) });
    y += h + 10;
  });
  nodes.push(<Arrow key="axis" x1={ax} y1={dots[0].y - 10} x2={ax} y2={y + 4} color={PINE} width={2} size={9} />);
  dots.forEach((d, i) => nodes.push(dot(ax, d.y, d.marked, `d${i}`)));
  y += 8;
  if (band) {
    const c = card({ w: W, title: band.title, text: band.text, tone: "brass", align: "middle", pad: 8, titleSize: FS });
    nodes.push(<g key="band">{c.render(0, y + 6)}</g>);
    y += 6 + c.h;
  }
  return { h: y, node: <g>{nodes}</g> };
}

// ── S.2 7FE som tidslinje ───────────────────────────────────────────────
function fasLinje(W, narrow) {
  return phaseTimeline(W, narrow, {
    groups: true,
    band: {
      title: "Tre essentials genom alla faser",
      text: "Leadership · BPM project management · People change management",
    },
  });
}

// ── S.3 Nyttotråden ─────────────────────────────────────────────────────
function nyttotraden(W, narrow) {
  return phaseTimeline(W, narrow, {
    notes: [
      { slot: 1, text: "Ramverk för nyttostyrning" },
      { slot: 2, text: "Business case och benefits register" },
      { slot: 3, text: "Baseline: nuläget mäts" },
      { slot: 4, text: "Nyttorna räknas om" },
      { slot: 6, text: "Uppföljningen börjar" },
      { slot: 7, text: "Nyttorna drivs fram och följs upp" },
      { slot: 8, text: "Nyttorna bevakas i vardagen" },
    ],
  });
}

// ── S.4 BPMN:s grundformer ──────────────────────────────────────────────
function Task({ cx, cy, w, h = 56, text }) {
  const t = textBlock({ x: cx - w / 2 + 4, y: 0, w: w - 8, text, size: FS_SMALL, anchor: "middle" });
  return (
    <g>
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={9} fill={SURFACE} stroke={INK} strokeWidth={1.5} />
      <g transform={`translate(0 ${cy - t.h / 2})`}>{t.node}</g>
    </g>
  );
}

function grundformer(W, narrow) {
  const nodes = [];
  const band = narrow ? 20 : 24;
  const g = narrow
    ? { start: 68, t1: 146, gw: 232, endNo: 314, t2: 226, end2: 314, tw: 84, lw: 56 }
    : { start: 120, t1: 250, gw: 400, endNo: 540, t2: 400, end2: 540, tw: 112, lw: 96 };
  // Förklaringarna ovanför poolen pekar på formerna i första banan.
  const callouts = [
    { x: g.start, text: "Händelse" },
    { x: g.t1, text: "Aktivitet" },
    { x: g.gw, text: "Gateway" },
  ];
  const ch = lineHeight(FS_SMALL);
  callouts.forEach((c, i) => {
    nodes.push(<g key={`c${i}`}>{textBlock({ x: c.x - 40, y: 0, w: 80, text: c.text, size: FS_SMALL, weight: 600, fill: BRASS_TEXT, anchor: "middle" }).node}</g>);
  });
  const poolTop = ch + 22;
  // Smalt får första banan extra höjd för gatewayens fråga på två rader.
  const laneH = narrow ? 132 : 116;
  const poolH = laneH * 2;
  const x0 = 2 * band;
  // Poolen med två lanes; namnen står roterade i kanten som i BPMN.
  nodes.push(<rect key="pool" x={0.75} y={poolTop} width={W - 1.5} height={poolH} fill="none" stroke={INK} strokeWidth={1.3} />);
  nodes.push(<line key="pb" x1={band} y1={poolTop} x2={band} y2={poolTop + poolH} stroke={INK} strokeWidth={1.3} />);
  nodes.push(<line key="lb" x1={x0} y1={poolTop} x2={x0} y2={poolTop + poolH} stroke={INK} strokeWidth={1} />);
  nodes.push(<line key="ld" x1={band} y1={poolTop + laneH} x2={W} y2={poolTop + laneH} stroke={INK} strokeWidth={1} />);
  const rotated = (key, cx, cy, text, len) => (
    <text key={key} data-rotated fontSize={FS_SMALL} fontWeight={600} fill={INK} textAnchor="middle" transform={`translate(${cx + FS_SMALL * 0.35} ${cy}) rotate(-90)`}>
      <tspan data-maxw={Math.round(len)}>{text}</tspan>
    </text>
  );
  nodes.push(rotated("pn", band / 2, poolTop + poolH / 2, "Order handling", poolH));
  nodes.push(rotated("l1n", band + band / 2, poolTop + laneH / 2, "Sales", laneH));
  nodes.push(rotated("l2n", band + band / 2, poolTop + laneH + laneH / 2, "Warehouse", laneH));
  // Första banan: start, kontroll och gatewayen.
  const y1 = poolTop + (narrow ? 66 : 50);
  const y2 = poolTop + laneH + 50;
  callouts.forEach((c, i) => {
    const target = i === 1 ? y1 - 28 : i === 2 ? y1 - 25 : y1 - 18;
    nodes.push(<line key={`cl${i}`} x1={c.x} y1={ch + 3} x2={c.x} y2={target - 2} stroke={BRASS} strokeWidth={1.2} />);
  });
  const flow = (k, x1, yA, x2, yB) => <Arrow key={k} x1={x1} y1={yA} x2={x2} y2={yB} color={INK} width={1.4} size={7} />;
  nodes.push(<EventShape key="s" cx={g.start} cy={y1} kind="start" event="message" />);
  nodes.push(<Task key="t1" cx={g.t1} cy={y1} w={g.tw} text="Check order" />);
  nodes.push(<GatewayShape key="gw" cx={g.gw} cy={y1} />);
  nodes.push(<EventShape key="eno" cx={g.endNo} cy={y1} kind="end" />);
  nodes.push(flow("f1", g.start + 18, y1, g.t1 - g.tw / 2, y1));
  nodes.push(flow("f2", g.t1 + g.tw / 2, y1, g.gw - 25, y1));
  nodes.push(flow("f3", g.gw + 25, y1, g.endNo - 18, y1));
  // Andra banan: leveransen.
  nodes.push(<Task key="t2" cx={g.t2} cy={y2} w={g.tw} text="Ship goods" />);
  nodes.push(<EventShape key="e2" cx={g.end2} cy={y2} kind="end" />);
  nodes.push(flow("f4", g.gw, y1 + 25, g.gw, y2 - 28));
  nodes.push(flow("f5", g.t2 + g.tw / 2, y2, g.end2 - 18, y2));
  // Etiketter: händelsernas namn under, gatewayens fråga ovanför och svaren
  // vid flödena.
  const label = (k, cx, y, text, w = g.lw) => {
    const x = clamp(cx - w / 2, x0 + 2, W - w - 2);
    return <g key={k}>{textBlock({ x, y, w, text, size: FS_SMALL, anchor: "middle" }).node}</g>;
  };
  nodes.push(label("ls", g.start, y1 + 22, "Received order"));
  nodes.push(label("lno", g.endNo, y1 + 22, "Order rejected"));
  nodes.push(label("l2", g.end2, y2 + 22, "Order shipped"));
  // Gatewayens fråga står snett ovanför till höger, så att förklaringens
  // linje kan gå rakt ned till romben.
  const gq = textBlock({ x: g.gw + 14, y: 0, w: narrow ? W - g.gw - 16 : 110, text: "Goods in stock?", size: FS_SMALL });
  nodes.push(<g key="lgw" transform={`translate(0 ${y1 - 27 - gq.h})`}>{gq.node}</g>);
  nodes.push(<g key="no">{textBlock({ x: g.gw + 27, y: y1 - ch - 2, w: 30, text: "No", size: FS_SMALL, fill: INK }).node}</g>);
  nodes.push(<g key="yes">{textBlock({ x: g.gw - 38, y: y1 + 34, w: 34, text: "Yes", size: FS_SMALL, fill: INK, anchor: "end" }).node}</g>);
  const ny = poolTop + poolH + 10;
  const note = textBlock({ x: 0, y: ny, w: W, text: "Banor: poolen är en process (Order handling), och varje lane visar vem som utför arbetet (Sales, Warehouse).", size: FS_SMALL, fill: MUTED });
  nodes.push(<g key="n">{note.node}</g>);
  return { h: ny + note.h, node: <g>{nodes}</g> };
}

// ── Registrering ────────────────────────────────────────────────────────
const fig = (id, build) => {
  const Component = () => <ConceptFigure id={id} build={build} />;
  Component.displayName = `Figur(${id})`;
  return Component;
};

export const SUMMARY_FIGURES = {
  "bpm-processkedjan": fig("bpm-processkedjan", processkedjan),
  "bpm-7fe-tidslinje": fig("bpm-7fe-tidslinje", fasLinje),
  "bpm-nyttotraden": fig("bpm-nyttotraden", nyttotraden),
  "bpm-bpmn-grundformer": fig("bpm-bpmn-grundformer", grundformer),
};
