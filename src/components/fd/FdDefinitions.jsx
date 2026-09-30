// Hopfällbar definitionspanel bredvid ritytan: kursens engelska termer med
// svensk förklaring, med egna ord nära nya Fö6. Termerna är desamma som i
// ordlistan (reading.js).

const DEFINITIONS = [
  ["Functional dependency", "funktionellt beroende", "X → Y om två tuples med samma X-värden alltid har samma Y-värden. Det ska gälla i varje tillåten population, inte bara i den data som råkar finnas nu. Vänsterledet X kallas determinant."],
  ["Trivial dependency", "trivialt beroende", "X → Y där Y ⊆ X, till exempel {A, B} → A — säger ingenting. A → {B, C} betyder A → B och A → C, men {A, B} → C kan inte delas upp i A → C och B → C."],
  ["Attribute closure X⁺", "hölje", "Allt X bestämmer. Starta med X; när hela vänsterledet i ett beroende finns i mängden, lägg till högerledet; upprepa tills inget nytt tillkommer."],
  ["Superkey", "supernyckel", "En mängd X vars hölje X⁺ innehåller alla attribut i relationen."],
  ["Candidate key", "kandidatnyckel", "En minimal superkey: tar du bort något attribut slutar den vara superkey."],
  ["Nyckelsökning i fem steg", null, "(1) Skriv upp attributen och beroendena. (2) Attribut som aldrig står till höger om en pil måste ingå i varje nyckel. (3) Räkna höljet och lägg till attribut tills det når allt. (4) Kontrollera att nyckeln är minimal. (5) Hitta ALLA kandidatnycklar innan du klassar attributen."],
  ["Prime attribute", "primärattribut", "Med i minst en kandidatnyckel. Non-prime (icke-primärattribut): med i ingen. Alla kandidatnycklar räknas, inte bara den du väljer som primärnyckel."],
  ["Proper subset", "äkta delmängd", "En delmängd som inte är hela mängden: A och B är äkta delmängder av {A, B}, men {A, B} är det inte."],
  ["1NF", "första normalformen", "Varje attributvärde är ett enda atomärt värde, ingen samling."],
  ["2NF", "andra normalformen", "1NF, och inget non-prime attribut är functionally dependent på en proper subset av någon candidate key. Kan bara brytas när någon kandidatnyckel är sammansatt."],
  ["3NF", "tredje normalformen", "2NF, och inget non-prime attribut är transitively dependent på någon candidate key. Transitivt: X → Z indirekt via X → Y och Y → Z, där Y ↛ X."],
  ["Lossless join", "förlustfri join", "Originalet kan återskapas exakt med join av delarna, för varje population som uppfyller beroendena. För två delar: de gemensamma attributen måste bestämma alla attribut i minst en av dem. Ett exempel som råkar fungera bevisar inget; ett motexempel motbevisar."],
  ["Dependency preservation", "beroendebevarande", "Delrelationernas lokala beroenden medför TILLSAMMANS alla ursprungliga. A → B i R1 och B → C i R2 bevarar A → C. Att båda attributen står i samma relation räcker för att visa att ett beroende är bevarat, men inte för att visa att det gått förlorat."],
];

export default function FdDefinitions() {
  return (
    <details className="card group p-4">
      <summary className="cursor-pointer list-none font-display text-[15px] text-pine">
        <span className="mr-1 inline-block transition-transform duration-150 group-open:rotate-90" aria-hidden="true">›</span>
        Definitioner
      </summary>
      <dl className="mt-3 space-y-3 text-sm">
        {DEFINITIONS.map(([term, sv, text]) => (
          <div key={term}>
            <dt className="font-medium text-ink">{term}{sv && <span className="font-normal text-ink/60"> ({sv})</span>}</dt>
            <dd className="mt-0.5 leading-relaxed text-ink/80">{text}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}
