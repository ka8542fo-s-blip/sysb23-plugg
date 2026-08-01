export const questions = [
  { id: "str-q01", topic: "grunder", difficulty: 1,
    question: "Hur definieras ekonomistyrning (enligt Nationalencyklopedin, som kurslitteraturen utgår från)?",
    options: [
      { text: "Avsiktlig påverkan på en verksamhet och dess befattningshavare mot vissa ekonomiska mål.", explain: "Rätt — definitionen betonar avsiktlig påverkan, verksamheten och dess människor, samt ekonomiska mål (som kan vara både finansiella och icke-finansiella)." },
      { text: "Sammanställning och rapportering av företagets externa redovisning till ägare och långivare.", explain: "Det beskriver extern redovisning — ekonomistyrning är bredare och riktas inåt mot styrning av verksamheten." },
      { text: "Maximering av företagets vinst genom kostnadskontroll.", explain: "Vinstmaximering är en målmodell, inte definitionen av ekonomistyrning — och styrning kan avse många slags ekonomiska mål." },
      { text: "Statlig reglering av företagens ekonomiska rapportering.", explain: "Ekonomistyrning är företagets egen styrning, inte extern reglering." }
    ],
    correct: 0, source: "AJK kap 1", reviewed: true },

  { id: "str-q02", topic: "grunder", difficulty: 1,
    question: "Vilka tre kategorier av styrmedel brukar ekonomistyrningen delas in i?",
    options: [
      { text: "Budgetering, kalkylering och redovisning.", explain: "Detta är tre exempel inom EN kategori (formella styrmedel), inte de tre kategorierna." },
      { text: "Formella styrmedel, organisationsstruktur och mindre formaliserad styrning.", explain: "Rätt — formella styrmedel (t.ex. budgetering, produktkalkylering), organisationsstruktur (organisationsform, ansvarsfördelning, belöningssystem) och mindre formaliserad styrning (kultur, lärande, medarbetarskap)." },
      { text: "Vision, affärsidé och strategi.", explain: "Det är ekonomistyrningens utgångspunkter, inte styrmedlen." },
      { text: "Planering, genomförande och uppföljning.", explain: "Det beskriver styrprocessens faser, inte styrmedelskategorierna." }
    ],
    correct: 1, source: "AJK kap 1 & 3", reviewed: true },

  { id: "str-q03", topic: "grunder", difficulty: 2,
    question: "Vad utmärker det horisontella perspektivet på ekonomistyrning?",
    options: [
      { text: "Företaget ses som en hierarki där ägarkrav bryts ned till ansvar på lägre nivåer.", explain: "Det är det vertikala perspektivet." },
      { text: "Företaget ses som en värdekedja av processer och aktiviteter som ska skapa kundvärde.", explain: "Rätt — utgångspunkten är kunden; värdeskapande aktiviteter främjas och icke-värdeskapande minimeras, och samordning mellan leden blir styrningens uppgift." },
      { text: "Styrningen fokuserar enbart på finansiella nyckeltal per avdelning.", explain: "Snarare tvärtom — kundperspektivet lyfter fram icke-finansiella faktorer som kvalitet och leveranstid." },
      { text: "Alla beslut centraliseras till företagsledningen.", explain: "Centralisering hör ihop med hierarkitänkande, inte värdekedjeperspektivet." }
    ],
    correct: 1, source: "AJK kap 3", reviewed: true },

  { id: "str-q04", topic: "grunder", difficulty: 2,
    question: "Vad kännetecknar strategisk ekonomistyrning jämfört med traditionell ekonomistyrning?",
    options: [
      { text: "Den avskaffar budgetar och kalkyler helt.", explain: "Nej — den kompletterar med nya metoder (t.ex. värdekedjeanalys, balanserat styrkort) snarare än avskaffar." },
      { text: "Den fokuserar uteslutande på kostnadsminimering.", explain: "Tvärtom betonas även differentiering och icke-finansiella strategiskt viktiga aspekter." },
      { text: "Det interna fokuset kompletteras med externt fokus på konkurrenter och kunder, och styrningen anpassas till vald strategi.", explain: "Rätt — t.ex. konkurrenters kostnadsnivåer och kunders betalningsvilja analyseras, och en lågkostnadsstrategi kräver annan styrning än en differentieringsstrategi." },
      { text: "Den flyttar ansvaret för strategin från ledningen till ekonomiavdelningen.", explain: "Ansvaret flyttas inte — ekonomistyrningen ska stödja strategiarbetet." }
    ],
    correct: 2, source: "AJK kap 1", reviewed: true },

  { id: "str-q05", topic: "vision", difficulty: 1,
    question: "Hur skiljer sig en vision från en affärsidé?",
    options: [
      { text: "Visionen beskriver hur företaget tjänar pengar, affärsidén beskriver framtidsdrömmar.", explain: "Precis tvärtom — det är affärsidén som handlar om vad man tjänar pengar på." },
      { text: "Visionen beskriver företagets önskade framtida riktning, affärsidén vad företaget gör och hur intäkter genereras.", explain: "Rätt — vision = önskvärt framtida tillstånd; affärsidé = vad företaget ägnar sig åt, för vilka kunder, och vad som skiljer det från andra." },
      { text: "Visionen är en kortsiktig plan medan affärsidén är långsiktig.", explain: "Visionen är långsiktig och ingen konkret plan alls." },
      { text: "Visionen används internt medan affärsidén enbart kommuniceras externt.", explain: "Båda används både internt och externt; skillnaden ligger i innehållet, inte publiken." }
    ],
    correct: 1, source: "AJK kap 1", reviewed: true },

  { id: "str-q06", topic: "vision", difficulty: 2,
    question: "Vilka tre funktioner har en vision enligt kurslitteraturen?",
    options: [
      { text: "Legitimerande, ambition & fokus samt identifikation & motivation.", explain: "Rätt — visionen sätter in företaget i ett samhällsperspektiv, anger ambitionsnivå som ramar in affärsidé och strategi, samt skapar engagemang och delaktighet." },
      { text: "Planering, budgetering och uppföljning.", explain: "Det är styrprocessaktiviteter, inte visionens funktioner." },
      { text: "Prissättning, positionering och promotion.", explain: "Det är marknadsföringsbegrepp." },
      { text: "Rekrytering, belöning och avveckling.", explain: "Det är HR-processer, inte visionens funktioner." }
    ],
    correct: 0, source: "AJK kap 1", reviewed: true },

  { id: "str-q07", topic: "vision", difficulty: 1,
    question: "Vad klargör ett företags strategi, enligt kurslitteraturens grundläggande definition?",
    options: [
      { text: "Hur affärsidén ska uppnås — en plan för hur företaget ska arbeta.", explain: "Rätt — strategin beskriver bl.a. konkurrensfördelar, produktområden, kundkategorier, organisation och resurser för att förverkliga affärsidén." },
      { text: "Företagets önskade framtida tillstånd.", explain: "Det är visionen." },
      { text: "Nedbrytningen av delmål till individuella arbetsuppgifter.", explain: "Det ligger närmare verksamhetsplaneringen, som kommer efter strategin." },
      { text: "Företagets bokföringsprinciper.", explain: "Redovisningsprinciper är inte strategi." }
    ],
    correct: 0, source: "AJK kap 1", reviewed: true },

  { id: "str-q08", topic: "vision", difficulty: 2,
    question: "I vilken ordning hänger begreppen samman, från övergripande till konkret?",
    options: [
      { text: "Strategi → Vision → Ekonomistyrning → Affärsidé → Verksamhetsplanering.", explain: "Fel ordning — visionen är utgångspunkten, inte strategin." },
      { text: "Affärsidé → Vision → Verksamhetsplanering → Strategi → Ekonomistyrning.", explain: "Visionen kommer före affärsidén, och strategin före verksamhetsplaneringen." },
      { text: "Vision → Affärsidé → Strategi → Verksamhetsplanering → Ekonomistyrning.", explain: "Rätt — visionen ramar in affärsidén, strategin anger hur affärsidén uppnås, verksamhetsplaneringen bryter ned målen, och ekonomistyrningen styr mot de ekonomiska målen." },
      { text: "Ekonomistyrning → Strategi → Affärsidé → Vision → Verksamhetsplanering.", explain: "Ekonomistyrningen är medlet i slutet av kedjan, inte utgångspunkten." }
    ],
    correct: 2, source: "AJK kap 1", reviewed: true },

  { id: "str-q09", topic: "mal", difficulty: 1,
    question: "Vilken kritik brukar riktas mot vinstmaximering som företagets enda mål?",
    options: [
      { text: "Vinst är alltid oviktigt för moderna företag.", explain: "Överdrift — vinst är fortsatt centralt, kritiken gäller antagandet att den är det ENDA målet." },
      { text: "Företag kan ha flera olika mål beroende på sammanhang, och full information för att maximera saknas.", explain: "Rätt — mål varierar med situation och tid, och beslut fattas inför en osäker framtid vilket gör maximering praktiskt omöjlig att säkerställa." },
      { text: "Företag agerar alltid enligt marknadens lagar.", explain: "Det är snarare ett antagande i den neoklassiska teorin än en kritik mot den." },
      { text: "Vinstmaximering är olaglig i de flesta länder.", explain: "Det finns inget sådant förbud." }
    ],
    correct: 1, source: "AJK kap 1", reviewed: true },

  { id: "str-q10", topic: "mal", difficulty: 2,
    question: "Vad innebär Herbert Simons satisfieringsmodell?",
    options: [
      { text: "Företag strävar efter maximal vinst genom fullständig information.", explain: "Det är den neoklassiska vinstmaximeringsmodellen som Simon kritiserar." },
      { text: "Företagsledningen maximerar sin egen nytta i form av lön, makt och status.", explain: "Det är Williamsons företagsledarmodell." },
      { text: "Företag strävar efter en tillfredsställande vinst i förhållande till en anspråksnivå, eftersom rationaliteten är begränsad.", explain: "Rätt — beslutsfattare känner inte alla alternativ och nöjer sig därför med ett alternativ som uppfyller ett preciserat minimikrav; det är en konsekvens av begränsad rationalitet, inte låg ambition." },
      { text: "Företagets mål är en kompromiss mellan intressenternas krav.", explain: "Det är intressentmodellen." }
    ],
    correct: 2, source: "AJK kap 1", reviewed: true },

  { id: "str-q11", topic: "mal", difficulty: 2,
    question: "Vad är utgångspunkten i intressentmodellen?",
    options: [
      { text: "Företaget är ett slutet system utan relationer till omgivningen.", explain: "Tvärtom — intressentmodellen bygger på det öppna systemsynsättet." },
      { text: "Företaget strävar efter jämvikt med sina intressenter genom balans mellan deras bidrag och företagets belöningar.", explain: "Rätt — målet blir en kompromiss mellan intressentkraven, som ofta tillgodoses 'seriekopplat' över tid för att säkra fortsatt drift." },
      { text: "Endast aktieägarnas avkastningskrav är relevanta.", explain: "Det är närmare det kassaflödesbaserade aktieägarperspektivet." },
      { text: "Företagets mål bestäms av staten.", explain: "Staten är EN intressent bland flera, inte den som ensam bestämmer målet." }
    ],
    correct: 1, source: "AJK kap 1", reviewed: true },

  { id: "str-q12", topic: "mal", difficulty: 2,
    question: "Vad går de kassaflödesbaserade målmodellerna ut på?",
    options: [
      { text: "Att maximera nuvärdet av framtida nettokassaflöden, ur ett aktieägarperspektiv.", explain: "Rätt — framtida in- minus utbetalningar diskonteras med en kalkylränta; en krona idag är värd mer än en krona i morgon, och riskfria kronor värderas högre än riskfyllda." },
      { text: "Att maximera periodens bokföringsmässiga resultat.", explain: "Redovisat resultat kan avvika från kassaflödet genom periodiseringar — modellen fokuserar betalningsströmmar." },
      { text: "Att minimera företagets utbetalningar oavsett intäkter.", explain: "Det skulle strypa verksamheten — det är nettoflödets nuvärde som ska maximeras." },
      { text: "Att hålla kassan så stor som möjligt vid varje tidpunkt.", explain: "Stor kassa är inte målet; kapital ska arbeta och generera framtida flöden." }
    ],
    correct: 0, source: "AJK kap 1", reviewed: true },

  { id: "str-q13", topic: "mal", difficulty: 3,
    question: "Baumols försäljningsmaximeringsmodell antar att företag strävar efter att…",
    options: [
      { text: "…maximera försäljningen, under villkoret att vinsten är tillfredsställande för ägarna.", explain: "Rätt — tillväxt ger ledningen högre löner, inflytande och status, vilket antas väga tyngre än ytterligare vinst; en godtagbar vinstnivå är dock en restriktion." },
      { text: "…maximera vinsten på kort sikt.", explain: "Det är den neoklassiska modellen, inte Baumols." },
      { text: "…minimera antalet anställda.", explain: "Ingen av målmodellerna handlar om detta." },
      { text: "…maximera utdelningen till aktieägarna varje år.", explain: "Utdelningsmaximering är inte Baumols poäng — försäljningen/tillväxten står i centrum." }
    ],
    correct: 0, source: "AJK kap 1", reviewed: true },

  { id: "str-q14", topic: "effektivitet", difficulty: 1,
    question: "Hur definieras effektivitet i kurslitteraturen?",
    options: [
      { text: "Antal producerade enheter per arbetad timme.", explain: "Det är ett exempel på produktivitet (fysiska termer), inte effektivitetens definition." },
      { text: "Grad av måluppfyllelse — värdet av utflödet i förhållande till värdet av inflödet, ställt mot ett mål.", explain: "Rätt — effektiviteten anger hur väl företaget når sina mål; observera att den därmed beror på målnivån." },
      { text: "Skillnaden mellan intäkter och kostnader.", explain: "Det är resultatet." },
      { text: "Företagets marknadsandel i procent.", explain: "Marknadsandel kan vara ETT mål, men är inte definitionen av effektivitet." }
    ],
    correct: 1, source: "AJK kap 2", reviewed: true },

  { id: "str-q15", topic: "effektivitet", difficulty: 1,
    question: "Vad kännetecknar hög INRE effektivitet?",
    options: [
      { text: "Hög kundnöjdhet och starkt varumärke.", explain: "Det är yttre effektivitet — relationen till omvärlden." },
      { text: "Hög produktivitet och kostnadseffektivitet — att 'göra saker rätt'.", explain: "Rätt — inre effektivitet handlar om resurshushållning ur ett internt perspektiv: produktivitet, ordning och reda, väl utvecklade rutiner." },
      { text: "Snabb tillväxt på nya marknader.", explain: "Tillväxt hör till den yttre effektiviteten." },
      { text: "Många designpriser för produkterna.", explain: "Extern uppskattning av produkterna hör till yttre effektivitet." }
    ],
    correct: 1, source: "AJK kap 2", reviewed: true },

  { id: "str-q16", topic: "effektivitet", difficulty: 2,
    question: "Ett företag har mycket hög produktivitet i fabriken men tappar stadigt marknadsandelar. Vad tyder det på?",
    options: [
      { text: "Låg inre effektivitet.", explain: "Nej — hög produktivitet talar för god INRE effektivitet." },
      { text: "Låg yttre effektivitet.", explain: "Rätt — företaget 'gör saker rätt' men verkar inte 'göra rätt saker': erbjudandet skapar inte tillräckligt kundvärde relativt konkurrenterna." },
      { text: "Hög total effektivitet.", explain: "Total effektivitet kräver att BÅDE inre och yttre är höga." },
      { text: "Hög lönsamhet.", explain: "Fallande marknadsandelar hotar snarare lönsamheten på sikt." }
    ],
    correct: 1, source: "AJK kap 2", reviewed: true },

  { id: "str-q17", topic: "effektivitet", difficulty: 2,
    question: "Varför anses lönsamhet vara ett bättre mått än resultat på hur väl verksamheten går?",
    options: [
      { text: "Lönsamhet sätter resultatet i relation till det kapital som används.", explain: "Rätt — resultatet är ett absolut tal; lönsamhet (t.ex. räntabilitet) är ett relationstal som visar hur väl kapitalet förräntas, vilket gör företag jämförbara." },
      { text: "Lönsamhet är alltid högre än resultatet.", explain: "Meningslös jämförelse — de mäter olika saker (kvot respektive absolut tal)." },
      { text: "Resultatet kan inte beräknas i tjänsteföretag.", explain: "Resultat kan beräknas i alla företag." },
      { text: "Lönsamhet påverkas inte av kostnader.", explain: "Kostnader påverkar resultatet och därmed även lönsamheten." }
    ],
    correct: 0, source: "AJK kap 2", reviewed: true },

  { id: "str-q18", topic: "effektivitet", difficulty: 3,
    question: "Vilket begreppspar är knutet till tidpunkten då likvida medel faktiskt byter ägare?",
    options: [
      { text: "Inkomst och utgift.", explain: "De knyts till affärstransaktionerna (i praktiken fakturadatum), inte till betalningen." },
      { text: "Intäkt och kostnad.", explain: "De är periodiserade — värdet av utförda prestationer respektive förbrukade resurser under en period." },
      { text: "Inbetalning och utbetalning.", explain: "Rätt — dessa avser själva betalningstransaktionerna, som kan ske både före och efter att inkomsten/utgiften uppstått (t.ex. vid kreditförsäljning)." },
      { text: "Tillgång och skuld.", explain: "Det är balansräkningsposter, inte flödesbegrepp." }
    ],
    correct: 2, source: "AJK kap 2", reviewed: true },

  { id: "str-q19", topic: "organisation", difficulty: 1,
    question: "Vad kännetecknar en funktionsorganisation?",
    options: [
      { text: "Organisationen är indelad efter produkter eller tjänster.", explain: "Det beskriver en divisionsorganisation." },
      { text: "Organisationen är strukturerad efter funktioner som marknadsföring, produktion och ekonomi.", explain: "Rätt — specialistkompetens samlas per funktion; vanligt i mindre och medelstora företag med homogen verksamhet." },
      { text: "Organisationen byggs kring tillfälliga projektgrupper.", explain: "Det liknar projekt-/matrisformer snarare än funktionsorganisation." },
      { text: "Organisationen saknar chefer helt.", explain: "Funktionsorganisationen är hierarkisk med funktionschefer." }
    ],
    correct: 1, source: "AJK kap 3 / föreläsning", reviewed: true },

  { id: "str-q20", topic: "organisation", difficulty: 2,
    question: "Varför har stora företag ofta tydliga inslag av divisionsorganisation?",
    options: [
      { text: "Det underlättar att lansera nya produktområden och gå in på nya geografiska marknader.", explain: "Rätt — divisioner kan drivas som egna resultat-/lönsamhetsenheter per produktområde eller region, vilket gör diversifiering hanterbar." },
      { text: "Det garanterar att alla anställda arbetar med samma produkt.", explain: "Tvärtom — divisioner finns just för att hantera OLIKA produkter/marknader." },
      { text: "Det eliminerar behovet av ekonomistyrning.", explain: "Snarare ökar behovet av ansvarsfördelning och prestationsmätning per division." },
      { text: "Det är ett lagkrav för börsnoterade bolag.", explain: "Det finns inget sådant krav." }
    ],
    correct: 0, source: "AJK kap 3 / föreläsning", reviewed: true },

  { id: "str-q21", topic: "organisation", difficulty: 2,
    question: "Vilka två principer ska styra fördelningen av ekonomiskt ansvar?",
    options: [
      { text: "Påverkbarhetsprincipen och befogenhetsprincipen.", explain: "Rätt — befattningshavare ska kunna påverka det de ansvarar för och ha befogenheter att göra det; annars förlorar styrningen effekt." },
      { text: "Försiktighetsprincipen och matchningsprincipen.", explain: "Det är redovisningsprinciper." },
      { text: "Senioritetsprincipen och rotationsprincipen.", explain: "Dessa är inte principer för ansvarsfördelning i ekonomistyrningen." },
      { text: "Maximerings- och minimeringsprincipen.", explain: "Påhittade alternativ — inga etablerade ansvarprinciper." }
    ],
    correct: 0, source: "AJK kap 3", reviewed: true },

  { id: "str-q22", topic: "organisation", difficulty: 3,
    question: "En enhet ansvarar för intäkter och kostnader men har inte befogenhet över kapitalposter. Vilket ansvar är lämpligast?",
    options: [
      { text: "Lönsamhetsansvar.", explain: "Lönsamhetsansvar kräver möjlighet att påverka även kapitalet (resultat i förhållande till kapital)." },
      { text: "Resultatansvar.", explain: "Rätt — resultatansvar avser intäkter minus kostnader; utan kapitalpåverkan vore räntabilitetskrav orättvist enligt påverkbarhetsprincipen." },
      { text: "Kostnadsansvar.", explain: "För snävt — enheten påverkar ju även intäkter." },
      { text: "Standardkostnadsansvar.", explain: "Det är en form av kostnadsansvar för t.ex. tillverkande enheter." }
    ],
    correct: 1, source: "AJK kap 3", reviewed: true },

  { id: "str-q23", topic: "strategiutveckling", difficulty: 1,
    question: "Varför kan en strategi enligt Mintzberg inte alltid planeras fullt ut i förväg?",
    options: [
      { text: "Strategier som planeras i förväg misslyckas alltid.", explain: "För kategoriskt — Mintzberg avfärdar inte planering, han kompletterar den." },
      { text: "Marknad och omvärld är ofta osäkra och förändras snabbt, så strategin växer delvis fram längs vägen.", explain: "Rätt — realiserad strategi är en kombination av avsiktlig (planerad) och framväxande (emergent) strategi; företaget lär och anpassar sig." },
      { text: "Långsiktig planering är för dyr för att löna sig.", explain: "Kostnad är inte Mintzbergs argument — osäkerheten är." },
      { text: "Strategiarbete är irrelevant och bör ersättas av improvisation.", explain: "Emergent strategi är lärande anpassning, inte planlös improvisation." }
    ],
    correct: 1, source: "Mintzberg / föreläsning", reviewed: true },

  { id: "str-q24", topic: "strategiutveckling", difficulty: 2,
    question: "I vilken ordning har strategiämnets dominerande fokus utvecklats enligt Herrmann (2005)?",
    options: [
      { text: "Resurser → omvärld/positionering → kunskap och lärande.", explain: "RBV kom EFTER positioneringsskolan, inte före." },
      { text: "Kunskap och lärande → resurser → omvärld/positionering.", explain: "Omvänd ordning — kunskaps-/lärandefokus är den NUVARANDE eran." },
      { text: "Omvärld/positionering → resurser (RBV) → kunskap, lärande och innovation.", explain: "Rätt — omvärldsfokuset mognade med Porters branschanalys och generiska strategier; RBV flyttade blicken inåt mot resurser; idag dominerar kunskap, lärande och innovation." },
      { text: "Ekonomistyrning → marknadsföring → digitalisering.", explain: "Det är inte Herrmanns indelning av strategifältet." }
    ],
    correct: 2, source: "Herrmann (2005)", reviewed: true },

  { id: "str-q25", topic: "strategiutveckling", difficulty: 2,
    question: "Vad menas med en 'lärande organisation'?",
    options: [
      { text: "En organisation där alla anställda har akademisk examen.", explain: "Formell utbildning är inte poängen." },
      { text: "En organisation med kultur och klimat där erfarenheter sprids och omsätts i ständig förändring, förnyelse och förbättring.", explain: "Rätt — individers lärande blir organisatoriskt när kunskapen sprids och tillämpas; det kräver att experiment, initiativ och ifrågasättande är accepterat." },
      { text: "En organisation som outsourcar all kompetensutveckling.", explain: "Snarare motsatsen till att bygga eget lärande." },
      { text: "En organisation som enbart lär av konkurrenters misstag.", explain: "Erfarenhetsbaserat eget lärande står i centrum, inte bara omvärldsbevakning." }
    ],
    correct: 1, source: "AJK kap 3 / Herrmann (2005)", reviewed: true },

  { id: "str-q26", topic: "strategiutveckling", difficulty: 3,
    question: "Vad skiljer dubbelkretslärande från enkelkretslärande?",
    options: [
      { text: "Dubbelkretslärande innebär att två personer alltid lär sig samtidigt.", explain: "Antalet personer har inget med begreppet att göra." },
      { text: "Enkelkretslärande löser problemet; dubbelkretslärande ifrågasätter dessutom orsaken bakom problemet.", explain: "Rätt — enkelkrets 'kurerar symptomen', dubbelkrets tar sig även an 'sjukdomen' genom att ompröva underliggande antaganden och arbetssätt." },
      { text: "Dubbelkretslärande sker endast i digitala system.", explain: "Begreppen gäller mänskligt och organisatoriskt lärande." },
      { text: "Enkelkretslärande är alltid bättre eftersom det går snabbare.", explain: "Snabbare, ja — men utan orsaksanalys återkommer problemen." }
    ],
    correct: 1, source: "AJK kap 3", reviewed: true },

  { id: "str-q27", topic: "porter", difficulty: 1,
    question: "Vilken av följande är INTE en av Porters fem krafter?",
    options: [
      { text: "Leverantörernas förhandlingsstyrka.", explain: "Detta ÄR en av de fem krafterna." },
      { text: "Hot från substitutprodukter.", explain: "Detta ÄR en av de fem krafterna." },
      { text: "Lagar och regleringar som påverkar branschen.", explain: "Rätt — reglering ingår inte som egen kraft i modellen (den fångas i omvärldsanalyser som PESTEL); en klassisk tentadistraktor." },
      { text: "Konkurrens mellan existerande företag i branschen.", explain: "Detta ÄR en av de fem krafterna — ofta beskriven som modellens mittpunkt." }
    ],
    correct: 2, source: "Porter / föreläsning", reviewed: true },

  { id: "str-q28", topic: "porter", difficulty: 1,
    question: "I vilket sammanhang är en femkraftsanalys mest användbar?",
    options: [
      { text: "När företaget vill förbättra de anställdas arbetsmiljö.", explain: "Internt HR-arbete — inte branschstrukturanalys." },
      { text: "När företaget överväger att gå in i en ny bransch.", explain: "Rätt — modellen bedömer branschens lönsamhetspotential och konkurrenstryck, vilket är precis vad ett inträdesbeslut kräver." },
      { text: "När företaget utvärderar en enskild marknadsföringskampanj.", explain: "För operativt — modellen analyserar branschnivån." },
      { text: "När företaget optimerar sin interna leveranskedja.", explain: "Leveranskedjeoptimering är intern effektivitet, inte branschanalys." }
    ],
    correct: 1, source: "Porter / föreläsning", reviewed: true },

  { id: "str-q29", topic: "porter", difficulty: 2,
    question: "Vilka är Porters generiska strategier?",
    options: [
      { text: "Kostnadsledarskap, differentiering och fokus.", explain: "Rätt — konkurrensfördel nås genom lägst kostnad, unikt erbjudande, eller koncentration på ett smalt segment (med kostnads- eller differentieringsinriktning)." },
      { text: "Tillväxt, mognad och nedgång.", explain: "Det är produktlivscykelns faser." },
      { text: "Vision, mission och värdegrund.", explain: "Styrfilosofiska begrepp, inte konkurrensstrategier." },
      { text: "Centralisering, decentralisering och outsourcing.", explain: "Organisationsval, inte Porters generiska strategier." }
    ],
    correct: 0, source: "Porter / Herrmann (2005)", reviewed: true },

  { id: "str-q30", topic: "rbv", difficulty: 1,
    question: "Vilka egenskaper ska resurser ha för att ge uthållig konkurrensfördel enligt det resursbaserade synsättet?",
    options: [
      { text: "De ska vara billiga, standardiserade och lätta att köpa in.", explain: "Sådana resurser kan alla skaffa — ingen fördel uppstår." },
      { text: "De ska vara värdefulla, sällsynta och svåra att imitera, och företaget ska vara organiserat för att utnyttja dem.", explain: "Rätt — det är kärnan i RBV (VRIO-logiken); fördelen sitter i det konkurrenterna inte enkelt kan kopiera." },
      { text: "De ska vara immateriella och sakna marknadsvärde.", explain: "Immateriellt kan hjälpa imitationsskyddet men är inget krav — och värde krävs definitivt." },
      { text: "De ska vara godkända av branschorganisationen.", explain: "Extern certifiering är irrelevant för RBV-logiken." }
    ],
    correct: 1, source: "Barney / Herrmann (2005)", reviewed: true },

  { id: "str-q31", topic: "rbv", difficulty: 2,
    question: "Varför blir generativ AI enligt Barney (2024) sannolikt INTE en källa till uthållig konkurrensfördel?",
    options: [
      { text: "Tekniken skapar inget värde alls.", explain: "Fel — den skapar stort värde; problemet är att värdet inte kan FÅNGAS varaktigt av ett enskilt företag." },
      { text: "Tekniken blir snabbt tillgänglig för alla konkurrenter, så insikter och effektiviseringar jämnas ut.", explain: "Rätt — liksom ångmaskinen och persondatorn tvingas i princip alla införa den, och liknande algoritmer på liknande data ger liknande resultat." },
      { text: "AI är förbjuden inom de flesta branscher.", explain: "Det stämmer inte." },
      { text: "AI kan bara användas av teknikföretag.", explain: "Barneys exempel spänner över bank, industri och handel." }
    ],
    correct: 1, source: "Barney (2024)", reviewed: true },

  { id: "str-q32", topic: "rbv", difficulty: 2,
    question: "Hur kan företag enligt Barney (2024) ändå skapa hållbara konkurrensfördelar med hjälp av AI?",
    options: [
      { text: "Genom att applicera AI på redan värdefulla, sällsynta och svårimiterade resurser, så att tekniken förstärker befintliga fördelar.", explain: "Rätt — som Amazons logistik och leverantörsrelationer: AI-insikterna blir bara användbara för den som har tillgångarna, vilket ökar försprånget." },
      { text: "Genom att vara först med att köpa licenser till den senaste modellen.", explain: "First mover-fördelar blir kortlivade — konkurrenter följer snabbt efter och AI:n lär dessutom av dina drag." },
      { text: "Genom att hemlighålla att man använder AI.", explain: "Hemlighetsmakeri skyddar inte — resultatet av strategin syns och kan härledas/imiteras." },
      { text: "Genom att samla världens största dataset oavsett innehåll.", explain: "Större dataset ger avtagande nytta när mönstren redan framträder i mindre mängder, och konkurrenter har ofta funktionellt likvärdig data." }
    ],
    correct: 0, source: "Barney (2024)", reviewed: true },

  { id: "str-q33", topic: "rbv", difficulty: 3,
    question: "Varför ger proprietär (egen) data sällan uthållig AI-fördel enligt Barney?",
    options: [
      { text: "Egen data är alltid av för dålig kvalitet.", explain: "Kvalitet är inte huvudargumentet." },
      { text: "Konkurrenter har ofta funktionellt likvärdig data, mönster kan härledas ur dina synliga handlingar, och dataset är svåra att skydda mot läckor.", explain: "Rätt — liknande data ger liknande mönster, AI kan imitera din strategi utifrån utfallen, och 'en missnöjd anställd' kan räcka för att datan sprids." },
      { text: "Det är olagligt att träna AI på egen kunddata.", explain: "Reglering finns, men det är inte Barneys argument här." },
      { text: "Egen data blir automatiskt publik efter fem år.", explain: "Ingen sådan regel finns." }
    ],
    correct: 1, source: "Barney (2024)", reviewed: true },

  { id: "str-q34", topic: "rbv", difficulty: 3,
    question: "Vad menar Barney med att 'first mover'-fördelar med gen-AI blir kortlivade?",
    options: [
      { text: "Tidiga användare straffas av myndigheterna.", explain: "Inget sådant argument förs fram." },
      { text: "AI lär av ständigt uppdaterad data, så pionjärens val absorberas i den data som sena aktörers AI analyserar — de drar nytta av dina ansträngningar.", explain: "Rätt — därför bör AI ändå integreras i beslutsprocesserna för tillfälliga försprång, men utan förväntan om varaktig fördel." },
      { text: "Tekniken slutar utvecklas efter lansering.", explain: "Tvärtom — den blir ständigt 'smartare', vilket är en del av poängen." },
      { text: "Tidiga investeringar går aldrig att räkna hem.", explain: "Tillfälligt värde kan visst fångas — det varaktiga försprånget uteblir." }
    ],
    correct: 1, source: "Barney (2024)", reviewed: true },

  { id: "str-q35", topic: "bsc", difficulty: 1,
    question: "Varför är ett ensidigt fokus på finansiella mått problematiskt enligt Kaplan & Norton?",
    options: [
      { text: "Finansiella mått är historiska — de visar vad som hände förra perioden men ger ingen vägledning framåt.", explain: "Rätt — de rapporterar utfall utan att visa hur prestationen förbättras nästa period; därför behövs kompletterande, framåtblickande mått." },
      { text: "Finansiella mått är alltid missvisande och bör avskaffas.", explain: "För starkt — de behövs, men behöver kompletteras." },
      { text: "Finansiella mått är för svåra att beräkna.", explain: "Beräkningssvårighet är inte argumentet." },
      { text: "Finansiella mått gynnar bara små företag.", explain: "Ingen sådan poäng görs." }
    ],
    correct: 0, source: "Kaplan & Norton (1993)", reviewed: true },

  { id: "str-q36", topic: "bsc", difficulty: 1,
    question: "Vilka är det balanserade styrkortets fyra perspektiv?",
    options: [
      { text: "Finansiellt, kund, interna processer samt innovation & lärande.", explain: "Rätt — tillsammans balanserar de externa och interna mått och kopplar dagens aktiviteter till morgondagens finansiella utfall." },
      { text: "Ekonomi, juridik, teknik och miljö.", explain: "Det liknar en PESTEL-uppdelning, inte BSC." },
      { text: "People, Planet, Profit och Purpose.", explain: "Det blandar ihop BSC med Triple Bottom Line (och Purpose är en distraktor även där)." },
      { text: "Vision, strategi, budget och bokslut.", explain: "Styrprocessens artefakter — inte styrkortets perspektiv." }
    ],
    correct: 0, source: "Kaplan & Norton (1993)", reviewed: true },

  { id: "str-q37", topic: "bsc", difficulty: 2,
    question: "Hur skiljer sig Balanced Scorecard från traditionell, finansiellt fokuserad styrning?",
    options: [
      { text: "Det ersätter alla finansiella mått med kvalitativa bedömningar.", explain: "Nej — det finansiella perspektivet finns kvar som ett av fyra." },
      { text: "Det integrerar finansiella och icke-finansiella mått för en bredare bild av företagets prestation.", explain: "Rätt — balansen mellan utfallsmått och drivande mått kopplar styrningen till strategin." },
      { text: "Det fokuserar enbart på miljö och socialt ansvar.", explain: "Det är TBL/ESG-ramverkens fokus." },
      { text: "Det skyddar företagets resurser från att kopieras.", explain: "Imitationsskydd är RBV-logik, inte BSC." }
    ],
    correct: 1, source: "Kaplan & Norton (1993)", reviewed: true },

  { id: "str-q38", topic: "bsc", difficulty: 3,
    question: "Vad menar Kaplan & Norton med styrkortets 'transparenstest'?",
    options: [
      { text: "Alla mått ska publiceras offentligt i årsredovisningen.", explain: "Offentlighet är inte poängen." },
      { text: "En utomstående ska kunna utläsa affärsenhetens konkurrensstrategi ur de 15–20 valda måtten.", explain: "Rätt — styrkortet är inte en universalmall utan skräddarsys, och måttvalen ska tydligt spegla strategin." },
      { text: "Måtten ska uppdateras i realtid.", explain: "Uppdateringsfrekvens är inte testet." },
      { text: "Endast finansiella mått får ingå.", explain: "Motsatsen till hela idén med balansen." }
    ],
    correct: 1, source: "Kaplan & Norton (1993)", reviewed: true },

  { id: "str-q39", topic: "matt", difficulty: 2,
    question: "Vilket är det FÖRSTA och vanligaste misstaget företag gör med icke-finansiella mått enligt Ittner & Larcker?",
    options: [
      { text: "De mäter för sällan.", explain: "Frekvens är inte något av de fyra misstagen." },
      { text: "De kopplar inte måtten till strategin — ingen kausalmodell länkar icke-finansiella drivare till finansiella utfall.", explain: "Rätt — utan orsak-verkan-modell kan man inte välja rätt bland hundratals möjliga mått och mäter för många, irrelevanta saker." },
      { text: "De använder för få konsulter.", explain: "Konsultanvändning nämns inte som misstag." },
      { text: "De offentliggör måtten för konkurrenterna.", explain: "Sekretess är inte poängen." }
    ],
    correct: 1, source: "Ittner & Larcker (2003)", reviewed: true },

  { id: "str-q40", topic: "matt", difficulty: 2,
    question: "Ett företag satte målet 100 % kundnöjdhet trots att helt nöjda kunder inte spenderade mer än 80 %-nöjda. Vilket misstag illustrerar det?",
    options: [
      { text: "Att inte validera sambanden.", explain: "Nära — men här FANNS data om sambandet; felet låg i målsättningen." },
      { text: "Att sätta fel prestationsmål.", explain: "Rätt — Ittner & Larckers tredje misstag: målnivåer som kostar mer än de ger; marginalnyttan av de sista procenten var noll." },
      { text: "Att mäta inkorrekt.", explain: "Mätningen i sig var inte problemet i exemplet." },
      { text: "Att belöna fel personer.", explain: "Inte ett av de fyra misstagen." }
    ],
    correct: 1, source: "Ittner & Larcker (2003)", reviewed: true },

  { id: "str-q41", topic: "matt", difficulty: 3,
    question: "Vad fann Ittner & Larcker hos företag som byggde OCH validerade kausalmodeller för sina icke-finansiella mått?",
    options: [
      { text: "De presterade signifikant högre avkastning (ROA/ROE) än företag som inte gjorde det.", explain: "Rätt — den empiriska poängen: rätt använda icke-finansiella mått ger mätbar finansiell utdelning; slarvigt använda ger felinvesteringar." },
      { text: "De övergav snabbt alla icke-finansiella mått.", explain: "Tvärtom — de fick ut värdet av dem." },
      { text: "Ingen skillnad kunde uppmätas.", explain: "En tydlig skillnad var just studiens huvudfynd." },
      { text: "De drabbades oftare av manipulation.", explain: "Manipulation frodas snarare när mått SAKNAR koppling och validering." }
    ],
    correct: 0, source: "Ittner & Larcker (2003)", reviewed: true },

  { id: "str-q42", topic: "tbl", difficulty: 1,
    question: "Vilken kategori i Triple Bottom Line rör socialt ansvar och välbefinnande för anställda, samhälle och kunder?",
    options: [
      { text: "Planet.", explain: "Planet avser miljödimensionen." },
      { text: "People.", explain: "Rätt — People är den sociala dimensionen: människors välbefinnande inom och utanför organisationen." },
      { text: "Prosperity.", explain: "Prosperity/Profit är den ekonomiska dimensionen." },
      { text: "Purpose.", explain: "Purpose ingår inte i TBL — en klassisk distraktor." }
    ],
    correct: 1, source: "Rogers & Hudson (2011)", reviewed: true },

  { id: "str-q43", topic: "tbl", difficulty: 1,
    question: "Vad är syftet med Triple Bottom Line som ramverk?",
    options: [
      { text: "Att maximera ekonomisk vinst och börsvärde.", explain: "Det är precis den ensidighet TBL vill bredda." },
      { text: "Att balansera företagets resultat inom socialt ansvar, miljömässig hållbarhet och ekonomisk framgång.", explain: "Rätt — tre 'resultaträkningar' som gör hållbarhet mätbar och synliggör både synergier och målkonflikter." },
      { text: "Att minimera kostnader kopplade till miljö och socialt ansvar.", explain: "TBL handlar om att skapa resultat i alla tre dimensioner, inte om att minimera hållbarhetskostnader." },
      { text: "Att förbättra produktionskvaliteten.", explain: "Kvalitetsarbete är något annat." }
    ],
    correct: 1, source: "Rogers & Hudson (2011)", reviewed: true },

  { id: "str-q44", topic: "tbl", difficulty: 2,
    question: "Vilken åtgärd hör hemma under 'S' i ESG-ramverket?",
    options: [
      { text: "Öka energieffektiviteten i produktionen.", explain: "Miljöåtgärd — hör till E." },
      { text: "Införa en policy för lika löner mellan könen.", explain: "Rätt — jämställdhet, arbetsvillkor och kompetensutveckling är sociala frågor (S)." },
      { text: "Utvärdera styrelsens sammansättning och arbete.", explain: "Bolagsstyrning — hör till G." },
      { text: "Minska koldioxidutsläppen från transporter.", explain: "Miljöåtgärd — hör till E." }
    ],
    correct: 1, source: "ESG / tentatema HT24", reviewed: true },

  { id: "str-q45", topic: "tbl", difficulty: 2,
    question: "Hur definierar Brundtlandrapporten hållbar utveckling?",
    options: [
      { text: "Utveckling som möter dagens behov utan att äventyra kommande generationers möjligheter att möta sina behov.", explain: "Rätt — definitionen betonar globalt ansvar, gränser för (eller omriktning av) tillväxt, social rättvisa och långsiktigt tänkande." },
      { text: "Utveckling som maximerar BNP-tillväxten varje år.", explain: "Ren tillväxtmaximering är snarare det som problematiseras." },
      { text: "Utveckling som helt stoppar användning av naturresurser.", explain: "Rapporten kräver inte nollanvändning utan ansvarsfull hushållning över generationer." },
      { text: "Utveckling som enbart gynnar utvecklingsländer.", explain: "Social rättvisa ingår, men definitionen är generationsövergripande och global." }
    ],
    correct: 0, source: "Rogers & Hudson (2011)", reviewed: true },

  { id: "str-q46", topic: "it", difficulty: 1,
    question: "Vilka fyra områden ska anpassas till varandra enligt Strategic Alignment Model (Henderson & Venkatraman)?",
    options: [
      { text: "Affärsstrategi, IT-strategi, organisationsinfrastruktur och IT-infrastruktur.", explain: "Rätt — med två dimensioner: strategisk passform (strategi ↔ infrastruktur) och funktionell integration (verksamhet ↔ IT)." },
      { text: "Personal, affärsverksamhet, IT-strategi och leveranskedja.", explain: "Personal och leveranskedja är inte modellens domäner." },
      { text: "Produktutveckling, IT-strategi, affärsstrategi och riskhantering.", explain: "Produktutveckling och riskhantering ingår inte som domäner." },
      { text: "IT-strategi, IT-infrastruktur, marknadsföring och ekonomi.", explain: "Marknadsföring och ekonomi är fel — verksamhetssidan representeras av affärsstrategi och organisationsinfrastruktur." }
    ],
    correct: 0, source: "Henderson & Venkatraman / föreläsning", reviewed: true },

  { id: "str-q47", topic: "it", difficulty: 2,
    question: "Vad brukar lyftas fram som lösningen på produktivitetsparadoxen vid införande av ny informationsteknologi?",
    options: [
      { text: "Att investera i ännu mer teknik utan att ändra arbetssätten.", explain: "Det är receptet på att paradoxen består — tekniken utnyttjas inte." },
      { text: "Att omorganisera arbetsflöden och processer så att organisationen faktiskt utnyttjar den nya teknologin.", explain: "Rätt — produktivitetsvinsterna realiseras först när komplementära organisationsförändringar görs (nya processer, roller, kompetens)." },
      { text: "Att bromsa den teknologiska utvecklingen.", explain: "Att avstå teknik löser inte paradoxen — den handlar om hur tekniken används." },
      { text: "Att undvika teknikinvesteringar och bevara status quo.", explain: "Passivitet ger varken produktivitet eller konkurrenskraft." }
    ],
    correct: 1, source: "Föreläsning / tentatema HT24", reviewed: true },

  { id: "str-q48", topic: "it", difficulty: 2,
    question: "Varför ger IT-investeringar i sig sällan långsiktig konkurrensfördel?",
    options: [
      { text: "IT saknar helt betydelse för företags prestationer.", explain: "IT har stor betydelse — men som möjliggörare i kombination med annat." },
      { text: "Tekniken kan köpas och kopieras av konkurrenter; fördelen uppstår först i kombinationen med strategi, processer och kompetens.", explain: "Rätt — alignment plus komplementära, svårimiterade organisatoriska resurser är det som är svårt att kopiera (jfr RBV och Barney)." },
      { text: "IT-system blir alltid omoderna inom ett år.", explain: "Livslängden varierar — och är inte kärnargumentet." },
      { text: "Lagstiftning förbjuder konkurrensfördelar via IT.", explain: "Ingen sådan lag finns." }
    ],
    correct: 1, source: "Henderson & Venkatraman / Barney (2024)", reviewed: true },

  { id: "str-q49", topic: "it", difficulty: 3,
    question: "Varför beskrivs strategic alignment som en kontinuerlig process snarare än ett engångsprojekt?",
    options: [
      { text: "Eftersom modellen kräver årlig omcertifiering.", explain: "Ingen certifiering existerar." },
      { text: "Eftersom både affärsstrategi, teknik och omvärld förändras löpande, måste samspelet mellan domänerna ständigt underhållas.", explain: "Rätt — alignment är ett rörligt mål; ett läge som var i samklang i fjol kan vara i otakt i år, och själva förmågan att kontinuerligt anpassa blir en källa till fördel." },
      { text: "Eftersom IT-avdelningen byts ut varje år.", explain: "Personalomsättning är inte argumentet." },
      { text: "Eftersom modellen bara gäller nystartade företag.", explain: "Modellen gäller alla slags organisationer." }
    ],
    correct: 1, source: "Henderson & Venkatraman / föreläsning", reviewed: true }
];
