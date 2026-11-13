import { useState } from "react";
import { ARTICLE_NOTE } from "../data/arkitektur/examArchive.js";
import { taskById } from "../data/arkitektur/zachman.js";
import { KEYS, load, save } from "../lib/storage.js";

// Fliken Tenta som översikt (Verksamhetsarkitektur, course.examArchive):
// HT25-tentorna i tentans ordning. Zachman-delarna länkar till Essä och
// Zachman-vyn; artikelfrågorna står ordagrant utan facit och utan
// svarsknappar. Här skrivs inget, så bara vald tenta sparas.

export default function ExamArchive({ course, navigate, modelProgress }) {
  const exams = course.examArchive;
  const [openId, setOpenId] = useState(() => {
    const saved = load(KEYS.examArchiveOpen, {})[course.id];
    return exams.some((exam) => exam.id === saved) ? saved : exams[0].id;
  });
  const exam = exams.find((item) => item.id === openId) || exams[0];
  const select = (id) => {
    setOpenId(id);
    save(KEYS.examArchiveOpen, { ...load(KEYS.examArchiveOpen, {}), [course.id]: id });
  };
  const has = (view) => (course.views || []).includes(view);
  const zachmanParts = exam.parts.filter((part) => part.kind !== "statement");
  const statements = exam.parts.filter((part) => part.kind === "statement");
  const sum = (parts) => parts.reduce((total, part) => total + part.points, 0);

  return (
    <div className="space-y-6">
      <section>
        <h2 className="font-display text-xl">Gamla tentor (HT25)</h2>
        <p className="mt-2 max-w-reading rounded-lg border border-brass p-3 text-[15px] text-ink/85">
          <span className="font-medium text-brass-text">Äldre kursversion, annat format. </span>
          Årets tenta ser ut som modulerna (sant/falskt, flerval och någon essäfråga). HT25-tentorna
          hade en Zachman-essä, placering i Zachmans rutnät och sant/falskt om artiklar som inte
          ingår i år, och är ingen prognos för årets tenta.
        </p>
        <p className="mt-3 max-w-reading text-[15px] text-ink/80">
          De tre HT25-tentorna, 100 p var. Zachman gav 50 p på varje: en essä om ramverket och
          placering av modeller i rutnätet. Resten var sant/falskt om artiklar, där fel svar gav 0 p.
          Artiklarna ingår inte i årets material, så de frågorna står här utan facit och räknas inte.
        </p>
      </section>

      <div className="card overflow-x-auto p-4 sm:p-5">
        <table className="w-full min-w-[30rem] border-collapse text-[15px]">
          <thead>
            <tr className="text-left text-ink/70">
              <th className="border-b border-line py-2 pr-3 font-medium">Tenta</th>
              <th className="border-b border-line py-2 pr-3 font-medium">Zachman-essä</th>
              <th className="border-b border-line py-2 pr-3 font-medium">Zachman-placering</th>
              <th className="border-b border-line py-2 font-medium">Artiklar (sant/falskt)</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((item) => {
              const essay = item.parts.filter((part) => part.kind === "essay");
              const place = item.parts.filter((part) => part.kind === "zachman");
              const art = item.parts.filter((part) => part.kind === "statement");
              return (
                <tr key={item.id} className="align-top">
                  <td className="border-b border-line py-2 pr-3">
                    <button
                      type="button"
                      onClick={() => select(item.id)}
                      aria-current={item.id === exam.id ? "true" : undefined}
                      className={`chip ${item.id === exam.id ? "chip-on" : ""}`}
                    >
                      {item.title}
                    </button>
                    <span className="mt-1 block text-sm text-ink/65">{item.dateLabel}</span>
                  </td>
                  <td className="tabular border-b border-line py-2 pr-3">{sum(essay)} p</td>
                  <td className="tabular border-b border-line py-2 pr-3">
                    {sum(place)} p
                    <span className="block text-sm text-ink/65">
                      {place.length === 1 ? "10 objekt" : `${place.length} flerval`}
                    </span>
                  </td>
                  <td className="tabular border-b border-line py-2">
                    {sum(art)} p
                    <span className="block text-sm text-ink/65">{art.length} påståenden</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <section className="space-y-4">
        <h2 className="font-display text-xl">
          {exam.title} · {exam.dateLabel}
        </h2>
        <p className="text-[15px] text-ink/70">
          Zachman {sum(zachmanParts)} p · artiklar {sum(statements)} p
        </p>

        {zachmanParts.map((part) => (
          <article key={part.no} className="card p-5">
            <p className="text-sm text-ink/65">
              Uppgift {part.no} · {part.points} p{part.pass ? ` · ${part.pass}` : ""}
            </p>
            <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed">{part.text}</p>
            {part.kind === "zachman" && part.taskIds.length > 1 && (
              <ul className="mt-3 grid gap-1 text-[14px] sm:grid-cols-2">
                {part.taskIds.map((id, i) => (
                  <li key={id} className="flex gap-2">
                    <span className="tabular w-5 text-ink/65">{i + 1}.</span>
                    <span>
                      {taskById(id).text}
                      {modelProgress[id] && <span className="ml-1 text-correct">✓</span>}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {part.kind === "essay" && has("essa") && (
                <button type="button" className="btn-secondary" onClick={() => navigate("essa", { essayId: part.essayId })}>
                  Skriv essän i Essä →
                </button>
              )}
              {part.kind === "zachman" && has("zachman") && (
                <button type="button" className="btn-secondary" onClick={() => navigate("zachman", { taskId: part.taskIds[0] })}>
                  {part.taskIds.length > 1 ? "Placera i Zachman →" : "Svara i Zachman →"}
                </button>
              )}
              {part.kind === "zachman" && part.taskIds.length === 1 && modelProgress[part.taskIds[0]] && (
                <span className="text-sm text-correct">✓ Klar</span>
              )}
            </div>
          </article>
        ))}

        <article className="card p-5">
          <h3 className="font-display text-lg">Artikelfrågor, sant/falskt</h3>
          <p className="mt-1 text-[15px] font-medium text-brass-text">{ARTICLE_NOTE}</p>
          <ol className="mt-4 space-y-3">
            {statements.map((part) => (
              <li key={part.no} className="rounded-lg border border-line p-3">
                <p className="text-sm text-ink/65">
                  Uppgift {part.no} · {part.points} p{part.label ? ` · ${part.label}` : ""}
                </p>
                {part.intro && <p className="mt-1 text-[14px] italic text-ink/70">{part.intro}</p>}
                <p className="mt-1 text-[15px] leading-relaxed">{part.text}</p>
                {(part.extra || []).map((line) => (
                  <p key={line} className="mt-1 text-[15px] leading-relaxed">{line}</p>
                ))}
              </li>
            ))}
          </ol>
        </article>
      </section>
    </div>
  );
}
