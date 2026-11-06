// Kortkommandon i kodrutorna, som i VS Code: ⌘ på Mac och Ctrl annars. På
// Mac lämnas Ctrl-tangenterna orörda, eftersom Ctrl+A och Ctrl+K redan är
// "till radens början" och "radera radens rest" i Macs textfält. Alt räknas
// inte: AltGr kommer som Ctrl + Alt och skriver tecken.

export const IS_MAC =
  typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || "");

// Kortkommandona som de skrivs i tipsraderna.
export const SUBMIT_KEYS = IS_MAC ? "⌘ + Enter" : "Ctrl + Enter";
export const FORMAT_KEYS = IS_MAC ? "⌘K ⌘F" : "Ctrl+K Ctrl+F";

export const isMod = (event, mac = IS_MAC) =>
  !event.altKey && (mac ? event.metaKey && !event.ctrlKey : event.ctrlKey && !event.metaKey);

export const isSelectAll = (event, mac = IS_MAC) => isMod(event, mac) && event.key?.toLowerCase() === "a";

// ⌘K ⌘F formaterar, som Format Selection i VS Code. Andra tangenten får
// tryckas med eller utan ⌘, men inom två sekunder. En annan tangent avbryter,
// och bara en modifierartangent (⌘ som släpps och trycks igen) får vänta.
// pendingAt är tiden för ⌘K, eller null. Svaret säger vad rutan ska göra:
// "start" (spara tiden, svälj tangenten), "keep" (vänta vidare), "format"
// (svälj tangenten och formatera) eller "none" (glöm ⌘K, tangenten gäller).
export const CHORD_MS = 2000;
const MODIFIERS = new Set(["Meta", "Control", "Shift", "Alt", "OS"]);

export function chordStep(pendingAt, event, now = Date.now(), mac = IS_MAC) {
  const key = event.key?.toLowerCase();
  if (pendingAt != null && now - pendingAt <= CHORD_MS) {
    if (MODIFIERS.has(event.key)) return "keep";
    if (key === "f" && !event.altKey) return "format";
  }
  if (key === "k" && isMod(event, mac)) return "start";
  return "none";
}
