import { schedule } from "../../data/schedule.js";
import { nextExam, termState } from "../../lib/scheduleInfo.js";
import { nextStudyStep, startStudying } from "../../lib/studyPlan.js";
import { daysUntil, formatShort, formatLongDate, relativeDays } from "../../lib/dates.js";

// Smal rad högst upp på Hem. Döljs när terminen är slut.
export default function NextExamBar({ answers, exams, navigate, onSelectCourse }) {
  const state = termState(schedule);
  if (state === "after") return null;

  const next = nextExam(schedule);
  const beforeTerm = state === "before";
  const step = next
    ? nextStudyStep({ subcourse: next.subcourseData, answers, exams })
    : null;

  return (
    <div className="card flex flex-wrap items-center gap-x-3 gap-y-2 p-3">
      {next && (
        <span
          aria-hidden="true"
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: `var(${next.subcourseData?.color})` }}
        />
      )}

      <button
        type="button"
        onClick={() => navigate("schema")}
        className="min-w-0 flex-1 text-left text-[15px] hover:text-pine"
      >
        {beforeTerm ? (
          <>
            Terminen börjar {formatLongDate(schedule.termStart)}
            <span className="tabular text-ink/65">
              {" "}
              · {relativeDays(daysUntil(schedule.termStart))}
            </span>
          </>
        ) : (
          <>
            Nästa tenta: {next.subcourseData?.name}
            <span className="tabular text-ink/65">
              {" "}
              · {relativeDays(next.days)} · {formatShort(next.date)} {next.start} ·{" "}
              {next.room}
            </span>
          </>
        )}
        <span className="sr-only">— öppna Schema</span>
      </button>

      {step?.available && (
        <button
          type="button"
          className="btn-secondary shrink-0 px-3 py-1.5 text-sm"
          title={`${step.label} — ${step.courseName}`}
          onClick={() =>
            startStudying({ step, exam: next, navigate, onSelectCourse })
          }
        >
          {step.label}
        </button>
      )}
    </div>
  );
}
