// Normaliseringssteget i modellverkstaden: häftets uppgift 11–13, tentans
// 3f och 3g. En relation R med funktionella beroenden; svaret är högsta
// normalform och, om R inte redan är i 3NF, en uppdelning i relationer med
// primärnyckel (inga främmande nycklar). Uppdelningen rättas med samma
// rättare som ER-uppgifterna (lib/modelCheck.js), som mängder.
//
// Här finns också en liten motor för funktionella beroenden: hölje,
// kandidatnycklar, högsta normalform med kapitel 8:s motivering, projicerade
// beroenden, lossless join (två i taget) och beroendebevarande. Den används
// för att härleda motiveringarna och för att kontrollera facit i testsviten
// — inte för att godkänna andra nedbrytningar än facits.
import { norm, parseSchema, checkModel } from "./modelCheck.js";

export const attrsOf = (s) => String(s).split(",").map((x) => x.trim()).filter(Boolean);
const eq = (a, b) => norm(a) === norm(b);
const has = (set, a) => set.some((x) => eq(x, a));
const subset = (a, b) => a.every((x) => has(b, x));
const properSubset = (a, b) => subset(a, b) && a.length < b.length;
const sameSet = (a, b) => subset(a, b) && subset(b, a);
const uniq = (list) => list.filter((x, i) => list.findIndex((y) => eq(x, y)) === i);
export const setText = (list) => (list.length === 1 ? list[0] : `{${list.join(", ")}}`);

// "{A, B} → C", "A -> {B, C}"
export function parseFd(text) {
  const m = /^\s*\{?([^{}→>-]+)\}?\s*(?:→|->)\s*\{?([^{}]+)\}?\s*$/.exec(text);
  if (!m) throw new Error(`Kunde inte tolka beroendet "${text}".`);
  return { lhs: attrsOf(m[1]), rhs: attrsOf(m[2]), text: text.trim() };
}
export const fdText = (fd) => `${setText(fd.lhs)} → ${setText(fd.rhs)}`;

export function closure(X, fds) {
  let result = [...X];
  let grew = true;
  while (grew) {
    grew = false;
    for (const fd of fds) {
      if (subset(fd.lhs, result)) {
        for (const a of fd.rhs) if (!has(result, a)) { result.push(a); grew = true; }
      }
    }
  }
  return result;
}
const isSuperkey = (X, attrs, fds) => subset(attrs, closure(X, fds));

function subsetsBySize(attrs) {
  const out = [];
  const n = attrs.length;
  for (let mask = 1; mask < 1 << n; mask++) out.push(attrs.filter((_, i) => mask & (1 << i)));
  out.sort((a, b) => a.length - b.length);
  return out;
}

// Alla minimala superkeys, i attributens ordning.
export function candidateKeys(attrs, fds) {
  const keys = [];
  for (const X of subsetsBySize(attrs)) {
    if (keys.some((k) => subset(k, X))) continue;
    if (isSuperkey(X, attrs, fds)) keys.push(X);
  }
  return keys;
}

// Högsta normalform med kapitel 8:s motivering. Partiellt beroende söks via
// höljet av varje äkta delmängd av en kandidatnyckel, transitivt via de
// givna beroendena med icke-nyckel som vänsterled.
export function analyze(attrsText, fdTexts) {
  const attrs = attrsOf(attrsText);
  const fds = fdTexts.map(parseFd);
  const cks = candidateKeys(attrs, fds);
  const prime = uniq(cks.flat());
  const nonPrime = attrs.filter((a) => !has(prime, a));
  const ckList = cks.map(setText).join(", ");

  let partial = null;
  for (const ck of cks) {
    if (partial) break;
    for (const X of subsetsBySize(ck)) {
      if (X.length === ck.length) continue;
      const gained = closure(X, fds).filter((a) => !has(X, a) && has(nonPrime, a));
      if (gained.length) { partial = { X, ck, attr: gained[0] }; break; }
    }
  }
  let transitive = null;
  if (!partial) {
    for (const fd of fds) {
      const a = fd.rhs.find((x) => !has(fd.lhs, x) && has(nonPrime, x));
      if (a && !isSuperkey(fd.lhs, attrs, fds)) { transitive = { X: fd.lhs, attr: a, ck: cks[0] }; break; }
    }
  }

  const nf = partial ? "1NF" : transitive ? "2NF" : "3NF";
  const compositeCk = cks.some((k) => k.length > 1);
  const why2 = compositeCk
    ? "ingen äkta delmängd av en kandidatnyckel bestämmer ett icke-primärattribut"
    : `kandidatnyckeln ${ckList} är enkel, så inget partiellt beroende kan finnas`;
  const reasons = {};
  if (partial) reasons["1NF"] = `äkta delmängden ${setText(partial.X)} av kandidatnyckeln ${setText(partial.ck)} bestämmer funktionellt icke-primärattributet ${partial.attr}`;
  if (transitive) reasons["2NF"] = `${why2}, men icke-primärattributet ${transitive.attr} är transitivt beroende av kandidatnyckeln ${setText(transitive.ck)} (${setText(transitive.X)} → ${transitive.attr}, och ${setText(transitive.X)} är ingen kandidatnyckel)`;
  if (nf === "3NF") {
    reasons["3NF"] = nonPrime.length === 0
      ? `alla attribut är primärattribut (kandidatnycklar: ${ckList}), så inget icke-primärattribut kan bero partiellt eller transitivt`
      : `varje beroende har en kandidatnyckel som vänsterled eller bara primärattribut till höger (kandidatnycklar: ${ckList}; icke-primärattribut: ${nonPrime.join(", ")})`;
  }
  return { attrs, fds, cks, prime, nonPrime, nf, reasons, ckList };
}

// Beroendena som gäller inom en delrelation: höljet av varje delmängd,
// skuret mot relationens attribut.
export function projectFds(relAttrs, fds) {
  const out = [];
  for (const X of subsetsBySize(relAttrs)) {
    const Y = closure(X, fds).filter((a) => has(relAttrs, a) && !has(X, a));
    if (Y.length) out.push({ lhs: X, rhs: Y });
  }
  return out;
}

// Lossless join enligt kursbokens regel, två i taget: två relationer får
// slås ihop om de gemensamma attributen är superkey i minst en av dem.
export function isLossless(relationAttrs, fds) {
  let parts = relationAttrs.map((r) => [...r]);
  while (parts.length > 1) {
    let merged = false;
    outer: for (let i = 0; i < parts.length; i++) {
      for (let j = i + 1; j < parts.length; j++) {
        const common = parts[i].filter((a) => has(parts[j], a));
        if (!common.length) continue;
        const c = closure(common, fds);
        if (subset(parts[i], c) || subset(parts[j], c)) {
          const union = uniq([...parts[i], ...parts[j]]);
          parts = parts.filter((_, k) => k !== i && k !== j);
          parts.push(union);
          merged = true;
          break outer;
        }
      }
    }
    if (!merged) return false;
  }
  return true;
}

export function preservesDependencies(relationAttrs, fds) {
  const projected = relationAttrs.flatMap((r) => projectFds(r, fds));
  return fds.every((fd) => subset(fd.rhs, closure(fd.lhs, projected)));
}

export function relationIn3NF(relAttrs, fds) {
  const local = projectFds(relAttrs, fds);
  return analyze(relAttrs.join(", "), local.map(fdText)).nf === "3NF";
}

// ---------- Facit ----------

// Facit skrivs kompakt: relationer med attribut och PK-alternativ (häftets
// understrykningar i `pk`, härledda alternativ i `pkAlso`), samt eventuella
// hela alternativa nedbrytningar i `variants`. Här vecklas det ut till
// Fö5-notation, en text per kombination.
function relationTexts(rel) {
  const pks = [...(rel.pk || []), ...(rel.pkAlso || [])];
  return pks.map((pk) => `${rel.name}(${rel.attrs})\nPK = {${pk}}`);
}
function combos(lists) {
  return lists.reduce((acc, list) => acc.flatMap((prefix) => list.map((x) => [...prefix, x])), [[]]);
}
export function facitVariants(item) {
  if (!item.facit) return [];
  const decompositions = [item.facit, ...(item.variants || [])];
  return decompositions.flatMap((rels) => combos(rels.map(relationTexts)).map((parts) => parts.join("\n\n")));
}

// Regeltagg och "varför" per facitrelation, härledda ur R:s beroenden.
export function facitRules(item, analysis) {
  const { cks, attrs, fds } = analysis;
  const rules = {};
  for (const rel of [...item.facit, ...(item.variants || []).flat()]) {
    const relAttrs = attrsOf(rel.attrs);
    const X = attrsOf(rel.pk[0]);
    const Y = relAttrs.filter((a) => !has(X, a));
    let rule, why;
    if (Y.length === 0) {
      rule = "Nyckelrelation";
      why = `Kandidatnyckeln ${setText(X)} måste stå i en egen relation: inget beroende bestämmer alla attribut i R, och utan den går lossless join förlorad.`;
    } else if (cks.some((ck) => properSubset(X, ck))) {
      const ck = cks.find((k) => properSubset(X, k));
      rule = "Partiellt beroende";
      why = `${setText(X)} → ${setText(Y)} är partiellt: ${setText(X)} är en äkta delmängd av kandidatnyckeln ${setText(ck)} och ${Y.join(", ")} är icke-primära. Bryts ut med ${setText(X)} som primärnyckel.`;
    } else if (isSuperkey(X, attrs, fds)) {
      rule = "Kandidatnyckeln";
      const keyAttrs = Y.filter((a) => cks.some((k) => k.length === 1 && eq(k[0], a)));
      why = `${setText(X)} är kandidatnyckel; relationen behåller det som bestäms av kandidatnycklarna: ${Y.join(", ")}.`
        + (keyAttrs.length ? ` ${keyAttrs.join(" och ")} är ${keyAttrs.length > 1 ? "själva" : "själv"} kandidatnyckel, så det som beror på ${keyAttrs.join(" och ")} är inget transitivt beroende och ska inte brytas ut.` : "");
    } else {
      rule = "Transitivt beroende";
      why = `${setText(X)} → ${setText(Y)} är transitivt: ${setText(X)} är ingen kandidatnyckel i R. Bryts ut med ${setText(X)} som primärnyckel.`;
    }
    rules[norm(rel.name)] = { rule, why };
  }
  return rules;
}

// ---------- Rättning ----------

export const NF_LABELS = { "1NF": "R är i 1NF", "2NF": "R är i 2NF", "3NF": "R är redan i 3NF" };

function nfMessage(analysis, given) {
  const { nf, reasons } = analysis;
  if (given === nf) return null;
  if (nf === "3NF") return `R är redan i 3NF: ${reasons["3NF"]}. Att dela upp den är övernormalisering.`;
  if (given === "3NF") return `R är inte i 3NF utan i ${nf}: ${reasons[nf]}.`;
  return `Högsta normalform är ${nf}, inte ${given}: ${reasons[nf]}.`;
}

// answer: { nf: "1NF" | "2NF" | "3NF", text }
export function checkNormalization(item, answer) {
  const analysis = analyze(item.attrs, item.fds);
  const expectedNf = analysis.nf;
  const given = answer.nf ?? null;
  const nfOk = given === expectedNf;
  const nf = { expected: expectedNf, given, ok: nfOk, message: nfMessage(analysis, given) };

  if (expectedNf === "3NF") {
    if (given === "3NF") return { status: "correct", nf, relations: [], extra: [], remarks: [], variant: 0, facit: null, analysis };
    const parsed = parseSchema(answer.text);
    if (parsed.errors.length && (answer.text || "").trim()) return { status: "parse-error", errors: parsed.errors, nf, analysis };
    const extra = parsed.relations.map((r) => ({
      name: r.name, attrs: r.attrs,
      message: `Övernormalisering: ${r.name}(${r.attrs.join(", ")}) bryter ut något ur en relation som redan är i 3NF.`,
    }));
    return { status: "wrong", nf, relations: [], extra, remarks: [], variant: 0, facit: null, analysis, overNormalized: true };
  }

  if (given === "3NF") {
    const variants = facitVariants(item);
    return { status: "wrong", nf, relations: parseSchema(variants[0]).relations.map((r) => ({ name: r.name, answerName: null, status: "missing", problems: [], notes: [], rule: facitRules(item, analysis)[norm(r.name)], expected: r })), extra: [], remarks: [], variant: 0, facit: parseSchema(variants[0]), analysis };
  }

  const variants = facitVariants(item);
  const rules = facitRules(item, analysis);
  const result = checkModel(answer.text, variants, rules, { ignoreNames: true });
  if (result.status === "parse-error") return { ...result, nf, analysis, variant: 0, facit: parseSchema(variants[0]) };
  const facit = parseSchema(variants[result.variant]);

  // Extra relationer: övernormalisering om attributen redan ryms i en
  // facitrelation, annars bara "finns inte i facit".
  const extra = result.extra.map((name) => {
    const rel = result.answer.relations.find((r) => eq(r.name, name));
    const attrs = rel?.attrs ?? [];
    const home = facit.relations.find((f) => subset(attrs, f.attrs));
    let message;
    if (home) {
      message = `Övernormalisering: ${name}(${attrs.join(", ")}) bryter ut något som redan är i 3NF inne i ${home.name}(${home.attrs.join(", ")}).`;
      const pk = rel?.pk ?? [];
      if (pk.length && analysis.cks.some((k) => sameSet(k, pk))) {
        message += ` ${setText(pk)} är en kandidatnyckel i R, så det som beror på ${setText(pk)} är inget transitivt beroende.`;
      }
    } else {
      message = `${name}(${attrs.join(", ")}) finns inte i facit.`;
    }
    return { name, attrs, message };
  });

  const decompositionOk = result.status === "correct";
  let status;
  if (decompositionOk && nfOk) status = "correct";
  else if (result.status === "wrong" && !nfOk) status = "wrong";
  else status = "partial";
  const overNormalized = extra.some((e) => e.message.startsWith("Övernormalisering"));
  return { ...result, status, nf, extra, facit, analysis, overNormalized };
}
