import { norm } from "../../lib/modelCheck.js";

// Häftets form: relationsnamn, attribut i parentes, hel understrykning för
// PK, prickad för FK, båda när ett attribut är bådadera. Används för svaret
// medan man skriver och för facit efter rättning, sida vid sida.
function Attr({ name, pk, fk }) {
  const style = {};
  if (pk && fk) {
    style.textDecoration = "underline";
    style.textDecorationThickness = "1.5px";
    style.textUnderlineOffset = "2px";
    style.borderBottom = "1.5px dotted currentColor";
    style.paddingBottom = "2px";
  } else if (pk) {
    style.borderBottom = "1.5px solid currentColor";
  } else if (fk) {
    style.borderBottom = "1.5px dotted currentColor";
  }
  return <span style={style}>{name}</span>;
}

export default function SchemaView({ schema, empty = "Skriv ett schema så ritas det här.", highlight = {} }) {
  if (!schema || schema.relations.length === 0) {
    return <p className="text-sm text-ink/65">{schema?.already3NF ? "R är redan i 3NF." : empty}</p>;
  }
  return (
    <ol className="space-y-2 font-mono text-[14.5px] leading-relaxed">
      {schema.relations.map((rel) => {
        const pk = new Set(rel.pk.map(norm));
        const fk = new Set(rel.fks.flatMap((f) => f.cols.map(norm)));
        const tone = highlight[norm(rel.name)];
        return (
          <li key={rel.name + rel.line} className={tone === "ok" ? "text-correct" : tone === "diff" ? "text-wrong" : "text-ink"}>
            <span className="font-semibold">{rel.name}</span>(
            {rel.attrs.map((a, i) => (
              <span key={a}>
                <Attr name={a} pk={pk.has(norm(a))} fk={fk.has(norm(a))} />
                {i < rel.attrs.length - 1 ? ", " : ""}
              </span>
            ))}
            )
          </li>
        );
      })}
    </ol>
  );
}
