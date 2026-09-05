// Gemensam sökning över kompendium, begrepp och ordlista.

const EXCERPT_RADIUS = 90;

function normalize(text) {
  return (text || "").toLowerCase();
}

// Plockar ut ett kort utdrag runt första träffen, med träffens exakta
// position så att den kan markeras i UI:t.
export function excerptAround(text, needle) {
  const haystack = normalize(text);
  const at = haystack.indexOf(normalize(needle));
  if (at === -1) return null;

  const start = Math.max(0, at - EXCERPT_RADIUS);
  const end = Math.min(text.length, at + needle.length + EXCERPT_RADIUS);
  return {
    before: (start > 0 ? "…" : "") + text.slice(start, at),
    match: text.slice(at, at + needle.length),
    after: text.slice(at + needle.length, end) + (end < text.length ? "…" : ""),
  };
}

// Markdown-brus bort innan utdrag visas.
function plain(markdown) {
  return (markdown || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\[\[diagram:[^\]]*\]\]/g, " ")
    .replace(/[#>*_`|-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function searchKnowledge({ query, chapters, topics, glossary }) {
  const needle = query.trim();
  if (needle.length < 2) return null;
  const q = normalize(needle);

  const chapterHits = [];
  chapters.forEach((chapter, index) => {
    const inTitle =
      normalize(chapter.title).includes(q) || normalize(chapter.lead).includes(q);
    const bodyText = plain(chapter.body);
    const excerpt = excerptAround(bodyText, needle);
    if (!inTitle && !excerpt) return;
    chapterHits.push({
      kind: "chapter",
      id: chapter.id,
      number: chapters[index].number ?? index + 1,
      title: chapter.title,
      where: excerpt ? "träff i löptext" : "träff i rubrik",
      excerpt,
    });
  });

  const topicHits = topics
    .filter((topic) =>
      [topic.name, topic.summary, ...topic.keyPoints, ...topic.pitfalls]
        .join(" ")
        .toLowerCase()
        .includes(q),
    )
    .map((topic) => ({
      kind: "topic",
      id: topic.id,
      title: topic.name,
      excerpt:
        excerptAround(topic.summary, needle) ||
        excerptAround([...topic.keyPoints, ...topic.pitfalls].join(" "), needle),
    }));

  const glossaryHits = glossary
    .filter(
      (entry) =>
        normalize(entry.term).includes(q) || normalize(entry.definition).includes(q),
    )
    .map((entry) => ({
      kind: "term",
      id: entry.term,
      title: entry.term,
      chapter: entry.chapter,
      excerpt: excerptAround(entry.definition, needle),
    }));

  return {
    query: needle,
    chapters: chapterHits,
    topics: topicHits,
    glossary: glossaryHits,
    total: chapterHits.length + topicHits.length + glossaryHits.length,
  };
}
