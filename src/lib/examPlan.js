// Provets sammansättning per delkurs. Manifestet (`course.exam`) anger
// sektioner; utan fält gäller Strategis HT25-format, så att dess prov är
// oförändrat.
//
// Sektion: { from: "questions" | "bpmnTasks", count, points?,
//            topics?: [...], excludeTopics?: [...], kinds?: [...] }
//   questions: dras balanserat över ämnena (högst två per ämne) och
//              alternativen blandas; `points` per fråga (standard 5).
//              Frågor med samma `group` (nära dubbletter) dras aldrig
//              tillsammans.
//   bpmnTasks: Kör processen-uppgifter med sina egna poäng och tentans
//              alternativordning (sista alternativet är ofta "Inget av
//              övriga"), högst en per diagram.
import { balancedExamPick } from "./weightedPick.js";
import { shuffle, shuffleQuestion } from "./shuffle.js";
import { POINTS } from "./scoring.js";
import { correctIndex } from "../data/process/bpmnTasks.js";

export const DEFAULT_EXAM = {
  sections: [{ from: "questions", count: 11, points: POINTS.correct }],
  essayPoints: 45,
  intro: "HT25-formatet: 11 flervalsfrågor à 5 poäng (−1 för fel) och 3 essäfrågor à 15 poäng. Essäerna är 45 % av poängen.",
  howto: "Provet är flervalsdelen: elva frågor balanserat dragna över ämnena (högst två per ämne), +5 för rätt svar, −1 för fel och 0 för överhoppad.",
};

export const examConfig = (course) => course?.exam || DEFAULT_EXAM;

const KIND_QUESTION = {
  aktiviteter: "Vilken kombination av aktiviteter inträffar om processen körs under förutsättningarna ovan?",
  tid: "Vid vilken tidpunkt har processen avslutats?",
};

// En Kör processen-uppgift i QuestionCard-form.
export function taskToQuestion(task) {
  return {
    id: task.id,
    topic: "handelser",
    question: task.question || KIND_QUESTION[task.kind],
    premises: task.premises,
    bpmnDiagram: task.diagram || null,
    elements: task.elements || null,
    options: task.options.map((text) => ({ text, explain: "" })),
    correct: correctIndex(task),
    source: task.source.replace(/\s*\(.*\)$/, ""),
    explanation: task.note || (task.explain ? task.explain.join(" ") : ""),
  };
}

// Behåller en slumpvis vald fråga per dubblettgrupp.
function oneGroupMember(questions) {
  const seen = new Set();
  return shuffle(questions).filter((q) => {
    if (!q.group) return true;
    if (seen.has(q.group)) return false;
    seen.add(q.group);
    return true;
  });
}

const identityView = (question) => ({
  options: question.options.map((option, originalIndex) => ({ ...option, originalIndex })),
  correct: question.correct,
});

export function pickExam(course) {
  const config = examConfig(course);
  const items = [];
  for (const section of config.sections) {
    if (section.from === "questions") {
      // Nära dubbletter delar `group`; högst en per grupp i samma prov.
      const usedGroups = new Set(items.map((item) => item.question.group).filter(Boolean));
      const pool = oneGroupMember(
        (course.questions || []).filter(
          (q) =>
            (!section.topics || section.topics.includes(q.topic)) &&
            (!section.excludeTopics || !section.excludeTopics.includes(q.topic)) &&
            !(q.group && usedGroups.has(q.group)),
        ),
      );
      for (const question of balancedExamPick(pool, section.count, 2)) {
        items.push({ question, view: shuffleQuestion(question), points: section.points ?? POINTS.correct });
      }
    } else if (section.from === "bpmnTasks") {
      const used = new Set(items.map((item) => item.diagram).filter(Boolean));
      const pool = shuffle((course.bpmnTasks || []).filter((t) => !section.kinds || section.kinds.includes(t.kind)));
      let taken = 0;
      for (const task of pool) {
        if (taken >= section.count) break;
        const key = task.diagram || task.id;
        if (used.has(key)) continue;
        used.add(key);
        const question = taskToQuestion(task);
        items.push({ question, view: identityView(question), points: task.points, diagram: key });
        taken++;
      }
    }
  }
  return items;
}

export const maxPoints = (items) => items.reduce((sum, item) => sum + (item.points ?? POINTS.correct), 0);
