// Fliken Moduler i Verksamhetsarkitektur (Kaspers beslut 2026-11-22): lärarens
// tre moduldokument på svenska, i dokumentens ordning, med samma id som i Öva.
// Översättningen ska vara trogen: facit oförändrat, de absoluta orden exakta,
// termerna kvar på engelska och originalet sparat i `en`.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { moduler, modulerIntro, modulerItems } from "../src/data/arkitektur/modulerView.js";
import { questions } from "../src/data/arkitektur/questions.js";
import { essays } from "../src/data/arkitektur/essays.js";
import { UF_TEXT } from "../src/data/arkitektur/ufText.js";
import { ABSOLUTA, FRAGEORD, FRAGEORD_UNDANTAG, TERMER, TERM_UNDANTAG } from "../src/data/arkitektur/ordlista.js";
import { getCourse } from "../src/data/index.js";
import { FORELASNINGAR, INGRESS } from "../src/data/arkitektur/moduler/ingress.js";
import {
  chosenOption,
  firstOpenId,
  groupSections,
  modulIds,
  modulItems,
  modulProgress,
  modulScore,
  panelSummary,
} from "../src/lib/moduler.js";
import { clearAnswersFor, recordAnswer } from "../src/lib/storage.js";

const FACIT = JSON.parse(readFileSync(new URL("./fixtures/arkitektur-facit.json", import.meta.url), "utf8"));
const filled = (value) => typeof value === "string" && value.trim().length > 0;
const squash = (text) => text.replace(/\s+/g, " ").trim();

// Alla sv/en-par som visas, med id:t för blocket de hör till.
function pairs() {
  const out = [["inledning", modulerIntro.sv, modulerIntro.en]];
  for (const module of moduler) {
    out.push([module.id, module.title.sv, module.title.en]);
    for (const block of module.blocks) {
      if (block.kind === "text" || block.kind === "exempel") out.push([block.id, block.sv, block.en]);
      if (block.kind === "fraga") {
        out.push([block.id, block.question.sv, block.question.en]);
        block.options.forEach((option) => out.push([block.id, option.sv, option.en]));
        if (block.explanation.en) out.push([block.id, block.explanation.sv, block.explanation.en]);
      }
      if (block.kind === "fritext") {
        for (const label of [block.title, block.answerLabel]) if (label) out.push([block.essayId, label.sv, label.en]);
        out.push([block.essayId, block.question.sv, block.question.en]);
        out.push([block.essayId, block.modelAnswer.sv, block.modelAnswer.en]);
        if (block.keyLesson) out.push([block.essayId, block.keyLesson.sv, block.keyLesson.en]);
        block.extraModelAnswers.forEach((extra) => out.push([block.essayId, extra.sv, extra.en]));
      }
    }
  }
  return out;
}

test("modulerna står i dokumentens ordning 1–12 och har svensk och engelsk titel", () => {
  moduler.forEach((module, index) => {
    assert.equal(module.number, index + 1);
    assert.equal(module.id, `kap${index + 1}`);
    assert.ok(filled(module.title.sv) && filled(module.title.en), module.id);
  });
});

test("varje textblock, fråga, alternativ och modellsvar har både svensk text och en", () => {
  for (const [where, sv, en] of pairs()) {
    assert.ok(filled(sv), `${where}: svensk text saknas`);
    assert.ok(filled(en), `${where}: engelskt original saknas`);
  }
});

test("varje fråga och fritextfråga står exakt en gång, i bankens ordning, med samma id som i Öva", () => {
  const ids = modulerItems.map((item) => item.id);
  assert.equal(new Set(ids).size, ids.length, "inga dubbletter");
  for (const module of moduler) {
    const n = module.number;
    const qIds = module.blocks.filter((b) => b.kind === "fraga").map((b) => b.id);
    const bankQ = questions.filter((q) => q.id.startsWith(`ea-m${n}-`)).map((q) => q.id);
    assert.deepEqual(qIds, bankQ, `modul ${n}: frågorna i PDF:ens ordning`);
    const eIds = module.blocks.filter((b) => b.kind === "fritext").map((b) => b.essayId);
    const bankE = essays.filter((e) => e.id.startsWith(`ea-e${n}-`)).map((e) => e.id);
    assert.deepEqual([...eIds].sort(), [...bankE].sort(), `modul ${n}: alla fritextfrågor`);
    for (const block of module.blocks.filter((b) => b.kind === "fritext")) {
      assert.equal(block.id, `ea-f-${block.essayId.replace(/^ea-/, "")}`, "kortets id i Öva");
    }
  }
});

test("alla 136 frågor och 53 fritextfrågor ur PDF:erna finns med, och inget annat", () => {
  const fragor = modulerItems.filter((i) => i.kind === "fraga").map((i) => i.id);
  const fritext = modulerItems.filter((i) => i.kind === "fritext").map((i) => i.essayId);
  assert.equal(fragor.length, 136);
  assert.equal(fritext.length, 53);
  assert.deepEqual([...fragor].sort(), questions.map((q) => q.id).sort());
  // Zachman-essän kommer från tidigare tentor, inte ur modulerna.
  assert.deepEqual([...fritext].sort(), essays.map((e) => e.id).filter((id) => id !== "ea-e-zachman").sort());
});

test("facit är oförändrat mot origin/main (låst lista ur 9bacd25)", () => {
  assert.equal(Object.keys(FACIT).length, 136);
  for (const question of questions) assert.equal(question.correct, FACIT[question.id], question.id);
  for (const item of modulerItems.filter((i) => i.kind === "fraga")) {
    assert.equal(item.correct, FACIT[item.id], item.id);
  }
});

// Prompten kräver det i påståenden och alternativ; testet går igenom all text,
// också modellsvaren, så att samma ord alltid blir samma svenska ord.
test("absoluta ord är översatta exakt i påståenden, alternativ och all övrig text", () => {
  for (const [where, sv, en] of pairs()) {
    for (const [word, swedish] of Object.entries(ABSOLUTA)) {
      if (new RegExp(`\\b${word}\\b`, "i").test(en)) {
        assert.match(sv, new RegExp(swedish, "i"), `${where}: "${word}" → "${swedish}" i "${sv.slice(0, 160)}"`);
      }
    }
  }
});

test("ordlistans termer står kvar på engelska där de finns i originalet", () => {
  for (const [where, sv, en] of pairs()) {
    for (const { term, re, sv: svRe } of TERMER) {
      if (!re.test(en) || TERM_UNDANTAG[where]?.[term]) continue;
      assert.match(sv, svRe ?? re, `${where}: termen "${term}" saknas i "${sv.slice(0, 120)}"`);
    }
    for (const word of FRAGEORD_UNDANTAG.includes(where) ? [] : FRAGEORD) {
      if (en === word || en.includes(`${word}?`)) assert.ok(sv === word || sv.includes(`${word}?`), `${where}: ${word}`);
    }
  }
});

test("varje flervals- och sant/falskt-fråga har en svensk förklaring", () => {
  for (const item of modulerItems.filter((i) => i.kind === "fraga")) {
    assert.ok(filled(item.explanation.sv), item.id);
    assert.ok(item.explanation.sv.split(/(?<=[.!?])\s+/).length <= 4, `${item.id}: högst cirka tre meningar`);
  }
});

// Stycke för stycke, utan rubriktecken och numrering, eftersom frågorna står
// insprängda i texten (t.ex. "34. Zachman or TOGAF?" före tabellraderna).
const plain = (text) => squash(text.replace(/^#+\s*/gm, "").replace(/^\d+\.\s+/gm, ""));
test("textblockens engelska är lärarens text (samma som ufText.js)", () => {
  for (const module of moduler) {
    const joined = plain(module.blocks.filter((b) => b.kind === "text" || b.kind === "exempel").map((b) => b.en).join("\n\n"));
    for (const paragraph of UF_TEXT[module.id].split(/\n\s*\n/).map(plain).filter(Boolean)) {
      assert.ok(joined.includes(paragraph), `${module.id}: saknar "${paragraph.slice(0, 80)}"`);
    }
  }
});

test("framsteg per modul: besvarade frågor och bedömda fritextfrågor, samma poster som Öva", () => {
  const modul7 = moduler.find((m) => m.id === "kap7");
  assert.deepEqual(modulProgress(modul7, {}), { done: 0, total: 20 + 8 });
  let answers = recordAnswer({}, "ea-m7-1", false);
  answers = recordAnswer(answers, "ea-f-e7-11", true);
  answers = recordAnswer(answers, "ea-m1-1", true);
  assert.equal(modulProgress(modul7, answers).done, 2, "fel svar räknas också som besvarat; andra moduler räknas inte");
  assert.ok(modulIds(modul7).includes("ea-f-e7-27"), "fritextens id är förklarakortets id");
  // Gör om modulen = clearAnswersFor(modulens id:n), som Övas nollställning.
  assert.equal(modulProgress(modul7, clearAnswersFor(answers, modulIds(modul7))).done, 0);
});

test("valt alternativ visas bara när frågan har ett svar i answers", () => {
  const stat = recordAnswer({}, "x", true).x;
  assert.equal(chosenOption(stat, { choice: 2 }), 2);
  assert.equal(chosenOption(undefined, { choice: 2 }), null, "nollställd i Öva eller gjord om: obesvarad");
  assert.equal(chosenOption(stat, null), null, "besvarad i Öva men inte här");
});

test("manifestet: fliken Moduler med alla tolv moduler och lärarens inledning", () => {
  const course = getCourse("arkitektur");
  assert.equal(course.views[0], "moduler");
  assert.equal(course.moduler, moduler);
  assert.match(course.modulerIntro.sv, /^Jag har skapat 12 moduler/);
  assert.match(course.modulerIntro.sv, /kapitel 12/, "läraren säger att man ska börja med modul 12");
  for (const id of ["strategi", "databaser", "process", "sakerhet"]) assert.deepEqual(getCourse(id).moduler, []);
});

test("den svenska texten nämner varken Word-dokumentet eller interna förkortningar", () => {
  for (const [where, sv] of pairs()) {
    assert.doesNotMatch(sv, /\bWord\b|docx|\bUF\b|HT ?2[56]/, where);
  }
});

// --- Utseendet (Kaspers designbeslut 22 nov): ingen ny kurstext -----------

test("modulens ingress är en mening ur lärarens egen text, på svenska och engelska", () => {
  for (const module of moduler) {
    const source = INGRESS[module.id];
    assert.ok(source, `${module.id} saknar ingress`);
    const block = module.blocks.find((item) => item.id === source.block);
    assert.ok(block, `${module.id}: blocket ${source.block} finns inte i modulen`);
    assert.ok(block.sv.includes(source.sv), `${module.id}: ingressen står inte ordagrant i ${source.block}`);
    assert.ok(block.en.includes(source.en), `${module.id}: originalet står inte ordagrant i ${source.block}`);
    assert.deepEqual(module.ingress, { sv: source.sv, en: source.en });
  }
  assert.equal(INGRESS.kap1.block, "m1-t3", "modul 1: kärnbudskapets första mening");
  assert.equal(INGRESS.kap5.block, "m5-t3", "modul 5: kärnbudskapets första mening");
});

test("modullistan följer lärarens tre föreläsningar, och modul 12 är markerad", () => {
  assert.deepEqual(
    FORELASNINGAR.map((lecture) => lecture.moduler),
    [["kap1", "kap2", "kap3", "kap4"], ["kap5", "kap6", "kap7", "kap8"], ["kap9", "kap10", "kap11", "kap12"]],
  );
  for (const lecture of FORELASNINGAR) {
    assert.ok(modulerIntro.sv.includes(`Föreläsning ${lecture.nummer} — ${lecture.title.sv}`), `namnet på föreläsning ${lecture.nummer}`);
    assert.ok(modulerIntro.en.includes(`Lecture ${lecture.nummer} — ${lecture.title.en}`));
  }
  for (const module of moduler) {
    assert.equal(module.forelasning.nummer, Math.ceil(module.number / 4), module.id);
  }
  assert.deepEqual(moduler.filter((module) => module.borjaHar).map((module) => module.id), ["kap12"]);
  assert.ok(modulerIntro.sv.includes(modulerIntro.utdrag.sv), "inledningens förhandsvisning är lärarens egen text");
  assert.ok(modulerIntro.en.includes(modulerIntro.utdrag.en));
});

test("text och frågepaneler: inget block försvinner eller byter plats", () => {
  for (const module of moduler) {
    const sections = groupSections(module.blocks);
    const flat = sections.flatMap((section) => {
      if (section.kind === "text") return [section.block];
      const items = section.items.flatMap((item) => {
        if (item.kind === "tabell") return item.items;
        if (item.kind === "notis") return [item.block];
        return [item];
      });
      return section.heading ? [section.heading, ...items] : items;
    });
    assert.deepEqual(
      flat.map((block) => block.id),
      module.blocks.map((block) => block.id),
      `${module.id}: blocken i samma ordning som i dokumentet`,
    );
    for (const section of sections.filter((item) => item.kind === "panel")) {
      if (section.heading) assert.match(section.heading.sv, /^## /, `${section.id}: panelens rubrik är lärarens`);
      assert.ok(panelSummary(section).count > 0, `${section.id}: en panel har minst en fråga`);
    }
  }
  const modul1 = groupSections(moduler[0].blocks).filter((section) => section.kind === "panel");
  assert.deepEqual(panelSummary(modul1[0]), { count: 1, type: "Flerval", examples: true }, "lärarens exempel");
  assert.equal(modul1[1].heading.id, "m1-t5");
  assert.deepEqual(panelSummary(modul1[1]), { count: 5, type: "Flerval", examples: false });
});

test("modulens början och slut: besvarade, rätt och första obesvarade frågan", () => {
  const modul1 = moduler.find((m) => m.id === "kap1");
  const items = modulItems(modul1);
  assert.equal(firstOpenId(modul1, {}), items[0].id);
  let answers = recordAnswer({}, items[0].id, true);
  answers = recordAnswer(answers, items[1].id, false);
  answers = recordAnswer(answers, "ea-f-e1-9", true);
  assert.deepEqual(modulScore(modul1, answers), { done: 3, total: 11, right: 2 }, "Kunde räknas som rätt");
  assert.equal(firstOpenId(modul1, answers), items[2].id);
  for (const item of items) answers = recordAnswer(answers, item.id, true);
  assert.equal(firstOpenId(modul1, answers), null, "allt besvarat: ingen Fortsätt-knapp");
});
