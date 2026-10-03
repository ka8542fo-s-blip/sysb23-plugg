import { useEffect, useMemo, useRef, useState } from "react";
import { normalizeExercises, NORMALIZE_GROUPS, contextOf, itemLabel, groupLabel } from "../data/databaser/normalizeExercises.js";
import { parseSchema, norm, toBlockNotation } from "../lib/modelCheck.js";
import { facitVariants } from "../lib/normalize.js";
import { gradeAnswer, motivationOptions } from "../lib/fdGrade.js";
import { attrsOf, has } from "../lib/fd.js";
import { compareDrawing } from "../lib/fdDiagram.js";
import { migrateDraft, stepsFor, nextStep, prefillRoles, suggestType, optionForPair, stepSummary, nextItemId, STEP_DEFINITION, STEP_LABELS } from "../lib/fdSteps.js";
import { load, save } from "../lib/storage.js";
import FdCanvas from "../components/fd/FdCanvas.jsx";
import FdDefinitions from "../components/fd/FdDefinitions.jsx";
import {
  Step, StepFooter, DrawBody, DrawFacit, CkBody, CkResult, CkFacit, RolesBody, RolesResult, RolesFacit, NfBody, NfResult, NfFacit,
  MotivationBody, MotivationResult, MotivationFacit, DecompositionBody, DecompositionResult, DecompositionFacit,
} from "../components/fd/FdSteps.jsx";

// Normaliseringen som guidat flöde: ritytan överst, sedan ett steg öppet åt
// gången — rita (frivilligt), kandidatnycklar, prime/non-prime, högsta
// normalform, motivering och nedbrytning — med tidigare steg komprimerade.
// Varje steg kan kontrolleras för sig; sist en sammanfattning. Ritning och
// svar sparas per uppgift i localStorage (fdritning:<id>, fdsvar:<id>).

export default function Normalizing({ modelProgress, onSolve, onReset }) {
  const items = normalizeExercises;
  const [currentId, setCurrentId] = useState(() => items.find((e) => !modelProgress[e.id])?.id || items[0].id);
  const [drafts, setDrafts] = useState({});
  const [facitOpen, setFacitOpen] = useState({});
  const [showCheck, setShowCheck] = useState(false);
  const [diagram, setDiagram] = useState(null);
  const [pickNote, setPickNote] = useState(null);
  const [defFocus, setDefFocus] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const item = items.find((e) => e.id === currentId) || items[0];
  const draft = drafts[item.id] ?? migrateDraft(load(`fdsvar:${item.id}`, null), item);
  const attrs = attrsOf(item.attrs);
  const steps = stepsFor(item, draft);
  const current = draft.step === "summary" || steps.includes(draft.step) ? draft.step : steps.find((s) => !draft.done?.[s]) || "summary";
  const grading = useMemo(() => gradeAnswer(item, draft), [item, draft]);
  const parsed = useMemo(() => parseSchema(draft.text || ""), [draft.text]);
  const solvedCount = items.filter((e) => modelProgress[e.id]).length;
  const userCks = (draft.cks || []).map((k) => attrs.filter((a) => has(k, a))).filter((k) => k.length);
  const facit = useMemo(() => {
    const text = item.facit ? facitVariants(item)[0] : null;
    const schema = text ? parseSchema(text) : null;
    return { schema, text: schema ? toBlockNotation(schema) : null };
  }, [item]);

  useEffect(() => { setFacitOpen({}); setShowCheck(false); setPickNote(null); setConfirmReset(false); }, [currentId]);

  const setDraft = (patch) => setDrafts((prev) => {
    const next = { ...(prev[item.id] ?? draft), ...patch };
    save(`fdsvar:${item.id}`, next);
    return { ...prev, [item.id]: next };
  });

  // Rätt/fel per steg, räknat på svaret som det ser ut nu.
  const okFor = (step) => {
    if (step === "draw") return diagram ? compareDrawing(diagram, item.attrs, item.fds).ok : false;
    return Boolean(grading.fields[step]?.ok);
  };
  const checked = draft.checked || {};
  const solved = current === "summary" && grading.status === "correct";
  useEffect(() => { if (solved && !modelProgress[item.id]) onSolve(item.id, "solved"); }, [solved, item.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // I motiveringen väljer man pilen i diagrammet: syns ytan inte, scrolla
  // mjukt upp så att den gör det.
  const surfaceRef = useRef(null);
  useEffect(() => {
    if (current !== "motivation" || !diagram?.arrows.length || !surfaceRef.current) return;
    const r = surfaceRef.current.getBoundingClientRect();
    if (r.top < 60 || r.top > window.innerHeight * 0.5) window.scrollTo({ top: window.scrollY + r.top - 90, behavior: "smooth" });
  }, [current]); // eslint-disable-line react-hooks/exhaustive-deps

  function goNext(step) {
    const done = { ...draft.done, [step]: true };
    const patch = { done, step: nextStep(item, { ...draft, done }, step) };
    if (step === "ck" && !draft.rolesEdited) patch.roles = prefillRoles(item.attrs, userCks);
    if (step === "draw") setShowCheck(false);
    setDraft(patch);
    setPickNote(null);
  }
  const edit = (step) => { setDraft({ step }); setPickNote(null); };
  const check = (step) => {
    if (step === "draw") setShowCheck(true);
    setDraft({ checked: { ...checked, [step]: true } });
  };
  const toggleFacit = (key) => setFacitOpen((f) => ({ ...f, [key]: !f[key] }));
  const help = (step) => setDefFocus({ term: STEP_DEFINITION[step], n: Date.now() });

  // Motiveringen: välj beroende via pil eller lista; typen föreslås ur dina CK.
  function chooseMotivation(optionValue, attr, arrowId = null) {
    const option = motivationOptions(item).find((o) => o.value === optionValue);
    const rhs = option ? option.fd.rhs.filter((a) => !has(option.fd.lhs, a)) : [];
    const a = attr || (rhs.length === 1 ? rhs[0] : null);
    const m = draft.motivation || {};
    const type = option && a ? (m.typeEdited && m.option === optionValue ? m.type : suggestType(option.fd.lhs, userCks, item.attrs, item.fds) || m.type || null) : null;
    setDraft({ motivation: { ...m, option: optionValue, attr: a, type, typeEdited: m.option === optionValue ? m.typeEdited : false, arrowId } });
    setPickNote(null);
  }
  function onPick(pair, arrowId) {
    if (current !== "motivation") return;
    const option = optionForPair(item, pair);
    if (!option) { setPickNote(`Pilen ${pair.lhs.length > 1 ? `{${pair.lhs.join(", ")}}` : pair.lhs[0]} → ${pair.attr} står inte bland beroendena i uppgiften.`); return; }
    chooseMotivation(option.value, pair.attr, arrowId);
  }

  const decField = grading.fields.decomposition;
  const highlight = {};
  if (checked.decomposition && decField?.result && decField.result.status !== "parse-error") {
    for (const r of decField.result.relations || []) if (r.answerName) highlight[norm(r.answerName)] = r.status === "ok" ? "ok" : "diff";
    for (const e of decField.result.extra || []) highlight[norm(e.name)] = "diff";
  }

  const body = {
    draw: () => (
      <>
        <DrawBody />
        <StepFooter onCheck={() => check("draw")} onFacit={() => toggleFacit("draw")} facitOpen={facitOpen.draw} facit={<DrawFacit item={item} />} onSkip={() => goNext("draw")} onNext={() => goNext("draw")} />
      </>
    ),
    ck: () => (
      <>
        <CkBody item={item} draft={draft} setDraft={setDraft} />
        <StepFooter onCheck={() => check("ck")} result={checked.ck && <CkResult field={grading.fields.ck} />} onFacit={() => toggleFacit("ck")} facitOpen={facitOpen.ck} facit={<CkFacit item={item} />} onNext={() => goNext("ck")} />
      </>
    ),
    roles: () => (
      <>
        <RolesBody item={item} draft={draft} setDraft={setDraft} />
        <StepFooter onCheck={() => check("roles")} result={checked.roles && <RolesResult field={grading.fields.roles} />} onFacit={() => toggleFacit("roles")} facitOpen={facitOpen.roles} facit={<RolesFacit item={item} />} onNext={() => goNext("roles")} />
      </>
    ),
    nf: () => (
      <>
        <NfBody item={item} draft={draft} setDraft={setDraft} />
        <StepFooter onCheck={draft.nf ? () => check("nf") : null} result={checked.nf && draft.nf && <NfResult field={grading.fields.nf} />} onFacit={() => toggleFacit("nf")} facitOpen={facitOpen.nf} facit={<NfFacit item={item} />} onNext={() => draft.nf && goNext("nf")} nextLabel={draft.nf ? "Nästa" : "Välj normalform"} />
      </>
    ),
    motivation: () => (
      <>
        <MotivationBody item={item} draft={draft} setDraft={setDraft} hasArrows={Boolean(diagram?.arrows.length)} onChoose={chooseMotivation} pickNote={pickNote} />
        <StepFooter onCheck={() => check("motivation")} result={checked.motivation && <MotivationResult field={grading.fields.motivation} nfField={grading.fields.nf} />} onFacit={() => toggleFacit("motivation")} facitOpen={facitOpen.motivation} facit={<MotivationFacit item={item} />} onNext={() => goNext("motivation")} />
      </>
    ),
    decomposition: () => (
      <>
        <DecompositionBody item={item} draft={draft} setDraft={setDraft} parsed={parsed} highlight={highlight} />
        <StepFooter onCheck={() => check("decomposition")} result={checked.decomposition && <DecompositionResult field={decField} nfField={grading.fields.nf} />} onFacit={() => toggleFacit("decomposition")} facitOpen={facitOpen.decomposition} facit={<DecompositionFacit item={item} schema={facit.schema} text={facit.text} />} onNext={() => goNext("decomposition")} nextLabel="Till sammanfattningen" />
      </>
    ),
  };

  const title = item.nfOnly ? "Högsta normalform" : "Högsta normalform och normalisering till 3NF";
  const graded = current === "summary";
  const pickedArrowId = draft.motivation?.arrowId || null;
  const scored = steps.filter((s) => s !== "draw");

  return (
    <div className="lg:flex lg:gap-8">
      <div className="lg:order-2 lg:min-w-0 lg:flex-1">
        <section className="card p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm text-ink/65">
              {itemLabel(item)} · {NORMALIZE_GROUPS.find((g) => g.exercise === item.exercise)?.source}
              {modelProgress[item.id] && <span className="ml-2 text-correct">✓ Klar</span>}
            </p>
            {modelProgress[item.id] && !confirmReset && <button type="button" className="btn-quiet text-sm" onClick={() => setConfirmReset(true)}>Nollställ uppgiften</button>}
            {confirmReset && (
              <span className="flex gap-2 text-sm">
                <button type="button" className="btn-secondary" onClick={() => { onReset(item.id); setDraft({ step: "draw", done: {}, checked: {} }); setConfirmReset(false); }}>Ja, nollställ</button>
                <button type="button" className="btn-quiet" onClick={() => setConfirmReset(false)}>Avbryt</button>
              </span>
            )}
          </div>
          <h2 className="mt-1 font-display text-xl">{title}</h2>

          <pre className="mt-3 overflow-x-auto rounded-lg border border-line bg-paper p-3 font-mono text-[14.5px] leading-relaxed text-ink">{contextOf(item)}</pre>

          <div ref={surfaceRef} />
          <FdCanvas key={item.id} item={item} graded={graded} showCheck={showCheck && current === "draw"} pickMode={current === "motivation"} pickedArrowId={pickedArrowId} onPick={onPick} onDiagramChange={setDiagram} />

          <ol className="mt-5 space-y-2">
            {steps.map((step, i) => {
              const state = step === current ? "open" : draft.done?.[step] || current === "summary" ? "done" : "todo";
              const showMark = current === "summary" ? (step === "draw" ? (diagram?.arrows.length ? okFor("draw") : null) : okFor(step)) : checked[step] ? okFor(step) : null;
              return (
                <Step key={step} index={i + 1} step={step} state={state} summary={stepSummary(step, item, draft, diagram)} ok={showMark} onEdit={() => edit(step)} onHelp={() => help(step)}>
                  {state === "open" && body[step]()}
                </Step>
              );
            })}
          </ol>

          {current === "summary" && (
            <div className={`mt-4 rounded-lg border-l-2 p-4 ${solved ? "border-correct bg-correct-bg" : "border-wrong bg-wrong-bg"}`} role="status">
              <p className="font-display text-lg">{solved ? "Rätt i alla steg." : `${scored.filter(okFor).length} av ${scored.length} steg rätt.`}</p>
              {!solved && <p className="mt-1 text-[15px] text-ink/80">Tryck "Ändra" på ett steg med ✗ och "Kontrollera" för att se varför.</p>}
              {item.trap && <p className="mt-2 text-[15px] text-ink/85"><span className="font-medium">Fällan:</span> {item.trap}</p>}
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" className="btn-primary px-4 py-1.5 text-sm" onClick={() => setCurrentId(nextItemId(items, item.id, modelProgress))}>Nästa uppgift</button>
                <button type="button" className="btn-secondary px-3 py-1.5 text-sm" onClick={() => toggleFacit("all")} aria-pressed={facitOpen.all}>{facitOpen.all ? "Dölj facit" : "Visa facit för hela uppgiften"}</button>
              </div>
            </div>
          )}
          {current !== "summary" && (
            <p className="mt-3 text-right"><button type="button" className="btn-quiet px-1 py-0.5 text-sm" onClick={() => toggleFacit("all")} aria-pressed={facitOpen.all}>{facitOpen.all ? "Dölj facit" : "Visa facit för hela uppgiften"}</button></p>
          )}
          {facitOpen.all && (
            <div className="mt-3 space-y-3 rounded-lg border border-line bg-paper p-4 text-[15px]">
              <p className="font-display text-lg">Facit</p>
              {[["ck", <CkFacit key="ck" item={item} />], ["roles", <RolesFacit key="r" item={item} />], ["nf", <NfFacit key="nf" item={item} />], ["motivation", <MotivationFacit key="m" item={item} />], ...(item.nfOnly ? [] : [["decomposition", <DecompositionFacit key="d" item={item} schema={facit.schema} text={facit.text} />]])].map(([k, node]) => (
                <div key={k}><p className="text-sm font-medium text-ink/70">{STEP_LABELS[k]}</p>{node}</div>
              ))}
              {item.trap && <p><span className="font-medium">Fällan:</span> {item.trap}</p>}
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
                  const isSolved = Boolean(modelProgress[e.id]);
                  return (
                    <li key={e.id}>
                      <button
                        type="button"
                        onClick={() => setCurrentId(e.id)}
                        aria-current={active ? "true" : undefined}
                        aria-label={`${itemLabel(e)}${isSolved ? ", klar" : ""}`}
                        className={`tabular flex h-9 w-9 items-center justify-center rounded-lg border text-sm transition-colors duration-150 ${active ? "border-pine bg-pine text-white" : isSolved ? "border-correct/40 bg-correct-bg text-correct hover:border-pine" : "border-line hover:border-pine hover:bg-pine/[0.06]"}`}
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
        <FdDefinitions focus={defFocus} />
      </div>
    </div>
  );
}

