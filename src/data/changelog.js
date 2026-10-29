// Nyheterna som uppdateringsnotisen visar ("Nytt: …"). Bygget lägger de
// senaste raderna i version.json, och en öppen flik visar de rader som är
// nyare än versionen den kör (src/lib/versionCheck.js). Ändringar utan rad
// här, som schemakontrollens dagliga stämpel, ger ingen notis.
//
// Regel: varje ändring som märks för den som pluggar får en rad här, i samma
// commit. Nyast först, id räknas upp med ett, texten är kort (högst 70
// tecken) och skriven för den som pluggar, inte för utvecklaren.
export const changelog = [
  { id: 28, date: "2026-10-29", text: "DDL: tabellordningen bedöms inte; fel ordning ger bara ett tips" },
  { id: 27, date: "2026-10-29", text: "DDL-rättningen underkänner tabeller i fel ordning och felstavade ord" },
  { id: 26, date: "2026-10-26", text: "DDL-rutan i Modellera och Tenta är full bredd tills facit visas" },
  { id: 25, date: "2026-10-26", text: "Flikarna Kompendium, Begrepp och Ordlista i Läs ryms nu på mobilen" },
  { id: 24, date: "2026-10-26", text: "Kapitel 11 beskriver tentans Java-uppgift och mallen för en DAO-metod" },
  { id: 23, date: "2026-10-26", text: "Ny flik Java i Databaser: skriv DAO-metoden och få den rättad" },
  { id: 22, date: "2026-10-22", text: "BPMN-övningarna visar deluppgiften, till exempel ord 3(c)" },
  { id: 21, date: "2026-10-22", text: "Tentafokus i Öva är borttaget; BPM har i stället läget Tentafrågor" },
  { id: 20, date: "2026-10-22", text: "Tentafrågor i Öva: BPM-tentornas frågor, tenta för tenta" },
  { id: 19, date: "2026-10-22", text: "Essäfrågorna står i samma lättlästa typsnitt som övriga frågor" },
  { id: 18, date: "2026-10-22", text: "BPMN-symboler: alla former och vad de betyder, i BPMN-övningarna" },
  { id: 17, date: "2026-10-22", text: "Knappen Nästa uppgift i BPMN-övningarna" },
  { id: 16, date: "2026-10-21", text: "BPMN-övningar: fäll ihop menyn och zooma diagrammen med − och +" },
  { id: 15, date: "2026-10-21", text: "Sammanfattning ovanför kapitlen i Databasers Läs, med tre figurer" },
  { id: 14, date: "2026-10-21", text: "Kapitelkorten i Läs är lika höga, utan glapp mellan raderna" },
  { id: 13, date: "2026-10-21", text: "Sammanfattningen ligger nu ovanför kapitlen i Läs" },
  { id: 12, date: "2026-10-21", text: "Översikt över hela BPM-kursen först i Läs, med fyra figurer" },
  { id: 11, date: "2026-10-20", text: "Frågorna i Öva och Prov är lättare att läsa" },
  { id: 10, date: "2026-10-20", text: "Mörkt läge: välj Auto, Ljust eller Mörkt under Tema i headern" },
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
