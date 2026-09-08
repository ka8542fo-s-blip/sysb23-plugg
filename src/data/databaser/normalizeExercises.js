// Normaliseringssteget i modellverkstaden: häftets uppgift 11–13, samma
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
// Avvikelser från häftet, rapporterade: 11:8 saknar understrykningar i
// facit (PK härledd: {A, B}, C, D). 12:9 har R4(B, D) i facit, men B → D
// gäller inte och joinen av R1 och R4 över B ger tupler som inte fanns i R — R4(A, D) är den
// nyckelrelation som ger lossless join. Häftets variant står kvar som
// facit, den härledda som alternativ, tills Björn svarat.
const R = (name, attrs, pk, pkAlso) => ({ name, attrs, pk: [pk], ...(pkAlso ? { pkAlso } : {}) });

export const normalizeExercises = [
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
    keyNote: "Häftets facit saknar understrykningar här; primärnycklarna är härledda.",
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
    keyNote: "Häftets facit har R4(B, D); R4(A, D) är den nyckelrelation som ger lossless join. Båda godtas tills facit är bekräftat.",
    facit: [R("R1", "A, B", "A"), R("R2", "B, C", "B"), R("R3", "D, C", "D"), R("R4", "B, D", "B, D")],
    variants: [[R("R1", "A, B", "A"), R("R2", "B, C", "B"), R("R3", "D, C", "D"), R("R4", "A, D", "A, D")]] },
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
    facit: [R("R1", "A, B, C", "A, B"), R("R2", "A, B, D", "A, B"), R("R3", "D, C", "D")] },
  { id: "norm-13-10", exercise: 13, number: 10, attrs: "A, B, C, D, E, F", fds: ["{A, B} → C", "C → D", "A → E", "B → F"], nf: "1NF",
    facit: [R("R1", "A, B, C", "A, B"), R("R2", "C, D", "C"), R("R3", "A, E", "A"), R("R4", "B, F", "B")] },
  { id: "norm-13-11", exercise: 13, number: 11, attrs: "A, B, C, D, E, F", fds: ["{A, B} → C", "C → D", "D → {C, F}", "F → E"], nf: "2NF",
    facit: [R("R1", "A, B, C", "A, B"), R("R2", "C, D, F", "C", ["D"]), R("R3", "F, E", "F")] },
  { id: "norm-13-12", exercise: 13, number: 12, attrs: "A, B, C, D, E, F", fds: ["{A, B} → C", "C → {D, E}", "D → {C, E, F}"], nf: "2NF",
    facit: [R("R1", "A, B, C", "A, B"), R("R2", "C, D, E, F", "C", ["D"])] },
];

export const NORMALIZE_GROUPS = [
  { exercise: 11, source: "Övningshäftet uppgift 11" },
  { exercise: 12, source: "Övningshäftet uppgift 12" },
  { exercise: 13, source: "Övningshäftet uppgift 13" },
];

// Relationen och beroendena som förformaterat block, som i Öva.
export const contextOf = (item) => [`R(${item.attrs})`, ...(item.fds.length ? item.fds : ["Inga funktionella beroenden"])].join("\n");
