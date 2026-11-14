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
import { useToday } from "../lib/useToday.js";
import { practiceMode } from "../lib/practiceAxis.js";
import { levelStats } from "../lib/levels.js";
import ModuleProgressTable from "../components/ModuleProgressTable.jsx";
import { emptyMockState, examParts, mockExamResult } from "../lib/mockExam.js";
import { choiceExamKey, load } from "../lib/storage.js";

export default function Stats({
  course,
  answers,
  exams,
  readChapters = {},
  sqlProgress = {},
  essayState = {},
  modelProgress = {},
  onReset,
  navigate,
}) {
  const [confirming, setConfirming] = useState(false);
  const now = useToday();
  // Databaser grupperar Öva per kapitel; texterna följer med.
  const byChapter = practiceMode(course) === "chapter";
  // Ämnen utan frågor (t.ex. Databaser-kapitel som väntar på frågor) hålls utanför.
  const perTopic = useMemo(
    () => topicStats(course, answers).filter((topic) => topic.questionCount > 0),
    [course, answers],
  );
  const overall = useMemo(() => overallStats(course, answers), [course, answers]);
  // Verksamhetsarkitektur (course.levels): modulerna, Zachman utöver modul 4
  // och Fördjupning var för sig, ur samma lagring som Öva, Essä och Zachman.
  const levels = useMemo(
    () =>
      course.levels
        ? levelStats(course, { answers, essayState, modelProgress, troligtTaskIds: course.levels.troligtTaskIds })
        : null,
    [course, answers, essayState, modelProgress],
  );
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
  }, [course, readCount, chapters.length, overall.correct, overall.wrong, now]);

  function reset() {
    clearAll();
    onReset();
    setConfirming(false);
  }

  const resetCard = (
        <section className="card border-wrong/30 p-5">
          <h2 className="font-display text-lg">Nollställ min data</h2>
          <p className="mt-2 text-[15px] text-ink/70">
            Raderar svarshistorik, provresultat, essäutkast, läsprogress, bockar
            och svar i SQL, Java, Modellera och BPMN-övningar, tentaanmälningar,
            valt läge i Läs och övriga inställningar från den här webbläsaren.
            Går inte att ångra.
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
  );

  // Verksamhetsarkitektur (Kaspers omgörning 2026-11-14): bara resultat per
  // modul (Öva-frågor och förklarakort) och provtentornas resultat, plus
  // Nollställ min data. Kortet med nivåerna visas inte längre.
  if ((course.mockExams || []).length > 0) {
    return (
      <div className="space-y-8">
        <section>
          <h1 className="font-display text-2xl">Statistik</h1>
          <p className="mt-1 max-w-reading text-[15px] text-ink/70">
            Öva-frågor och förklarakort per modul, och provtentornas resultat. En fråga eller ett
            förklarakort är klart när du har svarat rätt två gånger i rad.
          </p>
        </section>
        <section className="card p-5 sm:p-6" aria-label="Per modul">
          <h2 className="font-display text-xl">Per modul</h2>
          <div className="mt-3">
            <ModuleProgressTable course={course} answers={answers} navigate={navigate} />
          </div>
        </section>
        <MockExamResults course={course} navigate={navigate} />
        {resetCard}
      </div>
    );
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
                label="Klara frågor"
                value={`${overall.done}/${overall.total}`}
                tip="klaraFragor"
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

      {levels && (
        <section className="card p-5 sm:p-6" aria-label="Hur långt du har kommit">
          <h2 className="font-display text-xl">Hur långt du har kommit</h2>
          <p className="mt-1 text-sm text-ink/70">
            En Öva-fråga är klar efter två rätt i rad. En essäfråga räknas när du har tryckt på
            ”Markera som genomgången”.
          </p>
          <dl className="mt-4 grid gap-4 sm:grid-cols-3">
            {[levels.karna, levels.troligt, levels.fordjupning].map((level) => (
              <div key={level.key} className="rounded-lg border border-line p-3">
                <dt className="font-display text-lg">{level.label}</dt>
                <dd className="mt-0.5 text-sm text-ink/70">{level.note}</dd>
                <dd className="tabular mt-1 text-[15px]">
                  {level.done}/{level.total} · {level.total ? Math.round((level.done / level.total) * 100) : 0} %
                  <ul className="mt-1 space-y-0.5 text-sm text-ink/75">
                    {level.parts.map((p) => (
                      <li key={p.label}>
                        {p.label}: {p.done}/{p.total}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

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
              <span className="font-medium">{focus.name}</span> är ditt svagaste{" "}
              {byChapter ? "kapitel" : "ämne"} med{" "}
              <span className="tabular">{focus.accuracy} %</span> rätt på{" "}
              <span className="tabular">{focus.answered}</span> svar. Läs
              tentafällorna under Läs → Begrepp och kör ett övningspass med bara{" "}
              {byChapter ? "det kapitlet" : "det ämnet"} valt.
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
          Träffsäkerhet per {byChapter ? "kapitel" : "ämne"} <InfoTip id="traffsakerhetAmne" />
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

      {course.views?.includes("prov") && (
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
                  {exam.points}/{exam.max ?? MAX_EXAM_POINTS} p · {exam.percent} % ·{" "}
                  <span className="font-display text-lg text-pine">{exam.grade}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
      )}

      {resetCard}
    </div>
  );
}

// Provtentornas resultat (Verksamhetsarkitektur), ur samma lagring som
// fliken Tenta (sysb23:tenta:<id>).
function MockExamResults({ course, navigate }) {
  const order = (course.chapters || []).map((chapter) => chapter.id);
  return (
    <section className="card p-5 sm:p-6" aria-label="Provtentorna">
      <h2 className="font-display text-xl">Provtentorna</h2>
      <ul className="mt-3 space-y-3">
        {course.mockExams.map((exam) => {
          const saved = load(choiceExamKey(exam.id), null);
          const state = saved && typeof saved === "object" ? { ...emptyMockState(), ...saved } : emptyMockState();
          const result = mockExamResult(exam, state, order);
          return (
            <li key={exam.id} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-3 last:border-0">
              <span className="font-medium">{exam.title}</span>
              <span className="tabular text-[15px] text-ink/80">
                {result.submitted
                  ? `Uppgift 2: ${result.tasks[2].right} av ${result.tasks[2].total} rätt · Uppgift 3: ${result.tasks[3].right} av ${result.tasks[3].total} rätt · Fritext: ${result.tasks[1].checked} av ${result.tasks[1].total} punkter`
                  : result.answered > 0
                    ? `Pågår · ${result.answered} av ${examParts(exam).length} besvarade`
                    : "Inte påbörjad"}
              </span>
            </li>
          );
        })}
      </ul>
      {navigate && (
        <button type="button" className="btn-secondary mt-4" onClick={() => navigate("tenta")}>
          Till provtentorna
        </button>
      )}
    </section>
  );
}
