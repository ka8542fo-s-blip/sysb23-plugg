// Det som visas för Verksamhetsarkitektur sedan 2026-11-21 (Kaspers beslut:
// tentan bygger på lärarens tre moduldokument, så sidan visar bara det som
// står i dem). Datat i questions.js, essays.js och reading.js är orört; här
// väljs bara vad som visas.
//
// Öva:
// - Förklaring bara där läraren själv har en "Explanation" i PDF:en
//   (`explanationUf`, ordagrant på engelska). Övriga frågor visar rätt svar.
// - Ingen svårighetsgrad: den är vår egen klassning.
// - Källan utan våra noter i parentes: "Modul 5, fråga 1, variant".
//
// Läs:
// - Lärarens egen text ur PDF:erna (ufText.js), en sida per modul i
//   ordningen 12, 1–11. Inga ingresser, ingen "Läs mer", inga ämnesrutor
//   eller Zachman-ruta (`cardOnly`); källan är modulen; lästiden räknas ur
//   texten.
import { questions } from "./questions.js";
import { chapters } from "./reading.js";
import { UF_TEXT } from "./ufText.js";

export const ufSource = (source) => String(source).split(" (")[0];

export const ufQuestions = questions.map((question) => {
  const { explanation: _sv, explanationUf, difficulty: _d, ...rest } = question;
  return { ...rest, explanation: explanationUf ?? null, source: ufSource(question.source) };
});

const readingMinutes = (text) => Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 180));

export const ufChapters = chapters.map((chapter) => {
  const { likely: _likely, widget: _widget, cardAfter: _after, lead: _lead, ...rest } = chapter;
  return {
    ...rest,
    card: UF_TEXT[chapter.id],
    body: "",
    cardOnly: true,
    sources: [`Modul ${chapter.number}`],
    readingMinutes: readingMinutes(UF_TEXT[chapter.id]),
  };
});
