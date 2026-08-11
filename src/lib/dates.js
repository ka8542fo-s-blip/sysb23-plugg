// Alla datum räknas i Europe/Stockholm. Dagsdifferenser görs på
// UTC-förankrade midnätter, annars blir "dagar kvar" fel över
// sommartidsskiftet (25 oktober 2026).

const TZ = "Europe/Stockholm";

const isoFormatter = new Intl.DateTimeFormat("sv-SE", {
  timeZone: TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const timeFormatter = new Intl.DateTimeFormat("sv-SE", {
  timeZone: TZ,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

// Dagens datum i Stockholm som "ÅÅÅÅ-MM-DD".
export function today() {
  return isoFormatter.format(new Date());
}

// Klockslag i Stockholm som "HH:MM".
export function nowTime() {
  return timeFormatter.format(new Date());
}

// "ÅÅÅÅ-MM-DD" → millisekunder vid UTC-midnatt. Tidszonsoberoende.
function utcMidnight(isoDate) {
  const [year, month, day] = String(isoDate).slice(0, 10).split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

export function daysBetween(fromIso, toIso) {
  return Math.round((utcMidnight(toIso) - utcMidnight(fromIso)) / 86400000);
}

// Positivt tal = i framtiden, 0 = idag, negativt = passerat.
export function daysUntil(isoDate, from = today()) {
  return daysBetween(from, isoDate);
}

// Tar "ÅÅÅÅ-MM-DD" eller "ÅÅÅÅ-MM-DD HH:MM" (även med T).
export function isPast(isoDateTime) {
  const [date, time] = String(isoDateTime).trim().split(/[ T]/);
  const diff = daysUntil(date);
  if (diff < 0) return true;
  if (diff > 0) return false;
  return time ? nowTime() >= time : false;
}

export function isToday(isoDate) {
  return daysUntil(isoDate) === 0;
}

// ISO-8601-veckonummer (vecka 1 innehåller 4 januari).
export function weekNumber(isoDate) {
  const date = new Date(utcMidnight(isoDate));
  const weekday = (date.getUTCDay() + 6) % 7; // måndag = 0
  date.setUTCDate(date.getUTCDate() - weekday + 3); // torsdagen i veckan
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
  const firstWeekday = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstWeekday + 3);
  return 1 + Math.round((date - firstThursday) / (7 * 86400000));
}

function format(isoDate, options) {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "UTC", ...options }).format(
    new Date(utcMidnight(isoDate)),
  );
}

// "måndag 21 september"
export function formatSwedish(isoDate) {
  return format(isoDate, { weekday: "long", day: "numeric", month: "long" });
}

// "må 21 sep" — tvåbokstavig veckodag håller raderna smala på mobil.
export function formatShort(isoDate) {
  const weekday = format(isoDate, { weekday: "short" }).slice(0, 2);
  return `${weekday} ${formatDayMonth(isoDate)}`;
}

// "31 augusti"
export function formatLongDate(isoDate) {
  return format(isoDate, { day: "numeric", month: "long" });
}

// "1 augusti 2026"
export function formatFullDate(isoDate) {
  return format(isoDate, { day: "numeric", month: "long", year: "numeric" });
}

// "31 aug"
export function formatDayMonth(isoDate) {
  return format(isoDate, { day: "numeric", month: "short" }).replace(".", "");
}

export function monthName(isoDate) {
  return format(isoDate, { month: "long" });
}

// "9–12 nov" respektive "31 aug – 6 sep" över månadsgräns.
export function formatRange(fromIso, toIso) {
  if (!toIso || toIso === fromIso) return formatDayMonth(fromIso);
  const sameMonth = fromIso.slice(0, 7) === toIso.slice(0, 7);
  if (sameMonth) {
    return `${format(fromIso, { day: "numeric" })}–${formatDayMonth(toIso)}`;
  }
  return `${formatDayMonth(fromIso)} – ${formatDayMonth(toIso)}`;
}

export function addDays(isoDate, days) {
  const date = new Date(utcMidnight(isoDate) + days * 86400000);
  return date.toISOString().slice(0, 10);
}

// Sista anmälningsdag i Ladok, härledd som tentadatum minus sju dagar.
// Lagras aldrig i schedule.js — en sparad deadline kan glida isär från
// tentadatumet om datumet ändras. "Senast en vecka innan" är TimeEdits
// formulering utan exakt klockslag, därav "omkring" i alla UI-texter.
export function registrationDeadline(exam) {
  return addDays(exam.date, -7);
}

// "om 50 dagar", "imorgon", "idag", "för 3 dagar sedan"
export function relativeDays(days) {
  if (days === 0) return "idag";
  if (days === 1) return "imorgon";
  if (days === -1) return "igår";
  if (days > 0) return `om ${days} dagar`;
  return `för ${Math.abs(days)} dagar sedan`;
}
