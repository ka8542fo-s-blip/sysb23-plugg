// Parkerade frågor — INTE med i Öva.
//
// De sex SQL-frågorna ur leveransen 2026-09-05 (Fö1: AS, projektion, scope
// efter FROM, dubblerad kolumn vid JOIN, COUNT(*), kopierad literal) hör
// till SQL-frågespråket, som saknar kapitel i Läs. Öva speglar Läs, så de
// väntar här i leveransformatet tills ett kapitel om frågespråket finns;
// då skrivs de om till mallens format (explain per alternativ, difficulty,
// source) och läggs in i questions.js. Beslut: CC-prompt-ova-speglar-las.md.
export const pendingQuestions = [
  {
    id: "db1-11",
    topic: "sql",
    question: "Vad gör nyckelordet `AS` i en select list?",
    options: [
      "Det byter namn på kolumnerna i den lagrade tabellen permanent",
      "Det namnger de härledda resultatkolumnerna i just den här frågan",
      "Det skapar en vy som andra frågor sedan kan referera till",
      "Det konverterar kolumnens datatyp till den typ som anges efter aliaset"
    ],
    correctIndex: 1,
    explanation: "AS namnger derived result columns. Det byter inte namn på kolumner som är lagrade i dbo.Patient.",
  },
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
    id: "db1-13",
    topic: "sql",
    question: "Frågan `SELECT PatientName, UnitAddress FROM dbo.Patient` ger felet \"Invalid column name 'UnitAddress'\". Varför?",
    options: [
      "UnitAddress är felstavat i förhållande till kolumnnamnet i dbo.Unit",
      "Endast dbo.Patient är angiven efter FROM, så dbo.Unit ligger utanför frågans scope",
      "UnitAddress kräver ett tabellprefix eftersom kolumnnamnet finns i två tabeller",
      "Kolumnen är skyddad och kräver att man anger schemat dbo explicit"
    ],
    correctIndex: 1,
    explanation: "PatientName tillhör dbo.Patient och UnitAddress tillhör dbo.Unit. Att bara namnge dbo.Patient efter FROM lämnar dbo.Unit utanför frågans scope. Frågan måste introducera båda relationerna.",
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
  {
    id: "db1-15",
    topic: "sql",
    question: "Vad räknar `COUNT(*)`?",
    options: [
      "Antalet unika värden i tabellens primärnyckelkolumn",
      "Antalet rader i indata, oavsett vilka attribut som finns",
      "Antalet kolumner som ingår i den aktuella select list",
      "Antalet rader där samtliga attribut har ett värde skilt från NULL"
    ],
    correctIndex: 1,
    explanation: "COUNT(*) räknar de sex indataraderna och returnerar ett värde. Den räknar rader, inte ett utvalt attribut.",
  },
  {
    id: "db1-16",
    topic: "sql",
    question: "Varför är det fel att slå upp E2:s lön och sedan skriva `WHERE EmpSalary = 55000` i en andra fråga?",
    options: [
      "Därför att literalen måste anges som N'55000' för att jämförelsen ska bli giltig",
      "Därför att jämförelser mot decimaltal alltid kräver en explicit CAST i T-SQL",
      "Därför att 55000 är kopierat från dagens data och blir inaktuellt",
      "Därför att två frågor alltid är långsammare än en enda fråga med subquery"
    ],
    correctIndex: 2,
    explanation: "Frågan ställer \"vem tjänar 55000?\" i stället för att härleda E2:s lön. Ändras E2:s lön blir den kopierade literalen tyst inaktuell. En scalar subquery uttrycker beroendet direkt.",
  },
];
