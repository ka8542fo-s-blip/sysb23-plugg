// Frågebanken för Processorienterad verksamhetsutveckling (BPM).
//
// Designreglerna är Strategis (se strategi/questions.js): fyra jämnlånga
// alternativ, rimliga distraktorer, distraktorer från andra modeller och
// faser (Weavers eget mönster), rätt position fördelad, explain per
// alternativ. Frågorna är scenariobaserade som på HT25-tentan.
//
// HT25-tentornas egna flervalsfrågor ligger nära ordagrant (source "Tenta
// HT25 …"). De är inte längdbalanserade — på tentan är rätt svar ofta
// längst — och står därför i LENGTH_FLAGGED och räknas inte in i
// balansmåtten. HT24-frågor är omskrivna till fyrval; frågor med fasnamn
// som inte finns i 7FE används inte. Alla frågor är ogranskade.

const VERBATIM = "Tentafråga ordagrant (HT25); alternativen är tentans egna och inte längdbalanserade.";

export const LENGTH_FLAGGED = [
  "bpm-t01", "bpm-t02", "bpm-t03", "bpm-t04", "bpm-t05", "bpm-t06", "bpm-t07",
  "bpm-t08", "bpm-t09", "bpm-t10", "bpm-t11", "bpm-t12", "bpm-t13", "bpm-t14",
  "bpm-t15", "bpm-t16", "bpm-t17", "bpm-t18", "bpm-t19", "bpm-t20", "bpm-t21",
  "bpm-t22",
].map((id) => ({ id, reason: VERBATIM })).concat([
  { id: "bpm-q25", reason: "Alternativen är Jestons fyra rollnamn och kan inte längdbalanseras; rätt svar är kortast, inte längst." },
]);

export const questions = [
  // ── Kapitel 1: vad BPM är ─────────────────────────────────────────────
  { id: "bpm-t01", topic: "grunder", difficulty: 2,
    question: "Hur förhåller sig Business Process Management (BPM) till Enterprise Architecture (EA)?",
    options: [
      { text: "BPM och EA är oberoende av varandra; BPM handlar om dagliga processer medan EA enbart fokuserar på IT-system", explain: "EA omfattar strategi, processer och förmågor, inte bara IT, och BPM är ett lager i EA." },
      { text: "EA och BPM är olika namn för i stort sett samma angreppssätt", explain: "De har gemensamma mål men olika roller: ritningen respektive det operativa lagret." },
      { text: "BPM är det strategiska ramverket som styr hur enterprise-arkitekturen ska utformas", explain: "Omvänt: EA är den övergripande ritningen, BPM arbetar i det operativa lagret." },
      { text: "EA utgör den övergripande visionen för hur strategin ska realiseras, medan BPM fungerar som ett operativt lager som kopplar samman strategi, verksamhet och IT", explain: "EA är ritningen, BPM länkar strategin till IT-arkitekturen via processerna." }
    ],
    correct: 3, source: "Tenta HT25 ord 2(a)", reviewed: false },

  { id: "bpm-q01", topic: "grunder", difficulty: 1,
    question: "En leverantör säljer in sin programvara som \"en komplett BPM-lösning\". Vad skulle Jeston invända?",
    options: [
      { text: "BPM är implementering, exekvering och styrning av processer, inte en mjukvarusvit.", explain: "Jestons definition utesluter uttryckligen att BPM är en teknik eller mjukvara." },
      { text: "BPM är en modelleringsmetod, så programvaran bör bara användas för att rita processer.", explain: "BPM är inte bara modellering; implementering och exekvering väger lika tungt." },
      { text: "BPM kräver alltid en egenutvecklad plattform som anpassas efter varje organisation.", explain: "Jeston säger att framgång inte hänger på en viss teknik, egenutvecklad eller köpt." },
      { text: "BPM kan bara införas med externa konsulter, oavsett vilken programvara som köps.", explain: "Behovet av konsulter beror på organisationens kompetens och mognad." }
    ],
    correct: 0, source: "F1 (Jestons definition, demystifiering)", reviewed: false },

  { id: "bpm-q02", topic: "grunder", difficulty: 2,
    question: "I vilket steg av BPM lifecycle identifieras gapet mellan hur processen fungerar i dag och målbilden?",
    options: [
      { text: "Process discovery, där nuläget kartläggs.", explain: "Discovery tar fram as-is-modellen, men analysen av gapet kommer efter." },
      { text: "Process analysis, där bristerna mot målbilden analyseras.", explain: "Analysen jämför nuläget med vad processen borde åstadkomma." },
      { text: "Process redesign, där den nya processen formas.", explain: "Redesign bygger på analysen och tar fram to-be-processen." },
      { text: "Process monitoring, där processen följs upp löpande.", explain: "Monitoring följer upp den införda processen och startar nästa varv." }
    ],
    correct: 1, source: "F1 (lifecycle), HT24 fråga 28", reviewed: false },

  { id: "bpm-q03", topic: "grunder", difficulty: 2,
    question: "En ledningsgrupp säger: \"BPM är enkelt, vi gör allt på en gång i hela koncernen.\" Vad säger Jestons verklighetskontroll?",
    options: [
      { text: "BPM är moget och välbeprövat, så ett snabbt och koncernbrett införande är det allra säkraste.", explain: "Mognaden hjälper inte utan ledningens och medarbetarnas stöd, och Jeston avråder från allt på en gång." },
      { text: "BPM är enkelt om man köper rätt programvara och låter den styra processdesignen.", explain: "Framgång hänger inte på en viss produkt, och tekniken ska inte diktera designen." },
      { text: "BPM är komplext, och det är bättre att börja smått och bygga ut än att satsa allt direkt.", explain: "Jeston: \"BPM is simple\" stämmer inte; börja smått och expandera." },
      { text: "BPM är enkelt om man utvecklar en egen metod som passar koncernens kultur.", explain: "Jeston avråder uttryckligen från att hitta på en egen BPM-metod." }
    ],
    correct: 2, source: "F1 (demystifieringstabellen)", reviewed: false },

  { id: "bpm-q04", topic: "grunder", difficulty: 1,
    question: "Vad är det primära syftet med BPM?",
    options: [
      { text: "Att sänka kostnaden i samtliga processer i hela organisationen.", explain: "Kostnad kan vara ett mål, men BPM:s syfte är bredare än kostnadssänkning." },
      { text: "Att ersätta föråldrad teknik med moderna processmotorer.", explain: "Tekniken är ett medel; BPM är inte ett teknikbyte." },
      { text: "Att öka medarbetarnas nöjdhet genom färre arbetsmoment.", explain: "Medarbetarna är viktiga, men nöjdhet är inte BPM:s primära syfte." },
      { text: "Att linjera verksamhetens processer med strategin och målen.", explain: "BPM förbättrar och styr processerna så att organisationen når sina mål." }
    ],
    correct: 3, source: "HT24 fråga 9, F1", reviewed: false },

  // ── Kapitel 2: historia ───────────────────────────────────────────────
  { id: "bpm-t02", topic: "historia", difficulty: 1,
    question: "Varför anses Business Process Reengineering (BPR) inte ha lyckats med det som metoden lovade?",
    options: [
      { text: "För att BPR saknade tydlig koppling till IT och teknik", explain: "Tvärtom stod IT i centrum för BPR." },
      { text: "För att BPR sällan användes i större organisationer utan mest i små företag", explain: "BPR var en storföretagstrend med stora, dyra projekt." },
      { text: "För att BPR-projekt ofta blev för radikala, kostsamma och mötte starkt motstånd från medarbetare", explain: "Radikalt top-down, dyrt, riskfyllt och utan hänsyn till medarbetarnas acceptans." },
      { text: "För att BPR enbart fokuserade på personalens engagemang och ignorerade effektivitet", explain: "BPR användes snarare som ursäkt för nedskärningar än för att engagera personalen." }
    ],
    correct: 2, source: "Tenta HT25 ord 2(b)", reviewed: false },

  { id: "bpm-t03", topic: "historia", difficulty: 2,
    question: "Vilken teknisk begränsning gjorde att många initiala RPA-case inte skalade?",
    options: [
      { text: "RPA kunde endast köras via molnlösningar vilket begränsade många applikationer.", explain: "RPA är inte bundet till molnet." },
      { text: "RPA kräver omfattande kodning av experter, vilket är en trång resurs i de flesta organisationer.", explain: "RPA-verktygen är low-code och byggda för att icke-tekniker ska kunna konfigurera botar." },
      { text: "RPA saknade integrationer till moderna API:er.", explain: "Poängen är att RPA går via gränssnittet i stället för via integrationer — inte att API:er saknades." },
      { text: "RPA arbetar via UI-interaktioner, inte robusta systemintegrationer, vilket begränsar stabilitet och skalbarhet.", explain: "Roboten härmar användarens klick i UI:t och går sönder när gränssnitten ändras." }
    ],
    correct: 3, source: "Tenta HT25 omtenta 8", reviewed: false },

  { id: "bpm-q05", topic: "historia", difficulty: 1,
    question: "Vilket angreppssätt förbättrar processer stegvis snarare än genom radikal omdesign?",
    options: [
      { text: "Continuous process improvement (CPI).", explain: "CPI förbättrar inkrementellt och löpande." },
      { text: "Business process reengineering (BPR).", explain: "BPR är det radikala alternativet: riv upp och gör om." },
      { text: "Robotic process automation (RPA).", explain: "RPA automatiserar befintliga steg; det är ingen förbättringsfilosofi." },
      { text: "Service-oriented architecture (SOA).", explain: "SOA är en teknisk arkitektur för återanvändbara tjänster." }
    ],
    correct: 0, source: "HT24 fråga 10, F1", reviewed: false },

  { id: "bpm-q06", topic: "historia", difficulty: 1,
    question: "En fabrik vill få bort väntan, överlager och onödiga transporter i sin produktion. Vilken tradition passar bäst?",
    options: [
      { text: "Six Sigma, med statistisk kontroll av fel per miljon möjligheter.", explain: "Six Sigma fokuserar på fel och variation, inte i första hand slöseri." },
      { text: "Lean, med fokus på att eliminera slöseri i flödet.", explain: "Lean handlar om att ta bort slöseri och förbättra flödet." },
      { text: "Reengineering, med radikal omdesign av hela processen.", explain: "BPR gör om allt från grunden; här gäller det att ta bort slöseri." },
      { text: "Taylorism, med uppdelning av arbetet i minsta möjliga moment.", explain: "Taylor delar upp arbetet men är inte traditionen för att eliminera slöseri." }
    ],
    correct: 1, source: "F1, HT24 fråga 13", reviewed: false },

  { id: "bpm-q07", topic: "historia", difficulty: 2,
    question: "Vad drev enligt Weaver fram ett brett införande av BPM och processdokumentation efter 2002?",
    options: [
      { text: "RPA-vågen, som gjorde att botar kunde dokumentera processerna automatiskt.", explain: "RPA var huvudspåret 2015–2022, långt senare." },
      { text: "Produktivitetsparadoxen, som visade att IT-investeringarna i processerna alltid gav mycket hög avkastning.", explain: "Paradoxen visade tvärtom att IT inte syntes i produktiviteten, och den gällde 70- och 80-talen." },
      { text: "Sarbanes-Oxley, som krävde spårbar intern kontroll av processerna kring finansiell rapportering.", explain: "SOX efter Enron krävde revisionsbar dokumentation; BPM gav metoder, verktyg och notation." },
      { text: "Agentisk AI, som tvingade fram en formell modell av alla affärsprocesser.", explain: "Agentisk AI är dagens trend, inte en drivkraft kring 2002." }
    ],
    correct: 2, source: "F1 (Enron, SOX)", reviewed: false },

  { id: "bpm-q08", topic: "historia", difficulty: 2,
    question: "Hammer (1990) beskriver hur Ford gjorde om sin leverantörsreskontra. Vilken princip illustrerar exemplet bäst?",
    options: [
      { text: "Automatisera den befintliga avstämningen så att fakturorna matchas snabbare.", explain: "Just det Hammer vänder sig emot: att automatisera det gamla arbetssättet." },
      { text: "Lägg ut avstämningen på en extern partner som kan göra den billigare.", explain: "Outsourcing var inte Fords lösning i Hammers exempel." },
      { text: "Förbättra processen stegvis med löpande statistisk uppföljning av felen i avstämningen.", explain: "Det är kvalitetsrörelsens sätt; Hammer förespråkar radikal omdesign." },
      { text: "Bryt det outtalade antagandet: betala när varorna kommer, inte när fakturan kommer.", explain: "Ford bröt regeln att fakturan styr betalningen och fick 75 % färre anställda i funktionen." }
    ],
    correct: 3, source: "Hammer (1990) s. 105–108", reviewed: false },

  // ── Kapitel 3: när och hur BPM startar ────────────────────────────────
  { id: "bpm-t04", topic: "start", difficulty: 2,
    question: "En avdelning inom en större organisation vill förbättra sina processer, men högsta ledningen är inte engagerad och strategin är oklar. Vad rekommenderar Jeston?",
    options: [
      { text: "Fokusera på att outsourca problematiska processer", explain: "Outsourcing löser inte bristen på stöd och är en optimeringslösning, inte en startstrategi." },
      { text: "Börja lokalt med små bottom-up-förbättringar för att skapa värde och bygga momentum", explain: "Utan ledningsstöd: börja smått, bygg quick wins och momentum." },
      { text: "Avvakta tills den övergripande strategin är uppdaterad", explain: "Att vänta skapar inget värde; lokala förbättringar kan starta ändå." },
      { text: "Starta ett transformationsprogram med ett “top-down” angreppssätt", explain: "Utan ledningens stöd ska stora program enligt Jeston inte startas alls." }
    ],
    correct: 1, source: "Tenta HT25 ord 2(g)", reviewed: false },

  { id: "bpm-t05", topic: "start", difficulty: 1,
    question: "Vilket av följande är ett typiskt kännetecken för en quick win i samband med BPM-arbete, enligt Jeston?",
    options: [
      { text: "Den kräver ofta extern konsultkompetens och omfattande förstudier för att realiseras.", explain: "Motsatsen till en quick win." },
      { text: "Den har liten praktisk effekt men stor symbolisk betydelse.", explain: "En quick win ger en verklig, omedelbar förbättring." },
      { text: "Den kan genomföras snabbt, utan stora kostnader, och ger omedelbara förbättringar i en verksamhetsprocess.", explain: "Snabbt, billigt och med omedelbar effekt — det bygger förtroende och momentum." },
      { text: "Den reducerar behovet av workshops och andra BPM-aktiviteter som tar lång tid.", explain: "Quick wins ersätter inte det strukturerade arbetet; de bygger förtroende för det." }
    ],
    correct: 2, source: "Tenta HT25 omtenta 7", reviewed: false },

  { id: "bpm-t06", topic: "start", difficulty: 2,
    question: "På HR-avdelningen har två processanalytiker själva börjat kartlägga sina processer. Cheferna vet om initiativet men har inte prioriterat det. BPM-aktiviteter sker sporadiskt utan budget eller formell styrning. Vilket av Jestons implementeringsscenarier motsvarar detta?",
    options: [
      { text: "Business as usual", explain: "Då är BPM fullt inbäddat, med styrning och budget." },
      { text: "Under the radar", explain: "Små informella insatser utan ledningens engagemang eller budget." },
      { text: "In the driver’s seat", explain: "Då är BPM erkänt som strategiskt verktyg med växande styrning." },
      { text: "Pilot project", explain: "En pilot är avgränsad och har ett uppdrag att bevisa värdet, med visst ledningsstöd." }
    ],
    correct: 1, source: "Tenta HT25 omtenta 9", reviewed: false },

  { id: "bpm-t07", topic: "start", difficulty: 2,
    question: "En myndighet måste anpassa sina processer till nya nationella regler som påverkar hela verksamheten. Förändringarna är strategiskt viktiga och tvärfunktionella. Enligt Jeston bör de:",
    options: [
      { text: "Skjuta upp projektet tills alla enheter har skapat egna interna planer.", explain: "Reglerna är en trigger som kräver handling nu." },
      { text: "Starta BPM med ett bottom-up-angrepssätt eftersom det engagerar flest personer.", explain: "Bottom-up riskerar att stanna lokalt; här krävs samordning över hela organisationen." },
      { text: "Lämna det upp till varje avdelning att lösa på eget sätt, genom ett decentraliserat angrepssätt.", explain: "Tvärfunktionella förändringar kan inte lösas avdelning för avdelning." },
      { text: "Driva BPM-arbetet top-down för att säkerställa styrning, mandat och samordning över hela organisationen.", explain: "Strategiskt och tvärfunktionellt kräver top-down." }
    ],
    correct: 3, source: "Tenta HT25 omtenta 10", reviewed: false },

  { id: "bpm-q09", topic: "start", difficulty: 2,
    question: "Vad skiljer en driver från en trigger enligt Jeston?",
    options: [
      { text: "En driver är ett långsiktigt affärsmotiv, en trigger en händelse som kräver handling nu.", explain: "Skillnaden är tidshorisonten: motiv mot akut händelse." },
      { text: "En driver är en extern faktor, en trigger ett internt initiativ från ledningen.", explain: "Båda kan vara interna eller externa; det är inte skiljelinjen." },
      { text: "En driver är ett operativt problem, en trigger ett strategiskt mål för organisationen.", explain: "Omvänt snarare: drivers är långsiktiga, triggers konkreta och akuta." },
      { text: "En driver är ett processmått, en trigger en milstolpe som visar att processen har lyckats.", explain: "Varken drivers eller triggers är mått eller milstolpar." }
    ],
    correct: 0, source: "F2 (Jeston s. 33), HT24 fråga 17", reviewed: false },

  { id: "bpm-q10", topic: "start", difficulty: 2,
    question: "Ett försäkringsbolag får många kundklagomål på skadehanteringen och startar ett förbättringsprojekt i skadeavdelningen. Vilken typ av initiering är det?",
    options: [
      { text: "Strategy-led, eftersom kundnöjdhet ingår i bolagets strategi.", explain: "Strategy-led följer av strategin och startar i Foundations och Enablement, top-down." },
      { text: "Business issue-led, eftersom det svarar på ett konkret verksamhetsproblem.", explain: "Taktiskt, lokalt och bottom-up, som svar på klagomålen." },
      { text: "Process-led, eftersom en processanalytiker har tagit initiativet.", explain: "Process-led startas oberoende av ett verksamhetsproblem, ofta för att visa värdet." },
      { text: "Pilot-led, eftersom projektet ska bevisa värdet av BPM.", explain: "Pilot är ett scenario, inte ett av de tre sätten att initiera." }
    ],
    correct: 1, source: "F2 (tre sätt att initiera), HT24 fråga 45", reviewed: false },

  { id: "bpm-q11", topic: "start", difficulty: 2,
    question: "En vd vill starta ett organisationsövergripande BPM-program, men resten av ledningsgruppen är ointresserad. Vad säger Jeston?",
    options: [
      { text: "Starta ändå, eftersom framgångsrika resultat senare övertygar ledningen.", explain: "Jeston: utan ledningens stöd spelar de andra faktorerna ingen roll." },
      { text: "Starta med extern konsult som ersätter ledningens stöd tills vidare.", explain: "Konsulter kan hjälpa men ersätter inte ledningens sponsorskap." },
      { text: "Stoppa programmet, eftersom ledningens stöd är den viktigaste faktorn.", explain: "För stora program utan ledningens stöd: stoppa helt enkelt." },
      { text: "Stoppa programmet tills en ny strategi är skriven och kommunicerad.", explain: "Problemet är stödet, inte strategidokumentet." }
    ],
    correct: 2, source: "F2 (Jeston s. 25, framgångsfaktorer)", reviewed: false },

  // ── Kapitel 4: improve before automate, perspektiv ────────────────────
  { id: "bpm-t08", topic: "perspektiv", difficulty: 1,
    question: "Ett team hanterar dagligen hundratals fakturarader genom att kopiera data från e-post till ett ERP-system. Stegen är alltid likadana och kräver inget omdöme. Vilken typ av processoptimisering borde vara lämplig, enligt Jeston.",
    options: [
      { text: "Agentic AI process orchestration", explain: "Agenter behövs när beslut ska fattas; här krävs inget omdöme." },
      { text: "RPA (Robotic Process Automation)", explain: "Regelstyrda, likadana steg i befintliga applikationer." },
      { text: "Redesign av processen med hjälp av BPM", explain: "Redesign behövs när själva flödet är problemet; här är det repetitivt manuellt arbete." },
      { text: "Outsourcing i kombination med en molnbaserad lösning", explain: "Flyttar arbetet men automatiserar det inte." }
    ],
    correct: 1, source: "Tenta HT25 ord 2(c)", reviewed: false },

  { id: "bpm-t09", topic: "perspektiv", difficulty: 1,
    question: "En organisation redesignar sin ärendehantering. Fokus ligger på att kunder ska få snabbare svar, färre hand-offs och en tydlig kontaktpunkt. Vilket perspektiv dominerar detta BPM-initiativ?",
    options: [
      { text: "Integration-centric BPM", explain: "Handlar om att koppla ihop system, inte om kundens upplevelse." },
      { text: "System-centric BPM", explain: "Utgår från systemen, inte från kunden." },
      { text: "Customer-centric BPM", explain: "Kundens upplevelse styr redesignen." },
      { text: "Employee-centric BPM", explain: "Utgår från medarbetarnas motivation och arbetsmiljö." }
    ],
    correct: 2, source: "Tenta HT25 ord 2(f)", reviewed: false },

  { id: "bpm-t10", topic: "perspektiv", difficulty: 2,
    question: "Vilka alternativ räknar Jeston som typiska processoptimeringslösningar som man kan välja mellan?",
    options: [
      { text: "Process redesign, outsourcing, shared services, RPA och cloud computing.", explain: "Jestons lista över lösningar att välja mellan när processen väl är förstådd." },
      { text: "Leadership, project management och och people change management.", explain: "Det är 7FE:s tre essentials." },
      { text: "Integration-centric BPM, human-centric BPM och customer-centric BPM.", explain: "Det är perspektiv på BPM, inte lösningar." },
      { text: "Activity-based costing (ABC), process modelling och workflow management.", explain: "Det är tekniker och BPMS-komponenter." }
    ],
    correct: 0, source: "Tenta HT25 omtenta 12", reviewed: false },

  { id: "bpm-q12", topic: "automatisera", difficulty: 2,
    question: "Ett bolag vill automatisera sin attestprocess, där fem nivåer attesterar och tre bara skickar vidare. Vad säger Jestons princip?",
    options: [
      { text: "Automatisera direkt, eftersom ett nytt system alltid gör hela processen snabbare.", explain: "Automatisering förstärker det som finns: de onödiga nivåerna körs då bara snabbare." },
      { text: "Behåll processen manuell, eftersom attester kräver mänskligt omdöme.", explain: "Principen säger i vilken ordning, inte att man ska avstå från automatisering." },
      { text: "Låt systemleverantören styra designen, eftersom tekniken bär lösningen.", explain: "Tekniken är en möjliggörare, inte en lösning, och ska inte diktera designen." },
      { text: "Förbättra processen först, eftersom automatisering förstärker ineffektiviteten.", explain: "Improve before automate: ta bort de onödiga nivåerna och automatisera sedan." }
    ],
    correct: 3, source: "F2 (improve before automate)", reviewed: false },

  { id: "bpm-q13", topic: "automatisera", difficulty: 2,
    question: "Ekonomiavdelningen stämmer av kundreskontran i ett tiotal kalkylark som skickas runt varje månad. Vad signalerar det enligt Jestons spreadsheet-test?",
    options: [
      { text: "Att processen behöver förbättras innan den automatiseras.", explain: "Kalkylark i kritiska steg är ett tecken på att processen behöver förbättras först." },
      { text: "Att processen fungerar, eftersom kalkylarken fångar felen innan bokslutet.", explain: "Kalkylarken döljer processfelen i stället för att lösa grundorsaken." },
      { text: "Att avstämningen bör läggas i RPA som kopierar mellan kalkylarken.", explain: "Då automatiseras symptomet; processen förbättras inte." },
      { text: "Att organisationen behöver en BPM-mognadsmätning innan något görs.", explain: "Testet pekar direkt på processen, inte på en mognadsmätning." }
    ],
    correct: 0, source: "F2 (Jeston s. 49)", reviewed: false },

  { id: "bpm-q14", topic: "perspektiv", difficulty: 2,
    question: "En chef vill höja servicen och säger: \"Engagerade medarbetare med medelbra processer slår bra processer med oengagerad personal.\" Vilket perspektiv uttrycker chefen?",
    options: [
      { text: "Customer-centric, eftersom målet är bättre service till kunden.", explain: "Målet är service, men medlet är medarbetarna; det är employee-centric." },
      { text: "Employee-centric, med empowerment och servant leadership.", explain: "Jestons employee-centric perspektiv i chefens egna ord." },
      { text: "Process-led, eftersom chefen själv har tagit initiativet.", explain: "Process-led är ett sätt att initiera, inte ett perspektiv." },
      { text: "Top-down, eftersom förändringen drivs av en chef.", explain: "Top-down är ett angreppssätt, inte ett perspektiv." }
    ],
    correct: 1, source: "F2 (employee-centric)", reviewed: false },

  { id: "bpm-q15", topic: "automatisera", difficulty: 2,
    question: "Vilken av följande hör till komponenten performance management i ett BPM-system enligt Jeston?",
    options: [
      { text: "Processmodellering i BPMN och processimulering.", explain: "Det hör till modellering och design." },
      { text: "Business rules engine och systemintegration.", explain: "Det hör till exekvering och spårning." },
      { text: "Balanced scorecard och business analytics.", explain: "Styrning av processerna genom KPI:er." },
      { text: "Work management och dokumenthantering.", explain: "Det hör till exekvering och spårning." }
    ],
    correct: 2, source: "F2 (Jeston figur 7.1)", reviewed: false },
  // ── Kapitel 5: 7FE och huset ──────────────────────────────────────────
  { id: "bpm-t11", topic: "ramverk", difficulty: 1,
    question: "Vad illustrerar Jeston (2022) med sin hus-metafor för Business Process Management?",
    options: [
      { text: "Att BPM främst ska ses som ett projekt snarare än en del av organisationens struktur.", explain: "Huset visar tvärtom BPM som en del av organisationens struktur och kultur." },
      { text: "Att BPM bör byggas upp från en tydlig grund av processkartläggning och automatisering innan strategi utvecklas.", explain: "Grunden är strategisk; strategin kommer först." },
      { text: "Att BPM består av flera lager – från strategiska grunder (fundament) till operativa och innovativa processer som tillsammans skapar en effektiv organisation.", explain: "Från regelverket och grunderna upp till processrummen och taket av styrning och kultur." },
      { text: "Att BPM handlar om att bygga IT-system steg för steg enligt en arkitekturplan.", explain: "Huset handlar om organisationen, inte om IT-bygge." }
    ],
    correct: 2, source: "Tenta HT25 ord 2(d)", reviewed: false },

  { id: "bpm-q16", topic: "ramverk", difficulty: 1,
    question: "Vilka tre faser ingår i F-gruppen Fulfilment i 7FE?",
    options: [
      { text: "Implement, Realize och Sustainability.", explain: "Realize och Sustainability är gruppen Future." },
      { text: "Understand, Innovate och People.", explain: "Understand och Innovate är Findings & solutions." },
      { text: "Launch, Understand och Develop.", explain: "Launch hör till Foundations-gruppen." },
      { text: "People, Develop och Implement.", explain: "Fulfilment förverkligar lösningarna." }
    ],
    correct: 3, source: "F2 (7FE = 10P3E)", reviewed: false },

  { id: "bpm-q17", topic: "ramverk", difficulty: 2,
    question: "Vilka är de tre essentials i 7FE?",
    options: [
      { text: "Leadership, BPM project management och people change management.", explain: "Förmågor som krävs genom alla faser." },
      { text: "Foundations, Findings & solutions och Fulfilment.", explain: "Det är tre av de fyra F-grupperna av faser." },
      { text: "Strategy, process governance, process architecture och technology.", explain: "Det är komponenter i target operating model." },
      { text: "Process redesign, outsourcing, shared services och RPA.", explain: "Det är processoptimeringslösningar." }
    ],
    correct: 0, source: "F2, HT24 fråga 38", reviewed: false },

  { id: "bpm-q18", topic: "ramverk", difficulty: 2,
    question: "Vilken beskrivning passar essential-förmågan Leadership i 7FE?",
    options: [
      { text: "Att resurser, budget, tidplan, intressenter och leveranser hanteras i hela aktiviteten.", explain: "Det är BPM project management." },
      { text: "Att ledarna ger stöd och vägledning så att aktiviteten och organisationen är linjerade.", explain: "Leadership är ledarnas stöd och vägledning; de andra två essentials hanterar resurser respektive acceptans." },
      { text: "Att alla berörda kan och vill ta till sig och bidra till den framtida lösningen.", explain: "Det är people change management." },
      { text: "Att en Chief Process Officer ansvarar för alla processer i hela organisationen.", explain: "CPO är en governance-roll i Enablement, inte en essential." }
    ],
    correct: 1, source: "HT24 fråga 32", reviewed: false },

  { id: "bpm-q19", topic: "ramverk", difficulty: 2,
    question: "En organisation har redan vision, mål och en processarkitektur på plats och vill hoppa direkt till Launch. Vad säger Jeston?",
    options: [
      { text: "Det är inte tillåtet: alla tio faser måste alltid genomföras i ordning.", explain: "Jeston säger att faser kan hoppas över, men inte utan motivering." },
      { text: "Det är alltid rätt, eftersom Foundations bara behövs i små projekt.", explain: "Foundations är kanske den mest kritiska fasen och gäller alla." },
      { text: "Det är möjligt men avrått utan motivering, eftersom 7FE ska anpassas.", explain: "One size fits all fungerar inte, men överhoppade faser ska motiveras." },
      { text: "Det avgörs av BPM-systemet, som visar vilka faser som redan är klara.", explain: "Ramverket är en managementmetod; tekniken avgör inte faserna." }
    ],
    correct: 2, source: "F2 (one size fits all)", reviewed: false },

  { id: "bpm-q20", topic: "ramverk", difficulty: 3,
    question: "Vilken av följande är en svaghet hos 7FE enligt Weaver?",
    options: [
      { text: "Ramverket ignorerar de mänskliga aspekterna och fokuserar på teknik.", explain: "Tvärtom: att det förenar människa och teknik är en styrka." },
      { text: "Ramverket kan bara användas för BPM och inte för andra IT-förändringar.", explain: "Weaver ser det som en allmän förändringsmetodik även för ERP och AI." },
      { text: "Ramverket saknar koppling till strategiskt tänkande.", explain: "Den strategiska förankringen räknas som en styrka." },
      { text: "Faserna överlappar, så gränserna mellan dem blir otydliga.", explain: "Sekventiella och parallella steg blandas, t.ex. People och Enablement." }
    ],
    correct: 3, source: "F2 (7FE:s styrkor och svagheter)", reviewed: false },

  { id: "bpm-q21", topic: "ramverk", difficulty: 2,
    question: "Vilket av följande är INTE en fas i 7FE?",
    options: [
      { text: "Evaluation.", explain: "Evaluation, Execution, Engagement, Follow-up och Feedback finns inte i 7FE." },
      { text: "Realize.", explain: "Fas 9, i gruppen Future." },
      { text: "Enablement.", explain: "Fas 2, i Foundations-gruppen." },
      { text: "Innovate.", explain: "Fas 5, i Findings & solutions." }
    ],
    correct: 0, source: "F2 (tio faser)", reviewed: false },

  // ── Kapitel 6: Foundations och Enablement ─────────────────────────────
  { id: "bpm-t12", topic: "foundations", difficulty: 1,
    question: "I en \"Red Wine Test\"-workshop beskriver chefer att “kunderna nu får sina ärenden lösta i ett steg”, “medarbetarna är engagerade”, och “vi har mycket bättre tvärfunktionellt samarbete”. Vilket syfte uppfylls här?",
    options: [
      { text: "Att definiera scope för framtida BPM-arbete", explain: "Scope definieras i Launch-workshopparna." },
      { text: "Att skapa ett beslutsunderlag för val av processoptimeringslösningar", explain: "Red Wine Test väljer inga lösningar." },
      { text: "Att skapa ett gemensamt narrativ om hur framgång i verksamheten ser ut efter BPMprojektet", explain: "Visionsövningen ger en gemensam bild av framgång, med utpekat ansvar per svar." },
      { text: "Att skapa detaljerade to-be processmodeller", explain: "To-be-modeller tas fram i Innovate." }
    ],
    correct: 2, source: "Tenta HT25 ord 2(i)", reviewed: false },

  { id: "bpm-t13", topic: "enablement", difficulty: 2,
    question: "Vad skiljer en \"process asset\" från enbart en processmodell, enligt Jeston?",
    options: [
      { text: "Processmodellen är separat och beskriver en specifik sekvens av aktiviteter, medan en process asset innehåller regler, ägarskap, risker, IT-stöd och dokumentationskrav", explain: "Modellen är inte separat: process asseten är ett arkiv som rymmer modellerna." },
      { text: "Processmodellen är ett exempel på explicit kunskap, medan en process asset kan inkludera både explicit och tyst (tacit) kunskap", explain: "Skillnaden gäller innehållet i arkivet, inte kunskapstyp." },
      { text: "Processmodellen används för små förändringar, process assets för större förändringsarbete", explain: "Storleken på förändringen avgör inte." },
      { text: "Processmodellen är en del av en process asset, som dessutom inkluderar roller, policies, regler, risker och övriga styrande element", explain: "Process asseten är arkivet; modellen är en del av den tillsammans med det styrande." }
    ],
    correct: 3, source: "Tenta HT25 ord 2(j)", reviewed: false },

  { id: "bpm-t14", topic: "foundations", difficulty: 1,
    question: "Vilket av följande beskriver bäst hur ett Red Wine Test genomförs, enligt Jeston?",
    options: [
      { text: "I en workshop analyserar man företagets strategidokument och gör kopplingar till centrala processer.", explain: "Det är Foundations steg 1, att skaffa strategin." },
      { text: "En kartläggning och analys av organisationens as-is-processer.", explain: "Det görs i Understand." },
      { text: "Deltagare föreställer sig att BPM-projektet redan är genomfört, och beskriver hur organisationens framtida tillstånd ser ut.", explain: "Så går övningen till: projektet tänks redan genomfört och lyckat." },
      { text: "Man gör en genomgång av vilka risker som kan kopplas till olika processer.", explain: "Riskerna hör till process asseten och projektledningen." }
    ],
    correct: 2, source: "Tenta HT25 omtenta 3", reviewed: false },

  { id: "bpm-t15", topic: "foundations", difficulty: 1,
    question: "Vad är huvudsyftet med en Target Operating Model (TOM) i BPM-arbetet?",
    options: [
      { text: "En schematisk överblick över organisationens \"to-be\" IT-arkitektur.", explain: "Technology är bara en av TOM:s sju komponenter." },
      { text: "Ett verktyg för att beräkna de kostnadsbesparingar som möjliggörs av processförbättringar.", explain: "Det gör business case." },
      { text: "En detaljerad karta över en organisations processer i nuläget (\"as-is\").", explain: "TOM beskriver framtiden, övergripande." },
      { text: "En övergripande beskrivning av hur en organisations olika delar ska fungera i framtiden för en lyckad BPM-implementering.", explain: "TOM är den övergripande framtida bilden, med sju komponenter som ska linjeras." }
    ],
    correct: 3, source: "Tenta HT25 omtenta 4", reviewed: false },

  { id: "bpm-t16", topic: "enablement", difficulty: 2,
    question: "En incident inträffar som berör en specifik process. Teamet behöver förstå steg, regler, ansvar och beslutspunkter för att analysera problemet. Vilken artefakt ska de använda?",
    options: [
      { text: "Process Worth Matrix.", explain: "Används för att prioritera processer, inte för att förstå en enskild process." },
      { text: "Organisationens strategidokument.", explain: "Strategin beskriver inte processens steg och regler." },
      { text: "Den tidigare utarbetade Target Operating Model (TOM).", explain: "TOM är övergripande och beskriver inte enskilda processer." },
      { text: "\"Process asset\" för den berörda processen.", explain: "Modeller, regler, roller och risker på ett ställe." }
    ],
    correct: 3, source: "Tenta HT25 omtenta 5", reviewed: false },

  { id: "bpm-q22", topic: "foundations", difficulty: 2,
    question: "Ett företag har effektiviserat sina operativa processer i flera år men står still mot konkurrenterna. Vad kallar Jeston resultatet?",
    options: [
      { text: "Productivity paradox: IT syns inte i produktivitetsstatistiken.", explain: "Paradoxen gäller IT-investeringar på 70- och 80-talen." },
      { text: "Different sameness: förbättringar utan verklig förändring.", explain: "Bara operational efficiency, utan management effectiveness." },
      { text: "Process drift: processerna glider bort från modellen.", explain: "Inget begrepp i Jestons modell." },
      { text: "Under the radar: förbättringar utan ledningens stöd.", explain: "Ett av scenarierna; det beskriver inte resultatet." }
    ],
    correct: 1, source: "F3 (strategy execution void)", reviewed: false },

  { id: "bpm-q23", topic: "foundations", difficulty: 2,
    question: "Vad är BPM-teamets första uppgift i Foundations enligt Jeston?",
    options: [
      { text: "Att kartlägga alla as-is-processer i hela organisationen ned till nivå 4.", explain: "Detaljerad kartläggning hör till Understand." },
      { text: "Att formulera en ny strategi som processerna kan linjeras mot.", explain: "Foundations skapar inte strategin." },
      { text: "Att förstå organisationens strategi, inte att skapa eller kritisera den.", explain: "Foundations säkerställer linjering, den skriver inte strategin." },
      { text: "Att välja processmotor och BPM-verktyg för hela organisationen.", explain: "Tekniken kommer i Enablement och ska inte styra." }
    ],
    correct: 2, source: "F3 (Foundations steg 1)", reviewed: false },

  { id: "bpm-q24", topic: "enablement", difficulty: 2,
    question: "Vilket påstående om Enablement-fasen stämmer?",
    options: [
      { text: "Fasen handlar enbart om tekniskt stöd som BPM-programvara och verktyg.", explain: "Enablement omfattar människor, process och teknik." },
      { text: "Fasen säkerställer att nyttan i business case realiseras.", explain: "Det är Realize." },
      { text: "Fasen är den formella startpunkten för en enskild BPM-aktivitet.", explain: "Det är Launch." },
      { text: "Fasen bygger komponenterna i TOM, som styrning, arkitektur, människor och teknik.", explain: "Sju steg från kommunikation till teknik som möjliggörare." }
    ],
    correct: 3, source: "F3 (Enablement), HT24 fråga 3", reviewed: false },

  { id: "bpm-q25", topic: "enablement", difficulty: 2,
    question: "Vem ansvarar enligt Jestons governance-struktur för en enskild process och prestationsstyrningen på processnivå?",
    options: [
      { text: "Process steward.", explain: "Ansvarar för enskilda processer och BPM-projekt." },
      { text: "Chief Process Officer.", explain: "Idealrollen över alla processer, sällan sedd i verkligheten." },
      { text: "Process executive.", explain: "Chef med ansvar för flera processer." },
      { text: "Strategic process council.", explain: "Det främsta styrande organet för alla BPM-aktiviteter." }
    ],
    correct: 0, source: "F3 (Enablement steg 2)", reviewed: false },

  // ── Kapitel 7: Launch och Understand ──────────────────────────────────
  { id: "bpm-t17", topic: "understand", difficulty: 2,
    question: "Vad är huvudsyftet med modellering i Understand-fasen enligt Jeston?",
    options: [
      { text: "Att skapa fullständiga processbeskrivningar som kan användas direkt vid automatisering i ett BPM-workflow.", explain: "Nulägesmodellen är ett analysverktyg, inte ett automatiseringsunderlag." },
      { text: "Att definiera detaljerade KPI-er baserat på modellerna för framtida styrning av processerna.", explain: "Processmål sätts i Launch." },
      { text: "Att få fram en gemensam, faktabaserad bild av hur en process faktiskt fungerar i dag för att analysera hur den eventuellt kan optimeras.", explain: "Nulägesmodellen är ett analysverktyg för en gemensam, faktabaserad bild." },
      { text: "Att producera dokumentation för transparens, revision och kvalitetssäkring.", explain: "Dokumentation är en bieffekt, inte syftet." }
    ],
    correct: 2, source: "Tenta HT25 omtenta 6", reviewed: false },

  { id: "bpm-q26", topic: "launch", difficulty: 2,
    question: "I Launch ska processmålen fastställas. Vilket råd ger Jeston?",
    options: [
      { text: "Så många mått som möjligt, så att inget viktigt i processen missas.", explain: "Jeston råder tvärtom att hålla antalet lågt." },
      { text: "Högst fem SMART-mål per process, kopplade till ansvariga chefer.", explain: "Få mått, SMART, och varje mål kopplat till en ansvarig chef." },
      { text: "Inga mått förrän Understand har kartlagt nuläget i detalj.", explain: "Målen sätts redan i Launch och jämförs med nuläget." },
      { text: "Samma mått för alla processer, så att de kan jämföras.", explain: "Målen sätts per process efter vad som behöver förbättras." }
    ],
    correct: 1, source: "F3 (Launch, processmål)", reviewed: false },

  { id: "bpm-q27", topic: "launch", difficulty: 2,
    question: "Hur ska business case i Launch skrivas enligt Jeston?",
    options: [
      { text: "Som en BPMN-modell över den framtida processen.", explain: "Business case skrivs inte i BPMN." },
      { text: "Som en detaljerad rapport med alla processer på nivå 5.", explain: "Den ska sammanfattas, helst på en sida." },
      { text: "På vanligt språk, på en sida, med evidens bakom påståendena.", explain: "Business case ska kunna förstås av alla och bygga på evidens." },
      { text: "Som en slutgiltig plan som inte får ändras i senare faser.", explain: "Planen kan behöva uppdateras senare." }
    ],
    correct: 2, source: "F3 (Launch steg 8)", reviewed: false },

  { id: "bpm-q28", topic: "launch", difficulty: 2,
    question: "Vad är syftet med den high-level process walkthrough som görs i Launch?",
    options: [
      { text: "Mätning: att fastställa KPI:er för varje steg i processen.", explain: "Mått sätts i workshopparna, inte i walkthroughen." },
      { text: "Utvärdering: att hitta de medarbetare som inte följer den beskrivna processen.", explain: "Walkthroughen är uttryckligen icke-kritisk." },
      { text: "Modellering: att ta fram to-be-processer tillsammans med IT.", explain: "To-be tas fram i Innovate." },
      { text: "Orientering: en övergripande förståelse av processerna, inte en utvärdering.", explain: "Kort, icke-kritisk och förberedande för Understand." }
    ],
    correct: 3, source: "F3 (Launch steg 3)", reviewed: false },

  { id: "bpm-q29", topic: "launch", difficulty: 2,
    question: "Vad ska kommunikationen i början av Launch särskilt bemöta enligt Jeston?",
    options: [
      { text: "Medarbetarnas rädsla för nedskärningar, outsourcing och automatisering.", explain: "Kommunikationen ska bemöta rädslan innan den blir motstånd." },
      { text: "Leverantörernas krav på nya avtal och gränssnitt.", explain: "Leverantörer är intressenter, men kommunikationen riktar sig främst till medarbetarna." },
      { text: "IT-avdelningens önskemål om vilken processmotor som väljs.", explain: "Tekniken ska inte styra, och det är inte kommunikationens fokus." },
      { text: "Ägarnas krav på snabb avkastning på BPM-investeringen.", explain: "Business case hanterar nyttan; kommunikationen gäller människorna." }
    ],
    correct: 0, source: "F3 (Launch steg 1)", reviewed: false },

  // ── Kapitel 8: Innovate–Sustainability, människor ─────────────────────
  { id: "bpm-t18", topic: "fullfoljd", difficulty: 2,
    question: "Vilket av följande är typiska outputs från Innovate-fasen i Jeston's 7FE-ramverk?",
    options: [
      { text: "Identifierade rotorsaker", explain: "Rotorsaker identifieras i Understand." },
      { text: "Projektets riskanalys och riskregister", explain: "Hör till projektledningen, inte till Innovate." },
      { text: "Design av framtida processer (“to-be”) och validerade lösningsförslag", explain: "To-be och validerade lösningar är Innovates resultat." },
      { text: "Utbildningsplaner för berörd personal", explain: "Hör till People-fasen." }
    ],
    correct: 2, source: "Tenta HT25 ord 2(h)", reviewed: false },

  { id: "bpm-q30", topic: "fullfoljd", difficulty: 2,
    question: "Vad är syftet med Realize-fasen i 7FE?",
    options: [
      { text: "Att bygga alla de komponenter som krävs för att kunna införa de nya processerna.", explain: "Det är Develop." },
      { text: "Att säkerställa att nyttan som beskrevs i business case faktiskt realiseras.", explain: "Realize följer upp business case från Launch." },
      { text: "Att föreställa sig det framtida tillståndet i en visionsövning.", explain: "Det är Red Wine Test i Foundations." },
      { text: "Att hålla igång styrning och ständig förbättring efter projektet.", explain: "Det är Sustainability." }
    ],
    correct: 1, source: "HT24 fråga 43", reviewed: false },

  { id: "bpm-q31", topic: "fullfoljd", difficulty: 2,
    question: "Vad betyder Sustainability i 7FE?",
    options: [
      { text: "Att processerna optimeras för lägre energiförbrukning och utsläpp.", explain: "Det är Green BPM; Weaver påpekar att Sustainability inte betyder hållbarhet." },
      { text: "Att förbättringarna kommuniceras, varefter styrningen av processerna kan avslutas.", explain: "Styrningen och förbättringen fortsätter." },
      { text: "Att styrning och ständig förbättring fortsätter, som konkurrensfördel.", explain: "Sustainability håller förbättringarna vid liv genom fortsatt styrning." },
      { text: "Att nyttan i business case följs upp och rapporteras till ledningen.", explain: "Det är Realize." }
    ],
    correct: 2, source: "F2 (\"not hållbarhet\"), HT24 fråga 47", reviewed: false },

  { id: "bpm-q32", topic: "manniskor", difficulty: 2,
    question: "Vad kännetecknar appreciative inquiry som förändringsansats?",
    options: [
      { text: "Den söker rotorsakerna till fel och åtgärdar dem en i taget.", explain: "Tvärtom: den söker rotorsakerna till framgång." },
      { text: "Den fokuserar på vad som är fel för att skapa en känsla av kris.", explain: "Det är motsatsen till appreciative inquiry." },
      { text: "Den behandlar hinder som barriärer som ska rivas uppifrån.", explain: "Så beskrivs inte ansatsen." },
      { text: "Den utgår från det som fungerar och söker orsakerna till framgång.", explain: "Ansatsen bygger förändringen på organisationens styrkor." }
    ],
    correct: 3, source: "HT24 fråga 33 (preliminärt)", reviewed: false },

  { id: "bpm-q33", topic: "manniskor", difficulty: 2,
    question: "Ett BPM-projekt levererar tekniskt korrekta processer, men medarbetarna fortsätter arbeta på det gamla sättet. Vilken essential har troligen försummats?",
    options: [
      { text: "People change management, som ska göra att alla kan och vill ta till sig lösningen.", explain: "Acceptansen är people change managements uppgift, en av de tre essentials." },
      { text: "BPM project management, som ska hålla tidplan och budget.", explain: "Tidplan och budget löser inte att människorna inte tar till sig lösningen." },
      { text: "Process governance, som ska fördela roller i processerna.", explain: "Governance är ett Enablement-steg, inte en av de tre essentials." },
      { text: "Performance management, som ska mäta processernas prestation.", explain: "Mätning är ett Enablement-steg och löser inte acceptansen." }
    ],
    correct: 0, source: "F2 (essentials), tenta HT25 ord 1(a)", reviewed: false },

  { id: "bpm-q34", topic: "manniskor", difficulty: 2,
    question: "En organisation på Under the radar-nivå planerar ett organisationsövergripande transformationsprogram. Vad säger Jestons råd om mognad?",
    options: [
      { text: "Att ett stort program är bästa sättet att snabbt höja mognaden.", explain: "Jeston menar tvärtom att för högt tempo ökar risken." },
      { text: "Att gå fortare än mognaden tillåter ökar risken att misslyckas.", explain: "Matcha tempot med processmognaden." },
      { text: "Att mognaden saknar betydelse om ledningen stödjer programmet.", explain: "Även med stöd måste tempot passa mognaden." },
      { text: "Att mognaden bara påverkar valet av BPM-programvara.", explain: "Mognaden påverkar tempo, bredd och angreppssätt." }
    ],
    correct: 1, source: "F2 (Jeston s. 25), F3 (mognad)", reviewed: false },

  { id: "bpm-q35", topic: "manniskor", difficulty: 1,
    question: "Hur stor del av arbetet i ett BPM-initiativ handlar enligt Jeston om kommunikation och mänskliga aspekter?",
    options: [
      { text: "Omkring 20 procent.", explain: "För lågt; Jeston menar att människorna är huvuddelen." },
      { text: "Omkring 40 procent.", explain: "För lågt." },
      { text: "Omkring 60 procent.", explain: "Jestons siffra, som HT25-tentans essäfråga utgick från." },
      { text: "Omkring 80 procent.", explain: "För högt." }
    ],
    correct: 2, source: "Tenta HT25 ord 1(a)", reviewed: false },

  // ── Kapitel 9: AI och hållbarhet ──────────────────────────────────────
  { id: "bpm-t19", topic: "framtid", difficulty: 2,
    question: "Varför har Green BPM inte fått det breda genomslag som visionerna från (Houy et al.) 2012 förutspådde?",
    options: [
      { text: "De flesta BPM-verktyg saknar inbyggt stöd för att lagra, räkna och analysera energi-, utsläpps- och resursdata i modellerna", explain: "Houy: verktygen måste anpassas, nyckeltalen saknas och kostnaden går före." },
      { text: "BPM håller på att ersättas av Agentic AI orchestration", explain: "Inget stöd i artikeln." },
      { text: "Hållbarhetsdata får inte lagras i BPM- eller ERP-system enligt lagstiftning", explain: "Inget sådant förbud finns." },
      { text: "Process mining fungerar inte för CO₂-data", explain: "Inget stöd i artikeln." }
    ],
    correct: 0, source: "Tenta HT25 ord 2(e); Houy et al. (2012) s. 76, 78, 90", reviewed: false },

  { id: "bpm-t20", topic: "framtid", difficulty: 2,
    question: "Vad är huvudpoängen med en LPM (Large Process Model) enligt Kampik et al. (2025)?",
    options: [
      { text: "Att minska behovet av omfattande dokumentation av processer med hjälp av BPMN.", explain: "LPM handlar om kunskap och rekommendationer, inte mindre dokumentation." },
      { text: "Att automatisera och styra alla processer genom agentic AI orchestration.", explain: "LPM är en kunskapsbas, inte en orkestreringsmotor." },
      { text: "Att ta bort behovet av processanalytiker och BPM-aktiviteter.", explain: "LPM stödjer BPM-arbetet, ersätter det inte." },
      { text: "Att skapa en samlad, datadriven kunskapsbas som kan ge automatiserade rekommendationer för processförbättring.", explain: "LPM samlar processkunskapen så att förbättringsförslag kan tas fram automatiskt." }
    ],
    correct: 3, source: "Tenta HT25 omtenta 11", reviewed: false },

  { id: "bpm-t21", topic: "framtid", difficulty: 2,
    question: "Hur stödjer BPMN och DMN regulatoriska krav på förklarbarhet (explainability) i samband med automatiserat beslutsfattande?",
    options: [
      { text: "Genom att översätta processer och beslutsregler till naturligt språk", explain: "Notationerna är visuella och tabellbaserade, inte naturligt språk." },
      { text: "Genom att göra beslutsflöden visuella och förståeliga, vilket gör det möjligt att bättre förklara för medborgare varför ett beslut blev som det blev", explain: "Visuella beslutsflöden och beslutstabeller gör det möjligt att förklara utfallet." },
      { text: "Genom att automatiskt generera besluts- och processloggar", explain: "Loggar skapas av motorn, inte av notationen." },
      { text: "Genom att möjliggöra processoptimisering vilket leder till mindre komplexa beslut", explain: "Förklarbarhet handlar inte om enklare beslut." }
    ],
    correct: 1, source: "Tenta HT25 ord 3(a)", reviewed: false },

  { id: "bpm-q36", topic: "framtid", difficulty: 2,
    question: "Ett försäkringsbolag låter en AI fatta beslut om skadeersättning utifrån mål och regler, utan att en människa godkänner. Vilken av Rosemanns drifts beskriver det?",
    options: [
      { text: "Från transaktion till konversation.", explain: "Den handlar om att tala naturligt språk med processinformationen." },
      { text: "Från workflow till robotisering.", explain: "Ingen av de tre driftsen." },
      { text: "Från förenkling till sofistikering.", explain: "Den handlar om rikare processer med ny teknik och nya mått." },
      { text: "Från automatisering till autonomisering.", explain: "Processen fattar själv beslut, nästa steg efter RPA." }
    ],
    correct: 3, source: "Rosemann et al. (2024) s. 420–422", reviewed: false },

  { id: "bpm-q37", topic: "framtid", difficulty: 2,
    question: "Vad är kärnidén i Green BPM enligt Houy et al. (2012)?",
    options: [
      { text: "Att varje aktivitet annoteras med resursförbrukning och utsläpp.", explain: "Värdena summeras per process och används i redesign." },
      { text: "Att processerna flyttas till energisnåla datacenter i molnet.", explain: "Green IS omfattar mer än energisnål IT; kärnan gäller processmodellerna." },
      { text: "Att hållbarhet helt ersätter kostnad och tid som processernas mål.", explain: "Houy lägger till hållbarhet; kostnaden går oftast fortfarande före." },
      { text: "Att BPMN ersätts av en särskild notation för miljödata.", explain: "Annoteringen görs i EPC eller BPMN." }
    ],
    correct: 0, source: "Houy et al. (2012) s. 78–82", reviewed: false },

  // ── Kapitel 10: BPMN grunder ──────────────────────────────────────────
  { id: "bpm-t22", topic: "bpmn", difficulty: 1,
    question: "Vilket av följande är mest lämpligt att modellera som en BPMN-process?",
    options: [
      { text: "Kontinuerligt förbättringsarbete: en förbättringsgrupp tar löpande emot idéer, prioriterar när tid finns, testar ad hoc och genomför ibland förändringar beroende på aktuella behov", explain: "Kontinuerligt och ostrukturerat, utan definierad start och slut." },
      { text: "Kunskapsdelning i Teams: medarbetare delar tips när det passar; diskussioner kan leda till åtgärder men har ingen tydlig avslutspunkt.", explain: "Ingen avslutspunkt och ingen instans." },
      { text: "Ta fram och uppdatera resepolicyn: ekonomiavdelningen ändrar regler och attestnivåer vid behov, kommunicerar förändringar och reviderar policyn när förutsättningarna ändras.", explain: "Löpande förvaltning utan tydliga instanser." },
      { text: "Ersättningshantering för en reseräkning: en medarbetare skickar in en reseräkning, ekonomi kontrollerar underlag, begär komplettering vid behov, skickar för attest och avslutar med Utbetald eller Avslagen.", explain: "Definierad start och slut, instanser och kända aktiviteter." }
    ],
    correct: 3, source: "Tenta HT25 omtenta 14", reviewed: false },

  { id: "bpm-q38", topic: "bpmn", difficulty: 1,
    question: "I en orderprocess skickas en orderbekräftelse automatiskt per e-post när ordern är registrerad. Vilken task-typ passar?",
    options: [
      { text: "User task, eftersom kunden läser e-posten.", explain: "En user task utförs av en person; här sker allt automatiskt." },
      { text: "Service task, eftersom ingen människa är inblandad.", explain: "Automatiserad, utan mänsklig interaktion." },
      { text: "Manual task, eftersom e-post skickas utanför processen.", explain: "Manual task utförs för hand av en människa." },
      { text: "Business rule task, eftersom en regel styr utskicket.", explain: "Business rule task anropar en beslutsregel, t.ex. en DMN-tabell." }
    ],
    correct: 1, source: "Genomgången s. 8, HT24 fråga 39–42", reviewed: false },

  { id: "bpm-q39", topic: "bpmn", difficulty: 2,
    question: "Vad gör en exclusive gateway (XOR) i Silvers stil?",
    options: [
      { text: "Den testar ett datavillkor och låter exakt en väg följas.", explain: "Beslutet fattas i aktiviteten före; gatewayen testar villkoret." },
      { text: "Den fattar beslutet om vilken väg processen ska ta.", explain: "Gatewayen fattar inget beslut; beslutet fattas i aktiviteten före." },
      { text: "Den väntar på den händelse som inträffar först.", explain: "Det är event-based gateway." },
      { text: "Den aktiverar en eller flera vägar efter villkoren.", explain: "Det är inclusive gateway (OR)." }
    ],
    correct: 0, source: "Genomgången s. 9", reviewed: false },

  { id: "bpm-q40", topic: "bpmn", difficulty: 2,
    question: "En modell har poolerna \"Order process\" och \"Customer\" (black-box). Hur ska kundens beställning ritas?",
    options: [
      { text: "Som ett sequence flow från Customer-poolen till startaktiviteten.", explain: "Sequence flow går aldrig mellan pooler." },
      { text: "Som ett message flow \"Order\" till en message start \"Receive order\".", explain: "Message flow namnges med substantiv, starten \"Receive [meddelande]\"." },
      { text: "Som en lane \"Customer\" i orderprocessens pool med egna aktiviteter.", explain: "Kunden är extern och har inga definierade uppgifter; black-box pool." },
      { text: "Som en association från Customer-poolen till en textannotering.", explain: "Association kopplar artefakter, inte meddelanden." }
    ],
    correct: 1, source: "Genomgången s. 23–26, övningshäftet 1.1", reviewed: false },

  { id: "bpm-q41", topic: "bpmn", difficulty: 2,
    question: "En subprocess i föräldradiagrammet följs av en XOR-gateway med tre gates. Vad kräver Björns regel av barndiagrammet?",
    options: [
      { text: "Att det har tre sluthändelser, en för varje gate.", explain: "Antalet end states ska matcha antalet gates." },
      { text: "Att det har en triggad start som väntar på gatewayen.", explain: "Barndiagrammet ska ha en otriggad start." },
      { text: "Att det slutar med en egen XOR-gateway med tre utgångar.", explain: "Gatewayen står i föräldern; barnet har sluthändelser." },
      { text: "Att det har högst tre aktiviteter, en per gate.", explain: "Gränsen är högst tio aktiviteter per diagram." }
    ],
    correct: 0, source: "Genomgången s. 11–12", reviewed: false },

  { id: "bpm-q42", topic: "bpmn", difficulty: 2,
    question: "Vilket element anropar en fristående, återanvändbar process som är modellerad separat?",
    options: [
      { text: "En kollapsad subprocess med plustecken.", explain: "En vanlig subprocess hör till sin förälder." },
      { text: "En call activity med tjock ram runt aktiviteten.", explain: "Tjock ram betyder call activity: en fristående process som kan återanvändas." },
      { text: "En event subprocess med streckad ram och triggad start.", explain: "Den triggas av en händelse inne i processen." },
      { text: "En task med loop marker, som upprepas.", explain: "Loop marker betyder att aktiviteten upprepas." }
    ],
    correct: 1, source: "Genomgången s. 31–34", reviewed: false },

  // ── Kapitel 11: händelser (element och regler; körning i Kör processen) ─
  { id: "bpm-q43", topic: "handelser", difficulty: 2,
    question: "En kollapsad event subprocess har streckad ram och en streckad cirkel med kuvert i hörnet. Vad betyder det?",
    options: [
      { text: "Non-interrupting event subprocess som startar på ett meddelande.", explain: "Streckad ram = event subprocess, streckad cirkel = non-interrupting, kuvert = meddelande." },
      { text: "Interrupting event subprocess som startar när ett meddelande kommer.", explain: "Interrupting har heldragen startcirkel." },
      { text: "Non-interrupting event subprocess som startar på en timer.", explain: "Timer har en klocka, inte ett kuvert." },
      { text: "Receive task med heldragen ram som väntar på ett meddelande.", explain: "En receive task har heldragen ram och ofyllt kuvert." }
    ],
    correct: 0, source: "Genomgången s. 61–65, tenta HT25 omtenta 13", reviewed: false },

  { id: "bpm-q44", topic: "handelser", difficulty: 2,
    question: "Under granskningen av en låneansökan kan sökanden skicka kompletterande uppgifter utan att granskningen avbryts. Hur modelleras det?",
    options: [
      { text: "Med ett interrupting message boundary event på granskningen.", explain: "Interrupting skulle avbryta granskningen." },
      { text: "Med ett non-interrupting message boundary event på granskningen.", explain: "Aktiviteten fortsätter och undantagsflödet startar parallellt." },
      { text: "Med ett error boundary event på granskningen.", explain: "Error är alltid interrupting och gäller undantag." },
      { text: "Med en event-based gateway efter granskningen.", explain: "Då väntar man först när granskningen är klar." }
    ],
    correct: 1, source: "Genomgången s. 49–51", reviewed: false },

  { id: "bpm-q45", topic: "handelser", difficulty: 2,
    question: "Vilket påstående om error boundary events stämmer?",
    options: [
      { text: "De är alltid interrupting och fångar ett fel från aktiviteten.", explain: "Error boundary avbryter alltid aktiviteten och följer undantagsflödet." },
      { text: "De kan vara både interrupting och non-interrupting.", explain: "Bara message och timer kan vara non-interrupting." },
      { text: "De har ett inkommande sekvensflöde från aktiviteten.", explain: "Boundary events har inga inkommande flöden." },
      { text: "De används bara för tekniska fel, inte affärsmässiga.", explain: "Error används för både tekniska och affärsmässiga undantag." }
    ],
    correct: 0, source: "Genomgången s. 49, 57–59", reviewed: false },

  { id: "bpm-q46", topic: "handelser", difficulty: 2,
    question: "Två parallella vägar möts, men en XOR på den ena vägen kan leda flödet till ett annat slut. Vilken join undviker deadlock?",
    options: [
      { text: "En OR-join, som bara väntar på de vägar som faktiskt aktiverats.", explain: "OR-joinen väntar bara in de vägar som faktiskt är på väg." },
      { text: "En AND-join, eftersom vägarna startade parallellt.", explain: "AND-joinen väntar på en väg som kanske aldrig kommer: deadlock." },
      { text: "En XOR-join, som släpper igenom varje token som kommer.", explain: "Då körs det som följer två gånger när båda vägarna kommer." },
      { text: "En event-based gateway, som väljer den väg som kommer först.", explain: "Event-based gateway används för att vänta på händelser, inte för join." }
    ],
    correct: 0, source: "Genomgången s. 35–39", reviewed: false },

  { id: "bpm-q47", topic: "handelser", difficulty: 2,
    question: "Hur fungerar en event-based gateway?",
    options: [
      { text: "Den aktiverar bara den väg vars händelse inträffar först.", explain: "Vägen avgörs vid körning." },
      { text: "Den följer den väg vars datavillkor är sant.", explain: "Det är XOR." },
      { text: "Den startar alla vägar och väntar in samtliga händelser.", explain: "Det är beteendet hos AND." },
      { text: "Den väljer väg utifrån en DMN-beslutstabell.", explain: "Beslutstabeller anropas med business rule task." }
    ],
    correct: 0, source: "Genomgången s. 60, HT24 fråga 20", reviewed: false },
];
