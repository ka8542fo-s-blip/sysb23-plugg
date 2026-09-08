import { useEffect, useMemo, useState } from "react";
import { modelExercises } from "../data/databaser/modelExercises.js";
import { parseSchema, checkModel, norm } from "../lib/modelCheck.js";
import SchemaView from "../components/model/SchemaView.jsx";
import { ModelFigure } from "../components/model/modelFigures.jsx";
import Normalizing from "./Normalizing.jsx";
import { normalizeExercises } from "../data/databaser/normalizeExercises.js";

const TEMPLATE = `NAMN(Attribut1, Attribut2)
PK = {Attribut1}
FK1: (Attribut2) REF ANNAN(Attribut)`;

// Modellverkstaden: ett ER-diagram, du skriver relationsschemat i Fö5:s
// notation, appen rättar som mängder och visar facit i samma
// understrykningsvy som svaret. Framsteg per uppgift i localStorage; klar
// när rättningen är rätt, nollställs bara via knapp.
export default function Modeling({ modelProgress, onSolve, onReset }) {
  const exercises = modelExercises;
  const [currentId, setCurrentId] = useState(
    () => exercises.find((e) => !modelProgress[e.id])?.id || exercises[0].id,
  );
  const [drafts, setDrafts] = useState({});
  const [result, setResult] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  // Två steg: ER-diagram → schema (häftets 4–10) och normalisering (11–13).
  const [mode, setMode] = useState("er");

  const exercise = exercises.find((e) => e.id === currentId) || exercises[0];
  const code = drafts[exercise.id] ?? "";
  const parsed = useMemo(() => parseSchema(code), [code]);
  const facitParsed = useMemo(() => parseSchema(exercise.facit[result?.variant ?? 0]), [exercise, result]);
  const solvedCount = exercises.filter((e) => modelProgress[e.id]).length;
  const normSolved = normalizeExercises.filter((e) => modelProgress[e.id]).length;

  useEffect(() => { setResult(null); setConfirmReset(false); }, [currentId]);

  function grade() {
    const outcome = checkModel(code, exercise.facit, exercise.rules);
    setResult(outcome);
    if (outcome.status === "correct") onSolve(exercise.id, "solved");
  }

  const highlight = {};
  if (result && result.status !== "parse-error") {
    for (const r of result.relations) if (r.answerName) highlight[norm(r.answerName)] = r.status === "ok" ? "ok" : "diff";
    for (const name of result.extra) highlight[norm(name)] = "diff";
  }
  const facitHighlight = {};
  if (result && result.status !== "parse-error") {
    for (const r of result.relations) facitHighlight[norm(r.name)] = r.status === "ok" ? "ok" : "diff";
  }

  const verdict = result?.status === "correct" ? "Rätt." : result?.status === "partial" ? "Delvis rätt." : result?.status === "wrong" ? "Fel." : null;

  return (
    <div className="space-y-6">
      <section>
        <h1 className="font-display text-2xl">Modellera</h1>
        {mode === "er" ? (
          <p className="mt-1 max-w-reading text-[15px] text-ink/70">
            Ett ER-diagram visas, du skriver relationsschemat i föreläsningens notation och får det
            rättat som mängder: attributens ordning, skiftläge och namnet på en relation eller ett
            FK-attribut spelar ingen roll, bara vad som identifierar och vad som refererar vad.
            Bredvid textrutan ritas ditt schema i häftets form, med understrykningarna som på tentan.
          </p>
        ) : (
          <p className="mt-1 max-w-reading text-[15px] text-ink/70">
            En relation R med sina funktionella beroenden, som i tentans uppgift 3f och 3g. Ange
            högsta normalform och, om R inte redan är i 3NF, uppdelningen med primärnyckel för varje
            relation. Rättas som mängder mot facit; att dela upp mer än 3NF kräver är övernormalisering.
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label="Steg">
          {[["er", `ER-diagram till schema · ${solvedCount} av ${exercises.length}`], ["norm", `Normalisering till 3NF · ${normSolved} av ${normalizeExercises.length}`]].map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={mode === key}
              onClick={() => setMode(key)}
              className={`tabular rounded-lg border px-3 py-1.5 text-sm transition-colors duration-150 ${mode === key ? "border-pine bg-pine text-white" : "border-line hover:border-pine hover:bg-pine/[0.06]"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {mode === "norm" && <Normalizing modelProgress={modelProgress} onSolve={onSolve} onReset={onReset} />}

      {mode === "er" && <div className="lg:flex lg:gap-8">
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

            <ModelFigure id={exercise.diagram} />

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="model-input" className="mb-1 block text-sm font-medium text-ink/80">
                  Ditt schema, i föreläsningens notation
                </label>
                <textarea
                  id="model-input"
                  value={code}
                  onChange={(e) => setDrafts((prev) => ({ ...prev, [exercise.id]: e.target.value }))}
                  placeholder={TEMPLATE}
                  spellCheck={false}
                  rows={14}
                  className="w-full rounded-lg border border-line bg-white p-3 font-mono text-[14px] leading-relaxed text-ink focus:border-pine focus:outline-none focus:ring-1 focus:ring-pine"
                />
                <p className="mt-1 text-xs text-ink/65">
                  Relationsrad, en rad PK = {"{…}"}, noll eller flera FK1: (…) REF MÅL(…). Tom rad mellan relationer. CK-rader får finnas.
                </p>
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-ink/80">Så ser det ut på tentan</p>
                <div className="rounded-lg border border-line bg-paper p-3">
                  <SchemaView schema={parsed} highlight={highlight} />
                  {parsed.errors.length > 0 && code.trim() && (
                    <ul className="mt-2 space-y-1 text-sm text-wrong">
                      {parsed.errors.slice(0, 3).map((err) => <li key={err.line + err.message}>{err.message}</li>)}
                    </ul>
                  )}
                </div>
                {result && result.status !== "parse-error" && (
                  <div className="mt-3">
                    <p className="mb-1 text-sm font-medium text-ink/80">Facit{result.variant > 0 ? ` (alternativ ${result.variant + 1})` : ""}</p>
                    <div className="rounded-lg border border-line bg-paper p-3">
                      <SchemaView schema={facitParsed} highlight={facitHighlight} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button type="button" className="btn-primary" onClick={grade} disabled={!code.trim()}>Rätta</button>
              <span className="text-sm text-ink/65">Facit visas efter rättningen, bredvid ditt schema.</span>
            </div>

            {result && (
              <div className={`mt-4 rounded-lg border-l-2 p-4 ${result.status === "correct" ? "border-correct bg-correct-bg" : result.status === "parse-error" ? "border-brass bg-paper" : "border-wrong bg-wrong-bg"}`} role="status">
                {result.status === "parse-error" ? (
                  <>
                    <p className="font-display text-lg">Kunde inte tolka svaret.</p>
                    <ul className="mt-1 space-y-1 text-[15px]">{result.errors.map((err) => <li key={err.line + err.message}>{err.message}</li>)}</ul>
                  </>
                ) : (
                  <>
                    <p className="font-display text-lg">{verdict}</p>
                    <ul className="mt-2 space-y-2 text-[15px]">
                      {result.relations.map((r) => (
                        <li key={r.name}>
                          <span className={r.status === "ok" ? "font-medium text-correct" : "font-medium text-wrong"}>
                            {r.name}{r.answerName && norm(r.answerName) !== norm(r.name) ? ` (${r.answerName})` : ""}: {r.status === "ok" ? "rätt" : r.status === "missing" ? "saknas" : "fel"}
                          </span>
                          {r.problems.length > 0 && <ul className="ml-4 list-disc">{r.problems.map((p) => <li key={p}>{p}</li>)}</ul>}
                          {r.status !== "ok" && r.rule && (
                            <p className="mt-1 text-ink/80"><span className="font-medium">{r.rule.rule}:</span> {r.rule.why}</p>
                          )}
                        </li>
                      ))}
                      {result.extra.map((name) => (
                        <li key={"extra-" + name}><span className="font-medium text-wrong">{name}: extra</span> — finns inte i facit.</li>
                      ))}
                    </ul>
                    {result.remarks.length > 0 && (
                      <ul className="mt-2 space-y-1 text-sm text-ink/65">{result.remarks.map((n) => <li key={n}>Anmärkning: {n}</li>)}</ul>
                    )}
                  </>
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
      </div>}
    </div>
  );
}
