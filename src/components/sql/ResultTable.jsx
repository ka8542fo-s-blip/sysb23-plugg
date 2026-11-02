// Resultattabell: hairlines i --line, monospace-värden, zebra i --paper.
// NULL visas som nedtonad kursiv text — aldrig som tom cell.
// compact: tätare rader, för tabeller i hjälpytan.
export default function ResultTable({ result, caption, compact = false }) {
  if (!result) return null;
  const { columns, values } = result;

  return (
    <figure className="min-w-0">
      {caption && (
        <figcaption className={`tabular mb-1 text-ink/70 ${compact ? "text-xs" : "text-sm"}`}>
          {caption} · {values.length} {values.length === 1 ? "rad" : "rader"}
        </figcaption>
      )}
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className={`w-full border-collapse ${compact ? "text-[12.5px]" : "text-[14px]"}`}>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={`${column}-${index}`}
                  scope="col"
                  className={`whitespace-nowrap border-b border-line bg-pine text-left font-medium text-paper ${compact ? "px-2 py-1" : "px-3 py-2"}`}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {values.length === 0 ? (
              <tr>
                <td
                  colSpan={Math.max(columns.length, 1)}
                  className="px-3 py-3 text-ink/65"
                >
                  Inga rader.
                </td>
              </tr>
            ) : (
              values.map((row, rowIndex) => (
                <tr key={rowIndex} className={rowIndex % 2 === 1 ? "bg-paper" : ""}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={`whitespace-nowrap border-t border-line font-mono ${compact ? "px-2 py-0.5" : "px-3 py-1.5"}`}
                    >
                      {cell === null || cell === undefined ? (
                        <span className="italic text-ink/45">NULL</span>
                      ) : (
                        String(cell)
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
