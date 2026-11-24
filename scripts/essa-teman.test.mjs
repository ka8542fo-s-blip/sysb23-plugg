// Fliken Essä i Verksamhetsarkitektur (Kaspers beslut 23 nov): elva
// essäteman som tillsammans täcker lärarens 37 essä-, fall-, scenario- och
// tankefrågor, med ett utvecklat modellsvar på svenska
// (src/data/arkitektur/essaTeman.js). Strategi, Process och Säkerhet ska ha
// sin Essä som förut.
import { test } from "node:test";
import assert from "node:assert/strict";
import { MODULER } from "../src/data/arkitektur/moduler/index.js";
import { TEMAN, essaTeman } from "../src/data/arkitektur/essaTeman.js";
import { getCourse } from "../src/data/index.js";
import { essays as strategiEssays } from "../src/data/strategi/essays.js";
import { essays as processEssays } from "../src/data/process/essays.js";
import { essays as sakerhetEssays, ESSAY_INTRO as sakerhetEssayIntro } from "../src/data/sakerhet/essays.js";

const TEMATYPER = new Set(["essa", "fall", "scenario", "tankande"]);
const fritext = MODULER.flatMap((modul) => modul.blocks.filter((block) => block.kind === "fritext"));
const temafragor = fritext.filter((block) => TEMATYPER.has(block.typ)).map((block) => block.id);
const words = (text) => text.trim().split(/\s+/).filter(Boolean).length;

// Temana som är skrivna (alla elva sedan 23 nov).
const skrivna = TEMAN.filter((tema) => tema.modelAnswer);

test("temana täcker lärarens frågor: 11 teman, 37 frågor, varje fråga i exakt ett tema", () => {
  assert.equal(TEMAN.length, 11);
  assert.deepEqual(
    TEMAN.map((tema) => tema.id),
    Array.from({ length: 11 }, (_, i) => `ea-tema-${i + 1}`),
  );
  assert.equal(temafragor.length, 37);
  const alla = TEMAN.flatMap((tema) => tema.fragor);
  assert.equal(alla.length, 37, "ingen fråga i två teman");
  assert.deepEqual(new Set(alla), new Set(temafragor), "samma frågor som i modulerna, inga andra");
  for (const tema of TEMAN) assert.ok(tema.title?.trim() && tema.fragor.length > 0, tema.id);
});

test("alla elva teman är skrivna och visas i fliken Essä i temaordning", () => {
  assert.equal(skrivna.length, 11, `skrivna: ${skrivna.map((tema) => tema.id).join(", ")}`);
  assert.deepEqual(
    essaTeman.map((tema) => tema.id),
    skrivna.map((tema) => tema.id),
  );
  const course = getCourse("arkitektur");
  assert.equal(course.essays, essaTeman);
  assert.deepEqual(course.views, ["moduler", "ova", "essa", "statistik"]);
});

test("ett skrivet tema har alla delar", () => {
  for (const tema of skrivna) {
    for (const field of ["question", "outline", "modelAnswer"]) {
      assert.ok(tema[field]?.trim(), `${tema.id} saknar ${field}`);
    }
    assert.ok(tema.checklist.length >= 2 && tema.checklist.length <= 4, `${tema.id}: ${tema.checklist.length} grupper`);
    for (const group of tema.checklist) {
      assert.ok(group.heading?.trim(), `${tema.id}: rubrik`);
      assert.ok(group.points.length >= 2 && group.points.length <= 4, `${tema.id} / ${group.heading}: ${group.points.length} punkter`);
      for (const point of group.points) assert.ok(point.trim().length > 20, `${tema.id}: för kort punkt`);
    }
    const sentences = tema.outline.split(/[.!?](\s|$)/).filter((part) => part.trim().length > 1);
    assert.ok(sentences.length >= 1 && sentences.length <= 3, `${tema.id}: dispositionen har ${sentences.length} meningar`);
  }
});

test("det utvecklade modellsvaret har 180–320 ord och är löpande text", () => {
  for (const tema of skrivna) {
    const n = words(tema.modelAnswer);
    assert.ok(n >= 180 && n <= 320, `${tema.id}: ${n} ord`);
    assert.doesNotMatch(tema.modelAnswer, /^\s*([-*•]|\d+\.)\s/m, `${tema.id}: punktlista`);
    assert.doesNotMatch(tema.modelAnswer, /\b[Mm]odul \d/, `${tema.id}: hänvisar till ett modulnummer`);
  }
});

test("tentafrågan har minst två utvecklingsfrågor, a) och b)", () => {
  for (const tema of skrivna) {
    const lines = tema.question.split("\n").map((line) => line.trim());
    assert.ok(lines.some((line) => line.startsWith("a)")), `${tema.id}: a)`);
    assert.ok(lines.some((line) => line.startsWith("b)")), `${tema.id}: b)`);
    assert.ok(!lines[0].startsWith("a)"), `${tema.id}: huvudfrågan först`);
  }
});

test("täckningen: en mening per fråga i temat, ordagrant i det utvecklade svaret", () => {
  for (const tema of skrivna) {
    assert.deepEqual(Object.keys(tema.tackning).sort(), [...tema.fragor].sort(), tema.id);
    for (const [id, mening] of Object.entries(tema.tackning)) {
      assert.ok(mening.trim().length > 20, `${tema.id} / ${id}: för kort`);
      assert.ok(tema.modelAnswer.includes(mening), `${tema.id} / ${id}: står inte i svaret: ${mening}`);
    }
  }
});

test("temats svenska text nämner inte Word, docx eller UF", () => {
  for (const tema of skrivna) {
    const text = [
      tema.title,
      tema.question,
      tema.outline,
      tema.modelAnswer,
      ...tema.checklist.flatMap((group) => [group.heading, ...group.points]),
    ].join("\n");
    assert.doesNotMatch(text, /\bWord\b|docx|\bUF\b/, tema.id);
  }
});

test("kontext och lärarens korta svar byggs ur modulerna", () => {
  const byId = new Map(fritext.map((block) => [block.id, block]));
  const tema4 = essaTeman.find((tema) => tema.id === "ea-tema-4");
  assert.equal(
    tema4.context,
    "Läraren frågar om detta i fyra frågor: modul 4 essä 10 och 11, modul 5 essä 12, modul 12 essä 2.",
  );
  for (const tema of essaTeman) {
    assert.equal(tema.modelAnswerLabel, "Utvecklat modellsvar");
    assert.equal(tema.modelAnswerLang, "sv");
    assert.deepEqual(tema.ufAnswers.map((item) => item.id), tema.fragor);
    for (const item of tema.ufAnswers) {
      const block = byId.get(item.id);
      assert.equal(item.modelAnswer, block.modelAnswer, `${item.id}: lärarens svar ur modulfilen`);
      assert.ok(item.question.trim() && item.label.trim(), item.id);
    }
  }
});

test("doktrin står i modul 8:s text och i tema 8:s svar, skyddsräcken i modul 7 och 9", () => {
  const svText = (id) =>
    MODULER.find((modul) => modul.id === id)
      .blocks.filter((block) => block.kind === "text")
      .map((block) => block.sv)
      .join("\n");
  assert.match(svText("kap8"), /doktrin/);
  assert.match(svText("kap9"), /skyddsräcken/);
  assert.match(svText("kap7"), /skyddsräcken/);
  const tema8 = TEMAN.find((tema) => tema.id === "ea-tema-8");
  assert.match(tema8.modelAnswer, /doktrin/);
  assert.match(tema8.modelAnswer, /skyddsräcken/);
  // Bara på svenska: lärarens engelska original är orört.
  for (const modul of MODULER) {
    for (const block of modul.blocks) {
      if (block.kind === "text" && block.en) assert.doesNotMatch(block.en, /doktrin|skyddsräck/i, block.id);
    }
  }
});

test("arkitekturens Essä: mål cirka 200 ord, max 500, egen slutrad och intro", () => {
  const course = getCourse("arkitektur");
  assert.equal(course.essayWordTarget, 200);
  assert.equal(course.essayWordLimit, 500);
  assert.match(course.essayClosing, /Cirka 200 ord, max 500/);
  assert.equal(course.essayIntro.length, 3);
  assert.match(course.examNote.text, /30 flervalsfrågor .* 3 essäfrågor/);
  assert.doesNotMatch(course.homeIntro, /översatt/);
});

test("Strategi, Process och Säkerhet har samma essäer och samma ordgräns som förut", () => {
  const strategi = getCourse("strategi");
  const process = getCourse("process");
  const sakerhet = getCourse("sakerhet");
  assert.equal(strategi.essays, strategiEssays);
  assert.equal(process.essays, processEssays);
  assert.equal(sakerhet.essays, sakerhetEssays);
  assert.equal(sakerhet.essayIntro, sakerhetEssayIntro);
  // Strategi och Process: vyns standard (300 ord, fyrstegsraden). Säkerhet:
  // 700 ord sedan lärarens besked 24 nov 2026.
  assert.equal(strategi.essayWordLimit, undefined);
  assert.equal(process.essayWordLimit, undefined);
  assert.equal(sakerhet.essayWordLimit, 700);
  // Säkerhet har egen slutrad (lärarens fem kriterier), inte Strategis fyra steg.
  assert.match(sakerhet.essayClosing, /700 ord/);
  for (const course of [strategi, process, sakerhet]) {
    for (const field of ["essayWordTarget", "essayClosing", "essayUnit"]) {
      if (course === sakerhet && field === "essayClosing") continue;
      assert.equal(course[field], undefined, `${course.id}: ${field}`);
    }
    for (const essay of course.essays) {
      assert.ok(!essay.title && !essay.ufAnswers && !essay.modelAnswerLang, `${course.id} / ${essay.id}`);
    }
  }
});
