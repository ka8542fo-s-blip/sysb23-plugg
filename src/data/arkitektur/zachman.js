// Zachman-vyn för Verksamhetsarkitektur: ett eget 6×6-rutnät (R1–R6 ×
// K1–K6, samma numrering som tentan), memorering av rad- och kolumnnamn och
// placeringsuppgifter i tentans form.
//
// Källor: modul 4, UF:s svenska Zachman-bilder och de två affischerna i
// föreläsningsbilderna (2003 från Intervista Institute, version 3.0 från
// Zachman International). Affischerna är upphovsrättsskyddade och ligger
// aldrig i repot; rad- och kolumnnamn, celltyper och begreppspar är fakta.
//
// Placeringsuppgifterna är HT25-tentornas. Det finns inget officiellt facit.
// grade "S" = säker utifrån affischen eller bilderna, "T" = tolkning (vyn
// visar då "Inget officiellt facit – tolkning utifrån ramverket."). Facit
// följer planeringschattens B5 med tre justeringar efter kontroll mot
// affischen (se HANDOFF): uppdateringsbeslut R2K5 före R4K5, ansvarsroller
// R3K4/R2K4 i stället för R4K4, mjukvarusystem godtar även R4K3.
//
// Listorna har `key`, inte `id`, där de inte är uppgifter: progress-lists-
// testet kräver att varje importerad lista med id:n laddas som framsteg.

export const COLUMNS = [
  {
    code: "K1", sv: "Vad", en: "What", poster: "Data",
    about: "Det verksamheten vill veta något om: begrepp, ontologier och semantiska modeller. Begreppen måste vara definierade och relaterade till varandra.",
    example: "Student, program, kurs, poäng, prov, helårsstudent",
  },
  {
    code: "K2", sv: "Hur", en: "How", poster: "Function",
    about: "Vad verksamheten sysslar med: processer och delprocesser, och hur resurserna omvandlar input till output.",
    example: "Antagning, registrering, kursutveckling, examination, undervisning",
  },
  {
    code: "K3", sv: "Var", en: "Where", poster: "Network",
    about: "Var arbetet utförs: verksamhetens platser och det logistiska systemet, alltså hur fysiskt åtskilda uppgifter hänger ihop.",
    example: "Lund, EC2, institutionen för informatik",
  },
  {
    code: "K4", sv: "Vem", en: "Who", poster: "People",
    about: "Vem som utför arbetet och har ansvaret: organisatoriska enheter, personal, arbetsflödesmodeller, organisationsscheman och ansvarsmatriser.",
    example: "Antagningsavdelningen, Ekonomihögskolan, institutionen, kursansvarig, lärare, studenter",
  },
  {
    code: "K5", sv: "När", en: "When", poster: "Time",
    about: "När i tiden uppgifter ska utföras: händelser, flöden, cykler och ordningsföljd, som måste schemaläggas noggrant.",
    example: "Ansökan lämnas in innan förkunskaperna bedöms, bedömningen sker innan beslut om antagning, antagningen sker innan registrering",
  },
  {
    code: "K6", sv: "Varför", en: "Why", poster: "Motivation",
    about: "Verksamhetens grund: mål, syften, visioner och strategier.",
    example: "Syften och krav i högskolelagen och högskoleförordningen, antalet helårsstudenter och helårsprestationer, strategisk plan, lärandemål",
  },
];

export const ROWS = [
  {
    code: "R1", name: "Scope", perspective: "Planner",
    v3: "Executive Perspective (Business Context Planners)", v3Model: "Scope Contexts (Scope Identification Lists)",
    about: "Verksamhetens omfång och sammanhang. Beskrivningarna är listor.",
  },
  {
    code: "R2", name: "Business Model", perspective: "Owner",
    v3: "Business Mgmt Perspective (Business Concept Owners)", v3Model: "Business Concepts (Business Definition Models)",
    about: "Verksamhetsägarens perspektiv: konceptuella modeller av verksamheten.",
  },
  {
    code: "R3", name: "System Model", perspective: "Designer",
    v3: "Architect Perspective (Business Logic Designers)", v3Model: "System Logic (System Representation Models)",
    about: "Designerns perspektiv: logiska modeller av informationssystemen.",
  },
  {
    code: "R4", name: "Technology Model", perspective: "Builder",
    v3: "Engineer Perspective (Business Physics Builders)", v3Model: "Technology Physics (Technology Specification Models)",
    about: "Byggarens perspektiv: tekniska, fysiska modeller.",
  },
  {
    code: "R5", name: "Detailed Representations", perspective: "Subcontractor",
    v3: "Technician Perspective (Business Component Implementers)", v3Model: "Tool Components (Tool Configuration Models)",
    about: "Underleverantörens perspektiv: detaljerade specifikationer av komponenterna.",
  },
  {
    code: "R6", name: "Functioning Enterprise", perspective: null,
    v3: "Enterprise Perspective (Users)", v3Model: "Operations Instances (Implementations)",
    about: "Den fungerande verksamheten själv, inte en modell av den.",
  },
];

// Cellerna på 2003-affischen: namn och begreppspar. v3 = cellens rubrik i
// version 3.0 (kolumnens klassifikation × radens transformation).
const V3_COL = ["Inventory", "Process", "Distribution", "Responsibility", "Timing", "Motivation"];
const V3_ROW = ["Identification", "Definition", "Representation", "Specification", "Configuration", "Instantiations"];
const NAMES = [
  ["List of Things", "List of Processes", "List of Locations", "List of Organizations", "List of Cycles", "List of Goals"],
  ["Semantic Model", "Business Process Model", "Logistics Network", "Work Flow Model", "Master Schedule", "Business Plan"],
  ["Logical Data Model", "Application Architecture", "Distributed System Architecture", "Human Interface Architecture", "Processing Structure", "Business Rule Model"],
  ["Data Design", "System Design", "Technology Architecture", "Presentation Architecture", "Control Structure", "Rule Design"],
  ["Data Definition", "Program", "Network Architecture", "Security Architecture", "Timing Definition", "Rule Specification"],
  ["Example Data", "Example Function", "Example Network", "Example Organization", "Example Schedule", "Example Strategy"],
];
const PAIRS = [
  ["ENTITY = Class of Business Entities", "PROCESS = Class of Business Processes", "NODE = Class of Business Locations", "PEOPLE = Class of Business Organizations", "CYCLE = Class of Business Cycles", "END = Class of Business Objectives"],
  ["ENTITY = Business Entity, RELATION = Business Relationship", "I/O = Business Resources, PROCESS = Business Process", "NODE = Business Location, LINK = Business Linkage", "PEOPLE = Organization Unit, WORK = Work Product", "TIME = Business Event, CYCLE = Business Cycle", "ENDS = Business Objective, MEANS = Business Strategy"],
  ["ENTITY = Data Entity, RELATION = Data Relationship", "I/O = User Views, PROCESS = Application Function", "NODE = IS Function, LINK = Line Characteristics", "PEOPLE = Role, WORK = Deliverable", "TIME = System Event, CYCLE = Processing Cycle", "ENDS = Structural Assertion, MEANS = Action Assertion"],
  ["ENTITY = Table/Segment/etc., RELATION = Key/Pointer/etc.", "I/O = Data Elements/Sets, PROCESS = Computer Function", "NODE = Hardware/System Software, LINK = Line Specifications", "PEOPLE = User, WORK = Screen/Device Formats", "TIME = Execute, CYCLE = Component Cycle", "ENDS = Condition, MEANS = Action"],
  ["ENTITY = Field, RELATION = Address", "I/O = Control Block, PROCESS = Language Statement", "NODE = Addresses, LINK = Protocols", "PEOPLE = Identity, WORK = Job", "TIME = Interrupt, CYCLE = Machine Cycle", "ENDS = Sub-condition, MEANS = Step"],
  [null, null, null, null, null, null],
];

export const CELLS = Object.fromEntries(
  ROWS.flatMap((row, r) =>
    COLUMNS.map((col, c) => [
      `${row.code}${col.code}`,
      { name: NAMES[r][c], pair: PAIRS[r][c], v3: `${V3_COL[c]} ${V3_ROW[r]}` },
    ]),
  ),
);

export const CELL_CODES = Object.keys(CELLS);

// Memoreringens godtagna svar: 2003- eller 3.0-namn, engelska eller svenska
// frågeord. Jämförs efter normalisering (gemener, å/ä/ö och skiljetecken
// fällda, se lib/zachman.js).
export const MEMORY_ACCEPT = {
  K1: ["vad", "what", "data"],
  K2: ["hur", "how", "function", "funktion"],
  K3: ["var", "where", "network", "natverk"],
  K4: ["vem", "who", "people", "manniskor"],
  K5: ["nar", "when", "time", "tid"],
  K6: ["varfor", "why", "motivation"],
  R1: ["scope", "planner", "executive", "scope contexts"],
  R2: ["business model", "owner", "business mgmt", "business management", "business concepts"],
  R3: ["system model", "designer", "architect", "system logic"],
  R4: ["technology model", "builder", "engineer", "technology physics"],
  R5: ["detailed representations", "detailed representation", "subcontractor", "technician", "tool components"],
  R6: ["functioning enterprise", "enterprise", "users", "user", "operations instances"],
};

const UNOFFICIAL = "T";

// Placering av modeller och beskrivningar (okt och dec 2025, uppgift 2).
// Objekt som står på båda tentorna är samma uppgift.
const PLACEMENTS = [
  {
    id: "zp-organisationsdiagram", text: "Ett organisationsdiagram", cells: ["R2K4"], also: ["R1K4"], grade: UNOFFICIAL,
    why: "Organisationsscheman hör till Vem-kolumnen (K4), som läraren beskriver den. Ett diagram över verksamhetens enheter är verksamhetsägarens modell (rad 2, där affischens begreppspar är Organization Unit och Work Product). Är det bara en lista över organisationer passar rad 1 (List of Organizations).",
  },
  {
    id: "zp-java", text: "En metod implementerad i Java", cells: ["R5K2"], also: [], grade: "S",
    why: "En metod i Java är ett program, och affischens R5K2 heter Program (I/O = Control Block, PROCESS = Language Statement). Hur-kolumnen eftersom det är en funktion, rad 5 eftersom det är en detaljerad representation på kodnivå.",
  },
  {
    id: "zp-natverk", text: "En ritning över ett företags befintliga nätverk med servrar, routrar mm", cells: ["R4K3"], also: ["R5K3"], grade: UNOFFICIAL,
    why: "Nätverk hör till Var-kolumnen (K3). Servrar och routrar är teknik: Technology Architecture (R4K3) har begreppsparet NODE = Hardware/System Software, LINK = Line Specifications. Går ritningen ned till adresser och protokoll passar Network Architecture (R5K3).",
  },
  {
    id: "zp-granssnitt", text: "Arkitekturen för gränssnittet för ett nytt system", cells: ["R3K4"], also: [], grade: "S",
    why: "Affischens R3K4 heter Human Interface Architecture: arkitekturen för gränssnittet på systemnivå (PEOPLE = Role, WORK = Deliverable). Vem-kolumnen eftersom gränssnittet gäller människorna som arbetar med systemet.",
  },
  {
    id: "zp-arbetsflode", text: "En arbetsflödesmodell", cells: ["R2K4"], also: [], grade: "S",
    why: "Work Flow Model står i R2K4 på affischen (PEOPLE = Organization Unit, WORK = Work Product): vem som gör vilket arbete. Läraren nämner arbetsflöden också under Hur, men affischen placerar arbetsflödesmodellen i Vem-kolumnen.",
  },
  {
    id: "zp-regler", text: "En modell över verksamhetsregler", cells: ["R3K6"], also: [], grade: "S",
    why: "Affischens R3K6 heter Business Rule Model (ENDS = Structural Assertion, MEANS = Action Assertion). Regler hör till Varför-kolumnen.",
  },
  {
    id: "zp-processmodell", text: "Ett företags processmodell", cells: ["R2K2"], also: [], grade: "S",
    why: "Business Process Model står i R2K2: verksamhetens processer (Hur) som verksamhetsägarens konceptuella modell (rad 2).",
  },
  {
    id: "zp-logistik", text: "En nätverksmodell över en verksamhets logistiksystem", cells: ["R2K3"], also: [], grade: "S",
    why: "Logistics Network står i R2K3 (NODE = Business Location, LINK = Business Linkage): verksamhetens platser och hur de hänger ihop, på verksamhetsnivå.",
  },
  {
    id: "zp-relationsscheman", text: "Relationsscheman för en databas", cells: ["R3K1"], also: ["R4K1"], grade: UNOFFICIAL,
    why: "Relationsscheman beskriver data (Vad). Som logisk modell av entiteter och relationer hör de till Logical Data Model (R3K1). Läses de som tabeller och nycklar passar Data Design (R4K1: ENTITY = Table, RELATION = Key). Båda går att motivera.",
  },
  {
    id: "zp-affarshandelser", text: "En lista över viktiga affärshändelser", cells: ["R1K5"], also: [], grade: "S",
    why: "En lista hör till rad 1, och händelser till När-kolumnen (läraren: händelser, flöden, cykler). Affischen kallar cellen List of Cycles.",
  },
  {
    id: "zp-uppdateringsbeslut", text: "Schemaläggning av mjukvaruuppdateringsbeslut", cells: ["R2K5"], also: ["R4K5"], grade: UNOFFICIAL,
    why: "Ett schema för när beslut fattas hör till När-kolumnen. Som verksamhetens schema är det Master Schedule (R2K5). Läses det som systemets tekniska uppdateringscykel kan R4K5 motiveras, men affischens R4K5 är Control Structure (TIME = Execute, CYCLE = Component Cycle), alltså exekveringsstyrning och inte beslut.",
  },
  {
    id: "zp-mjukvarusystem", text: "En beskrivning av vart mjukvarusystem hör hemma", cells: ["R3K3"], also: ["R4K3"], grade: UNOFFICIAL,
    why: "Var informationssystemen hör hemma är en Var-fråga på systemnivå: Distributed System Architecture (R3K3, NODE = IS Function). Gäller beskrivningen vilken hårdvara och systemprogramvara systemen körs på passar Technology Architecture (R4K3).",
  },
  {
    id: "zp-ansvarsroller", text: "Ansvarsroller gällande utveckling av teknologilösningar", cells: ["R3K4"], also: ["R2K4"], grade: UNOFFICIAL,
    why: "Roller och ansvar hör till Vem-kolumnen. Affischens R3K4 har begreppsparet PEOPLE = Role, WORK = Deliverable, vilket passar roller i systemutvecklingen. Läses det som verksamhetens ansvarsfördelning passar R2K4 (Organization Unit, Work Product). R4K4 är Presentation Architecture (User, Screen/Device Formats) och passar inte.",
  },
  {
    id: "zp-ekonomisystem", text: "En nätverksmodell över en verksamhets ekonomisystem", cells: ["R3K3"], also: ["R2K3"], grade: UNOFFICIAL,
    why: "En nätverksmodell hör till Var-kolumnen. Gäller den hur ett informationssystem (ekonomisystemet) är fördelat är det Distributed System Architecture (R3K3). Läses den som verksamhetens nätverk av platser passar Logistics Network (R2K3).",
  },
];

// Majtentan 2026, uppgift 2–8: "Välj ett eller flera alternativ". Rätt är
// exakt facitalternativet. Alternativen och lydelsen ordagrant ur tentan.
const MAY = [
  {
    id: "zm-2", no: 2, points: 3, correct: 1, grade: UNOFFICIAL,
    text: "I verksamheten finns en arbetsuppgift som är kopplad till användargränssnittet för en funktion för inläggning av kundordern i orderhanteringsdelen av ett ERP. Det är en orderhanterare som använder funktionen för arbetsuppgiften. Vilken/vilka cell/celler i ramverket överrensstämmer bäst. (3p)",
    options: ["R3K2, R3K6", "R4K4, R2K2, R2K4", "R4K4, R2K2, R3K4, R3K6", "Inget av de övriga alternativen"],
    why: "Arbetsuppgiften vid skärmen är R4K4 (Presentation Architecture: PEOPLE = User, WORK = Screen/Device Formats). Själva orderinläggningen är en verksamhetsprocess (R2K2), och orderhanteraren som utför arbetet hör till arbetsflödet (R2K4). De andra alternativen drar in regler (R3K6), som texten inte nämner.",
  },
  {
    id: "zm-3", no: 3, points: 3, correct: 3, grade: UNOFFICIAL,
    text: "Ordern har ordernummer och gäller produkter med: varugruppsnummer (FK), produktnummer (PK) och produktbenämning. Vilken cell/celler tillhör ordern? (3p)",
    options: ["R2K1", "Inget av de övriga alternativen", "R1K1", "R4K1"],
    why: "Ordern med primär- och främmande nycklar är en datamodell på teknisk nivå: Data Design (R4K1: ENTITY = Table, RELATION = Key). R3K1 (Logical Data Model) finns inte bland alternativen; menar läraren den blir svaret \"Inget av de övriga alternativen\".",
  },
  {
    id: "zm-4", no: 4, points: 3, correct: 2, grade: UNOFFICIAL,
    text: "Styrelsen har givit VD och områdescheferna uppdraget att utveckla en ny strategisk plan för verksamheterna i Y-stad och X-löv efter sammanslagningen med en konkurrent i V-löv. Vilken cell/celler tillhör ordern? (3p)",
    options: ["R2K6, R1K4, R3K1", "Inget av de övriga alternativen.", "R2K6, R1K4, R1K3", "R1K6, R1K4"],
    why: "Den strategiska planen är verksamhetens Business Plan (R2K6). Styrelsen, vd och områdescheferna är organisationer (List of Organizations, R1K4) och orterna platser (List of Locations, R1K3). R3K1 i första alternativet är en logisk datamodell, som texten inte handlar om. Frågan säger \"tillhör ordern\" fast den gäller planen — så står det på tentan.",
  },
  {
    id: "zm-5", no: 5, points: 3, correct: 0, grade: UNOFFICIAL,
    text: "Leveransen av ordern sker från lokalt lager. Om varan bristas (färre i lager än antalet i orderraden) dellevereras ordern från lokalt lager och bristade artiklar restnoteras i ordern. Bristade artiklar beställs från centralt lager för leverans till lokalt lager. Restnoterade artiklar levereras direkt från centralt lager till kund. Vilken cell/celler tillhör ordern? (3p)",
    options: ["R2K3, R2K2, R2K6", "Inget av de övriga alternativen.", "R2K6, R1K3", "R3K3, R2K2"],
    why: "Flödet mellan lokalt och centralt lager är verksamhetens logistiknätverk (R2K3, Logistics Network) och processen för leverans och restnotering (R2K2). R2K6 (Business Plan: ENDS = Business Objective, MEANS = Business Strategy) motiveras som verksamhetens medel, leveransprincipen; regler står först på rad 3 (R3K6), så den delen är svagast. Alternativet är ändå det bästa: \"R3K3, R2K2\" lägger nätverket på systemnivå, vilket texten inte stöder.",
  },
  {
    id: "zm-6", no: 6, points: 3, correct: 2, grade: UNOFFICIAL,
    text: "Produktionen i Ö-stad kör tvåskift: 05:36 till 14:24 och 14:24 till 23:12. Skiftlag A jobbar 05:36 till 14:24 udda veckor och skiftlag B jobbar 05:36 till 14:24 jämna veckor. Vilken/vilka celler hör uppgiften hemma i? (3p)",
    options: ["Inget av de övriga alternativen", "R2K5, R1K4, R1K3.", "R2K5, R2K4", "R2K5, R1K3"],
    why: "Skiftschemat är verksamhetens Master Schedule (R2K5: TIME = Business Event, CYCLE = Business Cycle), och skiftlagen är arbetsorganisationen (R2K4, Work Flow Model). R1K3 och R1K4 är listor, inte ett schema.",
  },
  {
    id: "zm-7", no: 7, points: 3, correct: 2, grade: UNOFFICIAL,
    text: "I ett användningsfall (UML Use Case) för ett av systemen som används i verksamheten finns aktörerna säljare och ordermottagare. I fallet interagerar aktörerna med systemet genom dess funktioner för ’söka kund’, ’visa kund’, ’lägga upp kund’, ’lägga upp konto’ och ’lägga in order’. Vilken/vilka celler överensstämmer? (3p)",
    options: ["R2K4, R3K3, R4K4", "R2K4, R3K3", "Inget av de övriga alternativen.", "R1K4, R3K2, R4K4, R3K3"],
    why: "Ett use case beskriver systemets funktioner (Application Architecture, R3K2) och aktörernas roller (R3K4, PEOPLE = Role). Inget alternativ har den kombinationen: alla innehåller R3K3 (Distributed System Architecture), som use caset inte handlar om. Därför \"Inget av de övriga alternativen\".",
  },
  {
    id: "zm-8", no: 8, points: 2, correct: 1, grade: UNOFFICIAL,
    text: "Ett Gantt-schema för införandet av en ny produkt består av en mängd aktiviteter med start- och slutdatum och milstolpar med datum. Välj det alternativ för inplacering som du tycker stämmer bäst. (2p)",
    options: ["Inget av de övriga alternativen.", "R2K5", "R3K3, R3K4", "R2K6"],
    why: "Ett Gantt-schema med aktiviteter, datum och milstolpar är verksamhetens tidsplan: Master Schedule (R2K5).",
  },
];

// Omvända frågor: affischens celltyp → vilken cell? Alla 36, alla säkra.
const REVERSE = CELL_CODES.map((code) => ({
  id: `zr-${code}`,
  text: CELLS[code].name,
  cells: [code],
  also: [],
  grade: "S",
  why: `${CELLS[code].name} står i ${code} på 2003-affischen${CELLS[code].pair ? ` (${CELLS[code].pair})` : ""}.`,
}));

export const MEMORY_ID = "zachman-minne";

// Alla uppgifter med framsteg (sysb23:modell:<id>), i progressLists.js.
export const zachmanTasks = [
  { id: MEMORY_ID, kind: "memory", text: "Rad- och kolumnnamn" },
  ...PLACEMENTS.map((task) => ({ ...task, kind: "place", maxCells: 2 })),
  ...MAY.map((task) => ({ ...task, kind: "choice" })),
  ...REVERSE.map((task) => ({ ...task, kind: "reverse", maxCells: 1 })),
];

const byId = Object.fromEntries(zachmanTasks.map((task) => [task.id, task]));
export const taskById = (id) => byId[id];

// Uppgiftslistan i tentornas ordning. Delade objekt pekar på samma uppgift.
export const TASK_GROUPS = [
  {
    key: "okt",
    title: "Ordinarie tentan okt 2025, uppgift 2",
    note: "Placera i lämplig cell eller celler och motivera (20 p).",
    ids: ["zp-organisationsdiagram", "zp-java", "zp-natverk", "zp-granssnitt", "zp-arbetsflode", "zp-regler", "zp-processmodell", "zp-logistik", "zp-relationsscheman", "zp-affarshandelser"],
  },
  {
    key: "dec",
    title: "Omtentan dec 2025, uppgift 2",
    note: "2 p per objekt. Två celler går bra om det motiveras.",
    ids: ["zp-uppdateringsbeslut", "zp-mjukvarusystem", "zp-natverk", "zp-granssnitt", "zp-ansvarsroller", "zp-regler", "zp-processmodell", "zp-ekonomisystem", "zp-relationsscheman", "zp-affarshandelser"],
  },
  {
    key: "maj",
    title: "Uppsamlingstentan maj 2026, uppgift 2–8",
    note: "Välj ett eller flera alternativ (6 × 3 p + 2 p).",
    ids: MAY.map((task) => task.id),
  },
  {
    key: "omvant",
    title: "Omvända frågor: vilken cell?",
    note: "Alla 36 celler: du får cellens innehåll och klickar på var den hör hemma.",
    ids: REVERSE.map((task) => task.id),
  },
];
