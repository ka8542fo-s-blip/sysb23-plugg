const LETTERS = ["1", "2", "3", "4"];

// state: "idle" | "selected" | "correct" | "wrong" | "missed"
export default function OptionButton({ index, text, state, disabled, onClick }) {
  const styles = {
    idle: "border-line bg-white hover:border-pine",
    selected: "border-pine bg-white ring-1 ring-pine",
    correct: "border-correct bg-correct-bg",
    wrong: "border-wrong bg-wrong-bg",
    missed: "border-correct bg-correct-bg",
  }[state];

  const badge = {
    idle: "border-line text-ink/65",
    selected: "border-pine bg-pine text-white",
    correct: "border-correct bg-correct text-white",
    wrong: "border-wrong bg-wrong text-white",
    missed: "border-correct bg-correct text-white",
  }[state];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={state === "selected"}
      className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors disabled:cursor-default ${styles}`}
    >
      <span
        aria-hidden="true"
        className={`tabular mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-sm font-medium ${badge}`}
      >
        {LETTERS[index] ?? index + 1}
      </span>
      <span className="text-[15px] leading-relaxed">{text}</span>
      {(state === "correct" || state === "missed") && (
        <span className="sr-only">Rätt svar</span>
      )}
      {state === "wrong" && <span className="sr-only">Ditt svar, fel</span>}
    </button>
  );
}
