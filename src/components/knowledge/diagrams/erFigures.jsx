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
      label="Före: Employee — WorksOn — Project (M:N) med attributen allocationPercentage och assignmentStartDate på relationen. Efter: entitetstypen Assignment mellan Employee (Holds, 1:N) och Project (Concerns, N:1), med assignmentNo understruket och de två attributen flyttade till Assignment."
      caption="Före: attributen sitter på relationstypen WorksOn. Efter: paret har blivit entiteten Assignment — vanliga Chen-konstruktioner, ingen särskild symbol — och assignmentNo är ett nytt ansvar att tilldela, lagra och bevara."
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
      <Connector x1={222} y1={y2} x2={258} y2={y2} />
      <Ratio x={240} y={y2 - 10} text="N" />
      <EntityBox x={258} y={y2 - 22} w={110} label="Assignment" />
      <Connector x1={368} y1={y2} x2={404} y2={y2} />
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
  return (
    <Figure
      viewBox="0 0 640 116"
      label="Tre mängder: entitetsmängden Employee med e1, e2, e3; relationsmängden WorksOn med r1 = ⟨e1, p1⟩ (60 %), r2 och r3; entitetsmängden Project med p1 Atlas."
      caption="Relationsmängden vid tid t innehåller r1, r2 och r3. Varje relationsinstans är en tupel med en entitet per roll — r1 = ⟨e1, p1⟩ — och attributet allocationPercentage mappar r1 till 60 %."
      notChen
      maxWidth={640}
    >
      <PopulationSet x={6} y={4} w={196} h={106} title="Employee" items={["e1 · Mary", "e2 · Gary", "e3 · Sam"]} />
      <PopulationSet x={222} y={4} w={196} h={106} title="WorksOn" items={["r1 = ⟨e1, p1⟩ · 60 %", "r2 = ⟨…⟩", "r3 = ⟨…⟩"]} />
      <PopulationSet x={438} y={4} w={196} h={106} title="Project" items={["p1 · Atlas"]} />
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
