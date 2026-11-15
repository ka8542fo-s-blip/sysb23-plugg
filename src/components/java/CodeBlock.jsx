import { useRef } from "react";
import { Highlighted } from "./highlight.jsx";
import { isSelectAll } from "../../lib/keys.js";

const LANG_NAME = { java: "Java", sql: "SQL" };

// Skrivskyddat kodblock i kodrutans mörka stil: radnummer, syntaxfärgning
// och vågrät rullning i själva koden (radnumren står still). Rullytan går
// att nå med Tab, så att den också kan rullas med tangentbordet. ⌘A
// (Ctrl+A) i blocket markerar bara koden, inte hela sidan, och ett klick på
// radnumren ger blocket fokus.
export default function CodeBlock({ code, lang = "java", label, ariaLabel, className = "" }) {
  const regionRef = useRef(null);
  const codeRef = useRef(null);
  const lineCount = code.split("\n").length;
  const name = ariaLabel || label || `Kod i ${LANG_NAME[lang] || lang}`;

  function onKeyDown(event) {
    if (!isSelectAll(event) || !codeRef.current) return;
    event.preventDefault();
    const range = document.createRange();
    range.selectNodeContents(codeRef.current);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  return (
    <div className={className}>
      {label && (
        <p className="rounded-t-lg border border-b-0 border-code/60 bg-code px-3 py-1.5 font-mono text-xs text-code-ink/60">
          {label}
        </p>
      )}
      <div className={`flex border border-code/60 bg-code font-mono text-[14px] leading-6 ${label ? "rounded-b-lg" : "rounded-lg"}`}>
        <pre
          aria-hidden="true"
          className="m-0 select-none border-r border-code-ink/15 px-2 py-3 text-right font-mono text-code-ink/40"
          onMouseDown={(event) => {
            event.preventDefault();
            regionRef.current?.focus();
          }}
        >
          {Array.from({ length: lineCount }, (_, i) => i + 1).join("\n")}
        </pre>
        <div
          ref={regionRef}
          role="region"
          aria-label={name}
          tabIndex={0}
          onKeyDown={onKeyDown}
          className="min-w-0 flex-1 overflow-x-auto rounded-r-lg"
        >
          <pre className="m-0 w-max min-w-full px-3 py-3 font-mono text-code-ink">
            <code ref={codeRef}><Highlighted code={code} lang={lang} /></code>
          </pre>
        </div>
      </div>
    </div>
  );
}
