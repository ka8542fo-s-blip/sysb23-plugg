// Fliken Tenta för flervalstentor (Säkerhet): en hel gammal tenta i
// tentans ordning, med tentans poäng och avdrag. Ren logik — vyn är
// views/ChoiceExam.jsx, datat course.choiceExams (samma form som pastExams).
//
// Ett svar är ett alternativindex i frågans egen `options` (inte den visade
// ordningen), så att svaret betyder samma sak oavsett tentans `order`.
// Obesvarad fråga ger 0. Fel svar ger −avdrag. Summan golvas inte: tentan
// säger inget om golv, och betyget blir U under 50 % oavsett.
import { gradeFor } from "./gradeScale.js";

const rightOf = (question) => (Array.isArray(question.correct) ? question.correct : [question.correct]);

// Tentans frågor i tentans ordning: delen med poäng, avdrag, `order` och
// frågan själv (ur Övas bank eller tentabanken).
export function writtenParts(course, exam) {
  const pool = [...(course.questions || []), ...(course.examBank || [])];
  return exam.sections
    .flatMap((section) => section.parts)
    .filter((part) => part.question)
    .map((part) => ({ ...part, item: pool.find((question) => question.id === part.question) }))
    .filter((part) => part.item);
}

// "ratt" (+poäng), "fel" (−avdrag) eller "blank" (0).
export function scorePart(part, choice) {
  if (choice === null || choice === undefined) return { status: "blank", points: 0 };
  return rightOf(part.item).includes(choice)
    ? { status: "ratt", points: part.points }
    : { status: "fel", points: part.penalty ? -part.penalty : 0 };
}

export function examResult(parts, choices = {}) {
  const max = parts.reduce((sum, part) => sum + part.points, 0);
  const result = { points: 0, max, right: 0, wrong: 0, blank: 0, answered: 0 };
  for (const part of parts) {
    const choice = choices[part.no];
    const { status, points } = scorePart(part, choice);
    result.points += points;
    if (status === "ratt") result.right++;
    else if (status === "fel") result.wrong++;
    else result.blank++;
    if (status !== "blank") result.answered++;
  }
  result.grade = gradeFor(max ? (100 * result.points) / max : 0);
  return result;
}

// Brytpunkten: svara om sannolikheten att du har rätt är större än
// avdrag / (poäng + avdrag).
export const breakEven = (points, penalty) => penalty / (points + penalty);
