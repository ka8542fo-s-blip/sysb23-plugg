import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import QuestionCard from "../components/QuestionCard.jsx";
import { viewFor } from "../lib/shuffle.js";
import { pointsLabel } from "../lib/pastExams.js";
import { examResult, scorePart, writtenParts } from "../lib/choiceExam.js";
import { KEYS, choiceExamKey, clearChoiceExam, load, save } from "../lib/storage.js";

// Fliken Tenta för flervalstentor (course.choiceExams; Säkerhet): skriv en
// hel gammal tenta som på riktigt. Tentans frågor i tentans ordning, med
// tentans alternativordning, poäng och avdrag. Man kan byta och rensa svar
// fritt; inget facit och ingen poäng syns förrän tentan är inlämnad. Efter
// inlämning: summa av 100, betyg, och per fråga rätt svar, poäng och
// förklaring. Svaren sparas för sig (sysb23:tenta:<id>) och rör aldrig Öva.
// Uppställningen följer Öva: sidopanel till vänster, en fråga i taget.

const emptyState = () => ({ choices: {}, current: "1", submittedAt: null });
function loadExamState(id) {
  const saved = load(choiceExamKey(id), null);
  if (!saved || typeof saved !== "object") return emptyState();
  return { ...emptyState(), ...saved, choices: { ...(saved.choices || {}) } };
}

export default function ChoiceExam({ course }) {
  const exams = course.choiceExams;
  // Öppen tenta per delkurs, så att en omladdning landar i tentan.
  const [openId, setOpenId] = useState(() => {
    const saved = load(KEYS.choiceExamOpen, {})[course.id];
    return exams.some((exam) => exam.id === saved) ? saved : null;
  });
  useEffect(() => {
    const all = load(KEYS.choiceExamOpen, {});
    if (openId) all[course.id] = openId;
    else delete all[course.id];
    save(KEYS.choiceExamOpen, all);
  }, [course.id, openId]);

  const exam = exams.find((item) => item.id === openId);
  return exam ? (
    <ExamRoom key={exam.id} course={course} exam={exam} onBack={() => setOpenId(null)} />
  ) : (
    <ExamList course={course} exams={exams} rule={course.answerRule} table={course.answerTable} onOpen={setOpenId} />
  );
}

// ---------- Översikten ----------

function ExamList({ course, exams, rule, table, onOpen }) {
  const rows = exams.map((exam) => {
    const state = loadExamState(exam.id);
    const parts = writtenParts(course, exam);
    return { exam, state, parts, result: examResult(parts, state.choices) };
  });
  return (
    <div className="space-y-6">
      <section>
        <h1 className="font-display text-3xl">Tenta</h1>
        <p className="mt-2 max-w-reading text-[15px] leading-relaxed text-ink/80">
          Skriv en hel gammal tenta som på riktigt: tentans frågor i tentans ordning, med tentans
          poäng och avdrag. Byt svar så mycket du vill — facit, poäng och förklaringar visas först när
          du lämnat in. Svaren här räknas för sig och påverkar inte Öva.
        </p>
      </section>

      {table?.length > 0 && <AnswerTable rule={rule} table={table} />}

      <ul className="grid gap-4 md:grid-cols-3">
        {rows.map(({ exam, state, parts, result }) => {
          const submitted = Boolean(state.submittedAt);
          const started = result.answered > 0;
          return (
            <li key={exam.id} className="card flex flex-col p-5">
              <p className="text-sm text-ink/65">{exam.dateLabel}</p>
              <h2 className="mt-1 font-display text-xl">{exam.title}</h2>
              <p className="mt-1 text-sm text-ink/65">
                {parts.length} flervalsfrågor · {result.max} p
              </p>
              <p className="tabular mt-3 text-[15px]">
                {submitted ? (
                  <>
                    <span className="font-display text-2xl">{result.points}</span> av {result.max} · Betyg{" "}
                    <span className="font-display text-2xl">{result.grade}</span>
                  </>
                ) : started ? (
                  <span>Pågår · {result.answered} av {parts.length} besvarade</span>
                ) : (
                  <span className="text-ink/65">Inte påbörjad</span>
                )}
              </p>
              <button type="button" className="btn-primary mt-4 self-start" onClick={() => onOpen(exam.id)}>
                {submitted ? "Se resultatet" : started ? "Fortsätt" : "Skriv tentan"}
              </button>
            </li>
          );
        })}
      </ul>
      {course.pastExamNote && <p className="text-sm text-ink/65">{course.pastExamNote}</p>}
    </div>
  );
}

// "När lönar det sig att svara?" — visas på översikten, inte inne i en tenta.
function AnswerTable({ rule, table }) {
  return (
    <section className="card max-w-3xl p-5 sm:p-6">
      <h2 className="font-display text-xl">När lönar det sig att svara?</h2>
      {rule && <p className="mt-2 text-[15px] leading-relaxed text-ink/80">{rule}</p>}
      <div className="mt-4 overflow-x-auto">
        <table className="tabular w-full text-left text-[15px]">
          <thead>
            <tr className="border-b border-line text-sm text-ink/70">
              <th scope="col" className="py-2 pr-4 font-medium">Poäng / avdrag</th>
              <th scope="col" className="py-2 pr-4 font-medium">Svara om du är säkrare än</th>
              <th scope="col" className="py-2 font-medium">Ren gissning</th>
            </tr>
          </thead>
          <tbody>
            {table.map((row) => (
              <tr key={row.pairs.map((pair) => pair.join("/")).join(",")} className="border-b border-line/60 last:border-0">
                <td className="whitespace-nowrap py-2 pr-4">
                  {row.pairs.map(([points, penalty]) => `${points} / ${penalty ? `−${penalty}` : "0"}`).join(", ")}
                  {row.label && <span className="text-ink/65"> ({row.label})</span>}
                </td>
                <td className="py-2 pr-4">{row.percent} %</td>
                <td className="py-2">{row.advice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ---------- En tenta ----------

const TILE = {
  open: "border-line text-ink/75",
  answered: "border-pine text-pine",
  ratt: "border-correct/60 bg-correct-bg text-ink",
  fel: "border-wrong/60 bg-wrong-bg text-ink",
  blank: "border-line text-ink/75",
};
const GLYPH = { answered: ["•", "border-pine/60 text-pine"], ratt: ["✓", "border-correct/60 text-correct"], fel: ["✕", "border-wrong/60 text-wrong"], blank: ["–", "border-line-strong text-ink/65"] };
const LABEL = { open: "obesvarad", answered: "besvarad", ratt: "rätt", fel: "fel", blank: "obesvarad, 0 p" };

function ExamRoom({ course, exam, onBack }) {
  const parts = useMemo(() => writtenParts(course, exam), [course, exam]);
  const [state, setState] = useState(() => loadExamState(exam.id));
  const [confirm, setConfirm] = useState(null); // "lamna-in" | "borja-om"
  const cardRef = useRef(null);
  const scrollToCard = useRef(false);

  const update = useCallback(
    (patch) =>
      setState((prev) => {
        const next = typeof patch === "function" ? patch(prev) : { ...prev, ...patch };
        save(choiceExamKey(exam.id), next);
        return next;
      }),
    [exam.id],
  );

  const submitted = Boolean(state.submittedAt);
  const result = useMemo(() => examResult(parts, state.choices), [parts, state.choices]);
  const index = Math.max(0, parts.findIndex((part) => part.no === state.current));
  const part = parts[index];
  const view = useMemo(
    () => viewFor(part.item, part.order.map((original) => ({ ...part.item.options[original], originalIndex: original }))),
    [part],
  );
  const choice = state.choices[part.no];
  const chosen = choice === undefined || choice === null ? null : part.order.indexOf(choice);

  const go = useCallback(
    (no) => {
      scrollToCard.current = true;
      setConfirm(null);
      update({ current: no });
    },
    [update],
  );
  const step = useCallback(
    (delta) => {
      const next = parts[index + delta];
      if (next) go(next.no);
    },
    [parts, index, go],
  );
  const choose = useCallback(
    (shown) => {
      if (submitted) return;
      update((prev) => ({ ...prev, choices: { ...prev.choices, [part.no]: part.order[shown] } }));
    },
    [submitted, update, part],
  );
  const clearChoice = () =>
    update((prev) => {
      const choices = { ...prev.choices };
      delete choices[part.no];
      return { ...prev, choices };
    });
  const submit = () => {
    update((prev) => ({ ...prev, submittedAt: new Date().toISOString(), current: parts[0].no }));
    setConfirm(null);
    scrollToCard.current = true;
  };
  const restart = () => {
    clearChoiceExam(exam.id);
    setState(emptyState());
    setConfirm(null);
  };

  // Efter ett frågebyte: visa början av frågan under den klistrade headern.
  useEffect(() => {
    if (!scrollToCard.current || !cardRef.current) return;
    scrollToCard.current = false;
    const header = document.querySelector("header")?.offsetHeight ?? 0;
    const top = cardRef.current.getBoundingClientRect().top + window.scrollY - header - 12;
    if (top < window.scrollY) window.scrollTo({ top });
    cardRef.current.focus({ preventScroll: true });
  }, [state.current, state.submittedAt]);

  // Tangentbord som i Öva: 1–4 väljer, ← och → byter fråga. Inget byter
  // fråga av sig självt.
  useEffect(() => {
    function onKeyDown(event) {
      const tag = event.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (/^[1-9]$/.test(event.key) && Number(event.key) <= view.options.length) {
        if (submitted) return;
        event.preventDefault();
        choose(Number(event.key) - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [view, submitted, choose, step]);

  const tileState = (p) => {
    const c = state.choices[p.no];
    if (submitted) return scorePart(p, c).status;
    return c === undefined || c === null ? "open" : "answered";
  };
  const unanswered = parts.length - result.answered;
  const score = submitted ? scorePart(part, choice) : null;

  return (
    <div className="space-y-6 lg:flex lg:items-start lg:gap-8 lg:space-y-0">
      <section className="card p-5 lg:sticky lg:top-36 lg:max-h-[calc(100vh-11rem)] lg:w-80 lg:shrink-0 lg:overflow-y-auto">
        <button type="button" className="btn-quiet -ml-2 text-sm" onClick={onBack}>
          ← Alla tentor
        </button>
        <p className="mt-2 text-sm text-ink/65">{exam.dateLabel}</p>
        <h1 className="font-display text-2xl">{exam.title}</h1>

        {submitted ? (
          <div className="mt-3" role="status">
            <p className="tabular font-display text-3xl">
              {result.points} <span className="font-body text-lg text-ink/70">av {result.max}</span>
              <span className="ml-3 font-body text-lg">
                Betyg <span className="font-display text-2xl">{result.grade}</span>
              </span>
            </p>
            <p className="tabular mt-1 text-sm text-ink/70">
              {result.right} rätt · {result.wrong} fel · {result.blank} obesvarade
            </p>
          </div>
        ) : (
          <p className="tabular mt-3 text-[15px] text-ink/80">
            {result.answered} av {parts.length} besvarade
          </p>
        )}

        <ol className="mt-4 flex flex-wrap gap-1.5" aria-label={`${exam.title}, frågor`}>
          {parts.map((p) => {
            const s = tileState(p);
            const glyph = GLYPH[s];
            const here = p.no === part.no;
            return (
              <li key={p.no}>
                <button
                  type="button"
                  onClick={() => go(p.no)}
                  aria-current={here ? "true" : undefined}
                  aria-label={`Fråga ${p.no}, ${LABEL[s]}`}
                  className={`tabular relative inline-flex h-11 min-w-[2.75rem] items-center justify-center rounded-lg border px-2 text-sm transition-colors duration-150 hover:border-pine sm:h-10 ${TILE[s]} ${here ? "ring-2 ring-pine ring-offset-1 ring-offset-surface" : ""}`}
                >
                  {p.no}
                  {glyph && (
                    <span
                      aria-hidden="true"
                      className={`absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full border bg-surface text-[10px] leading-none ${glyph[1]}`}
                    >
                      {glyph[0]}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ol>

        <div className="mt-6 border-t border-line pt-4">
          {confirm === "lamna-in" ? (
            <div>
              <p className="text-sm text-ink/70">
                {unanswered > 0
                  ? `${unanswered} ${unanswered === 1 ? "obesvarad fråga ger" : "obesvarade frågor ger"} 0 p. Lämna in tentan?`
                  : "Alla frågor är besvarade. Lämna in tentan?"}{" "}
                Efter inlämning går svaren inte att ändra.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button type="button" className="btn-primary" onClick={submit}>
                  Ja, lämna in
                </button>
                <button type="button" className="btn-quiet" onClick={() => setConfirm(null)}>
                  Avbryt
                </button>
              </div>
            </div>
          ) : confirm === "borja-om" ? (
            <div>
              <p className="text-sm text-ink/70">
                Alla svar{submitted ? " och resultatet" : ""} i {exam.title.toLowerCase()} {exam.dateLabel} raderas. Öva och de andra tentorna rörs inte.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button type="button" className="btn-secondary" onClick={restart}>
                  Ja, börja om
                </button>
                <button type="button" className="btn-quiet" onClick={() => setConfirm(null)}>
                  Avbryt
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              {!submitted && (
                <button type="button" className="btn-primary" onClick={() => setConfirm("lamna-in")}>
                  Lämna in
                </button>
              )}
              <button type="button" className="btn-quiet px-0 text-sm" onClick={() => setConfirm("borja-om")}>
                {submitted ? "Skriv tentan igen" : "Börja om"}
              </button>
            </div>
          )}
        </div>
      </section>

      <div className="min-w-0 flex-1">
        <div ref={cardRef} tabIndex={-1} className="focus:outline-none">
          <QuestionCard
            question={part.item}
            view={view}
            chosen={chosen}
            revealed={submitted}
            onChoose={choose}
            skippedLabel="Obesvarad, 0 p"
            tag={
              <>
                <span className="rounded-full border border-brass/50 px-2.5 py-0.5 text-xs font-medium text-brass-text">
                  Fråga {part.no} av {parts.length}
                </span>
                <span className="tabular text-ink/70">{pointsLabel(part)}</span>
                {score && (
                  <span className={`tabular font-medium ${score.status === "ratt" ? "text-correct" : score.status === "fel" ? "text-wrong" : "text-ink/70"}`}>
                    {score.points > 0 ? `+${score.points}` : score.points < 0 ? `−${-score.points}` : "0"} p
                  </span>
                )}
              </>
            }
          >
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" className="btn-secondary" disabled={index === 0} onClick={() => step(-1)}>
                ← Föregående
              </button>
              <button type="button" className="btn-secondary" disabled={index === parts.length - 1} onClick={() => step(1)}>
                Nästa →
              </button>
              {!submitted && chosen !== null && (
                <button type="button" className="btn-quiet" onClick={clearChoice}>
                  Rensa svaret
                </button>
              )}
              <span className="text-sm text-ink/65">
                Tangentbord: 1–{view.options.length} väljer, ← och → byter fråga.
              </span>
            </div>
          </QuestionCard>
        </div>
      </div>
    </div>
  );
}
