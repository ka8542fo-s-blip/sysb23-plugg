// Det som visas för Verksamhetsarkitektur sedan 2026-11-21 (Kaspers beslut:
// tentan bygger på lärarens tre moduldokument, så sidan visar bara det som
// står i dem). Datat i questions.js och essays.js är orört; här väljs bara
// vad som visas.
//
// - Förklaring bara där läraren själv har en "Explanation" i PDF:en
//   (`explanationUf`, ordagrant på engelska). Övriga frågor visar rätt svar.
// - Ingen svårighetsgrad: den är vår egen klassning.
// - Källan utan våra noter i parentes: "Modul 5, fråga 1, variant".
import { questions } from "./questions.js";

export const ufSource = (source) => String(source).split(" (")[0];

export const ufQuestions = questions.map((question) => {
  const { explanation: _sv, explanationUf, difficulty: _d, ...rest } = question;
  return { ...rest, explanation: explanationUf ?? null, source: ufSource(question.source) };
});
