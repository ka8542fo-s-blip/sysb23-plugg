// Diagramnamnen som kapiteltexterna får referera till som [[diagram:namn]].
// Ren JS så att testet kan läsa listan utan JSX. Namnen är stabila — de är
// ett API mot reading.js.
export const DIAGRAM_IDS = [
  "workson",
  "deltagande",
  "lasriktningar",
  "svag-entitet",
  "reifiering",
  "crow-andpunkter",
  "chen-crow",
  "fyra-lager",
  "population-entiteter",
  "population-relationer",
  "attribut",
];

export const DIAGRAM_RE = /^\[\[diagram:([a-z0-9-]+)\]\]$/;
