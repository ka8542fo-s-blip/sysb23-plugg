// Viktad repetition: frågor man svarat fel på senast väger tyngst,
// obesvarade näst tyngst, tidigare rätta minst.
export function weightFor(questionId, answers) {
  const stat = answers[questionId];
  if (!stat || stat.correct + stat.wrong === 0) return 2; // obesvarad
  if (stat.last === "wrong") return 3; // senast fel
  return 1; // senast rätt
}

// Viktad slumpdragning utan upprepning.
export function weightedPick(items, count, weightOf) {
  const pool = items.map((item) => ({ item, weight: Math.max(weightOf(item), 0.0001) }));
  const picked = [];
  const wanted = Math.min(count, pool.length);

  while (picked.length < wanted) {
    const total = pool.reduce((sum, entry) => sum + entry.weight, 0);
    let threshold = Math.random() * total;
    let index = pool.length - 1;
    for (let i = 0; i < pool.length; i++) {
      threshold -= pool[i].weight;
      if (threshold <= 0) {
        index = i;
        break;
      }
    }
    picked.push(pool[index].item);
    pool.splice(index, 1);
  }
  return picked;
}

// Provet: 10 frågor slumpade men balanserat över ämnena, max 2 per ämne.
export function balancedExamPick(questions, count = 10, maxPerTopic = 2) {
  const byTopic = new Map();
  for (const question of questions) {
    if (!byTopic.has(question.topic)) byTopic.set(question.topic, []);
    byTopic.get(question.topic).push(question);
  }

  const buckets = shuffleArray([...byTopic.values()]).map((list) =>
    shuffleArray(list),
  );
  const picked = [];

  // Ta en fråga per ämne i taget tills kvoten är full eller taket nås.
  for (let round = 0; round < maxPerTopic && picked.length < count; round++) {
    for (const bucket of buckets) {
      if (picked.length >= count) break;
      const question = bucket[round];
      if (question) picked.push(question);
    }
  }
  return shuffleArray(picked).slice(0, count);
}

function shuffleArray(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
