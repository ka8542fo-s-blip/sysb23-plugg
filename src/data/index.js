import { topics as strategiTopics } from "./strategi/topics.js";
import { questions as strategiQuestions } from "./strategi/questions.js";
import { essays as strategiEssays } from "./strategi/essays.js";

// Manifest över delkurser. Lägg till en ny delkurs genom att skapa
// src/data/<id>/{topics,questions,essays}.js och registrera den här —
// resten av appen läser manifestet dynamiskt.
export const courses = [
  {
    id: "strategi",
    name: "Strategi och ekonomistyrning",
    status: "aktiv",
    topics: strategiTopics,
    questions: strategiQuestions,
    essays: strategiEssays,
  },
  { id: "databaser", name: "Databaser", status: "kommande" },
  {
    id: "process",
    name: "Processorienterad verksamhetsutveckling",
    status: "kommande",
  },
  { id: "arkitektur", name: "Verksamhetsarkitektur", status: "kommande" },
  { id: "sakerhet", name: "Säkerhet", status: "kommande" },
];

export const activeCourses = courses.filter((course) => course.status === "aktiv");

export function getCourse(id) {
  return courses.find((course) => course.id === id) || activeCourses[0];
}
