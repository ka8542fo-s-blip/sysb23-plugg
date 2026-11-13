import { useState } from "react";

// Visar förklaringen för det valda alternativet plus en utfällbar genomgång
// av övriga alternativ när banken har en förklaring per alternativ
// (Strategi). Banker med en förklaring per fråga (Databaser) visar den en
// gång, utan genomgång.
// `accepted` (valfri) är alla rätta index när flera alternativ är rätta;
// `note` är en anmärkning om själva frågan (t.ex. ett fel på tentan);
// `skippedLabel` ersätter "Överhoppad" (fliken Tenta: "Obesvarad, 0 p").
export default function ExplanationPanel({ options, chosen, correct, accepted, source, explanation, note, skippedLabel }) {
  const [open, setOpen] = useState(false);
  const right = accepted ?? [correct];
  const wasCorrect = right.includes(chosen);
  const skipped = chosen === null || chosen === undefined;
  const shown = skipped ? correct : chosen;
  const perOption = options.some((option) => option.explain);
  const others = options
    .map((option, index) => ({ ...option, index }))
    .filter((option) => option.index !== shown);

  return (
    <div className="mt-5 border-t border-line pt-4">
      <p
        className={`font-display text-lg ${wasCorrect ? "text-correct" : "text-wrong"}`}
        role="status"
      >
        {chosen === null || chosen === undefined
          ? `${skippedLabel ?? "Överhoppad"} — så här ligger det till:`
          : wasCorrect
            ? "Rätt."
            : "Fel — så här ligger det till:"}
      </p>

      <p className="mt-2 text-[15px] leading-relaxed">
        {perOption ? options[shown].explain : explanation}
      </p>

      {!wasCorrect && !skipped && (
        <p className="mt-3 rounded-lg bg-correct-bg p-3 text-[15px] leading-relaxed">
          <span className="font-medium text-correct">Rätt svar: </span>
          {options[correct].text}
          {perOption && ` — ${options[correct].explain}`}
        </p>
      )}

      {perOption && (
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="btn-quiet mt-3 px-0"
      >
        {open ? "Dölj de andra alternativen" : "Varför är de andra fel?"}
      </button>
      )}

      {perOption && open && (
        <ul className="mt-2 space-y-2">
          {others.map((option) => (
            <li
              key={option.index}
              className="rounded-lg border border-line p-3 text-[14px] leading-relaxed"
            >
              <span
                className={
                  option.index === correct
                    ? "font-medium text-correct"
                    : "font-medium text-ink/70"
                }
              >
                {option.text}
              </span>
              <span className="block text-ink/80">{option.explain}</span>
            </li>
          ))}
        </ul>
      )}

      {note && (
        <p className="mt-3 text-sm leading-relaxed text-ink/70">
          <span className="font-medium text-ink/80">Om frågan: </span>
          {note}
        </p>
      )}

      {source && (
        <p className="mt-4 text-sm text-ink/65">
          Källa: <span className="text-ink/70">{source}</span>
        </p>
      )}
    </div>
  );
}
