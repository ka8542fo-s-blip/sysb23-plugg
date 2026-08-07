import { useMemo, useState } from "react";
import StatBar from "../components/StatBar.jsx";
import InfoTip from "../components/InfoTip.jsx";
import StatTile from "../components/StatTile.jsx";
import { overallStats, topicStats, focusTopic } from "../lib/progress.js";
import { clearAll } from "../lib/storage.js";
import { MAX_EXAM_POINTS } from "../lib/scoring.js";
import { schedule } from "../data/schedule.js";
import { decoratedExams } from "../lib/scheduleInfo.js";
import { relativeDays } from "../lib/dates.js";
import { accuracy } from "../lib/scoring.js";

export default function Stats({
  course,
  answers,
  exams,
  readChapters = {},
  sqlProgress = {},
  onReset,
  navigate,
}) {
  const [confirming, setConfirming] = useState(false);
  const perTopic = useMemo(() => topicStats(course, answers), [course, answers]);
  const overall = useMemo(() => overallStats(course, answers), [course, answers]);
  const focus = useMemo(() => focusTopic(perTopic), [perTopic]);
  const courseExams = exams.filter((exam) => exam.courseId === course.id);
  const chapters = course.chapters || [];
  const readCount = chapters.filter((chapter) => readChapters[chapter.id]).length;
  const sqlExercises = course.sqlExercises || [];
  const sqlSolved = sqlExercises.filter((item) => sqlProgress[item.id]).length;
  const sqlWithHelp = sqlExercises.filter(
    (item) => sqlProgress[item.id] === "solved-with-help",
  ).length;

  // Tidsdimension: dagar till tenta för de delkurser som har material i appen.
  const timeline = useMemo(() => {
    return decoratedExams(schedule)
      .filter(
        (exam) => exam.type === "ordinarie" && exam.subcourseData?.contentId === course.id,
      )
      .map((exam) => ({
        exam,
        chaptersRead: readCount,
        chaptersTotal: chapters.length,
        accuracy: accuracy({ correct: overall.correct, wrong: overall.wrong }),
      }));
  }, [course, readCount, chapters.length, overall.correct, overall.wrong]);

  function reset() {
    clearAll();
    onReset();
    setConfirming(false);
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="font-display text-2xl">Statistik</h1>
        {/* Termerna får varsin ruta med ett frågetecken — i löpande text
            hamnade förklaringarna på rad utan att höra till något. */}
        <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {overall.total > 0 && (
            <>
              <StatTile label="Svar totalt" value={overall.answered} tip="svar" />
              <StatTile
                label="Träffsäkerhet"
                value={overall.accuracy === null ? "—" : `${overall.accuracy} %`}
                tip="traffsakerhet"
              />
              <StatTile
                label="Frågor du sett"
                value={`${overall.uniqueSeen}/${overall.total}`}
                tip="fragorSedda"
              />
            </>
          )}
          {chapters.length > 0 && (
            <StatTile
              label="Lästa kapitel"
              value={`${readCount}/${chapters.length}`}
              tip="lastaKapitel"
            />
          )}
          {sqlExercises.length > 0 && (
            <StatTile
              label="Lösta SQL-övningar"
              value={`${sqlSolved}/${sqlExercises.length}`}
              note={sqlWithHelp > 0 ? `${sqlWithHelp} med hjälp` : null}
              tip="sqlLosta"
            />
          )}
        </dl>
      </section>

      <div
        className={
          course.questions.length > 0
            ? "grid gap-8 lg:grid-cols-2 lg:items-start"
            : "space-y-8"
        }
      >
      {course.questions.length > 0 && (
      <section className="card p-5 sm:p-6">
        <h2 className="flex items-center gap-2 font-display text-xl">
          Fokusera här <InfoTip id="fokusera" />
        </h2>
        {focus ? (
          <>
            <p className="mt-2 text-[15px] leading-relaxed">
              <span className="font-medium">{focus.name}</span> är ditt svagaste
              ämne med <span className="tabular">{focus.accuracy} %</span> rätt på{" "}
              <span className="tabular">{focus.answered}</span> svar. Läs
              tentafällorna under Läs → Begrepp och kör ett övningspass med bara
              det ämnet valt.
            </p>
            <button
              type="button"
              className="btn-secondary mt-4"
              onClick={() => navigate("las", { segment: "begrepp" })}
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
      )}

      <section>
        <h2 className="flex items-center gap-2 font-display text-xl">
          Tid kvar per delkurs <InfoTip id="tidKvar" />
        </h2>
        <ul className="card mt-3 divide-y divide-line">
          {timeline.map((row) => (
            <li key={row.exam.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 p-4">
              <span className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: `var(${row.exam.subcourseData?.color})` }}
                />
                <span className="text-[15px]">{row.exam.subcourseData?.name}</span>
              </span>
              <span className="tabular text-sm text-ink/65">
                {row.exam.past ? "tenta avklarad" : relativeDays(row.exam.days)}
                {sqlExercises.length > 0
                  ? ` · ${sqlSolved}/${sqlExercises.length} SQL-övningar`
                  : ` · ${row.chaptersRead}/${row.chaptersTotal} kapitel · ${
                      row.accuracy === null ? "inga svar" : `${row.accuracy} % rätt`
                    }`}
              </span>
            </li>
          ))}
        </ul>
      </section>
      </div>

      {perTopic.length > 0 && (
      <section>
        <h2 className="flex items-center gap-2 font-display text-xl">
          Träffsäkerhet per ämne <InfoTip id="traffsakerhetAmne" />
        </h2>
        <div className="card mt-3 grid gap-4 p-5 lg:grid-cols-2 lg:gap-x-10">
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
      )}

      {course.questions.length > 0 && (
      <section>
        <h2 className="flex items-center gap-2 font-display text-xl">
          Provhistorik <InfoTip id="provhistorik" />
        </h2>
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
      )}

      <section className="card border-wrong/30 p-5">
        <h2 className="font-display text-lg">Nollställ min data</h2>
        <p className="mt-2 text-[15px] text-ink/70">
          Raderar svarshistorik, provresultat, essäutkast, läsprogress, lösta
          SQL-övningar, valt läge i Läs och övriga inställningar från den här
          webbläsaren. Går inte att ångra.
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
