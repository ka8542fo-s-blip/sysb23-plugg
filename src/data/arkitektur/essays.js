// Essä för Verksamhetsarkitektur: UF:s kortsvars-, essä- och fallfrågor med
// "Model answer" i modulordning, som i PDF:erna — årets tenta ser ut som
// modulerna (kursinformationen och UF). Zachman-essän från HT25-tentorna
// (uppgift 1, 30 p) står efter modul 4:s frågor som extra träning.
//
// Formen skiljer sig från Strategi och BPM: där kommer fyrstegsformen (Vad /
// Varför / Konkret / Koppling) från Strategilärarens besked. Här är UF:s
// modellsvar facit. Varje checklista bryter ner just det modellsvaret i dess
// påståenden, och modellsvaret visas ordagrant under checklistan
// (`modelAnswer`). Modellsvar med inklistrad text (modul 8:8, 9:9, 10:9,
// 12 Essay 3) står ordagrant; checklistan bygger bara på de begripliga
// delarna. Dubbletter står kvar som egna poster med en not, så att
// numreringen följer PDF:en. Modul 7:s fråga 24 och 27 hör till kapitel 8
// (UF:s not i modul 8). Tentan anger inget ordtak (essayWordLimit: null).
//
// Genererad ur källorna 2026-11-13 (parser i scratchpad, inte i repot).
export const essays = [
  {
    id: "ea-e1-9",
    chapter: "kap1",
    label: "1: 9",
    question: "Why can defining the enterprise boundary be difficult in a digital ecosystem?",
    context: "Modul 1, fråga 9 · kortsvarsfråga",
    source: "Modul 1, fråga 9",
    checklist: [
      {
        heading: "Därför är gränsen svår",
        points: [
          "Digitala produkter och tjänster beror ofta på organisationer utanför det juridiska företaget (the legal enterprise).",
          "Kunder, leverantörer, tillsynsmyndigheter, plattformar och teknikleverantörer kan alla bidra till ett business outcome.",
          "Arkitekten måste därför avgöra vilka externa relationer som är relevanta för det arkitektoniska målet (architectural objective).",
        ],
      },
    ],
    modelAnswer: "Digital products and services often depend on organizations outside the legal enterprise. Customers, suppliers, regulators, platforms and technology providers can all contribute to a business outcome. The architect therefore needs to determine which external relationships are relevant to the architectural objective.",
  },
  {
    id: "ea-e1-10",
    chapter: "kap1",
    label: "1: 10",
    question: "Explain why the concept of \"enterprise\" is more important to Enterprise Architecture than the concept of \"company.\"",
    context: "Modul 1, fråga 10 · essäfråga",
    source: "Modul 1, fråga 10",
    checklist: [
      {
        heading: "Enterprise vs. company",
        points: [
          "Enterprise Architecture handlar om ett enterprise struktur och utveckling i förhållande till dess mål (objectives).",
          "Ett enterprise kan sträcka sig bortom det juridiska företagets gränser när business outcomes beror på andra organisationer eller aktörer.",
        ],
      },
      {
        heading: "Konsekvens",
        points: [
          "Att bara fokusera på företaget (company) kan därför ge en ofullständig arkitekturbild.",
          "Arkitekten måste fastställa relevant scope utifrån affärsproblemet och det önskade utfallet (desired outcome).",
        ],
      },
    ],
    modelAnswer: "Enterprise Architecture is concerned with the structure and evolution of an enterprise in relation to its objectives. An enterprise can extend beyond the boundaries of a legal company when business outcomes depend on other organizations or actors. Focusing only on the company can therefore produce an incomplete architectural view. The architect must establish the relevant scope based on the business problem and desired outcome.",
  },
  {
    id: "ea-e2-10",
    chapter: "kap2",
    label: "2: 10",
    question: "Why is abstraction important to Enterprise Architecture?",
    context: "Modul 2, fråga 10 · kortsvarsfråga",
    source: "Modul 2, fråga 10",
    checklist: [
      {
        heading: "Därför behövs abstraktion",
        points: [
          "Enterprise Architecture hanterar en mycket komplex verklighet.",
          "Abstraktion låter arkitekter och intressenter fokusera på det som är relevant för en viss concern och slippa onödiga detaljer.",
          "Olika intressenter kan därför arbeta med olika representationsnivåer och ändå diskutera samma enterprise.",
        ],
      },
    ],
    modelAnswer: "Enterprise Architecture deals with a highly complex reality. Abstraction allows architects and stakeholders to focus on the aspects relevant to a particular concern while avoiding unnecessary detail. Different stakeholders can therefore work with different levels of representation while still discussing the same enterprise.",
  },
  {
    id: "ea-e2-x",
    chapter: "kap2",
    label: "2: essä",
    question: "Why is it insufficient to describe an enterprise simply by listing its components?",
    context: "Modul 2, essäfrågan utan nummer (mellan fråga 10 och 11) · essäfråga",
    source: "Modul 2, essäfrågan utan nummer (mellan fråga 10 och 11)",
    checklist: [
      {
        heading: "Mer än komponenter",
        points: [
          "Komponenter ensamma förklarar inte hur ett enterprise fungerar.",
          "Arkitektur handlar också om relationer, beroenden, ansvar, principer, begränsningar (constraints) och syfte.",
          "Att förstå relationerna gör att arkitekter kan bedöma konsekvenserna av en förändring.",
        ],
      },
    ],
    modelAnswer: "Components alone do not explain how the enterprise works. Architecture also concerns relationships, dependencies, responsibilities, principles, constraints and purpose. Understanding these relationships allows architects to evaluate the consequences of change.",
  },
  {
    id: "ea-e2-11",
    chapter: "kap2",
    label: "2: 11",
    question: "Explain the difference between architecture, design and implementation.",
    context: "Modul 2, fråga 11 · essäfråga",
    source: "Modul 2, fråga 11",
    checklist: [
      {
        heading: "Tre nivåer",
        points: [
          "Architecture fastställer den grundläggande organisationen, relationerna, principerna och begränsningarna (constraints).",
          "Design tar fram mer detaljerade lösningar inom de gränser som arkitekturen har satt.",
          "Implementation realiserar designen i en operativ miljö.",
          "Skillnaderna är inte absoluta, men de motsvarar olika nivåer av beslutsfattande och abstraktion.",
        ],
      },
    ],
    modelAnswer: "Architecture establishes the fundamental organization, relationships, principles and constraints. Design develops more detailed solutions within those architectural boundaries. Implementation realizes the design in an operational environment. The distinctions are not absolute, but they represent different levels of decision-making and abstraction.",
  },
  {
    id: "ea-e3-10",
    chapter: "kap3",
    label: "3: 10",
    question: "Explain the difference between Enterprise Architecture and IT architecture.",
    context: "Modul 3, fråga 10 · essäfråga",
    source: "Modul 3, fråga 10",
    checklist: [
      {
        heading: "Skillnaden",
        points: [
          "IT architecture fokuserar främst på informationsteknikens strukturer och lösningar.",
          "Enterprise Architecture har bredare scope: affärsstrategi, capabilities, organisation, information, applikationer, teknik och relationerna mellan dem.",
          "IT architecture kan därför ses som en del av det bredare Enterprise Architecture-landskapet.",
        ],
      },
    ],
    modelAnswer: "IT architecture focuses primarily on information technology structures\nand solutions. Enterprise Architecture has a broader scope and considers business strategy, capabilities, organization, information, applications, technology and their relationships. IT architecture can therefore be considered part of the broader Enterprise Architecture landscape.",
  },
  {
    id: "ea-e3-11",
    chapter: "kap3",
    label: "3: 11",
    question: "\"Enterprise Architecture connects strategy with change.\" Explain.",
    context: "Modul 3, fråga 11 · essäfråga",
    source: "Modul 3, fråga 11",
    checklist: [
      {
        heading: "Bryggan",
        points: [
          "Enterprise Architecture översätter strategiska mål till arkitektoniska konsekvenser (architectural implications).",
          "Strategin identifierar de önskade utfallen (desired outcomes).",
          "Arkitekturen identifierar vilka capabilities, strukturer, information, applikationer, teknik och organisationsförändringar som krävs för att nå dem.",
          "Arkitekturen blir därmed en brygga mellan strategisk avsikt (strategic intent) och genomförande (implementation).",
        ],
      },
    ],
    modelAnswer: "Enterprise Architecture translates strategic objectives into architectural implications. Strategy identifies desired outcomes; architecture identifies the capabilities, structures, information, applications, technology and organizational changes required to achieve them. Architecture therefore provides a bridge between strategic intent and implementation.",
  },
  {
    id: "ea-e4-9",
    chapter: "kap4",
    label: "4: 9",
    question: "Explain the difference between a methodology and an ontology in the context of Enterprise Architecture.",
    context: "Modul 4, fråga 9 · kortsvarsfråga",
    source: "Modul 4, fråga 9",
    checklist: [
      {
        heading: "Två olika saker",
        points: [
          "En methodology föreskriver aktiviteter, processer eller steg för att åstadkomma något.",
          "En ontology fastställer begrepp och relationer som beskriver vad som finns i en domän och hur det kan klassificeras.",
          "Zachman är främst en ontology/klassificeringsstruktur och inte en development methodology.",
        ],
      },
    ],
    modelAnswer: "A methodology prescribes activities, processes or steps for accomplishing something. An ontology establishes concepts and relationships that describe what exists in a domain and how it can be classified. Zachman is primarily an ontology/classification structure rather than a development methodology.",
  },
  {
    id: "ea-e4-10",
    chapter: "kap4",
    label: "4: 10",
    question: "Compare Zachman and TOGAF.",
    context: "Modul 4, fråga 10 · essäfråga. Samma fråga som modul 5 fråga 12 och modul 12 Essay 2.",
    source: "Modul 4, fråga 10",
    checklist: [
      {
        heading: "Vad de är",
        points: [
          "Zachman är en ontology och klassificeringsstruktur som ordnar beskrivningar av verksamheten efter perspektiv (perspectives) och frågeord (interrogatives).",
          "TOGAF ger vägledning och ett sätt att utveckla arkitektur, framför allt genom ADM.",
        ],
      },
      {
        heading: "Hur de kompletterar varandra",
        points: [
          "Zachman hjälper till att organisera vilka slags beskrivningar som kan behövas.",
          "TOGAF ger en metod för att utveckla och styra (govern) arkitektur.",
          "Zachman och TOGAF kan därför vara komplementära.",
        ],
      },
    ],
    modelAnswer: "Zachman provides an ontology and classification structure for organizing enterprise descriptions according to perspectives and interrogatives. TOGAF provides guidance and an architecture development approach, particularly through the ADM. Zachman helps organize the kinds of descriptions that may be needed; TOGAF provides a method for developing and governing architecture. They can therefore be complementary.",
  },
  {
    id: "ea-e4-11",
    chapter: "kap4",
    label: "4: 11",
    question: "Why is it misleading to describe Zachman as a methodology?",
    context: "Modul 4, fråga 11 · essäfråga",
    source: "Modul 4, fråga 11",
    checklist: [
      {
        heading: "Därför är Zachman ingen methodology",
        points: [
          "En methodology föreskriver aktiviteter eller procedurer för att nå ett mål.",
          "Zachman ger främst en struktur för att klassificera och organisera beskrivningar av verksamheten efter olika perspektiv och interrogatives.",
          "Zachman föreskriver ingen sekvens av aktiviteter för att utveckla arkitektur.",
        ],
      },
    ],
    modelAnswer: "A methodology prescribes activities or procedures for achieving an objective. Zachman primarily provides a structure for classifying and organizing descriptions of an enterprise according to different perspectives and\ninterrogatives. It does not prescribe a sequence of activities for developing architecture.",
  },
  {
    id: "ea-e-zachman",
    chapter: "kap4",
    label: "Zachman-essän (HT25)",
    question: "Beskriv och förklara raderna och kolumnerna i Zachmans ramverk. Beskrivs i Finkelstein kap 1 samt i flertalet av artiklarna (inklusive föreläsningsmaterial). Förutom vad raderna och kolumnerna heter och vad de har/kan ha för innehåll, skall för höga poäng även perspektiven förklaras - T.ex. vad är Planner? - Och exempel på cellinnehåll ges - listor på rad 1, konceptuella modeller på rad 2 o.s.v.",
    context: "Från HT25-tentorna, som hade ett annat format än årets (extra träning på modul 4). Uppgift 1 på alla tre, 30 p (okt och dec 2025: minst 15 p för godkänt). Majtentan 2026 frågade: \"Beskriv och redogör tydligt för Zachmans ramverk i sin helhet. (30p)\". Finkelstein och artiklarna ingår inte i årets material — svara utifrån kapitel 4. Kalibrering från Strategi: A-svaren var enkla men korrekta och täckte det som efterfrågades.",
    source: "HT25-tentorna, uppgift 1 (okt 2025, dec 2025, maj 2026); checklistan bygger på kapitel 4 (modul 4, föreläsningsbilderna och 2003-affischen)",
    examPriority: ["karna", "essa"],
    checklist: [
      {
        heading: "Vad ramverket är",
        points: [
          "Zachman är en ontologi och ett klassificeringsschema för beskrivningar av en enterprise, inte en metod: det föreskriver ingen ordning för arbetet.",
          "Ramverket visar kontexten för olika modeller, och det kan visa vilka beskrivningar som saknas.",
          "Det kompletterar TOGAF: Zachman klassificerar beskrivningarna, TOGAF ger metoden (ADM).",
        ],
      },
      {
        heading: "Kolumnerna",
        points: [
          "Sex kolumner, en per frågeord: Vad (What/Data), Hur (How/Function), Var (Where/Network), Vem (Who/People), När (When/Time) och Varför (Why/Motivation).",
          "Varje kolumn är en central aspekt av verksamheten: begrepp och data, processer, platser och logistik, organisation och ansvar, händelser och cykler, mål och strategier.",
          "Ett exempel per kolumn, som UF:s universitet: student och kurs, antagning och registrering, Lund och EC2, antagningsavdelningen och kursansvarig, ansökan före antagning, högskolelagen och lärandemål.",
        ],
      },
      {
        heading: "Raderna och perspektiven",
        points: [
          "Sex rader, var och en en abstraktionsnivå sedd ur ett perspektiv: Scope (Planner), Business Model (Owner), System Model (Designer), Technology Model (Builder), Detailed Representations (Subcontractor) och Functioning Enterprise.",
          "Planner avgör verksamhetens omfång och sammanhang; Owner beskriver verksamheten konceptuellt; Designer gör den logiska systemmodellen; Builder den tekniska; Subcontractor de detaljerade delarna.",
          "Raderna är perspektiv, inte projektfaser; version 3.0 kallar dem Executive, Business Management, Architect, Engineer, Technician och Enterprise Perspective.",
        ],
      },
      {
        heading: "Cellinnehåll",
        points: [
          "Rad 1 innehåller listor: List of Things, Processes, Locations, Organizations, Cycles och Goals.",
          "Rad 2 innehåller konceptuella modeller: Semantic Model, Business Process Model, Logistics Network, Work Flow Model, Master Schedule och Business Plan.",
          "Rad 3–5 med exempel: Logical Data Model och Business Rule Model (rad 3), Data Design och Technology Architecture (rad 4), Program och Data Definition (rad 5).",
          "Varje cell är bara ett exempel på vilken sorts modell som kan användas.",
        ],
      },
      {
        heading: "Hur cellerna hänger ihop",
        points: [
          "Celler i samma kolumn hänger ihop genom en transformation mellan abstraktionsnivåerna.",
          "Transformationen mellan raderna är inte helt automatisk, men det håller på att ändras med modelldriven utveckling och arkitektur.",
        ],
      },
    ],
  },
  {
    id: "ea-e5-10",
    chapter: "kap5",
    label: "5: 10",
    question: "Why must an organization adapt its use of TOGAF to its own context?",
    context: "Modul 5, fråga 10 · kortsvarsfråga",
    source: "Modul 5, fråga 10",
    checklist: [
      {
        heading: "Därför måste TOGAF anpassas",
        points: [
          "Organisationer skiljer sig i storlek, governance, regelverk, architecture maturity, kultur, affärsmodell och förändringsbehov.",
          "Ett framework ger vägledning, men organisationen måste skräddarsy (tailor) sin arkitekturpraktik efter sina förutsättningar.",
        ],
      },
    ],
    modelAnswer: "Organizations differ in size, governance, regulatory environment, architecture maturity, culture, business model and change requirements. A framework provides guidance, but the organization must tailor the architecture practice to its circumstances.",
  },
  {
    id: "ea-e5-11",
    chapter: "kap5",
    label: "5: 11",
    question: "Explain the role of the ADM in Enterprise Architecture.",
    context: "Modul 5, fråga 11 · essäfråga",
    source: "Modul 5, fråga 11",
    checklist: [
      {
        heading: "ADM:s roll",
        points: [
          "ADM ger ett strukturerat sätt att utveckla, kommunicera, styra (govern) och vidareutveckla Enterprise Architecture.",
          "ADM leder arkitekten från architecture vision via domänarkitekturerna till opportunities, migration och implementation governance.",
          "ADM tillåter samtidigt iteration och anpassning.",
        ],
      },
    ],
    modelAnswer: "The ADM provides a structured approach for developing, communicating, governing and evolving Enterprise Architecture. It helps architects move from understanding the architectural vision through domain architecture,\nopportunities, migration and implementation governance, while allowing iteration and adaptation.",
  },
  {
    id: "ea-e5-12",
    chapter: "kap5",
    label: "5: 12",
    question: "Compare Zachman and TOGAF. What differ between them?",
    context: "Modul 5, fråga 12 · essäfråga. Samma fråga som modul 4 fråga 10 och modul 12 Essay 2.",
    source: "Modul 5, fråga 12",
    checklist: [
      {
        heading: "Vad de är",
        points: [
          "Zachman är främst en ontology och klassificeringsstruktur för att organisera arkitekturbeskrivningar.",
          "TOGAF ger vägledning och en metod för att utveckla arkitektur, framför allt genom ADM.",
        ],
      },
      {
        heading: "Skillnaden",
        points: [
          "Zachman hjälper till att svara på vilka slags beskrivningar som behövs.",
          "TOGAF ger ett strukturerat sätt att utveckla och förvalta (manage) arkitektur.",
        ],
      },
    ],
    modelAnswer: "Zachman primarily provides an ontology and classification structure for organizing architectural descriptions. TOGAF provides guidance and an architecture development method, particularly through the ADM. Zachman helps answer what kinds of descriptions are needed, while TOGAF provides a structured approach for developing and managing architecture.",
  },
  {
    id: "ea-e6-11",
    chapter: "kap6",
    label: "6: 11",
    question: "Explain the difference between a view and a viewpoint.",
    context: "Modul 6, fråga 11 · kortsvarsfråga. Samma fråga som modul 12 fråga 31.",
    source: "Modul 6, fråga 11",
    checklist: [
      {
        heading: "View och viewpoint",
        points: [
          "En viewpoint definierar hur en viss intressents concern ska hanteras och representeras.",
          "En view är den faktiska representation som skapas med hjälp av den viewpointen.",
        ],
      },
    ],
    modelAnswer: "A viewpoint defines how a particular stakeholder concern should be addressed and represented. A view is the actual representation created using that viewpoint.",
  },
  {
    id: "ea-e6-12",
    chapter: "kap6",
    label: "6: 12",
    question: "Why are architectural relationships often more important than individual architectural components?",
    context: "Modul 6, fråga 12 · essäfråga",
    source: "Modul 6, fråga 12",
    checklist: [
      {
        heading: "Därför väger relationer tyngre",
        points: [
          "Relationer visar beroenden, påverkan (impacts) och konsekvenser av förändring.",
          "En business capability kan till exempel vara beroende av vissa processer, viss information, vissa applikationer och viss teknik.",
          "Att förstå sådana beroenden låter arkitekter bedöma hur en förändring sprider sig genom verksamheten.",
        ],
      },
    ],
    modelAnswer: "Relationships reveal dependencies, impacts and consequences of change. Understanding that a business capability depends on particular processes, information, applications and technology allows architects to assess how changes propagate through the enterprise.",
  },
  {
    id: "ea-e6-13",
    chapter: "kap6",
    label: "6: 13",
    question: "Why is it dangerous to design architecture domains independently?",
    context: "Modul 6, fråga 13 · essäfråga",
    source: "Modul 6, fråga 13",
    checklist: [
      {
        heading: "Domänerna hänger ihop",
        points: [
          "Business, data, application och technology architecture är beroende av varandra.",
          "En affärsförändring kan kräva ändringar i information, applikationer och teknik.",
        ],
      },
      {
        heading: "Risken",
        points: [
          "Att designa domänerna var för sig kan skapa inkonsekvenser och duplicerade capabilities.",
          "Det kan också ge lösningar som inte stödjer affärsmålen (business objectives).",
        ],
      },
    ],
    modelAnswer: "Business, data, application and technology architecture are interdependent. A business change may require changes to information, applications and technology. Designing domains independently can therefore create inconsistencies, duplicated capabilities and solutions that fail to support business objectives.",
  },
  {
    id: "ea-e7-11",
    chapter: "kap7",
    label: "7: 11",
    question: "Why can capability maps be useful when an organization is reorganizing?",
    context: "Modul 7, fråga 11 · kortsvarsfråga",
    source: "Modul 7, fråga 11",
    checklist: [
      {
        heading: "Därför fungerar capability maps",
        points: [
          "Avdelningar kan ändras medan de underliggande förmågor som verksamheten behöver finns kvar.",
          "Capability mapping låter arkitekten fokusera på vad organisationen måste kunna göra snarare än på tillfälliga organisationsstrukturer.",
        ],
      },
    ],
    modelAnswer: "Organizational departments can change while the underlying abilities required by the enterprise remain. Capability mapping allows the architect to focus on what the organization must be able to do rather than on temporary organizational structures.",
  },
  {
    id: "ea-e7-12",
    chapter: "kap7",
    label: "7: 12",
    question: "Why are capabilities useful in Enterprise Architecture?",
    context: "Modul 7, fråga 12 · essäfråga",
    source: "Modul 7, fråga 12",
    checklist: [
      {
        heading: "Därför är capabilities användbara",
        points: [
          "Capabilities ger ett stabilt sätt att uttrycka vad en organisation måste kunna göra för att nå sina mål.",
          "Capabilities kan kopplas till processer, människor, information, applikationer och teknik.",
          "Det gör att arkitekter kan spåra (trace) strategiska mål ända till arkitektur- och investeringsbeslut.",
        ],
      },
    ],
    modelAnswer: "Capabilities provide a stable way of expressing what an organization must be able to do to achieve its objectives. They can be related to processes, people, information, applications and technology, allowing architects to trace strategic objectives into architectural and investment decisions.",
  },
  {
    id: "ea-e7-13",
    chapter: "kap7",
    label: "7: 13",
    question: "Explain how capabilities connect strategy with architecture.",
    context: "Modul 7, fråga 13 · essäfråga. Nästan samma fråga som modul 7 fråga 26.",
    source: "Modul 7, fråga 13",
    checklist: [
      {
        heading: "Från strategi till capability",
        points: [
          "Strategin fastställer önskade utfall (desired outcomes) och prioriteringar.",
          "Utfallen innebär capabilities som verksamheten måste ha eller stärka.",
        ],
      },
      {
        heading: "Från capability till arkitektur",
        points: [
          "Arkitekter kan sedan analysera vilka människor, processer, information, applikationer och teknik som behövs för att stödja dessa capabilities.",
          "Capabilities blir därmed en brygga mellan strategisk avsikt (strategic intent) och arkitekturförändring.",
        ],
      },
    ],
    modelAnswer: "Strategy establishes desired outcomes and priorities. These imply capabilities that the enterprise must possess or strengthen. Architects can then analyze what people, processes, information, applications and technology are needed to support those capabilities. Capabilities therefore provide a bridge between strategic intent and architectural change.",
  },
  {
    id: "ea-e7-23",
    chapter: "kap7",
    label: "7: 23",
    question: "Why might capabilities be more useful than organizational departments when planning transformation?",
    context: "Modul 7, fråga 23 · kortsvarsfråga",
    source: "Modul 7, fråga 23",
    checklist: [
      {
        heading: "Capabilities är stabilare",
        points: [
          "Organisationsstrukturer kan ändras ofta genom omorganisationer, sammanslagningar (mergers) och omstruktureringar.",
          "Capabilities kan ge en stabilare bild av vad verksamheten behöver kunna göra.",
          "Det gör dem användbara för att hitta capability gaps och prioritera transformation oberoende av nuvarande organisationsgränser.",
        ],
      },
    ],
    modelAnswer: "Organizational structures can change frequently through reorganizations, mergers and restructuring. Capabilities can provide a more stable representation of what the enterprise needs to be able to do. This makes them useful for identifying capability gaps and prioritizing transformation independently of current organizational boundaries.",
  },
  {
    id: "ea-e7-24",
    chapter: "kap8",
    label: "7: 24",
    question: "Give an example of an architecture principle and explain how it might affect decisions.",
    context: "Modul 7, fråga 24 (principer och styrning: modul 8:s ämne enligt UF:s not) · kortsvarsfråga",
    source: "Modul 7, fråga 24 (principer och styrning: modul 8:s ämne enligt UF:s not)",
    checklist: [
      {
        heading: "Exempel och effekt",
        points: [
          "Ett exempel på architecture principle är \"Information is an enterprise asset\".",
          "Principen kan påverka beslut om dataägarskap, integration, datakvalitet, säkerhet och applikationsdesign.",
          "Den ger en konsekvent riktning för alla beslut som rör verksamhetens information.",
        ],
      },
    ],
    modelAnswer: "\"Information is an enterprise asset\" could influence decisions about data ownership, integration, data quality, security and application design. It establishes a consistent direction for decisions involving enterprise information.",
  },
  {
    id: "ea-e7-25",
    chapter: "kap7",
    label: "7: 25",
    question: "A company reorganizes its marketing department three times in five years. However, it continues to need customer insight, campaign management and market analysis. What does this illustrate about capabilities?",
    context: "Modul 7, fråga 25 · kortsvarsfråga",
    source: "Modul 7, fråga 25",
    checklist: [
      {
        heading: "Vad exemplet visar",
        points: [
          "Capabilities kan förbli relativt stabila även när organisationsstrukturen ändras.",
          "Organisationen kan omorganisera vem som utför en capability utan att själva den underliggande capabilityn försvinner.",
        ],
      },
    ],
    modelAnswer: "It illustrates that capabilities can remain relatively stable even when organizational structures change. The organization may reorganize who performs the capability without eliminating the underlying capability itself.",
  },
  {
    id: "ea-e7-26",
    chapter: "kap7",
    label: "7: 26",
    question: "Explain how business capabilities can connect strategy with Enterprise Architecture.",
    context: "Modul 7, fråga 26 · essäfråga. Nästan samma fråga som modul 7 fråga 13.",
    source: "Modul 7, fråga 26",
    checklist: [
      {
        heading: "Kopplingen",
        points: [
          "Capabilities översätter strategisk avsikt (strategic intent) till de förmågor verksamheten behöver för att nå sina mål.",
          "När prioriteringarna har översatts till capabilities kan arkitekter bedöma vilka människor, processer, information, applikationer och teknik som behövs.",
          "Capability-based analysis blir därmed en brygga mellan strategisk planering och arkitekturförändring.",
        ],
      },
    ],
    modelAnswer: "Capabilities translate strategic intent into the abilities that an enterprise needs in order to achieve its objectives. Once strategic priorities have been translated into required capabilities, architects can assess the people, processes, information, applications and technology needed to support them. Capabilitybased analysis therefore provides a bridge between strategic planning and architectural change.",
  },
  {
    id: "ea-e7-27",
    chapter: "kap8",
    label: "7: 27",
    question: "How can governance enable rather than restrict agility?",
    context: "Modul 7, fråga 27 (principer och styrning: modul 8:s ämne enligt UF:s not) · essäfråga. Samma fråga som modul 12 Essay 4 i annan form.",
    source: "Modul 7, fråga 27 (principer och styrning: modul 8:s ämne enligt UF:s not)",
    checklist: [
      {
        heading: "Vad god governance gör",
        points: [
          "Effektiv governance fastställer tydliga principer, decision rights och gränser.",
          "Governance ger samtidigt teamen lämplig autonomi.",
        ],
      },
      {
        heading: "Hur det ger agilitet",
        points: [
          "I stället för centralt godkännande av varje beslut fokuserar governance på stora risker, beroenden över hela verksamheten och strategiska beslut.",
          "Det skapar guardrails inom vilka teamen kan röra sig snabbt.",
        ],
      },
    ],
    modelAnswer: "Effective governance establishes clear principles, decision rights and boundaries while allowing teams appropriate autonomy. Instead of requiring centralized approval of every decision, governance can focus attention on significant risks, cross-enterprise dependencies and strategic decisions. This creates guardrails within which teams can move quickly.",
  },
  {
    id: "ea-e8-8",
    chapter: "kap8",
    label: "8: 8",
    question: "Explain how architecture principles can increase agility.",
    context: "Modul 8, fråga 8 · essäfråga",
    source: "Modul 8, fråga 8",
    checklist: [
      {
        heading: "Principer som guardrails",
        points: [
          "Tydliga principer ger återanvändbar beslutsvägledning (reusable decision guidance).",
          "Teamen kan fatta många beslut självständigt utan att söka godkännande varje gång, så länge de håller sig inom de överenskomna gränserna.",
          "Principer fungerar därmed som guardrails som kan öka konsekvens (consistency) och beslutshastighet (decision speed).",
        ],
      },
    ],
    modelAnswer: "Clear principles provide reusable decision guidance. Teams can make many decisions independently without seeking approval each time, provided they remain within the agreed boundaries. Principles therefore act as guardrails that can increase direction while delegating appropriate decisions to delivery teams. Architecture should focus on significant risks and dependencies rather than requiring centralize consistency and decision speed.",
  },
  {
    id: "ea-e9-9",
    chapter: "kap9",
    label: "9: 9",
    question: "How can an architect avoid becoming a bottleneck in an Agile organization?",
    context: "Modul 9, fråga 9 · kortsvarsfråga",
    source: "Modul 9, fråga 9",
    checklist: [
      {
        heading: "Så undviker arkitekten att bli en flaskhals",
        points: [
          "Arkitekten kan fastställa principer, standarder, guardrails och decision rights.",
          "Det låter teamen fatta rutinbeslut självständigt.",
          "Arkitekten bör fokusera på stora beroenden mellan team, strategiska beslut, systemiska risker och frågor som kräver samordning på enterprise-nivå.",
        ],
      },
    ],
    modelAnswer: "The architect can establish principles, standards, guardrails and decision rights, allowing teams to make routine decisions independently. The architect should focus on significant cross-team dependencies, strategic decisions, systemic risks and issues autonomy. Architecture should evolve with learning and focus on decisions with significant enterprise impact. This allows that require enterprise-level coordination.",
  },
  {
    id: "ea-e9-10",
    chapter: "kap9",
    label: "9: 10",
    question: "Explain how Enterprise Architecture can support Agile without becoming a barrier to delivery.",
    context: "Modul 9, fråga 10 · essäfråga",
    source: "Modul 9, fråga 10",
    checklist: [
      {
        heading: "Vad EA ska ge",
        points: [
          "Enterprise Architecture bör ge riktning (direction), principer, återanvändbara capabilities och guardrails.",
          "Samtidigt får leveransteamen (delivery teams) lämplig autonomi.",
        ],
      },
      {
        heading: "Hur arkitekturen arbetar",
        points: [
          "Arkitekturen bör utvecklas i takt med lärandet (evolve with learning).",
          "Arkitekturen bör fokusera på beslut med stor påverkan på hela verksamheten (significant enterprise impact).",
          "Det möjliggör agilitet samtidigt som koherensen bevaras och systemiska risker hanteras.",
        ],
      },
    ],
    modelAnswer: "Enterprise Architecture should provide direction, principles, reusable capabilities and guardrails while allowing delivery teams appropriate autonomy. Architecture should evolve with learning and focus on decisions with significant enterprise impact. This allows agility while preserving coherence and managing systemic risks.",
  },
  {
    id: "ea-e9-tankande",
    chapter: "kap9",
    label: "9: tänkande",
    question: "You are the Enterprise Architect. The CEO says: \"Our problem is that we have too many applications.\" What questions would you ask before accepting that diagnosis?",
    context: "Modul 9, \"Architect's thinking\" · \"Architect's thinking\"",
    source: "Modul 9, \"Architect's thinking\"",
    checklist: [
      {
        heading: "Frågor innan diagnosen godtas",
        points: [
          "Vilka business capabilities berörs, och vilka applikationer stödjer dem?",
          "Är dubbleringen (duplication) verkligen ett problem?",
          "Är applikationerna redundanta eller avsiktligt differentierade?",
          "Vilka business outcomes påverkas?",
          "Vilken information är duplicerad?",
          "Vilka kostnader och risker finns?",
          "Vilket strategiskt mål (strategic objective) ligger bakom oron?",
        ],
      },
    ],
    modelAnswer: "Which business capabilities are involved?\nWhich applications support those capabilities?\nIs duplication actually a problem?\nAre applications redundant or intentionally differentiated?\nWhat business outcomes are affected?\nWhat information is duplicated?\nWhat are the costs and risks?\nWhat strategic objective is driving the concern?",
  },
  {
    id: "ea-e10-9",
    chapter: "kap10",
    label: "10: 9",
    question: "Explain the difference between digitization, digitalization and digital transformation.",
    context: "Modul 10, fråga 9 · essäfråga",
    source: "Modul 10, fråga 9",
    checklist: [
      {
        heading: "Tre begrepp",
        points: [
          "Digitization omvandlar analog information till digital form.",
          "Digitalization använder digital teknik för att förbättra befintliga processer eller aktiviteter.",
          "Digital transformation är bredare och innebär grundläggande förändringar i hur verksamheten skapar och levererar värde.",
        ],
      },
    ],
    modelAnswer: "Digitization converts analog information into digital form. Digitalization uses digital technology to improve existing processes or activities. Digital transformation is broader and involves fundamental changes in how the enterprise creates and delivers value. Transformation can affect business models, capabilities, value streams, organizational structures, information, applications and technology. Because these change.",
  },
  {
    id: "ea-e10-10",
    chapter: "kap10",
    label: "10: 10",
    question: "Why should digital transformation be treated as an Enterprise Architecture concern?",
    context: "Modul 10, fråga 10 · essäfråga",
    source: "Modul 10, fråga 10",
    checklist: [
      {
        heading: "Därför är det en EA-fråga",
        points: [
          "Digital transformation kan påverka affärsmodeller, capabilities, value streams, organisationsstrukturer, information, applikationer och teknik.",
          "Eftersom förändringarna hänger ihop kräver de ett arkitekturperspektiv över hela verksamheten (enterprise-wide).",
          "Digital transformation ska därför inte behandlas som ett isolerat teknikinitiativ.",
        ],
      },
    ],
    modelAnswer: "Digital transformation can affect business models, capabilities, value streams, organizational structures, information, applications and technology. Because these changes are interconnected, they require an enterprise-wide architectural perspective rather than an isolated technology initiative.",
  },
  {
    id: "ea-e11-3",
    chapter: "kap11",
    label: "11: 3",
    question: "Why might replacing the entire core banking system immediately be risky?",
    context: "Modul 11, fråga 3 · fallfråga",
    source: "Modul 11, fråga 3",
    checklist: [
      {
        heading: "Risker och alternativ",
        points: [
          "Kärnsystemet kan stödja kritiska business capabilities och innehålla komplexa beroenden.",
          "En \"big bang\"-ersättning kan skapa stora operativa, finansiella och affärsmässiga risker.",
          "Inkrementella transition architectures kan låta banken modernisera och samtidigt fortsätta leverera värde.",
        ],
      },
    ],
    modelAnswer: "The core system may support critical business capabilities and contain complex dependencies. A \"big bang\" replacement could create major operational, financial and business risks. Incremental transition architectures may allow the bank to modernize while continuing to deliver value.",
  },
  {
    id: "ea-e11-7",
    chapter: "kap11",
    label: "11: 7",
    question: "What would be an architectural anti-pattern in this situation?",
    context: "Modul 11, fråga 7 · fallfråga",
    source: "Modul 11, fråga 7",
    checklist: [
      {
        heading: "Anti-patternet",
        points: [
          "Anti-patternet är att välja en teknikplattform innan affärsmålen (business objectives) har fastställts.",
          "Plattformen väljs då också innan de capabilities som krävs och de arkitektoniska begränsningarna (constraints) är klarlagda.",
        ],
      },
    ],
    modelAnswer: "Selecting a technology platform before establishing the business objectives, required capabilities and architectural constraints.",
  },
  {
    id: "ea-e11-8",
    chapter: "kap11",
    label: "11: 8",
    question: "What should the architect ask before selecting technology?",
    context: "Modul 11, fråga 8 · fallfråga",
    source: "Modul 11, fråga 8",
    checklist: [
      {
        heading: "Innan teknik väljs",
        points: [
          "Arkitekten fastställer först de strategiska målen och de önskade kundutfallen (customer outcomes).",
          "Arkitekten klarlägger vilka capabilities som krävs och vilka begränsningar (constraints) som finns i dag.",
          "Arkitekten tar reda på intressenternas concerns och vilka architectural principles som gäller.",
          "Först därefter utvärderas tekniken.",
        ],
      },
    ],
    modelAnswer: "The architect should establish the strategic objectives, desired customer outcomes, required capabilities, current constraints, stakeholder concerns and architectural principles before evaluating technology.",
  },
  {
    id: "ea-e11-8b",
    chapter: "kap11",
    label: "11: 8 (andra)",
    question: "Why are transition architectures important?",
    context: "Modul 11, fråga 8 (den andra frågan med nummer 8) · fallfråga",
    source: "Modul 11, fråga 8 (den andra frågan med nummer 8)",
    checklist: [
      {
        heading: "Transition architectures",
        points: [
          "Transition architectures är praktiska mellanlägen (intermediate states).",
          "De låter organisationen gå från baseline architecture mot target architecture.",
          "Under tiden kan verksamheten fortsätta att drivas och leverera värde.",
        ],
      },
    ],
    modelAnswer: "They provide practical intermediate states that allow an organization to move from its baseline architecture toward the target architecture while continuing operations and delivering value.",
  },
  {
    id: "ea-e11-9",
    chapter: "kap11",
    label: "11: 9",
    question: "Develop an architectural approach for the bank.",
    context: "Modul 11, fråga 9 · fallfråga",
    source: "Modul 11, fråga 9",
    checklist: [
      {
        heading: "Utgångsläge och målbild",
        points: [
          "Banken bör först klargöra sina strategiska mål och önskade kundutfall (customer outcomes).",
          "Därefter bedöms baseline för capabilities, value streams, information, applikationer och teknik.",
          "En target architecture anger önskad riktning och stöds av architectural principles och governance.",
        ],
      },
      {
        heading: "Vägen dit",
        points: [
          "I stället för att ersätta alla legacy-system samtidigt bör banken identifiera transition architectures.",
          "Initiativen prioriteras efter affärsvärde, risk och beroenden (dependency).",
          "Agile delivery kan användas för att utveckla capabilities inkrementellt.",
          "Arkitekturen utvecklas under tiden genom feedback och lärande.",
        ],
      },
    ],
    modelAnswer: "The bank should first clarify its strategic objectives and desired customer outcomes. It should then assess baseline capabilities, value streams, information, applications and technology. A target architecture should establish the desired direction, supported by architectural principles and governance. Rather than replacing all legacy systems simultaneously, the bank should identify transition architectures and prioritize initiatives according to business value, risk and dependency. Agile delivery can be used to incrementally develop capabilities while architecture evolves through feedback and learning.",
  },
  {
    id: "ea-e11-10",
    chapter: "kap11",
    label: "11: 10",
    question: "How could Agile influence the transformation?",
    context: "Modul 11, fråga 10 · fallfråga",
    source: "Modul 11, fråga 10",
    checklist: [
      {
        heading: "Agiles påverkan",
        points: [
          "Transformationen kan organiseras kring inkrementella produkter och capabilities.",
          "Arkitekturen utvecklas parallellt med leveransen (delivery).",
          "Det låter banken lära sig, leverera värde tidigare och justera arkitekturbeslut när ny information blir tillgänglig.",
        ],
      },
    ],
    modelAnswer: "The transformation could be organized around incremental products and capabilities, with architecture evolving alongside delivery. This would allow the bank to learn, deliver value earlier and adjust architectural decisions as information becomes available.",
  },
  {
    id: "ea-e12-29",
    chapter: "kap12",
    label: "12: 29",
    question: "Why should an Enterprise Architect understand business strategy?",
    context: "Modul 12, fråga 29 · kortsvarsfråga",
    source: "Modul 12, fråga 29",
    checklist: [
      {
        heading: "Därför behövs strategin",
        points: [
          "Arkitektur finns till för att stödja verksamhetens mål (enterprise objectives).",
          "Utan förståelse för strategin kan arkitekten inte avgöra vilka capabilities som behöver utvecklas, ändras eller skyddas.",
          "Utan strategin går det inte heller att bedöma arkitekturbeslut mot affärsprioriteringarna.",
        ],
      },
    ],
    modelAnswer: "Architecture exists to support enterprise objectives. Without understanding strategy, the architect cannot determine which capabilities need to be developed, changed or protected, nor can architectural decisions be evaluated against business priorities.",
  },
  {
    id: "ea-e12-30",
    chapter: "kap12",
    label: "12: 30",
    question: "Why is a capability often a useful starting point for transformation analysis?",
    context: "Modul 12, fråga 30 · kortsvarsfråga",
    source: "Modul 12, fråga 30",
    checklist: [
      {
        heading: "Därför börja med capability",
        points: [
          "En capability beskriver vad organisationen behöver kunna göra.",
          "Den kan därför koppla strategiska mål till processer, människor, information, applikationer och teknik.",
          "Den är inte alltför hårt bunden till nuvarande organisationsstruktur eller implementation.",
        ],
      },
    ],
    modelAnswer: "A capability describes what the organization needs to be able to do. It can therefore connect strategic objectives to processes, people, information, applications and technology without being tied too closely to the current organizational structure or implementation.",
  },
  {
    id: "ea-e12-31",
    chapter: "kap12",
    label: "12: 31",
    question: "What is the difference between a viewpoint and a view?",
    context: "Modul 12, fråga 31 · kortsvarsfråga. Samma fråga som modul 6 fråga 11.",
    source: "Modul 12, fråga 31",
    checklist: [
      {
        heading: "Viewpoint och view",
        points: [
          "En viewpoint definierar hur en viss intressents concern ska hanteras och representeras.",
          "En view är den resulterande representation som skapas med hjälp av den viewpointen.",
        ],
      },
    ],
    modelAnswer: "A viewpoint defines how a particular stakeholder concern should be addressed and represented. A view is the resulting representation created using that viewpoint.",
  },
  {
    id: "ea-e12-32",
    chapter: "kap12",
    label: "12: 32",
    question: "Why should architects be concerned with trade-offs?",
    context: "Modul 12, fråga 32 · kortsvarsfråga",
    source: "Modul 12, fråga 32",
    checklist: [
      {
        heading: "Därför trade-offs",
        points: [
          "Arkitekturbeslut har sällan bara fördelar.",
          "Mer standardisering, säkerhet, flexibilitet, hastighet eller kontroll kan ge kostnader eller begränsningar på andra håll.",
          "Arkitekter behöver därför göra trade-offs explicita och anpassa dem efter affärsmålen.",
        ],
      },
    ],
    modelAnswer: "Architectural decisions rarely have only benefits. Increasing standardization, security, flexibility, speed or control can introduce costs or limitations elsewhere. Architects therefore need to make trade-offs explicit and align them with business objectives.",
  },
  {
    id: "ea-e12-33",
    chapter: "kap12",
    label: "12: 33",
    question: "Why is architecture important in an Agile organization?",
    context: "Modul 12, fråga 33 · kortsvarsfråga",
    source: "Modul 12, fråga 33",
    checklist: [
      {
        heading: "Därför behövs arkitektur",
        points: [
          "Agila organisationer behöver fortfarande koherens, principer, riktning och hantering av stora beroenden och risker.",
          "Arkitekturen ger detta samtidigt som implementationsbeslut fattas på lämplig nivå.",
          "Arkitekturen kan själv utvecklas kontinuerligt (evolve continuously).",
        ],
      },
    ],
    modelAnswer: "Agile organizations still need coherence, principles, direction and management of significant dependencies and risks. Architecture provides these while allowing implementation decisions to be made at the appropriate level and enabling the architecture itself to evolve continuously.",
  },
  {
    id: "ea-e12-scenario-1",
    chapter: "kap12",
    label: "Scenario 1",
    question: "The CEO tells the Enterprise Architect: \"Every competitor is using AI. We need an\nAI strategy immediately.\"\nWhat should the architect do?",
    context: "Modul 12, Scenario 1 — \"We need AI\" · scenario",
    source: "Modul 12, Scenario 1 — \"We need AI\"",
    checklist: [
      {
        heading: "Utgångspunkt",
        points: [
          "Arkitekten bör först förstå vilka affärsmål och problem AI förväntas lösa.",
          "Först när affärsbehovet är fastställt bör specifika AI-tekniker utvärderas.",
        ],
      },
      {
        heading: "Frågor att ställa",
        points: [
          "Vilket business outcome försöker vi förbättra?",
          "Vilka capabilities skulle kunna gynnas?",
          "Vilka kund- eller affärsproblem finns?",
          "Vilken information/data krävs?",
          "Vilka risker och regulatoriska begränsningar (regulatory constraints) finns?",
          "Vilka förändringar i processer och operating model skulle behövas?",
          "Var skulle AI kunna ge meningsfullt värde?",
        ],
      },
      {
        heading: "Key lesson",
        points: [
          "Börja inte med tekniken, utan med syfte och utfall (purpose and outcomes).",
        ],
      },
    ],
    modelAnswer: "The architect should first understand the business objectives and problems that AI is expected to address. Relevant questions include:\na. What business outcome are we trying to improve?\nb. Which capabilities could benefit?\nc. Which customer or business problems exist?\nd. What information/data is required?\ne. What risks and regulatory constraints exist?\nf. What changes to processes and operating models would be necessary?\ng. Where could AI provide meaningful value?\nOnly after establishing the business need should specific AI technologies be evaluated.\nKey lesson\nDo not begin with technology. Begin with purpose and outcomes.",
  },
  {
    id: "ea-e12-scenario-2",
    chapter: "kap12",
    label: "Scenario 2",
    question: "A company has 600 applications.\nThe CIO declares: \"We have too many applications. We need to reduce the number to 300.\"\nIs this necessarily a good architectural objective?",
    context: "Modul 12, Scenario 2 — The application problem · scenario",
    source: "Modul 12, Scenario 2 — The application problem",
    checklist: [
      {
        heading: "Bedömning",
        points: [
          "Att minska till 300 applikationer är inte nödvändigtvis ett bra arkitekturmål.",
          "Antalet applikationer är inte i sig ett arkitekturproblem.",
        ],
      },
      {
        heading: "Vad arkitekten undersöker",
        points: [
          "Vilka capabilities stödjer applikationerna?",
          "Duplicerar applikationerna funktionalitet, och är dubbleringen i så fall avsiktlig?",
          "Vad kostar applikationerna och hur affärskritiska (business criticality) är de?",
          "Hur stor är den tekniska risken och vilka säkerhetsfrågor (security concerns) finns?",
          "Hur komplex är integrationen och hur mycket data dupliceras?",
          "Hur strategiskt relevanta är applikationerna?",
        ],
      },
      {
        heading: "Slutsats och key lesson",
        points: [
          "Målet bör bygga på business outcomes och arkitektoniska concerns, inte på ett godtyckligt antal applikationer.",
          "Key lesson: arkitektur ska adressera problem och utfall (outcomes), inte godtyckliga siffror.",
        ],
      },
    ],
    modelAnswer: "Not necessarily.\nThe number of applications is not, by itself, an architectural problem.\nThe architect should investigate:\nWhich capabilities they support.\nWhether applications duplicate functionality.\nWhether duplication is intentional.\nApplication costs.\nBusiness criticality.\nTechnical risk.\nIntegration complexity.\nData duplication.\nSecurity concerns.\nStrategic relevance.\nThe objective should be based on business outcomes and architectural concerns rather than an arbitrary application count.\nKey lesson\nArchitecture should address problems and outcomes, not arbitrary numbers.",
  },
  {
    id: "ea-e12-scenario-3",
    chapter: "kap12",
    label: "Scenario 3",
    question: "A product team says: \"We are Agile. Architecture approval is slowing us down.\nWe don't want architects involved.\"\nHow should the Enterprise Architect respond?",
    context: "Modul 12, Scenario 3 — The Agile conflict · scenario",
    source: "Modul 12, Scenario 3 — The Agile conflict",
    checklist: [
      {
        heading: "Utgångspunkt",
        points: [
          "Arkitekten avgör vilka beslut som verkligen kräver samordning på enterprise-nivå och vilka som kan delegeras.",
          "Målet är decentraliserad leverans inom lämpliga arkitekturgränser, inte centralt godkännande av varje beslut.",
        ],
      },
      {
        heading: "Vad arkitekturen kan ge",
        points: [
          "Arkitekturen kan ge principer (principles) och standarder.",
          "Arkitekturen kan ge guardrails och tydliga decision rights.",
          "Arkitekturen kan erbjuda återanvändbara capabilities och reference architectures.",
          "Arkitekturen kan ge vägledning om stora beroenden och risker.",
        ],
      },
      {
        heading: "Key lesson",
        points: [
          "God architecture governance ska möjliggöra agilitet, inte begränsa den i onödan.",
        ],
      },
    ],
    modelAnswer: "The architect should determine which decisions genuinely require enterprise-level coordination and which can be delegated.\nArchitecture can provide:\nPrinciples\nStandards\nGuardrails\nReusable capabilities\nReference architectures\nDecision rights\nGuidance on significant dependencies and risks\nThe objective should be to enable decentralized delivery within appropriate architectural boundaries, rather than requiring centralized approval for every decision.\nKey lesson\nGood architecture governance should enable agility, not unnecessarily restrict it.",
  },
  {
    id: "ea-e12-scenario-4",
    chapter: "kap12",
    label: "Scenario 4",
    question: "A bank has a 30-year-old core banking system.\nManagement says: \"It's old, so it must be replaced.\"\nIs age alone a sufficient architectural reason for replacement?",
    context: "Modul 12, Scenario 4 — The legacy system · scenario",
    source: "Modul 12, Scenario 4 — The legacy system",
    checklist: [
      {
        heading: "Bedömning",
        points: [
          "Nej, ålder ensam är inte ett tillräckligt arkitektoniskt skäl för att ersätta systemet.",
          "Ett tekniskt gammalt system kan fortfarande vara värdefullt och stabilt.",
          "Omvänt kan ett nyare system skapa betydande arkitektonisk risk.",
        ],
      },
      {
        heading: "Vad arkitekten bedömer",
        points: [
          "Arkitekten bedömer systemets affärsvärde (business value) och affärskritikalitet (business criticality).",
          "Arkitekten bedömer teknisk hälsa, säkerhet och underhållbarhet (maintainability).",
          "Arkitekten bedömer kostnad, förändringsbegränsningar (change constraints) och integrationsbegränsningar.",
          "Arkitekten bedömer vilka alternativ som finns och den strategiska riktningen (strategic direction).",
        ],
      },
      {
        heading: "Möjliga svar och key lesson",
        points: [
          "Beroende på omständigheterna kan svaret bli ersättning, inkapsling (encapsulation), modernisering eller re-platforming.",
          "Svaret kan också bli avveckling (retirement) eller fortsatt användning.",
          "Key lesson: arkitekturbeslut ska vara evidensbaserade och inte styras av etiketter som \"legacy\".",
        ],
      },
    ],
    modelAnswer: "No.\nThe architect should assess:\nBusiness value\nBusiness criticality\nTechnical health\nSecurity\nMaintainability\nCost\nChange constraints\nIntegration limitations\nAvailability of alternatives\nStrategic direction\nA technically old system may still be valuable and stable. Conversely, a newer system may create significant architectural risk.\nThe appropriate response might involve:\nReplacement\nEncapsulation\nModernization\nRe-platforming\nRetirement\nContinued use depending on the circumstances.\nKey lesson\nArchitectural decisions should be evidence-based rather than driven by labels such as \"legacy.\"",
  },
  {
    id: "ea-e12-scenario-5",
    chapter: "kap12",
    label: "Scenario 5",
    question: "A retailer has launched a mobile app and declares: \"We have completed our digital transformation.\"\nWhat should the architect investigate?",
    context: "Modul 12, Scenario 5 — Digital transformation · scenario",
    source: "Modul 12, Scenario 5 — Digital transformation",
    checklist: [
      {
        heading: "Kärnfrågan",
        points: [
          "Arkitekten frågar om mobilappen har förändrat hur verksamheten skapar och levererar värde.",
          "Att bara lägga till en digital kanal kan vara digitalization snarare än bredare digital transformation.",
        ],
      },
      {
        heading: "Frågor att ställa",
        points: [
          "Har kundupplevelsen (customer experience) förändrats?",
          "Har nya produkter eller tjänster skapats?",
          "Har operating model förändrats?",
          "Är processerna fundamentalt annorlunda?",
          "Fattas besluten mer datadrivet (data-driven)?",
          "Har affärsmodellen (business model) förändrats?",
          "Skapas nya digitala ekosystem (digital ecosystems)?",
          "Har organisationens capabilities förändrats?",
        ],
      },
    ],
    modelAnswer: "The architect should ask whether the mobile application has changed how the enterprise creates and delivers value.\nQuestions could include:\nHas the customer experience changed?\nHave new products or services been created?\nHas the operating model changed?\nAre processes fundamentally different?\nAre decisions more data-driven?\nHas the business model changed?\nAre new digital ecosystems being created?\nHas organizational capability changed?\nSimply adding a digital channel may be digitalization rather than broader digital transformation.",
  },
  {
    id: "ea-e12-35",
    chapter: "kap12",
    label: "12: 35",
    question: "A company describes:\n\"Customer onboarding\"\n\"The organization is able to onboard customers.\"\n\"Verify customer identity.\"\n\"Digital onboarding.\"\nWhich are most likely to be processes and which are capabilities?",
    context: "Modul 12, fråga 35 (Capability or process?) · kortsvarsfråga",
    source: "Modul 12, fråga 35 (Capability or process?)",
    checklist: [
      {
        heading: "Process eller capability",
        points: [
          "\"Verify customer identity\" är en process/aktivitet, medan \"The organization is able to onboard customers\" är en capability.",
          "\"Customer onboarding\" kan vara antingen en capability eller en process beroende på modelleringskontexten.",
          "\"Digital onboarding\" kan vara en capability, ett value stream stage eller en solution context beroende på modellen.",
          "Important lesson: namnet avgör inte ensamt vilket arkitekturbegrepp det är, kontexten avgör.",
        ],
      },
    ],
    modelAnswer: "The precise classification depends on the modeling context, but generally:\na. \"Verify customer identity\" → process/activity\nb. \"The organization is able to onboard customers\" → capability\nc. \"Customer onboarding\" → could represent either a capability or process depending on the modeling context\nd. \"Digital onboarding\" → could represent a capability, value stream stage or solution context depending on the model\nImportant lesson\nNames alone don't determine the architectural concept. Context matters.",
  },
  {
    id: "ea-e12-essay-1",
    chapter: "kap12",
    label: "Essay 1",
    question: "Explain why Enterprise Architecture should be considered a discipline for enabling change rather than merely documenting the current enterprise.",
    context: "Modul 12, Essay 1 · essäfråga",
    source: "Modul 12, Essay 1",
    checklist: [
      {
        heading: "Från förståelse till beslut",
        points: [
          "Enterprise Architecture ger ett strukturerat sätt att förstå verksamheten och avgöra hur den ska utvecklas för att nå strategiska mål.",
          "Dokumentation av nuläget (current state) är användbar eftersom den ger förståelse för befintliga capabilities, processer, information, applikationer och teknik.",
          "Arkitekturen blir strategiskt värdefull först när förståelsen används för beslut om framtida tillstånd (future states) och övergångar (transitions).",
        ],
      },
      {
        heading: "Arkitektur som förändring",
        points: [
          "Enterprise Architecture kopplar nuvarande förhållanden till önskade utfall (desired outcomes).",
          "Den identifierar gap, beroenden, risker och möjligheter.",
          "Den stödjer beslut om hur verksamheten ska förändras.",
          "Vid digital transformation och ständig förändring måste arkitekturen själv utvecklas i stället för att bli en statisk dokumentationsövning.",
        ],
      },
    ],
    modelAnswer: "Enterprise Architecture provides a structured way of understanding the enterprise and determining how it should evolve to achieve strategic objectives. Currentstate documentation is useful because it provides an understanding of existing capabilities, processes, information, applications and technology. However, architecture becomes strategically valuable when that understanding is used to make decisions about future states and transitions.\nEnterprise Architecture therefore connects current conditions with desired outcomes. It identifies gaps, dependencies, risks and opportunities and supports decisions about how the enterprise should change. In an environment characterized by digital transformation and continuous change, architecture must itself evolve rather than becoming a static documentation exercise.",
  },
  {
    id: "ea-e12-essay-2",
    chapter: "kap12",
    label: "Essay 2",
    question: "Compare the roles of Zachman and TOGAF in Enterprise Architecture.",
    context: "Modul 12, Essay 2 · essäfråga. Samma fråga som modul 4 fråga 10 och modul 5 fråga 12.",
    source: "Modul 12, Essay 2",
    checklist: [
      {
        heading: "Vad de är",
        points: [
          "Zachman och TOGAF hanterar olika aspekter av Enterprise Architecture.",
          "Zachman är en ontology och ett klassificeringsschema som ordnar beskrivningar efter perspektiv och interrogatives som What, How, Where, Who, When och Why.",
          "TOGAF är en bredare samling vägledning för Enterprise Architecture och innehåller Architecture Development Method (ADM).",
          "ADM ger ett strukturerat sätt att utveckla och vidareutveckla (evolve) arkitektur.",
        ],
      },
      {
        heading: "Jämförelse och slutsats",
        points: [
          "Zachman hjälper arkitekter att tänka på vad som behöver beskrivas och från vilka perspektiv.",
          "TOGAF ger vägledning om hur arkitektur kan utvecklas och styras (governed).",
          "De kompletterar därför varandra snarare än att vara konkurrerande angreppssätt.",
        ],
      },
    ],
    modelAnswer: "Zachman and TOGAF address different aspects of Enterprise Architecture.\nZachman provides an ontology and classification schema for organizing descriptions of an enterprise according to perspectives and interrogatives such as What, How, Where, Who, When and Why.\nTOGAF provides a broader body of guidance for Enterprise Architecture and includes the Architecture Development Method, which provides a structured approach to developing and evolving architecture.\nZachman therefore helps architects think about what needs to be described and from which perspectives, while TOGAF provides guidance concerning how architecture can be developed and governed.\nThey can therefore be complementary rather than competing approaches.",
  },
  {
    id: "ea-e12-essay-3",
    chapter: "kap12",
    label: "Essay 3",
    question: "Explain how business capabilities can connect strategy, Enterprise Architecture and digital transformation.",
    context: "Modul 12, Essay 3 · essäfråga",
    source: "Modul 12, Essay 3",
    checklist: [
      {
        heading: "Strategi, capabilities och arkitektur",
        points: [
          "Strategin fastställer verksamhetens riktning och mål (objectives).",
          "Capabilities översätter målen till de förmågor som verksamheten behöver ha.",
          "Arkitekter kan sedan avgöra vilka processer, människor, information, applikationer och teknik som krävs för att stödja eller transformera dessa capabilities.",
        ],
      },
      {
        heading: "Digital transformation",
        points: [
          "Digital transformation innebär ofta att capabilities förändras eller att nya skapas.",
          "Capability-based analysis blir därmed en brygga mellan strategisk avsikt (strategic intent) och arkitektonisk implementation.",
          "Den hjälper också organisationer att prioritera investeringar efter affärsvärde snarare än att bara välja teknik.",
        ],
      },
    ],
    modelAnswer: "Strategy establishes the direction and objectives of the enterprise.\nCapabilities translate those objectives into the abilities the enterprise needs to possess. Architects creating new ones. Capability-based analysis therefore provides a bridge between strategic intent and architectural implementation. It also helps organizations prioritize investments can then determine what processes, people, information, applications and technology are required to support or transform those capabilities.\nDigital transformation frequently involves changing capabilities or creating new ones. Capability-based analysis therefore provides a bridge between strategic intent and architectural implementation. It also helps organizations prioritize investments according to business value rather than simply selecting technologies.",
  },
  {
    id: "ea-e12-essay-4",
    chapter: "kap12",
    label: "Essay 4",
    question: "Explain why architecture governance should be designed to support rather than prevent agility.",
    context: "Modul 12, Essay 4 · essäfråga",
    source: "Modul 12, Essay 4",
    checklist: [
      {
        heading: "Varför governance behövs",
        points: [
          "Organisationer behöver governance för att bevara koherens och hantera risk.",
          "Governance säkerställer att viktiga arkitekturbeslut stödjer de strategiska målen.",
          "Överdrivet centraliserat godkännande kan dock bromsa leveransen och hindra teamen från att snabbt anpassa sig till ändrade förutsättningar.",
        ],
      },
      {
        heading: "Governance som stödjer agilitet",
        points: [
          "Effektiv architecture governance fastställer principer, decision rights, guardrails och eskaleringsmekanismer (escalation mechanisms).",
          "Rutinbeslut kan delegeras, medan beslut med stora konsekvenser för hela verksamheten får lämplig arkitekturtillsyn (architectural oversight).",
          "På så sätt kan governance ge både konsekvens (consistency) och autonomi.",
        ],
      },
    ],
    modelAnswer: "Organizations need governance to maintain coherence, manage risk and ensure that important architectural decisions support strategic objectives.\nHowever, excessive centralized approval can slow delivery and prevent teams from responding quickly to changing circumstances.\nEffective architecture governance therefore establishes principles, decision rights, guardrails and escalation mechanisms. Routine decisions can be delegated while decisions with significant enterprise-wide consequences can receive appropriate architectural oversight. In this way, governance can provide both consistency and autonomy.",
  },
  {
    id: "ea-e12-essay-5",
    chapter: "kap12",
    label: "Essay 5",
    question: "\"Enterprise Architecture is about relationships and trade-offs.\" Discuss.",
    context: "Modul 12, Essay 5 · essäfråga",
    source: "Modul 12, Essay 5",
    checklist: [
      {
        heading: "Relationer",
        points: [
          "Enterprise Architecture handlar inte bara om enskilda komponenter utan om relationerna mellan dem.",
          "Relationerna gäller affärsmål, capabilities, processer, information, applikationer, teknik, människor och organisationsstrukturer.",
          "En förändring i ett element kan påverka många andra.",
          "Att ändra en business capability kan till exempel kräva ändringar i processer, information, applikationer och teknik.",
        ],
      },
      {
        heading: "Trade-offs",
        points: [
          "Arkitekturbeslut innebär också trade-offs.",
          "Mer standardisering kan förbättra effektiviteten men minska flexibiliteten.",
          "Mer säkerhet kan skapa extra friktion (friction).",
          "Centralisering kan förbättra kontrollen men minska den lokala autonomin.",
        ],
      },
      {
        heading: "Arkitektens roll",
        points: [
          "Enterprise Architect hjälper intressenterna att förstå dessa relationer.",
          "Arkitekten hjälper dem att göra explicita trade-offs som stödjer verksamhetens mål.",
        ],
      },
    ],
    modelAnswer: "Enterprise Architecture is concerned not only with individual components but with the relationships between business objectives, capabilities, processes, information, applications, technology, people and organizational structures.\nChanges to one element can affect many others. For example, changing a business capability may require changes to processes, information, applications and technology.\nArchitectural decisions also involve trade-offs. Greater standardization may improve efficiency but reduce flexibility. Greater security may introduce additional friction. Centralization may improve control but reduce local autonomy.\nThe Enterprise Architect therefore helps stakeholders understand these relationships and make explicit trade-offs that support enterprise objectives.",
  },
  {
    id: "ea-e12-slututmaning",
    chapter: "kap12",
    label: "Final challenge",
    question: "Given the following statement: - \"Our company needs a new CRM because our competitors have better CRM-systems.\"\n\"You have been appointed Enterprise Architect. - What do you do?\"\nA strong student should not immediately answer:\n\"Let's evaluate CRM products.\"",
    context: "Modul 12, Final challenge · fallfråga",
    source: "Modul 12, Final challenge",
    checklist: [
      {
        heading: "Problem och nuläge",
        points: [
          "I stället för att direkt utvärdera CRM-produkter börjar arkitekten med att ställa frågor.",
          "Vilket affärsproblem försöker vi lösa, och vilket strategiskt mål driver detta?",
          "Vilka capabilities berörs, och var finns capability gaps?",
          "Hur ser den nuvarande kundresan (customer journey) ut?",
          "Vilken information berörs och vilka processer behöver förändras?",
          "Vilka applikationer stödjer i dag dessa capabilities?",
        ],
      },
      {
        heading: "Vägen framåt",
        points: [
          "Vilka architectural principles gäller?",
          "Vilka alternativ finns, och vilka trade-offs innebär de?",
          "Hur ser target architecture ut?",
          "Vilken övergång (transition) är realistisk?",
          "Hur ska förändringen styras (governed)?",
        ],
      },
    ],
    modelAnswer: "Instead, they should start asking:\nWhat business problem are we trying to solve?\nWhich strategic objective is driving this?\nWhich capabilities are affected?\nWhat is the current customer journey?\nWhere are the capability gaps?\nWhat information is involved?\nWhat processes need to change?\nWhat applications currently support those capabilities?\nWhat architectural principles apply?\nWhat options exist?\nWhat are the trade-offs?\nWhat is the target architecture?\nWhat transition is realistic?\nHow should the change be governed?",
  },
];
