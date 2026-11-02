import { formatSql } from "../../lib/sqlIndent.js";
import { replaceAll } from "./SqlEditor.jsx";

// Frivillig: skriver om frågan med rätt indrag, bara blanktecken ändras, och
// går att ångra med Ctrl/Cmd + Z. `editorRef` pekar på SqlEditors textfält.
export default function FormatButton({ editorRef, disabled, className = "" }) {
  return (
    <button
      type="button"
      className={`btn-secondary ${className}`}
      disabled={disabled}
      onClick={() => {
        const field = editorRef.current;
        if (field) replaceAll(field, formatSql(field.value));
      }}
    >
      Formatera
    </button>
  );
}
