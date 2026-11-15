import { useState } from "react";
import FdCanvas from "./FdCanvas.jsx";
import { load } from "../../lib/storage.js";

// Hopfälld rityta för beroendediagram i tentornas uppgift 3. Samma FdCanvas
// som i Modellera → Normalisering, men med tentans egen lagringsnyckel och i
// tentaläge: ingen ritkontroll, ingen ritahjälp och ingen rättning, så att
// ritningen bara är ett kladdpapper och poängen är oförändrade.
// Ytan monteras först när rutan fälls ut; den är stängd från början.

const hasDrawing = (storageKey) => (load(storageKey, null)?.boxes?.length ?? 0) > 0;

export default function ExamFdDrawing({ storageKey, relation, attrs, fds }) {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(() => hasDrawing(storageKey));
  return (
    <details
      className="card group mt-3 p-3 sm:p-4"
      open={open}
      onToggle={(e) => {
        const next = e.currentTarget.open;
        setOpen(next);
        if (!next) setSaved(hasDrawing(storageKey));
      }}
    >
      <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-2 gap-y-1 font-display text-[15px] text-pine">
        <span className="inline-block transition-transform duration-150 group-open:rotate-90" aria-hidden="true">›</span>
        Rita beroendediagram
        <span className="font-sans text-sm text-ink/60">för {relation}</span>
        {!open && saved && <span className="rounded-full border border-line bg-paper px-2 py-0.5 font-sans text-xs text-ink/70">Ritning sparad</span>}
      </summary>
      {open && (
        <div className="mt-3">
          <FdCanvas item={{ id: storageKey, attrs, fds }} storageKey={storageKey} graded={false} examMode />
        </div>
      )}
    </details>
  );
}
