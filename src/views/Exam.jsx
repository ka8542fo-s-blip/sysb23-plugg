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

export default function Exam({ course, settings, setSettings, onFinish, navigate }) {
  const [stage, setStage] = useState("intro"); // intro | running | result
  const [items, setItems] = useState([]); // { question, view, choice, skipped }
  const [index, setIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [result, setResult] = useState(null);

  const topicName = useCallback(
    (topicId) => course.topics.find((topic) => topic.id === topicId)?.name,
    [course],
  );

  function startExam() {
    const picked = balancedExamPick(course.questions, QUESTIONS_PER_EXAM, 2);
    setItems(
      picked.map((question) => ({
        question,
        view: shuffleQuestion(question),
        choice: null,
        skipped: false,
      })),
    );
    setIndex(0);
    setResult(null);
    setSecondsLeft(settings.timerOn ? settings.timerMinutes * 60 : null);
    setStage("running");
    window.scrollTo({ top: 0 });
  }

  const finishExam = useCallback(
    (current) => {
      const entries = current.map((item) => ({
        questionId: item.question.id,
        topic: item.question.topic,
        choice: item.choice,
        correct: item.view.correct,
      }));
      const score = scoreExam(entries);
      const record = {
        id: `${Date.now()}`,
        date: new Date().toISOString(),
        courseId: course.id,
        ...score,
        questions: entries,
      };
      setResult({ record, items: current });
      setStage("result");
      setSecondsLeft(null);
      onFinish(record);
      window.scrollTo({ top: 0 });
    },
    [course, onFinish],
  );

  // Timern tickar oberoende av svaren; nedräkningen ska inte starta om
  // varje gång ett alternativ väljs.
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const timerRunning = stage === "running" && secondsLeft !== null;

  useEffect(() => {
    if (!timerRunning) return undefined;
    const id = setInterval(
      () => setSecondsLeft((prev) => (prev === null ? null : Math.max(0, prev - 1))),
      1000,
    );
    return () => clearInterval(id);
  }, [timerRunning]);

  useEffect(() => {
    if (stage === "running" && secondsLeft === 0) finishExam(itemsRef.current);
  }, [stage, secondsLeft, finishExam]);

  const setChoice = useCallback((choice) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, choice, skipped: false } : item)),
    );
  }, [index]);

  const skip = useCallback(() => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, choice: null, skipped: true } : item)),
    );
    setIndex((prev) => Math.min(prev + 1, itemsRef.current.length - 1));
  }, [index]);

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
        setIndex((prev) => Math.min(prev + 1, items.length - 1));
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        setIndex((prev) => Math.max(prev - 1, 0));
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [stage, items.length, setChoice]);

  if (stage === "intro") {
    return (
      <div className="space-y-6">
        <section className="card p-5 sm:p-6">
          <h1 className="font-display text-2xl">Prov</h1>
          <p className="mt-2 max-w-reading text-[15px] leading-relaxed text-ink/80">
            Tio frågor, balanserat dragna över ämnena (högst två per ämne). Poängen
            följer tentan: <span className="font-medium">+6</span> för rätt svar,{" "}
            <span className="font-medium">−1</span> för fel och{" "}
            <span className="font-medium">0</span> för överhoppad. Ingen feedback
            förrän provet är inlämnat.
          </p>

          <div className="mt-6 space-y-4">
            <label className="flex items-center gap-3">
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
                className="tabular w-20 rounded-lg border border-line bg-white px-3 py-2 disabled:opacity-40"
              />
            </div>
          </div>

          <button type="button" className="btn-primary mt-6" onClick={startExam}>
            Starta provet
          </button>
        </section>
      </div>
    );
  }

  if (stage === "running") {
    const item = items[index];
    const answeredCount = items.filter((entry) => entry.choice !== null).length;

    return (
      <div className="space-y-5">
        <div className="card flex flex-wrap items-center justify-between gap-3 p-4">
          <div>
            <span className="tabular font-display text-lg">
              Fråga {index + 1} av {items.length}
            </span>
            <span className="tabular ml-3 text-sm text-ink/55">
              {answeredCount} besvarade
            </span>
          </div>
          {secondsLeft !== null && (
            <span
              className={`tabular rounded-lg px-3 py-1 font-medium ${
                secondsLeft <= 60 ? "bg-wrong-bg text-wrong" : "text-ink/70"
              }`}
              aria-live="off"
            >
              {formatTime(secondsLeft)}
            </span>
          )}
        </div>

        <nav aria-label="Frågeöversikt" className="flex flex-wrap gap-2">
          {items.map((entry, i) => {
            const state =
              entry.choice !== null ? "answered" : entry.skipped ? "skipped" : "untouched";
            const style = {
              answered: "border-pine bg-pine text-white",
              skipped: "border-brass text-brass",
              untouched: "border-line text-ink/50",
            }[state];
            return (
              <button
                key={entry.question.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-current={i === index ? "true" : undefined}
                aria-label={`Fråga ${i + 1}, ${
                  state === "answered"
                    ? "besvarad"
                    : state === "skipped"
                      ? "överhoppad"
                      : "obesvarad"
                }`}
                className={`tabular h-9 w-9 rounded-lg border text-sm ${style} ${
                  i === index ? "ring-2 ring-pine ring-offset-2 ring-offset-paper" : ""
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </nav>

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
              onClick={() => setIndex((prev) => Math.max(prev - 1, 0))}
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
            {index < items.length - 1 ? (
              <button
                type="button"
                className="btn-primary"
                onClick={() => setIndex((prev) => prev + 1)}
              >
                Nästa
              </button>
            ) : (
              <button
                type="button"
                className="btn-primary"
                onClick={() => finishExam(items)}
              >
                Lämna in
              </button>
            )}
          </div>
        </QuestionCard>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink/50">
            Ett fel svar kostar 1 p — hoppa hellre över när du inte kan.
          </p>
          <button
            type="button"
            className="btn-quiet text-sm"
            onClick={() => finishExam(items)}
          >
            Lämna in nu
          </button>
        </div>
      </div>
    );
  }

  const { record, items: finished } = result;

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

        <div className="mt-6">
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
        {finished.map((item, i) => (
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
      </section>
    </div>
  );
}
