import OptionButton from "../OptionButton.jsx";
import { Original } from "./Text.jsx";
import { chosenOption, typeLabel } from "../../lib/moduler.js";
import { isAnswered } from "../../lib/practiceQueue.js";

const LETTERS = ["A", "B", "C", "D", "E"];

// Numret i en liten bricka. Den följer kortets läge: neutral innan man
// svarat, grön vid rätt, röd vid fel; mässing för fritext.
export function NumberBadge({ nr, state = "idle" }) {
  if (!nr) return null;
  const tone = {
    idle: "border border-pine/25 bg-surface text-pine",
    correct: "bg-correct text-paper",
    wrong: "bg-wrong text-paper",
    fritext: "bg-brass/20 text-brass-text",
  }[state];
  return (
    <span
      aria-hidden="true"
      className={`tabular inline-flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full px-1.5 text-[13px] font-semibold ${tone}`}
    >
      {nr}
    </span>
  );
}

// Brickan och typen överst i varje frågekort.
export function CardHead({ item, state, children }) {
  return (
    <div className="flex items-center gap-2.5">
      <NumberBadge nr={item.nr} state={state} />
      <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-ink/55">
        {item.nr ? <span className="sr-only">Fråga {item.nr}, </span> : null}
        {typeLabel(item)}
      </span>
      {children}
    </div>
  );
}

// Rätt/fel och förklaringen i en mjuk ruta när frågan är besvarad.
function Feedback({ item, chosen }) {
  const right = chosen === item.correct;
  return (
    <div
      className={`mt-4 rounded-lg border px-4 py-3 ${right ? "border-correct/25 bg-correct-bg/70" : "border-wrong/25 bg-wrong-bg/70"}`}
      role="status"
    >
      <p className={`font-semibold ${right ? "text-correct" : "text-wrong"}`}>
        {right ? "Rätt." : `Fel. Rätt svar är ${item.typ === "sant-falskt" ? item.options[item.correct].sv.toLowerCase() : LETTERS[item.correct]}.`}
      </p>
      <p className="mt-1 text-[15px] leading-relaxed">{item.explanation.sv}</p>
      {item.explanation.en && <Original>Explanation: {item.explanation.en}</Original>}
    </div>
  );
}

const questionText = "font-sans text-[17px] font-medium leading-snug tracking-normal text-ink [font-variation-settings:normal]";

// En flervals- eller sant/falskt-fråga direkt på sidan, med alternativen i
// lärarens ordning A–E. Valet sparas i svar:<frågeId> ({ choice }) och
// svaret i answers, samma post som i Öva.
export default function Question({ item, answers, drafts, onAnswer }) {
  const stat = answers[item.id];
  const chosen = chosenOption(stat, drafts.get(item.id, null));
  const trueFalse = item.typ === "sant-falskt";

  function choose(index) {
    if (chosen !== null) return;
    drafts.set(item.id, { choice: index });
    onAnswer(item.id, index === item.correct);
  }

  const stateFor = (index) => {
    if (chosen === null) return "idle";
    if (index === item.correct) return index === chosen ? "correct" : "missed";
    return index === chosen ? "wrong" : "idle";
  };
  const badge = chosen === null ? "idle" : chosen === item.correct ? "correct" : "wrong";

  return (
    <article id={`q-${item.id}`} tabIndex={-1} className="card scroll-mt-40 p-4 shadow-[0_1px_2px_rgb(var(--shade-rgb)/0.04)] focus:outline-none sm:p-5">
      <CardHead item={item} state={badge} />
      <h4 className={`mt-3 ${questionText}`}>{item.question.sv}</h4>
      <Original>
        <p>{item.question.en}</p>
        <ul className="mt-1 space-y-0.5">
          {item.options.map((option, index) => (
            <li key={option.en}>
              {trueFalse ? "" : `${LETTERS[index]}. `}
              {option.en}
            </li>
          ))}
        </ul>
      </Original>
      {chosen === null && isAnswered(stat) && (
        <p className="mt-2 text-sm text-ink/65">Besvarad i Öva. Svara här också om du vill.</p>
      )}
      <div className="mt-4 space-y-2">
        {item.options.map((option, index) => (
          <OptionButton
            key={option.en}
            index={index}
            label={trueFalse ? option.sv[0] : LETTERS[index]}
            text={option.sv}
            state={stateFor(index)}
            disabled={chosen !== null}
            onClick={() => choose(index)}
          />
        ))}
      </div>
      {chosen !== null && <Feedback item={item} chosen={chosen} />}
    </article>
  );
}

// Raderna i modul 12:s tabell "Zachman eller TOGAF?": tvåvalsfrågor på en
// rad var, med påståendet till vänster och valen till höger.
export function TableRows({ items, answers, drafts, onAnswer }) {
  return (
    <div className="card divide-y divide-line overflow-hidden shadow-[0_1px_2px_rgb(var(--shade-rgb)/0.04)]">
      {items.map((item) => {
        const stat = answers[item.id];
        const chosen = chosenOption(stat, drafts.get(item.id, null));
        const statement = item.question.sv.replace(/^.*?"(.*)"$/s, "$1");
        const statementEn = item.question.en.replace(/^.*?"(.*)"$/s, "$1");
        const right = chosen === item.correct;
        return (
          <div key={item.id} id={`q-${item.id}`} tabIndex={-1} className="scroll-mt-40 px-4 py-3.5 focus:outline-none sm:px-5">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <p className="min-w-0 flex-1 basis-56 text-[15px] font-medium">{statement}</p>
              <div className="flex gap-2">
                {item.options.map((option, index) => {
                  const picked = chosen === index;
                  const tone =
                    chosen === null
                      ? "border-line bg-surface hover:border-pine hover:bg-pine/[0.05]"
                      : index === item.correct
                        ? "border-correct bg-correct-bg text-correct"
                        : picked
                          ? "border-wrong bg-wrong-bg text-wrong"
                          : "border-line text-ink/50";
                  return (
                    <button
                      key={option.en}
                      type="button"
                      disabled={chosen !== null}
                      aria-pressed={picked}
                      onClick={() => {
                        drafts.set(item.id, { choice: index });
                        onAnswer(item.id, index === item.correct);
                      }}
                      className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors disabled:cursor-default ${tone}`}
                    >
                      {option.sv}
                    </button>
                  );
                })}
              </div>
            </div>
            {chosen !== null && (
              <p className={`mt-2.5 rounded-lg px-3 py-2 text-[15px] leading-relaxed ${right ? "bg-correct-bg/70" : "bg-wrong-bg/70"}`} role="status">
                <span className={`font-semibold ${right ? "text-correct" : "text-wrong"}`}>
                  {right ? "Rätt." : `Fel, ${item.options[item.correct].sv}.`}
                </span>{" "}
                {item.explanation.sv}
              </p>
            )}
            {chosen === null && isAnswered(stat) && <p className="mt-1 text-sm text-ink/65">Besvarad i Öva.</p>}
            <Original>{statementEn}</Original>
          </div>
        );
      })}
    </div>
  );
}
