import { useEffect, useMemo, useRef, useState } from "react";
import { exampleIntro, javaTasks } from "../data/databaser/javaTasks.js";
import { checkJava } from "../lib/javaCheck.js";
import SchemaEditor, { SUBMIT_KEYS } from "../components/model/SchemaEditor.jsx";
import CodeBlock from "../components/java/CodeBlock.jsx";
import InlineText from "../components/java/InlineText.jsx";
import JavaResult from "../components/java/JavaResult.jsx";
import { Highlighted } from "../components/java/highlight.jsx";
import { KEYS, load, save, loadJavaState, saveJavaState, clearJavaState } from "../lib/storage.js";

// Fliken Java i Databaser: tentans Java/JDBC-uppgift, där man skriver en hel
// DAO-metod för hand. Exempeltentans två uppgifter ordagrant och egna
// övningar i samma form (data/databaser/javaTasks.js). Java körs inte i
// webbläsaren: svaret läses och rättas regel för regel (lib/javaCheck.js),
// och lösningsförslaget visas efter rättningen direkt under svaret. Bredvid
// blev kolumnerna för smala för tentans rader (cirka 45 av 76 tecken syntes
// även vid 1600 px, eftersom sidan har en maxbredd). Inga poäng —
// uppgiftens vikt på tentan är okänd. Svar och status sparas per uppgift
// (sysb23:java:<id>), klar = rättaren har sagt Rätt, som i Modellera.

const GROUPS = [
  { set: "exempel", title: "Exempeltentan" },
  { set: "ovning", title: "Övning" },
];

// Indrag som i lösningsförslagen: fyra blanksteg efter "{", åtta efter "(".
const JAVA_INDENT = { "{": 1, "(": 2 };
const highlightJava = (text) => <Highlighted code={text} lang="java" />;

// Signaturen som den står i uppgiften (kodblocket utan klass), annars byggd ur check.
function signatureOf(task) {
  const block = task.blocks.find((b) => b.code && b.lang === "java" && !/\bclass\b/.test(b.code));
  if (block) return block.code;
  const m = task.check.method;
  return `public ${m.returns} ${m.name}(${m.params.map(([type, name]) => `${type} ${name}`).join(", ")}) throws SQLException`;
}

// Tillgängligt namn för ett givet kodblock, så att tabellen, klasserna och
// signaturen skiljs åt i landmärkes- och tabbnavigering.
function codeBlockName(code) {
  let m;
  if ((m = code.match(/CREATE TABLE\s+(\w+)/i))) return `Tabellen ${m[1]}`;
  if ((m = code.match(/\bclass\s+(\w+)/))) return `Klassen ${m[1]}`;
  if ((m = code.match(/(\w+)\s*\(/))) return `Signaturen för ${m[1]}`;
  return undefined;
}

function grade(code, task) {
  try {
    return checkJava(code, task);
  } catch {
    return {
      status: "parse-error",
      rules: [],
      errors: [{ message: "Svaret kunde inte läsas. Kontrollera att metoden är hel, med signaturen först och klamrarna parvis." }],
    };
  }
}

export default function JavaWorkshop() {
  const tasks = javaTasks;
  const [states, setStates] = useState(() => loadJavaState(tasks.map((t) => t.id)));
  const [currentId, setCurrentId] = useState(() => {
    const saved = load(KEYS.javaTask, null);
    if (tasks.some((t) => t.id === saved)) return saved;
    return tasks.find((t) => states[t.id]?.status !== "solved")?.id || tasks[0].id;
  });
  const [result, setResult] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const cardRef = useRef(null);
  const scrollToCard = useRef(false);

  const task = tasks.find((t) => t.id === currentId) || tasks[0];
  const draft = states[task.id]?.draft ?? "";
  const solved = states[task.id]?.status === "solved";
  const placeholder = useMemo(() => `${signatureOf(task)} {\n}`, [task]);
  const index = tasks.indexOf(task);
  const nextTask = tasks[index + 1] || null;
  const solvedCount = tasks.filter((t) => states[t.id]?.status === "solved").length;

  useEffect(() => save(KEYS.javaTask, task.id), [task.id]);

  useEffect(() => {
    // Efter ett val i menyn (under uppgiften på mobil) eller "Nästa uppgift"
    // står man nedanför uppgiften; visa början av den, under den klistrade headern.
    if (scrollToCard.current && cardRef.current) {
      scrollToCard.current = false;
      const header = document.querySelector("header")?.offsetHeight ?? 0;
      const top = cardRef.current.getBoundingClientRect().top + window.scrollY - header - 12;
      if (top < window.scrollY) {
        const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
      }
    }
  }, [currentId]);

  // Rättningen hör till uppgiften den gjordes på; den töms i samma
  // rendering som bytet, så att den inte blinkar till under nästa uppgift.
  function open(id) {
    if (id === currentId) return;
    scrollToCard.current = true;
    setResult(null);
    setConfirmReset(false);
    setCurrentId(id);
  }

  // Svaret och statusen sparas vid varje ändring; klar behålls när svaret ändras.
  function update(id, patch) {
    setStates((prev) => {
      const nextState = { draft: "", status: null, ...prev[id], ...patch };
      saveJavaState(id, nextState);
      const next = { ...prev };
      if (!nextState.draft && nextState.status !== "solved") delete next[id];
      else next[id] = nextState;
      return next;
    });
  }

  function check() {
    const outcome = grade(draft, task);
    setResult(outcome);
    // Klar kräver också att koden går att kompilera som den står.
    const clean = outcome.status === "correct" && !(outcome.errors?.length);
    if (clean && !solved) update(task.id, { status: "solved" });
  }

  function reset() {
    clearJavaState(task.id);
    setStates((prev) => {
      const next = { ...prev };
      delete next[task.id];
      return next;
    });
    setResult(null);
    setConfirmReset(false);
  }

  return (
    <div className="space-y-6">
      <section>
        <h1 className="font-display text-2xl">Java</h1>
        <p className="mt-1 max-w-reading text-[15px] text-ink/70">
          Tentans Java-fråga: du skriver en hel metod i en DAO-klass för hand, med JDBC. Exempeltentans två
          uppgifter står här ordagrant, och övningarna är egna, i samma form. Java körs inte i webbläsaren —
          svaret läses och rättas regel för regel, med skälet bakom varje regel. Poäng visas inte, eftersom
          uppgiftens vikt på tentan inte är känd.
        </p>
        <p className="tabular mt-2 text-[15px] text-ink/65">
          {solvedCount} av {tasks.length} uppgifter klara
        </p>
      </section>

      <div className="lg:flex lg:gap-8">
        <div className="lg:order-2 lg:min-w-0 lg:flex-1">
          <section ref={cardRef} className="card p-5" aria-labelledby="java-uppgift">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm text-ink/65">
                Uppgift {task.number} · {task.source}
                {solved && <span className="ml-2 text-correct">✓ Klar</span>}
              </p>
              {(solved || draft) && !confirmReset && (
                <button type="button" className="btn-quiet text-sm" onClick={() => setConfirmReset(true)}>Nollställ uppgiften</button>
              )}
              {confirmReset && (
                <span className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-ink/70">Ditt svar{solved ? " och ✓ Klar" : ""} tas bort.</span>
                  <button type="button" className="btn-secondary" onClick={reset}>Ja, nollställ</button>
                  <button type="button" className="btn-quiet" onClick={() => setConfirmReset(false)}>Avbryt</button>
                </span>
              )}
            </div>
            <h2 id="java-uppgift" className="mt-1 font-display text-xl">{task.title}</h2>

            {task.set === "exempel" && (
              <div className="mt-3 max-w-reading rounded-lg border-l-2 border-brass bg-brass/[0.07] p-4 text-[15px] leading-relaxed">
                <p className="font-medium">Om denna exempeltentamen</p>
                <p className="mt-1 text-ink/80">{exampleIntro}</p>
              </div>
            )}

            <div className="mt-4 max-w-reading space-y-3 text-[15px] leading-relaxed">
              {task.blocks.map((block, i) =>
                block.code ? (
                  <CodeBlock key={i} code={block.code} lang={block.lang} ariaLabel={codeBlockName(block.code)} />
                ) : (
                  <p key={i}><InlineText text={block.p} /></p>
                ),
              )}
            </div>

            {/* Lösningsförslaget står direkt under svaret, i full bredd, så att
                tentans långa rader syns hela i båda rutorna. */}
            <div className="mt-5 grid gap-4">
              <div className="min-w-0">
                <SchemaEditor
                  id="java-svar"
                  label="Ditt svar"
                  value={draft}
                  onChange={(text) => update(task.id, { draft: text })}
                  placeholder={placeholder}
                  rows={18}
                  subscripts={false}
                  indentWidth={4}
                  indentAfter={JAVA_INDENT}
                  smartIndent
                  highlight={highlightJava}
                  onSubmit={check}
                  hint={
                    <>
                      Tab drar in fyra blanksteg och Shift+Tab drar ut, också på flera markerade rader. Enter
                      behåller indraget och drar in efter "{"{"}" och åtta blanksteg efter "(", som i
                      lösningsförslagen; "{"}"}" och ")" på en tom rad drar ut igen. {SUBMIT_KEYS} rättar, Esc
                      lämnar rutan.
                    </>
                  }
                />
                <p className="mt-1 text-xs text-ink/65">
                  Rättas regel för regel: variabelnamnen är fria, SQL-strängen får delas på flera rader och sluta
                  med eller utan semikolon, och villkoren i WHERE får stå i valfri ordning.
                </p>
              </div>
              {result && (
                <div className="min-w-0">
                  <CodeBlock code={task.solution} lang="java" label="Lösningsförslag" />
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button type="button" className="btn-primary" onClick={check}>Rätta</button>
              <span className="text-sm text-ink/65">
                Eller {SUBMIT_KEYS} i rutan. Lösningsförslaget visas efter rättningen, under ditt svar.
              </span>
            </div>

            {result && (
              <JavaResult result={result}>
                {nextTask && result.status === "correct" && !(result.errors?.length) && (
                  <button
                    type="button"
                    className="btn-secondary mt-4"
                    onClick={() => open(nextTask.id)}
                    title={`${nextTask.set === "exempel" ? "Exempeltentan" : "Övning"} ${nextTask.number}: ${nextTask.title}`}
                  >
                    Nästa uppgift →
                  </button>
                )}
              </JavaResult>
            )}
          </section>
        </div>

        <div className="mt-6 lg:order-1 lg:mt-0 lg:w-72 lg:shrink-0">
          <nav aria-label="Uppgifter" className="card p-4">
            {GROUPS.map((group) => {
              const items = tasks.filter((t) => t.set === group.set);
              const done = items.filter((t) => states[t.id]?.status === "solved").length;
              return (
                <section key={group.set} className="mt-5 first:mt-0" aria-labelledby={`java-grupp-${group.set}`}>
                  <h3 id={`java-grupp-${group.set}`} className="font-display text-[15px]">
                    {group.title}{" "}
                    <span className="tabular ml-1 font-sans text-sm font-normal text-ink/65">{done} av {items.length}</span>
                  </h3>
                  <ul className="mt-2 space-y-1">
                    {items.map((t) => {
                      const active = t.id === task.id;
                      const done = states[t.id]?.status === "solved";
                      return (
                        <li key={t.id}>
                          <button
                            type="button"
                            onClick={() => open(t.id)}
                            aria-current={active ? "true" : undefined}
                            className={`flex w-full items-baseline gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors duration-150 ${active ? "border-pine bg-pine/[0.08] text-pine" : "border-transparent hover:border-pine hover:bg-pine/[0.06]"}`}
                          >
                            <span className="tabular w-5 shrink-0 text-ink/65">{t.number}</span>
                            <span className="min-w-0 flex-1 leading-snug">{t.title}</span>
                            {done && <span className="shrink-0 text-correct" title="Klar">✓<span className="sr-only"> Klar</span></span>}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
