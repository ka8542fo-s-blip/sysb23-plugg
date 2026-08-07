// Vart pluggknappen leder. Den väljer inte läge åt användaren — den byter
// delkurs och öppnar kompendiets innehållsförteckning. Därifrån bestämmer
// man själv: "Fortsätt läsa", ett visst kapitel, eller något annat.

import { getCourse } from "../data/index.js";
import { relativeDays } from "./dates.js";

export const STUDY_LABEL = "Plugga till denna tenta";

// Delkurser utan innehåll i appen får ingen knapp alls.
export function studyTargetFor(subcourse) {
  const contentId = subcourse?.contentId;
  if (!contentId) return { available: false };

  const course = getCourse(contentId);
  if (!course || course.id !== contentId) return { available: false };

  return { available: true, courseId: contentId, courseName: course.name };
}

// "Strategi-tentan om 50 dagar"
export function examBackLabel(exam) {
  const name = exam.subcourseData?.short || exam.subcourseData?.name || "Tentan";
  return `${name}-tentan ${relativeDays(exam.days)}`;
}

// Byter delkurs, går till Läs → Kompendium och sätter tillbakalänken.
// chapterId: null nollställer ett kapitel som råkade vara öppet sedan
// tidigare, så att man alltid landar på innehållsförteckningen.
export function startStudying({ target, exam, navigate, onSelectCourse }) {
  if (!target?.available) return;
  onSelectCourse(target.courseId);
  navigate(
    "las",
    { segment: "kompendium", chapterId: null },
    { view: "schema", label: examBackLabel(exam) },
  );
}
