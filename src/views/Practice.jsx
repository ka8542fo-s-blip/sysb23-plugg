import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import QuestionCard from "../components/QuestionCard.jsx";
import TopicFilter from "../components/TopicFilter.jsx";
import { shuffleQuestion } from "../lib/shuffle.js";
import { weightedPick, weightFor } from "../lib/weightedPick.js";

const DIFFICULTIES = [
  { value: 0, label: "Alla" },
  { value: 1, label: "Grund" },
  { value: 2, label: "Standard" },
  { value: 3, label: "Klurig" },
];

export default function Practice({
  course,
  answers,
  settings,
  setSettings,
  params,
  onAnswer,
}) {
  const selectedTopics = settings.practiceTopics;

  // "Öva på detta" från Läs skickar med ett förvalt ämnesfilter.
  const presetKey = params?.nonce ?? null;
  useEffect(() => {
    const preset = params?.topics;
    // En tom lista är ett giltigt val — den betyder "alla ämnen".
    if (!Array.isArray(preset)) return;
    const valid = preset.filter((id) => course.topics.some((topic) => topic.id === id));
    setSettings((prev) => ({
      ...prev,
      practiceTopics: valid,
      practiceDifficulty: 0,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presetKey]);
  const difficulty = settings.practiceDifficulty;

  const filtered = useMemo(() => {
    return course.questions.filter((question) => {
      const topicOk =
        selectedTopics.length === 0 || selectedTopics.includes(question.topic);
      const difficultyOk = difficulty === 0 || question.difficulty === difficulty;
      return topicOk && difficultyOk;
    });
  }, [course, selectedTopics, difficulty]);

  const countsPerTopic = useMemo(() => {
    const counts = {};
    for (const question of course.questions) {
      if (difficulty !== 0 && question.difficulty !== difficulty) continue;
      counts[question.topic] = (counts[question.topic] || 0) + 1;
    }
    return counts;
  }, [course, difficulty]);

  // Filtret tar mycket plats på mobil — där är det hopfällt tills man vill åt det.
  const [filterOpen, setFilterOpen] = useState(
    () => typeof window === "undefined" || window.innerWidth >= 640,
  );
  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [passStats, setPassStats] = useState({ correct: 0, wrong: 0 });
  // Vikterna läses vid passets start så att kön inte hoppar mitt i.
  const answersRef = useRef(answers);
  answersRef.current = answers;

  const startPass = useCallback(
    (questions) => {
      const snapshot = answersRef.current;
      setQueue(
        weightedPick(questions, questions.length, (question) =>
          weightFor(question.id, snapshot),
        ),
      );
      setIndex(0);
      setChosen(null);
      setRevealed(false);
      setPassStats({ correct: 0, wrong: 0 });
    },
    [],
  );

  useEffect(() => {
    startPass(filtered);
  }, [filtered, startPass]);

  const current = queue[index];
  const view = useMemo(
    () => (current ? shuffleQuestion(current) : null),
    // Ny blandning varje gång en fråga visas.
    [current, index],
  );

  const topicName = useMemo(
    () => course.topics.find((topic) => topic.id === current?.topic)?.name,
    [course, current],
  );

  const confirm = useCallback(() => {
    if (revealed || chosen === null || !view || !current) return;
    const wasCorrect = chosen === view.correct;
    setRevealed(true);
    setPassStats((prev) => ({
      correct: prev.correct + (wasCorrect ? 1 : 0),
      wrong: prev.wrong + (wasCorrect ? 0 : 1),
    }));
    onAnswer(current.id, wasCorrect);
  }, [revealed, chosen, view, current, onAnswer]);

  const next = useCallback(() => {
    setIndex((prev) => prev + 1);
    setChosen(null);
    setRevealed(false);
  }, []);

  useEffect(() => {
    function onKeyDown(event) {
      const tag = event.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (["1", "2", "3", "4"].includes(event.key)) {
        if (revealed) return;
        event.preventDefault();
        setChosen(Number(event.key) - 1);
      } else if (event.key === "Enter") {
        event.preventDefault();
        if (revealed) next();
        else confirm();
      } else if (event.key === "ArrowRight") {
        if (!revealed) return;
        event.preventDefault();
        next();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [revealed, confirm, next]);

  const done = queue.length > 0 && index >= queue.length;

  return (
    <div className="space-y-6">
      <section className="card p-5">
        <h1 className="font-display text-2xl">Öva</h1>
        <p className="mt-1 text-[15px] text-ink/70">
          En fråga i taget med direkt facit. Frågor du svarat fel på återkommer
          oftare. Inga minuspoäng här — bara rätt och fel.
        </p>

        <button
          type="button"
          onClick={() => setFilterOpen(!filterOpen)}
          aria-expanded={filterOpen}
          className="btn-secondary mt-4 sm:hidden"
        >
          {filterOpen ? "Dölj urval" : "Välj ämne och nivå"}
        </button>

        <div className={filterOpen ? "mt-5" : "mt-5 hidden"}>
          <TopicFilter
            topics={course.topics}
            selected={selectedTopics}
            counts={countsPerTopic}
            onChange={(topics) =>
              setSettings((prev) => ({ ...prev, practiceTopics: topics }))
            }
          />
        </div>

        <div className={filterOpen ? "mt-5" : "mt-5 hidden"}>
          <label
            htmlFor="difficulty"
            className="mb-1 block font-display text-lg"
          >
            Svårighetsgrad
          </label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(event) =>
              setSettings((prev) => ({
                ...prev,
                practiceDifficulty: Number(event.target.value),
              }))
            }
            className="rounded-lg border border-line bg-white px-3 py-2 text-[15px]"
          >
            {DIFFICULTIES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <p className="tabular mt-5 text-sm text-ink/65">
          {filtered.length} frågor i urvalet · rätt i passet: {passStats.correct} ·
          fel: {passStats.wrong}
        </p>
      </section>

      {filtered.length === 0 && (
        <p className="card p-5 text-[15px] text-ink/70">
          Inga frågor matchar filtret. Välj fler ämnen eller en annan
          svårighetsgrad.
        </p>
      )}

      {done && (
        <section className="card p-6 text-center">
          <h2 className="font-display text-2xl">Passet är klart.</h2>
          <p className="tabular mt-2 text-[15px] text-ink/70">
            {passStats.correct} rätt och {passStats.wrong} fel på {queue.length}{" "}
            frågor.
          </p>
          <button
            type="button"
            className="btn-primary mt-5"
            onClick={() => startPass(filtered)}
          >
            Kör ett nytt pass
          </button>
        </section>
      )}

      {current && view && (
        <QuestionCard
          question={current}
          view={view}
          chosen={chosen}
          revealed={revealed}
          onChoose={setChosen}
          topicName={topicName}
          counter={`Fråga ${index + 1} av ${queue.length}`}
        >
          <div className="flex flex-wrap items-center gap-3">
            {!revealed ? (
              <button
                type="button"
                className="btn-primary"
                disabled={chosen === null}
                onClick={confirm}
              >
                Svara
              </button>
            ) : (
              <button type="button" className="btn-primary" onClick={next}>
                Nästa fråga
              </button>
            )}
            <span className="text-sm text-ink/65">
              Tangentbord: 1–4 väljer, Enter bekräftar, → nästa.
            </span>
          </div>
        </QuestionCard>
      )}
    </div>
  );
}
