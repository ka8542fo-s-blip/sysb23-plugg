// Fliken Moduler (Verksamhetsarkitektur, Kaspers beslut och plan
// 2026-11-22): lärarens tre moduldokument uppifrån och ned, på svenska.
//
// Modulfilerna (moduler/m01.js …) har den svenska texten i PDF:ens ordning.
// Här kopplas varje fråga och fritextfråga ihop med frågebanken:
// - engelska originalet (`en`) ur questions.js och essays.js, så att det
//   aldrig kan glida isär från det som är kontrollerat mot PDF:erna
// - facit (`correct`) ur questions.js; det skrivs aldrig i modulfilerna
// - fritextens id är förklarakortets id (`ea-f-…`), så att svar och status i
//   Moduler och Öva är samma post i sysb23:answers
import { questions } from "./questions.js";
import { essays } from "./essays.js";
import { explainCardId } from "./explainMap.js";
import { INLEDNING, MODULER } from "./moduler/index.js";
import { BORJA_HAR, FORELASNINGAR, INGRESS, INLEDNING_UTDRAG } from "./moduler/ingress.js";
import { topics } from "./topics.js";
import { ufSource } from "./ufView.js";

const bankQuestions = new Map(questions.map((question) => [question.id, question]));
const bankEssays = new Map(essays.map((essay) => [essay.id, essay]));

export const isTrueFalse = (question) =>
  question.options.length === 2 && question.options[0].text === "True" && question.options[1].text === "False";

// Lärarens "Key lesson" står sist i modellsvaret i essays.js.
const KEY_LESSON = /\n(?:Key lesson|Important lesson)\n/;

function buildQuestion(block, chapter) {
  const question = bankQuestions.get(block.id);
  if (!question) throw new Error(`Moduler: okänd fråga ${block.id}`);
  const trueFalse = isTrueFalse(question);
  const svOptions = block.options ?? (trueFalse ? ["Sant", "Falskt"] : question.options.map((option) => option.text));
  if (svOptions.length !== question.options.length) {
    throw new Error(`Moduler: ${block.id} har ${svOptions.length} alternativ, banken ${question.options.length}`);
  }
  return {
    kind: "fraga",
    id: block.id,
    nr: block.nr,
    chapter,
    typ: trueFalse ? "sant-falskt" : "flerval",
    question: { sv: block.question, en: question.question },
    options: question.options.map((option, index) => ({ sv: svOptions[index], en: option.text })),
    correct: question.correct,
    explanation: { sv: block.explanation, en: question.explanationUf ?? null },
  };
}

function buildFreeText(block, chapter) {
  const essay = bankEssays.get(block.id);
  if (!essay) throw new Error(`Moduler: okänd fritextfråga ${block.id}`);
  const [modelEn, keyLessonEn = null] = essay.modelAnswer.split(KEY_LESSON);
  const extras = essay.extraModelAnswers || [];
  return {
    kind: "fritext",
    id: explainCardId([block.id]),
    essayId: block.id,
    nr: block.nr,
    chapter,
    typ: block.typ,
    // Egen rubrik ("Arkitektens tänkande", "Scenario 1 — …") och egen
    // etikett för svaret ("Möjliga svar", "Svar") där läraren har det.
    title: block.title ?? null,
    answerLabel: block.answerLabel ?? null,
    question: { sv: block.question, en: essay.question },
    modelAnswer: { sv: block.modelAnswer, en: modelEn.trim() },
    keyLesson: block.keyLesson ? { sv: block.keyLesson, en: keyLessonEn?.trim() ?? null } : null,
    keyLessonLabel: block.keyLessonLabel ?? { sv: "Viktig lärdom", en: "Key lesson" },
    extraModelAnswers: (block.extraModelAnswers || []).map((sv, index) => ({ sv, en: extras[index]?.text ?? null })),
  };
}

function buildBlock(block, chapter) {
  if (block.kind === "fraga") return buildQuestion(block, chapter);
  if (block.kind === "fritext") return buildFreeText(block, chapter);
  // Ett tillagt textblock (`tillagd`, sedan omskrivningen 23 nov) har bara
  // svenska; det har inget original att visa.
  if (block.tillagd) return { kind: block.kind, id: block.id, sv: block.sv, tillagd: true };
  return { kind: block.kind, id: block.id, sv: block.sv, en: block.en };
}

// Lärarens exempel i modul 1 som är samma fråga som en senare fråga i
// modulen (fråga 6 och 9): blocket får en kopia av den frågans kort, med
// samma id och därmed samma svar och status. Exemplets text ur PDF:en
// (`kalla`, med facit utskrivet) följer inte med, så den kan aldrig visas.
// Blockslaget är eget, så att frågan räknas en gång i framsteg och Öva.
function withRepeats(blocks) {
  return blocks.map((block) => {
    if (block.kind !== "upprepning") return block;
    const item = blocks.find((other) => (other.kind === "fraga" ? other.id : other.essayId) === block.av);
    if (!item || (item.kind !== "fraga" && item.kind !== "fritext")) {
      throw new Error(`Moduler: ${block.id} upprepar okänd fråga ${block.av}`);
    }
    return { kind: "upprepning", id: block.id, sammaSom: item.nr, item };
  });
}

// Inledningen med utdraget som det hopfällda kortet visar.
export const modulerIntro = { ...INLEDNING, utdrag: INLEDNING_UTDRAG };

const lectureOf = (moduleId) => {
  const lecture = FORELASNINGAR.find((item) => item.moduler.includes(moduleId));
  return lecture ? { nummer: lecture.nummer, title: lecture.title } : null;
};

export const moduler = MODULER.map((module) => ({
  id: module.id,
  number: module.number,
  title: module.title,
  // Modulens början: lärarens föreläsning, en mening ur hans text som
  // ingress, och markeringen på modul 12 där han ber oss börja.
  forelasning: lectureOf(module.id),
  ingress: INGRESS[module.id] ? { sv: INGRESS[module.id].sv, en: INGRESS[module.id].en } : null,
  borjaHar: module.id === BORJA_HAR,
  blocks: withRepeats(module.blocks.map((block) => (block.kind === "upprepning" ? block : buildBlock(block, module.id)))),
}));

// Alla frågor och fritextfrågor i dokumentens ordning.
export const modulerItems = moduler.flatMap((module) =>
  module.blocks.filter((block) => block.kind === "fraga" || block.kind === "fritext"),
);

// ---------------------------------------------------------------------------
// Öva (2026-11-22): samma frågor och fritextfrågor som i Moduler, på svenska
// och i modulordning 1–12. Frågan, alternativen (i bankens ordning, så att
// `correct` gäller oförändrat) och förklaringen är de svenska; Öva blandar
// alternativen som förut. Varje fritextfråga är ett eget förklarakort med
// samma id som i Moduler (inga ihopslagna kort längre).
const topicOfChapter = Object.fromEntries(topics.map((topic) => [topic.chapter, topic.id]));

// Kapitlen i Öva och Statistik: modulerna 1–12 med svenska titlar.
export const modulerChapters = moduler.map((module) => ({
  id: module.id,
  number: module.number,
  title: module.title.sv,
  topics: [topicOfChapter[module.id]],
}));

export const modulerQuestions = moduler.flatMap((module) =>
  module.blocks
    .filter((block) => block.kind === "fraga")
    .map((item) => {
      const { explanation: _sv, explanationUf: _uf, difficulty: _d, ...rest } = bankQuestions.get(item.id);
      return {
        ...rest,
        chapter: module.id,
        question: item.question.sv,
        options: item.options.map((option) => ({ text: option.sv })),
        explanation: item.explanation.sv,
        source: ufSource(rest.source),
      };
    }),
);

const cardSource = (module, item) =>
  item.nr ? `Modul ${module.number}, fråga ${item.nr}` : `Modul ${module.number}, ${item.title?.sv ?? "fråga"}`;

export const modulerCards = moduler.flatMap((module) =>
  module.blocks
    .filter((block) => block.kind === "fritext")
    .map((item) => {
      const source = cardSource(module, item);
      const prompt = {
        id: item.essayId,
        label: item.title?.sv ?? `Fråga ${item.nr}`,
        question: item.question.sv,
        source,
        modelAnswer: item.modelAnswer.sv,
        answerLabel: item.answerLabel?.sv ?? null,
        keyLesson: item.keyLesson ? { label: item.keyLessonLabel.sv, text: item.keyLesson.sv } : null,
        extraModelAnswers: item.extraModelAnswers.map((extra) => ({ source: "Exempelsvaret i modulens inledning", text: extra.sv })),
      };
      return {
        id: item.id,
        kind: "forklara",
        chapter: module.id,
        topic: topicOfChapter[module.id],
        essayIds: [item.essayId],
        question: prompt.question,
        prompts: [prompt],
        options: [{ text: "Kunde" }, { text: "Kunde inte" }],
        correct: 0,
        fixedOrder: true,
        source,
      };
    }),
);
