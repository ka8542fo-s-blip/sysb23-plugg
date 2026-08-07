const STATUS = {
  solved: { label: "Löst", className: "text-correct", mark: "✓" },
  "solved-with-help": { label: "Löst med hjälp", className: "text-brass", mark: "✓" },
};

// Övningarna grupperade per nivå, med progress per nivå. Inga lås —
// man ska kunna hoppa.
export default function ExerciseList({ levels, exercises, progress, currentId, onSelect }) {
  return (
    <nav aria-label="Övningar" className="space-y-4">
      {levels.map((level) => {
        const inLevel = exercises.filter((exercise) => exercise.level === level.id);
        const solved = inLevel.filter((exercise) => progress[exercise.id]).length;
        const percent = inLevel.length ? (solved / inLevel.length) * 100 : 0;

        return (
          <section key={level.id}>
            <h3 className="tabular font-display text-[15px]">
              Nivå {level.number}
              <span className="ml-2 font-sans font-normal text-ink/80">{level.name}</span>
            </h3>
            <div
              className="mt-1 h-1 w-full overflow-hidden rounded-full bg-line"
              role="img"
              aria-label={`${solved} av ${inLevel.length} lösta i nivå ${level.number}.`}
            >
              <div
                className="h-full rounded-full bg-correct transition-[width] duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>

            <ul className="mt-2 space-y-1">
              {inLevel.map((exercise, index) => {
                const status = STATUS[progress[exercise.id]];
                const active = exercise.id === currentId;
                return (
                  <li key={exercise.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(exercise.id)}
                      aria-current={active ? "true" : undefined}
                      className={`flex w-full items-baseline gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors duration-150 ${
                        active
                          ? "border-pine bg-pine/[0.08] text-pine"
                          : "border-transparent hover:border-pine hover:bg-pine/[0.06]"
                      }`}
                    >
                      <span className="tabular w-6 shrink-0 text-ink/65">
                        {level.number}.{index + 1}
                      </span>
                      <span className="min-w-0 flex-1 truncate">{exercise.task}</span>
                      {status && (
                        <span
                          className={`shrink-0 ${status.className}`}
                          title={status.label}
                        >
                          {status.mark}
                          <span className="sr-only"> {status.label}</span>
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </nav>
  );
}
