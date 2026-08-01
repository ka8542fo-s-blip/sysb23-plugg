// Enkel localStorage-wrapper. Alla nycklar prefixas med "sysb23:".

const PREFIX = "sysb23:";

export const KEYS = {
  answers: "answers", // { [questionId]: { correct: n, wrong: n, last: "correct"|"wrong", lastAt: iso } }
  exams: "exams", // [ { id, date, courseId, points, percent, grade, questions: [...] } ]
  essays: "essays", // { [essayId]: { draft: "…", checked: [bool], updatedAt: iso } }
  settings: "settings", // { timerOn, timerMinutes, practiceTopics, practiceDifficulty }
};

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Full lagring eller privat läge — sidan fungerar ändå, bara utan sparning.
  }
}

export function clearAll() {
  try {
    const doomed = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(PREFIX)) doomed.push(k);
    }
    doomed.forEach((k) => localStorage.removeItem(k));
  } catch {
    /* inget att göra */
  }
}

export const defaultSettings = {
  timerOn: true,
  timerMinutes: 20,
  practiceTopics: [], // tom lista = alla ämnen
  practiceDifficulty: 0, // 0 = alla
};

// Registrerar ett svar på en fråga i historiken.
export function recordAnswer(answers, questionId, wasCorrect) {
  const prev = answers[questionId] || { correct: 0, wrong: 0 };
  return {
    ...answers,
    [questionId]: {
      correct: prev.correct + (wasCorrect ? 1 : 0),
      wrong: prev.wrong + (wasCorrect ? 0 : 1),
      last: wasCorrect ? "correct" : "wrong",
      lastAt: new Date().toISOString(),
    },
  };
}
