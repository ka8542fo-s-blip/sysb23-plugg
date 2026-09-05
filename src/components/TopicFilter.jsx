// Multival av ämnen eller kapitel (practiceAxis). Tom lista tolkas som "Allt".
export default function TopicFilter({ topics, selected, onChange, counts, label = "Ämnen" }) {
  function toggle(id) {
    onChange(
      selected.includes(id)
        ? selected.filter((item) => item !== id)
        : [...selected, id],
    );
  }

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <h3 className="font-display text-lg">{label}</h3>
        {selected.length > 0 && (
          <button type="button" className="btn-quiet px-0 text-sm" onClick={() => onChange([])}>
            Välj allt
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange([])}
          aria-pressed={selected.length === 0}
          className={`chip ${selected.length === 0 ? "chip-on" : "hover:border-pine"}`}
        >
          Allt
        </button>
        {topics.map((topic) => {
          const on = selected.includes(topic.id);
          const count = counts?.[topic.id] ?? 0;
          return (
            <button
              key={topic.id}
              type="button"
              onClick={() => toggle(topic.id)}
              aria-pressed={on}
              disabled={count === 0}
              className={`chip ${on ? "chip-on" : "hover:border-pine"} ${
                count === 0 ? "cursor-not-allowed opacity-40" : ""
              }`}
            >
              {topic.name}
              <span className="tabular ml-2 text-xs opacity-70">{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
