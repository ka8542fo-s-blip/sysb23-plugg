// Frihandsläget på ritytan: ett streck tolkas geometriskt, utan
// maskininlärning. Strecket är en lista punkter i världskoordinater; scenen
// är rutorna, grupperna och pilarna som rektanglar respektive sträckor.
//
//   box     sluten slinga runt en tom plats, ungefär rutstor → ny ruta
//   group   sluten slinga runt två eller fler rutor → sammansatt determinant
//   arrow   öppet streck från (nära) en ruta eller grupp till en annan → pil
//   erase   klotter (många tvära vändningar) över element → radera dem
//   unknown allt annat, tonas bort
//
// Måtten: sträckans längd mot diagonalen i dess omslutande rektangel (en
// rak linje ≈ 1, en cirkel ≈ 2,2, en kvadrat ≈ 2,8, klotter mycket mer),
// avståndet mellan start och slut, antalet tvära vändningar och antalet
// hörn (riktningsändringar på över 50° efter utjämning).

export function pathLength(pts) {
  let len = 0;
  for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  return len;
}

export function bbox(pts) {
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y };
}

// Jämnt fördelade punkter längs strecket (n stycken).
export function resample(pts, n = 48) {
  if (pts.length < 2) return pts.slice();
  const interval = pathLength(pts) / (n - 1);
  if (interval === 0) return Array.from({ length: n }, () => ({ ...pts[0] }));
  const out = [{ ...pts[0] }];
  let acc = 0;
  const src = pts.map((p) => ({ ...p }));
  for (let i = 1; i < src.length; i++) {
    const a = src[i - 1];
    const b = src[i];
    const d = Math.hypot(b.x - a.x, b.y - a.y);
    if (acc + d >= interval && d > 0) {
      const t = (interval - acc) / d;
      const q = { x: a.x + t * (b.x - a.x), y: a.y + t * (b.y - a.y) };
      out.push(q);
      src.splice(i, 0, q);
      acc = 0;
    } else {
      acc += d;
    }
  }
  while (out.length < n) out.push({ ...pts[pts.length - 1] });
  return out.slice(0, n);
}

function turnAngles(pts) {
  const angles = [];
  for (let i = 1; i < pts.length - 1; i++) {
    const a = Math.atan2(pts[i].y - pts[i - 1].y, pts[i].x - pts[i - 1].x);
    const b = Math.atan2(pts[i + 1].y - pts[i].y, pts[i + 1].x - pts[i].x);
    let d = b - a;
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    angles.push(d);
  }
  return angles;
}

export function features(points) {
  const pts = resample(points, 48);
  const box = bbox(points);
  const diag = Math.hypot(box.w, box.h) || 1;
  const len = pathLength(points);
  const gap = Math.hypot(points[0].x - points[points.length - 1].x, points[0].y - points[points.length - 1].y);
  // Vändningar räknas på ett grövre urval, så att darr inte räknas.
  const coarse = resample(points, 24);
  const turns = turnAngles(coarse);
  const reversals = turns.filter((t) => Math.abs(t) > (2 * Math.PI) / 3).length;
  const corners = turns.filter((t) => Math.abs(t) > (50 * Math.PI) / 180).length;
  const winding = turns.reduce((s, t) => s + t, 0);
  return { pts, box, diag, len, ratio: len / diag, gap, reversals, corners, winding };
}

function pointInPolygon(p, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i];
    const b = poly[j];
    if ((a.y > p.y) !== (b.y > p.y) && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}

const inRect = (p, r, tol = 0) => p.x >= r.x - tol && p.x <= r.x + r.w + tol && p.y >= r.y - tol && p.y <= r.y + r.h + tol;
const rectsOverlap = (a, b) => a.x <= b.x + b.w && b.x <= a.x + a.w && a.y <= b.y + b.h && b.y <= a.y + a.h;
const rectCenter = (r) => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });

// scene: { boxes: [{ id, rect }], groups: [{ id, rect, members }], arrows: [{ id, p1, p2 }] }
// tol: hur långt från en ruta ett streck får börja eller sluta (världsenheter).
export function classifyStroke(points, scene, { tol = 16, boxSize = 46 } = {}) {
  if (!points || points.length < 3) return { kind: "unknown" };
  const f = features(points);
  if (f.len < 12) return { kind: "unknown" };

  // Klotter: fram och tillbaka över något.
  if (f.reversals >= 3 && f.ratio > 3) {
    const hits = [];
    const touched = (r) => f.pts.some((p) => inRect(p, r, 2));
    for (const b of scene.boxes) if (touched(b.rect) && rectsOverlap(f.box, b.rect)) hits.push(b.id);
    for (const a of scene.arrows) {
      const near = f.pts.some((p) => distToSegment(p, a.p1, a.p2) < 8);
      if (near) hits.push(a.id);
    }
    if (!hits.length) {
      for (const g of scene.groups) if (f.pts.some((p) => onRectEdge(p, g.rect, 8))) hits.push(g.id);
    }
    return hits.length ? { kind: "erase", ids: [...new Set(hits)] } : { kind: "unknown" };
  }

  // Sluten slinga: start och slut nära varandra jämfört med storleken, och
  // strecket går runt (vinkelsumman ungefär ett varv).
  const closed = f.gap < Math.max(0.3 * f.diag, 14) && f.ratio > 1.9 && f.ratio < 5.5 && Math.abs(f.winding) > 4.4;
  if (closed) {
    const poly = f.pts;
    const enclosed = scene.boxes.filter((b) => pointInPolygon(rectCenter(b.rect), poly));
    if (enclosed.length >= 2) return { kind: "group", members: enclosed.map((b) => b.id) };
    if (enclosed.length === 0) {
      const small = Math.min(f.box.w, f.box.h);
      const large = Math.max(f.box.w, f.box.h);
      if (small >= boxSize * 0.35 && large <= boxSize * 3.2 && large / Math.max(small, 1) < 3) {
        return { kind: "box", center: rectCenter(f.box), corners: f.corners };
      }
    }
    return { kind: "unknown" };
  }

  // Öppet streck: pil om det börjar vid ett element och slutar vid ett annat.
  if (f.ratio < 2.6) {
    const start = points[0];
    const end = points[points.length - 1];
    const from = shapeAt(start, scene, tol);
    const to = shapeAt(end, scene, tol, from);
    if (from && to && from.id !== to.id) return { kind: "arrow", from, to };
  }
  return { kind: "unknown" };
}

// Rutan under punkten vinner över gruppen; en punkt på gruppens ram (utanför
// dess rutor) är gruppen. `not` är pilens start: en pil får inte gå från en
// ruta till dess egen grupp eller från en grupp till en av dess rutor.
function shapeAt(p, scene, tol, not = null) {
  const notMembers = not?.kind === "group" ? scene.groups.find((g) => g.id === not.id)?.members || [] : [];
  const boxOk = (b) => b.id !== not?.id && !notMembers.includes(b.id);
  const groupOk = (g) => g.id !== not?.id && !(not?.kind === "box" && g.members?.includes(not.id));
  const insideBox = scene.boxes.find((b) => inRect(p, b.rect, 2));
  if (insideBox) return boxOk(insideBox) ? { kind: "box", id: insideBox.id } : null;
  const group = scene.groups
    .filter((g) => groupOk(g) && inRect(p, g.rect, tol / 2))
    .sort((a, b) => a.rect.w * a.rect.h - b.rect.w * b.rect.h)[0];
  if (group) return { kind: "group", id: group.id };
  const box = scene.boxes
    .filter((b) => boxOk(b) && inRect(p, b.rect, tol))
    .sort((a, b) => dist(p, rectCenter(a.rect)) - dist(p, rectCenter(b.rect)))[0];
  return box ? { kind: "box", id: box.id } : null;
}

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

function distToSegment(p, a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const l2 = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / l2));
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

function onRectEdge(p, r, tol) {
  if (!inRect(p, r, tol)) return false;
  return Math.min(Math.abs(p.x - r.x), Math.abs(p.x - r.x - r.w), Math.abs(p.y - r.y), Math.abs(p.y - r.y - r.h)) <= tol;
}
