import { useEffect, useMemo, useState } from "react";
import Nav from "./components/Nav.jsx";
import Home from "./views/Home.jsx";
import KnowledgeHub from "./views/KnowledgeHub.jsx";
import Practice from "./views/Practice.jsx";
import Exam from "./views/Exam.jsx";
import Essays from "./views/Essays.jsx";
import Stats from "./views/Stats.jsx";
import Schedule from "./views/Schedule.jsx";
import SqlWorkshop from "./views/SqlWorkshop.jsx";
import { courses, getCourse } from "./data/index.js";
import {
  KEYS,
  load,
  save,
  defaultSettings,
  recordAnswer,
  loadReadChapters,
  saveReadChapter,
  loadSqlProgress,
  saveSqlResult,
} from "./lib/storage.js";

export default function App() {
  const [view, setView] = useState("hem");
  const [viewParams, setViewParams] = useState(null);
  // Tillbakalänken lever bara i vy-state — den ska inte överleva en omladdning.
  const [backLink, setBackLink] = useState(null);
  const [courseId, setCourseId] = useState("strategi");
  const [answers, setAnswers] = useState(() => load(KEYS.answers, {}));
  const [exams, setExams] = useState(() => load(KEYS.exams, []));
  const [essayState, setEssayState] = useState(() => load(KEYS.essays, {}));
  const [settings, setSettings] = useState(() => ({
    ...defaultSettings,
    ...load(KEYS.settings, {}),
  }));
  // Ett pågående prov ligger här, inte i Prov-vyn, så att det överlever
  // ett besök i Läs eller Statistik. Sparas medvetet inte till
  // localStorage — ett prov ska inte gå att pausa över en omladdning.
  const [examSession, setExamSession] = useState(null);

  useEffect(() => save(KEYS.answers, answers), [answers]);
  useEffect(() => save(KEYS.exams, exams), [exams]);
  useEffect(() => save(KEYS.essays, essayState), [essayState]);
  useEffect(() => save(KEYS.settings, settings), [settings]);

  const course = useMemo(() => getCourse(courseId), [courseId]);

  // Lästa kapitel: en nyckel per kapitel i localStorage.
  const [readChapters, setReadChapters] = useState(() =>
    loadReadChapters(
      courseId,
      (getCourse(courseId).chapters || []).map((chapter) => chapter.id),
    ),
  );

  // Lösta SQL-övningar: en nyckel per övning i localStorage.
  const [sqlProgress, setSqlProgress] = useState(() =>
    loadSqlProgress((getCourse(courseId).sqlExercises || []).map((item) => item.id)),
  );

  useEffect(() => {
    setExamSession(null);
    setSqlProgress(
      loadSqlProgress((course.sqlExercises || []).map((item) => item.id)),
    );
    setReadChapters(
      loadReadChapters(
        course.id,
        (course.chapters || []).map((chapter) => chapter.id),
      ),
    );
    // Byter man till en delkurs som saknar den öppna vyn hamnar man på Hem.
    setView((current) =>
      ["hem", "schema", ...(course.views || [])].includes(current) ? current : "hem",
    );
  }, [course]);

  // Tillbakalänken sätts bara av den som navigerar med avsikt (t.ex.
  // "Plugga till denna tenta") och nollställs av all annan navigering.
  function navigate(next, params = null, back = null) {
    setView(next);
    setViewParams(params);
    setBackLink(back);
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

  function toggleRead(chapterId, isRead) {
    saveReadChapter(course.id, chapterId, isRead);
    setReadChapters((prev) => {
      const next = { ...prev };
      if (isRead) next[chapterId] = true;
      else delete next[chapterId];
      return next;
    });
  }

  function solveSqlExercise(exerciseId, status) {
    saveSqlResult(exerciseId, status);
    setSqlProgress((prev) => ({ ...prev, [exerciseId]: status }));
  }

  function resetAll() {
    setAnswers({});
    setExams([]);
    setEssayState({});
    setSettings(defaultSettings);
    setExamSession(null);
    setReadChapters({});
    setSqlProgress({});
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

      <Nav
        view={view}
        onNavigate={navigate}
        courses={courses}
        course={course}
        courseId={course.id}
        onSelectCourse={setCourseId}
        examRunning={examSession?.stage === "running"}
      />

      <main id="innehall" className="mx-auto max-w-4xl px-4 py-7 sm:px-6 sm:py-10">
        {backLink && (
          <button
            type="button"
            onClick={() => navigate(backLink.view)}
            className="btn-quiet mb-5 -ml-2 max-w-full justify-start text-left"
          >
            <span className="truncate">
              ← Tillbaka till schemat · {backLink.label}
            </span>
          </button>
        )}

        {view === "hem" && (
          <Home
            {...shared}
            courses={courses}
            exams={exams}
            readChapters={readChapters}
            sqlProgress={sqlProgress}
            onSelectCourse={setCourseId}
          />
        )}
        {view === "las" && (
          <KnowledgeHub
            {...shared}
            params={viewParams}
            readChapters={readChapters}
            onToggleRead={toggleRead}
          />
        )}
        {view === "ova" && (
          <Practice {...shared} params={viewParams} onAnswer={handleAnswer} />
        )}
        {view === "prov" && (
          <Exam
            {...shared}
            session={examSession}
            setSession={setExamSession}
            onFinish={handleExamFinished}
          />
        )}
        {view === "essa" && (
          <Essays {...shared} essayState={essayState} setEssayState={setEssayState} />
        )}
        {view === "sql" && (
          <SqlWorkshop
            course={course}
            sqlProgress={sqlProgress}
            onSolve={solveSqlExercise}
          />
        )}
        {view === "schema" && (
          <Schedule
            answers={answers}
            exams={exams}
            navigate={navigate}
            onSelectCourse={setCourseId}
          />
        )}
        {view === "statistik" && (
          <Stats
            {...shared}
            exams={exams}
            readChapters={readChapters}
            sqlProgress={sqlProgress}
            onReset={resetAll}
          />
        )}
      </main>

      <footer className="mx-auto max-w-4xl px-4 pb-10 text-sm text-ink/65 sm:px-6">
        SYSB23 · Ekonomihögskolan, Lunds universitet. Allt innehåll bygger på
        kurslitteraturen och sparas bara lokalt i din webbläsare.
      </footer>
    </div>
  );
}
