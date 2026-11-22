// Bokens kapitel 1: Stallings & Brown, Overview (s. 37–79).
// Kapitel, ämne, ordlista och frågor; samlas av reading.js, topics.js och
// questions.js via bok/index.js. Skrivet med egna ord på tentans nivå,
// granskat mot boken 22 nov 2026 (ogranskat av Kasper). `notes` är
// källanteckningarna och visas inte.

const variant = (id, what) => ({ variantOf: id, source: `Variant av en tentafråga från förra året (${what})` });

export const chapter = {
  id: "bok1",
  kind: "bok",
  label: "Bokens kapitel 1",
  examArea: "Bokfrågor",
  title: "Grundbegreppen: CIA, hot och attacker",
  readingMinutes: 11,
  lead: "Bokens första kapitel lägger grunden: vad datasäkerhet ska skydda, hur allvarlig en förlust är, vilka sorters hot och attacker som finns och vilka principer som styr hur skyddet byggs.",
  sources: ["Stallings & Brown kap. 1 (s. 37–79)"],
  body: `
## Kärnan

- **Datasäkerhet har tre grundmål:** confidentiality, integrity och availability. Boken delar upp de två första i två delar var och lägger till authenticity och accountability.
- **FIPS 199 graderar en säkerhetsförlust** i tre nivåer: low, moderate och high.
- **Hot leder till fyra sorters konsekvenser** enligt RFC 4949: unauthorized disclosure, deception, disruption och usurpation.
- **Attacker är passiva eller aktiva.** Passiva avlyssnar och ska förebyggas, aktiva ändrar något och ska upptäckas.
- **Designprinciper** som least privilege och fail-safe defaults styr hur skyddet byggs.
- **Attack surface och attack tree** kartlägger hoten: var systemet kan angripas, och hur ett angreppsmål kan nås.

## Säkerhetsmålen

CIA-triaden känner du igen från Föreläsning 1. Boken definierar **computer security** som de åtgärder och kontroller som ger confidentiality, integrity och availability åt informationen i ett datorsystem. Sedan delar den upp två av målen:

| Mål | Delbegrepp | Betydelse |
|---|---|---|
| Confidentiality | **data confidentiality** | privat eller konfidentiell information lämnas inte ut till obehöriga |
| | **privacy** | individen styr vilken information om hen som samlas in och lagras, och vem som får se den |
| Integrity | **data integrity** | information och program ändras bara på ett bestämt och godkänt sätt |
| | **system integrity** | systemet gör det det ska, utan avsiktlig eller oavsiktlig obehörig manipulation |
| Availability | – | systemen svarar i tid, och behöriga användare nekas inte service |

Två av förra årets tentafrågor gällde målen. Att integrity betyder skydd mot obehöriga ändringar, så att data förblir korrekta och fullständiga, var svaret på den ena. Att confidentiality också omfattar privacy var svaret på den andra.

Standarden **FIPS 199** beskriver målen genom vad en förlust innebär:

| Förlust av | Innebär |
|---|---|
| confidentiality | obehörigt röjande av information |
| integrity | obehörig ändring eller förstörelse av information |
| availability | avbrott i åtkomsten till information eller system |

**Två mål till.** En del menar att CIA inte räcker och lägger till:

- **Authenticity:** att något är äkta och går att kontrollera. Användaren är den hen säger sig vara, och indata kommer från en betrodd källa. FIPS 199 räknar authenticity till integrity.
- **Accountability:** att varje handling går att spåra till just den aktör som utförde den. Systemet måste därför logga vad som händer, så att ett intrång kan utredas och knytas till en ansvarig. Det stöder bland annat **nonrepudiation**, att ingen kan förneka vad hen gjort.

Båda ingår i definitionen av IT security management, se Föreläsning 2.

## Hur allvarlig är förlusten?

FIPS 199 graderar i tre nivåer vad en förlust av confidentiality, integrity eller availability kan ställa till med:

| Nivå | Effekt | Kännetecken |
|---|---|---|
| **Low** | limited | verksamheten klarar sina huvuduppgifter, men märkbart sämre; mindre skador och förluster |
| **Moderate** | serious | huvuduppgifterna klaras, men betydligt sämre; betydande skador, men ingen förlust av liv |
| **High** | severe or catastrophic | verksamheten klarar inte en eller flera av sina huvuduppgifter; stora skador, och människor kan dö eller skadas allvarligt |

Bokens exempel:

| Krav på | High | Moderate | Low |
|---|---|---|---|
| Confidentiality | studenters betyg | inskrivningsuppgifter | listor över studenter och personal, som ofta redan är offentliga |
| Integrity | patienters allergiuppgifter | ett diskussionsforum för registrerade användare | en anonym omröstning på en nyhetssajt |
| Availability | en autentiseringstjänst för kritiska system | universitetets publika webbplats | en telefonkatalog på nätet |

Blanda inte ihop nivåerna med konsekvensskalan i Föreläsning 2, som har sex steg från Insignificant till Doomsday. FIPS 199 har bara tre.

## Grundtermerna

Boken bygger på tre frågor: vilka tillgångar ska skyddas, hur hotas de, och vad kan man göra åt det?

| Term | Betydelse |
|---|---|
| **Asset** (system resource) | det som ska skyddas: hårdvara, mjukvara, data och kommunikationsnät |
| **Vulnerability** | en svaghet som ett hot kan utnyttja |
| **Threat** | en möjlig skada, något som kan drabba verksamheten via informationssystemet |
| **Attack** | ett hot som genomförs |
| **Adversary** (threat agent) | den som angriper eller tänker angripa |
| **Countermeasure** | det man gör mot en attack: helst förebygga, annars upptäcka och återhämta sig |
| **Risk** | hur hotad en tillgång är, beroende av hur stor skadan blir och hur sannolik den är |

Sårbarheterna följer CIA. Ett system kan bli **korrupt** och ge fel svar (integrity), **läcka** till obehöriga (confidentiality) eller bli **otillgängligt eller långsamt** (availability).

Attacker delas också in efter var de börjar:

- **Inside attack:** en insider, som har behörighet men använder den på ett sätt som inte är godkänt.
- **Outside attack:** en obehörig utanför perimetern, från amatörer till organiserad brottslighet och fientliga stater.

## Fyra hotkonsekvenser enligt RFC 4949

En **threat consequence** är vad ett lyckat angrepp leder till. Varje konsekvens orsakas av vissa **threat actions**:

| Konsekvens | Vad som händer | Hotar | Threat actions |
|---|---|---|---|
| **Unauthorized disclosure** | någon får obehörig åtkomst till data | confidentiality | exposure, interception, inference, intrusion |
| **Deception** | en behörig aktör får falska data och tror på dem | system integrity eller data integrity | masquerade, falsification, repudiation |
| **Disruption** | systemets tjänster avbryts eller hindras | availability eller system integrity | incapacitation, corruption, obstruction |
| **Usurpation** | en obehörig tar kontroll över systemets tjänster | system integrity | misappropriation, misuse |

Handlingarna som är lättast att blanda ihop:

- **Exposure:** känsliga data lämnas ut direkt, med avsikt eller av misstag.
- **Interception:** någon läser data som är på väg mellan två parter, till exempel på ett delat nät.
- **Inference:** någon drar slutsatser indirekt, till exempel genom **traffic analysis** eller upprepade frågor mot en databas.
- **Intrusion:** någon tar sig förbi systemets åtkomstskydd.
- **Masquerade:** någon utger sig för att vara en behörig användare, till exempel med stulna inloggningsuppgifter. En trojansk häst räknas också hit.
- **Falsification:** data ändras eller förfalskas, som när en student ändrar sina betyg.
- **Repudiation:** någon förnekar att hen skickat eller tagit emot något.
- **Corruption:** systemets funktioner ändras, till exempel med en bakdörr. Falsification ändrar data, corruption ändrar hur systemet fungerar.
- **Misappropriation:** någon tar obehörig kontroll över resurser, till exempel datorer som används i en distributed denial of service-attack.

## Passiva och aktiva attacker

| | **Passive attack** | **Active attack** |
|---|---|---|
| Vad angriparen gör | avlyssnar eller övervakar, ändrar ingenting | ändrar dataströmmen eller skapar en falsk |
| Typer | release of message contents, traffic analysis | replay, masquerade, modification of messages, denial of service |
| Svår att | upptäcka | förhindra helt |
| Försvaret | förebygga, oftast med kryptering | upptäcka och återhämta sig |

Typerna en och en:

- **Release of message contents:** angriparen tar del av innehållet i ett samtal, ett mejl eller en fil.
- **Traffic analysis:** innehållet är krypterat, men angriparen ser vilka som kommunicerar, hur ofta och hur långa meddelandena är, och kan gissa vad det handlar om.
- **Replay:** data fångas upp och skickas igen senare för att få en obehörig effekt. Uppfångandet är passivt, men attacken är aktiv.
- **Masquerade:** en aktör utger sig för att vara en annan, oftast med hjälp av en annan aktiv attack, som replay av en inloggning.
- **Modification of messages:** en del av ett meddelande ändras, eller meddelanden fördröjs eller kastas om.
- **Denial of service:** normal användning av kommunikationen hindras, till exempel genom att nätet överbelastas. DoS angriper availability och var svaret på en av förra årets tentafrågor.

## Designprinciperna

Boken listar tretton grundläggande designprinciper. De åtta första är de klassiska:

| Princip | Innebär |
|---|---|
| **Economy of mechanism** | skyddet ska vara så enkelt och litet som möjligt; då är det lättare att testa och har färre fel |
| **Fail-safe defaults** | åtkomst bygger på tillstånd, inte på undantag: standardläget är ingen åtkomst |
| **Complete mediation** | varje åtkomst kontrolleras, i stället för att ett sparat beslut återanvänds |
| **Open design** | konstruktionen är öppen för granskning, som krypteringsalgoritmer; bara nycklarna hålls hemliga |
| **Separation of privilege** | flera villkor krävs för åtkomst, som lösenord plus smartkort (MFA, se Föreläsning 2) |
| **Least privilege** | varje användare och process får bara de behörigheter uppgiften kräver, och bara när de behövs; RBAC är bokens exempel (se Föreläsning 2) |
| **Least common mechanism** | användarna ska dela så få funktioner som möjligt |
| **Psychological acceptability** | skyddet får inte störa arbetet i onödan, annars stänger användarna av det |

Fail-safe defaults förklaras av hur fel yttrar sig. Ett fel i en mekanism som ger uttryckliga tillstånd gör att någon nekas, och det märks snabbt. Ett fel i en mekanism som bara spärrar vissa gör att någon släpps in, och det kan gå länge obemärkt.

De fem nyare principerna:

- **Isolation:** publika system hålls åtskilda från kritiska resurser, användarnas processer från varandra och säkerhetsmekanismerna från resten.
- **Encapsulation:** en form av isolering byggd på objektorientering.
- **Modularity:** säkerhetsfunktioner byggs som separata moduler som kan bytas ut var för sig.
- **Layering:** flera överlappande skydd, så att inget enskilt fel lämnar systemet oskyddat. Kallas också **defense in depth**.
- **Least astonishment:** systemet ska reagera på det sätt som förvånar användaren minst.

## Attack surface och attack tree

| | **Attack surface** | **Attack tree** |
|---|---|---|
| Vad det är | de sårbarheter i systemet som en angripare kan nå och utnyttja | en hierarki över sätten att nå ett angreppsmål |
| Indelning | network, software och human attack surface | roten är målet, grenarna delmål, löven sätt att starta attacken |
| Används till | se var skydd behövs och göra ytan mindre | dokumentera attacker strukturerat och välja motåtgärder |

Exempel på attack surface är öppna portar på servrar, tjänster innanför brandväggen, kod som tar emot indata, webbformulär och en anställd som kan luras med social engineering. En mindre attack surface och layering kompletterar varandra.

I ett attack tree är varje nod utom löven en **AND-nod**, där alla delmål måste nås, eller en **OR-nod**, där det räcker med ett. Bokens exempel är ett träd vars rot är att ta över en användares konto i en internetbank.

## Strategin

Boken avslutar med en säkerhetsstrategi i tre delar:

1. **Policy:** vad ska skyddet göra? En **security policy** är ett formellt regelverk för hur systemet eller organisationen ger skydd. Den väger säkerheten mot användbarhet och kostnad.
2. **Mechanisms:** hur gör skyddet det?
3. **Assurance:** fungerar det verkligen? **Assurance** är graden av förtroende för att systemet följer policyn, aldrig ett formellt bevis. **Evaluation** är granskningen av en produkt eller ett system mot bestämda kriterier.
`,
};

export const topic = {
  id: "bok1-grunder",
  name: "Grundbegreppen: CIA, hot och attacker",
  chapter: "bok1",
  examWeight: "hög",
  summary: "Boken definierar datasäkerhet genom CIA-målen, delar confidentiality i data confidentiality och privacy och integrity i data integrity och system integrity, och lägger till authenticity och accountability. FIPS 199 graderar en förlust som low, moderate eller high. Hot leder till fyra konsekvenser enligt RFC 4949, attacker är passiva eller aktiva, och designprinciper, attack surface och attack tree hjälper till att bygga och granska skyddet.",
  keyPoints: [
    "Confidentiality: data confidentiality och privacy, där privacy är att individen styr vad som samlas in och lämnas ut om hen.",
    "Integrity: data integrity (data ändras bara på godkänt sätt) och system integrity (systemet fungerar utan obehörig manipulation).",
    "Accountability: varje handling går att spåra till den aktör som utförde den, vilket kräver loggning.",
    "FIPS 199: tre nivåer, low (limited), moderate (serious) och high (severe or catastrophic).",
    "RFC 4949: unauthorized disclosure hotar confidentiality, deception integrity, disruption availability eller system integrity, usurpation system integrity.",
    "Passive attack: release of message contents och traffic analysis; svåra att upptäcka, förebyggs med kryptering.",
    "Active attack: replay, masquerade, modification of messages och denial of service; svåra att förhindra, upptäcks i stället.",
    "Fail-safe defaults: standardläget är ingen åtkomst; åtkomst kräver uttryckligt tillstånd.",
    "Attack surface och attack tree: ytan visar var systemet kan angripas, trädet hur ett angreppsmål kan nås.",
  ],
  pitfalls: [
    "Privacy hör till confidentiality, inte till integrity eller ett eget mål.",
    "Traffic analysis är passiv trots att innehållet är krypterat; replay är aktiv trots att den börjar med avlyssning.",
    "Passiva attacker förebyggs, aktiva upptäcks och åtgärdas, inte tvärtom.",
    "Deception är konsekvensen; masquerade, falsification och repudiation är handlingarna som leder dit.",
    "FIPS 199 har tre nivåer (low, moderate, high), inte föreläsningens sexgradiga konsekvensskala med Major och Catastrophic.",
  ],
};

export const glossary = [
  { term: "Data integrity", definition: "Att information och program bara ändras på ett bestämt och godkänt sätt. Den ena delen av integrity i boken; den andra är system integrity.", chapter: "bok1" },
  { term: "System integrity", definition: "Att ett system gör det det ska, fritt från avsiktlig eller oavsiktlig obehörig manipulation.", chapter: "bok1" },
  { term: "Authenticity", definition: "Att något är äkta och går att kontrollera: användare är de de säger sig vara och indata kommer från en betrodd källa. FIPS 199 räknar det till integrity.", chapter: "bok1" },
  { term: "Passive attack", definition: "Försök att ta del av eller använda information utan att påverka systemet, som release of message contents och traffic analysis. Svår att upptäcka och förebyggs oftast med kryptering.", chapter: "bok1" },
  { term: "Active attack", definition: "Försök att ändra systemet eller påverka hur det fungerar: replay, masquerade, modification of messages och denial of service. Svår att förhindra helt, så målet är att upptäcka den och återhämta sig.", chapter: "bok1" },
  { term: "Traffic analysis", definition: "Passiv attack där angriparen inte kan läsa innehållet men ser vem som kommunicerar, hur ofta och hur mycket. Enligt RFC 4949 ett exempel på inference.", chapter: "bok1" },
  { term: "Replay", definition: "Aktiv attack där data fångas upp och skickas igen senare för att få en obehörig effekt.", chapter: "bok1" },
  { term: "Masquerade", definition: "Att utge sig för att vara någon annan, till exempel med stulna inloggningsuppgifter. Både en aktiv attack och en threat action som leder till deception.", chapter: "bok1" },
  { term: "Unauthorized disclosure", definition: "Hotkonsekvens enligt RFC 4949: någon får obehörig åtkomst till data. Hotar confidentiality. De andra tre konsekvenserna är deception, disruption och usurpation.", chapter: "bok1" },
  { term: "Usurpation", definition: "Hotkonsekvens enligt RFC 4949: en obehörig tar kontroll över systemets tjänster eller funktioner, genom misappropriation eller misuse. Hotar system integrity.", chapter: "bok1" },
  { term: "Inside attack", definition: "Attack från en insider, som har behörighet men använder den på ett sätt som inte är godkänt. Motsatsen är outside attack, från en obehörig utanför perimetern.", chapter: "bok1" },
  { term: "Fail-safe defaults", definition: "Designprincip: standardläget är ingen åtkomst, och åtkomst bygger på uttryckligt tillstånd. Ett fel leder då till att någon nekas, inte släpps in.", chapter: "bok1" },
  { term: "Separation of privilege", definition: "Designprincip: flera villkor krävs för åtkomst, som lösenord plus smartkort. Också att dela upp ett program så att varje del bara har de behörigheter den behöver.", chapter: "bok1" },
  { term: "Attack surface", definition: "De sårbarheter i ett system som en angripare kan nå och utnyttja. Delas in i network, software och human attack surface.", chapter: "bok1" },
  { term: "Attack tree", definition: "Hierarkisk struktur över sätten att nå ett angreppsmål: roten är målet, löven är sätt att starta attacken, och noderna däremellan är AND- eller OR-noder.", chapter: "bok1" },
];

export const questions = [
  { id: "sak-bok1-v19", topic: "bok1-grunder", difficulty: 1, ...variant("sak-19", "integrity"),
    question: "According to FIPS 199, what does a loss of integrity mean?",
    options: [
      { text: "Unauthorized disclosure of information to outsiders", explain: "Obehörigt röjande är förlust av confidentiality, inte integrity." },
      { text: "Disruption of access to information or a system", explain: "Avbrott i åtkomsten är förlust av availability." },
      { text: "Unauthorized modification or destruction of information", explain: "Så definierar FIPS 199 förlust av integrity. Integrity skyddar mot just det, så att data förblir korrekta och fullständiga." },
      { text: "Inability to trace an action back to the person behind it", explain: "Spårbarhet är accountability, ett av de två mål boken lägger till utöver CIA." }
    ],
    correct: 2, reviewed: false },

  { id: "sak-bok1-v20", topic: "bok1-grunder", difficulty: 1, ...variant("sak-20", "confidentiality och privacy"),
    question: "In the book, privacy (individuals controlling what is collected and shared about them) is part of which security objective?",
    options: [
      { text: "Confidentiality", explain: "Boken delar confidentiality i data confidentiality och privacy." },
      { text: "System integrity", explain: "System integrity är att systemet fungerar som det ska utan obehörig manipulation, en del av integrity." },
      { text: "Accountability", explain: "Accountability är att handlingar går att spåra till den som utförde dem, ett tillägg utöver CIA." },
      { text: "Authenticity", explain: "Authenticity är att något är äkta och går att kontrollera; FIPS 199 räknar det till integrity." }
    ],
    correct: 0, reviewed: false },

  { id: "sak-bok1-01", topic: "bok1-grunder", difficulty: 2,
    question: "Which security goal requires that the actions of an entity can be traced uniquely to that entity?",
    options: [
      { text: "Authenticity", explain: "Authenticity gäller att användare och indata är äkta, inte att handlingar kan spåras i efterhand." },
      { text: "Availability", explain: "Availability är att systemen svarar i tid och att behöriga användare inte nekas service." },
      { text: "Data integrity", explain: "Data integrity är att information och program bara ändras på ett bestämt och godkänt sätt." },
      { text: "Accountability", explain: "Systemet loggar vad som händer, så att ett intrång kan spåras till en ansvarig. Begreppet ingår också i definitionen av IT security management." }
    ],
    correct: 3, source: "Bokens kapitel 1 (authenticity och accountability)", reviewed: false },

  { id: "sak-bok1-02", topic: "bok1-grunder", difficulty: 2,
    question: "Under FIPS 199, which impact level applies when a loss could leave an organization unable to perform one or more of its primary functions?",
    options: [
      { text: "The moderate impact level", explain: "Vid moderate klarar verksamheten fortfarande sina huvuduppgifter, men betydligt sämre." },
      { text: "The high impact level", explain: "High är en svår eller katastrofal effekt: huvuduppgifter faller bort, och människor kan dö eller skadas allvarligt." },
      { text: "The low impact level", explain: "Vid low klarar verksamheten sina huvuduppgifter, men märkbart sämre." },
      { text: "The major impact level", explain: "FIPS 199 har bara low, moderate och high. Major är ett steg på konsekvensskalan i Föreläsning 2." }
    ],
    correct: 1, source: "Bokens kapitel 1 (FIPS 199:s påverkansnivåer)", reviewed: false },

  { id: "sak-bok1-03", topic: "bok1-grunder", difficulty: 2,
    question: "In RFC 4949's terms, masquerade, falsification and repudiation are threat actions that lead to which threat consequence?",
    options: [
      { text: "Disruption", explain: "Disruption orsakas av incapacitation, corruption och obstruction och hotar availability eller system integrity." },
      { text: "Usurpation", explain: "Usurpation, att en obehörig tar kontroll över systemet, orsakas av misappropriation och misuse." },
      { text: "Deception", explain: "En behörig aktör får falska data och tror på dem. Deception hotar system integrity eller data integrity." },
      { text: "Exposure", explain: "Exposure är ingen konsekvens utan en threat action, och den leder till unauthorized disclosure." }
    ],
    correct: 2, source: "Bokens kapitel 1 (hotkonsekvenser enligt RFC 4949)", reviewed: false },

  { id: "sak-bok1-04", topic: "bok1-grunder", difficulty: 2,
    question: "Which statement about passive and active attacks matches the book?",
    options: [
      { text: "Passive attacks are hard to detect, so the emphasis is on prevention", explain: "Passiva attacker ändrar ingenting och märks därför inte, men kryptering kan oftast stoppa dem." },
      { text: "Active attacks are easy to prevent, so the emphasis is on prevention", explain: "Tvärtom: aktiva attacker är svåra att förhindra helt. Målet är att upptäcka dem och återhämta sig." },
      { text: "Traffic analysis is an active attack, since it alters the traffic", explain: "Traffic analysis är passiv: angriparen iakttar mönstret i trafiken utan att ändra något." },
      { text: "Replay is a passive attack, since it only reuses captured data", explain: "Replay är aktiv: data fångas upp passivt men skickas sedan igen för att få en obehörig effekt." }
    ],
    correct: 0, source: "Bokens kapitel 1 (passiva och aktiva attacker)", reviewed: false },

  { id: "sak-bok1-05", topic: "bok1-grunder", difficulty: 2,
    question: "Which design principle says that access decisions should rest on permission rather than exclusion, so that the default is no access?",
    options: [
      { text: "Least privilege", explain: "Least privilege gäller hur mycket var och en får: bara de behörigheter uppgiften kräver. Standardläget utan åtkomst är fail-safe defaults." },
      { text: "Fail-safe defaults", explain: "Ett fel i en mekanism som ger uttryckliga tillstånd gör att någon nekas, vilket är säkert och märks snabbt." },
      { text: "Complete mediation", explain: "Complete mediation kräver att varje åtkomst kontrolleras, inte att standardläget är nekad åtkomst." },
      { text: "Economy of mechanism", explain: "Economy of mechanism handlar om att hålla skyddet enkelt och litet." }
    ],
    correct: 1, source: "Bokens kapitel 1 (designprinciperna)", reviewed: false },

  { id: "sak-bok1-06", topic: "bok1-grunder", difficulty: 2,
    question: "What does the book mean by an attack surface?",
    options: [
      { text: "A hierarchy of the ways an attacker could reach the attack goal", explain: "Det är ett attack tree: roten är angriparens mål och löven är sätt att starta attacken." },
      { text: "Several overlapping layers of protection placed around an asset", explain: "Det är layering, eller defense in depth. Den kompletterar en mindre attack surface men är något annat." },
      { text: "The set of assets that an organization needs to protect from attack", explain: "Tillgångarna (assets) är det som ska skyddas; attack surface är var systemet kan angripas." },
      { text: "Vulnerabilities in a system that an attacker can reach and exploit", explain: "Till exempel öppna portar, webbformulär och anställda som kan luras. Ytan delas in i network, software och human attack surface." }
    ],
    correct: 3, source: "Bokens kapitel 1 (attack surface och attack tree)", reviewed: false },
];

export const notes = `Byggt på PDF-sidorna 37–79 (markeringarna "Page N of 1641"): s. 39–42 (computer security, CIA med delbegrepp, FIPS 199:s förlustdefinitioner, authenticity, accountability, de tre påverkansnivåerna och exemplen), s. 44–49 (terminologi, sårbarheter, passive/active och inside/outside attack, RFC 4949-tabellen med konsekvenser och threat actions), s. 57–58 (passiva och aktiva nätattacker), s. 62–65 (designprinciperna), s. 66–70 (attack surface, attack tree), s. 71–73 (strategi, security policy, assurance, evaluation), s. 75–77 (Key Terms, Review Questions). PDF-texten upprepar avsnitten Examples (s. 41 och 50) och Threats and Attacks (s. 47–49 och 52–54); innehållet är detsamma.

Man-in-the-middle finns INTE i kapitel 1, så ingen variant av sak-08. Boken förklarar begreppet först i kapitel 21 (Public-Key Cryptography and Message Authentication), i avsnittet om Diffie–Hellman, PDF-sidan 1137 (tryckt s. 670 enligt registret). Det nämns också i kapitel 22 (s. 1195, övningsuppgift om SSL/TLS), kapitel 24 (s. 1229, trådlösa nät, tryckt s. 717–718) och i en produkttabell i kapitel 9 (s. 529, "SQL Net man in the middle attacks").

Medvetet utelämnat: utmaningarna med datasäkerhet (tio punkter), tabellen över tillgångar och hot per CIA-mål, statistiska databaser, FIPS 200:s 17 kravområden, detaljerna i bankexemplets attack tree (fem strategier) och standardiseringsorganen (NIST, ISOC, ITU-T, ISO).

Osäkert eller att granska:
- Deception och accountability står inte bland kapitlets Key Terms (troligen ett förbiseende i boken), så de har ingen egen ordlisteterm; de förklaras i texten och i Unauthorized disclosure-termen.
- "Least privilege" finns redan som "Principle of least privilege", så den är inte med i ordlistan. Denial of service, access control, authentication, risk och security policy är Key Terms men lämnas åt kapitlen där de hör hemma.
- Obstruction kopplas inte uttryckligen till ett CIA-mål i boken; texten säger bara att disruption som helhet hotar availability eller system integrity.
- "De åtta första är de klassiska" återger bokens "first proposed in [SALT75] and have withstood the test of time" utan årtal.
- Distraktorn "The major impact level" (sak-bok1-02) bygger på att Major är ett steg på föreläsningens konsekvensskala och ordet förekommer i FIPS 199:s beskrivning av high (major damage, major financial loss).`;
