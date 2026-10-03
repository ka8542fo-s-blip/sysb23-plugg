// Ritytan för beroendediagram i Björns tavelstil: en ruta per attribut,
// pilar från determinant till beroende attribut, och en omslutande ruta
// (grupp) runt en sammansatt determinant. Här finns modellen, geometrin,
// jämförelsen mot de givna beroendena och autolayouten — allt utan React,
// så att det går att testa.
//
// Diagrammet: { boxes: [{ id, attr, x, y }], groups: [{ id, members }],
//               arrows: [{ id, from: { kind, id }, to: { kind, id } }] }
// x och y är rutans mittpunkt i världskoordinater.
import { allCandidateKeys, toFds, has, subset, closure, dependencyType, attrsOf, setText } from "./fd.js";

export const WORLD = { w: 640, h: 420 };
export const BOX = 46;
const GROUP_PAD = 10;
const GROUP_STEP = 8;

export const emptyDiagram = () => ({ boxes: [], groups: [], arrows: [] });

let counter = 0;
export const newId = (prefix) => `${prefix}${Date.now().toString(36)}${(counter++).toString(36)}`;

// ---------- Geometri ----------

export const boxRect = (b) => ({ x: b.x - BOX / 2, y: b.y - BOX / 2, w: BOX, h: BOX });

// Grupper som omsluter andra gruppers alla medlemmar ritas en nivå större,
// så att {A, B} och {A, B, C} går att skilja åt.
export function groupRect(group, diagram) {
  const members = diagram.boxes.filter((b) => group.members.includes(b.id));
  if (!members.length) return null;
  const nested = diagram.groups.filter((g) => g.id !== group.id && g.members.length < group.members.length && g.members.every((m) => group.members.includes(m))).length;
  const pad = GROUP_PAD + GROUP_STEP * nested;
  const xs = members.flatMap((b) => [b.x - BOX / 2, b.x + BOX / 2]);
  const ys = members.flatMap((b) => [b.y - BOX / 2, b.y + BOX / 2]);
  const x = Math.min(...xs) - pad;
  const y = Math.min(...ys) - pad;
  return { x, y, w: Math.max(...xs) + pad - x, h: Math.max(...ys) + pad - y };
}

export function shapeRect(ref, diagram) {
  if (!ref) return null;
  if (ref.kind === "box") {
    const b = diagram.boxes.find((x) => x.id === ref.id);
    return b ? boxRect(b) : null;
  }
  const g = diagram.groups.find((x) => x.id === ref.id);
  return g ? groupRect(g, diagram) : null;
}

const center = (r) => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });
const inside = (p, r, tol = 0) => p.x >= r.x - tol && p.x <= r.x + r.w + tol && p.y >= r.y - tol && p.y <= r.y + r.h + tol;

// Punkten där strålen från rektangelns mitt mot `toward` lämnar rektangeln.
function exitPoint(r, toward) {
  const c = center(r);
  const dx = toward.x - c.x;
  const dy = toward.y - c.y;
  if (dx === 0 && dy === 0) return c;
  const sx = dx !== 0 ? (r.w / 2) / Math.abs(dx) : Infinity;
  const sy = dy !== 0 ? (r.h / 2) / Math.abs(dy) : Infinity;
  const s = Math.min(sx, sy);
  return { x: c.x + dx * s, y: c.y + dy * s };
}

function segmentHitsRect(a, b, r) {
  // Provar punkter längs sträckan — räcker för rutor av den här storleken.
  for (let t = 0.08; t <= 0.92; t += 0.04) {
    if (inside({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }, r, 2)) return true;
  }
  return false;
}

// Pilens form: rak mellan kanterna, förskjuten om en pil går åt motsatt håll
// mellan samma par, och böjd om den annars skulle gå rakt genom en annan ruta.
export function arrowGeometry(arrow, diagram) {
  const from = shapeRect(arrow.from, diagram);
  const to = shapeRect(arrow.to, diagram);
  if (!from || !to) return null;
  const c1 = center(from);
  const c2 = center(to);
  const dx = c2.x - c1.x;
  const dy = c2.y - c1.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const reverse = diagram.arrows.some((a) => a.id !== arrow.id && a.from.id === arrow.to.id && a.to.id === arrow.from.id);
  const skip = new Set([arrow.from.id, arrow.to.id]);
  if (arrow.from.kind === "group") for (const m of diagram.groups.find((g) => g.id === arrow.from.id)?.members || []) skip.add(m);
  if (arrow.to.kind === "group") for (const m of diagram.groups.find((g) => g.id === arrow.to.id)?.members || []) skip.add(m);
  const blockers = diagram.boxes.filter((b) => !skip.has(b.id)).map(boxRect);
  const blocked = blockers.some((r) => segmentHitsRect(c1, c2, r));

  // Normalen (nx, ny) vänder med pilens riktning, så ett par åt båda hållen
  // hamnar automatiskt på var sin sida om mittlinjen — symmetriskt.
  if (blocked) {
    const bend = 46;
    const ctrl = { x: (c1.x + c2.x) / 2 + nx * bend, y: (c1.y + c2.y) / 2 + ny * bend };
    const p1 = exitPoint(from, ctrl);
    const p2 = exitPoint(to, ctrl);
    return { kind: "curve", p1, p2, ctrl, d: `M ${p1.x} ${p1.y} Q ${ctrl.x} ${ctrl.y} ${p2.x} ${p2.y}`, mid: { x: 0.25 * p1.x + 0.5 * ctrl.x + 0.25 * p2.x, y: 0.25 * p1.y + 0.5 * ctrl.y + 0.25 * p2.y } };
  }
  // Åt båda hållen: två raka, parallella pilar förskjutna lika långt åt var
  // sitt håll. Annars en rak pil mellan mittpunkterna.
  const off = reverse ? 7 : 0;
  const s1 = { x: c1.x + nx * off, y: c1.y + ny * off };
  const s2 = { x: c2.x + nx * off, y: c2.y + ny * off };
  const p1 = rayExit(from, s1, { x: dx, y: dy });
  const p2 = rayExit(to, s2, { x: -dx, y: -dy });
  return { kind: "line", p1, p2, d: `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`, mid: { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 } };
}

// Punkten där strålen från p (inne i rektangeln) i riktning d lämnar den.
function rayExit(r, p, d) {
  const sx = d.x > 0 ? (r.x + r.w - p.x) / d.x : d.x < 0 ? (r.x - p.x) / d.x : Infinity;
  const sy = d.y > 0 ? (r.y + r.h - p.y) / d.y : d.y < 0 ? (r.y - p.y) / d.y : Infinity;
  const t = Math.max(0, Math.min(sx, sy));
  return { x: p.x + d.x * t, y: p.y + d.y * t };
}

function distToSegment(p, a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const l2 = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / l2));
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

export function distToArrow(p, geo) {
  if (!geo) return Infinity;
  if (geo.kind === "line") return distToSegment(p, geo.p1, geo.p2);
  let best = Infinity;
  let prev = geo.p1;
  for (let i = 1; i <= 16; i++) {
    const t = i / 16;
    const q = {
      x: (1 - t) ** 2 * geo.p1.x + 2 * (1 - t) * t * geo.ctrl.x + t * t * geo.p2.x,
      y: (1 - t) ** 2 * geo.p1.y + 2 * (1 - t) * t * geo.ctrl.y + t * t * geo.p2.y,
    };
    best = Math.min(best, distToSegment(p, prev, q));
    prev = q;
  }
  return best;
}

// Vad som ligger under en punkt: ruta före pil före grupp. En punkt inne i
// gruppen men utanför dess rutor är gruppen själv.
export function hitTest(p, diagram, tol = 6) {
  const box = [...diagram.boxes].reverse().find((b) => inside(p, boxRect(b), tol / 2));
  if (box) return { kind: "box", id: box.id };
  let best = null;
  for (const a of diagram.arrows) {
    const d = distToArrow(p, arrowGeometry(a, diagram));
    if (d <= tol + 2 && (!best || d < best.d)) best = { d, id: a.id };
  }
  if (best) return { kind: "arrow", id: best.id };
  // Den minsta gruppen som innehåller punkten vinner.
  const groups = diagram.groups
    .map((g) => ({ g, r: groupRect(g, diagram) }))
    .filter(({ r }) => r && inside(p, r, tol / 2))
    .sort((a, b) => a.r.w * a.r.h - b.r.w * b.r.h);
  if (groups.length) return { kind: "group", id: groups[0].g.id };
  return null;
}

// ---------- Ändringar ----------

export function removeElements(diagram, ids) {
  const doomed = new Set(ids);
  const boxes = diagram.boxes.filter((b) => !doomed.has(b.id));
  const boxIds = new Set(boxes.map((b) => b.id));
  let groups = diagram.groups
    .filter((g) => !doomed.has(g.id))
    .map((g) => ({ ...g, members: g.members.filter((m) => boxIds.has(m)) }));
  // En grupp med färre än två rutor är ingen sammansatt determinant längre.
  groups = groups.filter((g) => g.members.length >= 2);
  const alive = new Set([...boxIds, ...groups.map((g) => g.id)]);
  const arrows = diagram.arrows.filter((a) => !doomed.has(a.id) && alive.has(a.from.id) && alive.has(a.to.id));
  return { boxes, groups, arrows };
}

export function addGroup(diagram, memberIds) {
  const members = [...new Set(memberIds)].filter((id) => diagram.boxes.some((b) => b.id === id));
  if (members.length < 2) return { diagram, id: null };
  const existing = diagram.groups.find((g) => g.members.length === members.length && g.members.every((m) => members.includes(m)));
  if (existing) return { diagram, id: existing.id };
  const id = newId("g");
  return { diagram: { ...diagram, groups: [...diagram.groups, { id, members }] }, id };
}

export function addArrow(diagram, from, to) {
  if (!from || !to || from.id === to.id) return { diagram, id: null };
  if (from.kind === "box" && to.kind === "group") {
    const g = diagram.groups.find((x) => x.id === to.id);
    if (g?.members.includes(from.id)) return { diagram, id: null };
  }
  const existing = diagram.arrows.find((a) => a.from.id === from.id && a.to.id === to.id);
  if (existing) return { diagram, id: existing.id };
  const id = newId("a");
  return { diagram: { ...diagram, arrows: [...diagram.arrows, { id, from: { kind: from.kind, id: from.id }, to: { kind: to.kind, id: to.id } }] }, id };
}

// ---------- Gruppera genom att släppa en ruta på en annan ----------

// Vad som händer när en enda ruta släpps: `target` är rutan eller gruppen
// dess mittpunkt ligger inom (ruta före grupp, minsta gruppen först), och
// `leave` är de grupper den dragits ut ur — mittpunkten utanför gruppens
// ram som den var när dragningen började. Ramen i början räknas med rutan
// själv, så att en flytt inom gruppen inte lämnar den.
export function dropOutcome(diagram, boxId, startDiagram = diagram) {
  const box = diagram.boxes.find((b) => b.id === boxId);
  if (!box) return { target: null, leave: [] };
  const c = { x: box.x, y: box.y };
  const leave = startDiagram.groups
    .filter((g) => g.members.includes(boxId))
    .filter((g) => {
      const r = groupRect(g, startDiagram);
      return r && !inside(c, r);
    })
    .map((g) => g.id);
  let target = null;
  const onBox = diagram.boxes.find((b) => b.id !== boxId && inside(c, boxRect(b)));
  if (onBox) target = { kind: "box", id: onBox.id };
  else {
    const group = diagram.groups
      .filter((g) => !g.members.includes(boxId))
      .map((g) => ({ g, r: groupRect(g, diagram) }))
      .filter(({ r }) => r && inside(c, r))
      .sort((a, b) => a.r.w * a.r.h - b.r.w * b.r.h)[0];
    if (group) target = { kind: "group", id: group.g.id };
  }
  return { target, leave };
}

// Lägg rutan bredvid en annan ruta, på den sida den kom från, på första
// lediga plats.
function placeBeside(diagram, boxId, anchor, fromLeft) {
  const step = BOX + 16;
  const spots = [
    { x: anchor.x + (fromLeft ? -step : step), y: anchor.y },
    { x: anchor.x + (fromLeft ? step : -step), y: anchor.y },
    { x: anchor.x, y: anchor.y + step },
    { x: anchor.x, y: anchor.y - step },
  ].map(clampPoint);
  const free = (p) => !diagram.boxes.some((b) => b.id !== boxId && Math.abs(b.x - p.x) < BOX + 4 && Math.abs(b.y - p.y) < BOX + 4);
  const spot = spots.find(free) || spots[0];
  return { ...diagram, boxes: diagram.boxes.map((b) => (b.id === boxId ? { ...b, ...spot } : b)) };
}

// Rutan lämnar en grupp. Blir en enda ruta kvar upplöses gruppen, och
// gruppens pilar flyttas till den rutan (dubbletter slås ihop).
export function leaveGroup(diagram, boxId, groupId) {
  const g = diagram.groups.find((x) => x.id === groupId);
  if (!g || !g.members.includes(boxId)) return diagram;
  const members = g.members.filter((m) => m !== boxId);
  if (members.length >= 2) return { ...diagram, groups: diagram.groups.map((x) => (x.id === groupId ? { ...x, members } : x)) };
  const rest = members[0];
  let next = { ...diagram, groups: diagram.groups.filter((x) => x.id !== groupId), arrows: diagram.arrows.filter((a) => a.from.id !== groupId && a.to.id !== groupId) };
  if (rest) {
    for (const a of diagram.arrows) {
      if (a.from.id !== groupId && a.to.id !== groupId) continue;
      const from = a.from.id === groupId ? { kind: "box", id: rest } : a.from;
      const to = a.to.id === groupId ? { kind: "box", id: rest } : a.to;
      if (from.id === to.id) continue;
      if (next.arrows.some((x) => x.from.id === from.id && x.to.id === to.id)) continue;
      next = { ...next, arrows: [...next.arrows, { id: a.id, from, to }] };
    }
  }
  return next;
}

// Rutan läggs till i en befintlig grupp. Pilar mellan gruppen och rutan
// blir meningslösa (en determinant som pekar på sig själv) och tas bort.
export function joinGroup(diagram, boxId, groupId) {
  const g = diagram.groups.find((x) => x.id === groupId);
  if (!g || g.members.includes(boxId)) return diagram;
  const members = [...g.members, boxId];
  const twin = diagram.groups.find((x) => x.id !== groupId && x.members.length === members.length && members.every((m) => x.members.includes(m)));
  if (twin) return diagram;
  return {
    ...diagram,
    groups: diagram.groups.map((x) => (x.id === groupId ? { ...x, members } : x)),
    arrows: diagram.arrows.filter((a) => !((a.from.id === groupId && a.to.id === boxId) || (a.from.id === boxId && a.to.id === groupId))),
  };
}

// Släppet som en ändring: lämna grupper först, sedan gruppera med målet.
// Rutan läggs bredvid målet så att inga rutor hamnar ovanpå varandra.
export function applyDrop(diagram, boxId, { target, leave }, startDiagram = diagram) {
  let next = diagram;
  for (const gid of leave) next = leaveGroup(next, boxId, gid);
  if (!target) return next;
  const start = startDiagram.boxes.find((b) => b.id === boxId);
  if (target.kind === "box") {
    const anchor = next.boxes.find((b) => b.id === target.id);
    if (!anchor) return next;
    next = addGroup(next, [boxId, target.id]).diagram;
    return placeBeside(next, boxId, anchor, (start?.x ?? anchor.x) < anchor.x);
  }
  const g = next.groups.find((x) => x.id === target.id);
  if (!g) return next;
  const box = next.boxes.find((b) => b.id === boxId);
  const members = next.boxes.filter((b) => g.members.includes(b.id));
  next = joinGroup(next, boxId, target.id);
  const anchor = [...members].sort((a, b) => Math.hypot(a.x - box.x, a.y - box.y) - Math.hypot(b.x - box.x, b.y - box.y))[0];
  return anchor ? placeBeside(next, boxId, anchor, box.x < anchor.x) : next;
}

// ---------- Historik (ångra/gör om) ----------

export function historyReducer(state, action) {
  switch (action.type) {
    case "commit":
      if (action.diagram === (action.before ?? state.diagram)) return { ...state, diagram: action.diagram };
      return { diagram: action.diagram, past: [...state.past, action.before ?? state.diagram].slice(-100), future: [] };
    case "live":
      return { ...state, diagram: action.diagram };
    case "undo":
      if (!state.past.length) return state;
      return { diagram: state.past[state.past.length - 1], past: state.past.slice(0, -1), future: [state.diagram, ...state.future] };
    case "redo":
      if (!state.future.length) return state;
      return { diagram: state.future[0], past: [...state.past, state.diagram], future: state.future.slice(1) };
    default:
      return state;
  }
}

const clampX = (x) => Math.max(BOX / 2 + 4, Math.min(WORLD.w - BOX / 2 - 4, x));
const clampY = (y) => Math.max(BOX / 2 + 4, Math.min(WORLD.h - BOX / 2 - 4, y));
export const clampPoint = (p) => ({ x: clampX(p.x), y: clampY(p.y) });

// Nästa lediga plats i ett rutnät högst upp, för "Lägg ut alla" och tryck
// på en ruta i hyllan.
export function freeSlot(diagram, extra = []) {
  const taken = [...diagram.boxes, ...extra];
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 7; col++) {
      const p = { x: 60 + col * 86, y: 56 + row * 90 };
      if (!taken.some((b) => Math.abs(b.x - p.x) < BOX + 8 && Math.abs(b.y - p.y) < BOX + 8)) return p;
    }
  }
  return { x: WORLD.w / 2, y: WORLD.h / 2 };
}

// På en tom yta läggs alla ut i ett centrerat, kompakt rutnät (högst tre per
// rad, 2 × 2 för fyra), så att lådorna blir stora nog för fingret när ytan
// zoomar in på mobilen. Annars fylls lediga platser i raden överst.
function compactGrid(attrs) {
  const cols = attrs.length <= 3 ? attrs.length : attrs.length === 4 ? 2 : 3;
  const rows = Math.ceil(attrs.length / Math.max(cols, 1));
  const gx = 130;
  const gy = 120;
  const y0 = WORLD.h / 2 - ((rows - 1) * gy) / 2;
  return attrs.map((attr, i) => {
    const row = Math.floor(i / cols);
    const inRow = Math.min(cols, attrs.length - row * cols);
    const x0 = WORLD.w / 2 - ((inRow - 1) * gx) / 2;
    return { id: newId("b"), attr, x: x0 + (i % cols) * gx, y: y0 + row * gy };
  });
}

export function placeAll(diagram, attrs) {
  if (!diagram.boxes.length) return { ...diagram, boxes: compactGrid(attrs) };
  const placed = new Set(diagram.boxes.map((b) => b.attr).filter(Boolean));
  const boxes = [...diagram.boxes];
  for (const attr of attrs) {
    if (placed.has(attr)) continue;
    const p = freeSlot({ ...diagram, boxes });
    boxes.push({ id: newId("b"), attr, x: p.x, y: p.y });
  }
  return { ...diagram, boxes };
}

// ---------- Tolkning mot beroendena ----------

// Varje pil som par (vänsterled, ett attribut). En pil från en grupp har
// gruppens attribut som vänsterled; en pil till en grupp betyder ett par per
// medlem. Rutor utan bokstav hoppas över.
export function drawnPairs(diagram) {
  const attrOf = (id) => diagram.boxes.find((b) => b.id === id)?.attr || null;
  const attrsOfRef = (ref) => {
    if (ref.kind === "box") return [attrOf(ref.id)];
    const g = diagram.groups.find((x) => x.id === ref.id);
    return g ? g.members.map(attrOf) : [null];
  };
  const pairs = [];
  for (const a of diagram.arrows) {
    const lhs = attrsOfRef(a.from);
    const rhs = attrsOfRef(a.to);
    if (lhs.some((x) => !x) || rhs.some((x) => !x)) continue;
    for (const attr of rhs) pairs.push({ arrowId: a.id, lhs, attr });
  }
  return pairs;
}

export const pairKey = (lhs, attr) => `${[...lhs].map((x) => x.toLowerCase()).sort().join(",")}>${attr.toLowerCase()}`;

// De givna beroendena som par, A → {B, C} = två par; triviala delar bort.
export function givenPairs(F) {
  const out = [];
  for (const fd of toFds(F)) {
    for (const attr of fd.rhs) {
      if (has(fd.lhs, attr)) continue;
      if (out.some((p) => pairKey(p.lhs, p.attr) === pairKey(fd.lhs, attr))) continue;
      out.push({ lhs: fd.lhs, attr, index: fd.index });
    }
  }
  return out;
}

// "Kontrollera ritningen": ritade pilar mot givna beroenden, som mängder.
export function compareDrawing(diagram, R, F) {
  const attrs = attrsOf(R);
  const given = givenPairs(F);
  const drawn = drawnPairs(diagram);
  const givenKeys = new Set(given.map((p) => pairKey(p.lhs, p.attr)));
  const drawnKeys = new Set(drawn.map((p) => pairKey(p.lhs, p.attr)));
  const correct = drawn.filter((p) => givenKeys.has(pairKey(p.lhs, p.attr)));
  const wrong = drawn
    .filter((p) => !givenKeys.has(pairKey(p.lhs, p.attr)))
    .map((p) => {
      let reason = "not-given";
      if (has(p.lhs, p.attr)) reason = "trivial";
      else if (has(closure(p.lhs, F), p.attr)) reason = "derived";
      return { ...p, reason };
    });
  const missing = given.filter((p) => !drawnKeys.has(pairKey(p.lhs, p.attr)));
  const labels = diagram.boxes.map((b) => b.attr).filter(Boolean);
  const unplaced = attrs.filter((a) => !labels.includes(a));
  const unlabeled = diagram.boxes.filter((b) => !b.attr).map((b) => b.id);
  const wrongArrowIds = new Set(wrong.map((w) => w.arrowId));
  // En pil är fel om något av dess par är fel (en pil till en grupp kan
  // vara delvis rätt; den räknas som fel tills alla par stämmer).
  const ok = missing.length === 0 && wrong.length === 0 && unplaced.length === 0 && unlabeled.length === 0;
  return { correct, wrong, missing, unplaced, unlabeled, wrongArrowIds, ok };
}

// Efter rättningen: varje ritad pil får typen på sitt beroende.
export function arrowTypes(diagram, R, F) {
  const cks = allCandidateKeys(R, F);
  const types = {};
  for (const p of drawnPairs(diagram)) {
    const t = dependencyType(p.lhs, p.attr, R, F, cks);
    if (t === "partial" || (t === "transitive" && types[p.arrowId] !== "partial")) types[p.arrowId] = t;
  }
  return types;
}

// ---------- Autolayout, "Rita från FD:erna" ----------

// Björns form: nyckeln överst, det den bestämmer i raden under, kedjor
// nedåt och en aning åt höger; grupp runt varje sammansatt determinant.
export function layoutFromFds(R, F) {
  const attrs = attrsOf(R);
  const fds = toFds(F);
  // Nyckeln överst: den kandidatnyckel som står först i uppgiften som
  // vänsterled, annars den minsta.
  const cks = allCandidateKeys(attrs, fds);
  const key = fds.map((fd) => cks.find((k) => k.length === fd.lhs.length && subset(k, fd.lhs))).find(Boolean) || cks[0] || attrs;
  const depth = {};
  for (const a of key) depth[a] = 0;
  const parent = {};
  let round = 0;
  let changed = true;
  while (changed) {
    changed = false;
    const known = { ...depth };
    for (const fd of fds) {
      if (!fd.lhs.every((a) => known[a] !== undefined)) continue;
      const d = Math.max(...fd.lhs.map((a) => known[a])) + 1;
      for (const a of fd.rhs) {
        if (depth[a] === undefined) { depth[a] = d; parent[a] = fd.lhs; changed = true; }
      }
    }
    if (++round > attrs.length + 1) break;
  }
  const maxKnown = Math.max(0, ...Object.values(depth));
  for (const a of attrs) if (depth[a] === undefined) depth[a] = maxKnown + 1;

  const levels = Math.max(...attrs.map((a) => depth[a]));
  const step = levels > 0 ? Math.min(96, (WORLD.h - 70 - BOX) / levels) : 0;
  const drift = levels > 3 ? 52 : 28;
  const pos = {};
  for (let d = 0; d <= levels; d++) {
    let row = attrs.filter((a) => depth[a] === d);
    if (d > 0) {
      const bary = (a) => {
        const xs = (parent[a] || []).map((p) => pos[p]?.x).filter((x) => x !== undefined);
        return xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : WORLD.w / 2;
      };
      row = row.sort((a, b) => bary(a) - bary(b) || attrs.indexOf(a) - attrs.indexOf(b));
    }
    const gap = Math.min(92, (WORLD.w - 80) / Math.max(1, row.length));
    const width = gap * (row.length - 1);
    let startX = WORLD.w / 2 - width / 2 + d * drift - (levels * drift) / 2;
    if (d > 0 && row.length) {
      const bary = row.map((a) => (parent[a] || []).map((p) => pos[p]?.x).filter((x) => x !== undefined)).flat();
      if (bary.length) startX = bary.reduce((s, x) => s + x, 0) / bary.length - width / 2 + drift;
    }
    startX = Math.max(40, Math.min(WORLD.w - 40 - width, startX));
    row.forEach((a, i) => { pos[a] = { x: startX + i * gap, y: 44 + d * step }; });
  }

  let diagram = { boxes: attrs.map((a) => ({ id: newId("b"), attr: a, ...clampPoint(pos[a]) })), groups: [], arrows: [] };
  const boxOf = (a) => diagram.boxes.find((b) => b.attr.toLowerCase() === a.toLowerCase());
  for (const fd of fds) {
    let from;
    if (fd.lhs.length > 1) {
      const r = addGroup(diagram, fd.lhs.map((a) => boxOf(a)?.id));
      diagram = r.diagram;
      from = { kind: "group", id: r.id };
    } else {
      from = { kind: "box", id: boxOf(fd.lhs[0])?.id };
    }
    for (const a of fd.rhs) {
      if (has(fd.lhs, a)) continue;
      diagram = addArrow(diagram, from, { kind: "box", id: boxOf(a)?.id }).diagram;
    }
  }
  return diagram;
}

// Kort text för ett par, "{A, B} → C".
export const pairText = (p) => `${setText(p.lhs)} → ${p.attr}`;

