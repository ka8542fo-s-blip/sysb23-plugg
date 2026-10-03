// Ritytan: pilar mot beroenden som mängder, autolayouten, ändringar i
// diagrammet och gruppering genom att släppa en ruta på en annan.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  compareDrawing, drawnPairs, arrowTypes, layoutFromFds, removeElements, addGroup, addArrow, placeAll,
  groupRect, boxRect, arrowGeometry, hitTest, BOX, WORLD, emptyDiagram,
  dropOutcome, applyDrop, leaveGroup, joinGroup, historyReducer,
} from "../src/lib/fdDiagram.js";
import { normalizeExercises } from "../src/data/databaser/normalizeExercises.js";

// ---------- Diagrammet mot beroendena ----------

function diagramFor(attrs) {
  return { boxes: attrs.map((a, i) => ({ id: a, attr: a, x: 60 + i * 80, y: 60 })), groups: [], arrows: [] };
}

test("pilar matchas mot beroenden som mängder: A → {B, C} = två pilar, {A, B} → C = en pil från grupp", () => {
  const R = "A, B, C, D";
  const F = ["A → {B, C}", "{A, B} → D"];
  let d = diagramFor(["A", "B", "C", "D"]);
  d = addArrow(d, { kind: "box", id: "A" }, { kind: "box", id: "B" }).diagram;
  d = addArrow(d, { kind: "box", id: "A" }, { kind: "box", id: "C" }).diagram;
  const g = addGroup(d, ["B", "A"]);
  d = addArrow(g.diagram, { kind: "group", id: g.id }, { kind: "box", id: "D" }).diagram;
  const res = compareDrawing(d, R, F);
  assert.equal(res.ok, true, JSON.stringify(res));
  assert.equal(res.correct.length, 3);
  // Gruppens ordning spelar ingen roll, och en pil till en grupp räknas per medlem.
  let e = diagramFor(["A", "B", "C", "D"]);
  const gg = addGroup(e, ["B", "C"]);
  e = addArrow(gg.diagram, { kind: "box", id: "A" }, { kind: "group", id: gg.id }).diagram;
  const ga = addGroup(e, ["A", "B"]);
  e = addArrow(ga.diagram, { kind: "group", id: ga.id }, { kind: "box", id: "D" }).diagram;
  assert.equal(compareDrawing(e, R, F).ok, true);
});

test("kontrollen: saknade, felaktiga (härledda, ej givna) och omärkta", () => {
  const R = "A, B, C";
  const F = ["A → B", "B → C"];
  let d = diagramFor(["A", "B", "C"]);
  d = addArrow(d, { kind: "box", id: "A" }, { kind: "box", id: "B" }).diagram;
  d = addArrow(d, { kind: "box", id: "A" }, { kind: "box", id: "C" }).diagram;
  d = addArrow(d, { kind: "box", id: "C" }, { kind: "box", id: "A" }).diagram;
  const res = compareDrawing(d, R, F);
  assert.equal(res.ok, false);
  assert.deepEqual(res.missing.map((p) => `${p.lhs.join("")}>${p.attr}`), ["B>C"]);
  assert.deepEqual(res.wrong.map((p) => `${p.lhs.join("")}>${p.attr}:${p.reason}`), ["A>C:derived", "C>A:not-given"]);
  // En {A, B}-pil är inte samma sak som två pilar A och B.
  let e = diagramFor(["A", "B", "C"]);
  e = addArrow(e, { kind: "box", id: "A" }, { kind: "box", id: "C" }).diagram;
  e = addArrow(e, { kind: "box", id: "B" }, { kind: "box", id: "C" }).diagram;
  const r2 = compareDrawing(e, R, ["{A, B} → C"]);
  assert.equal(r2.missing.length, 1);
  assert.equal(r2.wrong.length, 2);
  // Omärkt ruta och oplacerat attribut.
  const f = { boxes: [{ id: "x", attr: null, x: 50, y: 50 }, { id: "A", attr: "A", x: 150, y: 50 }], groups: [], arrows: [] };
  const r3 = compareDrawing(f, R, F);
  assert.deepEqual(r3.unlabeled, ["x"]);
  assert.deepEqual(r3.unplaced, ["B", "C"]);
});

test("arrowTypes: partial röd, transitive orange, övriga neutrala", () => {
  const R = "A, B, C, D, E";
  const F = ["{A, B} → C", "B → D", "D → E"];
  const d = layoutFromFds(R, F);
  const types = arrowTypes(d, R, F);
  const byPair = Object.fromEntries(drawnPairs(d).map((p) => [`${p.lhs.join("")}>${p.attr}`, types[p.arrowId] || null]));
  assert.deepEqual(byPair, { "AB>C": null, "B>D": "partial", "D>E": "transitive" });
});

test("Rita från FD:erna ger en ritning som klarar kontrollen, för alla uppgifter", () => {
  for (const item of normalizeExercises) {
    const d = layoutFromFds(item.attrs, item.fds);
    const res = compareDrawing(d, item.attrs, item.fds);
    assert.equal(res.ok, true, `${item.id}: ${JSON.stringify({ missing: res.missing, wrong: res.wrong })}`);
    for (const b of d.boxes) {
      assert.ok(b.x >= BOX / 2 && b.x <= WORLD.w - BOX / 2 && b.y >= BOX / 2 && b.y <= WORLD.h - BOX / 2, `${item.id}: ${b.attr} utanför ytan`);
    }
    // Inga rutor ovanpå varandra.
    for (const a of d.boxes) for (const b of d.boxes) {
      if (a.id < b.id) assert.ok(Math.abs(a.x - b.x) >= BOX || Math.abs(a.y - b.y) >= BOX, `${item.id}: ${a.attr} och ${b.attr} överlappar`);
    }
  }
});

test("autolayouten: nyckeln överst, kedjan nedåt, grupp runt sammansatt determinant", () => {
  const d = layoutFromFds("A, B, C, D, E, F", ["{A, B} → C", "C → D", "D → {E, F}"]);
  const y = Object.fromEntries(d.boxes.map((b) => [b.attr, b.y]));
  assert.equal(y.A, y.B);
  assert.ok(y.A < y.C && y.C < y.D && y.D < y.E && y.E === y.F);
  assert.equal(d.groups.length, 1);
  assert.equal(d.arrows.length, 4);
  // 12:4: nyckeln {A, B} överst trots att C och D också är kandidatnycklar.
  const e = layoutFromFds("A, B, C, D, E, F, G", ["{A, B} → C", "C → {A, B, D}", "D → {C, E}", "E → F", "F → G"]);
  const ey = Object.fromEntries(e.boxes.map((b) => [b.attr, b.y]));
  assert.ok(ey.A === ey.B && ey.A < ey.C);
});

test("radera: en ruta tar med sina pilar, en grupp som krymper under två rutor försvinner", () => {
  let d = diagramFor(["A", "B", "C"]);
  const g = addGroup(d, ["A", "B"]);
  d = addArrow(g.diagram, { kind: "group", id: g.id }, { kind: "box", id: "C" }).diagram;
  d = addArrow(d, { kind: "box", id: "C" }, { kind: "box", id: "A" }).diagram;
  const after = removeElements(d, ["B"]);
  assert.equal(after.groups.length, 0);
  assert.equal(after.arrows.length, 1);
  assert.equal(after.boxes.length, 2);
  // Inga pilar från en ruta till dess egen grupp, inga dubbletter.
  assert.equal(addArrow(g.diagram, { kind: "box", id: "A" }, { kind: "group", id: g.id }).id, null);
  const twice = addArrow(addArrow(d, { kind: "box", id: "A" }, { kind: "box", id: "C" }).diagram, { kind: "box", id: "A" }, { kind: "box", id: "C" });
  assert.equal(twice.diagram.arrows.length, d.arrows.length + 1);
});

test("geometri: grupp omsluter sina rutor, nästlad grupp ritas större, pilar slutar på kanten", () => {
  let d = diagramFor(["A", "B", "C"]);
  const inner = addGroup(d, ["A", "B"]);
  const outer = addGroup(inner.diagram, ["A", "B", "C"]);
  d = outer.diagram;
  const ri = groupRect(d.groups[0], d);
  const ro = groupRect(d.groups[1], d);
  const ra = boxRect(d.boxes[0]);
  assert.ok(ri.x < ra.x && ri.y < ra.y);
  assert.ok(ro.y < ri.y, "den yttre gruppen har större marginal");
  d = addArrow(d, { kind: "box", id: "A" }, { kind: "box", id: "C" }).diagram;
  const geo = arrowGeometry(d.arrows[0], d);
  assert.equal(geo.kind, "curve", "pilen A → C går runt B");
  assert.ok(Math.abs(geo.p1.x - (60 + BOX / 2)) < 1 || geo.p1.y < 60, "pilen startar på A:s kant");
  // Träffprov: ruta före grupp.
  assert.deepEqual(hitTest({ x: 60, y: 60 }, d), { kind: "box", id: "A" });
  assert.equal(hitTest({ x: 140, y: 60 - BOX / 2 - 5 }, d).kind, "group");
  assert.equal(hitTest({ x: 600, y: 400 }, d), null);
});

test("pilar åt båda hållen blir symmetriska: raka, parallella, lika långt från mittlinjen", () => {
  for (const [bx, by] of [[200, 60], [60, 200], [180, 170]]) {
    let d = { boxes: [{ id: "A", attr: "A", x: 60, y: 60 }, { id: "B", attr: "B", x: bx, y: by }], groups: [], arrows: [] };
    d = addArrow(d, { kind: "box", id: "A" }, { kind: "box", id: "B" }).diagram;
    d = addArrow(d, { kind: "box", id: "B" }, { kind: "box", id: "A" }).diagram;
    const [ab, ba] = d.arrows.map((a) => arrowGeometry(a, d));
    assert.equal(ab.kind, "line");
    assert.equal(ba.kind, "line");
    // Signerat avstånd från mittlinjen A→B: lika stort, motsatt tecken.
    const len = Math.hypot(bx - 60, by - 60);
    const side = (p) => ((bx - 60) * (p.y - 60) - (by - 60) * (p.x - 60)) / len;
    assert.ok(Math.abs(side(ab.mid) + side(ba.mid)) < 1e-6, `${bx},${by}: inte symmetriskt`);
    assert.ok(Math.abs(side(ab.mid)) > 5, "pilarna ligger inte isär");
    // Pilarna börjar och slutar på rutornas kanter.
    const onEdge = (p, c) => Math.abs(Math.max(Math.abs(p.x - c.x), Math.abs(p.y - c.y)) - BOX / 2) < 1e-6;
    assert.ok(onEdge(ab.p1, { x: 60, y: 60 }) && onEdge(ab.p2, { x: bx, y: by }));
    assert.ok(onEdge(ba.p1, { x: bx, y: by }) && onEdge(ba.p2, { x: 60, y: 60 }));
  }
});

test("placeAll på en tom yta ger ett kompakt rutnät (högst tre per rad)", () => {
  const d = placeAll(emptyDiagram(), ["A", "B", "C", "D", "E", "F", "G"]);
  assert.equal(d.boxes.length, 7);
  const rows = new Set(d.boxes.map((b) => b.y));
  assert.equal(rows.size, 3);
  const xs = d.boxes.map((b) => b.x);
  assert.ok(Math.max(...xs) - Math.min(...xs) <= 2 * 130, "högst tre i bredd");
  for (const a of d.boxes) for (const b of d.boxes) if (a.id < b.id) assert.ok(Math.abs(a.x - b.x) >= BOX || Math.abs(a.y - b.y) >= BOX);
});

test("placeAll lägger ut de attribut som saknas utan att flytta de som finns", () => {
  const d = placeAll({ ...emptyDiagram(), boxes: [{ id: "x", attr: "B", x: 60, y: 56 }] }, ["A", "B", "C"]);
  assert.equal(d.boxes.length, 3);
  assert.deepEqual(d.boxes[0], { id: "x", attr: "B", x: 60, y: 56 });
  const pos = new Set(d.boxes.map((b) => `${b.x},${b.y}`));
  assert.equal(pos.size, 3);
});

// ---------- Gruppera genom att släppa en ruta på en annan ----------

const moveBox = (d, id, x, y) => ({ ...d, boxes: d.boxes.map((b) => (b.id === id ? { ...b, x, y } : b)) });
const drop = (start, id, x, y) => {
  const moved = moveBox(start, id, x, y);
  const o = dropOutcome(moved, id, start);
  return { o, next: applyDrop(moved, id, o, start) };
};
const noOverlap = (d) => d.boxes.every((a) => d.boxes.every((b) => a.id >= b.id || Math.abs(a.x - b.x) >= BOX || Math.abs(a.y - b.y) >= BOX));
const four = () => ({
  boxes: [{ id: "A", attr: "A", x: 80, y: 80 }, { id: "B", attr: "B", x: 240, y: 80 }, { id: "C", attr: "C", x: 400, y: 80 }, { id: "D", attr: "D", x: 240, y: 260 }],
  groups: [], arrows: [],
});

test("släpp A på B: ny grupp {A, B}, A läggs bredvid B", () => {
  const { o, next } = drop(four(), "A", 235, 85);
  assert.deepEqual(o, { target: { kind: "box", id: "B" }, leave: [] });
  assert.equal(next.groups.length, 1);
  assert.deepEqual([...next.groups[0].members].sort(), ["A", "B"]);
  assert.ok(noOverlap(next), "rutorna ligger ovanpå varandra");
  const a = next.boxes.find((b) => b.id === "A");
  assert.ok(a.x < 240 && a.y === 80, "A kom från vänster och hamnar till vänster om B");
});

test("mittpunkten utanför målrutan är en vanlig flytt", () => {
  // A:s ruta överlappar B men mittpunkten ligger utanför B.
  const { o, next } = drop(four(), "A", 240 - BOX / 2 - 6, 80);
  assert.equal(o.target, null);
  assert.equal(next.groups.length, 0);
  assert.equal(next.boxes.find((b) => b.id === "A").x, 240 - BOX / 2 - 6);
});

test("släpp C på en befintlig grupp: C läggs till, pilar från gruppen följer med", () => {
  let d = four();
  const g = addGroup(d, ["A", "B"]);
  d = addArrow(g.diagram, { kind: "group", id: g.id }, { kind: "box", id: "D" }).diagram;
  d = addArrow(d, { kind: "group", id: g.id }, { kind: "box", id: "C" }).diagram;
  d = addArrow(d, { kind: "box", id: "D" }, { kind: "box", id: "C" }).diagram;
  const r = groupRect(d.groups[0], d);
  // Inne i gruppens ram men på ingen av dess rutor: i marginalen under A.
  const { o, next } = drop(d, "C", 80, r.y + r.h - 3);
  assert.deepEqual(o.target, { kind: "group", id: g.id });
  assert.deepEqual([...next.groups[0].members].sort(), ["A", "B", "C"]);
  // Gruppen → D ligger kvar; gruppen → C (nu en egen medlem) tas bort; D → C ligger kvar på rutan.
  assert.deepEqual(next.arrows.map((a) => `${a.from.id}>${a.to.id}`).sort(), [`${g.id}>D`, "D>C"].sort());
  assert.ok(noOverlap(next));
});

test("dra ut en ruta ur en grupp: den lämnar gruppen, gruppen och dess pilar finns kvar", () => {
  let d = four();
  const g = addGroup(d, ["A", "B", "C"]);
  d = addArrow(g.diagram, { kind: "group", id: g.id }, { kind: "box", id: "D" }).diagram;
  const { o, next } = drop(d, "C", 500, 330);
  assert.deepEqual(o, { target: null, leave: [g.id] });
  assert.deepEqual([...next.groups[0].members].sort(), ["A", "B"]);
  assert.equal(next.arrows[0].from.id, g.id);
  // En flytt inom gruppens ram lämnar den inte.
  assert.deepEqual(drop(d, "C", 380, 90).o.leave, []);
});

test("en grupp med en enda ruta kvar upplöses; pilarna flyttas till rutan", () => {
  let d = four();
  const g = addGroup(d, ["A", "B"]);
  d = addArrow(g.diagram, { kind: "group", id: g.id }, { kind: "box", id: "D" }).diagram;
  d = addArrow(d, { kind: "box", id: "C" }, { kind: "group", id: g.id }).diagram;
  const { next } = drop(d, "A", 80, 380);
  assert.equal(next.groups.length, 0);
  assert.deepEqual(next.arrows.map((a) => `${a.from.id}>${a.to.id}`).sort(), ["B>D", "C>B"]);
  // Direkt anrop, och en pil som skulle peka på sig själv försvinner.
  const e = addArrow(addGroup(four(), ["A", "B"]).diagram, { kind: "box", id: "A" }, { kind: "box", id: "C" }).diagram;
  const gid = e.groups[0].id;
  const f = addArrow(e, { kind: "group", id: gid }, { kind: "box", id: "A" }).diagram;
  assert.deepEqual(leaveGroup(f, "B", gid).arrows.map((a) => `${a.from.id}>${a.to.id}`), ["A>C"]);
});

test("lyft ur en grupp och släpp på en annan ruta i samma drag", () => {
  const g = addGroup(four(), ["A", "B"]);
  const { o, next } = drop(g.diagram, "A", 245, 255);
  assert.deepEqual(o, { target: { kind: "box", id: "D" }, leave: [g.id] });
  assert.equal(next.groups.length, 1);
  assert.deepEqual([...next.groups[0].members].sort(), ["A", "D"]);
  assert.ok(noOverlap(next));
});

test("joinGroup lägger inte till en dubblett av en annan grupp", () => {
  let d = addGroup(four(), ["A", "B"]).diagram;
  d = addGroup(d, ["A", "B", "C"]).diagram;
  const small = d.groups.find((x) => x.members.length === 2);
  assert.equal(joinGroup(d, "C", small.id), d);
});

test("ångra och gör om fungerar för gruppera, lägga till och lyfta ut", () => {
  let state = { diagram: four(), past: [], future: [] };
  const steps = [];
  const commit = (next, before) => { state = historyReducer(state, { type: "commit", diagram: next, before }); steps.push(state.diagram); };
  // Dragningen uppdaterar diagrammet live; släppet sparas med läget före dragningen.
  const dragDrop = (id, x, y) => {
    const before = state.diagram;
    const moved = moveBox(before, id, x, y);
    state = historyReducer(state, { type: "live", diagram: moved });
    commit(applyDrop(moved, id, dropOutcome(moved, id, before), before), before);
  };
  dragDrop("A", 235, 85); // gruppera {A, B}
  const r = groupRect(state.diagram.groups[0], state.diagram);
  dragDrop("C", r.x + r.w - 3, 80); // lägg till C
  dragDrop("C", 500, 330); // lyft ut C igen
  assert.equal(state.past.length, 3);
  const members = (d) => d.groups.map((g) => [...g.members].sort().join("")).join("|");
  assert.equal(members(state.diagram), "AB");
  state = historyReducer(state, { type: "undo" });
  assert.equal(members(state.diagram), "ABC");
  state = historyReducer(state, { type: "undo" });
  assert.equal(members(state.diagram), "AB");
  state = historyReducer(state, { type: "undo" });
  assert.equal(members(state.diagram), "");
  assert.deepEqual(state.diagram, four());
  state = historyReducer(state, { type: "redo" });
  state = historyReducer(state, { type: "redo" });
  assert.equal(members(state.diagram), "ABC");
  state = historyReducer(state, { type: "redo" });
  assert.equal(members(state.diagram), "AB");
  assert.equal(historyReducer(state, { type: "redo" }), state, "inget mer att göra om");
});
