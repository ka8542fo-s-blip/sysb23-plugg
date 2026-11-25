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
import { topics as arkitekturTopics } from "./arkitektur/topics.js";
import { essaTeman as arkitekturEssaTeman } from "./arkitektur/essaTeman.js";
import { mockExams as arkitekturMockExams } from "./arkitektur/mockExams.js";
import {
  moduler as arkitekturModuler,
  modulerCards as arkitekturModulerCards,
  modulerChapters as arkitekturModulerChapters,
  modulerIntro as arkitekturModulerIntro,
  modulerQuestions as arkitekturModulerQuestions,
} from "./arkitektur/modulerView.js";
import { examBank as sakerhetExamBank } from "./sakerhet/examBank.js";
import {
  pastExams as sakerhetPastExams,
  ANSWER_RULE as sakerhetAnswerRule,
  ANSWER_TABLE as sakerhetAnswerTable,
} from "./sakerhet/pastExams.js";
import { assignments as sakerhetAssignments } from "./sakerhet/assignments.js";
import { topics as sakerhetTopics } from "./sakerhet/topics.js";
import { essays as sakerhetEssays, ESSAY_INTRO as sakerhetEssayIntro } from "./sakerhet/essays.js";
import { questions as sakerhetQuestions } from "./sakerhet/questions.js";
import {
  chapters as sakerhetChapters,
  glossary as sakerhetGlossary,
  intro as sakerhetIntro,
  examNote as sakerhetExamNote,
  summary as sakerhetSummary,
} from "./sakerhet/reading.js";

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
  // Inlämningsuppgifter för fliken Uppgifter (data/<kurs>/assignments.js).
  assignments: [],
  // Övningsfrågor utanför Öva, i fliken Fördjupning (Verksamhetsarkitektur:
  // UF:s docx-råmaterial). Samma svar och klar-logik som Öva.
  extraQuestions: [],
  // Förklarakort för fritextfrågorna i Öva (Verksamhetsarkitektur), i samma
  // kö och samma answers som frågorna men utanför `questions`.
  explainCards: [],
  // Provtentor i fliken Tenta utan poäng (Verksamhetsarkitektur). Tom = fliken
  // Tenta är Säkerhets (choiceExams) eller Databasers.
  mockExams: [],
  // Fliken Moduler (Verksamhetsarkitektur): lärarens moduler uppifrån och ned
  // med frågorna på sidan (data/arkitektur/modulerView.js).
  moduler: [],
  modulerIntro: null,
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
    status: "aktiv",
    // Tre delar (Kaspers beslut 2026-11-13): modulerna (Läs, Öva, Essä),
    // Zachman utöver modul 4:s frågor (Zachman-fliken, Zachman-essän) och
    // Fördjupning (Word-dokumentets frågor, förra årets tentor). Fliken Tentan
    // togs bort 2026-11-14 (Kasper: onödig). Ingen Prov: poängen är okända.
    // 2026-11-14 (enkel och tentafokuserad): Essä, Zachman och Fördjupning
    // döljs (finns kvar i repot och i lagringen). Fritextfrågorna övas som
    // förklarakort i Öva.
    // 2026-11-21 (Kaspers beslut: bara lärarens tre moduldokument): det som
    // inte står i PDF:erna visas inte. Borttaget ur manifestet men kvar i
    // repot: levels, practiceBlocks (Memorera), examArchive, extraQuestions.
    // 2026-11-22 (Kaspers beslut, plan godkänd): fliken Moduler ersätter Läs
    // och Tenta tas bort ur menyn; allt är på svenska. Läs, Tenta, ufView.js
    // och provtentorna finns kvar i repot men visas inte.
    // 2026-11-23 (Kaspers beslut efter lärarens besked om tentan): fliken
    // Essä med elva essäteman (data/arkitektur/essaTeman.js).
    views: ["moduler", "ova", "essa", "statistik"],
    moduler: arkitekturModuler,
    modulerIntro: arkitekturModulerIntro,
    // Öva: samma 136 frågor och 53 fritextfrågor som i Moduler, på svenska och
    // i modulordning 1–12 (modulerView.js). Ett kort per fritextfråga med
    // samma id som i Moduler; de 46 ihopslagna korten (explainCards.js)
    // visas inte längre.
    explainCards: arkitekturModulerCards,
    // Tre provtentor (data/arkitektur/mockExams.js). Raden om 0 p
    // (MOCK_EXAM_NOTE) står inte i lärarens dokument och visas inte.
    mockExams: arkitekturMockExams,
    practiceBy: "chapter",
    topics: arkitekturTopics,
    // Öva: lärarens 135 modulfrågor och exempelfrågan i modul 1:s inledning,
    // på svenska med en förklaring till varje (modulerView.js). Provtentorna
    // bygger fortfarande på ufView.js (engelska) men visas inte.
    questions: arkitekturModulerQuestions,
    // Essä (2026-11-23): elva teman som tillsammans täcker lärarens 37
    // essä-, fall-, scenario- och tankefrågor, med ett utvecklat modellsvar
    // på svenska och lärarens korta svar under. Tentan har tre essäfrågor,
    // cirka 200 ord, max 500. Lärarens 53 frågor som essäer (essays.js)
    // ligger kvar i repot men visas inte.
    essays: arkitekturEssaTeman,
    essayUnit: "essäteman",
    essayWordTarget: 200,
    essayWordLimit: 500,
    essayClosing: "Cirka 200 ord, max 500. Visa förståelse: problem och effekt höjer svaret.",
    essayIntro: [
      "Tentan har tre essäfrågor, 40 p. Sikta på cirka 200 ord, max 500.",
      "Lärarens modellsvar är korta. Visa mer: säg vad det är, vilket problem det löser eller skapar, vilken effekt det får, ge ett av lärarens exempel och koppla till en annan del av kursen.",
      "Varje tema täcker flera av lärarens frågor. Kan du temat kan du alla frågorna i det.",
    ],
    // Modulerna 1–12 med svenska titlar: grupperna i Öva och raderna i
    // Statistik. Läs (lärarens engelska text, ufView.js/ufText.js) och våra
    // kapiteltexter ligger kvar i repot och visas inte.
    chapters: arkitekturModulerChapters,
    // Hem (2026-11-22): en mening om var allt kommer ifrån och var man börjar.
    // Texten är sedan 23 nov omskriven, inte översatt.
    homeIntro:
      "Allt här kommer från lärarens tre moduldokument, på svenska. Börja i Moduler och fortsätt sedan i Öva.",
    // Tentans format enligt läraren (23 nov). Visas på Hem, eftersom
    // delkursen inte har fliken Läs där de andra visar den.
    examNote: {
      text: "Tentan: 30 flervalsfrågor (2 p per fråga, inga minuspoäng) och 3 essäfrågor (40 p, cirka 200 ord, max 500).",
    },
  },
  {
    ...noContent,
    id: "sakerhet",
    name: "Säkerhet i informationssystem",
    status: "aktiv",
    // Byggd i faser (13 och 22 nov 2026). Årets tenta (enligt läraren):
    // 5 frågor från tidigare tentor, 5 från föreläsningsbilderna, 8 från
    // bokens kapitel, 2 essäer. Läs: sammanfattning, ett kapitel per
    // föreläsning och per bokkapitel (`kind`, `label`). Öva: kapitelfrågor
    // under Alla frågor, med varianter av förra årets tentafrågor
    // (`variantOf`); förra årets frågor ordagrant under Tentafrågor
    // (examBank via pastExams). Tenta: skriv en hel gammal tenta med poäng,
    // avdrag och betyg; svaren räknas för sig och rör aldrig Öva.
    // Uppgifter: de två inlämningarna.
    views: ["las", "ova", "essa", "tenta", "uppgifter"],
    practiceBy: "chapter",
    // Lärarens exempel och sex egna scenarioessäer i samma stil, med
    // lärarens krav i checklistan; högst 700 ord (lärarens anslag 24 nov,
    // tillägget 25 nov om reflekterande scenariofrågor).
    essays: sakerhetEssays,
    essayIntro: sakerhetEssayIntro,
    essayWordLimit: 700,
    essayClosing: "Högst 700 ord. Svara på scenariot: vilka säkerhetsrisker som uppstår, varför de uppstår och vad man gör åt dem, med kursbegrepp ur bok och föreläsning, ett eget resonemang och ett motargument eller en begränsning.",
    topics: sakerhetTopics,
    questions: sakerhetQuestions,
    chapters: sakerhetChapters,
    summary: sakerhetSummary,
    glossary: sakerhetGlossary,
    readingIntro: sakerhetIntro,
    examNote: sakerhetExamNote,
    assignments: sakerhetAssignments,
    examBank: sakerhetExamBank,
    pastExams: sakerhetPastExams,
    choiceExams: sakerhetPastExams,
    // Provtentor i årets format i fliken Tenta (lib/yearExam.js), med
    // lärarens poäng (Canvas 24 nov 2026): 3 p för varianter och
    // föreläsningsfrågor, 5 p för bokfrågor, −1 för fel svar, 15 p per essä,
    // totalt 100. Essäpoängen är den egna bedömningen ur checklistan.
    // Betygsgränserna är inte bekräftade (gradeNote). Bokdelen drar `focus`
    // frågor ur lärarens fokuskapitel, de kapitel som har ett `focus`-fält
    // (lärarens formuleringar, visas som "Lärarens fokus" i Läs).
    yearExam: {
      intro:
        "Läraren har angett poängen: 20 frågor och 100 poäng. 5 frågor som liknar förra årets (3 p var), 5 från föreläsningsbilderna och relaterat material (3 p), 8 från bokens kapitel (5 p) och 2 essäer (15 p var, högst 700 ord), som är reflekterande scenariofrågor. En provtenta drar just det ur sajtens frågor, med 7 av bokfrågorna ur lärarens fokuskapitel.",
      rule: "Fel svar på en flervalsfråga ger −1, blankt ger 0. 5-poängsfrågor: svara alltid, en ren gissning ger i snitt +0,5. 3-poängsfrågor: en ren gissning ger i snitt 0, så svara om du kan stryka minst ett alternativ. Essäerna rättas inte automatiskt: efter inlämningen bockar du i checklistan, och essäpoängen blir din egen bedömning.",
      gradeNote: "Betygsgränserna är inte bekräftade för i år; sajten räknar med förra årets: A 85, B 75, C 65, D 55, E 50.",
      pastNote:
        "Förra årets tentor hade ett annat format: 20 flervalsfrågor à 3–8 poäng med avdrag för fel svar, och inga essäer. Frågorna kan återkomma med små variationer.",
      sections: [
        { pool: "variant", count: 5, points: 3, penalty: 1, title: "Från tidigare tentor, med små variationer" },
        { pool: "forelasning", count: 5, points: 3, penalty: 1, title: "Från föreläsningarna" },
        { pool: "bok", count: 8, focus: 7, points: 5, penalty: 1, title: "Från boken" },
      ],
      essays: 2,
      essayPoints: 15,
      showGrade: true,
    },
    // "När lönar det sig att svara?" på Tentas översikt.
    answerRule: sakerhetAnswerRule,
    answerTable: sakerhetAnswerTable,
    pastExamNote:
      "Tentorna publicerades utan facit. Rätt svar och förklaringar är sajtens egna, skrivna utifrån Stallings & Brown.",
    homeIntro:
      "Läs föreläsningarna och bokens kapitel, öva på frågor per kapitel och på förra årets tentafrågor, och skriv hela tentor. Årets tenta har 20 frågor och 100 poäng: 5 som liknar förra årets och 5 från föreläsningsbilderna (3 p var), 8 från boken (5 p var) och 2 essäer om scenarier (15 p var). Fel svar ger −1. Kapitlen märkta Lärarens fokus är de ämnen läraren pekat ut.",
  },
];

export const activeCourses = courses.filter((course) => course.status === "aktiv");

export function getCourse(id) {
  return courses.find((course) => course.id === id) || activeCourses[0];
}
