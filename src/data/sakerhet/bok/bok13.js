// Bokens kapitel 13: Stallings & Brown, Cloud and IoT Security (s. 724–784).
// Kapitel, ämne, ordlista och frågor; samlas av reading.js, topics.js och
// questions.js via bok/index.js. Skrivet med egna ord på tentans nivå,
// granskat mot boken 22 nov 2026 (ogranskat av Kasper). `notes` är
// källanteckningarna och visas inte.

const variant = (id, what) => ({ variantOf: id, source: `Variant av en tentafråga från förra året (${what})` });

export const chapter = {
  id: "bok13",
  kind: "bok",
  label: "Bokens kapitel 13",
  examArea: "Bokfrågor",
  title: "Moln- och IoT-säkerhet",
  readingMinutes: 11,
  lead: "Molnets modeller enligt NIST, vem som ansvarar för vad, de största molnhoten enligt Cloud Security Alliance, och hur sakernas internet byggs upp och skyddas.",
  sources: ["Stallings & Brown kap. 13 (s. 724–784)"],
  body: `
## Kärnan

- **Cloud computing** har enligt NIST fem väsentliga egenskaper, tre tjänstemodeller och fyra driftsmodeller.
- **Tjänstemodellerna SaaS, PaaS och IaaS** ligger i varandra. Ju längre ner i stacken kunden hyr, desto mer sköter kunden själv.
- **Ansvaret delas.** Kunden lämnar över kontroll till leverantören, men ansvaret för säkerhetspolicyerna ligger kvar.
- **Cloud Security Alliance (CSA)** listar sju hot som är särskilda för molnet.
- **Internet of things (IoT)** är miljarder sammankopplade smarta enheter. Enheterna i nätets kant är den svagaste delen, bland annat för att de är svåra att patcha.

## Vad cloud computing är

Enligt NIST får kunden över nätet åtkomst på begäran till en delad pool av resurser (nät, servrar, lagring, applikationer och tjänster), som tas i bruk och lämnas tillbaka snabbt och nästan utan kontakt med leverantören.

De fem **essential characteristics**:

| Egenskap | Innebär |
|---|---|
| **Broad network access** | tjänsterna nås över nätet med standardmekanismer, från mobiler, laptops och surfplattor |
| **Rapid elasticity** | resurserna utökas och minskas efter behov, till exempel många servrar under en uppgift |
| **Measured service** | användningen (lagring, processorkraft, bandbredd) mäts automatiskt, så att både leverantör och kund ser den |
| **On-demand self-service** | kunden tar själv fram resurser, som servertid och lagring, utan någon människa hos leverantören |
| **Resource pooling** | leverantörens resurser delas mellan många kunder i en multi-tenant-modell; kunden vet oftast inte exakt var de finns |

## Tjänstemodellerna: SaaS, PaaS och IaaS

| Modell | Kunden får | Exempel |
|---|---|---|
| **Software as a service (SaaS)** | leverantörens färdiga applikationer, oftast via webbläsaren; kunden slipper installation, uppgraderingar och patchar | Gmail, Microsoft 365, Salesforce |
| **Platform as a service (PaaS)** | en plattform att köra egna applikationer på, med utvecklingsverktyg och körmiljöer; i praktiken ett operativsystem i molnet | Heroku, Google AppEngine |
| **Infrastructure as a service (IaaS)** | virtuella maskiner, lagring och nät, där kunden kan köra vilken mjukvara som helst, även egna operativsystem | Amazon EC2, Google Compute Engine |

Leverantören står alltid för den fysiska infrastrukturen. Uppåt i stacken tar den över mer:

| | Leverantören sköter | Kunden sköter |
|---|---|---|
| **IaaS** | servrar, lagring, nät och anläggningen, plus hypervisorn som kör de virtuella maskinerna | operativsystem och applikationer, ibland vissa nätfunktioner som värdbrandväggar |
| **PaaS** | dessutom körmiljö, databaser, bibliotek och annan middleware | sina egna applikationer: utveckla, testa, driftsätta och förvalta dem |
| **SaaS** | dessutom applikationerna: driftsättning, konfiguration, underhåll och uppdateringar | användningen, och inställningar för de egna användarna |

Säkerhetsansvaret följer samma mönster. Kunderna ansvarar för säkerheten på applikationsnivå, leverantören för den fysiska säkerheten (se kapitlet om fysisk säkerhet och infrastruktur) och en del mjukvara, som yttre brandväggsregler. Lagren däremellan delas. Kunden förlorar alltså kontroll, men behåller ansvaret (accountability) för sina säkerhets- och integritetspolicyer. Gästföreläsningen säger samma sak med "cloud security is identity security": leverantören skyddar plattformen, kunden sin konfiguration, sina data och sina behörigheter.

## Driftsmodellerna

| Modell | Vem molnet är till för | Kännetecken |
|---|---|---|
| **Public cloud** | allmänheten eller en stor bransch; ägs av ett företag som säljer molntjänster | leverantören ansvarar för infrastrukturen och för kontrollen av data och drift; billigt, men säkerheten är den största oron |
| **Private cloud** | en organisation, i dess egen IT-miljö; förvaltas internt eller av tredje part | främsta skälet är säkerhet, till exempel kontroll över var data lagras |
| **Community cloud** | flera oberoende organisationer med liknande krav, till exempel inom vården | begränsad åtkomst som ett privat moln, delade resurser som ett publikt |
| **Hybrid cloud** | två eller fler moln som förblir separata men binds samman så att data och applikationer kan flyttas | känsliga data i den privata delen, mindre känsliga i den publika |

Bokens jämförelse i korthet:

| | Private | Community | Public | Hybrid |
|---|---|---|---|---|
| Säkerhet | säkrast | mycket säker | måttligt säker | mycket säker |
| Skalbarhet | begränsad | begränsad | mycket hög | mycket hög |
| Kostnad | hög | medel | låg | medel |

I ett publikt moln ligger alla viktiga komponenter utanför företagets brandvägg. Perimeterskyddet, det yttersta lagret i zero trust-cirkeln i Föreläsning 2, räcker då inte; skyddet måste sitta i lagren innanför. Å andra sidan kan stora leverantörer ha mer resurser för säkerhet än ett privat moln.

## Aktörerna

NIST:s **reference architecture** beskriver vad molntjänster ska ge, inte hur de byggs. Den har fem aktörer:

| Aktör | Roll |
|---|---|
| **Cloud service consumer (CSC)** | använder tjänster från en leverantör |
| **Cloud service provider (CSP)** | gör tjänsten tillgänglig |
| **Cloud auditor** | granskar tjänsterna oberoende, till exempel säkerhet, integritet och prestanda |
| **Cloud broker** | sköter användningen och leveransen av tjänster åt kunden och förhandlar med leverantörerna |
| **Cloud carrier** | står för förbindelsen och transporten mellan leverantörer och kunder |

En broker erbjuder **service intermediation** (mervärde som identitetshantering), **service aggregation** (kombinerar flera leverantörers tjänster) och **service arbitrage** (som aggregation, men tjänsterna är inte fasta).

## Hoten mot molnet

Säkerhetskontrollerna i molnet liknar dem i all annan IT, men driftsformen ger egna risker. Kunderna delar leverantörens resurser och måste skyddas från varandra; virtualisering skyddar mot det mesta, men inte allt. Kunden måste också skyddas mot leverantören, till exempel om en utrangerad hårddisk inte raderas.

**Cloud Security Alliance** listar sju hot som är särskilda för molnet:

| Hot | Kärnan |
|---|---|
| **Abuse and nefarious use of cloud computing** | det är lätt att registrera sig, ibland gratis, så angripare använder molnet för spam, skadlig kod och DoS-attacker |
| **Insecure interfaces and APIs** | kunderna sköter tjänsterna via leverantörens gränssnitt och API:er, så tjänstens säkerhet hänger på dem |
| **Malicious insiders** | kunden ger leverantören stort förtroende, och vissa roller, som leverantörens systemadministratörer, är högrisk |
| **Shared technology issues** | IaaS-kunder delar komponenter, som processorcache, som inte byggts för att hålla kunder isolerade |
| **Data loss or leakage** | för många kunder den allvarligaste följden av ett intrång |
| **Account or service hijacking** | angripare tar över konton, oftast med stulna inloggningsuppgifter |
| **Unknown risk profile** | kunden lämnar över kontroll och ser inte hela riskbilden |

**Insecure interfaces and APIs** var svaret på en av förra årets tentafrågor. Account or service hijacking visar varför gästföreläsningen kallar molnsäkerhet identitetssäkerhet; boken föreslår bland annat tvåfaktorsautentisering som motåtgärd (MFA, se Föreläsning 2).

## Dataskydd i molnet

Data kan förstöras på många sätt, till exempel om poster raderas utan backup eller om krypteringsnyckeln försvinner. I molnet ökar riskerna, eftersom fler risker samverkar. Databaser i molnet finns i två modeller:

| | **Multi-instance model** | **Multi-tenant model** |
|---|---|---|
| Upplägg | varje kund får en egen DBMS på en egen virtuell maskin | kunderna delar en färdig miljö, och varje kunds data märks med ett kund-id |
| Kontroll | kunden styr själv roller, behörigheter och annan säkerhetsadministration | det ser ut som en egen instans, men kunden förlitar sig på att leverantören håller miljön säker |

Data ska skyddas **at rest**, **in transit** och **in use**, och åtkomsten ska kontrolleras. För lagrade data är det ideala att kunden själv krypterar databasen och att leverantören aldrig får nyckeln. Då kan leverantören inte läsa data, men data kan fortfarande förstöras eller göras otillgängliga. Databaskryptering förklaras i kapitlet om databas- och datacentersäkerhet.

## Security as a service

**Security as a service** är ett paket säkerhetstjänster från en leverantör som tar över mycket av säkerhetsansvaret från företaget. I molnet kallas det **cloud security as a service (SecaaS)** och är en del av leverantörens SaaS-utbud. Tjänsterna levereras via molnet, till molnbaserade system eller till kundens egna lokala system.

CSA delar in SecaaS i tio kategorier: identity and access management, data loss prevention, web security, e-mail security, security assessments, intrusion management, SIEM, encryption, business continuity and disaster recovery samt network security. De som är lättast att blanda ihop:

| Kategori | Vad den gör |
|---|---|
| **Identity and access management (IAM)** | verifierar identiteter, ger rätt åtkomst och tar bort den när någon inte längre ska ha den |
| **Data loss prevention (DLP)** | övervakar och skyddar data i vila, i rörelse och i användning |
| **Security assessments** | granskningar av molntjänsterna som görs av tredje part |
| **Intrusion management** | upptäcker, förhindrar och hanterar intrång med IDS och IPS (se kapitlet om intrusion detection) |
| **Security information and event management (SIEM)** | samlar in och analyserar logg- och händelsedata för larm i realtid |

**OpenStack** är ett molnoperativsystem i öppen källkod för IaaS. Dess säkerhetsmodul **Keystone** sköter bland annat identiteter, som är grunden för RBAC.

## Internet of things

**IoT** är den växande sammankopplingen av smarta enheter, från hushållsapparater till små sensorer. Enheterna har inbyggda sändtagare med kort räckvidd och kommunicerar med människor och med varandra, oftast via molnet.

En IoT-enhet byggs av fem komponenter:

| Komponent | Gör |
|---|---|
| **Sensor** | mäter något i omgivningen och ger en elektronisk signal |
| **Actuator** | tar emot en signal från en styrenhet och påverkar sin omgivning |
| **Microcontroller** | det "smarta" i en smart enhet |
| **Transceiver** | sänder och tar emot data, oftast trådlöst |
| **RFID** | identifierar föremål med radiovågor, med taggar och läsare |

IoT delas i fyra nivåer, från enheterna in mot centrum:

| Nivå | Vad som finns där |
|---|---|
| **Edge** | nätet av IoT-enheter, alltså sensorer och aktuatorer, och **gateways** som översätter mellan enheternas protokoll och näten ovanför |
| **Fog** | bearbetning nära sensorerna, som gör stora dataflöden till information och minskar datamängden innan den lagras; kallas ibland edge computing level |
| **Core** | stamnätet (**backbone network**) som förbinder utspridda fog-nät med varandra och med andra nät |
| **Cloud** | lagring och bearbetning av de samlade datamängderna, och applikationerna som styr enheterna och analyserar data |

Fog är molnets motsats: molnet är centralt med hög latens, fog ligger ute vid enheterna med låg latens.

## IoT-säkerhet

Boken kallar IoT kanske det mest komplexa och outvecklade området inom nätsäkerhet. Mirai-attacken 2016 visade varför: ett botnät av hundratusentals kapade IoT-enheter störde internet på USA:s östkust (se kapitlet om denial-of-service-attacker).

- **Enheter med små resurser** (constrained devices) har oftast inga säkerhetsfunktioner alls. En gateway kan skydda kommunikationen in mot de centrala systemen, men enheterna bakom den ligger utanför den skyddade zonen.
- **Patching vulnerability:** inbyggda enheter är fulla av sårbarheter, och det finns inget bra sätt att patcha dem. Chiptillverkarna vill tillverka snabbt och billigt, enhetstillverkarna bryr sig om enhetens funktion, och slutanvändaren kan ofta inte patcha. Via en sensor kan en angripare mata in falska data, via en aktuator påverka maskiner.

Standarden ITU-T Y.2066 sammanfattar säkerhetskraven: säker kommunikation, säker datahantering, säkra tjänster, samordnade säkerhetspolicyer, **mutual authentication and authorization** innan en enhet eller användare släpps in, och **security audit**, så att varje åtkomst går att spåra.

Ciscos ramverk för IoT-säkerhet räknar enheterna i kanten som den mest sårbara delen: de står ofta utan fysiskt skydd och ska fungera i åratal. För trådlösa sensornät finns **MiniSec**, en säkerhetsmodul i öppen källkod som ger confidentiality, autentisering och skydd mot replay med låg energiåtgång.
`,
};

export const topic = {
  id: "bok13-moln",
  name: "Moln- och IoT-säkerhet",
  chapter: "bok13",
  examWeight: "hög",
  summary: "NIST definierar cloud computing med fem väsentliga egenskaper, tre tjänstemodeller (SaaS, PaaS, IaaS) och fyra driftsmodeller (public, private, community, hybrid). Ju längre ner i stacken kunden hyr, desto mer sköter kunden själv, men ansvaret för säkerhetspolicyerna ligger alltid kvar hos kunden. Cloud Security Alliance listar sju molnspecifika hot, och SecaaS levererar säkerhet som molntjänst. IoT delas i nivåerna edge, fog, core och cloud, och enheterna i kanten är svagast, bland annat på grund av patching vulnerability.",
  keyPoints: [
    "NIST:s fem egenskaper: broad network access, rapid elasticity, measured service, on-demand self-service och resource pooling.",
    "Tjänstemodellerna: i SaaS använder kunden färdiga applikationer, i PaaS kör den egna applikationer på leverantörens plattform, i IaaS styr den operativsystem och applikationer.",
    "Delat ansvar: kunden har applikationsnivån, leverantören den fysiska säkerheten, och lagren däremellan delas; kunden behåller ansvaret för sina policyer.",
    "Driftsmodellerna: public (alla), private (en organisation), community (flera med liknande krav) och hybrid (separata moln som binds samman).",
    "CSA:s molnspecifika hot: abuse of cloud computing, insecure interfaces and APIs, malicious insiders, shared technology issues, data loss or leakage, account or service hijacking och unknown risk profile.",
    "Dataskydd i vila: det ideala är att kunden krypterar och att leverantören aldrig får nyckeln.",
    "SecaaS: säkerhetstjänster som IAM, DLP, SIEM och intrusion management, levererade via molnet som en del av SaaS.",
    "IoT:s fyra nivåer: edge (enheter och gateways), fog (bearbetning nära sensorerna), core (stamnätet) och cloud.",
    "Patching vulnerability: IoT-enheter är fulla av sårbarheter men går inte att patcha på något bra sätt.",
  ],
  pitfalls: [
    "I IaaS styr kunden operativsystemet; i PaaS sköter leverantören även körmiljön och kunden bara sina applikationer.",
    "Community cloud delas av flera organisationer med liknande krav; hybrid cloud är flera separata moln som binds samman.",
    "Kunden förlorar kontroll i molnet, men inte ansvaret för sina säkerhets- och integritetspolicyer.",
    "Fog bearbetar data nära sensorerna; edge är själva enheterna och gateways, även om fog ibland kallas edge computing level.",
    "CSA:s lista gäller hot som är särskilda för molnet; allmänna hot som phishing och borttappade USB-minnen står inte där.",
  ],
};

export const glossary = [
  { term: "Cloud computing", definition: "Enligt NIST en modell för åtkomst över nätet, på begäran, till en delad pool av konfigurerbara resurser som snabbt tas i bruk och släpps. Har fem väsentliga egenskaper, tre tjänstemodeller och fyra driftsmodeller.", chapter: "bok13" },
  { term: "Software as a service (SaaS)", definition: "Tjänstemodell där kunden använder leverantörens färdiga applikationer i molnet, oftast via webbläsaren, till exempel Gmail eller Microsoft 365.", chapter: "bok13" },
  { term: "Platform as a service (PaaS)", definition: "Tjänstemodell där kunden får en plattform med byggblock, utvecklingsverktyg och körmiljö att köra egna applikationer på.", chapter: "bok13" },
  { term: "Infrastructure as a service (IaaS)", definition: "Tjänstemodell där kunden hyr virtuella maskiner, lagring och nät och själv styr operativsystem och applikationer, till exempel Amazon EC2.", chapter: "bok13" },
  { term: "Public cloud", definition: "Driftsmodell där molnet är öppet för allmänheten eller en stor bransch och ägs av ett företag som säljer molntjänster. Billigt och skalbart, men säkerheten är den största oron.", chapter: "bok13" },
  { term: "Private cloud", definition: "Driftsmodell där molnet finns i en enda organisations IT-miljö och förvaltas av den själv eller av tredje part. Främsta skälet är säkerhet.", chapter: "bok13" },
  { term: "Community cloud", definition: "Driftsmodell där flera oberoende organisationer med liknande krav delar ett moln med begränsad åtkomst, till exempel inom vården.", chapter: "bok13" },
  { term: "Hybrid cloud", definition: "Två eller fler moln (privata, community eller publika) som förblir separata men binds samman så att data och applikationer kan flyttas mellan dem.", chapter: "bok13" },
  { term: "Cloud broker", definition: "Aktör i NIST:s referensarkitektur som sköter användningen och leveransen av molntjänster åt kunden och förhandlar med leverantörerna, genom service intermediation, aggregation och arbitrage.", chapter: "bok13" },
  { term: "Multi-tenant model", definition: "Databasmodell i molnet där kunderna delar en färdig miljö och varje kunds data märks med ett kund-id. Kunden förlitar sig på att leverantören håller miljön säker. Motsatsen är multi-instance model, med en egen DBMS per kund.", chapter: "bok13" },
  { term: "Security as a service (SecaaS)", definition: "Säkerhetstjänster som levereras via molnet, till exempel IAM, DLP, SIEM och intrusion management. I molnet en del av leverantörens SaaS-utbud.", chapter: "bok13" },
  { term: "Internet of things (IoT)", definition: "Den växande sammankopplingen av smarta enheter, från hushållsapparater till små sensorer, som oftast kommunicerar via molnet.", chapter: "bok13" },
  { term: "Actuator", definition: "IoT-komponent som tar emot en signal från en styrenhet och påverkar sin omgivning. En sensor mäter, en actuator agerar.", chapter: "bok13" },
  { term: "Fog", definition: "IoT-nivån mellan enheterna i kanten och stamnätet, där data bearbetas nära sensorerna så att mindre mängder behöver lagras centralt. Kallas ibland edge computing level.", chapter: "bok13" },
  { term: "Patching vulnerability", definition: "Att inbyggda IoT-enheter är fulla av sårbarheter men inte går att patcha på något bra sätt, eftersom varken tillverkarna eller användarna sköter uppdateringarna.", chapter: "bok13" },
];

export const questions = [
  { id: "sak-bok13-v24", topic: "bok13-moln", difficulty: 1, ...variant("sak-24", "ett av CSA:s största molnhot"),
    question: "Which of these is on the Cloud Security Alliance's list of top cloud-specific security threats?",
    options: [
      { text: "Phishing e-mails sent to staff", explain: "Phishing hotar alla organisationer, med eller utan moln. Det är inget molnspecifikt hot och står inte på CSA:s lista." },
      { text: "Lost unencrypted USB sticks", explain: "Ett allmänt hot mot data på bärbara medier, inte ett hot som är särskilt för molnet." },
      { text: "Insecure interfaces and APIs", explain: "Kunderna sköter molntjänsterna via leverantörens gränssnitt och API:er, så tjänstens säkerhet och tillgänglighet hänger på att de är säkra." },
      { text: "Over-provisioned elastic capacity", explain: "Låter molnspecifikt eftersom rapid elasticity är en av molnets egenskaper, men det är en kostnadsfråga och står inte på listan." },
    ],
    correct: 2, reviewed: false },

  { id: "sak-bok13-01", topic: "bok13-moln", difficulty: 1,
    question: "Which essential characteristic of cloud computing means that the provider's resources are shared among many consumers and assigned dynamically, often without the consumer knowing their exact location?",
    options: [
      { text: "Resource pooling", explain: "Leverantörens resurser delas mellan många kunder i en multi-tenant-modell och fördelas efter efterfrågan." },
      { text: "Rapid elasticity", explain: "Rapid elasticity är att resurserna snabbt kan utökas och minskas efter behov, inte att de delas mellan kunder." },
      { text: "Measured service", explain: "Measured service är att användningen mäts, övervakas och rapporteras automatiskt." },
      { text: "Broad network access", explain: "Broad network access är att tjänsterna nås över nätet med standardmekanismer från olika slags klienter." },
    ],
    correct: 0, source: "Bokens kapitel 13 (NIST:s väsentliga egenskaper)", reviewed: false },

  { id: "sak-bok13-02", topic: "bok13-moln", difficulty: 2,
    question: "In the infrastructure as a service (IaaS) model, what does the customer control?",
    options: [
      { text: "Only the use of the provider's finished applications", explain: "Det är SaaS, där leverantören sköter applikationerna och kunden bara använder dem och ställer in dem för sina användare." },
      { text: "Only its own applications on the provider's platform", explain: "Det är PaaS, där leverantören också sköter körmiljö, databaser och middleware." },
      { text: "The physical servers, storage and network as well", explain: "Den fysiska infrastrukturen sköter leverantören i alla tre tjänstemodellerna." },
      { text: "Operating systems and applications, not the hardware", explain: "I IaaS styr kunden operativsystem och applikationer, ibland också vissa nätfunktioner som värdbrandväggar, men inte infrastrukturen under." },
    ],
    correct: 3, source: "Bokens kapitel 13 (ansvaret i tjänstemodellerna)", reviewed: false },

  { id: "sak-bok13-03", topic: "bok13-moln", difficulty: 2,
    question: "What characterizes a community cloud?",
    options: [
      { text: "It is run inside a single organization's own IT environment", explain: "Det är ett private cloud. Ett community cloud delas av flera oberoende organisationer." },
      { text: "Organizations with similar needs share it with limited access", explain: "Som ett privat moln har det begränsad åtkomst, och som ett publikt delas resurserna, här mellan organisationer med liknande krav, till exempel inom vården." },
      { text: "It is open to the general public and owned by a cloud seller", explain: "Det är ett public cloud, som ägs av ett företag som säljer molntjänster." },
      { text: "Two or more separate clouds are bound together so data can move", explain: "Det är ett hybrid cloud, där till exempel känsliga data kan ligga i den privata delen och mindre känsliga i den publika." },
    ],
    correct: 1, source: "Bokens kapitel 13 (driftsmodellerna)", reviewed: false },

  { id: "sak-bok13-04", topic: "bok13-moln", difficulty: 2,
    question: "According to the book, what is the ideal protection for a client's data at rest in the cloud?",
    options: [
      { text: "The client encrypts it and the provider never gets the key", explain: "Så länge nyckeln är säker kan leverantören inte läsa data. Data kan ändå förstöras eller göras otillgängliga." },
      { text: "The provider encrypts it and keeps the key for the client", explain: "Då kan leverantören läsa data. Det ideala är det omvända: kunden har nyckeln, inte leverantören." },
      { text: "Each record is tagged with the subscriber's own identifier", explain: "Märkningen hör till multi-tenant model och skiljer kunderna åt, men kunden förlitar sig då helt på leverantören." },
      { text: "The data is kept in a multi-instance database of its own", explain: "En egen DBMS-instans ger kunden kontroll över roller och behörigheter, men bokens ideal för lagrade data är kundens egen kryptering." },
    ],
    correct: 0, source: "Bokens kapitel 13 (dataskydd i molnet)", reviewed: false },

  { id: "sak-bok13-05", topic: "bok13-moln", difficulty: 2,
    question: "What is cloud security as a service (SecaaS)?",
    options: [
      { text: "An independent party that audits cloud providers", explain: "Det är en cloud auditor, en av aktörerna i NIST:s referensarkitektur. Granskningar av tredje part är bara en av SecaaS-kategorierna." },
      { text: "The open-source security module of OpenStack", explain: "Det är Keystone, som sköter identiteter, tokens, tjänstekatalog och policyer i OpenStack." },
      { text: "Security services delivered via the cloud, part of SaaS", explain: "Till exempel IAM, DLP, SIEM och intrusion management, levererade via molnet till molnbaserade eller lokala system." },
      { text: "The Cloud Security Alliance's list of top cloud threats", explain: "CSA:s lista tar upp hot som insecure interfaces and APIs. SecaaS är tjänster, inte en lista över hot." },
    ],
    correct: 2, source: "Bokens kapitel 13 (security as a service)", reviewed: false },

  { id: "sak-bok13-06", topic: "bok13-moln", difficulty: 2,
    question: "In the IoT, which level processes data close to the sensors, turning large data flows into smaller amounts of information for storage?",
    options: [
      { text: "The edge level", explain: "Edge är själva nätet av IoT-enheter och gateways. Fog kallas visserligen ibland edge computing level, men bearbetningen sker i fog-nivån." },
      { text: "The fog level", explain: "Fog-nivån ligger nära enheterna och utvärderar, formaterar och reducerar data innan de skickas vidare, med låg latens." },
      { text: "The core level", explain: "Core är stamnätet (backbone network) som förbinder utspridda fog-nät med varandra och med andra nät." },
      { text: "The cloud level", explain: "Molnet lagrar och bearbetar de samlade datamängderna centralt, långt från sensorerna." },
    ],
    correct: 1, source: "Bokens kapitel 13 (IoT:s nivåer)", reviewed: false },

  { id: "sak-bok13-07", topic: "bok13-moln", difficulty: 2,
    question: "What is meant by the patching vulnerability of IoT devices?",
    options: [
      { text: "Patches are often used to spread malware to the devices", explain: "Boken säger inget om att patchar sprider skadlig kod. Problemet är att patchar saknas eller inte går att installera." },
      { text: "Devices are patched so often that they become unstable", explain: "Tvärtom: problemet är att enheterna knappt går att patcha alls." },
      { text: "Attackers exploit the gap between a fix and its install", explain: "Det beskriver ett allmänt problem med all patchning. För IoT är problemet att det inte finns något bra sätt att patcha." },
      { text: "Embedded devices are full of flaws but hard to patch", explain: "Chiptillverkarna vill tillverka billigt, enhetstillverkarna fokuserar på funktionen och användaren kan ofta inte patcha. Via sensorer kan angripare mata in falska data, via aktuatorer påverka maskiner." },
    ],
    correct: 3, source: "Bokens kapitel 13 (patching vulnerability)", reviewed: false },
];

export const notes = `Byggt på kap. 13 i del2-filen, PDF-sidorna 724–784: s. 727–729 (NIST SP 800-145:s definition och de fem egenskaperna), 729–731 (SaaS, PaaS, IaaS), 732–734 (de fyra driftsmodellerna och Table 13.1), 735–738 (referensarkitekturen, de fem aktörerna, brokerns tre tjänster, vad CSP gör per tjänstemodell), 742–743 (delat ansvar, delade resurser, skydd mot leverantören), 746–748 (CSA:s lista [CSA13] med motåtgärder), 749 (dataskydd, multi-instance/multi-tenant, data at rest), 750–752 (tillgångar per tjänstemodell, SecaaS och CSA:s tio kategorier), 756 (OpenStack/Keystone), 759–765 (IoT, fyra generationer, fem komponenter, edge/fog/core/cloud, Table 13.4), 766–777 (IoT-säkerhet, Mirai, constrained devices, patching vulnerability, ITU-T Y.2066, Ciscos ramverk), 779 (MiniSec), 782–784 (Key Terms och Review Questions 13.1–13.10).

CSA-listan i den här upplagan: sju hot ur [CSA13], och "Insecure interfaces and APIs" står med i just den formuleringen. Varianten sak-bok13-v24 frågar därför efter det med bokens ord. Det rätta alternativet är det enda som är ordagrant (bortsett från versaler) samma som i originalet. Distraktorerna är nya: två allmänna hot som inte är molnspecifika (phishing, borttappade okrypterade USB-minnen) och ett påhittat molnaktigt (over-provisioned elastic capacity). Jag undvek hot som står på CSA:s senare listor (Pandemic Eleven: misconfiguration, system vulnerabilities, accidental data disclosure m.fl.), så att ingen distraktor kan vara rätt enligt en nyare lista. Boken nämner att CSA uppdaterat listan ("Pandemic Eleven" [CSA22]) men återger den inte; body säger inget om det.

Osäkert:
- Figure 13.2 (Separation of Responsibilities) och Figure 13.5 (tillgångar och ansvar per modell) finns inte i textfilen. Tabellen "Leverantören sköter / Kunden sköter" bygger på löptexten: IaaS-kunden styr OS, applikationer och ibland värdbrandväggar (s. 729–730), CSP:s uppgifter per modell (s. 736–737) och tillgångarna per modell (s. 750: hypervisor/OS och nät för IaaS, plus bibliotek och middleware för PaaS, plus applikationer för SaaS).
- Kopplingen till zero trust ("perimeterskyddet räcker då inte") är min slutsats av bokens mening om att allt i ett publikt moln ligger utanför företagets brandvägg, satt ihop med föreläsningens cirkel. Boken säger inte zero trust.
- "Ett operativsystem i molnet" för PaaS är bokens egen bild ("an operating system in the cloud"), översatt.
- Boken säger att den publika molnets IaaS inte nödvändigtvis sköter efterlevnad av integritetslagar, som förblir kundens ansvar; jag lät det ingå i den allmänna meningen om att ansvaret ligger kvar hos kunden.

Medvetet utelämnat: NIST SP 800-144-tabellen (Table 13.2), SP 800-146 och kontrollklasserna i Table 13.3, ACSC-listan, Tier 4-datacenter (finns i kapitlet om databas- och datacentersäkerhet), de detaljerade motåtgärdslistorna per CSA-hot (bara ett exempel per hot), nätverksfrågorna kring Figure 13.4, OpenStacks Nova, Glance och Swift, fog-operationerna (evaluation, formatting, expanding, distillation, assessment), större delen av Table 13.4, ITU-T Y.2067 (gatewayens åtta funktioner), Ciscos fyra nivåer och fyra kapaciteter i detalj, de fyra komponenterna i secure IoT framework som namn (authentication, authorization, network enforced policy, secure analytics), trust relationship-exemplet med bilen, NISTIR 8259 och IoT Cybersecurity Improvement Act, samt MiniSec utöver en mening (Skipjack, OCB, MiniSec-U/B, freshness, Bloom filter: kryptodetaljer som hör hemma i kryptokapitlen).

Hänvisningar i body (med titel): gästföreläsningen, Föreläsning 2 (zero trust, MFA), kapitlen om fysisk säkerhet och infrastruktur, databas- och datacentersäkerhet, intrusion detection och denial-of-service-attacker. Boken hänvisar själv organisationsfrågorna kring molnets tillgångar till kap. 14, 15 och 17 och fysisk säkerhet till kap. 16.

Ordlistan: 15 termer, kontrollerade mot sajtens hela ordlista 22 nov 2026 (inga krockar, skiftlägesokänsligt). Inte med fast de är key terms: cloud service consumer, cloud service provider, cloud auditor, cloud carrier (förklarade i aktörstabellen), service intermediation/aggregation/arbitrage (i Cloud broker-termen), multi-instance model (i Multi-tenant-termen), core, edge och backbone network (i Fog-termen och nivåtabellen), sensor (krockar lätt med IDS-kapitlets Inline sensor och Passive sensor), microcontroller, transceiver, RFID, IAM (nära ICAM i kapitlet om access control), DLP, intrusion management, security assessments och SIEM (i SecaaS-tabellen; SIEM kan höra hemma i ett senare kapitel om auditing), OpenStack och MiniSec.

Frågor: 8 st, rätt position 2/2/2/2 (index 2, 0, 3, 1, 0, 2, 1, 3). Varianten är sak-bok13-v24.`;
