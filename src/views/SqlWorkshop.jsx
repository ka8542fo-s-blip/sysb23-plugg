import { useEffect, useMemo, useRef, useState } from "react";
import SegmentedControl from "../components/SegmentedControl.jsx";
import SqlEditor from "../components/sql/SqlEditor.jsx";
import ResultPanel from "../components/sql/ResultPanel.jsx";
import ResultBanner from "../components/sql/ResultBanner.jsx";
import ResultTable from "../components/sql/ResultTable.jsx";
import SchemaPanel from "../components/sql/SchemaPanel.jsx";
import ExerciseList from "../components/sql/ExerciseList.jsx";
import PracticeMode from "../components/sql/PracticeMode.jsx";
import LessonText from "../components/sql/LessonText.jsx";
import { loadEngine, newDatabase, runSelect, runScript } from "../lib/sqlEngine.js";
import { checkExercise, splitStatements, interpretError } from "../lib/sqlCheck.js";
import { checkTsqlRules, toSqlite } from "../lib/tsql.js";

const MODES = [
  { id: "ovningar", label: "Övningar" },
  { id: "slump", label: "Slumpövningar" },
  { id: "fritt", label: "Fritt läge" },
];

const engine = { newDatabase, runSelect, runScript };

export default function SqlWorkshop({ course, sqlProgress, onSolve, onReset }) {
  const levels = course.sqlLevels || [];
  const exercises = course.sqlExercises || [];

  const [mode, setMode] = useState("ovningar");
  const [engineState, setEngineState] = useState("loading");
  const [currentId, setCurrentId] = useState(
    () => exercises.find((exercise) => !sqlProgress[exercise.id])?.id || exercises[0]?.id,
  );
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const [lessonOpen, setLessonOpen] = useState(true);
  const [schemaOpen, setSchemaOpen] = useState(false);
  const [confirmSolution, setConfirmSolution] = useState(false);
  const [bannerHidden, setBannerHidden] = useState(false);
  const editorRef = useRef(null);
  const bannerRef = useRef(null);

  // Fritt läge behåller sin databas mellan körningar, så att en DELETE
  // syns tills man trycker Återställ.
  const freeDb = useRef(null);
  const [freeCode, setFreeCode] = useState("SELECT * FROM Employee;");
  const [freeResult, setFreeResult] = useState(null);
  const [freeError, setFreeError] = useState(null);

  const exercise = exercises.find((item) => item.id === currentId) || exercises[0];
  const level = levels.find((item) => item.id === exercise?.level);
  const levelIndex = levels.findIndex((item) => item.id === exercise?.level);

  // sql.js laddas först när läget öppnas — inte vid appens start.
  useEffect(() => {
    let alive = true;
    loadEngine()
      .then(() => alive && setEngineState("ready"))
      .catch(() => alive && setEngineState("error"));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      freeDb.current?.close?.();
      freeDb.current = null;
    };
  }, []);

  // Byte av övning: förifyll starter, nollställ resultat och ledtråd.
  useEffect(() => {
    if (!exercise) return;
    setCode(exercise.starter || "");
    setResult(null);
    setHintOpen(false);
    setConfirmSolution(false);
  }, [exercise?.id]);

  // Redigeraren och Kör-knappen blir disabled under körningen, och då
  // kastar webbläsaren fokus till <body>. Lägg tillbaka det efteråt, så att
  // man kan fortsätta skriva direkt efter Ctrl/Cmd + Enter.
  const wasRunning = useRef(false);
  useEffect(() => {
    if (wasRunning.current && !running && document.activeElement === document.body) {
      editorRef.current?.focus();
    }
    wasRunning.current = running;
  }, [running]);

  // Kör man med Ctrl+Enter längst ned i editorn kan bannern hamna utanför
  // rutan — skrolla in den, men bara när den faktiskt inte syns.
  useEffect(() => {
    if (!result || bannerHidden) return;
    const box = bannerRef.current?.getBoundingClientRect();
    if (!box) return;
    const visible = box.top >= 0 && box.bottom <= window.innerHeight;
    if (!visible) {
      bannerRef.current.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [result, bannerHidden]);

  const solvedCount = useMemo(
    () => exercises.filter((item) => sqlProgress[item.id]).length,
    [exercises, sqlProgress],
  );

  async function runExercise() {
    if (!exercise || running) return;
    setBannerHidden(false);
    setRunning(true);
    try {
      const outcome = await checkExercise({ exercise, userSql: code, engine });
      setResult(outcome);
      if (outcome.status === "correct" && sqlProgress[exercise.id] !== "solved-with-help") {
        onSolve(exercise.id, "solved");
      }
    } catch (error) {
      setResult({ status: "error", raw: error.message, message: null });
    } finally {
      setRunning(false);
    }
  }

  function revealSolution() {
    setCode(exercise.solution);
    onSolve(exercise.id, "solved-with-help");
    setConfirmSolution(false);
    setResult(null);
    editorRef.current?.focus();
  }

  async function runFree() {
    setFreeError(null);
    const sql = freeCode.trim();
    if (!sql) return;
    const rule = checkTsqlRules(sql);
    if (rule) {
      setFreeResult(null);
      setFreeError({ raw: rule.raw, message: rule.message });
      return;
    }
    const prepared = toSqlite(sql);
    try {
      if (!freeDb.current) freeDb.current = await newDatabase();
      const statements = splitStatements(sql);
      let shown = null;

      if (statements.length === 1 && /^\s*(select|with)\b/i.test(sql)) {
        shown = runSelect(freeDb.current, prepared);
      } else {
        const results = freeDb.current.exec(prepared);
        const last = results[results.length - 1];
        if (last) shown = { columns: last.columns, values: last.values };
      }

      setFreeResult({
        table: shown,
        changed: shown ? null : freeDb.current.getRowsModified(),
      });
    } catch (error) {
      setFreeResult(null);
      setFreeError({ raw: error.message, message: interpretError(error.message, sql) });
    }
  }

  async function resetFreeDatabase() {
    freeDb.current?.close?.();
    freeDb.current = await newDatabase();
    setFreeResult(null);
    setFreeError(null);
  }

  if (exercises.length === 0) {
    return (
      <p className="card p-5 text-[15px] text-ink/70">
        Den här delkursen har inga SQL-övningar inlagda.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <section>
        <h1 className="font-display text-2xl">SQL-verkstad</h1>
        <p className="mt-1 max-w-reading text-[15px] text-ink/70">
          En riktig databas i webbläsaren, i kursens dialekt: du skriver T-SQL som i SQL
          Server och Azure. Skriv frågan, kör den och få svaret rättat mot
          en referenslösning. Databasen byggs om före varje körning, så inget du gör kan
          förstöra den.
        </p>
        <p className="tabular mt-2 text-[15px] text-ink/65">
          {solvedCount} av {exercises.length} övningar lösta
        </p>
      </section>

      <div className="max-w-lg">
        <SegmentedControl
          label="Välj läge"
          segments={MODES}
          value={mode}
          onChange={setMode}
        />
      </div>

      {engineState === "loading" && (
        <p className="card p-4 text-[15px] text-ink/70">Startar databasen…</p>
      )}
      {engineState === "error" && (
        <p className="card border-wrong/30 p-4 text-[15px] text-ink/80">
          Databasen kunde inte startas. Ladda om sidan och försök igen.
        </p>
      )}

      {engineState === "ready" && mode === "ovningar" && (
        <div className="lg:flex lg:gap-8">
          <div className="lg:order-2 lg:min-w-0 lg:flex-1">
            {level && (
              <section className="card p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h2 className="font-display text-xl">
                    Nivå {level.number}
                    <span className="ml-2 font-sans text-[15px] font-normal text-ink/80">
                      {level.name}
                    </span>
                  </h2>
                  <button
                    type="button"
                    className="btn-quiet text-sm"
                    aria-expanded={lessonOpen}
                    onClick={() => setLessonOpen(!lessonOpen)}
                  >
                    {lessonOpen ? "Dölj" : "Vad du behöver veta"}
                  </button>
                </div>
                {lessonOpen && (
                  <div className="mt-3">
                    <LessonText>{level.lesson.trim()}</LessonText>
                  </div>
                )}
              </section>
            )}

            <section className="card mt-4 p-5">
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-brass">
                  Övning {levelIndex + 1}.
                  {exercises
                    .filter((item) => item.level === exercise.level)
                    .findIndex((item) => item.id === exercise.id) + 1}
                </p>
                {/* Statusen ska gå att tjäna tillbaka när man lärt sig. */}
                {sqlProgress[exercise.id] && (
                  <span className="flex items-center gap-2 text-sm">
                    <span
                      className={
                        sqlProgress[exercise.id] === "solved-with-help"
                          ? "text-brass"
                          : "text-correct"
                      }
                    >
                      ✓{" "}
                      {sqlProgress[exercise.id] === "solved-with-help"
                        ? "Löst med hjälp"
                        : "Löst"}
                    </span>
                    <button
                      type="button"
                      className="btn-quiet text-sm"
                      onClick={() => onReset(exercise.id)}
                    >
                      Nollställ
                    </button>
                  </span>
                )}
              </div>
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
                  onRun={runExercise}
                  disabled={running}
                />
              </div>

              {/* Kör ligger sist och längst till höger — fylld yta betyder
                  "valt" i resten av appen och ska inte användas här. */}
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
                {!confirmSolution ? (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setConfirmSolution(true)}
                  >
                    Visa lösning
                  </button>
                ) : (
                  <span className="flex flex-wrap items-center gap-2 text-[15px]">
                    Vill du se lösningen? Övningen markeras som löst med hjälp.
                    <button
                      type="button"
                      className="btn-emphasis"
                      onClick={revealSolution}
                    >
                      Visa
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setConfirmSolution(false)}
                    >
                      Avbryt
                    </button>
                  </span>
                )}

                <button
                  type="button"
                  className="btn-emphasis ml-auto"
                  onClick={runExercise}
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

            </section>
          </div>

          <div className="mt-6 lg:order-1 lg:mt-0 lg:w-80 lg:shrink-0">
            <ExerciseList
              levels={levels}
              exercises={exercises}
              progress={sqlProgress}
              currentId={exercise.id}
              onSelect={setCurrentId}
            />
          </div>
        </div>
      )}

      {engineState === "ready" && mode === "slump" && (
        <PracticeMode engine={engine} courseExercises={exercises} />
      )}

      {engineState === "ready" && mode === "fritt" && (
        <div className="space-y-4">
          <section className="card p-5">
            <h2 className="font-display text-xl">Fritt läge</h2>
            <p className="mt-1 text-[15px] text-ink/70">
              Kör vad du vill mot databasen. Ingen rättning. Ändringar ligger kvar tills
              du återställer.
            </p>

            <div className="mt-4">
              <SqlEditor
                value={freeCode}
                onChange={setFreeCode}
                onRun={runFree}
                rows={8}
                label="Fri fråga"
              />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setFreeCode("")}
              >
                Rensa
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={resetFreeDatabase}
              >
                Återställ databasen
              </button>
              <button type="button" className="btn-emphasis ml-auto" onClick={runFree}>
                Kör ▸
              </button>
            </div>

            {freeError && (
              <div className="mt-4 rounded-card border border-wrong/30 bg-wrong-bg p-4">
                <h3 className="font-display text-lg text-wrong">
                  Frågan kunde inte köras
                </h3>
                <pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-mono text-[13px] text-ink/80">
                  {freeError.raw}
                </pre>
                {freeError.message && (
                  <p className="mt-2 text-[15px] leading-relaxed">{freeError.message}</p>
                )}
              </div>
            )}

            {freeResult && (
              <div className="mt-4">
                {freeResult.table ? (
                  <ResultTable result={freeResult.table} caption="Resultat" />
                ) : (
                  <p className="rounded-card border border-line bg-white p-4 text-[15px]">
                    Satsen kördes.{" "}
                    {freeResult.changed > 0
                      ? `${freeResult.changed} ${freeResult.changed === 1 ? "rad" : "rader"} ändrades.`
                      : "Inga rader returnerades."}
                  </p>
                )}
              </div>
            )}
          </section>

          <section>
            <h2 className="font-display text-xl">Tabellerna</h2>
            <div className="mt-3">
              <SchemaPanel onPickTable={(sql) => setFreeCode(sql)} />
            </div>
          </section>

          <p className="text-sm leading-relaxed text-ink/65">
            Du skriver SQL Server-dialekten (T-SQL) precis som i kursen. Motorn under huven
            är SQLite i webbläsaren, och det du skriver översätts innan det körs — kursens
            SQL fungerar som i SQL Server, men enstaka exotiska funktioner kan saknas.
          </p>
        </div>
      )}
    </div>
  );
}
