import {
  addDays,
  daysBetween,
  today,
  formatDayMonth,
  formatSwedish,
  monthName,
} from "../../lib/dates.js";

// Gantt-liknande översikt byggd med CSS grid — en kolumn per dag.
export default function TermOverview({ schedule, exams, currentPeriod }) {
  const start = schedule.termStart;
  const end = schedule.termEnd;
  const totalDays = daysBetween(start, end) + 1;
  const columns = `repeat(${totalDays}, minmax(0, 1fr))`;

  const dayIndex = (iso) => Math.min(Math.max(daysBetween(start, iso), 0), totalDays - 1);
  const now = today();
  const todayIndex = daysBetween(start, now);
  const todayInRange = todayIndex >= 0 && todayIndex < totalDays;
  const todayLeft = `${((todayIndex + 0.5) / totalDays) * 100}%`;

  // Månadsetiketter: en cell per månad i intervallet.
  const months = [];
  for (let i = 0; i < totalDays; i++) {
    const iso = addDays(start, i);
    const key = iso.slice(0, 7);
    const last = months[months.length - 1];
    if (last?.key === key) last.span += 1;
    else months.push({ key, iso, startIndex: i, span: 1 });
  }

  const examFor = (subcourseId) =>
    exams.find((exam) => exam.subcourse === subcourseId && exam.type === "ordinarie");

  return (
    <section>
      <h2 className="font-display text-xl">Terminen i översikt</h2>
      <p className="mt-1 text-[15px] text-ink/70">
        Delkursernas löptid från {formatDayMonth(start)} till {formatDayMonth(end)}. Den
        lodräta markören i slutet av varje stapel är den ordinarie tentan.
      </p>

      <div className="card mt-3 p-4 sm:p-5">
        <div
          className="grid items-center gap-y-1"
          style={{ gridTemplateColumns: "minmax(84px, 148px) 1fr" }}
        >
          <div />
          <div className="grid text-[11px] text-ink/65" style={{ gridTemplateColumns: columns }}>
            {months.map((month) => (
              <div
                key={month.key}
                className="truncate"
                style={{ gridColumn: `${month.startIndex + 1} / span ${month.span}` }}
              >
                {month.span >= 10 ? monthName(month.iso) : ""}
              </div>
            ))}
          </div>

          {schedule.subcourses.map((subcourse) => {
            const from = dayIndex(subcourse.start);
            const to = dayIndex(subcourse.end);
            const span = Math.max(1, to - from + 1);
            const exam = examFor(subcourse.id);
            return (
              <div key={subcourse.id} className="contents">
                <div className="truncate py-1 pr-3 text-sm">{subcourse.short}</div>
                <div className="relative py-1">
                  <div className="grid" style={{ gridTemplateColumns: columns }}>
                    <div
                      className="h-3 rounded-full"
                      style={{
                        gridRow: 1,
                        gridColumn: `${from + 1} / span ${span}`,
                        backgroundColor: `var(${subcourse.color})`,
                      }}
                      title={`${subcourse.name}: ${formatDayMonth(subcourse.start)}–${formatDayMonth(subcourse.end)}`}
                    />
                    {exam && (
                      <div
                        className="h-5 w-[3px] justify-self-center rounded-sm bg-ink/70"
                        style={{ gridRow: 1, gridColumn: `${dayIndex(exam.date) + 1} / span 1` }}
                        title={`Tenta ${formatSwedish(exam.date)}`}
                      />
                    )}
                  </div>
                  {todayInRange && (
                    <div
                      aria-hidden="true"
                      className="absolute inset-y-0 w-px bg-brass"
                      style={{ left: todayLeft }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {todayInRange ? (
          <p className="mt-3 flex items-center gap-2 text-sm text-ink/65">
            <span aria-hidden="true" className="h-3 w-px bg-brass" />
            Den lodräta linjen är idag, {formatSwedish(now)}.
          </p>
        ) : (
          <p className="mt-3 text-sm text-ink/65">
            Idag ligger utanför terminen, så ingen dagsmarkör ritas.
          </p>
        )}
      </div>

      <p className="mt-3 rounded-card border-l-2 border-brass bg-white p-4 text-[15px] leading-relaxed">
        {schedule.heaviestStretch.label}
      </p>

      <ul className="mt-3 space-y-2">
        {schedule.periods.map((period) => {
          const active = currentPeriod?.from === period.from;
          return (
            <li
              key={period.from}
              className={`card p-4 ${active ? "border-pine bg-pine/[0.04]" : ""}`}
            >
              <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="tabular text-sm font-medium">
                  {formatDayMonth(period.from)} – {formatDayMonth(period.to)}
                </span>
                {active && <span className="chip chip-on text-xs">Pågår nu</span>}
                {period.warning && (
                  <span className="chip border-brass text-xs text-brass">Tät period</span>
                )}
              </p>
              <p className="mt-1 text-[15px] leading-relaxed">{period.label}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
