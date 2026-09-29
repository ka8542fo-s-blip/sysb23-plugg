import { schedule } from "../../data/schedule.js";
import { daysBetween, formatFullDate } from "../../lib/dates.js";
import { useToday } from "../../lib/useToday.js";

// Hur färskt schemat är. Bevakningen jämför med TimeEdit varje dag och
// stämplar `lastChecked`; om stämpeln är äldre än två dagar har kontrollen
// slutat fungera, och då ska det synas tydligt i stället för att schemat
// ser lika säkert ut som vanligt.
export const STALE_AFTER_DAYS = 2;

export default function ScheduleTrust({ compact = false }) {
  const now = useToday();
  const age = daysBetween(schedule.lastChecked, now);
  if (age > STALE_AFTER_DAYS) {
    return (
      <p className="rounded-lg border-l-2 border-wrong bg-wrong-bg px-4 py-3 text-[15px] leading-relaxed" role="status">
        <span className="font-medium text-wrong">Schemat har inte kontrollerats mot TimeEdit på {age} dagar</span>{" "}
        (senast {formatFullDate(schedule.lastChecked)}). Något kan ha ändrats — kontrollera i TimeEdit innan du litar på tider och salar.
      </p>
    );
  }
  if (compact) return null;
  return (
    <p className="text-sm text-ink/65">
      Kontrolleras mot TimeEdit varje dag, senast {formatFullDate(schedule.lastChecked)}.
    </p>
  );
}
