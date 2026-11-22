import { useEffect } from "react";
import { EnglishToggle } from "./Text.jsx";
import { KEYS, load, loadDraft } from "../../lib/storage.js";
import { isAnswered } from "../../lib/practiceQueue.js";

const TYP_LABEL = { kortsvar: "Kortsvarsfråga", essa: "Essäfråga", fall: "Fallfråga", scenario: "Scenario", tankande: "" };

function heading(item) {
  if (item.title) return item.nr ? `${item.nr}. ${item.title.sv}` : item.title.sv;
  return `${TYP_LABEL[item.typ] ?? "Fråga"} ${item.nr ?? ""}`.trim();
}

// En kortsvars-, essä- eller scenariofråga: skrivruta, "Visa modellsvar"
// med lärarens modellsvar (och Viktig lärdom), sedan Kunde eller Kunde inte.
//
// Samma post som förklarakortet i Öva: texten i svar:<kortId> som
// { text, seeded, shown } och bedömningen i answers. Första gången fylls
// texten från Essä-utkasten, aldrig igen (som ExplainCard). `shown` gör att
// ett visat modellsvar syns efter omladdning; "Gör om modulen" döljer det.
export default function FreeText({ item, answers, drafts, onAnswer }) {
  useEffect(() => {
    if (loadDraft(item.id) !== null) return;
    const essayState = load(KEYS.essays, {});
    const seed = typeof essayState[item.essayId]?.draft === "string" ? essayState[item.essayId].draft.trim() : "";
    drafts.set(item.id, { text: seed, seeded: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);

  const saved = drafts.get(item.id, null);
  const draft = saved && typeof saved === "object" ? saved : { text: typeof saved === "string" ? saved : "" };
  const update = (patch) => drafts.set(item.id, { seeded: true, ...draft, ...patch });
  const stat = answers[item.id];
  const graded = isAnswered(stat) ? stat.last === "correct" : null;

  return (
    <article className="card mt-6 p-4 sm:p-5">
      <p className="text-sm font-medium text-ink/65">{heading(item)}</p>
      <h4 className="mt-1 whitespace-pre-line text-[17px] font-medium leading-normal">{item.question.sv}</h4>

      <label className="mt-4 block">
        <span className="text-sm font-medium text-ink/75">Ditt svar (sparas)</span>
        <textarea
          value={draft.text ?? ""}
          onChange={(event) => update({ text: event.target.value })}
          rows={5}
          className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-[15px] leading-relaxed"
        />
      </label>

      {!draft.shown ? (
        <button type="button" className="btn-primary mt-3" onClick={() => update({ shown: true })}>
          Visa modellsvar
        </button>
      ) : (
        <>
          <section className="mt-5">
            <h5 className="font-display text-lg">{item.answerLabel?.sv ?? "Modellsvar"}</h5>
            <p className="mt-1 whitespace-pre-line text-[15px] leading-relaxed">{item.modelAnswer.sv}</p>
            {item.extraModelAnswers.map((extra) => (
              <div key={extra.en} className="mt-3">
                <p className="text-sm text-ink/65">Exempelsvaret i modulens inledning</p>
                <p className="mt-0.5 whitespace-pre-line text-[15px] leading-relaxed">{extra.sv}</p>
              </div>
            ))}
          </section>
          {item.keyLesson && (
            <section className="mt-4 rounded-lg border border-correct/30 bg-correct-bg p-3">
              <h5 className="font-display text-base text-correct">{item.keyLessonLabel.sv}</h5>
              <p className="mt-0.5 text-[15px] leading-relaxed">{item.keyLesson.sv}</p>
            </section>
          )}
          <div className="mt-5">
            <p className="text-[15px] font-medium">Kunde du svaret?</p>
            <div className="mt-2 flex flex-wrap gap-3">
              <button
                type="button"
                aria-pressed={graded === true}
                className={graded === true ? "btn-primary" : "btn-secondary"}
                onClick={() => onAnswer(item.id, true)}
              >
                Kunde
              </button>
              <button
                type="button"
                aria-pressed={graded === false}
                className={graded === false ? "btn-primary" : "btn-secondary"}
                onClick={() => onAnswer(item.id, false)}
              >
                Kunde inte
              </button>
            </div>
            {graded !== null && (
              <p className={`mt-2 text-sm ${graded ? "text-correct" : "text-wrong"}`} role="status">
                {graded ? "Du kunde svaret." : "Du kunde inte svaret än."}
              </p>
            )}
          </div>
        </>
      )}

      <EnglishToggle>
        {item.title && <p className="font-medium">{item.title.en}</p>}
        <p className="whitespace-pre-line font-medium">{item.question.en}</p>
        {draft.shown && (
          <>
            <p className="mt-2 text-sm text-ink/65">{item.answerLabel?.en ?? "Model answer"}</p>
            <p className="whitespace-pre-line">{item.modelAnswer.en}</p>
            {item.extraModelAnswers.map((extra) => (
              <p key={extra.en} className="mt-2 whitespace-pre-line">{extra.en}</p>
            ))}
            {item.keyLesson && (
              <>
                <p className="mt-2 text-sm text-ink/65">{item.keyLessonLabel.en}</p>
                <p>{item.keyLesson.en}</p>
              </>
            )}
          </>
        )}
      </EnglishToggle>
    </article>
  );
}
