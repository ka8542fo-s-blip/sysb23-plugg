import { useState } from "react";

const STATUS = {
  read: { label: "Läst", className: "border-correct text-correct" },
  reading: { label: "Pågående", className: "border-brass text-brass" },
  unread: { label: "Oläst", className: "border-line text-ink/65" },
};

// Etikett för kapitlets tentaområde. null = uttryckligen utanför tentan;
// saknas fältet helt har delkursen ingen områdesindelning och inget visas.
export function ExamAreaTag({ area }) {
  if (area === undefined) return null;
  return area ? (
    <span className="chip shrink-0 border-brass/60 py-0 text-xs text-brass">{area}</span>
  ) : (
    <span className="chip shrink-0 py-0 text-xs text-ink/65">Utanför tentan</span>
  );
}

// Kompendiets landningsläge: innehållsförteckning med progress.
export default function ChapterList({
  chapters,
  readChapters,
  currentId,
  onOpen,
  intro,
  examNote,
}) {
  const [onlyExam, setOnlyExam] = useState(false);
  const hasExamAreas = chapters.some((chapter) => "examArea" in chapter);
  const hasBackground = chapters.some((chapter) => !chapter.examArea);
  const shown = onlyExam
    ? chapters.filter((chapter) => chapter.examArea)
    : chapters;
  const readCount = chapters.filter((chapter) => readChapters[chapter.id]).length;
  const totalMinutes = chapters.reduce(
    (sum, chapter) => sum + (chapter.readingMinutes || 0),
    0,
  );
  const minutesLeft = chapters
    .filter((chapter) => !readChapters[chapter.id])
    .reduce((sum, chapter) => sum + (chapter.readingMinutes || 0), 0);
  const next = chapters.find((chapter) => !readChapters[chapter.id]) || chapters[0];
  const percent = chapters.length
    ? Math.round((readCount / chapters.length) * 100)
    : 0;

  if (chapters.length === 0) {
    return (
      <div className="card p-5 sm:p-6">
        <h2 className="font-display text-xl">Kompendiet är inte inlagt ännu</h2>
        <p className="mt-2 max-w-reading text-[15px] leading-relaxed text-ink/80">
          Kapiteltexterna och ordlistan ligger i{" "}
          <code className="rounded bg-paper px-1.5 py-0.5 text-[14px]">
            claude-code-prompt-sysb23-lasdel.md
          </code>
          , som inte finns i projektet. Läget är byggt och kopplat — så fort
          kapitlen klistras in i{" "}
          <code className="rounded bg-paper px-1.5 py-0.5 text-[14px]">
            src/data/strategi/reading.js
          </code>{" "}
          fylls innehållsförteckningen, kapitelvyn, ordlistan och sökningen.
        </p>
        <p className="mt-3 text-[15px] text-ink/70">
          Under tiden fungerar Begrepp-segmentet som vanligt.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {intro && (
        <p className="max-w-reading text-[17px] leading-relaxed text-ink/80">{intro}</p>
      )}

      {examNote && (
        <div className="card max-w-reading border-brass/40 p-4">
          <p className="text-[15px] leading-relaxed">{examNote.text}</p>
          <p className="mt-1 text-sm text-ink/65">
            Källa: {examNote.source}
            {examNote.sqlHint ? ` · ${examNote.sqlHint}` : ""}
          </p>
        </div>
      )}

      <div className="card p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="tabular font-display text-lg">
            {readCount} av {chapters.length} kapitel lästa
          </span>
          <span className="tabular text-sm text-ink/65">
            {totalMinutes} min totalt · ca {minutesLeft} min kvar
          </span>
        </div>
        <div
          className="mt-3 h-2 w-full overflow-hidden rounded-full bg-line"
          role="img"
          aria-label={`Läsprogress: ${percent} procent.`}
        >
          <div
            className="h-full rounded-full bg-brass transition-[width] duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        {next && (
          <button
            type="button"
            className="btn-primary mt-4"
            onClick={() => onOpen(next.id)}
          >
            {readCount === 0 ? "Börja läsa" : "Fortsätt läsa"}
          </button>
        )}
      </div>

      {hasExamAreas && hasBackground && (
        <button
          type="button"
          onClick={() => setOnlyExam(!onlyExam)}
          aria-pressed={onlyExam}
          className={`chip ${onlyExam ? "chip-on" : ""}`}
        >
          Visa bara tentarelevanta kapitel
        </button>
      )}

      <ol className="grid gap-2 lg:grid-cols-2">
        {shown.map((chapter, index) => {
          const status = readChapters[chapter.id]
            ? "read"
            : chapter.id === currentId
              ? "reading"
              : "unread";
          return (
            <li key={chapter.id}>
              <button
                type="button"
                onClick={() => onOpen(chapter.id)}
                className="card-action flex gap-4 p-4"
              >
                <span className="tabular mt-0.5 font-display text-xl text-brass">
                  {chapter.number ?? index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-pine">{chapter.title}</span>
                  {chapter.lead && (
                    <span className="mt-0.5 block text-sm text-ink/70">{chapter.lead}</span>
                  )}
                  <span className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="tabular text-sm text-ink/65">
                      {chapter.readingMinutes} min
                    </span>
                    <ExamAreaTag area={"examArea" in chapter ? chapter.examArea : undefined} />
                  </span>
                </span>
                <span
                  className={`chip h-fit shrink-0 text-xs ${STATUS[status].className}`}
                >
                  {STATUS[status].label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
