// Zoomstegen i BPMN-övningarna: "+" gör alltid diagrammet större och "−"
// alltid mindre, också från läget Anpassa, och skalan håller sig inom stegen.
import { test } from "node:test";
import assert from "node:assert/strict";
import { MAX_ZOOM, MIN_ZOOM, ZOOM_STEPS, currentScale, fitScale, percent, stepZoom } from "../src/lib/diagramZoom.js";

test("Anpassa fyller bredden men aldrig över taket", () => {
  assert.equal(fitScale(700, 960, 1.5), 700 / 960);
  assert.equal(fitScale(1000, 520, 1.5), 1.5);
  assert.equal(fitScale(1000, 760, 1), 1);
  assert.equal(fitScale(0, 760, 1.5), null);
});

test("+ och − går till närmaste steg förbi det som syns", () => {
  assert.equal(stepZoom(0.73, 1), 0.75);
  assert.equal(stepZoom(0.73, -1), 0.6);
  assert.equal(stepZoom(1, 1), 1.15);
  assert.equal(stepZoom(1, -1), 0.9);
  // Från ett exakt steg hoppar knappen vidare, den står inte still.
  for (const step of ZOOM_STEPS.slice(0, -1)) assert.ok(stepZoom(step, 1) > step, String(step));
  for (const step of ZOOM_STEPS.slice(1)) assert.ok(stepZoom(step, -1) < step, String(step));
});

test("gränserna och mobilens små Anpassa-skalor", () => {
  assert.equal(stepZoom(MAX_ZOOM, 1), MAX_ZOOM);
  assert.equal(stepZoom(MIN_ZOOM, -1), MIN_ZOOM);
  // 960 enheter på en telefon: Anpassa ≈ 0,33, och "+" går till 0,5.
  assert.equal(stepZoom(fitScale(320, 960, 1.5), 1), 0.5);
  assert.equal(currentScale("fit", 0.8), 0.8);
  assert.equal(currentScale(1.5, 0.8), 1.5);
  assert.equal(percent(0.733), "73 %");
});
