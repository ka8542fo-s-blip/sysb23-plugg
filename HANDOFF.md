# Övergångsprompt — SYSB23 Plugg

Du tar över en pågående session. Läs detta, verifiera ingenting av det i onödan —
allt nedan är byggt, testat i webbläsare och driftsatt. Fortsätt där det slutar.

## Vad projektet är

Pluggsida för kursen SYSB23 (Lunds universitet, Ekonomihögskolan). Vite + React 18
+ Tailwind, ren SPA utan backend. All progress i `localStorage` under prefixet
`sysb23:`. All UI-text på svenska.

- **Repo:** https://github.com/ka8542fo-s-blip/sysb23-plugg (publikt; `gh` är inloggad som ka8542fo-s-blip)
- **Live:** https://ka8542fo-s-blip.github.io/sysb23-plugg/ — varje push till `main`
  bygger och publicerar via `.github/workflows/deploy.yml` (~40 s). Vänta in körningen
  med `gh run watch` och verifiera live efter varje push.
- **Dev-server:** `preview_start {name: "sysb23-plugg"}` (finns i `.claude/launch.json`), port 5173.

## Arkitekturen — manifestet styr allt

`src/data/index.js` är sanningen. Varje delkurs har `views` (vilka flikar den får;
Hem och Schema är globala), sitt innehåll och `readingIntro`/`examNote`. Navigation,
Hem-genvägar, statistik och "Plugga till denna tenta" läser manifestet — inga
delkursvillkor utspridda i koden.

**Delkursernas läge just nu:**

| Delkurs | Status | Har |
|---|---|---|
| strategi | komplett | 10 kapitel, 13 ämnen, 90 termer, 49 frågor (omskrivna 2026-08-07 så längd/position inte läcker svaret), 4 essäer |
| databaser | delvis | 8 kapitel, 8 ämnen, 64 termer, SQL-verkstad (32 övningar), **`questions.js` är en tom array** — frågebanken kommer i en egen prompt; Öva/Prov visar tomlägen och "Öva på detta"-knappar i Läs är dolda tills den fylls |
| process, arkitektur, sakerhet | kommande | platshållare i manifestet |

**Dataregeln (helig):** `topics.js` äger alla korta punkter (`keyPoints`, `pitfalls`).
`reading.js` äger löptexten och har ALDRIG egna recap-arrayer — kapitelavsluten
("Kärnan i korthet"/"Se upp för") renderas ur kapitlets `primaryTopics` via
`lib/topicLookup.js`. `topics` = allt kapitlet berör (styr "Öva på detta kapitel"),
`primaryTopics` = det kapitlet introducerar (styr avslutet). Ingen komponent läser
punkter direkt ur datafilerna.

**Innehållsregeln:** ändra aldrig fakta, definitioner eller schemadata på eget
initiativ — innehållet kommer ur prompt-md-filer i reporoten och är extraherat
**ordagrant** (verifiera byte-identiskt efter extraktion, det är arbetssättet).
Normalformernas definitioner och engelska facktermer i Databaser är ordagranna med
flit. Flagga inkonsekvenser i stället (redan flaggad: hp-talen i `schedule.js`
summerar till 20, inte 30 — medvetet orört).

## Vyer och särdrag

- **Hem** — WeekAtAGlance (nedräkning + kompakt 7-dagarsrad, klicka fram en dag),
  statusrutor, genvägar byggda ur `views`.
- **Läs (KnowledgeHub)** — tre segment: Kompendium/Begrepp/Ordlista + gemensam
  sökning. Ordlistan sorteras per kapitel som standard, A–Ö som val. Databaser har
  `examArea`-etiketter per kapitel + tentabanner (fältet saknas = ingen etikett
  alls; null = "Utanför tentan"). Sedan föreläsarens besked 2026-08-31 görs
  tentan om och väntas täcka det mesta — alla kapitel har områdesetikett
  (kap1 = "Grund"), och filtret "Visa bara tentarelevanta kapitel" döljer sig
  självt eftersom det bara visas när något kapitel är utanför (hasBackground). Läsprogress
  mäts i **kapitel och procent, aldrig minuter** (per kapitel står "ca X min").
  Tangentbord i kapitel: J/K/N/P/Esc. **Uppläsning** (`lib/useReadAloud.js`):
  webbläsarens talsyntes läser kapitlet styckvis (svensk röst väljs via
  `lang: sv-SE`) och markerar aktuellt stycke (`.tts-aktuell`) — medvetet
  UTAN autoscroll, läsaren styr själv var på sidan stycket är;
  `data-tts-skip` undantar menyer/metarader; hastighet sparas i
  `upplasningstakt`, valt röstnamn i `upplasningsrost` (naturliga röster
  à la Edge "Natural/Online" föredras automatiskt, InfoTip förklarar hur
  man får bättre gratisröster); kapitelbyte/avmontering stoppar alltid
  rösten. Vid uppläsning ersätts headerkontrollerna av en flytande pill
  (fixed bottom) med paus/stopp/hastighet; mellanslag pausar (utom när
  fokus står på knapp/fält). Styckena blir klickbara under uppläsning
  (`.tts-block`, pekare + hover) — klick hoppar dit direkt, även ur paus.
  OBS: vid hopp nollas den pågående utterancens onend/onerror FÖRE
  cancel() — de avfyras asynkront och tolkar annars hoppet som stopp.
- **Öva** — viktad repetition (fel 3×, osedd 2×, rätt 1×), sidopanel med filter på desktop.
- **Prov** — +6/−1/0, balanserad dragning (max 2/ämne), deadline-baserad timer,
  provet lever i App-state (överlever flikbyte, medvetet INTE omladdning),
  dubbelinlämningsspärr, Betygsmätare (SVG, gränser 50/55/65/75/85).
- **SQL** (Databaser) — sql.js/WASM. Lazy-laddad, **färsk databas per körning**.
  Rättning i `lib/sqlCheck.js`: alias ok, radordning ignoreras utom `ordered: true`,
  dubbletter räknas, DML rättas via `check`-frågan. WASM kopieras av
  `scripts/copy-sql-wasm.mjs` (pre-dev/-build; filen heter `sql-wasm-browser.wasm`
  i webbläsarbygget — binärerna är gitignorerade). Kör-knappen är `btn-emphasis`
  längst till höger. Schemapanelen har InfoTip på varje tabell/kolumn (beskrivningarna
  i `schemaGlossary.js` är lästa ur seeden — hitta inte på egenskaper).
- **Schema (Pluggkalender)** — data i `src/data/schedule.js` (avläst ur TimeEdit,
  senast 2026-08-30; bevakningen larmar om ändringar). Fem perioder varav två
  med `warning: true` (9–17 nov och 18 nov–3 dec — Säkerhet flyttade sin start
  till 10 nov, mitt i redovisningsveckan). Tunga sträckan tonas i gult i
  terminsöversiktens tidslinje, varningsperioder får brass-tonade kort, och
  pågår en varningsperiod visas en banner överst i Schema-vyn. Passlistan har vyväxling Lista/Kalender
  (SegmentedControl, sparas i `schemaVy`); månadskalendern (`MonthCalendar.jsx`)
  delar filtren med listan, börjar veckor på måndag, visar flerdagarspass på
  varje täckt dag och är låst till terminens månader. Google Kalender-stil:
  hela veckor med angränsande månaders dagar nedtonade men klickbara,
  hårlinjerutnät (gap-px på `--line`), chips med tid+titel i cellerna på
  desktop (fyllt rött = tenta, delkurständ vänsterkant annars), prickar på
  mobil, veckonummer i vänsterkanten ≥ sm, "idag"-knapp när man bläddrat
  bort. Dagklick öppnar en dialogruta med dagens pass (tid, titel, sal,
  tenta-/obligatorisk-chips) — stängs med Esc, kryss eller klick utanför,
  fokus återvänder till dagcellen, sidan bakom skrollåses. Öppen dag =
  fylld pine-cirkel på dagnumret, idag = mässing. Datumlogik i `lib/dates.js`: Europe/Stockholm,
  UTC-midnattsdiffar (sommartidssäkert), ISO-veckor. `lib/useToday.js` gör datumet
  reaktivt (minutkoll + fokus) så öppna flikar slår över vid midnatt.
  "Plugga till denna tenta" väljer ALDRIG läge åt användaren — den byter delkurs
  och går till första vyn i `views` (Läs-TOC för båda), med tillbakalänk som bara
  lever i vy-state. **Tentaanmälan:** deadline härleds ALLTID i kod
  (`registrationDeadline` i `lib/dates.js` = tentadatum − 7 dagar, aldrig lagrad;
  "omkring" i texterna är avsiktligt — exakt gräns finns bara i Ladok, länka inte).
  Kryssruta "Anmäld" per examination (`examreg:<examId>`); nedräkningskortet
  framhäver anmälan tills deadlinen passerats/kryssats, sedan tentan. Passerad
  deadline på okryssad kommande tenta = neutral text, aldrig rött larm. Hem-raden
  visar närmaste okryssade deadline i stället för tentan när den är närmast
  (kan tillhöra en senare tenta — novembertentorna ligger tätare än sju dagar).
- **Tentaöversikt** (`ExamTimeline.jsx`, i Schema efter nedräkningskortet) —
  vertikal tidslinje med tentorna i följd: glappet i dagar utskrivet mellan
  varje par, linjelängden skalad efter glappet (20–88 px), ≤ 7 dagar ger
  brass-linje + "Tätt"-chip. Ordinarie som standard, omtentor via chip-toggle
  (glappen räknas om). Passerade tentor tonas ned med ✓ avklarad.
- **Statistik** — InfoTips (frågetecken) förklarar varje term; texterna i
  `data/statTerms.js` är skrivna mot koden och måste följa med om beräkningar ändras.

## Design ("Läsesalen") och användarens uttalade preferenser

Tokens i `src/index.css` (+ 7 delkursfärger `--c-*`). Fraunces för rubriker, Inter
för brödtext — sekundär text i rubriker sätts i Inter, inte Fraunces.
Delkursfärgerna är en validerad helhet (jämn kulörspridning + växlande ljushet,
kontrollerad parvis även för rödgrönt färgseende; rött reserverat för tentor) —
ändra aldrig en färg isolerat, se kommentaren vid tokens i `index.css`.

- **Fylld pine-yta = valt tillstånd + vyns ENDA huvudåtgärd.** Genvägar/åtgärder
  bland likadana knappar får aldrig fyllas (därav `btn-emphasis`).
- **Allt klickbart ska ha hover** — global regel även för inputs. Detta är ett
  uttryckligt användarkrav; bryt det inte.
- **Desktop först i praktiken:** container `max-w-7xl`; vid ≥1024 px är html-roten
  17 px och de fasta px-storlekarna skrivs om i blocket **sist** i `index.css`
  (ordningen är poängen — det slår utilities). Mobilen (16 px-rot) ska förbli intakt;
  spot-checka 375 px för sidoscroll.
- InfoTip (frågetecken) svarar på hover + fokus + tryck, positioneras deterministiskt
  ur knappens läge, kläms innanför skärmen.
- Vald delkurs sparas (`sysb23:delkurs`) och återställs vid omladdning.

## Schemabevakning (GitHub Actions)

`.github/workflows/schema-check.yml` kör måndagar 06:00 UTC + manuellt
(workflow_dispatch). Hämtar repovariabeln `TIMEEDIT_URL` (ri-URL:en med .json),
normaliserar via `scripts/timeedit-parse.mjs` (enhetstester + verklig fixtur i
`scripts/fixtures/`, kör `npm test`), jämför delpass från idag med
`schedule.sessions` — sammanslagna poster (grupp-tider "A / B", `dateEnd`)
vecklas ut till TimeEdits granularitet — och öppnar ett issue märkt
`schemabevakning` vid skillnader. Jobbet ändrar ALDRIG schemadata automatiskt;
enda skrivningen är stämpeln `lastChecked` i `schedule.js` (visas i Schema-vyns
fotnot), och efter den pushen triggas deploy-workflowet uttryckligen (pushar
med GITHUB_TOKEN startar det inte själva). Parsern felar högt och tydligt vid
formatändringar — gissa aldrig i den, och uppdatera fixturen + förväntansfilen
ihop om TimeEdit ändrar format.

## Lagringsnycklar

`answers`, `exams`, `essays`, `settings`, `lasSegment`, `delkurs`, `schemaVy`
(= `"lista"` | `"kalender"`), `upplasningstakt`, `upplasningsrost`,
`read:<kurs>:<kapitel>`, `sql:<övningsId>`
(= `"solved"` | `"solved-with-help"`), `examreg:<examId>` (= `true`, nyckeln
tas bort vid avbockning).
"Nollställ min data" i Statistik rensar allt. Progress är per webbläsare och domän
— ingen synk, medvetet val.

## Arbetssätt (följ detta)

1. Bygg (`npm run build`) och **verifiera i webbläsaren** före varje leverans —
   DOM-mätningar via javascript_tool är pålitligare än skärmdumpar (panelen laggar
   ibland och ger tomma/gamla bilder; lita på DOM).
2. Tidstillstånd testas genom att tillfälligt stubba `today()` med
   `window.__STUB_IDAG` i `lib/dates.js` — **ta alltid bort stubben efteråt**
   (grep "STUB" ska ge noll).
3. Testdata i localStorage rensas efter test.
4. Committa med svenska meddelanden (imperativ rubrik + varför-stycke) och
   `Co-Authored-By: Claude <noreply@anthropic.com>`-trailer enligt systemreglerna,
   pusha, `gh run watch`, verifiera live.
5. SQL-ändringar: kör alla 32 lösningar mot motorn igen (mönster finns i historiken —
   node-skript med sql.js + `checkExercise`).

## Kända egenheter (inte buggar)

- Provet försvinner vid omladdning — avsiktligt (en tenta pausas inte).
- Kapitel 6 i Databaser har inga egna ordlistetermer (transformationstermerna hör
  till kap 5 i datat) — gruppen utelämnas korrekt i kapitelsorterad ordlista.
- Prompt-md-filerna ligger publikt i repot (användaren informerad).
- `DELETE FROM Patient` stoppas av FK i fritt läge — korrekt beteende.
- Skärmdumpar i browserpanelen kan vara eftersläpande/tomma; DOM-verifiering gäller.

## Närmast väntat

Frågebank för Databaser (egen prompt kommer): fyll
`src/data/databaser/questions.js` enligt schemat i `strategi/questions.js`
(4 alternativ, `explain` per alternativ, `reviewed`), så vaknar Öva/Prov och
"Öva på detta"-knapparna av sig själva. Frågorna ska följa designreglerna i
kommentaren överst i `strategi/questions.js` (jämnlånga alternativ, jämn
positionsfördelning, inga skämtdistraktorer) och verifieras med
`node scripts/check-fragebank.mjs src/data/databaser/questions.js`.
Därefter sannolikt fler delkurser enligt samma mall (data + manifestrad,
ingen ny kod).
