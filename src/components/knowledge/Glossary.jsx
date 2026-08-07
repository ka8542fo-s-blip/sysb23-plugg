import { useMemo, useState } from "react";

function TermRow({ entry, number, onOpenChapter, highlighted, showChapterLink }) {
  return (
    <div className={`scroll-mt-40 p-4 ${highlighted ? "bg-pine/[0.06]" : ""}`}>
      <dt className="flex flex-wrap items-baseline gap-2">
        <span className="font-medium text-pine">{entry.term}</span>
        {showChapterLink && number && (
          <button
            type="button"
            className="text-xs text-ink/65 underline underline-offset-2 hover:text-pine"
            onClick={() => onOpenChapter(entry.chapter)}
          >
            kapitel {number}
          </button>
        )}
      </dt>
      <dd className="mt-1 text-[15px] leading-relaxed">{entry.definition}</dd>
    </div>
  );
}

// Ordlistan: sökbar, sorterad per kapitel (läsordningen) eller A–Ö.
export default function Glossary({ glossary, chapters, onOpenChapter, highlightTerm }) {
  const [query, setQuery] = useState("");
  // Kapitelordningen är standard — den följer hur man läser kompendiet.
  const [order, setOrder] = useState("kapitel");

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const base = [...glossary].sort((a, b) => a.term.localeCompare(b.term, "sv"));
    if (!needle) return base;
    return base.filter(
      (entry) =>
        entry.term.toLowerCase().includes(needle) ||
        entry.definition.toLowerCase().includes(needle),
    );
  }, [glossary, query]);

  const chapterNumber = (chapterId) => {
    const index = chapters.findIndex((chapter) => chapter.id === chapterId);
    return index === -1 ? null : index + 1;
  };

  const isHighlighted = (entry) =>
    Boolean(highlightTerm && entry.term.toLowerCase() === highlightTerm.toLowerCase());

  // Grupperna följer kapitlens ordning; termerna A–Ö inom varje grupp.
  const groups = useMemo(() => {
    if (order !== "kapitel") return null;
    return chapters
      .map((chapter, index) => ({
        chapter,
        number: index + 1,
        terms: matches.filter((entry) => entry.chapter === chapter.id),
      }))
      .filter((group) => group.terms.length > 0);
  }, [order, chapters, matches]);

  if (glossary.length === 0) {
    return (
      <p className="card p-5 text-[15px] leading-relaxed text-ink/80">
        Ordlistan är inte inlagd ännu för den här delkursen.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="ordlistesok" className="sr-only">
          Sök i ordlistan
        </label>
        <input
          id="ordlistesok"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Slå upp en term…"
          className="w-full rounded-lg border border-line bg-white px-4 py-2.5 text-[15px]"
        />
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex gap-2" role="group" aria-label="Sortering">
            <button
              type="button"
              onClick={() => setOrder("kapitel")}
              aria-pressed={order === "kapitel"}
              className={`chip ${order === "kapitel" ? "chip-on" : ""}`}
            >
              Per kapitel
            </button>
            <button
              type="button"
              onClick={() => setOrder("alfabetisk")}
              aria-pressed={order === "alfabetisk"}
              className={`chip ${order === "alfabetisk" ? "chip-on" : ""}`}
            >
              A–Ö
            </button>
          </div>
          <p className="tabular text-sm text-ink/65">
            {matches.length} av {glossary.length} termer
          </p>
        </div>
      </div>

      {matches.length === 0 && (
        <p className="card p-5 text-[15px] text-ink/70">
          Ingen term matchar sökningen.
        </p>
      )}

      {order === "kapitel" ? (
        <div className="grid gap-3 lg:grid-cols-2 lg:items-start">
          {groups.map((group) => (
            <section key={group.chapter.id} className="card overflow-hidden">
              <header className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-b border-line bg-paper px-4 py-2.5">
                <h3 className="font-display text-[15px]">
                  <span className="tabular text-brass">Kapitel {group.number}</span>
                  <span className="ml-2 font-sans text-sm font-normal text-ink/80">
                    {group.chapter.title}
                  </span>
                </h3>
                <button
                  type="button"
                  className="text-xs text-ink/65 underline underline-offset-2 hover:text-pine"
                  onClick={() => onOpenChapter(group.chapter.id)}
                >
                  Öppna kapitlet →
                </button>
              </header>
              <dl className="divide-y divide-line">
                {group.terms.map((entry) => (
                  <TermRow
                    key={entry.term}
                    entry={entry}
                    number={group.number}
                    onOpenChapter={onOpenChapter}
                    highlighted={isHighlighted(entry)}
                    showChapterLink={false}
                  />
                ))}
              </dl>
            </section>
          ))}
        </div>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2 lg:items-start">
          {[
            matches.slice(0, Math.ceil(matches.length / 2)),
            matches.slice(Math.ceil(matches.length / 2)),
          ]
            .filter((half) => half.length > 0)
            .map((half, halfIndex) => (
              <dl key={halfIndex} className="card divide-y divide-line">
                {half.map((entry) => (
                  <TermRow
                    key={entry.term}
                    entry={entry}
                    number={chapterNumber(entry.chapter)}
                    onOpenChapter={onOpenChapter}
                    highlighted={isHighlighted(entry)}
                    showChapterLink
                  />
                ))}
              </dl>
            ))}
        </div>
      )}
    </div>
  );
}
