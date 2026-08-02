// Väljer vad "Plugga till denna tenta" ska göra. Räknar inte om något —
// återanvänder beredskapsberäkningen i readiness.js.

import { getCourse } from "../data/index.js";
import { readinessFor } from "./readiness.js";
import { relativeDays } from "./dates.js";

// Under så här många besvarade frågor är det för tidigt att provskriva.
export const EXAM_READY_THRESHOLD = 20;

// subcourse = posten ur schedule.subcourses. Fungerar oavsett var den anropas.
export function nextStudyStep({ subcourse, answers, exams }) {
  const contentId = subcourse?.contentId;
  if (!contentId) return { available: false };

  const course = getCourse(contentId);
  if (!course || course.id !== contentId) return { available: false };

  const readiness = readinessFor({ course, answers, exams });
  const chapters = course.chapters || [];

  // 1. Olästa kapitel → läs nästa olästa.
  if (readiness.unread > 0) {
    const index = chapters.findIndex((chapter) => !readiness.read[chapter.id]);
    const chapter = chapters[index];
    return {
      available: true,
      courseId: contentId,
      courseName: course.name,
      readiness,
      view: "las",
      params: { segment: "kompendium", chapterId: chapter.id },
      label: `Läs kapitel ${index + 1}`,
    };
  }

  // 2. Allt läst men för få frågor → öva utan ämnesfilter.
  if (readiness.answered < EXAM_READY_THRESHOLD) {
    return {
      available: true,
      courseId: contentId,
      courseName: course.name,
      readiness,
      view: "ova",
      params: { topics: [] },
      label: "Öva frågor",
    };
  }

  // 3. Tillräckligt övat → förbered ett prov (startas av användaren).
  return {
    available: true,
    courseId: contentId,
    courseName: course.name,
    readiness,
    view: "prov",
    params: null,
    label: "Gör ett prov",
  };
}

// "Strategi-tentan om 50 dagar"
export function examBackLabel(exam) {
  const name = exam.subcourseData?.short || exam.subcourseData?.name || "Tentan";
  return `${name}-tentan ${relativeDays(exam.days)}`;
}

// Byter delkurs, navigerar och sätter tillbakalänken i ett svep.
export function startStudying({ step, exam, navigate, onSelectCourse }) {
  if (!step?.available) return;
  onSelectCourse(step.courseId);
  navigate(
    step.view,
    step.params ? { ...step.params, nonce: Date.now() } : null,
    { view: "schema", label: examBackLabel(exam) },
  );
}
