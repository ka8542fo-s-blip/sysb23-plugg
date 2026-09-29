// Simulatorn mot facit: varje uppgift i Kör processen körs, och svaret
// måste stämma med det handskrivna facit (tentans svar enligt HANDOFF).
// Plus konstruktionstester på små diagram, så att semantiken inte glider.
import { test } from "node:test";
import assert from "node:assert/strict";
import { simulate } from "../src/lib/bpmnSim.js";
import { diagrams, diagramById } from "../src/data/process/bpmnDiagrams.js";
import { tasks, answerFromResult, correctIndex } from "../src/data/process/bpmnTasks.js";

for (const task of tasks.filter((t) => t.kind !== "element")) {
  test(`${task.id}: simulatorn ger facit (${task.answer})`, () => {
    const result = simulate(diagramById[task.diagram], task.scenario);
    assert.ok(result.finished, `${task.id}: processen avslutades inte`);
    assert.equal(answerFromResult(task, result), task.answer);
    assert.ok(correctIndex(task) >= 0, `${task.id}: facit finns inte bland alternativen`);
  });
}

test("elementfrågan: facit finns bland alternativen och motsvarar ett element", () => {
  for (const task of tasks.filter((t) => t.kind === "element")) {
    assert.ok(correctIndex(task) >= 0, task.id);
    assert.ok(task.elements.some((e) => e.letter === task.answer), task.id);
  }
});

test("3(c) med interrupting event subprocess ger A, E, F — tentans distraktor", () => {
  const d = structuredClone(diagramById["ht25-3c"]);
  d.nodes.find((n) => n.id === "esS").interrupting = true;
  const task = tasks.find((t) => t.id === "kp-3c");
  const result = simulate(d, task.scenario);
  assert.equal(answerFromResult(task, result), "AEF");
});

test("3(b) när timern hinner först: A, C, D", () => {
  const task = tasks.find((t) => t.id === "kp-3b");
  const result = simulate(diagramById["ht25-3b"], {
    messages: [{ name: "Message A", at: 0 }, { name: "Message B", after: "a", minutes: 5 * 1440 }],
  });
  assert.equal(answerFromResult(task, result), "ACD");
});

test("omtenta 15 med Missing Information = No: A, B, D, E", () => {
  const task = tasks.find((t) => t.id === "kp-om15");
  const result = simulate(diagramById["ht25-om15"], { conditions: { gm: "No" } });
  assert.equal(answerFromResult(task, result), "ABDE");
});

// ── Konstruktioner på små diagram ─────────────────────────────────────
const t = (id, extra = {}) => ({ id, type: "task", label: `Activity ${id.toUpperCase()}`, taskType: "user", cx: 0, cy: 0, ...extra });
const f = (from, to, extra = {}) => ({ from, to, kind: "seq", ...extra });
const letters = (r) => r.started.map((l) => l.slice(-1)).sort().join("");

test("okontrollerad merge: aktivitet med två inkommande flöden körs två gånger efter AND-split", () => {
  const d = { nodes: [
    { id: "s", type: "start", event: "none" }, { id: "g", type: "gateway", gw: "and" },
    t("a"), t("b"), t("c"), { id: "e", type: "end", event: "none" },
  ], flows: [f("s", "g"), f("g", "a"), f("g", "b"), f("a", "c"), f("b", "c"), f("c", "e")] };
  const r = simulate(d);
  assert.equal(r.trace.filter((x) => x.text === "Activity C startar").length, 2);
});

test("OR-split och OR-join: joinen väntar bara på aktiverade vägar", () => {
  const d = { nodes: [
    { id: "s", type: "start", event: "none" }, { id: "g", type: "gateway", gw: "or" },
    t("a"), t("b"), t("c"), { id: "j", type: "gateway", gw: "or" }, t("d"), { id: "e", type: "end", event: "none" },
  ], flows: [f("s", "g"), f("g", "a", { cond: "x" }), f("g", "b", { cond: "y" }), f("g", "c", { cond: "z" }),
    f("a", "j"), f("b", "j"), f("c", "j"), f("j", "d"), f("d", "e")] };
  const r = simulate(d, { conditions: { g: ["x", "z"] }, durations: { a: 10, c: 30 } });
  assert.equal(letters(r), "ACD");
  assert.equal(r.endTime, 30);
  assert.equal(r.trace.filter((x) => x.text === "Activity D startar").length, 1);
});

test("terminate end avslutar en pågående parallell väg", () => {
  const d = { nodes: [
    { id: "s", type: "start", event: "none" }, { id: "g", type: "gateway", gw: "and" },
    t("a"), t("b"), t("c"), { id: "x", type: "end", event: "terminate" }, { id: "e", type: "end", event: "none" },
  ], flows: [f("s", "g"), f("g", "a"), f("g", "b"), f("a", "x"), f("b", "c"), f("c", "e")] };
  const r = simulate(d, { durations: { a: 5, b: 60 } });
  assert.equal(letters(r), "AB");
  assert.equal(r.endTime, 5);
});

test("non-interrupting timer boundary: aktiviteten fortsätter och avisering skickas", () => {
  const d = { nodes: [
    { id: "s", type: "start", event: "none" }, t("a"),
    { id: "b", type: "boundary", event: "timer", duration: 30, interrupting: false, attachedTo: "a" },
    t("n"), { id: "e1", type: "end", event: "none" }, t("c"), { id: "e2", type: "end", event: "none" },
  ], flows: [f("s", "a"), f("a", "c"), f("c", "e2"), f("b", "n"), f("n", "e1")] };
  const r = simulate(d, { durations: { a: 60 } });
  assert.equal(letters(r), "ACN");
  assert.equal(r.endTime, 60);
});

test("interrupting timer boundary: aktiviteten avbryts och normalflödet används inte", () => {
  const d = { nodes: [
    { id: "s", type: "start", event: "none" }, t("a"),
    { id: "b", type: "boundary", event: "timer", duration: 30, attachedTo: "a" },
    t("n"), { id: "e1", type: "end", event: "none" }, t("c"), { id: "e2", type: "end", event: "none" },
  ], flows: [f("s", "a"), f("a", "c"), f("c", "e2"), f("b", "n"), f("n", "e1")] };
  const r = simulate(d, { durations: { a: 60 } });
  assert.equal(letters(r), "AN");
  assert.equal(r.endTime, 30);
});

test("XOR-loop: villkoren tas i tur och ordning vid upprepade besök", () => {
  const d = { nodes: [
    { id: "s", type: "start", event: "none" }, t("a"), { id: "g", type: "gateway", gw: "xor" },
    t("b"), { id: "e", type: "end", event: "none" },
  ], flows: [f("s", "a"), f("a", "g"), f("g", "b", { cond: "fel" }), f("b", "a"), f("g", "e", { cond: "ok" })] };
  const r = simulate(d, { conditions: { g: ["fel", "fel", "ok"] } });
  assert.equal(r.trace.filter((x) => x.text === "Activity A startar").length, 3);
  assert.equal(r.trace.filter((x) => x.text === "Activity B startar").length, 2);
});

test("varje diagram har giltiga flöden och unika id:n", () => {
  for (const d of diagrams) {
    const ids = new Set();
    for (const n of d.nodes) {
      assert.ok(!ids.has(n.id), `${d.id}: dubblett ${n.id}`);
      ids.add(n.id);
    }
    const pools = new Set((d.pools || []).map((p) => p.id));
    for (const fl of d.flows) {
      for (const end of [fl.from, fl.to]) {
        assert.ok(ids.has(end) || (fl.kind === "msg" && pools.has(end)), `${d.id}: flöde till okänd ${end}`);
      }
    }
    for (const n of d.nodes) {
      if (n.in) assert.ok(ids.has(n.in), `${d.id}: ${n.id} ligger i okänd ${n.in}`);
      if (n.attachedTo) assert.ok(ids.has(n.attachedTo), `${d.id}: ${n.id} sitter på okänd ${n.attachedTo}`);
    }
  }
});

test("inga noder överlappar i samma vy (boundary events undantagna)", () => {
  const half = (n) => (["task", "subprocess", "eventSubprocess"].includes(n.type) ? [50, 32] : n.type === "gateway" ? [25, 25] : [18, 18]);
  for (const d of diagrams) {
    const nodes = d.nodes.filter((n) => n.type !== "boundary");
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        if ((a.in || null) !== (b.in || null)) continue;
        const [aw, ah] = half(a);
        const [bw, bh] = half(b);
        const overlap = Math.abs(a.cx - b.cx) < aw + bw && Math.abs(a.cy - b.cy) < ah + bh;
        assert.ok(!overlap, `${d.id}: ${a.id} och ${b.id} överlappar`);
      }
    }
  }
});

test("default flow tas bara när inget villkor är sant (XOR och OR)", () => {
  const mk = (gw) => ({ nodes: [
    { id: "s", type: "start", event: "none" }, { id: "g", type: "gateway", gw },
    t("a"), t("b"), t("d"), { id: "e1", type: "end", event: "none" }, { id: "e2", type: "end", event: "none" }, { id: "e3", type: "end", event: "none" },
  ], flows: [f("s", "g"), f("g", "a", { cond: "x" }), f("g", "b", { cond: "y" }), f("g", "d", { default: true }),
    f("a", "e1"), f("b", "e2"), f("d", "e3")] });
  assert.equal(letters(simulate(mk("xor"), { conditions: { g: "z" } })), "D");
  assert.equal(letters(simulate(mk("xor"), { conditions: { g: "x" } })), "A");
  assert.equal(letters(simulate(mk("or"), { conditions: { g: [] } })), "D");
  assert.equal(letters(simulate(mk("or"), { conditions: { g: ["x", "y"] } })), "AB");
});
