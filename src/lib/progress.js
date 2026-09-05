import { accuracy } from "./scoring.js";
import { groupKeyFor, practiceGroups } from "./practiceAxis.js";
import { isDone } from "./practiceQueue.js";

// Sammanställer svarshistoriken per ämne — eller per kapitel för delkurser
// där Öva speglar Läs — för Hem och Statistik.
export function topicStats(course, answers) {
  const keyOf = groupKeyFor(course);
  return practiceGroups(course).map((topic) => {
    const questions = course.questions.filter((q) => keyOf(q) === topic.id);
    let correct = 0;
    let wrong = 0;
    let touched = 0;
    let done = 0;

    for (const question of questions) {
      const stat = answers[question.id];
      if (!stat) continue;
      if (isDone(stat)) done++;
      correct += stat.correct;
      wrong += stat.wrong;
      if (stat.correct + stat.wrong > 0) touched++;
    }

    const answered = correct + wrong;
    return {
      id: topic.id,
      name: topic.name,
      examWeight: topic.examWeight,
      questionCount: questions.length,
      touched,
      done,
      answered,
      correct,
      wrong,
      accuracy: accuracy({ correct, wrong }),
    };
  });
}

export function overallStats(course, answers) {
  const ids = new Set(course.questions.map((q) => q.id));
  let correct = 0;
  let wrong = 0;
  let seen = 0;
  let done = 0;

  for (const [questionId, stat] of Object.entries(answers)) {
    if (!ids.has(questionId)) continue;
    if (isDone(stat)) done++;
    correct += stat.correct;
    wrong += stat.wrong;
    if (stat.correct + stat.wrong > 0) seen++;
  }

  return {
    answered: correct + wrong,
    correct,
    wrong,
    uniqueSeen: seen,
    done,
    total: course.questions.length,
    accuracy: accuracy({ correct, wrong }),
  };
}

// "Fokusera här": svagaste ämnet med minst 5 besvarade frågor.
export function focusTopic(stats, minAnswers = 5) {
  const candidates = stats.filter(
    (topic) => topic.answered >= minAnswers && topic.accuracy !== null,
  );
  if (candidates.length === 0) return null;
  return candidates.reduce((worst, topic) =>
    topic.accuracy < worst.accuracy ? topic : worst,
  );
}
