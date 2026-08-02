function Excerpt({ excerpt }) {
  if (!excerpt) return null;
  return (
    <p className="mt-1 text-sm leading-relaxed text-ink/70">
      {excerpt.before}
      <mark className="bg-transparent font-medium text-brass">{excerpt.match}</mark>
      {excerpt.after}
    </p>
  );
}

function Group({ title, count, children }) {
  if (count === 0) return null;
  return (
    <section>
      <h3 className="font-display text-lg">
        {title}{" "}
        <span className="tabular font-sans text-[15px] font-normal text-ink/70">
          ({count})
        </span>
      </h3>
      <ul className="mt-2 space-y-2">{children}</ul>
    </section>
  );
}

// Träffar från alla tre segmenten, grupperade.
export default function SearchResults({ results, onOpenChapter, onOpenTopic, onOpenTerm }) {
  if (results.total === 0) {
    return (
      <p className="card p-5 text-[15px] text-ink/70">
        Inga träffar på ”{results.query}”. Prova ett annat ord.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <p className="tabular text-sm text-ink/65">
        {results.total} träffar på ”{results.query}”
      </p>

      <Group title="Kapitel" count={results.chapters.length}>
        {results.chapters.map((hit) => (
          <li key={hit.id}>
            <button
              type="button"
              onClick={() => onOpenChapter(hit.id)}
              className="card-action p-4"
            >
              <span className="flex flex-wrap items-baseline gap-2">
                <span className="tabular font-display text-brass">{hit.number}</span>
                <span className="font-medium text-pine">{hit.title}</span>
                <span className="text-sm text-ink/65">{hit.where}</span>
              </span>
              <Excerpt excerpt={hit.excerpt} />
            </button>
          </li>
        ))}
      </Group>

      <Group title="Begrepp" count={results.topics.length}>
        {results.topics.map((hit) => (
          <li key={hit.id}>
            <button
              type="button"
              onClick={() => onOpenTopic(hit.id)}
              className="card-action p-4"
            >
              <span className="font-medium text-pine">{hit.title}</span>
              <Excerpt excerpt={hit.excerpt} />
            </button>
          </li>
        ))}
      </Group>

      <Group title="Ordlista" count={results.glossary.length}>
        {results.glossary.map((hit) => (
          <li key={hit.id}>
            <button
              type="button"
              onClick={() => onOpenTerm(hit.id)}
              className="card-action p-4"
            >
              <span className="font-medium text-pine">{hit.title}</span>
              <Excerpt excerpt={hit.excerpt} />
            </button>
          </li>
        ))}
      </Group>
    </div>
  );
}
