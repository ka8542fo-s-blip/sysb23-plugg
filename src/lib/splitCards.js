// Förklarakorten i Öva (Verksamhetsarkitektur) delades upp 2026-11-22: varje
// fritextfråga har nu ett eget kort med samma id som i fliken Moduler
// (Kaspers beslut och plan). De sju nya korten var tidigare en del av ett
// ihopslaget kort. Engångsmigrering: ett nytt kort utan egen status ärver
// statusen från det ihopslagna kortet, så att det man redan klarat inte
// försvinner. Texten stannar på det första kortet (svar:<kortId>); de nya
// korten fylls från Essä-utkasten som förut.
//
// Migreringen körs en gång (flaggan KEYS.kortdelning), så att "Gör om
// modulen" eller Övas nollställning inte fylls på igen vid nästa omladdning.
export const SPLIT_CARDS = {
  "ea-f-e4-11": "ea-f-e4-9",
  "ea-f-e5-12": "ea-f-e4-10",
  "ea-f-e12-essay-2": "ea-f-e4-10",
  "ea-f-e12-31": "ea-f-e6-11",
  "ea-f-e7-26": "ea-f-e7-13",
  "ea-f-e12-essay-4": "ea-f-e7-27",
  "ea-f-e12-scenario-2": "ea-f-e9-tankande",
};

export function migrateSplitCards(answers) {
  let next = answers;
  for (const [newId, oldId] of Object.entries(SPLIT_CARDS)) {
    if (next[newId] || !next[oldId]) continue;
    if (next === answers) next = { ...answers };
    next[newId] = { ...next[oldId] };
  }
  return next;
}
