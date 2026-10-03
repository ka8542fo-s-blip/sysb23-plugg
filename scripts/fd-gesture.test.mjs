// Gesterna på ritytan (lib/fdGesture.js): pil via drag och via tryck–tryck,
// gruppera via drag, lyfta ut, flytta, radera, ångra — och att en ny pil
// aldrig blir markerad.
import { test } from "node:test";
import assert from "node:assert/strict";
import { press, hold, drag, release, deleteButtonPos, deletable, HOLD_MS } from "../src/lib/fdGesture.js";
import { gridDiagram, normalizeDiagram, historyReducer, groupRect, addGroup, addArrow, BOX, emptyDiagram } from "../src/lib/fdDiagram.js";

const base = () => ({
  boxes: [{ id: "A", attr: "A", x: 100, y: 100 }, { id: "B", attr: "B", x: 260, y: 100 }, { id: "C", attr: "C", x: 420, y: 100 }, { id: "D", attr: "D", x: 260, y: 280 }],
  groups: [], arrows: [],
});
const ctxOf = (diagram, selection = [], pending = null) => ({ diagram, selection, pending, tol: 6, slop: 4 });

// En hel gest: tryck, drag i steg, släpp. `t` är tiden när draget börjar.
function gesture(ctx, from, to, { t = 10, shift = false, steps = 6 } = {}) {
  let g = press(ctx, from, { shift, time: 0 });
  if (t >= HOLD_MS) g = hold(g, t);
  for (let i = 1; i <= steps; i++) {
    const p = { x: from.x + ((to.x - from.x) * i) / steps, y: from.y + ((to.y - from.y) * i) / steps };
    g = drag(g, p, ctx, t + i).gesture;
  }
  return release(g, to, ctx);
}
const tap = (ctx, p, opts) => release(press(ctx, p, opts), p, ctx);

test("snabbt drag från låda till låda ger en pil, och pilen blir inte markerad", () => {
  const ctx = ctxOf(base());
  const out = gesture(ctx, { x: 100, y: 100 }, { x: 262, y: 104 });
  assert.equal(out.diagram.arrows.length, 1);
  assert.deepEqual(out.diagram.arrows[0].from, { kind: "box", id: "A" });
  assert.deepEqual(out.diagram.arrows[0].to, { kind: "box", id: "B" });
  assert.deepEqual(out.selection, [], "ny pil markeras inte");
  assert.equal(out.pending, null);
  // Lådorna har inte flyttats.
  assert.deepEqual(out.diagram.boxes, base().boxes);
  // Släppt på tom yta: ingen pil.
  const miss = gesture(ctx, { x: 100, y: 100 }, { x: 500, y: 350 });
  assert.equal(miss.diagram, ctx.diagram);
  assert.match(miss.message, /Ingen pil/);
});

test("tryck på en låda och sedan på en annan ger en pil (tryck–tryck)", () => {
  let ctx = ctxOf(base());
  const first = tap(ctx, { x: 100, y: 100 });
  assert.deepEqual(first.selection, ["A"]);
  assert.deepEqual(first.pending, { kind: "box", id: "A" });
  ctx = ctxOf(first.diagram, first.selection, first.pending);
  const second = tap(ctx, { x: 420, y: 100 });
  assert.equal(second.diagram.arrows.length, 1);
  assert.equal(second.diagram.arrows[0].to.id, "C");
  assert.deepEqual(second.selection, []);
  // Tryck på samma låda igen avmarkerar.
  const again = tap(ctxOf(base(), ["A"], { kind: "box", id: "A" }), { x: 100, y: 100 });
  assert.deepEqual(again.selection, []);
});

test("drag av en markerad låda flyttar den; släppt på en annan låda grupperas de", () => {
  const ctx = ctxOf(base(), ["A"], { kind: "box", id: "A" });
  const moved = gesture(ctx, { x: 100, y: 100 }, { x: 140, y: 200 });
  assert.deepEqual(moved.diagram.boxes.find((b) => b.id === "A"), { id: "A", attr: "A", x: 140, y: 200 });
  assert.equal(moved.diagram.arrows.length, 0);
  assert.equal(moved.before, ctx.diagram, "ångra går tillbaka till läget före draget");
  const grouped = gesture(ctx, { x: 100, y: 100 }, { x: 255, y: 104 });
  assert.equal(grouped.diagram.groups.length, 1);
  assert.deepEqual([...grouped.diagram.groups[0].members].sort(), ["A", "B"]);
  assert.match(grouped.message, /^Grupp \{A, B\}/);
  const a = grouped.diagram.boxes.find((b) => b.id === "A");
  assert.ok(Math.abs(a.x - 260) >= BOX, "A ligger bredvid B, inte ovanpå");
});

test("håll in en låda och dra: lyfts och grupperas utan att markeras först", () => {
  const ctx = ctxOf(base());
  const out = gesture(ctx, { x: 100, y: 100 }, { x: 258, y: 98 }, { t: HOLD_MS + 20 });
  assert.equal(out.diagram.arrows.length, 0);
  assert.equal(out.diagram.groups.length, 1);
  // hold() lyfter bara efter tillräckligt lång tid och utan rörelse.
  const g = press(ctx, { x: 100, y: 100 }, { time: 0 });
  assert.equal(hold(g, HOLD_MS - 50).mode, "pending");
  assert.equal(hold(g, HOLD_MS + 1).mode, "move");
});

test("dra ut en låda ur en grupp lyfter ut den; en grupp med en låda kvar upplöses", () => {
  let d = base();
  const g = addGroup(d, ["A", "B", "C"]);
  d = addArrow(g.diagram, { kind: "group", id: g.id }, { kind: "box", id: "D" }).diagram;
  const out = gesture(ctxOf(d, ["C"]), { x: 420, y: 100 }, { x: 520, y: 340 });
  assert.deepEqual([...out.diagram.groups[0].members].sort(), ["A", "B"]);
  assert.match(out.message, /C lyft ur gruppen/);
  const two = addGroup(base(), ["A", "B"]);
  const solo = gesture(ctxOf(two.diagram, ["A"]), { x: 100, y: 100 }, { x: 100, y: 330 });
  assert.equal(solo.diagram.groups.length, 0);
});

test("pil från en grupp: snabbt drag från gruppens ram", () => {
  const g = addGroup(base(), ["A", "B"]);
  const r = groupRect(g.diagram.groups[0], g.diagram);
  const out = gesture(ctxOf(g.diagram), { x: 180, y: r.y + 3 }, { x: 262, y: 282 });
  assert.equal(out.diagram.arrows.length, 1);
  assert.deepEqual(out.diagram.arrows[0].from, { kind: "group", id: g.id });
});

test("radera: ×-knappen och Delete tar bort pilar och grupper, inte lådor", () => {
  let d = addArrow(base(), { kind: "box", id: "A" }, { kind: "box", id: "B" }).diagram;
  const arrowId = d.arrows[0].id;
  // Tryck på pilen markerar den och visar ×.
  const sel = tap(ctxOf(d), { x: 180, y: 100 });
  assert.deepEqual(sel.selection, [arrowId]);
  const x = deleteButtonPos(d, sel.selection);
  assert.ok(x);
  const del = tap(ctxOf(d, sel.selection), { x: x.x, y: x.y });
  assert.equal(del.diagram.arrows.length, 0);
  assert.deepEqual(del.selection, []);
  // Ingen × på en låda, och lådor filtreras bort ur det som får raderas.
  assert.equal(deleteButtonPos(d, ["A"]), null);
  assert.deepEqual(deletable(d, ["A", arrowId]), [arrowId]);
  const g = addGroup(d, ["A", "B"]);
  assert.ok(deleteButtonPos(g.diagram, [g.id]));
});

test("markeringsram och shift-tryck markerar flera lådor (för G)", () => {
  const ctx = ctxOf(base());
  const box = gesture(ctx, { x: 40, y: 40 }, { x: 300, y: 160 });
  assert.deepEqual(box.selection.sort(), ["A", "B"]);
  const shift = tap(ctxOf(base(), ["A"]), { x: 420, y: 100 }, { shift: true });
  assert.deepEqual(shift.selection, ["A", "C"]);
  // Tryck på tom yta avmarkerar.
  assert.deepEqual(tap(ctxOf(base(), ["A"], { kind: "box", id: "A" }), { x: 560, y: 380 }).selection, []);
});

test("ångra och gör om för pil, gruppering och lyft ut via gesterna", () => {
  let state = { diagram: base(), past: [], future: [] };
  const apply = (out) => { if (out.diagram !== state.diagram) state = historyReducer(state, { type: "commit", diagram: out.diagram, before: out.before }); };
  apply(gesture(ctxOf(state.diagram), { x: 100, y: 100 }, { x: 262, y: 280 })); // pil A → D
  apply(gesture(ctxOf(state.diagram, ["A"]), { x: 100, y: 100 }, { x: 256, y: 100 })); // grupp {A, B}
  const a = state.diagram.boxes.find((b) => b.id === "A");
  apply(gesture(ctxOf(state.diagram, ["A"]), { x: a.x, y: a.y }, { x: 500, y: 360 })); // lyft ut
  assert.equal(state.past.length, 3);
  assert.equal(state.diagram.groups.length, 0);
  state = historyReducer(state, { type: "undo" });
  assert.equal(state.diagram.groups.length, 1);
  state = historyReducer(state, { type: "undo" });
  assert.equal(state.diagram.groups.length, 0);
  assert.equal(state.diagram.arrows.length, 1);
  state = historyReducer(state, { type: "undo" });
  assert.deepEqual(state.diagram, base());
  state = historyReducer(state, { type: "redo" });
  assert.equal(state.diagram.arrows.length, 1);
});

test("startläget: alla attribut utlagda i rutnät; gamla ritningar normaliseras", () => {
  const g = gridDiagram("A, B, C, D, E, F, G");
  assert.equal(g.boxes.length, 7);
  assert.equal(new Set(g.boxes.map((b) => `${b.x},${b.y}`)).size, 7);
  for (const a of g.boxes) for (const b of g.boxes) if (a.id < b.id) assert.ok(Math.abs(a.x - b.x) >= BOX + 40 || Math.abs(a.y - b.y) >= BOX + 40);
  // Inget sparat → rutnät; låda utan bokstav (frihandsläget) bort; saknade läggs ut.
  assert.equal(normalizeDiagram(null, "A, B").boxes.length, 2);
  assert.equal(normalizeDiagram(emptyDiagram(), "A, B").boxes.length, 2);
  const old = { boxes: [{ id: "x", attr: null, x: 50, y: 50 }, { id: "a", attr: "A", x: 100, y: 100 }], groups: [], arrows: [{ id: "p", from: { kind: "box", id: "x" }, to: { kind: "box", id: "a" } }] };
  const n = normalizeDiagram(old, "A, B, C");
  assert.deepEqual(n.boxes.map((b) => b.attr).sort(), ["A", "B", "C"]);
  assert.equal(n.arrows.length, 0);
  assert.deepEqual(n.boxes.find((b) => b.attr === "A"), { id: "a", attr: "A", x: 100, y: 100 });
});
