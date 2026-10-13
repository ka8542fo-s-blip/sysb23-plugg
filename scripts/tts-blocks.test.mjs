// Uppläsningens block och nycklar: webbläsaren och scripts/tts-extract.mjs
// delar src/lib/ttsBlocks.js, så hashen måste vara riktig SHA-1 och urvalet
// detsamma som förut. Plus generatorns uppdelning och röstspärr.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { JSDOM } from "jsdom";
import { blockText, collectBlocks, normalizeText, textHash } from "../src/lib/ttsBlocks.js";
import { assertAudioCourse, assertChirp3HD, countChars, splitText } from "./tts-generate.mjs";
import { courses } from "../src/data/index.js";

const nodeSha = (text) => createHash("sha1").update(text, "utf8").digest("hex").slice(0, 12);

test("hashen är SHA-1 (12 tecken) av den normaliserade texten", () => {
  const samples = [
    "",
    "a",
    "Kapitel 8 av 11",
    "Räksmörgås – åäö ÅÄÖ é → ⊆ ≤",
    "x".repeat(55),
    "y".repeat(56),
    "z".repeat(64),
    "En relation är i andra normalformen ".repeat(40),
  ];
  for (const text of samples) assert.equal(textHash(text), nodeSha(normalizeText(text)), JSON.stringify(text.slice(0, 30)));
});

test("normaliseringen trimmar och kollapsar blanksteg", () => {
  assert.equal(normalizeText("  En\n  relation\t är  "), "En relation är");
  assert.equal(textHash(" En  relation\n"), textHash("En relation"));
});

test("urvalet: h1–h3, p, li, blockquote; inget inom data-tts-skip; nästlat läses en gång", () => {
  const { document } = new JSDOM(`<div id="root">
    <h1>Titel</h1>
    <p data-tts-skip>Metarad</p>
    <figure data-tts-skip><figcaption><p>Diagramtext</p></figcaption></figure>
    <p>Stycke <strong>med fetstil</strong></p>
    <ul><li>Punkt <ul><li>Underpunkt</li></ul></li></ul>
    <ul><li>Före koden <pre data-tts-skip>SELECT * FROM R;</pre> efter koden</li></ul>
    <blockquote><p>Definition</p></blockquote>
    <p>   </p>
  </div>`).window;
  const blocks = collectBlocks(document.getElementById("root")).map((el) => normalizeText(blockText(el)));
  assert.deepEqual(blocks, [
    "Titel",
    "Stycke med fetstil",
    "Punkt Underpunkt",
    "Före koden efter koden",
    "Definition",
  ]);
});

test("generatorn delar långa block på meningsgräns under 4 500 byte", () => {
  const sentence = "Åtta äldre öar ägde också ett ö-rike med många långa meningar. ";
  const text = sentence.repeat(120).trim();
  const pieces = splitText(text);
  assert.ok(pieces.length > 1);
  for (const piece of pieces) {
    assert.ok(Buffer.byteLength(piece, "utf8") <= 4500, `${Buffer.byteLength(piece)} byte`);
    assert.match(piece, /\.$/, "delarna slutar på meningsgräns");
  }
  assert.equal(pieces.join(" "), text);
  assert.deepEqual(splitText("Kort."), ["Kort."]);
  assert.equal(countChars("åäö"), 3);
});

test("bara svenska Chirp 3 HD-röster godtas", () => {
  assert.doesNotThrow(() => assertChirp3HD("sv-SE-Chirp3-HD-Kore"));
  for (const voice of ["sv-SE-Wavenet-A", "sv-SE-Neural2-C", "en-US-Chirp3-HD-Kore", "sv-SE-Chirp-HD-F", null]) {
    assert.throws(() => assertChirp3HD(voice), /Chirp 3 HD/, String(voice));
  }
});

test("bara Databaser och Processorienterad har förgenererat ljud; Strategi vägras", () => {
  assert.deepEqual(courses.filter((c) => c.ttsAudio).map((c) => c.id).sort(), ["databaser", "process"]);
  assert.doesNotThrow(() => assertAudioCourse("databaser"));
  assert.doesNotThrow(() => assertAudioCourse("process"));
  assert.throws(() => assertAudioCourse("strategi"), /ska inte ha förgenererat ljud/);
  assert.throws(() => assertAudioCourse("okand"), /Okänd delkurs/);
});
