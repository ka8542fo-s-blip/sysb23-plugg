// Bokens kapitel 16: Stallings & Brown, Physical and Infrastructure Security (s. 867–902).
// Kapitel, ämne, ordlista och frågor; samlas av reading.js, topics.js och
// questions.js via bok/index.js. Skrivet med egna ord på tentans nivå,
// granskat mot boken 22 nov 2026 (ogranskat av Kasper). `notes` är
// källanteckningarna och visas inte.

const variant = (id, what) => ({ variantOf: id, source: `Variant av en tentafråga från förra året (${what})` });

export const chapter = {
  id: "bok16",
  kind: "bok",
  label: "Bokens kapitel 16",
  examArea: "Bokfrågor",
  focus: ["Physical security control types"],
  title: "Fysisk säkerhet och infrastruktur",
  readingMinutes: 11,
  lead: "Informationssystemen vilar på något fysiskt: hårdvara, lokaler, el och kyla, och människor. Vad som hotar den grunden, hur man skyddar och återställer den, och hur fysisk och logisk access control kan förenas.",
  sources: ["Stallings & Brown kap. 16 (s. 867–902)"],
  body: `
## Kärnan

- **Physical security**, som också kallas **infrastructure security**, skyddar de fysiska tillgångar som informationssystemet vilar på: hårdvaran, lokalerna, stödsystemen som el och klimat, och personalen.
- Boken skiljer den från **logical security**, som skyddar data mot hot via mjukvara och kommunikation, och från **premises security**, som skyddar människor och egendom i hela anläggningen.
- Hoten delas in i tre kategorier: **environmental threats**, **technical threats** och **human-caused threats**. Naturkatastrofer är en viktig källa till de miljömässiga hoten.
- Mot varje hot finns åtgärder som förebygger eller begränsar skadan, och återställningen bygger på **redundans**.
- Fysisk och logisk access control kan integreras, till exempel med ett ID-kort enligt standarden för **personal identity verification (PIV)**.

## Tre delar av informationssystemets säkerhet

| Del | Kallas också | Skyddar |
|---|---|---|
| **Logical security** | – | datorbaserade data mot hot som kommer via mjukvara och kommunikation; det mesta av boken handlar om det |
| **Physical security** | **infrastructure security** | informationssystemen som rymmer data, och människorna som använder, driver och underhåller dem |
| **Premises security** | **corporate security**, **facilities security** | människor och egendom i ett helt område, en anläggning eller byggnad; krävs ofta av lagar och regler |

- Physical security ska också hindra all fysisk åtkomst som kan undergräva den logiska säkerheten.
- Premises security står bland annat för perimeterskydd, brandlarm, kameraövervakning och vakter.
- **Kryptering hör till logical security**, inte till physical security. Att kryptering inte är en fysisk kontroll var svaret på en av förra årets tentafrågor. Ett biometriskt passersystem räknas däremot som fysiskt, eftersom det styr vem som kommer in i lokalen.

Data center-modellen i Föreläsning 2 har physical och site security som två av sina fyra lager, med kontroller som biometriska läsare, serverburar och stängsel. Det här kapitlet säger vad de lagren ska skydda mot. Datacentrets nivåer enligt TIA-942 står i kapitlet om databas- och datacentersäkerhet. Hur mycket physical security ska få kosta avgörs med en riskbedömning, som i Föreläsning 2.

## Vad physical security ska skydda

Boken ställer två krav. Det första är att **förhindra skada** på den fysiska infrastrukturen, som har fyra delar:

| Del | Innehåll |
|---|---|
| **Information system hardware** | utrustning för databehandling och lagring, nät- och överföringsutrustning, lagringsmedier offline och tillhörande dokumentation |
| **Physical facility** | byggnaderna och andra konstruktioner som rymmer system och nät |
| **Supporting facilities** | det som håller systemet igång: el, kommunikationstjänster och miljökontroll (värme, fukt) |
| **Personnel** | människorna som styr, underhåller och använder systemen |

Det andra kravet är att **förhindra missbruk** av infrastrukturen som leder till att informationen missbrukas eller skadas. Missbruket kan vara oavsiktligt eller avsiktligt: vandalism, stöld av utrustning, stöld genom kopiering, stöld av tjänster och obehörigt tillträde.

## Hoten i tre kategorier

| Kategori | Omfattar | Exempel |
|---|---|---|
| **Environmental threats** | förhållanden i miljön som kan skada systemen och deras data eller avbryta driften | fel temperatur och fukt, brand och rök, vatten, kemiska, radiologiska och biologiska ämnen, damm, skadedjur och mögel |
| **Technical threats** | elkraft och elektromagnetisk strålning | undervoltage, overvoltage, noise, elektromagnetisk störning |
| **Human-caused threats** | hot som människor orsakar | obehörigt fysiskt tillträde, stöld, vandalism, missbruk |

**Natural disasters** är en viktig, men inte den enda, källa till environmental threats: tornado, orkan, jordbävning, is- eller snöstorm, blixtnedslag och översvämning. De skiljer sig i förvarning, evakuering och varaktighet. En jordbävning kommer utan förvarning och kan göra störst skada.

### Environmental threats

| Hot | Varför det är farligt |
|---|---|
| För varmt | utrustningen kan inte kyla sig och komponenter skadas, till exempel när ventilationen (HVAC) slutar fungera |
| För kallt | utrustningen kan få **thermal shock** när den startas, så att kretskort spricker |
| Hög fukt | korrosion, och kondens som kan ge kortslutning |
| Låg fukt | statisk elektricitet; en urladdning från en människa kan skada elektroniken |
| Brand och rök | kanske det mest skrämmande hotet. Utöver lågorna skadar värmen, giftiga gaser, röken och vattnet från släckningen, och elen kan slås ut. |
| Vatten | kortslutning, från läckande rör, nederbörd och till och med sprinklersystemet; översvämning är ovanligare men värre |
| Kemiska, radiologiska och biologiska ämnen | främst en risk för personalen |
| Damm | ett ofta förbisett hot mot rörliga delar som fläktar och diskar |
| Infestation | mögel, insekter och gnagare |

Den relativa luftfuktigheten bör ligga mellan 40 och 60 procent.

### Technical threats

Elproblemen delas in i tre slag:

| Problem | Vad det är | Följd |
|---|---|---|
| **Undervoltage** | lägre spänning än utrustningen behöver: allt från korta dippar till **brownouts** (långvarig underspänning) och strömavbrott | sällan skada, men driften avbryts |
| **Overvoltage** | en spänningstopp (surge), till exempel från elbolaget, ett ledningsfel i byggnaden eller ett blixtnedslag | betydligt allvarligare: kan förstöra processorer och minnen |
| **Noise** | störsignaler som följer med elledningen | kan ta sig förbi nätaggregatets filter och ge logiska fel |

**Electromagnetic interference (EMI)** är bredare än brus i elnätet: motorer, fläktar, andra datorer, radiostationer och till och med mobiltelefoner kan störa känslig utrustning, genom luften eller via ledningar.

### Human-caused threats

Människor är svårare att skydda sig mot än miljön och tekniken. Hoten är mindre förutsägbara, och de är gjorda för att ta sig förbi skyddet och hitta den svagaste punkten.

| Hot | Innebär |
|---|---|
| **Unauthorized physical access** | obehöriga kommer in där de inte får vara, vilket kan leda vidare till stöld, vandalism eller missbruk |
| **Theft** | stöld av utrustning och av data genom kopiering; även avlyssning (eavesdropping och wiretapping) räknas hit. Tjuven kan vara utomstående eller insider. |
| **Vandalism** | förstörelse av utrustning och data |
| **Misuse** | behöriga använder resurserna på fel sätt, eller obehöriga använder dem över huvud taget |

## Förebyggande och begränsande åtgärder

En allmän åtgärd är molntjänster: ju mindre utrustning och data på plats, desto mindre utsätts för fysiska hot där.

| Hot | Åtgärder |
|---|---|
| Temperatur och fukt | klimatutrustning med tillräcklig kapacitet, sensorer som varnar när gränser passeras, och säker elförsörjning |
| Brand | en väl vald plats, inga brandfarliga saker i datorrummet, brandsläckare och automatisk släckning, branddetektorer, en märkt huvudströmbrytare, kopior av data och program på annan plats |
| Rök | rökdetektorer i varje datorrum, under upphöjda golv och ovanför undertak |
| Vatten | vattensensorer på golvet och under upphöjda golv som slår av strömmen automatiskt, och kända avstängningsventiler |
| Damm och skadedjur | filterunderhåll, städning och skadedjursbekämpning |
| Korta strömavbrott | en **uninterruptible power supply (UPS)** för varje kritisk enhet: ett batteri som håller strömmen i några minuter och också kan skydda mot överspänning och filtrera brus |
| Längre avbrott och brownouts | reservkraft, till exempel en generator |
| EMI | filter och skärmning |
| Människor | physical access control |

**Physical access control** kan byggas i steg som går att kombinera:

1. Begränsa tillträdet till byggnaden. Det stoppar utomstående, men inte obehöriga anställda.
2. Lås in resursen i ett skåp, ett kassaskåp eller ett rum.
3. Bulta fast maskinen i något tungt. Det avskräcker från stöld, men inte från vandalism eller missbruk.
4. Skydda strömbrytaren med en säkerhetsanordning.
5. Ge utrustningen en spårningsenhet, så att ett larm går om den förs ut eller så att den kan följas.

Skyddet ska också gälla kablage, el, ventilation, backupmedia och dokument, och kompletteras med sensorer, larm och kameraövervakning. Wi-Fi gör att åtkomsten når genom väggar: den som sitter på parkeringen utanför kan komma åt nätet.

## Återställning efter fysiska incidenter

- **Redundans** är det viktigaste. Den ångrar inte ett brott mot confidentiality, som stulna data eller dokument, men den gör att förlorade data kan återställas.
- Viktiga data bör finnas **off site**, uppdaterade så nära realtid som kostnaden motiverar, till exempel med krypterade backuper över ett privat nät eller internet.
- I de mest kritiska fallen kan man ha en **hot site**: en anläggning på annan plats som kan ta över driften direkt, med en nästan aktuell kopia av data.
- Vatten, rök och brand kan lämna farliga rester som måste saneras innan driften kan börja igen, ofta av utomstående specialister.

## Fysisk och logisk säkerhet tillsammans

Physical security blir effektivare med en central plats för alla larm och central styrning av passersystemen. Nästa steg är att integrera fysisk och logisk access control:

- ett och samma ID-kort för både dörrar och system
- registrering och avslut av användare och kort i ett steg
- ett centralt system för ID-hantering i stället för många kataloger
- samordnad övervakning av händelser

Bokens exempel: Bob är inloggad på företagets trådlösa nät, men passersystemet säger att han aldrig gått in i byggnaden. Tillsammans tyder händelserna på att någon kapat hans konto.

**PIV.** Integrationen kräver gemensamma standarder. Den amerikanska standarden **FIPS 201** definierar PIV för federalt anställda och konsulter, och den är en användbar riktlinje även för andra. Kärnan är **PIV-kortet**, ett smartkort med både kontakt och kontaktlöst gränssnitt. Det innehåller uppgifter om innehavaren, certifikat, kryptografiska nycklar, biometri och en PIN, och klarar därför upp till tre faktorer (se kapitlet om user authentication). Uppgifterna på kortet är digitalt signerade, så det går att kontrollera att de kommer från en betrodd källa och inte har ändrats.

| Delsystem | Gör |
|---|---|
| **PIV front end** | gränssnittet mot den som vill in, i en lokal eller i ett system: kortet, kortläsaren, PIN och biometri |
| **PIV card issuance and management** | kontrollerar identiteten, registrerar, utfärdar kort och nycklar och har det centrala identitetsregistret |
| **PIV relying subsystem** | avgör vilken fysisk eller logisk resurs kortinnehavaren får komma åt |

En vinst med integrationen är att all åtkomst, till både lokaler och system, kan dras in på en gång från ett ställe.

**PACS.** Ett **physical access control system (PACS)** styr tillträdet till lokaler. Standarden NIST SP 800-116 visar hur PIV-kort används i ett PACS och delar in lokalerna i skyddade områden. Ju närmare det skyddade, desto fler faktorer:

| Område | Innebär | Faktorer |
|---|---|---|
| **Unrestricted** | inget säkerhetsintresse | – |
| **Controlled** | buffertzon runt de känsligare områdena, bara för dem som har behov; att komma in ger ingen åtkomst till det skyddade | en |
| **Limited** | nära det skyddade; fri rörelse här kan ge åtkomst, så eskort och andra begränsningar behövs. Tillträdet bygger ofta på grupp eller roll. | två |
| **Exclusion** | innehåller det skyddade, så fri rörelse ger direkt åtkomst; bara individuell behörighet | tre |

I bokens modell ligger områdena inuti varandra, så att en ny faktor läggs till vid varje dörr.
`,
};

export const topic = {
  id: "bok16-fysisk",
  name: "Fysisk säkerhet och infrastruktur",
  chapter: "bok16",
  examWeight: "hög",
  summary: "Physical security (infrastructure security) skyddar hårdvaran, lokalerna, stödsystemen och personalen, till skillnad från logical security, som skyddar data mot hot via mjukvara och kommunikation, och premises security, som skyddar hela anläggningen. Hoten är environmental, technical eller human-caused. Redundans är kärnan i återställningen, och PIV-kort kan förena fysisk och logisk access control.",
  keyPoints: [
    "Physical security: skyddar hårdvara, lokaler, stödsystem (el, kommunikation, klimat) och personal; kallas också infrastructure security.",
    "Logical security: skyddar datorbaserade data mot hot via mjukvara och kommunikation.",
    "Premises security: skyddar människor och egendom i hela anläggningen; kallas också corporate eller facilities security.",
    "Environmental threats: fel temperatur och fukt, brand och rök, vatten, kemiska ämnen, damm och skadedjur; naturkatastrofer är en viktig källa.",
    "Technical threats: elproblem (undervoltage, overvoltage, noise) och elektromagnetisk störning (EMI).",
    "Human-caused threats: unauthorized physical access, theft, vandalism och misuse; svårast, eftersom de är gjorda för att ta sig förbi skyddet.",
    "UPS och generator: UPS för korta avbrott (minuter), generator för längre avbrott och brownouts.",
    "Återställning: redundans är viktigast, med data off site och i kritiska fall en hot site.",
    "PIV och PACS: ett kort för både fysisk och logisk åtkomst; en, två eller tre faktorer för controlled, limited och exclusion areas.",
  ],
  pitfalls: [
    "Kryptering är logical security, inte physical security; ett biometriskt passersystem är däremot fysiskt, eftersom det styr tillträdet till lokalen.",
    "Infrastructure security är ett annat namn för physical security; corporate och facilities security är andra namn för premises security.",
    "Elproblem och EMI är technical threats, inte environmental threats, även om ett blixtnedslag kan orsaka en överspänning.",
    "Låg fukt ger statisk elektricitet; hög fukt ger korrosion och kondens; thermal shock kommer av för kall utrustning som startas.",
    "Avlyssning räknas som theft; misuse är när behöriga använder resurserna fel, eller obehöriga använder dem alls.",
  ],
};

export const glossary = [
  { term: "Physical security", definition: "Skyddet av informationssystemens fysiska tillgångar: hårdvaran, lokalerna, stödsystemen som el och klimat, och personalen. Kallas också infrastructure security.", chapter: "bok16" },
  { term: "Logical security", definition: "Skyddet av datorbaserade data mot hot som kommer via mjukvara och kommunikation. Det mesta av boken handlar om logical security.", chapter: "bok16" },
  { term: "Premises security", definition: "Skyddet av människor och egendom i ett helt område, en anläggning eller byggnad, ofta krävt av lagar och regler. Kallas också corporate security eller facilities security.", chapter: "bok16" },
  { term: "Environmental threats", definition: "Förhållanden i miljön som kan skada informationssystemen eller avbryta driften, till exempel fel temperatur och fukt, brand, vatten och damm. Naturkatastrofer är en viktig källa.", chapter: "bok16" },
  { term: "Technical threats", definition: "Fysiska hot som gäller elkraft och elektromagnetisk strålning: undervoltage, overvoltage, noise och elektromagnetisk störning (EMI).", chapter: "bok16" },
  { term: "Human-caused threats", definition: "Fysiska hot från människor: obehörigt tillträde, stöld, vandalism och missbruk. Svårast att skydda sig mot, eftersom de är gjorda för att ta sig förbi skyddet.", chapter: "bok16" },
  { term: "Undervoltage", definition: "Utrustningen får lägre spänning än den behöver, från korta dippar till brownouts och strömavbrott. Ger sällan skada men avbryter driften.", chapter: "bok16" },
  { term: "Overvoltage", definition: "En spänningstopp (surge), till exempel från elbolaget, ett ledningsfel eller ett blixtnedslag. Allvarligare än undervoltage, eftersom den kan förstöra processorer och minnen.", chapter: "bok16" },
  { term: "Noise", definition: "Störsignaler som följer med elledningen. De kan ta sig förbi nätaggregatets filter och ge logiska fel i elektroniken.", chapter: "bok16" },
  { term: "Personal identity verification (PIV)", definition: "Den amerikanska standarden FIPS 201 för att verifiera identiteten hos federalt anställda och konsulter. Ett smartkort, PIV-kortet, ger både fysisk och logisk åtkomst.", chapter: "bok16" },
  { term: "Physical access control system (PACS)", definition: "System som styr det fysiska tillträdet till lokaler. Med PIV-kort krävs fler faktorer ju känsligare området är: controlled, limited och exclusion areas.", chapter: "bok16" },
];

export const questions = [
  { id: "sak-bok16-v06", topic: "bok16-fysisk", difficulty: 1, ...variant("sak-06", "fysisk eller logisk säkerhet"),
    question: "The book separates logical security from physical security. Which of these measures is logical security?",
    options: [
      { text: "Bolting a server to a heavy object", explain: "Att bulta fast utrustningen är physical access control. Det avskräcker från stöld, men inte från vandalism eller missbruk." },
      { text: "A UPS for each piece of critical equipment", explain: "En UPS skyddar mot korta strömavbrott, ett technical threat mot den fysiska infrastrukturen." },
      { text: "Smoke detectors under the raised floor", explain: "Rökdetektorer i datorrum, under upphöjda golv och ovanför undertak skyddar mot brand och rök, ett environmental threat." },
      { text: "Encrypting the data stored on a server", explain: "Kryptering skyddar data mot hot som kommer via mjukvara och kommunikation, och hör därför till logical security." },
    ],
    correct: 3, reviewed: false },

  { id: "sak-bok16-01", topic: "bok16-fysisk", difficulty: 1,
    question: "In the book's grouping of physical security threats, where do undervoltage, overvoltage and noise belong?",
    options: [
      { text: "Environmental threats", explain: "Environmental threats är förhållanden i miljön, som fel temperatur och fukt, brand och vatten." },
      { text: "Technical threats", explain: "Technical threats omfattar elkraft och elektromagnetisk störning. Underspänning, överspänning och brus är de tre slagen av elproblem." },
      { text: "Human-caused threats", explain: "Hoten från människor är obehörigt tillträde, stöld, vandalism och missbruk." },
      { text: "Natural disasters", explain: "Naturkatastrofer är en källa till environmental threats. Ett blixtnedslag kan orsaka en överspänning, men själva elproblemet räknas som technical threat." },
    ],
    correct: 1, source: "Bokens kapitel 16 (hotens tre kategorier)", reviewed: false },

  { id: "sak-bok16-02", topic: "bok16-fysisk", difficulty: 2,
    question: "According to the book, why is very low humidity a threat to computer equipment?",
    options: [
      { text: "Static electricity builds up and can damage circuits", explain: "Vid låg fukt blir statisk elektricitet ett problem, och en urladdning från en människa kan skada elektroniken." },
      { text: "Long exposure corrodes the metal parts of the equipment", explain: "Korrosion kommer av lång tid i hög fukt, inte låg." },
      { text: "Condensation forms and can cause short circuits", explain: "Kondens hör också till hög fukt och kan ge kortslutning på kretskorten." },
      { text: "Cold equipment can crack from thermal shock when started", explain: "Thermal shock är ett temperaturproblem: för kall utrustning kan spricka när den startas." },
    ],
    correct: 0, source: "Bokens kapitel 16 (temperatur och fukt)", reviewed: false },

  { id: "sak-bok16-03", topic: "bok16-fysisk", difficulty: 2,
    question: "Among the book's human-caused physical threats, which category includes eavesdropping and wiretapping?",
    options: [
      { text: "Misuse of resources", explain: "Misuse är när behöriga använder resurserna på fel sätt, eller obehöriga använder dem alls." },
      { text: "Vandalism of equipment", explain: "Vandalism är förstörelse av utrustning och data, inte avlyssning." },
      { text: "Theft of equipment or data", explain: "Theft omfattar stöld av utrustning och stöld av data genom kopiering, och avlyssning räknas hit. Tjuven kan vara utomstående eller insider." },
      { text: "Unauthorized physical access", explain: "Obehörigt tillträde kan leda vidare till stöld, men avlyssning räknas i boken som theft." },
    ],
    correct: 2, source: "Bokens kapitel 16 (human-caused threats)", reviewed: false },

  { id: "sak-bok16-04", topic: "bok16-fysisk", difficulty: 2,
    question: "Which element of information system security protects the people and property of a whole facility, and is often required by law?",
    options: [
      { text: "Logical security", explain: "Logical security skyddar datorbaserade data mot hot via mjukvara och kommunikation." },
      { text: "Infrastructure security", explain: "Infrastructure security är ett annat namn för physical security, som skyddar informationssystemen och dem som sköter dem." },
      { text: "Premises security", explain: "Premises security, även kallad corporate eller facilities security, skyddar människor och egendom i hela området, med bland annat perimeterskydd, brandlarm och vakter." },
      { text: "Physical security", explain: "Physical security skyddar informationssystemen och människorna som använder och sköter dem, inte hela anläggningen." },
    ],
    correct: 2, source: "Bokens kapitel 16 (logical, physical och premises security)", reviewed: false },

  { id: "sak-bok16-05", topic: "bok16-fysisk", difficulty: 1,
    question: "According to the book, what is the most essential element of recovery from physical security breaches?",
    options: [
      { text: "Redundancy, like off-site copies", explain: "Kopior av viktiga data på annan plats, eller en hot site, gör att förlorade data kan återställas. Redundans ångrar däremot inte en stöld av data." },
      { text: "Cleanup by outside specialists", explain: "Specialister behövs ofta för att sanera efter vatten, rök och brand, men boken pekar ut redundans som det viktigaste." },
      { text: "Stricter physical access control", explain: "Physical access control förebygger hot från människor; det är ingen återställning." },
      { text: "Insurance and fire inspections", explain: "Inspektioner av försäkringsbolag och brandkår är en förebyggande åtgärd mot brand, inte återställning." },
    ],
    correct: 0, source: "Bokens kapitel 16 (återställning)", reviewed: false },

  { id: "sak-bok16-06", topic: "bok16-fysisk", difficulty: 2,
    question: "In NIST SP 800-116, which protected area contains the security interest itself, so that uncontrolled movement gives direct access?",
    options: [
      { text: "Controlled area", explain: "Ett controlled area är en buffertzon där tillträdet i sig inte ger åtkomst till det skyddade. En faktor räcker." },
      { text: "Limited area", explain: "Ett limited area ligger nära det skyddade, och fri rörelse kan ge åtkomst. Modellen kräver två faktorer." },
      { text: "Unrestricted area", explain: "Ett unrestricted area har inget säkerhetsintresse alls." },
      { text: "Exclusion area", explain: "Ett exclusion area innehåller det skyddade, så tillträdet kräver individuell behörighet och tre faktorer." },
    ],
    correct: 3, source: "Bokens kapitel 16 (PACS och skyddade områden)", reviewed: false },

  { id: "sak-bok16-07", topic: "bok16-fysisk", difficulty: 2,
    question: "What is a PIV card in the FIPS 201 standard?",
    options: [
      { text: "A magnetic-strip card that stores only a facility code", explain: "Vanliga passerkort har ofta bara ett kortnummer och en anläggningskod. PIV-kortets uppgifter är dessutom digitalt signerade." },
      { text: "A smart card used for both physical and logical access", explain: "PIV-kortet är ett smartkort med uppgifter om innehavaren, certifikat, nycklar, biometri och PIN. Samma kort ger tillträde till både lokaler och system." },
      { text: "A token that shows one-time passwords for logins", explain: "Engångskoder kommer från en annan sorts token, se kapitlet om user authentication. PIV-kortet bygger på PIN, biometri och kryptografiska nycklar." },
      { text: "A certificate authority that signs the card data", explain: "En certificate authority signerar kortets uppgifter och ingår i systemets kärna, men den är inte själva kortet." },
    ],
    correct: 1, source: "Bokens kapitel 16 (PIV)", reviewed: false },
  { id: "sak-bok16-08", topic: "bok16-fysisk", difficulty: 1,
    question: "Which measure does the book recommend against short power interruptions, lasting seconds or minutes?",
    options: [
      { text: "A backup generator that powers the whole site", explain: "En generator är skyddet vid längre avbrott och brownouts. Den hinner inte ta över vid korta avbrott." },
      { text: "Filters and shielding of the cables", explain: "Filter och skärmning skyddar mot elektromagnetisk störning (EMI)." },
      { text: "Water sensors that cut the power automatically", explain: "Vattensensorer skyddar mot vattenskador, inte mot strömavbrott." },
      { text: "A UPS for each critical piece of equipment", explain: "En uninterruptible power supply är ett batteri som håller strömmen i några minuter och kan också skydda mot överspänning och filtrera brus." },
    ],
    correct: 3, source: "Bokens kapitel 16 (åtgärder mot technical threats)", reviewed: false },

  { id: "sak-bok16-09", topic: "bok16-fysisk", difficulty: 2,
    question: "In the book's layered physical access control, what does bolting a computer to a heavy object achieve?",
    options: [
      { text: "It stops theft, vandalism and misuse of the computer", explain: "Fastbultning gör datorn svår att flytta, men hindrar inte att den förstörs eller missbrukas på plats." },
      { text: "It deters theft, but not vandalism or misuse", explain: "Ett av stegen i physical access control: det avskräcker från stöld, och stegen kombineras för att täcka resten." },
      { text: "It keeps unauthorized employees out of the building", explain: "Att begränsa tillträdet till byggnaden stoppar utomstående, men inte obehöriga anställda." },
      { text: "It raises an alarm when the computer is moved out", explain: "Det gör en spårningsenhet, ett annat steg i physical access control." },
    ],
    correct: 1, source: "Bokens kapitel 16 (physical access control)", reviewed: false },
];

export const notes = `Byggt på kap. 16 i del2-filen, s. 867–902: inledningen med de tre delarna av IS-säkerhet (s. 867–868), 16.1 (infrastrukturens fyra delar och missbruk, s. 869), 16.2 (natural disasters, environmental, technical och human-caused threats, s. 870–881), 16.3 (åtgärder per hot, physical access control i sex steg, Wi-Fi, s. 882–887), 16.4 (återställning, s. 888), 16.6 (integration, Bob-exemplet, FIPS 201 PIV, PACS och NIST SP 800-116, s. 890–898), Key Terms och Review Questions 16.1–16.10 (s. 899–900). Key Terms och Review Questions styrde urvalet. Kopplingen till data center-modellen (site och physical security) kontrollerad mot kap. 5 s. 282–283.

Osäkert:
- Textfilen har tappat siffrorna för rekommenderat temperaturintervall ("between and ( and )"), så kapitlet nämner bara fuktintervallet 40–60 % som står kvar.
- Figure 16.2 (PIV-modellens tre delsystem, Review Question 16.9) saknas i textfilen. Namnen är tagna ur löptexten: "PIV front end", "PIV card issuance and management subsystem" och "PIV relying subsystem". Figuren kan ha ett annat namn på det tredje (t.ex. access control subsystem).
- Boken har fyra typer av områden i Table 16.6 (unrestricted, controlled, limited, exclusion) men faktorkraven (1/2/3) gäller bara de tre sista; unrestricted står med "–".
- Kärnpunkten "premises security skyddar hela anläggningen" och jämförelsen med Föreläsning 2:s site security är min koppling. Kapitlet säger bara att modellen har physical och site security som lager och att det här kapitlet säger vad de skyddar mot, inte att site security är samma sak som premises security.
- Mantrap: kap. 5 (s. 282) räknar mantrap till physical security, medan Föreläsning 2 och topics.js lägger mantrap-entréer under site security. Kapitlet nämner inte mantrap för att inte krocka. (22 nov: Föreläsning 2:s kapitel, fallgrop och fråga och bokens kapitel 5 säger nu båda varianterna.)
- Att kryptering hör till logical security är en slutsats ur bokens definition (skydd mot hot via mjukvara och kommunikation), inte en mening i kapitlet.
- "Biometriskt passersystem räknas som fysiskt" följer förra årets förklaring och bokens PACS, där biometri är en faktor vid dörren.

Medvetet utelämnat: Fujita- och Saffir/Simpson-skalorna, varningstid per katastroftyp (Table 16.1), temperaturtabellerna (16.4 och 16.5) och brandkurvan, siffror om statisk elektricitet och 20 % underspänning, galvanisk effekt, hela listan med 15 brandåtgärder (kortad till sex), regeln om två våningar ovanför, försäkringsbolagets inspektion (finns bara som distraktor i sak-bok16-05), stegen 5 och 6 i physical access control (sammanslagna till ett), fyra av fem vinster med integrationen (bara omedelbar indragning av all åtkomst står kvar), att direkt tillträde till ett inre område kräver alla faktorer vid den dörren, ISO 27002 och NIST SP 800-53 som kontrollkataloger, 16.5 (företagets säkerhetspolicy, bara en PDF-hänvisning), PIV-kortets tre assurance levels, NIST SP 800-116:s sex autentiseringsmekanismer (PKI-CAK, SYM-CAK, BIO, BIO-A, PKI-AUTH, OCC-AUTH), IDMS som akronym och Figure 16.3/16.4 i detalj. Bokens hänvisning till kap. 13 (molnet) och kap. 24 (trådlöst) är utelämnad eftersom de kapitlen inte finns på sajten; hänvisningen till kap. 14–15 (riskbedömning) är ersatt med Föreläsning 2.

Ordlistan: 11 termer, alla ur Key Terms. Synonymerna infrastructure, corporate och facilities security står i definitionerna av physical respektive premises security i stället för som egna poster. UPS, EMI, brownout, hot site och thermal shock står bara i löptexten (inte Key Terms).

Frågor: 8 st, varav varianten sak-bok16-v06 (fysisk eller logisk säkerhet: frågar vilken åtgärd som är logisk, med bokens fysiska åtgärder UPS, rökdetektorer och fastbultning som distraktorer; inget alternativ ordagrant från originalet och ingen överlappning med Föreläsning 2:s variant, som frågar efter en fysisk kontroll i data center-modellen). Rätt position 2/2/2/2.`;
