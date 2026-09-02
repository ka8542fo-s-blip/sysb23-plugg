// Domslutet efter en körning: rätt, fel eller kraschad fråga. Ligger
// direkt under knappraden så att svaret syns utan att man skrollar förbi
// tabeller och schemapanel — detaljerna kommer längre ned i ResultPanel.
export default function ResultBanner({ result, onDismiss }) {
  if (!result) return null;

  const tone =
    result.status === "correct"
      ? { box: "border-correct/30 bg-correct-bg", text: "text-correct" }
      : result.status === "empty-input"
        ? { box: "border-line bg-white", text: "text-ink/80" }
        : { box: "border-wrong/30 bg-wrong-bg", text: "text-wrong" };

  const heading =
    result.status === "correct"
      ? "Rätt."
      : result.status === "error"
        ? "Frågan kunde inte köras"
        : result.status === "empty-input"
          ? "Ingen fråga att köra"
          : "Inte riktigt.";

  const detail =
    result.status === "correct"
      ? result.isDml
        ? "Databasens tillstånd stämmer."
        : null
      : result.message;

  return (
    <div className={`flex items-start gap-3 rounded-card border p-4 ${tone.box}`}>
      <div className="min-w-0 flex-1">
        <h3 className={`font-display text-lg ${tone.text}`}>{heading}</h3>
        {detail && <p className="mt-1 text-[15px] leading-relaxed">{detail}</p>}
        {result.emptyResult && (
          <p className="mt-1 text-[15px] leading-relaxed">
            Din fråga gav noll rader, medan det förväntade resultatet har rader. En tom
            tabell ser lätt ut som ingenting — kontrollera villkoret i WHERE.
          </p>
        )}
      </div>
      <button
        type="button"
        className="btn-quiet -mr-2 -mt-1 shrink-0 px-2 text-lg leading-none"
        onClick={onDismiss}
        aria-label="Dölj resultatet"
      >
        ✕
      </button>
    </div>
  );
}
