import { daysUntil, isPast, weekNumber, today } from "./dates.js";

export function subcoursesById(schedule) {
  return Object.fromEntries(schedule.subcourses.map((item) => [item.id, item]));
}

// Alla tentor i datumordning, med dagar kvar och om de är avklarade.
export function decoratedExams(schedule) {
  const byId = subcoursesById(schedule);
  return [...schedule.exams]
    .sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start))
    .map((exam) => ({
      ...exam,
      subcourseData: byId[exam.subcourse],
      days: daysUntil(exam.date),
      past: isPast(`${exam.date} ${exam.end}`),
    }));
}

export function nextExam(schedule) {
  return decoratedExams(schedule).find((exam) => !exam.past) || null;
}

// tre tillstånd: före terminsstart, under terminen, efter sista examinationen
export function termState(schedule) {
  const exams = decoratedExams(schedule);
  const allDone = exams.every((exam) => exam.past);
  if (allDone) return "after";
  if (daysUntil(schedule.termStart) > 0) return "before";
  return "during";
}

export function currentPeriod(schedule) {
  const now = today();
  return (
    schedule.periods.find((period) => period.from <= now && now <= period.to) || null
  );
}

export function currentWeek(schedule) {
  const now = today();
  return schedule.weeks.find((week) => week.from <= now && now <= week.to) || null;
}

export function weekLabelFor(schedule, isoDate) {
  const number = weekNumber(isoDate);
  const match = schedule.weeks.find((week) => week.week === number);
  return { week: number, from: match?.from, to: match?.to };
}

// Passen grupperade per vecka, i datumordning.
export function sessionsByWeek(sessions, schedule) {
  const groups = new Map();
  for (const session of sessions) {
    const { week, from, to } = weekLabelFor(schedule, session.date);
    const key = `${session.date.slice(0, 4)}-${String(week).padStart(2, "0")}`;
    if (!groups.has(key)) groups.set(key, { key, week, from, to, sessions: [] });
    groups.get(key).sessions.push(session);
  }
  return [...groups.values()]
    .map((group) => ({
      ...group,
      sessions: [...group.sessions].sort((a, b) =>
        (a.date + a.time).localeCompare(b.date + b.time),
      ),
    }))
    .sort((a, b) => a.sessions[0].date.localeCompare(b.sessions[0].date));
}
