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
// Returnerar { options, correct } där options[i].originalIndex pekar tillbaka
// på ordningen i datafilen.
export function shuffleQuestion(question) {
  const withIndex = question.options.map((option, originalIndex) => ({
    ...option,
    originalIndex,
  }));
  const options = shuffle(withIndex);
  const correct = options.findIndex(
    (option) => option.originalIndex === question.correct,
  );
  return { options, correct };
}
