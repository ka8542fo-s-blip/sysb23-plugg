// Ämnen för Säkerhet i informationssystem: ett per kapitel.
//
// Ansvarsfördelning som i de andra delkurserna: HÄR ägs de korta punkterna
// (keyPoints, pitfalls), reading.js äger löptexten och ordlistan.
// Kärnpunkternas form: ett begrepp per punkt, "Begrepp: förklaring".
// Fallgroparna är de förväxlingar distraktorerna i Öva bygger på.

export const topics = [
  {
    id: "digitalt",
    name: "Informationssäkerhet i det digitala samhället",
    chapter: "fo1",
    examWeight: "hög",
    summary: "Samhället har blivit digitalt på djupet (Castells), tekniken accelererar och utmaningarna växer: informationsöverflöd, övervakningskapitalism, cyberattacker och AI-agenter. Insatserna är enorma, och därför behövs informationssäkerhet, som delas in i CIA-triaden.",
    keyPoints: [
      "Castells tre förändringar: the networked society, informational capitalism och the Internet som ny kultur.",
      "De växande utmaningarna: information overload (Dean & Webb), surveillance capitalism (Zuboff), cyber attacks (Siponen) och autonoma AI-agenter.",
      "Dyraste bransch per dataintrång: Healthcare, i snitt 6,64 miljoner dollar.",
      "Cyberbrottens kostnad: 10,5 biljoner dollar 2025, 15,63 biljoner 2029.",
      "Internetanvändare: 6,15 miljarder, 73,9 % av befolkningen.",
      "CIA-triaden (Wylder 2004): confidentiality, integrity och availability.",
      "Composition VIII: utmaningarna hänger ihop och måste hanteras som en helhet.",
    ],
    pitfalls: [
      "Trillion är biljon: 10,5 trillion dollar är 10,5 biljoner, inte miljarder.",
      "Världsekonomin anges i euro, cyberbrotten i dollar.",
      "Bara Healthcare har en siffra på bilden; de andra branscherna är distraktorer.",
      "Övervakningskapitalism är Zuboff, informationsöverflöd är Dean & Webb, cyberattacker är Siponen.",
    ],
  },
  {
    id: "risk-privacy",
    name: "Risk, tillit, privacy och zero trust",
    chapter: "fo2",
    examWeight: "hög",
    summary: "Säkerhet är riskhantering i fyra steg. Online fungerar inte våra sinnen för privatliv, och det privata blir offentligt. Organisationer behöver därför en planeringsmodell, en säkerhetspolicy, standarder, en konsekvensskala och skydd i lager, från data center-modellen till zero trust.",
    keyPoints: [
      "Riskbedömningens fyra steg: asset identification, threat modeling, vulnerability evaluation, mitigation strategy.",
      "Schneier: security is a feeling vs. security is a reality; attack och försvar driver varandra (evolutionary trust).",
      "Introna (1997), privacy: ingen åtkomst till personen, kontroll över personlig information, frihet från andras granskning.",
      "Acquisti m.fl. (2022): offline skyddar sinnena privatlivet, online hjälper de inte.",
      "ATS: automatisk riskpoäng för resenärer, konfidentiell och nästan omöjlig att ifrågasätta.",
      "The Hack Apocalyps: cyberbrott vore världens tredje största ekonomi, efter USA och Kina.",
      "Säkerhetspolicyns tre delar: access management (MFA, RBAC), data encryption, incident response.",
      "Countermeasure matrix (Straub & Welke): deterrence, prevention, detection, remedies.",
      "Konsekvensskalan: 1 Insignificant, 2 Minor, 3 Moderate, 4 Major, 5 Catastrophic, 6 Doomsday.",
      "Data center-modellen: data, network, physical och site security.",
      "Zero trust, utifrån och in: perimeter, network, endpoint, application, data, critical assets.",
    ],
    pitfalls: [
      "Kryptering är en kontroll i datalagret, inte en fysisk kontroll.",
      "Mantrap-entréer och stängsel är site security; biometriska läsare och serverburar är physical security.",
      "NIS2 är EU-lagstiftning; ISO 27005 och ISO 31000 är standarder för riskhantering.",
      "Detection and Analysis kommer först i incidenthanteringen, före containment, eradication och recovery.",
      "Virus i Excel-filer är macro virus i boken, även om bilden kallar dem file infector.",
    ],
  },
  {
    id: "offensiv",
    name: "Offensiv säkerhet",
    chapter: "alm",
    examWeight: "hög",
    summary: "Säkerhetsarbete följer NIST:s sex funktioner, och en angripares tänkande förbättrar försvaret i var och en. Attacker följer åtta steg. Pentester täcker webbapplikationer, interna nät byggda kring Active Directory och molnet, och sker alltid med tillstånd.",
    keyPoints: [
      "NIST:s sex funktioner: Govern (i mitten), Identify, Protect, Detect, Respond, Recover.",
      "Offensiva aktiviteter: threat modeling (Identify), pentesting (Protect), purple team (Detect), tabletop (Recover), red team (alla).",
      "Pentestets mål: hitta svagheter som faktiskt går att utnyttja innan angriparna gör det.",
      "En attacks åtta steg: external reconnaissance, resource development, initial access, persistence, internal reconnaissance, privilege escalation, lateral movement, actions on objectives.",
      "Broken access control: kontrollera behörigheten på servern för varje anrop.",
      "SQL injection: prepared statements och en allowlist för indata.",
      "XSS: validera indata och encode output.",
      "Active Directory: hanterar användare, enheter, grupper och behörigheter med central autentisering.",
      "Molnet: cloud security is identity security.",
    ],
    pitfalls: [
      "Ett pentest hittar sårbarheter som går att utnyttja; det åtgärdar dem inte och mäter inte prestanda.",
      "Purple team hör till Detect, tabletop till Recover, threat modeling till Identify.",
      "Buffer overflow är ett minnesfel i program, inte en av de vanliga webbsårbarheterna.",
      "Persistence är att behålla åtkomsten; privilege escalation är att få mer.",
    ],
  },
];
