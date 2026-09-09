import { useMemo, useState } from "react";
import CourseDot from "./CourseDot.jsx";
import MonthCalendar from "./MonthCalendar.jsx";
import SegmentedControl from "../SegmentedControl.jsx";
import { sessionsByWeek, subcoursesById } from "../../lib/scheduleInfo.js";
import { formatShort, formatRange, isPast, today } from "../../lib/dates.js";
import { load, save, KEYS } from "../../lib/storage.js";

export default function SessionList({ schedule, defaultForwardOnly, now: nowProp }) {
  const byId = useMemo(() => subcoursesById(schedule), [schedule]);
  const [topics, setTopics] = useState([]);
  const [onlyExams, setOnlyExams] = useState(false);
  const [forwardOnly, setForwardOnly] = useState(defaultForwardOnly);
  // Lista eller månadskalender — filtren ovanför gäller båda. Valet sparas.
  const [view, setView] = useState(() =>
    load(KEYS.scheduleView, "lista") === "kalender" ? "kalender" : "lista",
  );
  function changeView(id) {
    setView(id);
    save(KEYS.scheduleView, id);
  }

  const filtered = useMemo(() => {
    const now = nowProp || today();
    return schedule.sessions.filter((session) => {
      if (topics.length > 0 && !topics.includes(session.subcourse)) return false;
      if (onlyExams && session.kind !== "tenta") return false;
      if (forwardOnly && (session.dateEnd || session.date) < now) return false;
      return true;
    });
  }, [schedule, topics, onlyExams, forwardOnly, nowProp]);

  const groups = useMemo(
    () => sessionsByWeek(filtered, schedule),
    [filtered, schedule],
  );

  function toggleTopic(id) {
    setTopics((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  return (
    <section>
      {/* Rubrik och räknare på samma rad; verktygsraden under samlar
          visning, delkursfilter och de två växlarna i en enda list, så att
          filtren läses som ett verktyg och inte som tre lösa rader. */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="font-display text-xl">Alla pass</h2>
        <p className="tabular text-sm text-ink/65" aria-live="polite">
          {filtered.length === schedule.sessions.length
            ? `${schedule.sessions.length} pass`
            : `${filtered.length} av ${schedule.sessions.length} pass`}
        </p>
      </div>

      <div className="mt-3 flex flex-col gap-2 rounded-card border border-line bg-white p-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="w-full sm:w-auto">
            <SegmentedControl
              label="Visning av passen"
              value={view}
              onChange={changeView}
              compact
              segments={[
                { id: "lista", label: "Lista" },
                { id: "kalender", label: "Kalender" },
              ]}
            />
          </div>
          <div role="group" aria-label="Urval" className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setOnlyExams(!onlyExams)}
              aria-pressed={onlyExams}
              className={`chip chip-sm ${onlyExams ? "chip-on" : ""}`}
            >
              Bara tentor
            </button>
            <button
              type="button"
              onClick={() => setForwardOnly(!forwardOnly)}
              aria-pressed={forwardOnly}
              className={`chip chip-sm ${forwardOnly ? "chip-on" : ""}`}
            >
              Bara framåt
            </button>
          </div>
        </div>
        {/* Delkurserna på egen rad: rullar på mobil, radbryter på desktop —
            inget filter göms. */}
        <div
          role="group"
          aria-label="Delkurs"
          className="no-scrollbar flex items-center gap-1.5 overflow-x-auto sm:flex-wrap sm:overflow-visible"
        >
          <button
            type="button"
            onClick={() => setTopics([])}
            aria-pressed={topics.length === 0}
            className={`chip chip-sm shrink-0 ${topics.length === 0 ? "chip-on" : ""}`}
          >
            Alla
          </button>
          {schedule.subcourses.map((subcourse) => {
            const on = topics.includes(subcourse.id);
            return (
              <button
                key={subcourse.id}
                type="button"
                onClick={() => toggleTopic(subcourse.id)}
                aria-pressed={on}
                className={`chip chip-sm shrink-0 ${on ? "chip-on" : ""}`}
              >
                <CourseDot subcourse={subcourse} />
              </button>
            );
          })}
        </div>
      </div>

      {view === "kalender" ? (
        <MonthCalendar
          sessions={filtered}
          byId={byId}
          now={nowProp || today()}
          termStart={schedule.termStart}
          termEnd={schedule.termEnd}
        />
      ) : groups.length === 0 ? (
        <p className="card mt-3 p-5 text-[15px] text-ink/70">
          Inga pass matchar filtret.
        </p>
      ) : (
        <div className="mt-3 space-y-4">
          {groups.map((group) => (
            <div key={group.key}>
              <h3 className="tabular font-display text-lg">
                v.{group.week}
                {group.from && (
                  <span className="ml-3 font-sans text-[15px] font-normal text-ink/80">
                    {formatRange(group.from, group.to)}
                  </span>
                )}
              </h3>
              <ul className="card mt-2 divide-y divide-line">
                {group.sessions.map((session, index) => {
                  const subcourse = byId[session.subcourse];
                  const exam = session.kind === "tenta";
                  const passed = isPast(session.dateEnd || session.date);
                  return (
                    <li
                      key={`${session.date}-${session.time}-${index}`}
                      className={`flex flex-wrap gap-x-4 gap-y-1 p-4 ${
                        exam ? "bg-wrong-bg" : ""
                      } ${passed ? "opacity-60" : ""}`}
                      style={{
                        borderLeft: `3px solid var(${subcourse?.color})`,
                      }}
                    >
                      <span className="tabular w-28 shrink-0 text-sm">
                        {session.dateEnd
                          ? formatRange(session.date, session.dateEnd)
                          : formatShort(session.date)}
                        <span className="block text-ink/65">{session.time}</span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px]">{session.title}</span>
                        <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink/65">
                          <CourseDot subcourse={subcourse} />
                          <span>{session.place}</span>
                          {session.kind === "obligatorisk" && (
                            <span className="chip border-brass py-0 text-xs text-brass">
                              Obligatorisk
                            </span>
                          )}
                          {exam && (
                            <span className="chip border-wrong py-0 text-xs text-wrong">
                              Tenta
                            </span>
                          )}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
