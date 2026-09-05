import { DIAGRAM_IDS } from "./ids.js";
import {
  WorksOnFigure, ParticipationFigure, ReadingDirectionsFigure, WeakEntityFigure,
  ReificationFigure, CrowEndpointsFigure, ChenVsCrowFigure, FourLayersFigure,
  EntityPopulationFigure, RelationshipPopulationFigure, AttributeShapesFigure,
} from "./erFigures.jsx";

const FIGURES = {
  workson: WorksOnFigure,
  deltagande: ParticipationFigure,
  lasriktningar: ReadingDirectionsFigure,
  "svag-entitet": WeakEntityFigure,
  reifiering: ReificationFigure,
  "crow-andpunkter": CrowEndpointsFigure,
  "chen-crow": ChenVsCrowFigure,
  "fyra-lager": FourLayersFigure,
  "population-entiteter": EntityPopulationFigure,
  "population-relationer": RelationshipPopulationFigure,
  attribut: AttributeShapesFigure,
};

if (import.meta.env?.DEV) {
  for (const id of DIAGRAM_IDS) {
    if (!FIGURES[id]) console.warn(`Diagrammet "${id}" finns i ids.js men saknar figur.`);
  }
}

// Platshållaren [[diagram:namn]] i ett kapitel byts mot figuren här. Okänt
// namn renderar ingenting men varnar, så att texten inte visar råtext.
export function Diagram({ id }) {
  const Component = FIGURES[id];
  if (!Component) {
    console.warn(`Okänt diagram: ${id}`);
    return null;
  }
  return <Component />;
}

export { DIAGRAM_RE } from "./ids.js";
