import { useMemo, useState } from "react";
import StatBar from "../components/StatBar.jsx";
import { overallStats, topicStats, focusTopic } from "../lib/progress.js";
import { clearAll } from "../lib/storage.js";
import { MAX_EXAM_POINTS } from "../lib/scoring.js";

export default function Stats({ course, answers, exams, onReset, navigate }) {
  const [confirming, setConfirming] = useState(false);
  const perTopic = useMemo(() => topicStats(course, answers), [course, answers]);
  const overall = useMemo(() => overallStats(course, answers), [course, answers]);
  const focus = useMemo(() => focusTopic(perTopic), [perTopic]);
  const courseExams = exams.filter((exam) => exam.courseId === course.id);

  function reset() {
    clearAll();
    onReset();
    setConfirming(false);
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="font-display text-2xl">Statistik</h1>
        <p className="tabular mt-1 text-[15px] text-ink/70">
          {overall.answered} svar totalt ·{" "}
          {overall.accuracy === null ? "—" : `${overall.accuracy} % rätt`} ·{" "}
          {overall.uniqueSeen} av {overall.total} frågor sedda
        </p>
      </section>

      <section className="card p-5 sm:p-6">
        <h2 className="font-display text-xl">Fokusera här</h2>
        {focus ? (
          <>
            <p className="mt-2 text-[15px] leading-relaxed">
              <span className="font-medium">{focus.name}</span> är ditt svagaste
              ämne med <span className="tabular">{focus.accuracy} %</span> rätt på{" "}
              <span className="tabular">{focus.answered}</span> svar. Läs
              tentafällorna under Begrepp och kör ett övningspass med bara det
              ämnet valt.
            </p>
            <button
              type="button"
              className="btn-secondary mt-4"
              onClick={() => navigate("begrepp")}
            >
              Till begreppen
            </button>
          </>
        ) : (
          <p className="mt-2 text-[15px] text-ink/70">
            Rekommendationen dyker upp när du svarat på minst fem frågor inom ett
            ämne. Kör ett pass under Öva så börjar mönstret synas.
          </p>
        )}
      </section>

      <section>
        <h2 className="font-display text-xl">Träffsäkerhet per ämne</h2>
        <div className="card mt-3 space-y-4 p-5">
          {perTopic.map((topic) => (
            <StatBar
              key={topic.id}
              label={topic.name}
              percent={topic.accuracy}
              answered={topic.answered}
              total={topic.questionCount}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl">Provhistorik</h2>
        {courseExams.length === 0 ? (
          <div className="card mt-3 p-5">
            <p className="text-[15px] text-ink/70">
              Du har inte gjort något prov ännu. Starta ditt första under Prov.
            </p>
            <button
              type="button"
              className="btn-primary mt-4"
              onClick={() => navigate("prov")}
            >
              Till Prov
            </button>
          </div>
        ) : (
          <ul className="card mt-3 divide-y divide-line">
            {courseExams.map((exam) => (
              <li
                key={exam.id}
                className="flex flex-wrap items-center justify-between gap-3 p-4"
              >
                <span className="text-[15px]">
                  {new Date(exam.date).toLocaleString("sv-SE", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
                <span className="tabular text-[15px] text-ink/70">
                  {exam.points}/{MAX_EXAM_POINTS} p · {exam.percent} % ·{" "}
                  <span className="font-display text-lg text-pine">{exam.grade}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card border-wrong/30 p-5">
        <h2 className="font-display text-lg">Nollställ min data</h2>
        <p className="mt-2 text-[15px] text-ink/70">
          Raderar svarshistorik, provresultat, essäutkast och inställningar från
          den här webbläsaren. Går inte att ångra.
        </p>
        {confirming ? (
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" className="btn-danger" onClick={reset}>
              Ja, radera allt
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setConfirming(false)}
            >
              Avbryt
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="btn-secondary mt-4"
            onClick={() => setConfirming(true)}
          >
            Nollställ min data
          </button>
        )}
      </section>
    </div>
  );
}
