// Fliken Uppgifter: delkursens inlämningsuppgifter (course.assignments),
// kraven samlade på ett ställe. Ren läsvy — inget att fylla i, alltså inget
// att spara. Underlaget och inlämningen finns i Canvas.
export default function Assignments({ course }) {
  const assignments = course.assignments || [];
  return (
    <div className="space-y-6">
      <section>
        <h1 className="font-display text-3xl">Uppgifter</h1>
        <p className="mt-2 max-w-reading text-[15px] leading-relaxed text-ink/80">
          Delkursens inlämningsuppgifter med kraven samlade. Underlaget och inlämningen finns i Canvas.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-2 xl:items-start">
        {assignments.map((assignment) => (
          <article key={assignment.id} className="card p-5 sm:p-6">
            <p className="text-sm text-ink/65">{assignment.kind}</p>
            <h2 className="mt-1 font-display text-2xl leading-snug">{assignment.title}</h2>
            <p className="mt-3 inline-flex flex-wrap items-baseline gap-x-2 rounded-lg border border-brass/50 px-3 py-1.5 text-[15px]">
              <span className="font-medium text-brass-text">Deadline</span>
              <span className="tabular">{assignment.deadline ?? "Se Canvas"}</span>
            </p>
            {assignment.available && <p className="mt-2 text-sm text-ink/70">{assignment.available}</p>}

            {assignment.sections.map((section) => (
              <section key={section.heading} className="mt-5">
                <h3 className="font-display text-lg">{section.heading}</h3>
                <ul className="mt-1.5 list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-ink/85">
                  {section.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </section>
            ))}

            {assignment.grading && (
              <section className="mt-5 rounded-lg border-l-2 border-brass bg-brass/[0.07] px-4 py-3">
                <h3 className="font-display text-lg">{assignment.grading.heading}</h3>
                <ul className="mt-1.5 space-y-0.5 text-[15px]">
                  {assignment.grading.points.map((point) => (
                    <li key={point} className="tabular">{point}</li>
                  ))}
                </ul>
                {assignment.grading.note && <p className="mt-1.5 text-sm text-ink/70">{assignment.grading.note}</p>}
              </section>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
