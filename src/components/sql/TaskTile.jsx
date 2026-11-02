// Ruta per uppgift, samma form som Tentafrågor i Öva. Läget bärs av både färg
// och tecken, aldrig av färg ensam.
const STATE = {
  solved: {
    text: "löst",
    tile: "border-correct/60 bg-correct-bg text-ink",
    glyph: "✓",
    glyphClass: "border-correct/60 text-correct",
  },
  help: {
    text: "löst med hjälp",
    tile: "border-brass/60 bg-brass/[0.07] text-ink",
    glyph: "✓",
    glyphClass: "border-brass/60 text-brass-text",
  },
  started: {
    text: "påbörjad",
    tile: "border-pine text-pine",
    glyph: "•",
    glyphClass: "border-pine/60 text-pine",
  },
  empty: { text: "inte påbörjad", tile: "border-line text-ink/75", glyph: null },
};

const LEGEND = [
  ["solved", "Löst"],
  ["help", "Löst med hjälp"],
  ["started", "Påbörjad"],
  ["empty", "Inte påbörjad"],
];

export default function TaskTile({ label, state, name, current = false, onClick }) {
  const s = STATE[state];
  return (
    <button
      type="button"
      onClick={onClick}
      title={name}
      aria-label={`${name}, ${s.text}`}
      aria-current={current ? "true" : undefined}
      className={`tabular relative inline-flex h-11 min-w-[2.75rem] items-center justify-center rounded-lg border px-2 text-sm transition-colors duration-150 hover:border-pine sm:h-10 ${s.tile} ${
        current ? "font-semibold ring-2 ring-pine ring-offset-2 ring-offset-surface" : ""
      }`}
    >
      {label}
      {s.glyph && (
        <span
          aria-hidden="true"
          className={`absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full border bg-surface text-[10px] leading-none ${s.glyphClass}`}
        >
          {s.glyph}
        </span>
      )}
    </button>
  );
}

export function TileLegend() {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-ink/65" aria-label="Förklaring">
      {LEGEND.map(([state, text]) => (
        <li key={state} className="flex items-center gap-3">
          <span aria-hidden="true" className={`relative inline-block h-4 w-5 rounded-[4px] border ${STATE[state].tile}`}>
            {STATE[state].glyph && (
              <span
                className={`absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border bg-surface text-[9px] leading-none ${STATE[state].glyphClass}`}
              >
                {STATE[state].glyph}
              </span>
            )}
          </span>
          {text}
        </li>
      ))}
    </ul>
  );
}
