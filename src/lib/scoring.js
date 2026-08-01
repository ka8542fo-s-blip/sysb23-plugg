// Poängen följer den riktiga tentan: +6 rätt, −1 fel, 0 för överhoppad.
export const POINTS = { correct: 6, wrong: -1, skipped: 0 };
export const QUESTIONS_PER_EXAM = 10;
export const MAX_EXAM_POINTS = QUESTIONS_PER_EXAM * POINTS.correct; // 60

// Betygsstegen: A 85–100, B 75–84, C 65–74, D 55–64, E 50–54, U < 50.
export const GRADE_SCALE = [
  { grade: "U", from: 0 },
  { grade: "E", from: 50 },
  { grade: "D", from: 55 },
  { grade: "C", from: 65 },
  { grade: "B", from: 75 },
  { grade: "A", from: 85 },
];

export const THRESHOLDS = [50, 55, 65, 75, 85];

export function gradeFor(percent) {
  let grade = "U";
  for (const step of GRADE_SCALE) {
    if (percent >= step.from) grade = step.grade;
  }
  return grade;
}

// answers: [{ questionId, choice: number|null, correct: number }]
export function scoreExam(entries) {
  let points = 0;
  let correct = 0;
  let wrong = 0;
  let skipped = 0;

  for (const entry of entries) {
    if (entry.choice === null || entry.choice === undefined) {
      skipped++;
      points += POINTS.skipped;
    } else if (entry.choice === entry.correct) {
      correct++;
      points += POINTS.correct;
    } else {
      wrong++;
      points += POINTS.wrong;
    }
  }

  const max = entries.length * POINTS.correct;
  // Negativ totalpoäng golvas till 0 procent.
  const percent = max === 0 ? 0 : Math.max(0, Math.round((points / max) * 100));

  return { points, max, percent, grade: gradeFor(percent), correct, wrong, skipped };
}

export function accuracy(stat) {
  if (!stat) return null;
  const total = stat.correct + stat.wrong;
  if (total === 0) return null;
  return Math.round((stat.correct / total) * 100);
}

export function formatTime(seconds) {
  const safe = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(safe / 60);
  const rest = safe % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}
