import { useState } from "react";
import CourseDot from "./CourseDot.jsx";
import { formatLongDate, formatSwedish, relativeDays } from "../../lib/dates.js";

// Anmälningsläget för en kommande examination. Passerade tentor har
// inget läge alls — raden tonas ned och anmälan är inte längre relevant.
function regState(exam, registrations) {
  if (registrations[exam.id]) return "registered";
  return exam.regDays >= 0 ? "open" : "passed";
}

function RegistrationNote({ exam, state }) {
  if (state === "registered") {
    return (
      <span className="mt-0.5 block text-sm text-ink/65">
        <span className="text-correct">✓</span> Anmäld i Ladok
      </span>
    );
  }
  if (state === "open") {
    return (
      <span className="mt-0.5 block text-sm text-ink/65">
        Anmälan i Ladok: senast omkring {formatLongDate(exam.regDate)},{" "}
        {relativeDays(exam.regDays)}.
      </span>
    );
  }
  // Passerad deadline på okryssad, kommande tenta — neutralt, inte larm.
  return (
    <span className="mt-0.5 block text-sm text-ink/65">
      Anmälningstiden kan ha gått ut — kontrollera i Ladok.
    </span>
  );
}

function RegistrationCheckbox({ exam, registered, onToggle, className = "" }) {
  return (
    <label
      className={`flex w-fit cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-sm transition-colors duration-150 hover:bg-pine/[0.06] hover:text-pine ${className}`}
    >
      <input
        type="checkbox"
        checked={registered}
        onChange={(event) => onToggle(exam.id, event.target.checked)}
        className="h-4 w-4 accent-pine"
      />
      Anmäld
    </label>
  );
}

function ExamRow({ exam, readiness, target, label, onStudy, registrations, onToggleRegistration }) {
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
        {!exam.past && <RegistrationNote exam={exam} state={regState(exam, registrations)} />}
        {readiness && (
          <span className="mt-0.5 block text-sm text-ink/65">{readiness}</span>
        )}
      </span>
      <span className="flex shrink-0 items-center gap-3">
        {!exam.past && (
          <RegistrationCheckbox
            exam={exam}
            registered={Boolean(registrations[exam.id])}
            onToggle={onToggleRegistration}
          />
        )}
        <span className="tabular text-sm">
          {exam.past ? (
            <span className="text-correct">✓ avklarad</span>
          ) : (
            <span className="text-ink/70">{relativeDays(exam.days)}</span>
          )}
        </span>
        {target?.available && (
          <button
            type="button"
            className="btn-secondary px-3 py-1.5 text-sm"
            title={`${label} — ${target.courseName}`}
            onClick={() => onStudy(exam)}
          >
            {label}
          </button>
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
  studyTargetFor,
  studyLabel,
  onStudy,
  registrations,
  onToggleRegistration,
}) {
  const [showRetakes, setShowRetakes] = useState(false);
  const ordinary = exams.filter((exam) => exam.type === "ordinarie");
  const retakes = exams.filter((exam) => exam.type === "omtenta");
  const readiness = next ? readinessFor(next) : null;
  const nextTarget = next ? studyTargetFor(next) : null;
  // Anmälningsdeadlinen framhävs så länge den ligger närmare i tiden än
  // tentan (dvs. tills den passerats eller kryssats av) — därefter tentan.
  const nextReg = next ? regState(next, registrations) : null;
  const regFocus = nextReg === "open";

  return (
    <section className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6">
      {termState === "before" && (
        <p className="text-[15px] text-ink/70 lg:col-span-2">
          Terminen börjar om <span className="tabular font-medium">{daysToTerm}</span>{" "}
          dagar — {formatSwedish(schedule.termStart)}.
        </p>
      )}

      {next ? (
        <div
          className="card overflow-hidden p-5 sm:p-6 lg:row-span-2"
          style={{ borderLeft: `4px solid var(${next.subcourseData?.color})` }}
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-brass">
            Nästa examination · {next.type}
          </p>
          <h2 className="mt-1 font-display text-2xl">{next.subcourseData?.name}</h2>

          {regFocus ? (
            <>
              <p className="mt-4 flex items-baseline gap-3">
                <span className="tabular font-display text-5xl text-pine">
                  {next.regDays}
                </span>
                <span className="text-[17px] text-ink/70">
                  {next.regDays === 0
                    ? "— omkring sista dagen att anmäla sig"
                    : next.regDays === 1
                      ? "dag kvar att anmäla sig"
                      : "dagar kvar att anmäla sig"}
                </span>
              </p>
              <p className="mt-2 text-[15px]">
                Anmälan i Ladok: senast omkring {formatLongDate(next.regDate)},{" "}
                {relativeDays(next.regDays)}. Den exakta gränsen står i Ladok.
              </p>
              <p className="mt-1 text-[15px] text-ink/70">
                Tentan skrivs {formatSwedish(next.date)}, {relativeDays(next.days)}.
              </p>
            </>
          ) : (
            <>
              <p className="mt-4 flex items-baseline gap-3">
                <span className="tabular font-display text-5xl text-pine">
                  {next.days}
                </span>
                <span className="text-[17px] text-ink/70">
                  {next.days === 0
                    ? "— det är idag"
                    : next.days === 1
                      ? "dag kvar"
                      : "dagar kvar"}
                </span>
              </p>
              {nextReg === "registered" ? (
                <p className="mt-2 text-[15px]">
                  <span className="text-correct">✓</span> Anmäld i Ladok
                </p>
              ) : (
                <p className="mt-2 text-[15px] text-ink/65">
                  Anmälningstiden kan ha gått ut — kontrollera i Ladok.
                </p>
              )}
            </>
          )}

          <RegistrationCheckbox
            exam={next}
            registered={Boolean(registrations[next.id])}
            onToggle={onToggleRegistration}
            className="-ml-2 mt-2"
          />

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

          <div className="mt-4 border-t border-line pt-4">
            <p className="text-[15px]">
              {readiness?.sentence}
              {readiness?.pacing && (
                <span className="mt-1 block text-ink/70">{readiness.pacing}</span>
              )}
            </p>
            {nextTarget?.available && (
              <div className="mt-4">
                <button type="button" className="btn-primary" onClick={() => onStudy(next)}>
                  {studyLabel}
                </button>
                <p className="mt-1 text-sm text-ink/65">{nextTarget.courseName}</p>
              </div>
            )}
          </div>
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
              target={studyTargetFor(exam)}
              label={studyLabel}
              onStudy={onStudy}
              registrations={registrations}
              onToggleRegistration={onToggleRegistration}
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
              <ExamRow
                key={exam.id}
                exam={exam}
                target={studyTargetFor(exam)}
                label={studyLabel}
                onStudy={onStudy}
                registrations={registrations}
                onToggleRegistration={onToggleRegistration}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
