import { forwardRef, useRef } from "react";
import { FORMAT_KEYS, SUBMIT_KEYS, chordStep } from "../../lib/keys.js";
import { afterTyped, backspace, enter, formatSql, shift } from "../../lib/sqlIndent.js";
import { applyEdit, formatField } from "../../lib/textEdit.js";

// Vanlig textarea med monospace — ingen kodredigerare behövs för detta.
// Tab skriver indrag i stället för att flytta fokus; Esc lämnar fältet så
// att tangentbordsnavigering fortfarande går att ta sig vidare med.
// Indragsreglerna ligger i lib/sqlIndent.js, och ⌘K ⌘F (Ctrl+K Ctrl+F)
// formaterar som knappen Formatera. `auto={false}` (tentasimuleringen, som
// på Inspera) stänger av allt utom Tab och Shift+Tab.
const SqlEditor = forwardRef(function SqlEditor(
  { value, onChange, onRun, label = "Din fråga", disabled, rows = 6, auto = true },
  ref,
) {
  const chord = useRef(null); // när ⌘K trycktes, i väntan på F

  function onKeyDown(event) {
    const field = event.target;
    const { selectionStart: start, selectionEnd: end } = field;
    if (auto) {
      const step = chordStep(chord.current, event);
      if (step === "start") {
        event.preventDefault();
        chord.current = Date.now();
        return;
      }
      if (step === "keep") return;
      chord.current = null;
      if (step === "format") {
        event.preventDefault();
        formatField(field, formatSql);
        return;
      }
    }
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      onRun();
      return;
    }
    if (event.key === "Tab") {
      event.preventDefault();
      const change = shift(value, start, end, event.shiftKey ? -1 : 1);
      if (change) applyEdit(field, change);
      return;
    }
    if (event.key === "Escape") {
      field.blur();
      return;
    }
    if (!auto || event.nativeEvent.isComposing || event.metaKey || event.ctrlKey || event.altKey) return;
    let change = null;
    if (event.key === "Enter" && !event.shiftKey) change = enter(value, start, end);
    if (event.key === "Backspace") change = backspace(value, start, end);
    if (change) {
      event.preventDefault();
      applyEdit(field, change);
    }
  }

  // Ett skrivet tecken kan flytta raden det står på. Bara när ett enda tecken
  // skrivits, inte vid inklistring eller ångra.
  function onInput(event) {
    onChange(event.target.value);
    const { inputType, data } = event.nativeEvent;
    if (!auto || inputType !== "insertText" || data?.length !== 1) return;
    const field = event.target;
    const change = afterTyped(field.value, field.selectionStart, data);
    if (change) applyEdit(field, change);
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
        onChange={onInput}
        onKeyDown={onKeyDown}
        disabled={disabled}
        rows={rows}
        spellCheck="false"
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        placeholder="SELECT ..."
        style={{ tabSize: 4 }}
        className="w-full rounded-lg border border-line bg-surface p-3 font-mono text-[14px] leading-relaxed focus:border-pine disabled:bg-paper disabled:text-ink/40"
      />
      <p className="mt-1 text-sm text-ink/65">
        {auto
          ? `Indraget följer med när du skriver. Tab och Shift+Tab flyttar ett steg, ${FORMAT_KEYS} formaterar och ${SUBMIT_KEYS} kör.`
          : `${SUBMIT_KEYS} kör frågan. Tab gör indrag, Esc lämnar fältet.`}
      </p>
    </div>
  );
});

export default SqlEditor;
