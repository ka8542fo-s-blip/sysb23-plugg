import { useState } from "react";

const WORD_LIMIT = 300;

export default function Essays({ course, essayState, setEssayState }) {
  const [activeId, setActiveId] = useState(course.essays[0]?.id);
  const essay = course.essays.find((item) => item.id === activeId) || course.essays[0];
  const state = essayState[essay.id] || { draft: "", checked: [] };
  const [showChecklist, setShowChecklist] = useState(false);

  function update(patch) {
    setEssayState((prev) => ({
      ...prev,
      [essay.id]: {
        draft: "",
        checked: [],
        ...prev[essay.id],
        ...patch,
        updatedAt: new Date().toISOString(),
      },
    }));
  }

  function toggleCheck(index) {
    const checked = [...(state.checked || [])];
    checked[index] = !checked[index];
    update({ checked });
  }

  const checkedCount = (state.checked || []).filter(Boolean).length;
  // Insperas essäfält tar max 300 ord — räknaren visar det och slår om till
  // rött över gränsen.
  const wordCount = (state.draft || "").trim().split(/\s+/).filter(Boolean).length;
  const overLimit = wordCount > WORD_LIMIT;

  return (
    <div className="space-y-6">
      <section>
        <h1 className="font-display text-2xl">Essä</h1>
        <p className="mt-1 max-w-reading text-[15px] text-ink/70">
          Skriv först ditt eget svar — utkastet sparas automatiskt. Fäll sedan ut
          checklistan och kryssa i vad du faktiskt fick med. Ingen rättning sker
          här; poängen är den aktiva återkallningen.
        </p>
        <p className="mt-2 max-w-reading text-[15px] text-ink/80">
          Tentans essäsvar får vara max 300 ord. Välj tre till fyra bärande punkter
          och skriv tätt — hoppa inledning och sammanfattning.
        </p>
      </section>

      <nav aria-label="Essäfrågor" className="flex flex-wrap gap-2">
        {course.essays.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setActiveId(item.id);
              setShowChecklist(false);
            }}
            aria-current={item.id === essay.id ? "true" : undefined}
            className={`chip ${item.id === essay.id ? "chip-on" : "hover:border-pine"}`}
          >
            Essä {i + 1}
          </button>
        ))}
      </nav>

      <article className="card p-5 sm:p-7">
        <div className={showChecklist ? "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(22rem,26rem)] lg:gap-10" : ""}>
        <div className="min-w-0">
        <p className="text-sm text-ink/65">{essay.context}</p>
        <h2 className="mt-2 font-display text-[22px] leading-snug text-ink">
          {essay.question}
        </h2>

        <label htmlFor="svar" className="mt-6 block font-display text-lg">
          Ditt svar
        </label>
        <textarea
          id="svar"
          value={state.draft || ""}
          onChange={(event) => update({ draft: event.target.value })}
          rows={12}
          placeholder="Skriv utan att titta på checklistan först."
          className="mt-2 w-full rounded-lg border border-line bg-white p-4 text-[15px] leading-relaxed"
        />
        <p className={`tabular mt-1 text-sm ${overLimit ? "font-medium text-wrong" : "text-ink/65"}`} aria-live="polite">
          Ord: {wordCount}/{WORD_LIMIT}
          {overLimit ? " — över tentans gräns" : ""}
          <span className="text-ink/65"> · sparas automatiskt</span>
        </p>

        <button
          type="button"
          className="btn-primary mt-5"
          onClick={() => setShowChecklist(!showChecklist)}
          aria-expanded={showChecklist}
        >
          {showChecklist ? "Dölj checklista" : "Visa checklista"}
        </button>

        </div>

        {showChecklist && (
          <div className="mt-6 border-t border-line pt-5 lg:mt-0 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-display text-lg">Vad ett toppsvar innehåller</h3>
              <span className="tabular text-sm text-ink/65">
                {checkedCount}/{essay.checklist.length}
              </span>
            </div>
            <ul className="mt-3 space-y-2">
              {essay.checklist.map((point, i) => (
                <li key={i}>
                  <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-line p-3 text-[15px] leading-relaxed hover:border-pine">
                    <input
                      type="checkbox"
                      checked={Boolean((state.checked || [])[i])}
                      onChange={() => toggleCheck(i)}
                      className="mt-1 h-4 w-4 shrink-0 accent-pine"
                    />
                    <span>{point}</span>
                  </label>
                </li>
              ))}
            </ul>

            <h3 className="mt-6 font-display text-lg">Disposition</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink/80">
              {essay.outline}
            </p>
          </div>
        )}
        </div>
      </article>
    </div>
  );
}
