// Modellverkstadens diagram: häftets uppgift 3–9 och 18–22 omritade med
// sajtens primitiver (Björns bilder finns inte i repot) plus den egna uppgiften.
import {
  Figure, EntityBox, RelationshipDiamond, AttributeOval, Connector, AttributeLink, Ratio, Role,
} from "../knowledge/diagrams/erPrimitives.jsx";
import { VpEntity, VpLine, vpHeight } from "./vpPrimitives.jsx";
import { MODEL_FIGURE_IDS } from "./modelFigureIds.js";
import { Diagram } from "../knowledge/diagrams/index.jsx";

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
  // Som häftets bild: de två linjerna utgår från rutans underkant och
  // konvergerar mot romben strax under, så att det syns att det är EN
  // relation från entiteten till sig själv. M och 1 vid sin egen linje,
  // rollnamnen under dem på utsidan.
  return (
    <Figure viewBox="0 0 520 256" label="Chen-diagram: Employee med EmployeeNo understruket, flervärdesattributet Email (dubbel oval), Name och Salary. Unär relation Supervise strax under Employee, med två linjer från rutans underkant: supervised_by (M) till vänster och supervises (1) till höger." caption="Uppgift 6. Employee identifieras av EmployeeNo och kan ha flera e-postadresser. Supervise är unär: en anställd handleder många och handleds av högst en.">
      <AttributeOval cx={260} cy={28} label="EmployeeNo" identifier="solid" />
      <AttributeOval cx={110} cy={60} label="Email" multivalued />
      <AttributeOval cx={400} cy={70} rx={44} label="Name" />
      <AttributeOval cx={430} cy={130} rx={44} label="Salary" />
      <AttributeLink x1={260} y1={43} x2={260} y2={110} />
      <AttributeLink x1={150} y1={68} x2={215} y2={112} />
      <AttributeLink x1={370} y1={82} x2={300} y2={112} />
      <AttributeLink x1={392} y1={130} x2={322} y2={128} />
      <EntityBox x={198} y={110} w={124} h={44} label="Employee" />
      <Connector x1={208} y1={154} x2={230} y2={205} />
      <Ratio x={194} y={172} text="M" />
      <Role x={204} y={190} text="supervised_by" anchor="end" />
      <Connector x1={312} y1={154} x2={290} y2={205} />
      <Ratio x={326} y={172} text="1" />
      <Role x={316} y={190} text="supervises" anchor="start" />
      <RelationshipDiamond cx={260} cy={218} w={120} h={52} label="Supervise" />
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

// ── ER-diagram till DDL: häftets uppgift 18–22, omritade efter förlagan ──

// 18. Häftets bild är i UML-stil; här i Chen. B:s sammansatta PK {b1, b2}
// blir den sammansatta identifieraren BK, multipliciteten 1 blir dubbel
// linje på andra sidan (A och C måste ha exakt en).
function Ddl18() {
  return (
    <Figure viewBox="0 0 720 430" maxWidth={720} label="Chen-diagram: C (C1 understruket, C2) — R2 med attributet R2attr, M vid C och N vid B, enkla linjer — B med den sammansatta identifieraren BK (understruken) av B1 och B2, samt B3. B — R1 — A: 1 vid B, M vid A med dubbel linje. A har A1 understruket, A2 och A3. C — R3 — D: M vid C med dubbel linje, 1 vid D. D har D1 understruket och D2." caption="Uppgift 18, omritad i Chen (häftet visar den i UML-stil). BK är B:s sammansatta identifierare med delarna B1 och B2.">
      <AttributeOval cx={60} cy={60} rx={36} label="C1" identifier="solid" />
      <AttributeOval cx={60} cy={110} rx={36} label="C2" />
      <AttributeLink x1={96} y1={64} x2={140} y2={140} />
      <AttributeLink x1={96} y1={112} x2={140} y2={150} />
      <EntityBox x={140} y={130} label="C" />
      <Connector x1={264} y1={152} x2={306} y2={152} />
      <Ratio x={280} y={142} text="M" />
      <RelationshipDiamond cx={360} cy={152} w={108} h={52} label="R2" />
      <AttributeOval cx={360} cy={60} rx={48} label="R2attr" />
      <AttributeLink x1={360} y1={75} x2={360} y2={126} />
      <Connector x1={414} y1={152} x2={470} y2={152} />
      <Ratio x={452} y={142} text="N" />
      <EntityBox x={470} y={130} label="B" />
      <AttributeOval cx={560} cy={64} rx={30} label="BK" identifier="solid" />
      <AttributeOval cx={500} cy={20} rx={30} label="B1" />
      <AttributeOval cx={620} cy={20} rx={30} label="B2" />
      <AttributeOval cx={660} cy={110} rx={32} label="B3" />
      <AttributeLink x1={515} y1={33} x2={548} y2={51} />
      <AttributeLink x1={605} y1={33} x2={572} y2={51} />
      <AttributeLink x1={556} y1={79} x2={540} y2={130} />
      <AttributeLink x1={630} y1={116} x2={594} y2={140} />

      <Connector x1={532} y1={174} x2={532} y2={236} />
      <Ratio x={550} y={198} text="1" />
      <RelationshipDiamond cx={532} cy={262} w={100} h={52} label="R1" />
      <Connector x1={532} y1={288} x2={532} y2={330} total />
      <Ratio x={552} y={318} text="M" />
      <EntityBox x={470} y={330} label="A" />
      <AttributeOval cx={670} cy={310} rx={32} label="A1" identifier="solid" />
      <AttributeOval cx={670} cy={360} rx={32} label="A2" />
      <AttributeOval cx={670} cy={406} rx={32} label="A3" />
      <AttributeLink x1={638} y1={314} x2={594} y2={342} />
      <AttributeLink x1={638} y1={360} x2={594} y2={354} />
      <AttributeLink x1={642} y1={400} x2={594} y2={366} />

      <Connector x1={202} y1={174} x2={202} y2={236} total />
      <Ratio x={222} y={198} text="M" />
      <RelationshipDiamond cx={202} cy={262} w={100} h={52} label="R3" />
      <Connector x1={202} y1={288} x2={202} y2={330} />
      <Ratio x={220} y={318} text="1" />
      <EntityBox x={140} y={330} label="D" />
      <AttributeOval cx={50} cy={330} rx={32} label="D1" identifier="solid" />
      <AttributeOval cx={50} cy={385} rx={32} label="D2" />
      <AttributeLink x1={82} y1={334} x2={140} y2={344} />
      <AttributeLink x1={82} y1={380} x2={140} y2={364} />
    </Figure>
  );
}

// 19. Svag B under A, flervärt B3, unära R3 (M:N) och R6 (1:M, dubbel på M).
function Ddl19() {
  return (
    <Figure viewBox="0 0 720 610" maxWidth={720} label="Chen-diagram: C med identifierarna C1 och C2 (båda understrukna) och C3. Unär R3 ovanför C, M och N. C — R2 — B: M vid C med dubbel linje, 1 vid B. B är svag (dubbel rektangel) med B1 streckat understruket, B2 och flervärdesattributet B3. B — R1 (identifierande, dubbel romb) — A: M vid B med dubbel linje, 1 vid A. A har A1 understruket och A2. C — R4 — D: M vid C, N vid D. D har den sammansatta identifieraren D1 (understruken) av D2 och D3. D — R5 — E: M vid D, 1 vid E, enkla linjer. E har E1 understruket och E2. Unär R6 under E: 1 med enkel linje, M med dubbel linje." caption="Uppgift 19. B är svag under A; C har två identifierare; R3 är unär M:N och R6 unär 1:M med dubbel linje på M-sidan.">
      <RelationshipDiamond cx={233} cy={34} w={88} h={36} label="R3" />
      <Connector x1={172} y1={97} x2={189} y2={34} />
      <Ratio x={160} y={92} text="M" />
      <Connector x1={294} y1={97} x2={277} y2={34} />
      <Ratio x={306} y={92} text="N" />
      <AttributeOval cx={86} cy={84} rx={34} label="C1" identifier="solid" />
      <AttributeOval cx={90} cy={125} rx={34} label="C2" identifier="solid" />
      <AttributeOval cx={100} cy={166} rx={34} label="C3" />
      <AttributeLink x1={120} y1={88} x2={170} y2={112} />
      <AttributeLink x1={124} y1={124} x2={170} y2={120} />
      <AttributeLink x1={128} y1={158} x2={170} y2={130} />
      <EntityBox x={170} y={97} w={124} h={46} label="C" />
      <Connector x1={294} y1={120} x2={354} y2={120} total />
      <Ratio x={308} y={138} text="M" />
      <RelationshipDiamond cx={400} cy={120} w={92} h={40} label="R2" />
      <Connector x1={446} y1={120} x2={510} y2={120} />
      <Ratio x={496} y={138} text="1" />
      <EntityBox x={510} y={95} w={130} h={50} label="B" weak />
      <AttributeOval cx={480} cy={58} rx={34} label="B1" identifier="dashed" />
      <AttributeOval cx={575} cy={34} rx={34} label="B2" />
      <AttributeOval cx={672} cy={58} rx={40} label="B3" multivalued />
      <AttributeLink x1={502} y1={70} x2={570} y2={95} />
      <AttributeLink x1={575} y1={49} x2={575} y2={95} />
      <AttributeLink x1={646} y1={70} x2={585} y2={95} />
      <Connector x1={575} y1={145} x2={575} y2={202} total />
      <Ratio x={594} y={170} text="M" />
      <RelationshipDiamond cx={575} cy={228} w={100} h={50} label="R1" identifying />
      <Connector x1={575} y1={253} x2={575} y2={300} />
      <Ratio x={592} y={290} text="1" />
      <EntityBox x={515} y={300} w={124} h={44} label="A" />
      <AttributeOval cx={520} cy={396} rx={36} label="A1" identifier="solid" />
      <AttributeOval cx={630} cy={396} rx={36} label="A2" />
      <AttributeLink x1={530} y1={381} x2={560} y2={344} />
      <AttributeLink x1={620} y1={381} x2={595} y2={344} />

      <Connector x1={232} y1={143} x2={232} y2={198} />
      <Ratio x={250} y={160} text="M" />
      <RelationshipDiamond cx={232} cy={218} w={88} h={40} label="R4" />
      <Connector x1={232} y1={238} x2={232} y2={300} />
      <Ratio x={250} y={292} text="N" />
      <EntityBox x={170} y={300} w={124} h={44} label="D" />
      <AttributeOval cx={86} cy={304} rx={34} label="D1" identifier="solid" />
      <AttributeOval cx={80} cy={258} rx={34} label="D2" />
      <AttributeOval cx={62} cy={354} rx={34} label="D3" />
      <AttributeLink x1={84} y1={273} x2={86} y2={289} />
      <AttributeLink x1={80} y1={318} x2={68} y2={339} />
      <AttributeLink x1={120} y1={306} x2={170} y2={318} />
      <Connector x1={232} y1={344} x2={232} y2={386} />
      <Ratio x={250} y={362} text="M" />
      <RelationshipDiamond cx={232} cy={406} w={88} h={40} label="R5" />
      <Connector x1={232} y1={426} x2={232} y2={468} />
      <Ratio x={250} y={460} text="1" />
      <EntityBox x={170} y={468} w={124} h={44} label="E" />
      <AttributeOval cx={96} cy={490} rx={36} label="E1" identifier="solid" />
      <AttributeOval cx={370} cy={490} rx={36} label="E2" />
      <AttributeLink x1={132} y1={490} x2={170} y2={490} />
      <AttributeLink x1={334} y1={490} x2={294} y2={490} />
      <Connector x1={174} y1={512} x2={190} y2={572} />
      <Ratio x={162} y={534} text="1" />
      <Connector x1={290} y1={512} x2={276} y2={572} total />
      <Ratio x={304} y={534} text="M" />
      <RelationshipDiamond cx={233} cy={572} w={88} h={36} label="R6" />
    </Figure>
  );
}

// 20. Svaga A och B, sammansatt partiell nyckel B1, unära R1 med dubbel linje på 1-rollen.
function Ddl20() {
  return (
    <Figure viewBox="0 0 680 440" maxWidth={680} label="Chen-diagram: B är svag (dubbel rektangel) med den sammansatta partiella identifieraren B1 (streckat understruken) av B2, B3 och B4, samt B5. B — R3 (identifierande) — C: M vid B med dubbel linje, 1 vid C. C har identifierarna C1 och C2. C — R4 — D: 1 vid C, M vid D med dubbel linje. D har D1 understruket och D2. B — R2 med attributet R2a — A: N vid B, M vid A. A är svag med A1 streckat understruket och A2. A — R5 (identifierande) — D: M vid A med dubbel linje, 1 vid D. Unär R1 under A: M med enkel linje, 1 med dubbel linje." caption="Uppgift 20. Två svaga entiteter; B1 är en sammansatt partiell identifierare. I den unära R1 sitter dubbellinjen på 1-rollen.">
      <AttributeOval cx={110} cy={52} rx={32} label="B2" />
      <AttributeOval cx={196} cy={24} rx={32} label="B3" />
      <AttributeOval cx={305} cy={36} rx={32} label="B4" />
      <AttributeOval cx={206} cy={76} rx={32} label="B1" identifier="dashed" />
      <AttributeOval cx={70} cy={100} rx={32} label="B5" />
      <AttributeLink x1={138} y1={60} x2={176} y2={72} />
      <AttributeLink x1={198} y1={39} x2={204} y2={61} />
      <AttributeLink x1={276} y1={44} x2={234} y2={68} />
      <AttributeLink x1={200} y1={91} x2={192} y2={117} />
      <AttributeLink x1={100} y1={106} x2={140} y2={120} />
      <EntityBox x={130} y={117} w={110} h={42} label="B" weak />
      <Connector x1={240} y1={138} x2={306} y2={138} total />
      <Ratio x={256} y={156} text="M" />
      <RelationshipDiamond cx={354} cy={138} w={96} h={42} label="R3" identifying />
      <Connector x1={402} y1={138} x2={490} y2={138} />
      <Ratio x={476} y={156} text="1" />
      <EntityBox x={490} y={117} w={110} h={42} label="C" />
      <AttributeOval cx={500} cy={78} rx={34} label="C1" identifier="solid" />
      <AttributeOval cx={598} cy={78} rx={34} label="C2" identifier="solid" />
      <AttributeLink x1={510} y1={93} x2={535} y2={117} />
      <AttributeLink x1={588} y1={93} x2={560} y2={117} />
      <Connector x1={545} y1={159} x2={545} y2={208} />
      <Ratio x={562} y={178} text="1" />
      <RelationshipDiamond cx={545} cy={228} w={88} h={40} label="R4" />
      <Connector x1={545} y1={248} x2={545} y2={317} total />
      <Ratio x={564} y={308} text="M" />
      <EntityBox x={490} y={317} w={110} h={42} label="D" />
      <AttributeOval cx={500} cy={400} rx={34} label="D1" identifier="solid" />
      <AttributeOval cx={610} cy={400} rx={34} label="D2" />
      <AttributeLink x1={510} y1={385} x2={530} y2={359} />
      <AttributeLink x1={598} y1={385} x2={570} y2={359} />

      <Connector x1={185} y1={159} x2={185} y2={214} />
      <Ratio x={202} y={178} text="N" />
      <RelationshipDiamond cx={185} cy={234} w={88} h={40} label="R2" />
      <AttributeOval cx={305} cy={234} rx={34} label="R2a" />
      <AttributeLink x1={229} y1={234} x2={271} y2={234} />
      <Connector x1={185} y1={254} x2={185} y2={317} />
      <Ratio x={202} y={308} text="M" />
      <EntityBox x={130} y={317} w={110} h={42} label="A" weak />
      <AttributeOval cx={62} cy={312} rx={32} label="A1" identifier="dashed" />
      <AttributeOval cx={58} cy={356} rx={32} label="A2" />
      <AttributeLink x1={94} y1={316} x2={130} y2={330} />
      <AttributeLink x1={90} y1={352} x2={130} y2={344} />
      <Connector x1={240} y1={338} x2={306} y2={338} total />
      <Ratio x={256} y={330} text="M" />
      <RelationshipDiamond cx={354} cy={338} w={96} h={42} label="R5" identifying />
      <Connector x1={402} y1={338} x2={490} y2={338} />
      <Ratio x={476} y={330} text="1" />
      <Connector x1={134} y1={359} x2={146} y2={410} />
      <Ratio x={122} y={378} text="M" />
      <Connector x1={236} y1={359} x2={224} y2={410} total />
      <Ratio x={250} y={378} text="1" />
      <RelationshipDiamond cx={185} cy={410} w={80} h={34} label="R1" />
    </Figure>
  );
}

// 21. Kedjade svaga A under B under C, flervärt A2, 1:1 R3, unär M:N R4.
function Ddl21() {
  return (
    <Figure viewBox="0 0 680 430" maxWidth={680} label="Chen-diagram: B är svag med B1 streckat understruket och det sammansatta attributet B2 av B3 och B4. B — R2 (identifierande) — C: M vid B med dubbel linje, 1 vid C. C har C1 understruket och C2. C — R3 — D: 1 vid C med dubbel linje, 1 vid D. D har identifierarna D1 och D2. Unär R4 under D, M och N. B — R1 (identifierande) — A: 1 vid B, M vid A med dubbel linje. A är svag med A1 streckat understruket och flervärdesattributet A2. A — R5 — D: M vid A, 1 vid D, enkla linjer." caption="Uppgift 21. A är svag under B, som själv är svag under C. R3 är 1:1 med totalt deltagande vid C; B2 är ett sammansatt attribut, inte en identifierare.">
      <AttributeOval cx={70} cy={84} rx={32} label="B1" identifier="dashed" />
      <AttributeOval cx={176} cy={88} rx={34} label="B2" />
      <AttributeOval cx={120} cy={24} rx={32} label="B3" />
      <AttributeOval cx={218} cy={34} rx={32} label="B4" />
      <AttributeLink x1={132} y1={39} x2={166} y2={73} />
      <AttributeLink x1={208} y1={49} x2={186} y2={73} />
      <AttributeLink x1={80} y1={99} x2={92} y2={123} />
      <AttributeLink x1={164} y1={103} x2={146} y2={123} />
      <EntityBox x={60} y={123} w={110} h={42} label="B" weak />
      <Connector x1={170} y1={144} x2={236} y2={144} total />
      <Ratio x={186} y={134} text="M" />
      <RelationshipDiamond cx={284} cy={144} w={96} h={42} label="R2" identifying />
      <Connector x1={332} y1={144} x2={400} y2={144} />
      <Ratio x={386} y={134} text="1" />
      <EntityBox x={400} y={123} w={110} h={42} label="C" />
      <AttributeOval cx={430} cy={72} rx={34} label="C1" identifier="solid" />
      <AttributeOval cx={520} cy={84} rx={34} label="C2" />
      <AttributeLink x1={436} y1={87} x2={450} y2={123} />
      <AttributeLink x1={508} y1={99} x2={480} y2={123} />
      <Connector x1={455} y1={165} x2={455} y2={217} total />
      <Ratio x={472} y={184} text="1" />
      <RelationshipDiamond cx={455} cy={237} w={88} h={40} label="R3" />
      <Connector x1={455} y1={257} x2={455} y2={317} />
      <Ratio x={472} y={306} text="1" />
      <EntityBox x={400} y={317} w={110} h={42} label="D" />
      <AttributeOval cx={566} cy={282} rx={34} label="D1" identifier="solid" />
      <AttributeOval cx={604} cy={330} rx={34} label="D2" identifier="solid" />
      <AttributeLink x1={548} y1={295} x2={510} y2={322} />
      <AttributeLink x1={570} y1={330} x2={510} y2={336} />
      <Connector x1={404} y1={359} x2={416} y2={400} />
      <Ratio x={394} y={378} text="M" />
      <Connector x1={506} y1={359} x2={494} y2={400} />
      <Ratio x={518} y={378} text="N" />
      <RelationshipDiamond cx={455} cy={400} w={80} h={34} label="R4" />

      <Connector x1={115} y1={165} x2={115} y2={212} />
      <Ratio x={132} y={184} text="1" />
      <RelationshipDiamond cx={115} cy={232} w={96} h={42} label="R1" identifying />
      <Connector x1={115} y1={253} x2={115} y2={317} total />
      <Ratio x={134} y={306} text="M" />
      <EntityBox x={60} y={317} w={110} h={42} label="A" weak />
      <AttributeOval cx={58} cy={392} rx={34} label="A1" identifier="dashed" />
      <AttributeOval cx={152} cy={392} rx={38} label="A2" multivalued />
      <AttributeLink x1={68} y1={377} x2={90} y2={359} />
      <AttributeLink x1={146} y1={377} x2={130} y2={359} />
      <Connector x1={170} y1={338} x2={239} y2={338} />
      <Ratio x={186} y={330} text="M" />
      <RelationshipDiamond cx={283} cy={338} w={88} h={40} label="R5" />
      <Connector x1={327} y1={338} x2={400} y2={338} />
      <Ratio x={386} y={330} text="1" />
    </Figure>
  );
}

// 22. Svag B med unära R2 och 1:M R1, svag A under D, sammansatt D1, flervärt D4.
function Ddl22() {
  return (
    <Figure viewBox="0 0 640 400" maxWidth={640} label="Chen-diagram: B är svag med B1 streckat understruket. Unär R2 ovanför B: M och 1, enkla linjer. B — R3 (identifierande) — C: M vid B med dubbel linje, 1 vid C. C har identifierarna C1 och C2. C — R4 med attributet R4a — D: M vid C, N vid D. D har den sammansatta identifieraren D1 (understruken) av D2 och D3, och flervärdesattributet D4. B — R1 — A: M vid B med dubbel linje, 1 vid A. A är svag med A1 streckat understruket och A2. A — R5 (identifierande) — D: M vid A med dubbel linje, 1 vid D." caption="Uppgift 22. B är svag under C och har den unära 1:M-relationen R2; A är svag under D. R1 är en vanlig 1:M, inte identifierande.">
      <RelationshipDiamond cx={168} cy={36} w={84} h={34} label="R2" />
      <Connector x1={116} y1={97} x2={126} y2={36} />
      <Ratio x={104} y={88} text="M" />
      <Connector x1={220} y1={97} x2={210} y2={36} />
      <Ratio x={232} y={88} text="1" />
      <AttributeOval cx={50} cy={118} rx={32} label="B1" identifier="dashed" />
      <AttributeLink x1={82} y1={118} x2={113} y2={118} />
      <EntityBox x={113} y={97} w={110} h={42} label="B" weak />
      <Connector x1={223} y1={118} x2={272} y2={118} total />
      <Ratio x={238} y={136} text="M" />
      <RelationshipDiamond cx={320} cy={118} w={96} h={42} label="R3" identifying />
      <Connector x1={368} y1={118} x2={420} y2={118} />
      <Ratio x={406} y={136} text="1" />
      <EntityBox x={420} y={97} w={110} h={42} label="C" />
      <AttributeOval cx={450} cy={46} rx={34} label="C1" identifier="solid" />
      <AttributeOval cx={540} cy={58} rx={34} label="C2" identifier="solid" />
      <AttributeLink x1={456} y1={61} x2={466} y2={97} />
      <AttributeLink x1={528} y1={73} x2={500} y2={97} />
      <Connector x1={475} y1={139} x2={475} y2={182} />
      <Ratio x={492} y={156} text="M" />
      <RelationshipDiamond cx={475} cy={202} w={88} h={40} label="R4" />
      <AttributeOval cx={584} cy={202} rx={34} label="R4a" />
      <AttributeLink x1={519} y1={202} x2={550} y2={202} />
      <Connector x1={475} y1={222} x2={475} y2={267} />
      <Ratio x={492} y={260} text="N" />
      <EntityBox x={420} y={267} w={110} h={42} label="D" />
      <AttributeOval cx={584} cy={288} rx={38} label="D4" multivalued />
      <AttributeLink x1={530} y1={288} x2={546} y2={288} />
      <AttributeOval cx={460} cy={340} rx={34} label="D1" identifier="solid" />
      <AttributeOval cx={400} cy={380} rx={32} label="D2" />
      <AttributeOval cx={510} cy={380} rx={32} label="D3" />
      <AttributeLink x1={466} y1={325} x2={472} y2={309} />
      <AttributeLink x1={420} y1={367} x2={446} y2={354} />
      <AttributeLink x1={496} y1={367} x2={474} y2={354} />

      <Connector x1={168} y1={139} x2={168} y2={185} total />
      <Ratio x={186} y={156} text="M" />
      <RelationshipDiamond cx={168} cy={205} w={84} h={40} label="R1" />
      <Connector x1={168} y1={225} x2={168} y2={267} />
      <Ratio x={184} y={260} text="1" />
      <EntityBox x={113} y={267} w={110} h={42} label="A" weak />
      <AttributeOval cx={118} cy={350} rx={32} label="A1" identifier="dashed" />
      <AttributeOval cx={214} cy={344} rx={32} label="A2" />
      <AttributeLink x1={126} y1={335} x2={150} y2={309} />
      <AttributeLink x1={206} y1={329} x2={192} y2={309} />
      <Connector x1={223} y1={288} x2={272} y2={288} total />
      <Ratio x={238} y={280} text="M" />
      <RelationshipDiamond cx={320} cy={288} w={96} h={42} label="R5" identifying />
      <Connector x1={368} y1={288} x2={420} y2={288} />
      <Ratio x={406} y={280} text="1" />
    </Figure>
  );
}

// Häftets uppgift 3 (Läsa diagram): Employee, Office, Order, Customer, Product.
function Haftet3() {
  return (
    <Figure viewBox="0 0 740 440" maxWidth={740} label="Chen-diagram: Employee med EmployeeNo understruket, flervärdesattributet Address (dubbel oval, inte understruken) och Name. Unär Supervise till vänster: supervises 1 med enkel linje, Supervised_by M med dubbel linje. Employee — Work — Office: M vid Employee, N vid Office, enkla linjer. Office har Name understruket. Office — Contact — Customer: 1 vid Office, M vid Customer med dubbel linje. Customer har den sammansatta identifieraren Identifier (understruken) av Address och Name. Employee — Handle — Order: 1 vid Employee, M vid Order med dubbel linje. Order har OrderNo understruket, Date och det härledda Total (streckad oval). Order — Places — Customer: M vid Order med dubbel linje, 1 vid Customer. Order — Include med attributet Quantity — Product: 1 vid Order med dubbel linje, M vid Product. Product har ProductNo understruket, Name och Price." caption="Övningshäftet uppgift 3. Address under Employee är flervärt men inte understruket; Customer identifieras av kombinationen av Address och Name.">
      <AttributeOval cx={260} cy={18} rx={52} label="EmployeeNo" identifier="solid" />
      <AttributeOval cx={180} cy={44} rx={40} label="Address" multivalued />
      <AttributeOval cx={322} cy={50} rx={34} label="Name" />
      <AttributeLink x1={258} y1={33} x2={244} y2={80} />
      <AttributeLink x1={200} y1={57} x2={236} y2={80} />
      <AttributeLink x1={306} y1={63} x2={256} y2={80} />
      <EntityBox x={180} y={80} label="Employee" />
      <RelationshipDiamond cx={60} cy={100} w={100} h={40} label="Supervise" size={12} />
      <Connector x1={84} y1={88} x2={180} y2={84} />
      <Role x={104} y={74} text="supervises" />
      <Ratio x={168} y={76} text="1" />
      <Connector x1={84} y1={112} x2={180} y2={118} total />
      <Role x={96} y={138} text="Supervised_by" />
      <Ratio x={168} y={136} text="M" />
      <Connector x1={304} y1={102} x2={356} y2={102} />
      <Ratio x={320} y={120} text="M" />
      <RelationshipDiamond cx={404} cy={102} w={92} h={40} label="Work" />
      <Connector x1={450} y1={102} x2={500} y2={102} />
      <Ratio x={486} y={120} text="N" />
      <EntityBox x={500} y={80} label="Office" />
      <AttributeOval cx={562} cy={32} rx={34} label="Name" identifier="solid" />
      <AttributeLink x1={562} y1={47} x2={562} y2={80} />
      <Connector x1={562} y1={124} x2={562} y2={150} />
      <Ratio x={578} y={140} text="1" />
      <RelationshipDiamond cx={562} cy={170} w={92} h={40} label="Contact" />
      <Connector x1={562} y1={190} x2={562} y2={228} total />
      <Ratio x={580} y={220} text="M" />
      <EntityBox x={500} y={228} label="Customer" />
      <AttributeOval cx={690} cy={250} rx={46} label="Identifier" identifier="solid" />
      <AttributeOval cx={690} cy={200} rx={40} label="Address" />
      <AttributeOval cx={694} cy={300} rx={34} label="Name" />
      <AttributeLink x1={690} y1={215} x2={690} y2={235} />
      <AttributeLink x1={692} y1={265} x2={693} y2={285} />
      <AttributeLink x1={624} y1={250} x2={644} y2={250} />

      <Connector x1={242} y1={124} x2={242} y2={150} />
      <Ratio x={258} y={140} text="1" />
      <RelationshipDiamond cx={242} cy={170} w={92} h={40} label="Handle" />
      <Connector x1={242} y1={190} x2={242} y2={228} total />
      <Ratio x={260} y={220} text="M" />
      <EntityBox x={180} y={228} label="Order" />
      <AttributeOval cx={150} cy={196} rx={34} label="Date" />
      <AttributeOval cx={86} cy={224} rx={44} label="OrderNo" identifier="solid" />
      <AttributeOval cx={110} cy={268} rx={34} label="Total" derived />
      <AttributeLink x1={166} y1={209} x2={196} y2={228} />
      <AttributeLink x1={130} y1={228} x2={180} y2={244} />
      <AttributeLink x1={144} y1={264} x2={180} y2={258} />
      <Connector x1={304} y1={250} x2={356} y2={250} total />
      <Ratio x={320} y={268} text="M" />
      <RelationshipDiamond cx={404} cy={250} w={92} h={40} label="Places" />
      <Connector x1={450} y1={250} x2={500} y2={250} />
      <Ratio x={486} y={268} text="1" />
      <Connector x1={242} y1={272} x2={242} y2={296} total />
      <Ratio x={258} y={290} text="1" />
      <RelationshipDiamond cx={242} cy={316} w={92} h={40} label="Include" />
      <AttributeOval cx={124} cy={316} rx={44} label="Quantity" />
      <AttributeLink x1={168} y1={316} x2={196} y2={316} />
      <Connector x1={242} y1={336} x2={242} y2={362} />
      <Ratio x={260} y={356} text="M" />
      <EntityBox x={180} y={362} h={40} label="Product" />
      <AttributeOval cx={380} cy={340} rx={34} label="Name" />
      <AttributeOval cx={410} cy={382} rx={50} label="ProductNo" identifier="solid" />
      <AttributeOval cx={370} cy={420} rx={34} label="Price" />
      <AttributeLink x1={346} y1={344} x2={304} y2={372} />
      <AttributeLink x1={360} y1={382} x2={304} y2={382} />
      <AttributeLink x1={340} y1={414} x2={304} y2={394} />
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
  "ddl-18": Ddl18,
  "ddl-19": Ddl19,
  "ddl-20": Ddl20,
  "ddl-21": Ddl21,
  "ddl-22": Ddl22,
  "stmt-haftet3": Haftet3,
};

if (import.meta.env?.DEV) {
  for (const id of MODEL_FIGURE_IDS) if (!MODEL_FIGURES[id]) console.warn(`Modellfiguren "${id}" saknas.`);
}

export function ModelFigure({ id }) {
  const Component = MODEL_FIGURES[id];
  return Component ? <Component /> : null;
}

// Övningsflikarna delar figurer: en uppgift kan peka på en modellfigur
// eller på ett av kompendiets diagram (kapitel 6:s genomgångar).
export function ExerciseFigure({ id }) {
  return MODEL_FIGURES[id] ? <ModelFigure id={id} /> : <Diagram id={id} />;
}
