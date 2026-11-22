// Sammanfattningen för Säkerhet i informationssystem: kartan man läser
// först. Inget kapitel — ett brett kort ovanför kapitlen i Läs (som BPM och
// Databaser), utan nummer och utan frågor i Öva.
//
// Regel: inget nytt i sak. Tentans upplägg är lärarens besked (22 nov 2026,
// enligt planeringschatten; det står inte på bilderna) och det som står på
// första föreläsningens bild om tentan. Resten sammanfattar kapitlen.
export const summary = {
  id: "sammanfattning",
  summary: true,
  title: "Sammanfattning",
  readingMinutes: 4,
  lead: "Tentans upplägg, hur delkursen hänger ihop och var du läser mer.",
  sources: ["Lärarens besked om tentan", "Föreläsning 1 och 2, gästföreläsningen"],
  topics: [],
  primaryTopics: [],
  body: `
## Tentan den 3 december

Salstenta 08–13 i MA 10, utan hjälpmedel. Enligt läraren har tentan 20 frågor:

| Del | Antal |
|---|---|
| Frågor från tidigare tentor, med små variationer | 5 |
| Frågor från föreläsningsbilderna och relaterat material | 5 |
| Frågor från bokens kapitel | 8 |
| Essäfrågor | 2 |

Det här vet vi inte än:

- hur många poäng varje fråga ger
- om fel svar ger avdrag
- hur långa essäerna ska vara
- vilka av bokens kapitel som ingår

Exempelfrågan på första föreläsningen var en flervalsfråga värd 1 poäng. Förra årets tentor såg annorlunda ut: 20 flervalsfrågor à 3–8 poäng med avdrag för fel svar, och inga essäer.

## Hur delkursen hänger ihop

Fem steg. Kapitlen i Läs fyller i dem.

1. **Varför:** samhället har blivit digitalt på djupet, och insatserna är enorma. Cyberbrott kostar mer än nästan alla länders ekonomier. *Föreläsning 1.*
2. **Vad som ska skyddas:** informationssäkerhet delas in i confidentiality, integrity och availability, CIA-triaden. *Föreläsning 1 och bokens kapitel 1.*
3. **Hur man tänker:** säkerhet är riskhantering. Man kartlägger tillgångar, hot och sårbarheter och väljer åtgärder efter risken. *Föreläsning 2.*
4. **Vad man gör:** skydd i flera lager, från policy och åtkomstkontroll till kryptering, nätverksskydd, fysiskt skydd och människors medvetenhet. *Föreläsning 2 och bokens kapitel.*
5. **Angriparens blick:** försvaret blir bättre av att någon med tillstånd angriper det, i pentester och övningar. *Gästföreläsningen.*

Privacy löper genom alla steg: att skydda människors integritet är ofta ett av målen med säkerhetsarbetet. *Föreläsning 2.*

## Så använder du sajten

- **Läs:** föreläsningarna först, sedan bokens kapitel i bokens ordning. Sajten tar först de kapitel som förra årets tentafrågor byggde på. Termerna står på engelska, eftersom tentan och boken använder dem.
- **Öva:** under Alla frågor finns frågor per kapitel, och under Tentafrågor förra årets tentafrågor. De gamla tentafrågorna finns också som varianter med nya formuleringar, i kapitlet där begreppet förklaras. Det är så tentans "små variationer" kan se ut.
- **Essä:** fem egna övningsessäer med checklistor. Årets essäämnen är inte kända.
- **Tenta:** förra årets tre tentor att skriva i sin helhet.
`,
};
