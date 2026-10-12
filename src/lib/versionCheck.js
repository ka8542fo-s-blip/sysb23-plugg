// Uppdateringsnotisen: bygget skriver version.json med commitens SHA och
// bäddar in samma SHA i appen (__APP_VERSION__, vite.config.js). Appen
// hämtar filen då och då och visar en banner när den publicerade versionen
// skiljer sig från den som körs. Ren logik här, så att testet kan läsa den
// utan Vite; hämtningen ligger i useVersionCheck.js.

export const CHECK_INTERVAL_MS = 5 * 60 * 1000;
// focus och visibilitychange kommer ofta samtidigt när man byter tillbaka
// till fliken — en hämtning räcker.
export const MIN_GAP_MS = 10 * 1000;

const SHA = /^[0-9a-f]{7,40}$/;

export function versionUrl(base, now = Date.now()) {
  return `${base}version.json?t=${now}`;
}

// version.json → SHA, eller null om filen inte ser ut som väntat.
export function parseVersion(json) {
  const sha = json && typeof json === "object" ? json.sha : null;
  return typeof sha === "string" && SHA.test(sha) ? sha : null;
}

// Bannern visas när den publicerade versionen är en annan än den som körs
// och inte är den man redan har stängt bannern för.
export function shouldNotify({ current, remote, dismissed }) {
  if (!SHA.test(current ?? "") || !remote) return false;
  return remote !== current && remote !== dismissed;
}
