import { useState } from "react";
import { COLUMNS, MEMORY_ID, ROWS } from "../../data/arkitektur/zachman.js";
import { gradeMemory, MEMORY_FIELDS } from "../../lib/zachman.js";
import { useDrafts } from "../../lib/useDrafts.js";

// Memorera Zachmans rutnät: radernas och kolumnernas namn ur minnet. Används
// i fliken Zachman och i Öva under modul 4 (Verksamhetsarkitektur). Svaren
// sparas i sysb23:svar:zachman-minne (useDrafts), klar i
// sysb23:modell:zachman-minne; Nollställ tar bort båda.

const EMPTY_MEMORY = { answers: {}, checked: false };

export default function ZachmanMemory({ drafts, done, onSolve, onReset }) {
  const draft = drafts.get(MEMORY_ID, EMPTY_MEMORY);
  const answers = draft.answers || {};
  const result = draft.checked ? gradeMemory(answers) : null;
  const [showKey, setShowKey] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  function setAnswer(code, value) {
    drafts.set(MEMORY_ID, { ...draft, answers: { ...answers, [code]: value }, checked: false });
  }
  function check() {
    const graded = gradeMemory(answers);
    drafts.set(MEMORY_ID, { ...draft, checked: true });
    if (graded.done) onSolve(MEMORY_ID, "solved");
  }
  function reset() {
    onReset(MEMORY_ID);
    drafts.clear(MEMORY_ID);
    setShowKey(false);
    setConfirmReset(false);
  }
  const hasInput = MEMORY_FIELDS.some((code) => (answers[code] || "").trim());

  const field = (code, label) => {
    const state = result ? (result.fields[code] ? "ratt" : "fel") : null;
    return (
      <label key={code} className="block">
        <span className="text-[12px] font-medium text-ink/65">{label}</span>
        <input
          type="text"
          value={answers[code] || ""}
          onChange={(event) => setAnswer(code, event.target.value)}
          autoComplete="off"
          spellCheck={false}
          aria-invalid={state === "fel" ? "true" : undefined}
          className={`mt-0.5 w-full rounded-md border bg-surface px-2 py-1.5 text-[14px] ${state === "ratt" ? "border-correct" : state === "fel" ? "border-wrong" : "border-line"}`}
        />
        {state && (
          <span className={`mt-0.5 block text-[12px] ${state === "ratt" ? "text-correct" : "text-wrong"}`}>
            {state === "ratt" ? "Rätt" : "Fel"}
          </span>
        )}
        {showKey && <span className="mt-0.5 block text-[12px] text-ink/70">{keyText(code)}</span>}
      </label>
    );
  };

  return (
    <div className="space-y-5">
      <p className="max-w-reading text-[15px] text-ink/80">
        Skriv kolumnernas frågeord och radernas namn eller perspektiv, som förra årets tentor
        krävde i uppgift 1. Svenska eller engelska namn går bra, och både namnen från 2003 och
        från version 3.0 godtas. Det du skriver sparas.
      </p>
      <section className="card p-4 sm:p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display text-lg">Rutnätet utan namn</h2>
          <p className="text-sm text-ink/65">
            {done && <span className="mr-2 text-correct">✓ Klar</span>}
            {result && `${result.correct} av ${result.total} rätt`}
          </p>
        </div>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-[11px] font-medium uppercase tracking-[0.14em] text-brass">Kolumner (frågeord)</h3>
            <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {COLUMNS.map((col) => field(col.code, col.code))}
            </div>
          </div>
          <div>
            <h3 className="text-[11px] font-medium uppercase tracking-[0.14em] text-brass">Rader (namn eller perspektiv)</h3>
            <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {ROWS.map((row) => field(row.code, row.code))}
            </div>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="button" className="btn-primary" onClick={check} disabled={!hasInput}>
            Rätta
          </button>
          <button type="button" className="btn-secondary" onClick={() => setShowKey(!showKey)} aria-expanded={showKey}>
            {showKey ? "Dölj facit" : "Visa facit"}
          </button>
          {(hasInput || done) && !confirmReset && (
            <button type="button" className="btn-quiet text-sm" onClick={() => setConfirmReset(true)}>
              Nollställ
            </button>
          )}
          {confirmReset && (
            <span className="flex gap-2 text-sm">
              <button type="button" className="btn-secondary" onClick={reset}>Ja, nollställ</button>
              <button type="button" className="btn-quiet" onClick={() => setConfirmReset(false)}>Avbryt</button>
            </span>
          )}
        </div>
      </section>
    </div>
  );
}

function keyText(code) {
  const col = COLUMNS.find((c) => c.code === code);
  if (col) return `${col.sv} · ${col.en} / ${col.poster}`;
  const row = ROWS.find((r) => r.code === code);
  return `${row.name}${row.perspective ? ` — ${row.perspective}` : ""}`;
}

// Memorera som eget block under modul 4:s frågor i Öva, med egen rubrik och
// samma lagring som i fliken Zachman.
export function ZachmanMemoryBlock({ modelProgress, onSolve, onReset }) {
  const drafts = useDrafts();
  return (
    <section aria-label="Memorera Zachmans rutnät" className="space-y-3">
      <h2 className="font-display text-xl">Memorera Zachmans rutnät</h2>
      <ZachmanMemory drafts={drafts} done={Boolean(modelProgress[MEMORY_ID])} onSolve={onSolve} onReset={onReset} />
    </section>
  );
}
