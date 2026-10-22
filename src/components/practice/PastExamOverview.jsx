import { examLabel, partState, pointsSummary, tally } from "../../lib/pastExams.js";

// Översikten i läget Tentafrågor: ett block per tenta med datum, hur många
// som är klara och ett rutnät med tentans egna nummer. Status bärs av både
// färg och tecken (✓ ✕ •), aldrig av färg ensam.
const STATE = {
  klar: {
    label: "klar",
    tile: "border-correct/60 bg-correct-bg text-ink",
    glyph: "✓",
    glyphClass: "border-correct/60 text-correct",
  },
  fel: {
    label: "senast fel",
    tile: "border-wrong/60 bg-wrong-bg text-ink",
    glyph: "✕",
    glyphClass: "border-wrong/60 text-wrong",
  },
  "ett-ratt": {
    label: "ett rätt, väntar på sitt andra",
    tile: "border-pine text-pine",
    glyph: "•",
    glyphClass: "border-pine/60 text-pine",
  },
  obesvarad: { label: "obesvarad", tile: "border-line text-ink/75", glyph: null },
};

const LEGEND = [
  ["klar", "Klar, två rätt i rad"],
  ["ett-ratt", "Ett rätt"],
  ["fel", "Senast fel"],
  ["obesvarad", "Obesvarad"],
];

function Tile({ item, state, onPick }) {
  const s = STATE[state];
  return (
    <button
      type="button"
      onClick={() => onPick(item.id)}
      aria-label={`Fråga ${item.no}, ${item.points} p, ${s.label}`}
      className={`tabular relative inline-flex h-11 min-w-[2.75rem] items-center justify-center rounded-lg border px-2 text-sm transition-colors duration-150 hover:border-pine sm:h-10 ${s.tile}`}
    >
      {item.no}
      {s.glyph && (
        <span
          aria-hidden="true"
          className={`absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full border bg-surface text-[10px] leading-none ${s.glyphClass}`}
        >
          {s.glyph}
        </span>
      )}
    </button>
  );
}

function ExamBlock({ exam, items, answers, onPick, onEssay }) {
  const own = items.filter((item) => item.exam === exam.id);
  const t = tally(own, answers);
  const left = t.total - t.done;
  const [day, ...rest] = exam.dateLabel.split(" ");
  const allParts = exam.sections.flatMap((section) => section.parts);
  const totalPoints = allParts.reduce((sum, part) => sum + part.points, 0);
  const counted = own.reduce((sum, item) => sum + item.points, 0);
  const essays = allParts.filter((part) => part.essay);

  return (
    <li className="rounded-xl border border-line p-4 sm:p-5">
      <div className="flex items-start gap-4">
        <div className="w-12 shrink-0 text-center" aria-hidden="true">
          <div className="tabular font-display text-2xl leading-none text-pine">{day}</div>
          <div className="mt-1 text-[11px] uppercase tracking-[0.12em] text-ink/65">{rest.join(" ")}</div>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg leading-snug">
            {exam.title}
            <span className="sr-only"> {exam.dateLabel}</span>
          </h3>
          <p className="text-sm text-ink/65">
            {t.total} flervalsfrågor ·{" "}
            <span className="whitespace-nowrap">
              {counted} p av {totalPoints}
            </span>
          </p>
        </div>
        <div className="shrink-0 text-right">
          {left === 0 ? (
            <span className="text-sm font-medium text-correct">✓ Klar</span>
          ) : (
            <>
              <div className="tabular text-sm font-medium">
                {t.done}/{t.total}
              </div>
              <div className="tabular text-xs text-ink/65">{left} kvar</div>
            </>
          )}
        </div>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line" aria-hidden="true">
        <div
          className="h-full rounded-full bg-pine"
          style={{ width: `${t.total ? (t.done / t.total) * 100 : 0}%` }}
        />
      </div>

      {exam.sections
        .filter((section) => section.parts.some((part) => !part.essay))
        .map((section) => {
          const sectionItems = own.filter((item) => item.section === section.title);
          if (sectionItems.length === 0) return null;
          return (
            <div key={section.title} className="mt-4">
              <p className="text-xs text-ink/65">
                {section.title} · {pointsSummary(sectionItems)}
              </p>
              <ol className="mt-2 flex flex-wrap gap-1.5" aria-label={`${examLabel(exam)}, ${section.title}`}>
                {sectionItems.map((item) => (
                  <li key={item.id}>
                    <Tile item={item} state={partState(answers[item.id])} onPick={onPick} />
                  </li>
                ))}
              </ol>
            </div>
          );
        })}

      {essays.length > 0 && onEssay && (
        <p className="mt-4 text-sm text-ink/70">
          {essays.length === 1 ? "Essän" : "Essäerna"}{" "}
          {essays.map((part) => part.no).join(" och ")}, {pointsSummary(essays)}, skriver du i Essä.{" "}
          <button
            type="button"
            className="btn-quiet px-0 py-0 text-sm"
            onClick={() => onEssay(essays[0].essay)}
          >
            Till Essä →
          </button>
        </p>
      )}
    </li>
  );
}

export default function PastExamOverview({ exams, items, answers, onPick, onStart, onEssay }) {
  const all = tally(items, answers);
  const left = all.total - all.done;
  const allDone = all.total > 0 && left === 0;
  const terms = [...new Set(exams.map((exam) => exam.term))];
  const scope = exams.length === 1 ? examLabel(exams[0]) : terms.join(" och ");
  const breakdown = [
    [all.unseen, all.unseen === 1 ? "obesvarad" : "obesvarade"],
    [all.wrong, "senast fel"],
    [all.pending, "väntar på sitt andra rätt"],
  ]
    .filter(([count]) => count > 0)
    .map(([count, text]) => `${count} ${text}`);
  const primary = allDone
    ? "Kör igen"
    : all.unseen === all.total
      ? "Börja med tentafrågorna"
      : all.wrong > 0
        ? "Fortsätt öva, felen först"
        : "Fortsätt öva";

  return (
    <section className="card mx-auto w-full max-w-reading p-5 sm:p-7">
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-brass-text">
        Tentafrågor · {scope}
      </p>
      <h2 className="tabular mt-1 font-display text-3xl">
        {allDone ? `Alla ${all.total} klara` : `${all.done} av ${all.total} klara`}
      </h2>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-line" aria-hidden="true">
        <div
          className="h-full rounded-full bg-pine"
          style={{ width: `${all.total ? (all.done / all.total) * 100 : 0}%` }}
        />
      </div>
      <p className="mt-2 text-sm text-ink/65">
        {allDone
          ? "Två rätt i rad på varje fråga. Svarar du fel på en klar fråga blir den ofärdig igen."
          : `${left} kvar: ${breakdown.join(", ")}.`}
      </p>

      <ul className="mt-6 space-y-4">
        {exams.map((exam) => (
          <ExamBlock
            key={exam.id}
            exam={exam}
            items={items}
            answers={answers}
            onPick={onPick}
            onEssay={onEssay}
          />
        ))}
      </ul>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-ink/65" aria-label="Förklaring">
        {LEGEND.map(([state, text]) => (
          <li key={state} className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className={`relative inline-block h-4 w-5 rounded-[4px] border ${state === "obesvarad" ? "border-line-strong" : STATE[state].tile}`}
            >
              {STATE[state].glyph && (
                <span
                  className={`absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border bg-surface text-[9px] leading-none ${STATE[state].glyphClass}`}
                >
                  {STATE[state].glyph}
                </span>
              )}
            </span>
            {text}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="button" className="btn-primary w-full sm:w-auto" onClick={() => onStart(allDone)}>
          {primary}
        </button>
        <span className="text-sm text-ink/65">eller välj en fråga i rutnätet</span>
      </div>

      <p className="mt-6 border-t border-line pt-4 text-sm text-ink/65">
        Tentorna publicerades utan facit. Rätt svar och förklaringar är sajtens
        egna, och diagrammen är omritade efter tentan.
      </p>
    </section>
  );
}
