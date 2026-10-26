// Kör lösningsförslagen i fliken Java (Databaser) på riktigt: varje uppgifts
// `solution` i src/data/databaser/javaTasks.js kompileras med javac in i
// uppgiftens givna DAO-klass och körs mot en riktig databas (H2 i
// MSSQLServer-läge) med testfallen i scripts/java/cases.mjs.
//
//   H2_JAR=/väg/till/h2-2.3.232.jar node scripts/java/verify-solutions.mjs [uppgifts-id …]
//
//   --verbose          visa SQL-satserna och JDBC-anropen i varje fall
//   --keep             behåll den genererade Java-koden (sökvägen skrivs ut)
//   --solution=<fil>   kör ett eget svar (en hel metod) i stället för
//                      lösningsförslaget; kräver precis ett uppgifts-id
//
// Ligger utanför npm test: det kräver en JDK och H2-jarfilen, som inte finns
// i repot (se README.md i den här katalogen). Avslutas med kod 1 om någon
// kontroll fallerar och 2 om miljön saknas.

import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, delimiter, join } from "node:path";
import { fileURLToPath } from "node:url";

import { javaTasks } from "../../src/data/databaser/javaTasks.js";
import { cases as allCases } from "./cases.mjs";

const SUPPORT = fileURLToPath(new URL("./support/", import.meta.url));
const SUPPORT_FILES = ["ConnectionHandler.java", "Harness.java", "Tracker.java"];
const FAULTS = ["drop-table", "execute", "next"];
const TASK_KEYS = ["seed", "cases", "adaptDdl"];
const CASE_KEYS = ["name", "args", "seed", "fault", "expect"];
const EXPECT_KEYS = ["returns", "ordered", "sortedBy", "columns", "rows", "after", "throws"];

// "Du får anta att samtliga klasser som behövs är importerade": harnessen
// lägger till de vanliga importerna i de givna klasserna (utom när en import
// med samma enkla namn redan finns).
const STANDARD_IMPORTS = [
  "java.math.BigDecimal",
  "java.sql.Connection",
  "java.sql.Date",
  "java.sql.PreparedStatement",
  "java.sql.ResultSet",
  "java.sql.SQLException",
  "java.sql.Statement",
  "java.sql.Timestamp",
  "java.time.LocalDate",
  "java.time.LocalDateTime",
  "java.util.ArrayList",
  "java.util.List",
];

// ------------------------------------------------------------------ miljön

const argv = process.argv.slice(2);
const flags = argv.filter((a) => a.startsWith("--"));
const verbose = flags.includes("--verbose");
const keep = flags.includes("--keep");
const solutionFile = flags.find((f) => f.startsWith("--solution="))?.slice("--solution=".length);
const unknownFlags = flags.filter((f) => f !== "--verbose" && f !== "--keep" && !f.startsWith("--solution="));
const ids = argv.filter((a) => !a.startsWith("--"));

function die(message) {
  console.error(message);
  process.exit(2);
}

if (unknownFlags.length) die(`Okänd flagga: ${unknownFlags.join(" ")} (finns: --verbose, --keep, --solution=<fil>)`);
if (solutionFile !== undefined && ids.length !== 1) die("--solution=<fil> kräver precis ett uppgifts-id.");
if (solutionFile !== undefined && !existsSync(solutionFile)) die(`Filen finns inte: ${solutionFile}`);

const jar = process.env.H2_JAR;
if (!jar) die("H2_JAR saknas: sätt H2_JAR till sökvägen till H2-jarfilen (se scripts/java/README.md).");
if (!existsSync(jar)) die(`H2_JAR pekar på en fil som inte finns: ${jar}`);

const javacVersion = spawnSync("javac", ["-version"], { encoding: "utf8" });
if (javacVersion.error || javacVersion.status !== 0) die("javac hittades inte: installera en JDK (17 eller senare).");

const selected = ids.length ? ids.map((id) => javaTasks.find((t) => t.id === id) ?? die(`Okänd uppgift: ${id}`)) : javaTasks;
const tasks = solutionFile === undefined
  ? selected
  : [{ ...selected[0], solution: readFileSync(solutionFile, "utf8").replace(/\s+$/, "") }];

// ------------------------------------------------------------------ Java-källor

const javaString = (s) =>
  `"${String(s)
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t")}"`;
const javaArray = (items) => `new String[] { ${items.map(javaString).join(", ")} }`;
const doubleLiteral = (n) => (/[.eE]/.test(String(n)) ? String(n) : `${n}.0`);
const className = (code) => code.match(/\b(?:class|record|enum|interface)\s+(\w+)/)?.[1];
const indent = (code, n) =>
  code
    .split("\n")
    .map((line) => (line ? " ".repeat(n) + line : line))
    .join("\n");

function withImports(code) {
  const present = new Set([...code.matchAll(/^\s*import\s+([\w.]+)\s*;/gm)].map((m) => m[1].split(".").pop()));
  const extra = STANDARD_IMPORTS.filter((imp) => !present.has(imp.split(".").pop()));
  return `${extra.map((imp) => `import ${imp};`).join("\n")}\n${code}\n`;
}

// "Du får anta att get- och set-metoder finns för samtliga instansvariabler":
// harnessen skriver dem ur de privata instansvariablerna.
function withAccessors(code) {
  const fieldRe = /^[ \t]*private\s+(?!static\b)(final\s+)?([\w.]+(?:<[^;=()]*>)?(?:\[\])*)\s+(\w+)\s*(?:=[^;]*)?;/gm;
  const has = (name) => new RegExp(`\\b${name}\\s*\\(`).test(code);
  const methods = [];
  for (const [, isFinal, type, name] of code.matchAll(fieldRe)) {
    const cap = name[0].toUpperCase() + name.slice(1);
    if (!has(`get${cap}`)) methods.push(`    public ${type} get${cap}() {\n        return ${name};\n    }`);
    if (type === "boolean" && !has(`is${cap}`)) methods.push(`    public boolean is${cap}() {\n        return ${name};\n    }`);
    if (!isFinal && !has(`set${cap}`)) {
      methods.push(`    public void set${cap}(${type} ${name}) {\n        this.${name} = ${name};\n    }`);
    }
  }
  if (!methods.length) return { code, added: 0 };
  const at = code.lastIndexOf("}");
  return {
    code: `${code.slice(0, at).replace(/\s*$/, "")}\n\n    // Tillagt av harnessen.\n${methods.join("\n\n")}\n${code.slice(at)}`,
    added: methods.length,
  };
}

function withSolution(daoCode, solution) {
  const at = daoCode.lastIndexOf("}");
  return `${daoCode.slice(0, at).replace(/\s*$/, "")}\n\n${indent(solution, 4)}\n${daoCode.slice(at)}`;
}

// Ett värde ur testfallet som Java-uttryck av parametertypen.
function javaLiteral(value, type, where) {
  const t = type.replace(/\s+/g, "");
  const fail = (why) => {
    throw new Error(`${where}: ${JSON.stringify(value)} passar inte typen ${type}${why ? ` (${why})` : ""}`);
  };
  if (value === null || value === undefined) {
    if (/^(int|long|short|byte|double|float|boolean|char)$/.test(t)) fail("primitiv typ");
    return `(${type}) null`;
  }
  switch (t) {
    case "String":
      return javaString(value);
    case "int":
    case "Integer":
      if (!Number.isInteger(value)) fail();
      return String(value);
    case "long":
    case "Long":
      if (!Number.isInteger(value)) fail();
      return `${value}L`;
    case "short":
    case "byte":
      if (!Number.isInteger(value)) fail();
      return `(${t}) ${value}`;
    case "double":
    case "Double":
      if (typeof value !== "number") fail();
      return doubleLiteral(value);
    case "float":
    case "Float":
      if (typeof value !== "number") fail();
      return `${value}f`;
    case "boolean":
    case "Boolean":
      if (typeof value !== "boolean") fail();
      return String(value);
    case "char":
    case "Character":
      if (typeof value !== "string" || value.length !== 1) fail();
      return `'${value === "'" ? "\\'" : value === "\\" ? "\\\\" : value}'`;
    case "BigDecimal":
    case "java.math.BigDecimal":
      return `new java.math.BigDecimal(${javaString(value)})`;
    case "LocalDate":
    case "java.time.LocalDate":
      return `java.time.LocalDate.parse(${javaString(value)})`;
    case "LocalDateTime":
    case "java.time.LocalDateTime":
      return `java.time.LocalDateTime.parse(${javaString(value)})`;
    case "Date":
    case "java.sql.Date":
      return `java.sql.Date.valueOf(${javaString(value)})`;
    default: {
      // En objektparameter (en modellklass): { instansvariabel: värde }.
      if (typeof value !== "object" || Array.isArray(value) || !/^\w+$/.test(t)) fail();
      const pairs = Object.entries(value).flatMap(([field, v]) => [javaString(field), boxedLiteral(v, where)]);
      return `Harness.make(${t}.class${pairs.length ? `, ${pairs.join(", ")}` : ""})`;
    }
  }
}

function boxedLiteral(value, where) {
  if (value === null) return "null";
  if (typeof value === "string") return javaString(value);
  if (typeof value === "boolean") return String(value);
  if (typeof value === "number" && Number.isFinite(value)) {
    if (!Number.isInteger(value)) return doubleLiteral(value);
    return Math.abs(value) <= 2147483647 ? String(value) : `${value}L`;
  }
  throw new Error(`${where}: ${JSON.stringify(value)} går inte att skriva som Java-värde`);
}

function sqlLiteral(value) {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "boolean") return value ? "1" : "0";
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error(`seed: ${value} är inget tal`);
    return String(value);
  }
  return `'${String(value).replace(/'/g, "''")}'`;
}

function seedStatements(seed, tables) {
  const byLower = new Map(Object.entries(seed ?? {}).map(([name, rows]) => [name.toLowerCase(), [name, rows]]));
  for (const [lower, [name]] of byLower) {
    if (!tables.some((t) => t.toLowerCase() === lower)) throw new Error(`seed: tabellen ${name} finns inte i uppgiftens DDL`);
  }
  // I DDL-ordningen, så att refererade tabeller fylls först.
  return tables.flatMap((table) =>
    (byLower.get(table.toLowerCase())?.[1] ?? []).map((row) => {
      const cols = Object.keys(row);
      return `INSERT INTO ${table} (${cols.join(", ")}) VALUES (${cols.map((c) => sqlLiteral(row[c])).join(", ")})`;
    }),
  );
}

function driverSource({ daoClass, method, ddl, tables, runnable }) {
  const lines = [
    "// Genererad av scripts/java/verify-solutions.mjs.",
    "public class VerifyDriver {",
    "    public static void main(String[] args) {",
    `        Harness.setup(${javaArray(ddl)}, ${javaArray(tables)});`,
  ];
  for (const { index, call, seed, fault } of runnable) {
    lines.push(
      "",
      `        if (Harness.begin(${index}, ${javaArray(seed)}, ${javaString(fault ?? "")})) {`,
      "            Object result = null;",
      "            Throwable thrown = null;",
      "            try {",
      `                ${daoClass} dao = new ${daoClass}();`,
      ...(method.returns === "void"
        ? [`                ${call};`, "                result = Harness.VOID;"]
        : [`                result = ${call};`]),
      "            } catch (Throwable t) {",
      "                thrown = t;",
      "            }",
      "            Harness.end(result, thrown);",
      "        }",
    );
  }
  lines.push("", "        Harness.finish();", "    }", "}", "");
  return lines.join("\n");
}

// ------------------------------------------------------------------ jämförelser

const show = (v, max = 160) => {
  const s = v === undefined ? "inget" : JSON.stringify(v);
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
};
const fields = (obj) => Object.keys(obj).filter((k) => k !== "$class");

function same(a, b) {
  if (typeof a === "number" && typeof b === "number") {
    return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
  }
  if (a === null || b === null || typeof a !== "object" || typeof b !== "object") return a === b;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a)) return a.length === b.length && a.every((x, i) => same(x, b[i]));
  const ka = fields(a);
  const kb = fields(b);
  return ka.length === kb.length && ka.every((k) => k in b && same(a[k], b[k]));
}

// Matchar varje väntat element mot ett eget faktiskt element (ordningen fri).
function unorderedDiff(expected, actual, match) {
  const left = [...actual];
  const missing = [];
  for (const e of expected) {
    const i = left.findIndex((a) => match(e, a));
    if (i < 0) missing.push(e);
    else left.splice(i, 1);
  }
  return { missing, extra: left };
}

// sortedBy: listan ska vara sorterad på instansvariabeln `field` (lika värden
// i valfri ordning sinsemellan).
function sortProblem(list, { field, dir }) {
  for (let i = 1; i < list.length; i++) {
    const a = list[i - 1]?.[field];
    const b = list[i]?.[field];
    if (dir === "DESC" ? a < b : a > b) {
      return `fel ordning: ${field} ${show(a)} kommer före ${show(b)} (väntade ${dir === "DESC" ? "fallande" : "stigande"} ordning)\n fick: ${show(list.map((x) => x?.[field]), 400)}`;
    }
  }
  return null;
}

function compareReturn(expected, actual, { ordered, sortedBy, model }) {
  const out = [];
  if (expected === null) {
    if (actual !== null) out.push(`väntade null, fick ${show(actual)}`);
    return out;
  }
  if (Array.isArray(expected)) {
    if (actual === null) return ["returnerade null i stället för en lista"];
    if (!Array.isArray(actual)) return [`väntade en lista, fick ${show(actual)}`];
    if (model) {
      const wrong = actual.filter((a) => a?.$class !== model);
      if (wrong.length) out.push(`listan innehåller annat än ${model}: ${show(wrong[0])}`);
    }
    if (ordered) {
      if (!same(expected, actual)) out.push(`fel lista eller fel ordning:\n väntat: ${show(expected, 400)}\n fick:   ${show(actual, 400)}`);
      return out;
    }
    const { missing, extra } = unorderedDiff(expected, actual, same);
    if (missing.length) out.push(`saknas i listan: ${show(missing, 400)}`);
    if (extra.length) out.push(`ska inte vara med i listan: ${show(extra, 400)}`);
    const unsorted = sortedBy && sortProblem(actual, sortedBy);
    if (unsorted) out.push(unsorted);
    return out;
  }
  if (typeof expected === "object") {
    if (actual === null) return [`returnerade null, väntade ${show(expected)}`];
    if (typeof actual !== "object" || Array.isArray(actual)) return [`väntade ett objekt, fick ${show(actual)}`];
    if (model && actual.$class !== model) out.push(`väntade ett ${model}-objekt, fick ${actual.$class}`);
    const notInCase = fields(actual).filter((k) => !(k in expected));
    if (notInCase.length) out.push(`testfallet anger inte instansvariabeln ${notInCase.join(", ")} (ange samtliga)`);
    for (const k of fields(expected)) {
      if (!(k in actual)) out.push(`${actual.$class ?? "objektet"} saknar instansvariabeln ${k}`);
      else if (!same(expected[k], actual[k])) out.push(`${k}: väntat ${show(expected[k])}, fick ${show(actual[k])}`);
    }
    return out;
  }
  if (!same(expected, actual)) out.push(`väntat ${show(expected)}, fick ${show(actual)}`);
  return out;
}

// En väntad rad anger bara de kolumner som ska kontrolleras.
const rowMatches = (expectedRow, actualRow) =>
  Object.keys(expectedRow).every((col) => {
    const key = Object.keys(actualRow).find((k) => k.toLowerCase() === col.toLowerCase());
    return key !== undefined && same(expectedRow[col], actualRow[key]);
  });

function compareTables(c, r, tables) {
  const out = [];
  const after = c.expect?.after ?? {};
  for (const name of Object.keys(after)) {
    if (!tables.some((t) => t.toLowerCase() === name.toLowerCase())) out.push(`expect.after: tabellen ${name} finns inte i uppgiftens DDL`);
  }
  for (const table of tables) {
    const actual = r.after?.[table];
    if (actual == null) {
      out.push(`tabellen ${table} finns inte efter anropet`);
      continue;
    }
    const key = Object.keys(after).find((k) => k.toLowerCase() === table.toLowerCase());
    if (key) {
      const expected = after[key];
      const { missing, extra } = unorderedDiff(expected, actual, rowMatches);
      if (missing.length || extra.length) {
        out.push(
          `${table} efter anropet stämmer inte (${actual.length} rader, väntade ${expected.length})` +
            (missing.length ? `\n saknas:      ${show(missing, 400)}` : "") +
            (extra.length ? `\n ska inte finnas: ${show(extra, 400)}` : ""),
        );
      }
    } else if (!same(r.before?.[table], actual)) {
      const { missing, extra } = unorderedDiff(r.before?.[table] ?? [], actual, same);
      out.push(
        `${table} ändrades men ska vara oförändrad` +
          (missing.length ? `\n borta:  ${show(missing, 400)}` : "") +
          (extra.length ? `\n ny/ändrad: ${show(extra, 400)}` : ""),
      );
    }
  }
  return out;
}

function evaluate(task, c, r, tables) {
  if (!r) return { fails: ["inget resultat från Java (avbröts körningen?)"] };
  if (r.setupError) return { fails: [`databasen kunde inte sättas upp: ${show(r.setupError, 500)}`] };
  const exp = c.expect ?? {};
  const fails = [];
  const notes = [];
  const result = task.check?.result ?? {};

  if (exp.throws) {
    if (!r.threw) fails.push(`väntade ${exp.throws}, men metoden returnerade ${show(r.returned)}: undantaget tystades`);
    else {
      // SQLException godtar underklasserna (H2 kastar t.ex. JdbcSQLSyntaxErrorException).
      const wanted =
        exp.throws === "SQLException"
          ? r.threw.sqlException
          : r.threw.class === exp.throws || r.threw.class.endsWith(`.${exp.throws}`);
      if (!wanted) fails.push(`väntade ${exp.throws}, fick ${r.threw.class}: ${r.threw.message}`);
    }
    if (c.fault && !r.fault?.triggered) fails.push(`felet "${c.fault}" utlöstes aldrig: lösningen gör inte det som fallet testar`);
    if (r.threw) notes.push(`kastade ${r.threw.class.split(".").pop()}${r.threw.injected ? " (det injicerade)" : ""}`);
  } else if (r.threw) {
    fails.push(`kastade ${r.threw.class}: ${r.threw.message}`);
  } else if (task.check?.method?.returns === "void") {
    if (r.returned?.$void !== true) fails.push(`void-metoden gav ${show(r.returned)}`);
    notes.push("void");
  } else if (!("returns" in exp)) {
    fails.push("testfallet saknar expect.returns (eller expect.throws)");
  } else {
    fails.push(...compareReturn(exp.returns, r.returned, { ordered: exp.ordered, sortedBy: exp.sortedBy, model: result.model }));
    notes.push(`→ ${Array.isArray(r.returned) ? `lista med ${r.returned.length}` : show(r.returned, 60)}`);
  }

  // Vad frågan hämtade: kolumnerna i varje ResultSet och antalet lästa rader.
  const resultSets = r.resultSets ?? [];
  if (exp.columns) {
    const want = exp.columns.map((c) => c.toLowerCase()).sort();
    if (!resultSets.length) fails.push(`inget ResultSet öppnades; väntade kolumnerna ${exp.columns.join(", ")}`);
    for (const { columns } of resultSets) {
      const got = (columns ?? []).map((c) => c.toLowerCase()).sort();
      if (!same(want, got)) {
        fails.push(`frågan hämtar kolumnerna ${(columns ?? []).join(", ") || "(okända)"}; den ska hämta endast ${exp.columns.join(", ")}`);
      }
    }
    notes.push(`kolumner: ${exp.columns.join(", ")}`);
  }
  if (exp.rows !== undefined) {
    const read = resultSets.reduce((sum, { rows }) => sum + rows, 0);
    if (read !== exp.rows) fails.push(`läste ${read} rader ur ResultSet, väntade ${exp.rows}`);
    notes.push(`läste ${read} ${read === 1 ? "rad" : "rader"}`);
  }

  if (c.fault !== "drop-table") fails.push(...compareTables(c, r, tables));

  const res = r.resources ?? {};
  if (!res.Connection) fails.push("ingen Connection öppnades via connectionHandler.getConnection()");
  for (const [kind, { opened, closed }] of Object.entries(res)) {
    if (closed < opened) fails.push(`${opened - closed} av ${opened} ${kind} stängdes inte`);
  }
  if (res.Statement || res.CallableStatement) {
    fails.push("createStatement/prepareCall används: kursens form är PreparedStatement via prepareStatement(sql)");
  }
  const closedList = Object.entries(res).map(([kind, { closed }]) => `${closed} ${kind}`);
  notes.push(`stängt: ${closedList.join(", ") || "inget"}`);
  return { fails, notes };
}

// ------------------------------------------------------------------ validering av cases.mjs

function validateSpec(spec) {
  const out = [];
  const unknown = (obj, allowed, where) =>
    Object.keys(obj ?? {})
      .filter((k) => !allowed.includes(k))
      .forEach((k) => out.push(`${where}: okänd nyckel "${k}"`));
  unknown(spec, TASK_KEYS, "uppgiften");
  if (!Array.isArray(spec.cases) || !spec.cases.length) out.push("uppgiften har inga fall (cases)");
  (spec.cases ?? []).forEach((c, i) => {
    const where = `fall ${i + 1}`;
    unknown(c, CASE_KEYS, where);
    unknown(c.expect, EXPECT_KEYS, `${where}.expect`);
    if (!c.name) out.push(`${where}: name saknas`);
    if (!Array.isArray(c.args)) out.push(`${where}: args saknas`);
    if (c.fault && !FAULTS.includes(c.fault)) out.push(`${where}: fault ska vara ${FAULTS.join(" | ")}`);
    if (!c.expect) out.push(`${where}: expect saknas`);
    const e = c.expect ?? {};
    if (e.sortedBy !== undefined) {
      if (typeof e.sortedBy?.field !== "string" || !["ASC", "DESC"].includes(e.sortedBy?.dir)) {
        out.push(`${where}.expect: sortedBy ska vara { field, dir: "ASC" | "DESC" }`);
      }
      if (!Array.isArray(e.returns)) out.push(`${where}.expect: sortedBy kräver att returns är en lista`);
      if (e.ordered) out.push(`${where}.expect: ordered och sortedBy samtidigt`);
    }
    if (e.columns !== undefined && (!Array.isArray(e.columns) || !e.columns.length || !e.columns.every((x) => typeof x === "string"))) {
      out.push(`${where}.expect: columns ska vara en lista med kolumnnamn`);
    }
    if (e.rows !== undefined && !(Number.isInteger(e.rows) && e.rows >= 0)) {
      out.push(`${where}.expect: rows ska vara ett heltal ≥ 0`);
    }
  });
  return out;
}

// ------------------------------------------------------------------ en uppgift

function run(cmd, args, options = {}) {
  return spawnSync(cmd, args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, ...options });
}

function verifyTask(task, root) {
  const checks = [];
  const info = [];
  const check = (ok, label, details = []) => checks.push({ ok, label, details });
  const spec = allCases[task.id];
  const method = task.check?.method;

  // Lösningsförslaget ska börja med uppgiftens signatur (blanktecken fria).
  const javaBlocks = task.blocks.filter((b) => b.lang === "java" && b.code);
  const signature = javaBlocks.filter((b) => !className(b.code)).at(-1)?.code;
  const norm = (s) => s.replace(/\s+/g, " ").replace(/\s*([(),<>\[\]])\s*/g, "$1").trim();
  const head = task.solution.slice(0, task.solution.indexOf("{"));
  if (!signature) check(false, "uppgiften visar ingen metodsignatur som eget kodblock");
  else {
    const sameSignature = norm(signature) === norm(head);
    const who = solutionFile === undefined ? "lösningsförslaget" : "svaret";
    check(sameSignature, `${who} har uppgiftens signatur`, sameSignature ? [] : [`uppgiften: ${norm(signature)}`, `${who}: ${norm(head)}`]);
  }

  const classBlocks = javaBlocks.filter((b) => className(b.code));
  const dao = classBlocks.find((b) => /\bconnectionHandler\b/.test(b.code));
  if (!dao) {
    check(false, "uppgiften visar ingen DAO-klass med connectionHandler");
    return { checks, info };
  }
  if (!method) {
    check(false, "uppgiften saknar check.method (namn, returtyp, parametrar)");
    return { checks, info };
  }

  // DDL ur uppgiften, med eventuella anpassningar för H2.
  let ddl = task.blocks.filter((b) => b.lang === "sql" && /\bCREATE\s+TABLE\b/i.test(b.code)).map((b) => b.code);
  for (const { find, replace, why } of spec?.adaptDdl ?? []) {
    const hit = ddl.some((d) => d.includes(find));
    ddl = ddl.map((d) => d.split(find).join(replace));
    info.push(`anpassad DDL för H2: "${find}" → "${replace}" (${why})`);
    if (!hit) check(false, `adaptDdl: "${find}" finns inte i uppgiftens DDL`);
  }
  const tables = [...ddl.join("\n").matchAll(/\bCREATE\s+TABLE\s+(?:\[?dbo\]?\.)?\[?(\w+)\]?/gi)].map((m) => m[1]);
  if (!tables.length) check(false, "uppgiften visar ingen CREATE TABLE");

  // Testfallen, med varje fall översatt till ett Java-anrop.
  const specErrors = spec ? validateSpec(spec) : ["inga testfall i scripts/java/cases.mjs"];
  if (specErrors.length) check(false, "testfallen i cases.mjs", specErrors);
  const caseList = spec?.cases ?? [];
  const runnable = [];
  const codegenErrors = new Map();
  caseList.forEach((c, index) => {
    try {
      const args = c.args ?? [];
      if (args.length !== method.params.length) {
        throw new Error(`${args.length} argument, metoden har ${method.params.length} parametrar`);
      }
      const call = `dao.${method.name}(${args.map((v, k) => javaLiteral(v, method.params[k][0], `argument ${k + 1}`)).join(", ")})`;
      runnable.push({ index, call, seed: seedStatements(c.seed ?? spec.seed, tables), fault: c.fault });
    } catch (e) {
      codegenErrors.set(index, e.message);
    }
  });
  if (caseList.length && !caseList.some((c) => c.fault)) {
    check(false, "undantagsvägen testas inte (inget fall med fault)");
  }

  // Källfilerna: harnessens stöd, de givna klasserna och drivern.
  const dir = join(root, task.id);
  const out = join(dir, "classes");
  mkdirSync(out, { recursive: true });
  const files = [];
  const write = (name, code) => {
    writeFileSync(join(dir, name), code);
    files.push(join(dir, name));
  };
  for (const f of SUPPORT_FILES) {
    copyFileSync(join(SUPPORT, f), join(dir, f));
    files.push(join(dir, f));
  }
  for (const model of classBlocks.filter((b) => b !== dao)) {
    const { code, added } = withAccessors(model.code);
    write(`${className(model.code)}.java`, withImports(code));
    info.push(`${className(model.code)}: given klass${added ? `, ${added} get-/set-metoder tillagda` : ""}`);
  }
  const daoClass = className(dao.code);
  write(`${daoClass}.java`, withImports(withSolution(dao.code, task.solution)));
  info.push(`${daoClass}: given klass med lösningsförslaget; ConnectionHandler från harnessen`);
  write("VerifyDriver.java", driverSource({ daoClass, method, ddl, tables, runnable }));

  const javac = run("javac", ["--release", "17", "-encoding", "UTF-8", "-nowarn", "-cp", jar, "-d", out, ...files]);
  const compiled = javac.status === 0;
  const javacOutput = (javac.stderr || javac.stdout).split(`${dir}/`).join("").trim();
  check(compiled, "kompilerar (javac --release 17)", compiled ? [] : javacOutput.split("\n"));
  if (!compiled || !caseList.length) return { checks, info, dir };

  const java = run("java", ["-cp", [jar, out].join(delimiter), "VerifyDriver"], { timeout: 120_000 });
  const results = new Map();
  let done = false;
  for (const line of (java.stdout ?? "").split("\n")) {
    if (line.startsWith("@@CASE ")) {
      const r = JSON.parse(line.slice(7));
      results.set(r.index, r);
    } else if (line.startsWith("@@DONE")) done = true;
  }
  if (!done) {
    check(false, "körningen avslutades inte normalt", [
      ...(java.error ? [String(java.error.message)] : []),
      ...(java.stderr ?? "").trim().split("\n").slice(-15),
    ]);
  }

  caseList.forEach((c, index) => {
    const label = `${index + 1}. ${c.name ?? "(namnlöst fall)"}`;
    if (codegenErrors.has(index)) {
      check(false, label, [`testfallet: ${codegenErrors.get(index)}`]);
      return;
    }
    const r = results.get(index);
    const { fails, notes = [] } = evaluate(task, c, r, tables);
    const details = [...fails];
    if (verbose && r && !r.setupError) {
      details.push(...r.sql.map((s) => `sql:   ${s.replace(/\s+/g, " ")}`), `anrop: ${r.calls.join(", ")}`);
    }
    checks.push({ ok: !fails.length, label, note: notes.join(" · "), details });
  });
  return { checks, info, dir };
}

// ------------------------------------------------------------------ rapporten

const root = mkdtempSync(join(tmpdir(), "java-verify-"));
console.log(
  solutionFile === undefined
    ? "Lösningsförslagen i fliken Java, körda mot H2 i MSSQLServer-läge"
    : `Eget svar (${solutionFile}) mot ${tasks[0].id}, kört mot H2 i MSSQLServer-läge`,
);
console.log(`${javacVersion.stderr.trim() || javacVersion.stdout.trim()} (--release 17) · ${basename(jar)}`);

let pass = 0;
let fail = 0;
let failedTasks = 0;
for (const task of tasks) {
  console.log(`\n${task.id} · ${task.title}`);
  let checks;
  let info = [];
  try {
    ({ checks, info } = verifyTask(task, root));
  } catch (e) {
    checks = [{ ok: false, label: "harnessen kunde inte köra uppgiften", details: [e.stack ?? String(e)] }];
  }
  for (const line of info) if (verbose || line.startsWith("anpassad")) console.log(`  info  ${line}`);
  for (const { ok, label, note, details } of checks) {
    console.log(`  ${ok ? "PASS" : "FAIL"}  ${label}${note ? `  [${note}]` : ""}`);
    for (const d of details) for (const line of d.split("\n")) console.log(`        ${line}`);
  }
  const bad = checks.filter((c) => !c.ok).length;
  pass += checks.length - bad;
  fail += bad;
  if (bad) failedTasks++;
}

console.log(
  `\nTotalt: ${tasks.length} uppgifter, ${pass + fail} kontroller: ${pass} PASS, ${fail} FAIL` +
    (failedTasks ? ` (${failedTasks} uppgifter med fel)` : ""),
);
if (keep) console.log(`Genererad Java-kod: ${root}`);
else rmSync(root, { recursive: true, force: true });
process.exit(fail ? 1 : 0);
