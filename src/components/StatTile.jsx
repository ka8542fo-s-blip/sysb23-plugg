import InfoTip from "./InfoTip.jsx";

// Etikett, värde och ett litet frågetecken som förklarar termen.
// Används av både Hem och Statistik så att vokabulären ser likadan ut.
export default function StatTile({ label, value, tip, note }) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-sm text-ink/65">
        {label}
        {tip && <InfoTip id={tip} />}
      </dt>
      <dd className="tabular font-display text-2xl text-ink">{value}</dd>
      {note && <dd className="tabular text-sm text-ink/65">{note}</dd>}
    </div>
  );
}
