import { useCallback, useEffect, useMemo, useState } from "react";
import QuestionCard from "../components/QuestionCard.jsx";
import TopicFilter from "../components/TopicFilter.jsx";
import { shuffleQuestion } from "../lib/shuffle.js";
import { hasPriorities, priorityOf } from "../lib/examPriority.js";
import { groupKeyFor, practiceGroups, practiceMode } from "../lib/practiceAxis.js";
import { COOLDOWN, isDone, nextQuestion, progressFor } from "../lib/practiceQueue.js";

// Öva utan pass: "Fortsätt öva" serverar nästa ofärdiga fråga (fel först,
// sedan obesvarade, sedan de som väntar på sitt andra rätt), och man slutar
// när man slutar. Allt tillstånd som betyder något ligger per fråga i
// localStorage (answers) — bara den fråga som visas just nu är komponentstate.
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
  const examFocus = settings.practiceExamFocus === true;
  const showExamFocus = hasPriorities(course.topics);
  const coreTopics = useMemo(
    () =>
      new Set(
        course.topics.filter((topic) => priorityOf(topic).includes("karna")).map((topic) => topic.id),
      ),
    [course],
  );
  // Inställningarna delas mellan delkurserna: val som hör till en annan
  // delkurs ignoreras.
  const activeTopics = useMemo(
    () => settings.practiceTopics.filter((id) => groups.some((group) => group.id === id)),
    [settings.practiceTopics, groups],
  );
  const recent = settings.practiceRecent?.[course.id] || [];

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

  const [filterOpen, setFilterOpen] = useState(
    () => typeof window === "undefined" || window.innerWidth >= 640,
  );
  const [currentId, setCurrentId] = useState(null);
  const [chosen, setChosen] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [includeDone, setIncludeDone] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const current = useMemo(
    () => (currentId ? course.questions.find((question) => question.id === currentId) : null),
    [course, currentId],
  );
  // Ny blandning av alternativen varje gång en fråga serveras.
  const view = useMemo(() => (current ? shuffleQuestion(current) : null), [current]);

  // Servera nästa fråga. Visningen bokförs och frågan läggs sist i karensen,
  // så att den inte återkommer förrän COOLDOWN andra frågor serverats.
  const serve = useCallback(
    (questions, withDone) => {
      const next = nextQuestion({
        questions,
        answers,
        recent,
        order,
        examFocus,
        coreTopics,
        includeDone: withDone,
      });
      if (!next) {
        setCurrentId(null);
        return;
      }
      setIncludeDone(withDone);
      setCurrentId(next.id);
      setChosen(null);
      setRevealed(false);
      onSeen(next.id);
      setSettings((prev) => ({
        ...prev,
        practiceRecent: {
          ...(prev.practiceRecent || {}),
          [course.id]: [...recent.filter((id) => id !== next.id), next.id].slice(-COOLDOWN),
        },
      }));
    },
    [answers, recent, order, examFocus, coreTopics, onSeen, setSettings, course.id],
  );

  // "Öva på detta" från Läs: förvalt kapitel och rakt in på första frågan.
  const presetKey = params?.nonce ?? null;
  useEffect(() => {
    const preset = params?.topics;
    if (!Array.isArray(preset)) return;
    const valid = preset.filter((id) => groups.some((group) => group.id === id));
    setSettings((prev) => ({ ...prev, practiceTopics: valid }));
    serve(questionsFor(valid), false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presetKey]);

  // Byte av delkurs eller urval: tillbaka till översikten.
  useEffect(() => {
    setCurrentId(null);
    setConfirmReset(false);
  }, [course.id, activeTopics]);

  const confirm = useCallback(() => {
    if (revealed || chosen === null || !view || !current) return;
    setRevealed(true);
    onAnswer(current.id, chosen === view.correct);
  }, [revealed, chosen, view, current, onAnswer]);

  const next = useCallback(() => serve(filtered, includeDone), [serve, filtered, includeDone]);
  const stop = useCallback(() => setCurrentId(null), []);

  useEffect(() => {
    function onKeyDown(event) {
      const tag = event.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (!current) return;
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
  }, [current, revealed, confirm, next]);

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

  const groupName = current ? groups.find((group) => group.id === keyOf(current))?.name : undefined;
  const currentGroup = current ? perGroup[keyOf(current)] : null;
  const allDone = filtered.length > 0 && progress.done === progress.total;
  const singleChapter = byChapter && activeTopics.length === 1;
  const counter = currentGroup
    ? `Klara: ${currentGroup.done} av ${currentGroup.total} i ${byChapter ? "kapitlet" : "ämnet"} · ${courseProgress.done} av ${courseProgress.total} totalt`
    : undefined;

  return (
    <div className="space-y-6 lg:flex lg:items-start lg:gap-8 lg:space-y-0">
      <section className="card p-5 lg:sticky lg:top-36 lg:max-h-[calc(100vh-11rem)] lg:w-80 lg:shrink-0 lg:overflow-y-auto">
        <h1 className="font-display text-2xl">Öva</h1>
        <p className="mt-1 text-[15px] text-ink/70">
          En fråga är klar när du svarat rätt två gånger i rad. Fel kommer
          först, sedan obesvarade, sedan de som väntar på sitt andra rätt. Sluta
          när du vill — du fortsätter där du var.
        </p>

        <button
          type="button"
          onClick={() => setFilterOpen(!filterOpen)}
          aria-expanded={filterOpen}
          className="btn-secondary mt-4 sm:hidden"
        >
          {filterOpen ? "Dölj urval" : byChapter ? "Välj kapitel och ordning" : "Välj ämne och ordning"}
        </button>

        {showExamFocus && (
          <div className={filterOpen ? "mt-5" : "mt-5 hidden"}>
            <h3 className="mb-2 font-display text-lg">Förval</h3>
            <button
              type="button"
              onClick={() => setSettings((prev) => ({ ...prev, practiceExamFocus: !examFocus }))}
              aria-pressed={examFocus}
              className={`chip ${examFocus ? "chip-on" : "hover:border-pine"}`}
            >
              Tentafokus
            </button>
            <p className="mt-2 text-sm text-ink/65">
              Ämnen som prövats som flervalsfrågor kommer först i varje grupp.
              Inga frågor tas bort ur urvalet.
            </p>
          </div>
        )}

        <div className={filterOpen ? "mt-5" : "mt-5 hidden"}>
          <TopicFilter
            topics={groups}
            label={byChapter ? "Kapitel" : "Ämnen"}
            selected={activeTopics}
            counts={perGroup}
            onChange={(topics) => setSettings((prev) => ({ ...prev, practiceTopics: topics }))}
          />
        </div>

        <div className={filterOpen ? "mt-5" : "mt-5 hidden"}>
          <h3 className="mb-2 font-display text-lg">Ordning</h3>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Ordning">
            {[
              { id: "blandat", label: "Blandat" },
              { id: "grupp", label: byChapter ? "Kapitel för kapitel" : "Ämne för ämne" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSettings((prev) => ({ ...prev, practiceOrder: item.id }))}
                aria-pressed={order === item.id}
                className={`chip ${order === item.id ? "chip-on" : "hover:border-pine"}`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-ink/65">
            {order === "grupp"
              ? `Obesvarade frågor kommer i samma ordning som ${byChapter ? "kapitlen i Läs" : "ämnena"}.`
              : "Obesvarade frågor kommer blandat."}
          </p>
        </div>

        {/* Enda vägen att nollställa: tydlig knapp med bekräftelse, per delkurs. */}
        <div className={filterOpen ? "mt-6 border-t border-line pt-4" : "mt-6 hidden"}>
          {confirmReset ? (
            <div>
              <p className="text-sm text-ink/70">
                Alla svar och all klar-status för {course.name} raderas. Läsning
                och SQL-övningar rörs inte.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    onResetPractice(course.questions.map((question) => question.id));
                    setSettings((prev) => ({
                      ...prev,
                      practiceRecent: { ...(prev.practiceRecent || {}), [course.id]: [] },
                    }));
                    setCurrentId(null);
                    setConfirmReset(false);
                  }}
                >
                  Ja, nollställ
                </button>
                <button type="button" className="btn-quiet" onClick={() => setConfirmReset(false)}>
                  Avbryt
                </button>
              </div>
            </div>
          ) : (
            <button type="button" className="btn-quiet px-0 text-sm" onClick={() => setConfirmReset(true)}>
              Nollställ övningsläget för {course.name}
            </button>
          )}
        </div>
      </section>

      <div className="min-w-0 flex-1 space-y-6">
        {!current && (
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
                    Öva ändå
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
                    Alla frågor i urvalet är klara. Att öva ändå ändrar ingen klar-status.
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
          <QuestionCard
            question={current}
            view={view}
            chosen={chosen}
            revealed={revealed}
            onChoose={setChosen}
            topicName={groupName}
            counter={counter}
          >
            <div className="flex flex-wrap items-center gap-3">
              {!revealed ? (
                <button type="button" className="btn-primary" disabled={chosen === null} onClick={confirm}>
                  Svara
                </button>
              ) : (
                <button type="button" className="btn-primary" onClick={next}>
                  Nästa fråga
                </button>
              )}
              <button type="button" className="btn-quiet" onClick={stop}>
                Klar för nu
              </button>
              <span className="text-sm text-ink/65">
                Tangentbord: 1–4 väljer, Enter bekräftar, → nästa.
              </span>
            </div>
          </QuestionCard>
        )}
      </div>
    </div>
  );
}
