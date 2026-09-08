// Modellverkstadens diagram: häftets uppgift 4–9 omritade med sajtens
// primitiver (Björns bilder finns inte i repot) plus den egna uppgiften.
import {
  Figure, EntityBox, RelationshipDiamond, AttributeOval, Connector, AttributeLink, Ratio, Role,
} from "../knowledge/diagrams/erPrimitives.jsx";
import { VpEntity, VpLine, vpHeight } from "./vpPrimitives.jsx";
import { MODEL_FIGURE_IDS } from "./modelFigureIds.js";

// 4. Person — Owns — Car (Crow's Foot, Visual Paradigm).
function PersonCar() {
  const person = [{ name: "Name", key: true }, { name: "Address", nullable: true }, { name: "Salary", nullable: true }];
  const car = [{ name: "LicenseNumber", key: true }, { name: "Brand", nullable: true }, { name: "Speed", nullable: true }];
  const y = 30 + vpHeight(person) / 2;
  return (
    <Figure viewBox="0 0 620 160" label="Crow's Foot-diagram: Person med Name som identifierare, Address och Salary; Car med LicenseNumber som identifierare, Brand och Speed. Owns: Person en (streck), Car noll eller många (ring och kråkfot)." caption="Uppgift 4. Person — Owns — Car: en person äger noll eller flera bilar, varje bil ägs av exakt en person.">
      <VpEntity x={20} y={30} label="Person" attrs={person} />
      <VpLine x1={176} x2={444} y={y} label="Owns" left={{ one: true }} right={{ many: true, optional: true }} />
      <VpEntity x={444} y={30} label="Car" attrs={car} />
    </Figure>
  );
}

// 5. Teacher — Teach / Responsible — Course.
function TeacherCourse() {
  const teacher = [{ name: "EmployeeNo", key: true }, { name: "Name", nullable: true }, { name: "Salary", nullable: true }];
  const course = [{ name: "CourseCode", key: true }, { name: "Name", nullable: true }, { name: "Credits", nullable: true }];
  return (
    <Figure viewBox="0 0 620 170" label="Crow's Foot-diagram: Teacher (EmployeeNo identifierare, Name, Salary) och Course (CourseCode identifierare, Name, Credits). Teach: många–många, valfritt åt båda håll. Responsible: Teacher en, Course en eller många." caption="Uppgift 5. Teach är M:N och valfritt åt båda håll; Responsible ger varje kurs exakt en ansvarig lärare, som kan ansvara för flera.">
      <VpEntity x={20} y={30} label="Teacher" attrs={teacher} />
      <VpLine x1={176} x2={444} y={62} label="Teach" left={{ many: true, optional: true }} right={{ many: true, optional: true }} />
      <VpLine x1={176} x2={444} y={112} label="Responsible" left={{ one: true }} right={{ many: true, required: true }} />
      <VpEntity x={444} y={30} label="Course" attrs={course} />
    </Figure>
  );
}

// 6. Employee med Supervise (unär) och flervärdesattributet Email.
function EmployeeSupervise() {
  return (
    <Figure viewBox="0 0 520 300" label="Chen-diagram: Employee med EmployeeNo understruket, flervärdesattributet Email (dubbel oval), Name och Salary. Unär relation Supervise med rollerna supervised_by (M) och supervises (1)." caption="Uppgift 6. Employee identifieras av EmployeeNo och kan ha flera e-postadresser. Supervise är unär: en anställd handleder många och handleds av högst en.">
      <AttributeOval cx={260} cy={28} label="EmployeeNo" identifier="solid" />
      <AttributeOval cx={110} cy={60} label="Email" multivalued />
      <AttributeOval cx={400} cy={70} rx={44} label="Name" />
      <AttributeOval cx={430} cy={130} rx={44} label="Salary" />
      <AttributeLink x1={260} y1={43} x2={260} y2={110} />
      <AttributeLink x1={150} y1={68} x2={215} y2={112} />
      <AttributeLink x1={370} y1={82} x2={300} y2={112} />
      <AttributeLink x1={392} y1={130} x2={322} y2={128} />
      <EntityBox x={198} y={110} w={124} h={44} label="Employee" />
      <Connector x1={222} y1={154} x2={222} y2={232} />
      <Ratio x={200} y={190} text="M" />
      <Role x={196} y={215} text="supervised_by" anchor="end" />
      <Connector x1={298} y1={154} x2={298} y2={232} />
      <Ratio x={320} y={190} text="1" />
      <Role x={324} y={215} text="supervises" anchor="start" />
      <RelationshipDiamond cx={260} cy={262} w={132} h={60} label="Supervise" />
    </Figure>
  );
}

// 7. Room (svag) — Work (identifierande) — Hotel.
function HotelRoom() {
  const y = 110;
  return (
    <Figure viewBox="0 0 620 170" label="Chen-diagram: Room som svag entitetstyp (dubbel rektangel) med RoomNumber streckat understruket och Price; identifierande relationen Work (dubbel romb) med dubbel linje vid Room, ratio M vid Room och 1 vid Hotel; Hotel med Name understruket och Rating." caption="Uppgift 7. Room är svag under Hotel: RoomNumber är unikt bara inom hotellet.">
      <AttributeOval cx={70} cy={30} label="RoomNumber" identifier="dashed" />
      <AttributeOval cx={190} cy={30} rx={44} label="Price" />
      <AttributeLink x1={82} y1={45} x2={82} y2={88} />
      <AttributeLink x1={175} y1={45} x2={130} y2={88} />
      <EntityBox x={20} y={88} label="Room" weak />
      <Connector x1={144} y1={y} x2={244} y2={y} total />
      <Ratio x={166} y={y - 10} text="M" />
      <RelationshipDiamond cx={310} cy={y} w={132} h={64} label="Work" identifying />
      <Connector x1={376} y1={y} x2={476} y2={y} />
      <Ratio x={454} y={y - 10} text="1" />
      <EntityBox x={476} y={88} label="Hotel" />
      <AttributeOval cx={500} cy={30} rx={44} label="Name" identifier="solid" />
      <AttributeOval cx={590} cy={30} rx={40} label="Rating" />
      <AttributeLink x1={510} y1={45} x2={530} y2={88} />
      <AttributeLink x1={580} y1={45} x2={556} y2={88} />
    </Figure>
  );
}

// 8. Employee — Work(Hours) — Department med sammansatt identifierare Id.
function EmployeeDepartment() {
  const y = 150;
  return (
    <Figure viewBox="0 0 700 210" maxWidth={700} label="Chen-diagram: Employee med EmployeeNo understruket, Address och Name; relationen Work med attributet Hours, ratio M vid Employee och N vid Department; Department med den sammansatta identifieraren Id (understruken) av Name och Address, samt Description." caption="Uppgift 8. Work är M:N med Hours. Department identifieras av det sammansatta attributet Id, vars delar är Name och Address.">
      <AttributeOval cx={110} cy={28} label="EmployeeNo" identifier="solid" />
      <AttributeOval cx={30} cy={90} rx={44} label="Address" />
      <AttributeOval cx={200} cy={90} rx={40} label="Name" />
      <AttributeLink x1={110} y1={43} x2={100} y2={128} />
      <AttributeLink x1={55} y1={100} x2={80} y2={128} />
      <AttributeLink x1={185} y1={102} x2={130} y2={128} />
      <EntityBox x={20} y={128} label="Employee" />
      <Connector x1={144} y1={y} x2={244} y2={y} />
      <Ratio x={166} y={y - 10} text="M" />
      <RelationshipDiamond cx={310} cy={y} w={132} h={64} label="Work" />
      <AttributeOval cx={310} cy={60} rx={40} label="Hours" />
      <AttributeLink x1={310} y1={75} x2={310} y2={118} />
      <Connector x1={376} y1={y} x2={476} y2={y} />
      <Ratio x={454} y={y - 10} text="N" />
      <EntityBox x={476} y={128} label="Department" />
      <AttributeOval cx={480} cy={28} rx={40} label="Name" />
      <AttributeOval cx={590} cy={28} rx={44} label="Address" />
      <AttributeOval cx={520} cy={78} rx={26} ry={14} label="Id" identifier="solid" />
      <AttributeOval cx={615} cy={90} rx={50} label="Description" />
      <AttributeLink x1={495} y1={42} x2={512} y2={64} />
      <AttributeLink x1={575} y1={42} x2={532} y2={64} />
      <AttributeLink x1={522} y1={92} x2={530} y2={128} />
      <AttributeLink x1={600} y1={104} x2={570} y2={128} />
    </Figure>
  );
}

// 9. Team — WorksIn — Employee — WorksAt — Office; Employee — Handle — Customer — FamilyRelation.
function TeamOffice() {
  const y = 150;
  return (
    <Figure viewBox="0 0 880 470" maxWidth={880} label="Chen-diagram: Team (TeamNo understruket, Name) — WorksIn med Hours, M vid Team, N vid Employee med dubbel linje — Employee (EmployeeNo understruket, Address, Name, flervärdesattributet Certificate) — WorksAt, M vid Employee, 1 vid Office — Office (Address understruket, Name). Employee — Handle — Customer: 1 vid Employee, M vid Customer med dubbel linje. Customer (CustomerNo understruket, Name, DiscountClass) med den unära relationen FamilyRelation, M och N." caption="Uppgift 9. Fyra entitetstyper, fem relationstyper varav en unär, ett flervärdesattribut och två totala deltaganden.">
      <AttributeOval cx={60} cy={40} rx={40} label="Name" />
      <AttributeOval cx={160} cy={40} rx={44} label="TeamNo" identifier="solid" />
      <AttributeLink x1={75} y1={55} x2={100} y2={128} />
      <AttributeLink x1={150} y1={55} x2={120} y2={128} />
      <EntityBox x={20} y={128} w={124} label="Team" />
      <Connector x1={144} y1={y} x2={234} y2={y} />
      <Ratio x={166} y={y - 10} text="M" />
      <RelationshipDiamond cx={290} cy={y} w={112} h={56} label="WorksIn" />
      <AttributeOval cx={290} cy={230} rx={40} label="Hours" />
      <AttributeLink x1={290} y1={178} x2={290} y2={215} />
      <Connector x1={346} y1={y} x2={396} y2={y} total />
      <Ratio x={374} y={y - 10} text="N" />
      <EntityBox x={396} y={128} w={124} label="Employee" />
      <AttributeOval cx={458} cy={30} label="EmployeeNo" identifier="solid" />
      <AttributeOval cx={340} cy={80} rx={44} label="Address" />
      <AttributeOval cx={560} cy={80} rx={40} label="Name" />
      <AttributeLink x1={458} y1={45} x2={458} y2={128} />
      <AttributeLink x1={370} y1={92} x2={420} y2={128} />
      <AttributeLink x1={545} y1={92} x2={500} y2={128} />
      <Connector x1={520} y1={y} x2={580} y2={y} />
      <Ratio x={542} y={y - 10} text="M" />
      <RelationshipDiamond cx={636} cy={y} w={112} h={56} label="WorksAt" />
      <Connector x1={692} y1={y} x2={740} y2={y} />
      <Ratio x={718} y={y - 10} text="1" />
      <EntityBox x={740} y={128} w={110} h={44} label="Office" size={12} />
      <AttributeOval cx={700} cy={40} rx={40} label="Name" />
      <AttributeOval cx={790} cy={40} rx={44} label="Address" identifier="solid" />
      <AttributeLink x1={715} y1={55} x2={770} y2={128} />
      <AttributeLink x1={790} y1={55} x2={795} y2={128} />
      <AttributeOval cx={600} cy={240} rx={52} label="Certificate" multivalued />
      <AttributeLink x1={500} y1={172} x2={560} y2={228} />
      <Connector x1={458} y1={172} x2={458} y2={232} />
      <Ratio x={478} y={200} text="1" />
      <RelationshipDiamond cx={458} cy={262} w={112} h={56} label="Handle" />
      <Connector x1={458} y1={290} x2={458} y2={340} total />
      <Ratio x={478} y={322} text="M" />
      <EntityBox x={396} y={340} w={124} label="Customer" />
      <AttributeOval cx={300} cy={330} rx={52} label="CustomerNo" identifier="solid" />
      <AttributeOval cx={290} cy={380} rx={56} label="DiscountClass" />
      <AttributeOval cx={560} cy={320} rx={40} label="Name" />
      <AttributeLink x1={350} y1={338} x2={396} y2={352} />
      <AttributeLink x1={344} y1={380} x2={396} y2={372} />
      <AttributeLink x1={545} y1={332} x2={500} y2={344} />
      <Connector x1={420} y1={384} x2={420} y2={430} />
      <Ratio x={402} y={410} text="M" />
      <Connector x1={496} y1={384} x2={496} y2={430} />
      <Ratio x={516} y={410} text="N" />
      <RelationshipDiamond cx={458} cy={445} w={150} h={50} label="FamilyRelation" size={12} />
    </Figure>
  );
}

// 10. Festival — Has — Stage — Hosts — Slot: kedjade svaga entiteter.
function Festival() {
  const y = 110;
  return (
    <Figure viewBox="0 0 900 190" maxWidth={900} label="Chen-diagram: Festival (Name understruket, City) — identifierande relationen Has, 1 vid Festival, N vid Stage med dubbel linje — Stage som svag entitetstyp med StageName streckat understruket — identifierande relationen Hosts, 1 vid Stage, N vid Slot med dubbel linje — Slot som svag entitetstyp med StartTime streckat understruket och Artist." caption="Egen uppgift. Kedjade svaga entiteter: en scen identifieras bara tillsammans med sin festival, en tidslucka bara tillsammans med sin scen.">
      <AttributeOval cx={60} cy={30} rx={40} label="Name" identifier="solid" />
      <AttributeOval cx={150} cy={30} rx={36} label="City" />
      <AttributeLink x1={65} y1={45} x2={80} y2={88} />
      <AttributeLink x1={145} y1={45} x2={120} y2={88} />
      <EntityBox x={20} y={88} w={116} label="Festival" />
      <Connector x1={136} y1={y} x2={210} y2={y} />
      <Ratio x={158} y={y - 10} text="1" />
      <RelationshipDiamond cx={260} cy={y} w={100} h={56} label="Has" identifying />
      <Connector x1={310} y1={y} x2={384} y2={y} total />
      <Ratio x={362} y={y - 10} text="N" />
      <EntityBox x={384} y={88} w={116} label="Stage" weak />
      <AttributeOval cx={442} cy={30} rx={48} label="StageName" identifier="dashed" />
      <AttributeLink x1={442} y1={45} x2={442} y2={88} />
      <Connector x1={500} y1={y} x2={574} y2={y} />
      <Ratio x={522} y={y - 10} text="1" />
      <RelationshipDiamond cx={624} cy={y} w={100} h={56} label="Hosts" identifying />
      <Connector x1={674} y1={y} x2={748} y2={y} total />
      <Ratio x={726} y={y - 10} text="N" />
      <EntityBox x={748} y={88} w={116} label="Slot" weak />
      <AttributeOval cx={770} cy={30} rx={44} label="StartTime" identifier="dashed" />
      <AttributeOval cx={862} cy={40} rx={34} label="Artist" />
      <AttributeLink x1={775} y1={45} x2={790} y2={88} />
      <AttributeLink x1={855} y1={55} x2={830} y2={88} />
    </Figure>
  );
}

export const MODEL_FIGURES = {
  "mod-person-car": PersonCar,
  "mod-teacher-course": TeacherCourse,
  "mod-employee-supervise": EmployeeSupervise,
  "mod-hotel-room": HotelRoom,
  "mod-employee-department": EmployeeDepartment,
  "mod-team-office": TeamOffice,
  "mod-festival": Festival,
};

if (import.meta.env?.DEV) {
  for (const id of MODEL_FIGURE_IDS) if (!MODEL_FIGURES[id]) console.warn(`Modellfiguren "${id}" saknas.`);
}

export function ModelFigure({ id }) {
  const Component = MODEL_FIGURES[id];
  return Component ? <Component /> : null;
}
