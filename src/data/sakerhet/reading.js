// Kompendiet (löptext) och ordlistan för Säkerhet i informationssystem.
//
// Två sorters kapitel, märkta med `kind`:
//   "forelasning" — ett per föreläsning, skrivet ur bilderna (kontrollerade
//                   mot Fö2-PDF:en som bilder 22 nov 2026) och gästföreläsarens
//                   egna bilder. Tentans "5 frågor från föreläsningsbilderna".
//   "bok"         — ett per kapitel i Stallings & Brown, Computer Security
//                   (5:e uppl.), på tentans nivå: definitioner, indelningar och
//                   skillnader, med egna ord. Tentans "8 frågor från boken".
// `kind` avgör provtentans pooler; `label` ersätter "Kapitel N av M" i Läs
// ("Föreläsning 2", "Bokens kapitel 4"); `examArea` blir taggen i listan.
//
// Ansvarsfördelning som i de andra delkurserna: löptexten och ordlistan ägs
// HÄR, de korta punkterna (keyPoints, pitfalls) av topics.js. Kapitlen
// numreras efter platsen i ORDER, så ett nytt kapitel kan stoppas in var som
// helst; id:na är stabila (lästa kapitel och svar hänger på id). Läsartext
// hänvisar till andra kapitel med titel, aldrig nummer.
//
// Ny föreläsning = ett nytt kapitel här (kind "forelasning", label), ett ämne
// i topics.js, frågor i questions.js och id:t i ORDER efter de andra
// föreläsningarna.
//
// Kända avvikelser i källorna (se HANDOFF):
// - Fö2:s "The Hack Apocalyps" säger att file infector-virus fäster vid
//   körbara filer "(excel for instance)". Boken räknar virus i dokument som
//   Excel till macro virus. Kapitlet följer boken och påpekar det.
// - Fö2 skriver ut SASN som "Security Architecture for Smart Networks". I
//   boken (kap. 14) är SASN13 Standards Australia/Standards New Zealands
//   handbok om säkerhetsrisker. Kapitlet återger bilden och nämner boken.
import { BOOK_CHAPTERS } from "./bok/index.js";
export { summary } from "./summary.js";

const FO = "Föreläsningsfrågor";

export const CHAPTER_TOPICS = {
  fo1: { topics: ["digitalt"], primaryTopics: ["digitalt"] },
  fo2: { topics: ["risk-privacy"], primaryTopics: ["risk-privacy"] },
  alm: { topics: ["offensiv"], primaryTopics: ["offensiv"] },
  // Bokkapitlen: ett ämne var (bok/<id>.js).
  ...Object.fromEntries(BOOK_CHAPTERS.map((b) => [b.chapter.id, { topics: [b.topic.id], primaryTopics: [b.topic.id] }])),
};

// Läsordningen: föreläsningarna, sedan bokens kapitel i bokens ordning.
export const ORDER = ["fo1", "fo2", "alm", ...BOOK_CHAPTERS.map((b) => b.chapter.id)];

export const intro =
  "Kompendiet har två delar, efter tentans upplägg: först föreläsningarna, sedan bokens kapitel (Stallings & Brown, Computer Security). Föreläsningskapitlen följer bilderna, bokkapitlen tar det som går att fråga om i flervalsform: definitioner, indelningar och skillnader. Räkna med ungefär {lästid} för hela texten. Termerna står på engelska, eftersom tentan och boken använder dem.";

export const examNote = {
  text: "Salstenta torsdag 3 december 08–13 i MA 10, utan hjälpmedel. 20 frågor, 100 poäng: 5 som liknar förra årets (3 p), 5 från föreläsningsbilderna (3 p), 8 från bokens kapitel (5 p) och 2 essäer (15 p, högst 700 ord). Fel svar på de slutna frågorna ger −1. Kapitlen märkta Lärarens fokus är de ämnen läraren pekat ut.",
  source: "lärarens anslag på Canvas 24 nov",
};

const rawChapters = {
  fo1: {
    id: "fo1",
    kind: "forelasning",
    label: "Föreläsning 1",
    examArea: FO,
    title: "Informationssäkerhet i det digitala samhället",
    readingMinutes: 6,
    lead: "Varför informationssäkerhet spelar roll: samhället har blivit digitalt på djupet, utmaningarna växer och insatserna mäts i biljoner dollar.",
    sources: ["Föreläsning 1 (Kajtazi 6 nov 2026)"],
    body: `
## Kärnan

Föreläsningen är en enda argumentkedja:

1. **Samhället har blivit digitalt på djupet.** På tre decennier har vi fått en ny social struktur, en ny ekonomi och en ny kultur.
2. **Tekniken accelererar.** Informationen färdas snabbare än någonsin.
3. **Framstegen ger nya, växande utmaningar:** informationsöverflöd, övervakning, cyberattacker och AI-agenter.
4. **Insatserna är enorma.** Nästan alla är uppkopplade, och cyberbrotten kostar biljoner dollar om året.
5. **Därför behövs informationssäkerhet**, som delas in i CIA-triaden.
6. **Utmaningarna hänger ihop** och måste hanteras som en helhet.

## Tre decennier av förändring

Castells (1996, 2009) beskriver vad de senaste trettio åren har gett samhället:

| Förändring | Castells term |
|---|---|
| En ny social struktur | the networked society |
| En ny ekonomi | informational capitalism |
| En ny kultur | the Internet |

Föreläsningen ställer 90-talets cd-skiva mot 20-talets smartklocka: då låg data på en skiva i hyllan, nu bär vi den med oss hela tiden.

## Tekniken går allt fortare

- **Kushner (2015):** informationens hastighet över tid, från gående bud via häst, båt, flyg och tv till smartphonen. Kurvan är brantast nu.
- **Sagan (1994) och Miller (2014):** de tidiga förväntningarna gällde rymden, som Mars One.
- **Eagleman (2015):** det stora språnget blev i stället digitalt. Hans sensorväst gör ljud till vibrationer.

## De växande utmaningarna

| Utmaning | Föreläsningen hänvisar till |
|---|---|
| Information overload | Dean & Webb (2011) |
| Surveillance capitalism ("Google is watching you"), nu förstärkt av AI | Zuboff (2020) |
| Cyber attacks | Siponen (2013) |
| Autonoma AI-agenter som själva tar sig in i andra organisationers system | OpenAI/Hugging Face-incidenten, utredd av METR och Redwood Research (2026) |

Hugging Face-incidenten är samma händelse som inlämningsuppgiften om etisk reflektion handlar om.

## Vad står på spel?

Föreläsningens exempelfråga till tentan gällde de här siffrorna: *"Which is the Highest Industry Cost per Data Breach?"* Svaret är **Healthcare**, med i snitt 6,64 miljoner dollar per dataintrång. Bilden ger inga siffror för andra branscher.

| Mått | Siffra |
|---|---|
| Världens befolkning | 8,322 miljarder |
| Världsekonomin | cirka 108 biljoner euro per år (IMF 2026) |
| Cyberbrottens kostnad | 10,5 biljoner dollar 2025, väntas bli 15,63 biljoner 2029 |
| Dyraste bransch per dataintrång | Healthcare, i snitt 6,64 miljoner dollar (IBM 2026) |
| Internetanvändare | 6,15 miljarder, 73,9 % av befolkningen (oktober 2026) |
| Identiteter i sociala medier | 5,81 miljarder, 69,9 % |
| Användare av generativ AI per månad | 3,24 miljarder, 38,9 % |
| Unika mobilabonnenter | 5,86 miljarder, 70,4 % |

Två saker att hålla isär:

- **Trillion är biljon.** Engelskans "10.5 trillion" är 10,5 biljoner på svenska, alltså 10 500 miljarder.
- **Euro och dollar.** Världsekonomin anges i euro, cyberbrotten i dollar.

Andelen av världens befolkning som använder internet har ökat från 39,7 % 2015 till 68,7 % 2025.

## Därför: CIA-triaden

Enligt Wylder (2004) kan informationssäkerhet delas in i tre aspekter, **the CIA triad**:

- **Confidentiality:** information når inte obehöriga.
- **Integrity:** information ändras inte obehörigt och förblir korrekt och fullständig.
- **Availability:** information och system finns tillgängliga när de behövs.

CIA-triaden är kursens grundbegrepp och återkommer i resten av kompendiet.

## Utmaningarna hänger ihop

Föreläsningen slutar med Kandinskys målning *Composition VIII* (1923) och uppmaningen "Tackle the Challenges". Målningens sammanflätade former står för utmaningarna: säkerhet rör teknik, samhälle, ekonomi och etik på samma gång och måste hanteras som en helhet.
`,
  },

  fo2: {
    id: "fo2",
    kind: "forelasning",
    label: "Föreläsning 2",
    examArea: FO,
    title: "Risk, tillit, privacy och zero trust",
    readingMinutes: 12,
    lead: "Säkerhet som riskhantering, varför vår känsla för privatliv inte fungerar online, och hur en organisation planerar och bygger sitt skydd i lager.",
    sources: ["Föreläsning 2 (Kajtazi), Security in the Digital Age – Trust, privacy, and zero-trust thinking"],
    body: `
## Kärnan

- **Säkerhet är riskhantering:** man kartlägger tillgångar, hot och sårbarheter och väljer åtgärder.
- **I den digitala världen blir det privata offentligt,** genom övervakningskapitalism, automatiska riskbedömningar och ansiktsigenkänning.
- **Våra sinnen hjälper oss inte online.** Därför behöver organisationer struktur: en planeringsmodell, en säkerhetspolicy, standarder, en skala för konsekvenser och skydd i lager.

## Riskbedömningens fyra steg

Föreläsningen kallar processen RISK_ASSESSMENT_V2.0, "standard framework for digital vulnerability assessment":

| Steg | Vad man gör |
|---|---|
| 1. **Asset identification** | Katalogiserar all hårdvara, mjukvara och data. |
| 2. **Threat modeling** | Modellerar möjliga attackvägar och identifierar de viktigaste hotaktörerna, till exempel SQL injection eller cross-site scripting. |
| 3. **Vulnerability evaluation** | Skannar och testar systemen efter kända svagheter. |
| 4. **Mitigation strategy** | Inför tekniska kontroller som sänker den samlade riskexponeringen. |

Ordningen är logisk: man måste veta vad man har innan man kan fråga vem som vill åt det, var det är svagt och vad som ska göras.

Riskbedömningen är en del av **IT security management**. Bokens definition, som var svaret på en av förra årets tentafrågor: den formella process som tar fram och upprätthåller *lämpliga* säkerhetsnivåer ("appropriate levels") för organisationens tillgångar. Det sker genom att bevara sex egenskaper: confidentiality, integrity, availability, accountability, authenticity och reliability. "Lämpliga" betyder anpassade efter risken, inte så höga som möjligt.

## Security is a feeling vs. security is a reality

Rubriken (Schneier 2012) ställer känslan av säkerhet mot den faktiska säkerheten: de två behöver inte följas åt. Bilden **"The Evolutionary Trust"** visar ett kretslopp:

- rovdjuren utvecklar bättre attacker, vilket ökar risken för bytet
- bytet utvecklar bättre försvar, vilket ökar risken för rovdjuren
- och så vidare

Attack och försvar driver alltså varandra framåt.

## Det digitala rummet och Big Other

**Zuboff:** föreläsningen går från "The Physical Prison" till "The Digital Realm" och "The Fight to Control the Big Other". Big Other är Zuboffs bild av den digitala övervakningen. Senare i föreläsningen: **"Surveillance Capitalism in ACTION – A future without secrets IS HERE TO STAY".**

**Automated Targeting System (ATS):** tull- och gränsmyndigheter använder systemet för att automatiskt ge alla som reser in i eller ut ur ett land en riskpoäng. Bilden ställer tre frågor:

| Fråga | Svar |
|---|---|
| Kan du få veta vilken bedömning du fick? | Nej. |
| Kan du få veta din poäng? | Nej, den är konfidentiell. |
| Kan du ifrågasätta den? | Nästan omöjligt, eftersom systemet är byggt för minimal transparens. |

**Tim Berners-Lee** (Web Summit) har en vision om en "pro-human web" med **data wallets**, där människor själva har sina data.

## Vad privacy betyder

**Introna (1997)** ger privacy tre betydelser:

1. ingen åtkomst till personen eller den personliga sfären (no access to the person or personal realm)
2. kontroll över personlig information (control over personal information)
3. frihet från andras bedömning och granskning (freedom from judgement or scrutiny by others)

**Acquisti m.fl. (2022) i Science:**

- **Offline** skyddar vi privatlivet med sinnena: vi sänker rösten i förtroliga samtal och täcker ett papper vi läser.
- **Online** hjälper de mekanismerna inte. Vi ser inte Google luta sig över axeln när vi söker.
- Ändå är vi troligen byggda för att lita på just de signalerna när vi bedömer vad ett beteende betyder för privatlivet.

**From private to public:**

- En influencer som delar sina barns liv på Instagram.
- Zuckerbergs uppmaning att ersätta "the metaverse" med "cyberspace".
- "Zuckerberg files", som talar om privacy-enhancing technologies och privacy-safe personalized ads.

**Clearview AI:**

- **Företaget beskriver sig själv:** bara offentlig information, "search, not surveillance", hjälper till att stoppa brottslingar.
- **Journalisten Kashmir Hill kallar det:** "an audacious attack on anonymity", ansiktsigenkänning ur en enda bild mot en enorm databas.

**Privacy och security:** att upprätthålla privacy är ofta ett av målen med säkerhetsåtgärder, och tekniker som kryptering skyddar privatlivet både i kommunikation och lagring.

## The Hack Apocalyps

Enligt Cybersecurity Ventures kostade cyberbrott världen 10,5 biljoner dollar 2025. Mätt som ett land vore cyberbrott **världens tredje största ekonomi, efter USA och Kina**. Bilden räknar upp fyra sorters skada:

| Skada | Exempel på bilden |
|---|---|
| Data skadas och förstörs | skadlig kod som utger sig för att vara legitim mjukvara, som en **Trojan horse** |
| Immateriella rättigheter stjäls | **phishing** |
| Pengar stjäls | **file infector viruses** som fäster vid körbara filer |
| Störningar efter attacken | försvårar både **Detection and Analysis** i incidenthanteringen och **Recovery Time Objective (RTO)** |

Bilden ger Excel som exempel på file infector-virus. **Boken säger något annat:** ett file infector virus infekterar körbara program, medan virus i dokument, som Excel-filer, är **macro virus**. Följ boken på tentan; förra årets tentor hade macro virus som felaktigt alternativ i frågan om file infector.

Två begrepp på bilden är gamla tentasvar:

- **Detection and Analysis** är det första steget i en incidentresponsplan. Sedan kommer containment (begränsa), eradication (ta bort orsaken) och recovery (återställa).
- **Recovery Time Objective (RTO)** är den längsta tid en tjänst får vara nere efter ett avbrott innan den måste vara återställd. RTO hör till kontinuitetsplaneringen.

## Rollbaserad åtkomst

Bilden säger att det är avgörande för organisationer att utveckla **role-based access control (RBAC)**: man definierar vilka roller användarna har i organisationen och knyter behörigheterna till rollerna. Det är svaret på en av förra årets tentafrågor.

## BankY-övningen

Scenariot: du är säkerhetsteamet på BankY, en medelstor bank som angrips av cyberkriminella som vill stjäla kunddata och störa driften. Hitta minst fyra sårbarheter inom fyra områden:

| Område | Exempel |
|---|---|
| Technical security | nätverk, kryptering, skadlig kod |
| Human security | social engineering, phishing, svaga lösenord |
| Physical security | obehörig åtkomst till servrar, bristande övervakning |
| Policies and governance | saknade policyer, dåliga incidentresponsplaner |

Grupperna arbetade med var sin fråga: Confidentiality, Integrity, Availability, Access control samt Authentication & authorization.

## Kan medvetenhet hjälpa?

Under rubriken "Can Interventions with Awareness help?" visar föreläsningen **Straub & Welkes** modell för säkerhetsplanering. Fem faser med en återkopplingsslinga:

1. Recognition of security problem or need
2. Risk analysis
3. Alternatives generation
4. Planning decision
5. Security implementation

Runt faserna står en Goodhue–Straub-modell, en Security Action Cycle, ett Security Awareness Program och en **Countermeasure Matrix** med raderna **deterrence, prevention, detection och remedies** (avskräcka, förebygga, upptäcka, åtgärda).

## Organisationens säkerhetspolicy

En **Organizational Security Policy** är ett ramverk för att skydda informationstillgångar, uppfylla regelkrav och minska operativa risker. Föreläsningen ger den tre delar:

| Del | Innehåll |
|---|---|
| 1. Access management | MFA och RBAC, så att principle of least privilege upprätthålls |
| 2. Data encryption | känsliga data skyddas **at rest** och **in transit** med starka kryptoprotokoll och hardware security modules (HSM) |
| 3. Incident response | formella rutiner för att upptäcka, rapportera och hantera intrång, så att påverkan och återställningstid blir så små som möjligt |

Policyn anger vad som ska skyddas, målen och vem som ansvarar. Utbildning och tekniska skydd är åtgärder som följer av den.

## Standarder och ramverk

| Standard | Vad den är enligt föreläsningen |
|---|---|
| **ISO/IEC 27005** | vägledning för riskhantering inom informationssäkerhet |
| **ISO 31000** | riktlinjer för hur organisationer hanterar risk |
| **NIST** | Cybersecurity Framework för kritisk infrastruktur |
| **NIS2** | EU-gemensam lagstiftning om cybersäkerhet |
| **SASN** | på bilden "Security Architecture for Smart Networks" |

Mini-uppgiften: en formell riskanalys drivs ofta av en **Detailed Risk Approach**, vägledd av ISO 27005, ISO 31000, NIST SP 800-30 och SASN13. Standarderna hjälper organisationen med allt från kostnad–nytta-analys till styrning, regelefterlevnad och medvetenhet. (I boken står SASN13 för en handbok om säkerhetsrisker från Standards Australia och Standards New Zealand.)

## Konsekvensskalan

"The Risk Consequence Likelihood" graderar konsekvensen av ett intrång från 1 till 6:

| Nivå | Consequence | Förklaring |
|---|---|---|
| 1 | Insignificant | ett mindre intrång, några dagars påverkan |
| 2 | Minor | intrång i ett eller två områden, upp till en veckas påverkan |
| 3 | Moderate | begränsade systematiska intrång, upp till två veckor |
| 4 | Major | pågående systematiska intrång, upp till två månader |
| 5 | Catastrophic | katastrofalt intrång som kan leda till politisk debatt och brottsutredning, tre månader eller mer |
| 6 | Doomsday | flera och fortlöpande intrång, brottsutredning internt som berör högsta ledningen, obestämd tid |

## Data center security model

| Lager | Fokus | Kontroller |
|---|---|---|
| **Data security** | skydda data mot obehörig åtkomst och manipulation | AES-256-kryptering, RBAC, Database Activity Monitoring, HSM |
| **Network security** | skydda data i transit och dela upp nätet | NGFW, mikrosegmentering, IDS/IPS, TLS 1.3, DDoS-skydd |
| **Physical security** | begränsa åtkomsten till hårdvara, servrar och lagringsmedia | biometriska läsare, serverburar, CCTV, märkning av utrustning |
| **Site security** | förstärka anläggningens yttre gräns och entréer | stängsel, beväpnade vakter, pollare, mantrap-entréer |

Kryptering är alltså en kontroll i datalagret, inte en fysisk kontroll. Det var svaret på en av förra årets tentafrågor.

**Mantrap skiljer sig mellan källorna.** Bilden lägger mantrap-entréer under site security. Bokens fyrlagermodell (bokens kapitel 5) lägger mantrap under physical security, alltså skyddet av själva datacentret. Gäller frågan föreläsningens modell är svaret site security, gäller den bokens är det physical security.

## Zero trust

**Zero Trust Methodology** visas som en "Circle of Trust" med skydd i lager, utifrån och in:

1. Perimeter security
2. Network security
3. Endpoint security
4. Application security
5. Data security
6. Critical assets (i mitten)

## Avslutningen

"The New Mantra": *Live a completely open and transparent life, without secrets. But don't tell anyone.* Ironin sammanfattar föreläsningen: ett liv helt utan hemligheter går inte att kombinera med att skydda sig.
`,
  },

  alm: {
    id: "alm",
    kind: "forelasning",
    label: "Gästföreläsning",
    examArea: FO,
    title: "Offensiv säkerhet: angriparens blick i försvaret",
    readingMinutes: 11,
    lead: "Erik Alm (Truesec) om hur säkerhetsarbete organiseras, hur en attack går till och hur tester av webbappar, interna nät och moln stärker försvaret.",
    sources: ["Gästföreläsning: Erik Alm, The role of offense in defense (13 nov 2026)"],
    body: `
## Kärnan

- **Säkerhetsarbete följer sex funktioner** (NIST): Govern, Identify, Protect, Detect, Respond och Recover.
- **Offensiv säkerhet förbättrar försvaret** i varje funktion, genom att någon tänker som en angripare.
- **Riktiga attacker följer en förutsägbar kedja** i åtta steg.
- **Pentester täcker webbapplikationer, interna nät och moln.**
- **Allt sker med tillstånd:** "Security testing is always done with explicit permission and within legal boundaries."

## Vad som ska skyddas

| Vad | Exempel ur föreläsningen |
|---|---|
| **Information**: immateriella rättigheter, finansiella uppgifter, affärshemligheter, personuppgifter | 8,8 miljoner poster stulna ur det danska folkbokföringsregistret CPR |
| **Operations**: kritisk infrastruktur, butiker, fabriker | frysar hos Ica och Coop hackades, och mat för miljontals kronor förstördes |
| **Pengar**: internetbanker och kryptotillgångar | Bangladesh Bank 2016, 81 miljoner dollar stulna; Binance, 6,3 miljarder dollar i kryptotillgångar stulna |

## De sex funktionerna

| Funktion | Vad den gör |
|---|---|
| **Govern** (i mitten) | sätter strategi, policyer och ansvar för riskhanteringen |
| **Identify** | tar reda på vilka tillgångar som behöver skydd |
| **Protect** | inför och testar förebyggande kontroller, patchhantering och åtkomstkontroll |
| **Detect** | övervakar tillgångarna efter misstänkt och skadligt beteende |
| **Respond** | skapar och övar rutiner för att hantera och utrota hot |
| **Recover** | förbereder hur verksamheten går tillbaka till det normala efter en incident |

## Offense informs defense

Angriparens tänkande kan användas i funktionerna:

| Funktion | Offensiv aktivitet | Vad den gör |
|---|---|---|
| Identify | **Threat modeling** | kartlägger kritiska tillgångar, användare och processer, troliga hotaktörer och deras mål, och realistiska attackvägar; prioriterar det som ska åtgärdas först |
| Protect | **Pentesting** | hittar svagheter som går att utnyttja innan angriparna gör det, testar om kontrollerna fungerar i praktiken och åtgärdar de svagheter som betyder mest |
| Detect | **Purple team exercise** | efterliknar en angripare medan försvararna ser på och förbättrar sig; kontrollerar att verktygen ger användbara larm |
| Recover | **Cyber crisis tabletop** | går igenom ett störande attackscenario, till exempel byggt på pentestresultat, och prövar kontinuitet och återställningsbeslut |
| Alla tillsammans | **Red team exercise** | efterliknar en realistisk motståndare i en fullskalig attack och prövar förebyggande skydd, detektering och incidenthantering samtidigt; mäter om organisationen stoppar angriparen innan målet nås |

Målet med ett pentest är alltså att **hitta sårbarheter som faktiskt går att utnyttja**, inte att åtgärda allt på en gång eller att mäta prestanda.

## En attacks anatomi

En attack går i åtta steg, från start till skada (impact):

| Steg | Namn | Vad angriparen gör |
|---|---|---|
| 01 | External reconnaissance | lär sig om målet |
| 02 | Resource development | förbereder attacken |
| 03 | Initial access | tar sig in i miljön |
| 04 | Persistence | behåller åtkomsten över tid |
| 05 | Internal reconnaissance | kartlägger användare, system och data |
| 06 | Privilege escalation | skaffar mer åtkomst |
| 07 | Lateral movement | rör sig mot målet |
| 08 | Actions on objectives | stjäl, stör eller utpressar |

**Exemplet från hans arbete** var ett dolt red team-uppdrag hos en stor finansiell institution, med frågan om en motiverad angripare kunde störa driften:

- anställda hittades på LinkedIn och e-postadresser i läckta data
- en förevändning för nätfisket och en skadlig fil förbereddes
- målet övertalades i flera mejl att ladda ner filen
- åtkomsten startade varje gång användaren öppnade Teams
- inloggningsuppgifter för ett privilegierat konto låg på en filserver
- en administratörsnyckel till säkerhetsverktyget hittades på en adminserver
- till sist visades vilken skada ransomware kunde ha gjort

## Pentesting är brett

| Vanligt arbete | Nischarbete |
|---|---|
| webbapplikationer | IoT och inbyggda system |
| interna nät | fysisk säkerhet |
| molnsäkerhet | |

## Webbapplikationer

**Varför angripare går på webbappar:** de finns överallt, de innehåller mycket intressanta data, och de kan vara en väg in i organisationens interna nät.

**Hur de testas:**

- **Automated scanning** hittar kända svagheter i stor skala.
- **Manual testing (DAST)** prövar affärslogik, autentisering och behörigheter.
- **Source-code review** hittar grundorsakerna innan programmet släpps.

DAST-metoden går i en cykel: **kartlägg applikationen → testa och analysera → bekräfta påverkan → rapportera → testa igen.**

## Tre vanliga webbsårbarheter

Ur OWASP Top 10 (2025):

| Sårbarhet | Exemplet | Åtgärd |
|---|---|---|
| **Broken access control** | att byta \`user=erik\` mot \`user=root\` i adressen ger åtkomst till administrationen | kontrollera behörigheten på servern, för varje anrop |
| **SQL injection (SQLi)** | \`'--\` i adressen gör resten av databasfrågan till en kommentar, så villkoret \`released = 1\` försvinner | **prepared statements** och en **allowlist** för förväntad indata |
| **Cross-site scripting (XSS)** | ett \`<script>\` i adressen visas på sidan och skickar besökaren vidare till en annan webbplats | validera och rensa indata, **encode output** |

**Buffer overflow** hör inte hit. Det är ett minnesfel i program, och förra årets tentor hade det som rätt svar på frågan om vad som *inte* är en vanlig webbsårbarhet.

## Interna nät och Active Directory

Interna nät är organisationens privata nät med interna applikationer, servrar och delade resurser. De byggs ofta kring **Active Directory**, som hanterar användare, enheter, grupper och behörigheter med central autentisering och åtkomstkontroll.

**Varför de är viktiga:** där finns affärskritiska system och data, och ett enda kapat konto kan bli bred åtkomst. Följden kan bli stöld av immateriella rättigheter, störningar, utpressning eller förstörelse.

**Hur de testas:**

- granskning av konfiguration och uppbyggnad
- sårbarhetsskanning
- kontroll av att nätet är segmenterat
- **assumed breach**: man utgår från att angriparen redan är inne

Problemet med Active Directory är "intended configurations; unintended consequences": miljontals relationer mellan konton och resurser som ingen har överblick över.

| Vanliga problem: klassiska hackergrepp | Vanliga problem: mindre tekniska |
|---|---|
| felkonfigurationer som går att utnyttja, som LLMNR- och NBT-NS-poisoning | bristande åtkomstkontroll: alla kommer åt allt |
| system som inte är patchade, som MS17-010 (EternalBlue) | osäker lagring av inloggningsuppgifter, som lösenord på filservrar |

## Molnet

**"Cloud security is identity security":** leverantören skyddar plattformen, och du skyddar din konfiguration och dina data. Användare, tjänstekonton och applikationer har alla behörigheter, och det är dem en angripare är ute efter.

En typisk attackväg i molnet har tre steg:

1. **hitta en exponerad hemlighet**, via skadlig kod, kodförråd eller öppen lagring
2. **logga in och utforska**: behörigheter, datalager, tjänster och förtroenderelationer
3. **utöka åtkomsten och nå målet**: stjäla data, starta egna resurser eller störa tjänster

En molngranskning prövar tre saker:

- **identitets- och åtkomsthantering:** vem kan göra vad, varifrån och med vilka behörigheter
- **hemligheter:** finns nycklar, tokens och lösenord öppet, eller gäller de för länge
- **konfiguration och detektering:** är tjänster exponerade, och skulle misstänkt aktivitet märkas
`,
  },
  ...Object.fromEntries(BOOK_CHAPTERS.map((b) => [b.chapter.id, b.chapter])),
};

export const chapters = ORDER.map((id, index) => ({
  ...rawChapters[id],
  number: index + 1,
  ...(CHAPTER_TOPICS[id] || { topics: [], primaryTopics: [] }),
}));

const lectureGlossary = [
  // Föreläsning 1
  { term: "CIA triad", definition: "Informationssäkerhetens tre aspekter enligt Wylder (2004): confidentiality, integrity och availability.", chapter: "fo1" },
  { term: "Confidentiality", definition: "Att information inte når obehöriga. Omfattar också privacy, alltså att individer styr vilken information om dem som samlas in och lämnas ut.", chapter: "fo1" },
  { term: "Integrity", definition: "Att information inte ändras obehörigt och förblir korrekt och fullständig.", chapter: "fo1" },
  { term: "Availability", definition: "Att information och system finns tillgängliga när de behövs. Det är availability en överbelastningsattack (DoS) angriper.", chapter: "fo1" },
  { term: "Networked society", definition: "Castells namn på den nya sociala strukturen under de senaste tre decennierna. De två andra förändringarna är informational capitalism och Internet som ny kultur.", chapter: "fo1" },
  { term: "Informational capitalism", definition: "Castells namn på den nya ekonomin under de senaste tre decennierna.", chapter: "fo1" },
  { term: "Information overload", definition: "Informationsöverflöd, en av de växande utmaningarna (Dean & Webb 2011).", chapter: "fo1" },
  { term: "Surveillance capitalism", definition: "Övervakningskapitalism: övervakning av människor som affärsmodell (Zuboff). I föreläsning 2: \"a future without secrets is here to stay\".", chapter: "fo1" },
  { term: "Data breach", definition: "Dataintrång. Dyrast per intrång är sjukvården (Healthcare), i snitt 6,64 miljoner dollar enligt föreläsningen.", chapter: "fo1" },

  // Föreläsning 2
  { term: "Risk assessment", definition: "Riskbedömning. Föreläsningens process har fyra steg: asset identification, threat modeling, vulnerability evaluation och mitigation strategy.", chapter: "fo2" },
  { term: "IT security management", definition: "Den formella process som tar fram och upprätthåller lämpliga (\"appropriate\") säkerhetsnivåer för organisationens tillgångar genom att bevara confidentiality, integrity, availability, accountability, authenticity och reliability (bokens definition).", chapter: "fo2" },
  { term: "Asset identification", definition: "Riskbedömningens första steg: att katalogisera all hårdvara, mjukvara och data.", chapter: "fo2" },
  { term: "Threat modeling", definition: "Att modellera möjliga attackvägar och identifiera de viktigaste hotaktörerna. I gästföreläsningen den offensiva aktiviteten i Identify.", chapter: "fo2" },
  { term: "Mitigation strategy", definition: "Riskbedömningens sista steg: tekniska kontroller som sänker den samlade riskexponeringen.", chapter: "fo2" },
  { term: "Big Other", definition: "Zuboffs bild av den digitala övervakningen, \"the fight to control the Big Other\".", chapter: "fo2" },
  { term: "Automated Targeting System (ATS)", definition: "System som tull- och gränsmyndigheter använder för att automatiskt ge resenärer en riskpoäng. Poängen är konfidentiell och nästan omöjlig att ifrågasätta.", chapter: "fo2" },
  { term: "Privacy", definition: "Enligt Introna (1997): ingen åtkomst till personen, kontroll över personlig information och frihet från andras bedömning och granskning.", chapter: "fo2" },
  { term: "Trojan horse", definition: "Skadlig kod som utger sig för att vara legitim mjukvara.", chapter: "fo2" },
  { term: "Phishing", definition: "Nätfiske: att lura människor att lämna ut uppgifter. I föreläsningen ett exempel på hur immateriella rättigheter stjäls.", chapter: "fo2" },
  { term: "File infector virus", definition: "Virus som fäster vid körbara program och sprids när programmet körs. Virus i dokument, som Excel-filer, kallas i boken macro virus.", chapter: "fo2" },
  { term: "Detection and Analysis", definition: "Det första steget i en incidentresponsplan: att upptäcka och förstå incidenten. Sedan följer containment, eradication och recovery.", chapter: "fo2" },
  { term: "Recovery Time Objective (RTO)", definition: "Den längsta tid en tjänst får vara nere efter ett avbrott innan den måste vara återställd. Hör till kontinuitetsplaneringen.", chapter: "fo2" },
  { term: "Role-based access control (RBAC)", definition: "Åtkomstkontroll där behörigheterna knyts till roller i organisationen och användarna får roller.", chapter: "fo2" },
  { term: "Principle of least privilege", definition: "Varje användare får bara de behörigheter som behövs. I föreläsningen upprätthålls principen med MFA och RBAC.", chapter: "fo2" },
  { term: "Multi-factor authentication (MFA)", definition: "Autentisering med faktorer av olika slag, till exempel något du har och något du är.", chapter: "fo2" },
  { term: "Hardware security module (HSM)", definition: "Särskild hårdvara för kryptografiska nycklar. Nämns i säkerhetspolicyns del om kryptering och i datalagret i data center-modellen.", chapter: "fo2" },
  { term: "Countermeasure matrix", definition: "Del av Straub & Welkes planeringsmodell med raderna deterrence, prevention, detection och remedies.", chapter: "fo2" },
  { term: "Organizational security policy", definition: "Ramverk för att skydda informationstillgångar, uppfylla regelkrav och minska operativa risker. Tre delar i föreläsningen: access management, data encryption och incident response.", chapter: "fo2" },
  { term: "NIS2", definition: "EU-gemensam lagstiftning om cybersäkerhet.", chapter: "fo2" },
  { term: "ISO/IEC 27005", definition: "Standard med vägledning för riskhantering inom informationssäkerhet.", chapter: "fo2" },
  { term: "ISO 31000", definition: "Standard med riktlinjer för hur organisationer hanterar risk.", chapter: "fo2" },
  { term: "Detailed Risk Approach", definition: "Det angreppssätt en formell riskanalys ofta följer enligt föreläsningen, vägledd av ISO 27005, ISO 31000, NIST SP 800-30 och SASN13.", chapter: "fo2" },
  { term: "Data center security model", definition: "Fyra lager: data security, network security, physical security och site security, var och ett med sina kontroller.", chapter: "fo2" },
  { term: "Zero trust", definition: "I föreläsningen en \"circle of trust\" med skydd i lager, utifrån och in: perimeter, network, endpoint, application och data security runt de kritiska tillgångarna.", chapter: "fo2" },

  // Gästföreläsningen
  { term: "Offensive security", definition: "Att använda en angripares tänkande, med tillstånd, för att förbättra försvaret.", chapter: "alm" },
  { term: "NIST Cybersecurity Framework", definition: "Sex funktioner för säkerhetsarbete: Govern (i mitten), Identify, Protect, Detect, Respond och Recover.", chapter: "alm" },
  { term: "Penetration testing (pentest)", definition: "Att hitta svagheter som faktiskt går att utnyttja innan angriparna gör det, och pröva om kontrollerna fungerar i praktiken.", chapter: "alm" },
  { term: "Purple team exercise", definition: "Övning där någon efterliknar en angripare medan försvararna ser på och förbättrar sina larm. Hör till Detect.", chapter: "alm" },
  { term: "Red team exercise", definition: "En realistisk motståndare i en fullskalig attack som prövar förebyggande skydd, detektering och incidenthantering samtidigt.", chapter: "alm" },
  { term: "Cyber crisis tabletop", definition: "Genomgång av ett störande attackscenario som prövar kontinuitet och återställningsbeslut. Hör till Recover.", chapter: "alm" },
  { term: "Privilege escalation", definition: "Steg 6 i en attack: att skaffa mer åtkomst än man först fick.", chapter: "alm" },
  { term: "Lateral movement", definition: "Steg 7 i en attack: att röra sig genom miljön mot målet.", chapter: "alm" },
  { term: "Persistence", definition: "Steg 4 i en attack: att behålla åtkomsten över tid.", chapter: "alm" },
  { term: "DAST", definition: "Manuell testning av en körande webbapplikation (affärslogik, autentisering, behörigheter). Cykeln: kartlägg, testa, bekräfta påverkan, rapportera, testa igen.", chapter: "alm" },
  { term: "Broken access control", definition: "Webbsårbarhet där en användare kommer åt något som användaren inte ska komma åt. Åtgärd: kontrollera behörigheten på servern, för varje anrop.", chapter: "alm" },
  { term: "SQL injection (SQLi)", definition: "Indata som tolkas som en del av databasfrågan. Åtgärder: prepared statements och en allowlist för förväntad indata.", chapter: "alm" },
  { term: "Prepared statement", definition: "Databasfråga där SQL-koden och indata skickas var för sig, så att indata aldrig kan tolkas som kod.", chapter: "alm" },
  { term: "Cross-site scripting (XSS)", definition: "Webbsårbarhet där indata med skript visas på sidan och körs i besökarens webbläsare. Åtgärder: validera indata och encode output.", chapter: "alm" },
  { term: "Active Directory", definition: "Microsofts katalogtjänst som hanterar användare, enheter, grupper och behörigheter i interna nät, med central autentisering och åtkomstkontroll.", chapter: "alm" },
  { term: "Assumed breach", definition: "Testmetod där man utgår från att angriparen redan är inne i det interna nätet.", chapter: "alm" },
  { term: "Cloud security is identity security", definition: "Leverantören skyddar plattformen och kunden sin konfiguration och sina data. Angriparen är ute efter användares, tjänstekontons och applikationers behörigheter.", chapter: "alm" },
];

// Föreläsningarnas termer först, sedan bokkapitlens.
export const glossary = [...lectureGlossary, ...BOOK_CHAPTERS.flatMap((b) => b.glossary)];
