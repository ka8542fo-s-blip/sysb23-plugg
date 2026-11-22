// Bokens kapitel 17: Stallings & Brown, Human Resources Security (s. 903–941).
// Kapitel, ämne, ordlista och frågor; samlas av reading.js, topics.js och
// questions.js via bok/index.js. Skrivet med egna ord på tentans nivå,
// granskat mot boken 22 nov 2026 (ogranskat av Kasper). `notes` är
// källanteckningarna och visas inte.

const variant = (id, what) => ({ variantOf: id, source: `Variant av en tentafråga från förra året (${what})` });

export const chapter = {
  id: "bok17",
  kind: "bok",
  label: "Bokens kapitel 17",
  examArea: "Bokfrågor",
  title: "Personalsäkerhet: medvetenhet, utbildning och incidenter",
  readingMinutes: 11,
  lead: "Människor är både en stor risk och en del av skyddet. Kapitlet handlar om hur en organisation utbildar, anställer och styr sin personal, och hur den hanterar en säkerhetsincident när den väl inträffar.",
  sources: ["Stallings & Brown kap. 17 (s. 903–941)"],
  body: `
## Kärnan

- **Människor är en stor säkerhetsrisk.** De flesta allvarliga datorbrott begås av någon som har eller nyss har haft behörig åtkomst.
- **Lärandet har fyra nivåer**, från security awareness för alla anställda till education and certification för dem med särskilt säkerhetsansvar.
- **Anställningen har tre skeden** med var sitt säkerhetsmål: rekryteringen, tiden som anställd och när anställningen upphör.
- **En acceptable use policy (AUP)** säger hur de anställda får använda organisationens tillgångar, också e-post, internet och sociala medier.
- **Ett computer security incident response team (CSIRT)** hanterar incidenter i fyra steg: upptäcka, sortera (triage), åtgärda och dokumentera.

## Varför människor är en risk

Rapporter om dataintrång har i många år visat att anställda är inblandade i en stor del av incidenterna. Huvudproblemen är social engineering och phishing, stulna eller svaga inloggningsuppgifter, fel och försummelser, bedrägeri och missnöjda anställda. Phishing och stulna inloggningsuppgifter är angriparnas två vanligaste vägar in.

En anställd kan bidra till ett säkerhetsbrott på två sätt:

- **Omedvetet:** följer inte rutinerna, glömmer säkerheten eller förstår inte att hen skapar en sårbarhet.
- **Medvetet:** bryter med avsikt mot kontrollerna.

Insiders kan till exempel radera backuper, hålla data som gisslan eller stjäla kunddata. Se också inside attack i kapitlet om grundbegreppen.

## Awareness, training och education

Program för säkerhetsmedvetenhet och utbildning ger fyra fördelar:

1. **Bättre beteende** hos de anställda.
2. **Lättare att utkräva ansvar**, eftersom ingen kan skylla på okunskap.
3. **Mindre ansvar för organisationen**, som kan visa att den varit tillräckligt omsorgsfull (due care).
4. **Lagar och avtal följs.**

Vad en anställd behöver lära sig beror på rollen. Boken beskriver en **learning continuum** i fyra nivåer, från botten och uppåt:

| Nivå | För vem | Vad den ger |
|---|---|---|
| **Security awareness** | alla anställda, också de som inte använder IT | förklarar och främjar säkerhet, skapar ansvar och informerar om säkerhetsnyheter |
| **Cybersecurity basics and literacy** | alla som på något sätt använder IT-system, också inhyrd personal | säkra vanor och en gemensam grund av termer och begrepp |
| **Role-based security training** | de som har en funktion i IT-systemen, inte bara är användare | kunskaper och färdigheter för just den rollen |
| **Security education and certification** | de som har särskilt ansvar för säkerheten | samlad kunskap och tvärvetenskaplig förståelse |

De två mittersta nivåerna är training. Boken jämför de tre slagen:

| | Awareness | Training | Education |
|---|---|---|---|
| Svarar på | "What" | "How" | "Why" |
| Nivå | information | knowledge | insight |
| Mål | recognition (känna igen) | skill (kunna göra) | understanding (förstå) |
| Prov | sant/falskt, flerval | problemlösning | essä |
| Verkar på | kort sikt | medellång sikt | lång sikt |

**Den viktigaste skillnaden mellan awareness och training:** awareness riktar uppmärksamheten mot en fråga, training lär ut färdigheter så att någon kan utföra en viss uppgift.

**Awareness** ska nå alla, eftersom fysisk säkerhet, besökare, sociala medier och social engineering angår alla. Programmet ska pågå hela tiden och följas upp, och målet är en säkerhetskultur i hela organisationen. Föreläsning 2 visar ett security awareness program runt Straub & Welkes modell, och i kapitlet Säkerhetskontroller, planer och rutiner hör awareness and training till implementeringen.

**Role-based training** skiljer sig efter roll. Vanliga användare lär sig skydda utrustning och lösenord, rapportera incidenter och känna igen phishing. Utvecklare lär sig hur angripare utnyttjar mjukvara och hur säkerhet byggs in i utvecklingen. Chefer lär sig väga risker, kostnader och nytta mot varandra.

**Education and certification** ligger oftast utanför organisationens egna program och hör till karriärutvecklingen, till exempel kurser på högskolan.

## Anställningens tre skeden

Standarden **ISO 27002**, en code of practice för informationssäkerhet, ger ett mål för varje skede. Målen gäller också konsulter och tredje part.

| Skede | Målet |
|---|---|
| **Rekrytering** | de som anställs förstår sitt ansvar och passar för rollen, och risken för stöld, bedrägeri och missbruk minskar |
| **Under anställningen** | de anställda känner till hoten och sitt ansvar, kan stödja säkerhetspolicyn i det vanliga arbetet och gör färre misstag |
| **När anställningen upphör** | personen lämnar ordnat, all utrustning lämnas tillbaka och alla behörigheter tas bort |

**Rekrytering.** **Background checks and screening** är svåra: många överdriver sina meriter, och tidigare arbetsgivare säger ofta bara när personen var anställd, av rädsla för att bli stämda. Arbetsgivaren ska be om detaljerad arbets- och utbildningshistorik, kontrollera den och låta erfarna medarbetare intervjua. För känsliga tjänster kan utdrag ur brottsregistret och kreditupplysning behövas. Extra kontroller gäller alla med förtroendeställning eller privilegierad åtkomst, också städ- och underhållspersonal. I vissa länder kan arbetsgivaren dessutom bli ansvarig för **negligent hiring** om en anställd skadar någon utomstående i tjänsten.

Den anställda skriver under ett anställningsavtal med ett sekretessavtal (**confidentiality and nondisclosure agreement**) och en hänvisning till säkerhetspolicyn. Arbetsbeskrivningen anger rollens säkerhetsansvar.

**Under anställningen.** Grunden är en säkerhetspolicy med en AUP och ett ständigt pågående program för awareness och training. Dessutom gäller fem principer:

| Princip | Innebär |
|---|---|
| **Least privilege** | var och en får minsta åtkomst som jobbet kräver, både logiskt och fysiskt (se Föreläsning 2) |
| **Separation of duties** | den som kontrollerar missbruk ska inte själv kunna missbruka; har samma person både säkerhetsåtkomst och ansvar för granskningen kan hen bryta mot policyn och sopa igen spåren |
| **Limited reliance on key employees** | ingen ska ha unik kunskap som organisationen inte klarar sig utan |
| **Dual operator policy** | vissa uppgifter kräver två personer; i **two-person control** godkänner två anställda varandras arbete |
| **Mandatory vacations** | obligatorisk semester avslöjar bedrägeri och förskingring; banker kräver ofta minst fem arbetsdagar i följd |

**När anställningen upphör** ska personen tas bort från alla listor över behörig åtkomst, och för IT-personal ska man kontrollera att inga egna administratörskonton (rogue admin accounts) har skapats. Vakterna får veta att personen inte får komma in, koder, lås och passerkort ändras vid behov (se kapitlet Fysisk säkerhet och infrastruktur), och id-kort och utrustning lämnas tillbaka.

## Acceptable use policy

En **acceptable use policy (AUP)** beskriver hur användarna får använda organisationens tillgångar: vad som är tillåtet och vad som inte är det. Den gäller alla anställda med åtkomst till någon tillgång, och att skriva under att man läst och godtar den bör vara ett villkor för anställningen.

Arbetet följer fem steg: riskbedömning, skriva policyn, sprida den, följa upp efterlevnaden och genomdriva den konsekvent och rättvist. En tydlig policy som genomdrivs kan minska organisationens ansvar om en anställd bryter mot den och kunddata läcker.

Policyn anger syfte och omfattning, reglerna och följderna av att bryta mot dem. E-post, internet och sociala medier regleras här:

| Område | Exempel |
|---|---|
| Allmän användning | skydda företagets information, använda gott omdöme vid privat användning |
| Säkerhet | mobila enheter följer BYOD-policyn, lösenord följer lösenordspolicyn, stor försiktighet med e-postbilagor |
| Otillåtet i system och nät | kopiera upphovsrättsskyddat material, avslöja sitt lösenord eller låta andra använda kontot, kringgå autentisering |
| Otillåtet i e-post | trakasserier, spam, förfalskade e-posthuvuden |
| Bloggar och sociala medier | tillåtet om det sker professionellt och inte stör arbetet; förbjudet att skada företagets rykte eller låta egna åsikter framstå som företagets |

## Säkerhetsincidenter och CSIRT

De flesta organisationer drabbas förr eller senare av en incident. Rutiner som är klara i förväg förhindrar panik.

En **security incident** är varje handling som hotar något av sex mål: confidentiality, integrity, availability, accountability, authenticity eller reliability, samma sex som i definitionen av IT security management (se Föreläsning 2). Kortare: ett brott mot, eller ett överhängande hot om brott mot, säkerhetspolicyn, en AUP eller vedertagna säkerhetsrutiner.

I stora och medelstora organisationer sköts hanteringen av ett **computer security incident response team (CSIRT)**. De användare och nät som teamet tjänar kallas dess **constituency**. Teamet ska:

1. upptäcka incidenter snabbt
2. begränsa förlust och förstörelse
3. åtgärda de svagheter som utnyttjades
4. återställa tjänsterna

Enligt NIST ger en förmåga att hantera incidenter fyra fördelar: man svarar systematiskt, återhämtar sig snabbare med mindre förluster, lär sig inför nästa incident och hanterar juridiska frågor rätt. NIST delar också in incidenterna i fem kategorier:

| Kategori | Innebär |
|---|---|
| Denial of service | normal användning av systemen hindras |
| Malicious code | skadlig kod infekterar en dator |
| Unauthorized access | någon tar sig obehörigt in i ett system |
| Inappropriate usage | användning som bryter mot AUP:n |
| Multiple component | två eller fler av ovanstående i samma incident |

## Incidenthanteringens fyra steg

| Steg | Vad som händer |
|---|---|
| 1. **Detecting** | användare och personal rapporterar fel och konstigt beteende, eller automatiska verktyg slår larm |
| 2. **Triage** | alla rapporter tas emot på ett ställe, sorteras och prioriteras |
| 3. **Responding** | incidenten hanteras enligt dokumenterade rutiner |
| 4. **Documenting** | det som hänt skrivs ner, och lärdomarna förs tillbaka till riskhanteringen |

**Upptäcka.** Personalen ska veta vem de ska rapportera till. Automatiska verktyg är system integrity verification tools (kontrollerar att viktiga filer inte ändrats), log analysis tools, IDS och IPS (se kapitlen om intrusion detection och om firewalls och intrusion prevention).

**Triage.** Alla rapporter, via e-post, helpdesk eller IDS, går till en enda kontaktpunkt. Triage ber vid behov om mer information, avgör om incidenten är ny eller del av en pågående och lämnar den vidare i prioritetsordning.

**Åtgärda.** Rutinerna ska tala om hur man hittar orsaken och återhämtar sig med minsta möjliga skada, till exempel genom att filtrera trafik, patcha och bygga om system. De ska också peka ut vilka chefer som fattar de svåra besluten, som att koppla bort organisationen från internet när en mask sprids via e-post. Organisationen bestämmer i förväg när en incident ska rapporteras till polisen eller ett **CERT** (computer emergency response team). Ska bevisen användas i domstol måste insamlingen och förvaringen dokumenteras.

**Dokumentera.** Efteråt tar man reda på vilken sårbarhet som låg bakom, skriver ner vad som hände och ser över riskbedömningen och kontrollerna. En incident kan vara ren otur, men oftare visar den att riskbilden har ändrats. IT security management är alltså en cykel; i kapitlet Säkerhetskontroller, planer och rutiner är incident handling en del av uppföljningen.

**Samma ordning som i Föreläsning 2.** Där är **Detection and Analysis** det första steget, följt av containment, eradication och recovery. Att Detection and Analysis kommer först var svaret på en av förra årets tentafrågor. Boken använder inte de orden, men också där kommer upptäckten först, och CSIRT:s fyra uppgifter följer ungefär samma ordning: upptäcka, begränsa skadan, åtgärda svagheten och återställa.
`,
};

export const topic = {
  id: "bok17-personal",
  name: "Personalsäkerhet: medvetenhet, utbildning och incidenter",
  chapter: "bok17",
  examWeight: "hög",
  summary: "Anställda är inblandade i många incidenter, med avsikt eller av misstag. Boken bygger lärandet i fyra nivåer från awareness för alla till education för säkerhetsspecialister, ger varje skede av anställningen ett säkerhetsmål och principer som least privilege och separation of duties, och reglerar användningen med en acceptable use policy. Incidenter hanteras av ett CSIRT i fyra steg: upptäcka, triage, åtgärda och dokumentera.",
  keyPoints: [
    "Insiders: de flesta allvarliga datorbrott begås av någon som har eller nyss har haft behörig åtkomst.",
    "Security awareness: för alla anställda; riktar uppmärksamheten (what) och verkar på kort sikt.",
    "Training: lär ut färdigheter (how) till dem som använder IT eller har en funktion i IT-systemen.",
    "Education and certification: för dem med särskilt säkerhetsansvar; ger förståelse (why) på lång sikt.",
    "Rekrytering: bakgrundskontroll, sekretessavtal och arbetsbeskrivningar med säkerhetsansvar.",
    "Under anställningen: least privilege, separation of duties, dual operator policy och mandatory vacations.",
    "När anställningen upphör: alla behörigheter tas bort och all utrustning lämnas tillbaka.",
    "Acceptable use policy (AUP): hur de anställda får använda organisationens tillgångar, också e-post och sociala medier.",
    "CSIRT: upptäcker, sorterar (triage), åtgärdar och dokumenterar incidenter; upptäckten kommer först.",
  ],
  pitfalls: [
    "Awareness riktar uppmärksamheten och gäller alla; training lär ut färdigheter för en roll; education ger förståelse och är för säkerhetsspecialister.",
    "Separation of duties skiljer den som granskar från den som kan missbruka; dual operator policy kräver två personer för en uppgift; least privilege gäller hur mycket åtkomst var och en får.",
    "Bakgrundskontroll och sekretessavtal hör till rekryteringen; att ta bort behörigheter hör till när anställningen upphör.",
    "Triage sorterar och prioriterar inkommande rapporter; det är inte själva upptäckten eller åtgärden.",
    "Incidenthanteringen börjar med att incidenten upptäcks; dokumentationen och återkopplingen till riskbedömningen kommer sist.",
  ],
};

export const glossary = [
  { term: "Security awareness", definition: "Den lägsta nivån i lärandet, för alla anställda: aktiviteter som förklarar och främjar säkerhet, skapar ansvar och riktar uppmärksamheten mot säkerhetsfrågor.", chapter: "bok17" },
  { term: "Cybersecurity basics and literacy", definition: "Nivån över awareness, för alla som använder IT-system: säkra vanor och en gemensam grund av termer och begrepp som rollutbildningen sedan bygger på.", chapter: "bok17" },
  { term: "Role-based security training", definition: "Utbildning för dem som har en funktion i IT-systemen, till exempel utvecklare och chefer. Lär ut färdigheter för just den rollen.", chapter: "bok17" },
  { term: "Security education and certification", definition: "Den högsta nivån i lärandet, för dem med särskilt säkerhetsansvar. Ger förståelse och hör oftast till karriärutvecklingen snarare än organisationens egna program.", chapter: "bok17" },
  { term: "Acceptable use policy (AUP)", definition: "Policy som beskriver hur användarna får använda organisationens tillgångar, också e-post, internet och sociala medier. De anställda skriver under att de följer den.", chapter: "bok17" },
  { term: "Security incident", definition: "En handling som hotar confidentiality, integrity, availability, accountability, authenticity eller reliability: ett brott mot, eller överhängande hot om brott mot, säkerhetspolicyn, en AUP eller vedertagna rutiner.", chapter: "bok17" },
  { term: "Incident response", definition: "Rutinerna för att svara på en säkerhetsincident. I boken i fyra steg: upptäcka, sortera (triage), åtgärda och dokumentera.", chapter: "bok17" },
  { term: "Computer security incident response team (CSIRT)", definition: "Team som hanterar säkerhetsincidenter för en bestämd grupp användare och nät (dess constituency). Upptäcker incidenter, begränsar skadan, åtgärdar svagheterna och återställer tjänsterna.", chapter: "bok17" },
  { term: "Triage", definition: "Att ta emot, sortera och prioritera information om incidenter, så att den hanteras rätt. Fungerar som den enda kontaktpunkten för alla rapporter.", chapter: "bok17" },
  { term: "Separation of duties", definition: "Att dela upp uppgifter mellan olika personer så att ingen ensam kan kringgå processen. Den som kontrollerar missbruk ska inte själv kunna missbruka.", chapter: "bok17" },
  { term: "Dual operator policy", definition: "Personalprincip där vissa uppgifter kräver två personer. Närliggande är two-person control, där två anställda godkänner varandras arbete.", chapter: "bok17" },
  { term: "Mandatory vacations", definition: "Obligatorisk semester, i banker ofta minst fem arbetsdagar i följd, som hjälper till att avslöja anställda som sysslar med bedrägeri eller förskingring.", chapter: "bok17" },
  { term: "Negligent hiring", definition: "Arbetsgivarens ansvar, i vissa länder, när en anställd skadar någon utomstående i tjänsten. Ett skäl att göra ordentliga bakgrundskontroller.", chapter: "bok17" },
];

export const questions = [
  { id: "sak-bok17-v05", topic: "bok17-personal", difficulty: 1, ...variant("sak-05", "incidenthanteringens första steg"),
    question: "In the book's account of how an organization manages security incidents, which activity comes first?",
    options: [
      { text: "Sorting and prioritizing the incoming reports", explain: "Det är triage, som tar emot rapporterna när en möjlig incident redan har upptäckts." },
      { text: "Documenting the breach for future reference", explain: "Dokumentationen kommer sist, när incidenten är hanterad, och lärdomarna förs tillbaka till riskbedömningen." },
      { text: "Detecting the potential security incident", explain: "Incidenten måste först upptäckas, av personal som rapporterar eller av verktyg som IDS. Det stämmer med Föreläsning 2, där Detection and Analysis är första steget." },
      { text: "Responding to the breach and restoring systems", explain: "Åtgärderna, som att filtrera trafik, patcha och bygga om system, kommer efter upptäckten och triage." },
    ],
    correct: 2, reviewed: false },

  { id: "sak-bok17-01", topic: "bok17-personal", difficulty: 1,
    question: "Which level of the IT learning continuum must reach all employees, including those who do not use IT systems?",
    options: [
      { text: "Security awareness programs", explain: "Awareness ska nå alla, eftersom ämnen som fysisk säkerhet, besökare och social engineering angår alla anställda." },
      { text: "Cybersecurity basics and literacy", explain: "Basics and literacy gäller alla som på något sätt använder IT-system, inte de anställda som inte gör det." },
      { text: "Role-based security training", explain: "Rollutbildningen riktar sig till dem som har en funktion i IT-systemen, till exempel utvecklare och chefer." },
      { text: "Security education and certification", explain: "Education and certification är för dem med särskilt säkerhetsansvar och ligger oftast utanför organisationens egna program." },
    ],
    correct: 0, source: "Bokens kapitel 17 (lärandets fyra nivåer)", reviewed: false },

  { id: "sak-bok17-02", topic: "bok17-personal", difficulty: 2,
    question: "According to the book, what is the most significant difference between security awareness and security training?",
    options: [
      { text: "Awareness teaches skills; training directs attention to issues", explain: "Tvärtom: det är training som lär ut färdigheter och awareness som riktar uppmärksamheten." },
      { text: "Awareness directs attention to issues; training teaches skills", explain: "Awareness riktar uppmärksamheten mot en fråga (what), training lär ut hur en viss uppgift utförs (how)." },
      { text: "Awareness is only for IT staff; training is for every employee", explain: "Tvärtom: awareness ska nå alla anställda, medan training gäller dem som använder IT eller har en IT-roll." },
      { text: "Awareness builds long-term insight; training gives quick facts", explain: "Insikt på lång sikt (why) är education. Awareness verkar på kort sikt och training på medellång sikt." },
    ],
    correct: 1, source: "Bokens kapitel 17 (awareness och training)", reviewed: false },

  { id: "sak-bok17-03", topic: "bok17-personal", difficulty: 2,
    question: "Which personnel security principle says that one person should not have both security access and audit responsibilities?",
    options: [
      { text: "Least privilege", explain: "Least privilege ger var och en minsta åtkomst som jobbet kräver. Den delar inte upp kontroll och utförande mellan personer." },
      { text: "Dual operator policy", explain: "Dual operator policy kräver två personer för vissa uppgifter. Den handlar om att utföra en uppgift tillsammans, inte om att skilja granskning från åtkomst." },
      { text: "Mandatory vacations", explain: "Obligatorisk semester hjälper till att avslöja bedrägeri och förskingring." },
      { text: "Separation of duties", explain: "Den som kontrollerar missbruk ska inte själv kunna missbruka. Annars kan samma person bryta mot policyn och sopa igen spåren i granskningen." },
    ],
    correct: 3, source: "Bokens kapitel 17 (principer under anställningen)", reviewed: false },

  { id: "sak-bok17-04", topic: "bok17-personal", difficulty: 1,
    question: "From a security point of view, which action belongs to the termination of employment?",
    options: [
      { text: "Removing the person from all authorized access lists", explain: "När anställningen upphör tas alla behörigheter bort och all utrustning lämnas tillbaka. För IT-personal kontrolleras också att inga egna administratörskonton har skapats." },
      { text: "Checking the person's criminal and credit records", explain: "Brottsregister och kreditupplysning hör till rekryteringen, och bara för känsliga tjänster." },
      { text: "Signing a confidentiality and nondisclosure agreement", explain: "Sekretessavtalet ingår i anställningsavtalet och skrivs under när personen anställs." },
      { text: "Requiring at least five consecutive days of vacation", explain: "Obligatorisk semester är en princip under anställningen, för att avslöja bedrägeri." },
    ],
    correct: 0, source: "Bokens kapitel 17 (anställningens tre skeden)", reviewed: false },

  { id: "sak-bok17-05", topic: "bok17-personal", difficulty: 2,
    question: "Which of these does a typical acceptable use policy (AUP) list as unacceptable use?",
    options: [
      { text: "Blogging in a professional and responsible way", explain: "Bloggning är tillåten om den sker professionellt och inte stör arbetet. Förbjudet är att skada företagets rykte." },
      { text: "Personal use of systems within reasonable limits", explain: "Privat användning är tillåten så länge den anställda använder gott omdöme om vad som är rimligt." },
      { text: "Opening e-mail attachments with great caution", explain: "Stor försiktighet med e-postbilagor är ett krav i policyn, inte något förbjudet." },
      { text: "Letting a colleague log in with your own account", explain: "Att avslöja sitt lösenord eller låta andra använda ens konto är otillåten användning av system och nät." },
    ],
    correct: 3, source: "Bokens kapitel 17 (acceptable use policy)", reviewed: false },

  { id: "sak-bok17-06", topic: "bok17-personal", difficulty: 2,
    question: "In computer security incident handling, what does the triage function do?",
    options: [
      { text: "Scans critical system files for unauthorized changes", explain: "Det gör system integrity verification tools, ett av de automatiska verktygen för att upptäcka incidenter." },
      { text: "Receives, sorts and prioritizes all incoming reports", explain: "Triage är den enda kontaktpunkten för alla rapporter, avgör om incidenten är ny eller pågående och lämnar den vidare i prioritetsordning." },
      { text: "Is the group of users and networks a CSIRT serves", explain: "De användare, platser och nät som ett CSIRT tjänar kallas dess constituency." },
      { text: "Collects evidence so that it is admissible in court", explain: "Bevisinsamlingen hör till åtgärderna, och den måste dokumenteras noga om bevisen ska kunna användas i domstol." },
    ],
    correct: 1, source: "Bokens kapitel 17 (triage)", reviewed: false },

  { id: "sak-bok17-07", topic: "bok17-personal", difficulty: 3,
    question: "According to the book, what should happen after a security incident has been handled?",
    options: [
      { text: "Delete the collected evidence once systems are restored", explain: "Bevisen kan behövas om incidenten polisanmäls, och då måste insamlingen och förvaringen vara dokumenterad." },
      { text: "Report every incident to the police and to a CERT", explain: "Organisationen bestämmer i förväg när en rapport till polis eller CERT är lämplig; alla incidenter rapporteras inte." },
      { text: "Feed the lessons back into risk assessment and controls", explain: "Sårbarheten bakom incidenten identifieras, det som hände dokumenteras och riskbedömningen och kontrollerna ses över. IT security management är en cykel." },
      { text: "Close the case, since most incidents are one-off events", explain: "En incident kan vara ren otur, men oftare visar den att organisationens riskbild har ändrats." },
    ],
    correct: 2, source: "Bokens kapitel 17 (efter incidenten)", reviewed: false },
];

export const notes = `Byggt på kap. 17 i del2-filen, PDF-sidorna 903–941 (markeringarna "Page N of 1641"): s. 903 (innehåll, lärandemål), s. 906 (fyra fördelar med programmen, de anställdas beteende, phishing och stulna inloggningsuppgifter som de två vanligaste vägarna in), s. 907–908 (learning continuum, NIST SP 800-50:s fyra nivåer, Table 17.1), s. 910–912 (security awareness, mål, material), s. 913 (cybersecurity basics and literacy), s. 914–915 (role-based training per roll), s. 916 (education and certification), s. 917 (17.2: insiders, omedvetet/medvetet, insiderhoten), s. 918–919 (rekrytering, bakgrundskontroll, negligent hiring, anställningsavtal, arbetsbeskrivningar), s. 921 (under anställningen, de fem principerna), s. 922 (när anställningen upphör), s. 923–924 (AUP, fem steg, SANS-mallens områden), s. 925–927 (CSIRT, NIST SP 800-61:s fördelar, incidentdefinitionen, CARN03:s fyra aktiviteter, Table 17.2), s. 928–929 (detecting), s. 930 (triage), s. 931–932 (responding, NIST:s fem kategorier, rapportering, bevis), s. 934 (documenting), s. 937–938 (Key Terms, Review Questions). Key Terms och Review Questions 17.1–17.11 styrde urvalet.

Jämfört med Föreläsning 2 (incidenthanteringen): ingen motsägelse. Boken har inga namngivna faser som containment, eradication och recovery och nämner inte "Detection and Analysis" eller "preparation" som steg; NIST SP 800-61 citeras men dess faser återges inte i kapitlet. Bokens ordning är CARN03:s fyra aktiviteter (detecting, triage/sorting, responding, documenting), som också är avsnittsordningen, och texten säger "Once a potential incident is detected ..." respektive "Following the immediate response ...". CSIRT-definitionen räknar upp "rapidly detecting incidents, minimizing loss and destruction, mitigating the weaknesses that were exploited, and restoring computing services", vilket body jämför "ungefär" med föreläsningens detection–containment–eradication–recovery; jämförelsen är min tolkning, inte bokens. Bokens kap. 1 (FIPS 200, PDF s. 60) beskriver incident response som "preparation, detection, analysis, containment, recovery, and user-response activities", vilket också stämmer med föreläsningen. Figure 17.3 (Incident Handling Life Cycle) finns bara som bildtext i textfilen; den är inte använd.

Variant sak-bok17-v05 (av sak-05): frågar vilken aktivitet som kommer först i bokens beskrivning, med bokens egna steg som distraktorer (triage, documenting, responding). Inget alternativ är ordagrant lika originalets. Osäkerhet: boken listar de fyra aktiviteterna som områden som rutinerna ska täcka, inte uttryckligen som numrerade steg; ordningen framgår av listan, avsnittsordningen och formuleringarna ovan. Förberedelser (rutiner klara i förväg) nämns i boken men är inget alternativ.

Osäkert eller att granska:
- 5:e upplagan har inget eget avsnitt om e-post- och internetpolicy; e-post, internet, bloggar och sociala medier ingår i AUP-avsnittet (SANS-mallen), och kapitlet behandlar dem där.
- Rapporten bakom "phishing och stulna inloggningsuppgifter är de två vanligaste vägarna in" heter bara [VERI22] i texten (troligen Verizons DBIR); body säger "rapporter".
- "Intermediate" i Table 17.1 översatt med "medellång sikt"; "contractor employees" med "inhyrd personal"; "due care" står kvar på engelska.
- "Bonding" (borgen för tjänsten) i bokens lista för känsliga tjänster är utelämnad, eftersom en svensk motsvarighet är osäker.
- NIST:s fem incidentkategorier: boken skriver "multiple-component incidents"; tabellen säger "Multiple component".
- Hänvisningen till Föreläsning 2:s Straub & Welke bygger på reading.js (Security Awareness Program runt modellen), inte på boken.
- Överlapp med "Säkerhetskontroller, planer och rutiner" (bok15.js): där är awareness and training en del av implementeringen och incident handling en del av uppföljningen, bara i en mening var. Kapitlet hänvisar dit i avsnittet om awareness och i steget Dokumentera och ger detaljerna här. bok15.js notes föreslår en motsvarande hänvisning tillbaka hit. Avslutningen av anställningen hänvisar till "Fysisk säkerhet och infrastruktur" för lås och passerkort.

Medvetet utelämnat: awareness-programmets mål i sin helhet (tio punkter), materiallistorna i detalj och de externa källorna, SANS mognadsnivåer, ämneslistan för basics and literacy, utvecklarutbildningens fyra mål i detalj, Figure 17.2 (uppgifter per arbetsbeskrivning, bara bildtext) och FFIEC om arbetsbeskrivningar, detaljerna om lås och passerkort, AUP:ns punkter om garantier, personallistor och att använda åtkomst till annat än jobbet, ansvarig för uppföljning av policyn och rapportvägen för överträdelser, Table 17.2:s artifact och vulnerability, maskexemplets detaljer, exemplen på rapporteringspolicy (bedrägeri, defacement), Table 17.3 (informationsflöden till och från incidenthanteringen) och övningsuppgifterna.

Ordlistan: alla åtta Key Terms plus fem termer ur texten: Triage (Table 17.2), Separation of duties (definition även i bokens ordlista), Dual operator policy, Mandatory vacations och Negligent hiring. Constituency, CERT och two-person control står bara i löptexten. Least privilege finns redan som "Principle of least privilege". Kontrollerat mot den aktuella ordlistan i reading.js (med bok15 och bok16): inga dubbletter.

Frågor: 8 st, varav varianten sak-bok17-v05. Rätt position 2/2/2/2.`;
