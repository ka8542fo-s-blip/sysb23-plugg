// Motorn för funktionella beroenden, som körs både i appen och i
// testsviten. Allt arbetar på listor av attributnamn (strängar); två namn
// är samma attribut om de bara skiljer sig i skiftläge eller blanksteg, och
// resultaten behåller stavningen från relationen R.
//
// Definitionerna är kursens (kapitel 8 och nya Fö6):
// - 2NF: inget icke-primärattribut är funktionellt beroende av en äkta
//   delmängd av någon kandidatnyckel.
// - 3NF: 2NF och inget icke-primärattribut är transitivt beroende av en
//   kandidatnyckel (X → Y och Y → Z där Y ↛ X).
// - Lossless join: den naturliga joinen av delarna ger tillbaka R för varje
//   population som uppfyller beroendena (prövas exakt med tablåmetoden; för
//   förklaringen används kursbokens kontroll två i taget).
// - Dependency preservation: de lokala beroendena i delarna medför
//   tillsammans alla ursprungliga beroenden — inte "båda attributen i samma
//   relation", som bara är ett tillräckligt villkor.

const key = (s) => String(s ?? "").toLowerCase().replace(/[\s_]+/g, "");
const eq = (a, b) => key(a) === key(b);
export const has = (set, a) => set.some((x) => eq(x, a));
export const subset = (a, b) => a.every((x) => has(b, x));
export const properSubset = (a, b) => subset(a, b) && a.length < b.length;
export const sameSet = (a, b) => subset(a, b) && subset(b, a);
const uniq = (list) => list.filter((x, i) => list.findIndex((y) => eq(x, y)) === i);
// Ordna en attributmängd som i R, så att texterna blir stabila.
const inOrder = (X, R) => [...R.filter((a) => has(X, a)), ...X.filter((a) => !has(R, a))];

export const attrsOf = (s) => (Array.isArray(s) ? s : String(s).split(",")).map((x) => String(x).trim()).filter(Boolean);
export const setText = (list) => (list.length === 1 ? list[0] : `{${list.join(", ")}}`);
export const braceText = (list) => `{${list.join(", ")}}`;

// "{A, B} → C", "A -> {B, C}"
export function parseFd(text) {
  const m = /^\s*\{?([^{}→>-]+)\}?\s*(?:→|->)\s*\{?([^{}]+)\}?\s*$/.exec(text);
  if (!m) throw new Error(`Kunde inte tolka beroendet "${text}".`);
  return { lhs: attrsOf(m[1]), rhs: attrsOf(m[2]), text: text.trim() };
}
export const fdText = (fd) => `${setText(fd.lhs)} → ${setText(fd.rhs)}`;
// Beroenden som text eller objekt; varje beroende får sitt index i listan.
export const toFds = (list) => (list || []).map((fd, i) => ({ ...(typeof fd === "string" ? parseFd(fd) : fd), index: i }));

export function closure(X, F) {
  const fds = toFds(F);
  const result = uniq(attrsOf(X));
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

export const isSuperkey = (X, R, F) => subset(attrsOf(R), closure(X, F));

function subsetsBySize(attrs) {
  const out = [];
  const n = attrs.length;
  for (let mask = 1; mask < 1 << n; mask++) out.push(attrs.filter((_, i) => mask & (1 << i)));
  out.sort((a, b) => a.length - b.length);
  return out;
}

// Alla kandidatnycklar (minimala superkeys), minst först och i R:s ordning.
export function allCandidateKeys(R, F) {
  const attrs = attrsOf(R);
  const keys = [];
  for (const X of subsetsBySize(attrs)) {
    if (keys.some((k) => subset(k, X))) continue;
    if (isSuperkey(X, attrs, F)) keys.push(X);
  }
  return keys;
}

export function prime(R, F, cks = allCandidateKeys(R, F)) {
  return attrsOf(R).filter((a) => cks.some((k) => has(k, a)));
}
export function nonPrime(R, F, cks = allCandidateKeys(R, F)) {
  return attrsOf(R).filter((a) => !cks.some((k) => has(k, a)));
}

// Attribut som inte står till höger om någon pil — de måste ingå i varje
// kandidatnyckel (steg 2 i nyckelsökningen).
export function neverDetermined(R, F) {
  const fds = toFds(F);
  return attrsOf(R).filter((a) => !fds.some((fd) => has(fd.rhs, a) && !has(fd.lhs, a)));
}

// Typen på ett enskilt beroende X → a, med R:s kandidatnycklar:
// "partial" om X är en äkta delmängd av en kandidatnyckel och a är
// icke-primärt, "transitive" om X varken är superkey eller del av en
// kandidatnyckel och a är icke-primärt, annars null.
export function dependencyType(lhs, a, R, F, cks = allCandidateKeys(R, F)) {
  if (has(lhs, a)) return null;
  if (cks.some((k) => has(k, a))) return null;
  if (!has(attrsOf(R), a)) return null;
  const ck = cks.find((k) => properSubset(lhs, k));
  if (ck) return "partial";
  if (isSuperkey(lhs, R, F)) return null;
  return "transitive";
}

// Högsta normalform (1, 2 eller 3) och vad som bryter. Brotten väljs bland
// de GIVNA beroendena, ett per (beroende, attribut), så att motiveringen kan
// citera en rad ur uppgiften. Bara om 2NF bryts utan att något givet
// beroende visar det läggs ett härlett partiellt beroende till (derived).
export function highestNF(R, F) {
  const attrs = attrsOf(R);
  const fds = toFds(F);
  const cks = allCandidateKeys(attrs, fds);
  const primes = prime(attrs, fds, cks);
  const nonPrimes = nonPrime(attrs, fds, cks);

  const violations = [];
  for (const fd of fds) {
    for (const a of fd.rhs) {
      const type = dependencyType(fd.lhs, a, attrs, fds, cks);
      if (!type) continue;
      const ck = type === "partial" ? cks.find((k) => properSubset(fd.lhs, k)) : cks[0];
      violations.push({ fd, index: fd.index, type, attr: inOrder([a], attrs)[0], ck, via: fd.lhs, derived: false });
    }
  }

  // 2NF prövas exakt: höljet av varje äkta delmängd av varje kandidatnyckel.
  const derivedPartials = [];
  for (const ck of cks) {
    for (const X of subsetsBySize(ck)) {
      if (X.length === ck.length) continue;
      for (const a of closure(X, fds)) {
        if (has(X, a) || !has(nonPrimes, a)) continue;
        if (derivedPartials.some((d) => sameSet(d.via, X) && eq(d.attr, a))) continue;
        derivedPartials.push({ fd: { lhs: X, rhs: [a], text: `${setText(X)} → ${a}` }, index: null, type: "partial", attr: a, ck, via: X, derived: true });
      }
    }
  }
  const partial = derivedPartials.length > 0;
  if (partial && !violations.some((v) => v.type === "partial")) violations.push(...derivedPartials);

  // 3NF: ett givet beroende W → a med W utan superkey-status och a
  // icke-primärt finns om och endast om något icke-primärattribut beror
  // transitivt (eller partiellt) på en kandidatnyckel.
  const nf = partial ? 1 : violations.length ? 2 : 3;
  return { nf, cks, prime: primes, nonPrime: nonPrimes, violations };
}

export const NF_NAME = { 1: "1NF", 2: "2NF", 3: "3NF" };

// ---------- Nedbrytningar ----------

// Beroendena som gäller inom en delrelation: höljet av varje delmängd,
// skuret mot delens attribut (bara icke-triviala delar).
export function projectFds(Ri, F) {
  const rel = attrsOf(Ri);
  const out = [];
  for (const X of subsetsBySize(rel)) {
    const Y = closure(X, F).filter((a) => has(rel, a) && !has(X, a));
    if (Y.length) out.push({ lhs: X, rhs: inOrder(Y, rel) });
  }
  return out;
}

// Högsta normalform för en delrelation, med de beroenden som gäller i den.
export function relationNF(Ri, F) {
  return highestNF(attrsOf(Ri), projectFds(Ri, F));
}

// Exakt prov med tablån: en rad per del, "a" där delen har attributet.
// Beroendena likställer rader som stämmer överens på vänsterledet. Lossless
// om någon rad till slut är "a" i varje kolumn.
export function isLossless(R, F, decomposition) {
  const attrs = attrsOf(R);
  const fds = toFds(F);
  const parts = decomposition.map(attrsOf);
  const rows = parts.map((p, i) => attrs.map((a) => (has(p, a) ? "a" : `b${i}`)));
  const col = (a) => attrs.findIndex((x) => eq(x, a));
  let changed = true;
  while (changed) {
    changed = false;
    for (const fd of fds) {
      const L = fd.lhs.map(col);
      const Rc = fd.rhs.map(col).filter((c) => c >= 0);
      if (L.some((c) => c < 0)) continue;
      for (let i = 0; i < rows.length; i++) {
        for (let j = i + 1; j < rows.length; j++) {
          if (!L.every((c) => rows[i][c] === rows[j][c])) continue;
          for (const c of Rc) {
            const x = rows[i][c];
            const y = rows[j][c];
            if (x === y) continue;
            const keep = x === "a" || y === "a" ? "a" : x < y ? x : y;
            const drop = keep === x ? y : x;
            for (const row of rows) if (row[c] === drop) row[c] = keep;
            changed = true;
          }
        }
      }
    }
  }
  return rows.some((row) => row.every((v) => v === "a"));
}

// Förklaringen i kursbokens form, två delar i taget: två delar får slås
// ihop om de gemensamma attributen bestämmer alla attribut i minst en av
// dem. Ger stegen och, om kontrollen fastnar, var den fastnade.
export function losslessSteps(R, F, decomposition) {
  const lossless = isLossless(R, F, decomposition);
  let parts = decomposition.map((p, i) => ({ attrs: attrsOf(p), names: [i] }));
  const steps = [];
  while (parts.length > 1) {
    let merged = false;
    outer: for (let i = 0; i < parts.length; i++) {
      for (let j = i + 1; j < parts.length; j++) {
        const common = parts[i].attrs.filter((a) => has(parts[j].attrs, a));
        if (!common.length) continue;
        const c = closure(common, F);
        const coversI = subset(parts[i].attrs, c);
        const coversJ = subset(parts[j].attrs, c);
        if (coversI || coversJ) {
          steps.push({ left: parts[i], right: parts[j], common, closure: c, covers: coversJ ? "right" : "left" });
          const union = { attrs: uniq([...parts[i].attrs, ...parts[j].attrs]), names: [...parts[i].names, ...parts[j].names] };
          parts = parts.filter((_, k) => k !== i && k !== j);
          parts.push(union);
          merged = true;
          break outer;
        }
      }
    }
    if (!merged) break;
  }
  const byPairs = parts.length === 1;
  return { lossless, byPairs, steps, stuck: byPairs ? null : parts };
}

// Beroendebevarande med den vanliga algoritmen: Z = X, och för varje del
// Ri läggs (Z ∩ Ri)⁺ ∩ Ri till, tills inget nytt kommer. X → Y är bevarat
// om Y ⊆ Z — då följer det av de lokala beroendena tillsammans.
export function preservedClosure(X, F, decomposition) {
  const parts = decomposition.map(attrsOf);
  const Z = uniq(attrsOf(X));
  let grew = true;
  while (grew) {
    grew = false;
    for (const p of parts) {
      const inside = Z.filter((a) => has(p, a));
      for (const a of closure(inside, F)) {
        if (has(p, a) && !has(Z, a)) { Z.push(a); grew = true; }
      }
    }
  }
  return Z;
}

export function dependencyReport(R, F, decomposition) {
  const parts = decomposition.map(attrsOf);
  return toFds(F).map((fd) => {
    const direct = parts.findIndex((p) => subset([...fd.lhs, ...fd.rhs], p));
    const reach = preservedClosure(fd.lhs, F, parts);
    const preserved = subset(fd.rhs, reach);
    return { fd, preserved, direct: direct >= 0 ? direct : null, reach: inOrder(reach, attrsOf(R)), missing: fd.rhs.filter((a) => !has(reach, a)) };
  });
}

export const isDependencyPreserving = (R, F, decomposition) => dependencyReport(R, F, decomposition).every((r) => r.preserved);
