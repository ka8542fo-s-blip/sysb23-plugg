import { useEffect, useState } from "react";
import { hospitalSchema } from "../../data/databaser/hospitalSchema.js";
import { tableNotes, columnNotes, keyNotes } from "../../data/databaser/schemaGlossary.js";
import InfoTip from "../InfoTip.jsx";
import ResultTable from "./ResultTable.jsx";

// Tabellerna i kort form, så att alla får plats bredvid uppgiften. Klick på ett
// tabellnamn visar raderna och kolumnförklaringarna. Rutan med ditt svar rörs
// aldrig härifrån. `read(tabell)` ger raderna, `only` begränsar tabellerna och
// visar dem öppna.
export default function SchemaList({ read, only }) {
  const tables = only ? hospitalSchema.filter((table) => only.includes(table.name)) : hospitalSchema;
  const [rows, setRows] = useState({});
  const [open, setOpen] = useState(() => new Set(only ?? []));

  async function fetchRows(name) {
    const result = await read(name);
    setRows((prev) => ({ ...prev, [name]: result }));
  }

  useEffect(() => {
    (only ?? []).forEach(fetchRows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggle(name) {
    const next = new Set(open);
    if (next.has(name)) next.delete(name);
    else {
      next.add(name);
      fetchRows(name);
    }
    setOpen(next);
  }

  return (
    <div>
      <p className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink/65">
        Klicka på en tabell för att se raderna.
        <span className="flex items-center gap-1">
          <span className="font-mono font-semibold text-ink">Fet</span> {keyNotes.PK.term}
          <InfoTip term={keyNotes.PK.term} text={keyNotes.PK.text} />
        </span>
        <span className="flex items-center gap-1">
          → {keyNotes.FK.term}
          <InfoTip term={keyNotes.FK.term} text={keyNotes.FK.text} />
        </span>
      </p>
      <ul className="divide-y divide-line">
        {tables.map((table) => {
          const isOpen = open.has(table.name);
          return (
            <li key={table.name} className="py-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => toggle(table.name)}
                  className="flex min-h-[1.75rem] min-w-0 flex-1 items-center gap-1.5 rounded text-left font-mono text-[14px] font-medium text-pine hover:underline"
                >
                  <span aria-hidden="true" className="w-3 text-[11px] text-ink/65">{isOpen ? "▾" : "▸"}</span>
                  {table.name}
                </button>
                <InfoTip term={table.name} text={tableNotes[table.name]} />
              </div>
              <p className="mt-0.5 pl-[1.125rem] font-mono text-[12.5px] leading-relaxed text-ink/75">
                {table.columns.map((column, index) => (
                  <span key={column.name}>
                    {index > 0 && ", "}
                    <span className={column.pk ? "font-semibold text-ink" : ""}>{column.name}</span>
                    {column.fk && <span className="text-ink/60"> → {column.fk.split(".")[0]}</span>}
                    {isOpen && columnNotes[`${table.name}.${column.name}`] && (
                      <InfoTip term={`${table.name}.${column.name}`} text={columnNotes[`${table.name}.${column.name}`]} className="ml-1 align-middle" />
                    )}
                  </span>
                ))}
              </p>
              {isOpen && rows[table.name] && (
                <div className="mt-2">
                  <ResultTable result={rows[table.name]} compact />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
