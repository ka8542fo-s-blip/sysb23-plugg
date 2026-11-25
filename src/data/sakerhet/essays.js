// Övningsessäer för Säkerhet i informationssystem. Tentan har 2 essäfrågor
// à högst 15 poäng och högst 700 ord, och poängen beror på hur djupt och väl
// argumenterat svaret är (lärarens anslag på Canvas 24 nov 2026). Lärarens
// tillägg 25 nov: essäfrågorna är reflekterande scenariofrågor, och
// omtentan i januari har samma upplägg och rättning.
//
// Essä 1 är lärarens eget exempel, ordagrant (`group: "Lärarens exempel"`).
// De andra sex är egna övningsessäer i samma stil: fyra scenarier ur
// lärarens förslag (molnmigrering, generativ AI, distansarbete,
// företagsfusion) och två med lärarens fokusämnen riskbedömning (kap. 14)
// och säkerhetspolicy (kap. 14, 15 och 17). Frågorna står på engelska, som
// lärarens exempel; checklistorna på svenska.
//
// Checklistorna följer lärarens krav, sex rubriker (CHECKLIST_HEADINGS):
// vilka säkerhetsrisker som uppstår, varför de uppstår, vad man gör åt dem,
// kursbegrepp ur bok och föreläsning, ett eget resonemang och ett
// motargument eller en begränsning. Varje essä har 15 punkter, så i
// provtentan ger varje ibockad punkt 1 av essäns 15 poäng.
// Manifestet sätter essayWordLimit: 700.

export const CHECKLIST_HEADINGS = [
  "Risker som uppstår",
  "Varför de uppstår",
  "Vad man gör åt dem",
  "Kursbegrepp",
  "Eget resonemang",
  "Motargument eller begränsning",
];

const checklist = (...groups) => groups.map((points, i) => ({ heading: CHECKLIST_HEADINGS[i], points }));

const OWN = "Egen övningsessä i samma stil som lärarens exempel.";

export const TEACHER_EXAMPLE =
  "How do you envision a digital transition in a company that has to migrate and integrate data with new platforms, by focusing on the security perspectives and issues that might arise.";

export const essays = [
  { id: "sak-e8",
    group: "Lärarens exempel",
    question: TEACHER_EXAMPLE,
    context: "Lärarens exempel på en essäfråga, ordagrant. Bygger på hela kursen, särskilt bokens kapitel 13 och 14 och Föreläsning 2.",
    checklist: checklist(
      [
        "Data kan läcka, ändras eller försvinna under själva flytten: alla tre målen i CIA-triaden hotas, inte bara confidentiality.",
        "Integrationen öppnar nya vägar in: kopplingar och API:er mellan gamla och nya plattformar, och konton som följer med eller dubbleras.",
        "Nya leverantörer blir en del av kedjan, och regelkraven gäller lika mycket under övergången: GDPR för personuppgifter, och för vissa verksamheter NIS2.",
      ],
      [
        "Under övergången finns data på två ställen samtidigt, och kopior, exportfiler och testmiljöer hamnar lätt utanför de vanliga skydden.",
        "Gamla behörigheter flyttas med utan att någon prövar dem, och tidspressen att få systemen att fungera skjuter säkerheten till efteråt.",
      ],
      [
        "En riskbedömning före flytten: tillgångar, hot, sårbarheter och konsekvens, och en vald riskbehandling för varje stor risk.",
        "Kryptering in transit och at rest under flytten, kontroll av att data kommit fram oförändrade, och backup och en plan för att gå tillbaka, med ett RTO som säger hur länge verksamheten tål att stå still.",
        "Behörigheterna byggs om i den nya plattformen med RBAC och least privilege, MFA för administratörer, och gamla konton och kopplingar tas bort när de inte längre behövs.",
      ],
      [
        "CIA-triaden (Föreläsning 1 och bokens kapitel 1) och riskbedömningen: de fyra stegen i Föreläsning 2, likelihood, consequence och riskbehandling i bokens kapitel 14.",
        "Åtkomstkontroll med RBAC (bokens kapitel 4), kryptering (kapitel 2), och skydd i lager som zero trust (Föreläsning 2).",
        "Molnets delade ansvar och CSA:s hot, som insecure interfaces and APIs (bokens kapitel 13), och change management, som prövar ändringar i systemen innan de görs (kapitel 15).",
      ],
      [
        "Du tar ställning till vilken risk som är störst just under övergången och motiverar det, i stället för att räkna upp alla tänkbara hot.",
        "Slutsatsen svarar på frågan: säkerheten planeras in från början, och arbetet fortsätter efter flytten (Plan-Do-Check-Act).",
      ],
      [
        "Begränsning: alla risker går inte att ta bort. Det som blir kvar är residual risk som ledningen får acceptera, och skydden kostar tid och pengar.",
        "Motargument: den nya plattformen kan vara säkrare än den gamla, till exempel om leverantören har mer resurser för säkerhet än företaget självt (bokens kapitel 13).",
      ],
    ),
    outline: "Högst 700 ord. 1) Riskerna för confidentiality, integrity och availability under flytten och integrationen. 2) Varför: data på två ställen, gamla behörigheter, nya kopplingar och tidspress. 3) Åtgärder: riskbedömning, kryptering och kontroll av data, ny åtkomstkontroll, backup och RTO. 4) Din bedömning av vad som är viktigast. 5) Begränsning: residual risk; motargument: den nya plattformen kan vara säkrare." },

  { id: "sak-e9",
    question: "How do you envision a company moving its on-premises systems and customer data to a public cloud service, by focusing on the security perspectives and issues that might arise?",
    context: `${OWN} Bygger på bokens kapitel 13 och gästföreläsningen.`,
    checklist: checklist(
      [
        "Kunddata kan läcka eller gå förlorade. Cloud Security Alliance kallar data loss or leakage den allvarligaste följden för många kunder.",
        "Konton kan kapas med stulna inloggningsuppgifter (account or service hijacking), och leverantörens gränssnitt och API:er blir en ny väg in.",
        "Företaget blir beroende av leverantören för tillgängligheten och ser inte hela riskbilden (unknown risk profile).",
      ],
      [
        "I ett publikt moln ligger allt utanför företagets brandvägg, så perimeterskyddet räcker inte. Kunden förlorar kontroll men behåller ansvaret (accountability), och vem som sköter vad i IaaS, PaaS och SaaS missförstås lätt.",
        "\"Cloud security is identity security\": en exponerad hemlighet, som en nyckel i ett kodförråd eller i öppen lagring, räcker för att logga in och sedan utöka åtkomsten.",
      ],
      [
        "Ansvaret klargörs i avtalet med leverantören, och tjänstemodell och driftsmodell väljs efter hur känsliga data är, till exempel hybrid cloud med de känsligaste data i den privata delen.",
        "Identiteten först: identity and access management, MFA, RBAC med least privilege, och hemligheter som inte ligger öppet och inte gäller för länge.",
        "Data krypteras at rest och in transit, helst med nycklar som leverantören inte har, och det finns backup och en plan med RTO för ett avbrott hos leverantören.",
      ],
      [
        "NIST:s tjänstemodeller och driftsmodeller, det delade ansvaret och CSA:s molnhot (bokens kapitel 13).",
        "Gästföreläsningens attackväg i molnet i tre steg och molngranskningens tre delar: identitet och åtkomst, hemligheter, konfiguration och detektering.",
        "Zero trust (Föreläsning 2), riskbedömningen (bokens kapitel 14) och GDPR:s krav på skydd av personuppgifter (kapitel 19).",
      ],
      [
        "Du tar ställning till vilka data som bör flyttas och hur, och förklarar varför identiteten blir den nya gränsen när perimetern försvinner.",
        "Slutsatsen svarar på frågan: hur flytten bör gå till för att molnet ska bli säkrare, inte osäkrare, än den gamla miljön.",
      ],
      [
        "Motargument: en stor leverantör kan ha mer resurser för säkerhet än företaget självt, så flytten kan höja säkerheten (bokens kapitel 13).",
        "Begränsning: avtal och granskningar ger inte full insyn. Kunden måste lita på leverantörens administratörer, som CSA räknar som en högriskroll (malicious insiders).",
      ],
    ),
    outline: "Högst 700 ord. 1) Riskerna: dataläckage, kapade konton, osäkra API:er och beroendet av leverantören. 2) Varför: perimetern försvinner, delat ansvar, exponerade hemligheter. 3) Åtgärder: avtal och rätt modell, identiteten först, kryptering och backup. 4) Din bedömning: vilka data, och varför identiteten är den nya gränsen. 5) Motargument: leverantören kan vara säkrare; begränsning: man får lita på leverantören." },

  { id: "sak-e10",
    question: "How do you envision the introduction of generative AI tools in a company where employees will use them with internal documents and customer data, by focusing on the security perspectives and issues that might arise?",
    context: `${OWN} Bygger på Föreläsning 1 och 2, bokens kapitel 17 och 19, och inlämningsuppgiften.`,
    checklist: checklist(
      [
        "Konfidentiell information och personuppgifter läcker när anställda klistrar in dokument och kunddata i en AI-tjänst utanför företaget.",
        "AI:ns svar kan vara felaktiga och används ändå i beslut och i kontakten med kunder: ett hot mot integrity.",
        "En AI som kopplas till interna system och får agera själv kan nå längre än avsett, som de autonoma AI-agenterna i Föreläsning 1.",
      ],
      [
        "Verktygen är lätta att börja använda innan det finns regler, så användningen växer utanför IT:s kontroll, och användarna vet sällan var data sparas och vad den används till.",
        "AI:n får ofta samma breda åtkomst som användaren eller mer, utan att någon har prövat vad den faktiskt kan nå.",
      ],
      [
        "En riskbedömning före införandet, och en acceptable use policy som säger vilka data som får användas i vilka verktyg.",
        "Least privilege också för AI:n: den når bara det användaren har rätt till (RBAC), och det den gör loggas så att det går att granska.",
        "Awareness och rollbaserad utbildning om AI-risker, och ett godkänt verktyg från en leverantör vars avtal uppfyller GDPR.",
      ],
      [
        "CIA-triaden och privacy: Intronas betydelser av privacy (Föreläsning 2), och GDPR:s purpose limitation och data minimization (bokens kapitel 19).",
        "Acceptable use policy, awareness, training och education (bokens kapitel 17), och least privilege och RBAC (Föreläsning 2 och bokens kapitel 4).",
        "AI-förordningen, EU:s lag som ställer krav på AI-system efter hur stor risk de innebär (den tas upp i inlämningsuppgiften, inte i boken).",
      ],
      [
        "Du tar ställning till hur långt AI:n ska få gå, bara svara på frågor eller också läsa i system och agera, och väger nyttan mot risken.",
        "Slutsatsen svarar på frågan: hur införandet bör gå till, och var gränsen går för känsliga data.",
      ],
      [
        "Motargument: ett förbud fungerar sällan, eftersom anställda då använder verktygen i det tysta. Ett godkänt verktyg med tydliga regler är säkrare.",
        "Begränsning: tekniska skydd hindrar inte att den som har rätt till data använder den för ett nytt syfte. Det kräver regler och omdöme (purpose limitation).",
      ],
    ),
    outline: "Högst 700 ord. 1) Riskerna: läckta data, felaktiga svar, en AI som når för långt. 2) Varför: verktygen kommer före reglerna och får bred åtkomst. 3) Åtgärder: riskbedömning, AUP, least privilege och loggning, utbildning, godkänt verktyg. 4) Din bedömning: hur långt AI:n ska få gå. 5) Motargument: förbud fungerar inte; begränsning: tekniken hindrar inte nya syften." },

  { id: "sak-e11",
    question: "How do you envision an organisation's move to permanent remote and hybrid work, where employees connect from home networks and their own devices, by focusing on the security perspectives and issues that might arise?",
    context: `${OWN} Bygger på Föreläsning 2 och bokens kapitel 3, 9 och 17.`,
    checklist: checklist(
      [
        "Phishing och stulna inloggningsuppgifter, som boken kallar de två vanligaste vägarna in, lyckas lättare när kollegorna inte sitter bredvid.",
        "Hemnät och privata enheter är sämre skyddade, och en dator som smittats hemma kan sedan kopplas in innanför brandväggen.",
        "Datorer och papper kan stjälas eller ses av andra i hemmet och på caféet, så den fysiska säkerheten hamnar utanför kontoret.",
      ],
      [
        "Perimetern försvinner: brandväggen skyddar inte trafik som går förbi den, och inte enheter som smittats utanför nätet (bokens kapitel 9).",
        "Inloggningen sker på distans, där lösenord kan avlyssnas eller spelas in och skickas igen (replay attack), och organisationen ser mindre av vad som händer på enheterna.",
      ],
      [
        "MFA för all fjärråtkomst, VPN eller zero trust där varje anslutning prövas, och least privilege.",
        "En BYOD-policy och en acceptable use policy som de anställda skriver under, och krypterade enheter så att en stulen dator inte ger åtkomst till data.",
        "Awareness om phishing och en tydlig väg att rapportera incidenter, så att Detection and Analysis fungerar också på distans.",
      ],
      [
        "Zero trust-cirkeln (Föreläsning 2), och brandväggens begränsningar och VPN (bokens kapitel 9).",
        "MFA och remote user authentication (bokens kapitel 3), och AUP med BYOD-policy (kapitel 17).",
        "Incidenthanteringen med Detection and Analysis först (Föreläsning 2), och CSIRT och incidenthanteringens fyra steg (bokens kapitel 17).",
      ],
      [
        "Du tar ställning till vad som väger tyngst, tekniken eller människorna, och förklarar varför perimetertänkandet inte räcker när arbetsplatsen är överallt.",
        "Slutsatsen svarar på frågan: hur övergången bör gå till och vad som måste vara på plats först.",
      ],
      [
        "Begränsning: för strikta regler gör att anställda kringgår dem, till exempel mejlar filer till sig själva. Säkerheten måste vägas mot användbarhet.",
        "Motargument: distansarbetet tar också bort risker, som obehöriga i kontorets lokaler, och tvingar fram skydd som inte hänger på perimetern.",
      ],
    ),
    outline: "Högst 700 ord. 1) Riskerna: phishing och stulna inloggningar, osäkra hemnät och enheter, stöld utanför kontoret. 2) Varför: perimetern försvinner och inloggningen sker på distans. 3) Åtgärder: MFA, VPN eller zero trust, BYOD-policy och AUP, kryptering, awareness och incidentrapportering. 4) Din bedömning: teknik eller människor. 5) Begränsning: regler som kringgås; motargument: vissa risker försvinner." },

  { id: "sak-e12",
    question: "How do you envision the merger of two companies that must integrate their IT systems, user accounts and customer databases, by focusing on the security perspectives and issues that might arise?",
    context: `${OWN} Bygger på Föreläsning 2, gästföreläsningen och bokens kapitel 4, 14, 17 och 19.`,
    checklist: checklist(
      [
        "Två uppsättningar konton och behörigheter slås ihop, och anställda får bredare åtkomst än de behöver.",
        "När näten kopplas ihop blir en svaghet i det ena företagets nät en väg in i det andra.",
        "Kunddatabaserna slås ihop med risk för fel och dubbletter (integrity) och för att personuppgifter används för ett nytt syfte.",
      ],
      [
        "Företagen har olika policyer, säkerhetsnivåer och sätt att styra åtkomst, och ingen har överblick över båda miljöerna (gästföreläsningen om Active Directory: \"intended configurations; unintended consequences\").",
        "Omorganisationer och uppsägningar: den som slutar eller byter roll behåller ofta sina behörigheter, och missnöjda anställda är en känd insiderrisk (bokens kapitel 17).",
      ],
      [
        "En gemensam riskbedömning och en gemensam säkerhetspolicy innan näten kopplas ihop, och näten hålls åtskilda tills de är granskade.",
        "Alla konton gås igenom: gemensamma roller med RBAC, least privilege och separation of duties, och behörigheterna tas bort direkt när någon slutar.",
        "GDPR prövas innan kunddata slås ihop: får uppgifterna användas för det nya syftet, och behövs alla (data minimization)?",
      ],
      [
        "Riskbedömningen (Föreläsning 2 och bokens kapitel 14) och säkerhetspolicyns tre delar: access management, data encryption och incident response.",
        "RBAC och mutually exclusive roles (bokens kapitel 4), och anställningens tre skeden med least privilege och separation of duties (kapitel 17).",
        "GDPR:s principer (bokens kapitel 19) och integrity i CIA-triaden.",
      ],
      [
        "Du tar ställning till i vilken ordning integrationen bör ske och varför, och förklarar varför människorna lika mycket som tekniken avgör om sammanslagningen blir säker.",
        "Slutsatsen svarar på frågan: hur sammanslagningen bör gå till för att det nya företaget inte ska ärva båda företagens svagheter.",
      ],
      [
        "Begränsning: att granska allt innan något kopplas ihop tar tid, medan verksamheten vill ha nyttan av sammanslagningen snabbt. Riskbedömningen hjälper att prioritera.",
        "Motargument: sammanslagningen är också ett tillfälle att städa bort gamla konton och system och höja säkerheten i båda företagen.",
      ],
    ),
    outline: "Högst 700 ord. 1) Riskerna: sammanslagna behörigheter, sammankopplade nät, sammanslagna kunddata. 2) Varför: olika policyer och ingen överblick, behörigheter som blir kvar, missnöjda anställda. 3) Åtgärder: gemensam riskbedömning och policy, genomgång av konton, GDPR-prövning. 4) Din bedömning: ordningen, och människornas roll. 5) Begränsning: tiden; motargument: ett tillfälle att städa." },

  { id: "sak-e6",
    question: "How do you envision the launch of a new online sales platform in a company that has never assessed its IT risks, by focusing on how to assess and handle the security risks and issues that might arise?",
    context: `${OWN} Bygger på bokens kapitel 14, som läraren pekat ut, Föreläsning 2 och gästföreläsningen.`,
    checklist: checklist(
      [
        "Kunddata och betalningsuppgifter kan stjälas (confidentiality), ordrar och priser manipuleras (integrity), och butiken slås ut av en DDoS-attack (availability).",
        "Webbsårbarheter i den nya plattformen, som SQL injection, XSS och broken access control (gästföreläsningen).",
        "Utan riskbedömning läggs pengarna på fel skydd, och ingen vet vilka risker ledningen faktiskt har accepterat.",
      ],
      [
        "Plattformen nås av alla på internet, så attack surface växer (bokens kapitel 1), och svagheterna syns först när någon letar efter dem.",
        "Företaget har inga mål för säkerheten och ingen policy att styra valen efter, så skydden väljs efter magkänsla i stället för efter risk.",
      ],
      [
        "Ett angreppssätt väljs: combined approach, med baseline för det mesta och en detaljerad analys av plattformen och kunddata.",
        "Likelihood och consequence bedöms för varje risk och förs in i ett risk register, och en behandling väljs: reduce likelihood, reduce consequence, transfer, avoidance eller acceptance.",
        "Plattformen testas före lanseringen, till exempel med pentest, och bedömningen upprepas (Plan-Do-Check-Act).",
      ],
      [
        "Riskbedömningens fyra steg och konsekvensskalan (Föreläsning 2), och bokens kapitel 14: de fyra angreppssätten, likelihood, consequence och level of risk.",
        "Riskbehandlingens fem sätt och residual risk (bokens kapitel 14 och 15), och kontrollernas klasser: management, operational och technical.",
        "Pentest och de tre vanliga webbsårbarheterna med motåtgärder (gästföreläsningen), och denial-of-service-attacker (bokens kapitel 7).",
      ],
      [
        "Du tar ställning till vilken risk som ska åtgärdas först och motiverar det med likelihood och consequence, som Silver Star Mines där ledningen satte den risk först som kunde kosta liv.",
        "Slutsatsen svarar på frågan: riskbedömningen ska komma före valet av skydd, och den slutar inte vid lanseringen.",
      ],
      [
        "Begränsning: kvalitativa skalor bygger på bedömningar och kan bli subjektiva. Därför ska ägarna och ledningen bedöma consequence.",
        "Motargument: en detaljerad analys av allt är för dyr för ett litet företag. Svaret är combined approach, där bara det viktigaste analyseras i detalj.",
      ],
    ),
    outline: "Högst 700 ord. 1) Riskerna för plattformens CIA, webbsårbarheterna och risken att skydda fel saker. 2) Varför: stor attack surface, inga mål och ingen policy. 3) Åtgärder: combined approach, risk register och riskbehandling, pentest och upprepning. 4) Din bedömning: vad som åtgärdas först. 5) Begränsning: subjektiva skalor; motargument: kostnaden." },

  { id: "sak-e7",
    question: "How do you envision the introduction of a security policy in a fast-growing company where employees today choose their own tools and share accounts, by focusing on the security perspectives and issues that might arise?",
    context: `${OWN} Bygger på bokens kapitel 14, 15 och 17, som läraren pekat ut, och Föreläsning 2.`,
    checklist: checklist(
      [
        "Delade konton gör att ingen kan hållas ansvarig, och en enda läckt inloggning öppnar för alla som använt kontot.",
        "Data sprids i verktyg som ingen har godkänt, utanför företagets kontroll och backup.",
        "Ingen vet vad man ska göra vid en incident, så skadan och återställningstiden växer.",
      ],
      [
        "Utan policy finns inga mål, inget ansvar och inga regler att genomdriva, och snabb tillväxt gör att vanorna sätter sig innan någon tänkt på säkerhet.",
        "Människorna är den största risken enligt boken: phishing, stulna inloggningsuppgifter och misstag (kapitel 17).",
      ],
      [
        "En policy med högsta ledningens stöd, som anger mål, strategier och vem som ansvarar.",
        "Policyns tre delar enligt Föreläsning 2: access management med personliga konton, MFA och RBAC; data encryption; incident response med ett RTO.",
        "En acceptable use policy som alla skriver under, och awareness och training så att reglerna förstås och följs.",
      ],
      [
        "Security objectives, strategies och organizational security policy (bokens kapitel 14), och policyer som management controls som styr valet av andra kontroller (kapitel 15).",
        "Acceptable use policy, awareness, training och education, least privilege och separation of duties (bokens kapitel 17).",
        "Accountability, ett av de sex mål en incident hotar (bokens kapitel 17), och incident response med Detection and Analysis först och RTO (Föreläsning 2).",
      ],
      [
        "Du tar ställning till vad policyn ska börja med, och förklarar hur en regel i policyn blir en konkret kontroll som går att följa upp.",
        "Slutsatsen svarar på frågan: policyn styr valet av kontroller, fördelar ansvar och ses över regelbundet.",
      ],
      [
        "Begränsning: en policy på papperet ger en falsk känsla av säkerhet om den inte genomdrivs (Schneiers feeling vs reality).",
        "Motargument: för strikta regler gör att användarna kringgår dem. Policyn måste väga säkerhet mot användbarhet och kostnad.",
      ],
    ),
    outline: "Högst 700 ord. 1) Riskerna: delade konton, ogodkända verktyg, ingen incidentberedskap. 2) Varför: inga mål eller regler, och människorna som största risk. 3) Åtgärder: ledningens stöd, policyns tre delar, AUP och awareness. 4) Din bedömning: vad policyn ska börja med. 5) Begränsning: policy på papperet; motargument: för strikta regler." },
];

export const ESSAY_INTRO = [
  "Tentans essäfrågor är reflekterande scenariofrågor. Essä 1 är lärarens eget exempel, ordagrant. De andra sex är egna övningsessäer i samma stil, på engelska som lärarens.",
  "Varje essä ger upp till 15 poäng och får vara högst 700 ord. Poängen beror på hur djupt och väl argumenterat svaret är. Checklistan har 15 punkter: vilka säkerhetsrisker som uppstår, varför de uppstår, vad man gör åt dem, kursbegrepp ur bok och föreläsning, ett eget resonemang och ett motargument eller en begränsning. I provtentan ger varje ibockad punkt 1 poäng.",
];
