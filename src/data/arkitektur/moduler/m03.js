// Modul 3 i fliken Moduler (modul-1-4.pdf), översatt. Se m01.js för formen.
export default {
  id: "kap3",
  number: 3,
  title: { sv: "Vad är Enterprise Architecture?", en: "What Is Enterprise Architecture?" },
  blocks: [
    {
      kind: "text",
      id: "m3-t1",
      sv: `## Lärandemål

Efter den här modulen ska du kunna:

- Definiera Enterprise Architecture.
- Skilja Enterprise Architecture från IT architecture.
- Förklara hur Enterprise Architecture hänger ihop med strategi.
- Förklara varför Enterprise Architecture möjliggör förändring.`,
      en: `## Learning objectives

Students should be able to:

- Define Enterprise Architecture.
- Distinguish Enterprise Architecture from IT architecture.
- Explain its relationship to strategy.
- Explain why Enterprise Architecture enables change.`,
    },
    {
      kind: "text",
      id: "m3-t2",
      sv: `## Kärndefinition

Enterprise Architecture är praktiken att förstå, utforma, kommunicera och styra den grundläggande strukturen och utvecklingen hos en enterprise för att nå dess mål. Enterprise Architecture kopplar alltså verksamhetens mål till enterprisens struktur och utveckling.

### Inte "vilken teknik ska vi köpa?"

Den viktiga frågan är inte: "Vilken teknik ska vi köpa?" Den är: "Vad behöver enterprisen få förmåga att göra, och vilka förändringar är nödvändiga för att nå dess mål?"

Därför bör stora arkitekturbeslut normalt styras av verksamhetens mål och stakeholders concerns. Tekniken kan vara en del av svaret, men den är inte nödvändigtvis utgångspunkten. Enterprise Architecture handlar alltså inte i första hand om teknik.

### Enterprise Architecture och IT architecture

IT architecture frågar: "Hur ska vår teknik vara strukturerad?" Den fokuserar i första hand på informationsteknikens strukturer och lösningar.

Enterprise Architecture frågar: "Hur ska enterprisen utvecklas så att den kan nå sina mål?" Den har en bredare avgränsning som omfattar hela enterprisen: affärsstrategi, capabilities, organisation, information, applikationer, teknik och relationerna mellan dem. IT architecture kan därför ses som en del av det bredare Enterprise Architecture-landskapet.

### En brygga mellan strategi och förändring

En enterprise måste ständigt anpassa sig till strategi, marknader, teknik och andra förändringar i omvärlden. Därför handlar Enterprise Architecture om förändring. Arkitekturen finns inte i första hand för att bevara nuläget.

Enterprise Architecture översätter strategiska mål till konsekvenser för arkitekturen. Strategin identifierar de resultat man vill nå. Arkitekturen identifierar de capabilities, strukturer, den information, de applikationer, den teknik och de organisationsförändringar som krävs för att nå dem. Arkitekturen blir på så sätt en brygga mellan strategisk avsikt och implementering, och den kan koppla strategi till organisatorisk förändring.

Arkitektur finns för att stödja enterprisens mål. Utan att förstå strategin kan arkitekten inte avgöra vilka capabilities som behöver utvecklas, förändras eller skyddas, och arkitekturbeslut kan inte bedömas mot verksamhetens prioriteringar.

Ett exempel är strategin "Bli den enklaste banken för den som köper sin första bostad". Den capability det gäller är digital bolåneutgivning. Arkitekturen anger de processer, den information, de applikationer, den teknik och de organisatoriska capabilities som krävs.

Därför kan Enterprise Architecture stödja beslutsfattande, transformation och governance. Den är mer än dokumentation eller en förteckning över IT-system, och den handlar inte i första hand om att dokumentera IT-system. Att en organisation har fin dokumentation av sina system betyder inte nödvändigtvis att den har en Enterprise Architecture som fungerar. Dokumentation av nuläget är användbar, men arkitekturen blir strategiskt värdefull när den förståelsen används för att fatta beslut om framtida lägen och övergångar. Enterprise Architecture identifierar då gap, beroenden, risker och möjligheter. I en miljö som präglas av digital transformation och ständig förändring behöver arkitekturen själv utvecklas i stället för att bli en statisk dokumentationsövning.`,
      en: `## Core definition

Enterprise Architecture is the practice of understanding, designing, communicating and governing the fundamental structure and evolution of an enterprise to achieve its objectives.

Important distinction: the key question is not: "What technology should we buy?"

It is: "What does the enterprise need to become capable of doing, and what changes are necessary to achieve its objectives?"

IT architecture asks: "How should our technology be structured?"

Enterprise Architecture asks: "How should the enterprise evolve so that it can achieve its objectives?", but as often the case - Technology may be part of the answer.`,
    },
    { kind: "text", id: "m3-t3", sv: "## Flervalsfrågor", en: "## Question -multiple choice" },
    {
      kind: "fraga",
      id: "ea-m3-1",
      nr: "1",
      question: "Vilken är den BÄSTA beskrivningen av Enterprise Architecture?",
      options: [
        "Att leda IT-avdelningen",
        "Att utforma mjukvaruapplikationer",
        "Att koppla verksamhetens mål till enterprisens struktur och utveckling",
        "Att köpa teknik",
        "Att leda projekt",
      ],
      explanation:
        "Enterprise Architecture är praktiken att förstå, utforma, kommunicera och styra den grundläggande strukturen och utvecklingen hos en enterprise för att nå dess mål. Nyckelfrågan är vad enterprisen behöver få förmåga att göra, inte vilken teknik som ska köpas.",
    },
    {
      kind: "fraga",
      id: "ea-m3-2",
      nr: "2",
      question: "Vilket påstående skiljer bäst Enterprise Architecture från IT architecture?",
      options: [
        "Enterprise Architecture har en bredare avgränsning som omfattar hela enterprisen.",
        "IT architecture är strategisk, och Enterprise Architecture är teknisk.",
        "De är identiska.",
        "Enterprise Architecture gäller endast verksamhetsprocesser.",
        "IT architecture har ingen relation till Enterprise Architecture.",
      ],
      explanation:
        "IT architecture fokuserar i första hand på informationsteknikens strukturer och lösningar. Enterprise Architecture har en bredare avgränsning med strategi, capabilities, organisation, information, applikationer, teknik och deras relationer, och IT architecture kan ses som en del av det landskapet.",
    },
    {
      kind: "fraga",
      id: "ea-m3-3",
      nr: "3",
      question: "Vad bör normalt styra stora arkitekturbeslut?",
      options: [
        "Teknikmode",
        "Leverantörspreferenser",
        "Verksamhetens mål och stakeholders concerns",
        "Enbart utvecklarnas preferenser",
        "Konventioner för diagram",
      ],
      explanation:
        "Enterprise Architecture frågar hur enterprisen ska utvecklas för att nå sina mål, inte vilken teknik vi ska köpa. Därför tar den hänsyn till en bredare uppsättning concerns, bland annat stakeholders.",
    },
    {
      kind: "fraga",
      id: "ea-m3-4",
      nr: "4",
      question: "Varför handlar Enterprise Architecture om förändring?",
      options: [
        "Enterprises är statiska.",
        "Arkitektur finns i första hand för att bevara nuläget.",
        "Enterprises måste ständigt anpassa sig till strategi, marknader, teknik och andra förändringar i omvärlden.",
        "Förändring sker endast inom IT.",
        "Förändring är endast en fråga för projektledningen.",
      ],
      explanation:
        "Enterprise Architecture frågar hur enterprisen ska utvecklas så att den kan nå sina mål. Eftersom strategi, marknader och teknik förändras måste enterprisen ständigt anpassa sig, och arkitekturen kopplar strategin till den förändringen.",
    },
    {
      kind: "fraga",
      id: "ea-m3-5",
      nr: "5",
      question: "Vilket påstående är mest korrekt?",
      options: [
        "Enterprise Architecture är helt enkelt dokumentation.",
        "Enterprise Architecture är i första hand en IT-förteckning.",
        "Enterprise Architecture kan stödja beslutsfattande, transformation och governance.",
        "Enterprise Architecture eliminerar affärsstrategin.",
        "Enterprise Architecture ersätter ledningen.",
      ],
      explanation:
        "Enterprise Architecture kopplar strategi till förändring och hjälper enterprisen att nå sina mål. Därför kan den stödja beslut, transformation och governance och är mer än dokumentation eller en förteckning över IT.",
    },
    { kind: "text", id: "m3-t4", sv: "## Sant eller falskt", en: "## True or False" },
    {
      kind: "fraga",
      id: "ea-m3-6",
      nr: "6",
      question: "Enterprise Architecture handlar i första hand om teknik.",
      explanation:
        "Enterprise Architecture frågar hur enterprisen ska utvecklas för att nå sina mål. Tekniken kan vara en del av svaret men är inte nödvändigtvis utgångspunkten.",
    },
    {
      kind: "fraga",
      id: "ea-m3-7",
      nr: "7",
      question: "Enterprise Architecture kan koppla strategi till organisatorisk förändring.",
      explanation:
        "Strategin pekar ut önskade resultat, och arkitekturen identifierar de capabilities, strukturer, information, applikationer, teknik och organisationsförändringar som krävs. Arkitekturen blir på så sätt en brygga mellan strategisk avsikt och implementering.",
    },
    {
      kind: "fraga",
      id: "ea-m3-8",
      nr: "8",
      question: "IT architecture kan ses som en del av det bredare Enterprise Architecture-landskapet.",
      explanation:
        "IT architecture fokuserar i första hand på informationsteknikens strukturer och lösningar, medan Enterprise Architecture har en bredare avgränsning. Därför kan IT architecture ses som en del av det bredare landskapet.",
    },
    {
      kind: "fraga",
      id: "ea-m3-9",
      nr: "9",
      question: "Enterprise Architecture handlar i första hand om att dokumentera IT-system.",
      explanation:
        "Enterprise Architecture handlar om att förstå, utforma, kommunicera och styra enterprisens struktur och utveckling så att den når sina mål. Den kan stödja beslut, transformation och governance och är mer än dokumentation.",
    },
    { kind: "text", id: "m3-t5", sv: "## Essäfråga", en: "## Essay Question" },
    {
      kind: "fritext",
      id: "ea-e3-10",
      typ: "essa",
      nr: "10",
      question: "Förklara skillnaden mellan Enterprise Architecture och IT architecture.",
      modelAnswer:
        "IT architecture fokuserar i första hand på informationsteknikens strukturer och lösningar. Enterprise Architecture har en bredare avgränsning och tar hänsyn till affärsstrategi, capabilities, organisation, information, applikationer, teknik och deras relationer. IT architecture kan därför ses som en del av det bredare Enterprise Architecture-landskapet.",
    },
    {
      kind: "fritext",
      id: "ea-e3-11",
      typ: "essa",
      nr: "11",
      question: "\"Enterprise Architecture kopplar strategi till förändring.\" Förklara.",
      modelAnswer:
        "Enterprise Architecture översätter strategiska mål till konsekvenser för arkitekturen. Strategin identifierar önskade resultat; arkitekturen identifierar de capabilities, strukturer, information, applikationer, teknik och organisationsförändringar som krävs för att nå dem. Arkitekturen utgör därför en brygga mellan strategisk avsikt och implementering.",
    },
  ],
};
