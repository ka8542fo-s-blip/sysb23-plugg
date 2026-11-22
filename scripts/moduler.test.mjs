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
import { ABSOLUTA, FRAGEORD, TERMER, TERM_UNDANTAG } from "../src/data/arkitektur/ordlista.js";

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
    for (const word of FRAGEORD) {
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

test("textblockens engelska är lärarens text (samma som ufText.js)", () => {
  for (const module of moduler) {
    const joined = squash(module.blocks.filter((b) => b.kind === "text" || b.kind === "exempel").map((b) => b.en).join("\n"));
    for (const section of UF_TEXT[module.id].split(/\n(?=## )/).map(squash).filter(Boolean)) {
      assert.ok(joined.includes(section), `${module.id}: saknar "${section.slice(0, 80)}"`);
    }
  }
});

test("den svenska texten nämner varken Word-dokumentet eller interna förkortningar", () => {
  for (const [where, sv] of pairs()) {
    assert.doesNotMatch(sv, /\bWord\b|docx|\bUF\b|HT ?2[56]/, where);
  }
});
