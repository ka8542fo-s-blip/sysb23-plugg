// Bokens kapitel 14: Stallings & Brown, IT Security Management and Risk Assessment (s. 786–830).
// Kapitel, ämne, ordlista och frågor; samlas av reading.js, topics.js och
// questions.js via bok/index.js. Skrivet med egna ord på tentans nivå,
// granskat mot boken 22 nov 2026 (ogranskat av Kasper). `notes` är
// källanteckningarna och visas inte.

const variant = (id, what) => ({ variantOf: id, source: `Variant av en tentafråga från förra året (${what})` });

export const chapter = {
  id: "bok14",
  kind: "bok",
  label: "Bokens kapitel 14",
  examArea: "Bokfrågor",
  focus: ["IT Security Management and Risk Assessment", "Security policy in an organisation (14.2)"],
  title: "IT security management och riskbedömning",
  readingMinutes: 11,
  lead: "Hur en organisation går från mål och säkerhetspolicy till en bedömning av sina risker, vilka fyra sätt det finns att göra bedömningen på och vad man kan göra med en risk som är för hög.",
  sources: ["Stallings & Brown kap. 14 (s. 786–830)"],
  body: `
## Kärnan

- **IT security management** besvarar tre frågor: vilka tillgångar ska skyddas, hur hotas de, och vad kan vi göra åt det, till en rimlig kostnad?
- Processen upprepas i en cykel, som ISO 27005 beskriver som **Plan-Do-Check-Act**.
- Den börjar i organisationens **mål, strategier och säkerhetspolicy** och kräver stöd från högsta ledningen.
- Riskbedömningen kan göras på **fyra sätt**: baseline, informal, detailed risk analysis och combined. Combined är mest kostnadseffektivt för de flesta.
- Den detaljerade analysen väger **likelihood** mot **consequence** till en risknivå och samlar resultatet i ett **risk register**.
- En för hög risk kan **behandlas** på fem sätt: acceptance, avoidance, transfer, reduce consequence och reduce likelihood.

## IT security management som process

Bokens definition står i Föreläsning 2 och var svaret på en av förra årets tentafrågor: en formell process som ger organisationens tillgångar *lämpliga* säkerhetsnivåer. Boken lägger till stegen:

1. Bestäm mål, strategier och policyer för IT-säkerheten.
2. Gör en riskbedömning av hoten mot tillgångarna.
3. Välj kontroller som skyddar kostnadseffektivt.
4. Skriv planer och rutiner för att införa dem.
5. Inför kontrollerna, med utbildning och säkerhetsmedvetenhet.
6. Övervaka att kontrollerna fortsätter att fungera.
7. Upptäck och hantera incidenter.

Processen måste **upprepas**, eftersom tekniken och hotbilden ändras snabbt. Det här kapitlet tar de två första stegen; resten finns i kapitlet om säkerhetskontroller, planer och rutiner.

**Standarderna** samlar bästa praxis, och revisorer kräver allt oftare att de följs. ISO har samlat sina i **ISO 27000-serien**, med fler än 40 standarder:

| Standard | Innehåll |
|---|---|
| **ISO/IEC 27000** | översikt och ordlista för serien |
| **ISO/IEC 27001** | kraven på ett **information security management system (ISMS)**: hur det införs, drivs, övervakas och förbättras |
| **ISO/IEC 27002** | en **code of practice** med beprövade säkerhetskontroller (hette tidigare ISO 17799) |
| **ISO/IEC 27005** | riktlinjer för riskhantering inom informationssäkerhet; ersätter delar av den äldre **ISO 13335** |

NIST:s motsvarigheter är bland annat **SP 800-30** om riskbedömning och **SP 800-53** med säkerhetskontroller. ISO 31000 och NIST:s Cybersecurity Framework finns i Föreläsning 2.

## Plan-Do-Check-Act

ISO 31000 betonar att riskhantering upprepas, och ISO 27005 tillämpar det på informationssäkerhet:

| Steg | Vad som görs |
|---|---|
| **Plan** | ta fram policy, mål och rutiner, gör riskbedömningen och planera riskbehandlingen: välj kontroller eller acceptera risken |
| **Do** | genomför planen för riskbehandlingen, alltså inför kontrollerna |
| **Check** | övervaka planen och håll den aktuell |
| **Act** | förbättra processen efter incidenter, granskningar eller förändringar |

Sedan börjar cykeln om.

## Organisationens mål och säkerhetspolicy

| Begrepp | Anger |
|---|---|
| **Security objectives** | vilka resultat IT-säkerheten ska uppnå |
| **Security strategies** | hur målen ska nås |
| **Organizational security policy** | vad som behöver göras: målen, strategierna och processen för att nå dem |

Målen bygger på vilken roll IT spelar i verksamheten: vilka beslut hänger på att data är korrekta och tillgängliga, och vad skulle ett säkerhetsfel kosta?

Policyn är oftast en samling dokument. Den bör bland annat ta upp syfte och omfattning, lagkrav, säkerhetskraven, vem som ansvarar för vad, hur risk hanteras, utbildning, informationsklassning, kontinuitetsplanering, incidenthantering och hur policyn ses över. Listan är bredare än de tre delar Föreläsning 2 tar upp. Att policyn anger mål och ansvar var svaret på en av förra årets tentafrågor.

Policyn behöver högsta ledningens fulla stöd, annars får säkerheten för lite resurser. Det övergripande ansvaret bör ligga på en person, en **organizational IT security officer**. Större organisationer har också **IT project security officers** för viktiga projekt och system.

## Fyra angreppssätt för riskbedömning

Att granska varje tillgång och varje tänkbar risk går inte, och alla risker kan inte tas bort. Resurserna läggs i stället i proportion till vad en risk kan kosta och hur sannolik den är. ISO 13335 beskriver fyra angreppssätt:

| Angreppssätt | Så går det till | Passar för |
|---|---|---|
| **Baseline approach** | en grundnivå av kontroller ur standarder och branschens bästa praxis | små organisationer med små resurser |
| **Informal approach** | experter eller konsulter gör en pragmatisk analys utan formell process | små och medelstora organisationer där IT inte är avgörande |
| **Detailed risk analysis** | en formell, strukturerad analys av tillgångar, hot, sårbarheter och risker | myndigheter och kritisk infrastruktur, där lagen ofta kräver det, och stora organisationer med kritisk IT |
| **Combined approach** | baseline överallt; en översiktlig analys pekar ut de viktigaste systemen, som får en informell och sedan en detaljerad analys | de flesta organisationer |

| Angreppssätt | Fördel | Nackdel |
|---|---|---|
| Baseline | billigt; samma åtgärder fungerar på många system | tar ingen hänsyn till organisationens egen riskexponering; nivån kan bli för hög eller för låg |
| Informal | snabbt och billigt; mer träffsäkert än baseline | risker kan missas, och resultatet färgas av analytikernas åsikter |
| Detailed | grundligast och ger starkast motivering för kostnaderna | kostar mycket tid, resurser och expertis, och skyddet kan dröja |
| Combined | rimligt skydd snabbt, och resurserna hamnar där de behövs | blir den översiktliga analysen fel kan viktiga system vara sårbara ett tag |

**ISO 13335 anser att combined approach är mest kostnadseffektivt för de flesta organisationer.**

**Detailed Risk Approach** i Föreläsning 2 är samma sak som bokens detailed risk analysis. Boken nämner samma standarder för den: ISO 27005, ISO 31000, NIST SP 800-30 och SASN13, som i boken är en handbok om säkerhetsrisker från Standards Australia och Standards New Zealand.

## Den detaljerade riskanalysen

Stegen liknar riskbedömningens fyra steg i Föreläsning 2, men boken börjar med kontexten:

| Steg | Vad som görs |
|---|---|
| 1. **Context and system characterization** | bestäm ramarna och identifiera tillgångarna |
| 2. **Identification of threats and vulnerabilities** | vem eller vad kan skada tillgången, och hur? |
| 3. **Analyze risks** | bestäm likelihood, consequence och risknivå; dokumentera i ett risk register |
| 4. **Evaluate risks** | jämför risknivån med vad organisationen accepterar |
| 5. **Risk treatment** | bestäm vad som ska göras med de för höga riskerna |

**Kontexten.** Organisationens riskexponering, lagkrav och analysens gränser bestäms. Högsta ledningen fastställer organisationens **risk appetite**, den risknivå den ser som acceptabel. En bank vill ofta ha låg risk, medan en tillverkare med en ny produkt kan ta större risker för att vinna försprång.

**Tillgångarna.** En **asset** är allt som har värde för organisationen och behöver skyddas: hårdvara, mjukvara, data, dokumentation och människor. Säkerhetsexperterna intervjuar personalen för att hitta de viktigaste.

**Grundtermerna** (jämför kapitlet om grundbegreppen):

| Term | Betydelse |
|---|---|
| **Threat** | möjligheten att en **threat source** utnyttjar en sårbarhet i en tillgång och skadar ägaren |
| **Vulnerability** | en brist eller svaghet i en tillgångs design, implementation eller drift som ett hot kan utnyttja |
| **Risk** | sannolikheten att ett hot utnyttjar en sårbarhet, kombinerad med hur allvarliga följderna blir |
| **Control** | en åtgärd som gör sårbarheter svårare att utnyttja (se kapitlet om säkerhetskontroller, planer och rutiner) |

En sårbarhet skadar inte i sig: **det är kombinationen av hot och sårbarhet som skapar en risk.** En threat source kan vara naturlig, som brand eller översvämning (se kapitlet om fysisk säkerhet och infrastruktur), eller mänsklig, och avsiktlig eller oavsiktlig.

## Likelihood, consequence och risknivå

Helst skulle risk räknas som sannolikhet × kostnad, men exakta värden går sällan att få fram, särskilt för immateriella tillgångar. Därför används **kvalitativa skalor**, och målet blir att rangordna riskerna. Hänsyn tas till de kontroller som redan finns.

| | **Likelihood** | **Consequence** |
|---|---|---|
| Anger | hur sannolikt det är att hotet inträffar och skadar | hur hårt organisationen drabbas om det inträffar |
| Skala | Rare, Unlikely, Possible, Likely, Almost Certain | Insignificant, Minor, Moderate, Major, Catastrophic, Doomsday |
| Bedöms av | den som gör riskanalysen (risk analyst) | tillgångarnas ägare och ledningen |

- **Consequence är oberoende av likelihood.** Ett sällsynt hot med allvarliga följder är ändå en risk.
- Följden gäller **hela organisationen**, inte bara systemet. En server som brinner är en småsak om data finns på annat håll, men en katastrof om den hade de enda kopiorna.
- Konsekvensskalan är densamma som i Föreläsning 2, och mer detaljerad än FIPS 199:s tre nivåer i kapitlet om grundbegreppen.

**Level of risk.** En tabell kombinerar de två till **Extreme, High, Medium eller Low**. Extreme kräver ledning på direktörsnivå, High ledningens uppmärksamhet, Medium befintliga rutiner för övervakning och Low bara vanliga rutiner. Rare med följden Doomsday ger Extreme; Almost Certain med följden Insignificant ger High.

**Risk register.** Resultatet samlas i ett **risk register**, en rad per risk: tillgång, hot och sårbarhet, befintliga kontroller, likelihood, consequence, level of risk och prioritet, med de högsta riskerna först.

## Bedöma och behandla riskerna

Risker under den nivå organisationen accepterar godtas utan åtgärd; de över den ska behandlas. Prioriteten är mer än risknivån: ofta tas det billiga och snabba först. Låg risk och dyr åtgärd lönar sig sällan, hög risk och billig åtgärd ska göras, och däremellan avgör ett affärsbeslut.

| Alternativ | Innebär |
|---|---|
| **Risk acceptance** | ledningen godtar en högre risk än vanligt, oftast för att åtgärden kostar för mycket, och tar ansvaret om den inträffar |
| **Risk avoidance** | organisationen avstår från verksamheten eller systemet som skapar risken |
| **Risk transfer** | ansvaret delas med en tredje part, genom försäkring, avtal eller partnerskap |
| **Reduce consequence** | skadan blir mindre och återhämtningen snabb: backup på annan plats, disaster recovery plan, data på flera platser |
| **Reduce likelihood** | sårbarheten blir svårare att utnyttja: brandväggar, access tokens, regler för lösenord |

För de två sista väljs kontroller; hur det går till, och vad residual risk är, står i kapitlet om säkerhetskontroller, planer och rutiner. Blanda inte ihop alternativen med countermeasure matrix i Föreläsning 2 (deterrence, prevention, detection, remedies).

## Exemplet Silver Star Mines

Bokens påhittade gruvföretag har kopplat sina styrsystem för gruvdriften (SCADA) till intranätet.

- Företaget valde **combined approach**: baselines överallt och en formell bedömning av de viktigaste systemen.
- SCADA-nätet fick Rare och Major, alltså High. De lagrade data fick Possible och Major, alltså Extreme.
- Ändå satte ledningen SCADA först, eftersom en attack kunde kosta liv. **Prioriteten är ledningens beslut.**
- Risken för e-posten delades med moderbolagets IT-grupp, som sköter e-postgatewayen.
`,
};

export const topic = {
  id: "bok14-riskhantering",
  name: "IT security management och riskbedömning",
  chapter: "bok14",
  examWeight: "hög",
  summary: "IT security management är en cyklisk process (Plan-Do-Check-Act) som utgår från organisationens mål och säkerhetspolicy. Riskerna bedöms med ett av fyra angreppssätt, där combined är mest kostnadseffektivt för de flesta. Den detaljerade analysen väger likelihood mot consequence till en risknivå i ett risk register, och för höga risker behandlas på ett av fem sätt.",
  keyPoints: [
    "IT security management: en cyklisk process som avgör vilka tillgångar som ska skyddas, hur de hotas och vad som kan göras åt det.",
    "Plan-Do-Check-Act: planera, genomföra riskbehandlingen, övervaka och förbättra, sedan om igen.",
    "ISO 27000-serien: 27001 anger kraven på ett ISMS, 27002 är en code of practice med kontroller, 27005 gäller riskhantering.",
    "Objectives, strategies och policy: vad som ska uppnås, hur det ska nås och vad som ska göras.",
    "Fyra angreppssätt: baseline, informal, detailed risk analysis och combined; combined är mest kostnadseffektivt för de flesta (ISO 13335).",
    "Detaljerad riskanalys: kontext och tillgångar, hot och sårbarheter, analys av risken, bedömning och behandling.",
    "Likelihood och consequence: fem steg från Rare till Almost Certain och sex från Insignificant till Doomsday ger risknivån Extreme, High, Medium eller Low.",
    "Risk register: tillgång, hot och sårbarhet, befintliga kontroller, likelihood, consequence, risknivå och prioritet.",
    "Riskbehandling: acceptance, avoidance, transfer, reduce consequence och reduce likelihood.",
  ],
  pitfalls: [
    "Detailed Risk Approach (Föreläsning 2) och detailed risk analysis (boken) är samma sak, men det angreppssätt som rekommenderas för de flesta är combined.",
    "Likelihood bedöms av den som gör riskanalysen; consequence av tillgångarnas ägare och ledningen.",
    "Backup och disaster recovery plan minskar följderna (reduce consequence); brandväggar och lösenordsregler minskar sannolikheten (reduce likelihood).",
    "Försäkring är risk transfer, inte risk acceptance; att avstå från systemet helt är risk avoidance.",
    "Riskbehandlingens fem alternativ är inte countermeasure matrix (deterrence, prevention, detection, remedies).",
  ],
};

export const glossary = [
  { term: "Asset", definition: "Allt som har värde för organisationen och behöver skyddas: hårdvara, mjukvara, data, dokumentation och de människor som sköter systemen.", chapter: "bok14" },
  { term: "Threat", definition: "Möjligheten att en threat source utnyttjar en sårbarhet i en tillgång och därmed skadar ägaren.", chapter: "bok14" },
  { term: "Threat source", definition: "Det som kan orsaka ett hot. Kan vara naturligt, som brand och översvämning, eller mänskligt, och avsiktligt eller oavsiktligt.", chapter: "bok14" },
  { term: "Vulnerability", definition: "En brist eller svaghet i en tillgångs design, implementation eller drift som ett hot kan utnyttja. Ger ingen skada utan ett hot.", chapter: "bok14" },
  { term: "Risk", definition: "Den möjliga förlusten: sannolikheten att ett hot utnyttjar en sårbarhet, kombinerad med hur allvarliga följderna blir.", chapter: "bok14" },
  { term: "Likelihood", definition: "Hur sannolikt det är att ett hot inträffar och orsakar skada, med hänsyn till befintliga kontroller. Bedöms av den som gör riskanalysen, från Rare till Almost Certain.", chapter: "bok14" },
  { term: "Consequence", definition: "Hur hårt hela organisationen drabbas om ett hot inträffar, oberoende av hur sannolikt det är. Bedöms av tillgångarnas ägare och ledningen, från Insignificant till Doomsday.", chapter: "bok14" },
  { term: "Level of risk", definition: "Risknivån som fås när likelihood och consequence kombineras i en tabell: Extreme, High, Medium eller Low.", chapter: "bok14" },
  { term: "Risk appetite", definition: "Den risknivå organisationen ser som acceptabel. Bestäms av högsta ledningen när kontexten för riskbedömningen fastställs.", chapter: "bok14" },
  { term: "Risk register", definition: "Tabell som dokumenterar riskanalysen: tillgång, hot och sårbarhet, befintliga kontroller, likelihood, consequence, risknivå och prioritet, med de högsta riskerna först.", chapter: "bok14" },
];

const T = "bok14-riskhantering";

export const questions = [
  { id: "sak-bok14-01", topic: T, difficulty: 1,
    question: "According to ISO 13335, which risk assessment approach is the most cost-effective for most organizations?",
    options: [
      { text: "Baseline approach", explain: "Baseline ger en grundnivå av kontroller till låg kostnad, men tar ingen hänsyn till organisationens egen riskexponering. Den passar små organisationer med små resurser." },
      { text: "Informal approach", explain: "Den informella analysen går snabbt och billigt, men risker kan missas och resultatet färgas av analytikernas åsikter." },
      { text: "Detailed risk analysis", explain: "Den detaljerade analysen (Detailed Risk Approach i Föreläsning 2) är grundligast men också dyrast, och skyddet kan dröja." },
      { text: "Combined approach", explain: "Baseline på alla system först, sedan djupare analys av de viktigaste. ISO 13335 anser att det är mest kostnadseffektivt för de flesta." },
    ],
    correct: 3, source: "Bokens kapitel 14 (de fyra angreppssätten)", reviewed: false },

  { id: "sak-bok14-02", topic: T, difficulty: 2,
    question: "What is the major disadvantage of the baseline approach to risk assessment?",
    options: [
      { text: "It takes a lot of time, resources and expertise", explain: "Det är nackdelen med detailed risk analysis, som dessutom kan fördröja skyddet." },
      { text: "It ignores the organization's own risk exposure", explain: "Baseline inför samma grundnivå överallt, utan hänsyn till organisationens egen riskexponering. Nivån kan också bli för hög eller för låg." },
      { text: "Its results may be skewed by the analysts' views", explain: "Det är en nackdel med informal approach, där ingen formell process styr analysen." },
      { text: "Key systems stay exposed if the first analysis is wrong", explain: "Det är nackdelen med combined approach, om den översiktliga riskanalysen pekar ut fel system." },
    ],
    correct: 1, source: "Bokens kapitel 14 (baseline approach)", reviewed: false },

  { id: "sak-bok14-03", topic: T, difficulty: 2,
    question: "Which of these is an example of the risk treatment alternative \"reduce consequence\"?",
    options: [
      { text: "Taking out insurance against a data breach", explain: "Försäkring är risk transfer: ansvaret för risken delas med en tredje part." },
      { text: "Deploying firewalls and stricter password rules", explain: "Brandväggar och lösenordsregler gör sårbarheten svårare att utnyttja. Det är reduce likelihood." },
      { text: "Replicating data and backups at another site", explain: "Backup och data på flera platser gör skadan mindre och återhämtningen snabb om risken inträffar." },
      { text: "Dropping the system that creates the risk", explain: "Att avstå från systemet som skapar risken är risk avoidance." },
    ],
    correct: 2, source: "Bokens kapitel 14 (riskbehandling)", reviewed: false },

  { id: "sak-bok14-04", topic: T, difficulty: 2,
    question: "In the Plan-Do-Check-Act model for information security risk management, what happens in the Do step?",
    options: [
      { text: "The risk treatment plan is implemented", explain: "Do är att genomföra planen för riskbehandlingen, alltså att införa de valda kontrollerna." },
      { text: "The risk treatment plan is monitored", explain: "Att övervaka planen och hålla den aktuell är Check." },
      { text: "The risk assessment is carried out", explain: "Riskbedömningen hör till Plan, tillsammans med policy, mål och planeringen av riskbehandlingen." },
      { text: "The process is improved after incidents", explain: "Att förbättra processen efter incidenter, granskningar eller förändringar är Act." },
    ],
    correct: 0, source: "Bokens kapitel 14 (Plan-Do-Check-Act)", reviewed: false },

  { id: "sak-bok14-05", topic: T, difficulty: 3,
    question: "In a detailed risk analysis, who should decide how severe the consequence of a threat would be?",
    options: [
      { text: "The risk analyst doing the analysis", explain: "Den som gör riskanalysen bedömer likelihood. Consequence ska bygga på ägarnas och ledningens bedömning, inte analytikerns." },
      { text: "The external auditors of the process", explain: "Revisorer kräver att standarderna följs, men boken ger dem ingen roll i att bedöma följderna." },
      { text: "The IT project security officer", explain: "En IT project security officer ansvarar för säkerheten i ett visst projekt eller system. Följderna gäller hela organisationen." },
      { text: "The asset owners and management", explain: "Följden gäller hela organisationen, så den ska bygga på bedömningen hos tillgångarnas ägare och ledningen." },
    ],
    correct: 3, source: "Bokens kapitel 14 (likelihood och consequence)", reviewed: false },

  { id: "sak-bok14-06", topic: T, difficulty: 2,
    question: "Which standard in the ISO 27000 series specifies the requirements for an information security management system (ISMS)?",
    options: [
      { text: "ISO/IEC 27002", explain: "ISO/IEC 27002 är en code of practice med beprövade säkerhetskontroller. Den hette tidigare ISO 17799." },
      { text: "ISO/IEC 27005", explain: "ISO/IEC 27005 ger riktlinjer för riskhantering inom informationssäkerhet (se Föreläsning 2)." },
      { text: "ISO/IEC 27001", explain: "ISO/IEC 27001 anger kraven för att införa, driva, övervaka och förbättra ett ISMS." },
      { text: "ISO/IEC 27000", explain: "ISO/IEC 27000 ger en översikt och ordlistan för hela serien." },
    ],
    correct: 2, source: "Bokens kapitel 14 (ISO 27000-serien)", reviewed: false },

  { id: "sak-bok14-07", topic: T, difficulty: 1,
    question: "How does the book define risk in a security risk assessment?",
    options: [
      { text: "How likely a threat exploits a weakness, combined with the harm", explain: "Risk kombinerar sannolikheten att ett hot utnyttjar en sårbarhet med hur allvarliga följderna blir för ägaren." },
      { text: "A weakness in an asset's design or operation that can be exploited", explain: "Det är en vulnerability. Den ger ingen skada i sig, utan först tillsammans med ett hot." },
      { text: "The potential for a threat source to exploit a weakness in an asset", explain: "Det är en threat. Risken väger dessutom in hur sannolikt det är och hur allvarliga följderna blir." },
      { text: "A system resource of value to its owner that requires protection", explain: "Det är en asset, det som riskbedömningen ska skydda." },
    ],
    correct: 0, source: "Bokens kapitel 14 (asset, threat, vulnerability, risk)", reviewed: false },

  { id: "sak-bok14-08", topic: T, difficulty: 1,
    question: "What is an organization's risk appetite?",
    options: [
      { text: "How likely it is that a threat occurs and causes harm", explain: "Det är likelihood, som bedöms på en skala från Rare till Almost Certain." },
      { text: "The level of risk that the organization sees as acceptable", explain: "Högsta ledningen bestämmer den när kontexten fastställs. En bank vill ofta ha låg risk, en tillverkare med en ny produkt kan ta större." },
      { text: "The list of identified risks, sorted with the highest first", explain: "Det är ett risk register, där resultatet av riskanalysen dokumenteras." },
      { text: "How hard the organization is hit if a threat occurs", explain: "Det är consequence, som tillgångarnas ägare och ledningen bedömer." },
    ],
    correct: 1, source: "Bokens kapitel 14 (risk appetite)", reviewed: false },
  { id: "sak-bok14-09", topic: "bok14-riskhantering", difficulty: 2,
    question: "How do security objectives, security strategies and the organizational security policy differ in the book?",
    options: [
      { text: "Objectives: what to achieve; strategies: how; policy: what must be done", explain: "Målen anger vilka resultat IT-säkerheten ska uppnå, strategierna hur de ska nås, och policyn vad som behöver göras för att nå dem." },
      { text: "Objectives: who is responsible; strategies: when; policy: the budget", explain: "Ansvar och tidpunkter hör till policyn och säkerhetsplanen; målen anger resultaten." },
      { text: "Objectives: the risk levels; strategies: controls; policy: the risk register", explain: "Risknivåer och risk register hör till riskanalysen, som kommer efter målen och policyn." },
      { text: "Objectives come from ISO 27001, strategies and policy from the law", explain: "Målen bygger på IT:s roll i den egna verksamheten. Lagkrav är en av sakerna policyn tar upp." },
    ],
    correct: 0, source: "Bokens kapitel 14 (organisationens mål och säkerhetspolicy)", reviewed: false },

  { id: "sak-bok14-10", topic: "bok14-riskhantering", difficulty: 1,
    question: "Why does the book stress that the IT security policy needs full support from senior management?",
    options: [
      { text: "Because only managers may read the policy documents", explain: "Policyn ska tvärtom vara känd i organisationen, och de anställda ska följa den." },
      { text: "Because the law requires the chief executive to write it", explain: "Boken säger inget om att lagen kräver det; ansvaret läggs ofta på en IT security officer." },
      { text: "Without it, the security objectives are unlikely to be met", explain: "Erfarenheten är att säkerheten annars inte prioriteras och får för lite resurser. Med ledningens stöd tas den på allvar." },
      { text: "Because management must assess the likelihood of every threat", explain: "Likelihood bedöms av den som gör riskanalysen. Ledningen och tillgångarnas ägare bedömer consequence." },
    ],
    correct: 2, source: "Bokens kapitel 14 (ledningens stöd)", reviewed: false },
];

export const notes = `Byggt på kap. 14 i del2-filen, s. 786–830 (markeringarna "Page N of 1641", rad 7717–9074): inledningen med de tre grundfrågorna (s. 786–787), 14.1 med ISO 27000-tabellen, NIST-standarderna, definitionen och processens sju steg (s. 788–791), Plan-Do-Check-Act (s. 792), 14.2 om objectives, strategies, policy, policyns ämnen, ledningens stöd och IT security officer (s. 793–796), 14.3 om de fyra angreppssätten (s. 797–802), 14.4 om den detaljerade analysen med definitionerna, threat sources, likelihood- och consequence-tabellerna, risknivåtabellen, risk register, evaluate och de fem behandlingsalternativen (s. 803–819), 14.5 Silver Star Mines kort (s. 820–825), Key Terms och Review Questions 14.1–14.16 (s. 827–828), som styrde urvalet. SASN13 enligt bokens referenslista (del3, "HB 98:2013—Security Risk Management", Standards Australia och Standards New Zealand).

Hänvisningar: Föreläsning 2 (definitionen av IT security management, säkerhetspolicyns tre delar, ISO 27005/31000, NIST CSF, konsekvensskalan, countermeasure matrix, Detailed Risk Approach), kapitlet om grundbegreppen (asset/threat/vulnerability, FIPS 199), "Säkerhetskontroller, planer och rutiner" (steg 3–7 i processen, control, residual risk) och "Fysisk säkerhet och infrastruktur" (naturliga hot). bok15.js hänvisar redan hit med titeln "IT security management och riskbedömning", så titeln bör inte ändras.

Osäkert:
- Plan-Do-Check-Act: textfilen har bara rubriken "Figure 14.2 The Plan-Do-Check-Act Process Model" och meningen "comprises the following steps:"; själva stegen (fotnot 68, efter ISO 27005 och ISO 31000) saknas i extraktet. Tabellen återger bokens lista ur minnet: Plan = policy, mål, processer och rutiner, riskbedömning, riskbehandlingsplan med val av kontroller eller acceptans; Do = genomföra riskbehandlingsplanen; Check = övervaka och underhålla planen; Act = förbättra processen efter incidenter, granskning eller förändringar. Kap. 15 (s. 849) bekräftar att införandet av kontrollerna är "the do stage". Kontrollera mot tryckt sida 792; fråga sak-bok14-04 bygger på det. Granskningen 22 nov: stegen gick inte heller att hitta i del3-filens slutnoter; frågan frågar bara efter Do, som kap. 15 bekräftar, och de övriga stegens distraktorer följer den vanliga ISO 27005-indelningen.
- "ersätter delar av den äldre ISO 13335": boken säger att 27005 "supersedes ISO13335-3/4".
- Riskmatrisen (Table 14.4) återges bara med två exempel (Rare+Doomsday = E, Almost Certain+Insignificant = H), kontrollerade mot tabellen. Hela matrisen är utelämnad.
- Konsekvensskalan: Föreläsning 2:s sex steg stämmer med bokens Table 14.3 (Major i boken "4–8 weeks", i föreläsningen "upp till två månader"). Kapitlet säger bara att skalan är densamma och upprepar inga tider.
- Silver Star Mines: boken säger att e-postrisken "is shared with that group" (moderbolagets IT-grupp). Kapitlet skriver "delades med" och kallar det inte uttryckligen risk transfer, även om definitionen (dela ansvaret med en tredje part) ligger nära.
- Jämförelsen med Föreläsning 2:s fyra steg är en pedagogisk parallell ("liknar"), inget påstående om var föreläsningen hämtat dem. Om SASN13 sägs bara vad den är i boken.

Medvetet utelämnat: övriga 27000-standarder (27003, 27004, 27006, 27017, 27033–27035), NIST SP 800-18 och 2018 års ramverk, de flesta frågorna om IT:s roll, flera av policyns ämnen (personalfrågor, sanktioner, säkerhet i systemutveckling och upphandling), andra betydelser av "security policy" (RFC 2196, regler för enskilda system, formella modeller i trusted computing), IT security officers uppgiftslista, Yellow Book och Risk Index, IDC-spektrumet över branschers risk och NIST:s SCADA-branschlista, kriterier och intressenter i kontexten, likelihood-skalans utförliga beskrivningar, bedömningen av mänskliga angripare (motivation, capability, resources, probability of attack, deterrence), Figure 14.5 (bara återgiven i en mening), routerexemplet, Silver Star-registrets alla rader och Problems.

Ordlistan: 10 termer, alla ur Key Terms, kontrollerade mot den aktuella ordlistan (inga dubbletter). "Control" är utelämnad eftersom "Security control (safeguard, countermeasure)" redan finns (bok15); den förklaras kort i löptexten med hänvisning dit. IT security management, organizational security policy och risk assessment finns redan (Föreläsning 2). Detailed risk analysis är medvetet inte ordlisteterm (Detailed Risk Approach finns). Asset, threat, vulnerability och risk står i bok1:s tabell men inte i dess ordlista; bok1:s notes lämnar "risk" åt sitt kapitel. Angreppssätten (baseline, informal, combined approach) och behandlingsalternativen är inte Key Terms men skulle passa i ordlistan om ni vill.

Frågor: 8 st, inga varianter (sak-25 och sak-07 har sina varianter i Föreläsning 2). 01–02 gäller angreppssätten, 03 riskbehandlingen, 04 Plan-Do-Check-Act, 05 vem som bedömer consequence, 06 ISO 27001, 07 definitionen av risk, 08 risk appetite. Rätt position 2/2/2/2, ingen fråga där rätt svar är ensamt längst.`;
