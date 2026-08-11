import { useMemo, useState } from "react";
import CourseDot from "./CourseDot.jsx";
import { formatSwedish, monthName } from "../../lib/dates.js";

// Månadsvyn av pluggkalendern: samma filtrerade pass som listvyn, men som
// rutnät med en öppningsbar dag — samma mönster som veckoraden på Hem.
// Veckorna börjar på måndag. Flerdagarspass syns på varje täckt dag.

const WEEKDAYS = ["må", "ti", "on", "to", "fr", "lö", "sö"];

const monthOf = (iso) => iso.slice(0, 7);
const firstOf = (month) => `${month}-01`;

function daysInMonth(month) {
  const [year, m] = month.split("-").map(Number);
  return new Date(Date.UTC(year, m, 0)).getUTCDate();
}

// måndag = 0 … söndag = 6
function mondayIndex(iso) {
  return (new Date(`${iso}T00:00:00Z`).getUTCDay() + 6) % 7;
}

function addMonths(month, delta) {
  const [year, m] = month.split("-").map(Number);
  return new Date(Date.UTC(year, m - 1 + delta, 1)).toISOString().slice(0, 7);
}

export default function MonthCalendar({ sessions, byId, now, termStart, termEnd }) {
  const firstMonth = monthOf(termStart);
  const lastMonth = monthOf(termEnd);
  const clampMonth = (month) =>
    month < firstMonth ? firstMonth : month > lastMonth ? lastMonth : month;

  const [month, setMonth] = useState(() => clampMonth(monthOf(now)));
  const [picked, setPicked] = useState(null);

  const days = useMemo(() => {
    return Array.from({ length: daysInMonth(month) }, (_, i) => {
      const date = `${month}-${String(i + 1).padStart(2, "0")}`;
      const daySessions = sessions.filter(
        (session) => session.date <= date && (session.dateEnd || session.date) >= date,
      );
      return { date, sessions: daySessions, isToday: date === now };
    });
  }, [month, sessions, now]);

  // Öppen dag: senast klickad i månaden, annars idag om något händer då,
  // annars första dagen med pass — samma prioritet som veckoraden på Hem.
  const openDate =
    picked && monthOf(picked) === month
      ? picked
      : (
          days.find((day) => day.isToday && day.sessions.length > 0) ||
          days.find((day) => day.sessions.length > 0) ||
          days.find((day) => day.isToday)
        )?.date || null;
  const open = days.find((day) => day.date === openDate) || null;

  return (
    <div className="card mt-3 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          className="btn-quiet disabled:opacity-40"
          disabled={month === firstMonth}
          onClick={() => setMonth(addMonths(month, -1))}
        >
          ← föregående
        </button>
        <h3 className="font-display text-lg">
          {monthName(firstOf(month))} {month.slice(0, 4)}
        </h3>
        <button
          type="button"
          className="btn-quiet disabled:opacity-40"
          disabled={month === lastMonth}
          onClick={() => setMonth(addMonths(month, 1))}
        >
          nästa →
        </button>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((weekday) => (
          <span
            key={weekday}
            aria-hidden="true"
            className="pb-1 text-center text-[11px] uppercase text-ink/65"
          >
            {weekday}
          </span>
        ))}
        {Array.from({ length: mondayIndex(firstOf(month)) }, (_, i) => (
          <span key={`tom-${i}`} aria-hidden="true" />
        ))}
        {days.map((day) => {
          const selected = day.date === openDate;
          return (
            <button
              key={day.date}
              type="button"
              onClick={() => setPicked(day.date)}
              aria-pressed={selected}
              aria-label={`${formatSwedish(day.date)}, ${
                day.sessions.length === 0
                  ? "inget inbokat"
                  : `${day.sessions.length} pass`
              }${day.isToday ? ", idag" : ""}`}
              className={`rounded-lg border px-1 py-1.5 text-center transition-colors duration-150 ${
                selected
                  ? "border-pine bg-pine text-paper"
                  : "border-line bg-white hover:border-pine hover:bg-pine/[0.06] active:bg-pine/[0.12]"
              }`}
            >
              <span
                className={`tabular block text-[15px] ${
                  day.isToday && !selected ? "font-medium text-brass" : "font-medium"
                }`}
              >
                {day.date.slice(8).replace(/^0/, "")}
              </span>
              <span className="mt-0.5 flex h-1.5 items-center justify-center gap-0.5">
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
        {open ? (
          <>
            <p className="text-sm font-medium">
              {formatSwedish(open.date)}
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
                        <CourseDot subcourse={subcourse} />
                        <span>· {session.place}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        ) : (
          <p className="text-[15px] text-ink/65">Inga pass i den här månaden.</p>
        )}
      </div>
    </div>
  );
}
