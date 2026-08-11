// Tolkar TimeEdits odokumenterade JSON-format (ri-URL:en med .json) och
// jämför med sessions i src/data/schedule.js.
//
// TimeEdit kan ändra formatet utan förvarning. Därför validerar parsern
// varje antagande och kastar med tydliga meddelanden i stället för att
// gissa — ett fel här ska stoppa schemakontrollen, aldrig ge tyst skräp.
//
// Granularitet: schedule.js slår ihop grupp-pass ("13:00 / 15:00") och
// flerdagarspass (dateEnd) till en post, medan TimeEdit har en reservation
// per delpass. Jämförelsen sker därför på delpass-nivå: expandSessions()
// vecklar ut de kurerade posterna till samma granularitet som TimeEdit.

const HEADER_DELKURS = "Delkurs";
const HEADER_TYP = "Undervisningstyp, Tentaaktivitet";
const HEADER_PLATS = "Platskommentar, Plats";
const HEADER_KOMMENTAR = "Kommentar, Publik kommentar";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;

// Aktivitetstext → kind-vokabulären i schedule.js. Okänd aktivitet är
// innehåll (inte trasig struktur) och ger kind null — passet rapporteras
// då som nytt/borttaget i stället för att stoppa körningen.
export function kindOf(activity) {
  const a = activity.toLowerCase();
  if (a.includes("tentamen")) return "tenta";
  if (a.includes("föreläsning")) return "föreläsning";
  if (a.includes("laboration")) return "laboration";
  if (a.includes("lektion")) return "lektion";
  if (a.includes("handledning")) return "handledning";
  if (a.includes("workshop")) return "workshop";
  if (a.includes("seminarium")) return "seminarium";
  if (a.includes("redovisning")) return "redovisning";
  if (a.includes("introduktion")) return "obligatorisk";
  return null;
}

function fail(msg) {
  throw new Error(`TimeEdit-parsning: ${msg}`);
}

// json → delpass [{date, start, end, subcourse, kind, title, place}],
// sorterade deterministiskt. subcourses = schedule.subcourses ({id, name}).
export function parseTimeEdit(json, subcourses) {
  if (json === null || typeof json !== "object") fail("svaret är inte ett JSON-objekt.");
  if (!Array.isArray(json.columnheaders)) fail("fältet columnheaders saknas eller är ingen array.");
  if (!Array.isArray(json.reservations)) fail("fältet reservations saknas eller är ingen array.");
  if (json.reservations.length === 0) fail("reservations är tom — noll pass är aldrig ett rimligt schema.");

  const col = {};
  for (const name of [HEADER_DELKURS, HEADER_TYP, HEADER_PLATS, HEADER_KOMMENTAR]) {
    const i = json.columnheaders.indexOf(name);
    if (i === -1) fail(`kolumnen "${name}" saknas i columnheaders: ${JSON.stringify(json.columnheaders)}.`);
    col[name] = i;
  }

  const slots = json.reservations.map((r, idx) => {
    const ref = `reservation ${idx} (id ${r?.id ?? "?"})`;
    if (r === null || typeof r !== "object") fail(`${ref} är inget objekt.`);
    for (const f of ["startdate", "enddate"]) {
      if (!DATE_RE.test(r[f] ?? "")) fail(`${ref}: ${f} är inte ÅÅÅÅ-MM-DD: ${JSON.stringify(r[f])}.`);
    }
    for (const f of ["starttime", "endtime"]) {
      if (!TIME_RE.test(r[f] ?? "")) fail(`${ref}: ${f} är inte TT:MM: ${JSON.stringify(r[f])}.`);
    }
    if (r.startdate !== r.enddate) {
      fail(`${ref} sträcker sig över flera dagar (${r.startdate}–${r.enddate}) — det har aldrig förekommit och hanteras inte.`);
    }
    if (!Array.isArray(r.columns) || r.columns.length !== json.columnheaders.length) {
      fail(`${ref}: columns har ${r.columns?.length ?? "inga"} fält, columnheaders har ${json.columnheaders.length}.`);
    }
    if (r.columns.some((c) => typeof c !== "string")) fail(`${ref}: columns innehåller icke-strängar.`);

    const delkursCell = r.columns[col[HEADER_DELKURS]].trim();
    // Delkurskolumnen kan ha suffix efter kommatecken ("Databaser, skriftlig tentamen").
    const sub = subcourses.find((s) => delkursCell === s.name || delkursCell.startsWith(`${s.name},`));
    if (!sub) fail(`${ref}: okänd delkurs ${JSON.stringify(delkursCell)} — lägg till den i schedule.subcourses eller utred formatändring.`);

    const activity = r.columns[col[HEADER_TYP]].trim();
    const comment = r.columns[col[HEADER_KOMMENTAR]].trim();
    return {
      date: r.startdate,
      start: r.starttime,
      end: r.endtime,
      subcourse: sub.id,
      kind: kindOf(activity),
      title: comment || activity,
      place: r.columns[col[HEADER_PLATS]].trim(),
    };
  });

  return slots.sort((a, b) =>
    (a.date + a.start + a.subcourse + a.place).localeCompare(b.date + b.start + b.subcourse + b.place, "sv")
  );
}

// Platssträngar i jämförbar form: schedule.js skriver "EC2:PC011/015/059",
// TimeEdit "EC2:PC011, EC2:PC015, EC2:PC059". Delar upp på , och /,
// återställer förkortade siffergrupper med första delens prefix, sorterar.
export function canonPlace(place) {
  const parts = place.split(/[,/]/).map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) return "";
  const prefix = parts[0].replace(/\d+$/, "");
  return parts
    .map((p) => (/^\d+$/.test(p) ? prefix + p : p))
    .map((p) => p.replace(/\s+/g, " "))
    .sort((a, b) => a.localeCompare(b, "sv"))
    .join(" | ");
}

function* eachDate(from, to) {
  const end = Date.parse(`${to}T00:00:00Z`);
  for (let t = Date.parse(`${from}T00:00:00Z`); t <= end; t += 86400_000) {
    yield new Date(t).toISOString().slice(0, 10);
  }
}

// Kurerade sessions → delpass-atomer på TimeEdits granularitet:
// "A / B"-tider blir en atom per starttid, dateEnd blir en atom per dag.
export function expandSessions(sessions) {
  const atoms = [];
  for (const s of sessions) {
    let starts;
    if (s.time.includes("/")) starts = s.time.split("/").map((t) => t.trim());
    else if (s.time.includes("–")) starts = [s.time.split("–")[0].trim()];
    else fail(`sessionen ${s.date} "${s.title}" har oväntat tidsformat: ${JSON.stringify(s.time)}.`);
    if (starts.some((t) => !TIME_RE.test(t))) {
      fail(`sessionen ${s.date} "${s.title}" har starttid som inte är TT:MM: ${JSON.stringify(s.time)}.`);
    }
    for (const date of eachDate(s.date, s.dateEnd ?? s.date)) {
      for (const start of starts) {
        atoms.push({ date, start, subcourse: s.subcourse, kind: s.kind, place: s.place, session: s });
      }
    }
  }
  return atoms;
}

function pairBy(as, bs, keyFn) {
  const byKey = new Map();
  for (const b of bs) {
    const k = keyFn(b);
    if (!byKey.has(k)) byKey.set(k, []);
    byKey.get(k).push(b);
  }
  const pairs = [];
  const leftoverA = [];
  for (const a of as) {
    const bucket = byKey.get(keyFn(a));
    if (bucket?.length) pairs.push([a, bucket.shift()]);
    else leftoverA.push(a);
  }
  return { pairs, leftoverA, leftoverB: [...byKey.values()].flat() };
}

// Klassificerar skillnader mellan kurerade atomer och TimeEdit-delpass.
// Matchning i fallande säkerhet, per delkurs: identiska → borträknade,
// samma dag+kind+tid → ändrad sal, samma dag+kind+plats → ändrad tid,
// samma kind+tid+plats → ändrat datum, resten → nytt/borttaget pass.
export function diffSchedule(atoms, slots) {
  const diffs = { new: [], removed: [], time: [], place: [], date: [] };
  let a = atoms;
  let b = slots;

  const tiers = [
    { key: (x) => [x.subcourse, x.date, x.start, canonPlace(x.place)].join("§"), into: null },
    { key: (x) => [x.subcourse, x.date, x.kind, x.start].join("§"), into: "place" },
    { key: (x) => [x.subcourse, x.date, x.kind, canonPlace(x.place)].join("§"), into: "time" },
    { key: (x) => [x.subcourse, x.kind, x.start, canonPlace(x.place)].join("§"), into: "date" },
  ];
  for (const { key, into } of tiers) {
    const { pairs, leftoverA, leftoverB } = pairBy(a, b, key);
    if (into) diffs[into].push(...pairs.map(([from, to]) => ({ from, to })));
    a = leftoverA;
    b = leftoverB;
  }
  diffs.removed = a;
  diffs.new = b;
  return diffs;
}

export function countDiffs(diffs) {
  return Object.values(diffs).reduce((n, arr) => n + arr.length, 0);
}

// En sessions-rad i schedule.js-form att klistra in efter manuell kurering.
export function proposalLine(slot) {
  const kind = slot.kind ? `"${slot.kind}"` : '"TODO"';
  return `{ date: "${slot.date}", time: "${slot.start}–${slot.end}", subcourse: "${slot.subcourse}", title: "${slot.title.replace(/"/g, '\\"')}", place: "${slot.place}", kind: ${kind} },`;
}
