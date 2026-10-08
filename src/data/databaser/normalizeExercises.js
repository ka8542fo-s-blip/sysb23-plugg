// Normaliseringssteget i modellverkstaden: häftets uppgift 10–13, samma
// form som tentans 3f och 3g. Varje post är en relation R med beroenden;
// svaret är högsta normalform och en uppdelning till 3NF med primärnyckel
// understruken, eller "R är redan i 3NF".
//
// Facit är häftets facit läst mot understrykningarna på sidan 24–26 (texten
// tappar dem). `pk` är häftets understrykning(ar), `pkAlso` är härledda
// alternativ där samma relation har fler kandidatnycklar än facit strukit
// under — häftet ger själv båda i 11:7 och 11:11, så samma sak godtas där
// mönstret återkommer. `variants` är hela alternativa nedbrytningar.
// Normalformen för uppgift 11 saknas i häftets facit och är härledd med
// samma definitioner (testsviten kontrollerar den mot motorn).
//
// Sajtens facit ska vara korrekt, även där häftet har fel (användarbeslut
// 2026-10-08). Varje facit prövas i testsviten: 3NF, lossless join,
// beroendebevarande, ingen överflödig relation, ingen nyckel två gånger.
// Medvetna avvikelser från häftet:
// - 12:9: häftet har R4(B, D). B → D gäller inte, (B, D) innehåller inte
//   nyckeln {A, D}, och joinen via B ger tupler som inte fanns i R. Sajtens
//   facit har nyckeltabellen R4(A, D); häftets variant godtas inte.
// - 13:9: häftet har R1(A, B, C), R2(A, B, D), R3(D, C). R1 är överflödig —
//   {A, B} → C följer av {A, B} → D och D → C — och har samma nyckel som R2.
//   Sajtens facit: R1(A, B, D), R2(D, C).
// 11:8 saknar understrykningar i häftets facit (PK härledd: {A, B}, C, D).
//
// Uppgift 10 (`nfOnly`) frågar bara efter högsta normalform; relationerna
// är lästa ur häftet och kontrollerade mot sidan, normalformen är häftets
// facit. De egna uppgifterna (`exercise: "egen"`) riktar sig mot var sin
// fälla, beskriven i `trap` och visad efter rättningen; testsviten
// verifierar deras normalform, nycklar och facit i FD-motorn.
const R = (name, attrs, pk, pkAlso) => ({ name, attrs, pk: [pk], ...(pkAlso ? { pkAlso } : {}) });

const NF10 = (number, attrs, fds, nf) => ({ id: `norm-10-${String(number).padStart(2, "0")}`, exercise: 10, number, attrs, fds, nf, facit: null, nfOnly: true });

export const normalizeExercises = [
  // ---- Uppgift 10: bara högsta normalform ----
  NF10(1, "A, B, C", ["A → B", "A → C"], "3NF"),
  NF10(2, "A, B, C", ["A → B"], "1NF"),
  NF10(3, "A, B, C, D, E", ["{A, B} → C", "C → D", "D → E"], "2NF"),
  NF10(4, "A, B, C, D, E", ["A → B", "B → {A, C}", "C → {D, E}"], "2NF"),
  NF10(5, "A, B, C, D, E", ["A → B", "B → A", "C → D", "D → E"], "1NF"),
  NF10(6, "A, B, C, D, E", ["{A, B} → C", "C → A", "C → B", "A → D", "B → E"], "1NF"),
  NF10(7, "A, B, C, D, E, F", ["A → B", "B → C", "D → E", "E → C"], "1NF"),
  NF10(8, "A, B, C", ["A → C", "B → C"], "1NF"),
  NF10(9, "A, B, C, D", ["{A, B} → C", "B → D"], "1NF"),
  NF10(10, "A, B, C", ["{A, B} → C"], "3NF"),
  NF10(11, "A, B, C", ["A → {B, C}", "B → {A, C}", "C → A"], "3NF"),
  NF10(12, "A, B, C, D, E, F, G", ["A → B", "B → {A, C}", "C → D", "D → {E, F}", "E → G"], "2NF"),
  NF10(13, "A, B, C, D, E, F, G", ["A → B", "B → {A, C}", "C → {B, D, E}", "D → {C, F, G}"], "3NF"),
  NF10(14, "A, B, C, D", ["A → {B, C}", "B → {A, C}", "C → {B, A}"], "3NF"),
  NF10(15, "A, B, C, D, E, F", ["{A, B} → C", "C → D", "D → E", "E → F"], "2NF"),
  NF10(16, "A, B, C, D", [], "3NF"),

  // ---- Uppgift 11 ----
  { id: "norm-11-01", exercise: 11, number: 1, attrs: "A, B, C", fds: ["A → B", "B → C"], nf: "2NF",
    facit: [R("R1", "A, B", "A"), R("R2", "B, C", "B")] },
  { id: "norm-11-02", exercise: 11, number: 2, attrs: "A, B, C, D", fds: ["A → B", "B → C", "C → {B, D}"], nf: "2NF",
    facit: [R("R1", "A, B", "A"), { name: "R2", attrs: "C, B, D", pk: ["C", "B"] }] },
  { id: "norm-11-03", exercise: 11, number: 3, attrs: "A, B, C, D, E", fds: ["{A, B} → C", "A → D", "B → E"], nf: "1NF",
    facit: [R("R1", "A, B, C", "A, B"), R("R2", "A, D", "A"), R("R3", "B, E", "B")] },
  { id: "norm-11-04", exercise: 11, number: 4, attrs: "A, B, C, D, E", fds: ["A → B", "B → {A, C}", "C → {B, D, E}"], nf: "3NF", facit: null },
  { id: "norm-11-05", exercise: 11, number: 5, attrs: "A, B, C, D, E, F", fds: ["{A, B} → {C, D}", "D → E"], nf: "1NF",
    facit: [R("R1", "A, B, C, D", "A, B"), R("R2", "D, E", "D"), R("R3", "A, B, F", "A, B, F")] },
  { id: "norm-11-06", exercise: 11, number: 6, attrs: "A, B", fds: [], nf: "3NF", facit: null },
  { id: "norm-11-07", exercise: 11, number: 7, attrs: "A, B, C, D, E, F", fds: ["{A, B} → C", "C → {A, B, D}", "D → {E, F}"], nf: "2NF",
    facit: [{ name: "R1", attrs: "A, B, C, D", pk: ["A, B", "C"] }, R("R2", "D, E, F", "D")] },
  { id: "norm-11-08", exercise: 11, number: 8, attrs: "A, B, C, D, E, F", fds: ["{A, B} → C", "C → D", "D → {E, F}"], nf: "2NF",
    keyNote: "Övningshäftets facit anger inga primärnycklar här; de är härledda.",
    facit: [R("R1", "A, B, C", "A, B"), R("R2", "C, D", "C"), R("R3", "D, E, F", "D")] },
  { id: "norm-11-09", exercise: 11, number: 9, attrs: "A, B, C", fds: ["A → B", "B → C", "C → B"], nf: "2NF",
    facit: [R("R1", "A, B", "A"), { name: "R2", attrs: "C, B", pk: ["C", "B"] }] },
  { id: "norm-11-10", exercise: 11, number: 10, attrs: "A, B, C, D, E, F", fds: ["A → D", "B → E", "C → F"], nf: "1NF",
    facit: [R("R1", "A, B, C", "A, B, C"), R("R2", "A, D", "A"), R("R3", "B, E", "B"), R("R4", "C, F", "C")] },
  { id: "norm-11-11", exercise: 11, number: 11, attrs: "A, B, C, D, E", fds: ["{A, B} → C", "C → A", "C → B", "A → D", "B → E"], nf: "1NF",
    facit: [{ name: "R1", attrs: "A, B, C", pk: ["A, B", "C"] }, R("R2", "A, D", "A"), R("R3", "B, E", "B")] },
  { id: "norm-11-12", exercise: 11, number: 12, attrs: "A, B, C", fds: ["A → C"], nf: "1NF",
    facit: [R("R1", "A, C", "A"), R("R2", "A, B", "A, B")] },

  // ---- Uppgift 12 ----
  { id: "norm-12-01", exercise: 12, number: 1, attrs: "A, B, C, D", fds: ["A → B", "C → D"], nf: "1NF",
    facit: [R("R1", "A, B", "A"), R("R2", "C, D", "C"), R("R3", "A, C", "A, C")] },
  { id: "norm-12-02", exercise: 12, number: 2, attrs: "A, B, C, D", fds: ["A → B", "B → C"], nf: "1NF",
    facit: [R("R1", "A, B", "A"), R("R2", "B, C", "B"), R("R3", "A, D", "A, D")] },
  { id: "norm-12-03", exercise: 12, number: 3, attrs: "A, B, C, D, E", fds: ["{A, B, C} → D", "{A, B} → E"], nf: "1NF",
    facit: [R("R1", "A, B, C, D", "A, B, C"), R("R2", "A, B, E", "A, B")] },
  { id: "norm-12-04", exercise: 12, number: 4, attrs: "A, B, C, D, E, F, G", fds: ["{A, B} → C", "C → {A, B, D}", "D → {C, E}", "E → F", "F → G"], nf: "2NF",
    facit: [R("R1", "A, B, C, D, E", "A, B", ["C", "D"]), R("R2", "E, F", "E"), R("R3", "F, G", "F")] },
  { id: "norm-12-05", exercise: 12, number: 5, attrs: "A, B, C, D, E, F, G", fds: ["{A, B} → C", "C → {A, B, D}", "D → {C, E}", "E → F"], nf: "1NF",
    facit: [R("R1", "A, B, C, D, E", "A, B", ["C", "D"]), R("R2", "E, F", "E"), R("R3", "A, B, G", "A, B, G")] },
  { id: "norm-12-06", exercise: 12, number: 6, attrs: "A, B, C, D, E", fds: ["{A, B} → C", "A → D", "B → E"], nf: "1NF",
    facit: [R("R1", "A, B, C", "A, B"), R("R2", "A, D", "A"), R("R3", "B, E", "B")] },
  { id: "norm-12-07", exercise: 12, number: 7, attrs: "A, B, C, D, E, F", fds: ["A → B", "B → {A, C}", "C → {D, E}"], nf: "1NF",
    facit: [R("R1", "A, B, C", "A", ["B"]), R("R2", "C, D, E", "C"), R("R3", "A, F", "A, F")] },
  { id: "norm-12-08", exercise: 12, number: 8, attrs: "A, B, C, D, E", fds: ["A → B", "B → {C, D}", "D → E"], nf: "2NF",
    facit: [R("R1", "A, B", "A"), R("R2", "B, C, D", "B"), R("R3", "D, E", "D")] },
  { id: "norm-12-09", exercise: 12, number: 9, attrs: "A, B, C, D", fds: ["A → B", "B → C", "D → C"], nf: "1NF",
    keyNote: "Övningshäftet har R4(B, D) här. Den innehåller inte nyckeln {A, D} och ger inte lossless join — nyckeltabellen ska vara R4(A, D).",
    facit: [R("R1", "A, B", "A"), R("R2", "B, C", "B"), R("R3", "D, C", "D"), R("R4", "A, D", "A, D")] },
  { id: "norm-12-10", exercise: 12, number: 10, attrs: "A, B, C, D, E, F", fds: ["{A, B} → C", "D → {E, F}"], nf: "1NF",
    facit: [R("R1", "A, B, C", "A, B"), R("R2", "D, E, F", "D"), R("R3", "A, B, D", "A, B, D")] },
  { id: "norm-12-11", exercise: 12, number: 11, attrs: "A, B, C, D, E, F", fds: ["{A, B} → C", "C → A", "C → B", "C → D", "D → {C, E}", "E → {D, F}"], nf: "3NF", facit: null },
  { id: "norm-12-12", exercise: 12, number: 12, attrs: "A, B, C, D", fds: ["{A, B} → C", "C → D", "D → C"], nf: "2NF",
    facit: [R("R1", "A, B, C", "A, B"), R("R2", "C, D", "C", ["D"])] },
  { id: "norm-12-13", exercise: 12, number: 13, attrs: "A, B, C, D, E", fds: ["{A, B} → C", "C → D", "D → {C, E}"], nf: "2NF",
    facit: [R("R1", "A, B, C", "A, B"), R("R2", "C, D, E", "C", ["D"])] },
  { id: "norm-12-14", exercise: 12, number: 14, attrs: "A, B, C, D, E, F", fds: ["A → B", "B → {A, C}", "C → {D, E}", "D → {C, F}"], nf: "2NF",
    facit: [R("R1", "A, B, C", "A", ["B"]), R("R2", "C, D, E, F", "C", ["D"])] },

  // ---- Uppgift 13 ----
  { id: "norm-13-01", exercise: 13, number: 1, attrs: "A, B, C, D", fds: ["A → B", "B → C"], nf: "1NF",
    facit: [R("R1", "A, B", "A"), R("R2", "B, C", "B"), R("R3", "A, D", "A, D")] },
  { id: "norm-13-02", exercise: 13, number: 2, attrs: "A, B, C", fds: ["{A, B} → C", "C → A"], nf: "3NF", facit: null,
    keyNote: "C är primärattribut, medlem i kandidatnyckeln {B, C}." },
  { id: "norm-13-03", exercise: 13, number: 3, attrs: "A, B, C, D, E", fds: ["{A, B} → C", "C → A", "C → B", "C → {D, E}"], nf: "3NF", facit: null },
  { id: "norm-13-04", exercise: 13, number: 4, attrs: "A, B, C, D, E, F", fds: ["{A, B} → C", "C → D", "B → E", "E → F"], nf: "1NF",
    facit: [R("R1", "A, B, C", "A, B"), R("R2", "C, D", "C"), R("R3", "B, E", "B"), R("R4", "E, F", "E")] },
  { id: "norm-13-05", exercise: 13, number: 5, attrs: "A, B, C, D, E", fds: ["A → B", "C → B", "D → B", "E → B"], nf: "1NF",
    facit: [R("R1", "A, B", "A"), R("R2", "C, B", "C"), R("R3", "D, B", "D"), R("R4", "E, B", "E"), R("R5", "A, C, D, E", "A, C, D, E")] },
  { id: "norm-13-06", exercise: 13, number: 6, attrs: "A, B, C, D, E, F", fds: ["{A, B} → C", "C → D", "D → E", "F → E"], nf: "1NF",
    facit: [R("R1", "A, B, C", "A, B"), R("R2", "C, D", "C"), R("R3", "D, E", "D"), R("R4", "F, E", "F"), R("R5", "A, B, F", "A, B, F")] },
  { id: "norm-13-07", exercise: 13, number: 7, attrs: "A, B, C, D, E, F", fds: ["{A, B} → C", "C → {A, B, D}", "D → {E, F}"], nf: "2NF",
    facit: [R("R1", "A, B, C, D", "A, B", ["C"]), R("R2", "D, E, F", "D")] },
  { id: "norm-13-08", exercise: 13, number: 8, attrs: "A, B, C, D, E, F", fds: ["{A, B} → C", "C → D", "D → {C, E}", "E → {D, F}"], nf: "2NF",
    facit: [R("R1", "A, B, C", "A, B"), R("R2", "C, D, E, F", "C", ["D", "E"])] },
  { id: "norm-13-09", exercise: 13, number: 9, attrs: "A, B, C, D", fds: ["{A, B} → C", "{A, B} → D", "D → C"], nf: "2NF",
    keyNote: "Övningshäftet har också en tabell (A, B, C). Den behövs inte: C nås redan via {A, B} → D → C.",
    facit: [R("R1", "A, B, D", "A, B"), R("R2", "D, C", "D")] },
  { id: "norm-13-10", exercise: 13, number: 10, attrs: "A, B, C, D, E, F", fds: ["{A, B} → C", "C → D", "A → E", "B → F"], nf: "1NF",
    facit: [R("R1", "A, B, C", "A, B"), R("R2", "C, D", "C"), R("R3", "A, E", "A"), R("R4", "B, F", "B")] },
  { id: "norm-13-11", exercise: 13, number: 11, attrs: "A, B, C, D, E, F", fds: ["{A, B} → C", "C → D", "D → {C, F}", "F → E"], nf: "2NF",
    facit: [R("R1", "A, B, C", "A, B"), R("R2", "C, D, F", "C", ["D"]), R("R3", "F, E", "F")] },
  { id: "norm-13-12", exercise: 13, number: 12, attrs: "A, B, C, D, E, F", fds: ["{A, B} → C", "C → {D, E}", "D → {C, E, F}"], nf: "2NF",
    facit: [R("R1", "A, B, C", "A, B"), R("R2", "C, D, E, F", "C", ["D"])] },

  // ---- Egna, en fälla var ----
  { id: "norm-egen-01", exercise: "egen", number: 1, attrs: "A, B, C, D", fds: ["A → B", "B → A", "B → {C, D}"], nf: "3NF", facit: null,
    trap: "A → B och B → C ser ut som en transitiv kedja, men B → A gäller: B är själv kandidatnyckel, så C och D beror direkt på en kandidatnyckel." },
  { id: "norm-egen-02", exercise: "egen", number: 2, attrs: "A, B, C, D, E", fds: ["A → {B, C}", "C → D"], nf: "1NF",
    trap: "E står inte till höger om någon pil och måste därför ingå i varje kandidatnyckel: {A, E}. Utan nyckelrelationen R3(A, E) går lossless join förlorad.",
    facit: [R("R1", "A, B, C", "A"), R("R2", "C, D", "C"), R("R3", "A, E", "A, E")] },
  { id: "norm-egen-03", exercise: "egen", number: 3, attrs: "A, B, C", fds: [], nf: "3NF", facit: null,
    trap: "Utan beroenden är hela attributmängden {A, B, C} kandidatnyckel. Alla attribut är primära, så inget kan bero partiellt eller transitivt: 3NF." },
  { id: "norm-egen-04", exercise: "egen", number: 4, attrs: "A, B, C, D", fds: ["{A, B} → {C, D}", "C → B"], nf: "3NF", facit: null,
    trap: "C → B ser partiellt ut, men B är primärattribut, och 2NF och 3NF gäller bara icke-primärattribut. {A, C} är också kandidatnyckel ({A, C}⁺ = {A, B, C, D}), så C är själv primärt." },
  { id: "norm-egen-05", exercise: "egen", number: 5, attrs: "A, B, C, D, E", fds: ["A → B", "B → C", "C → D", "D → A", "B → E"], nf: "3NF", facit: null,
    trap: "Kedjan A → B → C → D sluter sig med D → A. Alla fyra är kandidatnycklar, och E beror direkt på kandidatnyckeln B. Rätt svar är att inte göra något." },
  { id: "norm-egen-06", exercise: "egen", number: 6, attrs: "A, B, C, D", fds: ["A → B", "B → C", "C → D"], nf: "2NF",
    trap: "Två relationer räcker inte: i (A, B, C) är C fortfarande transitivt beroende av A via B. Ett beroende per relation ger tre.",
    facit: [R("R1", "A, B", "A"), R("R2", "B, C", "B"), R("R3", "C, D", "C")] },
  { id: "norm-egen-07", exercise: "egen", number: 7, attrs: "A, B, C, D", fds: ["A → {B, C}", "B → A", "C → D"], nf: "2NF",
    trap: "B → A och A → C gör inte C transitivt beroende: B är själv kandidatnyckel. Bara C → D bryts ut. Att dela R1(A, B, C) i (A, B) och (A, C) är övernormalisering.",
    facit: [R("R1", "A, B, C", "A", ["B"]), R("R2", "C, D", "C")] },
  { id: "norm-egen-08", exercise: "egen", number: 8, attrs: "A, B, C, D, E", fds: ["{A, B} → C", "B → D", "D → E"], nf: "1NF",
    trap: "Både partiellt (B → D) och transitivt (D → E) i samma relation. R2(B, D, E) vore inte i 3NF: E är transitivt beroende av B via D.",
    facit: [R("R1", "A, B, C", "A, B"), R("R2", "B, D", "B"), R("R3", "D, E", "D")] },
  { id: "norm-egen-09", exercise: "egen", number: 9, attrs: "A, B, C, D, E", fds: ["A → C", "B → D", "C → E"], nf: "1NF",
    trap: "Inget beroende har hela nyckeln {A, B} som vänsterled, men nyckeln måste ändå stå i en relation: R4(A, B) är nyckelrelationen som ger lossless join.",
    facit: [R("R1", "A, C", "A"), R("R2", "C, E", "C"), R("R3", "B, D", "B"), R("R4", "A, B", "A, B")] },
  { id: "norm-egen-10", exercise: "egen", number: 10, attrs: "A, B, C, D", fds: ["A → B", "{B, C} → D"], nf: "1NF",
    trap: "{B, C} är sammansatt men ingen del av kandidatnyckeln {A, C}, så D är transitivt beroende, inte partiellt. Högsta normalform avgörs ändå av A → B, som är partiellt.",
    facit: [R("R1", "A, B", "A"), R("R2", "B, C, D", "B, C"), R("R3", "A, C", "A, C")] },
];

export const NORMALIZE_GROUPS = [
  { exercise: 10, source: "Övningshäftet uppgift 10", label: "Uppgift 10" },
  { exercise: 11, source: "Övningshäftet uppgift 11" },
  { exercise: 12, source: "Övningshäftet uppgift 12" },
  { exercise: 13, source: "Övningshäftet uppgift 13" },
  { exercise: "egen", source: "Egen uppgift", label: "Egna" },
];

export const itemLabel = (item) => (item.exercise === "egen" ? `Egen uppgift ${item.number}` : item.exercise === "slump" ? "Slumpuppgift" : `Uppgift ${item.exercise}, relation ${item.number}`);
export const groupLabel = (group) => group.label || `Uppgift ${group.exercise}`;

// Relationen och beroendena som förformaterat block, som i Öva.
export const contextOf = (item) => [`R(${item.attrs})`, ...(item.fds.length ? item.fds : ["Inga funktionella beroenden"])].join("\n");
