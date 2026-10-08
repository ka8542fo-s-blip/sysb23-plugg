// Slumpuppgifter i normaliseringen: en ny relation R med beroenden i
// övningshäftets stil (3–6 attribut, 1–4 beroenden, enkla eller dubbla
// vänsterled), och ett facit byggt med kursens tre regler:
//   1. En tabell per pilstart med allt den pekar direkt på.
//   2. Slå ihop tabeller vars nycklar bestämmer varandra.
//   3. Hela kandidatnyckeln måste finnas i någon tabell – annars nyckeltabell.
// Varje uppgift prövas innan den lämnas ut: beroendena är icke-redundanta,
// och facit är 3NF, lossless, beroendebevarande, utan överflödiga tabeller
// och utan nyckel två gånger. Samma frö ger samma uppgift.
import {
  attrsOf, setText, closure, has, subset, sameSet, highestNF, projectFds, allCandidateKeys, isLossless, isDependencyPreserving, relationNF, NF_NAME,
} from "./fd.js";

// Liten deterministisk slumpgenerator (mulberry32).
export function rng(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = (r, list) => list[Math.floor(r() * list.length)];
const shuffle = (r, list) => {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};
const LETTERS = "ABCDEFG".split("");
const order = (X, R) => R.filter((a) => has(X, a));

// Beroenden utan överflöd: inget beroende följer av de andra, inget
// attribut i ett vänsterled är onödigt.
function minimal(R, fds) {
  for (let i = 0; i < fds.length; i++) {
    const rest = fds.filter((_, k) => k !== i);
    if (subset(fds[i].rhs, closure(fds[i].lhs, rest))) return false;
    if (fds[i].lhs.length > 1 && fds[i].lhs.some((a) => subset(fds[i].rhs, closure(fds[i].lhs.filter((b) => b !== a), fds)))) return false;
    for (const a of fds[i].rhs) {
      const without = [...rest, ...(fds[i].rhs.length > 1 ? [{ lhs: fds[i].lhs, rhs: fds[i].rhs.filter((b) => b !== a) }] : [])];
      if (has(closure(fds[i].lhs, without), a)) return false;
    }
  }
  return true;
}

function randomFds(r, R) {
  const count = 1 + Math.floor(r() * Math.min(4, R.length - 1));
  const byLhs = new Map();
  for (let k = 0; k < count; k++) {
    const lhs = order(shuffle(r, R).slice(0, r() < 0.3 && R.length >= 4 ? 2 : 1), R);
    const others = R.filter((a) => !has(lhs, a));
    const rhs = shuffle(r, others).slice(0, r() < 0.3 && others.length > 1 ? 2 : 1);
    const keyOf = lhs.join(",");
    const prev = byLhs.get(keyOf);
    byLhs.set(keyOf, { lhs, rhs: order([...(prev?.rhs || []), ...rhs].filter((a, i, l) => l.indexOf(a) === i), R) });
  }
  return [...byLhs.values()];
}

const fdString = (fd) => `${setText(fd.lhs)} → ${setText(fd.rhs)}`;

// Facit med de tre reglerna; varje tabell får alla sina lokala
// kandidatnycklar som godtagbara primärnycklar (första = pilstarten).
export function synthesize(R, fds) {
  let tables = fds.map((fd) => ({ attrs: order([...fd.lhs, ...fd.rhs], R), starts: [fd.lhs] }));
  // Regel 2: tabeller vars nycklar bestämmer varandra blir en.
  let merged = true;
  while (merged) {
    merged = false;
    outer: for (let i = 0; i < tables.length; i++) {
      for (let j = i + 1; j < tables.length; j++) {
        const a = tables[i].starts[0], b = tables[j].starts[0];
        if (subset(b, closure(a, fds)) && subset(a, closure(b, fds))) {
          tables[i] = { attrs: order([...tables[i].attrs, ...tables[j].attrs], R), starts: [...tables[i].starts, ...tables[j].starts] };
          tables.splice(j, 1);
          merged = true;
          break outer;
        }
      }
    }
  }
  // En tabell som ryms helt i en annan behövs inte.
  tables = tables.filter((t, i) => !tables.some((u, j) => j !== i && subset(t.attrs, u.attrs) && (t.attrs.length < u.attrs.length || j < i)));
  // Regel 3: nyckeltabell om ingen tabell innehåller en hel kandidatnyckel.
  const cks = allCandidateKeys(R, fds);
  if (!tables.some((t) => cks.some((k) => subset(k, t.attrs)))) tables.push({ attrs: cks[0], starts: [cks[0]] });
  return tables.map((t, i) => {
    const local = allCandidateKeys(t.attrs, projectFds(t.attrs, fds));
    const first = local.find((k) => t.starts.some((s) => sameSet(s, k))) || local[0];
    const also = local.filter((k) => k !== first);
    return { name: `R${i + 1}`, attrs: t.attrs.join(", "), pk: [first.join(", ")], ...(also.length ? { pkAlso: also.map((k) => k.join(", ")) } : {}) };
  });
}

// Kontrollerar facit på samma sätt som testsviten gör med häftets facit.
export function facitIsSound(R, fds, facit) {
  const parts = facit.map((t) => attrsOf(t.attrs));
  const pks = facit.map((t) => attrsOf(t.pk[0]));
  if (!R.every((a) => parts.flat().includes(a))) return false;
  if (parts.some((p) => relationNF(p, fds).nf !== 3)) return false;
  if (!isLossless(R, fds, parts) || !isDependencyPreserving(R, fds, parts)) return false;
  for (let i = 0; i < parts.length; i++) {
    const rest = parts.filter((_, k) => k !== i);
    if (R.every((a) => rest.flat().includes(a)) && isLossless(R, fds, rest) && isDependencyPreserving(R, fds, rest)) return false;
    for (let j = i + 1; j < parts.length; j++) {
      if (sameSet(pks[i], pks[j])) return false;
      if (subset(pks[j], closure(pks[i], fds)) && subset(pks[i], closure(pks[j], fds))) return false;
    }
  }
  return true;
}

// En slumpuppgift. `target` = "1NF" | "2NF" | "3NF" | null (valfri).
// Utan vald normalform slumpas den först, jämnt mellan 1NF, 2NF och 3NF —
// annars blir nästan alla slumpade relationer 1NF.
export function randomExercise(seed, target = null) {
  const r = rng(seed);
  target = target || pick(r, ["1NF", "2NF", "3NF"]);
  for (let attempt = 0; attempt < 400; attempt++) {
    const n = 3 + Math.floor(r() * 4);
    const R = LETTERS.slice(0, n);
    const fds = randomFds(r, R);
    if (!minimal(R, fds)) continue;
    const { nf } = highestNF(R, fds);
    const nfName = NF_NAME[nf];
    if (target && nfName !== target) continue;
    // Varje attribut ska höra till något beroende eller till nyckeln — men
    // inte alla attribut i nyckeln (då är uppgiften trivial).
    const cks = allCandidateKeys(R, fds);
    if (cks.length === 1 && cks[0].length === R.length) continue;
    const facit = nf === 3 ? null : synthesize(R, fds);
    if (facit && !facitIsSound(R, fds, facit)) continue;
    return {
      id: `norm-slump-${seed}`,
      exercise: "slump",
      number: seed,
      attrs: R.join(", "),
      fds: fds.map(fdString),
      nf: nfName,
      facit,
    };
  }
  return null;
}

// Ett nytt frö ur klockan och slumpen (inte deterministiskt, för appen).
export const newSeed = () => (Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0;
