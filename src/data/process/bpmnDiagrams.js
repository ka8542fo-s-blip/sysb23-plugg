// BPMN-diagrammen för Kör processen, som data. Samma data ritas som SVG
// (components/bpmn/) och körs av simulatorn (lib/bpmnSim.js).
//
// Nod: { id, type, label, cx, cy, in? }
//   type: start | end | intermediate | boundary | task | subprocess |
//         eventSubprocess | gateway
//   start/end/intermediate/boundary: event (none|message|timer|error|terminate),
//     message, duration (minuter, timer), throw (intermediate),
//     interrupting (start i event subprocess, boundary), attachedTo (boundary),
//     timerLabel (visad text, t.ex. "4th Day of the Month")
//   task: taskType (user|service|send|receive|manual|script|businessRule)
//   gateway: gw (xor|and|or|event)
//   in: id för subprocessen/event subprocessen noden ligger i (barndiagram)
// Flöde: { from, to, kind: "seq"|"msg", cond?, label?, route?: "hv"|"vh" }
//   msg-flöden kan gå till/från en pool (id).
// views: vilka diagram som ritas — huvuddiagrammet (container null) och
//   barndiagram (container = subprocessens id), med egen storlek.
// pools: black-box-pooler per vy.
//
// Tentadiagrammen är omritade efter HT25-tentorna (inte kopierade). Formerna
// som prövas — streckad/heldragen ram och cirkel, ikonerna — är exakta.

const task = (id, label, taskType, cx, cy, extra = {}) => ({ id, type: "task", label, taskType, cx, cy, ...extra });
const seq = (from, to, extra = {}) => ({ from, to, kind: "seq", ...extra });
const msg = (from, to, label, extra = {}) => ({ from, to, kind: "msg", label, ...extra });

export const diagrams = [
  // ── HT25 ordinarie 3(b): event-based gateway ──────────────────────────
  {
    id: "ht25-3b",
    title: "Event-based gateway",
    source: "Omritat efter tenta HT25 ord 3(b)",
    views: [{ container: null, width: 760, height: 330 }],
    pools: [{ id: "client", label: "Client", x: 10, y: 10, w: 740, h: 56, view: null }],
    nodes: [
      { id: "s", type: "start", event: "message", message: "Message A", label: "Message A Received", cx: 60, cy: 200 },
      task("a", "Activity A", "service", 170, 200),
      { id: "g", type: "gateway", gw: "event", cx: 280, cy: 200 },
      { id: "mB", type: "intermediate", event: "message", message: "Message B", cx: 350, cy: 130 },
      task("b", "Activity B", "user", 460, 130),
      { id: "t4", type: "intermediate", event: "timer", duration: 4 * 1440, label: "4 Days", cx: 350, cy: 270 },
      task("c", "Activity C", "user", 460, 270),
      task("d", "Activity D", "service", 590, 200),
      { id: "e", type: "end", event: "message", message: "Message C", label: "Work Completed", cx: 700, cy: 200 },
    ],
    flows: [
      seq("s", "a"), seq("a", "g"), seq("g", "mB", { route: "vh" }), seq("g", "t4", { route: "vh" }),
      seq("mB", "b"), seq("t4", "c"), seq("b", "d", { route: "hv" }), seq("c", "d", { route: "hv" }),
      seq("d", "e"),
      msg("client", "s", "Message A"), msg("client", "mB", "Message B"), msg("e", "client", "Message C"),
    ],
  },

  // ── HT25 ordinarie 3(c): non-interrupting event subprocess ────────────
  {
    id: "ht25-3c",
    title: "Event subprocess",
    source: "Omritat efter tenta HT25 ord 3(c). Tentans barnvy har heldragen startcirkel trots streckad markör; här är båda streckade.",
    views: [
      { container: null, width: 860, height: 390 },
      { container: "esA", title: "Event Subprocess A", width: 520, height: 230 },
    ],
    pools: [
      { id: "client", label: "Client", x: 10, y: 10, w: 840, h: 56, view: null },
      { id: "client2", label: "Client", x: 10, y: 10, w: 500, h: 56, view: "esA" },
    ],
    nodes: [
      { id: "esA", type: "eventSubprocess", label: "Event Subprocess A", cx: 170, cy: 130 },
      { id: "s", type: "start", event: "none", cx: 60, cy: 270 },
      task("a", "Activity A", "service", 170, 270),
      { id: "g1", type: "gateway", gw: "and", cx: 280, cy: 270 },
      { id: "thB", type: "intermediate", event: "message", throw: true, message: "Message B", cx: 350, cy: 200 },
      task("b", "Activity B", "user", 460, 200),
      { id: "t3", type: "intermediate", event: "timer", duration: 180, label: "3 Hours", cx: 350, cy: 340 },
      task("c", "Activity C", "user", 460, 340),
      { id: "g2", type: "gateway", gw: "and", cx: 580, cy: 270 },
      task("d", "Activity D", "service", 690, 270),
      { id: "e", type: "end", event: "message", message: "Message C", label: "Work Completed", cx: 800, cy: 270 },
      // Barndiagrammet
      { id: "esS", type: "start", event: "message", message: "Message A", interrupting: false, label: "Message A Received", in: "esA", cx: 60, cy: 160 },
      task("ee", "Activity E", "user", 170, 160, { in: "esA" }),
      task("ef", "Activity F", "user", 300, 160, { in: "esA" }),
      { id: "esE", type: "end", event: "none", label: "Work Completed", in: "esA", cx: 420, cy: 160 },
    ],
    flows: [
      seq("s", "a"), seq("a", "g1"), seq("g1", "thB", { route: "vh" }), seq("g1", "t3", { route: "vh" }),
      seq("thB", "b"), seq("t3", "c"), seq("b", "g2", { route: "hv" }), seq("c", "g2", { route: "hv" }),
      seq("g2", "d"), seq("d", "e"),
      seq("esS", "ee"), seq("ee", "ef"), seq("ef", "esE"),
      msg("client", "esA", "Message A"), msg("thB", "client", "Message B"), msg("e", "client", "Message C"),
      msg("client2", "esS", "Message A"),
    ],
  },

  // ── HT25 ordinarie 3(d): timers med datum ─────────────────────────────
  {
    id: "ht25-3d",
    title: "Timer start och väntan",
    source: "Omritat efter tenta HT25 ord 3(d)",
    views: [{ container: null, width: 560, height: 130 }],
    pools: [],
    nodes: [
      { id: "s", type: "start", event: "timer", timerLabel: "4th Day of the Month", label: "4th Day of the Month", cx: 50, cy: 55 },
      task("a", "Activity A", "user", 160, 55),
      { id: "t", type: "intermediate", event: "timer", duration: 48 * 60, label: "48 Hours", cx: 270, cy: 55 },
      task("b", "Activity B", "service", 380, 55),
      { id: "e", type: "end", event: "none", cx: 490, cy: 55 },
    ],
    flows: [seq("s", "a"), seq("a", "t"), seq("t", "b"), seq("b", "e")],
  },

  // ── HT25 omtenta 15: error end och error boundary ─────────────────────
  {
    id: "ht25-om15",
    title: "Error boundary på subprocess",
    source: "Omritat efter tenta HT25 omtenta fråga 15",
    views: [
      { container: null, width: 640, height: 230 },
      { container: "sub", title: "Subprocess A", width: 640, height: 230 },
    ],
    pools: [],
    nodes: [
      { id: "s", type: "start", event: "none", cx: 50, cy: 150 },
      task("a", "Activity A", "service", 160, 150),
      { id: "sub", type: "subprocess", label: "Subprocess A", cx: 290, cy: 150 },
      { id: "err", type: "boundary", event: "error", attachedTo: "sub", label: "Verification Failed", cx: 320, cy: 118 },
      task("f", "Activity F", "user", 440, 60),
      { id: "eF", type: "end", event: "none", label: "Work not completed", cx: 570, cy: 60 },
      task("e", "Activity E", "service", 440, 150),
      { id: "eE", type: "end", event: "none", label: "Work completed", cx: 570, cy: 150 },
      // Barndiagrammet
      { id: "cs", type: "start", event: "none", in: "sub", cx: 50, cy: 160 },
      task("cb", "Activity B", "service", 160, 160, { in: "sub" }),
      { id: "gm", type: "gateway", gw: "xor", label: "Missing Information?", in: "sub", cx: 280, cy: 160 },
      task("cc", "Activity C", "user", 280, 60, { in: "sub" }),
      { id: "ce", type: "end", event: "error", label: "Verification Failed", in: "sub", cx: 540, cy: 60 },
      task("cd", "Activity D", "user", 410, 160, { in: "sub" }),
      { id: "cok", type: "end", event: "none", label: "Verification Completed", in: "sub", cx: 540, cy: 160 },
    ],
    flows: [
      seq("s", "a"), seq("a", "sub"), seq("sub", "e"), seq("e", "eE"),
      seq("err", "f", { route: "vh", label: "Verification Failed" }), seq("f", "eF"),
      seq("cs", "cb"), seq("cb", "gm"), seq("gm", "cc", { cond: "Yes", route: "vh" }),
      seq("gm", "cd", { cond: "No" }), seq("cc", "ce"), seq("cd", "cok"),
    ],
  },

  // ── HT25 omtenta 16: timer start och väntan ───────────────────────────
  {
    id: "ht25-om16",
    title: "Timer start och väntan",
    source: "Omritat efter tenta HT25 omtenta fråga 16",
    views: [{ container: null, width: 560, height: 130 }],
    pools: [],
    nodes: [
      { id: "s", type: "start", event: "timer", timerLabel: "2nd Day of the Month", label: "2nd Day of the Month", cx: 50, cy: 55 },
      task("a", "Activity A", "manual", 160, 55),
      { id: "t", type: "intermediate", event: "timer", duration: 36 * 60, label: "36 Hours", cx: 270, cy: 55 },
      task("b", "Activity B", "service", 380, 55),
      { id: "e", type: "end", event: "none", cx: 490, cy: 55 },
    ],
    flows: [seq("s", "a"), seq("a", "t"), seq("t", "b"), seq("b", "e")],
  },
  // ── Egna diagram: konstruktioner ur genomgången ───────────────────────
  {
    id: "egen-boundary",
    title: "Boundary events: avbryta eller inte",
    source: "Eget diagram efter genomgångens låneexempel (s. 50–53)",
    views: [{ container: null, width: 500, height: 290 }],
    pools: [],
    nodes: [
      { id: "s", type: "start", event: "message", message: "Loan application", label: "Received loan application", cx: 50, cy: 120 },
      task("a", "Activity A", "user", 170, 120),
      { id: "bc", type: "boundary", event: "message", message: "Cancellation", attachedTo: "a", interrupting: true, label: "Receive cancellation", cx: 145, cy: 152 },
      { id: "bt", type: "boundary", event: "timer", duration: 2 * 1440, attachedTo: "a", interrupting: false, label: "2 Days", cx: 195, cy: 88 },
      task("b", "Activity B", "send", 330, 120),
      { id: "eb", type: "end", event: "none", label: "Application handled", cx: 440, cy: 120 },
      task("d", "Activity D", "send", 330, 40),
      { id: "ed", type: "end", event: "none", label: "Applicant notified", cx: 440, cy: 40 },
      task("c", "Activity C", "send", 270, 230),
      { id: "ec", type: "end", event: "none", label: "Application cancelled", cx: 390, cy: 230 },
    ],
    flows: [
      seq("s", "a"), seq("a", "b"), seq("b", "eb"),
      seq("bt", "d", { route: "vh", label: "2 Days" }), seq("d", "ed"),
      seq("bc", "c", { route: "vh", label: "Cancellation" }), seq("c", "ec"),
    ],
  },
  {
    id: "egen-or",
    title: "Inclusive gateway (OR)",
    source: "Eget diagram efter Silvers insättningsexempel i genomgången (s. 17–20)",
    views: [{ container: null, width: 820, height: 300 }],
    pools: [],
    nodes: [
      { id: "s", type: "start", event: "none", cx: 40, cy: 150 },
      task("a", "Activity A", "user", 140, 150),
      { id: "g", type: "gateway", gw: "or", cx: 260, cy: 150 },
      task("b", "Activity B", "user", 420, 50),
      task("c", "Activity C", "user", 420, 150),
      task("d", "Activity D", "service", 420, 250),
      { id: "j", type: "gateway", gw: "or", cx: 560, cy: 150 },
      task("e", "Activity E", "service", 660, 150),
      { id: "en", type: "end", event: "none", label: "Deposit registered", cx: 740, cy: 150 },
    ],
    flows: [
      seq("s", "a"), seq("a", "g"),
      seq("g", "b", { route: "vh", cond: "Över 10 000 USD" }),
      seq("g", "c", { cond: "Utländsk valuta" }),
      seq("g", "d", { route: "vh", cond: "Alltid" }),
      seq("b", "j", { route: "hv" }), seq("c", "j"), seq("d", "j", { route: "hv" }),
      seq("j", "e"), seq("e", "en"),
    ],
  },
  {
    id: "egen-terminate",
    title: "Terminate end i ett parallellt block",
    source: "Eget diagram efter genomgången (s. 35–36)",
    views: [{ container: null, width: 960, height: 310 }],
    pools: [],
    nodes: [
      { id: "s", type: "start", event: "none", cx: 40, cy: 140 },
      task("a", "Activity A", "user", 140, 140),
      { id: "g", type: "gateway", gw: "and", cx: 250, cy: 140 },
      task("b", "Activity B", "user", 360, 70),
      { id: "gx", type: "gateway", gw: "xor", label: "Data complete?", labelAbove: true, cx: 480, cy: 70 },
      { id: "xt", type: "end", event: "terminate", label: "Request aborted", cx: 480, cy: 160 },
      task("d", "Activity D", "user", 600, 70),
      { id: "t1", type: "intermediate", event: "timer", duration: 60, label: "1 Hour", cx: 360, cy: 250 },
      task("c", "Activity C", "service", 540, 250),
      { id: "j", type: "gateway", gw: "and", cx: 700, cy: 140 },
      task("e", "Activity E", "service", 800, 140),
      { id: "en", type: "end", event: "none", label: "Request completed", cx: 885, cy: 140 },
    ],
    flows: [
      seq("s", "a"), seq("a", "g"), seq("g", "b", { route: "vh" }), seq("g", "t1", { route: "vh" }),
      seq("b", "gx"), seq("gx", "d", { cond: "Yes" }), seq("gx", "xt", { cond: "No" }),
      seq("t1", "c"), seq("d", "j", { route: "hv" }), seq("c", "j", { route: "hv" }),
      seq("j", "e"), seq("e", "en"),
    ],
  },
  {
    id: "egen-loop",
    title: "Loop med XOR-gateway",
    source: "Eget diagram efter övningshäftets 1.1 (Check quality / Correct bouquet)",
    views: [{ container: null, width: 690, height: 280 }],
    pools: [],
    nodes: [
      { id: "s", type: "start", event: "none", cx: 40, cy: 110 },
      task("a", "Activity A", "user", 140, 110),
      task("b", "Activity B", "user", 270, 110),
      { id: "gx", type: "gateway", gw: "xor", label: "Quality approved?", labelAbove: true, cx: 400, cy: 110 },
      task("d", "Activity D", "service", 520, 110),
      { id: "en", type: "end", event: "none", label: "Product delivered", cx: 610, cy: 110 },
      task("c", "Activity C", "user", 400, 230),
    ],
    flows: [
      seq("s", "a"), seq("a", "b"), seq("b", "gx"), seq("gx", "d", { cond: "Yes" }), seq("d", "en"),
      seq("gx", "c", { cond: "No" }), seq("c", "b", { route: "hv" }),
    ],
  },
  {
    id: "egen-es-timer",
    title: "Event subprocess med timer",
    source: "Eget diagram efter genomgångens timerexempel (s. 66)",
    views: [
      { container: null, width: 510, height: 230 },
      { container: "es", title: "Notify of delay", width: 360, height: 120 },
    ],
    pools: [],
    nodes: [
      { id: "es", type: "eventSubprocess", label: "Notify of delay", cx: 170, cy: 50 },
      { id: "s", type: "start", event: "none", cx: 50, cy: 170 },
      task("a", "Activity A", "user", 170, 170),
      task("b", "Activity B", "service", 300, 170),
      { id: "en", type: "end", event: "none", label: "Application processed", cx: 410, cy: 170 },
      { id: "ess", type: "start", event: "timer", duration: 2 * 1440, interrupting: false, label: "2 Days", in: "es", cx: 50, cy: 55 },
      task("c", "Activity C", "send", 170, 55, { in: "es" }),
      { id: "ese", type: "end", event: "none", label: "Applicant notified", in: "es", cx: 290, cy: 55 },
    ],
    flows: [seq("s", "a"), seq("a", "b"), seq("b", "en"), seq("ess", "c"), seq("c", "ese")],
  },

  // ── Övningshäftets facit som körbara diagram ─────────────────────────
  {
    id: "hafte-1-1-leverans",
    title: "Övning 1.1: Bouquet delivery",
    source: "Övningshäftet 1.1, subprocessen Bouquet delivery (omritad)",
    views: [{ container: null, width: 1000, height: 390 }],
    pools: [{ id: "dc", label: "Delivery company", x: 10, y: 10, w: 980, h: 110, view: null }],
    nodes: [
      { id: "s", type: "start", event: "none", cx: 40, cy: 240 },
      task("i", "Input order details", "user", 140, 240),
      task("p", "Determine appropriate delivery partner", "user", 270, 240),
      task("h", "Hand over bouquet", "user", 400, 240),
      { id: "g", type: "gateway", gw: "event", cx: 510, cy: 240 },
      { id: "mc", type: "intermediate", event: "message", message: "Confirmation of delivery", label: "Receive confirmation of delivery", cx: 590, cy: 180 },
      { id: "ok", type: "end", event: "none", label: "Delivery succeeded", cx: 800, cy: 180 },
      { id: "mf", type: "intermediate", event: "message", message: "Notification of failure to deliver", label: "Recieve notification of failure to deliver", cx: 700, cy: 310 },
      task("r", "Receive returned bouquet", "user", 830, 310),
      { id: "fail", type: "end", event: "none", label: "Delivery failed", cx: 950, cy: 310 },
    ],
    flows: [
      seq("s", "i"), seq("i", "p"), seq("p", "h"), seq("h", "g"),
      seq("g", "mc", { route: "vh" }), seq("g", "mf", { route: "vh" }),
      seq("mc", "ok"), seq("mf", "r"), seq("r", "fail"),
      msg("dc", "mc", "Confirmation"), msg("dc", "mf", "Notification of failure"),
    ],
  },
  {
    id: "hafte-1-3-kritisk",
    title: "Övning 1.3: Handle critical issue",
    source: "Övningshäftet 1.3, subprocessen Handle critical issue (omritad)",
    views: [{ container: null, width: 1220, height: 330 }],
    pools: [],
    nodes: [
      { id: "s", type: "start", event: "none", cx: 40, cy: 190 },
      task("est", "Estimate time for resolution", "user", 140, 190),
      { id: "gx", type: "gateway", gw: "xor", cx: 260, cy: 190 },
      task("inf", "Inform customer of estimate", "send", 400, 60),
      { id: "a1", type: "gateway", gw: "and", cx: 420, cy: 190 },
      task("rem", "Set review reminder", "user", 530, 130),
      task("eng", "Engage second line support", "user", 530, 260),
      task("notc", "Notify customer of escalation", "user", 660, 260),
      { id: "a2", type: "gateway", gw: "and", cx: 770, cy: 190 },
      { id: "gx2", type: "gateway", gw: "xor", cx: 860, cy: 190 },
      task("notr", "Notify customer of feedback result", "send", 970, 110),
      { id: "or", type: "gateway", gw: "or", cx: 1080, cy: 190 },
      { id: "en", type: "end", event: "none", label: "Critical issue resolved", cx: 1170, cy: 190 },
    ],
    flows: [
      seq("s", "est"), seq("est", "gx"),
      seq("gx", "inf", { route: "vh", cond: "Under 48 hours" }),
      seq("gx", "a1", { cond: "48 hours or more" }),
      seq("a1", "rem", { route: "vh" }), seq("a1", "eng", { route: "vh" }),
      seq("eng", "notc"), seq("rem", "a2", { route: "hv" }), seq("notc", "a2", { route: "hv" }),
      seq("a2", "gx2"),
      seq("gx2", "notr", { route: "vh", cond: "Enhancements" }),
      seq("gx2", "or", { cond: "No enhancements" }),
      seq("notr", "or", { route: "hv" }), seq("inf", "or", { route: "hv" }),
      seq("or", "en"),
    ],
  },
];

// Variant av 3(c) där event subprocessens start är heldragen (interrupting).
// Samma layout; bara det som prövas skiljer.
{
  const base = diagrams.find((d) => d.id === "ht25-3c");
  diagrams.push({
    ...base,
    id: "ht25-3c-int",
    title: "Event subprocess (interrupting)",
    source: "Variant av tenta HT25 ord 3(c): startcirkeln är heldragen",
    nodes: base.nodes.map((n) => (n.id === "esS" ? { ...n, interrupting: true } : n)),
  });
}

export const diagramById = Object.fromEntries(diagrams.map((d) => [d.id, d]));
