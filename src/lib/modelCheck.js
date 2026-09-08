// Modellverkstadens rättare: tolkar relationsscheman i Fö5:s notation och
// jämför svar mot facit som mängder — aldrig som text.
//
//   CAR(LicenseNumber, Brand, Speed, OwnerName)
//   PK = {LicenseNumber}
//   FK1: (OwnerName) REF PERSON(Name)
//
// Skiftläge, blanksteg och understreck i namn spelar ingen roll. CKn-rader
// får finnas och ignoreras vid rättning (PK = CK1 slås upp). Ett svar kan
// också vara "R är redan i 3NF" (normaliseringssteget), skrivet som en rad
// med bara 3NF.
//
// Rättningen: relationer matchas på namn, annars på överlapp mellan
// icke-FK-attribut. FK-attribut jämförs på vad de refererar, PK som en
// mängd där FK-attribut identifieras via sitt mål. Avvikande namn på en
// relation eller på ett FK-attribut är en anmärkning, inte ett fel.

export const norm = (s) => String(s ?? "").toLowerCase().replace(/[\s_]+/g, "");

const RELATION_RE = /^([A-Za-zÅÄÖåäö][\wÅÄÖåäö ]*?)\s*\(([^()]*)\)\s*$/;
const PK_RE = /^PK\s*=\s*(.+)$/i;
const CK_RE = /^CK\s*(\d*)\s*=\s*\{([^}]*)\}\s*$/i;
const FK_RE = /^FK\s*(\d*)\s*:\s*\(([^()]*)\)\s*REF\s+([A-Za-zÅÄÖåäö][\wÅÄÖåäö ]*?)\s*\(([^()]*)\)\s*$/i;
const NF3_RE = /^(R\s+(är|is)\s+(redan\s+|already\s+)?(i|in)\s+)?3NF\.?$/i;

const splitList = (s) => s.split(",").map((x) => x.trim()).filter(Boolean);

// Tolka text till { relations, errors, already3NF }. Fel bär radnummer och
// ett begripligt meddelande.
export function parseSchema(text) {
  const relations = [];
  const errors = [];
  let current = null;
  let already3NF = false;
  const lines = String(text ?? "").split("\n");

  lines.forEach((raw, index) => {
    const line = raw.replace(/--.*$/, "").trim();
    const no = index + 1;
    if (!line) return;
    if (NF3_RE.test(line)) { already3NF = true; return; }

    let m;
    if ((m = RELATION_RE.exec(line)) && !/^(PK|CK|FK)\b/i.test(line)) {
      const attrs = splitList(m[2]);
      if (attrs.length === 0) { errors.push({ line: no, message: `Rad ${no}: relationen ${m[1].trim()} har inga attribut inom parentesen.` }); return; }
      const dup = attrs.find((a, i) => attrs.findIndex((b) => norm(b) === norm(a)) !== i);
      if (dup) { errors.push({ line: no, message: `Rad ${no}: attributet ${dup} står två gånger i ${m[1].trim()}.` }); return; }
      current = { name: m[1].trim(), attrs, pk: [], cks: {}, fks: [], line: no };
      relations.push(current);
      return;
    }
    if (!current) {
      errors.push({ line: no, message: `Rad ${no}: väntade en relationsrad som NAMN(attr1, attr2) före PK- och FK-rader.` });
      return;
    }
    if ((m = CK_RE.exec(line))) {
      current.cks[m[1] || "1"] = splitList(m[2]);
      return;
    }
    if ((m = PK_RE.exec(line))) {
      const rhs = m[1].trim();
      const ck = /^CK\s*(\d*)$/i.exec(rhs);
      let pk;
      if (ck) {
        pk = current.cks[ck[1] || "1"];
        if (!pk) { errors.push({ line: no, message: `Rad ${no}: PK = ${rhs} men ingen ${rhs.toUpperCase()}-rad finns ovanför.` }); return; }
      } else {
        const braces = /^\{([^}]*)\}$/.exec(rhs);
        pk = splitList(braces ? braces[1] : rhs);
      }
      const unknown = pk.find((a) => !current.attrs.some((b) => norm(b) === norm(a)));
      if (unknown) { errors.push({ line: no, message: `Rad ${no}: ${unknown} i PK finns inte bland attributen i ${current.name}.` }); return; }
      if (pk.length === 0) { errors.push({ line: no, message: `Rad ${no}: PK är tom — skriv PK = {attribut}.` }); return; }
      current.pk = pk;
      return;
    }
    if ((m = FK_RE.exec(line))) {
      const cols = splitList(m[2]);
      const targetCols = splitList(m[4]);
      const unknown = cols.find((a) => !current.attrs.some((b) => norm(b) === norm(a)));
      if (unknown) { errors.push({ line: no, message: `Rad ${no}: ${unknown} i FK finns inte bland attributen i ${current.name}.` }); return; }
      if (cols.length !== targetCols.length) { errors.push({ line: no, message: `Rad ${no}: FK har ${cols.length} attribut före REF men ${targetCols.length} efter — de ska vara lika många.` }); return; }
      current.fks.push({ cols, target: m[3].trim(), targetCols });
      return;
    }
    if (/^FK/i.test(line)) { errors.push({ line: no, message: `Rad ${no}: FK-raden ska se ut som FK1: (attribut) REF RELATION(attribut).` }); return; }
    if (/^PK/i.test(line)) { errors.push({ line: no, message: `Rad ${no}: PK-raden ska se ut som PK = {attribut, attribut}.` }); return; }
    errors.push({ line: no, message: `Rad ${no}: kunde inte tolka "${line}". En relation skrivs NAMN(attr1, attr2), sedan PK = {…} och FK1: (…) REF MÅL(…).` });
  });

  for (const r of relations) {
    if (r.pk.length === 0 && !already3NF) errors.push({ line: r.line, message: `Rad ${r.line}: ${r.name} saknar PK-rad.` });
  }
  return { relations, errors, already3NF };
}

// ---------- Jämförelse ----------

function fkOf(relation, attr) {
  return relation.fks.find((fk) => fk.cols.some((c) => norm(c) === norm(attr)));
}
const isFkAttr = (relation, attr) => Boolean(fkOf(relation, attr));
const nonFkAttrs = (relation) => relation.attrs.filter((a) => !isFkAttr(relation, a));

// Identiteten hos ett attribut: ett FK-attribut identifieras av det det
// ytterst refererar; ett vanligt attribut av relation och namn. `label`
// översätter svarets relationsnamn till facits, så att omdöpta relationer
// ändå får samma identitet.
function identity(schema, relation, attr, label, seen = new Set()) {
  const fk = fkOf(relation, attr);
  if (!fk) return `${label(relation.name)}.${norm(attr)}`;
  const key = `${norm(relation.name)}.${norm(attr)}`;
  if (seen.has(key)) return `${label(relation.name)}.${norm(attr)}`;
  seen.add(key);
  const idx = fk.cols.findIndex((c) => norm(c) === norm(attr));
  const targetRel = schema.relations.find((r) => norm(r.name) === norm(fk.target));
  const targetAttr = fk.targetCols[idx];
  if (!targetRel) return `${label(fk.target)}.${norm(targetAttr)}`;
  return identity(schema, targetRel, targetAttr, label, seen);
}

// Signatur för matchning utan namn: icke-FK-attributen plus vilka relationer
// FK:erna refererar — så att en ren kopplingsrelation (bara FK-attribut)
// ändå kan matchas när den heter något annat.
const signature = (rel) => [...nonFkAttrs(rel).map(norm), ...rel.fks.map((fk) => "fk:" + norm(fk.target))];

const jaccard = (a, b) => {
  const A = new Set(a.map(norm)); const B = new Set(b.map(norm));
  let inter = 0; for (const x of A) if (B.has(x)) inter++;
  const union = new Set([...A, ...B]).size;
  return union === 0 ? 0 : inter / union;
};

// Matcha svarets relationer mot facits: exakt namn först, sedan bästa
// överlapp på icke-FK-attribut (Jaccard ≥ 0,5), annars omatchad.
function matchRelations(answer, facit) {
  const pairs = new Map(); // facitIndex -> answerIndex
  const usedAnswer = new Set();
  facit.relations.forEach((f, fi) => {
    const ai = answer.relations.findIndex((a, i) => !usedAnswer.has(i) && norm(a.name) === norm(f.name));
    if (ai >= 0) { pairs.set(fi, ai); usedAnswer.add(ai); }
  });
  const candidates = [];
  facit.relations.forEach((f, fi) => {
    if (pairs.has(fi)) return;
    answer.relations.forEach((a, ai) => {
      if (usedAnswer.has(ai)) return;
      const score = jaccard(signature(f), signature(a));
      if (score >= 0.5) candidates.push({ fi, ai, score });
    });
  });
  candidates.sort((x, y) => y.score - x.score);
  for (const c of candidates) {
    if (pairs.has(c.fi) || usedAnswer.has(c.ai)) continue;
    pairs.set(c.fi, c.ai); usedAnswer.add(c.ai);
  }
  return { pairs, usedAnswer };
}

const setDiff = (a, b) => a.filter((x) => !b.includes(x));

function compareOne(answer, facit, aRel, fRel, labelA, labelF, rules) {
  const notes = [];
  const problems = [];
  if (norm(aRel.name) !== norm(fRel.name)) notes.push(`Relationen heter ${aRel.name} i ditt svar och ${fRel.name} i facit — samma sak.`);

  // Icke-FK-attribut som mängd, namn måste stämma.
  const fPlain = nonFkAttrs(fRel).map(norm);
  const aPlain = nonFkAttrs(aRel).map(norm);
  const missingAttrs = setDiff(fPlain, aPlain);
  const extraAttrs = setDiff(aPlain, fPlain);
  const show = (rel, n) => rel.attrs.find((x) => norm(x) === n) ?? n;
  if (missingAttrs.length) problems.push(`Saknar attribut: ${missingAttrs.map((n) => show(fRel, n)).join(", ")}.`);
  if (extraAttrs.length) problems.push(`Attribut som inte ska vara här (eller är felstavade): ${extraAttrs.map((n) => show(aRel, n)).join(", ")}.`);

  // FK-mängd på (målrelation, målattribut) — via identiteter.
  const fkKey = (schema, rel, fk, label) => {
    const targetRel = schema.relations.find((r) => norm(r.name) === norm(fk.target));
    const cols = fk.targetCols.map((c, i) => (targetRel ? identity(schema, targetRel, c, label) : `${label(fk.target)}.${norm(c)}`));
    return `${label(fk.target)}(${cols.sort().join(",")})`;
  };
  const fFks = fRel.fks.map((fk) => fkKey(facit, fRel, fk, labelF));
  const aFks = aRel.fks.map((fk) => fkKey(answer, aRel, fk, labelA));
  const missingFks = setDiff(fFks, aFks);
  const extraFks = setDiff(aFks, fFks);
  const pretty = (k) => k.replace(/\([^)]*\)/, (m) => "(" + m.slice(1, -1).split(",").map((x) => x.split(".").pop()).join(", ") + ")");
  if (missingFks.length) problems.push(`Saknar främmande nyckel mot ${missingFks.map(pretty).join(" och ")}.`);
  if (extraFks.length) problems.push(`Främmande nyckel som inte hör hit: mot ${extraFks.map(pretty).join(" och ")}.`);
  // Anmärkning: FK-attribut med annat namn än facit.
  fRel.fks.forEach((fk) => {
    const same = aRel.fks.find((afk) => fkKey(answer, aRel, afk, labelA) === fkKey(facit, fRel, fk, labelF));
    if (same && same.cols.map(norm).join() !== fk.cols.map(norm).join()) notes.push(`FK-attributet heter ${same.cols.join(", ")} hos dig och ${fk.cols.join(", ")} i facit — det refererar samma sak.`);
  });

  // PK som mängd av identiteter.
  const fPkMap = new Map(fRel.pk.map((a) => [identity(facit, fRel, a, labelF), a]));
  const aPkMap = new Map(aRel.pk.map((a) => [identity(answer, aRel, a, labelA), a]));
  const fPk = [...fPkMap.keys()].sort();
  const aPk = [...aPkMap.keys()].sort();
  const pkMissing = setDiff(fPk, aPk); const pkExtra = setDiff(aPk, fPk);
  const showId = (id) => fPkMap.get(id) ?? aPkMap.get(id) ?? id.split(".").pop();
  if (pkMissing.length || pkExtra.length) {
    const want = fRel.pk.join(", ");
    const got = aRel.pk.length ? aRel.pk.join(", ") : "(ingen)";
    problems.push(`Primärnyckeln ska vara {${want}}, du har {${got}}.${pkExtra.length ? ` ${pkExtra.map(showId).join(", ")} ska inte ingå.` : ""}${pkMissing.length ? ` ${pkMissing.map(showId).join(", ")} saknas.` : ""}`);
  }

  const rule = rules?.[norm(fRel.name)] ?? null;
  return {
    name: fRel.name,
    answerName: aRel.name,
    status: problems.length ? "diff" : "ok",
    problems,
    notes,
    rule,
    expected: fRel,
  };
}

// Rätta ett tolkat svar mot ett tolkat facit. rules: { [normNamn]: { rule, why } }.
export function compareSchemas(answer, facit, rules = {}) {
  const { pairs, usedAnswer } = matchRelations(answer, facit);
  // Etikett: svarets relationsnamn → facits namn där de är matchade.
  const aToF = new Map();
  for (const [fi, ai] of pairs) aToF.set(norm(answer.relations[ai].name), norm(facit.relations[fi].name));
  const labelA = (name) => aToF.get(norm(name)) ?? norm(name);
  const labelF = (name) => norm(name);

  const relations = facit.relations.map((fRel, fi) => {
    if (!pairs.has(fi)) {
      return { name: fRel.name, answerName: null, status: "missing", problems: [`Relationen ${fRel.name} saknas i ditt svar.`], notes: [], rule: rules?.[norm(fRel.name)] ?? null, expected: fRel };
    }
    return compareOne(answer, facit, answer.relations[pairs.get(fi)], fRel, labelA, labelF, rules);
  });
  const extra = answer.relations.filter((_, i) => !usedAnswer.has(i)).map((r) => r.name);
  const okCount = relations.filter((r) => r.status === "ok").length;
  let status;
  if (okCount === relations.length && extra.length === 0) status = "correct";
  else if (okCount === 0 && relations.length > 0) status = "wrong";
  else status = "partial";
  const remarks = relations.flatMap((r) => r.notes);
  return { status, relations, extra, remarks, score: okCount - extra.length * 0.5 };
}

// Facit får vara en lista av alternativ (1:1 har två giltiga värdval).
// Rätta mot varje och visa det bästa.
export function checkModel(answerText, facitVariants, rules = {}) {
  const answer = parseSchema(answerText);
  if (answer.errors.length) return { status: "parse-error", errors: answer.errors, answer };
  const variants = Array.isArray(facitVariants) ? facitVariants : [facitVariants];
  let best = null;
  variants.forEach((text, i) => {
    const facit = typeof text === "string" ? parseSchema(text) : text;
    const result = compareSchemas(answer, facit, rules);
    if (!best || result.status === "correct" && best.status !== "correct" || (best.status !== "correct" && result.score > best.score)) {
      best = { ...result, variant: i };
    }
  });
  return { ...best, answer };
}
