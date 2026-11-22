import OptionButton from "../OptionButton.jsx";
import { EnglishToggle } from "./Text.jsx";
import { chosenOption } from "../../lib/moduler.js";
import { isAnswered } from "../../lib/practiceQueue.js";

const LETTERS = ["A", "B", "C", "D", "E"];

// Rätt/fel och förklaringen när frågan är besvarad.
function Feedback({ item, chosen }) {
  const right = chosen === item.correct;
  return (
    <div className="mt-4 border-t border-line pt-3" role="status">
      <p className={`font-display text-lg ${right ? "text-correct" : "text-wrong"}`}>
        {right ? "Rätt." : `Fel. Rätt svar är ${item.typ === "sant-falskt" ? item.options[item.correct].sv.toLowerCase() : LETTERS[item.correct]}.`}
      </p>
      <p className="mt-1 text-[15px] leading-relaxed">{item.explanation.sv}</p>
    </div>
  );
}

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

  return (
    <article className="card mt-6 p-4 sm:p-5">
      {item.nr && <p className="text-sm font-medium text-ink/65">Fråga {item.nr}</p>}
      <h4 className="mt-1 text-[17px] font-medium leading-normal">{item.question.sv}</h4>
      {chosen === null && isAnswered(stat) && (
        <p className="mt-1 text-sm text-ink/65">Besvarad i Öva. Svara här också om du vill.</p>
      )}
      <div className="mt-3 space-y-2">
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
      <EnglishToggle>
        <p className="font-medium">{item.question.en}</p>
        <ul className="mt-1 space-y-0.5">
          {item.options.map((option, index) => (
            <li key={option.en}>
              {trueFalse ? "" : `${LETTERS[index]}. `}
              {option.en}
            </li>
          ))}
        </ul>
        {chosen !== null && item.explanation.en && <p className="mt-2">Explanation: {item.explanation.en}</p>}
      </EnglishToggle>
    </article>
  );
}

// Raderna i modul 12:s tabell "Zachman eller TOGAF?": tvåvalsfrågor på en
// rad var, med påståendet till vänster och valen till höger.
export function TableRows({ items, answers, drafts, onAnswer }) {
  return (
    <div className="card mt-4 divide-y divide-line">
      {items.map((item) => {
        const stat = answers[item.id];
        const chosen = chosenOption(stat, drafts.get(item.id, null));
        const statement = item.question.sv.replace(/^.*?"(.*)"$/s, "$1");
        const statementEn = item.question.en.replace(/^.*?"(.*)"$/s, "$1");
        return (
          <div key={item.id} className="px-4 py-3 sm:px-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[15px] font-medium">{statement}</p>
              <div className="flex gap-2">
                {item.options.map((option, index) => {
                  const picked = chosen === index;
                  const right = index === item.correct;
                  const tone =
                    chosen === null
                      ? "border-line hover:border-pine hover:bg-pine/[0.05]"
                      : right
                        ? "border-correct bg-correct-bg"
                        : picked
                          ? "border-wrong bg-wrong-bg"
                          : "border-line opacity-70";
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
                      className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-default ${tone}`}
                    >
                      {option.sv}
                    </button>
                  );
                })}
              </div>
            </div>
            {chosen !== null && (
              <p className="mt-2 text-[15px] leading-relaxed" role="status">
                <span className={`font-medium ${chosen === item.correct ? "text-correct" : "text-wrong"}`}>
                  {chosen === item.correct ? "Rätt." : `Fel, ${item.options[item.correct].sv}.`}
                </span>{" "}
                {item.explanation.sv}
              </p>
            )}
            {chosen === null && isAnswered(stat) && <p className="mt-1 text-sm text-ink/65">Besvarad i Öva.</p>}
            <EnglishToggle>
              <p>{statementEn}</p>
            </EnglishToggle>
          </div>
        );
      })}
    </div>
  );
}
