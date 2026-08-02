import { useMemo, useState } from "react";
import CourseDot from "./CourseDot.jsx";
import { sessionsByWeek, subcoursesById } from "../../lib/scheduleInfo.js";
import { formatShort, formatRange, isPast, today } from "../../lib/dates.js";

export default function SessionList({ schedule, defaultForwardOnly }) {
  const byId = useMemo(() => subcoursesById(schedule), [schedule]);
  const [topics, setTopics] = useState([]);
  const [onlyExams, setOnlyExams] = useState(false);
  const [forwardOnly, setForwardOnly] = useState(defaultForwardOnly);

  const filtered = useMemo(() => {
    const now = today();
    return schedule.sessions.filter((session) => {
      if (topics.length > 0 && !topics.includes(session.subcourse)) return false;
      if (onlyExams && session.kind !== "tenta") return false;
      if (forwardOnly && (session.dateEnd || session.date) < now) return false;
      return true;
    });
  }, [schedule, topics, onlyExams, forwardOnly]);

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
      <h2 className="font-display text-xl">Kalender</h2>
      <p className="mt-1 text-[15px] text-ink/70">
        {schedule.sessions.length} bokade pass vid avläsningen. Delkurserna i november
        har färre pass inlagda än de sannolikt får.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTopics([])}
          aria-pressed={topics.length === 0}
          className={`chip ${topics.length === 0 ? "chip-on" : ""}`}
        >
          Alla delkurser
        </button>
        {schedule.subcourses.map((subcourse) => {
          const on = topics.includes(subcourse.id);
          return (
            <button
              key={subcourse.id}
              type="button"
              onClick={() => toggleTopic(subcourse.id)}
              aria-pressed={on}
              className={`chip ${on ? "chip-on" : ""}`}
            >
              <CourseDot subcourse={subcourse} />
            </button>
          );
        })}
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setOnlyExams(!onlyExams)}
          aria-pressed={onlyExams}
          className={`chip ${onlyExams ? "chip-on" : ""}`}
        >
          Bara tentor
        </button>
        <button
          type="button"
          onClick={() => setForwardOnly(!forwardOnly)}
          aria-pressed={forwardOnly}
          className={`chip ${forwardOnly ? "chip-on" : ""}`}
        >
          Bara framåt
        </button>
        <span className="tabular self-center text-sm text-ink/65">
          {filtered.length} pass
        </span>
      </div>

      {groups.length === 0 ? (
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
                  <span className="ml-2 text-sm font-normal text-ink/65">
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
