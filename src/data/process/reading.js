// Kompendiet (löptext) och ordlistan för delkursen Processorienterad
// verksamhetsutveckling (BPM).
//
// Ansvarsfördelning som för Strategi: löptexten ägs HÄR, de korta punkterna
// ägs av topics.js. Kapitelavslutet renderas ur `primaryTopics`.
//
// Källäget (2026-10-12): Weavers föreläsningar F1–F5 (F5 bara bilderna), Björns BPMN-genomgång
// och övningshäfte, de fyra artiklarna och HT25-tentorna. HT24-tentorna (den
// förra lärarens) används inte som källa sedan 2026-09-30. Jeston (2022)
// och Silver (2017) finns inte tillgängliga; allt som sägs om dem kommer från
// föreläsningarna eller tentafrågorna och anges i `sources`. Kapitel som
// bygger på tentafrågor snarare än föreläsning är märkta "preliminärt" i
// `sources`. Kapitel 4, 7, 8 och 9 är omskrivna mot F4 (5 okt 2026) och har
// inte längre den markeringen. Ingen markering i UI.
//
// Kapitelschema: { id, number, title, lead, readingMinutes, sources, body }
//
// Sammanfattningen (summary.js) är inget kapitel och står inte här.
export { summary } from "./summary.js";

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
    sources: ["F1 (Weaver 22 sep 2026; del 1 om tentan och övningsquizzen, del 2 om normativ litteratur)", "F2 (sammanfattning)", "Tentor HT25 ord 21 nov 2025 och omtenta 9 jan 2026"],
    body: `
## Så ser tentan ut

Tentan är en salstenta i Inspera på 3 hp, **13 november**, utan hjälpmedel. Omtentan är 7 januari. Weaver har sagt att tentan har "ett fåtal (2–3) kortare essäfrågor, inte om BPMN" och "ett antal flervalsfrågor (10–15)" som inkluderar BPMN. Den sannolika formen är därför HT25:s, som båda HT25-tentorna hade exakt:

| Del | Innehåll | Poäng |
|---|---|---|
| Essä | 2 frågor à 15 p, högst 300 ord var, inga minuspoäng | 30 |
| Flerval BPM | 10 frågor à 5 p, fyra alternativ | 50 |
| Flerval BPMN | 4 frågor à 3–7 p, fyra till sex alternativ | 20 |

Betygsgränserna är A 85, B 75, C 65, D 55 och E 50 procent. Rätt svar ger frågans poäng, **fel svar ger −1** och obesvarad fråga 0.

Essäfrågorna handlar aldrig om BPMN. De börjar alltid med Jeston (2022) — "Jeston (2022) framhåller …", "menar att …" eller "Enligt Jeston …" — och ber dig förklara och diskutera en av hans principer. BPM-flervalsfrågorna är en blandning av begreppsfrågor och scenarier, där en organisation beskrivs och du ska avgöra vad Jeston rekommenderar eller vilket begrepp det gäller. På HT25 var 7 av 20 scenarier. BPMN-frågorna går till största delen ut på att **köra ett diagram**: vilka aktiviteter körs, och när är processen klar? Frågorna bygger enligt Weaver på litteraturen och föreläsningarna, så inget ska dyka upp som du inte känner igen.

**Vilka gamla tentor som gäller.** Weavers egna HT25-tentor finns som övningsquiz, BPM och BPMN, på Canvas, med svar. Han rekommenderar quizzen framför tentorna. Äldre tentor gjordes av en annan lärare och är inte representativa. Weaver säger att man kan strunta i dem, och det här kompendiet använder dem inte som källa.

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

[[diagram:bpm-livscykeln]]

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

[[diagram:bpm-ea-lager]]

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

Weaver ger två skäl till den kritiska blicken. Det första är att normativ litteratur prövas av **marknaden**, inte av forskning. Ett recept som blir populärt och används, som balanced scorecard, har visat sig användbart, men ingen kan göra ett experiment där ett globalt företag kör BPM och ett annat inte gör det. Som med en del läkemedel vet man att receptet fungerar utan att veta exakt varför. Det andra är att Jeston har ett **egenintresse**. När han avmystifierar BPM och säger att det saknas robusta metoder, så att man bör följa en beprövad, är det hans egen metod han pekar på. När han beskriver vad konsulter kan bidra med kan boken också läsas som en säljtext för konsulttjänster.
`,
  },
  {
    id: "kap2",
    number: 2,
    title: "Hur BPM växte fram",
    readingMinutes: 10,
    lead: "Från Taylor och kvalitetsrörelsen via BPR och workflowforskningen till BPMS, RPA och agentisk AI — och varför BPR gick för långt.",
    sources: ["F1 (Weaver 22 sep 2026; BPR:s empowerment, RPA och UiPath)", "F2 del 1 (RPA i praktiken)", "Hammer (1990) s. 104–112", "Reijers (2021) s. 4", "Rosemann et al. (2024) s. 420–421", "Tenta HT25 ord 2(b), omtenta 8", "F1 (kvalitetsrörelsen: CPI, Lean, Six Sigma)"],
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

Weaver lyfter en sida som ofta glöms: BPR skulle **ge medarbetarna mer ansvar** (empowerment). Med en dator kunde en sekreterare göra mycket mer varierade och intressanta uppgifter än att skriva brev. I praktiken blev det tvärtom. Chefer såg chansen att låta en person med dator göra fyras arbete och sparka resten, eller att outsourca allt utom kärnkompetensen. Weavers poäng är att **samma diskussion förs i dag om AI**: många förespråkar att allt ska göras om från grunden för att dra nytta av tekniken, och motståndet på arbetsplatserna känns igen.

Kort sagt: BPR var **för radikalt, för dyrt och mötte för mycket motstånd**. BPM tar med sig idén om processerna som helhet, men arbetar stegvis, med människorna och med ständig förbättring i stället för revolution.

## Workflow, standarder och krav

Parallellt utvecklades i Europa en **formell modellering av arbetsflöden**. Carl Adam Petris **Petri-nät** (1962) beskrev processflöden och samtidighet matematiskt och gav oss den visuella processmodellen. BPM som akademiskt fält växte fram 1998–2003 ur mötet mellan amerikanskt affärsprocesstänkande och europeisk workflowforskning. Den första BPM-konferensen hölls i Eindhoven 2003.

Två krav utifrån spred processdokumentationen. **ISO 9000:2000** ökade kraven på att processer är beskrivna. Efter Enronskandalen kom **Sarbanes-Oxley (SOX)** 2002, som krävde spårbar intern kontroll av alla processer kring den finansiella rapporteringen. BPM gav metoderna, verktygen och notationen, och SOX ledde till en bred användning av BPM och en push mot standardisering, till exempel BPMN.

## BPMS, SOA och vågen efter

På 90-talet fanns processlogiken i workflowsystem och ERP. Under 2000-talet kom **BPMS**, körbara processmotorer med övervakning, och **SOA**, där affärsfunktioner exponeras som återanvändbara, löst kopplade tjänster. Tillsammans kan en process orkestrera aktiviteter över många system och funktioner. Weaver sammanfattar BPM-rörelsen kring Smith och Fingar (2003) och Harmon (2003) så: BPM är agilt i stället för monolitiskt, som förändring och ständig förbättring i stället för revolution, och ett förenat angreppssätt för teknik, ledning och människor med uthållig konkurrensfördel som mål.

På 2010- och 2020-talen används ordet BPM mindre i marknadsföringen. Man talar om process orchestration, Digital Process Automation, process mining och **iBPMS**: API-först-motorer som orkestrerar människor, botar och mikrotjänster.

## RPA

2015–2022 var **Robotic Process Automation** huvudspåret. RPA är mjukvarurobotar som **härmar hur en människa klickar sig igenom applikationer**. Verktygen är low-code, så att medarbetare utan programmeringskunskaper kan konfigurera egna botar. Rosemann et al. (2024) och Reijers (2021) beskriver RPA på samma sätt: roboten automatiserar användarens interaktion med en uppgift.

Löftet om low-code höll dock inte helt. Weaver berättar att Björn, som arbetade med RPA när det var som hetast, fann att verktygen hade en tydlig tröskel: medarbetarna klarade sällan att bygga botar själva utan hjälp.

Just det är också **begränsningen**. Roboten arbetar via användargränssnittet, inte via robusta systemintegrationer, vilket gör den känslig och svår att skala. RPA passar bäst för uppgifter där stegen alltid är likadana och inte kräver omdöme. Tentans exempel är ett team som varje dag kopierar hundratals fakturarader från e-post till ett ERP-system.

Weaver visar hur snabbt vågen vände. Aktien i UiPath, det största RPA-bolaget, föll kraftigt i slutet av 2022, när ChatGPT kom och alla såg att generativ AI kunde ta över samma sorts arbete. I dag kallar UiPath sig en plattform för orkestrering och automatisering, och ordet RPA hittar man knappt längre.

## Agentisk AI och BOAT

I dag marknadsförs nästan allt som AI, men BPM-tänkandet och modelleringen finns kvar i bakgrunden. Rena RPA-företag konkurrerar nu med **agentisk AI-orkestrering**, där AI-agenter sköter hela arbetsflöden och fattar beslut på vägen. Visionen är att hela verksamheter automatiseras. Frågan Weaver lämnar öppen är vilken roll människorna då får. BPM-systemen är i dag en del av det som kallas **BOAT** (Business Orchestration and Automation Technologies).

Jestons egen bild av utvecklingen, som han kallar en "hype cycle", är egentligen en tidslinje: från Six Sigma via BPR:s topp och fall, BPM-rörelsen och RPA till generativ AI och AI-agenter.

[[diagram:bpm-tidslinje]]
`,
  },
  {
    id: "kap3",
    number: 3,
    title: "När och hur BPM startar",
    readingMinutes: 10,
    lead: "Drivers och triggers, framgångsfaktorerna, top-down mot bottom-up, tre sätt att initiera BPM och Jestons fyra scenarier.",
    sources: ["F2 (Weaver 25 sep 2026, figur 12.3)", "F3 (Launch steg 2)", "Tenta HT25 ord 2(g), omtenta 7, 9, 10", "F2 del 1 (Weavers förklaring av drivers och triggers, Amazon-exemplet)", "F2 del 2 (process-led)"],
    body: `
Flera av HT25-tentornas scenariofrågor kom härifrån: vad Jeston rekommenderar när ledningen inte är engagerad, vilket scenario en HR-avdelning befinner sig i, vilket angreppssätt en myndighet ska välja och vad som kännetecknar en quick win.

## Drivers och triggers

Jeston skiljer mellan två sorters anledningar att börja med BPM:

- En **driver** är ett affärsskäl eller motiv som får organisationen att agera för att nå ett mål. Weaver förklarar att drivers ofta är **interna och vardagliga**: de problem som alltid finns i en verksamhet, som flaskhalsar, processer som tar för lång tid, kostnader som är för höga, dåliga betyg på kundtjänsten eller hög **churn**, alltså att kunder eller anställda lämnar. Man kan arbeta **proaktivt** med dem, till exempel genom att följa ledande indikatorer.
- En **trigger** är en händelse som organisationen måste svara på. Den kommer ofta **utifrån** och ligger utanför organisationens kontroll: en ny lag, en skandal som Enron eller en viktig leverantör som går i konkurs. Triggers är mer reaktiva, men de **syns ofta i förväg**. En ny EU-reglering aviseras flera år innan den gäller, och då kan man börja planera.

Skillnaden ligger alltså i var skälet kommer ifrån och om man själv styr över det, inte i tidshorisonten. Enligt Jeston ska BPM startas först när drivers och triggers är **fastställda och överenskomna** av alla intressenter, **dokumenterade, kommunicerade och förstådda**, och synliga i hela organisationen.

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

Weaver ger ett exempel på varför top-down behövs: bara ledningen kan prioritera mellan processerna utifrån strategin. För Amazon, där kunden är allra viktigast, går en kundnära process före en leverantörsprocess. Den prioriteringen kan ingen längre ned i organisationen göra.

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
- **Process-led:** initiativet kommer ur processarbetet självt. Weaver förklarar det som en organisation som redan kan arbeta med processer och har en processlivscykel igång. Den ser löpande var flaskhalsarna uppstår och vilka processer som behöver ses över, och startar förbättringar därifrån, oberoende av en ny strategi eller ett akut problem.

## De fyra scenarierna

Jeston placerar BPM-insatser efter två dimensioner: **hur stor påverkan** de har på organisationen och **hur involverad chefen** (business manager) är, alltså hur informerad och hur engagerad.

| Scenario | Påverkan | Chefens involvering |
|---|---|---|
| **Under the radar** | Mindre processförbättringar | Delvis informerad, begränsat eller inget engagemang |
| **Pilot project** | Förbättrar eller gör om processer | Fullt informerad, delvis engagerad |
| **In the driver's seat** | Gör om processer från början till slut, eller affärsmodellen | Fullt informerad, fullt engagerad |

Figuren har också två zoner. **Exceeding mandate** är när påverkan är större än chefens involvering räcker till. **Under ambitious** är när chefen är mer involverad än insatsen utnyttjar. Det fjärde scenariot, **Business as usual**, finns inte i figuren utan bara i Weavers punktlista: BPM är "fully embedded" i organisationens sätt att arbeta.

[[diagram:bpm-scenarier]]

Under the radar är de små informella insatserna med begränsat stöd från ledningen. Tentans exempel är en HR-avdelning där två analytiker själva börjat kartlägga, cheferna vet om det men har inte prioriterat det, och arbetet sker sporadiskt utan budget eller formell styrning. En pilot ska bevisa BPM:s värde. In the driver's seat betyder att BPM är erkänt som strategiskt verktyg med växande styrning. **Business as usual** betyder att BPM är helt inbäddat i organisationens sätt att arbeta. Det betyder inte att BPM-arbetet vilar. Scenariot avgör hur noggrant och brett ramverket används.

## Quick wins

En **quick win** är en förbättring som kan genomföras snabbt, utan stora kostnader, och som ger en omedelbar förbättring i en process. Quick wins bygger förtroende och momentum, särskilt bottom-up. Redan i Launch-fasens intressentintervjuer letar BPM-teamet efter quick wins som betyder något för intressenterna. En quick win har inte liten praktisk effekt, och den kräver varken konsulter eller omfattande förstudier. Understand tar fram dem också systematiskt, i sitt steg 10, som förbättringar som kan genomföras inom fyra till åtta veckor (kapitel 7).

## Vem som är inblandad

BPM kan omfatta allt från att driva projekt och detaljgranska processer till modellering, redesign, mätning, implementering och löpande förvaltning. Det kan också sträcka sig till leverantörer, kunder och andra externa intressenter. Externa BPM-experter och konsulter är användbara som coacher, oberoende granskare, konfliktlösare när program kör fast, startstöd och utvärderare av resultatet. Men för långsiktig framgång bör BPM-ledningen finnas inne i organisationen.
`,
  },
  {
    id: "kap4",
    number: 4,
    title: "Improve before automate, och BPM:s perspektiv",
    readingMinutes: 10,
    lead: "Varför processer ska förbättras innan de automatiseras, spreadsheet-testet, BPMS-komponenterna, kund- och medarbetarperspektivet och processoptimeringslösningarna med sina risker.",
    sources: ["F2 (Weaver 25 sep 2026)", "F2 del 1 (Weavers exempel: kompenserande medarbetare, projektkursen, invändningen om system)", "F4a och F4 del 1 (Weaver 5 okt 2026): optimeringslösningarna, riskjämförelsen, processbesluten", "Tenta HT25 ord 1(b), 2(c), 2(f); omtenta 12"],
    body: `
## Improve before automate

Den här principen var en av HT25-tentans två essäfrågor. Jeston är kategorisk: **automatisering ska aldrig läggas på ineffektiva processer**. Då förstoras bara ineffektiviteten.

Weaver presenterar regeln med Bill Gates ord: automatisering av en effektiv verksamhet förstärker effektiviteten, och automatisering av en ineffektiv verksamhet förstärker ineffektiviteten.

Mekanismen är enkel. **Automatisering förstärker det som redan finns.** En effektiv process blir effektivare när den automatiseras. En ineffektiv process blir sämre, eftersom felen, omvägarna och de onödiga stegen nu körs snabbare, oftare och i större skala, och blir inbyggda i systemet. Att automatisera dåliga processer leder typiskt till:

- **bortkastade investeringar**
- **frustrerade medarbetare**
- **svag användning** av BPM-systemen

Weaver förklarar varför en dålig process är så svår att automatisera. I en dålig process är det ofta **erfarna medarbetare som kompenserar**. De vet var processen fastnar och hur man tar sig ur fällorna, och det är deras kunskap som håller den igång. En automatisering har inte den kunskapen, så den stannar eller går snett hela tiden. Därför måste processen förstås, kartläggas och designas om innan den automatiseras.

Bakom det ligger Jestons syn på teknik: **technology is an enabler, not a solution.** Tekniken kan inte kompensera för en dålig processdesign. Därför ska man minska komplexiteten och förbättra processen **innan** tekniken införs. Grunderna kommer först: förstå, kartlägg och förbättra processflödet och affärsreglerna, och inför sedan systemet.

[[diagram:bpm-forstarkning]]

Weaver har en invändning mot Jeston. Boken tonar ned systemen och lägger tyngden på kultur, vilket är rimligt, men i dag går förändringen inte att genomföra utan system. Processarbetet är IT-drivet, och någon form av plattform som kan hantera processerna behövs. Principen gäller alltså **ordningen**, inte att tekniken är oviktig.

Principen har en historisk udd. Hammers kritik 1990 var just att företagen automatiserade gamla arbetssätt, och han förklarade produktivitetsparadoxen från kapitel 2 på samma sätt.

Ett eget exempel: ett företag inför en workflowlösning för attester, men attestkedjan har fem nivåer där tre bara skickar vidare. Automatiseras den som den är går varje ärende nu digitalt genom fem nivåer. Förbättras den först räcker kanske två, och automationen gör den kortare kedjan snabb.

### Spreadsheet-testet

Jeston föreslår ett enkelt mått: **hur många av dina kritiska processer eller processteg vilar på kalkylark?** De flesta organisationer hanterar processfel genom att lägga till fler kalkylark i stället för att förstå och lösa grundorsaken. Används kalkylark i processerna behöver processerna **förbättras innan de automatiseras**. System som är ändamålsenliga ska göra kalkylarken onödiga.

Weaver ser testet bekräftas varje år i projektkursen där studenter går ut till företag. Flera företag, stora som små och även IKEA, driver en kritisk process i ett kalkylark. Kalkylarket är ett bra verktyg för att strukturera och räkna i en enkel process, men det är inte ett verktyg för att styra och orkestrera processer.

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

[[diagram:bpm-kundupplevelsen]]

**Employee-centric BPM** utgår från att motiverade medarbetare är grunden för god service. Medelbra processer som levereras av entusiastiska medarbetare slår ofta utmärkta processer som levereras av oengagerad personal. Fokus ligger på empowerment, omsorg och rätt arbetsmiljö och attityd. Chefen ska vara en **servant leader** som stödjer, coachar och möjliggör i stället för att detaljstyra. FAIL läses som **First Attempt In Learning**, en lärande kultur.

Jestons slutsats är **balans**. Utan kunder finns ingen verksamhet, och utan medarbetare får kunderna ingen service. En redesign ska prövas från båda hållen: hur effektiv och tillfredsställande är processen för kunden, och hur effektiv och stärkande är den för medarbetaren? Weaver jämför med den resursbaserade synen från Strategi: stödprocesserna och människorna kan vara en källa till uthållig konkurrensfördel.

## Processoptimeringslösningar

I Innovate (kapitel 8) börjar själva optimeringen. **Processoptimering** uppnås genom att processerna designas om eller förnyas (**redesign or innovation**). Även här gäller **technology is an enabler, not a solution by itself**: hanteras inte kultur och människor levererar inte ens de bästa verktygen något resultat.

Jeston räknar fem typiska **processoptimeringslösningar**:

1. **Process optimization (BPM):** att behålla processen men designa om den. Tentans svarsalternativ kallar den **process redesign**. Weaver kallar den kärnan i BPM, och den prövas alltid. Namnet används både för alla fem lösningarna och för den här.
2. **Outsourcing:** processen läggs ut på en tredje part, i dag ofta ett företag som säljer **software as a service (SaaS)**. Weavers exempel är en liten process som att kunden kan följa servicebilen, men man kan också lägga ut hela CRM-funktionen.
3. **Shared services:** en process som finns på flera ställen görs till en gemensam tjänst i stället för att dubbleras. Weaver tänker på stora företag, där en avdelning kanske inte vet att en annan har byggt en välfungerande process.
4. **RPA:** en mjukvarurobot, en virtuell medarbetare, som utför uppgifter med tydliga, repetitiva regler. Den arbetar i de befintliga systemen på samma sätt som en människa, utan att systemen byts ut och utan stor IT-utveckling, till exempel med datainmatning, automatiska e-postmeddelanden, arkivering och periodiska rapporter. Weaver beskriver RPA som snabbt och enkelt att införa men svårt att skala till hela företaget (jämför kapitel 2). I dag är det mer en hygienfaktor i moderna BPM-system.
5. **Cloud computing (bakgrund):** nytt och hett när Jeston skrev, men enligt Weaver hör det inte riktigt hit. Molnet är infrastruktur, och i dag ligger nästan alla processer i molnet i någon mening.

Tentans exempel på valet: ett team som varje dag kopierar fakturarader från e-post till ett ERP-system, där stegen alltid är likadana och inte kräver omdöme, är ett fall för RPA.

Håll isär listorna. Leadership, project management och people change management är 7FE:s essentials (kapitel 5), inte optimeringslösningar. Customer- och employee-centric är perspektiv, inte lösningar.

### Riskjämförelsen

Weaver betonar riskbedömningen. Kursens riskjämförelse ställer fyra av lösningarna (inte cloud computing) mot tolv önskade affärsresultat (**desired business outcomes**). Mönstret:

- **Outsourcing** (där kallad BPO) har högst risk: kontrollen över riskerna och de framtida kostnaderna, att snabbt kunna byta strategi, att de egna processerna optimeras och att behålla kompetensen. Samtidigt ger den säkrast kortsiktiga besparingar.
- **Shared services** ligger mest på medel men delar fyra av outsourcingens höga risker.
- **Processoptimering** har ingen hög risk, men medelrisk för kortsiktiga besparingar, implementeringsinsatsen, lägre rekryteringskostnader och färre mänskliga fel.
- **RPA** har lägst risk av alla, med medelrisk bara för kortsiktiga besparingar och implementeringsinsatsen.

Tre områden gäller alla fyra lösningar, oavsett vilken som väljs: **process performance & management** (prestation och styrning), **organisational change management** (förändringsledning) och **workforce management / organisational design** (bemanning och organisationsdesign).

Weaver förklarar riskerna strategiskt: hör processen till det företaget vill vara bra på? Amazon har kundperspektivet i centrum, så att lägga ut kundprocesserna vore hög risk. Innan en process läggs ut måste man försäkra sig om att den inte är strategisk. Servicebilen är motsatsen: slutar spårningen fungera är det inte hela världen. Processoptimering kan man alltid göra, och en RPA-robot som inte fungerar kostar bara några timmar. Samma resonemang finns i **Process Worth Matrix** i Understand (kapitel 7), där processerna bedöms efter strategisk vikt och ekonomiskt värde.

### Processbeslut i Understand, lösningar i Innovate

Lösningarna ska inte blandas ihop med processbesluten i Understand (kapitel 7). I steg 9 (**identify innovate priorities**) bestäms utifrån modellerna, måtten och rotorsaksanalysen vad som ska hända med varje process: **leave as is**, **improve**, **amalgamate**, **redesign**, **innovate radically**, **outsource**, **insource** eller **eliminate**. Besluten avgör vilka processer som går vidare till Innovate, där lösningen väljs, alltså hur processen ska optimeras.

Två ord finns på båda ställena. **Outsourcing** är i Understand ett beslut om en process och i Innovate en lösning vars risk vägs. **Redesign** som processbeslut betyder att processen byggs om från grunden, på ett blankt papper; lösningen som tentan kallar process redesign betyder enligt Weaver att man behåller processen och ändrar den.
`,
  },
  {
    id: "kap5",
    number: 5,
    title: "7FE-ramverket och huset",
    readingMinutes: 9,
    lead: "Jestons husmetafor, 7FE:s tio faser och tre essentials, framgångspallen, ramverkets styrkor och svagheter, och varför one size fits all inte fungerar.",
    sources: ["F2 (Weaver 25 sep 2026; del 2: framgångspallen, huset som målbild, Jestons video om 7FE, one size fits all)", "F3 (husbilden; stegen ska inte memoreras)", "Tenta HT25 ord 2(d), omtenta essä 2"],
    body: `
## Boken och ramverket

Jestons bok har tre delar. Del 1 (kapitel 1–10) är en översikt i frågeform: vad, varför, hur och vem. Del 2 (kapitel 11–27) svarar på hur man gör BPM med **7FE-ramverket**. Del 3 innehåller fallstudier och BPM-mognad. För varje fas i 7FE beskriver Jeston fyra saker: **Why** (skälet), **Results** (förväntade resultat), **How** (stegen) och **Output och risks**.

## Huset

Jestons egen modell, som han är mycket stolt över, är ett **hus** för processfokuserad affärstransformation. Tentan HT25 (2(d)) frågade vad det illustrerar, och svaret är att **BPM består av lager**: från de strategiska grunderna (fundamentet) upp till de operativa, ledande och innoverande processerna, som tillsammans skapar en effektiv organisation. **Taket** är enligt Weaver ledningen, som sätter kulturen och den övergripande strategin och håller ihop det hela.

Huset säger alltså inte att BPM är ett avgränsat projekt, att IT-system byggs steg för steg eller att kartläggningen kommer före strategin. Grunden är strategisk. Weaver ser huset som en målbild av allt som ska finnas på plats när BPM fungerar, och säger att man inte behöver lägga tid på att lära sig detaljerna. Lägg tiden på ramverket i stället.

### Husets delar (bakgrund)

Nerifrån och upp:

- **Marken:** regelverket och omvärldens regler.
- **Foundations och Enablement:** motsvarar de två första faserna i 7FE. Det är den enda kopplingen mellan huset och faserna.
- **Organisatorisk linjering:** spårbarhet mellan strategi, target operating model och förmåga.
- **Business transformation program management, "Set for Success":** process transformation framework, people change management, benefits realization och process improvement framework.
- **Tre processrum:** management processes, operational processes (kärn- och stödprocesser) och innovation processes.
- **Taket:** ledningen och kulturen, med process governance och prestationsstyrning, som håller processfokus vid liv över tid.

Målet för det hela är effektivitet och **uthållig konkurrensfördel**.

[[diagram:bpm-huset]]

## 7FE: tio faser och tre essentials

Namnet 7FE läses bäst som **"10P3E"**: tio faser (phases) och tre essentials. De tio faserna är det som bär, och boken är upplagd efter dem:

1. **Foundations:** linjeringen mellan strategi, processledning och processer, och target operating model.
2. **Enablement:** bygger det som krävs för att förverkliga target operating model.
3. **Launch:** den formella starten på en BPM-aktivitet.
4. **Understand:** en gemensam, faktabaserad bild av nuläget.
5. **Innovate:** framtida processer (to-be) och validerade lösningar.
6. **People**
7. **Develop**
8. **Implement**
9. **Realize:** de strategiska målen.
10. **Sustainability:** konkurrensfördelen.

Faserna 6–10 beskrivs i kapitel 8. Jeston grupperar faserna i fyra grupper som alla börjar på F (Foundations, Findings & solutions, Fulfilment och Future), men Weaver säger att grupperna inte används i kursen.

De **tre essentials** är förmågor som krävs genom alla faser:

- **Leadership:** vision, förtroende och linjering med strategin, på alla nivåer i organisationen (kapitel 8).
- **BPM project management:** att resurser, budget, tidplan, intressenter och leveranser hanteras.
- **People change management:** att alla berörda kan och vill ta till sig och bidra till den framtida lösningen.

Se upp för påhittade fasnamn. **Execution, Evaluation, Engagement, Follow-up och Feedback finns inte i 7FE.** Känner du inte igen ett fasnamn i ett alternativ är det nästan säkert fel.

Jeston sammanfattar själv ramverket i en video som Weaver visade. 7FE kan användas för projekt i allmänhet, inte bara BPM. **De första fem faserna är i praktiken ett konsultuppdrag** som slutar i ett mycket robust business case, och därefter kommer bygget och genomförandet. Essentials kallas så för att de genomsyrar allt i projektet.

[[diagram:bpm-7fe]]

Varför behövs ett ramverk alls? Jeston menar att traditionella metoder inte räcker. Enkla redesigninitiativ slutar ofta när processen är införd och glömmer prestationsstyrningen och den strategiska linjeringen. Att göra om en process utan att förstå dess koppling till strategin riskerar att lösa fel problem. Den strukturerade ansatsen ger strategisk linjering över tid genom en återkopplingsslinga av ständig förbättring och organisatoriskt lärande.

Weaver jämför med **DevOps**. Förr byggdes mjukvara, lämnades över och var sedan klar. I dag vet man att mjukvara ständigt förbättras efter behov och omständigheter. En process blir på samma sätt aldrig "klar": den modelleras, analyseras, designas om, införs och följs upp, och sedan börjar varvet om.

## Allt börjar med strategin

Strategin är drivkraften. Den bestämmer affärsmodellen, alltså hur värde skapas och fångas, och den operativa modellen (business operating model). Att genomföra den kräver förmågor och resurser inom tre områden: **människor** (organisation och kultur), **teknik** och **process**. Jestons **framgångspall** (BPM success stool) har samma logik. Pallens tre ben är **people, tech och process**, och punkterna under benen är resurser och förmågor i den resursbaserade synens mening, som man i princip skulle kunna pröva med VRIO. Olika intressenter uppfattar dessutom BPM olika (Jestons figur 11.3 visar begrepp som mätning, simulering, processförändring och ledarskap). Ramverket behövs för att hålla ihop helheten.

[[diagram:bpm-framgangspallen]]

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
- Vissa organisationer har redan en stabil grund, med vision, mål och processarkitektur. Andra börjar med splittrade insatser. Grunden gäller också det konkreta: vilken IT-arkitektur och vilka system som redan finns, eller som måste skaffas först.
- Därför anpassas ramverket. Scenariot från kapitel 3 avgör hur noggrant och brett det används.

**Att hoppa över faser** är möjligt men avrått utan motivering. Tempot följer samma logik: går man fortare än mognaden tillåter ökar risken att misslyckas.
`,
  },
  {
    id: "kap6",
    number: 6,
    title: "Foundations och Enablement",
    readingMinutes: 13,
    lead: "Syftet och outputen i de två faserna som lägger grunden: strategy execution void, Red Wine Test, target operating model, end-to-end-processer, process governance och process asset.",
    sources: ["F3 del 1 (Weaver 29 sep 2026): Foundations, Enablement, execution void, TOM som intern business model, Google Maps-liknelsen, försäkringsexemplet, CPO", "F3 del 2: process asset och knowledge management, Enablement steg 4–7", "Tenta HT25 ord 2(i), 2(j); omtenta essä 1, 3, 4, 5"],
    body: `
Weaver säger att stegen i varje fas inte ska memoreras, bara förstås översiktligt. Faserna är det som är bra att kunna: vad de ska åstadkomma och vad de lämnar efter sig. Därför börjar varje fas här med syftet och outputen, och stegen kommer efter som en översikt.

## Foundations: den mest kritiska fasen

**Syfte och output.** Foundations lägger den strategiska och strukturella grund som allt annat BPM-arbete byggs på. Fasen **skapar inte strategin**. Den säkerställer **linjeringen mellan strategin, processledningen och de enskilda processerna**. Outputen är **target operating model (TOM)** och den överenskomna linjeringen mellan BPM-arbetet och strategin. Senare faser bygger på dem och ska inte gå tillbaka och ändra dem.

Jeston kallar Foundations kanske den mest kritiska fasen. Blir grunden fel blir senare insatser splittrade eller olinjerade med verksamhetens mål, som ett hus på dålig grund.

### Stegen i Foundations: översikt att förstå, inte memorera (bakgrund)

Stegen görs oftast i ordning, men djupet beror på organisationen och dess mognad.

1. **Skaffa strategin.** Förstå organisationens strategi, **inte skapa eller kritisera den**. Perspektivet är konsultens. Teamet skaffar strategidokumentet och går igenom det i en serie möten, bland annat ett med vd, som slutar i en övergripande färdplan. Spårbarhet etableras från strategin till BPM-programmet, Red Wine Test och aktiviteterna, och dagens och framtidens flaskhalsar knyts till strategiska teman.
2. **Förstå organisationens omgivning.** Som inför ett husbygge behöver teamet känna tomten, omgivningen och ekonomin. Det gäller struktur, kultur, omvärld och begränsningar. Jeston lägger vikt vid arbetskraftens generationer och vid hur digitaliseringen och pandemin förändrat arbetsplatsen. Här bedöms också **BPM-mognaden** (låg mognad gör BPM svårare), BPM-resan hittills, drivers och **aktivitetens bredd**: hur omvälvande projektet är, i fem nivåer från små förbättringar till att rubba branschens värdekedja.
3. **Välj angreppssätt:** top-down eller bottom-up efter aktivitetens typ (kapitel 3).
4. **Ta fram target operating model** (nedan).
5. **Kommunikation.** Foundations är den enda fasen där kommunikationen är ett **sista** steg, eftersom grunderna och TOM måste vara överenskomna bland cheferna först. Därefter kommuniceras syfte och ansats kontinuerligt, genom ledningsbesked, informationsmöten och information online.

Red Wine Test hör också till fasen, som en visionsövning på hög nivå.

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

[[diagram:bpm-execution-void]]

Weaver kallar själv modellen lite luddig: han förstår vad Jeston menar, men tycker att den är svår att tolka exakt. Håll dig därför till de två delarna, "different sameness" och vad som krävs för att fylla tomrummet.

### Red Wine Test

**Red Wine Test** är en visionsövning. Deltagarna föreställer sig att BPM-projektet redan är genomfört och perfekt lyckat, och beskriver det framtida tillståndet. Frågorna är:

- Vad har förändrats för kunderna, medarbetarna och ledningen?
- Hur arbetar organisationen nu?
- Vad är de stolta över att ha åstadkommit?

För varje svar ska man komma överens om **vem som ansvarar för leveransen**, BPM-teamet eller linjeledningen.

Syftet är att skapa **ett gemensamt narrativ om hur framgång ser ut** efter projektet och klargöra ansvaret. Tentans exempel: chefer säger att "kunderna nu får sina ärenden lösta i ett steg" och "vi har mycket bättre tvärfunktionellt samarbete". Det är Red Wine Test i funktion. Det definierar inte scope, väljer inte lösningar och ger inga to-be-modeller.

### Target operating model

**Target Operating Model (TOM)** är en övergripande bild av organisationens framtida operativa modell, **hur organisationens olika delar ska fungera i framtiden** för att BPM ska lyckas. TOM har sju komponenter som måste vara linjerade:

1. **Strategy**, med koppling till BPM-aktiviteterna
2. **Process governance**, med roller och ansvar
3. **Process architecture**
4. **Performance management**, till exempel balanced scorecard
5. **People and culture**
6. **Organization design**
7. **Technology**

TOM kan ses som den framtida önskade verksamhetsarkitekturen. Den är ingen to-be-IT-arkitektur, ingen kalkyl över besparingar och ingen as-is-karta.

Weaver beskriver TOM som **en intern business model**. Affärsmodellen visar hur värde skapas och fångas. TOM visar hur organisationen internt ska styra, mäta, organisera och bemanna sig för det. TOM följer av Red Wine Test: bilden av det lyckade projektet blir en bild av hur organisationen ska fungera.

## Enablement

**Syfte och output.** Enablement bygger det som krävs för att förverkliga TOM, och omfattar därför **mycket mer än teknik**: människor, teknik och process. Outputen är process governance (struktur och roller), processarkitektur och **process assets**, människor, kultur och organisation, samt teknik som möjliggörare.

### Stegen i Enablement: översikt att förstå, inte memorera (bakgrund)

1. **Kommunikation:** TOM kommuniceras till alla berörda, ned till golvet, från en och samma källa, så att budskapen inte går isär.
2. **Process governance** (nedan).
3. **Processarkitektur och process asset** (nedan).
4. **Performance management:** mätning, ansvar och ständig förbättring av nyckelprocesserna. Jestons formulering är att **om du inte mäter prestationen styr du inte verksamheten**. Det kräver en kultur där någon tar ansvar för resultaten, riktlinjer för KPI:er och rapportering, och belöningar. KPI:er mäter hur effektiva processerna är, de bestämmer inte löner eller budgetar. Balanced scorecard är en bra modell för det.
5. **Människor och kultur:** processkompetens och utbildning, prestations- och servicekultur, belöningar, lärande och uppförandekod. Målet är en processfokuserad organisation med hög prestation.
6. **Organisationsdesign:** den formella strukturen ska stödja processerna, styrningen och prestationsstyrningen, och uppmuntra samarbete över silos. Ibland visar BPM-arbetet att processerna fungerar dåligt just på grund av hur organisationen är uppdelad. Ordningen är **processer → struktur → människor**.
7. **Teknik som möjliggörare:** TOM och process asseten kopplas till IT-styrdokumenten, och BPM-tekniken (BOAT) följer IT-arkitekturen. **Tekniken ska möjliggöra, inte diktera, processdesignen.** Att inte köpa en plattform först och låta den styra förändringen är enligt Weaver lättare sagt än gjort. Inte all processförbättring kräver teknik, men digitaliseringen, RPA och AI automatiserar allt fler processer.

### End-to-end-processer och silos

För att kunna bygga TOM behöver teamet se processerna som de faktiskt löper: **horisontellt** genom organisationen, från försäljning till leverans, över de funktionella silos som organisationsschemat visar. Weaver kopplar det till Porters interna värdekedja (1985), ett av de första sätten att se företaget horisontellt. End-to-end-processerna syns sällan i schemat. En kundprocess är ofta mycket bredare än kundavdelningen, och frågan "vem styr processen från början till slut?" blir därför central.

Processerna delas upp i tre slag:

- **Strategic processes:** ledningens processer. De styr men skapar inte själva värdet.
- **Core processes:** de processer där värdet skapas, både value creation (något som behövs) och value capture (att någon betalar för det).
- **Support processes:** stödjer kärnprocesserna och skapar värde indirekt, som IT och databaser.

[[diagram:bpm-end-to-end]]

Weavers exempel är Jestons försäkringsbolag, där fyra stora kärnprocesser bär värdeskapandet, från försäljning till kundernas ärenden, med strategi- och stödprocesserna runt omkring. En sådan karta är bra men för övergripande för att arbeta med. Därför behövs nivåerna nedan.

### Process governance

**Process governance** (styrning) är nyckeln till varaktig framgång i processförbättringar. Rollerna för beslutsansvar, hantering av affärsrisker och prestationsstyrning måste fastställas:

- **Strategic process council:** det främsta styrande organet för BPM-aktiviteterna.
- **Chief Process Officer (CPO):** den högst ansvariga för processarbetet. Weaver påpekar att rollen ofta är **tillfällig** och sällan syns som titel i organisationsscheman, men att det är idealet att en person bär det yttersta ansvaret.
- **Process executive:** chef med ansvar för processer inom en större del av organisationen. Sitter i rådet.
- **Process steward:** under process executives och utanför rådet. Ansvarar för enskilda processer och BPM-projekt, och för prestationsstyrningen på processnivå. På svenska motsvarar det ungefär **processägare**.

### Processarkitektur

En **processarkitektur** ger regler, principer och riktlinjer för hur processer designas och förvaltas. Den omfattar standarder för modellnivåer och vägledning för referensramverk, förklarar skälen bakom och kopplar dem till strategin, och är linjerad med EA. Typiska delar är processriktlinjer (hur mycket processerna ska standardiseras och integreras, anpassat efter organisationen), **process assets**, ett arkiv för affärsregler och ett ramverk för nyttostyrning.

### Process asset: kanske den viktigaste komponenten

Weaver kallar process asseten **kanske den allra viktigaste komponenten** i hela arbetet. Den kopplar till **knowledge management**. Mycket av en organisations processer är **tyst kunskap**: den finns i medarbetarnas huvuden, förs vidare muntligt när någon ny lärs upp, och står ingenstans nedskriven. En process som bara finns så är implicit. Den fungerar kanske, men den är ingen resurs man kan hantera. Process asseten gör kunskapen **explicit**: modeller, regler, roller, system och risker länkas samman på ett ställe. Först då blir processen en **resurs i VRIO-mening**, något organisationen faktiskt kan identifiera, bygga vidare på och konkurrera med.

En **process asset** gör processerna till en strategisk resurs. Den är ett **centralt arkiv av processmodeller, dokumentation och metadata**, som regler, IT-system, roller och risker. Det ger:

- konsekventa och återanvändbara processer
- mindre omarbete och bättre kvalitet
- enklare analys av hur en förändring påverkar
- transparens för risk, regelefterlevnad och revision

**Skillnaden mot en processmodell** har prövats på tentan: **modellen är en del av process asseten**, som dessutom rymmer roller, policies, regler, risker och andra styrande element. När något händer i en process och teamet behöver förstå stegen, reglerna, ansvaret och beslutspunkterna är det process asseten för den processen de ska gå till, inte TOM eller strategidokumentet. I moderna BOAT-plattformar kan process asseten bli en levande digital bild av processen, med modeller, regler, system, dokument, ägare, prestationsdata och automation under versionshantering.

[[diagram:bpm-process-asset]]

### Fem processnivåer

Jeston rekommenderar **fem nivåer** av processbeskrivning. Weaver jämför med **Google Maps**: man ska kunna zooma från hela jordklotet till land, stad och gata. På samma sätt ska man kunna zooma från hela organisationen ned till det konkreta arbetet.

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

Även BPMN är en abstraktion. En aktivitet i ett BPMN-diagram rymmer i sin tur en mängd konkreta arbetsuppgifter, och därför finns en nivå under BPMN-nivåerna.
`,
  },
  {
    id: "kap7",
    number: 7,
    title: "Launch och Understand",
    readingMinutes: 15,
    lead: "Launch-fasens tio steg (intressenter, processmål, processval, business case och team) och Understand-fasens elva steg, från en gemensam, faktabaserad bild av nuläget till baseline, rotorsaker, Process Worth Matrix och quick wins.",
    sources: ["F3 del 2 (Weaver 29 sep 2026): Launch, rädslan, quick wins, processval och process mining", "F4a och F4 del 1 (Weaver 5 okt 2026): Understand", "Tenta HT25 omtenta 6, ord 2(h)"],
    body: `
## Launch: den formella starten

**Syfte och output.** Organisationer vet ofta att de har ineffektiviteter men har svårt att avgöra **var och hur de ska börja**. **Launch** är den formella startpunkten för en BPM-aktivitet: fasen fastställer scope, struktur och riktning, engagerar intressenterna och knyter arbetet till strategin och till grunderna från Foundations och Enablement. Outputen är engagerade intressenter, överenskomna processmål, de processer som prioriteras för Understand, en genomförandeansats och ett business case.

Weaver påpekar att Launch startar projektet men inte avslutar det: de nya processerna finns ännu inte. Här blir stegen också mer komplicerade, en blandning av sekventiellt och parallellt arbete.

### Stegen i Launch: översikt att förstå, inte memorera (bakgrund)

1. **Kommunikation:** informera om mål, scope och tidplan.
2. **Initiala intressentintervjuer:** intressen, förväntningar och möjligt motstånd.
3. **High-level process walkthrough:** en gemensam bild av de befintliga processerna.
4. **Intressentidentifiering och engagemang.**
5. **Workshoppar med ledningen:** ledningens stöd och överenskomna processmål.
6. **Plan för handover och takeover:** hur beslut, ägarskap och ansvar ska hanteras.
7. **Genomförandeansats:** hur utrullningen ska gå till.
8. **Business case:** beskriven och undertecknad.
9. **BPM-teamet:** struktur med tydliga roller (styrgrupp, sponsor, projektägare, arkitekter), med stöd från HR, IT och facilities.
10. **Initial plan och business case:** dokumenterade som grund för nästa fas.

### Kommunikation och intressenter

Medarbetarna ska få veta mål, förväntade resultat och tidplan. Kommunikationen ska **bemöta rädslan för nedskärningar, outsourcing och automatisering**. Weaver noterar att Jeston förutsätter att projektet inte handlar om att göra sig av med personal, och att rädslan i dag är högst verklig när företag som IKEA säger upp folk och hela yrkesgrupper, som mjukvarutestare, ersätts av AI. Den ska också ta upp vad som förändras för medarbetarna, hur ledningen ska agera, hur ofta de får information och hur de kan delta. Här syns kapitel 8:s tema tidigt: människorna är huvudsaken.

De **initiala intressentintervjuerna** är tidiga, fokuserade samtal med nyckelpersoner. De ger en bred bild av verksamheten, visar hur intressenterna ser på problemen, **hittar quick wins som betyder något för dem** och börjar bygga förtroende. Intressenterna finns både internt, också utanför den egna affärsenheten, och externt: leverantörer, kunder, partner, leverantörens leverantör och kundens kund. Viktiga externa intressenter kan behöva delta aktivt.

**High-level process walkthrough** är korta genomgångar av nyckelprocesserna från början till slut. Teamet talar med dem som utför arbetet och med IT. Genomgången ska vara övergripande och **icke-kritisk**. Målet är orientering, inte utvärdering, och den förbereder den detaljerade Understand-fasen.

### Ledningsworkshoppen

Workshopparna med sponsorer och chefer från berörda enheter ska ge överenskommelse om:
- aktivitetens **scope**, alltså om den sträcker sig utanför affärsenheten eller organisationen
- dess **bredd**, alltså hur omvälvande den är (de fem nivåerna av bredd i Foundations, kapitel 6)
- de första processmålen
- en checklista för hur framgång ser ut
- de viktigaste processerna
- en första analys med övergripande mått
- styrningen
- vad Understand ska leverera

**Processmålen** anger hur mycket prestationen ska förbättras. Nuläget jämförs med önskat läge. Antalet mått hålls **lågt, helst högst fem per process**, och varje mål kopplas till en ansvarig chef. Alla processmål ska vara **SMART**: specifika, mätbara, uppnåeliga, realistiska och tidsbundna.

### Processval (bakgrund)

Weaver säger att processvalet är viktigt men att kursen inte går in på metoderna. Man kan inte göra om allt på en gång, och en bra process ska man kanske inte störa. För att identifiera processerna rekommenderar Jeston **process selection matrix (PSM)**. Den visar alla processer i en affärsenhet: huvudprocesserna från början till slut (till exempel order- och supportprocessen) mot scenarier som produkter, geografi och distributionskanal. Det gör det lättare att se komplexitet, kopplingar och var samma process täcker flera produkter. I ett av Jestons exempel fanns 54 delprocesser för att täcka sex end-to-end-processer, och analysen visade mycket lågt hängande frukt: överflödiga processer och dubbelarbete. För att prioritera i processvalet kan också **Process Worth Matrix** användas. Den värderar processerna efter strategisk betydelse och ekonomiskt värde (Understand, steg 8).

I dag skulle processvalet kompletteras med **process mining**, som Jeston inte tar upp. I stället för att bara se processerna utifrån, genom intervjuer, workshoppar och modellering, läser algoritmen processloggarna i IT-systemen och visar hur processen faktiskt körs och var flaskhalsarna finns (kapitel 9).

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

**Business case** skrivs på **vanligt språk, inte i BPMN**. Det sammanfattas helst på **en sida**, påståendena stöds av evidens, och planen kan behöva uppdateras i senare faser. Här skapas också **benefits register**: varje förväntad nytta förs in med ägare, värde, måldatum, beroenden och koppling till strategin, och följs sedan upp genom alla faser (Realize, kapitel 8).

## Understand: en gemensam bild av nuläget

**Syfte och output.** **Understand** är den första fasen i gruppen Findings & solutions. Fasen tar reda på hur processerna faktiskt fungerar i dag, så att de kan göras om i Innovate. Den har fyra syften:

- **Process understanding:** förstå nuläget som underlag för omdesignen.
- **Performance baselines:** hitta de områden där värdet är störst och de KPI:er som behövs för att jämföra as-is med to-be.
- **People and skills:** vilka nya färdigheter som behövs.
- **Start the change journey:** förbereda människorna för förändringen genom att låta dem vara med och hitta problemen och möjligheterna.

Outputen är nulägesmodeller (**as-is**), mått som blir **baseline** för senare jämförelser, dokumenterade styrkor, svagheter och **rotorsaker**, **quick wins** som kan genomföras inom fyra till åtta veckor och en **Understand Phase Report** med föreslagna prioriteringar för Innovate.

Liksom de tre första faserna kallar Weaver Understand och Innovate väldigt viktiga: här börjar det konkreta arbetet med processerna.

### Stegen i Understand: översikt att förstå, inte memorera (bakgrund)

1. **Kommunikation** (hela fasen): bemöt oron för jobben.
2. **Bekräfta scope på nytt** mot Launch.
3. **Understand-workshoppar.**
4. **Metrics-analys, inklusive Voice of Customer.**
5. **Rotorsaksanalys.**
6. **People Capability Matrix.**
7. **Tillgänglig information, tyst och explicit.**
8. **Process Worth Matrix.**
9. **Innovate-prioriteringar.**
10. **Quick wins.**
11. **Understand Phase Report.**

### Huvudsyftet med modelleringen

Enligt Jeston är huvudsyftet med modelleringen i Understand **att få fram en gemensam, faktabaserad bild av hur processen faktiskt fungerar i dag**, för att kunna analysera hur den kan förbättras.

Tentan prövade just skillnaden mot andra syften, som alla låter rimliga men är fel:
- att ta fram fullständiga beskrivningar som kan automatiseras direkt
- att definiera detaljerade KPI:er för framtida styrning
- att producera dokumentation för revision

Weaver säger samma sak: modelleringen ska inte skapa körbara processer i ett BPMS eller beskriva allt i detalj. Nulägesmodellen är ett analysverktyg, inte en slutprodukt. Understand mäter nuläget så att det kan jämföras med den framtida processen. Det är något annat än KPI:er för att styra de nya processerna; sådana kommer senare, till exempel när People-fasen sätter mål och KPI:er för roller och team.

### Workshoppar och modellering

Workshopparna är fasens arbetsform, och i princip alla är med: chefer, mellanchefer och de som arbetar i processerna. De ger fakta, kartlägger hand-offs och systemgränssnitt och samlar in mått för prioriteringen.

Modellerna ska vara **fit for purpose, not perfect**. Jeston är ingen BPMN-polis, betonar Weaver: man ska **veta när man ska sluta modellera**, alltså när det räcker för att gå vidare till Innovate.

### Alternativ till BPMN (bakgrund)

Jeston binder sig inte vid något modelleringsspråk: syftet är att få med medarbetarna, och det är inte realistiskt att skicka alla på en BPMN-kurs. Alternativen är **flödesscheman och swimlane-diagram**, **EPC (Event-driven Process Chains)**, som enligt Weaver inte är särskilt aktuellt längre, och **storyboards, customer journeys och post-it-lappar**. I kursen används ändå BPMN 2.0 (kapitel 10 och 11).

### Metrics och baseline

Steg 4 mäter hur de nuvarande processerna presterar. Måtten blir den **baseline** som de omdesignade processerna jämförs med: processmålen från Launch säger vart man vill, baselinen var man står. Weaver kallar det jätteviktigt: **utan mått går det inte att veta om något blev bättre**, hur mycket enklare modellen än ser ut. Måtten är också en objektiv grund för prioriteringen och underlag för business case.

Mått är till exempel genomloppstid (process cycle time), kostnad per process, fel och omarbete, eskaleringar och hur väl **SLA:er** (service level agreements, överenskomna servicenivåer) uppfylls. Weavers exempel: ett företag som har outsourcat sin CRM mäter om leverantören håller servicenivån. **Voice of Customer (VoC)** tar in kundens röst genom enkäter, intervjuer eller fokusgrupper, så att prioriteringarna följer kundens behov.

Bakgrund: använd förenklade kostnadsmodeller där detaljerade data saknas. Weaver nämner ABC (kapitel 4) som ett av flera sätt att få in kostnaderna.

### Rotorsaksanalys

Steg 5 tar fram de **verkliga orsakerna** till problemen, inte bara symptomen. Annars riskerar redesignen att upprepa eller dölja samma problem. **Rotorsakerna identifieras alltså här, i Understand**, och Innovate bygger vidare på dem.

Orsaken kan vara uppenbar, som för få medarbetare, eller ligga många steg bort. Frågor att ställa:

- Var uppstår fel och omarbete, och orsakas de av en annan process?
- Är informationen korrekt och fullständig, eller saknas en **single source of truth**, en enda gemensam källa för informationen?
- Har medarbetarna rätt kompetens, resurser och träning?
- Tillför alla steg verkligt värde?

### FMEA (bakgrund)

**Failure Mode and Effects Analysis (FMEA)** poängsätter möjliga fel efter allvar, frekvens och hur lätt de upptäcks, och poängen bildar en **heat map** över processens kritiska svagheter. Enligt Weaver är det inte viktigt exakt hur FMEA går till, utan att det finns **formaliserade sätt** att göra rotorsaksanalys, där även mjuka orsaker får siffror.

### People Capability Matrix

Steg 6 utgår från att processerna kräver rätt person på rätt plats med rätt kompetens. **People Capability Matrix** ställer processerna mot de kompetenser som krävs, med tyngdpunkt på de **framtida**, och visar var glappen finns. Kompetenserna graderas 1 = obligatorisk, 2 = rekommenderad, 3 = önskvärd, och matrisen uppdateras i Innovate.

Weaver pekar på det **känsliga**: matrisen kan användas för att bedöma enskilda medarbetare, och de som saknar många kompetenser kan bli de första som sägs upp. Jeston presenterar den i stället som ett sätt att förutse utbildningsbehoven.

### Tyst och explicit kunskap

Steg 7 tar reda på vilken information som finns. Weaver kallar det knowledge management i grunden, samma tanke som bakom process asseten i kapitel 6. **Tyst kunskap (tacit knowledge)** är erfarenhet som inte är dokumenterad. **Explicit kunskap** är dokumenterad, som manualer och affärsregler.

Tyst kunskap går förlorad när en nyckelmedarbetare försvinner, och den kan bli en maktfaktor: Weaver beskriver hur till exempel IT-avdelningar kan hålla sina lösningar för sig själva, eftersom den som berättar allt blir utbytbar. Teamet ska därför öka den explicita kunskapen.

### Process Worth Matrix

Steg 8 är enligt Weaver en viktig del av fasen. **Process Worth Matrix** kategoriserar processerna efter strategisk betydelse (**salience**) och ekonomiskt värde (**worth**): en process är en **asset**, som tillför värde, eller en **liability**, som förstör värde. Matrisen hjälper organisationen att bestämma vilka processer den ska investera i, förbättra, outsourca eller avveckla, och kopplar processens prestation till affärsvärdet. Weaver kallar det **strategic alignment**, strategisk linjering: hur viktig är processen för vår strategi?

| Salience | Asset | Liability |
|---|---|---|
| **Identity** | Definierar varumärket och särprägeln, som McDonald's snabba service | Försvagar varumärket om den utförs dåligt |
| **Priority** | Stödjer identitetsprocesserna, som en pålitlig leveranskedja | Ger omedelbara, synliga fel när den går sönder |
| **Background** | Stödjer den dagliga driften, som HR och administration | Ofta ineffektiv: lätta vinster ("easy wins") men begränsad effekt |
| **Mandated** | Krävs av lagar och regler; tillför sällan värde | Regelbördor som kan motivera automatisering eller outsourcing |

Det strategiska värdet sjunker uppifrån och ned, från Identity till Mandated.

Weaver kopplar matrisen till den resursbaserade synen (**RBV**) och **core competence** (kärnkompetens): vilka processer måste finnas inom företaget? Amazon bygger på kundfokus och outsourcar troligen inget som rör kunderna, medan ett företag där produkten och varumärket är det viktiga kanske kan lägga ut sin CRM.

### Innovate-prioriteringar

Steg 9 avgör, utifrån modelleringen, måtten och rotorsaksanalysen, vilka processer som går vidare till Innovate. Arbetet läggs där effekten blir störst. Möjliga beslut per process:

- **Leave as is:** en bra process ska man kanske inte störa.
- **Improve:** mindre justeringar.
- **Amalgamate:** slå ihop processer.
- **Redesign:** bygg om med ett blankt papper.
- **Innovate radically:** nya koncept eller ny teknik.
- **Outsource** eller **Insource:** lägg ut på en extern leverantör, eller ta tillbaka arbete som tidigare lagts ut.
- **Eliminate:** ta bort onödiga processer.

För att prioriteringen inte ska bli en gissningslek finns formella hjälpmedel, som **heat maps** där FMEA-poängen kombineras med process selection matrix från Launch.

### Quick wins

Steg 10 tar fram **quick wins**, som Jeston betonar mycket: små förbättringar som kan genomföras **inom fyra till åtta veckor**. De ger snabba resultat att peka på, motiverar både medarbetare och ledning och hjälper till att göra BPM-projektet **självfinansierande**.

Quick wins kommer ofta **bottom-up**: i workshopparna kan en medarbetare peka på en enkel åtgärd som skulle lösa hälften av problemen. Weaver jämför med Toyotas förslagslådor och priser för månadens bästa förslag. Intressentintervjuerna i Launch letar redan efter quick wins; i Understand tas de fram systematiskt (definitionen står i kapitel 3).

### Från Understand till Innovate

Fasen avslutas med **Understand Phase Report**. Nulägesmodellerna och rotorsaksanalyserna blir sedan underlag i Innovate, där de framtida processerna designas (kapitel 8). Tentan prövade gränsen: Innovates output är design av to-be-processer och validerade lösningsförslag, inte identifierade rotorsaker.
`,
  },
  {
    id: "kap8",
    number: 8,
    title: "Från Innovate till Sustainability, och människorna",
    readingMinutes: 19,
    lead: "De sex sista faserna i 7FE, från to-be-designen i Innovate via nyttorealiseringen till Sustainability i business as usual, de tre essentials som är berggrunden BPM vilar på, varför minst 60 procent av arbetet handlar om människor, och BPM-mognad.",
    sources: ["F2 (7FE:s faser, one size fits all, mognad)", "F3 (Foundations och Launch: kommunikationen och rädslan)", "F4a och F4 del 1–2 (Weaver 5 okt 2026): Innovate till Sustainability, essentials", "Tenta HT25 ord 1(a), 2(h)"],
    body: `
Det här kapitlet går igenom de sex sista faserna i 7FE, från Innovate till Sustainability, och de tre essentials som bär ramverket. Weaver kallar Innovate, liksom Understand (kapitel 7), väldigt viktig, eftersom det grundläggande BPM-arbetet sker där. När processerna väl är omdesignade är det mesta gjort, och People, Develop och Implement går han igenom snabbt. Ramverket är komplext, men ger enligt Weaver ett sätt att tänka strukturerat hela vägen.

[[diagram:bpm-faserna-6-10]]

## Innovate: de framtida processerna designas

**Syfte och output.** I **Innovate** designas de framtida processerna utifrån insikterna från Understand. De ska bli så effektiva, verkningsfulla och framtidssäkra som möjligt, och de förväntade nyttorna och kostnaderna ska **kvantifieras och valideras** så att business case kan förfinas. Outputen är **design av framtida processer ("to-be") och validerade lösningsförslag**, och till sist de detaljerade affärskrav som lämnas över till Develop.

Ordinarie tentan HT25 frågade efter Innovates typiska output, och rätt svar var just to-be-designen och de validerade lösningsförslagen. De tre felaktiga alternativen hör hemma på andra ställen:

- **Identifierade rotorsaker** tas fram i Understand-fasens rotorsaksanalys (steg 5, kapitel 7). I Innovate är de underlag.
- **Projektets riskanalys och riskregister** hör till projektledningen, en av de tre essentials. Innovate prövar visserligen om lösningarna är genomförbara och vilka risker de bär, men det är inte projektets riskhantering.
- **Utbildningsplaner** tas fram i People och genomförs i Implement. Innovate pekar bara ut utbildningsbehoven, i gapanalysen mellan as-is och to-be.

Weaver tycker att namnet är konstigt: processerna designas om, och det är mer en designfråga än innovation. Här börjar optimeringen på allvar, och nästan allt sker parallellt.

### Stegen i Innovate: översikt att förstå, inte memorera (bakgrund)

Weaver säger att man inte behöver gå igenom alla stegen. Mycket handlar om att mobilisera människor.

1. **Kommunikation** i ett klimat där människor vågar dela idéer.
2. **Executive kick-off workshop:** ledningen sätter mål och begränsningar.
3. **Uppdatera innovationsansatsen:** rätt deltagare och en tidshorisont för varje alternativ, till exempel 3, 12 eller 24 månader.
4. **Fokusgrupper med externa intressenter.**
5. **Intern mobilisering** av medarbetarnas idéer. Weaver kopplar det till kaizen, ständig förbättring i små steg.
6. **RPA** (nedan).
7. **Förbered Innovate-workshopparna.**
8. **Innovate-workshopparna** (nedan).
9. **Future process metrics projections:** to-be-processernas prestation och kostnad.
10. **Simulering** av alternativen.
11. **Uppdatera People Capability Matrix och kapacitetsplanera.**
12. **Workshop om lösningsförslagen.**
13. **Demonstrera och validera genomförbarheten** och riskerna.
14. **Process gap analysis:** as-is mot to-be, med risker och utbildningsbehov.
15. **Nyttor och business case** mot baseline från Understand.
16. **Rapport och presentationer** för ledningen.
17. **Godkännanden** från ledningen.
18. **Business requirements** till Develop och IT.

### Optimeringslösningarna och RPA

I Innovate väljs också **hur** en process ska optimeras. Jeston räknar upp fem lösningar: processoptimering, outsourcing, shared services, RPA och cloud computing. Deras risk skiljer sig (kapitel 4): outsourcing har hög risk, shared services medelrisk och processoptimering och RPA låg risk, medan cloud computing enligt Weaver snarare är infrastruktur. Principen att tekniken bara är en möjliggörare (kapitel 4) gäller också här.

**Robotic process automation (RPA)** är programvara som fungerar som en **virtuell medarbetare** och utför uppgifter med tydliga, repetitiva regler i de system som redan finns. Lämpliga fall och tentans exempel med fakturarader står i kapitel 4. Enligt Weaver var RPA hett när Jeston skrev, men i dag är det en **hygienfaktor** i BPM-system och verktyg som UiPath. Tanken är att det ska vara low-code, så att medarbetaren i princip kan bygga roboten själv, till exempel för en kundlista i Excel som varje dag klistras över till en annan databas. Men RPA har varit **svårt att skala**: det fungerar på medarbetarnivå, men stora vinster i hela organisationen har varit svåra att få, och medarbetarna klarade sällan att bygga robotarna utan hjälp (kapitel 2).

### Innovate-workshopparna, steg 7–8 (bakgrund)

Workshopparna flyttar fokus från att dokumentera nuet till att designa framtiden:

1. **Initial redesign workshop:** designen ska vara ungefär **70 procent** klar efteråt.
2. **Confirmation workshop:** designen förfinas till **95 procent**.
3. **Finalization workshop:** den slutliga processen läggs fram för godkännande.

Valet av deltagare avgör resultatet. Skicka inte bara de tillgängliga, utan **change champions** som vill och kan driva förändring, kreativa människor och de som förstår processen från början till slut ur kundens perspektiv.

## People: människorna i de nya processerna

**Syfte och output.** **People** bestämmer hur människor ska utföra de nya processerna, genom rolldesign, organisationsstruktur och prestationsmått, så att medarbetarnas förmåga, engagemang och ansvar matchar dem. Fasen löper **parallellt med Develop**, som tar hand om tekniken. Outputen är rollbeskrivningar, KPI:er för roller och team, en anpassad organisationsstruktur, en utbildningsplan och uppdaterade HR-policyer. Det är alltså här utbildningsplanerna från tentafrågan ovan hör hemma.

**People Capability Matrix** togs fram i Understand (steg 6) och uppdaterades i Innovate (steg 11). I People blir gapet i matrisen en plan för utbildning, coachning eller rekrytering (Weavers varning om matrisen står i kapitel 7).

### Stegen i People: översikt att förstå, inte memorera (bakgrund)

1. **Kommunikation** åt båda hållen, där oro för förändrade jobb tas upp tidigt.
2. **Design people strategy** tillsammans med HR.
3. **Activity definition and role design** med **RACI**-modellen.
4. **Performance management and measurement:** KPI:er för roller och team.
5. **People core capabilities gap analysis:** nuvarande mot framtida färdigheter.
6. **Organisationsstruktur** med färre hand-offs.
7. **Develop training.**
8. **Uppdatera HR-policyerna.**

I Jestons exempel från skadehandläggning grupperas uppgifterna till aktiviteter som "bedömda skadeärenden", där KPI:erna sätts, och aktiviteterna till roller, som samlas i arbetsgrupper. På jobbnivå blir det till exempel en skadebedömare, och ett jobb kan rymma flera roller. Rollerna byggs alltså nerifrån, ur processerna.

## Develop: tekniken byggs

**Syfte och output.** **Develop** översätter de omdesignade processerna och affärskraven från Innovate till fungerande lösningar: eventuella teknikkomponenter utvecklas, konfigureras och testas. Jeston understryker att **BPM-framgång inte kräver teknik**. Outputen är lösningarna med dokumentation och färdiga mjukvaruspecifikationer, redo för Implement.

Weavers poäng är att programvaran måste vara på plats innan de nya processerna införs. Att skaffa eller uppdatera ett BPM-system är ingen liten sak.

### Stegen i Develop: översikt att förstå, inte memorera (bakgrund)

1. **Kommunikation** om automatiseringen och hur den påverkar roller.
2. **Bestäm BPM-komponenterna**, till exempel workflow, regelmotor (rules engine), RPA och dokumenthantering (kapitel 4).
3. **Bestäm utvecklingsansatsen.**
4. **Uppdatera funktionella och tekniska specifikationer.**

Jeston varnar för "best of breed" i varje applikation: utan mycket hög integrationsförmåga är färre applikationer bättre, även om de bara täcker 80–90 procent av behovet.

## Implement: lösningen tas i drift

**Syfte och output.** I **Implement** tas processförbättringarna, förändringarna i människor och organisation och systemlösningarna i drift. Kommunikation, förändringsledning och utbildning ska få användarna att ta till sig det nya. Fasen markerar **starten på nyttorealiseringen**: här börjar uppföljningen av nyttorna i business case. Outputen är en lösning i drift som är accepterad, fungerar och har tagits över av linjen.

Weaver lyfter två saker: fel i processer och system ska hittas tidigt, i tester och piloter, och en stor utrullning behöver en väg tillbaka. Hans exempel: byter en storbank system och det går åt skogen ska de gamla systemen snabbt kunna sättas in igen.

### Stegen i Implement: översikt att förstå, inte memorera (bakgrund)

1. **Uppdatera implementeringsstrategin och planen.**
2. **Kommunikation** åt båda hållen.
3. **Involvera ledningen.**
4. **Förbered user acceptance test (UAT).**
5. **Utbilda personalen.**
6. **Marknadsföring** av BPM-initiativet.
7. **Affärstester och piloter** före full utrullning.
8. **Uppdatera leveranserna.**
9. **Planer för rollout, back-out och contingency.**
10. **Implementera lösningen** (go-live).
11. **Stöd till personalen.**
12. **Handover och takeover** till linjen, enligt planen från Launch.
13. **Monitor and adjust:** nyttorna följs mot business case. Weavers fråga: blir det bättre eller sämre?
14. **Återkoppling** till användare och intressenter.

## Realize: nyttorna ska faktiskt komma

**Syfte och output.** **Realize** ser till att nyttorna i business case **uppnås och består** efter införandet, genom **benefits management** (nyttostyrning). Projektet ska ge mätbart affärsvärde, inte bara leveranser. Många organisationer tror felaktigt att projektet är slut vid go-live. Outputen är nyttor som följs upp mot business case, var och en med en ansvarig ägare. I översikten i kapitel 5 står Realize för de strategiska målen. Nyttoregistret från Launch knyter också varje nytta till de övergripande strategiska målen.

**Nyttorealiseringen är inte ett enskilt steg utan en tråd genom hela ramverket**, från Enablement till Sustainability.

### Stegen i Realize: översikt att förstå, inte memorera (bakgrund)

Weaver säger att stegen inte behöver gås igenom. De är inbäddade i de andra faserna:

| Steg | Fas | Innehåll |
|---|---|---|
| 1. Kommunikation | Alla | Quick wins delas tidigt |
| 2. Benefits management framework | Enablement | Struktur och mallar för nyttorna |
| 3. Benefits register | Launch | Varje nytta med ägare, värde och måldatum |
| 4. Baseline | Understand | Utgångsvärden att jämföra före och efter |
| 5. Refine and optimize benefits mix | Innovate | Nyttorna räknas om |
| 6. Benefit details | Develop, People, Implement | En **benefits delivery matrix** knyter milstolpar till nyttor |
| 7. Benefits delivery and tracking | Realize | Nyttoägarna driver fram nyttorna |
| 8. Value monitoring and maximization | Sustainability | Uppföljningar och revisioner |

### Inte ett vattenfall

Weavers poäng med Realize är att BPM **inte är ett vattenfall** och inte "one and done", utan en livscykel (kapitel 1 och DevOps-jämförelsen i kapitel 5). Det kräver **tålamod**: i början kan kostnad och nytta se dåliga ut, och då gäller det att avgöra om det är ett verkligt problem eller bara tar tid. Därför behövs **KPI:er som inte bara handlar om pengar**, utan också om resurser och om vad kunderna tycker. Det kan ta ett halvår innan det märks att kunderna är mycket nöjdare, även om processerna inte blivit mycket billigare, och den nyttan har ett värde i sig.

Hos Jeston överlappar kostnaderna de första nyttorna, som börjar efter införandet och växer långsamt. Uteblir nyttan inom ett område måste det upptäckas tidigt, så att arbetet kan rättas till eller avbrytas.

[[diagram:bpm-kostnad-nytta]]

## Sustainability: förbättringarna ska hålla

**Syfte och output.** **Sustainability** är den sista fasen och syftar till **uthållig konkurrensfördel**. Resultatet ska gå över från projektet till **business as usual**, och förbättringarna och nyttorna ska **underhållas och förbättras kontinuerligt**. Annars kan nyttorna erodera när verksamheten förändras, och förtroendet för framtida BPM-arbete skadas. Outputen är processer med fungerande ägarskap, aktuell dokumentation och KPI:er som följs i vardagen.

Weaver kallar Sustainability "ett besvärligt ord". Jeston menar **sustainable competitive advantage**, inte hållbarhet i miljömening. Green BPM i kapitel 9 är något annat. Om ingen följer upp dyker nya problem snabbt upp, och fasen **tar därför aldrig slut**: den hör till det dagliga arbetet, inte till projektet. Vem ansvarar för processerna? Vem äger process asseten (kapitel 6) och uppdaterar BPMN-modellerna? Vem fortsätter mäta KPI:erna?

### Stegen i Sustainability: översikt att förstå, inte memorera (bakgrund)

1. **Utvärdera projektresultatet** mot business case.
2. **Utvärdera handover och takeover:** fungerar processägarskapet?
3. **Säkerställ att process stewards är utbildade.**
4. **Utvärdera processmåtten:** är KPI:erna fortfarande relevanta?
5. **Process quality assurance:** kontroller och revisioner.
6. **Uppdatera processdokumentationen.**
7. **Kommunikation** genom hela fasen.

### BPM som permanent förmåga

Jeston avslutar med **organizational sustainability and performance management**: BPM ska gå från projekt till **permanent förmåga**, en **löpande ledningsdisciplin** där processerna hela tiden observeras, styrs och förbättras. Det kräver ledningens engagemang, integrerad styrning, prestationsstyrning och ständigt lärande. Det är taket i Jestons hus (kapitel 5), som i hans sammanfattning heter Organization Sustainability & Performance Management. Enligt Weaver ger de tre essentials förutsättningarna för att förändringen håller.

## Essentials: berggrunden som BPM vilar på

De tio faserna räcker inte på egen hand. De tre **essentials** måste genomsyra varje fas. Jeston kallar dem **bedrock**, berggrunden som all BPM-aktivitet vilar på: väl utförda ger de ett stabilt stöd, och försummas de **tippar, sjunker eller kollapsar** BPM-arbetet. Weaver beskriver dem som övergripande förmågor, inte faser. De ska finnas från början, eller åtminstone byggas upp under arbetets gång.

Håll isär berggrunden och **framgångspallen** i kapitel 5. Pallens tre ben, people, tech och process, är förmågorna för att genomföra strategin. Essentials bär själva BPM-arbetet.

### Project Management

**Project Management**, eller BPM project management, hanterar resurser, tid, budget, intressenter och leveranser. Jeston menar att BPM-projekt är mer komplexa än vanliga IT- eller verksamhetsprojekt: de går tvärs över funktioner, kräver kulturförändring och ständig förbättring och utmanar befintliga strukturer. Utöver scope, tid och budget behövs därför tre djupare förmågor:

- **People change management:** den mänskliga och kulturella sidan av förändringen.
- **Stakeholder management:** många och ofta motstridiga intressen, internt och i leverantörs- och kundkedjorna.
- **BPM expertise:** processredesign, styrning och mätning.

Weaver lägger till att BPM ofta ses som ett hot mot den egna positionen, av medarbetare, chefer och ibland ledningen. Han är också kritisk: Jeston har ägnat sin karriär åt BPM och kan vara hemmablind, och andra komplexa projekt kräver säkert också särskilda förmågor.

### People Change Management

**People Change Management** ser till att medarbetarna både **kan** (genom utbildning) och **vill** (genom motivation och engagemang) arbeta på det nya sättet. Hit hör siffran 60 procent (nedan). Det kräver **förtroende** (trust), **engagerat ledarskap**, **konsekvent kommunikation** och **medarbetare med egenmakt** (empowered employees). Empowerment är enligt Weaver en lärdom från BPR (kapitel 2): med RPA ska medarbetaren stärkas, inte ersättas, slippa de tråkiga uppgifterna och i stället ägna sig åt den roliga delen av jobbet, som att träffa andra människor. Jeston lyfter också **appreciative inquiry**, en framåtblickande och deltagande modell för att skapa förändring i stället för att bara reagera på den.

### Leadership

**Leadership** ger vision, förtroende och linjering med strategin, på **alla nivåer** och inte bara hos den högsta ledningen. Eftersom BPM ofta förändrar struktur och kultur på djupet ska ledarskapet inspirera och hålla förändringen vid liv, bland annat genom att vara en förebild och **ge medarbetarna egenmakt i stället för att kontrollera dem** (empowering rather than controlling). Weaver påpekar att ledarskap knappast går att bara lära ut utan måste finnas på plats, och att det krävs extra mycket när BPM kan hota medarbetarnas positioner.

## Människorna: minst 60 procent av arbetet

Jeston betonar att **minst 60 procent av BPM-arbetet bör gå till förändring som rör människor och till kommunikation**. Essäfråga 1(a) på ordinarie tentan HT25 utgick från samma siffra men angav den som "cirka 60 %", och ställde människorna och kommunikationen mot teknik och modellering. Weaver säger att det kan vara 60 procent, att Jeston inte nog kan betona det och att det är jätteviktigt. Ungefär samma siffra ser man i dag i AI-projekt, där en mycket stor del av tiden går åt till människorna och kommunikationen. Kursmaterialet ger flera skäl:

- **Förändringen sker i människor, inte i modeller.** En ny process finns bara om de som ska arbeta i den förstår den, kan den och vill den.
- **Rädslan finns redan.** Launch-fasens kommunikation ska bemöta rädslan för nedskärningar, outsourcing och automatisering. Obesvarad blir den motstånd. Weaver påpekar att rädslan är aktuell: företag som IKEA säger upp personal, och yrkesgrupper som mjukvarutestare försvinner när AI tar över. Att bara lova att ingen ska sparkas räcker inte alltid. Man kan behöva **sockra dealen** med utbildning och empowerment: medarbetaren får mer intressanta uppgifter i stället för att klicka mellan databaser.
- **Historien visar vad som händer annars.** BPR misslyckades bland annat för att det inte tog hänsyn till medarbetarnas acceptans och möttes av starkt motstånd (kapitel 2).
- **Medarbetarna bär kvaliteten.** Medelbra processer med engagerade medarbetare slår ofta bra processer med oengagerade (employee-centric BPM, kapitel 4).
- **Kommunikationen finns i varje fas.** Den är ett steg i alla tio faserna: sist i Foundations, eftersom grunderna och TOM måste vara överenskomna först, och genom hela fasen i de andra, också där den har ett högre nummer, som steg 7 i Sustainability.

Riskerna om människorna inte prioriteras följer av samma logik. Jeston konstaterar att många BPM-initiativ misslyckas just för att de försummar de mänskliga och kulturella dimensionerna, och Weaver säger att risken då är hög att projekten misslyckas. Punkterna nedan är en egen sammanfattning för essäsvaret:
- motstånd och svag användning av de nya processerna och systemen
- förbättringar som inte håller när projektet är slut, eftersom nyttorna eroderar (Sustainability ovan)
- ett tekniskt korrekt projekt som inte ger den nytta business case lovade

## BPM-mognad

**BPM-mognad** beskriver hur långt en organisation har kommit i att arbeta processorienterat. Kursmaterialet ger som exempel att vissa organisationer redan har vision, mål och processarkitektur på plats, medan andra börjar med splittrade insatser. Mognaden bedöms redan i Foundations. **Låg mognad gör BPM svårare** att genomföra. Föreläsningarna går inte in på någon mognadsmodell. Weaver säger att bokens avsnitt om BPM maturity inte behöver gås igenom. Men mognaden var en essäfråga på omtentan, så resonemanget nedan behövs.

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
    readingMinutes: 25,
    lead: "Rosemanns tre drifts med Weavers exempel, agentisk AI, Large Process Models, Green BPM i vision och verklighet, Reijers överblick, process mining som komplement till Jestons workshoppar och BPMN/DMN som stöd för förklarbarhet.",
    sources: ["Rosemann et al. (2024) s. 415–425", "Houy et al. (2012) s. 75–92", "Reijers (2021) s. 1–5", "Kampik et al. (2025), SAP Signavio-bloggen om Large Process Models", "F4b och F4 del 2 (Weaver 5 okt 2026): Green BPM, process mining, drifts, agentisk AI", "F5 (Weaver 12 okt 2026, bilderna och videon): förklarbarhet, GDPR, AI-förordningen, Trelleborg, process minings användningsområden", "Tenta HT25 ord 2(e), 3(a); omtenta 8, 11"],
    body: `
## Rosemann et al. (2024): tre drifts

Rosemann med flera beskriver hur BPM förändras när AI kommer in. **Första generationens BPM** hade ett problemeliminerande tankesätt. Målet var den friktionsfria processen, med kostnad och tid som huvudmått. Artikeln ser två begränsningar i det. Den första är ett "race towards 0", där processen till slut bara är en hygienfaktor. Den andra är ett kulturellt pris i form av förlorade jobb och prestation framför välbefinnande. Tre **drifts**, alltså skiften i hela fältet, pekar mot en ny generation:

1. **Från transaktion till konversation.** Konversationell BPM betyder att man kan tala naturligt språk med processinformationen och med extern data.
2. **Från automatisering till autonomisering.** Automatiseringen har gått i steg: först uppgifter (ERP), sedan kontrollflödet (workflow), sedan användarens interaktion med uppgiften (RPA). Nästa steg är **besluten**. En autonom process fattar själv beslut utifrån mål och begränsningar, och till skillnad från en automatiserad process är den inte förutsägbar.
3. **Från förenkling till sofistikering.** Processdesignen använder helt nya möjligheter, som avatarer, AR, biometri och videoanalys. Det kräver nya mått: tillväxt och upplevelse, och modererande mått som rättvisa och integritet.

Artikeln är en **editorial**, en ledartext som inleder ett temanummer, och ingen forskningsstudie. Författarna kallar själva skiftena illustrativa och inte uttömmande: de är exempel som ska väcka vidare forskning och diskussion, inte en fullständig lista. Texten har ändå viss tyngd, eftersom bland andra BPM-professorn Jan vom Brocke står bakom den.

Den nya generationen **utvidgar** den gamla, den ersätter den inte. Artikeln lyfter också **processetik**: integritet, jämlikhet, transparens och ansvarsskyldighet när processer automatiseras med AI.

### Konversation: att tala med processen

Första generationens BPM tänker i transaktioner med start, steg och slut, som alltid kan brytas ned och modelleras. En konversation saknar den formen: den är öppen, förs i naturligt språk och kan pågå medan processen körs. Flera **personas**, till exempel säljare, kund och AI-agent, kan tala med varandra om processen. Hur ska det modelleras? Skiftet i tre steg:
- **Kundchattbotar:** kunden frågar "vad är status på min order?". De flesta bygger fortfarande på nyckelord och beslutsträd, påpekar Weaver. En riktig LLM är ovanlig och en agent som fattar beslut om ordern i företagets system ännu ovanligare, men det börjar komma.
- **Interna frågor:** man frågar processprogramvaran "var finns flaskhalsarna?" i stället för att läsa BPMN-diagram och KPI:er.
- **Instruktioner i framtiden:** processerna tränas och instrueras med naturligt språk: automatiseringar promptas fram i stället för att byggas som RPA med low-code, och processerna kan själva rapportera resultat och problem.

### Autonomisering: från uppgifter till beslut

Artikeln beskriver automatiseringen i fyra steg. Årtalen är Weavers:

1. **Task automation** (1950–1980-talet): enskilda uppgifter, som löneberäkningen som förr krävde ett rum fullt av människor.
2. **Workflow automation** (1990–2015): systemet startar nästa steg när det förra är klart.
3. **User automation** (2015–2025): RPA tar över användarens arbete framför skärmen.
4. **Process autonomization** (2025 och framåt): AI tar också över styrningen (governance), och agenter fattar beslut och ändrar processen medan den pågår.

Artikeln räknar ERP-systemen till den första vågen, medan Weaver nämner dem vid workflow-steget. Ordningen är densamma: uppgift, flöde, interaktion, beslut.

Tidigare automatisering har designats och testats av människor, så utfallet är väntat. En agent som ändrar processen utifrån en kunds input går inte att testa för alla fall. Längst ut tänker sig Weaver en helt autonom avdelning som själv styr upp processen när den går fel, inom mål och begränsningar som människor har satt. Autonomiseringen kan också gälla bara en del av kedjan.

[[diagram:bpm-automatiseringens-steg]]

Weaver nämner också **"SaaSpocalypse"**: SaaS-bolagens (software as a service) värdering har sjunkit kraftigt, liksom aktien i ett RPA-bolag. Marknaden ser framför sig några stora AI-aktörer vars agenter gör nästan allt. Där är vi inte än.

### Sofistikering: rikare processer

Traditionell BPM har ett underförstått mål: to-be ska vara enklare och billigare än as-is. Med AI kan processerna i stället bli rika och sofistikerade, utan att nödvändigtvis bli mer komplexa. Informatikens begrepp **affordances** står för de möjligheter ett informationssystem ger men som vi inte alltid tar vara på. Exempel är åldersbedömning via ansiktet, virtuell provning (virtual try-on), en möbel visad i det egna rummet och en AI-baserad skaderapport till försäkringsbolaget. Enligt Weaver avfärdade Jeston sådant: det tillförde inget värde (det var inte value add). Artikeln kallar det ett äldre sätt att tänka och vill att BPM tar vara på AI:s möjligheter.

## Agentisk AI (bakgrund)

En AI-chattbot är redan en sorts agent, men det är **verktygen** (tools) som gör den **agentisk** (**agentic AI**): webbsökning, kalkylator, kodmodul, kalender eller andra funktioner. Den avgör då själv när den behöver söka, räkna eller skriva kod, och kan starta egna **underagenter**. En RPA-bot följer fasta vägar som lätt går sönder. En agent med tillgång till organisationens verktyg får i stället processens mål som en prompt och väljer själv verktyg. Det är autonomiseringen i praktiken.

Kapoor et al. (2024) beskriver tre dimensioner som gör ett system mer agentiskt:

1. **Miljö och mål:** mer komplex miljö, färre instruktioner.
2. **Gränssnitt och tillsyn:** förstår naturligt språk och agerar självständigt för användaren.
3. **Systemdesign:** designmönster som verktygsanvändning och planering, med en LLM som orkestrerar arbetsflödet.

Weaver återger en bedömning som han påpekar är något år gammal. Enligt den är reflektion (att resonera kring vad som ska göras) och verktygsanvändning robust teknik, medan avancerad planering och samarbete med andra agenter, till exempel hos andra företag, är framväxande.

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

**Green BPM** är skärningen mellan BPM och Green IS. Green IS rymmer mer än energisnål IT, nämligen även processer, människor och kultur. Organisatorisk hållbarhet betyder att vinst, sociala behov och miljö hanteras samtidigt. Artikeln fokuserar på miljön och ekonomin. Hållbarhet betyder här något annat än i 7FE-fasen Sustainability (kapitel 8), där det står för uthållig konkurrensfördel och för att förbättringarna underhålls och fortsätter förbättras i det löpande arbetet (business as usual).

Kärnidén är att **varje aktivitet i en processmodell annoteras med sin resursförbrukning och sitt avfall**, till exempel kilowattimmar, bränsle och koldioxid. Värdena summeras sedan per process. Då kan processer jämföras och göras om med miljön som mål. Ett äldre sekventiellt flöde kan till och med vara grönare än ett parallelliserat, om miljön väger tyngre än genomloppstiden. Artikeln föreslår också gröna SLA:er och lyfter att störst effekt väntas i processer mellan organisationer, där transporterna står för mycket. Möjligheterna struktureras längs hela BPM-livscykeln.

[[diagram:bpm-green-bpm]]

Houy pekar också på **utmaningarna**, och tentan frågade varför Green BPM inte fått det genomslag visionen förutspådde:
- mätbara hållbarhetsnyckeltal måste först tas fram, och förbrukningen kan ibland bara uppskattas
- kostnadseffektivitet är oftast den viktigare faktorn, och ekologiska och ekonomiska mål måste vägas mot varandra
- dagens BPM-verktyg är byggda för kostnad och tid, och måste anpassas eller nyutvecklas för att stödja hållbarhetsdata
- arbetssättet kräver förändring i kultur och ledning för att tas i bruk

Tentans rätta svar var att de flesta BPM-verktyg saknar inbyggt stöd för att lagra, räkna och analysera energi-, utsläpps- och resursdata i modellerna. Distraktorerna, som lagförbud, agentisk AI och process mining, har inget stöd i artikeln.

### Vision och verklighet

Visionen från 2012 har inte slagit igenom. Weaver kallar Green BPM "lite skakig" i dag: det finns forskning, men lite händer i praktiken.

**Redovisningen räknar på hela organisationen, inte per process.** Ryggraden är **GHG Protocol** (en organisations totala utsläpp per år) och ISO-standarder. I EU styrs redovisningens kvalitet av **CSRD**, unionens lag om hållbarhetsrapportering, och standarderna **ESRS**. CSRD bygger på GHG Protocol och liknande standarder, och metoden rekommenderar skattningar för hela företaget eller stora enheter. Ett företag skulle kunna räkna per process och lägga ihop: lagen förbjuder det alltså inte, men den och standarderna är inte byggda för den nivån. Arbetet sköts dessutom i ett eget spår, med egna programvaror och konsulter, utan BPM-verktyg och BPM-metodik.

**Fyra hinder** står i vägen:
- **Notationerna:** BPMN och DMN byggdes inte för kvantitativa hållbarhetsdata.
- **Verktygen:** få BPM-verktyg kopplar till GHG-databaser, IoT eller koldioxidredovisning.
- **Standardiseringen:** ingen branschstandard kopplar (ännu) processteg till utsläppsfaktorer och GHG-scopes.
- **Organisatoriska silos:** om hållbarhetsteamen och processteamen möts beror ofta på enskilda förespråkare.

Verktygsproblemet bakom tentans svar finns alltså kvar. Weaver utesluter ändå inte att det ändras: vill företagen förstå sitt fotavtryck bättre än de aggregerade siffrorna visar, kan Green BPM få en ny chans på processnivå.

## Reijers (2021): disciplinens utveckling

Reijers ger en överblick över drygt hundra artiklar i en tidskrift. Grundtanken är att **BPM i grunden är en managementidé**: organisationer som styr sina processer från början till slut presterar bättre än de som delar upp arbetet funktionellt. Det som utmärker ett **BPMS** jämfört med ERP är att det konfigureras med en **körbar processmodell** som workflowmotorn tolkar. De förväntade fördelarna var:
- mindre arbete genom automatiserad samordning
- flexibel integration av IT-system
- transparens och spårbarhet
- att organisationens policyer och regler blir lättare att upprätthålla

Enligt Reijers har potentialen inte förverkligats. Han skiljer också **design** från **modellering**. BPM betyder inte "Business Process Modeling": designbeslut gäller organisation, teknik och ansvar, modellering gäller hur det representeras. Process mining använder händelsedata för att se hur processer faktiskt körs. RPA beskrivs som botar som härmar människans manuella väg genom applikationerna.

## Process mining

**Process mining** är en uppsättning tekniker som använder **händelseloggar** (**event logs**) från informationssystemen för att automatiskt upptäcka, analysera och förbättra affärsprocesser utifrån hur de faktiskt körs. Weaver kallar process mining för det moderna BPM och "en av de stora delarna" av BPM i dag. Till skillnad från RPA, som har tappat fart, är det fortfarande hett. Jeston tar inte upp det.

Idén kommer från den holländske professorn Wil van der Aalst, BPM-fältets akademiska förgrundsgestalt och enligt Weaver process minings gudfar, och fältet är nästan helt europeiskt. Forskningen började i slutet av 1990-talet, och de första kommersiella tillämpningarna kom kring 2005. Genombrottet i stora företag kom när **big data** mötte tillräcklig beräkningskraft, enligt Weaver kring 2015. Process mining ligger i skärningen mellan data science och processvetenskapen. Metoden är matematisk, men programvaran gör beräkningarna, så arbetet ligger i att tolka resultatet.

### Snickaren och det digitaliserade företaget

Hos Weavers snickare, som tar emot order på telefon, syns bara att en order kom in och en vara skeppades ut. I ett genomdigitaliserat företag lämnar nästan allt däremellan en händelse i en databas. Process mining kör den datan genom algoritmer och ger tre sorters resultat:

- **En processmodell**, automatiskt, utan workshop eller intervjuer.
- **Diagnostik**, till exempel hur lång tid kundärendena tar.
- **Prediktion**, till exempel med maskininlärning: när går processen fel, kanske oftast på måndagar? Det har inte traditionell BPM.

### Traditionell BPM mot process mining

Båda vill förstå processen as-is, det som Jeston gör i Understand:

| Aspekt | Traditionell BPM (workshop) | Process mining (event logs) |
|---|---|---|
| As-is-förståelse | Hur vi tror att processen fungerar | Hur processen faktiskt fungerar |
| Kunskapskälla | Människor (intervjuer, workshoppar, observationer), dokumentation, BPMN-modeller | Händelseloggar från ERP-, CRM-, försäljnings- och workflowsystem |
| Typisk fråga | "Hur är det tänkt att processen ska fungera?" | "Hur fungerar processen egentligen?" |
| Styrkor | Rik verksamhetskunskap, mål, undantag, framtida design | Flaskhalsar, avvikelser, omarbete och varianter ur objektiv data från miljontals instanser |
| Begränsningar | Kan bli subjektiv eller ofullständig; komplex och tidskrävande | Kräver händelsedata av hög kvalitet; ser bara det IT-systemen registrerar |

Den traditionella vägen får med kultur och människor, tillägger Weaver, men i dagens tempo hinner man kanske inte allt Jeston rekommenderar, och människor kan vilja dölja saker. Process mining kräver rensad data, helst en **single source of truth**, och fångar inget kvalitativt, som vad kunderna tyckte.

### Fyra användningsområden

1. **Process discovery:** processmodellen rekonstrueras ur händelseloggarna (snickarexemplets automatiska modell).
2. **Conformance checking:** den upptäckta processen jämförs med den avsedda BPMN-modellen. Följer medarbetarna processen, var uppstår avvikelserna, bryts compliance-reglerna?
3. **Performance analysis:** processens prestanda, till exempel ärendenas tidsåtgång (jämför snickarexemplets diagnostik).
4. **Process enhancement:** datan används för att hitta och åtgärda det som drar ned processen: flaskhalsar, onödig väntan, omarbete och processvarianter.

De bildar en cykel av ständig förbättring: processen körs, loggarna analyseras, BPMN-modellen uppdateras.

Föreläsning 4 räknade tre förmågor som process mining tillför Jestons traditionella BPM: discovery, conformance checking och improvement. I uppräkningen med fyra har performance analysis egen punkt och improvement heter enhancement.

### BPMN och process mining

Process mining utgår från loggarna och kräver ingen BPMN-modell, men en sådan kan komplettera analysen, till exempel vid conformance checking. Weaver beskriver en spänning mellan Jestons mer traditionella BPM, med workshoppar och intervjuer, och det datadrivna process mining-fältet, som frågar varför man ska lägga tid på att modellera en abstraktion när verkligheten finns i loggarna. Enligt van der Aalst har process mining förändrat BPM-forskningen i grunden: BPMN-modeller som säger lite om hur processerna faktiskt går till är inte längre värda tid och pengar. Han vänder sig alltså mot modeller utan koppling till verkligheten, inte mot BPMN.

BPMN är inte heller process minings egen notation. Resultatet visas ofta som en **directly-follows graph** (**DFG**) över vilka aktiviteter som följer direkt på varandra. **Petri-nät** (kapitel 2) används i forskningen och i process mining, och resultatet kan omvandlas till BPMN. I ett pizzabak pendlar DFG:ns pilar mellan ost, tomat och salami, som lagts på i olika ordning i olika fall. Petri-nätet och BPMN visar dem som parallella vägar, i BPMN mellan AND-split och AND-join (kapitel 10). Den BPMN som kommer ur process mining är ett enkelt flödesschema, utan den rika notation som Silver använder. Syftena är olika.

### Ett komplement, inte en ersättare

Process mining ska kombineras med Jestons metod, inte ersätta den. Weaver ser flera vinster:
- BPM-arbetet kan **fokuseras på de processer som inte fungerar**, utan att hela organisationen genomlyses. Det passar i Launch-fasen, där process mining är det moderna komplementet till intervjuer och workshoppar när processerna väljs.
- Komplicerade processer som ingen orkat modellera för hand blir synliga.
- Efter ett BPM-arbete kan man jämföra med modellerna och process asseten: fungerar det som tänkt, och följs de egna reglerna?
- Datan finns nästan i realtid, så man kan **förutsäga** var problem uppstår.

Enligt Weaver finns process mining alltid med när ett moget företag gör BPM-arbete i dag.

### Marknaden (bakgrund)

Programvaran finns fristående och i de större BOAT-paketen, som BPM-programvaran kallas i dag (kapitel 2). Tre av fyra ledande plattformar i Gartners marknadsanalys är tyska, och Celonis ses som den mest framstående.

## Förklarbarhet: BPMN, DMN och regelverken

Tentan frågade hur BPMN och DMN stödjer regulatoriska krav på **förklarbarhet** (**explainability**) vid automatiserat beslutsfattande. Svaret var att de **gör beslutsflöden och beslutsregler visuella och förståeliga**. Då går det att förklara för den som beslutet gäller, till exempel en medborgare, varför beslutet blev som det blev. BPMN visar var i processen beslutet fattas och vad som händer före och efter. DMN visar reglerna som gav utfallet. Notationerna gör alltså logiken läsbar. De automatiserar inte förklaringen och skapar inga besluts- eller processloggar av sig själva. De översätter inte heller till naturligt språk, och de gör inte besluten enklare.

Det europeiska spåret av BPM arbetar mycket med offentlig sektor, och ett spår handlar enligt Weaver om att använda BPM för transparens i regulatoriska sammanhang. Forskningen om automatiserat beslutsfattande (**ADM**, automated decision-making) i offentlig sektor är kritiskt inriktad. Höga transparenskrav gäller bland annat sociala system, tillgång till bank och kredit, rättsväsendet och sjukvården.

**Kiesel och Grünewald** vid TU Berlin vill utvidga BPM för regulatorisk transparens: ett BPMN-tillägg märker aktiviteterna med det som de personuppgiftsansvariga (**data controllers**) måste dokumentera, händelseloggar registrerar det och process mining, till exempel **transparency conformance checking**, analyserar hur personuppgifterna flödar.

### GDPR: rätten att få veta och rätten att slippa

**Artikel 15** i dataskyddsförordningen **GDPR** ger den registrerade, den person som uppgifterna gäller, rätt till tillgång till sina personuppgifter. Där ingår uppgift om det förekommer sådant **automatiserat beslutsfattande** (**automated decision-making**), inklusive **profilering**, som artikel 22 gäller, och åtminstone i de fallen meningsfull information om logiken bakom, betydelsen och de förutsedda följderna.

**Artikel 22** ger rätt att inte bli föremål för ett beslut som **enbart** grundas på automatiserad behandling, om beslutet har rättsliga följder eller på liknande sätt påverkar personen i betydande grad. Undantag: beslutet är nödvändigt för ett avtal, tillåtet enligt EU-rätt eller nationell rätt med lämpliga skyddsåtgärder, eller personen har uttryckligen samtyckt. Vid avtal och samtycke har personen åtminstone rätt till **mänskligt ingripande**, att framföra sin synpunkt och att bestrida beslutet.

Weaver ger ett vardagsexempel: den som får ett automatiskt besked om sin motorcykelförsäkring kan begära att få veta hur beslutet fattades, och bolaget måste svara. Hur detaljerad förklaringen ska vara är däremot inte definierat.

### AI-förordningen

EU:s **AI-förordning** (**AI act**) delar in AI-system efter risk i fyra nivåer, som kan ritas som en **riskpyramid**:

| Risknivå | Följd | Exempel |
|---|---|---|
| **Oacceptabel** | Förbjudet | Social poängsättning, manipulation |
| **Hög** | Bedömning av överensstämmelse (conformity assessment) | Kritisk infrastruktur, anställning, sjukvård, brottsbekämpning |
| **Begränsad** | Transparenskrav | Chattbotar, deepfakes |
| **Minimal** | Uppförandekod | Spamfilter, datorspel |

Förordningen införs stegvis, och enligt Weaver kommer de skarpare delarna, som det ser ut nu, 2027–2028. Transparens är en av dess största frågor. Weavers exempel från utbildningen är högrisksystem: AI som rättar tentor, AI-stödd antagning och AI som letar efter fusk. Förordningen kräver också att man kan se var i ett system de automatiserade besluten fattas, och insyn i hur högrisksystemen tas fram.

Hajo Michael Holst delar in förordningens transparens efter vem den riktar sig till: **regulatory transparency** gäller leverantören (**provider**), **operational transparency** den som använder systemet (**deployer**) och **subject transparency** den person som berörs. Offentliga aktörer, och privata som utför offentliga tjänster, ska göra en **konsekvensbedömning för grundläggande rättigheter** när de använder högrisksystem.

**Artikel 86** hör till subject transparency och ger en **rätt till förklaring**. Den gäller beslut utifrån resultatet från vissa högrisksystem som har rättsliga följder eller på liknande sätt påverkar personen i betydande grad (samma formulering som i GDPR:s artikel 22), och som personen anser skadar hälsan, säkerheten eller de grundläggande rättigheterna. Personen har då rätt att av den som använder systemet få **tydliga och meningsfulla förklaringar** av AI-systemets roll i beslutsförfarandet och av beslutets huvuddelar. Artikel 86 gäller från den 2 augusti 2026.

Enligt forskningsprojektet Enlightenment 4.0 har en meningsfull förklaring tio delar, bland annat om och hur algoritmer fattade beslutet, i vilken grad människor var med och hur beslutet kan bestridas.

### Trelleborg: regelstyrt men inte genomskinligt

Trelleborgs kommun automatiserade delar av handläggningen av **försörjningsstöd** med RPA (kapitel 2), men den första bedömningen av arbetsförmågan görs alltid manuellt.

Akademikerförbundet SSR ville veta hur algoritmen fattar sina beslut och JO-anmälde kommunen efter ett års tystnad. Förbundet hänvisade till Digitaliseringsrättsutredningens formulering om rätten till meningsfull information om logiken bakom en automatisering (samma som i GDPR:s artikel 15) och menade att det ska gå att förstå utan programmeringskunskaper. Kommunen svarade att handläggarna har delegation att besluta och att roboten beslutar med samma underlag och efter samma lagar och riktlinjer, alltså en **regelstyrd RPA** och ingen **black box** (ett system vars inre logik inte syns utifrån).

En journalist fick ut källkoden sedan kammarrätten funnit att den var allmän handling. Koden var 136 000 rader regler i 127 XML-filer, och en del filer verkade innehålla äldre regeluppsättningar som inte användes. Utan datan gick reglerna inte att förstå med säkerhet. Med reglerna i DMN-beslutstabeller och flödet i BPMN blir logiken läsbar för den som beslutet gäller.

Weaver lyfter fyra saker ur fallet:
- **Begreppen blandas ihop.** Debatten talade om algoritmer och AI, men systemet var RPA, som inte är algoritmiskt beslutsfattande i samma mening.
- **Ingen hade dokumentationen.** Enligt Weaver programmerades roboten av en dansk utvecklare efter kommunens skiss, och kommunen kunde varken visa teknisk dokumentation eller något diagram.
- **Fallet blev internationellt.** Den tyska organisationen AlgorithmWatch drev frågan på EU-nivå.
- **Modellen kom i efterhand.** Ur den utlämnade koden försökte man återskapa en BPMN-modell.

Hade processen modellerats i BPMN och regeln i DMN från början, hade kommunen direkt kunnat visa hur besluten fattas. Som konsult i offentlig sektor kan man därför föreslå en modell just för transparensens skull, särskilt när böter för bristande transparens kan bli aktuella.

### Vad notationerna kan förklara

DMN kan bara förklara regler upp till ungefär det som går att uttrycka i ett kalkylark eller ett funktionellt skriptspråk (kapitel 10); bortom det blir DMN beslutslagret som anropar externa tjänster eller AI-modeller. Traditionella algoritmer, maskininlärning, generativ AI och mänskligt omdöme modelleras normalt inte i DMN, men resultat från ML och generativ AI kan vara indata till reglerna. I en **hybrid**, till exempel ett lånebeslut med regler och en riskpoäng från en ML-modell, tar DMN den regelbaserade delen.
`,
  },
  {
    id: "kap10",
    number: 10,
    title: "BPMN: grunderna",
    readingMinutes: 25,
    lead: "Hur BPMN blev en ISO-standard, ett modellspråks fyra komponenter, vad BPMN passar och inte passar för, elementen och namngivningen, Silvers Method and Style, visuell mot körbar BPMN — och DMN med rabattexemplet.",
    sources: ["Björn Svenssons BPMN-genomgång (efter Silver 2017)", "Övningshäftet 1.1–1.3 (facit)", "F5 (Weaver 12 okt 2026, bilderna och videon): historik och ISO, Silver (2019) Method and Style, Dumas et al. (2018), visuell och körbar BPMN, DMN", "DMN: F1 (inlämningsuppgiften), F2 (business rules engine), F5 (rabattexemplet)", "Tenta HT25 omtenta 13, 14"],
    body: `
**BPMN** (Business Process Model and Notation) är en standard för att rita affärsprocesser. Den ägs inte av något enskilt företag utan förvaltas av Object Management Group (OMG). Kursens BPMN-material följer Bruce Silvers *Method and Style*. Det är en uppsättning regler ovanpå standarden som gör diagrammen entydiga.

## BPMN:s historik och standardisering

Behovet av att **beskriva verksamhetens processer visuellt, på ett standardiserat och återanvändbart sätt** uppstod tidigt. Gilbreth och Gilbreth publicerade 1921 **process charts** med symboler för arbetsmomenten, till exempel för hur gevärsgranater laddas, för att hitta "the one best way" att utföra ett arbete. Allan H. Mogensen kallas **"father of work simplification"**. Enligt Weaver höll han en Work Simplification Conference från 1930- till 1960-talet, dit nästan alla stora amerikanska företag skickade medarbetare för att lära sig förenkla arbetet med flödesscheman. Den pragmatiska amerikanska traditionen nämns sällan i BPM-böckerna, eftersom BPM som akademiskt ämne främst har europeiska rötter. Ordet *simplification* är just det som Rosemanns drift från förenkling till sofistikering (kapitel 9) lämnar. År 1947 standardiserade American Society of Mechanical Engineers (ASME) symbolerna för **flow process charts**, bland annat operation, transport, delay och storage.

Fem förlöpare är särskilt viktiga:

| Förlöpare | Bidrag till BPMN |
|---|---|
| **Flowcharts** (1920–1960-tal) | grafiska byggstenar: aktiviteter, beslut, flöde |
| **Event-driven Process Chains (EPC)** (tidigt 1990-tal, spridd i SAP-miljöer, en nära föregångare) | aktiviteter, händelser och gateways (logiska konnektorer AND, OR, XOR) |
| **UML activity diagrams** (sent 1990-tal–2000-tal) | aktivitetstyper, parallellitet, strukturerad modellering (med swimlanes) |
| **Petri-nät** (1960-tal) | formell grund för processbeteendet och körsemantiken (parallellitet, synkronisering, deadlocks) |
| **Workflow-språk** (1990–2000-tal) | krav från körning och automatisering (exakt körsemantik, synkronisering, undantag) |

Utvecklingen går mot **en enda standard för både processnotation och körning**:

- **2002:** BPMN uppstår inom BPMI.org, som grafisk notation till **Business Process Modeling Language (BPML)**, ett XML-språk för att köra processer.
- **2004:** BPMI.org släpper BPMN 1.0. Den visuella notationen är i stort sett den som används i dag, men kopplingen till XML saknas.
- **2005:** BPMI.org går upp i OMG, som antar BPMN 1.0 formellt 2006.
- **2011:** BPMN 2.0, med **standardiserad XML** och utförligare **körsemantik** (execution semantics).
- **2013:** BPMN 2.0 blir **ISO-standard** (ISO/IEC 19510:2013).

ISO-statusen ger legitimitet, spridning och långsiktig stabilitet, särskilt för **myndigheter, reglerade branscher, upphandlingar och internationella organisationer**, men gör utvecklingen långsammare och mindre smidig, till exempel inför AI.

I dag ingår BPMN i OMG:s **BPM+**-familj med **CMMN** (Case Management Model and Notation) och **DMN** (Decision Model and Notation). BPMN beskriver processer procedurellt, med en token som följer flödet, CMMN ärenden (cases) deklarativt och händelsestyrt, och DMN beslut och regler. **Till skillnad från BPMN är DMN inte en ISO-standard.**

## Ett modellspråks fyra komponenter

Enligt Dumas et al. (2018) har ett modellspråk fyra komponenter: **vocabulary** (elementen, som events, activities, gateways och sequence flows), **syntax** (reglerna för vilka element som får kopplas ihop, och hur), **semantics** (vilket beteende varje element och koppling representerar) och **notation** (de standardiserade symbolerna). **Ett BPMN-diagram måste stämma på alla fyra.**

Ett litet exempel är en kreditprövning: message start "Receive loan application", user task "Check credit worthiness" och en XOR-gateway med "Passed" och "Failed" till var sin message end event, "Application approved" och "Application rejected".

## Vad BPMN passar för

BPMN beskriver processer som har en **definierad start och ett definierat slut**, som **utförs på instanser** (till exempel en order) och där **alla aktiviteter är kända i förväg**. Exempel är orderprocessen, rekryteringsprocessen och introduktionen av nyanställda. BPMN passar **inte** för kontinuerliga eller ostrukturerade processer som löpande återkopplingsslingor, ledningsprocesser eller ständig förbättring.

Tentan prövade det med fyra förslag. Rätt svar var ersättningshanteringen för en reseräkning, som skickas in, kontrolleras, kompletteras vid behov, attesteras och avslutas som **Utbetald** eller **Avslagen**. Förbättringsgruppen som tar emot idéer löpande, kunskapsdelningen i Teams utan avslutspunkt och policyarbetet som revideras vid behov saknar alla definierad start, slut och instans.

**Instansregeln** har en följd: alla aktiviteter i en process ska gälla samma sorts instans. En modell där vissa aktiviteter gäller en batch av order och andra en enskild order är fel.

## Fördelar och begränsningar enligt Silver

Silver ser fem **fördelar**: **standardization** (leverantörsoberoende ISO-standard), **precise semantics** (formellt definierade betydelser), **expressiveness** (parallellitet, händelser och undantag), **accessibility to different stakeholders** och **business–IT bridge**, som förenar grafisk begriplighet med den precision som krävs för att automatisera.

Han ser också fyra **begränsningar**:

- **Structured processes:** passar sämre för öppet, oförutsägbart arbete och pågående funktioner ("Manage customer relationships" mot den avgränsade processen "Handle customer complaint"). CMMN finns för ostrukturerade processer men har inte fått någon större spridning.
- **Task logic:** beskriver flödet, inte den inre logiken i aktiviteter eller komplexa affärsbeslut. Beslutslogiken kan beskrivas med DMN, sist i kapitlet.
- **Process performance:** modellerar inte handläggningstid, kostnad eller resursutnyttjande direkt.
- **Business context:** beskriver inte strategi, mål, policyer, resurser eller stödsystem heltäckande.

Weaver kallar BPMN-böckernas vardagsexempel, som att baka pizza eller ordna ett studentevent, dåliga exempel. Sådant arbete är ostrukturerat: telefonen ringer och kunder kommer in, och undantagen går inte att beskriva. Att BPMN inte är byggt för prestation kan enligt honom vara en anledning till att Green BPM aldrig slog igenom (kapitel 9). Verktyg som Trisotech och Camunda låter ändå modelleraren lägga in mått, som tid och kostnad per aktivitet.

### När BPMN inte passar: fem frågor

Fem **heuristiker** att ställa innan du ritar:

| Fråga | BPMN passar dåligt för |
|---|---|
| 1. Tydlig start och tydligt slut? | pågående funktioner (kundrelationer, affärsstrategi) |
| 2. Kan vägarna bestämmas i förväg? | arbete där nästa steg väljs under tiden (forskning) |
| 3. Gäller det hur ett beslut fattas? | beslutskriterier och affärsregler (kreditprövning) |
| 4. Prestation snarare än flöde? | kostnader, resursutnyttjande, handläggningstider |
| 5. Organisationens struktur eller strategi? | förmågor, ansvar, strategiska samband |

Frågorna följer begränsningarna: 1–2 strukturerade processer, 3 beslutslogik, 4 prestation och 5 sammanhang. De tre felaktiga förslagen i tentafrågan ovan faller redan på den första frågan.

Enligt Weaver är de två–tre första frågorna viktigast. Hans exempel är akuten: stegen kan i teorin bestämmas i förväg, men i praktiken ser varje fall olika ut. Den som främst vill mäta prestation kan gå direkt på till exempel ett balanserat styrkort. Det är en avvägning: en idealiserad modell av akuten kan vara värd att rita, om man är medveten om BPMN:s begränsningar.

## Aktiviteter och task-typer

En **aktivitet** är en arbetsenhet som tar tid. Den namnges **verb–objekt**: "Review loan application", inte "Loan application review". Typen visar hur arbetet utförs. Källorna skiljer sig åt: genomgången beskriver bara user och service task, några typer syns i tentans och häftets diagram, och resten är BPMN-standardens begrepp (Silver 2017) som genomgången inte tar upp.

- **User task** (en person), ur genomgången: utförs av en människa. Även när en person klickar på en knapp och systemet gör resten räknas det som user task.
- **Service task** (kugghjul), ur genomgången: automatiserad, utan mänsklig interaktion.
- **Send task** (fyllt kuvert) och **receive task** (ofyllt kuvert), ur tentans elementfråga och häftets facit: skickar respektive väntar på ett meddelande.
- **Manual task** (hand), ur tentans diagram: utförs för hand.
- **Script task**, ur BPMN-standarden (Silver 2017), inte i genomgången: kör ett skript.
- **Business rule task** (liten tabell), ur BPMN-standarden och rabattexemplet sist i kapitlet: anropar en beslutsregel, till exempel en DMN-beslutstabell. Den kopplar till den **business rules engine** som F2 tar upp och till HT25:s fråga 3(a) om hur BPMN och DMN tillsammans gör automatiserade beslut förklarbara.

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

Sequence flow, message flow och association kallas i BPMN-standarden (Silver 2017) för **connecting objects**. Begreppet tas inte upp i genomgången.

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

## Method and Style: korrekt är inte samma sak som bra

Silvers **Method and Style** består av **method**, ett systematiskt sätt att bygga konsekventa modeller, och **style**, konventioner som gör diagrammen tydliga, kompletta och entydiga. Weaver jämför med en stilguide för journalister, som The Economists: grammatiken räcker inte för att skriva bra. Poängen är att **en BPMN-modell kan vara tekniskt korrekt utan att vara en bra processmodell**: processlogiken ska gå att förstå direkt ur diagrammet. Silvers exempel, en ansökan som godkänns eller avslås, visar skillnaden. Både den dåliga och den bra versionen finns att köra under fliken BPMN-övningar.

### Dålig men korrekt BPMN

En none start (otriggad start, tom cirkel) går direkt till en XOR-gateway utan etikett. Yes leder till "Approve application", No till "Reject application", och båda slutar i samma sluthändelse, "End". Allt är tillåtet, men tre saker brister:

1. **Ingen bedömningsaktivitet före XOR-gatewayen.** Diagrammet visar inte var beslutet fattas. Silver vill att en XOR följer en aktivitet vars utfall avgör vägen.
2. **Yes och No saknar sammanhang.** Ja eller nej till vad?
3. **Utfallen skiljs inte åt.** Silver vill att de alternativa sluttillstånden visas var för sig.

### Bra BPMN enligt Method and Style

En **white-box pool**, alltså en pool där processen syns, heter "Application Assessment Process", och den sökande, "Applicant", är en black-box pool. Message start "Receive application" leder till user tasken "Assess application", och XOR-gatewayen styr efter bedömningens utfall, med gates "Approved" och "Rejected" till två message end events (tjock cirkel med fyllt kuvert), "Application approved" och "Application rejected". Tre namngivna message flows går mellan poolerna: "Application" in till starten och "Approval notification" och "Rejection notification" ut från var sin sluthändelse.

Sluthändelserna följer kursens regel, men två saker avviker från kursens namngivning: starten heter "Receive application", inte "Received application", och gatewayen saknar etikett medan gates heter efter utfallen, som i övningshäftets facit, i stället för en fråga med Yes och No. Båda sätten ger vägarna det sammanhang som saknas i det dåliga exemplet.

Den dåliga versionen säger en chef utan BPMN-kunskap ingenting, menar Weaver, medan de flesta kan läsa sig till vad den bra handlar om. Han ritade den bra versionen själv och lät en AI-chatt granska den, och hittade sedan fel som chatten hade missat. AI är alltså inte pålitlig på BPMN.

## Subprocesser

En **subprocess** består själv av aktiviteter. Den ritas **kollapsad**, med ett litet plustecken, och länkar till ett eget **barndiagram**. Den kan också ritas expanderad. Subprocesser gör diagrammen läsbara och hierarkiska. **Ett diagram bör ha högst tio aktiviteter.** Två regler gäller barndiagrammet:

1. Det måste ha en **otriggad start** (tom cirkel), eftersom det startas av att sekvensflödet når subprocessen i föräldern.
2. Om subprocessen följs av en gateway i föräldern ska **antalet sluthändelser i barnet vara lika med antalet gates**. I övningshäftets blombud slutar leveranssubprocessen i "Delivery succeeded" och "Delivery failed", och XOR-gatewayen efter den har exakt de två vägarna.

En **call activity** har **tjock ram**. Den anropar en fristående process som är modellerad separat och kan återanvändas av flera processer, till exempel en verifiering av finansiella uppgifter som både kreditkortsansökan och kontouppgraderingen använder. En **loop marker** betyder enligt BPMN-standarden (Silver 2017) att aktiviteten upprepas tills ett villkor är uppfyllt. Tre lodräta streck, som på element A i omtentans elementfråga, är en parallell **multi-instance**-markör. Dess betydelse förklaras inte i kursmaterialet.

En komplex process blir så en **hierarki av diagram**, från toppdiagrammet (nivå 0) ner genom barndiagram i nivå 1, 2 och så vidare. Ett barndiagram är inbäddat i föräldern (embedded) eller en separat process som föräldern refererar till (referenced).

## Visuell och körbar BPMN

**Visuell modellering** är till för att kommunicera, analysera och förbättra processer. Analytiker, chefer och verksamhetsanvändare läser diagrammen, och tekniska detaljer som systemkonfiguration och integrationer utelämnas. **Körbara processmodeller** körs av en BPM- eller workflowmotor som automatiserar och orkestrerar processen. Diagrammet kan se lika enkelt ut som ett visuellt, men under det måste subprocesser, anropade processer, tjänster, beslut, datamappningar och felhantering vara definierade.

Weaver knyter det till Method and Style: den dåliga versionen av ansökningsexemplet går inte att köra, eftersom båda utfallen slutar i samma sluthändelse. Ska processen skicka två olika meddelanden behövs två sluthändelser. En bra visuell modell är alltså en förutsättning för en körbar.

**RPA ligger på en lägre nivå.** Den automatiserar arbetet inne i en user task, där en människa klickar sig mellan skärmar, och det är **task automation**. En processmotor orkestrerar i stället hela flödet (**process orchestration**). Gränsen är enligt Weaver inte skarp: Microsoft Power Automate har till exempel också RPA-funktioner.

### Hur modellen körs (bakgrund)

Kursen går inte in på det här, säger Weaver, men det är en stor del av varför BPMN används. **Diagrammet visar vad som händer. Körbarhetsegenskaperna (execution properties) anger hur det utförs.** De lagras i **BPMN XML** och ställs oftast in i verktygets properties-panel. Typiska egenskaper är REST endpoint, Java class, variabelmappningar, säkerhetsroller och retry policies. Service tasken "Check inventory" kan till exempel köra en Java-klass eller anropa en REST-tjänst med orderns id, försöka igen upp till tre gånger och ha en timeout på 60 sekunder.

Både **BPMS** och **BOAT**-plattformar (kapitel 2) kan köra BPMN XML i en **processmotor** (process engine). Motorn är kopplad till användarna, till beslutsreglerna i **DMN** och via middleware till ERP, äldre system och externa tjänster. Den ger nyckeltal (KPI) till **business activity monitoring (BAM)**, som återkopplar till processmodellen. Analytikerns modell och utvecklarens körbara detaljer ingår i organisationens **process asset** (kapitel 6).

**BPMN XML är bara ett av flera sätt** att orkestrera och köra automatiserade flöden. Andra är lågkodsplattformar (som Power Automate), orkestrering i molnet (till exempel hos Amazon), kodbaserad orkestrering (till exempel i JavaScript), arbetsflöden inbyggda i affärssystem och plattformar som ServiceNow och Salesforce, och egna lösningar. De använder i regel inte BPMN. BPMN-motorer, som europeiska Camunda, bygger på en öppen standard och passar för processer från början till slut, med både system och människor. Poängen är enligt Weaver att slippa låta en programmerare koda varje process och gå in i koden vid varje ändring.

## DMN: beslutsregler

**DMN** (Decision Model and Notation) beskriver **beslut** på samma sätt som BPMN beskriver processer. Beslutsreglerna läggs i **beslutstabeller**, och sambanden mellan beslut och deras indata visas i ett **DRD** (Decision Requirements Diagram). En processmotors business rules engine kan köra tabellerna. I BPMN-diagrammet kopplas beslutet in med en **business rule task**. Gruppuppgiften använder DMN. På salstentan har DMN förekommit i HT25 (hur BPMN och DMN stödjer förklarbarhet, kapitel 9). Enligt Weaver är DMN bara en liten detalj i kursen.

### Exemplet: rabatt på fakturan

Rabatten på en faktura beror på ordersumman och kundtypen, "Ordinary" eller "A". Grundrabatten följer ordersumman:

| Ordersumma | Grundrabatt |
|---|---|
| Under 500 | 0 % |
| 500–999 | 2 % |
| 1000–1500 | 3 % |
| Över 1500 | 4 % |

Om ordern är över 500 tillkommer en tilläggsrabatt efter kundtyp: 0 % för Ordinary och 1 % för A.

**Alternativ 1: reglerna i flödet.** En XOR, "Sum of order?", delar flödet i fyra vägar. Under 500 går direkt till "Create bill". De tre andra har var sin service task som räknar 2, 3 eller 4 % rabatt, följd av en XOR, "customer type?", där typ A leder till aktiviteten "add an extra 1% discount". Det går, men **reglerna hamnar i processflödet**: kundtypsfrågan ritas tre gånger, och en ny rabattnivå kräver en ny gren. Weaver kallar varianten tekniskt korrekt men något man aktivt ska undvika, eftersom det blir svårt att se hur beslutet fattas och vilka reglerna är.

**Rätt lösning: en business rule task.** Processen blir "Invoice requested", "Determine discount" (business rule task), "Create invoice" och "Invoice created". Flödet visar var beslutet fattas, och reglerna ligger i DMN. Ett beslut kräver inte en XOR-gateway direkt efter sig. En gateway behövs bara om flödet faktiskt ska dela sig på utfallet.

I DMN:s **DRD** bygger toppbeslutet "Total discount" på de stödjande besluten "Base discount" och "Additional discount". Pilarna mellan elementen kallas **information requirements**. **Input data** är "Order value", som går till båda, och "Customer type", som bara går till "Additional discount". De stödjande besluten har var sin beslutstabell, och toppbeslutet räknas i **FEEL**, DMN:s uttrycksspråk: "if baseDiscount = 0 then 0 else baseDiscount + additionalDiscount". En A-kund med en order under 500 får alltså ingen rabatt alls. FEEL behöver man inte kunna, säger Weaver; AI kan ta fram uttrycken. Det viktiga är att DRD:n visar rätt indata och de beslut som krävs.

[[diagram:bpm-dmn-drd]]

### Var DMN:s gräns går

DMN kan förklara reglerna bakom ett beslut bara upp till en viss komplexitet, och det sätter en gräns för förklarbarheten (kapitel 9). Gränsen går ungefär vid det som ryms i ett **kalkylark** eller ett **funktionellt skriptspråk**, till exempel komplex poängsättning av lånebehörighet eller riskbedömning med flera viktade kriterier. Inom sin deklarativa, tabellbaserade ram med FEEL kan DMN modellera komplexa beslut med många kriterier genom logiska regler. Bortom det, för procedurella eller datadrivna algoritmer, fungerar DMN i regel som det styrande **beslutslagret**, som anropar externa tjänster eller AI-modeller.

Weavers exempel på det som DMN inte klarar själv: dynamisk prissättning av flygresor i realtid, maskininlärning som letar bedrägerier, och generativ AI som läser av tonen i ett mejl eller chattmeddelande och eskalerar en upprörd kund. Är något oklart eller saknas uppgifter kan beslutet lämnas till en människa (**defer to human**). I verkligheten är det ofta en hybrid. DRD:n visar då fortfarande hur besluten hänger ihop, men de beslut som kommer från andra moduler har inga beslutstabeller.

### Sätt att fatta beslut

DMN är ett av flera sätt att implementera beslutet, som i BPMN är en aktivitet mellan ärendet (case) och åtgärden (action). Sätten kan kombineras.

| Sätt | Exempel | Kännetecken |
|---|---|---|
| **DMN** | rabatter, lånebeslut | explicit, transparent regellogik i standardnotation; passar verksamhetsanalytiker |
| **Traditionella algoritmer** | pris- och ruttoptimering | matematiska beräkningar; kräver ofta teknisk specialistkunskap |
| **AI och maskininlärning** | bedrägeriupptäckt, kreditrisk | mönster i historisk data, icke-linjära samband; kan vara indata |
| **Generativ AI** | ostrukturerade kundklagomål | klassificerar, sammanfattar och extraherar ur naturligt språk; kan vara indata |
| **Mänskligt omdöme** | ovanligt försäkringsärende | expertis och kontext i komplexa eller tvetydiga fall; kan stödjas av verktyg eller AI |
| **Hybrider** | lånebeslut med regler och en ML-riskpoäng | kombinerar regler, AI och omdöme; DMN kan ta regeldelen |

Algoritmer, AI och mänskligt omdöme modelleras normalt inte i DMN.
`,
  },
  {
    id: "kap11",
    number: 11,
    title: "BPMN: händelser och att köra en process",
    readingMinutes: 13,
    lead: "Starthändelser, throw och catch, timers, event-based gateway, boundary events, error, event subprocesser, terminate och OR-join — och hur du kör ett diagram steg för steg, som på tentan.",
    sources: ["Björn Svenssons BPMN-genomgång (efter Silver 2017), s. 27–66", "Tenta HT25 ord 3(b)–3(d), omtenta 13, 15, 16", "BPMN-standarden enligt Silver (2017)", "F2 (business rules engine)"],
    body: `
BPMN-frågorna ger upp till sju poäng styck, och de flesta går ut på att **köra ett diagram**. Det här kapitlet går igenom händelserna och sedan metoden. Diagrammen och övningarna finns under fliken BPMN-övningar.

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

[[diagram:bpm-handelser]]

### Event-based gateway

En **event-based gateway** följs av catching events. **Bara den väg vars händelse inträffar först aktiveras**. De andra vägarna stängs. Det är skillnaden mot en XOR, som testar data: här avgörs vägen vid körning av vilken händelse som hinner först.

## Boundary events

Ett **boundary event** sitter på kanten av en aktivitet och har **inga inkommande sekvensflöden**. Det lyssnar så länge aktiviteten pågår.

- **Interrupting** (heldragen dubbelcirkel): när signalen kommer **avbryts aktiviteten**, och processen följer undantagsflödet.
- **Non-interrupting** (streckad dubbelcirkel): **aktiviteten fortsätter**. Undantagsflödet startar parallellt, och när aktiviteten blir klar följer processen också sitt vanliga flöde.

Message- och timerhändelser kan vara non-interrupting. Genomgångens exempel är ett meddelande om kompletterande uppgifter under granskningen, och en avisering till sökanden om handläggningen dröjer. **Error boundary events är alltid interrupting.**

[[diagram:bpm-interrupting]]

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
  { term: "BOAT", definition: "Business Orchestration and Automation Technologies: dagens plattformar för orkestrering och automatisering, där BPM-systemen ingår.", chapter: "kap2" },
  { term: "Bottom-up", definition: "BPM som startas av processägare eller team för lokala förbättringar. Ger quick wins och engagemang, men riskerar att stanna lokalt.", chapter: "kap3" },
  { term: "BPA (Business Process Automation)", definition: "Processautomation: att automatisera processer eller delar av dem.", chapter: "kap1" },
  { term: "BPM (Business Process Management)", definition: "Enligt Jeston implementering, exekvering och styrning (governance) av processer. En managementdisciplin, inte en mjukvara och inte bara modellering.", chapter: "kap1" },
  { term: "BPM lifecycle", definition: "Det akademiska perspektivets cykel: identifiering, modellering, discovery (as-is), analys, redesign (to-be), implementering och monitoring.", chapter: "kap1" },
  { term: "BPM-mognad", definition: "Hur långt en organisation kommit i att arbeta processorienterat. Tempot i BPM-arbetet ska matcha mognaden.", chapter: "kap8" },
  { term: "BPMS", definition: "Business Process Management System: programvara för att modellera, köra och följa upp processer, med en körbar processmodell som workflowmotorn tolkar.", chapter: "kap2" },
  { term: "BPR (Business Process Reengineering)", definition: "Hammers (1990) radikala omdesign av processer med hjälp av IT. För radikalt, dyrt och motståndsdrabbat; BPM:s föregångare.", chapter: "kap2" },
  { term: "Business as usual", definition: "Jestons fjärde scenario: BPM är fullt inbäddat i organisationens sätt att arbeta. Används också i vanlig mening om den löpande verksamheten, som resultatet förs över till i Implement och Sustainability.", chapter: "kap3" },
  { term: "Business issue-led", definition: "BPM-initiativ som svarar på ett konkret verksamhetsproblem; taktiskt, lokalt och bottom-up.", chapter: "kap3" },
  { term: "Chief Process Officer (CPO)", definition: "Den högst ansvariga för processarbetet i governance-strukturen. Ofta en tillfällig roll som sällan syns i organisationsscheman.", chapter: "kap6" },
  { term: "Continuous process improvement (CPI)", definition: "Stegvis, ständig förbättring av processer, i motsats till BPR:s radikala omdesign.", chapter: "kap2" },
  { term: "Customer-centric BPM", definition: "BPM som utgår från kundens verkliga upplevelse: att ta bort irritationer ger mer än wow-faktorer; färre hand-offs, en kontaktpunkt.", chapter: "kap4" },
  { term: "Different sameness", definition: "Resultatet av att bara förbättra operational efficiency: små förbättringar utan verklig förändring.", chapter: "kap6" },
  { term: "Driver", definition: "Ett affärsskäl eller motiv som får organisationen att agera, ofta internt och vardagligt (flaskhalsar, kostnader, churn) och något man kan arbeta proaktivt med.", chapter: "kap3" },
  { term: "Employee-centric BPM", definition: "BPM som utgår från motiverade medarbetare, empowerment och servant leadership.", chapter: "kap4" },
  { term: "Enablement", definition: "Fas 2 i 7FE: bygger komponenterna i TOM — kommunikation, process governance, processarkitektur, performance management, människor och kultur, organisationsdesign och teknik.", chapter: "kap6" },
  { term: "Enterprise Architecture (EA)", definition: "Den övergripande ritningen för hur organisationen ska realisera sin strategi. BPM är ett operativt lager i EA.", chapter: "kap1" },
  { term: "Essentials (7FE)", definition: "De tre förmågor som ska genomsyra alla faser: project management, people change management och leadership. Jeston kallar dem bedrock, berggrunden som all BPM-aktivitet vilar på; försummas de tippar, sjunker eller kollapsar BPM-arbetet. Inte samma sak som framgångspallen.", chapter: "kap8" },
  { term: "Foundations", definition: "Fas 1 i 7FE: säkerställer linjeringen mellan strategi, processledning och processer. Skapar inte strategin.", chapter: "kap6" },
  { term: "Green BPM", definition: "Skärningen mellan BPM och Green IS: varje aktivitet i processmodellen annoteras med resursförbrukning och utsläpp för miljömedveten design (Houy et al. 2012). Har inte fått genomslag, framför allt eftersom BPM-verktygen saknar inbyggt stöd för hållbarhetsdata.", chapter: "kap9" },
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
  { term: "Process steward", definition: "Ungefär processägare: under process executives, ansvarar för enskilda processer och BPM-projekt och för prestationsstyrningen på processnivå.", chapter: "kap6" },
  { term: "Process mining", definition: "Algoritmisk analys av händelseloggarna i IT-systemen som visar hur en process faktiskt körs och var flaskhalsarna finns. Fyra användningsområden: process discovery, conformance checking, performance analysis och process enhancement (föreläsning 4 räknade tre förmågor: discovery, conformance checking och improvement). Process mining kräver inte BPMN, även om BPMN kan användas. Enligt Weaver det moderna komplementet till intervjuer och workshoppar.", chapter: "kap9" },
  { term: "Process-led", definition: "BPM-initiativ som växer ur processarbetet självt: en organisation med en processlivscykel igång ser löpande var flaskhalsarna uppstår.", chapter: "kap3" },
  { term: "Processnivåer", definition: "Jestons fem nivåer av processbeskrivning, från enterprise-processkarta (1) till detaljer för systemutvecklare (5).", chapter: "kap6" },
  { term: "Processoptimeringslösningar", definition: "Jestons fem sätt att optimera en process i Innovate: process optimization (BPM), alltså att behålla processen och designa om den (i tentan process redesign), outsourcing, shared services, RPA och cloud computing. Risken skiljer sig: outsourcing hög, shared services medel, processoptimering och RPA låg. Cloud computing är enligt Weaver snarare infrastruktur.", chapter: "kap4" },
  { term: "Produktivitetsparadoxen", definition: "Att 70- och 80-talens IT-investeringar inte syntes i produktiviteten (Solow 1987).", chapter: "kap2" },
  { term: "Quick win", definition: "En liten förbättring som kan genomföras snabbt, utan stora kostnader, och ger en omedelbar förbättring i en process. Launch-fasens intressentintervjuer letar efter quick wins som betyder något för intressenterna, och Understand tar fram dem systematiskt: genomförbara inom fyra till åtta veckor, ofta bottom-up, och ett sätt att göra BPM-projektet självfinansierande.", chapter: "kap3" },
  { term: "Red Wine Test", definition: "Visionsövning där deltagarna föreställer sig att projektet är klart och beskriver framtiden, med ansvar per svar. Skapar ett gemensamt narrativ om framgång.", chapter: "kap6" },
  { term: "RPA (Robotic Process Automation)", definition: "Mjukvarurobotar som fungerar som virtuella medarbetare och härmar människors interaktion med applikationerna i de befintliga systemen. Snabba att införa men svåra att skala till hela organisationen; i dag en hygienfaktor i BPM-systemen. Begränsning: arbetar via UI, inte robusta integrationer.", chapter: "kap2" },
  { term: "Sarbanes-Oxley (SOX)", definition: "Amerikansk lag 2002 efter Enron som krävde spårbar intern kontroll av processerna kring finansiell rapportering.", chapter: "kap2" },
  { term: "Servant leadership", definition: "Ledarskap som stödjer, coachar och möjliggör i stället för att detaljstyra.", chapter: "kap4" },
  { term: "7FE", definition: "Jestons ramverk: tio faser i fyra F-grupper (Foundations, Findings & solutions, Fulfilment, Future) plus tre essentials.", chapter: "kap5" },
  { term: "SOA", definition: "Service-Oriented Architecture: affärsfunktioner som återanvändbara, löst kopplade tjänster som processer kan orkestrera.", chapter: "kap2" },
  { term: "Spreadsheet-testet", definition: "Jestons mått: hur många kritiska processteg vilar på kalkylark? Kalkylark signalerar att processen behöver förbättras före automatisering.", chapter: "kap4" },
  { term: "Strategy execution void", definition: "Gapet mellan organisationens strategiska avsikt och dess förmåga att genomföra strategin; består av management effectiveness och operational efficiency.", chapter: "kap6" },
  { term: "Strategy-led", definition: "BPM-initiativ som följer av strategin och startar i Foundations och Enablement; top-down.", chapter: "kap3" },
  { term: "Target Operating Model (TOM)", definition: "Övergripande bild av hur organisationens delar ska fungera i framtiden. Sju komponenter: strategy, process governance, process architecture, performance management, people and culture, organization design, technology.", chapter: "kap6" },
  { term: "Top-down", definition: "BPM som drivs av ledningen med strategisk linjering, mandat och styrning; för strategiska och tvärfunktionella förändringar.", chapter: "kap3" },
  { term: "Trigger", definition: "En händelse som organisationen måste svara på, ofta utifrån (ny lag, en leverantör i konkurs). Den syns ofta i förväg.", chapter: "kap3" },
  { term: "Under the radar", definition: "Jestons första scenario: små informella BPM-insatser med begränsat stöd från ledningen.", chapter: "kap3" },
  { term: "AND-gateway (parallel)", definition: "Plustecken i romb. Split startar alla utgående vägar, join väntar in alla inkommande. Etiketteras aldrig.", chapter: "kap10" },
  { term: "Black-box pool", definition: "Tom pool som representerar en extern deltagare, till exempel kunden. Kommunicerar med processen via message flow.", chapter: "kap10" },
  { term: "Boundary event", definition: "Händelse på kanten av en aktivitet, utan inkommande flöden. Interrupting (heldragen) avbryter aktiviteten, non-interrupting (streckad) låter den fortsätta.", chapter: "kap11" },
  { term: "BPMN", definition: "Business Process Model and Notation: OMG:s leverantörsoberoende standard för att beskriva processer med definierad start och slut som körs på instanser. Uppstod 2002 inom BPMI.org. BPMN 2.0 (2011) gav en standardiserad XML och blev ISO-standard 2013 (ISO/IEC 19510).", chapter: "kap10" },
  { term: "Business case", definition: "Beskrivningen av BPM-aktivitetens nytta och kostnad: på vanligt språk, gärna på en sida, med evidens. Grunden för genomförandet i senare faser.", chapter: "kap7" },
  { term: "Business rule task", definition: "Aktivitet med tabellikon som anropar en beslutsregel, till exempel en DMN-beslutstabell. Exempel: Determine discount räknar ut fakturans rabatt efter ordersumma och kundtyp, i stället för en kedja av XOR-gateways i flödet.", chapter: "kap10" },
  { term: "Call activity", definition: "Aktivitet med tjock ram som anropar en fristående, återanvändbar process.", chapter: "kap10" },
  { term: "Catching event", definition: "Händelse där processen väntar på en signal utifrån (ofylld ikon).", chapter: "kap11" },
  { term: "Data store", definition: "Information i en applikation, databas eller fil som processen och externa parter läser och skriver via data associations.", chapter: "kap10" },
  { term: "Deadlock", definition: "När en join väntar på en väg som aldrig aktiveras. Löses med OR-join eller terminate end.", chapter: "kap11" },
  { term: "DMN", definition: "Decision Model and Notation: OMG:s standard för beslut, med beslutstabeller, DRD och uttrycksspråket FEEL. Ingår i BPM+ men är inte en ISO-standard. Klarar logik ungefär lika komplex som i ett kalkylark; bortom det blir DMN beslutslagret som anropar externa tjänster eller AI-modeller.", chapter: "kap10" },
  { term: "Error end event", definition: "Sluthändelse med blixt som kastar ett fel till ett error boundary event på subprocessen i föräldern.", chapter: "kap11" },
  { term: "Event subprocess", definition: "Subprocess med streckad ram, triggad start och inga inkommande flöden. Kan starta när som helst medan processen körs; heldragen startcirkel avbryter föräldern, streckad gör det inte.", chapter: "kap11" },
  { term: "Event-based gateway", definition: "Gateway följd av catching events; bara vägen vars händelse inträffar först aktiveras.", chapter: "kap11" },
  { term: "Handover och takeover", definition: "Överlämningen från BPM-teamet (handover) och verksamhetens övertagande (takeover) av de nya processerna. Planen görs i Launch (kostnader, risker, tidpunkt, reservplaner, styrning), genomförs i Implement när ägarskapet går till linjen och utvärderas i Sustainability.", chapter: "kap7" },
  { term: "Innovate", definition: "Fas 5 i 7FE: de framtida processerna designas. Outputen är design av to-be-processer och validerade lösningsförslag, med kvantifierade nyttor och detaljerade affärskrav till Develop.", chapter: "kap8" },
  { term: "Lane", definition: "Del av en pool som visar vem som utför aktiviteterna: en roll eller organisatorisk enhet.", chapter: "kap10" },
  { term: "Large Process Model (LPM)", definition: "En LLM som finjusterats och kompletterats med processkunskap och prestationsdata: en samlad, datadriven kunskapsbas som kan ge automatiserade rekommendationer för processförbättring (Kampik et al. 2025, SAP Signavio).", chapter: "kap9" },
  { term: "Launch", definition: "Fas 3 i 7FE: den formella starten av en BPM-aktivitet med scope, intressenter, processmål, processval, business case och team.", chapter: "kap7" },
  { term: "Message flow", definition: "Streckad pil mellan pooler som visar envägskommunikation; namnges med ett substantiv. Aldrig inom samma pool.", chapter: "kap10" },
  { term: "OR-gateway (inclusive)", definition: "Ring i romb. En eller flera vägar aktiveras efter villkoren; som join väntar den bara på de vägar som faktiskt aktiverats.", chapter: "kap10" },
  { term: "Default flow", definition: "Utgående flöde från en gateway, märkt med ett snedstreck i början, som tas bara när inget annat villkor är sant (Silvers insättningsexempel: Log standard deposit).", chapter: "kap10" },
  { term: "People change management", definition: "En av 7FE:s essentials: att medarbetarna både kan (genom utbildning) och vill (genom motivation och engagemang) arbeta på det nya sättet. Enligt Jeston bör minst 60 procent av BPM-arbetet gå till människor och kommunikation.", chapter: "kap8" },
  { term: "Pool", definition: "Behållare för en process, etiketterad med processens namn.", chapter: "kap10" },
  { term: "Process selection matrix (PSM)", definition: "Launch-fasens verktyg som visar en affärsenhets processer mot scenarier som produkter, geografi och kanaler, för att se komplexitet, kopplingar och dubbelarbete. I prioriteringen kan Process Worth Matrix (Understand steg 8) användas, och i Understand kombineras PSM med FMEA-poängen i heat maps. Bakgrund: kursen går inte in på metoden.", chapter: "kap7" },
  { term: "Processautonomisering", definition: "Rosemann et al.: när processen själv fattar beslut utifrån mål och begränsningar; nästa steg efter automatisering.", chapter: "kap9" },
  { term: "Realize", definition: "Fas 9 i 7FE: ser till att nyttorna i business case uppnås och består efter införandet, genom en strukturerad nyttostyrning (benefits management). Flyttar fokus från leverans till värdeskapande; nyttorealiseringen är en tråd genom alla faser.", chapter: "kap8" },
  { term: "Sequence flow", definition: "Heldragen pil som visar ordningen mellan aktiviteter, händelser och gateways inom en process.", chapter: "kap10" },
  { term: "Service task", definition: "Automatiserad aktivitet utan mänsklig interaktion (kugghjul).", chapter: "kap10" },
  { term: "SMART", definition: "Krav på processmål: specifika, mätbara, uppnåeliga, realistiska och tidsbundna.", chapter: "kap7" },
  { term: "Subprocess", definition: "Aktivitet som själv består av aktiviteter; kollapsad med plustecken och ett barndiagram med otriggad start.", chapter: "kap10" },
  { term: "Sustainability (7FE)", definition: "Fas 10 i 7FE: uthållig konkurrensfördel. Resultatet går över från projektet till business as usual, och förbättringarna underhålls och förbättras kontinuerligt. Fasen tar aldrig slut. Inte miljömässig hållbarhet.", chapter: "kap8" },
  { term: "Terminate end event", definition: "Sluthändelse med tjock cirkel och fylld inre skiva som avslutar hela processnivån direkt, även parallella vägar. Löser deadlock när ett undantag i ett parallellt block har ett eget slut.", chapter: "kap11" },
  { term: "Three drifts", definition: "Rosemann et al. (2024): från transaktion till konversation, från automatisering till autonomisering, från förenkling till sofistikering.", chapter: "kap9" },
  { term: "Throwing event", definition: "Händelse där processen skickar en signal direkt och går vidare (fylld ikon).", chapter: "kap11" },
  { term: "Timer event", definition: "Klocka. Som start: återkommande tidpunkt. Som intermediate: vänta en varaktighet eller tills en tidpunkt.", chapter: "kap11" },
  { term: "Token", definition: "Tankemodellen för att köra ett diagram: en markör som vandrar längs sekvensflödena.", chapter: "kap11" },
  { term: "Understand", definition: "Fas 4 i 7FE, den första i Findings & solutions: tar reda på hur processerna faktiskt fungerar i dag. Modelleringens huvudsyfte är en gemensam, faktabaserad bild av nuläget. Outputen är as-is-modeller, baseline, rotorsaker, quick wins och Understand Phase Report.", chapter: "kap7" },
  { term: "User task", definition: "Aktivitet som utförs av en människa, även om systemet gör resten efter ett klick.", chapter: "kap10" },
  { term: "XOR-gateway (exclusive)", definition: "Tom romb. Exakt en väg följs; gatewayen testar ett datavillkor, beslutet är redan fattat.", chapter: "kap10" },
  { term: "Process Worth Matrix", definition: "Understand-fasens verktyg (steg 8) som kategoriserar processerna efter strategisk betydelse (salience: Identity, Priority, Background, Mandated) och ekonomiskt värde (worth: asset som tillför värde eller liability som förstör värde). Hjälper organisationen att avgöra vilka processer den ska investera i, förbättra, outsourca eller avveckla. Kan också användas för att prioritera i Launch-fasens processval.", chapter: "kap7" },
  { term: "Failure Mode and Effects Analysis (FMEA)", definition: "Formaliserat sätt att strukturera rotorsaksanalysen i Understand: möjliga fel, orsaker och effekter poängsätts efter hur allvarliga de är, hur ofta de inträffar och hur lätt de upptäcks, och poängen bildar en heat map över processens kritiska svagheter. Hur metoden görs i detalj är bakgrund.", chapter: "kap7" },
  { term: "Rotorsaksanalys", definition: "Understand-fasens steg 5: att ta fram de verkliga orsakerna till processens problem, inte bara de synliga symptomen. Utan den riskerar redesignen i Innovate att upprepa eller dölja samma problem.", chapter: "kap7" },
  { term: "Baseline", definition: "Mätningen av hur processerna presterar i dag, som tas fram i Understand och som de omdesignade processerna och nyttorna jämförs med.", chapter: "kap7" },
  { term: "Voice of Customer (VoC)", definition: "Kundens röst i Understand-fasens mätning, genom enkäter, intervjuer eller fokusgrupper, så att prioriteringarna följer kundens behov.", chapter: "kap7" },
  { term: "SLA (service level agreement)", definition: "En överenskommen servicenivå med en leverantör eller en intern avdelning. I Understand mäts om den uppfylls.", chapter: "kap7" },
  { term: "People Capability Matrix", definition: "Matris i Understand (steg 6) som ställer processerna mot de kompetenser de kräver, i dag och framför allt i framtiden, och graderar varje kompetens som obligatorisk, rekommenderad eller önskvärd. Visar kompetensglappen; uppdateras i Innovate och blir en plan för utbildning, coachning eller rekrytering i People.", chapter: "kap7" },
  { term: "Tyst kunskap (tacit knowledge)", definition: "Människors erfarenhet och kunnande som inte är formellt dokumenterat. Går förlorad när en nyckelmedarbetare försvinner och kan bli en maktfaktor; Understand ska därför öka den explicita kunskapen om processerna.", chapter: "kap7" },
  { term: "Explicit kunskap", definition: "Dokumenterad information om processerna, som utbildningsmaterial, rutinbeskrivningar, systemmanualer och affärsregler, och leveranserna från projektets tidigare faser.", chapter: "kap7" },
  { term: "Processbeslut (Understand)", definition: "De åtta beslut som Understand (steg 9) kan fatta om en process: leave as is, improve, amalgamate, redesign, innovate radically, outsource, insource och eliminate. Avgör vilka processer som går vidare till Innovate. Inte samma sak som optimeringslösningarna, som väljs i Innovate.", chapter: "kap7" },
  { term: "Shared services", definition: "Processoptimeringslösning där en process som finns på flera ställen i företaget görs till en gemensam tjänst som alla använder, i stället för att dubbleras. Medelrisk i riskjämförelsen.", chapter: "kap4" },
  { term: "Outsourcing", definition: "Både ett processbeslut i Understand, där processen flyttas till en extern leverantör, och en optimeringslösning i Innovate, där den läggs ut på en tredje part, i dag ofta en SaaS-leverantör. Har högst risk av lösningarna, särskilt för processer som hör till kärnkompetensen.", chapter: "kap4" },
  { term: "People (7FE)", definition: "Fas 6 i 7FE: bestämmer hur människor ska utföra de nya processerna genom rolldesign, organisationsstruktur och prestationsmått. Ger rollbeskrivningar, KPI:er för roller och team, utbildningsplan och uppdaterade HR-policyer. Löper parallellt med Develop.", chapter: "kap8" },
  { term: "RACI", definition: "Modellen som People-fasen (steg 3) använder för att definiera generiska roller och ansvar, när uppgifterna i de omdesignade processerna grupperas till aktiviteter och roller.", chapter: "kap8" },
  { term: "Develop", definition: "Fas 7 i 7FE: översätter to-be-processerna och affärskraven till fungerande lösningar och testar teknikkomponenterna. BPM-framgång kräver inte teknik, men när automatisering ingår byggs den här.", chapter: "kap8" },
  { term: "Implement", definition: "Fas 8 i 7FE: processförbättringarna, organisationsförändringarna och systemlösningarna tas i drift efter tester och piloter, med planer för rollout och back-out. Markerar starten på nyttorealiseringen.", chapter: "kap8" },
  { term: "User acceptance test (UAT)", definition: "Användartestet i Implement (steg 4): testfallen färdigställs och slutanvändarna prövar att lösningen fungerar och passar, före affärstester, piloter och full utrullning.", chapter: "kap8" },
  { term: "Benefits register", definition: "Nyttoregistret som skapas i Launch: varje möjlig nytta med beskrivning, ägare, värde, måldatum, beroenden, risker och koppling till de strategiska målen. Följs upp i Realize.", chapter: "kap8" },
  { term: "BPM project management", definition: "En av 7FE:s essentials: effektiv användning av resurser, tid och budget, och hantering av intressenter och leveranser. Kräver utöver vanlig projektledning people change management, stakeholder management och BPM-expertis.", chapter: "kap8" },
  { term: "Leadership (7FE)", definition: "En av 7FE:s essentials: vision, förtroende och linjering med strategin, på alla nivåer i organisationen, genom att ge medarbetarna egenmakt i stället för att kontrollera dem.", chapter: "kap8" },
  { term: "Appreciative inquiry", definition: "En framåtblickande, deltagande modell som hjälper organisationer att skapa förändring i stället för att bara reagera på den. Tas upp under people change management.", chapter: "kap8" },
  { term: "Event log (händelselogg)", definition: "Den logg av händelser som informationssystemen sparar om nästan allt som händer i en digitaliserad verksamhet. Underlaget för process mining.", chapter: "kap9" },
  { term: "Process discovery", definition: "Process minings första förmåga: att rekonstruera en processmodell automatiskt ur systemens händelseloggar.", chapter: "kap9" },
  { term: "Conformance checking", definition: "Process minings andra förmåga: att jämföra den upptäckta processen med den avsedda BPMN-modellen. Följer medarbetarna processen, var uppstår avvikelserna och bryts compliance-reglerna?", chapter: "kap9" },
  { term: "Process improvement (process mining)", definition: "Process minings tredje förmåga: att använda händelsedatan för att hitta och göra om det som drar ned processen, som flaskhalsar, onödig väntan, omarbete och processvarianter.", chapter: "kap9" },
  { term: "Agentisk AI", definition: "AI, typiskt en språkmodell, som fått verktyg som webbsökning, kalkylator, kod eller organisationens system och själv avgör hur ett mål ska nås, ibland genom att starta egna underagenter. Kan vara aktör i en process; till skillnad från RPA följer den inga fasta vägar.", chapter: "kap9" },
  { term: "Affordances", definition: "Informatikens begrepp för de möjligheter ett informationssystem ger men som inte alltid tas till vara. Generativ och agentisk AI ger många nya, och Rosemanns tredje drift bygger på dem.", chapter: "kap9" },
  { term: "BPM+", definition: "OMG:s familj av standarder: BPMN för processer, CMMN för ärenden (cases) och DMN för beslut.", chapter: "kap10" },
  { term: "CMMN", definition: "Case Management Model and Notation: OMG-standard för ärenden, ett alternativ för ostrukturerade processer där BPMN passar sämre. Inte särskilt utbredd.", chapter: "kap10" },
  { term: "Method and Style", definition: "Silvers riktlinjer för att använda BPMN: method är ett systematiskt sätt att bygga konsekventa modeller, style är konventioner som gör diagrammen tydliga, fullständiga och entydiga. Ett diagram kan vara giltig BPMN utan att vara en bra modell; med Method and Style går processlogiken att läsa direkt ur diagrammet.", chapter: "kap10" },
  { term: "Modellspråkets fyra komponenter", definition: "Enligt Dumas et al. (2018): vocabulary (elementen, som händelser, aktiviteter, gateways och sekvensflöden), syntax (vilka element som får kopplas och hur), semantics (vilket beteende elementen och kopplingarna står för) och notation (symbolerna). Ett BPMN-diagram ska stämma på alla fyra.", chapter: "kap10" },
  { term: "White-box pool", definition: "Pool där processen syns, med händelser, aktiviteter och gateways; motsatsen till en black-box pool. I Silvers exempel heter den Application Assessment Process och avgränsar processens omfång.", chapter: "kap10" },
  { term: "Visuell och körbar BPMN", definition: "Två syften med samma notation. Visuell BPMN används av analytiker, chefer och verksamhet för dokumentation, kommunikation och förbättring, utan tekniska detaljer. Körbar BPMN körs av en processmotor (Camunda, IBM BAW, Appian) och kräver tjänster, datamappningar och felhantering under diagrammet.", chapter: "kap10" },
  { term: "Task automation och process orchestration", definition: "Två nivåer av automatisering. RPA automatiserar arbetet inne i en user task, där en människa annars klickar mellan skärmar (task automation). En processmotor orkestrerar hela flödet från början till slut (process orchestration). Gränsen är enligt Weaver inte skarp; Power Automate har också RPA-funktioner.", chapter: "kap10" },
  { term: "BPMN XML", definition: "Det maskinläsbara formatet för BPMN, standardiserat med BPMN 2.0 (2011). Rymmer diagrammet och dess execution properties och är det en processmotor läser för att köra processen. Ett av flera sätt att köra automatiserade arbetsflöden.", chapter: "kap10" },
  { term: "Execution properties", definition: "De tekniska inställningar som gör ett BPMN-diagram körbart, till exempel REST endpoint, Java-klass, SQL-fråga, variabelmappningar, säkerhetsroller och retry. Lagras i BPMN XML och ställs oftast in i modelleringsverktygets egenskapspanel. Diagrammet visar vad som händer, egenskaperna hur.", chapter: "kap10" },
  { term: "Business activity monitoring (BAM)", definition: "Uppföljning av de nyckeltal (KPI) som processmotorn ger när processerna körs. Resultatet återkopplas till processmodellen.", chapter: "kap10" },
  { term: "DRD (Decision Requirements Diagram)", definition: "DMN:s diagram över hur beslut hänger ihop. Exempel: toppbeslutet Total discount bygger på de stödjande besluten Base discount och Additional discount, som i sin tur bygger på indata (Order value och Customer type) via information requirements.", chapter: "kap10" },
  { term: "Beslutstabell", definition: "DMN:s sätt att skriva beslutsregler: varje rad är en regel som ger ett utfall (Then) när villkoren på indata (When) är uppfyllda. Exempel: tabellen Base discount ger 0–4 procent efter ordervärdet, och Additional discount ger 1 procent för kundtyp A och 0 för Ordinary.", chapter: "kap10" },
  { term: "FEEL", definition: "DMN:s uttrycksspråk. Exempel: toppbeslutet Total discount räknas ut med if baseDiscount = 0 then 0 else baseDiscount + additionalDiscount, så en order utan grundrabatt får ingen rabatt alls. Kursen kräver inte att man kan skriva FEEL (Weaver, F5).", chapter: "kap10" },
  { term: "Directly-follows graph (DFG)", definition: "Process minings typiska resultat: en graf över vilka aktiviteter som följer direkt på varandra i händelseloggen. Den är inte BPMN, men en BPMN-modell kan skapas ur resultatet. Exempel: när ost, tomat och salami läggs på en pizza i valfri ordning går pilar åt båda hållen mellan de tre aktiviteterna i grafen, medan BPMN-modellen lägger dem mellan en AND-split och en AND-join.", chapter: "kap9" },
  { term: "GDPR art. 15", definition: "Rätten till tillgång till sina personuppgifter. Den omfattar bland annat rätten att få veta om automatiserat beslutsfattande, inklusive profilering, förekommer och i så fall få meningsfull information om logiken bakom samt om betydelsen och de förutsedda följderna för den registrerade.", chapter: "kap9" },
  { term: "GDPR art. 22", definition: "Rätten att inte bli föremål för ett beslut som enbart grundas på automatiserad behandling, inklusive profilering, om beslutet har rättslig verkan eller på liknande sätt påverkar personen i betydande grad. Undantag: avtal, lag med skyddsåtgärder och uttryckligt samtycke. Vid avtal och samtycke har personen åtminstone rätt till mänskligt ingripande, att framföra sin synpunkt och att bestrida beslutet.", chapter: "kap9" },
  { term: "AI-förordningen art. 86", definition: "Rätten till förklaring av enskilda beslut i EU:s AI-förordning: den som berörs av ett beslut som tillhandahållaren fattat på grundval av utdata från ett högrisk-AI-system, med rättslig eller liknande betydande verkan som personen anser påverkar hälsa, säkerhet eller grundläggande rättigheter negativt, har rätt att av tillhandahållaren få tydliga och meningsfulla förklaringar av AI-systemets roll i beslutet och beslutets viktigaste delar. Hör till förordningens subject transparency, transparensen mot den berörda personen. Gäller från 2 augusti 2026.", chapter: "kap9" },
  { term: "AI-förordningens riskpyramid", definition: "Fyra risknivåer: oacceptabel risk är förbjuden (social poängsättning, manipulation), hög risk kräver bedömning av överensstämmelse (kritisk infrastruktur, anställning, sjukvård, brottsbekämpning), begränsad risk kräver transparens (chattbotar, deepfakes) och minimal risk en uppförandekod (spamfilter, datorspel).", chapter: "kap9" },
  { term: "Automatiserat beslutsfattande (ADM)", definition: "Automated decision-making: beslut som fattas helt eller delvis automatiskt, med regler, RPA eller AI. Omfattas av GDPR art. 15 och 22 och, för högrisk-AI, av AI-förordningen. I offentlig sektor ett kritiskt forskningsfält med höga transparenskrav, bland annat för sociala system, bank och kredit, rättsväsende och sjukvård.", chapter: "kap9" },
  { term: "Trelleborgsfallet", definition: "Kursens exempel på bristande transparens: Trelleborgs kommun lät en RPA-robot fatta beslut om försörjningsstöd. Akademikerförbundet SSR åberopade rätten till meningsfull information om logiken bakom, samma rätt som i GDPR art. 15, men kommunen slutade svara, och en journalist som begärde ut källkoden fick nej. Kommunen kallade roboten regelstyrd RPA och ingen black box. Källkoden lämnades ut först efter en dom i kammarrätten: 136 000 rader regler i 127 XML-filer som inte gick att tolka säkert utan datan.", chapter: "kap9" },
];
