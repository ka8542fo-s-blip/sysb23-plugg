import { useEffect, useMemo, useRef, useState } from "react";
import SqlEditor from "./SqlEditor.jsx";
import ResultBanner from "./ResultBanner.jsx";
import ResultPanel from "./ResultPanel.jsx";
import SchemaPanel from "./SchemaPanel.jsx";
import { checkExercise } from "../../lib/sqlCheck.js";
import { collectFacts, generateExercise, normalizeSql } from "../../lib/sqlPractice.js";
import { DIFFICULTIES } from "../../lib/sqlGenerator.js";
import { load, save, KEYS } from "../../lib/storage.js";

const DIFFICULTY_LABEL = { 1: "Grund", 2: "Standard", 3: "Klurig" };

// Slumpläget: uppgifterna byggs ur schemat vid varje klick, så samma fråga
// kommer sällan tillbaka och kursövningarnas progress lämnas orörd.
export default function PracticeMode({ engine, courseExercises }) {
  const [difficulty, setDifficulty] = useState(0);
  const [exercise, setExercise] = useState(null);
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const [schemaOpen, setSchemaOpen] = useState(false);
  const [bannerHidden, setBannerHidden] = useState(false);
  const [helped, setHelped] = useState(false);
  const [solvedTotal, setSolvedTotal] = useState(() => Number(load(KEYS.sqlRandom, 0)) || 0);
  const [failed, setFailed] = useState(false);

  const dbRef = useRef(null);
  const factsRef = useRef(null);
  const editorRef = useRef(null);
  const bannerRef = useRef(null);

  const taken = useMemo(
    () => new Set((courseExercises || []).map((item) => normalizeSql(item.solution))),
    [courseExercises],
  );

  // En egen databas för generatorn: den läser bara värden ur den, och
  // rättningen får som vanligt en färsk databas per körning.
  useEffect(() => {
    let alive = true;
    engine.newDatabase().then((db) => {
      if (!alive) {
        db.close?.();
        return;
      }
      dbRef.current = db;
      factsRef.current = collectFacts(db, engine.runSelect);
      setExercise(makeExercise(0));
    });
    return () => {
      alive = false;
      dbRef.current?.close?.();
      dbRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function makeExercise(level) {
    if (!dbRef.current || !factsRef.current) return null;
    return generateExercise({
      db: dbRef.current,
      runSelect: engine.runSelect,
      facts: factsRef.current,
      taken,
      difficulty: level,
    });
  }

  function newExercise(level = difficulty) {
    const next = makeExercise(level);
    setFailed(!next);
    if (!next) return;
    setExercise(next);
    setCode("");
    setResult(null);
    setHintOpen(false);
    setHelped(false);
    setBannerHidden(false);
    editorRef.current?.focus();
  }

  function changeDifficulty(level) {
    setDifficulty(level);
    newExercise(level);
  }

  useEffect(() => {
    if (!result || bannerHidden) return;
    const box = bannerRef.current?.getBoundingClientRect();
    if (!box) return;
    if (box.top < 0 || box.bottom > window.innerHeight) {
      bannerRef.current.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [result, bannerHidden]);

  async function run() {
    if (!exercise || running) return;
    setBannerHidden(false);
    setRunning(true);
    try {
      const outcome = await checkExercise({ exercise, userSql: code, engine });
      setResult(outcome);
      if (outcome.status === "correct" && !helped) {
        const next = solvedTotal + 1;
        setSolvedTotal(next);
        save(KEYS.sqlRandom, next);
      }
    } catch (error) {
      setResult({ status: "error", raw: error.message, message: null });
    } finally {
      setRunning(false);
    }
  }

  if (!exercise) {
    return (
      <p className="card p-4 text-[15px] text-ink/70">
        {failed ? "Kunde inte skapa någon övning just nu — prova en annan svårighetsgrad." : "Slumpar fram en övning…"}
      </p>
    );
  }

  return (
    <section className="card p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="font-display text-xl">Slumpövning</h2>
        <span className="tabular text-sm text-ink/65">
          {solvedTotal} {solvedTotal === 1 ? "löst slumpövning" : "lösta slumpövningar"}
        </span>
      </div>
      <p className="mt-1 max-w-reading text-[15px] text-ink/70">
        Frågorna byggs ur databasens tabeller och värden vid varje klick — inte ur
        kurslistan. Samma schema, nya frågor.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {DIFFICULTIES.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={difficulty === item.id}
            className={`chip ${difficulty === item.id ? "chip-on" : ""}`}
            onClick={() => changeDifficulty(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-4 border-t border-line pt-4">
        <p className="flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-brass">
          {DIFFICULTY_LABEL[exercise.difficulty]}
          <span className="font-sans text-sm font-normal normal-case tracking-normal text-ink/65">
            {exercise.tables.join(" · ")}
          </span>
        </p>
        <h3 className="mt-1 font-display text-xl">{exercise.task}</h3>

        {exercise.hint && (
          <div className="mt-3">
            <button
              type="button"
              className="btn-quiet text-sm"
              aria-expanded={hintOpen}
              onClick={() => setHintOpen(!hintOpen)}
            >
              {hintOpen ? "Dölj ledtråd" : "Ledtråd"}
            </button>
            {hintOpen && (
              <p className="mt-1 rounded-lg border-l-2 border-brass bg-paper p-3 text-[15px]">
                {exercise.hint}
              </p>
            )}
          </div>
        )}

        <div className="mt-4">
          <SqlEditor
            ref={editorRef}
            value={code}
            onChange={setCode}
            onRun={run}
            disabled={running}
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setCode("");
              setResult(null);
              setBannerHidden(false);
              editorRef.current?.focus();
            }}
          >
            Rensa
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setSchemaOpen(!schemaOpen)}
            aria-expanded={schemaOpen}
          >
            {schemaOpen ? "Dölj tabeller" : "Visa tabeller"}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setCode(exercise.solution);
              setHelped(true);
              setResult(null);
              editorRef.current?.focus();
            }}
          >
            Visa lösning
          </button>
          <button type="button" className="btn-secondary" onClick={() => newExercise()}>
            Ny övning ⟳
          </button>
          <button
            type="button"
            className="btn-emphasis ml-auto"
            onClick={run}
            disabled={running}
          >
            {running ? "Kör…" : "Kör ▸"}
          </button>
        </div>

        {result && !bannerHidden && (
          <div className="mt-4" ref={bannerRef}>
            <ResultBanner result={result} onDismiss={() => setBannerHidden(true)} />
          </div>
        )}

        {result?.status === "correct" && (
          <div className="mt-3">
            <button type="button" className="btn-primary" onClick={() => newExercise()}>
              Nästa slumpövning →
            </button>
          </div>
        )}

        {schemaOpen && (
          <div className="mt-4 border-t border-line pt-4">
            <SchemaPanel
              onPickTable={(sql) => {
                setCode(sql);
                editorRef.current?.focus();
              }}
            />
          </div>
        )}

        {result && (
          <div className="mt-4">
            <ResultPanel result={result} />
          </div>
        )}
      </div>
    </section>
  );
}
