import { useMemo } from "react";
import { overallStats, topicStats, focusTopic } from "../lib/progress.js";
import NextExamBar from "../components/schedule/NextExamBar.jsx";

export default function Home({
  course,
  courses,
  answers,
  exams,
  readChapters = {},
  navigate,
}) {
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
      <NextExamBar onOpen={() => navigate("schema")} />

      <section>
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-brass">
          SYSB23 · Delkurs
        </p>
        <h1 className="mt-1 font-display text-3xl sm:text-4xl">{course.name}</h1>
        <p className="mt-3 max-w-reading text-[17px] leading-relaxed text-ink/80">
          Öva flervalsfrågor med förklaringar till varje alternativ, simulera
          tentans poängsystem med minuspoäng, och träna essäsvar mot en checklista.
          Allt innehåll kommer ur kurslitteraturen och gamla tentor.
        </p>
        <p className="tabular mt-2 text-[15px] text-ink/65">
          {course.questions.length} frågor · {course.topics.length} ämnen ·{" "}
          {course.essays.length} essäfrågor
        </p>
      </section>

      <section className="card p-5 sm:p-6">
        <h2 className="font-display text-xl">Var står du?</h2>
        <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Besvarade frågor" value={overall.answered} />
          <Stat
            label="Träffsäkerhet"
            value={overall.accuracy === null ? "—" : `${overall.accuracy} %`}
          />
          <Stat
            label="Frågor du sett"
            value={`${overall.uniqueSeen}/${overall.total}`}
          />
          <Stat
            label="Senaste prov"
            value={latestExam ? `${latestExam.grade}` : "—"}
          />
        </dl>
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
        {/* Ordningen speglar arbetsgången: läs → öva → prova. */}
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Shortcut
            title="Läs kompendiet"
            hint={readingHint}
            onClick={() => navigate("las", { segment: "kompendium" })}
          />
          <Shortcut
            title="Öva frågor"
            hint="En fråga i taget med facit"
            onClick={() => navigate("ova")}
          />
          <Shortcut
            title="Gör ett prov"
            hint="10 frågor med tentans poäng"
            onClick={() => navigate("prov")}
          />
        </div>
      </section>

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

      <section className="card border-brass/40 p-5">
        <h2 className="font-display text-lg">Så räknas tentan</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-ink/80">
          10 flervalsfrågor à 6 p, där ett felaktigt svar ger −1 p och en obesvarad
          fråga 0 p, plus 2 essäfrågor à 20 p utan minuspoäng. Max 100 p.
          Betygsgränserna går vid 50, 55, 65, 75 och 85 procent. Att hoppa över en
          fråga du inte kan är alltså värt en poäng — träna på det i Prov-läget.
        </p>
      </section>
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

function Stat({ label, value }) {
  return (
    <div>
      <dt className="text-sm text-ink/65">{label}</dt>
      <dd className="tabular font-display text-2xl text-ink">{value}</dd>
    </div>
  );
}
