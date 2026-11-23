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
// `context` och "Lärarens korta svar" (`ufAnswers`) byggs nedan ur
// modulfilerna, så att lärarens modellsvar aldrig skrivs två gånger.
// `arkitekturEssays` i essays.js ligger kvar i repot men visas inte.
import { MODULER } from "./moduler/index.js";

export const TEMAN = [
  {
    id: "ea-tema-1",
    title: "Enterprise och avgränsning",
    fragor: ["ea-e1-10"],
  },
  {
    id: "ea-tema-2",
    title: "Arkitektur är mer än komponenter",
    fragor: ["ea-e2-x", "ea-e2-11"],
  },
  {
    id: "ea-tema-3",
    title: "EA: mer än IT, en brygga från strategi till förändring",
    fragor: ["ea-e3-10", "ea-e3-11", "ea-e12-essay-1"],
  },
  {
    id: "ea-tema-4",
    title: "Zachman och TOGAF",
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
    fragor: ["ea-e5-11"],
  },
  {
    id: "ea-tema-6",
    title: "Relationer, domäner och trade-offs",
    fragor: ["ea-e6-12", "ea-e6-13", "ea-e12-essay-5"],
  },
  {
    id: "ea-tema-7",
    title: "Capabilities kopplar ihop strategi, arkitektur och transformation",
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
    fragor: ["ea-e10-9", "ea-e10-10", "ea-e12-scenario-5"],
  },
  {
    id: "ea-tema-10",
    title: "Börja i problemet, inte i tekniken",
    fragor: [
      "ea-e9-tankande",
      "ea-e11-7",
      "ea-e11-8",
      "ea-e12-scenario-1",
      "ea-e12-scenario-2",
      "ea-e12-slututmaning",
    ],
  },
  {
    id: "ea-tema-11",
    title: "Från nuläge till målbild: bankfallet",
    fragor: ["ea-e11-3", "ea-e11-8b", "ea-e11-9", "ea-e11-10", "ea-e12-scenario-4"],
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

// Temana som visas i fliken Essä: de som är skrivna, i temaordning.
export const essaTeman = TEMAN.filter((tema) => tema.modelAnswer).map((tema) => ({
  ...tema,
  context: temaKontext(tema.fragor),
  modelAnswerLabel: "Utvecklat modellsvar",
  modelAnswerLang: "sv",
  ufAnswers: tema.fragor.map(larareSvar),
}));
