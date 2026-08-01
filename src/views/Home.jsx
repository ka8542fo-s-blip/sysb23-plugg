import { useMemo } from "react";
import { overallStats, topicStats, focusTopic } from "../lib/progress.js";

export default function Home({
  course,
  courses,
  courseId,
  onSelectCourse,
  answers,
  exams,
  navigate,
}) {
  const overall = useMemo(() => overallStats(course, answers), [course, answers]);
  const perTopic = useMemo(() => topicStats(course, answers), [course, answers]);
  const focus = useMemo(() => focusTopic(perTopic), [perTopic]);
  const latestExam = exams.find((exam) => exam.courseId === course.id);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="font-display text-3xl sm:text-4xl">Plugga inför tentan</h1>
        <p className="mt-3 max-w-reading text-[17px] leading-relaxed text-ink/80">
          Öva flervalsfrågor med förklaringar till varje alternativ, simulera
          tentans poängsystem med minuspoäng, och träna essäsvar mot en checklista.
          Allt innehåll kommer ur kurslitteraturen och gamla tentor.
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
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
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
          <Shortcut
            title="Läs begreppen"
            hint="Sammanfattningar och tentafällor"
            onClick={() => navigate("begrepp")}
          />
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl">Delkurser</h2>
        <ul className="mt-3 space-y-2">
          {courses.map((item) => {
            const isActive = item.status === "aktiv";
            const selected = item.id === courseId;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  disabled={!isActive}
                  onClick={() => onSelectCourse(item.id)}
                  aria-current={selected ? "true" : undefined}
                  className={`flex items-center justify-between gap-3 p-4 ${
                    isActive
                      ? `card-action ${selected ? "border-pine bg-pine/[0.04]" : ""}`
                      : "card w-full cursor-not-allowed text-left opacity-45"
                  }`}
                >
                  <span>
                    <span className="block font-medium">{item.name}</span>
                    <span className="text-sm text-ink/65">
                      {isActive
                        ? `${item.questions.length} frågor · ${item.topics.length} ämnen · ${item.essays.length} essäfrågor`
                        : "Kommer under terminen"}
                    </span>
                  </span>
                  {selected && isActive && (
                    <span className="chip chip-on shrink-0 text-xs">Vald</span>
                  )}
                </button>
              </li>
            );
          })}
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
