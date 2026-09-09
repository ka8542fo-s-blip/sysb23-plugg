# Överlämning — SYSB23 Plugg

Du tar över en avslutad arbetsperiod (senaste svepet 2026-09-08). Allt nedan
är byggt, testat i webbläsare och driftsatt; verifiera inget i onödan. Läs
avsnitten "Regler", "Ogranskat", "Frågor till Björn" och "Medvetet inte
byggt" innan du rör innehåll.

## Vad projektet är

Pluggsida för kursen SYSB23 (Lunds universitet, Ekonomihögskolan). Vite +
React 18 + Tailwind, ren SPA utan backend. All progress i `localStorage`
under prefixet `sysb23:`. All UI-text på svenska.

- **Repo:** https://github.com/ka8542fo-s-blip/sysb23-plugg (publikt; `gh` är inloggad som ka8542fo-s-blip)
- **Live:** https://ka8542fo-s-blip.github.io/sysb23-plugg/ — varje push till `main`
  bygger och publicerar via `.github/workflows/deploy.yml` (~40 s). Vänta in
  körningen med `gh run watch` och verifiera live efter varje push.
- **Dev-server:** `preview_start {name: "sysb23-plugg"}` (`.claude/launch.json`), port 5173.
- **Test:** `npm test` = 95 fall (node:test, `scripts/*.test.mjs`), alla gröna 2026-09-08.
- **Kursmaterialet ligger lokalt, aldrig i repot:** decken i
  `~/Desktop/Skola/SKOLA T3/___Lectures_export` (nya HT26-decken Fö1, Fö2–3,
  Fö4, Fö5, Fö6, Fö7 och övningshäftet `sysb23-database-exercises.pdf`),
  extentorna i `~/Desktop/Skola/SKOLA T3/Previous_e_ams_export` (omtentan
  24 okt 2025, uppsamlingen 25 maj 2026; ordinarie 16 sep 2025 finns som
  riktig export i `~/Downloads/`, filen i exportmappen är en trasig
  Inspera-laddningssida på 35 KB). Läs PDF:er med pdf-parse i scratchpad;
  understrykningar i häftets facit syns bara om sidorna renderas som bilder
  (`render.swift` i scratchpad gjorde det). Promptfilerna
  `CC-prompt-stor-uppdatering-tentan.md`, `CC-prompt-modellverkstad.md` och
  `cc-prompt-fo4-ht2026-uppdatering.md` är gitignorerade eftersom de återger
  Björns material; övriga prompt-md-filer ligger publikt (användaren informerad).

## Arkitekturen — manifestet styr allt

`src/data/index.js` är sanningen. Varje delkurs har `views` (vilka flikar den
får; Hem och Schema är globala), sitt innehåll och `readingIntro`/`examNote`.
Navigation, Hem-genvägar, statistik och "Plugga till denna tenta" läser
manifestet — inga delkursvillkor utspridda i koden. **id ≠ nummer** för
kapitel: allt UI läser `chapter.number`.

## Vad sajten innehåller

| Delkurs | Status | Har |
|---|---|---|
| strategi | komplett | 11 kapitel (kap `digital` = nr 9 ur Weavers föreläsning 1; kap9/kap10 är nr 10/11), 14 ämnen, 124 termer, 71 frågor (designregler i filens kommentar, mätskript `scripts/check-fragebank.mjs`), 4 essäer, `practiceBy: "chapter"`. Tillägg 2026-09-09 ur Weavers föreläsning 2: kapitel 2 value creation/value capture, kapitel 6 stuck in the middle + omskrivet RBV-avsnitt med VRIO och de tre imitationshindren + nya avsnitt "Dynamiska förmågor" (Teece: sensing/seizing/transforming) och "Sex sätt att nå uthållig konkurrensfördel" + omskrivet Mintzberg-avsnitt med Waters fem termer och Honda/Netflix, kapitel 8 hållbarhetens tidslinje (CSRD) och "Tre termer att hålla isär: CSR, TBL och ESG" (internt/externt är det som prövas). Sju frågor str-q67…73, sju ordlistetermer, essächecklistan för lärande organisation har de tre godtagbara perspektiven |
| databaser | komplett mot tentan | se nedan |
| process, arkitektur, sakerhet | kommande | platshållare i manifestet |

**Databaser** (`views: las, sql, modell, ova, statistik`; Prov medvetet borta):

- **Läs:** 10 kapitel i `data/databaser/reading.js` — id/nummer: kap1=1
  (grunder, med "Så ser tentan ut"), kap2=2, kap3=3, kap4=4, kap5=5,
  svaga=6 (svaga entiteter, Crow's Foot, "Att läsa påståenden ur ett
  diagram" med tre genomgångar), kap6=7 (transformation, sex regler),
  kap7=8 (normalformer med tentans två former), kap8=9 (fysisk design med
  tentans instruktioner för uppgift 2), kap9=10 (SQL: att resonera fram en
  fråga, byggt baklänges från uppgift 4). 12 ämnen i `topics.js`, 109
  ordlistetermer, 14 SVG-figurer (`components/knowledge/diagrams/`,
  `[[diagram:namn]]` som ensamt stycke; namnen i `ids.js` är ett API mot
  reading.js, låst av `scripts/diagram-ids.test.mjs`).
- **Öva:** 65 frågor i `questions.js`, fördelade 4/4/5/7/7/7/5/10/7/9 på
  kapitel 1–10 (omviktat mot tentan 2026-09-07), former: vanliga, med
  `diagram` (ett av sajtens diagram som underlag) och med `context`
  (förformaterat block). Två frågor parkerade i `questions-pending.js`
  (db1-12, db1-14 — Fö1-mekanik utanför kapitlen). Balanstestet
  `scripts/fragebank-balans.test.mjs`: 4–10 per kapitel, spridning ≤ 1,25
  utom `LENGTH_FLAGGED` (db4-12, 14, 26 med skäl), positioner, kvot
  0,9–1,1, unikt längst ≤ 25 %, giltiga diagram-id, under hälften "Ja" per
  diagram. Öva utan pass: se "Vyer och särdrag".
- **SQL-verkstad:** 62 övningar i 10 nivåer (`sqlExercises.js`); nivå 9
  `tenta` "Tentaform: en fråga, ett resultat" (sql-54…62) på schemat
  Reader/Book/HasRead(Rating) i `hospitalSeed.js`; nivå 10 (id n9) ligger
  över tentans nivå. Slumpövningar och fritt läge. T-SQL först, översatt
  till SQLite (`lib/tsql.js`).
- **Modellera:** tre flikar som tentans modelleringsuppgifter.
  *Läsa diagram* (uppgift 1): `statementExercises.js`, tre uppgifter, en
  per diagram i kapitel 6 (föreningen, biblioteket, rederiet), tio
  påståenden var med under hälften sanna, tentans poängregel i
  `lib/statementScore.js` (+5/−3/0, alla och endast de sanna = 25, summan
  golvad vid 0), per påstående skäl; klar när markeringen är exakt rätt.
  *ER-diagram till schema*: `modelExercises.js`, häftets 4–9 plus egen
  uppgift 10 (kedjade svaga entiteter), rättaren `lib/modelCheck.js`
  (mängdjämförelse, FK på vad de refererar, namn =
  anmärkning, facit som alternativ), live-vy i häftets form
  (`SchemaView.jsx`), figurer i `components/model/` (Chen + Crow's Foot i
  Visual Paradigm-stil; entitetsruta pine, nyckel brass, relationslinjer
  och N-märke i delkursens koboltblå — användarkrav 2026-09-09 på tydligare
  färger). **Inmatningsformen (2026-09-09, användarkrav):** föreläsningens
  blockform som Björn skriver den — `Teacher(`, attributen ett per rad,
  `CK₁ = {…}`, `PK = CK₁`, `FK (…) REF T(…)`, avslutande `)` på egen rad;
  släpande komman och tabbar tillåtna, små siffror ₀–₉ = vanliga, `PK1 =
  CK1` och `FK` utan kolon tillåtna, `{a, b)` tolereras. `unfoldBlocks` i
  modelCheck.js vecklar ut blocken med originalradnummer i felen;
  enradsformen fungerar fortfarande. Kodrutan `SchemaEditor.jsx`: mörk
  yta (ink/paper-tokens), radnummer, Tab/Shift+Tab indrag, Enter behåller
  indraget och drar in efter "(", knappar ₁–₄ och Option/Alt + siffra (även Ctrl + siffra) sätter in
  små siffror; etiketten säger ⌥ Option på Mac. Facit visas efter Rätta även vid tolkningsfel. OBS:
  browserpanelens `key`-verktyg når inte Reacts onKeyDown — testa
  tangenterna med dispatchade KeyboardEvent i javascript_tool. *Normalisering till 3NF*: `normalizeExercises.js`,
  häftets 11–13 som 38 poster, val 1NF/2NF/"R är redan i 3NF",
  FD-motorn `lib/normalize.js` (hölje, kandidatnycklar, högsta normalform
  med kapitel 8:s motivering, projicerade beroenden, lossless två i taget,
  beroendebevarande) härleder regeltaggar och "varför"; extra relation
  vars attribut ryms i en facitrelation = övernormalisering. Framsteg för
  alla tre: `sysb23:modell:<id>` = "solved", nollställs bara via knapp.
  Tester: `model-check`, `model-figures`, `normalize`, `statements`.
- **Statistik**, **Schema (Pluggkalender)** och **Hem** som för Strategi.

## Regler (följ dem)

**Innehållsregeln:** ändra aldrig fakta, definitioner eller schemadata på
eget initiativ — kursmaterialet är sanningen, och innehållet är extraherat
ordagrant där det är definitioner (normalformerna, Chens
entity-definition, identifier, partial identifier, value set,
femfrågetabellen, Crow's Foot-listan). Inför inga termer utanför kursen:
**ingen BCNF, inga "spurious tuples", ingen FLOAT** (decket säger exakta
mot approximativa numeriska typer). Lossless join definieras som att
naturlig join ger tillbaka originalet; kursbokens tvåitaget-kontroll är
enda regeln utanför decken och texten säger att den kommer från boken.
Sakfel rapporteras, rättas inte utan beslut. Grep-gate som ska ge noll i
`reading.js`/`topics.js`:
`mandatory participation|non-mandatory|\bUML\b|\bEER\b|specialis|generalis|disjoint|overlapping|\bStudent|\bCourse|\bUniversity|\bOffer|\bTeacher|HasStudied|\bGrade\b|\bmentor|lärare|BCNF|spurious|FLOAT`
(SQL-verkstadens Student/Course/HasStudied är SQL-föreläsningens egna och
ska vara kvar där).

**Inga slidehänvisningar i det läsaren ser** (användarkrav 2026-09-07):
inte i kapiteltext, kärnpunkter, fallgropar, ordlista, lektioner eller
uppgiftstexter. De hör hemma i `sources`/`source`, i HANDOFF och i
redovisningar. Svept 2026-09-08: enda kvarvarande "slides" i läsartext är
tentans hjälpmedelsregel (utskrivna slides tillåtna), som är ett faktum om
tentan. Läs decken som en föreläsning, inte som en specifikation — frågan
är vad Björn ville få fram; extentorna visar vad som betyder något.

**Dataregeln:** `topics.js` äger alla korta punkter (`keyPoints`,
`pitfalls`), `reading.js` äger löptexten och ordlistan; kapitelavsluten
renderas ur `primaryTopics` via `lib/topicLookup.js`. Ändra alltid båda
tillsammans. Kärnpunkternas form: en punkt = ett begrepp, "Begrepp:
förklaring", `LeadIn.jsx` fetar inledningen före första kolonet (högst 48
tecken).

**Fö4-konventioner (kap4–6):** total/partial participation (aldrig
mandatory), identifying relationship, partial identifier, cardinality
ratio; ratio-etiketter anger endast maxima och läses tvärs över,
deltagandelinjer vid egen ände, "exakt en" = 1 plus dubbel linje. Exempel
Employee/Project/ProjectTask/Assignment. UML och EER är ute ur kursen.

**Frågeregler:** inga ändringar av stam eller alternativ utan mandat; nya
frågor `reviewed: false`; längsta alternativ bör vara en distraktor;
undvik kategoriska distraktorer; `LENGTH_FLAGGED` kräver skäl.

**Design ("Läsesalen"):** fylld pine-yta = valt tillstånd + vyns enda
huvudåtgärd; allt klickbart har hover; inga nya färger (delkursfärgerna är
en validerad helhet); Fraunces rubriker, Inter brödtext; desktop ≥1024 px
har 17 px-rot med px-omskrivningar sist i `index.css`; mobil intakt.

**Commit:** svenska meddelanden med imperativ rubrik och varför-stycke,
trailer `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`, push,
`gh run watch`, verifiera live. DOM-verifiering i browserpanelen
(skärmdumpar kan vara tomma), rensa testdata i localStorage, ta bort
`__STUB_IDAG`-stubbar efter tidstest.

## Tentaformatet (det viktigaste vi vet)

Tre HT25-tentor lästa (ordinarie 16 sep 2025, omtentan 24 okt 2025,
uppsamlingen 25 maj 2026): exakt samma fyra uppgifter och viktning. Fem
timmar, 100 p, Inspera, hjälpmedel utskrivna slides + boken. A 85/B 75/
C 65/D 55/E 50. 1) Läsa Chen-diagram, 25 p: 10–12 påståenden, +5/−3 per
markering, 0 blankt, 25 vid alla och endast de sanna (4–6 sanna); fem
påståendetyper plus flerstegspåståenden och ordinarie tentans "identifieras
endast av kombinationen av 1. …, 2. samt …, 3. samt …" över en kedja av
svaga entiteter. 2) DDL från ER, 25 p: alla kolumner INTEGER, reserverade
ord utskrivna, inga constraintnamn krävs, IDENTITY(1,1) på vanliga och
svaga entiteter men inte kopplingstabeller, indenterat. 3) Normalformer,
20 p: 3a–e sant/falskt à 2 p (−1 fel, 0 blankt) om R + scheman (2NF,
beroendebevarande, lossless, >1 kandidatnyckel, alla i 3NF,
primärattribut/kandidatnyckel i delrelation); 3f–g à 5 p högsta normalform
med motivering ur definitionerna, normalisera till 3NF, övernormalisering
ger avdrag, och ett 3g där rätt svar är att inte göra något. 4) En
SQL-fråga, 30 p: Student/Course/HasStudied, join + aggregat + GROUP BY/
HAVING, "X men inte Y", skalär underfråga, och ordinarie tentans jämförelse
mot ett aggregat ur en underfråga ("högre än snittbetyget på kurs C1").
Inte förekommit: application development (listas i kursintroduktionen),
logisk modell som eget svar, relationsalgebra, Crow's Foot som produktion.
Kap 1 har "Så ser tentan ut" med gränserna: 3a–e svara alltid; uppgift 1
markera vid mer än ungefär 40 % säkerhet (brytpunkt 3/8).

## Ogranskat (mot kursmaterialet)

- **Öva:** 43 av 65 frågor bär `reviewed: false` — dbq-01…12 (kapitel
  1–3, skrivna mot kapiteltexten 2026-09-05) och dbq-33…62 (de 30 nya från
  omviktningen 2026-09-07, inklusive diagram- och context-frågorna och de
  fyra SQL-frågorna db1-11/13/15/16). Flaggan syns inte i UI.
- **SQL-verkstaden:** sql-54…62 (tentaspåret), facit verifierade i motorn
  men uppgiftstexterna ogranskade. sql-62 är den nya med aggregat som
  jämförelsevärde (resultat B1 med 3 läsare, B2 med 2).
- **Modellera / Läsa diagram:** alla tre påståendeuppgifterna
  (`reviewed: false` i datat) — påståenden och skäl skrivna mot sajtens
  egna diagram, inte mot en tenta.
- **Kapitel 6, genomgång 3** (rederiet) och figuren `pastaenden-rederi`,
  kapitel 8:s tillägg 2026-09-08 (kandidatnyckel i 3e-regeln, "När rätt
  svar är att inte göra något" — exemplet är verifierat i FD-motorn: fyra
  enkla kandidatnycklar, 3NF) och kapitel 10 är skrivna mot decken men
  inte granskade av användaren.
- **Granskade:** kapitel 7–9 mot Fö5/Fö6/Fö7 + häftet (2026-09-05),
  kapitel 2, 3, 7 omskrivna mot nya Fö5 (2026-09-07). Kapitel 1–6 väntar
  på användarens granskning.

## Frågor till Björn (öppna)

1. **Häftets facit 12:9** (normalisering): facit ger R4(B, D), men
   A → B, B → C, D → C ger kandidatnyckeln {A, D}; B → D gäller inte, och
   joinen av R1(A, B) och R4(B, D) över B ger tupler som inte fanns i R.
   R4(A, D) är nyckelrelationen. Sajten godtar båda tills svaret kommit
   (`variants` i `normalizeExercises.js`, `KEY_ISSUES` i testet). Samma
   fråga i förbigående: 11:8 saknar understrykningar i facit (PK härledd
   {A, B}, C, D). 11:2 är inget tryckfel (B ↔ C ger två giltiga PK-val).
2. **Surrogatnycklarnas plats:** kursintroduktionen lägger dem i logisk
   design, föreläsningen om logisk design nämner dem inte, häftet och
   kapitel 9 lägger dem i fysisk design, fråga db1-07 följer
   kursintroduktionen. Kapitel 3 och 7 säger "kursen har placerat dem
   olika, på tentan kommer de i uppgift 2". Rätta inte förrän Björn svarat.

Känt men inte en fråga: Fö5:s sammanfattning av normaliseringssteget
("every non-trivial determinant is a key") är BCNF-liknande; kursen
använder 2NF/3NF-definitionerna och sajten följer dem. Fö5:s DDL-exempel
har naturliga nycklar som PRIMARY KEY och namngivna constraints; tentan
kräver surrogatnycklar och inte namn — kapitel 9 följer tentan.

## Medvetet inte byggt, och varför

- **Prov-fliken för Databaser:** tentan är konstruktionsbaserad, inte
  flerval. Öva prövar förståelse av läsmaterialet utan poäng. Tas tillbaka
  bara om tentaformatet visar sig vara flerval.
- **Automatisk "annan giltig nedbrytning" i normaliseringen:** FD-motorn
  kan pröva lossless och beroendebevarande, men övernormaliseringar klarar
  nästan alltid båda proven och ger ändå avdrag på tentan. Facit är
  därför enda måttet; härledda PK-alternativ (`pkAlso`) är tillagda där
  relationen har fler kandidatnycklar än facit strukit under, efter
  häftets eget mönster i 11:7 och 11:11.
- **Spaced repetition, poäng, streaks och pass i Öva:** användarbeslut —
  tillståndet är per fråga, klar = två rätt i rad, ingen viktad slump,
  inget svårighetsfilter, ingen dagsintervall.
- **"Markera alla sanna" som frågetyp i Öva:** byggd i Modellera i
  stället (Läsa diagram), eftersom uppgiften rättas som helhet med poäng
  och kräver ett helt diagram — det är en verkstadsform, inte en
  kvizzfråga. Öva har kvar diagramfrågor i flervalsform.
- **Kapitel om application development:** har inte förekommit på någon
  tenta.
- **Björns bilder i repot:** alla diagram är ritade om med sajtens
  primitiver; kursmaterialet publiceras aldrig.
- **Synk av progress mellan enheter:** ingen backend, medvetet.
- **Generalisering/specialisering i kapitel 7:** ute ur kursen sedan nya
  Fö4; nya Fö5 har inte heller med det.

## Vyer och särdrag

- **Hem** — WeekAtAGlance (nedräkning + kompakt veckorad, innevarande
  vecka måndag–söndag, öppen dag alltid idag vid laddning och midnatt),
  statusrutor, genvägar ur `views`.
- **Läs (KnowledgeHub)** — Kompendium/Begrepp/Ordlista + sökning. Ordlistan
  per kapitel som standard. Databaser har `examArea`-etikett per kapitel;
  filtret "Visa bara tentarelevanta kapitel" döljer sig när alla kapitel
  är relevanta. Läsprogress i kapitel och procent; `{lästid}` i intron
  räknas ur `readingMinutes` (`lib/readingTime.js`). Tangentbord J/K/N/P/
  Esc. Uppläsning (`lib/useReadAloud.js`): styckvis talsyntes, markerar
  stycke utan autoscroll, `data-tts-skip` undantar menyer och figurer,
  flytande pill med paus/stopp/hastighet, klickbara stycken; vid hopp
  nollas onend/onerror före cancel().
- **Tentaprioritet** (Strategi, `lib/examPriority.js`) — `examPriority`
  karna/essa/bakgrund per ämne, `examEvidence` bara där repot dokumenterar
  underlaget. Informerar, styr inte.
- **Öva** — "Öva utan pass": tillstånd per fråga i `sysb23:answers`
  (`{ seen, correct, wrong, last, lastAt, recent }`), klar = två senaste
  rätt (`lib/practiceQueue.js: isDone`), "Fortsätt öva" serverar fel som
  senaste svar först, sedan obesvarade, sedan de med ett rätt; karens
  COOLDOWN = 8 serverade frågor (`settings.practiceRecent`), viker när kön
  är kortare. Översikt först ("klara per kapitel/totalt"), nollställning
  per delkurs. Gruppering via `lib/practiceAxis.js` (`practiceBy:
  "chapter"` = Öva speglar Läs). QuestionCard renderar `diagram` och
  `context`; chipen "Ogranskad" är borttagen.
- **Prov** (Strategi) — +6/−1/0, balanserad dragning, deadline-timer,
  lever i App-state (försvinner vid omladdning, avsiktligt).
- **SQL** — sql.js/WASM, färsk databas per körning. T-SQL först:
  `lib/tsql.js` översätter (TOP → LIMIT, ISNULL/SUBSTRING/LEN/GETDATE,
  `+` → `||` vid text, IDENTITY → AUTOINCREMENT, hakparenteser, GO),
  `checkTsqlRules` stoppar GROUP BY-brott. Seeden i T-SQL, `sqliteSeed()`
  (COLLATE NOCASE). Rättning `lib/sqlCheck.js`: radordning ignoreras utom
  `ordered`, dubbletter räknas, formkrav ger "Nästan." (semikolon, `names`,
  `requires`). `note`-fältet renderas under uppgiften (T-SQL-skillnader: AVG
  över INT, TOP, +). Slumpövningar (`lib/sqlGenerator.js`, 20 familjer,
  varje kandidat körs innan den visas). Schemapanel med InfoTips ur
  `schemaGlossary.js`. WASM kopieras av `scripts/copy-sql-wasm.mjs`.
- **Modellera** — se ovan. Layout som verkstaden: uppgiftslista (Läsa
  diagram och ER: rader; normalisering: sifferknappar per häftesuppgift),
  underlag, inmatning, Rätta, resultatpanel, facit efter rättning.
- **Schema (Pluggkalender)** — data i `src/data/schedule.js` (TimeEdit
  2026-08-30), passlista ovanför tentaöversikten (2026-09-07), Lista/
  Kalender (`schemaVy`), månadskalender i Google-stil med dagdialog,
  varningsperioder i brass, tentaanmälan (`examreg:<examId>`, deadline
  alltid härledd = tentadatum − 7 dagar), `lib/dates.js` Europe/Stockholm,
  `lib/useToday.js` reaktivt datum. "Plugga till denna tenta" byter delkurs
  och går till första vyn i `views`.
- **Tentaöversikt** (`ExamTimeline.jsx`) — vertikal tidslinje med glapp,
  ≤ 7 dagar = "Tätt", ordinarie/omtentor via chip.
- **Statistik** — InfoTips ur `data/statTerms.js`, måste följa beräkningarna.

## Schemabevakning (GitHub Actions)

`.github/workflows/schema-check.yml` måndagar 06:00 UTC + manuellt: hämtar
`TIMEEDIT_URL`, normaliserar via `scripts/timeedit-parse.mjs` (fixtur i
`scripts/fixtures/`), jämför med `schedule.sessions`, öppnar issue
`schemabevakning` vid skillnad. Ändrar aldrig schemadata; enda skrivningen
är `lastChecked`, och deploy triggas uttryckligen efter den pushen.

## Lagringsnycklar

`answers`, `exams`, `essays`, `settings` (bl.a. `practiceRecent`,
`practiceOrder`, `practiceTopics`), `lasSegment`, `delkurs`, `schemaVy`,
`upplasningstakt`, `upplasningsrost`, `sqlSlump`, `read:<kurs>:<kapitel>`,
`sql:<övningsId>` (= "solved" | "solved-with-help"), `modell:<uppgiftsId>`
(= "solved"; mod-, norm- och stmt-id), `examreg:<examId>`. "Nollställ min
data" i Statistik rensar allt. Progress är per webbläsare och domän.

## Kända egenheter (inte buggar)

- Provet försvinner vid omladdning — avsiktligt.
- Kapitlet `kap6` (nr 7) har inga egna ordlistetermer; gruppen utelämnas
  korrekt i kapitelsorterad ordlista.
- hp-talen i `schedule.js` summerar till 20, inte 30 — flaggat, orört.
- `DELETE FROM Patient` stoppas av FK i fritt läge — korrekt.
- Konsolen i dev visar en gammal React-varning om dubbla nycklar i
  röstväljaren (`ChapterView`, två röster som heter "Alva (svenska
  (Sverige))") — kosmetiskt, beror på webbläsarens röstlista.
- Skärmdumpar i browserpanelen kan vara eftersläpande/tomma; DOM gäller.

## Noterat om Strategis frågebank (2026-09-09)

Banken har 71 frågor, inte 73 som tilläggsprompten räknade med: str-q55 och
str-q56 ströks tidigare på användarens begäran som dubbletter i kapitel 3
("Vad är egentligen företagets mål?"). Numreringen går till 73 med två
luckor. De sju nya frågorna är inklistrade ordagrant. Positionsbalansen
föll först (21/24/15/11 mot bandet 12–23 för n = 71), eftersom ingen av de
nya frågorna hade rätt svar på plats D och fyra hade det på plats B; rätt
svar i str-q70 och str-q71 flyttades därför till plats D genom att byta
plats med alternativet på den platsen — samma texter, ny ordning. Mätning
efteråt: unikt längst 19/71 (27 %), längdkvot 1,01, positioner 21/22/15/13,
största spridning 1,24 (str-q70). Alla inom gränserna.

## Nästa steg

- Användarens granskning av det ogranskade (listan ovan), i första hand
  Öva-frågorna dbq-33…62 och påståendeuppgifterna.
- Björns svar på de två frågorna; därefter stryk R4(B, D)-varianten i
  12:9 respektive rätta surrogatnyckelnoteringen i kapitel 3 och 7.
- Fler delkurser (process, arkitektur, säkerhet) enligt samma mall: data +
  manifestrad, ingen ny kod.
