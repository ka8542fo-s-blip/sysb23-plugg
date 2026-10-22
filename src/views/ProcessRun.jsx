import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { tasks, correctIndex } from "../data/process/bpmnTasks.js";
import { diagramById } from "../data/process/bpmnDiagrams.js";
import { simulate } from "../lib/bpmnSim.js";
import { BpmnDiagram, ElementGallery, HIGHLIGHT } from "../components/bpmn/BpmnDiagram.jsx";
import { KEYS, load, save } from "../lib/storage.js";
import BpmnLegend from "../components/bpmn/BpmnLegend.jsx";

// BPMN-övningar: tentans BPMN-körfrågor. Diagrammet ritas och körs ur samma
// data; efter svar visas simulatorns spår steg för steg och de noder som
// kördes. Poäng som på tentan (frågans poäng, −1 för fel), men inga
// sparade poäng — klar = rätt svar, som i Modellera.
const KIND_QUESTION = {
  aktiviteter: "Vilken kombination av aktiviteter inträffar om processen körs under följande förutsättningar?",
  tid: "Vid vilken tidpunkt har processen avslutats?",
};

// Källan visas utan sidhänvisning (HANDOFF: inga slidehänvisningar i det
// läsaren ser); hela källan står kvar i datat. Bara en parentes efter
// mellanslag tas bort, så att "ord 3(c)" behåller sin bokstav.
const shortSource = (task) => task.source.replace(/\s+\(.*\)$/, "");

const titleOf = (task) => (task.kind === "element" ? "Känna igen ett element" : diagramById[task.diagram].title);
const sourceTag = (task) => shortSource(task).replace(/^Tenta /, "").replace(/^Variant av tenta /, "variant ");

// I läget Anpassa får diagrammen växa till 150 % när det finns plats.
const MAX_FIT_SCALE = 1.5;

// params.taskId: från Tentafrågor i Öva ("Kör diagrammet"), som öppnar
// just den uppgiften; annars första olösta.
export default function ProcessRun({ params, modelProgress, onSolve, onReset }) {
  const [currentId, setCurrentId] = useState(() =>
    tasks.some((t) => t.id === params?.taskId)
      ? params.taskId
      : tasks.find((t) => !modelProgress[t.id])?.id || tasks[0].id,
  );
  const [choice, setChoice] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  // Menyn kan fällas ihop till en list med siffror, så att diagrammet får
  // plats att växa. Valet sparas; det gäller bara bred skärm.
  const [menu, setMenu] = useState(() => (load(KEYS.bpmnMenu, "full") === "smal" ? "smal" : "full"));
  const narrowMenu = menu === "smal";
  function toggleMenu() {
    const next = narrowMenu ? "full" : "smal";
    setMenu(next);
    save(KEYS.bpmnMenu, next);
  }

  const task = tasks.find((t) => t.id === currentId) || tasks[0];
  const taskIndex = tasks.indexOf(task);
  const nextTask = tasks[taskIndex + 1] || null;
  const cardRef = useRef(null);
  const scrollToCard = useRef(false);
  const diagram = task.diagram ? diagramById[task.diagram] : null;
  const correct = correctIndex(task);
  const solvedCount = tasks.filter((t) => modelProgress[t.id]).length;
  // Stiluppgifterna visar ett diagram men kör det inte.
  const result = useMemo(() => (diagram && task.kind !== "stil" ? simulate(diagram, task.scenario) : null), [diagram, task]);

  useEffect(() => {
    setChoice(null);
    setSubmitted(false);
    setConfirmReset(false);
    // Efter "Nästa uppgift" står man längst ned i den förra; visa början av
    // den nya, under den klistrade headern.
    if (scrollToCard.current && cardRef.current) {
      scrollToCard.current = false;
      const header = document.querySelector("header")?.offsetHeight ?? 0;
      const top = cardRef.current.getBoundingClientRect().top + window.scrollY - header - 12;
      if (top < window.scrollY) {
        const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
      }
    }
  }, [currentId]);

  function goNext() {
    if (!nextTask) return;
    scrollToCard.current = true;
    setCurrentId(nextTask.id);
  }

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

  // Symbolförklaringen. På elementfrågorna ("vilket element är X?") skulle
  // den avslöja svaret, så där visas den först när man har svarat.
  const [legendOpen, setLegendOpen] = useState(false);
  const legendButton = useRef(null);
  const legendAllowed = task.kind !== "element" || submitted;
  const closeLegend = useCallback(() => {
    setLegendOpen(false);
    legendButton.current?.focus();
  }, []);

  const isRight = submitted && choice === correct;
  const guessValue = (task.points / task.options.length) - (1 - 1 / task.options.length);

  return (
    <div className="lg:flex lg:gap-8">
      <div className="lg:order-2 lg:min-w-0 lg:flex-1">
        <section ref={cardRef} className="card p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-ink/65">
              {shortSource(task)} · {task.points} poäng, fel ger −1
              {modelProgress[task.id] && <span className="ml-2 text-correct">✓ Klar</span>}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {modelProgress[task.id] && !confirmReset && (
                <button type="button" className="btn-quiet text-sm" onClick={() => setConfirmReset(true)}>Nollställ uppgiften</button>
              )}
              {confirmReset && (
                <span className="flex gap-2 text-sm">
                  <button type="button" className="btn-secondary" onClick={() => { onReset(task.id); setConfirmReset(false); }}>Ja, nollställ</button>
                  <button type="button" className="btn-quiet" onClick={() => setConfirmReset(false)}>Avbryt</button>
                </span>
              )}
              {legendAllowed && (
                <button
                  ref={legendButton}
                  type="button"
                  className="btn-secondary px-3 py-1.5 text-sm"
                  onClick={() => setLegendOpen(true)}
                  aria-haspopup="dialog"
                >
                  <span aria-hidden="true" className="font-display text-base leading-none text-pine">◇</span>
                  BPMN-symboler
                </button>
              )}
            </div>
          </div>
          <h2 className="mt-1 font-display text-xl">{titleOf(task)}</h2>

          {diagram ? <BpmnDiagram diagram={diagram} highlight={highlight} zoomable maxScale={MAX_FIT_SCALE} /> : <ElementGallery elements={task.elements} />}

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
            {/* Före svaret är Nästa en tyst genväg förbi uppgiften. Efter svaret
                finns huvudknappen sist i förklaringen, där man har läst klart. */}
            {nextTask && (
              <button
                type="button"
                className={submitted ? "btn-secondary" : "btn-quiet"}
                onClick={goNext}
                title={`Uppgift ${taskIndex + 2}: ${titleOf(nextTask)}`}
              >
                Nästa uppgift →
              </button>
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
              {nextTask && (
                <button type="button" className="btn-primary mt-4" onClick={goNext} title={`Uppgift ${taskIndex + 2}: ${titleOf(nextTask)}`}>
                  Nästa uppgift →
                </button>
              )}
            </div>
          )}
        </section>
      </div>

      <div className={`mt-6 lg:order-1 lg:mt-0 lg:shrink-0 lg:transition-[width] lg:duration-200 ${narrowMenu ? "lg:w-24" : "lg:w-80"}`}>
        {/* Ihopfälld: bara siffrorna, på bred skärm. Mobilen visar alltid hela
            listan, under uppgiften. */}
        {narrowMenu && (
          <nav aria-label="Uppgifter" className="card hidden p-2 lg:block">
            <button
              type="button"
              onClick={toggleMenu}
              className="flex h-8 w-full items-center justify-center rounded-md text-ink/65 transition-colors duration-150 hover:bg-pine/[0.08] hover:text-pine"
              aria-label="Visa hela menyn"
              title="Visa hela menyn"
            >
              <span aria-hidden="true">»</span>
            </button>
            <p className="tabular mt-1 text-center text-xs text-ink/65" title={`${solvedCount} av ${tasks.length} klara`}>
              {solvedCount}/{tasks.length}
            </p>
            <ul className="mt-2 grid grid-cols-2 gap-1.5">
              {tasks.map((t, i) => {
                const active = t.id === currentId;
                const done = Boolean(modelProgress[t.id]);
                const label = `Uppgift ${i + 1}: ${titleOf(t)} · ${sourceTag(t)}${done ? " · klar" : ""}`;
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => setCurrentId(t.id)}
                      aria-current={active ? "true" : undefined}
                      aria-label={label}
                      title={label}
                      className={`tabular flex h-9 w-full items-center justify-center rounded-lg border text-sm transition-colors duration-150 ${
                        active
                          ? "border-pine bg-pine font-medium text-paper"
                          : done
                            ? "border-correct/50 bg-correct-bg text-correct hover:border-correct"
                            : "border-line hover:border-pine hover:bg-pine/[0.06] hover:text-pine"
                      }`}
                    >
                      {i + 1}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
        <nav aria-label="Uppgifter" className={`card p-4 ${narrowMenu ? "lg:hidden" : ""}`}>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-[15px]">BPMN-övningar</h3>
            <button
              type="button"
              onClick={toggleMenu}
              className="-mr-1 -mt-1 hidden h-8 w-8 shrink-0 items-center justify-center rounded-md text-ink/65 transition-colors duration-150 hover:bg-pine/[0.08] hover:text-pine lg:flex"
              aria-label="Fäll ihop menyn"
              title="Fäll ihop menyn, så att diagrammet får mer plats"
            >
              <span aria-hidden="true">«</span>
            </button>
          </div>
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
                    title={`${titleOf(t)} · ${sourceTag(t)}`}
                    className={`flex w-full items-baseline gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors duration-150 ${active ? "border-pine bg-pine/[0.08] text-pine" : "border-transparent hover:border-pine hover:bg-pine/[0.06]"}`}
                  >
                    <span className="tabular w-6 shrink-0 text-ink/65">{i + 1}</span>
                    <span className="min-w-0 flex-1 truncate">{titleOf(t)} · {sourceTag(t)}</span>
                    {modelProgress[t.id] && <span className="shrink-0 text-correct" title="Klar">✓<span className="sr-only"> Klar</span></span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      {legendOpen && <BpmnLegend onClose={closeLegend} />}
    </div>
  );
}
