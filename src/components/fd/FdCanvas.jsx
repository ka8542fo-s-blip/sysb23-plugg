import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import {
  WORLD, BOX, emptyDiagram, newId, boxRect, groupRect, shapeRect, arrowGeometry, hitTest, removeElements, addGroup, addArrow,
  clampPoint, freeSlot, placeAll, compareDrawing, arrowTypes, layoutFromFds, pairText,
} from "../../lib/fdDiagram.js";
import { classifyStroke } from "../../lib/strokes.js";
import { attrsOf } from "../../lib/fd.js";
import { load, save } from "../../lib/storage.js";

// Ritytan för beroendediagram, i Björns tavelstil. Eget SVG med pointer
// events, så att mus, styrplatta, penna och finger fungerar likadant.
// Ritningen sparas per uppgift i localStorage (sysb23:fdritning:<id>).

const TOOLS = [
  ["select", "Flytta"],
  ["arrow", "Pil"],
  ["pen", "Penna"],
];

const HINTS = {
  select: "Dra ut rutor ur hyllan. En pil: dra från pricken på en ruta till en annan. Markera flera med shift-klick eller en ram, G grupperar.",
  arrow: "Tryck på källan (en ruta eller en grupp), sedan på målet.",
  pen: "Rita en fyrkant för en ruta, en slinga runt rutor för en grupp, ett streck mellan två rutor för en pil. Klottra över något för att radera.",
};

function reducer(state, action) {
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

function validDiagram(d) {
  return d && Array.isArray(d.boxes) && Array.isArray(d.groups) && Array.isArray(d.arrows) ? d : null;
}

const labelOf = (diagram, ref) => {
  if (!ref) return "";
  if (ref.kind === "box") return diagram.boxes.find((b) => b.id === ref.id)?.attr || "?";
  const g = diagram.groups.find((x) => x.id === ref.id);
  return g ? `{${g.members.map((m) => diagram.boxes.find((b) => b.id === m)?.attr || "?").join(", ")}}` : "";
};

export default function FdCanvas({ item, graded }) {
  const attrs = useMemo(() => attrsOf(item.attrs), [item.attrs]);
  const storageKey = `fdritning:${item.id}`;
  const [state, dispatch] = useReducer(reducer, null, () => ({ diagram: validDiagram(load(storageKey, null)) || emptyDiagram(), past: [], future: [] }));
  const { diagram } = state;
  const diagramRef = useRef(diagram);
  diagramRef.current = diagram;

  const [tool, setTool] = useState("select");
  const [selection, setSelection] = useState([]);
  const [pending, setPending] = useState(null);
  const [drag, setDrag] = useState(null);
  const dragRef = useRef(null);
  const [fading, setFading] = useState([]);
  const [hover, setHover] = useState(null);
  const [showCheck, setShowCheck] = useState(false);
  const [helperShown, setHelperShown] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [message, setMessage] = useState("");
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const shelfRef = useRef(null);

  useEffect(() => { save(storageKey, diagram); }, [storageKey, diagram]);

  // På smala skärmar zoomar ytan in mot innehållet, så att rutorna blir
  // stora nog att träffa med fingret. Vyn räknas om först när en dragning
  // är klar, så att inget hoppar under fingret.
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver(([entry]) => setNarrow(entry.contentRect.width < 520));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  // Smal yta: kvadratisk vy runt innehållet (hela ytans höjd när den är tom).
  const [view, setView] = useState(null);
  useEffect(() => {
    if (drag) return;
    if (!narrow) { setView(null); return; }
    const rects = [...diagram.boxes.map(boxRect), ...diagram.groups.map((g) => groupRect(g, diagram)).filter(Boolean)];
    if (!rects.length) { setView({ x: (WORLD.w - WORLD.h) / 2, y: 0, w: WORLD.h, h: WORLD.h }); return; }
    const x1 = Math.min(...rects.map((r) => r.x)) - 50;
    const y1 = Math.min(...rects.map((r) => r.y)) - 50;
    const x2 = Math.max(...rects.map((r) => r.x + r.w)) + 50;
    const y2 = Math.max(...rects.map((r) => r.y + r.h)) + 50;
    const size = Math.min(WORLD.w, Math.max(x2 - x1, y2 - y1, 300));
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2;
    const x = Math.max(0, Math.min(WORLD.w - size, cx - size / 2));
    const y = size >= WORLD.h ? (WORLD.h - size) / 2 : Math.max(0, Math.min(WORLD.h - size, cy - size / 2));
    setView({ x, y, w: size, h: size });
  }, [narrow, diagram, drag]);

  const commit = (next, before) => dispatch({ type: "commit", diagram: next, before });
  const say = (text) => setMessage(text);

  // ---------- Koordinater ----------
  function toWorld(e) {
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const p = pt.matrixTransform(svg.getScreenCTM().inverse());
    return { x: p.x, y: p.y };
  }
  function scale() {
    const r = svgRef.current?.getBoundingClientRect();
    return r && r.width ? r.width / (view ? view.w : WORLD.w) : 1;
  }
  const tolerance = () => Math.max(6, 10 / scale());
  const overSvg = (e) => {
    const r = svgRef.current?.getBoundingClientRect();
    return r && e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
  };

  // ---------- Markering och handtag ----------
  const selectedBoxes = selection.filter((id) => diagram.boxes.some((b) => b.id === id));
  const single = selection.length === 1 ? selection[0] : null;
  const handleShapes = () => {
    const ids = new Set([...(tool !== "pen" ? selection : []), ...(hover && tool === "select" ? [hover] : [])]);
    return [...ids]
      .map((id) => (diagram.boxes.some((b) => b.id === id) ? { kind: "box", id } : diagram.groups.some((g) => g.id === id) ? { kind: "group", id } : null))
      .filter(Boolean);
  };
  const handlePos = (ref) => {
    const r = shapeRect(ref, diagram);
    return r ? { x: r.x + r.w, y: r.y + r.h / 2 } : null;
  };
  function handleAt(p) {
    if (tool !== "select") return null;
    const tol = Math.max(10, tolerance());
    for (const ref of handleShapes()) {
      const h = handlePos(ref);
      if (h && Math.hypot(p.x - h.x, p.y - h.y) <= tol) return ref;
    }
    return null;
  }

  function boxesToMove(sel, d) {
    const ids = new Set();
    for (const id of sel) {
      if (d.boxes.some((b) => b.id === id)) ids.add(id);
      const g = d.groups.find((x) => x.id === id);
      if (g) g.members.forEach((m) => ids.add(m));
    }
    return ids;
  }

  // ---------- Pekaren ----------
  function onPointerDown(e) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const p = toWorld(e);
    const d = diagramRef.current;
    try { svgRef.current.setPointerCapture(e.pointerId); } catch { /* syntetiska händelser saknar pekare */ }
    containerRef.current?.focus({ preventScroll: true });
    setConfirmClear(false);

    if (tool === "pen") {
      dragRef.current = { type: "stroke", points: [p] };
      setDrag({ type: "stroke", points: [p] });
      return;
    }
    const handle = handleAt(p);
    if (handle) {
      dragRef.current = { type: "link", from: handle, moved: false, start: p, point: p };
      setDrag({ type: "link", from: handle, point: p });
      return;
    }
    const hit = hitTest(p, d, tolerance());
    if (tool === "arrow") {
      if (hit && hit.kind !== "arrow") {
        dragRef.current = { type: "link", from: hit, moved: false, start: p, point: p };
        setDrag({ type: "link", from: hit, point: p });
      } else {
        setPending(null);
      }
      return;
    }
    if (!hit) {
      dragRef.current = { type: "marquee", start: p, point: p, additive: e.shiftKey };
      setDrag({ type: "marquee", start: p, point: p });
      if (!e.shiftKey) setSelection([]);
      return;
    }
    if (e.shiftKey || e.metaKey || e.ctrlKey) {
      setSelection((sel) => (sel.includes(hit.id) ? sel.filter((x) => x !== hit.id) : [...sel, hit.id]));
      return;
    }
    const sel = selection.includes(hit.id) ? selection : [hit.id];
    setSelection(sel);
    if (hit.kind === "arrow") return;
    const moving = boxesToMove(sel, d);
    const orig = Object.fromEntries(d.boxes.filter((b) => moving.has(b.id)).map((b) => [b.id, { x: b.x, y: b.y }]));
    dragRef.current = { type: "move", start: p, before: d, orig, moved: false };
  }

  function onPointerMove(e) {
    const dr = dragRef.current;
    const p = toWorld(e);
    if (!dr) {
      if (e.pointerType === "mouse" && tool === "select") {
        const hit = hitTest(p, diagramRef.current, tolerance());
        const onHandle = handleAt(p);
        const next = onHandle ? onHandle.id : hit && hit.kind !== "arrow" ? hit.id : null;
        if (next !== hover) setHover(next);
      }
      return;
    }
    if (dr.type === "move") {
      const dx = p.x - dr.start.x;
      const dy = p.y - dr.start.y;
      if (!dr.moved && Math.hypot(dx, dy) < 3 / scale()) return;
      dr.moved = true;
      const d = dr.before;
      const boxes = d.boxes.map((b) => (dr.orig[b.id] ? { ...b, ...clampPoint({ x: dr.orig[b.id].x + dx, y: dr.orig[b.id].y + dy }) } : b));
      dr.current = { ...d, boxes };
      dispatch({ type: "live", diagram: dr.current });
    } else if (dr.type === "marquee" || dr.type === "link") {
      dr.point = p;
      if (dr.type === "link" && Math.hypot(p.x - dr.start.x, p.y - dr.start.y) > 6 / scale()) dr.moved = true;
      setDrag({ ...drag, type: dr.type, from: dr.from, start: dr.start, point: p });
    } else if (dr.type === "stroke") {
      const last = dr.points[dr.points.length - 1];
      if (Math.hypot(p.x - last.x, p.y - last.y) < 1.5) return;
      dr.points.push(p);
      setDrag({ type: "stroke", points: [...dr.points] });
    }
  }

  function onPointerUp(e) {
    const dr = dragRef.current;
    dragRef.current = null;
    setDrag(null);
    if (!dr) return;
    const d = diagramRef.current;
    const p = e.type === "pointercancel" ? dr.point || dr.start : toWorld(e);
    if (dr.type === "move") {
      if (dr.moved && dr.current) commit(dr.current, dr.before);
    } else if (dr.type === "marquee") {
      const x1 = Math.min(dr.start.x, p.x), x2 = Math.max(dr.start.x, p.x);
      const y1 = Math.min(dr.start.y, p.y), y2 = Math.max(dr.start.y, p.y);
      if (x2 - x1 < 4 && y2 - y1 < 4) return;
      const inside = (q) => q.x >= x1 && q.x <= x2 && q.y >= y1 && q.y <= y2;
      const ids = d.boxes.filter((b) => inside(b)).map((b) => b.id);
      setSelection((sel) => (dr.additive ? [...new Set([...sel, ...ids])] : ids));
    } else if (dr.type === "link") {
      const hit = hitTest(p, d, tolerance());
      const target = hit && hit.kind !== "arrow" && hit.id !== dr.from.id ? hit : null;
      if (dr.moved) {
        if (target) link(dr.from, target);
        else say("Ingen pil: släpp på en annan ruta.");
      } else if (tool === "arrow") {
        if (pending && pending.id !== dr.from.id) {
          link(pending, dr.from);
          setPending(null);
        } else {
          setPending(dr.from);
          say(`Källa ${labelOf(d, dr.from)} — tryck på målet.`);
        }
      }
    } else if (dr.type === "stroke") {
      applyStroke(dr.points);
    }
  }

  function link(from, to) {
    const d = diagramRef.current;
    const r = addArrow(d, from, to);
    if (!r.id) { say("Ingen pil: en grupp kan inte peka på sina egna rutor."); return; }
    if (r.diagram !== d) commit(r.diagram);
    setSelection([r.id]);
    say(`Pil ${labelOf(d, from)} → ${labelOf(d, to)}.`);
  }

  function applyStroke(points) {
    const d = diagramRef.current;
    const scene = {
      boxes: d.boxes.map((b) => ({ id: b.id, rect: boxRect(b) })),
      groups: d.groups.map((g) => ({ id: g.id, rect: groupRect(g, d), members: g.members })).filter((g) => g.rect),
      arrows: d.arrows.flatMap((a) => {
        const geo = arrowGeometry(a, d);
        if (!geo) return [];
        return geo.kind === "curve" ? [{ id: a.id, p1: geo.p1, p2: geo.mid }, { id: a.id, p1: geo.mid, p2: geo.p2 }] : [{ id: a.id, p1: geo.p1, p2: geo.p2 }];
      }),
    };
    const r = classifyStroke(points, scene, { tol: Math.max(14, 16 / scale()), boxSize: BOX });
    if (r.kind === "box") {
      const id = newId("b");
      commit({ ...d, boxes: [...d.boxes, { id, attr: null, ...clampPoint(r.center) }] });
      setSelection([id]);
      say("Ny ruta — välj bokstav.");
    } else if (r.kind === "group") {
      const g = addGroup(d, r.members);
      if (g.diagram !== d) commit(g.diagram);
      setSelection(g.id ? [g.id] : []);
      say(`Grupp ${labelOf(g.diagram, { kind: "group", id: g.id })}.`);
    } else if (r.kind === "arrow") {
      link(r.from, r.to);
    } else if (r.kind === "erase") {
      commit(removeElements(d, r.ids));
      setSelection([]);
      say("Raderat.");
    } else {
      const id = newId("s");
      setFading((list) => [...list, { id, points }]);
      setTimeout(() => setFading((list) => list.filter((s) => s.id !== id)), 1100);
      say("Strecket kändes inte igen.");
    }
  }

  // ---------- Åtgärder ----------
  function deleteSelection() {
    if (!selection.length) return;
    commit(removeElements(diagram, selection));
    setSelection([]);
    say("Raderat.");
  }
  function groupSelection() {
    if (selectedBoxes.length < 2) return;
    const r = addGroup(diagram, selectedBoxes);
    if (r.diagram !== diagram) commit(r.diagram);
    setSelection(r.id ? [r.id] : []);
    say(`Grupp ${labelOf(r.diagram, { kind: "group", id: r.id })}.`);
  }
  function assignLetter(boxId, attr) {
    if (diagram.boxes.some((b) => b.attr === attr && b.id !== boxId)) { say(`${attr} finns redan på ytan.`); return; }
    commit({ ...diagram, boxes: diagram.boxes.map((b) => (b.id === boxId ? { ...b, attr } : b)) });
    say(`Rutan är ${attr}.`);
  }
  function placeAttr(attr, point) {
    const d = diagramRef.current;
    if (d.boxes.some((b) => b.attr === attr)) return;
    const p = point ? clampPoint(point) : freeSlot(d);
    const id = newId("b");
    commit({ ...d, boxes: [...d.boxes, { id, attr, x: p.x, y: p.y }] });
    setSelection([id]);
  }
  function drawFromFds() {
    commit(layoutFromFds(item.attrs, item.fds));
    setSelection([]);
    say("Ritat från beroendena. Ångra med ⌘Z om du vill tillbaka till din egen.");
  }
  function clearDrawing() {
    commit(emptyDiagram());
    setSelection([]);
    setConfirmClear(false);
    setShowCheck(false);
  }

  function onKeyDown(e) {
    const mod = e.metaKey || e.ctrlKey;
    const k = e.key;
    if (mod && k.toLowerCase() === "z") { e.preventDefault(); dispatch({ type: e.shiftKey ? "redo" : "undo" }); return; }
    if (mod && k.toLowerCase() === "y") { e.preventDefault(); dispatch({ type: "redo" }); return; }
    if (mod) return;
    if (k === "Delete" || k === "Backspace") { if (selection.length) { e.preventDefault(); deleteSelection(); } return; }
    if (k === "Escape") { setSelection([]); setPending(null); dragRef.current = null; setDrag(null); return; }
    if (k.startsWith("Arrow") && selectedBoxes.length + selection.filter((id) => diagram.groups.some((g) => g.id === id)).length) {
      e.preventDefault();
      const step = e.shiftKey ? 24 : 8;
      const dx = k === "ArrowLeft" ? -step : k === "ArrowRight" ? step : 0;
      const dy = k === "ArrowUp" ? -step : k === "ArrowDown" ? step : 0;
      const moving = boxesToMove(selection, diagram);
      commit({ ...diagram, boxes: diagram.boxes.map((b) => (moving.has(b.id) ? { ...b, ...clampPoint({ x: b.x + dx, y: b.y + dy }) } : b)) });
      return;
    }
    if (k === "Tab" && diagram.boxes.length) {
      const order = [...diagram.boxes].sort((a, b) => a.y - b.y || a.x - b.x);
      const idx = single ? order.findIndex((b) => b.id === single) : -1;
      const next = idx + (e.shiftKey ? -1 : 1);
      if ((idx >= 0 || !e.shiftKey) && next >= 0 && next < order.length) {
        e.preventDefault();
        setSelection([order[next].id]);
        say(`Markerad: ${order[next].attr || "ruta utan bokstav"}.`);
      } else if (idx === -1 && e.shiftKey) {
        e.preventDefault();
        setSelection([order[order.length - 1].id]);
      }
      return;
    }
    if ((k === "g" || k === "G") && selectedBoxes.length >= 2) { e.preventDefault(); groupSelection(); return; }
    if (k.length === 1 && selectedBoxes.length === 1 && selection.length === 1) {
      const attr = attrs.find((a) => a.toLowerCase() === k.toLowerCase());
      if (attr) { e.preventDefault(); assignLetter(selectedBoxes[0], attr); }
    }
  }

  // ---------- Hyllan ----------
  const placedAttrs = new Set(diagram.boxes.map((b) => b.attr).filter(Boolean));
  const unplaced = attrs.filter((a) => !placedAttrs.has(a));
  const shelfDrag = useRef(null);
  const suppressClickUntil = useRef(0);
  const shelfHandlers = (attr) => ({
    onPointerDown: (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      e.preventDefault();
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* som ovan */ }
      shelfDrag.current = { attr, x: e.clientX, y: e.clientY, moved: false };
    },
    onPointerMove: (e) => {
      const s = shelfDrag.current;
      if (!s) return;
      if (!s.moved && Math.hypot(e.clientX - s.x, e.clientY - s.y) > 5) s.moved = true;
      if (s.moved) setDrag(overSvg(e) ? { type: "ghost", attr, point: toWorld(e) } : { type: "ghost", attr, point: null });
    },
    onPointerUp: (e) => {
      const s = shelfDrag.current;
      shelfDrag.current = null;
      setDrag(null);
      if (!s?.moved) return;
      suppressClickUntil.current = Date.now() + 400;
      if (overSvg(e)) placeAttr(attr, toWorld(e));
    },
    onPointerCancel: () => { shelfDrag.current = null; setDrag(null); },
    onClick: () => {
      if (Date.now() < suppressClickUntil.current) return;
      placeAttr(attr);
    },
  });

  // ---------- Kontroll och rättning ----------
  const check = useMemo(() => compareDrawing(diagram, item.attrs, item.fds), [diagram, item]);
  const types = useMemo(() => (graded ? arrowTypes(diagram, item.attrs, item.fds) : {}), [graded, diagram, item]);

  // Saknade pilar som streckade spöken, där rutorna finns på ytan.
  const ghosts = useMemo(() => {
    if (!showCheck) return [];
    const out = [];
    for (const m of check.missing) {
      const boxOf = (a) => diagram.boxes.find((b) => b.attr === a);
      const target = boxOf(m.attr);
      const members = m.lhs.map(boxOf);
      if (!target || members.some((b) => !b)) continue;
      let temp = diagram;
      let from;
      let ghostGroup = null;
      if (members.length === 1) from = { kind: "box", id: members[0].id };
      else {
        const existing = diagram.groups.find((g) => g.members.length === members.length && members.every((b) => g.members.includes(b.id)));
        if (existing) from = { kind: "group", id: existing.id };
        else {
          const id = "ghost-" + m.lhs.join("");
          temp = { ...diagram, groups: [...diagram.groups, { id, members: members.map((b) => b.id) }] };
          from = { kind: "group", id };
          ghostGroup = groupRect(temp.groups[temp.groups.length - 1], temp);
        }
      }
      const arrow = { id: "ghost", from, to: { kind: "box", id: target.id } };
      const geo = arrowGeometry(arrow, { ...temp, arrows: [...temp.arrows, arrow] });
      if (geo) out.push({ key: pairText(m), geo, ghostGroup });
    }
    return out;
  }, [showCheck, check, diagram]);

  const letterTarget = (() => {
    if (single && diagram.boxes.some((b) => b.id === single)) return diagram.boxes.find((b) => b.id === single);
    const blanks = diagram.boxes.filter((b) => !b.attr);
    return blanks.length ? blanks[blanks.length - 1] : null;
  })();
  const letterChoices = letterTarget ? attrs.filter((a) => !placedAttrs.has(a) || a === letterTarget.attr) : [];

  const hasContent = diagram.boxes.length > 0;
  const canHelp = diagram.arrows.length > 0 || helperShown;

  // ---------- Rendering ----------
  const arrowClass = (a) => {
    if (selection.includes(a.id)) return "stroke-pine";
    if (showCheck && check.wrongArrowIds.has(a.id)) return "stroke-wrong";
    if (graded && types[a.id] === "partial") return "stroke-wrong";
    if (graded && types[a.id] === "transitive") return "stroke-brass";
    return "stroke-ink";
  };
  const markerFor = (cls) => `url(#fd-head-${cls.replace("stroke-", "")})`;

  return (
    <div className="mt-4 select-none">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1.5" role="radiogroup" aria-label="Verktyg">
          {TOOLS.map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={tool === key}
              onClick={() => { setTool(key); setPending(null); }}
              className={`chip ${tool === key ? "chip-on" : ""}`}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="mx-1 h-6 w-px bg-line" aria-hidden="true" />
        <button type="button" className="chip fd-tool" onClick={groupSelection} disabled={selectedBoxes.length < 2} title="Gruppera markerade rutor (G)">Gruppera</button>
        <button type="button" className="chip fd-tool" onClick={deleteSelection} disabled={!selection.length} aria-label="Radera markerade" title="Radera (Delete)">
          <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true"><path d="M7 3h6m-9 3h12m-10 0 .7 10.2a1 1 0 0 0 1 .8h4.6a1 1 0 0 0 1-.8L14 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button type="button" className="chip fd-tool" onClick={() => dispatch({ type: "undo" })} disabled={!state.past.length} title="Ångra (⌘Z / Ctrl+Z)">Ångra</button>
        <button type="button" className="chip fd-tool" onClick={() => dispatch({ type: "redo" })} disabled={!state.future.length} title="Gör om (⇧⌘Z / Ctrl+Y)">Gör om</button>
      </div>

      <p className="mt-2 text-xs text-ink/65">{tool === "arrow" && pending ? `Källa: ${labelOf(diagram, pending)} — tryck på målet.` : HINTS[tool]}</p>

      <div ref={shelfRef} className="mt-2 flex min-h-[2.5rem] flex-wrap items-center gap-1.5">
        <span className="text-sm text-ink/65">Hyllan:</span>
        {unplaced.map((a) => (
          <button
            key={a}
            type="button"
            {...shelfHandlers(a)}
            className="h-9 w-9 touch-none rounded-md border border-ink/60 bg-white font-mono text-[15px] transition-colors duration-150 hover:border-pine hover:bg-pine/[0.06]"
            aria-label={`Lägg ut ${a}`}
          >
            {a}
          </button>
        ))}
        {unplaced.length === 0 && <span className="text-sm text-ink/50">alla attribut ligger på ytan</span>}
        {unplaced.length > 1 && (
          <button type="button" className="btn-quiet text-sm" onClick={() => { commit(placeAll(diagram, attrs)); say("Alla attribut utlagda."); }}>Lägg ut alla</button>
        )}
      </div>

      <div className="mt-1 flex min-h-[2.25rem] flex-wrap items-center gap-1.5" aria-label="Bokstav för rutan">
        {letterTarget && (!letterTarget.attr || single === letterTarget.id) && letterChoices.length > 0 && (<>
          <span className="text-sm text-ink/65">{letterTarget.attr ? `Byt bokstav på ${letterTarget.attr}:` : "Ny ruta — vilken bokstav?"}</span>
          {letterChoices.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => assignLetter(letterTarget.id, a)}
              className={`h-8 min-w-8 rounded-md border px-2 font-mono text-sm transition-colors duration-150 ${letterTarget.attr === a ? "border-pine bg-pine text-white" : "border-line hover:border-pine hover:bg-pine/[0.06]"}`}
            >
              {a}
            </button>
          ))}
        </>)}
      </div>

      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="mt-2 overflow-hidden rounded-lg border border-line bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-pine"
        aria-label="Rityta för beroendediagram. Tab växlar ruta, piltangenter flyttar, bokstav sätter bokstav, G grupperar, Delete raderar, Cmd/Ctrl+Z ångrar."
        role="group"
      >
        <svg
          ref={svgRef}
          data-fd-surface=""
          viewBox={view ? `${view.x} ${view.y} ${view.w} ${view.h}` : `0 0 ${WORLD.w} ${WORLD.h}`}
          className={`block h-auto w-full touch-none select-none ${tool === "pen" ? "cursor-crosshair" : ""}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={() => setHover(null)}
          aria-hidden="true"
        >
          <defs>
            {[["ink", "fill-ink"], ["pine", "fill-pine"], ["wrong", "fill-wrong"], ["brass", "fill-brass"]].map(([c, fill]) => (
              <marker key={c} id={`fd-head-${c}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" className={fill} />
              </marker>
            ))}
            <pattern id="fd-dots" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="12" cy="12" r="0.9" className="fill-ink/15" />
            </pattern>
          </defs>
          <rect width={WORLD.w} height={WORLD.h} fill="url(#fd-dots)" />
          {view && <rect width={WORLD.w} height={WORLD.h} className="fill-none stroke-line" strokeWidth="2" />}
          {!hasContent && (
            <text x={WORLD.w / 2} y={WORLD.h / 2} textAnchor="middle" className="fill-ink/40" fontSize="15">
              Dra ut attributen ur hyllan, eller rita med pennan
            </text>
          )}

          {diagram.groups.map((g) => {
            const r = groupRect(g, diagram);
            if (!r) return null;
            const sel = selection.includes(g.id);
            return <rect key={g.id} x={r.x} y={r.y} width={r.w} height={r.h} rx="10" className={`${sel ? "stroke-pine" : "stroke-ink"} fill-none`} strokeWidth={sel ? 2.5 : 1.6} />;
          })}

          {ghosts.map((gh) => (
            <g key={gh.key} className="pointer-events-none">
              {gh.ghostGroup && <rect x={gh.ghostGroup.x} y={gh.ghostGroup.y} width={gh.ghostGroup.w} height={gh.ghostGroup.h} rx="10" className="fill-none stroke-pine" strokeWidth="1.4" strokeDasharray="5 4" />}
              <path d={gh.geo.d} className="fill-none stroke-pine" strokeWidth="1.8" strokeDasharray="6 5" markerEnd="url(#fd-head-pine)" opacity="0.8" />
            </g>
          ))}

          {diagram.arrows.map((a) => {
            const geo = arrowGeometry(a, diagram);
            if (!geo) return null;
            const cls = arrowClass(a);
            const t = graded ? types[a.id] : null;
            return (
              <g key={a.id}>
                <path d={geo.d} className={`${cls} fill-none`} strokeWidth={selection.includes(a.id) ? 2.8 : 1.8} markerEnd={markerFor(cls)} />
                {t && (
                  <g transform={`translate(${geo.mid.x} ${geo.mid.y})`}>
                    <circle r="10" className={t === "partial" ? "fill-wrong" : "fill-brass"} />
                    <text textAnchor="middle" dy="4.5" fontSize="13" fontWeight="600" className="fill-white">{t === "partial" ? "P" : "T"}</text>
                  </g>
                )}
              </g>
            );
          })}

          {diagram.boxes.map((b) => {
            const r = boxRect(b);
            const sel = selection.includes(b.id);
            const isPending = pending?.id === b.id;
            return (
              <g key={b.id}>
                <rect x={r.x} y={r.y} width={r.w} height={r.h} rx="5" className={`fill-white ${sel || isPending ? "stroke-pine" : "stroke-ink"}`} strokeWidth={sel || isPending ? 2.6 : 1.6} />
                <text x={b.x} y={b.y + 7} textAnchor="middle" fontSize="20" className={b.attr ? "fill-ink" : "fill-ink/35"} style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
                  {b.attr || "?"}
                </text>
              </g>
            );
          })}

          {pending?.kind === "group" && (() => {
            const r = shapeRect(pending, diagram);
            return r ? <rect x={r.x} y={r.y} width={r.w} height={r.h} rx="10" className="fill-none stroke-pine" strokeWidth="2.6" /> : null;
          })()}

          {tool === "select" && !drag && handleShapes().map((ref) => {
            const h = handlePos(ref);
            return h ? <circle key={"h" + ref.id} cx={h.x} cy={h.y} r="6" className="fill-pine stroke-white" strokeWidth="2" /> : null;
          })}

          {drag?.type === "marquee" && (
            <rect
              x={Math.min(drag.start.x, drag.point.x)} y={Math.min(drag.start.y, drag.point.y)}
              width={Math.abs(drag.point.x - drag.start.x)} height={Math.abs(drag.point.y - drag.start.y)}
              className="fill-pine/[0.06] stroke-pine" strokeWidth="1" strokeDasharray="4 3"
            />
          )}
          {drag?.type === "link" && (() => {
            const r = shapeRect(drag.from, diagram);
            if (!r) return null;
            return <line x1={r.x + r.w / 2} y1={r.y + r.h / 2} x2={drag.point.x} y2={drag.point.y} className="stroke-pine" strokeWidth="2" strokeDasharray="5 4" markerEnd="url(#fd-head-pine)" />;
          })()}
          {drag?.type === "stroke" && drag.points.length > 1 && (
            <polyline points={drag.points.map((q) => `${q.x},${q.y}`).join(" ")} className="fill-none stroke-ink/70" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          )}
          {fading.map((s) => (
            <polyline key={s.id} points={s.points.map((q) => `${q.x},${q.y}`).join(" ")} className="fd-fade fill-none stroke-ink/50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          ))}
          {drag?.type === "ghost" && drag.point && (
            <g opacity="0.6">
              <rect x={drag.point.x - BOX / 2} y={drag.point.y - BOX / 2} width={BOX} height={BOX} rx="5" className="fill-white stroke-pine" strokeWidth="2" />
              <text x={drag.point.x} y={drag.point.y + 7} textAnchor="middle" fontSize="20" className="fill-ink">{drag.attr}</text>
            </g>
          )}
        </svg>
      </div>
      <p className="sr-only" aria-live="polite">{message}</p>

      {graded && diagram.arrows.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink/75" aria-label="Förklaring till pilarna">
          <li className="flex items-center gap-1.5"><span className="inline-block h-0.5 w-5 bg-wrong" /> <span className="font-medium">P</span> partiellt: vänsterledet är en äkta delmängd av en kandidatnyckel, högerledet icke-primärt</li>
          <li className="flex items-center gap-1.5"><span className="inline-block h-0.5 w-5 bg-brass" /> <span className="font-medium">T</span> transitivt: vänsterledet är varken superkey eller del av en kandidatnyckel, högerledet icke-primärt</li>
          <li className="flex items-center gap-1.5"><span className="inline-block h-0.5 w-5 bg-ink" /> övriga</li>
        </ul>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" className="btn-secondary text-sm" onClick={() => setShowCheck((v) => !v)} aria-pressed={showCheck} disabled={!hasContent}>
          {showCheck ? "Dölj kontrollen" : "Kontrollera ritningen"}
        </button>
        {canHelp ? (
          <button type="button" className="btn-quiet text-sm" onClick={drawFromFds}>Rita från FD:erna</button>
        ) : (
          <button type="button" className="btn-quiet text-sm text-ink/65" onClick={() => setHelperShown(true)}>Visa ritahjälp</button>
        )}
        {hasContent && !confirmClear && <button type="button" className="btn-quiet text-sm" onClick={() => setConfirmClear(true)}>Rensa ritning</button>}
        {confirmClear && (
          <span className="flex items-center gap-2 text-sm">
            <span>Rensa hela ritningen?</span>
            <button type="button" className="btn-secondary" onClick={clearDrawing}>Ja, rensa</button>
            <button type="button" className="btn-quiet" onClick={() => setConfirmClear(false)}>Avbryt</button>
          </span>
        )}
      </div>

      {showCheck && hasContent && (
        <div className={`mt-3 rounded-lg border-l-2 p-3 text-sm ${check.ok ? "border-correct bg-correct-bg" : "border-brass bg-paper"}`} role="status">
          {check.ok ? (
            <p>Ritningen stämmer med beroendena: {check.correct.length} {check.correct.length === 1 ? "pil" : "pilar"}, alla attribut på plats.</p>
          ) : (
            <ul className="space-y-1">
              <li>{check.correct.length} av {check.correct.length + check.missing.length} givna pilar ritade.</li>
              {check.missing.length > 0 && <li><span className="font-medium">Saknas</span> (streckade): {check.missing.map(pairText).join(", ")}.</li>}
              {check.wrong.map((w) => (
                <li key={w.arrowId + w.attr}>
                  <span className="font-medium text-wrong">{pairText(w)}</span>
                  {w.reason === "derived" ? " följer av de givna men står inte i uppgiften — rita bara de givna." : w.reason === "trivial" ? " är trivialt." : " står inte i uppgiften."}
                </li>
              ))}
              {check.unplaced.length > 0 && <li>Inte utlagda: {check.unplaced.join(", ")}.</li>}
              {check.unlabeled.length > 0 && <li>{check.unlabeled.length === 1 ? "En ruta saknar" : `${check.unlabeled.length} rutor saknar`} bokstav.</li>}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
