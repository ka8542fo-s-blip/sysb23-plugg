import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import QuestionCard from "../components/QuestionCard.jsx";
import { viewFor } from "../lib/shuffle.js";
import { emptyMockState, examParts, mockExamResult, partStatus } from "../lib/mockExam.js";
import { KEYS, choiceExamKey, clearChoiceExam, load, save } from "../lib/storage.js";

// Fliken Tenta för Verksamhetsarkitektur: tre fasta provtentor
// (course.mockExams, data/arkitektur/mockExams.js). Man svarar på allt och
// kan ändra svaren; först efter "Lämna in" visas facit: rätt eller fel per
// fråga med förklaring, "x av y rätt" per uppgift, fel per modul med länk
// till modulen i Öva, och för fritexten checklistan och lärarens modellsvar
// bredvid ens egen text. Inga poäng och inget betyg.
//
// Allt sparas per provtenta i sysb23:tenta:<id> vid varje ändring (val,
// text, bockar, öppen fråga, inlämning) och rör aldrig Öva. "Nollställ"
// (med bekräftelse) tar bort just den provtentans svar.

function loadState(id) {
  const saved = load(choiceExamKey(id), null);
  if (!saved || typeof saved !== "object") return emptyMockState();
  return { ...emptyMockState(), ...saved };
}

export default function MockExam({ course, navigate }) {
  const exams = course.mockExams;
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
    <ExamRoom key={exam.id} course={course} exam={exam} navigate={navigate} onBack={() => setOpenId(null)} />
  ) : (
    <ExamList course={course} exams={exams} onOpen={setOpenId} />
  );
}

const chapterOrderOf = (course) => (course.chapters || []).map((chapter) => chapter.id);

// ---------- Översikten ----------

function ExamList({ course, exams, onOpen }) {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="font-display text-3xl">Tenta</h1>
        <p className="mt-2 max-w-reading rounded-lg border border-brass p-3 text-[15px] leading-relaxed text-ink/85">
          {course.mockExamNote}
        </p>
        <p className="mt-3 max-w-reading text-[15px] leading-relaxed text-ink/80">
          Tre provtentor byggda av modulernas frågor. Varje modulfråga finns på exakt en av dem, och
          alternativen står i samma ordning varje gång. Gör dem när alla moduler är klara i Öva. Du kan
          ändra dina svar tills du lämnar in; då visas facit. Det finns inga poäng eller betyg, eftersom
          årets poäng inte är kända. Svaren här påverkar inte Öva.
        </p>
      </section>
      <ul className="grid gap-4 md:grid-cols-3">
        {exams.map((exam) => {
          const state = loadState(exam.id);
          const result = mockExamResult(exam, state, chapterOrderOf(course));
          const total = examParts(exam).length;
          const [t1, t2, t3] = exam.tasks;
          return (
            <li key={exam.id} className="card flex flex-col p-5">
              <h2 className="font-display text-xl">{exam.title}</h2>
              <p className="mt-1 text-sm text-ink/65">
                {t1.parts.length} fritext · {t2.parts.length} flerval · {t3.parts.length} sant/falskt
              </p>
              <p className="tabular mt-3 text-[15px]">
                {result.submitted ? (
                  <>
                    Uppgift 2: {result.tasks[2].right} av {result.tasks[2].total} rätt
                    <br />
                    Uppgift 3: {result.tasks[3].right} av {result.tasks[3].total} rätt
                  </>
                ) : result.answered > 0 ? (
                  <span>Pågår · {result.answered} av {total} besvarade</span>
                ) : (
                  <span className="text-ink/65">Inte påbörjad</span>
                )}
              </p>
              <button type="button" className="btn-primary mt-4 self-start" onClick={() => onOpen(exam.id)}>
                {result.submitted ? "Se resultatet" : result.answered > 0 ? "Fortsätt" : "Skriv provtentan"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ---------- En provtenta ----------

const TILE = {
  open: "border-line text-ink/75",
  answered: "border-pine text-pine",
  ratt: "border-correct/60 bg-correct-bg text-ink",
  fel: "border-wrong/60 bg-wrong-bg text-ink",
  blank: "border-line text-ink/75",
  self: "border-brass/60 text-ink",
};
const LABEL = { open: "obesvarad", answered: "besvarad", ratt: "rätt", fel: "fel", blank: "obesvarad", self: "bedöm själv" };

function ExamRoom({ course, exam, navigate, onBack }) {
  const parts = useMemo(() => examParts(exam), [exam]);
  const [state, setState] = useState(() => loadState(exam.id));
  const [confirm, setConfirm] = useState(null); // "lamna-in" | "nollstall"
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
  const result = useMemo(() => mockExamResult(exam, state, chapterOrderOf(course)), [exam, state, course]);
  const index = Math.max(0, parts.findIndex((part) => part.no === state.current));
  const part = parts[index];

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
  const submit = () => {
    update((prev) => ({ ...prev, submittedAt: new Date().toISOString(), current: parts[0].no }));
    setConfirm(null);
    scrollToCard.current = true;
  };
  const reset = () => {
    clearChoiceExam(exam.id);
    setState(emptyMockState());
    setConfirm(null);
  };

  useEffect(() => {
    if (!scrollToCard.current || !cardRef.current) return;
    scrollToCard.current = false;
    const header = document.querySelector("header")?.offsetHeight ?? 0;
    const top = cardRef.current.getBoundingClientRect().top + window.scrollY - header - 12;
    if (top < window.scrollY) window.scrollTo({ top });
    cardRef.current.focus({ preventScroll: true });
  }, [state.current, state.submittedAt]);

  const tileState = (p) => {
    if (p.kind === "fritext") {
      if (submitted) return "self";
      return (state.texts?.[p.no] || "").trim() ? "answered" : "open";
    }
    const choice = state.choices?.[p.no];
    if (submitted) return partStatus(p, choice);
    return choice === undefined || choice === null ? "open" : "answered";
  };
  const unanswered = parts.length - result.answered;
  const chapterLabel = (id) => {
    const chapter = exam.chapterTitle?.[id];
    return chapter ? `Modul ${chapter.number} · ${chapter.title}` : id;
  };

  return (
    <div className="space-y-6 lg:flex lg:items-start lg:gap-8 lg:space-y-0">
      <section className="card p-5 lg:sticky lg:top-36 lg:max-h-[calc(100vh-11rem)] lg:w-80 lg:shrink-0 lg:overflow-y-auto">
        <button type="button" className="btn-quiet -ml-2 text-sm" onClick={onBack}>
          ← Alla provtentor
        </button>
        <h1 className="mt-2 font-display text-2xl">{exam.title}</h1>
        <p className="tabular mt-2 text-[15px] text-ink/80" role="status">
          {submitted ? "Inlämnad" : `${result.answered} av ${parts.length} besvarade`}
        </p>

        {exam.tasks.map((task) => (
          <div key={task.no} className="mt-4">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-brass">
              {task.title} · {task.subtitle}
            </h2>
            {submitted && (
              <p className="tabular mt-1 text-sm text-ink/80">
                {task.no === 1
                  ? `Bedöm själv: ${result.tasks[1].checked} av ${result.tasks[1].total} punkter bockade`
                  : `${result.tasks[task.no].right} av ${result.tasks[task.no].total} rätt`}
              </p>
            )}
            <ol className="mt-2 flex flex-wrap gap-1.5" aria-label={`${task.title}, frågor`}>
              {task.parts.map((p) => {
                const s = tileState(p);
                const here = p.no === part.no;
                return (
                  <li key={p.no}>
                    <button
                      type="button"
                      onClick={() => go(p.no)}
                      aria-current={here ? "true" : undefined}
                      aria-label={`Fråga ${p.no}, ${LABEL[s]}`}
                      className={`tabular inline-flex h-10 min-w-[2.75rem] items-center justify-center rounded-lg border px-2 text-sm transition-colors duration-150 hover:border-pine ${TILE[s]} ${here ? "ring-2 ring-pine ring-offset-1 ring-offset-surface" : ""}`}
                    >
                      {p.no}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        ))}

        <div className="mt-6 border-t border-line pt-4">
          {confirm === "lamna-in" ? (
            <div>
              <p className="text-sm text-ink/70">
                {unanswered > 0
                  ? `${unanswered} ${unanswered === 1 ? "fråga är obesvarad" : "frågor är obesvarade"}. Lämna in ändå?`
                  : "Alla frågor är besvarade. Lämna in?"}{" "}
                Efter inlämning går svaren inte att ändra förrän du nollställer.
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
          ) : confirm === "nollstall" ? (
            <div>
              <p className="text-sm text-ink/70">
                Alla svar, texter och bockar i {exam.title.toLowerCase()} tas bort. Öva och de andra
                provtentorna rörs inte.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button type="button" className="btn-secondary" onClick={reset}>
                  Ja, nollställ
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
              <button type="button" className="btn-quiet px-0 text-sm" onClick={() => setConfirm("nollstall")}>
                Nollställ
              </button>
            </div>
          )}
        </div>
      </section>

      <div className="min-w-0 flex-1 space-y-6">
        <div ref={cardRef} tabIndex={-1} className="focus:outline-none">
          {part.kind === "fritext" ? (
            <FreeTextPart part={part} state={state} update={update} submitted={submitted}>
              <Steps index={index} total={parts.length} step={step} />
            </FreeTextPart>
          ) : (
            <ChoicePart part={part} state={state} update={update} submitted={submitted} step={step}>
              <Steps index={index} total={parts.length} step={step} keys />
            </ChoicePart>
          )}
        </div>

        {submitted && (
          <section className="card mx-auto w-full max-w-reading p-5 sm:p-6" aria-label="Fel per modul">
            <h2 className="font-display text-xl">Fel per modul</h2>
            {result.wrongByChapter.length === 0 ? (
              <p className="mt-2 text-[15px] text-ink/80">Inga fel i flerval och sant/falskt.</p>
            ) : (
              <>
                <p className="mt-1 text-sm text-ink/70">Fel och obesvarade frågor i uppgift 2 och 3.</p>
                <ul className="mt-3 space-y-3">
                  {result.wrongByChapter.map((group) => (
                    <li key={group.chapterId}>
                      <p className="text-[15px] font-medium">{chapterLabel(group.chapterId)}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        {group.parts.map((no) => (
                          <button key={no} type="button" className="btn-quiet tabular px-2 text-sm" onClick={() => go(no)}>
                            {no}
                          </button>
                        ))}
                        {navigate && (
                          <button
                            type="button"
                            className="btn-secondary ml-1 text-sm"
                            onClick={() => navigate("ova", { topics: [group.chapterId], nonce: Date.now() })}
                          >
                            Öva modulen →
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

function Steps({ index, total, step, keys = false }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" className="btn-secondary" disabled={index === 0} onClick={() => step(-1)}>
        ← Föregående
      </button>
      <button type="button" className="btn-secondary" disabled={index === total - 1} onClick={() => step(1)}>
        Nästa →
      </button>
      {keys && <span className="text-sm text-ink/65">Tangentbord: siffrorna väljer, ← och → byter fråga.</span>}
    </div>
  );
}

function ChoicePart({ part, state, update, submitted, step, children }) {
  const view = useMemo(
    () => viewFor(part.item, part.order.map((original) => ({ ...part.item.options[original], originalIndex: original }))),
    [part],
  );
  const choice = state.choices?.[part.no];
  const chosen = choice === undefined || choice === null ? null : part.order.indexOf(choice);
  const choose = useCallback(
    (shown) => {
      if (submitted) return;
      update((prev) => ({ ...prev, choices: { ...prev.choices, [part.no]: part.order[shown] } }));
    },
    [submitted, update, part],
  );
  const clear = () =>
    update((prev) => {
      const choices = { ...prev.choices };
      delete choices[part.no];
      return { ...prev, choices };
    });

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

  const status = submitted ? partStatus(part, choice) : null;
  return (
    <QuestionCard
      question={part.item}
      view={view}
      chosen={chosen}
      revealed={submitted}
      onChoose={choose}
      skippedLabel="Obesvarad"
      tag={
        <>
          <span className="rounded-full border border-brass/50 px-2.5 py-0.5 text-xs font-medium text-brass-text">
            Fråga {part.no}
          </span>
          {status && (
            <span className={`font-medium ${status === "ratt" ? "text-correct" : status === "fel" ? "text-wrong" : "text-ink/70"}`}>
              {status === "ratt" ? "Rätt" : status === "fel" ? "Fel" : "Obesvarad"}
            </span>
          )}
        </>
      }
    >
      <div className="space-y-3">
        {children}
        {!submitted && chosen !== null && (
          <button type="button" className="btn-quiet -ml-2 text-sm" onClick={clear}>
            Rensa svaret
          </button>
        )}
      </div>
    </QuestionCard>
  );
}

function FreeTextPart({ part, state, update, submitted, children }) {
  const essay = part.essay;
  const text = state.texts?.[part.no] ?? "";
  const checks = state.checks?.[part.no] ?? {};
  const setText = (value) => update((prev) => ({ ...prev, texts: { ...prev.texts, [part.no]: value } }));
  const toggle = (key) =>
    update((prev) => ({
      ...prev,
      checks: { ...prev.checks, [part.no]: { ...(prev.checks?.[part.no] || {}), [key]: !prev.checks?.[part.no]?.[key] } },
    }));

  return (
    <article className="card w-full p-5 sm:p-7">
      <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink/65">
        <span className="rounded-full border border-brass/50 px-2.5 py-0.5 text-xs font-medium text-brass-text">
          Fråga {part.no} · fritext
        </span>
        <span>{essay.label}</span>
      </div>
      {essay.levelNote && (
        <p className="mb-3 max-w-reading rounded-lg border border-brass px-3 py-2 text-[14px] leading-relaxed text-ink/85">
          {essay.levelNote}
        </p>
      )}
      <h2 className="max-w-reading whitespace-pre-line font-sans text-[18px] font-medium leading-normal text-ink [font-variation-settings:normal] sm:text-[20px]">
        {essay.question}
      </h2>
      <p className="mt-1 text-sm text-ink/65">{essay.source}</p>

      <div className={submitted ? "mt-5 grid gap-6 lg:grid-cols-2" : "mt-5"}>
        <div>
          {submitted ? (
            <>
              <h3 className="font-display text-lg">Din text</h3>
              <p className="mt-1 whitespace-pre-line rounded-lg border border-line bg-paper px-3 py-2 text-[15px] leading-relaxed">
                {text.trim() ? text : <span className="text-ink/60">Du skrev inget.</span>}
              </p>
            </>
          ) : (
            <label className="block">
              <span className="text-sm font-medium text-ink/75">Ditt svar (sparas)</span>
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                rows={12}
                className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-[15px] leading-relaxed"
              />
            </label>
          )}
        </div>

        {submitted && (
          <div>
            <h3 className="font-display text-lg">Checklista</h3>
            <p className="text-sm text-ink/70">Bocka av det du fick med.</p>
            {(essay.checklist || []).map((group, g) => (
              <div key={group.heading} className="mt-3">
                <p className="text-[15px] font-medium">{group.heading}</p>
                <ul className="mt-1 space-y-1.5">
                  {group.points.map((point, p) => {
                    const key = `${g}:${p}`;
                    return (
                      <li key={key}>
                        <label className="flex items-start gap-2 text-[15px] leading-relaxed">
                          <input type="checkbox" className="mt-1.5" checked={Boolean(checks[key])} onChange={() => toggle(key)} />
                          <span>{point}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
            <h3 className="mt-5 font-display text-lg">Lärarens modellsvar</h3>
            {essay.modelAnswer ? (
              <p className="mt-1 whitespace-pre-line text-[15px] leading-relaxed">{essay.modelAnswer}</p>
            ) : (
              <p className="mt-1 text-sm text-ink/70">Frågan har inget modellsvar; checklistan bygger på modul 4.</p>
            )}
          </div>
        )}
      </div>

      <div className="mt-6">{children}</div>
    </article>
  );
}
