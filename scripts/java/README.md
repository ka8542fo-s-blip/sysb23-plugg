# Java-verifieringen (fliken Java i Databaser)

`verify-solutions.mjs` kör lösningsförslagen i `src/data/databaser/javaTasks.js`
på riktigt. Varje uppgifts `solution` sätts in i uppgiftens givna DAO-klass,
kompileras med `javac` och körs mot en riktig databas (H2 i
MSSQLServer-läge) med testfallen i `cases.mjs`.

## Köra

```sh
H2_JAR=/väg/till/h2-2.3.232.jar node scripts/java/verify-solutions.mjs                     # alla uppgifter
H2_JAR=/väg/till/h2-2.3.232.jar node scripts/java/verify-solutions.mjs java-ex-1 java-ex-2 # några av dem
H2_JAR=/väg/till/h2-2.3.232.jar node scripts/java/verify-solutions.mjs java-ex-1 --solution=svar.java
```

- `--solution=<fil>` kör ett eget svar (en hel metod) mot en uppgifts
  testfall i stället för lösningsförslaget. Med det kan man se att ett
  felaktigt svar faller på rätt fall.
- `--verbose` visar SQL-satserna och JDBC-anropen i varje fall.
- `--keep` behåller den genererade Java-koden och skriver ut var den ligger.

Rapporten har en rad per kontroll, `PASS` eller `FAIL`, och efter en
`FAIL` står skälet. Skriptet avslutas med kod 0 när allt går igenom, 1 när
någon kontroll fallerar och 2 när miljön saknas (H2_JAR, javac) eller ett
uppgifts-id är okänt.

## Varför det ligger utanför `npm test`

Verifieringen kräver en JDK (17 eller senare, provad med Temurin 25) och
H2-jarfilen (2.3.232). Ingen av dem finns i repot, och skriptet hämtar inget
själv. `npm test` kör bara `scripts/*.test.mjs`, så den här katalogen kommer
inte med där. Rättaren `src/lib/javaCheck.js` testas i Node i `npm test`.
Här kontrolleras något annat: att lösningsförslagen faktiskt gör rätt mot en
databas.

## Vad som kontrolleras

För varje uppgift:

1. Lösningsförslaget börjar med uppgiftens signatur (blanktecken är fria).
2. Det kompilerar tillsammans med de givna klasserna. Harnessen lägger till
   de get- och set-metoder som uppgiften säger att man får anta, och de
   vanliga importerna ("alla klasser som behövs är importerade").
   `ConnectionHandler` kommer från harnessen.
3. Testfallen i `cases.mjs` finns och har minst ett fall som prövar
   undantagsvägen (`fault`).

För varje testfall:

- Returvärdet är det väntade. En lista får inte vara `null`. Ett objekt
  jämförs på samtliga instansvariabler och ska ha rätt klass.
- Tabellerna efter anropet är de väntade. En tabell som fallet inte nämner
  ska vara oförändrad.
- Ett väntat `SQLException` släpps igenom och tystas inte.
- Varje `Connection`, `PreparedStatement` och `ResultSet` som öppnades
  stängdes, också när anropet kastade. Harnessen räknar via
  `java.lang.reflect.Proxy` om `close()` anropades.
- Lösningen använder `prepareStatement(sql)`, inte `createStatement`.
- När fallet anger det (`expect.columns`): frågan hämtar exakt de angivna
  kolumnerna, t.ex. bara de kolumner som modellklassen har instansvariabler
  för. Kontrollen läser varje `ResultSet`s metadata.
- När fallet anger det (`expect.rows`): lösningen läser just så många rader
  ur sina `ResultSet`. Med `rows: 1` syns att ett antal räknas med
  `COUNT(*)` i databasen och inte i Java.
- När fallet anger det (`expect.sortedBy`): listan är sorterad på en
  instansvariabel, och lika värden får komma i valfri ordning sinsemellan.

## Hur det är byggt

- `support/ConnectionHandler.java`: `getConnection()` ger en ny anslutning
  till en delad H2-databas i minnet
  (`jdbc:h2:mem:verify;MODE=MSSQLServer;DATABASE_TO_UPPER=FALSE;CASE_INSENSITIVE_IDENTIFIERS=TRUE;IGNORECASE=TRUE;DB_CLOSE_DELAY=-1`),
  inslagen i `Tracker`.
- `support/Tracker.java` följer resurserna och kan kasta ett injicerat
  `SQLException` i `executeQuery`/`executeUpdate` (`fault: "execute"`) eller
  `ResultSet.next()` (`fault: "next"`). För varje `ResultSet` noterar den
  också kolumnerna och hur många rader lösningen läste.
- `support/Harness.java` bygger om databasen före varje fall. Det betyder
  `DROP ALL OBJECTS`, uppgiftens `CREATE TABLE` och raderna i `seed`. Sedan
  tar den en bild av tabellerna före och efter anropet och skriver resultatet
  som en JSON-rad som Node-skriptet jämför.
- `VerifyDriver.java` genereras för varje uppgift ur testfallen, med ett
  vanligt Java-anrop per fall. Det betyder att argumentens typer också prövas
  mot signaturen av `javac`.

Allt genereras i en temporär katalog under `os.tmpdir()` och tas bort
efteråt, utom med `--keep`.

## Skillnader mot SQL Server

- H2 tar tentans DDL som den står: `IDENTITY(1, 1)`, `DECIMAL(10, 2)` och
  namngivna `CONSTRAINT`. H2 tar också det avslutande `;` i SQL-strängen
  (`"… AND Salary < ?;"`). Ingen uppgift behöver någon anpassning i dag.
  Behövs en, skrivs den som `adaptDdl` i `cases.mjs` och syns i rapporten.
- `IGNORECASE=TRUE` och `CASE_INSENSITIVE_IDENTIFIERS=TRUE` gör jämförelser
  och namn skiftlägesokänsliga, som med SQL Servers standardsortering.
- H2 tillåter egna värden i en `IDENTITY`-kolumn utan
  `SET IDENTITY_INSERT`. `seed` använder det för att ge raderna egna ID:n
  (t.ex. `ProductID` 101, 205), så att `id = ProductID` syns i svaret. Efter
  seed fortsätter räknaren efter det högsta värdet, som i SQL Server. Ett svar
  som själv sätter in surrogatnyckeln går alltså att köra i H2, men det fångas
  av jämförelsen av tabellen efteråt.
- En saknad tabell (`fault: "drop-table"`) ger fel redan i
  `prepareStatement` i H2. Med SQL Servers drivrutin kommer felet oftast först
  vid exekveringen. Därför prövar fallen med `"execute"` och `"next"` att även
  `PreparedStatement` och `ResultSet` stängs.

## Lägga till testfall

Formatet står överst i `cases.mjs`. En ny uppgift behöver bara ett nytt
block med uppgiftens id som nyckel, och ingen ny kod. Ett bra block har:

- fall som visar varje villkor (andra rader rörs inte)
- gränsvärden (lika med gränsen)
- ett tomt resultat (0, en tom lista, `null` eller `false`)
- ett försök till SQL-injektion
- ett värde som bara är början av ett värde i tabellen (`E1` mot `E10`),
  så att ett svar med `LIKE` i stället för `=` syns
- minst ett fall med `fault`

Med `ordered: true` ska listans ordning stämma exakt. Undvik då lika värden i
`ORDER BY`-kolumnen, annars är ordningen inte bestämd; använd `sortedBy` för
ett fall med lika värden. Lägg in raderna i `seed` i en ordning som varken är
stigande eller fallande, så att ett svar utan `ORDER BY` ger fel ordning.
