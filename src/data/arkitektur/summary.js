// Sammanfattningen för Verksamhetsarkitektur: kartan man läser först. Den är
// inget kapitel — den står som ett brett kort ovanför kapitellistan i Läs,
// har inget nummer, räknas inte i "X av 12 kapitel lästa" och finns inte i Öva.
//
// Bygger på modul 12, som UF säger att man ska börja med: den stora bilden
// och de tio begrepp man ska kunna förklara utan att slå upp dem.
// Definitionerna är UF:s, ordagrant på engelska.
//
// Regel: inget nytt i sak. Allt här står redan i kapitel 1–12; texten
// sammanfattar och hänvisar dit ("Mer: kapitel N").
export const summary = {
  id: "sammanfattning",
  summary: true,
  title: "Sammanfattning",
  readingMinutes: 5, // ~620 ord i sajtens lästempo (~145 ord/min)
  lead: "Börja här, som läraren säger: den stora bilden och de tio begrepp du ska kunna förklara utan att slå upp dem.",
  sources: ["Modul 12 (de tio begreppen och den stora bilden)", "Bygger på kapitel 1–12"],
  topics: [],
  primaryTopics: [],
  body: `
## Så ser tentan ut

Enligt kursinformationen och läraren ser tentan ut som modulerna: sant/falskt, flerval och någon essäfråga, och modulernas egna frågor kan komma. Öva har alla modulfrågor, och Essä har modulernas essäfrågor med lärarens modellsvar.

## Den stora bilden

En arkitektur ger ett sätt att förstå:

- vad som finns
- varför det finns
- hur saker hänger ihop
- vad som behöver ändras
- vilka konsekvenser förändringen får
- hur förändringen kan styras

Hela kursen går ut på att se en enterprise som ett system och hjälpa den att förändras med avsikt, inte att memorera ett ramverk. Kedjan som håller ihop allt:

> Strategy → capabilities → architectural change → implementation → outcomes

Därifrån går återkopplingen tillbaka till strategin. Tekniken kommer sent i kedjan, och därför är arkitektens första fråga alltid **varför**, inte **vilken teknik**.

Mer: kapitel 3 och 12.

## De tio begreppen

Läraren säger att du ska kunna förklara de här tio utan att slå upp dem. Definitionerna är hans.

| Begrepp | Lärarens definition | Kapitel |
|---|---|---|
| Enterprise | A collection of organizations, organizational units, or capabilities with a common set of goals. | 1 |
| Architecture | The fundamental organization of something, including its components, relationships, principles and constraints. | 2 |
| Enterprise Architecture | Addresses the structure and evolution of the enterprise in relation to its objectives. | 3 |
| Business capability | Describes what an organization can do. | 7 |
| Value stream | Describes how value is created and delivered to a stakeholder. | 7 |
| Architecture principle | Provides enduring guidance for architectural decisions. | 8 |
| Governance | Establishes decision rights, accountability, direction and control. | 8 |
| Zachman | Provides an ontology/classification schema for organizing descriptions of an enterprise. | 4 |
| TOGAF | Provides guidance and an approach for developing and governing Enterprise Architecture, including the ADM. | 5 |
| Digital transformation | Involves using digital capabilities to fundamentally change how an enterprise operates and creates or delivers value. | 10 |

## Det tentan skiljer på

De flesta frågorna prövar om du kan hålla isär två närliggande saker:

| Inte samma sak | Skillnaden | Mer |
|---|---|---|
| Enterprise och juridisk organisation | Enterprisen avgränsas av gemensamma mål och problemet som ska lösas | Kapitel 1 |
| Arkitektur och diagram | Diagrammet är en representation av arkitekturen | Kapitel 2 |
| EA och IT-arkitektur | EA gäller hela enterprisens utveckling; IT-arkitekturen är en del av den | Kapitel 3 |
| Zachman och TOGAF | Zachman klassificerar beskrivningar (ontologi); TOGAF ger metoden (ADM) | Kapitel 4 och 5 |
| ADM och vattenfall | ADM är iterativ och bygger på återkoppling | Kapitel 5 |
| Nuläge, målläge och övergång | Baseline, target och transition architectures | Kapitel 5 och 11 |
| Viewpoint och view | Reglerna för vyn och den faktiska representationen | Kapitel 6 |
| Förmåga och process | Vad organisationen kan göra och hur arbetet utförs | Kapitel 7 |
| Governance och management | Rätt beslut inom rätt gränser, mot att genomföra planen | Kapitel 8 |
| Digitization, digitalization och transformation | Omvandla till digitalt, förbättra befintligt, förändra hur värde skapas | Kapitel 10 |

## Zachman i korthet

Zachman är modul 4. Ramverket har sex kolumner (What, How, Where, Who, When, Why) och sex rader, från Planner (listor) via Owner (konceptuella verksamhetsmodeller), Designer (logiska systemmodeller), Builder (tekniska modeller) och Subcontractor (detaljerade specifikationer) till den fungerande verksamheten. Det är en ontologi, inte en metod.

Mer: kapitel 4 och Zachman-vyn.

## Arkitektens test

Innan du rekommenderar något, fråga:

1. **Why?** Vilket mål eller problem?
2. **What?** Vilken förmåga, vilket värde, vilken information eller vilket utfall?
3. **Who?** Vilka intressenter och beslutsfattare?
4. **How?** Vilken arkitektonisk förändring?
5. **What are the consequences?** Kostnader, risker, beroenden och avvägningar.

Var misstänksam mot påståenden med always, never, only, must, automatically, completely och exclusively. I EA är de ofta tecken på att påståendet är för absolut.

Mer: kapitel 12.

## Kursens fem kärnbudskap

1. Arkitekturen ska möjliggöra förändring, inte förhindra den.
2. Agilt gäller mer än mjukvara: Enterprise Agility kräver organisatorisk förändring.
3. Digital transformation är affärstransformation: tekniken är en möjliggörare.
4. Styrningen ska skapa guardrails, inte onödiga grindar.
5. Arkitekturen måste utvecklas hela tiden: målet är inget statiskt slutläge.

Mer: kapitel 8, 9, 10 och 12.
`,
};
