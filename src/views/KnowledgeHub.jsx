import { useEffect, useMemo, useState } from "react";
import SegmentedControl from "../components/SegmentedControl.jsx";
import ChapterList from "../components/knowledge/ChapterList.jsx";
import ChapterView from "../components/knowledge/ChapterView.jsx";
import ConceptCards from "../components/knowledge/ConceptCards.jsx";
import Glossary from "../components/knowledge/Glossary.jsx";
import SearchResults from "../components/knowledge/SearchResults.jsx";
import { searchKnowledge } from "../lib/knowledgeSearch.js";
import { chapterPracticeGroups, groupsForTopics, practicedGroupIds } from "../lib/practiceAxis.js";
import { KEYS, load, save } from "../lib/storage.js";

const SEGMENTS = [
  { id: "kompendium", label: "Kompendium" },
  { id: "begrepp", label: "Begrepp" },
  { id: "ordlista", label: "Ordlista" },
];

// Kunskapsnavet: läsning, begrepp och ordlista på ett ställe, med en
// gemensam sökning ovanför segmenten.
export default function KnowledgeHub({ course, params, navigate, readChapters, onToggleRead }) {
  const chapters = course.chapters || [];
  const glossary = course.glossary || [];
  // "Öva på detta"-knapparna visas bara där det finns frågor. Öva grupperar
  // per ämne eller per kapitel (practiceAxis); knappen förväljer gruppen.
  const practicableGroups = useMemo(() => practicedGroupIds(course), [course]);
  const practicableTopics = useMemo(
    () =>
      new Set(
        (course.topics || [])
          .filter((topic) =>
            groupsForTopics(course, [topic.id]).some((id) => practicableGroups.has(id)),
          )
          .map((topic) => topic.id),
      ),
    [course, practicableGroups],
  );

  const [segment, setSegment] = useState(() => {
    const saved = load(KEYS.readSegment, "kompendium");
    return SEGMENTS.some((item) => item.id === saved) ? saved : "kompendium";
  });
  const [chapterId, setChapterId] = useState(null);
  const [openTopicId, setOpenTopicId] = useState(null);
  const [highlightTerm, setHighlightTerm] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => save(KEYS.readSegment, segment), [segment]);

  // Navigering hit utifrån (t.ex. "Fortsätt läsa" på Hem eller en
  // korsreferens) styr segment och position.
  useEffect(() => {
    if (!params) return;
    if (params.segment) setSegment(params.segment);
    // Explicit null betyder innehållsförteckningen, inte "lämna som det är".
    if (params.chapterId !== undefined) setChapterId(params.chapterId);
    if (params.topicId) setOpenTopicId(params.topicId);
    if (params.term) setHighlightTerm(params.term);
  }, [params]);

  const results = useMemo(
    () => searchKnowledge({ query, chapters, topics: course.topics, glossary }),
    [query, chapters, course.topics, glossary],
  );

  function openChapter(id) {
    setSegment("kompendium");
    setChapterId(id);
    setQuery("");
    window.scrollTo({ top: 0 });
  }

  function openTopic(topicId) {
    setSegment("begrepp");
    setOpenTopicId(topicId);
    setQuery("");
    window.scrollTo({ top: 0 });
  }

  function openTerm(term) {
    setSegment("ordlista");
    setHighlightTerm(term);
    setQuery("");
    window.scrollTo({ top: 0 });
  }

  function practice(topicIds) {
    navigate("ova", { topics: topicIds, nonce: Date.now() });
  }

  const index = chapters.findIndex((chapter) => chapter.id === chapterId);
  const current = index === -1 ? null : chapters[index];

  function step(delta) {
    const next = chapters[index + delta];
    if (next) openChapter(next.id);
  }

  const segmentsWithCounts = [
    { ...SEGMENTS[0], count: chapters.length || undefined },
    { ...SEGMENTS[1], count: course.topics.length },
    { ...SEGMENTS[2], count: glossary.length || undefined },
  ];

  return (
    <div className="space-y-6">
      {/* Under läsning är kapitlet sidans rubrik — inledningen skulle bara
          konkurrera med den. */}
      {!(segment === "kompendium" && current) && (
        <section>
          <h1 className="font-display text-2xl">Läs</h1>
          <p className="mt-1 max-w-reading text-[15px] text-ink/70">
            Kompendiet bygger förståelsen, begreppskorten repeterar den och
            ordlistan slår upp ett ord mitt i en övning. Sökningen nedan letar i
            alla tre samtidigt.
          </p>
        </section>
      )}

      <div className="max-w-3xl">
        <label htmlFor="navsok" className="sr-only">
          Sök i kompendium, begrepp och ordlista
        </label>
        <input
          id="navsok"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Sök i allt — t.ex. satisfiering, alignment, Brundtland…"
          className="w-full rounded-lg border border-line bg-white px-4 py-3 text-[15px]"
        />
      </div>

      {results ? (
        <SearchResults
          results={results}
          onOpenChapter={openChapter}
          onOpenTopic={openTopic}
          onOpenTerm={openTerm}
        />
      ) : (
        <>
          <div className="max-w-3xl">
            <SegmentedControl
              label="Välj läge"
              segments={segmentsWithCounts}
              value={segment}
              onChange={(next) => {
                setSegment(next);
                window.scrollTo({ top: 0 });
              }}
            />
          </div>

          {segment === "kompendium" &&
            (current ? (
              <ChapterView
                chapter={current}
                number={chapters[index].number ?? index + 1}
                total={chapters.length}
                course={course}
                isRead={Boolean(readChapters[current.id])}
                onToggleRead={onToggleRead}
                onOpenTopic={openTopic}
                onPractice={() => practice(chapterPracticeGroups(course, current))}
                canPractice={chapterPracticeGroups(course, current).some((id) =>
                  practicableGroups.has(id),
                )}
                onBack={() => setChapterId(null)}
                onPrev={() => step(-1)}
                onNext={() => step(1)}
              />
            ) : (
              <ChapterList
                chapters={chapters}
                readChapters={readChapters}
                currentId={chapterId}
                onOpen={openChapter}
                intro={course.readingIntro || ""}
                examNote={course.examNote}
                topics={course.topics}
              />
            ))}

          {segment === "begrepp" && (
            <ConceptCards
              course={course}
              chapters={chapters}
              openTopicId={openTopicId}
              onOpenChapter={openChapter}
              onPractice={(topicIds) => practice(groupsForTopics(course, topicIds))}
              practicableTopics={practicableTopics}
            />
          )}

          {segment === "ordlista" && (
            <Glossary
              glossary={glossary}
              chapters={chapters}
              onOpenChapter={openChapter}
              highlightTerm={highlightTerm}
            />
          )}
        </>
      )}
    </div>
  );
}
