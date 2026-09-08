// Crow's Foot i Visual Paradigms stil, som häftets uppgift 4–5 visar den:
// rundad ruta med rubrikfält, attributrader med nyckelikon på identifieraren
// och N-märke för nullbart, streckade linjer med kråkfot, ring och streck
// som ändar. Tokens: pine för entitetsrutan, brass för nyckeln, delkursens
// koboltblå för relationslinjer, ändar och N-märket.
const PINE = "var(--pine)";
const BRASS = "var(--brass)";
const INK = "var(--ink)";
const SOFT = "rgba(34,40,42,0.55)";
const BLUE = "var(--c-databaser)";
const PINE_FILL = "rgba(31,78,69,0.16)";
const BRASS_FILL = "rgba(185,147,47,0.22)";
const HEAD = 24;
const ROW = 22;

export const vpHeight = (attrs) => HEAD + 6 + attrs.length * ROW + 8;

function KeyIcon({ x, y }) {
  return (
    <g stroke={BRASS} strokeWidth={1.6} fill={BRASS_FILL}>
      <circle cx={x + 4} cy={y - 3} r={3.2} />
      <line x1={x + 6} y1={y - 1} x2={x + 12} y2={y + 5} />
      <line x1={x + 10} y1={y + 3} x2={x + 12} y2={y + 1} />
    </g>
  );
}
function FieldIcon({ x, y }) {
  return (
    <g stroke={SOFT} strokeWidth={1} fill="white">
      <rect x={x + 1} y={y - 6} width={10} height={12} rx={1} />
      <line x1={x + 3} y1={y - 2} x2={x + 9} y2={y - 2} />
      <line x1={x + 3} y1={y + 1} x2={x + 9} y2={y + 1} />
    </g>
  );
}

// attrs: [{ name, key?: true, nullable?: true }]
export function VpEntity({ x, y, w = 156, label, attrs }) {
  const h = vpHeight(attrs);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill="white" stroke={PINE} strokeWidth={1.8} />
      <rect x={x + 1} y={y + 1} width={w - 2} height={HEAD} rx={9} fill={PINE_FILL} />
      <line x1={x} x2={x + w} y1={y + HEAD} y2={y + HEAD} stroke={PINE} strokeWidth={1.2} />
      <text x={x + w / 2} y={y + HEAD / 2 + 1} textAnchor="middle" dominantBaseline="central" fontWeight="700" fill={PINE}>
        {label}
      </text>
      {attrs.map((attr, i) => {
        const cy = y + HEAD + 6 + i * ROW + ROW / 2;
        return (
          <g key={attr.name} fontSize={12.5} fill={INK}>
            {attr.key ? <KeyIcon x={x + 8} y={cy} /> : <FieldIcon x={x + 8} y={cy} />}
            <text x={x + 26} y={cy} dominantBaseline="central" fontWeight={attr.key ? "600" : "400"}>
              {attr.name}
            </text>
            {attr.nullable && (
              <g>
                <rect x={x + w - 22} y={cy - 7} width={14} height={14} rx={2} fill="rgba(0,85,154,0.10)" stroke={BLUE} strokeWidth={1} />
                <text x={x + w - 15} y={cy + 0.5} textAnchor="middle" dominantBaseline="central" fontSize={10} fill={BLUE} fontWeight="700">N</text>
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
}

// Ändmarkering vid x (boxkanten), linjen går åt dir (+1 höger, −1 vänster).
// one: streck närmast boxen; many: kråkfot; optional: ring; required: yttre streck.
function VpEnd({ x, y, dir, one, many, optional, required }) {
  const s = dir;
  return (
    <g stroke={BLUE} strokeWidth={1.8} fill="none">
      {many && (
        <>
          <line x1={x + s * 16} y1={y} x2={x} y2={y - 8} />
          <line x1={x + s * 16} y1={y} x2={x} y2={y} />
          <line x1={x + s * 16} y1={y} x2={x} y2={y + 8} />
        </>
      )}
      {one && <line x1={x + s * 12} y1={y - 8} x2={x + s * 12} y2={y + 8} />}
      {optional && <circle cx={x + s * 27} cy={y} r={4.5} fill="white" />}
      {required && <line x1={x + s * 26} y1={y - 8} x2={x + s * 26} y2={y + 8} />}
    </g>
  );
}

// Streckad vågrät linje mellan två boxkanter med ändar och namn.
export function VpLine({ x1, x2, y, label, left, right }) {
  return (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={BLUE} strokeWidth={1.6} strokeDasharray="6 4" />
      <VpEnd x={x1} y={y} dir={1} {...left} />
      <VpEnd x={x2} y={y} dir={-1} {...right} />
      {label && (
        <text x={(x1 + x2) / 2} y={y - 8} textAnchor="middle" fontSize={12.5} fontWeight="700" fill={BLUE}>
          {label}
        </text>
      )}
    </g>
  );
}
