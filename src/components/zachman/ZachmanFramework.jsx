import { Fragment, useState } from "react";
import { CELLS, COLUMNS, ROWS } from "../../data/arkitektur/zachman.js";

// Zachmans rutnät att utforska: klicka på en rad, en kolumn eller en cell
// och läs vad den betyder. Används i fliken Zachman och, som visning, på
// modul 4-kortet i Läs (Verksamhetsarkitektur). Sparar inget.
export default function ZachmanFramework({ toEssay = null }) {
  const [selected, setSelected] = useState({ type: "cell", code: "R2K4" });
  const isOn = (type, code) => selected.type === type && selected.code === code;
  return (
    <div className="space-y-5">
      <p className="max-w-reading text-[15px] text-ink/80">
        Klicka på en rad, en kolumn eller en cell. Namnen i cellerna kommer från Zachmans
        översiktsbild (”affischen”) från 2003, som finns i föreläsningsbilderna. Den nyare
        versionen 3.0 har delvis andra namn; de står i rutan under rutnätet.
      </p>
      <div className="card overflow-x-auto p-3 sm:p-4">
        <div className="grid min-w-[20rem] grid-cols-[3.25rem_repeat(6,minmax(0,1fr))] sm:grid-cols-[6rem_repeat(6,minmax(0,1fr))] gap-1 text-center">
          <div />
          {COLUMNS.map((col) => (
            <button
              key={col.code}
              type="button"
              onClick={() => setSelected({ type: "col", code: col.code })}
              aria-pressed={isOn("col", col.code)}
              className={`rounded-md border px-1 py-1.5 text-[12px] leading-tight transition-colors sm:text-[13px] ${isOn("col", col.code) ? "border-pine bg-pine text-paper" : "border-line bg-surface hover:border-pine hover:text-pine"}`}
            >
              <span className="block font-medium">{col.code}</span>
              <span className="block">{col.sv}</span>
              <span className="hidden opacity-75 sm:block">{col.en}</span>
            </button>
          ))}
          {ROWS.map((row) => (
            <Fragment key={row.code}>
              <button
                type="button"
                onClick={() => setSelected({ type: "row", code: row.code })}
                aria-pressed={isOn("row", row.code)}
                className={`rounded-md border px-1 py-1.5 text-[12px] leading-tight transition-colors sm:text-[13px] ${isOn("row", row.code) ? "border-pine bg-pine text-paper" : "border-line bg-surface hover:border-pine hover:text-pine"}`}
              >
                <span className="block font-medium">{row.code}</span>
                <span className="hidden sm:block">{row.perspective || "—"}</span>
              </button>
              {COLUMNS.map((col) => {
                const code = `${row.code}${col.code}`;
                const on = isOn("cell", code) || isOn("row", row.code) || isOn("col", col.code);
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setSelected({ type: "cell", code })}
                    aria-label={`${code}: ${CELLS[code].name}`}
                    aria-pressed={isOn("cell", code)}
                    className={`min-h-[2.75rem] rounded-md border px-1 py-1 text-[11px] leading-tight transition-colors sm:min-h-[3.5rem] sm:text-[12px] ${isOn("cell", code) ? "border-pine bg-pine text-paper" : on ? "border-pine/60 bg-pine/[0.08]" : "border-line hover:border-pine hover:text-pine"}`}
                  >
                    <span className="hidden sm:inline">{CELLS[code].name}</span>
                    <span className="sm:hidden">{code}</span>
                  </button>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
      <Detail selected={selected} />
      {toEssay && (
        <button type="button" className="btn-secondary" onClick={toEssay}>
          Skriv Zachman-essän →
        </button>
      )}
    </div>
  );
}

function Detail({ selected }) {
  if (selected.type === "col") {
    const col = COLUMNS.find((c) => c.code === selected.code);
    return (
      <section className="card p-5" aria-live="polite">
        <p className="text-sm text-ink/65">Kolumn {col.code}</p>
        <h2 className="mt-1 font-display text-xl">{col.sv} · {col.en} / {col.poster}</h2>
        <p className="mt-2 text-[15px] leading-relaxed">{col.about}</p>
        <p className="mt-2 text-[15px] leading-relaxed text-ink/80">
          <span className="font-medium text-ink">Lärarens exempel från universitetet: </span>
          {col.example}
        </p>
      </section>
    );
  }
  if (selected.type === "row") {
    const row = ROWS.find((r) => r.code === selected.code);
    return (
      <section className="card p-5" aria-live="polite">
        <p className="text-sm text-ink/65">Rad {row.code}</p>
        <h2 className="mt-1 font-display text-xl">
          {row.name}{row.perspective ? ` — ${row.perspective}` : ""}
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed">{row.about}</p>
        <dl className="mt-3 grid gap-1 text-[15px] sm:grid-cols-[10rem_1fr]">
          <dt className="text-ink/65">Affischen (2003)</dt>
          <dd>{row.name}{row.perspective ? ` — ${row.perspective}` : ""}</dd>
          <dt className="text-ink/65">Version 3.0</dt>
          <dd>{row.v3} · {row.v3Model}</dd>
        </dl>
      </section>
    );
  }
  const cell = CELLS[selected.code];
  const row = ROWS.find((r) => selected.code.startsWith(r.code));
  const col = COLUMNS.find((c) => selected.code.endsWith(c.code));
  return (
    <section className="card p-5" aria-live="polite">
      <p className="text-sm text-ink/65">
        Cell {selected.code} · {row.name}{row.perspective ? ` (${row.perspective})` : ""} × {col.sv} ({col.en})
      </p>
      <h2 className="mt-1 font-display text-xl">{cell.name}</h2>
      {cell.pair && <p className="mt-2 font-mono text-[14px] text-ink/80">{cell.pair}</p>}
      <p className="mt-2 text-[15px] text-ink/80">
        <span className="text-ink/65">Version 3.0: </span>
        {cell.v3}
      </p>
      <p className="mt-2 text-sm text-ink/65">Varje cell är bara ett exempel på vilken sorts modell som kan användas.</p>
    </section>
  );
}
