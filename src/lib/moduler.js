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

// "6 av 11 besvarade · 5 rätt": rätt är frågor vars senaste svar var rätt
// och fritextfrågor där senaste bedömningen var Kunde.
export function modulScore(module, answers = {}) {
  const items = modulItems(module);
  const answered = items.filter((item) => isAnswered(answers[item.id]));
  return {
    done: answered.length,
    total: items.length,
    right: answered.filter((item) => answers[item.id].last === "correct").length,
  };
}

// "Fortsätt där du var": första frågan i modulen som saknar svar.
export function firstOpenId(module, answers = {}) {
  return modulItems(module).find((item) => !isAnswered(answers[item.id]))?.id ?? null;
}

// Rytmen i fliken Moduler: lärarens text som lugna textavsnitt och
// frågorna samlade i paneler. En panel börjar vid första frågan efter ett
// textavsnitt. Är textavsnittet närmast före bara en kort rubrik ("##
// Flervalsfrågor", "## Scenariofrågor" med en mening …) blir det panelens
// rubrik. En kort anteckning utan rubrik mellan två frågor (modul 5) står
// kvar i panelen. Lärarens exempel i modul 1 (`upprepning`, samma fråga som
// fråga 6 och 9) står i samma panel som exempelfrågan före dem.
// Raderna i modul 12:s tabell "Zachman eller TOGAF?" ritas tillsammans.
const isQuestion = (block) => block?.kind === "fraga" || block?.kind === "fritext";
const isCard = (block) => isQuestion(block) || block?.kind === "upprepning";
const hasList = (text) => /^\s*(?:[-*]|\d+\.)\s/m.test(text);

export function isPanelHeading(block) {
  if (block?.kind !== "text") return false;
  const text = block.sv.trim();
  return text.startsWith("## ") && text.length <= 420 && !hasList(text);
}

function isPanelNote(block) {
  if (block?.kind !== "text") return false;
  const text = block.sv.trim();
  return !/^#/m.test(text) && text.length <= 300 && !hasList(text);
}

export function groupSections(blocks) {
  const sections = [];
  blocks.forEach((block, index) => {
    const last = sections[sections.length - 1];
    const inPanel = last?.kind === "panel";
    if (isCard(block) || (block.kind === "exempel" && inPanel)) {
      let panel = inPanel ? last : null;
      if (!panel) {
        const heading = last?.kind === "text" && isPanelHeading(last.block) ? sections.pop().block : null;
        panel = { kind: "panel", id: `panel-${block.id}`, heading, items: [] };
        sections.push(panel);
      }
      const tail = panel.items[panel.items.length - 1];
      if (block.kind === "fraga" && block.id.startsWith("ea-m12-34")) {
        if (tail?.kind === "tabell") tail.items.push(block);
        else panel.items.push({ kind: "tabell", id: "tabell-34", items: [block] });
      } else panel.items.push(block);
      return;
    }
    if (inPanel && isPanelNote(block) && isCard(blocks[index + 1])) {
      last.items.push({ kind: "notis", id: block.id, block });
      return;
    }
    sections.push({ kind: "text", id: block.id, block });
  });
  return sections;
}

// Etiketten på frågekort och paneler: "Flerval", "Sant eller falskt",
// "Kortsvar" … Panelen visar ingen typ när den blandar olika slags frågor.
const TYPE_LABEL = {
  flerval: "Flerval",
  "sant-falskt": "Sant eller falskt",
  kortsvar: "Kortsvar",
  essa: "Essä",
  fall: "Fallfråga",
  scenario: "Scenario",
  tankande: "Tankeövning",
};

export const typeLabel = (item) =>
  item.kind === "fraga" && item.id.startsWith("ea-m12-34") ? "Zachman eller TOGAF" : TYPE_LABEL[item.typ] ?? "";

export function panelSummary(panel) {
  const questions = panel.items.flatMap((item) => (item.kind === "tabell" ? item.items : isQuestion(item) ? [item] : []));
  const types = [...new Set(questions.map(typeLabel))];
  return {
    count: questions.length,
    type: types.length === 1 ? types[0] : "",
    examples: panel.items.some((item) => item.kind === "exempel" || item.kind === "upprepning"),
  };
}
