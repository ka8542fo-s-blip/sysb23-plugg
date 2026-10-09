import { useEffect, useMemo, useState } from "react";
import { oldExams, TASK_POINTS, TASK3_RULE, TASK3_INTRO, TASK3FG_TEXT } from "../data/databaser/oldExams.js";
import { ExerciseFigure } from "../components/model/modelFigures.jsx";
import SchemaEditor from "../components/model/SchemaEditor.jsx";
import FdAnswer from "../components/fd/FdAnswer.jsx";
import SqlEditor from "../components/sql/SqlEditor.jsx";
import ResultTable from "../components/sql/ResultTable.jsx";
import { checkDdl, toDdl, fold } from "../lib/ddlCheck.js";
import { parseSchema } from "../lib/modelCheck.js";
import { gradeAnswer } from "../lib/fdGrade.js";
import { loadEngine } from "../lib/sqlEngine.js";
import { scoreTask1, estimateDdl, DDL_LABELS, scoreTask3ae, scoreTask3fg, gradeTask4 } from "../lib/examGrade.js";
import { load, save } from "../lib/storage.js";

// Fliken Tenta: de tre HT25-tentorna, exakt deras uppgifter. Ingen
// tidtagning; varje uppgift rättas för sig med tentans poängregler, och
// summan visas av 100. Svaren sparas per tenta i sysb23:tenta:<id> medan man
// arbetar; "Börja om" nollställer.

const storeKey = (id) => `tenta:${id}`;
const emptyFd = () => ({ cks: [[]], roles: {}, nf: null, motivation: {}, text: "" });
const emptyState = () => ({
  t1: [], t2: "", t3: { ae: {}, f: emptyFd(), g: emptyFd() }, t4: "", t4self: null,
  graded: { 1: false, 2: false, 3: false, 4: false }, scores: { 1: null, 2: null, 3: null, 4: null },
});
function loadState(id) {
  const saved = load(storeKey(id), null);
  if (!saved) return emptyState();
  const base = emptyState();
  return { ...base, ...saved, t3: { ...base.t3, ...(saved.t3 || {}) }, graded: { ...base.graded, ...(saved.graded || {}) }, scores: { ...base.scores, ...(saved.scores || {}) } };
}

const total = (scores) => [1, 2, 3, 4].reduce((sum, n) => sum + (scores[n] ?? 0), 0);
const isGraded = (scores) => [1, 2, 3, 4].some((n) => scores[n] !== null);

export default function DbExam() {
  const [examId, setExamId] = useState(null);
  const exam = oldExams.find((e) => e.id === examId);
  return exam ? <ExamRoom key={exam.id} exam={exam} onBack={() => setExamId(null)} /> : <ExamList onOpen={setExamId} />;
}

// ---------- Startsidan ----------

function ExamList({ onOpen }) {
  const states = oldExams.map((e) => loadState(e.id));
  return (
    <section>
      <h1 className="font-display text-3xl">Tenta</h1>
      <p className="mt-2 max-w-reading text-[15px] leading-relaxed text-ink/80">
        De tre HT25-tentorna med exakt deras uppgifter. Varje uppgift rättas för sig med tentans poängregler.
        Tentorna har inget publicerat facit — facit här är sajtens eget.
      </p>
      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {oldExams.map((e, i) => {
          const scores = states[i].scores;
          return (
            <li key={e.id} className="card flex flex-col p-5">
              <p className="text-sm text-ink/65">{e.dateLabel}</p>
              <h2 className="mt-1 font-display text-xl">{e.title}</h2>
              <p className="tabular mt-3 text-[15px]">
                {isGraded(scores) ? <><span className="font-display text-2xl">{total(scores)}</span> av 100 senast</> : <span className="text-ink/65">Inte påbörjad</span>}
              </p>
              <dl className="tabular mt-2 grid grid-cols-4 gap-1 text-center text-sm">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="rounded border border-line px-1 py-1">
                    <dt className="text-xs text-ink/60">Uppg. {n}</dt>
                    <dd>{scores[n] === null ? "–" : `${scores[n]}/${TASK_POINTS[n]}`}</dd>
                  </div>
                ))}
              </dl>
              <button type="button" className="btn-primary mt-4 self-start" onClick={() => onOpen(e.id)}>
                {isGraded(scores) ? "Fortsätt" : "Öppna tentan"}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// ---------- En tenta ----------

function ExamRoom({ exam, onBack }) {
  const [state, setState] = useState(() => loadState(exam.id));
  const [tab, setTab] = useState(1);
  const [confirmReset, setConfirmReset] = useState(false);
  const [task4Result, setTask4Result] = useState(null);

  const update = (patch) => setState((prev) => {
    const next = typeof patch === "function" ? patch(prev) : { ...prev, ...patch };
    save(storeKey(exam.id), next);
    return next;
  });

  // Synkrona rättningar räknas om ur sparade svar; uppgift 4 körs i sql.js.
  const r1 = useMemo(() => (state.graded[1] ? scoreTask1(exam.task1, state.t1) : null), [state.graded, state.t1, exam]);
  const r2 = useMemo(() => {
    if (!state.graded[2]) return null;
    const check = checkDdl(state.t2, exam.task2);
    return { check, estimate: estimateDdl(check) };
  }, [state.graded, state.t2, exam]);
  const r3 = useMemo(() => {
    if (!state.graded[3]) return null;
    const ae = scoreTask3ae(exam.task3, state.t3.ae);
    const fg = ["f", "g"].map((k) => {
      const item = exam.task3[k];
      const draft = state.t3[k];
      const grade = draft.nf ? gradeAnswer(item, draft) : null;
      return { key: k, item, grade, score: grade ? scoreTask3fg(item, grade, draft) : { parts: [], points: 0, max: 5, blank: true } };
    });
    return { ae, fg, points: Math.max(0, ae.points + fg.reduce((sum, x) => sum + x.score.points, 0)) };
  }, [state.graded, state.t3, exam]);

  useEffect(() => {
    let cancelled = false;
    if (!state.graded[4]) { setTask4Result(null); return; }
    loadEngine().then((SQL) => { if (!cancelled) setTask4Result(gradeTask4(SQL, exam.task4, state.t4)); });
    return () => { cancelled = true; };
  }, [state.graded, state.t4, exam]);

  // Poängen per uppgift sparas för startsidan.
  const task4Points = task4Result ? (task4Result.status === "correct" ? 30 : state.t4self ?? 0) : null;
  useEffect(() => {
    const scores = {
      1: r1 ? r1.points : null,
      2: r2 ? r2.estimate.points : null,
      3: r3 ? r3.points : null,
      4: state.graded[4] ? task4Points : null,
    };
    if ([1, 2, 3, 4].some((n) => scores[n] !== state.scores[n]) && !(state.graded[4] && task4Points === null)) update({ scores });
  }, [r1, r2, r3, task4Points]); // eslint-disable-line react-hooks/exhaustive-deps

  const grade = (n) => update((prev) => ({ ...prev, graded: { ...prev.graded, [n]: true } }));
  const ungrade = (n) => update((prev) => ({ ...prev, graded: { ...prev.graded, [n]: false }, scores: { ...prev.scores, [n]: null }, ...(n === 4 ? { t4self: null } : {}) }));
  function reset() {
    const fresh = emptyState();
    save(storeKey(exam.id), fresh);
    setState(fresh);
    setTab(1);
    setConfirmReset(false);
  }

  const scores = state.scores;
  return (
    <section>
      <button type="button" className="btn-quiet -ml-2 text-sm" onClick={onBack}>← Alla tentor</button>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-ink/65">{exam.dateLabel}</p>
          <h1 className="font-display text-3xl">{exam.title}</h1>
        </div>
        <div className="text-right">
          <p className="tabular font-display text-3xl" aria-live="polite">{total(scores)} <span className="font-body text-lg text-ink/70">av 100</span></p>
          <p className="text-xs text-ink/60">Orättade uppgifter räknas som 0.</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Uppgifter" className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              type="button"
              role="tab"
              aria-selected={tab === n}
              onClick={() => setTab(n)}
              className={`chip ${tab === n ? "chip-on" : ""}`}
            >
              Uppgift {n}
              <span className="tabular ml-1.5 text-[13px] opacity-80">{scores[n] === null ? `– /${TASK_POINTS[n]}` : `${scores[n]}/${TASK_POINTS[n]}`}</span>
            </button>
          ))}
        </div>
        {!confirmReset ? (
          <button type="button" className="btn-quiet text-sm" onClick={() => setConfirmReset(true)}>Börja om</button>
        ) : (
          <span className="flex items-center gap-2 text-sm">
            <span>Radera alla svar i tentan?</span>
            <button type="button" className="btn-secondary" onClick={reset}>Ja, börja om</button>
            <button type="button" className="btn-quiet" onClick={() => setConfirmReset(false)}>Avbryt</button>
          </span>
        )}
      </div>

      <div className="card mt-4 p-5">
        {tab === 1 && <Task1 task={exam.task1} marked={state.t1} setMarked={(t1) => update({ t1 })} result={r1} onGrade={() => grade(1)} onEdit={() => ungrade(1)} />}
        {tab === 2 && <Task2 task={exam.task2} code={state.t2} setCode={(t2) => update({ t2 })} result={r2} onGrade={() => grade(2)} onEdit={() => ungrade(2)} />}
        {tab === 3 && <Task3 task={exam.task3} answers={state.t3} setAnswers={(patch) => update((prev) => ({ ...prev, t3: { ...prev.t3, ...(typeof patch === "function" ? patch(prev.t3) : patch) } }))} result={r3} onGrade={() => grade(3)} onEdit={() => ungrade(3)} />}
        {tab === 4 && <Task4 task={exam.task4} code={state.t4} setCode={(t4) => update({ t4 })} graded={state.graded[4]} result={task4Result} self={state.t4self} setSelf={(t4self) => update({ t4self })} onGrade={() => grade(4)} onEdit={() => ungrade(4)} />}
      </div>
    </section>
  );
}

// ---------- Gemensamt ----------

function TaskHead({ n, points, label }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2">
      <h2 className="font-display text-2xl">Uppgift {n}</h2>
      <p className="tabular text-sm text-ink/70">{label ?? `${TASK_POINTS[n]} poäng`}{points !== undefined && points !== null ? ` · ${points} av ${TASK_POINTS[n]}` : ""}</p>
    </div>
  );
}

function GradeBar({ graded, onGrade, onEdit, disabled, note }) {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-3">
      {!graded ? (
        <button type="button" className="btn-primary" onClick={onGrade} disabled={disabled}>Rätta</button>
      ) : (
        <button type="button" className="btn-secondary" onClick={onEdit}>Ändra svaret</button>
      )}
      {note && <span className="text-sm text-ink/65">{note}</span>}
    </div>
  );
}

function ScoreBox({ ok, title, children }) {
  return (
    <div className={`mt-4 rounded-lg border-l-2 p-4 ${ok ? "border-correct bg-correct-bg" : "border-wrong bg-wrong-bg"}`} role="status">
      <p className="font-display text-lg">{title}</p>
      {children}
    </div>
  );
}

// ---------- Uppgift 1 ----------

const OUTCOME = {
  hit: ["Korrekt, markerat: +5", "text-correct"],
  "false-alarm": ["Felaktigt, markerat: −3", "text-wrong"],
  miss: ["Korrekt, inte markerat: 0", "text-wrong"],
  "correct-blank": ["Felaktigt, inte markerat: 0", "text-correct"],
};

function Task1({ task, marked, setMarked, result, onGrade, onEdit }) {
  const toggle = (i) => setMarked(marked.includes(i) ? marked.filter((x) => x !== i) : [...marked, i]);
  return (
    <>
      <TaskHead n={1} points={result?.points} />
      <p className="mt-2 text-[15px]">{task.intro}</p>
      <ExerciseFigure id={task.diagram} />
      <p className="text-[15px]">{task.instruction}</p>
      <ul className="mt-2 list-disc space-y-0.5 pl-5 text-[15px] text-ink/85">
        {task.rules.map((rule) => <li key={rule}>{rule}</li>)}
      </ul>
      <p className="mt-4 text-sm font-medium text-ink/80">Välj ett eller flera alternativ:</p>
      <ul className="mt-2 space-y-2" aria-label="Påståenden">
        {task.statements.map((st, i) => {
          const row = result?.rows[i];
          const tone = row ? (row.outcome === "hit" || row.outcome === "correct-blank" ? "border-correct/40 bg-correct-bg" : "border-wrong/40 bg-wrong-bg") : marked.includes(i) ? "border-pine bg-pine/[0.08]" : "border-line hover:border-pine hover:bg-pine/[0.06]";
          return (
            <li key={st.text}>
              <label className={`flex cursor-pointer gap-3 rounded-lg border px-3 py-2 text-[15px] transition-colors duration-150 ${tone}`}>
                <input type="checkbox" checked={marked.includes(i)} onChange={() => toggle(i)} disabled={Boolean(result)} className="mt-1 h-4 w-4 shrink-0 accent-pine" />
                <span className="min-w-0">
                  <span className="whitespace-pre-line">{st.text}</span>
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
      <GradeBar graded={Boolean(result)} onGrade={onGrade} onEdit={onEdit} note={`${marked.length} markerade`} />
      {result && (
        <ScoreBox ok={result.exact} title={<>{result.points} av 25 poäng</>}>
          <p className="mt-1 text-[15px] text-ink/80">
            {result.exact
              ? "Alla och endast de korrekta påståendena markerade."
              : `${result.hits} korrekta markerade (+${result.hits * 5}), ${result.falseAlarms} felaktiga markerade (−${result.falseAlarms * 3}), ${result.misses} korrekta omarkerade.${result.raw < 0 ? " Summan under noll räknas som 0." : ""}`}
          </p>
        </ScoreBox>
      )}
    </>
  );
}

// ---------- Uppgift 2 ----------

function Task2({ task, code, setCode, result, onGrade, onEdit }) {
  const facitDdl = useMemo(() => toDdl(task.facit), [task]);
  const est = result?.estimate;
  return (
    <>
      <TaskHead n={2} points={est?.points} />
      {task.text.map((p) => <p key={p} className="mt-2 max-w-reading text-[15px] leading-relaxed">{p}</p>)}
      <ExerciseFigure id={task.diagram} />
      <div className="grid gap-4 xl:grid-cols-2">
        <div>
          <SchemaEditor id="tenta-ddl" label="Ditt svar" value={code} onChange={(text) => { if (!result) setCode(text); }} rows={24} subscripts={false} />
          <p className="mt-1 text-xs text-ink/65">Rättas som struktur: ordning, namn på surrogat- och FK-kolumner, INT eller INTEGER och var en constraint står spelar ingen roll.</p>
        </div>
        {result && (
          <div>
            <p className="mb-1 text-sm font-medium text-ink/80">Facit</p>
            <pre className="overflow-x-auto rounded-lg border border-line bg-paper px-4 py-3 font-mono text-[13px] leading-relaxed text-ink">{facitDdl}</pre>
          </div>
        )}
      </div>
      <GradeBar graded={Boolean(result)} onGrade={onGrade} onEdit={onEdit} disabled={!code.trim()} />
      {result && (
        <ScoreBox ok={result.check.status === "correct"} title={<>{est.points} av 25 poäng <span className="font-body text-sm text-ink/70">· Uppskattad poäng — tentan anger inte avdragen</span></>}>
          {est.parseError ? (
            <>
              <p className="mt-1 text-[15px]">Koden går inte att tolka, och det ger 0 poäng.</p>
              <ul className="mt-1 space-y-1 text-[15px]">{result.check.errors.map((err) => <li key={err.line + err.message}>{err.message}</li>)}</ul>
            </>
          ) : est.deductions.length === 0 ? (
            <p className="mt-1 text-[15px]">Alla tabeller stämmer med facit.</p>
          ) : (
            <ul className="mt-2 space-y-3 text-[15px]">
              {result.check.tables.filter((t) => t.status !== "ok").map((t) => (
                <li key={t.name}>
                  <span className="font-medium text-wrong">{t.name}{t.answerName && fold(t.answerName) !== fold(t.name) ? ` (${t.answerName})` : ""}: {t.status === "missing" ? "saknas" : "fel"}</span>
                  <ul className="ml-4 mt-1 space-y-1">
                    {t.problems.map((p) => (
                      <li key={p.text} className="flex gap-2">
                        <span className="tabular mt-0.5 h-fit shrink-0 rounded border border-wrong/40 px-1.5 text-[11px] font-medium text-wrong">−{est.deductions.find((d) => d.text === p.text)?.points ?? 0} {DDL_LABELS[p.kind ?? "kolumn"]}</span>
                        <span>{p.text}</span>
                      </li>
                    ))}
                  </ul>
                  {t.rule && <p className="mt-1 text-ink/80"><span className="font-medium">Varför — {t.rule.rule}:</span> {t.rule.why}</p>}
                </li>
              ))}
              {result.check.extra.map((x) => (
                <li key={"extra-" + x.name}>
                  <span className="font-medium text-wrong">{x.name}: överflödig tabell</span>
                  <p className="mt-1 flex gap-2 text-ink/80">
                    <span className="tabular mt-0.5 h-fit shrink-0 rounded border border-wrong/40 px-1.5 text-[11px] font-medium text-wrong">−{est.deductions.find((d) => d.table === x.name && d.kind === "overflodig")?.points ?? 0}</span>
                    <span>{x.why}</span>
                  </p>
                </li>
              ))}
            </ul>
          )}
          {result.check.remarks?.length > 0 && <ul className="mt-3 space-y-1 text-sm text-ink/65">{result.check.remarks.map((n) => <li key={n}>Anmärkning: {n}</li>)}</ul>}
        </ScoreBox>
      )}
    </>
  );
}

// ---------- Uppgift 3 ----------

function Givet({ task }) {
  return (
    <pre className="mt-2 overflow-x-auto rounded-lg border border-line bg-paper p-3 font-mono text-[14.5px] leading-relaxed text-ink">{[task.relation, ...task.fds].join("\n")}</pre>
  );
}

function Task3({ task, answers, setAnswers, result, onGrade, onEdit }) {
  const ae = answers.ae || {};
  const locked = Boolean(result);
  const setAe = (label, value) => { if (!locked) setAnswers((t3) => ({ ae: { ...(t3.ae || {}), [label]: value } })); };
  return (
    <>
      <TaskHead n={3} points={result?.points} />
      <Givet task={task} />
      <p className="mt-3 text-[15px]">{TASK3_INTRO}</p>
      <div className="mt-2 grid gap-3 sm:grid-cols-3">
        {task.schemas.map((s) => (
          <div key={s.name} className="rounded-lg border border-line bg-white px-3 py-2">
            <p className="text-sm font-medium text-ink/80">{s.name}</p>
            <ul className="mt-1 font-mono text-[14px] leading-relaxed">{s.relations.map(([name, attrs]) => <li key={name}>{name}({attrs})</li>)}</ul>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[15px] text-ink/85">{TASK3_RULE}</p>
      <ul className="mt-3 space-y-3">
        {task.statements.map((s) => {
          const row = result?.ae.rows.find((x) => x.label === s.label);
          return (
            <li key={s.label} className={`rounded-lg border px-3 py-2 ${row ? (row.points > 0 ? "border-correct/40 bg-correct-bg" : row.points < 0 ? "border-wrong/40 bg-wrong-bg" : "border-line") : "border-line"}`}>
              <p className="text-[15px]"><span className="mr-2 font-medium">Uppgift {s.label}</span>Påstående: {s.text}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2" role="radiogroup" aria-label={`Svar på ${s.label}`}>
                {[["S", "Sant"], ["F", "Falskt"]].map(([v, label]) => (
                  <button key={v} type="button" role="radio" aria-checked={ae[s.label] === v} disabled={locked} onClick={() => setAe(s.label, ae[s.label] === v ? null : v)} className={`chip chip-sm ${ae[s.label] === v ? "chip-on" : ""}`}>{label}</button>
                ))}
                {!ae[s.label] && <span className="text-xs text-ink/55">Obesvarad</span>}
              </div>
              {row && (
                <p className="mt-2 text-sm">
                  <span className={`font-medium ${row.points > 0 ? "text-correct" : "text-wrong"}`}>
                    {row.expected === "S" ? "Sant" : "Falskt"} · {row.given === null ? "obesvarad, 0" : row.points > 0 ? "+2" : "−1"}.
                  </span>{" "}
                  <span className="text-ink/80">{row.why}</span>
                </p>
              )}
            </li>
          );
        })}
      </ul>

      {["f", "g"].map((k) => (
        <Task3fg key={k} item={task[k]} draft={answers[k]} setDraft={(patch) => { if (!locked) setAnswers((t3) => ({ [k]: { ...t3[k], ...patch } })); }} graded={result?.fg.find((x) => x.key === k)} />
      ))}

      <GradeBar graded={locked} onGrade={onGrade} onEdit={onEdit} note="Rättar 3a–3g." />
      {result && (
        <ScoreBox ok={result.points === 20} title={<>{result.points} av 20 poäng</>}>
          <p className="mt-1 text-[15px] text-ink/80">
            3a–3e: {result.ae.points} av 10. {result.fg.map((x) => `${x.item.label}: ${x.score.points} av 5`).join(", ")} (uppskattat — tentan anger inte fördelningen).
            {result.ae.points + result.fg.reduce((s, x) => s + x.score.points, 0) < 0 ? " Summan under noll räknas som 0." : ""}
          </p>
        </ScoreBox>
      )}
    </>
  );
}

function Task3fg({ item, draft, setDraft, graded }) {
  const parsed = useMemo(() => parseSchema(draft.text || ""), [draft.text]);
  const facitText = item.facit ? item.facit.map((r) => `${r.name}(${r.attrs})  PK = {${r.pk.join("} eller {")}}`).join("\n") : "R är redan i 3NF — ingen nedbrytning.";
  return (
    <div className="mt-8 border-t border-line pt-5">
      <h3 className="font-display text-xl">Uppgift {item.label}</h3>
      <p className="mt-2 text-[15px]">Givet är följande relation med funktionella beroenden:</p>
      <pre className="mt-2 overflow-x-auto rounded-lg border border-line bg-paper p-3 font-mono text-[14.5px] leading-relaxed text-ink">{[item.relation, ...item.fds].join("\n")}</pre>
      {TASK3FG_TEXT.map((p) => <p key={p} className="mt-2 max-w-reading text-[15px] leading-relaxed">{p}</p>)}
      <FdAnswer item={item} draft={draft} setDraft={setDraft} highlight={{}} parsed={parsed} result={graded?.grade} showDiagram={false} />
      {graded && (
        <div className={`mt-4 rounded-lg border-l-2 p-4 ${graded.score.points === 5 ? "border-correct bg-correct-bg" : "border-wrong bg-wrong-bg"}`}>
          <p className="font-display text-lg">{graded.score.points} av 5 poäng <span className="font-body text-sm text-ink/70">· uppskattad fördelning</span></p>
          {graded.score.blank ? (
            <p className="mt-1 text-[15px]">Ingen normalform vald.</p>
          ) : (
            <ul className="mt-1 space-y-1 text-[15px]">
              {graded.score.parts.map((p) => <li key={p.label}><span className="font-medium">{p.label}: {p.points} av {p.max}.</span> <span className="text-ink/80">{p.text}</span></li>)}
              {graded.grade?.fields.decomposition?.feedback?.lines?.filter((l) => !l.ok).map((l, i) => <li key={i} className="text-ink/80">✗ {l.text}</li>)}
            </ul>
          )}
          <p className="mt-2 text-sm text-ink/70">{graded.grade?.fields.nf.why}</p>
          <p className="mt-3 text-sm font-medium text-ink/80">Facit</p>
          <pre className="mt-1 overflow-x-auto rounded-lg border border-line bg-white px-3 py-2 font-mono text-[13.5px] leading-relaxed">{`${item.nf}\n${facitText}`}</pre>
          {graded.grade?.fields.motivation && <p className="mt-2 text-sm text-ink/80">Godtagen motivering, till exempel: {graded.grade.fields.motivation.accepted[0]?.sentence}</p>}
        </div>
      )}
    </div>
  );
}

// ---------- Uppgift 4 ----------

function Task4({ task, code, setCode, graded, result, self, setSelf, onGrade, onEdit }) {
  const points = graded && result ? (result.status === "correct" ? 30 : self ?? 0) : null;
  return (
    <>
      <TaskHead n={4} points={points} />
      <p className="mt-2 text-[15px]">Givet är följande tabeller:</p>
      <div className="mt-2 grid gap-4 lg:grid-cols-3">
        {task.tables.map((t) => (
          <ResultTable key={t.name} caption={t.name} result={{ columns: t.columns.map(([c]) => c), values: t.rows }} />
        ))}
      </div>
      <p className="mt-4 text-[15px]">Skriv en (1) SQL-fråga som returnerar</p>
      <p className="mt-2 rounded-lg border-l-2 border-brass bg-brass/[0.07] px-4 py-2 text-[15px] leading-relaxed">{task.ask}</p>
      {task.tail.map((p) => <p key={p} className="mt-2 text-[15px]">{p}</p>)}
      <div className="mt-4">
        <SqlEditor value={code} onChange={(v) => { if (!graded) setCode(v); }} onRun={() => { if (!graded && code.trim()) onGrade(); }} label="Ditt svar" rows={14} disabled={graded} />
      </div>
      <GradeBar graded={graded} onGrade={onGrade} onEdit={onEdit} disabled={!code.trim()} note="Körs mot tentans data i SQLite, med kursens T-SQL översatt." />
      {graded && !result && <p className="mt-4 text-sm text-ink/65">Kör frågan …</p>}
      {graded && result && (
        <ScoreBox ok={result.status === "correct"} title={<>{points} av 30 poäng{result.status !== "correct" && self !== null ? <span className="font-body text-sm text-ink/70"> · självbedömd</span> : ""}</>}>
          <p className="mt-1 text-[15px]">{result.message}</p>
          {task.avgNote && <p className="mt-2 text-[15px] text-ink/80">{task.avgNote}</p>}
          {(result.user || result.control) && (
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              {result.user && <ResultTable caption="Ditt resultat" result={result.user} />}
              <ResultTable caption="Facit (SQL Server)" result={result.expected} />
              {result.control && <ResultTable caption={`Ditt resultat på kontrolldatan (${result.control.label})`} result={result.control.user} />}
              {result.control && <ResultTable caption="Facit på kontrolldatan" result={result.control.expected} />}
            </div>
          )}
          {result.status !== "correct" && (
            <div className="mt-4">
              <p className="text-sm font-medium text-ink/80">Jämför med facit och sätt delpoäng själv</p>
              <ul className="mt-1 list-disc space-y-0.5 pl-5 text-[15px] text-ink/85">{task.checklist.map((c) => <li key={c}>{c}</li>)}</ul>
              <label className="mt-2 flex items-center gap-2 text-sm">
                <span>Självbedömd poäng (0–30):</span>
                <input type="number" min={0} max={30} value={self ?? ""} onChange={(e) => { const v = e.target.value === "" ? null : Math.max(0, Math.min(30, Math.round(Number(e.target.value)))); setSelf(Number.isFinite(v) ? v : null); }} className="tabular w-20 rounded-lg border border-line bg-white px-2 py-1" />
              </label>
            </div>
          )}
          <p className="mt-4 text-sm font-medium text-ink/80">Facit</p>
          <pre className="mt-1 overflow-x-auto rounded-lg border border-line bg-white px-4 py-3 font-mono text-[13px] leading-relaxed">{task.solution}</pre>
          <p className="mt-2 text-[15px] text-ink/80">{task.explanation}</p>
        </ScoreBox>
      )}
    </>
  );
}
