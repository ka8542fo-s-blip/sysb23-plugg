import { useCallback, useState } from "react";
import { clearDraft, loadDraft, saveDraft } from "./storage.js";

// Egna svar per uppgift, sparade i localStorage (lib/storage.js: svar:<id>).
// get läser minnet först och annars det sparade; set skriver båda vid varje
// ändring; clear (nollställ) tar bort båda.
export function useDrafts() {
  const [drafts, setDrafts] = useState({});
  const get = useCallback(
    (id, fallback) => {
      if (id in drafts) return drafts[id] ?? fallback;
      return loadDraft(id) ?? fallback;
    },
    [drafts],
  );
  const set = useCallback((id, value) => {
    saveDraft(id, value);
    setDrafts((prev) => ({ ...prev, [id]: value }));
  }, []);
  const clear = useCallback((id) => {
    clearDraft(id);
    setDrafts((prev) => ({ ...prev, [id]: null }));
  }, []);
  return { get, set, clear };
}
