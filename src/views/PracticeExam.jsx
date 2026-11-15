import { useEffect, useMemo, useState } from "react";
import { PRACTICE_POINTS, PRACTICE_TASK3_RULE, PRACTICE_TASK3_INTRO, PRACTICE_TASK3F_TEXT, PRACTICE_TASK3G_TEXT } from "../data/databaser/practiceExams.js";
import { ExerciseFigure } from "../components/model/modelFigures.jsx";
import SchemaEditor from "../components/model/SchemaEditor.jsx";
import FdAnswer from "../components/fd/FdAnswer.jsx";
import ExamFdDrawing from "../components/fd/ExamFdDrawing.jsx";
import CodeBlock from "../components/java/CodeBlock.jsx";
import InlineText from "../components/java/InlineText.jsx";
import JavaResult from "../components/java/JavaResult.jsx";
import { Highlighted } from "../components/java/highlight.jsx";
import { checkDdl, toDdl, fold } from "../lib/ddlCheck.js";
import { parseSchema } from "../lib/modelCheck.js";
import { gradeAnswer } from "../lib/fdGrade.js";
import { checkJava } from "../lib/javaCheck.js";
import { formatJava } from "../lib/codeIndent.js";
import { loadEngine } from "../lib/sqlEngine.js";
import { scoreStatements } from "../lib/statementScore.js";
import { scoreDdlShare, scoreJavaShare, scoreTask3ae, scorePractice3f, scorePractice3g, gradeTask4 } from "../lib/examGrade.js";
import { load, save, examFdKey, clearExamFdDrawings } from "../lib/storage.js";
import { TaskHead, GradeBar, ScoreBox, Task1, Task4 } from "./DbExam.jsx";

// En egen övningstenta i fliken Tenta: fem uppgifter à 20 poäng
// (data/databaser/practiceExams.js). Samma rättare som HT25-tentorna och
// flikarna Modellera, SQL och Java; poängreglerna står i lib/examGrade.js.
// Inget betyg: det finns inga gränser för årets form. Svaren sparas per
// tenta i sysb23:tenta:<id> vid varje ändring; "Börja om" nollställer.

const N = [1, 2, 3, 4, 5];
const storeKey = (id) => `tenta:${id}`;
const emptyFd = () => ({ cks: [[]], roles: {}, nf: null, motivation: {}, text: "" });
const emptyState = () => ({
  t1: [], t2: "", t3: { ae: {}, fg: emptyFd(), self3f: null }, t4: "", t5: "",
  graded: { 1: false, 2: false, 3: false, 4: false, 5: false },
  scores: { 1: null, 2: null, 3: null, 4: null, 5: null },
});

export function loadPracticeState(id) {
  const saved = load(storeKey(id), null);
  const base = emptyState();
  if (!saved) return base;
  return {
    ...base,
    ...saved,
    t3: { ...base.t3, ...(saved.t3 || {}) },
    graded: { ...base.graded, ...(saved.graded || {}) },
    scores: { ...base.scores, ...(saved.scores || {}) },
  };
}

export const practiceTotal = (scores) => N.reduce((sum, n) => sum + (scores[n] ?? 0), 0);
export const practiceGraded = (scores) => N.some((n) => scores[n] !== null);

function gradeJava(code, task) {
  try {
    return checkJava(code, task);
  } catch {
    return { status: "parse-error", rules: [], errors: [{ message: "Svaret kunde inte läsas. Kontrollera att metoden är hel, med signaturen först och klamrarna parvis." }] };
  }
}

export default function PracticeExamRoom({ exam, onBack }) {
  const [state, setState] = useState(() => loadPracticeState(exam.id));
  const [tab, setTab] = useState(1);
  const [confirmReset, setConfirmReset] = useState(false);
  const [task4Result, setTask4Result] = useState(null);

  const update = (patch) => setState((prev) => {
    const next = typeof patch === "function" ? patch(prev) : { ...prev, ...patch };
    save(storeKey(exam.id), next);
    return next;
  });

  const r1 = useMemo(() => (state.graded[1] ? scoreStatements(exam.task1.statements, state.t1, PRACTICE_POINTS[1]) : null), [state.graded, state.t1, exam]);
  const r2 = useMemo(() => {
    if (!state.graded[2]) return null;
    const check = checkDdl(state.t2, exam.task2);
    return { check, score: scoreDdlShare(check, exam.task2.facit, PRACTICE_POINTS[2]) };
  }, [state.graded, state.t2, exam]);
  const r3 = useMemo(() => {
    if (!state.graded[3]) return null;
    const ae = scoreTask3ae(exam.task3, state.t3.ae);
    const draft = state.t3.fg;
    const grade = draft.nf ? gradeAnswer(exam.task3.fg, draft) : null;
    const f = scorePractice3f(grade, state.t3.self3f);
    const g = scorePractice3g(grade, draft);
    const aePoints = Math.max(0, ae.points);
    return { ae, aePoints, grade, f, g, points: aePoints + f.points + g.points };
  }, [state.graded, state.t3, exam]);
  const r5 = useMemo(() => {
    if (!state.graded[5]) return null;
    const check = gradeJava(state.t5, exam.task5);
    return { check, score: scoreJavaShare(check, PRACTICE_POINTS[5]) };
  }, [state.graded, state.t5, exam]);

  useEffect(() => {
    let cancelled = false;
    if (!state.graded[4]) { setTask4Result(null); return undefined; }
    loadEngine().then((SQL) => { if (!cancelled) setTask4Result(gradeTask4(SQL, exam.task4, state.t4, PRACTICE_POINTS[4])); });
    return () => { cancelled = true; };
  }, [state.graded, state.t4, exam]);

  // Poängen per uppgift sparas för startsidan.
  useEffect(() => {
    const scores = {
      1: r1 ? r1.points : null,
      2: r2 ? r2.score.points : null,
      3: r3 ? r3.points : null,
      4: state.graded[4] ? (task4Result ? task4Result.points : state.scores[4]) : null,
      5: r5 ? r5.score.points : null,
    };
    if (N.some((n) => scores[n] !== state.scores[n])) update((prev) => ({ ...prev, scores }));
  }, [r1, r2, r3, r5, task4Result]); // eslint-disable-line react-hooks/exhaustive-deps

  const grade = (n) => update((prev) => ({ ...prev, graded: { ...prev.graded, [n]: true } }));
  const ungrade = (n) => update((prev) => ({ ...prev, graded: { ...prev.graded, [n]: false }, scores: { ...prev.scores, [n]: null }, ...(n === 3 ? { t3: { ...prev.t3, self3f: null } } : {}) }));
  function reset() {
    const fresh = emptyState();
    save(storeKey(exam.id), fresh);
    clearExamFdDrawings(exam.id);
    setState(fresh);
    setTab(1);
    setConfirmReset(false);
  }

  const scores = state.scores;
  const all = N.every((n) => scores[n] !== null);
  return (
    <section>
      <button type="button" className="btn-quiet -ml-2 text-sm" onClick={onBack}>← Alla tentor</button>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-ink/65">Egen övningstenta · {exam.subtitle}</p>
          <h1 className="font-display text-3xl">{exam.title}</h1>
        </div>
        <div className="text-right">
          <p className="tabular font-display text-3xl" aria-live="polite">
            {practiceTotal(scores)} <span className="font-body text-lg text-ink/70">av 100</span>
          </p>
          <p className="text-xs text-ink/60">
            {all ? "Alla uppgifter rättade." : "Orättade uppgifter räknas som 0."} Uppgift 2 och 5 är uppskattningar.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Uppgifter" className="flex flex-wrap gap-2">
          {N.map((n) => (
            <button key={n} type="button" role="tab" aria-selected={tab === n} onClick={() => setTab(n)} className={`chip ${tab === n ? "chip-on" : ""}`}>
              Uppgift {n}
              <span className="tabular ml-1.5 text-[13px] opacity-80">{scores[n] === null ? "– /20" : `${scores[n]}/20`}</span>
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
        {tab === 1 && <Task1 task={exam.task1} marked={state.t1} setMarked={(t1) => update({ t1 })} result={r1} onGrade={() => grade(1)} onEdit={() => ungrade(1)} max={PRACTICE_POINTS[1]} />}
        {tab === 2 && <PTask2 task={exam.task2} code={state.t2} setCode={(t2) => update({ t2 })} result={r2} onGrade={() => grade(2)} onEdit={() => ungrade(2)} />}
        {tab === 3 && (
          <PTask3
            examId={exam.id}
            task={exam.task3}
            answers={state.t3}
            setT3={(patch) => update((prev) => ({ ...prev, t3: { ...prev.t3, ...(typeof patch === "function" ? patch(prev.t3) : patch) } }))}
            result={r3}
            onGrade={() => grade(3)}
            onEdit={() => ungrade(3)}
          />
        )}
        {tab === 4 && <Task4 task={exam.task4} code={state.t4} setCode={(t4) => update({ t4 })} graded={state.graded[4]} result={task4Result} self={null} setSelf={() => {}} onGrade={() => grade(4)} onEdit={() => ungrade(4)} max={PRACTICE_POINTS[4]} selfAssess={false} />}
        {tab === 5 && <PTask5 task={exam.task5} code={state.t5} setCode={(t5) => update({ t5 })} result={r5} onGrade={() => grade(5)} onEdit={() => ungrade(5)} />}
      </div>
    </section>
  );
}

// ---------- Uppgift 2: DDL, andel uppfyllda regler ----------

function PTask2({ task, code, setCode, result, onGrade, onEdit }) {
  const facitDdl = useMemo(() => toDdl(task.facit), [task]);
  const score = result?.score;
  return (
    <>
      <TaskHead n={2} points={score?.points} max={PRACTICE_POINTS[2]} />
      {task.text.map((p) => <p key={p} className="mt-2 max-w-reading text-[15px] leading-relaxed">{p}</p>)}
      <ExerciseFigure id={task.diagram} />
      <div className={`grid gap-4 ${result ? "xl:grid-cols-2" : ""}`}>
        <div>
          <SchemaEditor id="ovn-ddl" label="Ditt svar" value={code} onChange={(text) => { if (!result) setCode(text); }} rows={24} subscripts={false} />
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
        <ScoreBox ok={result.check.status === "correct"} title={<>{score.points} av 20 poäng <span className="font-body text-sm text-ink/70">· Uppskattning: andelen uppfyllda regler × 20, avrundat nedåt</span></>}>
          {score.parseError ? (
            <>
              <p className="mt-1 text-[15px]">Koden går inte att tolka, och det ger 0 poäng.</p>
              <ul className="mt-1 space-y-1 text-[15px]">{result.check.errors.map((err) => <li key={err.line + err.message}>{err.message}</li>)}</ul>
            </>
          ) : (
            <>
              <p className="mt-1 text-[15px] text-ink/80">{score.passed} av {score.total} regler uppfyllda (primärnyckel, kolumner, främmande nycklar med NULL-regel och UNIQUE per tabell).</p>
              {result.check.status !== "correct" && (
                <ul className="mt-2 space-y-3 text-[15px]">
                  {result.check.errors.map((err) => <li key={err.message}>{err.message}</li>)}
                  {result.check.tables.filter((t) => t.status !== "ok").map((t) => (
                    <li key={t.name}>
                      <span className="font-medium text-wrong">{t.name}{t.answerName && fold(t.answerName) !== fold(t.name) ? ` (${t.answerName})` : ""}: {t.status === "missing" ? "saknas" : "fel"}</span>
                      <ul className="ml-4 mt-1 list-disc space-y-1 pl-4">{t.problems.map((p) => <li key={p.text}>{p.text}</li>)}</ul>
                      {t.rule && <p className="mt-1 text-ink/80"><span className="font-medium">Varför — {t.rule.rule}:</span> {t.rule.why}</p>}
                    </li>
                  ))}
                  {result.check.extra.map((x) => (
                    <li key={"extra-" + x.name}>
                      <span className="font-medium text-wrong">{x.name}: överflödig tabell</span>
                      <p className="mt-1 text-ink/80">{x.why}</p>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
          {result.check.tips?.length > 0 && <ul className="mt-3 space-y-1 text-sm text-ink/70">{result.check.tips.map((tip) => <li key={tip}>{tip}</li>)}</ul>}
          {result.check.remarks?.length > 0 && <ul className="mt-3 space-y-1 text-sm text-ink/65">{result.check.remarks.map((n) => <li key={n}>Anmärkning: {n}</li>)}</ul>}
        </ScoreBox>
      )}
    </>
  );
}

// ---------- Uppgift 3: 3a–e, 3f och 3g på samma R ----------

function PTask3({ examId, task, answers, setT3, result, onGrade, onEdit }) {
  const ae = answers.ae || {};
  const locked = Boolean(result);
  const setAe = (label, value) => { if (!locked) setT3((t3) => ({ ae: { ...(t3.ae || {}), [label]: value } })); };
  const draft = answers.fg;
  const parsed = useMemo(() => parseSchema(draft.text || ""), [draft.text]);
  const item = task.fg;
  const facitText = item.facit ? item.facit.map((x) => `${x.name}(${x.attrs})  PK = {${x.pk.join("} eller {")}}`).join("\n") : "R är redan i 3NF — ingen nedbrytning.";
  return (
    <>
      <TaskHead n={3} points={result?.points} max={PRACTICE_POINTS[3]} />
      <p className="mt-2 text-[15px]">Givet är följande relation med funktionella beroenden:</p>
      <pre className="mt-2 overflow-x-auto rounded-lg border border-line bg-paper p-3 font-mono text-[14.5px] leading-relaxed text-ink">{[task.relation, ...task.fds].join("\n")}</pre>
      <p className="mt-3 text-[15px]">{PRACTICE_TASK3_INTRO}</p>
      <div className="mt-2 grid gap-3 sm:grid-cols-3">
        {task.schemas.map((s) => (
          <div key={s.name} className="rounded-lg border border-line bg-surface px-3 py-2">
            <p className="text-sm font-medium text-ink/80">{s.name}</p>
            <ul className="mt-1 font-mono text-[14px] leading-relaxed">{s.relations.map(([name, attrs]) => <li key={name}>{name}({attrs})</li>)}</ul>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[15px] text-ink/85">{PRACTICE_TASK3_RULE}</p>
      <ExamFdDrawing storageKey={examFdKey(examId, "R")} relation={task.relation} attrs={task.attrs} fds={task.fds} />
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

      <div className="mt-8 border-t border-line pt-5">
        <h3 className="font-display text-xl">Uppgift 3f</h3>
        <p className="mt-2 max-w-reading text-[15px] leading-relaxed">{PRACTICE_TASK3F_TEXT}</p>
        <h3 className="mt-5 font-display text-xl">Uppgift 3g</h3>
        {PRACTICE_TASK3G_TEXT.map((p) => <p key={p} className="mt-2 max-w-reading text-[15px] leading-relaxed">{p}</p>)}
        <p className="mt-3 text-sm text-ink/70">Svara på båda i panelen nedan: kandidatnyckel och attributens roller, högsta normalform med motivering (3f) och nedbrytningen (3g).</p>
        <FdAnswer item={item} draft={draft} setDraft={(patch) => { if (!locked) setT3((t3) => ({ fg: { ...t3.fg, ...patch } })); }} highlight={{}} parsed={parsed} result={result?.grade} showDiagram={false} />
      </div>

      <GradeBar graded={locked} onGrade={onGrade} onEdit={onEdit} note="Rättar 3a–3g." />
      {result && (
        <ScoreBox ok={result.points === 20} title={<>{result.points} av 20 poäng</>}>
          <ul className="mt-1 space-y-1 text-[15px] text-ink/85">
            <li>3a–3e: {result.aePoints} av 10{result.ae.points < 0 ? " (summan under noll räknas som 0)" : ""}.</li>
            <li>3f: {result.f.points} av 5 — {result.f.blank ? "ingen normalform vald." : result.f.needsSelf ? `normalformen ${result.f.nfPoints} av 2, motiveringen ${result.f.selfPoints} av 3 (din bedömning).` : result.f.nfPoints ? "R är i 3NF, motivering krävs inte." : "fel normalform."}</li>
            <li>3g: {result.g.points} av 5 — {result.g.blank ? "ingen normalform vald." : result.g.ok ? "förlustfri, beroendebevarande, i 3NF och inte övernormaliserad." : "nedbrytningen uppfyller inte alla krav (5 eller 0 poäng)."}</li>
          </ul>
          {result.grade && <p className="mt-2 text-sm text-ink/75">{result.grade.fields.nf.why}</p>}
          {result.grade?.fields.decomposition?.feedback?.lines?.filter((l) => !l.ok).length > 0 && (
            <ul className="mt-2 space-y-1 text-sm text-ink/80">{result.grade.fields.decomposition.feedback.lines.filter((l) => !l.ok).map((l, i) => <li key={i}>✗ {l.text}</li>)}</ul>
          )}
          {result.f.needsSelf && (
            <div className="mt-4">
              <p className="text-sm font-medium text-ink/80">3f: bedöm din motivering mot checklistan (0–3 poäng)</p>
              <ul className="mt-1 list-disc space-y-0.5 pl-5 text-[15px] text-ink/85">{item.checklist.map((c) => <li key={c}>{c}</li>)}</ul>
              {result.grade?.fields.motivation && (
                <p className="mt-2 text-sm text-ink/75">
                  Ditt val av beroende i panelen är {result.grade.fields.motivation.ok ? "rätt" : "inte ett som bryter normalformen"}. Godtagen motivering, till exempel: {result.grade.fields.motivation.accepted[0]?.sentence}
                </p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Självbedömd poäng för motiveringen">
                <span className="text-sm">Din poäng:</span>
                {[0, 1, 2, 3].map((v) => (
                  <button key={v} type="button" role="radio" aria-checked={answers.self3f === v} onClick={() => setT3({ self3f: v })} className={`chip chip-sm ${answers.self3f === v ? "chip-on" : ""}`}>{v}</button>
                ))}
              </div>
            </div>
          )}
          <p className="mt-4 text-sm font-medium text-ink/80">Facit</p>
          <pre className="mt-1 overflow-x-auto rounded-lg border border-line bg-surface px-3 py-2 font-mono text-[13.5px] leading-relaxed">{`${item.nf}\n${facitText}`}</pre>
        </ScoreBox>
      )}
    </>
  );
}

// ---------- Uppgift 5: JDBC, andel uppfyllda regler ----------

const JAVA_INDENT = { "{": 1, "(": 2 };
const highlightJava = (text) => <Highlighted code={text} lang="java" />;

function PTask5({ task, code, setCode, result, onGrade, onEdit }) {
  const signature = task.blocks.find((b) => b.code && b.lang === "java" && !/\bclass\b/.test(b.code))?.code ?? "";
  const score = result?.score;
  return (
    <>
      <TaskHead n={5} points={score?.points} max={PRACTICE_POINTS[5]} />
      <div className="mt-3 max-w-reading space-y-3 text-[15px] leading-relaxed">
        {task.blocks.map((block, i) => (block.code ? <CodeBlock key={i} code={block.code} lang={block.lang} /> : <p key={i}><InlineText text={block.p} /></p>))}
      </div>
      <div className="mt-5">
        <SchemaEditor
          id="ovn-java"
          label="Ditt svar"
          value={code}
          onChange={(text) => { if (!result) setCode(text); }}
          placeholder={`${signature} {\n}`}
          rows={18}
          subscripts={false}
          indentWidth={4}
          indentAfter={JAVA_INDENT}
          smartIndent
          highlight={highlightJava}
          onSubmit={() => { if (!result && code.trim()) onGrade(); }}
          format={formatJava}
        />
      </div>
      <GradeBar graded={Boolean(result)} onGrade={onGrade} onEdit={onEdit} disabled={!code.trim()} note="Rättas regel för regel som i fliken Java." />
      {result && (
        <>
          <p className="tabular mt-4 font-display text-lg">{score.points} av 20 poäng <span className="font-body text-sm text-ink/70">· Uppskattning: {score.parseError ? "svaret går inte att tolka" : `${score.passed} av ${score.total} regler uppfyllda`}, × 20 avrundat nedåt</span></p>
          <JavaResult result={result.check} />
          <div className="mt-4 min-w-0">
            <CodeBlock code={task.solution} lang="java" label="Lösningsförslag" />
          </div>
        </>
      )}
    </>
  );
}
