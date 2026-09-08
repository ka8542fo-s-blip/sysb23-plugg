// Tentans uppgift 1: markera alla sanna påståenden om ett ER-diagram.
// Poängregeln ur tentan: +5 per korrekt markerat, −3 per felaktigt markerat,
// omarkerat ger 0; alla och endast de sanna ger 25 oavsett antal. Här
// golvas summan vid 0 — tentan säger inte vad som händer under noll.
export const MAX_POINTS = 25;

export function scoreStatements(statements, marked) {
  const set = new Set(marked);
  const rows = statements.map((st, i) => {
    const isMarked = set.has(i);
    const outcome = isMarked ? (st.truth ? "hit" : "false-alarm") : st.truth ? "miss" : "correct-blank";
    const points = outcome === "hit" ? 5 : outcome === "false-alarm" ? -3 : 0;
    return { index: i, marked: isMarked, truth: st.truth, outcome, points };
  });
  const exact = rows.every((r) => r.marked === r.truth);
  const raw = rows.reduce((sum, r) => sum + r.points, 0);
  const points = exact ? MAX_POINTS : Math.max(0, Math.min(MAX_POINTS, raw));
  const hits = rows.filter((r) => r.outcome === "hit").length;
  const falseAlarms = rows.filter((r) => r.outcome === "false-alarm").length;
  const misses = rows.filter((r) => r.outcome === "miss").length;
  return { rows, points, raw, exact, hits, falseAlarms, misses, status: exact ? "correct" : marked.length === 0 ? "blank" : "partial" };
}
