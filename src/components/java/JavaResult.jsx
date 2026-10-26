// Rättningen av ett Java-svar (lib/javaCheck.js) i DDL-rättarens stil:
// en domrad, sedan det som stoppar kompilatorn (semikolon, stavfel; visas
// också när reglerna är uppfyllda, och domraden säger då "Rätt i sak, men"),
// sedan de tio reglerna var för sig med läge, text och — för regler som
// inte är uppfyllda eller har en kommentar — skälet bakom. En regel som
// inte gäller visar sin text när den har en (t.ex. "se regel 2").
// Inga poäng: uppgiftens vikt på tentan är inte känd.

const VERDICT = {
  correct: "Rätt.",
  partial: "Delvis rätt.",
  wrong: "Fel.",
  "parse-error": "Svaret går inte att tolka.",
};

const STATE = {
  ok: { mark: "✓", label: "uppfylld", tone: "text-correct" },
  fail: { mark: "✕", label: "inte uppfylld", tone: "text-wrong" },
  note: { mark: "•", label: "kommentar", tone: "text-brass-text" },
  na: { mark: "–", label: "gäller inte", tone: "text-ink/50" },
};

export default function JavaResult({ result, children }) {
  const rules = result.rules || [];
  const errors = result.errors || [];
  const failed = rules.filter((r) => r.status === "fail").length;
  // Reglerna är uppfyllda, men koden kompilerar inte som den står.
  const correctButErrors = result.status === "correct" && errors.length > 0;
  const tone = correctButErrors || result.status === "parse-error"
    ? "border-brass bg-paper"
    : result.status === "correct"
      ? "border-correct bg-correct-bg"
      : "border-wrong bg-wrong-bg";
  const verdict = correctButErrors
    ? "Rätt i sak, men koden kompilerar inte som den står."
    : VERDICT[result.status];

  return (
    <div className={`mt-4 rounded-lg border-l-2 p-4 ${tone}`} role="status">
      <p className="font-display text-lg">{verdict}</p>
      {result.status === "parse-error" ? (
        <>
          <ul className="mt-1 space-y-1 text-[15px]">
            {errors.map((err) => <li key={`${err.line ?? ""}${err.message}`}>{err.message}</li>)}
          </ul>
          <p className="mt-2 text-sm text-ink/70">Rätta felet och rätta igen. Lösningsförslaget visas ändå — jämför med det.</p>
        </>
      ) : (
        <>
          {result.status !== "correct" && (
            <p className="mt-0.5 text-[15px] text-ink/80">
              {failed === 1 ? "En regel är inte uppfylld." : `${failed} regler är inte uppfyllda.`} Jämför med lösningsförslaget.
            </p>
          )}
          {errors.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium">Att rätta innan det kompilerar:</p>
              <ul className="mt-1 space-y-1 text-[15px]">
                {errors.map((err) => <li key={`${err.line ?? ""}${err.message}`}>{err.message}</li>)}
              </ul>
            </div>
          )}
          <ol className="mt-3 space-y-3 text-[15px]" aria-label="Reglerna">
            {rules.map((rule) => {
              const state = STATE[rule.status] || STATE.na;
              const explain = rule.status === "fail" || rule.status === "note";
              return (
                <li key={rule.id} className="flex gap-3">
                  <span aria-hidden="true" className={`w-4 shrink-0 text-center font-semibold leading-6 ${state.tone}`}>{state.mark}</span>
                  <div className={`min-w-0 ${rule.status === "na" ? "text-ink/70" : ""}`}>
                    <p className="leading-6">
                      <span className="font-medium">{rule.id}. {rule.title}</span>
                      <span className="text-sm text-ink/70"> · {state.label}</span>
                    </p>
                    {rule.text && <p className="break-words text-ink/85">{rule.text}</p>}
                    {explain && rule.why && (
                      <p className="mt-1 text-ink/80"><span className="font-medium">Varför:</span> {rule.why}</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </>
      )}
      {children}
    </div>
  );
}
