// Läget Tentafrågor i Öva: gamla tentors flervalsdelar ur
// `course.pastExams` (data/<kurs>/pastExams.js), i tentornas ordning.
// Svaren sparas för sig (sysb23:tentafragor, användarbeslut 2026-10-22):
// läget börjar från noll och rör varken Öva, Statistik eller BPMN-övningar.
// Samma kö och klar-regel som Öva (två rätt i rad, lib/practiceQueue.js).
import { taskToQuestion } from "./examPlan.js";
import { isAnswered, isDone, normalizeStat } from "./practiceQueue.js";

const NONE_OF_THE_OTHERS = "Inget av övriga alternativ";

export function pastExamsOf(course) {
  return [...(course?.pastExams || [])].sort((a, b) => a.date.localeCompare(b.date));
}

export const examParts = (exam) => exam.sections.flatMap((section) => section.parts);

// En uppgift ur BPMN-övningar i frågeform. Öva blandar alternativen varje
// gång, så "Inget av övriga alternativ" märks last och står kvar sist —
// annars skulle det gå att klara frågan på platsen i listan.
function taskItem(course, id) {
  const task = (course.bpmnTasks || []).find((item) => item.id === id);
  if (!task) return null;
  const question = taskToQuestion(task);
  return {
    ...question,
    options: question.options.map((option) =>
      option.text === NONE_OF_THE_OTHERS ? { ...option, last: true } : option,
    ),
  };
}

function resolve(course, part) {
  if (part.question) return course.questions.find((question) => question.id === part.question) || null;
  if (part.task) return taskItem(course, part.task);
  return null; // essä
}

// En post per räknad del, i tentornas ordning; tom lista = inget läge.
// Posten är frågan själv plus var den kom ifrån; svårighetsgraden och
// källtexten byts mot tentans etikett. Byggs en gång per delkurs (useMemo),
// så att blandningen av alternativen ligger still medan man svarar.
export function pastExamItems(course) {
  const items = [];
  for (const exam of pastExamsOf(course)) {
    for (const section of exam.sections) {
      for (const part of section.parts) {
        const question = resolve(course, part);
        if (!question) continue;
        items.push({
          ...question,
          difficulty: undefined,
          source: undefined,
          exam: exam.id,
          no: part.no,
          points: part.points,
          section: section.title,
          run: part.run ?? part.task ?? null,
        });
      }
    }
  }
  return items;
}

// "klar" (två rätt i rad), "fel" (senaste svaret fel), "ett-ratt" (rätt
// senast, väntar på sitt andra) eller "obesvarad". Visad men obesvarad
// räknas som obesvarad, som i Öva.
export function partState(stat) {
  const s = normalizeStat(stat);
  if (!isAnswered(s)) return "obesvarad";
  if (isDone(s)) return "klar";
  return s.last === "wrong" ? "fel" : "ett-ratt";
}

export function tally(items, answers) {
  const result = { total: items.length, done: 0, wrong: 0, pending: 0, unseen: 0 };
  for (const item of items) {
    const state = partState(answers[item.id]);
    if (state === "klar") result.done++;
    else if (state === "fel") result.wrong++;
    else if (state === "ett-ratt") result.pending++;
    else result.unseen++;
  }
  return result;
}

// "10 × 5 p" när alla delar ger lika mycket, annars "3–7 p".
export function pointsSummary(parts) {
  const points = parts.map((part) => part.points);
  const min = Math.min(...points);
  const max = Math.max(...points);
  return min === max ? `${points.length} × ${min} p` : `${min}–${max} p`;
}

export const examLabel = (exam) => `${exam.title} ${exam.dateLabel}`;
