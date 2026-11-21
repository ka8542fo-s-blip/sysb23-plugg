// De tre provtentorna i fliken Tenta (Verksamhetsarkitektur, Kaspers
// omgörning 2026-11-14). Varje provtenta har:
//   Uppgift 1, fritext: en essä och ett scenario (nedan).
//   Uppgift 2, flerval, inklusive raderna i "Zachman or TOGAF".
//   Uppgift 3, sant/falskt.
// De 135 modulfrågorna delas i tre fasta mängder utan överlapp, ungefär en
// tredjedel av varje moduls frågor per provtenta (lib/mockExam.js). Inga
// poäng och inget betyg: årets poäng är okända.
//
// 2026-11-21 (bara lärarens tre moduldokument): Zachman-essän i provtenta 1
// är utbytt mot Essay 2. Text som redan skrivits på 1a flyttas undan
// (`previousFreeText`, migrateMockState i lib/mockExam.js) och visas inte.
import { buildMockExams } from "../../lib/mockExam.js";
import { essays } from "./essays.js";
import { ufQuestions } from "./ufView.js";
import { CHAPTER_ORDER, chapters } from "./reading.js";
import { topics } from "./topics.js";

export const MOCK_FREE_TEXT = [
  ["ea-e12-essay-2", "ea-e12-scenario-1"], // Essay 2 (Zachman och TOGAF) och Scenario 1 (AI)
  ["ea-e12-essay-3", "ea-e12-scenario-2"], // Essay 3 (capabilities) och Scenario 2 (600 applikationer)
  ["ea-e12-essay-4", "ea-e12-slututmaning"], // Essay 4 (governance och agilitet) och Final challenge (CRM)
];

// Raden överst i fliken.
export const MOCK_EXAM_NOTE =
  "Tentan har sant/falskt, flerval och någondera essäfråga (fritextfrågor), enligt kursinformationen. På alla tre tentorna förra året gav fel svar på sant/falskt 0 poäng, så svara alltid.";

const chapterOfTopic = Object.fromEntries(topics.map((topic) => [topic.id, topic.chapter]));

// Exempelfrågan i modul 1:s inledning (`example`, tillagd 2026-11-21) ingår
// inte, så att uppdelningen och redan sparade svar är oförändrade.
export const mockExams = buildMockExams({
  questions: ufQuestions.filter((question) => !question.example),
  essays,
  chapterOf: (question) => question.chapter ?? chapterOfTopic[question.topic],
  chapterOrder: CHAPTER_ORDER,
  chapters,
  freeText: MOCK_FREE_TEXT,
});

// Vilken fråga en fritextplats hade tidigare, för att flytta undan gammal text.
const MOCK_PREVIOUS_FREE_TEXT = { "ea-prov-1": { "1a": "ea-e-zachman" } };
for (const exam of mockExams) exam.previousFreeText = MOCK_PREVIOUS_FREE_TEXT[exam.id] ?? {};
