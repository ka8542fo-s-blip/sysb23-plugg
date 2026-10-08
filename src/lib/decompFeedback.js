// Återkopplingen på nedbrytningen till 3NF, i klartext. Den bygger på de
// tre reglerna Kasper lärt sig:
//   1. En tabell per pilstart (determinant) med allt den pekar direkt på.
//   2. Slå ihop tabeller vars nycklar bestämmer varandra.
//   3. Hela kandidatnyckeln måste finnas i någon tabell – annars nyckeltabell.
// Kaspers relationer jämförs med facit på innehåll (attributmängd och
// primärnyckel), inte på namn. Varje rad säger vad som stämmer eller vad som
// ska ändras och varför — utan closure och utan tekniska termer.
import { attrsOf, setText, braceText, closure, has, subset, sameSet, highestNF, projectFds, allCandidateKeys, toFds, preservedClosure } from "./fd.js";
import { parseSchema } from "./modelCheck.js";

const list = (xs) => (xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} och ${xs[xs.length - 1]}`);
const arrow = (lhs, rhs) => `${setText(lhs)} → ${setText(rhs)}`;
const head = (u) => `${u.name}(${u.attrs.join(", ")})`;
const determines = (X, Y, F) => subset(Y, closure(X, F));

function facitDecompositions(item) {
  const toRel = (r) => ({ name: r.name, attrs: attrsOf(r.attrs), pks: [...(r.pk || []), ...(r.pkAlso || [])].map(attrsOf) });
  return item.facit ? [item.facit, ...(item.variants || [])].map((rels) => rels.map(toRel)) : [];
}

// Vad en facittabell är, med reglernas ord.
function roleText(g) {
  const pk = g.pks[0];
  const rest = g.attrs.filter((a) => !has(pk, a));
  if (!rest.length) return `nyckeltabellen. Behövs eftersom ingen annan tabell innehåller hela nyckeln ${braceText(pk)}.`;
  if (g.pks.length > 1) return `tabellen för ${list(g.pks.map(setText))}, som bestämmer varandra, med allt de pekar direkt på. Stämmer med facit.`;
  return `tabellen för pilen ${arrow(pk, rest)}. Stämmer med facit.`;
}

function missingText(g) {
  const pk = g.pks[0];
  const rest = g.attrs.filter((a) => !has(pk, a));
  if (!rest.length) return `Saknas: nyckeltabell. Ingen tabell innehåller hela nyckeln ${braceText(pk)}.`;
  if (g.pks.length > 1) return `Saknas: tabell för ${list(g.pks.map(setText))}, som bestämmer varandra, med allt de pekar direkt på (${list(g.attrs)}).`;
  return `Saknas: tabell för pilen ${arrow(pk, rest)}.`;
}

function pkText(u, g) {
  const pk = g.pks[0];
  const rest = g.attrs.filter((a) => !has(pk, a));
  if (!rest.length) return `${u.name}:s nyckel ska vara hela ${braceText(pk)} – det är nyckeltabellen.`;
  if (g.pks.length > 1) return `${u.name}:s nyckel ska vara ${list(g.pks.map(braceText)).replace(/ och /, " eller ")}, eftersom pilarna startar där.`;
  return `${u.name}:s nyckel ska vara ${braceText(pk)}, eftersom pilen startar i ${setText(pk)}.`;
}

// Det givna beroende som bestämmer attributet (första i uppgiften).
const determinantOf = (a, F) => toFds(F).find((fd) => has(fd.rhs, a) && !has(fd.lhs, a))?.lhs || null;

// Välj den facitvariant som flest av Kaspers relationer stämmer med.
function chooseDecomposition(user, decompositions) {
  let best = decompositions[0] || [];
  let bestScore = -1;
  for (const d of decompositions) {
    const score = user.reduce((s, u) => {
      const g = d.find((x) => sameSet(x.attrs, u.attrs));
      return s + (g ? 2 + (g.pks.some((p) => sameSet(p, u.pk)) ? 1 : 0) : 0);
    }, 0);
    if (score > bestScore) { best = d; bestScore = score; }
  }
  return best;
}

export function headline(count) {
  if (count === 0) return "Rätt";
  if (count === 1) return "Nästan – 1 sak att ändra";
  return `Fel – ${count} saker att ändra`;
}

// Returnerar { lines: [{ ok, text }], count, headline, parseErrors }.
// Raderna kommer i Kaspers ordning, följda av det som saknas.
export function decompositionFeedback(item, text) {
  const R = attrsOf(item.attrs);
  const F = item.fds;
  const result = (lines, parseErrors = []) => {
    const count = lines.filter((l) => !l.ok).length + parseErrors.length;
    return { lines, count, headline: headline(count), parseErrors };
  };

  const schema = parseSchema(text || "");
  if (schema.errors.length && (text || "").trim()) return result([], schema.errors.map((e) => e.message));
  const canon = (a) => R.find((x) => x.toLowerCase() === String(a).trim().toLowerCase()) || String(a).trim();
  const user = schema.relations.map((r) => ({ name: r.name, attrs: r.attrs.map(canon), pk: (r.pk || []).map(canon) }));

  // R var redan i 3NF.
  if (highestNF(R, F).nf === 3) {
    return result(user.length ? [{ ok: false, text: "R var redan i 3NF – ingen nedbrytning behövs." }] : []);
  }

  const cks = allCandidateKeys(R, F);
  const facit = chooseDecomposition(user, facitDecompositions(item));
  const lines = user.map(() => null);
  const matched = new Map(); // facitindex → användarindex (exakt träff)
  const groups = new Map(); // facitindex → användarindex som ligger inom tabellen
  const ownTable = []; // determinanter som en rad redan sagt ska ha en egen tabell
  let keyTableExplained = false; // en rad har redan förklarat nyckeltabellen

  // Exakta träffar (samma attribut) först; en andra likadan tabell är onödig.
  user.forEach((u, i) => {
    const gi = facit.findIndex((g) => sameSet(g.attrs, u.attrs));
    if (gi < 0) return;
    if (matched.has(gi)) {
      lines[i] = { ok: false, text: `${u.name} behövs inte – allt i den finns redan i ${user[matched.get(gi)].name}.` };
      return;
    }
    matched.set(gi, i);
    const g = facit[gi];
    lines[i] = g.pks.some((p) => sameSet(p, u.pk))
      ? { ok: true, text: `${head(u)} – ${roleText(g)}` }
      : { ok: false, text: pkText(u, g) };
  });

  user.forEach((u, i) => {
    if (lines[i]) return;
    const unknown = u.attrs.filter((a) => !has(R, a));
    if (unknown.length) { lines[i] = { ok: false, text: `${list(unknown)} finns inte i R (${head(u)}).` }; return; }
    // Ligger tabellen helt inom en facittabell? Då hör den ihop med den.
    const inside = facit
      .map((g, gi) => ({ g, gi }))
      .filter(({ g }) => subset(u.attrs, g.attrs))
      .sort((a, b) => (b.g.pks.some((p) => sameSet(p, u.pk)) - a.g.pks.some((p) => sameSet(p, u.pk))) || a.g.attrs.length - b.g.attrs.length)[0];
    if (inside) {
      groups.set(inside.gi, [...(groups.get(inside.gi) || []), i]);
      return;
    }
    // En tabell med bara nyckel som ändå inte innehåller hela kandidatnyckeln.
    if (u.pk.length && sameSet(u.pk, u.attrs) && !cks.some((k) => subset(k, u.attrs))) {
      const key = cks.find((k) => k.some((a) => has(u.attrs, a))) || cks[0];
      const via = u.attrs.filter((a) => !has(key, a));
      keyTableExplained = true;
      lines[i] = { ok: false, text: `Nyckeltabellen ska innehålla hela nyckeln ${braceText(key)}. (${u.attrs.join(", ")}) kopplar inte ihop ${list(key)}${via.length ? ` – en join via ${list(via)} ger rader som aldrig fanns (spurious tuples)` : ""}.` };
      return;
    }
    // Samma nyckel som en annan tabell, och allt i den nås redan via de andra.
    const others = user.filter((_, k) => k !== i);
    const twin = others.find((o) => o.pk.length && sameSet(o.pk, u.pk));
    if (twin && subset(u.attrs, preservedClosure(u.pk, F, others.map((o) => o.attrs)))) {
      const rest = u.attrs.filter((a) => !has(u.pk, a));
      const paths = rest
        .map((c) => others.find((o) => o !== twin && has(o.attrs, c) && !has(o.pk, c) && subset(o.pk, twin.attrs)))
        .map((w, k) => (w ? `${setText(u.pk)} → ${setText(w.pk)} → ${rest[k]}` : null));
      const reached = paths.every(Boolean) ? `nås redan via ${paths.join(" och ")}` : "nås redan via de andra tabellerna";
      lines[i] = { ok: false, text: `${head(u)} behövs inte – ${list(rest)} ${reached}. Två tabeller med samma nyckel ${braceText(u.pk)} är övernormalisering.` };
      return;
    }
    // Attribut som nyckeln inte bestämmer alls hör hemma någon annanstans.
    const P = u.pk.length ? u.pk : allCandidateKeys(u.attrs, projectFds(u.attrs, F))[0] || u.attrs;
    const reach = closure(P, F);
    const wrong = u.attrs.filter((a) => !has(P, a) && !has(reach, a));
    if (wrong.length) {
      const dets = [...new Set(wrong.map((a) => setText(determinantOf(a, F) || [])))].filter(Boolean);
      const det = determinantOf(wrong[0], F);
      if (det) ownTable.push(det);
      const why = dets.length === 1 && dets[0]
        ? `${wrong.length === 1 ? wrong[0] : "de"} beror på ${dets[0]}, inte på ${setText(P)}`
        : `${setText(P)} bestämmer inte ${list(wrong)}`;
      lines[i] = { ok: false, text: `${list(wrong)} hör inte hemma i ${u.name} – ${why}.` };
      return;
    }
    // Ett beroende inne i tabellen som borde ha en egen tabell.
    // Den enklaste orsaken först: kortast vänsterled, partiellt före transitivt.
    const local = highestNF(u.attrs, projectFds(u.attrs, F));
    const v = [...local.violations].sort((a, b) => a.via.length - b.via.length || (a.type === "partial" ? -1 : 1) - (b.type === "partial" ? -1 : 1))[0];
    if (local.nf < 3 && v) {
      const key = local.cks[0];
      ownTable.push(v.via);
      const own = user.find((o, k) => k !== i && sameSet(o.pk, v.via) && has(o.attrs, v.attr));
      lines[i] = own
        ? { ok: false, text: `${v.attr} hör inte hemma i ${u.name} – ${v.attr} beror på ${setText(v.via)}, och ${setText(v.via)} → ${v.attr} har redan en egen tabell (${own.name}).` }
        : v.type === "transitive"
        ? { ok: false, text: `${head(u)} – här finns kedjan ${setText(key)} → ${setText(v.via)} → ${v.attr} kvar. ${setText(v.via)} → ${v.attr} ska ha en egen tabell.` }
        : { ok: false, text: `${head(u)} – här beror ${v.attr} bara på ${setText(v.via)}, en del av nyckeln ${braceText(key)}. ${setText(v.via)} → ${v.attr} ska ha en egen tabell.` };
      return;
    }
    lines[i] = { ok: false, text: `${head(u)} motsvarar ingen tabell enligt reglerna: varken en pilstart med det den pekar direkt på, eller hela nyckeln.` };
  });

  // Tabeller som ligger inom samma facittabell.
  for (const [gi, idxs] of groups) {
    const g = facit[gi];
    if (matched.has(gi)) {
      const home = user[matched.get(gi)];
      for (const i of idxs) lines[i] = { ok: false, text: `${user[i].name} behövs inte – allt i den finns redan i ${home.name}.` };
      continue;
    }
    if (idxs.length === 1) {
      const u = user[idxs[0]];
      const missing = g.attrs.filter((a) => !has(u.attrs, a));
      const reason = g.pks.length > 1
        ? `nycklarna ${list(g.pks.map(setText))} bestämmer varandra, så allt de pekar på ska stå i en tabell`
        : `${setText(g.pks[0])} pekar direkt på ${missing.length === 1 ? missing[0] : "dem"}, så ${missing.length === 1 ? "det" : "de"} ska stå i samma tabell`;
      lines[idxs[0]] = { ok: false, text: `${u.name} saknar ${list(missing)} – ${reason}.` };
      matched.set(gi, idxs[0]);
      continue;
    }
    // Flera tabeller där facit har en: övernormaliserat, eller onödiga delar.
    const us = idxs.map((i) => user[i]);
    const names = list(us.map((u) => u.name));
    let textOut;
    const sub = us.find((a) => us.some((b) => b !== a && subset(a.attrs, b.attrs)));
    if (us.length === 2 && sub) {
      const other = us.find((b) => b !== sub);
      textOut = `${sub.name} behövs inte – allt i den finns redan i ${other.name}.`;
    } else if (us.length === 2 && sameSet(us[0].pk, us[1].pk)) {
      textOut = `${names} har samma nyckel ${braceText(us[0].pk)} – de ska vara en tabell.`;
    } else if (us.length === 2 && determines(us[0].pk, us[1].pk, F) && determines(us[1].pk, us[0].pk, F)) {
      textOut = `${names} har nycklar som bestämmer varandra (${arrow(us[0].pk, us[1].pk)} och ${arrow(us[1].pk, us[0].pk)}) – de ska vara en tabell.`;
    } else if (us.every((a) => us.every((b) => determines(a.pk, b.pk, F)))) {
      textOut = `${names} ska vara en tabell: nycklarna ${list(us.map((u) => setText(u.pk)))} bestämmer varandra.`;
    } else {
      textOut = `${names} ska vara en tabell: ${setText(g.pks[0])} pekar direkt på allt i dem.`;
    }
    idxs.forEach((i, k) => { lines[i] = k === 0 ? { ok: false, text: textOut } : { ok: false, text: "", merged: true }; });
    matched.set(gi, idxs[0]);
  }

  // Det som saknas.
  const missing = [];
  const hasFullKey = user.some((u) => cks.some((k) => subset(k, u.attrs)));
  facit.forEach((g, gi) => {
    if (matched.has(gi)) return;
    const pk = g.pks[0];
    const rest = g.attrs.filter((a) => !has(pk, a));
    if (!rest.length) {
      if (!hasFullKey && !keyTableExplained) missing.push({ ok: false, text: missingText(g) });
      return;
    }
    if (ownTable.some((d) => g.pks.some((p) => sameSet(p, d)))) return;
    if (user.some((u) => g.pks.some((p) => sameSet(p, u.pk)))) return;
    missing.push({ ok: false, text: missingText(g) });
  });
  const mentioned = new Set([...user.flatMap((u) => u.attrs), ...facit.filter((g, gi) => !matched.has(gi)).flatMap((g) => g.attrs)]);
  for (const a of R) if (!mentioned.has(a)) missing.push({ ok: false, text: `Saknas: ${a} finns inte i någon tabell.` });
  if (!user.length && !missing.length) missing.push({ ok: false, text: "Saknas: nedbrytning. R är inte i 3NF och ska delas upp." });

  return result([...lines.filter((l) => l && !l.merged), ...missing]);
}
