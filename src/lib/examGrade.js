// Poängen i fliken Tenta. Inga egna motorer: uppgift 1 räknas av
// statementScore, uppgift 2 rättas av ddlCheck, uppgift 3 av FD-motorn och
// fdGrade, uppgift 4 körs i samma sql.js + tsql-lager som SQL-verkstaden.
// Det här är bara poängsättningen ovanpå, med tentans regler där tentan
// anger dem och märkta uppskattningar där den inte gör det (uppgift 2 och
// 3f–g).
import { scoreStatements } from "./statementScore.js";
import {
  attrsOf, braceText, setText, allCandidateKeys, projectFds, toFds, relationNF, isLossless, losslessSteps,
  dependencyReport, has, sameSet, fdText, NF_NAME,
} from "./fd.js";
import { checkTsqlRules, toSqlite, sqliteSeed } from "./tsql.js";
import { compareResults, splitStatements, interpretError } from "./sqlCheck.js";

// ---------- Uppgift 1 ----------

export const scoreTask1 = (task, marked) => scoreStatements(task.statements, marked ?? []);

// ---------- Uppgift 2: uppskattade avdrag ----------

// Avdrag per fel, utgående från 25. Tentan anger inte avdragen, så det här
// är en uppskattning — justera här. `kolumn` (saknad eller överflödig vanlig
// kolumn) finns inte i uppdragets tabell och är satt lågt.
export const DDL_DEDUCTIONS = {
  tabell: 5,      // saknad tabell
  pk: 3,          // fel eller saknad PRIMARY KEY
  fk: 3,          // saknad eller felplacerad främmande nyckel
  unique: 2,      // saknad (eller ogrundad) UNIQUE
  notnull: 2,     // saknad eller felaktig NOT NULL
  surrogat: 2,    // surrogatnyckel saknas, eller finns där den inte ska
  overflodig: 3,  // överflödig tabell
  kolumn: 1,      // saknad eller överflödig vanlig kolumn
};

export const DDL_LABELS = {
  tabell: "saknad tabell",
  pk: "PRIMARY KEY",
  fk: "främmande nyckel",
  unique: "UNIQUE",
  notnull: "NOT NULL",
  surrogat: "surrogatnyckel",
  overflodig: "överflödig tabell",
  kolumn: "kolumn",
};

// result = checkDdl(...). Syntaxfel som hindrar tolkning ger 0.
export function estimateDdl(result, max = 25, table = DDL_DEDUCTIONS) {
  if (!result) return null;
  if (result.status === "parse-error") return { points: 0, max, deductions: [], parseError: true };
  const deductions = [];
  for (const t of result.tables) {
    for (const p of t.problems) {
      const kind = p.kind ?? "kolumn";
      deductions.push({ table: t.name, kind, points: table[kind] ?? 0, text: p.text });
    }
  }
  for (const x of result.extra) deductions.push({ table: x.name, kind: "overflodig", points: table.overflodig, text: `${x.name}: överflödig tabell. ${x.why}` });
  const total = deductions.reduce((sum, d) => sum + d.points, 0);
  return { points: Math.max(0, max - total), max, deductions, parseError: false };
}

// ---------- Uppgift 3a–e: FD-motorn avgör ----------

const relationsOf = (task, schemaNo) => task.schemas[schemaNo - 1].relations.map(([name, attrs]) => ({ name, attrs: attrsOf(attrs) }));
const keysOf = (attrs, F) => allCandidateKeys(attrs, projectFds(attrs, toFds(F)));
const relText = (rel) => `${rel.name}(${rel.attrs.join(", ")})`;

// Avgör ett påstående och skriv ett "varför". claim.type:
//   lossless | preserving                 — nedbrytningens egenskaper
//   allNF { min }                         — alla relationer i schemat i minst min-NF
//   isCK { relation, attrs }              — attributmängden är en kandidatnyckel
//   manyCK { relation }                   — relationen har fler än en kandidatnyckel
//   prime { relation, attr }              — attributet är primärattribut
export function claimTruth(task, claim) {
  const R = attrsOf(task.attrs);
  const F = task.fds;
  const rels = relationsOf(task, claim.schema);
  const schemaName = `Schema ${claim.schema}`;
  const rel = claim.relation ? rels.find((x) => x.name === claim.relation) : null;
  switch (claim.type) {
    case "lossless": {
      const decomposition = rels.map((x) => x.attrs);
      const truth = isLossless(R, F, decomposition);
      const steps = losslessSteps(R, F, decomposition);
      let why;
      if (truth && steps.byPairs) {
        const name = (idx) => idx.map((i) => rels[i].name).join(" join ");
        why = `${schemaName} går att joina tillbaka två delar i taget: ${steps.steps.map((s) => `${name(s.left.names)} och ${name(s.right.names)} delar ${braceText(s.common)}, som bestämmer ${s.covers === "right" ? name(s.right.names) : name(s.left.names)} helt`).join("; ")}. Joinen ger tillbaka R.`;
      } else if (truth) {
        why = `Tablåprovet visar att den naturliga joinen ger tillbaka R.`;
      } else {
        const keys = allCandidateKeys(R, F);
        why = `Ingen relation i ${schemaName} innehåller kandidatnyckeln ${keys.map(braceText).join(" eller ")}, och de gemensamma attributen bestämmer inte en hel del i någon join. Joinen kan ge spurious tuples — tuples som inte fanns i R.`;
      }
      return { truth, why };
    }
    case "preserving": {
      const report = dependencyReport(R, F, rels.map((x) => x.attrs));
      const lost = report.filter((x) => !x.preserved);
      const truth = lost.length === 0;
      const why = truth
        ? `Varje beroende står i en relation i ${schemaName} eller följer av de lokala beroendena: ${report.map((x) => `${x.fd.text || fdText(x.fd)} i ${x.direct !== null ? rels[x.direct].name : "flera relationer"}`).join(", ")}.`
        : `${lost.map((x) => x.fd.text || fdText(x.fd)).join(" och ")} går förlorat: attributen hamnar i olika relationer, och de lokala beroendena räcker inte för att härleda det.`;
      return { truth, why };
    }
    case "allNF": {
      const per = rels.map((x) => ({ rel: x, nf: relationNF(x.attrs, F).nf, cks: keysOf(x.attrs, F) }));
      const bad = per.filter((p) => p.nf < claim.min);
      const truth = bad.length === 0;
      const list = per.map((p) => `${relText(p.rel)} ${NF_NAME[p.nf]} (CK ${p.cks.map(braceText).join(", ")})`).join(", ");
      const why = truth
        ? `${rels.length === 1 ? "Relationen" : "Alla relationer"} når ${NF_NAME[claim.min]}: ${list}.`
        : `${bad.map((p) => `${relText(p.rel)} är bara i ${NF_NAME[p.nf]}`).join(", ")}${violationText(bad[0], F)} Per relation: ${list}.`;
      return { truth, why };
    }
    case "isCK": {
      const cks = keysOf(rel.attrs, F);
      const truth = cks.some((k) => sameSet(k, claim.attrs));
      const why = `I ${relText(rel)} är kandidatnyckeln ${cks.map(braceText).join(" och ")}${truth ? "." : `, så ${setText(claim.attrs)} ensamt är ${cks.some((k) => claim.attrs.every((a) => has(k, a))) ? "bara en del av nyckeln" : "ingen kandidatnyckel"}.`}`;
      return { truth, why };
    }
    case "manyCK": {
      const cks = keysOf(rel.attrs, F);
      const truth = cks.length > 1;
      return { truth, why: `${relText(rel)} har ${cks.length === 1 ? "bara kandidatnyckeln" : "kandidatnycklarna"} ${cks.map(braceText).join(" och ")}.${truth ? "" : ` Ingen annan minimal attributmängd når alla attribut med beroendena inom relationen.`}` };
    }
    case "prime": {
      const cks = keysOf(rel.attrs, F);
      const truth = cks.some((k) => has(k, claim.attr));
      return { truth, why: `${relText(rel)} har kandidatnyckeln ${cks.map(braceText).join(" och ")}. ${claim.attr} ${truth ? "är med i den och är därför ett primärattribut" : "är inte med i någon kandidatnyckel och är därför ett icke-primärattribut"}.` };
    }
    default:
      throw new Error(`Okänd utsaga: ${claim.type}`);
  }
}

function violationText(p, F) {
  if (!p) return ".";
  const local = projectFds(p.rel.attrs, toFds(F));
  const nonPrime = p.rel.attrs.filter((a) => !p.cks.some((k) => has(k, a)));
  for (const fd of local) {
    const attr = fd.rhs.find((a) => nonPrime.includes(a) && !has(fd.lhs, a));
    if (!attr) continue;
    const ck = p.cks.find((k) => fd.lhs.every((a) => has(k, a)) && fd.lhs.length < k.length);
    if (p.nf === 1 && ck) return `: ${setText(fd.lhs)} är en äkta delmängd av kandidatnyckeln ${braceText(ck)} och bestämmer icke-primärattributet ${attr} (partiellt beroende).`;
    if (p.nf === 2 && !ck && !p.cks.some((k) => k.every((a) => has(fd.lhs, a)))) return `: ${setText(fd.lhs)} är ingen superkey och bestämmer icke-primärattributet ${attr} (transitivt beroende).`;
  }
  return ".";
}

// answers: { "3a": "S" | "F" | null, … }. +2 rätt, −1 fel, 0 obesvarad.
export function scoreTask3ae(task, answers) {
  const rows = task.statements.map((s) => {
    const { truth, why } = claimTruth(task, s.claim);
    const given = answers?.[s.label] ?? null;
    const expected = truth ? "S" : "F";
    const points = given === null ? 0 : given === expected ? 2 : -1;
    return { label: s.label, expected, given, points, why };
  });
  return { rows, points: rows.reduce((sum, r) => sum + r.points, 0), max: 2 * rows.length };
}

// ---------- Uppgift 3f–g: uppskattning av 5 p ----------

// grade = gradeAnswer(item, draft). Normalform och motivering 2 p,
// nedbrytningen 3 p (lossless, beroendebevarande, 3NF utan
// övernormalisering — en poäng var, alla tre om den stämmer med facit).
// Är R redan i 3NF ger rätt normalform 2 p och "ingen nedbrytning" 3 p.
export function scoreTask3fg(item, grade, draft) {
  if (!grade) return null;
  const parts = [];
  const nf = grade.fields.nf;
  const motivation = grade.fields.motivation;
  let nfPoints = 0;
  if (nf.ok) nfPoints = !motivation || motivation.ok ? 2 : 1;
  parts.push({
    label: "Högsta normalform och motivering",
    points: nfPoints,
    max: 2,
    text: !nf.ok
      ? `Normalformen är ${nf.expected}, inte ${nf.given ?? "angiven"}.`
      : motivation && !motivation.ok
        ? `${nf.expected} är rätt, men motiveringen pekar inte på ett beroende som bryter ${nf.expected === "1NF" ? "2NF" : "3NF"}.`
        : motivation
          ? `${nf.expected} med en motivering som pekar på rätt beroende.`
          : `${nf.expected} — motivering krävs inte.`,
  });

  const wrote = Boolean((draft?.text || "").trim());
  if (grade.expectedNf === "3NF") {
    const ok = !(draft?.nf && draft.nf !== "3NF" && wrote);
    parts.push({ label: "Ingen nedbrytning", points: ok && nf.ok ? 3 : 0, max: 3, text: ok && nf.ok ? "R är redan i 3NF: rätt svar är att inte dela upp den." : "R är redan i 3NF. En nedbrytning här är övernormalisering." });
  } else {
    const dec = grade.fields.decomposition;
    const props = dec?.properties;
    if (dec?.ok) {
      parts.push({ label: "Nedbrytning", points: 3, max: 3, text: "Lossless, beroendebevarande, alla relationer i 3NF och ingen övernormalisering." });
    } else if (!props) {
      parts.push({ label: "Nedbrytning", points: 0, max: 3, text: wrote ? "Nedbrytningen gick inte att tolka." : "Ingen nedbrytning angiven." });
    } else {
      const all3 = props.relations.length > 0 && props.relations.every((x) => x.nf === 3) && props.missingAttrs.length === 0 && props.unknown.length === 0;
      const facitCount = item.facit?.length ?? 0;
      const over = props.relations.length > facitCount;
      const sub = [
        { ok: props.lossless, text: props.lossless ? "lossless join" : "inte lossless join" },
        { ok: props.preserving, text: props.preserving ? "beroendebevarande" : "inte beroendebevarande" },
        { ok: all3 && !over, text: !all3 ? "inte alla relationer i 3NF" : over ? `övernormaliserad (${props.relations.length} relationer, facit har ${facitCount})` : "3NF utan övernormalisering" },
      ];
      parts.push({ label: "Nedbrytning", points: sub.filter((s) => s.ok).length, max: 3, text: `${sub.map((s) => s.text).join(", ")}.` });
    }
  }
  return { parts, points: parts.reduce((sum, p) => sum + p.points, 0), max: 5 };
}

// ---------- Uppgift 4: SQL mot tentans data ----------

const sqlValue = (v) => (typeof v === "number" ? String(v) : `'${String(v).replace(/'/g, "''")}'`);

// Tentans tabeller som T-SQL-seed, med eventuella ändringar (kontrolldata).
export function examSeed(tables, changes = []) {
  return tables.map((t) => {
    const rows = t.rows.map((row) => {
      const key = row[0];
      return row.map((value, i) => {
        const change = changes.find((c) => c.table === t.name && c.key === key && c.column === t.columns[i][0]);
        return change ? change.value : value;
      });
    });
    const create = `CREATE TABLE ${t.name} (\n${t.columns.map(([n, type]) => `    ${n} ${type}`).join(",\n")}\n);`;
    const insert = `INSERT INTO ${t.name} (${t.columns.map(([n]) => n).join(", ")}) VALUES\n${rows.map((row) => `    (${row.map(sqlValue).join(", ")})`).join(",\n")};`;
    return `${create}\n${insert}`;
  }).join("\n\n");
}

// engine = { SQL } där SQL är sql.js-modulen (initSqlJs()).
function runOn(SQL, seed, sql) {
  const db = new SQL.Database();
  try {
    db.run(sqliteSeed(seed));
    const stmt = db.prepare(sql);
    try {
      const values = [];
      while (stmt.step()) values.push(stmt.get());
      return { columns: stmt.getColumnNames(), values };
    } finally {
      stmt.free();
    }
  } finally {
    db.close();
  }
}

// Rätt resultat ger 30, fel resultat 0 (checklistan för självbedömning
// visas i vyn). Godtas: SQL Servers resultat (task.expected) eller det
// facitfrågan ger i SQLite — de skiljer sig bara vid AVG över INTEGER.
export function gradeTask4(SQL, task, userSql) {
  const trimmed = (userSql || "").trim();
  if (!trimmed) return { status: "empty", points: 0, message: "Skriv en fråga innan du rättar." };
  if (splitStatements(trimmed).length > 1) return { status: "error", points: 0, message: "Svaret innehåller flera satser. Uppgiften kräver en (1) fråga med ett resultat." };
  const rule = checkTsqlRules(trimmed);
  if (rule) return { status: "error", points: 0, message: rule.message };
  const seed = examSeed(task.tables);
  let user;
  try {
    user = runOn(SQL, seed, toSqlite(trimmed));
  } catch (error) {
    return { status: "error", points: 0, message: interpretError(error.message, trimmed) || error.message };
  }
  const sqlite = runOn(SQL, seed, toSqlite(task.solution));
  const matches = (got, want) => compareResults(got, want, false);
  const vsServer = matches(user, task.expected);
  const vsSqlite = matches(user, sqlite);
  const ok = vsServer.ok || vsSqlite.ok;
  let control = null;
  if (ok && task.control) {
    const controlSeed = examSeed(task.tables, task.control.changes);
    const got = runOn(SQL, controlSeed, toSqlite(trimmed));
    const want = runOn(SQL, controlSeed, toSqlite(task.solution));
    const cmp = matches(got, task.control.expected).ok || matches(got, want).ok;
    control = { ok: cmp, label: task.control.label, user: got, expected: task.control.expected };
  }
  const correct = ok && (!control || control.ok);
  return {
    status: correct ? "correct" : "wrong",
    points: correct ? 30 : 0,
    user,
    expected: task.expected,
    sqlite,
    control,
    message: correct
      ? "Resultatet stämmer med facit."
      : ok && control && !control.ok
        ? `Resultatet stämmer på tentans data, men inte på kontrolldatan (${control.label}). Frågan svarar alltså inte på uppgiften i allmänhet.`
        : vsServer.message,
  };
}
