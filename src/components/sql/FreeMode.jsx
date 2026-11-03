import { useEffect, useRef, useState } from "react";
import { checkFreeQuery, interpretError, splitStatements } from "../../lib/sqlCheck.js";
import { loadEngine, newDatabase, runSelect } from "../../lib/sqlEngine.js";
import { loadDraft, saveDraft } from "../../lib/storage.js";
import { toSqlite } from "../../lib/tsql.js";
import { useWide } from "../../lib/useWide.js";
import FormatButton from "./FormatButton.jsx";
import HelpRail from "./HelpRail.jsx";
import ResultTable from "./ResultTable.jsx";
import SchemaList from "./SchemaList.jsx";
import SqlEditor from "./SqlEditor.jsx";

const DRAFT = "sql-fritt";

// Fritt läge: egen databas som behåller ändringar mellan körningar, så att en
// DELETE syns tills man trycker Återställ. Frågan sparas (svar:sql-fritt).
export default function FreeMode() {
  const [code, setCodeState] = useState(() => loadDraft(DRAFT) ?? "SELECT * FROM Employee;");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);
  const [schemaKey, setSchemaKey] = useState(0);
  const editorRef = useRef(null);
  const db = useRef(null);
  const wide = useWide();

  const setCode = (text) => {
    setCodeState(text);
    saveDraft(DRAFT, text);
  };

  useEffect(() => {
    return () => {
      db.current?.close?.();
      db.current = null;
    };
  }, []);

  async function database() {
    await loadEngine();
    if (!db.current) db.current = await newDatabase();
    return db.current;
  }

  async function run() {
    setError(null);
    setWarning(null);
    const sql = code.trim();
    if (!sql) return;
    const prepared = toSqlite(sql);
    try {
      const current = await database();
      // Mot databasen som den är före frågan. Det SQL Server skulle stoppa blir
      // en varning; bara det övningsmotorn inte kan köra stoppas.
      const check = checkFreeQuery(code, (query) => runSelect(current, query));
      if (check.error) {
        setResult(null);
        setError({ raw: check.error.raw, message: check.error.message });
        return;
      }
      const statements = splitStatements(sql);
      let shown = null;
      if (statements.length === 1 && /^\s*(select|with)\b/i.test(sql)) {
        shown = runSelect(current, prepared);
      } else {
        const results = current.exec(prepared);
        const last = results[results.length - 1];
        if (last) shown = { columns: last.columns, values: last.values };
      }
      setResult({ table: shown, changed: shown ? null : current.getRowsModified() });
      setWarning(check.warning);
      setSchemaKey((key) => key + 1);
    } catch (failure) {
      setResult(null);
      setError({ raw: failure.message, message: interpretError(failure.message, sql) });
    }
  }

  async function resetDatabase() {
    db.current?.close?.();
    db.current = await newDatabase();
    setResult(null);
    setError(null);
    setWarning(null);
    setSchemaKey((key) => key + 1);
  }

  const rail = (
    <HelpRail
      tabs={[{
        id: "tabeller",
        label: "Tabeller",
        content: <SchemaList key={schemaKey} read={async (name) => runSelect(await database(), `SELECT * FROM ${name};`)} />,
      }]}
      value="tabeller"
      onChange={() => {}}
      wide={wide}
    />
  );

  return (
    <div className={wide ? "grid grid-cols-[minmax(0,1fr)_24rem] items-start gap-6" : ""}>
      <div className="min-w-0 space-y-4">
        <section className="card p-5 sm:p-6">
          <h2 className="font-display text-xl">Fritt läge</h2>
          <p className="mt-1 text-[15px] text-ink/70">
            Kör vad du vill mot databasen. Ingen rättning. Ändringar ligger kvar tills du återställer.
          </p>

          {!wide && <div className="mt-3">{rail}</div>}

          <div className="mt-4">
            <SqlEditor ref={editorRef} value={code} onChange={setCode} onRun={run} rows={8} label="Fri fråga" />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button type="button" className="btn-quiet px-2 py-1 text-sm" onClick={() => setCode("")}>Rensa</button>
            <button type="button" className="btn-quiet px-2 py-1 text-sm" onClick={resetDatabase}>Återställ databasen</button>
            <span className="ml-auto flex flex-wrap items-center gap-2">
              <FormatButton editorRef={editorRef} disabled={!code.trim()} />
              <button type="button" className="btn-emphasis" onClick={run}>Kör ▸</button>
            </span>
          </div>

          {error && (
            <div className="mt-4 rounded-card border border-wrong/30 bg-wrong-bg p-4">
              <h3 className="font-display text-lg text-wrong">Frågan kunde inte köras</h3>
              <pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-mono text-[13px] text-ink/80">{error.raw}</pre>
              {error.message && <p className="mt-2 text-[15px] leading-relaxed">{error.message}</p>}
            </div>
          )}

          {/* Det här läget rättas inte, så frågan körs ändå: varna för det SQL
              Server skulle ha stoppat, och visa vad SQLite gav. */}
          {warning && (
            <div className="mt-4 rounded-card border border-brass/50 bg-brass/[0.07] p-4">
              <h3 className="font-display text-lg text-brass-text">Skulle inte gå att köra i SQL Server</h3>
              <p className="mt-1 text-[15px] leading-relaxed">{warning.message}</p>
              <pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-mono text-[13px] text-ink/80">{warning.raw}</pre>
            </div>
          )}

          {result && (
            <div className="mt-4">
              {result.table ? (
                <ResultTable result={result.table} caption="Resultat" />
              ) : (
                <p className="rounded-card border border-line bg-surface p-4 text-[15px]">
                  Satsen kördes.{" "}
                  {result.changed > 0
                    ? `${result.changed} ${result.changed === 1 ? "rad" : "rader"} ändrades.`
                    : "Inga rader returnerades."}
                </p>
              )}
            </div>
          )}
        </section>

        <p className="text-sm leading-relaxed text-ink/65">
          Du skriver SQL Server-dialekten (T-SQL) precis som i kursen. Motorn under huven
          är SQLite i webbläsaren, och det du skriver översätts innan det körs — kursens
          SQL fungerar som i SQL Server, men enstaka exotiska funktioner kan saknas. Tre
          skillnader som verkstaden inte kan dölja: AVG över en INTEGER-kolumn ger decimaler
          här men ett heltal i SQL Server (snittet av 7 och 8 är 7 på tentan), TOP n körs
          som LIMIT n, och + mellan texter körs som ||.
        </p>
      </div>
      {wide && rail}
    </div>
  );
}
