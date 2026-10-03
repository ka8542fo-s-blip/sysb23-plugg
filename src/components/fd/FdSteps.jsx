import { useMemo, useState } from "react";
import { attrsOf, setText, braceText, properSubset, has, highestNF, NF_NAME } from "../../lib/fd.js";
import { motivationOptions, explainKey, motivationText } from "../../lib/fdGrade.js";
import { STEP_LABELS } from "../../lib/fdSteps.js";
import { givenPairs, pairText } from "../../lib/fdDiagram.js";
import { norm } from "../../lib/modelCheck.js";
import SchemaView from "../model/SchemaView.jsx";
import SchemaEditor from "../model/SchemaEditor.jsx";

// Stegen i normaliseringen: ett skal (rubrik, "?", Kontrollera, Visa facit,
// Nästa) och innehållet för varje steg. Normalizing.jsx håller ordningen.

const SUB = "₁₂₃₄₅₆₇₈₉";
const ckLabel = (i) => `CK${SUB[i] ?? i + 1}`;

export function Mark({ ok }) {
  if (ok === undefined || ok === null) return null;
  return ok ? <span className="text-sm text-correct">✓ rätt</span> : <span className="text-sm text-wrong">✗ fel</span>;
}

// Skalet för ett steg. `state`: "open" | "done" | "todo".
export function Step({ index, step, state, summary, ok, onEdit, onHelp, children }) {
  const title = STEP_LABELS[step];
  if (state === "todo") {
    return (
      <li className="flex items-center gap-3 rounded-lg px-3 py-2 text-ink/45">
        <span className="tabular flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line text-xs">{index}</span>
        <span className="text-[15px]">{title}</span>
      </li>
    );
  }
  if (state === "done") {
    return (
      <li className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-line bg-paper px-3 py-2">
        <span className="tabular flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pine/10 text-xs text-pine">{index}</span>
        <span className="text-[15px] font-medium text-ink/85">{title}</span>
        <span className="min-w-0 flex-1 truncate font-mono text-sm text-ink/70">{summary}</span>
        <Mark ok={ok} />
        <button type="button" className="btn-quiet px-1 py-0.5 text-sm" onClick={onEdit}>Ändra</button>
      </li>
    );
  }
  return (
    <li className="rounded-lg border-2 border-pine/30 bg-white p-4">
      <div className="flex items-center gap-3">
        <span className="tabular flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pine text-xs text-white">{index}</span>
        <h3 className="font-display text-lg">{title}</h3>
        <button type="button" onClick={onHelp} className="ml-auto flex h-7 w-7 items-center justify-center rounded-full border border-line text-sm text-pine transition-colors duration-150 hover:border-pine hover:bg-pine/[0.06]" aria-label={`Definition för ${title.toLowerCase()}`} title="Definition">?</button>
      </div>
      <div className="mt-3">{children}</div>
    </li>
  );
}

// Knapprad och resultat längst ned i ett öppet steg.
export function StepFooter({ onCheck, onFacit, facitOpen, onNext, nextLabel = "Nästa", onSkip, result, facit }) {
  return (
    <>
      {result}
      {facitOpen && facit && <div className="mt-3 rounded-lg border border-line bg-paper p-3 text-[15px]">{facit}</div>}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {onCheck && <button type="button" className="btn-secondary px-3 py-1.5 text-sm" onClick={onCheck}>Kontrollera</button>}
        {onFacit && <button type="button" className="btn-quiet px-2 py-1.5 text-sm" onClick={onFacit} aria-pressed={facitOpen}>{facitOpen ? "Dölj facit" : "Visa facit"}</button>}
        <span className="flex-1" />
        {onSkip && <button type="button" className="btn-quiet px-2 py-1.5 text-sm" onClick={onSkip}>Hoppa över</button>}
        <button type="button" className="btn-primary px-4 py-1.5 text-sm" onClick={onNext}>{nextLabel}</button>
      </div>
    </>
  );
}

export function Result({ ok, children }) {
  return (
    <div className={`mt-3 rounded-lg border-l-2 p-3 text-[15px] ${ok ? "border-correct bg-correct-bg" : "border-wrong bg-wrong-bg"}`} role="status">
      <p className={`font-medium ${ok ? "text-correct" : "text-wrong"}`}>{ok ? "Rätt." : "Inte riktigt."}</p>
      <div className="mt-1 text-ink/85">{children}</div>
    </div>
  );
}

// ---------- 1. Rita ----------
export function DrawBody() {
  return <p className="text-[15px] text-ink/80">Rita beroendediagrammet i ytan ovan: en pil per beroende, och en grupp runt en sammansatt vänstersida. Frivilligt — men det gör resten lättare.</p>;
}
export function DrawFacit({ item }) {
  return <p>Pilarna ur uppgiften: <span className="font-mono">{givenPairs(item.fds).map(pairText).join(", ") || "inga beroenden"}</span>. "Rita från FD:erna" under ytan ritar dem åt dig.</p>;
}

// ---------- 2. Kandidatnycklar ----------
export function CkBody({ item, draft, setDraft }) {
  const attrs = attrsOf(item.attrs);
  const cks = draft.cks?.length ? draft.cks : [[]];
  const setCk = (i, keyAttrs) => setDraft({ cks: cks.map((k, j) => (j === i ? keyAttrs : k)) });
  const toggle = (i, a) => setCk(i, has(cks[i], a) ? cks[i].filter((x) => x !== a) : attrs.filter((x) => x === a || has(cks[i], x)));
  return (
    <div className="space-y-2">
      <p className="text-sm text-ink/70">Välj attributen i varje kandidatnyckel. Hitta alla.</p>
      {cks.map((key, i) => (
        <div key={i} className="flex flex-wrap items-center gap-1.5">
          <span className="w-10 font-mono text-sm text-ink/70">{ckLabel(i)}</span>
          <span className="font-mono text-ink/40">{"{"}</span>
          {attrs.map((a) => {
            const on = has(key, a);
            return (
              <button
                key={a}
                type="button"
                aria-pressed={on}
                aria-label={`${a} i ${ckLabel(i)}`}
                onClick={() => toggle(i, a)}
                className={`h-9 min-w-9 rounded-lg border-2 px-2 font-mono text-[15px] transition-colors duration-150 ${on ? "border-pine bg-pine text-white" : "border-line bg-white text-ink/60 hover:border-pine/60"}`}
              >
                {a}
              </button>
            );
          })}
          <span className="font-mono text-ink/40">{"}"}</span>
          {cks.length > 1 && <button type="button" className="btn-quiet px-1 py-0.5 text-sm" onClick={() => setDraft({ cks: cks.filter((_, j) => j !== i) })} aria-label={`Ta bort ${ckLabel(i)}`}>Ta bort</button>}
        </div>
      ))}
      <button type="button" className="btn-quiet px-1 py-0.5 text-sm" onClick={() => setDraft({ cks: [...cks, []] })}>+ Ytterligare kandidatnyckel</button>
    </div>
  );
}
export function CkResult({ field }) {
  return (
    <Result ok={field.ok}>
      <ul className="ml-4 list-disc space-y-0.5">
        {field.given.length === 0 && <li>Ingen kandidatnyckel angiven.</li>}
        {field.notes.filter((n) => !n.ok || field.ok).map((n) => <li key={n.text}>{n.text}</li>)}
        {!field.ok && field.notes.some((n) => n.ok) && <li className="text-ink/65">Rätt: {field.notes.filter((n) => n.ok).map((n) => n.text.split(":")[0]).join(", ")}.</li>}
      </ul>
    </Result>
  );
}
export function CkFacit({ item }) {
  const { cks } = highestNF(item.attrs, item.fds);
  return (
    <ul className="space-y-1">
      {cks.map((k) => <li key={k.join()}><span className="font-mono">{braceText(k)}</span> — {explainKey(k, item.attrs, item.fds)}</li>)}
    </ul>
  );
}

// ---------- 3. Prime och non-prime ----------
export function RolesBody({ item, draft, setDraft }) {
  const attrs = attrsOf(item.attrs);
  const roles = draft.roles || {};
  return (
    <div>
      <p className="text-sm text-ink/70">{draft.rolesEdited ? "Tryck på ett attribut för att växla mellan PA och NP." : "Förifyllt från dina kandidatnycklar. Stämmer det? Tryck för att ändra."}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {attrs.map((a) => {
          const role = roles[a];
          return (
            <button
              key={a}
              type="button"
              onClick={() => setDraft({ roles: { ...roles, [a]: role === "PA" ? "NP" : "PA" }, rolesEdited: true })}
              aria-label={`${a}: ${role === "PA" ? "prime" : role === "NP" ? "non-prime" : "inte valt"}`}
              className={`flex h-10 items-center gap-1.5 rounded-lg border-2 px-3 font-mono text-[15px] transition-colors duration-150 ${role === "PA" ? "border-pine bg-pine text-white" : role === "NP" ? "border-ink/40 bg-white text-ink" : "border-line text-ink/50"}`}
            >
              <span>{a}</span>
              <span className="text-[12px]">{role || "–"}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
export function RolesResult({ field }) {
  return (
    <Result ok={field.ok}>
      {field.ok ? <p>Alla attribut rätt klassade.</p> : (
        <ul className="ml-4 list-disc space-y-0.5">
          {field.perAttr.filter((p) => !p.ok).map((p) => <li key={p.attr}>{p.attr}: {p.given ? `du har ${p.given}, ska vara ${p.expected}` : `ska vara ${p.expected}`}. {p.why}</li>)}
        </ul>
      )}
    </Result>
  );
}
export function RolesFacit({ item }) {
  const a = highestNF(item.attrs, item.fds);
  return <p className="font-mono">PA: {a.prime.join(", ") || "–"} · NP: {a.nonPrime.join(", ") || "–"}</p>;
}

// ---------- 4. Högsta normalform ----------
export function NfBody({ item, draft, setDraft }) {
  return (
    <div>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Högsta normalform">
        {["1NF", "2NF", "3NF"].map((nf) => {
          const on = draft.nf === nf;
          return (
            <button key={nf} type="button" role="radio" aria-checked={on} onClick={() => setDraft({ nf })}
              className={`h-10 rounded-lg border-2 px-4 text-[15px] transition-colors duration-150 ${on ? "border-pine bg-pine text-white" : "border-line bg-white text-ink/70 hover:border-pine/60"}`}>
              {nf}
            </button>
          );
        })}
      </div>
      {draft.nf === "3NF" && !item.nfOnly && <p className="mt-2 text-sm text-ink/65">R är redan i 3NF — ingen motivering och ingen nedbrytning.</p>}
      {draft.nf === "3NF" && item.nfOnly && <p className="mt-2 text-sm text-ink/65">Ingen motivering krävs för 3NF.</p>}
    </div>
  );
}
export function NfResult({ field }) {
  return <Result ok={field.ok}><p>{!field.ok && field.given ? `Du har ${field.given}, rätt är ${field.expected}. ` : !field.ok ? `Rätt är ${field.expected}. ` : ""}{field.why}</p></Result>;
}
export function NfFacit({ item }) {
  return <p className="font-mono">{NF_NAME[highestNF(item.attrs, item.fds).nf]}</p>;
}

// ---------- 5. Motivering ----------
// Mall-meningen med kursens formulering, ur dina egna kandidatnycklar.
export function templateFor(option, attr, type, userCks) {
  if (!option || !attr || !type) return "";
  const lhs = option.fd.lhs;
  if (type === "partial") {
    const key = userCks.find((k) => properSubset(lhs, k));
    return `Non-prime attribute ${attr} is functionally dependent on proper subset ${setText(lhs)} of candidate key ${key ? braceText(key) : "{…}"}.`;
  }
  const key = userCks.find((k) => k.length) || null;
  return `Non-prime attribute ${attr} is transitively dependent on candidate key ${key ? braceText(key) : "{…}"} via ${setText(lhs)}.`;
}

export function MotivationBody({ item, draft, setDraft, hasArrows, onChoose, pickNote }) {
  const attrs = attrsOf(item.attrs);
  const options = useMemo(() => motivationOptions(item), [item]);
  const m = draft.motivation || {};
  const option = options.find((o) => o.value === m.option);
  const rhsChoices = option ? option.fd.rhs.filter((a) => !has(option.fd.lhs, a)) : [];
  const userCks = (draft.cks || []).map((k) => attrs.filter((a) => has(k, a))).filter((k) => k.length);
  const text = m.edited ? m.text || "" : templateFor(option, m.attr, m.type, userCks);
  const [editing, setEditing] = useState(Boolean(m.edited));
  const set = (patch) => setDraft({ motivation: { ...m, ...patch } });
  return (
    <div className="space-y-3">
      <p className="text-sm text-ink/70">
        {hasArrows ? "Tryck på pilen i diagrammet som bryter mot normalformen — eller välj beroendet i listan." : "Välj beroendet som bryter mot normalformen."}
      </p>
      {pickNote && <p className="text-sm text-wrong">{pickNote}</p>}
      <div className="flex flex-wrap items-center gap-2">
        <label className="text-sm">
          <span className="sr-only">Beroende</span>
          <select value={m.option || ""} onChange={(e) => onChoose(e.target.value || null, null)} className="rounded-lg border border-line bg-white px-2 py-1.5 font-mono text-sm">
            <option value="">Välj beroende …</option>
            {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </label>
        {rhsChoices.length > 1 && (
          <label className="text-sm">
            <span className="mr-1 text-ink/65">attribut</span>
            <select value={m.attr || ""} onChange={(e) => onChoose(m.option, e.target.value || null)} className="rounded-lg border border-line bg-white px-2 py-1.5 font-mono text-sm">
              <option value="">…</option>
              {rhsChoices.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </label>
        )}
      </div>
      {option && m.attr && (
        <div>
          <div className="flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Typ">
            <span className="text-sm text-ink/65">Typ:</span>
            {["partial", "transitive"].map((t) => (
              <button key={t} type="button" role="radio" aria-checked={m.type === t} onClick={() => set({ type: t, typeEdited: true })} className={`chip chip-sm ${m.type === t ? "chip-on" : ""}`}>{t}</button>
            ))}
            {!m.typeEdited && m.type && <span className="text-xs text-ink/55">föreslaget utifrån dina kandidatnycklar</span>}
          </div>
          <div className="mt-3 rounded-lg border border-line bg-paper p-3">
            {editing ? (
              <textarea value={text} onChange={(e) => set({ text: e.target.value, edited: true })} rows={2} className="w-full rounded border border-line bg-white px-2 py-1.5 text-[15px]" aria-label="Motiveringen i text" />
            ) : (
              <p className="text-[15px] italic text-ink/85">{text || "Välj typ så fylls meningen i."}</p>
            )}
            <div className="mt-1 flex gap-2 text-xs">
              {!editing && <button type="button" className="btn-quiet px-1 py-0 text-xs" onClick={() => setEditing(true)}>Redigera</button>}
              {m.edited && <button type="button" className="btn-quiet px-1 py-0 text-xs" onClick={() => { set({ edited: false, text: "" }); setEditing(false); }}>Återställ mallen</button>}
              <span className="text-ink/55">Rättningen sker på valet, inte på texten.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export function MotivationResult({ field, nfField }) {
  if (!field) return <Result ok={false}><p>R är redan i {nfField.expected} — det finns inget beroende som bryter mot 3NF. {nfField.why}</p></Result>;
  return (
    <Result ok={field.ok}>
      {field.why && <p>{field.why}</p>}
      {field.ok && <p>Beroendet bryter mot {field.needType === "partial" ? "2NF" : "3NF"} och visar normalformen.</p>}
    </Result>
  );
}
export function MotivationFacit({ item }) {
  const a = highestNF(item.attrs, item.fds);
  if (a.nf === 3) return <p>R är i 3NF — ingen motivering behövs.</p>;
  const need = a.nf === 1 ? "partial" : "transitive";
  return (
    <div>
      <p className="text-sm text-ink/70">Någon av dessa godtas ({need}):</p>
      <ul className="ml-4 mt-1 list-disc">{a.violations.filter((v) => v.type === need).map((v) => <li key={v.via.join() + v.attr}>{motivationText(v, a.cks)}</li>)}</ul>
    </div>
  );
}

// ---------- 6. Nedbrytning ----------
const TEMPLATE = `R₁(
  A,
  B,
  PK = {A}
)

R₂(
  B,
  C,
  PK = {B}
)`;
export function DecompositionBody({ item, draft, setDraft, parsed, highlight }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <SchemaEditor id={`normalize-input-${item.id}`} label="Relationer i föreläsningens notation" value={draft.text || ""} onChange={(text) => setDraft({ text })} placeholder={TEMPLATE} rows={11} />
        <p className="mt-1 text-xs text-ink/65">Relationsnamn och (, attributen, en rad PK = {"{…}"}, avslutat med ). Namnen spelar ingen roll.</p>
      </div>
      <div>
        <p className="mb-1 text-sm font-medium text-ink/80">Så ser det ut på tentan</p>
        <div className="rounded-lg border border-line bg-paper p-3">
          <SchemaView schema={parsed} highlight={highlight} />
          {parsed.errors.length > 0 && (draft.text || "").trim() && (
            <ul className="mt-2 space-y-1 text-sm text-wrong">{parsed.errors.slice(0, 3).map((err) => <li key={err.line + err.message}>{err.message}</li>)}</ul>
          )}
        </div>
      </div>
    </div>
  );
}
export function DecompositionResult({ field, nfField }) {
  if (!field) return <Result ok={false}><p>R är redan i {nfField.expected} — ingen nedbrytning behövs, och att dela upp den är övernormalisering.</p></Result>;
  const r = field.result;
  const p = field.properties;
  return (
    <Result ok={field.ok}>
      {r.status === "parse-error" ? (
        <ul className="ml-4 list-disc">{r.errors.map((err) => <li key={err.line + err.message}>{err.message}</li>)}</ul>
      ) : (
        <ul className="space-y-2">
          {(r.relations || []).map((x) => (
            <li key={x.name}>
              <span className={x.status === "ok" ? "text-correct" : "text-wrong"}>
                {x.name}{x.answerName && norm(x.answerName) !== norm(x.name) ? ` (${x.answerName})` : ""}: {x.status === "ok" ? "rätt" : x.status === "missing" ? "saknas" : "fel"}
              </span>
              {x.problems.length > 0 && <ul className="ml-4 list-disc">{x.problems.map((pr) => <li key={pr}>{pr}</li>)}</ul>}
              {x.status !== "ok" && x.rule && <p className="mt-0.5 text-ink/80"><span className="font-medium">{x.rule.rule}:</span> {x.rule.why}</p>}
            </li>
          ))}
          {(r.extra || []).map((e) => <li key={"extra-" + e.name}><span className="text-wrong">{e.name}: extra</span><p className="mt-0.5 text-ink/80">{e.message}</p></li>)}
        </ul>
      )}
      {p && (
        <div className="mt-3 rounded-lg border border-line bg-white/70 p-3 text-sm">
          <p className="font-medium text-ink/85">Din nedbrytning, prövad med beroendena</p>
          {p.missingAttrs.length > 0 && <p className="mt-1 text-wrong">Attribut som inte finns i någon relation: {p.missingAttrs.join(", ")}.</p>}
          {p.unknown.length > 0 && <p className="mt-1 text-wrong">Finns inte i R: {p.unknown.join(", ")}.</p>}
          <p className="mt-1"><span className={p.relations.every((x) => x.nf === 3) ? "text-correct" : "text-wrong"}>Normalform per relation:</span> {p.relations.map((x) => `${x.name} ${NF_NAME[x.nf]}`).join(", ")}.</p>
          <p className="mt-1"><span className={p.lossless ? "text-correct" : "text-wrong"}>Lossless join: {p.lossless ? "ja" : "nej"}.</span></p>
          <ul className="ml-4 list-disc text-ink/80">{p.lossText.map((t) => <li key={t}>{t}</li>)}</ul>
          <p className="mt-1"><span className={p.preserving ? "text-correct" : "text-wrong"}>Dependency preservation: {p.preserving ? "ja" : "nej"}.</span></p>
          <ul className="ml-4 list-disc text-ink/80">{p.depText.map((t) => <li key={t.text} className={t.ok ? "" : "text-wrong"}>{t.text}</li>)}</ul>
          <p className="mt-2 text-xs text-ink/65">Lossless och beroendebevarande räcker inte för rätt: en övernormaliserad nedbrytning klarar oftast båda och ger ändå avdrag. Rättningen ovan sker mot facit.</p>
        </div>
      )}
    </Result>
  );
}
export function DecompositionFacit({ item, schema, text }) {
  if (!schema) return <p>R är i 3NF — ingen nedbrytning.</p>;
  return (
    <div>
      <div className="rounded-lg border border-line bg-white p-3"><SchemaView schema={schema} /></div>
      <pre className="mt-2 overflow-x-auto rounded-lg border border-line bg-white px-4 py-3 font-mono text-[13.5px] leading-relaxed text-ink">{text}</pre>
      {item.keyNote && <p className="mt-2 text-sm text-ink/65">Anmärkning: {item.keyNote}</p>}
    </div>
  );
}
