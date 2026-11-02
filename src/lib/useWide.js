import { useEffect, useState } from "react";

const QUERY = "(min-width: 1024px)";

// Bred skärm (Tailwinds lg): hjälpytan står bredvid uppgiften i stället för i den.
export function useWide() {
  const [wide, setWide] = useState(() => window.matchMedia?.(QUERY).matches ?? true);
  useEffect(() => {
    const media = window.matchMedia?.(QUERY);
    if (!media) return undefined;
    const update = () => setWide(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return wide;
}

// Den klistrade menyns höjd, som det som ska stanna under den utgår från.
export const headerHeight = () => document.querySelector("header")?.offsetHeight ?? 0;

// Lägger elementet precis under menyn. Ingen mjuk rullning: uppgiften ska stå
// där direkt när man bytt.
export function scrollBelowHeader(element) {
  if (!element) return;
  const top = element.getBoundingClientRect().top + window.scrollY - headerHeight() - 12;
  window.scrollTo({ top: Math.max(top, 0) });
}
