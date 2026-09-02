// Generator för slumpade SQL-övningar.
//
// Uppgifterna byggs ur sjukhusschemat i stället för att hämtas ur en lista,
// så att de aldrig blir en upprepning av kursövningarna: mall, tabell,
// kolumner, jämförvärden och sorteringsriktning slumpas var för sig.
//
// Modulen är ren — den känner inte till sql.js. Värdena den fyller in
// kommer i ett facts-objekt som läses ur den riktiga databasen
// (collectFacts i sqlPractice.js), så filtren träffar alltid verkliga rader.

// Liten deterministisk slumpgenerator (mulberry32). Samma frö ger samma
// övning, vilket gör att en trasig uppgift går att återskapa i test.
export function makeRng(seed) {
  let a = seed >>> 0;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = (rng, list) => list[Math.floor(rng() * list.length)];

function pickMany(rng, list, count) {
  const pool = [...list];
  const chosen = [];
  while (chosen.length < count && pool.length > 0) {
    chosen.push(...pool.splice(Math.floor(rng() * pool.length), 1));
  }
  return chosen;
}

// Kolumnernas svenska benämningar, för uppgiftstexten.
const LABEL = {
  "Unit.UnitNo": "enhetsnummer",
  "Unit.UnitName": "namn",
  "Unit.UnitAddress": "adress",
  "Employee.EmpNo": "anställningsnummer",
  "Employee.EmpName": "namn",
  "Employee.EmpAddress": "adress",
  "Employee.EmpSalary": "lön",
  "Employee.EmpPhoneNumber": "telefonnummer",
  "Patient.PatientNo": "patientnummer",
  "Patient.PatientName": "namn",
  "Patient.PatientAddress": "adress",
  "Patient.PatientPhoneNumber": "telefonnummer",
  "Illness.IllnessName": "namn",
  "Car.LicenseNo": "registreringsnummer",
  "Car.Brand": "märke",
  "Car.Price": "pris",
};

// Tabellernas svenska former och vilka kolumner som är vettiga att visa.
const TABLES = {
  Employee: {
    all: "alla anställda",
    those: "de anställda som",
    each: "varje anställd",
    text: ["EmpName", "EmpAddress"],
    show: ["EmpNo", "EmpName", "EmpAddress", "EmpSalary", "EmpPhoneNumber"],
    numeric: ["EmpSalary"],
  },
  Patient: {
    all: "alla patienter",
    those: "de patienter som",
    each: "varje patient",
    text: ["PatientName", "PatientAddress"],
    show: ["PatientNo", "PatientName", "PatientAddress", "PatientPhoneNumber"],
    numeric: [],
  },
  Unit: {
    all: "alla enheter",
    those: "de enheter som",
    each: "varje enhet",
    text: ["UnitName", "UnitAddress"],
    show: ["UnitNo", "UnitName", "UnitAddress"],
    numeric: [],
  },
  Illness: {
    all: "alla sjukdomar",
    those: "de sjukdomar som",
    each: "varje sjukdom",
    text: ["IllnessName"],
    show: ["IllnessName"],
    numeric: [],
  },
  Car: {
    all: "alla bilar",
    those: "de bilar som",
    each: "varje bil",
    text: ["Brand"],
    show: ["LicenseNo", "Brand", "Price"],
    numeric: ["Price"],
  },
};

const label = (table, column) => LABEL[`${table}.${column}`] || column;

function joinSwedish(parts) {
  if (parts.length === 1) return parts[0];
  return `${parts.slice(0, -1).join(", ")} och ${parts[parts.length - 1]}`;
}

const labels = (table, columns) => joinSwedish(columns.map((c) => label(table, c)));

// Predikat i text: "bor i Lund", "är av märket volvo".
function textPredicate(table, column, value) {
  if (column.endsWith("Address")) return `bor i ${value}`;
  if (column === "Brand") return `är av märket ${value}`;
  return `heter ${value}`;
}

function numberPhrase(table, column, verb, amount) {
  const money = amount.toLocaleString("sv-SE").replace(/ /g, " ");
  if (column === "EmpSalary") return `tjänar ${verb} än ${money}`;
  if (column === "Price") return `kostar ${verb} än ${money} kronor`;
  return `har ${label(table, column)} ${verb} än ${money}`;
}

// Ett tröskelvärde som varken släpper igenom alla eller ingen rad.
function middleValue(rng, sorted) {
  if (sorted.length < 3) return null;
  const inner = sorted.slice(1, -1);
  return pick(rng, inner);
}

const valuesOf = (facts, table, column) => facts.values[`${table}.${column}`] || [];
const numbersOf = (facts, table, column) => facts.numbers[`${table}.${column}`] || [];

// ---------------------------------------------------------------------------
// Mallfamiljerna. Varje build returnerar en övning eller null när underlaget
// inte räcker (för få distinkta värden och liknande).
// ---------------------------------------------------------------------------

const FAMILIES = [
  {
    id: "projektion",
    difficulty: 1,
    build(rng, facts) {
      const table = pick(rng, ["Employee", "Patient", "Car", "Unit"]);
      const meta = TABLES[table];
      const columns = pickMany(rng, meta.show, 2 + Math.floor(rng() * 2));
      return {
        task: `Visa ${labels(table, columns)} för ${meta.all}.`,
        solution: `SELECT ${columns.join(", ")} FROM ${table};`,
        hint: "SELECT anger kolumnerna, FROM tabellen.",
        tables: [table],
      };
    },
  },
  {
    id: "filter-text",
    difficulty: 1,
    build(rng, facts) {
      const table = pick(rng, ["Employee", "Patient", "Car"]);
      const meta = TABLES[table];
      const column = pick(rng, meta.text);
      const pool = valuesOf(facts, table, column);
      if (pool.length < 2) return null;
      const value = pick(rng, pool);
      const columns = pickMany(rng, meta.show, 2);
      return {
        task: `Visa ${labels(table, columns)} för ${meta.those} ${textPredicate(table, column, value)}.`,
        solution: `SELECT ${columns.join(", ")} FROM ${table} WHERE ${column} = '${value}';`,
        hint: "Textvärden omges av enkla citattecken i WHERE.",
        tables: [table],
      };
    },
  },
  {
    id: "filter-tal",
    difficulty: 1,
    build(rng, facts) {
      const table = pick(rng, ["Employee", "Car"]);
      const meta = TABLES[table];
      const column = meta.numeric[0];
      const threshold = middleValue(rng, numbersOf(facts, table, column));
      if (threshold === null) return null;
      const over = rng() < 0.5;
      const columns = pickMany(rng, meta.show, 2);
      return {
        task: `Visa ${labels(table, columns)} för ${meta.those} ${numberPhrase(table, column, over ? "mer" : "mindre", threshold)}.`,
        solution: `SELECT ${columns.join(", ")} FROM ${table} WHERE ${column} ${over ? ">" : "<"} ${threshold};`,
        hint: "Tal skrivs utan citattecken.",
        tables: [table],
      };
    },
  },
  {
    id: "sortering",
    difficulty: 1,
    ordered: true,
    build(rng, facts) {
      const table = pick(rng, ["Employee", "Car", "Patient"]);
      const meta = TABLES[table];
      const sortColumn = pick(rng, [...meta.numeric, ...meta.text]);
      const desc = rng() < 0.5;
      const columns = pickMany(rng, meta.show, 2);
      if (!columns.includes(sortColumn)) columns.push(sortColumn);
      return {
        task: `Visa ${labels(table, columns)} för ${meta.all}, sorterade på ${label(table, sortColumn)} i ${desc ? "fallande" : "stigande"} ordning.`,
        solution: `SELECT ${columns.join(", ")} FROM ${table} ORDER BY ${sortColumn} ${desc ? "DESC" : "ASC"};`,
        hint: "ORDER BY sorterar; DESC vänder ordningen.",
        tables: [table],
        ordered: true,
      };
    },
  },
  {
    id: "distinct",
    difficulty: 1,
    build(rng, facts) {
      const table = pick(rng, ["Employee", "Patient", "Car"]);
      const meta = TABLES[table];
      const column = pick(rng, meta.text);
      if (valuesOf(facts, table, column).length < 2) return null;
      return {
        task: `Visa varje ${label(table, column)} som förekommer bland ${meta.all}, bara en gång per värde.`,
        solution: `SELECT DISTINCT ${column} FROM ${table};`,
        hint: "DISTINCT tar bort dubbletter ur resultatet.",
        tables: [table],
      };
    },
  },
  {
    id: "between",
    difficulty: 2,
    build(rng, facts) {
      const table = pick(rng, ["Employee", "Car"]);
      const meta = TABLES[table];
      const column = meta.numeric[0];
      const sorted = numbersOf(facts, table, column);
      if (sorted.length < 4) return null;
      const low = sorted[1];
      const high = sorted[sorted.length - 2];
      if (low >= high) return null;
      const money = (n) => n.toLocaleString("sv-SE").replace(/ /g, " ");
      const columns = pickMany(rng, meta.show, 2);
      return {
        task: `Visa ${labels(table, columns)} för ${meta.those} har ${label(table, column)} mellan ${money(low)} och ${money(high)}, gränserna inkluderade.`,
        solution: `SELECT ${columns.join(", ")} FROM ${table} WHERE ${column} BETWEEN ${low} AND ${high};`,
        hint: "BETWEEN tar med båda gränserna.",
        tables: [table],
      };
    },
  },
  {
    id: "in-lista",
    difficulty: 2,
    build(rng, facts) {
      const table = pick(rng, ["Employee", "Patient", "Car"]);
      const meta = TABLES[table];
      const column = pick(rng, meta.text);
      const pool = valuesOf(facts, table, column);
      if (pool.length < 3) return null;
      const chosen = pickMany(rng, pool, 2);
      const columns = pickMany(rng, meta.show, 2);
      const list = chosen.map((v) => `'${v}'`).join(", ");
      return {
        task: `Visa ${labels(table, columns)} för ${meta.those} har ${label(table, column)} ${joinSwedish(chosen)}. Använd IN.`,
        solution: `SELECT ${columns.join(", ")} FROM ${table} WHERE ${column} IN (${list});`,
        hint: "IN ersätter en kedja av OR.",
        tables: [table],
      };
    },
  },
  {
    id: "like",
    difficulty: 2,
    build(rng, facts) {
      const table = pick(rng, ["Employee", "Patient", "Illness"]);
      const meta = TABLES[table];
      const column = meta.text[0];
      const initials = facts.initials[`${table}.${column}`] || [];
      if (initials.length < 2) return null;
      const letter = pick(rng, initials);
      const columns = pickMany(rng, meta.show, Math.min(2, meta.show.length));
      return {
        task: `Visa ${labels(table, columns)} för ${meta.those} har ett ${label(table, column)} som börjar på bokstaven ${letter}.`,
        solution: `SELECT ${columns.join(", ")} FROM ${table} WHERE ${column} LIKE '${letter}%';`,
        hint: "% i LIKE betyder noll eller fler tecken.",
        tables: [table],
      };
    },
  },
  {
    id: "null-test",
    difficulty: 2,
    build(rng, facts) {
      const withOwner = rng() < 0.5;
      return {
        task: withOwner
          ? "Visa registreringsnummer och märke för de bilar som tillhör en anställd."
          : "Visa registreringsnummer och märke för de bilar som inte tillhör någon anställd.",
        solution: `SELECT LicenseNo, Brand FROM Car WHERE EmployeeID IS ${withOwner ? "NOT " : ""}NULL;`,
        hint: "Saknat värde testas med IS NULL, aldrig med = NULL.",
        tables: ["Car"],
      };
    },
  },
  {
    id: "aggregat",
    difficulty: 2,
    build(rng, facts) {
      const table = pick(rng, ["Employee", "Car"]);
      const meta = TABLES[table];
      const column = meta.numeric[0];
      const fn = pick(rng, ["AVG", "MIN", "MAX", "SUM"]);
      const words = {
        AVG: `Vad är genomsnittlig ${label(table, column)} bland ${meta.all}?`,
        MIN: `Vad är lägsta ${label(table, column)} bland ${meta.all}?`,
        MAX: `Vad är högsta ${label(table, column)} bland ${meta.all}?`,
        SUM: `Vad blir summan av ${label(table, column)} för ${meta.all}?`,
      };
      return {
        task: `${words[fn]} Svara med en enda kolumn.`,
        solution: `SELECT ${fn}(${column}) FROM ${table};`,
        hint: "Aggregatfunktioner räknar över hela resultatmängden.",
        tables: [table],
      };
    },
  },
  {
    id: "gruppering",
    difficulty: 2,
    build(rng, facts) {
      const options = [
        { table: "Car", group: "Brand", agg: "COUNT(*)", what: "antalet bilar" },
        { table: "Car", group: "Brand", agg: "AVG(Price)", what: "genomsnittligt pris" },
        { table: "Car", group: "Brand", agg: "SUM(Price)", what: "det totala värdet" },
        { table: "Employee", group: "EmpAddress", agg: "COUNT(*)", what: "antalet anställda" },
        { table: "Employee", group: "EmpAddress", agg: "AVG(EmpSalary)", what: "genomsnittlig lön" },
        { table: "Patient", group: "PatientAddress", agg: "COUNT(*)", what: "antalet patienter" },
      ];
      const choice = pick(rng, options);
      const meta = TABLES[choice.table];
      return {
        task: `Visa ${choice.group === "Brand" ? "varje bilmärke" : `varje ${label(choice.table, choice.group)}`} tillsammans med ${choice.what}.`,
        solution: `SELECT ${choice.group}, ${choice.agg} FROM ${choice.table} GROUP BY ${choice.group};`,
        hint: "GROUP BY delar upp raderna, aggregatet räknar inom varje grupp.",
        tables: [choice.table],
      };
    },
  },
  {
    id: "join",
    difficulty: 2,
    build(rng, facts) {
      const joins = [
        {
          a: "Employee", b: "Unit", on: "e.UnitID = u.UnitID",
          cols: [["e.EmpName", "u.UnitName"], ["e.EmpName", "e.EmpSalary", "u.UnitName"], ["e.EmpNo", "u.UnitNo", "u.UnitAddress"]],
          task: (c) => `Visa ${c} genom att koppla anställda till deras enhet.`,
        },
        {
          a: "Patient", b: "Unit", on: "p.UnitID = u.UnitID",
          cols: [["p.PatientName", "u.UnitName"], ["p.PatientNo", "p.PatientName", "u.UnitName"], ["p.PatientName", "u.UnitAddress"]],
          task: (c) => `Visa ${c} genom att koppla patienter till deras enhet.`,
        },
        {
          a: "Car", b: "Employee", on: "c.EmployeeID = e.EmployeeID",
          cols: [["c.LicenseNo", "e.EmpName"], ["c.Brand", "c.Price", "e.EmpName"], ["c.LicenseNo", "e.EmpName", "e.EmpAddress"]],
          task: (c) => `Visa ${c} för de bilar som har en ägare.`,
        },
      ];
      const j = pick(rng, joins);
      const alias = { Employee: "e", Unit: "u", Patient: "p", Car: "c" };
      const columns = pick(rng, j.cols);
      const readable = joinSwedish(
        columns.map((full) => {
          const [al, col] = full.split(".");
          const table = Object.keys(alias).find((t) => alias[t] === al);
          return `${label(table, col)} (${table})`;
        }),
      );
      return {
        task: j.task(readable),
        solution: `SELECT ${columns.join(", ")} FROM ${j.a} ${alias[j.a]} INNER JOIN ${j.b} ${alias[j.b]} ON ${j.on};`,
        hint: "Joina på den främmande nyckeln och ge tabellerna alias.",
        tables: [j.a, j.b],
      };
    },
  },
  {
    id: "kombinerat-villkor",
    difficulty: 2,
    build(rng, facts) {
      const table = pick(rng, ["Employee", "Car"]);
      const meta = TABLES[table];
      const textColumn = pick(rng, meta.text);
      const pool = valuesOf(facts, table, textColumn);
      const numColumn = meta.numeric[0];
      const threshold = middleValue(rng, numbersOf(facts, table, numColumn));
      if (pool.length < 3 || threshold === null) return null;
      const two = pickMany(rng, pool, 2);
      const columns = pickMany(rng, meta.show, 2);
      return {
        task: `Visa ${labels(table, columns)} för ${meta.those} ${textPredicate(table, textColumn, two[0])} eller ${textPredicate(table, textColumn, two[1])}, och som samtidigt ${numberPhrase(table, numColumn, "mer", threshold)}.`,
        solution: `SELECT ${columns.join(", ")} FROM ${table} WHERE (${textColumn} = '${two[0]}' OR ${textColumn} = '${two[1]}') AND ${numColumn} > ${threshold};`,
        hint: "Sätt parenteser runt OR-delen — annars binder AND hårdare.",
        tables: [table],
      };
    },
  },
  {
    id: "having",
    difficulty: 3,
    build(rng, facts) {
      const options = [
        { table: "Car", group: "Brand", having: "COUNT(*) >= 2", task: "de bilmärken som det finns minst två bilar av, tillsammans med antalet", select: "Brand, COUNT(*)" },
        { table: "Employee", group: "EmpAddress", having: "COUNT(*) >= 2", task: "de adresser där minst två anställda bor, tillsammans med antalet", select: "EmpAddress, COUNT(*)" },
        { table: "Patient", group: "PatientAddress", having: "COUNT(*) >= 2", task: "de adresser där minst två patienter bor, tillsammans med antalet", select: "PatientAddress, COUNT(*)" },
      ];
      const choice = pick(rng, options);
      return {
        task: `Visa ${choice.task}.`,
        solution: `SELECT ${choice.select} FROM ${choice.table} GROUP BY ${choice.group} HAVING ${choice.having};`,
        hint: "HAVING filtrerar grupper efter att aggregatet räknats — WHERE filtrerar rader före.",
        tables: [choice.table],
      };
    },
  },
  {
    id: "left-join-count",
    difficulty: 3,
    build(rng, facts) {
      const options = [
        {
          task: "Visa varje enhets namn tillsammans med antalet anställda på enheten. Enheter utan anställda ska visas med noll.",
          solution: "SELECT u.UnitName, COUNT(e.EmployeeID) FROM Unit u LEFT JOIN Employee e ON u.UnitID = e.UnitID GROUP BY u.UnitName;",
          tables: ["Unit", "Employee"],
        },
        {
          task: "Visa varje enhets namn tillsammans med antalet patienter på enheten. Enheter utan patienter ska visas med noll.",
          solution: "SELECT u.UnitName, COUNT(p.PatientID) FROM Unit u LEFT JOIN Patient p ON u.UnitID = p.UnitID GROUP BY u.UnitName;",
          tables: ["Unit", "Patient"],
        },
        {
          task: "Visa varje anställds namn tillsammans med antalet bilar personen äger. Anställda utan bil ska visas med noll.",
          solution: "SELECT e.EmpName, COUNT(c.CarID) FROM Employee e LEFT JOIN Car c ON e.EmployeeID = c.EmployeeID GROUP BY e.EmployeeID, e.EmpName;",
          tables: ["Employee", "Car"],
        },
      ];
      const choice = pick(rng, options);
      return {
        ...choice,
        hint: "Räkna på den högra tabellens nyckel — COUNT(*) skulle ge 1 för en tom grupp.",
      };
    },
  },
  {
    id: "underfraga",
    difficulty: 3,
    build(rng, facts) {
      const options = [
        {
          task: "Visa namn och lön för de anställda som tjänar mindre än medellönen.",
          solution: "SELECT EmpName, EmpSalary FROM Employee WHERE EmpSalary < (SELECT AVG(EmpSalary) FROM Employee);",
          tables: ["Employee"],
        },
        {
          task: "Visa registreringsnummer och pris för de bilar som kostar mer än genomsnittsbilen.",
          solution: "SELECT LicenseNo, Price FROM Car WHERE Price > (SELECT AVG(Price) FROM Car);",
          tables: ["Car"],
        },
        {
          task: "Visa namn och lön för den eller de anställda som har den högsta lönen.",
          solution: "SELECT EmpName, EmpSalary FROM Employee WHERE EmpSalary = (SELECT MAX(EmpSalary) FROM Employee);",
          tables: ["Employee"],
        },
      ];
      const choice = pick(rng, options);
      return {
        ...choice,
        hint: "Ett aggregat får inte stå direkt i WHERE — lägg det i en underfråga.",
      };
    },
  },
  {
    id: "exists",
    difficulty: 3,
    build(rng, facts) {
      const options = [
        {
          task: "Visa namnen på de anställda som inte undersöker någon patient.",
          solution: "SELECT EmpName FROM Employee e WHERE NOT EXISTS (SELECT 1 FROM Examines x WHERE x.EmployeeID = e.EmployeeID);",
          tables: ["Employee", "Examines"],
        },
        {
          task: "Visa namnen på de sjukdomar som ingen patient har lidit av tidigare.",
          solution: "SELECT IllnessName FROM Illness i WHERE NOT EXISTS (SELECT 1 FROM HasSuffered h WHERE h.IllnessID = i.IllnessID);",
          tables: ["Illness", "HasSuffered"],
        },
        {
          task: "Visa namnen på de patienter som har lidit av minst en sjukdom tidigare. Använd EXISTS.",
          solution: "SELECT PatientName FROM Patient p WHERE EXISTS (SELECT 1 FROM HasSuffered h WHERE h.PatientID = p.PatientID);",
          tables: ["Patient", "HasSuffered"],
        },
        {
          task: "Visa namnen på de enheter som har minst en patient. Använd IN.",
          solution: "SELECT UnitName FROM Unit WHERE UnitID IN (SELECT UnitID FROM Patient);",
          tables: ["Unit", "Patient"],
        },
      ];
      const choice = pick(rng, options);
      return {
        ...choice,
        hint: "En korrelerad underfråga refererar till den yttre raden och körs en gång per rad.",
      };
    },
  },
  {
    id: "kedjad-join",
    difficulty: 3,
    build(rng, facts) {
      const options = [
        {
          task: "Visa vilka anställda som undersöker vilka patienter: den anställdes namn och patientens namn.",
          solution: "SELECT e.EmpName, p.PatientName FROM Employee e INNER JOIN Examines x ON e.EmployeeID = x.EmployeeID INNER JOIN Patient p ON x.PatientID = p.PatientID;",
          tables: ["Employee", "Examines", "Patient"],
        },
        {
          task: "Visa varje patients namn tillsammans med namnet på de sjukdomar patienten lider av just nu.",
          solution: "SELECT p.PatientName, i.IllnessName FROM Patient p INNER JOIN Suffers s ON p.PatientID = s.PatientID INNER JOIN Illness i ON s.IllnessID = i.IllnessID;",
          tables: ["Patient", "Suffers", "Illness"],
        },
        {
          task: "Visa varje patients namn tillsammans med namnet på de sjukdomar patienten har lidit av tidigare.",
          solution: "SELECT p.PatientName, i.IllnessName FROM Patient p INNER JOIN HasSuffered h ON p.PatientID = h.PatientID INNER JOIN Illness i ON h.IllnessID = i.IllnessID;",
          tables: ["Patient", "HasSuffered", "Illness"],
        },
        {
          task: "Visa namnen på de anställda som undersöker minst en patient som ligger på enheten Trauma.",
          solution: "SELECT DISTINCT e.EmpName FROM Employee e INNER JOIN Examines x ON e.EmployeeID = x.EmployeeID INNER JOIN Patient p ON x.PatientID = p.PatientID INNER JOIN Unit u ON p.UnitID = u.UnitID WHERE u.UnitName = 'Trauma';",
          tables: ["Employee", "Examines", "Patient", "Unit"],
        },
      ];
      const choice = pick(rng, options);
      return {
        ...choice,
        hint: "Kedja joins via mellantabellen, en JOIN i taget.",
      };
    },
  },
  {
    id: "self-join",
    difficulty: 3,
    build(rng, facts) {
      const options = [
        {
          task: "Visa alla par av patienter som bor på samma adress. Varje par ska förekomma en gång, och ingen ska paras med sig själv.",
          solution: "SELECT p1.PatientName, p2.PatientName FROM Patient p1 INNER JOIN Patient p2 ON p1.PatientAddress = p2.PatientAddress AND p1.PatientID < p2.PatientID;",
          tables: ["Patient"],
        },
        {
          task: "Visa alla par av anställda som bor på samma adress. Varje par ska förekomma en gång, och ingen ska paras med sig själv.",
          solution: "SELECT e1.EmpName, e2.EmpName FROM Employee e1 INNER JOIN Employee e2 ON e1.EmpAddress = e2.EmpAddress AND e1.EmployeeID < e2.EmployeeID;",
          tables: ["Employee"],
        },
      ];
      const choice = pick(rng, options);
      return {
        ...choice,
        hint: "Samma tabell två gånger med olika alias. < i stället för <> ger varje par en gång.",
      };
    },
  },
  {
    id: "korrelerad",
    difficulty: 3,
    build(rng, facts) {
      const options = [
        {
          task: "Visa registreringsnummer, märke och pris för de bilar som kostar mer än genomsnittet för sitt eget märke.",
          solution: "SELECT c.LicenseNo, c.Brand, c.Price FROM Car c WHERE c.Price > (SELECT AVG(c2.Price) FROM Car c2 WHERE c2.Brand = c.Brand);",
          tables: ["Car"],
        },
        {
          task: "Visa namn och lön för de anställda som tjänar mindre än medellönen på sin egen enhet.",
          solution: "SELECT e.EmpName, e.EmpSalary FROM Employee e WHERE e.EmpSalary < (SELECT AVG(e2.EmpSalary) FROM Employee e2 WHERE e2.UnitID = e.UnitID);",
          tables: ["Employee"],
        },
      ];
      const choice = pick(rng, options);
      return {
        ...choice,
        hint: "Underfrågan måste referera till den yttre radens kolumn, annars blir snittet detsamma för alla.",
      };
    },
  },
];

export const DIFFICULTIES = [
  { id: 0, label: "Blandat" },
  { id: 1, label: "Grund" },
  { id: 2, label: "Standard" },
  { id: 3, label: "Klurig" },
];

// Bygger EN kandidat ur ett frö. Validering sker i sqlPractice.js, som har
// tillgång till databasen.
export function buildCandidate(seed, facts, difficulty = 0) {
  const rng = makeRng(seed);
  const pool = difficulty
    ? FAMILIES.filter((family) => family.difficulty === difficulty)
    : FAMILIES;
  if (pool.length === 0) return null;
  const family = pick(rng, pool);
  const built = family.build(rng, facts);
  if (!built) return null;
  return {
    id: `rnd-${seed}`,
    seed,
    family: family.id,
    difficulty: family.difficulty,
    ordered: built.ordered === true,
    ...built,
  };
}

export const FAMILY_IDS = FAMILIES.map((family) => family.id);
