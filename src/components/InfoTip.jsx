import { useEffect, useId, useRef, useState } from "react";
import { statTerms } from "../data/statTerms.js";

const MAX_WIDTH = 304; // 19rem
const EDGE = 12;

// Litet frågetecken som förklarar en term. Öppnas med muspekaren, med
// tangentbordsfokus och med ett tryck — hover ensamt skulle utesluta
// mobilen, och sidan är byggd mobil först.
export default function InfoTip({ id, term, text, className = "" }) {
  const entry = statTerms[id] || {};
  const label = term || entry.term || "Förklaring";
  const body = text || entry.text || "";

  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false); // öppnad med klick
  const [box, setBox] = useState(null);
  const wrapRef = useRef(null);
  const buttonRef = useRef(null);
  const isTouch = useRef(false);
  const tipId = useId();

  function close() {
    setOpen(false);
    setPinned(false);
  }

  // Bubblan läggs fast i fönstret och klämts in mellan kanterna. Bredden
  // är känd i förväg, så placeringen kan räknas ut direkt ur knappens
  // position — ingen efterjustering behövs.
  function placeAndOpen() {
    const rect = buttonRef.current?.getBoundingClientRect();
    const viewport = window.innerWidth || document.documentElement.clientWidth;
    if (!rect || !viewport) return;

    const width = Math.min(MAX_WIDTH, viewport - EDGE * 2);
    const centered = rect.left + rect.width / 2 - width / 2;
    const left = Math.min(Math.max(EDGE, centered), viewport - EDGE - width);

    setBox({ left, top: rect.bottom + 8, width });
    setOpen(true);
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
    // Bubblan är fast i fönstret, så den ska inte hänga kvar vid scroll.
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  return (
    <span ref={wrapRef} className={`relative inline-flex align-middle ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        aria-label={`Vad betyder ${label}?`}
        aria-expanded={open}
        aria-controls={open ? tipId : undefined}
        onPointerEnter={(event) => {
          isTouch.current = event.pointerType === "touch";
          if (!isTouch.current) placeAndOpen();
        }}
        onPointerLeave={() => {
          if (!isTouch.current && !pinned) setOpen(false);
        }}
        onFocus={() => placeAndOpen()}
        onBlur={() => {
          if (!pinned) setOpen(false);
        }}
        onClick={() => {
          if (open && pinned) close();
          else {
            placeAndOpen();
            setPinned(true);
          }
        }}
        className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-line bg-white text-[11px] font-medium leading-none text-ink/65 transition-colors duration-150 hover:border-pine hover:bg-pine/[0.08] hover:text-pine"
      >
        <span aria-hidden="true">?</span>
      </button>

      {open && box && (
        <span
          id={tipId}
          role="tooltip"
          style={{ left: box.left, top: box.top, width: box.width }}
          className="card fixed z-30 p-3 text-left shadow-lg shadow-ink/5"
        >
          <span className="block font-medium text-pine">{label}</span>
          <span className="mt-1 block text-sm font-normal leading-relaxed text-ink/80">
            {body}
          </span>
        </span>
      )}
    </span>
  );
}
