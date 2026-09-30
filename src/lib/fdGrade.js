// Rättningen av svarspanelen i Björns ordning: kandidatnycklar, prime och
// non-prime, högsta normalform, motivering och — för uppgift 11–13 och de
// egna — nedbrytningen. Varje fält rättas för sig och får ett "varför" som
// pekar på höljet som visar det. Nedbrytningen rättas som förut mot facit
// (lib/normalize.js); lossless join och beroendebevarande för din egen
// nedbrytning prövas här med FD-motorn och förklaras, men avgör inte.
import {
  attrsOf, setText, braceText, closure, isSuperkey, allCandidateKeys, highestNF, NF_NAME, sameSet, has, properSubset,
  losslessSteps, dependencyReport, relationNF, toFds, fdText,
} from "./fd.js";
import { checkNormalization } from "./normalize.js";
import { parseSchema } from "./modelCheck.js";

const closureText = (X, F, R) => {
  const c = closure(X, F);
  return `${braceText(X)}⁺ = ${braceText(attrsOf(R).filter((a) => has(c, a)))}`;
};

// Varför en mängd är (eller inte är) en kandidatnyckel.
export function explainKey(X, R, F) {
  const attrs = attrsOf(R);
  const c = closure(X, F);
  const missing = attrs.filter((a) => !has(c, a));
  if (missing.length) return `${closureText(X, F, R)} når inte ${missing.join(", ")}, så ${setText(X)} är ingen superkey.`;
  const smaller = allCandidateKeys(attrs, F).filter((k) => properSubset(k, X));
  if (smaller.length) return `${setText(X)} är superkey men inte minimal: redan ${closureText(smaller[0], F, R)} når alla attribut.`;
  const parts = X.length > 1 ? ` och ingen mindre del räcker (${X.map((a) => closureText(X.filter((b) => b !== a), F, R)).join(", ")})` : "";
  return `${closureText(X, F, R)} når alla attribut${parts}.`;
}

// Typ och formulering för en motivering, med kursens engelska termer.
export function motivationText(violation, cks) {
  const { type, attr, via } = violation;
  if (type === "partial") {
    const ck = cks.find((k) => properSubset(via, k));
    return `Non-prime attribute ${attr} is functionally dependent on proper subset ${setText(via)} of candidate key ${ck ? braceText(ck) : "{…}"}.`;
  }
  const ck = cks[0];
  return `Non-prime attribute ${attr} is transitively dependent on candidate key ${ck ? braceText(ck) : "{…}"} via ${setText(via)}.`;
}

// Valbara beroenden i motiveringen: de givna, och ett härlett partiellt
// beroende bara när inget givet visar 2NF-brottet.
export function motivationOptions(item) {
  const fds = toFds(item.fds);
  const options = fds.map((fd) => ({ value: `g${fd.index}`, fd, label: fd.text || fdText(fd), derived: false }));
  const { violations } = highestNF(item.attrs, item.fds);
  violations.filter((v) => v.derived).forEach((v, i) => options.push({ value: `d${i}`, fd: v.fd, label: `${setText(v.via)} → ${v.attr} (härlett)`, derived: true, violation: v }));
  return options;
}

// Varför ett valt beroende (inte) förklarar normalformen.
function whyChoice(option, attr, type, analysis, R, F) {
  if (!option || !attr) return "Välj ett beroende och det attribut det bestämmer.";
  const lhs = option.fd.lhs;
  if (analysis.prime.includes(attr)) return `${attr} är ett primärattribut (med i ${analysis.cks.filter((k) => has(k, attr)).map(braceText).join(", ")}); 2NF och 3NF handlar bara om icke-primärattribut.`;
  if (has(lhs, attr)) return `${setText(lhs)} → ${attr} är trivialt.`;
  const ck = analysis.cks.find((k) => properSubset(lhs, k));
  if (ck) return type === "partial" ? null : `${setText(lhs)} är en äkta delmängd av kandidatnyckeln ${braceText(ck)}, så beroendet är partiellt, inte transitivt.`;
  if (isSuperkey(lhs, R, F)) return `${closureText(lhs, F, R)} når alla attribut: ${setText(lhs)} är superkey, så ${attr} beror direkt på en nyckel.`;
  return type === "transitive" ? null : `${setText(lhs)} är ingen äkta delmängd av någon kandidatnyckel, och ${closureText(lhs, F, R)} når inte alla attribut: beroendet är transitivt, inte partiellt.`;
}

// Egenskaperna hos din nedbrytning: attribut som saknas, varje relations
// normalform, lossless join och beroendebevarande, med förklaring.
export function decompositionProperties(item, text) {
  const R = attrsOf(item.attrs);
  const F = item.fds;
  const schema = parseSchema(text || "");
  if (!schema.relations.length) return null;
  const canon = (a) => R.find((x) => x.toLowerCase() === String(a).trim().toLowerCase()) || a;
  const parts = schema.relations.map((r) => ({ name: r.name, attrs: r.attrs.map(canon) }));
  const unknown = [...new Set(parts.flatMap((p) => p.attrs).filter((a) => !has(R, a)))];
  const missingAttrs = R.filter((a) => !parts.some((p) => has(p.attrs, a)));
  const decomposition = parts.map((p) => p.attrs.filter((a) => has(R, a)));
  const relations = parts.map((p, i) => ({ name: p.name, attrs: decomposition[i], nf: relationNF(decomposition[i], F).nf }));
  const loss = losslessSteps(R, F, decomposition);
  const name = (idx) => idx.map((i) => parts[i].name).join(" ⋈ ");
  const lossText = loss.lossless
    ? loss.byPairs
      ? loss.steps.map((s) => `${name(s.left.names)} och ${name(s.right.names)} delar ${braceText(s.common)}, och ${closureText(s.common, F, R)} täcker ${s.covers === "right" ? name(s.right.names) : name(s.left.names)}.`)
      : ["Joinen ger tillbaka R (tablåprovet), men inte två delar i taget."]
    : loss.stuck
      ? [`Två i taget fastnar: ${loss.stuck.map((p) => `${name(p.names)} (${p.attrs.join(", ")})`).join(" och ")} har inga gemensamma attribut som bestämmer någon av dem.`]
      : ["Joinen ger inte tillbaka R."];
  const report = dependencyReport(R, F, decomposition);
  const depText = report.map((r) => {
    const t = r.fd.text || fdText(r.fd);
    if (r.direct !== null) return { ok: true, text: `${t}: bevarat, står i ${parts[r.direct].name}.` };
    if (r.preserved) return { ok: true, text: `${t}: bevarat via flera relationer — med de lokala beroendena når ${setText(r.fd.lhs)} ${braceText(r.reach)}.` };
    return { ok: false, text: `${t}: förlorat — med de lokala beroendena når ${setText(r.fd.lhs)} bara ${braceText(r.reach)}, inte ${r.missing.join(", ")}.` };
  });
  return {
    relations,
    unknown,
    missingAttrs,
    lossless: loss.lossless && missingAttrs.length === 0,
    lossText,
    preserving: report.every((r) => r.preserved),
    depText,
  };
}

// answer: { cks: [[attr]], roles: { A: "PA" | "NP" }, nf: "1NF" | "2NF" | "3NF",
//           motivation: { option, attr, type, text }, text }
export function gradeAnswer(item, answer) {
  const R = attrsOf(item.attrs);
  const F = item.fds;
  const analysis = highestNF(R, F);
  const expectedNf = NF_NAME[analysis.nf];
  const fields = {};

  // Kandidatnycklar, som mängd av mängder.
  const given = (answer.cks || []).map((k) => R.filter((a) => has(k, a))).filter((k) => k.length);
  const missing = analysis.cks.filter((k) => !given.some((g) => sameSet(g, k)));
  const extra = given.filter((g) => !analysis.cks.some((k) => sameSet(g, k)));
  fields.ck = {
    ok: given.length > 0 && !missing.length && !extra.length,
    expected: analysis.cks,
    given,
    notes: [
      ...extra.map((k) => ({ ok: false, text: `${braceText(k)}: ${explainKey(k, R, F)}` })),
      ...missing.map((k) => ({ ok: false, text: `${braceText(k)} saknas: ${explainKey(k, R, F)}` })),
      ...given.filter((g) => !extra.includes(g)).map((k) => ({ ok: true, text: `${braceText(k)}: ${explainKey(k, R, F)}` })),
    ],
  };

  // Prime och non-prime, per attribut.
  const roles = answer.roles || {};
  const perAttr = R.map((a) => {
    const expected = analysis.prime.includes(a) ? "PA" : "NP";
    const ok = roles[a] === expected;
    const keysWith = analysis.cks.filter((k) => has(k, a));
    const why = expected === "PA" ? `${a} är med i kandidatnyckeln ${braceText(keysWith[0])}.` : `${a} är inte med i någon kandidatnyckel (${analysis.cks.map(braceText).join(", ")}).`;
    return { attr: a, expected, given: roles[a] || null, ok, why };
  });
  fields.roles = { ok: perAttr.every((p) => p.ok), perAttr };

  // Högsta normalform.
  const nfOk = answer.nf === expectedNf;
  const partial = analysis.violations.find((v) => v.type === "partial");
  const transitive = analysis.violations.find((v) => v.type === "transitive");
  let nfWhy;
  if (analysis.nf === 1) nfWhy = `2NF bryts: ${setText(partial.via)} är en äkta delmängd av kandidatnyckeln ${braceText(partial.ck)}, och ${closureText(partial.via, F, R)} innehåller icke-primärattributet ${partial.attr}.`;
  else if (analysis.nf === 2) {
    const composite = analysis.cks.some((k) => k.length > 1);
    nfWhy = `${composite ? "Ingen äkta delmängd av en kandidatnyckel bestämmer ett icke-primärattribut" : "Alla kandidatnycklar är enkla, så 2NF kan inte brytas"}; men 3NF bryts: ${setText(transitive.via)} är ingen superkey (${closureText(transitive.via, F, R)}) och bestämmer icke-primärattributet ${transitive.attr}, så ${transitive.attr} är transitivt beroende av ${braceText(transitive.ck)}.`;
  } else {
    nfWhy = analysis.nonPrime.length === 0
      ? `Alla attribut är primärattribut, så inget icke-primärattribut kan bero partiellt eller transitivt.`
      : `Varje beroende med ett icke-primärattribut (${analysis.nonPrime.join(", ")}) till höger har en superkey som vänsterled.`;
  }
  fields.nf = { ok: nfOk, expected: expectedNf, given: answer.nf || null, why: nfWhy };

  // Motivering: rättas på valet (beroende + attribut + typ), inte på texten.
  const needType = analysis.nf === 1 ? "partial" : analysis.nf === 2 ? "transitive" : null;
  if (needType) {
    const m = answer.motivation || {};
    const options = motivationOptions(item);
    const option = options.find((o) => o.value === m.option);
    const accepted = analysis.violations.filter((v) => v.type === needType);
    const matches = (v) => option && m.attr && v.attr === m.attr && (option.derived ? v.derived && sameSet(v.via, option.fd.lhs) : v.index === option.fd.index);
    const ok = Boolean(option && m.type === needType && accepted.some(matches));
    let why = null;
    if (!ok) {
      const name = { partial: "partiellt", transitive: "transitivt" };
      if (!option || !m.attr || !m.type) why = "Välj beroendet, attributet och typen.";
      else why = whyChoice(option, m.attr, m.type, analysis, R, F)
        || `${setText(option.fd.lhs)} → ${m.attr} är ${name[m.type]}, men högsta normalform är ${expectedNf}, så motiveringen ska visa ett ${name[needType]} beroende (${needType === "partial" ? "2NF bryts redan" : "2NF håller"}).`;
    }
    fields.motivation = {
      ok,
      needType,
      why,
      accepted: accepted.map((v) => ({ text: `${setText(v.via)} → ${v.attr}`, sentence: motivationText(v, analysis.cks), derived: v.derived })),
    };
  }

  // Nedbrytningen.
  const decomposes = !item.nfOnly && (expectedNf !== "3NF" || (answer.nf && answer.nf !== "3NF" && (answer.text || "").trim()));
  if (decomposes) {
    const nfForCheck = expectedNf === "3NF" ? answer.nf : expectedNf;
    const result = checkNormalization(item, { nf: nfForCheck, text: answer.text || "" });
    const ok = expectedNf !== "3NF" && result.status === "correct";
    fields.decomposition = { ok, result, properties: decompositionProperties(item, answer.text) };
  }

  const required = ["ck", "roles", "nf", ...(fields.motivation ? ["motivation"] : []), ...(fields.decomposition ? ["decomposition"] : [])];
  const okCount = required.filter((k) => fields[k].ok).length;
  const status = okCount === required.length ? "correct" : okCount === 0 ? "wrong" : "partial";
  return { status, fields, required, analysis, expectedNf };
}

