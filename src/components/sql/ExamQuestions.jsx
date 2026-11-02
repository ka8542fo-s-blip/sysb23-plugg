import { useState } from "react";
import { oldExams } from "../../data/databaser/oldExams.js";
import { gradeTask4 } from "../../lib/examGrade.js";
import { loadEngine } from "../../lib/sqlEngine.js";
import { KEYS, load, save } from "../../lib/storage.js";
import { useDrafts } from "../../lib/useDrafts.js";
import ResultTable from "./ResultTable.jsx";
import SqlEditor from "./SqlEditor.jsx";

// SQL-fliken, läget Tenta: bara tentornas SQL-fråga (uppgift 4), ordagrant
// och mot tentans egna tabeller. Rättas som i fliken Tenta (gradeTask4), men
// utan poäng och fristående därifrån: svaren räknas inte in i en tenta.
// Svar och klar-status sparas per fråga (svar:sql-tenta:<tentaId>).
const draftId = (exam) => `sql-tenta:${exam.id}`;
const EMPTY = { code: "", solved: false };

export default function ExamQuestions() {
  const drafts = useDrafts();
  const [currentId, setCurrentId] = useState(() => {
    const saved = load(KEYS.sqlExam, null);
    return oldExams.some((exam) => exam.id === saved) ? saved : oldExams[0].id;
  });
  const exam = oldExams.find((e) => e.id === currentId);
  const stateOf = (e) => drafts.get(draftId(e), EMPTY);
  const solvedCount = oldExams.filter((e) => stateOf(e).solved).length;

  function open(id) {
    setCurrentId(id);
    save(KEYS.sqlExam, id);
  }

  return (
    <div className="space-y-4">
      <nav aria-label="Tentafrågor" className="flex flex-wrap items-center gap-2">
        {oldExams.map((e) => (
          <button
            key={e.id}
            type="button"
            onClick={() => open(e.id)}
            aria-current={e.id === exam.id ? "true" : undefined}
            className={`chip ${e.id === exam.id ? "chip-on" : "hover:border-pine"}`}
          >
            {e.dateLabel}
            {stateOf(e).solved && <span className="ml-1.5" aria-label="klar">✓</span>}
          </button>
        ))}
        <span className="tabular text-sm text-ink/65">{solvedCount} av {oldExams.length} klara</span>
      </nav>
      <Question key={exam.id} exam={exam} state={stateOf(exam)} drafts={drafts} />
    </div>
  );
}

function Question({ exam, state, drafts }) {
  const task = exam.task4;
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);
  const [facitOpen, setFacitOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const { code, solved } = state;

  function store(next) {
    drafts.set(draftId(exam), next.code || next.solved ? next : null);
  }

  async function grade() {
    if (running || !code.trim()) return;
    setRunning(true);
    try {
      const outcome = gradeTask4(await loadEngine(), task, code);
      setResult(outcome);
      if (outcome.status === "correct") store({ code, solved: true });
    } finally {
      setRunning(false);
    }
  }

  function reset() {
    drafts.clear(draftId(exam));
    setResult(null);
    setFacitOpen(false);
    setConfirmReset(false);
  }

  const correct = result?.status === "correct";
  return (
    <section className="card p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm text-ink/65">
          {exam.title} {exam.dateLabel} · uppgift 4
          {solved && <span className="ml-2 text-correct">✓ Klar</span>}
        </p>
        {(solved || code) && !confirmReset && (
          <button type="button" className="btn-quiet text-sm" onClick={() => setConfirmReset(true)}>Nollställ uppgiften</button>
        )}
        {confirmReset && (
          <span className="flex gap-2 text-sm">
            <button type="button" className="btn-secondary" onClick={reset}>Ja, nollställ</button>
            <button type="button" className="btn-quiet" onClick={() => setConfirmReset(false)}>Avbryt</button>
          </span>
        )}
      </div>

      <p className="mt-3 text-[15px]">Givet är följande tabeller:</p>
      <div className="mt-2 grid gap-4 lg:grid-cols-3">
        {task.tables.map((t) => (
          <ResultTable key={t.name} caption={t.name} result={{ columns: t.columns.map(([c]) => c), values: t.rows }} />
        ))}
      </div>
      <p className="mt-4 text-[15px]">Skriv en (1) SQL-fråga som returnerar</p>
      <p className="mt-2 rounded-lg border-l-2 border-brass bg-brass/[0.07] px-4 py-2 text-[15px] leading-relaxed">{task.ask}</p>
      {task.tail.map((p) => <p key={p} className="mt-2 text-[15px]">{p}</p>)}

      <div className="mt-4">
        <SqlEditor value={code} onChange={(text) => store({ code: text, solved })} onRun={grade} label="Ditt svar" rows={14} />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button type="button" className="btn-primary" onClick={grade} disabled={running || !code.trim()}>Rätta</button>
        <span className="text-sm text-ink/65">Körs mot tentans data i SQLite, med kursens T-SQL översatt.</span>
      </div>

      {result && (
        <div className={`mt-4 rounded-lg border-l-2 p-4 ${correct ? "border-correct bg-correct-bg" : "border-wrong bg-wrong-bg"}`} role="status">
          <p className="font-display text-lg">{correct ? "Rätt." : "Inte rätt än."}</p>
          <p className="mt-1 text-[15px]">{result.message}</p>
          {task.avgNote && <p className="mt-2 text-[15px] text-ink/80">{task.avgNote}</p>}
          {(result.user || result.control) && (
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              {result.user && <ResultTable caption="Ditt resultat" result={result.user} />}
              <ResultTable caption="Väntat resultat (SQL Server)" result={result.expected} />
              {result.control && <ResultTable caption={`Ditt resultat på kontrolldatan (${result.control.label})`} result={result.control.user} />}
              {result.control && <ResultTable caption="Väntat på kontrolldatan" result={result.control.expected} />}
            </div>
          )}
          {!correct && (
            <div className="mt-4">
              <p className="text-sm font-medium text-ink/80">Kontrollera</p>
              <ul className="mt-1 list-disc space-y-0.5 pl-5 text-[15px] text-ink/85">{task.checklist.map((c) => <li key={c}>{c}</li>)}</ul>
            </div>
          )}
          {correct || facitOpen ? (
            <>
              <p className="mt-4 text-sm font-medium text-ink/80">Facit</p>
              <pre className="mt-1 overflow-x-auto rounded-lg border border-line bg-surface px-4 py-3 font-mono text-[13px] leading-relaxed">{task.solution}</pre>
              <p className="mt-2 text-[15px] text-ink/80">{task.explanation}</p>
            </>
          ) : (
            <button type="button" className="btn-secondary mt-3" onClick={() => setFacitOpen(true)}>Visa facit</button>
          )}
        </div>
      )}
    </section>
  );
}
