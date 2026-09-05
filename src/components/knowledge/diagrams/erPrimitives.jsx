// Handskrivna SVG-primitiver för kompendiets ER-figurer (Chen och Crow's
// Foot). Inget generellt diagramspråk — bara de former kapitlen behöver.
// Färgerna är Läsesalens tokens: pine för Chen-symboler, brass för
// ratio-etiketter, ink för text. Appen har ett enda ljust tema, så
// tokens används rakt av i stället för currentColor.
const PINE = "var(--pine)";
const BRASS = "var(--brass)";
const INK = "var(--ink)";
const SOFT = "rgba(34,40,42,0.55)";

export const FONT = 13;
// Ungefärlig teckenbredd i em — räcker för understrykningar av korta
// attributnamn, vilket är det enda vi mäter.
const CHAR = 0.52;
export const textWidth = (label, size = FONT) => label.length * size * CHAR;

export function Figure({ viewBox, label, caption, notChen = false, maxWidth = 620, children }) {
  return (
    <figure className="my-6" data-tts-skip>
      <svg
        viewBox={viewBox}
        role="img"
        aria-label={label}
        className="mx-auto block h-auto w-full"
        style={{ maxWidth }}
        fontSize={FONT}
        fill={INK}
      >
        <defs>
          <marker id="er-pil" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={BRASS} />
          </marker>
        </defs>
        {children}
      </svg>
      {(caption || notChen) && (
        <figcaption className="mt-2 max-w-reading text-sm leading-relaxed text-ink/65">
          {caption}
          {notChen && <span className="italic"> Populationsvy — inte Chen-notation.</span>}
        </figcaption>
      )}
    </figure>
  );
}

export function EntityBox({ x, y, w = 124, h = 44, label, weak = false, size = FONT }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="white" stroke={PINE} strokeWidth={1.6} />
      {weak && (
        <rect x={x + 4} y={y + 4} width={w - 8} height={h - 8} fill="none" stroke={PINE} strokeWidth={1.6} />
      )}
      <text x={x + w / 2} y={y + h / 2} textAnchor="middle" dominantBaseline="central" fontWeight="600" fontSize={size}>
        {label}
      </text>
    </g>
  );
}

export function RelationshipDiamond({ cx, cy, w = 128, h = 60, label, identifying = false, size = FONT }) {
  const a = w / 2;
  const b = h / 2;
  const points = (pa, pb) => `${cx},${cy - pb} ${cx + pa},${cy} ${cx},${cy + pb} ${cx - pa},${cy}`;
  // Parallell inre romb på avståndet d från den yttre.
  const d = 4;
  const hyp = Math.hypot(a, b);
  const ia = a - (d * hyp) / b;
  const ib = b - (d * hyp) / a;
  return (
    <g>
      <polygon points={points(a, b)} fill="white" stroke={PINE} strokeWidth={1.6} />
      {identifying && <polygon points={points(ia, ib)} fill="none" stroke={PINE} strokeWidth={1.6} />}
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontWeight="600" fontSize={size}>
        {label}
      </text>
    </g>
  );
}

// identifier: null | "solid" | "dashed" (partiell identifierare)
export function AttributeOval({
  cx, cy, rx = 54, ry = 15, label, multivalued = false, derived = false, identifier = null, size = FONT,
}) {
  const tw = textWidth(label, size);
  return (
    <g fontSize={size}>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="white" stroke={SOFT} strokeWidth={1.3} strokeDasharray={derived ? "4 3" : undefined} />
      {multivalued && (
        <ellipse cx={cx} cy={cy} rx={rx - 4} ry={ry - 4} fill="none" stroke={SOFT} strokeWidth={1.3} />
      )}
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
        {label}
      </text>
      {identifier && (
        <line
          x1={cx - tw / 2} x2={cx + tw / 2} y1={cy + size * 0.55} y2={cy + size * 0.55}
          stroke={INK} strokeWidth={1.2} strokeDasharray={identifier === "dashed" ? "3 2.5" : undefined}
        />
      )}
    </g>
  );
}

// Deltagandelinje: enkel = partial, dubbel = total.
export function Connector({ x1, y1, x2, y2, total = false }) {
  if (!total) return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={PINE} strokeWidth={1.5} />;
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const nx = (-(y2 - y1) / len) * 2.6;
  const ny = ((x2 - x1) / len) * 2.6;
  return (
    <g stroke={PINE} strokeWidth={1.5}>
      <line x1={x1 + nx} y1={y1 + ny} x2={x2 + nx} y2={y2 + ny} />
      <line x1={x1 - nx} y1={y1 - ny} x2={x2 - nx} y2={y2 - ny} />
    </g>
  );
}

export function AttributeLink({ x1, y1, x2, y2 }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={SOFT} strokeWidth={1.1} />;
}

export function Ratio({ x, y, text }) {
  return (
    <text x={x} y={y} textAnchor="middle" fill={BRASS} fontWeight="700" fontSize={FONT + 2}>
      {text}
    </text>
  );
}

export function Role({ x, y, text, anchor = "middle" }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fill={SOFT} fontStyle="italic" fontSize={FONT - 1}>
      {text}
    </text>
  );
}

export function Note({ x, y, text, anchor = "start", size = 12, bold = false, color = SOFT }) {
  const lines = Array.isArray(text) ? text : [text];
  return (
    <text x={x} y={y} textAnchor={anchor} fill={color} fontSize={size} fontWeight={bold ? "600" : "400"}>
      {lines.map((line, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : size * 1.35}>{line}</tspan>
      ))}
    </text>
  );
}

// Mässingspil, rak eller lätt böjd (curve = kontrollpunktens avstånd från kordan).
export function Arrow({ x1, y1, x2, y2, curve = 0 }) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const d = curve
    ? `M${x1},${y1} Q${mx},${my + curve} ${x2},${y2}`
    : `M${x1},${y1} L${x2},${y2}`;
  return <path d={d} fill="none" stroke={BRASS} strokeWidth={1.5} markerEnd="url(#er-pil)" />;
}

// ---------- Crow's Foot ----------

const ROW = 18;
const HEAD = 26;
export const crowEntityHeight = (ids, attrs) => HEAD + (ids.length + attrs.length) * ROW + 10;

// Entitetsbox med rubrik, ID-märkta identifierare och vanliga attribut under avskiljaren.
export function CrowEntity({ x, y, w = 156, label, ids = [], attrs = [] }) {
  const h = crowEntityHeight(ids, attrs);
  const rows = [...ids.map((name) => ({ name, id: true })), ...attrs.map((name) => ({ name, id: false }))];
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="white" stroke={PINE} strokeWidth={1.6} />
      <text x={x + w / 2} y={y + HEAD / 2 + 1} textAnchor="middle" dominantBaseline="central" fontWeight="600" letterSpacing="0.04em">
        {label}
      </text>
      <line x1={x} x2={x + w} y1={y + HEAD} y2={y + HEAD} stroke={PINE} strokeWidth={1.2} />
      {ids.length > 0 && attrs.length > 0 && (
        <line x1={x} x2={x + w} y1={y + HEAD + ids.length * ROW + 5} y2={y + HEAD + ids.length * ROW + 5} stroke={SOFT} strokeWidth={0.8} />
      )}
      {rows.map((row, i) => {
        const ry = y + HEAD + 5 + (i + 0.5) * ROW + (row.id ? 0 : 5) - (row.id ? 0 : 0);
        return (
          <g key={row.name} fontSize={FONT - 1}>
            <text x={x + 10} y={ry} dominantBaseline="central">{row.name}</text>
            {row.id && (
              <text x={x + w - 10} y={ry} textAnchor="end" dominantBaseline="central" fill={BRASS} fontWeight="700" fontSize={FONT - 3}>
                ID
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}

// Ändmarkeringar vid en boxkant på x. side = var boxen ligger relativt
// linjen ("left": boxen slutar vid x och linjen går åt höger).
export function CrowMarks({ x, y, side, optional = false, many = false }) {
  const s = side === "left" ? 1 : -1;
  return (
    <g stroke={PINE} strokeWidth={1.5} fill="none">
      {many ? (
        <>
          <line x1={x + s * 15} y1={y} x2={x} y2={y - 8} />
          <line x1={x + s * 15} y1={y} x2={x} y2={y} />
          <line x1={x + s * 15} y1={y} x2={x} y2={y + 8} />
        </>
      ) : (
        <line x1={x + s * 12} y1={y - 8} x2={x + s * 12} y2={y + 8} />
      )}
      {optional ? (
        <circle cx={x + s * 26} cy={y} r={4.5} fill="white" />
      ) : (
        <line x1={x + s * 25} y1={y - 8} x2={x + s * 25} y2={y + 8} />
      )}
    </g>
  );
}

// Namngiven vågrät linje mellan två boxkanter, med ändmarkeringar i båda ändar.
export function CrowLine({ x1, x2, y, label, left, right, roleLeft, roleRight }) {
  return (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={PINE} strokeWidth={1.5} />
      <CrowMarks x={x1} y={y} side="left" {...left} />
      <CrowMarks x={x2} y={y} side="right" {...right} />
      {label && (
        <text x={(x1 + x2) / 2} y={y - 9} textAnchor="middle" fontSize={FONT - 1} fontWeight="600">
          {label}
        </text>
      )}
      {roleLeft && <Role x={x1 + 40} y={y + 20} text={roleLeft} anchor="start" />}
      {roleRight && <Role x={x2 - 40} y={y + 20} text={roleRight} anchor="end" />}
    </g>
  );
}

// ---------- Populationsvy (inte Chen) ----------

// Rundad ram = mängd, raderna = instanser. layout "row" lägger dem som
// piller på en rad, "column" som rader.
export function PopulationSet({ x, y, w, h, title, items, layout = "column" }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={14} fill="rgba(31,78,69,0.04)" stroke={SOFT} strokeWidth={1} strokeDasharray="5 4" />
      <text x={x + 14} y={y + 18} fontSize={FONT - 1} fontWeight="600" fill={PINE}>{title}</text>
      {layout === "row"
        ? items.map((item, i) => {
            const pw = (w - 28 - (items.length - 1) * 10) / items.length;
            const px = x + 14 + i * (pw + 10);
            return (
              <g key={item}>
                <rect x={px} y={y + 32} width={pw} height={30} rx={15} fill="white" stroke={SOFT} strokeWidth={1} />
                <text x={px + pw / 2} y={y + 47} textAnchor="middle" dominantBaseline="central" fontSize={FONT - 1}>{item}</text>
              </g>
            );
          })
        : items.map((item, i) => (
            <g key={item}>
              <circle cx={x + 20} cy={y + 38 + i * 20} r={3} fill={BRASS} />
              <text x={x + 30} y={y + 38 + i * 20} dominantBaseline="central" fontSize={FONT - 1}>{item}</text>
            </g>
          ))}
    </g>
  );
}
