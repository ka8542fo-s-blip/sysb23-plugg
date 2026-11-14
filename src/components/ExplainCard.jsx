import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { KEYS, load, loadDraft } from "../lib/storage.js";

// Förklarakort i Öva (Verksamhetsarkitektur, data/arkitektur/explainCards.js):
// frågan, ett frivilligt textfält, "Visa svar" med modulens kärnsvar och
// lärarens modellsvar ordagrant, och sedan "Kunde" eller "Kunde inte".
//
// Texten sparas i sysb23:svar:<kortId> som { text, seeded } vid varje
// ändring. Första gången kortet visas fylls den med det man redan skrivit
// i Essä (essäernas utkast i sysb23:essays); `seeded` gör att det bara sker
// en gång, aldrig efter att man själv tömt fältet. Nollställ i Öva tar bort
// status men aldrig texten (Kaspers beslut 2026-11-14).
export default function ExplainCard({ card, drafts, revealed, chosen, onGrade, topicName, counter, children }) {
  const [shown, setShown] = useState(revealed);
  useEffect(() => {
    if (revealed) setShown(true);
  }, [revealed]);

  useEffect(() => {
    if (loadDraft(card.id) !== null) return;
    const essayState = load(KEYS.essays, {});
    const seed = card.essayIds
      .map((id) => (typeof essayState[id]?.draft === "string" ? essayState[id].draft.trim() : ""))
      .filter(Boolean)
      .join("\n\n");
    drafts.set(card.id, { text: seed, seeded: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card.id]);

  const saved = drafts.get(card.id, null);
  const text = typeof saved === "string" ? saved : saved?.text ?? "";
  const [first, ...others] = card.prompts;

  return (
    <article className="card mx-auto w-full max-w-reading p-5 sm:p-7">
      <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink/65">
        <span className="rounded-full border border-pine/50 px-2.5 py-0.5 text-xs font-medium text-pine">Förklarakort</span>
        {counter && <span className="tabular font-medium text-ink/70">{counter}</span>}
        {topicName && <span>{topicName}</span>}
      </div>

      {first.note && (
        <p className="mb-3 rounded-lg border border-brass px-3 py-2 text-[14px] leading-relaxed text-ink/85">{first.note}</p>
      )}
      <h2 className="font-sans text-[18px] font-medium leading-normal tracking-[-0.005em] text-ink [font-variation-settings:normal] sm:text-[20px]">
        {first.question}
      </h2>
      <p className="mt-1 text-sm text-ink/65">{first.source}</p>

      {others.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-ink/75">Samma fråga i andra lydelser:</p>
          <ul className="mt-1 space-y-1.5 text-[15px] leading-relaxed">
            {others.map((prompt) => (
              <li key={prompt.id}>
                {prompt.question} <span className="text-sm text-ink/65">({prompt.source})</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <label className="mt-5 block">
        <span className="text-sm font-medium text-ink/75">Ditt svar (frivilligt, sparas)</span>
        <textarea
          value={text}
          onChange={(event) => drafts.set(card.id, { text: event.target.value, seeded: true })}
          rows={5}
          className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-[15px] leading-relaxed"
        />
      </label>

      {!shown ? (
        <button type="button" className="btn-primary mt-4" onClick={() => setShown(true)}>
          Visa svar
        </button>
      ) : (
        <>
          {card.karnsvar && (
            <section className="mt-6 rounded-lg border border-correct/30 bg-correct-bg p-4 text-[15px] leading-relaxed">
              <h3 className="font-display text-lg text-correct">Modulens kärnsvar</h3>
              <div className="mt-1">
                <ReactMarkdown>{card.karnsvar}</ReactMarkdown>
              </div>
            </section>
          )}
          {card.prompts.map((prompt) => (
            <section key={prompt.id} className="mt-5">
              <h3 className="font-display text-lg">
                Lärarens modellsvar{card.prompts.length > 1 ? ` · ${prompt.source}` : ""}
              </h3>
              {prompt.modelAnswer ? (
                <p className="mt-1 whitespace-pre-line text-[15px] leading-relaxed">{prompt.modelAnswer}</p>
              ) : (
                <>
                  <p className="mt-1 text-sm text-ink/70">
                    Frågan har inget modellsvar. Checklistan bygger på modul 4.
                  </p>
                  {(prompt.checklist || []).map((group) => (
                    <div key={group.heading} className="mt-2">
                      <p className="text-[15px] font-medium">{group.heading}</p>
                      <ul className="mt-1 list-disc space-y-1 pl-5 text-[15px] leading-relaxed">
                        {group.points.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </>
              )}
            </section>
          ))}
          {!revealed ? (
            <div className="mt-6">
              <p className="text-[15px] font-medium">Kunde du svaret?</p>
              <div className="mt-2 flex flex-wrap gap-3">
                <button type="button" className="btn-primary" onClick={() => onGrade(true)}>
                  Kunde
                </button>
                <button type="button" className="btn-secondary" onClick={() => onGrade(false)}>
                  Kunde inte
                </button>
              </div>
            </div>
          ) : (
            <p className={`mt-6 text-[15px] font-medium ${chosen === 0 ? "text-correct" : "text-wrong"}`}>
              {chosen === 0 ? "Du kunde svaret." : "Du kunde inte svaret än. Kortet kommer tillbaka."}
            </p>
          )}
        </>
      )}

      {children && <div className="mt-6">{children}</div>}
    </article>
  );
}
