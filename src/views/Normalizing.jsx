import { useEffect, useMemo, useState } from "react";
import { normalizeExercises, NORMALIZE_GROUPS, contextOf } from "../data/databaser/normalizeExercises.js";
import { parseSchema, norm } from "../lib/modelCheck.js";
import { checkNormalization, NF_LABELS } from "../lib/normalize.js";
import SchemaView from "../components/model/SchemaView.jsx";

const TEMPLATE = `R1(A, B)
PK = {A}

R2(B, C)
PK = {B}`;

// Normaliseringssteget: en relation R med beroenden, som tentans 3f och 3g.
// Svaret är högsta normalform som uttryckligt val — "R är redan i 3NF" är
// ett av dem — och, om R inte är i 3NF, uppdelningen med primärnycklar.
// Rättas med samma motor som ER-uppgifterna; facit visas bredvid svaret.
export default function Normalizing({ modelProgress, onSolve, onReset }) {
  const items = normalizeExercises;
  const [currentId, setCurrentId] = useState(() => items.find((e) => !modelProgress[e.id])?.id || items[0].id);
  const [drafts, setDrafts] = useState({});
  const [result, setResult] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const item = items.find((e) => e.id === currentId) || items[0];
  const draft = drafts[item.id] ?? { nf: null, text: "" };
  const parsed = useMemo(() => parseSchema(draft.text), [draft.text]);
  const solvedCount = items.filter((e) => modelProgress[e.id]).length;
  const decomposes = draft.nf && draft.nf !== "3NF";
  const canGrade = draft.nf && (draft.nf === "3NF" || draft.text.trim());

  useEffect(() => { setResult(null); setConfirmReset(false); }, [currentId]);

  const setDraft = (patch) => setDrafts((prev) => ({ ...prev, [item.id]: { ...draft, ...patch } }));

  function grade() {
    const outcome = checkNormalization(item, draft);
    setResult(outcome);
    if (outcome.status === "correct") onSolve(item.id, "solved");
  }

  const highlight = {};
  const facitHighlight = {};
  if (result && result.status !== "parse-error") {
    for (const r of result.relations) {
      if (r.answerName) highlight[norm(r.answerName)] = r.status === "ok" ? "ok" : "diff";
      facitHighlight[norm(r.name)] = r.status === "ok" ? "ok" : "diff";
    }
    for (const e of result.extra) highlight[norm(e.name)] = "diff";
  }
  const verdict = result?.status === "correct" ? "Rätt." : result?.status === "partial" ? "Delvis rätt." : result?.status === "wrong" ? "Fel." : null;

  return (
    <div className="lg:flex lg:gap-8">
      <div className="lg:order-2 lg:min-w-0 lg:flex-1">
        <section className="card p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm text-ink/65">
              Uppgift {item.exercise}, relation {item.number} · {NORMALIZE_GROUPS.find((g) => g.exercise === item.exercise)?.source}
              {modelProgress[item.id] && <span className="ml-2 text-correct">✓ Klar</span>}
            </p>
            {modelProgress[item.id] && !confirmReset && (
              <button type="button" className="btn-quiet text-sm" onClick={() => setConfirmReset(true)}>Nollställ uppgiften</button>
            )}
            {confirmReset && (
              <span className="flex gap-2 text-sm">
                <button type="button" className="btn-secondary" onClick={() => { onReset(item.id); setConfirmReset(false); }}>Ja, nollställ</button>
                <button type="button" className="btn-quiet" onClick={() => setConfirmReset(false)}>Avbryt</button>
              </span>
            )}
          </div>
          <h2 className="mt-1 font-display text-xl">Högsta normalform och normalisering till 3NF</h2>
          <p className="mt-2 max-w-reading text-[15px] leading-relaxed text-ink/80">
            Ange högsta normalform för R. Är R inte i 3NF: dela upp den så att varje relation är i 3NF
            och ange primärnyckel för varje relation. Främmande nycklar behöver inte skrivas.
          </p>

          <pre className="mt-4 overflow-x-auto rounded-lg border border-line bg-paper p-3 font-mono text-[14.5px] leading-relaxed text-ink">{contextOf(item)}</pre>

          <fieldset className="mt-4">
            <legend className="mb-1 text-sm font-medium text-ink/80">Högsta normalform</legend>
            <div className="flex flex-wrap gap-2">
              {["1NF", "2NF", "3NF"].map((nf) => {
                const active = draft.nf === nf;
                return (
                  <label key={nf} className={`cursor-pointer rounded-lg border px-3 py-1.5 text-sm transition-colors duration-150 ${active ? "border-pine bg-pine text-white" : "border-line hover:border-pine hover:bg-pine/[0.06]"}`}>
                    <input type="radio" name={`nf-${item.id}`} value={nf} checked={active} onChange={() => setDraft({ nf })} className="sr-only" />
                    {NF_LABELS[nf]}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="normalize-input" className="mb-1 block text-sm font-medium text-ink/80">
                Uppdelningen, i föreläsningens notation
              </label>
              {decomposes ? (
                <>
                  <textarea
                    id="normalize-input"
                    value={draft.text}
                    onChange={(e) => setDraft({ text: e.target.value })}
                    placeholder={TEMPLATE}
                    spellCheck={false}
                    rows={12}
                    className="w-full rounded-lg border border-line bg-white p-3 font-mono text-[14px] leading-relaxed text-ink focus:border-pine focus:outline-none focus:ring-1 focus:ring-pine"
                  />
                  <p className="mt-1 text-xs text-ink/65">Relationsrad och en rad PK = {"{…}"} per relation, tom rad emellan. Namnen R1, R2 … spelar ingen roll.</p>
                </>
              ) : (
                <p className="rounded-lg border border-dashed border-line p-3 text-sm text-ink/65">
                  {draft.nf === "3NF" ? "R är redan i 3NF — ingen uppdelning." : "Välj högsta normalform först. Är R i 1NF eller 2NF skriver du uppdelningen här."}
                </p>
              )}
            </div>
            <div>
              <p className="mb-1 text-sm font-medium text-ink/80">Så ser det ut på tentan</p>
              <div className="rounded-lg border border-line bg-paper p-3">
                {draft.nf === "3NF"
                  ? <p className="font-mono text-[14.5px] text-ink">R är redan i 3NF.</p>
                  : <SchemaView schema={parsed} highlight={highlight} />}
                {decomposes && parsed.errors.length > 0 && draft.text.trim() && (
                  <ul className="mt-2 space-y-1 text-sm text-wrong">
                    {parsed.errors.slice(0, 3).map((err) => <li key={err.line + err.message}>{err.message}</li>)}
                  </ul>
                )}
              </div>
              {result && result.status !== "parse-error" && (
                <div className="mt-3">
                  <p className="mb-1 text-sm font-medium text-ink/80">Facit{result.variant > 0 ? ` (alternativ ${result.variant + 1})` : ""}</p>
                  <div className="rounded-lg border border-line bg-paper p-3">
                    <p className="mb-1 font-mono text-[14.5px] text-ink">{NF_LABELS[result.nf.expected]}</p>
                    {result.facit && <SchemaView schema={result.facit} highlight={facitHighlight} />}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button type="button" className="btn-primary" onClick={grade} disabled={!canGrade}>Rätta</button>
            <span className="text-sm text-ink/65">Facit visas efter rättningen, bredvid ditt svar.</span>
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
                    <li>
                      <span className={result.nf.ok ? "font-medium text-correct" : "font-medium text-wrong"}>
                        Normalform: {result.nf.ok ? `${result.nf.expected}, rätt` : "fel"}
                      </span>
                      {result.nf.message && <p className="mt-1 text-ink/80">{result.nf.message}</p>}
                    </li>
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
                    {result.extra.map((e) => (
                      <li key={"extra-" + e.name}>
                        <span className="font-medium text-wrong">{e.name}: extra</span>
                        <p className="mt-1 text-ink/80">{e.message}</p>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </section>
      </div>

      <div className="mt-6 lg:order-1 lg:mt-0 lg:w-80 lg:shrink-0">
        <nav aria-label="Uppgifter" className="card p-4">
          <h3 className="font-display text-[15px]">Uppgifter</h3>
          <p className="tabular mt-1 text-sm text-ink/65">{solvedCount} av {items.length} klara</p>
          {NORMALIZE_GROUPS.map((group) => (
            <div key={group.exercise} className="mt-3">
              <p className="text-sm font-medium text-ink/80">Uppgift {group.exercise}</p>
              <ul className="mt-1 flex flex-wrap gap-1.5">
                {items.filter((e) => e.exercise === group.exercise).map((e) => {
                  const active = e.id === currentId;
                  const solved = Boolean(modelProgress[e.id]);
                  return (
                    <li key={e.id}>
                      <button
                        type="button"
                        onClick={() => setCurrentId(e.id)}
                        aria-current={active ? "true" : undefined}
                        aria-label={`Uppgift ${e.exercise}, relation ${e.number}${solved ? ", klar" : ""}`}
                        className={`tabular flex h-9 w-9 items-center justify-center rounded-lg border text-sm transition-colors duration-150 ${active ? "border-pine bg-pine text-white" : solved ? "border-correct/40 bg-correct-bg text-correct hover:border-pine" : "border-line hover:border-pine hover:bg-pine/[0.06]"}`}
                      >
                        {e.number}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
