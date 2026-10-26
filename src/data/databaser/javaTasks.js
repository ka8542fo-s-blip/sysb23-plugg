// Fliken Java i Databaser: tentans Java/JDBC-uppgift. Man skriver EN hel
// DAO-instansmetod för hand (Björns exempeltenta, 2026-jdbc-example-handout.pdf).
// "exempel" är exempeltentans två uppgifter ordagrant; "ovning" är egna
// uppgifter i samma form och ton.
//
// En uppgift:
//   id, set ("exempel" | "ovning"), number, title, source
//   blocks:   uppgiftstexten i ordning, som på tentan — { p: "…" } är ett
//             stycke (`kod` och **fetstil** som i kompendiet), { code, lang }
//             ett kodblock ("sql" | "java"). Signaturen står som sitt eget
//             kodblock, och kravstyckena följer efter den. Tabellens
//             CREATE TABLE står som { code, lang: "sql" }; rättaren läser
//             tabellens kolumner ur det blocket.
//   solution: lösningsförslaget, med tentans indentering (fyra blanksteg).
//   check:    vad rättaren (lib/javaCheck.js) kräver, som data, så att en ny
//             uppgift inte kräver ny kod:
//     method  { name, returns, params: [[typ, namn], …] }
//             returns och typerna skrivs som i Java ("int", "ArrayList<Product>").
//     sql     { kind: "SELECT" | "INSERT" | "UPDATE" | "DELETE", table,
//               where:   [{ column, op, param }] — op "=", "<", ">", "<=", ">=";
//                        villkorens ordning är fri; param = parameternamnet
//                        i method.params
//               select:  ["Kolumn", …] — SELECT: de kolumnerna, ordning fri; fler
//                        kolumner ger en kommentar (med selectOnly ett fel)
//               selectOnly: true — uppgiften kräver att frågan bara hämtar
//                        kolumnerna i select; SELECT * och fler kolumner
//                        underkänns.
//               count:   true — SELECT COUNT(*) (med eller utan alias)
//               orderBy: [{ column, dir: "ASC" | "DESC" }]
//               values:  [{ column, param }] — INSERT: kolumnlistan och dess ?
//               set:     [{ column, expr, param }] — UPDATE: expr med ? för
//                        parametern, t.ex. "Salary + ?" }
//             param kan också vara ett anrop på en objektparameter,
//             "employee.getEmployeeNo()" (INSERT av ett objekt).
//     binds   { [param]: "setString" | "setInt" | "setDouble" } — vilken
//             set-metod varje värde binds med; numret följer frågetecknens
//             ordning i svarets egen SQL.
//     result  { kind, rows, model, fields, column, getter }
//               kind: "affected" — returnera executeUpdate()
//                     "void"     — inget returvärde
//                     "list"     — lista som skapas före loopen och returneras
//                     "single"   — ett objekt eller null (if (rs.next()))
//                     "scalar"   — ett värde ur första raden (COUNT(*) → int)
//                     "exists"   — boolean: finns minst en rad
//               rows:   "many" (while) | "one" (if)
//               model:  klassen som skapas per rad, t.ex. "Product"
//               fields: [{ column, getter }] — get-metoden per kolumn, i
//                       konstruktorns ordning
//               column/getter: kolumnen (eller aliaset) och get-metoden för "scalar"
//     Tillägg för de egna övningarna: i en "exists"-uppgift saknas sql.select
//     och sql.count — kolumnlistan är fri (en kolumn, 1 eller COUNT(*)). I en
//     "scalar"-uppgift med sql.count är column lösningens alias; svarets eget
//     alias och getInt(1) är lika rätta.

const EMPLOYEE_DDL = `CREATE TABLE Employee (
    EmployeeID INT            IDENTITY(1, 1) NOT NULL,
    EmployeeNo VARCHAR(10)    NOT NULL,
    FirstName  VARCHAR(50),
    LastName   VARCHAR(50),
    Department VARCHAR(50)    NOT NULL,
    Salary     DECIMAL(10, 2) NOT NULL,

    CONSTRAINT PK_Employee_EmployeeID
        PRIMARY KEY (EmployeeID),
    CONSTRAINT UQ_Employee_EmployeeNo
        UNIQUE (EmployeeNo)
);`;

const PRODUCT_DDL = `CREATE TABLE Product (
    ProductID INT            IDENTITY(1, 1) NOT NULL,
    ProductNo VARCHAR(10)    NOT NULL,
    Name      VARCHAR(100)   NOT NULL,
    Category  VARCHAR(50)    NOT NULL,
    Price     DECIMAL(10, 2) NOT NULL,

    CONSTRAINT PK_Product_ProductID
        PRIMARY KEY (ProductID),
    CONSTRAINT UQ_Product_ProductNo
        UNIQUE (ProductNo)
);`;

// ── Till de egna övningarna ────────────────────────────────────────────

const BOOK_DDL = `CREATE TABLE Book (
    BookID        INT          IDENTITY(1, 1) NOT NULL,
    Isbn          VARCHAR(13)  NOT NULL,
    Title         VARCHAR(100) NOT NULL,
    Author        VARCHAR(100) NOT NULL,
    PublishedYear INT          NOT NULL,
    Pages         INT          NOT NULL,

    CONSTRAINT PK_Book_BookID
        PRIMARY KEY (BookID),
    CONSTRAINT UQ_Book_Isbn
        UNIQUE (Isbn)
);`;

// Exempeltentans Product-klass, ordagrant (som i uppgift 2).
const PRODUCT_CLASS = `public class Product {
    private int id;
    private String productNo;
    private String name;
    private String category;
    private double price;

    public Product() {
    }

    public Product(int id, String productNo, String name,
                   String category, double price) {
        this.id = id;
        this.productNo = productNo;
        this.name = name;
        this.category = category;
        this.price = price;
    }

    // Du får anta att get- och set-metoder finns för samtliga instansvariabler.
}`;

const BOOK_CLASS = `public class Book {
    private int id;
    private String isbn;
    private String title;
    private String author;
    private int publishedYear;
    private int pages;

    public Book() {
    }

    public Book(int id, String isbn, String title, String author,
                int publishedYear, int pages) {
        this.id = id;
        this.isbn = isbn;
        this.title = title;
        this.author = author;
        this.publishedYear = publishedYear;
        this.pages = pages;
    }

    // Du får anta att get- och set-metoder finns för samtliga instansvariabler.
}`;

// En klass utan instansvariabler för EmployeeID och Department (övning 7).
const EMPLOYEE_CLASS = `public class Employee {
    private String employeeNo;
    private String firstName;
    private String lastName;
    private double salary;

    public Employee() {
    }

    public Employee(String employeeNo, String firstName,
                    String lastName, double salary) {
        this.employeeNo = employeeNo;
        this.firstName = firstName;
        this.lastName = lastName;
        this.salary = salary;
    }

    // Du får anta att get- och set-metoder finns för samtliga instansvariabler.
}`;

// Den givna DAO-klassen i exempeltentans form, med de importer metoden behöver.
function daoClass(name, imports) {
  return `${imports.map((i) => `import ${i};`).join("\n")}

public class ${name} {
    private ConnectionHandler connectionHandler;

    public ${name}() {
        this.connectionHandler = new ConnectionHandler();
    }
}`;
}

const SQL_IMPORTS = ["java.sql.Connection", "java.sql.PreparedStatement", "java.sql.SQLException"];
const QUERY_IMPORTS = ["java.sql.Connection", "java.sql.PreparedStatement", "java.sql.ResultSet", "java.sql.SQLException"];
const LIST_IMPORTS = [...QUERY_IMPORTS, "java.util.ArrayList"];

// Styckena som avslutar varje uppgift, med exempeltentans ordalydelse.
// assume = stycket "Du får anta att …"; model = den givna modellklassen, om någon.
function examTail(dao, assume, model) {
  return [
    { p: "Din implementation ska inte vara sårbar för SQL-injektion." },
    { p: "Du får anta att instansvariabeln `connectionHandler` redan är initierad. Anropet `connectionHandler.getConnection()` returnerar ett objekt av typen `java.sql.Connection` som representerar en giltig anslutning till databasen. Samtliga resurser som öppnas i metoden ska stängas när de inte längre behövs, även om ett Exception uppstår." },
    { p: assume },
    {
      p: model
        ? `Skriv endast den efterfrågade metoden, inklusive metodsignatur och metodkropp. Du ska inte implementera klassen \`${model}\`, konstruktorn i klassen \`${dao}\` eller klassen \`ConnectionHandler\`.`
        : `Skriv endast den efterfrågade metoden, inklusive metodsignatur och metodkropp. Du ska inte implementera konstruktorn i klassen \`${dao}\` eller klassen \`ConnectionHandler\`.`,
    },
    {
      p: model
        ? `Du får anta att samtliga klasser som behövs är importerade, inklusive klassen \`${model}\` i klassen \`${dao}\`. Du behöver inte skriva några import- eller package-satser.`
        : "Du får anta att samtliga klasser som behövs är importerade. Du behöver inte skriva några import- eller package-satser.",
    },
    { p: "Koden i ditt svar ska vara korrekt och konsekvent indenterad samt i övrigt korrekt formaterad, så att struktur och logik tydligt framgår." },
  ];
}

const OWN = "Egen övning i exempeltentans form";

// Exempeltentans inledning, ordagrant.
export const exampleIntro =
  "Denna exempeltentamen innehåller två programmeringsuppgifter i Java och JDBC för delkursen Databaser i SYSB23. Den visar hur en uppgift på en skriftlig tentamen kan vara utformad.";

export const javaTasks = [
  {
    id: "java-ex-1",
    set: "exempel",
    number: 1,
    title: "Ta bort anställda med lön under en given gräns",
    source: "Exempeltentan i Java och JDBC, uppgift 1",
    blocks: [
      { p: "Givet är en databas i Microsoft SQL Server som innehåller följande tabell:" },
      { code: EMPLOYEE_DDL, lang: "sql" },
      { p: "Följande klass `EmployeeDao` är också given:" },
      {
        lang: "java",
        code: `import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class EmployeeDao {
    private ConnectionHandler connectionHandler;

    public EmployeeDao() {
        this.connectionHandler = new ConnectionHandler();
    }
}`,
      },
      { p: "Implementera följande instansmetod i klassen `EmployeeDao`:" },
      {
        lang: "java",
        code: `public int deleteLowPaidEmployees(
        String department,
        double salaryLimit
) throws SQLException`,
      },
      { p: "Metoden ska ta bort samtliga rader i tabellen `Employee` vars värde i kolumnen `Department` är lika med värdet av parametern `department` och vars värde i kolumnen `Salary` är **lägre än** värdet av parametern `salaryLimit`. Rader vars värde i kolumnen `Salary` är lika med värdet av parametern `salaryLimit` ska inte tas bort. Rader vars värde i kolumnen `Department` skiljer sig från värdet av parametern `department` ska inte tas bort." },
      { p: "Metoden ska returnera antalet rader som togs bort. Om inga rader uppfyller båda villkoren ska metoden returnera `0`." },
      { p: "Din implementation ska inte vara sårbar för SQL-injektion." },
      { p: "Du får anta att instansvariabeln `connectionHandler` redan är initierad. Anropet `connectionHandler.getConnection()` returnerar ett objekt av typen `java.sql.Connection` som representerar en giltig anslutning till databasen. Samtliga resurser som öppnas i metoden ska stängas när de inte längre behövs, även om ett Exception uppstår." },
      { p: "Du får anta att parametern `department` inte är `null`." },
      { p: "Skriv endast den efterfrågade metoden, inklusive metodsignatur och metodkropp. Du ska inte implementera konstruktorn i klassen `EmployeeDao` eller klassen `ConnectionHandler`." },
      { p: "Du får anta att samtliga klasser som behövs är importerade. Du behöver inte skriva några import- eller package-satser." },
      { p: "Koden i ditt svar ska vara korrekt och konsekvent indenterad samt i övrigt korrekt formaterad, så att struktur och logik tydligt framgår." },
    ],
    solution: `public int deleteLowPaidEmployees(
        String department,
        double salaryLimit
) throws SQLException {
    String sql = "DELETE FROM Employee "
            + "WHERE Department = ? "
            + "    AND Salary < ?;";

    try (Connection connection = connectionHandler.getConnection();
         PreparedStatement statement = connection.prepareStatement(sql)) {
        statement.setString(1, department);
        statement.setDouble(2, salaryLimit);
        return statement.executeUpdate();
    }
}`,
    check: {
      method: { name: "deleteLowPaidEmployees", returns: "int", params: [["String", "department"], ["double", "salaryLimit"]] },
      sql: {
        kind: "DELETE",
        table: "Employee",
        where: [
          { column: "Department", op: "=", param: "department" },
          { column: "Salary", op: "<", param: "salaryLimit" },
        ],
      },
      binds: { department: "setString", salaryLimit: "setDouble" },
      result: { kind: "affected" },
    },
  },
  {
    id: "java-ex-2",
    set: "exempel",
    number: 2,
    title: "Hämta produkter i en given kategori",
    source: "Exempeltentan i Java och JDBC, uppgift 2",
    blocks: [
      { p: "Givet är en databas i Microsoft SQL Server som innehåller följande tabell:" },
      { code: PRODUCT_DDL, lang: "sql" },
      { p: "Givet är även följande klass `Product`:" },
      {
        lang: "java",
        code: `public class Product {
    private int id;
    private String productNo;
    private String name;
    private String category;
    private double price;

    public Product() {
    }

    public Product(int id, String productNo, String name,
                   String category, double price) {
        this.id = id;
        this.productNo = productNo;
        this.name = name;
        this.category = category;
        this.price = price;
    }

    // Du får anta att get- och set-metoder finns för samtliga instansvariabler.
}`,
      },
      { p: "Följande klass `ProductDao` är också given:" },
      {
        lang: "java",
        code: `import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

public class ProductDao {
    private ConnectionHandler connectionHandler;

    public ProductDao() {
        this.connectionHandler = new ConnectionHandler();
    }
}`,
      },
      { p: "Implementera följande instansmetod i klassen `ProductDao`:" },
      {
        lang: "java",
        code: `public ArrayList<Product> findProductsByCategory(
        String category
) throws SQLException`,
      },
      { p: "Metoden ska hämta samtliga rader i tabellen `Product` vars värde i kolumnen `Category` är lika med värdet av parametern `category`." },
      { p: "Metoden ska returnera ett objekt av typen `ArrayList<Product>` som innehåller ett objekt av typen `Product` för varje rad som uppfyller villkoret. Samtliga instansvariabler i varje `Product`-objekt ska tilldelas värden från motsvarande kolumner i raden. Instansvariabeln `id` motsvarar kolumnen `ProductID`." },
      { p: "Om inga rader uppfyller villkoret ska metoden returnera en tom `ArrayList<Product>`, inte `null`. Objekten i listan behöver inte vara ordnade på något särskilt sätt." },
      { p: "Din implementation ska inte vara sårbar för SQL-injektion." },
      { p: "Du får anta att instansvariabeln `connectionHandler` redan är initierad. Anropet `connectionHandler.getConnection()` returnerar ett objekt av typen `java.sql.Connection` som representerar en giltig anslutning till databasen. Samtliga resurser som öppnas i metoden ska stängas när de inte längre behövs, även om ett Exception uppstår." },
      { p: "Du får anta att parametern `category` inte är `null`." },
      { p: "Skriv endast den efterfrågade metoden, inklusive metodsignatur och metodkropp. Du ska inte implementera klassen `Product`, konstruktorn i klassen `ProductDao` eller klassen `ConnectionHandler`." },
      { p: "Du får anta att samtliga klasser som behövs är importerade, inklusive klassen `Product` i klassen `ProductDao`. Du behöver inte skriva några import- eller package-satser." },
      { p: "Koden i ditt svar ska vara korrekt och konsekvent indenterad samt i övrigt korrekt formaterad, så att struktur och logik tydligt framgår." },
    ],
    solution: `public ArrayList<Product> findProductsByCategory(
        String category
) throws SQLException {
    String sql = "SELECT ProductID, ProductNo, Name, Category, Price "
            + "FROM Product "
            + "WHERE Category = ?;";
    ArrayList<Product> products = new ArrayList<>();

    try (Connection connection = connectionHandler.getConnection();
         PreparedStatement statement = connection.prepareStatement(sql)) {
        statement.setString(1, category);

        try (ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                Product product = new Product(
                        resultSet.getInt("ProductID"),
                        resultSet.getString("ProductNo"),
                        resultSet.getString("Name"),
                        resultSet.getString("Category"),
                        resultSet.getDouble("Price")
                );
                products.add(product);
            }
        }
    }

    return products;
}`,
    check: {
      method: { name: "findProductsByCategory", returns: "ArrayList<Product>", params: [["String", "category"]] },
      sql: {
        kind: "SELECT",
        table: "Product",
        select: ["ProductID", "ProductNo", "Name", "Category", "Price"],
        where: [{ column: "Category", op: "=", param: "category" }],
      },
      binds: { category: "setString" },
      result: {
        kind: "list",
        rows: "many",
        model: "Product",
        fields: [
          { column: "ProductID", getter: "getInt" },
          { column: "ProductNo", getter: "getString" },
          { column: "Name", getter: "getString" },
          { column: "Category", getter: "getString" },
          { column: "Price", getter: "getDouble" },
        ],
      },
    },
  },

  // ── Egna övningar i exempeltentans form ─────────────────────────────

  {
    id: "java-ov-1",
    set: "ovning",
    number: 1,
    title: "Ta bort en anställd med ett givet anställningsnummer",
    source: OWN,
    blocks: [
      { p: "Givet är en databas i Microsoft SQL Server som innehåller följande tabell:" },
      { code: EMPLOYEE_DDL, lang: "sql" },
      { p: "Följande klass `EmployeeDao` är också given:" },
      { code: daoClass("EmployeeDao", SQL_IMPORTS), lang: "java" },
      { p: "Implementera följande instansmetod i klassen `EmployeeDao`:" },
      {
        lang: "java",
        code: `public int deleteEmployeeByEmployeeNo(
        String employeeNo
) throws SQLException`,
      },
      { p: "Metoden ska ta bort den rad i tabellen `Employee` vars värde i kolumnen `EmployeeNo` är lika med värdet av parametern `employeeNo`. Rader vars värde i kolumnen `EmployeeNo` skiljer sig från värdet av parametern `employeeNo` ska inte tas bort." },
      { p: "Metoden ska returnera antalet rader som togs bort. Om ingen rad uppfyller villkoret ska metoden returnera `0`." },
      ...examTail("EmployeeDao", "Du får anta att parametern `employeeNo` inte är `null`."),
    ],
    solution: `public int deleteEmployeeByEmployeeNo(
        String employeeNo
) throws SQLException {
    String sql = "DELETE FROM Employee "
            + "WHERE EmployeeNo = ?;";

    try (Connection connection = connectionHandler.getConnection();
         PreparedStatement statement = connection.prepareStatement(sql)) {
        statement.setString(1, employeeNo);
        return statement.executeUpdate();
    }
}`,
    check: {
      method: { name: "deleteEmployeeByEmployeeNo", returns: "int", params: [["String", "employeeNo"]] },
      sql: {
        kind: "DELETE",
        table: "Employee",
        where: [{ column: "EmployeeNo", op: "=", param: "employeeNo" }],
      },
      binds: { employeeNo: "setString" },
      result: { kind: "affected" },
    },
  },
  {
    id: "java-ov-2",
    set: "ovning",
    number: 2,
    title: "Höj lönen för samtliga anställda på en avdelning",
    source: OWN,
    blocks: [
      { p: "Givet är en databas i Microsoft SQL Server som innehåller följande tabell:" },
      { code: EMPLOYEE_DDL, lang: "sql" },
      { p: "Följande klass `EmployeeDao` är också given:" },
      { code: daoClass("EmployeeDao", SQL_IMPORTS), lang: "java" },
      { p: "Implementera följande instansmetod i klassen `EmployeeDao`:" },
      {
        lang: "java",
        code: `public int raiseSalaries(
        String department,
        double amount
) throws SQLException`,
      },
      { p: "Metoden ska öka värdet i kolumnen `Salary` med värdet av parametern `amount` för samtliga rader i tabellen `Employee` vars värde i kolumnen `Department` är lika med värdet av parametern `department`. Det nya värdet i kolumnen `Salary` ska alltså vara det tidigare värdet plus värdet av parametern `amount`. Rader vars värde i kolumnen `Department` skiljer sig från värdet av parametern `department` ska inte ändras." },
      { p: "Ändringen ska göras med en enda SQL-sats, utan att raderna först hämtas till Java." },
      { p: "Metoden ska returnera antalet rader som ändrades. Om inga rader uppfyller villkoret ska metoden returnera `0`." },
      ...examTail("EmployeeDao", "Du får anta att parametern `department` inte är `null`."),
    ],
    solution: `public int raiseSalaries(
        String department,
        double amount
) throws SQLException {
    String sql = "UPDATE Employee "
            + "SET Salary = Salary + ? "
            + "WHERE Department = ?;";

    try (Connection connection = connectionHandler.getConnection();
         PreparedStatement statement = connection.prepareStatement(sql)) {
        statement.setDouble(1, amount);
        statement.setString(2, department);
        return statement.executeUpdate();
    }
}`,
    check: {
      method: { name: "raiseSalaries", returns: "int", params: [["String", "department"], ["double", "amount"]] },
      sql: {
        kind: "UPDATE",
        table: "Employee",
        set: [{ column: "Salary", expr: "Salary + ?", param: "amount" }],
        where: [{ column: "Department", op: "=", param: "department" }],
      },
      binds: { amount: "setDouble", department: "setString" },
      result: { kind: "affected" },
    },
  },
  {
    id: "java-ov-3",
    set: "ovning",
    number: 3,
    title: "Spara en ny produkt",
    source: OWN,
    blocks: [
      { p: "Givet är en databas i Microsoft SQL Server som innehåller följande tabell:" },
      { code: PRODUCT_DDL, lang: "sql" },
      { p: "Givet är även följande klass `Product`:" },
      { code: PRODUCT_CLASS, lang: "java" },
      { p: "Följande klass `ProductDao` är också given:" },
      { code: daoClass("ProductDao", SQL_IMPORTS), lang: "java" },
      { p: "Implementera följande instansmetod i klassen `ProductDao`:" },
      {
        lang: "java",
        code: `public void saveProduct(
        Product product
) throws SQLException`,
      },
      { p: "Metoden ska lägga till en ny rad i tabellen `Product`. Kolumnerna `ProductNo`, `Name`, `Category` och `Price` ska tilldelas värdena av motsvarande instansvariabler i objektet `product`." },
      { p: "Kolumnen `ProductID` ska inte anges i satsen. Dess värde genereras av databasen, och värdet av instansvariabeln `id` i objektet `product` ska inte användas." },
      { p: "Metoden ska inte returnera något värde." },
      ...examTail(
        "ProductDao",
        "Du får anta att parametern `product` inte är `null`, att instansvariablerna `productNo`, `name` och `category` i objektet `product` inte är `null` och att det inte redan finns någon rad i tabellen `Product` vars värde i kolumnen `ProductNo` är lika med värdet av instansvariabeln `productNo`.",
        "Product",
      ),
    ],
    solution: `public void saveProduct(
        Product product
) throws SQLException {
    String sql = "INSERT INTO Product (ProductNo, Name, Category, Price) "
            + "VALUES (?, ?, ?, ?);";

    try (Connection connection = connectionHandler.getConnection();
         PreparedStatement statement = connection.prepareStatement(sql)) {
        statement.setString(1, product.getProductNo());
        statement.setString(2, product.getName());
        statement.setString(3, product.getCategory());
        statement.setDouble(4, product.getPrice());
        statement.executeUpdate();
    }
}`,
    check: {
      method: { name: "saveProduct", returns: "void", params: [["Product", "product"]] },
      sql: {
        kind: "INSERT",
        table: "Product",
        values: [
          { column: "ProductNo", param: "product.getProductNo()" },
          { column: "Name", param: "product.getName()" },
          { column: "Category", param: "product.getCategory()" },
          { column: "Price", param: "product.getPrice()" },
        ],
      },
      binds: {
        "product.getProductNo()": "setString",
        "product.getName()": "setString",
        "product.getCategory()": "setString",
        "product.getPrice()": "setDouble",
      },
      result: { kind: "void" },
    },
  },
  {
    id: "java-ov-4",
    set: "ovning",
    number: 4,
    title: "Räkna produkterna i en given kategori",
    source: OWN,
    blocks: [
      { p: "Givet är en databas i Microsoft SQL Server som innehåller följande tabell:" },
      { code: PRODUCT_DDL, lang: "sql" },
      { p: "Följande klass `ProductDao` är också given:" },
      { code: daoClass("ProductDao", QUERY_IMPORTS), lang: "java" },
      { p: "Implementera följande instansmetod i klassen `ProductDao`:" },
      {
        lang: "java",
        code: `public int countProductsInCategory(
        String category
) throws SQLException`,
      },
      { p: "Metoden ska räkna antalet rader i tabellen `Product` vars värde i kolumnen `Category` är lika med värdet av parametern `category`. Rader vars värde i kolumnen `Category` skiljer sig från värdet av parametern `category` ska inte räknas." },
      { p: "Antalet ska beräknas i databasen med `COUNT(*)`. Raderna ska inte hämtas och räknas i Java." },
      { p: "Metoden ska returnera antalet rader som uppfyller villkoret. Om inga rader uppfyller villkoret ska metoden returnera `0`." },
      ...examTail("ProductDao", "Du får anta att parametern `category` inte är `null`."),
    ],
    solution: `public int countProductsInCategory(
        String category
) throws SQLException {
    String sql = "SELECT COUNT(*) AS NumberOfProducts "
            + "FROM Product "
            + "WHERE Category = ?;";
    int numberOfProducts = 0;

    try (Connection connection = connectionHandler.getConnection();
         PreparedStatement statement = connection.prepareStatement(sql)) {
        statement.setString(1, category);

        try (ResultSet resultSet = statement.executeQuery()) {
            if (resultSet.next()) {
                numberOfProducts = resultSet.getInt("NumberOfProducts");
            }
        }
    }

    return numberOfProducts;
}`,
    check: {
      method: { name: "countProductsInCategory", returns: "int", params: [["String", "category"]] },
      sql: {
        kind: "SELECT",
        table: "Product",
        count: true,
        where: [{ column: "Category", op: "=", param: "category" }],
      },
      binds: { category: "setString" },
      result: { kind: "scalar", rows: "one", column: "NumberOfProducts", getter: "getInt" },
    },
  },
  {
    id: "java-ov-5",
    set: "ovning",
    number: 5,
    title: "Kontrollera om en bok med ett givet ISBN finns",
    source: OWN,
    blocks: [
      { p: "Givet är en databas i Microsoft SQL Server som innehåller följande tabell:" },
      { code: BOOK_DDL, lang: "sql" },
      { p: "Följande klass `BookDao` är också given:" },
      { code: daoClass("BookDao", QUERY_IMPORTS), lang: "java" },
      { p: "Implementera följande instansmetod i klassen `BookDao`:" },
      {
        lang: "java",
        code: `public boolean isbnExists(
        String isbn
) throws SQLException`,
      },
      { p: "Metoden ska undersöka om det finns en rad i tabellen `Book` vars värde i kolumnen `Isbn` är lika med värdet av parametern `isbn`." },
      { p: "Metoden ska returnera `true` om en sådan rad finns. Om ingen rad uppfyller villkoret ska metoden returnera `false`." },
      ...examTail("BookDao", "Du får anta att parametern `isbn` inte är `null`."),
    ],
    solution: `public boolean isbnExists(
        String isbn
) throws SQLException {
    String sql = "SELECT Isbn "
            + "FROM Book "
            + "WHERE Isbn = ?;";
    boolean exists = false;

    try (Connection connection = connectionHandler.getConnection();
         PreparedStatement statement = connection.prepareStatement(sql)) {
        statement.setString(1, isbn);

        try (ResultSet resultSet = statement.executeQuery()) {
            if (resultSet.next()) {
                exists = true;
            }
        }
    }

    return exists;
}`,
    check: {
      method: { name: "isbnExists", returns: "boolean", params: [["String", "isbn"]] },
      sql: {
        kind: "SELECT",
        table: "Book",
        where: [{ column: "Isbn", op: "=", param: "isbn" }],
      },
      binds: { isbn: "setString" },
      result: { kind: "exists", rows: "one" },
    },
  },
  {
    id: "java-ov-6",
    set: "ovning",
    number: 6,
    title: "Hämta en produkt med ett givet produktnummer",
    source: OWN,
    blocks: [
      { p: "Givet är en databas i Microsoft SQL Server som innehåller följande tabell:" },
      { code: PRODUCT_DDL, lang: "sql" },
      { p: "Givet är även följande klass `Product`:" },
      { code: PRODUCT_CLASS, lang: "java" },
      { p: "Följande klass `ProductDao` är också given:" },
      { code: daoClass("ProductDao", QUERY_IMPORTS), lang: "java" },
      { p: "Implementera följande instansmetod i klassen `ProductDao`:" },
      {
        lang: "java",
        code: `public Product findProductByProductNo(
        String productNo
) throws SQLException`,
      },
      { p: "Metoden ska hämta den rad i tabellen `Product` vars värde i kolumnen `ProductNo` är lika med värdet av parametern `productNo`." },
      { p: "Om en sådan rad finns ska metoden returnera ett objekt av typen `Product`. Samtliga instansvariabler i objektet ska tilldelas värden från motsvarande kolumner i raden. Instansvariabeln `id` motsvarar kolumnen `ProductID`." },
      { p: "Om ingen rad uppfyller villkoret ska metoden returnera `null`." },
      ...examTail("ProductDao", "Du får anta att parametern `productNo` inte är `null`.", "Product"),
    ],
    solution: `public Product findProductByProductNo(
        String productNo
) throws SQLException {
    String sql = "SELECT ProductID, ProductNo, Name, Category, Price "
            + "FROM Product "
            + "WHERE ProductNo = ?;";
    Product product = null;

    try (Connection connection = connectionHandler.getConnection();
         PreparedStatement statement = connection.prepareStatement(sql)) {
        statement.setString(1, productNo);

        try (ResultSet resultSet = statement.executeQuery()) {
            if (resultSet.next()) {
                product = new Product(
                        resultSet.getInt("ProductID"),
                        resultSet.getString("ProductNo"),
                        resultSet.getString("Name"),
                        resultSet.getString("Category"),
                        resultSet.getDouble("Price")
                );
            }
        }
    }

    return product;
}`,
    check: {
      method: { name: "findProductByProductNo", returns: "Product", params: [["String", "productNo"]] },
      sql: {
        kind: "SELECT",
        table: "Product",
        select: ["ProductID", "ProductNo", "Name", "Category", "Price"],
        where: [{ column: "ProductNo", op: "=", param: "productNo" }],
      },
      binds: { productNo: "setString" },
      result: {
        kind: "single",
        rows: "one",
        model: "Product",
        fields: [
          { column: "ProductID", getter: "getInt" },
          { column: "ProductNo", getter: "getString" },
          { column: "Name", getter: "getString" },
          { column: "Category", getter: "getString" },
          { column: "Price", getter: "getDouble" },
        ],
      },
    },
  },
  {
    id: "java-ov-7",
    set: "ovning",
    number: 7,
    title: "Hämta anställda på en given avdelning, med en del av kolumnerna",
    source: OWN,
    blocks: [
      { p: "Givet är en databas i Microsoft SQL Server som innehåller följande tabell:" },
      { code: EMPLOYEE_DDL, lang: "sql" },
      { p: "Givet är även följande klass `Employee`:" },
      { code: EMPLOYEE_CLASS, lang: "java" },
      { p: "Följande klass `EmployeeDao` är också given:" },
      { code: daoClass("EmployeeDao", LIST_IMPORTS), lang: "java" },
      { p: "Implementera följande instansmetod i klassen `EmployeeDao`:" },
      {
        lang: "java",
        code: `public ArrayList<Employee> findEmployeesByDepartment(
        String department
) throws SQLException`,
      },
      { p: "Metoden ska hämta samtliga rader i tabellen `Employee` vars värde i kolumnen `Department` är lika med värdet av parametern `department`." },
      { p: "Klassen `Employee` har instansvariabler för endast en del av kolumnerna i tabellen: den saknar instansvariabler för kolumnerna `EmployeeID` och `Department`. Frågan ska endast hämta de kolumner som motsvaras av en instansvariabel i klassen `Employee`." },
      { p: "Metoden ska returnera ett objekt av typen `ArrayList<Employee>` som innehåller ett objekt av typen `Employee` för varje rad som uppfyller villkoret. Samtliga instansvariabler i varje `Employee`-objekt ska tilldelas värden från motsvarande kolumner i raden." },
      { p: "Om inga rader uppfyller villkoret ska metoden returnera en tom `ArrayList<Employee>`, inte `null`. Objekten i listan behöver inte vara ordnade på något särskilt sätt." },
      ...examTail("EmployeeDao", "Du får anta att parametern `department` inte är `null`.", "Employee"),
    ],
    solution: `public ArrayList<Employee> findEmployeesByDepartment(
        String department
) throws SQLException {
    String sql = "SELECT EmployeeNo, FirstName, LastName, Salary "
            + "FROM Employee "
            + "WHERE Department = ?;";
    ArrayList<Employee> employees = new ArrayList<>();

    try (Connection connection = connectionHandler.getConnection();
         PreparedStatement statement = connection.prepareStatement(sql)) {
        statement.setString(1, department);

        try (ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                Employee employee = new Employee(
                        resultSet.getString("EmployeeNo"),
                        resultSet.getString("FirstName"),
                        resultSet.getString("LastName"),
                        resultSet.getDouble("Salary")
                );
                employees.add(employee);
            }
        }
    }

    return employees;
}`,
    check: {
      method: { name: "findEmployeesByDepartment", returns: "ArrayList<Employee>", params: [["String", "department"]] },
      sql: {
        kind: "SELECT",
        table: "Employee",
        select: ["EmployeeNo", "FirstName", "LastName", "Salary"],
        selectOnly: true,
        where: [{ column: "Department", op: "=", param: "department" }],
      },
      binds: { department: "setString" },
      result: {
        kind: "list",
        rows: "many",
        model: "Employee",
        fields: [
          { column: "EmployeeNo", getter: "getString" },
          { column: "FirstName", getter: "getString" },
          { column: "LastName", getter: "getString" },
          { column: "Salary", getter: "getDouble" },
        ],
      },
    },
  },
  {
    id: "java-ov-8",
    set: "ovning",
    number: 8,
    title: "Hämta en författares böcker från ett givet år, nyast först",
    source: OWN,
    blocks: [
      { p: "Givet är en databas i Microsoft SQL Server som innehåller följande tabell:" },
      { code: BOOK_DDL, lang: "sql" },
      { p: "Givet är även följande klass `Book`:" },
      { code: BOOK_CLASS, lang: "java" },
      { p: "Följande klass `BookDao` är också given:" },
      { code: daoClass("BookDao", LIST_IMPORTS), lang: "java" },
      { p: "Implementera följande instansmetod i klassen `BookDao`:" },
      {
        lang: "java",
        code: `public ArrayList<Book> findBooksByAuthor(
        String author,
        int fromYear
) throws SQLException`,
      },
      { p: "Metoden ska hämta samtliga rader i tabellen `Book` vars värde i kolumnen `Author` är lika med värdet av parametern `author` och vars värde i kolumnen `PublishedYear` är **större än eller lika med** värdet av parametern `fromYear`. Rader vars värde i kolumnen `PublishedYear` är lika med värdet av parametern `fromYear` ska tas med. Rader vars värde i kolumnen `Author` skiljer sig från värdet av parametern `author` ska inte tas med." },
      { p: "Metoden ska returnera ett objekt av typen `ArrayList<Book>` som innehåller ett objekt av typen `Book` för varje rad som uppfyller båda villkoren. Samtliga instansvariabler i varje `Book`-objekt ska tilldelas värden från motsvarande kolumner i raden. Instansvariabeln `id` motsvarar kolumnen `BookID`." },
      { p: "Objekten i listan ska vara ordnade efter värdet i kolumnen `PublishedYear` i **fallande** ordning, så att den senast utgivna boken kommer först. Ordningen ska bestämmas i SQL-frågan. Böcker med samma värde i kolumnen `PublishedYear` får komma i valfri ordning sinsemellan." },
      { p: "Om inga rader uppfyller båda villkoren ska metoden returnera en tom `ArrayList<Book>`, inte `null`." },
      ...examTail("BookDao", "Du får anta att parametern `author` inte är `null`.", "Book"),
    ],
    solution: `public ArrayList<Book> findBooksByAuthor(
        String author,
        int fromYear
) throws SQLException {
    String sql = "SELECT BookID, Isbn, Title, Author, PublishedYear, Pages "
            + "FROM Book "
            + "WHERE Author = ? "
            + "    AND PublishedYear >= ? "
            + "ORDER BY PublishedYear DESC;";
    ArrayList<Book> books = new ArrayList<>();

    try (Connection connection = connectionHandler.getConnection();
         PreparedStatement statement = connection.prepareStatement(sql)) {
        statement.setString(1, author);
        statement.setInt(2, fromYear);

        try (ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                Book book = new Book(
                        resultSet.getInt("BookID"),
                        resultSet.getString("Isbn"),
                        resultSet.getString("Title"),
                        resultSet.getString("Author"),
                        resultSet.getInt("PublishedYear"),
                        resultSet.getInt("Pages")
                );
                books.add(book);
            }
        }
    }

    return books;
}`,
    check: {
      method: { name: "findBooksByAuthor", returns: "ArrayList<Book>", params: [["String", "author"], ["int", "fromYear"]] },
      sql: {
        kind: "SELECT",
        table: "Book",
        select: ["BookID", "Isbn", "Title", "Author", "PublishedYear", "Pages"],
        where: [
          { column: "Author", op: "=", param: "author" },
          { column: "PublishedYear", op: ">=", param: "fromYear" },
        ],
        orderBy: [{ column: "PublishedYear", dir: "DESC" }],
      },
      binds: { author: "setString", fromYear: "setInt" },
      result: {
        kind: "list",
        rows: "many",
        model: "Book",
        fields: [
          { column: "BookID", getter: "getInt" },
          { column: "Isbn", getter: "getString" },
          { column: "Title", getter: "getString" },
          { column: "Author", getter: "getString" },
          { column: "PublishedYear", getter: "getInt" },
          { column: "Pages", getter: "getInt" },
        ],
      },
    },
  },
];
