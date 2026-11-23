import { useEffect, useMemo, useRef, useState } from "react";
import TextBlock, { EnglishContext, Markdown, Original } from "../components/moduler/Text.jsx";
import Question, { TableRows } from "../components/moduler/Question.jsx";
import FreeText from "../components/moduler/FreeText.jsx";
import { firstOpenId, groupSections, modulIds, modulScore, panelSummary } from "../lib/moduler.js";
import { KEYS, load, save } from "../lib/storage.js";
import { useDrafts } from "../lib/useDrafts.js";

// Fliken Moduler (Verksamhetsarkitektur, Kaspers beslut 2026-11-22): lärarens
// tre moduldokument uppifrån och ned på svenska. En sida per modul i
// dokumentens ordning 1–12: text, sedan frågorna som hör till, sedan nästa
// text, precis som i PDF:erna. Data i data/arkitektur/modulerView.js.
//
// Utseendet (Kaspers designbeslut 22 nov): modullistan i en sidospalt på
// datorn (rullande kort överst i mobilen), ett välkomnande kort i modulens
// början, lärarens text som lugna avsnitt och frågorna i tonade paneler,
// och ett avslutande kort med vägen vidare.
//
// Allt sparas: vald modul (modulVald), inledningen öppen eller stängd
// (modulInledning), engelskt original på eller av (modulEngelska), valda
// alternativ och skriven text (svar:<id>), svar och Kunde/Kunde inte
// (answers, samma som Öva). "Gör om modulen" tar bort status och val men
// aldrig texten.

const reducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function ProgressBar({ score, className = "h-1.5" }) {
  const share = score.total ? score.done / score.total : 0;
  const done = score.total > 0 && score.done === score.total;
  return (
    <span aria-hidden="true" className={`block overflow-hidden rounded-full bg-line ${className}`}>
      <span
        className={`block h-full rounded-full transition-[width] duration-300 ${done ? "bg-correct" : "bg-pine"}`}
        style={{ width: `${Math.round(share * 100)}%` }}
      />
    </span>
  );
}

function Check({ className = "h-3.5 w-3.5" }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 8.5l3 3 6-7" />
    </svg>
  );
}

function StartTag() {
  return (
    <span className="ml-1.5 inline-flex translate-y-[-1px] items-center rounded-full bg-brass/20 px-1.5 py-px align-middle text-[11px] font-semibold text-brass-text">
      Börja här
    </span>
  );
}

// Sidospalten på datorn: modulerna under lärarens tre föreläsningar.
function ModuleList({ modules, lectures, answers, currentId, onOpen }) {
  return (
    <nav aria-label="Välj modul" className="mt-7 hidden lg:block">
      {lectures.map((lecture) => (
        <div key={lecture.nummer} className="mt-6 first:mt-0">
          <p className="px-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-brass-text">Föreläsning {lecture.nummer}</p>
          <p className="px-3 text-[13px] leading-snug text-ink/60">{lecture.title.sv}</p>
          <ul className="mt-2 space-y-0.5">
            {modules
              .filter((module) => module.forelasning?.nummer === lecture.nummer)
              .map((module) => {
                const score = modulScore(module, answers);
                const done = score.done === score.total;
                const selected = module.id === currentId;
                return (
                  <li key={module.id}>
                    <button
                      type="button"
                      aria-current={selected ? "page" : undefined}
                      onClick={() => onOpen(module.id)}
                      className={`flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left transition-colors duration-150 ${
                        selected ? "bg-pine/[0.09]" : "hover:bg-pine/[0.05]"
                      }`}
                    >
                      <span
                        className={`tabular mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold ${
                          done ? "bg-correct text-paper" : selected ? "bg-pine text-paper" : "border border-line-strong text-ink/65"
                        }`}
                      >
                        {done ? <Check /> : module.number}
                        {done && <span className="sr-only">{module.number}, klar</span>}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={`block text-[14px] leading-snug ${selected ? "font-semibold text-pine" : "text-ink/85"}`}>
                          {module.title.sv}
                          {module.borjaHar && <StartTag />}
                        </span>
                        <span className="mt-1.5 flex items-center gap-2">
                          <ProgressBar score={score} className="h-1 flex-1" />
                          <span className="tabular text-[11px] text-ink/50">
                            {score.done}/{score.total}
                          </span>
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

// Mobilen: modulerna som rullande kort överst. Bara raden rullar i sidled,
// aldrig sidan.
function ModuleChips({ modules, answers, currentId, onOpen }) {
  const rowRef = useRef(null);
  useEffect(() => {
    const row = rowRef.current;
    const chip = row?.querySelector('[aria-current="page"]');
    if (!row || !chip || row.clientWidth === 0) return;
    // Rulla fram vald modul i raden (den snäpper mot vänsterkanten), utan
    // att sidan rullar i höjdled.
    const offset = chip.getBoundingClientRect().left - row.getBoundingClientRect().left;
    row.scrollTo({ left: row.scrollLeft + offset - (row.clientWidth - chip.clientWidth) / 2, behavior: "auto" });
  }, [currentId]);
  return (
    <nav aria-label="Välj modul" className="-mx-4 mt-4 sm:-mx-6 lg:hidden">
      <div ref={rowRef} className="no-scrollbar flex snap-x scroll-px-4 gap-2 overflow-x-auto px-4 pb-1 sm:scroll-px-6 sm:px-6">
        {modules.map((module) => {
          const score = modulScore(module, answers);
          const done = score.done === score.total;
          const selected = module.id === currentId;
          return (
            <button
              key={module.id}
              type="button"
              aria-current={selected ? "page" : undefined}
              onClick={() => onOpen(module.id)}
              className={`w-44 shrink-0 snap-start rounded-xl border px-3 py-2 text-left transition-colors ${
                selected ? "border-pine bg-pine/[0.08]" : "border-line bg-surface"
              }`}
            >
              <span className="flex items-center gap-1 text-[12px] text-ink/60">
                <span className={selected ? "font-semibold text-pine" : ""}>Modul {module.number}</span>
                {done && (
                  <span className="text-correct">
                    <Check className="h-3 w-3" />
                    <span className="sr-only">klar</span>
                  </span>
                )}
                {module.borjaHar && <StartTag />}
              </span>
              <span className={`mt-0.5 block truncate text-[14px] font-medium ${selected ? "text-pine" : ""}`}>{module.title.sv}</span>
              <ProgressBar score={score} className="mt-2 h-1" />
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// Lärarens inledning: hopfällbar, med hans egna meningar om var man börjar
// som förhandsvisning när den är stängd.
function IntroCard({ intro, open, onToggle }) {
  return (
    <details className="group card overflow-hidden" open={open} onToggle={(event) => onToggle(event.currentTarget.open)}>
      <summary className="flex cursor-pointer list-none items-start gap-4 p-4 transition-colors hover:bg-pine/[0.03] sm:p-5 [&::-webkit-details-marker]:hidden">
        <span aria-hidden="true" className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brass/15 text-brass-text">
          <svg viewBox="0 0 20 20" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 4.5c2.5-.8 4.8-.5 7 1 2.2-1.5 4.5-1.8 7-1v11c-2.5-.8-4.8-.5-7 1-2.2-1.5-4.5-1.8-7-1z" />
            <path d="M10 5.5v11" />
          </svg>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-lg leading-snug text-pine">Lärarens inledning</span>
          <span className="mt-1 line-clamp-2 text-[15px] leading-relaxed text-ink/70 group-open:hidden">{intro.utdrag.sv}</span>
        </span>
        <svg viewBox="0 0 20 20" aria-hidden="true" className="mt-1.5 h-5 w-5 shrink-0 text-ink/45 transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 8l5 5 5-5" />
        </svg>
      </summary>
      <div className="border-t border-line px-4 pb-6 pt-5 text-[16px] leading-[1.7] sm:px-6">
        <Markdown>{intro.sv}</Markdown>
        <Original markdown={intro.en} />
      </div>
    </details>
  );
}

// "Visa engelskt original": en omkopplare för hela fliken.
function EnglishSwitch({ on, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className="inline-flex items-center gap-2.5 rounded-lg px-1 py-1 text-[14px] text-ink/75 hover:text-pine"
    >
      <span className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${on ? "bg-pine" : "bg-line-strong"}`}>
        <span className={`inline-block h-4 w-4 rounded-full bg-surface shadow-sm transition-transform ${on ? "translate-x-[18px]" : "translate-x-0.5"}`} />
      </span>
      Visa engelskt original
    </button>
  );
}

// "Gör om modulen" med en bekräftelse på plats.
function ResetModule({ number, onReset, quiet = false }) {
  const [confirm, setConfirm] = useState(false);
  if (!confirm) {
    return (
      <button type="button" className={quiet ? "btn-quiet" : "btn-secondary"} onClick={() => setConfirm(true)}>
        Gör om modulen
      </button>
    );
  }
  return (
    <div className="w-full rounded-lg border border-line bg-paper px-4 py-3">
      <p className="text-sm text-ink/75">
        Svaren och Kunde/Kunde inte för modul {number} tas bort, här och i Öva. Det du skrivit står kvar.
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            onReset();
            setConfirm(false);
          }}
        >
          Ja, gör om modulen
        </button>
        <button type="button" className="btn-quiet" onClick={() => setConfirm(false)}>
          Avbryt
        </button>
      </div>
    </div>
  );
}

const scoreText = (score) => `${score.done} av ${score.total} besvarade · ${score.right} rätt`;

// Panelens rubrik: lärarens egen ("## Flervalsfrågor" …), lite mindre.
const headingComponents = {
  h2: ({ children }) => <h3 className="mt-3 font-display text-xl text-pine first:mt-0 sm:text-[22px]">{children}</h3>,
  h3: ({ children }) => <h4 className="mt-2 font-display text-lg text-pine">{children}</h4>,
  p: ({ children }) => <p className="mt-2 text-[15px] leading-relaxed text-ink/75">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-pine">{children}</strong>,
};

// Frågorna samlade i en tonad panel, så att växlingen mellan text och
// frågor syns direkt.
function Panel({ panel, answers, drafts, onAnswer }) {
  const summary = panelSummary(panel);
  const eyebrow = summary.examples
    ? ["Lärarens exempel"]
    : ["Testa dig själv", summary.type, `${summary.count} ${summary.count === 1 ? "fråga" : "frågor"}`];
  return (
    <section className="mt-12 rounded-2xl border border-pine/15 bg-pine/[0.04] p-3 sm:p-5">
      <header className="px-1 pb-1 pt-1 sm:px-1">
        <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-pine/80">
          <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="8" r="6.2" />
            <path d="M6.3 6.2a1.8 1.8 0 113 1.4c-.6.4-1.3.8-1.3 1.6M8 11.3v.1" />
          </svg>
          {eyebrow.filter(Boolean).join(" · ")}
        </p>
        {panel.heading && (
          <div className="mt-2">
            <Markdown components={headingComponents}>{panel.heading.sv}</Markdown>
            <Original markdown={panel.heading.en} />
          </div>
        )}
      </header>
      <div className="mt-4 space-y-4">
        {panel.items.map((item) => {
          if (item.kind === "tabell")
            return <TableRows key={item.id} items={item.items} answers={answers} drafts={drafts} onAnswer={onAnswer} />;
          if (item.kind === "fraga")
            return <Question key={item.id} item={item} answers={answers} drafts={drafts} onAnswer={onAnswer} />;
          if (item.kind === "fritext")
            return <FreeText key={item.id} item={item} answers={answers} drafts={drafts} onAnswer={onAnswer} />;
          // Lärarens exempel som är samma fråga som en senare (modul 1):
          // samma kort, samma svar och status.
          if (item.kind === "upprepning") {
            const Card = item.item.kind === "fraga" ? Question : FreeText;
            return (
              <Card
                key={item.id}
                item={item.item}
                anchor={item.id}
                sameAs={item.sammaSom}
                answers={answers}
                drafts={drafts}
                onAnswer={onAnswer}
              />
            );
          }
          if (item.kind === "notis")
            return (
              <div key={item.id} className="px-1 text-[15px] leading-relaxed text-ink/75">
                <Markdown components={headingComponents}>{item.block.sv}</Markdown>
                <Original markdown={item.block.en} />
              </div>
            );
          // Lärarens exempel (modul 1)
          return (
            <div key={item.id} className="rounded-card border border-dashed border-line-strong bg-surface/70 px-4 py-4 text-[16px] leading-[1.65] sm:px-5">
              <Markdown>{item.sv}</Markdown>
              <Original markdown={item.en} />
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function Moduler({ course, answers, params, navigate, onAnswer, onResetModule }) {
  const modules = course.moduler;
  const drafts = useDrafts();
  const [currentId, setCurrentId] = useState(() => {
    const saved = load(KEYS.modulVald, null);
    return modules.some((module) => module.id === saved) ? saved : modules[0].id;
  });
  const [introOpen, setIntroOpen] = useState(() => load(KEYS.modulInledning, false));
  const [english, setEnglish] = useState(() => load(KEYS.modulEngelska, false) === true);

  useEffect(() => save(KEYS.modulVald, currentId), [currentId]);
  useEffect(() => save(KEYS.modulInledning, introOpen), [introOpen]);
  useEffect(() => save(KEYS.modulEngelska, english), [english]);
  useEffect(() => {
    if (params?.chapterId && modules.some((module) => module.id === params.chapterId)) setCurrentId(params.chapterId);
  }, [params, modules]);

  const index = modules.findIndex((module) => module.id === currentId);
  const current = modules[index];
  const next = modules[index + 1];
  const previous = modules[index - 1];
  const sections = useMemo(() => groupSections(current.blocks), [current]);
  const score = modulScore(current, answers);
  const openId = firstOpenId(current, answers);
  const lectures = useMemo(() => {
    const seen = new Map();
    for (const module of modules) if (module.forelasning) seen.set(module.forelasning.nummer, module.forelasning);
    return [...seen.values()];
  }, [modules]);

  function open(id) {
    setCurrentId(id);
    window.scrollTo({ top: 0 });
  }

  // "Fortsätt där du var": till första obesvarade frågan, med fokus på
  // kortet så att tangentbordet hamnar rätt.
  function continueHere() {
    const target = openId && document.getElementById(`q-${openId}`);
    if (!target) return;
    target.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
    target.focus({ preventScroll: true });
  }

  // Gör om modulen: status och valda alternativ bort, modellsvaren döljs,
  // texten står kvar (Kaspers beslut).
  function resetModule() {
    for (const block of current.blocks) {
      if (block.kind === "fraga") drafts.clear(block.id);
      if (block.kind === "fritext") {
        const saved = drafts.get(block.id, null);
        if (saved && typeof saved === "object" && saved.shown) drafts.set(block.id, { ...saved, shown: false });
      }
    }
    onResetModule(modulIds(current));
  }

  return (
    <EnglishContext.Provider value={english}>
      <div className="lg:grid lg:grid-cols-[17.5rem_minmax(0,1fr)] lg:gap-10 xl:gap-14">
        <aside className="lg:sticky lg:top-[9.5rem] lg:max-h-[calc(100vh-11rem)] lg:self-start lg:overflow-y-auto lg:pb-8 lg:pr-1 lg:[scrollbar-color:rgb(var(--line-strong-rgb))_transparent] lg:[scrollbar-width:thin]">
          <h1 className="font-display text-3xl">Moduler</h1>
          <p className="mt-1 text-[15px] text-ink/70 lg:text-[14px]">
            Lärarens tolv moduler på svenska, med frågorna där de står i modulen. Svaren räknas också i Öva.
          </p>
          <ModuleList modules={modules} lectures={lectures} answers={answers} currentId={currentId} onOpen={open} />
          <ModuleChips modules={modules} answers={answers} currentId={currentId} onOpen={open} />
        </aside>

        <div className="mx-auto mt-6 w-full min-w-0 max-w-[44rem] lg:mt-0">
          <IntroCard intro={course.modulerIntro} open={introOpen} onToggle={setIntroOpen} />

          <article className="mt-6 text-[17px] leading-[1.7]">
            <header className="card relative overflow-hidden p-5 sm:p-7">
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pine via-pine to-brass" />
              <div className="flex flex-wrap gap-2 text-[13px] font-medium">
                <span className="rounded-full bg-pine/[0.09] px-2.5 py-0.5 text-pine">Modul {current.number}</span>
                {current.forelasning && (
                  <span className="rounded-full bg-brass/15 px-2.5 py-0.5 text-brass-text">Föreläsning {current.forelasning.nummer}</span>
                )}
                {current.borjaHar && <span className="rounded-full border border-brass/40 px-2.5 py-0.5 text-brass-text">Börja här</span>}
              </div>
              <h2 className="mt-3 font-display text-[28px] leading-[1.12] sm:text-[36px]">{current.title.sv}</h2>
              <Original>
                Module {current.number} — {current.title.en}
              </Original>
              {current.ingress && (
                <>
                  <p className="mt-4 text-[17px] leading-relaxed text-ink/80 sm:text-[18px]">{current.ingress.sv}</p>
                  <Original>{current.ingress.en}</Original>
                </>
              )}
              <div className="mt-6">
                <ProgressBar score={score} className="h-2" />
                <p className="tabular mt-2 text-[14px] text-ink/70">{scoreText(score)}</p>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                {openId && (
                  <button type="button" className="btn-primary" onClick={continueHere}>
                    {score.done === 0 ? "Börja med första frågan" : "Fortsätt där du var"}
                  </button>
                )}
                <ResetModule key={current.id} number={current.number} onReset={resetModule} />
              </div>
              <div className="mt-4 border-t border-line pt-3">
                <EnglishSwitch on={english} onChange={setEnglish} />
              </div>
            </header>

            {sections.map((section) =>
              section.kind === "panel" ? (
                <Panel key={section.id} panel={section} answers={answers} drafts={drafts} onAnswer={onAnswer} />
              ) : (
                <TextBlock key={section.id} block={section.block} />
              ),
            )}

            <footer className="card mt-14 p-5 text-base sm:p-7">
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-ink/55">Slut på modul {current.number}</p>
              <p className="mt-2 font-display text-2xl leading-snug text-pine">
                Du har svarat på {score.done} av {score.total}, {score.right} rätt.
              </p>
              <ProgressBar score={score} className="mt-4 h-2" />
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {next && (
                  <button type="button" className="btn-primary" onClick={() => open(next.id)}>
                    Nästa modul →
                  </button>
                )}
                {course.views.includes("ova") && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => navigate("ova", { topics: [current.id], nonce: Date.now() })}
                  >
                    Öva modul {current.number} i Öva
                  </button>
                )}
                <ResetModule key={current.id} number={current.number} onReset={resetModule} quiet />
              </div>
              {(next || previous) && (
                <div className="mt-5 flex flex-wrap justify-between gap-x-6 gap-y-1 border-t border-line pt-4 text-[14px] text-ink/65">
                  {previous ? (
                    <button type="button" className="text-left hover:text-pine" onClick={() => open(previous.id)}>
                      ← Modul {previous.number} · {previous.title.sv}
                    </button>
                  ) : (
                    <span />
                  )}
                  {next && <span>Nästa: Modul {next.number} · {next.title.sv}</span>}
                </div>
              )}
            </footer>
          </article>
        </div>
      </div>
    </EnglishContext.Provider>
  );
}
