// Java-fliken: rättaren läser svaret i stället för att köra det. Ett fel här
// underkänner ett riktigt svar eller släpper igenom det tentan drar poäng
// för. Varje lösningsförslag ska få full pott, varje tolerans ha ett test
// och varje regel minst ett felaktigt svar som underkänns av rätt anledning.
import { test } from "node:test";
import assert from "node:assert/strict";
import { checkJava, JAVA_RULES } from "../src/lib/javaCheck.js";
import { javaTasks } from "../src/data/databaser/javaTasks.js";

const T1 = javaTasks.find((t) => t.id === "java-ex-1");
const T2 = javaTasks.find((t) => t.id === "java-ex-2");
const rule = (r, id) => r.rules.find((x) => x.id === id);
const failing = (r) => r.rules.filter((x) => x.status === "fail").map((x) => x.id);
const show = (r) => r.rules.map((x) => `${x.id} ${x.status}: ${x.text}`).join("\n");

// Byt ut en bit av lösningsförslaget; biten måste finnas exakt en gång.
function edit(base, ...pairs) {
  let s = base;
  for (let i = 0; i < pairs.length; i += 2) {
    const [from, to] = [pairs[i], pairs[i + 1]];
    assert.equal(s.split(from).length - 1, 1, `"${from}" ska finnas exakt en gång`);
    s = s.replace(from, to);
  }
  return s;
}

function correct(code, task) {
  const r = checkJava(code, task);
  assert.equal(r.status, "correct", `${task.id}:\n${show(r)}\n${JSON.stringify(r.errors)}`);
  return r;
}

// Svaret ska underkännas på just regel `id` (och bara den, om inget annat anges).
function failsOn(code, task, id, reason, alsoFailing = []) {
  const r = checkJava(code, task);
  assert.notEqual(r.status, "parse-error", JSON.stringify(r.errors));
  const x = rule(r, id);
  assert.equal(x.status, "fail", `regel ${id} skulle underkännas:\n${show(r)}`);
  assert.match(x.text, reason, `regel ${id} underkänns av fel anledning: ${x.text}`);
  assert.ok(x.why && x.why.length > 20, `regel ${id} saknar varför`);
  assert.deepEqual(failing(r).sort((a, b) => a - b), [id, ...alsoFailing].sort((a, b) => a - b), `andra regler underkänns också:\n${show(r)}`);
  assert.notEqual(r.status, "correct");
  return r;
}

// ---------- (a) Varje lösningsförslag får full pott ----------

test("varje lösningsförslag i javaTasks får full pott", () => {
  assert.ok(javaTasks.length >= 2);
  for (const t of javaTasks) {
    const r = checkJava(t.solution, t);
    assert.equal(r.status, "correct", `${t.id}:\n${show(r)}\n${JSON.stringify(r.errors)}`);
    assert.deepEqual(r.errors, [], `${t.id}: ${JSON.stringify(r.errors)}`);
    assert.deepEqual(r.rules.map((x) => x.id), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], t.id);
    for (const x of r.rules) {
      assert.ok(x.status === "ok" || x.status === "na", `${t.id} regel ${x.id} är ${x.status}: ${x.text}`);
      assert.ok(x.title && x.text && x.why, `${t.id} regel ${x.id} saknar titel, text eller varför`);
    }
  }
});

test("reglerna har nummer, nyckel och svensk titel", () => {
  assert.deepEqual(JAVA_RULES.map((x) => x.id), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assert.equal(new Set(JAVA_RULES.map((x) => x.key)).size, 10);
  const r = checkJava(T1.solution, T1);
  assert.deepEqual(r.rules.map((x) => x.title), JAVA_RULES.map((x) => x.title));
  assert.equal(rule(r, 8).status, "na");
  assert.equal(rule(r, 9).status, "na");
});

// ---------- (b) Toleranser: rätt svar i en annan form godkänns ----------

test("fria variabelnamn: query, conn, ps, rs, list, p", () => {
  correct(`public int deleteLowPaidEmployees(String department, double salaryLimit) throws SQLException {
    String query = "DELETE FROM Employee WHERE Department = ? AND Salary < ?";
    try (Connection conn = connectionHandler.getConnection();
         PreparedStatement ps = conn.prepareStatement(query)) {
        ps.setString(1, department);
        ps.setDouble(2, salaryLimit);
        return ps.executeUpdate();
    }
}`, T1);
  correct(`public ArrayList<Product> findProductsByCategory(String category) throws SQLException {
    String q = "SELECT ProductID, ProductNo, Name, Category, Price FROM Product WHERE Category = ?";
    ArrayList<Product> list = new ArrayList<>();
    try (Connection c = connectionHandler.getConnection();
         PreparedStatement stmt = c.prepareStatement(q)) {
        stmt.setString(1, category);
        try (ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                Product p = new Product(rs.getInt("ProductID"), rs.getString("ProductNo"), rs.getString("Name"),
                        rs.getString("Category"), rs.getDouble("Price"));
                list.add(p);
            }
        }
    }
    return list;
}`, T2);
});

test("SQL:en delad i många literaler med valfria radbrytningar, utan semikolon", () => {
  correct(edit(T1.solution,
    `String sql = "DELETE FROM Employee "
            + "WHERE Department = ? "
            + "    AND Salary < ?;";`,
    `String sql =
            "DELETE " +
            "FROM Employee\\n" +
            "WHERE Department=?\\n" +
            "\\tAND Salary<?";`), T1);
});

test("SQL:en direkt i prepareStatement(\"…\")", () => {
  correct(edit(T1.solution,
    `    String sql = "DELETE FROM Employee "
            + "WHERE Department = ? "
            + "    AND Salary < ?;";

`, "",
    "connection.prepareStatement(sql)", `connection.prepareStatement(
                 "DELETE FROM Employee WHERE Department = ? AND Salary < ?")`), T1);
});

test("SQL-ord och namn utan hänsyn till skiftläge, hakparenteser och dbo.", () => {
  correct(edit(T1.solution, `"DELETE FROM Employee "`, `"delete from dbo.[employee] "`, `"WHERE Department = ? "`, `"where [DEPARTMENT] = ? "`, `"    AND Salary < ?;"`, `"    and salary < ?;"`), T1);
});

test("villkoren i omvänd ordning: set-anropen följer svarets egna frågetecken", () => {
  correct(edit(T1.solution,
    `+ "WHERE Department = ? "
            + "    AND Salary < ?;";`,
    `+ "WHERE Salary < ? AND Department = ?";`,
    "statement.setString(1, department);", "statement.setString(2, department);",
    "statement.setDouble(2, salaryLimit);", "statement.setDouble(1, salaryLimit);"), T1);
  // ? till vänster: ? > Salary är samma sak som Salary < ?.
  correct(edit(T1.solution, `"    AND Salary < ?;"`, `"    AND ? > Salary"`), T1);
});

test("andra parameternamn följs på sin plats och får en kommentar", () => {
  const r = correct(`public int deleteLowPaidEmployees(String dept, double limit) throws SQLException {
    String sql = "DELETE FROM Employee WHERE Department = ? AND Salary < ?";
    try (Connection connection = connectionHandler.getConnection();
         PreparedStatement statement = connection.prepareStatement(sql)) {
        statement.setString(1, dept);
        statement.setDouble(2, limit);
        return statement.executeUpdate();
    }
}`, T1);
  assert.equal(rule(r, 1).status, "note");
  assert.match(rule(r, 1).text, /dept och limit/);
  assert.equal(rule(r, 5).status, "ok");
});

test("kommentarer ignoreras, också sådana med ? och citattecken", () => {
  correct(edit(T1.solution,
    "    try (Connection", `    // Två ? i frågan: "department" och 'salaryLimit'.
    /* executeQuery() används inte här; statement.setString(3, x) */
    try (Connection`,
    "        return statement.executeUpdate();", "        return statement.executeUpdate(); // antal borttagna rader"), T1);
});

test("ResultSet i samma try-parentes stängs, men körs innan set-anropet", () => {
  const code = `public ArrayList<Product> findProductsByCategory(String category) throws SQLException {
    String sql = "SELECT ProductID, ProductNo, Name, Category, Price FROM Product WHERE Category = ?";
    ArrayList<Product> products = new ArrayList<>();
    try (Connection connection = connectionHandler.getConnection();
         PreparedStatement statement = connection.prepareStatement(sql);
         ResultSet resultSet = statement.executeQuery()) {
        statement.setString(1, category);
        while (resultSet.next()) {
            products.add(new Product(resultSet.getInt("ProductID"), resultSet.getString("ProductNo"),
                    resultSet.getString("Name"), resultSet.getString("Category"), resultSet.getDouble("Price")));
        }
    }
    return products;
}`;
  const r = failsOn(code, T2, 6, /try-parentesen/);
  assert.equal(rule(r, 7).status, "ok");
  assert.equal(rule(r, 8).status, "ok", "new Product(…) direkt i add räknas");
});

test("ResultSet i ett inre try, anslutning och sats i var sitt try", () => {
  correct(`public ArrayList<Product> findProductsByCategory(String category) throws SQLException {
    ArrayList<Product> products = new ArrayList<>();
    try (Connection connection = this.connectionHandler.getConnection()) {
        try (PreparedStatement statement = connection.prepareStatement(
                "SELECT ProductID, ProductNo, Name, Category, Price FROM Product WHERE Category = ?")) {
            statement.setString(1, category);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    products.add(new Product(resultSet.getInt("ProductID"), resultSet.getString("ProductNo"),
                            resultSet.getString("Name"), resultSet.getString("Category"), resultSet.getDouble("Price")));
                }
            }
        }
    }
    return products;
}`, T2);
});

test("objektet byggt med set-metoder i stället för konstruktorn", () => {
  correct(edit(T2.solution,
    `                Product product = new Product(
                        resultSet.getInt("ProductID"),
                        resultSet.getString("ProductNo"),
                        resultSet.getString("Name"),
                        resultSet.getString("Category"),
                        resultSet.getDouble("Price")
                );`,
    `                Product product = new Product();
                product.setPrice(resultSet.getDouble("Price"));
                product.setId(resultSet.getInt("ProductID"));
                product.setName(resultSet.getString("Name"));
                product.setProductNo(resultSet.getString("ProductNo"));
                product.setCategory(resultSet.getString("Category"));`), T2);
});

test("hjälpmetod som föreläsningens mapToEmployee får en kommentar om att uppgiften ber om bara metoden", () => {
  const r = correct(`private Product mapToProduct(ResultSet resultSet) throws SQLException {
    return new Product(
            resultSet.getInt("ProductID"),
            resultSet.getString("ProductNo"),
            resultSet.getString("Name"),
            resultSet.getString("Category"),
            resultSet.getDouble("Price"));
}

${edit(T2.solution,
    `                Product product = new Product(
                        resultSet.getInt("ProductID"),
                        resultSet.getString("ProductNo"),
                        resultSet.getString("Name"),
                        resultSet.getString("Category"),
                        resultSet.getDouble("Price")
                );
                products.add(product);`,
    "                products.add(mapToProduct(resultSet));")}`, T2);
  assert.equal(rule(r, 8).status, "note");
  assert.match(rule(r, 8).text, /mapToProduct/);
  // Uppgiften säger "Skriv endast den efterfrågade metoden": en hjälpmetod är inte "inget fel".
  assert.match(rule(r, 8).text, /uppgiften ber om bara den efterfrågade metoden/);
  assert.match(rule(r, 8).why, /endast den efterfrågade metoden/);
  assert.doesNotMatch(`${rule(r, 8).text} ${rule(r, 8).why}`, /inget fel/);
});

test("hela klassen runt metoden, värden via lokala variabler och värdet i en variabel före return", () => {
  correct(`public class EmployeeDao {
    private ConnectionHandler connectionHandler;

    public EmployeeDao() {
        this.connectionHandler = new ConnectionHandler();
    }

    public int deleteLowPaidEmployees(final String department, final double salaryLimit) throws SQLException {
        String sql = "DELETE FROM Employee WHERE Department = ?";
        sql += " AND Salary < ?";
        String dept = department;
        int deleted;
        try (Connection connection = connectionHandler.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, dept);
            statement.setDouble(2, salaryLimit);
            deleted = statement.executeUpdate();
        }
        return deleted;
    }
}`, T1);
});

test("close() i finally godtas med en kommentar om try-with-resources", () => {
  const r = correct(`public int deleteLowPaidEmployees(String department, double salaryLimit) throws SQLException {
    String sql = "DELETE FROM Employee WHERE Department = ? AND Salary < ?";
    Connection connection = null;
    PreparedStatement statement = null;
    try {
        connection = connectionHandler.getConnection();
        statement = connection.prepareStatement(sql);
        statement.setString(1, department);
        statement.setDouble(2, salaryLimit);
        return statement.executeUpdate();
    } finally {
        if (statement != null) {
            statement.close();
        }
        if (connection != null) {
            connection.close();
        }
    }
}`, T1);
  assert.equal(rule(r, 7).status, "note");
  assert.match(rule(r, 7).why, /try-with-resources är kursens form/);
});

test("catch som kastar vidare godtas med en kommentar", () => {
  const r = correct(edit(T1.solution,
    `        return statement.executeUpdate();
    }`,
    `        return statement.executeUpdate();
    } catch (SQLException e) {
        throw e;
    }`), T1);
  assert.equal(rule(r, 10).status, "note");
});

test("SELECT * godtas med en kommentar", () => {
  const r = correct(edit(T2.solution, `"SELECT ProductID, ProductNo, Name, Category, Price "`, `"SELECT * "`), T2);
  assert.equal(rule(r, 2).status, "note");
  assert.match(rule(r, 2).why, /skriv ut kolumnerna/);
});

// ---------- (c) Varje regel underkänner ett felaktigt svar av rätt anledning ----------

test("regel 1: fel returtyp, saknat throws, static, fel parametertyp", () => {
  failsOn(edit(T1.solution, "public int deleteLowPaidEmployees(", "public void deleteLowPaidEmployees(", "        return statement.executeUpdate();", "        statement.executeUpdate();"), T1, 1, /Returtypen är void/, [6]);
  failsOn(edit(T1.solution, ") throws SQLException {", ") {"), T1, 1, /throws SQLException saknas/);
  failsOn(edit(T1.solution, "public int deleteLowPaidEmployees(", "public static int deleteLowPaidEmployees("), T1, 1, /static/);
  failsOn(edit(T1.solution, "        double salaryLimit", "        int salaryLimit"), T1, 1, /salaryLimit är int/);
  failsOn(edit(T2.solution, "public ArrayList<Product> findProductsByCategory(", "public List<Product> findProductsByCategory("), T2, 1, /Returtypen är List<Product>/);
});

test("regel 2: <= där uppgiften säger lägre än", () => {
  const r = failsOn(edit(T1.solution, `"    AND Salary < ?;"`, `"    AND Salary <= ?;"`), T1, 2, /Salary <= \? ska vara Salary < \?/);
  assert.match(rule(r, 2).why, /exakt lika med gränsen/);
});

test("regel 2: blanksteg saknas i skarven mellan strängarna", () => {
  failsOn(edit(T1.solution, `"DELETE FROM Employee "`, `"DELETE FROM Employee"`), T1, 2, /blanksteg saknas.*EmployeeWHERE/);
});

test("regel 2: OR i stället för AND, ett villkor saknas, fel tabell, fel satstyp", () => {
  failsOn(edit(T1.solution, `"    AND Salary < ?;"`, `"    OR Salary < ?;"`), T1, 2, /OR/);
  failsOn(edit(T1.solution, `"WHERE Department = ? "
            + "    AND Salary < ?;"`, `"WHERE Salary < ? AND Department = Department"`, "statement.setString(1, department);\n", "", "statement.setDouble(2, salaryLimit);", "statement.setDouble(1, salaryLimit);"), T1, 2, /Department jämförs med Department/);
  failsOn(edit(T1.solution, `"DELETE FROM Employee "`, `"DELETE FROM Employees "`), T1, 2, /tabellen Employees/);
  failsOn(edit(T1.solution, `"DELETE FROM Employee "`, `"SELECT * FROM Employee "`), T1, 2, /Satsen är en SELECT/, [6]);
  failsOn(edit(T1.solution, `"WHERE Department = ? "
            + "    AND Salary < ?;"`, `"WHERE Salary < ?"`, "statement.setString(1, department);\n", "", "statement.setDouble(2, salaryLimit);", "statement.setDouble(1, salaryLimit);"), T1, 2, /Villkoret Department = \? saknas/);
});

test("regel 2: en kolumn saknas i SELECT-listan", () => {
  failsOn(edit(T2.solution, `"SELECT ProductID, ProductNo, Name, Category, Price "`, `"SELECT ProductID, ProductNo, Name, Category "`), T2, 2, /Price saknas i SELECT-listan/);
});

test("regel 3: parametrarna klistras in i SQL-strängen", () => {
  const r = failsOn(edit(T1.solution,
    `String sql = "DELETE FROM Employee "
            + "WHERE Department = ? "
            + "    AND Salary < ?;";`,
    `String sql = "DELETE FROM Employee "
            + "WHERE Department = '" + department + "' "
            + "AND Salary < " + salaryLimit;`,
    `        statement.setString(1, department);
        statement.setDouble(2, salaryLimit);
`, ""), T1, 3, /department och salaryLimit klistras in/);
  assert.equal(rule(r, 2).status, "ok", "villkoren finns, bara inte som ?");
  assert.equal(rule(r, 5).status, "na");
});

test("regel 3: ett ? får aldrig något värde", () => {
  failsOn(edit(T1.solution, "        statement.setDouble(2, salaryLimit);\n", ""), T1, 3, /\? nr 2 får aldrig något värde/);
});

test("regel 4: Statement i stället för PreparedStatement, annan anslutning", () => {
  failsOn(edit(T1.solution, "PreparedStatement statement = connection.prepareStatement(sql)", "Statement statement = connection.prepareStatement(sql)"), T1, 4, /deklarerad som Statement/);
  failsOn(edit(T1.solution, "Connection connection = connectionHandler.getConnection();", "Connection connection = DriverManager.getConnection(connectionUrl);"), T1, 4, /connectionHandler\.getConnection\(\)/);
  failsOn(edit(T1.solution, "connection.prepareStatement(sql)", "connection.prepareStatement()"), T1, 4, /connection\.prepareStatement\(\) får ingen SQL-sats/);
  // createStatement kräver inklistrade värden, så regel 3 underkänns också.
  failsOn(`public int deleteLowPaidEmployees(String department, double salaryLimit) throws SQLException {
    try (Connection connection = connectionHandler.getConnection();
         Statement statement = connection.createStatement()) {
        return statement.executeUpdate("DELETE FROM Employee WHERE Department = '" + department + "' AND Salary < " + salaryLimit);
    }
}`, T1, 4, /createStatement/, [3]);
});

test("regel 5: numreringen börjar på 0", () => {
  const r = failsOn(edit(T1.solution, "statement.setString(1, department);", "statement.setString(0, department);", "statement.setDouble(2, salaryLimit);", "statement.setDouble(1, salaryLimit);"), T1, 5, /börjar på 0/);
  assert.equal(rule(r, 5).why, "Platshållarna numreras från 1, inte 0 som index i en Java-lista.");
});

test("regel 5: värdena binds i fel ordning, eller med fel set-metod", () => {
  failsOn(edit(T1.solution, "statement.setString(1, department);", "statement.setString(2, department);", "statement.setDouble(2, salaryLimit);", "statement.setDouble(1, salaryLimit);"), T1, 5, /binder salaryLimit till \? nr 1, men \? nr 1 hör till Department/);
  failsOn(edit(T1.solution, "statement.setDouble(2, salaryLimit);", "statement.setInt(2, salaryLimit);"), T1, 5, /setDouble, inte setInt/);
  failsOn(edit(T2.solution, "statement.setString(1, category);", `statement.setString(1, "category");`), T2, 5, /binder "category"/);
});

test("regel 6: värdet från executeUpdate returneras inte", () => {
  failsOn(edit(T1.solution, "        return statement.executeUpdate();\n    }\n}", "        statement.executeUpdate();\n    }\n    return 0;\n}"), T1, 6, /returnerar 0, inte värdet från executeUpdate/);
});

test("regel 6: fel exekvering — executeQuery på en DELETE, frågan skickas igen, satsen körs två gånger", () => {
  failsOn(edit(T1.solution, "        return statement.executeUpdate();", "        statement.executeQuery();\n        return statement.getUpdateCount();"), T1, 6, /executeQuery\(\) kör inte en DELETE/);
  failsOn(edit(T1.solution, "return statement.executeUpdate();", "return statement.executeUpdate(sql);"), T1, 6, /skickar frågan en gång till/);
  failsOn(edit(T1.solution, "        return statement.executeUpdate();", "        statement.executeUpdate();\n        return statement.executeUpdate();"), T1, 6, /anropas 2 gånger/);
  failsOn(edit(T2.solution, "try (ResultSet resultSet = statement.executeQuery())", "try (ResultSet resultSet = statement.executeUpdate())"), T2, 6, /executeUpdate\(\) kör inte en SELECT/);
});

test("regel 7: inga try-with-resources", () => {
  failsOn(`public int deleteLowPaidEmployees(String department, double salaryLimit) throws SQLException {
    String sql = "DELETE FROM Employee WHERE Department = ? AND Salary < ?";
    Connection connection = connectionHandler.getConnection();
    PreparedStatement statement = connection.prepareStatement(sql);
    statement.setString(1, department);
    statement.setDouble(2, salaryLimit);
    return statement.executeUpdate();
}`, T1, 7, /Connection \(connection\) och PreparedStatement \(statement\) stängs aldrig/);
});

test("regel 7: close() utanför finally, anslutning utan egen variabel, ResultSet utanför try", () => {
  failsOn(`public int deleteLowPaidEmployees(String department, double salaryLimit) throws SQLException {
    String sql = "DELETE FROM Employee WHERE Department = ? AND Salary < ?";
    Connection connection = connectionHandler.getConnection();
    PreparedStatement statement = connection.prepareStatement(sql);
    statement.setString(1, department);
    statement.setDouble(2, salaryLimit);
    int rows = statement.executeUpdate();
    statement.close();
    connection.close();
    return rows;
}`, T1, 7, /står inte i finally/);
  failsOn(edit(T1.solution,
    `    try (Connection connection = connectionHandler.getConnection();
         PreparedStatement statement = connection.prepareStatement(sql)) {`,
    `    try (PreparedStatement statement = connectionHandler.getConnection().prepareStatement(sql)) {`), T1, 7, /Anslutningen från connectionHandler\.getConnection\(\) sparas inte/);
  failsOn(edit(T2.solution,
    `        try (ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {`,
    `        ResultSet resultSet = statement.executeQuery();
        {
            while (resultSet.next()) {`), T2, 7, /ResultSet \(resultSet\) öppnas av executeQuery\(\) men står inte i något try-with-resources/);
});

test("regel 8: if där frågan kan ge flera rader", () => {
  failsOn(edit(T2.solution, "while (resultSet.next())", "if (resultSet.next())"), T2, 8, /if \(resultSet\.next\(\)\) läser bara första raden/);
});

test("regel 8: fel get-metod, fel ordning i konstruktorn, kolumn som aldrig läses, objekt som aldrig läggs i listan", () => {
  failsOn(edit(T2.solution, `resultSet.getInt("ProductID")`, `resultSet.getString("ProductID")`), T2, 8, /ProductID läses med getString, men ska läsas med getInt/);
  failsOn(edit(T2.solution, `                        resultSet.getString("ProductNo"),
                        resultSet.getString("Name"),`, `                        resultSet.getString("Name"),
                        resultSet.getString("ProductNo"),`), T2, 8, /fel ordning/);
  failsOn(edit(T2.solution, `                        resultSet.getDouble("Price")`, `                        0.0`), T2, 8, /Argument 5.*inte ett värde ur raden/);
  failsOn(edit(T2.solution, "                products.add(product);\n", ""), T2, 8, /läggs aldrig i listan/);
  failsOn(edit(T2.solution, `resultSet.getString("Name")`, `resultSet.getString(3)`).replace("resultSet.getString(\"Category\")", "resultSet.getString(\"Categry\")"), T2, 8, /Categry/);
});

test("regel 9: listan skapas i loopen eller kan bli null", () => {
  failsOn(edit(T2.solution,
    "    ArrayList<Product> products = new ArrayList<>();", "    ArrayList<Product> products = null;",
    "            while (resultSet.next()) {", "            while (resultSet.next()) {\n                products = new ArrayList<>();"), T2, 9, /Listan skapas inne i loopen/);
  failsOn(edit(T2.solution, "    return products;", "    if (products.isEmpty()) {\n        return null;\n    }\n    return products;"), T2, 9, /kan returnera null/);
  failsOn(edit(T2.solution, "    ArrayList<Product> products = new ArrayList<>();", "    List<Product> products = new ArrayList<>();"), T2, 9, /deklarerad som List<Product>/);
});

test("regel 10: SQLException fångas och tystas", () => {
  const r = failsOn(edit(T1.solution,
    `        return statement.executeUpdate();
    }
}`,
    `        return statement.executeUpdate();
    } catch (SQLException e) {
        e.printStackTrace();
    }
    return 0;
}`), T1, 10, /fångar felet utan att kasta det vidare — det skrivs bara ut/);
  assert.match(rule(r, 10).why, /throws SQLException/);
  failsOn(edit(T2.solution,
    `        }
    }

    return products;`,
    `        }
    } catch (Exception e) {
        System.out.println("Fel: " + e.getMessage());
    }

    return products;`), T2, 10, /catch \(Exception e\)/);
});

test("ett svar med flera fel blir partial eller wrong, aldrig correct", () => {
  const r = checkJava(`public int deleteLowPaidEmployees(String department, double salaryLimit) {
    Connection connection = DriverManager.getConnection(url);
    Statement statement = connection.createStatement();
    statement.executeQuery("DELETE FROM Employee WHERE Department = '" + department + "' AND Salary <= " + salaryLimit);
    return 0;
}`, T1);
  assert.equal(r.status, "wrong", show(r));
  assert.ok(failing(r).length >= 5);
  assert.equal(checkJava(edit(T1.solution, `"    AND Salary < ?;"`, `"    AND Salary <= ?;"`), T1).status, "partial");
});

test("stavfel som kompilatorn stoppar: listas med rad och underkänns i regeln de rör", () => {
  const conn = failsOn(edit(T1.solution, "try (Connection connection", "try (Cnnection connection"), T1, 4, /typen Cnnection/);
  assert.ok(conn.errors.some((e) => e.line === 9 && /Cnnection finns inte — menar du Connection\?/.test(e.message)), JSON.stringify(conn.errors));
  failsOn(edit(T1.solution, "public int deleteLowPaidEmployees(", "pubic int deleteLowPaidEmployees("), T1, 1, /pubic.*menar du public/);
  const exec = failsOn(edit(T1.solution, "return statement.executeUpdate();", "return statment.executeUpdate();"), T1, 6, /anropas på statment, men satsen heter statement/);
  assert.ok(exec.errors.some((e) => /statment är inte deklarerad — menar du statement\?/.test(e.message)));
  failsOn(edit(T2.solution, "    ArrayList<Product> products = new ArrayList<>();", "    ArrayLst<Product> products = new ArrayList<>();"), T2, 9, /typen ArrayLst<Product>/);
  failsOn(edit(T2.solution, "try (ResultSet resultSet", "try (ResultSt resultSet"), T2, 8, /typen ResultSt/);
  failsOn(edit(T2.solution, "                Product product = new Product(", "                Prodct product = new Product("), T2, 8, /typen Prodct/);
  failsOn(countCode("SELECT COUNT() FROM Product WHERE Category = ?", "getInt(1)"), COUNT_TASK, 2, /COUNT\(\) saknar argument/);
  // Ett stavfel utanför rollerna står bara i errors.
  const r = checkJava(edit(T2.solution, "products.add(product);", "products.add(prodct);"), T2);
  assert.ok(r.errors.some((e) => e.line === 22 && /prodct är inte deklarerad — menar du product\?/.test(e.message)), JSON.stringify(r.errors));
  assert.equal(rule(r, 8).status, "fail", "objektet läggs inte i listan");
});

// ---------- (d) Svar som inte går att tolka ----------

test("tolkningsfel: tomt, bara kommentarer, obalanserade klamrar, öppen sträng, ingen metod", () => {
  const cases = [
    ["", /tomt/],
    ["   \n\t ", /tomt/],
    ["// jag vet inte\n/* inget */", /bara kommentarer/],
    [T1.solution.replace(/\}\s*$/, ""), /\{ stängs aldrig/],
    [T1.solution.replace("statement.setString(1, department);", "statement.setString(1, department;"), /\) saknas före/],
    [T1.solution.replace(`"DELETE FROM Employee "`, `"DELETE FROM Employee`), /strängen stängs aldrig/],
    [`String sql = "DELETE FROM Employee WHERE Department = ?";\ntry (Connection c = connectionHandler.getConnection()) { }`, /Hittar ingen metod/],
    ["public int deleteLowPaidEmployees(String department, double salaryLimit) throws SQLException {\n /* ej klar\n}", /kommentaren \/\* stängs aldrig/],
  ];
  for (const [code, reason] of cases) {
    const r = checkJava(code, T1);
    assert.equal(r.status, "parse-error", `${JSON.stringify(code.slice(0, 40))}: ${r.status}`);
    assert.deepEqual(r.rules, []);
    assert.ok(r.errors.length);
    assert.match(r.errors[0].message, reason);
  }
  // Radnumret pekar ut felet.
  const r = checkJava(T1.solution.replace(`"DELETE FROM Employee "`, `"DELETE FROM Employee`), T1);
  assert.equal(r.errors[0].line, 5);
});

test("ett saknat semikolon noteras med radnummer, men resten rättas ändå", () => {
  const r = checkJava(edit(T1.solution, "statement.setString(1, department);", "statement.setString(1, department)"), T1);
  assert.notEqual(r.status, "parse-error");
  assert.ok(r.errors.some((e) => e.line === 11 && /semikolon saknas/.test(e.message)), JSON.stringify(r.errors));
  assert.equal(rule(r, 5).status, "ok");
});

// ---------- Övriga former i check-schemat (egna uppgifter, oberoende av övningsdata) ----------

const sig = (name, returns, params) => ({ name, returns, params });
const COUNT_TASK = {
  id: "t-count",
  check: {
    method: sig("countProductsInCategory", "int", [["String", "category"]]),
    sql: { kind: "SELECT", table: "Product", count: true, where: [{ column: "Category", op: "=", param: "category" }] },
    binds: { category: "setString" },
    result: { kind: "scalar", rows: "one", column: "NumberOfProducts", getter: "getInt" },
  },
};
const countCode = (sqlText, read) => `public int countProductsInCategory(String category) throws SQLException {
    String sql = "${sqlText}";
    try (Connection connection = connectionHandler.getConnection();
         PreparedStatement statement = connection.prepareStatement(sql)) {
        statement.setString(1, category);
        try (ResultSet resultSet = statement.executeQuery()) {
            resultSet.next();
            return resultSet.${read};
        }
    }
}`;

test("COUNT(*): med alias, med eget alias, med getInt(1); utan alias går namnet inte att läsa", () => {
  correct(countCode("SELECT COUNT(*) AS NumberOfProducts FROM Product WHERE Category = ?", `getInt("NumberOfProducts")`), COUNT_TASK);
  correct(countCode("SELECT COUNT(*) AS Antal FROM Product WHERE Category = ?", `getInt("Antal")`), COUNT_TASK);
  correct(countCode("SELECT COUNT(*) FROM Product WHERE Category = ?", "getInt(1)"), COUNT_TASK);
  failsOn(countCode("SELECT COUNT(*) FROM Product WHERE Category = ?", `getInt("NumberOfProducts")`), COUNT_TASK, 8, /inget alias/);
  failsOn(countCode("SELECT ProductID FROM Product WHERE Category = ?", "getInt(1)"), COUNT_TASK, 2, /COUNT\(\*\)/);
});

const EXISTS_TASK = {
  id: "t-exists",
  check: {
    method: sig("employeeNoExists", "boolean", [["String", "employeeNo"]]),
    sql: { kind: "SELECT", table: "Employee", where: [{ column: "EmployeeNo", op: "=", param: "employeeNo" }] },
    binds: { employeeNo: "setString" },
    result: { kind: "exists", rows: "one" },
  },
};
const existsCode = (sqlText, body) => `public boolean employeeNoExists(String employeeNo) throws SQLException {
    String sql = "${sqlText}";
    try (Connection connection = connectionHandler.getConnection();
         PreparedStatement statement = connection.prepareStatement(sql)) {
        statement.setString(1, employeeNo);
        try (ResultSet resultSet = statement.executeQuery()) {
${body}
        }
    }
}`;

test("exists: rs.next(), if/true/false och COUNT(*) > 0 godkänns; COUNT(*) med rs.next() underkänns", () => {
  correct(existsCode("SELECT EmployeeNo FROM Employee WHERE EmployeeNo = ?", "            return resultSet.next();"), EXISTS_TASK);
  correct(existsCode("SELECT 1 FROM Employee WHERE EmployeeNo = ?", "            if (resultSet.next()) {\n                return true;\n            }\n            return false;"), EXISTS_TASK);
  correct(existsCode("SELECT COUNT(*) FROM Employee WHERE EmployeeNo = ?", "            resultSet.next();\n            return resultSet.getInt(1) > 0;"), EXISTS_TASK);
  correct(existsCode("SELECT EmployeeNo FROM Employee WHERE EmployeeNo = ?", "            if (!resultSet.next()) {\n                return false;\n            }\n            return true;"), EXISTS_TASK);
  failsOn(existsCode("SELECT COUNT(*) FROM Employee WHERE EmployeeNo = ?", "            return resultSet.next();"), EXISTS_TASK, 9, /alltid true/, [8]);
  failsOn(existsCode("SELECT EmployeeNo FROM Employee WHERE EmployeeNo = ?", "            return !resultSet.next();"), EXISTS_TASK, 9, /omvänt/);
});

const SINGLE_TASK = {
  id: "t-single",
  check: {
    method: sig("findByProductNo", "Product", [["String", "productNo"]]),
    sql: { kind: "SELECT", table: "Product", select: ["ProductID", "ProductNo", "Name", "Category", "Price"], where: [{ column: "ProductNo", op: "=", param: "productNo" }] },
    binds: { productNo: "setString" },
    result: { kind: "single", rows: "one", model: "Product", fields: T2.check.result.fields },
  },
};
const singleCode = (inner, tail = "    return product;") => `public Product findByProductNo(String productNo) throws SQLException {
    String sql = "SELECT ProductID, ProductNo, Name, Category, Price FROM Product WHERE ProductNo = ?";
    Product product = null;
    try (Connection connection = connectionHandler.getConnection();
         PreparedStatement statement = connection.prepareStatement(sql)) {
        statement.setString(1, productNo);
        try (ResultSet resultSet = statement.executeQuery()) {
${inner}
        }
    }
${tail}
}`;
const NEW_PRODUCT = `new Product(resultSet.getInt("ProductID"), resultSet.getString("ProductNo"),
                        resultSet.getString("Name"), resultSet.getString("Category"), resultSet.getDouble("Price"))`;

test("findBy: objektet eller null, med if; while ger en kommentar; ett tomt objekt underkänns", () => {
  correct(singleCode(`            if (resultSet.next()) {\n                product = ${NEW_PRODUCT};\n            }`), SINGLE_TASK);
  correct(singleCode(`            if (resultSet.next()) {\n                return ${NEW_PRODUCT};\n            }`, "    return null;"), SINGLE_TASK);
  const r = correct(singleCode(`            while (resultSet.next()) {\n                product = ${NEW_PRODUCT};\n            }`), SINGLE_TASK);
  assert.equal(rule(r, 8).status, "note");
  failsOn(singleCode(`            if (resultSet.next()) {\n                return ${NEW_PRODUCT};\n            }`, "    return new Product();"), SINGLE_TASK, 9, /null/);
  failsOn(singleCode(`            if (resultSet.next()) {\n                return ${NEW_PRODUCT};\n            }`, ""), SINGLE_TASK, 9, /utan return/);
});

const INSERT_TASK = {
  id: "t-insert",
  check: {
    method: sig("save", "void", [["Product", "product"]]),
    sql: { kind: "INSERT", table: "Product", values: [
      { column: "ProductNo", param: "product.getProductNo()" },
      { column: "Name", param: "product.getName()" },
      { column: "Price", param: "product.getPrice()" },
    ] },
    binds: { "product.getProductNo()": "setString", "product.getName()": "setString", "product.getPrice()": "setDouble" },
    result: { kind: "void" },
  },
};
const insertCode = (sqlText, sets) => `public void save(Product p) throws SQLException {
    String sql = "${sqlText}";
    try (Connection connection = connectionHandler.getConnection();
         PreparedStatement statement = connection.prepareStatement(sql)) {
${sets}
        statement.executeUpdate();
    }
}`;
const INSERT_SETS = `        statement.setString(1, p.getProductNo());
        statement.setString(2, p.getName());
        statement.setDouble(3, p.getPrice());`;

test("INSERT: kolumnlistan i valfri ordning, objektparameter med annat namn; surrogatnyckel och saknad kolumnlista underkänns", () => {
  const r = correct(insertCode("INSERT INTO Product (ProductNo, Name, Price) VALUES (?, ?, ?)", INSERT_SETS), INSERT_TASK);
  assert.equal(rule(r, 1).status, "note");
  correct(insertCode("INSERT INTO Product (Price, ProductNo, Name) VALUES (?, ?, ?)", `        statement.setDouble(1, p.getPrice());
        statement.setString(2, p.getProductNo());
        statement.setString(3, p.getName());`), INSERT_TASK);
  failsOn(insertCode("INSERT INTO Product VALUES (?, ?, ?)", INSERT_SETS), INSERT_TASK, 2, /Kolumnlistan saknas/);
  failsOn(insertCode("INSERT INTO Product (ProductID, ProductNo, Name, Price) VALUES (?, ?, ?, ?)", `        statement.setInt(1, 0);
        statement.setString(2, p.getProductNo());
        statement.setString(3, p.getName());
        statement.setDouble(4, p.getPrice());`), INSERT_TASK, 2, /ProductID ska inte vara med.*IDENTITY/);
  failsOn(insertCode("INSERT INTO Product (ProductNo, Name, Price) VALUES (?, ?, ?)", `        statement.setString(1, p.getName());
        statement.setString(2, p.getProductNo());
        statement.setDouble(3, p.getPrice());`), INSERT_TASK, 5, /hör till ProductNo/);
});

const UPDATE_TASK = {
  id: "t-update",
  check: {
    method: sig("raiseSalaries", "int", [["String", "department"], ["int", "percent"]]),
    sql: { kind: "UPDATE", table: "Employee", set: [{ column: "Salary", expr: "Salary * (100 + ?) / 100.0", param: "percent" }], where: [{ column: "Department", op: "=", param: "department" }] },
    binds: { percent: "setInt", department: "setString" },
    result: { kind: "affected" },
  },
};
const updateCode = (sqlText, sets, before = "") => `public int raiseSalaries(String department, int percent) throws SQLException {
    String sql = "${sqlText}";
${before}    try (Connection connection = connectionHandler.getConnection();
         PreparedStatement statement = connection.prepareStatement(sql)) {
${sets}
        return statement.executeUpdate();
    }
}`;

test("UPDATE: SET-uttrycket jämförs till värdet, också när faktorn räknas i Java; heltalsdivision underkänns", () => {
  const binds = "        statement.setInt(1, percent);\n        statement.setString(2, department);";
  correct(updateCode("UPDATE Employee SET Salary = Salary * (100 + ?) / 100.0 WHERE Department = ?", binds), UPDATE_TASK);
  correct(updateCode("UPDATE Employee SET Salary = Salary + Salary * ? / 100.0 WHERE Department = ?", binds), UPDATE_TASK);
  correct(updateCode("UPDATE Employee SET Salary = Salary * ? WHERE Department = ?",
    "        statement.setDouble(1, factor);\n        statement.setString(2, department);", "    double factor = 1 + percent / 100.0;\n"), UPDATE_TASK);
  failsOn(updateCode("UPDATE Employee SET Salary = Salary * (1 + ? / 100) WHERE Department = ?", binds), UPDATE_TASK, 2, /heltalsdivision/);
  failsOn(updateCode("UPDATE Employee SET Salary = Salary + ? WHERE Department = ?", binds), UPDATE_TASK, 2, /ger inte samma värde/);
  failsOn(updateCode("UPDATE Employee SET Salary = Salary * (100 + ?) / 100.0", "        statement.setInt(1, percent);"), UPDATE_TASK, 2, /WHERE saknas.*varje rad/);
});

const ORDER_TASK = {
  id: "t-order",
  check: {
    method: sig("findBooks", "ArrayList<Book>", [["String", "author"], ["int", "fromYear"]]),
    sql: { kind: "SELECT", table: "Book", select: ["Title", "PublishedYear"], where: [{ column: "Author", op: "=", param: "author" }, { column: "PublishedYear", op: ">=", param: "fromYear" }], orderBy: [{ column: "PublishedYear", dir: "DESC" }, { column: "Title", dir: "ASC" }] },
    binds: { author: "setString", fromYear: "setInt" },
    result: { kind: "list", rows: "many", model: "Book", fields: [{ column: "Title", getter: "getString" }, { column: "PublishedYear", getter: "getInt" }] },
  },
};
const orderCode = (sqlText) => `public ArrayList<Book> findBooks(String author, int fromYear) throws SQLException {
    String sql = "${sqlText}";
    ArrayList<Book> books = new ArrayList<>();
    try (Connection connection = connectionHandler.getConnection();
         PreparedStatement statement = connection.prepareStatement(sql)) {
        statement.setString(1, author);
        statement.setInt(2, fromYear);
        try (ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                books.add(new Book(resultSet.getString("Title"), resultSet.getInt("PublishedYear")));
            }
        }
    }
    return books;
}`;

test("ORDER BY: ASC får utelämnas; saknad ORDER BY och fel riktning underkänns", () => {
  correct(orderCode("SELECT Title, PublishedYear FROM Book WHERE Author = ? AND PublishedYear >= ? ORDER BY PublishedYear DESC, Title"), ORDER_TASK);
  correct(orderCode("SELECT Title, PublishedYear FROM Book WHERE Author = ? AND PublishedYear >= ? ORDER BY PublishedYear DESC, Title ASC"), ORDER_TASK);
  failsOn(orderCode("SELECT Title, PublishedYear FROM Book WHERE Author = ? AND PublishedYear >= ?"), ORDER_TASK, 2, /ORDER BY saknas/);
  failsOn(orderCode("SELECT Title, PublishedYear FROM Book WHERE Author = ? AND PublishedYear >= ? ORDER BY PublishedYear, Title"), ORDER_TASK, 2, /ska vara ORDER BY PublishedYear DESC, Title/);
  failsOn(orderCode("SELECT Title, PublishedYear FROM Book WHERE Author = ? AND PublishedYear > ? ORDER BY PublishedYear DESC, Title"), ORDER_TASK, 2, /PublishedYear > \? ska vara PublishedYear >= \?/);
});

// ---------- De egna övningarna (java-ov-1 … java-ov-8) ----------
// Lösningsförslagen står kopierade här, så att testerna inte går sönder när
// texten i javaTasks putsas; testet "varje lösningsförslag i javaTasks får
// full pott" rättar de riktiga. Kopiorna rättas mot de riktiga uppgifterna,
// så att check och CREATE TABLE är de verkliga.

const OV = Object.fromEntries(javaTasks.filter((t) => t.set === "ovning").map((t) => [Number(t.id.replace("java-ov-", "")), t]));

const OV1_SOLUTION = `public int deleteEmployeeByEmployeeNo(
        String employeeNo
) throws SQLException {
    String sql = "DELETE FROM Employee "
            + "WHERE EmployeeNo = ?;";

    try (Connection connection = connectionHandler.getConnection();
         PreparedStatement statement = connection.prepareStatement(sql)) {
        statement.setString(1, employeeNo);
        return statement.executeUpdate();
    }
}`;

const OV2_SOLUTION = `public int raiseSalaries(
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
}`;

const OV3_SOLUTION = `public void saveProduct(
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
}`;

const OV4_SOLUTION = `public int countProductsInCategory(
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
}`;

const OV5_SOLUTION = `public boolean isbnExists(
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
}`;

const OV6_SOLUTION = `public Product findProductByProductNo(
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
}`;

const OV7_SOLUTION = `public ArrayList<Employee> findEmployeesByDepartment(
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
}`;

const OV8_SOLUTION = `public ArrayList<Book> findBooksByAuthor(
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
}`;

const OV_SOLUTIONS = { 1: OV1_SOLUTION, 2: OV2_SOLUTION, 3: OV3_SOLUTION, 4: OV4_SOLUTION, 5: OV5_SOLUTION, 6: OV6_SOLUTION, 7: OV7_SOLUTION, 8: OV8_SOLUTION };
const ov = (n, ...pairs) => edit(OV_SOLUTIONS[n], ...pairs);

test("övningarna: åtta uppgifter, och kopiorna av lösningsförslagen får full pott", () => {
  assert.deepEqual(Object.keys(OV).map(Number), [1, 2, 3, 4, 5, 6, 7, 8]);
  for (const [n, code] of Object.entries(OV_SOLUTIONS)) {
    const r = correct(code, OV[n]);
    assert.deepEqual(r.errors, [], `övning ${n}: ${JSON.stringify(r.errors)}`);
    for (const x of r.rules) assert.ok(x.status === "ok" || x.status === "na", `övning ${n} regel ${x.id} är ${x.status}: ${x.text}`);
  }
});

test("regel 1, 4, 7 och 10 underkänns av rätt anledning i varje uppgift", () => {
  const mutate = (code, re, to, what) => {
    const out = code.replace(re, to);
    assert.notEqual(out, code, what);
    return out;
  };
  for (const t of javaTasks) {
    const s = t.solution;
    failsOn(mutate(s, /\)\s*throws\s+SQLException\s*\{/, ") {", `${t.id}: throws`), t, 1, /throws SQLException saknas/);
    failsOn(mutate(s, /PreparedStatement(\s+\w+\s*=\s*\w+\.prepareStatement\()/, "Statement$1", `${t.id}: PreparedStatement`), t, 4, /deklarerad som Statement/);
    failsOn(mutate(s, /try \(Connection (\w+) = connectionHandler\.getConnection\(\);\s*PreparedStatement (\w+) = \1\.prepareStatement\((\w+)\)\)/,
      "try (PreparedStatement $2 = connectionHandler.getConnection().prepareStatement($3))", `${t.id}: try-parentesen`), t, 7, /Anslutningen från connectionHandler\.getConnection\(\) sparas inte/);
    failsOn(mutate(s, /(\n {4}try \(Connection[\s\S]*?\n {4}\})/, "$1 catch (SQLException e) {\n        e.printStackTrace();\n    }", `${t.id}: catch`), t, 10, /fångar felet utan att kasta det vidare — det skrivs bara ut/);
  }
});

test("övning 1 (DELETE på den naturliga nyckeln): fel nyckel, saknat WHERE och fel nummer underkänns", () => {
  correct(ov(1, "        return statement.executeUpdate();", "        int deleted = statement.executeUpdate();\n        return deleted;"), OV[1]);
  failsOn(ov(1, `"WHERE EmployeeNo = ?;"`, `"WHERE EmployeeID = ?;"`), OV[1], 2, /Villkoret EmployeeNo = \? saknas\. Villkoret EmployeeID = \? finns inte i uppgiften/);
  failsOn(ov(1, `String sql = "DELETE FROM Employee "
            + "WHERE EmployeeNo = ?;";`, `String sql = "DELETE FROM Employee";`, "        statement.setString(1, employeeNo);\n", ""), OV[1], 2, /WHERE saknas\. Utan WHERE tar satsen bort varje rad/);
  // Lika många set-anrop som ?, men numret pekar fel.
  failsOn(ov(1, "statement.setString(1, employeeNo);", "statement.setString(2, employeeNo);"), OV[1], 3, /\? nr 1 får aldrig något värde, och set-anrop med nummer 2 pekar på frågetecken som inte finns/);
});

test("övning 2 (UPDATE): ? + Salary och += godkänns; fel SET-uttryck, värdena i parameterordning och saknat WHERE underkänns", () => {
  correct(ov(2, `"SET Salary = Salary + ? "`, `"SET Salary = ? + Salary "`), OV[2]);
  correct(ov(2, `"SET Salary = Salary + ? "`, `"SET Salary += ? "`), OV[2]);
  failsOn(ov(2, `"SET Salary = Salary + ? "`, `"SET Salary = ? "`), OV[2], 2, /SET Salary = \? ger inte samma värde som Salary = Salary \+ \?/);
  failsOn(ov(2, `"SET Salary = Salary + ? "`, `"SET Salary = Salary * ? "`), OV[2], 2, /SET Salary = Salary \* \? ger inte samma värde/);
  // ? nr 1 står i SET och ska få amount, fast department kommer först i signaturen.
  failsOn(ov(2, "statement.setDouble(1, amount);", "statement.setString(1, department);", "statement.setString(2, department);", "statement.setDouble(2, amount);"),
    OV[2], 5, /binder department till \? nr 1, men \? nr 1 hör till Salary, som ska få amount/);
  failsOn(ov(2, `"SET Salary = Salary + ? "
            + "WHERE Department = ?;"`, `"SET Salary = Salary + ?;"`, "        statement.setString(2, department);\n", ""), OV[2], 2, /WHERE saknas\. Utan WHERE ändrar satsen varje rad/);
  const r = failsOn(ov(2, `"SET Salary = Salary + ? "`, `"SET Salary = Salary + " + amount + " "`, "        statement.setDouble(1, amount);\n", "", "statement.setString(2, department);", "statement.setString(1, department);"),
    OV[2], 3, /amount klistras in i SQL-strängen/);
  assert.equal(rule(r, 2).status, "ok", "SET-uttrycket ger rätt värde, bara inte via ?");
  failsOn(ov(2, "        return statement.executeUpdate();\n    }\n}", "        statement.executeUpdate();\n    }\n    return 0;\n}"), OV[2], 6, /returnerar 0, inte värdet från executeUpdate/);
});

test("övning 3 (INSERT): kolumnlistan i annan ordning, värden via lokala variabler och annat parameternamn godkänns; fel bindning, surrogatnyckeln och return i void underkänns", () => {
  correct(ov(3, `"INSERT INTO Product (ProductNo, Name, Category, Price) "`, `"INSERT INTO Product (Price, Category, Name, ProductNo) "`,
    "statement.setString(1, product.getProductNo());", "statement.setDouble(1, product.getPrice());",
    "statement.setString(2, product.getName());", "statement.setString(2, product.getCategory());",
    "statement.setString(3, product.getCategory());", "statement.setString(3, product.getName());",
    "statement.setDouble(4, product.getPrice());", "statement.setString(4, product.getProductNo());"), OV[3]);
  correct(ov(3, "    try (Connection", "    String productNo = product.getProductNo();\n    String name = product.getName();\n    String category = product.getCategory();\n    double price = product.getPrice();\n\n    try (Connection",
    "statement.setString(1, product.getProductNo());", "statement.setString(1, productNo);",
    "statement.setString(2, product.getName());", "statement.setString(2, name);",
    "statement.setString(3, product.getCategory());", "statement.setString(3, category);",
    "statement.setDouble(4, product.getPrice());", "statement.setDouble(4, price);"), OV[3]);
  const p = correct(ov(3, "        Product product\n", "        Product p\n").replaceAll("product.get", "p.get"), OV[3]);
  assert.equal(rule(p, 1).status, "note");
  assert.equal(rule(p, 5).status, "ok");
  failsOn(ov(3, "statement.setString(2, product.getName());", "statement.setString(2, product.getCategory());", "statement.setString(3, product.getCategory());", "statement.setString(3, product.getName());"),
    OV[3], 5, /binder product\.getCategory\(\) till \? nr 2, men \? nr 2 hör till Name, som ska få product\.getName\(\)/);
  failsOn(ov(3, "statement.setDouble(4, product.getPrice());", "statement.setString(4, product.getPrice());"), OV[3], 5, /product\.getPrice\(\) är en double och binds med setDouble, inte setString/);
  failsOn(ov(3, `"INSERT INTO Product (ProductNo, Name, Category, Price) "`, `"INSERT INTO Product (ProductID, ProductNo, Name, Category, Price) "`, `"VALUES (?, ?, ?, ?);"`, `"VALUES (?, ?, ?, ?, ?);"`,
    "statement.setString(1, product.getProductNo());", "statement.setInt(1, product.getId());\n        statement.setString(2, product.getProductNo());",
    "statement.setString(2, product.getName());", "statement.setString(3, product.getName());",
    "statement.setString(3, product.getCategory());", "statement.setString(4, product.getCategory());",
    "statement.setDouble(4, product.getPrice());", "statement.setDouble(5, product.getPrice());"), OV[3], 2, /ProductID ska inte vara med i kolumnlistan — surrogatnyckeln fylls i av IDENTITY/);
  failsOn(ov(3, `"VALUES (?, ?, ?, ?);"`, `"VALUES (?, ?, ?);"`, "        statement.setDouble(4, product.getPrice());\n", ""), OV[3], 2, /Kolumnlistan har 4 kolumner men VALUES 3 värden/);
  const v = failsOn(ov(3, "        statement.executeUpdate();", "        return statement.executeUpdate();"), OV[3], 9, /Metoden är void, men rad 13 returnerar statement\.executeUpdate\(\); det kompilerar inte/);
  assert.match(rule(v, 9).why, /void-metod returnerar inget/);
  failsOn(ov(3, "        statement.executeUpdate();", "        statement.executeQuery();"), OV[3], 6, /executeQuery\(\) kör inte en INSERT/);
});

test("övning 4 (COUNT(*)): alias, eget alias och getInt(1) godkänns; fel get-metod, fel alias, COUNT(NULL) och räkning i Java underkänns", () => {
  correct(ov(4, `"SELECT COUNT(*) AS NumberOfProducts "`, `"SELECT COUNT(*) "`, `resultSet.getInt("NumberOfProducts")`, "resultSet.getInt(1)"), OV[4]);
  correct(ov(4, `"SELECT COUNT(*) AS NumberOfProducts "`, `"SELECT COUNT(*) AS Antal "`, `resultSet.getInt("NumberOfProducts")`, `resultSet.getInt("Antal")`), OV[4]);
  correct(ov(4, `resultSet.getInt("NumberOfProducts")`, "resultSet.getInt(1)"), OV[4]);
  correct(ov(4, `                numberOfProducts = resultSet.getInt("NumberOfProducts");`, `                return resultSet.getInt("NumberOfProducts");`), OV[4]);
  const c = correct(ov(4, `"SELECT COUNT(*) AS NumberOfProducts "`, `"SELECT COUNT(ProductID) AS NumberOfProducts "`), OV[4]);
  assert.equal(rule(c, 2).status, "note");
  assert.match(rule(c, 2).text, /COUNT\(ProductID\) räknar bara rader där ProductID inte är NULL/);
  const one = correct(ov(4, `"SELECT COUNT(*) AS NumberOfProducts "`, `"SELECT COUNT(1) AS NumberOfProducts "`), OV[4]);
  assert.match(rule(one, 2).text, /COUNT\(1\) räknar samma rader som COUNT\(\*\)/);
  failsOn(ov(4, `resultSet.getInt("NumberOfProducts")`, `resultSet.getString("NumberOfProducts")`), OV[4], 8, /läser talet med getString, men det ska läsas med getInt/);
  failsOn(ov(4, `resultSet.getInt("NumberOfProducts")`, `resultSet.getInt("Antal")`), OV[4], 8, /Aliaset i frågan är NumberOfProducts, men resultSet\.getInt\("Antal"\) läser Antal/);
  failsOn(ov(4, `"SELECT COUNT(*) AS NumberOfProducts "`, `"SELECT COUNT(*) "`), OV[4], 8, /COUNT\(\*\) har inget alias i frågan/);
  failsOn(ov(4, `"SELECT COUNT(*) AS NumberOfProducts "`, `"SELECT COUNT(NULL) AS NumberOfProducts "`), OV[4], 2, /COUNT\(NULL\) räknar inga rader alls/);
  failsOn(ov(4, "    return numberOfProducts;", "    return 0;"), OV[4], 9, /returnerar 0, inte talet ur raden/);
  // Räknat i Java: ett fel, i regel 2. Reglerna om talet i raden gäller då inte.
  const r = failsOn(ov(4, `"SELECT COUNT(*) AS NumberOfProducts "`, `"SELECT ProductID "`, `            if (resultSet.next()) {
                numberOfProducts = resultSet.getInt("NumberOfProducts");
            }`, `            while (resultSet.next()) {
                numberOfProducts++;
            }`), OV[4], 2, /räknar rader med SELECT COUNT\(\*\), men satsen hämtar ProductID/);
  assert.equal(rule(r, 8).status, "na");
  assert.equal(rule(r, 9).status, "na");
  assert.match(rule(r, 8).text, /se regel 2/);
});

test("övning 5 (exists): rs.next(), COUNT(*) > 0 och SELECT 1 godkänns; alltid true, antalet som svar och en kolumn som inte finns underkänns", () => {
  correct(ov(5, `            if (resultSet.next()) {
                exists = true;
            }`, "            exists = resultSet.next();"), OV[5]);
  correct(ov(5, "    boolean exists = false;\n", "", `            if (resultSet.next()) {
                exists = true;
            }`, "            return resultSet.next();", "\n    return exists;", ""), OV[5]);
  correct(ov(5, `"SELECT Isbn "`, `"SELECT COUNT(*) "`, "                exists = true;", "                exists = resultSet.getInt(1) > 0;"), OV[5]);
  correct(ov(5, `"SELECT Isbn "`, `"SELECT 1 "`), OV[5]);
  correct(ov(5, `"SELECT Isbn "`, `"SELECT * "`), OV[5]);
  correct(ov(5, "    boolean exists = false;", "    boolean exists = true;", `            if (resultSet.next()) {
                exists = true;
            }`, `            if (!resultSet.next()) {
                exists = false;
            }`), OV[5]);
  failsOn(ov(5, "    boolean exists = false;", "    boolean exists = true;"), OV[5], 9, /true sätts utan att frågan har gett en rad, så metoden svarar true också när ingen rad finns/);
  // Antalet i stället för ja eller nej.
  failsOn(ov(5, `"SELECT Isbn "`, `"SELECT COUNT(*) "`, "    boolean exists = false;", "    int exists = 0;", "                exists = true;", "                exists = resultSet.getInt(1);"),
    OV[5], 9, /Talet från COUNT\(\*\) ska jämföras med 0.*exists har typen int, men metoden returnerar boolean/);
  failsOn(ov(5, `"SELECT Isbn "`, `"SELECT COUNT(*) "`), OV[5], 9, /Med COUNT\(\*\) är resultSet\.next\(\) alltid true/, [8]);
  failsOn(ov(5, `"SELECT Isbn "`, `"SELECT Isbm "`), OV[5], 2, /Kolumnen Isbm finns inte i tabellen Book — menar du Isbn\?/);
});

test("övning 6 (findBy): set-metoder och return i if godkänns, while ger en kommentar; ett tomt objekt, fel nyckel och fel returtyp underkänns", () => {
  correct(ov(6, `                product = new Product(
                        resultSet.getInt("ProductID"),
                        resultSet.getString("ProductNo"),
                        resultSet.getString("Name"),
                        resultSet.getString("Category"),
                        resultSet.getDouble("Price")
                );`, `                product = new Product();
                product.setId(resultSet.getInt("ProductID"));
                product.setProductNo(resultSet.getString("ProductNo"));
                product.setName(resultSet.getString("Name"));
                product.setCategory(resultSet.getString("Category"));
                product.setPrice(resultSet.getDouble("Price"));`), OV[6]);
  correct(ov(6, "    Product product = null;\n", "", "                product = new Product(", "                return new Product(", "    return product;", "    return null;"), OV[6]);
  const w = correct(ov(6, "if (resultSet.next())", "while (resultSet.next())"), OV[6]);
  assert.equal(rule(w, 8).status, "note");
  failsOn(ov(6, "    Product product = null;", "    Product product = new Product();"), OV[6], 9, /returnerar ett tomt objekt i stället för null när ingen rad finns/);
  failsOn(ov(6, `"WHERE ProductNo = ?;"`, `"WHERE Name = ?;"`), OV[6], 2, /Villkoret ProductNo = \? saknas\. Villkoret Name = \? finns inte i uppgiften/);
  // Returtypen rättas i regel 1; regel 9 rättar värdet mot uppgiftens returtyp.
  failsOn(ov(6, "public Product findProductByProductNo(", "public ArrayList<Product> findProductByProductNo("), OV[6], 1, /Returtypen är ArrayList<Product>, men ska vara Product/);
  failsOn(ov(6, `resultSet.getDouble("Price")`, `resultSet.getInt("Price")`), OV[6], 8, /Price läses med getInt, men ska läsas med getDouble/);
});

test("övning 7 (en del av kolumnerna): annan kolumnordning och set-metoder godkänns; SELECT *, fler kolumner och en kolumn som inte hämtas underkänns", () => {
  correct(ov(7, `"SELECT EmployeeNo, FirstName, LastName, Salary "`, `"SELECT Salary, LastName, FirstName, EmployeeNo "`), OV[7]);
  correct(ov(7, `                Employee employee = new Employee(
                        resultSet.getString("EmployeeNo"),
                        resultSet.getString("FirstName"),
                        resultSet.getString("LastName"),
                        resultSet.getDouble("Salary")
                );`, `                Employee employee = new Employee();
                employee.setEmployeeNo(resultSet.getString("EmployeeNo"));
                employee.setFirstName(resultSet.getString("FirstName"));
                employee.setLastName(resultSet.getString("LastName"));
                employee.setSalary(resultSet.getDouble("Salary"));`), OV[7]);
  const star = failsOn(ov(7, `"SELECT EmployeeNo, FirstName, LastName, Salary "`, `"SELECT * "`), OV[7], 2,
    /SELECT \* hämtar alla kolumner i tabellen, också EmployeeID och Department, men uppgiften säger att frågan bara ska hämta EmployeeNo, FirstName, LastName och Salary/);
  assert.match(rule(star, 2).why, /instansvariabel/);
  // EmployeeID finns i tabellen och är inget stavfel för EmployeeNo.
  const extra = failsOn(ov(7, `"SELECT EmployeeNo, FirstName, LastName, Salary "`, `"SELECT EmployeeID, EmployeeNo, FirstName, LastName, Department, Salary "`), OV[7], 2, /EmployeeID och Department hämtas, men uppgiften säger/);
  assert.doesNotMatch(rule(extra, 2).text, /menar du/);
  const missing = failsOn(ov(7, `"SELECT EmployeeNo, FirstName, LastName, Salary "`, `"SELECT EmployeeNo, FirstName, LastName "`), OV[7], 2, /Salary saknas i SELECT-listan/);
  assert.match(rule(missing, 2).why, /get-metoden för den kastar SQLException/);
  failsOn(ov(7, `                Employee employee = new Employee(
                        resultSet.getString("EmployeeNo"),`, `                Employee employee = new Employee(
                        resultSet.getInt("EmployeeID"),
                        resultSet.getString("EmployeeNo"),`), OV[7], 8, /new Employee\(…\) får 5 argument, men konstruktorn tar 4/);
  failsOn(ov(7, `resultSet.getString("LastName")`, `resultSet.getString("Department")`), OV[7], 8, /Argument 3 läser kolumnen Department, som inte hör till Employee — det ska vara LastName/);
  failsOn(ov(7, "while (resultSet.next())", "if (resultSet.next())"), OV[7], 8, /if \(resultSet\.next\(\)\) läser bara första raden/);
  failsOn(ov(7, "    return employees;", "    if (employees.isEmpty()) {\n        return null;\n    }\n    return employees;"), OV[7], 9, /kan returnera null/);
});

test("övning 8 (två villkor och ORDER BY): villkoren i annan ordning, ? till vänster, en extra sorteringskolumn och set-metoder godkänns; saknad eller fel sortering och > underkänns", () => {
  correct(ov(8, `+ "WHERE Author = ? "
            + "    AND PublishedYear >= ? "`, `+ "WHERE PublishedYear >= ? AND Author = ? "`, "statement.setString(1, author);", "statement.setString(2, author);", "statement.setInt(2, fromYear);", "statement.setInt(1, fromYear);"), OV[8]);
  correct(ov(8, `"    AND PublishedYear >= ? "`, `"    AND ? <= PublishedYear "`), OV[8]);
  // Böcker från samma år får komma i valfri ordning, så en extra sorteringskolumn är inget fel.
  correct(ov(8, `"ORDER BY PublishedYear DESC;"`, `"ORDER BY PublishedYear DESC, Title;"`), OV[8]);
  correct(ov(8, `                Book book = new Book(
                        resultSet.getInt("BookID"),
                        resultSet.getString("Isbn"),
                        resultSet.getString("Title"),
                        resultSet.getString("Author"),
                        resultSet.getInt("PublishedYear"),
                        resultSet.getInt("Pages")
                );`, `                Book book = new Book();
                book.setId(resultSet.getInt("BookID"));
                book.setIsbn(resultSet.getString("Isbn"));
                book.setTitle(resultSet.getString("Title"));
                book.setAuthor(resultSet.getString("Author"));
                book.setPublishedYear(resultSet.getInt("PublishedYear"));
                book.setPages(resultSet.getInt("Pages"));`), OV[8]);
  const noOrder = `            + "    AND PublishedYear >= ? "
            + "ORDER BY PublishedYear DESC;";`;
  failsOn(ov(8, noOrder, `            + "    AND PublishedYear >= ?;";`), OV[8], 2, /ORDER BY saknas: raderna ska sorteras med ORDER BY PublishedYear DESC/);
  // Sorterat i Java: uppgiften kräver att ordningen bestäms i SQL-frågan.
  failsOn(ov(8, noOrder, `            + "    AND PublishedYear >= ?;";`, "    return books;", "    books.sort((a, b) -> b.getPublishedYear() - a.getPublishedYear());\n    return books;"), OV[8], 2, /ORDER BY saknas/);
  failsOn(ov(8, `"ORDER BY PublishedYear DESC;"`, `"ORDER BY PublishedYear;"`), OV[8], 2, /ORDER BY PublishedYear ska vara ORDER BY PublishedYear DESC/);
  failsOn(ov(8, `"ORDER BY PublishedYear DESC;"`, `"ORDER BY PublishedYear ASC;"`), OV[8], 2, /ORDER BY PublishedYear ska vara ORDER BY PublishedYear DESC/);
  failsOn(ov(8, `"ORDER BY PublishedYear DESC;"`, `"ORDER BY Title, PublishedYear DESC;"`), OV[8], 2, /ORDER BY Title, PublishedYear DESC ska vara ORDER BY PublishedYear DESC/);
  const gt = failsOn(ov(8, `"    AND PublishedYear >= ? "`, `"    AND PublishedYear > ? "`), OV[8], 2, /PublishedYear > \? ska vara PublishedYear >= \?/);
  assert.match(rule(gt, 2).why, /missas rader där PublishedYear är exakt lika med gränsen/);
  failsOn(ov(8, "statement.setInt(2, fromYear);", "statement.setString(2, fromYear);"), OV[8], 5, /fromYear är en int och binds med setInt, inte setString/);
  failsOn(ov(8, `                        resultSet.getInt("PublishedYear"),
                        resultSet.getInt("Pages")`, `                        resultSet.getInt("Pages"),
                        resultSet.getInt("PublishedYear")`), OV[8], 8, /står i fel ordning: femte argumentet är Pages/);
  failsOn(ov(8, `                books.add(book);
            }`, `            }
            books.add(book);`), OV[8], 8, /books\.add\(book\) står utanför loopen/);
  failsOn(ov(8, "    return books;", "    return books.isEmpty() ? null : books;"), OV[8], 9, /kan returnera null/);
});

// ---------- (d) Granskningens fynd: ett test per fel ----------

const WHILE_RS = "            while (resultSet.next()) {";
const ADD_END = "                products.add(product);\n            }";

test("regel 8: ett extra rs.next() före eller i läsloopen hoppar över en rad; do-while efter ett if godkänns", () => {
  failsOn(edit(T2.solution, WHILE_RS, `            if (resultSet.next()) {\n${WHILE_RS}`, ADD_END, `${ADD_END}\n            }`), T2, 8,
    /resultSet\.next\(\) anropas också på rad 14, utöver while \(resultSet\.next\(\)\)\. Varje anrop flyttar markören en rad, så en rad hoppas över/);
  failsOn(edit(T2.solution, WHILE_RS, `            resultSet.next();\n${WHILE_RS}`), T2, 8, /anropas också på rad 14, utöver while/);
  failsOn(edit(T2.solution, WHILE_RS, `            if (!resultSet.next()) {\n                return products;\n            }\n${WHILE_RS}`), T2, 8, /anropas också på rad 14, utöver while/);
  failsOn(edit(T2.solution, "                products.add(product);", "                products.add(product);\n                resultSet.next();"), T2, 8, /anropas också på rad 23, utöver while/);
  // do { … } while (rs.next()) läser rätt när ett if redan har flyttat markören till första raden.
  const doLoop = (before, after = "") => edit(T2.solution, WHILE_RS, `${before}            do {`, ADD_END, `                products.add(product);\n            } while (resultSet.next());${after}`);
  correct(doLoop("            if (!resultSet.next()) {\n                return products;\n            }\n"), T2);
  correct(doLoop("            if (resultSet.next()) {\n", "\n            }"), T2);
  // En rad: ett anrop före if (rs.next()) letar efter en andra rad, som en unik nyckel aldrig ger.
  failsOn(ov(6, "            if (resultSet.next()) {", "            resultSet.next();\n            if (resultSet.next()) {"), OV[6], 8, /anropas också på rad 14, utöver if \(resultSet\.next\(\)\)/);
  failsOn(ov(5, "            if (resultSet.next()) {", "            resultSet.next();\n            if (resultSet.next()) {"), OV[5], 8, /anropas också på rad 14/);
});

const NEW_PRODUCT_ROW = `new Product(resultSet.getInt("ProductID"), resultSet.getString("ProductNo"), resultSet.getString("Name"),
                    resultSet.getString("Category"), resultSet.getDouble("Price"))`;
// Övning 6 med en egen kropp i det inre try-blocket och utan variabeln product.
const ov6Body = (inner) => ov(6, "    Product product = null;\n", "", `            if (resultSet.next()) {
                product = new Product(
                        resultSet.getInt("ProductID"),
                        resultSet.getString("ProductNo"),
                        resultSet.getString("Name"),
                        resultSet.getString("Category"),
                        resultSet.getDouble("Price")
                );
            }`, inner, "\n    return product;", "");

test("regel 8: !rs.next() och do-while utan if före underkänns; findBy bygger objektet bara där next() har gett en rad", () => {
  failsOn(edit(T2.solution, "while (resultSet.next())", "while (!resultSet.next())"), T2, 8, /while \(!resultSet\.next\(\)\) kör blocket bara när det inte finns någon rad att läsa/);
  failsOn(edit(T2.solution, WHILE_RS, "            do {", ADD_END, "                products.add(product);\n            } while (resultSet.next());"), T2, 8,
    /do \{ … \} while \(resultSet\.next\(\)\) kör blocket en gång innan villkoret prövas/);
  failsOn(ov(6, "if (resultSet.next())", "if (!resultSet.next())"), OV[6], 8, /Product-objektet byggs utan att resultSet\.next\(\) har gett en rad/);
  failsOn(ov6Body(`            if (resultSet.next()) {\n                return null;\n            }\n            return ${NEW_PRODUCT_ROW};`), OV[6], 8, /byggs utan att resultSet\.next\(\) har gett en rad/);
  failsOn(ov6Body(`            return resultSet.next() ? null : ${NEW_PRODUCT_ROW};`), OV[6], 8, /byggs utan att resultSet\.next\(\) har gett en rad/);
  // Rätta former: vakten if (!rs.next()) return null; före objektet, och villkorsuttrycket.
  correct(ov6Body(`            if (!resultSet.next()) {\n                return null;\n            }\n            return ${NEW_PRODUCT_ROW};`), OV[6]);
  correct(ov6Body(`            return resultSet.next() ? ${NEW_PRODUCT_ROW} : null;`), OV[6]);
});

test("en variabel som deklareras i ett block finns inte efter blocket: listas med rad och underkänns", () => {
  const ex1 = failsOn(edit(T1.solution, "        return statement.executeUpdate();\n    }", "        int rows = statement.executeUpdate();\n    }\n    return rows;"), T1, 6,
    /rows deklareras på rad 13 inne i ett block som har stängts före return på rad 15, så den finns inte där; det kompilerar inte/);
  assert.ok(ex1.errors.some((e) => e.line === 15 && /rows deklareras på rad 13 inne i ett block som redan har stängts/.test(e.message)), JSON.stringify(ex1.errors));
  const ex2 = failsOn(edit(T2.solution, "    ArrayList<Product> products = new ArrayList<>();\n", "", "        statement.setString(1, category);\n", "        statement.setString(1, category);\n        ArrayList<Product> products = new ArrayList<>();\n"), T2, 9,
    /products deklareras på rad 11 inne i ett block som har stängts före return på rad 27/);
  assert.ok(ex2.errors.some((e) => /products deklareras på rad 11 inne i ett block som redan har stängts/.test(e.message)), JSON.stringify(ex2.errors));
  assert.match(rule(ex2, 9).why, /finns bara i blocket där den deklareras/);
  // ResultSet läst efter sitt try-block.
  failsOn(edit(T2.solution, "statement.executeQuery()) {\n", "statement.executeQuery()) {\n        }\n", "                products.add(product);\n            }\n        }\n", "                products.add(product);\n            }\n"), T2, 8,
    /resultSet deklareras på rad 13 inne i ett block som redan har stängts, så resultSet\.next\(\) på rad 15 kompilerar inte/);
  failsOn(ov(6, "    Product product = null;\n", "", "        try (ResultSet resultSet = statement.executeQuery()) {\n", "        try (ResultSet resultSet = statement.executeQuery()) {\n            Product product = null;\n"), OV[6], 9,
    /product deklareras på rad 13 inne i ett block som har stängts före return på rad 26/);
  failsOn(ov(4, "    int numberOfProducts = 0;\n", "", `                numberOfProducts = resultSet.getInt("NumberOfProducts");`, `                int numberOfProducts = resultSet.getInt("NumberOfProducts");`), OV[4], 9,
    /numberOfProducts deklareras på rad 14 inne i ett block som har stängts före return/);
  // Utan deklaration alls: samma sak, i regeln som bygger på variabeln.
  failsOn(edit(T1.solution, "        return statement.executeUpdate();\n    }", "        rows = statement.executeUpdate();\n    }\n    return rows;"), T1, 6, /rows är inte deklarerad där return står \(rad 15\)/);
  // Deklarerad före blocket och tilldelad i det: rätt.
  correct(edit(T1.solution, "    try (Connection", "    int rows;\n    try (Connection", "        return statement.executeUpdate();\n    }", "        rows = statement.executeUpdate();\n    }\n    return rows;"), T1);
});

test("exists med COUNT(*): jämförelsen räknas ut för 0 och 1, åt vilket håll den än står; ett omvänt svar via en variabel underkänns", () => {
  const counted = (ret) => ov(5, `"SELECT Isbn "`, `"SELECT COUNT(*) "`, "    boolean exists = false;\n", "", `            if (resultSet.next()) {
                exists = true;
            }`, `            resultSet.next();\n            ${ret}`, "\n    return exists;", "");
  for (const ret of ["return resultSet.getInt(1) == 0;", "return resultSet.getInt(1) >= 0;", "return resultSet.getInt(1) != 1;", "return resultSet.getInt(1) > 1;",
    "int n = resultSet.getInt(1);\n            return n == 0;", "if (resultSet.getInt(1) == 0) {\n                return true;\n            }\n            return false;", "return resultSet.getInt(1) == 0 ? true : false;"]) {
    failsOn(counted(ret), OV[5], 9, /Jämförelsen med talet från COUNT\(\*\) ger fel svar: den ska ge false när talet är 0 och true när det är 1 eller mer/);
  }
  for (const ret of ["return 0 < resultSet.getInt(1);", "return 1 <= resultSet.getInt(1);", "return resultSet.getInt(1) != 0;", "return resultSet.getInt(1) >= 1;",
    "return !(resultSet.getInt(1) == 0);", "if (resultSet.getInt(1) == 0) {\n                return false;\n            }\n            return true;"]) {
    correct(counted(ret), OV[5]);
  }
  const plain = (body) => ov(5, "    boolean exists = false;\n", "", `            if (resultSet.next()) {
                exists = true;
            }`, body, "\n    return exists;", "");
  failsOn(plain("            boolean found = resultSet.next();\n            return !found;"), OV[5], 9, /Svaret är omvänt/);
  failsOn(plain("            return resultSet.next() ? false : true;"), OV[5], 9, /Svaret är omvänt/);
});

test("regel 5: samma nummer i två set-anrop — det sista värdet gäller, och det rättas", () => {
  failsOn(edit(T1.solution, "statement.setDouble(2, salaryLimit);", "statement.setDouble(2, salaryLimit);\n        statement.setString(1, \"x\");"), T1, 5,
    /Både statement\.setString\(1, department\) och statement\.setString\(1, "x"\) binder \? nr 1; bara det sista värdet, "x", gäller när frågan körs/);
  failsOn(edit(T1.solution, "statement.setDouble(2, salaryLimit);", "statement.setDouble(1, salaryLimit);"), T1, 5,
    /bara det sista värdet, salaryLimit, gäller.*binder salaryLimit till \? nr 1, men \? nr 1 hör till Department/, [3]);
  failsOn(edit(T1.solution, "statement.setString(1, department);", "statement.setString(1, \"x\");\n        statement.setString(1, department);"), T1, 5, /bara det sista värdet, department, gäller/);
});

test("regel 2: TOP n i en fråga som ska ge alla rader underkänns; i en findBy och ett ja eller nej godtas den", () => {
  failsOn(edit(T2.solution, `"SELECT ProductID`, `"SELECT TOP 1 ProductID`), T2, 2, /TOP begränsar hur många rader frågan hämtar, men metoden ska returnera alla rader/);
  failsOn(ov(8, `"SELECT BookID`, `"SELECT TOP (10) BookID`), OV[8], 2, /TOP begränsar hur många rader frågan hämtar/);
  correct(ov(6, `"SELECT ProductID`, `"SELECT TOP 1 ProductID`), OV[6]);
  correct(ov(5, `"SELECT Isbn "`, `"SELECT TOP 1 Isbn "`), OV[5]);
});

test("regel 7: close() i finally hjälper inte när en resurs öppnas före try; öppnad i det try:t godtas med en kommentar", () => {
  failsOn(`public int deleteLowPaidEmployees(String department, double salaryLimit) throws SQLException {
    String sql = "DELETE FROM Employee WHERE Department = ? AND Salary < ?";
    Connection c = connectionHandler.getConnection();
    PreparedStatement ps = c.prepareStatement(sql);
    try {
        ps.setString(1, department);
        ps.setDouble(2, salaryLimit);
        return ps.executeUpdate();
    } finally {
        ps.close();
        c.close();
    }
}`, T1, 7, /Connection \(c\) stängs i finally, men c\.prepareStatement\(sql\) står före det try-blocket: kastar den ett Exception körs finally aldrig/);
  const r = correct(`public int deleteLowPaidEmployees(String department, double salaryLimit) throws SQLException {
    String sql = "DELETE FROM Employee WHERE Department = ? AND Salary < ?";
    Connection c = connectionHandler.getConnection();
    try {
        PreparedStatement ps = c.prepareStatement(sql);
        try {
            ps.setString(1, department);
            ps.setDouble(2, salaryLimit);
            return ps.executeUpdate();
        } finally {
            ps.close();
        }
    } finally {
        c.close();
    }
}`, T1);
  assert.equal(rule(r, 7).status, "note");
});

test("regel 8: getBigDecimal(\"Price\").doubleValue() läser ur raden, men med fel get-metod", () => {
  for (const [code, task] of [[edit(T2.solution, `resultSet.getDouble("Price")`, `resultSet.getBigDecimal("Price").doubleValue()`), T2], [ov(6, `resultSet.getDouble("Price")`, `resultSet.getBigDecimal("Price").doubleValue()`), OV[6]]]) {
    const r = failsOn(code, task, 8, /Price läses med getBigDecimal, men ska läsas med getDouble/);
    assert.doesNotMatch(rule(r, 8).text, /inte ett värde ur raden/);
  }
});

test("regel 7: ResultSet utan eget try underkänns med kursens form som skäl, inte med ett krav som JDBC redan uppfyller", () => {
  // Som föreläsningens findByEmpNo: ResultSet direkt i blocket, stängt först när PreparedStatement stängs.
  const r = failsOn(ov(6, "        try (ResultSet resultSet = statement.executeQuery()) {\n", "        ResultSet resultSet = statement.executeQuery();\n", "        }\n    }\n\n    return product;", "    }\n\n    return product;"), OV[6], 7,
    /ResultSet \(resultSet\) öppnas av executeQuery\(\) men står inte i något try-with-resources\. Den stängs visserligen när PreparedStatement stängs, men kursen och lösningsförslaget stänger varje resurs som metoden öppnar uttryckligen/);
  assert.match(rule(r, 7).why, /svaret rättas efter kursens form/);
  assert.doesNotMatch(`${rule(r, 7).text} ${rule(r, 7).why}`, /kräver att samtliga resurser/);
});
