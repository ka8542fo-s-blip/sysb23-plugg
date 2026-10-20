import { useEffect, useRef, useState } from "react";

// Temaväljaren i headern: Auto (följer enheten), Ljust eller Mörkt. Samma
// mönster som delkursväljaren bredvid — en knapp som öppnar en liten meny.
const OPTIONS = [
  { id: "auto", label: "Auto", hint: "Följer enhetens inställning", Icon: AutoIcon },
  { id: "ljust", label: "Ljust", hint: "Ljus bakgrund", Icon: SunIcon },
  { id: "mork", label: "Mörkt", hint: "För plugg i mörker", Icon: MoonIcon },
];

export default function ThemeToggle({ choice, theme, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const current = OPTIONS.find((option) => option.id === choice) || OPTIONS[0];
  // I Auto visar knappen det tema som faktiskt gäller just nu.
  const ShownIcon = choice === "auto" ? (theme === "dark" ? MoonIcon : SunIcon) : current.Icon;

  useEffect(() => {
    if (!open) return undefined;
    menuRef.current?.querySelector('[aria-checked="true"]')?.focus();
    function onPointerDown(event) {
      if (!wrapRef.current?.contains(event.target)) setOpen(false);
    }
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
        return;
      }
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      const items = [...(menuRef.current?.querySelectorAll('[role="menuitemradio"]') || [])];
      const index = items.indexOf(document.activeElement);
      const step = event.key === "ArrowDown" ? 1 : -1;
      items[(index + step + items.length) % items.length]?.focus();
      event.preventDefault();
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function choose(id) {
    onChange(id);
    setOpen(false);
    buttonRef.current?.focus();
  }

  return (
    <div ref={wrapRef} className="relative flex shrink-0">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Tema: ${current.label}`}
        title={`Tema: ${current.label}`}
        className={`flex items-center gap-2.5 rounded-lg border bg-surface px-3 py-2 text-left transition-colors duration-150 ${
          open ? "border-pine bg-pine/[0.04]" : "border-line hover:border-pine hover:bg-pine/[0.04]"
        }`}
      >
        <ShownIcon className="h-5 w-5 shrink-0 text-pine" />
        <span className="hidden sm:block" aria-hidden="true">
          <span className="block text-[11px] font-medium uppercase tracking-[0.14em] text-brass">Tema</span>
          <span className="block text-[15px] leading-snug text-ink">{current.label}</span>
        </span>
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          aria-label="Välj tema"
          className="card absolute right-0 top-[calc(100%+6px)] z-20 w-60 overflow-hidden p-1 shadow-lg shadow-shade/5"
        >
          {OPTIONS.map(({ id, label, hint, Icon }) => {
            const selected = id === choice;
            return (
              <button
                key={id}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                onClick={() => choose(id)}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors duration-150 ${
                  selected ? "bg-pine/[0.08] text-pine" : "hover:bg-pine/[0.08] hover:text-pine"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-medium">{label}</span>
                  <span className="block text-sm text-ink/65">{hint}</span>
                </span>
                {selected && (
                  <span aria-hidden="true" className="shrink-0 text-pine">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SunIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <line
            key={angle}
            x1={12 + Math.cos(rad) * 7}
            y1={12 + Math.sin(rad) * 7}
            x2={12 + Math.cos(rad) * 9.5}
            y2={12 + Math.sin(rad) * 9.5}
          />
        );
      })}
    </svg>
  );
}

function MoonIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
    </svg>
  );
}

function AutoIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 3.5a8.5 8.5 0 0 0 0 17Z" fill="currentColor" stroke="none" />
    </svg>
  );
}
