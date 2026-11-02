// SQL-flikens två spår som samma form: sektioner med uppgifter i en bestämd
// ordning. Ämnen är byggstenarna per ämne (levels i sqlExercises.js), Tentanivå
// är frågor i tentans form (examSections i sqlExamBank.js). Rena funktioner;
// vyerna står för läsning av utkast och sparande.

export const SOLVED = "solved";
export const WITH_HELP = "solved-with-help";

const inLessonOrder = (exercises, order) =>
  order ? order.map((id) => exercises.find((exercise) => exercise.id === id)) : exercises;

export function topicSections(course) {
  const exercises = course.sqlExercises || [];
  return (course.sqlLevels || [])
    .filter((level) => !level.examTrack)
    .map((level) => ({
      id: level.id,
      kicker: `Nivå ${level.number}`,
      title: level.name,
      summary: level.summary,
      part: level.part,
      lesson: level.lesson.trim(),
      items: inLessonOrder(exercises.filter((exercise) => exercise.level === level.id), level.order)
        .map((exercise, index) => ({
          ...exercise,
          label: String(index + 1),
          heading: `Uppgift ${level.number}.${index + 1}`,
        })),
    }))
    .filter((section) => section.items.length > 0);
}

export function examTrackSections(course) {
  const exercises = course.sqlExercises || [];
  const lessonOf = (id) => (course.sqlLevels || []).find((level) => level.id === id)?.lesson.trim();
  return (course.sqlExamSections || []).map((section) => ({
    ...section,
    lesson: section.guide?.trim() ?? lessonOf(section.lessonFrom),
    items: exercises
      .filter((exercise) => (section.level ? exercise.level === section.level : exercise.section === section.id))
      .map((exercise, index) => ({
        ...exercise,
        label: exercise.label ?? String(index + 1),
        heading: exercise.source ? `${exercise.source} · uppgift 4` : `${section.kicker} · fråga ${index + 1}`,
      })),
  }));
}

export const allItems = (sections) => sections.flatMap((section) => section.items);

// Var uppgiften står: dess sektion och grannarna, över sektionsgränserna, så
// att Nästa på sista uppgiften går vidare till nästa sektion.
export function locate(sections, id) {
  const items = allItems(sections);
  const at = items.findIndex((item) => item.id === id);
  if (at < 0) return null;
  const sectionOf = (item) => sections.find((section) => section.items.includes(item));
  const step = (item) => (item ? { item, section: sectionOf(item) } : null);
  return { item: items[at], section: sectionOf(items[at]), prev: step(items[at - 1]), next: step(items[at + 1]) };
}

// Fortsätt: den senast öppna om den inte är klar, annars nästa ej klara efter
// den, och sist runt till början. null när allt är klart.
export function resumeItem(sections, progress, lastId) {
  const items = allItems(sections);
  const from = Math.max(items.findIndex((item) => item.id === lastId), 0);
  for (let i = 0; i < items.length; i++) {
    const item = items[(from + i) % items.length];
    if (!progress[item.id]) return item;
  }
  return null;
}

export const countSolved = (items, progress) => items.filter((item) => progress[item.id]).length;

// Rutans läge: löst, löst med hjälp, påbörjad (ett svar som inte bara är
// uppgiftens startkod) eller orörd.
export function tileState(status, draft, starter = "") {
  if (status === SOLVED) return "solved";
  if (status === WITH_HELP) return "help";
  return typeof draft === "string" && draft.trim() && draft !== starter ? "started" : "empty";
}

// Fliken i hjälpytan: genomgången när ämnet är nytt, annars tabellerna. Valet
// sparas per sektion. Tentafrågorna går inte att skriva utan tabellerna.
export function defaultHelpTab(section, progress, exam) {
  if (exam || !section.lesson) return "tabeller";
  return countSolved(section.items, progress) === 0 ? "genomgang" : "tabeller";
}
