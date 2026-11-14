// De 47 förklarakorten i Öva (Verksamhetsarkitektur): fritextfrågorna ur
// Essä, ett kort per fråga och dubbletter ihopslagna (explainMap.js). Ett
// kort visar frågan, ett frivilligt textfält (sparas i sysb23:svar:<kortId>),
// och efter "Visa svar" modulens kärnsvar och lärarens modellsvar ordagrant.
// Sedan "Kunde" eller "Kunde inte", som räknas som rätt eller fel i
// sysb23:answers med samma kö och krav som frågorna.
//
// Korten har `options` (Kunde, Kunde inte), `correct: 0` och `fixedOrder`, så
// att Övas sparade öppna fråga och kölogik fungerar oförändrat; `kind:
// "forklara"` gör att Öva ritar ExplainCard i stället för svarsalternativ.
// De ligger i manifestets `explainCards`, inte i `questions`: provtentorna
// och Statistiks frågeräkning bygger på de 135 modulfrågorna.
import { essays } from "./essays.js";
import { KARNSVAR } from "./cards.js";
import { EXPLAIN_MAP, explainCardId } from "./explainMap.js";
import { topics } from "./topics.js";

const essayById = Object.fromEntries(essays.map((essay) => [essay.id, essay]));
const topicOf = Object.fromEntries(topics.map((topic) => [topic.chapter, topic.id]));

export const explainCards = Object.entries(EXPLAIN_MAP).flatMap(([chapter, cards]) =>
  cards.map((ids) => {
    const prompts = ids.map((id) => {
      const essay = essayById[id];
      return {
        id,
        label: essay.label,
        question: essay.question,
        source: essay.source,
        modelAnswer: essay.modelAnswer ?? null,
        checklist: essay.modelAnswer ? null : essay.checklist,
        note: essay.levelNote ?? null,
      };
    });
    return {
      id: explainCardId(ids),
      kind: "forklara",
      chapter,
      topic: topicOf[chapter],
      essayIds: ids,
      question: prompts[0].question,
      prompts,
      karnsvar: KARNSVAR[chapter]?.text ?? null,
      options: [{ text: "Kunde" }, { text: "Kunde inte" }],
      correct: 0,
      fixedOrder: true,
      source: prompts.map((prompt) => prompt.source).join("; "),
    };
  }),
);
