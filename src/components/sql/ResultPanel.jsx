import ResultTable from "./ResultTable.jsx";

// Fyra utfall: syntaxfel, rätt, kört men fel resultat, och tom mängd
// där något förväntades.
export default function ResultPanel({ result }) {
  if (!result) return null;

  if (result.status === "empty-input") {
    return (
      <p className="rounded-card border border-line bg-white p-4 text-[15px] text-ink/70">
        {result.message}
      </p>
    );
  }

  if (result.status === "error") {
    return (
      <div className="rounded-card border border-wrong/30 bg-wrong-bg p-4">
        <h3 className="font-display text-lg text-wrong">Frågan kunde inte köras</h3>
        {result.raw && (
          <pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-mono text-[13px] text-ink/80">
            {result.raw}
          </pre>
        )}
        {result.message && (
          <p className="mt-2 text-[15px] leading-relaxed">{result.message}</p>
        )}
      </div>
    );
  }

  if (result.status === "correct") {
    return (
      <div className="rounded-card border border-correct/30 bg-correct-bg p-4">
        <h3 className="font-display text-lg text-correct">Rätt.</h3>
        {result.isDml && (
          <p className="mt-1 text-[15px] text-ink/80">
            Databasens tillstånd stämmer. Så här ser det ut efteråt:
          </p>
        )}
        <div className="mt-3">
          <ResultTable
            result={result.userResult}
            caption={result.isDml ? "Efter din sats" : "Ditt resultat"}
          />
        </div>
      </div>
    );
  }

  // Kört, men fel resultat.
  return (
    <div className="rounded-card border border-wrong/30 bg-wrong-bg p-4">
      <h3 className="font-display text-lg text-wrong">Inte riktigt.</h3>
      <p className="mt-1 text-[15px] leading-relaxed">{result.message}</p>
      {result.emptyResult && (
        <p className="mt-1 text-[15px] leading-relaxed">
          Din fråga gav noll rader, medan det förväntade resultatet har rader. En tom
          tabell ser lätt ut som ingenting — kontrollera villkoret i WHERE.
        </p>
      )}
      <div className="mt-3 grid gap-4 lg:grid-cols-2">
        <ResultTable result={result.userResult} caption="Ditt resultat" />
        <ResultTable result={result.expectedResult} caption="Förväntat resultat" />
      </div>
    </div>
  );
}
