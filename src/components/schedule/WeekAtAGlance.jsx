import { schedule } from "../../data/schedule.js";
import { nextExam, termState, subcoursesById } from "../../lib/scheduleInfo.js";
import { nextStudyStep, startStudying } from "../../lib/studyPlan.js";
import {
  addDays,
  daysUntil,
  formatDayMonth,
  formatLongDate,
  formatRange,
  relativeDays,
  today,
} from "../../lib/dates.js";

const DAY_COUNT = 7;

function weekdayName(iso) {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "UTC", weekday: "long" }).format(
    new Date(`${iso}T00:00:00Z`),
  );
}

// "Den här veckan" på Hem: nedräkning till nästa tenta och de sju
// närmaste dagarna. Detaljerna finns i Schema.
export default function WeekAtAGlance({ answers, exams, navigate, onSelectCourse }) {
  const state = termState(schedule);
  const next = nextExam(schedule);
  const byId = subcoursesById(schedule);
  const now = today();

  // Före terminsstart är de sju kommande dagarna tomma — visa terminens
  // första vecka i stället, så raden säger något.
  const beforeTerm = state === "before";
  const windowStart = beforeTerm ? schedule.termStart : now;
  const days = Array.from({ length: DAY_COUNT }, (_, i) => addDays(windowStart, i));
  const windowEnd = days[days.length - 1];

  const inWindow = schedule.sessions.filter((session) => {
    const from = session.date;
    const to = session.dateEnd || session.date;
    return to >= windowStart && from <= windowEnd;
  });

  const step = next
    ? nextStudyStep({ subcourse: next.subcourseData, answers, exams })
    : null;

  // Terminen slut: sju tomma dagrader säger ingenting.
  if (state === "after") {
    return (
      <section className="card p-5">
        <h2 className="font-display text-xl">Terminen är slut</h2>
        <p className="mt-1 text-[15px] text-ink/70">
          Alla examinationer är avklarade. Materialet ligger kvar om du vill repetera.
        </p>
        <button
          type="button"
          className="btn-secondary mt-4"
          onClick={() => navigate("schema")}
        >
          Hela pluggkalendern →
        </button>
      </section>
    );
  }

  return (
    <section className="card overflow-hidden">
      {next && (
        <div
          className="p-5"
          style={{ borderLeft: `4px solid var(${next.subcourseData?.color})` }}
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-brass">
            Nästa tenta
          </p>
          <p className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="tabular font-display text-4xl text-pine">{next.days}</span>
            <span className="text-[17px]">
              {next.days === 1 ? "dag kvar till" : "dagar kvar till"}{" "}
              <span className="font-medium">{next.subcourseData?.name}</span>
            </span>
          </p>
          <p className="tabular mt-1 text-[15px] text-ink/65">
            {formatLongDate(next.date)} · {next.start}–{next.end} · {next.room}
          </p>

          {beforeTerm && (
            <p className="mt-2 text-[15px] text-ink/70">
              Terminen börjar {formatLongDate(schedule.termStart)} —{" "}
              {relativeDays(daysUntil(schedule.termStart))}.
            </p>
          )}

          {step?.available && (
            <button
              type="button"
              className="btn-primary mt-4"
              onClick={() =>
                startStudying({ step, exam: next, navigate, onSelectCourse })
              }
            >
              {step.label}
            </button>
          )}
        </div>
      )}

      <div className="border-t border-line p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 className="font-display text-xl">
            {beforeTerm ? "Terminens första vecka" : "Den här veckan"}
          </h2>
          <span className="tabular text-sm text-ink/65">
            {formatRange(windowStart, windowEnd)} ·{" "}
            {inWindow.length === 0
              ? "inget inbokat"
              : `${inWindow.length} ${inWindow.length === 1 ? "pass" : "pass"}`}
          </span>
        </div>

        <ul className="mt-3 divide-y divide-line border-y border-line">
          {days.map((day) => {
            const isToday = day === now;
            const sessions = inWindow.filter(
              (session) => session.date <= day && (session.dateEnd || session.date) >= day,
            );
            return (
              <li
                key={day}
                className={`flex gap-4 py-2.5 ${isToday ? "bg-pine/[0.05]" : ""}`}
              >
                <span className="w-24 shrink-0 text-sm">
                  <span className={isToday ? "font-medium text-pine" : ""}>
                    {weekdayName(day)}
                  </span>
                  <span className="tabular block text-ink/65">{formatDayMonth(day)}</span>
                  {isToday && <span className="sr-only">(idag)</span>}
                </span>
                <span className="min-w-0 flex-1">
                  {sessions.length === 0 ? (
                    <span className="text-sm text-ink/45">Inget inbokat</span>
                  ) : (
                    <span className="space-y-1">
                      {sessions.map((session, index) => {
                        const subcourse = byId[session.subcourse];
                        const exam = session.kind === "tenta";
                        return (
                          <span
                            key={`${session.date}-${session.time}-${index}`}
                            className={`block text-[15px] ${exam ? "font-medium text-wrong" : ""}`}
                          >
                            <span className="tabular text-ink/65">{session.time}</span>{" "}
                            {session.title}
                            <span className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm text-ink/65">
                              <span
                                aria-hidden="true"
                                className="h-2 w-2 shrink-0 rounded-full"
                                style={{ backgroundColor: `var(${subcourse?.color})` }}
                              />
                              <span>{subcourse?.short}</span>
                              <span>· {session.place}</span>
                            </span>
                          </span>
                        );
                      })}
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          className="btn-secondary mt-4"
          onClick={() => navigate("schema")}
        >
          Hela pluggkalendern →
        </button>
      </div>
    </section>
  );
}
