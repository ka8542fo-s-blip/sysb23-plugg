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
  `examArea`-etiketter per kapitel + tentabanner + filter "Visa bara tentarelevanta
  kapitel" (fältet saknas = ingen etikett alls; null = "Utanför tentan"). Läsprogress
  mäts i **kapitel och procent, aldrig minuter** (per kapitel står "ca X min").
  Tangentbord i kapitel: J/K/N/P/Esc.
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
- **Schema (Pluggkalender)** — data i `src/data/schedule.js` (avläst ur TimeEdit
  2026-08-01, inte levande). Datumlogik i `lib/dates.js`: Europe/Stockholm,
  UTC-midnattsdiffar (sommartidssäkert), ISO-veckor. `lib/useToday.js` gör datumet
  reaktivt (minutkoll + fokus) så öppna flikar slår över vid midnatt.
  "Plugga till denna tenta" väljer ALDRIG läge åt användaren — den byter delkurs
  och går till första vyn i `views` (Läs-TOC för båda), med tillbakalänk som bara
  lever i vy-state.
- **Statistik** — InfoTips (frågetecken) förklarar varje term; texterna i
  `data/statTerms.js` är skrivna mot koden och måste följa med om beräkningar ändras.

## Design ("Läsesalen") och användarens uttalade preferenser

Tokens i `src/index.css` (+ 7 delkursfärger `--c-*`). Fraunces för rubriker, Inter
för brödtext — sekundär text i rubriker sätts i Inter, inte Fraunces.

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

## Lagringsnycklar

`answers`, `exams`, `essays`, `settings`, `lasSegment`, `delkurs`,
`read:<kurs>:<kapitel>`, `sql:<övningsId>` (= `"solved"` | `"solved-with-help"`).
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
