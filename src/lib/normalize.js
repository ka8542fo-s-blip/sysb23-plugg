// Normaliseringssteget i modellverkstaden: häftets uppgift 11–13, tentans
// 3f och 3g. En relation R med funktionella beroenden; svaret är högsta
// normalform och, om R inte redan är i 3NF, en uppdelning i relationer med
// primärnyckel (inga främmande nycklar). Uppdelningen rättas med samma
// rättare som ER-uppgifterna (lib/modelCheck.js), som mängder.
//
// FD-motorn ligger i lib/fd.js (hölje, alla kandidatnycklar, högsta
// normalform med brytande beroenden, lossless join, beroendebevarande).
// Här byggs kapitel 8:s motiveringstexter ovanpå den, och den används för
// att kontrollera facit — inte för att godkänna andra nedbrytningar än
// facits.
import { norm, parseSchema, checkModel } from "./modelCheck.js";
import { attrsOf, setText, parseFd, fdText, closure, isSuperkey, allCandidateKeys, highestNF, projectFds, NF_NAME, properSubset, subset, sameSet, has } from "./fd.js";

export { attrsOf, setText, parseFd, fdText, closure };
export const candidateKeys = allCandidateKeys;
const eq = (a, b) => norm(a) === norm(b);

// Högsta normalform med kapitel 8:s motivering, formulerad ur det första
// brytande beroendet i uppgiften.
export function analyze(attrsText, fdTexts) {
  const attrs = attrsOf(attrsText);
  const fds = fdTexts.map((f) => (typeof f === "string" ? parseFd(f) : f));
  const { nf: level, cks, prime, nonPrime, violations } = highestNF(attrs, fds);
  const ckList = cks.map(setText).join(", ");
  const partial = violations.find((v) => v.type === "partial");
  const transitive = level === 2 ? violations.find((v) => v.type === "transitive") : null;

  const nf = NF_NAME[level];
  const compositeCk = cks.some((k) => k.length > 1);
  const why2 = compositeCk
    ? "ingen äkta delmängd av en kandidatnyckel bestämmer ett icke-primärattribut"
    : `kandidatnyckeln ${ckList} är enkel, så inget partiellt beroende kan finnas`;
  const reasons = {};
  if (level === 1) reasons["1NF"] = `äkta delmängden ${setText(partial.via)} av kandidatnyckeln ${setText(partial.ck)} bestämmer funktionellt icke-primärattributet ${partial.attr}`;
  if (transitive) reasons["2NF"] = `${why2}, men icke-primärattributet ${transitive.attr} är transitivt beroende av kandidatnyckeln ${setText(transitive.ck)} (${setText(transitive.via)} → ${transitive.attr}, och ${setText(transitive.via)} är ingen kandidatnyckel)`;
  if (nf === "3NF") {
    reasons["3NF"] = nonPrime.length === 0
      ? `alla attribut är primärattribut (kandidatnycklar: ${ckList}), så inget icke-primärattribut kan bero partiellt eller transitivt`
      : `varje beroende har en kandidatnyckel som vänsterled eller bara primärattribut till höger (kandidatnycklar: ${ckList}; icke-primärattribut: ${nonPrime.join(", ")})`;
  }
  return { attrs, fds, cks, prime, nonPrime, nf, reasons, ckList, violations };
}

export function relationIn3NF(relAttrs, fds) {
  return highestNF(relAttrs, projectFds(relAttrs, fds)).nf === 3;
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
