# CC-prompt: Fyll Öva för Databaser med ny frågebank

## Kontext

Öva-fliken för Databaser finns men visar tomläge, eftersom frågebanken är en tom array. Nu finns frågorna.

**Viktig ändring av syftet.** Öva är **inte** tentasimulering. Tentaformatet för Databaser är fortfarande okänt — vi vet att det är en skriftlig salstentamen 17 november, 3,0 hp, betygsskala U–A, men inte om frågorna är konstruktionsuppgifter, flervalsfrågor eller en blandning. Frågebanken prövar därför **förståelse av läsmaterialet**, oberoende av tentans form. Ingen betygsmätare, ingen minuspoäng, inget poängsystem lånat från Strategi. Rätt eller fel, plus förklaringen.

**Fil:** `databaser-fragebank-fo1-fo4.js` — 54 frågor över föreläsning 1 och 4.

## Filer att läsa först

1. Frågebanksfilen.
2. Hur Strategis frågebank är strukturerad och hur Öva-vyn konsumerar den — anpassa fältnamnen till befintlig form om de skiljer sig. Min export heter `databaserQuestions` med fälten `id`, `topic`, `question`, `options`, `correctIndex`, `explanation`, plus `databaserTopicLabels` för visningsnamn.
3. Databaser-manifestet och `topics.js`, för att koppla `topic`-värdena rätt.

## Att göra

1. Lägg in frågebanken där Databaser-innehållet hör hemma.
2. Öva ligger redan i Databasers `views` — fliken behöver alltså inte sättas tillbaka, bara fyllas. Kontrollera att tomläget försvinner när banken finns.
3. Koppla `topic`-fälten till befintlig ämnesfiltrering om Öva stödjer det. De tolv värdena är: `grundbegrepp`, `designkedjan`, `sql`, `metamodell`, `entiteter`, `attribut`, `identifierare`, `relationer`, `kardinalitet`, `svaga`, `associativa`, `crowsfoot`.
4. Kontrollera att "Öva på detta kapitel"-knapparna nu visas för de kapitel som har täckta ämnen, och att de fortfarande är dolda för kapitel utan frågor. Föreläsning 2–3 och 5–9 har inga frågor ännu.
5. Genvägen "Öva frågor" på Hem leder redan hit och ska nu visa frågor i stället för tomläget.

## Att inte göra

- Lägg inte till poängsystem, tidtagning eller betygsgränser.
- Blanda inte in Strategis provläge.
- Ändra inga frågeformuleringar eller svarsalternativ. Balansen är mätt och en omskrivning bryter den. Hittar du sakfel: rapportera, ändra inte.

## Balansmått att bevara

Om frågor läggs till senare ska dessa hållas:

| Mått | Nuvarande | Mål |
|---|---|---|
| Positionsfördelning | 14 / 14 / 13 / 13 | jämn |
| Längdkvot rätt/distraktor | 0.96 | nära 1.00 |
| Rätt svar unikt längst | 20 % | ≤ 25 % |
| Längdspridning inom fråga | snitt 1.24x, max 1.69x | under 2x |

Ett litet skript som räknar detta vore värt att lägga till i testsviten, så att framtida tillägg inte tyst återinför snedfördelningen.
