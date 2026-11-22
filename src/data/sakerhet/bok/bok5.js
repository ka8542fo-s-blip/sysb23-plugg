// Bokens kapitel 5: Stallings & Brown, Database and Data Center Security
// (s. 246–292). Kapitel, ämne, ordlista och frågor; samlas av reading.js,
// topics.js och questions.js via bok/index.js. Skrivet med egna ord på
// tentans nivå, granskat mot boken 22 nov 2026 (ogranskat av Kasper).
// `notes` är källanteckningarna och visas inte.

const variant = (id, what) => ({ variantOf: id, source: `Variant av en tentafråga från förra året (${what})` });

export const chapter = {
  id: "bok5",
  kind: "bok",
  label: "Bokens kapitel 5",
  examArea: "Bokfrågor",
  title: "Databas- och datacentersäkerhet",
  readingMinutes: 11,
  lead: "Varför databaser behöver eget skydd, hur SQL injection går till och hur den möts, hur databasen styr åtkomst, hur tillåtna frågor ändå kan läcka, och hur datacenter klassas efter tillgänglighet.",
  sources: ["Stallings & Brown kap. 5 (s. 246–292)"],
  body: `
## Kärnan

- **Databaser samlar känsliga data på ett ställe** och behöver ett eget skydd. Operativsystemet styr hela filer; ett DBMS kan styra enskilda rader och fält.
- **SQL injection (SQLi)** smugglar in SQL-kommandon via indata. Attackerna delas in i tre klasser efter hur angriparen får ut data: **inband**, **inferential** och **out-of-band**.
- **Ingen enskild motåtgärd räcker.** Boken delar in dem i defensive coding (där prepared statements ingår), detection och run-time prevention.
- **Databasens access control** sköts med GRANT och REVOKE, och rättigheter som getts vidare återkallas i kedja.
- **Inference** är att dra slutsatser om skyddade data ur svar på frågor man har rätt att ställa. Det är inte samma sak som blind SQL injection.
- **Kryptering är sista försvarslinjen,** och **datacenter** delas in i fyra tiers efter tillgänglighet.

## Varför databaser behöver eget skydd

En organisations databaser samlar känsliga uppgifter i ett enda system: ekonomi, journaler samt kund- och personaluppgifter. Många behöver komma åt dem, och samtidigt hotas de av missbruk och obehöriga ändringar, inifrån och utifrån.

Boken ger fyra skäl till att databassäkerheten inte har hängt med:

- ett DBMS är ett stort, komplext program, och nya funktioner ger nya sårbarheter
- frågespråket SQL är mycket mer komplext än till exempel HTTP
- få organisationer har egen personal för databassäkerhet
- miljöerna blandar många databas-, affärs- och operativsystemsplattformar

Operativsystemets skydd styr läsning och skrivning av hela filer. Ett DBMS kan begränsa åtkomsten till enskilda poster och fält, och till kommandon som select, insert, update och delete. Därför behövs skydd som är byggt för databasen.

## Databaser i korthet

- Ett **database management system (DBMS)** är de program som bygger upp och underhåller databasen och låter användare och applikationer ställa frågor via ett **query language**.
- En **relational database** består av tabeller som knyts ihop med nycklar. Frågespråket är **Structured Query Language (SQL)**.

| Formellt namn | Vardagligt | Kallas också |
|---|---|---|
| relation | tabell | fil |
| tuple | rad | post (record) |
| attribute | kolumn | fält |

- **Primary key:** en eller flera kolumner som identifierar varje rad unikt.
- **Foreign key:** en annan tabells primary key, som knyter ihop tabellerna i ett en-till-många-samband.
- **View:** en virtuell tabell, resultatet av en fråga. Views används ofta för säkerhet, så att en användare bara ser vissa rader eller kolumner.

## SQL injection

Gästföreläsningen visade hur attacken ser ut och rekommenderade prepared statements och en allowlist för indata. Här kommer bokens indelning.

**Idén:** en webbapplikation bygger en SQL-fråga av fasta textbitar och det användaren skriver. Angriparen bryter textsträngen i förtid, lägger till ett eget kommando och sätter ett kommentarstecken sist, så att resten av frågan ignoreras. Det fungerar när indata inte filtreras ordentligt och därför körs som kod. Det vanligaste målet är att tömma tabeller på data, men SQLi kan också ändra eller radera data, köra kommandon i operativsystemet eller ge denial of service.

Attackerna delas in i tre klasser:

| Klass | Hur angriparen får ut data | Typer |
|---|---|---|
| **Inband attack** | i samma kanal som injektionen; resultatet visas direkt på webbsidan | tautology, end-of-line comment, piggybacked queries |
| **Inferential attack** | inga data överförs; angriparen skickar särskilda frågor och drar slutsatser av hur servern beter sig | illegal/logically incorrect queries, blind SQL injection |
| **Out-of-band attack** | i en annan kanal, till exempel ett mejl med frågans resultat; används när servern fritt får skicka trafik utåt | |

| Typ | Vad angriparen gör |
|---|---|
| **Tautology** | gör ett villkor alltid sant, så att alla rader returneras, till exempel förbi en lösenordskontroll |
| **End-of-line comment** | sätter en kommentar efter sin indata, så att resten av den legitima frågan inte körs |
| **Piggybacked queries** | lägger egna frågor efter den avsedda i samma sträng |
| **Illegal/logically incorrect queries** | framkallar fel; utförliga felsidor avslöjar databasens typ och struktur inför andra attacker |
| **Blind SQL injection** | ställer sant/falskt-frågor och ser hur sidan reagerar |

**Blind SQL injection** låter enligt boken angripare "infer the data present in a database system" även när systemet inte visar några felmeddelanden. Är det injicerade påståendet sant fungerar sidan som vanligt; är det falskt ser sidan annorlunda ut, fast utan felmeddelande. Det var svaret på en av förra årets tentafrågor (på tentan felstavat "bling SQL injection"). Skillnaden mot illegal queries är just felmeddelandena: där läcker de, i blind SQL injection finns inga.

## Motåtgärder mot SQL injection

Attackerna är så många och varierade att ingen enskild åtgärd räcker. Boken delar in motåtgärderna i tre typer:

| Typ | Vad den gör | Exempel |
|---|---|---|
| **Defensive coding** | tar bort sårbarheten i koden, eftersom mycket SQLi beror på osäker programmering | kontroll av indatatyp (ett sifferfält får bara innehålla siffror), mönstermatchning mot onormal indata, **parameterized query insertion** |
| **Detection** | upptäcker attacker | signature-based (kända attackmönster), anomaly-based (avvikelser från normalt beteende), code analysis (en testsvit av SQLi-attacker) |
| **Run-time prevention** | kontrollerar frågorna medan systemet kör | jämför varje fråga med en modell av förväntade frågor |

**Parameterized query insertion** är det som gästföreläsningen kallade **prepared statements**: utvecklaren anger frågans struktur och skickar värdena separat, så att indata inte kan ändra strukturen. Det var svaret på en av förra årets tentafrågor. De felaktiga alternativen var att kryptera frågorna, ta automatisk backup och stänga av loggningen, och inget av dem påverkar hur frågan tolkas.

## Åtkomstkontroll i databasen

DBMS:et utgår från att användaren redan är autentiserad. Databasens egen access control styr sedan hela databasen, enskilda tabeller eller utvalda rader och kolumner, ibland efter innehållet: en chef kanske bara ser lönerna på sin egen avdelning. Vanliga DBMS har DAC eller RBAC, några även MAC (se kapitlet om access control).

Tre administrativa policyer:

| Policy | Vem som får ge och ta tillbaka rättigheter |
|---|---|
| **Centralized administration** | ett fåtal privilegierade användare |
| **Ownership-based administration** | tabellens ägare, alltså den som skapade den |
| **Decentralized administration** | ägaren, som dessutom kan ge andra rätten att ge och ta tillbaka rättigheter |

**GRANT och REVOKE.** SQL har två kommandon för rättigheter: GRANT ger rättigheter eller en roll, och REVOKE tar tillbaka dem. Typiska rättigheter är select, insert, update, delete och references. Med **grant option** får mottagaren själv ge rättigheten vidare.

**Cascading authorizations.** Grant option gör att en rättighet kan spridas i en kedja av användare, och återkallelsen sprids på samma sätt. I de flesta system gäller: när A återkallar en rättighet försvinner också det som getts vidare, utom rättigheter som hade funnits även om A:s tilldelning aldrig skett.

**RBAC passar databaser.** En databas betjänar ofta dussintals applikationer, och varje uppgift kräver sina egna rättigheter. Roller gör administrationen enklare och säkrare än att ge varje användare alla rättigheter direkt (se Föreläsning 2 och kapitlet om access control).

## Inference

**Inference** är att ställa frågor man har rätt att ställa och ur de tillåtna svaren dra slutsatser om information man inte har rätt till. Problemet uppstår när flera uppgifter tillsammans är känsligare än var för sig. Angriparen kan använda okänsliga data och **metadata**, alltså kunskap om samband mellan uppgifterna. Vägen som den skyddade informationen läcker genom kallas **inference channel**.

**Exempel:** rollen Clerk får se namn och löner var för sig, men vem som har vilken lön får bara Administrator se. Läggs anställningsdatumet i lönetabellen uppstår en inference channel: anställningsdatum är lätt att ta reda på, så Clerk kan lista ut vems lönen är.

Två sätt att möta hotet:

- **Vid databasdesignen:** ändra strukturen eller åtkomstreglerna, till exempel dela upp en tabell eller använda finare roller. Det blir ofta onödigt strikt och sänker tillgängligheten.
- **Vid frågetillfället:** upptäck en inference channel under en fråga eller en serie frågor, och neka eller ändra frågan.

**Håll isär inference och blind SQL injection.** Båda handlar om att sluta sig till data, men:

| | Inference | Blind SQL injection |
|---|---|---|
| Angriparen skickar | vanliga, tillåtna frågor | injicerad SQL via indata |
| Utnyttjar | att uppgifter tillsammans avslöjar mer än var för sig | en sårbarhet i applikationen |
| Hör till | databasens design och access control | SQLi-attackernas inferential-klass |
| Skydd | ändrad design eller kontroll vid frågetillfället | motåtgärderna mot SQLi, som prepared statements |

## Databaskryptering

Databasen skyddas av flera lager: brandväggar, autentisering, allmän access control och databasens egen access control. För särskilt känsliga data läggs kryptering till som **sista försvarslinjen**. Den kan göras på fyra nivåer: hela databasen, poster (rader), attribut (kolumner) eller enskilda fält.

Två nackdelar:

- **Key management:** behöriga användare och applikationer måste få nycklarna till just de delar de har rätt till, vilket är komplicerat när många använder databasen.
- **Inflexibility:** det blir svårare att söka bland posterna när databasen är krypterad.

Läggs databasen ut hos en tjänsteleverantör kan den krypteras utan att leverantören får nycklarna; klienten krypterar frågorna och dekrypterar svaren.

## Datacenter

Ett **data center** är en anläggning med ett stort antal servrar, lagringsenheter och nätverksutrustning, med reservkraft, redundanta nätverksanslutningar och klimatkontroll. Exempel är molnleverantörer, sökmotorer och stora företags IT.

Riskerna är störst här: enorma mängder data ligger på liten yta, är sammankopplade och nås utifrån, så en angripare som tagit sig förbi gränsen hotar hela anläggningen. Hot att räkna med är bland andra denial of service, advanced persistent threats, SQL injection, skadlig kod och fysiska hot.

Boken beskriver samma fyra lager som data center-modellen i Föreläsning 2: site, physical, network och data security. En skillnad: bokens fyrlagermodell lägger **mantrap** (en sluss med två dörrar för en person i taget) under physical security, alltså skyddet av själva datacentret, medan bilden i Föreläsning 2 lägger mantrap-entréer under site security. Gäller frågan bokens modell är svaret physical security, gäller den föreläsningens är det site security.

**TIA-942** är en standard för datacentrets telekommunikationsinfrastruktur. För säkerheten är **tiered reliability** viktigast: fyra tiers, där högre tier ger högre tillgänglighet.

| Tier | Utformning | Tillgänglighet / nertid per år |
|---|---|---|
| **1** | en enda väg för kraft och kyla, inga redundanta komponenter; störs av planerade och oplanerade händelser och måste stängas helt för underhåll | 99,671 % / 28,8 timmar |
| **2** | en enda väg men med redundanta komponenter; underhåll av kraftvägen kräver driftstopp | 99,741 % / 22,0 timmar |
| **3** | flera vägar för kraft och kyla men bara en aktiv; planerat underhåll utan avbrott, men oplanerade händelser stör fortfarande | 99,982 % / 1,6 timmar |
| **4** | flera aktiva vägar; planerat arbete stör inte, och anläggningen klarar minst en värsta tänkbara oplanerad händelse | 99,995 % / 0,4 timmar |
`,
};

export const topic = {
  id: "bok5-databas",
  name: "Databas- och datacentersäkerhet",
  chapter: "bok5",
  examWeight: "hög",
  summary: "Databaser samlar känsliga data och behöver eget skydd. SQL injection delas in i inband, inferential och out-of-band attacker och möts med defensive coding (som prepared statements), detection och run-time prevention. Databasens access control bygger på GRANT och REVOKE. Inference är slutsatser ur tillåtna frågor, kryptering är sista försvarslinjen, och TIA-942 delar in datacenter i fyra tiers.",
  keyPoints: [
    "Inband attack: resultatet kommer i samma kanal och visas på sidan; typerna är tautology, end-of-line comment och piggybacked queries.",
    "Inferential attack: inga data överförs; angriparen sluter sig till dem ur hur servern beter sig.",
    "Out-of-band attack: data hämtas i en annan kanal, till exempel ett mejl.",
    "Blind SQL injection: sant/falskt-frågor avslöjar data även när inga felmeddelanden visas.",
    "Motåtgärder mot SQLi: defensive coding (bland annat parameterized query insertion), detection och run-time prevention.",
    "Cascading authorizations: rättigheter som getts vidare med grant option återkallas i kedja.",
    "Inference: slutsatser om skyddade data ur svar på tillåtna frågor, via en inference channel.",
    "Databaskryptering: sista försvarslinjen; nackdelarna är key management och inflexibility.",
    "TIA-942: fyra tiers, från 99,671 % (tier 1) till 99,995 % (tier 4) tillgänglighet.",
  ],
  pitfalls: [
    "Blind SQL injection injicerar kod; inference drar slutsatser ur tillåtna frågor utan någon injektion.",
    "Inband visar resultatet på sidan, out-of-band skickar det i en annan kanal, och inferential överför inga data alls.",
    "Illegal queries läcker genom utförliga felmeddelanden; blind SQL injection fungerar utan felmeddelanden.",
    "Prepared statements hindrar att indata ändrar frågan; kryptering, backup och loggning gör det inte.",
    "Tier 3 klarar planerat underhåll utan avbrott men inte oplanerade händelser; det klarar först tier 4.",
    "Mantrap ligger under physical security i bokens fyrlagermodell, alltså själva datacentret, men under site security på bilden i Föreläsning 2.",
  ],
};

export const glossary = [
  { term: "Database management system (DBMS)", definition: "De program som bygger upp och underhåller en databas och låter många användare och applikationer ställa frågor till den via ett frågespråk.", chapter: "bok5" },
  { term: "Relational database", definition: "Databas av tabeller (relations) med rader (tuples) och kolumner (attributes). Tabellerna knyts ihop genom att en tabells primary key står som foreign key i en annan.", chapter: "bok5" },
  { term: "Inband attack", definition: "SQLi-attack där angriparen får resultatet i samma kanal som injektionen, direkt på webbsidan. Typerna är tautology, end-of-line comment och piggybacked queries.", chapter: "bok5" },
  { term: "Tautology", definition: "Inband SQLi-attack som gör ett villkor i frågan alltid sant, så att alla rader returneras, till exempel förbi en lösenordskontroll.", chapter: "bok5" },
  { term: "Piggybacked queries", definition: "Inband SQLi-attack där angriparen lägger egna frågor efter den avsedda i samma sträng. Kräver att servern tillåter flera frågor i en sträng.", chapter: "bok5" },
  { term: "Inferential attack", definition: "SQLi-attack där inga data överförs; angriparen skickar särskilda frågor och drar slutsatser av hur servern beter sig. Typerna är illegal/logically incorrect queries och blind SQL injection.", chapter: "bok5" },
  { term: "Blind SQL injection", definition: "Inferential SQLi-attack där angriparen sluter sig till data med sant/falskt-frågor, även när systemet inte visar några felmeddelanden.", chapter: "bok5" },
  { term: "Out-of-band attack", definition: "SQLi-attack där data hämtas i en annan kanal än injektionen, till exempel ett mejl med frågans resultat.", chapter: "bok5" },
  { term: "Defensive coding", definition: "Motåtgärder mot SQLi i själva koden: kontroll av indatatyp, mönstermatchning mot onormal indata och parameterized query insertion.", chapter: "bok5" },
  { term: "Parameterized query insertion", definition: "Utvecklaren anger frågans struktur och skickar värdena separat, så att indata inte kan ändra strukturen. Samma sak som prepared statements i gästföreläsningen.", chapter: "bok5" },
  { term: "Cascading authorizations", definition: "En rättighet som getts med grant option sprids i en kedja av användare. Återkallas den, försvinner också det som getts vidare, utom det som hade funnits ändå.", chapter: "bok5" },
  { term: "Inference", definition: "Att ställa tillåtna frågor och ur svaren dra slutsatser om information man inte har rätt till. Uppstår när flera uppgifter tillsammans är känsligare än var för sig.", chapter: "bok5" },
  { term: "Inference channel", definition: "Den väg genom vilken obehörig information kan härledas ur tillåtna data och metadata.", chapter: "bok5" },
  { term: "Database encryption", definition: "Kryptering av databasen, från hela databasen ned till enskilda fält; sista försvarslinjen. Nackdelarna är key management och inflexibility (svårare att söka).", chapter: "bok5" },
  { term: "Data center", definition: "Anläggning med ett stort antal servrar, lagringsenheter och nätverksutrustning. TIA-942 delar in datacenter i fyra tiers, där högre tier ger högre tillgänglighet.", chapter: "bok5" },
];

const T = "bok5-databas";

export const questions = [
  { id: "sak-bok5-v01", topic: T, difficulty: 1, ...variant("sak-01", "prepared statements mot SQL injection"),
    question: "Which SQL injection countermeasure sends the query structure and the user's values separately, so input cannot change the query?",
    options: [
      { text: "Prepared statements (parameterized queries)", explain: "Bokens parameterized query insertion: strukturen anges först och värdena skickas för sig, så indata aldrig blir kod." },
      { text: "Encrypting the database with client-held keys", explain: "Databaskryptering skyddar lagrade data, till exempel hos en extern leverantör, men ändrar inte hur frågan tolkas." },
      { text: "Signature-based detection of attack patterns", explain: "Signature-based detection är en motåtgärd av typen detection. Den letar efter kända attackmönster men skiljer inte kod från data." },
      { text: "Granting users only the SELECT privilege", explain: "Att begränsa rättigheterna med GRANT är databasens access control. Det kan minska skadan men hindrar inte att indata tolkas som kod." },
    ],
    correct: 0, reviewed: false },

  { id: "sak-bok5-v23", topic: T, difficulty: 2, ...variant("sak-23", "blind SQL injection som inferential attack"),
    question: "What characterizes a blind SQL injection attack?",
    options: [
      { text: "Descriptive error pages reveal the database structure", explain: "Det är illegal/logically incorrect queries. Där läcker felmeddelandena; i blind SQL injection visas inga." },
      { text: "The query results are e-mailed to the attacker", explain: "Att få ut data i en annan kanal, som ett mejl, är en out-of-band attack." },
      { text: "Allowed queries are combined to reveal hidden data", explain: "Det är inference, ett annat hot: angriparen ställer tillåtna frågor och injicerar ingen kod." },
      { text: "Data is inferred from true/false answers, no errors", explain: "Angriparen ställer sant/falskt-frågor och ser hur sidan reagerar, även när systemet inte visar några felmeddelanden." },
    ],
    correct: 3, reviewed: false },

  { id: "sak-bok5-01", topic: T, difficulty: 2,
    question: "In an inband SQL injection attack, how does the attacker get the data?",
    options: [
      { text: "Through another channel, such as an e-mail", explain: "Det är en out-of-band attack, som används när servern fritt får skicka trafik utåt." },
      { text: "Through the same channel, shown on the webpage", explain: "Inband betyder samma kanal för injektionen och resultatet. Typerna är tautology, end-of-line comment och piggybacked queries." },
      { text: "By seeing how the page reacts to true and false", explain: "Det är blind SQL injection, en inferential attack där inga data överförs." },
      { text: "From error pages that reveal the database type", explain: "Det är illegal/logically incorrect queries, en inferential attack som ofta förbereder andra attacker." },
    ],
    correct: 1, source: "Bokens kapitel 5 (inband, inferential och out-of-band)", reviewed: false },

  { id: "sak-bok5-02", topic: T, difficulty: 1,
    question: "Which type of SQL injection makes a condition in the query always true, so that every row is returned?",
    options: [
      { text: "Tautology attack", explain: "Villkoret blir en tautologi, alltid sant, till exempel så att en lösenordskontroll inte stoppar något." },
      { text: "Piggybacked queries", explain: "Där lägger angriparen till egna frågor efter den avsedda, i samma sträng." },
      { text: "End-of-line comment", explain: "En kommentar gör att resten av frågan inte körs. Bokens tautology-exempel använder också en, men det är tautologin som gör villkoret sant." },
      { text: "Blind SQL injection", explain: "Blind SQL injection ställer sant/falskt-frågor för att sluta sig till data; den returnerar inga rader på sidan." },
    ],
    correct: 0, source: "Bokens kapitel 5 (tautology)", reviewed: false },

  { id: "sak-bok5-03", topic: T, difficulty: 2,
    question: "In database security, what is inference?",
    options: [
      { text: "Asking true/false questions through injected SQL", explain: "Det är blind SQL injection, en SQLi-attack. Inference kräver ingen injektion." },
      { text: "Adding a second query after a legitimate one", explain: "Det är piggybacked queries, en inband SQLi-attack." },
      { text: "Deducing restricted data from allowed queries", explain: "Uppgifter som var för sig är tillåtna avslöjar tillsammans något skyddat, via en inference channel." },
      { text: "Passing on a right received with grant option", explain: "Det är cascading authorizations, en del av databasens access control." },
    ],
    correct: 2, source: "Bokens kapitel 5 (inference)", reviewed: false },

  { id: "sak-bok5-04", topic: T, difficulty: 2,
    question: "Which disadvantage of database encryption is about giving authorized users and applications the right decryption keys?",
    options: [
      { text: "The inflexibility problem", explain: "Inflexibility är den andra nackdelen: det blir svårare att söka bland krypterade poster." },
      { text: "The inference problem", explain: "Inference är att dra slutsatser ur tillåtna frågor; det hör inte till krypteringens nackdelar." },
      { text: "Cascading revocation of rights", explain: "Att rättigheter som getts vidare återkallas i kedja hör till access control, inte kryptering." },
      { text: "The key management problem", explain: "Behöriga användare och applikationer måste få nycklarna till just sina delar, och många använder databasen." },
    ],
    correct: 3, source: "Bokens kapitel 5 (databaskryptering)", reviewed: false },

  { id: "sak-bok5-05", topic: T, difficulty: 3,
    question: "A user got an access right with the grant option and passed it on. What usually happens to the passed-on rights if the user's right is revoked?",
    options: [
      { text: "They remain, since only that one user's right is revoked", explain: "Återkallelsen sprids i kedjan, precis som tilldelningen gjorde." },
      { text: "They are revoked too, unless they would exist anyway", explain: "Bara rättigheter som hade funnits även utan den återkallade tilldelningen står kvar." },
      { text: "They are handed back to the owner who created the table", explain: "Ägaren förekommer i ownership-based administration, men rättigheter går inte tillbaka till ägaren." },
      { text: "They stay until a database administrator removes them", explain: "Att några få privilegierade användare sköter rättigheterna är centralized administration; återkallelsen i kedjan sker ändå." },
    ],
    correct: 1, source: "Bokens kapitel 5 (cascading authorizations)", reviewed: false },

  { id: "sak-bok5-06", topic: T, difficulty: 2,
    question: "Which TIA-942 data center tier allows planned maintenance without disruption, but can still be disrupted by unplanned events?",
    options: [
      { text: "Tier 1", explain: "En enda väg för kraft och kyla utan redundans; måste stängas helt för underhåll. 99,671 % tillgänglighet." },
      { text: "Tier 2", explain: "Redundanta komponenter men en enda väg; underhåll av kraftvägen kräver driftstopp. 99,741 %." },
      { text: "Tier 3", explain: "Flera vägar men bara en aktiv, så den ena kan underhållas medan den andra bär lasten. 99,982 %." },
      { text: "Tier 4", explain: "Flera aktiva vägar; klarar också minst en värsta tänkbara oplanerad händelse. 99,995 %." },
    ],
    correct: 2, source: "Bokens kapitel 5 (TIA-942:s tiers)", reviewed: false },
];

export const notes = `Byggt på kap. 5 i del1-filen, s. 246–292: inledningen och 5.1 (varför databaser behöver eget skydd, de fyra skälen ur BENN06), 5.2 kort (DBMS, query language, OS-skydd mot DBMS-skydd), 5.3 kort (relation/tuple/attribute, primary och foreign key, view, SQL), 5.4 (idén bakom SQLi, mål, de tre attackklasserna och deras typer, motåtgärdernas tre typer), 5.5 (DAC/RBAC/MAC i DBMS, de tre administrativa policyerna, GRANT/REVOKE och grant option, cascading authorizations, RBAC kort med hänvisning), 5.6 (inference, metadata, inference channel, löneexemplet ur LUNT89 förkortat, de två angreppssätten), 5.7 (sista försvarslinjen, två nackdelar, fyra nivåer, utlagd databas i en mening), 5.8 (datacenter, varför riskerna är störst, hotlistan, fyralagersmodellen som hänvisning till Föreläsning 2, TIA-942:s fyra tiers med tillgänglighet och nertid). Key Terms och Review Questions 5.1–5.9 styrde urvalet. Body är cirka 1 570 ord (gränsen 1 600), därför är flera detaljer nedan utelämnade.

Osäkert:
- Boken skriver standarden både "TIA-492" (rubriken och första nämningen) och "TIA-942" (resten, Figure 5.13, Table 5.4). TIA-942 är rätt namn och det brief:en anger; kapitlet använder bara det.
- Mantrap: boken lägger mantrap under physical security (datacentret självt), medan Föreläsning 2:s bild och topics.js-fallgropen lägger mantrap-entréer under site security. Body nämner skillnaden neutralt utan att säga vilken som gäller på tentan; ingen fråga om det.
- Förra årets förklaring i examBank (sak-23) säger "Blind SQL injection är en inferensattack". Bokens term är inferential attack (en SQLi-klass), som är något annat än inference i 5.6. Body och en fallgrop skiljer dem åt; förklaringen i examBank kan behöva ett ord om det.
- Review Question 5.3 (hur många primary och foreign keys en tabell får ha) besvaras inte uttryckligen i texten. Kapitlet säger bara att en primary key är en eller flera kolumner och att en foreign key ger ett en-till-många-samband, inget om antal.
- Nedräkningen i tier-tabellen: boken ger både tillgänglighet och årlig nertid; jag har tagit med båda men utelämnat implementeringstid (3 mån, 3–6 mån, 15–20 mån) och raised floor/UPS/generator.
- "Inget av dem påverkar hur frågan tolkas" om förra årets felaktiga alternativ (kryptering, backup, loggning) bygger på examBank:s förklaring och bokens beskrivning av parameterized query insertion, inte på en mening i boken.
- Textfilen har tappat tidsindex (t1, t2 …) i cascading-exemplet med Lívia, Teri, Sophia, David m.fl.; regeln är återgiven ur bokens generalisering (GRIF76-konventionen), inte ur exemplet. Specialfallet med samma rättighet från två håll (det som gavs vidare efter den andra tilldelningen står kvar) är utelämnat för längdens skull.
- "Dataintrång i privatlivet" (privacy breaches) står inte med i datacentrets hotlista i body, som skriver "bland andra".

Medvetet utelämnat: statistiken om SQLi (Imperva, OWASP 2021 som placerade injection trea, Veracode, Trustwave), den sexstegade bilden av en typisk SQLi-attack, kodexemplen, attack avenues (user input, server variables, second-order injection, cookies, physical user input), SQL DOM, detaljer om DBMS-arkitekturen (DDL, DML, authorization tables, concurrent access table), databasens definition, GRANT-syntaxen och IDENTIFIED BY, de tre användarkategorierna (application owner, end user, administrator), SQL Servers fasta roller, user-defined roles och application roles, inference-teknikerna (funktionella beroenden och sammanslagna views, med Inventory-exemplet), lösningen på löneexemplet och att den läckan inte syns i databasen, att inference detection är ett svårt forskningsproblem, krypteringsschemats fyra entiteter och indexpartitioneringen (inklusive att indexen läcker en grov ordning), att molnet ökar bördan, datacentrets element (ToR-switchar, kabeldragning, cross connects), TIA-942:s ämneslista och funktionsområden (entrance room, MDA, HDA, EDA, ZDA), tiers implementeringstid samt kapitlets Problems.

Ordlistan: 15 termer. Inte med fast de är key terms: attribute, tuple, relation, primary key, foreign key och view (förklarade i body, och relation/tuple/attribute samt nycklarna ryms i "Relational database"), database, database access control, query language, SQL, RDBMS, end-of-line comment, detection, run-time prevention. "SQL injection (SQLi) attack" utelämnad eftersom "SQL injection (SQLi)" redan finns från gästföreläsningen; "detection" utelämnad för att inte krocka med kapitlet om intrusion detection.

Frågor: 8 st, varav varianterna sak-bok5-v01 (prepared statements, frågar baklänges från egenskapen till åtgärden, med kryptering, signature-based detection och GRANT som distraktorer) och sak-bok5-v23 (blind SQL injection, rätt stavat och med exakt ett rätt alternativ; distraktorerna är illegal queries, out-of-band och inference). Rätt position 2/2/2/2. Möjliga tillägg om taket höjs: varför operativsystemets skydd inte räcker för databaser, de tre administrativa policyerna, de fyra nivåerna för kryptering.`;
