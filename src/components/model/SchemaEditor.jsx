import { useRef } from "react";

const INDENT = "  ";
const SUBS = ["₁", "₂", "₃", "₄"];
// På Mac heter Alt-tangenten Option (⌥); händelsen är densamma. Ctrl + siffra
// fungerar också, för den som hellre trycker det.
const IS_MAC = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || "");
const MOD_LABEL = IS_MAC ? "⌥ Option" : "Alt";

// Kodruta för relationsscheman: mörk yta, radnummer, Tab gör indrag
// (Shift+Tab tar bort), Enter behåller indraget och drar in efter en rad
// som slutar med "(", och små siffror för CK₁/PK₁/FK₂ sätts in med
// knapparna eller Alt + siffra. Esc lämnar fältet.
export default function SchemaEditor({ id, value, onChange, placeholder, rows = 16, label }) {
  const ref = useRef(null);

  function replaceSelection(insert, cursorOffset = insert.length) {
    const field = ref.current;
    const { selectionStart: start, selectionEnd: end } = field;
    const next = value.slice(0, start) + insert + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      field.focus();
      field.selectionStart = field.selectionEnd = start + cursorOffset;
    });
  }

  function outdent() {
    const field = ref.current;
    const start = field.selectionStart;
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    if (!value.startsWith(INDENT, lineStart)) return;
    onChange(value.slice(0, lineStart) + value.slice(lineStart + INDENT.length));
    requestAnimationFrame(() => {
      field.selectionStart = field.selectionEnd = Math.max(lineStart, start - INDENT.length);
    });
  }

  function onKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      if (event.shiftKey) outdent(); else replaceSelection(INDENT);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const start = event.target.selectionStart;
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const line = value.slice(lineStart, start);
      const current = /^\s*/.exec(line)[0];
      const extra = /\($/.test(line.trim()) ? INDENT : "";
      replaceSelection("\n" + current + extra);
      return;
    }
    if ((event.altKey || event.ctrlKey) && !event.metaKey && /^[0-9]$/.test(event.key)) {
      event.preventDefault();
      replaceSelection("₀₁₂₃₄₅₆₇₈₉"[Number(event.key)]);
      return;
    }
    if (event.key === "Escape") event.target.blur();
  }

  const lineCount = Math.max(rows, value.split("\n").length);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-t-lg border border-b-0 border-ink/60 bg-ink px-3 py-1.5">
        <span className="font-mono text-xs text-paper/60">{label}</span>
        <div className="flex items-center gap-1" role="group" aria-label="Små siffror">
          <span className="mr-1 text-xs text-paper/60">Liten siffra:</span>
          {SUBS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => replaceSelection(c)}
              title={`Sätt in ${c} (${MOD_LABEL} + ${"₁₂₃₄".indexOf(c) + 1})`}
              className="h-7 min-w-7 rounded border border-paper/25 px-1.5 font-mono text-sm text-paper transition-colors duration-150 hover:border-paper hover:bg-paper/15"
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="flex rounded-b-lg border border-ink/60 bg-ink font-mono text-[14px] leading-6">
        <pre aria-hidden="true" className="select-none border-r border-paper/15 px-2 py-3 text-right text-paper/40">
          {Array.from({ length: lineCount }, (_, i) => i + 1).join("\n")}
        </pre>
        <textarea
          id={id}
          ref={ref}
          aria-label={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          rows={rows}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          style={{ tabSize: 2, caretColor: "var(--paper)" }}
          className="min-h-0 w-full resize-y bg-transparent px-3 py-3 font-mono text-[14px] leading-6 text-paper placeholder:text-paper/35 focus:outline-none"
        />
      </div>
      <p className="mt-1 text-xs text-ink/65">Tab gör indrag, Enter behåller det, {MOD_LABEL} + siffra (eller Ctrl + siffra) ger liten siffra, Esc lämnar rutan.</p>
    </div>
  );
}
