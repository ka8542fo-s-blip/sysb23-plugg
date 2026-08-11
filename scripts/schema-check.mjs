// Veckokontroll av schemat mot TimeEdit. Körs av
// .github/workflows/schema-check.yml men går även lokalt:
//
//   TIMEEDIT_URL="https://cloud.timeedit.net/…/ri….json" node scripts/schema-check.mjs
//
// Hämtar TimeEdits JSON, jämför delpass från och med idag med sessions i
// src/data/schedule.js och skriver en markdownrapport när något skiljer.
// Rapporterar bara — schedule.js ändras aldrig automatiskt, med ett enda
// undantag: fältet lastChecked stämplas efter varje lyckad kontroll.
// Vid HTTP-fel, tomt svar eller oväntad struktur avbryts körningen innan
// någon fil rörs.
import { readFileSync, writeFileSync, appendFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  parseTimeEdit,
  expandSessions,
  diffSchedule,
  countDiffs,
  proposalLine,
} from "./timeedit-parse.mjs";
import { schedule } from "../src/data/schedule.js";

const SCHEDULE_PATH = new URL("../src/data/schedule.js", import.meta.url);
const REPORT_PATH = join(process.env.RUNNER_TEMP || tmpdir(), "schema-diff.md");

const url = process.env.TIMEEDIT_URL;
if (!url) {
  console.error("TIMEEDIT_URL är inte satt — lägg den som repovariabel (ri-URL:en med .json).");
  process.exit(1);
}

const res = await fetch(url, { headers: { accept: "application/json" } });
if (!res.ok) {
  console.error(`TimeEdit svarade HTTP ${res.status} ${res.statusText} — avbryter utan att röra några filer.`);
  process.exit(1);
}
const body = await res.text();
if (body.trim() === "") {
  console.error("TimeEdit svarade med tom kropp — avbryter utan att röra några filer.");
  process.exit(1);
}
let json;
try {
  json = JSON.parse(body);
} catch {
  console.error(`TimeEdit-svaret är inte JSON (börjar: ${JSON.stringify(body.slice(0, 120))}) — avbryter.`);
  process.exit(1);
}

// parseTimeEdit kastar med tydligt meddelande vid oväntad struktur;
// låt det fälla processen med stackspår i Actions-loggen.
const slots = parseTimeEdit(json, schedule.subcourses);

const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Stockholm" });
// Passerade pass är ointressanta, och TimeEdits fönster bakåt är okänt —
// jämför bara framtiden (inklusive idag).
const atoms = expandSessions(schedule.sessions).filter((a) => a.date >= today);
const future = slots.filter((s) => s.date >= today);

const diffs = diffSchedule(atoms, future);
const n = countDiffs(diffs);

const nameOf = Object.fromEntries(schedule.subcourses.map((s) => [s.id, s.short]));
const slotLabel = (s) => `${s.date} kl ${s.start}–${s.end} · ${nameOf[s.subcourse]} · ”${s.title}” · ${s.place}`;
const atomLabel = (a) => {
  const merged = a.session.dateEnd || a.session.time.includes("/") ? " (delpass av sammanslagen post)" : "";
  return `${a.date} kl ${a.start} · ${nameOf[a.subcourse]} · ”${a.session.title}”${merged}`;
};

if (n > 0) {
  const rows = [
    ...diffs.new.map((s) => `- **Nytt pass:** ${slotLabel(s)}`),
    ...diffs.removed.map((a) => `- **Borttaget pass:** ${atomLabel(a)}`),
    ...diffs.time.map(({ from, to }) => `- **Ändrad tid:** ${atomLabel(from)} — ${from.start} → ${to.start}–${to.end}`),
    ...diffs.place.map(({ from, to }) => `- **Ändrad sal:** ${atomLabel(from)} — ${from.place} → ${to.place}`),
    ...diffs.date.map(({ from, to }) => `- **Ändrat datum:** ${atomLabel(from)} — ${from.date} → ${to.date}`),
  ];
  const proposals = [...diffs.new, ...diffs.time, ...diffs.place, ...diffs.date]
    .map((d) => proposalLine(d.to ?? d))
    .map((line) => `  ${line}`);

  const report = `TimeEdit skiljer sig från \`src/data/schedule.js\` på ${n} punkt${n === 1 ? "" : "er"}
(kontroll ${today}, pass från och med idag, sammanslagna poster jämförda per delpass).

${rows.join("\n")}

## Förslag på sessions-poster

Rått ur TimeEdit — kurera titel och \`kind\`, och slå ihop grupp-/flerdagarspass
som i övriga poster, innan du klistrar in. Borttagna pass tas bort ur \`sessions\`.

\`\`\`js
${proposals.join("\n") || "  // (bara borttagna pass — inget att lägga till)"}
\`\`\`

## Kom ihåg

- \`periods\`, \`weeks\` och \`heaviestStretch\` är manuellt kurerade och ska INTE röras automatiskt — bedöm själv om ändringarna påverkar dem.
- Tentor ligger även i \`exams\`-listan — uppdatera båda ställena.
- Uppdatera \`verifiedOn\` när ändringarna är införda.
`;
  writeFileSync(REPORT_PATH, report);
  console.log(`${n} skillnader — rapport skriven till ${REPORT_PATH}\n`);
  console.log(rows.join("\n"));
} else {
  console.log(`Inga skillnader mot TimeEdit (kontroll ${today}, ${future.length} kommande delpass).`);
}

if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `changes=${n > 0}\nreport=${REPORT_PATH}\n`);
}

// Stämpla lastChecked — enda automatiska skrivningen i schedule.js, och
// bara nu, efter att hämtning och parsning bevisligen lyckats.
const src = readFileSync(SCHEDULE_PATH, "utf8");
const matches = src.match(/lastChecked: "\d{4}-\d{2}-\d{2}"/g) ?? [];
if (matches.length !== 1) {
  console.error(`Hittade ${matches.length} lastChecked-fält i schedule.js — vägrar skriva.`);
  process.exit(1);
}
const next = src.replace(/lastChecked: "\d{4}-\d{2}-\d{2}"/, `lastChecked: "${today}"`);
if (next !== src) {
  writeFileSync(SCHEDULE_PATH, next);
  console.log(`lastChecked uppdaterad till ${today}.`);
}
