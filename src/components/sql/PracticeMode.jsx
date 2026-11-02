import { useEffect, useMemo, useRef, useState } from "react";
import { checkExercise } from "../../lib/sqlCheck.js";
import { formatSql } from "../../lib/sqlIndent.js";
import { collectFacts, generateExercise, normalizeSql } from "../../lib/sqlPractice.js";
import { DIFFICULTIES } from "../../lib/sqlGenerator.js";
import { load, save, KEYS } from "../../lib/storage.js";
import { useWide } from "../../lib/useWide.js";
import HelpRail from "./HelpRail.jsx";
import SchemaList from "./SchemaList.jsx";
import TaskCard, { TaskPrompt } from "./TaskCard.jsx";
import { tableReader } from "./TaskView.jsx";

const DIFFICULTY_LABEL = { 1: "Grund", 2: "Standard", 3: "Klurig" };

// Slumpläget: uppgifterna byggs ur schemat vid varje klick, så samma fråga
// kommer sällan tillbaka och kursövningarnas progress lämnas orörd. Pågående
// uppgift och svar sparas (sqlSlumpUppgift) och finns kvar efter omladdning.
export default function PracticeMode({ engine, courseExercises }) {
  const [session] = useState(() => load(KEYS.sqlRandomTask, null));
  const [difficulty, setDifficulty] = useState(session?.difficulty ?? 0);
  const [exercise, setExercise] = useState(session?.exercise ?? null);
  const [code, setCode] = useState(session?.code ?? "");
  const [helped, setHelped] = useState(session?.helped ?? false);
  const [round, setRound] = useState(0);
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);
  const [solvedTotal, setSolvedTotal] = useState(() => Number(load(KEYS.sqlRandom, 0)) || 0);
  const [failed, setFailed] = useState(false);
  const wide = useWide();

  const dbRef = useRef(null);
  const factsRef = useRef(null);

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
      if (!session?.exercise) setExercise(makeExercise(difficulty));
    });
    return () => {
      alive = false;
      dbRef.current?.close?.();
      dbRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (exercise) save(KEYS.sqlRandomTask, { difficulty, exercise, code, helped });
  }, [difficulty, exercise, code, helped]);

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
    setHelped(false);
    setRound(round + 1);
  }

  function changeDifficulty(level) {
    setDifficulty(level);
    newExercise(level);
  }

  async function run() {
    if (!exercise || running) return;
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

  const rail = (
    <HelpRail
      tabs={[{ id: "tabeller", label: "Tabeller", content: <SchemaList read={tableReader(engine)} /> }]}
      value="tabeller"
      onChange={() => {}}
      wide={wide}
    />
  );

  return (
    <div className="space-y-4">
      <section className="card flex flex-wrap items-center gap-x-4 gap-y-2 p-4">
        <div className="flex flex-wrap gap-2">
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
        <span className="tabular ml-auto text-sm text-ink/65">
          {solvedTotal} {solvedTotal === 1 ? "löst slumpövning" : "lösta slumpövningar"}
        </span>
        <p className="w-full max-w-reading text-sm text-ink/65">
          Frågorna byggs ur databasens tabeller och värden vid varje klick, inte ur listorna. Samma schema, nya frågor.
        </p>
      </section>

      <div className={wide ? "grid grid-cols-[minmax(0,1fr)_24rem] items-start gap-6" : ""}>
        <TaskCard
          key={round}
          kicker={`${DIFFICULTY_LABEL[exercise.difficulty]} · ${exercise.tables.join(" · ")}`}
          prompt={<TaskPrompt text={exercise.task} />}
          hint={exercise.hint}
          help={wide ? null : rail}
          code={code}
          onCodeChange={setCode}
          onRun={run}
          running={running}
          editorRows={8}
          result={result}
          solution={formatSql(exercise.solution)}
          onSolutionShown={() => setHelped(true)}
          next={{ label: "Nästa slumpövning →", onClick: () => newExercise() }}
          autoFocus={wide && round > 0}
          footer={
            <div className="flex justify-end">
              <button type="button" className="btn-secondary" onClick={() => newExercise()}>Ny övning ⟳</button>
            </div>
          }
        />
        {wide && rail}
      </div>
    </div>
  );
}
