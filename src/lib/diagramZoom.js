// Zoomstegen för BPMN-diagrammen. Skalan är relativ diagrammets egen storlek
// (1 = en enhet i viewBox per pixel, där aktivitetsrutornas text är 11 px).
// "fit" betyder Anpassa: diagrammet fyller bredden, upp till maxScale.
export const ZOOM_STEPS = [0.5, 0.6, 0.75, 0.9, 1, 1.15, 1.3, 1.5, 1.75, 2, 2.5, 3];
export const MIN_ZOOM = ZOOM_STEPS[0];
export const MAX_ZOOM = ZOOM_STEPS[ZOOM_STEPS.length - 1];

// Skalan i läget Anpassa: så stort som bredden räcker till, aldrig över maxScale.
export function fitScale(availableWidth, viewWidth, maxScale = 1) {
  if (!(availableWidth > 0) || !(viewWidth > 0)) return null;
  return Math.min(maxScale, availableWidth / viewWidth);
}

// Den skala som gäller just nu, för knapparna och procentetiketten.
export function currentScale(zoom, fit) {
  return zoom === "fit" ? fit : zoom;
}

// Nästa steg uppåt eller nedåt från den skala som visas. Från Anpassa går
// "+" till första steget som är större än det som syns, så att knappen
// alltid gör diagrammet större (och "−" alltid mindre).
export function stepZoom(scale, direction) {
  const s = scale ?? 1;
  if (direction > 0) return ZOOM_STEPS.find((step) => step > s + 0.005) ?? MAX_ZOOM;
  return [...ZOOM_STEPS].reverse().find((step) => step < s - 0.005) ?? MIN_ZOOM;
}

export function percent(scale) {
  return scale == null ? "" : `${Math.round(scale * 100)} %`;
}
