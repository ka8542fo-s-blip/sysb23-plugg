// Övningslägets kö. Ingen pass-längd och inget slut: "Fortsätt öva" ger
// nästa ofärdiga fråga. En fråga är klar när de två senaste svaren är rätt.
//
// Grupperna definieras på SVAR, aldrig på visningar: en fråga som visats
// men inte besvarats är fortfarande "osedd" (annars försvann den ur kön).
//   1. fel som senaste svar          — äldst besvarad först
//   2. obesvarade                    — kapitelordning eller blandat
//   3. ett rätt, väntar på sitt andra — äldst besvarad först
// Karens: en fråga återkommer inte förrän COOLDOWN andra frågor serverats,
// räknat i serverade frågor, inte tid. Är kön kortare viker regeln.

export const COOLDOWN = 8;

// Äldre poster saknar seen/recent — tolka dem utan att skriva om datat.
export function normalizeStat(stat) {
  if (!stat) return null;
  const correct = stat.correct || 0;
  const wrong = stat.wrong || 0;
  const recent = Array.isArray(stat.recent)
    ? stat.recent
    : stat.last
      ? [stat.last === "correct"]
      : [];
  return {
    seen: stat.seen ?? correct + wrong,
    correct,
    wrong,
    last: stat.last ?? null,
    lastAt: stat.lastAt ?? null,
    recent,
  };
}

export function isAnswered(stat) {
  const s = normalizeStat(stat);
  return !!s && s.correct + s.wrong > 0;
}

export function isDone(stat) {
  const s = normalizeStat(stat);
  return !!s && s.recent.length >= 2 && s.recent.slice(-2).every(Boolean);
}

export function progressFor(questions, answers) {
  let done = 0;
  for (const question of questions) if (isDone(answers[question.id])) done++;
  return { done, total: questions.length };
}

function shuffle(items, random) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Alla kandidater i serveringsordning. `questions` ska redan vara filtrerade
// på kapitelval och stå i kapitelordning.
export function orderCandidates({
  questions, answers, order = "blandat", examFocus = false, coreTopics = new Set(),
  includeDone = false, random = Math.random,
}) {
  const wrong = [];
  const unseen = [];
  const pending = [];
  const done = [];
  for (const question of questions) {
    const stat = normalizeStat(answers[question.id]);
    if (!isAnswered(stat)) unseen.push(question);
    else if (isDone(stat)) done.push(question);
    else if (stat.last === "wrong") wrong.push(question);
    else pending.push(question);
  }
  const byTime = (a, b) =>
    (answers[a.id]?.lastAt || "").localeCompare(answers[b.id]?.lastAt || "");
  wrong.sort(byTime);
  pending.sort(byTime);
  done.sort(byTime);
  const groups = [wrong, order === "grupp" ? unseen : shuffle(unseen, random), pending];
  if (includeDone) groups.push(done);
  const focus = (list) =>
    examFocus
      ? [...list.filter((q) => coreTopics.has(q.topic)), ...list.filter((q) => !coreTopics.has(q.topic))]
      : list;
  return groups.flatMap(focus);
}

export function nextQuestion({ recent = [], ...rest }) {
  const ordered = orderCandidates(rest);
  if (ordered.length === 0) return null;
  const cooling = new Set(recent.slice(-COOLDOWN));
  return ordered.find((question) => !cooling.has(question.id)) || ordered[0];
}
