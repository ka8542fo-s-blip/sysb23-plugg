import { useEffect, useRef } from "react";
import { ActivityShape, EventShape, GatewayShape, TASK_H, TASK_W } from "./BpmnDiagram.jsx";

// Symbolförklaringen i BPMN-övningarna: varje BPMN-element ritat med samma
// former som diagrammen, och vad det betyder. Texterna följer kapitel 10
// och 11 i kompendiet (ingenting nytt i sak), och "Så kör du ett diagram"
// är kapitel 11:s regler för token.
const INK = "var(--ink)";

// Små ritytor runt formerna. Formerna ritas i diagrammets skala.
function Sym({ w, h, children, label }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" style={{ maxWidth: w }} role="img" aria-label={label}>
      {children}
    </svg>
  );
}

const event = (kind, ev, extra = {}) => ({ name }) => (
  <Sym w={50} h={50} label={name}>
    <EventShape cx={25} cy={25} kind={kind} event={ev} {...extra} />
  </Sym>
);
const task = (props = {}) => ({ name }) => (
  <Sym w={TASK_W + 10} h={TASK_H + 10} label={name}>
    <ActivityShape cx={(TASK_W + 10) / 2} cy={(TASK_H + 10) / 2} showLabel={false} {...props} />
  </Sym>
);
const gateway = (gw) => ({ name }) => (
  <Sym w={60} h={60} label={name}>
    <GatewayShape cx={30} cy={30} gw={gw} />
  </Sym>
);
const boundary = (ev, interrupting) => ({ name }) => (
  <Sym w={TASK_W + 10} h={TASK_H + 34} label={name}>
    <ActivityShape cx={(TASK_W + 10) / 2} cy={TASK_H / 2 + 5} showLabel={false} />
    <EventShape cx={(TASK_W + 10) / 2 + 22} cy={TASK_H + 5} kind="boundary" event={ev} interrupting={interrupting} />
  </Sym>
);

function Arrowhead({ x, y, open = false }) {
  return <polygon points={`${x},${y} ${x - 9},${y - 4.5} ${x - 9},${y + 4.5}`} fill={open ? "var(--surface)" : INK} stroke={INK} strokeWidth={1.1} />;
}

const SequenceFlow = ({ name }) => (
  <Sym w={110} h={30} label={name}>
    <line x1={8} y1={15} x2={96} y2={15} stroke={INK} strokeWidth={1.5} />
    <Arrowhead x={104} y={15} />
  </Sym>
);
const DefaultFlow = ({ name }) => (
  <Sym w={110} h={30} label={name}>
    <line x1={8} y1={15} x2={96} y2={15} stroke={INK} strokeWidth={1.5} />
    <line x1={16} y1={22} x2={26} y2={8} stroke={INK} strokeWidth={1.5} />
    <Arrowhead x={104} y={15} />
  </Sym>
);
const MessageFlow = ({ name }) => (
  <Sym w={110} h={30} label={name}>
    <circle cx={11} cy={15} r={4} fill="var(--surface)" stroke={INK} strokeWidth={1.2} />
    <line x1={15} y1={15} x2={96} y2={15} stroke={INK} strokeWidth={1.4} strokeDasharray="6 4" />
    <Arrowhead x={104} y={15} open />
  </Sym>
);
const Pool = ({ name }) => (
  <Sym w={120} h={64} label={name}>
    <rect x={2} y={2} width={116} height={60} fill="none" stroke={INK} strokeWidth={1.4} />
    <line x1={20} y1={2} x2={20} y2={62} stroke={INK} strokeWidth={1.4} />
  </Sym>
);
const Lanes = ({ name }) => (
  <Sym w={120} h={64} label={name}>
    <rect x={2} y={2} width={116} height={60} fill="none" stroke={INK} strokeWidth={1.4} />
    <line x1={18} y1={2} x2={18} y2={62} stroke={INK} strokeWidth={1.4} />
    <line x1={34} y1={2} x2={34} y2={62} stroke={INK} strokeWidth={1} />
    <line x1={18} y1={32} x2={118} y2={32} stroke={INK} strokeWidth={1} />
  </Sym>
);
const BlackBox = ({ name }) => (
  <Sym w={120} h={34} label={name}>
    <rect x={2} y={2} width={116} height={30} fill="rgb(var(--ink-rgb) / 0.04)" stroke={INK} strokeWidth={1.4} />
    <line x1={20} y1={2} x2={20} y2={32} stroke={INK} strokeWidth={1.4} />
  </Sym>
);
const DataStore = ({ name }) => (
  <Sym w={50} h={50} label={name}>
    <path d="M8,12 v26 a17,6 0 0 0 34,0 v-26" fill="var(--surface)" stroke={INK} strokeWidth={1.4} />
    <ellipse cx={25} cy={12} rx={17} ry={6} fill="var(--surface)" stroke={INK} strokeWidth={1.4} />
  </Sym>
);

export const LEGEND = [
  {
    id: "handelser",
    title: "Händelser",
    lead: "Cirklar. Kanten visar var händelsen står: tunn vid start, dubbel mitt i, tjock vid slut. Ikonen visar signalen, och fylld ikon betyder att signalen skickas.",
    items: [
      { name: "Start event (none)", Draw: event("start", "none"), text: "Tom cirkel: en otriggad start. Så startar ett barndiagram, när föräldern når subprocessen." },
      { name: "Message start event", Draw: event("start", "message"), text: "Extern begäran: processen startar när ett meddelande kommer." },
      { name: "Timer start event", Draw: event("start", "timer"), text: "Återkommande: processen startar vid en tidpunkt, till exempel den fjärde varje månad." },
      { name: "Intermediate event, catching", Draw: event("intermediate", "message"), text: "Ofylld ikon: processen väntar tills signalen kommer och fortsätter sedan." },
      { name: "Intermediate event, throwing", Draw: event("intermediate", "message", { throwing: true }), text: "Fylld ikon: processen skickar signalen direkt och går vidare." },
      { name: "Intermediate timer", Draw: event("intermediate", "timer"), text: "Vänta en viss tid eller tills en tidpunkt. Tiden räknas från när flödet når timern, inte från processens start." },
      { name: "End event", Draw: event("end", "none"), text: "Den här vägen slutar. Processen är klar när ingen token finns kvar." },
      { name: "Message end event", Draw: event("end", "message"), text: "Vägen slutar, och ett meddelande skickas." },
      { name: "Error end event", Draw: event("end", "error"), text: "Blixt: subprocessen kastar ett fel, som fångas av ett error boundary event i föräldern." },
      { name: "Terminate end event", Draw: event("end", "terminate"), text: "Fylld inre skiva: avslutar hela processnivån direkt, även parallella vägar som fortfarande pågår." },
    ],
  },
  {
    id: "boundary",
    title: "Boundary events",
    lead: "En händelse på aktivitetens kant. Den har inga inkommande sekvensflöden och lyssnar så länge aktiviteten pågår.",
    items: [
      { name: "Interrupting", Draw: boundary("message", true), text: "Heldragen dubbelcirkel: när signalen kommer avbryts aktiviteten, och processen följer undantagsflödet." },
      { name: "Non-interrupting", Draw: boundary("message", false), text: "Streckad dubbelcirkel: aktiviteten fortsätter. Undantagsflödet startar parallellt, och när aktiviteten är klar följs också det vanliga flödet." },
      { name: "Error boundary event", Draw: boundary("error", true), text: "Fångar felet från ett error end event i subprocessen. Alltid interrupting: subprocessens vanliga väg ut används inte." },
    ],
  },
  {
    id: "aktiviteter",
    title: "Aktiviteter",
    lead: "Rektanglar med rundade hörn: en arbetsenhet som tar tid, namngiven med verb och objekt. Ikonen i hörnet visar hur arbetet utförs.",
    items: [
      { name: "User task", Draw: task({ taskType: "user" }), text: "En person utför den, även när personen klickar på en knapp och systemet gör resten." },
      { name: "Service task", Draw: task({ taskType: "service" }), text: "Kugghjul: automatiserad, utan mänsklig interaktion." },
      { name: "Send task", Draw: task({ taskType: "send" }), text: "Fyllt kuvert: skickar ett meddelande." },
      { name: "Receive task", Draw: task({ taskType: "receive" }), text: "Ofyllt kuvert: väntar på ett meddelande." },
      { name: "Manual task", Draw: task({ taskType: "manual" }), text: "Hand: utförs för hand." },
      { name: "Script task", Draw: task({ taskType: "script" }), text: "Kör ett skript." },
      { name: "Business rule task", Draw: task({ taskType: "businessRule" }), text: "Liten tabell: anropar en beslutsregel, till exempel en DMN-beslutstabell." },
      { name: "Subprocess", Draw: task({ variant: "subprocess" }), text: "Plustecken: består själv av aktiviteter i ett barndiagram, som startar med en otriggad start." },
      { name: "Call activity", Draw: task({ variant: "callActivity" }), text: "Tjock ram: anropar en fristående process som kan återanvändas av flera processer." },
      { name: "Event subprocess, interrupting", Draw: task({ variant: "eventSubprocess", startEvent: { event: "message", interrupting: true } }), text: "Streckad ram, heldragen startcirkel: kan starta när som helst medan processen körs, utan inkommande flöde. Föräldern avbryts." },
      { name: "Event subprocess, non-interrupting", Draw: task({ variant: "eventSubprocess", startEvent: { event: "message", interrupting: false } }), text: "Streckad ram, streckad startcirkel: föräldern fortsätter, och event subprocessen körs vid sidan av." },
      { name: "Loop marker", Draw: task({ marker: "loop" }), text: "Aktiviteten upprepas tills ett villkor är uppfyllt (enligt BPMN-standarden)." },
    ],
  },
  {
    id: "gateways",
    title: "Gateways",
    lead: "Romber som delar upp eller slår ihop sekvensflöden.",
    items: [
      { name: "Exclusive gateway (XOR)", Draw: gateway(undefined), text: "Tom romb: exakt en väg följs. Gatewayen fattar inget beslut; den testar ett datavillkor som är sant eller falskt för varje gate." },
      { name: "Parallel gateway (AND)", Draw: gateway("and"), text: "Plustecken: en AND-split startar alla utgående vägar samtidigt, och en AND-join väntar tills alla inkommande vägar har kommit fram." },
      { name: "Inclusive gateway (OR)", Draw: gateway("or"), text: "Ring: en eller flera vägar aktiveras beroende på villkoren, men inte nödvändigtvis alla. En OR-join väntar bara på de vägar som faktiskt är på väg." },
      { name: "Event-based gateway", Draw: gateway("event"), text: "Femhörning i dubbelcirkel: följs av catching events, och bara vägen vars händelse inträffar först aktiveras." },
    ],
  },
  {
    id: "floden",
    title: "Flöden och banor",
    lead: "Pilarna visar ordningen och kommunikationen; poolerna och lanes visar vems processen är och vem som gör arbetet.",
    items: [
      { name: "Sequence flow", Draw: SequenceFlow, text: "Heldragen pil: ordningen mellan aktiviteter, händelser och gateways inom en process." },
      { name: "Default flow", Draw: DefaultFlow, text: "Snedstreck i början: tas bara när inget annat villkor är sant." },
      { name: "Message flow", Draw: MessageFlow, text: "Streckad pil med ring i början: envägskommunikation mellan pooler, aldrig inom samma pool. Namnges med ett substantiv." },
      { name: "Pool", Draw: Pool, text: "En behållare för en process, med processens namn i kanten." },
      { name: "Lane", Draw: Lanes, text: "Visar vem som utför aktiviteten: en roll eller en organisatorisk enhet." },
      { name: "Black-box pool", Draw: BlackBox, text: "En tom pool: en extern deltagare, som en kund eller sökande." },
      { name: "Data store", Draw: DataStore, text: "Information i en applikation, databas eller fil, som processen och externa parter kan läsa och skriva." },
    ],
  },
];

// Kapitel 11:s regler för att köra ett diagram.
export const RUN_RULES = [
  ["Starta", "där förutsättningarna säger. Skriv upp starttiden om det finns en."],
  ["Aktivitet", "token stannar så länge aktiviteten tar. Notera den som körd."],
  ["XOR", "token följer den gate vars villkor är sant."],
  ["AND-split", "token delas i en per väg. AND-join: vänta in alla."],
  ["Event-based gateway", "jämför när händelserna inträffar. Den första vinner."],
  ["Throw", "direkt. Catch: vänta tills signalen kommer. Timer: lägg till tiden."],
  ["Boundary och event subprocess", "kontrollera varje gång en signal kommer om den träffar något som pågår just då, och om det är interrupting eller non-interrupting."],
  ["End", "processen är klar när ingen token finns kvar."],
  ["Flera inkommande flöden utan gateway", "aktiviteten startar en gång för varje token som kommer fram."],
];

export default function BpmnLegend({ onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      // Håll fokus i rutan medan den är öppen.
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll("button, [href], [tabindex]:not([tabindex='-1'])")];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        last.focus();
        event.preventDefault();
      } else if (!event.shiftKey && document.activeElement === last) {
        first.focus();
        event.preventDefault();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  function jump(id) {
    const target = scrollRef.current?.querySelector(`#bpmn-symboler-${id}`);
    if (target) scrollRef.current.scrollTo({ top: target.offsetTop - 8, behavior: "smooth" });
  }

  return (
    <>
      <div aria-hidden="true" className="dagdialog-bakgrund fixed inset-0 z-50 bg-shade/30" onClick={onClose} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bpmn-symboler-rubrik"
        className="dagdialog fixed left-1/2 top-1/2 z-50 flex max-h-[88vh] w-[min(60rem,calc(100vw-1rem))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-card border border-line bg-surface shadow-xl"
      >
        <div className="border-b border-line px-4 pb-3 pt-4 sm:px-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="bpmn-symboler-rubrik" className="font-display text-2xl">BPMN-symboler</h2>
              <p className="mt-0.5 text-sm text-ink/65">Vad formerna betyder, enligt kapitel 10&nbsp;och&nbsp;11.</p>
            </div>
            <button ref={closeRef} type="button" className="btn-quiet -mr-2 -mt-1 px-2 text-lg leading-none no-underline" onClick={onClose} aria-label="Stäng">
              ✕
            </button>
          </div>
          <nav aria-label="Avsnitt" className="no-scrollbar -mx-1 mt-3 flex gap-1.5 overflow-x-auto px-1">
            {LEGEND.map((section) => (
              <button key={section.id} type="button" className="chip chip-sm shrink-0" onClick={() => jump(section.id)}>
                {section.title}
              </button>
            ))}
            <button type="button" className="chip chip-sm shrink-0" onClick={() => jump("kor")}>
              Så kör du ett diagram
            </button>
          </nav>
        </div>

        <div ref={scrollRef} className="relative overflow-y-auto px-4 pb-6 sm:px-6">
          {LEGEND.map((section) => (
            <section key={section.id} id={`bpmn-symboler-${section.id}`} className="pt-5">
              <h3 className="font-display text-xl">{section.title}</h3>
              <p className="mt-1 max-w-reading text-[15px] leading-relaxed text-ink/75">{section.lead}</p>
              <ul className="mt-3 grid gap-2 md:grid-cols-2">
                {section.items.map(({ name, Draw, text }) => (
                  <li key={name} className="flex items-center gap-3 rounded-lg border border-line p-3 sm:gap-4">
                    <div className="flex w-20 shrink-0 justify-center sm:w-28">
                      <Draw name={name} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[15px] font-medium">{name}</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-ink/75">{text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          <section id="bpmn-symboler-kor" className="pt-6">
            <h3 className="font-display text-xl">Så kör du ett diagram</h3>
            <p className="mt-1 max-w-reading text-[15px] leading-relaxed text-ink/75">
              Tänk dig en token, en markör som vandrar längs sekvensflödena. Läs förutsättningarna noga: de säger vilka meddelanden som kommer och när, vilka villkor som gäller och hur lång tid saker tar.
            </p>
            <ol className="mt-3 space-y-1.5">
              {RUN_RULES.map(([term, rule], i) => (
                <li key={term} className="flex gap-3 text-[15px] leading-relaxed">
                  <span className="tabular w-5 shrink-0 text-ink/55">{i + 1}.</span>
                  <span><span className="font-medium">{term}:</span> {rule}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </>
  );
}
