# SYSB23 Plugg

Quiz- och pluggsida för SYSB23 (Informationssystems- och verksamhetsutveckling,
Ekonomihögskolan, Lunds universitet). Första delkursen — Strategi och
ekonomistyrning — är på plats; sidan är byggd för att fyllas på med fler
delkurser.

Ren SPA: Vite + React 18 + Tailwind. Ingen backend och inga konton — all
progress sparas i `localStorage` under prefixet `sysb23:`.

## Kom igång

```bash
npm install
npm run dev
```

`npm run build` bygger till `dist/`.

## Lägen

- **Hem** — status, val av delkurs, snabbstart.
- **Öva** — en fråga i taget med förklaring till varje alternativ. Frågor du
  svarat fel på återkommer oftare (vikt 3 mot 2 för obesvarade och 1 för rätta).
- **Prov** — tentasimulering: 10 frågor balanserat över ämnena, +6 / −1 / 0 p,
  valbar timer, resultat med Betygsmätaren och full genomgång.
- **Begrepp** — kunskapsbanken med sammanfattning, nyckelpunkter och tentafällor.
- **Essä** — skriv eget svar, fäll ut checklistan, självskatta.
- **Statistik** — träffsäkerhet per ämne, provhistorik, "Fokusera här".

Tangentbord i Öva och Prov: `1`–`4` väljer alternativ, `Enter` bekräftar/går
vidare, `→` och `←` bläddrar.

## Lägga till en ny delkurs

1. Skapa `src/data/<delkursId>/` med `topics.js`, `questions.js` och
   `essays.js` enligt samma scheman som `src/data/strategi/`.
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
{ id, name, examWeight, summary, keyPoints: [], pitfalls: [] }

// questions.js
{ id, topic, difficulty: 1 | 2 | 3, question,
  options: [{ text, explain }, …],  // exakt 4
  correct,                          // index i författad ordning
  source, reviewed }

// essays.js
{ id, question, context, checklist: [], outline }
```

Alternativens ordning blandas (Fisher–Yates) varje gång en fråga visas och
`correct` mappas om efter blandningen — hårdkoda aldrig index i UI:t.
