// Tentaprioritet: vad som faktiskt prövats på tidigare tentor och i
// Weavers quiz. Prioriteten informerar — den styr inte, döljer inget och
// tar inte bort någon text. Ämnen utan fältet får ingen etikett alls, så
// delkurser som saknar underlag ser ut som förut.
//
//   karna    — prövat som flervalsfråga (HT24 eller quiz F1)
//   essa     — prövat som essäfråga, kräver djup och inte bara igenkänning
//   bakgrund — aldrig prövat; läs om tid finns

export const PRIORITY_LABEL = { karna: "Kärna", essa: "Essä", bakgrund: "Bakgrund" };

export const PRIORITY_CLASS = {
  karna: "border-pine text-pine",
  essa: "border-brass text-brass",
  bakgrund: "border-line text-ink/65",
};

export const PRIORITY_ORDER = ["karna", "essa", "bakgrund"];

export function priorityOf(topic) {
  const value = topic?.examPriority;
  if (!value) return [];
  return (Array.isArray(value) ? value : [value]).filter((item) => PRIORITY_LABEL[item]);
}

// Ett kapitels prioritet är unionen av de ämnen det introducerar. Räcker
// ett ämne till kärna eller essä är kapitlet inte bakgrund — bakgrund
// gäller bara när inget av ämnena har prövats.
export function chapterPriority(chapter, topics) {
  const ids = chapter?.primaryTopics?.length ? chapter.primaryTopics : chapter?.topics || [];
  const found = new Set();
  for (const id of ids) {
    const topic = topics.find((item) => item.id === id);
    for (const level of priorityOf(topic)) found.add(level);
  }
  if (found.has("karna") || found.has("essa")) found.delete("bakgrund");
  return PRIORITY_ORDER.filter((level) => found.has(level));
}

export const isFastTrack = (levels) => levels.includes("karna") || levels.includes("essa");

export const hasPriorities = (topics) => (topics || []).some((topic) => priorityOf(topic).length > 0);

// "Prövat HT24: 2 flervalsfrågor · Prövat som essä HT24". Saknas underlag
// returneras null och raden uteblir — hellre tyst än påhittad statistik.
export function evidenceSentence(evidence) {
  if (!evidence) return null;
  const parts = [];
  if (evidence.mcq > 0) {
    parts.push(
      `Prövat HT24: ${evidence.mcq} ${evidence.mcq === 1 ? "flervalsfråga" : "flervalsfrågor"}`,
    );
  }
  if (evidence.quiz > 0) {
    parts.push(
      `Prövat i quiz F1: ${evidence.quiz} ${evidence.quiz === 1 ? "fråga" : "frågor"}`,
    );
  }
  if (evidence.essay) parts.push("Prövat som essä HT24");
  return parts.length ? parts.join(" · ") : null;
}
