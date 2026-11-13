import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import SegmentedControl from "../components/SegmentedControl.jsx";
import {
  CELLS, COLUMNS, MEMORY_ID, ROWS, TASK_GROUPS, taskById, zachmanTasks,
} from "../data/arkitektur/zachman.js";
import { gradeChoice, gradeMemory, gradePlacement, MEMORY_FIELDS } from "../lib/zachman.js";
import { KEYS, load, save } from "../lib/storage.js";
import { useDrafts } from "../lib/useDrafts.js";

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
        <h1 className="font-display text-2xl">Zachman</h1>
        <p className="mt-1 max-w-reading text-[15px] text-ink/70">
          Halva poängen på alla tre HT25-tentorna: en essä om raderna och kolumnerna (30 p) och
          placering av modeller i rutnätet (20 p). Rutnätet numreras som på tentan, R1–R6 × K1–K6.
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

// ---------------------------------------------------------------- Ramverket

function Framework({ toEssay }) {
  const [selected, setSelected] = useState({ type: "cell", code: "R2K4" });
  const isOn = (type, code) => selected.type === type && selected.code === code;
  return (
    <div className="space-y-5">
      <p className="max-w-reading text-[15px] text-ink/80">
        Klicka på en rad, en kolumn eller en cell. Celltyperna är 2003-affischens; namnen i
        version 3.0 står i rutan under.
      </p>
      <div className="card overflow-x-auto p-3 sm:p-4">
        <div className="grid min-w-[20rem] grid-cols-[3.25rem_repeat(6,minmax(0,1fr))] sm:grid-cols-[6rem_repeat(6,minmax(0,1fr))] gap-1 text-center">
          <div />
          {COLUMNS.map((col) => (
            <button
              key={col.code}
              type="button"
              onClick={() => setSelected({ type: "col", code: col.code })}
              aria-pressed={isOn("col", col.code)}
              className={`rounded-md border px-1 py-1.5 text-[12px] leading-tight transition-colors sm:text-[13px] ${isOn("col", col.code) ? "border-pine bg-pine text-paper" : "border-line bg-surface hover:border-pine hover:text-pine"}`}
            >
              <span className="block font-medium">{col.code}</span>
              <span className="block">{col.sv}</span>
              <span className="hidden opacity-75 sm:block">{col.en}</span>
            </button>
          ))}
          {ROWS.map((row) => (
            <Fragment key={row.code}>
              <button
                type="button"
                onClick={() => setSelected({ type: "row", code: row.code })}
                aria-pressed={isOn("row", row.code)}
                className={`rounded-md border px-1 py-1.5 text-[12px] leading-tight transition-colors sm:text-[13px] ${isOn("row", row.code) ? "border-pine bg-pine text-paper" : "border-line bg-surface hover:border-pine hover:text-pine"}`}
              >
                <span className="block font-medium">{row.code}</span>
                <span className="hidden sm:block">{row.perspective || "—"}</span>
              </button>
              {COLUMNS.map((col) => {
                const code = `${row.code}${col.code}`;
                const on = isOn("cell", code) || isOn("row", row.code) || isOn("col", col.code);
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setSelected({ type: "cell", code })}
                    aria-label={`${code}: ${CELLS[code].name}`}
                    aria-pressed={isOn("cell", code)}
                    className={`min-h-[2.75rem] rounded-md border px-1 py-1 text-[11px] leading-tight transition-colors sm:min-h-[3.5rem] sm:text-[12px] ${isOn("cell", code) ? "border-pine bg-pine text-paper" : on ? "border-pine/60 bg-pine/[0.08]" : "border-line hover:border-pine hover:text-pine"}`}
                  >
                    <span className="hidden sm:inline">{CELLS[code].name}</span>
                    <span className="sm:hidden">{code}</span>
                  </button>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
      <Detail selected={selected} />
      {toEssay && (
        <button type="button" className="btn-secondary" onClick={toEssay}>
          Skriv Zachman-essän →
        </button>
      )}
    </div>
  );
}

function Detail({ selected }) {
  if (selected.type === "col") {
    const col = COLUMNS.find((c) => c.code === selected.code);
    return (
      <section className="card p-5" aria-live="polite">
        <p className="text-sm text-ink/65">Kolumn {col.code}</p>
        <h2 className="mt-1 font-display text-xl">{col.sv} · {col.en} / {col.poster}</h2>
        <p className="mt-2 text-[15px] leading-relaxed">{col.about}</p>
        <p className="mt-2 text-[15px] leading-relaxed text-ink/80">
          <span className="font-medium text-ink">UF:s exempel från universitetet: </span>
          {col.example}
        </p>
      </section>
    );
  }
  if (selected.type === "row") {
    const row = ROWS.find((r) => r.code === selected.code);
    return (
      <section className="card p-5" aria-live="polite">
        <p className="text-sm text-ink/65">Rad {row.code}</p>
        <h2 className="mt-1 font-display text-xl">
          {row.name}{row.perspective ? ` — ${row.perspective}` : ""}
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed">{row.about}</p>
        <dl className="mt-3 grid gap-1 text-[15px] sm:grid-cols-[10rem_1fr]">
          <dt className="text-ink/65">2003-affischen</dt>
          <dd>{row.name}{row.perspective ? ` — ${row.perspective}` : ""}</dd>
          <dt className="text-ink/65">Version 3.0</dt>
          <dd>{row.v3} · {row.v3Model}</dd>
        </dl>
      </section>
    );
  }
  const cell = CELLS[selected.code];
  const row = ROWS.find((r) => selected.code.startsWith(r.code));
  const col = COLUMNS.find((c) => selected.code.endsWith(c.code));
  return (
    <section className="card p-5" aria-live="polite">
      <p className="text-sm text-ink/65">
        Cell {selected.code} · {row.name}{row.perspective ? ` (${row.perspective})` : ""} × {col.sv} ({col.en})
      </p>
      <h2 className="mt-1 font-display text-xl">{cell.name}</h2>
      {cell.pair && <p className="mt-2 font-mono text-[14px] text-ink/80">{cell.pair}</p>}
      <p className="mt-2 text-[15px] text-ink/80">
        <span className="text-ink/65">Version 3.0: </span>
        {cell.v3}
      </p>
      <p className="mt-2 text-sm text-ink/65">Varje cell är bara ett exempel på vilken sorts modell som kan användas.</p>
    </section>
  );
}

// ----------------------------------------------------------------- Memorera

const EMPTY_MEMORY = { answers: {}, checked: false };

function Memory({ drafts, done, onSolve, onReset }) {
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
        Skriv kolumnernas frågeord och radernas namn eller perspektiv, som tentans uppgift 1
        kräver. Svenska eller engelska, 2003- eller 3.0-namnen godtas. Det du skriver sparas.
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
