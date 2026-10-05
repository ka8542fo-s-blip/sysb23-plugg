import { useEffect, useMemo, useState } from "react";
import { ddlExercises } from "../data/databaser/ddlExercises.js";
import { checkDdl, toDdl, fold } from "../lib/ddlCheck.js";
import SchemaEditor from "../components/model/SchemaEditor.jsx";
import { ExerciseFigure } from "../components/model/modelFigures.jsx";

const TEMPLATE = `CREATE TABLE A (
  AID  INTEGER IDENTITY(1,1),
  A1   INTEGER NOT NULL,
  BID  INTEGER NOT NULL,
  PRIMARY KEY (AID),
  UNIQUE (A1),
  FOREIGN KEY (BID) REFERENCES B(BID)
);`;

// Tentans uppgift 2: ett Chen-diagram blir CREATE TABLE-kod direkt.
// Rättas som struktur (lib/ddlCheck.js), facit visas efter rättningen i
// tentans form. Framsteg som i övriga Modellera-flikar.
export default function DdlModeling({ modelProgress, onSolve, onReset }) {
  const exercises = ddlExercises;
  const [currentId, setCurrentId] = useState(() => exercises.find((e) => !modelProgress[e.id])?.id || exercises[0].id);
  const [drafts, setDrafts] = useState({});
  const [result, setResult] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const exercise = exercises.find((e) => e.id === currentId) || exercises[0];
  const code = drafts[exercise.id] ?? "";
  const facitDdl = useMemo(() => toDdl(exercise.facit), [exercise]);

  useEffect(() => { setResult(null); setConfirmReset(false); }, [currentId]);

  function grade() {
    const outcome = checkDdl(code, exercise);
    setResult(outcome);
    if (outcome.status === "correct") onSolve(exercise.id, "solved");
  }

  const verdict = result?.status === "correct" ? "Rätt." : result?.status === "partial" ? "Delvis rätt." : result?.status === "wrong" ? "Fel." : null;
  const index = exercises.findIndex((e) => e.id === exercise.id);
  const nextExercise = exercises[index + 1];

  return (
    <div className="lg:flex lg:gap-8">
      <div className="lg:order-2 lg:min-w-0 lg:flex-1">
        <section className="card p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm text-ink/65">
              Uppgift {exercise.number} · {exercise.source}
              {modelProgress[exercise.id] && <span className="ml-2 text-correct">✓ Klar</span>}
            </p>
            {modelProgress[exercise.id] && !confirmReset && (
              <button type="button" className="btn-quiet text-sm" onClick={() => setConfirmReset(true)}>Nollställ uppgiften</button>
            )}
            {confirmReset && (
              <span className="flex gap-2 text-sm">
                <button type="button" className="btn-secondary" onClick={() => { onReset(exercise.id); setConfirmReset(false); }}>Ja, nollställ</button>
                <button type="button" className="btn-quiet" onClick={() => setConfirmReset(false)}>Avbryt</button>
              </span>
            )}
          </div>
          <h2 className="mt-1 font-display text-xl">{exercise.title}</h2>
          <p className="mt-2 max-w-reading text-[15px] leading-relaxed text-ink/80">{exercise.intro}</p>

          <ExerciseFigure id={exercise.diagram} />

          <div className="rounded-lg border-l-2 border-brass bg-brass/[0.07] p-4 text-[15px] leading-relaxed">
            <p className="font-medium">Skriv SQL-kod (DDL) för hela modellen, med alla constraints, för SQL Server.</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-5 text-ink/80">
              <li>Alla kolumner får antas vara INTEGER.</li>
              <li>Tabeller för vanliga och svaga entiteter ska ha automatiskt inkrementerande surrogatnycklar: INTEGER IDENTITY(1,1).</li>
              <li>Reserverade ord skrivs ut: PRIMARY KEY, FOREIGN KEY, REFERENCES, NOT NULL, UNIQUE.</li>
              <li>Constraints behöver inte namnges.</li>
              <li>Koden ska vara tydligt formaterad och indenterad.</li>
            </ul>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            <div>
              <SchemaEditor
                id="ddl-input"
                label="Din DDL"
                value={code}
                onChange={(text) => setDrafts((prev) => ({ ...prev, [exercise.id]: text }))}
                placeholder={TEMPLATE}
                rows={22}
                subscripts={false}
              />
              <p className="mt-1 text-xs text-ink/65">
                Rättas som struktur: tabellernas och kolumnernas ordning spelar ingen roll, inte heller vad
                surrogat- och FK-kolumnerna heter, INT eller INTEGER, eller om en constraint står på kolumnen
                eller sist i tabellen.
              </p>
            </div>
            {result && (
              <div>
                <p className="mb-1 text-sm font-medium text-ink/80">Facit</p>
                <pre className="overflow-x-auto rounded-lg border border-line bg-paper px-4 py-3 font-mono text-[13px] leading-relaxed text-ink">{facitDdl}</pre>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button type="button" className="btn-primary" onClick={grade} disabled={!code.trim()}>Rätta</button>
            <span className="text-sm text-ink/65">Facit visas efter rättningen, bredvid din kod.</span>
          </div>

          {result && (
            <div className={`mt-4 rounded-lg border-l-2 p-4 ${result.status === "correct" ? "border-correct bg-correct-bg" : result.status === "parse-error" ? "border-brass bg-paper" : "border-wrong bg-wrong-bg"}`} role="status">
              {result.status === "parse-error" ? (
                <>
                  <p className="font-display text-lg">Koden går inte att köra.</p>
                  <ul className="mt-1 space-y-1 text-[15px]">{result.errors.map((err) => <li key={err.line + err.message}>{err.message}</li>)}</ul>
                  <p className="mt-2 text-sm text-ink/70">Rätta felet och rätta igen. Facit står bredvid din kod.</p>
                </>
              ) : (
                <>
                  <p className="font-display text-lg">{verdict}</p>
                  <ul className="mt-2 space-y-3 text-[15px]">
                    {result.tables.map((t) => (
                      <li key={t.name}>
                        <span className={t.status === "ok" ? "font-medium text-correct" : "font-medium text-wrong"}>
                          {t.name}{t.answerName && fold(t.answerName) !== fold(t.name) ? ` (${t.answerName})` : ""}: {t.status === "ok" ? "rätt" : t.status === "missing" ? "saknas" : "fel"}
                        </span>
                        {t.status !== "ok" && (
                          <ul className="ml-4 mt-1 space-y-1">
                            {t.problems.map((p) => (
                              <li key={p.text} className="flex gap-2">
                                {p.tag && <span className="mt-0.5 h-fit shrink-0 rounded border border-wrong/40 px-1.5 text-[11px] font-medium uppercase tracking-wide text-wrong">{p.tag}</span>}
                                <span>{p.text}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {t.status !== "ok" && t.rule && (
                          <p className="mt-1 text-ink/80"><span className="font-medium">Varför — {t.rule.rule}:</span> {t.rule.why}</p>
                        )}
                      </li>
                    ))}
                    {result.extra.map((x) => (
                      <li key={"extra-" + x.name}>
                        <span className="font-medium text-wrong">{x.name}: överflödig tabell</span>
                        <p className="mt-1 flex gap-2 text-ink/80">
                          {x.tag && <span className="mt-0.5 h-fit shrink-0 rounded border border-wrong/40 px-1.5 text-[11px] font-medium uppercase tracking-wide text-wrong">{x.tag}</span>}
                          <span>{x.why}</span>
                        </p>
                      </li>
                    ))}
                  </ul>
                  {result.remarks.length > 0 && (
                    <ul className="mt-3 space-y-1 text-sm text-ink/65">{result.remarks.map((n) => <li key={n}>Anmärkning: {n}</li>)}</ul>
                  )}
                </>
              )}
              {nextExercise && result.status === "correct" && (
                <button type="button" className="btn-secondary mt-3" onClick={() => setCurrentId(nextExercise.id)}>Nästa uppgift</button>
              )}
            </div>
          )}
        </section>
      </div>

      <div className="mt-6 lg:order-1 lg:mt-0 lg:w-80 lg:shrink-0">
        <nav aria-label="Uppgifter" className="card p-4">
          <h3 className="font-display text-[15px]">Uppgifter</h3>
          <ul className="mt-2 space-y-1">
            {exercises.map((e) => {
              const active = e.id === currentId;
              return (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => setCurrentId(e.id)}
                    aria-current={active ? "true" : undefined}
                    className={`flex w-full items-baseline gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors duration-150 ${active ? "border-pine bg-pine/[0.08] text-pine" : "border-transparent hover:border-pine hover:bg-pine/[0.06]"}`}
                  >
                    <span className="tabular w-6 shrink-0 text-ink/65">{e.number}</span>
                    <span className="min-w-0 flex-1 truncate">{e.title}</span>
                    {modelProgress[e.id] && <span className="shrink-0 text-correct" title="Klar">✓<span className="sr-only"> Klar</span></span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
