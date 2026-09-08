// Modellverkstaden: ER-diagram → relationsschema, rättat mot facit som
// mängder (lib/modelCheck.js). Facit är häftets facit (uppgift 4–9), läst
// mot understrykningarna på sidan 11–12: hel = PK, prickad = FK, båda =
// bådadera. Skrivet i Fö5:s notation, samma som svaret. Varje relation bär
// en regeltagg (kapitel 7) och en rad "varför" som visas när relationen
// saknas eller är fel. Diagrammen ritas om med sajtens primitiver — Björns
// bilder finns inte i repot. `facit` får vara en lista av alternativ.
export const modelExercises = [
  {
    id: "mod-04", number: 4, title: "Person och Car", notation: "crow", diagram: "mod-person-car",
    source: "Övningshäftet uppgift 4",
    intro: "En person kan äga noll eller flera bilar; varje bil ägs av exakt en person.",
    facit: [`PERSON(Name, Address, Salary)
PK = {Name}

CAR(LicenseNumber, Brand, Speed, OwnerName)
PK = {LicenseNumber}
FK1: (OwnerName) REF PERSON(Name)`],
    rules: {
      person: { rule: "Regel 1", why: "Vanlig entitet: en relation med de enkla attributen och identifieraren som primärnyckel." },
      car: { rule: "Regel 4", why: "Binär 1:N: ett-sidans primärnyckel läggs som främmande nyckel i många-sidans relation. Ingen ny relation." },
    },
  },
  {
    id: "mod-05", number: 5, title: "Teacher och Course", notation: "crow", diagram: "mod-teacher-course",
    source: "Övningshäftet uppgift 5",
    intro: "En lärare undervisar på noll eller flera kurser och en kurs har noll eller flera lärare (Teach). Varje kurs har exakt en ansvarig lärare; en lärare kan vara ansvarig för flera kurser (Responsible).",
    facit: [`TEACHER(EmployeeNo, Name, Salary)
PK = {EmployeeNo}

COURSE(CourseCode, Name, Credits, EmployeeNo)
PK = {CourseCode}
FK1: (EmployeeNo) REF TEACHER(EmployeeNo)

TEACH(EmployeeNo, CourseCode)
PK = {EmployeeNo, CourseCode}
FK1: (EmployeeNo) REF TEACHER(EmployeeNo)
FK2: (CourseCode) REF COURSE(CourseCode)`],
    rules: {
      teacher: { rule: "Regel 1", why: "Vanlig entitet: en relation med de enkla attributen och identifieraren som primärnyckel." },
      course: { rule: "Regel 4", why: "Responsible är 1:N: lärarens primärnyckel läggs som främmande nyckel i Course, många-sidan." },
      teach: { rule: "Regel 5", why: "Teach är M:N och kräver en egen relation med båda nycklarna som sammansatt primärnyckel, var för sig främmande nycklar." },
    },
  },
  {
    id: "mod-06", number: 6, title: "Employee med Supervise och Email", notation: "chen", diagram: "mod-employee-supervise",
    source: "Övningshäftet uppgift 6",
    intro: "Employee med identifieraren EmployeeNo, attributen Name och Salary och flervärdesattributet Email. Unär relation Supervise: en anställd handleder (supervises) många och handleds av (supervised_by) högst en.",
    facit: [`EMPLOYEE(EmployeeNo, Name, Salary, SupervisorNo)
PK = {EmployeeNo}
FK1: (SupervisorNo) REF EMPLOYEE(EmployeeNo)

EMPLOYEE_EMAIL(EmployeeNo, Email)
PK = {EmployeeNo, Email}
FK1: (EmployeeNo) REF EMPLOYEE(EmployeeNo)`],
    rules: {
      employee: { rule: "Unär 1:N", why: "Unär relation följer den binära regeln av samma form: främmande nyckel i samma relation, namngiven efter rollen, mot den egna primärnyckeln." },
      employeeemail: { rule: "Regel 6", why: "Flervärdesattribut: egen relation med ägarens primärnyckel som främmande nyckel plus värdet; kombinationen är primärnyckel." },
    },
  },
  {
    id: "mod-07", number: 7, title: "Hotel och Room", notation: "chen", diagram: "mod-hotel-room",
    source: "Övningshäftet uppgift 7",
    intro: "Room är en svag entitet under Hotel via den identifierande relationen Work, med RoomNumber som partiell nyckel och Price. Hotel identifieras av Name och har Rating.",
    facit: [`HOTEL(Name, Rating)
PK = {Name}

ROOM(RoomNumber, HotelName, Price)
PK = {RoomNumber, HotelName}
FK1: (HotelName) REF HOTEL(Name)`],
    rules: {
      hotel: { rule: "Regel 1", why: "Vanlig entitet: en relation med de enkla attributen och identifieraren som primärnyckel." },
      room: { rule: "Regel 2", why: "Svag entitet: ägarens primärnyckel som främmande nyckel, och primärnyckeln är ägarens nyckel tillsammans med den partiella nyckeln." },
    },
  },
  {
    id: "mod-08", number: 8, title: "Employee, Work och Department", notation: "chen", diagram: "mod-employee-department",
    source: "Övningshäftet uppgift 8",
    intro: "Employee (EmployeeNo, Name, Address) och Department med den sammansatta identifieraren Id av Name och Address samt Description. Work är M:N med attributet Hours.",
    facit: [`EMPLOYEE(EmployeeNo, Name, Address)
PK = {EmployeeNo}

DEPARTMENT(Name, Address, Description)
PK = {Name, Address}

WORK(EmployeeNo, DeptName, DeptAddress, Hours)
PK = {EmployeeNo, DeptName, DeptAddress}
FK1: (EmployeeNo) REF EMPLOYEE(EmployeeNo)
FK2: (DeptName, DeptAddress) REF DEPARTMENT(Name, Address)`],
    rules: {
      employee: { rule: "Regel 1", why: "Vanlig entitet: en relation med de enkla attributen och identifieraren som primärnyckel." },
      department: { rule: "Regel 1", why: "Sammansatt identifierare: alla delarna tillsammans bildar primärnyckeln — inget separat Id-attribut." },
      work: { rule: "Regel 5", why: "M:N: ny relation med båda deltagarnas primärnycklar. Departments nyckel är sammansatt och kopieras hel, som en främmande nyckel med två attribut. Hours står utanför primärnyckeln." },
    },
  },
  {
    id: "mod-09", number: 9, title: "Team, Employee, Office och Customer", notation: "chen", diagram: "mod-team-office",
    source: "Övningshäftet uppgift 9",
    intro: "Employee arbetar i team (WorksIn, M:N med Hours, total vid Employee), arbetar på exakt ett Office (WorksAt, N:1), handhar kunder (Handle 1:M, total vid Customer) och har flervärdesattributet Certificate. Customer har den unära M:N-relationen FamilyRelation.",
    facit: [`OFFICE(Address, Name)
PK = {Address}

EMPLOYEE(EmployeeNo, Name, Address, OfficeAddress)
PK = {EmployeeNo}
FK1: (OfficeAddress) REF OFFICE(Address)

TEAM(TeamNo, Name)
PK = {TeamNo}

CUSTOMER(CustomerNumber, Name, DiscountClass, EmployeeNo)
PK = {CustomerNumber}
FK1: (EmployeeNo) REF EMPLOYEE(EmployeeNo)

WORK(EmployeeNo, TeamNo, Hours)
PK = {EmployeeNo, TeamNo}
FK1: (EmployeeNo) REF EMPLOYEE(EmployeeNo)
FK2: (TeamNo) REF TEAM(TeamNo)

FAMILY_RELATION(CustomerNumber, RelativeCustomerNumber)
PK = {CustomerNumber, RelativeCustomerNumber}
FK1: (CustomerNumber) REF CUSTOMER(CustomerNumber)
FK2: (RelativeCustomerNumber) REF CUSTOMER(CustomerNumber)

EMPLOYEE_CERTIFICATE(EmployeeNo, Certificate)
PK = {EmployeeNo, Certificate}
FK1: (EmployeeNo) REF EMPLOYEE(EmployeeNo)`],
    rules: {
      office: { rule: "Regel 1", why: "Vanlig entitet med identifieraren Address som primärnyckel." },
      employee: { rule: "Regel 4", why: "WorksAt är N:1: Office-nyckeln läggs som främmande nyckel i Employee, många-sidan." },
      team: { rule: "Regel 1", why: "Vanlig entitet med identifieraren TeamNo som primärnyckel." },
      customer: { rule: "Regel 4", why: "Handle är 1:M: den anställdes nyckel läggs som främmande nyckel i Customer, många-sidan." },
      work: { rule: "Regel 5", why: "WorksIn är M:N: egen relation med båda nycklarna som sammansatt primärnyckel och Hours utanför nyckeln." },
      familyrelation: { rule: "Unär M:N", why: "Unär M:N ger en ny relation med två attribut som båda refererar samma relation och tillsammans är primärnyckel." },
      employeecertificate: { rule: "Regel 6", why: "Flervärdesattribut: egen relation med ägarens nyckel plus värdet som sammansatt primärnyckel." },
    },
  },
  {
    id: "mod-10", number: 10, title: "Festival, Stage och Slot", notation: "chen", diagram: "mod-festival",
    source: "Egen uppgift (kedjade svaga entiteter, som ordinarie tentans uppgift 1)",
    intro: "Festival identifieras av Name och har City. Stage är svag under Festival via Has, med StageName som partiell nyckel. Slot är svag under Stage via Hosts, med StartTime som partiell nyckel och attributet Artist. Varje led identifieras bara tillsammans med sin ägare.",
    facit: [`FESTIVAL(Name, City)
PK = {Name}

STAGE(FestivalName, StageName)
PK = {FestivalName, StageName}
FK1: (FestivalName) REF FESTIVAL(Name)

SLOT(FestivalName, StageName, StartTime, Artist)
PK = {FestivalName, StageName, StartTime}
FK1: (FestivalName, StageName) REF STAGE(FestivalName, StageName)`],
    rules: {
      festival: { rule: "Regel 1", why: "Vanlig entitet med identifieraren Name som primärnyckel." },
      stage: { rule: "Regel 2", why: "Svag entitet: ägarens nyckel som främmande nyckel, primärnyckel = ägarens nyckel plus den partiella." },
      slot: { rule: "Kedjad svag", why: "Kedjade svaga entiteter mappas ägare först, och varje led refererar sin närmaste ägares hela nyckel: Slot pekar på Stage(FestivalName, StageName), inte på StageName ensamt och inte på Festival direkt." },
    },
  },
];
