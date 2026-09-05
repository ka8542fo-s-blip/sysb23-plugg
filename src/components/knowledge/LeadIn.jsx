// Kärnpunkter skrivs som "Begrepp: förklaring". Inledningen före kolonet
// fetas så att listan går att skumma — men bara när den är kort och inte
// en hel mening (då är kolonet bara skiljetecken i löptext).
const LEAD = /^([^:]{2,48}):\s([\s\S]+)$/;

export default function LeadIn({ text }) {
  const match = LEAD.exec(text);
  if (!match || match[1].includes(". ")) return text;
  return (
    <>
      <strong className="font-semibold text-pine">{match[1]}:</strong> {match[2]}
    </>
  );
}
