// Kompendiet (löptext) och ordlistan för delkursen Processorienterad
// verksamhetsutveckling (BPM).
//
// Ansvarsfördelning som för Strategi: löptexten ägs HÄR, de korta punkterna
// ägs av topics.js. Kapitelavslutet renderas ur `primaryTopics`.
//
// Källäget (2026-09-29): Weavers föreläsningar F1–F3, Björns BPMN-genomgång
// och övningshäfte, de fyra artiklarna och HT24/HT25-tentorna. Jeston (2022)
// och Silver (2017) finns inte tillgängliga; allt som sägs om dem kommer från
// föreläsningarna eller tentafrågorna och anges i `sources`. Kapitel som
// bygger på tentafrågor snarare än föreläsning är märkta "preliminärt" i
// `sources` och skrivs om efter F4 (5 okt) och F5 (12 okt). Ingen markering
// i UI.
//
// Kapitelschema: { id, number, title, lead, readingMinutes, sources, body }

export const CHAPTER_TOPICS = {
  kap1: { topics: ["grunder"], primaryTopics: ["grunder"] },
  kap2: { topics: ["historia"], primaryTopics: ["historia"] },
  kap3: { topics: ["start"], primaryTopics: ["start"] },
  kap4: { topics: ["automatisera", "perspektiv"], primaryTopics: ["automatisera", "perspektiv"] },
  kap5: { topics: ["ramverk"], primaryTopics: ["ramverk"] },
  kap6: { topics: ["foundations", "enablement"], primaryTopics: ["foundations", "enablement"] },
  kap7: { topics: ["launch", "understand"], primaryTopics: ["launch", "understand"] },
  kap8: { topics: ["fullfoljd", "manniskor", "ramverk"], primaryTopics: ["fullfoljd", "manniskor"] },
  kap9: { topics: ["framtid", "historia"], primaryTopics: ["framtid"] },
  kap10: { topics: ["bpmn"], primaryTopics: ["bpmn"] },
  kap11: { topics: ["handelser", "bpmn"], primaryTopics: ["handelser"] },
};

export const CHAPTER_ORDER = Object.keys(CHAPTER_TOPICS);

export const intro = "Den här delkursen handlar om hur en organisation styr och förbättrar sina processer — och om hur man ritar och läser dem i BPMN. Tentan har två delar som kräver olika sorters läsning: BPM-delen (Jestons 7FE-ramverk, historiken och artiklarna) prövas med scenariofrågor och essäer, BPMN-delen med att köra diagram. Kompendiet följer den ordningen. Räkna med ungefär {lästid} för hela texten. Termerna står på engelska, eftersom tentan och litteraturen använder dem.";

export const examNote = {
  text: "Salstenta 13 november i Inspera, inga hjälpmedel. Weaver har angett 2–3 essäer och 10–15 flervalsfrågor; den sannolika formen är HT25:s: två essäer à 15 p, tio BPM-flervalsfrågor à 5 p och fyra BPMN-frågor à 3–7 p. Fel svar ger −1, blankt 0.",
  source: "HT25-tentorna",
};

const rawChapters = [
  {
    id: "kap1",
    number: 1,
    title: "BPM: vad det är och inte är",
    readingMinutes: 9,
    lead: "Hur tentan ser ut, vad Jeston menar med BPM, vad BPM inte är, livscykeln och hur BPM förhåller sig till Enterprise Architecture.",
    sources: ["F1 (Weaver 22 sep 2026)", "F2 (sammanfattning)", "Tentor HT25 ord 21 nov 2025 och omtenta 9 jan 2026"],
    body: `
## Så ser tentan ut

Tentan är en salstenta i Inspera på 3 hp, **13 november**, utan hjälpmedel. Omtentan är 7 januari. Weaver har sagt att tentan har "ett fåtal (2–3) kortare essäfrågor, inte om BPMN" och "ett antal flervalsfrågor (10–15)" som inkluderar BPMN. Den sannolika formen är därför HT25:s, som båda HT25-tentorna hade exakt:

| Del | Innehåll | Poäng |
|---|---|---|
| Essä | 2 frågor à 15 p, högst 300 ord var, inga minuspoäng | 30 |
| Flerval BPM | 10 frågor à 5 p, fyra alternativ | 50 |
| Flerval BPMN | 4 frågor à 3–7 p, fyra till sex alternativ | 20 |

Betygsgränserna är A 85, B 75, C 65, D 55 och E 50 procent. Rätt svar ger frågans poäng, **fel svar ger −1** och obesvarad fråga 0.

Essäfrågorna handlar aldrig om BPMN. De börjar alltid med Jeston (2022) — "Jeston (2022) framhåller …", "menar att …" eller "Enligt Jeston …" — och ber dig förklara och diskutera en av hans principer. BPM-flervalsfrågorna är en blandning av begreppsfrågor och scenarier, där en organisation beskrivs och du ska avgöra vad Jeston rekommenderar eller vilket begrepp det gäller. På HT25 var 7 av 20 scenarier. BPMN-frågorna går till största delen ut på att **köra ett diagram**: vilka aktiviteter körs, och när är processen klar? Enligt Weaver finns alla frågor i HT25-exempeltentan i övningsquizzarna BPM och BPMN på Canvas.

### När lönar det sig att gissa?

Med −1 för fel beror det på hur många alternativ det finns. Väntevärdet av en ren gissning är sannolikheten att ha rätt gånger poängen, minus sannolikheten att ha fel. Det blir positivt bara när **poängen är minst lika stor som antalet alternativ**.

| Fråga | Väntevärde vid ren gissning |
|---|---|
| BPM-fråga, 5 p och fyra alternativ | +0,5 |
| BPMN-fråga, 6 p och fem alternativ | +0,4 |
| BPMN-fråga, 7 p och sex alternativ | +0,33 |
| BPMN-fråga, 5 p och sex alternativ | 0 |
| BPMN-fråga, 3 p och fyra alternativ | 0 |
| BPMN-fråga, 4 p och sex alternativ | −0,17 |

Regeln blir alltså: **svara alltid på BPM-frågorna.** På BPMN-frågorna lönar det sig när poängen är minst lika stor som antalet alternativ. Kan du stryka ett enda alternativ lönar det sig nästan alltid.

På HT25-tentorna var rätt svar det ensamt längsta alternativet i 14 av 20 BPM-frågor. Det är bara ett sätt att välja när du ändå ska gissa, inte en strategi: i sex av frågorna var det fel.

## Vad BPM är

Jeston (2022) definierar Business Process Management som **implementation, execution och governance av processer**. Definitionen är lika viktig för vad den utesluter som för vad den säger. BPM är inte en mjukvarusvit eller annan teknik. Det är inte heller bara modellering av processer. Leverantörerna marknadsför BPM som programvara, men för Jeston är BPM en managementdisciplin: att förbättra och styra verksamhetens processer så att organisationen når sina mål. BPM är ett helhetstänkande som också omfattar människorna och förändringsledningen, inte bara processerna.

Det akademiska perspektivet beskriver samma sak som en **BPM lifecycle**:

- **Process identification:** processarkitektur och val av process.
- **Process modelling:** i BPMN.
- **Process discovery:** hur processen ser ut i dag, as-is.
- **Process analysis:** var den brister, gapet mellan nuläge och målbild.
- **Process redesign:** hur den bör se ut, to-be.
- **Process implementation:** till exempel som körbar modell i ett BPMS.
- **Process monitoring:** uppföljning, och sedan börjar varvet om.

Livscykeln är akademins beskrivning. Jestons eget ramverk, 7FE, kommer i kapitel 5.

## Svenska termer

På svenska finns flera ord för samma sak, vilket gör det lätt att bli förvirrad:

- **BPM:** affärsprocesshantering, men också verksamhetsprocesshantering, processledning, processförvaltning och processutveckling.
- **BPA** (Business Process Automation): processautomation.
- **RPA** (Robotic Process Automation): (robotiserad) processautomatisering, ibland programvarurobotar eller digitala medarbetare.

Automationen är alltså ett verktyg inom BPM, inte samma sak.

## BPM och Enterprise Architecture

BPM och **Enterprise Architecture (EA)** har gemensamma mål: att genomföra strategin, linjera IT med strategin och öka konkurrensfördelen. Men de har olika roller. **EA är den övergripande ritningen** för hur organisationen ska realisera sin strategi. Den definierar de viktigaste värdeskapande processerna och förmågorna, och regler och principer för verksamheten.

**BPM är ett operativt lager i EA:**
- Processerna kopplar strategin till IT-arkitekturen.
- BPM säkerställer styrning och prestationsuppföljning av processerna.
- BPM står för den ständiga förbättringen.
- BPM kan ha en processmotor (BPMS) som kör processerna.

Tänk på tre lager: strategin överst, verksamheten i mitten och applikationer och infrastruktur underst. BPM arbetar i mittenlagret och binder ihop de andra två.

## Jeston avmystifierar BPM

Jeston ställer upp vanliga föreställningar om BPM mot verkligheten:

| Föreställning | Verklighet |
|---|---|
| BPM är bättre än tidigare sätt att förbättra processer | BPM är moget och välkänt, men lyckas bara med ledningens och medarbetarnas stöd |
| BPM bygger på viss teknik och mjukvara | Det finns bra tekniskt stöd, men framgången hänger inte på en viss produkt |
| BPM har en robust metodik | Det finns bara ett fåtal beprövade metoder. Hitta inte på en egen |
| BPM är enkelt | Det är komplext. Det är bättre att börja smått och bygga ut än att satsa allt på en gång |
| BPM kräver externa konsulter | Det beror på organisationens kompetens och mognad. Konsulter kan hjälpa mycket |

## Normativ litteratur och forskning

Weaver skiljer mellan två sorters text i kursen. Jeston är **normativ managementlitteratur**. Den bedöms efter om den fungerar i praktiken, ger chefer tumregler för att agera och är föreskrivande: modeller, steg och "best practices". Artiklarna är **forskning**. De bedöms efter om påståendena har systematiskt stöd, och är beskrivande och analyserande. Jeston ska läsas med kritisk blick: under vilka förutsättningar gäller rådet, och vad hände med fallen han beskriver? Det skadar inte att visa den blicken i en essä.
`,
  },
  {
    id: "kap2",
    number: 2,
    title: "Hur BPM växte fram",
    readingMinutes: 10,
    lead: "Från Taylor och kvalitetsrörelsen via BPR och workflowforskningen till BPMS, RPA och agentisk AI — och varför BPR gick för långt.",
    sources: ["F1 (Weaver 22 sep 2026)", "Hammer (1990) s. 104–112", "Reijers (2021) s. 4", "Rosemann et al. (2024) s. 420–421", "Tenta HT25 ord 2(b), omtenta 8", "HT24 fråga 10 (CPI), 13 (Lean)"],
    body: `
BPM är inte en uppfinning utan ett resultat av flera strömningar som möttes kring år 2000. Tentan prövar framför allt två saker härifrån: **varför BPR misslyckades** och **varför RPA inte skalade**. Resten är bakgrund som gör de två begripliga.

## Processtänkande och kvalitet

Processtänkandet går tillbaka till **Taylors scientific management** (1880–1920): arbetet delas upp och effektiviseras steg för steg. Från mitten av 80-talet kom kvalitetsrörelsen. **Total Quality Management (TQM)** och **Six Sigma** arbetade med statistisk processkontroll och fokus på fel. Six Sigma betyder 3,4 fel per miljon möjligheter. **Lean** (och kaizen och just-in-time) handlar om att eliminera slöseri. Gemensamt för alla är att de förbättrar **inkrementellt**, steg för steg. Den hållningen kallas continuous process improvement (CPI).

## Produktivitetsparadoxen

Under 70- och 80-talen investerade företag stort i IT utan att produktiviteten ökade. Robert Solow sammanfattade det 1987: datoråldern syns överallt utom i produktivitetsstatistiken. På 90-talet började IT ses som en **strategisk resurs** för konkurrenskraft, och en rad managementtrender skulle lösa paradoxen: ERP, CRM, supply chain management, kunskapsstyrning, outsourcing, TQM, Lean och Six Sigma, och **Business Process Reengineering**. I samma anda kopplades processerna till strategiteorin: Porters värdekedja, resursbaserad syn och dynamiska förmågor. BPM blev ett sätt att nå uthållig konkurrensfördel genom bättre linjering.

## BPR: "Don't automate, obliterate"

Michael Hammer skrev 1990 i Harvard Business Review att IT-satsningarna gett så lite eftersom företagen **automatiserade gamla arbetssätt** i stället för att ändra dem. Hans bild är att man asfalterar kostigarna. I stället skulle man använda modern IT för att **radikalt göra om** processerna och nå dramatiska förbättringar. Det är ett allt-eller-inget-projekt som inte kan göras i små försiktiga steg.

Hammers eget paradexempel är Fords leverantörsreskontra. Över 500 personer stämde av inköpsorder, följesedlar och fakturor, medan Mazda klarade samma arbete med fem. Ford slutade betala när fakturan kom och började betala när **varorna** kom, mot en gemensam databas. Resultatet blev 75 procent färre anställda i funktionen. Mutual Benefit Life ersatte upp till 30 steg och 19 personer med en ansvarig handläggare med datorstöd. Principerna Hammer formulerar är bland annat:

- Organisera kring resultat, inte uppgifter.
- Låt den som använder resultatet utföra processen.
- Lägg beslutet där arbetet görs.
- Fånga informationen en gång, vid källan.

**Varför BPR gick för långt.** Weaver ställer BPR:s goda och dåliga sidor mot varandra:

| BPR:s bidrag | BPR:s problem |
|---|---|
| Visade att gamla arbetssätt måste tänkas om i grunden | Radikal top-down-strategi: komplexa, dyra och riskfyllda projekt |
| Första managementtrenden som gällde icke-produktionsprocesser som order och kundtjänst | Tidiga framgångshistorier blev långsiktiga misslyckanden |
| Satte IT och människor i centrum och enade fragmenterade processer | Användes av chefer som ursäkt för nedskärningar och outsourcing i stället för att ge medarbetarna mer ansvar |
| Ville bryta silos och hierarkier | Tog ingen hänsyn till medarbetarnas acceptans och mötte starkt motstånd, också från IT-avdelningarna |

Kort sagt: BPR var **för radikalt, för dyrt och mötte för mycket motstånd**. BPM tar med sig idén om processerna som helhet, men arbetar stegvis, med människorna och med ständig förbättring i stället för revolution.

## Workflow, standarder och krav

Parallellt utvecklades i Europa en **formell modellering av arbetsflöden**. Carl Adam Petris **Petri-nät** (1962) beskrev processflöden och samtidighet matematiskt och gav oss den visuella processmodellen. BPM som akademiskt fält växte fram 1998–2003 ur mötet mellan amerikanskt affärsprocesstänkande och europeisk workflowforskning. Den första BPM-konferensen hölls i Eindhoven 2003.

Två krav utifrån spred processdokumentationen. **ISO 9000:2000** ökade kraven på att processer är beskrivna. Efter Enronskandalen kom **Sarbanes-Oxley (SOX)** 2002, som krävde spårbar intern kontroll av alla processer kring den finansiella rapporteringen. BPM gav metoderna, verktygen och notationen, och SOX ledde till en bred användning av BPM och en push mot standardisering, till exempel BPMN.

## BPMS, SOA och vågen efter

På 90-talet fanns processlogiken i workflowsystem och ERP. Under 2000-talet kom **BPMS**, körbara processmotorer med övervakning, och **SOA**, där affärsfunktioner exponeras som återanvändbara, löst kopplade tjänster. Tillsammans kan en process orkestrera aktiviteter över många system och funktioner. Weaver sammanfattar BPM-rörelsen kring Smith och Fingar (2003) och Harmon (2003) så: BPM är agilt i stället för monolitiskt, som förändring och ständig förbättring i stället för revolution, och ett förenat angreppssätt för teknik, ledning och människor med uthållig konkurrensfördel som mål.

På 2010- och 2020-talen används ordet BPM mindre i marknadsföringen. Man talar om process orchestration, Digital Process Automation, process mining och **iBPMS**: API-först-motorer som orkestrerar människor, botar och mikrotjänster.

## RPA

2015–2022 var **Robotic Process Automation** huvudspåret. RPA är mjukvarurobotar som **härmar hur en människa klickar sig igenom applikationer**. Verktygen är low-code, så att medarbetare utan programmeringskunskaper kan konfigurera egna botar. Rosemann et al. (2024) och Reijers (2021) beskriver RPA på samma sätt: roboten automatiserar användarens interaktion med en uppgift.

Just det är också **begränsningen**. Roboten arbetar via användargränssnittet, inte via robusta systemintegrationer, vilket gör den känslig och svår att skala. RPA passar bäst för uppgifter där stegen alltid är likadana och inte kräver omdöme. Tentans exempel är ett team som varje dag kopierar hundratals fakturarader från e-post till ett ERP-system.

## Agentisk AI och BOAT

I dag marknadsförs nästan allt som AI, men BPM-tänkandet och modelleringen finns kvar i bakgrunden. Rena RPA-företag konkurrerar nu med **agentisk AI-orkestrering**, där AI-agenter sköter hela arbetsflöden och fattar beslut på vägen. Visionen är att hela verksamheter automatiseras. Frågan Weaver lämnar öppen är vilken roll människorna då får. BPM-systemen är i dag en del av det som kallas **BOAT** (Business Orchestration and Automation Technologies).

Jestons egen bild av utvecklingen, som han kallar en "hype cycle", är egentligen en tidslinje: från Six Sigma via BPR:s topp och fall, BPM-rörelsen och RPA till generativ AI och AI-agenter.
`,
  },
  {
    id: "kap3",
    number: 3,
    title: "När och hur BPM startar",
    readingMinutes: 10,
    lead: "Drivers och triggers, framgångsfaktorerna, top-down mot bottom-up, tre sätt att initiera BPM och Jestons fyra scenarier.",
    sources: ["F2 (Weaver 25 sep 2026, figur 12.3)", "F3 (Launch steg 2)", "Tenta HT25 ord 2(g), omtenta 7, 9, 10", "HT24 fråga 17 (drivers långsiktiga), 18, 45"],
    body: `
Flera av HT25-tentornas scenariofrågor kom härifrån: vad Jeston rekommenderar när ledningen inte är engagerad, vilket scenario en HR-avdelning befinner sig i, vilket angreppssätt en myndighet ska välja och vad som kännetecknar en quick win.

## Drivers och triggers

Jeston skiljer mellan två sorters anledningar att börja med BPM:

- En **driver** är ett affärsskäl eller en motivation som får organisationen att agera för att nå ett mål, till exempel att vilja öka lönsamheten, förbättra kundnöjdheten eller genomföra strategin.
- En **trigger** är en händelse som får organisationen att agera nu, för att lösa ett akut problem eller svara på en förändring som påtvingas utifrån.

En äldre tentafråga (HT24) beskrev skillnaden som att drivers är långsiktiga motiv och triggers konkreta händelser som kräver omedelbar handling. Enligt Jeston ska BPM startas först när drivers och triggers är **fastställda och överenskomna** av alla intressenter, **dokumenterade, kommunicerade och förstådda**, och synliga i hela organisationen.

## Framgångsfaktorerna

Jeston räknar upp sex kritiska framgångsfaktorer:

1. **Ledningens stöd:** synligt stöd från vd och ledning. Det är den enskilt viktigaste faktorn.
2. **Tydliga drivers:** annars riskerar man att lösa fel problem.
3. **En tydlig vision:** en gemensam bild av hur verksamheten ser ut efteråt ("start with the end in mind").
4. **Mätbart värde:** framgång uttryckt i KPI:er.
5. **En BPM-ledare och ett team med mandat:** med erfarenhet och synligt stöd från ledningen.
6. **Linjerade incitament:** chefernas mål, belöningar och konsekvenser kopplade till BPM-resultaten.

Tre råd från Jeston hör till de mest citerade i kursen:

- **Har du inte ledningens stöd för ett stort BPM-program, ska du helt enkelt stoppa.** Då spelar de andra faktorerna ingen roll.
- BPM som genomförs med bara traditionell projektledning ger suboptimala resultat. Ett strukturerat ramverk som 7FE ökar sannolikheten att lyckas.
- **Matcha tempot med organisationens processmognad.** Går du fortare än mognaden tillåter ökar risken att misslyckas.

Det första rådet gäller **stora** program. Det betyder inte att inget kan göras utan ledningen, och det leder till nästa fråga.

## Top-down, bottom-up eller båda

| Angreppssätt | Kännetecken | Risk |
|---|---|---|
| **Top-down** | Drivs av en ledning som förstår BPM:s nytta. Linjerat med strategin, hela organisationen i fokus. Kräver starkt ledarskap, sponsorskap och styrning | Kan missa den operativa verkligheten eller medarbetarnas engagemang |
| **Bottom-up** | Startas av processägare eller team som vill förbättra lokalt. Bygger quick wins och engagemang underifrån | Kan stanna lokalt och aldrig påverka strategin |

Jestons slutsats är att **en balans är bäst**: top-down ger riktning och bottom-up ger fäste. Hur väl BPM lyckas beror på mognaden, ledningens engagemang och hur väl de tidiga insatserna kopplas till den långsiktiga strategin.

Två tentascenarier visar hur det används:

- **En avdelning vill förbättra, men ledningen är inte engagerad och strategin oklar.** Börja lokalt med små bottom-up-förbättringar som skapar värde och bygger momentum. Att vänta på strategin, outsourca eller starta ett top-down-program är fel.
- **En myndighet måste anpassa hela verksamheten till nya nationella regler.** Förändringen är strategiskt viktig och tvärfunktionell. Driv BPM **top-down** för att få styrning, mandat och samordning över hela organisationen.

Jeston delar också in projekten efter komplexitet, från bottom-up till top-down:

1. Enkla projekt med liten påverkan, ofta startade av processfokuserade chefer med sponsor på affärsenhetsnivå.
2. Projekt med stor påverkan, som kräver sponsor på divisions- eller ledningsnivå.
3. Stora BPM-program, lett av ledningen med stora förändringsinslag.
4. Organisationsövergripande transformation, som måste drivas av vd eller ledningsgruppen.

## Tre sätt att initiera BPM

- **Strategy-led:** initiativet följer av strategin och av top-down-program. Det startar i faserna Foundations och Enablement.
- **Business issue-led:** ett svar på ett konkret verksamhetsproblem, som kundklagomål eller kostnader. Det är oftast taktiskt, lokalt och bottom-up. Behovet avgörs längre ned i organisationen än strategin.
- **Process-led:** processansvariga eller analytiker förbättrar på eget initiativ, oberoende av bredare strategier. Det används ofta för att visa BPM:s värde med små vinster.

## De fyra scenarierna

Jeston placerar BPM-insatser efter två dimensioner: **hur stor påverkan** de har på organisationen och **hur involverad chefen** (business manager) är, alltså hur informerad och hur engagerad.

| Scenario | Påverkan | Chefens involvering |
|---|---|---|
| **Under the radar** | Mindre processförbättringar | Delvis informerad, begränsat eller inget engagemang |
| **Pilot project** | Förbättrar eller gör om processer | Fullt informerad, delvis engagerad |
| **In the driver's seat** | Gör om processer från början till slut, eller affärsmodellen | Fullt informerad, fullt engagerad |

Figuren har också två zoner. **Exceeding mandate** är när påverkan är större än chefens involvering räcker till. **Under ambitious** är när chefen är mer involverad än insatsen utnyttjar. Det fjärde scenariot, **Business as usual**, finns inte i figuren utan bara i Weavers punktlista: BPM är "fully embedded" i organisationens sätt att arbeta.

Under the radar är de små informella insatserna med begränsat stöd från ledningen. Tentans exempel är en HR-avdelning där två analytiker själva börjat kartlägga, cheferna vet om det men har inte prioriterat det, och arbetet sker sporadiskt utan budget eller formell styrning. En pilot ska bevisa BPM:s värde. In the driver's seat betyder att BPM är erkänt som strategiskt verktyg med växande styrning. **Business as usual** betyder att BPM är helt inbäddat i organisationens sätt att arbeta. Det betyder inte att BPM-arbetet vilar. Scenariot avgör hur noggrant och brett ramverket används.

## Quick wins

En **quick win** är en förbättring som kan genomföras snabbt, utan stora kostnader, och som ger en omedelbar förbättring i en process. Quick wins bygger förtroende och momentum, särskilt bottom-up. Redan i Launch-fasens intressentintervjuer letar BPM-teamet efter quick wins som betyder något för intressenterna. En quick win har inte liten praktisk effekt, och den kräver varken konsulter eller omfattande förstudier.

## Vem som är inblandad

BPM kan omfatta allt från att driva projekt och detaljgranska processer till modellering, redesign, mätning, implementering och löpande förvaltning. Det kan också sträcka sig till leverantörer, kunder och andra externa intressenter. Externa BPM-experter och konsulter är användbara som coacher, oberoende granskare, konfliktlösare när program kör fast, startstöd och utvärderare av resultatet. Men för långsiktig framgång bör BPM-ledningen finnas inne i organisationen.
`,
  },
  {
    id: "kap4",
    number: 4,
    title: "Improve before automate, och BPM:s perspektiv",
    readingMinutes: 8,
    lead: "Varför processer ska förbättras innan de automatiseras, spreadsheet-testet, BPMS-komponenterna, kund- och medarbetarperspektivet och processoptimeringslösningarna.",
    sources: ["F2 (Weaver 25 sep 2026)", "Tenta HT25 ord 1(b), 2(c), 2(f); omtenta 12", "Processoptimeringslösningarna: preliminärt, bara uppräkningen i omtentans fråga 12 och RPA-exemplet i ord 2(c) — uppdateras efter F4"],
    body: `
## Improve before automate

Den här principen var en av HT25-tentans två essäfrågor. Jeston är kategorisk: **automatisering ska aldrig läggas på ineffektiva processer**. Då förstoras bara ineffektiviteten.

Mekanismen är enkel. **Automatisering förstärker det som redan finns.** En effektiv process blir effektivare när den automatiseras. En ineffektiv process blir sämre, eftersom felen, omvägarna och de onödiga stegen nu körs snabbare, oftare och i större skala, och blir inbyggda i systemet. Att automatisera dåliga processer leder typiskt till:

- **bortkastade investeringar**
- **frustrerade medarbetare**
- **svag användning** av BPM-systemen

Bakom det ligger Jestons syn på teknik: **technology is an enabler, not a solution.** Tekniken kan inte kompensera för en dålig processdesign. Därför ska man minska komplexiteten och förbättra processen **innan** tekniken införs. Grunderna kommer först: förstå, kartlägg och förbättra processflödet och affärsreglerna, och inför sedan systemet.

Principen har en historisk udd. Hammers kritik 1990 var just att företagen automatiserade gamla arbetssätt, och han förklarade produktivitetsparadoxen från kapitel 2 på samma sätt.

Ett eget exempel: ett företag inför en workflowlösning för attester, men attestkedjan har fem nivåer där tre bara skickar vidare. Automatiseras den som den är går varje ärende nu digitalt genom fem nivåer. Förbättras den först räcker kanske två, och automationen gör den kortare kedjan snabb.

### Spreadsheet-testet

Jeston föreslår ett enkelt mått: **hur många av dina kritiska processer eller processteg vilar på kalkylark?** De flesta organisationer hanterar processfel genom att lägga till fler kalkylark i stället för att förstå och lösa grundorsaken. Används kalkylark i processerna behöver processerna **förbättras innan de automatiseras**. System som är ändamålsenliga ska göra kalkylarken onödiga.

## Vad ett BPM-system består av

Jeston delar BPM-tekniken i tre grupper:

| Modellering och design | Exekvering och spårning | Performance management |
|---|---|---|
| Processmodellering (BPMN) | Work management | Balanced scorecard |
| Activity-based costing | Business rules engine | Business analytics, BI och dataanalys |
| Processimulering | Systemintegration, dokumenthantering | |
| | RPA (och agentisk AI-orkestrering) | |

Dagens **iBPM** lägger till RPA och low-code, process mining, avancerad analys och AI-orkestrering. Business rules engine arbetar med beslutstabeller och DRD, alltså det som modelleras i DMN (kapitel 10). **Activity-based costing (ABC)** var en stor managementinnovation på 80- och 90-talen: kostnader kopplades till aktiviteter. ABC visade sig dyrt och svårt att underhålla, och principerna lever i dag vidare i analysverktygen.

## Customer-centric, employee-centric eller båda

**Customer-centric BPM** utgår från kundens verkliga upplevelse. Jestons poäng är att utmärkta kundmått kan dölja ett djupare missnöje, och att det är **effektivare att ta bort kundens irritationer än att satsa mycket på wow-faktorer** som tillför lite. Hans figur har en irritationszon, en "line of absolute indifference" och en wow-zon. Processer och KPI:er ska spegla kundens upplevelse, inte bara de interna dashboarderna. Tentans exempel: en organisation gör om sin ärendehantering så att kunderna får snabbare svar, färre hand-offs och en tydlig kontaktpunkt. Det är customer-centric.

**Employee-centric BPM** utgår från att motiverade medarbetare är grunden för god service. Medelbra processer som levereras av entusiastiska medarbetare slår ofta utmärkta processer som levereras av oengagerad personal. Fokus ligger på empowerment, omsorg och rätt arbetsmiljö och attityd. Chefen ska vara en **servant leader** som stödjer, coachar och möjliggör i stället för att detaljstyra. FAIL läses som **First Attempt In Learning**, en lärande kultur.

Jestons slutsats är **balans**. Utan kunder finns ingen verksamhet, och utan medarbetare får kunderna ingen service. En redesign ska prövas från båda hållen: hur effektiv och tillfredsställande är processen för kunden, och hur effektiv och stärkande är den för medarbetaren? Weaver jämför med den resursbaserade synen från Strategi: stödprocesserna och människorna kan vara en källa till uthållig konkurrensfördel.

## Processoptimeringslösningar

Jeston räknar **process redesign, outsourcing, shared services, RPA och cloud computing** som typiska processoptimeringslösningar att välja mellan. Tentans exempel på valet: ett team som varje dag kopierar fakturarader från e-post till ett ERP-system, där stegen alltid är likadana och inte kräver omdöme, är ett fall för RPA.

Håll isär listorna. Leadership, project management och people change management är 7FE:s essentials (kapitel 5), inte optimeringslösningar. Customer- och employee-centric är perspektiv, inte lösningar.
`,
  },
  {
    id: "kap5",
    number: 5,
    title: "7FE-ramverket och huset",
    readingMinutes: 9,
    lead: "Jestons husmetafor, 7FE:s tio faser och tre essentials, framgångspallen, ramverkets styrkor och svagheter, och varför one size fits all inte fungerar.",
    sources: ["F2 (Weaver 25 sep 2026)", "F3 (husbilden)", "Tenta HT25 ord 2(d), omtenta essä 2", "HT24 fråga 32 och omtentans 50 (definitioner och husets ramverk)"],
    body: `
## Boken och ramverket

Jestons bok har tre delar. Del 1 (kapitel 1–10) är en översikt i frågeform: vad, varför, hur och vem. Del 2 (kapitel 11–27) svarar på hur man gör BPM med **7FE-ramverket**. Del 3 innehåller fallstudier och BPM-mognad. För varje fas i 7FE beskriver Jeston fyra saker: **Why** (skälet), **Results** (förväntade resultat), **How** (stegen) och **Output och risks**.

## Huset

Jestons egen modell, som han är mycket stolt över, är ett **hus** för processfokuserad affärstransformation. Poängen är att **BPM består av lager**, från strategiska grunder till operativa och innovativa processer, som tillsammans skapar en effektiv organisation. Nerifrån och upp:

- **Marken:** regelverket och omvärldens regler, som huset står på.
- **Foundations:** komponenterna i target operating model och de övergripande principerna för att bygga förmåga.
- **Enablement:** principer och riktlinjer för att leverera operating model och förmågorna och för att styra verksamheten.
- **Organisatorisk linjering:** spårbarhet mellan strategi, target operating model, organisationens vägledande principer och förmåga.
- **Business transformation program management, "Set for Success":** ett process transformation framework, people change management, benefits realization och ett process improvement framework. Operate, Manage, Sustain, Review.
- **Tre processrum:** management processes (portföljstyrning, strategiutveckling, scenarioplanering, riskaptit), operational processes (kärnprocesser som order to activate och procure to pay, samt stödprocesser som ekonomi, HR och IT) och innovation processes (ambition, collect, filter, evolve, select, mobilize, future proofing).
- **Taket:** sustainability och performance management, alltså process governance, prestationsstyrning och organisationskultur, samt organisationens process asset och ett ramverk för nyttostyrning. Taket är den kultur som håller processfokus vid liv över tid.

Målet för det hela är effektivitet och **uthållig konkurrensfördel** (service, staff, cost). Huset säger alltså inte att BPM är ett avgränsat projekt, att IT-system byggs steg för steg eller att kartläggningen kommer före strategin. Grunden är strategisk.

## 7FE: tio faser i fyra F-grupper, plus tre essentials

Namnet 7FE läses bäst som **"10P3E"**: tio faser (phases) och tre essentials. Faserna är grupperade i fyra grupper som alla börjar på F:

| Grupp | Faser |
|---|---|
| **Foundations** | 1 Foundations, 2 Enablement, 3 Launch |
| **Findings & solutions** | 4 Understand, 5 Innovate |
| **Fulfilment** | 6 People, 7 Develop, 8 Implement |
| **Future** | 9 Realize (de strategiska målen), 10 Sustainability (konkurrensfördelen) |

De **tre essentials** är förmågor som krävs genom alla faser:

- **Leadership:** att organisationens ledare ger stöd och vägledning så att BPM-aktiviteten och organisationen är linjerade och ger rätt affärsresultat.
- **BPM project management:** att resurser, budget, tidplan, intressenter och leveranser hanteras.
- **People change management:** att alla berörda kan och vill ta till sig och bidra till den framtida lösningen.

Tentan har prövat just skillnaderna mellan de tre definitionerna. Se också upp för påhittade fasnamn. **Execution, Evaluation, Engagement, Follow-up och Feedback finns inte i 7FE.** Känner du inte igen ett fasnamn i ett alternativ är det nästan säkert fel.

Varför behövs ett ramverk alls? Jeston menar att traditionella metoder inte räcker. Enkla redesigninitiativ slutar ofta när processen är införd och glömmer prestationsstyrningen och den strategiska linjeringen. Att göra om en process utan att förstå dess koppling till strategin riskerar att lösa fel problem. Den strukturerade ansatsen ger strategisk linjering över tid genom en återkopplingsslinga av ständig förbättring och organisatoriskt lärande.

## Allt börjar med strategin

Strategin är drivkraften. Den bestämmer affärsmodellen, alltså hur värde skapas och fångas, och den operativa modellen (business operating model). Att genomföra den kräver förmågor och resurser inom tre områden: **människor** (organisation och kultur), **teknik** och **process**. Jestons **framgångspall** (BPM success stool) har samma logik: BPM lyckas när strategi, processer, människor och beteende är linjerade. Olika intressenter uppfattar dessutom BPM olika (Jestons figur 11.3 visar begrepp som mätning, simulering, processförändring och ledarskap). Ramverket behövs för att hålla ihop helheten.

## Styrkor och svagheter

| Styrkor | Svagheter |
|---|---|
| Förenar människa och teknik, som andra BPM-metoder försummar | Namnet 7FE är en misslyckad minnesregel, och F-grupperna verkar vara en efterhandskonstruktion |
| Upprepningsbar struktur för stora organisationer och konsulter | Blandar sekventiella och parallella steg. Faserna överlappar, till exempel People och Enablement, och gränserna blir otydliga |
| Fungerar som allmän förändringsmetodik för IT, till exempel ERP, dataplattformar och AI | För komplext: projektledning, förändringsledning och redesign i ett metaramverk som kan skymma flödet |
| Förankrat i strategiskt tänkande som fortfarande gäller | Pedagogiskt svårt: mest listor och checklistor, lite visuellt och hierarkiskt |
| Holistiskt: inte bara modellering, utan strategi, ledarskap och kultur | |

## One size fits all fungerar inte

Detta var en essäfråga på omtentan HT25, tillsammans med BPM-mognad (se kapitel 8). Jestons råd om hur 7FE ska användas är att **ett och samma upplägg inte passar alla**:

- Organisationer skiljer sig i **BPM-mognad, kultur, ledarskap och processerfarenhet**.
- Även när ledningen stödjer BPM saknar projekten ofta uthållig uppmärksamhet och resurser.
- Vissa organisationer har redan en stabil grund, med vision, mål och processarkitektur. Andra börjar med splittrade insatser.
- Därför anpassas ramverket. Scenariot från kapitel 3 avgör hur noggrant och brett det används.

**Att hoppa över faser** är möjligt men avrått utan motivering. Tempot följer samma logik: går man fortare än mognaden tillåter ökar risken att misslyckas.
`,
  },
  {
    id: "kap6",
    number: 6,
    title: "Foundations och Enablement",
    readingMinutes: 12,
    lead: "Strategy execution void, Red Wine Test, target operating model, process governance, processarkitektur och process asset — de två faserna som lägger grunden.",
    sources: ["F3 (Weaver 29 sep 2026)", "Tenta HT25 ord 2(i), 2(j); omtenta essä 1, 3, 4, 5", "HT24 fråga 3, 11, 31"],
    body: `
## Foundations: den mest kritiska fasen

Foundations är enligt Jeston kanske den mest kritiska fasen i 7FE. Den lägger den strategiska och strukturella grund som allt annat BPM-arbete byggs på, som grunden till ett hus. Utan den blir senare insatser splittrade eller olinjerade med verksamhetens mål. Men **Foundations skapar inte strategin**. Fasen säkerställer **linjeringen mellan strategin, processledningen och de enskilda processerna**, och definierar hur BPM bidrar till att genomföra strategin.

Fasen har fem steg. De görs oftast i ordning men kan löpa parallellt, och djupet beror på organisationen och dess mognad.

### Steg 1: skaffa strategin

Den första uppgiften är att förstå organisationens strategi, **inte att skapa eller kritisera den**. BPM-teamet skaffar strategidokumentet och ser till att det är förstått. Därefter etableras spårbarhet: från strategin till BPM-programmet, till Red Wine Test-resultaten och till aktiviteterna i ett BPM Center of Excellence. Allt BPM-arbete ska bidra till de strategiska målen. Strategin är visionen om vart organisationen ska, och BPM är ett av medlen att ta sig dit. I praktiken sker det i möten och workshoppar där processnivåerna gås igenom och dagens och framtidens flaskhalsar knyts till strategiska teman.

### Strategy execution void

Det här begreppet var en essäfråga på omtentan HT25. Många organisationer misslyckas inte med att **formulera** strategin, utan med att **genomföra** den. **Strategy execution void** är gapet mellan organisationens strategiska avsikt och dess förmåga att genomföra strategin. Tomrummet har två ömsesidigt beroende delar:

- **Management effectiveness:** förmågan och disciplinen i ledningsprocesserna, alltså styrning, beslutsfattande och linjering av struktur och kultur. När den är inbäddad i hela organisationen ger den **uthållig konkurrensfördel**.
- **Operational efficiency:** kvaliteten i de operativa processer som levererar varor och tjänster. Den höjer produktiviteten men ger sällan varaktig fördel om inte management effectiveness stödjer den.

Fokuserar man bara på operational efficiency blir resultatet **"different sameness"**: små förbättringar utan verklig förändring.

Weaver visar det i Jestons hus med tre zoner. Den blå zonen, rummet för **management processes**, är management effectiveness: miljön för genomförandet. Den röda zonen, rummet för **operational processes**, är operational efficiency: själva genomförandet. Det är där "different sameness" uppstår. Den gröna zonen är bandet **Business Transformation Program Management** ("Set for Success"), BPM som det strukturerade ramverk som binder ihop dem. För att fylla tomrummet krävs:

- en tydlig koppling från strategin till strategiska teman och nyckelprocesser (nivå 1–2)
- samordnade program och projekt mot flaskhalsarna, med stark överlämning och ägarskap
- ständiga återkopplingsslingor mellan strategi och verksamhet

När båda delarna finns på plats ger BPM den disciplin, struktur och synlighet som genomförandet kräver.

### Steg 2: förstå organisationens omgivning

Innan man bygger ett hus måste man känna tomten, omgivningen och ekonomin. På samma sätt behöver BPM-teamet förstå organisationens struktur och kultur, dess omvärld och de begränsningar och möjligheter som formar förändringen. Organisationen är ett levande system. Jeston lägger stor vikt vid arbetskraftens generationer och deras olika förväntningar, och vid hur pandemin och digitaliseringen förändrat arbetsplatsen.

I steget bedöms också:

- **BPM-mognaden:** låg mognad gör BPM svårare.
- **BPM-resan hittills:** pågående förbättringsprojekt, som bör föras in under BPM-teamets kontroll.
- **Drivers.**
- **BPM-aktivitetens bredd:** hur omvälvande projektet är, i fem nivåer. De är små förbättringar, förbättring av delprocesser, redesign av processer, redesign av verksamheten och att rubba branschens värdekedja.

### Red Wine Test

**Red Wine Test** är en visionsövning. Deltagarna föreställer sig att BPM-projektet redan är genomfört och perfekt lyckat, och beskriver det framtida tillståndet. Frågorna är:

- Vad har förändrats för kunderna, medarbetarna och ledningen?
- Hur arbetar organisationen nu?
- Vad är de stolta över att ha åstadkommit?

För varje svar ska man komma överens om **vem som ansvarar för leveransen**, BPM-teamet eller linjeledningen.

Syftet är att skapa **ett gemensamt narrativ om hur framgång ser ut** efter projektet och klargöra ansvaret. Tentans exempel: chefer säger att "kunderna nu får sina ärenden lösta i ett steg" och "vi har mycket bättre tvärfunktionellt samarbete". Det är Red Wine Test i funktion. Det definierar inte scope, väljer inte lösningar och ger inga to-be-modeller.

### Steg 3: välj angreppssätt

Top-down eller bottom-up väljs efter vilken typ av BPM-aktivitet det är (kapitel 3).

### Steg 4: target operating model

**Target Operating Model (TOM)** är en övergripande bild av organisationens framtida operativa modell, **hur organisationens olika delar ska fungera i framtiden** för att BPM ska lyckas. TOM har sju komponenter som måste vara linjerade:

1. **Strategy**, med koppling till BPM-aktiviteterna
2. **Process governance**, med roller och ansvar
3. **Process architecture**
4. **Performance management**, till exempel balanced scorecard
5. **People and culture**
6. **Organization design**
7. **Technology**

TOM kan ses som den framtida önskade verksamhetsarkitekturen. Den är ingen to-be-IT-arkitektur, ingen kalkyl över besparingar och ingen as-is-karta.

### Steg 5: kommunikation

Foundations är den enda fasen där kommunikation är ett viktigt **sista** steg, eftersom grunderna och TOM måste vara överenskomna först. Därefter kommuniceras BPM-arbetets syfte och ansats kontinuerligt, genom ledningsbesked, informationsmöten och information online.

**Foundations output** är TOM-komponenterna och linjeringen mellan BPM-projektet och organisationens strategi. De är underlag för alla senare faser.

## Enablement

**Enablement** bygger det som krävs för att förverkliga TOM. Fasen omfattar alltså **mycket mer än teknik**: människor (organisationsstruktur, kultur), teknik (IT-strategi och resurser) och process (ansats och arkitektur). Den har sju steg.

### Steg 1: kommunikation

TOM och dess detaljer kommuniceras till alla som berörs. All kommunikation och alla BPM-aktiviteter ska utgå från TOM.

### Steg 2: process governance

**Process governance** (styrning) är nyckeln till varaktig framgång i processförbättringar. Rollerna för beslutsansvar, hantering av affärsrisker och prestationsstyrning måste fastställas:

- **Strategic process council:** det främsta styrande organet för BPM-aktiviteterna.
- **Chief Process Officer (CPO):** idealet, men sällan sett i verkligheten.
- **Process executive:** chef med ansvar för processer.
- **Process steward:** ansvarar för enskilda processer och BPM-projekt, och för prestationsstyrningen på processnivå.

Processerna från början till slut löper horisontellt genom organisationen, över funktionssilos, och syns sällan i organisationsscheman. Frågan "vem styr processen från början till slut?" är därför central.

### Steg 3: processarkitektur och process asset

En **processarkitektur** ger regler, principer och riktlinjer för hur processer designas och förvaltas. Den omfattar standarder för modellnivåer och vägledning för referensramverk, förklarar skälen bakom och kopplar dem till strategin, och är linjerad med EA. Typiska delar är processriktlinjer (hur mycket processerna ska standardiseras och integreras, anpassat efter organisationen), **process assets**, ett arkiv för affärsregler och ett ramverk för nyttostyrning.

En **process asset** gör processerna till en strategisk resurs. Den är ett **centralt arkiv av processmodeller, dokumentation och metadata**, som regler, IT-system, roller och risker. Det ger:

- konsekventa och återanvändbara processer
- mindre omarbete och bättre kvalitet
- enklare analys av hur en förändring påverkar
- transparens för risk, regelefterlevnad och revision

**Skillnaden mot en processmodell** har prövats på tentan: **modellen är en del av process asseten**, som dessutom rymmer roller, policies, regler, risker och andra styrande element. När något händer i en process och teamet behöver förstå stegen, reglerna, ansvaret och beslutspunkterna är det process asseten för den processen de ska gå till, inte TOM eller strategidokumentet. I moderna BOAT-plattformar kan process asseten bli en levande digital bild av processen, med modeller, regler, system, dokument, ägare, prestationsdata och automation under versionshantering.

Jeston rekommenderar **fem nivåer** av processbeskrivning:

| Nivå | Innehåll |
|---|---|
| 1 | Enterprise-processkarta: organisationen sedd som processer från början till slut |
| 2 | Lista över affärsprocesser, eller en värdekedja för varje process på nivå 1 |
| 3 | Övergripande beskrivning av varje affärsprocess, med beroenden mellan funktioner (BPMN) |
| 4 | Ytterligare en nivå för delprocesser: aktiviteter, beslut, händelser, resurser och system (BPMN) |
| 5 | Detaljerade steg, så detaljerat att en nyanställd kan utföra processen, och information till systemutvecklare |

Nivåerna ger spårbarhet mellan strategi och genomförande. Process asseten byggs pragmatiskt:

1. Standarder för modellering.
2. Överenskomna nivåer.
3. Ett arkiv som växer i stället för att överarbetas från början.
4. Nivå 1–2 fylls med branschmallar som SCOR där det passar.
5. Nivå 3–4 fylls med de processer som tas fram i projektet, i BPMN.

Arkitekturen och process asseten blir på så sätt **länken mellan verksamhet och IT**. De visar vilken produkt, roll, applikation, data, affärsregel och risk som hör till varje aktivitet.

### Steg 4: performance management

Performance management är ett strukturerat system för mätning, ansvar och ständig förbättring av nyckelprocesserna. Jestons formulering är att **om du inte mäter prestationen styr du inte verksamheten**. Utan prestationsdata går det inte att fatta välgrundade beslut eller hålla kvar förbättringar. Det kräver en kultur av ansvar där processägarna ser uppföljningen som sin uppgift, riktlinjer för kriterier, KPI:er och rapportering, samt belöningar för goda prestationer. KPI:er är alltså mått på hur effektiva processerna är. De bestämmer inte löner eller budgetar.

### Steg 5: människor och kultur

Steget bygger TOM:s mänskliga och kulturella grund: processkompetens och utbildning, en prestations- och servicekultur, belöningar och incitament, lärande och uppförandekod. Målet är en processfokuserad organisation med hög prestation.

### Steg 6: organisationsdesign

Den formella strukturen ska integrera människor, information och teknik så att de strategiska målen nås. **Strukturen ska stödja processerna**, styrningen och prestationsstyrningen, och uppmuntra samarbete över silos. Ordningen är **processer → struktur → människor**.

### Steg 7: teknik som möjliggörare

TOM och process asseten ska kopplas till organisationens IT-styrdokument, som anger teknikens gränser, standarder och integrationskrav. BPM-tekniken (BOAT) ska följa IT-arkitekturen. Grundregeln är att **tekniken ska möjliggöra, inte diktera, processdesignen**. Inte all processförbättring kräver teknik, men digitaliseringen, RPA och AI automatiserar allt fler processer.

**Enablement output:** process governance (struktur och roller), processarkitektur, process assets, människor, kultur och organisation, samt teknik som möjliggörare.
`,
  },
  {
    id: "kap7",
    number: 7,
    title: "Launch och Understand",
    readingMinutes: 9,
    lead: "Launch-fasens tio steg — intressenter, processmål, processval, business case och team — och Understand-fasens gemensamma, faktabaserade bild av nuläget.",
    sources: ["F3 (Weaver 29 sep 2026, Launch)", "Understand: preliminärt, ur tenta HT25 omtenta 6 och ord 2(h) — skrivs om efter F4 (5 okt)"],
    body: `
## Launch: den formella starten

Organisationer vet ofta att de har ineffektiviteter men har svårt att avgöra **var och hur de ska börja**. **Launch** är den formella startpunkten för en BPM-aktivitet. Fasen fastställer scope, struktur och riktning, ser till att alla viktiga intressenter är identifierade, engagerade och har samma förväntningar, och knyter arbetet till de strategiska målen och till grunderna från Foundations och Enablement.

Launch har tio steg:

1. **Kommunikation:** informera om mål, scope och tidplan.
2. **Initiala intressentintervjuer:** intressen, förväntningar och möjligt motstånd.
3. **High-level process walkthrough:** en gemensam bild av de befintliga processerna.
4. **Intressentidentifiering och engagemang.**
5. **Workshoppar med ledningen:** ledningens stöd och överenskomna processmål.
6. **Plan för handover och takeover:** hur beslut, ägarskap och ansvar ska hanteras.
7. **Genomförandeansats:** hur utrullningen ska gå till.
8. **Business case:** beskriven och undertecknad.
9. **BPM-teamet:** struktur med tydliga roller (projektledare, styrgrupp, processteam).
10. **Initial plan och business case:** dokumenterade som grund för nästa fas.

### Kommunikation och intressenter

Medarbetarna ska få veta mål, förväntade resultat och tidplan. Kommunikationen ska **bemöta rädslan för nedskärningar, outsourcing och automatisering**. Den ska också ta upp vad som förändras för medarbetarna, hur ledningen ska agera, hur ofta de får information och hur de kan delta. Här syns kapitel 8:s tema tidigt: människorna är huvudsaken.

De **initiala intressentintervjuerna** är tidiga, fokuserade samtal med nyckelpersoner. De ger en bred bild av verksamheten, visar hur intressenterna ser på problemen, **hittar quick wins som betyder något för dem** och börjar bygga förtroende. Intressenterna finns både internt, också utanför den egna affärsenheten, och externt: leverantörer, kunder, partner, leverantörens leverantör och kundens kund. Viktiga externa intressenter kan behöva delta aktivt.

**High-level process walkthrough** är korta genomgångar av nyckelprocesserna från början till slut. Teamet talar med dem som utför arbetet och med IT. Genomgången ska vara övergripande och **icke-kritisk**. Målet är orientering, inte utvärdering, och den förbereder den detaljerade Understand-fasen.

### Ledningsworkshoppen

Workshopparna med sponsorer och chefer från berörda enheter ska ge överenskommelse om:
- aktivitetens **scope**, alltså om den sträcker sig utanför affärsenheten eller organisationen
- dess **bredd**, alltså hur omvälvande den är (de fem nivåerna i kapitel 6)
- de första processmålen
- en checklista för hur framgång ser ut
- de viktigaste processerna
- en första analys med övergripande mått
- styrningen
- vad Understand ska leverera

**Processmålen** anger hur mycket prestationen ska förbättras. Nuläget jämförs med önskat läge. Antalet mått hålls **lågt, helst högst fem per process**, och varje mål kopplas till en ansvarig chef. Alla processmål ska vara **SMART**: specifika, mätbara, uppnåeliga, realistiska och tidsbundna.

För att identifiera processerna rekommenderar Jeston **process selection matrix (PSM)**. Den visar alla processer i en affärsenhet: huvudprocesserna från början till slut (till exempel order- och supportprocessen) mot scenarier som produkter, geografi och distributionskanal. Det gör det lättare att se komplexitet, kopplingar och var samma process täcker flera produkter. För att prioritera arbetet används analysverktyg som **Process Worth Matrix**.

### Överlämning, business case och team

**Handover- och takeover-planerna** beskriver hur resultatet går från BPM-teamet till verksamheten:
- kostnader
- behovet av experter
- risker
- löpande kostnader och nyttor
- tidpunkt
- reservplaner
- kommunikation
- styrning och eskalering
- effekt på kundupplevelsen

Traditionella införanden lägger lite tid och resurser i förväg, vilket ger suboptimala lösningar och processer som används dåligt. Ett strukturerat ramverk planerar genomförandet noggrant från början.

**Business case** skrivs på **vanligt språk, inte i BPMN**. Det sammanfattas helst på **en sida**, påståendena stöds av evidens, och planen kan behöva uppdateras i senare faser.

**Launch output:**
- identifierade och engagerade intressenter
- PSM och en lista över processer med första mått
- överenskomna processmål
- prioriterade processer för Understand
- en första genomförandeansats
- projektdokumentation och ett första business case

## Understand: en gemensam bild av nuläget

**Understand** är den första fasen i gruppen Findings & solutions. Här modelleras nuläget. Enligt Jeston är huvudsyftet med modelleringen **att få fram en gemensam, faktabaserad bild av hur processen faktiskt fungerar i dag**, för att kunna analysera hur den kan förbättras.

Tentan prövade just skillnaden mot andra syften, som alla låter rimliga men är fel:
- att ta fram fullständiga beskrivningar som kan automatiseras direkt
- att definiera detaljerade KPI:er för framtida styrning
- att producera dokumentation för revision

Nulägesmodellen är ett analysverktyg, inte en slutprodukt. Enligt tentans svarsalternativ hör identifierade rotorsaker inte till Innovate; att de tas fram i analysen av nuläget är en slutsats som kontrolleras mot föreläsning 4. Lösningarna kommer i Innovate, i nästa kapitel.
`,
  },
  {
    id: "kap8",
    number: 8,
    title: "Från Innovate till Sustainability, och människorna",
    readingMinutes: 8,
    lead: "Faserna från to-be till nyttorealisering, varför Sustainability inte betyder hållbarhet, varför människorna är 60 procent av arbetet, och BPM-mognad.",
    sources: ["F2 (7FE:s faser och grupper, one size fits all, mognad)", "F3 (Foundations steg 2, Launch steg 1)", "Preliminärt: Innovate–Sustainability, 60 %, appreciative inquiry och essentials ur tenta HT25 ord 1(a), 2(h), HT24 fråga 26, 32, 33, 43, 47 (HT24 saknar facit) — skrivs om efter F4 (5 okt)"],
    body: `
Faserna efter Understand gås igenom på föreläsning 4. Det här kapitlet innehåller det tentorna redan visat och skrivs om efter den.

## Innovate

**Innovate** är den andra fasen i Findings & solutions. Dess typiska output är **design av framtida processer ("to-be") och validerade lösningsförslag**. Enligt tentans svarsalternativ hör varken identifierade rotorsaker, en riskanalys eller utbildningsplaner till Innovates output. Var de hör hemma kontrolleras mot föreläsning 4. En äldre tentafråga (HT24) påstod att fasen prioriterar inkrementella förbättringar framför radikala för att undvika störningar. Den tolkas här som falsk, men HT24 saknar facit.

## Fulfilment: People, Develop, Implement

Gruppen Fulfilment består av **People**, **Develop** och **Implement**. Vad faserna innehåller gås igenom på föreläsning 4. Enligt ett svarsalternativ i HT24 är det att "bygga alla komponenter för att införa de nya processerna" en annan fas än Realize, troligen Develop, men HT24 saknar facit.

## Future: Realize och Sustainability

**Realize** säkerställer att **nyttan som beskrevs i business case faktiskt realiseras**. Här sluter sig cirkeln från Launch, där business case skrevs.

**Sustainability** betyder att styrningen och den ständiga förbättringen fortsätter efter projektet, så att förbättringarna lever kvar. En äldre tentafråga (HT24) påstod att Sustainability bara handlar om att införa och kommunicera förbättringarna, utan vidare fokus på styrning. Den tolkas här som falsk, men HT24 saknar facit. Observera ordet: **Sustainability i 7FE betyder uthållig konkurrensfördel, inte hållbarhet i miljömening.** Weaver påpekar det uttryckligen. Green BPM i kapitel 9 är något annat.

## Människorna: ungefär 60 procent av arbetet

Jeston framhåller att **cirka 60 procent av arbetet i ett BPM-initiativ handlar om kommunikation och mänskliga aspekter** snarare än teknik eller modellering. Det var essäfråga 1(a) på ordinarie tentan HT25. Kursmaterialet ger flera skäl till varför det är så:

- **Förändringen sker i människor, inte i modeller.** En ny process finns bara om de som ska arbeta i den förstår den, kan den och vill den. Därför är people change management en av 7FE:s tre essentials, och därför ska alla berörda kunna och vilja ta till sig lösningen.
- **Rädslan finns redan.** Launch-fasens kommunikation ska bemöta rädslan för nedskärningar, outsourcing och automatisering. Obesvarad blir den motstånd.
- **Historien visar vad som händer annars.** BPR misslyckades bland annat för att det inte tog hänsyn till medarbetarnas acceptans och möttes av starkt motstånd.
- **Medarbetarna bär kvaliteten.** Medelbra processer med engagerade medarbetare slår ofta bra processer med oengagerade (employee-centric BPM).
- **Kommunikationen återkommer i faserna.** Den är sista steget i Foundations och första steget i Enablement och Launch.

Riskerna om människorna inte prioriteras är en egen sammanfattning för essäsvaret, dragen ur samma logik:
- motstånd och svag användning av de nya processerna och systemen
- förbättringar som inte håller när projektet är slut
- ett tekniskt korrekt projekt som inte ger den nytta business case lovade, och alltså inte klarar Realize

### Appreciative inquiry

**Appreciative inquiry** är en förändringsansats som **utgår från det som fungerar** och **söker rotorsakerna till framgång**. Beskrivningen kommer från svarsalternativen i en HT24-fråga, och HT24 saknar facit. Enligt den tolkningen fokuserar ansatsen inte på vad som är fel och letar inte efter orsakerna till misslyckanden.

### De tre essentials

- **Leadership:** ledarna ger stöd och vägledning så att BPM-aktiviteten och organisationen är linjerade och ger rätt resultat.
- **BPM project management:** resurser, budget, tidplan, intressenter och leveranser hanteras.
- **People change management:** alla berörda kan och vill ta till sig och bidra till den framtida lösningen.

## BPM-mognad

**BPM-mognad** beskriver hur långt en organisation har kommit i att arbeta processorienterat. Kursmaterialet ger som exempel att vissa organisationer redan har vision, mål och processarkitektur på plats, medan andra börjar med splittrade insatser. Mognaden bedöms redan i Foundations. **Låg mognad gör BPM svårare** att genomföra.

Mognaden förklarar varför **one size fits all inte fungerar** (omtentans essäfråga). Två argument från kursen hänger ihop:

1. **Tempot:** går man fortare än organisationens processmognad ökar risken att misslyckas.
2. **Startpunkten:** vissa organisationer har redan en stabil grund, andra börjar med splittrade insatser. Ramverket anpassas, och faser kan hoppas över bara med motivering.

Organisationer skiljer sig också i kultur, ledarskap och processerfarenhet, och även när ledningen stödjer BPM saknar projekten ofta uthållig uppmärksamhet och resurser. Ett eget exempel för essän: en organisation där BPM hittills skett i små informella insatser, och som försöker starta ett organisationsövergripande transformationsprogram, går fortare än mognaden tillåter.
`,
  },
  {
    id: "kap9",
    number: 9,
    title: "BPM framåt: AI och hållbarhet",
    readingMinutes: 9,
    lead: "Rosemanns tre drifts, Large Process Models, Green BPM enligt Houy, Reijers överblick över disciplinen och BPMN/DMN som stöd för förklarbarhet.",
    sources: ["Rosemann et al. (2024) s. 415–425", "Houy et al. (2012) s. 75–92", "Reijers (2021) s. 1–5", "Tenta HT25 ord 2(e), 3(a); omtenta 8, 11", "Kampik et al. (2025), SAP Signavio-bloggen om Large Process Models"],
    body: `
## Rosemann et al. (2024): tre drifts

Rosemann med flera beskriver hur BPM förändras när AI kommer in. **Första generationens BPM** hade ett problemeliminerande tankesätt. Målet var den friktionsfria processen, med kostnad och tid som huvudmått. Artikeln ser två begränsningar i det. Den första är ett "race towards 0", där processen till slut bara är en hygienfaktor. Den andra är ett kulturellt pris i form av förlorade jobb och prestation framför välbefinnande. Tre **drifts**, alltså skiften i hela fältet, pekar mot en ny generation:

1. **Från transaktion till konversation.** Konversationell BPM betyder att man kan tala naturligt språk med processinformationen och med extern data.
2. **Från automatisering till autonomisering.** Automatiseringen har gått i steg: först uppgifter (ERP), sedan kontrollflödet (workflow), sedan användarens interaktion med uppgiften (RPA). Nästa steg är **besluten**. En autonom process fattar själv beslut utifrån mål och begränsningar, och till skillnad från en automatiserad process är den inte förutsägbar.
3. **Från förenkling till sofistikering.** Processdesignen använder helt nya möjligheter, som avatarer, AR, biometri och videoanalys. Det kräver nya mått: tillväxt och upplevelse, och modererande mått som rättvisa och integritet.

Den nya generationen **utvidgar** den gamla, den ersätter den inte. Artikeln lyfter också **processetik**: integritet, jämlikhet, transparens och ansvarsskyldighet när processer automatiseras med AI.

## Large Process Models

Texten som tentan kallar Kampik et al. (2025) är ett blogginlägg från SAP Signavio. Den beskriver steget från **Large Language Models (LLM)** till **Large Process Models (LPM)**.

Utgångspunkten är **foundation models**: modeller som tränats på breda datamängder och sedan kan specialiseras för ett visst område med lite extra träning. En LLM är en sådan modell, tränad på text. Men en generell LLM bygger på stora mängder ofta dåligt kurerad text. Därför är den oförutsägbar och ibland ologisk, och det begränsar hur den kan användas i verksamheter. Frågar du en generell AI "vilket är det största problemet i mina produktionsprocesser?" får du inget bra svar.

En **LPM** är en LLM som finjusterats och kompletterats med processkunskap. Den kombineras med klassiska algoritmiska verktyg och strukturerad data och får tillgång till organisationens egen, ostrukturerade processkunskap, erfarenhet från tusentals processexperter och prestationsdata från tusentals organisationer. Huvudpoängen, som tentan frågade efter, är alltså **en samlad, datadriven kunskapsbas som kan ge automatiserade rekommendationer för processförbättring**. Den ska korta tiden till insikt (time-to-insight) och tiden till förändring (time-to-adapt), och göra processerna mer genomskinliga (process observability).

Texten räknar med fyra förmågor, från kort till lång sikt:

1. **Automatiserad processanalys med kontext:** förslag på automatisering och strukturella förbättringar.
2. **Insikter ur ostrukturerad information:** processmodeller och analyser genereras direkt ur dokument och data som redan finns i organisationen.
3. **Automatiserad ständig förbättring med människan i kontroll:** förändringar föreslås och startas, men en människa godkänner (human-in-the-loop).
4. **Den självkörande organisationen:** en visionär "enterprise general intelligence" som justerar sig själv efter tidigare resultat.

En LPM tar alltså inte bort processanalytikerna, gör inte dokumentationen onödig och styr inte alla processer med agentisk AI. Den är en kunskapsbas som föreslår, och människan beslutar. Läs texten med samma blick som Jeston (kapitel 1): den är en leverantörs vision om sin egen produkt, inte forskning.

## Houy et al. (2012): Green BPM

**Green BPM** är skärningen mellan BPM och Green IS. Green IS rymmer mer än energisnål IT, nämligen även processer, människor och kultur. Organisatorisk hållbarhet betyder att vinst, sociala behov och miljö hanteras samtidigt. Artikeln fokuserar på miljön och ekonomin.

Kärnidén är att **varje aktivitet i en processmodell annoteras med sin resursförbrukning och sitt avfall**, till exempel kilowattimmar, bränsle och koldioxid. Värdena summeras sedan per process. Då kan processer jämföras och göras om med miljön som mål. Ett äldre sekventiellt flöde kan till och med vara grönare än ett parallelliserat, om miljön väger tyngre än genomloppstiden. Artikeln föreslår också gröna SLA:er och lyfter att störst effekt väntas i processer mellan organisationer, där transporterna står för mycket. Möjligheterna struktureras längs hela BPM-livscykeln.

Houy pekar också på **utmaningarna**, och tentan frågade varför Green BPM inte fått det genomslag visionen förutspådde:
- mätbara hållbarhetsnyckeltal måste först tas fram, och förbrukningen kan ibland bara uppskattas
- kostnadseffektivitet är oftast den viktigare faktorn
- dagens BPM-verktyg är byggda för kostnad och tid, och måste anpassas eller nyutvecklas för att stödja hållbarhetsdata

Tentans rätta svar var att de flesta BPM-verktyg saknar inbyggt stöd för att lagra, räkna och analysera energi-, utsläpps- och resursdata i modellerna. Distraktorerna, som lagförbud, agentisk AI och process mining, har inget stöd i artikeln.

## Reijers (2021): disciplinens utveckling

Reijers ger en överblick över drygt hundra artiklar i en tidskrift. Grundtanken är att **BPM i grunden är en managementidé**: organisationer som styr sina processer från början till slut presterar bättre än de som delar upp arbetet funktionellt. Det som utmärker ett **BPMS** jämfört med ERP är att det konfigureras med en **körbar processmodell** som workflowmotorn tolkar. De förväntade fördelarna var:
- mindre arbete genom automatiserad samordning
- flexibel integration av IT-system
- transparens och spårbarhet
- att organisationens policyer och regler blir lättare att upprätthålla

Enligt Reijers har potentialen inte förverkligats. Han skiljer också **design** från **modellering**. BPM betyder inte "Business Process Modeling": designbeslut gäller organisation, teknik och ansvar, modellering gäller hur det representeras. Process mining använder händelsedata för att se hur processer faktiskt körs. RPA beskrivs som botar som härmar människans manuella väg genom applikationerna.

## BPMN, DMN och förklarbarhet

Det här avsnittet bygger på tentans svar, inte på en artikel eller föreläsning; det kontrolleras efter föreläsning 5. Tentan frågade hur BPMN och DMN stödjer regulatoriska krav på förklarbarhet vid automatiserat beslutsfattande. Svaret var att de **gör beslutsflöden och beslutsregler visuella och förståeliga**, så att det går att förklara för medborgare varför ett beslut blev som det blev. De automatiserar inte förklaringen, översätter inte till naturligt språk och gör inte besluten enklare.

En egen tolkning: en handläggare kan visa vilken regel i beslutstabellen som gav utfallet och var i processen beslutet togs. Artiklarna tar inte upp DMN. Rosemann nämner transparens och ansvarsskyldighet som delar av processetiken, men kopplar dem inte till förklarbarhet. DMN beskrivs i nästa kapitel.
`,
  },
  {
    id: "kap10",
    number: 10,
    title: "BPMN: grunderna",
    readingMinutes: 12,
    lead: "Vad BPMN passar för, aktiviteter och task-typer, namngivning, gateways, pooler och lanes, message flow, subprocesser och call activity — och DMN i korthet.",
    sources: ["Björn Svenssons BPMN-genomgång (efter Silver 2017), s. 2–41", "Övningshäftet 1.1–1.3 (facit)", "Tenta HT25 omtenta 13, 14; HT24 fråga 15–25, 34–42, 46, 48", "DMN: F1 (inlämningsuppgiften), F2 (business rules engine) — preliminärt till F5 (12 okt)"],
    body: `
**BPMN** (Business Process Model and Notation) är en standard för att rita affärsprocesser. Den ägs inte av något enskilt företag utan förvaltas av Object Management Group (OMG). Kursens BPMN-material följer Bruce Silvers *Method and Style*. Det är en uppsättning regler ovanpå standarden som gör diagrammen entydiga.

## Vad BPMN passar för

BPMN beskriver processer som har en **definierad start och ett definierat slut**, som **utförs på instanser** (till exempel en order) och där **alla aktiviteter är kända i förväg**. Exempel är orderprocessen, rekryteringsprocessen och introduktionen av nyanställda. BPMN passar **inte** för kontinuerliga eller ostrukturerade processer som löpande återkopplingsslingor, ledningsprocesser eller ständig förbättring.

Tentan prövade det med fyra förslag. Rätt svar var ersättningshanteringen för en reseräkning, som skickas in, kontrolleras, kompletteras vid behov, attesteras och avslutas som **Utbetald** eller **Avslagen**. Förbättringsgruppen som tar emot idéer löpande, kunskapsdelningen i Teams utan avslutspunkt och policyarbetet som revideras vid behov saknar alla definierad start, slut och instans.

**Instansregeln** har en följd: alla aktiviteter i en process ska gälla samma sorts instans. En modell där vissa aktiviteter gäller en batch av order och andra en enskild order är fel.

## Aktiviteter och task-typer

En **aktivitet** är en arbetsenhet som tar tid. Den namnges **verb–objekt**: "Review loan application", inte "Loan application review". Typen visar hur arbetet utförs. Källorna skiljer sig åt: genomgången beskriver bara user och service task, några typer syns i tentans och häftets diagram, och resten finns bara som påståenden i HT24, som saknar facit.

- **User task** (en person), ur genomgången: utförs av en människa. Även när en person klickar på en knapp och systemet gör resten räknas det som user task.
- **Service task** (kugghjul), ur genomgången: automatiserad, utan mänsklig interaktion.
- **Send task** (fyllt kuvert) och **receive task** (ofyllt kuvert), ur tentans elementfråga och häftets facit: skickar respektive väntar på ett meddelande.
- **Manual task** (hand), ur tentans diagram: utförs för hand.
- **Script task**, ur HT24: kör ett skript.
- **Business rule task**, ur HT24: anropar en beslutsregel, till exempel en DMN-beslutstabell.

Valet av typ beror på aktivitetens natur och hur automatiserad den är. En automatisk e-postavisering är ingen user task, och ett chefsbeslut om en inköpsbegäran är ingen service task.

## Gateways

En **gateway** (romb) delar upp eller slår ihop sekvensflöden (heldragna pilar).

- **Exclusive gateway (XOR),** tom romb: exakt en av vägarna (gates) följs. Gatewayen **fattar inget beslut**. Beslutet är redan fattat i aktiviteten före, och gatewayen testar ett datavillkor som är sant eller falskt för varje gate.
- **Parallel gateway (AND),** plustecken: en **AND-split** startar alla utgående vägar samtidigt, och en **AND-join** väntar tills alla inkommande vägar har kommit fram. AND-gateways etiketteras aldrig.
- **Inclusive gateway (OR),** ring: **en eller flera** vägar aktiveras beroende på villkoren, men inte nödvändigtvis alla. Silvers exempel är en insättning: en väg för belopp över 10 000 USD, en för utländsk valuta och en tredje, "Log standard deposit", som är **default flow**. Default flow märks med ett litet snedstreck i början av flödet och tas bara när inget annat villkor är sant. 5 000 USD och 15 000 USD ger därför en väg var, och 1 000 000 SEK ger två vägar (stort belopp och utländsk valuta). Alla tre aktiveras aldrig samtidigt.
- **Event-based gateway,** femhörning i dubbelcirkel: väntar på händelser, och vägen avgörs vid körning (kapitel 11).

## Pooler, lanes och meddelanden

- **Pool:** en behållare för **en process**. Den etiketteras med processens namn, till exempel "Application screening process". Pooler är valfria. De används för att skilja processer som utbyter meddelanden i samma diagram.
- **Lane:** visar **vem som utför** aktiviteten. Den etiketteras med en roll eller en organisatorisk enhet, som "Loan officer" eller "Credit department". Genomgången råder att lägga till pooler och lanes sist. Var en gateway står säger inget om var beslutet fattas.
- **Black-box pool:** en tom pool utan händelser, aktiviteter och gateways. Den representerar en **extern deltagare**, som en kund eller sökande, eller en intern part utan egna definierade uppgifter i processen.
- **Message flow:** streckad pil med ring i början. Den visar envägskommunikation **mellan pooler**, aldrig inom samma pool. Den kopplas till en aktivitet, en subprocess, en meddelandehändelse eller en black-box pool, och namnges med ett **substantiv** ("Order", "Invoice").
- **Sequence flow:** visar ordningen mellan aktiviteter, händelser och gateways inom en process.
- **Association:** kopplar artefakter som textannoteringar och data till flödesobjekt.
- **Data store:** information i en applikation, databas eller fil som processen och externa parter kan läsa och skriva. Den kopplas med data associations och är ett alternativ till message flow för att föra över information.

Sequence flow, message flow och association kallas i en HT24-fråga för BPMN:s **connecting objects**.

## Namngivning

Kursens namngivningskonventioner ger diagrammen samma form:

| Element | Namn | Exempel |
|---|---|---|
| Message flow | Substantiv | Loan application |
| Message start event | Received [meddelandets namn] | Received loan application |
| Aktivitet | Verb–objekt | Review loan application |
| Exclusive gateway (som delar) | En fråga i formen [verb objekt] följd av frågetecken | Draft approved? |
| Gatewayens utgående flöden | Svaren på frågan, Yes och No när det finns exakt två | Yes / No |
| Sluthändelse | Processens sluttillstånd | Loan application approved |

Med fler än två utgångar blir svaren gatewayens möjliga utfall, till exempel "Draft approval status?" med Under review, Approved och Rejected. Här krockar källorna. Genomgången anger uttryckligen namnkonventionen "Receive [message name]", och övningshäftets facit använder "Receive order". Canvas-konventionen säger "Received [meddelandets namn]", och det är den som gäller för kursen. Övningshäftets facit har också oetiketterade XOR-gatewayer vars gates heter efter villkoren, till exempel "Customer present".

## Subprocesser

En **subprocess** består själv av aktiviteter. Den ritas **kollapsad**, med ett litet plustecken, och länkar till ett eget **barndiagram**. Den kan också ritas expanderad. Subprocesser gör diagrammen läsbara och hierarkiska. **Ett diagram bör ha högst tio aktiviteter.** Två regler gäller barndiagrammet:

1. Det måste ha en **otriggad start** (tom cirkel), eftersom det startas av att sekvensflödet når subprocessen i föräldern.
2. Om subprocessen följs av en gateway i föräldern ska **antalet sluthändelser i barnet vara lika med antalet gates**. I övningshäftets blombud slutar leveranssubprocessen i "Delivery succeeded" och "Delivery failed", och XOR-gatewayen efter den har exakt de två vägarna.

En **call activity** har **tjock ram**. Den anropar en fristående process som är modellerad separat och kan återanvändas av flera processer, till exempel en verifiering av finansiella uppgifter som både kreditkortsansökan och kontouppgraderingen använder. En **loop marker** betyder enligt ett HT24-påstående att aktiviteten upprepas tills ett villkor är uppfyllt. Tre lodräta streck, som på element A i omtentans elementfråga, är en parallell **multi-instance**-markör. Dess betydelse förklaras inte i kursmaterialet.

## DMN i korthet

**DMN** (Decision Model and Notation) beskriver **beslut** på samma sätt som BPMN beskriver processer. Beslutsreglerna läggs i **beslutstabeller**, och sambanden mellan beslut och deras indata visas i ett **DRD** (Decision Requirements Diagram). En processmotors business rules engine kan köra tabellerna. I BPMN-diagrammet kopplas beslutet in med en **business rule task**. Ett beslut kräver inte en XOR-gateway direkt efter sig. En gateway behövs bara om flödet faktiskt ska dela sig på utfallet. Gruppuppgiften använder DMN. På salstentan har DMN förekommit i HT24 fråga 23 (om ett beslut kräver en XOR efteråt, och hur DMN kopplas in via business rule task) och i HT25 (hur BPMN och DMN stödjer förklarbarhet, kapitel 9).
`,
  },
  {
    id: "kap11",
    number: 11,
    title: "BPMN: händelser och att köra en process",
    readingMinutes: 13,
    lead: "Starthändelser, throw och catch, timers, event-based gateway, boundary events, error, event subprocesser, terminate och OR-join — och hur du kör ett diagram steg för steg, som på tentan.",
    sources: ["Björn Svenssons BPMN-genomgång (efter Silver 2017), s. 27–66", "Tenta HT25 ord 3(b)–3(d), omtenta 13, 15, 16", "HT24 fråga 20, 44"],
    body: `
BPMN-frågorna ger upp till sju poäng styck, och de flesta går ut på att **köra ett diagram**. Det här kapitlet går igenom händelserna och sedan metoden. Diagrammen och övningarna finns i vyn Kör processen.

## Händelser: cirklar med tre kanttjocklekar

En **händelse** är något som inträffar. Formen visar var i processen den står:

- **Start:** tunn kant.
- **Intermediate:** dubbel kant.
- **End:** tjock kant.

Ikonen inuti visar vilken sorts signal det gäller, som meddelande (kuvert), timer (klocka) eller error (blixt).

### Tre sätt att starta

1. **Extern begäran:** en **message start** med kuvert, "Received loan application". Processen startar när ett meddelande kommer.
2. **Intern begäran:** en **none start**, alltså tom cirkel. Så startar ett barndiagram, när föräldern når subprocessen.
3. **Återkommande:** en **timer start**, till exempel "4th Day of the Month". Processen startar vid den tidpunkten.

### Throw och catch

**Intermediate events** inträffar mellan start och slut och beskriver hur processen hanterar en signal.

- **Throwing event** (fylld ikon): processen skickar signalen **direkt** när flödet når händelsen och går sedan vidare direkt.
- **Catching event** (ofylld ikon): signalen kommer utifrån. Processen **väntar** tills den kommer och fortsätter sedan.

En **catching timer** betyder antingen "vänta i [varaktighet]" eller "vänta tills [tidpunkt]". Varaktigheten räknas från när flödet når timern, inte från processens start.

### Event-based gateway

En **event-based gateway** följs av catching events. **Bara den väg vars händelse inträffar först aktiveras**. De andra vägarna stängs. Det är skillnaden mot en XOR, som testar data: här avgörs vägen vid körning av vilken händelse som hinner först.

## Boundary events

Ett **boundary event** sitter på kanten av en aktivitet och har **inga inkommande sekvensflöden**. Det lyssnar så länge aktiviteten pågår.

- **Interrupting** (heldragen dubbelcirkel): när signalen kommer **avbryts aktiviteten**, och processen följer undantagsflödet.
- **Non-interrupting** (streckad dubbelcirkel): **aktiviteten fortsätter**. Undantagsflödet startar parallellt, och när aktiviteten blir klar följer processen också sitt vanliga flöde.

Message- och timerhändelser kan vara non-interrupting. Genomgångens exempel är ett meddelande om kompletterande uppgifter under granskningen, och en avisering till sökanden om handläggningen dröjer. **Error boundary events är alltid interrupting.**

### Error

En subprocess kan kasta ett fel. Barndiagrammet slutar då i ett **error end event** (tjock cirkel med blixt), och i föräldern sitter ett **error boundary event** på subprocessen och fångar det. Undantagsflödet tar över och subprocessens vanliga väg ut används inte. Error används för både tekniska och affärsmässiga undantag.

## Event subprocess

En **event subprocess** ritas med **streckad ram** inne i processen. Den har en **triggad start** (meddelande, timer och så vidare) och **inga inkommande sekvensflöden**. Den kan starta **när som helst medan processen den ligger i körs**. En vanlig subprocess har tvärtom en otriggad start och startas av ett inkommande sekvensflöde. Kollapsad visar event subprocessen sin starthändelse i hörnet:

- **Heldragen startcirkel = interrupting.** Föräldern avbryts, och event subprocessen körs i stället. Exempel: en återkallad ansökan stoppar hela handläggningen.
- **Streckad startcirkel = non-interrupting.** Föräldern fortsätter, och event subprocessen körs vid sidan av. Exempel: en fråga om status besvaras utan att handläggningen störs.

Tentan frågade vilket av sex element som är en non-interrupting event subprocess som startar med message start. Rätt svar var den med **streckad ram, streckad cirkel med kuvert och plustecken**. Den med heldragen cirkel är interrupting, den med klocka är en timer, heldragna ramar med kuvert är send- och receive-tasks, och tjock ram är call activity.

## Terminate, deadlock och OR-join

En **terminate end** (tjock cirkel med fylld inre skiva) avslutar hela processnivån direkt, även parallella vägar som fortfarande pågår.

En **deadlock** uppstår när en AND-join väntar på en väg som aldrig kommer. Genomgången visar två fall med olika lösningar:

1. **Ett undantag i ett parallellt block:** en XOR på den ena vägen leder till ett eget slut, till exempel "Documentation collation failed". AND-joinen väntar då förgäves på den vägen. Lösningen är ett **terminate end** där undantaget slutar. Det avslutar hela processen, också den andra parallella vägen.
2. **Vägar som inte säkert aktiveras:** XOR:ns båda grenar leder in i joinen, den ena direkt och den andra via en extra aktivitet ("Collect missing documents"), så joinen har tre inkommande flöden men bara två får en token. Lösningen är en **OR-join**. Den används när det finns minst två parallella inkommande vägar och man inte kan garantera att alla aktiveras. OR-joinen väntar bara på de vägar som faktiskt är på väg, och processen fortsätter efter joinen.

Har en aktivitet **flera inkommande flöden utan gateway** startar den **en gång för varje token som kommer fram**. Det är standard i BPMN men förklaras inte i genomgången; konstruktionen används i övningshäftets 1.1 ("Invoice customer") och i tentans 3(b). Efter en XOR eller event-based gateway kommer bara en token, så aktiviteten körs en gång.

## Så kör du ett diagram

Tänk dig en **token**, en markör som vandrar längs sekvensflödena. Följ den med de här reglerna:

1. **Starta** där premisserna säger. Skriv upp starttiden om det finns en.
2. **Aktivitet:** token stannar så länge aktiviteten tar. Notera den som körd.
3. **XOR:** token följer den gate vars villkor är sant.
4. **AND-split:** token delas i en per väg. **AND-join:** vänta in alla.
5. **Event-based gateway:** jämför när händelserna inträffar. Den första vinner.
6. **Throw:** direkt. **Catch:** vänta tills signalen kommer. **Timer:** lägg till varaktigheten.
7. **Boundary och event subprocess:** kontrollera varje gång en signal kommer om den träffar något som pågår just då, och om det är interrupting eller non-interrupting.
8. **End:** processen är klar när ingen token finns kvar.

Läs premisserna noga. De säger vilka meddelanden som kommer och när, vilka villkor som gäller och hur lång tid saker tar.

### Genomgång 1: event-based gateway

En process startar när Message A tas emot och kör Activity A. Efter A kommer en event-based gateway med två vägar. Den ena är en catching message (Message B) följd av Activity B. Den andra är en timer på **4 dagar** följd av Activity C. B och C leder båda till Activity D, som har två inkommande flöden utan gateway. Sedan slutar processen och skickar Message C.

Premisserna: Message B kommer **2 dagar** efter att A avslutats.

| Steg | Vad som händer |
|---|---|
| A körs | Token når event-based gatewayen och väntar på Message B eller 4 dagar |
| Dag 2 | Message B kommer först. Den vägen vinner och timern stängs |
| B körs | Token går till D |
| D körs | Bara en token kommer fram, så D körs en gång. Processen slutar |

Svaret är **A, B, D**. C körs inte, eftersom timern aldrig hann gå.

### Genomgång 2: timers och datum

En **timer start "4th Day of the Month"** följs av Activity A (1 timme), en intermediate timer **48 Hours** och Activity B (1 timme). Processen startar **2025-12-04 kl. 00.01**.

| Steg | Tid |
|---|---|
| Start | 12-04 00:01 |
| A klar | 12-04 01:01 |
| Timern går ut (+48 h) | 12-06 01:01 |
| B klar | **12-06 02:01** |

Fällan är att räkna 48 timmar från starten (ger 12-06 00:01) eller att glömma någon av aktiviteterna. Omtentans variant hade "2nd Day of the Month", en manuell A på 2 timmar, **36 Hours** och B på 2 timmar, med start 2026-02-02 kl. 00.01. Då blir svaret 02:01, sedan 02-03 14:01 och till sist **02-03 16:01**.

### Genomgång 3: error end och error boundary

Activity A följs av Subprocess A, som har ett **error boundary event** ("Verification Failed"). Normalflödet går vidare till Activity E och "Work completed". Undantagsflödet går till Activity F och "Work not completed". I barndiagrammet kör Activity B, sedan en XOR "Missing Information?". **Yes** leder till Activity C och ett **error end** "Verification Failed". **No** leder till Activity D och ett vanligt slut.

Premissen: Missing Information = **Yes**.

A körs, och subprocessen startar. B körs, XOR väljer Yes och C körs. Error end kastar felet, som fångas av boundary eventet på subprocessen. Subprocessen avbryts och normalflödet används inte, så E körs aldrig. Undantagsflödet kör F. Svaret är **A, B, C, F**.

### Genomgång 4: non-interrupting event subprocess

Huvudprocessen kör Activity A. Sedan kommer en AND-split. Den ena vägen skickar Message B (throw) och kör Activity B. Den andra väntar **3 timmar** (timer) och kör Activity C. En AND-join leder till Activity D och slutet. Processen innehåller också en kollapsad event subprocess med **streckad ram och streckad startcirkel med kuvert**. Den startar på Message A och kör E och F.

Premisserna: Message A kommer 5 minuter efter A, event subprocessen tar 20 minuter, och Message B skickas 10 minuter efter A.

Den streckade cirkeln betyder **non-interrupting**. När Message A kommer efter 5 minuter startar E och F vid sidan av, och huvudprocessen fortsätter: B efter 10 minuter, C efter 3 timmar, sedan joinen och D. Svaret är **A, B, C, D, E, F**.

Distraktorn "A, E, F" är det svar en **interrupting** event subprocess skulle ge. Vid 5 minuter hade huvudprocessen avbrutits, innan Message B skickats och B startat, och varken C eller D hade körts. Premissen om de 10 minuterna finns där för att det fallet ska bli entydigt.
`,
  },
];

export const chapters = rawChapters.map((chapter) => ({
  ...chapter,
  ...(CHAPTER_TOPICS[chapter.id] || { topics: [], primaryTopics: [] }),
}));

export const glossary = [
  { term: "Activity-based costing (ABC)", definition: "80- och 90-talsmetod som kopplar kostnader till aktiviteter och resursförbrukning. Dyr att underhålla; principerna lever vidare i dagens analysverktyg.", chapter: "kap4" },
  { term: "Appreciative inquiry", definition: "Förändringsansats som utgår från det som fungerar och söker rotorsakerna till framgång, inte till fel (tolkning av HT24:s svarsalternativ; HT24 saknar facit).", chapter: "kap8" },
  { term: "BOAT", definition: "Business Orchestration and Automation Technologies: dagens plattformar för orkestrering och automatisering, där BPM-systemen ingår.", chapter: "kap2" },
  { term: "Bottom-up", definition: "BPM som startas av processägare eller team för lokala förbättringar. Ger quick wins och engagemang, men riskerar att stanna lokalt.", chapter: "kap3" },
  { term: "BPA (Business Process Automation)", definition: "Processautomation: att automatisera processer eller delar av dem.", chapter: "kap1" },
  { term: "BPM (Business Process Management)", definition: "Enligt Jeston implementering, exekvering och styrning (governance) av processer. En managementdisciplin, inte en mjukvara och inte bara modellering.", chapter: "kap1" },
  { term: "BPM lifecycle", definition: "Det akademiska perspektivets cykel: identifiering, modellering, discovery (as-is), analys, redesign (to-be), implementering och monitoring.", chapter: "kap1" },
  { term: "BPM-mognad", definition: "Hur långt en organisation kommit i att arbeta processorienterat. Tempot i BPM-arbetet ska matcha mognaden.", chapter: "kap8" },
  { term: "BPMS", definition: "Business Process Management System: programvara för att modellera, köra och följa upp processer, med en körbar processmodell som workflowmotorn tolkar.", chapter: "kap2" },
  { term: "BPR (Business Process Reengineering)", definition: "Hammers (1990) radikala omdesign av processer med hjälp av IT. För radikalt, dyrt och motståndsdrabbat; BPM:s föregångare.", chapter: "kap2" },
  { term: "Business as usual", definition: "Jestons fjärde scenario: BPM är fullt inbäddat i organisationens sätt att arbeta.", chapter: "kap3" },
  { term: "Business issue-led", definition: "BPM-initiativ som svarar på ett konkret verksamhetsproblem; taktiskt, lokalt och bottom-up.", chapter: "kap3" },
  { term: "Continuous process improvement (CPI)", definition: "Stegvis, ständig förbättring av processer, i motsats till BPR:s radikala omdesign.", chapter: "kap2" },
  { term: "Customer-centric BPM", definition: "BPM som utgår från kundens verkliga upplevelse: att ta bort irritationer ger mer än wow-faktorer; färre hand-offs, en kontaktpunkt.", chapter: "kap4" },
  { term: "Different sameness", definition: "Resultatet av att bara förbättra operational efficiency: små förbättringar utan verklig förändring.", chapter: "kap6" },
  { term: "Driver", definition: "Ett långsiktigt affärsskäl eller motiv som får organisationen att agera för att nå ett mål.", chapter: "kap3" },
  { term: "Employee-centric BPM", definition: "BPM som utgår från motiverade medarbetare, empowerment och servant leadership.", chapter: "kap4" },
  { term: "Enablement", definition: "Fas 2 i 7FE: bygger komponenterna i TOM — kommunikation, process governance, processarkitektur, performance management, människor och kultur, organisationsdesign och teknik.", chapter: "kap6" },
  { term: "Enterprise Architecture (EA)", definition: "Den övergripande ritningen för hur organisationen ska realisera sin strategi. BPM är ett operativt lager i EA.", chapter: "kap1" },
  { term: "Essentials (7FE)", definition: "De tre förmågor som krävs i alla faser: leadership, BPM project management och people change management.", chapter: "kap5" },
  { term: "Foundations", definition: "Fas 1 i 7FE: säkerställer linjeringen mellan strategi, processledning och processer. Skapar inte strategin.", chapter: "kap6" },
  { term: "Green BPM", definition: "Skärningen mellan BPM och Green IS: processer annoteras med resursförbrukning och utsläpp för miljömedveten design (Houy et al. 2012).", chapter: "kap9" },
  { term: "Husmetaforen", definition: "Jestons bild av BPM som ett hus i lager: regelverk, Foundations, Enablement, linjering, tre processrum och ett tak av styrning och kultur.", chapter: "kap5" },
  { term: "iBPMS", definition: "Intelligent BPMS: API-först-motorer som orkestrerar människor, botar och mikrotjänster.", chapter: "kap2" },
  { term: "Improve before automate", definition: "Jestons princip att processer ska förbättras innan de automatiseras, eftersom automatisering förstärker det som redan finns.", chapter: "kap4" },
  { term: "In the driver's seat", definition: "Jestons tredje scenario: BPM är erkänt som strategiskt verktyg, med växande styrning.", chapter: "kap3" },
  { term: "Management effectiveness", definition: "Förmågan och disciplinen i ledningsprocesserna. Ger uthållig konkurrensfördel när den är inbäddad; en av execution voidens två delar.", chapter: "kap6" },
  { term: "Operational efficiency", definition: "Kvaliteten i de operativa processerna. Höjer produktiviteten men ger sällan varaktig fördel ensam.", chapter: "kap6" },
  { term: "Performance management", definition: "Strukturerad mätning, ansvar och ständig förbättring av nyckelprocesserna med KPI:er.", chapter: "kap6" },
  { term: "Petri-nät", definition: "Carl Adam Petris formella modell (1962) för processflöden och samtidighet; föregångare till den visuella processmodellen.", chapter: "kap2" },
  { term: "Pilot project", definition: "Jestons andra scenario: avgränsade projekt för att bevisa BPM:s värde; chefen är fullt informerad men bara delvis engagerad.", chapter: "kap3" },
  { term: "Process architecture", definition: "Regler, principer och riktlinjer för hur processer designas och förvaltas, linjerade med EA.", chapter: "kap6" },
  { term: "Process asset", definition: "Centralt arkiv av processmodeller, dokumentation och metadata (regler, IT-system, roller, risker). Processmodellen är en del av den.", chapter: "kap6" },
  { term: "Process governance", definition: "Styrningen av processer: roller för beslutsansvar, affärsrisker och prestationsstyrning.", chapter: "kap6" },
  { term: "Process steward", definition: "Ansvarar för enskilda processer och BPM-projekt, och för prestationsstyrningen på processnivå.", chapter: "kap6" },
  { term: "Process-led", definition: "BPM-initiativ som processansvariga startar på eget initiativ, ofta för att visa BPM:s värde.", chapter: "kap3" },
  { term: "Processnivåer", definition: "Jestons fem nivåer av processbeskrivning, från enterprise-processkarta (1) till detaljer för systemutvecklare (5).", chapter: "kap6" },
  { term: "Processoptimeringslösningar", definition: "Enligt Jeston: process redesign, outsourcing, shared services, RPA och cloud computing.", chapter: "kap4" },
  { term: "Produktivitetsparadoxen", definition: "Att 70- och 80-talens IT-investeringar inte syntes i produktiviteten (Solow 1987).", chapter: "kap2" },
  { term: "Quick win", definition: "En förbättring som genomförs snabbt och billigt och ger omedelbar effekt i en process.", chapter: "kap3" },
  { term: "Red Wine Test", definition: "Visionsövning där deltagarna föreställer sig att projektet är klart och beskriver framtiden, med ansvar per svar. Skapar ett gemensamt narrativ om framgång.", chapter: "kap6" },
  { term: "RPA (Robotic Process Automation)", definition: "Mjukvarurobotar som härmar människors interaktion med applikationer. Begränsning: arbetar via UI, inte robusta integrationer.", chapter: "kap2" },
  { term: "Sarbanes-Oxley (SOX)", definition: "Amerikansk lag 2002 efter Enron som krävde spårbar intern kontroll av processerna kring finansiell rapportering.", chapter: "kap2" },
  { term: "Servant leadership", definition: "Ledarskap som stödjer, coachar och möjliggör i stället för att detaljstyra.", chapter: "kap4" },
  { term: "7FE", definition: "Jestons ramverk: tio faser i fyra F-grupper (Foundations, Findings & solutions, Fulfilment, Future) plus tre essentials.", chapter: "kap5" },
  { term: "SOA", definition: "Service-Oriented Architecture: affärsfunktioner som återanvändbara, löst kopplade tjänster som processer kan orkestrera.", chapter: "kap2" },
  { term: "Spreadsheet-testet", definition: "Jestons mått: hur många kritiska processteg vilar på kalkylark? Kalkylark signalerar att processen behöver förbättras före automatisering.", chapter: "kap4" },
  { term: "Strategy execution void", definition: "Gapet mellan organisationens strategiska avsikt och dess förmåga att genomföra strategin; består av management effectiveness och operational efficiency.", chapter: "kap6" },
  { term: "Strategy-led", definition: "BPM-initiativ som följer av strategin och startar i Foundations och Enablement; top-down.", chapter: "kap3" },
  { term: "Target Operating Model (TOM)", definition: "Övergripande bild av hur organisationens delar ska fungera i framtiden. Sju komponenter: strategy, process governance, process architecture, performance management, people and culture, organization design, technology.", chapter: "kap6" },
  { term: "Top-down", definition: "BPM som drivs av ledningen med strategisk linjering, mandat och styrning; för strategiska och tvärfunktionella förändringar.", chapter: "kap3" },
  { term: "Trigger", definition: "En händelse som får organisationen att agera nu, för ett akut problem eller en påtvingad förändring.", chapter: "kap3" },
  { term: "Under the radar", definition: "Jestons första scenario: små informella BPM-insatser med begränsat stöd från ledningen.", chapter: "kap3" },
  { term: "AND-gateway (parallel)", definition: "Plustecken i romb. Split startar alla utgående vägar, join väntar in alla inkommande. Etiketteras aldrig.", chapter: "kap10" },
  { term: "Black-box pool", definition: "Tom pool som representerar en extern deltagare, till exempel kunden. Kommunicerar med processen via message flow.", chapter: "kap10" },
  { term: "Boundary event", definition: "Händelse på kanten av en aktivitet, utan inkommande flöden. Interrupting (heldragen) avbryter aktiviteten, non-interrupting (streckad) låter den fortsätta.", chapter: "kap11" },
  { term: "BPMN", definition: "Business Process Model and Notation: öppen standard från OMG för att beskriva processer med definierad start och slut som körs på instanser.", chapter: "kap10" },
  { term: "Business case", definition: "Beskrivningen av BPM-aktivitetens nytta och kostnad: på vanligt språk, gärna på en sida, med evidens. Realize-fasen följer upp den.", chapter: "kap7" },
  { term: "Business rule task", definition: "Aktivitet som anropar en beslutsregel, till exempel en DMN-beslutstabell.", chapter: "kap10" },
  { term: "Call activity", definition: "Aktivitet med tjock ram som anropar en fristående, återanvändbar process.", chapter: "kap10" },
  { term: "Catching event", definition: "Händelse där processen väntar på en signal utifrån (ofylld ikon).", chapter: "kap11" },
  { term: "Data store", definition: "Information i en applikation, databas eller fil som processen och externa parter läser och skriver via data associations.", chapter: "kap10" },
  { term: "Deadlock", definition: "När en join väntar på en väg som aldrig aktiveras. Löses med OR-join eller terminate end.", chapter: "kap11" },
  { term: "DMN", definition: "Decision Model and Notation: beslutsregler i beslutstabeller och DRD (Decision Requirements Diagram).", chapter: "kap10" },
  { term: "Error end event", definition: "Sluthändelse med blixt som kastar ett fel till ett error boundary event på subprocessen i föräldern.", chapter: "kap11" },
  { term: "Event subprocess", definition: "Subprocess med streckad ram, triggad start och inga inkommande flöden. Kan starta när som helst medan processen körs; heldragen startcirkel avbryter föräldern, streckad gör det inte.", chapter: "kap11" },
  { term: "Event-based gateway", definition: "Gateway följd av catching events; bara vägen vars händelse inträffar först aktiveras.", chapter: "kap11" },
  { term: "Handover och takeover", definition: "Planerna för hur BPM-teamet lämnar över och verksamheten tar över det nya arbetssättet.", chapter: "kap7" },
  { term: "Innovate", definition: "Fas 5 i 7FE: design av framtida processer (to-be) och validerade lösningsförslag.", chapter: "kap8" },
  { term: "Lane", definition: "Del av en pool som visar vem som utför aktiviteterna: en roll eller organisatorisk enhet.", chapter: "kap10" },
  { term: "Large Process Model (LPM)", definition: "En LLM som finjusterats och kompletterats med processkunskap och prestationsdata: en samlad, datadriven kunskapsbas som kan ge automatiserade rekommendationer för processförbättring (Kampik et al. 2025, SAP Signavio).", chapter: "kap9" },
  { term: "Launch", definition: "Fas 3 i 7FE: den formella starten av en BPM-aktivitet med scope, intressenter, processmål, processval, business case och team.", chapter: "kap7" },
  { term: "Message flow", definition: "Streckad pil mellan pooler som visar envägskommunikation; namnges med ett substantiv. Aldrig inom samma pool.", chapter: "kap10" },
  { term: "OR-gateway (inclusive)", definition: "Ring i romb. En eller flera vägar aktiveras efter villkoren; som join väntar den bara på de vägar som faktiskt aktiverats.", chapter: "kap10" },
  { term: "Default flow", definition: "Utgående flöde från en gateway, märkt med ett snedstreck i början, som tas bara när inget annat villkor är sant (Silvers insättningsexempel: Log standard deposit).", chapter: "kap10" },
  { term: "People change management", definition: "En av 7FE:s essentials: att alla berörda kan och vill ta till sig och bidra till den framtida lösningen.", chapter: "kap8" },
  { term: "Pool", definition: "Behållare för en process, etiketterad med processens namn.", chapter: "kap10" },
  { term: "Process selection matrix (PSM)", definition: "Launch-fasens verktyg som visar en affärsenhets processer mot scenarier som produkter och kanaler, för att se komplexitet och kopplingar. Prioriteringen görs med verktyg som Process Worth Matrix.", chapter: "kap7" },
  { term: "Processautonomisering", definition: "Rosemann et al.: när processen själv fattar beslut utifrån mål och begränsningar; nästa steg efter automatisering.", chapter: "kap9" },
  { term: "Realize", definition: "Fas 9 i 7FE: säkerställer att nyttan i business case realiseras.", chapter: "kap8" },
  { term: "Sequence flow", definition: "Heldragen pil som visar ordningen mellan aktiviteter, händelser och gateways inom en process.", chapter: "kap10" },
  { term: "Service task", definition: "Automatiserad aktivitet utan mänsklig interaktion (kugghjul).", chapter: "kap10" },
  { term: "SMART", definition: "Krav på processmål: specifika, mätbara, uppnåeliga, realistiska och tidsbundna.", chapter: "kap7" },
  { term: "Subprocess", definition: "Aktivitet som själv består av aktiviteter; kollapsad med plustecken och ett barndiagram med otriggad start.", chapter: "kap10" },
  { term: "Sustainability (7FE)", definition: "Fas 10 i 7FE: styrning och ständig förbättring fortsätter så att förbättringarna består. Betyder uthållig konkurrensfördel, inte miljömässig hållbarhet.", chapter: "kap8" },
  { term: "Terminate end event", definition: "Sluthändelse med tjock cirkel och fylld inre skiva som avslutar hela processnivån direkt, även parallella vägar. Löser deadlock när ett undantag i ett parallellt block har ett eget slut.", chapter: "kap11" },
  { term: "Three drifts", definition: "Rosemann et al. (2024): från transaktion till konversation, från automatisering till autonomisering, från förenkling till sofistikering.", chapter: "kap9" },
  { term: "Throwing event", definition: "Händelse där processen skickar en signal direkt och går vidare (fylld ikon).", chapter: "kap11" },
  { term: "Timer event", definition: "Klocka. Som start: återkommande tidpunkt. Som intermediate: vänta en varaktighet eller tills en tidpunkt.", chapter: "kap11" },
  { term: "Token", definition: "Tankemodellen för att köra ett diagram: en markör som vandrar längs sekvensflödena.", chapter: "kap11" },
  { term: "Understand", definition: "Fas 4 i 7FE: modellering av nuläget för en gemensam, faktabaserad bild av hur processen fungerar i dag, för att analysera hur den kan förbättras.", chapter: "kap7" },
  { term: "User task", definition: "Aktivitet som utförs av en människa, även om systemet gör resten efter ett klick.", chapter: "kap10" },
  { term: "XOR-gateway (exclusive)", definition: "Tom romb. Exakt en väg följs; gatewayen testar ett datavillkor, beslutet är redan fattat.", chapter: "kap10" },
];
