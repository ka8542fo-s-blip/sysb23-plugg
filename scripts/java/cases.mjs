// Testfall för scripts/java/verify-solutions.mjs: ett block per uppgift i
// src/data/databaser/javaTasks.js, med uppgiftens id som nyckel. Harnessen
// kör uppgiftens `solution` mot en riktig databas (H2 i MSSQLServer-läge) och
// jämför med det som står här. En ny uppgift kräver bara ett nytt block.
//
// En uppgift:
//   seed:     { Tabell: [rad, …] } — läggs in före varje fall. Tabellerna skapas
//             på nytt ur uppgiftens CREATE TABLE inför varje fall, så fallen
//             påverkar inte varandra. En rad är { Kolumn: värde } (sträng, tal,
//             null). Utelämnas IDENTITY-kolumnen numreras raderna 1, 2, … i
//             den ordning de står; anges den används värdet, och räknaren
//             fortsätter efter det högsta (som i SQL Server).
//   adaptDdl: [{ find, replace, why }] — bara om H2 inte tar tentans DDL som
//             den står; varje anpassning skrivs ut i rapporten.
//   cases:    [fall, …]
//
// Ett fall:
//   name:   vad fallet visar (står i rapporten)
//   args:   argumenten i parametrarnas ordning: strängar, tal, true/false,
//           null. En objektparameter (t.ex. save(Employee employee)) skrivs
//           { instansvariabel: värde }; harnessen sätter variablerna direkt.
//   seed:   ersätter uppgiftens seed i just det här fallet
//   fault:  "drop-table" — tabellerna tas bort före anropet (ett riktigt
//                          SQL-fel, redan i prepareStatement)
//           "execute"    — executeQuery/executeUpdate kastar SQLException
//           "next"       — ResultSet.next() kastar SQLException
//   expect:
//     returns: väntat returvärde. En lista skrivs som array (ordningen fri om
//              inte ordered: true), ett objekt som { instansvariabel: värde }
//              med SAMTLIGA instansvariabler, null som null. Utelämnas för void.
//     ordered: true — listans ordning ska stämma (ORDER BY)
//     sortedBy: { field, dir: "ASC" | "DESC" } — i stället för ordered när
//              lika värden får komma i valfri ordning sinsemellan: listan
//              ska innehålla exakt returns (ordningen fri) och vara sorterad
//              på instansvariabeln field
//     columns: ["Kolumn", …] — varje ResultSet ska ha exakt de kolumnerna
//              (ordning och skiftläge fria): frågan hämtar bara dem
//     rows:    n — lösningen läser n rader ur sina ResultSet (next() som
//              ger true), t.ex. 1 när antalet ska räknas i databasen
//     after:   { Tabell: [rad, …] } — hela tabellen efter anropet; raderna
//              jämförs på de kolumner som anges, radordningen är fri.
//              Tabeller som inte nämns ska vara oförändrade, och utan after
//              ska allt vara oförändrat.
//     throws:  "SQLException" — anropet ska släppa igenom ett SQLException.
//
// Varje fall kontrollerar dessutom att lösningen bara använder
// PreparedStatement och att varje Connection, PreparedStatement och
// ResultSet som öppnades också stängdes — även när anropet kastar.

// Tabellen utan raderna med de givna nycklarna (kolumnen `key`).
const without = (rows, key, ...values) => rows.filter((row) => !values.includes(row[key]));

// ---------------------------------------------------------------- java-ex-1

const employees = [
  { EmployeeNo: "E1", FirstName: "Anna", LastName: "Berg", Department: "IT", Salary: 25000 },
  { EmployeeNo: "E2", FirstName: "Bo", LastName: "Ek", Department: "IT", Salary: 30000 },
  { EmployeeNo: "E3", FirstName: "Cecilia", LastName: "Lind", Department: "IT", Salary: 29999.99 },
  { EmployeeNo: "E4", FirstName: "David", LastName: "Holm", Department: "IT", Salary: 30000.01 },
  { EmployeeNo: "E5", FirstName: "Eva", LastName: "Sjöberg", Department: "Ekonomi", Salary: 20000 },
  { EmployeeNo: "E6", FirstName: "Filip", LastName: "Nord", Department: "Ekonomi", Salary: 30000 },
  { EmployeeNo: "E7", FirstName: null, LastName: null, Department: "Lager", Salary: 18000 },
];

// ---------------------------------------------------------------- java-ex-2

// Egna ProductID (inte 1, 2, 3 …) så att id = ProductID syns i svaret.
const products = [
  { ProductID: 101, ProductNo: "P-101", Name: "Hammare", Category: "Verktyg", Price: 189 },
  { ProductID: 102, ProductNo: "P-102", Name: "Skruvmejsel", Category: "Verktyg", Price: 59.9 },
  { ProductID: 205, ProductNo: "P-205", Name: "Pussel", Category: "Leksaker", Price: 129.5 },
  { ProductID: 310, ProductNo: "P-310", Name: "Tumstock", Category: "Verktyg", Price: 0.5 },
  { ProductID: 412, ProductNo: "P-412", Name: "Kaffebryggare", Category: "Kök", Price: 499 },
];

// Product-objektet som raden ska bli: samtliga instansvariabler.
const product = (row) => ({
  id: row.ProductID,
  productNo: row.ProductNo,
  name: row.Name,
  category: row.Category,
  price: row.Price,
});
const productsIn = (category) => products.filter((row) => row.Category === category).map(product);

// ---------------------------------------------------------------- java-ov-1

// E10 börjar som E1: att ta bort "E1" får inte ta med "E10".
const employeesWithE10 = [
  ...employees,
  { EmployeeNo: "E10", FirstName: "Gustav", LastName: "Ek", Department: "IT", Salary: 26000 },
];

// ---------------------------------------------------------------- java-ov-2

// Tabellen efter att Salary har ökats med amount på avdelningen department.
const raised = (department, amount) =>
  employees.map((row) => (row.Department === department ? { ...row, Salary: row.Salary + amount } : row));

// ---------------------------------------------------------------- java-ov-3

// Raden som saveProduct ska lägga till: ProductID kommer från IDENTITY.
const productRow = (productId, p) => ({
  ProductID: productId,
  ProductNo: p.productNo,
  Name: p.name,
  Category: p.category,
  Price: p.price,
});
const saw = { id: 5000, productNo: "P-900", name: "Såg", category: "Verktyg", price: 249.5 };
const quoted = { id: 0, productNo: "P-901", name: "x'); DROP TABLE Product; --", category: "Kök 'special'", price: 0.05 };

// ---------------------------------------------------------- java-ov-5, java-ov-8

// BookID i en ordning som varken är stigande eller fallande PublishedYear för
// Astrid Berg, så att ett svar utan ORDER BY (eller med ASC) ger fel ordning.
// Astrid Bergström börjar som Astrid Berg; Bo Ek är en annan författare.
const books = [
  { BookID: 11, Isbn: "9789100000011", Title: "Första", Author: "Astrid Berg", PublishedYear: 2001, Pages: 210 },
  { BookID: 12, Isbn: "9789100000012", Title: "Andra", Author: "Astrid Berg", PublishedYear: 2010, Pages: 320 },
  { BookID: 13, Isbn: "9789100000013", Title: "Tredje", Author: "Astrid Berg", PublishedYear: 2020, Pages: 150 },
  { BookID: 14, Isbn: "9789100000014", Title: "Fjärde", Author: "Astrid Berg", PublishedYear: 2015, Pages: 400 },
  { BookID: 15, Isbn: "9789100000015", Title: "Femte", Author: "Astrid Berg", PublishedYear: 2009, Pages: 275 },
  { BookID: 20, Isbn: "9789100000020", Title: "Annan", Author: "Bo Ek", PublishedYear: 2018, Pages: 99 },
  { BookID: 21, Isbn: "9789100000021", Title: "Lik", Author: "Astrid Bergström", PublishedYear: 2019, Pages: 188 },
];
// Två böcker av Astrid Berg från samma år (2015).
const booksWithTie = [
  ...books,
  { BookID: 16, Isbn: "9789100000016", Title: "Sjätte", Author: "Astrid Berg", PublishedYear: 2015, Pages: 260 },
];

// Book-objektet som raden ska bli: samtliga instansvariabler.
const book = (row) => ({
  id: row.BookID,
  isbn: row.Isbn,
  title: row.Title,
  author: row.Author,
  publishedYear: row.PublishedYear,
  pages: row.Pages,
});
const booksById = (rows, ...ids) => ids.map((id) => book(rows.find((row) => row.BookID === id)));

// ---------------------------------------------------------------- java-ov-7

// Employee-objektet: bara de fyra kolumner som klassen har instansvariabler för.
const EMPLOYEE_COLUMNS = ["EmployeeNo", "FirstName", "LastName", "Salary"];
const employee = (row) => ({
  employeeNo: row.EmployeeNo,
  firstName: row.FirstName,
  lastName: row.LastName,
  salary: row.Salary,
});
const employeesIn = (department) => employees.filter((row) => row.Department === department).map(employee);

export const cases = {
  "java-ex-1": {
    seed: { Employee: employees },
    cases: [
      {
        name: "under gränsen i avdelningen tas bort, lika med gränsen blir kvar",
        args: ["IT", 30000],
        expect: { returns: 2, after: { Employee: without(employees, "EmployeeNo", "E1", "E3") } },
      },
      {
        name: "lön lika med gränsen tas inte bort (< och inte <=)",
        args: ["IT", 25000],
        expect: { returns: 0 },
      },
      {
        name: "gräns med decimaler: 30000.00 tas bort, 30000.01 blir kvar",
        args: ["IT", 30000.01],
        expect: { returns: 3, after: { Employee: without(employees, "EmployeeNo", "E1", "E2", "E3") } },
      },
      {
        name: "andra avdelningar rörs inte",
        args: ["Ekonomi", 30000],
        expect: { returns: 1, after: { Employee: without(employees, "EmployeeNo", "E5") } },
      },
      {
        name: "inga rader uppfyller villkoren: 0",
        args: ["Marknad", 100000],
        expect: { returns: 0 },
      },
      {
        name: "SQL-injektion i department tar inte bort något",
        args: ["IT' OR '1'='1", 1000000],
        expect: { returns: 0 },
      },
      {
        name: "SQLException i executeUpdate går vidare, allt stängs",
        args: ["IT", 30000],
        fault: "execute",
        expect: { throws: "SQLException" },
      },
      {
        name: "tabellen saknas: SQLException går vidare, Connection stängs",
        args: ["IT", 30000],
        fault: "drop-table",
        expect: { throws: "SQLException" },
      },
    ],
  },

  "java-ex-2": {
    seed: { Product: products },
    cases: [
      {
        name: "alla produkter i kategorin, alla instansvariabler rätt (id = ProductID)",
        args: ["Verktyg"],
        expect: { returns: productsIn("Verktyg") },
      },
      {
        name: "en träff, andra kategorier kommer inte med",
        args: ["Leksaker"],
        expect: { returns: productsIn("Leksaker") },
      },
      {
        name: "inga träffar ger en tom lista, inte null",
        args: ["Trädgård"],
        expect: { returns: [] },
      },
      {
        name: "tom tabell ger en tom lista",
        args: ["Verktyg"],
        seed: { Product: [] },
        expect: { returns: [] },
      },
      {
        name: "SQL-injektion i category ger en tom lista",
        args: ["x' OR '1'='1"],
        expect: { returns: [] },
      },
      {
        name: "SQLException i ResultSet.next() går vidare, allt stängs",
        args: ["Verktyg"],
        fault: "next",
        expect: { throws: "SQLException" },
      },
      {
        name: "SQLException i executeQuery går vidare, allt stängs",
        args: ["Verktyg"],
        fault: "execute",
        expect: { throws: "SQLException" },
      },
      {
        name: "tabellen saknas: SQLException går vidare, Connection stängs",
        args: ["Verktyg"],
        fault: "drop-table",
        expect: { throws: "SQLException" },
      },
    ],
  },

  // ── Egna övningar ──────────────────────────────────────────────────────

  "java-ov-1": {
    seed: { Employee: employeesWithE10 },
    cases: [
      {
        name: "raden med anställningsnumret tas bort, övriga på samma avdelning blir kvar",
        args: ["E3"],
        expect: { returns: 1, after: { Employee: without(employeesWithE10, "EmployeeNo", "E3") } },
      },
      {
        name: "E1 tar bort E1 men inte E10 (hela värdet ska vara lika)",
        args: ["E1"],
        expect: { returns: 1, after: { Employee: without(employeesWithE10, "EmployeeNo", "E1") } },
      },
      {
        name: "inget anställningsnummer stämmer: 0, inget tas bort",
        args: ["E99"],
        expect: { returns: 0 },
      },
      {
        name: "tom tabell: 0",
        args: ["E1"],
        seed: { Employee: [] },
        expect: { returns: 0 },
      },
      {
        name: "SQL-injektion i employeeNo tar inte bort något",
        args: ["E1' OR '1'='1"],
        expect: { returns: 0 },
      },
      {
        name: "SQLException i executeUpdate går vidare, allt stängs",
        args: ["E3"],
        fault: "execute",
        expect: { throws: "SQLException" },
      },
      {
        name: "tabellen saknas: SQLException går vidare, Connection stängs",
        args: ["E3"],
        fault: "drop-table",
        expect: { throws: "SQLException" },
      },
    ],
  },

  "java-ov-2": {
    seed: { Employee: employees },
    cases: [
      {
        name: "IT: alla fyra får Salary + amount, andra avdelningar oförändrade",
        args: ["IT", 1000],
        expect: { returns: 4, after: { Employee: raised("IT", 1000) } },
      },
      {
        name: "belopp med decimaler läggs till exakt",
        args: ["Ekonomi", 250.5],
        expect: { returns: 2, after: { Employee: raised("Ekonomi", 250.5) } },
      },
      {
        name: "en rad på avdelningen (null i namnen): 1, namnen orörda",
        args: ["Lager", 2000],
        expect: { returns: 1, after: { Employee: raised("Lager", 2000) } },
      },
      {
        name: "ingen rad på avdelningen: 0, inget ändras",
        args: ["Marknad", 500],
        expect: { returns: 0 },
      },
      {
        name: "SQL-injektion i department ändrar inget",
        args: ["IT' OR '1'='1", 500],
        expect: { returns: 0 },
      },
      {
        name: "SQLException i executeUpdate går vidare, allt stängs",
        args: ["IT", 1000],
        fault: "execute",
        expect: { throws: "SQLException" },
      },
      {
        name: "tabellen saknas: SQLException går vidare, Connection stängs",
        args: ["IT", 1000],
        fault: "drop-table",
        expect: { throws: "SQLException" },
      },
    ],
  },

  "java-ov-3": {
    seed: { Product: products },
    cases: [
      {
        name: "ny rad med värdena ur objektet; ProductID 413 från databasen, id (5000) används inte",
        args: [saw],
        expect: { after: { Product: [...products, productRow(413, saw)] } },
      },
      {
        name: "tom tabell: den nya raden får ProductID 1",
        args: [{ ...saw, id: 0 }],
        seed: { Product: [] },
        expect: { after: { Product: [productRow(1, saw)] } },
      },
      {
        name: "apostrofer och SQL i värdena lagras som text; pris med två decimaler",
        args: [quoted],
        expect: { after: { Product: [...products, productRow(413, quoted)] } },
      },
      {
        name: "ProductNo finns redan (utanför uppgiftens antagande): databasens SQLException går vidare, allt stängs",
        args: [{ id: 0, productNo: "P-101", name: "Kopia", category: "Verktyg", price: 1 }],
        expect: { throws: "SQLException" },
      },
      {
        name: "SQLException i executeUpdate går vidare, allt stängs",
        args: [saw],
        fault: "execute",
        expect: { throws: "SQLException" },
      },
      {
        name: "tabellen saknas: SQLException går vidare, Connection stängs",
        args: [saw],
        fault: "drop-table",
        expect: { throws: "SQLException" },
      },
    ],
  },

  "java-ov-4": {
    seed: { Product: products },
    cases: [
      {
        name: "tre rader i Verktyg, räknade i databasen (en rad läses)",
        args: ["Verktyg"],
        expect: { returns: 3, rows: 1 },
      },
      {
        name: "en rad i Leksaker; andra kategorier räknas inte",
        args: ["Leksaker"],
        expect: { returns: 1, rows: 1 },
      },
      {
        name: "ingen rad i kategorin: 0",
        args: ["Trädgård"],
        expect: { returns: 0 },
      },
      {
        name: "tom tabell: 0",
        args: ["Verktyg"],
        seed: { Product: [] },
        expect: { returns: 0 },
      },
      {
        name: "SQL-injektion i category: 0",
        args: ["x' OR '1'='1"],
        expect: { returns: 0 },
      },
      {
        name: "SQLException i ResultSet.next() går vidare, allt stängs",
        args: ["Verktyg"],
        fault: "next",
        expect: { throws: "SQLException" },
      },
      {
        name: "SQLException i executeQuery går vidare, allt stängs",
        args: ["Verktyg"],
        fault: "execute",
        expect: { throws: "SQLException" },
      },
      {
        name: "tabellen saknas: SQLException går vidare, Connection stängs",
        args: ["Verktyg"],
        fault: "drop-table",
        expect: { throws: "SQLException" },
      },
    ],
  },

  "java-ov-5": {
    seed: { Book: books },
    cases: [
      {
        name: "ISBN som finns: true",
        args: ["9789100000013"],
        expect: { returns: true },
      },
      {
        name: "ISBN som inte finns: false",
        args: ["9789100000099"],
        expect: { returns: false },
      },
      {
        name: "början av ett ISBN som finns räcker inte: false",
        args: ["978910000001"],
        expect: { returns: false },
      },
      {
        name: "tom tabell: false",
        args: ["9789100000013"],
        seed: { Book: [] },
        expect: { returns: false },
      },
      {
        name: "SQL-injektion i isbn: false",
        args: ["x' OR '1'='1"],
        expect: { returns: false },
      },
      {
        name: "SQLException i ResultSet.next() går vidare, allt stängs",
        args: ["9789100000013"],
        fault: "next",
        expect: { throws: "SQLException" },
      },
      {
        name: "SQLException i executeQuery går vidare, allt stängs",
        args: ["9789100000013"],
        fault: "execute",
        expect: { throws: "SQLException" },
      },
      {
        name: "tabellen saknas: SQLException går vidare, Connection stängs",
        args: ["9789100000013"],
        fault: "drop-table",
        expect: { throws: "SQLException" },
      },
    ],
  },

  "java-ov-6": {
    seed: { Product: products },
    cases: [
      {
        name: "produkten finns: samtliga instansvariabler rätt (id = ProductID)",
        args: ["P-205"],
        expect: { returns: product(products[2]) },
      },
      {
        name: "en annan produkt, pris med decimaler",
        args: ["P-310"],
        expect: { returns: product(products[3]) },
      },
      {
        name: "ingen produkt med numret: null",
        args: ["P-999"],
        expect: { returns: null },
      },
      {
        name: "början av ett produktnummer räcker inte: null",
        args: ["P-1"],
        expect: { returns: null },
      },
      {
        name: "tom tabell: null",
        args: ["P-205"],
        seed: { Product: [] },
        expect: { returns: null },
      },
      {
        name: "SQL-injektion i productNo: null",
        args: ["x' OR '1'='1"],
        expect: { returns: null },
      },
      {
        name: "SQLException i ResultSet.next() går vidare, allt stängs",
        args: ["P-205"],
        fault: "next",
        expect: { throws: "SQLException" },
      },
      {
        name: "SQLException i executeQuery går vidare, allt stängs",
        args: ["P-205"],
        fault: "execute",
        expect: { throws: "SQLException" },
      },
      {
        name: "tabellen saknas: SQLException går vidare, Connection stängs",
        args: ["P-205"],
        fault: "drop-table",
        expect: { throws: "SQLException" },
      },
    ],
  },

  "java-ov-7": {
    seed: { Employee: employees },
    cases: [
      {
        name: "IT: fyra anställda med de fyra instansvariablerna; frågan hämtar bara de fyra kolumnerna",
        args: ["IT"],
        expect: { returns: employeesIn("IT"), columns: EMPLOYEE_COLUMNS },
      },
      {
        name: "Lager: null i FirstName och LastName följer med",
        args: ["Lager"],
        expect: { returns: employeesIn("Lager"), columns: EMPLOYEE_COLUMNS },
      },
      {
        name: "ingen anställd på avdelningen: tom lista, inte null",
        args: ["Marknad"],
        expect: { returns: [], columns: EMPLOYEE_COLUMNS },
      },
      {
        name: "tom tabell: tom lista",
        args: ["IT"],
        seed: { Employee: [] },
        expect: { returns: [] },
      },
      {
        name: "SQL-injektion i department: tom lista",
        args: ["x' OR '1'='1"],
        expect: { returns: [] },
      },
      {
        name: "SQLException i ResultSet.next() går vidare, allt stängs",
        args: ["IT"],
        fault: "next",
        expect: { throws: "SQLException" },
      },
      {
        name: "SQLException i executeQuery går vidare, allt stängs",
        args: ["IT"],
        fault: "execute",
        expect: { throws: "SQLException" },
      },
      {
        name: "tabellen saknas: SQLException går vidare, Connection stängs",
        args: ["IT"],
        fault: "drop-table",
        expect: { throws: "SQLException" },
      },
    ],
  },

  "java-ov-8": {
    seed: { Book: books },
    cases: [
      {
        name: "från 2010: lika med fromYear tas med, 2009 inte, nyast först",
        args: ["Astrid Berg", 2010],
        expect: { ordered: true, returns: booksById(books, 13, 14, 12) },
      },
      {
        name: "fromYear lika med det senaste året: bara den boken",
        args: ["Astrid Berg", 2020],
        expect: { ordered: true, returns: booksById(books, 13) },
      },
      {
        name: "fromYear före alla böcker: författarens fem, nyast först; Astrid Bergström och Bo Ek inte med",
        args: ["Astrid Berg", 1990],
        expect: { ordered: true, returns: booksById(books, 13, 14, 12, 15, 11) },
      },
      {
        name: "två böcker från samma år: valfri ordning sinsemellan, annars fallande",
        args: ["Astrid Berg", 2010],
        seed: { Book: booksWithTie },
        expect: { sortedBy: { field: "publishedYear", dir: "DESC" }, returns: booksById(booksWithTie, 13, 14, 16, 12) },
      },
      {
        name: "en annan författare: bara dennes bok",
        args: ["Bo Ek", 2000],
        expect: { ordered: true, returns: booksById(books, 20) },
      },
      {
        name: "fromYear efter alla böcker: tom lista, inte null",
        args: ["Astrid Berg", 2021],
        expect: { returns: [] },
      },
      {
        name: "okänd författare: tom lista",
        args: ["Okänd", 1900],
        expect: { returns: [] },
      },
      {
        name: "SQL-injektion i author: tom lista",
        args: ["x' OR '1'='1", 0],
        expect: { returns: [] },
      },
      {
        name: "SQLException i ResultSet.next() går vidare, allt stängs",
        args: ["Astrid Berg", 2010],
        fault: "next",
        expect: { throws: "SQLException" },
      },
      {
        name: "SQLException i executeQuery går vidare, allt stängs",
        args: ["Astrid Berg", 2010],
        fault: "execute",
        expect: { throws: "SQLException" },
      },
      {
        name: "tabellen saknas: SQLException går vidare, Connection stängs",
        args: ["Astrid Berg", 2010],
        fault: "drop-table",
        expect: { throws: "SQLException" },
      },
    ],
  },
};
