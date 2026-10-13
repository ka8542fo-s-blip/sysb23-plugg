// Uppdateringsnotisen: bannern visar nyheterna (src/data/changelog.js) som
// är nyare än versionen fliken kör. Bara en ny SHA, som schemakontrollens
// dagliga stämpel, ger ingen banner, och ett kryss gäller bara tills nästa
// nyhet.
import { test } from "node:test";
import assert from "node:assert/strict";
import { changelog, LATEST_NEWS_ID } from "../src/data/changelog.js";
import { latestId, parseVersion, unseenNews, versionFile, versionUrl } from "../src/lib/versionCheck.js";

const SHA = "433e48e0f1e2d3c4b5a6978877665544332211aa";
const news = [
  { id: 8, text: "Åtta" },
  { id: 7, text: "Sju" },
  { id: 6, text: "Sex" },
];

test("samma nyheter som fliken redan har: ingen banner, även om SHA:n är ny", () => {
  assert.deepEqual(unseenNews({ localLatest: 8, remoteNews: news }), []);
});

test("nya nyheter visas, nyast först", () => {
  assert.deepEqual(unseenNews({ localLatest: 6, remoteNews: news }).map((e) => e.id), [8, 7]);
});

test("kryssad version döljs, men nästa nyhet visas igen", () => {
  assert.deepEqual(unseenNews({ localLatest: 6, remoteNews: news, dismissedId: 8 }), []);
  const later = [{ id: 9, text: "Nio" }, ...news];
  assert.deepEqual(unseenNews({ localLatest: 6, remoteNews: later, dismissedId: 8 }).map((e) => e.id), [9]);
  assert.equal(latestId(later), 9);
});

test("version.json tolkas försiktigt", () => {
  assert.deepEqual(parseVersion({ sha: SHA, news }), { sha: SHA, news });
  assert.deepEqual(parseVersion({ sha: "okand", news: [{ id: "x", text: "fel" }, { id: 2, text: "" }, { id: 3, text: "ok" }] }), {
    sha: null,
    news: [{ id: 3, text: "ok" }],
  });
  assert.deepEqual(parseVersion({ sha: SHA }), { sha: SHA, news: [] });
  assert.equal(parseVersion(null), null);
  assert.equal(parseVersion("<!doctype html>"), null);
});

test("bygget lägger SHA:n och de senaste nyheterna i version.json", () => {
  const file = versionFile(SHA, changelog, 3);
  assert.equal(file.sha, SHA);
  assert.deepEqual(file.news, changelog.slice(0, 3).map(({ id, text }) => ({ id, text })));
  assert.deepEqual(parseVersion(JSON.parse(JSON.stringify(file))).news, file.news);
});

test("nyhetslistan: nyast först, id räknas upp med ett, korta texter", () => {
  const ids = changelog.map((entry) => entry.id);
  assert.deepEqual(ids, [...ids].sort((a, b) => b - a), "nyast först");
  ids.forEach((id, i) => {
    if (i > 0) assert.equal(ids[i - 1] - id, 1, `id ${id} följer inte på ${ids[i - 1]}`);
  });
  assert.equal(LATEST_NEWS_ID, ids[0]);
  for (const entry of changelog) {
    assert.match(entry.date, /^\d{4}-\d{2}-\d{2}$/, `id ${entry.id}: datum`);
    assert.ok(entry.text.length > 0 && entry.text.length <= 70, `id ${entry.id}: ${entry.text.length} tecken`);
  }
});

test("adressen följer base och kringgår cachen med tidsstämpel", () => {
  assert.equal(versionUrl("/sysb23-plugg/", 123), "/sysb23-plugg/version.json?t=123");
  assert.equal(versionUrl("/", 5), "/version.json?t=5");
});
