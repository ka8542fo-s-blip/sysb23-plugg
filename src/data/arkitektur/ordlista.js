// Ordlistan för den svenska översättningen av lärarens tre moduldokument
// (Verksamhetsarkitektur, fliken Moduler och Öva; Kaspers beslut och plan
// 2026-11-22). Läraren har sagt att tentan är på svenska, så allt översätts,
// men begrepp som han använder som termer står kvar på engelska.
//
// - TERMER: står kvar på engelska. `re` hittar termen i både engelskan och
//   svenskan (svensk böjning som capabilityn, stakeholdern och enterprisen
//   godtas; `sv` när svenskan prövas med ett annat mönster). TERM_UNDANTAG
//   är block där ordet inte används som term, med skäl.
//   Låst i scripts/moduler.test.mjs: finns termen i originalet ska den finnas
//   i den svenska texten.
// - FASTA: samma engelska ord blir alltid samma svenska ord.
// - ABSOLUTA: lärarens tentafällor bygger på dem, så de översätts exakt
//   (testet går igenom sant/falskt-påståendena och alla alternativ).
export const TERMER = [
  { term: "Enterprise Architecture", re: /enterprise architecture/i },
  { term: "Enterprise Architect", re: /enterprise architect(?!ure)/i },
  { term: "enterprise", re: /enterprise/i },
  { term: "IT architecture", re: /\bIT architecture/i },
  { term: "business capability", re: /business capabilit/i },
  { term: "capability map", re: /capability map/i },
  { term: "capability gap", re: /capability gap/i },
  { term: "capability-based planning", re: /capability-based planning/i },
  { term: "capability", re: /capabilit/i },
  { term: "value stream", re: /value stream/i },
  { term: "stakeholder", re: /stakeholder/i },
  // Substantivet ("stakeholder concerns", "a particular concern"), inte verbet
  // ("Architecture concerns fundamental organization"). Mönstret bygger på
  // alla 41 förekomster i PDF:erna.
  {
    term: "concern",
    re: /\b(?:particular|stakeholders?|architectural|identical|security|the|project-management)\s+concerns?\b|\barchitecture\s+concern\b/i,
    sv: /concern/i,
  },
  { term: "viewpoint", re: /viewpoint/i },
  { term: "view", re: /\bviews?\b/i },
  { term: "Business Architecture", re: /business architecture/i },
  { term: "Data Architecture", re: /\bdata architecture/i },
  { term: "Application Architecture", re: /application architecture/i },
  { term: "Technology Architecture", re: /technology architecture/i },
  { term: "Information Systems Architectures", re: /information systems architecture/i },
  { term: "TOGAF", re: /TOGAF/ },
  { term: "ADM", re: /\bADM\b/ },
  { term: "Preliminary", re: /\bPreliminary\b/ },
  { term: "Architecture Vision", re: /Architecture Vision/ },
  { term: "Opportunities and Solutions", re: /Opportunities and Solutions/ },
  { term: "Migration Planning", re: /Migration Planning/ },
  { term: "Implementation Governance", re: /Implementation Governance/ },
  { term: "Architecture Change Management", re: /Architecture Change Management/ },
  { term: "Zachman", re: /Zachman/ },
  { term: "interrogative", re: /interrogative/i },
  { term: "ontology", re: /ontolog/i },
  { term: "governance", re: /governance/i },
  { term: "decision rights", re: /decision rights/i },
  { term: "guardrail", re: /guardrail/i },
  { term: "trade-off", re: /trade-?offs?/i },
  { term: "architecture principle", re: /architecture principle/i },
  { term: "baseline", re: /baseline/i },
  { term: "target architecture", re: /target architecture/i },
  { term: "transition architecture", re: /transition architecture/i },
  { term: "architecture debt", re: /architecture debt/i },
  { term: "just-enough architecture", re: /just[- ]enough/i },
  { term: "Agile", re: /\bAgile\b/ },
  { term: "Enterprise Agility", re: /Enterprise Agility/i },
  { term: "digitization", re: /digitization/i },
  { term: "digitalization", re: /digitalization/i },
  { term: "digital transformation", re: /digital transformation/i },
  { term: "operating model", re: /operating model/i },
  { term: "enabler", re: /enabler/i },
];

// Zachmans frågeord står kvar som "What?", "How?" osv. De prövas bara där de
// är frågeord: med frågetecken i texten eller som ett helt alternativ.
export const FRAGEORD = ["What", "How", "Where", "Who", "When", "Why"];

// Block där ett ord ur TERMER inte används som term (id → termer).
export const TERM_UNDANTAG = {
  "ea-m3-4": { concern: "\"a project-management concern only\": vardagligt, inte stakeholders concerns" },
  "ea-e1-10": { view: "\"an incomplete architectural view\": vardagligt, en bild av arkitekturen" },
};

export const FASTA = {
  framework: "ramverk",
  methodology: "metodik",
  method: "metod",
  "classification schema": "klassificeringsschema",
  perspective: "perspektiv",
  abstraction: "abstraktion",
  domain: "domän",
  "architecture domain": "arkitekturdomän",
  "business process": "verksamhetsprocess",
  "business strategy": "affärsstrategi",
  "organizational structure": "organisationsstruktur",
  outcome: "resultat",
  "business outcome": "affärsresultat",
  implementation: "implementering",
  investment: "investering",
  roadmap: "färdplan",
  "data ownership": "dataägarskap",
  agility: "agilitet",
  "legacy system": "legacysystem",
  scope: "avgränsning",
};

export const RUBRIKER = {
  "Learning objectives": "Lärandemål",
  "Core message": "Kärnbudskap",
  "Core explanation": "Kärnförklaring",
  "Question multiple choice": "Flervalsfrågor",
  "True or False": "Sant eller falskt",
  "Short-answer question": "Kortsvarsfråga",
  "Essay questions": "Essäfrågor",
  "Practice Questions with explanations": "Övningsfrågor med förklaringar",
  "Model answer": "Modellsvar",
  "Key lesson": "Viktig lärdom",
  Answer: "Svar",
  "Correct answer": "Rätt svar",
};

export const ABSOLUTA = {
  always: "alltid",
  never: "aldrig",
  only: "endast",
  must: "måste",
  automatically: "automatiskt",
  completely: "helt",
  exclusively: "uteslutande",
  necessarily: "nödvändigtvis",
  every: "varje",
  exactly: "exakt",
};
