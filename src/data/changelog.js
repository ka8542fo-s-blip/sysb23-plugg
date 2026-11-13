// Nyheterna som uppdateringsnotisen visar ("Nytt: …"). Bygget lägger de
// senaste raderna i version.json, och en öppen flik visar de rader som är
// nyare än versionen den kör (src/lib/versionCheck.js). Ändringar utan rad
// här, som schemakontrollens dagliga stämpel, ger ingen notis.
//
// Regel: varje ändring som märks för den som pluggar får en rad här, i samma
// commit. Nyast först, id räknas upp med ett, texten är kort (högst 70
// tecken) och skriven för den som pluggar, inte för utvecklaren.
export const changelog = [
  { id: 53, date: "2026-11-13", text: "Verksamhetsarkitektur: Zachman-essän och UF:s 53 essäfrågor" },
  { id: 52, date: "2026-11-13", text: "Verksamhetsarkitektur: öva alla UF:s modulfrågor, 217 frågor" },
  { id: 51, date: "2026-11-13", text: "Ny delkurs Verksamhetsarkitektur: läs UF:s tolv moduler" },
  { id: 50, date: "2026-11-13", text: "Säkerhet: fliken Uppgifter med kraven för båda inlämningarna" },
  { id: 49, date: "2026-11-13", text: "Säkerhet: skriv en hel gammal tenta med poäng, avdrag och betyg" },
  { id: 48, date: "2026-11-13", text: "Ny delkurs Säkerhet: öva de 26 frågorna från HT25:s tre tentor" },
  { id: 47, date: "2026-11-13", text: "Öva: Genomgång och statusrad finns nu också i Tentafrågor" },
  { id: 46, date: "2026-11-11", text: "SQL: LEFT, RIGHT, YEAR, DATEDIFF och [dbo].[Tabell] fungerar nu" },
  { id: 45, date: "2026-11-11", text: "Essä: checklistan scrollar för sig, bredvid ditt svar" },
  { id: 44, date: "2026-11-11", text: "Statistik: rättade förklaringar, Nollställ tar bort alla bockar direkt" },
  { id: 43, date: "2026-11-11", text: "BPMN-frågan om Bouquet delivery frågar bara efter sluttillståndet" },
  { id: 42, date: "2026-11-11", text: "BPMN-övningar: slumpa uppgifter, nollställ alla, menyn grupperad" },
  { id: 41, date: "2026-11-11", text: "Öva: läget Genomgång, där ett rätt räcker, och statusrad över frågan" },
  { id: 40, date: "2026-11-11", text: "Öva: frågan står kvar när du går till Läs och tillbaka" },
  { id: 39, date: "2026-11-06", text: "Kodrutor: ⌘A markerar bara rutan och ⌘K ⌘F formaterar koden" },
  { id: 38, date: "2026-11-03", text: "SQL: LIMIT, IFNULL, JOIN utan ON och mer stoppas nu som i SQL Server" },
  { id: 37, date: "2026-11-03", text: "Schema: föreläsning 3 i Verksamhetsarkitektur flyttad till mån 23 nov" },
  { id: 36, date: "2026-11-03", text: "Schema: om-redovisning av databasprojektet 18 jan, tid bokas i Canvas" },
  { id: 35, date: "2026-11-02", text: "SQL: text jämförd med tal stoppas nu, precis som i SQL Server" },
  { id: 34, date: "2026-11-02", text: "SQL: läget Tentanivå med 50 frågor, de flesta på tentans egna tabeller" },
  { id: 33, date: "2026-11-02", text: "SQL: ny struktur med översikt, Nästa-knapp och tabeller bredvid frågan" },
  { id: 32, date: "2026-11-02", text: "SQL: indraget följer med när du skriver, och knappen Formatera" },
  { id: 31, date: "2026-11-02", text: "Läget Tenta i SQL-fliken: tentornas SQL-frågor med rättning" },
  { id: 30, date: "2026-10-29", text: "Dina svar i Modellera, SQL och BPMN-övningarna sparas mellan besök" },
  { id: 29, date: "2026-10-29", text: "Bockarna för ER-diagram till DDL syns igen efter omladdning" },
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
