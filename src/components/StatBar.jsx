// Vågrät stapel för träffsäkerhet per ämne.
export default function StatBar({ label, percent, answered, total }) {
  const hasData = percent !== null && percent !== undefined;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[15px]">{label}</span>
        <span className="tabular shrink-0 text-sm text-ink/65">
          {hasData ? `${percent} %` : "—"}
          <span className="ml-2 text-ink/65">
            {answered}/{total} svar
          </span>
        </span>
      </div>
      <div
        className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-line"
        role="img"
        aria-label={
          hasData
            ? `${label}: ${percent} procent rätt på ${answered} svar.`
            : `${label}: inga svar ännu.`
        }
      >
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{
            width: `${hasData ? percent : 0}%`,
            backgroundColor:
              percent >= 75 ? "var(--correct)" : percent >= 50 ? "var(--brass)" : "var(--wrong)",
          }}
        />
      </div>
    </div>
  );
}
