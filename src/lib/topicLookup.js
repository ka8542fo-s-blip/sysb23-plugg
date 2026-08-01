// Enda vägen till ämnesdatan. Ingen komponent ska plocka keyPoints eller
// pitfalls direkt ur datafilerna — topics.js äger de korta punkterna.

const cache = new WeakMap();

export function topicLookup(topics) {
  if (cache.has(topics)) return cache.get(topics);

  const topicsById = Object.fromEntries(topics.map((topic) => [topic.id, topic]));

  function chapterForTopic(topicId) {
    return topicsById[topicId]?.chapter ?? null;
  }

  function topicsForChapter(chapterId) {
    return topics.filter((topic) => topic.chapter === chapterId);
  }

  // Grupperat per ämne så att kapitelavslutet kan sätta ämnesetiketter när
  // kapitlet introducerar flera ämnen.
  function groupBy(field) {
    return (topicIds = []) =>
      topicIds
        .map((id) => topicsById[id])
        .filter(Boolean)
        .map((topic) => ({
          topicId: topic.id,
          name: topic.name,
          items: topic[field] ?? [],
        }))
        .filter((group) => group.items.length > 0);
  }

  const api = {
    topicsById,
    chapterForTopic,
    topicsForChapter,
    keyPointsFor: groupBy("keyPoints"),
    pitfallsFor: groupBy("pitfalls"),
    nameFor: (topicId) => topicsById[topicId]?.name ?? topicId,
  };

  cache.set(topics, api);
  return api;
}
