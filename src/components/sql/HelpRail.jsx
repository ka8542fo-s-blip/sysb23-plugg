import { useEffect, useRef, useState } from "react";
import { headerHeight } from "../../lib/useWide.js";

// Tabeller och genomgång. Bred skärm: en spalt som stannar kvar bredvid
// uppgiften, så att man kan läsa medan man skriver. Smal skärm: knappar som
// fäller ut samma innehåll i uppgiften, stängda från början.
// tabs = [{ id, label, content }]
export default function HelpRail({ tabs, value, onChange, wide }) {
  const [closed, setClosed] = useState(true);
  const railRef = useRef(null);
  const [top, setTop] = useState(0);
  const active = tabs.find((tab) => tab.id === value) ?? tabs[0];

  useEffect(() => {
    if (wide) setTop(headerHeight() + 12);
  }, [wide]);

  function pick(id) {
    if (!wide && id === active.id) setClosed(!closed);
    else {
      setClosed(false);
      onChange(id);
      railRef.current?.scrollTo?.({ top: 0 });
    }
  }

  const buttons = (
    <div role="tablist" aria-label="Hjälp till uppgiften" className="flex gap-1">
      {tabs.map((tab) => {
        const on = tab.id === active.id && (wide || !closed);
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => pick(tab.id)}
            className={`chip ${on ? "chip-on" : ""}`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );

  if (!wide) {
    return (
      <div>
        {buttons}
        {!closed && <div className="mt-3 rounded-lg border border-line bg-paper p-3">{active.content}</div>}
      </div>
    );
  }

  return (
    <aside
      aria-label="Hjälp till uppgiften"
      className="card sticky flex flex-col overflow-hidden"
      style={{ top, maxHeight: `calc(100vh - ${top + 12}px)` }}
    >
      <div className="border-b border-line p-3">{buttons}</div>
      <div ref={railRef} className="min-h-0 flex-1 overflow-y-auto p-4">
        {active.content}
      </div>
    </aside>
  );
}
