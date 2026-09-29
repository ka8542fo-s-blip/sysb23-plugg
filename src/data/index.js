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
import { topics as processTopics } from "./process/topics.js";
import { questions as processQuestions } from "./process/questions.js";
import { essays as processEssays } from "./process/essays.js";
import { tasks as processBpmnTasks } from "./process/bpmnTasks.js";
import {
  chapters as processChapters,
  glossary as processGlossary,
  intro as processIntro,
  examNote as processExamNote,
} from "./process/reading.js";

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
    // Öva speglar Läs även här: elva kapitel i stället för fjorton ämnen med
    // andra namn än kapiteltitlarna (och ett ämne utan frågor).
    practiceBy: "chapter",
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
    views: ["las", "sql", "modell", "ova", "statistik"],
    // Öva speglar Läs: kvizzarna grupperas per kapitel, inte per ämne.
    practiceBy: "chapter",
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
    status: "aktiv",
    // Byggs i faser (2026-09-29): Läs först, sedan Öva, Essä, Kör processen
    // och Prov. Flikarna läggs till när deras innehåll finns.
    views: ["las", "ova", "bpmn", "prov", "essa", "statistik"],
    practiceBy: "chapter",
    topics: processTopics,
    questions: processQuestions,
    essays: processEssays,
    bpmnTasks: processBpmnTasks,
    // Provet i HT25-tentans form: 10 BPM-frågor à 5 p, sedan BPMN-delen
    // som på tentan — en begreppsfråga à 3 p och tre körfrågor ur Kör
    // processen med tentans poäng (4–7 p). Essäerna (2 à 15 p) ligger utanför.
    exam: {
      sections: [
        { from: "questions", count: 10, points: 5, excludeTopics: ["bpmn", "handelser"] },
        { from: "questions", count: 1, points: 3, topics: ["bpmn", "handelser"] },
        { from: "bpmnTasks", count: 2, kinds: ["aktiviteter", "element", "slut"] },
        { from: "bpmnTasks", count: 1, kinds: ["tid"] },
      ],
      essayPoints: 30,
      intro: "HT25-formatet: två essäer à 15 p, tio BPM-flervalsfrågor à 5 p och fyra BPMN-frågor à 3–7 p. Fel svar ger −1, blankt 0. Essäerna är 30 % av poängen.",
      howto: "Provet är flervalsdelen: tio BPM-frågor balanserat dragna över ämnena, en BPMN-begreppsfråga à 3 p och tre körfrågor ur Kör processen med tentans poäng och alternativ.",
    },
    chapters: processChapters,
    glossary: processGlossary,
    readingIntro: processIntro,
    examNote: processExamNote,
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
