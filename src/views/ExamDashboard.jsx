import { useMemo } from "react";
import { TROLIGT_NOTE } from "../data/arkitektur/cards.js";
import { schedule } from "../data/schedule.js";
import { daysUntil, formatFullDate } from "../lib/dates.js";
import { levelStats, moduleStatus, weakPoints } from "../lib/levels.js";
import { useToday } from "../lib/useToday.js";

// Fliken Tentan (Verksamhetsarkitektur): läget inför tentan. Allt läses ur
// samma lagring som Öva (answers), Essä (essayState) och Zachman
// (modelProgress); vyn sparar inget eget. Länkarna öppnar rätt ställe när
// man klickar. Ingen automatisk nästa-steg-knapp.

// UF:s ord i kursinformationen (Canvas), ordagrant.
const FORMAT_QUOTE =
  "Tentamen kommer att se likadan ut som dessa moduler med Sant/Falskt frågor, multiple-choice frågor samt någondera essäfråga (fritextfrågor).";
const FORMAT_QUOTE_2 =
  "Det kan komma frågor på tentamen som överensstämmer med de frågorna som finns i modulerna, men det kan också tillkomma andra av liknande art kopplade också till litteraturen.";

const pct = ({ done, total }) => (total ? Math.round((done / total) * 100) : 0);

export default function ExamDashboard({ course, answers, essayState, modelProgress, readChapters, navigate }) {
  const now = useToday();
  const exam = schedule.exams.find((item) => item.subcourse === course.id && item.type === "ordinarie");
  const days = exam ? daysUntil(exam.date, now) : null;
  const levels = useMemo(
    () => levelStats(course, { answers, essayState, modelProgress, troligtTaskIds: course.levels?.troligtTaskIds ?? [] }),
    [course, answers, essayState, modelProgress],
  );
  const modules = useMemo(() => moduleStatus(course, { answers, essayState, readChapters }), [course, answers, essayState, readChapters]);
  const weak = useMemo(() => weakPoints(course, answers), [course, answers]);
  const has = (view) => (course.views || []).includes(view);

  return (
    <div className="space-y-6">
      <section className="card p-5 sm:p-6">
        <h1 className="font-display text-2xl">Tentan</h1>
        {exam && (
          <p className="mt-2 text-[17px]">
            <span className="tabular font-display text-3xl text-pine">{days > 0 ? days : 0}</span>{" "}
            {days === 1 ? "dag kvar" : days === 0 ? "— tentan är idag" : days < 0 ? "— tentan har varit" : "dagar kvar"}
            <span className="block text-[15px] text-ink/70">
              {formatFullDate(exam.date)} · {exam.start}–{exam.end} · {exam.room}
            </span>
          </p>
        )}
        <figure className="mt-4 border-l-[3px] border-pine pl-4">
          <blockquote className="text-[16px] leading-relaxed">“{FORMAT_QUOTE}”</blockquote>
          <blockquote className="mt-2 text-[15px] leading-relaxed text-ink/80">“{FORMAT_QUOTE_2}”</blockquote>
          <figcaption className="mt-1 text-sm text-ink/65">UF, kursinformationen</figcaption>
        </figure>
      </section>

      <section className="card space-y-4 p-5 sm:p-6" aria-label="Hur mycket som är klart">
        <h2 className="font-display text-xl">Hur långt du har kommit</h2>
        <LevelBar level={levels.karna} big note="Det UF har sagt att tentan bygger på: modulerna." />
        <div className="grid gap-4 sm:grid-cols-2">
          <LevelBar level={levels.troligt} note={TROLIGT_NOTE} />
          <LevelBar level={levels.fordjupning} note="Utanför UF:s tips." />
        </div>
      </section>

      <section className="card p-5 sm:p-6">
        <h2 className="font-display text-xl">Modulerna</h2>
        <p className="mt-1 text-sm text-ink/70">
          En modul är klar när dess Öva-frågor är klara och dess essäfrågor är genomgångna.
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-[15px]">
            <thead>
              <tr className="text-left text-ink/70">
                <th className="border-b border-line py-2 pr-3 font-medium">Modul</th>
                <th className="border-b border-line py-2 pr-3 font-medium">Läst</th>
                <th className="border-b border-line py-2 pr-3 font-medium">Öva (klara/totalt)</th>
                <th className="border-b border-line py-2 font-medium">Essä (genomgångna/totalt)</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((row) => (
                <tr key={row.chapterId} className="align-top">
                  <td className="border-b border-line py-2 pr-3">
                    <span className="tabular font-medium">{row.number}</span> {row.title}
                    {row.complete && <span className="ml-2 text-correct">✓ Klar</span>}
                  </td>
                  <td className="border-b border-line py-2 pr-3">
                    <CellLink onClick={() => navigate("las", { segment: "kompendium", chapterId: row.chapterId })}>
                      {row.read ? "✓ Läst" : "Oläst"}
                    </CellLink>
                  </td>
                  <td className="tabular border-b border-line py-2 pr-3">
                    {has("ova") ? (
                      <CellLink onClick={() => navigate("ova", { topics: [row.chapterId], nonce: Date.now() })}>
                        {row.ova.done}/{row.ova.total}
                      </CellLink>
                    ) : (
                      `${row.ova.done}/${row.ova.total}`
                    )}
                  </td>
                  <td className="tabular border-b border-line py-2">
                    {row.essa.total > 0 && has("essa") ? (
                      <CellLink onClick={() => navigate("essa", { essayId: row.firstOpenEssay })}>
                        {row.essa.done}/{row.essa.total}
                      </CellLink>
                    ) : (
                      `${row.essa.done}/${row.essa.total}`
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card p-5 sm:p-6">
        <h2 className="font-display text-xl">Svaga punkter</h2>
        <p className="mt-1 text-sm text-ink/70">Frågor där ditt senaste svar var fel, per modul.</p>
        {weak.length === 0 ? (
          <p className="mt-3 text-[15px] text-ink/80">Inga just nu.</p>
        ) : (
          <div className="mt-3 space-y-4">
            {weak.map((group) => (
              <div key={group.chapterId}>
                <h3 className="text-[15px] font-medium">
                  <span className="tabular">{group.number}</span> {group.title}
                </h3>
                <ul className="mt-1 space-y-1">
                  {group.items.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        className="text-left text-[15px] text-pine underline-offset-4 hover:underline"
                        onClick={() =>
                          item.bank === "fordjupning"
                            ? navigate("fordjupning", { part: "docx", questionId: item.id })
                            : navigate("ova", { questionId: item.id, scope: "alla" })
                        }
                      >
                        {item.question}
                      </button>
                      {item.bank === "fordjupning" && <span className="ml-2 text-sm text-ink/65">Fördjupning</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      <p className="text-sm text-ink/70">
        Troligt är en slutsats från UF:s tidigare tentor, inte något UF har sagt om årets tenta.
      </p>
    </div>
  );
}

function CellLink({ onClick, children }) {
  return (
    <button type="button" onClick={onClick} className="text-pine underline-offset-4 hover:underline">
      {children}
    </button>
  );
}

function LevelBar({ level, big = false, note }) {
  const percent = pct(level);
  return (
    <div className={big ? "rounded-lg border border-pine/40 p-4" : "rounded-lg border border-line p-3"}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className={big ? "font-display text-xl" : "font-display text-lg"}>{level.label}</span>
        <span className={`tabular ${big ? "text-lg" : "text-[15px]"} text-ink/80`}>{percent} %</span>
      </div>
      <p className="text-sm text-ink/70">{note}</p>
      <div
        className={`mt-2 overflow-hidden rounded-full bg-line ${big ? "h-4" : "h-2"}`}
        role="progressbar"
        aria-label={level.label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <div className="h-full bg-pine" style={{ width: `${percent}%` }} />
      </div>
      <ul className="mt-2 space-y-0.5 text-sm text-ink/75">
        {level.parts.map((p) => (
          <li key={p.label} className="tabular">
            {p.label}: {p.done}/{p.total}
          </li>
        ))}
      </ul>
    </div>
  );
}
