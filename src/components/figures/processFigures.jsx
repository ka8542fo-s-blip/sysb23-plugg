// Begreppsfigurerna i kompendiet för Processorienterad verksamhetsutveckling.
// Samma byggstenar och regler som databaserFigures.jsx: varje figur är en
// build-funktion (W, narrow) => { h, node }, och innehållet följer kapitlets
// text. Kapitel 11 använder sajtens BPMN-primitiver (components/bpmn).
import {
  ConceptFigure, card, row, column, flow, stack, heading, textBlock, Lines, wrap, measure,
  lineHeight, textHeight, Arrow, CurvedArrow, cycle, timeline, TONE, INK, PINE, BRASS,
  BRASS_TEXT, MUTED, ARROW, FS, FS_TITLE, FS_SMALL,
} from "./conceptFigures.jsx";
import { EventShape, ActivityShape, TASK_W, TASK_H } from "../bpmn/BpmnDiagram.jsx";

const WRONG = "var(--wrong)";
const CORRECT = "var(--correct)";

// Ett kort som ritas direkt på en plats: { h, node }.
const placed = (opts, x, y, H) => {
  const c = card(opts);
  return { h: H ?? c.h, node: c.render(x, y, H) };
};

// ── 1.1 BPM lifecycle ───────────────────────────────────────────────────
function livscykeln(W, narrow) {
  const items = [
    { title: "Process identification", text: "Processarkitektur och val av process." },
    { title: "Process modelling", text: "I BPMN." },
    { title: "Process discovery", text: "Nuläget, as-is." },
    { title: "Process analysis", text: "Var den brister: gapet mot målbilden." },
    { title: "Process redesign", text: "Hur den bör se ut, to-be." },
    { title: "Process implementation", text: "Till exempel som körbar modell i ett BPMS." },
    { title: "Process monitoring", text: "Uppföljning, och sedan börjar varvet om." },
  ];
  return cycle(items, { W, narrow, cardW: 156, center: "Akademins beskrivning. Jestons ramverk är 7FE (kapitel 5).", ry: 150 });
}

// ── 1.2 BPM som operativt lager i EA ────────────────────────────────────
function eaLager(W, narrow) {
  const nodes = [];
  const left = narrow ? 0 : 46;
  const lw = W - left;
  const layers = [
    { title: "Strategin", text: "EA och BPM har samma mål: att genomföra strategin, linjera IT med den och öka konkurrensfördelen.", tone: "plain" },
    { kicker: "Här arbetar BPM", title: "Verksamheten och processerna", text: "Processerna kopplar strategin till IT-arkitekturen. BPM står för styrning, prestationsuppföljning och ständig förbättring, och kan ha en processmotor (BPMS) som kör processerna.", tone: "brass" },
    { title: "Applikationer och infrastruktur", text: "IT-arkitekturen som processerna kopplas till.", tone: "plain" },
  ];
  let y = 0;
  if (narrow) {
    const ea = textBlock({ x: 10, y: 8, w: W - 20, text: "Enterprise Architecture: den övergripande ritningen för hur strategin ska realiseras", size: FS, weight: 600, fill: PINE });
    nodes.push(<g key="ea">{ea.node}</g>);
    y = ea.h + 18;
  }
  const inner = narrow ? 10 : 12;
  const col = column(layers, { x: left + inner, y: y + (narrow ? 0 : 12), w: lw - inner * 2, gap: 22 });
  col.positions.slice(1).forEach((p, i) => {
    const prev = col.positions[i];
    nodes.push(<Arrow key={`u${i}`} x1={p.x + p.w / 2 - 30} y1={p.y - 3} x2={p.x + p.w / 2 - 30} y2={prev.y + prev.h + 3} size={6} color={BRASS} both />);
  });
  nodes.push(<g key="col">{col.node}</g>);
  const bottom = (narrow ? y : 12) + col.h + inner;
  nodes.unshift(<rect key="frame" x={left} y={narrow ? 0 : 0} width={lw} height={bottom} rx={10} fill="rgba(31,78,69,0.04)" stroke={PINE} strokeWidth={1.4} strokeDasharray="6 4" />);
  if (!narrow) {
    nodes.push(
      <text key="ea" data-rotated fontSize={FS} fontWeight={600} fill={PINE} textAnchor="middle" transform={`translate(${left - 16} ${bottom / 2}) rotate(-90)`}>
        <tspan data-maxw={Math.round(bottom)}>Enterprise Architecture (EA)</tspan>
      </text>,
    );
  }
  return { h: bottom, node: <g>{nodes}</g> };
}

// ── 2.1 Tidslinjen ──────────────────────────────────────────────────────
function tidslinje(W, narrow) {
  return timeline([
    { when: "1880–1920", title: "Taylors scientific management", text: "Arbetet delas upp och effektiviseras steg för steg." },
    { when: "1962", title: "Petri-nät", text: "Processflöden och samtidighet beskrivs matematiskt." },
    { when: "70- och 80-tal", title: "Produktivitetsparadoxen", text: "Stora IT-investeringar utan ökad produktivitet (Solow 1987)." },
    { when: "Mitten av 80-talet", title: "Kvalitetsrörelsen", text: "TQM, Six Sigma och Lean förbättrar inkrementellt (CPI)." },
    { when: "1990", title: "BPR", text: "Hammer: radikal omdesign med IT. För radikalt, för dyrt, för mycket motstånd.", tone: "wrong" },
    { when: "1998–2003", title: "BPM som akademiskt fält", text: "Affärsprocesstänkande möter europeisk workflowforskning. Första konferensen 2003." },
    { when: "2002", title: "Sarbanes-Oxley", text: "Krav på spårbar intern kontroll sprider processdokumentationen." },
    { when: "2000-talet", title: "BPMS och SOA", text: "Körbara processmotorer och återanvändbara tjänster." },
    { when: "2015–2022", title: "RPA", text: "Botar härmar användaren i gränssnittet. Svårt att skala." },
    { when: "I dag", title: "Agentisk AI och BOAT", text: "AI-agenter sköter arbetsflöden; BPM-systemen ingår i BOAT.", tone: "pine" },
  ], { W, narrow });
}

// ── 3.1 Jestons scenarier ───────────────────────────────────────────────
function scenarier(W, narrow) {
  const nodes = [];
  const labelW = narrow ? 90 : 150;
  const gx = labelW + (narrow ? 6 : 14);
  const cellW = (W - gx) / 3;
  const cellH = narrow ? 92 : 96;
  const gy = 22;
  const gridH = cellH * 3;
  const yTicks = ["Gör om processer end-to-end eller affärsmodellen", "Förbättrar eller gör om processer", narrow ? "Mindre process-\nförbättringar" : "Mindre processförbättringar"];
  const xTicks = ["Delvis informerad, begränsat eller inget engagemang", "Fullt informerad, delvis engagerad", "Fullt informerad, fullt engagerad"];
  const cell = (c, r) => ({ x: gx + c * cellW, y: gy + (2 - r) * cellH });
  // Zonerna ovanför och under diagonalen.
  const above = [[0, 1], [0, 2], [1, 2]];
  const below = [[1, 0], [2, 0], [2, 1]];
  above.forEach(([c, r], i) => {
    const p = cell(c, r);
    nodes.push(<rect key={`za${i}`} x={p.x} y={p.y} width={cellW} height={cellH} fill="var(--wrong-bg)" />);
  });
  below.forEach(([c, r], i) => {
    const p = cell(c, r);
    nodes.push(<rect key={`zb${i}`} x={p.x} y={p.y} width={cellW} height={cellH} fill="rgba(185,147,47,0.12)" />);
  });
  for (let i = 0; i <= 3; i++) {
    nodes.push(<line key={`gv${i}`} x1={gx + i * cellW} y1={gy} x2={gx + i * cellW} y2={gy + gridH} stroke="#d8d2c3" strokeWidth={1} />);
    nodes.push(<line key={`gh${i}`} x1={gx} y1={gy + i * cellH} x2={W} y2={gy + i * cellH} stroke="#d8d2c3" strokeWidth={1} />);
  }
  const za = cell(0, 2);
  nodes.push(<g key="zat">{textBlock({ x: za.x + 6, y: za.y + 6, w: cellW - 12, text: "Exceeding mandate", size: FS_SMALL, weight: 600, fill: WRONG }).node}</g>);
  const zb = cell(2, 0);
  const zbt = textBlock({ x: zb.x + 6, y: 0, w: cellW - 12, text: "Under ambitious", size: FS_SMALL, weight: 600, fill: BRASS_TEXT });
  nodes.push(<g key="zbt" transform={`translate(0 ${zb.y + cellH - zbt.h - 6})`}>{zbt.node}</g>);
  const diag = [
    { c: 0, r: 0, t: "Under the radar", tone: "plain" },
    { c: 1, r: 1, t: "Pilot project", tone: "pine" },
    { c: 2, r: 2, t: "In the driver's seat", tone: "solid" },
  ];
  diag.forEach((d, i) => {
    const p = cell(d.c, d.r);
    const m = narrow ? 5 : 10;
    const c = card({ w: cellW - 2 * m, title: d.t, tone: d.tone, align: "middle", pad: narrow ? 5 : 8, titleSize: narrow ? FS : FS_TITLE });
    nodes.push(<g key={`d${i}`}>{c.render(p.x + m, p.y + (cellH - c.h) / 2)}</g>);
  });
  yTicks.forEach((t, r) => {
    const b = textBlock({ x: 0, y: 0, w: labelW, text: t, size: FS_SMALL, fill: INK, anchor: "end" });
    nodes.push(<g key={`yt${r}`} transform={`translate(0 ${gy + r * cellH + (cellH - b.h) / 2})`}>{b.node}</g>);
  });
  const ty = gy + gridH + 8;
  let tickH = 0;
  xTicks.forEach((t, c) => {
    const b = textBlock({ x: gx + c * cellW + 1, y: ty, w: cellW - 2, text: t, size: FS_SMALL, fill: INK, anchor: "middle" });
    nodes.push(<g key={`xt${c}`}>{b.node}</g>);
    tickH = Math.max(tickH, b.h);
  });
  nodes.push(<g key="ya">{textBlock({ x: gx, y: 0, w: W - gx, text: "↑ Påverkan på organisationen", size: FS_SMALL, weight: 600, fill: BRASS_TEXT }).node}</g>);
  const xaY = ty + tickH + 6;
  nodes.push(<g key="xa">{textBlock({ x: gx, y: xaY, w: W - gx, text: "Chefens involvering: hur informerad och engagerad →", size: FS_SMALL, weight: 600, fill: BRASS_TEXT, anchor: "end" }).node}</g>);
  const ny = xaY + lineHeight(FS_SMALL) * 2 + 8;
  const zones = narrow
    ? column([
      { title: "Exceeding mandate", text: "Påverkan större än chefens involvering räcker till.", tone: "wrong", pad: 8, titleSize: FS },
      { title: "Under ambitious", text: "Chefen mer involverad än insatsen utnyttjar.", tone: "brass", pad: 8, titleSize: FS },
      { title: "Business as usual", text: "Det fjärde scenariot finns inte i figuren: BPM är helt inbäddat i arbetssättet.", tone: "ghost", pad: 8, titleSize: FS },
    ], { y: ny, w: W, gap: 8 })
    : row([
      { title: "Exceeding mandate", text: "Påverkan större än chefens involvering räcker till.", tone: "wrong", pad: 8, titleSize: FS },
      { title: "Under ambitious", text: "Chefen mer involverad än insatsen utnyttjar.", tone: "brass", pad: 8, titleSize: FS },
      { title: "Business as usual", text: "Finns inte i figuren: BPM är helt inbäddat i arbetssättet.", tone: "ghost", pad: 8, titleSize: FS },
    ], { y: ny, w: W, gap: 12 });
  nodes.push(<g key="z">{zones.node}</g>);
  return { h: ny + zones.h, node: <g>{nodes}</g> };
}

// ── 4.1 Improve before automate ─────────────────────────────────────────
function forstarkning(W, narrow) {
  const top = [
    { title: "Effektiv process", tone: "plain", align: "middle" },
    { title: "Automatiseras", tone: "pine", align: "middle" },
    { title: "Blir effektivare", text: "Automatiseringen förstärker det som redan finns.", tone: "correct", align: "middle" },
  ];
  const bottom = [
    { title: "Ineffektiv process", text: "Erfarna medarbetare kompenserar för fällorna.", tone: "plain", align: "middle" },
    { title: "Automatiseras", text: "Automationen saknar deras kunskap.", tone: "pine", align: "middle" },
    { title: "Ineffektiviteten förstärks", text: "Fel, omvägar och onödiga steg körs snabbare, oftare och i större skala.", tone: "wrong", align: "middle" },
  ];
  const parts = [
    (y) => flow(top, { y, w: W, narrow, gap: narrow ? 18 : 30 }),
    (y) => flow(bottom, { y, w: W, narrow, gap: narrow ? 18 : 30 }),
    (y) => placed({ w: W, title: "Följden", text: "Bortkastade investeringar, frustrerade medarbetare och svag användning av BPM-systemen.", tone: "wrong", pad: 8, titleSize: FS }, 0, y),
    (y) => placed({ w: W, title: "Improve before automate", text: "Förstå, kartlägg och förbättra processen först, och inför tekniken sedan. Technology is an enabler, not a solution.", tone: "correct" }, 0, y),
  ];
  return stack(parts, { gap: narrow ? 22 : 18 });
}

// ── 4.2 Kundupplevelsens zoner ──────────────────────────────────────────
function kundupplevelsen(W, narrow) {
  const nodes = [];
  const barH = 34;
  const mid = W / 2;
  const ax0 = narrow ? 4 : 40;
  const bigLabel = textBlock({ x: ax0, y: 0, w: mid - 10 - ax0, text: "Ta bort irritationerna: effektivare", size: FS_SMALL, weight: 600, fill: WRONG });
  const smallLabel = textBlock({ x: mid + 10, y: 0, w: W - mid - 10, text: "Wow-faktorer: tillför lite", size: FS_SMALL, weight: 600, fill: MUTED });
  const labelH = Math.max(bigLabel.h, smallLabel.h);
  const arrowY = labelH + 12;
  const barY = arrowY + 20;
  nodes.push(
    <defs key="defs">
      <linearGradient id={`kund-${narrow ? "s" : "b"}`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#f3d9d3" />
        <stop offset="0.5" stopColor="#f4f1ea" />
        <stop offset="1" stopColor="#e8f1ea" />
      </linearGradient>
    </defs>,
  );
  nodes.push(<rect key="bar" x={0} y={barY} width={W} height={barH} rx={6} fill={`url(#kund-${narrow ? "s" : "b"})`} stroke="#cfc9ba" />);
  nodes.push(<line key="line" x1={mid} y1={barY - 8} x2={mid} y2={barY + barH + 8} stroke={INK} strokeWidth={2} />);
  const zw = mid - 16;
  nodes.push(<g key="l">{textBlock({ x: 8, y: barY + 8, w: zw, text: "Irritationszonen", size: FS, weight: 600, fill: WRONG }).node}</g>);
  nodes.push(<g key="r">{textBlock({ x: mid + 8, y: barY + 8, w: zw - 8, text: "Wow-zonen", size: FS, weight: 600, fill: CORRECT, anchor: "end" }).node}</g>);
  const li = textBlock({ x: mid - 120, y: barY + barH + 12, w: 240, text: "Line of absolute indifference", size: FS_SMALL, weight: 600, fill: INK, anchor: "middle" });
  nodes.push(<g key="li">{li.node}</g>);
  // Stor pil: ta bort irritationer. Liten pil: wow tillför lite.
  nodes.push(<Arrow key="big" x1={ax0} y1={arrowY} x2={mid - 10} y2={arrowY} color={WRONG} width={5} size={12} />);
  nodes.push(<Arrow key="small" x1={mid + 10} y1={arrowY} x2={mid + (narrow ? 60 : 90)} y2={arrowY} color={MUTED} width={1.6} size={7} />);
  nodes.push(<g key="bt" transform={`translate(0 ${labelH - bigLabel.h})`}>{bigLabel.node}</g>);
  nodes.push(<g key="st" transform={`translate(0 ${labelH - smallLabel.h})`}>{smallLabel.node}</g>);
  const ny = barY + barH + 14 + li.h + 12;
  const note = placed({ w: W, text: "Utmärkta kundmått kan dölja ett djupare missnöje. Processer och KPI:er ska spegla kundens verkliga upplevelse, inte bara de interna dashboarderna.", tone: "plain", pad: 8 }, 0, ny);
  nodes.push(<g key="n">{note.node}</g>);
  return { h: ny + note.h, node: <g>{nodes}</g> };
}

// ── 5.1 Jestons hus ─────────────────────────────────────────────────────
function huset(W, narrow) {
  const nodes = [];
  const goal = textBlock({ x: 0, y: 0, w: W, text: "Målet: effektivitet och uthållig konkurrensfördel", size: FS_SMALL, weight: 600, fill: BRASS_TEXT, anchor: "middle" });
  nodes.push(<g key="goal">{goal.node}</g>);
  const roofTop = goal.h + 8;
  const roofH = narrow ? 128 : 112;
  const eave = narrow ? 2 : 10;
  const roofBase = roofTop + roofH;
  nodes.push(<polygon key="roof" points={`${eave},${roofBase} ${W / 2},${roofTop} ${W - eave},${roofBase}`} fill={PINE} />);
  const rt = textBlock({ x: 0, y: 0, w: narrow ? 168 : 260, text: "Taket: ledningen och kulturen", size: narrow ? FS : FS_TITLE, weight: 600, fill: "white", anchor: "middle" });
  const rs = textBlock({ x: 0, y: 0, w: narrow ? 168 : 260, text: "process governance och prestationsstyrning", size: FS_SMALL, fill: "white", anchor: "middle" });
  const rtw = narrow ? 168 : 260;
  nodes.push(<g key="rt" transform={`translate(${W / 2 - rtw / 2} ${roofBase - rt.h - rs.h - 12})`}>{rt.node}<g transform={`translate(0 ${rt.h + 2})`}>{rs.node}</g></g>);
  const wall = narrow ? 6 : 26;
  const iw = W - 2 * wall;
  let y = roofBase + 10;
  const rooms = row([
    { kicker: "Rum", title: "Management processes", tone: "pine", align: "middle", pad: narrow ? 6 : 8, titleSize: narrow ? FS : FS_TITLE },
    { kicker: "Rum", title: "Operational processes", text: "kärn- och stödprocesser", tone: "pine", align: "middle", pad: narrow ? 6 : 8, titleSize: narrow ? FS : FS_TITLE },
    { kicker: "Rum", title: "Innovation processes", tone: "pine", align: "middle", pad: narrow ? 6 : 8, titleSize: narrow ? FS : FS_TITLE },
  ], { x: wall, y, w: iw, gap: narrow ? 6 : 12 });
  nodes.push(<g key="rooms">{rooms.node}</g>);
  y += rooms.h + 10;
  const bands = [
    { title: "Business transformation program management, \"Set for Success\"", text: "Process transformation framework, people change management, benefits realization och process improvement framework.", tone: "brass" },
    { title: "Organisatorisk linjering", text: "Spårbarhet mellan strategi, target operating model och förmåga.", tone: "plain" },
    { title: "Foundations och Enablement", text: "Grunden: motsvarar de två första faserna i 7FE.", tone: "solid" },
  ];
  bands.forEach((b, i) => {
    const c = card({ ...b, w: iw, pad: 8, titleSize: FS });
    nodes.push(<g key={`b${i}`}>{c.render(wall, y)}</g>);
    y += c.h + 8;
  });
  // Väggarna från takfoten ner till grunden.
  nodes.push(<line key="wl" x1={wall - 4} y1={roofBase} x2={wall - 4} y2={y - 8} stroke={PINE} strokeWidth={3} />);
  nodes.push(<line key="wr" x1={W - wall + 4} y1={roofBase} x2={W - wall + 4} y2={y - 8} stroke={PINE} strokeWidth={3} />);
  const groundY = y + 2;
  nodes.push(<line key="g" x1={0} y1={groundY} x2={W} y2={groundY} stroke={BRASS_TEXT} strokeWidth={2.5} />);
  const gt = textBlock({ x: 0, y: groundY + 8, w: W, text: "Marken: regelverket och omvärldens regler", size: FS, weight: 600, fill: BRASS_TEXT, anchor: "middle" });
  nodes.push(<g key="gt">{gt.node}</g>);
  return { h: groundY + 8 + gt.h, node: <g>{nodes}</g> };
}

// ── 5.2 7FE: tio faser och tre essentials ───────────────────────────────
function sjuFE(W, narrow) {
  const phases = [
    ["Foundations", "Linjering och target operating model"],
    ["Enablement", "Bygger det som krävs för TOM"],
    ["Launch", "Den formella starten"],
    ["Understand", "Gemensam, faktabaserad bild av nuläget"],
    ["Innovate", "To-be och validerade lösningar"],
    ["People", null],
    ["Develop", null],
    ["Implement", null],
    ["Realize", "De strategiska målen"],
    ["Sustainability", narrow ? "Konkurrensfördelen" : "Konkurrens-\nfördelen"],
  ];
  const nodes = [];
  const gap = narrow ? 8 : 10;
  const cols = narrow ? 2 : 5;
  const top = narrow ? 0 : 26;
  const cw = (W - gap * (cols - 1)) / cols;
  const headA = "Fas 1–5: konsultuppdraget";
  const headB = "Fas 6–10: bygget och genomförandet";
  const narrowHead = Math.max(...[headA, headB].map((t) => textHeight(wrap(t, cw, FS_SMALL, 600), FS_SMALL))) + 8;
  const cards = phases.map(([t, x], i) => card({ w: cw, kicker: `Fas ${i + 1}`, title: t, text: x, tone: i < 5 ? "pine" : "plain", pad: 7, titleSize: FS }));
  const H = Math.max(...cards.map((c) => c.h));
  let bottom = 0;
  cards.forEach((c, i) => {
    const colI = narrow ? Math.floor(i / 5) : i % 5;
    const rowI = narrow ? i % 5 : Math.floor(i / 5);
    const x = colI * (cw + gap);
    const y = top + (narrow ? narrowHead : 0) + rowI * (H + gap);
    nodes.push(<g key={i}>{c.render(x, y, H)}</g>);
    bottom = Math.max(bottom, y + H);
  });
  if (!narrow) {
    nodes.push(<path key="br" d={`M0,${top - 6} v-6 H${W} v6`} fill="none" stroke={BRASS} strokeWidth={1.4} />);
    nodes.push(<g key="bt">{textBlock({ x: 0, y: 0, w: W, text: "Fas 1–5: i praktiken ett konsultuppdrag som slutar i ett robust business case", size: FS_SMALL, weight: 600, fill: BRASS_TEXT, anchor: "middle" }).node}</g>);
  } else {
    nodes.push(<g key="bt">{textBlock({ x: 0, y: 0, w: cw, text: headA, size: FS_SMALL, weight: 600, fill: BRASS_TEXT }).node}</g>);
    nodes.push(<g key="bt2">{textBlock({ x: cw + gap, y: 0, w: cw, text: headB, size: FS_SMALL, weight: 600, fill: MUTED }).node}</g>);
  }
  const ey = bottom + 14;
  const eh = heading({ x: 0, y: ey, w: W, text: "Tre essentials genom alla faser" });
  nodes.push(<g key="eh">{eh.node}</g>);
  const ess = [
    { title: "Leadership", text: "Vision, förtroende och linjering, på alla nivåer.", tone: "brass", pad: 8, titleSize: FS },
    { title: "BPM project management", text: "Resurser, budget, tidplan, intressenter, leveranser.", tone: "brass", pad: 8, titleSize: FS },
    { title: "People change management", text: "Alla kan och vill ta till sig lösningen.", tone: "brass", pad: 8, titleSize: FS },
  ];
  const e = narrow ? column(ess, { y: ey + eh.h + 8, w: W, gap: 8 }) : row(ess, { y: ey + eh.h + 8, w: W, gap: 10 });
  nodes.push(<g key="e">{e.node}</g>);
  return { h: ey + eh.h + 8 + e.h, node: <g>{nodes}</g> };
}

// ── 5.3 Framgångspallen ─────────────────────────────────────────────────
function framgangspallen(W, narrow) {
  const nodes = [];
  const seat = card({ w: W - (narrow ? 0 : 120), title: "Strategin", text: "Bestämmer affärsmodellen och den operativa modellen.", tone: "solid", align: "middle", pad: 10 });
  const sx = narrow ? 0 : 60;
  nodes.push(<g key="seat">{seat.render(sx, 0)}</g>);
  const legTop = seat.h;
  const legH = narrow ? 70 : 84;
  const legs = [
    { title: "People", text: "Organisation och kultur" },
    { title: "Tech", text: "Teknik" },
    { title: "Process", text: "Processerna" },
  ];
  const span = W - (narrow ? 40 : 200);
  const lx = (i) => (narrow ? 20 : 100) + (i * span) / 2;
  const lw = narrow ? 106 : 150;
  const legCards = legs.map((l) => card({ w: lw, title: l.title, text: l.text, tone: "pine", align: "middle", pad: 6, titleSize: FS_TITLE }));
  const H = Math.max(...legCards.map((c) => c.h));
  legs.forEach((l, i) => {
    const x = lx(i);
    const footX = x + (i - 1) * (narrow ? 8 : 16);
    nodes.push(<line key={`l${i}`} x1={x} y1={legTop} x2={footX} y2={legTop + legH} stroke={PINE} strokeWidth={7} strokeLinecap="round" />);
    const cxp = Math.min(Math.max(footX - lw / 2, 0), W - lw);
    nodes.push(<g key={`c${i}`}>{legCards[i].render(cxp, legTop + legH + 4, H)}</g>);
  });
  const cardsBottom = legTop + legH + 4 + H;
  const note = textBlock({ x: 0, y: cardsBottom + 12, w: W, text: "Punkterna under benen är resurser och förmågor i den resursbaserade synens mening, som i princip skulle kunna prövas med VRIO.", size: FS, fill: MUTED, anchor: "middle" });
  nodes.push(<g key="n">{note.node}</g>);
  return { h: cardsBottom + 12 + note.h, node: <g>{nodes}</g> };
}

// ── 6.1 Strategy execution void ─────────────────────────────────────────
function executionVoid(W, narrow) {
  const nodes = [];
  const sideW = narrow ? 120 : 190;
  const left = card({ w: sideW, title: "Strategisk avsikt", text: "Att formulera strategin lyckas ofta.", tone: "pine", align: "middle" });
  const right = card({ w: sideW, title: "Förmåga att genomföra", text: "Det är här organisationer misslyckas.", tone: "pine", align: "middle" });
  const H = Math.max(left.h, right.h);
  nodes.push(<g key="l">{left.render(0, 0, H)}</g>, <g key="r">{right.render(W - sideW, 0, H)}</g>);
  const gx = sideW + 10;
  const gw = W - 2 * sideW - 20;
  nodes.push(<rect key="gap" x={gx} y={6} width={gw} height={H - 12} rx={6} fill="none" stroke={WRONG} strokeWidth={1.4} strokeDasharray="5 4" />);
  const gt = textBlock({ x: gx + 6, y: 0, w: gw - 12, text: "Strategy execution void", size: narrow ? FS_SMALL : FS, weight: 600, fill: WRONG, anchor: "middle" });
  nodes.push(<g key="gt" transform={`translate(0 ${(H - gt.h) / 2})`}>{gt.node}</g>);
  const py = H + 26;
  const pillars = [
    { kicker: "Del 1", title: "Management effectiveness", text: "Förmågan och disciplinen i ledningsprocesserna: styrning, beslutsfattande, linjering av struktur och kultur. Inbäddad ger den uthållig konkurrensfördel.", tone: "pine" },
    { kicker: "Del 2", title: "Operational efficiency", text: "Kvaliteten i de operativa processerna. Höjer produktiviteten, men ensam ger den different sameness.", tone: "brass" },
  ];
  const p = narrow ? column(pillars, { y: py, w: W, gap: 10 }) : row(pillars, { y: py, w: W, gap: 14 });
  nodes.push(<Arrow key="a" x1={W / 2} y1={H - 4} x2={W / 2} y2={py - 4} size={7} color={WRONG} />);
  nodes.push(<g key="p">{p.node}</g>);
  const by = py + p.h + 12;
  const bpm = placed({ w: W, title: "BPM binder ihop dem", text: "Koppling från strategin till teman och nyckelprocesser, samordnade program mot flaskhalsarna, och ständiga återkopplingsslingor mellan strategi och verksamhet.", tone: "correct" }, 0, by);
  nodes.push(<g key="b">{bpm.node}</g>);
  return { h: by + bpm.h, node: <g>{nodes}</g> };
}

// ── 6.2 End-to-end genom silos ──────────────────────────────────────────
function endToEnd(W, narrow) {
  const nodes = [];
  const strat = card({ w: W, kicker: "Strategic processes", title: "Ledningens processer", text: "Styr, men skapar inte själva värdet.", tone: "plain", pad: 8, titleSize: FS });
  nodes.push(<g key="s">{strat.render(0, 0)}</g>);
  const sy = strat.h + 12;
  const siloH = narrow ? 150 : 132;
  const n = 4;
  const sg = narrow ? 6 : 12;
  const sw = (W - sg * (n - 1)) / n;
  for (let i = 0; i < n; i++) {
    nodes.push(<rect key={`si${i}`} x={i * (sw + sg)} y={sy} width={sw} height={siloH} rx={6} fill="#f1eee6" stroke="#cfc9ba" />);
    nodes.push(<g key={`st${i}`}>{textBlock({ x: i * (sw + sg) + 4, y: sy + 6, w: sw - 8, text: "Funktion", size: FS_SMALL, fill: MUTED, anchor: "middle" }).node}</g>);
  }
  const ay = sy + siloH / 2 + 6;
  nodes.push(<rect key="core" x={8} y={ay - 26} width={W - 16} height={52} rx={26} fill={PINE} />);
  const ct = textBlock({ x: 28, y: 0, w: W - 70, text: "Core process: från försäljning till leverans", size: narrow ? FS : FS_TITLE, weight: 600, fill: "white" });
  nodes.push(<g key="ct" transform={`translate(0 ${ay - ct.h / 2})`}>{ct.node}</g>);
  nodes.push(<polygon key="tip" points={`${W - 30},${ay - 12} ${W - 14},${ay} ${W - 30},${ay + 12}`} fill="white" />);
  const qText = "Vem styr processen från början till slut?";
  const qw = Math.min(W - 16, measure(qText, FS_SMALL, 600) + 28);
  const q = textBlock({ x: (W - qw) / 2 + 10, y: sy + siloH - 32, w: qw - 18, text: qText, size: FS_SMALL, weight: 600, fill: BRASS_TEXT, anchor: "middle" });
  nodes.push(<rect key="qb" x={(W - qw) / 2} y={sy + siloH - 37} width={qw} height={q.h + 10} rx={(q.h + 10) / 2} fill="white" stroke={BRASS} strokeWidth={1.2} />);
  nodes.push(<g key="q">{q.node}</g>);
  const supY = sy + siloH + 12;
  const sup = card({ w: W, kicker: "Support processes", title: "Stödjer kärnprocesserna", text: "Skapar värde indirekt, som IT och databaser.", tone: "plain", pad: 8, titleSize: FS });
  nodes.push(<g key="sup">{sup.render(0, supY)}</g>);
  const vy = supY + sup.h + 8;
  const v = textBlock({ x: 0, y: vy, w: W, text: "Kärnprocesserna skapar värdet: value creation (något som behövs) och value capture (att någon betalar för det).", size: FS, fill: MUTED });
  nodes.push(<g key="v">{v.node}</g>);
  return { h: vy + v.h, node: <g>{nodes}</g> };
}

// ── 6.3 Process asset ───────────────────────────────────────────────────
function processAsset(W, narrow) {
  const nodes = [];
  const sats = [
    { title: "Processmodeller", text: "BPMN: en del av asseten, inte hela", tone: "brass" },
    { title: "Affärsregler", tone: "plain" },
    { title: "Roller och ansvar", tone: "plain" },
    { title: "IT-system", tone: "plain" },
    { title: "Risker", tone: "plain" },
    { title: "Policies och dokumentation", tone: "plain" },
  ];
  let y;
  if (!narrow) {
    const cw = 170;
    const hubW = 210;
    const hub = card({ w: hubW, kicker: "Centralt arkiv", title: "Process asset", text: "Modeller, dokumentation och metadata, länkade på ett ställe.", tone: "solid", align: "middle" });
    const rowGap = 12;
    const cards = sats.map((s) => card({ ...s, w: cw, pad: 8, titleSize: FS, align: "middle" }));
    const ch = Math.max(...cards.map((c) => c.h));
    const colH = ch * 3 + rowGap * 2;
    const hubY = (colH - hub.h) / 2;
    const hubX = (W - hubW) / 2;
    cards.forEach((c, i) => {
      const leftSide = i < 3;
      const x = leftSide ? 0 : W - cw;
      const cy = (i % 3) * (ch + rowGap);
      nodes.push(<line key={`k${i}`} x1={leftSide ? x + cw : x} y1={cy + ch / 2} x2={leftSide ? hubX : hubX + hubW} y2={hubY + hub.h / 2} stroke={i === 0 ? BRASS : "#bdb6a6"} strokeWidth={i === 0 ? 2 : 1.3} />);
      nodes.push(<g key={`c${i}`}>{c.render(x, cy, ch)}</g>);
    });
    nodes.push(<g key="hub">{hub.render(hubX, hubY)}</g>);
    y = colH + 22;
  } else {
    const hub = card({ w: W, kicker: "Centralt arkiv", title: "Process asset", text: "Modeller, dokumentation och metadata, länkade på ett ställe.", tone: "solid", align: "middle" });
    nodes.push(<g key="hub">{hub.render(0, 0)}</g>);
    const gy = hub.h + 16;
    const cw = (W - 10) / 2;
    const cards = sats.map((s) => card({ ...s, w: cw, pad: 7, titleSize: FS, align: "middle" }));
    const ch = Math.max(...cards.map((c) => c.h));
    cards.forEach((c, i) => {
      const x = (i % 2) * (cw + 10);
      const cy = gy + Math.floor(i / 2) * (ch + 8);
      nodes.push(<g key={`c${i}`}>{c.render(x, cy, ch)}</g>);
    });
    nodes.push(<line key="k" x1={W / 2} y1={hub.h} x2={W / 2} y2={gy} stroke="#bdb6a6" strokeWidth={1.3} />);
    y = gy + 3 * (ch + 8) + 14;
  }
  const chain = [
    { title: "Tyst kunskap", text: "I medarbetarnas huvuden, förs vidare muntligt.", tone: "plain", align: "middle" },
    { title: "Explicit i asseten", text: "Modeller, regler, roller, system och risker.", tone: "pine", align: "middle" },
    { title: "En resurs", text: "I VRIO-mening: går att bygga vidare på och konkurrera med.", tone: "correct", align: "middle" },
  ];
  const f = flow(chain.map((c) => ({ ...c, pad: 8, titleSize: FS })), { y, w: W, narrow, gap: narrow ? 18 : 26 });
  nodes.push(<g key="f">{f.node}</g>);
  return { h: y + f.h, node: <g>{nodes}</g> };
}

// ── 8.1 Faserna från Innovate till Sustainability ───────────────────────
function faserna(W, narrow) {
  const nodes = [];
  const spec = (k, t, x, tone = "pine") => ({ kicker: k, title: t, text: x, tone, pad: narrow ? 7 : 6, titleSize: FS });
  const innovate = spec("Fas 5", "Innovate", "To-be-design och validerade lösningsförslag. Affärskrav till Develop.");
  const people = spec("Fas 6", "People", "Roller, KPI:er, organisation och utbildningsplan.", "plain");
  const develop = spec("Fas 7", "Develop", "Lösningar, dokumentation och specifikationer.", "plain");
  const implement = spec("Fas 8", "Implement", "Lösningen i drift, övertagen av linjen. Uppföljningen av nyttorna börjar.");
  const realize = spec("Fas 9", "Realize", "Nyttorna följs upp mot business case, var och en med en ägare.", "brass");
  const sustain = spec("Fas 10", "Sustainability", "Business as usual med ägarskap, dokumentation och KPI:er. Tar aldrig slut.", "correct");
  if (!narrow) {
    const gap = 18;
    const cw = (W - gap * 4) / 5;
    const cards = [innovate, implement, realize, sustain].map((s) => card({ ...s, w: cw }));
    const pc = card({ ...people, w: cw });
    const dc = card({ ...develop, w: cw });
    const half = Math.max(pc.h, dc.h);
    const midGap = 22;
    const H = Math.max(2 * half + midGap, ...cards.map((c) => c.h));
    const ph = (H - midGap) / 2;
    const xs = [0, 1, 2, 3, 4].map((i) => i * (cw + gap));
    const lbl = textBlock({ x: xs[2], y: 0, w: W - xs[2], text: "Uppföljningen av nyttorna i business case", size: FS_SMALL, weight: 600, fill: BRASS_TEXT, anchor: "middle" });
    const top = lbl.h + 14;
    nodes.push(<g key="lbl">{lbl.node}</g>);
    nodes.push(<path key="br" d={`M${xs[2] + 1},${top - 4} v-6 H${W - 1} v6`} fill="none" stroke={BRASS} strokeWidth={1.4} />);
    nodes.push(<g key="i">{cards[0].render(xs[0], top, H)}</g>);
    nodes.push(<g key="p">{pc.render(xs[1], top, ph)}</g>);
    nodes.push(<g key="d">{dc.render(xs[1], top + ph + midGap, ph)}</g>);
    nodes.push(<g key="par">{textBlock({ x: xs[1], y: top + ph + 3, w: cw, text: "parallellt", size: FS_SMALL, weight: 600, fill: BRASS_TEXT, anchor: "middle" }).node}</g>);
    [1, 2, 3].forEach((k, i) => nodes.push(<g key={`r${i}`}>{cards[k].render(xs[k + 1], top, H)}</g>));
    xs.slice(1).forEach((x, i) => nodes.push(<Arrow key={`a${i}`} x1={x - gap + 2} y1={top + H / 2} x2={x - 2} y2={top + H / 2} size={7} />));
    return { h: top + H, node: <g>{nodes}</g> };
  }
  let y = 0;
  const add = (s) => {
    const c = card({ ...s, w: W });
    nodes.push(<g key={`c${y}`}>{c.render(0, y)}</g>);
    y += c.h;
  };
  const arrow = () => {
    nodes.push(<Arrow key={`a${y}`} x1={W / 2} y1={y + 2} x2={W / 2} y2={y + 16} size={6} />);
    y += 18;
  };
  add(innovate); arrow();
  const half = (W - 8) / 2;
  const pc = card({ ...people, w: half });
  const dc = card({ ...develop, w: half });
  const ph = Math.max(pc.h, dc.h);
  nodes.push(<g key="p">{pc.render(0, y, ph)}</g>, <g key="d">{dc.render(half + 8, y, ph)}</g>);
  y += ph;
  nodes.push(<g key="par">{textBlock({ x: 0, y: y + 2, w: W, text: "People och Develop löper parallellt", size: FS_SMALL, weight: 600, fill: BRASS_TEXT, anchor: "middle" }).node}</g>);
  y += lineHeight(FS_SMALL) + 4;
  arrow(); add(implement); arrow(); add(realize); arrow(); add(sustain);
  return { h: y, node: <g>{nodes}</g> };
}

// ── 8.2 Kostnader och nyttor över tid ───────────────────────────────────
function kostnadNytta(W, narrow) {
  const nodes = [];
  const left = 18;
  const top = 10;
  const ch = narrow ? 170 : 190;
  const cw = W - left - 4;
  const X = (t) => left + t * cw;
  const Y = (v) => top + ch - v * ch;
  const golive = 0.42;
  nodes.push(<line key="ya" x1={left} y1={top} x2={left} y2={top + ch} stroke={MUTED} strokeWidth={1.4} />);
  nodes.push(<Arrow key="xa" x1={left} y1={top + ch} x2={W} y2={top + ch} color={MUTED} size={8} />);
  nodes.push(<line key="gl" x1={X(golive)} y1={top} x2={X(golive)} y2={top + ch} stroke={INK} strokeWidth={1.2} strokeDasharray="4 4" />);
  const cost = `M${X(0)},${Y(0.08)} C${X(0.18)},${Y(0.55)} ${X(0.3)},${Y(0.82)} ${X(golive)},${Y(0.72)} S${X(0.62)},${Y(0.22)} ${X(1)},${Y(0.16)}`;
  const benefit = `M${X(golive)},${Y(0.02)} C${X(0.55)},${Y(0.08)} ${X(0.7)},${Y(0.3)} ${X(1)},${Y(0.74)}`;
  nodes.push(<path key="c" d={cost} fill="none" stroke={WRONG} strokeWidth={2.6} />);
  nodes.push(<path key="b" d={benefit} fill="none" stroke={CORRECT} strokeWidth={2.6} />);
  nodes.push(<g key="cl">{textBlock({ x: X(0.05), y: Y(0.88), w: 150, text: "Kostnader", size: FS, weight: 600, fill: WRONG }).node}</g>);
  nodes.push(<g key="bl">{textBlock({ x: X(1) - 110, y: Y(0.92), w: 106, text: "Nyttor", size: FS, weight: 600, fill: CORRECT, anchor: "end" }).node}</g>);
  nodes.push(<g key="gll">{textBlock({ x: X(golive) + 6, y: top, w: 120, text: "Go-live", size: FS_SMALL, weight: 600, fill: INK }).node}</g>);
  const xl = top + ch + 8;
  nodes.push(<g key="t1">{textBlock({ x: left, y: xl, w: X(golive) - left - 6, text: "Bygget och införandet", size: FS_SMALL, fill: MUTED }).node}</g>);
  nodes.push(<g key="t2">{textBlock({ x: X(golive) + 6, y: xl, w: cw - X(golive) + left - 6, text: "Efter go-live: Realize och Sustainability", size: FS_SMALL, fill: MUTED, anchor: "end" }).node}</g>);
  const ny = xl + lineHeight(FS_SMALL) * 2 + 10;
  const notes = [
    { title: "Tålamod", text: "I början kan kostnad och nytta se dåliga ut. Avgör om det är ett verkligt problem eller bara tar tid.", tone: "plain", pad: 8, titleSize: FS },
    { title: "Mer än pengar", text: "KPI:er om resurser och om vad kunderna tycker. Nöjdare kunder kan ta ett halvår att märka.", tone: "plain", pad: 8, titleSize: FS },
  ];
  const n = narrow ? column(notes, { y: ny, w: W, gap: 8 }) : row(notes, { y: ny, w: W, gap: 12 });
  nodes.push(<g key="n">{n.node}</g>);
  return { h: ny + n.h, node: <g>{nodes}</g> };
}

// ── 9.1 Automatiseringens fyra steg ─────────────────────────────────────
function automatiseringensSteg(W, narrow) {
  const steps = [
    { kicker: "1950–1980-talet", title: "Task automation", text: "Enskilda uppgifter, som löneberäkningen.", tone: "plain" },
    { kicker: "1990–2015", title: "Workflow automation", text: "Systemet startar nästa steg när det förra är klart.", tone: "plain" },
    { kicker: "2015–2025", title: "User automation", text: "RPA tar över användarens arbete framför skärmen.", tone: "plain" },
    { kicker: "2025 och framåt", title: "Process autonomization", text: "Agenter fattar beslut och ändrar processen medan den pågår.", tone: "solid" },
  ].map((s) => ({ ...s, pad: 8, titleSize: FS }));
  const autoText = "Automatisering: designad och testad av människor, så utfallet är väntat";
  const autonText = "Autonomisering: går inte att testa för alla fall";
  const nodes = [];
  if (!narrow) {
    const gap = 22;
    const cw = (W - gap * 3) / 4;
    const span = 3 * cw + 2 * gap;
    const l1 = textBlock({ x: 0, y: 0, w: span, text: autoText, size: FS_SMALL, weight: 600, fill: BRASS_TEXT, anchor: "middle" });
    const l2 = textBlock({ x: span + gap, y: 0, w: cw, text: autonText, size: FS_SMALL, weight: 600, fill: PINE, anchor: "middle" });
    const lh = Math.max(l1.h, l2.h);
    const t1 = lh - l1.h;
    const t2 = lh - l2.h;
    nodes.push(<g key="l1" transform={`translate(0 ${t1})`}>{l1.node}</g>, <g key="l2" transform={`translate(0 ${t2})`}>{l2.node}</g>);
    const by = lh + 12;
    nodes.push(<path key="b1" d={`M1,${by} v-6 H${span - 1} v6`} fill="none" stroke={BRASS} strokeWidth={1.4} />);
    nodes.push(<path key="b2" d={`M${span + gap + 1},${by} v-6 H${W - 1} v6`} fill="none" stroke={PINE} strokeWidth={1.4} />);
    const r = row(steps, { y: by + 8, w: W, gap, arrows: true });
    nodes.push(<g key="r">{r.node}</g>);
    return { h: by + 8 + r.h, node: <g>{nodes}</g> };
  }
  let y = 0;
  const l1 = textBlock({ x: 0, y, w: W, text: autoText, size: FS_SMALL, weight: 600, fill: BRASS_TEXT });
  nodes.push(<g key="l1">{l1.node}</g>);
  y += l1.h + 6;
  const col = column(steps.slice(0, 3), { y, w: W, gap: 18, arrows: true });
  nodes.push(<g key="c">{col.node}</g>);
  y += col.h;
  nodes.push(<Arrow key="a" x1={W / 2} y1={y + 2} x2={W / 2} y2={y + 30} size={7} />);
  nodes.push(<line key="div" x1={0} y1={y + 16} x2={W / 2 - 14} y2={y + 16} stroke={PINE} strokeWidth={1.2} strokeDasharray="5 4" />);
  nodes.push(<line key="div2" x1={W / 2 + 14} y1={y + 16} x2={W} y2={y + 16} stroke={PINE} strokeWidth={1.2} strokeDasharray="5 4" />);
  y += 36;
  const l2 = textBlock({ x: 0, y, w: W, text: autonText, size: FS_SMALL, weight: 600, fill: PINE });
  nodes.push(<g key="l2">{l2.node}</g>);
  y += l2.h + 6;
  const last = placed({ ...steps[3], w: W }, 0, y);
  nodes.push(<g key="last">{last.node}</g>);
  return { h: y + last.h, node: <g>{nodes}</g> };
}

// ── 9.2 Green BPM ───────────────────────────────────────────────────────
function greenBpm(W, narrow) {
  const nodes = [];
  const n = 3;
  const tagH = 24;
  if (!narrow) {
    const sumW = 170;
    const aw = (W - sumW - 30 - 24 * (n - 1)) / n;
    const y = 4;
    for (let i = 0; i < n; i++) {
      const x = i * (aw + 24);
      nodes.push(<rect key={`a${i}`} x={x} y={y} width={aw} height={52} rx={9} fill="white" stroke={INK} strokeWidth={1.5} />);
      nodes.push(<g key={`at${i}`}>{textBlock({ x, y: y + 16, w: aw, text: `Aktivitet ${i + 1}`, size: FS, anchor: "middle" }).node}</g>);
      nodes.push(<rect key={`t${i}`} x={x + 4} y={y + 62} width={aw - 8} height={tagH} rx={5} fill="rgba(46,125,91,0.12)" stroke={CORRECT} />);
      nodes.push(<g key={`tt${i}`}>{textBlock({ x: x + 4, y: y + 66, w: aw - 8, text: "kWh · bränsle · CO₂", size: FS_SMALL, fill: CORRECT, anchor: "middle" }).node}</g>);
      if (i > 0) nodes.push(<Arrow key={`f${i}`} x1={x - 22} y1={y + 26} x2={x - 2} y2={y + 26} size={7} />);
      nodes.push(<line key={`s${i}`} x1={x + aw / 2} y1={y + 62 + tagH} x2={x + aw / 2} y2={y + 112} stroke={CORRECT} strokeWidth={1.2} strokeDasharray="3 3" />);
    }
    const lastX = (n - 1) * (aw + 24) + aw;
    nodes.push(<line key="sum" x1={aw / 2} y1={y + 112} x2={W - sumW / 2} y2={y + 112} stroke={CORRECT} strokeWidth={1.2} strokeDasharray="3 3" />);
    const sum = card({ w: sumW, title: "Summa per process", text: "Förbrukning och utsläpp för hela processen.", tone: "correct", pad: 8, titleSize: FS });
    nodes.push(<g key="sc">{sum.render(W - sumW, y)}</g>);
    nodes.push(<Arrow key="sa" x1={W - sumW / 2} y1={y + 112} x2={W - sumW / 2} y2={y + sum.h + 2} size={7} color={CORRECT} />);
    void lastX;
    const ny = y + 128;
    const res = row([
      { title: "Jämför och gör om", text: "Processer jämförs och designas om med miljön som mål.", tone: "plain", pad: 8, titleSize: FS },
      { title: "Sekventiellt kan vara grönare", text: "Ett äldre sekventiellt flöde kan vara grönare än ett parallelliserat, om miljön väger tyngre än genomloppstiden.", tone: "plain", pad: 8, titleSize: FS },
    ], { y: ny, w: W, gap: 12 });
    nodes.push(<g key="res">{res.node}</g>);
    return { h: ny + res.h, node: <g>{nodes}</g> };
  }
  let y = 0;
  const actW = 150;
  const tagX = actW + 12;
  const sumX = W - 10;
  const tagW = sumX - 14 - tagX;
  for (let i = 0; i < n; i++) {
    nodes.push(<rect key={`a${i}`} x={0} y={y} width={actW} height={44} rx={9} fill="white" stroke={INK} strokeWidth={1.5} />);
    nodes.push(<g key={`at${i}`}>{textBlock({ x: 0, y: y + 13, w: actW, text: `Aktivitet ${i + 1}`, size: FS, anchor: "middle" }).node}</g>);
    nodes.push(<rect key={`t${i}`} x={tagX} y={y + 10} width={tagW} height={tagH} rx={5} fill="rgba(46,125,91,0.12)" stroke={CORRECT} />);
    nodes.push(<g key={`tt${i}`}>{textBlock({ x: tagX, y: y + 14, w: tagW, text: "kWh · bränsle · CO₂", size: FS_SMALL, fill: CORRECT, anchor: "middle" }).node}</g>);
    nodes.push(<line key={`s${i}`} x1={tagX + tagW} y1={y + 22} x2={sumX} y2={y + 22} stroke={CORRECT} strokeWidth={1.2} strokeDasharray="3 3" />);
    if (i < n - 1) nodes.push(<Arrow key={`f${i}`} x1={actW / 2} y1={y + 46} x2={actW / 2} y2={y + 62} size={6} />);
    y += 64;
  }
  nodes.push(<line key="sl" x1={sumX} y1={22} x2={sumX} y2={y - 6} stroke={CORRECT} strokeWidth={1.2} strokeDasharray="3 3" />);
  nodes.push(<Arrow key="sa" x1={sumX} y1={y - 6} x2={sumX} y2={y + 8} size={7} color={CORRECT} />);
  const sum = card({ w: W, title: "Summa per process", text: "Förbrukning och utsläpp för hela processen. Processer jämförs och designas om med miljön som mål.", tone: "correct", pad: 8, titleSize: FS });
  nodes.push(<g key="sc">{sum.render(0, y + 10)}</g>);
  const ny = y + 10 + sum.h + 10;
  const note = textBlock({ x: 0, y: ny, w: W, text: "Ett sekventiellt flöde kan vara grönare än ett parallelliserat, om miljön väger tyngre än genomloppstiden.", size: FS, fill: MUTED });
  nodes.push(<g key="n">{note.node}</g>);
  return { h: ny + note.h, node: <g>{nodes}</g> };
}

// ── 10.1 DRD för rabatten ───────────────────────────────────────────────
function Decision({ x, y, w, h = 44, title, sub }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="white" stroke={PINE} strokeWidth={1.6} />
      <Lines x={x + w / 2} y={y + (sub ? 6 : 13)} lines={[title]} size={FS} weight={600} anchor="middle" fill={PINE} maxW={w - 8} />
      {sub && <Lines x={x + w / 2} y={y + 24} lines={[sub]} size={FS_SMALL} anchor="middle" fill={MUTED} maxW={w - 8} />}
    </g>
  );
}
function InputData({ x, y, w, h = 36, title }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={h / 2} fill="rgba(185,147,47,0.12)" stroke={BRASS} strokeWidth={1.6} />
      <Lines x={x + w / 2} y={y + 9} lines={[title]} size={FS} anchor="middle" fill={BRASS_TEXT} maxW={w - 16} />
    </g>
  );
}
function dmnDrd(W, narrow) {
  const nodes = [];
  const dw = narrow ? 156 : 190;
  const g = narrow ? 28 : 60;
  const yTask = 0;
  // BPMN-tasken som anropar beslutet.
  const tx = narrow ? 0 : 0;
  nodes.push(
    <g key="task" transform={`translate(${tx + TASK_W / 2 + 2} ${yTask + TASK_H / 2 + 2})`}>
      <ActivityShape cx={0} cy={0} taskType="businessRule" showLabel={false} />
    </g>,
  );
  nodes.push(<g key="tl">{textBlock({ x: tx + 8, y: yTask + 26, w: TASK_W - 12, text: "Determine discount", size: FS_SMALL, anchor: "middle" }).node}</g>);
  nodes.push(<g key="tlk">{textBlock({ x: tx, y: yTask + TASK_H + 8, w: narrow ? 120 : 150, text: "Business rule task i BPMN", size: FS_SMALL, fill: MUTED }).node}</g>);
  const topX = narrow ? W - dw : (W - dw) / 2 + 60;
  const topY = narrow ? 92 : 14;
  nodes.push(<Decision key="top" x={topX} y={topY} w={dw} title="Total discount" sub="toppbeslut, räknas i FEEL" />);
  nodes.push(<line key="call" x1={TASK_W + 4} y1={yTask + TASK_H / 2 + 2} x2={topX} y2={topY + 22} stroke={MUTED} strokeWidth={1.3} strokeDasharray="5 4" />);
  nodes.push(<g key="callt">{textBlock({ x: narrow ? TASK_W + 36 : TASK_W + 10, y: narrow ? yTask + 40 : topY - 2, w: narrow ? W - TASK_W - 36 : topX - TASK_W - 14, text: "anropar", size: FS_SMALL, fill: MUTED, italic: true, anchor: narrow ? "start" : "middle" }).node}</g>);
  const midY = topY + 44 + g + 10;
  const bw = narrow ? (W - 12) / 2 : dw;
  const baseX = narrow ? 0 : W / 2 - bw - 30;
  const addX = narrow ? bw + 12 : W / 2 + 30;
  nodes.push(<Decision key="base" x={baseX} y={midY} w={bw} title="Base discount" sub="beslutstabell" />);
  nodes.push(<Decision key="add" x={addX} y={midY} w={bw} title="Additional discount" sub="beslutstabell" />);
  const inY = midY + 44 + g;
  const iw = narrow ? (W - 12) / 2 : dw;
  const ovX = narrow ? 0 : W / 2 - iw - 30;
  const ctX = narrow ? iw + 12 : W / 2 + 30;
  nodes.push(<InputData key="ov" x={ovX} y={inY} w={iw} title="Order value" />);
  nodes.push(<InputData key="ct" x={ctX} y={inY} w={iw} title="Customer type" />);
  // Information requirements: pilarna går mot beslutet som behöver indata.
  const req = (x1, y1, x2, y2, k) => <Arrow key={k} x1={x1} y1={y1} x2={x2} y2={y2} color={PINE} width={1.6} size={8} />;
  nodes.push(req(baseX + bw / 2, midY - 2, topX + dw * 0.3, topY + 46, "r1"));
  nodes.push(req(addX + bw / 2, midY - 2, topX + dw * 0.7, topY + 46, "r2"));
  nodes.push(req(ovX + iw / 2, inY - 2, baseX + bw / 2, midY + 46, "r3"));
  nodes.push(req(ovX + iw * 0.8, inY - 2, addX + bw * 0.3, midY + 46, "r4"));
  nodes.push(req(ctX + iw / 2, inY - 2, addX + bw * 0.6, midY + 46, "r5"));
  const ly = inY + 36 + 14;
  const legend = textBlock({ x: 0, y: ly, w: W, text: "Rektangel = beslut · rundad = input data · pil = information requirement. FEEL behöver man inte kunna skriva.", size: FS_SMALL, fill: MUTED });
  nodes.push(<g key="lg">{legend.node}</g>);
  return { h: ly + legend.h, node: <g>{nodes}</g> };
}

// ── 11.1 Händelsernas former ────────────────────────────────────────────
function handelser(W, narrow) {
  const rows = [
    { head: "Start", sub: "tunn kant", items: [
      { kind: "start", event: "none", label: "None start" },
      { kind: "start", event: "message", label: "Message start" },
      { kind: "start", event: "timer", label: "Timer start" },
    ] },
    { head: "Intermediate", sub: "dubbel kant", items: [
      { kind: "intermediate", event: "message", label: "Catching message: väntar" },
      { kind: "intermediate", event: "message", throwing: true, label: "Throwing message: skickar direkt" },
      { kind: "intermediate", event: "timer", label: "Catching timer: väntar" },
    ] },
    { head: "End", sub: "tjock kant", items: [
      { kind: "end", event: "none", label: "None end" },
      { kind: "end", event: "message", label: "Message end" },
      { kind: "end", event: "error", label: "Error end" },
    ] },
  ];
  const nodes = [];
  const headW = narrow ? 0 : 140;
  const colW = (W - headW) / 3;
  let y = 0;
  rows.forEach((r, ri) => {
    let rowTop = y;
    if (narrow) {
      const h = textBlock({ x: 0, y, w: W, text: `${r.head} — ${r.sub}`, size: FS, weight: 600, fill: PINE });
      nodes.push(<g key={`h${ri}`}>{h.node}</g>);
      rowTop = y + h.h + 6;
    } else {
      nodes.push(<g key={`h${ri}`}>{textBlock({ x: 0, y: y + 10, w: headW - 10, text: r.head, size: FS_TITLE, weight: 600, fill: PINE }).node}</g>);
      nodes.push(<g key={`hs${ri}`}>{textBlock({ x: 0, y: y + 10 + lineHeight(FS_TITLE), w: headW - 10, text: r.sub, size: FS_SMALL, fill: MUTED }).node}</g>);
    }
    let rowH = 0;
    r.items.forEach((it, ii) => {
      const cx = headW + ii * colW + colW / 2;
      nodes.push(<EventShape key={`e${ri}${ii}`} cx={cx} cy={rowTop + 22} kind={it.kind} event={it.event} throwing={it.throwing} />);
      const lb = textBlock({ x: headW + ii * colW + 4, y: rowTop + 48, w: colW - 8, text: it.label, size: FS_SMALL, anchor: "middle" });
      nodes.push(<g key={`l${ri}${ii}`}>{lb.node}</g>);
      rowH = Math.max(rowH, 48 + lb.h);
    });
    y = rowTop + rowH + (narrow ? 16 : 14);
    if (ri < rows.length - 1) nodes.push(<line key={`sep${ri}`} x1={0} y1={y - 7} x2={W} y2={y - 7} stroke="#e1dccf" />);
  });
  const note = textBlock({ x: 0, y, w: W, text: "Ofylld ikon: catching, processen väntar på signalen. Fylld ikon: throwing, signalen skickas direkt.", size: FS, fill: MUTED });
  nodes.push(<g key="n">{note.node}</g>);
  return { h: y + note.h, node: <g>{nodes}</g> };
}

// ── 11.2 Interrupting mot non-interrupting ──────────────────────────────
function interruptingPanel({ x, y, w, interrupting }) {
  const nodes = [];
  const ax = x + 14 + TASK_W / 2;
  const ay = y + 40;
  nodes.push(<ActivityShape key="act" cx={ax} cy={ay} taskType="user" showLabel={false} />);
  nodes.push(<g key="al">{textBlock({ x: ax - TASK_W / 2 + 6, y: ay - 4, w: TASK_W - 12, text: "Aktivitet", size: FS, anchor: "middle" }).node}</g>);
  const bx = ax + 18;
  const by = ay + TASK_H / 2;
  nodes.push(<EventShape key="be" cx={bx} cy={by} kind="boundary" event="message" interrupting={interrupting} />);
  // Normalflödet åt höger, undantagsflödet nedåt.
  const nx = ax + TASK_W / 2;
  nodes.push(<Arrow key="norm" x1={nx} y1={ay} x2={x + w - 6} y2={ay} color={interrupting ? "rgba(34,40,42,0.25)" : INK} dashed={interrupting} size={7} />);
  nodes.push(<g key="nl">{textBlock({ x: nx + 6, y: ay - 22, w: x + w - nx - 12, text: interrupting ? "Vanliga flödet: används inte" : "Vanliga flödet: fortsätter", size: FS_SMALL, fill: interrupting ? MUTED : INK, anchor: "end" }).node}</g>);
  nodes.push(<Arrow key="exc" x1={bx} y1={by + 18} x2={bx} y2={by + 50} color={interrupting ? WRONG : BRASS} size={7} />);
  nodes.push(<g key="el">{textBlock({ x: bx + 10, y: by + 26, w: x + w - bx - 14, text: "Undantagsflödet", size: FS_SMALL, weight: 600, fill: interrupting ? WRONG : BRASS_TEXT }).node}</g>);
  const ty = by + 62;
  const c = card({
    w,
    title: interrupting ? "Interrupting: heldragen" : "Non-interrupting: streckad",
    text: interrupting
      ? "När signalen kommer avbryts aktiviteten, och processen följer undantagsflödet."
      : "Aktiviteten fortsätter. Undantagsflödet startar parallellt, och när aktiviteten är klar följs också det vanliga flödet.",
    tone: interrupting ? "wrong" : "brass", pad: 8, titleSize: FS,
  });
  return { h: ty - y + c.h, nodes, c, ty };
}
function interrupting(W, narrow) {
  const nodes = [];
  const pw = narrow ? W : (W - 20) / 2;
  const a = interruptingPanel({ x: 0, y: 0, w: pw, interrupting: true });
  if (!narrow) {
    const b = interruptingPanel({ x: pw + 20, y: 0, w: pw, interrupting: false });
    const H = Math.max(a.c.h, b.c.h);
    nodes.push(<g key="a">{a.nodes}{a.c.render(0, a.ty, H)}</g>, <g key="b">{b.nodes}{b.c.render(pw + 20, b.ty, H)}</g>);
    const ny = a.ty + H + 12;
    const note = textBlock({ x: 0, y: ny, w: W, text: "Message och timer kan vara non-interrupting. Error boundary events är alltid interrupting. Samma regel gäller event subprocessens startcirkel.", size: FS, fill: MUTED });
    nodes.push(<g key="n">{note.node}</g>);
    return { h: ny + note.h, node: <g>{nodes}</g> };
  }
  nodes.push(<g key="a">{a.nodes}{a.c.render(0, a.ty)}</g>);
  const oy = a.h + 24;
  const b = interruptingPanel({ x: 0, y: oy, w: pw, interrupting: false });
  nodes.push(<g key="b">{b.nodes}{b.c.render(0, b.ty)}</g>);
  const ny = oy + b.h + 12;
  const note = textBlock({ x: 0, y: ny, w: W, text: "Error boundary events är alltid interrupting. Samma regel gäller event subprocessens startcirkel.", size: FS, fill: MUTED });
  nodes.push(<g key="n">{note.node}</g>);
  return { h: ny + note.h, node: <g>{nodes}</g> };
}

// ── Registrering ────────────────────────────────────────────────────────
const fig = (id, build) => {
  const Component = () => <ConceptFigure id={id} build={build} />;
  Component.displayName = `Figur(${id})`;
  return Component;
};

export const PROCESS_FIGURES = {
  "bpm-livscykeln": fig("bpm-livscykeln", livscykeln),
  "bpm-ea-lager": fig("bpm-ea-lager", eaLager),
  "bpm-tidslinje": fig("bpm-tidslinje", tidslinje),
  "bpm-scenarier": fig("bpm-scenarier", scenarier),
  "bpm-forstarkning": fig("bpm-forstarkning", forstarkning),
  "bpm-kundupplevelsen": fig("bpm-kundupplevelsen", kundupplevelsen),
  "bpm-huset": fig("bpm-huset", huset),
  "bpm-7fe": fig("bpm-7fe", sjuFE),
  "bpm-framgangspallen": fig("bpm-framgangspallen", framgangspallen),
  "bpm-execution-void": fig("bpm-execution-void", executionVoid),
  "bpm-end-to-end": fig("bpm-end-to-end", endToEnd),
  "bpm-process-asset": fig("bpm-process-asset", processAsset),
  "bpm-faserna-6-10": fig("bpm-faserna-6-10", faserna),
  "bpm-kostnad-nytta": fig("bpm-kostnad-nytta", kostnadNytta),
  "bpm-automatiseringens-steg": fig("bpm-automatiseringens-steg", automatiseringensSteg),
  "bpm-green-bpm": fig("bpm-green-bpm", greenBpm),
  "bpm-dmn-drd": fig("bpm-dmn-drd", dmnDrd),
  "bpm-handelser": fig("bpm-handelser", handelser),
  "bpm-interrupting": fig("bpm-interrupting", interrupting),
};
