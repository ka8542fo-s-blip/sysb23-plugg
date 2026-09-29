// Tokensimulator för BPMN-diagrammen i Kör processen.
//
// Samma diagramdata (src/data/process/bpmnDiagrams.js) ritas som SVG och
// körs här — en sanningskälla. Semantiken följer Björns genomgång (efter
// Silver 2017):
//   - throw sker direkt, catch väntar; timer = vänta i (minuter)
//   - event-based gateway: första händelsen vinner, övriga vägar stängs
//   - AND-split/join, XOR på villkor, OR-split på villkor och OR-join som
//     väntar så länge en token i scopet fortfarande kan nå den
//   - boundary events: interrupting avbryter aktiviteten, non-interrupting
//     startar en parallell väg; error är alltid interrupting och fångar ett
//     error end i subprocessen
//   - event subprocess: triggad medan scopet är aktivt; interrupting avbryter
//     allt annat i scopet, non-interrupting löper parallellt
//   - terminate end avslutar hela scopet
//   - flera inkommande flöden utan gateway: aktiviteten körs en gång per token
//
// Tid räknas i minuter från scenariots start, på väggklocka utan sommartid
// (tentans tidsfrågor är ren kalenderaritmetik).
//
// Scenario:
//   start:      "2025-12-04 00:01" (valfri; annars räknas bara minuter)
//   durations:  { nodId: minuter }            aktiviteters längd, standard 0
//   delays:     { nodId: minuter }            väntan innan noden verkställs
//                                             (t.ex. "Message B skickas 10 min efter A")
//   messages:   [{ name, at }]                vid minut `at`
//               [{ name, after: nodId, minutes }]  minuter efter att noden avslutats
//   conditions: { gatewayId: "Yes" | ["a", "b"] | [["a"], ["b"]] }
//               Ett flöde med `default: true` (default flow) tas bara när
//               inget villkor på gatewayen är sant.
//               XOR: en etikett, eller en lista som tas i tur och ordning vid
//               upprepade besök (loopar). OR: en lista av etiketter.
//
// "Inträffar" på tentan tolkas som att aktiviteten har startat.

const MAX_STEPS = 5000;

export function parseStart(text) {
  if (!text) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2})[:.](\d{2})$/.exec(text.trim());
  if (!m) throw new Error(`Ogiltig starttid: ${text}`);
  return Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
}

export function formatClock(startMs, minutes) {
  if (startMs == null) return formatDuration(minutes);
  const d = new Date(startMs + minutes * 60000);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} kl. ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
}

export function formatDuration(minutes) {
  if (minutes === 0) return "0 min";
  const d = Math.floor(minutes / 1440);
  const h = Math.floor((minutes % 1440) / 60);
  const m = minutes % 60;
  return [d && `${d} d`, h && `${h} h`, m && `${m} min`].filter(Boolean).join(" ");
}

const isActivity = (node) => node.type === "task" || node.type === "subprocess";

export function simulate(diagram, scenario = {}) {
  const nodes = new Map(diagram.nodes.map((n) => [n.id, n]));
  const seqFlows = diagram.flows.filter((f) => (f.kind || "seq") === "seq");
  const outgoing = (id) => seqFlows.filter((f) => f.from === id);
  const incoming = (id) => seqFlows.filter((f) => f.to === id);
  const childrenOf = (containerId) => diagram.nodes.filter((n) => (n.in || null) === containerId);
  const boundariesOf = (id) => diagram.nodes.filter((n) => n.type === "boundary" && n.attachedTo === id);
  const label = (id) => nodes.get(id)?.label || id;

  const startMs = parseStart(scenario.start);
  const durations = scenario.durations || {};
  const delays = scenario.delays || {};
  const conditionVisits = {};

  // Händelsekö: [tid, ordning, funktion]. Samma tid körs i den ordning
  // händelserna lades till.
  const queue = [];
  let order = 0;
  let now = 0;
  const at = (time, fn) => {
    queue.push({ time, order: order++, fn });
    queue.sort((a, b) => a.time - b.time || a.order - b.order);
  };

  const trace = [];
  const log = (text, nodeId, kind = "info") => trace.push({ time: now, clock: formatClock(startMs, now), text, node: nodeId, kind });
  const started = [];
  const endStates = [];
  const completed = [];
  const visited = new Set();
  let endTime = null;
  let finished = false;

  // Meddelanden som ännu ingen väntar på buffras på processnivå.
  const buffer = [];
  // Väntande mottagare: { message, scope, fire(), cancelled }
  let waiters = [];

  let scopeSeq = 0;
  const scopesAlive = new Set();
  function makeScope(container, parent, onDone) {
    const scope = {
      id: ++scopeSeq, container, parent, onDone,
      tokens: new Set(), activities: new Set(), children: new Set(),
      joins: new Map(), alive: true, esListeners: [],
    };
    parent?.children.add(scope);
    scopesAlive.add(scope);
    return scope;
  }

  function scopeBusy(scope) {
    if (scope.tokens.size || scope.activities.size) return true;
    for (const child of scope.children) if (child.alive) return true;
    for (const w of waiters) if (!w.cancelled && w.scope === scope && !w.listener) return true;
    for (const [, j] of scope.joins) if (j.count > 0) return true;
    return false;
  }

  function checkDone(scope) {
    if (!scope.alive || scopeBusy(scope)) return;
    scope.alive = false;
    scopesAlive.delete(scope);
    for (const w of waiters) if (w.scope === scope) w.cancelled = true;
    scope.parent?.children.delete(scope);
    scope.onDone?.();
  }

  function killScope(scope, reason) {
    if (!scope.alive) return;
    scope.alive = false;
    scopesAlive.delete(scope);
    for (const t of scope.tokens) t.dead = true;
    scope.tokens.clear();
    for (const a of scope.activities) {
      a.dead = true;
      log(`${label(a.node.id)} avbryts (${reason})`, a.node.id, "interrupt");
    }
    scope.activities.clear();
    for (const child of [...scope.children]) killScope(child, reason);
    scope.children.clear();
    for (const w of waiters) if (w.scope === scope) w.cancelled = true;
    scope.joins.clear();
    scope.parent?.children.delete(scope);
  }

  // ── Token-förflyttning ────────────────────────────────────────────────
  function emit(scope, fromId) {
    for (const flow of outgoing(fromId)) moveTo(scope, flow.to, flow);
  }

  function moveTo(scope, nodeId, viaFlow) {
    if (!scope.alive) return;
    const token = { node: nodeId, via: viaFlow, dead: false };
    scope.tokens.add(token);
    const delay = delays[nodeId] || 0;
    at(now + delay, () => {
      if (token.dead || !scope.alive) return;
      scope.tokens.delete(token);
      arrive(scope, nodeId, viaFlow);
      settle(scope);
    });
  }

  function settle(scope) {
    evaluateOrJoins();
    for (let s = scope; s; s = s.parent) checkDone(s);
  }

  function arrive(scope, nodeId, viaFlow) {
    const node = nodes.get(nodeId);
    visited.add(nodeId);
    switch (node.type) {
      case "task": return runTask(scope, node);
      case "subprocess": return runSubprocess(scope, node);
      case "gateway": return runGateway(scope, node, viaFlow);
      case "intermediate": return runIntermediate(scope, node);
      case "end": return runEnd(scope, node);
      default: throw new Error(`Oväntad nod i flödet: ${nodeId} (${node.type})`);
    }
  }

  function startActivity(scope, node) {
    const act = { node, dead: false, scope, listeners: [] };
    scope.activities.add(act);
    started.push(node.id);
    log(`${label(node.id)} startar`, node.id, "start");
    for (const b of boundariesOf(node.id)) armBoundary(scope, act, b);
    return act;
  }

  function finishActivity(scope, act) {
    if (act.dead) return false;
    act.dead = true;
    for (const l of act.listeners) l.cancelled = true;
    scope.activities.delete(act);
    completed.push(act.node.id);
    log(`${label(act.node.id)} klar`, act.node.id, "done");
    // Meddelanden som ska komma "N minuter efter att X avslutats".
    for (const msg of scenario.messages || []) {
      if (msg.after === act.node.id) deliverLater(msg.name, now + (msg.minutes || 0));
    }
    return true;
  }

  function runTask(scope, node) {
    const act = startActivity(scope, node);
    if (node.receives) {
      // Receive task: väntar på sitt meddelande, sedan klar.
      waitForMessage(scope, node.receives, () => {
        if (!finishActivity(scope, act)) return;
        emit(scope, node.id);
      }, act);
      return;
    }
    at(now + (durations[node.id] || 0), () => {
      if (!finishActivity(scope, act)) return;
      emit(scope, node.id);
      settle(scope);
    });
  }

  function runSubprocess(scope, node) {
    const act = startActivity(scope, node);
    const child = makeScope(node.id, scope, () => {
      if (!finishActivity(scope, act)) return;
      emit(scope, node.id);
    });
    act.child = child;
    child.activity = act;
    startScope(child);
  }

  function startScope(scope) {
    const kids = childrenOf(scope.container);
    for (const es of kids.filter((n) => n.type === "eventSubprocess")) armEventSubprocess(scope, es);
    const starts = kids.filter((n) => n.type === "start");
    for (const s of starts) {
      visited.add(s.id);
      const what = scope.container ? `Barndiagrammet "${label(scope.container)}" startar` : "Processen startar";
      log(s.label ? `${what}: ${s.label}` : what, s.id, "event");
      emit(scope, s.id);
    }
  }

  function chooseCondition(node) {
    const value = scenario.conditions?.[node.id];
    if (!Array.isArray(value) || node.gw === "or") return value;
    const i = conditionVisits[node.id] ?? 0;
    conditionVisits[node.id] = i + 1;
    return value[Math.min(i, value.length - 1)];
  }

  function runGateway(scope, node, viaFlow) {
    const ins = incoming(node.id);
    const outs = outgoing(node.id);
    if (node.gw === "and" && ins.length > 1) {
      const j = scope.joins.get(node.id) || { count: 0 };
      j.count++;
      scope.joins.set(node.id, j);
      if (j.count < ins.length) return;
      scope.joins.delete(node.id);
      log(`AND-join: alla ${ins.length} vägar har kommit fram`, node.id);
    }
    if (node.gw === "or" && ins.length > 1) {
      const j = scope.joins.get(node.id) || { count: 0, or: true };
      j.count++;
      scope.joins.set(node.id, j);
      return; // släpps av evaluateOrJoins när inget mer kan komma
    }
    if (outs.length <= 1) return emit(scope, node.id);

    if (node.gw === "and") {
      log(`AND-split: ${outs.length} parallella vägar`, node.id);
      return emit(scope, node.id);
    }
    if (node.gw === "xor") {
      const value = chooseCondition(node);
      // Default flow (snedstreck) tas bara när inget villkor är sant.
      const flow = outs.find((f) => !f.default && f.cond === value) || outs.find((f) => f.default);
      if (!flow) throw new Error(`${node.id}: inget villkor "${value}" (${outs.map((f) => f.cond).join(", ")})`);
      log(`XOR${node.label ? ` "${node.label}"` : ""}: ${flow.default ? "inget villkor sant, default flow" : value}`, node.id);
      return moveTo(scope, flow.to, flow);
    }
    if (node.gw === "or") {
      const values = [].concat(chooseCondition(node) || []);
      let flows = outs.filter((f) => !f.default && values.includes(f.cond));
      // Inget villkor sant: default flow, om det finns.
      if (!flows.length) flows = outs.filter((f) => f.default);
      if (!flows.length) throw new Error(`${node.id}: inget OR-villkor valt`);
      log(
        flows[0].default
          ? "OR-split: inget villkor sant, default flow"
          : `OR-split: ${flows.map((f) => f.cond).join(" och ")}`,
        node.id,
      );
      for (const f of flows) moveTo(scope, f.to, f);
      return;
    }
    if (node.gw === "event") {
      log("Event-based gateway: väntar på första händelsen", node.id);
      const group = { decided: false, waiters: [] };
      for (const f of outs) {
        const target = nodes.get(f.to);
        const fire = () => {
          if (group.decided) return;
          group.decided = true;
          for (const w of group.waiters) w.cancelled = true;
          visited.add(target.id);
          log(`${label(target.id)} inträffar först — den vägen väljs`, target.id, "event");
          emit(scope, target.id);
          settle(scope);
        };
        if (target.event === "timer") {
          const w = { scope, cancelled: false };
          waiters.push(w);
          group.waiters.push(w);
          at(now + target.duration, () => { if (!w.cancelled) { w.cancelled = true; fire(); } });
        } else if (target.event === "message") {
          group.waiters.push(waitForMessage(scope, target.message, fire));
        } else {
          throw new Error(`${target.id}: event-based gateway kräver timer eller message`);
        }
      }
      return;
    }
    throw new Error(`${node.id}: okänd gateway ${node.gw}`);
  }

  // OR-join: släpp när ingen levande token eller aktivitet i scopet kan nå
  // joinen längre.
  function evaluateOrJoins() {
    for (const scope of [...scopesAlive]) {
      for (const [joinId, j] of [...scope.joins]) {
        if (!j.or || j.count === 0) continue;
        const sources = [
          ...[...scope.tokens].map((t) => t.node),
          ...[...scope.activities].map((a) => a.node.id),
          ...waiters.filter((w) => !w.cancelled && w.scope === scope && w.at).map((w) => w.at),
        ];
        // En token som redan är på väg in i joinen räknas också.
        if (sources.some((src) => src === joinId || reaches(src, joinId))) continue;
        scope.joins.delete(joinId);
        log(`OR-join: ${j.count} ${j.count === 1 ? "väg" : "vägar"} kom fram, inget mer är på väg`, joinId);
        emit(scope, joinId);
      }
    }
  }
  function reaches(from, to, seen = new Set()) {
    if (from === to) return true;
    if (seen.has(from)) return false;
    seen.add(from);
    const nexts = outgoing(from).map((f) => f.to);
    for (const b of boundariesOf(from)) nexts.push(b.id);
    return nexts.some((n) => reaches(n, to, seen));
  }

  function runIntermediate(scope, node) {
    if (node.throw) {
      log(`Skickar ${node.message ? `"${node.message}"` : "signal"} (throw)`, node.id, "event");
      return emit(scope, node.id);
    }
    if (node.event === "timer") {
      log(`Timer: väntar ${formatDuration(node.duration)}`, node.id, "wait");
      const w = { scope, cancelled: false, at: node.id };
      waiters.push(w);
      at(now + node.duration, () => {
        if (w.cancelled) return;
        w.cancelled = true;
        log(`Timern "${label(node.id)}" går ut`, node.id, "event");
        emit(scope, node.id);
        settle(scope);
      });
      return;
    }
    if (node.event === "message") {
      log(`Väntar på "${node.message}"`, node.id, "wait");
      waitForMessage(scope, node.message, () => {
        log(`"${node.message}" tas emot`, node.id, "event");
        emit(scope, node.id);
        settle(scope);
      }, null, node.id);
      return;
    }
    throw new Error(`${node.id}: okänd intermediate`);
  }

  function runEnd(scope, node) {
    if (node.event === "message") log(`Sluthändelse${node.label ? `: ${node.label}` : ""} — skickar "${node.message}"`, node.id, "end");
    // Sluttillstånd räknas bara på översta nivån (subprocessens egna
    // sluttillstånd syns i föräldern som vilken väg som tas).
    if (!scope.container) endStates.push(node.label || node.id);
    if (node.event !== "message" && node.event !== "error" && node.event !== "terminate") log(node.label ? `Sluthändelse: ${node.label}` : "Sluthändelse nås", node.id, "end");
    if (node.event === "terminate") {
      log(`Terminate: ${label(node.id)} avslutar hela nivån`, node.id, "end");
      killScope(scope, "terminate");
      scope.onDone?.();
      return;
    }
    if (node.event === "error") {
      log(`Error end "${label(node.id)}" kastar ett fel`, node.id, "end");
      return raiseError(scope, node.error || node.label);
    }
  }

  function raiseError(scope, code) {
    // Felet går till närmaste error boundary på den omslutande subprocessen.
    for (let s = scope; s; s = s.parent) {
      const act = s.activity;
      if (!act) break;
      const boundary = boundariesOf(act.node.id).find(
        (b) => b.event === "error" && (!b.error || b.error === code),
      );
      if (boundary) {
        killScope(s, "fel");
        act.dead = true;
        s.parent.activities.delete(act);
        log(`${label(act.node.id)} avbryts av felet`, act.node.id, "interrupt");
        visited.add(boundary.id);
        log(`Error boundary "${label(boundary.id)}" fångar felet`, boundary.id, "event");
        emit(s.parent, boundary.id);
        return;
      }
    }
    // Ofångat fel avslutar processen.
    for (const s of scopesAlive) if (!s.parent) killScope(s, "ofångat fel");
  }

  // ── Meddelanden ───────────────────────────────────────────────────────
  function waitForMessage(scope, name, fire, act = null, atNode = null) {
    const w = { message: name, scope, cancelled: false, fire, at: atNode };
    if (act) act.listeners.push(w);
    const i = buffer.findIndex((m) => m === name);
    if (i >= 0) {
      buffer.splice(i, 1);
      at(now, () => { if (!w.cancelled) { w.cancelled = true; fire(); } });
      return w;
    }
    waiters.push(w);
    return w;
  }

  function deliverLater(name, time) {
    at(time, () => deliver(name));
  }

  function deliver(name) {
    log(`Meddelandet "${name}" kommer`, null, "message");
    const w = waiters.find((x) => !x.cancelled && x.message === name && x.fire);
    if (w) {
      if (!w.listener) w.cancelled = true;
      w.fire();
      for (const s of scopesAlive) if (!s.parent) settle(s);
      return;
    }
    if (!rootStarted && messageStart && messageStart.message === name) {
      startRoot();
      return;
    }
    buffer.push(name);
  }

  // ── Boundary events ───────────────────────────────────────────────────
  function armBoundary(scope, act, b) {
    if (b.event === "error") return; // hanteras av raiseError
    const trigger = () => {
      if (act.dead) return;
      visited.add(b.id);
      if (b.interrupting !== false) {
        log(`Interrupting ${b.event === "timer" ? "timer" : "message"} boundary "${label(b.id)}" — ${label(act.node.id)} avbryts`, b.id, "interrupt");
        act.dead = true;
        for (const l of act.listeners) l.cancelled = true;
        scope.activities.delete(act);
        if (act.child) killScope(act.child, "boundary");
      } else {
        log(`Non-interrupting boundary "${label(b.id)}" — ${label(act.node.id)} fortsätter`, b.id, "event");
      }
      emit(scope, b.id);
      settle(scope);
    };
    if (b.event === "timer") {
      const w = { cancelled: false };
      act.listeners.push(w);
      at(now + b.duration, () => { if (!w.cancelled) { w.cancelled = true; trigger(); } });
    } else if (b.event === "message") {
      const w = { message: b.message, scope, cancelled: false, fire: trigger, listener: true };
      act.listeners.push(w);
      waiters.push(w);
    }
  }

  // ── Event subprocess ──────────────────────────────────────────────────
  function armEventSubprocess(scope, es) {
    const start = childrenOf(es.id).find((n) => n.type === "start");
    const interrupting = start.interrupting !== false;
    const trigger = () => {
      if (!scope.alive) return;
      visited.add(es.id);
      visited.add(start.id);
      log(`Event subprocess "${label(es.id)}" startar (${interrupting ? "interrupting" : "non-interrupting"})`, es.id, "event");
      started.push(es.id);
      if (interrupting) {
        for (const t of scope.tokens) t.dead = true;
        scope.tokens.clear();
        for (const a of scope.activities) {
          a.dead = true;
          for (const l of a.listeners) l.cancelled = true;
          log(`${label(a.node.id)} avbryts av event subprocessen`, a.node.id, "interrupt");
          if (a.child) killScope(a.child, "event subprocess");
        }
        scope.activities.clear();
        for (const w of waiters) if (w.scope === scope) w.cancelled = true;
        scope.joins.clear();
        for (const c of [...scope.children]) killScope(c, "event subprocess");
      }
      const child = makeScope(es.id, scope, () => {
        completed.push(es.id);
        log(`Event subprocess "${label(es.id)}" klar`, es.id, "done");
      });
      emit(child, start.id);
      settle(child);
    };
    if (start.event === "message") {
      const w = { message: start.message, scope, cancelled: false, fire: trigger, listener: true };
      waiters.push(w);
    } else if (start.event === "timer") {
      const w = { scope, cancelled: false, listener: true };
      waiters.push(w);
      at(now + start.duration, () => { if (!w.cancelled && scope.alive) { w.cancelled = true; trigger(); } });
    }
  }

  // ── Start ─────────────────────────────────────────────────────────────
  const topStarts = childrenOf(null).filter((n) => n.type === "start");
  const messageStart = topStarts.find((n) => n.event === "message");
  let rootStarted = false;
  let root = null;

  function startRoot() {
    rootStarted = true;
    root = makeScope(null, null, () => {
      endTime = now;
      finished = true;
      log("Processen är avslutad", null, "finish");
    });
    if (messageStart) log(`"${messageStart.message}" tas emot — processen startar`, messageStart.id, "message");
    startScope(root);
    settle(root);
  }

  for (const msg of scenario.messages || []) {
    if (msg.at !== undefined) deliverLater(msg.name, msg.at);
  }
  if (!messageStart) at(0, startRoot);

  let steps = 0;
  while (queue.length) {
    if (++steps > MAX_STEPS) throw new Error("Simuleringen tog för många steg (oändlig loop?)");
    const next = queue.shift();
    now = next.time;
    next.fn();
    if (finished && !queue.some((q) => q.time === now)) break;
  }

  const uniq = (ids) => [...new Set(ids)];
  const labelsOf = (ids) =>
    uniq(ids)
      .filter((id) => isActivity(nodes.get(id)) && nodes.get(id).type === "task")
      .map((id) => label(id));

  return {
    finished,
    endTime,
    endClock: endTime == null ? null : formatClock(startMs, endTime),
    started: labelsOf(started),
    completed: labelsOf(completed),
    visited: [...visited],
    endStates,
    trace,
  };
}
