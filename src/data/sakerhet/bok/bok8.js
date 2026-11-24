// Bokens kapitel 8: Stallings & Brown, Intrusion Detection (s. 417–480).
// Kapitel, ämne, ordlista och frågor; samlas via bok/index.js. Skrivet med
// egna ord på tentans nivå, granskat mot boken 22 nov 2026 (ogranskat av
// Kasper). `notes` är källanteckningarna och visas inte.

const variant = (id, what) => ({ variantOf: id, source: `Variant av en tentafråga från förra året (${what})` });

export const chapter = {
  id: "bok8",
  kind: "bok",
  label: "Bokens kapitel 8",
  examArea: "Bokfrågor",
  focus: ["Understand types of network attacks"],
  title: "Intrusion detection",
  readingMinutes: 11,
  lead: "Vilka som bryter sig in och hur de går till väga, hur en IDS är uppbyggd och var den tittar, varför den ger falsklarm, skillnaden mellan anomaly och signature detection, och vad en honeypot är till för.",
  sources: ["Stallings & Brown kap. 8 (s. 417–480)"],
  body: `
## Kärnan

- **Intrusion detection** samlar in och analyserar information från datorer och nät för att hitta möjliga intrång. En IDS upptäcker och larmar, men stoppar inte attacken; det gör en IPS.
- **En IDS har tre delar:** sensors som samlar data, analyzers som avgör om det är ett intrång och ett user interface.
- **Den kan titta på tre ställen:** på en enskild värd (host-based), på trafiken i nätet (network-based) eller på båda samtidigt (distributed eller hybrid).
- **Två sätt att analysera:** anomaly detection jämför med normalt beteende och kan hitta okända attacker; signature/heuristic detection jämför med kända attacker.
- **Ingen IDS är exakt.** Angripare och vanliga användare beter sig delvis likadant, så det blir både falsklarm (false positives) och missade intrång (false negatives).
- **En honeypot** är ett lockbete utan verklig användning, så all trafik dit är misstänkt.

## Intruders och hur de går till väga

Boken delar in angriparna, **intruders**, i fyra klasser efter vad som driver dem:

| Klass | Drivs av | Typiska angrepp |
|---|---|---|
| **Cyber criminals** | pengar; enskilda eller organiserad brottslighet | identitetsstöld, datastöld, företagsspionage och utpressning |
| **Activists** (hacktivists) | sociala eller politiska frågor; kunskapen kan vara låg | vandaliserade webbplatser, denial of service och läckta data som skadar målet |
| **State-sponsored organizations** | spionage eller sabotage på uppdrag av en regering | dolda angrepp under lång tid; kallas också APT (se kapitlet om malicious software) |
| **Others** | teknisk utmaning och anseende bland andra hackare | klassiska hackare och hobbyhackare med färdiga verktyg |

Kunskapen varierar från **beginners** (script kiddies med färdiga verktyg) via **skilled** till **experts**, som hittar helt nya sorters sårbarheter.

Ett intrång följer ofta samma steg:

| Steg | Vad angriparen gör |
|---|---|
| **Target acquisition and information gathering** | kartlägger målet med öppen information och nätverksverktyg |
| **Initial access** | tar sig in, till exempel via en sårbarhet, gissade lösenord eller malware |
| **Privilege escalation** | skaffar högre behörighet i systemet |
| **Information gathering or system exploit** | läser eller ändrar data, eller går vidare till andra system med stulna inloggningsuppgifter |
| **Maintaining access** | installerar bakdörrar eller lägger in dolda inloggningsuppgifter för att kunna komma tillbaka |
| **Covering tracks** | ändrar loggar och döljer filer, till exempel med rootkits |

Gästföreläsningen visade en liknande kedja i åtta steg. Boken lyfter också fram två växande hot:

- I en **supply-chain attack** tar sig angriparen först in hos en leverantör av programvara eller tjänster och når sedan kunderna genom den. I SolarWinds-attacken spreds en bakdörr via programuppdateringar till över 18 000 kunder. Sådana attacker är svåra att upptäcka, eftersom de utnyttjar kundernas förtroende för leverantören.
- Vid **business e-mail compromise (BEC)** kapar angriparen ett e-postkonto och utger sig för att vara en betrodd leverantör för att lura till sig betalningar. Mejlen saknar ofta skadliga länkar och bilagor och slinker förbi spamfilter.

IDS och IPS fungerar ganska bra mot kända, enkla attacker men sämre mot riktade attacker med zero-day exploits. De måste därför vara en del av **defense in depth**, tillsammans med bland annat kryptering, loggning och stark autentisering.

## Security intrusion och intrusion detection

- **Security intrusion:** enligt boken "unauthorized act of bypassing the security mechanisms of a system", alltså en obehörig handling som kringgår ett systems säkerhetsmekanismer.
- **Intrusion detection:** en funktion i hård- eller mjukvara som samlar in och analyserar information från olika delar av en dator eller ett nät för att hitta möjliga intrång.

Ett **intrusion detection system (IDS)** utför den funktionen och har tre logiska delar:

| Del | Vad den gör |
|---|---|
| **Sensors** | samlar in data som kan visa på ett intrång, till exempel nätverkspaket, loggfiler och systemanrop, och skickar den vidare |
| **Analyzers** | tar emot data från sensorer eller andra analyzers och avgör om ett intrång har skett; kan bifoga bevis och föreslå åtgärder |
| **User interface** | låter en användare se resultatet och styra systemet; kallas ibland manager eller console |

En IDS gör nytta på tre sätt: ju tidigare ett intrång upptäcks, desto mindre skada och desto snabbare återställning; en IDS kan avskräcka; och den samlar kunskap om angreppstekniker som stärker skyddet.

**En IDS upptäcker, loggar och larmar, men stoppar inte.** Det var svaret på en av förra årets tentafrågor. Ett system som också försöker blockera är en **intrusion prevention system (IPS)**, se kapitlet om firewalls och intrusion prevention. I Föreläsning 2 ligger IDS/IPS i data center-modellens nätverkslager, och i gästföreläsningen hör övervakningen till funktionen Detect, där purple team-övningar kontrollerar att larmen fungerar.

## Host-based, network-based och distributed IDS

IDS:er delas in efter vilka data de analyserar:

| Typ | Övervakar | Styrka och svaghet |
|---|---|---|
| **Host-based IDS (HIDS)** | händelser på en enskild värd: systemanrop, loggfiler, ändringar i viktiga filer (med checksummor) och, i Windows, registret | upptäcker både externa och interna intrång, vilket varken en NIDS eller en brandvägg kan |
| **Network-based IDS (NIDS)** | trafiken vid utvalda punkter i nätet, paket för paket, i nätverks-, transport- och applikationsprotokollen | sitter oftast vid perimetern, i eller intill brandväggen, och letar efter angrepp utifrån; ser allt mindre av innehållet när mer trafik krypteras |
| **Distributed or hybrid IDS** | data från många sensorer, både på värdar och i nätet, samlade i en central analyzer | ser mer än en enskild sensor; när många sensorer ser samma sak kan den larma tidigt med liten risk för falsklarm |

En HIDS sätts främst på sårbara eller känsliga system, som databasservrar. En distribuerad lösning kan bygga på **security information and event management (SIEM)**, programvara som tar in och analyserar data från många källor och produkter.

## False positives, false negatives och base-rate fallacy

Intrusion detection bygger på antagandet att en angripare beter sig mätbart annorlunda än en behörig användare. Men beteendena överlappar, så felen går åt två håll:

| Fel | Vad som händer | Blir vanligare när |
|---|---|---|
| **False positive** | falsklarm: en behörig användare pekas ut som angripare | IDS:en tolkar angriparbeteende brett för att fånga fler |
| **False negative** | en verklig angripare upptäcks inte | IDS:en tolkar snävt för att slippa falsklarm |

Målet är en hög **detection rate** (andelen attacker som upptäcks) och en låg **false alarm rate**. Upptäcks för få intrång ger systemet en falsk trygghet. Blir det för många falsklarm börjar administratörerna strunta i dem.

**Base-rate fallacy** förklarar varför det är så svårt: verkliga intrång är få jämfört med all legitim användning. Då blir andelen falsklarm hög, om inte testet skiljer extremt skarpt mellan angripare och användare.

Det är också svårare att upptäcka en **insider**, en behörig användare som gör något obehörigt, eftersom skillnaden mot normalt beteende är liten.

## Anomaly detection och signature/heuristic detection

| | **Anomaly detection** | **Signature or heuristic detection** |
|---|---|---|
| Utgår från | normalt beteende hos legitima användare | kända skadliga mönster (signatures) eller regler för kända attacker (heuristics) |
| Hur | en modell av normalt beteende byggs i en training phase; i en detection phase jämförs det som händer med modellen | det som händer jämförs med mönstren och reglerna |
| Okända attacker | kan upptäcka zero-day-attacker | upptäcker bara attacker den har mönster eller regler för |
| Nackdel | svårt att samla in och analysera data, och många falsklarm | nya mönster måste hela tiden tas fram för ny malware |

Signature/heuristic detection kallas också **misuse detection**. Den är snabb och billig att köra och därför mycket använd, till exempel i antivirusprogram (se kapitlet om malicious software) och i NIDS:er.

Anomaly detection kan klassa beteendet på tre sätt:

- **Statistical:** statistiska modeller av mätvärden; enkelt och billigt.
- **Knowledge based:** ett expertsystem med regler för legitimt beteende, oftast skrivna för hand.
- **Machine learning:** en klassningsmodell tas fram automatiskt ur träningsdata; flexibelt men resurskrävande.

Den andra metoden har två varianter. **Signature detection** matchar lagrad data eller trafik mot en stor samling kända skadliga mönster. **Rule-based heuristic identification** använder regler som känner igen kända intrång eller angrepp mot kända svagheter.

En NIDS använder båda: signaturer för kända angrepp mot protokollen och brott mot policyn, anomaly detection för denial of service, skanning och maskar.

## Sensorer i nätet: inline och passive

| Sensor | Hur den sitter | Följd |
|---|---|---|
| **Inline sensor** | trafiken måste passera genom den, antingen inbyggd i till exempel en brandvägg eller fristående | kan blockera en attack och gör då både intrusion detection och intrusion prevention |
| **Passive sensor** | övervakar en kopia av trafiken, till exempel via en tap på kabeln | vanligast; effektivare eftersom den inte fördröjer trafiken, men kan inte stoppa något |

Placeringen avgör vad sensorn ser. En vanlig plats är precis innanför den externa brandväggen, där den ser angrepp som tagit sig förbi brandväggen. Utanför brandväggen ser den all ofiltrerad trafik, och vid interna nät ser den även behöriga användare som gör obehöriga saker.

Bokens exempel är **Snort**, en IDS med öppen källkod som kan vara host- eller network-based och känner igen angrepp med regler som administratören skriver. Körs Snort som inline sensor kan den också stoppa trafik.

## Honeypots

En **honeypot** är ett lockbete, ett system som ska:

1. locka bort angriparen från de kritiska systemen
2. samla information om vad angriparen gör
3. hålla kvar angriparen tillräckligt länge för att administratörerna ska hinna reagera

En honeypot har inget produktionsvärde, så ingen behörig har anledning att använda den. All kontakt med den är därför troligen sondering, skanning eller en attack, och börjar honeypoten själv skicka trafik utåt har den troligen tagits över.

| Typ | Vad det är | För- och nackdelar |
|---|---|---|
| **Low-interaction honeypot** | programvara som efterliknar vissa tjänster eller system tillräckligt för en trovärdig första kontakt, utan att köra dem fullt ut | mindre realistisk, men räcker för att upptäcka angripare i attackens tidiga steg och varna, ofta som del av en distribuerad IDS |
| **High-interaction honeypot** | ett riktigt system med operativsystem, tjänster och applikationer, försett med övervakning | mer realistisk och kan uppta angriparen länge, men kräver mer resurser och kan, om den tas över, användas för att angripa andra system |

Utanför den externa brandväggen ökar honeypoten inte risken för det interna nätet men fångar knappast insiders. Inne i det interna nätet fångar den interna angrepp, men en övertagen honeypot kan då angripa andra interna system. Den kan också stå i DMZ:n.
`,
};

export const topic = {
  id: "bok8-ids",
  name: "Intrusion detection",
  chapter: "bok8",
  examWeight: "hög",
  summary: "Intruders är cyberkriminella, aktivister, statligt sponsrade grupper och andra, och ett intrång följer ofta samma steg. En IDS samlar in och analyserar data för att hitta möjliga intrång, med sensors, analyzers och ett user interface, på en värd, i nätet eller båda. Den upptäcker och larmar men stoppar inte. Anomaly detection kan hitta okända attacker men ger fler falsklarm; signature/heuristic detection hittar bara kända. Avvägningen mellan false positives och false negatives gör det svårt, och honeypots lockar angripare till ett lockbete.",
  keyPoints: [
    "Security intrusion: en obehörig handling som kringgår ett systems säkerhetsmekanismer; intrusion detection är funktionen som letar efter sådana.",
    "Intrusion detection system (IDS): sensors, analyzers och user interface; upptäcker och larmar men stoppar inte, det gör en IPS.",
    "HIDS, NIDS och distributed/hybrid IDS: en enskild värd, trafiken i nätet, eller data från båda samlad i en central analyzer.",
    "False positive och false negative: falsklarm mot en behörig användare respektive en angripare som inte upptäcks.",
    "Base-rate fallacy: när intrången är få jämfört med legitim användning blir andelen falsklarm hög.",
    "Anomaly detection: jämför med en modell av normalt beteende; kan hitta zero-day-attacker men ger många falsklarm.",
    "Signature/heuristic detection: jämför med kända mönster och regler; snabb och billig men hittar bara kända attacker.",
    "Inline och passive sensor: inline-sensorn sitter i trafikflödet och kan blockera, den passiva ser en kopia.",
    "Honeypot: ett lockbete utan produktionsvärde; low-interaction efterliknar tjänster, high-interaction är ett riktigt system.",
  ],
  pitfalls: [
    "En IDS upptäcker och larmar; det är en IPS, eller en inline-sensor, som kan stoppa trafiken.",
    "False positive är ett falsklarm mot en behörig användare; false negative är en angripare som inte upptäcks.",
    "Det är anomaly detection som kan hitta zero-day-attacker; signature/heuristic detection kräver att attacken redan är känd.",
    "En HIDS kan upptäcka både interna och externa intrång; en NIDS vid perimetern ser främst angrepp utifrån.",
    "En low-interaction honeypot efterliknar tjänster; det är en high-interaction honeypot som är ett riktigt system och kan användas mot andra system om den tas över.",
  ],
};

export const glossary = [
  { term: "Intruder", definition: "Den som bryter sig in i ett system, ofta kallad hacker eller cracker. Boken delar in dem i cyber criminals, activists, state-sponsored organizations och others.", chapter: "bok8" },
  { term: "Supply-chain attack", definition: "Angrepp där angriparen först tar sig in hos en leverantör av programvara eller tjänster och sedan når leverantörens kunder genom den, som i SolarWinds-attacken.", chapter: "bok8" },
  { term: "Security intrusion", definition: "En obehörig handling som kringgår ett systems säkerhetsmekanismer.", chapter: "bok8" },
  { term: "Intrusion detection", definition: "En funktion i hård- eller mjukvara som samlar in och analyserar information från en dator eller ett nät för att hitta möjliga intrång.", chapter: "bok8" },
  { term: "Intrusion detection system (IDS)", definition: "System som utför intrusion detection, med tre logiska delar: sensors, analyzers och user interface. Det upptäcker och larmar men stoppar inte själv attacken.", chapter: "bok8" },
  { term: "Host-based IDS (HIDS)", definition: "IDS som övervakar händelser på en enskild värd, till exempel systemanrop, loggfiler och ändringar i filer. Kan upptäcka både externa och interna intrång.", chapter: "bok8" },
  { term: "Network-based IDS (NIDS)", definition: "IDS som övervakar trafiken vid utvalda punkter i nätet, paket för paket, och analyserar nätverks-, transport- och applikationsprotokollen.", chapter: "bok8" },
  { term: "False positive", definition: "Falsklarm: IDS:en pekar ut en behörig användare eller ofarlig aktivitet som ett intrång.", chapter: "bok8" },
  { term: "False negative", definition: "Ett verkligt intrång som IDS:en inte upptäcker.", chapter: "bok8" },
  { term: "Base-rate fallacy", definition: "När verkliga intrång är få jämfört med den legitima användningen blir andelen falsklarm hög, om inte testet skiljer extremt skarpt mellan angripare och användare.", chapter: "bok8" },
  { term: "Anomaly detection", definition: "Upptäckt som jämför det som händer med en modell av legitima användares normala beteende. Kan hitta okända zero-day-attacker men ger ofta många falsklarm.", chapter: "bok8" },
  { term: "Signature detection", definition: "Upptäckt som matchar data mot en samling kända skadliga mönster (signatures). Kallas, liksom rule-based heuristic identification, misuse detection och hittar bara kända attacker.", chapter: "bok8" },
  { term: "Inline sensor", definition: "NIDS-sensor som trafiken måste passera genom. Den kan blockera en attack och gör då också intrusion prevention.", chapter: "bok8" },
  { term: "Passive sensor", definition: "NIDS-sensor som övervakar en kopia av trafiken. Den fördröjer inte trafiken men kan inte stoppa den, och är den vanligaste typen.", chapter: "bok8" },
  { term: "Honeypot", definition: "Ett lockbete utan produktionsvärde som ska locka bort angripare från kritiska system och samla information om dem. Finns som low- och high-interaction.", chapter: "bok8" },
];

export const questions = [
  { id: "sak-bok8-v15", topic: "bok8-ids", difficulty: 1, ...variant("sak-15", "IDS upptäcker och larmar"),
    question: "A company installs an intrusion detection system (IDS) on its database servers. What will the IDS mainly do?",
    options: [
      { text: "Block every attack it finds before any harm is done", explain: "Att blockera angrepp är vad en IPS gör. En IDS huvuduppgift är att upptäcka, logga och larma." },
      { text: "Filter traffic to the servers by address and port", explain: "Att släppa igenom eller stoppa trafik efter adresser och portar gör en brandvägg, till exempel ett paketfilter." },
      { text: "Lure attackers away to a decoy full of fake data", explain: "Det är en honeypot, ett lockbete utan produktionsvärde." },
      { text: "Detect possible intrusions, log them and alert", explain: "En IDS samlar in och analyserar data för att hitta möjliga intrång, loggar misstänkta händelser och larmar. Den stoppar inte själv trafiken." },
    ],
    correct: 3, reviewed: false },

  { id: "sak-bok8-01", topic: "bok8-ids", difficulty: 1,
    question: "Which three logical components make up an intrusion detection system?",
    options: [
      { text: "Signatures, heuristics and anomaly models", explain: "Det är sätt att analysera data i en IDS, inte dess delar." },
      { text: "Sensors, analyzers and a user interface", explain: "Sensorerna samlar in data, analyzers avgör om ett intrång har skett och user interface låter en användare se resultatet och styra systemet." },
      { text: "Host-based, network-based and hybrid parts", explain: "Det är typer av IDS, indelade efter vilka data de analyserar." },
      { text: "Inline sensors, passive sensors and taps", explain: "Det är sätt att koppla in en NIDS-sensor i nätet, inte IDS:ens logiska delar." },
    ],
    correct: 1, source: "Bokens kapitel 8 (IDS:ens tre delar)", reviewed: false },

  { id: "sak-bok8-02", topic: "bok8-ids", difficulty: 2,
    question: "An administrator tightens the IDS's definition of intruder behavior to cut down on false alarms. What is the likely side effect?",
    options: [
      { text: "More real intruders slip through as false negatives", explain: "En snäv tolkning ger färre falsklarm men fler false negatives, alltså angripare som inte upptäcks." },
      { text: "More legitimate users are flagged as false positives", explain: "Det händer vid en bred tolkning av angriparbeteende, inte en snäv." },
      { text: "Zero-day attacks become easier for the IDS to spot", explain: "En snävare tolkning gör att färre attacker upptäcks, inte fler. Okända attacker kan bara anomaly detection hitta." },
      { text: "The IDS starts to block traffic instead of alerting", explain: "Att blockera kräver en IPS eller en inline-sensor; det har inget med tolkningen av angriparbeteende att göra." },
    ],
    correct: 0, source: "Bokens kapitel 8 (false positives och false negatives)", reviewed: false },

  { id: "sak-bok8-03", topic: "bok8-ids", difficulty: 2,
    question: "What does the base-rate fallacy imply for intrusion detection?",
    options: [
      { text: "New attacks have no signatures, so they are missed", explain: "Det är signature detection:s svaghet mot zero-day-attacker, inte base-rate fallacy." },
      { text: "Insiders act too much like normal users to be caught", explain: "Att insiders är svåra att upptäcka stämmer, men beror på att deras beteende liknar det normala, inte på base-rate fallacy." },
      { text: "Rare intrusions lead to a high rate of false alarms", explain: "När verkliga intrång är få jämfört med legitim användning blir andelen falsklarm hög, om inte testet skiljer extremt skarpt." },
      { text: "Encryption hides most packet content from the NIDS", explain: "Det är en begränsning för NIDS:er, men den handlar om vad sensorn kan se, inte om base-rate fallacy." },
    ],
    correct: 2, source: "Bokens kapitel 8 (base-rate fallacy)", reviewed: false },

  { id: "sak-bok8-04", topic: "bok8-ids", difficulty: 2,
    question: "What is the main advantage of anomaly detection over signature or heuristic detection?",
    options: [
      { text: "It is cheaper to run in time and resources", explain: "Låg kostnad i tid och resurser är tvärtom signature detection:s fördel." },
      { text: "It gives fewer false alarms in daily use", explain: "Anomaly detection ger tvärtom ofta många falsklarm, vilket är dess stora nackdel." },
      { text: "It needs no training on normal behavior", explain: "Anomaly detection bygger först en modell av normalt beteende i en training phase." },
      { text: "It can detect unknown, zero-day attacks", explain: "Eftersom den utgår från normalt beteende och letar avvikelser kan den hitta attacker som ingen signatur finns för." },
    ],
    correct: 3, source: "Bokens kapitel 8 (anomaly och signature detection)", reviewed: false },

  { id: "sak-bok8-05", topic: "bok8-ids", difficulty: 2,
    question: "What can a host-based IDS (HIDS) do that a network-based IDS or a firewall cannot?",
    options: [
      { text: "Inspect all traffic at the network perimeter", explain: "Att övervaka trafiken vid perimetern är vad en NIDS gör, ofta i eller intill brandväggen." },
      { text: "Detect both external and internal intrusions", explain: "Bokens främsta fördel med en HIDS: den ser vad som händer på värden, oavsett om angriparen kommer utifrån eller inifrån." },
      { text: "Block attacks by dropping packets inline", explain: "Att kasta paket i trafikflödet kräver en IPS eller en inline-sensor, inte en HIDS." },
      { text: "Find zero-day attacks using known signatures", explain: "Signaturer finns bara för kända attacker, så de kan inte hitta zero-day-attacker oavsett typ av IDS." },
    ],
    correct: 1, source: "Bokens kapitel 8 (HIDS och NIDS)", reviewed: false },

  { id: "sak-bok8-06", topic: "bok8-ids", difficulty: 2,
    question: "What can an inline NIDS sensor do that a passive sensor cannot?",
    options: [
      { text: "Watch a copy of the traffic without delaying it", explain: "Det är den passiva sensorn, som ser en kopia av trafiken och därför inte fördröjer den." },
      { text: "Use both anomaly and signature detection", explain: "En NIDS kan använda båda metoderna oavsett hur sensorn är inkopplad." },
      { text: "Block an attack, as traffic passes through it", explain: "Trafiken måste gå genom inline-sensorn, så den kan stoppa en attack och gör då också intrusion prevention." },
      { text: "Read the content of all encrypted traffic", explain: "Kryptering döljer innehållet för alla NIDS-sensorer, inline eller passiva." },
    ],
    correct: 2, source: "Bokens kapitel 8 (inline och passive sensor)", reviewed: false },

  { id: "sak-bok8-07", topic: "bok8-ids", difficulty: 2,
    question: "Which is a drawback of a high-interaction honeypot compared with a low-interaction one?",
    options: [
      { text: "If compromised, it can be used to attack others", explain: "Ett riktigt system kan, om angriparen tar över det, användas för att angripa andra system. Det kräver också mer resurser." },
      { text: "It is a less realistic target for the attacker", explain: "Det gäller low-interaction-honeypoten, som bara efterliknar tjänster. Ett riktigt system är mer realistiskt." },
      { text: "It only spots attackers in the early attack stages", explain: "Det beskriver low-interaction-honeypoten, som räcker för att varna i attackens tidiga steg." },
      { text: "Real users often reach it as part of normal work", explain: "En honeypot har inget produktionsvärde, så ingen behörig har anledning att använda den. Därför är all trafik dit misstänkt." },
    ],
    correct: 0, source: "Bokens kapitel 8 (honeypots)", reviewed: false },
];

export const notes = `Byggt på Stallings & Brown kap. 8 i del1-filen, s. 417–480: 8.1 (fyra klasser av intruders, kunskapsnivåer, sex steg i ett intrång, supply-chain attack, BEC), 8.2 (definitionerna av security intrusion och intrusion detection, IDS:ens tre delar, HIDS/NIDS/distributed, tre fördelar, false positive/negative, base-rate fallacy, insiders enligt Anderson), 8.3 (anomaly mot signature/heuristic, de tre klassningssätten), 8.4 (HIDS, datakällor, att signature/heuristic HIDS i form av antivirus är vanligast), 8.5 (inline/passive, sensorplaceringen, vilka attacker som passar signature respektive anomaly enligt NIST SP 800-94), 8.6 kort (distributed/hybrid, SIEM), 8.8 (honeypots, low/high interaction, placering) och 8.9 bara som exempel (Snort). Key Terms och Review Questions 8.1–8.23 styrde urvalet. IDS/IPS i Föreläsning 2:s data center-modell och Detect/purple team i gästföreläsningen är hänvisade till, inte upprepade.

Osäkert:
- Kapitlet börjar på s. 417 enligt filens sidmarkörer (kapitelrubriken står före "Page 418"); själva 8.1 börjar på s. 419.
- "Kunskapsnivåerna" beginner/skilled/expert är inga Key Terms men står i 8.1; de har bara en mening.
- "Signature/heuristic detection är mycket använd" bygger på bokens "widely used in anti-virus products, network traffic scanning proxies, and NIDS" och "Signature or heuristic-based HIDSs are widely used". Boken säger aldrig rakt ut att den är vanligast totalt; body skriver därför "mycket använd".
- Fördelar och nackdelar för de tre klassningssätten i anomaly detection är förkortade till några ord (statistical: enkelt och billigt; machine learning: flexibelt men resurskrävande; knowledge based utan värdering).
- Distributed/hybrid: "kan larma tidigt med liten risk för falsklarm" sammanfattar bokens analogi (många sensorer som ser samma sak), inte en generell garanti.
- Snort: boken kallar Snort både "host-based or network-based IDS" och "an example of a rule-based NIDS"; body säger "kan vara host- eller network-based".
- Placeringen av honeypot i DMZ:n har bara en mening; nackdelen (brandväggen måste öppnas mer än tillåtet) är utelämnad.
- "En IDS upptäcker, loggar och larmar, men stoppar inte" följer tentans svar och bokens "main purpose is to detect intrusions, log suspicious events, and send alerts". Boken nämner också att en HIDS i vissa fall kan stoppa ett angrepp (med hänvisning till IPS-avsnittet i kap. 9); den nyansen är utelämnad i body.
- NIDS-sensorernas placering är komprimerad till en mening om tre av bokens fyra platser (innanför och utanför den externa brandväggen, interna stamnät); den fjärde (kritiska delnät som personal- och ekonomisystem) är utelämnad. Boken säger "a common location" om platsen innanför brandväggen, inte "den vanligaste".
- Ordlistan: "Intruder" ligger nära kap. 1:s Key Term "intrusion"/"inside attack". Om kap. 1:s utkast tar "Intrusion" krockar det inte, men definitionerna bör stämmas av. "Signature detection" nämner misuse detection och rule-based heuristic identification för att täcka bokens tre närliggande Key Terms (signature approaches, signature detection, rule-based heuristic identification) i en term. "Business e-mail compromise (BEC)" står i body men inte i ordlistan (taket 15).
- "Supply-chain attack" nämns i förbigående i kapitlet om malicious software; om det kapitlets ordlista får termen blir det en dubblett.

Medvetet utelämnat: Verizons andelar insiders/outsiders, Table 8.1:s detaljerade exempel, ransomware och Colonial Pipeline (finns i kapitlet om malicious software), Andersons studie i detalj, IDS-kravlistan från [BALA98] (nio krav; tänkbar fråga "vilket är inte ett krav"), maskininlärningsmetoderna (Bayesian networks, Markov models m.fl.), HIDS-detaljer (STIDE, DLL-problemet i Windows, Tripwire), distributed HIDS-arkitekturen (host agent, LAN monitor, central manager, HAR), WIDS, stateful protocol analysis, loggfälten för larm, Intels autonomic enterprise security och gossip-protokollet, hela 8.7 (IDMEF, IDXP, RFC 4765–4767 och modellens roller), honeyfiles, Snorts arkitektur (decoder, detection engine, logger, alerter), regelsyntax och regelåtgärder, samt kapitlets Problems.

Frågor: 8 st, varav en variant: sak-bok8-v15 (sak-15) frågar via ett scenario med en IDS på databasservrar och har IPS, brandvägg och honeypot som nya distraktorer; rätt alternativ är omformulerat ("Detect possible intrusions, log them and alert"). Övriga: IDS:ens tre delar, false negatives vid snäv tolkning, base-rate fallacy, anomaly detection och zero-day, HIDS mot NIDS, inline mot passive (IDS/IPS-vinkeln) och high- mot low-interaction honeypot. Rätt position 2/2/2/2. Ingen fråga om intruders fyra klasser eller stegen i ett intrång (taket åtta frågor); en fråga om activists/hacktivists vore ett naturligt tillägg.`;
