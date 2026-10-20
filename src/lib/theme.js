// Ljust och mörkt tema. Valet ("auto" | "ljust" | "mork") sparas under
// KEYS.theme; "auto" följer enhetens inställning. Det effektiva temat sätts
// som data-theme på <html>, och index.css skriver om färgkanalerna för
// "dark". Skriptet i index.html gör samma sak före första ritningen, så att
// sidan inte blinkar vit — håll de två i takt (testet i
// scripts/theme.test.mjs jämför dem).
export const THEME_CHOICES = ["auto", "ljust", "mork"];

// Webbläsarens statusfält och adressrad följer sidans bakgrund (--paper).
export const THEME_COLOR = { light: "#fbfaf6", dark: "#131718" };

export function normalizeChoice(value) {
  return THEME_CHOICES.includes(value) ? value : "auto";
}

export function resolveTheme(choice, systemPrefersDark) {
  const c = normalizeChoice(choice);
  if (c === "mork") return "dark";
  if (c === "ljust") return "light";
  return systemPrefersDark ? "dark" : "light";
}

export function systemPrefersDark() {
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return false;
  }
}

export function applyTheme(theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[theme]);
}
