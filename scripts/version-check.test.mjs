// Uppdateringsnotisen: jämförelsen mellan den inbäddade SHA:n och den i
// version.json. Bannern ska synas vid en ny version, inte annars, och ett
// kryss gäller bara tills nästa nya version.
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseVersion, shouldNotify, versionUrl } from "../src/lib/versionCheck.js";

const A = "7267791a1b2c3d4e5f60718293a4b5c6d7e8f901";
const B = "433e48e0f1e2d3c4b5a6978877665544332211aa";
const C = "f9b213e1234567890abcdef1234567890abcdef1";

test("samma version: ingen banner", () => {
  assert.equal(shouldNotify({ current: A, remote: A, dismissed: null }), false);
});

test("ny version: banner", () => {
  assert.equal(shouldNotify({ current: A, remote: B, dismissed: null }), true);
});

test("kryssad version döljs, men nästa nya version visas igen", () => {
  assert.equal(shouldNotify({ current: A, remote: B, dismissed: B }), false);
  assert.equal(shouldNotify({ current: A, remote: C, dismissed: B }), true);
});

test("ingen hämtad version eller okänd egen version: ingen banner", () => {
  assert.equal(shouldNotify({ current: A, remote: null, dismissed: null }), false);
  assert.equal(shouldNotify({ current: "okand", remote: B, dismissed: null }), false);
  assert.equal(shouldNotify({ current: null, remote: B, dismissed: null }), false);
});

test("version.json tolkas bara när den innehåller en SHA", () => {
  assert.equal(parseVersion({ sha: B }), B);
  assert.equal(parseVersion({ sha: "okand" }), null);
  assert.equal(parseVersion({}), null);
  assert.equal(parseVersion(null), null);
  assert.equal(parseVersion("<!doctype html>"), null);
});

test("adressen följer base och kringgår cachen med tidsstämpel", () => {
  assert.equal(versionUrl("/sysb23-plugg/", 123), "/sysb23-plugg/version.json?t=123");
  assert.equal(versionUrl("/", 5), "/version.json?t=5");
});
