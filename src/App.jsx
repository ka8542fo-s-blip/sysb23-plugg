import { useEffect, useMemo, useState } from "react";
import Nav from "./components/Nav.jsx";
import Home from "./views/Home.jsx";
import Practice from "./views/Practice.jsx";
import Exam from "./views/Exam.jsx";
import Concepts from "./views/Concepts.jsx";
import Essays from "./views/Essays.jsx";
import Stats from "./views/Stats.jsx";
import { courses, getCourse } from "./data/index.js";
import { KEYS, load, save, defaultSettings, recordAnswer } from "./lib/storage.js";

export default function App() {
  const [view, setView] = useState("hem");
  const [courseId, setCourseId] = useState("strategi");
  const [answers, setAnswers] = useState(() => load(KEYS.answers, {}));
  const [exams, setExams] = useState(() => load(KEYS.exams, []));
  const [essayState, setEssayState] = useState(() => load(KEYS.essays, {}));
  const [settings, setSettings] = useState(() => ({
    ...defaultSettings,
    ...load(KEYS.settings, {}),
  }));

  useEffect(() => save(KEYS.answers, answers), [answers]);
  useEffect(() => save(KEYS.exams, exams), [exams]);
  useEffect(() => save(KEYS.essays, essayState), [essayState]);
  useEffect(() => save(KEYS.settings, settings), [settings]);

  const course = useMemo(() => getCourse(courseId), [courseId]);

  function navigate(next) {
    setView(next);
    window.scrollTo({ top: 0 });
  }

  function handleAnswer(questionId, wasCorrect) {
    setAnswers((prev) => recordAnswer(prev, questionId, wasCorrect));
  }

  function handleExamFinished(result) {
    setExams((prev) => [result, ...prev].slice(0, 50));
    setAnswers((prev) => {
      let next = prev;
      for (const item of result.questions) {
        if (item.choice === null) continue;
        next = recordAnswer(next, item.questionId, item.choice === item.correct);
      }
      return next;
    });
  }

  function resetAll() {
    setAnswers({});
    setExams([]);
    setEssayState({});
    setSettings(defaultSettings);
  }

  const shared = { course, answers, settings, setSettings, navigate };

  return (
    <div className="min-h-screen">
      <a
        href="#innehall"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-20 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2"
      >
        Hoppa till innehållet
      </a>

      <Nav view={view} onNavigate={navigate} courseName={course.name} />

      <main id="innehall" className="mx-auto max-w-4xl px-4 py-7 sm:px-6 sm:py-10">
        {view === "hem" && (
          <Home
            {...shared}
            courses={courses}
            courseId={courseId}
            onSelectCourse={setCourseId}
            exams={exams}
          />
        )}
        {view === "ova" && <Practice {...shared} onAnswer={handleAnswer} />}
        {view === "prov" && <Exam {...shared} onFinish={handleExamFinished} />}
        {view === "begrepp" && <Concepts {...shared} />}
        {view === "essa" && (
          <Essays {...shared} essayState={essayState} setEssayState={setEssayState} />
        )}
        {view === "statistik" && <Stats {...shared} exams={exams} onReset={resetAll} />}
      </main>

      <footer className="mx-auto max-w-4xl px-4 pb-10 text-sm text-ink/45 sm:px-6">
        SYSB23 · Ekonomihögskolan, Lunds universitet. Allt innehåll bygger på
        kurslitteraturen och sparas bara lokalt i din webbläsare.
      </footer>
    </div>
  );
}
