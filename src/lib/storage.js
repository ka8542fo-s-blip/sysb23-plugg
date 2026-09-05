// Enkel localStorage-wrapper. Alla nycklar prefixas med "sysb23:".

const PREFIX = "sysb23:";

export const KEYS = {
  answers: "answers", // { [questionId]: { seen, correct, wrong, last: "correct"|"wrong", lastAt: iso, recent: [bool, bool] } }
  exams: "exams", // [ { id, date, courseId, points, percent, grade, questions: [...] } ]
  essays: "essays", // { [essayId]: { draft: "…", checked: [bool], updatedAt: iso } }
  settings: "settings", // { timerOn, timerMinutes, practiceTopics, practiceDifficulty }
  readSegment: "lasSegment", // "kompendium" | "begrepp" | "ordlista"
  course: "delkurs", // senast valda delkursen
  scheduleView: "schemaVy", // "lista" | "kalender"
  ttsRate: "upplasningstakt", // uppläsningens hastighet (t.ex. 1.15)
  ttsVoice: "upplasningsrost", // vald rösts namn, t.ex. "Alva"
  sqlRandom: "sqlSlump", // antal lösta slumpövningar
};

// Lösta SQL-övningar: sysb23:sql:<övningsId> = "solved" | "solved-with-help"
export function sqlKey(exerciseId) {
  return `sql:${exerciseId}`;
}

export function loadSqlProgress(exerciseIds) {
  const state = {};
  for (const id of exerciseIds) {
    const value = load(sqlKey(id), null);
    if (value === "solved" || value === "solved-with-help") state[id] = value;
  }
  return state;
}

export function saveSqlResult(exerciseId, status) {
  if (status) save(sqlKey(exerciseId), status);
}

// Nollställer en enskild övning — statusen ska gå att tjäna tillbaka när
// man lärt sig, inte fastna på "löst med hjälp" för alltid.
export function clearSqlResult(exerciseId) {
  try {
    localStorage.removeItem(PREFIX + sqlKey(exerciseId));
  } catch {
    /* privat läge — sidan fungerar ändå */
  }
}

// Tentaanmälan i Ladok: sysb23:examreg:<examId> = true (nyckeln tas
// bort vid avbockning, precis som lästa kapitel).
export function examRegKey(examId) {
  return `examreg:${examId}`;
}

export function loadExamRegistrations(examIds) {
  const state = {};
  for (const id of examIds) {
    if (load(examRegKey(id), false) === true) state[id] = true;
  }
  return state;
}

export function saveExamRegistration(examId, isRegistered) {
  const key = PREFIX + examRegKey(examId);
  try {
    if (isRegistered) localStorage.setItem(key, "true");
    else localStorage.removeItem(key);
  } catch {
    /* privat läge — sidan fungerar ändå */
  }
}

// Lästa kapitel sparas som en nyckel per kapitel: sysb23:read:<kurs>:<kapitel>
export function readChapterKey(courseId, chapterId) {
  return `read:${courseId}:${chapterId}`;
}

export function loadReadChapters(courseId, chapterIds) {
  const state = {};
  for (const chapterId of chapterIds) {
    if (load(readChapterKey(courseId, chapterId), false) === true) {
      state[chapterId] = true;
    }
  }
  return state;
}

export function saveReadChapter(courseId, chapterId, isRead) {
  const key = PREFIX + readChapterKey(courseId, chapterId);
  try {
    if (isRead) localStorage.setItem(key, "true");
    else localStorage.removeItem(key);
  } catch {
    /* privat läge — sidan fungerar ändå */
  }
}

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
  practiceExamFocus: false, // kärnämnen först i varje grupp i Öva
  practiceRecent: {}, // { [courseId]: [senast serverade fråge-id] } — karensen i Öva
};

// Registrerar ett svar på en fråga i historiken.
// Per fråga: visningar (ren statistik), rätt, fel, senaste resultat med
// tidsstämpel och de två senaste svaren — "klar" = två rätt i rad
// (lib/practiceQueue.js). Skrivs vid varje svar, aldrig vid passets slut.
// Äldre poster utan seen/recent tolkas av normalizeStat i practiceQueue.
export function recordAnswer(answers, questionId, wasCorrect) {
  const prev = answers[questionId] || { correct: 0, wrong: 0 };
  const recent = Array.isArray(prev.recent)
    ? prev.recent
    : prev.last
      ? [prev.last === "correct"]
      : [];
  return {
    ...answers,
    [questionId]: {
      seen: prev.seen ?? prev.correct + prev.wrong,
      correct: prev.correct + (wasCorrect ? 1 : 0),
      wrong: prev.wrong + (wasCorrect ? 0 : 1),
      last: wasCorrect ? "correct" : "wrong",
      lastAt: new Date().toISOString(),
      recent: [...recent, wasCorrect].slice(-2),
    },
  };
}

// En visning: frågan serverades. Rör inte svarsstatistiken.
export function recordSeen(answers, questionId) {
  const prev = answers[questionId] || { correct: 0, wrong: 0 };
  return {
    ...answers,
    [questionId]: { ...prev, seen: (prev.seen ?? prev.correct + prev.wrong) + 1 },
  };
}

// Nollställ övningsläget för en delkurs: bara dess frågor.
export function clearAnswersFor(answers, questionIds) {
  const drop = new Set(questionIds);
  return Object.fromEntries(Object.entries(answers).filter(([id]) => !drop.has(id)));
}
