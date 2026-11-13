// Rättningen i Zachman-vyn, som rena funktioner (testas i
// scripts/zachman.test.mjs).
import { MEMORY_ACCEPT } from "../data/arkitektur/zachman.js";

// Placering: valda celler mot facit (`cells`) och godtagbara alternativ
// (`also`). Rätt = minst en vald, alla valda godtagbara och högst
// `maxCells`. Delvis = någon godtagbar men också fel celler (eller fler än
// tillåtet). Fel = ingen godtagbar.
export function gradePlacement(task, chosen) {
  const picked = [...new Set(chosen || [])];
  const ok = new Set([...task.cells, ...(task.also || [])]);
  const right = picked.filter((code) => ok.has(code));
  const wrong = picked.filter((code) => !ok.has(code));
  const max = task.maxCells ?? 2;
  let status;
  if (picked.length === 0) status = "tom";
  else if (right.length === 0) status = "fel";
  else if (wrong.length === 0 && picked.length <= max) status = "ratt";
  else status = "delvis";
  return { status, right, wrong, tooMany: picked.length > max };
}

// Majtentans flerval: "Välj ett eller flera alternativ". Rätt är exakt det
// rätta alternativet och inget annat.
export function gradeChoice(task, selected) {
  const picked = [...new Set(selected || [])];
  if (picked.length === 0) return { status: "tom" };
  if (picked.length === 1 && picked[0] === task.correct) return { status: "ratt" };
  return { status: picked.includes(task.correct) ? "delvis" : "fel" };
}

// Gemener, å/ä/ö och andra diakriter fällda, skiljetecken till blanksteg.
export function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// Ett memoreringsfält är rätt om något godtaget namn står i svaret som
// hela ord ("Scope – Planner" godtas för R1).
export function memoryFieldOk(code, answer) {
  const text = ` ${normalize(answer)} `;
  if (!text.trim()) return false;
  return (MEMORY_ACCEPT[code] || []).some((name) => text.includes(` ${normalize(name)} `));
}

export const MEMORY_FIELDS = Object.keys(MEMORY_ACCEPT);

export function gradeMemory(answers) {
  const result = {};
  for (const code of MEMORY_FIELDS) result[code] = memoryFieldOk(code, answers?.[code]);
  const correct = MEMORY_FIELDS.filter((code) => result[code]).length;
  return { fields: result, correct, total: MEMORY_FIELDS.length, done: correct === MEMORY_FIELDS.length };
}
