import OptionButton from "./OptionButton.jsx";
import ExplanationPanel from "./ExplanationPanel.jsx";
import { Diagram } from "./knowledge/diagrams/index.jsx";

const DIFFICULTY = { 1: "Grund", 2: "Standard", 3: "Klurig" };

// reviewed: false på en fråga är en intern markering (HANDOFF: granskning
// mot kursmaterialet) och visas inte för den som pluggar.
// view = { options, correct } från shuffleQuestion — index avser den
// blandade ordningen, aldrig datafilens.
export default function QuestionCard({
  question,
  view,
  chosen,
  revealed,
  onChoose,
  topicName,
  counter,
  children,
}) {
  function stateFor(index) {
    if (!revealed) return chosen === index ? "selected" : "idle";
    if (index === view.correct) return chosen === index ? "correct" : "missed";
    return chosen === index ? "wrong" : "idle";
  }

  return (
    <article className="card mx-auto w-full max-w-reading p-5 sm:p-7">
      <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink/65">
        {counter && <span className="tabular font-medium text-ink/70">{counter}</span>}
        {topicName && <span>{topicName}</span>}
        {question.difficulty && (
          <>
            <span aria-hidden="true">·</span>
            <span>{DIFFICULTY[question.difficulty] || "Standard"}</span>
          </>
        )}
      </div>

      {/* Underlag före stammen: ett av sajtens diagram (tentans uppgift 1) eller
          ett förformaterat block — R med beroenden och scheman, eller SQL. */}
      {question.diagram && <Diagram id={question.diagram} />}
      {question.context && (
        <pre className="mb-4 overflow-x-auto rounded-lg border border-line bg-paper px-4 py-3 font-mono text-[13.5px] leading-relaxed text-ink">
          {question.context}
        </pre>
      )}
      <h2 className="font-display text-[22px] leading-snug text-ink sm:text-[26px]">
        {question.question}
      </h2>

      <div className="mt-5 space-y-2.5" role="group" aria-label="Svarsalternativ">
        {view.options.map((option, index) => (
          <OptionButton
            key={option.originalIndex}
            index={index}
            text={option.text}
            state={stateFor(index)}
            disabled={revealed}
            onClick={() => onChoose(index)}
          />
        ))}
      </div>

      {revealed && (
        <ExplanationPanel
          options={view.options}
          chosen={chosen}
          correct={view.correct}
          source={question.source}
          explanation={question.explanation}
        />
      )}

      {children && <div className="mt-6">{children}</div>}
    </article>
  );
}
