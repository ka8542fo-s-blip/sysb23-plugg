import { useEffect, useMemo, useRef, useState } from "react";

const WEIGHT_LABEL = { hög: "Hög tentavikt", medel: "Medel tentavikt", låg: "Låg tentavikt" };

// Begrepp-segmentet: samma kortlista som förut, nu med korsreferenser till
// kompendiet och till Öva.
export default function ConceptCards({
  course,
  chapters,
  openTopicId,
  onOpenChapter,
  onPractice,
  canPractice = true,
}) {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState(openTopicId || course.topics[0]?.id || null);
  const cardRefs = useRef({});

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return course.topics;
    return course.topics.filter((topic) =>
      [topic.name, topic.summary, ...topic.keyPoints, ...topic.pitfalls]
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }, [course, query]);

  // Enda träffen på en sökning fälls ut direkt.
  useEffect(() => {
    if (query.trim() && matches.length === 1) setOpenId(matches[0].id);
  }, [query, matches]);

  // Hopp hit från ett kapitel: öppna rätt kort och scrolla fram det.
  useEffect(() => {
    if (!openTopicId) return;
    setQuery("");
    setOpenId(openTopicId);
    const node = cardRefs.current[openTopicId];
    if (node) node.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [openTopicId]);

  const chapterNumber = (chapterId) => {
    const index = chapters.findIndex((chapter) => chapter.id === chapterId);
    return index === -1 ? null : chapters[index].number ?? index + 1;
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="begreppssok" className="sr-only">
          Filtrera ämneskorten
        </label>
        <input
          id="begreppssok"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filtrera korten, t.ex. effektivitet, Barney, styrkort…"
          className="w-full rounded-lg border border-line bg-white px-4 py-2.5 text-[15px]"
        />
        <p className="tabular mt-2 text-sm text-ink/65">
          {matches.length} av {course.topics.length} ämnen
        </p>
      </div>

      {matches.length === 0 && (
        <p className="card p-5 text-[15px] text-ink/70">
          Inget ämne matchar sökningen. Prova ett annat ord.
        </p>
      )}

      <div className="grid gap-3 lg:grid-cols-2 lg:items-start">
        {[matches.slice(0, Math.ceil(matches.length / 2)), matches.slice(Math.ceil(matches.length / 2))]
          .filter((half) => half.length > 0)
          .map((half, halfIndex) => (
        <div key={halfIndex} className="space-y-3">
        {half.map((topic) => {
          const open = openId === topic.id;
          const number = chapterNumber(topic.chapter);
          return (
            <article
              key={topic.id}
              ref={(node) => {
                cardRefs.current[topic.id] = node;
              }}
              className="card scroll-mt-40 overflow-hidden"
            >
              <h3>
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : topic.id)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-3 p-5 text-left transition-colors duration-150 hover:bg-pine/[0.04] active:bg-pine/[0.08]"
                >
                  <span>
                    <span className="block font-display text-lg text-pine">
                      {topic.name}
                    </span>
                    <span className="block font-sans text-sm text-ink/70">
                      {WEIGHT_LABEL[topic.examWeight] || topic.examWeight} ·{" "}
                      {topic.keyPoints.length} nyckelpunkter
                    </span>
                  </span>
                  <span aria-hidden="true" className="shrink-0 text-ink/65">
                    {open ? "−" : "+"}
                  </span>
                </button>
              </h3>

              {open && (
                <div className="border-t border-line p-5 pt-4">
                  <p className="max-w-reading text-[15px] leading-relaxed">
                    {topic.summary}
                  </p>

                  <h4 className="mt-5 font-display text-base">Nyckelpunkter</h4>
                  <ul className="mt-2 space-y-2">
                    {topic.keyPoints.map((point, i) => (
                      <li key={i} className="flex gap-3 text-[15px] leading-relaxed">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-pine"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  <h4 className="mt-5 font-display text-base text-brass">Tentafällor</h4>
                  <ul className="mt-2 space-y-2">
                    {topic.pitfalls.map((pitfall, i) => (
                      <li
                        key={i}
                        className="rounded-lg border-l-2 border-brass bg-paper p-3 text-[15px] leading-relaxed"
                      >
                        {pitfall}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-4">
                    {canPractice && (
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => onPractice([topic.id])}
                      >
                        Öva på detta ämne
                      </button>
                    )}
                    {number ? (
                      <button
                        type="button"
                        className="btn-quiet"
                        onClick={() => onOpenChapter(topic.chapter)}
                      >
                        Läs hela avsnittet i kapitel {number} →
                      </button>
                    ) : (
                      <span className="text-sm text-ink/65">
                        Kapiteltexten är inte inlagd ännu.
                      </span>
                    )}
                  </div>
                </div>
              )}
            </article>
          );
        })}
        </div>
          ))}
      </div>
    </div>
  );
}
