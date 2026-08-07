import { useMemo, useState } from "react";
import { schedule } from "../../data/schedule.js";
import { nextExam, termState, subcoursesById } from "../../lib/scheduleInfo.js";
import { studyTargetFor, startStudying, STUDY_LABEL } from "../../lib/studyPlan.js";
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

function weekdayShort(iso) {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "UTC", weekday: "short" })
    .format(new Date(`${iso}T00:00:00Z`))
    .slice(0, 2);
}

function weekdayLong(iso) {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "UTC", weekday: "long" }).format(
    new Date(`${iso}T00:00:00Z`),
  );
}

// "Den här veckan" på Hem: nedräkning plus en kompakt veckorad där man
// öppnar en dag i taget. Detaljerna finns i Pluggkalendern.
export default function WeekAtAGlance({ navigate, onSelectCourse }) {
  const state = termState(schedule);
  const next = nextExam(schedule);
  const byId = useMemo(() => subcoursesById(schedule), []);
  const now = today();

  // Före terminsstart är de sju kommande dagarna tomma — visa terminens
  // första vecka i stället, så raden säger något.
  const beforeTerm = state === "before";
  const windowStart = beforeTerm ? schedule.termStart : now;

  const days = useMemo(() => {
    return Array.from({ length: DAY_COUNT }, (_, i) => {
      const date = addDays(windowStart, i);
      const sessions = schedule.sessions.filter(
        (session) => session.date <= date && (session.dateEnd || session.date) >= date,
      );
      return {
        date,
        sessions,
        isToday: date === now,
        hasExam: sessions.some((session) => session.kind === "tenta"),
      };
    });
  }, [windowStart, now]);

  const total = days.reduce((sum, day) => sum + day.sessions.length, 0);
  // Öppna den dag som är mest intressant: idag om något händer, annars
  // nästa dag med pass.
  const [openDate, setOpenDate] = useState(
    () =>
      days.find((day) => day.isToday && day.sessions.length > 0)?.date ||
      days.find((day) => day.sessions.length > 0)?.date ||
      days[0].date,
  );
  const open = days.find((day) => day.date === openDate) || days[0];

  const target = next ? studyTargetFor(next.subcourseData) : null;

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
          className="flex flex-wrap items-center gap-x-5 gap-y-3 p-4 sm:p-5"
          style={{ borderLeft: `4px solid var(${next.subcourseData?.color})` }}
        >
          <p className="min-w-0 flex-1 basis-full sm:basis-0">
            <span className="flex flex-wrap items-baseline gap-x-2">
              <span className="tabular font-display text-3xl text-pine">{next.days}</span>
              <span className="text-[15px]">
                {next.days === 1 ? "dag kvar till" : "dagar kvar till"}
              </span>
              <span className="text-[15px] font-medium">{next.subcourseData?.name}</span>
            </span>
            <span className="tabular mt-0.5 block text-sm text-ink/65">
              {formatLongDate(next.date)} · {next.start}–{next.end} · {next.room}
              {beforeTerm &&
                ` · terminen börjar ${relativeDays(daysUntil(schedule.termStart))}`}
            </span>
          </p>

          {target?.available && (
            <button
              type="button"
              className="btn-primary w-full shrink-0 sm:w-auto"
              onClick={() =>
                startStudying({ target, exam: next, navigate, onSelectCourse })
              }
            >
              {STUDY_LABEL}
            </button>
          )}
        </div>
      )}

      <div className="border-t border-line p-4 sm:p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 className="font-display text-lg">
            {beforeTerm ? "Terminens första vecka" : "Den här veckan"}
          </h2>
          <span className="tabular text-sm text-ink/65">
            {formatRange(days[0].date, days[days.length - 1].date)} ·{" "}
            {total === 0 ? "inget inbokat" : `${total} pass`}
          </span>
        </div>

        {/* Sju kompakta dagar i stället för sju rader. */}
        <div className="mt-3 grid grid-cols-7 gap-1">
          {days.map((day) => {
            const selected = day.date === open.date;
            return (
              <button
                key={day.date}
                type="button"
                onClick={() => setOpenDate(day.date)}
                aria-pressed={selected}
                aria-label={`${weekdayLong(day.date)} ${formatDayMonth(day.date)}, ${
                  day.sessions.length === 0
                    ? "inget inbokat"
                    : `${day.sessions.length} pass`
                }${day.isToday ? ", idag" : ""}`}
                className={`rounded-lg border px-1 py-2 text-center transition-colors duration-150 ${
                  selected
                    ? "border-pine bg-pine text-paper"
                    : "border-line bg-white hover:border-pine hover:bg-pine/[0.06] active:bg-pine/[0.12]"
                }`}
              >
                <span
                  className={`block text-[11px] uppercase ${
                    selected ? "text-paper/80" : day.isToday ? "text-brass" : "text-ink/65"
                  }`}
                >
                  {day.isToday ? "idag" : weekdayShort(day.date)}
                </span>
                <span className="tabular block text-[15px] font-medium">
                  {day.date.slice(8).replace(/^0/, "")}
                </span>
                <span className="mt-1 flex h-1.5 items-center justify-center gap-0.5">
                  {day.sessions.length === 0 ? (
                    <span
                      aria-hidden="true"
                      className={`h-px w-2 ${selected ? "bg-paper/50" : "bg-line"}`}
                    />
                  ) : (
                    day.sessions.slice(0, 3).map((session, i) => (
                      <span
                        key={i}
                        aria-hidden="true"
                        className="h-1.5 w-1.5 rounded-full"
                        style={{
                          backgroundColor:
                            session.kind === "tenta"
                              ? "var(--wrong)"
                              : selected
                                ? "var(--paper)"
                                : `var(${byId[session.subcourse]?.color})`,
                        }}
                      />
                    ))
                  )}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-3 border-t border-line pt-3">
          <p className="text-sm font-medium">
            {weekdayLong(open.date)} {formatDayMonth(open.date)}
            {open.isToday && <span className="text-brass"> · idag</span>}
          </p>
          {open.sessions.length === 0 ? (
            <p className="mt-1 text-[15px] text-ink/65">Inget inbokat.</p>
          ) : (
            <ul className="mt-1 space-y-1.5">
              {open.sessions.map((session, index) => {
                const subcourse = byId[session.subcourse];
                const exam = session.kind === "tenta";
                return (
                  <li key={`${session.date}-${session.time}-${index}`}>
                    <span
                      className={`block text-[15px] ${exam ? "font-medium text-wrong" : ""}`}
                    >
                      <span className="tabular text-ink/65">{session.time}</span>{" "}
                      {session.title}
                    </span>
                    <span className="flex flex-wrap items-center gap-x-2 text-sm text-ink/65">
                      <span
                        aria-hidden="true"
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: `var(${subcourse?.color})` }}
                      />
                      <span>{subcourse?.short}</span>
                      <span>· {session.place}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <button
          type="button"
          className="btn-quiet mt-3 -ml-2"
          onClick={() => navigate("schema")}
        >
          Hela pluggkalendern →
        </button>
      </div>
    </section>
  );
}
