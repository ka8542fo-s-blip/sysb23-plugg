import { loadDraft } from "../../lib/storage.js";
import { allItems, countSolved, resumeItem, tileState } from "../../lib/sqlTracks.js";
import TaskTile, { TileLegend } from "./TaskTile.jsx";

// Översikten över ett spår: var man är, vad som är kvar och en väg in i varje
// uppgift. Uppgiften öppnas i TaskView, så att listan aldrig står bredvid den.
function SectionBlock({ section, progress, onOpen }) {
  const solved = countSolved(section.items, progress);
  const total = section.items.length;
  const done = solved === total;
  const first = section.items.find((item) => !progress[item.id]) ?? section.items[0];
  return (
    <li className={`rounded-xl border p-4 ${section.highlight ? "border-brass/60 bg-brass/[0.05]" : "border-line"}`}>
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-brass-text">{section.kicker}</p>
          <h3 className="mt-0.5 font-sans text-[16px] font-medium leading-snug">
            <button
              type="button"
              className="text-left text-ink underline-offset-4 hover:text-pine hover:underline"
              onClick={() => onOpen(first.id)}
            >
              {section.title}
            </button>
          </h3>
          {section.summary && <p className="mt-1 text-sm text-ink/65">{section.summary}</p>}
        </div>
        <div className="shrink-0 text-right">
          {done ? (
            <span className="text-sm font-medium text-correct">✓ Klar</span>
          ) : (
            <span className="tabular text-sm font-medium">{solved}/{total}</span>
          )}
        </div>
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-line" aria-hidden="true">
        <div className="h-full rounded-full bg-pine" style={{ width: `${(solved / total) * 100}%` }} />
      </div>
      <ol className="mt-3 flex flex-wrap gap-1.5" aria-label={section.title}>
        {section.items.map((item) => (
          <li key={item.id}>
            <TaskTile
              label={item.label}
              state={tileState(progress[item.id], loadDraft(item.id), item.starter)}
              name={item.task ?? item.ask}
              onClick={() => onOpen(item.id)}
            />
          </li>
        ))}
      </ol>
    </li>
  );
}

export default function TrackOverview({ kicker, title, intro, sections, progress, lastId, onOpen }) {
  const items = allItems(sections);
  const solved = countSolved(items, progress);
  const resume = resumeItem(sections, progress, lastId);
  const resumeSection = resume && sections.find((section) => section.items.includes(resume));
  const started = solved > 0 || Boolean(lastId);
  const parts = [...new Set(sections.map((section) => section.part))];

  return (
    <div className="space-y-6">
      <section className="card p-5 sm:p-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-brass-text">{kicker}</p>
        <h2 className="tabular mt-1 font-display text-3xl">{title(solved, items.length)}</h2>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-line" aria-hidden="true">
          <div className="h-full rounded-full bg-pine" style={{ width: `${items.length ? (solved / items.length) * 100 : 0}%` }} />
        </div>
        <p className="mt-3 max-w-reading text-[15px] text-ink/75">{intro}</p>
        {resume && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button type="button" className="btn-primary w-full sm:w-auto" onClick={() => onOpen(resume.id)}>
              {started ? "Fortsätt" : "Börja"}
            </button>
            <span className="text-sm text-ink/65">
              {resumeSection.title}, {resume.heading.toLowerCase()}
            </span>
          </div>
        )}
      </section>

      {parts.map((part) => (
        <section key={part ?? "alla"}>
          {part && <h3 className="mb-2 font-display text-lg">{part}</h3>}
          <ul className="grid gap-3 lg:grid-cols-2">
            {sections
              .filter((section) => section.part === part)
              .map((section) => (
                <SectionBlock key={section.id} section={section} progress={progress} onOpen={onOpen} />
              ))}
          </ul>
        </section>
      ))}

      <TileLegend />
    </div>
  );
}
