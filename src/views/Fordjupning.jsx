import { useMemo, useState } from "react";
import SegmentedControl from "../components/SegmentedControl.jsx";
import { FORDJUPNING_NOTE } from "../data/arkitektur/cards.js";
import { KEYS, load, save } from "../lib/storage.js";
import ExamArchive from "./ExamArchive.jsx";
import Practice from "./Practice.jsx";

// Fliken Fördjupning (Verksamhetsarkitektur): allt utanför UF:s tips.
//
// - UF:s råmaterial (docx): course.extraQuestions i samma Öva-vy. Svaren
//   ligger i samma sysb23:answers och klar betyder två rätt i rad, men vyn
//   får ett eget delkurs-id (FORDJUPNING_ID), så att kö, öppen fråga, urval
//   och genomgång hålls åtskilda från Kärna.
// - HT25-tentorna: arkivet, märkt som äldre kursversion.
//
// Vald del sparas. Ingen automatisk navigering.

export const FORDJUPNING_ID = "arkitektur:fordjupning";

const PARTS = [
  { id: "docx", label: "UF:s råmaterial (docx)" },
  { id: "arkiv", label: "HT25-tentorna" },
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
      name: "Fördjupning (docx)",
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
        <p className="inline-block rounded-full border border-brass px-3 py-0.5 text-[13px] font-medium text-brass-text">
          {FORDJUPNING_NOTE}
        </p>
        <h1 className="mt-2 font-display text-2xl">Fördjupning</h1>
        <p className="mt-1 max-w-reading text-[15px] text-ink/80">
          Sådant som inte ingår i det UF har sagt att tentan bygger på. Öva modulfrågorna i Öva först.
        </p>
      </section>
      <div className="max-w-xl">
        <SegmentedControl label="Välj del" segments={PARTS} value={part} onChange={setPart} />
      </div>
      {part === "docx" ? (
        <section className="space-y-4">
          <p className="max-w-reading text-[15px] text-ink/80">
            {course.extraQuestions.length} frågor ur UF:s råmaterial (docx) med svar i filen och som inte finns i
            modulerna. Svaren räknas som i Öva: en fråga är klar efter två rätt i rad.
          </p>
          <Practice
            {...practiceProps}
            course={extraCourse}
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
