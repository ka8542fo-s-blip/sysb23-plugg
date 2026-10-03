// Det guidade flödet i normaliseringen: ett steg öppet åt gången, tidigare
// steg komprimerade med sitt svar. Svaret sparas per uppgift i
// localStorage (sysb23:fdsvar:<id>) tillsammans med vilket steg som är
// öppet och vilka steg som är klara; äldre sparade svar (utan steg)
// migreras här.
import { attrsOf, has, properSubset, isSuperkey, setText, braceText, sameSet } from "./fd.js";
import { motivationOptions } from "./fdGrade.js";

export const STEP_LABELS = {
  draw: "Rita beroendediagrammet",
  ck: "Kandidatnycklar",
  roles: "Prime och non-prime",
  nf: "Högsta normalform",
  motivation: "Motivering",
  decomposition: "Nedbrytning till 3NF",
};

// Definitionen som "?" vid steget öppnar.
export const STEP_DEFINITION = {
  draw: "Functional dependency",
  ck: "Candidate key",
  roles: "Prime attribute",
  nf: "2NF",
  motivation: "3NF",
  decomposition: "Lossless join",
};

export const emptyDraft = () => ({ cks: [[]], roles: {}, nf: null, motivation: {}, text: "", step: "draw", done: {}, rolesEdited: false, v: 2 });

// Stegen som gäller just nu: motivering och nedbrytning bara när du har
// svarat att R inte är i 3NF, och nedbrytning aldrig i uppgift 10.
export function stepsFor(item, draft) {
  const below3 = draft.nf && draft.nf !== "3NF";
  return ["draw", "ck", "roles", "nf", ...(below3 ? ["motivation"] : []), ...(below3 && !item.nfOnly ? ["decomposition"] : [])];
}

const hasCk = (d) => (d.cks || []).some((k) => k.length);
const hasRoles = (d) => Object.values(d.roles || {}).some(Boolean);
const filled = {
  draw: () => false,
  ck: hasCk,
  roles: hasRoles,
  nf: (d) => Boolean(d.nf),
  motivation: (d) => Boolean(d.motivation?.option && d.motivation?.attr && d.motivation?.type),
  decomposition: (d) => Boolean((d.text || "").trim()),
};

// Gamla utkast ({ cks, roles, nf, motivation, text }) får steginformation:
// ett steg med innehåll räknas som klart, ritsteget som klart om något
// senare steg är det, och det öppna steget blir det första ofärdiga.
export function migrateDraft(raw, item) {
  if (!raw || typeof raw !== "object") return emptyDraft();
  if (raw.v === 2) return { ...emptyDraft(), ...raw };
  const d = { ...emptyDraft(), cks: raw.cks?.length ? raw.cks : [[]], roles: raw.roles || {}, nf: raw.nf ?? null, motivation: raw.motivation || {}, text: raw.text || "" };
  const steps = stepsFor(item, d);
  const done = {};
  for (const s of steps) if (filled[s](d)) done[s] = true;
  if (steps.some((s) => s !== "draw" && done[s])) done.draw = true;
  d.done = done;
  d.rolesEdited = hasRoles(d);
  d.step = steps.find((s) => !done[s]) || "summary";
  return d;
}

// PA/NP förifyllt ur dina egna kandidatnycklar.
export function prefillRoles(R, cks) {
  return Object.fromEntries(attrsOf(R).map((a) => [a, cks.some((k) => has(k, a)) ? "PA" : "NP"]));
}

// Typen föreslås ur dina kandidatnycklar: äkta delmängd av en av dem →
// partial, annars transitive (om vänsterledet inte är superkey).
export function suggestType(lhs, userCks, R, F) {
  const keys = userCks.filter((k) => k.length);
  if (keys.some((k) => properSubset(lhs, k))) return "partial";
  if (isSuperkey(lhs, R, F)) return null;
  return "transitive";
}

// En ritad pil (vänsterled + attribut) som val i motiveringen: det givna
// beroende den motsvarar, annars ett härlett alternativ, annars null.
export function optionForPair(item, pair) {
  const options = motivationOptions(item);
  const given = options.find((o) => !o.derived && sameSet(o.fd.lhs, pair.lhs) && has(o.fd.rhs, pair.attr) && !has(o.fd.lhs, pair.attr));
  if (given) return given;
  return options.find((o) => o.derived && sameSet(o.fd.lhs, pair.lhs) && has(o.fd.rhs, pair.attr)) || null;
}

const roleText = (R, roles) => {
  const pa = attrsOf(R).filter((a) => roles[a] === "PA");
  const np = attrsOf(R).filter((a) => roles[a] === "NP");
  return `PA: ${pa.join(", ") || "–"} · NP: ${np.join(", ") || "–"}`;
};

// Det komprimerade svaret för ett avslutat steg.
export function stepSummary(step, item, draft, drawing) {
  switch (step) {
    case "draw": {
      const n = drawing?.arrows?.length || 0;
      return n ? `${n} ${n === 1 ? "pil" : "pilar"} ritade` : "Hoppade över ritningen";
    }
    case "ck": {
      const keys = (draft.cks || []).filter((k) => k.length);
      return keys.length ? keys.map(braceText).join(", ") : "Ingen angiven";
    }
    case "roles":
      return roleText(item.attrs, draft.roles || {});
    case "nf":
      return draft.nf || "Inte vald";
    case "motivation": {
      const m = draft.motivation || {};
      const o = motivationOptions(item).find((x) => x.value === m.option);
      return o && m.attr ? `${setText(o.fd.lhs)} → ${m.attr}, ${m.type || "typ saknas"}` : "Inte vald";
    }
    case "decomposition": {
      const n = (draft.text || "").split("\n").filter((l) => /\(/.test(l)).length;
      return n ? `${n} ${n === 1 ? "relation" : "relationer"}` : "Inte skriven";
    }
    default:
      return "";
  }
}

// Nästa ofärdiga steg efter `step` (räknat som klart), annars ett tidigare
// ofärdigt, annars sammanfattningen.
export function nextStep(item, draft, step) {
  const steps = stepsFor(item, draft);
  const done = { ...draft.done, [step]: true };
  const i = steps.indexOf(step);
  return steps.slice(i + 1).find((s) => !done[s]) || steps.find((s) => !done[s]) || "summary";
}

// Nästa uppgift i listan som inte är klar (runt hela listan), annars nästa.
export function nextItemId(items, currentId, progress) {
  const i = items.findIndex((e) => e.id === currentId);
  for (let k = 1; k <= items.length; k++) {
    const e = items[(i + k) % items.length];
    if (!progress[e.id]) return e.id;
  }
  return items[(i + 1) % items.length].id;
}

