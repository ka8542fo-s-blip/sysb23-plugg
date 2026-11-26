// Fliken Essä i Verksamhetsarkitektur (Kaspers beslut 23 nov, efter
// lärarens besked om tentan: tre essäfrågor, 40 p, cirka 200 ord, max 500).
// Lärarens 37 essä-, fall-, scenario- och tankefrågor i modulerna är
// indelade i elva teman; varje fråga står i exakt ett tema
// (scripts/essa-teman.test.mjs vaktar indelningen).
//
// Varje tema har en tentafråga med utvecklingsfrågor, en checklista, en
// disposition och ett utvecklat modellsvar på svenska. Svaret bygger bara på
// lärarens material (modulernas text, hans modellsvar, förklaringar och
// lärdomar, sparsamt Word-dokumentet) och lärarens egna exempel; det som
// tillkommer är resonemanget om problem och effekt. Undantaget är orden
// "doktrin" och "skyddsräcken", som läraren använde muntligt på
// föreläsningen 23 nov. `tackning` pekar ut en mening i svaret per fråga.
//
// `prioritet` (1–3) och `storEssa` styr ordningen i fliken Essä, se ORDNING
// nedan.
//
// `context` och "Lärarens korta svar" (`ufAnswers`) byggs nedan ur
// modulfilerna, så att lärarens modellsvar aldrig skrivs två gånger.
// `arkitekturEssays` i essays.js ligger kvar i repot men visas inte.
import { MODULER } from "./moduler/index.js";

export const TEMAN = [
  {
    id: "ea-tema-1",
    title: "Enterprise och avgränsning",
    prioritet: 3,
    fragor: ["ea-e1-10"],
    question: `Förklara varför begreppet "enterprise" är viktigare för Enterprise Architecture än begreppet "företag".

a) Vad kännetecknar en enterprise, och hur avgör arkitekten var gränsen går?
b) Vilket problem uppstår om avgränsningen blir för snäv, och vilken effekt får det att utgå från enterprisen?`,
    checklist: [
      {
        heading: "Vad en enterprise är",
        points: [
          "En samling organisationer, organisatoriska enheter eller capabilities med en gemensam uppsättning mål.",
          "Den definieras av gemensamma mål, inte nödvändigtvis av juridiskt ägande: ett företag, en myndighet, ett ekosystem.",
          "Enterprise Architecture handlar om enterprisens struktur och utveckling i förhållande till dess mål.",
        ],
      },
      {
        heading: "Avgränsningen",
        points: [
          "Ett affärsresultat kan bero på partner, leverantörer, tillsynsmyndigheter och andra externa aktörer.",
          "Lärarens exempel: Volvo, en Volvohandlare, en logistikleverantör och en bank som tillsammans förser en kund med en bil.",
          "Arkitekten fastställer avgränsningen utifrån verksamhetsproblemet och det önskade resultatet; gränserna är inte alltid fasta.",
        ],
      },
      {
        heading: "Problem och effekt",
        points: [
          "Problemet: bara företaget ger en ofullständig bild, och en för snäv avgränsning kan missa viktiga beroenden. Att definiera avgränsningen är i sig en arkitektonisk concern.",
          "Effekten: de relationer och stakeholders inom och utanför organisationen som påverkar resultatet kommer med.",
        ],
      },
    ],
    outline:
      "Inled med vad Enterprise Architecture handlar om och vad en enterprise är. Visa sedan med lärarens Volvoexempel hur arkitekten avgör gränsen. Avsluta med problemet med en för snäv avgränsning och effekten av att utgå från enterprisen.",
    modelAnswer: `Enterprise Architecture handlar om en enterprises struktur och utveckling i förhållande till dess mål. Därför spelar det roll vad som menas med enterprise.

En enterprise är vilken samling som helst av organisationer, organisatoriska enheter eller capabilities som har en gemensam uppsättning mål. Den definieras alltså av gemensamma mål, inte nödvändigtvis av juridiskt ägande. Det kan vara ett företag, men också en myndighet, ett universitet, en grupp samverkande organisationer eller ett ekosystem i en leveranskedja. Ett affärsresultat kan bero på partner, leverantörer, tillsynsmyndigheter och andra externa aktörer, och då kan enterprisen sträcka sig utanför ett juridiskt företags gränser.

Om Volvo, en Volvohandlare, en logistikleverantör och en bank samarbetar för att förse en kund med en bil, vilka av dem hör då till den enterprise vi försöker förstå? Det finns inte nödvändigtvis ett enda rätt svar, utan det beror på arkitekturens avgränsning och syfte. Arkitekten måste fastställa den relevanta avgränsningen utifrån verksamhetsproblemet och det önskade resultatet. Gränserna är därför inte alltid fasta och inte alltid desamma som organisationens.

Problemet med att bara se till företaget är att bilden av arkitekturen kan bli ofullständig. Blir avgränsningen för snäv kan viktiga beroenden missas, till exempel i ett digitalt ekosystem där kunder, leverantörer, plattformar och teknikleverantörer alla bidrar till resultatet. Att definiera avgränsningen är därför i sig en arkitektonisk concern.

Effekten av att utgå från enterprisen är att arkitekten får med de relationer och stakeholders som påverkar resultatet, både inom och utanför den organisation som leder arbetet. Arkitekten förstår då den enterprise som arkitekturen gäller, i stället för att automatiskt anta att enterprisen är den juridiska organisationen.`,
    tackning: {
      "ea-e1-10":
        "Ett affärsresultat kan bero på partner, leverantörer, tillsynsmyndigheter och andra externa aktörer, och då kan enterprisen sträcka sig utanför ett juridiskt företags gränser.",
    },
  },
  {
    id: "ea-tema-2",
    title: "Arkitektur är mer än komponenter",
    prioritet: 3,
    fragor: ["ea-e2-x", "ea-e2-11"],
    question: `Varför räcker det inte att beskriva en enterprise genom att bara räkna upp dess komponenter?

a) Förklara skillnaden mellan arkitektur, design och implementering.
b) Vilket problem uppstår om man bara beskriver komponenterna, och vilken effekt får det att förstå relationerna?`,
    checklist: [
      {
        heading: "Arkitektur",
        points: [
          "Den grundläggande organisationen av något: komponenter, relationer, principer och hur helheten utvecklas över tid.",
          "Komponenter förklarar inte i sig hur enterprisen fungerar. Relationer, beroenden, ansvar, principer, begränsningar och syfte hör till.",
          "Ett diagram är en representation av arkitekturen, inte arkitekturen själv.",
          "Lärarens kedja business capability → process → information → applikation → teknik: vad mer påverkas om capabilityn förändras?",
        ],
      },
      {
        heading: "Arkitektur, design och implementering",
        points: [
          "Arkitektur fastställer den grundläggande organisationen, relationerna, principerna och begränsningarna.",
          "Design tar fram mer detaljerade lösningar inom arkitekturens ramar; implementering förverkligar designen i en driftsmiljö.",
          "Skillnaderna är inte absoluta, men de motsvarar olika nivåer av beslutsfattande och abstraktion.",
        ],
      },
      {
        heading: "Problem och effekt",
        points: [
          "Problemet: utan relationerna syns inte beroendena, till exempel mellan Business och Application Architecture. Effekten: konsekvenserna av en förändring kan bedömas.",
          "Arkitektur finns för att möjliggöra förändring med ett syfte.",
        ],
      },
    ],
    outline:
      "Inled med vad arkitektur är och varför komponenter inte räcker, med lärarens kedja som exempel. Skilj sedan arkitektur från design och implementering. Avsluta med problemet när relationerna saknas och effekten av att förstå dem.",
    modelAnswer: `Arkitektur är den grundläggande organisationen av något. Den omfattar komponenterna, relationerna mellan dem, principerna och hur helheten utvecklas över tid. En lista över komponenter räcker därför inte, och ett diagram är inte heller arkitekturen själv, utan en representation av den.

Komponenter förklarar inte i sig hur enterprisen fungerar. Arkitektur handlar också om relationer, beroenden, ansvar, principer, begränsningar och syfte. Ett exempel är kedjan business capability → process → information → applikation → teknik. Med den kan arkitekten fråga: "Om den här capabilityn förändras, vad mer påverkas?" Det är arkitektoniskt tänkande.

Arkitekturen skiljer sig också från design och implementering. Arkitektur fastställer den grundläggande organisationen, relationerna, principerna och begränsningarna. Design tar fram mer detaljerade lösningar inom de ramar som arkitekturen sätter, och implementering förverkligar designen i en driftsmiljö. Skillnaderna är inte absoluta, men de motsvarar olika nivåer av beslutsfattande och abstraktion. En arkitektur behöver därför inte beskriva varje implementeringsdetalj. Abstraktion döljer de irrelevanta detaljerna, så att en fråga kan förstås på en lämplig nivå.

Problemet med att bara räkna upp komponenter är att beroendena inte syns. Då går det inte att bedöma vad mer som påverkas när något förändras, till exempel vilka applikationer som stödjer en kritisk business capability. Samma sak gäller arkitekturdomänerna. Om en business capability stöds dåligt av flera fragmenterade applikationer är det en fråga om relationen mellan Business och Application Architecture, och den syns inte i en lista.

Effekten av att förstå relationerna är att arkitekten kan bedöma konsekvenserna av en förändring. Det är just därför arkitektur finns: för att möjliggöra förändring med ett syfte.`,
    tackning: {
      "ea-e2-x":
        "Komponenter förklarar inte i sig hur enterprisen fungerar.",
      "ea-e2-11":
        "Skillnaderna är inte absoluta, men de motsvarar olika nivåer av beslutsfattande och abstraktion.",
    },
  },
  {
    id: "ea-tema-3",
    title: "EA: mer än IT, en brygga från strategi till förändring",
    prioritet: 1,
    storEssa: "ea-e12-essay-1",
    fragor: ["ea-e3-10", "ea-e3-11", "ea-e12-essay-1"],
    question: `Förklara varför Enterprise Architecture bör ses som en disciplin för att möjliggöra förändring snarare än att bara dokumentera den nuvarande enterprisen.

a) Vad skiljer Enterprise Architecture från IT architecture?
b) Hur kopplar Enterprise Architecture strategi till förändring?
c) Vilket problem uppstår om arkitekturen bara blir dokumentation, och vilken effekt får det att använda den för beslut?`,
    checklist: [
      {
        heading: "EA och IT architecture",
        points: [
          "EA är praktiken att förstå, utforma, kommunicera och styra enterprisens grundläggande struktur och utveckling för att nå dess mål.",
          "IT architecture fokuserar i första hand på informationsteknikens strukturer och lösningar.",
          "EA har en bredare avgränsning: affärsstrategi, capabilities, organisation, information, applikationer, teknik och relationerna. IT architecture kan ses som en del av den.",
        ],
      },
      {
        heading: "Från strategi till förändring",
        points: [
          "EA översätter strategiska mål till konsekvenser för arkitekturen.",
          "Strategin identifierar önskade resultat; arkitekturen identifierar capabilities, information, applikationer, teknik och organisationsförändringar som krävs.",
          "Lärarens exempel: den enklaste banken för den som köper sin första bostad behöver digital bolåneutgivning.",
        ],
      },
      {
        heading: "Problem och effekt",
        points: [
          "Problemet: dokumentation av nuläget är användbar men räcker inte; fin dokumentation betyder inte nödvändigtvis en fungerande EA.",
          "Effekten: EA identifierar gap, beroenden, risker och möjligheter och stödjer beslut om framtida lägen och övergångar.",
          "I en miljö av digital transformation och ständig förändring måste arkitekturen själv utvecklas.",
        ],
      },
    ],
    outline:
      "Inled med vad Enterprise Architecture är och hur den skiljer sig från IT architecture. Visa sedan hur den översätter strategi till förändring med bankens exempel. Avsluta med problemet om arkitekturen bara blir dokumentation och effekten av att använda den för beslut.",
    modelAnswer: `Enterprise Architecture är praktiken att förstå, utforma, kommunicera och styra den grundläggande strukturen och utvecklingen hos en enterprise för att nå dess mål. Den ger ett strukturerat sätt att förstå enterprisen och avgöra hur den bör utvecklas.

Därmed skiljer den sig från IT architecture, som i första hand fokuserar på informationsteknikens strukturer och lösningar. Enterprise Architecture har en bredare avgränsning och tar hänsyn till affärsstrategi, capabilities, organisation, information, applikationer, teknik och deras relationer. IT architecture kan därför ses som en del av det bredare Enterprise Architecture-landskapet. Den viktiga frågan är inte vilken teknik man ska köpa, utan vad enterprisen behöver få förmåga att göra och vilka förändringar som krävs för att nå målen.

Enterprise Architecture översätter strategiska mål till konsekvenser för arkitekturen. Strategin identifierar önskade resultat, och arkitekturen identifierar de capabilities, strukturer, den information, de applikationer, den teknik och de organisationsförändringar som krävs för att nå dem. Om strategin är att bli den enklaste banken för den som köper sin första bostad, är digital bolåneutgivning den capability det gäller, och arkitekturen anger vad den kräver. Arkitekturen blir på så sätt en brygga mellan strategisk avsikt och implementering.

Dokumentation av nuläget är användbar, eftersom den ger förståelse av befintliga capabilities, processer, information, applikationer och teknik. Problemet uppstår om arkitekturen stannar där, för då används förståelsen inte till beslut om förändring. Fin dokumentation av systemen betyder inte nödvändigtvis att organisationen har en Enterprise Architecture som fungerar.

Arkitekturen blir strategiskt värdefull när förståelsen används för att fatta beslut om framtida lägen och övergångar. Effekten är att Enterprise Architecture kopplar nuvarande förhållanden till önskade resultat: den identifierar gap, beroenden, risker och möjligheter och stödjer beslut om hur enterprisen bör förändras. I en miljö som präglas av digital transformation och ständig förändring måste arkitekturen själv utvecklas i stället för att bli en statisk dokumentationsövning.`,
    tackning: {
      "ea-e3-10":
        "IT architecture kan därför ses som en del av det bredare Enterprise Architecture-landskapet.",
      "ea-e3-11":
        "Arkitekturen blir på så sätt en brygga mellan strategisk avsikt och implementering.",
      "ea-e12-essay-1":
        "Arkitekturen blir strategiskt värdefull när förståelsen används för att fatta beslut om framtida lägen och övergångar.",
    },
  },
  {
    id: "ea-tema-4",
    title: "Zachman och TOGAF",
    prioritet: 1,
    storEssa: "ea-e12-essay-2",
    fragor: ["ea-e4-10", "ea-e4-11", "ea-e5-12", "ea-e12-essay-2"],
    question: `Jämför Zachmans och TOGAF:s roller i Enterprise Architecture.

a) Varför är det missvisande att beskriva Zachman som en metodik?
b) Vad ger TOGAF och dess ADM?
c) Vilket problem uppstår om man blandar ihop ramverkens roller, och hur kan de komplettera varandra?`,
    checklist: [
      {
        heading: "Zachman",
        points: [
          "En ontology, ett klassificeringsschema för beskrivningar av en enterprise.",
          "Sex interrogatives (What, How, Where, Who, When, Why) och olika perspektiv.",
          "Kan hjälpa till att visa vilka beskrivningar som behövs och var något saknas.",
          "Föreskriver ingen sekvens av aktiviteter, så det är ingen metodik. En metodik föreskriver steg.",
        ],
      },
      {
        heading: "TOGAF och ADM",
        points: [
          "En samlad vägledning och ett tillvägagångssätt för att utveckla och styra arkitektur.",
          "ADM hjälper arkitekten att gå från Architecture Vision via domänarkitekturerna till migrering och Implementation Governance.",
          "ADM är iterativ, inte ett stelt vattenfall, och organisationen måste anpassa arkitekturpraktiken till sina förhållanden.",
        ],
      },
      {
        heading: "Problem och effekt",
        points: [
          "Vad som går fel om rollerna blandas ihop: ramverken ses som konkurrerande, fast Zachman kan visa om beskrivningar eller perspektiv saknas medan ADM används.",
          "Ramverken kompletterar varandra: vad som ska beskrivas (Zachman) och hur arkitektur kan utvecklas och styras (TOGAF).",
          "Reservationen: det handlar om vilken roll som är primär.",
        ],
      },
    ],
    outline:
      "Inled med att ramverken har olika roller. Skriv sedan ett stycke om Zachman, ett om TOGAF och ADM och ett om problemet när rollerna blandas ihop. Avsluta med effekten och reservationen: de kompletterar varandra, och poängen är vilken roll som är primär.",
    modelAnswer: `Zachman och TOGAF används båda inom Enterprise Architecture, men de har olika roller.

Zachman är i första hand en ontology, ett klassificeringsschema för beskrivningar av en enterprise. Det ordnar beskrivningarna efter sex interrogatives – What, How, Where, Who, When och Why – och efter olika perspektiv. På så sätt kan det hjälpa arkitekten att se vilka slags beskrivningar som behövs och var en beskrivning saknas eller är ofullständig. Zachman säger däremot inte "gör det här, sedan det här". Det föreskriver ingen sekvens av aktiviteter, och därför är det missvisande att kalla det en metodik. En metodik föreskriver nämligen just aktiviteter eller steg för att nå ett mål.

TOGAF ger en samlad vägledning och ett tillvägagångssätt för att utveckla och styra Enterprise Architecture, särskilt genom ADM. ADM hjälper arkitekten att gå från Architecture Vision via domänarkitekturerna till migrering och Implementation Governance. Den är iterativ och ska inte behandlas som ett stelt vattenfall, eftersom krav och omständigheter förändras. Organisationen måste dessutom anpassa arkitekturpraktiken till sina förhållanden.

Problemet uppstår om man blandar ihop rollerna och ser ramverken som konkurrerande alternativ. Då går man miste om att Zachman kan hjälpa till att se om viktiga beskrivningar eller perspektiv saknas medan arkitekturen tas fram med ADM. En arkitektur kan till exempel beskriva How och What väl men bortse från Why och Who, och då kopplas processer och system inte till mål, ägarskap och ansvar.

Effekten av att hålla isär dem är att ramverken kan komplettera varandra i stället för att konkurrera. Zachman hjälper arkitekten att tänka på vad som behöver beskrivas och ur vilka perspektiv, medan TOGAF ger vägledning om hur arkitektur kan utvecklas och styras. Det betyder inte att TOGAF inte kan använda klassificeringar eller att Zachman saknar betydelse för arkitekturpraktiken; poängen är vilken roll som är den primära för vart och ett.`,
    tackning: {
      "ea-e4-10":
        "TOGAF ger en samlad vägledning och ett tillvägagångssätt för att utveckla och styra Enterprise Architecture, särskilt genom ADM.",
      "ea-e4-11": "Det föreskriver ingen sekvens av aktiviteter, och därför är det missvisande att kalla det en metodik.",
      "ea-e5-12":
        "Zachman hjälper arkitekten att tänka på vad som behöver beskrivas och ur vilka perspektiv, medan TOGAF ger vägledning om hur arkitektur kan utvecklas och styras.",
      "ea-e12-essay-2": "ramverken kan komplettera varandra i stället för att konkurrera",
    },
  },
  {
    id: "ea-tema-5",
    title: "ADM",
    prioritet: 3,
    fragor: ["ea-e5-11"],
    question: `Förklara ADM:s roll i Enterprise Architecture.

a) Vilken väg tar ADM, och vad ska Architecture Vision åstadkomma?
b) Varför bör ADM inte tolkas som ett stelt vattenfall?
c) Vilket problem uppstår om man behandlar TOGAF som organisationens arkitektur, och vilken effekt får det att anpassa ramverket?`,
    checklist: [
      {
        heading: "ADM:s roll",
        points: [
          "Ett strukturerat tillvägagångssätt för att utveckla, kommunicera, styra och vidareutveckla Enterprise Architecture.",
          "Syftet är att utveckla arkitekturen, inte att utveckla mjukvara.",
          "Vägen går från arkitekturvisionen via domänarkitektur, möjligheter och migrering till Implementation Governance.",
        ],
      },
      {
        heading: "Faserna och Architecture Vision",
        points: [
          "Faserna börjar med Preliminary och Architecture Vision och går via domänarkitekturerna till Implementation Governance och Architecture Change Management.",
          "Architecture Vision ska skapa en gemensam bild av den önskade riktningen och säkra lämplig uppslutning från stakeholders.",
          "Den svarar på vad man vill uppnå, varför det spelar roll och vilken riktningen är: arkitekturen börjar med syftet, inte med tekniken.",
        ],
      },
      {
        heading: "Iteration",
        points: [
          "ADM ska inte behandlas som en alltför enkel, linjär vattenfallsprocess.",
          "Arbetet anpassas efter förändrade krav, nya lärdomar och förändrade omständigheter; iteration är lärande, inte misslyckande.",
        ],
      },
      {
        heading: "Problem och effekt",
        points: [
          "Problemet: TOGAF är inte enterprisens arkitektur. Organisationen bestämmer själv sina mål, principer och sin target architecture.",
          "Effekten: organisationen anpassar arkitekturpraktiken till sina förhållanden, och arbetet får struktur utan att bli stelt.",
        ],
      },
    ],
    outline:
      "Inled med vad ADM är och vad den ska åstadkomma. Beskriv sedan ADM:s faser, vad Architecture Vision ska åstadkomma och varför ADM inte bör tolkas som ett vattenfall. Avsluta med problemet om ramverket tas för arkitekturen och effekten av att anpassa det.",
    modelAnswer: `TOGAF ger vägledning och en metod för arkitekturutveckling, särskilt genom ADM, Architecture Development Method. ADM tillhandahåller ett strukturerat tillvägagångssätt för att utveckla, kommunicera, styra och vidareutveckla Enterprise Architecture. Dess huvudsakliga syfte är alltså att utveckla arkitekturen, inte att utveckla mjukvara.

I en förenklad bild omfattar ADM Preliminary, Architecture Vision, Business Architecture, Information Systems Architectures, Technology Architecture, Opportunities and Solutions, Migration Planning, Implementation Governance och Architecture Change Management. Den hjälper alltså arkitekten att gå från förståelsen av arkitekturvisionen via domänarkitektur, möjligheter och migrering till Implementation Governance. Architecture Vision ska skapa en gemensam övergripande bild av den önskade arkitektoniska riktningen och säkra lämplig uppslutning från stakeholders. Den svarar på vad man vill uppnå, varför det spelar roll och vilken riktningen är, så arkitekturen börjar med syftet, inte med tekniken.

ADM ska ändå inte behandlas som en alltför enkel, linjär vattenfallsprocess. Den tillåter iteration och anpassning, eftersom krav och omständigheter förändras och man under arbetet lär sig mer om problemet, enterprisen och lösningen. Då kan tidigare antaganden behöva ses över. Iteration är inte ett misslyckande, utan lärande.

Problemet uppstår om man tror att ramverket är arkitekturen, till exempel att TOGAF definierar exakt den arkitektur som organisationen bör införa. TOGAF hjälper till att ta fram arkitektur, men organisationen måste själv bestämma sina mål, sina principer och sin target architecture. Två organisationer kan båda använda TOGAF och ändå ha helt olika arkitekturer.

Organisationer skiljer sig åt i storlek, governance, regelverk, arkitekturmognad, kultur, affärsmodell och förändringsbehov. Ett ramverk ger vägledning, men organisationen måste anpassa arkitekturpraktiken till sina förhållanden. Effekten är att arkitekturarbetet får struktur utan att bli stelt, och att arkitekturen utgår från organisationens egna mål i stället för från ramverket.`,
    tackning: {
      "ea-e5-11":
        "ADM tillhandahåller ett strukturerat tillvägagångssätt för att utveckla, kommunicera, styra och vidareutveckla Enterprise Architecture.",
    },
  },
  {
    id: "ea-tema-6",
    title: "Relationer, domäner och trade-offs",
    prioritet: 1,
    storEssa: "ea-e12-essay-5",
    fragor: ["ea-e6-12", "ea-e6-13", "ea-e12-essay-5"],
    question: `"Enterprise Architecture handlar om relationer och trade-offs." Diskutera.

a) Varför är arkitektoniska relationer ofta viktigare än enskilda arkitektoniska komponenter?
b) Varför är det farligt att utforma arkitekturdomäner oberoende av varandra?
c) Vilket problem uppstår om trade-offs inte görs synliga, och vilken effekt får det att göra dem explicita?`,
    checklist: [
      {
        heading: "Relationer",
        points: [
          "EA handlar om relationerna mellan mål, capabilities, processer, information, applikationer, teknik, människor och organisationsstrukturer.",
          "Relationer visar beroenden, effekter och konsekvenser av förändring.",
          "En business capability beror på processer, information, applikationer och teknik, så arkitekten kan bedöma hur en förändring sprider sig.",
        ],
      },
      {
        heading: "Domänerna",
        points: [
          "Business, Data, Application och Technology Architecture är inte oberoende silor; de är användbara just för att relationerna kan analyseras.",
          "Ett problem kan ligga i relationen mellan två domäner, som hur väl applikationerna stödjer en business capability.",
          "Oberoende domäner kan ge inkonsekvenser, dubblerade capabilities och lösningar som inte stödjer verksamhetens mål.",
        ],
      },
      {
        heading: "Trade-offs",
        points: [
          "Det finns nästan aldrig en perfekt arkitektur; besluten har sällan bara fördelar.",
          "Standardisering kan ge effektivitet men mindre flexibilitet, säkerhet kan ge friktion, centralisering kontroll men mindre lokal autonomi.",
        ],
      },
      {
        heading: "Problem och effekt",
        points: [
          "Problemet: val görs utan att det syns vad som vinns och förloras, och ett beslut kan medföra kostnader eller begränsningar på andra håll.",
          "Effekten: arkitekten hjälper stakeholders att förstå relationerna och göra trade-offs explicita, anpassade efter enterprisens mål.",
        ],
      },
    ],
    outline:
      "Inled med att Enterprise Architecture handlar om relationer och trade-offs. Visa sedan varför relationerna och domänernas beroenden spelar roll, och ge lärarens exempel på trade-offs. Avsluta med problemet när trade-offs inte syns och effekten av att göra dem explicita.",
    modelAnswer: `Enterprise Architecture handlar inte endast om enskilda komponenter utan om relationerna mellan verksamhetens mål, capabilities, processer, information, applikationer, teknik, människor och organisationsstrukturer. Den handlar också om trade-offs.

Relationerna är ofta viktigare än de enskilda komponenterna, eftersom de visar beroenden, effekter och konsekvenser av förändring. Om arkitekten förstår att en business capability beror på vissa processer, viss information, vissa applikationer och viss teknik, går det att bedöma hur en förändring sprider sig genom enterprisen. En förändring i ett element kan alltså påverka många andra.

Samma sak gäller domänerna. Business, Data, Application och Technology Architecture är inte oberoende silor; de är användbara just för att deras relationer kan analyseras. En verksamhetsförändring kan kräva förändringar i information, applikationer och teknik, och ett problem kan ligga i relationen mellan två domäner, till exempel i hur väl applikationerna stödjer en business capability. Det syns inte om man tittar på en domän i taget. Att utforma domänerna oberoende av varandra kan därför skapa inkonsekvenser, dubblerade capabilities och lösningar som inte stödjer verksamhetens mål.

Arkitektoniska beslut innebär också trade-offs, och det finns nästan aldrig en perfekt arkitektur. Ökad standardisering kan förbättra effektiviteten men minska flexibiliteten. Ökad säkerhet kan medföra friktion, och centralisering kan förbättra kontrollen men minska den lokala autonomin. Problemet uppstår om sådana val görs utan att det syns vad som vinns och vad som förloras. Eftersom delarna hänger ihop kan ett beslut då medföra kostnader eller begränsningar på andra håll som ingen har vägt mot enterprisens mål.

Effekten av att göra trade-offs explicita är att arkitekten kan hjälpa stakeholders att förstå hur delarna hänger ihop och att anpassa valen efter enterprisens mål. Då kan organisationen förändras medvetet.`,
    tackning: {
      "ea-e6-12":
        "Relationerna är ofta viktigare än de enskilda komponenterna, eftersom de visar beroenden, effekter och konsekvenser av förändring.",
      "ea-e6-13":
        "Att utforma domänerna oberoende av varandra kan därför skapa inkonsekvenser, dubblerade capabilities och lösningar som inte stödjer verksamhetens mål.",
      "ea-e12-essay-5":
        "Arkitektoniska beslut innebär också trade-offs, och det finns nästan aldrig en perfekt arkitektur.",
    },
  },
  {
    id: "ea-tema-7",
    title: "Capabilities kopplar ihop strategi, arkitektur och transformation",
    prioritet: 1,
    storEssa: "ea-e12-essay-3",
    fragor: ["ea-e7-12", "ea-e7-13", "ea-e7-26", "ea-e12-essay-3"],
    question: `Förklara hur business capabilities kan koppla samman strategi, Enterprise Architecture och digital transformation.

a) Varför är capabilities användbara i Enterprise Architecture?
b) Hur kopplar capabilities strategi till arkitektur?
c) Vilket problem uppstår om transformationen planeras utifrån avdelningar eller teknik i stället för capabilities, och vilken effekt får det att planera utifrån capabilities?`,
    checklist: [
      {
        heading: "Capabilities",
        points: [
          "En capability beskriver vad organisationen har förmåga att göra. Hur arbetet utförs beskriver i stället en process.",
          "Capabilities kan förbli relativt stabila även när organisationsstrukturer och processer förändras.",
          "De kan relateras till processer, människor, information, applikationer och teknik.",
        ],
      },
      {
        heading: "Från strategi till arkitektur",
        points: [
          "Strategin fastställer önskade resultat och prioriteringar, och av dem följer capabilities som måste finnas eller stärkas.",
          "Lärarens exempel: den enklaste banken för den som köper sin första bostad behöver digital bolåneutgivning.",
          "Arkitekten analyserar vilka människor, processer, information, applikationer och vilken teknik som behövs för att stödja eller transformera dem.",
          "Strategiska mål kan spåras till arkitektur- och investeringsbeslut, så capabilities blir en brygga.",
        ],
      },
      {
        heading: "Digital transformation",
        points: [
          "Transformationen innebär ofta att capabilities förändras eller att nya skapas.",
          "Teknik ensam utgör inte transformation.",
          "Capability-baserad analys hjälper till att prioritera investeringar efter affärsvärde snarare än att bara välja tekniker.",
        ],
      },
      {
        heading: "Problem och effekt",
        points: [
          "Problemet: planen vilar på tillfälliga organisationsstrukturer, som marknadsavdelningen som omorganiseras tre gånger på fem år.",
          "Effekten: det går att identifiera capability gaps och prioritera transformationen oberoende av nuvarande organisatoriska gränser.",
        ],
      },
    ],
    outline:
      "Inled med vad en capability är och varför den är användbar, och visa kedjan från strategi via capabilities till arkitektur med bankens exempel. Skriv sedan vad digital transformation gör med capabilities och vilket problem det blir att planera utifrån avdelningar eller teknik. Avsluta med effekten av att planera utifrån capabilities.",
    modelAnswer: `Business capabilities beskriver vad en enterprise har förmåga att göra, inte hur arbetet utförs. Capabilities är användbara i Enterprise Architecture eftersom de ger ett stabilt sätt att uttrycka vad en organisation måste kunna göra för att nå sina mål. Därför kan de länka samman strategi, Enterprise Architecture och digital transformation.

Strategin fastställer enterprisens riktning, önskade resultat och prioriteringar. Av dem följer capabilities som enterprisen måste ha eller stärka. Capabilities översätter alltså strategisk avsikt till de förmågor som enterprisen behöver för att nå sina mål. En bank som vill bli den enklaste banken för den som köper sin första bostad behöver till exempel en capability som digital bolåneutgivning.

Capabilities kan relateras till processer, människor, information, applikationer och teknik. När strategins prioriteringar är översatta till capabilities kan arkitekten därför analysera vilka av dessa delar som krävs för att stödja eller transformera varje capability. Strategiska mål kan på så sätt spåras till arkitektur- och investeringsbeslut, och capabilities blir en brygga mellan strategisk avsikt och arkitekturförändring.

Digital transformation innebär ofta att capabilities förändras eller att nya skapas. Problemet uppstår om transformationen planeras utifrån avdelningar eller drivs av teknikmode i stället för utifrån capabilities. Då vilar planen på tillfälliga organisationsstrukturer: ett företag kan omorganisera sin marknadsavdelning tre gånger på fem år men hela tiden behöva kundinsikt, kampanjhantering och marknadsanalys. Teknik ensam utgör inte heller transformation, eftersom tekniken i sig inte nödvändigtvis förändrar hur enterprisen skapar eller levererar värde.

Effekten av att planera utifrån capabilities är att planen vilar på något som kan förbli relativt stabilt även när organisationsstrukturer och processer förändras. Enterprisen kan då identifiera capability gaps och prioritera transformationen oberoende av nuvarande organisatoriska gränser. Capability-baserad analys hjälper också organisationen att prioritera investeringar efter affärsvärde snarare än att bara välja tekniker.`,
    tackning: {
      "ea-e7-12":
        "Capabilities är användbara i Enterprise Architecture eftersom de ger ett stabilt sätt att uttrycka vad en organisation måste kunna göra för att nå sina mål.",
      "ea-e7-13": "Av dem följer capabilities som enterprisen måste ha eller stärka.",
      "ea-e7-26":
        "Capabilities översätter alltså strategisk avsikt till de förmågor som enterprisen behöver för att nå sina mål.",
      "ea-e12-essay-3": "Digital transformation innebär ofta att capabilities förändras eller att nya skapas.",
    },
  },
  {
    id: "ea-tema-8",
    title: "Principer, governance och agilitet",
    prioritet: 1,
    storEssa: "ea-e12-essay-4",
    fragor: ["ea-e7-27", "ea-e8-8", "ea-e9-10", "ea-e12-essay-4", "ea-e12-scenario-3"],
    question: `Förklara varför governance för arkitektur bör utformas för att stödja snarare än förhindra agilitet.

a) Hur kan architecture principles öka agiliteten?
b) Ett produktteam säger: "Vi är Agile. Arkitekturgodkännanden saktar ner oss. Vi vill inte ha med arkitekter." Hur bör Enterprise Architecten svara?
c) Vilket problem uppstår om varje arkitekturbeslut kräver centralt godkännande, och vilken effekt får principer och guardrails?`,
    checklist: [
      {
        heading: "Varför governance behövs",
        points: [
          "Governance svarar på vem som har befogenhet att fatta vilka beslut, under vilka begränsningar.",
          "Den upprätthåller sammanhållning, hanterar risker och ser till att viktiga beslut stödjer strategiska mål.",
          "Governance betyder inte nödvändigtvis att varje beslut måste godkännas centralt.",
        ],
      },
      {
        heading: "Principer och guardrails",
        points: [
          "En princip som doktrin: ett bestående värde som enterprisen står bakom, till exempel \"Information är en tillgång för hela enterprisen\".",
          "Principer ger återanvändbar vägledning: team kan fatta många beslut utan att be om godkännande, så länge de håller sig inom de överenskomna gränserna.",
          "Principer kan fungera som guardrails: skyddsräcken för vad som är tillåtet. Därför kan principer öka agiliteten.",
        ],
      },
      {
        heading: "Arkitektens svar till teamet",
        points: [
          "Avgöra vilka beslut som kräver samordning på enterprise-nivå och vilka som kan delegeras.",
          "Ge principer, standarder, guardrails, återanvändbara capabilities, referensarkitekturer och decision rights.",
          "Rikta uppmärksamheten mot betydande risker, beroenden och strategiska beslut, och låta arkitekturen utvecklas med lärandet.",
        ],
      },
      {
        heading: "Problem och effekt",
        points: [
          "Problemet: för mycket centralt godkännande kan sakta ner leveransen och hindra team från att snabbt svara på förändrade omständigheter.",
          "Effekten: governance kan ge både enhetlighet och autonomi, alltså agilitet medan sammanhållningen bevaras och systemrisker hanteras.",
        ],
      },
    ],
    outline:
      "Inled med varför governance behövs och vad den svarar på. Beskriv sedan problemet med centralt godkännande och hur arkitekten svarar teamet. Förklara principer som doktrin och guardrails som skyddsräcken, och avsluta med effekten: både enhetlighet och autonomi.",
    modelAnswer: `Organisationer behöver governance för arkitektur för att upprätthålla sammanhållning, hantera risker och säkerställa att viktiga arkitekturbeslut stödjer strategiska mål. Governance svarar på frågan vem som har befogenhet att fatta vilka beslut, under vilka begränsningar. Det betyder inte nödvändigtvis att varje arkitekturbeslut måste godkännas centralt.

Problemet är att alltför mycket centralt godkännande kan sakta ner leveransen och hindra team från att snabbt svara på förändrade omständigheter. När ett produktteam säger att arkitekturgodkännanden saktar ner dem är lösningen ändå inte att ta bort arkitekturen, eftersom också en Agile-organisation behöver sammanhållning, principer, riktning och hantering av betydande beroenden och risker. Arkitekten bör i stället avgöra vilka beslut som verkligen kräver samordning på enterprise-nivå och vilka som kan delegeras.

En architecture principle, till exempel "Information är en tillgång för hela enterprisen", kan ses som en doktrin: ett mer bestående värde som enterprisen står bakom, även när annat förändras. Tydliga principer ger återanvändbar vägledning för beslut. Principerna kan fungera som guardrails, skyddsräcken som anger vad som är tillåtet. Inom dem kan teamen fatta många beslut själva utan att be om godkännande varje gång, och därför kan principer öka agiliteten: de kan öka både enhetligheten och beslutshastigheten.

Effektiv governance fastställer därför principer, decision rights, guardrails och eskaleringsmekanismer. Rutinbeslut kan delegeras, medan beslut med betydande konsekvenser för hela enterprisen kan få lämplig arkitektonisk tillsyn. I stället för att kräva centralt godkännande av varje beslut kan governance rikta uppmärksamheten mot betydande risker, beroenden tvärs över enterprisen och strategiska beslut. Enterprise Architecture bör ge riktning, principer, standarder, referensarkitekturer, återanvändbara capabilities och guardrails, och arkitekturen bör utvecklas med lärandet.

Effekten är att governance kan ge både enhetlighet och autonomi. Teamen kan röra sig snabbt inom guardrails, och det möjliggör agilitet samtidigt som sammanhållningen bevaras och systemrisker hanteras. God governance bör alltså möjliggöra agilitet, inte begränsa den i onödan.`,
    tackning: {
      "ea-e7-27":
        "I stället för att kräva centralt godkännande av varje beslut kan governance rikta uppmärksamheten mot betydande risker, beroenden tvärs över enterprisen och strategiska beslut.",
      "ea-e8-8": "Tydliga principer ger återanvändbar vägledning för beslut.",
      "ea-e9-10":
        "Enterprise Architecture bör ge riktning, principer, standarder, referensarkitekturer, återanvändbara capabilities och guardrails, och arkitekturen bör utvecklas med lärandet.",
      "ea-e12-essay-4":
        "Rutinbeslut kan delegeras, medan beslut med betydande konsekvenser för hela enterprisen kan få lämplig arkitektonisk tillsyn.",
      "ea-e12-scenario-3":
        "Arkitekten bör i stället avgöra vilka beslut som verkligen kräver samordning på enterprise-nivå och vilka som kan delegeras.",
    },
  },
  {
    id: "ea-tema-9",
    title: "Digital transformation",
    prioritet: 2,
    fragor: ["ea-e10-9", "ea-e10-10", "ea-e12-scenario-5"],
    question: `Varför bör digital transformation behandlas som en concern för Enterprise Architecture?

a) Förklara skillnaden mellan digitization, digitalization och digital transformation.
b) En detaljhandlare har lanserat en mobilapp och säger: "Vi har slutfört vår digital transformation." Vad bör arkitekten undersöka?
c) Vilket problem uppstår om transformationen behandlas som en teknikfråga, och vilken effekt får ett arkitektoniskt perspektiv?`,
    checklist: [
      {
        heading: "Tre begrepp",
        points: [
          "Digitization: analog information blir digital, till exempel när pappersdokument skannas.",
          "Digitalization: digital teknik förbättrar befintliga processer, till exempel ett automatiserat befintligt godkännandeflöde.",
          "Digital transformation: grundläggande förändring i hur enterprisen skapar och levererar värde.",
        ],
      },
      {
        heading: "Varför det är en concern för EA",
        points: [
          "Transformationen kan påverka affärsmodeller, capabilities, value streams, organisationsstrukturer, information, applikationer och teknik.",
          "Förändringarna hänger ihop och kräver ett perspektiv över hela enterprisen, inte ett isolerat teknikinitiativ.",
        ],
      },
      {
        heading: "Mobilappen",
        points: [
          "Fråga om appen har förändrat hur värde skapas och levereras: kundupplevelse, operating model, affärsmodell, processer.",
          "Att bara lägga till en digital kanal kan vara digitalization snarare än bredare digital transformation.",
        ],
      },
      {
        heading: "Problem och effekt",
        points: [
          "Problemet: teknik ensam utgör inte transformation, och organisationen kan tro att den är klar fast värdet skapas som förut.",
          "Effekten: initiativet drivs av affärsresultat, och capability-baserad analys hjälper till att prioritera investeringar efter affärsvärde.",
        ],
      },
    ],
    outline:
      "Inled med de tre begreppen och lärarens exempel. Förklara sedan varför transformationen är en concern för Enterprise Architecture och pröva mobilappen mot det. Avsluta med problemet när transformationen ses som teknik och effekten av ett arkitektoniskt perspektiv.",
    modelAnswer: `Digitization omvandlar analog information till digital form, till exempel när pappersdokument skannas. Digitalization använder digital teknik för att förbättra befintliga processer eller aktiviteter, till exempel genom att automatisera ett befintligt godkännandeflöde. Digital transformation är bredare och innebär grundläggande förändringar i hur enterprisen skapar och levererar värde.

Digital transformation kan påverka affärsmodeller, capabilities, value streams, organisationsstrukturer, information, applikationer och teknik. Ofta förändras capabilities eller skapas nya, och transformationen kan ge digitala ekosystem som sträcker sig utanför organisationens gränser. Eftersom dessa förändringar hänger ihop kräver de ett arkitektoniskt perspektiv över hela enterprisen snarare än ett isolerat teknikinitiativ. Därför är digital transformation en concern för Enterprise Architecture.

När en detaljhandlare säger att den har slutfört sin digital transformation genom att lansera en mobilapp, bör arkitekten fråga om appen har förändrat hur enterprisen skapar och levererar värde. Har kundupplevelsen, operating modeln eller affärsmodellen förändrats? Har nya produkter, tjänster eller digitala ekosystem skapats, och är processerna i grunden annorlunda? Att bara lägga till en digital kanal kan vara digitalization snarare än bredare digital transformation.

Problemet uppstår om transformationen behandlas som en teknikfråga. Teknik ensam utgör inte transformation: tekniken är en viktig enabler, men den är inte transformationen själv. En molnmigrering är därför inte automatiskt digital transformation. Organisationen kan då tro att den är klar, som detaljhandlaren med mobilappen, fast sättet att skapa och leverera värde inte har förändrats.

Effekten av ett arkitektoniskt perspektiv är att initiativet drivs av ett tydligt förstått affärsresultat och strategiskt mål, inte av teknikmode eller leverantörers marknadsföring. Capability-baserad analys blir då en brygga mellan strategisk avsikt och arkitektonisk implementering och hjälper organisationen att prioritera investeringar efter affärsvärde snarare än att bara välja tekniker.`,
    tackning: {
      "ea-e10-9":
        "Digital transformation är bredare och innebär grundläggande förändringar i hur enterprisen skapar och levererar värde.",
      "ea-e10-10":
        "Eftersom dessa förändringar hänger ihop kräver de ett arkitektoniskt perspektiv över hela enterprisen snarare än ett isolerat teknikinitiativ.",
      "ea-e12-scenario-5":
        "Att bara lägga till en digital kanal kan vara digitalization snarare än bredare digital transformation.",
    },
  },
  {
    id: "ea-tema-10",
    title: "Börja i problemet, inte i tekniken",
    prioritet: 2,
    fragor: [
      "ea-e9-tankande",
      "ea-e11-7",
      "ea-e11-8",
      "ea-e12-scenario-1",
      "ea-e12-scenario-2",
      "ea-e12-slututmaning",
    ],
    question: `Ett företag säger: "Vårt företag behöver ett nytt CRM eftersom våra konkurrenter har bättre CRM-system." Du har utsetts till Enterprise Architect. Vad gör du?

a) Vad är ett arkitektoniskt antimönster här, och vad bör arkitekten fråga innan teknik väljs?
b) VD:n säger: "Vårt problem är att vi har för många applikationer." Vilka frågor ställer du innan du accepterar diagnosen?
c) Vilket problem uppstår om man börjar i tekniken, och vilken effekt får det att börja i syfte och resultat?`,
    checklist: [
      {
        heading: "Börja i problemet",
        points: [
          "Svara inte \"låt oss utvärdera CRM-produkter\"; fråga vilket affärsproblem och vilket strategiskt mål som driver önskemålet.",
          "Antimönstret: att välja en teknikplattform innan mål, capabilities och arkitektoniska begränsningar är fastställda.",
          "Fastställ först strategiska mål, kundresultat, capabilities, begränsningar, stakeholders concerns och principer.",
        ],
      },
      {
        heading: "Frågorna arkitekten ställer",
        points: [
          "Kundresan i dag, capability gaps och vilken information och vilka processer som berörs.",
          "Alternativ, trade-offs, en realistisk övergång och hur förändringen ska styras.",
        ],
      },
      {
        heading: "Lärarens andra fall",
        points: [
          "AI-strategin: förstå vilka affärsmål och problem AI ska lösa innan specifika AI-tekniker utvärderas.",
          "För många applikationer: antalet är inte i sig ett arkitektoniskt problem. Undersök capabilities, avsiktlig dubblering, kostnader, risker, affärsresultat och strategiskt mål.",
        ],
      },
      {
        heading: "Problem och effekt",
        points: [
          "Problemet: man hoppar från ett observerat symptom till en teknisk lösning, som inte nödvändigtvis löser det verkliga problemet.",
          "Effekten: lösningen kopplas till syfte och resultat. Arkitektens test: varför, vad, vem, hur och vilka konsekvenserna blir.",
        ],
      },
    ],
    outline:
      "Inled med hur arkitekten svarar på CRM-påståendet. Visa sedan antimönstret, frågorna före teknikvalet och fallet med för många applikationer. Avsluta med problemet när man börjar i tekniken och effekten av att börja i syfte och resultat, med AI-fallet som exempel.",
    modelAnswer: `En Enterprise Architect bör inte genast svara: "Låt oss utvärdera CRM-produkter." Arkitekten börjar i stället i problemet och frågar vilket affärsproblem som ska lösas och vilket strategiskt mål som driver önskemålet.

Att välja en teknikplattform innan verksamhetens mål, de capabilities som krävs och de arkitektoniska begränsningarna har fastställts är ett arkitektoniskt antimönster. Innan tekniken utvärderas bör arkitekten därför fastställa de strategiska målen, önskade kundresultat, de capabilities som krävs, nuvarande begränsningar, stakeholders concerns och arkitektoniska principer. För CRM-frågan betyder det att fråga hur kundresan ser ut i dag, var capability gaps finns, vilken information och vilka processer som berörs, vilka alternativ och trade-offs som finns, vilken övergång som är realistisk och hur förändringen ska styras.

Samma hållning gäller när ledningen säger att problemet är för många applikationer, eller vill minska dem från 600 till 300. Antalet applikationer är inte i sig ett arkitektoniskt problem. Innan diagnosen accepteras undersöker arkitekten vilka capabilities applikationerna stödjer, om dubbleringen är avsiktlig, vilken information som dubbleras, vilka kostnader och risker som finns, vilka affärsresultat som påverkas och vilket strategiskt mål som ligger bakom. Arkitektur bör hantera problem och resultat, inte godtyckliga siffror.

Problemet med att börja i tekniken är att man hoppar från ett observerat symptom till en teknisk lösning. Ett nytt system eller färre applikationer löser då inte nödvändigtvis det som faktiskt påverkar affärsresultatet.

Effekten av att börja i syfte och resultat är att lösningen kopplas till det enterprisen behöver kunna göra. Det gäller också när en VD kräver en AI-strategi för att konkurrenterna använder AI: arkitekten bör först förstå vilka affärsmål och problem AI förväntas lösa. Först när affärsbehovet har fastställts bör specifika AI-tekniker utvärderas. Arkitektens test sammanfattar hållningen: varför, vad, vem, hur och vilka konsekvenserna blir.`,
    tackning: {
      "ea-e9-tankande":
        "Innan diagnosen accepteras undersöker arkitekten vilka capabilities applikationerna stödjer, om dubbleringen är avsiktlig, vilken information som dubbleras, vilka kostnader och risker som finns, vilka affärsresultat som påverkas och vilket strategiskt mål som ligger bakom.",
      "ea-e11-7":
        "Att välja en teknikplattform innan verksamhetens mål, de capabilities som krävs och de arkitektoniska begränsningarna har fastställts är ett arkitektoniskt antimönster.",
      "ea-e11-8":
        "Innan tekniken utvärderas bör arkitekten därför fastställa de strategiska målen, önskade kundresultat, de capabilities som krävs, nuvarande begränsningar, stakeholders concerns och arkitektoniska principer.",
      "ea-e12-scenario-1":
        "Först när affärsbehovet har fastställts bör specifika AI-tekniker utvärderas.",
      "ea-e12-scenario-2":
        "Antalet applikationer är inte i sig ett arkitektoniskt problem.",
      "ea-e12-slututmaning":
        "Arkitekten börjar i stället i problemet och frågar vilket affärsproblem som ska lösas och vilket strategiskt mål som driver önskemålet.",
    },
  },
  {
    id: "ea-tema-11",
    title: "Från nuläge till målbild: bankfallet",
    prioritet: 2,
    fragor: ["ea-e11-3", "ea-e11-8b", "ea-e11-9", "ea-e11-10", "ea-e12-scenario-4"],
    question: `En traditionell bank har flera kunddatabaser, en 25 år gammal kärnbanksplattform, fristående digitala kanaler, långsamma releasecykler, många dubblerade applikationer och ökande konkurrens från digitala banker. VD:n säger: "Vi behöver bli en digital bank inom två år." Utveckla ett arkitektoniskt tillvägagångssätt för banken.

a) Varför kan det vara riskabelt att genast ersätta hela kärnbankssystemet, och varför är transition architectures viktiga?
b) Hur skulle Agile kunna påverka transformationen?
c) Ledningen säger: "Systemet är gammalt, så det måste ersättas." Vilket problem har det resonemanget, och vilken effekt får ett evidensbaserat beslut?`,
    checklist: [
      {
        heading: "Börja i målet och nuläget",
        points: [
          "VD:ns mål är strategiskt: klargör strategiska mål och önskade kundresultat först.",
          "Bedöm baseline: capabilities, value streams, information, applikationer och teknik.",
          "Fallets problem: fragmenterad kundinformation, legacyberoenden, kanalsilor och långsamma releaser.",
        ],
      },
      {
        heading: "Target och transition",
        points: [
          "Target architecture ger en sammanhållen riktning med stöd av principer och governance, ingen perfekt förutsägelse.",
          "Principen: kundinformation är en tillgång för hela enterprisen.",
          "Transition architectures är praktiska mellanlägen medan verksamheten fortsätter och värde levereras.",
          "Prioritera initiativ efter affärsvärde, risk och beroenden.",
        ],
      },
      {
        heading: "Big bang och Agile",
        points: [
          "En big bang-ersättning kan ge stora operativa, ekonomiska och affärsmässiga risker, eftersom kärnsystemet stödjer kritiska capabilities.",
          "Agile: inkrementella produkter och capabilities, arkitekturen utvecklas med leveransen, och värde levereras tidigare.",
        ],
      },
      {
        heading: "Problem och effekt",
        points: [
          "Problemet: ålder ensam är inget tillräckligt skäl, och etiketten \"legacy\" ska inte styra beslutet.",
          "Effekten: ett evidensbaserat beslut som kan bli ersättning, inkapsling, modernisering, avveckling eller fortsatt användning.",
        ],
      },
    ],
    outline:
      "Inled med fallet och att målet är strategiskt. Beskriv sedan vägen från baseline via transition architectures till target, varför en big bang är riskabel och hur Agile påverkar. Avsluta med problemet med att ersätta system för att de är gamla och effekten av evidensbaserade beslut.",
    modelAnswer: `Banken har fragmenterad kundinformation i flera databaser, en gammal kärnbanksplattform, kanalsilor och långsamma releaser. VD:ns mål att bli en digital bank inom två år är strategiskt, så arkitekten bör börja i målet och inte i tekniken.

Banken bör först klargöra sina strategiska mål och önskade kundresultat. Den bör sedan bedöma baseline, alltså de relevanta delarna av nuläget: capabilities, value streams, information, applikationer och teknik. En target architecture bör fastställa den önskade riktningen, med stöd av arkitektoniska principer och governance, till exempel principen att kundinformation är en tillgång för hela enterprisen, i stället för att varje avdelning äger sin egen kunddefinition. Target architecture är ingen perfekt förutsägelse av varje framtida detalj.

I stället för att ersätta alla legacysystem samtidigt bör banken identifiera transition architectures och prioritera initiativ efter affärsvärde, risk och beroenden. Kärnsystemet kan stödja kritiska business capabilities och innehålla komplexa beroenden, så en "big bang"-ersättning skulle kunna skapa stora operativa, ekonomiska och affärsmässiga risker. Transition architectures ger praktiska mellanlägen som gör att banken kan gå från baseline mot target samtidigt som verksamheten fortsätter och värde levereras.

Agile-leverans kan användas för att utveckla capabilities inkrementellt. Transformationen kan organiseras kring inkrementella produkter och capabilities, där arkitekturen utvecklas parallellt med leveransen genom feedback och lärande. Banken kan då lära sig, leverera värde tidigare och justera arkitektoniska beslut allteftersom ny information blir tillgänglig.

Ålder ensam är inte ett tillräckligt arkitektoniskt skäl att ersätta kärnsystemet. Om banken ersätter det bara för att det är gammalt styr etiketten "legacy" beslutet. Ett tekniskt gammalt system kan fortfarande vara värdefullt och stabilt, och ett nyare system kan skapa betydande arkitektonisk risk. Effekten av att i stället bedöma affärsvärde, verksamhetskritikalitet, teknisk hälsa, säkerhet, kostnad och strategisk riktning är ett evidensbaserat beslut, som beroende på omständigheterna kan bli ersättning, inkapsling, modernisering, avveckling eller fortsatt användning.`,
    tackning: {
      "ea-e11-3":
        "Kärnsystemet kan stödja kritiska business capabilities och innehålla komplexa beroenden, så en \"big bang\"-ersättning skulle kunna skapa stora operativa, ekonomiska och affärsmässiga risker.",
      "ea-e11-8b":
        "Transition architectures ger praktiska mellanlägen som gör att banken kan gå från baseline mot target samtidigt som verksamheten fortsätter och värde levereras.",
      "ea-e11-9":
        "I stället för att ersätta alla legacysystem samtidigt bör banken identifiera transition architectures och prioritera initiativ efter affärsvärde, risk och beroenden.",
      "ea-e11-10":
        "Transformationen kan organiseras kring inkrementella produkter och capabilities, där arkitekturen utvecklas parallellt med leveransen genom feedback och lärande.",
      "ea-e12-scenario-4":
        "Ett tekniskt gammalt system kan fortfarande vara värdefullt och stabilt, och ett nyare system kan skapa betydande arkitektonisk risk.",
    },
  },
];

// Lärarens fritextfrågor i modulerna, med modulnummer.
const FRITEXT = new Map(
  MODULER.flatMap((modul) =>
    modul.blocks
      .filter((block) => block.kind === "fritext")
      .map((block) => [block.id, { ...block, modul: modul.number }]),
  ),
);

const sv = (value) => (typeof value === "string" ? value : value?.sv ?? "");

// Frågans namn i modulen: "essä 10", "scenario 3", "fråga 8" (fallet i
// modul 11), "den slutliga utmaningen" eller titeln.
function namn(block) {
  const title = sv(block.title);
  if (block.typ === "fall") return { slag: "fråga", nr: block.nr };
  if (block.typ === "essa") {
    const nr = block.nr || title.match(/\d+/)?.[0];
    return nr ? { slag: "essä", nr } : { text: "essän utan nummer" };
  }
  if (block.typ === "scenario") {
    const nr = title.match(/^Scenario (\d+)/)?.[1];
    return nr ? { slag: "scenario", nr } : { text: `den ${title.toLowerCase().replace(/^slutlig /, "slutliga ")}en` };
  }
  return { text: title };
}

const lista = (items) =>
  items.length <= 1 ? items.join("") : `${items.slice(0, -1).join(", ")} och ${items.at(-1)}`;

const ANTAL = ["noll", "en", "två", "tre", "fyra", "fem", "sex"];

// "Läraren frågar om detta i 4 frågor: modul 4 essä 10 och 11, modul 5 essä 12, modul 12 essä 2"
export function temaKontext(fragor) {
  const moduler = [];
  for (const id of fragor) {
    const block = FRITEXT.get(id);
    let modul = moduler.find((item) => item.nr === block.modul);
    if (!modul) moduler.push((modul = { nr: block.modul, delar: [] }));
    const n = namn(block);
    const slag = n.slag && modul.delar.find((del) => del.slag === n.slag);
    if (slag) slag.nr.push(n.nr);
    else modul.delar.push(n.slag ? { slag: n.slag, nr: [n.nr] } : { text: n.text });
  }
  const delar = moduler.map(
    (modul) =>
      `modul ${modul.nr} ${lista(modul.delar.map((del) => del.text ?? `${del.slag} ${lista(del.nr)}`))}`,
  );
  const antal = fragor.length === 1 ? "en fråga" : `${ANTAL[fragor.length] ?? fragor.length} frågor`;
  return `Läraren frågar om detta i ${antal}: ${delar.join(", ")}.`;
}

// Lärarens korta svar: frågan och hans svenska modellsvar ur modulfilen.
function larareSvar(id) {
  const block = FRITEXT.get(id);
  const n = namn(block);
  return {
    id,
    label: `Modul ${block.modul} · ${n.text ?? `${n.slag} ${n.nr}`}`,
    question: sv(block.question),
    modelAnswer: sv(block.modelAnswer),
    keyLesson: block.keyLesson ? sv(block.keyLesson) : null,
  };
}

// Prioriteringen i fliken Essä (Kaspers beslut 26 nov). Grupp 1, "Prioritera
// först", är de fem temana med en av modul 12:s stora essäer (`storEssa`),
// som läraren skrev inför examinationen och som knyter ihop flera moduler.
// Grupp 2 har modul 12:s scenarier, grupp 3 gäller bara en modul var. `prioritet`
// ger gruppen och listan ordningen inom gruppen.
const ORDNING = [
  "ea-tema-4", "ea-tema-7", "ea-tema-8", "ea-tema-3", "ea-tema-6",
  "ea-tema-9", "ea-tema-10", "ea-tema-11",
  "ea-tema-1", "ea-tema-2", "ea-tema-5",
];

// Temana som visas i fliken Essä: de som är skrivna, i prioritetsordning.
export const essaTeman = TEMAN.filter((tema) => tema.modelAnswer)
  .sort((a, b) => ORDNING.indexOf(a.id) - ORDNING.indexOf(b.id))
  .map((tema) => ({
  ...tema,
  context: temaKontext(tema.fragor),
  modelAnswerLabel: "Utvecklat modellsvar",
  modelAnswerLang: "sv",
  ufAnswers: tema.fragor.map(larareSvar),
}));
