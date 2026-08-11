import { Fragment, useMemo, useState } from "react";
import CourseDot from "./CourseDot.jsx";
import { addDays, formatSwedish, monthName, weekNumber } from "../../lib/dates.js";

// Månadsvyn av pluggkalendern, i Google Kalender-anda: hela veckor i ett
// sammanhängande rutnät med hårlinjer, passen synliga direkt i cellerna
// som färgade chips (fyllt rött = tenta), angränsande månaders dagar
// nedtonade men fullt fungerande, veckonummer i vänsterkanten på desktop.
// På mobil är cellerna kompakta med prickar — detaljpanelen under
// rutnätet bär detaljerna där. Vald dag markeras med fylld pine-cirkel
// på dagnumret (fylld pine = valt tillstånd), idag med mässing.

const WEEKDAYS = [
  ["må", "mån"],
  ["ti", "tis"],
  ["on", "ons"],
  ["to", "tors"],
  ["fr", "fre"],
  ["lö", "lör"],
  ["sö", "sön"],
];

const monthOf = (iso) => iso.slice(0, 7);
const firstOf = (month) => `${month}-01`;

function lastOf(month) {
  const [year, m] = month.split("-").map(Number);
  return `${month}-${String(new Date(Date.UTC(year, m, 0)).getUTCDate()).padStart(2, "0")}`;
}

// måndag = 0 … söndag = 6
function mondayIndex(iso) {
  return (new Date(`${iso}T00:00:00Z`).getUTCDay() + 6) % 7;
}

function addMonths(month, delta) {
  const [year, m] = month.split("-").map(Number);
  return new Date(Date.UTC(year, m - 1 + delta, 1)).toISOString().slice(0, 7);
}

function SessionChip({ session, subcourse }) {
  const exam = session.kind === "tenta";
  return (
    <span
      className="block min-w-0 truncate rounded px-1 py-0.5 text-xs leading-snug"
      style={
        exam
          ? { backgroundColor: "var(--wrong)", color: "var(--paper)" }
          : {
              backgroundColor: `color-mix(in srgb, var(${subcourse?.color}) 15%, white)`,
              borderLeft: `3px solid var(${subcourse?.color})`,
            }
      }
      title={`${session.time} ${session.title}`}
    >
      <span className="tabular">{session.time.slice(0, 5)}</span> {session.title}
    </span>
  );
}

export default function MonthCalendar({ sessions, byId, now, termStart, termEnd }) {
  const firstMonth = monthOf(termStart);
  const lastMonth = monthOf(termEnd);
  const clampMonth = (month) =>
    month < firstMonth ? firstMonth : month > lastMonth ? lastMonth : month;
  const homeMonth = clampMonth(monthOf(now));

  const [month, setMonth] = useState(homeMonth);
  const [picked, setPicked] = useState(null);

  // Hela veckor: från måndagen i månadens första vecka till söndagen i
  // den sista. Angränsande månaders dagar visas nedtonade, som i Google.
  const weeks = useMemo(() => {
    const start = addDays(firstOf(month), -mondayIndex(firstOf(month)));
    const end = lastOf(month);
    const result = [];
    for (let monday = start; monday <= end; monday = addDays(monday, 7)) {
      result.push({
        monday,
        days: Array.from({ length: 7 }, (_, i) => {
          const date = addDays(monday, i);
          return {
            date,
            inMonth: monthOf(date) === month,
            isToday: date === now,
            sessions: sessions.filter(
              (session) =>
                session.date <= date && (session.dateEnd || session.date) >= date,
            ),
          };
        }),
      });
    }
    return result;
  }, [month, sessions, now]);

  const gridDays = weeks.flatMap((week) => week.days);

  // Öppen dag: senast klickad om den syns i rutnätet, annars idag om
  // något händer då, annars månadens första dag med pass.
  const inMonth = gridDays.filter((day) => day.inMonth);
  const openDate = gridDays.some((day) => day.date === picked)
    ? picked
    : (
        inMonth.find((day) => day.isToday && day.sessions.length > 0) ||
        inMonth.find((day) => day.sessions.length > 0) ||
        inMonth.find((day) => day.isToday)
      )?.date || null;
  const open = gridDays.find((day) => day.date === openDate) || null;

  return (
    <div className="card mt-3 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          className="btn-quiet disabled:opacity-40"
          disabled={month === firstMonth}
          onClick={() => setMonth(addMonths(month, -1))}
        >
          ← föregående
        </button>
        <div className="flex items-center gap-3">
          <h3 className="font-display text-xl sm:text-2xl">
            {monthName(firstOf(month))} {month.slice(0, 4)}
          </h3>
          {month !== homeMonth && (
            <button
              type="button"
              className="btn-secondary px-3 py-1 text-sm"
              onClick={() => {
                setMonth(homeMonth);
                setPicked(now);
              }}
            >
              idag
            </button>
          )}
        </div>
        <button
          type="button"
          className="btn-quiet disabled:opacity-40"
          disabled={month === lastMonth}
          onClick={() => setMonth(addMonths(month, 1))}
        >
          nästa →
        </button>
      </div>

      <div className="mt-3 overflow-hidden rounded-xl border border-line bg-line">
        <div className="grid grid-cols-7 gap-px sm:grid-cols-[2.75rem_repeat(7,minmax(0,1fr))]">
          <span aria-hidden="true" className="hidden bg-paper sm:block" />
          {WEEKDAYS.map(([short, long]) => (
            <span
              key={short}
              aria-hidden="true"
              className="bg-paper py-1.5 text-center text-[11px] uppercase tracking-wide text-ink/65"
            >
              <span className="sm:hidden">{short}</span>
              <span className="hidden sm:inline">{long}</span>
            </span>
          ))}

          {weeks.map((week) => (
            <Fragment key={week.monday}>
              <span
                aria-hidden="true"
                className="tabular hidden items-start justify-center bg-paper pt-2 text-xs text-ink/50 sm:flex"
              >
                v.{weekNumber(week.monday)}
              </span>
              {week.days.map((day) => {
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
                    className={`flex min-h-[3.25rem] min-w-0 flex-col items-stretch bg-white px-1 py-1 text-left transition-colors duration-150 hover:bg-pine/[0.06] active:bg-pine/[0.12] sm:min-h-[6.5rem] sm:px-1.5 sm:py-1.5 ${
                      day.inMonth ? "" : "opacity-45"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span
                        className={`tabular flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[13px] font-medium sm:text-sm ${
                          selected
                            ? "bg-pine text-paper"
                            : day.isToday
                              ? "text-brass"
                              : ""
                        }`}
                      >
                        {Number(day.date.slice(8))}
                      </span>
                      {day.isToday && (
                        <span className="hidden text-[10px] uppercase tracking-wide text-brass sm:inline">
                          idag
                        </span>
                      )}
                    </span>

                    {/* Mobil: prickar. Desktop: chips med tid och titel. */}
                    <span className="mt-1 flex h-2 items-center gap-0.5 sm:hidden">
                      {day.sessions.slice(0, 3).map((session, i) => (
                        <span
                          key={i}
                          aria-hidden="true"
                          className="h-2 w-2 rounded-full"
                          style={{
                            backgroundColor:
                              session.kind === "tenta"
                                ? "var(--wrong)"
                                : `var(${byId[session.subcourse]?.color})`,
                          }}
                        />
                      ))}
                    </span>
                    <span className="mt-1 hidden min-w-0 flex-col gap-0.5 sm:flex">
                      {day.sessions.slice(0, 3).map((session, i) => (
                        <SessionChip
                          key={i}
                          session={session}
                          subcourse={byId[session.subcourse]}
                        />
                      ))}
                      {day.sessions.length > 3 && (
                        <span className="px-1 text-xs text-ink/65">
                          +{day.sessions.length - 3} till
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </Fragment>
          ))}
        </div>
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
