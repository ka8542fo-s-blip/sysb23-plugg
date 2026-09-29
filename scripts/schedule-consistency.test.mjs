// Schemats handskrivna delar ska stämma med passen. Schemabevakningen
// jämför bara `sessions` mot TimeEdit; veckoöversikten, tentalistan och
// delkursernas datum är manuellt kurerade och kontrolleras här i stället.
// Deploy-bygget kör testerna, så ett schema som inte hänger ihop kan inte
// publiceras.
import { test } from "node:test";
import assert from "node:assert/strict";
import { schedule } from "../src/data/schedule.js";

const isRetake = (s) => /omtent/i.test(s.title);
const DATE = /^\d{4}-\d{2}-\d{2}$/;

test("varje pass har giltigt datum, känd delkurs, tid och sal", () => {
  const ids = new Set(schedule.subcourses.map((c) => c.id));
  for (const s of schedule.sessions) {
    const label = `${s.date} ${s.title}`;
    assert.match(s.date, DATE, label);
    if (s.dateEnd) assert.ok(s.dateEnd > s.date, `${label}: dateEnd före date`);
    assert.ok(ids.has(s.subcourse), `${label}: okänd delkurs ${s.subcourse}`);
    assert.ok(s.time && s.place && s.kind, `${label}: tid, sal och typ krävs`);
  }
});

test("passen ligger i datumordning", () => {
  const dates = schedule.sessions.map((s) => s.date);
  assert.deepEqual(dates, [...dates].sort());
});

test("veckoöversikten räknar rätt antal pass (omtentor räknas inte)", () => {
  for (const w of schedule.weeks) {
    const n = schedule.sessions.filter((s) => !isRetake(s) && s.date >= w.from && s.date <= w.to).length;
    assert.equal(n, w.sessions, `vecka ${w.week}: ${w.sessions} i översikten, ${n} pass i schemat`);
  }
});

test("tentalistan och tentapassen stämmer överens", () => {
  const exams = schedule.sessions.filter((s) => s.kind === "tenta");
  for (const e of schedule.exams) {
    const match = exams.find((s) => s.date === e.date && s.subcourse === e.subcourse);
    assert.ok(match, `${e.id}: tentan ${e.date} saknas bland passen`);
    assert.equal(match.time, `${e.start}–${e.end}`, `${e.id}: tiden skiljer sig`);
    assert.equal(match.place, e.room, `${e.id}: salen skiljer sig`);
  }
  for (const s of exams) {
    assert.ok(
      schedule.exams.some((e) => e.date === s.date && e.subcourse === s.subcourse),
      `tentapasset ${s.date} (${s.subcourse}) saknas i tentalistan`,
    );
  }
});

test("delkursernas start och slut rymmer deras ordinarie pass", () => {
  for (const c of schedule.subcourses) {
    const own = schedule.sessions.filter((s) => s.subcourse === c.id && !isRetake(s));
    if (own.length === 0) continue;
    const first = own.map((s) => s.date).sort()[0];
    const last = own.map((s) => s.dateEnd || s.date).sort().pop();
    assert.equal(first, c.start, `${c.id}: startar ${c.start} men första passet är ${first}`);
    assert.ok(last <= c.end, `${c.id}: slutar ${c.end} men sista passet är ${last}`);
  }
});

test("kontrolldatumen är giltiga", () => {
  assert.match(schedule.verifiedOn, DATE);
  assert.match(schedule.lastChecked, DATE);
  assert.ok(schedule.verifiedOn <= schedule.lastChecked);
});
