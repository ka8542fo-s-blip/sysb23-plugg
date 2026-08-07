import { hospitalSchema } from "../../data/databaser/hospitalSchema.js";
import {
  tableNotes,
  columnNotes,
  keyNotes,
} from "../../data/databaser/schemaGlossary.js";
import InfoTip from "../InfoTip.jsx";

// Tabeller, kolumner, primärnycklar och främmande nycklar. Klick på ett
// tabellnamn klistrar in en SELECT. Frågetecknen förklarar vad kolumnen
// innehåller — inte hur övningen löses.
export default function SchemaPanel({ onPickTable }) {
  return (
    <div>
      <p className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink/65">
        Klicka på ett tabellnamn för att klistra in en SELECT. Frågetecknen
        förklarar innehållet.
        <span className="flex items-center gap-1.5">
          <span className="rounded border border-brass px-1 text-[11px] text-brass">PK</span>
          <InfoTip term={keyNotes.PK.term} text={keyNotes.PK.text} />
        </span>
        <span className="flex items-center gap-1.5">
          <span className="text-[11px]">FK →</span>
          <InfoTip term={keyNotes.FK.term} text={keyNotes.FK.text} />
        </span>
      </p>

      <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(15rem,1fr))]">
        {hospitalSchema.map((table) => (
          <div key={table.name} className="card overflow-hidden">
            <div className="flex items-center gap-2 border-b border-line pr-3">
              <h4 className="min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => onPickTable(`SELECT * FROM ${table.name};`)}
                  title={`Klistra in SELECT * FROM ${table.name};`}
                  className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left font-mono text-[15px] text-pine transition-colors duration-150 hover:bg-pine/[0.06] active:bg-pine/[0.12]"
                >
                  {table.name}
                  <span aria-hidden="true" className="text-sm text-ink/65">
                    SELECT →
                  </span>
                </button>
              </h4>
              <InfoTip term={table.name} text={tableNotes[table.name]} />
            </div>

            <ul className="divide-y divide-line">
              {table.columns.map((column) => (
                <li
                  key={column.name}
                  className="flex flex-wrap items-center gap-x-2 gap-y-1 px-3 py-1.5 font-mono text-[13px]"
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
                  <span className="ml-auto">
                    <InfoTip
                      term={`${table.name}.${column.name}`}
                      text={columnNotes[`${table.name}.${column.name}`]}
                    />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
