import { useEffect, useState } from "react";
import { THRESHOLDS } from "../lib/scoring.js";

const BANDS = [
  { grade: "U", from: 0, to: 50, opacity: 0.16 },
  { grade: "E", from: 50, to: 55, opacity: 0.3 },
  { grade: "D", from: 55, to: 65, opacity: 0.44 },
  { grade: "C", from: 65, to: 75, opacity: 0.58 },
  { grade: "B", from: 75, to: 85, opacity: 0.76 },
  { grade: "A", from: 85, to: 100, opacity: 1 },
];

const LEFT = 24;
const RIGHT = 616;
const SPAN = RIGHT - LEFT;
const BAR_Y = 54;
const BAR_H = 22;

const x = (percent) => LEFT + (SPAN * percent) / 100;

// Sidans signaturelement: den svenska betygsstegen som mässingsgraderad skala.
export default function GradeGauge({ percent, grade }) {
  const [pointer, setPointer] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setPointer(percent));
    return () => cancelAnimationFrame(id);
  }, [percent]);

  return (
    <figure className="w-full">
      <svg
        viewBox="0 0 640 118"
        className="w-full"
        role="img"
        aria-label={`Betygsmätare: ${percent} procent, betyg ${grade}.`}
      >
        {BANDS.map((band) => (
          <rect
            key={band.grade}
            x={x(band.from)}
            y={BAR_Y}
            width={x(band.to) - x(band.from) - 1.5}
            height={BAR_H}
            rx="3"
            fill="var(--brass)"
            fillOpacity={band.opacity}
          />
        ))}

        {BANDS.map((band) => (
          <text
            key={`label-${band.grade}`}
            x={(x(band.from) + x(band.to)) / 2}
            y={BAR_Y + BAR_H + 16}
            textAnchor="middle"
            fontSize="14"
            fontWeight="600"
            fill={band.grade === grade ? "var(--pine)" : "rgba(34,40,42,0.55)"}
          >
            {band.grade}
          </text>
        ))}

        {THRESHOLDS.map((threshold) => (
          <g key={threshold}>
            <line
              x1={x(threshold)}
              y1={BAR_Y - 5}
              x2={x(threshold)}
              y2={BAR_Y + BAR_H + 3}
              stroke="rgba(34,40,42,0.3)"
              strokeWidth="1"
            />
            <text
              x={x(threshold)}
              y={BAR_Y + BAR_H + 32}
              textAnchor="middle"
              fontSize="11"
              fill="rgba(34,40,42,0.5)"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {threshold}
            </text>
          </g>
        ))}

        {/* Visaren */}
        <g
          style={{
            transform: `translateX(${x(pointer)}px)`,
            transition: "transform 900ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <path
            d={`M 0 ${BAR_Y - 2} L -7 ${BAR_Y - 14} L 7 ${BAR_Y - 14} Z`}
            fill="var(--pine)"
          />
          <line
            x1="0"
            y1={BAR_Y - 14}
            x2="0"
            y2={BAR_Y + BAR_H + 4}
            stroke="var(--pine)"
            strokeWidth="2.5"
          />
          <text
            x="0"
            y={BAR_Y - 22}
            textAnchor="middle"
            fontSize="15"
            fontWeight="600"
            fill="var(--pine)"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {percent} %
          </text>
        </g>
      </svg>
      <figcaption className="sr-only">
        Betygsskala U till A med trösklarna 50, 55, 65, 75 och 85 procent.
      </figcaption>
    </figure>
  );
}
