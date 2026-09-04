// Lästiden i kompendiets intro räknas ur datat; formuleringarna ska vara
// korrekt svenska för varje form av timmar och minuter.
import { test } from "node:test";
import assert from "node:assert/strict";
import { formatReadingTime, totalReadingMinutes, withReadingTime } from "../src/lib/readingTime.js";
import { chapters as strategi, intro as strategiIntro } from "../src/data/strategi/reading.js";
import { chapters as databaser, intro as databaserIntro } from "../src/data/databaser/reading.js";

test("formuleringar", () => {
  assert.equal(formatReadingTime(50), "50 minuter");
  assert.equal(formatReadingTime(60), "1 timme");
  assert.equal(formatReadingTime(110), "1 timme och 50 minuter");
  assert.equal(formatReadingTime(120), "2 timmar");
  assert.equal(formatReadingTime(130), "2 timmar och 10 minuter");
});

test("summan avrundas till närmaste tio minuter", () => {
  assert.equal(totalReadingMinutes([{ readingMinutes: 12 }, { readingMinutes: 13 }]), 30);
  assert.equal(totalReadingMinutes([{ readingMinutes: 12 }, { readingMinutes: 12 }]), 20);
  assert.equal(totalReadingMinutes(strategi), 110);
});

test("båda kompendiernas intro får sin tid ur datat", () => {
  for (const [intro, chapters] of [[strategiIntro, strategi], [databaserIntro, databaser]]) {
    assert.match(intro, /\{lästid\}/);
    const text = withReadingTime(intro, chapters);
    assert.doesNotMatch(text, /\{lästid\}/);
    assert.match(text, /Räkna med ungefär \d/);
  }
  assert.match(withReadingTime(strategiIntro, strategi), /1 timme och 50 minuter för hela texten\./);
  // Text utan platshållare lämnas orörd.
  assert.equal(withReadingTime("Ingen tid här.", strategi), "Ingen tid här.");
});
