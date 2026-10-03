import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import {
  WORLD, BOX, boxRect, groupRect, shapeRect, arrowGeometry, hitTest, removeElements, addGroup,
  compareDrawing, arrowTypes, layoutFromFds, pairText, historyReducer, gridDiagram, normalizeDiagram, drawnPairs,
} from "../../lib/fdDiagram.js";
import { press, hold, drag as dragTo, release, deleteButtonPos, deletable, labelOf, HOLD_MS } from "../../lib/fdGesture.js";
import { load, save } from "../../lib/storage.js";

// Ritytan för beroendediagram, i Björns tavelstil. Eget SVG med pointer
// events, så att mus, styrplatta och finger fungerar likadant. Alla
// attribut ligger utlagda från start; gesterna finns i lib/fdGesture.js.
// Ritningen sparas per uppgift i localStorage (sysb23:fdritning:<id>).
//
// Pilar ser alltid likadana ut. Markering visas som en tunn kontur, och det
// enda som får färga pilar är rättningen (P/T) och ritkontrollen.

export default function FdCanvas({ item, graded = false, showCheck = false, pickMode = false, pickedArrowId = null, onPick, onDiagramChange }) {
  const storageKey = `fdritning:${item.id}`;
  const [state, dispatch] = useReducer(historyReducer, null, () => ({ diagram: normalizeDiagram(load(storageKey, null), item.attrs), past: [], future: [] }));
  const { diagram } = state;
  const diagramRef = useRef(diagram);
  diagramRef.current = diagram;

  const [selection, setSelection] = useState([]);
  const [pending, setPending] = useState(null);
  const [gesture, setGesture] = useState(null);
  const gestureRef = useRef(null);
  const [hint, setHint] = useState(null);
  const [helperShown, setHelperShown] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [message, setMessage] = useState("");
  const [keyboard, setKeyboard] = useState(false);
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const holdTimer = useRef(null);

  useEffect(() => { save(storageKey, diagram); onDiagramChange?.(diagram); }, [storageKey, diagram]); // eslint-disable-line react-hooks/exhaustive-deps

  // Smal yta: kvadratisk vy runt innehållet, så att lådorna blir stora nog
  // för fingret. Räknas om först när en gest är klar.
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    // Mät direkt (ResizeObserver avfyras inte i en flik som inte ritas), och
    // följ sedan ändringar både via observatören och fönstrets resize.
    const measure = () => setNarrow(el.getBoundingClientRect().width < 520);
    measure();
    window.addEventListener("resize", measure);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    return () => { window.removeEventListener("resize", measure); ro?.disconnect(); };
  }, []);
  const [view, setView] = useState(null);
  useEffect(() => {
    if (gesture) return;
    if (!narrow) { setView(null); return; }
    const rects = [...diagram.boxes.map(boxRect), ...diagram.groups.map((g) => groupRect(g, diagram)).filter(Boolean)];
    if (!rects.length) { setView(null); return; }
    const x1 = Math.min(...rects.map((r) => r.x)) - 40;
    const y1 = Math.min(...rects.map((r) => r.y)) - 40;
    const x2 = Math.max(...rects.map((r) => r.x + r.w)) + 40;
    const y2 = Math.max(...rects.map((r) => r.y + r.h)) + 40;
    const size = Math.min(WORLD.w, Math.max(x2 - x1, y2 - y1, 300));
    const x = Math.max(0, Math.min(WORLD.w - size, (x1 + x2) / 2 - size / 2));
    const y = size >= WORLD.h ? (WORLD.h - size) / 2 : Math.max(0, Math.min(WORLD.h - size, (y1 + y2) / 2 - size / 2));
    setView({ x, y, w: size, h: size });
  }, [narrow, diagram, gesture]);

  const commit = (next, before) => dispatch({ type: "commit", diagram: next, before });

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
  const ctx = () => ({ diagram: diagramRef.current, selection, pending, tol: Math.max(6, 10 / scale()), slop: 5 / scale() });
  const setG = (g) => { gestureRef.current = g; setGesture(g); };

  // ---------- Pekaren ----------
  function onPointerDown(e) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const p = toWorld(e);
    try { svgRef.current.setPointerCapture(e.pointerId); } catch { /* syntetiska händelser saknar pekare */ }
    containerRef.current?.focus({ preventScroll: true });
    setKeyboard(false);
    setConfirmClear(false);
    if (pickMode) {
      const hit = hitTest(p, diagramRef.current, ctx().tol);
      if (hit?.kind === "arrow") {
        const pair = drawnPairs(diagramRef.current).find((x) => x.arrowId === hit.id);
        if (pair) onPick?.(pair, hit.id);
        return;
      }
    }
    const g = press(ctx(), p, { shift: e.shiftKey || e.metaKey || e.ctrlKey, time: performance.now() });
    setG(g);
    clearTimeout(holdTimer.current);
    if (g.mode === "pending") {
      holdTimer.current = setTimeout(() => {
        const cur = gestureRef.current;
        const held = hold(cur, performance.now());
        if (held !== cur) setG(held);
      }, HOLD_MS + 10);
    }
  }

  function onPointerMove(e) {
    const g = gestureRef.current;
    if (!g || g.mode === "delete") return;
    const r = dragTo(g, toWorld(e), ctx(), performance.now());
    if (r.gesture !== g) setG(r.gesture);
    if (r.live) dispatch({ type: "live", diagram: r.live });
    setHint(r.hint || null);
  }

  function onPointerUp(e) {
    clearTimeout(holdTimer.current);
    const g = gestureRef.current;
    setG(null);
    setHint(null);
    if (!g) return;
    const p = e.type === "pointercancel" ? g.point || g.start || { x: 0, y: 0 } : toWorld(e);
    const c = { ...ctx(), diagram: g.before && g.live ? g.before : diagramRef.current };
    const out = release(g, p, c);
    if (out.diagram !== c.diagram) commit(out.diagram, out.before);
    else if (g.live) dispatch({ type: "live", diagram: g.before });
    setSelection(out.selection);
    setPending(out.pending);
    if (out.message) setMessage(out.message);
  }

  // ---------- Åtgärder ----------
  const selectedBoxes = selection.filter((id) => diagram.boxes.some((b) => b.id === id));
  function deleteSelection() {
    const ids = deletable(diagram, selection);
    if (!ids.length) { if (selection.length) setMessage("Attributens lådor kan inte tas bort — ta bort pilarna eller gruppen."); return; }
    commit(removeElements(diagram, ids));
    setSelection([]);
    setPending(null);
    setMessage("Borttaget.");
  }
  function groupSelection() {
    if (selectedBoxes.length < 2) return;
    const r = addGroup(diagram, selectedBoxes);
    if (r.diagram !== diagram) commit(r.diagram);
    setSelection([]);
    setPending(null);
    setMessage(`Grupp ${labelOf(r.diagram, { kind: "group", id: r.id })}.`);
  }
  function drawFromFds() {
    commit(layoutFromFds(item.attrs, item.fds));
    setSelection([]);
    setPending(null);
    setMessage("Ritat från beroendena. Ångra med ⌘Z om du vill tillbaka till din egen.");
  }
  function clearDrawing() {
    commit(gridDiagram(item.attrs));
    setSelection([]);
    setPending(null);
    setConfirmClear(false);
  }

  function onKeyDown(e) {
    const mod = e.metaKey || e.ctrlKey;
    const k = e.key;
    if (mod && k.toLowerCase() === "z") { e.preventDefault(); dispatch({ type: e.shiftKey ? "redo" : "undo" }); return; }
    if (mod && k.toLowerCase() === "y") { e.preventDefault(); dispatch({ type: "redo" }); return; }
    if (mod) return;
    if (k === "Delete" || k === "Backspace") { if (selection.length) { e.preventDefault(); deleteSelection(); } return; }
    if (k === "Escape") { setSelection([]); setPending(null); setG(null); setHint(null); return; }
    if (k.startsWith("Arrow") && selectedBoxes.length + selection.filter((id) => diagram.groups.some((g) => g.id === id)).length) {
      e.preventDefault();
      const step = e.shiftKey ? 24 : 8;
      const dx = k === "ArrowLeft" ? -step : k === "ArrowRight" ? step : 0;
      const dy = k === "ArrowUp" ? -step : k === "ArrowDown" ? step : 0;
      const moving = new Set(selectedBoxes);
      for (const g of diagram.groups) if (selection.includes(g.id)) g.members.forEach((m) => moving.add(m));
      commit({ ...diagram, boxes: diagram.boxes.map((b) => (moving.has(b.id) ? { ...b, x: Math.max(27, Math.min(WORLD.w - 27, b.x + dx)), y: Math.max(27, Math.min(WORLD.h - 27, b.y + dy)) } : b)) });
      return;
    }
    if (k === "Tab" && diagram.boxes.length) {
      const order = [...diagram.boxes].sort((a, b) => a.y - b.y || a.x - b.x);
      const idx = selection.length === 1 ? order.findIndex((b) => b.id === selection[0]) : -1;
      const next = idx + (e.shiftKey ? -1 : 1);
      if ((idx >= 0 || !e.shiftKey) && next >= 0 && next < order.length) {
        e.preventDefault();
        setSelection([order[next].id]);
        setPending({ kind: "box", id: order[next].id });
        setMessage(`Markerad: ${order[next].attr}.`);
      }
      return;
    }
    if ((k === "g" || k === "G") && selectedBoxes.length >= 2) { e.preventDefault(); groupSelection(); }
  }

  // ---------- Kontroll och rättning ----------
  const check = useMemo(() => compareDrawing(diagram, item.attrs, item.fds), [diagram, item]);
  const types = useMemo(() => (graded ? arrowTypes(diagram, item.attrs, item.fds) : {}), [graded, diagram, item]);

  // Saknade pilar som streckade spöken.
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

  const canHelp = diagram.arrows.length > 0 || helperShown;
  const del = !gesture ? deleteButtonPos(diagram, selection) : null;
  const lifted = gesture?.mode === "move" && (gesture.lifted || gesture.moved) ? new Set(Object.keys(gesture.orig || {})) : new Set();

  // Pilfärg: bara rättningen och ritkontrollen skiljer pilar åt.
  const arrowColor = (a) => {
    if (showCheck && check.wrongArrowIds.has(a.id)) return "wrong";
    if (graded && types[a.id] === "partial") return "wrong";
    if (graded && types[a.id] === "transitive") return "brass";
    return "ink";
  };
  const STROKE = { ink: "stroke-ink", wrong: "stroke-wrong", brass: "stroke-brass" };
  const outlined = (id) => selection.includes(id) || (pickMode && pickedArrowId === id);

  return (
    <div className="mt-3 select-none">
      <p className="text-sm text-ink/75">
        {pickMode
          ? "Tryck på pilen som bryter mot normalformen."
          : <>Dra från låda till låda = pil. Släpp en låda på en annan = gruppera. <span className="text-ink/55">Flytta: markera lådan först (eller håll in), och dra.</span></>}
      </p>

      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={(e) => { setKeyboard(true); onKeyDown(e); }}
        onBlur={() => setKeyboard(false)}
        className={`mt-2 overflow-hidden rounded-lg border bg-white outline-none ${keyboard ? "border-pine ring-2 ring-pine/40" : "border-line"}`}
        aria-label="Rityta för beroendediagram. Tab växlar låda, piltangenter flyttar, G grupperar markerade lådor, Delete tar bort markerad pil eller grupp, Cmd/Ctrl+Z ångrar."
        role="group"
      >
        <svg
          ref={svgRef}
          data-fd-surface=""
          viewBox={view ? `${view.x} ${view.y} ${view.w} ${view.h}` : `0 0 ${WORLD.w} ${WORLD.h}`}
          className="block h-auto w-full touch-none select-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
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

          {diagram.groups.map((g) => {
            const leaving = hint?.leave.includes(g.id);
            const r = groupRect(leaving ? { ...g, members: g.members.filter((m) => m !== hint.box) } : g, diagram);
            if (!r) return null;
            return (
              <g key={g.id}>
                {outlined(g.id) && <rect x={r.x - 4} y={r.y - 4} width={r.w + 8} height={r.h + 8} rx="13" className="fill-none stroke-pine" strokeWidth="1" />}
                <rect x={r.x} y={r.y} width={r.w} height={r.h} rx="10" className="fill-none stroke-ink" strokeWidth="1.6" strokeDasharray={leaving ? "5 4" : undefined} opacity={leaving ? 0.6 : 1} />
              </g>
            );
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
            const color = arrowColor(a);
            const t = graded ? types[a.id] : null;
            return (
              <g key={a.id}>
                {outlined(a.id) && <path d={geo.d} className="fill-none stroke-pine/25" strokeWidth="9" strokeLinecap="round" />}
                <path d={geo.d} className={`${STROKE[color]} fill-none`} strokeWidth="1.8" markerEnd={`url(#fd-head-${color})`} />
                {t && (
                  <g transform={`translate(${geo.mid.x} ${geo.mid.y})`}>
                    <circle r="10" className={t === "partial" ? "fill-wrong" : "fill-brass"} />
                    <text textAnchor="middle" dy="4.5" fontSize="13" fontWeight="600" className="fill-white">{t === "partial" ? "P" : "T"}</text>
                  </g>
                )}
              </g>
            );
          })}

          {[...diagram.boxes].sort((a, b) => lifted.has(a.id) - lifted.has(b.id)).map((b) => {
            const r = boxRect(b);
            const up = lifted.has(b.id);
            return (
              <g key={b.id} opacity={up && hint?.target ? 0.55 : 1}>
                {up && <rect x={r.x + 3} y={r.y + 4} width={r.w} height={r.h} rx="5" className="fill-ink/10" />}
                {outlined(b.id) && <rect x={r.x - 4} y={r.y - 4} width={r.w + 8} height={r.h + 8} rx="8" className="fill-none stroke-pine" strokeWidth="1" />}
                <rect x={r.x} y={r.y} width={r.w} height={r.h} rx="5" className="fill-white stroke-ink" strokeWidth="1.6" />
                <text x={b.x} y={b.y + 7} textAnchor="middle" fontSize="20" className="fill-ink" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>{b.attr}</text>
              </g>
            );
          })}

          {hint?.target && (() => {
            const r = shapeRect(hint.target, diagram);
            if (!r) return null;
            const inset = hint.target.kind === "box" ? 5 : 4;
            return (
              <g className="pointer-events-none">
                <rect x={r.x + inset} y={r.y + inset} width={r.w - 2 * inset} height={r.h - 2 * inset} rx="4" className="fill-pine/[0.08] stroke-pine" strokeWidth="2.2" strokeDasharray="4 3" />
                <text x={r.x + r.w / 2} y={r.y - 8} textAnchor="middle" fontSize="13" fontWeight="600" className="fill-pine">
                  {hint.target.kind === "box" ? "Släpp: gruppera" : "Släpp: lägg till i gruppen"}
                </text>
              </g>
            );
          })()}

          {gesture?.mode === "link" && gesture.point && (() => {
            const r = shapeRect(gesture.target, diagram);
            if (!r) return null;
            return <line x1={r.x + r.w / 2} y1={r.y + r.h / 2} x2={gesture.point.x} y2={gesture.point.y} className="stroke-ink/60" strokeWidth="1.8" strokeDasharray="5 4" markerEnd="url(#fd-head-ink)" />;
          })()}

          {gesture?.mode === "marquee" && gesture.moved !== undefined && gesture.point && Math.hypot(gesture.point.x - gesture.start.x, gesture.point.y - gesture.start.y) > 4 && (
            <rect
              x={Math.min(gesture.start.x, gesture.point.x)} y={Math.min(gesture.start.y, gesture.point.y)}
              width={Math.abs(gesture.point.x - gesture.start.x)} height={Math.abs(gesture.point.y - gesture.start.y)}
              className="fill-pine/[0.05] stroke-pine/60" strokeWidth="1" strokeDasharray="4 3"
            />
          )}

          {del && (
            <g transform={`translate(${del.x} ${del.y})`} className="cursor-pointer">
              <circle r="9" className="fill-white stroke-ink/50" strokeWidth="1" />
              <path d="M -3.5 -3.5 L 3.5 3.5 M 3.5 -3.5 L -3.5 3.5" className="stroke-ink" strokeWidth="1.6" strokeLinecap="round" />
            </g>
          )}
        </svg>
      </div>
      <p className="mt-1 min-h-[1.25rem] text-xs text-ink/65" aria-live="polite">{message}</p>

      {graded && diagram.arrows.length > 0 && (
        <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink/75" aria-label="Förklaring till pilarna">
          <li className="flex items-center gap-1.5"><span className="inline-block h-0.5 w-5 bg-wrong" /> <span className="font-medium">P</span> partiellt beroende</li>
          <li className="flex items-center gap-1.5"><span className="inline-block h-0.5 w-5 bg-brass" /> <span className="font-medium">T</span> transitivt beroende</li>
          <li className="flex items-center gap-1.5"><span className="inline-block h-0.5 w-5 bg-ink" /> övriga</li>
        </ul>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <button type="button" className="chip chip-sm fd-tool" onClick={() => dispatch({ type: "undo" })} disabled={!state.past.length} title="Ångra (⌘Z / Ctrl+Z)">Ångra</button>
        <button type="button" className="chip chip-sm fd-tool" onClick={() => dispatch({ type: "redo" })} disabled={!state.future.length} title="Gör om (⇧⌘Z / Ctrl+Y)">Gör om</button>
        {selectedBoxes.length >= 2 && <button type="button" className="chip chip-sm" onClick={groupSelection} title="Gruppera markerade lådor (G)">Gruppera ({selectedBoxes.length})</button>}
        <span className="mx-1 h-5 w-px bg-line" aria-hidden="true" />
        {canHelp
          ? <button type="button" className="btn-quiet px-1 py-0.5 text-sm" onClick={drawFromFds}>Rita från FD:erna</button>
          : <button type="button" className="btn-quiet px-1 py-0.5 text-sm text-ink/65" onClick={() => setHelperShown(true)}>Visa ritahjälp</button>}
        {!confirmClear && <button type="button" className="btn-quiet px-1 py-0.5 text-sm" onClick={() => setConfirmClear(true)}>Börja om</button>}
        {confirmClear && (
          <span className="flex items-center gap-2 text-sm">
            <span>Ta bort alla pilar och grupper?</span>
            <button type="button" className="btn-secondary px-3 py-1" onClick={clearDrawing}>Ja</button>
            <button type="button" className="btn-quiet px-1 py-0.5" onClick={() => setConfirmClear(false)}>Avbryt</button>
          </span>
        )}
      </div>

      {showCheck && (
        <div className={`mt-3 rounded-lg border-l-2 p-3 text-sm ${check.ok ? "border-correct bg-correct-bg" : "border-brass bg-paper"}`} role="status">
          {check.ok ? (
            <p>Ritningen stämmer med beroendena: {check.correct.length} {check.correct.length === 1 ? "pil" : "pilar"}.</p>
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
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
