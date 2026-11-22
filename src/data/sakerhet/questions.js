// Kapitelfrågorna för Säkerhet i informationssystem (Öva → Alla frågor).
//
// Stilen är tentans: korta flervalsfrågor på engelska med fyra alternativ
// och en tydlig rätt (jfr examBank.js). Förklaringarna per alternativ är på
// svenska. Designreglerna är de andra delkursernas (strategi/questions.js):
// jämnlånga alternativ, distraktorer ur verkliga förväxlingar, rätt
// position fördelad. Balanstestet (fragebank-balans.test.mjs) mäter dem.
//
// Föreläsningsfrågorna prövar det som går att fråga om på bilderna:
// siffror, modeller och deras steg, vem som sagt vad, vad ett begrepp
// betyder.
//
// Varianter av förra årets tentafrågor ("små variationer" på årets tenta):
// `variantOf: "sak-XX"` pekar på frågan i examBank.js. Varianten prövar
// samma begrepp med ny formulering och nya distraktorer, och ligger i det
// kapitel som förklarar begreppet. Tentafrågorna själva ligger kvar
// ordagranna i examBank (Öva → Tentafrågor). Provtentan drar sina
// "gamla" frågor ur varianterna.
//
// Alla frågor är ogranskade av Kasper (reviewed: false).

const VERBATIM = "Lärarens exempelfråga till tentan, ordagrant med lärarens fyra alternativ; kan inte längdbalanseras.";
const SCALE = "Alternativen är konsekvensskalans steg som på bilden och kan inte längdbalanseras.";

export const LENGTH_FLAGGED = [
  { id: "sak-fo1-01", reason: VERBATIM },
  { id: "sak-fo2-08", reason: SCALE },
];

const variant = (id, what) => ({ variantOf: id, source: `Variant av en tentafråga från förra året (${what})` });

export const questions = [
  // ── Föreläsning 1: informationssäkerhet i det digitala samhället ─────────
  { id: "sak-fo1-01", topic: "digitalt", difficulty: 1,
    question: "Which is the Highest Industry Cost per Data Breach?",
    options: [
      { text: "Healthcare", explain: "I snitt 6,64 miljoner dollar per intrång enligt föreläsningens bild (IBM 2026)." },
      { text: "Technology", explain: "Bilden ger ingen siffra för tekniksektorn. Sjukvården är dyrast." },
      { text: "Finance", explain: "Finanssektorn har ingen siffra på bilden. Sjukvården är dyrast." },
      { text: "Transportation", explain: "Transport har ingen siffra på bilden. Sjukvården är dyrast." }
    ],
    correct: 0, source: "Föreläsning 1 (lärarens exempelfråga till tentan)", reviewed: false },

  { id: "sak-fo1-02", topic: "digitalt", difficulty: 2,
    question: "According to the lecture, what is the average cost of a data breach in healthcare?",
    options: [
      { text: "About $664,000 per breach", explain: "En tiondel av rätt belopp. Bilden säger 6,64 miljoner dollar." },
      { text: "About $6.64 million per breach", explain: "Sjukvården är dyrast, i snitt 6,64 miljoner dollar per intrång." },
      { text: "About $66.4 million per breach", explain: "Tio gånger för mycket. Bilden säger 6,64 miljoner dollar." },
      { text: "About $10.5 million per breach", explain: "10,5 är cyberbrottens totala kostnad 2025, i biljoner dollar, inte kostnaden per intrång." }
    ],
    correct: 1, source: "Föreläsning 1 (What is at Stake?)", reviewed: false },

  { id: "sak-fo1-03", topic: "digitalt", difficulty: 2,
    question: "According to the lecture, what was cybercrime expected to cost the global economy in 2025?",
    options: [
      { text: "$1.05 trillion", explain: "En tiondel av rätt belopp." },
      { text: "$15.63 trillion", explain: "Det är prognosen för 2029, inte 2025." },
      { text: "$10.5 trillion", explain: "10,5 biljoner dollar 2025, enligt bilden." },
      { text: "$108 trillion", explain: "Cirka 108 biljoner är hela världsekonomin per år, och i euro." }
    ],
    correct: 2, source: "Föreläsning 1 (What is at Stake?)", reviewed: false },

  { id: "sak-fo1-04", topic: "digitalt", difficulty: 2,
    question: "According to Castells, which of these is NOT one of the three big changes of the last three decades?",
    options: [
      { text: "The networked society", explain: "En av de tre: den nya sociala strukturen." },
      { text: "Informational capitalism", explain: "En av de tre: den nya ekonomin." },
      { text: "The Internet as a new culture", explain: "En av de tre: den nya kulturen." },
      { text: "The surveillance state", explain: "Övervakningen hör till de växande utmaningarna (Zuboff), inte till Castells tre förändringar." }
    ],
    correct: 3, source: "Föreläsning 1 (Castells 1996, 2009)", reviewed: false },

  { id: "sak-fo1-05", topic: "digitalt", difficulty: 1,
    question: "Which three aspects make up the CIA triad (Wylder, 2004)?",
    options: [
      { text: "Confidentiality, integrity and authenticity", explain: "Authenticity är en egen egenskap i boken, inte ett av CIA:s tre ben." },
      { text: "Confidentiality, integrity and availability", explain: "CIA står för confidentiality, integrity och availability." },
      { text: "Control, integrity and availability", explain: "C:et står för confidentiality, inte control." },
      { text: "Confidentiality, identity and accountability", explain: "Identity och accountability ingår inte i triaden." }
    ],
    correct: 1, source: "Föreläsning 1 (Wylder 2004)", reviewed: false },

  { id: "sak-fo1-06", topic: "digitalt", difficulty: 1,
    question: "Which author does the lecture connect to surveillance capitalism (\"Google is watching you\")?",
    options: [
      { text: "Castells (2009)", explain: "Castells står för de tre förändringarna: nätverkssamhället, informationskapitalismen och internet." },
      { text: "Siponen (2013)", explain: "Siponen står för cyberattackerna." },
      { text: "Dean & Webb (2011)", explain: "Dean & Webb står för informationsöverflödet." },
      { text: "Zuboff (2020)", explain: "Zuboff står för övervakningskapitalismen, också i föreläsning 2." }
    ],
    correct: 3, source: "Föreläsning 1 (de växande utmaningarna)", reviewed: false },

  { id: "sak-fo1-07", topic: "digitalt", difficulty: 1,
    question: "Which rising challenge does the lecture connect to Dean & Webb (2011)?",
    options: [
      { text: "Information overload", explain: "Dean & Webb står för informationsöverflödet." },
      { text: "Large-scale cyber attacks", explain: "Cyberattackerna är Siponen (2013)." },
      { text: "Surveillance capitalism", explain: "Övervakningskapitalismen är Zuboff (2020)." },
      { text: "Autonomous AI agents", explain: "AI-agenterna är Hugging Face-incidenten (METR och Redwood Research 2026)." }
    ],
    correct: 0, source: "Föreläsning 1 (de växande utmaningarna)", reviewed: false },

  { id: "sak-fo1-08", topic: "digitalt", difficulty: 2,
    question: "About how many people used the internet in October 2026, according to the lecture?",
    options: [
      { text: "5.81 billion (69.9 %)", explain: "Det är antalet identiteter i sociala medier." },
      { text: "3.26 billion (39.7 %)", explain: "3,26 miljarder var antalet 2016, och 39,7 % andelen 2015." },
      { text: "6.15 billion (73.9 %)", explain: "6,15 miljarder internetanvändare, 73,9 % av befolkningen." },
      { text: "8.32 billion (100 %)", explain: "8,32 miljarder är hela världens befolkning." }
    ],
    correct: 2, source: "Föreläsning 1 (DataReportal oktober 2026)", reviewed: false },

  { id: "sak-fo1-09", topic: "digitalt", difficulty: 2,
    question: "What does Kandinsky's Composition VIII stand for in the lecture?",
    options: [
      { text: "Attacks always spread faster than the defences that are built against them", explain: "Föreläsningen säger inte det. Målningen står för att utmaningarna hänger ihop." },
      { text: "Security challenges are intertwined and must be handled as one", explain: "\"Tackle the Challenges\" — teknik, samhälle, ekonomi och etik på samma gång." },
      { text: "Privacy and security are opposites that must be traded off", explain: "Föreläsning 2 säger tvärtom att privacy ofta är ett av säkerhetens mål." },
      { text: "Technology develops in clear, separate steps over time", explain: "Teknikens fart är Kushners graf, inte Kandinskys målning." }
    ],
    correct: 1, source: "Föreläsning 1 (avslutningen)", reviewed: false },

  // ── Föreläsning 2: risk, tillit, privacy och zero trust ──────────────────
  { id: "sak-fo2-v04", topic: "risk-privacy", difficulty: 2, ...variant("sak-04", "RTO"),
    question: "The lecture says post-attack disruption complicates the Recovery Time Objective (RTO). What does an RTO set?",
    options: [
      { text: "How quickly an incident must be detected and fully analysed", explain: "Det är Detection and Analysis, det första steget i incidenthanteringen." },
      { text: "How often backups of critical data must be taken", explain: "RTO handlar om hur länge en tjänst får vara nere, inte om hur ofta man tar backup." },
      { text: "How long an attacker may stay hidden in the network", explain: "RTO gäller återställningen efter ett avbrott, inte angriparen." },
      { text: "How long a service may be down before it must be restored", explain: "RTO är den längsta tid en tjänst får vara nere innan den måste vara återställd." }
    ],
    correct: 3, reviewed: false },

  { id: "sak-fo2-v05", topic: "risk-privacy", difficulty: 2, ...variant("sak-05", "incidenthantering"),
    question: "An incident has just been detected and analysed. Which step of the incident response plan comes next?",
    options: [
      { text: "Recovery of the systems", explain: "Återställningen kommer sist, efter containment och eradication." },
      { text: "Containment of the incident", explain: "Efter detection and analysis begränsar man incidenten, sedan tar man bort orsaken och återställer." },
      { text: "Eradication of the cause", explain: "Orsaken tas bort först när incidenten är begränsad." },
      { text: "A new round of risk analysis", explain: "Riskanalysen hör till planeringen, inte till stegen i en pågående incident." }
    ],
    correct: 1, reviewed: false },

  { id: "sak-fo2-v06", topic: "risk-privacy", difficulty: 1, ...variant("sak-06", "fysiska kontroller"),
    question: "Which of these is a physical security control in the lecture's data center security model?",
    options: [
      { text: "AES-256 encryption and HSMs", explain: "Kryptering och HSM ligger i datalagret (data security), inte det fysiska." },
      { text: "Micro-segmentation and TLS 1.3", explain: "Det är kontroller i nätverkslagret (network security)." },
      { text: "Server cages and CCTV", explain: "Serverburar och kameraövervakning begränsar den fysiska åtkomsten till hårdvaran." },
      { text: "Database Activity Monitoring", explain: "Övervakning av databasaktivitet hör till datalagret." }
    ],
    correct: 2, reviewed: false },

  { id: "sak-fo2-v07", topic: "risk-privacy", difficulty: 2, ...variant("sak-07", "säkerhetspolicy"),
    question: "What is an organizational security policy mainly for?",
    options: [
      { text: "Detecting intrusions while they happen in the network", explain: "Det gör en IDS. Policyn anger mål och ansvar." },
      { text: "Listing all the firewall rules that block attacks from outside", explain: "Brandväggsregler är en teknisk åtgärd som följer av policyn, inte policyns syfte." },
      { text: "Replacing security training for new employees", explain: "Utbildning är en åtgärd som följer av policyn; policyn ersätter den inte." },
      { text: "Stating what to protect, the goals and who is responsible", explain: "Policyn anger vad som ska skyddas, målen och vem som ansvarar." }
    ],
    correct: 3, reviewed: false },

  { id: "sak-fo2-v25", topic: "risk-privacy", difficulty: 3, ...variant("sak-25", "IT security management"),
    question: "IT security management aims to keep an organization's assets at which level of security?",
    options: [
      { text: "Appropriate levels, matched to the risks", explain: "Bokens definition säger \"appropriate levels\", alltså säkerhet anpassad efter risken." },
      { text: "The highest level that technology allows", explain: "Maximal säkerhet är inte målet; den kostar mer än risken motiverar." },
      { text: "The minimum level that the law requires", explain: "Lagkraven är en del av sammanhanget, men målet är en nivå anpassad efter risken." },
      { text: "Whatever level the IT department chooses", explain: "IT security management är en process för hela organisationen, inte IT-avdelningens eget val." }
    ],
    correct: 0, reviewed: false },

  { id: "sak-fo2-01", topic: "risk-privacy", difficulty: 2,
    question: "In which order do the four steps of the lecture's risk assessment process come?",
    options: [
      { text: "Threats, assets, mitigation, vulnerabilities", explain: "Man måste veta vilka tillgångar man har innan man kan modellera hoten mot dem." },
      { text: "Assets, threats, vulnerabilities, mitigation", explain: "Asset identification, threat modeling, vulnerability evaluation, mitigation strategy." },
      { text: "Vulnerabilities, threats, assets, mitigation", explain: "Tillgångarna kommer först, sårbarheterna i steg 3." },
      { text: "Assets, vulnerabilities, mitigation, threats", explain: "Hoten modelleras i steg 2, och åtgärderna kommer sist." }
    ],
    correct: 1, source: "Föreläsning 2 (RISK_ASSESSMENT_V2.0)", reviewed: false },

  { id: "sak-fo2-02", topic: "risk-privacy", difficulty: 2,
    question: "According to Introna (1997), which of these is one of the three meanings of privacy?",
    options: [
      { text: "Control over company information", explain: "Introna talar om personlig information, inte företagets." },
      { text: "Control over personal information", explain: "De tre betydelserna är ingen åtkomst till personen, kontroll över personlig information och frihet från andras granskning." },
      { text: "Freedom to share any data online", explain: "Privacy är frihet från andras granskning, inte frihet att dela allt." },
      { text: "Access to other people's records", explain: "Det är motsatsen: den första betydelsen är att andra inte har åtkomst till personen." }
    ],
    correct: 1, source: "Föreläsning 2 (Introna 1997)", reviewed: false },

  { id: "sak-fo2-03", topic: "risk-privacy", difficulty: 2,
    question: "What does Schneier's \"evolutionary trust\" figure in the lecture show?",
    options: [
      { text: "Trust grows steadily as security tools get better", explain: "Figuren visar ett kretslopp, ingen jämn tillväxt." },
      { text: "People always feel less safe than they really are", explain: "Rubriken ställer känsla mot verklighet, men figuren handlar om attack och försvar." },
      { text: "Security becomes real once users feel safe enough", explain: "Poängen är att känslan och verkligheten inte behöver följas åt." },
      { text: "Attackers and defenders keep driving each other on", explain: "Rovdjuren utvecklar bättre attacker, bytet bättre försvar, och så vidare." }
    ],
    correct: 3, source: "Föreläsning 2 (Schneier 2012)", reviewed: false },

  { id: "sak-fo2-04", topic: "risk-privacy", difficulty: 2,
    question: "Which layer of the lecture's data center security model includes mantrap entries and bollards?",
    options: [
      { text: "Site security", explain: "Site security förstärker anläggningens yttre gräns och entréer — stängsel, vakter, pollare och mantrap-entréer." },
      { text: "Physical security", explain: "Physical security gäller hårdvaran inne i anläggningen: biometriska läsare, serverburar och CCTV." },
      { text: "Network security", explain: "Nätverkslagret har NGFW, mikrosegmentering och IDS/IPS." },
      { text: "Data security", explain: "Datalagret har kryptering, RBAC och HSM." }
    ],
    correct: 0, source: "Föreläsning 2 (Data Center Security Model)", reviewed: false },

  { id: "sak-fo2-05", topic: "risk-privacy", difficulty: 1,
    question: "In the lecture's zero trust \"circle of trust\", what lies at the very centre?",
    options: [
      { text: "Data security", explain: "Data security är lagret närmast mitten, men inte mitten själv." },
      { text: "Perimeter security", explain: "Perimetern är det yttersta lagret." },
      { text: "Endpoint security", explain: "Endpoint security ligger i mitten av lagren, mellan network och application." },
      { text: "Critical assets", explain: "Lagren går utifrån och in, perimeter, network, endpoint, application, data, och i mitten de kritiska tillgångarna." }
    ],
    correct: 3, source: "Föreläsning 2 (Zero Trust Methodology)", reviewed: false },

  { id: "sak-fo2-06", topic: "risk-privacy", difficulty: 2,
    question: "According to the lecture, what is NIS2?",
    options: [
      { text: "Guidance on information security risk management", explain: "Det är ISO/IEC 27005." },
      { text: "EU-wide legislation on cybersecurity", explain: "NIS2 är EU-gemensam lagstiftning om cybersäkerhet." },
      { text: "Guidelines on managing risks faced by organizations", explain: "Det är ISO 31000." },
      { text: "A cybersecurity framework for critical infrastructure", explain: "Det är NIST:s Cybersecurity Framework." }
    ],
    correct: 1, source: "Föreläsning 2 (Security Standards & Frameworks)", reviewed: false },

  { id: "sak-fo2-07", topic: "risk-privacy", difficulty: 1,
    question: "If cybercrime were measured as a country, what would it be according to the lecture?",
    options: [
      { text: "The world's largest economy, well ahead of the U.S. and China", explain: "Bilden säger tredje störst, efter USA och Kina." },
      { text: "The world's tenth largest economy, just after Japan", explain: "Bilden säger tredje störst." },
      { text: "The world's third largest economy, after the U.S. and China", explain: "Med 10,5 biljoner dollar 2025 vore cyberbrott världens tredje största ekonomi." },
      { text: "Larger than the whole world economy put together", explain: "Världsekonomin är cirka 108 biljoner euro, cyberbrotten 10,5 biljoner dollar." }
    ],
    correct: 2, source: "Föreläsning 2 (The Hack Apocalyps)", reviewed: false },

  { id: "sak-fo2-08", topic: "risk-privacy", difficulty: 2,
    question: "On the lecture's risk consequence scale, which rating means \"multiple and continuous security breaches\" with undetermined duration?",
    options: [
      { text: "4 – Major", explain: "Major är pågående systematiska intrång, upp till två månader." },
      { text: "5 – Catastrophic", explain: "Catastrophic kan leda till politisk debatt och brottsutredning, tre månader eller mer." },
      { text: "6 – Doomsday", explain: "Skalans högsta nivå, med brottsutredning som berör högsta ledningen." },
      { text: "3 – Moderate", explain: "Moderate är begränsade systematiska intrång, upp till två veckor." }
    ],
    correct: 2, source: "Föreläsning 2 (The Risk Consequence Likelihood)", reviewed: false },

  { id: "sak-fo2-09", topic: "risk-privacy", difficulty: 3,
    question: "In Straub & Welke's model, which four categories make up the countermeasure matrix?",
    options: [
      { text: "Deterrence, prevention, detection and remedies", explain: "Matrisens rader är deterrence, prevention, detection och remedies." },
      { text: "Prevention, detection, response and recovery", explain: "Liknar incidenthanteringens steg, men matrisen börjar med deterrence och slutar med remedies." },
      { text: "Identify, protect, detect, respond and recover", explain: "Det är NIST-funktionerna från gästföreläsningen, utan Govern." },
      { text: "Avoidance, transfer, reduction and acceptance", explain: "Det är sätt att hantera en risk, inte matrisens kategorier." }
    ],
    correct: 0, source: "Föreläsning 2 (Straub & Welke)", reviewed: false },

  { id: "sak-fo2-10", topic: "risk-privacy", difficulty: 2,
    question: "What can travellers find out about the risk score the Automated Targeting System (ATS) gives them?",
    options: [
      { text: "The score, but not how it was calculated", explain: "Inte ens poängen lämnas ut; den är konfidentiell." },
      { text: "Everything, since the system is built to be fully open", explain: "Tvärtom: systemet är byggt för minimal transparens." },
      { text: "The score, after filing a formal request", explain: "Myndigheterna delar inte poängen med resenärerna." },
      { text: "Nothing: it is confidential and hard to challenge", explain: "Man får varken veta bedömningen eller poängen, och det är nästan omöjligt att ifrågasätta." }
    ],
    correct: 3, source: "Föreläsning 2 (ATS)", reviewed: false },

  // ── Gästföreläsningen: offensiv säkerhet ─────────────────────────────────
  { id: "sak-alm-v12", topic: "offensiv", difficulty: 1, ...variant("sak-12", "penetrationstest"),
    question: "A company lets hired testers break into its systems before real attackers do. What is the main goal?",
    options: [
      { text: "To measure how the systems perform under heavy load", explain: "Det är ett lasttest, inte ett pentest." },
      { text: "To find weaknesses that can actually be exploited", explain: "\"find exploitable weaknesses before attackers do\"." },
      { text: "To fix every vulnerability permanently in one go", explain: "Testet hittar svagheterna; att åtgärda dem är ett separat steg." },
      { text: "To certify that the company follows ISO 27005", explain: "ISO 27005 är vägledning för riskhantering; ett pentest certifierar inget." }
    ],
    correct: 1, reviewed: false },

  { id: "sak-alm-v21", topic: "offensiv", difficulty: 1, ...variant("sak-21", "Active Directory"),
    question: "In an internal network built around Active Directory, what does Active Directory manage?",
    options: [
      { text: "Traffic between the network and the internet", explain: "Trafiken vid nätverksgränsen filtreras av en brandvägg." },
      { text: "Encryption keys stored in hardware modules", explain: "Det gör hardware security modules (HSM)." },
      { text: "Input validation in the web applications", explain: "Indatakontroll sker i webbapplikationen, inte i katalogtjänsten." },
      { text: "Users, devices, groups and permissions", explain: "Active Directory hanterar användare, enheter, grupper och behörigheter med central autentisering." }
    ],
    correct: 3, reviewed: false },

  { id: "sak-alm-v22", topic: "offensiv", difficulty: 2, ...variant("sak-22", "webbsårbarheter"),
    question: "Which of these is a common web application vulnerability in the OWASP Top 10?",
    options: [
      { text: "Cross-site scripting (XSS)", explain: "XSS är en av de tre webbsårbarheter gästföreläsningen visade, med broken access control och SQL injection." },
      { text: "Boot sector infection", explain: "Ett boot sector virus infekterar datorns startsektor, inte en webbapplikation." },
      { text: "Buffer overflow in C programs", explain: "Buffer overflow är ett minnesfel i program, inte en av de vanliga webbsårbarheterna." },
      { text: "Macro virus in documents", explain: "Makrovirus sprids i dokument, inte via webbapplikationer." }
    ],
    correct: 0, reviewed: false },

  { id: "sak-alm-01", topic: "offensiv", difficulty: 1,
    question: "Which NIST function sits in the centre and sets the strategy, policies and responsibilities?",
    options: [
      { text: "Identify", explain: "Identify tar reda på vilka tillgångar som behöver skydd." },
      { text: "Protect", explain: "Protect inför och testar förebyggande kontroller." },
      { text: "Govern", explain: "Govern står i mitten och sätter strategi, policyer och ansvar för riskhanteringen." },
      { text: "Respond", explain: "Respond skapar och övar rutiner för att hantera hot." }
    ],
    correct: 2, source: "Gästföreläsningen (NIST:s sex funktioner)", reviewed: false },

  { id: "sak-alm-02", topic: "offensiv", difficulty: 2,
    question: "Which offensive activity did the guest lecture connect to the Detect function?",
    options: [
      { text: "Threat modeling", explain: "Threat modeling hör till Identify." },
      { text: "Purple team exercise", explain: "Någon efterliknar angriparen medan försvararna ser på och förbättrar sina larm." },
      { text: "Cyber crisis tabletop", explain: "Tabletop-övningen hör till Recover." },
      { text: "Penetration testing", explain: "Pentesting hör till Protect." }
    ],
    correct: 1, source: "Gästföreläsningen (offense informs defense)", reviewed: false },

  { id: "sak-alm-03", topic: "offensiv", difficulty: 2,
    question: "Which activity walks through a disruptive attack scenario to test business continuity and recovery decisions?",
    options: [
      { text: "Red team exercise", explain: "Red team är en fullskalig attack som prövar skydd, detektering och incidenthantering tillsammans." },
      { text: "Purple team exercise", explain: "Purple team förbättrar detekteringen och hör till Detect." },
      { text: "Threat modeling", explain: "Threat modeling kartlägger tillgångar, hotaktörer och attackvägar i Identify." },
      { text: "Cyber crisis tabletop", explain: "Tabletop-övningen hör till Recover och prövar kontinuitet och återställningsbeslut." }
    ],
    correct: 3, source: "Gästföreläsningen (offense informs defense)", reviewed: false },

  { id: "sak-alm-04", topic: "offensiv", difficulty: 2,
    question: "In the anatomy of a cyber attack, what is \"privilege escalation\"?",
    options: [
      { text: "Keeping access to the environment over time", explain: "Det är persistence, steg 4." },
      { text: "Moving through the environment toward the objective", explain: "Det är lateral movement, steg 7." },
      { text: "Gaining more access than the first foothold gave", explain: "Steg 6, att skaffa mer åtkomst." },
      { text: "Learning about the target before the attack", explain: "Det är external reconnaissance, steg 1." }
    ],
    correct: 2, source: "Gästföreläsningen (anatomy of a cyber attack)", reviewed: false },

  { id: "sak-alm-05", topic: "offensiv", difficulty: 2,
    question: "Besides prepared statements, which fix against SQL injection did the guest lecture recommend?",
    options: [
      { text: "Allowlist expected input", explain: "\"Use prepared statements / Allowlist expected input\"." },
      { text: "Encode output on the page", explain: "Det är åtgärden mot XSS." },
      { text: "Check permissions on every request", explain: "Det är åtgärden mot broken access control." },
      { text: "Encrypt all database queries", explain: "Kryptering ändrar inte hur frågan tolkas; det var en distraktor redan på förra årets tentor." }
    ],
    correct: 0, source: "Gästföreläsningen (SQL injection)", reviewed: false },

  { id: "sak-alm-06", topic: "offensiv", difficulty: 2,
    question: "What did the guest lecture mean by \"cloud security is identity security\"?",
    options: [
      { text: "The cloud provider is responsible for all of the security in the cloud", explain: "Leverantören skyddar plattformen, men konfigurationen och data är kundens ansvar." },
      { text: "The provider secures the platform; you secure access and data", explain: "Och användare, tjänstekonton och applikationer har behörigheter som angriparen är ute efter." },
      { text: "Cloud services need passwords but never any firewalls", explain: "Föreläsningen säger inget sådant; poängen är behörigheterna." },
      { text: "Every user must have one identity per cloud service", explain: "Påståendet handlar om ansvarsfördelning och behörigheter, inte antalet identiteter." }
    ],
    correct: 1, source: "Gästföreläsningen (cloud security)", reviewed: false },

  { id: "sak-alm-07", topic: "offensiv", difficulty: 1,
    question: "According to the guest lecture, what must always be in place before security testing?",
    options: [
      { text: "A completed ISO 27005 risk analysis", explain: "Föreläsningen kräver tillstånd, inte en viss riskanalys." },
      { text: "Both a red team and a purple team", explain: "Det är två sorters övningar, inga förutsättningar för att få testa." },
      { text: "Explicit permission and legal boundaries", explain: "\"always done with explicit permission and within legal boundaries\"." },
      { text: "An external auditor present on site", explain: "Föreläsningen kräver tillstånd, inte en revisor på plats." }
    ],
    correct: 2, source: "Gästföreläsningen (security testing)", reviewed: false },
];
