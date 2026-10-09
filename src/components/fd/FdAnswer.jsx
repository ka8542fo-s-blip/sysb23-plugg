import { useMemo } from "react";
import { attrsOf, setText, braceText, properSubset, has } from "../../lib/fd.js";
import { motivationOptions } from "../../lib/fdGrade.js";
import SchemaView from "../model/SchemaView.jsx";
import SchemaEditor from "../model/SchemaEditor.jsx";
import FdMini from "./FdMini.jsx";

// Svarspanelen i Björns ordning: CK, PA och NP, högsta normalform,
// motivering (när R inte är i 3NF) och nedbrytningen (uppgift 11–13 och de
// egna). Motiveringens mall-mening fylls i ur valet och går att skriva om;
// rättningen sker på valet.

const TEMPLATE = `R₁(A, B)
CK₁ = {A}
PK = CK₁

R₂(B, C)
CK₁ = {B}
PK = CK₁`;

const ROLE_NEXT = { undefined: "PA", PA: "NP", NP: undefined };
const ROLE_LABEL = { PA: "PA", NP: "NP" };
const ck = (i) => `CK${"₁₂₃₄₅₆₇₈₉"[i] ?? i + 1}`;

// Mall-meningen med kursens formulering. Kandidatnyckeln hämtas ur dina
// egna CK (inte ur facit), så mallen avslöjar inget.
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

// showDiagram={false}: utan miniatyren av beroendediagrammet (fliken Tenta har ingen rityta).
export default function FdAnswer({ item, draft, setDraft, highlight, parsed, result, diagram, showDiagram = true }) {
  const attrs = useMemo(() => attrsOf(item.attrs), [item.attrs]);
  const options = useMemo(() => motivationOptions(item), [item]);
  const cks = draft.cks?.length ? draft.cks : [[]];
  const userCks = cks.map((k) => attrs.filter((a) => has(k, a))).filter((k) => k.length);
  const roles = draft.roles || {};
  const m = draft.motivation || {};
  const option = options.find((o) => o.value === m.option);
  const rhsChoices = option ? option.fd.rhs.filter((a) => !has(option.fd.lhs, a)) : [];
  // Mallen räknas om vid varje ändring tills du skriver om texten själv.
  const shownText = m.edited ? m.text || "" : templateFor(option, m.attr, m.type, userCks);
  const decomposes = !item.nfOnly && draft.nf && draft.nf !== "3NF";
  const showMotivation = draft.nf && draft.nf !== "3NF";
  const f = result?.fields || {};
  const mark = (field) => (field ? (field.ok ? <span className="ml-2 text-sm text-correct">✓ rätt</span> : <span className="ml-2 text-sm text-wrong">✗ fel</span>) : null);

  const setCk = (i, keyAttrs) => setDraft({ cks: cks.map((k, j) => (j === i ? keyAttrs : k)) });
  const toggleCkAttr = (i, a) => setCk(i, has(cks[i], a) ? cks[i].filter((x) => x !== a) : attrs.filter((x) => x === a || has(cks[i], x)));

  function setMotivation(patch) {
    const next = { ...m, ...patch };
    const opt = options.find((o) => o.value === next.option);
    if (patch.option !== undefined) {
      const rhs = opt ? opt.fd.rhs.filter((a) => !has(opt.fd.lhs, a)) : [];
      next.attr = rhs.length === 1 ? rhs[0] : rhs.includes(next.attr) ? next.attr : null;
    }
    setDraft({ motivation: next });
  }

  return (
    <div className="mt-5 space-y-5">
      <fieldset>
        <legend className="text-sm font-medium text-ink/80">Kandidatnycklar (CK){mark(f.ck)}</legend>
        <div className="mt-1 space-y-1.5">
          {cks.map((key, i) => (
            <div key={i} className="flex flex-wrap items-center gap-1.5">
              <span className="w-10 font-mono text-sm text-ink/70">{ck(i)}</span>
              <span className="font-mono text-ink/50">{"{"}</span>
              {attrs.map((a) => (
                <button
                  key={a}
                  type="button"
                  aria-pressed={has(key, a)}
                  aria-label={`${a} i ${ck(i)}`}
                  onClick={() => toggleCkAttr(i, a)}
                  className={`chip chip-sm font-mono ${has(key, a) ? "chip-on" : ""}`}
                >
                  {a}
                </button>
              ))}
              <span className="font-mono text-ink/50">{"}"}</span>
              {cks.length > 1 && (
                <button type="button" className="btn-quiet px-1 py-0.5 text-sm" onClick={() => setDraft({ cks: cks.filter((_, j) => j !== i) })} aria-label={`Ta bort ${ck(i)}`}>Ta bort</button>
              )}
            </div>
          ))}
          <button type="button" className="btn-quiet px-1 py-0.5 text-sm" onClick={() => setDraft({ cks: [...cks, []] })}>+ Lägg till kandidatnyckel</button>
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium text-ink/80">Prime (PA) och non-prime (NP){mark(f.roles)}</legend>
        <p className="text-xs text-ink/65">Tryck för att växla – → PA → NP.</p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {attrs.map((a) => {
            const role = roles[a];
            const wrong = f.roles && f.roles.perAttr.find((p) => p.attr === a && !p.ok);
            return (
              <button
                key={a}
                type="button"
                onClick={() => setDraft({ roles: { ...roles, [a]: ROLE_NEXT[role] } })}
                aria-label={`${a}: ${role === "PA" ? "prime" : role === "NP" ? "non-prime" : "inte valt"}`}
                className={`chip chip-sm gap-1.5 font-mono ${role ? "chip-on" : ""} ${wrong ? "ring-2 ring-wrong/60" : ""}`}
              >
                <span>{a}</span>
                <span className={`text-[12px] ${role ? "" : "text-ink/40"}`}>{ROLE_LABEL[role] || "–"}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium text-ink/80">Högsta normalform{mark(f.nf)}</legend>
        <div className="mt-1 flex flex-wrap gap-2">
          {["1NF", "2NF", "3NF"].map((nf) => (
            <label key={nf} className={`chip cursor-pointer ${draft.nf === nf ? "chip-on" : ""}`}>
              <input type="radio" name={`nf-${item.id}`} value={nf} checked={draft.nf === nf} onChange={() => setDraft({ nf })} className="sr-only" />
              {nf}
            </label>
          ))}
        </div>
        {draft.nf === "3NF" && !item.nfOnly && <p className="mt-1 text-sm text-ink/65">R är redan i 3NF — ingen motivering och ingen nedbrytning.</p>}
      </fieldset>

      {showMotivation && (
        <fieldset>
          <legend className="text-sm font-medium text-ink/80">Motivering: beroendet som bryter{mark(f.motivation)}</legend>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <label className="text-sm">
              <span className="sr-only">Beroende</span>
              <select value={m.option || ""} onChange={(e) => setMotivation({ option: e.target.value || null })} className="rounded-lg border border-line bg-white px-2 py-1.5 font-mono text-sm">
                <option value="">Välj beroende …</option>
                {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </label>
            {rhsChoices.length > 1 && (
              <label className="text-sm">
                <span className="mr-1 text-ink/65">attribut</span>
                <select value={m.attr || ""} onChange={(e) => setMotivation({ attr: e.target.value || null })} className="rounded-lg border border-line bg-white px-2 py-1.5 font-mono text-sm">
                  <option value="">…</option>
                  {rhsChoices.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </label>
            )}
            <div className="flex gap-1.5" role="radiogroup" aria-label="Typ">
              {[["partial", "partial"], ["transitive", "transitive"]].map(([t, label]) => (
                <button key={t} type="button" role="radio" aria-checked={m.type === t} onClick={() => setMotivation({ type: t })} className={`chip chip-sm ${m.type === t ? "chip-on" : ""}`}>{label}</button>
              ))}
            </div>
          </div>
          <label className="mt-2 block">
            <span className="sr-only">Motiveringen i text</span>
            <textarea
              value={shownText}
              onChange={(e) => setDraft({ motivation: { ...m, text: e.target.value, edited: true } })}
              rows={2}
              placeholder="Välj beroende, attribut och typ så fylls meningen i."
              className="w-full rounded-lg border border-line bg-white px-3 py-2 text-[15px]"
            />
          </label>
          <div className="flex flex-wrap items-center gap-2 text-xs text-ink/65">
            <span>Texten får du skriva om; rättningen sker på valet ovan.</span>
            {m.edited && (
              <button type="button" className="btn-quiet px-1 py-0 text-xs" onClick={() => setDraft({ motivation: { ...m, edited: false, text: "" } })}>Återställ mallen</button>
            )}
          </div>
        </fieldset>
      )}

      {decomposes && (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <SchemaEditor
              id={`normalize-input-${item.id}`}
              label={<>Nedbrytningen, i föreläsningens notation{mark(f.decomposition)}</>}
              value={draft.text || ""}
              onChange={(text) => setDraft({ text })}
              placeholder={TEMPLATE}
              rows={11}
            />
            <p className="mt-1 text-xs text-ink/65">Relationen på en rad, R₁(A, B), och därefter CK₁ = {"{…}"} (CK₂ … om det finns fler) och PK = CK₁ på egna rader. Ett attribut per rad och PK = {"{…}"} direkt går också. Namnen R₁, R₂ … spelar ingen roll.</p>
          </div>
          <div>
            {showDiagram && (
              <>
                <p className="mb-1 text-sm font-medium text-ink/80">Ditt beroendediagram</p>
                <div className="mb-3 rounded-lg border border-line bg-white p-2">
                  <FdMini diagram={diagram} />
                </div>
              </>
            )}
            <p className="mb-1 text-sm font-medium text-ink/80">Så ser det ut på tentan</p>
            <div className="rounded-lg border border-line bg-paper p-3">
              <SchemaView schema={parsed} highlight={highlight} />
              {parsed.errors.length > 0 && (draft.text || "").trim() && (
                <ul className="mt-2 space-y-1 text-sm text-wrong">
                  {parsed.errors.slice(0, 3).map((err) => <li key={err.line + err.message}>{err.message}</li>)}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
