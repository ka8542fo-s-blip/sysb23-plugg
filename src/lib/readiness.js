// Kopplar schemat till pluggdatan: hur långt du kommit i materialet för
// en delkurs, formulerat som en mening i stället för en poäng.

import { overallStats } from "./progress.js";
import { loadReadChapters } from "./storage.js";
import { daysUntil } from "./dates.js";

const GRADE_ORDER = ["U", "E", "D", "C", "B", "A"];

const ORDINALS = [
  null,
  null,
  "varannan dag",
  "var tredje dag",
  "var fjärde dag",
  "var femte dag",
  "var sjätte dag",
  "var sjunde dag",
  "var åttonde dag",
  "var nionde dag",
  "var tionde dag",
  "var elfte dag",
  "var tolfte dag",
];

function everyNthDay(days) {
  if (days <= 1) return "om dagen";
  return ORDINALS[days] || `var ${days}:e dag`;
}

export function bestGrade(exams) {
  let best = null;
  for (const exam of exams) {
    if (best === null || GRADE_ORDER.indexOf(exam.grade) > GRADE_ORDER.indexOf(best)) {
      best = exam.grade;
    }
  }
  return best;
}

// course = kursobjektet ur data/index.js (eller undefined om innehåll saknas).
export function readinessFor({ course, answers, exams, readChapters }) {
  if (!course) return { hasContent: false, sentence: "Material saknas i appen än." };

  const chapters = course.chapters || [];
  const read =
    readChapters ||
    loadReadChapters(
      course.id,
      chapters.map((chapter) => chapter.id),
    );
  const chaptersRead = chapters.filter((chapter) => read[chapter.id]).length;
  const unread = chapters.length - chaptersRead;

  const stats = overallStats(course, answers);
  const courseExams = exams.filter((exam) => exam.courseId === course.id);
  const grade = bestGrade(courseExams);

  const parts = [];
  if (chapters.length > 0) {
    parts.push(`läst ${chaptersRead} av ${chapters.length} kapitel`);
  }
  if (stats.answered > 0) {
    parts.push(
      `${stats.accuracy} % rätt på ${stats.answered} ${stats.answered === 1 ? "fråga" : "frågor"}`,
    );
  }
  if (courseExams.length > 0) {
    parts.push(`bästa prov ${grade}`);
  }

  const started = chaptersRead > 0 || stats.answered > 0 || courseExams.length > 0;

  return {
    hasContent: true,
    // Läskartan följer med så att den som behöver veta *vilket* kapitel som
    // är oläst slipper läsa localStorage en gång till.
    read,
    chapters,
    chaptersRead,
    chaptersTotal: chapters.length,
    unread,
    accuracy: stats.accuracy,
    answered: stats.answered,
    examCount: courseExams.length,
    bestGrade: grade,
    sentence: started
      ? `Du har ${parts.join(", ")}.`
      : "Du har inte börjat plugga på den här delkursen än.",
  };
}

// "6 olästa kapitel på 50 dagar — ett kapitel var åttonde dag räcker."
export function pacingFor(readiness, examDate) {
  if (!readiness.hasContent || !readiness.unread || readiness.unread <= 0) return null;
  const days = daysUntil(examDate);
  if (days <= 0) return null;

  const chapters = `${readiness.unread} ${readiness.unread === 1 ? "oläst kapitel" : "olästa kapitel"}`;
  const dayText = `${days} ${days === 1 ? "dag" : "dagar"}`;

  if (days < readiness.unread) {
    return `${chapters} på ${dayText} — dags att prioritera.`;
  }
  const interval = Math.floor(days / readiness.unread);
  return `${chapters} på ${dayText} — ett kapitel ${everyNthDay(interval)} räcker.`;
}
