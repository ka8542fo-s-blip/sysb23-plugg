# PROMPT TILL CLAUDE CODE — Schemavy för SYSB23 Plugg

## Vad du ska bygga

Ett tillägg till **SYSB23 Plugg**: en **Schema**-vy som gör terminens datum till en del av pluggsystemet. Poängen är inte att visa ett schema — det finns redan i TimeEdit — utan att koppla *datum* till *pluggstatus*: hur många dagar till nästa tenta, vilka delkurser som är igång just nu, och hur långt du kommit i materialet för den tenta som är närmast.

All schemadata finns färdig längre ned. Den är verifierad mot TimeEdit 1 augusti 2026 för intervallet 2026-08-31 – 2027-02-28. **Hitta inte på datum, salar eller pass.** Saknas något i datat ska vyn visa det som okänt, inte gissa.

## Navigation

Navigationen blir: **Hem · Läs · Öva · Prov · Essä · Statistik · Schema**

Sju flikar är många för mobil. Gör navigationsraden horisontellt scrollbar under 640 px med tunn fade-mask i `--paper` vid höger kant, i stället för att radbryta eller krympa texten.

## Datumlogik (viktigt att få rätt)

- Allt räknas i tidszonen **Europe/Stockholm**. Använd inte `new Date()` rakt av för dagsdifferenser — normalisera till midnatt lokal tid innan du subtraherar, annars blir "dagar kvar" fel över sommartidsskiftet 25 okt 2026.
- Skapa `src/lib/dates.js` med `today()`, `daysUntil(isoDate)`, `isPast(isoDateTime)`, `weekNumber(isoDate)` (ISO-veckor) och `formatSwedish(isoDate)` som ger t.ex. "måndag 21 september".
- **Terminen har inte börjat än** när detta byggs (start 31 aug 2026). Vyn måste hantera tre tillstånd: före terminsstart, under terminen, efter sista omtentan. Testa alla tre genom att tillfälligt stubba `today()` — och ta bort stubbningen efteråt.
- Passerade tentor visas som avklarade (nedtonade, med hake), inte som negativa nedräkningar.

## Schema-vyn — fyra sektioner

### 1. Nedräkning (överst)

Ett stort kort för **nästa kommande examination**: delkursnamn, typ (ordinarie/omtenta), dagar kvar som stort tal i Fraunces, datum och tid utskrivet, sal, och lärare. Under det en rad med **pluggberedskap** för den delkursen om det finns innehåll för den (se avsnitt "Koppling till pluggdata"). Har terminen inte börjat visas i stället "Terminen börjar om N dagar" ovanför kortet.

Under det stora kortet: en kompakt lista över **alla fem ordinarie tentor** i datumordning med delkursfärg, dagar kvar och sal. Omtentor visas i en utfällbar sektion ("Visa omtentor") eftersom de bara är relevanta vid behov.

### 2. Terminen i översikt

Ett Gantt-liknande diagram över de sju delkursernas löptid, byggt med CSS grid — **ingen diagrambibliotek**. En rad per delkurs, x-axeln september till mitten av januari med månadsetiketter. Varje stapel i delkursens färg, och stapelns slut markerar den ordinarie examinationen med en liten lodrät markör.

En vertikal linje för **idag** i `--brass`, med etikett. Ligger idag utanför intervallet ritas ingen linje.

Under diagrammet de fyra parallellitetsperioderna som textrader (finns i datat som `periods`), där den period som gäller idag markeras.

### 3. Belastning per vecka

Vecka 36 till vecka 2 som horisontella staplar med antal pass, färgade efter `load`: `hög` i `--pine`, `låg` i en ljusare pine, `tenta` i `--wrong` (vecka med tenta eller redovisning), `tom` som streck i `--line`. Aktuell vecka markeras. Under diagrammet en rad som pekar ut den tyngsta sträckan ur `periods`-datat.

### 4. Hela schemat

Alla pass i en filtrerbar lista, grupperad per vecka med veckorubrik ("v.36 · 31 aug – 6 sep"). Varje rad: datum, tid, passtyp och nummer, delkurs som färgprick, plats.

Filter (chips, flera kan vara aktiva samtidigt): en per delkurs, plus **"Bara tentor"** och **"Bara framåt"**. `Bara framåt` är förvalt när terminen är igång så att man inte behöver skrolla förbi passerade veckor; före terminsstart visas allt.

Obligatoriska pass (introduktionsmötet) och tentor markeras tydligare: tentor med `--wrong-bg` bakgrund, obligatoriskt med en liten `--brass`-etikett "Obligatorisk".

## Koppling till pluggdata (det som gör vyn värd att bygga)

För varje tenta där delkursen har innehåll i appen (`contentId` satt i `subcourses`) beräknas en **beredskapsrad** ur befintlig localStorage-data:

- antal lästa kapitel av totalt (`sysb23:read:<contentId>:*`)
- träffsäkerhet på besvarade frågor för delkursen
- antal genomförda prov och bästa betyg

Formulera det som en mening, inte som en poäng: *"Du har läst 4 av 10 kapitel, 68 % rätt på 31 frågor, bästa prov C."* Saknas data: *"Du har inte börjat plugga på den här delkursen än."*

Lägg också till en **dagar-per-kapitel-uppskattning** när det finns olästa kapitel och tentan ligger i framtiden: *"6 olästa kapitel på 50 dagar — ett kapitel var åttonde dag räcker."* Räkna på hela dagar och avrunda nedåt. Ligger tentan närmare än antalet olästa kapitel skrivs i stället *"6 olästa kapitel på 4 dagar — dags att prioritera."*

Delkurser utan innehåll (`contentId: null`) visar "Material saknas i appen än" med en neutral ton — inget rött.

## Hem-vyn

Lägg **högst upp**, före de befintliga korten, en smal nedräkningsrad: delkursfärgad prick, "Nästa tenta: Strategi och ekonomistyrning · om 50 dagar · må 21 sep 08:00 · MA 9", klickbar till Schema. Före terminsstart står det "Terminen börjar 31 augusti" i samma rad. Efter sista omtentan döljs raden.

## Statistik-vyn

Lägg en rad per delkurs med innehåll: dagar till dess tenta jämte antal lästa kapitel och träffsäkerhet, så att statistiken får en tidsdimension. Ingen ny beräkningslogik — återanvänd beredskapsfunktionen.

## Design

Sju delkursfärger behövs, och de bright-färger som finns i den ursprungliga terminsöversikten (iOS-palett) hör inte hemma i "Läsesalen". Använd dessa dämpade toner, definierade som CSS-variabler tillsammans med de befintliga tokens:

```
--c-strategi     #B0632E   /* terrakotta */
--c-databaser    #2F5D7C   /* skifferblå */
--c-process      #2F7A63   /* grangrön */
--c-arkitektur   #A07A1B   /* mörk mässing */
--c-sakerhet     #8C4A63   /* plommon */
--c-ansvarsfull  #566B2A   /* oliv */
--c-isprojekt    #4B4A7A   /* indigo */
```

Färgerna används som prickar, stapelfyllningar och vänsterkanter — aldrig som textfärg på brödtext, och aldrig som enda informationsbärare (varje färgprick åtföljs av delkursnamn eller förkortning). Övrig typografi och alla andra färger enligt befintligt tema.

Nedräkningens stora tal sätts i Fraunces med tabellsiffror. Diagrammen ska fungera utan JavaScript-animering; har användaren `prefers-reduced-motion` ritas de direkt utan inväxning.

## Källhänvisning i vyn

Längst ned i Schema-vyn, i liten text: "Verifierat mot TimeEdit 1 augusti 2026. Kontrollera alltid aktuell vecka i TimeEdit — salar och tider kan ändras." Datumet läses ur `schedule.verifiedOn`, inte hårdkodat i komponenten.

---

# INNEHÅLL — `src/data/schedule.js`

Kopiera in exakt. Detta är terminsdata för hela SYSB23, inte för en enskild delkurs, och ligger därför direkt i `src/data/` — inte under `src/data/strategi/`.

```js
export const schedule = {
  term: "HT 2026",
  termStart: "2026-08-31",
  termEnd: "2027-01-17",
  verifiedOn: "2026-08-01",
  source: "TimeEdit, sökning \"Informationssystems- och verksamhetsutveckling, SYSB23\", intervall 2026-08-31 – 2027-02-28.",
  note: "Samtliga tentor är digitala och kräver egen laptop samt anmälan i Ladok senast en vecka innan. MA-skrivsalarna ligger i Matteannexet, Sölvegatan 20. Sparta ligger på Tunavägen 39.",

  subcourses: [
    { id: "strategi", name: "Strategi och ekonomistyrning", short: "Strategi", hp: 2.0, teacher: "Benjamin Weaver", color: "--c-strategi", start: "2026-08-31", end: "2026-09-21", contentId: "strategi" },
    { id: "databaser", name: "Databaser", short: "Databaser", hp: 3.0, teacher: "Björn Svensson (laborationer: Nils Törnqvist)", start: "2026-09-01", end: "2026-11-17", color: "--c-databaser", contentId: null },
    { id: "process", name: "Processorienterad verksamhetsutveckling", short: "Processorienterad", hp: 3.0, teacher: "Benjamin Weaver", start: "2026-09-22", end: "2026-11-13", color: "--c-process", contentId: null },
    { id: "arkitektur", name: "Verksamhetsarkitektur", short: "Verksamhetsarkitektur", hp: 2.0, teacher: "Umberto Fiaccadori", start: "2026-11-18", end: "2026-11-27", color: "--c-arkitektur", contentId: null },
    { id: "sakerhet", name: "Säkerhet i informationssystem", short: "Säkerhet", hp: 2.0, teacher: "Miranda Kajtazi", start: "2026-11-19", end: "2026-12-03", color: "--c-sakerhet", contentId: null },
    { id: "ansvarsfull", name: "Ansvarsfull verksamhetsutveckling", short: "Ansvarsfull", hp: 1.0, teacher: "Miranda Kajtazi", start: "2026-11-25", end: "2026-12-01", color: "--c-ansvarsfull", contentId: null },
    { id: "isprojekt", name: "Informationssystemsprojekt", short: "IS-projekt", hp: 7.0, teacher: "Weaver, Kajtazi och Fiaccadori", start: "2026-12-08", end: "2027-01-17", color: "--c-isprojekt", contentId: null }
  ],

  exams: [
    { id: "ex-strategi", subcourse: "strategi", type: "ordinarie", date: "2026-09-21", start: "08:00", end: "11:00", room: "Skrivsal MA 9" },
    { id: "ex-process", subcourse: "process", type: "ordinarie", date: "2026-11-13", start: "08:00", end: "13:00", room: "Skrivsal MA 10", note: "Ligger dagen efter databasredovisningens sista dag och fyra dagar före databastentan." },
    { id: "ex-databaser", subcourse: "databaser", type: "ordinarie", date: "2026-11-17", start: "08:00", end: "13:00", room: "Skrivsal MA 9" },
    { id: "ex-arkitektur", subcourse: "arkitektur", type: "ordinarie", date: "2026-11-27", start: "14:00", end: "19:00", room: "Skrivsal MA 10", note: "Kvällstid — enda tentan på terminen som inte börjar på morgonen." },
    { id: "ex-sakerhet", subcourse: "sakerhet", type: "ordinarie", date: "2026-12-03", start: "08:00", end: "13:00", room: "Skrivsal MA 10" },
    { id: "om-strategi", subcourse: "strategi", type: "omtenta", date: "2026-11-06", start: "08:00", end: "11:00", room: "Skrivsal MA 9" },
    { id: "om-databaser", subcourse: "databaser", type: "omtenta", date: "2027-01-05", start: "08:00", end: "13:00", room: "Skrivsal MA 10" },
    { id: "om-process", subcourse: "process", type: "omtenta", date: "2027-01-07", start: "08:00", end: "13:00", room: "Skrivsal MA 9" },
    { id: "om-arkitektur", subcourse: "arkitektur", type: "omtenta", date: "2027-01-13", start: "14:00", end: "19:00", room: "Skrivsal MA 10" },
    { id: "om-sakerhet", subcourse: "sakerhet", type: "omtenta", date: "2027-01-14", start: "08:00", end: "13:00", room: "Skrivsal Sparta" }
  ],

  periods: [
    { from: "2026-08-31", to: "2026-09-21", subcourses: ["strategi", "databaser"], label: "Strategi och ekonomistyrning + Databaser." },
    { from: "2026-09-22", to: "2026-11-13", subcourses: ["databaser", "process"], label: "Databaser + Processorienterad verksamhetsutveckling. Processorienterad startar dagen efter Strategi-tentan — sömlöst byte." },
    { from: "2026-11-18", to: "2026-12-03", subcourses: ["arkitektur", "sakerhet", "ansvarsfull"], label: "Verksamhetsarkitektur, Säkerhet i informationssystem och Ansvarsfull verksamhetsutveckling överlappar. Onsdag 25 november har tre olika delkurser samma dag.", warning: true },
    { from: "2026-12-08", to: "2027-01-17", subcourses: ["isprojekt"], label: "Bara informationssystemsprojektet, med handledning i block och lång ledig sträcka över jul och nyår." }
  ],

  heaviestStretch: { from: "2026-11-09", to: "2026-12-03", label: "Tyngsta sträckan: redovisning 9–12 nov, tenta 13 nov, tenta 17 nov, tre nya delkurser som startar 18–25 nov, tenta 27 nov och tenta 3 dec. Fyra salstentor på tre veckor." },

  weeks: [
    { week: 36, from: "2026-08-31", to: "2026-09-06", sessions: 6, load: "hög" },
    { week: 37, from: "2026-09-07", to: "2026-09-13", sessions: 6, load: "hög" },
    { week: 38, from: "2026-09-14", to: "2026-09-20", sessions: 3, load: "låg" },
    { week: 39, from: "2026-09-21", to: "2026-09-27", sessions: 5, load: "tenta" },
    { week: 40, from: "2026-09-28", to: "2026-10-04", sessions: 5, load: "hög" },
    { week: 41, from: "2026-10-05", to: "2026-10-11", sessions: 3, load: "låg" },
    { week: 42, from: "2026-10-12", to: "2026-10-18", sessions: 5, load: "hög" },
    { week: 43, from: "2026-10-19", to: "2026-10-25", sessions: 3, load: "låg" },
    { week: 44, from: "2026-10-26", to: "2026-11-01", sessions: 2, load: "låg" },
    { week: 45, from: "2026-11-02", to: "2026-11-08", sessions: 0, load: "tom" },
    { week: 46, from: "2026-11-09", to: "2026-11-15", sessions: 2, load: "tenta" },
    { week: 47, from: "2026-11-16", to: "2026-11-22", sessions: 4, load: "tenta" },
    { week: 48, from: "2026-11-23", to: "2026-11-29", sessions: 5, load: "tenta" },
    { week: 49, from: "2026-11-30", to: "2026-12-06", sessions: 2, load: "tenta" },
    { week: 50, from: "2026-12-07", to: "2026-12-13", sessions: 1, load: "låg" },
    { week: 51, from: "2026-12-14", to: "2026-12-20", sessions: 1, load: "låg" },
    { week: 52, from: "2026-12-21", to: "2026-12-27", sessions: 0, load: "tom" },
    { week: 53, from: "2026-12-28", to: "2027-01-03", sessions: 0, load: "tom" },
    { week: 1, from: "2027-01-04", to: "2027-01-10", sessions: 0, load: "tom" },
    { week: 2, from: "2027-01-11", to: "2027-01-17", sessions: 1, load: "låg" }
  ],

  sessions: [
    { date: "2026-08-31", time: "13:00–15:00", subcourse: "strategi", title: "Introduktion (upprop)", place: "MA 5", kind: "obligatorisk" },
    { date: "2026-09-01", time: "13:00–15:00", subcourse: "databaser", title: "Föreläsning 1", place: "MA 3", kind: "föreläsning" },
    { date: "2026-09-02", time: "08:00–10:00", subcourse: "databaser", title: "Föreläsning 2", place: "MA 3", kind: "föreläsning" },
    { date: "2026-09-02", time: "13:00 / 15:00", subcourse: "databaser", title: "Laboration 1 (grupp 1&2 / 3&4)", place: "EC2:PC011/015/059", kind: "laboration" },
    { date: "2026-09-03", time: "10:00–12:00", subcourse: "strategi", title: "Föreläsning 1", place: "MA 3", kind: "föreläsning" },
    { date: "2026-09-04", time: "10:00–12:00", subcourse: "databaser", title: "Föreläsning 3", place: "MA 3", kind: "föreläsning" },
    { date: "2026-09-07", time: "10:00–12:00", subcourse: "databaser", title: "Föreläsning 4", place: "MA 5", kind: "föreläsning" },
    { date: "2026-09-08", time: "08:00–10:00", subcourse: "strategi", title: "Föreläsning 2", place: "EC1:Crafoordsalen", kind: "föreläsning" },
    { date: "2026-09-08", time: "13:00 / 15:00", subcourse: "databaser", title: "Lektion 1 (grupp 1&2 / 3&4)", place: "EC2:101", kind: "lektion" },
    { date: "2026-09-09", time: "10:00 / 13:00", subcourse: "databaser", title: "Laboration 2 (grupp 1&2 / 3&4)", place: "EC2:PC011/015/059", kind: "laboration" },
    { date: "2026-09-11", time: "10:00–12:00", subcourse: "strategi", title: "Föreläsning 3 — sista i delkursen", place: "MA 5", kind: "föreläsning" },
    { date: "2026-09-11", time: "13:00–15:00", subcourse: "databaser", title: "Föreläsning 5", place: "MA 3", kind: "föreläsning" },
    { date: "2026-09-14", time: "08:00–10:00", subcourse: "databaser", title: "Föreläsning 6", place: "MA 5", kind: "föreläsning" },
    { date: "2026-09-16", time: "10:00 / 15:00", subcourse: "databaser", title: "Laboration 3 (grupp 1&2 / 3&4)", place: "EC2:PC011/015/059", kind: "laboration" },
    { date: "2026-09-17", time: "10:00–12:00", subcourse: "databaser", title: "Föreläsning 7", place: "MA 3", kind: "föreläsning" },
    { date: "2026-09-21", time: "08:00–11:00", subcourse: "strategi", title: "Tentamen — skriftlig salstentamen", place: "Skrivsal MA 9", kind: "tenta" },
    { date: "2026-09-22", time: "10:00–12:00", subcourse: "process", title: "Föreläsning 1 — Introduktion", place: "MA 3", kind: "föreläsning" },
    { date: "2026-09-23", time: "10:00 / 13:00", subcourse: "databaser", title: "Laboration 4 (grupp 1&2 / 3&4)", place: "EC2:PC011/015/059", kind: "laboration" },
    { date: "2026-09-25", time: "10:00–12:00", subcourse: "process", title: "Föreläsning 2", place: "EC1:Crafoordsalen", kind: "föreläsning" },
    { date: "2026-09-25", time: "15:00–17:00", subcourse: "databaser", title: "Föreläsning 8", place: "MA 3", kind: "föreläsning" },
    { date: "2026-09-29", time: "10:00–12:00", subcourse: "process", title: "Föreläsning 3", place: "MA 3", kind: "föreläsning" },
    { date: "2026-09-30", time: "08:00 / 10:00", subcourse: "databaser", title: "Laboration 5 (grupp 1&2 / 3&4)", place: "EC2:PC011/015/059", kind: "laboration" },
    { date: "2026-09-30", time: "13:00–15:00", subcourse: "databaser", title: "Föreläsning 9", place: "MA 3", kind: "föreläsning" },
    { date: "2026-10-01", time: "08:00–10:00", subcourse: "process", title: "Handledning 1", place: "EC2:241 Verona", kind: "handledning" },
    { date: "2026-10-02", time: "10:00–12:00", subcourse: "databaser", title: "Föreläsning 10", place: "MA 3", kind: "föreläsning" },
    { date: "2026-10-05", time: "10:00–12:00", subcourse: "process", title: "Föreläsning 4", place: "MA 3", kind: "föreläsning" },
    { date: "2026-10-07", time: "10:00 / 13:00", subcourse: "databaser", title: "Laboration 6 (grupp 1&2 / 3&4)", place: "EC2:PC011/015/059", kind: "laboration" },
    { date: "2026-10-08", time: "13:00–17:00", subcourse: "process", title: "Handledning 2", place: "EC2:241 Verona", kind: "handledning" },
    { date: "2026-10-12", time: "13:00–15:00", subcourse: "process", title: "Föreläsning 5", place: "MA 3", kind: "föreläsning" },
    { date: "2026-10-13", time: "15:00–17:00", subcourse: "databaser", title: "Föreläsning 11", place: "MA 5", kind: "föreläsning" },
    { date: "2026-10-14", time: "08:00 / 10:00", subcourse: "databaser", title: "Laboration 7 (grupp 1&2 / 3&4)", place: "EC2:PC011/015/059", kind: "laboration" },
    { date: "2026-10-14", time: "10:00 / 15:00", subcourse: "databaser", title: "Lektion 2 (grupp 1&2 / 3&4)", place: "EC2:101", kind: "lektion" },
    { date: "2026-10-15", time: "08:00–12:00", subcourse: "process", title: "Handledning 3", place: "EC2:241 Verona", kind: "handledning" },
    { date: "2026-10-20", time: "10:00–12:00", subcourse: "process", title: "Workshop — processmodellering", place: "MA 3", kind: "workshop" },
    { date: "2026-10-21", time: "13:00 / 15:00", subcourse: "databaser", title: "Laboration 8 (grupp 1&2 / 3&4)", place: "EC2:PC011/015/059", kind: "laboration" },
    { date: "2026-10-23", time: "08:00–12:00", subcourse: "process", title: "Handledning 4", place: "EC2:207 Bilbao", kind: "handledning" },
    { date: "2026-10-27", time: "10:00–12:00", subcourse: "process", title: "Seminarium — gruppuppgift, avstämning", place: "MA 3", kind: "seminarium" },
    { date: "2026-10-28", time: "13:00 / 15:00", subcourse: "databaser", title: "Laboration 9 (grupp 1&2 / 3&4)", place: "EC2:PC011/015/059", kind: "laboration" },
    { date: "2026-11-06", time: "08:00–11:00", subcourse: "strategi", title: "Omtentamen", place: "Skrivsal MA 9", kind: "tenta" },
    { date: "2026-11-09", dateEnd: "2026-11-12", time: "10:00–17:00", subcourse: "databaser", title: "Redovisning av projektuppgift — din bokade tid", place: "EC2:PC059", kind: "redovisning" },
    { date: "2026-11-13", time: "08:00–13:00", subcourse: "process", title: "Tentamen — skriftlig salstentamen", place: "Skrivsal MA 10", kind: "tenta" },
    { date: "2026-11-17", time: "08:00–13:00", subcourse: "databaser", title: "Tentamen — skriftlig salstentamen", place: "Skrivsal MA 9", kind: "tenta" },
    { date: "2026-11-18", time: "14:00–16:00", subcourse: "arkitektur", title: "Föreläsning 1 — Introduktion", place: "EC1:Crafoordsalen", kind: "föreläsning" },
    { date: "2026-11-19", time: "14:00–16:00", subcourse: "sakerhet", title: "Introduktionsföreläsning", place: "EC1:Crafoordsalen", kind: "föreläsning" },
    { date: "2026-11-20", time: "10:00–12:00", subcourse: "arkitektur", title: "Föreläsning 2", place: "MA 3", kind: "föreläsning" },
    { date: "2026-11-25", time: "08:00–10:00", subcourse: "ansvarsfull", title: "Föreläsning 1 — Introduktion", place: "MA 5", kind: "föreläsning" },
    { date: "2026-11-25", time: "12:00–14:00", subcourse: "arkitektur", title: "Föreläsning 3", place: "EC1:Crafoordsalen", kind: "föreläsning" },
    { date: "2026-11-25", time: "15:00–17:00", subcourse: "sakerhet", title: "Föreläsning 2", place: "MA 5", kind: "föreläsning" },
    { date: "2026-11-26", time: "10:00–12:00", subcourse: "ansvarsfull", title: "Workshop — Harvard Business Simulation Game", place: "EHL:Online", kind: "workshop" },
    { date: "2026-11-27", time: "14:00–19:00", subcourse: "arkitektur", title: "Tentamen — skriftlig salstentamen", place: "Skrivsal MA 10", kind: "tenta" },
    { date: "2026-12-01", time: "13:00 / 15:00", subcourse: "ansvarsfull", title: "Seminarium 1 (klassgrupp 1&2 / 3&4)", place: "EC2:101", kind: "seminarium" },
    { date: "2026-12-03", time: "08:00–13:00", subcourse: "sakerhet", title: "Tentamen — skriftlig salstentamen", place: "Skrivsal MA 10", kind: "tenta" },
    { date: "2026-12-08", time: "14:00–15:00", subcourse: "isprojekt", title: "Föreläsning 1 — Introduktion till IS-projektet", place: "EC1:Crafoordsalen", kind: "föreläsning" },
    { date: "2026-12-15", dateEnd: "2026-12-16", time: "09:00 / 13:00", subcourse: "isprojekt", title: "Handledning 1 — bokad tid", place: "EC2:241 Verona", kind: "handledning" },
    { date: "2027-01-05", time: "08:00–13:00", subcourse: "databaser", title: "Omtentamen", place: "Skrivsal MA 10", kind: "tenta" },
    { date: "2027-01-07", time: "08:00–13:00", subcourse: "process", title: "Omtentamen", place: "Skrivsal MA 9", kind: "tenta" },
    { date: "2027-01-11", dateEnd: "2027-01-12", time: "09:00 / 13:00", subcourse: "isprojekt", title: "Handledning 2 — bokad tid", place: "EC2:241 Verona", kind: "handledning" },
    { date: "2027-01-13", time: "14:00–19:00", subcourse: "arkitektur", title: "Omtentamen", place: "Skrivsal MA 10", kind: "tenta" },
    { date: "2027-01-14", time: "08:00–13:00", subcourse: "sakerhet", title: "Omtentamen", place: "Skrivsal Sparta", kind: "tenta" }
  ]
};
```

## Regler för datat

- Schemat är avläst 1 aug 2026 och är inte en levande källa. Ändra inte datum, tider eller salar på eget initiativ — hittar du en inkonsekvens, flagga den för användaren.
- Listan `sessions` innehåller de pass som fanns bokade i TimeEdit vid avläsningen. Delkurserna i november har färre pass bokade än de sannolikt kommer att ha, vilket är förväntat. Skriv inte in gissade pass, och låt vyn tåla att en delkurs har få eller inga pass.
- `weeks[].sessions` är antal pass användaren faktiskt går på (parallella grupper räknas som ett pass). Räkna inte om värdet ur `sessions`-listan — det skulle ge fel siffra eftersom laborationer och lektioner ges i två grupper.

## Acceptanskriterier

- [ ] `npm run build` går igenom; inga konsolfel.
- [ ] Schema är sjunde fliken; navigationsraden är horisontellt scrollbar under 640 px.
- [ ] Nedräkningskortet visar rätt nästa examination, korrekt antal dagar, och beredskapsraden för delkurser med `contentId`.
- [ ] De tre tidstillstånden fungerar: före terminsstart (visar "Terminen börjar om N dagar"), under terminen (passerade tentor nedtonade med hake), efter 14 jan 2027 (nedräkningsraden på Hem döljs). Verifierat genom tillfällig stubbning av `today()`, som är borttagen i slutkoden.
- [ ] Dagsberäkningen är korrekt över sommartidsskiftet 25 oktober 2026 — testa `daysUntil` från 24 okt till 26 okt.
- [ ] Terminsöversikten renderas med CSS grid utan diagrambibliotek, med idag-markör och rätt delkursfärger.
- [ ] Belastningsdiagrammet visar alla 20 veckor med rätt färg per `load`, och tomma veckor som streck.
- [ ] Hela schemat: gruppering per vecka, alla filter fungerar och kan kombineras, "Bara framåt" är förvalt under terminen men inte före terminsstart.
- [ ] Tentor och obligatoriska pass är visuellt särskilda. Flerdagarspass (`dateEnd`) visas som intervall, inte som en dag.
- [ ] Ingen färg är enda informationsbärare — varje färgmarkering åtföljs av text.
- [ ] Hem visar nedräkningsraden överst; Statistik visar dagar till tenta per delkurs med innehåll.
- [ ] Källhänvisningen längst ned läser `schedule.verifiedOn`.
- [ ] Mobilvänligt, synlig fokusring, reduced motion respekterat, all UI-text på svenska.

Bygg klart, kontrollera de tre tidstillstånden och minst två filterkombinationer i webbläsaren, verifiera mot listan ovan och sammanfatta sedan kort vad du byggt.
