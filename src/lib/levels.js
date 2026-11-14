// Hur långt man har kommit i Verksamhetsarkitektur, i tre delar (kortet i
// Statistik): modulerna (det tentan bygger på), Zachman utöver modul 4 och
// Fördjupning. Rena funktioner som läser samma lagring som Öva (answers),
// Essä (essayState, `done` = genomgången) och Zachman (modelProgress).
import { isDone } from "./practiceQueue.js";

const count = (items, test) => items.filter(test).length;
const part = (label, done, total) => ({ label, done, total });
const sum = (parts) => ({
  done: parts.reduce((total, p) => total + p.done, 0),
  total: parts.reduce((total, p) => total + p.total, 0),
});

export const essayReviewed = (essayState, id) => Boolean(essayState?.[id]?.done);

// Modulernas essäer och de som hör till Zachman-delen (`level: "troligt"`).
const coreEssays = (course) => (course.essays || []).filter((essay) => !essay.level);
const levelEssays = (course, level) => (course.essays || []).filter((essay) => essay.level === level);

export function levelStats(course, { answers = {}, essayState = {}, modelProgress = {}, troligtTaskIds = [] }) {
  const questions = course.questions || [];
  const extra = course.extraQuestions || [];
  const karna = [
    part("Öva-frågor klara", count(questions, (q) => isDone(answers[q.id])), questions.length),
    part("Essäfrågor genomgångna", count(coreEssays(course), (e) => essayReviewed(essayState, e.id)), coreEssays(course).length),
  ];
  const troligtEssays = levelEssays(course, "troligt");
  const troligt = [
    part("Uppgifter i fliken Zachman klara", count(troligtTaskIds, (id) => modelProgress[id]), troligtTaskIds.length),
    part(
      troligtEssays.length === 1 ? "Zachman-essän genomgången" : "Essäfrågor genomgångna",
      count(troligtEssays, (e) => essayReviewed(essayState, e.id)),
      troligtEssays.length,
    ),
  ].filter((p) => p.total > 0);
  const fordjupning = [part("Extrafrågor klara", count(extra, (q) => isDone(answers[q.id])), extra.length)].filter(
    (p) => p.total > 0,
  );
  return {
    karna: { key: "karna", label: "Modulerna", note: "Det läraren har sagt att tentan bygger på.", parts: karna, ...sum(karna) },
    troligt: {
      key: "troligt",
      label: "Zachman, utöver modul 4",
      note: "Kommer troligen på tentan, se modul 4 i Läs.",
      parts: troligt,
      ...sum(troligt),
    },
    fordjupning: {
      key: "fordjupning",
      label: "Fördjupning",
      note: "Extra, utanför modulerna.",
      parts: fordjupning,
      ...sum(fordjupning),
    },
  };
}

// Hur långt man har kommit per modul (Hem och Statistik, Verksamhetsarkitektur
// sedan 2026-11-14): Öva-frågor klara/totalt och förklarakort klara/totalt, i
// kursens ordning (12, 1–11). Klar = två rätt i rad, som i Öva.
export function moduleProgress(course, answers = {}) {
  const chapterOf = Object.fromEntries((course.topics || []).map((topic) => [topic.id, topic.chapter]));
  const inChapter = (items, id) => items.filter((item) => (item.chapter ?? chapterOf[item.topic]) === id);
  return (course.chapters || []).map((chapter) => {
    const questions = inChapter(course.questions || [], chapter.id);
    const cards = inChapter(course.explainCards || [], chapter.id);
    return {
      chapterId: chapter.id,
      number: chapter.number,
      title: chapter.title,
      ova: { done: count(questions, (q) => isDone(answers[q.id])), total: questions.length },
      cards: { done: count(cards, (c) => isDone(answers[c.id])), total: cards.length },
    };
  });
}
