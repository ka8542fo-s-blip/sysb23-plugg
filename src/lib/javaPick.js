// Knappen "Slumpa uppgift" i fliken Java: en slumpad uppgift ur exempeltentan
// och övningarna, utom de som är markerade som svårare (hard: true, som
// java-ov-14). I första hand bland uppgifter som inte är klara; när alla är
// klara bland alla. Aldrig den uppgift som är öppen.
export function pickRandomJavaTask(tasks, states, currentId, random = Math.random) {
  const pool = tasks.filter((t) => !t.hard && t.id !== currentId);
  const open = pool.filter((t) => states[t.id]?.status !== "solved");
  const from = open.length ? open : pool;
  if (!from.length) return null;
  return from[Math.min(from.length - 1, Math.floor(random() * from.length))].id;
}
