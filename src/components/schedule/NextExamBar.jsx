import { schedule } from "../../data/schedule.js";
import { nextExam, termState } from "../../lib/scheduleInfo.js";
import { daysUntil, formatShort, formatLongDate, relativeDays } from "../../lib/dates.js";

// Smal rad högst upp på Hem. Döljs när terminen är slut.
export default function NextExamBar({ onOpen }) {
  const state = termState(schedule);
  if (state === "after") return null;

  const next = nextExam(schedule);
  const beforeTerm = state === "before";

  return (
    <button type="button" onClick={onOpen} className="card-action flex flex-wrap items-center gap-x-3 gap-y-1 p-3">
      {next && (
        <span
          aria-hidden="true"
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: `var(${next.subcourseData?.color})` }}
        />
      )}
      {beforeTerm ? (
        <span className="text-[15px]">
          Terminen börjar {formatLongDate(schedule.termStart)}
          <span className="tabular text-ink/65">
            {" "}
            · {relativeDays(daysUntil(schedule.termStart))}
          </span>
        </span>
      ) : (
        <span className="text-[15px]">
          Nästa tenta: {next.subcourseData?.name}
          <span className="tabular text-ink/65">
            {" "}
            · {relativeDays(next.days)} · {formatShort(next.date)} {next.start} ·{" "}
            {next.room}
          </span>
        </span>
      )}
      <span aria-hidden="true" className="ml-auto text-pine">
        →
      </span>
      <span className="sr-only">Öppna Schema</span>
    </button>
  );
}
