import { useEffect, useMemo, useState } from "react";
import { tasks, correctIndex } from "../data/process/bpmnTasks.js";
import { diagramById } from "../data/process/bpmnDiagrams.js";
import { simulate } from "../lib/bpmnSim.js";
import { BpmnDiagram, ElementGallery, HIGHLIGHT } from "../components/bpmn/BpmnDiagram.jsx";

// Kör processen: tentans BPMN-körfrågor. Diagrammet ritas och körs ur samma
// data; efter svar visas simulatorns spår steg för steg och de noder som
// kördes. Poäng som på tentan (frågans poäng, −1 för fel), men inga
// sparade poäng — klar = rätt svar, som i Modellera.
const KIND_QUESTION = {
  aktiviteter: "Vilken kombination av aktiviteter inträffar om processen körs under följande förutsättningar?",
  tid: "Vid vilken tidpunkt har processen avslutats?",
};

const titleOf = (task) => (task.kind === "element" ? "Känna igen ett element" : diagramById[task.diagram].title);

export default function ProcessRun({ modelProgress, onSolve, onReset }) {
  const [currentId, setCurrentId] = useState(() => tasks.find((t) => !modelProgress[t.id])?.id || tasks[0].id);
  const [choice, setChoice] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const task = tasks.find((t) => t.id === currentId) || tasks[0];
  const diagram = task.diagram ? diagramById[task.diagram] : null;
  const correct = correctIndex(task);
  const solvedCount = tasks.filter((t) => modelProgress[t.id]).length;
  const result = useMemo(() => (diagram ? simulate(diagram, task.scenario) : null), [diagram, task]);

  useEffect(() => { setChoice(null); setSubmitted(false); setConfirmReset(false); }, [currentId]);

  const highlight = useMemo(() => {
    if (!submitted || !result) return undefined;
    const h = {};
    for (const id of result.visited) h[id] = HIGHLIGHT.ran;
    for (const step of result.trace) if (step.kind === "interrupt" && step.node) h[step.node] = HIGHLIGHT.interrupted;
    return h;
  }, [submitted, result]);

  function submit() {
    if (choice === null) return;
    setSubmitted(true);
    if (choice === correct) onSolve(task.id, "solved");
  }

  const isRight = submitted && choice === correct;
  const guessValue = (task.points / task.options.length) - (1 - 1 / task.options.length);

  return (
    <div className="lg:flex lg:gap-8">
      <div className="lg:order-2 lg:min-w-0 lg:flex-1">
        <section className="card p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm text-ink/65">
              {task.source} · {task.points} poäng, fel ger −1
              {modelProgress[task.id] && <span className="ml-2 text-correct">✓ Klar</span>}
            </p>
            {modelProgress[task.id] && !confirmReset && (
              <button type="button" className="btn-quiet text-sm" onClick={() => setConfirmReset(true)}>Nollställ uppgiften</button>
            )}
            {confirmReset && (
              <span className="flex gap-2 text-sm">
                <button type="button" className="btn-secondary" onClick={() => { onReset(task.id); setConfirmReset(false); }}>Ja, nollställ</button>
                <button type="button" className="btn-quiet" onClick={() => setConfirmReset(false)}>Avbryt</button>
              </span>
            )}
          </div>
          <h2 className="mt-1 font-display text-xl">{titleOf(task)}</h2>

          {diagram ? <BpmnDiagram diagram={diagram} highlight={highlight} /> : <ElementGallery elements={task.elements} />}

          {task.premises && (
            <>
              <p className="mt-2 text-[15px] font-medium">Förutsättningar</p>
              <ul className="mt-1 list-disc pl-5 text-[15px] leading-relaxed text-ink/85">
                {task.premises.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </>
          )}
          <p className="mt-3 max-w-reading text-[15px] leading-relaxed">{task.question || KIND_QUESTION[task.kind]}</p>

          <ul className="mt-3 space-y-2" aria-label="Alternativ">
            {task.options.map((opt, i) => {
              const tone = submitted
                ? i === correct
                  ? "border-correct/50 bg-correct-bg"
                  : i === choice
                    ? "border-wrong/50 bg-wrong-bg"
                    : "border-line opacity-70"
                : choice === i
                  ? "border-pine bg-pine/[0.08]"
                  : "border-line hover:border-pine hover:bg-pine/[0.06]";
              return (
                <li key={opt}>
                  <label className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-[15px] transition-colors duration-150 ${tone}`}>
                    <input type="radio" name="kp-choice" checked={choice === i} onChange={() => !submitted && setChoice(i)} disabled={submitted} className="h-4 w-4 accent-pine" />
                    <span>{opt}</span>
                  </label>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {!submitted ? (
              <button type="button" className="btn-primary" onClick={submit} disabled={choice === null}>Svara</button>
            ) : (
              <button type="button" className="btn-secondary" onClick={() => { setChoice(null); setSubmitted(false); }}>Försök igen</button>
            )}
            <span className="text-sm text-ink/65">
              Ren gissning ger {guessValue >= 0 ? "+" : "−"}{Math.abs(guessValue).toFixed(2).replace(".", ",")} p i snitt här
              ({task.options.length} alternativ, {task.points} p).
            </span>
          </div>

          {submitted && (
            <div className={`mt-4 rounded-lg border-l-2 p-4 ${isRight ? "border-correct bg-correct-bg" : "border-wrong bg-wrong-bg"}`} role="status">
              <p className="font-display text-lg">
                {isRight ? "Rätt." : "Fel."}
                <span className="tabular ml-2 font-body text-base">{isRight ? `+${task.points}` : "−1"} poäng</span>
              </p>
              <p className="mt-1 text-[15px] text-ink/80">
                Rätt svar: {task.options[correct]}.
              </p>
              {task.explain && (
                <ul className="mt-2 list-disc space-y-0.5 pl-5 text-sm text-ink/85">
                  {task.explain.map((line) => <li key={line}>{line}</li>)}
                </ul>
              )}
              {result && (
                <>
                  <p className="mt-3 text-sm font-medium">Så körs processen</p>
                  <ol className="mt-1 space-y-0.5 text-sm">
                    {result.trace.map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="tabular w-36 shrink-0 text-ink/60">{step.clock}</span>
                        <span className={step.kind === "interrupt" ? "text-wrong" : ""}>{step.text}</span>
                      </li>
                    ))}
                  </ol>
                </>
              )}
              {task.note && <p className="mt-3 text-sm text-ink/75">{task.note}</p>}
              {result && <p className="mt-3 text-xs text-ink/60">Markerat i diagrammet: det som kördes (grönt) och det som avbröts (rött).</p>}
            </div>
          )}
        </section>
      </div>

      <div className="mt-6 lg:order-1 lg:mt-0 lg:w-80 lg:shrink-0">
        <nav aria-label="Uppgifter" className="card p-4">
          <h3 className="font-display text-[15px]">Kör processen</h3>
          <p className="mt-1 text-sm text-ink/65">
            Tentans BPMN-frågor: följ en token genom diagrammet. {solvedCount} av {tasks.length} klara.
          </p>
          <ul className="mt-2 space-y-1">
            {tasks.map((t, i) => {
              const active = t.id === currentId;
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => setCurrentId(t.id)}
                    aria-current={active ? "true" : undefined}
                    className={`flex w-full items-baseline gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors duration-150 ${active ? "border-pine bg-pine/[0.08] text-pine" : "border-transparent hover:border-pine hover:bg-pine/[0.06]"}`}
                  >
                    <span className="tabular w-6 shrink-0 text-ink/65">{i + 1}</span>
                    <span className="min-w-0 flex-1 truncate">{titleOf(t)} · {t.source.replace(/^Tenta /, "").replace(/^Variant av tenta /, "variant ")}</span>
                    {modelProgress[t.id] && <span className="shrink-0 text-correct" title="Klar">✓<span className="sr-only"> Klar</span></span>}
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
