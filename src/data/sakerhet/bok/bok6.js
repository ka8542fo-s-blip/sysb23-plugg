// Bokens kapitel 6: Stallings & Brown, Malicious Software (s. 293–371).
// Kapitel, ämne, ordlista och frågor; samlas via bok/index.js. Skrivet med
// egna ord på tentans nivå, granskat mot boken 22 nov 2026 (ogranskat av
// Kasper). `notes` är källanteckningarna och visas inte.
const variant = (id, what) => ({ variantOf: id, source: `Variant av en tentafråga från förra året (${what})` });

export const chapter = {
  id: "bok6",
  kind: "bok",
  label: "Bokens kapitel 6",
  examArea: "Bokfrågor",
  focus: ["Malicious Software / Types of malware"],
  title: "Malicious software: virus, maskar och nyttolaster",
  readingMinutes: 11,
  lead: "Hur skadlig kod tar sig fram och vad den gör när den är framme: virus, maskar och trojaner, nyttolaster från ransomware till rootkits, och vad som gör en APT ihärdig.",
  sources: ["Stallings & Brown kap. 6 (s. 293–371)"],
  body: `
## Kärnan

- **Malware** är program som förs in i ett system, oftast i smyg, för att skada confidentiality, integrity eller availability.
- Boken delar in malware på två sätt: **hur den sprids** (tre sätt) och **vad den gör** hos målet (fyra sorters nyttolast).
- **Tre spridningssätt:** infekterat innehåll (virus), utnyttjade sårbarheter (maskar) och social engineering (spam och trojaner).
- **Fyra sorters nyttolast:** system corruption, attack agent, information theft och stealthing.
- **Virus klassas på två axlar:** vad de infekterar och hur de gömmer sig.
- **En APT är ingen egen sorts malware** utan ihärdiga, välfinansierade angrepp mot utvalda mål.

## Två indelningar: spridning och nyttolast

Termerna för malware överlappar, så boken sorterar i två steg. Först **propagation**, hur malware tar sig fram till målet:

| Spridningssätt | Typiska exempel |
|---|---|
| **Infected content** | virus som fäster vid körbart innehåll |
| **Vulnerability exploit** | maskar och drive-by-downloads som utnyttjar sårbarheter |
| **Social engineering** | spam och trojaner som lurar användaren att hjälpa till |

Sedan **payload** (nyttolast), vad malware gör när den har kommit fram:

| Nyttolast | Exempel | Hotar främst |
|---|---|---|
| **System corruption** | förstörda data, ransomware, fysisk skada | integrity |
| **Attack agent** | datorn blir en bot (zombie) i ett botnet | integrity och availability |
| **Information theft** | keyloggers, phishing, spyware | confidentiality |
| **Stealthing** | backdoors och rootkits som döljer intrånget | integrity |

Två äldre indelningar dyker också upp: om malware behöver ett **värdprogram** (virus) eller är fristående (maskar, trojaner, bots), och om den **kopierar sig själv** (virus, maskar) eller inte (trojaner, spam).

Dagens malware är ofta en **blended attack**, som kombinerar flera spridningssätt och nyttolaster. Med ett **attack kit** (crimeware) kan även nybörjare sätta ihop sin egen.

## Virus: delar och faser

Ett **virus** är kod som fäster sig vid något körbart: ett program, koden som startar datorn eller makron i ett dokument. När värden körs, körs viruset i hemlighet. Det kan då göra allt som användaren har rätt att göra, och kopiera sig vidare.

Viruset har **tre delar**:

| Del | Vad den är |
|---|---|
| **Infection mechanism** (infection vector) | hur viruset sprids och kopierar sig |
| **Trigger** | händelsen eller villkoret som avgör när nyttolasten släpps; kallas ibland logic bomb |
| **Payload** | vad viruset gör utöver att spridas, från ett ofarligt meddelande till förstörda filer |

Viruset går igenom **fyra faser**:

1. **Dormant:** viruset vilar och väntar på en händelse, till exempel ett datum. Alla virus har inte den fasen.
2. **Propagation:** viruset lägger kopior av sig själv i andra program eller systemområden. Kopiorna behöver inte vara identiska.
3. **Triggering:** viruset aktiveras.
4. **Execution:** nyttolasten körs.

Maskar går igenom samma fyra faser.

## Hur virus klassas

Boken klassar virus längs två oberoende axlar. Den första är **målet**, alltså vad viruset infekterar:

| Typ | Infekterar |
|---|---|
| **Boot sector infector** | master boot record eller boot record; sprids när datorn startas från den infekterade disken |
| **File infector** | filer som operativsystemet räknar som körbara, alltså program |
| **Macro virus** | makro- eller skriptkod i dokument, till exempel Word-, Excel- och PDF-filer |
| **Multipartite virus** | flera sorters filer på flera sätt, så alla ställen måste rensas |

File infector var svaret på en av förra årets tentafrågor: viruset fäster vid ett legitimt program och sprids när programmet körs. Bilden om The Hack Apocalyps (se Föreläsning 2) ger Excel som exempel på file infector, men enligt boken är virus i dokument som Excel-filer **macro virus**. Följ boken på tentan.

Makrovirus blev i mitten av 1990-talet den vanligaste sortens virus. De är särskilt farliga: de fungerar på alla plattformar där programmet finns, sprids med dokument som delas hela tiden (ofta via e-post), är lätta att skriva och hejdas inte av vanlig åtkomstkontroll: användarna ska ju kunna ändra sina dokument.

Den andra axeln är **hur viruset gömmer sig**:

| Typ | Hur |
|---|---|
| **Encrypted virus** | krypterar större delen av sig själv med en ny slumpnyckel för varje kopia, så inget fast bitmönster finns |
| **Stealth virus** | byggt för att gömma hela viruset för antivirusprogram, till exempel med kompression eller rootkit-tekniker |
| **Polymorphic virus** | gör kopior som fungerar likadant men har olika bitmönster, så signaturen varierar; delen som gör om koden kallas mutation engine |
| **Metamorphic virus** | skriver om sig själv helt vid varje infektion och kan ändra både utseende och beteende |

Polymorphic byter alltså **utseende** men gör samma sak. Metamorphic kan byta **både utseende och beteende**.

## Maskar och drive-by-downloads

En **worm** (mask) är ett fristående program som **själv letar upp** nya datorer att infektera. Varje infekterad dator blir en språngbräda för nya attacker. Masken utnyttjar sårbarheter i klient- eller serverprogram och tar sig fram via nätverket, e-post, delade filer och USB-minnen, fjärrinloggning eller fjärrkörning. Sökandet efter nya mål kallas **scanning**.

| | Virus | Worm |
|---|---|---|
| Värdprogram | behövs; viruset är parasitiskt | behövs inte; masken kör självständigt |
| Spridning | när någon kör den infekterade koden | masken söker själv upp nya maskiner |

**Zero-day exploit:** för att överraska så mycket som möjligt utnyttjar masken en okänd sårbarhet, som omvärlden upptäcker först när masken släpps. Ingen har då hunnit skydda sig. Det var svaret på en av förra årets tentafrågor. Stuxnet, som upptäcktes 2010 och angrep industriella styrsystem, använde fyra zero-day exploits.

**Drive-by-download:** kod på en kapad webbplats utnyttjar en sårbarhet i webbläsaren eller ett tillägg och installerar malware när sidan visas, utan att användaren vet om det. Skillnaden mot en mask: en drive-by-download sprider sig inte aktivt, utan **väntar** på att användare besöker sidan. En **watering-hole attack** är en riktad variant, där angriparen kapar sajter som de utvalda offren brukar besöka.

## Social engineering: spam och trojaner

Det tredje spridningssättet lurar användaren att själv hjälpa till.

- **Spam** är oönskad massutskickad e-post, i dag oftast skickad av botnät. Den kan bära bilagor med malware, trojaner eller länkar till phishing.
- En **Trojan horse** är ett program som är, eller ser ut att vara, användbart men har dold kod som gör något oönskat när det körs (se Föreläsning 2). Ett vanligt exempel är program som utger sig för att vara antivirus. Trojanen kan behålla programmets funktion och göra något skadligt vid sidan om, ändra funktionen eller ersätta den helt.

En trojan kan installera sig genom en sårbarhet, som en mask, men **trojaner kopierar sig inte själva**. På mobiler sprids det mesta skadliga som trojanska appar. Försvaret mot social engineering är främst medvetenhet och utbildning.

## Nyttolasterna

**System corruption:**

- **Ransomware** krypterar användarens data och kräver betalning för nyckeln. WannaCry (2017) spreds som en mask till mer än 150 länder och krävde lösen i Bitcoin. Utan bra backup och incidentplan går data sällan att få tillbaka.
- **Real-world damage:** Stuxnet bytte ut styrkoden i industriell utrustning så att den kördes utanför sitt normala arbetsområde och gick sönder.
- **Logic bomb:** kod i malware som "exploderar" när ett villkor uppfylls, till exempel ett datum, att en viss fil finns eller saknas, eller att en viss användare kör programmet.

**Attack agent:** datorn blir en **bot** (zombie) som angriparen använder för attacker som är svåra att spåra. Många bots som styrs tillsammans är ett **botnet**. Det används till DDoS-attacker, spam, klickbedrägerier och att sprida malware vidare. Det som skiljer en bot från en mask är fjärrstyrningen: masken sprider och startar sig själv, boten styrs från en **command-and-control-server** (C&C).

**Information theft:**

| Term | Vad den gör |
|---|---|
| **Keylogger** | fångar tangenttryckningar, ofta bara kring ord som "login" och "password" |
| **Spyware** | övervakar mer: surfande, omdirigering till falska sidor, ändrade data |
| **Phishing** | e-post som utger sig för att komma från en betrodd källa och lockar till en falsk inloggningssida; går brett till många, ofta via botnät |
| **Spear-phishing** | samma bedrägeri, men mottagaren är noga utforskad och mejlet skräddarsytt för just hen; används vid spionage och bedrägerier |

Skillnaden mellan phishing och spear-phishing gäller alltså **vem** som är målet. När data förs ut obehörigt kallas det **data exfiltration**.

**Stealthing:**

- En **backdoor** (trapdoor) är en hemlig ingång förbi de vanliga säkerhetskontrollerna. Utvecklare har använt sådana för felsökning (maintenance hook); i dag är det ofta en nätverkstjänst på en ovanlig port.
- Ett **rootkit** är program som ger dold åtkomst med administratörs- eller root-rättigheter och döljer sina spår så långt det går. Rootkits har flyttat allt längre ner: **user mode**, **kernel mode**, **virtual machine based** och **external mode** (BIOS eller UEFI). Ju lägre nivå, desto svårare att upptäcka. Ett rootkit kan också vara **persistent** (startar vid varje uppstart) eller **memory based** (försvinner vid omstart men är svårare att hitta).

## APT och motåtgärder

En **advanced persistent threat (APT)** är välfinansierade, ihärdiga angrepp med många olika tekniker och sorters malware mot utvalda mål, oftast företag eller politiska mål. Bakom står ofta statligt sponsrade organisationer. Namnet ord för ord:

| Ord | Betyder |
|---|---|
| **Advanced** | ett brett urval av intrångstekniker och malware, egenutvecklad vid behov; delarna är noga valda för målet men inte nödvändigtvis tekniskt avancerade |
| **Persistent** | angreppen pågår målmedvetet under lång tid mot det valda målet, tills de lyckas |
| **Threat** | angriparna är organiserade, kapabla och välfinansierade, och människor är aktivt inblandade |

Typiska grepp är spear-phishing, drive-by-downloads från kapade sajter och angrepp via leverantörskedjan (supply chain).

**Motåtgärder.** Bäst är att stoppa malware innan den kommer in. Enligt NIST har förebyggandet fyra delar: policy, awareness, vulnerability mitigation och threat mitigation. I praktiken: patcha systemen, begränsa åtkomsten och utbilda användarna. Misslyckas det följer **detection** (upptäck infektionen), **identification** (vilken malware?) och **removal** (ta bort alla spår, eller återställ från en ren backup).

Skyddet kan sitta på tre ställen: på varje dator (host-based antivirus), vid nätverksgränsen (brandvägg och IDS, som båda finns i data center-modellen i Föreläsning 2) och i distribuerade system som samlar data från många sensorer. Antivirus har utvecklats i fyra generationer:

| Generation | Hur den hittar malware |
|---|---|
| 1. Simple scanners | kända signaturer (bitmönster) |
| 2. Heuristic scanners | regler för trolig malware, och integritetskontroll med checksummor |
| 3. Activity traps | vad programmet gör, inte hur det ser ut |
| 4. Full-featured protection | flera tekniker tillsammans, plus åtkomstkontroll |
`,
};

export const topic = {
  id: "bok6-malware",
  name: "Malicious software: virus, maskar och nyttolaster",
  chapter: "bok6",
  examWeight: "hög",
  summary: "Boken delar in malware efter hur den sprids (virus genom infekterat innehåll, maskar genom sårbarheter, spam och trojaner genom social engineering) och vad den gör hos målet (system corruption, attack agent, information theft, stealthing). Virus klassas efter vad de infekterar och hur de gömmer sig. En APT är ihärdiga, välfinansierade angrepp mot utvalda mål.",
  keyPoints: [
    "Tre spridningssätt: infected content (virus), vulnerability exploit (maskar), social engineering (spam, trojaner).",
    "Fyra sorters nyttolast: system corruption (bl.a. ransomware), attack agent (bots), information theft, stealthing (backdoors, rootkits).",
    "Virusets tre delar: infection mechanism, trigger och payload.",
    "Virusets fyra faser: dormant, propagation, triggering och execution; maskar har samma.",
    "Virus efter mål: boot sector infector, file infector, macro virus och multipartite virus.",
    "Polymorphic mot metamorphic: nytt bitmönster men samma beteende, eller helt omskriven kod som kan bete sig annorlunda.",
    "Worm: fristående program som själv söker upp nya maskiner att infektera.",
    "Zero-day exploit: utnyttjar en sårbarhet som är okänd tills attacken startar.",
    "APT: advanced (noga valda verktyg), persistent (ihärdigt under lång tid), threat (organiserade, välfinansierade angripare).",
  ],
  pitfalls: [
    "Virus i dokument som Excel-filer är macro virus i boken, inte file infector, även om bilden i Föreläsning 2 säger det.",
    "Ett virus behöver ett värdprogram och sprids när någon kör det; en mask söker själv upp nya maskiner; en bot styrs från en C&C-server.",
    "Polymorphic byter bitmönster men gör samma sak; metamorphic skriver om sig helt och kan byta beteende; encrypted krypterar sig med ny nyckel per kopia.",
    "Persistent i APT betyder ihärdiga angrepp under lång tid; ett persistent rootkit är ett som startar vid varje uppstart.",
    "Phishing går brett till många, ofta via botnät; spear-phishing är skräddarsydd för noga utforskade mottagare.",
  ],
};

export const glossary = [
  { term: "Malware", definition: "Malicious software: program som förs in i ett system, oftast i smyg, för att hota confidentiality, integrity eller availability hos offrets data, program eller operativsystem.", chapter: "bok6" },
  { term: "Payload", definition: "Det malware gör hos målet utöver att spridas. Boken har fyra sorter: system corruption, attack agent, information theft och stealthing.", chapter: "bok6" },
  { term: "Virus", definition: "Malware som fäster vid körbart innehåll (program, startkod eller makron i dokument) och körs när värden körs. Sprids genom infekterat innehåll.", chapter: "bok6" },
  { term: "Worm", definition: "Fristående program som själv söker upp nya maskiner att infektera, oftast genom att utnyttja sårbarheter. Behöver till skillnad från ett virus inget värdprogram.", chapter: "bok6" },
  { term: "Macro virus", definition: "Virus i makro- eller skriptkod i dokument, till exempel Word- och Excel-filer. Fungerar på alla plattformar där programmet finns och sprids när dokument delas.", chapter: "bok6" },
  { term: "Boot sector infector", definition: "Virus som infekterar master boot record eller boot record och sprids när datorn startas från den infekterade disken.", chapter: "bok6" },
  { term: "Polymorphic virus", definition: "Virus som gör kopior som fungerar likadant men har olika bitmönster, så att signaturen varierar. Delen som gör om koden kallas mutation engine.", chapter: "bok6" },
  { term: "Metamorphic virus", definition: "Virus som skriver om sig själv helt vid varje infektion och kan ändra både utseende och beteende.", chapter: "bok6" },
  { term: "Zero-day exploit", definition: "Attack som utnyttjar en sårbarhet som är okänd tills attacken startar, så att ingen har hunnit skydda sig mot den.", chapter: "bok6" },
  { term: "Drive-by-download", definition: "Kod på en kapad webbplats som utnyttjar en sårbarhet i webbläsaren och installerar malware när sidan visas. Sprider sig inte själv som en mask.", chapter: "bok6" },
  { term: "Logic bomb", definition: "Kod i malware som ligger vilande tills ett villkor uppfylls, till exempel ett visst datum eller att en viss fil saknas, och då släpper nyttolasten.", chapter: "bok6" },
  { term: "Ransomware", definition: "Malware som krypterar användarens data och kräver betalning för nyckeln. I boken en sorts system corruption.", chapter: "bok6" },
  { term: "Spear-phishing", definition: "Phishing riktad mot noga utforskade mottagare, med mejl skräddarsydda för var och en. Används vid spionage och bedrägerier.", chapter: "bok6" },
  { term: "Rootkit", definition: "Program som ger angriparen dold åtkomst med administratörs- eller root-rättigheter och döljer sina spår. Finns på allt lägre nivåer: user mode, kernel mode, virtual machine och external mode.", chapter: "bok6" },
  { term: "Advanced persistent threat (APT)", definition: "Välfinansierade, ihärdiga angrepp med många tekniker mot utvalda mål, ofta statligt sponsrade. Ingen egen sorts malware utan ett sätt att angripa.", chapter: "bok6" },
];

const T = "bok6-malware";

export const questions = [
  { id: "sak-bok6-v11", topic: T, difficulty: 1, ...variant("sak-11", "virusklassning efter mål"),
    question: "A virus that infects the master boot record and spreads when the computer is started from the infected disk is called a:",
    options: [
      { text: "File infector virus", explain: "Ett file infector virus infekterar körbara program och sprids när programmet körs, inte när datorn startas." },
      { text: "Multipartite virus", explain: "Ett multipartite virus infekterar flera sorters filer på flera sätt, inte bara startkoden." },
      { text: "Boot sector infector", explain: "Viruset sitter i master boot record eller boot record och sprids när datorn startas från disken." },
      { text: "Macro or scripting virus", explain: "Ett macro virus infekterar makro- eller skriptkod i dokument, som Word- och Excel-filer." }
    ],
    correct: 2, reviewed: false },

  { id: "sak-bok6-v09", topic: T, difficulty: 2, ...variant("sak-09", "zero-day exploit"),
    question: "A worm exploits a vulnerability that nobody knew about until the worm was launched. What does the book call this?",
    options: [
      { text: "Zero-day exploit", explain: "Sårbarheten är okänd tills attacken startar, så ingen har hunnit skydda sig mot den." },
      { text: "Drive-by-download", explain: "En drive-by-download utnyttjar en sårbarhet i webbläsaren när någon besöker en kapad sida, och sprider sig inte själv." },
      { text: "Blended attack", explain: "En blended attack kombinerar flera spridningssätt och nyttolaster; den säger inget om att sårbarheten är okänd." },
      { text: "Watering-hole attack", explain: "En watering-hole attack är en riktad drive-by-download på sajter som de utvalda offren brukar besöka." }
    ],
    correct: 0, reviewed: false },

  { id: "sak-bok6-01", topic: T, difficulty: 2,
    question: "Which of these is NOT one of the book's three broad ways in which malware propagates?",
    options: [
      { text: "Infected content", explain: "Det första spridningssättet: virus som fäster vid körbart innehåll." },
      { text: "Vulnerability exploit", explain: "Det andra spridningssättet: maskar och drive-by-downloads som utnyttjar sårbarheter." },
      { text: "Social engineering", explain: "Det tredje spridningssättet: spam och trojaner som lurar användaren att hjälpa till." },
      { text: "Information theft", explain: "Information theft är en av de fyra sorternas nyttolast, alltså vad malware gör hos målet, inte hur den sprids." }
    ],
    correct: 3, source: "Bokens kapitel 6 (spridningssätt)", reviewed: false },

  { id: "sak-bok6-02", topic: T, difficulty: 1,
    question: "What mainly distinguishes a worm from a virus?",
    options: [
      { text: "A worm must attach itself to a host program", explain: "Det är viruset som är parasitiskt och fäster vid ett värdprogram; masken kör självständigt." },
      { text: "A worm actively seeks out new machines to infect", explain: "Masken är ett fristående program som själv letar upp nya maskiner, ofta genom att utnyttja sårbarheter." },
      { text: "A worm is controlled from a command-and-control server", explain: "Det är fjärrstyrningen som skiljer en bot från en mask; masken sprider och startar sig själv." },
      { text: "A worm only spreads in documents that contain macros", explain: "Det låter som ett macro virus. Maskar sprids via nätverket, e-post, delade filer och USB-minnen." }
    ],
    correct: 1, source: "Bokens kapitel 6 (mask mot virus)", reviewed: false },

  { id: "sak-bok6-03", topic: T, difficulty: 3,
    question: "How does a metamorphic virus differ from a polymorphic virus?",
    options: [
      { text: "It encrypts its body with a new random key for every copy", explain: "Det beskriver ett encrypted virus. Polymorfiska virus kan också använda kryptering, så det skiljer inte de två åt." },
      { text: "It infects several types of files in several ways", explain: "Det är ett multipartite virus, en klassning efter mål, inte efter hur viruset gömmer sig." },
      { text: "It changes its bit pattern but keeps the same behavior", explain: "Det beskriver det polymorfiska viruset: kopior som fungerar likadant men ser olika ut." },
      { text: "It rewrites itself completely and can change its behavior", explain: "Det metamorfiska viruset skriver om sig helt vid varje infektion och kan byta både utseende och beteende." }
    ],
    correct: 3, source: "Bokens kapitel 6 (virusklassning efter hur viruset gömmer sig)", reviewed: false },

  { id: "sak-bok6-04", topic: T, difficulty: 2,
    question: "In an advanced persistent threat (APT), what does \"persistent\" refer to?",
    options: [
      { text: "Determined attacks on a chosen target over a long period", explain: "Angreppen pågår målmedvetet, ofta i smyg, mot det valda målet tills de lyckas." },
      { text: "Malware that survives reboots by storing its code on disk", explain: "Det beskriver ett persistent rootkit, som startar vid varje uppstart. I APT gäller ordet angriparnas uthållighet." },
      { text: "A wide range of intrusion tools, custom-made if needed", explain: "Det är vad advanced betyder i APT." },
      { text: "Malware that copies itself to as many hosts as it can", explain: "Det låter som en mask. En APT gör tvärtom och väljer sina mål noga." }
    ],
    correct: 0, source: "Bokens kapitel 6 (advanced persistent threat)", reviewed: false },

  { id: "sak-bok6-05", topic: T, difficulty: 2,
    question: "What makes spear-phishing different from ordinary phishing?",
    options: [
      { text: "It is sent to huge numbers of users, often via a botnet", explain: "Det beskriver vanlig phishing, som räknar med att några av de många mottagarna nappar." },
      { text: "It installs malware through a browser flaw when a page is viewed", explain: "Det är en drive-by-download, som inte kräver något mejl alls." },
      { text: "Each e-mail is crafted for a carefully researched recipient", explain: "Angriparen utforskar mottagaren och skräddarsyr mejlet, ofta för spionage eller bedrägerier." },
      { text: "It records the victim's keystrokes to capture passwords", explain: "Det gör en keylogger, en annan sorts informationsstöld." }
    ],
    correct: 2, source: "Bokens kapitel 6 (phishing och spear-phishing)", reviewed: false },

  { id: "sak-bok6-06", topic: T, difficulty: 2,
    question: "Ransomware encrypts the victim's files and demands payment for the key. Which of the book's payload categories does it belong to?",
    options: [
      { text: "Information theft payload", explain: "Information theft samlar in data åt angriparen, som keyloggers och spyware gör. Ransomware låser data i stället." },
      { text: "System corruption payload", explain: "Boken lägger ransomware under system corruption, bredvid annan dataförstörelse." },
      { text: "Attack agent payload", explain: "Attack agent gör datorn till en bot som angriparen fjärrstyr." },
      { text: "Stealthing payload", explain: "Stealthing döljer att systemet är infekterat, med backdoors och rootkits." }
    ],
    correct: 1, source: "Bokens kapitel 6 (nyttolaster)", reviewed: false },
  { id: "sak-bok6-07", topic: "bok6-malware", difficulty: 1,
    question: "What distinguishes a Trojan horse from a virus or a worm?",
    options: [
      { text: "It does not replicate itself; it relies on tricking the user", explain: "En trojan ser användbar ut men har dold skadlig kod. Den sprids genom social engineering och kopierar sig inte själv." },
      { text: "It needs a host program to attach itself to before spreading", explain: "Det beskriver ett virus, som infekterar ett värdprogram eller ett dokument." },
      { text: "It spreads on its own by exploiting network vulnerabilities", explain: "Det beskriver en mask, som söker upp och angriper nya system själv." },
      { text: "It changes its own code completely with every new infection", explain: "Det beskriver ett metamorphic virus." },
    ],
    correct: 0, source: "Bokens kapitel 6 (trojaner och social engineering)", reviewed: false },

  { id: "sak-bok6-08", topic: "bok6-malware", difficulty: 1,
    question: "Malware that records keystrokes to steal passwords belongs to which of the book's payload categories?",
    options: [
      { text: "System corruption payload", explain: "System corruption förstör eller låser data och system, till exempel ransomware." },
      { text: "Attack agent payload", explain: "Attack agent gör den smittade datorn till en bot som angriparen styr, till exempel i en DDoS-attack." },
      { text: "Information theft payload", explain: "Keyloggers, phishing och spyware stjäl uppgifter som lösenord. De hotar confidentiality." },
      { text: "Stealthing payload", explain: "Stealthing döljer intrånget, med backdoors och rootkits." },
    ],
    correct: 2, source: "Bokens kapitel 6 (nyttolasterna)", reviewed: false },
];

export const notes = `
Byggt på del1-filen, s. 293–371 (s. 293–298 är en dubblerad kapitelöppning), med Key Terms och Review Questions 6.1–6.16 som rättesnöre. Sidnumren är textfilens "Page N of 1641", inte bokens tryckta sidor.

Osäkert / att granska:
- Excel: Föreläsning 2:s bild kallar virus i Excel för file infector, boken för macro virus. Kapitlet följer boken och hänvisar till Föreläsning 2. Jag gjorde medvetet ingen fråga om Excel-virus, eftersom lärarens egen bild säger något annat och en tentafråga ur bilden kan ha file infector som "rätt".
- Zero-day: boken säger att sårbarheten är okänd tills masken släpps. "Ingen har hunnit skydda sig" är en slutsats av det, inte bokens ordalydelse (boken säger inte uttryckligen att patch saknas).
- sak-bok6-06: alternativen har " payload" som gemensamt efterled för att klara längdregeln (utan det blir spridningen 1,7). Rätt svar är delat längst (med Information theft), längdkvot 1,19.
- Textfilen har dubbletter (Multipartite virus två gånger, Logic bomb-raden två gånger i tabell 6.1); bara textfelet, inget innehållsproblem.
- Botnet och zombie står också bland kapitel 7:s Key Terms (DoS). Jag lät dem stå i löptexten men inte i ordlistan, så att kapitel 7 kan ta dem.

Medvetet utelämnat: spridningsmodellen för maskar (ekvationen), Morris-masken och maskhistoriken (Melissa, Code Red, Nimda, Slammer m.fl. utom Stuxnet och WannaCry), skanningsstrategierna (random, hit-list, topological, local subnet), mobile code, mobilmaskar, clickjacking, malvertising, Melissas pseudokod, rootkits systemanropstabell och virtuella rootkits i detalj, sandbox-analys, host-based dynamic analysis, ingress/egress monitors, kraven på motåtgärder (generality, timeliness …), spyware- och rootkit-motåtgärder. Ordlistan stannar på 15 termer; backdoor, keylogger, spyware, stealth virus, watering-hole attack, data exfiltration, blended attack och attack kit förklaras bara i löptexten.
`;
