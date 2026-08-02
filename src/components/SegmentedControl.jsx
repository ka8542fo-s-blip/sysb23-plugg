// Segmentväljare i befintliga tokens: ram i --line, aktivt segment i --pine.
export default function SegmentedControl({ segments, value, onChange, label }) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="flex w-full rounded-[10px] border border-line bg-white p-1"
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
            className={`flex-1 rounded-md px-3 py-2 text-[15px] transition-colors duration-150 ${
              active
                ? "bg-pine font-medium text-paper hover:bg-pine-dark"
                : "text-ink hover:bg-pine/[0.08] hover:text-pine"
            }`}
          >
            {segment.label}
            {segment.count !== undefined && (
              <span className="tabular ml-2 text-xs opacity-70">{segment.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
