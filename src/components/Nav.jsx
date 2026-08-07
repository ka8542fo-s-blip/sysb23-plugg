import CourseSwitcher from "./CourseSwitcher.jsx";

export const VIEW_LABELS = {
  hem: "Hem",
  las: "Läs",
  ova: "Öva",
  prov: "Prov",
  essa: "Essä",
  sql: "SQL",
  statistik: "Statistik",
  schema: "Schema",
};

// Hem och Schema är globala; däremellan ligger delkursens egna lägen i
// den ordning manifestet anger.
export function viewsForCourse(course) {
  return ["hem", ...(course?.views || []), "schema"].map((id) => ({
    id,
    label: VIEW_LABELS[id] || id,
  }));
}

export default function Nav({
  view,
  onNavigate,
  courses,
  course,
  courseId,
  onSelectCourse,
  examRunning,
}) {
  const tabs = viewsForCourse(course);
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2.5 sm:gap-3 sm:px-6 sm:py-3 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          {/* På mobil bär delkursväljarens etikett kursnamnet i stället —
              headern ska inte äta en fjärdedel av skärmen. */}
          <button
            type="button"
            onClick={() => onNavigate("hem")}
            className="hidden self-start rounded-lg font-display text-xl text-pine transition-colors hover:text-pine-dark sm:block"
          >
            SYSB23 Plugg
          </button>
          <CourseSwitcher
            courses={courses}
            courseId={courseId}
            onSelect={onSelectCourse}
            examRunning={examRunning}
          />
        </div>

        <nav aria-label="Huvudmeny" className="relative">
          <ul className="no-scrollbar flex gap-0.5 overflow-x-auto sm:flex-wrap sm:gap-1">
            {tabs.map((item) => {
              const active = view === item.id;
              const showDot = item.id === "prov" && examRunning && !active;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-1 whitespace-nowrap rounded-lg px-2 py-1.5 text-[14px] transition-colors duration-150 sm:gap-1.5 sm:px-3 sm:text-[15px] ${
                      active
                        ? "bg-pine font-medium text-white hover:bg-pine-dark"
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
          {/* Tunn fade i papperstonen som visar att raden går att dra i. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-paper to-transparent sm:hidden"
          />
        </nav>
      </div>
    </header>
  );
}
