// Bokens kapitel 19: Stallings & Brown, Legal and Ethical Aspects (s. 994–1042).
// Kapitel, ämne, ordlista och frågor; samlas av reading.js, topics.js och
// questions.js via bok/index.js. Skrivet med egna ord på tentans nivå,
// granskat mot boken 22 nov 2026 (ogranskat av Kasper). `notes` är
// källanteckningarna och visas inte.

const variant = (id, what) => ({ variantOf: id, source: `Variant av en tentafråga från förra året (${what})` });

export const chapter = {
  id: "bok19",
  kind: "bok",
  label: "Bokens kapitel 19",
  examArea: "Bokfrågor",
  title: "Juridik och etik: datorbrott, immateriella rättigheter och privacy",
  readingMinutes: 11,
  lead: "Lagen och etiken som komplement till tekniken: hur datorbrott delas in och varför de är svåra att lagföra, vad copyright, patent och trademark skyddar, vad GDPR kräver och varför IT-yrket har etiska koder.",
  sources: ["Stallings & Brown kap. 19 (s. 994–1042)"],
  body: `
## Kärnan

- **Datorbrott** delas in efter datorns roll: **måltavla**, **lagringsmedium** eller **kommunikationsverktyg**.
- **Brottsbekämpningen har svårt** med cyberbrott, och offren anmäler sällan. Det blir en ond cirkel.
- **Intellectual property** har tre huvudtyper: **copyright** skyddar uttrycket, **patent** uppfinningen och **trademark** kännetecknet.
- **Privacy** regleras i lag, tydligast i EU:s **GDPR**, och organisationen måste svara med både ledning och teknik.
- **Etik:** datorer ger nya sätt att göra skada, så IT-yrkets organisationer har **codes of conduct**.

## Computer crime och cybercrime

Tekniska, fysiska och mänskliga skydd räcker aldrig helt. Lagen är ett verktyg till: många attacker är brott, och risken att straffas kan avskräcka.

**Computer crime** och **cybercrime** är brott där datorer eller nät är verktyget, målet eller platsen. Cybercrime syftar särskilt på nätverk, medan ett computer crime kan ske helt utan nät. Vad brotten kostar tar Föreläsning 1 och 2 upp. Boken tillför en indelning efter datorns roll, från det amerikanska justitiedepartementet:

| Datorns roll | Vad det innebär | Exempel |
|---|---|---|
| **Computers as targets** (måltavla) | brottet riktas mot själva systemet: för att komma åt information, använda systemet utan lov (**theft of service**), ändra data eller störa tillgängligheten | intrång för att läsa eller ändra data på en server |
| **Computers as storage devices** (lagringsmedium) | datorn förvarar passivt något som hör till brottet | stulna lösenordslistor och kortnummer, piratkopierad mjukvara |
| **Computers as communications tools** (kommunikationsverktyg) | traditionella brott som begås via nätet | olaglig försäljning av droger och vapen, bedrägerier, spel om pengar |

När datorn är måltavla angrips säkerhetsmålen från kapitlet om grundbegreppen. Kategorierna utesluter inte varandra; ett brott kan höra till flera. Den internationella **Convention on Cybercrime** listar brott som länderna är överens om, till exempel intrång (illegal access) och avlyssning (illegal interception).

## Varför brottsbekämpningen har svårt

Lagen avskräcker bara om brottslingarna faktiskt grips och döms, och med cyberbrott lyckas det sällan. Boken beskriver en ond cirkel (**vicious cycle of cybercrime**) mellan tre parter:

| Part | Problemet |
|---|---|
| **Brottsbekämpningen** (law enforcement) | saknar ofta tekniskt kunniga utredare och resurser som datorkraft och lagring. Gärningsmannen sitter ofta i ett annat land, och samarbetet över gränserna brister. |
| **De kriminella** | blir fler och djärvare när få grips. De är svåra att profilera, och det finns inga register över cyberbrottslingar. |
| **Offren** | har ofta satsat för lite på skydd och anmäler sällan: de litar inte på polisen och oroar sig för ryktet och för skadeståndsansvar (civil liability). |

När offren inte anmäler blir polisens arbete ännu svårare, och cirkeln sluts. Konventionen hjälper, eftersom den ger länderna gemensamma begrepp. Bokens råd: ledningen ska se brottsbekämpningen som en resurs bredvid de tekniska, fysiska och mänskliga skydden.

## Immateriella rättigheter

Juridiken skiljer på **real property** (mark och byggnader), **personal property** (lös egendom, som bilar och bankkonton) och **intellectual property**: immateriella tillgångar av mänsklig kunskap och idéer, som mjukvara, data, romaner och uppfinningar.

Intellectual property har tre huvudtyper. Skyddet gäller **infringement**, intrång i ägarens rättigheter, och ägaren får gå till domstol mot den som gör intrång.

| | **Copyright** | **Patent** | **Trademark** |
|---|---|---|---|
| Skyddar | det fasta uttrycket för en idé, inte idén själv | en uppfinning | ett ord, namn, symbol eller liknande som visar var en vara kommer ifrån |
| Krav | verket är originellt och har fått konkret form, som text, mjukvara eller multimedia | uppfinningen är ny och användbar | märket används i handel med varorna |
| Ger rätt att | kopiera, bearbeta, sprida, framföra och visa verket offentligt | hindra andra från att tillverka, använda, sälja eller importera uppfinningen | hindra andra från att använda ett förväxlingsbart märke |

- **Patent** finns som **utility patents** (processer, maskiner, produkter), **design patents** (dekorativ form) och **plant patents** (växtsorter). Bokens exempel är RSA (se kapitlet om kryptografiska verktyg), vars patent gällde 1983–2000.
- **Trademark:** en **servicemark** är samma sak för en tjänst. Ett varumärke hindrar inte andra från att tillverka samma vara och sälja den under ett tydligt annat märke.

Minnesregel: copyright skyddar uttrycket, patent uppfinningen, trademark avsändaren.

## Upphovsrätt och IT

Mjukvara kan alltid skyddas av copyright, ibland också av patent. Databaser med kommersiellt värde och digitalt innehåll kan också skyddas, och algoritmer kan patenteras. Tekniken skyddar en del, till exempel rådata i databaser (se kapitlet om databas- och datacentersäkerhet). Men om en användare som har tillgång till ett program kopierar det och använder det utan licens, är lagen rätt verktyg, inte tekniska åtgärder.

**Digital Millennium Copyright Act (DMCA)** är en amerikansk lag från 1998 som stärker upphovsrätten för digitalt material.

- Den uppmuntrar tekniska skydd som hindrar **åtkomst** till eller **kopiering** av ett verk, och förbjuder att kringgå dem eller sälja verktyg som knäcker dem.
- **Undantag:** fair use (citat, recension, diskussion), reverse engineering för att program ska fungera ihop, krypteringsforskning i god tro, säkerhetstestning med ägarens tillstånd och skydd av personuppgifter.
- **Kritik:** forskare menar att lagen hämmar säkerhets- och krypteringsforskning.

## Digital rights management (DRM)

**Digital rights management (DRM)** är system och rutiner som ser till att den som har rättigheterna till ett digitalt verk identifieras och får betalt. DRM kan också begränsa användningen, till exempel hindra utskrift eller vidarespridning. Det finns ingen gemensam standard. Bokens modell har fyra parter:

| Part | Roll |
|---|---|
| **Content provider** | äger rättigheterna, till exempel ett skivbolag eller en filmstudio |
| **Distributor** | säljkanalen, till exempel en nätbutik |
| **Consumer** | betalar för en digital licens; spelaren begär licensen och ser till att reglerna följs |
| **Clearinghouse** | sköter betalningen när licensen utfärdas, betalar royalty till content provider och avgift till distributören, och loggar varje licens |

Distributören behöver inte själv vakta rättigheterna. Content provider skyddar innehållet, oftast med kryptering, så att konsumenten måste köpa en licens från clearinghouse. I bokens arkitektur heter parterna **rights holders**, **service providers** (distributörer och clearinghouses) och **consumers**.

## Privacy: lagar och organisationens ansvar

Vad privacy betyder, och varför vår känsla för privatliv inte fungerar online, tar Föreläsning 2 upp. Kapitlet om grundbegreppen räknar privacy till confidentiality, och det var svaret på en av förra årets tentafrågor. Här tillför boken lagarna.

**General Data Protection Regulation (GDPR)** antogs av EU 2016 och gäller sedan 2018, med samma regler i hela EU och EES.

- En personuppgift är all information som rör en identifierad eller identifierbar person, även IP-adresser, platsdata och användarnamn.
- GDPR gäller också organisationer utanför EU som erbjuder varor eller tjänster där. Därför har den i praktiken blivit en global standard.

Artikel 5 ger sju principer:

| Princip | Innebär |
|---|---|
| **Fair, lawful and transparent processing** | de registrerade får veta vad uppgifterna ska användas till |
| **Purpose limitation** | uppgifter från ett syfte används inte för ett nytt, oförenligt syfte |
| **Data minimization** | bara de uppgifter som faktiskt behövs behandlas |
| **Accuracy** | uppgifterna är korrekta och aktuella |
| **Storage limitation** | uppgifterna sparas inte i identifierbar form längre än nödvändigt |
| **Integrity and confidentiality** | tekniska och organisatoriska åtgärder skyddar mot förlust, ändring och obehörig åtkomst |
| **Accountability** | den ansvarige (controller) ska kunna visa att principerna följs |

GDPR kräver också samtycke och ger rätt att få se, rätta och radera sina uppgifter (**right to be forgotten**). Intrång i personuppgifter ska snabbt anmälas till myndigheten, och brott mot reglerna ger stora sanktioner.

Blanda inte ihop GDPR med NIS2 från Föreläsning 2. GDPR gäller personuppgifter; NIS2 beskrivs i föreläsningen som EU-gemensam lagstiftning om cybersäkerhet.

**Organisationens svar** kräver både management controls (se kapitlet om säkerhetskontroller) och teknik. Bredvid säkerhetspolicyn ska det finnas en privacy policy, bredvid security awareness ett privacy awareness-program, och en **Chief Privacy Officer** eller motsvarande ska ha ansvaret.

**Privacy i systemet.** Standarden Common Criteria har fyra privacy-funktioner:

| Funktion | Innebär |
|---|---|
| **Anonymity** | användaren använder en tjänst utan att röja sin identitet |
| **Pseudonymity** | användaren har ett alias som systemet kan koppla till personen, så hen kan hållas ansvarig |
| **Unlinkability** | ingen kan koppla ihop flera användningar med varandra |
| **Unobservability** | andra, särskilt tredje part, kan inte se att tjänsten används alls |

Common Criteria gäller alltså integriteten när individen använder datorresurser, inte skyddet av personuppgifter om hen.

**Big data och sociala medier** ställer nyttan av stora analyser mot individens rätt till privacy. Ett tekniskt svar är att **anonymisera** data, men anonymiserade data har ibland kunnat identifieras igen.

## Etik och codes of conduct

**Ethics** är ett system av moraliska principer om vilka handlingar som gynnar och skadar, och om vad som är rätt och fel i motiv och mål. De allmänna principerna gäller också i IT, men datorer tillför två saker:

1. **Ny skala:** mycket mer registrering av uppgifter om individer, och internet ger en enskild person större makt att skada.
2. **Nya slags företeelser** som saknar överenskomna etiska regler, som databaser, webbläsare och cookies.

Den som har särskild kunskap har dessutom fler skyldigheter än andra. Typiska dilemman är **whistle-blowing**, när yrkesplikten krockar med lojaliteten mot arbetsgivaren (en produkt släpps otillräckligt testad), och **intressekonflikter**, som en konsult med ekonomiska intressen i en leverantör.

Boken räknar också upp datorns roller i etiken, till exempel som instrument för handlingar (**instrument of acts**). Blanda inte ihop dem med datorns tre roller i brott.

Etik kan inte göras till exakta lagar. Därför har yrkesorganisationer antagit **codes of conduct**. En kod kan inspirera, utbilda, stödja den som hamnar i konflikt med arbetsgivaren, avskräcka och vara grund för disciplin, och stärka yrkets anseende.

| Kod | Gäller |
|---|---|
| **ACM** Code of Ethics and Professional Conduct | datavetare |
| **IEEE** Code of Ethics | datoringenjörer och andra el- och elektronikingenjörer |
| **AITP** Standard of Conduct | chefer för datorsystem och IT-projekt |

Koderna har gemensamma teman, som människors värdighet, hederlighet och ansvar för sitt arbete. Boken påpekar att de är allmänna och säger lite om just datorer.

**The Rules** är ett annat grepp: några få, allmänna regler för alla som tar fram eller använder ett **computing artifact**, alltså allt som innehåller ett körande program. De som tar fram det är moraliskt ansvariga för dess förutsebara effekter, och ansvaret minskar inte för att fler är inblandade.
`,
};

export const topic = {
  id: "bok19-juridik",
  name: "Juridik och etik: datorbrott, immateriella rättigheter och privacy",
  chapter: "bok19",
  examWeight: "hög",
  summary: "Lagen kompletterar tekniken. Datorbrott delas in efter datorns roll: måltavla, lagringsmedium eller kommunikationsverktyg, och de är svåra att lagföra. Intellectual property skyddas som copyright (uttrycket), patent (uppfinningen) och trademark (kännetecknet). GDPR ger sju principer för personuppgifter, och IT-yrkets organisationer har etiska codes of conduct.",
  keyPoints: [
    "Computer crime: brott där datorn är måltavla, lagringsmedium eller kommunikationsverktyg; cybercrime syftar särskilt på nät.",
    "Den onda cirkeln: brottsbekämpningen saknar kunskap, resurser och samarbete över gränser, och offren anmäler sällan.",
    "Copyright: skyddar det fasta uttrycket för en idé, inte idén; kräver originalitet och konkret form.",
    "Patent: rätt att hindra andra från att tillverka, använda, sälja eller importera en uppfinning.",
    "Trademark: skyddar ett kännetecken mot förväxlingsbara märken, men inte mot att andra gör samma vara.",
    "DMCA: amerikansk lag som förbjuder att kringgå tekniska skydd för upphovsrättsskyddat material, med undantag som fair use.",
    "DRM: content provider, distributor, consumer och clearinghouse, där clearinghouse utfärdar licensen och fördelar pengarna.",
    "GDPR: EU:s regler om personuppgifter, med sju principer i artikel 5, bland annat purpose limitation och data minimization.",
    "Codes of conduct: ACM, IEEE och AITP ger IT-yrket etiska regler, eftersom datorer skapar ny skala och nya företeelser.",
  ],
  pitfalls: [
    "Datorn är måltavla när själva systemet angrips; att förvara stulna uppgifter är lagringsmedium, och bedrägeri via nätet är kommunikationsverktyg.",
    "Copyright skyddar uttrycket, inte idén; uppfinningar skyddas av patent.",
    "Ett trademark hindrar förväxlingsbara märken, men inte att andra tillverkar och säljer samma vara under ett annat märke.",
    "I DRM är det clearinghouse som utfärdar licensen och betalar royalty, inte distributören.",
    "GDPR gäller personuppgifter; NIS2 i Föreläsning 2 är EU-lagstiftning om cybersäkerhet.",
  ],
};

export const glossary = [
  { term: "Computer crime", definition: "Brottslig verksamhet där datorer eller datornät är verktyget, målet eller platsen för brottet. Kan ske helt utan nätverk.", chapter: "bok19" },
  { term: "Cybercrime", definition: "Samma sak som computer crime, men termen syftar särskilt på brott som använder nätverk.", chapter: "bok19" },
  { term: "Intellectual property", definition: "Immateriella tillgångar av mänsklig kunskap och idéer, till exempel mjukvara, data, romaner och uppfinningar. Huvudtyperna är copyright, patent och trademark.", chapter: "bok19" },
  { term: "Infringement", definition: "Intrång i de rättigheter som copyright, patent eller trademark ger. Ägaren kan gå till domstol mot den som gör intrång.", chapter: "bok19" },
  { term: "Copyright", definition: "Upphovsrätt: skyddar det fasta uttrycket för en idé, inte idén själv. Verket ska vara originellt och ha fått konkret form, och ägaren får ensamrätt att bland annat kopiera, bearbeta och sprida det.", chapter: "bok19" },
  { term: "Patent", definition: "En uppfinnares rätt att hindra andra från att tillverka, använda, sälja eller importera uppfinningen. Finns som utility, design och plant patents.", chapter: "bok19" },
  { term: "Trademark", definition: "Varumärke: ett ord, namn, symbol eller liknande som visar var en vara kommer ifrån. Skyddar mot förväxlingsbara märken; en servicemark gör samma sak för tjänster.", chapter: "bok19" },
  { term: "Digital Millennium Copyright Act (DMCA)", definition: "Amerikansk lag från 1998 som stärker upphovsrätten för digitalt material. Förbjuder att kringgå tekniska skydd, med undantag som fair use, reverse engineering och säkerhetstestning.", chapter: "bok19" },
  { term: "Digital rights management (DRM)", definition: "System och rutiner som ser till att den som har rättigheterna till digitalt innehåll identifieras och får betalt, och som kan begränsa hur innehållet används.", chapter: "bok19" },
  { term: "Rights holder", definition: "I DRM: den som har skapat innehållet eller förvärvat rättigheterna till det, alltså content provider.", chapter: "bok19" },
  { term: "General Data Protection Regulation (GDPR)", definition: "EU:s dataskyddsförordning, antagen 2016 och tillämpad sedan 2018. Ger samma regler för personuppgifter i hela EU och EES och gäller även organisationer utanför EU som erbjuder varor eller tjänster där.", chapter: "bok19" },
  { term: "Ethics", definition: "Ett system av moraliska principer om vilka handlingar som gynnar och skadar, och om vad som är rätt och fel i motiv och mål.", chapter: "bok19" },
  { term: "Code of conduct", definition: "En yrkesorganisations etiska regler, till exempel ACM:s, IEEE:s och AITP:s. Kan inspirera, utbilda, stödja, avskräcka och stärka yrkets anseende.", chapter: "bok19" },
];

export const questions = [
  { id: "sak-bok19-01", topic: "bok19-juridik", difficulty: 1,
    question: "A criminal keeps lists of stolen passwords and credit card numbers on a laptop. In the book's classification, what role does the computer play?",
    options: [
      { text: "As the target of the crime", explain: "Då riktas brottet mot själva systemet, till exempel ett intrång för att läsa eller ändra data. Här förvarar datorn bara uppgifterna." },
      { text: "As a passive storage device", explain: "Datorn används passivt för att förvara något som hör till brottet, som stulna lösenordslistor och kortnummer." },
      { text: "As a communications tool", explain: "Den kategorin gäller traditionella brott som begås via nätet, som bedrägerier och olaglig försäljning." },
      { text: "As an instrument of acts", explain: "Det är en av datorns roller i bokens avsnitt om etik, inte en kategori av datorbrott." },
    ],
    correct: 1, source: "Bokens kapitel 19 (datorns roll i brottet)", reviewed: false },

  { id: "sak-bok19-02", topic: "bok19-juridik", difficulty: 2,
    question: "Which of these crimes treats the computer as the target, in the book's classification?",
    options: [
      { text: "Selling illegal drugs through a website", explain: "Ett traditionellt brott som begås via nätet, alltså datorn som kommunikationsverktyg." },
      { text: "Keeping pirated software on a hard disk", explain: "Datorn förvarar bara det olagliga materialet, alltså datorn som lagringsmedium." },
      { text: "Committing fraud through online messages", explain: "Bedrägeri via nätet är ett traditionellt brott på nätet, alltså datorn som kommunikationsverktyg." },
      { text: "Breaking into a server to alter its data", explain: "Brottet riktas mot själva systemet och angriper dess integrity. Det är datorn som måltavla." },
    ],
    correct: 3, source: "Bokens kapitel 19 (datorns roll i brottet)", reviewed: false },

  { id: "sak-bok19-03", topic: "bok19-juridik", difficulty: 2,
    question: "According to the book, why do many victims of cybercrime avoid reporting it?",
    options: [
      { text: "They worry about reputation and civil liability", explain: "Offren oroar sig för ryktet och för skadeståndsansvar, och de har dåligt förtroende för polisen. Det sluter den onda cirkeln." },
      { text: "The law treats most attacks as civil matters only", explain: "Boken säger tvärtom att många attacker är brott som kan ge straff." },
      { text: "GDPR forbids them to share details of a breach", explain: "Tvärtom kräver GDPR att intrång i personuppgifter snabbt anmäls till myndigheten." },
      { text: "Police can find the offenders in crime databases", explain: "Det finns inga register över cyberbrottslingar att söka i, och det är en del av problemet." },
    ],
    correct: 0, source: "Bokens kapitel 19 (den onda cirkeln)", reviewed: false },

  { id: "sak-bok19-04", topic: "bok19-juridik", difficulty: 1,
    question: "What does copyright law protect, according to the book?",
    options: [
      { text: "A new and useful process, machine or product", explain: "Det skyddas av ett patent, närmare bestämt ett utility patent." },
      { text: "A mark that shows which company made the goods", explain: "Ett kännetecken som visar var en vara kommer ifrån skyddas som trademark." },
      { text: "The fixed expression of an idea, not the idea", explain: "Copyright skyddar en idé först när den fått konkret form, och då bara uttrycket." },
      { text: "An original idea, even before it is written down", explain: "Idén själv skyddas inte av copyright; verket måste ha fått konkret form, som text eller mjukvara." },
    ],
    correct: 2, source: "Bokens kapitel 19 (copyright)", reviewed: false },

  { id: "sak-bok19-05", topic: "bok19-juridik", difficulty: 3,
    question: "Which statement about trademark rights is correct, according to the book?",
    options: [
      { text: "They stop others from making the same goods", explain: "Boken säger uttryckligen att ett trademark inte hindrar andra från att tillverka samma vara." },
      { text: "They stop others using a confusingly similar mark", explain: "Ett trademark skyddar kännetecknet, så att ingen annan kan använda ett märke som lätt förväxlas med det." },
      { text: "They protect the source code of a program", explain: "Mjukvara skyddas av copyright, ibland också av patent, men inte av trademark." },
      { text: "They stop others from importing the same invention", explain: "Att hindra andra från att tillverka, sälja eller importera en uppfinning är patentets rätt." },
    ],
    correct: 1, source: "Bokens kapitel 19 (copyright, patent och trademark)", reviewed: false },

  { id: "sak-bok19-06", topic: "bok19-juridik", difficulty: 2,
    question: "In the book's DRM model, which party issues the digital license to the consumer and pays royalties to the content provider?",
    options: [
      { text: "The content provider", explain: "Content provider äger rättigheterna och skyddar innehållet, oftast med kryptering. Den får royalty men utfärdar inte licensen." },
      { text: "The online distributor", explain: "Distributören är säljkanalen och behöver inte själv vakta rättigheterna. Den får en avgift från clearinghouse." },
      { text: "The clearinghouse", explain: "Clearinghouse sköter betalningen för licensen, betalar royalty och distributionsavgift och loggar varje licens." },
      { text: "The consumer's player", explain: "Spelaren begär licensen och ser till att användningsreglerna följs, men utfärdar den inte." },
    ],
    correct: 2, source: "Bokens kapitel 19 (DRM)", reviewed: false },

  { id: "sak-bok19-07", topic: "bok19-juridik", difficulty: 1,
    question: "Which GDPR principle says an organization should process only the personal data it actually needs?",
    options: [
      { text: "Data minimization", explain: "Organisationen ska bara behandla de personuppgifter den behöver för sitt syfte." },
      { text: "Purpose limitation", explain: "Purpose limitation säger att uppgifter från ett syfte inte får användas för ett nytt, oförenligt syfte." },
      { text: "Storage limitation", explain: "Storage limitation gäller hur länge uppgifterna får sparas i identifierbar form, inte hur många som samlas in." },
      { text: "Accountability", explain: "Accountability betyder att den ansvarige ska kunna visa att principerna följs." },
    ],
    correct: 0, source: "Bokens kapitel 19 (GDPR:s principer)", reviewed: false },

  { id: "sak-bok19-08", topic: "bok19-juridik", difficulty: 2,
    question: "According to the book, what makes ethics for IT professionals partly different from general ethics?",
    options: [
      { text: "Ethics in IT can be reduced to precise laws", explain: "Boken säger tvärtom att etik inte kan göras till exakta lagar, och därför behövs codes of conduct." },
      { text: "IT experts have fewer duties than other people", explain: "Tvärtom: den som har särskild kunskap har fler etiska skyldigheter, inte färre." },
      { text: "Codes of conduct cover the technology in detail", explain: "Boken påpekar att koderna är allmänna och säger lite om just datorer." },
      { text: "Computers create new scale and new entities", explain: "Datorer gör det möjligt att registrera och skada i större skala, och skapar företeelser som databaser och cookies som saknar etiska regler." },
    ],
    correct: 3, source: "Bokens kapitel 19 (etik i IT-yrket)", reviewed: false },
];

export const notes = `Byggt på kap. 19 i del2-filen (s. 994–1000) och del3-filen (s. 1000–1042): inledningen, 19.1 (definitionen av computer crime/cybercrime, justitiedepartementets tre roller, Convention on Cybercrime, law enforcement challenges och den onda cirkeln, working with law enforcement), 19.2 (tre slags egendom, copyright/patent/trademark, IP i IT, DMCA med undantag och kritik, DRM:s fyra användare och tre roller i arkitekturen), 19.3 (GDPR med artikel 5 och några av de övriga rättigheterna, organizational response, Common Criteria privacy class, big data och anonymisering), 19.4 (definitionen av ethics, skala och nya entiteter, whistle-blowing och intressekonflikt, en av Parkers roller, kodernas fem funktioner, ACM/IEEE/AITP, gemensamma teman och kritik, The Rules). Key Terms och Review Questions 19.1–19.13 styrde urvalet.

Osäkert:
- Figur 19.1 (Intellectual Property Infringement), 19.2–19.5 och kodtexterna i figur 19.6–19.8 är bilder utan text i textfilen. Kapitlet säger därför inget om vad ACM-, IEEE- och AITP-koderna innehåller utöver bokens löptext (vem de gäller och de gemensamma temana).
- Boken säger att GDPR ersatte ett "1998 Directive on Data Protection". Kapitlet nämner inte direktivet eller året.
- Boken anger Cambridge Analytica-fallet med "around 2.7 million Facebook users". Fallet och siffran är utelämnade.
- Boken säger bara "the international Convention on Cybercrime" och anger inte vem som står bakom. Kapitlet säger inte heller det.
- NIS2 nämns inte i boken. Kapitlet hänvisar bara till hur Föreläsning 2 beskriver NIS2, för att skilja den från GDPR.
- "Ny och användbar" för utility patents och "dekorativ form" för design patents (boken: "new and useful", "ornamental design") är mina översättningar.
- "Personal property" omfattar enligt boken även patent; det är utelämnat för att inte blanda ihop egendomstyperna med IP-typerna.

Medvetet utelämnat (för att hålla kapitlet under cirka 1 600 ord): hela listan i Convention on Cybercrime (bara två exempel), CERT 2007 E-crime Survey-tabellen, att samarbetet med polisen kräver "people skills", copyrightkategorierna och de fem rättigheternas namn (reproduction, modification, distribution, public performance, public display; tabellen har dem på svenska), RSA-patentets avgift per implementation, DMCA:s förbud mot nästan all obehörig dekryptering och kritiken om innovation/open source, DRM:s fyra mål och arkitekturens moduler, Optus-intrånget, artikelnumren utom artikel 5, känsliga uppgifter (artikel 9) och att brottsbekämpning/nationell säkerhet är undantagna, Privacy Act 1974 och de amerikanska sektorslagarna (bank, kredit, vård/HIPAA – i boken felstavad "HIPPA", barn under 13, ECPA), strategic privacy plan, NIST SP 800-53 och ISO 27001/27002, Snowden, sociala mediers privacy-inställningar, FTC-ramverket, de fem riktlinjeområdena för forskning med digitala data (Review Question 19.11: consent; privacy and confidentiality; ownership and authorship; data sharing; governance and custodianship) – kan läggas tillbaka om det finns plats, kostnad–nytta-analysen [POLO13], lagändringarna om massövervakning [LYON15, RYAN16], den etiska hierarkins tre nivåer, ombudspersonen, Parkers övriga tre roller, kodernas sju teman i sin helhet, The Rules fem regler i sin helhet, OECD-tabellen (står bara i Problems).

Längd: 1 574 ord löptext (1 695 med tabelltecken, samma räknesätt som gav 1 680–1 780 för bok1–bok9). readingMinutes 11.

Hänvisningar: Föreläsning 1 och 2 (cyberbrottens kostnad), Föreläsning 2 (privacy, säkerhetspolicy, NIS2), kapitlen om grundbegreppen (säkerhetsmålen, privacy under confidentiality), kryptografiska verktyg (RSA), databas- och datacentersäkerhet (skydd av rådata) och säkerhetskontroller (management controls).

Ordlistan: 13 termer ur Key Terms, kontrollerade mot sajtens ordlista 22 nov 2026 (inga krockar). "Privacy" finns redan. "Consumer" och "service provider" är för allmänna och står bara i löptexten; "rights holder" togs med som DRM-termen.

Frågor: 8 st, ingen variant (förra årets tenta hade ingen fråga om kapitlets ämnen; frågan om privacy och confidentiality hör till kapitlet om grundbegreppen). Två om datorns roll i brott (scenario till roll, och roll till scenario), en om den onda cirkeln, två om skillnaden mellan copyright, patent och trademark, en om DRM, en om GDPR, en om etik. Rätt position 2/2/2/2.`;
