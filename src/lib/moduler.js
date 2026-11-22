// Fliken Moduler (Verksamhetsarkitektur): framsteg och nollställning per
// modul. Svar och status är samma poster som i Öva (sysb23:answers), så
// en fråga som besvarats i Öva räknas här och tvärtom.
import { isAnswered } from "./practiceQueue.js";

// Frågorna och fritextfrågorna i en modul, i dokumentets ordning.
export const modulItems = (module) =>
  (module?.blocks || []).filter((block) => block.kind === "fraga" || block.kind === "fritext");

export const modulIds = (module) => modulItems(module).map((item) => item.id);

// "14 av 27 besvarade": frågor med minst ett svar och fritextfrågor med en
// bedömning (Kunde eller Kunde inte) sedan modulen senast gjordes om.
export function modulProgress(module, answers = {}) {
  const items = modulItems(module);
  return { done: items.filter((item) => isAnswered(answers[item.id])).length, total: items.length };
}

// Det valda alternativet visas bara om frågan har ett svar i answers. Har
// man nollställt i Öva, eller gjort om modulen, står frågan obesvarad även
// om det gamla valet ligger kvar i svar:<id>.
export function chosenOption(stat, draft) {
  if (!isAnswered(stat)) return null;
  return Number.isInteger(draft?.choice) ? draft.choice : null;
}
