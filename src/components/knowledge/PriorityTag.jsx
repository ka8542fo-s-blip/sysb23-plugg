import { PRIORITY_CLASS, PRIORITY_LABEL } from "../../lib/examPriority.js";

// Etiketterna är konturer, aldrig fyllda — fylld pine-yta betyder valt
// tillstånd i resten av appen.
export default function PriorityTag({ levels, className = "" }) {
  if (!levels?.length) return null;
  return (
    <>
      {levels.map((level) => (
        <span
          key={level}
          className={`chip shrink-0 py-0 text-xs ${PRIORITY_CLASS[level]} ${className}`}
          title={
            level === "karna"
              ? "Prövat som flervalsfråga på HT24 eller i quiz F1"
              : level === "essa"
                ? "Prövat som essäfråga — kräver djup, inte bara igenkänning"
                : "Har inte prövats på tidigare tentor"
          }
        >
          {PRIORITY_LABEL[level]}
        </span>
      ))}
    </>
  );
}
