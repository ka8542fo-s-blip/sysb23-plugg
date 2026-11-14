import { useMemo } from "react";
import { moduleProgress } from "../lib/levels.js";

// Hur långt man har kommit per modul (Verksamhetsarkitektur, Hem och
// Statistik): Öva-frågor och förklarakort, klara av totalt, i ordningen
// 12, 1–11. Varje rad länkar till modulen i Öva. Läser samma svar som Öva
// och sparar inget eget.
export default function ModuleProgressTable({ course, answers, navigate }) {
  const rows = useMemo(() => moduleProgress(course, answers), [course, answers]);
  const cell = (part) => (part.total ? `${part.done}/${part.total}` : "–");
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[28rem] border-collapse text-[15px]">
        <thead>
          <tr className="text-left text-sm text-ink/70">
            <th scope="col" className="border-b border-line py-2 pr-3 font-medium">Modul</th>
            <th scope="col" className="border-b border-line py-2 pr-3 font-medium">Öva-frågor klara</th>
            <th scope="col" className="border-b border-line py-2 pr-3 font-medium">Förklarakort klara</th>
            <th scope="col" className="border-b border-line py-2 font-medium">
              <span className="sr-only">Öva</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const complete = row.ova.done === row.ova.total && row.cards.done === row.cards.total;
            return (
              <tr key={row.chapterId}>
                <td className="border-b border-line py-2 pr-3">
                  <span className="tabular font-medium">{row.number}</span>{" "}
                  {row.chapterId === "kap12" ? "Start här" : row.title}
                  {complete && <span className="ml-2 text-correct">✓</span>}
                </td>
                <td className="tabular border-b border-line py-2 pr-3">{cell(row.ova)}</td>
                <td className="tabular border-b border-line py-2 pr-3">{cell(row.cards)}</td>
                <td className="border-b border-line py-2 text-right">
                  {navigate && (
                    <button
                      type="button"
                      className="text-sm text-pine underline-offset-4 hover:underline"
                      onClick={() => navigate("ova", { topics: [row.chapterId], nonce: Date.now() })}
                    >
                      Öva
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
