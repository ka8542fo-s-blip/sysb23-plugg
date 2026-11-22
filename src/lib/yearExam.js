// Provtenta i årets format (Säkerhet): drar en hel tenta ur kapitelfrågorna
// enligt manifestets `yearExam`, i samma form som en gammal tenta
// (pastExams), så att fliken Tenta (views/ChoiceExam.jsx, lib/choiceExam.js)
// rättar, poängsätter och sparar den som vilken tenta som helst.
//
// Poolerna:
//   "variant"     — frågor med `variantOf` (varianter av förra årets frågor)
//   "forelasning" — övriga frågor i kapitel med kind "forelasning"
//   "bok"         — övriga frågor i kapitel med kind "bok"
// Dragningen är deterministisk ur fröet, men den dragna tentan sparas i sin
// helhet (frågor och alternativordning). Kommer det nya frågor i banken
// ändras alltså inte en tenta man redan har påbörjat.
import { seededShuffle } from "./mockExam.js";

const chapterKindOf = (course) => {
  const kindOf = Object.fromEntries((course.chapters || []).map((c) => [c.id, c.kind]));
  const chapterOf = Object.fromEntries((course.topics || []).map((t) => [t.id, t.chapter]));
  return (question) => kindOf[question.chapter ?? chapterOf[question.topic]] ?? null;
};
const chapterIdOf = (course) => {
  const chapterOf = Object.fromEntries((course.topics || []).map((t) => [t.id, t.chapter]));
  return (question) => question.chapter ?? chapterOf[question.topic] ?? null;
};

export function yearExamPools(course) {
  const kind = chapterKindOf(course);
  const questions = course.questions || [];
  return {
    variant: questions.filter((q) => q.variantOf),
    forelasning: questions.filter((q) => !q.variantOf && kind(q) === "forelasning"),
    bok: questions.filter((q) => !q.variantOf && kind(q) === "bok"),
  };
}

// Sprider dragningen över kapitlen: ett per kapitel i blandad ordning, varv
// för varv, tills `count` är nådd. Varianter: högst en per gammal fråga.
function spread(items, count, seed, groupOf) {
  const groups = new Map();
  for (const item of seededShuffle(items, `${seed}:pool`)) {
    const key = groupOf(item);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  const order = seededShuffle([...groups.keys()], `${seed}:grupper`);
  const picked = [];
  for (let round = 0; picked.length < count; round++) {
    let added = false;
    for (const key of order) {
      const item = groups.get(key)[round];
      if (item && picked.length < count) {
        picked.push(item);
        added = true;
      }
    }
    if (!added) break;
  }
  return picked;
}

// En ny provtenta: { id, title, dateLabel, created, seed, sections, essays }.
// `number` är provtentans löpnummer (Provtenta 1, 2 …), `created` en iso-tid.
export function drawYearExam(course, seed, number, created = new Date().toISOString()) {
  const config = course.yearExam;
  const pools = yearExamPools(course);
  const chapterOf = chapterIdOf(course);
  let no = 0;
  const sections = config.sections.map((section) => {
    const pool = pools[section.pool] || [];
    const groupOf = section.pool === "variant" ? (q) => q.variantOf : chapterOf;
    // Varianterna sprids över de gamla frågorna (en per gammal fråga i första
    // varvet); de andra poolerna över kapitlen.
    const picked = spread(pool, section.count, `${seed}:${section.pool}`, groupOf).slice(0, section.count);
    return {
      title: section.title,
      parts: picked.map((question) => {
        no += 1;
        return {
          no: String(no),
          points: section.points,
          penalty: section.penalty,
          question: question.id,
          // Inspera blandar alternativen; ordningen ligger fast i tentan.
          order: seededShuffle(question.options.map((_, i) => i), `${seed}:${question.id}`),
        };
      }),
    };
  });
  const essays = seededShuffle((course.essays || []).map((e) => e.id), `${seed}:essaer`)
    .slice(0, config.essays || 0)
    .map((essay) => {
      no += 1;
      return { no: String(no), essay };
    });
  const date = new Date(created);
  return {
    id: `sak-prov-${seed}`,
    title: `Provtenta ${number}`,
    dateLabel: `dragen ${date.getDate()} ${["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"][date.getMonth()]}`,
    created,
    seed,
    generated: true,
    sections: essays.length ? [...sections, { title: "Essäer", parts: essays }] : sections,
  };
}

// Poängen för provtentans flervalsdel, ur manifestet.
export const yearExamMax = (config) => config.sections.reduce((sum, s) => sum + s.count * s.points, 0);
