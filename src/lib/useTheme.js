import { useCallback, useEffect, useState } from "react";
import { KEYS, load, save } from "./storage.js";
import { applyTheme, normalizeChoice, resolveTheme, systemPrefersDark } from "./theme.js";

// Temavalet och det effektiva temat. I läget "auto" lyssnar kroken på
// enhetens inställning, så att sidan byter direkt när telefonen går över
// till mörkt läge på kvällen.
export function useTheme() {
  const [choice, setChoiceState] = useState(() => normalizeChoice(load(KEYS.theme, "auto")));
  const [systemDark, setSystemDark] = useState(systemPrefersDark);
  const theme = resolveTheme(choice, systemDark);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    let media;
    try {
      media = window.matchMedia("(prefers-color-scheme: dark)");
    } catch {
      return undefined;
    }
    const onChange = (event) => setSystemDark(event.matches);
    // Läs också om när fliken blir synlig igen: en flik som legat i
    // bakgrunden när telefonen bytte läge ska stämma när man kommer tillbaka.
    const onVisible = () => {
      if (document.visibilityState === "visible") setSystemDark(media.matches);
    };
    media.addEventListener?.("change", onChange);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      media.removeEventListener?.("change", onChange);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const setChoice = useCallback((next) => {
    const value = normalizeChoice(next);
    setChoiceState(value);
    save(KEYS.theme, value);
  }, []);

  return { choice, theme, setChoice };
}
