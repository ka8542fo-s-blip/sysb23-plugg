// BPMN-primitiver och diagramritare för Kör processen och kompendiet.
// Ritar direkt ur diagramdatan i src/data/process/bpmnDiagrams.js — samma
// data som simulatorn kör. Formerna följer BPMN exakt eftersom det är de
// tentan prövar: tunn/dubbel/tjock cirkel för start/intermediate/end,
// streckad cirkel för non-interrupting, fylld ikon för throw, streckad ram
// för event subprocess, tjock ram för call activity, plustecken för
// kollapsad subprocess. Färgerna är Läsesalens tokens.
import { Fragment } from "react";

const INK = "var(--ink)";
const PINE = "var(--pine)";
const BRASS = "var(--brass)";
const WRONG = "var(--wrong)";
const SOFT = "rgba(34,40,42,0.55)";
const FONT = 12;

export const TASK_W = 100;
export const TASK_H = 64;
const R = 18;
const GW = 25; // halva diagonalen

export function sizeOf(node) {
  switch (node.type) {
    case "task":
    case "subprocess":
    case "eventSubprocess":
    case "callActivity":
      return { hw: TASK_W / 2, hh: TASK_H / 2 };
    case "gateway":
      return { hw: GW, hh: GW };
    default:
      return { hw: R, hh: R };
  }
}

// ── Ikoner ──────────────────────────────────────────────────────────────
function Envelope({ x, y, w = 14, h = 10, filled = false }) {
  return (
    <g>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} fill={filled ? INK : "white"} stroke={INK} strokeWidth={1.1} />
      <polyline points={`${x - w / 2},${y - h / 2} ${x},${y + 1} ${x + w / 2},${y - h / 2}`} fill="none" stroke={filled ? "white" : INK} strokeWidth={1.1} />
    </g>
  );
}

function Clock({ x, y, r = 8 }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="white" stroke={INK} strokeWidth={1.1} />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a) => {
        const rad = (a * Math.PI) / 180;
        return <line key={a} x1={x + Math.cos(rad) * (r - 2)} y1={y + Math.sin(rad) * (r - 2)} x2={x + Math.cos(rad) * r} y2={y + Math.sin(rad) * r} stroke={INK} strokeWidth={0.8} />;
      })}
      <polyline points={`${x},${y - r + 3} ${x},${y} ${x + 4},${y + 1}`} fill="none" stroke={INK} strokeWidth={1.1} />
    </g>
  );
}

function Bolt({ x, y, filled = false }) {
  return (
    <polygon
      points={`${x - 6},${y + 7} ${x - 2},${y - 5} ${x + 1},${y + 1} ${x + 6},${y - 7} ${x + 2},${y + 5} ${x - 1},${y - 1}`}
      fill={filled ? INK : "white"} stroke={INK} strokeWidth={1.1} strokeLinejoin="round"
    />
  );
}

function Person({ x, y }) {
  return (
    <g fill="white" stroke={INK} strokeWidth={1}>
      <path d={`M${x - 6},${y + 7} Q${x - 6},${y} ${x},${y} Q${x + 6},${y} ${x + 6},${y + 7} Z`} />
      <circle cx={x} cy={y - 3} r={3.5} />
    </g>
  );
}

function Gear({ x, y }) {
  const teeth = [];
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    teeth.push(<line key={i} x1={x + Math.cos(a) * 4} y1={y + Math.sin(a) * 4} x2={x + Math.cos(a) * 7.5} y2={y + Math.sin(a) * 7.5} stroke={INK} strokeWidth={2.4} />);
  }
  return (
    <g>
      {teeth}
      <circle cx={x} cy={y} r={5} fill="white" stroke={INK} strokeWidth={1.1} />
      <circle cx={x} cy={y} r={2} fill="white" stroke={INK} strokeWidth={1} />
    </g>
  );
}

function Hand({ x, y }) {
  return (
    <path
      d={`M${x - 7},${y + 2} L${x + 5},${y + 2} M${x - 7},${y - 3} L${x + 7},${y - 3} M${x - 7},${y - 3} L${x - 7},${y + 6} L${x + 3},${y + 6} M${x - 7},${y - 3} L${x - 2},${y - 7}`}
      fill="none" stroke={INK} strokeWidth={1.2} strokeLinecap="round"
    />
  );
}

function Table({ x, y }) {
  return (
    <g fill="none" stroke={INK} strokeWidth={1}>
      <rect x={x - 7} y={y - 5} width={14} height={10} fill="white" />
      <line x1={x - 7} y1={y - 1.5} x2={x + 7} y2={y - 1.5} strokeWidth={2} />
      <line x1={x - 2} y1={y - 5} x2={x - 2} y2={y + 5} />
    </g>
  );
}

function Script({ x, y }) {
  return (
    <g fill="white" stroke={INK} strokeWidth={1}>
      <path d={`M${x - 5},${y - 7} L${x + 6},${y - 7} Q${x + 2},${y} ${x + 5},${y + 7} L${x - 6},${y + 7} Q${x - 2},${y} ${x - 5},${y - 7} Z`} />
      <line x1={x - 3} y1={y - 3} x2={x + 2} y2={y - 3} />
      <line x1={x - 2} y1={y + 1} x2={x + 3} y2={y + 1} />
    </g>
  );
}

const TASK_ICON = {
  user: Person,
  service: Gear,
  send: (p) => <Envelope {...p} filled />,
  receive: (p) => <Envelope {...p} />,
  manual: Hand,
  script: Script,
  businessRule: Table,
};

// ── Text ────────────────────────────────────────────────────────────────
function wrap(text, max = 14) {
  const words = String(text).split(" ");
  const lines = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > max && cur) {
      lines.push(cur);
      cur = w;
    } else cur = (cur + " " + w).trim();
  }
  if (cur) lines.push(cur);
  return lines;
}

function Label({ x, y, text, max = 16, anchor = "middle", size = FONT - 1, weight = 400 }) {
  if (!text) return null;
  const lines = wrap(text, max);
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight} fill={INK}>
      {lines.map((l, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : size + 2}>{l}</tspan>
      ))}
    </text>
  );
}

// ── Former ──────────────────────────────────────────────────────────────
export function EventShape({ cx, cy, kind, event = "none", throwing = false, interrupting = true, highlight }) {
  const stroke = highlight?.stroke || INK;
  const dash = interrupting === false ? "4 3" : undefined;
  const fill = highlight?.fill || "white";
  const icon = () => {
    if (event === "message") return <Envelope x={cx} y={cy} filled={throwing || kind === "end"} />;
    if (event === "timer") return <Clock x={cx} y={cy} />;
    if (event === "error") return <Bolt x={cx} y={cy} filled={kind === "end"} />;
    if (event === "terminate") return <circle cx={cx} cy={cy} r={10} fill={INK} />;
    return null;
  };
  return (
    <g>
      <circle cx={cx} cy={cy} r={R} fill={fill} stroke={stroke} strokeWidth={kind === "end" ? 3.5 : 1.5} strokeDasharray={dash} />
      {(kind === "intermediate" || kind === "boundary") && (
        <circle cx={cx} cy={cy} r={R - 3.5} fill="none" stroke={stroke} strokeWidth={1.2} strokeDasharray={dash} />
      )}
      {icon()}
    </g>
  );
}

export function ActivityShape({ cx, cy, label, taskType, variant = "task", startEvent, marker, highlight, showLabel = true }) {
  const x = cx - TASK_W / 2;
  const y = cy - TASK_H / 2;
  const Icon = TASK_ICON[taskType];
  const stroke = highlight?.stroke || INK;
  const dashed = variant === "eventSubprocess";
  const thick = variant === "callActivity";
  const collapsed = variant === "subprocess" || variant === "eventSubprocess" || variant === "callActivity";
  const markers = [].concat(marker || []);
  const has = (m) => markers.includes(m);
  return (
    <g>
      <rect
        x={x} y={y} width={TASK_W} height={TASK_H} rx={9}
        fill={highlight?.fill || "white"} stroke={stroke}
        strokeWidth={thick ? 3.5 : 1.5} strokeDasharray={dashed ? "2 3" : undefined}
      />
      {Icon && <Icon x={x + 11} y={y + 11} />}
      {startEvent && (
        <g transform={`translate(${x + 13},${y + 13}) scale(0.58) translate(${-x - 13},${-y - 13})`}>
          <EventShape cx={x + 13} cy={y + 13} kind="start" event={startEvent.event} interrupting={startEvent.interrupting} />
        </g>
      )}
      {has("chevron") && (
        <polyline points={`${x + 6},${y + 6} ${x + 15},${y + 6} ${x + 19},${y + 11} ${x + 15},${y + 16} ${x + 6},${y + 16} ${x + 10},${y + 11} ${x + 6},${y + 6}`} fill="none" stroke={INK} strokeWidth={1.2} />
      )}
      {showLabel && (startEvent
        ? <Label x={cx} y={cy - 1} text={label} size={FONT - 2} max={18} />
        : (() => {
            const n = label ? wrap(label).length : 1;
            return <Label x={cx + (n > 1 ? 4 : 0)} y={cy + 4 - (n - 1) * 6.5 + (n > 1 ? 4 : 0)} text={label} size={n > 2 ? FONT - 2 : FONT - 1} />;
          })())}
      {collapsed && (
        <g>
          <rect x={cx - 6} y={y + TASK_H - 15} width={12} height={12} fill="white" stroke={INK} strokeWidth={1.1} />
          <line x1={cx - 3.5} y1={y + TASK_H - 9} x2={cx + 3.5} y2={y + TASK_H - 9} stroke={INK} strokeWidth={1.2} />
          <line x1={cx} y1={y + TASK_H - 12.5} x2={cx} y2={y + TASK_H - 5.5} stroke={INK} strokeWidth={1.2} />
        </g>
      )}
      {has("parallelMI") && (
        <g stroke={INK} strokeWidth={1.6}>
          {[-18, -14, -10].map((dx) => <line key={dx} x1={cx + dx} y1={y + TASK_H - 14} x2={cx + dx} y2={y + TASK_H - 4} />)}
        </g>
      )}
      {has("loop") && (
        <path d={`M${cx + 14},${y + TASK_H - 6} a5,5 0 1,0 -3,-8`} fill="none" stroke={INK} strokeWidth={1.2} />
      )}
    </g>
  );
}

export function GatewayShape({ cx, cy, gw, highlight }) {
  const stroke = highlight?.stroke || INK;
  const pts = `${cx},${cy - GW} ${cx + GW},${cy} ${cx},${cy + GW} ${cx - GW},${cy}`;
  return (
    <g>
      <polygon points={pts} fill={highlight?.fill || "white"} stroke={stroke} strokeWidth={1.5} />
      {gw === "and" && (
        <g stroke={INK} strokeWidth={3}>
          <line x1={cx - 9} y1={cy} x2={cx + 9} y2={cy} />
          <line x1={cx} y1={cy - 9} x2={cx} y2={cy + 9} />
        </g>
      )}
      {gw === "or" && <circle cx={cx} cy={cy} r={9} fill="none" stroke={INK} strokeWidth={2.5} />}
      {gw === "event" && (
        <g fill="none" stroke={INK} strokeWidth={1.1}>
          <circle cx={cx} cy={cy} r={11} />
          <circle cx={cx} cy={cy} r={8.5} />
          <polygon points={[0, 1, 2, 3, 4].map((i) => {
            const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
            return `${cx + Math.cos(a) * 5.5},${cy + Math.sin(a) * 5.5}`;
          }).join(" ")} />
        </g>
      )}
    </g>
  );
}

// ── Flöden ──────────────────────────────────────────────────────────────
function edgePoint(node, towards) {
  const { hw, hh } = sizeOf(node);
  const dx = towards.x - node.cx;
  const dy = towards.y - node.cy;
  if (dx === 0 && dy === 0) return { x: node.cx, y: node.cy };
  if (node.type === "task" || node.type === "subprocess" || node.type === "eventSubprocess") {
    // Rektangel: klipp mot närmaste kant längs linjen.
    const sx = dx === 0 ? Infinity : hw / Math.abs(dx);
    const sy = dy === 0 ? Infinity : hh / Math.abs(dy);
    const s = Math.min(sx, sy);
    return { x: node.cx + dx * s, y: node.cy + dy * s };
  }
  if (node.type === "gateway") {
    const s = GW / (Math.abs(dx) + Math.abs(dy));
    return { x: node.cx + dx * s, y: node.cy + dy * s };
  }
  const len = Math.hypot(dx, dy);
  return { x: node.cx + (dx / len) * R, y: node.cy + (dy / len) * R };
}

function flowPoints(from, to, route) {
  const a = { x: from.cx, y: from.cy };
  const b = { x: to.cx, y: to.cy };
  let corner = null;
  if (a.x !== b.x && a.y !== b.y) corner = route === "vh" ? { x: a.x, y: b.y } : { x: b.x, y: a.y };
  const first = corner || b;
  const last = corner || a;
  return [edgePoint(from, first), ...(corner ? [corner] : []), edgePoint(to, last)];
}

function SeqFlow({ from, to, flow, markerId }) {
  const pts = flowPoints(from, to, flow.route);
  const text = flow.cond || flow.label;
  const p0 = pts[0];
  const p1 = pts[1];
  const horizontalFirst = Math.abs(p1.y - p0.y) < 1;
  // Villkor på en väg som först går lodrätt: skriv det ovanför den vågräta
  // biten efter hörnet, där det inte krockar med gatewayens grannar.
  const atCorner = flow.cond && !horizontalFirst && pts.length === 3;
  return (
    <g>
      <polyline points={pts.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke={INK} strokeWidth={1.3} markerEnd={`url(#${markerId}-seq)`} />
      {flow.default && (() => {
        // Default flow: ett kort snedstreck strax efter flödets början.
        const len = Math.hypot(p1.x - p0.x, p1.y - p0.y) || 1;
        const ux = (p1.x - p0.x) / len;
        const uy = (p1.y - p0.y) / len;
        const qx = p0.x + ux * 11;
        const qy = p0.y + uy * 11;
        return (
          <line
            x1={qx - uy * 6 - ux * 4} y1={qy + ux * 6 - uy * 4}
            x2={qx + uy * 6 + ux * 4} y2={qy - ux * 6 + uy * 4}
            stroke={INK} strokeWidth={1.3}
          />
        );
      })()}
      {text && atCorner && (
        <text x={p1.x + 8} y={p1.y - 6} fontSize={FONT - 1} fill={INK}>{text}</text>
      )}
      {text && !atCorner && (
        <text
          x={horizontalFirst ? p0.x + 8 : p0.x - 6}
          y={horizontalFirst ? p0.y - 6 : (p0.y + p1.y) / 2}
          textAnchor={horizontalFirst ? "start" : "end"}
          fontSize={FONT - 1} fill={INK}
        >{text}</text>
      )}
    </g>
  );
}

function MsgFlow({ fromNode, toNode, fromPool, toPool, label, markerId }) {
  // Pool ↔ nod: lodrät linje vid nodens x.
  const node = fromNode || toNode;
  const pool = fromPool || toPool;
  const { hh } = sizeOf(node);
  const poolY = pool.y + pool.h;
  const nodeY = node.cy - hh;
  const x = node.cx;
  const [y1, y2] = fromPool ? [poolY, nodeY] : [nodeY, poolY];
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={y2} stroke={INK} strokeWidth={1.1} strokeDasharray="6 4" markerEnd={`url(#${markerId}-msg)`} />
      <circle cx={x} cy={y1} r={3} fill="white" stroke={INK} strokeWidth={1.1} />
      <text x={x + 7} y={Math.min(y1, y2) + 18} fontSize={FONT - 2} fill={INK}>{label}</text>
    </g>
  );
}

function Pool({ pool }) {
  return (
    <g>
      <rect x={pool.x} y={pool.y} width={pool.w} height={pool.h} fill="rgba(34,40,42,0.04)" stroke={INK} strokeWidth={1.3} />
      <line x1={pool.x + 22} y1={pool.y} x2={pool.x + 22} y2={pool.y + pool.h} stroke={INK} strokeWidth={1.1} />
      <text transform={`translate(${pool.x + 15},${pool.y + pool.h / 2}) rotate(-90)`} textAnchor="middle" fontSize={FONT - 1} fill={INK}>{pool.label}</text>
    </g>
  );
}

// ── En vy (huvuddiagram eller barndiagram) ──────────────────────────────
function View({ diagram, view, highlight, markerId }) {
  const inView = (n) => (n.in || null) === view.container;
  const nodes = diagram.nodes.filter(inView);
  const byId = Object.fromEntries(diagram.nodes.map((n) => [n.id, n]));
  const pools = (diagram.pools || []).filter((p) => (p.view ?? null) === view.container);
  const poolById = Object.fromEntries(pools.map((p) => [p.id, p]));
  const hl = (id) => highlight?.[id];

  return (
    <svg viewBox={`0 0 ${view.width} ${view.height}`} className="block h-auto w-full" style={{ maxWidth: view.width }} role="img" aria-label={view.title || diagram.title} fontFamily="Inter, system-ui, sans-serif">
      <defs>
        <marker id={`${markerId}-seq`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill={INK} />
        </marker>
        <marker id={`${markerId}-msg`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="white" stroke={INK} strokeWidth={1.2} />
        </marker>
      </defs>
      {pools.map((p) => <Pool key={p.id} pool={p} />)}
      {diagram.flows.filter((f) => f.kind === "seq" && byId[f.from] && inView(byId[f.from])).map((f, i) => (
        <SeqFlow key={`s${i}`} from={byId[f.from]} to={byId[f.to]} flow={f} markerId={markerId} />
      ))}
      {diagram.flows.filter((f) => f.kind === "msg").map((f, i) => {
        const fromPool = poolById[f.from];
        const toPool = poolById[f.to];
        const fromNode = byId[f.from] && inView(byId[f.from]) ? byId[f.from] : null;
        const toNode = byId[f.to] && inView(byId[f.to]) ? byId[f.to] : null;
        if (!((fromPool && toNode) || (fromNode && toPool))) return null;
        return <MsgFlow key={`m${i}`} fromNode={fromNode} toNode={toNode} fromPool={fromPool} toPool={toPool} label={f.label} markerId={markerId} />;
      })}
      {nodes.map((n) => (
        <Fragment key={n.id}>
          <NodeShape node={n} diagram={diagram} highlight={hl(n.id)} />
        </Fragment>
      ))}
    </svg>
  );
}

function NodeShape({ node: n, diagram, highlight }) {
  if (n.type === "task") {
    return <ActivityShape cx={n.cx} cy={n.cy} label={n.label} taskType={n.taskType} marker={n.marker} highlight={highlight} />;
  }
  if (n.type === "subprocess") {
    return <ActivityShape cx={n.cx} cy={n.cy} label={n.label} variant="subprocess" marker={n.marker} highlight={highlight} />;
  }
  if (n.type === "eventSubprocess") {
    const start = diagram.nodes.find((c) => c.in === n.id && c.type === "start");
    return <ActivityShape cx={n.cx} cy={n.cy} label={n.label} variant="eventSubprocess" startEvent={start} highlight={highlight} />;
  }
  if (n.type === "gateway") {
    return (
      <g>
        <GatewayShape cx={n.cx} cy={n.cy} gw={n.gw} highlight={highlight} />
        {n.label && <Label x={n.cx} y={n.labelAbove ? n.cy - GW - 8 : n.cy + GW + 14} text={n.label} max={22} />}
      </g>
    );
  }
  const kind = n.type === "boundary" ? "boundary" : n.type;
  const interrupting = n.type === "start" && n.in ? n.interrupting : n.type === "boundary" ? n.interrupting : true;
  return (
    <g>
      <EventShape cx={n.cx} cy={n.cy} kind={kind} event={n.event} throwing={n.throw} interrupting={interrupting} highlight={highlight} />
      {n.label && n.type !== "boundary" && <Label x={n.cx} y={n.cy + R + 14} text={n.label} max={18} />}
    </g>
  );
}

let diagramSeq = 0;

// highlight: { nodId: { stroke, fill } } — markerar körda/avbrutna noder.
export function BpmnDiagram({ diagram, highlight, compact = false }) {
  const markerId = `bpmn-${diagram.id}-${(diagramSeq = (diagramSeq + 1) % 1e6)}`;
  return (
    <figure className="my-4 space-y-4" data-tts-skip>
      {diagram.views.map((view) => (
        <div key={view.container ?? "main"}>
          {view.container && (
            <p className="mb-1 text-sm font-medium text-ink/70">Barndiagram: {view.title}</p>
          )}
          <div className={compact ? "" : "overflow-x-auto rounded-lg border border-line bg-white p-2"}>
            <View diagram={diagram} view={view} highlight={highlight} markerId={`${markerId}-${view.container ?? "m"}`} />
          </div>
        </div>
      ))}
    </figure>
  );
}

export const HIGHLIGHT = {
  ran: { stroke: PINE, fill: "rgba(31,78,69,0.12)" },
  interrupted: { stroke: WRONG, fill: "rgba(179,64,46,0.08)" },
  event: { stroke: BRASS, fill: "rgba(185,147,47,0.12)" },
};

export { SOFT };

// Elementgalleri för "vilket element är X?" (omtentans fråga 13): sex
// aktivitetsformer utan etikett, märkta A–F.
export function ElementGallery({ elements }) {
  const w = 130;
  const width = elements.length * w + 10;
  return (
    <figure className="my-4" data-tts-skip>
      <div className="overflow-x-auto rounded-lg border border-line bg-white p-2">
        <svg viewBox={`0 0 ${width} 100`} className="block h-auto w-full" style={{ maxWidth: width }} role="img" aria-label="Sex BPMN-element A–F" fontFamily="Inter, system-ui, sans-serif">
          {elements.map((el, i) => {
            const cx = 10 + i * w + w / 2 - 5;
            return (
              <g key={el.letter}>
                <ActivityShape
                  cx={cx} cy={50} label={el.letter} variant={el.variant} taskType={el.taskType}
                  startEvent={el.startEvent} marker={el.marker}
                />
              </g>
            );
          })}
        </svg>
      </div>
    </figure>
  );
}
