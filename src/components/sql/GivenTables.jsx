import ResultTable from "./ResultTable.jsx";

// Tentans tabeller med sina rader, som de står i uppgiften.
export default function GivenTables({ tables, note }) {
  return (
    <div className="space-y-3">
      {note && <p className="text-xs text-ink/65">{note}</p>}
      {tables.map((table) => (
        <ResultTable
          key={table.name}
          caption={table.name}
          compact
          result={{ columns: table.columns.map(([name]) => name), values: table.rows }}
        />
      ))}
    </div>
  );
}
