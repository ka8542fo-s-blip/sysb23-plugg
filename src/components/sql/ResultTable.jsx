// Resultattabell: hairlines i --line, monospace-värden, zebra i --paper.
// NULL visas som nedtonad kursiv text — aldrig som tom cell.
export default function ResultTable({ result, caption }) {
  if (!result) return null;
  const { columns, values } = result;

  return (
    <figure className="min-w-0">
      {caption && (
        <figcaption className="tabular mb-1 text-sm text-ink/70">
          {caption} · {values.length} {values.length === 1 ? "rad" : "rader"}
        </figcaption>
      )}
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full border-collapse text-[14px]">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={`${column}-${index}`}
                  scope="col"
                  className="whitespace-nowrap border-b border-line bg-pine px-3 py-2 text-left font-medium text-paper"
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
                      className="whitespace-nowrap border-t border-line px-3 py-1.5 font-mono"
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
