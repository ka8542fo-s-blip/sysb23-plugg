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
- **Test:** `npm test` = 285 fall (node:test, `scripts/*.test.mjs`), alla gröna 2026-10-09.
- **Kursmaterialet ligger lokalt, aldrig i repot:** decken i
  `~/Desktop/Skola/SKOLA T3/___Lectures_export` (nya HT26-decken Fö1, Fö2–3,
  Fö4, Fö5, Fö7). **Fö6 finns i HT2026-version sedan 2026-09-30:**
  `06-normalization-and-normal-forms-new.pdf` (152 bilder, Beamer, bara
  Björn; användaren flyttar den dit — låg först i
  `~/Downloads/___Lectures_export (1)/`). Gamla `06-normal-forms-normalization.pdf`
  är ersatt och ska inte användas som källa. Övningshäftet ligger bredvid, i
  `~/Desktop/Skola/SKOLA T3/sysb23-database-exercises.pdf` (inte i exportmappen),
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
| process | aktiv (2026-09-29) | se "Processorienterad verksamhetsutveckling (BPM)" nedan |
| arkitektur, sakerhet | kommande | platshållare i manifestet |

**Databaser** (`views: las, sql, modell, tenta, ova, statistik`; Prov medvetet borta):

- **Läs:** 11 kapitel i `data/databaser/reading.js` — id/nummer: kap1=1
  (grunder, med "Så ser tentan ut"), kap2=2, kap3=3, kap4=4, kap5=5,
  svaga=6 (svaga entiteter, Crow's Foot, "Att läsa påståenden ur ett
  diagram" med tre genomgångar), kap6=7 (transformation, sex regler),
  kap7=8 (normalformer med tentans två former), kap8=9 (fysisk design med
  tentans instruktioner för uppgift 2), kap9=10 (SQL: att resonera fram en
  fråga, byggt baklänges från uppgift 4), kap10=11 (applikationsutveckling:
  Java och JDBC, 2026-10-08, ur Fö8–9 efter Björns besked att HT26-tentan
  har en Java-fråga; ämnet `applikation` med `examWeight: "låg"`). 13 ämnen
  i `topics.js`, 125 ordlistetermer, 14 SVG-figurer (`components/knowledge/diagrams/`,
  `[[diagram:namn]]` som ensamt stycke; namnen i `ids.js` är ett API mot
  reading.js, låst av `scripts/diagram-ids.test.mjs`).
- **Öva:** 73 frågor i `questions.js`, fördelade 4/4/5/7/7/7/5/10/7/9/8 på
  kapitel 1–11 (omviktat mot tentan 2026-09-07; kapitel 11:s dbq-63…70
  tillagda 2026-10-08), former: vanliga, med
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
- **Modellera:** fyra flikar som tentans modelleringsuppgifter.
  *Läsa diagram* (uppgift 1): `statementExercises.js`, fyra uppgifter, en
  per diagram i kapitel 6 (föreningen, biblioteket, rederiet), tio
  påståenden var med under hälften sanna, plus häftets uppgift 3
  (`stmt-haftet3`, 12 påståenden, 7 sanna enligt häftets facit, undantagen
  från tentaformens gränser i `statements.test.mjs`; figuren är modell-
  figuren `stmt-haftet3`, `Statements.jsx` ritar via `ExerciseFigure`), tentans poängregel i
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
  enradsformen fungerar fortfarande.
  *ER-diagram till DDL* (2026-10-05, tentans uppgift 2): `ddlExercises.js`,
  häftets 18–22 (18 omritad i Chen från häftets UML) plus E1–E4 på
  befintliga figurer (förening = kapitel 9:s facit, bibliotek, rederi,
  Festival). Vy `views/DdlModeling.jsx`, rättare `lib/ddlCheck.js`: egen
  parser för CREATE TABLE-delmängden (inte tsql.js/sql.js — IDENTITY och
  PK-constrainten försvinner i toSqliteDdl, SQLite är slappare och
  felraderna skulle peka på omskriven kod). Jämför struktur: tabeller via
  namn/alias (skiftläge, _, å/ä/ö fälls) eller kolumnöverlapp, FK-kolumner
  via måltabell (unära par som multimängd), PK och UNIQUE som mängder.
  Facit är strukturdata (kind entity/weak/junction/multivalued, surrogate,
  columns, fks med notNull/rel/tag, unique, oneToOneUnique), `folded` =
  relationer som blir FK-kolumner (förklarar en överflödig tabell),
  `composites`. Fel bär regeltaggar (surrogat, naturlig nyckel, svag
  entitet, total deltagande, 1:N, M:N, unär, flervärt) plus tabellens
  "varför". Facit skrivs ut av `toDdl` i tentans form, refererade tabeller
  först. Tester: `ddl-check.test.mjs`. **Häftets facitavvikelser:** 19
  saknar komma i C (efter BID) och R4 (efter DID) — rättat; 21:s 1:1 R3
  har ingen UNIQUE på C.DID — sajtens facit har den, svar utan godtas
  med en anmärkning (oneToOneUnique); 18–22 skapar refererande tabeller före refererade (kör inte i
  den ordningen). Häftets facittext ligger inte i repot.
  Kodrutan `SchemaEditor.jsx` (prop `subscripts={false}` i DDL-fliken): mörk
  yta (ink/paper-tokens), radnummer, Tab/Shift+Tab indrag, Enter behåller
  indraget och drar in efter "(", knappar ₁–₄ och Option/Alt + siffra (även Ctrl + siffra) sätter in
  små siffror; etiketten säger ⌥ Option på Mac. Facit visas efter Rätta även vid tolkningsfel. OBS:
  browserpanelens `key`-verktyg når inte Reacts onKeyDown — testa
  tangenterna med dispatchade KeyboardEvent i javascript_tool. *Normalisering till 3NF* (ombyggd 2026-09-30 till rit- och analysyta):
  `normalizeExercises.js` har 64 poster — häftets 10 (16 relationer,
  `nfOnly`: bara normalform, ingen nedbrytning), 11–13 (38) och 10 egna
  (`exercise: "egen"`, en fälla var i `trap`, visas efter Rätta/Visa
  facit). **FD-motorn** `lib/fd.js` körs i appen och i testerna: `closure`,
  `allCandidateKeys` (alla), `prime`/`nonPrime`, `isSuperkey`,
  `highestNF` → 1|2|3 + `violations` ({fd, index, type partial|transitive,
  attr, ck, via}) valda bland de GIVNA beroendena (härlett partiellt bara
  om inget givet visar 2NF-brottet), `isLossless` (exakt tablåprov) +
  `losslessSteps` (Fö6:s test två delar i taget som förklaring),
  `isDependencyPreserving`/`dependencyReport` (closure av unionen av
  lokala beroenden, inte "samma relation"), `projectFds`, `relationNF`.
  `lib/normalize.js` bygger motiveringstexterna och faciträttningen av
  nedbrytningen ovanpå den (oförändrad princip: annan nedbrytning än
  facits godtas inte, eftersom övernormaliseringar klarar lossless och DP).
  **Ritytan** `components/fd/FdCanvas.jsx`: eget SVG + pointer events,
  värld 640×420, ruta 46 (`lib/fdDiagram.js`: modell, geometri — pilar åt
  båda hållen ritas som två raka parallella pilar ±7 från mittlinjen, en
  pil som skulle gå genom en annan ruta böjs —, träffprov,
  `compareDrawing` mot givna beroenden som par (vänsterled, attribut),
  `arrowTypes`, autolayout `layoutFromFds`). Verktyg Flytta/Pil;
  hylla + "Lägg ut alla"; pil via handtagsprick eller tryck källa → mål;
  grupp = sammansatt determinant (shift-klick/ram + G/Gruppera, eller
  släpp en ruta på en annan: mittpunkten inom målrutan → ny grupp, inom en
  grupps ram → läggs till; dra ut en ruta ur gruppens ram som den var vid
  dragstart → lyfts ut, en grupp med en ruta kvar upplöses och dess pilar
  flyttas till rutan; `dropOutcome`/`applyDrop`/`leaveGroup`/`joinGroup`
  i `fdDiagram.js`, markering "Släpp: gruppera" + streckad inre ram under
  dragningen; ångra-historiken `historyReducer` ligger också där); Delete,
  ⌘Z/⇧⌘Z, piltangenter, Tab, bokstavstangent sätter bokstav på markerad
  ruta. Inget frihandsläge (borttaget 2026-10-03 med `lib/strokes.js` och
  dess tester). Bokstäver: chips + tangent, ingen handskriftsigenkänning
  (se "Medvetet inte byggt"). "Rita från
  FD:erna" syns först när en pil ritats eller efter "Visa ritahjälp".
  "Kontrollera ritningen": saknade pilar streckade, fel röda. Efter Rätta:
  partiell pil röd med P, transitiv brass med T, legend under. Pilar ser
  alltid likadana ut: en ny pil markeras inte, och en pil du själv klickar
  på får bara en svag kontur (halo) — ingen annan färg eller tjocklek;
  färg kommer bara från Rätta (och från "Kontrollera ritningen", som
  markerar felaktiga pilar röda). "Lägg ut alla" på en tom yta ger ett
  kompakt rutnät (högst tre per rad). Smal yta
  (< 520 px, mätt direkt + resize + ResizeObserver, som inte avfyras i en
  dold flik): kvadratisk vy zoomad mot innehållet. Testa i browserpanelen
  med syntetiska PointerEvent på `svg[data-fd-surface]` (världskoordinater
  → klient via `getScreenCTM()`). Ritningen i
  `sysb23:fdritning:<id>`, svaren i `sysb23:fdsvar:<id>` (svar sparade av
  den återställda 85850cf, med `v: 2`, `step` och `done`, laddas som de är;
  de extra fälten ignoreras — kontrollerat i webbläsaren). **Svarspanelen**
  `FdAnswer.jsx` + rättning `lib/fdGrade.js`: CK (mängd av mängder), PA/NP
  per attribut, NF, motivering (rättas på valt beroende + attribut + typ;
  alla korrekta brytande godtas; engelsk mallmening ur dina egna CK,
  redigerbar), nedbrytning mot facit. **Återkopplingen på nedbrytningen
  (2026-10-08) är klartext** (`lib/decompFeedback.js`), utifrån de tre
  reglerna Kasper lärt sig: en tabell per pilstart med allt den pekar
  direkt på; slå ihop tabeller vars nycklar bestämmer varandra; hela
  kandidatnyckeln i någon tabell, annars nyckeltabell. Rubrik "Rätt" /
  "Nästan – 1 sak att ändra" / "Fel – N saker att ändra", en rad per
  relation (matchad mot facit på attributmängd + PK, inte namn; vald
  facitvariant = den flest relationer stämmer med), sedan det som saknas.
  Feltyper: kedja kvar, del av nyckeln bestämmer, saknad tabell, saknad
  nyckeltabell, övernormaliserat (samma nyckel / nycklar som bestämmer
  varandra), onödig tabell, fel PK, attribut i fel tabell (också när
  stegets tabell redan finns), tabell som saknar attribut, R redan i 3NF,
  okänt attribut, nyckeltabell utan hela nyckeln (12:9, med spurious
  tuples), överflödig tabell med samma nyckel som en annan (13:9). Säger återkopplingen "inget att ändra" fast facit inte
  stämmer läggs facitjämförelsens skäl till som rader (`fdGrade.js`).
  Lossless, DP, closure och NF per tabell ligger i hopfällda "Visa
  detaljer" ("join" i stället för ⋈). Ingen text nämner rättningstekniken.
  Klar = alla fält rätt. **Slumpuppgifter (2026-10-09):** kortet
  "Slumpuppgifter" i sidokolumnen genererar en ny relation
  (`lib/fdGenerator.js`, frö → samma uppgift, mulberry32): 3–6 attribut
  A…, 1–4 beroenden utan överflöd, vald normalform (Valfri = jämnt slumpad
  mellan 1NF/2NF/3NF, annars blir nästan alla 1NF), facit syntetiserat med
  de tre reglerna och alla lokala kandidatnycklar som PK-alternativ;
  uppgiften lämnas bara ut om facit klarar samma prov som häftets
  (`facitIsSound`). Id `norm-slump-<frö>`, `exercise: "slump"`; aktuell
  uppgift i `sysb23:normalisering:slump-aktuell` ({ seed, target }),
  antal lösta i `…:slump-losta` (räknas inte i uppgiftslistans framsteg).
  Ny slumpuppgift tar bort den förras ritning och svar. Efter rättning:
  "Ny slumpuppgift →". Under rättningsrutan: "Nästa: 10:3 →"
  (nästa uppgift i listan, runt om; scrollar upp till uppgiften).
  Öppen flik och Modelleras underflik överlever en omladdning (2026-10-07,
  `sysb23:flik` och `sysb23:modellFlik`; saknar delkursen fliken blir det Hem).
  Facit skrivs (2026-10-07, Kaspers form) med relationen på en rad och
  sänkt siffra, R₁(A, C), sedan CK₁, CK₂ … (kandidatnycklarna räknade ur
  de projicerade beroendena, PK först) och PK = CK₁. Samma
  `toBlockNotation` skriver facit i ER-diagram till schema. Parsern godtar
  alla former.
  Bredvid nedbrytningsrutan visas ritningen i miniatyr (2026-10-07,
  `components/fd/FdMini.jsx`, skrivskyddad, beskuren runt innehållet);
  FdCanvas skickar varje ändring via `onDiagramChange` till Normalizing.
  Rättnings- och facitrutan kan fällas ihop (2026-10-07, "Dölj"/"Visa" i
  rubrikraden) till en rad: "Delvis rätt – 3 av 4 delar" (`partsSummary` i
  fdGrade.js) respektive "Facit – CK {…} · 2NF". Läget sparas per ruta i
  `sysb23:normalisering:rattning-ihopfalld` och `…:facit-ihopfalld`, gäller
  alla uppgifter och behålls när man rättar igen. Definitionspanelen
  `FdDefinitions.jsx` i sidokolumnen. Framsteg för
  alla tre: `sysb23:modell:<id>` = "solved", nollställs bara via knapp.
  Tester: `model-check`, `model-figures`, `normalize`, `fd`, `fd-drawing`,
  `fd-grade`, `decomp-feedback`, `fd-generator`, `statements`.
- **Tenta** (2026-10-09): de tre HT25-tentorna med exakt deras uppgifter
  (`data/databaser/oldExams.js`, vy `views/DbExam.jsx`, poäng
  `lib/examGrade.js`, test `scripts/old-exams.test.mjs`). Startsidan visar
  senaste resultat per tenta och uppgift; i en tenta fyra flikar, Rätta per
  uppgift, "Ändra svaret" låser upp, summa "x av 100" (orättat = 0), "Börja
  om" med bekräftelse. Betyg bredvid summan (`GRADE_LIMITS` i oldExams.js,
  tentornas skala A 85/B 75/C 65/D 55/E 50/U), märkt att det gäller om alla
  uppgifter rättats. Ingen tid, ingen regeltext. Svaren i
  `sysb23:tenta:<id>`. **1:1 i DDL (2026-10-09):** facit har UNIQUE på den
  främmande nyckeln (kursens regel: FK:n ska också vara kandidatnyckel).
  `oneToOneUnique: [{ cols, rel }]` i facit skriver ut UNIQUE, godtar svar
  utan den och ger då en anmärkning — inget avdrag, eftersom häftets 21
  saknar den. Gäller uppsamlingens R5 och Modelleras ddl-21 (R3), som
  tidigare godtog båda utan UNIQUE i facit och utan kommentar (fältet
  `optionalUnique` är borttaget 2026-10-09).
  Uppgift 1: `scoreStatements` (oförändrad — den följde
  redan regeln: +5/−3, golv 0, tak 25, exakt rätt = 25 oavsett antal sanna;
  följd av taket: med sex sanna kostar en felmarkering inget, 27 → 25).
  Uppgift 2: `checkDdl` + uppskattade avdrag (`DDL_DEDUCTIONS`: tabell 5, pk
  3, fk 3, unique 2, notnull 2, surrogat 2, överflödig 3, kolumn 1 — kolumn
  är tillagd, fanns inte i uppdraget); varje fel i ddlCheck bär nu `kind`.
  Uppgift 3a–e: `claim` per påstående avgörs av FD-motorn (`claimTruth`),
  +2/−1/0; 3f–g: FdAnswer (ny flagga `showDiagram={false}`) + `gradeAnswer`,
  uppskattat 2 p NF+motivering (1 p om NF rätt men motivering fel) och 3 p
  nedbrytning (lossless, beroendebevarande, 3NF utan övernormalisering; 3 p
  direkt om facit), i 3NF-fallet 3 p för att inte dela upp. Uppgift 3 golvas
  vid 0. Uppgift 4: sql.js + tsql som verkstaden, rätt resultat 30 p,
  annars 0 + checklista med självbedömd poäng 0–30; godtar SQL Servers
  resultat (`expected`, AVG över INT trunkerat) eller facitfrågans
  SQLite-resultat; uppsamlingen (tomt resultat på tentans data) rättas även
  mot kontrolldata där S4 är 26 år. Diagrammen omritade i
  `modelFigures.jsx` (`tenta-250916-1` … `tenta-260525-2`).
- **Statistik**, **Schema (Pluggkalender)** och **Hem** som för Strategi.

## Regler (följ dem)

**Innehållsregeln:** ändra aldrig fakta, definitioner eller schemadata på
eget initiativ — kursmaterialet är sanningen, och innehållet är extraherat
ordagrant där det är definitioner (normalformerna, Chens
entity-definition, identifier, partial identifier, value set,
femfrågetabellen, Crow's Foot-listan). Inför inga termer utanför kursen:
**ingen BCNF, ingen FLOAT** (decket säger exakta
mot approximativa numeriska typer). "Spurious tuples" är kursvokabulär
sedan 2026-09-30 — nya Fö6 använder termen (lossy-exemplen, sammanfattningen);
spärren gällde gamla materialet och är borttagen ur regeln och grep-gaten. Lossless join definieras som att
naturlig join ger tillbaka originalet för varje population som uppfyller
beroendena; testet för två delar (gemensamma attribut bestämmer en hel
del) och dependency preservation (lokala beroenden medför tillsammans alla
ursprungliga) följer nya Fö6.
Sakfel rapporteras, rättas inte utan beslut. Grep-gate som ska ge noll i
`reading.js`/`topics.js`:
`mandatory participation|non-mandatory|\bUML\b|\bEER\b|specialis|generalis|disjoint|overlapping|\bStudent|\bCourse|\bUniversity|\bOffer|\bTeacher|HasStudied|\bGrade\b|\bmentor|lärare|BCNF|FLOAT`
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
Inte förekommit: application development (listas i kursintroduktionen) —
men Björn har aviserat en Java-fråga för HT26, form och poäng okända,
uppskattat ~10 p (kapitel 1 och 11 säger det). Inte heller: logisk modell som eget svar, relationsalgebra, Crow's Foot som produktion.
Kap 1 har "Så ser tentan ut" med gränserna: 3a–e svara alltid; uppgift 1
markera vid mer än ungefär 40 % säkerhet (brytpunkt 3/8).

## Ogranskat (mot kursmaterialet)

- **Fliken Tenta (2026-10-09):** Kasper har granskat facit för uppgift 1,
  3a–g och 4 mot tentorna (`reviewed: true` per uppgift). DDL-facit i
  uppgift 2 är ogranskat (`reviewed: false`) tills han gjort uppgiften själv;
  de sex omritade diagrammen är kontrollerade mot tentorna. Granskat men
  noterat: Osäkert: ordinarie 1.1 ("måste
  svara chef för minst en annan anställd" — dubbel linje vid chef_för, men
  diagrammet hindrar inte självreferens; satt sant), ordinarie 1.6 ("en bil
  har en unik kombination av namn och id" — två separata identifierare,
  kombinationen unik men inte minimal; satt sant), omtentan 3f (E står i
  både R2(A, D, E) och R3(B, E, F) för att bevara A → E och B → E), omtentan
  3g (R2(C, D, E, F) med CK C och E, inte två relationer), ordinarie uppgift 4 (tolkat som betyget på C1 högre än snittet på C1).
  Poängen för uppgift 2 och 3f–g är uppskattningar.

- **Öva:** 45 av 73 frågor bär `reviewed: false` — dbq-01…12 (kapitel
  1–3, skrivna mot kapiteltexten 2026-09-05), dbq-65 och dbq-70 (kapitel 11,
  omskrivna efter Kaspers granskning 2026-10-08; dbq-63, 64, 66–69 granskade) och dbq-33…62 (de 30 nya från
  omviktningen 2026-09-07, inklusive diagram- och context-frågorna och de
  fyra SQL-frågorna db1-11/13/15/16). Flaggan syns inte i UI.
- **Kapitel 11 (applikationsutveckling, 2026-10-08):** skrivet mot Fö8–9,
  inte granskat av användaren. Kodexemplen följer föreläsningens men är
  förenklade: anslutningssträngen har en dokumentations-IP (192.0.2.10) och
  `password=...` i stället för deckets uppgifter, och `save()` använder
  `getEmployeeNumber()` genomgående (decket blandar `getEmpNo()` och
  `getEmployeeNumber()`). Kapitel 1:s "cirka tio poäng" är en uppskattning,
  inget besked.
- **SQL-verkstaden:** sql-54…62 (tentaspåret), facit verifierade i motorn
  men uppgiftstexterna ogranskade. sql-62 är den nya med aggregat som
  jämförelsevärde (resultat B1 med 3 läsare, B2 med 2).
- **Modellera / Läsa diagram:** alla fyra påståendeuppgifterna
  (`reviewed: false` i datat) — de tre egna skrivna mot sajtens diagram;
  häftets uppgift 3 har sant/falskt ur häftets facit men egna skäl, och
  den omritade figuren `stmt-haftet3` är ogranskad mot förlagan.
- **Modellera / ER-diagram till DDL:** E1–E4 (`reviewed: false`, egna
  facit), de fem omritade figurerna `ddl-18…22` mot häftets sidor 5–9, och
  tolkningen av B:s sammansatta UML-nyckel i 18 som Chen-identifieraren BK.
- **Kapitel 6, genomgång 3** (rederiet) och figuren `pastaenden-rederi`,
  kapitel 8:s tillägg 2026-09-08 (kandidatnyckel i 3e-regeln, "När rätt
  svar är att inte göra något" — exemplet är verifierat i FD-motorn: fyra
  enkla kandidatnycklar, 3NF) och kapitel 10 är skrivna mot decken men
  inte granskade av användaren.
- **Normaliseringens rit- och analysyta (2026-09-30):** de tio egna
  uppgifterna (fällorna och `trap`-texterna), definitionspanelen, kapitel
  8:s omskrivna dependency preservation-stycke (nya Fö6:s exempel) och
  sant/falskt-styckena om beroendebevarande och lossless join, ordlistans
  lossless join, och kapitel 8:s tillägg efter nya Fö6 (anomalierna,
  höljesavsnittet med exemplet, spurious tuples, ordlistans nya termer
  insättningsanomali, spurious tuples, nyckelsökning i fem steg, den nya
  definitionen av funktionellt beroende),
  kärnpunkten och fallgropsraden om beroendebevarande i `topics.js`, tre
  nya ordlistetermer (hölje, superkey, trivialt beroende) och förklaringarna
  (inte alternativen) i dbq-48, som lärde ut "samma relation" som krav.
  Häftets uppgift 10 är avläst och kontrollerad mot sidan som bild.
- **Granskade:** kapitel 7–9 mot Fö5/Fö6/Fö7 + häftet (2026-09-05; Fö6 då
  den gamla decken — kapitel 8 kontrollerat mot nya Fö6 2026-09-30, se
  nedan),
  kapitel 2, 3, 7 omskrivna mot nya Fö5 (2026-09-07). Kapitel 1–6 väntar
  på användarens granskning.

## Frågor till Björn (öppna)

Inga öppna frågor just nu.

Avgjort 2026-10-08 (Björn på föreläsningen om fysisk design: surrogatnycklar "finns bara på fysisk nivå"): kapitel 3, kapitel 9, nyckelpunkterna och ordlistan säger att surrogatnycklar hör till fysisk design och att den logiska modellen använder ER-modellens identifierare som kandidatnycklar. Björn om DEFAULT: krävs inte på tentan, felskrivet ger avdrag — tipset står i kapitel 9:s tentaavsnitt.

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
  prövar lossless och beroendebevarande för din nedbrytning och visar det
  (sedan 2026-09-30), men övernormaliseringar klarar nästan alltid båda
  proven och ger ändå avdrag på tentan. Facit är därför enda måttet för
  rätt/fel; härledda PK-alternativ (`pkAlso`) är tillagda där relationen
  har fler kandidatnycklar än facit strukit under, efter häftets eget
  mönster i 11:7 och 11:11.
- **Frihandsläge och handskriftsigenkänning:** frihandsläget (penna med
  geometrisk streckklassning) byggdes 2026-09-30 och togs bort 2026-10-03.
  $P-igenkänning av bokstäver valdes bort redan från början: 82,5 % träff
  bland sju bokstäver, 91 % bland fyra, 95,7 % bland två på syntetiska
  streck, och en felgissning sätter fel attribut utan att synas.
- **Guidat stegflöde och drag-gester (provat och valt bort av Kasper,
  2026-10-03):** 85850cf byggde om normaliseringen till ett steg öppet åt
  gången (rita, CK, PA/NP, NF, motivering, nedbrytning, med kontroll och
  facit per steg och motiveringen vald genom att trycka på en pil) och en
  rityta utan verktyg och hylla där snabbt drag låda→låda gav pil och
  håll-in/markera + drag grupperade. Kasper föredrog den tidigare vyn med
  alla fält samtidigt; 85850cf är återställd med `git revert` (12f8e29).
  Koden (`lib/fdGesture.js`, `lib/fdSteps.js`, `FdSteps.jsx`) finns kvar i
  historiken om idén tas upp igen.
- **Tunga ritbibliotek (tldraw, Excalidraw):** tldraw kräver licens eller
  vattenmärke, båda är stora; ritytan är eget SVG.
- **Spaced repetition, poäng, streaks och pass i Öva:** användarbeslut —
  tillståndet är per fråga, klar = två rätt i rad, ingen viktad slump,
  inget svårighetsfilter, ingen dagsintervall.
- **"Markera alla sanna" som frågetyp i Öva:** byggd i Modellera i
  stället (Läsa diagram), eftersom uppgiften rättas som helhet med poäng
  och kräver ett helt diagram — det är en verkstadsform, inte en
  kvizzfråga. Öva har kvar diagramfrågor i flervalsform.
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
- **Prov** (Strategi) — HT25-format sedan 2026-09-17: 11 frågor à 5 p, −1/0, betyget räknas på 55 flervalspoäng (essäerna 3 à 15 p, max 300 ord, ligger utanför), balanserad dragning, deadline-timer,
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
  diagram, ER och DDL: rader; normalisering: sifferknappar per häftesuppgift
  10–13 och E1–E10, definitionspanelen under listan),
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

`.github/workflows/schema-check.yml` **varje dag 05:00 UTC** + manuellt:
hämtar `TIMEEDIT_URL` (repovariabel), kör parserns test, normaliserar via
`scripts/timeedit-parse.mjs` och jämför kommande pass med
`schedule.sessions`.
- **Skillnader:** ett öppet issue `schemabevakning`, tilldelat ägaren.
  Samma rapport igen ger ingen ny notis; ändrad rapport kommenteras.
- **Kontrollen misslyckas** (TimeEdit nere, ny länk/format, testfel): ett
  issue `schemabevakning-fel`, tilldelat ägaren, som stängs automatiskt när
  en körning lyckas. Manuell körning med `testa_larm` simulerar ett fel.
- **`lastChecked` stämplas bara när schemat stämmer** med TimeEdit (inte
  vid skillnader). Sajten (`components/schedule/ScheduleTrust.jsx`, i
  Schema och på Hem) visar en röd varning när stämpeln är äldre än två
  dagar — alltså om bevakningen slutat fungera eller skillnader ligger
  oinförda. Daglig stämpel = daglig commit + deploy, vilket också håller
  repot aktivt (GitHub pausar schemalagda körningar efter 60 dagar utan
  aktivitet).
- **Handskrivna delar** (veckoöversikt, tentalista, delkursernas datum)
  låses av `scripts/schedule-consistency.test.mjs`; deploy kör `npm test`,
  så ett schema som inte hänger ihop publiceras inte. Veckoöversikten
  räknar pass som startar i veckan, utan omtentor.
- Bevakningen körde 2026-09-14–28 aldrig jämförelsen (teststeget körde alla
  tester utan `npm ci` och föll på sql.js); lagat 2026-09-29, då fem
  ändringar fördes in.

## Lagringsnycklar

`answers`, `exams`, `essays`, `settings` (bl.a. `practiceRecent`,
`practiceOrder`, `practiceTopics`), `lasSegment`, `delkurs`, `schemaVy`,
`upplasningstakt`, `upplasningsrost`, `sqlSlump`, `read:<kurs>:<kapitel>`,
`sql:<övningsId>` (= "solved" | "solved-with-help"), `modell:<uppgiftsId>`
(= "solved"; mod-, norm- och stmt-id), `examreg:<examId>`, `tenta:<tentaId>`
(svar, rättade uppgifter och senaste poäng i fliken Tenta). "Nollställ min
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
- Sajtens facit avviker medvetet från övningshäftet i 12:9 och 13:9 –
  häftet har fel (användarbeslut 2026-10-08). 12:9: häftets R4(B, D)
  innehåller inte nyckeln {A, D} och är inte lossless; facit har R4(A, D),
  och R4(B, D) underkänns med förklaring. 13:9: häftets R1(A, B, C) är
  överflödig ({A, B} → C följer av {A, B} → D och D → C) och har samma
  nyckel som R2; facit är R1(A, B, D), R2(D, C), och häftets tre tabeller
  underkänns med förklaring. Testsviten prövar varje nedbrytningsfacit:
  3NF, lossless, beroendebevarande, ingen överflödig relation, ingen nyckel
  två gånger, inga nycklar som bestämmer varandra — 12:9 och 13:9 var de
  enda som föll. 11:8 saknar understrykningar i häftets facit (PK härledd
  {A, B}, C, D); 11:2 är inget tryckfel (B ↔ C ger två giltiga PK-val).
- Gamla Fö6 och YouTube-videon "Lossless Join and Dependency Preservation"
  lär ut samma-relation-regeln; nya Fö6 använder implikationsdefinitionen —
  sajten följer nya Fö6.
- Kapitel 8 följer nya Fö6 sedan 2026-09-30 (decken är facit för
  kapitlet): tre anomalier (update, insertion, deletion) med gemensam
  orsak, avsnittet "Hölje, superkey och alla kandidatnycklar" före
  normalformerna (closure-algoritmen, superkey, CK = minimal superkey, de
  fem stegen, genomräknat exempel = egen uppgift 4 med CK {A, B} och
  {A, C}), spurious tuples i lossless-stycket, ordlistans "Atomärt värde"
  med deckens innebörd (ett enda värde, får ha komponenter), och
  definitionen av functional dependency (två tuples med samma X har samma
  Y; determinant/dependent attribute; affärsregel för varje tillåten
  population; pilen riktad; determinant behöver inte vara nyckel;
  högersidan delbar, vänstersidan inte). **Kapitel 8 är klart mot nya Fö6
  (2026-09-30).**

## Essächecklistornas form (2026-09-18, lärarbesked)

Läraren premierar "relevanta argument och resonemang som kan göra kopplingar
till kursmaterialet". Alla sex checklistor i `strategi/essays.js` följer
därför samma fyra steg: **Vad det är / Varför det spelar roll / Konkret /
Koppling**, som grupper `{ heading, points: [...] }` med två till fyra
punkter var. Steg 4 namnger alltid ett annat kursområde — paradoxen och RBV
(e1), mjuka styrmedel och dubbelkretslärande (e2), RBV/VRIO (e3), Ittner &
Larcker plus BSC/TBL (e4), strategin och transparenstestet (e5),
målmodellerna satisfiering/intressent/kassaflöde (e6). Slutraden "Max 300
ord. Fyra stycken, ett per rubrik. Punkt 4 är den som höjer betyget."
renderas av `views/Essays.jsx` (konstanten `CLOSING`) i --brass, lika för
alla essäer, liksom rubrikerna. Kryssrutorna indexeras löpande över
grupperna, och `checked` kapas till antalet punkter så att gammal sparad
data inte kan ge fler kryss än punkter. Testet
`scripts/essa-struktur.test.mjs` låser rubrikerna, punktantalet och att steg
4 namnger ett område. Faktainnehållet är oförändrat utom två saker:
transparenstestet (kapitel 7) tillagt i e5:s steg 4 på användarens begäran,
och de två "Med 300 ord: …"-punkterna i e5/e6 borttagna eftersom slutraden
och `outline` säger samma sak.

## HT25-tentan för Strategi (2025-10-14, inlagd 2026-09-17)

11 flervalsfrågor à 5 p (−1 fel, 0 blankt) + 3 essäer à 15 p, max 300 ord
var; betygsskalan oförändrad. Prov, Hem och kapitel 11:s tentataktik säger
HT25-formatet. Essä-vyn har ordräknare "Ord: X/300" (röd över 300) och
raden om 300-ordsgränsen. Sex essäer: str-e5 (BSC:s fyra perspektiv plus
andra perspektiv) och str-e6 (rimlig vinst/avkastning: ROE/ROCE, bransch,
risk, jämförelsealternativ, satisfiering, intressenter) nya; str-e3 har
HT25:s lydelse och är märkt "HT24 och HT25 — återkommer". Tre delar som
tidigare ströks som "ej testade" är tillbaka: strategi/taktik (kap 2),
funktionsorganisationens för- och nackdel (kap 5), ROE/ROCE och vad som är
bra avkastning (kap 4), med kärnpunkter i vision, organisation,
effektivitet och bsc samt frågorna str-q81–83 (79–80 var tagna av quiz F2).
Spridningsgränsen i `check-fragebank.mjs` höjd från 1,25 till 1,50.

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

## Processorienterad verksamhetsutveckling (BPM), byggd 2026-09-29

Underlag: `cc-prompt-bpm-delkurs.md` och `bpm-diagram-i-text.md`
(gitignorerade, återger tentor och Weavers material) och planen som
Kasper godkände. Källorna ligger i
`~/Desktop/Skola/SKOLA T3/course_files_export/` (`02_Lectures` F1–F3,
`03_Readings` artiklarna, `04_Labs-and-Exercises/bpmn-dmn-module`
genomgången och häftet, `07_Assessments` HT24/HT25-tentorna). Jeston och
Silver finns inte; Silvers *Method and Style* (2:a uppl., inte kursboken)
ligger i `SKOLA T1`. Kaspers projektdokument ligger direkt i
`~/Desktop/Skola/SKOLA T3/`: `lpm-text-kampik-2025.txt` (SAP
Signavio-bloggen som tentan kallar "Kampik et al. (2025)"),
`bpmn-naming-conventions.txt`, `why-llms-struggle-with-bpmn.txt`,
`kursoversikt.txt`.

`views: las, ova, bpmn, prov, essa, statistik`.

- **Tentan (HT25, båda tentorna samma form):** 2 essäer à 15 p (aldrig
  BPMN), 10 BPM-flerval à 5 p (4 alternativ), 4 BPMN-flerval à 3–7 p
  (4–6 alternativ), −1 fel, 0 blankt, inga hjälpmedel. **Gissningsregeln
  räknad om:** väntevärdet är positivt bara när poängen ≥ antalet
  alternativ — BPM-frågorna +0,5; 3(b) +0,4; 7 p/6 alt +0,33; 5 p/6 alt
  och 3 p/4 alt 0; **3(d) 4 p/6 alt −0,17**. Kapitel 1 och Kör processen
  (per fråga) säger det.
- **Läs:** 11 kapitel i `data/process/reading.js` (kap1–kap11 = nr 1–11),
  15 ämnen i `topics.js`, 94 ordlistetermer. Alla ämnen `karna`; `essa`
  på automatisera, ramverk, foundations, manniskor (HT25:s fyra
  essäfrågor) och enablement (process asset, Weavers betoning), låst i
  `exam-priority.test.mjs`. Det Weaver tonar ned (husets delar, stegen i
  Foundations/Enablement/Launch, PSM) står under rubriker märkta
  "(bakgrund)" i kapiteltexten; varje fas börjar med syfte och output. **Preliminärt** (märkt i
  `sources`, inget i UI): kap 4 (processoptimeringslösningarna, bara ur
  omtentans fråga 12), kap 7 (Understand), kap 8 (Innovate–Sustainability,
  60 % — bara ur HT25-tentafrågorna), kap 10 (DMN, bara
  F1/F2 och tentan). Kap 9:s LPM-avsnitt är skrivet mot LPM-texten
  (2026-09-29). Kap 10:s namngivning följer Canvas-konventionerna
  (message flow = substantiv, message start = "Received …", aktivitet =
  verb–objekt, XOR = fråga med "?" och Yes/No, sluthändelse =
  sluttillstånd); genomgången skriver "Receive loan application", texten
  säger det och rekommenderar "Received". Egna diagram följer
  konventionerna; tentans och häftets diagram är ritade som förlagan.
  Kap 1 har raden att rätt svar var ensamt längst i 14 av 20 HT25-BPM-
  frågor (omtentans 12 delad förstaplats), räknat ur de ordagranna
  frågorna. Skrivs om
  efter F4 (5 okt) och F5 (12 okt).
- **Öva:** 67 frågor i `questions.js`, 5–9 per kapitel. `bpm-t01…t22` =
  HT25-tentornas flervalsfrågor nära ordagrant (i `LENGTH_FLAGGED` med
  skälet "tentafråga ordagrant", räknas inte i balansmåtten — på tentan
  var rätt svar längst i ungefär tre fall av fyra). `bpm-q01…q49` egna (q48 = gateway-namngivning, q49 = OR-join-fallet på genomgången s. 37–38; q46 = terminate end-fallet s. 35–36),
  ingen med HT24 som källa (test i `fragebank-balans.test.mjs`); fyra
  parkerade i `questions-pending.js` (q16 F-gruppernas namn, q18, q30, q32
  som bara vilade på HT24),
  `bpm-q25` flaggad (rollnamn). Alla `reviewed: false`. Balanstestet
  `fragebank-balans.test.mjs` är tabelldrivet per delkurs: Databaser
  oförändrad, BPM med Strategis gränser (spridning 1,5, unikt längst
  < 35 %). Mätt: 30 %, kvot 1,08.
- **Essä:** 6 i `essays.js`: HT25:s fyra med exakt lydelse + två egna
  (top-down/bottom-up, BPR mot BPM). `essa-struktur.test.mjs` täcker båda
  delkurserna.
- **Kör processen** (vy `bpmn`, `views/ProcessRun.jsx`): 25 uppgifter i
  `bpmnTasks.js` — HT25:s fem körfrågor, elementfrågan (omtenta 13), sju
  varianter, 11 uppgifter på fem egna diagram (boundary events, OR,
  terminate, loop, event subprocess med timer) och häftets 1.1 (Bouquet
  delivery, sluttillstånd) och 1.3 (Handle critical issue). Diagrammen är
  data i `bpmnDiagrams.js` (noder med `cx/cy`, flöden, pooler, barnvyer)
  som både ritas (`components/bpmn/BpmnDiagram.jsx`) och körs
  (`lib/bpmnSim.js`, tokensimulator: throw direkt, catch väntar,
  event-based gateway, AND/XOR/OR med OR-join via nåbarhet, boundary,
  error end → error boundary, event subprocess, terminate, okontrollerad
  merge; tid i minuter på väggklocka). **`bpmn-sim.test.mjs` kräver att
  simulatorn ger det handskrivna facit för varje uppgift** — alla stämmer
  — plus konstruktionstester och ett överlappstest för ritningarna.
  Framsteg i `sysb23:modell:<kp-id>` = "solved". Sidhänvisningar i
  `source` visas inte i vyn.
- **Prov:** `course.exam` i manifestet anger sektioner (`lib/examPlan.js`);
  utan fält gäller Strategis format (11 × 5, oförändrat, låst i
  `exam-plan.test.mjs`). BPM: 10 BPM-frågor à 5 p (ej ämnena bpmn/
  handelser), 1 BPMN-begreppsfråga à 3 p, 3 körfrågor med tentans poäng,
  högst en per diagram → max 65–74 p. `scoreExam` tar `points` per post;
  sparade prov har `max`, Statistik läser det.
- **Gjorda avvikelser från prompten (godkända i planen):** Läs committades
  som en helhet (1a+1b), eftersom ämnen och ordlista pekar på alla kapitel.
  Kapitel 11:s genomgångar är text, inte renderade diagram (diagrammen
  finns i Kör processen). Häftets 1.2 har ingen körfråga (linjär med AND
  och en månadstimer, prövar inget nytt).

- **HT24 bort och Weavers transkript in (2026-09-30):** Weaver säger på
  F1 att den förra lärarens tentor (HT24) kan strunta i; hans egna HT25
  ligger som övningsquiz på Canvas. HT24 är inte längre källa för Öva eller
  kap 1–9 (BPMN-kapitlen nämner HT24 för några elementnamn). Kap 1–9 har
  fått Weavers förklaringar och exempel ur F1–F3-transkripten (drivers och
  triggers, process-led, framgångspallen, CPO, TOM, execution void,
  process asset, end-to-end, Google Maps, BPR/AI, RPA/UiPath, rädslan,
  process mining). Transkripten ligger i
  `~/Desktop/Skola/SKOLA T3/BPM_transkript/` och committas aldrig.

- **Granskning 2026-09-29** (tre granskare + egen kontroll mot bilderna,
  Kaspers beslut): rättade sakfel i kap 1, 3, 4, 6, 8, 10, 11 och e1/e3/e4,
  Jeston-påståenden utan källa i kap 7–8 uppmjukade till "enligt tentans
  svarsalternativ".
  **Nära dubbletter** har `group` i questions.js (red-wine: t12/t14,
  essentials: q17/q33); `lib/examPlan.js`
  drar högst en per grupp (test i `exam-plan.test.mjs`). **Default flow**
  (`default: true` på ett flöde) stöds i simulatorn och ritas med
  snedstreck; `egen-or` följer nu Silvers exempel, vilket ändrade facit:
  kp-egen-or-2 ABDE → ABE, kp-egen-or-3 ABCDE → ABCE (or-1 oförändrad ADE).

### Kontrollera mot F4 (5 okt)

Påståenden som i dag bara vilar på HT25-tentornas svarsalternativ eller
saknar föreläsningsstöd, och ska stämmas av mot föreläsning 4 (F1–F3 är
avstämda mot transkripten 2026-09-30):
- Var identifierade rotorsaker tas fram (antaget: Understand) — kap 7,
  topics `understand`, förklaringen i bpm-t18.
- Om Understand också ger quick wins (F3 lägger dem i Launch-fasens
  intressentintervjuer).
- Vad People innehåller (antaget: roller och utbildning; utbildningsplaner
  är enligt 2(h) inte Innovates output) — kap 8, bpm-t18.
- Vad Develop, Implement, Realize och Sustainability innehåller (i dag
  bara F2:s översikt: Realize = de strategiska målen, Sustainability =
  konkurrensfördelen) — kap 8, topics `fullfoljd`, bpm-q31. Pröva om de
  parkerade q30 (Realize) och q32 (appreciative inquiry) får stöd.
- 60 % kommunikation och människor: bara ur tentans essäfråga 1(a).
- Processoptimeringslösningarna (kap 4): bara uppräkningen i omtentans
  fråga 12 och RPA-exemplet i 2(c); inget i F1–F3.
- BPM-mognad: bara vision/mål/processarkitektur, IT-grund och tempo;
  ingen mognadsmodell (Weaver: behöver inte gås igenom).

### Facit och osäkerheter (BPM)

- **3(c):** tentans ritning motsäger sig själv — den kollapsade markören
  har streckad startcirkel (non-interrupting), barnvyn heldragen. Sajten
  ritar båda streckade. Premissen "Message B skickas 10 min efter A"
  krockar med "throw sker direkt" (genomgången) och tolkas som en
  fördröjning i scenariot; den gör att interrupting-fallet ger rena
  A, E, F (distraktorn).
- **Artikelstöd:** 2(e) Green BPM stöds delvis av Houy (s. 76, 78, 90),
  omtenta 8 (RPA via UI) av Rosemann s. 421 och Reijers s. 4 men inte
  kontrasten "inte robust integration".
- **3(a) (BPMN/DMN och förklarbarhet) saknar källstöd** — inget i
  artiklarna, F1–F3 eller genomgången. Frågan (`bpm-t21`) och kap 9:s
  avsnitt ligger kvar; **kontrollera efter föreläsning 5 (12 okt).**
- **HT24 (den förra lärarens, används inte sedan 2026-09-30):** omtentan
  har samma frågor utom 23, 27, 50 men **omkastade alternativ** —
  positionssvar gäller bara ordinarien. Avvikande
  bedömningar mot promptens facit: 4 och 38 ska vara ×; 6 = Foundations
  (inte Evaluation; F3 säger att Foundations säkerställer linjeringen
  mellan strategi, processledning och processer — ingen Öva-fråga, × står
  kvar); 36 = bara poolalternativet; 33 sänkt till T; 37 och
  45 höjda till S.
- **TOM** har sju komponenter; bildens lista har sex, figuren sju
  (process architecture). **Sustainability** i 7FE betyder konkurrensfördel,
  inte hållbarhet (Weaver uttryckligen).

## Nästa steg

- Användarens granskning av det ogranskade (listan ovan), i första hand
  Öva-frågorna dbq-33…62 och påståendeuppgifterna.
- **BPM efter F4 (5 okt) och F5 (12 okt):** skriv om kapitel 4, 7, 8, 10
  och 11; väv in Canvas-quizzarna BPM och BPMN när de kommer (alla
  tentafrågor finns där enligt Weaver); kontrollera 3(a) efter F5. Kasper
  granskar själv, Kör processen och kapitel 11 först.
- Fler delkurser (arkitektur, säkerhet) enligt samma mall: data +
  manifestrad, ingen ny kod.
