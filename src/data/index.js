import { topics as strategiTopics } from "./strategi/topics.js";
import { questions as strategiQuestions } from "./strategi/questions.js";
import { essays as strategiEssays } from "./strategi/essays.js";
import {
  chapters as strategiChapters,
  glossary as strategiGlossary,
} from "./strategi/reading.js";
import { levels as sqlLevels, sqlExercises } from "./databaser/sqlExercises.js";
import { topics as databaserTopics } from "./databaser/topics.js";
import { questions as databaserQuestions } from "./databaser/questions.js";
import {
  chapters as databaserChapters,
  glossary as databaserGlossary,
  intro as databaserIntro,
  examNote as databaserExamNote,
} from "./databaser/reading.js";
import { intro as strategiIntro } from "./strategi/reading.js";

// Tomma listor för delkurser som ännu inte har den sortens material.
const noContent = {
  topics: [],
  questions: [],
  essays: [],
  chapters: [],
  glossary: [],
  sqlLevels: [],
  sqlExercises: [],
};

// Manifest över delkurser. `views` styr vilka flikar delkursen har —
// Hem och Schema är globala och läggs till av navigationen. Lägg till en
// ny delkurs genom att skapa src/data/<id>/ och registrera den här.
export const courses = [
  {
    ...noContent,
    id: "strategi",
    name: "Strategi och ekonomistyrning",
    status: "aktiv",
    views: ["las", "ova", "prov", "essa", "statistik"],
    topics: strategiTopics,
    questions: strategiQuestions,
    essays: strategiEssays,
    chapters: strategiChapters,
    glossary: strategiGlossary,
    readingIntro: strategiIntro,
  },
  {
    ...noContent,
    id: "databaser",
    name: "Databaser",
    status: "aktiv",
    // Öva visar tomläge tills en frågebank finns. Prov är medvetet borta:
    // tentan är konstruktionsbaserad, och ett tomläge är sämre än ingen flik.
    views: ["las", "sql", "ova", "statistik"],
    topics: databaserTopics,
    questions: databaserQuestions,
    chapters: databaserChapters,
    glossary: databaserGlossary,
    readingIntro: databaserIntro,
    examNote: databaserExamNote,
    sqlLevels,
    sqlExercises,
  },
  {
    ...noContent,
    id: "process",
    name: "Processorienterad verksamhetsutveckling",
    status: "kommande",
    views: [],
  },
  {
    ...noContent,
    id: "arkitektur",
    name: "Verksamhetsarkitektur",
    status: "kommande",
    views: [],
  },
  { ...noContent, id: "sakerhet", name: "Säkerhet i informationssystem", status: "kommande", views: [] },
];

export const activeCourses = courses.filter((course) => course.status === "aktiv");

export function getCourse(id) {
  return courses.find((course) => course.id === id) || activeCourses[0];
}
