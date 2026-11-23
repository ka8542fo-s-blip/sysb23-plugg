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
import { MODULER } from "../src/data/arkitektur/moduler/index.js";
import { SAKNAS_GODKANDA, TACKNING } from "../src/data/arkitektur/moduler/tackning.js";
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

// Alla sv/en-par som visas, med id:t för blocket de hör till. Tillagda
// textblock (bara svenska, inget original) står i `tillagda()`.
function pairs() {
  const out = [["inledning", modulerIntro.sv, modulerIntro.en]];
  for (const module of moduler) {
    out.push([module.id, module.title.sv, module.title.en]);
    for (const block of module.blocks) {
      if ((block.kind === "text" && !block.tillagd) || block.kind === "exempel") out.push([block.id, block.sv, block.en]);
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

const tillagda = () => moduler.flatMap((module) => module.blocks.filter((block) => block.tillagd));

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
    // Lärarens exempel som är upprepade frågor (modul 1) räknas med sin
    // källtext ur PDF:en, som finns i modulfilen men aldrig visas.
    const raw = MODULER.find((m) => m.id === module.id);
    const sources = raw.blocks.flatMap((b) =>
      (b.kind === "text" && !b.tillagd) || b.kind === "exempel" ? [b.en] : b.kind === "upprepning" ? [b.kalla.en] : [],
    );
    const joined = plain(sources.join("\n\n"));
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
  for (const [where, sv] of [...pairs(), ...tillagda().map((block) => [block.id, block.sv])]) {
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
  assert.deepEqual(
    modul1[0].items.map((item) => item.id),
    ["ea-m1-ex", "m1-ex-sf", "m1-ex-essa"],
    "exempelfrågan och de två upprepade exemplen i samma panel",
  );
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

// --- Inget facit innan man svarat (Kaspers beslut 23 nov) -------------------

const VISAT_FACIT = /Svar:|Answer:|Modellsvar|Model answer|Rätt svar|Correct answer/;

test("inget text- eller exempelblock i modul 1–12 visar facit", () => {
  assert.doesNotMatch(modulerIntro.sv, VISAT_FACIT, "inledningen");
  assert.doesNotMatch(modulerIntro.en, VISAT_FACIT, "inledningen, engelska");
  for (const module of moduler) {
    for (const block of module.blocks.filter((b) => b.kind === "text" || b.kind === "exempel")) {
      assert.doesNotMatch(block.sv, VISAT_FACIT, `${module.id} ${block.id}`);
      if (!block.tillagd) assert.doesNotMatch(block.en, VISAT_FACIT, `${module.id} ${block.id}, engelska`);
    }
  }
});

test("lärarens exempel i modul 1 är riktiga frågekort med samma id och status som fråga 6 och 9", () => {
  const modul1 = moduler.find((m) => m.id === "kap1");
  const repeats = modul1.blocks.filter((b) => b.kind === "upprepning");
  assert.deepEqual(
    repeats.map((b) => [b.id, b.item.id, b.sammaSom]),
    [["m1-ex-sf", "ea-m1-6", "6"], ["m1-ex-essa", "ea-f-e1-9", "9"]],
  );
  for (const repeat of repeats) {
    assert.ok(!("kalla" in repeat), "exemplets text med facit följer inte med till vyn");
    assert.ok(modul1.blocks.includes(repeat.item), "samma kort som frågan längre ned");
  }
  // Exemplen räknas en gång: modulen har fortfarande 11 frågor.
  assert.equal(modulItems(modul1).length, 11);
  assert.ok(!modulerItems.some((item) => item.kind === "upprepning"));

  // Källtexten ur PDF:en är samma fråga med samma facit.
  const raw = MODULER.find((m) => m.id === "kap1").blocks;
  const sf = raw.find((b) => b.id === "m1-ex-sf");
  const q6 = repeats[0].item;
  assert.ok(sf.kalla.sv.includes(q6.question.sv) && sf.kalla.en.includes(q6.question.en));
  assert.ok(sf.kalla.sv.endsWith(`Svar: ${q6.options[q6.correct].sv.toUpperCase()}`), "FALSKT är fråga 6:s facit");
  const essa = raw.find((b) => b.id === "m1-ex-essa");
  const q9 = repeats[1].item;
  assert.ok(essa.kalla.sv.includes(q9.question.sv) && essa.kalla.en.includes(q9.question.en));
  assert.ok(essa.kalla.sv.endsWith(q9.extraModelAnswers[0].sv), "exemplets modellsvar finns bakom Visa modellsvar");
  assert.ok(essa.kalla.en.endsWith(q9.extraModelAnswers[0].en));
  // "Så, då börjar det ☺" står kvar som text direkt efter exemplen.
  const after = modul1.blocks[modul1.blocks.indexOf(repeats[1]) + 1];
  assert.deepEqual([after.kind, after.sv], ["text", "Så, då börjar det ☺"]);
});

// --- Texten lär ut det frågorna prövar (Kaspers beslut 23 nov) ---------------
// De svenska textblocken är en omskrivning, inte en översättning: texten före
// varje frågepanel ska räcka för att svara på panelens frågor, och allt ska
// gå att belägga i lärarens material. tackning.js pekar ut meningen som bär
// varje svar. Omskrivningen görs en föreläsning i taget; OMSKRIVNA är de
// moduler som är klara.
const OMSKRIVNA = ["kap1", "kap2", "kap3", "kap4", "kap5", "kap6", "kap7", "kap8"];

const utanMarkdown = (text) =>
  squash(
    text
      .replace(/^\s*[-*]\s+/gm, "")
      .replace(/^\s*\d+\.\s+/gm, "")
      .replace(/^#+\s*/gm, "")
      .replace(/\*/g, ""),
  );

const fragorI = (module) => module.blocks.filter((b) => b.kind === "fraga" || b.kind === "fritext");

test("täckningen: varje fråga i de omskrivna modulerna har en mening i texten, och inga andra nycklar", () => {
  const alla = new Set(MODULER.flatMap((module) => fragorI(module).map((b) => b.id)));
  for (const id of [...Object.keys(TACKNING), ...SAKNAS_GODKANDA]) assert.ok(alla.has(id), `${id} är ingen fråga i m01–m12`);
  for (const module of MODULER.filter((m) => OMSKRIVNA.includes(m.id))) {
    for (const block of fragorI(module)) {
      const poster = TACKNING[block.id] ?? [];
      assert.ok(poster.length > 0 || SAKNAS_GODKANDA.includes(block.id), `${module.id}: ${block.id} saknar täckning`);
      assert.ok(!(poster.length > 0 && SAKNAS_GODKANDA.includes(block.id)), `${block.id} står både täckt och saknad`);
    }
  }
});

test("täckningen pekar på ordagrann text i ett textblock före frågan i samma modul", () => {
  for (const module of MODULER) {
    fragorI(module).forEach((fraga) => {
      const fore = module.blocks.slice(0, module.blocks.indexOf(fraga)).filter((b) => b.kind === "text");
      // Modul 12 repeterar hela kursen och får peka på text i modul 1–11.
      const tidigare = module.id === "kap12" ? MODULER.slice(0, 11).flatMap((m) => m.blocks.filter((b) => b.kind === "text")) : [];
      for (const post of TACKNING[fraga.id] ?? []) {
        assert.ok(post.text && post.kalla, `${fraga.id}: text och källa`);
        const block = [...fore, ...tidigare].find((b) => b.id === post.block);
        assert.ok(block, `${fraga.id}: ${post.block} är inget textblock före frågan i ${module.id}`);
        assert.ok(utanMarkdown(block.sv).includes(squash(post.text)), `${fraga.id}: "${post.text}" står inte i ${post.block}`);
      }
    });
  }
});

test("textblocken nämner inga frågenummer", () => {
  for (const module of MODULER) {
    for (const block of module.blocks.filter((b) => b.kind === "text")) {
      assert.doesNotMatch(block.sv, /\b[Ff]råga \d/, `${module.id} ${block.id}`);
    }
  }
});

test("ett tillagt textblock har svenska men inget engelskt original", () => {
  for (const block of MODULER.flatMap((module) => module.blocks.filter((b) => b.tillagd))) {
    assert.equal(block.kind, "text", block.id);
    assert.ok(filled(block.sv), `${block.id}: svensk text`);
    assert.equal(block.en, undefined, `${block.id}: inget original`);
    assert.match(block.id, /^m\d+-tillagg-\d+$/, `${block.id}: id som m7-tillagg-1`);
  }
  for (const block of tillagda()) assert.equal(block.en, undefined, `${block.id} i vyn`);
});
