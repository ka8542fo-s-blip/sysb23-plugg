// Sammanfattningen: kartan man läser först. Den är inget kapitel — den
// står som ett brett kort ovanför kapitellistan i Läs (ChapterList), har
// inget nummer, räknas inte i "X av 11 kapitel lästa" och finns inte i Öva.
// Kursmanifestet bär den som `summary` (src/data/index.js). Figurerna heter
// S.1–S.3. Samma upplägg som BPM (src/data/process/summary.js).
//
// Regel: inget nytt i sak. Allt här står redan i kapitel 1–11; texten
// sammanfattar och hänvisar dit ("Mer: kapitel N"). Kapitelnumren är de som
// visas i Läs: Svaga entiteter är kapitel 6 och Java kapitel 11.
export const summary = {
  id: "sammanfattning",
  summary: true,
  title: "Sammanfattning",
  readingMinutes: 14, // ~2 000 ord i sajtens lästempo; skummad 10–12 min
  lead: "Hela kursen på en sida: vägen från verksamhetens krav till en fungerande databas, de regler som följer med genom varje steg och hur tentan prövar dem.",
  sources: ["Bygger på kapitel 1–11"],
  topics: [],
  primaryTopics: [],
  body: `
## Grundidén

En **databas** är en strukturerad samling data som lagras och nås elektroniskt. Kursen följer vägen från verksamhetens behov till en fungerande databas, steg för steg och i en bestämd ordning.

- **Varför inte bara Java?** Data i en \`ArrayList\` ligger i arbetsminnet och försvinner när programmet stängs. En databas är **persistent** (lagringen finns kvar).
- **Vad som lagras** bestäms av verksamheten, inte av databasadministratören ensam: vad behöver processerna, kvalitetssäkringen och rapporteringen?
- **SQL kommer sist.** Först när modellen är genomtänkt skrivs koden, och därför prövar tentan modellering minst lika hårt som SQL.

| Steg | Vad som händer | Resultat |
|---|---|---|
| **Krav** | Verksamheten beskriver vad den behöver, i löpande text | "En anställd måste arbeta på exakt en avdelning." |
| **Konceptuell design** | ER-modellering (entity–relationship) | Ett ER-diagram i Chen-notation |
| **Logisk design** | Transformation till relationer, och normalisering om det behövs | Relationsscheman med nycklar, i 3NF |
| **Fysisk design** | DDL (Data Definition Language) | Körbar \`CREATE TABLE\`-kod med constraints |
| **SQL och applikation** | Frågor mot databasen, och ett Java-program som använder den | \`SELECT\`-frågor och en app via JDBC |

[[diagram:db-kurskartan]]

Mer: kapitel 1.

## Den röda tråden

Samma regel följer med genom varje steg och byter bara form. Det tydligaste exemplet är anställningsnumret: **identifieraren** i ER-diagrammet blir en **kandidatnyckel** i den logiska modellen, \`NOT NULL\` plus \`UNIQUE\` i DDL-koden och till sist **felkod 2627** i Java-appen, när någon försöker spara en dubblett.

- **Regeln, inte datan.** Identifierare, kandidatnycklar och funktionella beroenden är verksamhetsregler som gäller varje tillåten population. Exempeldata kan motbevisa en regel men aldrig bevisa den.
- **Deltagandet.** En dubbel linje i diagrammet blir \`NOT NULL\` på den främmande nyckeln. Att varje projekt måste ha minst en anställd i en M:N-relation kan däremot ingen constraint uttrycka.
- **M:N.** En många-till-många-relation blir en kopplingsrelation, sedan en kopplingstabell utan surrogatnyckel, och på tentan är det över den tabellen SQL-frågan joinar.
- **Transformation och normalisering hör ihop.** Transformationsreglerna producerar relationer i 3NF; de är normaliseringsteorins resultat i praktisk form.

[[diagram:db-tre-regler]]

Mer: kapitel 3, 4, 7, 9 och 11.

## Relationsmodellen och nycklarna

En **relation** är en mängd tupler (rader) som samlar fakta av ett slag och visas som en tabell. Nycklarna gör att tuplerna går att skilja åt och att relationerna går att koppla ihop.

| Begrepp | Betydelse |
|---|---|
| **Mängd mot bag** | En relation har inga dubblettupler och ingen ordning. Ett SQL-resultat är en bag, som kan ha dubbletter: \`DISTINCT\` tar bort dem och \`ORDER BY\` ger ordning. |
| **Schema mot aktuellt värde** | Schemat bestämmer formen; det aktuella värdet är tuplerna just nu. **Grad** är antalet attribut, **kardinalitet** antalet tupler. |
| **Kandidatnyckel** (candidate key, CK) | Ett eller flera attribut som är **unika** och **minimala**: inget attribut kan tas bort utan att unikheten går förlorad. {EmployeeNo} är en kandidatnyckel, {EmployeeNo, Name} är unik men inte minimal. |
| **Primärnyckel** (primary key, PK) | En vald kandidatnyckel. Valet tar inte bort de andra kandidatnycklarna. |
| **Främmande nyckel** (foreign key, FK) | Ett värde som måste träffa en kandidatnyckel i en annan (eller samma) relation. Det får upprepas, och får vara NULL om deltagandet är frivilligt. |
| **Primärattribut** (prime attribute) | Ett attribut som ingår i **någon** kandidatnyckel. |

Mer: kapitel 2 och 3.

## ER-modellering i Chen

Kraven blir ett ER-diagram: rektangel för entitetstyp, romb för relationstyp, ellips för attribut. Det svåra är att läsa exakt vad symbolerna lovar, och det är tentans första uppgift.

| Symbol | Läses | Betyder |
|---|---|---|
| **Ratio-etikett** (1, M, N) | Tvärs över relationen | Ett maximum. 1 betyder högst en, inte exakt en. |
| **Enkel eller dubbel linje** | Vid sin egen ände | Dubbel linje är **total participation**: varje entitet deltar minst en gång. |
| **"Exakt en"** | Båda | 1 tvärs över och dubbel linje vid den egna änden. |
| **Understruket attribut** | — | **Identifierare**: unik i varje giltig population. |
| **Dubbel rektangel, dubbel romb, streckad understrykning** | — | **Svag entitet**: identifieras av ägarens kompletta identitet plus sin **partiella identifierare**. |

- **Kedjor av svaga entiteter:** är ägaren själv svag, ingår dess ägare också. Följ kedjan upp till en stark entitet; alla led kommer med.
- **"Kan" och "måste":** ett påstående om vad som "kan" ske är sant om inget i diagrammet utesluter det. Ett påstående om vad som "måste" ske är sant bara om en restriktion kräver det. Flerstegspåståenden över flera relationer kan därför vara sanna även när de låter fel, eftersom Chen saknar symbol som binder ihop vägarna.
- **Total participation gör inte en entitet svag.** Svaghet kräver identitetsberoende.

Mer: kapitel 4, 5 och 6.

## Från ER till relationer

Logisk design skriver samma modell som relationer med nycklar. Föreläsningen ger sex regler i en fast ordning: entiteterna först, sedan relationerna och sist flervärdesattributen.

| Regel | Gäller | Blir |
|---|---|---|
| **1** | Vanlig entitet | En relation med de enkla attributen. Varje identifierare blir kandidatnyckel, och en väljs som primärnyckel. |
| **2** | Svag entitet | Ägarens primärnyckel som främmande nyckel; primärnyckeln är ägarens nyckel plus den partiella. Ägaren mappas först. |
| **3** | Binär 1:1 | Främmande nyckel helst på sidan med totalt deltagande, och den görs till **kandidatnyckel**. En främmande nyckel ensam bevarar inte 1:1. |
| **4** | Binär 1:N | Främmande nyckel på **många-sidan**. |
| **5** | Binär M:N | En ny relation med båda primärnycklarna som främmande nycklar; tillsammans är de primärnyckel. Relationens egna attribut följer med men ingår inte i nyckeln. |
| **6** | Flervärdesattribut | En ny relation med ägarens primärnyckel plus värdet som primärnyckel. |

Unära relationer har ingen egen regel: använd den binära regeln av samma form. Och skriv ned de deltagandekrav som nycklarna inte täcker.

Mer: kapitel 7.

## Normalisering

Redundans ger **anomalier**: samma faktum lagras på flera ställen, så att en uppdatering, en insättning eller en radering kan gå fel. Normaliseringen bygger på **funktionella beroenden** (X → Y: två tupler med samma X har alltid samma Y), och de är affärsregler, inte mönster i exempeldata.

- **Hölje** (attribute closure, X⁺): allt X bestämmer. Attribut som inte står på någon högersida ingår i varje kandidatnyckel. Hitta **alla** kandidatnycklar innan du klassar attributen.
- **2NF:** inget icke-primärattribut beror på en äkta delmängd av någon kandidatnyckel. Är alla kandidatnycklar enkla kan 2NF inte brytas.
- **3NF:** inget icke-primärattribut är transitivt beroende av en kandidatnyckel.
- **Lossless join:** en naturlig join av delarna ger tillbaka originalet. Det kravet är icke förhandlingsbart.
- **Dependency preservation:** de lokala beroendena i delarna medför tillsammans alla ursprungliga beroenden.
- **Övernormalisering:** dela inte mer än 3NF kräver. Det ger poängavdrag, och en relation som redan är i 3NF ska inte delas alls.

[[diagram:db-beslutsvagen]]

Mer: kapitel 8.

## Fysisk design och DDL

Den logiska modellen blir \`CREATE TABLE\`-kod, och **constraints** (regler som databasen själv upprätthåller) flyttar affärsreglerna in i databasen. Tentans uppgift 2 går direkt från ER-diagrammet till den koden.

| I diagrammet | I DDL |
|---|---|
| Vanlig eller svag entitet | En tabell med **surrogatnyckel** (ett databasgenererat löpnummer), \`INTEGER IDENTITY(1,1)\`, som \`PRIMARY KEY\` |
| Identifieraren (den naturliga nyckeln) | \`NOT NULL\` och \`UNIQUE\` |
| Svag entitet | Ägarens främmande nyckel \`NOT NULL\`, och \`UNIQUE\` över den partiella nyckeln tillsammans med ägarens främmande nyckel |
| 1:N och 1:1 | Främmande nyckel på rätt sida, \`NOT NULL\` om linjen är dubbel |
| 1:1 | Den främmande nyckeln är också kandidatnyckel (regel 3 i kapitel 7), alltså \`UNIQUE\` |
| M:N och flervärdesattribut | En kopplingstabell **utan** surrogatnyckel; primärnyckeln är de främmande nycklarna (plus värdet) |

- \`REFERENCES\` pekar på surrogatnyckeln, inte på den naturliga nyckeln.
- Lägg inte till constraints som uppgiften inte ber om, som \`DEFAULT\`.
- Reserverade ord skrivs ut i sin helhet, och koden ska vara indenterad.

Mer: kapitel 3 och 9.

## SQL: att resonera fram en fråga

Tentans största uppgift är en enda fråga över tre tabeller: två entitetstabeller och en kopplingstabell. Stryk först under i uppgiftstexten vilka kolumner som ska ut, per vad, vilka villkor och vilka värden som måste hämtas ur andra rader.

| Uppgiften säger | Byggsten |
|---|---|
| Namn och mätvärden ur olika tabeller | \`INNER JOIN\` över kopplingstabellen, med en rad per kopplingsrad |
| "Snittbetyg per bok" | \`GROUP BY\` med ett aggregat; varje kolumn i \`SELECT\` står i \`GROUP BY\` eller i ett aggregat |
| Ett villkor på en enskild rad | \`WHERE\`, som filtrerar före grupperingen |
| Ett villkor på gruppen, "minst två" | \`HAVING\`, som filtrerar efter grupperingen |
| "X men inte Y" | En mängdskillnad: \`NOT IN\`, \`NOT EXISTS\` eller \`EXCEPT\` |
| "Äldre än S4" | En **skalär underfråga** (en underfråga som ger exakt ett värde), aldrig ett värde du slagit upp själv |

\`NOT IN\` mot en lista som innehåller NULL ger tomt resultat, eftersom NULL varken är lika med eller olikt något. \`NOT EXISTS\` har inte det problemet.

Mer: kapitel 10.

## Applikationsutveckling: Java och JDBC

En Java-applikation pratar med SQL Server genom **JDBC** (Java Database Connectivity), ett API där en drivrutin översätter anropen. Allt följer samma kedja av klasser.

- **Kedjan:** \`DriverManager\` öppnar en \`Connection\`, som skapar ett \`PreparedStatement\`. \`executeQuery()\` kör en \`SELECT\` och ger ett \`ResultSet\`; \`executeUpdate()\` kör \`INSERT\`, \`UPDATE\` och \`DELETE\`. Går något fel kastas ett \`SQLException\`.
- **Platshållare:** värden skrivs aldrig in i SQL-texten utan sätts på \`?\`, och numreringen börjar på 1.
- **ResultSet:** markören står före första raden. \`while (resultSet.next())\` läser alla rader; \`if\` räcker när frågan ger högst en.
- **Stäng resurserna** med try-with-resources, som stänger dem också vid fel.
- **Felkoder:** 2627 när en \`UNIQUE\`-constraint bryts, 208 när ett objekt saknas, 0 när servern inte går att nå.
- **Fyra lager:** view, controller, model och data access. All SQL hör hemma i data access-lagrets DAO-klasser (Data Access Object).
- **Tre nivåer av separation:** på nivå 1 ligger SQL i controllern, och det ger underkänt på projektet. Nivå 2 har en DAO som kastar \`SQLException\`, nivå 3 en DAO som kastar ett eget \`DaoException\`. Kursen siktar på nivå 2 eller 3.

Formen på tentans Java-fråga är inte känd, och området har inte funnits på någon tidigare tenta. Kapitel 11 slutar med tre troliga former.

Mer: kapitel 11.

## Så ser tentan ut

Formen nedan bygger på HT25-tentorna, som hade samma fyra uppgifter: fem timmar, 100 poäng, och utskrivna slides och kursboken som hjälpmedel. För HT26 har föreläsaren dessutom aviserat en fråga om Java, men dess form och poäng är inte kända; läs också rutan om tentan överst i Läs.

| Uppgift | Poäng | Poängregel | Kapitel |
|---|---|---|---|
| **1. Läsa ett ER-diagram:** markera de sanna påståendena | 25 | +5 per rätt markerat, −3 per fel, 0 om inget markeras | 4–6 |
| **2. DDL direkt från ER-diagrammet** | 25 | — | 7 och 9 |
| **3. Normalformer:** fem sant/falskt-påståenden à 2 p, sedan högsta normalform med motivering | 20 | Fel ger −1 och blankt 0 i sant/falskt-delen | 8 |
| **4. En SQL-fråga** | 30 | — | 10 |
| **Java** (nytt för HT26) | Okänd | Okänd | 11 |

- **Uppgift 1:** härled varje påstående ur notationen. Markera det du inte kan härleda bara om du är mer än ungefär 40 procent säker på att det är sant.
- **Uppgift 3a–3e:** svara alltid. Med två alternativ och +2/−1 är även en gissning värd mer än ett blankt svar.

Kända fällor, ur kapitel 5–11:

| Fällan | Det som gäller |
|---|---|
| "1" i Chen betyder exakt en | 1 betyder högst en; exakt en kräver också dubbel linje |
| Ratio-etiketten läses på fel sida | Etiketten bredvid Y säger hur många Y en X får ha |
| Totalt deltagande gör entiteten svag | Svaghet kräver identitetsberoende |
| Ett påstående som låter orimligt är falskt | Det som diagrammet inte förbjuder är tillåtet |
| Kopplingstabellen får \`IDENTITY\` | Kopplingstabeller får aldrig surrogatnyckel |
| Naturliga nyckeln saknar \`NOT NULL\` | Den naturliga nyckeln ska vara både \`NOT NULL\` och \`UNIQUE\` |
| Svag entitet utan \`UNIQUE\` över paret | Partiell nyckel och ägarens främmande nyckel tillsammans |
| Att stanna vid första kandidatnyckeln | Hitta alla; ett attribut kan vara primärt genom en annan nyckel |
| Att dela upp mer än 3NF kräver | Övernormalisering ger poängavdrag |
| En kolumn i \`SELECT\` som varken står i \`GROUP BY\` eller i ett aggregat | Frågan kör inte |
| Ett uppslaget värde i stället för underfråga | En fråga, ett resultat: hämta värdet med en skalär underfråga |
| \`setString(0, …)\` eller \`executeQuery\` på en \`INSERT\` | Platshållarna börjar på 1, och \`INSERT\` körs med \`executeUpdate\` |

Mer: kapitel 1 och 5–11.

## Minilexikon

| Term | Betydelse |
|---|---|
| **Relation** | En mängd tupler som samlar fakta av ett slag; visas som en tabell |
| **Tupel** | En rad: ett värde för varje attribut |
| **Attribut** | En kolumn: ett namn parat med en domän |
| **Domän** | Alla tillåtna värden för ett attribut, inte de värden som råkar finnas |
| **Kandidatnyckel** | Attribut som är unika och minimala |
| **Primärnyckel** | Den kandidatnyckel som väljs |
| **Främmande nyckel** | Attribut vars värden måste träffa en kandidatnyckel i en annan eller samma relation |
| **Primärattribut** | Ett attribut som ingår i någon kandidatnyckel |
| **Surrogatnyckel** | Ett databasgenererat löpnummer utan affärsbetydelse, \`IDENTITY(1,1)\` |
| **Naturlig nyckel** | En nyckel med betydelse i verksamheten, som ett anställningsnummer |
| **Entitetstyp** | En sorts sak som verksamheten vill lagra data om; rektangel i Chen |
| **Identifierare** | Ett attribut eller en kombination av attribut som skiljer varje entitet från alla andra; understruket i Chen |
| **Svag entitet** | En entitet som bara kan identifieras tillsammans med sin ägare |
| **Partiell identifierare** | Svaga entitetens del av identiteten, unik bara inom ägaren |
| **Total participation** | Varje entitet deltar minst en gång; dubbel linje i Chen |
| **Ratio** | Det maximala antalet: 1, M eller N, läst tvärs över relationen |
| **Kopplingstabell** (junction table) | Tabellen för en M:N-relation; primärnyckeln är de främmande nycklarna |
| **Funktionellt beroende** | X → Y: samma X ger alltid samma Y |
| **Hölje** | Allt en attributmängd bestämmer under beroendena |
| **Lossless join** | Delarna kan joinas tillbaka till originalet |
| **Dependency preservation** | Beroendena följer av de lokala beroendena i delarna |
| **DDL** | Den del av SQL som definierar strukturer: \`CREATE\`, \`ALTER\` och \`DROP\` |
| **Constraint** | En regel databasen upprätthåller, som \`PRIMARY KEY\` och \`UNIQUE\` |
| **PreparedStatement** | En förkompilerad fråga med platshållare för värdena |
| **DAO** | Klassen i data access-lagret som all SQL ligger i |

Mer: ordlistan under Läs, och kapitel 2–11.
`,
};
