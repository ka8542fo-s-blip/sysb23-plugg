// De namngivna figurerna som kapiteltexterna bäddar in via [[diagram:namn]].
// Namnen är ett de facto-API mot reading.js — byt aldrig ett namn utan att
// byta platshållaren; ids.js listar dem och testet låser kopplingen.
import {
  Figure, EntityBox, RelationshipDiamond, AttributeOval, Connector, AttributeLink,
  Ratio, Role, Note, Arrow, CrowEntity, CrowMarks, CrowLine, crowEntityHeight, PopulationSet,
} from "./erPrimitives.jsx";

// 1. Grundexemplet Employee — WorksOn — Project.
export function WorksOnFigure() {
  const y = 100;
  return (
    <Figure
      viewBox="0 0 620 200"
      label="Chen-diagram: Employee och Project kopplade genom relationstypen WorksOn, M:N, med attributet assignmentStartDate på relationen."
      caption="Grundexemplet: Employee — WorksOn — Project (M:N). Enkel linje vid Employee, dubbel vid Project; assignmentStartDate ägs av relationstypen, inte av någon av entiteterna."
    >
      <AttributeOval cx={82} cy={30} label="employeeNo" identifier="solid" />
      <AttributeLink x1={82} y1={45} x2={82} y2={78} />
      <EntityBox x={20} y={78} label="Employee" />
      <Connector x1={144} y1={y} x2={244} y2={y} />
      <Ratio x={166} y={y - 10} text="M" />
      <Role x={194} y={y + 18} text="worker" />
      <RelationshipDiamond cx={310} cy={y} w={132} h={64} label="WorksOn" />
      <Connector x1={376} y1={y} x2={476} y2={y} total />
      <Ratio x={454} y={y - 10} text="N" />
      <Role x={426} y={y + 18} text="project" />
      <EntityBox x={476} y={78} label="Project" />
      <AttributeOval cx={538} cy={30} label="projectNo" identifier="solid" />
      <AttributeLink x1={538} y1={45} x2={538} y2={78} />
      <AttributeLink x1={310} y1={132} x2={310} y2={158} />
      <AttributeOval cx={310} cy={173} rx={74} label="assignmentStartDate" />
    </Figure>
  );
}

// 2. Partial mot total participation, samma 1:N-ratio.
function MiniLeads({ ox, total }) {
  const y = 60;
  return (
    <g>
      <EntityBox x={ox} y={42} w={92} h={36} label="Employee" />
      <Connector x1={ox + 92} y1={y} x2={ox + 126} y2={y} />
      <Ratio x={ox + 109} y={y - 8} text="1" />
      <RelationshipDiamond cx={ox + 170} cy={y} w={88} h={48} label="Leads" />
      <Connector x1={ox + 214} y1={y} x2={ox + 248} y2={y} total={total} />
      <Ratio x={ox + 231} y={y - 8} text="N" />
      <EntityBox x={ox + 248} y={42} w={80} h={36} label="Project" />
    </g>
  );
}

export function ParticipationFigure() {
  return (
    <Figure
      viewBox="0 0 680 150"
      label="Två Chen-diagram sida vid sida: Employee — Leads — Project med ratio 1:N. Till vänster enkel linje vid Project (partial participation), till höger dubbel linje vid Project (total participation)."
      caption="Samma 1:N-ratio i båda. Bara deltagandelinjen vid Project skiljer: enkel = ett projekt får sakna ledare, dubbel = varje projekt har minst en. Tillsammans med 1 tvärs över blir det exakt en."
      maxWidth={680}
    >
      <MiniLeads ox={10} total={false} />
      <Note x={174} y={112} anchor="middle" bold color="var(--ink)" text="Partial participation" />
      <Note x={174} y={130} anchor="middle" text="enkel linje — ett projekt får sakna ledare" />
      <MiniLeads ox={350} total />
      <Note x={514} y={112} anchor="middle" bold color="var(--ink)" text="Total participation" />
      <Note x={514} y={130} anchor="middle" text="dubbel linje — varje projekt har minst en ledare" />
    </Figure>
  );
}

// 3. Läsriktningarna: ratio tvärs över, deltagande vid egen ände.
export function ReadingDirectionsFigure() {
  const y = 130;
  return (
    <Figure
      viewBox="0 0 620 268"
      label="Chen-diagram Employee — Leads — Project (1:N, dubbel linje vid Project) med pilar som visar att ratio-etiketterna läses tvärs över relationen och deltagandelinjen vid sin egen ände."
      caption="Ratio-etiketten läses tvärs över: talet bredvid Employee säger hur många anställda varje projekt får ha. Dubbellinjen läses vid sin egen ände: den säger något om projekten."
    >
      <Note x={320} y={40} anchor="middle" color="var(--ink)" text="1 vid Employee, läst tvärs över: för varje Project högst en Employee" />
      <Arrow x1={178} y1={58} x2={462} y2={58} />
      <EntityBox x={20} y={y - 22} label="Employee" />
      <Connector x1={144} y1={y} x2={244} y2={y} />
      <Ratio x={166} y={y - 10} text="1" />
      <RelationshipDiamond cx={310} cy={y} w={132} h={64} label="Leads" />
      <Connector x1={376} y1={y} x2={476} y2={y} total />
      <Ratio x={454} y={y - 10} text="N" />
      <EntityBox x={476} y={y - 22} label="Project" />
      <Arrow x1={442} y1={200} x2={178} y2={200} />
      <Note x={310} y={224} anchor="middle" color="var(--ink)" text="N vid Project, läst tvärs över: för varje Employee många Projects" />
      <Arrow x1={548} y1={188} x2={452} y2={140} />
      <Note x={548} y={208} anchor="middle" text={["dubbel linje: läses här,", "vid sin egen ände —", "varje Project minst en gång"]} />
    </Figure>
  );
}

// 4. Svag entitet med alla tre markeringarna.
export function WeakEntityFigure() {
  const y = 100;
  return (
    <Figure
      viewBox="0 0 620 200"
      label="Chen-diagram: Project med enkel ram, identifierande relationen Contains med dubbel romb, ProjectTask med dubbel ram, projectNo med hel understrykning och taskNo med streckad understrykning. Ratio 1:N, dubbel linje vid ProjectTask."
      caption="Tre markeringar hör ihop: dubbel rektangel (svag entitetstyp), dubbel romb (identifierande relation) och streckad understrykning (partiell identifierare). Dubbellinjen på den svaga sidan gör deltagandet obligatoriskt."
    >
      <AttributeOval cx={82} cy={30} label="projectNo" identifier="solid" />
      <AttributeLink x1={82} y1={45} x2={82} y2={78} />
      <EntityBox x={20} y={78} label="Project" />
      <Connector x1={144} y1={y} x2={244} y2={y} />
      <Ratio x={166} y={y - 10} text="1" />
      <RelationshipDiamond cx={310} cy={y} w={132} h={64} label="Contains" identifying />
      <Connector x1={376} y1={y} x2={476} y2={y} total />
      <Ratio x={454} y={y - 10} text="N" />
      <EntityBox x={476} y={78} label="ProjectTask" weak />
      <AttributeOval cx={538} cy={30} label="taskNo" identifier="dashed" />
      <AttributeLink x1={538} y1={45} x2={538} y2={78} />
      <AttributeLink x1={538} y1={122} x2={538} y2={157} />
      <AttributeOval cx={538} cy={172} label="taskName" />
    </Figure>
  );
}

// 5. Reifiering: WorksOn blir Assignment.
export function ReificationFigure() {
  const y1 = 70;
  const y2 = 270;
  return (
    <Figure
      viewBox="0 0 640 350"
      label="Före: Employee — WorksOn — Project (M:N) med attributen allocationPercentage och assignmentStartDate på relationen. Efter: entitetstypen Assignment mellan Employee (Holds, 1:N) och Project (Concerns, N:1) med dubbla linjer på Assignments sidor, assignmentNo understruket och de två attributen flyttade till Assignment."
      caption="Före: attributen sitter på relationstypen WorksOn. Efter: paret har blivit entiteten Assignment — vanliga Chen-konstruktioner, ingen särskild symbol. Dubbellinjerna vid Assignment betyder att varje uppdrag måste ha en anställd och ett projekt; assignmentNo är ett nytt ansvar att tilldela, lagra och bevara."
      maxWidth={640}
    >
      <Note x={12} y={18} bold color="var(--pine)" text="Före" />
      <EntityBox x={20} y={y1 - 22} label="Employee" />
      <Connector x1={144} y1={y1} x2={244} y2={y1} />
      <Ratio x={166} y={y1 - 10} text="M" />
      <RelationshipDiamond cx={310} cy={y1} w={132} h={64} label="WorksOn" />
      <Connector x1={376} y1={y1} x2={476} y2={y1} total />
      <Ratio x={454} y={y1 - 10} text="N" />
      <EntityBox x={476} y={y1 - 22} label="Project" />
      <AttributeLink x1={300} y1={y1 + 32} x2={232} y2={135} />
      <AttributeLink x1={322} y1={y1 + 32} x2={390} y2={135} />
      <AttributeOval cx={230} cy={150} rx={72} label="allocationPercentage" />
      <AttributeOval cx={392} cy={150} rx={74} label="assignmentStartDate" />

      <line x1={20} x2={620} y1={186} y2={186} stroke="var(--line)" strokeWidth={1} />

      <Note x={12} y={212} bold color="var(--pine)" text="Efter" />
      <AttributeOval cx={313} cy={216} rx={54} label="assignmentNo" identifier="solid" />
      <AttributeLink x1={313} y1={231} x2={313} y2={y2 - 22} />
      <EntityBox x={10} y={y2 - 22} w={96} label="Employee" />
      <Connector x1={106} y1={y2} x2={142} y2={y2} />
      <Ratio x={124} y={y2 - 10} text="1" />
      <RelationshipDiamond cx={182} cy={y2} w={80} h={48} label="Holds" />
      <Connector x1={222} y1={y2} x2={258} y2={y2} total />
      <Ratio x={240} y={y2 - 10} text="N" />
      <EntityBox x={258} y={y2 - 22} w={110} label="Assignment" />
      <Connector x1={368} y1={y2} x2={404} y2={y2} total />
      <Ratio x={386} y={y2 - 10} text="N" />
      <RelationshipDiamond cx={446} cy={y2} w={84} h={48} label="Concerns" />
      <Connector x1={488} y1={y2} x2={524} y2={y2} />
      <Ratio x={506} y={y2 - 10} text="1" />
      <EntityBox x={524} y={y2 - 22} w={96} label="Project" />
      <AttributeLink x1={298} y1={y2 + 22} x2={244} y2={316} />
      <AttributeLink x1={328} y1={y2 + 22} x2={396} y2={316} />
      <AttributeOval cx={240} cy={331} rx={72} label="allocationPercentage" />
      <AttributeOval cx={400} cy={331} rx={74} label="assignmentStartDate" />
    </Figure>
  );
}

// 6. Crow's Foots fyra ändpunktsmönster.
function EndpointCell({ x, y, optional, many, title, marks }) {
  return (
    <g>
      <line x1={x} y1={y} x2={x + 150} y2={y} stroke="var(--pine)" strokeWidth={1.5} />
      <CrowMarks x={x + 150} y={y} side="right" optional={optional} many={many} />
      <EntityBox x={x + 150} y={y - 17} w={90} h={34} label="Project" />
      <Note x={x} y={y + 34} bold color="var(--ink)" text={title} />
      <Note x={x} y={y + 50} text={marks} />
    </g>
  );
}

export function CrowEndpointsFigure() {
  return (
    <Figure
      viewBox="0 0 640 220"
      label="Fyra Crow's Foot-ändpunkter vid en entitetsbox: cirkel och streck (noll eller en), streck och streck (exakt en), cirkel och fork (noll eller många), streck och fork (en eller många)."
      caption="Varje ändpunkt bär två märken. Yttre märket: cirkel = optional, streck = required. Inre märket, närmast boxen: streck = one, fork = many. Markörerna sitter vid den ändpunkt vars instanser de räknar."
      maxWidth={640}
    >
      <EndpointCell x={20} y={40} optional many={false} title="Noll eller en" marks="cirkel + streck" />
      <EndpointCell x={340} y={40} optional={false} many={false} title="Exakt en" marks="streck + streck" />
      <EndpointCell x={20} y={140} optional many title="Noll eller många" marks="cirkel + fork" />
      <EndpointCell x={340} y={140} optional={false} many title="En eller många" marks="streck + fork" />
    </Figure>
  );
}

// 7. Samma modell i Chen och Crow's Foot.
export function ChenVsCrowFigure() {
  const y = 104;
  const boxY = 190;
  const h = crowEntityHeight(["x"], ["y"]);
  const mid = boxY + h / 2;
  return (
    <Figure
      viewBox="0 0 640 290"
      label="Överst Chen: Employee med employeeNo och name, WorksOn (M:N, dubbel linje vid Project), Project med projectNo och title. Underst Crow's Foot: EMPLOYEE-box med employee_no märkt ID och name, PROJECT-box med project_no märkt ID och title, en namngiven linje works on med streck och fork vid EMPLOYEE och cirkel och fork vid PROJECT."
      caption="Samma ER-modell i två notationer. Entitetstyper, relationstyp och constraints är ER-begrepp; rektanglar, romb, uppdelade boxar, namngiven linje och ändsymboler är notationens val."
      maxWidth={640}
    >
      <Note x={20} y={16} bold color="var(--pine)" text="Chen" />
      <AttributeOval cx={50} cy={44} rx={48} label="employeeNo" identifier="solid" />
      <AttributeOval cx={128} cy={44} rx={30} label="name" />
      <AttributeLink x1={50} y1={59} x2={62} y2={y - 22} />
      <AttributeLink x1={128} y1={59} x2={116} y2={y - 22} />
      <EntityBox x={20} y={y - 22} label="Employee" />
      <Connector x1={144} y1={y} x2={244} y2={y} />
      <Ratio x={166} y={y - 10} text="M" />
      <RelationshipDiamond cx={310} cy={y} w={132} h={64} label="WorksOn" />
      <Connector x1={376} y1={y} x2={476} y2={y} total />
      <Ratio x={454} y={y - 10} text="N" />
      <EntityBox x={476} y={y - 22} label="Project" />
      <AttributeOval cx={506} cy={44} rx={44} label="projectNo" identifier="solid" />
      <AttributeOval cx={584} cy={44} rx={28} label="title" />
      <AttributeLink x1={506} y1={59} x2={518} y2={y - 22} />
      <AttributeLink x1={584} y1={59} x2={570} y2={y - 22} />

      <Note x={20} y={176} bold color="var(--pine)" text="Crow's Foot" />
      <CrowEntity x={20} y={boxY} w={150} label="EMPLOYEE" ids={["employee_no"]} attrs={["name"]} />
      <CrowEntity x={470} y={boxY} w={150} label="PROJECT" ids={["project_no"]} attrs={["title"]} />
      <CrowLine
        x1={170} x2={470} y={mid} label="works on"
        left={{ optional: false, many: true }}
        right={{ optional: true, many: true }}
        roleLeft="worker" roleRight="project"
      />
    </Figure>
  );
}

// 8. De fyra lagren, ER-versionen.
function Layer({ y, h = 64, title, lines }) {
  return (
    <g>
      <rect x={140} y={y} width={360} height={h} rx={6} fill="white" stroke="var(--pine)" strokeWidth={1.4} />
      <text x={154} y={y + 20} fontWeight="600" fill="var(--pine)">{title}</text>
      <Note x={154} y={y + 38} size={11} color="var(--ink)" text={lines} />
    </g>
  );
}

export function FourLayersFigure() {
  return (
    <Figure
      viewBox="0 0 640 372"
      label="Fyra lager staplade: ER-metamodellen definierar språket för ER-modellen, som representeras av ER-diagrammet och beskriver populationen — Mary : Employee, Atlas : Project, Mary WorksOn Atlas."
      caption="Metamodellen säger vad modellen får uttrycka; modellen är fakta; diagrammet är bara en av flera representationer; populationen instansierar modellens typer och ritas aldrig i diagrammet."
      maxWidth={600}
    >
      <Layer y={10} title="ER-metamodell" lines={["EntityType · Attribute · RelationshipType", "Participation/Role · CardinalityConstraint"]} />
      <Arrow x1={320} y1={74} x2={320} y2={98} />
      <Note x={332} y={90} size={11} text="definierar språket för" />
      <Layer y={100} title="ER-modell" lines={["Employee : EntityType · WorksOn : RelationshipType", "assignmentStartDate : Attribute · WorksOn owns assignmentStartDate"]} />
      <Arrow x1={320} y1={164} x2={320} y2={188} />
      <Note x={332} y={180} size={11} text="representeras av" />
      <g>
        <rect x={140} y={190} width={360} height={82} rx={6} fill="white" stroke="var(--pine)" strokeWidth={1.4} />
        <text x={154} y={210} fontWeight="600" fill="var(--pine)">ER-diagram</text>
        <EntityBox x={168} y={228} w={74} h={30} size={11} label="Employee" />
        <Connector x1={242} y1={243} x2={266} y2={243} />
        <RelationshipDiamond cx={312} cy={243} w={92} h={38} size={11} label="WorksOn" />
        <Connector x1={358} y1={243} x2={382} y2={243} total />
        <EntityBox x={382} y={228} w={66} h={30} size={11} label="Project" />
        <AttributeLink x1={448} y1={243} x2={462} y2={243} />
        <AttributeOval cx={468} cy={243} rx={12} ry={8} label="" />
      </g>
      <path d="M500,132 Q580,132 580,222 Q580,312 500,312" fill="none" stroke="var(--brass)" strokeWidth={1.5} markerEnd="url(#er-pil)" />
      <Note x={586} y={226} size={11} text="beskriver" />
      <Layer y={280} h={82} title="Population" lines={["Mary : Employee · Atlas : Project", "Mary WorksOn Atlas · assignmentStartDate 2026-09-01", "instansierar modellens typer"]} />
    </Figure>
  );
}

// 9–10. Populationsvyer (inte Chen-notation).
export function EntityPopulationFigure() {
  return (
    <Figure
      viewBox="0 0 420 82"
      label="Entitetsmängden för Employee vid tid t: e1 Mary (E-104), e2 Gary (E-207), e3 Sam (E-311)."
      caption="Entitetsmängden för Employee vid tid t. Entitetstypen är det du ritar; mängden är populationen just nu; e1, e2 och e3 är entiteter."
      notChen
      maxWidth={420}
    >
      <PopulationSet x={6} y={4} w={408} h={72} title="Employee — entitetsmängd vid tid t" layout="row" items={["e1 · Mary (E-104)", "e2 · Gary (E-207)", "e3 · Sam (E-311)"]} />
    </Figure>
  );
}

export function RelationshipPopulationFigure() {
  // Rader i mängderna: y = ramens y + 38 + 20·i. Linjerna går mellan
  // ramarnas kanter och binder varje relationsinstans till sina två entiteter.
  const row = (i) => 4 + 38 + i * 20;
  const links = [
    { r: 0, e: 0, p: 0 }, // r1 = ⟨e1, p1⟩
    { r: 1, e: 1, p: 0 }, // r2 = ⟨e2, p1⟩
    { r: 2, e: 2, p: 1 }, // r3 = ⟨e3, p2⟩
  ];
  return (
    <Figure
      viewBox="0 0 640 116"
      label="Tre mängder vid tid t: entitetsmängden Employee med e1 Mary, e2 Gary, e3 Sam; relationsmängden WorksOn med r1 = ⟨e1, p1⟩, r2 = ⟨e2, p1⟩, r3 = ⟨e3, p2⟩; entitetsmängden Project med p1 Atlas och p2 Beacon. Linjer binder varje relationsinstans till sina två entiteter."
      caption="Vid tid t: linjer visar deltagande, ramar markerar sets."
      notChen
      maxWidth={640}
    >
      <PopulationSet x={6} y={4} w={176} h={106} title="Employee" items={["e1 · Mary", "e2 · Gary", "e3 · Sam"]} />
      <PopulationSet x={232} y={4} w={176} h={106} title="WorksOn" items={["r1 = ⟨e1, p1⟩", "r2 = ⟨e2, p1⟩", "r3 = ⟨e3, p2⟩"]} />
      <PopulationSet x={458} y={4} w={176} h={106} title="Project" items={["p1 · Atlas", "p2 · Beacon"]} />
      <g stroke="var(--pine)" strokeWidth={1.2}>
        {links.map(({ r, e, p }) => (
          <g key={r}>
            <line x1={182} y1={row(e)} x2={232} y2={row(r)} />
            <line x1={408} y1={row(r)} x2={458} y2={row(p)} />
          </g>
        ))}
      </g>
    </Figure>
  );
}

// 11. Attributtyperna kring Employee.
export function AttributeShapesFigure() {
  return (
    <Figure
      viewBox="0 0 640 262"
      label="Employee omgiven av attribut: employeeNo understruket, name, workEmail, hireDate, yearsEmployed i streckad oval, phoneNumber i dubbel oval och det sammansatta address med delattributen streetName, streetNumber, postalCode och city."
      caption="Symbolerna: understrykning = identifierare, dubbel oval = flervärdesattribut, streckad oval = härlett attribut, delattribut hängande under ett sammansatt. Obligatoriskt eller frivilligt har ingen egen symbol."
      maxWidth={640}
    >
      <AttributeLink x1={150} y1={52} x2={262} y2={106} />
      <AttributeLink x1={255} y1={43} x2={300} y2={104} />
      <AttributeLink x1={388} y1={43} x2={342} y2={104} />
      <AttributeLink x1={510} y1={78} x2={382} y2={116} />
      <AttributeLink x1={503} y1={145} x2={382} y2={134} />
      <AttributeLink x1={400} y1={208} x2={350} y2={148} />
      <AttributeLink x1={190} y1={142} x2={258} y2={132} />
      <AttributeLink x1={150} y1={165} x2={44} y2={212} />
      <AttributeLink x1={150} y1={165} x2={140} y2={212} />
      <AttributeLink x1={150} y1={165} x2={238} y2={212} />
      <AttributeLink x1={150} y1={165} x2={310} y2={212} />
      <EntityBox x={258} y={104} label="Employee" />
      <AttributeOval cx={110} cy={40} rx={52} label="employeeNo" identifier="solid" />
      <AttributeOval cx={250} cy={28} rx={32} label="name" />
      <AttributeOval cx={392} cy={28} rx={46} label="workEmail" />
      <AttributeOval cx={548} cy={70} rx={42} label="hireDate" />
      <AttributeOval cx={560} cy={150} rx={60} label="yearsEmployed" derived />
      <AttributeOval cx={430} cy={222} rx={58} label="phoneNumber" multivalued />
      <AttributeOval cx={150} cy={150} rx={42} label="address" />
      <AttributeOval cx={44} cy={226} rx={42} ry={13} size={11} label="streetName" />
      <AttributeOval cx={140} cy={226} rx={46} ry={13} size={11} label="streetNumber" />
      <AttributeOval cx={238} cy={226} rx={42} ry={13} size={11} label="postalCode" />
      <AttributeOval cx={310} cy={226} rx={24} ry={13} size={11} label="city" />
    </Figure>
  );
}

// 12–13. Övningsdiagram för att läsa påståenden (tentans uppgift 1). Egna
// domäner — inte tentornas. Varje figur bär alla fem påståendetyperna:
// måste (dubbel linje), kan ha flera / exakt en (ratio), två X kan ha samma
// Y (ej understruket), identifieras av kombinationen (svag entitet), och
// flerstegspåståenden över flera relationer.
export function StatementsClubFigure() {
  return (
    <Figure
      viewBox="0 0 640 400"
      label="Chen-diagram med fyra entitetstyper: Förening (föreningsNo understruket, namn), Lag (svag, lagNo streckat understruket, division), Spelare (spelarNo understruket, namn) och Arena (arenaNo understruket, ort). Har: identifierande relation Förening 1 – N Lag, dubbel linje vid Lag. MedlemI: Förening 1 – N Spelare, dubbel linje vid Spelare. SpelarI: Spelare M – N Lag, enkel linje vid Spelare, dubbel vid Lag. Hemma: Lag N – 1 Arena, enkla linjer."
      caption="Genomgång 1. Fyra entitetstyper, fyra relationstyper. Läs ratio tvärs över och linjerna vid sin egen ände — och lägg märke till att ingenting binder ihop MedlemI med SpelarI."
      maxWidth={640}
    >
      <AttributeOval cx={82} cy={22} label="föreningsNo" identifier="solid" />
      <AttributeOval cx={195} cy={22} rx={48} label="namn" />
      <AttributeLink x1={82} y1={37} x2={82} y2={60} />
      <AttributeLink x1={170} y1={37} x2={130} y2={60} />
      <EntityBox x={20} y={60} label="Förening" />
      <Connector x1={144} y1={82} x2={244} y2={82} />
      <Ratio x={166} y={72} text="1" />
      <RelationshipDiamond cx={310} cy={82} w={132} h={64} label="Har" identifying />
      <Connector x1={376} y1={82} x2={496} y2={82} total />
      <Ratio x={474} y={72} text="N" />
      <EntityBox x={496} y={60} label="Lag" weak />
      <AttributeOval cx={558} cy={22} label="lagNo" identifier="dashed" />
      <AttributeOval cx={445} cy={22} rx={48} label="division" />
      <AttributeLink x1={558} y1={37} x2={558} y2={60} />
      <AttributeLink x1={470} y1={37} x2={510} y2={60} />

      <Connector x1={82} y1={104} x2={82} y2={160} />
      <Ratio x={104} y={130} text="1" />
      <RelationshipDiamond cx={82} cy={190} w={124} h={60} label="MedlemI" />
      <Connector x1={82} y1={220} x2={82} y2={296} total />
      <Ratio x={104} y={262} text="N" />
      <EntityBox x={20} y={296} label="Spelare" />
      <AttributeOval cx={82} cy={378} label="spelarNo" identifier="solid" />
      <AttributeOval cx={195} cy={378} rx={48} label="namn" />
      <AttributeLink x1={82} y1={340} x2={82} y2={363} />
      <AttributeLink x1={130} y1={340} x2={170} y2={363} />

      <Connector x1={558} y1={104} x2={558} y2={160} />
      <Ratio x={580} y={130} text="N" />
      <RelationshipDiamond cx={558} cy={190} w={124} h={60} label="Hemma" />
      <Connector x1={558} y1={220} x2={558} y2={296} />
      <Ratio x={580} y={262} text="1" />
      <EntityBox x={496} y={296} label="Arena" />
      <AttributeOval cx={558} cy={378} label="arenaNo" identifier="solid" />
      <AttributeOval cx={445} cy={378} rx={48} label="ort" />
      <AttributeLink x1={558} y1={340} x2={558} y2={363} />
      <AttributeLink x1={510} y1={340} x2={470} y2={363} />

      <Connector x1={144} y1={310} x2={244} y2={190} />
      <Ratio x={172} y={286} text="M" />
      <RelationshipDiamond cx={310} cy={190} w={132} h={64} label="SpelarI" />
      <Connector x1={376} y1={190} x2={496} y2={104} total />
      <Ratio x={452} y={122} text="N" />
    </Figure>
  );
}

export function StatementsLibraryFigure() {
  return (
    <Figure
      viewBox="0 0 640 420"
      label="Chen-diagram med fyra entitetstyper: Bok (isbn understruket, titel), Exemplar (svag, exNo streckat understruket, skick), Låntagare (låntagarNo understruket, namn) och Författare (författarNo understruket, namn). FinnsSom: identifierande relation Bok 1 – N Exemplar, dubbel linje vid Exemplar. SkrivenAv: Författare M – N Bok, dubbel linje vid Bok, enkel vid Författare. Lånar: Låntagare 1 – N Exemplar, enkla linjer. Fadder: unär relation på Låntagare med rollerna fadder (1) och adept (N), enkla linjer."
      caption="Genomgång 2. Samma läsregler, nu med en unär relation. Ingenting i notationen hindrar en låntagare från att vara sin egen fadder — det som inte förbjuds är tillåtet."
      maxWidth={640}
    >
      <AttributeOval cx={82} cy={22} label="isbn" identifier="solid" />
      <AttributeOval cx={195} cy={22} rx={48} label="titel" />
      <AttributeLink x1={82} y1={37} x2={82} y2={60} />
      <AttributeLink x1={170} y1={37} x2={130} y2={60} />
      <EntityBox x={20} y={60} label="Bok" />
      <Connector x1={144} y1={82} x2={244} y2={82} />
      <Ratio x={166} y={72} text="1" />
      <RelationshipDiamond cx={310} cy={82} w={132} h={64} label="FinnsSom" identifying />
      <Connector x1={376} y1={82} x2={496} y2={82} total />
      <Ratio x={474} y={72} text="N" />
      <EntityBox x={496} y={60} label="Exemplar" weak />
      <AttributeOval cx={558} cy={22} label="exNo" identifier="dashed" />
      <AttributeOval cx={445} cy={22} rx={48} label="skick" />
      <AttributeLink x1={558} y1={37} x2={558} y2={60} />
      <AttributeLink x1={470} y1={37} x2={510} y2={60} />

      <Connector x1={82} y1={104} x2={82} y2={160} total />
      <Ratio x={104} y={130} text="N" />
      <RelationshipDiamond cx={82} cy={190} w={124} h={60} label="SkrivenAv" />
      <Connector x1={82} y1={220} x2={82} y2={296} />
      <Ratio x={104} y={262} text="M" />
      <EntityBox x={20} y={296} label="Författare" />
      <AttributeOval cx={82} cy={378} label="författarNo" identifier="solid" />
      <AttributeOval cx={195} cy={378} rx={48} label="namn" />
      <AttributeLink x1={82} y1={340} x2={82} y2={363} />
      <AttributeLink x1={130} y1={340} x2={170} y2={363} />

      <Connector x1={558} y1={104} x2={558} y2={160} />
      <Ratio x={580} y={130} text="N" />
      <RelationshipDiamond cx={558} cy={190} w={124} h={60} label="Lånar" />
      <Connector x1={558} y1={220} x2={558} y2={296} />
      <Ratio x={580} y={262} text="1" />
      <EntityBox x={496} y={296} label="Låntagare" />
      <AttributeOval cx={558} cy={378} label="låntagarNo" identifier="solid" />
      <AttributeOval cx={445} cy={378} rx={48} label="namn" />
      <AttributeLink x1={558} y1={340} x2={558} y2={363} />
      <AttributeLink x1={510} y1={340} x2={470} y2={363} />

      <RelationshipDiamond cx={310} cy={300} w={124} h={60} label="Fadder" />
      <Connector x1={310} y1={270} x2={496} y2={302} />
      <Role x={400} y={270} text="fadder" />
      <Ratio x={470} y={280} text="1" />
      <Connector x1={372} y1={300} x2={496} y2={330} />
      <Role x={420} y={332} text="adept" />
      <Ratio x={470} y={345} text="N" />
    </Figure>
  );
}

// Genomgång 3: kedjade svaga entiteter i tre led. Resa identifieras bara
// tillsammans med Fartyg, som bara identifieras tillsammans med Rederi.
export function StatementsShippingFigure() {
  return (
    <Figure
      viewBox="0 0 760 400"
      label="Chen-diagram med fyra entitetstyper i kedja: Rederi (rederiNo understruket, namn), Fartyg (svag, fartygsnamn streckat understruket, byggår), Resa (svag, avgångsdatum streckat understruket, last) och Hamn med den sammansatta identifieraren hamnId av namn och land. Äger: identifierande relation Rederi 1 – N Fartyg, dubbel linje vid Fartyg, enkel vid Rederi. Gör: identifierande relation Fartyg 1 – N Resa, dubbel linje vid Resa, enkel vid Fartyg. Anlöper: Resa N – 1 Hamn, dubbel linje vid Resa, enkel vid Hamn."
      caption="Genomgång 3. Två identifierande relationer i rad: Resas kompletta identitet är Fartygs kompletta identitet plus avgångsdatum, och Fartygs är Rederis plus fartygsnamn."
      maxWidth={760}
    >
      <AttributeOval cx={60} cy={40} label="rederiNo" identifier="solid" />
      <AttributeOval cx={165} cy={40} rx={36} label="namn" />
      <AttributeLink x1={60} y1={55} x2={60} y2={120} />
      <AttributeLink x1={155} y1={55} x2={105} y2={120} />
      <EntityBox x={10} y={120} w={110} label="Rederi" />
      <Connector x1={120} y1={142} x2={152} y2={142} />
      <Ratio x={136} y={132} text="1" />
      <RelationshipDiamond cx={200} cy={142} w={96} h={56} label="Äger" identifying />
      <Connector x1={248} y1={142} x2={280} y2={142} total />
      <Ratio x={264} y={132} text="N" />
      <EntityBox x={280} y={120} w={110} label="Fartyg" weak />
      <AttributeOval cx={335} cy={40} rx={58} label="fartygsnamn" identifier="dashed" />
      <AttributeOval cx={445} cy={40} rx={40} label="byggår" />
      <AttributeLink x1={335} y1={55} x2={335} y2={120} />
      <AttributeLink x1={435} y1={55} x2={375} y2={120} />
      <Connector x1={390} y1={142} x2={422} y2={142} />
      <Ratio x={406} y={132} text="1" />
      <RelationshipDiamond cx={470} cy={142} w={96} h={56} label="Gör" identifying />
      <Connector x1={518} y1={142} x2={550} y2={142} total />
      <Ratio x={534} y={132} text="N" />
      <EntityBox x={550} y={120} w={110} label="Resa" weak />
      <AttributeOval cx={590} cy={40} rx={62} label="avgångsdatum" identifier="dashed" />
      <AttributeOval cx={700} cy={40} rx={34} label="last" />
      <AttributeLink x1={590} y1={55} x2={590} y2={120} />
      <AttributeLink x1={690} y1={55} x2={640} y2={120} />

      <Connector x1={605} y1={164} x2={605} y2={222} total />
      <Ratio x={627} y={190} text="N" />
      <RelationshipDiamond cx={605} cy={250} w={110} h={56} label="Anlöper" />
      <Connector x1={605} y1={278} x2={605} y2={320} />
      <Ratio x={627} y={302} text="1" />
      <EntityBox x={550} y={320} w={110} label="Hamn" />
      <AttributeOval cx={440} cy={342} rx={44} label="hamnId" identifier="solid" />
      <AttributeLink x1={484} y1={342} x2={550} y2={342} />
      <AttributeOval cx={330} cy={318} rx={36} label="namn" />
      <AttributeOval cx={330} cy={366} rx={36} label="land" />
      <AttributeLink x1={396} y1={342} x2={366} y2={318} />
      <AttributeLink x1={396} y1={342} x2={366} y2={366} />
    </Figure>
  );
}
