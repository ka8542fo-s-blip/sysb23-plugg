// Begreppsfigurerna i Databaser-kompendiet. Varje figur är en build-funktion
// (W, narrow) => { h, node } som ritas i brett och smalt format av
// ConceptFigure. Innehållet följer kapitlets text och exempel; figurtext,
// källa och tillgänglighetstexter står i conceptFigureMeta.js.
import {
  ConceptFigure, card, row, column, flow, stack, heading, textBlock, Lines, wrap, measure, measureRaw,
  lineHeight, Arrow, CurvedArrow, TONE, INK, PINE, BRASS, BRASS_TEXT, MUTED, ARROW,
  FS, FS_TITLE, FS_SMALL,
} from "./conceptFigures.jsx";

const WRONG = "var(--wrong)";

// ── Hjälpare ────────────────────────────────────────────────────────────
// Relation i kursens skrivsätt: NAMN(attr, attr). Primärnyckel med hel
// understrykning, främmande nyckel med prickad (övningshäftets facit).
// attrs: [{ name, pk, fk, mark }] — mark färgar attributet (brass).
function relation({ x, y, w, name, attrs, size = FS }) {
  const lh = lineHeight(size) + 4;
  const tokens = [{ text: `${name}(`, bold: true }];
  attrs.forEach((a, i) => tokens.push({ ...a, text: a.name + (i < attrs.length - 1 ? "," : ")") }));
  // Varje del ritas med textLength = den uppskattade bredden, så att
  // understrykningarna och mellanrummen hamnar exakt där layouten räknat.
  const space = measureRaw(" ", size) + 1;
  const lines = [[]];
  let cx = 0;
  tokens.forEach((t) => {
    const tw = measureRaw(t.text, size, t.bold ? 600 : 400);
    if (cx > 0 && cx + tw > w) {
      lines.push([]);
      cx = 18;
    }
    lines[lines.length - 1].push({ ...t, dx: cx, tw });
    cx += tw + space;
  });
  const nodes = [];
  lines.forEach((line, li) => {
    const by = y + size * 0.93 + li * lh;
    line.forEach((t, ti) => {
      const nameW = t.name ? measureRaw(t.name, size) : 0;
      nodes.push(
        <g key={`${li}-${ti}`}>
          <text x={x + t.dx} y={by} fontSize={size} fontWeight={t.bold ? 600 : 400} fill={t.mark ? BRASS_TEXT : INK} textLength={t.tw} lengthAdjust="spacing">
            {t.text}
          </text>
          {t.pk && <line x1={x + t.dx} y1={by + 3} x2={x + t.dx + nameW} y2={by + 3} stroke={INK} strokeWidth={1.2} />}
          {t.fk && (
            <line x1={x + t.dx} y1={by + (t.pk ? 6 : 3)} x2={x + t.dx + nameW} y2={by + (t.pk ? 6 : 3)} stroke={INK} strokeWidth={1.2} strokeDasharray="1.5 2.5" />
          )}
        </g>,
      );
    });
  });
  return { h: lines.length * lh, node: <g>{nodes}</g> };
}

// Liten tabell: rubrikrad med attributnamn och rader med värden.
// cols: [{ label, w }] (w som andel), rows: [{ cells, tone }].
function table({ x, y, w, name, cols, rows, size = FS, rowH = 26 }) {
  const total = cols.reduce((s, c) => s + c.w, 0);
  const widths = cols.map((c) => (c.w / total) * w);
  const xs = widths.map((_, i) => x + widths.slice(0, i).reduce((s, v) => s + v, 0));
  const nameH = name ? 22 : 0;
  const headY = y + nameH;
  const nodes = [];
  if (name) nodes.push(<Lines key="n" x={x} y={y} lines={[name]} size={FS_SMALL} weight={600} fill={BRASS_TEXT} maxW={w} />);
  nodes.push(<rect key="h" x={x} y={headY} width={w} height={rowH} fill="rgba(31,78,69,0.10)" stroke={PINE} strokeWidth={1.2} />);
  cols.forEach((c, i) => {
    nodes.push(<Lines key={`hc${i}`} x={xs[i] + 7} y={headY + (rowH - size) / 2 - 1} lines={[c.label]} size={size} weight={600} fill={PINE} maxW={widths[i] - 10} />);
  });
  rows.forEach((r, ri) => {
    const ry = headY + rowH * (ri + 1);
    const tone = r.tone ? TONE[r.tone] : null;
    nodes.push(<rect key={`r${ri}`} x={x} y={ry} width={w} height={rowH} fill={tone ? tone.fill : "white"} stroke="#cfc9ba" strokeWidth={1} />);
    r.cells.forEach((cell, ci) => {
      nodes.push(
        <Lines key={`c${ri}-${ci}`} x={xs[ci] + 7} y={ry + (rowH - size) / 2 - 1} lines={[cell]} size={size} fill={tone && r.textTone ? tone.title : INK} maxW={widths[ci] - 10} />,
      );
    });
  });
  cols.slice(1).forEach((_, i) => {
    nodes.push(<line key={`v${i}`} x1={xs[i + 1]} y1={headY} x2={xs[i + 1]} y2={headY + rowH * (rows.length + 1)} stroke="#cfc9ba" strokeWidth={1} />);
  });
  const h = nameH + rowH * (rows.length + 1);
  const cell = (ri, ci) => ({ x: xs[ci], y: headY + rowH * (ri + 1), w: widths[ci], h: rowH });
  return { h, node: <g>{nodes}</g>, cell, head: (ci) => ({ x: xs[ci], y: headY, w: widths[ci], h: rowH }) };
}

// Klammer längs en sträcka med etikett (lodrät eller vågrät).
function Brace({ x1, y1, x2, y2, color = BRASS }) {
  const vertical = x1 === x2;
  const d = vertical
    ? `M${x1},${y1} h6 V${y2} h-6`
    : `M${x1},${y1} v-6 H${x2} v6`;
  return <path d={d} fill="none" stroke={color} strokeWidth={1.4} />;
}

// ── 1.1 Designkedjan ────────────────────────────────────────────────────
function designkedjan(W, narrow) {
  const specs = [
    { kicker: "Indata", title: "Verksamhetskrav", text: "I löpande text, till exempel: en anställd måste arbeta på exakt en avdelning.", tone: "plain" },
    { kicker: "Steg 1", title: "Konceptuell design", text: "ER-modellering: kraven blir ett ER-diagram. Kapitel 4–6.", tone: "pine" },
    { kicker: "Steg 2", title: "Logisk design", text: "Relationer i textform, som Employee(EmpNo, Name, …), och normalisering vid behov. Kapitel 7–8.", tone: "pine" },
    { kicker: "Steg 3", title: "Fysisk design", text: "DDL: körbar CREATE TABLE-kod. Kapitel 9.", tone: "pine" },
  ];
  return stack([
    (y) => flow(specs, { y, w: W, narrow }),
    (y) => {
      const c = card({ w: W, text: "SQL kommer sist: koden skrivs först när modellen är genomtänkt.", tone: "brass", align: "middle" });
      return { h: c.h, node: c.render(0, y) };
    },
  ], { gap: 16 });
}

// ── 2.1 Relationens anatomi ─────────────────────────────────────────────
function relationensAnatomi(W, narrow) {
  const rows = [
    { cells: ["E-104", "Mary", "mary@example.org"] },
    { cells: ["E-207", "Gary", "gary@example.org"] },
    { cells: ["E-311", "Sam", "sam@example.org"] },
    { cells: ["E-422", "Mary", "mary2@example.org"], tone: "brass" },
  ];
  const cols = [{ label: "EmployeeNo", w: 30 }, { label: "Name", w: 20 }, { label: "WorkEmail", w: 50 }];
  if (!narrow) {
    const tw = 380;
    const t = table({ x: 0, y: 26, w: tw, name: "EMPLOYEE", cols, rows });
    const ax = tw + 30;
    const aw = W - ax;
    const head = t.head(0);
    const notes = [
      { y: head.y - 4, title: "Schema", text: "EMPLOYEE(EmployeeNo, Name, WorkEmail). Grad 3 = antalet attribut." },
      { y: t.cell(0, 0).y + 20, title: "Aktuellt värde", text: "Tuplerna som är registrerade just nu. Kardinalitet 4 = antalet tupler." },
      { y: t.cell(3, 0).y + 6, title: "Ny tupel", text: "E-422 höjer kardinaliteten från 3 till 4. Graden är fortfarande 3." , tone: "brass" },
    ];
    const nodes = [t.node];
    let lastBottom = 0;
    const tops = [];
    notes.forEach((n, i) => {
      const c = card({ w: aw, title: n.title, text: n.text, tone: n.tone || "plain", pad: 8, titleSize: FS_TITLE - 1 });
      const ny = Math.max(n.y, lastBottom + 8);
      nodes.push(<g key={`n${i}`}>{c.render(ax, ny)}</g>);
      tops.push(ny);
      lastBottom = ny + c.h;
    });
    // Klamrar: schemat (rubrikraden) och värdet (raderna), med pilar till förklaringarna.
    const rowsTop = t.cell(0, 0).y;
    const rowsBottom = t.cell(3, 0).y + t.cell(3, 0).h;
    nodes.push(<Brace key="b1" x1={tw + 8} y1={head.y} x2={tw + 8} y2={head.y + head.h} />);
    nodes.push(<Brace key="b2" x1={tw + 8} y1={rowsTop} x2={tw + 8} y2={rowsBottom} />);
    nodes.push(<Arrow key="a1" x1={tw + 14} y1={head.y + head.h / 2} x2={ax - 2} y2={tops[0] + 14} size={6} />);
    nodes.push(<Arrow key="a2" x1={tw + 14} y1={(rowsTop + rowsBottom) / 2 - 10} x2={ax - 2} y2={tops[1] + 14} size={6} />);
    const lastRow = t.cell(3, 2);
    nodes.push(<Arrow key="a3" x1={tw + 14} y1={lastRow.y + lastRow.h / 2} x2={ax - 2} y2={tops[2] + 14} size={6} color={BRASS} />);
    const dom = card({ w: tw, title: "Domän för EmployeeNo", text: "E- följt av exakt tre siffror. E-555 är tillåtet fast ingen har det; EMP-104 och E-12 är det inte.", tone: "pine", pad: 8, titleSize: FS_TITLE - 1 });
    const domY = 26 + t.h + 16;
    nodes.push(<g key="d">{dom.render(0, domY)}</g>);
    nodes.push(<Lines key="ka" x={0} y={0} lines={["Kolumn = attribut · rad = tupel"]} size={FS_SMALL} fill={MUTED} maxW={tw} />);
    return { h: Math.max(domY + dom.h, lastBottom), node: <g>{nodes}</g> };
  }
  const t = table({ x: 0, y: 22, w: W, name: "EMPLOYEE", cols, rows });
  return stack([
    () => ({ h: 22 + t.h, node: <g><Lines x={W} y={0} lines={["kolumn = attribut, rad = tupel"]} size={FS_SMALL} fill={MUTED} anchor="end" maxW={W - 90} />{t.node}</g> }),
    (y) => column([
      { title: "Schema och grad", text: "EMPLOYEE(EmployeeNo, Name, WorkEmail). Grad 3 = antalet attribut.", tone: "plain" },
      { title: "Aktuellt värde och kardinalitet", text: "Tuplerna just nu. Den nya tupeln E-422 höjer kardinaliteten från 3 till 4; graden är fortfarande 3.", tone: "brass" },
      { title: "Domän för EmployeeNo", text: "E- följt av exakt tre siffror. E-555 är tillåtet fast ingen har det; EMP-104 och E-12 är det inte.", tone: "pine" },
    ], { y, w: W, gap: 10 }),
  ]);
}

// ── 3.1 Främmande nyckel ────────────────────────────────────────────────
function frammandeNyckel(W, narrow) {
  const projRows = [
    { cells: ["P-10", "Atlas", "E-104"] },
    { cells: ["P-20", "Nova", "E-104"] },
    { cells: ["P-30", "…", "E-999"], tone: "wrong", textTone: true },
  ];
  const projCols = [{ label: "ProjectNo", w: 26 }, { label: "Title", w: 22 }, { label: "LeaderEmployeeNo", w: 52 }];
  const empCols = [{ label: "EmployeeNo", w: 55 }, { label: "Name", w: 45 }];
  const empRows = [{ cells: ["E-104", "Mary"] }, { cells: ["E-207", "Gary"] }];
  if (!narrow) {
    const pw = 330;
    const ex = 450;
    const p = table({ x: 0, y: 0, w: pw, name: "PROJECT — refererande", cols: projCols, rows: projRows });
    const e = table({ x: ex, y: 0, w: W - ex, name: "EMPLOYEE — refererad", cols: empCols, rows: empRows });
    const target = e.cell(0, 0);
    const nodes = [p.node, e.node];
    [0, 1].forEach((ri) => {
      const c = p.cell(ri, 2);
      nodes.push(<CurvedArrow key={`f${ri}`} x1={c.x + c.w} y1={c.y + c.h / 2} cx={(c.x + c.w + target.x) / 2} cy={c.y + c.h / 2 - (ri === 0 ? 4 : 10)} x2={target.x - 2} y2={target.y + target.h / 2 + (ri === 0 ? -4 : 4)} color={PINE} />);
    });
    const bad = p.cell(2, 2);
    nodes.push(<Arrow key="bad" x1={bad.x + bad.w} y1={bad.y + bad.h / 2} x2={ex - 30} y2={bad.y + bad.h / 2} color={WRONG} dashed />);
    nodes.push(<text key="x" x={ex - 18} y={bad.y + bad.h / 2 + 5} fontSize={16} fontWeight={700} fill={WRONG}>✕</text>);
    const below = p.h + 18;
    const ok = card({ w: 300, title: "Samma värde flera gånger", text: "Mary leder både Atlas och Nova. E-104 upprepas i PROJECT men identifierar en tupel i EMPLOYEE.", tone: "correct", pad: 8, titleSize: FS_TITLE - 1 });
    const no = card({ w: W - 320, title: "Referensen måste träffa", text: "E-999 har rätt form men ingen anställd har numret. Tupeln bryter mot villkoret.", tone: "wrong", pad: 8, titleSize: FS_TITLE - 1 });
    const H = Math.max(ok.h, no.h);
    nodes.push(<g key="ok">{ok.render(0, below, H)}</g>);
    nodes.push(<g key="no">{no.render(320, below, H)}</g>);
    const fk = textBlock({ x: 0, y: below + H + 12, w: W, text: "FK1 : (LeaderEmployeeNo) REF EMPLOYEE(EmployeeNo)", size: FS, fill: MUTED });
    nodes.push(<g key="fk">{fk.node}</g>);
    return { h: below + H + 12 + fk.h, node: <g>{nodes}</g> };
  }
  const p = table({ x: 0, y: 0, w: W, name: "PROJECT — refererande", cols: projCols, rows: projRows });
  const ey = p.h + 58;
  const ew = 190;
  const e = table({ x: 0, y: ey, w: ew, name: "EMPLOYEE — refererad", cols: empCols, rows: empRows });
  const target = e.cell(0, 1);
  const ty = target.y + target.h / 2;
  const nodes = [p.node, e.node];
  // Pilarna går längs högerkanten och svänger in i E-104-raden från höger.
  [0, 1].forEach((ri) => {
    const c = p.cell(ri, 2);
    nodes.push(<CurvedArrow key={`f${ri}`} x1={W - 6 - ri * 8} y1={c.y + c.h / 2} cx={W - 6 - ri * 8} cy={ty + (ri ? 6 : -6)} x2={ew + 3} y2={ty + (ri ? 5 : -5)} color={PINE} />);
  });
  const bad = p.cell(2, 2);
  nodes.push(<Arrow key="bad" x1={bad.x + 30} y1={bad.y + bad.h} x2={bad.x + 30} y2={bad.y + bad.h + 22} color={WRONG} dashed />);
  nodes.push(<text key="x" x={bad.x + 24} y={bad.y + bad.h + 40} fontSize={16} fontWeight={700} fill={WRONG}>✕</text>);
  const rest = column([
    { title: "Samma värde flera gånger", text: "Mary leder både Atlas och Nova. E-104 upprepas i PROJECT men identifierar en tupel i EMPLOYEE.", tone: "correct" },
    { title: "Referensen måste träffa", text: "E-999 har rätt form men ingen anställd har numret. Tupeln bryter mot villkoret.", tone: "wrong" },
  ], { y: ey + e.h + 16, w: W, gap: 10 });
  nodes.push(<g key="rest">{rest.node}</g>);
  const fk = textBlock({ x: 0, y: ey + e.h + 16 + rest.h + 10, w: W, text: "FK1 : (LeaderEmployeeNo) REF EMPLOYEE(EmployeeNo)", size: FS_SMALL, fill: MUTED });
  nodes.push(<g key="fk">{fk.node}</g>);
  return { h: ey + e.h + 16 + rest.h + 10 + fk.h, node: <g>{nodes}</g> };
}

// ── 7.2 Regel 3–5 sida vid sida ─────────────────────────────────────────
function binaraRegler(W, narrow) {
  const rules = [
    {
      kicker: "Regel 3", title: "1:1", tone: "pine",
      rel: { name: "PROJECT", attrs: [{ name: "ProjectNo", pk: true }, { name: "ResponsibleEmployeeNo", fk: true, mark: true }] },
      text: "Värd: den sida som deltar totalt. Främmande nyckeln görs till kandidatnyckel, CK2 = {ResponsibleEmployeeNo}, annars bevaras inte 1:1.",
    },
    {
      kicker: "Regel 4", title: "1:N", tone: "pine",
      rel: { name: "PROJECT", attrs: [{ name: "ProjectNo", pk: true }, { name: "Title" }, { name: "LeaderEmployeeNo", fk: true, mark: true }] },
      text: "Främmande nyckeln hamnar på många-sidan. Värdet får upprepas: P-10 och P-20 kan båda referera E-104.",
    },
    {
      kicker: "Regel 5", title: "M:N", tone: "pine",
      rel: { name: "WORKS_ON", attrs: [{ name: "EmployeeNo", pk: true, fk: true, mark: true }, { name: "ProjectNo", pk: true, fk: true, mark: true }, { name: "AllocationPercentage" }] },
      text: "En ny relation. De två främmande nycklarna bildar tillsammans primärnyckeln; relationsattributen ingår inte i den.",
    },
  ];
  const gap = 14;
  const cw = narrow ? W : (W - gap * 2) / 3;
  const pad = 10;
  const parts = rules.map((r) => {
    const head = card({ w: cw, kicker: r.kicker, title: r.title, tone: "solid", pad: 8 });
    const rel = relation({ x: 0, y: 0, w: cw - 2 * pad, ...r.rel });
    const txt = wrap(r.text, cw - 2 * pad, FS);
    const bodyH = pad + rel.h + 8 + txt.length * lineHeight(FS) + pad;
    return { r, head, rel, txt, bodyH };
  });
  const headH = Math.max(...parts.map((p) => p.head.h));
  const bodyH = Math.max(...parts.map((p) => p.bodyH));
  const draw = (p, x, y, hb) => {
    const rel = relation({ x: x + pad, y: y + headH + pad, w: cw - 2 * pad, ...p.r.rel });
    return (
      <g>
        {p.head.render(x, y, headH)}
        <rect x={x} y={y + headH} width={cw} height={hb} fill="white" stroke={PINE} strokeWidth={1.2} />
        {rel.node}
        <Lines x={x + pad} y={y + headH + pad + rel.h + 8} lines={p.txt} size={FS} maxW={cw - 2 * pad} />
      </g>
    );
  };
  const legend = textBlock({ x: 0, y: 0, w: W, text: "Hel understrykning = primärnyckel · prickad = främmande nyckel · i mässing = referensen", size: FS_SMALL, fill: MUTED });
  if (!narrow) {
    const top = legend.h + 10;
    return {
      h: top + headH + bodyH,
      node: <g>{legend.node}{parts.map((p, i) => <g key={i}>{draw(p, i * (cw + gap), top, bodyH)}</g>)}</g>,
    };
  }
  let y = legend.h + 10;
  const nodes = [legend.node];
  parts.forEach((p, i) => {
    nodes.push(<g key={i}>{draw(p, 0, y, p.bodyH)}</g>);
    y += headH + p.bodyH + 14;
  });
  return { h: y - 14, node: <g>{nodes}</g> };
}

// ── 7.1 Nyckelkedjan för svaga entiteter ────────────────────────────────
function svagNyckelkedja(W, narrow) {
  const rels = [
    { name: "PROJECT", attrs: [{ name: "ProjectNo", pk: true }], note: "Ägaren mappas först." },
    { name: "PROJECT_TASK", attrs: [{ name: "ProjectNo", pk: true, fk: true, mark: true }, { name: "TaskNo", pk: true }, { name: "TaskName" }], note: "FK1 : (ProjectNo) REF PROJECT(ProjectNo)" },
    { name: "TASK_STEP", attrs: [{ name: "ProjectNo", pk: true, fk: true, mark: true }, { name: "TaskNo", pk: true, fk: true, mark: true }, { name: "StepNo", pk: true }], note: "FK1 : (ProjectNo, TaskNo) REF PROJECT_TASK(ProjectNo, TaskNo)" },
  ];
  const bw = narrow ? W - 26 : 330;
  const bx = 26;
  const pad = 10;
  const nodes = [];
  let y = 0;
  const boxes = [];
  rels.forEach((r, i) => {
    const rel = relation({ x: bx + pad, y: y + pad, w: bw - 2 * pad, name: r.name, attrs: r.attrs });
    const noteW = narrow ? bw - 2 * pad : W - bx - bw - 20;
    const note = textBlock({ x: 0, y: 0, w: noteW, text: r.note, size: FS_SMALL, fill: MUTED });
    const boxH = pad * 2 + rel.h + (narrow ? note.h + 6 : 0);
    nodes.push(<rect key={`b${i}`} x={bx} y={y} width={bw} height={boxH} rx={6} fill="white" stroke={PINE} strokeWidth={1.4} />);
    nodes.push(<g key={`r${i}`}>{rel.node}</g>);
    if (narrow) {
      nodes.push(<g key={`n${i}`}>{textBlock({ x: bx + pad, y: y + pad + rel.h + 6, w: noteW, text: r.note, size: FS_SMALL, fill: MUTED }).node}</g>);
    } else {
      nodes.push(<g key={`n${i}`}>{textBlock({ x: bx + bw + 20, y: y + boxH / 2 - note.h / 2, w: noteW, text: r.note, size: FS_SMALL, fill: MUTED }).node}</g>);
    }
    boxes.push({ y, h: boxH });
    y += boxH + 30;
  });
  // Referenspilar på vänster sida: varje led pekar på sin närmaste ägare.
  [1, 2].forEach((i) => {
    const from = boxes[i];
    const to = boxes[i - 1];
    nodes.push(<CurvedArrow key={`a${i}`} x1={bx} y1={from.y + 18} cx={bx - 30} cy={(from.y + to.y + to.h) / 2} x2={bx - 1} y2={to.y + to.h - 12} color={BRASS} />);
  });
  const ex = textBlock({ x: 0, y: y - 8, w: W, text: "Exempel: steg 2 i uppgift 1 i P-10 är (P-10, 1, 2). Det pekar på uppgiften (P-10, 1), som pekar på projektet P-10.", size: FS, fill: INK });
  nodes.push(<g key="ex">{ex.node}</g>);
  return { h: y - 8 + ex.h, node: <g>{nodes}</g> };
}

// ── 8.1 Anomaliernas orsak ──────────────────────────────────────────────
function anomalier(W, narrow) {
  const cause = card({
    w: W, tone: "brass", kicker: "Orsaken",
    title: "Ett faktum lagras i en relation vars nyckel handlar om något annat",
    text: "EmployeeProject har nyckeln {EmployeeNo, ProjectNo}, men lagrar också projektets namn och budget.",
  });
  const effects = [
    { title: "Uppdateringsanomali", text: "Ska P3:s budget höjas måste två celler ändras. Ändras bara den ena har P3 två budgetar.", tone: "wrong" },
    { title: "Insättningsanomali", text: "Projektet P5 kan inte registreras innan någon är tilldelad det, eftersom nyckeln kräver ett EmployeeNo.", tone: "wrong" },
    { title: "Raderingsanomali", text: "Raderas de anställda E4 och E5 försvinner all information om projektet P3.", tone: "wrong" },
  ];
  const nodes = [<g key="c">{cause.render(0, 0)}</g>];
  const ey = cause.h + 30;
  const eff = narrow ? column(effects, { y: ey, w: W - 20, x: 20, gap: 10 }) : row(effects, { y: ey, w: W, gap: 14 });
  nodes.push(<g key="e">{eff.node}</g>);
  if (narrow) {
    nodes.push(<line key="spine" x1={8} y1={cause.h} x2={8} y2={ey + eff.positions[2].y - ey + eff.positions[2].h / 2} stroke={ARROW} strokeWidth={1.6} />);
    eff.positions.forEach((p, i) => nodes.push(<Arrow key={`a${i}`} x1={8} y1={p.y + p.h / 2} x2={18} y2={p.y + p.h / 2} size={6} />));
  } else {
    eff.positions.forEach((p, i) => nodes.push(<Arrow key={`a${i}`} x1={W / 2 + (i - 1) * 60} y1={cause.h + 2} x2={p.x + p.w / 2} y2={ey - 2} size={7} />));
  }
  const fy = ey + eff.h + 16;
  const fix = card({ w: W, tone: "correct", title: "Dekomposition", text: "Employee(EmployeeNo, Name, Address), Project(ProjectNo, ProjectName, Budget) och Work(EmployeeNo, ProjectNo): varje faktum i en relation med rätt nyckel." });
  nodes.push(<g key="f">{fix.render(0, fy)}</g>);
  return { h: fy + fix.h, node: <g>{nodes}</g> };
}

// ── 8.2 Normalformstrappan ──────────────────────────────────────────────
function normalformstrappan(W, narrow) {
  const steps = [
    { title: "1NF", text: "Värdena i varje attribut är atomära.", breaks: "Bryts av: ProjectNo = \"P1, P5\"" },
    { title: "2NF", text: "1NF, och inget icke-primärattribut beror på en äkta delmängd av någon kandidatnyckel.", breaks: "Bryts av ett partiellt beroende. Kan bara hända när en kandidatnyckel är sammansatt." },
    { title: "3NF", text: "2NF, och varje icke-primärattribut är icke-transitivt beroende av varje kandidatnyckel.", breaks: "Bryts av ett transitivt beroende." },
  ];
  if (!narrow) {
    const gap = 12;
    const sw = (W - 40 - gap * 2) / 3;
    const rise = 46;
    const cards = steps.map((s, i) => card({ w: sw, title: s.title, text: s.text, tone: i === 2 ? "solid" : "pine", titleSize: 17 }));
    const brk = steps.map((s) => textBlock({ x: 0, y: 0, w: sw, text: s.breaks, size: FS_SMALL, fill: MUTED, italic: true }));
    const H = Math.max(...cards.map((c) => c.h));
    const baseTop = rise * 2 + 20;
    const nodes = [];
    cards.forEach((c, i) => {
      const x = 40 + i * (sw + gap);
      const y = baseTop - i * rise;
      nodes.push(<g key={i}>{c.render(x, y, H + i * rise)}</g>);
      nodes.push(<g key={`b${i}`}>{textBlock({ x, y: baseTop + H + 10, w: sw, text: steps[i].breaks, size: FS_SMALL, fill: MUTED, italic: true }).node}</g>);
    });
    const brkH = Math.max(...brk.map((b) => b.h));
    nodes.push(<Arrow key="up" x1={14} y1={baseTop + H} x2={14} y2={baseTop - rise * 2} color={BRASS} width={2} />);
    nodes.push(
      <text key="ul" data-rotated fontSize={FS_SMALL} fill={BRASS_TEXT} fontWeight={600} transform={`translate(28 ${baseTop + H - 4}) rotate(-90)`}>
        <tspan data-maxw={H + rise * 2}>mindre redundans</tspan>
      </text>,
    );
    return { h: baseTop + H + 10 + brkH, node: <g>{nodes}</g> };
  }
  // Smalt: 3NF överst, indraget som en trappa nedåt mot 1NF.
  const order = [2, 1, 0];
  let y = 0;
  const nodes = [];
  order.forEach((i, k) => {
    const indent = (2 - k) * 0 + k * 14;
    const c = card({ w: W - 30 - indent, title: steps[i].title, text: `${steps[i].text} ${steps[i].breaks}`, tone: i === 2 ? "solid" : "pine", titleSize: 16 });
    nodes.push(<g key={i}>{c.render(30 + indent, y)}</g>);
    y += c.h + 10;
  });
  nodes.push(<Arrow key="up" x1={12} y1={y - 12} x2={12} y2={4} color={BRASS} width={2} />);
  return { h: y - 10, node: <g>{nodes}</g> };
}

// ── 8.3 Beroendediagram ─────────────────────────────────────────────────
function beroendediagram(W, narrow) {
  const attrs = ["A", "B", "C", "D", "E", "F"];
  const gap = narrow ? 12 : 30;
  const bw = narrow ? (W - gap * 5) / 6 : 62;
  const total = bw * 6 + gap * 5;
  const x0 = (W - total) / 2;
  const top = narrow ? 84 : 86;
  const bh = 34;
  const ax = (i) => x0 + i * (bw + gap) + bw / 2;
  const nodes = [];
  attrs.forEach((a, i) => {
    const prime = i < 2;
    nodes.push(<rect key={`r${a}`} x={x0 + i * (bw + gap)} y={top} width={bw} height={bh} fill={prime ? "rgba(31,78,69,0.10)" : "white"} stroke={PINE} strokeWidth={1.4} />);
    nodes.push(<Lines key={`t${a}`} x={ax(i)} y={top + bh / 2 - 9} lines={[a]} size={15} weight={600} anchor="middle" maxW={bw - 4} />);
    if (prime) nodes.push(<line key={`u${a}`} x1={ax(i) - 6} y1={top + bh / 2 + 9} x2={ax(i) + 6} y2={top + bh / 2 + 9} stroke={INK} strokeWidth={1.2} />);
  });
  const arc = (from, to, up, color, k, lift = 34) => {
    const y = up ? top : top + bh;
    const cy = up ? top - lift : top + bh + lift;
    return <CurvedArrow key={k} x1={from} y1={y} cx={(from + to) / 2} cy={cy} x2={to} y2={y} color={color} width={1.8} />;
  };
  // {A,B} → C: klammer över A och B, pil till C.
  const kx = (ax(0) + ax(1)) / 2;
  nodes.push(<path key="kAB" d={`M${ax(0) - 10},${top - 4} v-8 H${ax(1) + 10} v8`} fill="none" stroke={PINE} strokeWidth={1.4} />);
  nodes.push(arc(kx, ax(2), true, PINE, "abc", 46));
  // D → E och C → F över raden, kapslade så att de inte korsar varandra.
  nodes.push(arc(ax(1), ax(3), false, WRONG, "bd", 40));
  nodes.push(arc(ax(3), ax(4), true, BRASS, "de", 24));
  nodes.push(arc(ax(2) + 8, ax(5), true, BRASS, "cf", 60));
  const legendY = top + bh + 48;
  const legendItems = [
    { color: PINE, text: "{A,\u00a0B} → C: hela kandidatnyckeln" },
    { color: WRONG, text: "B → D: partiellt, B är en äkta delmängd av {A,\u00a0B}" },
    { color: BRASS, text: "D → E och C → F: E och F hänger transitivt på nyckeln" },
  ];
  let ly = legendY;
  legendItems.forEach((l, i) => {
    nodes.push(<line key={`ll${i}`} x1={0} y1={ly + 8} x2={22} y2={ly + 8} stroke={l.color} strokeWidth={2.4} />);
    const t = textBlock({ x: 30, y: ly, w: W - 30, text: l.text, size: FS });
    nodes.push(<g key={`lt${i}`}>{t.node}</g>);
    ly += t.h + 4;
  });
  const keyNote = textBlock({ x: 0, y: 0, w: W, text: "Kandidatnyckel {A, B} (understruken). Primärattribut A, B; icke-primärattribut C, D, E, F.", size: FS_SMALL, fill: MUTED });
  nodes.push(<g key="kn">{keyNote.node}</g>);
  const dy = ly + 14;
  const hd = heading({ x: 0, y: dy, w: W, text: "Ett beroende, en relation: 3NF" });
  nodes.push(<g key="hd">{hd.node}</g>);
  const decomp = [
    { name: "R1", attrs: [{ name: "A", pk: true }, { name: "B", pk: true }, { name: "C" }] },
    { name: "R2", attrs: [{ name: "B", pk: true }, { name: "D" }] },
    { name: "R3", attrs: [{ name: "D", pk: true }, { name: "E" }] },
    { name: "R4", attrs: [{ name: "C", pk: true }, { name: "F" }] },
  ];
  const cols = narrow ? 2 : 4;
  const cw = (W - (cols - 1) * 12) / cols;
  const ry = dy + hd.h + 8;
  decomp.forEach((r, i) => {
    const cx = (i % cols) * (cw + 12);
    const cy = ry + Math.floor(i / cols) * 46;
    nodes.push(<rect key={`d${i}`} x={cx} y={cy} width={cw} height={36} rx={6} fill="var(--correct-bg)" stroke="var(--correct)" strokeWidth={1.2} />);
    const rel = relation({ x: cx + 12, y: cy + 8, w: cw - 20, name: r.name, attrs: r.attrs, size: 15 });
    nodes.push(<g key={`dr${i}`}>{rel.node}</g>);
  });
  return { h: ry + Math.ceil(4 / cols) * 46 - 10, node: <g>{nodes}</g> };
}

// ── 9.1 Från ER-diagram till DDL ────────────────────────────────────────
function ddlFranDiagrammet(W, narrow) {
  const pairs = [
    ["Vanlig eller svag entitet", "Tabell med IDENTITY(1,1) och PRIMARY KEY på surrogatnyckeln"],
    ["Identifierare (understruken)", "NOT NULL och UNIQUE på den naturliga nyckeln"],
    ["Svag entitet med partiell identifierare", "UNIQUE över partiell nyckel och ägarens främmande nyckel; ägarens nyckel NOT NULL"],
    ["1:N och 1:1", "FOREIGN KEY på rätt sida, mot den refererade tabellens surrogatnyckel"],
    ["Dubbel linje (totalt deltagande)", "NOT NULL på främmande nyckeln; enkel linje lämnar den nullbar"],
    ["M:N", "Kopplingstabell utan IDENTITY; PRIMARY KEY av de två främmande nycklarna"],
    ["Flervärdesattribut", "Egen tabell; PRIMARY KEY av ägarens främmande nyckel och värdet"],
  ];
  const nodes = [];
  if (!narrow) {
    const lw = 230;
    const gap = 40;
    const rw = W - lw - gap;
    const hl = heading({ x: 0, y: 0, w: lw, text: "I diagrammet" });
    const hr = heading({ x: lw + gap, y: 0, w: rw, text: "I DDL-koden" });
    nodes.push(<g key="hl">{hl.node}</g>, <g key="hr">{hr.node}</g>);
    let y = hl.h + 8;
    pairs.forEach(([a, b], i) => {
      const l = card({ w: lw, text: a, tone: "plain", pad: 8, textSize: FS });
      const r = card({ w: rw, text: b, tone: "pine", pad: 8, textSize: FS });
      const H = Math.max(l.h, r.h);
      nodes.push(<g key={`l${i}`}>{l.render(0, y, H)}</g>, <g key={`r${i}`}>{r.render(lw + gap, y, H)}</g>);
      nodes.push(<Arrow key={`a${i}`} x1={lw + 4} y1={y + H / 2} x2={lw + gap - 4} y2={y + H / 2} size={7} />);
      y += H + 8;
    });
    return { h: y - 8, node: <g>{nodes}</g> };
  }
  let y = 0;
  pairs.forEach(([a, b], i) => {
    const l = textBlock({ x: 0, y, w: W, text: a, size: FS, weight: 600, fill: PINE });
    nodes.push(<g key={`l${i}`}>{l.node}</g>);
    const r = card({ w: W - 22, text: b, tone: "pine", pad: 8 });
    const ry = y + l.h + 4;
    nodes.push(<Arrow key={`a${i}`} x1={8} y1={ry} x2={8} y2={ry + r.h / 2 + 4} size={6} />);
    nodes.push(<g key={`r${i}`}>{r.render(22, ry)}</g>);
    y = ry + r.h + 14;
  });
  return { h: y - 14, node: <g>{nodes}</g> };
}

// ── 10.2 SQL:s logiska ordning ──────────────────────────────────────────
function sqlOrdning(W, narrow) {
  const steps = [
    { t: "FROM", note: null },
    { t: "WHERE", note: "rader" },
    { t: "GROUP BY", note: null },
    { t: "aggregaten", note: null },
    { t: "HAVING", note: "grupper" },
    { t: "SELECT", note: null },
    { t: "ORDER BY", note: null },
  ];
  const nodes = [];
  if (!narrow) {
    const gap = 14;
    const pad = 8;
    const natural = steps.map((s) => measure(s.t, FS, 600) + pad * 2);
    const extra = (W - natural.reduce((a, b) => a + b, 0) - gap * (steps.length - 1)) / steps.length;
    const widths = natural.map((n) => n + extra);
    let x = 0;
    const y = 30;
    const bh = 36;
    const pos = [];
    steps.forEach((s, i) => {
      const w = widths[i];
      const tone = s.note === "rader" || s.note === "grupper" ? "brass" : "pine";
      const t = TONE[tone];
      nodes.push(<rect key={`b${i}`} x={x} y={y} width={w} height={bh} rx={6} fill={t.fill} stroke={t.stroke} strokeWidth={1.4} />);
      nodes.push(<Lines key={`t${i}`} x={x + w / 2} y={y + bh / 2 - 9} lines={[s.t]} size={FS} weight={600} anchor="middle" fill={t.title === BRASS_TEXT ? BRASS_TEXT : PINE} maxW={w - 6} />);
      nodes.push(<Lines key={`n${i}`} x={x + w / 2} y={6} lines={[String(i + 1)]} size={FS_SMALL} anchor="middle" fill={MUTED} maxW={w} />);
      if (i > 0) nodes.push(<Arrow key={`a${i}`} x1={x - gap + 2} y1={y + bh / 2} x2={x - 2} y2={y + bh / 2} size={6} />);
      pos.push({ x, w });
      x += w + gap;
    });
    const callY = y + bh + 26;
    const cw = (W - 20) / 2;
    const where = card({ w: cw, tone: "brass", title: "WHERE filtrerar rader", text: "före grupperingen, och får inte innehålla aggregat. \"Betyg över 6\" gäller en rad." });
    const having = card({ w: cw, tone: "brass", title: "HAVING filtrerar grupper", text: "efter grupperingen; här står villkor på aggregat. \"Minst två böcker\" gäller en grupp." });
    const H = Math.max(where.h, having.h);
    nodes.push(<g key="cw">{where.render(0, callY, H)}</g>, <g key="ch">{having.render(cw + 20, callY, H)}</g>);
    nodes.push(<line key="lw" x1={pos[1].x + pos[1].w / 2} y1={y + bh} x2={pos[1].x + pos[1].w / 2} y2={callY} stroke={BRASS} strokeWidth={1.4} />);
    nodes.push(<line key="lh" x1={pos[4].x + pos[4].w / 2} y1={y + bh} x2={pos[4].x + pos[4].w / 2} y2={callY} stroke={BRASS} strokeWidth={1.4} />);
    const memo = textBlock({ x: 0, y: callY + H + 10, w: W, text: "Minnesregel: H kommer efter G i alfabetet — HAVING efter GROUP BY.", size: FS_SMALL, fill: MUTED });
    nodes.push(<g key="m">{memo.node}</g>);
    return { h: callY + H + 10 + memo.h, node: <g>{nodes}</g> };
  }
  let y = 0;
  const bw = 120;
  steps.forEach((s, i) => {
    const tone = s.note ? "brass" : "pine";
    const t = TONE[tone];
    nodes.push(<rect key={`b${i}`} x={0} y={y} width={bw} height={32} rx={6} fill={t.fill} stroke={t.stroke} strokeWidth={1.4} />);
    nodes.push(<Lines key={`t${i}`} x={bw / 2} y={y + 7} lines={[`${i + 1}. ${s.t}`]} size={FS} weight={600} anchor="middle" fill={tone === "brass" ? BRASS_TEXT : PINE} maxW={bw - 8} />);
    if (s.note) {
      const txt = s.note === "rader"
        ? "Filtrerar rader före grupperingen. Inga aggregat."
        : "Filtrerar grupper efter grupperingen. Villkor på aggregat.";
      nodes.push(<g key={`n${i}`}>{textBlock({ x: bw + 14, y: y - 2, w: W - bw - 14, text: txt, size: FS, fill: INK }).node}</g>);
    }
    if (i < steps.length - 1) nodes.push(<Arrow key={`a${i}`} x1={bw / 2} y1={y + 33} x2={bw / 2} y2={y + 47} size={6} />);
    y += 48;
  });
  const memo = textBlock({ x: 0, y: y - 4, w: W, text: "Minnesregel: H kommer efter G i alfabetet.", size: FS_SMALL, fill: MUTED });
  nodes.push(<g key="m">{memo.node}</g>);
  return { h: y - 4 + memo.h, node: <g>{nodes}</g> };
}

// ── 10.1 Join över kopplingstabellen ───────────────────────────────────
function columnsBox({ x, y, w, name, cols, keys, tone = "plain" }) {
  const rowH = 24;
  const t = TONE[tone];
  const nodes = [
    <rect key="h" x={x} y={y} width={w} height={rowH + 4} fill="rgba(31,78,69,0.12)" stroke={PINE} strokeWidth={1.3} />,
    <Lines key="hn" x={x + w / 2} y={y + 6} lines={[name]} size={FS} weight={600} anchor="middle" fill={PINE} maxW={w - 8} />,
  ];
  const ys = {};
  cols.forEach((c, i) => {
    const ry = y + rowH + 4 + i * rowH;
    ys[c] = ry + rowH / 2;
    nodes.push(<rect key={`r${i}`} x={x} y={ry} width={w} height={rowH} fill={t.fill === "none" ? "white" : t.fill} stroke="#cfc9ba" strokeWidth={1} />);
    nodes.push(<Lines key={`c${i}`} x={x + 10} y={ry + 5} lines={[c]} size={FS} maxW={w - 16} />);
    if (keys.includes(c)) nodes.push(<line key={`u${i}`} x1={x + 10} y1={ry + 20} x2={x + 10 + measure(c, FS)} y2={ry + 20} stroke={INK} strokeWidth={1.1} />);
  });
  return { h: rowH + 4 + cols.length * rowH, node: <g>{nodes}</g>, ys };
}
function joinKopplingstabell(W, narrow) {
  const nodes = [];
  if (!narrow) {
    const bw = 150;
    const gap = (W - bw * 3) / 2;
    const y = 26;
    const bok = columnsBox({ x: 0, y, w: bw, name: "Bok", cols: ["Isbn", "Titel", "Sidor"], keys: ["Isbn"] });
    const hl = columnsBox({ x: bw + gap, y, w: bw, name: "HarLanat", cols: ["LantagarNo", "Isbn", "Betyg"], keys: ["LantagarNo", "Isbn"], tone: "brass" });
    const lt = columnsBox({ x: 2 * (bw + gap), y, w: bw, name: "Lantagare", cols: ["LantagarNo", "Namn", "Alder", "Ort"], keys: ["LantagarNo"] });
    nodes.push(bok.node, hl.node, lt.node);
    nodes.push(<Arrow key="j1" x1={bw + gap - 2} y1={hl.ys.Isbn} x2={bw + 2} y2={bok.ys.Isbn} color={BRASS} width={1.8} both />);
    nodes.push(<Arrow key="j2" x1={2 * bw + gap + 2} y1={hl.ys.LantagarNo} x2={2 * (bw + gap) - 2} y2={lt.ys.LantagarNo} color={BRASS} width={1.8} both />);
    nodes.push(<Lines key="l1" x={bw + gap / 2} y={0} lines={wrap("hl.Isbn = b.Isbn", gap, FS_SMALL)} size={FS_SMALL} anchor="middle" fill={BRASS_TEXT} maxW={gap} />);
    nodes.push(<Lines key="l2" x={2 * bw + gap * 1.5} y={0} lines={wrap("l.LantagarNo = hl.LantagarNo", gap, FS_SMALL)} size={FS_SMALL} anchor="middle" fill={BRASS_TEXT} maxW={gap} />);
    const hy = y + Math.max(bok.h, hl.h, lt.h) + 18;
    const res = card({ w: W, tone: "pine", title: "Resultatet: en rad per HarLanat-rad", text: "Bokens och låntagarens kolumner läggs till. Joinen skapar inte fler rader än kopplingstabellen har, och böcker som ingen lånat kommer inte med." });
    nodes.push(<g key="res">{res.render(0, hy)}</g>);
    return { h: hy + res.h, node: <g>{nodes}</g> };
  }
  const bw = 196;
  const x = 84;
  const bok = columnsBox({ x, y: 0, w: bw, name: "Bok", cols: ["Isbn", "Titel", "Sidor"], keys: ["Isbn"] });
  const y2 = bok.h + 48;
  const hl = columnsBox({ x, y: y2, w: bw, name: "HarLanat", cols: ["LantagarNo", "Isbn", "Betyg"], keys: ["LantagarNo", "Isbn"], tone: "brass" });
  const y3 = y2 + hl.h + 48;
  const lt = columnsBox({ x, y: y3, w: bw, name: "Lantagare", cols: ["LantagarNo", "Namn", "Alder", "Ort"], keys: ["LantagarNo"] });
  nodes.push(bok.node, hl.node, lt.node);
  nodes.push(<CurvedArrow key="j1" x1={x + bw} y1={hl.ys.Isbn} cx={x + bw + 40} cy={(hl.ys.Isbn + bok.ys.Isbn) / 2} x2={x + bw + 2} y2={bok.ys.Isbn} color={BRASS} width={1.8} />);
  nodes.push(<CurvedArrow key="j2" x1={x} y1={hl.ys.LantagarNo} cx={x - 40} cy={(hl.ys.LantagarNo + lt.ys.LantagarNo) / 2} x2={x - 2} y2={lt.ys.LantagarNo} color={BRASS} width={1.8} />);
  nodes.push(<Lines key="l1" x={x + bw + 4} y={bok.h + 10} lines={["Isbn"]} size={FS_SMALL} fill={BRASS_TEXT} maxW={W - x - bw - 4} />);
  nodes.push(<Lines key="l2" x={x - 4} y={y2 + hl.h + 10} lines={["LantagarNo"]} size={FS_SMALL} anchor="end" fill={BRASS_TEXT} maxW={x - 4} />);
  const ry = y3 + lt.h + 16;
  const res = card({ w: W, tone: "pine", title: "En rad per HarLanat-rad", text: "Bokens och låntagarens kolumner läggs till. Böcker som ingen lånat kommer inte med." });
  nodes.push(<g key="res">{res.render(0, ry)}</g>);
  return { h: ry + res.h, node: <g>{nodes}</g> };
}

// ── 11.1 JDBC-kedjan ────────────────────────────────────────────────────
function jdbcKedjan(W, narrow) {
  const nodes = [];
  const top = narrow
    ? column([
      { kicker: "Klient", title: "Java-applikationen", text: "Körs på användarens dator.", tone: "plain" },
      { kicker: "API och översättning", title: "JDBC driver", text: "Ger kommandona i JDBC och gör om dem till något SQL Server förstår.", tone: "brass" },
      { kicker: "Server", title: "SQL Server", text: "Databasen, i kursen på en maskin i molnet.", tone: "plain" },
    ], { y: 0, w: W, gap: 18, arrows: true })
    : row([
      { kicker: "Klient", title: "Java-applikationen", text: "Körs på användarens dator.", tone: "plain" },
      { kicker: "API och översättning", title: "JDBC driver", text: "Ger kommandona i JDBC och gör om dem till något SQL Server förstår.", tone: "brass" },
      { kicker: "Server", title: "SQL Server", text: "Databasen, i kursen på en maskin i molnet.", tone: "plain" },
    ], { y: 0, w: W, gap: 30, arrows: true });
  nodes.push(<g key="top">{top.node}</g>);
  const y0 = top.h + 22;
  const hd = heading({ x: 0, y: y0, w: W, text: "Kedjan i koden (java.sql)" });
  nodes.push(<g key="hd">{hd.node}</g>);
  const chain = [
    { cls: "DriverManager", call: "getConnection(connectionUrl)", note: "Öppnar anslutningen och loggar in." },
    { cls: "Connection", call: "prepareStatement(query)", note: "Förkompilerar frågan; värden sätts med ? och set-metoder." },
    { cls: "PreparedStatement", call: "executeQuery() eller executeUpdate()", note: "SELECT ger ett ResultSet; INSERT, UPDATE och DELETE ger antalet rader." },
    { cls: "ResultSet", call: null, note: "Markören står före första raden; next() flyttar den ett steg." },
  ];
  const bw = narrow ? 170 : 200;
  const exW = narrow ? 0 : 92;
  const noteX = bw + 18;
  const noteW = W - noteX - exW;
  let y = y0 + hd.h + 10;
  const startY = y;
  chain.forEach((c, i) => {
    nodes.push(<rect key={`b${i}`} x={0} y={y} width={bw} height={34} rx={6} fill="rgba(31,78,69,0.07)" stroke={PINE} strokeWidth={1.4} />);
    nodes.push(<Lines key={`t${i}`} x={bw / 2} y={y + 8} lines={[c.cls]} size={FS} weight={600} anchor="middle" fill={PINE} maxW={bw - 8} />);
    const note = narrow
      ? textBlock({ x: 0, y: y + 40, w: W, text: c.note, size: FS, fill: MUTED })
      : textBlock({ x: noteX, y: y + 2, w: noteW, text: c.note, size: FS, fill: MUTED });
    nodes.push(<g key={`n${i}`}>{note.node}</g>);
    const blockH = narrow ? 40 + note.h : Math.max(34, note.h);
    y += blockH;
    if (c.call) {
      const callLines = wrap(c.call, narrow ? W - 20 : noteW + exW - 10, FS_SMALL, 600);
      const ah = 14 + callLines.length * lineHeight(FS_SMALL) + 6;
      nodes.push(<Arrow key={`a${i}`} x1={narrow ? 10 : bw / 2} y1={y + 3} x2={narrow ? 10 : bw / 2} y2={y + ah - 3} size={7} />);
      nodes.push(<Lines key={`c${i}`} x={narrow ? 22 : bw / 2 + 12} y={y + 9} lines={callLines} size={FS_SMALL} weight={600} fill={BRASS_TEXT} maxW={narrow ? W - 22 : noteW + exW - 10} />);
      y += ah;
    }
  });
  const exc = narrow
    ? card({ w: W, tone: "wrong", title: "SQLException", text: "Kan kastas i varje steg; felkoden läses med getErrorCode()." })
    : null;
  if (exc) {
    nodes.push(<g key="ex">{exc.render(0, y + 12)}</g>);
    y += 12 + exc.h;
  } else {
    const ex = W - exW + 10;
    nodes.push(<rect key="exr" x={ex} y={startY} width={exW - 10} height={y - startY} rx={8} fill="var(--wrong-bg)" stroke={WRONG} strokeWidth={1.4} />);
    nodes.push(
      <text key="ext" data-rotated fontSize={FS} fontWeight={600} fill={WRONG} transform={`translate(${ex + (exW - 10) / 2 + 5} ${startY + (y - startY) / 2}) rotate(-90)`} textAnchor="middle">
        <tspan data-maxw={Math.round(y - startY - 10)}>SQLException i varje steg</tspan>
      </text>,
    );
  }
  return { h: y, node: <g>{nodes}</g> };
}

// ── 11.2 Fyra lager ─────────────────────────────────────────────────────
function fyraLager(W, narrow) {
  const layers = [
    { kicker: "View", title: "FXML-filer som Employee.fxml", text: "Placering och utseende för knappar, textfält och tabeller." },
    { kicker: "Controller", title: "EmployeesViewController", text: "Hanterar händelser, som ett klick på Add, och gör fel till meddelanden användaren förstår." },
    { kicker: "Data access", title: "EmployeeDao och ConnectionHandler", text: "All kontakt med databasen: SQL, JDBC och SQLException hör hemma här." },
  ];
  const nodes = [];
  const sideW = narrow ? 0 : 150;
  const lw = W - sideW - (narrow ? 0 : 18);
  const col = column(layers.map((l, i) => ({ ...l, tone: i === 2 ? "brass" : "pine" })), { y: 0, w: lw, gap: 22, arrows: true });
  nodes.push(<g key="c">{col.node}</g>);
  const dbY = col.h + 22;
  nodes.push(<Arrow key="adb" x1={lw / 2} y1={col.h + 2} x2={lw / 2} y2={dbY - 2} size={7} />);
  const db = card({ w: lw, title: "Databasen (SQL Server)", text: "Nås bara via data access-lagret.", tone: "plain", align: "middle" });
  nodes.push(<g key="db">{db.render(0, dbY)}</g>);
  if (!narrow) {
    const mx = lw + 18;
    const mh = col.h;
    nodes.push(<rect key="m" x={mx} y={0} width={sideW} height={mh} rx={8} fill="rgba(185,147,47,0.12)" stroke={BRASS} strokeWidth={1.4} strokeDasharray="5 4" />);
    const t1 = textBlock({ x: mx + 10, y: 12, w: sideW - 20, text: "MODEL", size: FS_SMALL, weight: 600, fill: BRASS_TEXT });
    const t2 = textBlock({ x: mx + 10, y: 12 + t1.h + 4, w: sideW - 20, text: "Employee och Department", size: FS_TITLE, weight: 600, fill: INK });
    const t3 = textBlock({ x: mx + 10, y: 12 + t1.h + 4 + t2.h + 6, w: sideW - 20, text: "Håller data om domänobjekten och används av alla lager.", size: FS, fill: INK });
    nodes.push(<g key="t1">{t1.node}</g>, <g key="t2">{t2.node}</g>, <g key="t3">{t3.node}</g>);
    return { h: dbY + db.h, node: <g>{nodes}</g> };
  }
  const my = dbY + db.h + 14;
  const model = card({ w: W, kicker: "Model, vid sidan av alla lager", title: "Employee och Department", text: "Håller data om domänobjekten och används av alla lager.", tone: "brass" });
  nodes.push(<g key="m">{model.render(0, my)}</g>);
  return { h: my + model.h, node: <g>{nodes}</g> };
}

// ── 11.3 Tre nivåer av separation ───────────────────────────────────────
function separationsnivaer(W, narrow) {
  const levels = [
    {
      tone: "wrong", title: "Nivå 1: dålig",
      controller: "SQL, ResultSet och SQLException blandas med gränssnittet.",
      dao: null,
      foot: "Bygg inte så: ger underkänt på projektet.",
    },
    {
      tone: "brass", title: "Nivå 2: delvis",
      controller: "Får en List<Employee>, men måste fånga SQLException.",
      dao: "SQL och JDBC; metoderna deklarerar throws SQLException.",
      foot: null,
    },
    {
      tone: "correct", title: "Nivå 3: total",
      controller: "Fångar bara DaoException och visar e.getMessage(). Ingen SQL.",
      dao: "Fångar SQLException, tolkar felkoden och kastar DaoException.",
      foot: null,
    },
  ];
  const gap = 14;
  const cw = narrow ? W : (W - gap * 2) / 3;
  const build = (lv, x, y) => {
    const head = card({ w: cw, title: lv.title, tone: lv.tone, align: "middle", pad: 8 });
    const ctrl = card({ w: cw - 16, kicker: "Controller", text: lv.controller, tone: "plain", pad: 8 });
    const dao = lv.dao
      ? card({ w: cw - 16, kicker: "DAO", text: lv.dao, tone: "plain", pad: 8 })
      : card({ w: cw - 16, kicker: "DAO", text: "Saknas: inget data access-lager.", tone: "ghost", pad: 8 });
    const foot = lv.foot ? textBlock({ x: 0, y: 0, w: cw - 16, text: lv.foot, size: FS_SMALL, fill: WRONG, italic: true }) : null;
    return { head, ctrl, dao, foot, x, y };
  };
  const parts = levels.map((lv, i) => build(lv, narrow ? 0 : i * (cw + gap), 0));
  const headH = Math.max(...parts.map((p) => p.head.h));
  const ctrlH = Math.max(...parts.map((p) => p.ctrl.h));
  const daoH = Math.max(...parts.map((p) => p.dao.h));
  const footH = Math.max(0, ...parts.map((p) => (p.foot ? p.foot.h + 6 : 0)));
  const colH = headH + 8 + ctrlH + 18 + daoH + 8 + footH;
  const draw = (p, ox, oy, i) => (
    <g key={i}>
      <rect x={ox} y={oy} width={cw} height={narrow ? headH + 8 + p.ctrl.h + 18 + p.dao.h + 8 + (p.foot ? p.foot.h + 6 : 0) : colH} rx={8} fill="white" stroke="#cfc9ba" strokeWidth={1.2} />
      {p.head.render(ox, oy, headH)}
      {p.ctrl.render(ox + 8, oy + headH + 8, narrow ? p.ctrl.h : ctrlH)}
      {levels[i].dao && <Arrow x1={ox + cw / 2} y1={oy + headH + 8 + (narrow ? p.ctrl.h : ctrlH) + 2} x2={ox + cw / 2} y2={oy + headH + 8 + (narrow ? p.ctrl.h : ctrlH) + 16} size={6} />}
      {p.dao.render(ox + 8, oy + headH + 8 + (narrow ? p.ctrl.h : ctrlH) + 18, narrow ? p.dao.h : daoH)}
      {p.foot && (
        <Lines x={ox + 8} y={oy + headH + 8 + (narrow ? p.ctrl.h : ctrlH) + 18 + (narrow ? p.dao.h : daoH) + 6} lines={wrap(levels[i].foot, cw - 16, FS_SMALL)} size={FS_SMALL} fill={WRONG} italic maxW={cw - 16} />
      )}
    </g>
  );
  if (!narrow) return { h: colH, node: <g>{parts.map((p, i) => draw(p, p.x, 0, i))}</g> };
  let y = 0;
  const nodes = parts.map((p, i) => {
    const h = headH + 8 + p.ctrl.h + 18 + p.dao.h + 8 + (p.foot ? p.foot.h + 6 : 0);
    const n = draw(p, 0, y, i);
    y += h + 14;
    return n;
  });
  return { h: y - 14, node: <g>{nodes}</g> };
}

// ── Registrering ────────────────────────────────────────────────────────
const fig = (id, build) => {
  const Component = () => <ConceptFigure id={id} build={build} />;
  Component.displayName = `Figur(${id})`;
  return Component;
};

export const DATABASER_FIGURES = {
  "db-designkedjan": fig("db-designkedjan", designkedjan),
  "db-relationens-anatomi": fig("db-relationens-anatomi", relationensAnatomi),
  "db-frammande-nyckel": fig("db-frammande-nyckel", frammandeNyckel),
  "db-binara-regler": fig("db-binara-regler", binaraRegler),
  "db-svag-nyckelkedja": fig("db-svag-nyckelkedja", svagNyckelkedja),
  "db-anomalier": fig("db-anomalier", anomalier),
  "db-normalformstrappan": fig("db-normalformstrappan", normalformstrappan),
  "db-beroendediagram": fig("db-beroendediagram", beroendediagram),
  "db-ddl-fran-diagrammet": fig("db-ddl-fran-diagrammet", ddlFranDiagrammet),
  "db-sql-ordning": fig("db-sql-ordning", sqlOrdning),
  "db-join-kopplingstabell": fig("db-join-kopplingstabell", joinKopplingstabell),
  "db-jdbc-kedjan": fig("db-jdbc-kedjan", jdbcKedjan),
  "db-fyra-lager": fig("db-fyra-lager", fyraLager),
  "db-separationsnivaer": fig("db-separationsnivaer", separationsnivaer),
};
