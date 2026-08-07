import { useMemo } from "react";
import { overallStats, topicStats, focusTopic } from "../lib/progress.js";
import WeekAtAGlance from "../components/schedule/WeekAtAGlance.jsx";
import StatTile from "../components/StatTile.jsx";

export default function Home({
  course,
  courses,
  answers,
  exams,
  readChapters = {},
  sqlProgress = {},
  navigate,
  onSelectCourse,
}) {
  const views = course.views || [];
  const sqlExercises = course.sqlExercises || [];
  const sqlSolved = sqlExercises.filter((item) => sqlProgress[item.id]).length;
  const chapters = course.chapters || [];
  const readCount = chapters.filter((chapter) => readChapters[chapter.id]).length;
  const minutesLeft = chapters
    .filter((chapter) => !readChapters[chapter.id])
    .reduce((sum, chapter) => sum + (chapter.readingMinutes || 0), 0);
  const readingHint =
    chapters.length === 0
      ? "Kapiteltexten är inte inlagd ännu"
      : `${readCount} av ${chapters.length} kapitel · ca ${minutesLeft} min kvar`;

  const overall = useMemo(() => overallStats(course, answers), [course, answers]);
  const perTopic = useMemo(() => topicStats(course, answers), [course, answers]);
  const focus = useMemo(() => focusTopic(perTopic), [perTopic]);
  const latestExam = exams.find((exam) => exam.courseId === course.id);

  return (
    <div className="space-y-8">
      <WeekAtAGlance navigate={navigate} onSelectCourse={onSelectCourse} />

      <section>
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-brass">
          SYSB23 · Delkurs
        </p>
        <h1 className="mt-1 font-display text-3xl sm:text-4xl">{course.name}</h1>
        <p className="mt-3 max-w-reading text-[17px] leading-relaxed text-ink/80">
          {views.includes("sql")
            ? "Läs kompendiet om designprocessen, relationsmodellen och normalisering, och skriv riktig SQL mot kursens sjukhusdatabas med automatisk rättning."
            : "Öva flervalsfrågor med förklaringar till varje alternativ, simulera tentans poängsystem med minuspoäng, och träna essäsvar mot en checklista. Allt innehåll kommer ur kurslitteraturen och gamla tentor."}
        </p>
        <p className="tabular mt-2 text-[15px] text-ink/65">
          {[
            course.chapters.length > 0 && `${course.chapters.length} kapitel`,
            course.questions.length > 0 && `${course.questions.length} frågor`,
            course.topics.length > 0 && `${course.topics.length} ämnen`,
            course.essays.length > 0 && `${course.essays.length} essäfrågor`,
            sqlExercises.length > 0 && `${sqlExercises.length} SQL-övningar`,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </section>

      <section className="card p-5 sm:p-6">
        <h2 className="font-display text-xl">Var står du?</h2>
        <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {sqlExercises.length > 0 ? (
            <>
              <StatTile
                label="Lösta övningar"
                value={`${sqlSolved}/${sqlExercises.length}`}
                tip="sqlLosta"
              />
              <StatTile
                label="Med hjälp"
                value={
                  sqlExercises.filter(
                    (item) => sqlProgress[item.id] === "solved-with-help",
                  ).length
                }
              />
            </>
          ) : (
            <>
              <StatTile label="Besvarade frågor" value={overall.answered} tip="svar" />
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
              <StatTile
                label="Senaste prov"
                value={latestExam ? `${latestExam.grade}` : "—"}
                tip="senasteProv"
              />
            </>
          )}
        </dl>
        {course.questions.length > 0 && (
        <p className="mt-4 text-[15px] text-ink/70">
          {focus ? (
            <>
              Svagaste ämnet just nu:{" "}
              <span className="font-medium text-ink">{focus.name}</span> (
              <span className="tabular">{focus.accuracy} %</span> rätt).
            </>
          ) : (
            "Svara på minst fem frågor i ett ämne så pekar sidan ut vad du bör fokusera på."
          )}
        </p>
        )}
        {/* Genvägarna byggs ur delkursens lägen, i manifestets ordning. */}
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {views.includes("las") && (
            <Shortcut
              title="Läs kompendiet"
              hint={readingHint}
              onClick={() => navigate("las", { segment: "kompendium" })}
            />
          )}
          {views.includes("sql") && (
            <Shortcut
              title="SQL-verkstad"
              hint={`${sqlSolved} av ${sqlExercises.length} övningar lösta`}
              onClick={() => navigate("sql")}
            />
          )}
          {views.includes("ova") && (
            <Shortcut
              title="Öva frågor"
              hint="En fråga i taget med facit"
              onClick={() => navigate("ova")}
            />
          )}
          {views.includes("prov") && (
            <Shortcut
              title="Gör ett prov"
              hint="10 frågor med tentans poäng"
              onClick={() => navigate("prov")}
            />
          )}
        </div>
      </section>

      <div
        className={
          course.questions.length > 0
            ? "grid gap-8 lg:grid-cols-2 lg:items-start"
            : ""
        }
      >
      <section>
        <h2 className="font-display text-xl">Övriga delkurser</h2>
        <p className="mt-1 text-[15px] text-ink/65">
          Du byter delkurs i väljaren högst upp på sidan.
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {courses
            .filter((item) => item.id !== course.id)
            .map((item) => (
              <li key={item.id}>
                <span className="chip text-ink/65">
                  {item.name}
                  <span className="ml-2 text-xs text-ink/65">
                    {item.status === "aktiv" ? "klar att öva" : "kommer under terminen"}
                  </span>
                </span>
              </li>
            ))}
        </ul>
      </section>

      {course.questions.length > 0 && (
      <section className="card border-brass/40 p-5">
        <h2 className="font-display text-lg">Så räknas tentan</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-ink/80">
          10 flervalsfrågor à 6 p, där ett felaktigt svar ger −1 p och en obesvarad
          fråga 0 p, plus 2 essäfrågor à 20 p utan minuspoäng. Max 100 p.
          Betygsgränserna går vid 50, 55, 65, 75 och 85 procent. Att hoppa över en
          fråga du inte kan är alltså värt en poäng — träna på det i Prov-läget.
        </p>
      </section>
      )}
      </div>
    </div>
  );
}

// Genvägar är navigering, inte val — därför ingen fylld yta som kan
// förväxlas med "vald".
function Shortcut({ title, hint, onClick }) {
  return (
    <button type="button" onClick={onClick} className="card-action group p-4">
      <span className="flex items-center justify-between gap-2">
        <span className="font-medium text-pine">{title}</span>
        <span
          aria-hidden="true"
          className="text-pine transition-transform duration-150 group-hover:translate-x-0.5"
        >
          →
        </span>
      </span>
      <span className="mt-0.5 block text-sm text-ink/65">{hint}</span>
    </button>
  );
}

