// Färgprick + namn. Färgen är aldrig ensam informationsbärare.
export default function CourseDot({ subcourse, label, className = "" }) {
  if (!subcourse) return null;
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        aria-hidden="true"
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: `var(${subcourse.color})` }}
      />
      <span>{label ?? subcourse.short}</span>
    </span>
  );
}
