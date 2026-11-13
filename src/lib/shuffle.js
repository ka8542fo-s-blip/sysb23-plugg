// Fisher–Yates. Returnerar alltid en ny array.
export function shuffle(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Blandar en frågas alternativ och mappar om vilket index som är rätt.
// Returnerar { options, correct, accepted } där options[i].originalIndex
// pekar tillbaka på ordningen i datafilen. Alternativ med `last: true`
// ("Inget av övriga alternativ") blandas inte utan står kvar sist, som på
// tentan.
//
// `correct` i datat är ett index, eller en lista när flera alternativ är
// rätta (Säkerhets sak-23 har två identiska). `correct` i vyn är då det
// första av dem, och `accepted` är alla, i visad ordning.
export function shuffleQuestion(question) {
  const withIndex = question.options.map((option, originalIndex) => ({
    ...option,
    originalIndex,
  }));
  const options = [
    ...shuffle(withIndex.filter((option) => !option.last)),
    ...withIndex.filter((option) => option.last),
  ];
  return viewFor(question, options);
}

// Vyn för en given ordning (alternativ med originalIndex), utan blandning.
export function viewFor(question, options) {
  const right = Array.isArray(question.correct) ? question.correct : [question.correct];
  const accepted = options
    .map((option, index) => (right.includes(option.originalIndex) ? index : -1))
    .filter((index) => index !== -1);
  return { options, correct: accepted[0] ?? -1, accepted };
}

// Är valt index (i visad ordning) ett av de rätta?
export const isAccepted = (view, chosen) =>
  chosen !== null && chosen !== undefined && (view.accepted ?? [view.correct]).includes(chosen);
