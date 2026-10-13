import { useVersionCheck } from "../lib/useVersionCheck.js";
import { SHOWN_NEWS } from "../lib/versionCheck.js";

// Diskret rad överst i headern när en ny version med nyheter har
// publicerats. Laddar aldrig om av sig själv — ett pågående prov eller ett
// halvskrivet svar ska inte försvinna.
export default function UpdateBanner() {
  const { news, dismiss } = useVersionCheck();
  if (news.length === 0) return null;
  const shown = news.slice(0, SHOWN_NEWS);
  const rest = news.length - shown.length;
  return (
    <div role="status" className="border-b border-line bg-pine/[0.06]">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-1.5 text-sm sm:px-6 lg:px-8">
        <p className="flex-1 text-ink/85">
          <span className="font-medium text-pine">Nytt på sidan:</span> {shown.map((entry) => entry.text).join(" · ")}
          {rest > 0 && <span className="text-ink/65"> · +{rest} till</span>}
          <span className="text-ink/65"> — ladda om för att se det.</span>
        </p>
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
