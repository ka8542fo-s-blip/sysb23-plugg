import { useEffect, useMemo, useState } from "react";

const WEIGHT_LABEL = { hög: "Hög tentavikt", medel: "Medel tentavikt", låg: "Låg tentavikt" };

export default function Concepts({ course }) {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState(course.topics[0]?.id ?? null);

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

  return (
    <div className="space-y-6">
      <section>
        <h1 className="font-display text-2xl">Begrepp</h1>
        <p className="mt-1 max-w-reading text-[15px] text-ink/70">
          Facit-nivån: samma fakta som frågorna bygger på. Sök efter ett begrepp
          eller bläddra ämne för ämne.
        </p>
        <div className="mt-4">
          <label htmlFor="sok" className="sr-only">
            Sök bland begreppen
          </label>
          <input
            id="sok"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Sök, t.ex. effektivitet, Barney, styrkort…"
            className="w-full rounded-lg border border-line bg-white px-4 py-2.5 text-[15px]"
          />
        </div>
        <p className="tabular mt-2 text-sm text-ink/65">
          {matches.length} av {course.topics.length} ämnen
        </p>
      </section>

      {matches.length === 0 && (
        <p className="card p-5 text-[15px] text-ink/70">
          Inget ämne matchar sökningen. Prova ett annat ord.
        </p>
      )}

      <div className="space-y-3">
        {matches.map((topic) => {
          const open = openId === topic.id;
          return (
            <article key={topic.id} className="card overflow-hidden">
              <h2>
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
                    <span className="text-sm text-ink/65">
                      {WEIGHT_LABEL[topic.examWeight] || topic.examWeight} ·{" "}
                      {topic.keyPoints.length} nyckelpunkter
                    </span>
                  </span>
                  <span aria-hidden="true" className="shrink-0 text-ink/65">
                    {open ? "−" : "+"}
                  </span>
                </button>
              </h2>

              {open && (
                <div className="border-t border-line p-5 pt-4">
                  <p className="max-w-reading text-[15px] leading-relaxed">
                    {topic.summary}
                  </p>

                  <h3 className="mt-5 font-display text-base">Nyckelpunkter</h3>
                  <ul className="mt-2 space-y-2">
                    {topic.keyPoints.map((point, i) => (
                      <li key={i} className="flex gap-3 text-[15px] leading-relaxed">
                        <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-pine" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  <h3 className="mt-5 font-display text-base text-brass">
                    Tentafällor
                  </h3>
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
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
