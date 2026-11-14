// Provtentorna i fliken Tenta (Verksamhetsarkitektur): ren logik. Datat
// byggs i data/arkitektur/mockExams.js, vyn är views/MockExam.jsx.
//
// - Modulfrågorna delas i tre fasta mängder utan överlapp: per modul och per
//   frågetyp (flerval, sant/falskt) blandas frågorna med ett fast frö och
//   delas ut i tur och ordning, så att varje provtenta får ungefär en
//   tredjedel av varje moduls frågor.
// - Alternativen blandas en gång per provtenta och fråga med ett fast frö
//   (samma ordning vid varje laddning); `fixedOrder` och `last` respekteras
//   som i Öva.
// - Ett svar är ett alternativindex i frågans egen `options`, så att det
//   betyder samma sak oavsett visad ordning.

// Ett deterministiskt slumptal ur en sträng (FNV-1a + mulberry32).
export function seededRandom(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededShuffle(items, seed) {
  const random = seededRandom(seed);
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Alternativens visade ordning som index i frågans `options`.
export function lockedOrder(question, seed) {
  const indices = question.options.map((_, index) => index);
  if (question.fixedOrder) return indices;
  const movable = indices.filter((index) => !question.options[index].last);
  const last = indices.filter((index) => question.options[index].last);
  return [...seededShuffle(movable, seed), ...last];
}

const texts = (question) => question.options.map((option) => (typeof option === "string" ? option : option.text));
export const isStatement = (question) => texts(question).length === 2 && /^true$/i.test(texts(question)[0]);

// Tre provtentor. `chapterOf` ger en frågas modul, `chapterOrder` modulernas
// ordning (12, 1–11), `freeText` de två fritextfrågorna per provtenta.
export function buildMockExams({ questions, essays, chapterOf, chapterOrder, chapters, freeText, count = 3 }) {
  const buckets = Array.from({ length: count }, () => ({ val: [], sant: [] }));
  chapterOrder.forEach((chapterId, moduleIndex) => {
    const inModule = questions.filter((question) => chapterOf(question) === chapterId);
    for (const [type, list] of [["val", inModule.filter((q) => !isStatement(q))], ["sant", inModule.filter(isStatement)]]) {
      const shuffled = seededShuffle(list, `provtenta:${chapterId}:${type}`);
      // Startplatsen roterar per modul och typ, så att överskotten sprids.
      const start = (moduleIndex + (type === "sant" ? 1 : 0)) % count;
      shuffled.forEach((question, index) => buckets[(start + index) % count][type].push(question));
    }
  });
  const chapterTitle = Object.fromEntries((chapters || []).map((chapter) => [chapter.id, chapter]));
  const byModule = (list) =>
    [...list].sort((a, b) => chapterOrder.indexOf(chapterOf(a)) - chapterOrder.indexOf(chapterOf(b)));

  return buckets.map((bucket, examIndex) => {
    const id = `ea-prov-${examIndex + 1}`;
    const choicePart = (task) => (question, index) => ({
      no: `${task}.${index + 1}`,
      task,
      kind: "val",
      chapter: chapterOf(question),
      item: question,
      order: lockedOrder(question, `${id}:${question.id}`),
    });
    const free = (freeText[examIndex] || []).map((essayId, index) => {
      const essay = essays.find((item) => item.id === essayId);
      return { no: `1${"ab"[index]}`, task: 1, kind: "fritext", chapter: essay.chapter, essay };
    });
    return {
      id,
      title: `Provtenta ${examIndex + 1}`,
      tasks: [
        { no: 1, title: "Uppgift 1", subtitle: "Fritext: en essä och ett scenario", parts: free },
        { no: 2, title: "Uppgift 2", subtitle: "Flerval", parts: byModule(bucket.val).map(choicePart(2)) },
        { no: 3, title: "Uppgift 3", subtitle: "Sant/falskt", parts: byModule(bucket.sant).map(choicePart(3)) },
      ],
      chapterTitle,
    };
  });
}

export const examParts = (exam) => exam.tasks.flatMap((task) => task.parts);

export const emptyMockState = () => ({ choices: {}, texts: {}, checks: {}, current: "1a", submittedAt: null });

const rightOf = (question) => (Array.isArray(question.correct) ? question.correct : [question.correct]);

// "ratt", "fel" eller "blank" för en flervals- eller sant/falskt-del.
export function partStatus(part, choice) {
  if (choice === null || choice === undefined) return "blank";
  return rightOf(part.item).includes(choice) ? "ratt" : "fel";
}

// Resultatet: x av y rätt per uppgift 2 och 3, bockade checklistpunkter i
// uppgift 1, och fel (fel eller obesvarade) grupperade per modul i
// kursens ordning.
export function mockExamResult(exam, state = emptyMockState(), chapterOrder = []) {
  const choices = state.choices || {};
  const checks = state.checks || {};
  const tasks = {};
  const wrong = {};
  let answered = 0;
  let choiceTotal = 0;
  for (const task of exam.tasks) {
    if (task.no === 1) {
      let checked = 0;
      let total = 0;
      for (const part of task.parts) {
        const points = (part.essay.checklist || []).flatMap((group, g) => group.points.map((_, p) => `${g}:${p}`));
        total += points.length;
        checked += points.filter((key) => checks[part.no]?.[key]).length;
        if ((state.texts?.[part.no] || "").trim()) answered++;
      }
      tasks[1] = { checked, total };
      continue;
    }
    let right = 0;
    for (const part of task.parts) {
      choiceTotal++;
      const status = partStatus(part, choices[part.no]);
      if (status !== "blank") answered++;
      if (status === "ratt") right++;
      else (wrong[part.chapter] ||= []).push(part.no);
    }
    tasks[task.no] = { right, total: task.parts.length };
  }
  const order = chapterOrder.length ? chapterOrder : Object.keys(wrong);
  const wrongByChapter = order.filter((id) => wrong[id]).map((chapterId) => ({ chapterId, parts: wrong[chapterId] }));
  return { tasks, answered, choiceTotal, wrongByChapter, submitted: Boolean(state.submittedAt) };
}
