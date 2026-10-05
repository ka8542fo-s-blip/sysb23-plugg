import { useEffect, useMemo, useRef, useState } from "react";
import { normalizeExercises, NORMALIZE_GROUPS, contextOf, itemLabel, groupLabel } from "../data/databaser/normalizeExercises.js";
import { parseSchema, norm, toBlockNotation } from "../lib/modelCheck.js";
import { facitVariants } from "../lib/normalize.js";
import { gradeAnswer } from "../lib/fdGrade.js";
import { highestNF, braceText, NF_NAME } from "../lib/fd.js";
import { load, save } from "../lib/storage.js";
import FdCanvas from "../components/fd/FdCanvas.jsx";
import FdAnswer from "../components/fd/FdAnswer.jsx";
import FdDefinitions from "../components/fd/FdDefinitions.jsx";
import SchemaView from "../components/model/SchemaView.jsx";

// Normaliseringssteget som rit- och analysyta: rita beroendediagrammet som
// Björn gör på tavlan, fyll i CK, PA/NP, högsta normalform och motivering,
// och — i uppgift 11–13 och de egna — nedbrytningen till 3NF. Varje fält
// rättas för sig med höljet som skäl; nedbrytningen rättas mot facit som
// förut. Ritning och svar sparas per uppgift i localStorage.

const emptyDraft = () => ({ cks: [[]], roles: {}, nf: null, motivation: {}, text: "" });

function FieldResult({ label, field, children }) {
  if (!field) return null;
  return (
    <li>
      <span className={field.ok ? "font-medium text-correct" : "font-medium text-wrong"}>{label}: {field.ok ? "rätt" : "fel"}</span>
      {children}
    </li>
  );
}

export default function Normalizing({ modelProgress, onSolve, onReset }) {
  const items = normalizeExercises;
  const [currentId, setCurrentId] = useState(() => items.find((e) => !modelProgress[e.id])?.id || items[0].id);
  const [drafts, setDrafts] = useState({});
  const [result, setResult] = useState(null);
  const [showFacit, setShowFacit] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const item = items.find((e) => e.id === currentId) || items[0];
  const draft = drafts[item.id] ?? load(`fdsvar:${item.id}`, null) ?? emptyDraft();
  const parsed = useMemo(() => parseSchema(draft.text || ""), [draft.text]);
  const solvedCount = items.filter((e) => modelProgress[e.id]).length;
  const facit = useMemo(() => {
    const a = highestNF(item.attrs, item.fds);
    const text = item.facit ? facitVariants(item)[0] : null;
    return { ...a, text, schema: text ? parseSchema(text) : null };
  }, [item]);

  useEffect(() => { setResult(null); setShowFacit(false); setConfirmReset(false); }, [currentId]);

  // Efter rättningen: direkt vidare till nästa uppgift i listan (runt om).
  const sectionRef = useRef(null);
  const nextItem = items[(items.findIndex((e) => e.id === item.id) + 1) % items.length];
  function goNext() {
    setCurrentId(nextItem.id);
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const setDraft = (patch) => setDrafts((prev) => {
    const next = { ...(prev[item.id] ?? draft), ...patch };
    save(`fdsvar:${item.id}`, next);
    return { ...prev, [item.id]: next };
  });
  const canGrade = Boolean(draft.nf);

  function grade() {
    const outcome = gradeAnswer(item, draft);
    setResult(outcome);
    if (outcome.status === "correct") onSolve(item.id, "solved");
  }

  const dec = result?.fields.decomposition;
  const decResult = dec?.result;
  const highlight = {};
  const facitHighlight = {};
  if (decResult && decResult.status !== "parse-error") {
    for (const r of decResult.relations || []) {
      if (r.answerName) highlight[norm(r.answerName)] = r.status === "ok" ? "ok" : "diff";
      facitHighlight[norm(r.name)] = r.status === "ok" ? "ok" : "diff";
    }
    for (const e of decResult.extra || []) highlight[norm(e.name)] = "diff";
  }
  const verdict = result?.status === "correct" ? "Rätt." : result?.status === "partial" ? "Delvis rätt." : result?.status === "wrong" ? "Fel." : null;
  const title = item.nfOnly ? "Högsta normalform" : "Högsta normalform och normalisering till 3NF";

  return (
    <div className="lg:flex lg:gap-8">
      <div className="lg:order-2 lg:min-w-0 lg:flex-1">
        <section ref={sectionRef} className="card scroll-mt-24 p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm text-ink/65">
              {itemLabel(item)} · {NORMALIZE_GROUPS.find((g) => g.exercise === item.exercise)?.source}
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
          <h2 className="mt-1 font-display text-xl">{title}</h2>
          <p className="mt-2 max-w-reading text-[15px] leading-relaxed text-ink/80">
            {item.nfOnly
              ? "Rita beroendediagrammet, ange kandidatnycklar, prime och non-prime, och högsta normalform med motivering."
              : "Rita beroendediagrammet, ange kandidatnycklar, prime och non-prime, och högsta normalform med motivering. Är R inte i 3NF: dela upp den så att varje relation är i 3NF, med primärnyckel för varje relation. Främmande nycklar behöver inte skrivas."}
          </p>

          <pre className="mt-4 overflow-x-auto rounded-lg border border-line bg-paper p-3 font-mono text-[14.5px] leading-relaxed text-ink">{contextOf(item)}</pre>

          <FdCanvas key={item.id} item={item} graded={Boolean(result)} />

          <FdAnswer key={"a" + item.id} item={item} draft={draft} setDraft={setDraft} highlight={highlight} parsed={parsed} result={result} />

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button type="button" className="btn-primary" onClick={grade} disabled={!canGrade}>Rätta</button>
            <button type="button" className="btn-secondary" onClick={() => setShowFacit((v) => !v)} aria-pressed={showFacit}>{showFacit ? "Dölj facit" : "Visa facit"}</button>
            {!canGrade && <span className="text-sm text-ink/65">Välj högsta normalform för att kunna rätta.</span>}
          </div>

          {result && (
            <div className={`mt-4 rounded-lg border-l-2 p-4 ${result.status === "correct" ? "border-correct bg-correct-bg" : "border-wrong bg-wrong-bg"}`} role="status">
              <p className="font-display text-lg">{verdict}</p>
              <ul className="mt-2 space-y-3 text-[15px]">
                <FieldResult label="Kandidatnycklar" field={result.fields.ck}>
                  <ul className="ml-4 mt-1 list-disc space-y-0.5 text-ink/85">
                    {result.fields.ck.given.length === 0 && <li>Ingen kandidatnyckel angiven.</li>}
                    {result.fields.ck.notes.map((n) => <li key={n.text} className={n.ok ? "" : "text-wrong"}>{n.text}</li>)}
                  </ul>
                </FieldResult>
                <FieldResult label="Prime och non-prime" field={result.fields.roles}>
                  {!result.fields.roles.ok && (
                    <ul className="ml-4 mt-1 list-disc space-y-0.5 text-ink/85">
                      {result.fields.roles.perAttr.filter((p) => !p.ok).map((p) => (
                        <li key={p.attr}>{p.attr}: {p.given ? `du har ${p.given}, ska vara ${p.expected}` : `inte valt, ska vara ${p.expected}`}. {p.why}</li>
                      ))}
                    </ul>
                  )}
                </FieldResult>
                <FieldResult label={`Högsta normalform${result.fields.nf.ok ? `, ${result.fields.nf.expected}` : ""}`} field={result.fields.nf}>
                  <p className="mt-1 text-ink/85">{!result.fields.nf.ok && result.fields.nf.given ? `Du har ${result.fields.nf.given}, rätt är ${result.fields.nf.expected}. ` : ""}{result.fields.nf.why}</p>
                </FieldResult>
                <FieldResult label="Motivering" field={result.fields.motivation}>
                  {result.fields.motivation && (
                    <div className="mt-1 text-ink/85">
                      {result.fields.motivation.why && <p>{result.fields.motivation.why}</p>}
                      <p className="mt-1">Godtas ({result.fields.motivation.needType === "partial" ? "partiella" : "transitiva"} beroenden): {result.fields.motivation.accepted.map((a) => a.text).join(", ")}.</p>
                    </div>
                  )}
                </FieldResult>
                {dec && (
                  <li>
                    <span className={dec.ok ? "font-medium text-correct" : "font-medium text-wrong"}>Nedbrytning: {dec.ok ? "rätt" : "fel"}</span>
                    {decResult.status === "parse-error" ? (
                      <ul className="ml-4 mt-1 list-disc">{decResult.errors.map((err) => <li key={err.line + err.message}>{err.message}</li>)}</ul>
                    ) : (
                      <ul className="ml-4 mt-1 space-y-2">
                        {(decResult.relations || []).map((r) => (
                          <li key={r.name}>
                            <span className={r.status === "ok" ? "text-correct" : "text-wrong"}>
                              {r.name}{r.answerName && norm(r.answerName) !== norm(r.name) ? ` (${r.answerName})` : ""}: {r.status === "ok" ? "rätt" : r.status === "missing" ? "saknas" : "fel"}
                            </span>
                            {r.problems.length > 0 && <ul className="ml-4 list-disc">{r.problems.map((p) => <li key={p}>{p}</li>)}</ul>}
                            {r.status !== "ok" && r.rule && <p className="mt-0.5 text-ink/80"><span className="font-medium">{r.rule.rule}:</span> {r.rule.why}</p>}
                          </li>
                        ))}
                        {(decResult.extra || []).map((e) => (
                          <li key={"extra-" + e.name}><span className="text-wrong">{e.name}: extra</span><p className="mt-0.5 text-ink/80">{e.message}</p></li>
                        ))}
                      </ul>
                    )}
                    {dec.properties && (
                      <div className="mt-3 rounded-lg border border-line bg-white/70 p-3 text-sm">
                        <p className="font-medium text-ink/85">Din nedbrytning, prövad med beroendena</p>
                        {dec.properties.missingAttrs.length > 0 && <p className="mt-1 text-wrong">Attribut som inte finns i någon relation: {dec.properties.missingAttrs.join(", ")}.</p>}
                        {dec.properties.unknown.length > 0 && <p className="mt-1 text-wrong">Finns inte i R: {dec.properties.unknown.join(", ")}.</p>}
                        <p className="mt-1">
                          <span className={dec.properties.relations.every((r) => r.nf === 3) ? "text-correct" : "text-wrong"}>Normalform per relation:</span>{" "}
                          {dec.properties.relations.map((r) => `${r.name} ${NF_NAME[r.nf]}`).join(", ")}.
                        </p>
                        <p className="mt-1"><span className={dec.properties.lossless ? "text-correct" : "text-wrong"}>Lossless join: {dec.properties.lossless ? "ja" : "nej"}.</span></p>
                        <ul className="ml-4 list-disc text-ink/80">{dec.properties.lossText.map((t) => <li key={t}>{t}</li>)}</ul>
                        <p className="mt-1"><span className={dec.properties.preserving ? "text-correct" : "text-wrong"}>Dependency preservation: {dec.properties.preserving ? "ja" : "nej"}.</span></p>
                        <ul className="ml-4 list-disc text-ink/80">{dec.properties.depText.map((t) => <li key={t.text} className={t.ok ? "" : "text-wrong"}>{t.text}</li>)}</ul>
                        <p className="mt-2 text-xs text-ink/65">Lossless och beroendebevarande räcker inte för rätt: en övernormaliserad nedbrytning klarar oftast båda och ger ändå avdrag. Rättningen ovan sker mot facit.</p>
                      </div>
                    )}
                  </li>
                )}
              </ul>
              {item.trap && <p className="mt-3 text-[15px] text-ink/85"><span className="font-medium">Fällan:</span> {item.trap}</p>}
              {item.keyNote && <p className="mt-2 text-sm text-ink/65">Anmärkning: {item.keyNote}</p>}
            </div>
          )}
          {result && (
            <div className="mt-3 flex justify-end">
              <button type="button" className="btn-emphasis px-4 py-2 text-sm" onClick={goNext}>
                Nästa: {nextItem.exercise === "egen" ? `Egen ${nextItem.number}` : `${nextItem.exercise}:${nextItem.number}`} →
              </button>
            </div>
          )}

          {showFacit && (
            <div className="mt-4 rounded-lg border border-line bg-paper p-4">
              <p className="font-display text-lg">Facit</p>
              <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono text-[14.5px]">
                <dt className="text-ink/65">CK</dt><dd>{facit.cks.map(braceText).join(", ")}</dd>
                <dt className="text-ink/65">PA</dt><dd>{facit.prime.join(", ") || "–"}</dd>
                <dt className="text-ink/65">NP</dt><dd>{facit.nonPrime.join(", ") || "–"}</dd>
                <dt className="text-ink/65">NF</dt><dd>{NF_NAME[facit.nf]}</dd>
              </dl>
              {facit.nf < 3 && (
                <div className="mt-3 text-[15px]">
                  <p className="text-sm font-medium text-ink/80">Motivering (någon av dessa godtas)</p>
                  <ul className="ml-4 mt-1 list-disc">
                    {facit.violations.filter((v) => v.type === (facit.nf === 1 ? "partial" : "transitive")).map((v) => (
                      <li key={v.via.join("") + v.attr}>
                        {v.type === "partial"
                          ? `Non-prime attribute ${v.attr} is functionally dependent on proper subset ${v.via.length === 1 ? v.via[0] : braceText(v.via)} of candidate key ${braceText(v.ck)}.`
                          : `Non-prime attribute ${v.attr} is transitively dependent on candidate key ${braceText(v.ck)} via ${v.via.length === 1 ? v.via[0] : braceText(v.via)}.`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {facit.schema && (
                <div className="mt-3">
                  <p className="mb-1 text-sm font-medium text-ink/80">Nedbrytning</p>
                  <div className="rounded-lg border border-line bg-white p-3"><SchemaView schema={facit.schema} highlight={facitHighlight} /></div>
                  <pre className="mt-2 overflow-x-auto rounded-lg border border-line bg-white px-4 py-3 font-mono text-[13.5px] leading-relaxed text-ink">{toBlockNotation(facit.schema)}</pre>
                </div>
              )}
              {facit.nf === 3 && !item.nfOnly && <p className="mt-3 text-[15px]">R är redan i 3NF — ingen nedbrytning.</p>}
              {item.trap && <p className="mt-3 text-[15px]"><span className="font-medium">Fällan:</span> {item.trap}</p>}
            </div>
          )}
        </section>
      </div>

      <div className="mt-6 space-y-4 lg:order-1 lg:mt-0 lg:w-80 lg:shrink-0">
        <nav aria-label="Uppgifter" className="card p-4">
          <h3 className="font-display text-[15px]">Uppgifter</h3>
          <p className="tabular mt-1 text-sm text-ink/65">{solvedCount} av {items.length} klara</p>
          {NORMALIZE_GROUPS.map((group) => (
            <div key={group.exercise} className="mt-3">
              <p className="text-sm font-medium text-ink/80">{groupLabel(group)}</p>
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
                        aria-label={`${itemLabel(e)}${solved ? ", klar" : ""}`}
                        className={`tabular flex h-9 w-9 items-center justify-center rounded-lg border text-sm transition-colors duration-150 ${active ? "border-pine bg-pine text-white" : solved ? "border-correct/40 bg-correct-bg text-correct hover:border-pine" : "border-line hover:border-pine hover:bg-pine/[0.06]"}`}
                      >
                        {e.exercise === "egen" ? `E${e.number}` : e.number}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <FdDefinitions />
      </div>
    </div>
  );
}
