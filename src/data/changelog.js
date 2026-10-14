// Nyheterna som uppdateringsnotisen visar ("Nytt: …"). Bygget lägger de
// senaste raderna i version.json, och en öppen flik visar de rader som är
// nyare än versionen den kör (src/lib/versionCheck.js). Ändringar utan rad
// här, som schemakontrollens dagliga stämpel, ger ingen notis.
//
// Regel: varje ändring som märks för den som pluggar får en rad här, i samma
// commit. Nyast först, id räknas upp med ett, texten är kort (högst 70
// tecken) och skriven för den som pluggar, inte för utvecklaren.
export const changelog = [
  { id: 9, date: "2026-10-14", text: "Figurer som förklarar modellerna i Processorienterad" },
  { id: 8, date: "2026-10-14", text: "Figurer som förklarar modellerna i Databaser-kompendiet" },
  { id: 7, date: "2026-10-13", text: "Fliken Kör processen heter nu BPMN-övningar" },
  { id: 6, date: "2026-10-13", text: "Lyssna härifrån: starta uppläsningen mitt i ett kapitel" },
  { id: 5, date: "2026-10-13", text: "Knappen Tillbaka till kapitlet på övningsfrågorna" },
  { id: 4, date: "2026-10-13", text: "Lästa kapitel syns gröna i kapitellistan" },
  { id: 3, date: "2026-10-13", text: "Uppläsningen går nu också i 1,75× och 2×" },
  { id: 2, date: "2026-10-13", text: "BPM-kapitel 9 och 10 kompletterade med F5-videorna" },
  { id: 1, date: "2026-10-13", text: "Inspelad röst i uppläsningen för Databaser och Processorienterad" },
];

// Det nyaste id:t i den här versionen av sajten.
export const LATEST_NEWS_ID = changelog.reduce((max, entry) => Math.max(max, entry.id), 0);
