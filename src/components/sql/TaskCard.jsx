import { useEffect, useRef, useState } from "react";
import FormatButton from "./FormatButton.jsx";
import ResultBanner from "./ResultBanner.jsx";
import ResultPanel from "./ResultPanel.jsx";
import SqlEditor from "./SqlEditor.jsx";

// En uppgift: texten, rutan, rättningen och facit. Samma kort i Ämnen,
// Tentanivå och Slump, så att knapparna står på samma ställe överallt. Ingen
// knapp skriver över svaret: lösningen visas under det, och bara Nollställ
// tömmer rutan.
export default function TaskCard({
  kicker,
  status,
  prompt,
  note,
  hint,
  help,
  code,
  onCodeChange,
  onRun,
  running,
  editorRows,
  result,
  solution,
  explanation,
  solutionWarning,
  onSolutionShown,
  checklist,
  next,
  footer,
  autoFocus = false,
}) {
  const [hintOpen, setHintOpen] = useState(false);
  const [solutionOpen, setSolutionOpen] = useState(false);
  const [asking, setAsking] = useState(false);
  const [bannerHidden, setBannerHidden] = useState(false);
  const editorRef = useRef(null);
  const bannerRef = useRef(null);
  const nextRef = useRef(null);
  const wasRunning = useRef(false);
  const correct = result?.status === "correct";

  useEffect(() => {
    if (autoFocus) editorRef.current?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Rätta låser rutan under körningen, och då tappar den fokus. Vid rätt svar
  // går fokus till Nästa, så att Enter tar en vidare, annars tillbaka till rutan.
  useEffect(() => {
    if (wasRunning.current && !running) {
      if (correct && nextRef.current) nextRef.current.focus({ preventScroll: true });
      else if (document.activeElement === document.body) editorRef.current?.focus();
    }
    wasRunning.current = running;
  }, [running, correct]);

  // Kör man med Ctrl/Cmd + Enter längst ned i rutan kan domen hamna utanför
  // skärmen. Skrolla in den, men bara när den faktiskt inte syns.
  useEffect(() => {
    setBannerHidden(false);
    if (!result) return;
    const box = bannerRef.current?.getBoundingClientRect();
    if (box && (box.top < 0 || box.bottom > window.innerHeight)) {
      bannerRef.current.scrollIntoView({ block: "center" });
    }
  }, [result]);

  function showSolution() {
    if (solutionOpen) {
      setSolutionOpen(false);
    } else if (solutionWarning && !asking) {
      setAsking(true);
    } else {
      setAsking(false);
      setSolutionOpen(true);
      onSolutionShown?.();
    }
  }

  const solutionVisible = solutionOpen || correct;
  const formOnly = ["semicolon", "names", "requires"].includes(result?.reason);

  return (
    <section className="card min-w-0 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-brass-text">{kicker}</p>
        {status}
      </div>

      <div className="mt-2">{prompt}</div>
      {note && <p className="mt-2 text-sm leading-relaxed text-ink/65">{note}</p>}

      {help && <div className="mt-3">{help}</div>}

      <div className="mt-4">
        <SqlEditor
          ref={editorRef}
          value={code}
          onChange={onCodeChange}
          onRun={onRun}
          disabled={running}
          rows={editorRows}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2">
        {hint && (
          <button
            type="button"
            className="btn-quiet px-2 py-1 text-sm"
            aria-expanded={hintOpen}
            onClick={() => setHintOpen(!hintOpen)}
          >
            {hintOpen ? "Dölj ledtråd" : "Ledtråd"}
          </button>
        )}
        {solution && !correct && (
          <button
            type="button"
            className="btn-quiet px-2 py-1 text-sm"
            aria-expanded={solutionOpen}
            onClick={showSolution}
          >
            {solutionOpen ? "Dölj lösning" : "Visa lösning"}
          </button>
        )}
        <span className="ml-auto flex flex-wrap items-center gap-2">
          <FormatButton editorRef={editorRef} disabled={running || !code.trim()} />
          <button type="button" className="btn-emphasis" onClick={onRun} disabled={running}>
            {running ? "Rättar…" : "Rätta ▸"}
          </button>
        </span>
      </div>

      {asking && (
        <p className="mt-2 flex flex-wrap items-center gap-2 text-[15px]">
          {solutionWarning}
          <button type="button" className="btn-secondary px-3 py-1.5" onClick={showSolution}>Visa</button>
          <button type="button" className="btn-quiet px-2 py-1.5" onClick={() => setAsking(false)}>Avbryt</button>
        </p>
      )}

      {hintOpen && (
        <p className="mt-3 rounded-lg border-l-2 border-brass bg-paper p-3 text-[15px] leading-relaxed">{hint}</p>
      )}

      {result && !bannerHidden && (
        <div className="mt-4" ref={bannerRef}>
          <ResultBanner result={result} onDismiss={() => setBannerHidden(true)} />
        </div>
      )}

      {correct && next && (
        <div className="mt-3">
          <button ref={nextRef} type="button" className="btn-primary" onClick={next.onClick}>
            {next.label}
          </button>
        </div>
      )}

      {result && (
        <div className="mt-4">
          <ResultPanel result={result} />
        </div>
      )}

      {result?.status === "wrong" && !formOnly && checklist?.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-ink/80">Kontrollera</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-5 text-[15px] text-ink/85">
            {checklist.map((line) => <li key={line}>{line}</li>)}
          </ul>
        </div>
      )}

      {solution && solutionVisible && (
        <div className="mt-4">
          <p className="text-sm font-medium text-ink/80">Lösning</p>
          <pre className="mt-1 overflow-x-auto rounded-lg border border-line bg-paper px-4 py-3 font-mono text-[13px] leading-relaxed">{solution}</pre>
          {explanation && <p className="mt-2 text-[15px] leading-relaxed text-ink/80">{explanation}</p>}
          {result?.avgNote && <p className="mt-2 text-[15px] leading-relaxed text-ink/80">{result.avgNote}</p>}
        </div>
      )}

      {footer && <div className="mt-5 border-t border-line pt-4">{footer}</div>}
    </section>
  );
}

// Uppgiftstexten. Tentans form har ingressen först, övningarna bara texten.
export function TaskPrompt({ lead, text, tail }) {
  return (
    <>
      {lead && <p className="text-[15px]">{lead}</p>}
      <p className={`rounded-lg border-l-2 border-brass bg-brass/[0.07] px-4 py-2.5 text-[16px] leading-relaxed ${lead ? "mt-2" : ""}`}>
        {text}
      </p>
      {tail?.map((line) => <p key={line} className="mt-2 text-[15px]">{line}</p>)}
    </>
  );
}
