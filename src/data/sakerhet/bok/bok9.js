// Bokens kapitel 9: Stallings & Brown, Firewalls and Intrusion Prevention
// Systems (s. 481–540; virtual firewall efter kap. 12, s. ~702). Kapitel,
// ämne, ordlista och frågor; samlas via bok/index.js. Skrivet med egna ord
// på tentans nivå, granskat mot boken 22 nov 2026 (ogranskat av Kasper).
// `notes` är källanteckningarna och visas inte.

const variant = (id, what) => ({ variantOf: id, source: `Variant av en tentafråga från förra året (${what})` });

export const chapter = {
  id: "bok9",
  kind: "bok",
  label: "Bokens kapitel 9",
  examArea: "Bokfrågor",
  title: "Firewalls och intrusion prevention",
  readingMinutes: 11,
  lead: "Varför en organisation sätter en brandvägg vid gränsen, vad den klarar och inte klarar, de fyra typerna, var den kan sitta och hur en IPS och en UTM bygger vidare på den.",
  sources: [
    "Stallings & Brown kap. 9 (s. 481–540)",
    "Stallings & Brown kap. 12.8, Virtual Firewall (s. 702)",
  ],
  body: `
## Kärnan

- **En brandvägg är en gräns mellan säkerhetsdomäner,** till exempel mellan företagets nät och internet, och en enda kontrollpunkt för trafiken.
- **Tre designmål:** all trafik går genom brandväggen, bara tillåten trafik släpps igenom, och brandväggen själv går inte att bryta sig igenom.
- **Brandväggen har gränser:** den skyddar inte mot trafik som går förbi den, inte fullt ut mot insiders och inte mot smittade enheter som bärs in.
- **Fyra typer** skiljer sig i vad de tittar på: enskilda paket, förbindelser eller applikationens innehåll.
- **Brandväggen kan sitta på olika ställen,** även virtuellt, och ofta finns en DMZ mellan en extern och en intern brandvägg.
- **En IPS är en IDS som också kan blockera,** och en UTM samlar många skydd i en enda låda.

## Varför brandväggar behövs

Organisationer måste vara uppkopplade mot internet, men samma uppkoppling låter omvärlden nå deras egna system. Att skydda varje dator för sig (**host-based security**) betyder att hundratals eller tusentals maskiner måste uppdateras så fort en brist upptäcks. Det är svårt och inte alltid kostnadseffektivt.

En **firewall** (brandvägg) är komplementet. Den sätts mellan det interna nätet och internet och bildar en yttre mur, en **perimeter**. Mer allmänt är en brandvägg enligt boken "a boundary system that separates different security domains", alltså en gräns mellan säkerhetsdomäner, både inom och mellan organisationer. Det var svaret på en av förra årets tentafrågor.

- Brandväggen ger en enda passage, en **choke point**, där skydd och loggning kan samlas.
- Den är ett extra lager i **defense in depth**, ingen ersättning för skyddet på varje maskin.

I Föreläsning 2 ligger brandväggen (NGFW, next-generation firewall) och IDS/IPS i data center-modellens nätverkslager.

## Designmål och access policy

Boken anger tre **design goals** för en brandvägg:

1. **All trafik** mellan insidan och utsidan, åt båda hållen, går genom brandväggen. Andra vägar in i nätet blockeras fysiskt.
2. **Bara auktoriserad trafik** släpps igenom, enligt organisationens lokala säkerhetspolicy.
3. **Brandväggen själv är immun mot intrång.** Den körs på ett härdat system med ett säkrat operativsystem.

Vad som räknas som auktoriserat står i brandväggens **access policy**: vilka adressintervall, protokoll, applikationer och innehållstyper som får passera. Den ska bygga på organisationens riskbedömning och säkerhetspolicy (se Föreläsning 2).

Riktlinjerna **NIST SP 800-41** räknar upp fyra egenskaper som policyn kan filtrera på:

| Egenskap | Vad brandväggen tittar på |
|---|---|
| **IP address and protocol values** | adresser, portnummer och riktning (packet filter och stateful inspection) |
| **Application protocol** | innehållet i applikationstrafiken, till exempel e-post som granskas efter spam (application-level gateway) |
| **User identity** | vem användaren är, när den loggat in med säker autentisering |
| **Network activity** | mönster som tid på dygnet eller antal anrop, till exempel för att upptäcka skanning |

## Vad brandväggen klarar och inte klarar

**Det brandväggen kan:**

- hålla obehöriga utanför det skyddade nätet vid en enda choke point
- hindra sårbara tjänster från att nås utifrån eller nå ut, och skydda mot vissa sorters förfalskade adresser (**IP address spoofing**)
- vara platsen för loggning, larm och övervakning
- bära funktioner som inte rör säkerhet, som adressöversättning (NAT), och vara plattform för en VPN

**Det brandväggen inte kan:**

- stoppa attacker som **går förbi** den, till exempel via en intern dator med eget mobilt bredband eller en direktförbindelse till en partnerorganisation
- skydda fullt ut mot **interna hot:** en missnöjd anställd, eller en anställd som omedvetet hjälper en angripare
- skydda ett dåligt säkrat **trådlöst nät**, som kan nås utifrån och där trafiken kan gå förbi en intern brandvägg
- stoppa en **bärbar dator eller ett USB-minne** som smittats utanför nätet och sedan kopplas in innanför

Förra årets tentor frågade vad en brandvägg främst skyddar mot. Svaret var obehörig åtkomst till ett privat nät, inte insiders, svaga lösenord eller skadlig kod som redan är installerad.

## Fyra typer av brandväggar

| Typ | Vad den gör | För- och nackdelar |
|---|---|---|
| **Packet filtering firewall** | jämför varje IP-paket för sig med en regellista: adresser, portar, protokoll och gränssnitt | enkel och snabb, men ser inte applikationsdata, loggar lite och är lätt att konfigurera fel |
| **Stateful packet inspection firewall** | som ett paketfilter, men för också en tabell över de TCP-förbindelser som är etablerade | släpper bara in paket som hör till en förbindelse i tabellen |
| **Application-level gateway**, även **application proxy** | förmedlar trafiken för en viss applikation. Användaren autentiserar sig, och bara applikationer som gatewayen har proxykod för går igenom. | säkrare än paketfilter, kan stänga av enskilda funktioner och loggar lätt, men varje förbindelse kräver mer bearbetning |
| **Circuit-level gateway**, även circuit-level proxy | sätter upp två TCP-förbindelser, en åt vardera hållet, och förmedlar data mellan dem utan att granska innehållet | säkerheten ligger i vilka förbindelser som tillåts |

**Paketfilter och stateful.** Ett paketfilter bedömer varje paket isolerat och måste därför lämna många portar öppna för att svaren på interna förbindelser ska komma in. En stateful brandvägg minns förbindelserna och släpper bara in det som passar en av dem.

**Standardregeln.** Matchar ett paket ingen regel gäller en standardregel:

- **Default = discard:** det som inte uttryckligen är tillåtet är förbjudet. Försiktigast, och vad företag och myndigheter brukar välja.
- **Default = forward:** det som inte uttryckligen är förbjudet är tillåtet. Enklare för användarna, men sämre skydd.

**Två attacker mot paketfilter:** vid IP address spoofing får paket utifrån en intern avsändaradress, och vid en **tiny fragment attack** delas paketet i så små bitar att TCP-huvudet hamnar i en egen bit och slipper reglerna.

**Application-level och circuit-level.** Båda delar förbindelsen i två, men bara application-level gatewayen granskar innehållet. Litar administratören på de interna användarna kan man använda circuit-level för utgående trafik och application-level för inkommande.

## Var brandväggen sitter

Boken kallar det **firewall basing**:

| Basing | Vad det är |
|---|---|
| **Bastion host** | ett härdat system som administratören pekat ut som en kritisk stark punkt i nätet. Kör bara nödvändiga tjänster, ofta proxyer för application- eller circuit-level gateways, och loggar all trafik. |
| **Host-based firewall** | ett program som skyddar en enskild värd, ofta en server, med regler anpassade efter den. Skyddar oavsett om attacken kommer inifrån eller utifrån. |
| **Personal firewall** | skyddar en enskild dator mot internet eller företagets nät. Nekar obehörig åtkomst utifrån och kan bevaka utgående trafik efter skadlig kod. |
| **Network device firewall** | packet filtering och stateful inspection i routrar och switchar |
| **Virtual firewall** | brandväggsfunktioner i en virtualiserad miljö (se nedan) |

**Virtual firewall.** När servrar körs som virtuella maskiner på samma fysiska hårdvara går trafiken mellan dem aldrig ut på det fysiska nätet, så en extern brandvägg ser den inte. En **virtual firewall** ger brandväggsskydd åt trafiken mellan system i en virtualiserad miljö eller i molnet, utan att trafiken måste skickas ut till ett fysiskt separat nät med en traditionell brandvägg. Det var svaret på en av förra årets tentafrågor, där de felaktiga alternativen var ihopklippta av andra meningar, så läs varje alternativ till slutet.

Skyddet kan ligga i en egen virtuell maskin som fungerar som bastion host (**VM bastion host**), i gästoperativsystemets egen brandvägg (**VM host-based firewall**) eller direkt i hypervisorn (**hypervisor firewall**). Hypervisorvarianten kan vara säkrare än de andra, eftersom den varken är en del av det virtuella nätet eller syns som en egen maskin.

## DMZ, extern och intern brandvägg

En vanlig uppställning har två brandväggar:

| Del | Vad den gör |
|---|---|
| **External firewall** | sitter vid nätets kant, innanför routern mot internet. Ger systemen i DMZ:n det skydd som passar deras behov av att nås utifrån, och ger resten av nätet ett grundskydd. |
| **Demilitarized zone (DMZ)** | nätsegmentet mellan brandväggarna. Här står system som måste nås utifrån men ändå behöver skydd: företagets webbplats, e-postserver och DNS-server. |
| **Internal firewall** | skyddar huvuddelen av det interna nätet |

Den interna brandväggen har tre uppgifter:

1. Den filtrerar **hårdare** än den externa.
2. Den skyddar **åt båda hållen** mot DMZ:n: det interna nätet mot en DMZ-server som tagits över av skadlig kod, och DMZ:n mot attacker inifrån.
3. Flera interna brandväggar kan skydda **delar av det interna nätet** från varandra, till exempel servrarna från arbetsstationerna.

Två begrepp till hör hit:

- **Virtual private network (VPN):** datorer som förbinds över ett osäkert nät, som internet, med kryptering och autentisering, oftast IPSec. Brandväggen är en naturlig plats för krypteringen; sker den bakom brandväggen ser brandväggen bara krypterad trafik och kan inte filtrera den.
- **Distributed firewall:** fristående brandväggar plus host-based och personal firewalls som styrs centralt. De skyddar också mot attacker inifrån.

## Intrusion prevention och UTM

En **intrusion detection system (IDS)** upptäcker misstänkt aktivitet och larmar (se kapitlet om intrusion detection). En **intrusion prevention system (IPS)**, även kallad IDPS, är en IDS som dessutom försöker **blockera eller förhindra** det den upptäcker. Precis som en IDS kan den använda **anomaly detection** (beteende som avviker från legitima användares) eller **signature/heuristic detection** (känt skadligt beteende).

| Typ | Vad den gör |
|---|---|
| **Host-based IPS (HIPS)** | sitter på en enskild värd och granskar bland annat systemanrop, filåtkomst och registret. Fångar till exempel rootkits, privilege escalation och buffer overflow, och kan köra misstänkt kod i en **sandbox**. |
| **Network-based IPS (NIPS)** | i princip en nätverksbaserad IDS i trafikflödet (inline) som får ändra eller kasta paket och bryta TCP-förbindelser |
| **Distributed or hybrid IPS** | sensorer på många värdar och i nätet skickar data till en central analys, som skickar tillbaka uppdaterade signaturer till alla system |

En NIPS blockerar trafik som en brandvägg men avgör när med samma metoder som en IDS. En HIPS ersätter inte skyddet i nätet utan är ett lager bland andra, tillsammans med brandväggar eller en NIPS.

**Unified threat management (UTM).** Många separata produkter (brandvägg, IDS, IPS, VPN, antivirus, spamfilter) är krångliga att sköta, och enheter i rad gör trafiken långsammare. En UTM ersätter dem med en enda enhet, som minst ska klara brandväggsfiltrering, intrusion detection och prevention och antivirus. Den stora nackdelen är prestandan. Skillnaden mot en brandvägg är att brandväggen bara är en av UTM:ens funktioner.
`,
};

export const topic = {
  id: "bok9-firewall",
  name: "Firewalls och intrusion prevention",
  chapter: "bok9",
  examWeight: "hög",
  summary: "En brandvägg är en gräns mellan säkerhetsdomäner och en enda choke point för trafiken. Den har tre designmål, filtrerar på adresser, applikationer, användare eller aktivitet, och klarar inte trafik som går förbi, insiders eller smittade enheter. De fyra typerna tittar olika djupt, brandväggen kan sitta på olika ställen, ofta med en DMZ, och en IPS och en UTM bygger vidare på den.",
  keyPoints: [
    "Firewall: en gräns mellan säkerhetsdomäner, inom och mellan organisationer, med en enda choke point.",
    "Tre designmål: all trafik går genom brandväggen, bara tillåten trafik passerar, brandväggen själv går inte att bryta sig igenom.",
    "Begränsningar: skyddar inte mot trafik som går förbi, inte fullt ut mot insiders, inte mot osäkra trådlösa nät eller smittade bärbara.",
    "Packet filter mot stateful inspection: paketfiltret bedömer varje paket för sig, den stateful brandväggen följer också etablerade TCP-förbindelser.",
    "Application-level gateway: en proxy som förmedlar applikationstrafik och kan stänga av funktioner; säkrare men tyngre.",
    "Circuit-level gateway: två TCP-förbindelser och förmedling utan att innehållet granskas.",
    "Virtual firewall: filtrerar trafiken mellan virtuella system utan att den måste ut till en fysisk brandvägg.",
    "DMZ: zonen mellan extern och intern brandvägg, för webb-, e-post- och DNS-servrar.",
    "IPS: en IDS som också försöker blockera; host-based, network-based eller distributed/hybrid.",
  ],
  pitfalls: [
    "En brandvägg skyddar mot obehörig åtkomst utifrån, inte mot insiders eller skadlig kod som redan är innanför.",
    "Stateful inspection lägger till en tabell över förbindelser; det är application-level gateway som granskar applikationsdata.",
    "Både application-level och circuit-level gateway delar förbindelsen i två, men bara application-level granskar innehållet.",
    "En IDS upptäcker och larmar; en IPS försöker också stoppa.",
    "En virtual firewall gör att trafiken mellan virtuella maskiner inte behöver skickas ut till en fysisk brandvägg, inte tvärtom.",
  ],
};

export const glossary = [
  { term: "Firewall", definition: "En gräns mellan säkerhetsdomäner, inom och mellan organisationer, med en enda kontrollpunkt (choke point) där trafiken granskas och loggas.", chapter: "bok9" },
  { term: "Packet filtering firewall", definition: "Brandvägg som jämför varje IP-paket för sig med en regellista, utifrån bland annat adresser, portar och protokoll. Enkel och snabb men ser inte applikationsdata.", chapter: "bok9" },
  { term: "Stateful packet inspection firewall", definition: "Paketfilter som dessutom för en tabell över etablerade TCP-förbindelser och bara släpper in paket som hör till någon av dem.", chapter: "bok9" },
  { term: "Application-level gateway", definition: "Även application proxy. Förmedlar trafiken för en viss applikation och kan tillåta bara vissa funktioner. Säkrare än ett paketfilter men kräver mer bearbetning.", chapter: "bok9" },
  { term: "Circuit-level gateway", definition: "Sätter upp två TCP-förbindelser och förmedlar data mellan dem utan att granska innehållet. Säkerheten ligger i vilka förbindelser som tillåts.", chapter: "bok9" },
  { term: "Bastion host", definition: "Ett härdat system som brandväggens administratör pekat ut som en kritisk stark punkt i nätet, ofta plattform för application- eller circuit-level gateways.", chapter: "bok9" },
  { term: "Host-based firewall", definition: "Brandväggsprogram som skyddar en enskild värd, ofta en server, med regler anpassade efter just den värden.", chapter: "bok9" },
  { term: "Personal firewall", definition: "Brandvägg, oftast ett program, mellan en enskild dator och internet eller företagets nät. Huvuduppgiften är att neka obehörig åtkomst utifrån.", chapter: "bok9" },
  { term: "Virtual firewall", definition: "Brandväggsskydd för trafiken mellan system i en virtualiserad miljö eller i molnet, utan att trafiken måste ut till en fysiskt separat brandvägg.", chapter: "bok9" },
  { term: "Demilitarized zone (DMZ)", definition: "Nätsegmentet mellan den externa och den interna brandväggen, för system som måste nås utifrån, som webb-, e-post- och DNS-servrar.", chapter: "bok9" },
  { term: "Distributed firewall", definition: "Fristående brandväggar och host-based firewalls som arbetar tillsammans under central administration.", chapter: "bok9" },
  { term: "Intrusion prevention system (IPS)", definition: "En IDS som också försöker blockera eller förhindra den skadliga aktivitet den upptäcker. Kallas även IDPS.", chapter: "bok9" },
  { term: "Host-based IPS (HIPS)", definition: "IPS på en enskild värd som bland annat granskar systemanrop, filåtkomst och registret.", chapter: "bok9" },
  { term: "Network-based IPS (NIPS)", definition: "I princip en nätverksbaserad IDS i trafikflödet (inline) som får ändra eller kasta paket och bryta TCP-förbindelser.", chapter: "bok9" },
  { term: "Unified threat management (UTM)", definition: "En enda enhet som samlar brandvägg, intrusion detection och prevention, antivirus och fler skydd. Den stora nackdelen är prestandan.", chapter: "bok9" },
];

export const questions = [
  { id: "sak-bok9-v03", topic: "bok9-firewall", difficulty: 2, ...variant("sak-03", "brandväggen som gräns mellan säkerhetsdomäner"),
    question: "A company puts a firewall between its research network and its office network. Which description of a firewall does this fit?",
    options: [
      { text: "A boundary between security domains, even within one company", explain: "Boken definierar brandväggen som en gräns mellan säkerhetsdomäner, både inom och mellan organisationer. Interna brandväggar kan skydda delar av nätet från varandra." },
      { text: "A perimeter device that only belongs at the edge to the internet", explain: "Den externa brandväggen sitter vid internetgränsen, men boken beskriver också interna brandväggar som skiljer delar av företagets nät åt." },
      { text: "A sensor that detects intrusions and only raises an alert", explain: "Det är en IDS. En brandvägg släpper igenom eller stoppar trafik vid gränsen." },
      { text: "An encrypted tunnel that links two of the company's sites", explain: "Det är en VPN. En brandvägg kan vara plattform för en VPN, men det är inte vad en brandvägg är." }
    ],
    correct: 0, reviewed: false },

  { id: "sak-bok9-v10", topic: "bok9-firewall", difficulty: 2, ...variant("sak-10", "vad brandväggen skyddar mot och inte mot"),
    question: "Which of these threats can a firewall at the network perimeter NOT fully protect against?",
    options: [
      { text: "Outsiders trying to reach hosts on the internal network", explain: "Att hålla obehöriga utifrån borta från det privata nätet är brandväggens huvuduppgift. Det var svaret på förra årets fråga." },
      { text: "Incoming traffic that the access policy does not permit", explain: "Att bara släppa igenom trafik som säkerhetspolicyn tillåter är brandväggens andra designmål." },
      { text: "A laptop infected at home and then plugged in at work", explain: "Datorn smittas utanför nätet och kommer sedan in förbi brandväggen. Det är en av brandväggens begränsningar, liksom insiders och trafik som går förbi." },
      { text: "Vulnerable internal services being reached from outside", explain: "Brandväggen kan hindra sårbara tjänster från att nås utifrån eller från att nå ut." }
    ],
    correct: 2, reviewed: false },

  { id: "sak-bok9-v26", topic: "bok9-firewall", difficulty: 2, ...variant("sak-26", "virtual firewall"),
    question: "Which statement best describes what a virtual firewall does?",
    options: [
      { text: "It routes all traffic between VMs out to a separate physical firewall", explain: "Tvärtom: poängen är att trafiken mellan virtuella system inte behöver skickas ut till ett fysiskt separat nät med en traditionell brandvägg." },
      { text: "It filters traffic between virtual systems without a physical firewall", explain: "En virtual firewall ger brandväggsskydd åt trafiken mellan system i en virtualiserad miljö eller i molnet, utan att trafiken måste ut till en fysisk brandvägg." },
      { text: "It detects intrusions inside the VMs but never blocks any of the traffic", explain: "Att bara upptäcka och larma är vad en IDS gör. En virtual firewall filtrerar trafiken mellan de virtuella systemen." },
      { text: "It encrypts the traffic between cloud data centers over the internet", explain: "Kryptering mellan platser över internet är en VPN, inte en virtual firewall." }
    ],
    correct: 1, reviewed: false },

  { id: "sak-bok9-01", topic: "bok9-firewall", difficulty: 1,
    question: "Which of these is NOT one of the three design goals for a firewall?",
    options: [
      { text: "All traffic between inside and outside must pass through it", explain: "Designmål 1: andra vägar in i nätet blockeras, så att all trafik går genom brandväggen." },
      { text: "Only traffic authorized by the local security policy may pass", explain: "Designmål 2: vad som är tillåtet bestäms av organisationens säkerhetspolicy." },
      { text: "The firewall itself must be immune to penetration", explain: "Designmål 3: brandväggen körs på ett härdat system med ett säkrat operativsystem." },
      { text: "It must stop all attacks by insiders on the internal network", explain: "Det är tvärtom en av brandväggens begränsningar: den skyddar inte fullt ut mot interna hot, som en missnöjd anställd." }
    ],
    correct: 3, source: "Bokens kapitel 9 (brandväggens designmål)", reviewed: false },

  { id: "sak-bok9-02", topic: "bok9-firewall", difficulty: 2,
    question: "What does a stateful inspection firewall keep track of that a simple packet filter does not?",
    options: [
      { text: "Which application commands each user is allowed to run", explain: "Att tillåta bara vissa funktioner i en applikation kan en application-level gateway. Varken paketfilter eller stateful brandväggar ser applikationens kommandon." },
      { text: "The TCP connections that are currently established", explain: "Den stateful brandväggen för en tabell över etablerade TCP-förbindelser och släpper bara in paket som hör till någon av dem." },
      { text: "The spam content of incoming e-mail messages", explain: "Att granska e-post efter spam är filtrering på application protocol, som en application-level gateway gör." },
      { text: "The identity of the user behind each packet", explain: "Filtrering på user identity kräver att användaren autentiserar sig; varken paketfilter eller stateful inspection bygger på det." }
    ],
    correct: 1, source: "Bokens kapitel 9 (packet filter och stateful inspection)", reviewed: false },

  { id: "sak-bok9-03", topic: "bok9-firewall", difficulty: 2,
    question: "Which type of firewall sets up two TCP connections, one to each side, and relays data between them without examining the contents?",
    options: [
      { text: "Packet filtering firewall", explain: "Ett paketfilter bedömer varje paket mot en regellista och sätter inte upp några egna förbindelser." },
      { text: "Stateful inspection firewall", explain: "En stateful brandvägg följer förbindelserna i en tabell men delar dem inte i två." },
      { text: "Application-level gateway", explain: "Den delar också förbindelsen i två, men den granskar applikationsdata, vilket kostar extra bearbetning." },
      { text: "Circuit-level gateway", explain: "En circuit-level gateway förmedlar data utan att granska den. Säkerheten ligger i vilka förbindelser som tillåts." }
    ],
    correct: 3, source: "Bokens kapitel 9 (typer av brandväggar)", reviewed: false },

  { id: "sak-bok9-04", topic: "bok9-firewall", difficulty: 1,
    question: "A network has an external and an internal firewall. Which systems are usually placed in the DMZ between them?",
    options: [
      { text: "Public web, e-mail and DNS servers", explain: "I DMZ:n står system som måste nås utifrån men ändå behöver skydd, som företagets webbplats, e-postserver och DNS-server." },
      { text: "Internal database and file servers", explain: "Interna servrar skyddas bakom den interna brandväggen, som filtrerar hårdare än den externa." },
      { text: "Employees' workstations and laptops", explain: "Arbetsstationerna hör till det interna nätet bakom den interna brandväggen." },
      { text: "Servers with payroll and HR records", explain: "Känsliga interna data ska inte nås utifrån och står bakom den interna brandväggen." }
    ],
    correct: 0, source: "Bokens kapitel 9 (DMZ)", reviewed: false },

  { id: "sak-bok9-05", topic: "bok9-firewall", difficulty: 1,
    question: "How does an intrusion prevention system (IPS) differ from an intrusion detection system (IDS)?",
    options: [
      { text: "It works only on single hosts, never on whole networks", explain: "En IPS kan vara host-based, network-based eller distributed/hybrid, precis som en IDS." },
      { text: "It uses known signatures but never anomaly detection", explain: "En IPS kan använda både signature/heuristic detection och anomaly detection, precis som en IDS." },
      { text: "It can also try to block the activity that it detects", explain: "En IPS är en IDS som dessutom försöker blockera eller förhindra den skadliga aktivitet den upptäcker." },
      { text: "It raises alerts but leaves all of the traffic untouched", explain: "Det beskriver en IDS, som upptäcker och larmar men inte stoppar trafiken." }
    ],
    correct: 2, source: "Bokens kapitel 9 (intrusion prevention systems)", reviewed: false },
];

export const notes = `Byggt på Stallings & Brown kap. 9 (s. 481–533: 9.1–9.7, Key Terms och Review Questions) och kap. 12.8 Virtual Firewall (s. 698–703) för tentans definition av virtual firewall. Föreläsning 2:s data center-modell (NGFW och IDS/IPS i nätverkslagret) är hänvisad till, inte upprepad.

Osäkert:
- NGFW står bara i Föreläsning 2; boken tar inte upp begreppet. Jag skriver ut förkortningen (next-generation firewall) men förklarar den inte.
- "Virtual firewall" är inte en Key Term i kapitel 9 eller 12, men tentan frågar om den, så den står i ordlistan. Skriver kapitel 12:s utkast också in termen blir det en dubblett.
- Termerna anomaly detection, signature/heuristic detection och sandbox står i fetstil i body men inte i ordlistan, eftersom kapitlet om intrusion detection (och skadlig kod) troligen tar dem.
- IPSec och VPN nämns kort i body men står inte i ordlistan; de hör troligen till kapitlet om internetsäkerhetsprotokoll.
- "Svaga lösenord" i stycket om förra årets tentafråga är tentans distraktor; boken nämner inte svaga lösenord i listan över brandväggens begränsningar.
- Uppgiften om UTM:s genomströmningsförlust (cirka 50 %) bygger på en enskild källa i boken och är utelämnad; bara "prestanda" står kvar.
- I förra årets fråga om virtual firewall är ett felaktigt alternativ ihopklippt med bokens ord om "flexibility and scalability" (som i boken gäller virtuella brandväggar i stora miljöer). Body säger bara att alternativen var ihopklippta av andra meningar; vill Kasper peka ut frasen kan en mening läggas till.
- Hypervisor firewall "kan vara säkrare" följer bokens "can be more secure"; nackdelen (kräver stöd i hypervisorn) och VM bastion hostens resurskonkurrens är utelämnade för längdens skull.

Medvetet utelämnat: regelexemplen för SMTP och portnumren, motåtgärderna mot IP address spoofing och tiny fragment attack, source routing attacks, SOCKS, bastion host-listans alla punkter, personal firewall-portlistan, stealth mode, topologilistan (screening router, single/double bastion inline/T), NIPS:ens flow data protection och fem detektionsmetoder (pattern matching m.fl., överlappar kapitlet om intrusion detection), digital immune system, Snort Inline, Sidewinder-tabellerna och kapitlets Problems. Ingen fråga om UTM, personal firewall eller bastion host (taket åtta frågor); de är tänkbara tillägg.`;
