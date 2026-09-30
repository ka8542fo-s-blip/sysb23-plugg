// Ritytan: streckklassificering med syntetiska streck, pilar mot beroenden
// som mängder, autolayouten och ändringar i diagrammet.
import { test } from "node:test";
import assert from "node:assert/strict";
import { classifyStroke, features } from "../src/lib/strokes.js";
import {
  compareDrawing, drawnPairs, arrowTypes, layoutFromFds, removeElements, addGroup, addArrow, placeAll,
  groupRect, boxRect, arrowGeometry, hitTest, BOX, WORLD, emptyDiagram,
} from "../src/lib/fdDiagram.js";
import { normalizeExercises } from "../src/data/databaser/normalizeExercises.js";

// ---------- Syntetiska streck ----------

// Deterministisk slump, så att testet ger samma streck varje gång.
function rng(seed) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}
const jitter = (pts, amount, seed = 1) => {
  const r = rng(seed);
  return pts.map((p) => ({ x: p.x + (r() - 0.5) * 2 * amount, y: p.y + (r() - 0.5) * 2 * amount }));
};
const line = (a, b, n = 20) => Array.from({ length: n + 1 }, (_, i) => ({ x: a.x + ((b.x - a.x) * i) / n, y: a.y + ((b.y - a.y) * i) / n }));
const polyline = (corners, n = 12) => corners.slice(1).flatMap((c, i) => line(corners[i], c, n).slice(i ? 1 : 0));
const rectStroke = (x, y, w, h, overshoot = 0) => polyline([{ x, y }, { x: x + w, y }, { x: x + w, y: y + h }, { x, y: y + h }, { x, y: y + overshoot }]);
const ellipse = (cx, cy, rx, ry, n = 40, from = 0, sweep = 2 * Math.PI) =>
  Array.from({ length: n + 1 }, (_, i) => ({ x: cx + rx * Math.cos(from + (sweep * i) / n), y: cy + ry * Math.sin(from + (sweep * i) / n) }));
const zigzag = (x, y, w, h, times) => polyline(Array.from({ length: times * 2 + 1 }, (_, i) => ({ x: x + (i % 2 ? w : 0), y: y + (h * i) / (times * 2) })), 6);

// Scen: A och B bredvid varandra i en grupp, C under, D för sig.
const rect = (cx, cy) => ({ x: cx - BOX / 2, y: cy - BOX / 2, w: BOX, h: BOX });
const scene = {
  boxes: [
    { id: "A", rect: rect(100, 80) },
    { id: "B", rect: rect(180, 80) },
    { id: "C", rect: rect(140, 220) },
    { id: "D", rect: rect(400, 220) },
  ],
  groups: [{ id: "G", rect: { x: 100 - BOX / 2 - 10, y: 80 - BOX / 2 - 10, w: 80 + BOX + 20, h: BOX + 20 }, members: ["A", "B"] }],
  arrows: [{ id: "arrowCD", p1: { x: 163, y: 220 }, p2: { x: 377, y: 220 } }],
};

test("box: en ungefärlig fyrkant på en tom plats blir en ruta", () => {
  for (const [i, pts] of [
    rectStroke(480, 60, 50, 46),
    jitter(rectStroke(480, 60, 50, 46, 6), 3, 7),
    ellipse(510, 90, 30, 26),
    jitter(ellipse(510, 90, 28, 24, 40, 0.3, 2 * Math.PI - 0.25), 2, 3),
    rectStroke(470, 300, 90, 60),
  ].entries()) {
    const r = classifyStroke(pts, scene);
    assert.equal(r.kind, "box", `fall ${i}: ${JSON.stringify(r)} ${JSON.stringify(features(pts), ["ratio", "gap", "winding", "reversals"])}`);
  }
  const r = classifyStroke(rectStroke(480, 60, 50, 46), scene);
  assert.ok(Math.abs(r.center.x - 505) < 2 && Math.abs(r.center.y - 83) < 2);
});

test("group: en slinga runt två rutor blir en sammansatt determinant", () => {
  const r = classifyStroke(jitter(ellipse(140, 80, 95, 45), 3, 2), scene);
  assert.equal(r.kind, "group");
  assert.deepEqual(r.members.sort(), ["A", "B"]);
  const s = classifyStroke(rectStroke(60, 40, 170, 230), scene);
  assert.equal(s.kind, "group");
  assert.deepEqual(s.members.sort(), ["A", "B", "C"]);
});

test("arrow: ett streck från en ruta till en annan blir en pil", () => {
  // Från C till D, med och utan pilhuvud i samma streck.
  assert.deepEqual(classifyStroke(line({ x: 150, y: 215 }, { x: 395, y: 205 }), scene), { kind: "arrow", from: { kind: "box", id: "C" }, to: { kind: "box", id: "D" } });
  const hooked = [...line({ x: 150, y: 230 }, { x: 390, y: 228 }), { x: 380, y: 218 }, { x: 390, y: 228 }, { x: 380, y: 238 }];
  assert.equal(classifyStroke(jitter(hooked, 1.5, 5), scene).kind, "arrow");
  // Börjar strax utanför rutan: snäpps till den.
  const near = classifyStroke(line({ x: 140, y: 255 }, { x: 405, y: 250 }), scene);
  assert.deepEqual([near.from.id, near.to.id], ["C", "D"]);
  // Från gruppens ram (inte inne i A eller B) till C: pilen går från gruppen.
  const fromGroup = classifyStroke(line({ x: 140, y: 118 }, { x: 140, y: 205 }), scene);
  assert.deepEqual(fromGroup.from, { kind: "group", id: "G" });
  assert.deepEqual(fromGroup.to, { kind: "box", id: "C" });
  // Inne i A till C: pilen går från A.
  assert.deepEqual(classifyStroke(line({ x: 100, y: 90 }, { x: 138, y: 210 }), scene).from, { kind: "box", id: "A" });
  // Svagt böjt streck.
  const quad = (a, c, b, n = 30) => Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    return { x: (1 - t) ** 2 * a.x + 2 * (1 - t) * t * c.x + t * t * b.x, y: (1 - t) ** 2 * a.y + 2 * (1 - t) * t * c.y + t * t * b.y };
  });
  const bent = jitter(quad({ x: 150, y: 212 }, { x: 270, y: 120 }, { x: 392, y: 212 }), 2, 11);
  assert.equal(classifyStroke(bent, { ...scene, groups: [] }).kind, "arrow", JSON.stringify(features(bent), ["ratio"]));
});

test("erase: klotter över ett element raderar det", () => {
  const r = classifyStroke(zigzag(385, 200, 30, 40, 4), scene);
  assert.equal(r.kind, "erase");
  assert.ok(r.ids.includes("D"));
  const overArrow = classifyStroke(zigzag(260, 205, 40, 30, 4), scene);
  assert.deepEqual(overArrow, { kind: "erase", ids: ["arrowCD"] });
});

test("unknown: det som inte känns igen", () => {
  // Kort streck, klotter på tom yta, öppen båge i tomma luften, slinga runt en enda ruta,
  // pil som bara börjar vid en ruta, jättestor slinga på tom yta.
  const cases = [
    line({ x: 500, y: 350 }, { x: 505, y: 352 }),
    zigzag(520, 320, 30, 40, 4),
    ellipse(520, 150, 40, 40, 20, 0, Math.PI),
    ellipse(400, 220, 40, 40),
    line({ x: 400, y: 245 }, { x: 560, y: 390 }),
    rectStroke(300, 20, 320, 60),
  ];
  cases.forEach((pts, i) => assert.equal(classifyStroke(pts, scene).kind, "unknown", `fall ${i}`));
});

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

test("placeAll lägger ut de attribut som saknas utan att flytta de som finns", () => {
  const d = placeAll({ ...emptyDiagram(), boxes: [{ id: "x", attr: "B", x: 60, y: 56 }] }, ["A", "B", "C"]);
  assert.equal(d.boxes.length, 3);
  assert.deepEqual(d.boxes[0], { id: "x", attr: "B", x: 60, y: 56 });
  const pos = new Set(d.boxes.map((b) => `${b.x},${b.y}`));
  assert.equal(pos.size, 3);
});
