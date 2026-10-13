import { useCallback, useEffect, useRef, useState } from "react";
import { LATEST_NEWS_ID } from "../data/changelog.js";
import { CHECK_INTERVAL_MS, MIN_GAP_MS, latestId, parseVersion, unseenNews, versionUrl } from "./versionCheck.js";

// Hämtar version.json var femte minut, när fliken blir synlig igen och när
// fönstret får fokus. Aldrig i dev-läge, aldrig automatisk omladdning, och
// nätverksfel ignoreras tyst. Kryssat bort gäller tills nästa nyhet.
export function useVersionCheck() {
  const [remoteNews, setRemoteNews] = useState([]);
  const [dismissedId, setDismissedId] = useState(0);
  const lastCheck = useRef(0);

  useEffect(() => {
    if (import.meta.env.DEV) return undefined;
    let alive = true;

    async function check() {
      const now = Date.now();
      if (now - lastCheck.current < MIN_GAP_MS) return;
      lastCheck.current = now;
      try {
        const res = await fetch(versionUrl(import.meta.env.BASE_URL, now), { cache: "no-store" });
        if (!res.ok) return;
        const version = parseVersion(await res.json());
        if (alive && version) setRemoteNews(version.news);
      } catch {
        // Offline eller avbrutet — nästa kontroll får försöka igen.
      }
    }
    function onVisibility() {
      if (document.visibilityState === "visible") check();
    }

    const timer = setInterval(check, CHECK_INTERVAL_MS);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", check);
    return () => {
      alive = false;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", check);
    };
  }, []);

  const dismiss = useCallback(() => setDismissedId(latestId(remoteNews)), [remoteNews]);
  return { news: unseenNews({ localLatest: LATEST_NEWS_ID, remoteNews, dismissedId }), dismiss };
}
