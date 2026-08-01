export const VIEWS = [
  { id: "hem", label: "Hem" },
  { id: "ova", label: "Öva" },
  { id: "prov", label: "Prov" },
  { id: "begrepp", label: "Begrepp" },
  { id: "essa", label: "Essä" },
  { id: "statistik", label: "Statistik" },
];

export default function Nav({ view, onNavigate, courseName, examRunning }) {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-4xl flex-col gap-2 px-4 py-3 sm:px-6">
        <div className="flex items-baseline justify-between gap-3">
          <button
            type="button"
            onClick={() => onNavigate("hem")}
            className="rounded-lg font-display text-xl text-pine transition-colors hover:text-pine-dark"
          >
            SYSB23 Plugg
          </button>
          <span className="truncate text-sm text-ink/65">{courseName}</span>
        </div>

        <nav aria-label="Huvudmeny">
          <ul className="flex flex-wrap gap-1">
            {VIEWS.map((item) => {
              const active = view === item.id;
              const showDot = item.id === "prov" && examRunning && !active;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-[15px] transition-colors duration-150 ${
                      active
                        ? "bg-pine font-medium text-white"
                        : "text-ink/70 hover:bg-pine/[0.08] hover:text-pine active:bg-pine/[0.14]"
                    }`}
                  >
                    {item.label}
                    {showDot && (
                      <>
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 rounded-full bg-brass"
                        />
                        <span className="sr-only">(prov pågår)</span>
                      </>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
