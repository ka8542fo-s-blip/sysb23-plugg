import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import SegmentedControl from "../components/SegmentedControl.jsx";
import Framework from "../components/zachman/ZachmanFramework.jsx";
import Memory from "../components/zachman/ZachmanMemory.jsx";
import {
  CELLS, COLUMNS, MEMORY_ID, ROWS, TASK_GROUPS, taskById, zachmanTasks,
} from "../data/arkitektur/zachman.js";
import { gradeChoice, gradePlacement } from "../lib/zachman.js";
import { KEYS, load, save } from "../lib/storage.js";
import { useDrafts } from "../lib/useDrafts.js";
import { ZACHMAN_WHY } from "../data/arkitektur/cards.js";

// Zachman-vyn (Verksamhetsarkitektur): ramverket att utforska, memorering
// av rad- och kolumnnamn och placeringsuppgifterna från HT25-tentorna.
// Läge, öppen uppgift och rubrikvalet sparas; svaren (celler, motivering,
// val) i sysb23:svar:<id> via useDrafts; klar i sysb23:modell:<id>.
// "Nollställ uppgiften" tar bort båda.

const MODES = [
  { id: "ramverk", label: "Ramverket" },
  { id: "minne", label: "Memorera" },
  { id: "placera", label: "Placera" },
];
const PLACE_IDS = TASK_GROUPS.flatMap((group) => group.ids);
const UNIQUE_IDS = [...new Set(PLACE_IDS)];
const UNOFFICIAL = "Inget officiellt facit – tolkning utifrån ramverket.";

export default function Zachman({ course, params, navigate, modelProgress, onSolve, onReset }) {
  const [mode, setModeState] = useState(() => (params?.taskId ? "placera" : load(KEYS.zachmanMode, "ramverk")));
  const setMode = (next) => {
    setModeState(next);
    save(KEYS.zachmanMode, next);
  };
  const drafts = useDrafts();
  const hasEssay = (course.views || []).includes("essa") && course.essays.some((e) => e.id === "ea-e-zachman");
  const toEssay = hasEssay ? () => navigate("essa", { essayId: "ea-e-zachman" }) : null;

  return (
    <div className="space-y-6">
      <section>
        <h1 className="font-display text-2xl">Zachman (modul 4)</h1>
        <p className="mt-2 max-w-reading text-[15px] leading-relaxed text-ink/85">
          <span className="font-medium">Varför en egen flik? </span>
          {ZACHMAN_WHY}
        </p>
        <ul className="mt-3 max-w-reading list-disc space-y-1 pl-5 text-[15px] text-ink/85">
          <li>
            <span className="font-medium">Ramverket:</span> klicka i rutnätet och läs vad varje rad,
            kolumn och cell betyder.
          </li>
          <li>
            <span className="font-medium">Memorera:</span> skriv radernas och kolumnernas namn ur minnet.
          </li>
          <li>
            <span className="font-medium">Placera:</span> förra årets tentauppgifter, där man placerar en
            modell i rätt cell och motiverar varför.
          </li>
        </ul>
        <p className="mt-3 max-w-reading text-sm text-ink/70">
          Raderna heter R1–R6 och kolumnerna K1–K6, så R2K4 betyder rad 2, kolumn 4. Modul 4:s egna
          frågor finns i Öva.
        </p>
      </section>
      <div className="max-w-xl">
        <SegmentedControl label="Välj läge" segments={MODES} value={mode} onChange={setMode} />
      </div>
      {mode === "ramverk" && <Framework toEssay={toEssay} />}
      {mode === "minne" && (
        <Memory drafts={drafts} done={Boolean(modelProgress[MEMORY_ID])} onSolve={onSolve} onReset={onReset} />
      )}
      {mode === "placera" && (
        <Place
          params={params}
          drafts={drafts}
          modelProgress={modelProgress}
          onSolve={onSolve}
          onReset={onReset}
          toEssay={toEssay}
        />
      )}
    </div>
  );
}

// ------------------------------------------------------------------ Placera

function Place({ params, drafts, modelProgress, onSolve, onReset, toEssay }) {
  const [currentId, setCurrentId] = useState(() => {
    if (params?.taskId && taskById(params.taskId)) return params.taskId;
    const saved = load(KEYS.zachmanTask, null);
    if (saved && taskById(saved) && saved !== MEMORY_ID) return saved;
    return UNIQUE_IDS.find((id) => !modelProgress[id]) || UNIQUE_IDS[0];
  });
  const [groupKey, setGroupKey] = useState(
    () => TASK_GROUPS.find((group) => group.ids.includes(currentId))?.key || TASK_GROUPS[0].key,
  );
  const [labels, setLabelsState] = useState(() => load(KEYS.zachmanLabels, false));
  const setLabels = (next) => {
    setLabelsState(next);
    save(KEYS.zachmanLabels, next);
  };
  const cardRef = useRef(null);
  useEffect(() => save(KEYS.zachmanTask, currentId), [currentId]);

  const task = taskById(currentId);
  const group = TASK_GROUPS.find((g) => g.key === groupKey) || TASK_GROUPS[0];
  const doneCount = UNIQUE_IDS.filter((id) => modelProgress[id]).length;

  function open(id, key = groupKey) {
    setCurrentId(id);
    setGroupKey(key);
    cardRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }
  const indexInGroup = group.ids.indexOf(currentId);
  const nextInGroup = indexInGroup >= 0 && indexInGroup < group.ids.length - 1 ? group.ids[indexInGroup + 1] : null;

  return (
    <div className="lg:flex lg:items-start lg:gap-6">
      <section ref={cardRef} className="scroll-mt-40 lg:order-2 lg:min-w-0 lg:flex-1">
        <TaskCard
          key={task.id}
          task={task}
          group={group}
          drafts={drafts}
          done={Boolean(modelProgress[task.id])}
          labels={labels}
          onToggleLabels={() => setLabels(!labels)}
          onSolve={onSolve}
          onReset={onReset}
          onNext={nextInGroup ? () => open(nextInGroup) : null}
        />
      </section>
      <nav aria-label="Uppgifter" className="card mt-6 p-4 lg:order-1 lg:mt-0 lg:w-80 lg:shrink-0">
        <p className="text-sm text-ink/70">
          <span className="tabular font-medium text-ink">{doneCount}</span> av {UNIQUE_IDS.length} klara
        </p>
        <div className="mt-3 space-y-4">
          {TASK_GROUPS.map((g) => {
            const solved = g.ids.filter((id) => modelProgress[id]).length;
            return (
              <div key={g.key}>
                <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-brass">
                  {g.title} <span className="tabular normal-case tracking-normal text-ink/65">· {solved}/{g.ids.length}</span>
                </h2>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {g.ids.map((id, i) => {
                    const on = id === currentId && g.key === groupKey;
                    return (
                      <button
                        key={`${g.key}-${id}`}
                        type="button"
                        onClick={() => open(id, g.key)}
                        aria-current={on ? "true" : undefined}
                        title={taskById(id).text}
                        className={`chip chip-sm tabular min-w-[2.25rem] justify-center ${on ? "chip-on" : ""}`}
                      >
                        {modelProgress[id] ? "✓" : g.key === "maj" ? taskById(id).no : i + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        {toEssay && (
          <button type="button" className="btn-quiet mt-4 px-0 text-sm" onClick={toEssay}>
            Zachman-essän i Essä →
          </button>
        )}
      </nav>
    </div>
  );
}

function TaskCard({ task, group, drafts, done, labels, onToggleLabels, onSolve, onReset, onNext }) {
  const isChoice = task.kind === "choice";
  const empty = isChoice ? { selected: [], graded: false } : { cells: [], motivering: "", graded: false };
  const draft = drafts.get(task.id, empty);
  const [confirmReset, setConfirmReset] = useState(false);
  const result = useMemo(() => {
    if (!draft.graded) return null;
    return isChoice ? gradeChoice(task, draft.selected) : gradePlacement(task, draft.cells);
  }, [draft, isChoice, task]);

  function update(patch) {
    drafts.set(task.id, { ...empty, ...draft, ...patch });
  }
  function toggleCell(code) {
    if (draft.graded) return;
    const cells = draft.cells || [];
    if (task.kind === "reverse") update({ cells: cells[0] === code ? [] : [code] });
    else update({ cells: cells.includes(code) ? cells.filter((c) => c !== code) : [...cells, code] });
  }
  function toggleOption(index) {
    if (draft.graded) return;
    const selected = draft.selected || [];
    update({ selected: selected.includes(index) ? selected.filter((i) => i !== index) : [...selected, index] });
  }
  function grade() {
    const graded = isChoice ? gradeChoice(task, draft.selected) : gradePlacement(task, draft.cells);
    update({ graded: true });
    if (graded.status === "ratt") onSolve(task.id, "solved");
  }
  function reset() {
    onReset(task.id);
    drafts.clear(task.id);
    setConfirmReset(false);
  }
  const hasAnswer = isChoice ? (draft.selected || []).length > 0 : (draft.cells || []).length > 0;
  const facitCells = task.kind === "choice" ? [] : [...task.cells, ...(task.also || [])];

  return (
    <div className="card p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-ink/65">
          {group.title}
          {task.kind === "choice" && ` · uppgift ${task.no}, ${task.points} p`}
          {done && <span className="ml-2 text-correct">✓ Klar</span>}
        </p>
        {(done || hasAnswer || draft.motivering) && !confirmReset && (
          <button type="button" className="btn-quiet text-sm" onClick={() => setConfirmReset(true)}>
            Nollställ uppgiften
          </button>
        )}
        {confirmReset && (
          <span className="flex gap-2 text-sm">
            <button type="button" className="btn-secondary" onClick={reset}>Ja, nollställ</button>
            <button type="button" className="btn-quiet" onClick={() => setConfirmReset(false)}>Avbryt</button>
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-ink/65">{group.note}</p>
      <h2 className="mt-3 font-sans text-[18px] font-medium leading-normal [font-variation-settings:normal] sm:text-[20px]">
        {task.kind === "reverse" ? (
          <>Vilken cell? <span className="text-pine">{task.text}</span></>
        ) : (
          task.text
        )}
      </h2>

      {isChoice ? (
        <fieldset className="mt-4 space-y-2">
          <legend className="text-sm text-ink/65">Välj ett eller flera alternativ</legend>
          {task.options.map((option, index) => {
            const picked = (draft.selected || []).includes(index);
            const isRight = draft.graded && index === task.correct;
            const isWrong = draft.graded && picked && index !== task.correct;
            return (
              <label
                key={option}
                className={`flex items-start gap-3 rounded-lg border p-3 text-[15px] ${draft.graded ? "" : "cursor-pointer hover:border-pine"} ${isRight ? "border-correct bg-correct-bg" : isWrong ? "border-wrong bg-wrong-bg" : "border-line"}`}
              >
                <input
                  type="checkbox"
                  checked={picked}
                  disabled={draft.graded}
                  onChange={() => toggleOption(index)}
                  className="mt-1 h-4 w-4 shrink-0 accent-pine"
                />
                <span>{option}</span>
              </label>
            );
          })}
        </fieldset>
      ) : (
        <>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-ink/65">
              {task.kind === "reverse" ? "Klicka på cellen." : "Klicka på en eller två celler."}
            </p>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-ink/70">
              <input type="checkbox" checked={labels} onChange={onToggleLabels} className="h-4 w-4 accent-pine" />
              Visa rad- och kolumnnamn
            </label>
          </div>
          <PickGrid
            chosen={draft.cells || []}
            graded={draft.graded}
            facit={facitCells}
            labels={labels}
            onCell={toggleCell}
          />
          {task.kind === "place" && (
            <label className="mt-4 block">
              <span className="font-display text-lg">Motivering</span>
              <textarea
                value={draft.motivering || ""}
                onChange={(event) => update({ motivering: event.target.value })}
                rows={3}
                placeholder="Varför just den cellen? Tentan kräver en motivering."
                className="mt-1 w-full rounded-lg border border-line bg-surface p-3 text-[15px] leading-relaxed"
              />
            </label>
          )}
        </>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {!draft.graded ? (
          <button type="button" className="btn-primary" onClick={grade} disabled={!hasAnswer}>
            Rätta
          </button>
        ) : (
          <button type="button" className="btn-secondary" onClick={() => update({ graded: false })}>
            Ändra svaret
          </button>
        )}
        {onNext && (
          <button type="button" className="btn-secondary" onClick={onNext}>
            Nästa →
          </button>
        )}
      </div>

      {result && <Feedback task={task} result={result} />}
    </div>
  );
}

function PickGrid({ chosen, graded, facit, labels, onCell }) {
  return (
    <div className="mt-3 overflow-x-auto">
      <div className="grid min-w-[18rem] grid-cols-[2.75rem_repeat(6,minmax(0,1fr))] gap-1 text-center">
        <div />
        {COLUMNS.map((col) => (
          <div key={col.code} className="py-1 text-[12px] leading-tight text-ink/70">
            <span className="block font-medium">{col.code}</span>
            {labels && <span className="block">{col.sv}</span>}
          </div>
        ))}
        {ROWS.map((row) => (
          <Fragment key={row.code}>
            <div className="flex flex-col justify-center text-[12px] leading-tight text-ink/70">
              <span className="font-medium">{row.code}</span>
              {labels && <span className="hidden sm:block">{row.perspective || "Enterprise"}</span>}
            </div>
            {COLUMNS.map((col) => {
              const code = `${row.code}${col.code}`;
              const picked = chosen.includes(code);
              const ok = facit.includes(code);
              let cls = "border-line hover:border-pine hover:text-pine";
              if (graded) {
                if (picked && ok) cls = "border-correct bg-correct-bg text-correct";
                else if (picked) cls = "border-wrong bg-wrong-bg text-wrong";
                else if (ok) cls = "border-correct border-dashed text-correct";
                else cls = "border-line text-ink/50";
              } else if (picked) cls = "border-pine bg-pine text-paper";
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => onCell(code)}
                  aria-pressed={picked}
                  disabled={graded}
                  className={`min-h-[2.5rem] rounded-md border text-[12px] tabular transition-colors ${cls}`}
                >
                  {code}
                </button>
              );
            })}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

const STATUS_TEXT = {
  ratt: "Rätt.",
  delvis: "Delvis rätt.",
  fel: "Fel.",
  tom: "Inget svar.",
};

function Feedback({ task, result }) {
  const ok = result.status === "ratt";
  return (
    <div className="mt-5 border-t border-line pt-4" role="status">
      <p className={`font-display text-lg ${ok ? "text-correct" : "text-wrong"}`}>{STATUS_TEXT[result.status]}</p>
      {task.kind !== "choice" && result.tooMany && (
        <p className="mt-1 text-[15px] text-ink/80">Högst två celler — välj de som bäst går att motivera.</p>
      )}
      {task.kind === "choice" ? (
        <p className="mt-2 text-[15px]">
          <span className="font-medium">Facit: </span>
          {task.options[task.correct]}
        </p>
      ) : (
        <p className="mt-2 text-[15px]">
          <span className="font-medium">Facit: </span>
          {task.cells.map((code) => `${code} (${CELLS[code].name})`).join(", ")}
          {task.also?.length > 0 && (
            <span className="text-ink/80">
              {" "}· godtas också: {task.also.map((code) => `${code} (${CELLS[code].name})`).join(", ")}
            </span>
          )}
        </p>
      )}
      <p className="mt-2 text-[15px] leading-relaxed text-ink/85">{task.why}</p>
      {task.grade === "T" && <p className="mt-2 text-sm text-ink/65">{UNOFFICIAL}</p>}
    </div>
  );
}
