import { formatDayMonth } from "../../lib/dates.js";

const LOAD = {
  hög: { label: "Hög", color: "var(--pine)" },
  låg: { label: "Låg", color: "#4E7C71" },
  tenta: { label: "Tenta eller redovisning", color: "var(--wrong)" },
  tom: { label: "Ingen undervisning", color: "var(--line)" },
};

export default function WeekLoad({ schedule, currentWeek }) {
  const max = Math.max(...schedule.weeks.map((week) => week.sessions), 1);

  return (
    <section>
      <h2 className="font-display text-xl">Belastning per vecka</h2>
      <p className="mt-1 text-[15px] text-ink/70">
        Antal pass du faktiskt går på — parallella labbgrupper räknas som ett pass.
      </p>

      <ul className="card mt-3 divide-y divide-line">
        {schedule.weeks.map((week) => {
          const load = LOAD[week.load] || LOAD.låg;
          const active = currentWeek?.week === week.week;
          const width = week.sessions === 0 ? 0 : (week.sessions / max) * 100;
          return (
            <li
              key={`${week.from}`}
              className={`flex items-center gap-3 p-3 ${active ? "bg-pine/[0.05]" : ""}`}
            >
              <span className="tabular w-20 shrink-0 text-sm">
                v.{week.week}
                {active && <span className="sr-only"> (aktuell vecka)</span>}
              </span>
              <span className="tabular hidden w-24 shrink-0 text-sm text-ink/65 sm:block">
                {formatDayMonth(week.from)}
              </span>
              <span className="flex min-w-0 flex-1 items-center gap-2">
                {week.sessions === 0 ? (
                  <span
                    aria-hidden="true"
                    className="h-px w-6 shrink-0"
                    style={{ backgroundColor: LOAD.tom.color }}
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="h-3 rounded-full"
                    style={{ width: `${width}%`, backgroundColor: load.color }}
                  />
                )}
                <span className="tabular shrink-0 text-sm text-ink/65">
                  {week.sessions === 0 ? "inga pass" : `${week.sessions} pass`}
                </span>
              </span>
              <span className="hidden shrink-0 text-sm text-ink/65 sm:block">
                {load.label}
              </span>
              {active && <span className="chip chip-on shrink-0 text-xs">Nu</span>}
            </li>
          );
        })}
      </ul>

      <p className="mt-3 rounded-card border-l-2 border-brass bg-white p-4 text-[15px] leading-relaxed">
        {schedule.heaviestStretch.label}
      </p>
    </section>
  );
}
