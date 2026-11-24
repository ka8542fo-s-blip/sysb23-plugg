// Övningsessäer för Säkerhet i informationssystem. Tentan har 2 essäfrågor
// à högst 15 poäng och högst 700 ord, och poängen beror på hur djupt och väl
// argumenterat svaret är (lärarens anslag på Canvas 24 nov 2026). Ämnena är
// inte kända. De sju här är egna gissningar: fem bygger på föreläsningarna
// och två på bokkapitel som läraren pekat ut (14 och 15/17). `context` säger
// det till den som pluggar.
//
// Checklistorna följer lärarens bedömning, inte Strategis och BPM:s fyra
// steg: Tes / Kursbegrepp / Konkreta exempel / Motargument eller begränsning
// / Slutsats, med 2–3 punkter per kriterium. Kursbegreppen tar både bok och
// föreläsning. I provtentan blir essäpoängen 15 × andelen ibockade punkter.
// Manifestet sätter essayWordLimit: 700.

const CONTEXT = "Egen övningsessä – årets essäämnen är inte kända.";

export const essays = [
  { id: "sak-e1",
    question: "Hur har digitaliseringen förändrat vad som står på spel inom informationssäkerhet?",
    context: `${CONTEXT} Bygger på Föreläsning 1 och bokens kapitel 1.`,
    checklist: [
      { heading: "Tes", points: [
        "En tydlig tes i inledningen, till exempel: digitaliseringen har gjort data till kärnan i samhälle och ekonomi, så ett säkerhetsfel slår nu mot hela verksamheter och samhällsfunktioner.",
        "Tesen säger vad som har förändrats, inte bara att säkerhet är viktigt.",
      ] },
      { heading: "Kursbegrepp", points: [
        "CIA-triaden (Wylder 2004; bokens kapitel 1): confidentiality, integrity och availability, och vad en förlust av var och en innebär.",
        "Castells tre förändringar: the networked society, informational capitalism och Internet som ny kultur.",
        "De växande utmaningarna: information overload (Dean & Webb), surveillance capitalism (Zuboff), cyber attacks (Siponen) och autonoma AI-agenter.",
      ] },
      { heading: "Konkreta exempel", points: [
        "Siffror som visar insatserna: 6,15 miljarder internetanvändare, cyberbrott för 10,5 biljoner dollar 2025, dyrast per intrång är sjukvården med 6,64 miljoner dollar.",
        "Ett angrepp på ett sjukhus journalsystem där alla tre CIA-målen drabbas, eller Hugging Face-incidenten med en autonom AI-agent.",
      ] },
      { heading: "Motargument eller begränsning", points: [
        "En begränsning: digitaliseringen ger också bättre skydd, som kryptering, MFA och automatisk upptäckt. Det är inte bara riskerna som växer.",
        "Siffrorna om cyberbrottens kostnad är uppskattningar och prognoser, inte exakta mätningar.",
      ] },
      { heading: "Slutsats", points: [
        "Slutsatsen svarar på frågan: mer står på spel eftersom allt hänger ihop (Composition VIII), så säkerhet måste hanteras som en helhet.",
        "Den pekar framåt mot systematiskt arbete, som riskbedömningen i Föreläsning 2.",
      ] },
    ],
    outline: "Högst 700 ord. 1) Tes om vad digitaliseringen har ändrat. 2) CIA, Castells och de växande utmaningarna. 3) Siffror och ett exempel där alla tre CIA-målen drabbas. 4) Motargument: tekniken ger också bättre skydd, och siffrorna är uppskattningar. 5) Slutsats: helhetssyn och systematisk riskhantering." },

  { id: "sak-e2",
    question: "Vad betyder privacy, och varför är den svår att skydda online?",
    context: `${CONTEXT} Bygger på Föreläsning 2 och bokens kapitel 1 och 19.`,
    checklist: [
      { heading: "Tes", points: [
        "En tydlig tes, till exempel: privacy är svår att skydda online eftersom våra sinnen inte märker när vi exponeras, och eftersom data om oss har blivit en affärsmodell.",
        "Tesen tar ställning till varför, inte bara att det är svårt.",
      ] },
      { heading: "Kursbegrepp", points: [
        "Intronas (1997) tre betydelser: ingen åtkomst till personen, kontroll över personlig information och frihet från andras granskning.",
        "Privacy hör till confidentiality (bokens kapitel 1), och GDPR:s principer, som purpose limitation och data minimization, är lagens skydd (bokens kapitel 19).",
        "Acquisti m.fl. (2022) om sinnena offline och online, och Zubofs surveillance capitalism.",
      ] },
      { heading: "Konkreta exempel", points: [
        "ATS ger resenärer en riskpoäng de varken får se eller ifrågasätta: ingen kontroll över personlig information.",
        "Clearview AI identifierar människor ur en enda bild, eller en influencer som delar sina barns liv: det privata blir offentligt.",
      ] },
      { heading: "Motargument eller begränsning", points: [
        "Motargument: många delar data frivilligt och får tjänster i utbyte. Svaret är att valet sällan är informerat, eftersom sinnena inte märker exponeringen.",
        "Begränsning: tekniska skydd som kryptering skyddar data mot obehöriga, men inte mot att den som har rätt till data använder den för nya syften.",
      ] },
      { heading: "Slutsats", points: [
        "Slutsatsen svarar på frågan: privacy kräver både teknik (kryptering at rest och in transit), lag (GDPR) och kontroll för individen, som Berners-Lees data wallets.",
        "Den knyter tillbaka till den betydelse av privacy som tesen byggde på.",
      ] },
    ],
    outline: "Högst 700 ord. 1) Tes om varför privacy är svår att skydda online. 2) Introna, privacy under confidentiality, Acquisti och Zuboff, GDPR:s principer. 3) ATS eller Clearview som exempel. 4) Motargument: frivillig delning; begränsning: tekniken räcker inte. 5) Slutsats: teknik, lag och kontroll tillsammans." },

  { id: "sak-e3",
    question: "\"Security is a feeling vs. security is a reality\" – varför kan en organisation känna sig säker utan att vara det?",
    context: `${CONTEXT} Bygger på Föreläsning 2, gästföreläsningen och bokens kapitel 1.`,
    checklist: [
      { heading: "Tes", points: [
        "En tydlig tes, till exempel: känslan av säkerhet bygger på synliga skydd, medan den faktiska säkerheten avgörs av risker som bara syns när någon letar efter dem.",
        "Tesen förklarar varför känsla och verklighet glider isär.",
      ] },
      { heading: "Kursbegrepp", points: [
        "Schneiers skillnad mellan känsla och verklighet, och evolutionary trust: angripare och försvarare driver varandra framåt.",
        "Risk som tillgångar, hot och sårbarheter (riskbedömningens fyra steg), och bokens assurance: graden av förtroende för att skyddet faktiskt följer policyn.",
        "Attack surface (bokens kapitel 1) och zero trust: skydd i lager i stället för tillit till perimetern.",
      ] },
      { heading: "Konkreta exempel", points: [
        "En bank med stark brandvägg vid perimetern, där ett enda kapat konto med breda behörigheter tar sig förbi den.",
        "En organisation som aldrig har övat en incident och först under attacken märker att återställningen tar längre tid än RTO tillåter.",
      ] },
      { heading: "Motargument eller begränsning", points: [
        "Motargument: känslan av säkerhet har ett värde, eftersom den får människor att använda tjänsterna. Problemet uppstår först när den ersätter mätningen.",
        "Begränsning: inte heller ett pentest ger full visshet. Det visar svagheter som hittades, inte att inga andra finns.",
      ] },
      { heading: "Slutsats", points: [
        "Slutsatsen svarar på frågan och säger hur verkligheten mäts: riskbedömning, tester som pentest och red team, och övningar som tabletop.",
        "Den knyter tillbaka till tesen om synliga skydd mot faktisk risk.",
      ] },
    ],
    outline: "Högst 700 ord. 1) Tes om varför känsla och verklighet glider isär. 2) Schneier, evolutionary trust, risk, assurance och attack surface. 3) Exemplet med perimetern eller den oövade incidenten. 4) Motargument: känslan har ett värde; begränsning: tester ger inte full visshet. 5) Slutsats: mät verkligheten med riskbedömning, tester och övningar." },

  { id: "sak-e4",
    question: "Hur bör en bank som BankY skydda sig mot cyberkriminella som vill stjäla kunddata och störa driften?",
    context: `${CONTEXT} Bygger på BankY-övningen i Föreläsning 2 och bokens kapitel 14 och 15.`,
    checklist: [
      { heading: "Tes", points: [
        "En tydlig tes, till exempel: banken ska välja skydd efter en systematisk riskbedömning och lägga dem i flera lager, eftersom inget enskilt skydd räcker mot ett bestämt angrepp.",
        "Tesen säger hur banken ska tänka, inte bara vilka produkter den ska köpa.",
      ] },
      { heading: "Kursbegrepp", points: [
        "Riskbedömningens fyra steg och bokens riskbehandling: reduce likelihood, reduce consequence, transfer, avoidance och acceptance.",
        "Säkerhetspolicyns tre delar: access management med MFA och RBAC (least privilege), data encryption med HSM och incident response med Detection and Analysis först.",
        "Skydd i lager: data center-modellen och zero trust, och kontrollernas klasser i boken (management, operational, technical).",
      ] },
      { heading: "Konkreta exempel", points: [
        "Kunddata (confidentiality), korrekta transaktioner (integrity) och tjänster som måste fungera (availability): ett konkret hot mot vart och ett, som phishing, manipulerade betalningar och DDoS.",
        "En åtgärd per risk, till exempel MFA mot kapade konton (reduce likelihood) och backup på annan plats mot ransomware (reduce consequence).",
      ] },
      { heading: "Motargument eller begränsning", points: [
        "Begränsning: skyddet kostar, och boken säger att målet är en acceptabel risknivå, inte noll risk. Det som blir kvar är residual risk som ledningen tar ställning till.",
        "Motargument: tekniska kontroller räcker inte, eftersom angriparna ofta går via människor. Därför behövs awareness och utbildning.",
      ] },
      { heading: "Slutsats", points: [
        "Slutsatsen svarar på frågan: riskbedömning, policy och skydd i lager, prioriterat med konsekvensskalan och testat med pentest.",
        "Den påpekar att arbetet är en cykel (Plan-Do-Check-Act) och måste upprepas.",
      ] },
    ],
    outline: "Högst 700 ord. 1) Tes om riskbaserat skydd i lager. 2) Riskbedömningen, riskbehandlingen, policyns tre delar och kontrollernas klasser. 3) CIA-målen för en bank och en åtgärd per risk. 4) Begränsning: residual risk och kostnaden; motargument: människan. 5) Slutsats: prioritera, testa och upprepa." },

  { id: "sak-e5",
    question: "Hur kan offensiv säkerhet stärka försvaret?",
    context: `${CONTEXT} Bygger på gästföreläsningen och bokens kapitel 8.`,
    checklist: [
      { heading: "Tes", points: [
        "En tydlig tes, till exempel: offensiv säkerhet stärker försvaret genom att visa vilka svagheter som faktiskt går att utnyttja, innan en riktig angripare hittar dem.",
        "Tesen skiljer offensiv säkerhet från ett angrepp: tillståndet är villkoret.",
      ] },
      { heading: "Kursbegrepp", points: [
        "NIST:s sex funktioner (Govern, Identify, Protect, Detect, Respond, Recover) och aktiviteten per funktion: threat modeling, pentest, purple team, tabletop och red team.",
        "Attackens åtta steg, från external reconnaissance till actions on objectives, och begrepp som privilege escalation och lateral movement.",
        "Intrusion detection (bokens kapitel 8): purple team prövar om larmen fungerar, alltså om det blir false negatives.",
      ] },
      { heading: "Konkreta exempel", points: [
        "Red team-exemplet: nätfiske via LinkedIn, en skadlig fil som startade med Teams, lösenord på en filserver och vägen till ransomware-skada.",
        "Webbtestet: broken access control, SQL injection och XSS, med motåtgärder som prepared statements.",
      ] },
      { heading: "Motargument eller begränsning", points: [
        "Begränsning: ett test visar läget vid ett tillfälle och bara de svagheter som hittades, så det måste upprepas.",
        "Motargument: tester kostar och kan störa driften. Svaret är tydliga ramar och tillstånd, och att en riktig attack kostar mer.",
      ] },
      { heading: "Slutsats", points: [
        "Slutsatsen svarar på frågan: varje funktion i NIST-ramverket blir starkare av ett angriparperspektiv, och fynden ska leda till åtgärder.",
        "Den knyter an till Schneier: testerna mäter den faktiska säkerheten, inte känslan.",
      ] },
    ],
    outline: "Högst 700 ord. 1) Tes om att hitta svagheterna först, med tillstånd. 2) NIST:s funktioner, attackkedjan och intrusion detection. 3) Red team-exemplet eller webbtestet. 4) Begränsning: ögonblicksbild; motargument: kostnad och störning. 5) Slutsats: angriparperspektiv i varje funktion." },

  { id: "sak-e6",
    question: "Hur bör en organisation gå till väga för att bedöma och hantera sina IT-risker?",
    context: `${CONTEXT} Bygger på bokens kapitel 14, som läraren pekat ut, och Föreläsning 2.`,
    checklist: [
      { heading: "Tes", points: [
        "En tydlig tes, till exempel: riskhantering är en återkommande process som ska utgå från organisationens mål och lägga resurserna där risken är störst, inte ett engångsprojekt.",
        "Tesen tar ställning till hur noggrann analysen ska vara.",
      ] },
      { heading: "Kursbegrepp", points: [
        "IT security management enligt boken (Föreläsning 2) och Plan-Do-Check-Act: processen upprepas.",
        "De fyra angreppssätten: baseline, informal, detailed risk analysis och combined, som ISO 13335 anser mest kostnadseffektivt för de flesta.",
        "Likelihood, consequence och level of risk i ett risk register, och de fem sätten att behandla en risk.",
      ] },
      { heading: "Konkreta exempel", points: [
        "En risk i ett risk register, till exempel stöld av kunddata: likelihood, consequence enligt konsekvensskalan och vald behandling.",
        "Silver Star Mines: combined approach, och ledningen satte SCADA-risken först eftersom den kunde kosta liv.",
      ] },
      { heading: "Motargument eller begränsning", points: [
        "Begränsning: kvalitativa skalor bygger på bedömningar och kan bli subjektiva. Därför ska ägarna och ledningen bedöma consequence.",
        "Motargument: en detaljerad analys av allt är för dyr och tar för lång tid. Svaret är combined approach, med baseline för resten.",
      ] },
      { heading: "Slutsats", points: [
        "Slutsatsen svarar på frågan: kontext och risk appetite, analys med rätt angreppssätt, riskbehandling, och att processen upprepas.",
        "Den knyter tillbaka till tesen om att lägga resurserna efter risken.",
      ] },
    ],
    outline: "Högst 700 ord. 1) Tes om riskhantering som återkommande process. 2) IT security management, PDCA, de fyra angreppssätten, likelihood och consequence, riskbehandling. 3) En rad i ett risk register, och Silver Star Mines. 4) Begränsning: subjektiva skalor; motargument: kostnaden. 5) Slutsats: processens steg och att den upprepas." },

  { id: "sak-e7",
    question: "Vilken roll spelar säkerhetspolicyn i en organisations säkerhetsarbete?",
    context: `${CONTEXT} Bygger på bokens kapitel 14, 15 och 17, som läraren pekat ut, och Föreläsning 2.`,
    checklist: [
      { heading: "Tes", points: [
        "En tydlig tes, till exempel: säkerhetspolicyn är länken mellan ledningens mål och det personalen och systemen faktiskt gör, men den fungerar bara om den genomförs och följs upp.",
        "Tesen säger vad policyn gör, inte bara att den behövs.",
      ] },
      { heading: "Kursbegrepp", points: [
        "Security objectives, strategies och organizational security policy: vad som ska uppnås, hur och vad som ska göras (bokens kapitel 14). Policyn behöver högsta ledningens stöd.",
        "Policyn i Föreläsning 2: access management, data encryption och incident response. I boken (kapitel 15) är policyer management controls som styr valet av andra kontroller.",
        "Personalsidan (bokens kapitel 17): acceptable use policy, awareness och training, och principer som least privilege och separation of duties.",
      ] },
      { heading: "Konkreta exempel", points: [
        "En AUP som förbjuder att låna ut sitt konto och som de anställda skriver under vid anställningen.",
        "En policyregel som blir en konkret kontroll, till exempel MFA för all fjärråtkomst, med en ansvarig IT security officer.",
      ] },
      { heading: "Motargument eller begränsning", points: [
        "Begränsning: en policy på papperet ger en falsk känsla av säkerhet om den inte genomdrivs (Schneiers feeling vs reality).",
        "Motargument: för strikta regler gör att användarna kringgår dem. Policyn måste väga säkerhet mot användbarhet och kostnad.",
      ] },
      { heading: "Slutsats", points: [
        "Slutsatsen svarar på frågan: policyn styr valet av kontroller, fördelar ansvar och gör att reglerna kan genomdrivas, och den ses över regelbundet.",
        "Den knyter tillbaka till tesen om länken mellan mål och handling.",
      ] },
    ],
    outline: "Högst 700 ord. 1) Tes om policyn som länk mellan mål och handling. 2) Objectives, strategies och policy, policyns tre delar, management controls, AUP och personalprinciperna. 3) En AUP-regel och en regel som blir en kontroll. 4) Begränsning: policy utan genomförande; motargument: för strikta regler. 5) Slutsats: styrning, ansvar, genomförande och översyn." },
];

export const ESSAY_INTRO = [
  "Sju egna övningsessäer: fem bygger på föreläsningarna och två på bokkapitel som läraren pekat ut. Årets essäämnen är inte kända.",
  "På tentan ger varje essä upp till 15 poäng och får vara högst 700 ord. Poängen beror på hur djupt och väl argumenterat svaret är. Checklistan följer det: en tydlig tes, flera kursbegrepp rätt använda (bok och föreläsning), konkreta exempel, ett motargument eller en begränsning och en slutsats som svarar på frågan.",
];
