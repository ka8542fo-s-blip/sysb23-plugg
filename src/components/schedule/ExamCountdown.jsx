import { useState } from "react";
import CourseDot from "./CourseDot.jsx";
import { formatSwedish, relativeDays } from "../../lib/dates.js";

function ExamRow({ exam, readiness }) {
  return (
    <li
      className={`flex flex-wrap items-center justify-between gap-x-4 gap-y-1 p-4 ${
        exam.past ? "opacity-60" : ""
      }`}
    >
      <span className="min-w-0">
        <CourseDot
          subcourse={exam.subcourseData}
          label={exam.subcourseData?.name}
          className="font-medium"
        />
        <span className="mt-0.5 block text-sm text-ink/65">
          {formatSwedish(exam.date)} · {exam.start}–{exam.end} · {exam.room || "sal okänd"}
        </span>
        {readiness && (
          <span className="mt-0.5 block text-sm text-ink/65">{readiness}</span>
        )}
      </span>
      <span className="tabular shrink-0 text-sm">
        {exam.past ? (
          <span className="text-correct">✓ avklarad</span>
        ) : (
          <span className="text-ink/70">{relativeDays(exam.days)}</span>
        )}
      </span>
    </li>
  );
}

export default function ExamCountdown({
  schedule,
  exams,
  next,
  termState,
  daysToTerm,
  readinessFor,
}) {
  const [showRetakes, setShowRetakes] = useState(false);
  const ordinary = exams.filter((exam) => exam.type === "ordinarie");
  const retakes = exams.filter((exam) => exam.type === "omtenta");
  const readiness = next ? readinessFor(next) : null;

  return (
    <section className="space-y-4">
      {termState === "before" && (
        <p className="text-[15px] text-ink/70">
          Terminen börjar om <span className="tabular font-medium">{daysToTerm}</span>{" "}
          dagar — {formatSwedish(schedule.termStart)}.
        </p>
      )}

      {next ? (
        <div
          className="card overflow-hidden p-5 sm:p-6"
          style={{ borderLeft: `4px solid var(${next.subcourseData?.color})` }}
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-brass">
            Nästa examination · {next.type}
          </p>
          <h2 className="mt-1 font-display text-2xl">{next.subcourseData?.name}</h2>

          <p className="mt-4 flex items-baseline gap-3">
            <span className="tabular font-display text-5xl text-pine">{next.days}</span>
            <span className="text-[17px] text-ink/70">
              {next.days === 0
                ? "— det är idag"
                : next.days === 1
                  ? "dag kvar"
                  : "dagar kvar"}
            </span>
          </p>

          <dl className="mt-4 grid gap-x-6 gap-y-2 text-[15px] sm:grid-cols-2">
            <div className="flex gap-2">
              <dt className="text-ink/65">När:</dt>
              <dd>
                {formatSwedish(next.date)}, {next.start}–{next.end}
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-ink/65">Var:</dt>
              <dd>{next.room || "okänd sal"}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-ink/65">Lärare:</dt>
              <dd>{next.subcourseData?.teacher || "okänd"}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-ink/65">Omfattning:</dt>
              <dd className="tabular">{next.subcourseData?.hp} hp</dd>
            </div>
          </dl>

          {next.note && <p className="mt-3 text-sm text-ink/65">{next.note}</p>}

          <p className="mt-4 border-t border-line pt-4 text-[15px]">
            {readiness?.sentence}
            {readiness?.pacing && (
              <span className="mt-1 block text-ink/70">{readiness.pacing}</span>
            )}
          </p>
        </div>
      ) : (
        <div className="card p-5">
          <h2 className="font-display text-xl">Alla examinationer är avklarade</h2>
          <p className="mt-2 text-[15px] text-ink/70">
            Terminens sista tillfälle passerade {formatSwedish(exams[exams.length - 1].date)}.
          </p>
        </div>
      )}

      <div>
        <h3 className="font-display text-lg">Ordinarie tentor</h3>
        <ul className="card mt-2 divide-y divide-line">
          {ordinary.map((exam) => (
            <ExamRow
              key={exam.id}
              exam={exam}
              readiness={readinessFor(exam)?.short}
            />
          ))}
        </ul>
      </div>

      <div>
        <button
          type="button"
          className="btn-secondary"
          aria-expanded={showRetakes}
          onClick={() => setShowRetakes(!showRetakes)}
        >
          {showRetakes ? "Dölj omtentor" : "Visa omtentor"}
        </button>
        {showRetakes && (
          <ul className="card mt-2 divide-y divide-line">
            {retakes.map((exam) => (
              <ExamRow key={exam.id} exam={exam} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
