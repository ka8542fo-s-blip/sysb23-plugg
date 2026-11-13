import { useEffect, useState } from "react";
import { KEYS, load, save } from "../lib/storage.js";

// Ordgränsen gäller tentor som har en (Strategi och BPM: 300 ord). En
// delkurs utan ordtak sätter `essayWordLimit: null` i manifestet
// (Verksamhetsarkitektur: tentan anger inget).
const DEFAULT_WORD_LIMIT = 300;
// Samma slutrad i alla fyrstegsessäer — den hör till checklistans form,
// inte till någon enskild fråga, så den bor i vyn.
const CLOSING = "Max 300 ord. Fyra stycken, ett per rubrik. Punkt 4 är den som höjer betyget.";
const DEFAULT_INTRO = [
  "Varje essä: säg vad det är, varför det spelar roll, ge ett exempel, och koppla till en annan del av kursen.",
  "Tentans essäsvar får vara max 300 ord. Välj tre till fyra bärande punkter och skriv tätt — hoppa inledning och sammanfattning.",
];

function loadOpen(courseId) {
  return load(KEYS.essayOpen, {})[courseId];
}

export default function Essays({ course, params, essayState, setEssayState }) {
  const essays = course.essays || [];
  // params.essayId: från Tentafrågor och Tenta, som länkar till tentans egen essä.
  const [activeId, setActiveId] = useState(() => {
    if (essays.some((item) => item.id === params?.essayId)) return params.essayId;
    const saved = loadOpen(course.id);
    return essays.some((item) => item.id === saved) ? saved : essays[0]?.id;
  });
  const [showChecklist, setShowChecklist] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const essay = essays.find((item) => item.id === activeId) || essays[0];

  // Vald essä sparas per delkurs, så att man kommer tillbaka till samma fråga.
  useEffect(() => {
    if (!essay) return;
    save(KEYS.essayOpen, { ...load(KEYS.essayOpen, {}), [course.id]: essay.id });
  }, [course.id, essay]);

  if (!essay) {
    return (
      <div className="card p-5 sm:p-6">
        <h1 className="font-display text-2xl">Essä</h1>
        <p className="mt-2 text-[15px] text-ink/70">Essäfrågorna är inte inlagda ännu.</p>
      </div>
    );
  }

  const state = essayState[essay.id] || { draft: "", checked: [] };
  const wordLimit = course.essayWordLimit === undefined ? DEFAULT_WORD_LIMIT : course.essayWordLimit;
  const intro = course.essayIntro ?? DEFAULT_INTRO;

  function select(id) {
    setActiveId(id);
    setShowChecklist(false);
    setConfirmReset(false);
  }

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

  // "Nollställ" tar bort både utkastet och bockarna för just den här essän.
  function reset() {
    setEssayState((prev) => {
      const next = { ...prev };
      delete next[essay.id];
      return next;
    });
    setConfirmReset(false);
  }

  // Checklistan är grupper; kryssrutorna indexeras löpande över dem.
  const groups = essay.checklist;
  const pointCount = groups.reduce((sum, group) => sum + group.points.length, 0);
  const checkedCount = (state.checked || []).slice(0, pointCount).filter(Boolean).length;
  // Insperas essäfält tar max 300 ord i Strategi och BPM — räknaren visar
  // det och slår om till rött över gränsen.
  const wordCount = (state.draft || "").trim().split(/\s+/).filter(Boolean).length;
  const overLimit = wordLimit !== null && wordCount > wordLimit;
  const hasContent = Boolean((state.draft || "").trim()) || (state.checked || []).some(Boolean) || Boolean(state.done);
  const grouped = essays.some((item) => item.chapter);
  const index = essays.indexOf(essay);

  return (
    <div className="space-y-6">
      <section>
        <h1 className="font-display text-2xl">Essä</h1>
        <p className="mt-1 max-w-reading text-[15px] text-ink/70">
          Skriv först ditt eget svar — utkastet sparas automatiskt. Fäll sedan ut
          checklistan och kryssa i vad du faktiskt fick med. Ingen rättning sker
          här; poängen är den aktiva återkallningen.
        </p>
        {intro.map((paragraph) => (
          <p key={paragraph} className="mt-2 max-w-reading text-[15px] text-ink/80">
            {paragraph}
          </p>
        ))}
      </section>

      {grouped ? (
        <EssayIndex course={course} essays={essays} activeId={essay.id} essayState={essayState} onSelect={select} />
      ) : (
        <nav aria-label="Essäfrågor" className="flex flex-wrap gap-2">
          {essays.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => select(item.id)}
              aria-current={item.id === essay.id ? "true" : undefined}
              className={`chip ${item.id === essay.id ? "chip-on" : "hover:border-pine"}`}
            >
              Essä {i + 1}
            </button>
          ))}
        </nav>
      )}

      <article className="card p-5 sm:p-7">
        <div className={showChecklist ? "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(22rem,26rem)] lg:gap-10" : ""}>
        <div className="min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className="text-sm text-ink/65">
            {essay.levelNote && (
              <span className="mb-1 block w-fit rounded-full border border-brass px-2 py-0.5 text-[12px] font-medium text-brass-text">
                {essay.levelNote}
              </span>
            )}
            {essay.group && (
              <span className="mr-2 inline-block rounded-full border border-line px-2 py-0.5 text-[12px] font-medium text-ink/80">
                {essay.group}
              </span>
            )}
            {essay.priority === "hogst" && (
              <span className="mr-2 inline-block rounded-full border border-brass px-2 py-0.5 text-[12px] font-medium text-brass-text">
                Högst prioriterad
              </span>
            )}
            {essay.context}
          </p>
          {hasContent && !confirmReset && (
            <button type="button" className="btn-quiet text-sm" onClick={() => setConfirmReset(true)}>
              Nollställ essän
            </button>
          )}
          {confirmReset && (
            <span className="flex gap-2 text-sm">
              <button type="button" className="btn-secondary" onClick={reset}>Ja, nollställ</button>
              <button type="button" className="btn-quiet" onClick={() => setConfirmReset(false)}>Avbryt</button>
            </span>
          )}
        </div>
        <h2 className="mt-2 whitespace-pre-line font-sans text-[18px] font-medium leading-normal tracking-[-0.005em] text-ink [font-variation-settings:normal] sm:text-[20px]">
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
          className="mt-2 w-full rounded-lg border border-line bg-surface p-4 text-[15px] leading-relaxed"
        />
        <p className={`tabular mt-1 text-sm ${overLimit ? "font-medium text-wrong" : "text-ink/65"}`} aria-live="polite">
          Ord: {wordCount}
          {wordLimit !== null && `/${wordLimit}`}
          {overLimit ? " — över tentans gräns" : ""}
          <span className="text-ink/65"> · sparas automatiskt</span>
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="btn-primary"
            onClick={() => setShowChecklist(!showChecklist)}
            aria-expanded={showChecklist}
          >
            {showChecklist ? "Dölj checklista" : "Visa checklista"}
          </button>
          {grouped && (
            // Genomgången: Kaspers egen markering, som räknas i modulstatusen
            // (fliken Tentan). Sparas i essäns läge; Nollställ essän tar bort den.
            <button
              type="button"
              className={state.done ? "btn-secondary border-correct text-correct" : "btn-secondary"}
              onClick={() => update({ done: !state.done })}
              aria-pressed={Boolean(state.done)}
            >
              {state.done ? "✓ Genomgången" : "Markera som genomgången"}
            </button>
          )}
          {grouped && index < essays.length - 1 && (
            <button type="button" className="btn-secondary" onClick={() => select(essays[index + 1].id)}>
              Nästa fråga →
            </button>
          )}
        </div>

        </div>

        {showChecklist && (
          // Bred skärm: checklistan är exakt lika hög som svarskolumnen och
          // scrollar för sig, så att man inte behöver scrolla bort svaret.
          <div className="mt-6 border-t border-line pt-5 lg:relative lg:mt-0 lg:border-l lg:border-t-0 lg:pt-0">
          <div className="lg:absolute lg:inset-0 lg:overflow-y-auto lg:overscroll-contain lg:pl-8 lg:pr-3">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-display text-lg">Vad ett toppsvar innehåller</h3>
              <span className="tabular text-sm text-ink/65">
                {checkedCount}/{pointCount}
              </span>
            </div>
            {groups.map((group, gi) => {
              const offset = groups
                .slice(0, gi)
                .reduce((sum, item) => sum + item.points.length, 0);
              return (
                <div key={group.heading} className={gi === 0 ? "mt-4" : "mt-5"}>
                  <h4 className="text-[11px] font-medium uppercase tracking-[0.14em] text-brass">
                    {gi + 1}. {group.heading}
                  </h4>
                  <ul className="mt-2 space-y-2">
                    {group.points.map((point, pi) => {
                      const i = offset + pi;
                      return (
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
                      );
                    })}
                  </ul>
                </div>
              );
            })}
            {wordLimit !== null && (
              <p className="mt-5 border-t border-line pt-4 text-[15px] leading-relaxed text-brass">
                {CLOSING}
              </p>
            )}

            {essay.outline && (
              <>
                <h3 className="mt-6 font-display text-lg">Disposition</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink/80">
                  {essay.outline}
                </p>
              </>
            )}

            {essay.modelAnswer && (
              <details className="mt-6 border-t border-line pt-4">
                <summary className="cursor-pointer font-display text-lg hover:text-pine">
                  {essay.modelAnswerLabel || "UF:s modellsvar"}
                </summary>
                <p lang="en" className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-ink/80">
                  {essay.modelAnswer}
                </p>
              </details>
            )}
          </div>
          </div>
        )}
        </div>
      </article>
    </div>
  );
}

// Förteckningen när essäerna hör till kapitel (Verksamhetsarkitektur: 54
// frågor). Frågor med `pinned` står först, under en egen rubrik.
function EssayIndex({ course, essays, activeId, essayState, onSelect }) {
  const chapters = course.chapters || [];
  const pinned = essays.filter((item) => item.pinned);
  // Kapitlen i kursens ordning (arkitektur: 12, 1–11). Frågor med `group`
  // (modul 12:s fördjupade fallfrågor) står sist i kapitlet under egen rubrik.
  const sections = chapters.flatMap((chapter) => {
    const inChapter = essays.filter((item) => !item.pinned && item.chapter === chapter.id);
    const plain = inChapter.filter((item) => !item.group);
    const groupNames = [...new Set(inChapter.filter((item) => item.group).map((item) => item.group))];
    return [
      { title: `Kapitel ${chapter.number} · ${chapter.title}`, items: plain },
      ...groupNames.map((name) => ({
        title: `Kapitel ${chapter.number} · ${name}`,
        items: inChapter.filter((item) => item.group === name),
      })),
    ].filter((section) => section.items.length > 0);
  });
  if (pinned.length) sections.unshift({ title: "Från tentan", items: pinned });
  const started = (id) => {
    const s = essayState[id];
    return Boolean(s && ((s.draft || "").trim() || (s.checked || []).some(Boolean)));
  };
  return (
    <nav aria-label="Essäfrågor" className="card max-h-[22rem] overflow-y-auto p-4 sm:p-5">
      {sections.map((section) => (
        <div key={section.title} className="mt-3 first:mt-0">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-brass">{section.title}</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {section.items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item.id)}
                aria-current={item.id === activeId ? "true" : undefined}
                title={item.question}
                className={`chip ${item.id === activeId ? "chip-on" : "hover:border-pine"}`}
              >
                {essayState[item.id]?.done ? (
                  <span aria-label="genomgången">✓ </span>
                ) : (
                  started(item.id) && <span aria-hidden="true">✎ </span>
                )}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
