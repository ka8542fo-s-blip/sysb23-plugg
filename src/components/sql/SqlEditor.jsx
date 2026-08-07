import { forwardRef } from "react";

// Vanlig textarea med monospace — ingen kodredigerare behövs för detta.
const SqlEditor = forwardRef(function SqlEditor(
  { value, onChange, onRun, label = "Din fråga", disabled, rows = 6 },
  ref,
) {
  function onKeyDown(event) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      onRun();
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
        Ctrl/Cmd + Enter kör frågan.
      </p>
    </div>
  );
});

export default SqlEditor;
