import { useMemo, useState } from "react";

// Ordlistan: termer A–Ö, sökbara, med kapitelmarkering som länk.
export default function Glossary({ glossary, chapters, onOpenChapter, highlightTerm }) {
  const [query, setQuery] = useState("");

  const sorted = useMemo(
    () => [...glossary].sort((a, b) => a.term.localeCompare(b.term, "sv")),
    [glossary],
  );

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return sorted;
    return sorted.filter(
      (entry) =>
        entry.term.toLowerCase().includes(needle) ||
        entry.definition.toLowerCase().includes(needle),
    );
  }, [sorted, query]);

  const chapterNumber = (chapterId) => {
    const index = chapters.findIndex((chapter) => chapter.id === chapterId);
    return index === -1 ? null : index + 1;
  };

  if (glossary.length === 0) {
    return (
      <p className="card p-5 text-[15px] leading-relaxed text-ink/80">
        Ordlistan är inte inlagd ännu. Termerna ligger i{" "}
        <code className="rounded bg-paper px-1.5 py-0.5 text-[14px]">
          claude-code-prompt-sysb23-lasdel.md
        </code>{" "}
        och klistras in i{" "}
        <code className="rounded bg-paper px-1.5 py-0.5 text-[14px]">
          src/data/strategi/reading.js
        </code>
        .
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
        <p className="tabular mt-2 text-sm text-ink/65">
          {matches.length} av {glossary.length} termer
        </p>
      </div>

      {matches.length === 0 && (
        <p className="card p-5 text-[15px] text-ink/70">
          Ingen term matchar sökningen.
        </p>
      )}

      <div className="grid gap-3 lg:grid-cols-2 lg:items-start">
        {[matches.slice(0, Math.ceil(matches.length / 2)), matches.slice(Math.ceil(matches.length / 2))]
          .filter((half) => half.length > 0)
          .map((half, halfIndex) => (
      <dl key={halfIndex} className="card divide-y divide-line">
        {half.map((entry) => {
          const number = chapterNumber(entry.chapter);
          const highlighted =
            highlightTerm && entry.term.toLowerCase() === highlightTerm.toLowerCase();
          return (
            <div
              key={entry.term}
              className={`scroll-mt-40 p-4 ${highlighted ? "bg-pine/[0.06]" : ""}`}
            >
              <dt className="flex flex-wrap items-baseline gap-2">
                <span className="font-medium text-pine">{entry.term}</span>
                {number && (
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
        })}
      </dl>
          ))}
      </div>
    </div>
  );
}
