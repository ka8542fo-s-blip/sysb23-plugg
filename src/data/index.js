import { topics as strategiTopics } from "./strategi/topics.js";
import { questions as strategiQuestions } from "./strategi/questions.js";
import { essays as strategiEssays } from "./strategi/essays.js";
import {
  chapters as strategiChapters,
  glossary as strategiGlossary,
} from "./strategi/reading.js";
import { levels as sqlLevels, sqlExercises } from "./databaser/sqlExercises.js";
import { examSections as sqlExamSections, sqlExamTasks } from "./databaser/sqlExamBank.js";
import { topics as databaserTopics } from "./databaser/topics.js";
import { questions as databaserQuestions } from "./databaser/questions.js";
import {
  chapters as databaserChapters,
  glossary as databaserGlossary,
  intro as databaserIntro,
  examNote as databaserExamNote,
  summary as databaserSummary,
} from "./databaser/reading.js";
import { intro as strategiIntro } from "./strategi/reading.js";
import { topics as processTopics } from "./process/topics.js";
import { questions as processQuestions } from "./process/questions.js";
import { essays as processEssays } from "./process/essays.js";
import { tasks as processBpmnTasks } from "./process/bpmnTasks.js";
import { pastExams as processPastExams } from "./process/pastExams.js";
import {
  chapters as processChapters,
  glossary as processGlossary,
  intro as processIntro,
  examNote as processExamNote,
  summary as processSummary,
} from "./process/reading.js";
import { examBank as sakerhetExamBank } from "./sakerhet/examBank.js";
import { pastExams as sakerhetPastExams } from "./sakerhet/pastExams.js";

// Tomma listor för delkurser som ännu inte har den sortens material.
const noContent = {
  topics: [],
  questions: [],
  essays: [],
  chapters: [],
  glossary: [],
  sqlLevels: [],
  sqlExercises: [],
  sqlExamSections: [],
  // Gamla tentors flervalsfrågor för läget Tentafrågor i Öva (data/<kurs>/pastExams.js).
  // Inte samma sak som Databasers oldExams: de är konstruktionsuppgifter i fliken Tenta.
  pastExams: [],
  // Tentafrågor som inte (ännu) har ett kapitel bakom sig och därför inte
  // är Öva-frågor i `questions`. pastExams pekar hit när frågan inte finns
  // i `questions` (Säkerhet tills föreläsningarna finns).
  examBank: [],
  // Hela gamla flervalstentor att skriva i fliken Tenta, med poäng, avdrag
  // och betyg (samma form som pastExams). Tom = fliken Tenta är Databasers.
  choiceExams: [],
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
    // Java (2026-10-26): tentans Java/JDBC-uppgift, direkt efter SQL.
    views: ["las", "sql", "java", "modell", "tenta", "ova", "statistik"],
    // Öva speglar Läs: kvizzarna grupperas per kapitel, inte per ämne.
    practiceBy: "chapter",
    // Uppläsningen spelar förgenererat ljud (public/audio, Google Chirp 3
    // HD) där det finns. Delkurser utan flaggan läses med Web Speech, och
    // scripts/tts-generate.mjs vägrar generera ljud för dem.
    ttsAudio: true,
    topics: databaserTopics,
    questions: databaserQuestions,
    chapters: databaserChapters,
    // Sammanfattningen: ett brett kort ovanför kapitlen i Läs, inget kapitel.
    summary: databaserSummary,
    glossary: databaserGlossary,
    readingIntro: databaserIntro,
    examNote: databaserExamNote,
    sqlLevels,
    sqlExercises: [...sqlExercises, ...sqlExamTasks],
    sqlExamSections,
  },
  {
    ...noContent,
    id: "process",
    name: "Processorienterad verksamhetsutveckling",
    status: "aktiv",
    // Byggs i faser (2026-09-29): Läs först, sedan Öva, Essä, BPMN-övningar
    // och Prov. Flikarna läggs till när deras innehåll finns.
    views: ["las", "ova", "bpmn", "prov", "essa", "statistik"],
    practiceBy: "chapter",
    ttsAudio: true, // förgenererat uppläsningsljud, se Databaser
    topics: processTopics,
    questions: processQuestions,
    essays: processEssays,
    bpmnTasks: processBpmnTasks,
    // Tentafrågor i Öva: HT25-tentornas flervalsdelar i tentans ordning.
    pastExams: processPastExams,
    // Provet i HT25-tentans form: 10 BPM-frågor à 5 p, sedan BPMN-delen
    // som på tentan — en begreppsfråga à 3 p och tre körfrågor ur
    // BPMN-övningar med tentans poäng (4–7 p). Essäerna (2 à 15 p) ligger utanför.
    exam: {
      sections: [
        { from: "questions", count: 10, points: 5, excludeTopics: ["bpmn", "handelser"] },
        { from: "questions", count: 1, points: 3, topics: ["bpmn", "handelser"] },
        { from: "bpmnTasks", count: 2, kinds: ["aktiviteter", "element", "slut"] },
        { from: "bpmnTasks", count: 1, kinds: ["tid"] },
      ],
      essayPoints: 30,
      intro: "HT25-formatet: två essäer à 15 p, tio BPM-flervalsfrågor à 5 p och fyra BPMN-frågor à 3–7 p. Fel svar ger −1, blankt 0. Essäerna är 30 % av poängen.",
      howto: "Provet är flervalsdelen: tio BPM-frågor balanserat dragna över ämnena, en BPMN-begreppsfråga à 3 p och tre körfrågor ur BPMN-övningar med tentans poäng och alternativ.",
    },
    chapters: processChapters,
    // Sammanfattningen: ett brett kort ovanför kapitlen i Läs, inget kapitel.
    summary: processSummary,
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
  {
    ...noContent,
    id: "sakerhet",
    name: "Säkerhet i informationssystem",
    status: "aktiv",
    // Byggs i faser (2026-11-13) på det som finns: tre HT25-tentor och två
    // uppgiftsbeskrivningar. Föreläsningsbilder och läsanvisning saknas, så
    // inget kompendium och inga kapitelfrågor än. Öva har bara Tentafrågor
    // (examBank via pastExams); kapitelfrågorna läggs i `questions` när
    // föreläsningarna finns, och då dyker växeln Alla frågor/Tentafrågor upp.
    views: ["ova"],
    examBank: sakerhetExamBank,
    pastExams: sakerhetPastExams,
    pastExamNote:
      "Tentorna publicerades utan facit. Rätt svar och förklaringar är sajtens egna, skrivna utifrån Stallings & Brown.",
    homeIntro:
      "Öva in de 26 frågorna från HT25:s tre tentor — de återkommer nästan ordagrant — med tentans poäng och avdrag på varje fråga. Kompendium och kapitelfrågor kommer när föreläsningsbilderna finns.",
  },
];

export const activeCourses = courses.filter((course) => course.status === "aktiv");

export function getCourse(id) {
  return courses.find((course) => course.id === id) || activeCourses[0];
}
