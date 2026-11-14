// Förklarakorten i Öva (Verksamhetsarkitektur): vilken modul varje
// fritextfråga hör till. Ett kort = en eller flera essäfrågor; dubbletter
// slås ihop till ett kort som visar alla lydelser och källor.
//
// Kaspers mappning 2026-11-14, med e12-32 (trade-offs) flyttad från modul 2
// till modul 8 (planen, godkänd). 54 fritextfrågor blir 47 kort. Modul 12
// ("Start här") har inga egna kort: dess fritextfrågor ligger i den modul
// de handlar om.
export const EXPLAIN_MAP = {
  kap1: [["ea-e1-9"], ["ea-e1-10"]],
  kap2: [["ea-e2-10"], ["ea-e2-x"], ["ea-e2-11"], ["ea-e12-essay-5"]],
  kap3: [["ea-e3-10"], ["ea-e3-11"], ["ea-e12-29"], ["ea-e12-essay-1"]],
  kap4: [["ea-e4-9", "ea-e4-11"], ["ea-e4-10", "ea-e5-12", "ea-e12-essay-2"], ["ea-e-zachman"]],
  kap5: [["ea-e5-10"], ["ea-e5-11"]],
  kap6: [["ea-e6-11", "ea-e12-31"], ["ea-e6-12"], ["ea-e6-13"]],
  kap7: [
    ["ea-e7-11"], ["ea-e7-12"], ["ea-e7-13", "ea-e7-26"], ["ea-e7-23"], ["ea-e7-25"],
    ["ea-e12-30"], ["ea-e12-35"], ["ea-e12-essay-3"],
  ],
  kap8: [["ea-e7-24"], ["ea-e7-27", "ea-e12-essay-4"], ["ea-e8-8"], ["ea-e12-32"]],
  kap9: [["ea-e9-9"], ["ea-e9-10"], ["ea-e12-33"], ["ea-e12-scenario-3"]],
  kap10: [["ea-e10-9"], ["ea-e10-10"], ["ea-e12-scenario-5"]],
  kap11: [
    ["ea-e9-tankande", "ea-e12-scenario-2"], ["ea-e11-3"], ["ea-e11-7"], ["ea-e11-8"], ["ea-e11-8b"],
    ["ea-e11-9"], ["ea-e11-10"], ["ea-e12-scenario-1"], ["ea-e12-scenario-4"], ["ea-e12-slututmaning"],
  ],
};

// Kortets id i Öva-kön och i sysb23:answers: "ea-f-" + första frågans id
// utan "ea-". Id:t får aldrig ändras när ett kort väl är publicerat.
export const explainCardId = (essayIds) => `ea-f-${essayIds[0].replace(/^ea-/, "")}`;
