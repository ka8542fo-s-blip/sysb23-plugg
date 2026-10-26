// Segmentväljare i befintliga tokens: ram i --line, aktivt segment i --pine.
// compact: lägre segment för verktygsrader. Under sm är segmenten tätare så
// att Läsvyns tre segment med antal ryms på en 360 px bred mobil.
export default function SegmentedControl({ segments, value, onChange, label, compact = false }) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="flex w-full rounded-[10px] border border-line bg-surface p-1"
    >
      {segments.map((segment) => {
        const active = segment.id === value;
        return (
          <button
            key={segment.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(segment.id)}
            className={`flex-1 rounded-md transition-colors duration-150 ${compact ? "px-3 py-1 text-sm" : "px-3 py-2 text-[15px] max-sm:px-2 max-sm:text-[14px]"} ${
              active
                ? "bg-pine font-medium text-paper hover:bg-pine-dark"
                : "text-ink hover:bg-pine/[0.08] hover:text-pine"
            }`}
          >
            {segment.label}
            {segment.count !== undefined && (
              <span className="tabular ml-2 text-xs opacity-70 max-sm:ml-1">{segment.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
