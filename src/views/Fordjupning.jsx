import { useMemo, useState } from "react";
import SegmentedControl from "../components/SegmentedControl.jsx";
import { FORDJUPNING_WHY } from "../data/arkitektur/cards.js";
import { KEYS, load, save } from "../lib/storage.js";
import ExamArchive from "./ExamArchive.jsx";
import Practice from "./Practice.jsx";

// Fliken Fördjupning (Verksamhetsarkitektur): extra material utanför
// modulerna, som läraren har sagt att tentan bygger på.
//
// - Fler frågor: course.extraQuestions (lärarens Word-dokument) i samma
//   Öva-vy. Svaren ligger i samma sysb23:answers och klar betyder två rätt i
//   rad, men vyn får ett eget delkurs-id (FORDJUPNING_ID), så att kö, öppen
//   fråga, urval och genomgång hålls åtskilda från Öva.
// - Förra årets tentor: arkivet, med en förklaring av hur de skiljer sig.
//
// Vald del sparas. Ingen automatisk navigering.

export const FORDJUPNING_ID = "arkitektur:fordjupning";

// Id:na "docx" och "arkiv" ligger sparade (KEYS.fordjupningPart) och byts inte.
const PARTS = [
  { id: "docx", label: "Fler frågor" },
  { id: "arkiv", label: "Förra årets tentor" },
];

export default function Fordjupning({ course, params, navigate, modelProgress, ...practiceProps }) {
  const [part, setPartState] = useState(() => {
    if (params?.part && PARTS.some((p) => p.id === params.part)) return params.part;
    const saved = load(KEYS.fordjupningPart, "docx");
    return PARTS.some((p) => p.id === saved) ? saved : "docx";
  });
  const setPart = (next) => {
    setPartState(next);
    save(KEYS.fordjupningPart, next);
  };
  const extraCourse = useMemo(
    () => ({
      ...course,
      id: FORDJUPNING_ID,
      name: "Fördjupning, fler frågor",
      questions: course.extraQuestions,
      pastExams: [],
      examBank: [],
      choiceExams: [],
    }),
    [course],
  );

  return (
    <div className="space-y-6">
      <section>
        <h1 className="font-display text-2xl">Fördjupning</h1>
        <p className="mt-1 max-w-reading text-[15px] leading-relaxed text-ink/80">{FORDJUPNING_WHY}</p>
      </section>
      <div className="max-w-xl">
        <SegmentedControl label="Välj del" segments={PARTS} value={part} onChange={setPart} />
      </div>
      {part === "docx" ? (
        <section className="space-y-4">
          <p className="max-w-reading text-[15px] text-ink/80">
            {course.extraQuestions.length} frågor ur ett Word-dokument med kursmaterial från läraren. De
            finns inte i modulerna.
          </p>
          <Practice
            {...practiceProps}
            course={extraCourse}
            title="Fler frågor"
            params={part === "docx" && params?.part === "docx" ? params : undefined}
            navigate={navigate}
          />
        </section>
      ) : (
        <ExamArchive course={course} navigate={navigate} modelProgress={modelProgress} />
      )}
    </div>
  );
}
