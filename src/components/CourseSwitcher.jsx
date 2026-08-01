import { useEffect, useRef, useState } from "react";

// Delkursen är en egen nivå ovanför vyflikarna: den syns i den fasta
// headern i alla lägen, och det är här man byter kurs.
export default function CourseSwitcher({ courses, courseId, onSelect, examRunning }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(null); // bekräftelse när ett prov pågår
  const wrapRef = useRef(null);
  const buttonRef = useRef(null);
  const current = courses.find((course) => course.id === courseId) || courses[0];

  function close() {
    setOpen(false);
    setPending(null);
  }

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!wrapRef.current?.contains(event.target)) close();
    }
    function onKeyDown(event) {
      if (event.key === "Escape") {
        close();
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function choose(id) {
    if (id === courseId) {
      close();
      return;
    }
    // Ett pågående prov ska inte försvinna på ett oavsiktligt klick.
    if (examRunning && pending !== id) {
      setPending(id);
      return;
    }
    onSelect(id);
    close();
  }

  return (
    <div ref={wrapRef} className="relative w-full sm:w-[300px]">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-3 rounded-lg border bg-white px-3 py-2 text-left transition-colors duration-150 ${
          open
            ? "border-pine bg-pine/[0.04]"
            : "border-line hover:border-pine hover:bg-pine/[0.04]"
        }`}
      >
        <span className="min-w-0">
          <span className="block text-[11px] font-medium uppercase tracking-[0.14em] text-brass">
            <span className="sm:hidden">SYSB23 · </span>Delkurs
          </span>
          <span className="block truncate font-display text-[17px] text-pine">
            {current.name}
          </span>
        </span>
        <span
          aria-hidden="true"
          className={`shrink-0 text-ink/65 transition-transform duration-150 ${
            open ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Välj delkurs"
          className="card absolute left-0 right-0 top-[calc(100%+6px)] z-20 overflow-hidden p-1 shadow-lg shadow-ink/5"
        >
          {courses.map((course) => {
            const isActive = course.status === "aktiv";
            const selected = course.id === courseId;
            const confirming = pending === course.id;

            return (
              <button
                key={course.id}
                type="button"
                role="menuitem"
                disabled={!isActive}
                onClick={() => choose(course.id)}
                className={`flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left transition-colors duration-150 ${
                  isActive
                    ? selected
                      ? "bg-pine/[0.08] text-pine"
                      : "hover:bg-pine/[0.08] hover:text-pine"
                    : "cursor-not-allowed text-ink/40"
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate text-[15px] font-medium">
                    {course.name}
                  </span>
                  <span className="block text-sm text-ink/65">
                    {!isActive
                      ? "Kommer under terminen"
                      : confirming
                        ? "Prov pågår — klicka igen för att byta och avbryta det"
                        : `${course.questions.length} frågor · ${course.essays.length} essäfrågor`}
                  </span>
                </span>
                {selected && (
                  <span aria-hidden="true" className="shrink-0 text-pine">
                    ✓
                  </span>
                )}
                {selected && <span className="sr-only">Vald</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
