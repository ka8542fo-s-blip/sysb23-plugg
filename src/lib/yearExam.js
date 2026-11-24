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
// ändras alltså inte en tenta man redan har påbörjat. Poängen följer däremot
// manifestet: withYearPoints sätter om dem när en sparad tenta laddas.
//
// Bokdelen vägs mot lärarens fokusämnen: en sektion med `focus: n` drar n
// frågor ur `yearExam.focusChapters` (högst en per kapitel i första varvet)
// och resten ur övriga bokkapitel.
//
// Essäerna rättas inte automatiskt. Deras poäng är den egna bedömningen:
// `essayPoints` × andelen ibockade punkter i essäns checklista, avrundat.
import { seededShuffle } from "./mockExam.js";
import { examResult } from "./choiceExam.js";
import { gradeFor } from "./gradeScale.js";

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
  const focus = new Set(config.focusChapters || []);
  const sections = config.sections.map((section) => {
    const pool = pools[section.pool] || [];
    const groupOf = section.pool === "variant" ? (q) => q.variantOf : chapterOf;
    const key = `${seed}:${section.pool}`;
    // Varianterna sprids över de gamla frågorna (en per gammal fråga i första
    // varvet); de andra poolerna över kapitlen.
    let picked;
    if (section.focus && focus.size) {
      const inFocus = pool.filter((q) => focus.has(chapterOf(q)));
      const rest = pool.filter((q) => !focus.has(chapterOf(q)));
      const fromFocus = spread(inFocus, section.focus, `${key}:fokus`, groupOf).slice(0, section.focus);
      const fromRest = spread(rest, section.count - fromFocus.length, `${key}:ovrigt`, groupOf);
      // Räcker inte övriga kapitel fylls det på ur fokuskapitlen.
      const extra = spread(inFocus.filter((q) => !fromFocus.includes(q)), section.count, `${key}:extra`, groupOf);
      picked = seededShuffle([...fromFocus, ...fromRest, ...extra].slice(0, section.count), `${key}:ordning`);
    } else {
      picked = spread(pool, section.count, key, groupOf).slice(0, section.count);
    }
    return {
      title: section.title,
      pool: section.pool,
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

// Hela provtentans maxpoäng: flervalsdelen plus essäerna.
export const yearExamTotal = (config) => yearExamMax(config) + (config.essays || 0) * (config.essayPoints || 0);

// En sparad provtenta med manifestets poäng och avdrag. Sektionerna känns igen
// på `pool`; tentor dragna före 24 nov saknar den och känns igen på ordningen
// (varianter, föreläsningar, bok). Svaren sparas per frågenummer och påverkas
// inte. Samma objekt tillbaka om inget ändras.
export function withYearPoints(config, exam) {
  if (!config || !exam?.generated) return exam;
  let index = -1;
  let changed = false;
  const sections = exam.sections.map((section) => {
    if (!section.parts.some((part) => part.question)) return section;
    index += 1;
    const rule = config.sections.find((s) => s.pool === section.pool) ?? config.sections[index];
    if (!rule) return section;
    const parts = section.parts.map((part) => {
      if (!part.question || (part.points === rule.points && part.penalty === rule.penalty)) return part;
      changed = true;
      return { ...part, points: rule.points, penalty: rule.penalty };
    });
    if (section.pool !== rule.pool) changed = true;
    return { ...section, pool: rule.pool, parts };
  });
  return changed ? { ...exam, sections } : exam;
}

// Essäns egen bedömning: `max` × andelen ibockade checklistpunkter.
export function essayScore(essay, checks = [], max = 0) {
  const total = (essay?.checklist || []).reduce((sum, group) => sum + group.points.length, 0);
  if (!total || !max) return 0;
  const ticked = Array.from({ length: total }, (_, i) => Boolean(checks[i])).filter(Boolean).length;
  return Math.round((max * ticked) / total);
}

// Provtentans resultat: flervalsdelen (choiceExam) plus essäerna enligt den
// egna bedömningen, och betyget på totalen. `essays` är essädelarna med
// `essayItem` (views/ChoiceExam.jsx), `state` tentans sparade tillstånd.
export function yearExamResult(config, parts, essays, state) {
  const choice = examResult(parts, state.choices);
  const perEssay = config.essayPoints || 0;
  const essayPoints = essays.reduce((sum, part) => sum + essayScore(part.essayItem, state.checks?.[part.no], perEssay), 0);
  const essayMax = essays.length * perEssay;
  const points = choice.points + essayPoints;
  const max = choice.max + essayMax;
  return {
    ...choice,
    choicePoints: choice.points,
    choiceMax: choice.max,
    essayPoints,
    essayMax,
    points,
    max,
    grade: gradeFor(max ? (100 * points) / max : 0),
  };
}
