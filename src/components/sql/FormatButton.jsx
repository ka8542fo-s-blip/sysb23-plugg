import { formatSql } from "../../lib/sqlIndent.js";
import { formatField } from "../../lib/textEdit.js";

// Frivillig: skriver om frågan med rätt indrag, bara blanktecken ändras, och
// går att ångra med Ctrl/Cmd + Z. Samma sak som ⌘K ⌘F i rutan. `editorRef`
// pekar på SqlEditors textfält.
export default function FormatButton({ editorRef, disabled, className = "" }) {
  return (
    <button
      type="button"
      className={`btn-secondary ${className}`}
      disabled={disabled}
      onClick={() => {
        const field = editorRef.current;
        if (field) formatField(field, formatSql);
      }}
    >
      Formatera
    </button>
  );
}
