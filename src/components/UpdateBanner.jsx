import { useVersionCheck } from "../lib/useVersionCheck.js";

// Diskret rad överst i headern när en ny version har publicerats. Laddar
// aldrig om av sig själv — ett pågående prov eller ett halvskrivet svar
// ska inte försvinna.
export default function UpdateBanner() {
  const { show, dismiss } = useVersionCheck();
  if (!show) return null;
  return (
    <div role="status" className="border-b border-line bg-pine/[0.06]">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-1.5 text-sm sm:px-6 lg:px-8">
        <p className="flex-1 text-ink/85">Sidan har uppdaterats — ladda om för senaste versionen</p>
        <button type="button" onClick={() => window.location.reload()} className="btn-secondary px-3 py-1 text-sm">
          Ladda om
        </button>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dölj notisen"
          className="rounded-md px-2 py-1 text-lg leading-none text-ink/60 hover:bg-pine/[0.08] hover:text-ink"
        >
          ×
        </button>
      </div>
    </div>
  );
}
