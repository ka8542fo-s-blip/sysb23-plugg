import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import QuestionCard from "../components/QuestionCard.jsx";
import TopicFilter from "../components/TopicFilter.jsx";
import PastExamOverview from "../components/practice/PastExamOverview.jsx";
import { shuffleQuestion } from "../lib/shuffle.js";
import { chapterForQuestion, groupKeyFor, practiceGroups, practiceMode } from "../lib/practiceAxis.js";
import { COOLDOWN, isDone, nextQuestion, progressFor } from "../lib/practiceQueue.js";
import { examLabel, pastExamItems, pastExamsOf, tally } from "../lib/pastExams.js";
import { KEYS, clearAnswersFor, load, recordAnswer, save } from "../lib/storage.js";

// Öva utan pass: "Fortsätt öva" serverar nästa ofärdiga fråga (fel först,
// sedan obesvarade, sedan de som väntar på sitt andra rätt), och man slutar
// när man slutar. Allt tillstånd som betyder något ligger per fråga i
// localStorage (answers) — bara den fråga som visas just nu är komponentstate.
//
// Tentafrågor (delkurser med `pastExams`): samma kö, men bara gamla tentors
// flervalsdelar, märkta med tenta, nummer och poäng. Svaren räknas för sig
// (sysb23:tentafragor) och rör varken Alla frågor, Statistik eller
// BPMN-övningar — läget börjar från noll (användarbeslut 2026-10-22).
export default function Practice({
  course,
  answers,
  settings,
  setSettings,
  params,
  onAnswer,
  onSeen,
  onResetPractice,
  navigate,
}) {
  const groups = useMemo(() => practiceGroups(course), [course]);
  const keyOf = useMemo(() => groupKeyFor(course), [course]);
  const byChapter = practiceMode(course) === "chapter";
  const order = settings.practiceOrder === "grupp" ? "grupp" : "blandat";
  // Inställningarna delas mellan delkurserna: val som hör till en annan
  // delkurs ignoreras.
  const activeTopics = useMemo(
    () => settings.practiceTopics.filter((id) => groups.some((group) => group.id === id)),
    [settings.practiceTopics, groups],
  );

  const questionsFor = useCallback(
    (topicIds) =>
      course.questions.filter(
        (question) => topicIds.length === 0 || topicIds.includes(keyOf(question)),
      ),
    [course, keyOf],
  );
  const filtered = useMemo(() => questionsFor(activeTopics), [questionsFor, activeTopics]);
  const progress = useMemo(() => progressFor(filtered, answers), [filtered, answers]);
  const courseProgress = useMemo(() => progressFor(course.questions, answers), [course, answers]);
  const perGroup = useMemo(() => {
    const counts = {};
    for (const group of groups) counts[group.id] = { done: 0, total: 0 };
    for (const question of course.questions) {
      const entry = counts[keyOf(question)];
      if (!entry) continue;
      entry.total++;
      if (isDone(answers[question.id])) entry.done++;
    }
    return counts;
  }, [groups, course, keyOf, answers]);

  // Tentafrågor. Posterna byggs en gång per delkurs, så att alternativens
  // blandning (view nedan) ligger still medan man svarar.
  const exams = useMemo(() => pastExamsOf(course), [course]);
  const examItems = useMemo(() => pastExamItems(course), [course]);
  const hasExamMode = examItems.length > 0;
  const examMode = hasExamMode && settings.practiceScope?.[course.id] === "tenta";
  const examIdsKey = (settings.practiceExams?.[course.id] || [])
    .filter((id) => exams.some((exam) => exam.id === id))
    .join(",");
  const activeExams = useMemo(() => (examIdsKey ? examIdsKey.split(",") : []), [examIdsKey]);
  const selectedExams = useMemo(
    () => exams.filter((exam) => activeExams.length === 0 || activeExams.includes(exam.id)),
    [exams, activeExams],
  );
  const examOrder = settings.practiceExamOrder?.[course.id] === "blandat" ? "blandat" : "grupp";
  const examPool = useMemo(
    () => examItems.filter((item) => activeExams.length === 0 || activeExams.includes(item.exam)),
    [examItems, activeExams],
  );
  const [examAnswers, setExamAnswers] = useState(() => load(KEYS.examAnswers, {}));
  useEffect(() => save(KEYS.examAnswers, examAnswers), [examAnswers]);
  const perExam = useMemo(() => {
    const counts = {};
    for (const exam of exams) {
      const { done, total } = tally(examItems.filter((item) => item.exam === exam.id), examAnswers);
      counts[exam.id] = { done, total };
    }
    return counts;
  }, [exams, examItems, examAnswers]);

  const [filterOpen, setFilterOpen] = useState(
    () => typeof window === "undefined" || window.innerWidth >= 640,
  );
  const [currentId, setCurrentId] = useState(null);
  // Räknas upp vid varje servering, så att samma fråga igen (sista kvar i
  // kön) också får ny blandning, scroll och fokus.
  const [served, setServed] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [includeDone, setIncludeDone] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const cardRef = useRef(null);
  const scrollToCard = useRef(false);

  const current = useMemo(() => {
    if (!currentId) return null;
    const list = examMode ? examItems : course.questions;
    return list.find((question) => question.id === currentId) || null;
  }, [course, examItems, examMode, currentId]);
  // Ny blandning av alternativen varje gång en fråga serveras.
  const view = useMemo(() => (current ? shuffleQuestion(current) : null), [current, served]);

  // Visa en fråga. Visningen bokförs (bara i Alla frågor) och frågan läggs
  // sist i lägets karens, så att den inte återkommer förrän COOLDOWN andra
  // frågor serverats. Tentafrågor har en egen karens.
  const show = useCallback(
    (id, tenta) => {
      setCurrentId(id);
      setServed((count) => count + 1);
      setChosen(null);
      setRevealed(false);
      scrollToCard.current = true;
      if (!tenta) onSeen(id);
      const key = tenta ? `${course.id}:tenta` : course.id;
      setSettings((prev) => {
        const list = prev.practiceRecent?.[key] || [];
        return {
          ...prev,
          practiceRecent: {
            ...(prev.practiceRecent || {}),
            [key]: [...list.filter((item) => item !== id), id].slice(-COOLDOWN),
          },
        };
      });
    },
    [onSeen, setSettings, course.id],
  );

  // Servera nästa fråga ur `questions` med lägets svar, ordning och karens.
  const serve = useCallback(
    (questions, withDone, tenta = examMode) => {
      const next = nextQuestion({
        questions,
        answers: tenta ? examAnswers : answers,
        recent: settings.practiceRecent?.[tenta ? `${course.id}:tenta` : course.id] || [],
        order: tenta ? examOrder : order,
        includeDone: withDone,
      });
      if (!next) {
        setCurrentId(null);
        return;
      }
      setIncludeDone(withDone);
      show(next.id, tenta);
    },
    [examMode, examAnswers, answers, settings.practiceRecent, course.id, examOrder, order, show],
  );

  const setScope = useCallback(
    (scope) => {
      setSettings((prev) => ({
        ...prev,
        practiceScope: { ...(prev.practiceScope || {}), [course.id]: scope },
      }));
      setCurrentId(null);
      setConfirmReset(false);
    },
    [setSettings, course.id],
  );

  // "Öva på detta" från Läs: förvalt kapitel och rakt in på första frågan,
  // alltid i Alla frågor. presetTopicsRef håller urvalet tills det slagit
  // igenom, så att översiktseffekten nedan inte nollställer frågan.
  const presetKey = params?.nonce ?? null;
  const presetTopicsRef = useRef(null);
  useEffect(() => {
    const preset = params?.topics;
    if (!Array.isArray(preset)) return;
    const valid = preset.filter((id) => groups.some((group) => group.id === id));
    setSettings((prev) => ({
      ...prev,
      practiceTopics: valid,
      practiceScope: { ...(prev.practiceScope || {}), [course.id]: "alla" },
    }));
    presetTopicsRef.current = valid.join(",");
    serve(questionsFor(valid), false, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presetKey]);

  // Tillbaka från kapitlet, Essä eller BPMN-övningar: samma läge, och samma
  // fråga igen obesvarad om en sådan anges, utan att urvalet ändras.
  // Översiktseffekten nedan körs också vid monteringen och ska då inte
  // nollställa frågan.
  const resumedRef = useRef(false);
  useEffect(() => {
    const scope = params?.scope;
    if (scope !== "tenta" && scope !== "alla" && !params?.questionId) return;
    const tenta = scope === "tenta" && hasExamMode;
    if (hasExamMode && scope) {
      setSettings((prev) => ({
        ...prev,
        practiceScope: { ...(prev.practiceScope || {}), [course.id]: tenta ? "tenta" : "alla" },
      }));
    }
    const id = params?.questionId;
    const list = tenta ? examItems : course.questions;
    if (!id || !list.some((question) => question.id === id)) return;
    resumedRef.current = true;
    setCurrentId(id);
    setChosen(null);
    setRevealed(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presetKey]);

  // Byte av delkurs eller urval: tillbaka till översikten. Byte av läge
  // och tentaurval gör det i sina egna handlers. Urvalet jämförs på
  // innehåll: förvalet från Läs skriver alltid en ny lista.
  const topicsKey = activeTopics.join(",");
  useEffect(() => {
    if (presetTopicsRef.current !== null) {
      if (presetTopicsRef.current === topicsKey) presetTopicsRef.current = null;
      return;
    }
    if (resumedRef.current) {
      resumedRef.current = false;
      return;
    }
    setCurrentId(null);
    setConfirmReset(false);
  }, [course.id, topicsKey]);

  // Efter "Nästa fråga" eller ett val i rutnätet: visa början av frågan,
  // under den klistrade headern, och flytta fokus dit.
  useEffect(() => {
    if (!scrollToCard.current || !cardRef.current) return;
    scrollToCard.current = false;
    const header = document.querySelector("header")?.offsetHeight ?? 0;
    const top = cardRef.current.getBoundingClientRect().top + window.scrollY - header - 12;
    if (top < window.scrollY) {
      const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
    }
    cardRef.current.focus({ preventScroll: true });
  }, [currentId, served]);

  // Läs kapitlet frågan hör till; tillbakalänken där tar en till samma fråga.
  const currentChapterId = useMemo(() => chapterForQuestion(course, current), [course, current]);
  const toChapter = useCallback(() => {
    if (!current || !currentChapterId) return;
    navigate(
      "las",
      { segment: "kompendium", chapterId: currentChapterId },
      {
        view: "ova",
        title: "Tillbaka till frågan",
        params: { questionId: current.id, scope: examMode ? "tenta" : "alla", nonce: Date.now() },
      },
    );
  }, [current, currentChapterId, navigate, examMode]);

  // Körfrågorna finns också i BPMN-övningar, där svaret visar körningen
  // steg för steg.
  const toRun = useCallback(() => {
    if (!current?.run) return;
    navigate(
      "bpmn",
      { taskId: current.run, nonce: Date.now() },
      { view: "ova", title: "Tillbaka till frågan", params: { questionId: current.id, scope: "tenta", nonce: Date.now() } },
    );
  }, [current, navigate]);

  const toEssay = useCallback(
    (essayId) =>
      navigate(
        "essa",
        { essayId },
        { view: "ova", title: "Tillbaka till tentafrågorna", params: { scope: "tenta", nonce: Date.now() } },
      ),
    [navigate],
  );

  const confirm = useCallback(() => {
    if (revealed || chosen === null || !view || !current) return;
    setRevealed(true);
    const wasCorrect = chosen === view.correct;
    if (examMode) setExamAnswers((prev) => recordAnswer(prev, current.id, wasCorrect));
    else onAnswer(current.id, wasCorrect);
  }, [revealed, chosen, view, current, examMode, onAnswer]);

  const pool = examMode ? examPool : filtered;
  const next = useCallback(() => serve(pool, includeDone), [serve, pool, includeDone]);
  const stop = useCallback(() => setCurrentId(null), []);
  // Ett val i rutnätet: just den frågan, även om den är klar.
  const pick = useCallback(
    (id) => {
      setIncludeDone(tally(examPool, examAnswers).done === examPool.length);
      show(id, true);
    },
    [examPool, examAnswers, show],
  );

  useEffect(() => {
    function onKeyDown(event) {
      const tag = event.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (!current) return;
      // Enter på en annan kontroll (zoomknapparna, växeln, Kör diagrammet,
      // länkar) tillhör den kontrollen; Svara och Nästa gör samma sak med
      // sitt eget klick. Pil höger tillhör den scrollbara diagramramen.
      // Svarsalternativen, kortet och sidan i övrigt har genvägarna.
      const control = event.target?.closest?.("button, a[href], [tabindex='0']");
      const foreign = control && !control.closest("[aria-label='Svarsalternativ']");
      const scrolls = Boolean(event.target?.closest?.("[tabindex='0']"));
      if (/^[1-9]$/.test(event.key) && Number(event.key) <= (view?.options.length ?? 4)) {
        if (revealed) return;
        event.preventDefault();
        setChosen(Number(event.key) - 1);
      } else if (event.key === "Enter") {
        if (foreign) return;
        event.preventDefault();
        if (revealed) next();
        else confirm();
      } else if (event.key === "ArrowRight") {
        if (!revealed || scrolls) return;
        event.preventDefault();
        next();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [current, view, revealed, confirm, next]);

  if (course.questions.length === 0) {
    return (
      <div className="card max-w-3xl p-5 sm:p-6">
        <h1 className="font-display text-2xl">Öva</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-ink/70">
          Frågebanken för den här delkursen är inte inlagd ännu. Under tiden
          finns kompendiet under Läs{course.views?.includes("sql") ? " och SQL-verkstaden under SQL" : ""}.
        </p>
      </div>
    );
  }

  const allDone = filtered.length > 0 && progress.done === progress.total;
  const singleChapter = byChapter && activeTopics.length === 1;

  // Kortets huvud: i Tentafrågor tentan, numret och poängen; annars kapitlet.
  const currentExam = examMode && current ? exams.find((exam) => exam.id === current.exam) : null;
  let counter;
  let tag;
  let groupName;
  if (currentExam) {
    const inExam = perExam[currentExam.id];
    const inPool = tally(examPool, examAnswers);
    counter = `Klara: ${inExam.done} av ${inExam.total} i tentan${
      selectedExams.length > 1 ? ` · ${inPool.done} av ${inPool.total} totalt` : ""
    }`;
    tag = (
      <>
        <span className="rounded-full border border-brass/50 px-2.5 py-0.5 text-xs font-medium text-brass-text">
          {examLabel(currentExam)} · fråga {current.no}
        </span>
        <span className="tabular text-ink/70">{current.points} p</span>
      </>
    );
  } else if (current) {
    groupName = groups.find((group) => group.id === keyOf(current))?.name;
    const currentGroup = perGroup[keyOf(current)];
    counter = currentGroup
      ? `Klara: ${currentGroup.done} av ${currentGroup.total} i ${byChapter ? "kapitlet" : "ämnet"} · ${courseProgress.done} av ${courseProgress.total} totalt`
      : undefined;
  }

  const reset = () => {
    if (examMode) {
      setExamAnswers((prev) => clearAnswersFor(prev, examItems.map((item) => item.id)));
    } else {
      onResetPractice(course.questions.map((question) => question.id));
    }
    const key = examMode ? `${course.id}:tenta` : course.id;
    setSettings((prev) => ({
      ...prev,
      practiceRecent: { ...(prev.practiceRecent || {}), [key]: [] },
    }));
    setCurrentId(null);
    setConfirmReset(false);
  };

  return (
    <div className="space-y-6 lg:flex lg:items-start lg:gap-8 lg:space-y-0">
      <section className="card p-5 lg:sticky lg:top-36 lg:max-h-[calc(100vh-11rem)] lg:w-80 lg:shrink-0 lg:overflow-y-auto">
        <h1 className="font-display text-2xl">Öva</h1>

        {hasExamMode && (
          <div className="mt-3 flex rounded-[10px] border border-line bg-surface p-1" role="group" aria-label="Vilka frågor">
            {[
              { id: "alla", label: "Alla frågor" },
              { id: "tenta", label: "Tentafrågor" },
            ].map((segment) => {
              const active = (segment.id === "tenta") === examMode;
              return (
                <button
                  key={segment.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => !active && setScope(segment.id)}
                  className={`flex-1 rounded-md px-3 py-1.5 text-[15px] transition-colors duration-150 ${
                    active ? "bg-pine font-medium text-paper hover:bg-pine-dark" : "text-ink hover:bg-pine/[0.08] hover:text-pine"
                  }`}
                >
                  {segment.label}
                </button>
              );
            })}
          </div>
        )}

        <p className={`${hasExamMode ? "mt-3" : "mt-1"} text-[15px] text-ink/70`}>
          {examMode
            ? "Bara frågor som kommit på gamla tentor, med tentans nummer och poäng. Svaren här räknas för sig och påverkar inte resten av Öva eller Statistik."
            : "En fråga är klar när du svarat rätt två gånger i rad. Fel kommer först, sedan obesvarade, sedan de som väntar på sitt andra rätt. Sluta när du vill — du fortsätter där du var."}
        </p>

        <button
          type="button"
          onClick={() => setFilterOpen(!filterOpen)}
          aria-expanded={filterOpen}
          className="btn-secondary mt-4 sm:hidden"
        >
          {filterOpen
            ? "Dölj urval"
            : examMode
              ? "Välj tenta och ordning"
              : byChapter
                ? "Välj kapitel och ordning"
                : "Välj ämne och ordning"}
        </button>

        <div className={filterOpen ? "mt-5" : "mt-5 hidden"}>
          {examMode ? (
            <TopicFilter
              topics={exams.map((exam) => ({ id: exam.id, name: exam.short }))}
              label="Tentor"
              selected={activeExams}
              counts={perExam}
              onChange={(ids) => {
                setSettings((prev) => ({
                  ...prev,
                  practiceExams: { ...(prev.practiceExams || {}), [course.id]: ids },
                }));
                setCurrentId(null);
              }}
            />
          ) : (
            <TopicFilter
              topics={groups}
              label={byChapter ? "Kapitel" : "Ämnen"}
              selected={activeTopics}
              counts={perGroup}
              onChange={(topics) => setSettings((prev) => ({ ...prev, practiceTopics: topics }))}
            />
          )}
        </div>

        <div className={filterOpen ? "mt-5" : "mt-5 hidden"}>
          <h3 className="mb-2 font-display text-lg">Ordning</h3>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Ordning">
            {(examMode
              ? [
                  { id: "grupp", label: "I tentans ordning" },
                  { id: "blandat", label: "Blandat" },
                ]
              : [
                  { id: "blandat", label: "Blandat" },
                  { id: "grupp", label: byChapter ? "Kapitel för kapitel" : "Ämne för ämne" },
                ]
            ).map((item) => {
              const on = (examMode ? examOrder : order) === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setSettings((prev) =>
                      examMode
                        ? {
                            ...prev,
                            practiceExamOrder: {
                              ...(prev.practiceExamOrder || {}),
                              [course.id]: item.id === "grupp" ? "tenta" : "blandat",
                            },
                          }
                        : { ...prev, practiceOrder: item.id },
                    )
                  }
                  aria-pressed={on}
                  className={`chip ${on ? "chip-on" : "hover:border-pine"}`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-sm text-ink/65">
            {examMode
              ? examOrder === "grupp"
                ? "Obesvarade frågor kommer i tentans ordning, tenta för tenta."
                : "Obesvarade frågor kommer blandat."
              : order === "grupp"
                ? `Obesvarade frågor kommer i samma ordning som ${byChapter ? "kapitlen i Läs" : "ämnena"}.`
                : "Obesvarade frågor kommer blandat."}
          </p>
        </div>

        {/* Enda vägen att nollställa: tydlig knapp med bekräftelse, per delkurs och läge. */}
        <div className={filterOpen ? "mt-6 border-t border-line pt-4" : "mt-6 hidden"}>
          {confirmReset ? (
            <div>
              <p className="text-sm text-ink/70">
                {examMode
                  ? `Alla svar i Tentafrågor för ${course.name} raderas. Resten av Öva och Statistik rörs inte.`
                  : `Alla svar och all klar-status för ${course.name} raderas. Läsning och SQL-övningar rörs inte${hasExamMode ? ", och inte heller Tentafrågor" : ""}.`}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button type="button" className="btn-secondary" onClick={reset}>
                  Ja, nollställ
                </button>
                <button type="button" className="btn-quiet" onClick={() => setConfirmReset(false)}>
                  Avbryt
                </button>
              </div>
            </div>
          ) : (
            <button type="button" className="btn-quiet px-0 text-sm" onClick={() => setConfirmReset(true)}>
              {examMode ? "Nollställ tentafrågorna" : `Nollställ övningsläget för ${course.name}`}
            </button>
          )}
        </div>
      </section>

      <div className="min-w-0 flex-1 space-y-6">
        {!current && examMode && (
          <PastExamOverview
            exams={selectedExams}
            items={examPool}
            answers={examAnswers}
            onPick={pick}
            onStart={(withDone) => serve(examPool, withDone, true)}
            onEssay={navigate && course.views?.includes("essa") ? toEssay : null}
          />
        )}

        {!current && !examMode && (
          <section className="card mx-auto w-full max-w-reading p-5 sm:p-7">
            <p className="text-sm text-ink/65">
              {activeTopics.length === 0
                ? "Hela delkursen"
                : activeTopics.map((id) => groups.find((group) => group.id === id)?.name).join(", ")}
            </p>
            <h2 className="tabular mt-1 font-display text-3xl">
              {progress.done} av {progress.total} klara
            </h2>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-line" aria-hidden="true">
              <div
                className="h-full rounded-full bg-pine"
                style={{ width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%` }}
              />
            </div>

            {/* Kapitelraderna visar var man står; urvalet görs i sidopanelen. */}
            <ul className="mt-5 space-y-1.5">
              {groups
                .filter((group) => activeTopics.length === 0 || activeTopics.includes(group.id))
                .filter((group) => perGroup[group.id]?.total > 0)
                .map((group) => {
                  const entry = perGroup[group.id];
                  return (
                    <li key={group.id} className="flex items-center gap-3 text-[15px]">
                      <span className="min-w-0 flex-1 truncate">{group.name}</span>
                      <span className="h-1.5 w-20 shrink-0 overflow-hidden rounded-full bg-line" aria-hidden="true">
                        <span
                          className="block h-full rounded-full bg-pine"
                          style={{ width: `${(entry.done / entry.total) * 100}%` }}
                        />
                      </span>
                      <span className="tabular w-12 shrink-0 text-right text-sm text-ink/65">
                        {entry.done}/{entry.total}
                      </span>
                    </li>
                  );
                })}
            </ul>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {filtered.length === 0 ? (
                <p className="text-[15px] text-ink/70">Inga frågor i urvalet. Välj fler kapitel.</p>
              ) : allDone ? (
                <>
                  <button type="button" className="btn-primary" onClick={() => serve(filtered, true)}>
                    Fortsätt öva
                  </button>
                  {navigate && (
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() =>
                        navigate("las", {
                          segment: "kompendium",
                          chapterId: singleChapter ? activeTopics[0] : null,
                        })
                      }
                    >
                      {singleChapter ? "Tillbaka till kapitlet" : "Tillbaka till Läs"}
                    </button>
                  )}
                  <span className="text-sm text-ink/65">
                    Alla frågor i urvalet är klara. Svarar du fel på en klar fråga blir den ofärdig igen.
                  </span>
                </>
              ) : (
                <button type="button" className="btn-primary" onClick={() => serve(filtered, false)}>
                  Fortsätt öva
                </button>
              )}
            </div>
          </section>
        )}

        {current && view && (
          <div ref={cardRef} tabIndex={-1} className="focus:outline-none">
            <QuestionCard
              question={current}
              view={view}
              chosen={chosen}
              revealed={revealed}
              onChoose={setChosen}
              topicName={groupName}
              counter={counter}
              tag={tag}
              zoomable
            >
              <div className="flex flex-wrap items-center gap-3">
                {!revealed ? (
                  <button type="button" className="btn-primary" disabled={chosen === null} onClick={confirm}>
                    Svara
                  </button>
                ) : (
                  <button type="button" className="btn-primary" onClick={next}>
                    {examMode ? "Nästa tentafråga" : "Nästa fråga"}
                  </button>
                )}
                {revealed && examMode && current.run && navigate && course.views?.includes("bpmn") && (
                  <button type="button" className="btn-secondary" onClick={toRun}>
                    Kör diagrammet i BPMN-övningar
                  </button>
                )}
                {navigate && currentChapterId && (
                  <button type="button" className="btn-secondary" onClick={toChapter}>
                    Tillbaka till kapitlet
                  </button>
                )}
                <button type="button" className="btn-quiet" onClick={stop}>
                  {examMode ? "Till översikten" : "Klar för nu"}
                </button>
                <span className="text-sm text-ink/65">
                  Tangentbord: 1–{view.options.length} väljer, Enter bekräftar, → nästa.
                </span>
              </div>
            </QuestionCard>
          </div>
        )}
      </div>
    </div>
  );
}
