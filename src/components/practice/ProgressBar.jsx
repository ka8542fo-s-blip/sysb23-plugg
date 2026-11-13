// Statusraden ovanför frågan i Öva: hur många i urvalet som är klara, hur
// många som är kvar och, i Genomgång, hur många av dem som ska göras om
// efter fel. Samma rad i Alla frågor och Tentafrågor.
export default function ProgressBar({ label, done, total, redo, pass }) {
  const left = total - done;
  return (
    <div className="card mx-auto w-full max-w-reading px-5 py-3" role="status">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
        <span className="font-medium">{label}</span>
        <span className="tabular text-ink/70">
          {done} av {total} {pass ? "avbetade" : "klara"} · {left} kvar
          {redo > 0 ? ` · ${redo} att göra om` : ""}
        </span>
      </div>
      <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-line" aria-hidden="true">
        <div className="h-full bg-pine" style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
        {redo > 0 && <div className="h-full bg-wrong/60" style={{ width: `${(redo / total) * 100}%` }} />}
      </div>
    </div>
  );
}
