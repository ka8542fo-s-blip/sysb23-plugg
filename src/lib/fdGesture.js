// Gesterna på ritytan, som rena funktioner så att de går att testa utan
// webbläsare. Ett tryck (press) följs av drag (drag) och släpp (release);
// ritytan anropar dem från sina pointer-händelser och sparar resultatet.
//
//   snabbt drag från en låda eller grupp → pil (släpp på en annan)
//   drag av en markerad låda, eller efter att ha hållit in → flytt;
//     släppt med mittpunkten på en annan låda → grupp, på en grupp → läggs
//     till, utanför sin grupp → lyfts ut
//   tryck på en låda → markera den; tryck sedan på en annan → pil
//   tryck på en pil eller grupp → markera; × på det markerade → ta bort
//   drag på tom yta → markeringsram (för G)
//
// En nyskapad pil markeras aldrig. Lådorna är relationens attribut och kan
// inte tas bort, bara pilar och grupper.
import { hitTest, shapeRect, arrowGeometry, addArrow, removeElements, clampPoint, dropOutcome, applyDrop } from "./fdDiagram.js";

export const HOLD_MS = 350;

const labelOf = (diagram, ref) => {
  if (!ref) return "";
  if (ref.kind === "box") return diagram.boxes.find((b) => b.id === ref.id)?.attr || "?";
  const g = diagram.groups.find((x) => x.id === ref.id);
  return g ? `{${g.members.map((m) => diagram.boxes.find((b) => b.id === m)?.attr || "?").join(", ")}}` : "";
};
export { labelOf };

const kindOf = (diagram, id) =>
  diagram.boxes.some((b) => b.id === id) ? "box" : diagram.groups.some((g) => g.id === id) ? "group" : diagram.arrows.some((a) => a.id === id) ? "arrow" : null;

// Bara pilar och grupper går att ta bort.
export const deletable = (diagram, ids) => ids.filter((id) => ["arrow", "group"].includes(kindOf(diagram, id)));

// ×-knappen sitter i det markerade elementets övre högra hörn (pilens mitt).
export function deleteButtonPos(diagram, selection) {
  if (selection.length !== 1) return null;
  const id = selection[0];
  const kind = kindOf(diagram, id);
  if (kind === "group") {
    const r = shapeRect({ kind, id }, diagram);
    return r ? { id, x: r.x + r.w, y: r.y } : null;
  }
  if (kind === "arrow") {
    const geo = arrowGeometry(diagram.arrows.find((a) => a.id === id), diagram);
    return geo ? { id, x: geo.mid.x + 12, y: geo.mid.y - 12 } : null;
  }
  return null;
}

function boxesToMove(ids, diagram) {
  const out = new Set();
  for (const id of ids) {
    if (diagram.boxes.some((b) => b.id === id)) out.add(id);
    const g = diagram.groups.find((x) => x.id === id);
    if (g) g.members.forEach((m) => out.add(m));
  }
  return out;
}

function moveSetup(diagram, ids) {
  const moving = boxesToMove(ids, diagram);
  const orig = Object.fromEntries(diagram.boxes.filter((b) => moving.has(b.id)).map((b) => [b.id, { x: b.x, y: b.y }]));
  const keys = Object.keys(orig);
  const single = keys.length === 1 && ids.length === 1 && kindOf(diagram, ids[0]) === "box" ? keys[0] : null;
  return { orig, single };
}

// ctx: { diagram, selection, pending, tol, slop }
export function press(ctx, p, { shift = false, time = 0 } = {}) {
  const { diagram, selection } = ctx;
  const del = deleteButtonPos(diagram, selection);
  if (del && Math.hypot(p.x - del.x, p.y - del.y) <= Math.max(11, ctx.tol)) return { mode: "delete", id: del.id };
  const hit = hitTest(p, diagram, ctx.tol);
  if (!hit) return { mode: "marquee", start: p, point: p, shift, moved: false };
  if (hit.kind === "arrow") return { mode: "arrow", target: hit, start: p, shift, moved: false };
  const selected = selection.includes(hit.id) && !shift;
  const ids = selected ? selection.filter((id) => kindOf(diagram, id) !== "arrow") : [hit.id];
  return { mode: selected ? "move" : "pending", target: hit, start: p, point: p, t0: time, shift, moved: false, before: diagram, ...moveSetup(diagram, ids) };
}

// Hållit stilla länge nog: lådan lyfts och följer med vid drag.
export function hold(g, time) {
  if (g?.mode === "pending" && !g.moved && !g.shift && time - g.t0 >= HOLD_MS) return { ...g, mode: "move", lifted: true };
  return g;
}

// Returnerar den nya gesten; `live` är diagrammet under en flytt och `hint`
// vad ett släpp skulle göra.
export function drag(g, p, ctx, time = 0) {
  if (!g) return { gesture: g };
  const dist = Math.hypot(p.x - g.start.x, p.y - g.start.y);
  let next = { ...g, point: p };
  if (g.mode === "pending") {
    if (dist < ctx.slop) return { gesture: g };
    next = { ...next, moved: true, mode: !g.shift && time - g.t0 >= HOLD_MS ? "move" : "link" };
  } else if (!g.moved && dist >= ctx.slop) {
    next.moved = true;
  }
  if (next.mode === "move" && next.moved) {
    const dx = p.x - g.start.x;
    const dy = p.y - g.start.y;
    const base = g.before;
    const live = { ...base, boxes: base.boxes.map((b) => (g.orig[b.id] ? { ...b, ...clampPoint({ x: g.orig[b.id].x + dx, y: g.orig[b.id].y + dy }) } : b)) };
    next.live = live;
    let hint = null;
    if (g.single) {
      const o = dropOutcome(live, g.single, base);
      if (o.target || o.leave.length) hint = { ...o, box: g.single };
    }
    return { gesture: next, live, hint };
  }
  return { gesture: next };
}

// Släppet. Returnerar { diagram, before, selection, pending, message };
// `diagram` är samma objekt som ctx.diagram när inget ändrats.
export function release(g, p, ctx) {
  const { diagram, selection, pending } = ctx;
  const out = { diagram, before: diagram, selection, pending, message: "" };
  if (!g) return out;

  if (g.mode === "delete") {
    return { ...out, diagram: removeElements(diagram, [g.id]), selection: [], pending: null, message: "Borttaget." };
  }
  if (g.mode === "arrow") {
    if (g.shift) return { ...out, selection: selection.includes(g.target.id) ? selection.filter((x) => x !== g.target.id) : [...selection, g.target.id], pending: null };
    return { ...out, selection: selection.length === 1 && selection[0] === g.target.id ? [] : [g.target.id], pending: null };
  }
  if (g.mode === "marquee") {
    if (!g.moved && Math.hypot(p.x - g.start.x, p.y - g.start.y) < ctx.slop) return { ...out, selection: g.shift ? selection : [], pending: null };
    const x1 = Math.min(g.start.x, p.x), x2 = Math.max(g.start.x, p.x);
    const y1 = Math.min(g.start.y, p.y), y2 = Math.max(g.start.y, p.y);
    const ids = diagram.boxes.filter((b) => b.x >= x1 && b.x <= x2 && b.y >= y1 && b.y <= y2).map((b) => b.id);
    return { ...out, selection: g.shift ? [...new Set([...selection, ...ids])] : ids, pending: null };
  }
  if (g.mode === "link") {
    const hit = hitTest(p, diagram, ctx.tol);
    const target = hit && hit.kind !== "arrow" && hit.id !== g.target.id ? hit : null;
    if (!target) return { ...out, pending: null, message: "Ingen pil: släpp på en annan låda." };
    const r = addArrow(diagram, g.target, target);
    if (!r.id) return { ...out, pending: null, message: "Ingen pil: en grupp kan inte peka på sina egna lådor." };
    return { ...out, diagram: r.diagram, selection: [], pending: null, message: `Pil ${labelOf(diagram, g.target)} → ${labelOf(diagram, target)}.` };
  }
  if (g.mode === "move" && g.moved && g.live) {
    if (g.single) {
      const o = dropOutcome(g.live, g.single, g.before);
      const next = applyDrop(g.live, g.single, o, g.before);
      let message = "";
      let sel = g.lifted ? [] : selection;
      if (o.target) {
        const grp = next.groups.find((x) => x.members.includes(g.single) && (o.target.kind === "group" ? x.id === o.target.id : x.members.includes(o.target.id)));
        if (grp) { message = `Grupp ${labelOf(next, { kind: "group", id: grp.id })}.`; sel = []; }
      } else if (o.leave.length) {
        message = `${labelOf(next, { kind: "box", id: g.single })} lyft ur gruppen.`;
      }
      return { ...out, diagram: next, before: g.before, selection: sel, pending: null, message };
    }
    return { ...out, diagram: g.live, before: g.before, selection: g.lifted ? [] : selection, pending: null };
  }

  // Ett tryck utan drag på en låda eller grupp.
  const t = g.target;
  if (g.shift) {
    return { ...out, selection: selection.includes(t.id) ? selection.filter((x) => x !== t.id) : [...selection, t.id], pending: null };
  }
  if (pending && pending.id !== t.id && kindOf(diagram, pending.id)) {
    const r = addArrow(diagram, pending, t);
    if (!r.id) return { ...out, selection: [t.id], pending: t, message: "Ingen pil: en grupp kan inte peka på sina egna lådor." };
    return { ...out, diagram: r.diagram, selection: [], pending: null, message: `Pil ${labelOf(diagram, pending)} → ${labelOf(diagram, t)}.` };
  }
  if (selection.length === 1 && selection[0] === t.id) return { ...out, selection: [], pending: null };
  return { ...out, selection: [t.id], pending: { kind: t.kind, id: t.id }, message: `${labelOf(diagram, t)} markerad — tryck på en annan låda för en pil.` };
}
