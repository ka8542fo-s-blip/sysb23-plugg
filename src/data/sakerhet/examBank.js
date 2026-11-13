// Säkerhet i informationssystem: de 26 unika flervalsfrågorna på HT25:s tre
// tentor (ordinarie 25 nov 2025, omtenta 14 jan 2026, uppsamling 18 maj 2026).
// Frågetext och alternativ är tentornas, ordagrant (radbrytningar
// ihopslagna, stavfel kvar: "bling" i sak-23). Kontrollerade mot PDF:erna
// 2026-11-13. Tentorna har inget publicerat facit — rätt svar och
// förklaringar är sajtens egna, skrivna utifrån Stallings & Brown.
//
// Formen är Övas (`question`, `options`, `correct`, `explanation`), så att
// QuestionCard ritar frågorna som de är. Frågorna ligger INTE i
// course.questions: Öva-frågor kräver ett kapitel bakom sig, och de här är
// tentans egna. De når Öva via läget Tentafrågor (data/sakerhet/pastExams.js)
// och fliken Tenta.
//
// Alternativen står i en fast ordning här; varje tentas egen ordning ligger
// i pastExams.js (`order`). Poäng och avdrag följer frågan, inte platsen på
// tentan:
//   points  — "Totalpoäng" på tentan
//   penalty — avdrag vid fel ("incorrect answer gives -N point"); 0 där
//             tentan inte anger något avdrag
// Specialfall:
//   sak-16  6 p: frågetexten säger "Correct answer gives 5 points" men
//           tentan räknar "Totalpoäng: 6", och bara så blir summan 100.
//   sak-23  två identiska rätta alternativ (det ena med punkt) — båda rätt.
//   sak-24, sak-26  inget avdrag angivet på tentan, alltså 0 vid fel.
//   sak-03, sak-26  bara tre alternativ.

export const examBank = [
  {
    id: "sak-01",
    question: "Which technique can be used to mitigate SQL injection attacks?",
    options: [
      { text: "Encrypting all database queries" },
      { text: "Enabling automatic backups" },
      { text: "Use of prepared statements" },
      { text: "Disabling database logging" },
    ],
    correct: 2,
    points: 5,
    penalty: 0,
    explanation:
      "Prepared statements skickar SQL-koden och användarens indata separat, så indata kan aldrig tolkas som kod. Kryptering, backup och loggning påverkar inte hur frågan tolkas. Samma teknik används i Java/JDBC-delen av Databaser (PreparedStatement).",
  },
  {
    id: "sak-02",
    question: "Which of the following is an example of multi-factor authentication?",
    options: [
      { text: "Username and password" },
      { text: "Smartcard and fingerprint" },
      { text: "Password and security question" },
      { text: "Captcha and PIN" },
    ],
    correct: 1,
    points: 5,
    penalty: 0,
    explanation:
      "Multi-factor kräver faktorer från olika kategorier: något du vet, något du har, något du är. Smartkort (har) plus fingeravtryck (är) är två kategorier. Lösenord plus säkerhetsfråga är två saker du vet, alltså en faktor. Användarnamn identifierar men autentiserar inte. Captcha visar bara att du är en människa.",
  },
  {
    id: "sak-03",
    question: "What is the purpose of a firewall?",
    options: [
      { text: "To identify the source of a security breach" },
      { text: "To act as a boundary system that separates different security domains within and between organisations" },
      { text: "To ensure that business operations can continue during and after a disaster" },
    ],
    correct: 1,
    points: 5,
    penalty: 0,
    explanation:
      "Brandväggen är en gräns mellan säkerhetsdomäner, till exempel internt nät och internet. Att spåra ett intrång är incidentutredning, och att verksamheten fortsätter efter en katastrof är kontinuitetsplanering.",
  },
  {
    id: "sak-04",
    question: "In the context of business continuity planning, what does \"RTO\" stand for?",
    options: [
      { text: "Response Time Optimization" },
      { text: "Risk Transfer Option" },
      { text: "Recovery Time Objective" },
      { text: "Real-Time Optimization" },
    ],
    correct: 2,
    points: 5,
    penalty: 1,
    explanation:
      "RTO är den längsta tid en tjänst får vara nere efter ett avbrott innan den måste vara återställd. Begreppet hör till kontinuitetsplanering.",
  },
  {
    id: "sak-05",
    question: "What is the first step in an incident response plan?",
    options: [
      { text: "Detection and analysis" },
      { text: "Eradication" },
      { text: "Containment" },
      { text: "Recovery" },
    ],
    correct: 0,
    points: 5,
    penalty: 1,
    explanation:
      "Man måste upptäcka och förstå incidenten innan man kan begränsa den (containment), ta bort orsaken (eradication) och återställa (recovery). Förberedelser görs innan någon incident inträffar, men det alternativet finns inte här.",
  },
  {
    id: "sak-06",
    question: "Which of the following is NOT an example of a physical security control?",
    options: [
      { text: "Biometric access system" },
      { text: "Security camera" },
      { text: "Encryption" },
      { text: "Alarm system" },
    ],
    correct: 2,
    points: 5,
    penalty: 1,
    explanation:
      "Kryptering är en teknisk (logisk) kontroll. De andra tre skyddar lokaler och utrustning fysiskt. Ett biometriskt passersystem räknas som fysiskt eftersom det styr tillträde till en lokal.",
  },
  {
    id: "sak-07",
    question: "What is the purpose of a security policy in an organization?",
    options: [
      { text: "To train employees on security practices" },
      { text: "To outline the goals and responsibilities for securing information and systems" },
      { text: "To outline the security of network infrastructure for employees to understand" },
      { text: "To prevent external attacks" },
    ],
    correct: 1,
    points: 5,
    penalty: 1,
    explanation:
      "Policyn anger vad som ska skyddas, vilka målen är och vem som ansvarar. Utbildning och tekniska skydd är åtgärder som följer av policyn. Nätverk och externa attacker är för smalt.",
  },
  {
    id: "sak-08",
    question: "In a network attack, what is a \"man-in-the-middle\" attack?",
    options: [
      { text: "A brute-force attack on a password" },
      { text: "A type of attack where an unauthorized party intercepts communication between two legitimate parties" },
      { text: "A phishing attack" },
      { text: "A denial-of-service attack" },
    ],
    correct: 1,
    points: 8,
    penalty: 4,
    explanation:
      "Angriparen placerar sig mellan två parter som tror att de pratar direkt med varandra och kan läsa eller ändra det som skickas. Attacken hotar både confidentiality och integrity.",
  },
  {
    id: "sak-09",
    question: "Which of the following best describes a zero-day exploit?",
    options: [
      { text: "A vulnerability known to attackers but unknown to the vendor" },
      { text: "A vulnerability exploited after a patch has been released" },
      { text: "An exploit used to attack a system with outdated software" },
      { text: "A backup mechanism to restore system availability" },
    ],
    correct: 0,
    points: 5,
    penalty: 2,
    explanation:
      "\"Zero-day\" betyder att leverantören har haft noll dagar på sig att åtgärda sårbarheten. En sårbarhet som utnyttjas efter att en patch har släppts, eller i ett system med föråldrad mjukvara, är redan känd.",
  },
  {
    id: "sak-10",
    question: "What does a firewall primarily protect against?",
    options: [
      { text: "Weak password policies" },
      { text: "Insider threats" },
      { text: "Malicious software installed on the system" },
      { text: "Unauthorized access to a private network" },
    ],
    correct: 3,
    points: 4,
    penalty: 1,
    explanation:
      "Brandväggen filtrerar trafik vid gränsen till nätverket. Den skyddar inte mot insiders som redan är innanför, mot skadlig kod som redan är installerad eller mot svaga lösenord.",
  },
  {
    id: "sak-11",
    question: "A virus that attaches itself to a legitimate program and can spread when the program is executed is called a:",
    options: [
      { text: "File infector virus" },
      { text: "Polymorphic virus" },
      { text: "Boot sector virus" },
      { text: "Macro virus" },
    ],
    correct: 0,
    points: 4,
    penalty: 2,
    explanation:
      "Klassificeringen utgår från vad viruset infekterar. Ett file infector virus infekterar körbara filer, ett boot sector virus infekterar boot-sektorn och ett macro virus infekterar makron i dokument. Polymorphic beskriver hur viruset gömmer sig, genom att ändra sin kod vid varje infektion, inte var det sitter.",
  },
  {
    id: "sak-12",
    question: "What is the primary goal of a penetration test?",
    options: [
      { text: "To permanently fix vulnerabilities in a system" },
      { text: "To identify exploitable vulnerabilities in a system" },
      { text: "To verify user authentication mechanisms" },
      { text: "To measure system performance under stress" },
    ],
    correct: 1,
    points: 4,
    penalty: 2,
    explanation:
      "Ett penetrationstest simulerar en attack för att hitta sårbarheter som faktiskt går att utnyttja. Att åtgärda dem är ett separat steg. Att mäta prestanda under belastning är ett lasttest.",
  },
  {
    id: "sak-13",
    question: "Role-Based Access Control (RBAC) is primarily based on:",
    options: [
      { text: "The classification levels of data" },
      { text: "The identity of users" },
      { text: "The roles that users have within an organization" },
      { text: "The time of day the access request is made" },
    ],
    correct: 2,
    points: 7,
    penalty: 4,
    explanation:
      "I RBAC kopplas rättigheter till roller och användare tilldelas roller. Klassificeringsnivåer hör till MAC, användarens identitet till DAC, och villkor som tid på dygnet till attributbaserad kontroll.",
  },
  {
    id: "sak-14",
    question: "In discretionary access control (DAC), who determines the access permissions?",
    options: [
      { text: "The resource owner" },
      { text: "The security officer" },
      { text: "The system administrator" },
      { text: "The operating system" },
    ],
    correct: 0,
    points: 3,
    penalty: 1,
    explanation:
      "\"Discretionary\" betyder att ägaren av resursen bestämmer efter eget gottfinnande vem som får åtkomst. I MAC är det systemet som bestämmer utifrån klassificering, inte ägaren.",
  },
  {
    id: "sak-15",
    question: "What is the primary goal of an Intrusion Detection System (IDS)?",
    options: [
      { text: "Detect and alert on suspicious activities" },
      { text: "Ensure that users can access any resource they need" },
      { text: "Prevent system downtime" },
      { text: "Analyze network traffic for performance issues" },
    ],
    correct: 0,
    points: 7,
    penalty: 4,
    explanation:
      "En IDS upptäcker och larmar men stoppar inte själv trafik. System som också blockerar kallas intrusion prevention system (IPS), kapitel 9 i Stallings.",
  },
  {
    id: "sak-16",
    question: "What does the term \"public key\" refer to in public key cryptography?",
    options: [
      { text: "A key that is known by everyone and used to encrypt messages" },
      { text: "A key that is used for both encryption and decryption" },
      { text: "A key that is shared between two parties in a secure communication" },
      { text: "A key that only the recipient knows and uses to decrypt messages" },
    ],
    correct: 0,
    points: 6,
    penalty: 2,
    note: "Frågetexten på tentan säger 5 poäng, men tentan räknar frågan som 6 (Totalpoäng: 6). Bara så blir summan 100.",
    explanation:
      "Den publika nyckeln får spridas fritt och används för att kryptera till mottagaren. Den nyckel som bara mottagaren känner och dekrypterar med är den privata nyckeln. En nyckel som delas mellan två parter och används åt båda hållen är en symmetrisk nyckel.",
  },
  {
    id: "sak-17",
    question: "In symmetric encryption, the encryption key is:",
    options: [
      { text: "Always publicly available" },
      { text: "Used for digital signatures" },
      { text: "Kept private by the sender only" },
      { text: "Shared between the sender and receiver" },
    ],
    correct: 3,
    points: 3,
    penalty: 4,
    explanation:
      "Symmetrisk kryptering använder samma nyckel för kryptering och dekryptering, så både sändare och mottagare måste ha den, och den måste hållas hemlig för alla andra. Digitala signaturer bygger på asymmetrisk kryptering.",
  },
  {
    id: "sak-18",
    question: "Which type of attack aims to make a service unavailable to its users?",
    options: [
      { text: "Phishing" },
      { text: "Man-in-the-Middle" },
      { text: "Spoofing" },
      { text: "Denial of Service (DoS)" },
    ],
    correct: 3,
    points: 4,
    penalty: 4,
    explanation:
      "DoS angriper availability. Phishing lurar användare att lämna ut uppgifter, man-in-the-middle avlyssnar trafik och spoofing förfalskar avsändare.",
  },
  {
    id: "sak-19",
    question: "In the context of information security, integrity refers to:",
    options: [
      { text: "Ensuring that data is protected from unauthorised modification and remains accurate and complete." },
      { text: "Protecting information from unauthorized access" },
      { text: "Ensuring compliance with legal standards" },
      { text: "Ensuring that data is available when needed" },
    ],
    correct: 0,
    points: 6,
    penalty: 6,
    explanation:
      "Integrity handlar om att data inte ändras obehörigt. \"Unauthorized access\" beskriver confidentiality och \"available when needed\" beskriver availability, alltså de två andra delarna av CIA.",
  },
  {
    id: "sak-20",
    question: "Which of the following is a KEY goal of computer security that also addresses privacy?",
    options: [
      { text: "Availability" },
      { text: "Usability" },
      { text: "Confidentiality" },
      { text: "Integrity" },
    ],
    correct: 2,
    points: 4,
    penalty: 4,
    explanation:
      "I Stallings omfattar confidentiality både data confidentiality och privacy, alltså att individer styr vilken information om dem som samlas in och lämnas ut. Usability är inget säkerhetsmål.",
  },
  {
    id: "sak-21",
    question: "What software is most commonly used by organizations to manage users, groups, and privileges in internal networks?",
    options: [
      { text: "Microsoft System Center" },
      { text: "Microsoft Active Directory" },
      { text: "OpenLDAP" },
      { text: "Cisco Identity Services Engine" },
    ],
    correct: 1,
    points: 5,
    penalty: 3,
    explanation:
      "Active Directory är Microsofts katalogtjänst för användare, grupper och behörigheter i Windows-nätverk och den vanligaste i organisationer. System Center används för att hantera datorer och servrar. OpenLDAP är en katalogtjänst med öppen källkod men mindre spridd. Cisco ISE styr åtkomst till nätverket.",
  },
  {
    id: "sak-22",
    question: "Which of the following is not a common web application vulnerability?",
    options: [
      { text: "Cross-Site Scripting" },
      { text: "Broken Access Control" },
      { text: "SQL Injection" },
      { text: "Buffer Overflow" },
    ],
    correct: 3,
    points: 6,
    penalty: 6,
    explanation:
      "XSS, broken access control och SQL injection är typiska webbsårbarheter. Buffer overflow är ett minnesfel i program skrivna i språk som C och har ett eget kapitel (kapitel 10) i Stallings.",
  },
  {
    id: "sak-23",
    question: "What does the bling SQL injection technique do?",
    options: [
      { text: "It allows the attacker to encrypt all database queries." },
      { text: "It allows for enabling automatic backups without the users knowledge." },
      { text: "It allows attackers to infer the data present in a database system even when the system is sufficiently secure to not display any erroneous information back to the attacker" },
      { text: "It allows attackers to infer the data present in a database system even when the system is sufficiently secure to not display any erroneous information back to the attacker." },
    ],
    correct: [2, 3],
    points: 5,
    penalty: 0,
    note: "Tentan har två fel: \"bling\" ska vara \"blind\", och två av alternativen (3 och 4 på tentan) är identiska bortsett från en punkt. Båda räknas som rätt här.",
    explanation:
      "Blind SQL injection är en inferensattack. Angriparen ställer ja/nej-frågor via indata och drar slutsatser av hur sidan beter sig, även när inga felmeddelanden visas.",
  },
  {
    id: "sak-24",
    question: "Which of the alternatives is a Cloud Security Alliance [CSA13] listed as one of the top cloud-specific security threats:",
    options: [
      { text: "Captcha and PIN" },
      { text: "Password and security question" },
      { text: "Insider profiles" },
      { text: "Insecure Interfaces and APIs" },
    ],
    correct: 3,
    points: 5,
    penalty: 0,
    explanation:
      "Insecure interfaces and APIs finns på CSA:s lista över de största hoten mot molntjänster. Kunder sköter och använder molntjänsten via dessa gränssnitt, så svagheter där exponerar allt. Två av alternativen är kopierade från MFA-frågan, och \"Insider profiles\" finns inte på listan.",
  },
  {
    id: "sak-25",
    question: "What is IT Security Management?",
    options: [
      { text: "The formal process used to develop a coherent secure system that is always active in preventing capacity towards malicious attempts." },
      { text: "The formal process of engaging external services and tools to make sure that any IS systems can be protected at all times without attempting to compromise the quality of the services and tools towards secure practices." },
      { text: "The formal process of containment, recovery, and eradication of malicious attempts in any digital system." },
      { text: "The formal process used to develop and maintain appropriate levels of computer security for an organization’s assets, by preserving their confidentiality, integrity, availability, accountability, authenticity, and reliability." },
    ],
    correct: 3,
    points: 5,
    penalty: 1,
    explanation:
      "Det rätta svaret är Stallings definition i kapitel 14. Kännetecknen är \"appropriate levels\" (säkerhet anpassad efter risk, inte maximal) och de sex egenskaperna CIA, accountability, authenticity och reliability. Alternativ 3 beskriver incidenthantering.",
  },
  {
    id: "sak-26",
    question: "What does the virtual firewall do?",
    options: [
      { text: "Identifies the source of a security breach, by offering a greater level of flexibility and scalability than many traditional structures can support." },
      { text: "Acts as a boundary system that separates different security domains within and between organisations by ensuring that business operations can continue during and after disaster." },
      { text: "Provides firewall capabilities for the network traffic flowing between systems hosted in a virtualized or cloud environment that does not require this traffic to be routed out to a physically separate network supporting traditional firewall services" },
    ],
    correct: 2,
    points: 5,
    penalty: 0,
    explanation:
      "En virtuell brandvägg filtrerar trafiken mellan virtuella maskiner på samma fysiska värd eller i molnet, utan att trafiken måste ut till en separat fysisk brandvägg. De två felaktiga alternativen är ihopklippta av distraktorer från frågan om brandväggens syfte.",
  },
];

// Ett eller flera rätta alternativ (index i `options`) — sak-23 har två.
export const correctIndexes = (question) =>
  Array.isArray(question.correct) ? question.correct : [question.correct];
