// Bokens kapitel 4: Stallings & Brown, Access Control (s. 188–245).
// Kapitel, ämne, ordlista och frågor; samlas av reading.js, topics.js och
// questions.js via bok/index.js. Skrivet med egna ord på tentans nivå,
// granskat mot boken 22 nov 2026 (ogranskat av Kasper). `notes` är
// källanteckningarna och visas inte.

const variant = (id, what) => ({ variantOf: id, source: `Variant av en tentafråga från förra året (${what})` });

export const chapter = {
  id: "bok4",
  kind: "bok",
  label: "Bokens kapitel 4",
  examArea: "Bokfrågor",
  focus: ["Access control / Access control mechanisms"],
  title: "Access control: DAC, MAC, RBAC och ABAC",
  readingMinutes: 11,
  lead: "Fyra sätt att bestämma vem som får göra vad med en resurs, och vad vart och ett bygger på: identitet, etiketter, roller eller attribut.",
  sources: ["Stallings & Brown kap. 4 (s. 188–245)"],
  body: `
## Kärnan

- **Access control** avgör vem eller vad som får använda en viss resurs, och på vilket sätt, enligt en säkerhetspolicy.
- Grundelementen är tre: **subject** (den som begär åtkomst), **object** (resursen) och **access right** (sättet att använda den).
- Det finns fyra policyer. De skiljer sig i vad beslutet bygger på: identitet (DAC), etiketter och clearance (MAC), roller (RBAC) eller attribut (ABAC).
- Policyerna utesluter inte varandra. Ett system kan använda flera av dem för olika slags resurser.
- Runt access control behövs också hantering av identiteter, credentials och åtkomst (ICAM).

## Där access control passar in

| Funktion | Vad den gör |
|---|---|
| **Authentication** | kontrollerar att en användares credentials är giltiga |
| **Authorization** | ger en användare eller process rätt att använda en resurs |
| **Audit** | granskar loggar och aktiviteter i efterhand, för att pröva kontrollerna, se att policyn följs och upptäcka intrång |

Först autentiseras användaren. Sedan avgör access control, med hjälp av en **authorization database**, om just den begärda åtkomsten är tillåten.

I OWASP:s lista från 2021 över de största riskerna i webbapplikationer låg broken access control först (se gästföreläsningen).

## Subject, object och access right

- **Subject:** en enhet som kan komma åt objekt. I praktiken är det en process som agerar för en användare eller ett program och tar över dess rättigheter.
- **Object:** en resurs vars åtkomst kontrolleras, till exempel filer, poster, kataloger, brevlådor och program.
- **Access right:** hur ett subject får använda ett objekt. Typiska rättigheter är read, write, execute, delete, create och search. Write omfattar read.

Enkla system delar in subjekten i tre klasser med olika rättigheter:

| Klass | Vem |
|---|---|
| **Owner** | den som skapat resursen, eller en administratör eller projektledare som fått ägarskapet |
| **Group** | en namngiven grupp användare; medlemskapet räcker för gruppens rättigheter, och en användare kan vara med i flera grupper |
| **World** | alla andra som kan använda systemet; de får minst åtkomst |

I UNIX syns klasserna direkt: varje fil har read-, write- och execute-bitar för ägaren, gruppen och alla andra.

## De fyra policyerna

| Policy | Beslutet bygger på | Vem eller vad bestämmer |
|---|---|---|
| **Discretionary access control (DAC)** | identiteten hos den som begär åtkomst, och regler om vad den får göra | den som har en rättighet, oftast ägaren, kan efter eget val ge andra åtkomst |
| **Mandatory access control (MAC)** | **security labels** på resurserna (hur känsliga de är) jämförs med **security clearances** hos subjekten (vad de är behöriga till) | systemets regler; den som har clearance kan inte på eget initiativ släppa in någon annan |
| **Role-based access control (RBAC)** | rollerna användarna har, och regler om vad varje roll får göra | rättigheterna sitter på rollen; användarna tilldelas roller |
| **Attribute-based access control (ABAC)** | attribut hos användaren, resursen och miljön | regler som prövar attributen vid varje begäran |

- DAC är det traditionella sättet. MAC växte fram ur militärens krav på informationssäkerhet. RBAC och ABAC har blivit allt vanligare.
- **I DAC är det ägaren som bestämmer.** Det var svaret på en av förra årets tentafrågor. "Discretionary" betyder just att den som har rättigheten själv väljer om andra ska få den.
- **RBAC bygger på roller**, inte på användarens identitet. Det var också svaret på en av förra årets tentafrågor. De felaktiga alternativen var de andra policyerna: klassificeringsnivåer (MAC), identitet (DAC) och tid på dygnet (ett villkor i ABAC).

## DAC: access matrix, ACL och capability ticket

En **access matrix** är DAC:s grundmodell. Subjekten står på ena ledden och objekten på den andra, och varje ruta anger vilka rättigheter subjektet har till objektet. De flesta rutorna är tomma, så matrisen lagras uppdelad på ett av två sätt:

| | **Access control list (ACL)** | **Capability ticket** |
|---|---|---|
| Matrisen delad | per kolumn | per rad |
| Gäller | ett objekt: vilka användare som får nå det och hur | en användare: vilka objekt och operationer hen får |
| Lätt att se | vilka som har åtkomst till en viss resurs | vilka rättigheter en viss användare har |
| Svårt att se | vad en viss användare får nå | vilka som har åtkomst till en viss resurs |

Capability tickets kan lånas ut eller ges bort och sprids i systemet. Därför är de en större säkerhetsrisk än ACL:er och måste vara omöjliga att förfalska, till exempel genom att operativsystemet håller dem åt användarna.

En **protection domain** är en mängd objekt tillsammans med rättigheterna till dem. I matrisen motsvarar en rad en domän. Poängen är att en process kan få en egen domän med bara en del av användarens rättigheter, till exempel ett program man inte litar helt på. Så hålls rättigheterna så små som möjligt.

Skillnaden mellan **user mode** och **kernel mode** i ett operativsystem är en form av protection domain. Bara i kernel mode får privilegierade instruktioner köras och skyddat minne användas.

## MAC och Bell-LaPadula

I MAC har varje subject en **clearance** och varje objekt en **classification**. Den amerikanska militärens skala är ett exempel: top secret > secret > confidential > restricted > unclassified. När systemet har flera nivåer kallas kravet **multilevel security (MLS)**.

Den tidiga modellen för MAC är **Bell-LaPadula (BLP)**. Den skyddar confidentiality med två regler:

| Regel | Innebär | Kallas |
|---|---|---|
| **No read up** | ett subject får bara läsa objekt på samma eller lägre nivå | simple security property |
| **No write down** | ett subject får bara skriva till objekt på samma eller högre nivå | \\*-property (star property) |

- No write down hindrar att någon läcker hemlig information genom att kopiera den till ett objekt med lägre klassning, där personer med lägre clearance sedan kan läsa den.
- Att skriva uppåt är alltså tillåtet, men inte att läsa uppåt.
- BLP har också plats för DAC: ägaren får ge andra åtkomst, men bara inom MAC-reglerna. Organisationens policy går före ägarens val.

I dag finns MAC till exempel i SELinux. Windows har **Mandatory Integrity Control (MIC)**, en variant av MAC som skyddar integrity snarare än confidentiality.

## RBAC

Föreläsning 2 tar upp RBAC i säkerhetspolicyns access management, där den tillsammans med MFA upprätthåller principle of least privilege. Boken lägger till hur modellen är uppbyggd.

- En roll är en arbetsuppgift (job function) i organisationen. Rättigheterna knyts till rollerna, och användarna tilldelas roller efter sitt ansvar.
- Användare och roller har ett många-till-många-förhållande, liksom roller och rättigheter. Användarna byts ofta, rollerna sällan.
- Varje roll ska bara ha de rättigheter den behöver, så RBAC passar bra för least privilege.

Grundmodellen har fyra entiteter:

| Entitet | Vad den är |
|---|---|
| **User** | en person med ett användar-id |
| **Role** | en namngiven arbetsuppgift med sitt ansvar och sina befogenheter |
| **Permission** | ett godkännande att använda ett eller flera objekt på ett visst sätt; samma sak som access right, privilege och authorization |
| **Session** | kopplingen mellan en användare och de av hens roller som är aktiverade just nu |

I en session aktiverar användaren bara de roller uppgiften kräver, ännu ett exempel på least privilege.

Boken beskriver fyra modeller som bygger på varandra: **RBAC0** är grundmodellen, **RBAC1** lägger till role hierarchies, **RBAC2** lägger till constraints och **RBAC3** har båda.

**Role hierarchies** speglar organisationens hierarki. En högre roll ärver alla rättigheter från rollerna under sig och har dessutom egna. En projektledare kan till exempel ärva både produktionsingenjörens och kvalitetsingenjörens rättigheter.

**Role constraints** är regler för hur roller får tilldelas:

| Constraint | Innebär |
|---|---|
| **Mutually exclusive roles** | en användare får bara ha en av rollerna i en viss mängd, permanent eller under en session. Det stöder **separation of duties** och gör det svårare för personer med olika uppgifter att samarbeta för att kringgå policyn. |
| **Cardinality** | ett tak för antal, till exempel att bara en person får ha rollen avdelningschef, eller hur många roller en användare får ha |
| **Prerequisite role** | en användare får en roll bara om hen redan har en viss annan roll |

## ABAC

ABAC prövar regler mot attribut. Det finns tre typer av attribut:

| Attributtyp | Beskriver | Exempel |
|---|---|---|
| **Subject attributes** | den som begär åtkomst | id, namn, organisation och befattning; även rollen kan ses som ett attribut |
| **Object attributes** | resursen | ett dokuments titel, ämne, datum och författare, ofta hämtade ur metadata |
| **Environment attributes** | sammanhanget kring begäran | datum och tid, pågående virus- eller hackeraktivitet, nätets säkerhetsnivå (internet eller intranät) |

- **Styrkan** är flexibilitet. Reglerna kan kombinera hur många attribut som helst (fine-grained access control), och ABAC kan genomdriva både DAC, MAC och RBAC.
- **Kostnaden** är komplexitet och prestanda, eftersom attributen prövas vid varje åtkomst. Därför var webbtjänster först med ABAC, och intresset är stort för molntjänster.

Bokens exempel är en streamingtjänst med åldersgränser. RBAC behöver roller som Adult, Juvenile och Child, och antalet roller växer exponentiellt med fler villkor, som premium- eller vanlig kund. ABAC klarar sig med en regel som jämför användarens ålder med filmens åldersgräns. Ett kampanjerbjudande blir bara ett villkor på dagens datum, ett environment attribute.

## Identiteter och förtroende

**Identity, credential, and access management (ICAM)** är ett samlat sätt att hantera digitala identiteter, credentials och åtkomst:

| Del | Vad den gör |
|---|---|
| **Identity management** | ger en digital identitet attribut och knyter den till en person eller en icke-person (en process, ett program eller en enhet). Målet är en identitet som gäller i hela organisationen, inte en per program. |
| **Credential management** | sköter livscykeln för en **credential**, till exempel ett smartkort eller ett digitalt certifikat, som binder en identitet till något användaren har: från utfärdande till förnyelse och återkallelse |
| **Access management** | styr hur användare och processer får åtkomst till resurser, både logiskt och fysiskt |

**Identity federation** gör att en organisation kan lita på identiteter, attribut och credentials som en annan organisation har utfärdat. En **trust framework** fungerar som ett certifieringsprogram: den part som tar emot en identitet (**relying party**) kan lita på policyerna hos den som utfärdat den (**identity service provider**), och tvärtom. **OpenID** är ett exempel, där användaren loggar in på många webbplatser med ett och samma konto hos en identitetsleverantör.
`,
};

export const topic = {
  id: "bok4-access",
  name: "Access control: DAC, MAC, RBAC och ABAC",
  chapter: "bok4",
  examWeight: "hög",
  summary: "Access control avgör vem som får göra vad med en resurs. De fyra policyerna skiljer sig i vad beslutet bygger på: identitet och ägarens val (DAC), etiketter mot clearance (MAC), roller (RBAC) eller attribut hos subjekt, objekt och miljö (ABAC). DAC lagras som ACL:er eller capability tickets, och Bell-LaPadula är MAC:s klassiska modell.",
  keyPoints: [
    "Grundelementen: subject (den som begär åtkomst), object (resursen) och access right (hur den får användas).",
    "Tre klasser av subject: owner, group och world, där world får minst åtkomst.",
    "DAC: bygger på identitet; den som har en rättighet, oftast ägaren, kan själv ge den vidare.",
    "MAC: säkerhetsetiketter jämförs med clearance; systemets regler bestämmer, inte ägaren.",
    "RBAC: rättigheter knyts till roller och användare till roller; entiteterna är user, role, permission och session.",
    "ABAC: regler över attribut hos subject, object och environment.",
    "ACL och capability ticket: matrisen per kolumn (vilka får nå ett objekt) respektive per rad (vad en användare får nå).",
    "Bell-LaPadula: no read up och no write down skyddar confidentiality.",
    "Role constraints: mutually exclusive roles, cardinality och prerequisite roles.",
  ],
  pitfalls: [
    "I DAC bestämmer ägaren; i MAC bestämmer systemet utifrån etiketter och clearance.",
    "En ACL utgår från objektet (kolumnen), en capability ticket från användaren (raden).",
    "No write down förbjuder att skriva nedåt; att skriva uppåt är tillåtet, men inte att läsa uppåt.",
    "Tid på dygnet och nätverk är environment attributes i ABAC, inte subject- eller object-attribut.",
    "Mutually exclusive roles ger separation of duties; cardinality är ett tak för antal; prerequisite role kräver en annan roll först.",
  ],
};

export const glossary = [
  { term: "Subject", definition: "Den enhet som begär åtkomst till ett objekt, i praktiken en process som agerar för en användare eller ett program. Delas i enkla system in i owner, group och world.", chapter: "bok4" },
  { term: "Object", definition: "En resurs vars åtkomst kontrolleras, till exempel en fil, en post, en katalog eller ett program.", chapter: "bok4" },
  { term: "Access right", definition: "Sättet ett subject får använda ett objekt på, till exempel read, write, execute, delete, create eller search.", chapter: "bok4" },
  { term: "Discretionary access control (DAC)", definition: "Access control som bygger på identiteten hos den som begär åtkomst. Den som har en rättighet, oftast ägaren, kan själv ge andra åtkomst.", chapter: "bok4" },
  { term: "Mandatory access control (MAC)", definition: "Access control där säkerhetsetiketter på resurserna jämförs med subjektens clearance. Systemets regler bestämmer, och den som har behörighet kan inte på eget initiativ ge den vidare.", chapter: "bok4" },
  { term: "Attribute-based access control (ABAC)", definition: "Access control där regler prövar attribut hos subjektet, objektet och miljön, till exempel befattning, dokumentets författare och tid på dygnet.", chapter: "bok4" },
  { term: "Access matrix", definition: "Tabell med subjekt på ena ledden och objekt på den andra, där varje ruta anger subjektets rättigheter till objektet. DAC:s grundmodell.", chapter: "bok4" },
  { term: "Access control list (ACL)", definition: "Access matrix uppdelad per kolumn: för ett objekt listas vilka användare som får nå det och med vilka rättigheter.", chapter: "bok4" },
  { term: "Capability ticket", definition: "Access matrix uppdelad per rad: för en användare anges vilka objekt och operationer hen får. Måste vara omöjlig att förfalska.", chapter: "bok4" },
  { term: "Protection domain", definition: "En mängd objekt tillsammans med rättigheterna till dem. En process kan få en egen domän med bara en del av användarens rättigheter.", chapter: "bok4" },
  { term: "Bell-LaPadula (BLP) model", definition: "Formell modell för MAC som skyddar confidentiality med två regler: no read up (simple security property) och no write down (*-property).", chapter: "bok4" },
  { term: "Role hierarchies", definition: "I RBAC: en högre roll ärver alla rättigheter från rollerna under sig. Ingår i RBAC1 och RBAC3.", chapter: "bok4" },
  { term: "Role constraints", definition: "Regler för hur roller får tilldelas i RBAC: mutually exclusive roles, cardinality och prerequisite roles. Ingår i RBAC2 och RBAC3.", chapter: "bok4" },
  { term: "Identity, credential, and access management (ICAM)", definition: "Ett samlat sätt att hantera digitala identiteter, credentials och åtkomst, i tre delar: identity management, credential management och access management.", chapter: "bok4" },
  { term: "Identity federation", definition: "Teknik, standarder och avtal som gör att en organisation kan lita på identiteter, attribut och credentials som en annan organisation har utfärdat.", chapter: "bok4" },
];

export const questions = [
  { id: "sak-bok4-v13", topic: "bok4-access", difficulty: 1, ...variant("sak-13", "RBAC bygger på roller"),
    question: "Which access control policy attaches access rights to job functions and then assigns users to them?",
    options: [
      { text: "Discretionary access control (DAC)", explain: "DAC bygger på användarens identitet, och ägaren ger själv andra åtkomst." },
      { text: "Mandatory access control (MAC)", explain: "MAC jämför säkerhetsetiketter på resurserna med användarnas clearance." },
      { text: "Attribute-based access control (ABAC)", explain: "ABAC prövar attribut hos användare, resurs och miljö. En roll kan vara ett av attributen, men ABAC behöver inga roller." },
      { text: "Role-based access control (RBAC)", explain: "I RBAC knyts rättigheterna till roller, alltså arbetsuppgifter, och användarna tilldelas roller." },
    ],
    correct: 3, reviewed: false },

  { id: "sak-bok4-v14", topic: "bok4-access", difficulty: 2, ...variant("sak-14", "vem som bestämmer i DAC"),
    question: "Why is discretionary access control (DAC) called \"discretionary\"?",
    options: [
      { text: "The owner can give others access by their own choice", explain: "Den som har en rättighet, oftast ägaren, kan efter eget val ge andra åtkomst." },
      { text: "The system decides by comparing labels and clearances", explain: "Det är MAC. Där kan den som har clearance inte på eget initiativ släppa in någon annan." },
      { text: "Access rights follow the roles a user holds at work", explain: "Det är RBAC, där rättigheterna sitter på rollen och inte på personen." },
      { text: "Rules weigh user, object and environment attributes", explain: "Det är ABAC, som prövar attribut vid varje begäran." },
    ],
    correct: 0, reviewed: false },

  { id: "sak-bok4-01", topic: "bok4-access", difficulty: 1,
    question: "Basic access control systems define three classes of subject. Which are they?",
    options: [
      { text: "User, role and session", explain: "Tre av RBAC-grundmodellens fyra entiteter; den fjärde är permission." },
      { text: "Read, write and execute", explain: "Det är access rights, till exempel de tre bitarna i UNIX, inte klasser av subject." },
      { text: "Owner, group and world", explain: "Ägaren, en namngiven grupp och alla andra, där world får minst åtkomst." },
      { text: "Subject, object and access right", explain: "Det är de tre grundelementen i access control, inte klasserna av subject." },
    ],
    correct: 2, source: "Bokens kapitel 4 (owner, group och world)", reviewed: false },

  { id: "sak-bok4-02", topic: "bok4-access", difficulty: 2,
    question: "In discretionary access control, what does a capability ticket specify?",
    options: [
      { text: "The users who may access one object, and how", explain: "Det är en access control list (ACL), alltså matrisen uppdelad per kolumn." },
      { text: "The objects and operations one user is allowed", explain: "En capability ticket är matrisen uppdelad per rad: allt en viss användare får göra." },
      { text: "The security level of an object, such as secret", explain: "Säkerhetsnivåer och etiketter hör till MAC, inte till DAC:s datastrukturer." },
      { text: "The roles a user has activated in one session", explain: "Det är en session i RBAC." },
    ],
    correct: 1, source: "Bokens kapitel 4 (ACL och capability ticket)", reviewed: false },

  { id: "sak-bok4-03", topic: "bok4-access", difficulty: 2,
    question: "What is a protection domain in access control?",
    options: [
      { text: "A set of objects together with access rights to them", explain: "I access matrix motsvarar en rad en domän, och en process kan få en domän med bara en del av användarens rättigheter." },
      { text: "A network zone that a firewall keeps apart from others", explain: "Det beskriver brandväggens säkerhetsdomäner i nätet, inte en protection domain." },
      { text: "The group of users who all share one role in RBAC", explain: "Det är användarna som tilldelats en roll, inte en protection domain." },
      { text: "The security level that a subject is cleared for", explain: "Det är en clearance i MAC och Bell-LaPadula." },
    ],
    correct: 0, source: "Bokens kapitel 4 (protection domain)", reviewed: false },

  { id: "sak-bok4-04", topic: "bok4-access", difficulty: 2,
    question: "In the Bell-LaPadula model, what does the \"no write down\" rule prevent?",
    options: [
      { text: "Reading objects above the subject's own clearance", explain: "Det är den andra regeln, no read up (simple security property)." },
      { text: "Writing into objects above the subject's own level", explain: "Att skriva uppåt är tillåtet i Bell-LaPadula; det är skrivning nedåt som är förbjuden." },
      { text: "Copying secret data into a less classified object", explain: "No write down (*-property) hindrar att hemlig information läcker till en lägre nivå, där fler kan läsa den." },
      { text: "Activating more roles than the task requires", explain: "Det handlar om sessioner och least privilege i RBAC, inte om Bell-LaPadula." },
    ],
    correct: 2, source: "Bokens kapitel 4 (Bell-LaPadula)", reviewed: false },

  { id: "sak-bok4-05", topic: "bok4-access", difficulty: 2,
    question: "Which RBAC constraint lets a user hold only one role in a given set, to support separation of duties?",
    options: [
      { text: "Cardinality constraint", explain: "Cardinality sätter ett tak för antal, till exempel hur många användare en roll får ha." },
      { text: "Mutually exclusive roles", explain: "Användaren får bara en av rollerna i mängden, vilket stöder separation of duties och försvårar samarbete för att kringgå policyn." },
      { text: "Prerequisite role constraint", explain: "En prerequisite role kräver att användaren redan har en viss annan roll." },
      { text: "Role hierarchy with inheritance", explain: "En hierarki låter en högre roll ärva rättigheter; den hindrar ingen från att ha flera roller." },
    ],
    correct: 1, source: "Bokens kapitel 4 (role constraints)", reviewed: false },

  { id: "sak-bok4-06", topic: "bok4-access", difficulty: 1,
    question: "In attribute-based access control (ABAC), which of these are environment attributes?",
    options: [
      { text: "A user's identifier, organization and job title", explain: "Det är subject attributes, som beskriver den som begär åtkomst." },
      { text: "The title, subject, date and author of a document", explain: "Det är object attributes, ofta hämtade ur dokumentets metadata." },
      { text: "Security labels on files and the users' clearances", explain: "Etiketter och clearance hör till MAC." },
      { text: "The current time, hacker activity and network used", explain: "Environment attributes beskriver sammanhanget kring begäran, inte användaren eller resursen." },
    ],
    correct: 3, source: "Bokens kapitel 4 (ABAC:s attribut)", reviewed: false },
  { id: "sak-bok4-07", topic: "bok4-access", difficulty: 1,
    question: "In mandatory access control (MAC), what decides whether a subject may access an object?",
    options: [
      { text: "The object's owner, who may grant access to anyone else", explain: "Det är discretionary access control (DAC): den som har en rättighet kan själv ge den vidare." },
      { text: "Security labels on objects compared with clearances", explain: "Systemets regler jämför resursens klassning med subjektets clearance. Den som har behörighet kan inte på eget initiativ ge den vidare." },
      { text: "The roles that are assigned to the subject's job", explain: "Det är role-based access control (RBAC), där rättigheterna hör till roller." },
      { text: "Rules evaluating subject, object and environment", explain: "Det är attribute-based access control (ABAC), som prövar attribut hos subjekt, objekt och miljö." },
    ],
    correct: 1, source: "Bokens kapitel 4 (MAC)", reviewed: false },

  { id: "sak-bok4-08", topic: "bok4-access", difficulty: 2,
    question: "What is an access control list (ACL)?",
    options: [
      { text: "A ticket held by a user, listing the objects it may access", explain: "Det är en capability ticket: access matrix uppdelad per rad, alltså per subjekt." },
      { text: "A set of objects with the access rights a process holds", explain: "Det är en protection domain." },
      { text: "A table of every subject and every object in the whole system", explain: "Det är hela access matrix. En ACL är en kolumn ur den." },
      { text: "A list for one object of the users and their access rights", explain: "Access matrix uppdelad per kolumn: för varje objekt listas vilka användare som får nå det och med vilka rättigheter." },
    ],
    correct: 3, source: "Bokens kapitel 4 (access matrix, ACL och capability)", reviewed: false },
];

export const notes = `Byggt på kap. 4 i del1-filen, s. 188–245: inledningen och 4.1 (definitioner, context, de fyra policyerna), 4.2 (subject/object/access right, owner/group/world), 4.3 (access matrix, ACL, capability ticket, protection domain, user/kernel mode), 4.4 bara som en mening om UNIX owner/group/others, 4.5 (MAC, BLP, MLS, MIC), 4.6 (RBAC, entiteter, RBAC0–3, hierarkier, constraints), 4.7 (ABAC:s tre attributtyper, styrka/kostnad, streamingexemplet), 4.8–4.9 kort (ICAM, identity federation, trust framework, OpenID). Key Terms och Review Questions 4.1–4.11 styrde urvalet.

Osäkert:
- Textfilen har tappat nedsänkta index, så RBAC0–RBAC3 syns inte i Table 4.4 och löptexten. Rekonstruerat ur tabellens Ja/Nej-kolumner och texten ("includes ... adds role hierarchies", "adds constraints", "contains the functionality of ... and"): 0 grund, 1 hierarkier, 2 constraints, 3 båda.
- Boken säger att policyerna "inte utesluter varandra" och att ett system kan använda "two or even all three" (trots fyra policyer). Kapitlet skriver "flera av dem".
- "Vem bestämmer" i RBAC och ABAC: boken säger bara att rättigheter tilldelas roller och användare roller (RBAC), och att systemdesignern eller annan auktoritet definierar reglerna (ABAC). Tabellen håller sig till det.
- OWASP-listan: boken säger att 2021 års rapport hade broken access control först. Gästföreläsningen visar OWASP Top 10 (2025); kapitlet nämner bara 2021 enligt boken.

Medvetet utelämnat: NIST SP 800-171-tabellen, audit trail, ACL:ens standardpost (least privilege eller read-only), Lampsons regler R1–R8 och copy flag, authorization table, UNIX-detaljer (inode, SetUID/SetGID, sticky bit, superuser, extended ACL och mask), BLP:s fyra access modes, ds-property som namn, classification creep och downgrade, AppArmor, ABAC:s formella policynotation och tillitsrelationerna i Figure 4.11, XACML, credential managements fem steg, privilege/resource/policy management, OITF-akronymerna (OIDF, ICF, OIX, AXN), assessors/auditors/dispute resolvers och Dresdner Bank-fallet.

Ordlistan: "Access control" utelämnad, eftersom den också är key term i kap. 1 och kan krocka med ett parallellt kapitel; lägg till den här om kap. 1 inte tar den. "Credential" och "relying party" är key terms i kap. 3 och står bara i löptexten. RBAC och principle of least privilege finns redan (Föreläsning 2).

Frågor: 8 st, varav varianterna sak-bok4-v13 (RBAC, frågar baklänges: beskrivning till policynamn) och sak-bok4-v14 (DAC, varför "discretionary", med MAC, RBAC och ABAC som distraktorer). Rätt position 2/2/2/2.`;
