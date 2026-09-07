// Parkerade frågor — INTE med i Öva.
//
// Två av de sex SQL-frågorna ur leveransen 2026-09-05 står kvar här: de
// prövar Fö1-mekanik (projektion som resultatrubrik, dubblerad kolumn vid
// SELECT p.*, u.*) som kapitel 10 inte tar upp — kapitlet är byggt baklänges
// från tentans fråga, inte framlänges från decket. De andra fyra (AS, scope
// efter FROM, COUNT(*), kopierad literal) gick in i questions.js 2026-09-07
// i mallens format. Beslut: CC-prompt-stor-uppdatering-tentan.md punkt 6.
export const pendingQuestions = [
  {
    id: "db1-12",
    topic: "sql",
    question: "Vad innebär projection i en SQL-fråga?",
    options: [
      "Att tabellen kopieras till en ny relation som innehåller färre kolumner än förut",
      "Att resultatets rubrik ändras, inte den lagrade tabellen",
      "Att raderna sorteras enligt de kolumner som anges i select list",
      "Att attribut som inte behövs raderas permanent ur den lagrade tabellen på servern"
    ],
    correctIndex: 1,
    explanation: "Projection ändrar result heading. Den tar inte bort attribut ur den lagrade tabellen — de finns kvar, de syns bara inte i det här resultatet.",
  },
  {
    id: "db1-14",
    topic: "sql",
    question: "I `SELECT p.*, u.*` med en JOIN mellan Patient och Unit förekommer `UnitId` två gånger. Varför?",
    options: [
      "Därför att ON-villkoret duplicerar den kolumn som ingår i jämförelsen",
      "Därför att ORDER BY kräver att sorteringskolumnen finns med två gånger",
      "Därför att JOIN alltid lägger till en extra kolumn för matchningsnyckeln",
      "Därför att varje matchat par innehåller båda hela tuplerna"
    ],
    correctIndex: 3,
    explanation: "Varje matchat par innehåller fortfarande hela Patient-tupeln och hela Unit-tupeln. Projection har ännu inte tagit bort eller döpt om någonting.",
  },
];
