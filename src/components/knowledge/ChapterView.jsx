import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { topicLookup } from "../../lib/topicLookup.js";
import { useReadAloud, ttsSupported, TTS_RATES } from "../../lib/useReadAloud.js";
import InfoTip from "../InfoTip.jsx";
import { ExamAreaTag } from "./ChapterList.jsx";

function RateSelect({ tts, compact = false }) {
  return (
    <label className="flex items-center gap-1.5 text-sm text-ink/65">
      {!compact && "Hastighet"}
      <select
        value={tts.rate}
        onChange={(event) => tts.setRate(Number(event.target.value))}
        aria-label="Uppläsningshastighet"
        className="rounded-lg border border-line bg-white px-2 py-1.5 text-sm"
      >
        {TTS_RATES.map((rate) => (
          <option key={rate} value={rate}>
            {String(rate).replace(".", ",")}×
          </option>
        ))}
      </select>
    </label>
  );
}

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^\wåäö\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function headingsIn(markdown) {
  const found = [];
  for (const line of (markdown || "").split("\n")) {
    const match = /^(#{2,3})\s+(.*)$/.exec(line.trim());
    if (match) {
      found.push({
        level: match[1].length,
        text: match[2].replace(/[*_`]/g, "").trim(),
      });
    }
  }
  return found.map((heading) => ({ ...heading, id: slugify(heading.text) }));
}

const markdownComponents = {
  h2: ({ children }) => (
    <h2
      id={slugify(String(children))}
      className="mt-9 scroll-mt-44 font-display text-2xl"
    >
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 id={slugify(String(children))} className="mt-7 scroll-mt-44 font-display text-xl">
      {children}
    </h3>
  ),
  p: ({ children }) => <p className="mt-4">{children}</p>,
  strong: ({ children }) => (
    <strong className="font-semibold text-pine">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => <ul className="mt-4 space-y-2 pl-5">{children}</ul>,
  ol: ({ children }) => <ol className="mt-4 list-decimal space-y-2 pl-6">{children}</ol>,
  li: ({ children }) => <li className="marker:text-brass">{children}</li>,
  // Blockquote blir definitionsruta.
  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-[3px] border-pine bg-white py-1 pl-5 pr-4 text-ink">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-[15px]">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-line bg-white p-2.5 text-left font-medium">{children}</th>
  ),
  td: ({ children }) => <td className="border border-line p-2.5 align-top">{children}</td>,
  code: ({ children }) => (
    <code className="rounded bg-white px-1.5 py-0.5 text-[0.95em]">{children}</code>
  ),
  // Kapitel med DDL-exempel behöver riktiga kodblock, inte brödtext.
  pre: ({ children }) => (
    <pre className="my-5 overflow-x-auto rounded-lg border border-line bg-white p-3 font-mono text-[13px] leading-relaxed">
      {children}
    </pre>
  ),
  hr: () => <hr className="my-8 border-line" />,
  a: ({ href, children }) => (
    <a href={href} className="text-pine underline underline-offset-4">
      {children}
    </a>
  ),
};

export default function ChapterView({
  chapter,
  number,
  total,
  course,
  isRead,
  onToggleRead,
  onOpenTopic,
  onPractice,
  canPractice = true,
  onBack,
  onPrev,
  onNext,
}) {
  const lookup = topicLookup(course.topics);
  const [progress, setProgress] = useState(0);
  const [tocOpen, setTocOpen] = useState(false);
  const headings = useMemo(() => headingsIn(chapter.body), [chapter.body]);

  const readColumnRef = useRef(null);
  const tts = useReadAloud(readColumnRef);
  const ttsStop = tts.stop;
  // Byter man kapitel ska inte förra kapitlets röst fortsätta.
  useEffect(() => ttsStop, [chapter.id, ttsStop]);

  // sources är en lista i datat, men kan vara en sträng i äldre delkurser.
  const sources = Array.isArray(chapter.sources)
    ? chapter.sources.join(" · ")
    : chapter.sources;

  const keyPointGroups = lookup.keyPointsFor(chapter.primaryTopics);
  const pitfallGroups = lookup.pitfallsFor(chapter.primaryTopics);
  const severalPrimary = keyPointGroups.length > 1;

  useEffect(() => {
    function onScroll() {
      const article = document.getElementById("kapiteltext");
      if (!article) return;
      const start = article.offsetTop;
      const height = article.offsetHeight - window.innerHeight;
      if (height <= 0) {
        setProgress(100);
        return;
      }
      const passed = ((window.scrollY - start) / height) * 100;
      setProgress(Math.min(100, Math.max(0, passed)));
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [chapter.id]);

  useEffect(() => {
    function onKeyDown(event) {
      const tag = event.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const key = event.key.toLowerCase();
      if (key === "j") {
        event.preventDefault();
        window.scrollBy({ top: 160 });
      } else if (key === "k") {
        event.preventDefault();
        window.scrollBy({ top: -160 });
      } else if (key === "n") {
        event.preventDefault();
        onNext();
      } else if (key === "p") {
        event.preventDefault();
        onPrev();
      } else if (event.key === "Escape") {
        event.preventDefault();
        onBack();
      } else if (event.key === " " && tts.status !== "idle") {
        // Mellanslag pausar/återupptar uppläsningen — men bara när den är
        // igång (annars ska mellanslag scrolla som vanligt), och inte när
        // fokus står på en knapp (då är mellanslag knapptryck).
        if (tag === "BUTTON") return;
        event.preventDefault();
        tts.toggle();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onNext, onPrev, onBack, tts.status, tts.toggle]);

  return (
    <div>
      {/* Läsprogress, alltid överst i fönstret */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 right-0 top-0 z-30 h-[3px] bg-transparent"
      >
        <div
          className="h-full bg-brass transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      <button type="button" className="btn-quiet -ml-2" onClick={onBack}>
        ← Innehållsförteckning
      </button>

      <div className="mt-4 lg:mx-auto lg:flex lg:max-w-5xl lg:gap-10">
        <div ref={readColumnRef} className="min-w-0 flex-1">
          <header>
            <p className="tabular text-[11px] font-medium uppercase tracking-[0.14em] text-brass">
              Kapitel {number} av {total}
            </p>
            <h1 className="mt-1 font-display text-3xl leading-tight sm:text-4xl">
              {chapter.title}
            </h1>
            {chapter.lead && (
              <p className="mt-3 max-w-reading text-[17px] leading-relaxed text-ink/80">
                {chapter.lead}
              </p>
            )}
            <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1" data-tts-skip>
              <span className="tabular text-sm text-ink/65">
                {chapter.readingMinutes} min läsning
                {sources ? ` · ${sources}` : ""}
              </span>
              <ExamAreaTag
                area={"examArea" in chapter ? chapter.examArea : undefined}
              />
            </p>

            {ttsSupported() && tts.status === "idle" && (
              <div className="mt-4 flex flex-wrap items-center gap-2" data-tts-skip>
                <button type="button" className="btn-secondary" onClick={tts.play}>
                  ▶ Lyssna på kapitlet
                </button>
                <RateSelect tts={tts} />
                {tts.voices.length > 1 && (
                  <label className="flex items-center gap-1.5 text-sm text-ink/65">
                    Röst
                    <select
                      value={tts.voice?.name || ""}
                      onChange={(event) => tts.setVoice(event.target.value)}
                      className="max-w-56 rounded-lg border border-line bg-white px-2 py-1.5 text-sm"
                    >
                      {tts.voices.map((voice) => (
                        <option key={voice.name} value={voice.name}>
                          {voice.name}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                <InfoTip
                  term="Naturligare röst"
                  text="Rösterna kommer gratis från din webbläsare och ditt system. Naturligast idag: Microsoft Edge har neurala svenska röster inbyggda. På macOS och iOS kan du ladda ner en förbättrad svensk röst under Inställningar → Hjälpmedel → Uppläst innehåll → Systemröst/Röster — starta sedan om webbläsaren så dyker den upp i röstvalet här och väljs automatiskt. Uppläsningen sker helt lokalt, inget skickas någonstans."
                />
                {tts.noSwedishVoice && (
                  <span className="text-sm text-ink/65">
                    Ingen svensk röst hittades i webbläsaren — uttalet kan bli fel.
                  </span>
                )}
              </div>
            )}

            {chapter.topics?.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2" data-tts-skip>
                <span className="text-sm text-ink/65">Ämnen i kapitlet:</span>
                {chapter.topics.map((topicId) => (
                  <button
                    key={topicId}
                    type="button"
                    className="chip"
                    onClick={() => onOpenTopic(topicId)}
                  >
                    {lookup.nameFor(topicId)}
                  </button>
                ))}
              </div>
            )}
          </header>

          {/* "I detta kapitel" — utfällbar på mobil, kolumn på desktop */}
          {headings.length > 0 && (
            <div className="mt-6 lg:hidden" data-tts-skip>
              <button
                type="button"
                className="btn-secondary w-full"
                aria-expanded={tocOpen}
                onClick={() => setTocOpen(!tocOpen)}
              >
                {tocOpen ? "Dölj innehållet" : "I detta kapitel"}
              </button>
              {tocOpen && (
                <ul className="card mt-2 space-y-1 p-4">
                  {headings.map((heading) => (
                    <li key={heading.id} className={heading.level === 3 ? "pl-4" : ""}>
                      <a
                        href={`#${heading.id}`}
                        onClick={() => setTocOpen(false)}
                        className="block py-1 text-[15px] text-ink/80 hover:text-pine"
                      >
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <article
            id="kapiteltext"
            className="mt-8 max-w-[68ch] text-[17px] leading-[1.7] sm:text-[18px]"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {chapter.body}
            </ReactMarkdown>
          </article>

          {keyPointGroups.length > 0 && (
            <section className="mt-10 rounded-card border border-correct/30 bg-correct-bg p-5">
              <h2 className="font-display text-xl text-correct">Kärnan i korthet</h2>
              {keyPointGroups.map((group) => (
                <div key={group.topicId} className="mt-4 first:mt-3">
                  {severalPrimary && (
                    <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-brass">
                      {group.name}
                    </p>
                  )}
                  <ul className="mt-2 space-y-2">
                    {group.items.map((point, i) => (
                      <li key={i} className="flex gap-3 text-[15px] leading-relaxed">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-correct"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {pitfallGroups.length > 0 && (
            <section className="mt-5 rounded-card border border-wrong/30 bg-wrong-bg p-5">
              <h2 className="font-display text-xl text-wrong">Se upp för</h2>
              {pitfallGroups.map((group) => (
                <div key={group.topicId} className="mt-4 first:mt-3">
                  {pitfallGroups.length > 1 && (
                    <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-brass">
                      {group.name}
                    </p>
                  )}
                  <ul className="mt-2 space-y-2">
                    {group.items.map((pitfall, i) => (
                      <li key={i} className="text-[15px] leading-relaxed">
                        {pitfall}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-line pt-5">
            <button
              type="button"
              className={isRead ? "btn-secondary" : "btn-primary"}
              onClick={() => onToggleRead(chapter.id, !isRead)}
              aria-pressed={isRead}
            >
              {isRead ? "✓ Läst — markera som oläst" : "Markera som läst"}
            </button>
            {canPractice && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => onPractice(chapter.topics)}
              >
                Öva på detta kapitel
              </button>
            )}
          </div>

          <div className="mt-4 flex flex-wrap justify-between gap-3">
            <button
              type="button"
              className="btn-secondary"
              onClick={onPrev}
              disabled={number === 1}
            >
              ← Föregående kapitel
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={onNext}
              disabled={number === total}
            >
              Nästa kapitel →
            </button>
          </div>

          <p className="mt-4 text-sm text-ink/65" data-tts-skip>
            Tangentbord: J/K scrollar, N/P byter kapitel, Esc tar dig tillbaka till
            innehållsförteckningen. Mellanslag pausar uppläsningen.
          </p>
        </div>

        {/* Flytande uppläsningskontroller — följer med när man skrollar. */}
        {tts.status !== "idle" && (
          <div className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border border-line bg-white py-2 pl-3 pr-4 shadow-lg">
            <button
              type="button"
              className="btn-secondary px-3 py-1.5 text-sm"
              onClick={tts.toggle}
            >
              {tts.status === "playing" ? "❚❚ Pausa" : "▶ Fortsätt"}
            </button>
            <button
              type="button"
              className="btn-secondary px-3 py-1.5 text-sm"
              onClick={tts.stop}
            >
              ◼ Stoppa
            </button>
            <RateSelect tts={tts} compact />
            <span className="hidden text-xs text-ink/65 sm:inline">
              mellanslag pausar · klicka på ett stycke för att hoppa dit
            </span>
          </div>
        )}

        {headings.length > 0 && (
          <nav
            aria-label="I detta kapitel"
            className="hidden w-56 shrink-0 lg:block"
          >
            <div className="sticky top-44">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-brass">
                I detta kapitel
              </p>
              <ul className="mt-2 space-y-1 border-l border-line pl-3">
                {headings.map((heading) => (
                  <li key={heading.id} className={heading.level === 3 ? "pl-3" : ""}>
                    <a
                      href={`#${heading.id}`}
                      className="block py-1 text-sm text-ink/70 hover:text-pine"
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}
