import { hospitalSchema } from "../../data/databaser/hospitalSchema.js";

// Tabeller, kolumner, primärnycklar och främmande nycklar. Klick på ett
// tabellnamn klistrar in en SELECT i redigeraren.
export default function SchemaPanel({ onPickTable }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {hospitalSchema.map((table) => (
        <div key={table.name} className="card overflow-hidden">
          <h4>
            <button
              type="button"
              onClick={() => onPickTable(`SELECT * FROM ${table.name};`)}
              title={`Klistra in SELECT * FROM ${table.name};`}
              className="flex w-full items-center justify-between gap-2 border-b border-line px-3 py-2 text-left font-mono text-[15px] text-pine transition-colors duration-150 hover:bg-pine/[0.06] active:bg-pine/[0.12]"
            >
              {table.name}
              <span aria-hidden="true" className="text-sm text-ink/65">
                SELECT →
              </span>
            </button>
          </h4>
          <ul className="divide-y divide-line">
            {table.columns.map((column) => (
              <li
                key={column.name}
                className="flex flex-wrap items-baseline gap-x-2 px-3 py-1.5 font-mono text-[13px]"
              >
                <span className={column.pk ? "font-medium text-ink" : "text-ink/80"}>
                  {column.name}
                </span>
                {column.pk && (
                  <span className="rounded border border-brass px-1 text-[11px] text-brass">
                    PK
                  </span>
                )}
                {column.fk && (
                  <span className="text-[11px] text-ink/65">FK → {column.fk}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
