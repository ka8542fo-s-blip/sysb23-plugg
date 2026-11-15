import { useEffect, useMemo, useRef, useState } from "react";
import { exampleIntro, javaTasks } from "../data/databaser/javaTasks.js";
import { checkJava } from "../lib/javaCheck.js";
import { pickRandomJavaTask } from "../lib/javaPick.js";
import { formatJava } from "../lib/codeIndent.js";
import { FORMAT_KEYS, SUBMIT_KEYS } from "../lib/keys.js";
import SchemaEditor from "../components/model/SchemaEditor.jsx";
import CodeBlock from "../components/java/CodeBlock.jsx";
import InlineText from "../components/java/InlineText.jsx";
import JavaResult from "../components/java/JavaResult.jsx";
import { Highlighted } from "../components/java/highlight.jsx";
import { KEYS, load, save, loadJavaState, saveJavaState, clearJavaState } from "../lib/storage.js";

// Fliken Java i Databaser: tentans Java/JDBC-uppgift, där man skriver en hel
// DAO-metod för hand. Exempeltentans två uppgifter ordagrant och egna
// övningar i samma form (data/databaser/javaTasks.js). Java körs inte i
// webbläsaren: svaret läses och rättas regel för regel (lib/javaCheck.js),
// och lösningsförslaget visas efter rättningen, under resultatet.
// Uppbyggnad som BPMN-övningar: menyn till vänster (ihopfälld till siffror
// från början) står kvar när man rullar, och på bred skärm (xl) står
// uppgiftstexten bredvid svaret och rullar för sig, så att tabellen och
// kraven syns medan man skriver. Svaret har 13 px kod (14 px på dator) så att
// tentans rader ryms. Svar och status sparas per uppgift (sysb23:java:<id>), klar =
// rättaren har sagt Rätt, som i Modellera.

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
const setName = (t) => (t.set === "exempel" ? "Exempeltentan" : "Övning");
const taskLabel = (t) => `${setName(t)} ${t.number}: ${t.title}`;

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
  const [confirmResetAll, setConfirmResetAll] = useState(false);
  // Menyn står ihopfälld till siffror från början, så att uppgiften och
  // svaret får plats bredvid varandra. Valet sparas; det gäller bred skärm.
  const [menu, setMenu] = useState(() => (load(KEYS.javaMenu, "smal") === "full" ? "full" : "smal"));
  const narrowMenu = menu === "smal";
  function toggleMenu() {
    const next = narrowMenu ? "full" : "smal";
    setMenu(next);
    save(KEYS.javaMenu, next);
  }
  const workRef = useRef(null);
  const scrollToWork = useRef(false);

  const task = tasks.find((t) => t.id === currentId) || tasks[0];
  const draft = states[task.id]?.draft ?? "";
  const solved = states[task.id]?.status === "solved";
  const placeholder = useMemo(() => `${signatureOf(task)} {\n}`, [task]);
  const index = tasks.indexOf(task);
  const solvedCount = tasks.filter((t) => states[t.id]?.status === "solved").length;
  const nextTask = tasks[index + 1] || null;

  useEffect(() => save(KEYS.javaTask, task.id), [task.id]);

  useEffect(() => {
    // Uppgiftstexten börjar alltid överst, och efter ett byte längre ned på
    // sidan visas början av den nya uppgiften, under den klistrade headern.
    if (scrollToWork.current && workRef.current) {
      scrollToWork.current = false;
      const header = document.querySelector("header")?.offsetHeight ?? 0;
      const top = workRef.current.getBoundingClientRect().top + window.scrollY - header - 12;
      if (top < window.scrollY) {
        const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
      }
    }
  }, [currentId]);

  // Rättningen hör till uppgiften den gjordes på; den töms i samma
  // rendering som bytet, så att den inte blinkar till under nästa uppgift.
  function open(id) {
    if (!id || id === currentId) return;
    scrollToWork.current = true;
    setResult(null);
    setConfirmReset(false);
    setCurrentId(id);
  }

  function openRandom() {
    open(pickRandomJavaTask(tasks, states, currentId));
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

  // Alla uppgifter på en gång: svar och ✓ Klar, efter bekräftelse.
  function resetAll() {
    for (const t of tasks) clearJavaState(t.id);
    setStates({});
    setResult(null);
    setConfirmResetAll(false);
  }

  const randomButton = (
    <button
      type="button"
      className="btn-secondary px-3 py-1.5 text-sm"
      onClick={openRandom}
      title="En annan uppgift, i första hand en som inte är klar. Övningar markerade som svårare tas inte med."
    >
      Slumpa en uppgift
    </button>
  );

  return (
    <div className="lg:flex lg:gap-6">
      <h1 className="sr-only">Java</h1>
      <div ref={workRef} className="lg:order-2 lg:min-w-0 lg:flex-1">
        {/* Mobilen: menyn står under uppgiften, så slumpknappen och en genväg
            till listan står här. */}
        <div className="mb-4 flex flex-wrap items-center gap-3 lg:hidden">
          <span className="tabular text-sm text-ink/65">{solvedCount} av {tasks.length} klara</span>
          {randomButton}
          <a href="#java-meny" className="text-sm text-pine underline underline-offset-4">Alla uppgifter ↓</a>
        </div>
        {/* Uppgiften överst och svaret under, i en kolumn. */}
        <div>
          <section className="card p-5" aria-labelledby="java-uppgift">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <p className="text-sm text-ink/65">
                {setName(task)} {task.number}
                {solved && <span className="ml-2 text-correct">✓ Klar</span>}
              </p>
              {(solved || draft) && !confirmReset && (
                <button type="button" className="btn-quiet px-0 text-sm" onClick={() => setConfirmReset(true)}>Nollställ uppgiften</button>
              )}
            </div>
            {confirmReset && (
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-ink/70">Ditt svar{solved ? " och ✓ Klar" : ""} tas bort.</span>
                <button type="button" className="btn-secondary" onClick={reset}>Ja, nollställ</button>
                <button type="button" className="btn-quiet" onClick={() => setConfirmReset(false)}>Avbryt</button>
              </div>
            )}
            <h2 id="java-uppgift" className="mt-1 font-display text-xl">{task.title}</h2>
            <p className="mt-0.5 text-xs text-ink/60">{task.source}</p>

            {task.set === "exempel" && (
              <div className="mt-3 rounded-lg border-l-2 border-brass bg-brass/[0.07] p-3 text-sm leading-relaxed">
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
          </section>

          <section className="mt-5 min-w-0" aria-label="Ditt svar och rättningen">
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
              format={formatJava}
              hint={
                <>
                  Tab drar in fyra blanksteg och Shift+Tab drar ut, också på flera markerade rader. Enter
                  behåller indraget och drar in efter "{"{"}" och åtta blanksteg efter "(", som i
                  lösningsförslagen; "{"}"}" och ")" på en tom rad drar ut igen. {FORMAT_KEYS} formaterar
                  indraget i hela svaret, {SUBMIT_KEYS} rättar, Esc lämnar rutan.
                </>
              }
            />

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button type="button" className="btn-primary" onClick={check}>Rätta</button>
              <span className="text-sm text-ink/65">
                Eller {SUBMIT_KEYS} i rutan. Variabelnamnen är fria, och villkoren i WHERE får stå i valfri ordning.
              </span>
            </div>

            {result && (
              <>
                <JavaResult result={result}>
                  {result.status === "correct" && !(result.errors?.length) && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {nextTask && (
                        <button type="button" className="btn-secondary" onClick={() => open(nextTask.id)} title={taskLabel(nextTask)}>
                          Nästa uppgift →
                        </button>
                      )}
                      {randomButton}
                    </div>
                  )}
                </JavaResult>
                <div className="mt-4 min-w-0">
                  <CodeBlock code={task.solution} lang="java" label="Lösningsförslag" />
                </div>
              </>
            )}
          </section>
        </div>
      </div>

      <div className={`mt-6 lg:order-1 lg:mt-0 lg:shrink-0 lg:transition-[width] lg:duration-200 ${narrowMenu ? "lg:w-24" : "lg:w-72"}`}>
        {/* Ihopfälld: siffrorna och slumpknappen, på bred skärm. Mobilen visar
            alltid hela menyn, under uppgiften. */}
        {narrowMenu && (
          <nav
            aria-label="Uppgifter"
            className="card hidden p-2 lg:sticky lg:top-36 lg:block lg:max-h-[calc(100vh-10.5rem)] lg:overflow-y-auto lg:overscroll-contain"
          >
            <button
              type="button"
              onClick={toggleMenu}
              className="flex h-8 w-full items-center justify-center rounded-md text-ink/65 transition-colors duration-150 hover:bg-pine/[0.08] hover:text-pine"
              aria-label="Visa hela menyn"
              title="Visa hela menyn"
            >
              <span aria-hidden="true">»</span>
            </button>
            <p className="tabular mt-1 text-center text-xs text-ink/65" title={`${solvedCount} av ${tasks.length} klara`}>
              {solvedCount}/{tasks.length}
            </p>
            <button
              type="button"
              onClick={openRandom}
              className="mt-2 flex h-9 w-full items-center justify-center rounded-lg border border-line text-xs transition-colors duration-150 hover:border-pine hover:bg-pine/[0.06] hover:text-pine"
              title="Slumpa en uppgift, i första hand en som inte är klar"
            >
              Slumpa
            </button>
            {GROUPS.map((group) => (
              <div key={group.set} className="mt-3">
                <p className="text-center text-[11px] text-ink/60" aria-hidden="true">{group.set === "exempel" ? "Tenta" : "Övning"}</p>
                <ul className="mt-1 grid grid-cols-2 gap-1.5">
                  {tasks.filter((t) => t.set === group.set).map((t) => {
                    const active = t.id === task.id;
                    const done = states[t.id]?.status === "solved";
                    const label = `${taskLabel(t)}${done ? " · klar" : ""}`;
                    return (
                      <li key={t.id}>
                        <button
                          type="button"
                          onClick={() => open(t.id)}
                          aria-current={active ? "true" : undefined}
                          aria-label={label}
                          title={label}
                          className={`tabular flex h-9 w-full items-center justify-center rounded-lg border text-sm transition-colors duration-150 ${
                            active
                              ? "border-pine bg-pine font-medium text-paper"
                              : done
                                ? "border-correct/50 bg-correct-bg text-correct hover:border-correct"
                                : "border-line hover:border-pine hover:bg-pine/[0.06] hover:text-pine"
                          }`}
                        >
                          {t.number}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        )}
        <nav
          id="java-meny"
          aria-label="Uppgifter"
          className={`card scroll-mt-36 p-4 lg:sticky lg:top-36 lg:max-h-[calc(100vh-10.5rem)] lg:overflow-y-auto lg:overscroll-contain ${narrowMenu ? "lg:hidden" : ""}`}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="font-display text-[15px]">Java</p>
            <button
              type="button"
              onClick={toggleMenu}
              className="-mr-1 -mt-1 hidden h-8 w-8 shrink-0 items-center justify-center rounded-md text-ink/65 transition-colors duration-150 hover:bg-pine/[0.08] hover:text-pine lg:flex"
              aria-label="Fäll ihop menyn"
              title="Fäll ihop menyn, så att uppgiften och svaret får mer plats"
            >
              <span aria-hidden="true">«</span>
            </button>
          </div>
          <p className="mt-1 text-sm text-ink/65">
            Tentans Java-fråga: skriv en hel DAO-metod med JDBC. Svaret rättas regel för regel.
          </p>
          <p className="tabular mt-3 text-sm">
            {solvedCount} av {tasks.length} klara · {tasks.length - solvedCount} kvar
          </p>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-line" aria-hidden="true">
            <div className="h-full rounded-full bg-pine" style={{ width: `${(solvedCount / tasks.length) * 100}%` }} />
          </div>

          <div className="mt-4">{randomButton}</div>
          <p className="mt-1.5 text-xs text-ink/65">
            Väljer i första hand en uppgift du inte klarat. Övning 14 (svårare) tas inte med.
          </p>

          {GROUPS.map((group) => {
            const items = tasks.filter((t) => t.set === group.set);
            const done = items.filter((t) => states[t.id]?.status === "solved").length;
            return (
              <section key={group.set} className="mt-4" aria-labelledby={`java-grupp-${group.set}`}>
                <h2 id={`java-grupp-${group.set}`} className="flex items-baseline justify-between gap-2 text-sm font-medium">
                  <span>{group.title}</span>
                  <span className="tabular font-normal text-ink/65">{done}/{items.length}</span>
                </h2>
                <ul className="mt-1 space-y-1">
                  {items.map((t) => {
                    const active = t.id === task.id;
                    const isDone = states[t.id]?.status === "solved";
                    return (
                      <li key={t.id}>
                        <button
                          type="button"
                          onClick={() => open(t.id)}
                          aria-current={active ? "true" : undefined}
                          title={t.title}
                          className={`flex w-full items-baseline gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors duration-150 ${active ? "border-pine bg-pine/[0.08] text-pine" : "border-transparent hover:border-pine hover:bg-pine/[0.06]"}`}
                        >
                          <span className="tabular w-6 shrink-0 text-ink/65">{t.number}</span>
                          <span className="min-w-0 flex-1 truncate">{t.title}</span>
                          {isDone && <span className="shrink-0 text-correct" title="Klar">✓<span className="sr-only"> Klar</span></span>}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}

          <div className="mt-5 border-t border-line pt-3">
            {confirmResetAll ? (
              <div>
                <p className="text-sm text-ink/70">Alla {tasks.length} uppgifternas svar och ✓ Klar tas bort.</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button type="button" className="btn-secondary" onClick={resetAll}>Ja, nollställ alla</button>
                  <button type="button" className="btn-quiet" onClick={() => setConfirmResetAll(false)}>Avbryt</button>
                </div>
              </div>
            ) : (
              <button type="button" className="btn-quiet px-0 text-sm" onClick={() => setConfirmResetAll(true)}>
                Nollställ alla uppgifter
              </button>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
