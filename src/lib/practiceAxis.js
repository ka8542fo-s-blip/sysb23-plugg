// Öva grupperar frågor per ämne (Strategi) eller per kapitel (Databaser:
// "Öva speglar Läs" — ett kapitel i Läs är en kvizz i Öva, i samma ordning
// och med samma namn). Manifestets `practiceBy` avgör. Frågorna bär alltid
// `topic`; i kapitelläget härleds kapitlet ur ämnets `chapter`, så
// topics.js och Begrepp-segmentet förblir orörda.

export function practiceMode(course) {
  return course?.practiceBy === "chapter" ? "chapter" : "topic";
}

function chapterOfTopic(course) {
  return Object.fromEntries((course.topics || []).map((topic) => [topic.id, topic.chapter]));
}

// Grupperna som Öva filtrerar på: { id, name } i visningsordning.
export function practiceGroups(course) {
  if (practiceMode(course) === "chapter") {
    return (course.chapters || []).map((chapter) => ({ id: chapter.id, name: chapter.title }));
  }
  return (course.topics || []).map((topic) => ({ id: topic.id, name: topic.name }));
}

// Funktion som ger en frågas grupp-id.
export function groupKeyFor(course) {
  if (practiceMode(course) !== "chapter") return (question) => question.topic;
  const chapterOf = chapterOfTopic(course);
  return (question) => question.chapter ?? chapterOf[question.topic] ?? null;
}

// Ämnes-id:n (t.ex. från ett begreppskort) till grupp-id:n.
export function groupsForTopics(course, topicIds) {
  if (practiceMode(course) !== "chapter") return topicIds;
  const chapterOf = chapterOfTopic(course);
  return [...new Set(topicIds.map((id) => chapterOf[id]).filter(Boolean))];
}

// Grupperna ett kapitels "Öva på detta kapitel" ska förvälja.
export function chapterPracticeGroups(course, chapter) {
  return practiceMode(course) === "chapter" ? [chapter.id] : chapter.topics || [];
}

// Grupp-id:n som faktiskt har frågor.
export function practicedGroupIds(course) {
  const keyOf = groupKeyFor(course);
  return new Set((course.questions || []).map(keyOf).filter(Boolean));
}

// Frågorna i gruppernas visningsordning (kapitel för kapitel), och inom en
// grupp i bankens ordning. Används när passet ska följa Läs i stället för
// att blandas.
export function orderByGroup(course, questions) {
  const keyOf = groupKeyFor(course);
  const position = new Map(practiceGroups(course).map((group, index) => [group.id, index]));
  const bankIndex = new Map((course.questions || []).map((question, index) => [question.id, index]));
  return [...questions].sort(
    (a, b) =>
      (position.get(keyOf(a)) ?? Infinity) - (position.get(keyOf(b)) ?? Infinity) ||
      (bankIndex.get(a.id) ?? 0) - (bankIndex.get(b.id) ?? 0),
  );
}
