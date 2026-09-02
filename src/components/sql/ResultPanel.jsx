import ResultTable from "./ResultTable.jsx";

// Detaljerna under körningen: tabellerna, och råtexten när databasen
// klagade. Själva domslutet står i ResultBanner ovanför knappraden.
export default function ResultPanel({ result }) {
  if (!result || result.status === "empty-input") return null;

  if (result.status === "error") {
    if (!result.raw) return null;
    return (
      <div className="rounded-card border border-wrong/30 bg-wrong-bg p-4">
        <h4 className="font-display text-base text-wrong">Databasens felmeddelande</h4>
        <pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-mono text-[13px] text-ink/80">
          {result.raw}
        </pre>
      </div>
    );
  }

  if (result.status === "correct") {
    return (
      <ResultTable
        result={result.userResult}
        caption={result.isDml ? "Efter din sats" : "Ditt resultat"}
      />
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ResultTable result={result.userResult} caption="Ditt resultat" />
      <ResultTable result={result.expectedResult} caption="Förväntat resultat" />
    </div>
  );
}
