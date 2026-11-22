// Bokens kapitel 3: Stallings & Brown, User Authentication (s. 130–188).
// Kapitel, ämne, ordlista och frågor; samlas av reading.js, topics.js och
// questions.js via bok/index.js. Skrivet med egna ord på tentans nivå,
// granskat mot boken 22 nov 2026 (ogranskat av Kasper). `notes` är
// källanteckningarna och visas inte.

const variant = (id, what) => ({ variantOf: id, source: `Variant av en tentafråga från förra året (${what})` });

export const chapter = {
  id: "bok3",
  kind: "bok",
  label: "Bokens kapitel 3",
  examArea: "Bokfrågor",
  title: "User authentication: lösenord, tokens och biometri",
  readingMinutes: 11,
  lead: "Hur ett system prövar att du är den du säger: de fyra sätten att autentisera, vad som räknas som flera faktorer, hur lösenord angrips och skyddas, och hur kort, tokens och biometri fungerar.",
  sources: ["Stallings & Brown kap. 3 (s. 130–188)"],
  body: `
## Kärnan

- **User authentication** prövar att en användare verkligen har den identitet hen gör anspråk på. Först därefter kan systemet avgöra vad användaren får göra.
- Det finns **fyra sätt** att autentisera: något man vet, något man har, något man är och något man gör.
- **Multifactor authentication (MFA)** kombinerar faktorer ur olika kategorier. Två saker man vet är fortfarande bara en kategori.
- **Lösenord** är vanligast men har många svagheter. De lagras hashade med ett **salt**, och användarna styrs mot lösenord som är svåra att gissa.
- **Tokens** är saker man har: memory cards, smart cards, hårdvarutokens och mobiler.
- **Biometri** jämför ett prov med ett lagrat mönster. Matchningen är aldrig exakt, så en tröskel avgör, och den väger två sorters fel mot varandra.

## Identifiera och verifiera

När du loggar in anger du ett användar-id och ett lösenord. De gör olika saker:

- **Id:t** säger vem du påstår dig vara. Det avgör om du får komma in över huvud taget, vilka privilegier du har och vilka andra som kan ge dig åtkomst till sina filer (se kapitlet om access control).
- **Lösenordet** bekräftar att id:t verkligen är ditt. Ett användarnamn ensamt bevisar alltså ingenting.

Boken följer NIST:s modell i två faser:

| Fas | Vad som händer |
|---|---|
| **Registrering** | användaren registreras och får en **credential**, en datastruktur som knyter identiteten till en token som användaren har |
| **Autentisering** | användaren, nu kallad **claimant**, visar för en **verifier** att hen kontrollerar sin token. Verifier intygar identiteten för den part som fattar åtkomstbeslutet, **relying party** |

## De fyra sätten att autentisera

| Kategori | Exempel |
|---|---|
| Something the individual **knows** | lösenord, PIN-kod, svar på förbestämda säkerhetsfrågor |
| Something the individual **possesses** | nyckelkort, smartkort, fysiska nycklar; kallas **token** |
| Something the individual **is** (**static biometrics**) | fingeravtryck, näthinna, ansikte |
| Something the individual **does** (**dynamic biometrics**) | röstmönster, handstil, skrivrytm |

Alla fyra kan ge säker autentisering, men alla har problem. Lösenord kan gissas, stjälas eller glömmas. Tokens kan stjälas, förfalskas eller tappas bort. Biometri ger falska träffar och missar, och kostnad, bekvämlighet och användarnas acceptans är också problem.

## Multifactor authentication

Föreläsning 2 tar upp MFA i säkerhetspolicyns access management, tillsammans med RBAC. Boken förklarar vad som räknas som flera faktorer.

MFA betyder att användaren visar två eller fler bevis, **faktorer**, ur olika kategorier. Bokens exempel är internetbanken: först ett lösenord (något du vet), sedan en kod som skickas med SMS till mobilen (något du har). Flera faktorer ger ett starkare skydd än en.

| Kombination | Kategorier | MFA? |
|---|---|---|
| smartkort + fingeravtryck | har + är | ja |
| lösenord + kod till mobilen | vet + har | ja |
| lösenord + säkerhetsfråga | vet + vet | nej |
| användarnamn + lösenord | id + vet | nej |

Smartkort plus fingeravtryck var svaret på en av förra årets tentafrågor. Lösenord plus säkerhetsfråga var en distraktor: båda är något du vet.

- Organisationer ger ofta personalen en fysisk token med engångskoder. Allmänheten får oftast en kod via SMS eller från en app.
- MFA är inte heltäckande: social engineering, phishing och malware som fångar koderna kan fortfarande lyckas.

## Lösenord: hoten

Systemet håller en **password file** med en post per användar-id. Boken räknar upp de viktigaste attackerna:

| Attack | Vad angriparen gör | Motmedel |
|---|---|---|
| **Offline dictionary attack** | skaffar lösenordsfilen och jämför hashvärdena med hashvärden av vanliga lösenord | skydda filen, upptäck intrång, byt lösenorden snabbt om filen läckt |
| **Specific account attack** | gissar lösenord mot ett utvalt konto tills det lyckas | lås kontot efter några misslyckade försök, oftast högst fem |
| **Popular password attack** | prövar ett vanligt lösenord mot många användar-id | förbjud vanliga lösenord, leta efter mönster i inloggningsförsöken |
| **Password guessing against single user** | tar reda på saker om kontoinnehavaren och lösenordsreglerna och gissar utifrån det | lösenordspolicy och utbildning |
| **Workstation hijacking** | väntar tills en inloggad dator lämnas obevakad | logga ut automatiskt efter en tids inaktivitet |
| **Exploiting user mistakes** | läser nedskrivna lösenord, lurar fram dem eller provar förinställda administratörslösenord | utbildning, intrångsdetektering, enklare lösenord plus en annan mekanism |
| **Exploiting multiple password use** | utnyttjar att samma lösenord används på flera enheter | förbjud samma eller liknande lösenord |
| **Electronic monitoring** | avlyssnar lösenordet när det skickas över nätet | enkel kryptering räcker inte, eftersom det krypterade lösenordet då blir lösenordet; se challenge-response nedan |

Skilj de två första gissningsattackerna åt: specific account prövar **många lösenord mot ett konto**, popular password prövar **ett lösenord mot många konton**.

## Hashade lösenord och salt

Systemet sparar inte själva lösenordet. Lösenordet kombineras med ett **salt**, ett slumpvärde, och resultatet körs genom en hashfunktion som är medvetet långsam. I filen lagras **hashed password** tillsammans med saltet i klartext. Vid inloggning hashas det inskrivna lösenordet med samma salt, och systemet jämför resultaten.

Saltet gör tre saker:

1. Två användare med samma lösenord får olika hashvärden, så dubbletter syns inte i filen.
2. **Offline dictionary attacks** blir mycket svårare, eftersom varje gissning måste hashas en gång per saltvärde.
3. Det går nästan inte att se om någon använt samma lösenord på flera system.

En **rainbow table** är angriparens svar: en jättetabell med förberäknade hashvärden för troliga lösenord och alla saltvärden, där lagringsutrymme byts mot tid. Motmedlet är ett tillräckligt stort salt och en tillräckligt lång hash.

Saltet gör däremot inte ett svagt lösenord starkt. Angripare utnyttjar just att många väljer lösenord som är lätta att gissa.

Det andra sättet att skydda filen är access control. I en **shadow password file** ligger de hashade lösenorden skilda från användar-id:na, och bara privilegierade användare kan läsa den. Filen kan ändå läcka, till exempel genom intrång eller säkerhetskopior, så användarna måste också välja lösenord som är svåra att gissa.

## Fyra strategier för lösenordsval

| Strategi | Hur | Problemet |
|---|---|---|
| **User education** | användarna får riktlinjer, till exempel att bilda lösenordet av första bokstaven i varje ord i en egen fras | många struntar i råden eller bedömer styrka fel |
| **Computer-generated passwords** | systemet skapar lösenordet | svåra att minnas, skrivs ner, dålig acceptans |
| **Reactive password checking** | systemet kör med jämna mellanrum en egen password cracker och spärrar lösenord som går att gissa | resurskrävande, och lösenorden är sårbara tills de hittas |
| **Complex password policy** | användaren väljer själv, men systemet prövar lösenordet direkt och avvisar det om det är för svagt | balansen mellan styrka och vad användarna står ut med |

Den sista kallas också **proactive password checker**, och boken kallar den ett lovande sätt att få säkrare lösenord. Kontrollen kan bygga på regler, till exempel en minsta längd, eller på en lista med dåliga lösenord.

## Tokens: kort, hårdvara och mobil

En **token** är något användaren har. De vanligaste är kort i bankkortsformat:

| | **Memory card** | **Smart card** |
|---|---|---|
| Kan | lagra men inte bearbeta data | bearbeta data: har en hel mikroprocessor med processor, minne och in- och utgångar |
| Exempel | magnetremsan på ett bankkort, hotellnyckel, presentkort | id-kort, kreditkort, nationellt e-legitimationskort |
| Används | ensamt för passage, eller med PIN eller lösenord för autentisering | kan köra autentiseringsprotokoll, med kontakter eller kontaktlöst via antenn |

Ett memory card med PIN är säkrare än bara ett lösenord, eftersom angriparen behöver både kortet och koden. Nackdelarna är särskilda läsare, borttappade kort och missnöjda användare.

En **hardware token** för **one-time password (OTP)** har en inbyggd hemlig nyckel. Ur nyckeln och aktuell tid, eller en räknare, tar den fram en kod som bara gäller en gång. Systemet räknar fram samma kod och jämför. En **multifactor device** släpper fram koden först när användaren låst upp den med PIN eller biometri.

**Mobilen** används allt oftare som token:

- **Kod via SMS eller röstsamtal** är enkelt, men kräver täckning, och numret kan kapas med en **SIM swap**. NIST räknar därför SMS som en begränsad metod.
- **En autentiseringsapp** som tar fram engångskoder räknas som säkrare än SMS.
- Båda är klart säkrare än bara ett lösenord.

## Biometri

Biometri bygger på mönsterigenkänning, kräver en sensor och är dyrare och mer komplex än lösenord och tokens. Static biometrics är till exempel ansikte, fingeravtryck, handens form, näthinna och iris. Dynamic biometrics är till exempel signatur och röst.

Ett biometriskt system har tre moment:

| Moment | Vad som händer |
|---|---|
| **Enrollment** | användaren registreras: anger namn och ofta lösenord eller PIN, och systemet läser av egenskapen och sparar den som ett **template** |
| **Verification** | användaren uppger vem hen är, till exempel med en PIN, och lämnar ett prov. Systemet jämför med **just den användarens** template. |
| **Identification** | användaren lämnar bara ett prov utan att uppge vem hen är. Systemet jämför med **alla** lagrade templates. |

Bokens exempel på identification är gränskontrollen i Förenade Arabemiraten, där irisen hos varje inresande jämförs mot hela registret över utvisade. Det kräver mer beräkning än verification.

Två prov blir aldrig exakt lika, så systemet räknar fram ett **matching score** och jämför det med en **threshold** (tröskel). Över tröskeln räknas det som en träff. Då kan två fel uppstå:

| Fel | Betyder | Följd |
|---|---|---|
| **False match rate** | prov från olika personer bedöms felaktigt komma från samma person | en obehörig släpps in |
| **False nonmatch rate** | prov från samma person bedöms felaktigt komma från olika personer | en behörig användare avvisas |

- **Höjs tröskeln** blir false match rate lägre och false nonmatch rate högre. Säkerheten ökar, men fler behöriga avvisas. Sänks tröskeln blir det tvärtom.
- Ett rimligt mellanläge är där båda felen är lika vanliga. Ett system med höga säkerhetskrav väljer en mycket låg false match rate.

Biometriska läsare finns också i Föreläsning 2:s data center-modell, där de är en fysisk kontroll för tillträdet till lokalerna.

## Autentisering på distans: challenge-response

Att logga in på en dator framför sig är **local authentication**. Över ett nät, **remote user authentication**, tillkommer två hot: någon kan avlyssna lösenordet, och någon kan spela in en inloggning och skicka den igen, en **replay attack**.

Mot det används ett **challenge-response protocol**:

1. Användaren skickar sitt id.
2. Värden svarar med en utmaning: ett slumptal, en **nonce**.
3. Användaren skickar tillbaka ett värde som är beräknat ur nonce och hashen av lösenordet (eller tokenens kod, eller biometrin).
4. Värden räknar fram samma värde och jämför.

Lösenordet skickas aldrig, och eftersom varje inloggning får en ny nonce går ett inspelat svar inte att återanvända.
`,
};

export const topic = {
  id: "bok3-autentisering",
  name: "User authentication: lösenord, tokens och biometri",
  chapter: "bok3",
  examWeight: "hög",
  summary: "User authentication prövar att en användare är den hen säger. Det finns fyra sätt: något man vet, har, är (static biometrics) och gör (dynamic biometrics), och MFA kombinerar faktorer ur olika kategorier. Lösenord lagras hashade med salt och hotas av bland annat offline dictionary attacks. Memory cards lagrar, smart cards bearbetar, och biometri väger false match mot false nonmatch med en tröskel.",
  keyPoints: [
    "Användar-id och lösenord: id:t säger vem användaren påstår sig vara, lösenordet bekräftar det.",
    "Fyra sätt att autentisera: något man vet, har (token), är (static biometrics) och gör (dynamic biometrics).",
    "Multifactor authentication: två eller fler faktorer ur olika kategorier, till exempel smartkort och fingeravtryck.",
    "Lösenordshot: offline dictionary (stulen fil), specific account (ett konto), popular password (många konton) och workstation hijacking.",
    "Salt: lika lösenord får olika hashvärden, och offline dictionary attacks och rainbow tables blir mycket svårare.",
    "Strategier för lösenordsval: user education, computer-generated passwords, reactive checking och complex password policy.",
    "Memory card och smart card: ett memory card kan bara lagra data, ett smart card har processor och kan bearbeta.",
    "Verification och identification: verification jämför mot en uppgiven användares template, identification mot alla.",
    "Tröskeln i biometri: höjs den blir false match rate lägre och false nonmatch rate högre, och tvärtom.",
  ],
  pitfalls: [
    "Lösenord plus säkerhetsfråga är inte MFA: båda är något man vet. Faktorerna ska komma ur olika kategorier.",
    "Specific account attack prövar många lösenord mot ett konto; popular password attack prövar ett vanligt lösenord mot många konton.",
    "Det är smart card som har processor och kan bearbeta data; ett memory card kan bara lagra.",
    "Vid verification uppger användaren vem hen är; vid identification gör hen det inte, och systemet söker bland alla templates.",
    "En högre tröskel ger färre false matches men fler false nonmatches; båda felen går inte att sänka genom att flytta tröskeln.",
  ],
};

export const glossary = [
  { term: "User authentication", definition: "Att pröva att en användare verkligen har den identitet hen gör anspråk på, med ett eller flera bevis som lösenord, token eller biometri. Den autentiserade identiteten används sedan för att avgöra vad användaren får göra.", chapter: "bok3" },
  { term: "Identification", definition: "I biometri: användaren lämnar ett prov utan att uppge vem hen är, och systemet jämför det med alla lagrade templates. Ger det en träff är användaren identifierad, annars avvisas hen.", chapter: "bok3" },
  { term: "Verification", definition: "I biometri: användaren uppger vem hen är, till exempel med en PIN, och lämnar ett prov som jämförs med just den användarens template.", chapter: "bok3" },
  { term: "Enrollment", definition: "Registreringen i ett biometriskt system: användaren anger namn och ofta lösenord eller PIN, och systemet sparar egenskapen som ett template. Motsvarar att få ett lösenord tilldelat.", chapter: "bok3" },
  { term: "Static biometric", definition: "Något användaren är: en kroppslig egenskap som fingeravtryck, ansikte, handens form, näthinna eller iris.", chapter: "bok3" },
  { term: "Dynamic biometric", definition: "Något användaren gör: ett beteende som röstmönster, handstil och signatur eller skrivrytm.", chapter: "bok3" },
  { term: "Token", definition: "Något användaren har och autentiserar sig med, till exempel ett nyckelkort, ett smartkort, en hårdvarutoken eller en mobil.", chapter: "bok3" },
  { term: "Hashed password", definition: "Lösenordet lagras inte i klartext utan som hashvärdet av lösenordet och ett salt. Vid inloggning hashas det inskrivna lösenordet på samma sätt och jämförs.", chapter: "bok3" },
  { term: "Salt", definition: "Ett slumpvärde som kombineras med lösenordet innan det hashas och som lagras i klartext bredvid. Gör att lika lösenord får olika hashvärden och att offline dictionary attacks blir mycket svårare.", chapter: "bok3" },
  { term: "Rainbow table", definition: "En förberäknad tabell med hashvärden för troliga lösenord och alla saltvärden, där lagringsutrymme byts mot tid. Motverkas av ett tillräckligt stort salt och en tillräckligt lång hash.", chapter: "bok3" },
  { term: "Shadow password file", definition: "En separat fil med de hashade lösenorden, skild från användar-id:na och läsbar bara för privilegierade användare.", chapter: "bok3" },
  { term: "Memory card", definition: "Ett kort som kan lagra men inte bearbeta data, till exempel ett kort med magnetremsa. Används för autentisering tillsammans med en PIN eller ett lösenord.", chapter: "bok3" },
  { term: "Smart card", definition: "Ett kort med en hel mikroprocessor som kan bearbeta data och köra autentiseringsprotokoll. Kan ha kontakter eller vara kontaktlöst.", chapter: "bok3" },
  { term: "One-time password (OTP)", definition: "En kod som bara får användas en gång. En token tar fram den ur en inbyggd hemlig nyckel och aktuell tid eller en räknare, och systemet räknar fram samma kod och jämför.", chapter: "bok3" },
  { term: "Challenge-response protocol", definition: "Autentisering på distans där värden skickar en slumpmässig utmaning (nonce) och användaren svarar med ett värde beräknat ur den och sin hemlighet. Skyddar mot avlyssning och replay.", chapter: "bok3" },
];

const T = "bok3-autentisering";

export const questions = [
  { id: "sak-bok3-v02", topic: T, difficulty: 1, ...variant("sak-02", "vad som inte räknas som MFA"),
    question: "Which of these combinations does NOT count as multifactor authentication?",
    options: [
      { text: "A smart card plus a PIN code", explain: "Något du har (kortet) och något du vet (koden): två kategorier, alltså MFA." },
      { text: "A password plus an SMS code", explain: "Bokens eget exempel på MFA: något du vet och en kod till mobilen, som är något du har." },
      { text: "A password plus a security question", explain: "Båda är något du vet, alltså samma kategori. Faktorerna ska komma ur olika kategorier." },
      { text: "A fingerprint plus a hardware token", explain: "Något du är (static biometric) och något du har (token): två kategorier, alltså MFA." },
    ],
    correct: 2, reviewed: false },

  { id: "sak-bok3-01", topic: T, difficulty: 1,
    question: "Voice pattern and typing rhythm belong to which means of user authentication?",
    options: [
      { text: "Something the individual knows", explain: "Det är till exempel lösenord, PIN-kod och svar på säkerhetsfrågor." },
      { text: "Something the individual possesses", explain: "Det är en token, till exempel ett nyckelkort eller ett smartkort." },
      { text: "Something the individual is", explain: "Det är static biometrics, kroppsliga egenskaper som fingeravtryck, ansikte och näthinna." },
      { text: "Something the individual does", explain: "Röst, handstil och skrivrytm är beteenden, alltså dynamic biometrics." },
    ],
    correct: 3, source: "Bokens kapitel 3 (de fyra sätten att autentisera)", reviewed: false },

  { id: "sak-bok3-02", topic: T, difficulty: 2,
    question: "An attacker tries one commonly used password against a wide range of user IDs. Which attack is this?",
    options: [
      { text: "Specific account attack", explain: "Där gissar angriparen många lösenord mot ett enda konto; motmedlet är att låsa kontot efter några försök." },
      { text: "Popular password attack", explain: "Ett vanligt lösenord prövas mot många konton, eftersom användare gärna väljer lösenord som är lätta att minnas." },
      { text: "Offline dictionary attack", explain: "Där har angriparen skaffat lösenordsfilen och jämför hashvärdena med hashvärden av vanliga lösenord." },
      { text: "Workstation hijacking", explain: "Där väntar angriparen tills en inloggad dator lämnas obevakad." },
    ],
    correct: 1, source: "Bokens kapitel 3 (attacker mot lösenord)", reviewed: false },

  { id: "sak-bok3-03", topic: T, difficulty: 2,
    question: "Which attack does adding a salt to hashed passwords make much harder?",
    options: [
      { text: "Offline dictionary attacks on a stolen password file", explain: "Med salt måste varje gissning hashas en gång per saltvärde, och lika lösenord syns inte som lika hashvärden." },
      { text: "Using a logged-in workstation that is left unattended", explain: "Det är workstation hijacking, som motverkas med automatisk utloggning efter en tids inaktivitet." },
      { text: "Guessing many passwords online against one account", explain: "Det är en specific account attack, som motverkas med att kontot låses efter några misslyckade försök." },
      { text: "Replaying a captured login response over the network", explain: "Mot replay används ett challenge-response protocol med en ny nonce vid varje inloggning." },
    ],
    correct: 0, source: "Bokens kapitel 3 (hashade lösenord och salt)", reviewed: false },

  { id: "sak-bok3-04", topic: T, difficulty: 2,
    question: "Which password selection strategy lets users choose their own password but has the system reject weak ones at the moment they are chosen?",
    options: [
      { text: "Reactive password checking", explain: "Där kör systemet med jämna mellanrum en egen password cracker och spärrar lösenord i efterhand." },
      { text: "User education strategy", explain: "Användarna får bara riktlinjer, och systemet kontrollerar inget." },
      { text: "Computer-generated passwords", explain: "Där väljer användaren inte själv; systemet skapar lösenordet." },
      { text: "Complex password policy", explain: "Kallas också proactive password checker: systemet prövar lösenordet när det väljs och avvisar det om det är för svagt." },
    ],
    correct: 3, source: "Bokens kapitel 3 (strategier för lösenordsval)", reviewed: false },

  { id: "sak-bok3-05", topic: T, difficulty: 1,
    question: "What distinguishes a smart card from a memory card?",
    options: [
      { text: "It has a processor and can process data", explain: "Ett smart card har en hel mikroprocessor och kan köra autentiseringsprotokoll." },
      { text: "It can store data but cannot process it", explain: "Det beskriver ett memory card." },
      { text: "It keeps a security code on a magnetic stripe", explain: "Magnetremsan på ett bankkort är det vanligaste exemplet på ett memory card." },
      { text: "It works only with a contactless reader", explain: "Ett smart card kan ha kontakter på ytan eller vara kontaktlöst; båda finns." },
    ],
    correct: 0, source: "Bokens kapitel 3 (memory card och smart card)", reviewed: false },

  { id: "sak-bok3-06", topic: T, difficulty: 3,
    question: "A biometric system raises its matching threshold so that a closer match is required. What happens?",
    options: [
      { text: "The false match rate rises and the false nonmatch rate falls", explain: "Det är tvärtom; så blir det när tröskeln sänks." },
      { text: "Both the false match and the false nonmatch rates fall", explain: "Att flytta tröskeln byter det ena felet mot det andra; båda kan inte sänkas så." },
      { text: "The false match rate falls and the false nonmatch rate rises", explain: "Färre obehöriga släpps in, men fler behöriga avvisas. Säkerheten ökar på bekvämlighetens bekostnad." },
      { text: "The system switches from verification to identification", explain: "Verification och identification skiljer sig i om användaren uppger vem hen är, inte i tröskeln." },
    ],
    correct: 2, source: "Bokens kapitel 3 (false match och false nonmatch)", reviewed: false },

  { id: "sak-bok3-07", topic: T, difficulty: 2,
    question: "At a border, each traveller's iris is compared with every enrolled template, without the traveller first stating who they are. What is this?",
    options: [
      { text: "Biometric verification", explain: "Vid verification uppger användaren vem hen är och jämförs bara med den användarens template." },
      { text: "Biometric identification", explain: "Ingen identitet uppges, så systemet söker bland alla lagrade templates." },
      { text: "Biometric enrollment", explain: "Enrollment är registreringen, när användarens template sparas första gången." },
      { text: "Dynamic biometric matching", explain: "Irisen är en static biometric, något man är; dynamic biometrics är till exempel röst och skrivrytm." },
    ],
    correct: 1, source: "Bokens kapitel 3 (verification och identification)", reviewed: false },
];

export const notes = `Byggt på kap. 3 i del1-filen, s. 130–188: 3.1 (NIST:s definition och modell i korthet, de fyra sätten, MFA), 3.2 (id:t och lösenordets roller, attackerna och motmedlen, hashade lösenord och saltets tre syften, rainbow table, shadow password file, de fyra strategierna), 3.3 (memory card mot smart card, OTP-token, single- och multifactor device, mobil med SMS och app), 3.4 (static/dynamic, enrollment/verification/identification, false match/nonmatch och tröskeln), 3.5 kort (local mot remote, challenge-response utan funktionerna f och h), 3.7 som en mening (UAE-iris som exempel på identification). Key Terms och Review Questions 3.1–3.9 styrde urvalet.

Osäkert:
- "Identification mot verification": 5:e upplagan har inte de äldre upplagornas "identification step / verification step". Kapitlet bygger på två ställen i denna upplaga: id:t identifierar och lösenordet "serves to authenticate the ID" (3.2), och biometrins verification/identification (3.4, Review Question 3.7). Ordlistans Identification och Verification är biometrins betydelse, som i Key Terms.
- Att MFA kräver faktorer ur *olika kategorier* säger boken inte ordagrant. Den säger "two or more pieces of evidence (or factors)" ur know/possess/are/do, NIST AAL2 kräver "two distinct authentication factors", och säkerhetsfrågor står under "something the individual knows". Slutsatsen lösenord + säkerhetsfråga = inte MFA följer av det och av förra årets svar.
- Användarnamn + lösenord i MFA-tabellen står som "id + vet": id:t är inget autentiseringsbevis enligt 3.2. Captcha (distraktor i originalfrågan) tas inte upp i boken och nämns inte.
- Tröskelns riktning: boken säger att s ≥ t ger match och att lägre false match rate ger högre false nonmatch rate. "Höjs tröskeln blir false match rate lägre" är härlett ur det och Figure 3.9 (inte ordagrant).
- Smart card-exemplen (id-kort, kreditkort, eID) är ur Table 3.2 och avsnittet om eID; "nationellt e-legitimationskort" är min översättning av "national electronic identity (eID) card".
- Mening 5061 i textfilen är avklippt ("Dynamic biometrics are l…"); inget byggt på den.

Medvetet utelämnat: NIST SP 800-171-tabellen, de fyra skälen till att lösenord består, registration authority, credential service provider, applicant och subscriber som namn (modellen står med credential, claimant, verifier och relying party), IAL1–3 och AAL1–3, UNIX-implementationerna (crypt(3), MD5 crypt, Bcrypt), lösenordsknäckningens historia och siffror (Klein, RockYou, GPU, PCFG, Mazurek), Bloom filter, basic16/comprehensive8, kortens tabell med embossed och magnetic stripe som egna typer, smart card-minnena (ROM/EEPROM/RAM), ATR/PTS, det tyska eID-kortet och PACE, TOTP-formeln, FIDO2/WebAuthn, prompt-bombing och backup-koder i detalj, Figure 3.7 och 3.10–3.11 (operating characteristic curve), de fyra challenge-response-varianterna i detalj, Table 3.4 (attacker per authenticator, inklusive Trojan horse och denial-of-service/lockout) och ATM-fallet i 3.8.

Ordlistan: 15 termer ur Key Terms. Inte med: multifactor authentication (MFA) (finns redan från Föreläsning 2), biometric och password (för allmänna), nonce (förklaras i löptexten och i Challenge-response protocol), samt credential, claimant, verifier, relying party, RA, CSP, applicant och subscriber (NIST-modellen; credential och relying party står i löptexten och kan bytas in mot t.ex. Shadow password file om kap. 4 vill hänvisa hit). "Enrollment" står för Key Terms "enroll".

Frågor: 8 st, varav varianten sak-bok3-v02 (MFA, frågar baklänges: vilket par som INTE är MFA; inget alternativ ordagrant från originalet). Rätt position 2/2/2/2. Rätt svar är inte ensamt längst i någon fråga.`;
