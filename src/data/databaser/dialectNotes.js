export const dialectNotes = [
  { topic: "Begränsa antal rader", sqlite: "SELECT ... LIMIT 5", tsql: "SELECT TOP 5 ..." },
  { topic: "Slå samman text", sqlite: "'a' || 'b'", tsql: "'a' + 'b' eller CONCAT('a','b')" },
  { topic: "Ersätt NULL", sqlite: "IFNULL(kolumn, 0) eller COALESCE", tsql: "ISNULL(kolumn, 0) eller COALESCE" },
  { topic: "Dagens datum", sqlite: "date('now')", tsql: "GETDATE() eller SYSDATETIME()" },
  { topic: "Identitetskolumn", sqlite: "INTEGER PRIMARY KEY AUTOINCREMENT", tsql: "INTEGER IDENTITY(1,1)" },
  { topic: "Datatyper", sqlite: "Typerna är rådgivande — text kan hamna i en INT-kolumn", tsql: "Typerna kontrolleras strikt" },
  { topic: "RIGHT och FULL OUTER JOIN", sqlite: "Stöds först från version 3.39 — kan saknas här", tsql: "Stöds fullt ut" },
  { topic: "GROUP BY-regeln", sqlite: "Tillåter kolumner utanför GROUP BY och väljer ett värde på måfå", tsql: "Ger fel — varje kolumn måste vara i GROUP BY eller i ett aggregat" },
  { topic: "Strängjämförelse", sqlite: "LIKE är skiftlägesokänsligt för ASCII", tsql: "Beror på databasens collation" },
  { topic: "Radera tabellinnehåll", sqlite: "DELETE FROM Tabell", tsql: "DELETE FROM Tabell eller TRUNCATE TABLE Tabell" }
];
