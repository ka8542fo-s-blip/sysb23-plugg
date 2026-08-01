# SYSB23 Plugg

Quiz- och pluggsida för SYSB23 (Informationssystems- och verksamhetsutveckling,
Ekonomihögskolan, Lunds universitet). Första delkursen — Strategi och
ekonomistyrning — är på plats; sidan är byggd för att fyllas på med fler
delkurser.

Ren SPA: Vite + React 18 + Tailwind. Ingen backend och inga konton — all
progress sparas i `localStorage` under prefixet `sysb23:`.

Publicerad på **https://ka8542fo-s-blip.github.io/sysb23-plugg/** — varje push
till `main` bygger och publicerar om sidan automatiskt.

## Kom igång

```bash
npm install
npm run dev
```

`npm run build` bygger till `dist/`. Sätt `VITE_BASE` om bygget ska ligga i en
underkatalog (deploy-workflowet gör det åt dig).

## Var progressen sparas

Allt ligger i webbläsarens `localStorage` under prefixet `sysb23:` — svar per
fråga, provhistorik, essäutkast, lästa kapitel (`read:<kurs>:<kapitel>`), valt
segment i Läs och inställningar. Ingen server, inga konton. Lagringen hör till
den webbläsaren på den enheten och följer inte med till en annan dator, och den
är knuten till adressen: byter sidan domän börjar progressen om.

## Lägen

- **Hem** — status, val av delkurs, snabbstart (läs → öva → prova).
- **Läs** — kunskapsnavet med tre segment och en gemensam sökning:
  *Kompendium* (kapitel i löptext), *Begrepp* (ämneskorten) och *Ordlista*.
- **Öva** — en fråga i taget med förklaring till varje alternativ. Frågor du
  svarat fel på återkommer oftare (vikt 3 mot 2 för obesvarade och 1 för rätta).
- **Prov** — tentasimulering: 10 frågor balanserat över ämnena, +6 / −1 / 0 p,
  valbar timer, resultat med Betygsmätaren och full genomgång.
- **Essä** — skriv eget svar, fäll ut checklistan, självskatta.
- **Statistik** — träffsäkerhet per ämne, provhistorik, "Fokusera här".

Tangentbord i Öva och Prov: `1`–`4` väljer alternativ, `Enter` bekräftar/går
vidare, `→` och `←` bläddrar. I ett kapitel: `J`/`K` scrollar, `N`/`P` byter
kapitel, `Esc` går till innehållsförteckningen.

## En källa per faktum

`topics.js` äger **alla** korta punkter (`keyPoints`, `pitfalls`).
`reading.js` äger löptexten och har medvetet inga egna recap-arrayer —
kapitelavslutet ("Kärnan i korthet" och "Se upp för") renderas ur kapitlets
`primaryTopics` via `lib/topicLookup.js`. `topics` är allt kapitlet berör och
styr "Öva på detta kapitel"; `primaryTopics` är det kapitlet introducerar och
styr avslutet, så inget upprepas mellan kapitel. Varje ämne pekar tillbaka via
`chapter`. Ingen komponent får läsa punkter direkt ur datafilerna.

## Lägga till en ny delkurs

1. Skapa `src/data/<delkursId>/` med `topics.js`, `questions.js`, `essays.js`
   och `reading.js` enligt samma scheman som `src/data/strategi/`.
2. Registrera delkursen i `src/data/index.js`:

```js
import { topics as dbTopics } from "./databaser/topics.js";
// … questions, essays

{ id: "databaser", name: "Databaser", status: "aktiv",
  topics: dbTopics, questions: dbQuestions, essays: dbEssays }
```

Inget annat behöver ändras — Hem-vyn och alla lägen läser manifestet.

## Regler för innehållet

Innehållet är sanningen. Ändra aldrig fakta i `topics.js`, `questions.js` eller
`essays.js` på eget initiativ — flagga misstänkta fel i stället. Nya frågor får
bara byggas på kunskapsbasen eller källmaterial du klistrar in, med exakt fyra
alternativ, `explain` för varje alternativ, distraktorer hämtade ur ämnets
`pitfalls`, varierat `correct`-index och `reviewed: false` tills de granskats.
Ogranskade frågor märks med etiketten "Ogranskad" i Öva.

## Datascheman

```js
// topics.js
{ id, name, chapter, examWeight, summary, keyPoints: [], pitfalls: [] }

// questions.js
{ id, topic, difficulty: 1 | 2 | 3, question,
  options: [{ text, explain }, …],  // exakt 4
  correct,                          // index i författad ordning
  source, reviewed }

// essays.js
{ id, question, context, checklist: [], outline }

// reading.js
{ id, title, lead, readingMinutes, sources, body }   // body = markdown
{ term, definition, chapter }                        // ordlistan
```

Alternativens ordning blandas (Fisher–Yates) varje gång en fråga visas och
`correct` mappas om efter blandningen — hårdkoda aldrig index i UI:t.
