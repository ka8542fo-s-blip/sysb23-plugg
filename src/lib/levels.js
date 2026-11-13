// Nivåerna Kärna, Troligt och Fördjupning (Verksamhetsarkitektur): hur stor
// del som är klar, modulstatus och svaga punkter. Rena funktioner som läser
// samma lagring som Öva (answers), Essä (essayState, `done` = genomgången)
// och Zachman (modelProgress). Används av fliken Tentan och av Statistik.
import { isDone, normalizeStat } from "./practiceQueue.js";

const count = (items, test) => items.filter(test).length;
const part = (label, done, total) => ({ label, done, total });
const sum = (parts) => ({
  done: parts.reduce((total, p) => total + p.done, 0),
  total: parts.reduce((total, p) => total + p.total, 0),
});

export const essayReviewed = (essayState, id) => Boolean(essayState?.[id]?.done);

// Modulernas essäer (Kärna) och de som är märkta med en annan nivå.
const coreEssays = (course) => (course.essays || []).filter((essay) => !essay.level);
const levelEssays = (course, level) => (course.essays || []).filter((essay) => essay.level === level);

export function levelStats(course, { answers = {}, essayState = {}, modelProgress = {}, troligtTaskIds = [] }) {
  const questions = course.questions || [];
  const extra = course.extraQuestions || [];
  const karna = [
    part("Öva-frågor klara", count(questions, (q) => isDone(answers[q.id])), questions.length),
    part("Essäer genomgångna", count(coreEssays(course), (e) => essayReviewed(essayState, e.id)), coreEssays(course).length),
  ];
  const troligtEssays = levelEssays(course, "troligt");
  const troligt = [
    part("Zachman-uppgifter klara", count(troligtTaskIds, (id) => modelProgress[id]), troligtTaskIds.length),
    part(
      troligtEssays.length === 1 ? "Zachman-essän genomgången" : "Essäer genomgångna",
      count(troligtEssays, (e) => essayReviewed(essayState, e.id)),
      troligtEssays.length,
    ),
  ].filter((p) => p.total > 0);
  const fordjupning = [part("Docx-frågor klara", count(extra, (q) => isDone(answers[q.id])), extra.length)].filter(
    (p) => p.total > 0,
  );
  return {
    karna: { key: "karna", label: "Kärna", parts: karna, ...sum(karna) },
    troligt: { key: "troligt", label: "Troligt", parts: troligt, ...sum(troligt) },
    fordjupning: { key: "fordjupning", label: "Fördjupning", parts: fordjupning, ...sum(fordjupning) },
  };
}

// Kapitlet för en fråga via dess ämne (som Öva).
function chapterOfTopic(course) {
  return Object.fromEntries((course.topics || []).map((topic) => [topic.id, topic.chapter]));
}

// En rad per modul i kursens ordning: läst, Öva klara/totalt, essäer
// genomgångna/totalt (Kärna) och första essän som inte är genomgången.
export function moduleStatus(course, { answers = {}, essayState = {}, readChapters = {} }) {
  const topicChapter = chapterOfTopic(course);
  return (course.chapters || []).map((chapter) => {
    const questions = (course.questions || []).filter((q) => topicChapter[q.topic] === chapter.id);
    const essays = coreEssays(course).filter((e) => e.chapter === chapter.id);
    const ova = { done: count(questions, (q) => isDone(answers[q.id])), total: questions.length };
    const essa = { done: count(essays, (e) => essayReviewed(essayState, e.id)), total: essays.length };
    const firstOpenEssay = essays.find((e) => !essayReviewed(essayState, e.id))?.id ?? essays[0]?.id ?? null;
    return {
      chapterId: chapter.id,
      number: chapter.number,
      title: chapter.title,
      read: Boolean(readChapters[chapter.id]),
      ova,
      essa,
      firstOpenEssay,
      complete: ova.done === ova.total && essa.done === essa.total,
    };
  });
}

// Frågor vars senaste svar var fel, per modul i kursens ordning. Kärnans
// frågor (Öva) och Fördjupningens (docx) hålls isär med `bank`.
export function weakPoints(course, answers = {}) {
  const topicChapter = chapterOfTopic(course);
  const wrong = (q) => normalizeStat(answers[q.id])?.last === "wrong";
  const items = [
    ...(course.questions || []).filter(wrong).map((q) => ({ id: q.id, question: q.question, chapter: topicChapter[q.topic], bank: "karna" })),
    ...(course.extraQuestions || []).filter(wrong).map((q) => ({ id: q.id, question: q.question, chapter: topicChapter[q.topic], bank: "fordjupning" })),
  ];
  return (course.chapters || [])
    .map((chapter) => ({
      chapterId: chapter.id,
      number: chapter.number,
      title: chapter.title,
      items: items.filter((item) => item.chapter === chapter.id),
    }))
    .filter((group) => group.items.length > 0);
}
