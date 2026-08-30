import { Fragment, useState } from "react";
import { daysBetween, formatSwedish, relativeDays } from "../../lib/dates.js";

// Tentaöversikt som vertikal tidslinje: tentorna i datumordning med
// glappet utskrivet mellan varje par, och linjens längd skalad efter
// antalet dagar — täta glapp (≤ 7 dagar) blir korta och markerade, så
// klungor syns direkt utan att läsa en enda siffra.

const TIGHT_DAYS = 7;

function gapHeight(days) {
  return Math.max(20, Math.min(days * 2.5, 88));
}

export default function ExamTimeline({ exams }) {
  const [showRetakes, setShowRetakes] = useState(false);
  const shown = exams.filter(
    (exam) => showRetakes || exam.type === "ordinarie",
  );

  return (
    <section>
      <h2 className="font-display text-xl">Tentaöversikt</h2>
      <p className="mt-1 text-[15px] text-ink/70">
        Tentorna i följd med dagarna emellan — korta linjer betyder tätt mellan
        tentorna.
      </p>

      <div className="mt-3">
        <button
          type="button"
          className={`chip ${showRetakes ? "chip-on" : ""}`}
          aria-pressed={showRetakes}
          onClick={() => setShowRetakes(!showRetakes)}
        >
          Visa omtentor
        </button>
      </div>

      <div className="card mt-3 p-5">
        <ol>
          {shown.map((exam, index) => {
            const gap = index > 0 ? daysBetween(shown[index - 1].date, exam.date) : null;
            const tight = gap !== null && gap <= TIGHT_DAYS;
            return (
              <Fragment key={exam.id}>
                {gap !== null && (
                  <li
                    aria-hidden="true"
                    className="grid grid-cols-[3.5rem_1rem_1fr] items-center gap-x-3 sm:grid-cols-[4rem_1rem_1fr]"
                  >
                    <span />
                    <span className="flex justify-center">
                      <span
                        className={`w-px ${tight ? "w-[3px] rounded-full bg-brass" : "bg-line"}`}
                        style={{ height: `${gapHeight(gap)}px` }}
                      />
                    </span>
                    <span className="flex flex-wrap items-center gap-2 text-sm text-ink/65">
                      <span className="tabular">
                        {gap === 1 ? "1 dag emellan" : `${gap} dagar emellan`}
                      </span>
                      {tight && (
                        <span className="chip border-brass py-0 text-xs text-brass">
                          Tätt
                        </span>
                      )}
                    </span>
                  </li>
                )}
                <li
                  className={`grid grid-cols-[3.5rem_1rem_1fr] items-center gap-x-3 sm:grid-cols-[4rem_1rem_1fr] ${
                    exam.past ? "opacity-60" : ""
                  }`}
                >
                  <span className="text-right">
                    <span className="tabular block font-display text-2xl leading-none">
                      {Number(exam.date.slice(8))}
                    </span>
                    <span className="block text-[11px] uppercase tracking-wide text-ink/65">
                      {formatSwedish(exam.date).split(" ").pop().slice(0, 3)}
                    </span>
                  </span>
                  <span className="flex justify-center">
                    <span
                      aria-hidden="true"
                      className="h-3 w-3 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: `var(${exam.subcourseData?.color})` }}
                    />
                  </span>
                  <span className="min-w-0 py-1">
                    <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span className="font-medium">{exam.subcourseData?.short}</span>
                      {exam.type === "omtenta" && (
                        <span className="chip border-line py-0 text-xs text-ink/65">
                          Omtenta
                        </span>
                      )}
                      <span className="tabular text-sm text-ink/65">
                        {exam.past ? (
                          <span className="text-correct">✓ avklarad</span>
                        ) : (
                          relativeDays(exam.days)
                        )}
                      </span>
                    </span>
                    <span className="tabular mt-0.5 block text-sm text-ink/65">
                      {formatSwedish(exam.date)} · {exam.start}–{exam.end} ·{" "}
                      {exam.room || "sal okänd"}
                    </span>
                  </span>
                </li>
              </Fragment>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
