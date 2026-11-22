// Bokens kapitel 7: Stallings & Brown, Denial-of-Service Attacks (s. 372–416).
// Kapitel, ämne, ordlista och frågor; samlas av reading.js, topics.js och
// questions.js via bok/index.js. Skrivet med egna ord på tentans nivå,
// granskat mot boken 22 nov 2026 (ogranskat av Kasper). `notes` är
// källanteckningarna och visas inte.

const variant = (id, what) => ({ variantOf: id, source: `Variant av en tentafråga från förra året (${what})` });

export const chapter = {
  id: "bok7",
  kind: "bok",
  label: "Bokens kapitel 7",
  examArea: "Bokfrågor",
  title: "Denial-of-service-attacker",
  readingMinutes: 11,
  lead: "Hur en angripare gör en tjänst otillgänglig genom att tömma en resurs, varför förfalskade adresser och botnet gör attacken svår att stoppa, och hur man försvarar sig.",
  sources: ["Stallings & Brown kap. 7 (s. 372–416)"],
  body: `
## Kärnan

- En **denial-of-service (DoS)**-attack angriper availability. Den försöker hindra eller helt stoppa en tjänst genom att tömma en resurs som tjänsten behöver.
- Tre slags resurser kan tömmas: **network bandwidth**, **system resources** och **application resources**.
- Den enklaste formen är en **flooding attack**: mer trafik än målet klarar. Angriparen döljer sig ofta genom att förfalska avsändaradressen.
- Med många datorer blir attacken större och svårare att spåra, antingen som **DDoS** från ett botnet eller som **reflection** och **amplification** via vanliga servrar.
- DoS går inte att förhindra helt. Försvaret har fyra linjer, och grundskyddet är att stoppa förfalskade avsändaradresser nära källan.

## Vad en DoS-attack är

Availability, en av de tre delarna i CIA-triaden (se Föreläsning 1), betyder att system och tjänster går att använda när behöriga användare behöver dem. En DoS-attack försöker slå ut just det. Boken använder NIST:s definition: en handling som "prevents or impairs the authorized use" av nät, system eller applikationer genom att tömma resurser som processorkraft, minne, bandbredd och diskutrymme.

- Att DoS gör en tjänst otillgänglig var svaret på en av förra årets tentafrågor.
- Inga data läcker eller ändras. Det som går förlorat är tillgången till tjänsten.
- Motiven är bland annat utpressning, hacktivism och statliga angrepp. Attackerna är vanliga eftersom de är lätta att sätta upp, svåra att stoppa och mycket effektiva.

| Resurs | Vad attacken gör | Exempel |
|---|---|---|
| **Network bandwidth** | fyller länken mellan organisationen och internet, så att routern måste kasta paket och den giltiga trafiken försvinner i mängden | flooding attacks |
| **System resources** | överbelastar eller kraschar programvaran som hanterar nätverkstrafiken, till exempel tabellen över öppna anslutningar | SYN spoofing; en **poison packet**, som utlöser en bugg och kraschar systemet |
| **Application resources** | skickar många giltiga men kostsamma förfrågningar till en applikation, till exempel tunga databasfrågor till en webbserver | HTTP flood, Slowloris |

## Flooding och source address spoofing

Den enklaste klassiska DoS-attacken är en **flooding attack**. Angriparen skickar mer trafik än länken till målet klarar, routern före den smala länken måste kasta paket, och den giltiga trafiken har liten chans att komma fram. Nästan vilken pakettyp som helst duger, men tre är vanligast:

| Attack | Idé |
|---|---|
| **ICMP flood** | en flod av ICMP-paket, klassiskt ping. När ping stoppas i brandväggen byter angriparen till ICMP-typer som måste släppas igenom för att nätet ska fungera. |
| **UDP flood** | en flod av UDP-paket mot någon tjänst på målet, till exempel en diagnostiktjänst |
| **SYN flood** | en flod av förfrågningar om att öppna TCP-anslutningar, där det är mängden trafik som ska fylla länken |

Med sin egen adress som avsändare kan angriparen identifieras, och målets svar kommer tillbaka till hens egen dator. Därför förfalskar angriparen ofta avsändaradressen, **source address spoofing**.

- **Svårare att spåra:** paketen ser ut att komma från hela internet. För att hitta källan måste nätteknikerna längs vägen följa trafiken genom sina routrar, ett manuellt och tidskrävande arbete.
- **Varför det går:** TCP/IP kontrollerar inte att avsändaradressen är äkta. Routrar kan filtrera bort falska adresser, men många ISP:er gör det inte.
- **Backscatter traffic:** målets svar på de spoofade paketen sprids till alla de förfalskade adresserna. Forskare bevakar oanvända IP-adresser, dit ingen legitim trafik borde komma, och ser därför vilka attacker som pågår och hur stora de är.

**SYN spoofing** är den andra klassiska attacken. Den angriper system resources: angriparen skickar förfrågningar om TCP-anslutningar från falska adresser som aldrig svarar, tills serverns tabell över påbörjade anslutningar är full och riktiga användare avvisas. Till skillnad från en SYN flood räcker det med lite trafik.

## DDoS: botnet och zombies

En enda dator kan bara skicka en begränsad mängd trafik och är lätt att spåra. I en **distributed denial-of-service (DDoS)**-attack används därför många datorer på en gång.

- Angriparen tar över vanliga datorer med malware och installerar ett attackprogram. De kapade datorerna kallas **zombies**, och många zombies under en angripares kontroll bildar ett **botnet**, som också kan hyras. Hur datorerna smittas och fjärrstyrs står i kapitlet om malicious software.
- Varje zombie behöver inte vara stark; mängden gör jobbet. Mellanleden gör också angriparen svårare att hitta.
- Oftast finns en kontrollhierarki: angriparen styr några få **handlers**, som i sin tur styr ett stort antal **agents**.
- Mirai-attacken 2016 mot DNS-leverantören Dyn kom från över 100 000 kapade IoT-enheter, som webbkameror och hemroutrar.

Det bästa sättet att inte bli en ovetande del av en DDoS-attack är att hålla de egna systemen säkra och uppdaterade.

## Application-based bandwidth attacks

Här får angriparen målet att göra mycket arbete för en liten insats, till exempel en lång sökning för en enkel förfrågan.

- **SIP flood:** mängder av förfrågningar om att starta internetsamtal (VoIP). Varje förfrågan kräver mycket av servern, och mottagarna översvämmas av falska samtal.
- **HTTP flood:** oftast ett botnet som bombarderar en webbserver med förfrågningar, till exempel om att ladda ner stora filer.
- **Slowloris:** öppnar många anslutningar till en webbserver och skickar förfrågningar som aldrig blir färdiga, tills alla anslutningar är upptagna. Trafiken är giltig HTTP, så signaturbaserade IDS och IPS känner inte igen den.

## Reflection och amplification

I DDoS är mellanhänderna kapade datorer som kör angriparens program. I reflection- och amplification-attacker är mellanhänderna i stället vanliga servrar som fungerar helt normalt. Tricket är spoofing: angriparen skickar förfrågningar med *målets* adress som avsändare, och servrarnas svar går därför till målet.

| | **Reflection attack** | **Amplification attack** |
|---|---|---|
| Mellanhand | en server med en allmänt tillgänglig tjänst, en **reflector** | alla värdar på ett nät, nådda via en **directed broadcast**, eller DNS-servrar |
| Svar per förfrågan | ett svar; angriparen väljer gärna tjänster vars svar är större än förfrågan | många svar, ett från varje värd på nätet, eller ett svar som är många gånger större än förfrågan |
| Exempel | DNS- och echo-tjänster; en attack mot Google 2017 använde 180 000 servrar, bland annat DNS-servrar | smurf-programmet (ping till ett nätverks broadcast-adress), DNS amplification |

- **Amplification** är alltså en variant av reflection där varje förfrågan ger *flera* svar.
- I en **DNS amplification attack** ger en liten DNS-förfrågan ett mycket större svar. Här kommer förstärkningen från svarets storlek, inte från många svarande datorer.
- Mellanhänderna är ofta välanslutna servrar, så attacktrafiken göms i deras normala trafik.

Två saker skiljer reflection-attacker från vanlig flooding:

- **Ingen backscatter.** Alla svar går till målet, så attackerna syns inte för forskare som bevakar oanvända adresser.
- **Spoofing är ett måste.** Om förfalskade avsändaradresser filtreras bort blir reflection och amplification omöjliga. Flooding, SYN spoofing och DDoS kan däremot lyckas även med riktiga adresser.

## Flash crowd: överbelastning utan angripare

Även helt legitim trafik kan slå ut en tjänst. När en webbplats plötsligt får stor publicitet, eller under stora evenemang som OS, kan besökarna bli fler än servern och länken klarar. Det kallas **flash crowd**. Att bli **slashdotted** kommer av att en länk på nyhetssajten Slashdot ofta överbelastade sidan den pekade på.

- En flash crowd är ingen attack, men följden blir densamma som vid DoS: tjänsten blir otillgänglig.
- Den visar varför DoS inte går att förhindra helt. Tillräckligt mycket giltig trafik överbelastar vilken anslutning som helst.
- Det vanliga svaret är extra bandbredd och kopior av servrarna på flera platser. Det kostar mycket.

## Försvarets fyra linjer

| Linje | När | Vad den gör |
|---|---|---|
| **Attack prevention and preemption** | före attacken | låter offret tåla attacken utan att neka legitima användare, till exempel med regler för resursförbrukning och reservresurser som kopplas in vid behov |
| **Attack detection and filtering** | under attacken | upptäcker attacken när den börjar, genom misstänkta mönster, och filtrerar bort paket som troligen hör till den |
| **Attack source traceback and identification** | under och efter | försöker hitta källan för att förhindra nya attacker, men ger sällan svar tillräckligt snabbt för att stoppa en pågående attack |
| **Attack reaction** | efter attacken | försöker eliminera eller begränsa effekterna |

De viktigaste förebyggande åtgärderna:

- **Antispoofing-filter nära källan.** Kundernas ISP vet vilka adresser som är giltiga och ska stoppa paket med falsk avsändare. Det är en av de äldsta och mest grundläggande rekommendationerna.
- **Filtrera uppströms.** Skydd mot flooding måste sitta i ISP:ns nät, eftersom organisationens egen router sitter efter den länk som översvämmas.
- **Begränsa takten** (rate limiting) för till exempel ICMP-paket, och släpp inte in directed broadcasts utifrån.
- **Skydda applikationerna,** till exempel med en captcha som skiljer människor från automatiska förfrågningar.
- **Håll de egna systemen säkra,** så att de inte blir zombies eller mellanhänder, och spegla viktiga servrar på flera platser.

Mot SYN spoofing finns **SYN cookies**, där servern inte sparar något förrän anslutningen är upprättad, och **random drop**, som slänger en slumpvis vald ofullständig anslutning när tabellen är full.

I Föreläsning 2 står DDoS-skydd bland kontrollerna i nätverkslagret (network security) i data center security model.

## När en attack upptäcks

Förberedelserna avgör hur det går. Organisationen behöver en **incident response plan** med kontaktuppgifter till ISP:ns tekniker, som går att nå utan nätet. Den behöver också övervakning och kunskap om hur den normala trafiken ser ut (se kapitlet om intrusion detection). Annars kommer första signalen från användare som klagar.

När attacken väl är upptäckt:

1. **Identifiera typen av attack** genom att fånga och analysera inkommande paket, själv eller med ISP:ns hjälp. Det liknar Detection and Analysis, första steget i incidenthanteringen i Föreläsning 2.
2. **Filtrera bort attacken.** Flooding kan bara stoppas uppströms, så ISP:n installerar filtren i sina routrar. Utnyttjar attacken en bugg rättar man buggen.
3. **Spåra källan** via ISP:n om man vill. Det är svårt med spoofade adresser och görs främst om attacken ska polisanmälas.
4. **Byt plats om filtren inte räcker:** gå över till reservservrar eller sätt upp nya servrar på en ny plats med nya adresser.
5. **Lär av händelsen** och förbättra säkerheten.
`,
};

export const topic = {
  id: "bok7-dos",
  name: "Denial-of-service-attacker",
  chapter: "bok7",
  examWeight: "hög",
  summary: "En DoS-attack angriper availability genom att tömma en resurs: bandbredd, systemresurser eller applikationsresurser. Flooding, ofta med förfalskade avsändaradresser, är den klassiska formen. DDoS använder ett botnet av zombies, medan reflection och amplification låter vanliga servrar skicka svaren till målet. DoS går inte att förhindra helt, och försvaret har fyra linjer: prevention, detection and filtering, traceback och reaction.",
  keyPoints: [
    "Denial of service (DoS): angriper availability genom att tömma en resurs som tjänsten behöver.",
    "Tre resurstyper: network bandwidth, system resources och application resources.",
    "Flooding attack: mer trafik än länken till målet klarar, ofta ICMP-, UDP- eller SYN-paket.",
    "Source address spoofing: förfalskad avsändare döljer angriparen; svaren sprids som backscatter traffic.",
    "DDoS: många zombies i ett botnet, styrda via handlers, angriper på en gång.",
    "Reflection attack: vanliga servrar svarar till målets förfalskade adress.",
    "Amplification attack: varje förfrågan ger många svar, eller i DNS amplification ett mycket större svar.",
    "Flash crowd (slashdotted): legitim överbelastning vid stor publicitet, ingen attack.",
    "Försvarets fyra linjer: prevention, detection and filtering, traceback och reaction.",
  ],
  pitfalls: [
    "DoS angriper availability; inga data läcker (confidentiality) eller ändras (integrity).",
    "I DDoS kör mellanhänderna angriparens program (zombies); i reflection och amplification är de vanliga servrar som fungerar normalt.",
    "Reflection ger ett svar per förfrågan; amplification ger många svar, eller ett mycket större svar.",
    "Reflection-attacker ger ingen backscatter och kräver spoofing; flooding och DDoS kan lyckas med riktiga adresser.",
    "En flash crowd är legitim trafik, inte en DDoS-attack, även om följden blir densamma.",
  ],
};

export const glossary = [
  { term: "Denial of service (DoS)", definition: "Angrepp på availability som hindrar eller stoppar behörig användning av nät, system eller applikationer genom att tömma resurser som bandbredd, minne eller processorkraft.", chapter: "bok7" },
  { term: "Distributed denial of service (DDoS)", definition: "DoS-attack från många datorer på en gång, oftast zombies i ett botnet som styrs via handlers. Ger mer trafik och gör angriparen svårare att spåra.", chapter: "bok7" },
  { term: "Flooding attack", definition: "DoS-attack som skickar mer trafik än länken till målet klarar, så att giltig trafik kastas. Vanliga former är ICMP flood, UDP flood och SYN flood.", chapter: "bok7" },
  { term: "SYN spoofing", definition: "Attack på system resources: förfalskade förfrågningar om TCP-anslutningar fyller serverns tabell över påbörjade anslutningar, så att riktiga användare avvisas. Kräver lite trafik.", chapter: "bok7" },
  { term: "Source address spoofing", definition: "Att förfalska avsändaradressen i paket. Döljer angriparen och används i reflection-attacker för att styra svaren till målet.", chapter: "bok7" },
  { term: "Backscatter traffic", definition: "Svar på paket med förfalskade avsändaradresser, som sprids till de adresserna över internet. Visar forskare vilka flooding- och SYN spoofing-attacker som pågår, men inte reflection-attacker.", chapter: "bok7" },
  { term: "Botnet", definition: "Ett nät av kapade datorer (zombies) som en angripare fjärrstyr, till exempel för DDoS-attacker. Botnet hyrs också ut.", chapter: "bok7" },
  { term: "Zombie", definition: "En dator som en angripare tagit över med malware och installerat ett attackprogram på, så att den kan användas i till exempel en DDoS-attack.", chapter: "bok7" },
  { term: "Reflection attack", definition: "Angriparen skickar förfrågningar med målets adress som förfalskad avsändare till vanliga servrar (reflectors), och deras svar går då till målet.", chapter: "bok7" },
  { term: "Amplification attack", definition: "Variant av reflection där varje förfrågan ger många svar, till exempel genom en directed broadcast som når alla värdar på ett nät.", chapter: "bok7" },
  { term: "Directed broadcast", definition: "En förfrågan till ett nätverks broadcast-adress, så att alla värdar på nätet kan svara. Används i amplification-attacker och bör inte släppas in utifrån.", chapter: "bok7" },
  { term: "DNS amplification attack", definition: "Amplification via DNS-servrar: en liten förfrågan ger ett mycket större svar, som skickas till målets förfalskade adress.", chapter: "bok7" },
  { term: "Flash crowd", definition: "Legitim överbelastning när mycket många riktiga användare besöker en webbplats samtidigt, till exempel efter stor publicitet. Kallas också att bli slashdotted. Ingen attack, men samma följd som vid DoS.", chapter: "bok7" },
];

export const questions = [
  { id: "sak-bok7-v18", topic: "bok7-dos", difficulty: 1, ...variant("sak-18", "DoS gör en tjänst otillgänglig"),
    question: "An online shop is flooded with so many bogus requests that real customers cannot reach it. Which security goal is under attack?",
    options: [
      { text: "Confidentiality", explain: "Confidentiality skyddar data mot obehöriga. Vid en DoS-attack läcker inga data; tjänsten blir bara oåtkomlig." },
      { text: "Data integrity", explain: "Integrity handlar om att data inte ändras obehörigt, och en flod av förfrågningar ändrar inga data." },
      { text: "Availability", explain: "En DoS-attack tömmer en resurs så att behöriga användare inte kommer åt tjänsten. Det är availability som drabbas." },
      { text: "Authenticity", explain: "Authenticity betyder att en användare eller källa är den den utger sig för att vara. Överbelastningen i sig hotar inte det." },
    ],
    correct: 2, reviewed: false },

  { id: "sak-bok7-01", topic: "bok7-dos", difficulty: 1,
    question: "A denial-of-service attack tries to exhaust a critical resource. Which three categories of resources can it target?",
    options: [
      { text: "Network bandwidth, system and application resources", explain: "Bandbredden på länken till internet, systemets resurser för att hantera nätverkstrafik och applikationens resurser, till exempel i en webbserver." },
      { text: "Confidentiality, integrity and availability of data", explain: "Det är CIA-triadens tre mål, inte resurser. En DoS-attack angriper bara availability." },
      { text: "ICMP, UDP and TCP SYN packets sent in a flood", explain: "Det är de vanligaste pakettyperna i flooding attacks, alltså angriparens verktyg, inte resurserna som töms." },
      { text: "Handlers, agents and the reflectors they use", explain: "Det är delar av angriparens infrastruktur i DDoS- och reflection-attacker, inte resurser hos målet." },
    ],
    correct: 0, source: "Bokens kapitel 7 (tre resurstyper)", reviewed: false },

  { id: "sak-bok7-02", topic: "bok7-dos", difficulty: 2,
    question: "What is backscatter traffic in the context of DoS attacks?",
    options: [
      { text: "Replies from reflectors that all go to the real target", explain: "Så fungerar en reflection attack, och just därför ger den ingen backscatter: alla svar går till målet." },
      { text: "Replies to spoofed packets, sent to forged addresses", explain: "Målets svar sprids till de förfalskade adresserna över hela internet. Forskare som bevakar oanvända adresser kan därför se vilka attacker som pågår." },
      { text: "Commands that handlers pass on to the zombie agents", explain: "Det är styrtrafiken i ett botnet under en DDoS-attack." },
      { text: "A sudden surge of real visitors after publicity", explain: "Det är en flash crowd, legitim överbelastning och ingen attack." },
    ],
    correct: 1, source: "Bokens kapitel 7 (backscatter traffic)", reviewed: false },

  { id: "sak-bok7-03", topic: "bok7-dos", difficulty: 1,
    question: "In a distributed denial-of-service (DDoS) attack, what is a zombie?",
    options: [
      { text: "A normal server that reflects replies to the target", explain: "Det är en reflector i en reflection attack. Den fungerar normalt och kör inget program från angriparen." },
      { text: "An unused address block that researchers monitor", explain: "Sådana adressblock används för att fånga backscatter traffic." },
      { text: "A forged source address that no real host uses", explain: "Det beskriver source address spoofing, där angriparen gärna väljer adresser som ingen dator svarar från." },
      { text: "A compromised computer running the attacker's agent", explain: "Angriparen har tagit över datorn med malware och styr den, ofta via handlers. Många zombies bildar ett botnet." },
    ],
    correct: 3, source: "Bokens kapitel 7 (zombie och botnet)", reviewed: false },

  { id: "sak-bok7-04", topic: "bok7-dos", difficulty: 2,
    question: "How does a reflection attack differ from a DDoS attack that uses a botnet?",
    options: [
      { text: "Its intermediaries are normal servers working as usual", explain: "Reflectors är vanliga servrar som bara svarar på förfrågningar. Angriparen förfalskar avsändaradressen så att svaren går till målet." },
      { text: "Its intermediaries run attack agents installed by malware", explain: "Det beskriver DDoS, där mellanhänderna är zombies som kör angriparens program." },
      { text: "It succeeds without forging any source addresses", explain: "Tvärtom: reflection kräver spoofing och blir omöjlig om förfalskade adresser filtreras bort. Det är DDoS som kan lyckas med riktiga adresser." },
      { text: "It leaves backscatter traffic all over the Internet", explain: "Reflection ger ingen backscatter, eftersom alla svar går till målet." },
    ],
    correct: 0, source: "Bokens kapitel 7 (reflection och DDoS)", reviewed: false },

  { id: "sak-bok7-05", topic: "bok7-dos", difficulty: 3,
    question: "What makes an amplification attack different from a simple reflection attack?",
    options: [
      { text: "The replies go back to the attacker's own address", explain: "Det händer vid en flood utan spoofing, och det är därför angripare förfalskar avsändaren. I båda attackerna går svaren till målet." },
      { text: "The intermediaries are zombies run by handlers", explain: "Det är DDoS. I både reflection och amplification är mellanhänderna vanliga servrar som fungerar normalt." },
      { text: "It fills the target's table of pending connections", explain: "Det är SYN spoofing, som angriper system resources med lite trafik." },
      { text: "Each request triggers many replies to the target", explain: "Via en directed broadcast svarar alla värdar på ett nät. I DNS amplification kommer förstärkningen i stället från att svaret är mycket större än förfrågan." },
    ],
    correct: 3, source: "Bokens kapitel 7 (reflection och amplification)", reviewed: false },

  { id: "sak-bok7-06", topic: "bok7-dos", difficulty: 1,
    question: "A popular news site links to a small company's web server, and the flood of real visitors makes it stop responding. What is this called?",
    options: [
      { text: "A distributed denial-of-service attack", explain: "I en DDoS-attack kommer trafiken från zombies som angriparen styr. Här är besökarna riktiga." },
      { text: "A flash crowd, or being slashdotted", explain: "Legitim överbelastning vid stor publicitet. Det är ingen attack, men användarna drabbas på samma sätt som vid DoS." },
      { text: "A reflection attack through the news site", explain: "Ingen avsändaradress är förfalskad och nyhetssajten skickar inga svar till servern; det är läsarna själva som kommer." },
      { text: "An application-based bandwidth attack", explain: "Det är en avsiktlig attack som får servern att göra kostsamt arbete, inte vanliga besökare." },
    ],
    correct: 1, source: "Bokens kapitel 7 (flash crowd)", reviewed: false },

  { id: "sak-bok7-07", topic: "bok7-dos", difficulty: 2,
    question: "Which line of defense against DDoS attacks seldom gives results fast enough to stop an attack that is under way?",
    options: [
      { text: "Prevention, before the attack", explain: "Attack prevention and preemption verkar före attacken, till exempel med reservresurser, så att offret tål den." },
      { text: "Detection and filtering, during it", explain: "Attack detection and filtering verkar just under attacken: den upptäcks när den börjar och paketen filtreras bort direkt." },
      { text: "Traceback, during and after it", explain: "Attack source traceback and identification försöker hitta källan för att förhindra nya attacker, men går oftast för långsamt för att hjälpa mot en pågående." },
      { text: "Reaction, after the attack", explain: "Attack reaction kommer efter attacken och försöker eliminera eller begränsa effekterna." },
    ],
    correct: 2, source: "Bokens kapitel 7 (försvarets fyra linjer)", reviewed: false },
];

export const notes = `Byggt på kap. 7 i del1-filen, s. 372–416: inledningen och 7.1 (NIST-definitionen, de tre resurstyperna, poison packet, motiv, klassisk flooding, source address spoofing, backscatter, SYN spoofing som idé), 7.2 (ICMP/UDP/SYN flood bara som namn och idé, skillnaden SYN flood mot SYN spoofing), 7.3 (zombies, botnet, handlers/agents, botnet för uthyrning, Mirai/Dyn ur 7.1), 7.4 kort (SIP flood, HTTP flood, Slowloris), 7.5 (reflection, amplification via directed broadcast, DNS amplification, ingen backscatter, spoofing som förutsättning), 7.6 (flash crowd/slashdotted, de fyra försvarslinjerna, antispoofing, filtrering uppströms, rate limiting, captcha, SYN cookies och random drop i en mening), 7.7 (förberedelser och stegen när en attack upptäcks). Key Terms och Review Questions 7.1–7.18 styrde urvalet.

Osäkert:
- Reflection mot amplification: boken säger att amplification skiljer sig genom "multiple response packets for each original packet sent". Att reflection ger ett svar per förfrågan är min tolkning av kontrasten; boken säger också att angriparen gärna väljer tjänster med större svar än förfrågan, vilket står med i tabellen. DNS amplification förstärker i stället genom svarets storlek (boken kontrasterar det uttryckligen mot de ursprungliga amplifier-attackerna), så fråga 05 och dess förklaring tar upp båda.
- "Ingen backscatter" säger boken om reflection attacks. Kapitlet säger det om reflection-attacker i allmänhet; amplification är enligt boken en variant av reflection ("like all the reflection-based attacks"), men saknad backscatter sägs inte uttryckligen om den.
- Google-attacken 2017: boken skriver "180000 exposed CLDAP, DNS, and SMTP servers". Kapitlet säger "180 000 servrar, bland annat DNS-servrar" och nämner inte SMTP, som kan vara ett skrivfel för SNMP.
- Exemplen i resurstabellen: bokens exempel på attack mot application resources i 7.1 är cyberslam (tunga databasfrågor). Att HTTP flood och Slowloris står i samma ruta är min indelning; boken beskriver dem i 7.4 som attacker som utnyttjar oproportionerligt stor resursförbrukning hos servern (Slowloris tar alla webbserverns anslutningar).
- Ordlistan: "denial of service" är också Key Term i kap. 1. Krockar det med kap. 1:s ordlista bör termen ligga här, där den är kapitlets kärna.

Medvetet utelämnat: siffror om attackernas storlek (400 Mbps till 3,47 Tbps), WikiLeaks 2010, BBC 2015, avledningsattacker mot banker, naturkatastrofer som avgränsning, raw socket-gränssnittet, three-way TCP handshake (Key Term) i detalj (SYN-ACK, RST, sekvensnummer), ping of death och teardrop, cyberslam som namn, TFN/TFN2K och IRC-styrning, SIP INVITE-flödet, recursive HTTP flood (spidering), Slowloris protokolldetaljer och motåtgärder (rate limit per värd, timeouts, delayed binding), DNS-reflektionsloopen via port 7, reflection via TCP SYN och GRC.com 2002, smurf/fraggle utöver ett namn, open recursive DNS servers, bytesiffrorna för DNS (60/512/4000), RFC 2827 och RFC 5358, Ciscos reverse-path-kommando, SYN cookies tekniska detaljer och nackdelar, ändrade tabellstorlekar och timeouts, flash event, Problems 7.1–7.8. Key Terms ICMP, ICMP flood, UDP flood, SYN flood, SYN cookie, random drop, poison packet och slashdotted står bara i löptexten (slashdotted också i definitionen av flash crowd); availability finns redan i ordlistan (Föreläsning 1).

Frågor: 8 st, varav varianten sak-bok7-v18 (samma begrepp som originalet men från andra hållet: scenariot är givet, och man ska välja säkerhetsmålet availability bland confidentiality, integrity och authenticity; inget alternativ är ordagrant detsamma som i originalet). Rätt position 2/2/2/2.`;
