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
| strategi | komplett | 11 kapitel (kap `digital` = nr 9, infogat 2026-09-03 ur Weavers föreläsning 1; kap9/kap10 är nr 10/11 — **id ≠ nummer**, allt UI läser `chapter.number`), 14 ämnen, 117 termer, 66 frågor (designregler i filens kommentar; mätskript `scripts/check-fragebank.mjs`), 4 essäer |
| databaser | delvis | 9 kapitel (Fö4 = `kap4`, `kap5`, `svaga` = nr 4–6, omskrivna 2026-09-05 efter HT2026 års Fö4-deck; `kap6`–`kap8` är nr 7–9 — **id ≠ nummer**), 11 ämnen, 90 termer, 11 inline-SVG-figurer i kapitel 4–6, SQL-verkstad (53 övningar i 9 nivåer, utökad 2026-09-02 efter SQL-föreläsningen), **57 övningsfrågor som speglar Läs** (`practiceBy: "chapter"`: nio kapitel = nio kvizzar, 6–7 frågor var, omgjort 2026-09-05 enligt `CC-prompt-ova-speglar-las.md`), 6 SQL-frågor parkerade i `questions-pending.js` i väntan på ett kapitel om frågespråket, **Prov-fliken är medvetet borttagen ur manifestet** (tentan är konstruktionsbaserad, Öva prövar förståelse av läsmaterialet — inget poängsystem) |
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

- **Hem** — WeekAtAGlance (nedräkning + kompakt veckorad, klicka fram en dag),
  statusrutor, genvägar byggda ur `views`. Veckoraden visar **innevarande
  vecka måndag–söndag** (`startOfWeek` i `lib/dates.js`), inte sju dagar
  framåt: passerade dagar tonas ned, rubriken bär veckonumret.
- **Läs (KnowledgeHub)** — tre segment: Kompendium/Begrepp/Ordlista + gemensam
  sökning. Ordlistan sorteras per kapitel som standard, A–Ö som val. Databaser har
  `examArea`-etiketter per kapitel + tentabanner (fältet saknas = ingen etikett
  alls; null = "Utanför tentan"). Sedan föreläsarens besked 2026-08-31 görs
  tentan om och väntas täcka det mesta — alla kapitel har områdesetikett
  (kap1 = "Grund"), och filtret "Visa bara tentarelevanta kapitel" döljer sig
  självt eftersom det bara visas när något kapitel är utanför (hasBackground). Läsprogress
  mäts i **kapitel och procent, aldrig minuter** (per kapitel står "ca X min").
  Kompendiets intro innehåller platshållaren `{lästid}` som `ChapterList` byter
  mot summan av `readingMinutes`, avrundad till närmaste tio minuter
  (`lib/readingTime.js`, t.ex. "1 timme och 50 minuter") — skriv aldrig in
  lästiden som fast text igen.
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
- **Tentaprioritet** (Strategi, `lib/examPriority.js`) — varje ämne har
  `examPriority`: `karna` (prövat som flervalsfråga HT24/quiz F1), `essa`
  (prövat som essä) eller `bakgrund` (aldrig prövat); ett ämne kan ha både
  karna och essa. Kapitel ärver unionen av sina `primaryTopics` — bakgrund
  bara när inget ämne prövats. Etiketter (konturchips: Kärna pine, Essä brass,
  Bakgrund dämpad) visas på begreppskort och kapitelrader. `examEvidence`
  ({ mcq, quiz, essay }) ger raden "Prövat HT24: N flervalsfrågor" och är
  **bara ifylld där repot dokumenterar underlaget** (HT24-märkta frågor, quiz
  F1-frågor, de fyra HT24-essäerna) — hitta aldrig på siffror; saknas
  underlag uteblir raden. Prioriteten informerar, den styr inte: Snabbspår i
  kompendiets TOC tonar ned bakgrundskapitel ("Läs om tid finns") men döljer
  inget och räknar om lästiden, och Tentafokus i Öva viktar kärnämnen ×2 utan
  att ta bort frågor. Delkurser utan `examPriority` (Databaser) ser ut som
  förut. Tester: `scripts/exam-priority.test.mjs`.
- **Öva** — viktad repetition (fel 3×, osedd 2×, rätt 1×), sidopanel med filter på desktop.
  **Gruppering (`lib/practiceAxis.js`):** Öva filtrerar per ämne (Strategi)
  eller per kapitel (Databaser, manifestets `practiceBy: "chapter"` — "Öva
  speglar Läs": ett kapitel i Läs = en kvizz i Öva, samma ordning och namn).
  Frågorna bär alltid `topic`; i kapitelläget härleds kapitlet ur ämnets
  `chapter`, så topics.js och Begrepp (elva kort) är orörda. Allt som
  grupperar — filtret, räknarna, "Öva på detta"-knapparna, Statistik/Hem —
  går via `practiceGroups`/`groupKeyFor`/`groupsForTopics`, aldrig via
  `question.topic` direkt. **Ordning** (`practiceOrder` i settings): "Blandat"
  = viktad repetition som förut, "Kapitel för kapitel"/"Ämne för ämne" =
  `orderByGroup` — passet följer Läs-ordningen och bankens ordning inom
  gruppen, utan viktning. Testat i `scripts/practice-axis.test.mjs`. Inställningarna `practiceTopics`/`practiceDifficulty`
  är globala — val som hör till en annan delkurs ignoreras. Banker utan
  `explain` per alternativ eller utan `difficulty` stöds fortfarande
  (`ExplanationPanel`/`QuestionCard` anpassar sig), men **Databaser-banken
  följer nu mallens format rakt av** (`data/databaser/questions.js`):
  57 frågor, 6 per kapitel utom kap4/kap5/svaga som har 7 (godkända sjunde
  frågor db4-13, db4-25, db4-34), alla besvarbara enbart ur kapiteltexten,
  `reviewed: false` på de 30 som skrevs mot kapiteltexten 2026-09-05 (dbq-)
  tills användaren granskat dem. Regeln vid tillägg: 5–8 frågor per kapitel,
  principer inte exempel, inget som saknar kapitel i Läs (SQL-frågespråket
  och application development saknar kapitel — parkerade SQL-frågor ligger i
  `questions-pending.js`). `LENGTH_FLAGGED` listar behållna frågor där en
  distraktor är längst med spridning > 1,25 (får stå); balanstestet
  `scripts/fragebank-balans.test.mjs` låser spegling (5–8 per kapitel),
  spridning ≤ 1,25 utom flaggade, positioner, kvot 0,9–1,1 och unikt längst
  ≤ 25 %. Sakfel i frågor rapporteras, rättas inte utan beslut.
  Prov-beroende ytor (Hem "Så räknas tentan", Statistik "Provhistorik") visas
  bara när delkursen har `prov` i `views`.
- **Prov** — +6/−1/0, balanserad dragning (max 2/ämne), deadline-baserad timer,
  provet lever i App-state (överlever flikbyte, medvetet INTE omladdning),
  dubbelinlämningsspärr, Betygsmätare (SVG, gränser 50/55/65/75/85).
- **SQL** (Databaser) — sql.js/WASM. Lazy-laddad, **färsk databas per körning**.
  **T-SQL först (2026-09-02, användarbeslut):** kursen kör SQL Server/Azure SQL,
  så användaren ser och skriver bara T-SQL. `lib/tsql.js` översätter till
  SQLite precis före körning (TOP/SET ROWCOUNT → LIMIT, ISNULL/SUBSTRING/LEN/
  GETDATE, `+` → `||` när en operand är text enligt schemat eller en
  strängliteral, IDENTITY(1,1)+PK-constraint → AUTOINCREMENT, [hakparenteser],
  TRUNCATE, GO) och `checkTsqlRules` stoppar GROUP BY-brott med SQL Servers
  eget felmeddelande, eftersom SQLite annars är slapp. Seeden i
  `hospitalSeed.js` är skriven i T-SQL och översätts av `sqliteSeed()`
  (textkolumner får COLLATE NOCASE = SQL Servers standardcollation, så
  `= 'lund'` matchar). Facit, ledtrådar och lektioner nämner aldrig SQLite;
  dialektrutorna och `dialectNotes.js` är borta, en fotnot i Fritt läge
  förklarar motorn. Nya testmotorer MÅSTE bygga databasen med
  `sqliteSeed(hospitalSeed)`. Tester: `scripts/tsql.test.mjs`.
  Rättning i `lib/sqlCheck.js`: radordning ignoreras utom `ordered: true`,
  dubbletter räknas, DML rättas via `check`-frågan. **Formkrav** (2026-09-02)
  ger "Nästan." (brasston, räknas inte som löst) när resultatet stämmer men
  formen inte: avslutande semikolon krävs alltid; `names: true` kräver att
  kolumnnamnen matchar facit (uppgifter som säger "som Namn"); `requires:
  ["EXISTS"]` kräver att konstruktionen förekommer (uppgifter som säger
  "skriv den med …"). Flaggorna sätts per övning i datat och i generatorns
  familjer — testade i `scripts/sql-check.test.mjs`. WASM kopieras av
  `scripts/copy-sql-wasm.mjs` (pre-dev/-build; filen heter `sql-wasm-browser.wasm`
  i webbläsarbygget — binärerna är gitignorerade). Kör-knappen är `btn-emphasis`
  längst till höger. Schemapanelen har InfoTip på varje tabell/kolumn (beskrivningarna
  i `schemaGlossary.js` är lästa ur seeden — hitta inte på egenskaper).
  Tre lägen: Övningar · **Slumpövningar** · Fritt läge. Slumpläget
  (`components/sql/PracticeMode.jsx`) bygger uppgifter ur schemat med
  `lib/sqlGenerator.js` (20 mallfamiljer, deterministiskt frö) och
  `lib/sqlPractice.js`, som läser verkliga värden ur databasen och **kör
  varje kandidats lösning innan den visas** — tomma, degenererade (filtret
  släpper igenom allt), för stora och kursidentiska frågor kastas och
  slumpas om. Rör aldrig kursövningarnas progress; egen räknare i `sqlSlump`.
  Testat i `scripts/sql-generator.test.mjs` (200 genererade övningar rättas
  som rätt) — kör `npm test` efter ändringar i generatorn.
  Domslutet efter en körning visas i `ResultBanner` ovanför tabellerna och
  går att kryssa bort; `ResultPanel` bär bara detaljerna. Varje övning kan
  nollställas (`clearSqlResult`), och Tab i redigeraren gör indrag (Esc
  lämnar fältet).
  53 övningar i 9 nivåer (nivå 9 = korrelerade frågor/EXISTS hard mode);
  ("Björn säger"-fälten ur v2-prompten togs bort 2026-09-02 på användarens
  begäran — det viktiga ska stå i lektionerna och ledtrådarna).
  sql.js bundlar SQLite 3.49.1, så RIGHT/FULL OUTER JOIN (sql-43/44) körs på
  riktigt. Heltalsdivision verifierad (25000/12 = 2083) och dubbletträkningen
  gör att UNION nekas där UNION ALL krävs (sql-51).
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

## Databaser Fö4 (HT2026) — konventioner som ska hålla

Kapitel 4–6 (`kap4`, `kap5`, `svaga`) är skrivna efter Björns nya
116-slidesdeck. Källorna `cc-prompt-fo4-ht2026-uppdatering.md` och
`fo4-conceptual-database-design-ht2026.md` kom i `files.zip`, som ligger
ospårad i reporoten och INTE är incheckad (prompten vill inte publicera
Björns material). Regler för allt Fö4-innehåll (kap4–6, ämnena metamodell/
er/relationstyper/svaga/crowsfoot och deras ordlistetermer):

- **Termer:** total/partial participation (aldrig mandatory/non-mandatory),
  identifying relationship (svag relationstyp bara som alias), partial
  identifier, cardinality ratio. Ratio-etiketter anger ENDAST maxima (1 =
  högst en) och läses tvärs över; deltagandelinjer läses vid egen ände —
  "exakt en" = 1 plus dubbel linje. Fö4-kapitlen skriver 1:N; 1:M lever
  kvar i transformationskapitlet (annan föreläsning) och texten säger att
  det betyder samma sak.
- **Exempel:** Employee/Project/ProjectTask/Assignment med WorksOn, Leads,
  ResponsibleFor, Supervises (supervisor/report), Contains, AssignedTo.
  Student/Course finns inte i Fö4-innehållet — MEN SQL-verkstadens
  Student/Course/HasStudied är SQL-föreläsningens egna exempel och ska vara
  kvar. Kap1:s kravtext "exakt en avdelning" är en verksamhetsregel, inte
  en ratio-läsning; lämna.
- **Ute ur kursen:** UML-jämförelsen och EER/specialisering — lägg inte
  tillbaka. Min–max-tupler är en Chen-variant, inte UML.
- **Ordagrant** ur decket: Chens entity-definition, identifier-definitionen,
  partial identifier, value set, femfrågetabellen (slide 37) och slide
  111-listan över vad Crow's Foot kodar direkt/indirekt. Övrig prosa är
  fritt skriven kring exakt terminologi (användarbeslut 2026-09-05 — sy
  inte ihop sammanfattningens formuleringar med bindetext).
- Ternär relation är kvar, förankrad i metamodellens 2..* deltaganden och
  degree. "Flervärdesattribut eller egen entitet" är kvar från förra året
  (inte motsagt av decket).
- Grep-gate som ska ge noll i `reading.js` och `topics.js`:
  `mandatory participation|non-mandatory|\bUML\b|\bEER\b|specialis|generalis|disjoint|overlapping|\bStudent|\bCourse|\bUniversity|\bOffer|\bTeacher|HasStudied|\bGrade\b|\bmentor|lärare`
  ("mandatory attribute" är däremot en riktig term från slide 31).

**Diagram** (`src/components/knowledge/diagrams/`): `erPrimitives.jsx`
(EntityBox, RelationshipDiamond, AttributeOval, Connector, Ratio, Role,
Note, Arrow, CrowEntity/CrowMarks/CrowLine, PopulationSet, Figure) och
`erFigures.jsx` (11 namngivna figurer). Kapiteltexten bäddar in en figur
med raden `[[diagram:namn]]` som ensamt stycke — `ChapterView`s
p-renderare byter ut den, `knowledgeSearch` rensar den ur utdrag och
uppläsningen hoppar över figuren (`data-tts-skip`). **Namnen i `ids.js`
är ett API mot reading.js** — byt aldrig ett namn utan att byta
platshållaren; `scripts/diagram-ids.test.mjs` låser att varje
platshållare har en figur, att varje figur används och att platshållaren
står ensam på raden. Färger via tokens (`--pine`/`--brass`/`--ink`), inte
currentColor — appen har ett ljust tema. Populationsvyer märks "inte
Chen-notation" i bildtexten. Visuell kontroll när browserpanelen är tom:
bundla `erFigures.jsx` med esbuild (`NODE_PATH=node_modules`,
`--platform=node --format=cjs --jsx=automatic`), rendera med
`react-dom/server`, byt tokens mot hex och skärmdumpa SVG:erna med headless
Chrome (`--headless=new --screenshot`) — gjort 2026-09-05.

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
(= `"lista"` | `"kalender"`), `upplasningstakt`, `upplasningsrost`, `sqlSlump` (antal lösta slumpövningar),
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
- Kapitlet `kap6` (nr 7, Transformation) i Databaser har inga egna ordlistetermer
  (1:1/1:N/M:N-termerna hör till kap5 i datat) — gruppen utelämnas korrekt i
  kapitelsorterad ordlista.
- Kompendiets kapitel 3 (ur gamla Fö5/Fö7) placerar surrogatnycklar i fysisk
  design; nya Fö1 (slide 73–74) säger logisk och fysisk, och fråga db1-07
  följer Fö1. Skillnaden är känd och medvetet orörd i kapitel 3 — nya Fö5 kan
  komma och säga annat. Rätta inte på eget initiativ.
- **Kursmaterialet ligger lokalt, inte i repot:** decks och övningshäfte med facit
  i `~/Desktop/Skola/SKOLA T3/Databaser Kursfiler/` (02_Lectures/*.pdf,
  04_Labs-and-Exercises/sysb23-database-exercises.pdf). Läs dem med pdf-parse
  installerad i scratchpad (Read-verktyget saknar poppler). Publicera aldrig
  materialet i repot.
- **Kapitel 9 (fysisk design) är granskat mot Fö7-decket, coding-standards.pdf och
  häftets uppgift 18–22 med DDL-facit 2026-09-05.** FLOAT finns inte i
  kursmaterialet — decket säger exakta mot approximativa numeriska typer; använd
  de orden. Hålen mot DDL-uppgiften är fyllda 2026-09-05 med avsnittet "Från
  logisk modell till DDL: vad facit kräver" (NOT NULL för entitetsintegritet
  och totalt deltagande, vilka tabeller som får surrogatnyckel, svag entitets
  DDL, unära FK-kolumner; CASCADE, versaler och Table+ID på en rad var).
  Granskningen av Databaser är pausad efter kapitel 7–9; kapitel 1–6 återstår.
- **Kapitel 7 (transformation) är granskat mot Fö5-decket (05-logical-database-design.pdf)
  och häftets uppgift 4–9 med facit 2026-09-05.** Kursens notation i facit:
  primärnyckel = hel understrykning, främmande nyckel = prickad — inte kursiv.
  Fö5-decket är fortfarande den gamla trions (Svensson/Hultman/Uçan) och har
  generalisering/specialisering + UML-transformation (slide 58–63) som kapitlet
  medvetet saknar sedan nya Fö4 tog bort EER; avvakta nya Fö5 innan något
  läggs till.
- **Kapitel 8 (normalformer) är granskat mot Fö6-decket och facit 2026-09-05.**
  Kursen har bara 1NF–3NF — inför inte BCNF. "Spurious tuples" är inte kursens
  term; lossless join definieras som att naturlig join av delrelationerna ger
  tillbaka originalet (slide 61). Dependency preservation: ett beroende är
  bevarat om båda attributen finns i samma relation (slide 63) — decket gör
  inget generellt påstående om 3NF. 2NF-genvägen "är kandidatnyckeln
  sammansatt? nej → 2NF kan inte brytas" (slide 41/45) är hur uppgifterna
  löses; kapitlet säger "alla kandidatnycklar enkla". Frågeformatet
  "högsta normalform (1NF–3NF)" är tentans (häftets uppgift 10–13).
- Prompt-md-filerna ligger publikt i repot (användaren informerad).
- `DELETE FROM Patient` stoppas av FK i fritt läge — korrekt beteende.
- Skärmdumpar i browserpanelen kan vara eftersläpande/tomma; DOM-verifiering gäller.

## Närmast väntat

Beslut om ett Läs-kapitel om SQL-frågespråket (och ev. application
development): får Databaser ett sådant kapitel skrivs de parkerade
SQL-frågorna om till mallens format och kapitlet får sina sex frågor —
resonemangsfrågor (vad returnerar frågan, IN mot EXISTS vid NULL, <> i
self-join, vy utan ORDER BY), inte skrivövningar (verkstaden har dem).
Nya kapitel i Läs får alltid sex frågor mot kapiteltexten. Prov ska inte
tillbaka för Databaser om inte tentaformatet visar sig vara flerval.
Därefter sannolikt fler delkurser enligt samma mall (data + manifestrad,
ingen ny kod).
