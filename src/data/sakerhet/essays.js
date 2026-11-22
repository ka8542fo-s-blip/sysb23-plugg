// Övningsessäer för Säkerhet i informationssystem. Årets tenta har enligt
// läraren 2 essäfrågor, men ämnena och längden är inte kända. De fem här är
// egna gissningar, en per bärande tankegång i föreläsningarna (Kaspers
// bedömning: essäerna bygger på föreläsningarna, inte på lärarens
// forskning). `context` säger det till den som pluggar.
//
// Formen är Strategis och BPM:s fyra steg (Vad det är / Varför det spelar
// roll / Konkret / Koppling) med 2–4 punkter per steg, på A-nivå:
// mekanismen med egna ord, ett konkret exempel och 2–4 kursbegrepp rätt
// använda. Steg 4 kopplar alltid till en annan del av delkursen.
// Manifestet sätter essayWordLimit: null (ordräknare utan tak) eftersom
// längden är okänd.

const CONTEXT = "Egen övningsessä – årets essäämnen är inte kända.";

export const essays = [
  { id: "sak-e1",
    question: "Hur har digitaliseringen förändrat vad som står på spel inom informationssäkerhet?",
    context: `${CONTEXT} Bygger på Föreläsning 1.`,
    checklist: [
      { heading: "Vad det är", points: [
        "Informationssäkerhet är att skydda informationens confidentiality, integrity och availability, CIA-triaden (Wylder 2004).",
        "Digitaliseringen enligt Castells: en ny social struktur (the networked society), en ny ekonomi (informational capitalism) och en ny kultur (Internet). Data är kärnan i både samhälle och ekonomi.",
      ] },
      { heading: "Varför det spelar roll", points: [
        "Nästan alla är uppkopplade: 6,15 miljarder internetanvändare, 73,9 % av jordens befolkning.",
        "Cyberbrotten kostar 10,5 biljoner dollar 2025 och väntas kosta 15,63 biljoner 2029. Dyrast per dataintrång är sjukvården, i snitt 6,64 miljoner dollar.",
        "Utmaningarna växer med tekniken: informationsöverflöd (Dean & Webb), övervakningskapitalism (Zuboff), cyberattacker (Siponen) och autonoma AI-agenter.",
      ] },
      { heading: "Konkret", points: [
        "Ett sjukhus vars journalsystem angrips: läcker uppgifterna drabbas confidentiality, ändras de integrity, och stängs systemen ner drabbas availability och därmed vården.",
        "Hugging Face-incidenten: en autonom AI-agent tog sig själv in i ett annat företags system, ett hot som inte fanns för några år sedan.",
      ] },
      { heading: "Koppling", points: [
        "Composition VIII: utmaningarna hänger ihop, och säkerhet måste hanteras som en helhet av teknik, samhälle, ekonomi och etik.",
        "Riskbedömningen i Föreläsning 2: när insatserna växer måste tillgångar, hot och sårbarheter kartläggas systematiskt innan man väljer åtgärder.",
      ] },
    ],
    outline: "1) Definiera informationssäkerhet med CIA. 2) Vad digitaliseringen ändrat: Castells tre förändringar och de växande utmaningarna. 3) Vad som står på spel, med två eller tre siffror. 4) Ett exempel som visar alla tre CIA-målen, och kopplingen till helhetssyn och riskbedömning." },

  { id: "sak-e2",
    question: "Vad betyder privacy, och varför är den svår att skydda online?",
    context: `${CONTEXT} Bygger på Föreläsning 2.`,
    checklist: [
      { heading: "Vad det är", points: [
        "Introna (1997) ger privacy tre betydelser: ingen åtkomst till personen eller den personliga sfären, kontroll över personlig information, och frihet från andras bedömning och granskning.",
        "Privacy och security hänger ihop: att upprätthålla privacy är ofta ett av målen med säkerhetsåtgärder.",
      ] },
      { heading: "Varför det spelar roll", points: [
        "Acquisti m.fl. (2022): offline skyddar sinnena privatlivet, vi sänker rösten och täcker papper. Online hjälper de signalerna inte; vi ser inte vem som tittar.",
        "Övervakningskapitalismen (Zuboff) gör data om människor till en affärsmodell: \"a future without secrets is here to stay\".",
        "Det privata blir offentligt, ofta frivilligt, som när en influencer delar sina barns liv.",
      ] },
      { heading: "Konkret", points: [
        "ATS ger resenärer en riskpoäng som de varken får se eller kan ifrågasätta, alltså ingen kontroll över personlig information.",
        "Clearview AI identifierar människor ur en enda bild mot en enorm databas, vad journalisten Kashmir Hill kallade en attack på anonymiteten.",
      ] },
      { heading: "Koppling", points: [
        "Säkerhetspolicyns data encryption, at rest och in transit, är ett tekniskt sätt att skydda privacy.",
        "CIA: confidentiality är det säkerhetsmål som också omfattar privacy.",
        "Berners-Lees data wallets är ett försök att ge människor tillbaka kontrollen, Intronas andra betydelse.",
      ] },
    ],
    outline: "1) Intronas tre betydelser och sambandet med security. 2) Varför det är svårt online: Acquisti (sinnena), Zuboff (affärsmodellen), det privata blir offentligt. 3) ATS eller Clearview som exempel, knutet till en av Intronas betydelser. 4) Vad som kan skydda: kryptering, confidentiality, kontroll över egna data." },

  { id: "sak-e3",
    question: "\"Security is a feeling vs. security is a reality\" – varför kan en organisation känna sig säker utan att vara det?",
    context: `${CONTEXT} Bygger på Föreläsning 2 och gästföreläsningen.`,
    checklist: [
      { heading: "Vad det är", points: [
        "Schneier skiljer känslan av säkerhet från den faktiska säkerheten. De två behöver inte följas åt.",
        "Den faktiska säkerheten avgörs av risken: vilka tillgångar som finns, vilka hot och sårbarheter de har och vilka åtgärder som skyddar dem.",
      ] },
      { heading: "Varför det spelar roll", points: [
        "Evolutionary trust: angripare och försvarare driver varandra framåt. Ett skydd som räckte i går räcker inte nödvändigtvis i dag.",
        "Online saknas de signaler sinnena använder för att bedöma fara (Acquisti m.fl.), så känslan blir en dålig mätare.",
        "En falsk känsla av säkerhet gör att man slutar leta efter sårbarheter och inte övar sin incidenthantering.",
      ] },
      { heading: "Konkret", points: [
        "En bank med en stark brandvägg vid perimetern känner sig säker, men ett enda kapat konto med breda behörigheter tar sig förbi den.",
        "En organisation som aldrig har övat en incident upptäcker först under attacken att återställningen tar längre tid än RTO tillåter.",
      ] },
      { heading: "Koppling", points: [
        "Zero trust: skydd i flera lager runt de kritiska tillgångarna, i stället för att lita på perimetern.",
        "Offensiv säkerhet: pentest och red team mäter den faktiska säkerheten i stället för känslan.",
        "Riskbedömningens fyra steg ersätter känslan med en systematisk genomgång.",
      ] },
    ],
    outline: "1) Schneiers skillnad mellan känsla och verklighet. 2) Varför de glider isär: attack och försvar utvecklas, sinnena hjälper inte online. 3) Ett exempel där känslan av säkerhet döljer en sårbarhet. 4) Hur man mäter verkligheten: riskbedömning, zero trust och tester." },

  { id: "sak-e4",
    question: "Hur bör en bank som BankY skydda sig mot cyberkriminella som vill stjäla kunddata och störa driften?",
    context: `${CONTEXT} Bygger på BankY-övningen i Föreläsning 2.`,
    checklist: [
      { heading: "Vad det är", points: [
        "Börja med riskbedömningens fyra steg: asset identification, threat modeling, vulnerability evaluation och mitigation strategy.",
        "Leta sårbarheter inom fyra områden: tekniskt, mänskligt, fysiskt samt policy och styrning.",
      ] },
      { heading: "Varför det spelar roll", points: [
        "Banken har alla tre CIA-målen på spel: kunddata (confidentiality), korrekta transaktioner (integrity) och tjänster som måste fungera (availability).",
        "Skadorna i The Hack Apocalyps drabbar en bank direkt: förstörda data, stulna pengar och störningar som försvårar detection and analysis och RTO.",
      ] },
      { heading: "Konkret", points: [
        "En säkerhetspolicy i tre delar: MFA och RBAC för least privilege, kryptering at rest och in transit med HSM, och en incident response-plan.",
        "Skydd i lager enligt data center-modellen (data, network, physical, site) och zero trust runt de kritiska tillgångarna.",
        "Awareness mot phishing och social engineering, planerat med Straub & Welkes modell och countermeasure matrix: deterrence, prevention, detection, remedies.",
      ] },
      { heading: "Koppling", points: [
        "Konsekvensskalan 1–6 hjälper banken att prioritera vilka risker som ska åtgärdas först.",
        "Standarderna stöder arbetet: ISO 27005 och NIST SP 800-30 för en detailed risk approach, NIS2 som lagkrav.",
        "Gästföreläsningens red team-exempel var just en finansiell institution, där ett pentest visar om skyddet håller i praktiken.",
      ] },
    ],
    outline: "1) Riskbedömningens fyra steg och de fyra sårbarhetsområdena. 2) Vad som står på spel för en bank, i CIA-termer. 3) Åtgärderna: policyns tre delar, skydd i lager och awareness. 4) Prioritera med konsekvensskalan och följ standarderna; testa med pentest." },

  { id: "sak-e5",
    question: "Hur kan offensiv säkerhet stärka försvaret?",
    context: `${CONTEXT} Bygger på gästföreläsningen.`,
    checklist: [
      { heading: "Vad det är", points: [
        "Offensiv säkerhet är att, med uttryckligt tillstånd, tänka och agera som en angripare för att hitta svagheterna först.",
        "Säkerhetsarbete organiseras i NIST:s sex funktioner: Govern i mitten, och Identify, Protect, Detect, Respond och Recover.",
      ] },
      { heading: "Varför det spelar roll", points: [
        "Attacker följer en förutsägbar kedja i åtta steg, från reconnaissance till actions on objectives. Den som känner kedjan vet var försvaret måste hålla.",
        "Kontroller kan se bra ut på papperet men brista i praktiken. Bara ett test visar om de fungerar.",
      ] },
      { heading: "Konkret", points: [
        "Varje funktion har sin aktivitet: threat modeling (Identify), pentest (Protect), purple team (Detect), cyber crisis tabletop (Recover) och red team för alla tillsammans.",
        "Red team-exemplet: nätfiske via LinkedIn, en skadlig fil som startade med Teams, lösenord på en filserver och vägen till ransomware-skada. Varje steg pekar ut en brist att åtgärda.",
      ] },
      { heading: "Koppling", points: [
        "Schneiers feeling vs reality: testerna mäter den faktiska säkerheten, inte känslan.",
        "Riskbedömningen i Föreläsning 2 använder samma tänkande i threat modeling och vulnerability evaluation.",
        "Testning sker alltid med uttryckligt tillstånd och inom lagens gränser, annars är det ett angrepp.",
      ] },
    ],
    outline: "1) Vad offensiv säkerhet är, och NIST:s sex funktioner. 2) Varför: attackkedjan och skillnaden mellan papper och praktik. 3) Aktiviteterna per funktion och red team-exemplet. 4) Kopplingen till feeling vs reality och riskbedömningen; tillståndet som villkor." },
];

export const ESSAY_INTRO = [
  "Fem egna övningsessäer, en per viktig tankegång i föreläsningarna. Årets essäämnen är inte kända, och inte heller hur långa svaren ska vara.",
  "Skriv i fyra steg: vad det är, varför det spelar roll, ett konkret exempel och en koppling till en annan del av kursen. Strategis essäer fick vara högst 300 ord; det är ett rimligt riktmärke tills vi vet mer.",
];
