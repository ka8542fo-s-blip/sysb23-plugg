// Sammanfattningen för Säkerhet i informationssystem: kartan man läser
// först. Inget kapitel — ett brett kort ovanför kapitlen i Läs (som BPM och
// Databaser), utan nummer och utan frågor i Öva.
//
// Regel: inget nytt i sak. Tentans upplägg är lärarens anslag på Canvas
// (24 nov 2026): delarna, poängen, rättningen, 700 ord och fokusämnena.
// Resten sammanfattar kapitlen.
export const summary = {
  id: "sammanfattning",
  summary: true,
  title: "Sammanfattning",
  readingMinutes: 5,
  lead: "Tentans upplägg och poäng, lärarens fokusämnen, hur delkursen hänger ihop och var du läser mer.",
  sources: ["Lärarens anslag på Canvas 24 nov", "Föreläsning 1 och 2, gästföreläsningen"],
  topics: [],
  primaryTopics: [],
  body: `
## Tentan den 3 december

Salstenta 08–13 i MA 10, utan hjälpmedel. Läraren har angett delarna och poängen: 20 frågor och 100 poäng.

| Del | Antal | Poäng per fråga | Totalt |
|---|---|---|---|
| Essäfrågor | 2 | 15 | 30 |
| Frågor som liknar förra årets tentor, med små variationer | 5 | 3 | 15 |
| Frågor från föreläsningsbilderna och relaterat material | 5 | 3 | 15 |
| Frågor från bokens kapitel | 8 | 5 | 40 |

**Rättningen:**

- De 18 slutna frågorna: rätt svar ger frågans poäng, fel svar ger −1, blankt ger 0.
- Essäerna: upp till 15 poäng var, högst 700 ord. Poängen beror på hur djupt och väl argumenterat svaret är.
- Betygsgränserna är inte angivna. Sajten räknar med förra årets: A 85, B 75, C 65, D 55, E 50. De är inte bekräftade för i år.

**När lönar det sig att svara?** Alla frågor har fyra alternativ.

- 5-poängsfrågor (boken): svara alltid. En ren gissning ger i snitt +0,5.
- 3-poängsfrågor (varianter och föreläsningar): en ren gissning ger i snitt 0. Svara om du kan stryka minst ett alternativ.

## Lärarens fokus

Läraren säger att boken är huvudlitteraturen och att en stor del av tentan bygger på den, och att föreläsningsbilderna och gästföreläsningarnas bilder också är viktigt material. Hon pekar ut de här ämnena i boken. I Läs är kapitlen märkta **Lärarens fokus**.

| Lärarens ämne | Bokens kapitel |
|---|---|
| Introduction to Buffer Overflow | Kapitel 10 |
| IT Security Management and Risk Assessment | Kapitel 14 |
| Physical security control types | Kapitel 16 |
| Security policy in an organisation | Kapitel 14, 15 och 17 |
| Understand types of network attacks | Kapitel 7 (denial of service) och 8 |
| Function of firewall | Kapitel 9 |
| Malicious Software / Types of malware | Kapitel 6 |
| Access control / Access control mechanisms | Kapitel 4 |
| Public key in Cryptography / Encryption | Kapitel 2 |

Förra årets tentor såg annorlunda ut: 20 flervalsfrågor à 3–8 poäng med avdrag för fel svar, och inga essäer.

## Hur delkursen hänger ihop

Fem steg. Kapitlen i Läs fyller i dem.

1. **Varför:** samhället har blivit digitalt på djupet, och insatserna är enorma. Cyberbrott kostar mer än nästan alla länders ekonomier. *Föreläsning 1.*
2. **Vad som ska skyddas:** informationssäkerhet delas in i confidentiality, integrity och availability, CIA-triaden. *Föreläsning 1 och bokens kapitel 1.*
3. **Hur man tänker:** säkerhet är riskhantering. Man kartlägger tillgångar, hot och sårbarheter och väljer åtgärder efter risken. *Föreläsning 2.*
4. **Vad man gör:** skydd i flera lager, från policy och åtkomstkontroll till kryptering, nätverksskydd, fysiskt skydd och människors medvetenhet. *Föreläsning 2 och bokens kapitel.*
5. **Angriparens blick:** försvaret blir bättre av att någon med tillstånd angriper det, i pentester och övningar. *Gästföreläsningen.*

Privacy löper genom alla steg: att skydda människors integritet är ofta ett av målen med säkerhetsarbetet. *Föreläsning 2.*

## Så använder du sajten

- **Läs:** föreläsningarna först, sedan bokens kapitel i bokens ordning. Sajten tar upp lärarens fokuskapitel och de kapitel som förra årets tentafrågor byggde på. Termerna står på engelska, eftersom tentan och boken använder dem.
- **Öva:** under Alla frågor finns frågor per kapitel, och under Tentafrågor förra årets tentafrågor. De gamla tentafrågorna finns också som varianter med nya formuleringar, i kapitlet där begreppet förklaras. Det är så tentans "små variationer" kan se ut.
- **Essä:** fem egna övningsessäer med checklistor. Årets essäämnen är inte kända.
- **Tenta:** provtentor i årets format med lärarens poäng, där 7 av de 8 bokfrågorna kommer ur fokuskapitlen, och förra årets tre tentor att skriva i sin helhet.
`,
};
