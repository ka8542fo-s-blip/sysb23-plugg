// ⌘K ⌘F i kodrutorna: formateraren för Java och DDL (lib/codeIndent.js),
// markörens väg genom en formatering (lib/textEdit.js) och kortkommandona
// (lib/keys.js). Formateraren får bara röra blanktecken i radernas början
// och slut, och lösningsförslagen och facit är facit för stilen.
import { test } from "node:test";
import assert from "node:assert/strict";
import { formatDdl, formatJava } from "../src/lib/codeIndent.js";
import { chordStep, CHORD_MS, isSelectAll } from "../src/lib/keys.js";
import { mapOffset } from "../src/lib/textEdit.js";
import { formatSql } from "../src/lib/sqlIndent.js";
import { javaTasks } from "../src/data/databaser/javaTasks.js";
import { ddlExercises } from "../src/data/databaser/ddlExercises.js";
import { toDdl } from "../src/lib/ddlCheck.js";

const flat = (text) => text.split("\n").map((line) => line.trimStart()).join("\n");

// Slumpat indrag (blanksteg och tabbar) och blanksteg sist på raderna, men
// samma radinnehåll. Fast frö, så att ett fel går att återskapa.
function messy(text, seed) {
  let s = seed;
  const rand = (n) => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s % n;
  };
  return text
    .split("\n")
    .map((line) => (line.trim() ? `${["", " ", "\t", "  \t"][rand(4)]}${" ".repeat(rand(14))}${line.trim()}${" ".repeat(rand(3))}` : " ".repeat(rand(3))))
    .join("\n");
}

// Bara blanktecken i radernas början och slut får skilja.
function sameLines(input, output) {
  const a = input.split("\n");
  const b = output.split("\n");
  assert.equal(b.length, a.length, "antalet rader");
  a.forEach((line, i) => assert.equal(b[i].trim(), line.trim(), `rad ${i + 1}`));
}

test("Java: lösningsförslagen står kvar som de är", () => {
  for (const task of javaTasks) assert.equal(formatJava(task.solution), task.solution, task.id);
});

test("Java: lösningsförslagen utan indrag får tillbaka exakt sitt indrag", () => {
  for (const task of javaTasks) assert.equal(formatJava(flat(task.solution)), task.solution, task.id);
});

test("Java: slumpat indrag, tabbar och blanksteg sist på raden rättas till lösningsförslagets", () => {
  for (const task of javaTasks) {
    for (const seed of [1, 7, 42]) assert.equal(formatJava(messy(task.solution, seed)), task.solution, `${task.id} frö ${seed}`);
  }
});

test("Java: try med två resurser får den andra resursen under den första", () => {
  const out = formatJava("try (Connection c = h.getConnection();\nPreparedStatement s = c.prepareStatement(sql)) {\nreturn s.executeUpdate();\n}");
  assert.equal(out, "try (Connection c = h.getConnection();\n     PreparedStatement s = c.prepareStatement(sql)) {\n    return s.executeUpdate();\n}");
});

test("Java: klamrar och parenteser i strängar, tecken och kommentarer räknas inte", () => {
  const input = [
    "public int f() {",
    'String sql = "SELECT (x FROM T WHERE a = \'{\' AND b = ?"; // } )',
    "char c = '{';",
    "/* { ( */ int x = 1;",
    "return x;",
    "}",
  ].join("\n");
  assert.equal(
    formatJava(input),
    [
      "public int f() {",
      '    String sql = "SELECT (x FROM T WHERE a = \'{\' AND b = ?"; // } )',
      "    char c = '{';",
      "    /* { ( */ int x = 1;",
      "    return x;",
      "}",
    ].join("\n"),
  );
});

test("Java: if och else utan klamrar, klammer på egen rad, metodkedja, lambda och catch", () => {
  const input = [
    "@Override",
    "public int count(String category) throws SQLException",
    "{",
    "if (category == null)",
    "return 0;",
    "else",
    "{",
    "log(category);",
    "}",
    "try (Connection connection = connectionHandler.getConnection()) {",
    "PreparedStatement statement = connection",
    ".prepareStatement(sql);",
    "} catch (SQLException e) {",
    "throw new RuntimeException(e);",
    "} finally {",
    "list.forEach(x -> {",
    "System.out.println(x);",
    "});",
    "}",
    "return 1;",
    "}",
  ].join("\n");
  assert.equal(
    formatJava(input),
    [
      "@Override",
      "public int count(String category) throws SQLException",
      "{",
      "    if (category == null)",
      "        return 0;",
      "    else",
      "    {",
      "        log(category);",
      "    }",
      "    try (Connection connection = connectionHandler.getConnection()) {",
      "        PreparedStatement statement = connection",
      "                .prepareStatement(sql);",
      "    } catch (SQLException e) {",
      "        throw new RuntimeException(e);",
      "    } finally {",
      "        list.forEach(x -> {",
      "            System.out.println(x);",
      "        });",
      "    }",
      "    return 1;",
      "}",
    ].join("\n"),
  );
});

test("Java: ett textblock står orört, och en kommentar över flera rader flyttas som en enhet", () => {
  const input = 'void f() {\nString s = """\n  {  innehåll  }  \n    """;\n/**\n * Kommentar.\n */\nint x;\n}';
  assert.equal(formatJava(input), 'void f() {\n    String s = """\n  {  innehåll  }  \n    """;\n    /**\n     * Kommentar.\n     */\n    int x;\n}');
});

test("Java: tomma rader blir tomma och raderna behåller sitt innehåll", () => {
  assert.equal(formatJava("void f() {\n    \n\tint x;   \n}"), "void f() {\n\n    int x;\n}");
});

test("Java: trasig kod (en klammer för mycket eller för lite) ger inget fel och bara indrag ändras", () => {
  const solution = javaTasks.find((t) => t.id === "java-ex-2").solution;
  const lines = solution.split("\n");
  const variants = [
    `${solution}\n}`,
    lines.filter((_, i) => i !== lines.length - 1).join("\n"),
    lines.slice(0, 14).join("\n"),
    `}\n${solution}`,
    solution.replace("(\n", "\n"),
  ];
  for (const input of variants) sameLines(input, formatJava(input));
  // Utan sista } står resten som i lösningsförslaget.
  assert.equal(formatJava(flat(variants[1])), lines.slice(0, -1).join("\n"));
});

test("Java: varje del av lösningsförslagen, i slumpat skick, ändras bara i blanktecken", () => {
  for (const task of javaTasks) {
    const lines = task.solution.split("\n");
    for (let cut = 1; cut <= lines.length; cut += 3) {
      const input = messy(lines.slice(0, cut).join("\n"), cut);
      const out = formatJava(input);
      sameLines(input, out);
      assert.equal(formatJava(out), out, `${task.id} till rad ${cut}: en andra formatering ändrar inget`);
    }
  }
});

test("DDL: facit står kvar, och utan indrag får det tillbaka facits fyra blanksteg", () => {
  for (const exercise of ddlExercises) {
    const facit = toDdl(exercise.facit);
    assert.equal(formatDdl(facit), facit, `${exercise.id}: står kvar`);
    assert.equal(formatDdl(flat(facit), 4), facit, `${exercise.id}: utan indrag`);
  }
});

test("DDL: steget följer det man skriver med, två som rutans mall eller fyra som facit", () => {
  const two = "CREATE TABLE A (\nAID INTEGER IDENTITY(1,1),\n  BID INTEGER NOT NULL,\n  PRIMARY KEY (AID),\n      FOREIGN KEY (BID)\nREFERENCES B(BID)\n);";
  assert.equal(
    formatDdl(two),
    "CREATE TABLE A (\n  AID INTEGER IDENTITY(1,1),\n  BID INTEGER NOT NULL,\n  PRIMARY KEY (AID),\n  FOREIGN KEY (BID)\n    REFERENCES B(BID)\n);",
  );
  const four = "CREATE TABLE Product (\n    ProductID INT IDENTITY(1, 1) NOT NULL,\n  Name VARCHAR(100) NOT NULL, -- kommentar (\n    CONSTRAINT PK_Product_ProductID\nPRIMARY KEY (ProductID),\n    Note VARCHAR(10) DEFAULT 'a ( b'\n);";
  assert.equal(
    formatDdl(four),
    "CREATE TABLE Product (\n    ProductID INT IDENTITY(1, 1) NOT NULL,\n    Name VARCHAR(100) NOT NULL, -- kommentar (\n    CONSTRAINT PK_Product_ProductID\n        PRIMARY KEY (ProductID),\n    Note VARCHAR(10) DEFAULT 'a ( b'\n);",
  );
  // Utan något indrag att gå efter: rutans två.
  assert.equal(formatDdl("CREATE TABLE A (\nAID INTEGER\n);"), "CREATE TABLE A (\n  AID INTEGER\n);");
});

test("DDL: en sträng över flera rader står orörd", () => {
  const input = "INSERT INTO A (Note) VALUES ('rad ett\n   rad två (\n');\nCREATE TABLE B (\nBID INTEGER\n);";
  assert.equal(formatDdl(input), "INSERT INTO A (Note) VALUES ('rad ett\n   rad två (\n');\nCREATE TABLE B (\n  BID INTEGER\n);");
});

test("Markören står kvar på samma ställe i koden efter en formatering", () => {
  const before = "void f() {\nint x = 1;\n}";
  const after = formatJava(before);
  // Efter "int", före "int" (som står först på raden) och sist i texten.
  assert.equal(after.slice(0, mapOffset(before, after, before.indexOf("int") + 3)), "void f() {\n    int");
  assert.equal(mapOffset(before, after, before.indexOf("int")), after.indexOf("int"));
  assert.equal(mapOffset(before, after, before.length), after.length);
  assert.equal(mapOffset(before, after, 0), 0);
  // Längst till vänster före ett indrag står markören kvar där.
  const indented = "void f() {\n  int x;\n}";
  assert.equal(mapOffset(indented, formatJava(indented), indented.indexOf("\n") + 1), indented.indexOf("\n") + 1);
  // Blanksteg sist på raden tas bort: markören hamnar sist på raden.
  assert.equal(mapOffset("a;   \nb;", "a;\nb;", 4), 2);
  // SQL-formateraren byter radbrytningar: platsen räknas bland tecknen.
  const sql = "SELECT a FROM T WHERE b = 1;";
  const formatted = formatSql(sql);
  assert.notEqual(formatted.split("\n").length, sql.split("\n").length);
  assert.equal(formatted.slice(0, mapOffset(sql, formatted, sql.indexOf("FROM") + 4)).replace(/\s+/g, " "), "SELECT a FROM");
  assert.equal(formatted.slice(mapOffset(sql, formatted, sql.indexOf(" WHERE") + 1)).startsWith("WHERE"), true);
});

test("⌘K ⌘F: ⌘K väntar, F (med eller utan ⌘) inom två sekunder formaterar, annat avbryter", () => {
  const key = (k, mods = {}) => ({ key: k, metaKey: false, ctrlKey: false, altKey: false, shiftKey: false, ...mods });
  const mac = true;
  assert.equal(chordStep(null, key("k", { metaKey: true }), 1000, mac), "start");
  assert.equal(chordStep(1000, key("f", { metaKey: true }), 1500, mac), "format");
  assert.equal(chordStep(1000, key("f"), 1500, mac), "format");
  assert.equal(chordStep(1000, key("Meta", { metaKey: true }), 1500, mac), "keep");
  assert.equal(chordStep(1000, key("x"), 1500, mac), "none");
  assert.equal(chordStep(1000, key("f", { metaKey: true }), 1000 + CHORD_MS + 1, mac), "none");
  assert.equal(chordStep(null, key("f", { metaKey: true }), 1500, mac), "none");
  // På Mac är Ctrl+K "radera radens rest" och lämnas orört; AltGr skriver tecken.
  assert.equal(chordStep(null, key("k", { ctrlKey: true }), 1000, mac), "none");
  assert.equal(chordStep(null, key("k", { ctrlKey: true }), 1000, false), "start");
  assert.equal(chordStep(null, key("k", { ctrlKey: true, altKey: true }), 1000, false), "none");
  assert.equal(chordStep(null, key("K", { metaKey: true, shiftKey: true }), 1000, mac), "start");
});

test("⌘A känns igen som markera allt, Ctrl+A på Mac gör det inte", () => {
  const key = (k, mods = {}) => ({ key: k, metaKey: false, ctrlKey: false, altKey: false, ...mods });
  assert.equal(isSelectAll(key("a", { metaKey: true }), true), true);
  assert.equal(isSelectAll(key("A", { metaKey: true }), true), true);
  assert.equal(isSelectAll(key("a", { ctrlKey: true }), true), false);
  assert.equal(isSelectAll(key("a", { ctrlKey: true }), false), true);
  assert.equal(isSelectAll(key("a", { metaKey: true }), false), false);
});
