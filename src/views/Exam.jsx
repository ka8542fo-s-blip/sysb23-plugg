import { useCallback, useEffect, useRef, useState } from "react";
import QuestionCard from "../components/QuestionCard.jsx";
import GradeGauge from "../components/GradeGauge.jsx";
import { shuffleQuestion } from "../lib/shuffle.js";
import { balancedExamPick } from "../lib/weightedPick.js";
import {
  QUESTIONS_PER_EXAM,
  MAX_EXAM_POINTS,
  scoreExam,
  formatTime,
} from "../lib/scoring.js";

// Provet lever i App:s state (`session`) så att man kan gå till Begrepp
// och tillbaka utan att tappa ett påbörjat prov. Timern räknar mot en
// absolut deadline av samma skäl.
export default function Exam({
  course,
  settings,
  setSettings,
  session,
  setSession,
  onFinish,
  navigate,
}) {
  const [now, setNow] = useState(() => Date.now());
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const submittedRef = useRef(null);

  const stage = session?.stage ?? "intro";
  const items = session?.items ?? [];
  const index = session?.index ?? 0;
  const deadline = session?.deadline ?? null;

  const topicName = useCallback(
    (topicId) => course.topics.find((topic) => topic.id === topicId)?.name,
    [course],
  );

  const secondsLeft =
    deadline === null ? null : Math.max(0, Math.round((deadline - now) / 1000));

  function startExam() {
    const picked = balancedExamPick(course.questions, QUESTIONS_PER_EXAM, 2);
    const runId = Date.now();
    setConfirmSubmit(false);
    setNow(Date.now());
    setSession({
      runId,
      stage: "running",
      index: 0,
      deadline: settings.timerOn ? runId + settings.timerMinutes * 60000 : null,
      items: picked.map((question) => ({
        question,
        view: shuffleQuestion(question),
        choice: null,
        skipped: false,
      })),
    });
    window.scrollTo({ top: 0 });
  }

  const finishExam = useCallback(
    (current) => {
      if (!current || current.stage !== "running") return;
      if (submittedRef.current === current.runId) return;
      submittedRef.current = current.runId;

      const entries = current.items.map((item) => ({
        questionId: item.question.id,
        topic: item.question.topic,
        choice: item.choice,
        correct: item.view.correct,
      }));
      const score = scoreExam(entries);
      const record = {
        id: `${current.runId}`,
        date: new Date().toISOString(),
        courseId: course.id,
        ...score,
        questions: entries,
      };
      setConfirmSubmit(false);
      setSession({ ...current, stage: "result", deadline: null, record });
      onFinish(record);
      window.scrollTo({ top: 0 });
    },
    [course, onFinish, setSession],
  );

  // Klockan tickar oberoende av svaren.
  useEffect(() => {
    if (stage !== "running" || deadline === null) return undefined;
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, [stage, deadline]);

  // Tiden ute — lämnas in automatiskt, även om man varit i en annan vy.
  useEffect(() => {
    if (stage === "running" && secondsLeft === 0) finishExam(session);
  }, [stage, secondsLeft, session, finishExam]);

  const updateItem = useCallback(
    (patch) => {
      setSession((prev) =>
        prev && prev.stage === "running"
          ? {
              ...prev,
              items: prev.items.map((item, i) =>
                i === prev.index ? { ...item, ...patch } : item,
              ),
            }
          : prev,
      );
    },
    [setSession],
  );

  const goTo = useCallback(
    (updater) => {
      setSession((prev) =>
        prev && prev.stage === "running"
          ? {
              ...prev,
              index: Math.min(
                Math.max(
                  typeof updater === "function" ? updater(prev.index) : updater,
                  0,
                ),
                prev.items.length - 1,
              ),
            }
          : prev,
      );
    },
    [setSession],
  );

  const setChoice = useCallback(
    (choice) => updateItem({ choice, skipped: false }),
    [updateItem],
  );

  const skip = useCallback(() => {
    updateItem({ choice: null, skipped: true });
    goTo((prev) => prev + 1);
  }, [updateItem, goTo]);

  useEffect(() => {
    if (stage !== "running") return undefined;
    function onKeyDown(event) {
      const tag = event.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (["1", "2", "3", "4"].includes(event.key)) {
        event.preventDefault();
        setChoice(Number(event.key) - 1);
      } else if (event.key === "ArrowRight" || event.key === "Enter") {
        event.preventDefault();
        goTo((prev) => prev + 1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo((prev) => prev - 1);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [stage, setChoice, goTo]);

  if (stage === "intro") {
    if (course.questions.length === 0) {
      return (
        <section className="card max-w-3xl p-5 sm:p-6">
          <h1 className="font-display text-2xl">Prov</h1>
          <p className="mt-2 text-[15px] leading-relaxed text-ink/70">
            Frågebanken för den här delkursen är inte inlagd ännu, så det finns
            inget prov att simulera. Under tiden finns kompendiet under Läs.
          </p>
        </section>
      );
    }
    return (
      <section className="card max-w-3xl p-5 sm:p-6">
        <h1 className="font-display text-2xl">Prov</h1>
        <p className="mt-2 max-w-reading text-[15px] leading-relaxed text-ink/80">
          Tio frågor, balanserat dragna över ämnena (högst två per ämne). Poängen
          följer tentan: <span className="font-medium">+6</span> för rätt svar,{" "}
          <span className="font-medium">−1</span> för fel och{" "}
          <span className="font-medium">0</span> för överhoppad. Ingen feedback
          förrän provet är inlämnat.
        </p>

        <div className="mt-6 space-y-4">
          <label className="flex w-fit cursor-pointer items-center gap-3 rounded-lg px-2 py-1 transition-colors duration-150 hover:bg-pine/[0.06] hover:text-pine">
            <input
              type="checkbox"
              checked={settings.timerOn}
              onChange={(event) =>
                setSettings((prev) => ({ ...prev, timerOn: event.target.checked }))
              }
              className="h-4 w-4 accent-pine"
            />
            <span className="text-[15px]">Använd timer</span>
          </label>

          <div className="flex items-center gap-3">
            <label htmlFor="minutes" className="text-[15px] text-ink/70">
              Minuter
            </label>
            <input
              id="minutes"
              type="number"
              min="1"
              max="120"
              value={settings.timerMinutes}
              disabled={!settings.timerOn}
              onChange={(event) =>
                setSettings((prev) => ({
                  ...prev,
                  timerMinutes: Math.min(
                    120,
                    Math.max(1, Number(event.target.value) || 1),
                  ),
                }))
              }
              className="tabular w-20 rounded-lg border border-line bg-white px-3 py-2 disabled:cursor-not-allowed disabled:bg-paper disabled:text-ink/40"
            />
          </div>
        </div>

        <button type="button" className="btn-primary mt-6" onClick={startExam}>
          Starta provet
        </button>
      </section>
    );
  }

  if (stage === "running") {
    const item = items[index];
    const answeredCount = items.filter((entry) => entry.choice !== null).length;
    const openCount = items.length - answeredCount;

    return (
      <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-6">
        <div className="card flex flex-wrap items-center justify-between gap-3 p-4 lg:col-start-2 lg:row-start-1">
          <div>
            <span className="tabular font-display text-lg">
              Fråga {index + 1} av {items.length}
            </span>
            <span className="tabular ml-3 text-sm text-ink/65">
              {answeredCount} besvarade
            </span>
          </div>
          {secondsLeft !== null && (
            <span
              className={`tabular rounded-lg px-3 py-1 font-medium ${
                secondsLeft <= 60 ? "bg-wrong-bg text-wrong" : "text-ink/70"
              }`}
            >
              {formatTime(secondsLeft)}
            </span>
          )}
        </div>

        <nav
          aria-label="Frågeöversikt"
          className="flex flex-wrap gap-2 lg:col-start-2 lg:row-start-2"
        >
          {items.map((entry, i) => {
            const state =
              entry.choice !== null ? "answered" : entry.skipped ? "skipped" : "untouched";
            const style = {
              answered: "border-pine bg-pine text-white hover:bg-pine-dark",
              skipped: "border-brass text-brass hover:bg-brass/10",
              untouched: "border-line text-ink/65 hover:border-pine hover:bg-pine/[0.06]",
            }[state];
            return (
              <button
                key={entry.question.id}
                type="button"
                onClick={() => goTo(i)}
                aria-current={i === index ? "true" : undefined}
                aria-label={`Fråga ${i + 1}, ${
                  state === "answered"
                    ? "besvarad"
                    : state === "skipped"
                      ? "överhoppad"
                      : "obesvarad"
                }`}
                className={`tabular h-9 w-9 rounded-lg border text-sm transition-colors duration-150 ${style} ${
                  i === index ? "ring-2 ring-pine ring-offset-2 ring-offset-paper" : ""
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </nav>

        <div className="w-full lg:col-start-1 lg:row-start-1 lg:row-span-3">
        <QuestionCard
          question={item.question}
          view={item.view}
          chosen={item.choice}
          revealed={false}
          onChoose={setChoice}
          topicName={topicName(item.question.topic)}
          counter={`Fråga ${index + 1}`}
        >
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => goTo((prev) => prev - 1)}
              disabled={index === 0}
            >
              Föregående
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={skip}
              title="Obesvarad fråga ger 0 p i stället för −1 p"
            >
              Hoppa över
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => goTo((prev) => prev + 1)}
              disabled={index === items.length - 1}
            >
              Nästa
            </button>
          </div>
        </QuestionCard>
        </div>

        <div className="card p-4 lg:col-start-2 lg:row-start-3">
          {confirmSubmit ? (
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-[15px]">
                {openCount === 0
                  ? "Lämna in provet?"
                  : `${openCount} ${openCount === 1 ? "fråga är" : "frågor är"} obesvarade — de ger 0 p. Lämna in ändå?`}
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => finishExam(session)}
              >
                Lämna in
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setConfirmSubmit(false)}
              >
                Fortsätt provet
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-ink/65">
                Ett fel svar kostar 1 p — hoppa hellre över när du inte kan.
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setConfirmSubmit(true)}
              >
                Lämna in provet
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const { record } = session;

  return (
    <div className="space-y-6">
      <section className="card p-5 sm:p-7">
        <h1 className="font-display text-2xl">Resultat</h1>
        <p className="tabular mt-2 text-[17px]">
          <span className="font-display text-3xl text-pine">{record.points}</span>{" "}
          av {MAX_EXAM_POINTS} poäng · {record.percent} % · betyg{" "}
          <span className="font-medium">{record.grade}</span>
        </p>
        <p className="tabular mt-1 text-[15px] text-ink/65">
          {record.correct} rätt (+{record.correct * 6}), {record.wrong} fel (−
          {record.wrong}), {record.skipped} överhoppade.
        </p>

        <div className="mt-6 max-w-3xl">
          <GradeGauge percent={record.percent} grade={record.grade} />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" className="btn-primary" onClick={startExam}>
            Gör ett nytt prov
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("statistik")}
          >
            Se statistiken
          </button>
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="font-display text-xl">Genomgång</h2>
        <div className="grid gap-5 xl:grid-cols-2 xl:items-start">
          {items.map((item, i) => (
            <QuestionCard
              key={item.question.id}
              question={item.question}
              view={item.view}
              chosen={item.choice}
              revealed
              onChoose={() => {}}
              topicName={topicName(item.question.topic)}
              counter={`Fråga ${i + 1}${item.choice === null ? " · överhoppad" : ""}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
