import { forwardRef } from "react";
import { afterTyped, backspace, enter, shift } from "../../lib/sqlIndent.js";

// Lägger en ändring i textfältet som om den skrivits, så att fältets egen
// ångra-historik (Ctrl/Cmd + Z) räknar med den: att sätta värdet via React
// tömmer historiken. onChange kommer från fältets input-händelse.
function applyEdit(field, change) {
  field.focus();
  field.setSelectionRange(change.from, change.to);
  const ok = change.insert
    ? document.execCommand("insertText", false, change.insert)
    : document.execCommand("delete");
  if (!ok) field.setRangeText(change.insert, change.from, change.to, "end");
  field.setSelectionRange(change.selStart, change.selEnd);
  if (!ok) field.dispatchEvent(new Event("input", { bubbles: true }));
}

// Hela texten byts, ett steg i ångra-historiken. För knappen Formatera.
export function replaceAll(field, text) {
  if (text === field.value) return;
  applyEdit(field, { from: 0, to: field.value.length, insert: text, selStart: text.length, selEnd: text.length });
}

// Vanlig textarea med monospace — ingen kodredigerare behövs för detta.
// Tab skriver indrag i stället för att flytta fokus; Esc lämnar fältet så
// att tangentbordsnavigering fortfarande går att ta sig vidare med.
// Indragsreglerna ligger i lib/sqlIndent.js. `auto={false}` (tentasimuleringen,
// som på Inspera) stänger av allt utom Tab och Shift+Tab.
const SqlEditor = forwardRef(function SqlEditor(
  { value, onChange, onRun, label = "Din fråga", disabled, rows = 6, auto = true },
  ref,
) {
  function onKeyDown(event) {
    const field = event.target;
    const { selectionStart: start, selectionEnd: end } = field;
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
          ? "Indraget följer med när du skriver. Tab och Shift+Tab flyttar ett steg, Ctrl/Cmd + Enter kör."
          : "Ctrl/Cmd + Enter kör frågan. Tab gör indrag, Esc lämnar fältet."}
      </p>
    </div>
  );
});

export default SqlEditor;
