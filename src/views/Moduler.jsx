import { useEffect, useMemo, useState } from "react";
import TextBlock, { EnglishToggle, Markdown } from "../components/moduler/Text.jsx";
import Question, { TableRows } from "../components/moduler/Question.jsx";
import FreeText from "../components/moduler/FreeText.jsx";
import { modulIds, modulProgress } from "../lib/moduler.js";
import { KEYS, load, save } from "../lib/storage.js";
import { useDrafts } from "../lib/useDrafts.js";

// Fliken Moduler (Verksamhetsarkitektur, Kaspers beslut 2026-11-22): lärarens
// tre moduldokument uppifrån och ned på svenska. En sida per modul i
// dokumentens ordning 1–12: text, sedan frågorna som hör till, sedan nästa
// text, precis som i PDF:erna. Data i data/arkitektur/modulerView.js.
//
// Allt sparas: vald modul (modulVald), valda alternativ och skriven text
// (svar:<id>), svar och Kunde/Kunde inte (answers, samma som Öva). "Gör om
// modulen" tar bort status och val men aldrig texten.

// Raderna i tabellen "Zachman eller TOGAF?" ritas tillsammans.
function groupBlocks(blocks) {
  const out = [];
  for (const block of blocks) {
    const last = out[out.length - 1];
    if (block.kind === "fraga" && block.id.startsWith("ea-m12-34")) {
      if (last?.kind === "tabell") last.items.push(block);
      else out.push({ kind: "tabell", id: "tabell-34", items: [block] });
    } else out.push(block);
  }
  return out;
}

export default function Moduler({ course, answers, params, navigate, onAnswer, onResetModule }) {
  const modules = course.moduler;
  const drafts = useDrafts();
  const [currentId, setCurrentId] = useState(() => {
    const saved = load(KEYS.modulVald, null);
    return modules.some((module) => module.id === saved) ? saved : modules[0].id;
  });
  const [introOpen, setIntroOpen] = useState(() => load(KEYS.modulInledning, true));
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => save(KEYS.modulVald, currentId), [currentId]);
  useEffect(() => save(KEYS.modulInledning, introOpen), [introOpen]);
  useEffect(() => {
    if (params?.chapterId && modules.some((module) => module.id === params.chapterId)) setCurrentId(params.chapterId);
  }, [params, modules]);

  const index = modules.findIndex((module) => module.id === currentId);
  const current = modules[index];
  const blocks = useMemo(() => groupBlocks(current.blocks), [current]);
  const progress = modulProgress(current, answers);

  function open(id) {
    setCurrentId(id);
    setConfirmReset(false);
    window.scrollTo({ top: 0 });
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
    setConfirmReset(false);
  }

  return (
    <div className="space-y-6">
      <section>
        <h1 className="font-display text-3xl">Moduler</h1>
        <p className="mt-1 max-w-reading text-[15px] text-ink/70">
          Lärarens tolv moduler på svenska, med frågorna där de står i modulen. Svaren räknas också i Öva.
        </p>
      </section>

      <details
        className="card max-w-3xl p-4 sm:p-5"
        open={introOpen}
        onToggle={(event) => setIntroOpen(event.currentTarget.open)}
      >
        <summary className="cursor-pointer font-display text-lg">Lärarens inledning</summary>
        <div className="text-[16px] leading-[1.65]">
          <Markdown>{course.modulerIntro.sv}</Markdown>
          <EnglishToggle>
            <Markdown>{course.modulerIntro.en}</Markdown>
          </EnglishToggle>
        </div>
      </details>

      <nav aria-label="Välj modul" className="grid max-w-3xl grid-cols-3 gap-2 sm:grid-cols-6">
        {modules.map((module) => {
          const p = modulProgress(module, answers);
          const selected = module.id === currentId;
          return (
            <button
              key={module.id}
              type="button"
              aria-current={selected ? "page" : undefined}
              onClick={() => open(module.id)}
              className={`rounded-lg border px-2 py-2 text-left transition-colors ${
                selected ? "border-pine bg-pine text-paper" : "border-line bg-surface hover:border-pine"
              }`}
            >
              <span className="block text-sm font-medium">Modul {module.number}</span>
              <span className={`tabular block text-xs ${selected ? "text-paper/85" : "text-ink/65"}`}>
                {p.done} av {p.total}
              </span>
            </button>
          );
        })}
      </nav>

      <article className="max-w-[68ch] text-[17px] leading-[1.7]">
        <header>
          <p className="text-sm font-medium text-ink/65">Modul {current.number}</p>
          <h2 className="font-display text-2xl sm:text-3xl">{current.title.sv}</h2>
          <p className="tabular mt-1 text-sm text-ink/70">
            {progress.done} av {progress.total} besvarade
          </p>
          <EnglishToggle>
            <p>Module {current.number} — {current.title.en}</p>
          </EnglishToggle>
          <div className="mt-3">
            {confirmReset ? (
              <div>
                <p className="text-sm text-ink/70">
                  Svaren och Kunde/Kunde inte för modul {current.number} tas bort, här och i Öva. Det du skrivit står kvar.
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button type="button" className="btn-secondary" onClick={resetModule}>
                    Ja, gör om modulen
                  </button>
                  <button type="button" className="btn-quiet" onClick={() => setConfirmReset(false)}>
                    Avbryt
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" className="btn-quiet px-0 text-sm" onClick={() => setConfirmReset(true)}>
                Gör om modulen
              </button>
            )}
          </div>
        </header>

        {blocks.map((block) => {
          if (block.kind === "tabell")
            return <TableRows key={block.id} items={block.items} answers={answers} drafts={drafts} onAnswer={onAnswer} />;
          if (block.kind === "fraga")
            return <Question key={block.id} item={block} answers={answers} drafts={drafts} onAnswer={onAnswer} />;
          if (block.kind === "fritext")
            return <FreeText key={block.id} item={block} answers={answers} drafts={drafts} onAnswer={onAnswer} />;
          return <TextBlock key={block.id} block={block} />;
        })}

        <footer className="mt-10 border-t border-line pt-5 text-base">
          <div className="flex flex-wrap gap-3">
            {index > 0 && (
              <button type="button" className="btn-secondary" onClick={() => open(modules[index - 1].id)}>
                ← Modul {modules[index - 1].number}
              </button>
            )}
            {index < modules.length - 1 && (
              <button type="button" className="btn-primary" onClick={() => open(modules[index + 1].id)}>
                Modul {modules[index + 1].number} →
              </button>
            )}
            {course.views.includes("ova") && (
              <button
                type="button"
                className="btn-quiet"
                onClick={() => navigate("ova", { topics: [current.id], nonce: Date.now() })}
              >
                Öva modul {current.number} i Öva
              </button>
            )}
          </div>

        </footer>
      </article>
    </div>
  );
}
