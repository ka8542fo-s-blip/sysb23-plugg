// Kompendiet (löptext) och ordlistan.
//
// STATUS: kapiteltexterna och ordlistan saknas ännu. De ligger i
// `claude-code-prompt-sysb23-lasdel.md`, som inte finns i det här repot.
// Klistra in kapitelobjekten i `rawChapters` och termerna i `glossary` nedan
// — resten av appen är byggd och läser härifrån.
//
// Kapitelschema (löptext ÄGS här, korta punkter ägs av topics.js):
//   { id: "kap1", title: "…", lead: "…", readingMinutes: 12,
//     sources: "AJK kap 1–3", body: "# Markdown …" }
//
// `topics` och `primaryTopics` sätts automatiskt ur tabellen nedan — de ska
// alltså INTE skrivas in i kapitelobjekten. Kapitlen får heller aldrig egna
// `recap`- eller `pitfalls`-arrayer: kapitelavslutet renderas ur
// topics.js via lib/topicLookup.js.
//
// Ordlisteschema: { term: "…", definition: "…", chapter: "kap3" }

export const CHAPTER_TOPICS = {
  kap1: { topics: ["grunder"], primaryTopics: ["grunder"] },
  kap2: { topics: ["vision"], primaryTopics: ["vision"] },
  kap3: { topics: ["mal"], primaryTopics: ["mal"] },
  kap4: { topics: ["effektivitet"], primaryTopics: ["effektivitet"] },
  kap5: { topics: ["organisation", "grunder"], primaryTopics: ["organisation"] },
  kap6: {
    topics: ["strategiutveckling", "porter", "rbv"],
    primaryTopics: ["strategiutveckling", "porter"],
  },
  kap7: { topics: ["bsc", "matt"], primaryTopics: ["bsc", "matt"] },
  kap8: { topics: ["tbl"], primaryTopics: ["tbl"] },
  kap9: { topics: ["it", "rbv"], primaryTopics: ["it", "rbv"] },
  kap10: {
    topics: ["nyamatt", "grunder", "bsc", "tbl"],
    primaryTopics: ["nyamatt"],
  },
};

export const CHAPTER_ORDER = Object.keys(CHAPTER_TOPICS);

export const intro = "";

// ⬇︎ Klistra in de tio kapitlen här (id, title, lead, readingMinutes, sources, body).
const rawChapters = [];

export const chapters = rawChapters.map((chapter) => ({
  ...chapter,
  ...(CHAPTER_TOPICS[chapter.id] || { topics: [], primaryTopics: [] }),
}));

// ⬇︎ Klistra in ordlistan här (term, definition, chapter).
export const glossary = [];
