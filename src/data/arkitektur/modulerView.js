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
  return { kind: block.kind, id: block.id, sv: block.sv, en: block.en };
}

export const modulerIntro = INLEDNING;

export const moduler = MODULER.map((module) => ({
  id: module.id,
  number: module.number,
  title: module.title,
  blocks: module.blocks.map((block) => buildBlock(block, module.id)),
}));

// Alla frågor och fritextfrågor i dokumentens ordning.
export const modulerItems = moduler.flatMap((module) =>
  module.blocks.filter((block) => block.kind === "fraga" || block.kind === "fritext"),
);
