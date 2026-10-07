import { boxRect, groupRect, arrowGeometry } from "../../lib/fdDiagram.js";

// Ritningen i miniatyr, bredvid nedbrytningsrutan: samma rutor, grupper och
// pilar som på ritytan men skrivskyddad, utan rutnät och beskuren runt
// innehållet, så att man ser beroendena medan man skriver relationerna.
export default function FdMini({ diagram, maxHeight = 150 }) {
  const boxes = diagram?.boxes ?? [];
  if (!boxes.length) {
    return <p className="text-sm text-ink/55">Ritar du beroendediagrammet ovan syns det här i miniatyr.</p>;
  }
  const rects = [...boxes.map(boxRect), ...diagram.groups.map((g) => groupRect(g, diagram)).filter(Boolean)];
  const pad = 14;
  const x1 = Math.min(...rects.map((r) => r.x)) - pad;
  const y1 = Math.min(...rects.map((r) => r.y)) - pad;
  const x2 = Math.max(...rects.map((r) => r.x + r.w)) + pad;
  const y2 = Math.max(...rects.map((r) => r.y + r.h)) + pad;
  const label = `Ditt beroendediagram: ${diagram.arrows.length} pil${diagram.arrows.length === 1 ? "" : "ar"} mellan ${boxes.map((b) => b.attr || "?").join(", ")}.`;
  return (
    <svg
      viewBox={`${x1} ${y1} ${x2 - x1} ${y2 - y1}`}
      className="mx-auto block h-auto w-full"
      style={{ maxHeight }}
      role="img"
      aria-label={label}
    >
      <defs>
        <marker id="fd-mini-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" className="fill-ink" />
        </marker>
      </defs>
      {diagram.groups.map((g) => {
        const r = groupRect(g, diagram);
        return r ? <rect key={g.id} x={r.x} y={r.y} width={r.w} height={r.h} rx="10" className="fill-none stroke-ink" strokeWidth="1.6" /> : null;
      })}
      {diagram.arrows.map((a) => {
        const geo = arrowGeometry(a, diagram);
        return geo ? <path key={a.id} d={geo.d} className="fill-none stroke-ink" strokeWidth="1.8" markerEnd="url(#fd-mini-head)" /> : null;
      })}
      {boxes.map((b) => {
        const r = boxRect(b);
        return (
          <g key={b.id}>
            <rect x={r.x} y={r.y} width={r.w} height={r.h} rx="5" className="fill-white stroke-ink" strokeWidth="1.6" />
            <text x={b.x} y={b.y + 7} textAnchor="middle" fontSize="20" className={b.attr ? "fill-ink" : "fill-ink/35"} style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
              {b.attr || "?"}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
