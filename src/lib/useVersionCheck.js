import { useCallback, useEffect, useRef, useState } from "react";
import { CHECK_INTERVAL_MS, MIN_GAP_MS, parseVersion, shouldNotify, versionUrl } from "./versionCheck.js";

// SHA:n som den här versionen byggdes från (Vite define). Saknas i tester.
const CURRENT = typeof __APP_VERSION__ === "string" ? __APP_VERSION__ : null;

// Hämtar version.json var femte minut, när fliken blir synlig igen och när
// fönstret får fokus. Aldrig i dev-läge, aldrig automatisk omladdning, och
// nätverksfel ignoreras tyst. Kryssat bort gäller tills nästa nya version.
export function useVersionCheck() {
  const [remote, setRemote] = useState(null);
  const [dismissed, setDismissed] = useState(null);
  const lastCheck = useRef(0);

  useEffect(() => {
    if (import.meta.env.DEV || !CURRENT) return undefined;
    let alive = true;

    async function check() {
      const now = Date.now();
      if (now - lastCheck.current < MIN_GAP_MS) return;
      lastCheck.current = now;
      try {
        const res = await fetch(versionUrl(import.meta.env.BASE_URL, now), { cache: "no-store" });
        if (!res.ok) return;
        const sha = parseVersion(await res.json());
        if (alive && sha) setRemote(sha);
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

  const dismiss = useCallback(() => setDismissed(remote), [remote]);
  return { show: shouldNotify({ current: CURRENT, remote, dismissed }), dismiss };
}
