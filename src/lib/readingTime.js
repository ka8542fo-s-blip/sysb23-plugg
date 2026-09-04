// Kompendiets totala lästid räknas ur kapitlens readingMinutes i stället
// för att stå som fast text — annars glider siffran när kapitel läggs till.
// Avrundas till närmaste tio minuter: "ungefär" ska inte låta exakt.

export const READING_TIME_PLACEHOLDER = "{lästid}";

export function totalReadingMinutes(chapters) {
  const sum = (chapters || []).reduce((acc, chapter) => acc + (chapter.readingMinutes || 0), 0);
  return Math.round(sum / 10) * 10;
}

// 50 → "50 minuter", 60 → "1 timme", 110 → "1 timme och 50 minuter",
// 120 → "2 timmar", 130 → "2 timmar och 10 minuter".
export function formatReadingTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  const hourPart = hours === 0 ? "" : hours === 1 ? "1 timme" : `${hours} timmar`;
  const minutePart = rest === 0 ? "" : `${rest} minuter`;
  if (hourPart && minutePart) return `${hourPart} och ${minutePart}`;
  return hourPart || minutePart || "0 minuter";
}

// Byter ut platshållaren i en introtext mot den beräknade tiden.
export function withReadingTime(text, chapters) {
  if (!text || !text.includes(READING_TIME_PLACEHOLDER)) return text;
  return text.replace(READING_TIME_PLACEHOLDER, formatReadingTime(totalReadingMinutes(chapters)));
}
