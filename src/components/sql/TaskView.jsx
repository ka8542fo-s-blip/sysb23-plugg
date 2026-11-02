import { useEffect, useMemo, useRef, useState } from "react";
import { gradeTask4 } from "../../lib/examGrade.js";
import { checkExercise } from "../../lib/sqlCheck.js";
import { formatSql } from "../../lib/sqlIndent.js";
import { loadEngine } from "../../lib/sqlEngine.js";
import { countSolved, defaultHelpTab, locate, tileState, SOLVED, WITH_HELP } from "../../lib/sqlTracks.js";
import { KEYS, clearDraft, load, loadDraft, save, saveDraft } from "../../lib/storage.js";
import { scrollBelowHeader, useWide } from "../../lib/useWide.js";
import GivenTables from "./GivenTables.jsx";
import HelpRail from "./HelpRail.jsx";
import LessonText from "./LessonText.jsx";
import SchemaList from "./SchemaList.jsx";
import TaskCard, { TaskPrompt } from "./TaskCard.jsx";
import TaskTile from "./TaskTile.jsx";

const EXAM_LEAD = "Skriv en (1) SQL-fråga som returnerar";

export function tableReader(engine) {
  return async (name) => {
    const db = await engine.newDatabase();
    try {
      return engine.runSelect(db, `SELECT * FROM ${name};`);
    } finally {
      db.close?.();
    }
  };
}

// gradeTask4 (tentans tabeller) i samma form som checkExercise.
function gradeExam(SQL, item, code) {
  const graded = gradeTask4(SQL, item, code);
  if (graded.status === "empty") return { status: "empty-input", message: graded.message };
  return {
    status: graded.status,
    message: graded.message,
    raw: graded.raw,
    userResult: graded.user,
    expectedResult: graded.expected,
    control: graded.control?.ok === false ? graded.control : null,
    avgNote: item.avgNote,
    emptyResult: graded.user?.values.length === 0 && graded.expected?.values.length > 0,
  };
}

function TaskRun({ item, section, place, status, engine, onSolve, onReset, onOpen, onClose, help, autoFocus }) {
  const [code, setCode] = useState(() => loadDraft(item.id) ?? (item.starter || ""));
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const dirty = Boolean(code.trim()) && code !== (item.starter || "");

  function updateCode(text) {
    setCode(text);
    saveDraft(item.id, text);
  }

  async function grade() {
    if (running) return;
    setRunning(true);
    try {
      const outcome = item.exam
        ? gradeExam(await loadEngine(), item, code)
        : await checkExercise({ exercise: item, userSql: code, engine });
      setResult(outcome);
      if (outcome.status === "correct" && status !== WITH_HELP) onSolve(item.id, SOLVED);
    } catch (error) {
      setResult({ status: "error", raw: error.message, message: null });
    } finally {
      setRunning(false);
    }
  }

  function reset() {
    onReset(item.id);
    clearDraft(item.id);
    setCode(item.starter || "");
    setResult(null);
    setConfirmReset(false);
  }

  const { next, prev } = place;
  const sameSection = next?.section === section;
  const nextLabel = !next ? "Till översikten →" : sameSection ? "Nästa uppgift →" : `Nästa: ${next.section.title} →`;
  const goNext = () => (next ? onOpen(next.item.id) : onClose());

  return (
    <TaskCard
      kicker={item.heading}
      autoFocus={autoFocus}
      status={
        <span className="flex flex-wrap items-center gap-2 text-sm">
          {status && (
            <span className={status === WITH_HELP ? "text-brass-text" : "text-correct"}>
              ✓ {status === WITH_HELP ? "Löst med hjälp" : "Löst"}
            </span>
          )}
          {(status || dirty) && !confirmReset && (
            <button type="button" className="btn-quiet px-2 py-1 text-sm" onClick={() => setConfirmReset(true)}>
              Nollställ
            </button>
          )}
          {confirmReset && (
            <>
              <span className="text-ink/70">Tar bort svaret och bocken.</span>
              <button type="button" className="btn-secondary px-3 py-1" onClick={reset}>Ja, nollställ</button>
              <button type="button" className="btn-quiet px-2 py-1 text-sm" onClick={() => setConfirmReset(false)}>Avbryt</button>
            </>
          )}
        </span>
      }
      prompt={
        item.exam
          ? <TaskPrompt lead={EXAM_LEAD} text={item.ask} tail={item.tail} />
          : <TaskPrompt text={item.task} />
      }
      note={item.note}
      hint={item.hint}
      help={help}
      code={code}
      onCodeChange={updateCode}
      onRun={grade}
      running={running}
      editorRows={8}
      result={result}
      solution={formatSql(item.solution)}
      explanation={item.explanation}
      solutionWarning={status ? null : "Uppgiften markeras som löst med hjälp."}
      onSolutionShown={() => {
        if (!status) onSolve(item.id, WITH_HELP);
      }}
      checklist={item.checklist ?? section.checklist}
      next={{ label: nextLabel, onClick: goNext }}
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            className="btn-secondary"
            disabled={!prev}
            onClick={() => prev && onOpen(prev.item.id)}
          >
            ← Föregående
          </button>
          <button type="button" className="btn-secondary" onClick={goNext}>{nextLabel}</button>
        </div>
      }
    />
  );
}

// Arbetsvyn: var i spåret man är, uppgiften och hjälpytan. Uppgifterna ligger
// som numrerade rutor ovanför, så att ett byte aldrig lämnar uppgiften utanför
// skärmen, och Nästa går vidare över sektionsgränserna.
export default function TaskView({ sections, itemId, progress, engine, onSolve, onReset, onOpen, onClose, backLabel, exam = false }) {
  const place = locate(sections, itemId);
  const { item, section } = place;
  const wide = useWide();
  const topRef = useRef(null);
  const mounted = useRef(false);
  const [helpTabs, setHelpTabs] = useState(() => load(KEYS.sqlHelp, {}));
  const firstTab = useMemo(() => defaultHelpTab(section, progress, exam), [section.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (mounted.current) scrollBelowHeader(topRef.current);
    mounted.current = true;
  }, [itemId]);

  function pickTab(tab) {
    const next = { ...helpTabs, [section.id]: tab };
    setHelpTabs(next);
    save(KEYS.sqlHelp, next);
  }

  function openSection(id) {
    const target = sections.find((other) => other.id === id);
    onOpen((target.items.find((other) => !progress[other.id]) ?? target.items[0]).id);
  }

  const tables = item.tables
    ? <GivenTables tables={item.tables} note={section.note} />
    : <SchemaList key={section.id} read={tableReader(engine)} only={section.tableNames} />;
  const tabs = [
    { id: "tabeller", label: "Tabeller", content: tables },
    ...(section.lesson
      ? [{ id: "genomgang", label: "Genomgång", content: <LessonText>{section.lesson}</LessonText> }]
      : []),
  ];
  const rail = <HelpRail tabs={tabs} value={helpTabs[section.id] ?? firstTab} onChange={pickTab} wide={wide} />;
  const solved = countSolved(section.items, progress);

  return (
    <div ref={topRef} className="space-y-4">
      <section className="card flex flex-wrap items-center gap-x-3 gap-y-2.5 p-3 sm:p-4">
        <button type="button" className="btn-quiet order-1 -ml-1 px-2 py-1.5 text-sm" onClick={onClose}>← {backLabel}</button>
        <span className="tabular order-2 ml-auto text-sm text-ink/65 lg:order-4">{solved} av {section.items.length} klara</span>
        <label className="order-3 w-full lg:order-2 lg:w-72">
          <span className="sr-only">Byt del</span>
          <select
            value={section.id}
            onChange={(event) => openSection(event.target.value)}
            className="w-full truncate rounded-lg border border-line bg-surface px-3 py-2 text-[15px]"
          >
            {sections.map((other) => (
              <option key={other.id} value={other.id}>
                {other.kicker}: {other.title} ({countSolved(other.items, progress)}/{other.items.length})
              </option>
            ))}
          </select>
        </label>
        <ol className="order-4 flex w-full flex-wrap gap-1.5 lg:order-3 lg:w-auto" aria-label={`Uppgifter i ${section.title}`}>
          {section.items.map((other) => (
            <li key={other.id}>
              <TaskTile
                label={other.label}
                state={tileState(progress[other.id], other.id === item.id ? null : loadDraft(other.id), other.starter)}
                name={other.task ?? other.ask}
                current={other.id === item.id}
                onClick={() => onOpen(other.id)}
              />
            </li>
          ))}
        </ol>
      </section>

      <div className={wide ? "grid grid-cols-[minmax(0,1fr)_24rem] items-start gap-6" : ""}>
        <TaskRun
          key={item.id}
          item={item}
          section={section}
          place={place}
          status={progress[item.id]}
          engine={engine}
          onSolve={onSolve}
          onReset={onReset}
          onOpen={onOpen}
          onClose={onClose}
          help={wide ? null : rail}
          autoFocus={wide}
        />
        {wide && rail}
      </div>
    </div>
  );
}
