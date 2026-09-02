import { forwardRef } from "react";

const INDENT = "  ";

// Vanlig textarea med monospace — ingen kodredigerare behövs för detta.
// Tab skriver indrag i stället för att flytta fokus; Esc lämnar fältet så
// att tangentbordsnavigering fortfarande går att ta sig vidare med.
const SqlEditor = forwardRef(function SqlEditor(
  { value, onChange, onRun, label = "Din fråga", disabled, rows = 6 },
  ref,
) {
  function indent(field) {
    const { selectionStart: start, selectionEnd: end } = field;
    const next = value.slice(0, start) + INDENT + value.slice(end);
    onChange(next);
    // Markören ska stå efter indraget, inte hoppa till slutet.
    requestAnimationFrame(() => {
      field.selectionStart = start + INDENT.length;
      field.selectionEnd = start + INDENT.length;
    });
  }

  function outdent(field) {
    const { selectionStart: start } = field;
    const before = value.slice(0, start);
    if (!before.endsWith(INDENT)) return;
    const next = before.slice(0, -INDENT.length) + value.slice(start);
    onChange(next);
    requestAnimationFrame(() => {
      field.selectionStart = start - INDENT.length;
      field.selectionEnd = start - INDENT.length;
    });
  }

  function onKeyDown(event) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      onRun();
      return;
    }
    if (event.key === "Tab") {
      event.preventDefault();
      if (event.shiftKey) outdent(event.target);
      else indent(event.target);
      return;
    }
    if (event.key === "Escape") {
      event.target.blur();
    }
  }

  return (
    <div>
      <label htmlFor="sql-editor" className="sr-only">
        {label}
      </label>
      <textarea
        id="sql-editor"
        ref={ref}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        disabled={disabled}
        rows={rows}
        spellCheck="false"
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        placeholder="SELECT ..."
        style={{ tabSize: 2 }}
        className="w-full rounded-lg border border-line bg-white p-3 font-mono text-[14px] leading-relaxed focus:border-pine disabled:bg-paper disabled:text-ink/40"
      />
      <p className="mt-1 text-sm text-ink/65">
        Ctrl/Cmd + Enter kör frågan. Tab gör indrag, Esc lämnar fältet.
      </p>
    </div>
  );
});

export default SqlEditor;
