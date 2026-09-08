import { useEffect, useState } from "react";
import { statementExercises } from "../data/databaser/statementExercises.js";
import { Diagram } from "../components/knowledge/diagrams/index.jsx";
import { scoreStatements, MAX_POINTS } from "../lib/statementScore.js";

// Tentans uppgift 1: ett diagram, tio påståenden, markera alla sanna.
// Rättas som helhet med tentans poängregel och per påstående med skäl.
// Klar när markeringen är exakt rätt; framsteg som i Modellera.
export default function Statements({ modelProgress, onSolve, onReset }) {
  const items = statementExercises;
  const [currentId, setCurrentId] = useState(() => items.find((e) => !modelProgress[e.id])?.id || items[0].id);
  const [marks, setMarks] = useState({});
  const [result, setResult] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const item = items.find((e) => e.id === currentId) || items[0];
  const marked = marks[item.id] ?? [];
  const solvedCount = items.filter((e) => modelProgress[e.id]).length;

  useEffect(() => { setResult(null); setConfirmReset(false); }, [currentId]);

  function toggle(i) {
    if (result) return;
    setMarks((prev) => {
      const cur = prev[item.id] ?? [];
      return { ...prev, [item.id]: cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i] };
    });
  }
  function grade() {
    const outcome = scoreStatements(item.statements, marked);
    setResult(outcome);
    if (outcome.status === "correct") onSolve(item.id, "solved");
  }
  function again() { setResult(null); setMarks((prev) => ({ ...prev, [item.id]: [] })); }

  const OUTCOME = {
    hit: ["Sant, markerat: +5", "text-correct"],
    "false-alarm": ["Falskt, markerat: −3", "text-wrong"],
    miss: ["Sant, inte markerat: 0 — men det fattades", "text-wrong"],
    "correct-blank": ["Falskt, inte markerat: 0", "text-correct"],
  };

  return (
    <div className="lg:flex lg:gap-8">
      <div className="lg:order-2 lg:min-w-0 lg:flex-1">
        <section className="card p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm text-ink/65">
              Uppgift {item.number} · {item.source}
              {modelProgress[item.id] && <span className="ml-2 text-correct">✓ Klar</span>}
            </p>
            {modelProgress[item.id] && !confirmReset && (
              <button type="button" className="btn-quiet text-sm" onClick={() => setConfirmReset(true)}>Nollställ uppgiften</button>
            )}
            {confirmReset && (
              <span className="flex gap-2 text-sm">
                <button type="button" className="btn-secondary" onClick={() => { onReset(item.id); setConfirmReset(false); }}>Ja, nollställ</button>
                <button type="button" className="btn-quiet" onClick={() => setConfirmReset(false)}>Avbryt</button>
              </span>
            )}
          </div>
          <h2 className="mt-1 font-display text-xl">{item.title}</h2>
          <p className="mt-2 max-w-reading text-[15px] leading-relaxed text-ink/80">
            Markera samtliga påståenden som är korrekta utifrån diagrammet. +5 poäng för varje korrekt
            påstående du markerar, −3 för varje felaktigt, 0 för omarkerat. Alla och endast de korrekta ger {MAX_POINTS} poäng.
          </p>

          <Diagram id={item.diagram} />

          <ul className="mt-4 space-y-2" aria-label="Påståenden">
            {item.statements.map((st, i) => {
              const row = result?.rows[i];
              const tone = row ? (row.outcome === "hit" || row.outcome === "correct-blank" ? "border-correct/40 bg-correct-bg" : "border-wrong/40 bg-wrong-bg") : marked.includes(i) ? "border-pine bg-pine/[0.08]" : "border-line hover:border-pine hover:bg-pine/[0.06]";
              return (
                <li key={st.text}>
                  <label className={`flex cursor-pointer gap-3 rounded-lg border px-3 py-2 text-[15px] transition-colors duration-150 ${tone}`}>
                    <input type="checkbox" checked={marked.includes(i)} onChange={() => toggle(i)} disabled={Boolean(result)} className="mt-1 h-4 w-4 shrink-0 accent-pine" />
                    <span className="min-w-0">
                      <span className="tabular mr-2 text-ink/65">{i + 1}.</span>{st.text}
                      {row && (
                        <span className="mt-1 block text-sm">
                          <span className={`font-medium ${OUTCOME[row.outcome][1]}`}>{OUTCOME[row.outcome][0]}.</span>{" "}
                          <span className="text-ink/80">{st.why}</span>
                        </span>
                      )}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {!result ? (
              <button type="button" className="btn-primary" onClick={grade}>Rätta</button>
            ) : (
              <button type="button" className="btn-secondary" onClick={again}>Försök igen</button>
            )}
            <span className="tabular text-sm text-ink/65">{marked.length} markerade</span>
          </div>

          {result && (
            <div className={`mt-4 rounded-lg border-l-2 p-4 ${result.status === "correct" ? "border-correct bg-correct-bg" : "border-wrong bg-wrong-bg"}`} role="status">
              <p className="font-display text-lg">
                {result.status === "correct" ? "Rätt." : result.status === "blank" ? "Inget markerat." : "Delvis rätt."}
                <span className="tabular ml-2 font-body text-base">{result.points} av {MAX_POINTS} poäng</span>
              </p>
              <p className="mt-1 text-[15px] text-ink/80">
                {result.exact
                  ? "Alla och endast de sanna påståendena markerade."
                  : `${result.hits} rätt markerade (+${result.hits * 5}), ${result.falseAlarms} fel markerade (−${result.falseAlarms * 3}), ${result.misses} sanna omarkerade (0).${result.raw < 0 ? " Summan under noll räknas som 0." : ""}`}
              </p>
            </div>
          )}
        </section>
      </div>

      <div className="mt-6 lg:order-1 lg:mt-0 lg:w-80 lg:shrink-0">
        <nav aria-label="Uppgifter" className="card p-4">
          <h3 className="font-display text-[15px]">Uppgifter</h3>
          <p className="tabular mt-1 text-sm text-ink/65">{solvedCount} av {items.length} klara</p>
          <ul className="mt-2 space-y-1">
            {items.map((e) => {
              const active = e.id === currentId;
              return (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => setCurrentId(e.id)}
                    aria-current={active ? "true" : undefined}
                    className={`flex w-full items-baseline gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors duration-150 ${active ? "border-pine bg-pine/[0.08] text-pine" : "border-transparent hover:border-pine hover:bg-pine/[0.06]"}`}
                  >
                    <span className="tabular w-6 shrink-0 text-ink/65">{e.number}</span>
                    <span className="min-w-0 flex-1 truncate">{e.title}</span>
                    {modelProgress[e.id] && <span className="shrink-0 text-correct" title="Klar">✓<span className="sr-only"> Klar</span></span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
