export const VIEWS = [
  { id: "hem", label: "Hem" },
  { id: "ova", label: "Öva" },
  { id: "prov", label: "Prov" },
  { id: "begrepp", label: "Begrepp" },
  { id: "essa", label: "Essä" },
  { id: "statistik", label: "Statistik" },
];

export default function Nav({ view, onNavigate, courseName }) {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-4xl flex-col gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-baseline justify-between gap-3">
          <button
            type="button"
            onClick={() => onNavigate("hem")}
            className="font-display text-xl text-pine"
          >
            SYSB23 Plugg
          </button>
          <span className="truncate text-sm text-ink/55">{courseName}</span>
        </div>
        <nav aria-label="Huvudmeny" className="-mx-1 overflow-x-auto">
          <ul className="flex gap-1 px-1">
            {VIEWS.map((item) => {
              const active = view === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    aria-current={active ? "page" : undefined}
                    className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-[15px] transition-colors ${
                      active
                        ? "bg-pine text-white"
                        : "text-ink/70 hover:bg-white hover:text-pine"
                    }`}
                  >
                    {item.label}
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
