import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import QuestionCard from "../components/QuestionCard.jsx";
import { viewFor } from "../lib/shuffle.js";
import { pointsLabel } from "../lib/pastExams.js";
import { examResult, scorePart, writtenParts } from "../lib/choiceExam.js";
import { drawYearExam } from "../lib/yearExam.js";
import { KEYS, choiceExamKey, clearChoiceExam, load, save } from "../lib/storage.js";

// Fliken Tenta för flervalstentor (course.choiceExams; Säkerhet): skriv en
// hel gammal tenta som på riktigt. Tentans frågor i tentans ordning, med
// tentans alternativordning, poäng och avdrag. Man kan byta och rensa svar
// fritt; inget facit och ingen poäng syns förrän tentan är inlämnad. Efter
// inlämning: summa av 100, betyg, och per fråga rätt svar, poäng och
// förklaring. Svaren sparas för sig (sysb23:tenta:<id>) och rör aldrig Öva.
// Uppställningen följer Öva: sidopanel till vänster, en fråga i taget.
//
// Provtentor i årets format (course.yearExam, lib/yearExam.js): dras ur
// kapitelfrågorna och sparas i sin helhet i sysb23:provtentor:<delkurs>
// (frågor, alternativordning, essäer), så att en påbörjad provtenta aldrig
// ändras. De har essädelar utanför poängen (text och checklista sparas) och
// visar inget betyg så länge poängen per fråga är okänd (showGrade).

const emptyState = () => ({ choices: {}, texts: {}, checks: {}, current: "1", submittedAt: null });
function loadExamState(id) {
  const saved = load(choiceExamKey(id), null);
  if (!saved || typeof saved !== "object") return emptyState();
  return {
    ...emptyState(),
    ...saved,
    choices: { ...(saved.choices || {}) },
    texts: { ...(saved.texts || {}) },
    checks: { ...(saved.checks || {}) },
  };
}

const generatedKey = (courseId) => `provtentor:${courseId}`;
const loadGenerated = (courseId) => {
  const list = load(generatedKey(courseId), []);
  return Array.isArray(list) ? list.filter((exam) => exam && exam.id && Array.isArray(exam.sections)) : [];
};

// Essädelarna i en tenta, med essän ur course.essays.
const essayParts = (course, exam) =>
  exam.sections
    .flatMap((section) => section.parts)
    .filter((part) => part.essay)
    .map((part) => ({ ...part, essayItem: (course.essays || []).find((e) => e.id === part.essay) }))
    .filter((part) => part.essayItem);

export default function ChoiceExam({ course }) {
  const [generated, setGenerated] = useState(() => loadGenerated(course.id));
  const exams = [...generated, ...course.choiceExams];
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

  function storeGenerated(next) {
    save(generatedKey(course.id), next);
    setGenerated(next);
  }
  function drawNew() {
    const number = generated.reduce((max, exam) => Math.max(max, Number(exam.title.match(/\d+$/)?.[0]) || 0), 0) + 1;
    const exam = drawYearExam(course, `${Date.now().toString(36)}${number}`, number);
    storeGenerated([exam, ...generated]);
    setOpenId(exam.id);
  }
  function removeGenerated(id) {
    clearChoiceExam(id);
    storeGenerated(generated.filter((exam) => exam.id !== id));
    if (openId === id) setOpenId(null);
  }

  const exam = exams.find((item) => item.id === openId);
  return exam ? (
    <ExamRoom key={exam.id} course={course} exam={exam} onBack={() => setOpenId(null)} />
  ) : (
    <ExamList
      course={course}
      generated={generated}
      exams={course.choiceExams}
      rule={course.answerRule}
      table={course.answerTable}
      onOpen={setOpenId}
      onDraw={course.yearExam ? drawNew : null}
      onRemove={removeGenerated}
    />
  );
}

// Poängraden på kortet och i rummet: betyg för förra årets tentor, poäng
// och procent för provtentor så länge poängen per fråga är okänd.
function ScoreLine({ course, exam, result, large = false }) {
  const showGrade = !exam.generated || course.yearExam?.showGrade;
  const big = large ? "font-display text-3xl" : "font-display text-2xl";
  const percent = result.max ? Math.round((100 * result.points) / result.max) : 0;
  return (
    <>
      <span className={big}>{result.points}</span> av {result.max}
      {showGrade ? (
        <>
          {" · "}Betyg <span className={large ? "font-display text-2xl" : big}>{result.grade}</span>
        </>
      ) : (
        <span className="text-ink/70"> · {percent} %</span>
      )}
    </>
  );
}

// ---------- Översikten ----------

function ExamCard({ course, exam, onOpen, onRemove }) {
  const [confirmRemove, setConfirmRemove] = useState(false);
  const state = loadExamState(exam.id);
  const parts = writtenParts(course, exam);
  const essays = essayParts(course, exam);
  const result = examResult(parts, state.choices);
  const submitted = Boolean(state.submittedAt);
  const started = result.answered > 0 || essays.some((p) => state.texts[p.no]?.trim());
  return (
    <li className="card flex flex-col p-5">
      <p className="text-sm text-ink/65">{exam.dateLabel}</p>
      <h2 className="mt-1 font-display text-xl">{exam.title}</h2>
      <p className="mt-1 text-sm text-ink/65">
        {parts.length} flervalsfrågor · {result.max} p{essays.length > 0 ? ` · ${essays.length} essäer` : ""}
      </p>
      <p className="tabular mt-3 text-[15px]">
        {submitted ? (
          <ScoreLine course={course} exam={exam} result={result} />
        ) : started ? (
          <span>Pågår · {result.answered} av {parts.length} besvarade</span>
        ) : (
          <span className="text-ink/65">Inte påbörjad</span>
        )}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" className="btn-primary" onClick={() => onOpen(exam.id)}>
          {submitted ? "Se resultatet" : started ? "Fortsätt" : "Skriv tentan"}
        </button>
        {onRemove && !confirmRemove && (
          <button type="button" className="btn-quiet px-0 text-sm" onClick={() => setConfirmRemove(true)}>
            Ta bort
          </button>
        )}
      </div>
      {onRemove && confirmRemove && (
        <div className="mt-3">
          <p className="text-sm text-ink/70">Provtentan och alla svar i den raderas.</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button type="button" className="btn-secondary" onClick={() => onRemove(exam.id)}>
              Ja, ta bort
            </button>
            <button type="button" className="btn-quiet" onClick={() => setConfirmRemove(false)}>
              Avbryt
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

function ExamList({ course, generated = [], exams, rule, table, onOpen, onDraw, onRemove }) {
  const year = course.yearExam;
  return (
    <div className="space-y-6">
      <section>
        <h1 className="font-display text-3xl">Tenta</h1>
        <p className="mt-2 max-w-reading text-[15px] leading-relaxed text-ink/80">
          {year
            ? "Skriv en hel tenta som på riktigt. Byt svar så mycket du vill — facit, poäng och förklaringar visas först när du lämnat in. Svaren här räknas för sig och påverkar inte Öva."
            : "Skriv en hel gammal tenta som på riktigt: tentans frågor i tentans ordning, med tentans poäng och avdrag. Byt svar så mycket du vill — facit, poäng och förklaringar visas först när du lämnat in. Svaren här räknas för sig och påverkar inte Öva."}
        </p>
      </section>

      {year && (
        <section className="space-y-4">
          <div className="max-w-reading">
            <h2 className="font-display text-2xl">Årets format</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink/80">{year.intro}</p>
            <p className="mt-2 text-sm text-ink/65">{year.rule}</p>
          </div>
          <button type="button" className="btn-primary" onClick={onDraw}>
            Dra en ny provtenta
          </button>
          {generated.length > 0 && (
            <ul className="grid gap-4 md:grid-cols-3">
              {generated.map((exam) => (
                <ExamCard key={exam.id} course={course} exam={exam} onOpen={onOpen} onRemove={onRemove} />
              ))}
            </ul>
          )}
        </section>
      )}

      <section className="space-y-4">
        {year && (
          <div className="max-w-reading">
            <h2 className="font-display text-2xl">Förra årets tentor</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink/80">{year.pastNote}</p>
          </div>
        )}
        {table?.length > 0 && <AnswerTable rule={rule} table={table} />}
        <ul className="grid gap-4 md:grid-cols-3">
          {exams.map((exam) => (
            <ExamCard key={exam.id} course={course} exam={exam} onOpen={onOpen} />
          ))}
        </ul>
        {course.pastExamNote && <p className="text-sm text-ink/65">{course.pastExamNote}</p>}
      </section>
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
  // Essäerna (provtentor) ligger efter flervalsfrågorna och räknas inte i poängen.
  const essays = useMemo(() => essayParts(course, exam), [course, exam]);
  const items = useMemo(() => [...parts, ...essays].sort((a, b) => Number(a.no) - Number(b.no)), [parts, essays]);
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
  const index = Math.max(0, items.findIndex((item) => item.no === state.current));
  const currentItem = items[index];
  // `part` är aktuell flervalsfråga; null när en essä visas.
  const part = currentItem?.item ? currentItem : null;
  const view = useMemo(
    () => (part ? viewFor(part.item, part.order.map((original) => ({ ...part.item.options[original], originalIndex: original }))) : null),
    [part],
  );
  const choice = part ? state.choices[part.no] : undefined;
  const chosen = !part || choice === undefined || choice === null ? null : part.order.indexOf(choice);

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
      const next = items[index + delta];
      if (next) go(next.no);
    },
    [items, index, go],
  );
  const choose = useCallback(
    (shown) => {
      if (submitted || !part) return;
      update((prev) => ({ ...prev, choices: { ...prev.choices, [part.no]: part.order[shown] } }));
    },
    [submitted, update, part],
  );
  const setText = (no, text) => {
    if (!submitted) update((prev) => ({ ...prev, texts: { ...prev.texts, [no]: text } }));
  };
  const toggleCheck = (no, i) =>
    update((prev) => {
      const list = [...(prev.checks[no] || [])];
      list[i] = !list[i];
      return { ...prev, checks: { ...prev.checks, [no]: list } };
    });
  const clearChoice = () =>
    update((prev) => {
      const choices = { ...prev.choices };
      delete choices[part.no];
      return { ...prev, choices };
    });
  const submit = () => {
    update((prev) => ({ ...prev, submittedAt: new Date().toISOString(), current: items[0].no }));
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
      if (view && /^[1-9]$/.test(event.key) && Number(event.key) <= view.options.length) {
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
    if (p.essay) return state.texts[p.no]?.trim() ? "answered" : "open";
    const c = state.choices[p.no];
    if (submitted) return scorePart(p, c).status;
    return c === undefined || c === null ? "open" : "answered";
  };
  const unanswered = parts.length - result.answered;
  const emptyEssays = essays.filter((p) => !state.texts[p.no]?.trim()).length;
  const score = submitted && part ? scorePart(part, choice) : null;

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
            <p className="tabular font-body text-lg">
              <ScoreLine course={course} exam={exam} result={result} large />
            </p>
            <p className="tabular mt-1 text-sm text-ink/70">
              {result.right} rätt · {result.wrong} fel · {result.blank} obesvarade
            </p>
            {exam.generated && !course.yearExam?.showGrade && (
              <p className="mt-1 text-xs text-ink/60">Betyget går inte att räkna ut förrän poängen per fråga är känd.</p>
            )}
          </div>
        ) : (
          <p className="tabular mt-3 text-[15px] text-ink/80">
            {result.answered} av {parts.length} besvarade
          </p>
        )}

        <ol className="mt-4 flex flex-wrap gap-1.5" aria-label={`${exam.title}, frågor`}>
          {items.map((p) => {
            const s = tileState(p);
            const glyph = GLYPH[s];
            const here = p.no === currentItem.no;
            return (
              <li key={p.no}>
                <button
                  type="button"
                  onClick={() => go(p.no)}
                  aria-current={here ? "true" : undefined}
                  aria-label={`${p.essay ? "Essä" : "Fråga"} ${p.no}, ${p.essay ? (s === "answered" ? "skriven" : "tom") : LABEL[s]}`}
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
                  ? `${unanswered} ${unanswered === 1 ? "obesvarad fråga ger" : "obesvarade frågor ger"} 0 p.`
                  : "Alla flervalsfrågor är besvarade."}
                {emptyEssays > 0 ? ` ${emptyEssays === 1 ? "En essä är tom." : `${emptyEssays} essäer är tomma.`}` : ""}{" "}
                Lämna in tentan?{" "}
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
          {!part ? (
            <EssayPart
              item={currentItem}
              total={items.length}
              text={state.texts[currentItem.no] || ""}
              checks={state.checks[currentItem.no] || []}
              submitted={submitted}
              onText={(text) => setText(currentItem.no, text)}
              onCheck={(i) => toggleCheck(currentItem.no, i)}
              onStep={step}
              isFirst={index === 0}
              isLast={index === items.length - 1}
            />
          ) : (
          <QuestionCard
            // Ingen svårighetsgrad i en tenta: den står inte heller på den riktiga.
            question={{ ...part.item, difficulty: undefined }}
            view={view}
            chosen={chosen}
            revealed={submitted}
            onChoose={choose}
            skippedLabel="Obesvarad, 0 p"
            tag={
              <>
                <span className="rounded-full border border-brass/50 px-2.5 py-0.5 text-xs font-medium text-brass-text">
                  Fråga {part.no} av {items.length}
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
              <button type="button" className="btn-secondary" disabled={index === items.length - 1} onClick={() => step(1)}>
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
          )}
        </div>
      </div>
    </div>
  );
}

// En essädel i en provtenta: fritext före inlämning, sedan essäns checklista
// (bockarna sparas) och disposition. Utanför poängen.
function EssayPart({ item, total, text, checks, submitted, onText, onCheck, onStep, isFirst, isLast }) {
  const essay = item.essayItem;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  let pointIndex = -1;
  return (
    <article className="card mx-auto w-full max-w-reading p-5 sm:p-7">
      <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink/65">
        <span className="rounded-full border border-brass/50 px-2.5 py-0.5 text-xs font-medium text-brass-text">
          Fråga {item.no} av {total} · essä
        </span>
        <span>utanför poängen</span>
      </div>
      {essay.context && <p className="mb-2 text-sm text-ink/65">{essay.context}</p>}
      <h2 className="font-sans text-[18px] font-medium leading-normal text-ink sm:text-[20px]">{essay.question}</h2>
      <label className="mt-4 block text-sm font-medium text-ink/80" htmlFor={`essa-${item.no}`}>
        Ditt svar
      </label>
      <textarea
        id={`essa-${item.no}`}
        value={text}
        onChange={(event) => onText(event.target.value)}
        readOnly={submitted}
        rows={12}
        className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-[15px] leading-relaxed"
      />
      <p className="tabular mt-1 text-xs text-ink/60">Ord: {words}{submitted ? "" : " · sparas automatiskt"}</p>

      {submitted && (
        <div className="mt-5 border-t border-line pt-4">
          <p className="font-display text-lg">Checklista</p>
          <p className="mt-1 text-sm text-ink/65">Kryssa i det du fick med. Bockarna sparas.</p>
          {essay.checklist.map((group) => (
            <div key={group.heading} className="mt-3">
              <p className="text-sm font-medium text-ink/80">{group.heading}</p>
              <ul className="mt-1 space-y-1.5">
                {group.points.map((point) => {
                  pointIndex += 1;
                  const i = pointIndex;
                  return (
                    <li key={point}>
                      <label className="flex cursor-pointer gap-2 text-[15px] leading-relaxed">
                        <input type="checkbox" checked={Boolean(checks[i])} onChange={() => onCheck(i)} className="mt-1.5 h-4 w-4 shrink-0 accent-pine" />
                        <span>{point}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          {essay.outline && (
            <p className="mt-4 text-sm leading-relaxed text-ink/75">
              <span className="font-medium text-ink/80">Disposition: </span>
              {essay.outline}
            </p>
          )}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="button" className="btn-secondary" disabled={isFirst} onClick={() => onStep(-1)}>
          ← Föregående
        </button>
        <button type="button" className="btn-secondary" disabled={isLast} onClick={() => onStep(1)}>
          Nästa →
        </button>
      </div>
    </article>
  );
}
