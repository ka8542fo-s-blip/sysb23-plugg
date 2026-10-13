// Uppdateringsnotisen: bygget skriver version.json med commitens SHA och de
// senaste raderna ur src/data/changelog.js. Appen hämtar filen då och då
// och visar en banner med det som är nytt jämfört med versionen den kör.
// Skiljer sig bara SHA:n (till exempel schemakontrollens dagliga stämpel)
// visas ingen banner. Ren logik här, så att testet kan läsa den utan Vite;
// hämtningen ligger i useVersionCheck.js.

export const CHECK_INTERVAL_MS = 5 * 60 * 1000;
// focus och visibilitychange kommer ofta samtidigt när man byter tillbaka
// till fliken — en hämtning räcker.
export const MIN_GAP_MS = 10 * 1000;
// Så många nyheter står i bannern; resten blir "+N till".
export const SHOWN_NEWS = 2;

const SHA = /^[0-9a-f]{7,40}$/;

export function versionUrl(base, now = Date.now()) {
  return `${base}version.json?t=${now}`;
}

// Det bygget lägger i version.json.
export function versionFile(sha, changelog, count = 10) {
  return { sha, news: changelog.slice(0, count).map(({ id, text }) => ({ id, text })) };
}

// version.json → { sha, news }, eller null om filen inte ser ut som väntat.
// Rader som inte har heltals-id och text släpps.
export function parseVersion(json) {
  if (!json || typeof json !== "object") return null;
  const sha = typeof json.sha === "string" && SHA.test(json.sha) ? json.sha : null;
  const news = Array.isArray(json.news)
    ? json.news.filter((entry) => Number.isInteger(entry?.id) && typeof entry?.text === "string" && entry.text)
    : [];
  return { sha, news };
}

export const latestId = (news) => news.reduce((max, entry) => Math.max(max, entry.id), 0);

// Nyheterna som är nyare än både den egna versionen och den man senast
// stängde bannern för, nyast först. Tom lista = ingen banner.
export function unseenNews({ localLatest, remoteNews, dismissedId = 0 }) {
  const seen = Math.max(localLatest ?? 0, dismissedId ?? 0);
  return (remoteNews ?? []).filter((entry) => entry.id > seen).sort((a, b) => b.id - a.id);
}
