// Rättaren för fliken Java i Databaser (tentans Java/JDBC-uppgift). Java
// körs inte i webbläsaren, så svaret läses i stället: en egen tolk för den
// delmängd av Java som en DAO-metod använder (deklarationer, try med
// resurser, if och while, return, anrop och uttryck) och en egen tolk för
// SQL-satsen i strängen. Varje regel rättas för sig och får ett "varför" i
// DDL-rättarens stil.
//
// Allt uppgiftsspecifikt står i uppgiftens `check` (se huvudet i
// data/databaser/javaTasks.js): satstyp, tabell, villkor, parametrar och
// deras set-metoder, kolumner och get-metoder, returform. Här finns ingen
// kod för någon enskild uppgift. Två tillägg till schemat:
//   sql.selectOnly: true — uppgiftstexten kräver att frågan bara hämtar
//     kolumnerna i sql.select; SELECT * och fler kolumner underkänns då i
//     stället för att få en kommentar.
//   Tabellens kolumner läses ur uppgiftens CREATE TABLE (ett sql-kodblock i
//     task.blocks), så att en kolumn som finns i tabellen inte tas för ett
//     stavfel och en som inte finns kan pekas ut. Utan blocket gissar
//     rättaren utifrån kolumnerna i check.
//
// Tolerans: lokala variabler får heta vad som helst. SQL-strängen får vara
// delad i flera literaler med valfria radbrytningar, stå i en variabel eller
// direkt i prepareStatement("…") och sluta med eller utan semikolon. SQL-ord
// och namn läses utan hänsyn till skiftläge, [hakparenteser] och dbo.;
// villkorens ordning är fri, och varje ? följs till sin kolumn i svarets egen
// SQL, så att set-anropen rättas i svarets egen ordning. Parametrar som heter
// något annat än i uppgiften följs på sin plats i signaturen (med en
// kommentar). ResultSet får öppnas i samma try-parentes eller i ett inre try.
// Objekten får byggas med konstruktorn eller med set-metoder, också i en
// hjälpmetod som föreläsningens mapToEmployee (med en kommentar: uppgiften
// ber om bara metoden). Raderna får läsas med while (rs.next()), for (;
// rs.next(); ) eller do { … } while (rs.next()) efter ett if som redan har
// flyttat markören; en findBy får läsa i if (rs.next()), efter if
// (!rs.next()) return null; eller med rs.next() ? … : null. COUNT(*) får
// läsas med alias eller getInt(1); för ja eller nej räknas jämförelsen ut
// för 0 och 1, så count > 0, 0 < count, count >= 1 och count != 0 godtas.
// Kommentarer ignoreras. Extra kolumner sist i ORDER BY
// godtas: de avgör bara ordningen mellan rader som annars är lika. SET
// Salary += ? läses som SET Salary = Salary + ?.

export const JAVA_RULES = [
  { id: 1, key: "signature", title: "Signaturen" },
  { id: 2, key: "sql", title: "SQL-satsen" },
  { id: 3, key: "injection", title: "Ingen SQL-injektion" },
  { id: 4, key: "prepare", title: "PreparedStatement" },
  { id: 5, key: "binds", title: "Set-anropen" },
  { id: 6, key: "execute", title: "Exekveringen" },
  { id: 7, key: "resources", title: "Resurserna stängs" },
  { id: 8, key: "resultset", title: "ResultSet" },
  { id: 9, key: "return", title: "Returvärdet" },
  { id: 10, key: "exceptions", title: "Undantag" },
];

const WHY = {
  signature: "Signaturen är given i uppgiften och skrivs av exakt: namn, returtyp, parametrarnas typer i samma ordning och throws SQLException. Den som anropar metoden räknar med just den.",
  paramNames: "Signaturen är given i uppgiften; skriv av den exakt, också parameternamnen, så att svaret går att läsa mot uppgiftstexten.",
  throws: "JDBC-metoderna kastar SQLException. Med throws SQLException i signaturen går felet vidare till den som anropar; utan den kompilerar metoden inte, om inte felet fångas.",
  static: "Metoden är en instansmetod: den använder instansvariabeln connectionHandler, som en static-metod inte kommer åt.",
  sql: "Frågan ska göra exakt det uppgiften beskriver: rätt sats, rätt tabell och samma villkor — inte fler, inte färre.",
  kind: "DELETE tar bort rader, UPDATE ändrar dem, INSERT lägger till en rad och SELECT hämtar rader. Satsen avgör vad metoden gör med tabellen.",
  space: "Strängarna slås ihop tecken för tecken. Utan blanksteg i skarven flyter två ord ihop, och SQL Server ser ett enda okänt namn.",
  noWhere: "Utan WHERE gäller satsen varje rad i tabellen.",
  or: "OR räcker med att ett av villkoren stämmer. Uppgiften kräver att alla gäller samtidigt, och det är AND.",
  param: "Villkoret ska jämföra med metodens parameter, så att metoden fungerar för vilket värde anroparen än skickar in. Ett fast värde i frågan gör metoden till en metod för just det värdet.",
  extraCond: "Ett villkor som inte står i uppgiften utesluter rader som metoden ska påverka.",
  selectStar: "SELECT * fungerar, men skriv ut kolumnerna: då syns vilka kolumner metoden läser, och frågan hämtar inget som inte används.",
  selectExtra: "Hämta bara kolumnerna metoden använder: då syns vad metoden läser, och inget onödigt skickas över nätet.",
  selectMissing: "En kolumn som inte står i SELECT-listan finns inte i ResultSet, och get-metoden för den kastar SQLException.",
  selectOnly: "Uppgiften säger vilka kolumner frågan ska hämta: de som motsvaras av en instansvariabel i klassen. En kolumn som ingen instansvariabel tar emot används aldrig och ska inte hämtas.",
  noColumn: "SQL Server känner bara igen kolumner som finns i tabellen. Ett namn som inte finns ger ett fel när frågan körs, och executeQuery kastar SQLException.",
  count: "COUNT(*) räknar raderna i databasen och skickar tillbaka ett enda tal. Att hämta raderna och räkna i Java flyttar hela resultatet över nätet i onödan.",
  countCol: "COUNT(kolumn) räknar bara rader där kolumnen inte är NULL; COUNT(*) räknar alla rader.",
  orderBy: "En tabell har ingen ordning i sig. Bara ORDER BY garanterar i vilken ordning raderna kommer; ASC är stigande och standard, DESC fallande.",
  insertCols: "Med kolumnlistan bestämmer du vilket värde som hamnar i vilken kolumn. Surrogatnyckeln står inte med: IDENTITY fyller i den, och programmet nämner den aldrig.",
  setExpr: "SET-uttrycket räknar fram det nya värdet för varje rad som WHERE väljer ut. Det ska ge samma värde som uppgiften beskriver.",
  intDiv: "Heltal delat med heltal är ett heltal, i Java och i SQL Server: 5 / 100 blir 0. Med 100.0 i uttrycket, eller ett värde som binds med setDouble, blir divisionen exakt.",
  injection: "Ett värde som klistras in i SQL-texten blir en del av frågan: inmatningen x' OR '1'='1 lägger till ett eget villkor med OR. Med ? och set-anrop skickas värdet som ett värde, aldrig som SQL, och inmatningen kan inte ändra frågan.",
  qCount: "Varje ? måste få exakt ett värde innan frågan körs, annars kastar drivrutinen ett SQLException. Lika många set-anrop som frågetecken, ett nummer per frågetecken.",
  prepare: "Bara ett PreparedStatement har platshållare. Det skapas av anslutningen med connection.prepareStatement(sql); frågan förkompileras och värdena sätts efteråt.",
  statement: "Ett vanligt Statement har inga platshållare: värdena måste då klistras in i SQL-texten, och det är just det som öppnar för SQL-injektion.",
  connection: "Uppgiften ger anslutningen: connectionHandler.getConnection() returnerar en giltig Connection, och PreparedStatement skapas av den.",
  binds: "Varje ? får sitt värde med set-metoden för värdets typ, och numret anger vilket ? det gäller, räknat i den ordning frågetecknen står i frågan.",
  zero: "Platshållarna numreras från 1, inte 0 som index i en Java-lista.",
  order: "Numret i set-anropet pekar ut ett frågetecken i frågan. Byter två värden plats jämförs varje kolumn med fel värde.",
  setType: "Set-metoden följer värdets typ i Java: setString för String, setInt för int, setDouble för double.",
  setObject: "setObject fungerar, men kursen binder med set-metoden för typen — setString, setInt, setDouble — och då syns typen i koden.",
  execute: "executeUpdate() kör INSERT, UPDATE och DELETE och returnerar antalet påverkade rader. executeQuery() kör SELECT och returnerar ett ResultSet.",
  executeArg: "Frågan gavs redan till prepareStatement. executeUpdate(sql) och executeQuery(sql) med en sträng hör till det vanliga Statement; på ett PreparedStatement kastar de SQLException.",
  executeOrder: "Värdena måste vara satta när frågan körs. Ett set-anrop efter executeQuery eller executeUpdate kommer för sent.",
  affected: "Uppgiften ber om antalet rader satsen påverkade, och det är precis vad executeUpdate() returnerar.",
  twice: "Varje anrop kör satsen på nytt i databasen.",
  twiceDelete: "Varje anrop kör satsen på nytt. Andra gången finns inget kvar att ta bort, och executeUpdate() returnerar 0.",
  resources: "Connection, PreparedStatement och ResultSet binder resurser i programmet och på servern. Try-with-resources stänger dem automatiskt när blocket tar slut, också när ett Exception kastas.",
  inlineConn: "Bara det som står som en egen variabel i try-parentesen stängs automatiskt. En anslutning som bara används för att skapa PreparedStatement stängs aldrig.",
  finally: "close() i finally stänger också vid fel, men try-with-resources är kursens form: kortare, och inget kan glömmas.",
  closeNotFinally: "Ett close()-anrop i blocket körs aldrig om en rad före det kastar ett Exception, och då förblir resursen öppen.",
  rsResource: "Kursen och lösningsförslaget stänger varje resurs som metoden öppnar uttryckligen, också ResultSet: den öppnas i ett eget, inre try-with-resources efter set-anropen. JDBC stänger visserligen ResultSet när dess PreparedStatement stängs, men svaret rättas efter kursens form.",
  cursor: "Markören står före första raden. while (resultSet.next()) läser alla rader; if (resultSet.next()) läser en, vilket är rätt när frågan kan ge högst en.",
  getters: "Varje kolumn läses med get-metoden för sin typ och med sitt kolumnnamn. Med namn spelar ordningen i SELECT ingen roll, och ett felaktigt index märks först när koden körs.",
  getterType: "Get-metoden följer kolumnens typ och instansvariabelns typ: getString för VARCHAR, getInt för INT, getDouble för DECIMAL när variabeln är en double.",
  ctorOrder: "Konstruktorns argument tilldelas i parameterordning. Två värden av samma typ i fel ordning kompilerar, men hamnar i fel instansvariabel.",
  fields: "Samtliga instansvariabler ska få värden från motsvarande kolumner i raden.",
  model: "Varje rad ska bli ett objekt av modellklassen, så att den som anropar får objekt och inte ett ResultSet.",
  add: "Ett objekt som skapas i loopen men aldrig läggs i listan försvinner när varvet tar slut.",
  inLoop: "Det som ska hända för varje rad står inne i loopen; det som står utanför händer en gång.",
  helper: "Uppgiften säger: skriv endast den efterfrågade metoden, inklusive metodsignatur och metodkropp. En hjälpmetod som föreläsningens mapToEmployee är en metod till. Gör om raden till ett objekt i själva metoden, som i lösningsförslaget.",
  helperThrows: "Get-metoderna på ResultSet kastar SQLException, så hjälpmetoden måste deklarera throws SQLException för att kompilera.",
  list: "Listan skapas före loopen, så att den finns och är tom även när frågan inte ger några rader. Då returnerar metoden en tom lista, aldrig null.",
  listType: "Variabeln ska ha samma typ som metodens returtyp. En List går inte att returnera som en ArrayList utan typomvandling, och då kompilerar metoden inte.",
  single: "En findBy-metod som inte hittar något returnerar null; den som anropar kontrollerar det. Ett tomt objekt ser ut som en träff.",
  scalar: "COUNT(*) ger alltid exakt en rad med ett tal. Läs det med get-metoden, med aliaset eller med getInt(1), och returnera det.",
  exists: "Metoden svarar ja eller nej: true när minst en rad uppfyller villkoret, annars false.",
  existsCount: "COUNT(*) ger alltid en rad, också när antalet är 0. resultSet.next() är därför alltid true; det är talet i raden som avgör.",
  missingReturn: "En metod med returtyp måste returnera ett värde på varje väg genom koden, annars kompilerar den inte.",
  voidReturn: "En void-metod returnerar inget. return med ett värde i en void-metod kompilerar inte; executeUpdate() anropas som en egen sats.",
  notCounted: "Frågan räknar inte med COUNT(*) (se regel 2). Med COUNT(*) kommer en enda rad med talet, och det läses med getInt.",
  returnType: "Det som returneras måste ha metodens returtyp, och en variabel måste vara deklarerad innan den används — annars kompilerar metoden inte.",
  scope: "En lokal variabel finns bara i blocket där den deklareras, från deklarationen till blockets }. Efter } känner kompilatorn inte igen namnet, och metoden kompilerar inte.",
  exceptions: "Signaturen säger throws SQLException: felet ska nå den som anropar. Ett catch-block som inte kastar vidare gömmer felet, och metoden returnerar ett värde som ser riktigt ut fast inget hände.",
  rethrow: "Catch-blocket kastar vidare, så felet når anroparen. Men signaturen säger redan throws SQLException, så blocket behövs inte — utan det gör metoden samma sak med mindre kod.",
};

// ---------- Små hjälpare ----------

const MARK = "\u0001";
const fold = (s) => String(s ?? "").replace(/[[\]"`]/g, "").toLowerCase();
const isOp = (tok, v) => tok?.t === "op" && tok.v === v;
const isId = (tok, v) => tok?.t === "id" && tok.v === v;
const simple = (name) => String(name ?? "").split(".").pop();
// Typer jämförs utan blanksteg och paketprefix: java.util.ArrayList<Product> = ArrayList<Product>.
const normType = (t) => String(t ?? "").replace(/\s+/g, "").replace(/\b[a-z]\w*\./g, "");
const listJoin = (xs) => (xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} och ${xs[xs.length - 1]}`);
const ordinal = (n) => ["", "första", "andra", "tredje", "fjärde", "femte", "sjätte", "sjunde", "åttonde", "nionde", "tionde"][n] ?? `${n}:e`;
const shorten = (s, max = 70) => (s.length > max ? `${s.slice(0, max - 1)}…` : s);

const KEYWORDS = new Set(["abstract", "assert", "boolean", "break", "byte", "case", "catch", "char", "class", "const", "continue", "default", "do", "double", "else", "enum", "extends", "final", "finally", "float", "for", "goto", "if", "implements", "import", "instanceof", "int", "interface", "long", "native", "new", "package", "private", "protected", "public", "return", "short", "static", "strictfp", "super", "switch", "synchronized", "this", "throw", "throws", "transient", "try", "void", "volatile", "while", "true", "false", "null"]);
const PRIMITIVES = new Set(["int", "double", "boolean", "long", "float", "short", "byte", "char", "void"]);
const MODIFIERS = new Set(["public", "private", "protected", "static", "final", "abstract", "synchronized", "native", "transient", "volatile", "strictfp", "default"]);
// Ord som kan stå före ett namn utan att vara en typ.
const NOT_TYPE = new Set([...KEYWORDS].filter((k) => !PRIMITIVES.has(k)));

// Stavfel: Levenshtein-avstånd, och närmaste kända namn inom två tecken.
function distance(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  }
  return d[a.length][b.length];
}
function closest(word, candidates) {
  let best = null;
  let bestD = Infinity;
  for (const c of candidates) {
    if (c === word) return null;
    const dd = distance(word.toLowerCase(), c.toLowerCase());
    if (dd < bestD) { bestD = dd; best = c; }
  }
  return best && bestD <= (word.length <= 4 ? 1 : 2) ? best : null;
}
const KNOWN_TYPES = ["int", "double", "boolean", "long", "float", "short", "byte", "char", "void", "var", "String", "Object", "Integer", "Double", "Long", "Boolean", "Math", "System", "BigDecimal", "StringBuilder", "Connection", "PreparedStatement", "Statement", "CallableStatement", "ResultSet", "SQLException", "Exception", "RuntimeException", "Throwable", "NumberFormatException", "DriverManager", "ArrayList", "List", "LinkedList", "Collection", "Collections", "Map", "HashMap", "Set", "HashSet", "ConnectionHandler", "DaoException"];
const typeWords = (t) => String(t ?? "").split(/[^A-Za-z0-9_$]+/).filter((w) => w && w !== "extends" && w !== "super");

// ---------- Java: tokenisering ----------

const JAVA_OPS = ["...", "->", "::", "++", "--", "&&", "||", "==", "!=", "<=", ">=", "+=", "-=", "*=", "/=", "%=", "&=", "|=", "^="];
const NUM_RE = /^(?:0[xX][0-9a-fA-F_]+|(?:\d[\d_]*(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)[fFdDlL]?/;

function decodeEscapes(s) {
  return s.replace(/\\(u+[0-9a-fA-F]{4}|[0-7]{1,3}|[\s\S])/g, (m, c) => {
    if (c[0] === "u") return String.fromCharCode(parseInt(c.replace(/^u+/, ""), 16));
    if (/^[0-7]/.test(c)) return String.fromCharCode(parseInt(c, 8));
    return { n: "\n", t: "\t", r: "\r", b: "\b", f: "\f", s: " " }[c] ?? c;
  });
}

function lexJava(src) {
  const tokens = [];
  const n = src.length;
  let i = 0;
  let line = 1;
  while (i < n) {
    const ch = src[i];
    if (ch === "\n") { line++; i++; continue; }
    if (/\s/.test(ch)) { i++; continue; }
    if (ch === "/" && src[i + 1] === "/") { while (i < n && src[i] !== "\n") i++; continue; }
    if (ch === "/" && src[i + 1] === "*") {
      const end = src.indexOf("*/", i + 2);
      if (end === -1) return { error: { line, message: `Rad ${line}: kommentaren /* stängs aldrig med */.` } };
      for (let k = i; k < end; k++) if (src[k] === "\n") line++;
      i = end + 2;
      continue;
    }
    if (src.startsWith('"""', i)) {
      const end = src.indexOf('"""', i + 3);
      if (end === -1) return { error: { line, message: `Rad ${line}: textblocket """ stängs aldrig.` } };
      const raw = src.slice(i + 3, end);
      tokens.push({ t: "str", v: decodeEscapes(raw.replace(/^[^\n]*\n/, "")), line });
      for (const c of raw) if (c === "\n") line++;
      i = end + 3;
      continue;
    }
    if (ch === '"' || ch === "'") {
      let j = i + 1;
      let raw = "";
      while (j < n && src[j] !== ch && src[j] !== "\n") {
        if (src[j] === "\\" && j + 1 < n && src[j + 1] !== "\n") { raw += src[j] + src[j + 1]; j += 2; } else raw += src[j++];
      }
      if (src[j] !== ch) {
        return { error: { line, message: ch === '"'
          ? `Rad ${line}: strängen stängs aldrig — ett " saknas. En SQL-sats över flera rader skrivs som flera strängar med + emellan.`
          : `Rad ${line}: tecknet ' stängs aldrig. Strängar i Java skrivs med ", inte '.` } };
      }
      tokens.push({ t: ch === '"' ? "str" : "char", v: decodeEscapes(raw), line });
      i = j + 1;
      continue;
    }
    const rest = src.slice(i, i + 256);
    if (/^\d/.test(rest) || /^\.\d/.test(rest)) {
      const m = NUM_RE.exec(rest);
      tokens.push({ t: "num", v: m[0], line });
      i += m[0].length;
      continue;
    }
    const word = /^[\p{L}_$][\p{L}\p{N}_$]*/u.exec(rest);
    if (word) { tokens.push({ t: "id", v: word[0], line }); i += word[0].length; continue; }
    const op = JAVA_OPS.find((o) => src.startsWith(o, i)) ?? ch;
    tokens.push({ t: "op", v: op, line });
    i += op.length;
  }
  tokens.forEach((t, k) => { t.pos = k; });
  return { tokens };
}

// Parenteser och klamrar måste gå jämnt ut; varje öppnande tecken får sin partner i .match.
function checkBalance(tokens) {
  const close = { "(": ")", "{": "}", "[": "]" };
  const open = { ")": "(", "}": "{", "]": "[" };
  const stack = [];
  for (const tok of tokens) {
    if (tok.t !== "op") continue;
    if (close[tok.v]) { stack.push(tok); continue; }
    if (!open[tok.v]) continue;
    const top = stack.pop();
    if (!top) return { line: tok.line, message: `Rad ${tok.line}: ${tok.v} stänger något som aldrig öppnades.` };
    if (top.v !== open[tok.v]) return { line: tok.line, message: `Rad ${tok.line}: ${tok.v} stänger ${top.v} från rad ${top.line} — ett ${close[top.v]} saknas före.` };
    top.match = tok.pos;
    tok.match = top.pos;
  }
  if (stack.length) {
    const top = stack[stack.length - 1];
    return { line: top.line, message: `Rad ${top.line}: ${top.v} stängs aldrig — ett ${close[top.v]} saknas.` };
  }
  return null;
}

function typeText(ts) {
  let out = "";
  ts.forEach((t, k) => {
    const prev = ts[k - 1];
    if (prev && (prev.t === "id" || isOp(prev, "?")) && t.t === "id") out += " ";
    out += t.v;
    if (isOp(t, ",")) out += " ";
  });
  return out;
}

// Metoddeklarationer: [modifierare] typ namn ( parametrar ) [throws …] {
function findMethods(tokens) {
  const methods = [];
  for (let i = 1; i < tokens.length; i++) {
    const tok = tokens[i];
    if (tok.t !== "id" || KEYWORDS.has(tok.v)) continue;
    const open = tokens[i + 1];
    if (!isOp(open, "(") || open.match == null) continue;
    const prev = tokens[i - 1];
    if (!((prev.t === "id" && !NOT_TYPE.has(prev.v)) || isOp(prev, ">") || isOp(prev, "]"))) continue;
    let k = open.match + 1;
    const throwsList = [];
    if (isId(tokens[k], "throws")) {
      k++;
      while (k < tokens.length && !isOp(tokens[k], "{") && !isOp(tokens[k], ";")) {
        if (tokens[k].t === "id" && !isOp(tokens[k + 1], ".")) throwsList.push(tokens[k].v);
        k++;
      }
    }
    if (!isOp(tokens[k], "{") || tokens[k].match == null) continue;
    let s = i - 1;
    while (isOp(tokens[s], "]") && isOp(tokens[s - 1], "[")) s -= 2;
    if (isOp(tokens[s], ">")) {
      let depth = 0;
      for (; s >= 0; s--) {
        if (isOp(tokens[s], ">")) depth++;
        else if (isOp(tokens[s], "<") && --depth === 0) break;
      }
      s--;
    }
    if (tokens[s]?.t !== "id") continue;
    while (isOp(tokens[s - 1], ".") && tokens[s - 2]?.t === "id") s -= 2;
    const modifiers = [];
    let m = s - 1;
    while (m >= 0) {
      if (tokens[m].t === "id" && MODIFIERS.has(tokens[m].v)) { modifiers.unshift(tokens[m].v); m--; continue; }
      if (tokens[m].t === "id" && isOp(tokens[m - 1], "@")) { m -= 2; continue; }
      break;
    }
    // Ett ord före modifierarna som inte är ett Java-ord, t.ex. "pubic int …".
    const junk = tokens[m]?.t === "id" && !KEYWORDS.has(tokens[m].v) && (m === 0 || isOp(tokens[m - 1], ";") || isOp(tokens[m - 1], "}") || isOp(tokens[m - 1], "{")) ? tokens[m] : null;
    const groups = [];
    let cur = [];
    let depth = 0;
    for (let q = open.pos + 1; q < open.match; q++) {
      const t = tokens[q];
      if (isOp(t, "<")) depth++;
      else if (isOp(t, ">")) depth--;
      if (depth === 0 && isOp(t, ",")) { groups.push(cur); cur = []; continue; }
      cur.push(t);
    }
    if (cur.length) groups.push(cur);
    const params = groups.map((g) => {
      const ts = g.filter((t, q) => !isId(t, "final") && !isOp(t, "@") && !isOp(g[q - 1], "@"));
      const nameTok = ts[ts.length - 1];
      return { name: nameTok?.v ?? "", type: typeText(ts.slice(0, -1)), line: nameTok?.line };
    });
    methods.push({
      name: tok.v, line: tok.line, nameTok: tok, returnType: typeText(tokens.slice(s, i)),
      modifiers, params, throws: throwsList, open: tokens[k].pos, close: tokens[k].match, junk,
    });
  }
  return methods;
}

// ---------- Java: tolkning av metodkroppen ----------

class ParseError extends Error {
  constructor(tok, message) { super(message); this.tok = tok; }
}

const ASSIGN_OPS = new Set(["=", "+=", "-=", "*=", "/=", "%=", "&=", "|=", "^="]);
const BINARY = [["||"], ["&&"], ["|"], ["^"], ["&"], ["==", "!="], ["<", ">", "<=", ">=", "instanceof"], ["+", "-"], ["*", "/", "%"]];

function parseBody(tokens, open, close, errors) {
  let p = open;
  const end = close + 1;
  const peek = (k = 0) => (p + k < end ? tokens[p + k] : null);
  const next = () => (p < end ? tokens[p++] : null);
  const lineOf = (tok) => tok?.line ?? tokens[Math.min(p, end) - 1]?.line ?? 1;
  const show = (tok) => (!tok ? "slutet av metoden" : tok.t === "str" ? `strängen "${shorten(tok.v, 30)}"` : `"${tok.v}"`);
  const fail = (tok, message) => { throw new ParseError(tok, message); };
  const expectOp = (v, context) => {
    const tok = peek();
    if (!isOp(tok, v)) fail(tok, `Rad ${lineOf(tok)}: väntade "${v}"${context ? ` ${context}` : ""}, fick ${show(tok)}.`);
    return next();
  };
  // Ett saknat semikolon noteras, och tolkningen fortsätter som om det fanns.
  const expectSemi = () => {
    if (isOp(peek(), ";")) { next(); return; }
    const prev = tokens[p - 1];
    errors.push({ line: prev?.line, message: `Rad ${prev?.line}: semikolon saknas efter ${show(prev)}.` });
  };

  function parseType() {
    const tok = next();
    if (tok?.t !== "id") fail(tok, `Rad ${lineOf(tok)}: väntade en typ, fick ${show(tok)}.`);
    let s = tok.v;
    while (isOp(peek(), ".") && peek(1)?.t === "id") { next(); s += `.${next().v}`; }
    if (isOp(peek(), "<")) s += parseTypeArgs();
    while (isOp(peek(), "[") && isOp(peek(1), "]")) { next(); next(); s += "[]"; }
    if (isOp(peek(), "...")) { next(); s += "..."; }
    return s;
  }
  function parseTypeArgs() {
    expectOp("<");
    if (isOp(peek(), ">")) { next(); return "<>"; }
    const parts = [];
    for (;;) {
      if (isOp(peek(), "?")) {
        next();
        let s = "?";
        if (isId(peek(), "extends") || isId(peek(), "super")) s += ` ${next().v} ${parseType()}`;
        parts.push(s);
      } else parts.push(parseType());
      if (isOp(peek(), ",")) { next(); continue; }
      expectOp(">", "efter typargumenten");
      return `<${parts.join(", ")}>`;
    }
  }
  function looksLikeDecl() {
    const save = p;
    try {
      while (isId(peek(), "final")) next();
      if (isOp(peek(), "@")) return true;
      const tok = peek();
      if (tok?.t !== "id" || NOT_TYPE.has(tok.v)) return false;
      parseType();
      const name = peek();
      if (name?.t !== "id" || KEYWORDS.has(name.v)) return false;
      const after = peek(1);
      return after?.t === "op" && ["=", ";", ",", ":", ")", "["].includes(after.v);
    } catch (e) {
      if (e instanceof ParseError) return false;
      throw e;
    } finally {
      p = save;
    }
  }
  function skipAnnotation() {
    next();
    if (peek()?.t === "id") next();
    while (isOp(peek(), ".") && peek(1)?.t === "id") { next(); next(); }
    if (isOp(peek(), "(")) p = peek().match + 1;
  }
  function parseLocalDecl(single) {
    const start = peek();
    while (isId(peek(), "final") || isOp(peek(), "@")) { if (isOp(peek(), "@")) skipAnnotation(); else next(); }
    const typeTok = peek();
    const type = parseType();
    const decls = [];
    for (;;) {
      const nameTok = next();
      if (nameTok?.t !== "id") fail(nameTok, `Rad ${lineOf(nameTok)}: väntade ett variabelnamn efter ${type}, fick ${show(nameTok)}.`);
      while (isOp(peek(), "[") && isOp(peek(1), "]")) { next(); next(); }
      let init = null;
      if (isOp(peek(), "=")) {
        next();
        if (isOp(peek(), "{")) { const b = next(); p = b.match + 1; init = { k: "opaque", pos: b.pos, line: b.line }; } else init = parseExpr();
      }
      decls.push({ name: nameTok.v, init, line: nameTok.line, pos: nameTok.pos });
      if (single || !isOp(peek(), ",")) break;
      next();
    }
    return { k: "var", type, typeLine: typeTok?.line, decls, pos: start.pos, line: start.line };
  }
  function parseBlock() {
    const open = expectOp("{");
    const stmts = parseStatements();
    expectOp("}");
    return { k: "block", stmts, pos: open.pos, end: open.match, line: open.line };
  }
  function recover() {
    let depth = 0;
    const start = p;
    while (p < end) {
      const tok = peek();
      if (depth <= 0 && isOp(tok, "}")) break;
      if (isOp(tok, "{")) {
        p = tok.match + 1;
        if (depth <= 0) {
          const nt = peek();
          if (nt?.t === "id" && ["catch", "finally", "else"].includes(nt.v)) continue;
          if (isOp(nt, ";")) next();
          break;
        }
        continue;
      }
      if (isOp(tok, "(") || isOp(tok, "[")) depth++;
      else if (isOp(tok, ")") || isOp(tok, "]")) depth--;
      else if (depth <= 0 && isOp(tok, ";")) { next(); break; }
      next();
    }
    if (p === start && p < end) p++;
  }
  function parseStatements() {
    const stmts = [];
    while (p < end && !isOp(peek(), "}")) {
      const start = p;
      try {
        stmts.push(parseStatement());
      } catch (e) {
        if (!(e instanceof ParseError)) throw e;
        errors.push({ line: e.tok?.line ?? tokens[start]?.line, message: e.message });
        p = start;
        recover();
      }
    }
    return stmts;
  }
  function parseParenExpr(what) {
    expectOp("(", `efter ${what}`);
    const e = parseExpr();
    expectOp(")", `efter villkoret i ${what}`);
    return e;
  }
  function parseStatement() {
    const tok = peek();
    if (isOp(tok, "{")) return parseBlock();
    if (isOp(tok, ";")) { next(); return { k: "empty", pos: tok.pos, line: tok.line }; }
    if (isOp(tok, "@")) { skipAnnotation(); return parseStatement(); }
    if (tok.t === "id") {
      if (isOp(peek(1), ":") && !KEYWORDS.has(tok.v)) { next(); next(); return parseStatement(); }
      switch (tok.v) {
        case "try": return parseTry();
        case "if": {
          next();
          const cond = parseParenExpr("if");
          const then = parseStatement();
          let other = null;
          if (isId(peek(), "else")) { next(); other = parseStatement(); }
          return { k: "if", cond, then, else: other, pos: tok.pos, line: tok.line };
        }
        case "while": {
          next();
          const cond = parseParenExpr("while");
          return { k: "while", cond, body: parseStatement(), pos: tok.pos, line: tok.line };
        }
        case "do": {
          next();
          const body = parseStatement();
          if (!isId(peek(), "while")) fail(peek(), `Rad ${lineOf(peek())}: do-blocket ska följas av while (…);.`);
          next();
          const cond = parseParenExpr("while");
          expectSemi();
          return { k: "do", cond, body, pos: tok.pos, line: tok.line };
        }
        case "for": return parseFor();
        case "return": {
          next();
          const expr = isOp(peek(), ";") || isOp(peek(), "}") ? null : parseExpr();
          expectSemi();
          return { k: "return", expr, pos: tok.pos, line: tok.line };
        }
        case "throw": {
          next();
          const expr = parseExpr();
          expectSemi();
          return { k: "throw", expr, pos: tok.pos, line: tok.line };
        }
        case "break": case "continue":
          next();
          if (peek()?.t === "id") next();
          expectSemi();
          return { k: tok.v, pos: tok.pos, line: tok.line };
        case "switch": case "synchronized": {
          next();
          if (isOp(peek(), "(")) p = peek().match + 1;
          if (isOp(peek(), "{")) p = peek().match + 1;
          return { k: "opaque", pos: tok.pos, line: tok.line };
        }
        case "else": fail(tok, `Rad ${tok.line}: else utan if före.`); break;
        case "catch": case "finally": fail(tok, `Rad ${tok.line}: ${tok.v} utan try före.`); break;
        default:
          if (looksLikeDecl()) { const s = parseLocalDecl(false); expectSemi(); return s; }
      }
    }
    if (isId(tok, "final") && looksLikeDecl()) { const s = parseLocalDecl(false); expectSemi(); return s; }
    const expr = parseExpr();
    expectSemi();
    return { k: "expr", expr, pos: tok.pos, line: tok.line };
  }
  function parseFor() {
    const tok = next();
    expectOp("(", "efter for");
    const init = [];
    let cond = null;
    const update = [];
    if (looksLikeDecl()) {
      const d = parseLocalDecl(false);
      if (isOp(peek(), ":")) {
        next();
        const iter = parseExpr();
        expectOp(")", "efter for");
        d.decls[0].init = null;
        return { k: "for", init: [d], cond: iter, update: [], body: parseStatement(), pos: tok.pos, line: tok.line };
      }
      init.push(d);
    } else if (!isOp(peek(), ";")) {
      do { const e = parseExpr(); init.push({ k: "expr", expr: e, pos: e.pos, line: e.line }); } while (isOp(peek(), ",") && next());
    }
    expectOp(";", "i for-huvudet");
    if (!isOp(peek(), ";")) cond = parseExpr();
    expectOp(";", "i for-huvudet");
    if (!isOp(peek(), ")")) { do { update.push(parseExpr()); } while (isOp(peek(), ",") && next()); }
    expectOp(")", "efter for-huvudet");
    return { k: "for", init, cond, update, body: parseStatement(), pos: tok.pos, line: tok.line };
  }
  function parseTry() {
    const tok = next();
    const resources = [];
    if (isOp(peek(), "(")) {
      next();
      while (!isOp(peek(), ")")) {
        if (looksLikeDecl()) {
          const r = parseLocalDecl(true);
          r.resource = true;
          resources.push(r);
        } else {
          const e = parseExpr();
          resources.push({ k: "expr", expr: e, pos: e.pos, line: e.line });
        }
        if (isOp(peek(), ";")) { next(); continue; }
        if (!isOp(peek(), ")")) fail(peek(), `Rad ${lineOf(peek())}: resurserna i try-parentesen skiljs åt med semikolon, fick ${show(peek())}.`);
      }
      next();
    }
    const block = parseBlock();
    const catches = [];
    while (isId(peek(), "catch")) {
      const ct = next();
      expectOp("(", "efter catch");
      while (isId(peek(), "final")) next();
      const types = [parseType()];
      while (isOp(peek(), "|")) { next(); types.push(parseType()); }
      const nameTok = next();
      if (nameTok?.t !== "id") fail(nameTok, `Rad ${lineOf(nameTok)}: catch-parentesen ska ha en typ och ett namn, till exempel catch (SQLException e).`);
      expectOp(")", "efter catch-parentesen");
      catches.push({ types, name: nameTok.v, block: parseBlock(), line: ct.line, pos: ct.pos });
    }
    let fin = null;
    if (isId(peek(), "finally")) { next(); fin = parseBlock(); }
    if (!resources.length && !catches.length && !fin) errors.push({ line: tok.line, message: `Rad ${tok.line}: try utan resurser, catch eller finally kompilerar inte.` });
    return { k: "try", resources, block, catches, fin, pos: tok.pos, line: tok.line };
  }

  // Uttryck.
  function parseExpr() { return parseAssign(); }
  function parseAssign() {
    const left = parseTernary();
    const tok = peek();
    if (tok?.t === "op" && ASSIGN_OPS.has(tok.v)) {
      next();
      const value = parseAssign();
      return { k: "assign", op: tok.v, target: left, value, pos: tok.pos, line: tok.line };
    }
    return left;
  }
  function parseTernary() {
    const test = parseBinary(0);
    if (!isOp(peek(), "?")) return test;
    next();
    const a = parseTernary();
    expectOp(":", "i villkorsuttrycket");
    const b = parseTernary();
    return { k: "cond", test, a, b, pos: test.pos, line: test.line };
  }
  function parseBinary(level) {
    if (level >= BINARY.length) return parseUnary();
    let left = parseBinary(level + 1);
    for (;;) {
      const tok = peek();
      const hit = tok && ((tok.t === "op" && BINARY[level].includes(tok.v)) || (isId(tok, "instanceof") && BINARY[level].includes("instanceof")));
      if (!hit) return left;
      next();
      const right = tok.v === "instanceof" ? { k: "type", name: parseType(), pos: tok.pos, line: tok.line } : parseBinary(level + 1);
      left = { k: "bin", op: tok.v, left, right, pos: tok.pos, line: tok.line };
    }
  }
  function looksLikeCast() {
    const save = p;
    try {
      next();
      const t = peek();
      if (t?.t !== "id" || NOT_TYPE.has(t.v)) return false;
      const prim = PRIMITIVES.has(t.v);
      parseType();
      if (!isOp(peek(), ")")) return false;
      next();
      const after = peek();
      if (!after) return false;
      if (prim) return true;
      return ["id", "str", "num", "char"].includes(after.t) || isOp(after, "(") || isOp(after, "!") || isOp(after, "~");
    } catch (e) {
      if (e instanceof ParseError) return false;
      throw e;
    } finally {
      p = save;
    }
  }
  function parseUnary() {
    const tok = peek();
    if (tok?.t === "op" && ["+", "-", "!", "~", "++", "--"].includes(tok.v)) {
      next();
      return { k: "unary", op: tok.v, expr: parseUnary(), pos: tok.pos, line: tok.line };
    }
    if (isOp(tok, "(") && looksLikeCast()) {
      next();
      const type = parseType();
      expectOp(")");
      return { k: "cast", type, expr: parseUnary(), pos: tok.pos, line: tok.line };
    }
    return parsePostfix(parsePrimary());
  }
  function parseArgs() {
    expectOp("(");
    const args = [];
    if (!isOp(peek(), ")")) { do { args.push(parseExpr()); } while (isOp(peek(), ",") && next()); }
    expectOp(")", "efter argumenten");
    return args;
  }
  function skipLambdaBody() {
    if (isOp(peek(), "{")) p = peek().match + 1;
    else parseExpr();
  }
  function parsePrimary() {
    const tok = next();
    if (!tok) fail(tok, `Rad ${lineOf(tok)}: metoden tar slut mitt i ett uttryck.`);
    const at = { pos: tok.pos, line: tok.line };
    if (tok.t === "str") return { k: "lit", type: "String", value: tok.v, ...at };
    if (tok.t === "char") return { k: "lit", type: "char", value: tok.v, ...at };
    if (tok.t === "num") {
      const raw = tok.v.replace(/_/g, "");
      const isInt = /^(0[xX][0-9a-fA-F]+|\d+)[lL]?$/.test(raw);
      const value = isInt ? Number(raw.replace(/[lL]$/, "")) : parseFloat(raw);
      return { k: "lit", type: isInt ? "int" : "double", value, raw: tok.v, ...at };
    }
    if (tok.t === "id") {
      if (tok.v === "true" || tok.v === "false") return { k: "lit", type: "boolean", value: tok.v === "true", ...at };
      if (tok.v === "null") return { k: "lit", type: "null", value: null, ...at };
      if (tok.v === "new") return parseNew(tok);
      if (isOp(peek(), "->")) { next(); skipLambdaBody(); return { k: "opaque", ...at }; }
      if (isOp(peek(), "(")) return { k: "call", target: null, name: tok.v, args: parseArgs(), ...at };
      return { k: "name", name: tok.v, ...at };
    }
    if (isOp(tok, "(")) {
      if (isOp(tokens[tok.match + 1], "->")) { p = tok.match + 2; skipLambdaBody(); return { k: "opaque", ...at }; }
      const e = parseExpr();
      expectOp(")", "efter uttrycket");
      e.paren = true;
      return e;
    }
    fail(tok, `Rad ${tok.line}: väntade ett uttryck, fick ${show(tok)}.`);
    return null;
  }
  function parseNew(tok) {
    const t = next();
    if (t?.t !== "id") fail(t, `Rad ${lineOf(t)}: väntade en klass efter new, fick ${show(t)}.`);
    let type = t.v;
    while (isOp(peek(), ".") && peek(1)?.t === "id") { next(); type += `.${next().v}`; }
    if (isOp(peek(), "<")) type += parseTypeArgs();
    if (isOp(peek(), "[")) {
      while (isOp(peek(), "[")) p = peek().match + 1;
      if (isOp(peek(), "{")) p = peek().match + 1;
      return { k: "opaque", pos: tok.pos, line: tok.line };
    }
    if (!isOp(peek(), "(")) fail(peek(), `Rad ${lineOf(peek())}: new ${type} saknar parentesen med argumenten.`);
    const args = parseArgs();
    if (isOp(peek(), "{")) p = peek().match + 1;
    return { k: "new", type, args, pos: tok.pos, line: tok.line };
  }
  function parsePostfix(e) {
    for (;;) {
      const tok = peek();
      if (isOp(tok, ".")) {
        next();
        if (isOp(peek(), "<")) parseTypeArgs();
        const name = next();
        if (name?.t !== "id") fail(name, `Rad ${lineOf(name)}: väntade ett namn efter punkten, fick ${show(name)}.`);
        if (isOp(peek(), "(")) e = { k: "call", target: e, name: name.v, args: parseArgs(), pos: name.pos, line: name.line };
        else e = { k: "field", target: e, name: name.v, pos: name.pos, line: name.line };
        continue;
      }
      if (isOp(tok, "[")) {
        next();
        const index = parseExpr();
        expectOp("]");
        e = { k: "index", target: e, index, pos: tok.pos, line: tok.line };
        continue;
      }
      if (isOp(tok, "++") || isOp(tok, "--")) { next(); e = { k: "unary", op: tok.v, postfix: true, expr: e, pos: tok.pos, line: tok.line }; continue; }
      if (isOp(tok, "::")) { next(); next(); e = { k: "opaque", pos: tok.pos, line: tok.line }; continue; }
      return e;
    }
  }

  try {
    return parseBlock();
  } catch (e) {
    if (!(e instanceof ParseError)) throw e;
    errors.push({ line: e.tok?.line, message: e.message });
    return { k: "block", stmts: [], pos: open, line: tokens[open].line };
  }
}

// Java-uttryck tillbaka till text, för meddelandena.
function jsrc(e, max = 80) {
  const out = (x) => {
    if (!x) return "";
    let s;
    switch (x.k) {
      case "name": s = x.name; break;
      case "lit": s = x.type === "String" ? JSON.stringify(x.value) : x.type === "char" ? `'${x.value}'` : x.raw ?? String(x.value); break;
      case "call": s = `${x.target ? `${out(x.target)}.` : ""}${x.name}(${x.args.map(out).join(", ")})`; break;
      case "field": s = `${out(x.target)}.${x.name}`; break;
      case "new": s = `new ${x.type}(${x.args.length > 2 ? "…" : x.args.map(out).join(", ")})`; break;
      case "bin": s = `${out(x.left)} ${x.op} ${x.right?.k === "type" ? x.right.name : out(x.right)}`; break;
      case "unary": s = x.postfix ? `${out(x.expr)}${x.op}` : `${x.op}${out(x.expr)}`; break;
      case "cast": s = `(${x.type}) ${out(x.expr)}`; break;
      case "assign": s = `${out(x.target)} ${x.op} ${out(x.value)}`; break;
      case "cond": s = `${out(x.test)} ? ${out(x.a)} : ${out(x.b)}`; break;
      case "index": s = `${out(x.target)}[${out(x.index)}]`; break;
      default: s = "…";
    }
    return x.paren ? `(${s})` : s;
  };
  return shorten(out(e), max);
}

// ---------- Fakta ur en metodkropp ----------

function collect(body) {
  const F = { decls: [], assigns: [], calls: [], news: [], returns: [], catches: [], loops: [], throwStmts: [], resourceNames: [], tries: [], names: [] };
  const expr = (e, ctx) => {
    if (!e || typeof e !== "object") return;
    switch (e.k) {
      case "call": F.calls.push({ node: e, ctx, pos: e.pos }); expr(e.target, ctx); for (const a of e.args) expr(a, ctx); return;
      case "new": F.news.push({ node: e, ctx, pos: e.pos }); for (const a of e.args) expr(a, ctx); return;
      case "assign":
        if (e.target?.k === "name") F.assigns.push({ name: e.target.name, op: e.op, value: e.value, pos: e.pos, line: e.line, ctx });
        expr(e.target, ctx); expr(e.value, ctx); return;
      case "bin": expr(e.left, ctx); expr(e.right, ctx); return;
      case "unary": case "cast": expr(e.expr, ctx); return;
      case "cond": expr(e.test, ctx); expr(e.a, ctx); expr(e.b, ctx); return;
      case "field": expr(e.target, ctx); return;
      case "index": expr(e.target, ctx); expr(e.index, ctx); return;
      case "name": F.names.push({ node: e, ctx }); return;
      default:
    }
  };
  // end: platsen där blocket runt satsen stängs; en deklaration finns bara fram dit.
  const stmt = (s, ctx, end = Infinity) => {
    if (!s) return;
    const sub = (fr) => [...ctx, fr];
    switch (s.k) {
      case "block": for (const x of s.stmts) stmt(x, ctx, s.end ?? end); return;
      case "var":
        for (const d of s.decls) {
          F.decls.push({ name: d.name, type: s.type, init: d.init, pos: d.pos, line: d.line, ctx, resource: !!s.resource, end });
          expr(d.init, sub({ kind: "init", node: s, decl: d.name }));
        }
        return;
      case "expr": expr(s.expr, sub({ kind: "exprstmt", node: s })); return;
      case "return": F.returns.push({ expr: s.expr, pos: s.pos, line: s.line, ctx }); expr(s.expr, sub({ kind: "return", node: s })); return;
      case "throw": F.throwStmts.push({ node: s, ctx }); expr(s.expr, ctx); return;
      case "if":
        expr(s.cond, sub({ kind: "if", node: s, part: "cond" }));
        stmt(s.then, sub({ kind: "if", node: s, part: "then" }));
        stmt(s.else, sub({ kind: "if", node: s, part: "else" }));
        return;
      case "while": case "do":
        F.loops.push({ node: s, ctx });
        expr(s.cond, sub({ kind: "loop", node: s, part: "cond" }));
        stmt(s.body, sub({ kind: "loop", node: s, part: "body" }));
        return;
      case "for":
        F.loops.push({ node: s, ctx });
        for (const x of s.init) stmt(x, sub({ kind: "loop", node: s, part: "head" }), s.body?.end ?? end);
        expr(s.cond, sub({ kind: "loop", node: s, part: "cond" }));
        for (const u of s.update) expr(u, sub({ kind: "loop", node: s, part: "head" }));
        stmt(s.body, sub({ kind: "loop", node: s, part: "body" }));
        return;
      case "try": {
        F.tries.push({ node: s, ctx });
        const fr = sub({ kind: "try", node: s, part: "res" });
        for (const r of s.resources) {
          if (r.k === "var") {
            for (const d of r.decls) {
              F.decls.push({ name: d.name, type: r.type, init: d.init, pos: d.pos, line: d.line, ctx: fr, resource: true, end: s.block.end ?? end });
              expr(d.init, [...fr, { kind: "init", node: r, decl: d.name }]);
            }
          } else {
            if (r.expr?.k === "name") F.resourceNames.push({ name: r.expr.name, pos: r.expr.pos });
            expr(r.expr, fr);
          }
        }
        stmt(s.block, sub({ kind: "try", node: s, part: "block" }));
        for (const c of s.catches) {
          F.catches.push({ clause: c, tryNode: s, ctx });
          stmt(c.block, sub({ kind: "try", node: s, part: "catch", clause: c }));
        }
        if (s.fin) stmt(s.fin, sub({ kind: "try", node: s, part: "finally" }));
        return;
      }
      default:
    }
  };
  stmt(body, []);
  return F;
}

const inFinally = (ctx) => ctx.some((fr) => fr.kind === "try" && fr.part === "finally");
const innermost = (ctx) => ctx[ctx.length - 1];
const loopBodyOf = (ctx) => [...ctx].reverse().find((fr) => fr.kind === "loop" && fr.part === "body")?.node ?? null;
const inLoopBody = (ctx, loop) => ctx.some((fr) => fr.kind === "loop" && fr.part === "body" && fr.node === loop);
const inIfThen = (ctx, ifNode) => ctx.some((fr) => fr.kind === "if" && fr.part === "then" && fr.node === ifNode);
const targetName = (call) => (call.node.target?.k === "name" ? call.node.target.name : null);
const containsCall = (e, pred) => {
  if (!e || typeof e !== "object") return false;
  if (e.k === "call" && pred(e)) return true;
  return ["target", "left", "right", "expr", "test", "a", "b", "value", "index"].some((k) => containsCall(e[k], pred)) || (e.args ?? []).some((a) => containsCall(a, pred));
};

// Upplösning av lokala variabler: vilket uttryck har en variabel vid en viss plats?
function makeResolver(F, paramNames) {
  const declsOf = new Map();
  for (const d of F.decls) {
    if (!declsOf.has(d.name)) declsOf.set(d.name, []);
    declsOf.get(d.name).push(d);
  }
  const declBefore = (name, pos) => {
    let best = null;
    for (const d of declsOf.get(name) ?? []) if (d.pos <= pos && (!best || d.pos > best.pos)) best = d;
    return best;
  };
  // declBefore bryr sig inte om block (regel 8 och stavfelsförslagen bygger på det); inScope gör det:
  // en variabel som deklareras i ett block finns inte efter blockets }.
  const inScope = (name, pos) => (declsOf.get(name) ?? []).some((d) => d.pos <= pos && pos <= (d.end ?? Infinity));
  const assignsOf = (name) => F.assigns.filter((a) => a.name === name).sort((x, y) => x.pos - y.pos);
  const isParam = (name, pos) => paramNames.includes(name) && !declBefore(name, pos);
  const valueAt = (name, pos) => {
    const d = declBefore(name, pos);
    if (!d) return null;
    let best = d.init ? { expr: d.init, pos: d.pos } : null;
    for (const a of assignsOf(name)) if (a.op === "=" && a.pos > d.pos && a.pos < pos) best = { expr: a.value, pos: a.pos };
    return best;
  };
  // Alla värden en variabel någonsin får (initiering och tilldelningar).
  const allValues = (name) => [
    ...(declsOf.get(name) ?? []).filter((d) => d.init).map((d) => ({ expr: d.init, pos: d.pos, ctx: d.ctx })),
    ...assignsOf(name).filter((a) => a.op === "=").map((a) => ({ expr: a.value, pos: a.pos, ctx: a.ctx })),
  ];
  const resolve = (e, pos, depth = 0) => {
    if (e?.k === "name" && depth < 8 && !isParam(e.name, pos ?? e.pos)) {
      const v = valueAt(e.name, pos ?? e.pos);
      if (v && !(v.expr.k === "lit" && v.expr.type === "null")) return resolve(v.expr, v.pos, depth + 1);
    }
    if (e?.k === "cast") return resolve(e.expr, pos, depth + 1);
    return e;
  };
  // Vem håller värdet från just det här uttrycket? (decl eller tilldelning)
  const holderOf = (node) => {
    const d = F.decls.find((x) => x.init === node);
    if (d) return { name: d.name, decl: d, resource: d.resource };
    const a = F.assigns.find((x) => x.value === node && x.op === "=");
    if (a) return { name: a.name, decl: declBefore(a.name, a.pos), assign: a, resource: false };
    return null;
  };
  const isResource = (name) => F.decls.some((d) => d.name === name && d.resource) || F.resourceNames.some((r) => r.name === name);
  return { declBefore, inScope, valueAt, allValues, resolve, holderOf, isParam, isResource, assignsOf };
}

// ---------- SQL ----------

class SqlError extends Error {}

function lexSql(text) {
  const toks = [];
  const n = text.length;
  let i = 0;
  let q = 0;
  while (i < n) {
    const ch = text[i];
    if (/\s/.test(ch)) { i++; continue; }
    if (ch === "-" && text[i + 1] === "-") { while (i < n && text[i] !== "\n") i++; continue; }
    if (ch === MARK) {
      const end = text.indexOf(MARK, i + 1);
      toks.push({ t: "ph", concat: Number(text.slice(i + 1, end)) });
      i = end + 1;
      continue;
    }
    if (ch === "?") { toks.push({ t: "ph", q: ++q }); i++; continue; }
    if (ch === "'") {
      let j = i + 1;
      let s = "";
      for (;;) {
        if (j >= n) throw new SqlError("En textsträng i SQL:en stängs aldrig — ett ' saknas.");
        if (text[j] === "'" && text[j + 1] === "'") { s += "'"; j += 2; continue; }
        if (text[j] === "'") break;
        s += text[j++];
      }
      const m = new RegExp(`^${MARK}(\\d+)${MARK}$`).exec(s);
      toks.push(m ? { t: "ph", concat: Number(m[1]), quoted: true } : { t: "str", v: s });
      i = j + 1;
      continue;
    }
    if (ch === "[" || ch === '"') {
      const close = ch === "[" ? "]" : '"';
      const end = text.indexOf(close, i + 1);
      if (end === -1) throw new SqlError(`${ch} stängs aldrig i SQL:en.`);
      toks.push({ t: "id", v: text.slice(i + 1, end), quoted: true });
      i = end + 1;
      continue;
    }
    const rest = text.slice(i, i + 128);
    const word = /^[\p{L}_@#][\p{L}\p{N}_@#$]*/u.exec(rest);
    if (word) { toks.push({ t: "id", v: word[0] }); i += word[0].length; continue; }
    const num = /^\d+(\.\d+)?/.exec(rest);
    if (num) { toks.push({ t: "num", v: num[0] }); i += num[0].length; continue; }
    const two = text.slice(i, i + 2);
    if (["<=", ">=", "<>", "!="].includes(two)) { toks.push({ t: "op", v: two }); i += 2; continue; }
    toks.push({ t: "op", v: ch });
    i++;
  }
  return toks;
}

const SQL_RESERVED = new Set(["WHERE", "ORDER", "GROUP", "HAVING", "SET", "VALUES", "FROM", "INNER", "LEFT", "RIGHT", "FULL", "CROSS", "JOIN", "ON", "AND", "OR", "NOT", "AS", "BY", "ASC", "DESC", "SELECT", "INSERT", "UPDATE", "DELETE", "INTO", "TOP", "DISTINCT", "IS", "NULL", "LIKE", "IN", "BETWEEN", "OUTPUT", "UNION"]);
const CMP_OPS = ["=", "<", ">", "<=", ">=", "<>", "!="];

function sqlParser(toks) {
  let p = 0;
  const peek = (k = 0) => toks[p + k];
  const next = () => toks[p++];
  const KW = (tok, ...w) => tok?.t === "id" && !tok.quoted && w.includes(tok.v.toUpperCase());
  const OP = (tok, v) => tok?.t === "op" && tok.v === v;
  const show = (tok) => (!tok ? "slutet av satsen" : tok.t === "ph" ? "?" : tok.t === "str" ? `'${tok.v}'` : tok.v);
  const err = (msg) => { throw new SqlError(msg); };
  const expectKw = (w, after) => { const t = next(); if (!KW(t, w)) err(`Väntade ${w}${after ? ` efter ${after}` : ""}, fick ${show(t)}.`); };
  const expectOp = (v, after) => { const t = next(); if (!OP(t, v)) err(`Väntade "${v}"${after ? ` efter ${after}` : ""}, fick ${show(t)}.`); };
  const plainId = (t) => t?.t === "id" && (t.quoted || !SQL_RESERVED.has(t.v.toUpperCase()));
  const name = (what) => {
    const t = next();
    if (!plainId(t)) err(`Väntade ${what}, fick ${show(t)}.`);
    let v = t.v;
    while (OP(peek(), ".") && peek(1)?.t === "id") { next(); v = next().v; }
    return v;
  };
  const tableRef = () => {
    const table = name("ett tabellnamn");
    if (KW(peek(), "AS")) { next(); name("ett alias efter AS"); } else if (plainId(peek())) next();
    return table;
  };
  const atom = () => {
    const t = peek();
    if (!t) err("Satsen tar slut mitt i ett uttryck.");
    if (t.t === "num") { next(); return { k: "num", v: Number(t.v), int: !t.v.includes(".") }; }
    if (t.t === "str") { next(); return { k: "str", v: t.v }; }
    if (t.t === "ph") { next(); return { k: "ph", ph: t }; }
    if (OP(t, "(")) { next(); const e = add(); expectOp(")", "uttrycket"); return e; }
    if (OP(t, "*")) { next(); return { k: "star" }; }
    if (KW(t, "NULL")) { next(); return { k: "null" }; }
    if (plainId(t)) {
      next();
      if (OP(peek(), "(") && !t.quoted) {
        next();
        const args = [];
        if (!OP(peek(), ")")) { do { args.push(add()); } while (OP(peek(), ",") && next()); }
        expectOp(")", `${t.v}(…`);
        return { k: "func", name: t.v.toUpperCase(), args };
      }
      let v = t.v;
      while (OP(peek(), ".") && peek(1)?.t === "id") { next(); v = next().v; }
      return { k: "col", name: v };
    }
    err(`Väntade ett värde eller en kolumn, fick ${show(t)}.`);
    return null;
  };
  const unary = () => (OP(peek(), "-") ? (next(), { k: "neg", e: unary() }) : atom());
  const mul = () => {
    let l = unary();
    while (OP(peek(), "*") || OP(peek(), "/") || OP(peek(), "%")) { const op = next().v; l = { k: "bin", op, l, r: unary() }; }
    return l;
  };
  const add = () => {
    let l = mul();
    while (OP(peek(), "+") || OP(peek(), "-")) { const op = next().v; l = { k: "bin", op, l, r: mul() }; }
    return l;
  };
  const predicate = () => {
    const left = add();
    const t = peek();
    if (t?.t === "op" && CMP_OPS.includes(t.v)) { next(); return { k: "cmp", left, op: t.v, right: add() }; }
    if (KW(t, "IS")) { next(); if (KW(peek(), "NOT")) next(); expectKw("NULL", "IS"); return { k: "pred", what: "IS NULL", left }; }
    if (KW(t, "NOT")) next();
    if (KW(peek(), "LIKE")) { next(); return { k: "pred", what: "LIKE", left, right: add() }; }
    if (KW(peek(), "BETWEEN")) { next(); const a = add(); expectKw("AND", "BETWEEN"); return { k: "pred", what: "BETWEEN", left, a, b: add() }; }
    if (KW(peek(), "IN")) {
      next(); expectOp("(", "IN");
      const items = [];
      do { items.push(add()); } while (OP(peek(), ",") && next());
      expectOp(")", "IN-listan");
      return { k: "pred", what: "IN", left, items };
    }
    err(`Väntade en jämförelse (=, <, >, <=, >=) efter ${arithText(left)}, fick ${show(peek())}.`);
    return null;
  };
  const condAtom = () => {
    if (KW(peek(), "NOT")) { next(); return { k: "not", item: condAtom() }; }
    if (OP(peek(), "(")) {
      const save = p;
      try {
        next();
        const c = orCond();
        expectOp(")");
        if (!(peek()?.t === "op" && CMP_OPS.includes(peek().v))) return c;
      } catch (e) {
        if (!(e instanceof SqlError)) throw e;
      }
      p = save;
    }
    return predicate();
  };
  const andCond = () => {
    const items = [condAtom()];
    while (KW(peek(), "AND")) { next(); items.push(condAtom()); }
    return items.length === 1 ? items[0] : { k: "and", items };
  };
  const orCond = () => {
    const items = [andCond()];
    while (KW(peek(), "OR")) { next(); items.push(andCond()); }
    return items.length === 1 ? items[0] : { k: "or", items };
  };
  const selectItem = () => {
    if (OP(peek(), "*")) { next(); return { k: "star" }; }
    const e = add();
    let alias = null;
    if (KW(peek(), "AS")) {
      next();
      const t = next();
      if (!t || (t.t !== "id" && t.t !== "str")) err(`Väntade ett alias efter AS, fick ${show(t)}.`);
      alias = t.v;
    } else if (plainId(peek())) alias = next().v;
    if (e.k === "col") return { k: "col", name: e.name, alias };
    if (e.k === "func" && e.name === "COUNT") return { k: "count", star: e.args.length === 1 && e.args[0].k === "star", arg: e.args[0], alias };
    return { k: "expr", expr: e, alias };
  };

  function statement() {
    const out = { kind: null, table: null, top: null, select: null, where: null, orderBy: null, insertCols: null, values: null, sets: null };
    const first = peek();
    if (KW(first, "SELECT")) {
      next();
      out.kind = "SELECT";
      if (KW(peek(), "DISTINCT")) next();
      if (KW(peek(), "TOP")) { next(); if (OP(peek(), "(")) { next(); out.top = add(); expectOp(")", "TOP"); } else out.top = next(); }
      out.select = [];
      do { out.select.push(selectItem()); } while (OP(peek(), ",") && next());
      expectKw("FROM", "kolumnlistan");
      out.table = tableRef();
      if (KW(peek(), "INNER", "LEFT", "RIGHT", "FULL", "CROSS", "JOIN")) err("JOIN behövs inte här: uppgiften gäller en enda tabell.");
      if (KW(peek(), "WHERE")) { next(); out.where = orCond(); }
      if (KW(peek(), "GROUP")) err("GROUP BY behövs inte här.");
      if (KW(peek(), "ORDER")) {
        next();
        expectKw("BY", "ORDER");
        out.orderBy = [];
        do {
          const column = name("en kolumn att sortera på");
          let dir = "ASC";
          if (KW(peek(), "ASC", "DESC")) dir = next().v.toUpperCase();
          out.orderBy.push({ column, dir });
        } while (OP(peek(), ",") && next());
      }
    } else if (KW(first, "DELETE")) {
      next();
      out.kind = "DELETE";
      if (KW(peek(), "FROM")) next();
      out.table = tableRef();
      if (KW(peek(), "WHERE")) { next(); out.where = orCond(); }
    } else if (KW(first, "INSERT")) {
      next();
      out.kind = "INSERT";
      expectKw("INTO", "INSERT");
      out.table = name("ett tabellnamn");
      if (OP(peek(), "(")) {
        next();
        out.insertCols = [];
        do { out.insertCols.push(name("ett kolumnnamn")); } while (OP(peek(), ",") && next());
        expectOp(")", "kolumnlistan");
      }
      expectKw("VALUES", out.insertCols ? "kolumnlistan" : "tabellnamnet");
      expectOp("(", "VALUES");
      out.values = [];
      do { out.values.push(add()); } while (OP(peek(), ",") && next());
      expectOp(")", "värdena");
    } else if (KW(first, "UPDATE")) {
      next();
      out.kind = "UPDATE";
      out.table = tableRef();
      expectKw("SET", "tabellnamnet");
      out.sets = [];
      do {
        const column = name("en kolumn efter SET");
        // SQL Servers SET Salary += ? betyder SET Salary = Salary + ?.
        if (["+", "-", "*", "/"].some((o) => OP(peek(), o)) && OP(peek(1), "=")) {
          const op = next().v;
          next();
          out.sets.push({ column, expr: { k: "bin", op, l: { k: "col", name: column }, r: add() } });
          continue;
        }
        expectOp("=", `SET ${column}`);
        out.sets.push({ column, expr: add() });
      } while (OP(peek(), ",") && next());
      if (KW(peek(), "WHERE")) { next(); out.where = orCond(); }
    } else {
      err(`SQL-satsen ska börja med SELECT, INSERT, UPDATE eller DELETE, inte ${show(first)}.`);
    }
    if (OP(peek(), ";")) next();
    if (peek()) err(`Oväntat ${show(peek())} efter satsen.`);
    return out;
  }
  return { statement, add, done: () => p >= toks.length };
}

function parseSql(text) {
  const toks = lexSql(text);
  const out = sqlParser(toks).statement();
  out.qCount = toks.filter((t) => t.t === "ph" && t.q).length;
  return out;
}

// Ett fristående SQL-uttryck, t.ex. uppgiftens "Salary * (1 + ? / 100.0)".
function parseSqlExpr(text) {
  const parser = sqlParser(lexSql(text));
  const e = parser.add();
  if (!parser.done()) throw new SqlError(`Uttrycket ${text} går inte att tolka.`);
  return e;
}

function countQ(text) {
  try { return lexSql(text).filter((t) => t.t === "ph" && t.q).length; } catch { return (text.match(/\?/g) ?? []).length; }
}

function arithText(e) {
  if (!e) return "";
  switch (e.k) {
    case "col": return e.name;
    case "ph": return e.ph.concat != null ? `«värde ${e.ph.concat + 1}»` : "?";
    case "num": return String(e.v);
    case "str": return `'${e.v}'`;
    case "null": return "NULL";
    case "star": return "*";
    case "neg": return `-${arithText(e.e)}`;
    case "func": return `${e.name}(${e.args.map(arithText).join(", ")})`;
    case "bin": return `${arithText(e.l)} ${e.op} ${arithText(e.r)}`;
    default: return "…";
  }
}

const phNodes = (e) => {
  if (!e) return [];
  if (e.k === "ph") return [e.ph];
  if (e.k === "bin") return [...phNodes(e.l), ...phNodes(e.r)];
  if (e.k === "neg") return phNodes(e.e);
  if (e.k === "func") return e.args.flatMap(phNodes);
  return [];
};

function flattenWhere(cond) {
  const out = { cmps: [], or: false, not: false, other: [] };
  const walk = (c) => {
    if (!c) return;
    if (c.k === "and") c.items.forEach(walk);
    else if (c.k === "or") { out.or = true; c.items.forEach(walk); }
    else if (c.k === "not") { out.not = true; walk(c.item); }
    else if (c.k === "cmp") out.cmps.push(c);
    else out.other.push(c);
  };
  walk(cond);
  return out;
}

const FLIP = { "<": ">", ">": "<", "<=": ">=", ">=": "<=", "=": "=", "<>": "<>", "!=": "!=" };
function normCmp(c) {
  if (c.left.k !== "col" && c.right.k === "col") return { column: c.right.name, op: FLIP[c.op], value: c.left, node: c };
  return { column: c.left.k === "col" ? c.left.name : null, op: c.op, value: c.right, node: c };
}

// ---------- Typad aritmetik (för SET-uttryck och set-anropens nummer) ----------

function arith(op, a, b) {
  if (!a || !b) return null;
  const int = a.int && b.int;
  switch (op) {
    case "+": return { n: a.n + b.n, int };
    case "-": return { n: a.n - b.n, int };
    case "*": return { n: a.n * b.n, int };
    case "/": if (b.n === 0) return null; return { n: int ? Math.trunc(a.n / b.n) : a.n / b.n, int };
    case "%": if (b.n === 0) return null; return { n: a.n % b.n, int };
    default: return null;
  }
}

function sqlEval(e, env) {
  if (!e) return null;
  switch (e.k) {
    case "num": return { n: e.v, int: env.float ? false : e.int };
    case "col": return env.col(e.name);
    case "ph": return env.ph(e.ph);
    case "neg": { const v = sqlEval(e.e, env); return v && { n: -v.n, int: v.int }; }
    case "bin": return arith(e.op, sqlEval(e.l, env), sqlEval(e.r, env));
    default: return null;
  }
}

const nearly = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
const SETTER_INT = { setInt: true, setLong: true, setShort: true, setDouble: false, setFloat: false, setBigDecimal: false };
const typeOfSetter = (m) => (m === "setString" ? "String" : m === "setInt" ? "int" : m === "setDouble" ? "double" : m === "setLong" ? "long" : null);

// ---------- Rättningen ----------

function ruleBuilder(def, generalWhy) {
  const items = [];
  let naText = null;
  return {
    fail(text, why) { items.push({ level: "fail", text, why }); },
    note(text, why) { items.push({ level: "note", text, why }); },
    ok(text) { items.push({ level: "ok", text }); },
    na(text) { naText = text; },
    get failed() { return items.some((i) => i.level === "fail"); },
    get empty() { return items.every((i) => i.level === "ok"); },
    build() {
      const base = { id: def.id, key: def.key, title: def.title };
      if (naText != null && !items.some((i) => i.level !== "ok")) return { ...base, status: "na", text: naText, why: generalWhy };
      for (const level of ["fail", "note"]) {
        const hit = items.filter((i) => i.level === level);
        if (hit.length) return { ...base, status: level, text: hit.map((i) => i.text).join(" "), why: hit.find((i) => i.why)?.why ?? generalWhy };
      }
      return { ...base, status: "ok", text: items.map((i) => i.text).join(" "), why: generalWhy };
    },
  };
}

function parseError(errors) {
  return { status: "parse-error", rules: [], errors, sql: null };
}

const sigText = (m) => (m ? `public ${m.returns} ${m.name}(${(m.params ?? []).map(([t, n]) => `${t} ${n}`).join(", ")}) throws SQLException` : "");

// Uttryck i uppgiftens data ("department", "employee.getEmployeeNo()") som Java-träd.
function parseTaskExpr(text) {
  const lexed = lexJava(String(text));
  if (lexed.error || !lexed.tokens.length) return null;
  const toks = [{ t: "op", v: "{", line: 1 }, ...lexed.tokens, { t: "op", v: ";", line: 1 }, { t: "op", v: "}", line: 1 }];
  toks.forEach((t, k) => { t.pos = k; });
  if (checkBalance(toks)) return null;
  const errs = [];
  const body = parseBody(toks, 0, toks.length - 1, errs);
  return body.stmts[0]?.k === "expr" ? body.stmts[0].expr : null;
}

// Tabellens kolumner ur uppgiftens CREATE TABLE, om den står i uppgiftstexten.
function tableColumns(task, table) {
  if (!table) return null;
  for (const b of task?.blocks ?? []) {
    if (typeof b?.code !== "string") continue;
    const re = /CREATE\s+TABLE\s+(?:\[?dbo\]?\.)?\[?(\w+)\]?\s*\(/gi;
    let m;
    while ((m = re.exec(b.code))) {
      if (fold(m[1]) !== fold(table)) continue;
      const items = [];
      let cur = "";
      let depth = 1;
      for (let i = re.lastIndex; i < b.code.length; i++) {
        const ch = b.code[i];
        if (ch === "(") depth++;
        else if (ch === ")" && --depth === 0) break;
        if (ch === "," && depth === 1) { items.push(cur); cur = ""; } else cur += ch;
      }
      items.push(cur);
      const cols = items
        .map((s) => s.trim().split(/\s+/)[0]?.replace(/[[\]]/g, ""))
        .filter((w) => w && !/^(CONSTRAINT|PRIMARY|FOREIGN|UNIQUE|CHECK|INDEX)$/i.test(w));
      if (cols.length) return cols;
    }
  }
  return null;
}

export function checkJava(code, task) {
  const check = task?.check ?? {};
  const src = String(code ?? "");
  if (!src.trim()) return parseError([{ message: `Svaret är tomt. Skriv hela metoden, med signaturen först: ${sigText(check.method)} { … }` }]);
  const lexed = lexJava(src);
  if (lexed.error) return parseError([lexed.error]);
  const { tokens } = lexed;
  if (!tokens.length) return parseError([{ message: "Svaret innehåller bara kommentarer. Skriv hela metoden: signaturen och kroppen." }]);
  const unbalanced = checkBalance(tokens);
  if (unbalanced) return parseError([unbalanced]);
  const methods = findMethods(tokens);
  if (!methods.length) {
    return parseError([{ message: `Hittar ingen metod. Svaret ska vara hela metoden med signaturen först, ${sigText(check.method)}, och kroppen inom { }.` }]);
  }
  const want = check.method ?? {};
  const outer = methods.filter((m) => !methods.some((o) => o !== m && o.open < m.nameTok.pos && m.nameTok.pos < o.close));
  const target = outer.find((m) => m.name === want.name)
    ?? outer.find((m) => m.name.toLowerCase() === String(want.name).toLowerCase())
    ?? outer.find((m) => normType(m.returnType) === normType(want.returns) && m.params.length === (want.params ?? []).length)
    ?? outer[0];
  const errors = [];
  const analyze = (m) => {
    const body = parseBody(tokens, m.open, m.close, errors);
    const F = collect(body);
    const R = makeResolver(F, m.params.map((x) => x.name));
    return { m, body, F, R };
  };
  const main = analyze(target);
  const helpers = outer.filter((m) => m !== target).map(analyze);

  const C = buildContext(main, helpers, check, tableColumns(task, check.sql?.table));
  // Ord utanför metoderna (t.ex. fält i en klass runt metoden) räknas som deklarerade.
  C.classIds = new Set(tokens.filter((t) => t.t === "id" && !methods.some((x) => x.open <= t.pos && t.pos <= x.close)).map((t) => t.v));
  errors.push(...compileChecks(C));
  errors.sort((a, b) => (a.line ?? 0) - (b.line ?? 0));
  const rules = [
    ruleSignature(C),
    ruleSql(C),
    ruleInjection(C),
    rulePrepare(C),
    ruleBinds(C),
    ruleExecute(C),
    ruleResources(C),
    ruleResultSet(C),
    ruleReturn(C),
    ruleExceptions(C),
  ];
  const fails = rules.filter((r) => r.status === "fail").length;
  const passed = rules.filter((r) => r.status === "ok" || r.status === "note").length;
  const status = fails === 0 ? "correct" : fails > passed ? "wrong" : "partial";
  return { status, rules, errors, sql: C.sql?.display ?? null };
}

// Typer och namn som ligger nära ett känt namn men inte är det: stavfel som
// kompilatorn stoppar. De listas i errors med radnummer; de som rör en
// variabel som en regel bygger på underkänns också i den regeln.
function knownTypes(C) {
  const w = C.check.method ?? {};
  return [...new Set([...KNOWN_TYPES, ...typeWords(w.returns), ...(w.params ?? []).flatMap(([t]) => typeWords(t)), ...typeWords(C.check.result?.model)])];
}
function typeSlip(C, type) {
  const known = knownTypes(C);
  for (const word of typeWords(type)) {
    if (known.includes(word)) continue;
    const near = closest(word, known);
    if (near) return { word, near };
  }
  return null;
}
function compileChecks(C) {
  const out = [];
  const seen = new Set();
  const push = (line, message) => { if (!seen.has(message)) { seen.add(message); out.push({ line, message }); } };
  for (const x of [C, ...C.helpers]) {
    const declared = new Set([...x.m.params.map((p) => p.name), ...x.F.decls.map((d) => d.name), ...x.F.catches.map((c) => c.clause.name), "this", "super", "connectionHandler", ...C.classIds]);
    // Lokala variabler finns bara i sitt block; parametrar, catch-namn och fält i hela metoden.
    const nonLocal = new Set([...declared].filter((n) => !x.F.decls.some((d) => d.name === n) || x.m.params.some((p) => p.name === n) || C.classIds.has(n)));
    for (const p of x.m.params) { const slip = typeSlip(C, p.type); if (slip) push(p.line, `Rad ${p.line}: typen ${slip.word} finns inte — menar du ${slip.near}?`); }
    for (const d of x.F.decls) { const slip = typeSlip(C, d.type); if (slip) push(d.line, `Rad ${d.line}: typen ${slip.word} finns inte — menar du ${slip.near}?`); }
    for (const n of x.F.news) { const slip = typeSlip(C, n.node.type); if (slip) push(n.node.line, `Rad ${n.node.line}: klassen ${slip.word} finns inte — menar du ${slip.near}?`); }
    for (const c of x.F.catches) for (const t of c.clause.types) { const slip = typeSlip(C, t); if (slip) push(c.clause.line, `Rad ${c.clause.line}: typen ${slip.word} finns inte — menar du ${slip.near}?`); }
    const reported = new Set();
    for (const { node } of x.F.names) {
      if (nonLocal.has(node.name) || x.R.inScope(node.name, node.pos) || !/^[a-z_$]/.test(node.name) || reported.has(node.name)) continue;
      reported.add(node.name);
      const gone = x.F.decls.find((d) => d.name === node.name && d.pos < node.pos);
      if (gone) { push(node.line, `Rad ${node.line}: ${node.name} deklareras på rad ${gone.line} inne i ett block som redan har stängts, så den finns inte här. Deklarera den före blocket.`); continue; }
      const near = closest(node.name, [...declared]);
      push(node.line, `Rad ${node.line}: ${node.name} är inte deklarerad${near ? ` — menar du ${near}?` : "."}`);
    }
  }
  if (C.m.junk) push(C.m.junk.line, `Rad ${C.m.junk.line}: ${C.m.junk.v} före returtypen är inget Java-ord.`);
  return out;
}
const isDeclared = (C, name, pos) => C.R.isParam(name, pos) || C.R.inScope(name, pos) || C.classIds?.has(name) || name === "connectionHandler";
// Ett namn som return använder men som inte finns där: deklarerat i ett block som redan har stängts, eller inte alls.
function undeclaredAt(C, name, ret) {
  const gone = C.R.declBefore(name, ret.pos);
  return gone
    ? [`${name} deklareras på rad ${gone.line} inne i ett block som har stängts före return på rad ${ret.line}, så den finns inte där; det kompilerar inte. Deklarera den före blocket.`, WHY.scope]
    : [`${name} är inte deklarerad där return står (rad ${ret.line}); det kompilerar inte.`, WHY.returnType];
}
// En variabels deklarerade typ ska vara en av de väntade (eller var).
function wrongDeclType(decl, ...wanted) {
  if (!decl) return null;
  const t = normType(decl.type);
  if (t === "var") return null;
  return wanted.some((w) => (w instanceof RegExp ? w.test(t) : t === w)) ? null : decl.type;
}

// Allt reglerna delar: parametrar, SQL-strängen, satsvariabeln, set-anropen.
function buildContext(main, helpers, check, tableCols = null) {
  const { m, F, R } = main;
  const want = check.method ?? {};
  const taskParams = want.params ?? [];
  const paramTypes = new Map(m.params.map((x) => [x.name, normType(x.type)]));
  // Studentens parameternamn → uppgiftens, efter plats; samma namn vinner.
  const toTask = new Map();
  m.params.forEach((sp, i) => { if (taskParams[i]) toTask.set(sp.name, taskParams[i][1]); });
  for (const [, n] of taskParams) if (m.params.some((sp) => sp.name === n) && !toTask.has(n)) toTask.set(n, n);
  const toStudent = new Map([...toTask].map(([s, t]) => [t, s]));
  const pname = (taskExpr) => String(taskExpr).replace(/^[A-Za-z_$][\w$]*/, (base) => toStudent.get(base) ?? base);
  const paramNames = m.params.map((x) => x.name);

  // Nyckel för ett uttryck, med parametrarna i uppgiftens namn.
  const keyOf = (e, pos, depth = 0) => {
    if (!e || depth > 10) return "?";
    switch (e.k) {
      case "name": {
        if (R.isParam(e.name, pos ?? e.pos)) return `p:${toTask.get(e.name) ?? e.name}`;
        const v = R.valueAt(e.name, pos ?? e.pos);
        if (v) return keyOf(v.expr, v.pos, depth + 1);
        return `n:${e.name}`;
      }
      case "call": {
        const t = !e.target || (e.target.k === "name" && e.target.name === "this") ? "this" : keyOf(e.target, pos, depth + 1);
        return `${t}.${e.name}(${e.args.map((a) => keyOf(a, pos, depth + 1)).join(",")})`;
      }
      case "field": return e.target?.k === "name" && e.target.name === "this" ? `n:${e.name}` : `${keyOf(e.target, pos, depth + 1)}.${e.name}`;
      case "lit": return `l:${e.type}:${e.value}`;
      case "cast": return keyOf(e.expr, pos, depth + 1);
      default: return `?${e.k}`;
    }
  };
  const taskKey = (text) => {
    const e = parseTaskExpr(text);
    const k = (x) => {
      if (!x) return "?";
      if (x.k === "name") return taskParams.some(([, n]) => n === x.name) ? `p:${x.name}` : `n:${x.name}`;
      if (x.k === "call") return `${!x.target ? "this" : k(x.target)}.${x.name}(${x.args.map(k).join(",")})`;
      if (x.k === "field") return `${k(x.target)}.${x.name}`;
      if (x.k === "lit") return `l:${x.type}:${x.value}`;
      return `?${x.k}`;
    };
    return k(e);
  };

  // Satsvariabeln (PreparedStatement eller Statement).
  const prepCalls = F.calls.filter((c) => c.node.name === "prepareStatement" || c.node.name === "prepareCall");
  const createCalls = F.calls.filter((c) => c.node.name === "createStatement");
  const stmtHolder = [...prepCalls, ...createCalls].map((c) => R.holderOf(c.node)).find(Boolean) ?? null;
  const stmtName = stmtHolder?.name ?? null;
  const isPrepared = prepCalls.length > 0;

  // SQL-strängen: argumentet till prepareStatement, annars till execute*(sql), annars en strängvariabel med SQL.
  const stringy = (e, pos) => {
    if (!e) return false;
    if (e.k === "lit") return e.type === "String";
    if (e.k === "bin" && e.op === "+") return stringy(e.left, pos) || stringy(e.right, pos);
    if (e.k === "name") {
      if (R.isParam(e.name, pos)) return paramTypes.get(e.name) === "String";
      return normType(R.declBefore(e.name, pos)?.type) === "String";
    }
    return false;
  };
  const template = (e, pos, depth = 0) => {
    if (!e || depth > 12) return [{ expr: e }];
    if (e.k === "lit") {
      if (e.type === "String" || e.type === "char") return [{ lit: e.value, line: e.line }];
      if (e.type === "int" || e.type === "double") return [{ lit: String(e.raw ?? e.value), line: e.line, num: true }];
      return [{ expr: e }];
    }
    if (e.k === "bin" && e.op === "+" && (stringy(e.left, pos) || stringy(e.right, pos))) return [...template(e.left, pos, depth + 1), ...template(e.right, pos, depth + 1)];
    if (e.k === "name" && !R.isParam(e.name, pos)) {
      const d = R.declBefore(e.name, pos);
      if (d && (["String", "var"].includes(normType(d.type)) || (d.init && stringy(d.init, d.pos)))) {
        let parts = d.init ? template(d.init, d.pos, depth + 1) : [];
        for (const a of R.assignsOf(e.name)) {
          if (a.pos <= d.pos || a.pos >= pos) continue;
          if (a.op === "=") parts = template(a.value, a.pos, depth + 1);
          else if (a.op === "+=") parts = [...parts, ...template(a.value, a.pos, depth + 1)];
        }
        return parts;
      }
    }
    return [{ expr: e }];
  };
  let sqlSource = null;
  const prep = prepCalls[0];
  if (prep?.node.args[0]) sqlSource = { expr: prep.node.args[0], pos: prep.pos };
  if (!sqlSource) {
    const ex = F.calls.find((c) => /^execute(Update|Query)?$/.test(c.node.name) && c.node.args.length);
    if (ex) sqlSource = { expr: ex.node.args[0], pos: ex.pos };
  }
  if (!sqlSource) {
    for (const d of F.decls) {
      if (!d.init) continue;
      const parts = template(d.init, d.pos);
      if (/^\s*(SELECT|INSERT|UPDATE|DELETE)\b/i.test(parts.map((x) => x.lit ?? "").join(""))) { sqlSource = { expr: { k: "name", name: d.name, pos: Infinity }, pos: Infinity }; break; }
    }
  }
  let sql = null;
  if (sqlSource) {
    const parts = template(sqlSource.expr, sqlSource.pos);
    const exprs = [];
    const gaps = [];
    let text = "";
    let display = "";
    let prevLit = null;
    for (const part of parts) {
      if (part.lit != null) {
        if (prevLit != null && /[\w?]$/.test(prevLit) && /^\w/.test(part.lit) && !part.num) {
          const left = prevLit.split(/\s/).pop();
          const right = part.lit.split(/\s/)[0];
          gaps.push({ line: part.line, left, right, joined: `${left}${right}` });
        }
        text += part.lit;
        display += part.lit;
        prevLit = part.lit;
      } else {
        text += `${MARK}${exprs.length}${MARK}`;
        display += `" + ${jsrc(part.expr, 40)} + "`;
        exprs.push(part.expr);
        prevLit = null;
      }
    }
    sql = { text, display: display.replace(/\s+/g, " ").trim(), exprs, gaps, parsed: null, error: null };
    try {
      sql.parsed = parseSql(text);
    } catch (e) {
      if (!(e instanceof SqlError)) throw e;
      sql.error = e.message;
    }
    sql.qCount = sql.parsed?.qCount ?? countQ(text);
  }

  // Set-anropen på satsvariabeln: setString(1, …) osv.
  const evalInt = (e, pos, depth = 0) => {
    if (!e || depth > 6) return null;
    if (e.k === "lit" && e.type === "int") return e.value;
    if (e.k === "unary" && e.op === "-" && !e.postfix) { const v = evalInt(e.expr, pos, depth + 1); return v == null ? null : -v; }
    if (e.k === "name" && !R.isParam(e.name, pos)) {
      const assigned = R.assignsOf(e.name).length;
      const v = R.valueAt(e.name, pos);
      if (v && !assigned) return evalInt(v.expr, v.pos, depth + 1);
    }
    return null;
  };
  const setCalls = F.calls
    .filter((c) => c.node.target && /^set[A-Z]\w*$/.test(c.node.name) && c.node.args.length === 2 && (stmtName ? targetName(c) === stmtName : true))
    .map((c) => ({ call: c, method: c.node.name, index: evalInt(c.node.args[0], c.pos), value: c.node.args[1], pos: c.pos, line: c.node.line, src: jsrc(c.node, 60) }));

  // ResultSet-variabler: de som får executeQuery(); i hjälpmetoder parametrar av typen ResultSet.
  const rsNames = new Set(F.calls.filter((c) => c.node.name === "executeQuery").map((c) => R.holderOf(c.node)?.name).filter(Boolean));
  for (const d of F.decls) if (normType(d.type) === "ResultSet") rsNames.add(d.name);

  const C = {
    check, m, F, R, body: main.body, helpers, want, taskParams, toTask, toStudent, pname, paramNames, keyOf, taskKey,
    stmtName, stmtHolder, isPrepared, prepCalls, createCalls, sql, sqlSource, setCalls, rsNames, tableCols,
    sqlKind: sql?.parsed?.kind ?? check.sql?.kind,
  };
  C.slots = sql?.parsed ? mapSlots(C) : { byPh: new Map(), issues: [] };
  return C;
}

// Para ihop varje ? (och varje inklistrat värde) i svarets SQL med uppgiftens kolumn och parameter,
// och samla avvikelserna i satsen för regel 2.
function mapSlots(C) {
  const P = C.sql.parsed;
  const want = C.check.sql ?? {};
  const resultKind = C.check.result?.kind;
  const byPh = new Map();
  const issues = [];
  const fail = (text, why) => issues.push({ level: "fail", text, why });
  const note = (text, why) => issues.push({ level: "note", text, why });
  const kindWord = { SELECT: "hämtar", DELETE: "tar bort", UPDATE: "ändrar", INSERT: "lägger till" };

  if (want.kind && P.kind !== want.kind) {
    fail(`Satsen är en ${P.kind}, men uppgiften kräver en ${want.kind}: metoden ${kindWord[want.kind]} rader.`, WHY.kind);
    return { byPh, issues, kindWrong: true };
  }
  if (want.table && fold(P.table) !== fold(want.table)) fail(`Satsen gäller tabellen ${P.table}, men ska gälla ${want.table}.`, WHY.sql);
  // TOP n i en fråga som ska ge alla rader: metoden returnerar då högst n. En findBy, ett antal eller ett ja/nej påverkas inte.
  if (P.top && resultKind === "list") fail("TOP begränsar hur många rader frågan hämtar, men metoden ska returnera alla rader som uppfyller villkoren. Ta bort TOP.", WHY.sql);

  // Kolumnnamn som ligger ett stavfel från en kolumn i uppgiften.
  const knownCols = [...new Set([...(want.select ?? []), ...(want.where ?? []).map((w) => w.column), ...(want.values ?? []).map((v) => v.column), ...(want.set ?? []).map((v) => v.column), ...(want.orderBy ?? []).map((v) => v.column), ...(C.check.result?.fields ?? []).map((f) => f.column)])];
  // Med tabellens CREATE TABLE avgör den vilka kolumner som finns; annars gissas stavfel mot kolumnerna i check.
  const tableCols = C.tableCols;
  const inTable = (col) => tableCols.some((c) => fold(c) === fold(col));
  for (const item of P.select ?? []) {
    if (item.k !== "col") continue;
    if (tableCols) {
      if (inTable(item.name)) continue;
      const near = closest(item.name, tableCols);
      fail(`Kolumnen ${item.name} finns inte i tabellen ${want.table ?? P.table}${near ? ` — menar du ${near}?` : "."}`, WHY.noColumn);
      continue;
    }
    if (knownCols.some((c) => fold(c) === fold(item.name))) continue;
    const near = closest(item.name, knownCols);
    if (near) fail(`Kolumnen ${item.name} finns inte — menar du ${near}?`, WHY.noColumn);
  }

  // SELECT-listan.
  if (P.kind === "SELECT" && resultKind !== "exists") {
    const items = P.select ?? [];
    if (want.count) {
      const c = items.length === 1 && items[0].k === "count" ? items[0] : null;
      if (!c) fail(`Uppgiften räknar rader med SELECT COUNT(*), men satsen hämtar ${items.map((i) => (i.k === "star" ? "*" : i.k === "col" ? i.name : "ett uttryck")).join(", ")}.`, WHY.count);
      else if (!c.arg) fail("COUNT() saknar argument: skriv COUNT(*).", WHY.count);
      else if (c.arg.k === "null") fail("COUNT(NULL) räknar inga rader alls och ger alltid 0: skriv COUNT(*).", WHY.countCol);
      else if (c.arg.k === "num" || c.arg.k === "str") note(`COUNT(${arithText(c.arg)}) räknar samma rader som COUNT(*), men skriv COUNT(*): då syns att det är raderna som räknas.`, WHY.countCol);
      else if (!c.star) note(`COUNT(${arithText(c.arg)}) räknar bara rader där ${arithText(c.arg)} inte är NULL; skriv COUNT(*).`, WHY.countCol);
    } else if (want.select) {
      // selectOnly: uppgiften kräver att frågan bara hämtar de kolumnerna, så det som annars är en kommentar underkänns.
      const only = !!want.selectOnly;
      const flag = only ? fail : note;
      const onlyText = `uppgiften säger att frågan bara ska hämta ${listJoin(want.select)}`;
      if (items.some((i) => i.k === "star")) {
        const others = (tableCols ?? []).filter((c) => !want.select.some((w) => fold(w) === fold(c)));
        if (only) fail(`SELECT * hämtar alla kolumner i tabellen${others.length ? `, också ${listJoin(others)}` : ""}, men ${onlyText}.`, WHY.selectOnly);
        else note("SELECT * hämtar alla kolumner i tabellen.", WHY.selectStar);
      } else {
        const got = items.filter((i) => i.k === "col").map((i) => i.name);
        const missing = want.select.filter((c) => !got.some((g) => fold(g) === fold(c)));
        const extra = got.filter((g) => !want.select.some((c) => fold(c) === fold(g)) && (tableCols ? inTable(g) : !closest(g, knownCols)));
        if (missing.length) fail(`${listJoin(missing)} saknas i SELECT-listan.`, WHY.selectMissing);
        if (extra.length) flag(only ? `${listJoin(extra)} hämtas, men ${onlyText}.` : `${listJoin(extra)} hämtas men behövs inte.`, only ? WHY.selectOnly : WHY.selectExtra);
        if (items.some((i) => i.k !== "col")) flag(only ? `SELECT-listan innehåller uttryck, men ${onlyText}.` : "SELECT-listan innehåller uttryck som uppgiften inte ber om.", only ? WHY.selectOnly : WHY.selectExtra);
      }
    }
  }

  // INSERT: kolumnlistan och dess ?.
  if (P.kind === "INSERT" && want.values) {
    const cols = want.values.map((v) => v.column);
    if (!P.insertCols) {
      fail(`Kolumnlistan saknas: skriv INSERT INTO ${want.table} (${cols.join(", ")}) VALUES (${cols.map(() => "?").join(", ")}).`, WHY.insertCols);
    } else {
      const missing = cols.filter((c) => !P.insertCols.some((g) => fold(g) === fold(c)));
      const extra = P.insertCols.filter((g) => !cols.some((c) => fold(c) === fold(g)));
      if (missing.length) fail(`${listJoin(missing)} saknas i kolumnlistan.`, WHY.insertCols);
      for (const x of extra) fail(`${x} ska inte vara med i kolumnlistan${/id$/i.test(x) ? " — surrogatnyckeln fylls i av IDENTITY, och SQL Server vägrar ett eget värde för den" : ""}.`, WHY.insertCols);
      if (P.insertCols.length !== P.values.length) fail(`Kolumnlistan har ${P.insertCols.length} kolumner men VALUES ${P.values.length} värden.`, WHY.insertCols);
      P.insertCols.forEach((col, i) => {
        const w = want.values.find((v) => fold(v.column) === fold(col));
        const value = P.values[i];
        if (!w || !value) return;
        if (value.k === "ph") byPh.set(value.ph, { param: w.param, column: w.column, role: "value" });
        else fail(`Värdet för ${w.column} är ${arithText(value)}, inte ? för ${C.pname(w.param)}.`, WHY.param);
      });
    }
  }

  // UPDATE: SET-kolumnerna; uttrycken jämförs numeriskt i ruleSql (de beror på set-anropen).
  if (P.kind === "UPDATE" && want.set) {
    const sets = P.sets ?? [];
    for (const w of want.set) {
      const s = sets.find((x) => fold(x.column) === fold(w.column));
      if (!s) { fail(`SET ${w.column} = … saknas.`, WHY.setExpr); continue; }
      for (const ph of phNodes(s.expr)) byPh.set(ph, { param: w.param, column: w.column, role: "set", set: w, expr: s.expr });
    }
    for (const s of sets) if (!want.set.some((w) => fold(w.column) === fold(s.column))) fail(`SET ${s.column} ändrar en kolumn som uppgiften inte nämner.`, WHY.setExpr);
  }

  // WHERE.
  const wantWhere = want.where ?? [];
  if (wantWhere.length && !P.where) {
    fail(`WHERE saknas. ${P.kind === "DELETE" ? "Utan WHERE tar satsen bort varje rad i tabellen." : P.kind === "UPDATE" ? "Utan WHERE ändrar satsen varje rad i tabellen." : "Utan WHERE hämtas varje rad i tabellen."}`, WHY.noWhere);
  } else if (P.where) {
    const flat = flattenWhere(P.where);
    if (flat.or) fail("Villkoren kombineras med OR, men alla ska gälla samtidigt: AND.", WHY.or);
    if (flat.not) fail("NOT vänder villkoret; uppgiften har inget NOT.", WHY.sql);
    for (const o of flat.other) fail(`Villkoret ${arithText(o.left)} ${o.what} … finns inte i uppgiften.`, WHY.extraCond);
    const cmps = flat.cmps.map(normCmp);
    const used = new Set();
    for (const w of wantWhere) {
      const idx = cmps.findIndex((x, i) => !used.has(i) && fold(x.column) === fold(w.column));
      if (idx < 0) { fail(`Villkoret ${w.column} ${w.op} ? saknas.`, WHY.sql); continue; }
      used.add(idx);
      const c = cmps[idx];
      if (c.op !== w.op) fail(`${w.column} ${c.op} ? ska vara ${w.column} ${w.op} ?.`, opWhy(w, c));
      if (c.value.k === "ph") byPh.set(c.value.ph, { param: w.param, column: w.column, role: "where" });
      else fail(`${w.column} jämförs med ${arithText(c.value)}, inte med parametern ${C.pname(w.param)} via ?.`, WHY.param);
    }
    cmps.forEach((c, i) => {
      if (used.has(i)) return;
      fail(`Villkoret ${c.column ?? arithText(c.node.left)} ${c.op} ${arithText(c.value)} finns inte i uppgiften.`, WHY.extraCond);
    });
  }

  // ORDER BY.
  if (want.orderBy?.length) {
    const wantText = want.orderBy.map((o) => `${o.column}${o.dir === "DESC" ? " DESC" : ""}`).join(", ");
    if (!P.orderBy) fail(`ORDER BY saknas: raderna ska sorteras med ORDER BY ${wantText}.`, WHY.orderBy);
    else {
      // Uppgiftens sortering ska stå först; fler kolumner efter den ordnar bara rader som annars är lika.
      const same = P.orderBy.length >= want.orderBy.length && want.orderBy.every((o, i) => fold(P.orderBy[i].column) === fold(o.column) && P.orderBy[i].dir === (o.dir ?? "ASC"));
      if (!same) fail(`ORDER BY ${P.orderBy.map((o) => `${o.column}${o.dir === "DESC" ? " DESC" : ""}`).join(", ")} ska vara ORDER BY ${wantText}.`, WHY.orderBy);
    }
  }
  return { byPh, issues };
}

const OP_WORDS = { "=": "lika med", "<": "lägre än", ">": "högre än", "<=": "lägre än eller lika med", ">=": "högre än eller lika med", "<>": "skild från", "!=": "skild från" };
function opWhy(w, c) {
  const strict = { "<": "<=", ">": ">=" };
  if (strict[w.op] === c.op) return `${w.op} betyder ${OP_WORDS[w.op]}. Med ${c.op} kommer också rader där ${w.column} är exakt lika med gränsen med, och de ska inte påverkas.`;
  if (strict[c.op] === w.op) return `${w.op} betyder ${OP_WORDS[w.op]}. Med ${c.op} missas rader där ${w.column} är exakt lika med gränsen.`;
  return `Jämförelsen ska vara ${w.op}, ${OP_WORDS[w.op]}, som uppgiften säger.`;
}

// ---------- Regel 1: signaturen ----------

function ruleSignature(C) {
  const { m, want } = C;
  const r = ruleBuilder(JAVA_RULES[0], WHY.signature);
  if (want.name && m.name !== want.name) {
    r.fail(`Metoden heter ${m.name}, men ska heta ${want.name}${m.name.toLowerCase() === want.name.toLowerCase() ? " — Java skiljer på stora och små bokstäver" : ""}.`, WHY.signature);
  }
  if (want.returns && normType(m.returnType) !== normType(want.returns)) r.fail(`Returtypen är ${m.returnType}, men ska vara ${want.returns}.`, WHY.signature);
  const tp = want.params ?? [];
  if (m.params.length !== tp.length) {
    r.fail(`Metoden tar ${m.params.length} ${m.params.length === 1 ? "parameter" : "parametrar"}, men ska ta ${tp.length}: ${tp.map(([t, n]) => `${t} ${n}`).join(", ")}.`, WHY.signature);
  } else {
    let typesOk = true;
    tp.forEach(([type], i) => {
      const sp = m.params[i];
      if (normType(sp.type) !== normType(type)) { typesOk = false; r.fail(`Parametern ${sp.name} är ${sp.type}, men ska vara ${type}.`, WHY.signature); }
    });
    const renamed = tp.map(([, n], i) => [m.params[i].name, n]).filter(([a, b]) => a !== b);
    if (typesOk && renamed.length) {
      r.note(`Parametrarna heter ${listJoin(renamed.map(([a]) => a))} hos dig och ${listJoin(renamed.map(([, b]) => b))} i uppgiften. Rättningen följer deras plats i signaturen.`, WHY.paramNames);
    }
  }
  const thrown = m.throws.map(simple);
  if (!thrown.includes("SQLException")) {
    r.fail(m.throws.length ? `Metoden deklarerar throws ${m.throws.join(", ")}, men ska deklarera throws SQLException.` : "throws SQLException saknas i signaturen.", WHY.throws);
  } else if (thrown.length > 1) {
    r.note(`Signaturen deklarerar också ${listJoin(m.throws.filter((t) => simple(t) !== "SQLException"))}, som uppgiften inte har.`, WHY.signature);
  }
  if (m.modifiers.includes("static")) r.fail("Metoden är static, men ska vara en instansmetod.", WHY.static);
  if (m.junk) r.fail(`Signaturen börjar med ${m.junk.v}, som inte är ett Java-ord${closest(m.junk.v, ["public", "private", "protected"]) ? ` — menar du ${closest(m.junk.v, ["public", "private", "protected"])}?` : "."}`, WHY.signature);
  if (!m.modifiers.includes("public") && !m.junk) r.note("public saknas: signaturen i uppgiften börjar med public.", WHY.signature);
  if (r.empty) r.ok(`${m.modifiers.join(" ")} ${m.returnType} ${m.name}(${m.params.map((x) => `${x.type} ${x.name}`).join(", ")}) throws ${m.throws.join(", ")} — som i uppgiften.`.trim());
  return r.build();
}

// ---------- Regel 2: SQL-satsen ----------

function ruleSql(C) {
  const { sql, check } = C;
  const r = ruleBuilder(JAVA_RULES[1], WHY.sql);
  if (!sql) {
    r.fail(C.createCalls.length || C.prepCalls.length ? "Hittar ingen SQL-sats: argumentet till prepareStatement är ingen sträng med SQL." : "Hittar ingen SQL-sats i metoden.", WHY.sql);
    return r.build();
  }
  for (const g of sql.gaps) r.fail(`Rad ${g.line}: blanksteg saknas där strängarna slås ihop — ${g.left} och ${g.right} blir ${g.joined}.`, WHY.space);
  if (sql.error) {
    if (!sql.gaps.length) r.fail(`SQL-satsen går inte att tolka: ${sql.error} Satsen lyder: ${shorten(sql.display, 160)}`, WHY.sql);
    return r.build();
  }
  for (const i of C.slots.issues) (i.level === "fail" ? r.fail : r.note)(i.text, i.why);
  if (C.slots.kindWrong) return r.build();
  const sqlVar = C.sqlSource?.expr?.k === "name" ? C.R.declBefore(C.sqlSource.expr.name, C.sqlSource.pos) : null;
  const badSqlType = wrongDeclType(sqlVar, "String");
  if (badSqlType) r.fail(`Variabeln ${sqlVar.name} har typen ${badSqlType}; SQL-satsen är en String.`, WHY.sql);

  // UPDATE: SET-uttrycket jämförs numeriskt med uppgiftens, med set-anropens värden insatta.
  const P = sql.parsed;
  if (P.kind === "UPDATE" && check.sql?.set) {
    for (const w of check.sql.set) {
      const s = (P.sets ?? []).find((x) => fold(x.column) === fold(w.column));
      if (!s) continue;
      const verdict = compareSetExpr(C, w, s);
      if (verdict === "intdiv") r.fail(`SET ${s.column} = ${arithText(s.expr)} räknar med heltalsdivision, så ${s.column} blir fel för de flesta värden.`, WHY.intDiv);
      else if (verdict !== "same") r.fail(`SET ${s.column} = ${arithText(s.expr)} ger inte samma värde som ${w.column} = ${w.expr}.`, WHY.setExpr);
    }
  }
  if (!r.failed) {
    const conds = flattenWhere(P.where).cmps.map(normCmp).map((c) => `${c.column} ${c.op} ${arithText(c.value)}`);
    const head = {
      SELECT: () => `SELECT ${P.select.map((i) => (i.k === "star" ? "*" : i.k === "col" ? i.name : i.k === "count" ? `COUNT(${i.star ? "*" : "…"})${i.alias ? ` AS ${i.alias}` : ""}` : "…")).join(", ")} FROM ${P.table}`,
      DELETE: () => `DELETE FROM ${P.table}`,
      INSERT: () => `INSERT INTO ${P.table} (${(P.insertCols ?? []).join(", ")}) VALUES (${P.values.map(arithText).join(", ")})`,
      UPDATE: () => `UPDATE ${P.table} SET ${P.sets.map((s) => `${s.column} = ${arithText(s.expr)}`).join(", ")}`,
    }[P.kind]();
    const order = P.orderBy ? ` ORDER BY ${P.orderBy.map((o) => `${o.column}${o.dir === "DESC" ? " DESC" : ""}`).join(", ")}` : "";
    r.ok(`${head}${conds.length ? ` WHERE ${conds.join(" AND ")}` : ""}${order} — rätt sats, rätt tabell och samma villkor som i uppgiften.`);
  }
  return r.build();
}

// Jämför studentens SET-uttryck med uppgiftens för några olika värden. "same" | "intdiv" | "differ"
function compareSetExpr(C, w, s) {
  let wantExpr;
  try { wantExpr = parseSqlExpr(w.expr); } catch { return "same"; }
  const binds = C.check.binds ?? {};
  const pType = (param) => (binds[param] ? !!SETTER_INT[binds[param]] : true);
  const samples = [[7, 7.5], [12, 12.25], [3, 3.75]];
  const colValue = (name, t) => {
    let h = 0;
    for (const ch of fold(name)) h = (h * 31 + ch.charCodeAt(0)) % 9973;
    return { n: 1000 + h + 0.25 + t * 137, int: false };
  };
  const paramValue = (taskParam, t) => {
    const isInt = pType(taskParam);
    return { n: samples[t][isInt ? 0 : 1], int: isInt };
  };
  // Studentens Java-värden: parametrarna får samma tal som uppgiftens.
  const jEval = (e, pos, t, float, depth = 0) => {
    if (!e || depth > 10) return null;
    const key = C.keyOf(e, pos);
    if (key.startsWith("p:")) {
      const param = key.slice(2);
      const v = paramValue(param, t);
      // En enkel parameter har sin typ i signaturen; ett anrop som employee.getSalary() följer set-metoden i uppgiften.
      const typ = param.includes(".") ? null : C.m.params.find((x) => (C.toTask.get(x.name) ?? x.name) === param)?.type;
      return { n: v.n, int: float ? false : (typ ? /^(int|long|short|byte)$/.test(normType(typ)) : v.int) };
    }
    switch (e.k) {
      case "lit": return typeof e.value === "number" ? { n: e.value, int: float ? false : e.type === "int" } : null;
      case "name": { const v = C.R.valueAt(e.name, pos ?? e.pos); return v ? jEval(v.expr, v.pos, t, float, depth + 1) : null; }
      case "unary": { const v = jEval(e.expr, pos, t, float, depth + 1); return v && (e.op === "-" ? { n: -v.n, int: v.int } : e.op === "+" ? v : null); }
      case "cast": { const v = jEval(e.expr, pos, t, float, depth + 1); if (!v) return null; return /^(int|long|short|byte)$/.test(e.type) ? { n: Math.trunc(v.n), int: true } : { n: v.n, int: false }; }
      case "bin": return arith(e.op, jEval(e.left, pos, t, float, depth + 1), jEval(e.right, pos, t, float, depth + 1));
      default: return null;
    }
  };
  const run = (t, float) => {
    const studentEnv = {
      float,
      col: (name) => colValue(name, t),
      ph: (ph) => {
        if (ph.concat != null) return jEval(C.sql.exprs[ph.concat], C.sql.exprs[ph.concat]?.pos, t, float);
        const call = C.setCalls.find((x) => x.index === ph.q);
        if (!call) return paramValue(w.param, t);
        // Ett annat av uppgiftens värden på det här ? är ett fel i set-anropen (regel 5), inte i SET-uttrycket.
        const key = C.keyOf(call.value, call.pos);
        if (key.startsWith("p:") && key !== C.taskKey(w.param)) {
          const v = paramValue(w.param, t);
          return { n: v.n, int: float ? false : v.int };
        }
        const v = jEval(call.value, call.pos, t, float);
        if (!v) return null;
        return { n: v.n, int: float ? false : SETTER_INT[call.method] ?? v.int };
      },
    };
    const wantEnv = { float: false, col: (name) => colValue(name, t), ph: () => paramValue(w.param, t) };
    const a = sqlEval(s.expr, studentEnv);
    const b = sqlEval(wantExpr, wantEnv);
    return a && b && nearly(a.n, b.n);
  };
  const exact = [0, 1, 2].every((t) => run(t, false));
  if (exact) return "same";
  if ([0, 1, 2].every((t) => run(t, true))) return "intdiv";
  return "differ";
}

// ---------- Regel 3: ingen SQL-injektion ----------

function ruleInjection(C) {
  const { sql } = C;
  const r = ruleBuilder(JAVA_RULES[2], WHY.injection);
  if (!sql) { r.na("Ingen SQL-sats hittades (se regel 2)."); return r.build(); }
  if (sql.exprs.length) {
    const names = [...new Set(sql.exprs.map((e) => jsrc(e, 40)))];
    r.fail(`${listJoin(names)} klistras in i SQL-strängen med + i stället för att bindas till ett ?.`, WHY.injection);
  }
  const n = sql.qCount;
  const idx = new Set(C.setCalls.map((s) => s.index).filter((x) => x != null));
  const unbound = [];
  for (let k = 1; k <= n; k++) if (!idx.has(k)) unbound.push(k);
  // Ett nummer över antalet ? pekar på ett frågetecken som inte finns. Numrering från 0 rättas bara i
  // regel 5: då är antalet rätt men varje nummer ett för lågt.
  const extra = [...idx].filter((k) => k > n || k < 0);
  if (n !== idx.size || (!idx.has(0) && (unbound.length || extra.length))) {
    const parts = [];
    if (unbound.length) parts.push(`? nr ${listJoin(unbound.map(String))} får aldrig något värde`);
    if (extra.length) parts.push(`set-anrop med nummer ${listJoin(extra.map(String))} pekar på frågetecken som inte finns`);
    const dup = C.setCalls.length > idx.size;
    r.fail(`Frågan har ${n} ? men set-anropen binder ${idx.size} ${idx.size === 1 ? "nummer" : "olika nummer"}${dup ? " (samma nummer används två gånger)" : ""}${parts.length ? `: ${parts.join(", och ")}` : ""}.`, WHY.qCount);
  }
  if (r.empty) r.ok(n ? `${n === 1 ? "Värdet binds" : `Alla ${n} värden binds`} till ? med set-anrop — inget klistras in i SQL-texten.` : "Frågan har inga värden från parametrarna.");
  return r.build();
}

// ---------- Regel 4: PreparedStatement ----------

function rulePrepare(C) {
  const { F, R } = C;
  const r = ruleBuilder(JAVA_RULES[3], WHY.prepare);
  const prep = C.prepCalls[0];
  if (!prep) {
    if (C.createCalls.length) r.fail(`Satsen skapas med ${jsrc(C.createCalls[0].node)}, som ger ett vanligt Statement utan platshållare.`, WHY.statement);
    else r.fail("prepareStatement saknas: skapa satsen med connection.prepareStatement(sql).", WHY.prepare);
    return r.build();
  }
  if (prep.node.name !== "prepareStatement") r.fail(`${prep.node.name} är till för lagrade procedurer; använd prepareStatement.`, WHY.prepare);
  if (!prep.node.args.length) r.fail(`${jsrc(prep.node)} får ingen SQL-sats: skriv ${prep.node.target ? jsrc(prep.node.target) : "connection"}.prepareStatement(sql).`, WHY.prepare);
  const target = prep.node.target;
  const conn = target ? R.resolve(target, prep.pos) : null;
  if (!(conn?.k === "call" && conn.name === "getConnection")) {
    r.fail(`prepareStatement anropas på ${target ? jsrc(target) : "ingenting"}, som inte är en anslutning från connectionHandler.getConnection().`, WHY.connection);
  } else {
    const via = conn.target ? jsrc(conn.target) : "";
    if (!/^(this\.)?connectionHandler$/.test(via)) r.fail(`Anslutningen hämtas med ${jsrc(conn)}, men uppgiften ger den: connectionHandler.getConnection().`, WHY.connection);
  }
  const holder = C.stmtHolder;
  const declType = holder?.decl ? normType(holder.decl.type) : null;
  if (declType === "Statement") r.fail(`Variabeln ${holder.name} är deklarerad som Statement; då finns inga set-metoder för ?. Typen ska vara PreparedStatement.`, WHY.prepare);
  else if (declType && !["PreparedStatement", "var", "CallableStatement"].includes(declType)) r.fail(`Variabeln ${holder.name} har typen ${holder.decl.type}, men prepareStatement returnerar ett PreparedStatement.`, WHY.prepare);
  if (C.createCalls.length) r.fail(`Det finns också ett ${jsrc(C.createCalls[0].node)}, som ger ett vanligt Statement.`, WHY.statement);
  if (!F.calls.some((c) => c.node.name === "getConnection")) r.fail("Ingen anslutning hämtas: connectionHandler.getConnection() saknas.", WHY.connection);
  const connHolder = F.calls.filter((c) => c.node.name === "getConnection").map((c) => R.holderOf(c.node)).find(Boolean);
  const badConn = wrongDeclType(connHolder?.decl, "Connection");
  if (badConn) r.fail(`Variabeln ${connHolder.name} har typen ${badConn}, men getConnection() returnerar en Connection.`, WHY.connection);
  if (r.empty) r.ok(`${holder ? `${holder.name} = ` : ""}${jsrc(prep.node, 60)}, med anslutningen från connectionHandler.getConnection().`);
  return r.build();
}

// ---------- Regel 5: set-anropen ----------

function ruleBinds(C) {
  const { sql, setCalls } = C;
  const r = ruleBuilder(JAVA_RULES[4], WHY.binds);
  const binds = C.check.binds ?? {};
  if (!sql?.parsed) { r.na(sql ? "SQL-satsen går inte att tolka, så set-anropen går inte att para ihop med frågetecknen (se regel 2)." : "Ingen SQL-sats hittades (se regel 2)."); return r.build(); }
  if (!sql.qCount) {
    if (setCalls.length) r.fail(`Frågan har inga ?, men ${setCalls[0].src} binder ett värde.`, WHY.qCount);
    else r.na("Frågan har inga ? att binda värden till (se regel 3).");
    return r.build();
  }
  for (const s of setCalls) {
    if (s.index === 0) r.fail(`${s.src}: numreringen börjar på 0, men första ? har nummer 1.`, WHY.zero);
    else if (s.index == null) r.fail(`${s.src}: numret ska vara ett heltal, 1 för första ?.`, WHY.binds);
  }
  // ? i svarets egen ordning.
  const phs = [];
  for (const [ph, slot] of C.slots.byPh) if (ph.q) phs.push({ q: ph.q, slot });
  phs.sort((a, b) => a.q - b.q);
  const okTexts = [];
  for (const { q, slot } of phs) {
    const calls = setCalls.filter((s) => s.index === q);
    if (!calls.length) continue;
    const s = calls[calls.length - 1]; // JDBC behåller värdet från det sista set-anropet före execute
    if (calls.length > 1) {
      const shadowed = calls.slice(0, -1).filter((c) => C.keyOf(c.value, c.pos) !== C.keyOf(s.value, s.pos) || c.method !== s.method);
      const who = calls.length === 2 ? `Både ${calls[0].src} och ${calls[1].src} binder` : `${listJoin(calls.map((c) => c.src))} binder alla`;
      if (shadowed.length) r.fail(`${who} ? nr ${q}; bara det sista värdet, ${jsrc(s.value, 40)}, gäller när frågan körs.`, WHY.binds);
    }
    const wantKey = C.taskKey(slot.param);
    const gotKey = C.keyOf(s.value, s.pos);
    const wantMethod = binds[slot.param];
    if (gotKey !== wantKey) {
      const other = phs.find((x) => x.q !== q && C.taskKey(x.slot.param) === gotKey);
      if (other) {
        r.fail(`${s.src} binder ${C.pname(other.slot.param)} till ? nr ${q}, men ? nr ${q} hör till ${slot.column}, som ska få ${C.pname(slot.param)}.`, WHY.order);
        continue;
      }
      if (slot.role === "set" && !gotKey.startsWith("p:") && compareSetExpr(C, slot.set, { column: slot.column, expr: slot.expr }) === "same") {
        // Värdet räknas fram i Java, och SET-uttrycket blir ändå rätt: rätta set-metoden mot värdets typ.
        if (s.method === "setString" || (s.method === "setInt" && !isIntExpr(C, s.value, s.pos))) r.fail(`${s.src}: värdet är ett decimaltal och binds med setDouble.`, WHY.setType);
        else okTexts.push(s.src);
        continue;
      }
      r.fail(`${s.src} binder ${jsrc(s.value, 40)} till ? nr ${q}, men ? nr ${q} hör till ${slot.column}, som ska få ${C.pname(slot.param)}.`, WHY.binds);
      continue;
    }
    if (wantMethod && s.method !== wantMethod) {
      const pType = C.m.params.find((x) => x.name === C.pname(slot.param))?.type ?? typeOfSetter(wantMethod);
      if (s.method === "setObject") r.note(`${s.src}: setObject fungerar, men ${wantMethod} visar typen.`, WHY.setObject);
      else r.fail(`${s.src}: ${C.pname(slot.param)} är ${pType ? `en ${pType}` : "av en annan typ"} och binds med ${wantMethod}, inte ${s.method}.`, WHY.setType);
      continue;
    }
    okTexts.push(s.src);
  }
  if (r.empty) r.ok(okTexts.length ? `${listJoin(okTexts)} — rätt nummer, rätt set-metod och rätt värde för varje ?.` : "Inga set-anrop att rätta (se regel 3).");
  return r.build();
}

function isIntExpr(C, e, pos, depth = 0) {
  if (!e || depth > 8) return false;
  if (e.k === "lit") return e.type === "int";
  if (e.k === "name") {
    if (C.R.isParam(e.name, pos)) return /^(int|long|short|byte)$/.test(normType(C.m.params.find((x) => x.name === e.name)?.type));
    const d = C.R.declBefore(e.name, pos);
    return /^(int|long|short|byte)$/.test(normType(d?.type));
  }
  if (e.k === "bin") return isIntExpr(C, e.left, pos, depth + 1) && isIntExpr(C, e.right, pos, depth + 1);
  if (e.k === "unary") return isIntExpr(C, e.expr, pos, depth + 1);
  if (e.k === "cast") return /^(int|long|short|byte)$/.test(e.type);
  return false;
}

// ---------- Regel 6: exekveringen ----------

function ruleExecute(C) {
  const { F, R, check } = C;
  const r = ruleBuilder(JAVA_RULES[5], WHY.execute);
  const kind = C.sqlKind;
  const wantExec = kind === "SELECT" ? "executeQuery" : "executeUpdate";
  const execs = F.calls.filter((c) => /^(execute|executeUpdate|executeQuery|executeLargeUpdate)$/.test(c.node.name));
  if (!execs.length) { r.fail(`Satsen körs aldrig: ${wantExec}() saknas.`, WHY.execute); return r.build(); }
  for (const c of execs) {
    const t = c.node.target;
    if (t?.k === "name" && C.stmtName && t.name !== C.stmtName) r.fail(`${jsrc(c.node, 50)} anropas på ${t.name}, men satsen heter ${C.stmtName}.`, WHY.execute);
    else if (t?.k === "lit") r.fail(`${jsrc(c.node, 50)} anropas på ${jsrc(t)}, inte på satsen${C.stmtName ? ` ${C.stmtName}` : ""}.`, WHY.execute);
  }
  const wrong = execs.filter((c) => c.node.name !== wantExec);
  for (const c of wrong) {
    r.fail(`${c.node.name}() kör inte en ${kind}: använd ${wantExec}().`, kind === "SELECT"
      ? "executeQuery() kör SELECT och returnerar ett ResultSet med raderna. executeUpdate() är till för INSERT, UPDATE och DELETE och ger bara ett antal."
      : `executeUpdate() kör INSERT, UPDATE och DELETE och returnerar antalet påverkade rader. executeQuery() väntar sig rader tillbaka, och en ${kind} ger inga — drivrutinen kastar SQLException.`);
  }
  if (C.isPrepared) {
    for (const c of execs.filter((x) => x.node.args.length)) r.fail(`${jsrc(c.node, 50)} skickar frågan en gång till; anropa ${c.node.name}() utan argument.`, WHY.executeArg);
  }
  const mains = execs.filter((c) => c.node.name === wantExec);
  if (mains.length > 1 && !mains.some((c) => loopBodyOf(c.ctx))) {
    r.fail(`${wantExec}() anropas ${mains.length} gånger, så satsen körs ${mains.length} gånger.`, kind === "DELETE" ? WHY.twiceDelete : WHY.twice);
  }
  const lastSet = C.setCalls.reduce((mx, s) => Math.max(mx, s.pos), -1);
  const firstExec = Math.min(...execs.map((c) => c.pos));
  if (C.setCalls.length && firstExec < lastSet) {
    const ex = execs.find((c) => c.pos === firstExec);
    const late = C.setCalls.find((s) => s.pos > firstExec);
    const inHeader = ex.ctx.some((fr) => fr.kind === "try" && fr.part === "res");
    r.fail(inHeader
      ? `${ex.node.name}() står i try-parentesen och körs därför innan ${late.src} i blocket har satt värdet. Öppna ResultSet i ett inre try-with-resources efter set-anropen.`
      : `${ex.node.name}() anropas före ${late.src}, så frågan körs innan värdet är satt.`, WHY.executeOrder);
  }
  if (check.result?.kind === "affected") {
    const fromExec = (e, pos, depth = 0) => {
      if (!e || depth > 8) return false;
      if (e.k === "call" && e.name === "executeUpdate") return true;
      if (e.k === "cast") return fromExec(e.expr, pos, depth + 1);
      if (e.k === "cond") return fromExec(e.a, pos, depth + 1) || fromExec(e.b, pos, depth + 1);
      // En variabel som deklareras i ett block som redan har stängts finns inte vid return.
      if (e.k === "name" && !R.isParam(e.name, pos)) return isDeclared(C, e.name, pos) && R.allValues(e.name).some((v) => fromExec(v.expr, v.pos, depth + 1));
      return false;
    };
    if (!F.returns.some((ret) => fromExec(ret.expr, ret.pos))) {
      const ret = F.returns.find((x) => x.expr);
      if (ret?.expr.k === "name" && !R.isParam(ret.expr.name, ret.pos) && !isDeclared(C, ret.expr.name, ret.pos)) r.fail(...undeclaredAt(C, ret.expr.name, ret));
      else r.fail(`Metoden returnerar ${ret ? jsrc(ret.expr, 40) : "inget"}, inte värdet från executeUpdate() — antalet rader satsen påverkade.`, WHY.affected);
    }
  }
  if (r.empty) {
    r.ok(`${wantExec}() kör satsen efter set-anropen${check.result?.kind === "affected" ? ", och värdet returneras" : ""}.`);
  }
  return r.build();
}

// ---------- Regel 7: resurserna stängs ----------

function ruleResources(C) {
  const { F, R } = C;
  const r = ruleBuilder(JAVA_RULES[6], WHY.resources);
  const okLabels = [];
  const notFinally = [];
  const never = [];
  const checkOpened = (label, calls, why) => {
    for (const c of calls) {
      const holder = R.holderOf(c.node);
      if (!holder) {
        r.fail(label === "Connection"
          ? `Anslutningen från ${jsrc(c.node)} sparas inte i en egen variabel i try-parentesen och stängs därför aldrig.`
          : `${label} från ${jsrc(c.node)} sparas inte i en variabel och stängs därför aldrig.`, label === "Connection" ? WHY.inlineConn : why);
        continue;
      }
      if (R.isResource(holder.name)) { if (!okLabels.includes(label)) okLabels.push(label); continue; }
      const closes = F.calls.filter((x) => x.node.name === "close" && targetName(x) === holder.name);
      const finTries = closes.filter((x) => inFinally(x.ctx)).map((x) => [...x.ctx].reverse().find((fr) => fr.kind === "try" && fr.part === "finally").node);
      // Allt som öppnas efter resursen måste stå i det try vars finally stänger den; annars når ett Exception aldrig finally.
      const outside = finTries.length ? [...gets, ...stmts, ...rss].find((o) => o.pos > c.pos && !finTries.some((T) => o.ctx.some((fr) => fr.kind === "try" && fr.node === T && (fr.part === "block" || fr.part === "res")))) : null;
      if (outside) r.fail(`${label} (${holder.name}) stängs i finally, men ${jsrc(outside.node, 40)} står före det try-blocket: kastar den ett Exception körs finally aldrig, och ${holder.name} förblir öppen.`, WHY.closeNotFinally);
      else if (finTries.length) r.note(`${label} stängs med ${holder.name}.close() i finally.`, WHY.finally);
      else if (closes.length) notFinally.push(holder.name);
      else if (label === "ResultSet") r.fail(`ResultSet (${holder.name}) öppnas av executeQuery() men står inte i något try-with-resources. Den stängs visserligen när PreparedStatement stängs, men kursen och lösningsförslaget stänger varje resurs som metoden öppnar uttryckligen: ResultSet i ett eget try-with-resources.`, WHY.rsResource);
      else never.push(`${label} (${holder.name})`);
    }
  };
  const gets = F.calls.filter((c) => c.node.name === "getConnection");
  const stmts = F.calls.filter((c) => ["prepareStatement", "prepareCall", "createStatement"].includes(c.node.name));
  // ResultSet rättas bara för en SELECT; executeQuery på en annan sats underkänns i regel 6.
  const rss = C.sqlKind === "SELECT" ? F.calls.filter((c) => c.node.name === "executeQuery") : [];
  checkOpened("Connection", gets, WHY.resources);
  checkOpened("PreparedStatement", stmts, WHY.resources);
  checkOpened("ResultSet", rss, WHY.rsResource);
  if (never.length) r.fail(`${listJoin(never)} stängs aldrig.`, WHY.resources);
  if (notFinally.length) r.fail(`${listJoin(notFinally.map((n) => `${n}.close()`))} står inte i finally: kastas ett Exception före ${notFinally.length === 1 ? "raden" : "raderna"} stängs ${notFinally.length === 1 ? "resursen" : "resurserna"} aldrig.`, WHY.closeNotFinally);
  if (!gets.length && !stmts.length) { r.na("Inga resurser öppnas i metoden (se regel 4)."); return r.build(); }
  if (r.empty) r.ok(`${listJoin(okLabels)} öppnas i try-with-resources och stängs automatiskt, också vid fel.`);
  return r.build();
}

// ---------- Regel 8: ResultSet ----------

// Hur en rad blir ett objekt: new Model(…), new Model() + set-metoder, eller en hjälpmetod.
function findConstructions(C) {
  const model = C.check.result?.model;
  if (!model) return [];
  const out = [];
  const fromFacts = (F, R, helper) => {
    for (const n of F.news) {
      if (simple(n.node.type.replace(/<.*$/, "")) !== model) continue;
      const holder = R.holderOf(n.node);
      const setters = holder ? F.calls.filter((c) => targetName(c) === holder.name && /^set[A-Z]/.test(c.node.name) && c.node.args.length === 1 && c.pos > n.pos) : [];
      out.push({ node: n.node, ctx: n.ctx, pos: n.pos, holder, form: n.node.args.length ? "ctor" : "setters", args: n.node.args, setters, F, R, helper });
    }
  };
  fromFacts(C.F, C.R, null);
  for (const h of C.helpers) {
    if (simple(normType(h.m.returnType)) !== model) continue;
    const before = out.length;
    fromFacts(h.F, h.R, h);
    // Hjälpmetodens konstruktion räknas där hjälpmetoden anropas.
    const made = out.splice(before);
    const calls = C.F.calls.filter((c) => (!c.node.target || jsrc(c.node.target) === "this") && c.node.name === h.m.name);
    for (const call of calls) for (const x of made) out.push({ ...x, node: call.node, ctx: call.ctx, pos: call.pos, holder: C.R.holderOf(call.node), inner: x.node, helper: h });
  }
  return out;
}

function getterInfo(C, e, R, method) {
  let g = R.resolve(e, e?.pos);
  // rs.getBigDecimal("Price").doubleValue(): värdet kommer ur raden, get-metoden rättas nedan.
  if (g?.k === "call" && /^(double|int|long|float|short)Value$/.test(g.name) && !g.args.length && g.target) g = R.resolve(g.target, g.pos);
  if (g?.k !== "call" || !/^get[A-Z]/.test(g.name) || g.args.length !== 1 || g.target?.k !== "name") return null;
  const t = g.target.name;
  const isRs = C.rsNames.has(t) || normType(R.declBefore(t, g.pos)?.type) === "ResultSet";
  // I en hjälpmetod är ResultSet en parameter.
  const helperRs = R.isParam(t, g.pos) && normType(method?.params.find((x) => x.name === t)?.type) === "ResultSet";
  if (!isRs && !helperRs) return null;
  const a = g.args[0];
  const info = { getter: g.name, node: g, rs: t, src: jsrc(g, 50) };
  if (a.k === "lit" && a.type === "String") return { ...info, column: a.value };
  if (a.k === "lit" && a.type === "int") {
    const item = C.sql?.parsed?.select?.[a.value - 1];
    return { ...info, index: a.value, column: item?.k === "col" ? item.alias ?? item.name : null };
  }
  return { ...info, column: null };
}

// return rs.next() ? new Model(…) : null; bygger objektet bara när next() gav en rad (och rs.next() ? null : … tvärtom).
function inNextTernary(F, node) {
  const isNext = (e) => e?.k === "call" && e.name === "next" && !e.args.length;
  const walk = (e) => {
    if (!e || typeof e !== "object") return false;
    if (e.k === "cond" && ((isNext(e.test) && e.a === node) || (e.test?.k === "unary" && e.test.op === "!" && isNext(e.test.expr) && e.b === node))) return true;
    return ["target", "left", "right", "expr", "test", "a", "b", "value", "index"].some((k) => walk(e[k])) || (e.args ?? []).some(walk);
  };
  return [...F.returns.map((x) => x.expr), ...F.decls.map((d) => d.init), ...F.assigns.map((a) => a.value)].some(walk);
}

function ruleResultSet(C) {
  const { F, check } = C;
  const res = check.result ?? {};
  const r = ruleBuilder(JAVA_RULES[7], WHY.cursor);
  if ((check.sql?.kind ?? C.sqlKind) !== "SELECT" || !["list", "single", "scalar", "exists"].includes(res.kind)) {
    r.na(`Satsen är en ${check.sql?.kind ?? C.sqlKind}, så det finns inget ResultSet att läsa.`);
    return r.build();
  }
  const P = C.sql?.parsed;
  if (notCounted(C)) {
    r.na("Frågan räknar inte med COUNT(*) (se regel 2), så det finns inget tal att läsa ur raden.");
    return r.build();
  }
  for (const c of F.calls.filter((x) => x.node.name === "executeQuery")) {
    const h = C.R.holderOf(c.node);
    const bad = wrongDeclType(h?.decl, "ResultSet");
    if (bad) r.fail(`Variabeln ${h.name} har typen ${bad}, men executeQuery() returnerar ett ResultSet.`, WHY.cursor);
  }
  const rsList = [...C.rsNames];
  const rs = rsList[0] ?? "resultSet";
  const allNexts = [C, ...C.helpers].flatMap((x) => x.F.calls.filter((c) => c.node.name === "next" && !c.node.args.length && (C.rsNames.has(targetName(c)) || x !== C)));
  // Var next() står: i villkoret för while/for ("while"), do-while ("do"), if ("if"), if med ! ("ifnot"),
  // i return eller någon annanstans. !rs.next() i en loop läser bara när ingen rad finns.
  const how = (c) => {
    const fr = innermost(c.ctx);
    const cond = fr?.node?.cond;
    const negated = cond?.k === "unary" && cond.op === "!" && containsCall(cond.expr, (x) => x === c.node);
    if (fr?.kind === "loop" && (fr.part === "cond" || fr.part === "head")) return negated ? "other" : fr.node.k === "do" ? "do" : "while";
    if (fr?.kind === "if" && fr.part === "cond") return negated ? "ifnot" : "if";
    if (fr?.kind === "return") return "return";
    return "other";
  };
  // do { … } while (rs.next()) kör blocket innan villkoret prövas. Det läser rätt bara efter ett if som
  // redan har flyttat markören till första raden: if (rs.next()) { do … } eller if (!rs.next()) return …; do ….
  const doHead = allNexts.find((c) => how(c) === "do");
  const doGuard = doHead && allNexts.find((g) => {
    if (g === doHead || g.pos > innermost(doHead.ctx).node.pos) return false;
    const ifNode = innermost(g.ctx).node;
    if (how(g) === "if") return inIfThen(doHead.ctx, ifNode);
    return how(g) === "ifnot" && !inIfThen(doHead.ctx, ifNode) && !completes(ifNode.then);
  });
  const readHead = allNexts.find((c) => how(c) === "while") ?? (doGuard ? doHead : null);
  const rows = res.rows ?? (res.kind === "list" ? "many" : "one");
  // ResultSet-variabeln finns bara i sitt block: efter try-blockets } går den inte att läsa.
  const lostRs = F.calls.find((c) => (c.node.name === "next" || /^get[A-Z]/.test(c.node.name)) && C.rsNames.has(targetName(c)) && !isDeclared(C, targetName(c), c.pos) && C.R.declBefore(targetName(c), c.pos));
  if (lostRs) {
    const name = targetName(lostRs);
    r.fail(`${name} deklareras på rad ${C.R.declBefore(name, lostRs.pos).line} inne i ett block som redan har stängts, så ${jsrc(lostRs.node, 30)} på rad ${lostRs.node.line} kompilerar inte. Läs raderna inne i det block där ResultSet öppnas.`, WHY.scope);
  }
  if (!allNexts.length) {
    r.fail(`${rs}.next() anropas aldrig: markören står före första raden, och get-metoderna har ingen rad att läsa.`, WHY.cursor);
  } else if (rows === "many" && !readHead) {
    const badLoop = allNexts.map((c) => innermost(c.ctx)).find((fr) => fr?.kind === "loop" && fr.part !== "body");
    r.fail(badLoop?.node.k === "do" ? `do { … } while (${rs}.next()) kör blocket en gång innan villkoret prövas, så första varvet läser en rad som ${rs}.next() aldrig har bekräftat; utan rader kastar get-metoderna SQLException. Skriv while (${rs}.next()) { … }.`
      : badLoop ? `while (!${rs}.next()) kör blocket bara när det inte finns någon rad att läsa: skriv while (${rs}.next()).`
      : `${allNexts.some((c) => how(c) === "if") ? `if (${rs}.next()) läser bara första raden` : `${rs}.next() anropas bara en gång`}, men frågan kan ge flera rader: while (${rs}.next()).`, WHY.cursor);
  } else if (rows === "one" && allNexts.every((c) => how(c) === "while")) {
    r.note(`while (${rs}.next()) fungerar, men frågan ger högst en rad, och if (${rs}.next()) visar det.`, WHY.cursor);
  }
  // Varje next() flyttar markören en rad. Ett extra anrop före läsloopen (eller läs-if:en), eller i loopen,
  // hoppar över en rad. Bara metodens egna anrop räknas; en hjälpmetod läser raden den får.
  const readOne = rows === "one" ? allNexts.find((c) => ["if", "ifnot", "while"].includes(how(c)) && C.F.calls.includes(c)) : null;
  const reader = rows === "many" ? readHead : readOne;
  if (reader && C.F.calls.includes(reader)) {
    const at = innermost(reader.ctx).node;
    const own = F.calls.filter((c) => c !== reader && c !== doGuard && c.node.name === "next" && !c.node.args.length && C.rsNames.has(targetName(c)));
    const extra = own.filter((c) => c.pos < at.pos || (rows === "many" && inLoopBody(c.ctx, at)));
    if (extra.length) {
      const loopWord = rows === "many" ? `while (${rs}.next())` : `${jsrc(at.cond, 30).startsWith("!") ? "if (!" : "if ("}${rs}.next())`;
      r.fail(`${rs}.next() anropas också på rad ${extra[0].node.line ?? "?"}, utöver ${loopWord}. Varje anrop flyttar markören en rad, så en rad hoppas över: låt ${loopWord} vara det enda anropet.`, WHY.cursor);
    }
  }

  const colMatches = (got, wantCol) => {
    if (!got) return false;
    if (fold(got) === fold(wantCol)) return true;
    return (P?.select ?? []).some((i) => i.k === "col" && i.alias && fold(i.alias) === fold(got) && fold(i.name) === fold(wantCol));
  };

  if (res.kind === "list" || res.kind === "single") {
    const cons = findConstructions(C);
    const fields = res.fields ?? [];
    const readLoop = readHead;
    const readIf = allNexts.find((c) => how(c) === "if");
    const loopNode = readLoop ? innermost(readLoop.ctx).node : null;
    const ifNode = readIf ? innermost(readIf.ctx).node : null;
    const chosen = cons.find((x) => (loopNode && inLoopBody(x.ctx, loopNode)) || (ifNode && inIfThen(x.ctx, ifNode))) ?? cons[0];
    if (!chosen) {
      r.fail(`Inget ${res.model}-objekt skapas av raderna: varje rad ska bli new ${res.model}(…).`, WHY.model);
    } else {
      const { R: hr, m: hm } = chosen.helper ?? { R: C.R, m: C.m };
      if (chosen.helper) {
        if (!chosen.helper.m.throws.map(simple).includes("SQLException")) r.fail(`Hjälpmetoden ${chosen.helper.m.name} anropar get-metoder på ResultSet men deklarerar inte throws SQLException.`, WHY.helperThrows);
      }
      const badModel = wrongDeclType(chosen.holder?.decl, res.model);
      if (badModel && !chosen.helper) r.fail(`Variabeln ${chosen.holder.name} har typen ${badModel}, men objektet är ett ${res.model}.`, WHY.model);
      // findBy: objektet byggs bara där next() har gett en rad, i if (rs.next()) { … } eller efter if (!rs.next()) return null;.
      if (res.kind === "single" && allNexts.length && !(loopNode && inLoopBody(chosen.ctx, loopNode))) {
        const guard = allNexts.find((c) => how(c) === "ifnot");
        const guardNode = guard ? innermost(guard.ctx).node : null;
        const readHere = (ctx, pos) => (ifNode ? inIfThen(ctx, ifNode)
          : !!guardNode && pos > guardNode.pos && !inIfThen(ctx, guardNode) && !completes(guardNode.then));
        // Med set-metoder är det de som läser raden; ett objekt som skapas för tidigt rättas i regel 9.
        const read = inNextTernary(F, chosen.node) || (chosen.form === "setters" && chosen.setters.length && !chosen.helper
          ? chosen.setters.every((x) => readHere(x.ctx, x.pos))
          : readHere(chosen.ctx, chosen.pos));
        if (!read) r.fail(`${res.model}-objektet byggs utan att ${rs}.next() har gett en rad: skapa det i if (${rs}.next()) { … }.`, WHY.cursor);
      }
      if (res.kind === "list" && loopNode && !inLoopBody(chosen.ctx, loopNode)) r.fail(`${res.model}-objektet skapas utanför while-loopen, så bara en rad blir ett objekt.`, WHY.inLoop);
      const node = chosen.inner ?? chosen.node;
      if (chosen.form === "ctor") {
        if (chosen.args.length !== fields.length) {
          r.fail(`new ${res.model}(…) får ${chosen.args.length} argument, men konstruktorn tar ${fields.length}: ${fields.map((f) => f.column).join(", ")}, i den ordningen.`, WHY.fields);
        } else {
          let orderReported = false;
          fields.forEach((f, i) => {
            const info = getterInfo(C, chosen.args[i], hr, hm);
            if (!info) { r.fail(`Argument ${i + 1} till new ${res.model}(…) är ${jsrc(chosen.args[i], 40)}, inte ett värde ur raden — det ska vara ${rs}.${f.getter}("${f.column}").`, WHY.fields); return; }
            if (info.column && !colMatches(info.column, f.column)) {
              const j = fields.findIndex((x) => colMatches(info.column, x.column));
              if (j >= 0 && !orderReported) { orderReported = true; r.fail(`Argumenten till new ${res.model}(…) står i fel ordning: ${ordinal(i + 1)} argumentet är ${info.column}, men konstruktorns ${ordinal(i + 1)} parameter hör till ${f.column}.`, WHY.ctorOrder); }
              else if (j < 0) r.fail(`Argument ${i + 1} läser kolumnen ${info.column}, som inte hör till ${res.model} — det ska vara ${f.column}.`, WHY.fields);
              return;
            }
            if (info.getter !== f.getter) r.fail(`${f.column} läses med ${info.getter}, men ska läsas med ${f.getter}.`, WHY.getterType);
            else if (info.index) r.note(`${info.src} läser ${f.column} med index; skriv kolumnnamnet: ${info.rs}.${f.getter}("${f.column}").`, WHY.getters);
            else if (!info.column) r.fail(`${info.src}: kolumnen ska anges med sitt namn, "${f.column}".`, WHY.getters);
          });
        }
      } else {
        const setterFits = (setter, column) => {
          const s = fold(setter.replace(/^set/, ""));
          const c = fold(column);
          return s === c || c.endsWith(s) || s.endsWith(c);
        };
        for (const f of fields) {
          const s = chosen.setters.find((x) => colMatches(getterInfo(C, x.node.args[0], hr, hm)?.column, f.column));
          if (!s) { r.fail(`${f.column} läses aldrig in i ${res.model}-objektet.`, WHY.fields); continue; }
          const info = getterInfo(C, s.node.args[0], hr, hm);
          if (info.getter !== f.getter) r.fail(`${f.column} läses med ${info.getter}, men ska läsas med ${f.getter}.`, WHY.getterType);
          if (!setterFits(s.node.name, f.column)) {
            const other = fields.find((x) => x !== f && setterFits(s.node.name, x.column));
            if (other) r.fail(`${s.node.name} får värdet från ${f.column}, men hör till ${other.column}.`, WHY.fields);
          }
        }
      }
      if (res.kind === "list") {
        const adds = F.calls.filter((c) => c.node.name === "add" && c.node.args.length === 1 && c.node.target);
        const addsThis = adds.filter((c) => {
          const a = C.R.resolve(c.node.args[0], c.pos);
          return a === chosen.node || a === node;
        });
        if (!addsThis.length) r.fail(`${res.model}-objektet läggs aldrig i listan: ${listVarName(C) ?? "listan"}.add(…) saknas i loopen.`, WHY.add);
        else if (loopNode && !addsThis.some((c) => inLoopBody(c.ctx, loopNode))) r.fail(`${jsrc(addsThis[0].node)} står utanför loopen, så bara sista raden hamnar i listan.`, WHY.inLoop);
      }
      if (chosen.helper && !r.failed) r.note(`Raden görs om till ett ${res.model}-objekt i hjälpmetoden ${chosen.helper.m.name}. Det fungerar, men uppgiften ber om bara den efterfrågade metoden.`, WHY.helper);
    }
  }

  if (res.kind === "scalar" || (res.kind === "exists" && isCountSql(P))) {
    const getters = F.calls.filter((c) => C.rsNames.has(targetName(c)) && /^get[A-Z]/.test(c.node.name));
    const wantGetter = res.getter ?? "getInt";
    if (!getters.length) r.fail(`Talet i raden läses aldrig: ${rs}.${wantGetter}(1) saknas.`, WHY.scalar);
    else {
      const g = getters[0];
      const a = g.node.args[0];
      const src = jsrc(g.node, 50);
      const countItem = P?.select?.length === 1 && P.select[0].k === "count" ? P.select[0] : null;
      const alias = countItem?.alias ?? (P?.select?.[0]?.k === "col" ? P.select[0].alias ?? P.select[0].name : null);
      if (g.node.name !== wantGetter) r.fail(`${src} läser talet med ${g.node.name}, men det ska läsas med ${wantGetter}.`, WHY.getterType);
      if (a?.k === "lit" && a.type === "int") {
        if (a.value !== 1) r.fail(`${src}: frågan har en enda kolumn, så den läses med ${wantGetter}(1).`, WHY.scalar);
      } else if (a?.k === "lit" && a.type === "String") {
        if (!alias) r.fail(`${src} letar efter en kolumn som heter ${a.value}, men COUNT(*) har inget alias i frågan. Skriv COUNT(*) AS ${a.value} eller läs med ${wantGetter}(1).`, WHY.scalar);
        else if (fold(alias) !== fold(a.value)) r.fail(`Aliaset i frågan är ${alias}, men ${src} läser ${a.value}.`, WHY.scalar);
      }
    }
  }
  if (r.empty) {
    const loopText = rows === "many" ? `while (${rs}.next()) läser varje rad` : `${rs}.next() flyttar markören till raden`;
    r.ok(res.kind === "list" || res.kind === "single"
      ? `${loopText}, och varje kolumn läses med rätt get-metod och kolumnnamn${res.kind === "list" ? "; objektet läggs i listan" : ""}.`
      : `${loopText}, och värdet läses med rätt get-metod.`);
  }
  return r.build();
}

const isCountSql = (P) => P?.select?.length === 1 && P.select[0].k === "count";
// Uppgiften räknar med COUNT(*), men svarets SELECT gör det inte: regel 2 underkänns,
// och reglerna om talet i raden (8 och 9) gäller då inte svaret.
const notCounted = (C) => C.check.result?.kind === "scalar" && !!C.check.sql?.count && C.sql?.parsed?.kind === "SELECT" && !isCountSql(C.sql.parsed);

function listVarName(C) {
  const d = C.F.decls.find((x) => x.init?.k === "new" && /List</.test(x.init.type));
  return d?.name ?? null;
}

// ---------- Regel 9: returvärdet ----------

function completes(s) {
  if (!s) return true;
  switch (s.k) {
    case "return": case "throw": return false;
    case "block": return s.stmts.every(completes);
    case "if": return !s.else || completes(s.then) || completes(s.else);
    case "while": return !(s.cond?.k === "lit" && s.cond.value === true);
    case "try": {
      if (s.fin && !completes(s.fin)) return false;
      return completes(s.block) || s.catches.some((c) => completes(c.block));
    }
    default: return true;
  }
}

function ruleReturn(C) {
  const { F, R, check, m } = C;
  const res = check.result ?? {};
  const r = ruleBuilder(JAVA_RULES[8], WHY.list);
  if (res.kind === "affected") { r.na("Returvärdet är antalet rader från executeUpdate() (se regel 6)."); return r.build(); }
  if (res.kind === "void" || !res.kind) {
    const valued = F.returns.find((x) => x.expr);
    if (valued && normType(m.returnType) === "void") r.fail(`Metoden är void, men rad ${valued.line} returnerar ${jsrc(valued.expr, 40)}; det kompilerar inte.`, WHY.voidReturn);
    else r.na("Metoden returnerar inget värde.");
    return r.build();
  }
  if (notCounted(C)) { r.na("Frågan räknar inte med COUNT(*) (se regel 2), så det finns inget tal ur raden att returnera."); return r.build(); }
  const nonVoid = normType(m.returnType) !== "void";
  const isNull = (e) => e?.k === "lit" && e.type === "null";
  // Grenarna i ett villkorsuttryck: return list.isEmpty() ? null : list kan ge null.
  const branches = (e) => (e?.k === "cond" ? [...branches(e.a), ...branches(e.b)] : [e]);
  const nullReturns = F.returns.filter((x) => branches(x.expr).some(isNull));

  if (res.kind === "list") {
    const adds = F.calls.filter((c) => c.node.name === "add" && c.node.target?.k === "name");
    const listName = adds[0]?.node.target.name ?? listVarName(C);
    const decl = listName ? R.declBefore(listName, Infinity) : null;
    const creations = listName ? R.allValues(listName).filter((v) => v.expr?.k === "new") : [];
    const loop = F.loops.find((l) => containsCall(l.node.cond, (c) => c.name === "next"))?.node ?? F.loops[0]?.node;
    if (!listName || !creations.length) {
      r.fail(`Listan skapas aldrig: ${normType(m.returnType)} ${listName ?? "list"} = new ArrayList<>(); saknas före loopen.`, WHY.list);
    } else {
      const created = creations[0];
      if (loop && inLoopBody(created.ctx, loop)) r.fail(`Listan skapas inne i loopen, så den börjar om för varje rad och bara sista raden blir kvar.`, WHY.list);
      else if (created.ctx.some((fr) => fr.kind === "if" && fr.part === "then" && containsCall(fr.node.cond, (c) => c.name === "next"))) r.fail("Listan skapas bara om frågan ger en rad; annars returneras null i stället för en tom lista.", WHY.list);
      if (decl && isNull(decl.init) && !creations.some((c) => !c.ctx.some((fr) => fr.kind === "if" || fr.kind === "loop"))) {
        if (!r.failed) r.fail(`${listName} börjar som null och får en lista bara ibland; skapa listan direkt: ${listName} = new ArrayList<>().`, WHY.list);
      }
      const declType = decl ? normType(decl.type) : null;
      const wantList = normType(check.method?.returns ?? m.returnType);
      const fits = declType === wantList || (wantList.startsWith("List<") && declType === wantList.replace(/^List/, "ArrayList"));
      if (declType && declType !== "var" && !fits) {
        r.fail(/^List</.test(declType) && wantList.startsWith("ArrayList")
          ? `${listName} är deklarerad som ${decl.type}, men metoden returnerar ${check.method?.returns ?? m.returnType}; det kompilerar inte.`
          : `${listName} har typen ${decl.type}, men ska vara ${check.method?.returns ?? m.returnType}.`, WHY.listType);
      }
      const madeAs = simple(created.expr.type.replace(/<.*$/, ""));
      const wantBase = wantList.replace(/<.*$/, "");
      if (madeAs !== wantBase && !(wantBase === "List" && madeAs === "ArrayList")) r.fail(`new ${created.expr.type}() skapar ingen ${wantBase}: skriv new ArrayList<>().`, WHY.listType);
      const returnsList = F.returns.some((x) => branches(x.expr).some((e) => e?.k === "name" && e.name === listName));
      const lost = F.returns.find((x) => branches(x.expr).some((e) => e?.k === "name" && e.name === listName) && !isDeclared(C, listName, x.pos));
      if (lost) r.fail(...undeclaredAt(C, listName, lost));
      else if (!returnsList) {
        const other = F.returns.find((x) => x.expr && !isNull(x.expr));
        r.fail(other ? `Metoden returnerar ${jsrc(other.expr, 40)}, inte listan ${listName}.` : `Metoden returnerar aldrig listan ${listName}.`, WHY.list);
      } else if (loop && F.returns.some((x) => x.expr?.k === "name" && x.expr.name === listName && inLoopBody(x.ctx, loop))) {
        r.fail("return står inne i loopen, så metoden returnerar efter första raden.", WHY.list);
      }
    }
    if (nullReturns.length) r.fail(`Metoden kan returnera null (rad ${nullReturns[0].line}), men ska alltid returnera en lista, tom om inga rader finns.`, WHY.list);
  }

  if (res.kind === "single") {
    const cons = findConstructions(C).map((x) => x.node);
    const kinds = new Set();
    const classify = (e, pos, depth = 0) => {
      if (!e || depth > 8) return;
      if (isNull(e)) { kinds.add("null"); return; }
      if (cons.includes(e)) { kinds.add("obj"); return; }
      if (e.k === "cond") { classify(e.a, pos, depth + 1); classify(e.b, pos, depth + 1); return; }
      if (e.k === "name" && !R.isParam(e.name, pos)) {
        const decl = R.declBefore(e.name, pos);
        const values = R.allValues(e.name);
        if (decl && !decl.init && !values.length) return;
        for (const v of values) classify(v.expr, v.pos, depth + 1);
        // Ett objekt som skapas tomt och fylls med set-metoder är inte null när ingen rad finns.
        return;
      }
      kinds.add("other");
    };
    for (const ret of F.returns) classify(ret.expr, ret.pos);
    const objEmpty = findConstructions(C).find((x) => x.form === "setters" && !x.ctx.some((fr) => fr.kind === "if" || fr.kind === "loop"));
    if (!kinds.has("obj")) r.fail(`Metoden returnerar aldrig det ${res.model}-objekt som byggs av raden.`, WHY.single);
    if (!kinds.has("null") || objEmpty) r.fail(objEmpty ? `${res.model}-objektet skapas innan raden lästs, så metoden returnerar ett tomt objekt i stället för null när ingen rad finns.` : `När ingen rad finns ska metoden returnera null, men den gör det aldrig.`, WHY.single);
  }

  if (res.kind === "scalar") {
    const fromGetter = (e, pos, depth = 0) => {
      if (!e || depth > 8) return false;
      if (e.k === "call" && C.rsNames.has(e.target?.name) && /^get[A-Z]/.test(e.name)) return true;
      if (e.k === "cast") return fromGetter(e.expr, pos, depth + 1);
      if (e.k === "cond") return fromGetter(e.a, pos, depth + 1) || fromGetter(e.b, pos, depth + 1);
      if (e.k === "name" && !R.isParam(e.name, pos)) return R.allValues(e.name).some((v) => fromGetter(v.expr, v.pos, depth + 1));
      return false;
    };
    if (!F.returns.some((x) => fromGetter(x.expr, x.pos))) {
      const ret = F.returns.find((x) => x.expr);
      r.fail(`Metoden returnerar ${ret ? jsrc(ret.expr, 40) : "inget"}, inte talet ur raden.`, WHY.scalar);
    }
  }

  if (res.kind === "exists") {
    const P = C.sql?.parsed;
    const counted = isCountSql(P);
    const facts = { next: false, cmp: false, badCmp: false, trueInIf: false, falseLit: false, other: false, inverted: false, trueOutside: false, negFalse: false };
    const isNext = (e) => e?.k === "call" && e.name === "next";
    // if (!resultSet.next()) vänder svaret: där ska false stå i grenen och true efteråt.
    const negatedNext = (cond) => cond?.k === "unary" && cond.op === "!" && containsCall(cond.expr, (c) => c.name === "next");
    const isGetter = (e) => e?.k === "call" && /^get[A-Z]/.test(e.name);
    // Talet ur raden jämfört med en konstant, prövat för antalet 0 och 1: [svar vid 0, svar vid 1].
    // Rätt jämförelse ger false vid 0 och true vid 1 (count > 0, 0 < count, count >= 1, count != 0).
    const OPS = { ">": (a, b) => a > b, "<": (a, b) => a < b, ">=": (a, b) => a >= b, "<=": (a, b) => a <= b, "==": (a, b) => a === b, "!=": (a, b) => a !== b };
    const FLIP = { ">": "<", "<": ">", ">=": "<=", "<=": ">=", "==": "==", "!=": "!=" };
    const countAt = (e, pos, depth = 0) => {
      if (e?.k === "unary" && e.op === "!" && depth < 8) { const at = countAt(R.resolve(e.expr, pos), pos, depth + 1); return at && at.map((x) => !x); }
      if (e?.k !== "bin" || !OPS[e.op]) return null;
      const left = R.resolve(e.left, pos), right = R.resolve(e.right, pos);
      const [op, k] = isGetter(left) ? [e.op, right] : isGetter(right) ? [FLIP[e.op], left] : [];
      if (!op) return null;
      if (k?.k !== "lit" || k.type !== "int") return [false, true]; // okänd konstant: som förut, godtas
      return [OPS[op](0, k.value), OPS[op](1, k.value)];
    };
    const judge = (at, neg) => { if (at[0] !== neg || at[1] === neg) facts.badCmp = true; else facts.cmp = true; };
    const isBool = (x) => x?.k === "lit" && x.type === "boolean";
    // neg: uttrycket står under ett ! (direkt eller via en variabel), så svaret vänds.
    const classify = (e, pos, ctx, depth = 0, neg = false) => {
      if (!e || depth > 8) return;
      if (e.k === "unary" && e.op === "!") { classify(e.expr, pos, ctx, depth + 1, !neg); return; }
      if (e.k === "cond") {
        if (isBool(e.a) && isBool(e.b) && e.a.value !== e.b.value) { classify(e.test, pos, ctx, depth + 1, e.a.value ? neg : !neg); return; }
        if (containsCall(e.test, (c) => c.name === "next")) facts.next = true;
        else if (containsCall(e.test, (c) => /^get[A-Z]/.test(c.name))) facts.cmp = true;
        else { classify(e.a, pos, ctx, depth + 1, neg); classify(e.b, pos, ctx, depth + 1, neg); }
        return;
      }
      if (isNext(e)) { if (neg) facts.inverted = true; else facts.next = true; return; }
      const at = countAt(e, pos);
      if (at) { judge(at, neg); return; }
      if (e.k === "lit" && e.type === "boolean") {
        const value = neg ? !e.value : e.value;
        const nextIf = ctx.find((fr) => fr.kind === "if" && fr.part === "then" && containsCall(fr.node.cond, (c) => c.name === "next"));
        if (nextIf && negatedNext(nextIf.node.cond)) {
          if (value) facts.inverted = true;
          else { facts.trueInIf = true; facts.negFalse = true; }
          return;
        }
        const getIf = !nextIf && ctx.find((fr) => fr.kind === "if" && fr.part === "then" && containsCall(fr.node.cond, (c) => /^get[A-Z]/.test(c.name)));
        const ifAt = getIf && countAt(getIf.node.cond, pos);
        if (ifAt) { judge(ifAt, !value); return; }
        if (!value) { facts.falseLit = true; return; }
        if (nextIf) facts.trueInIf = true;
        else if (getIf) facts.cmp = true;
        else if (ctx.some((fr) => fr.kind === "loop" && fr.part === "body")) facts.trueInIf = true;
        else { facts.other = true; facts.trueOutside = true; }
        return;
      }
      if (e.k === "name" && !R.isParam(e.name, pos)) {
        for (const v of R.allValues(e.name)) classify(v.expr, v.pos, v.ctx ?? ctx, depth + 1, neg);
        return;
      }
      if (e.k === "bin" && (e.op === "&&" || e.op === "||")) { classify(e.left, pos, ctx, depth + 1, neg); classify(e.right, pos, ctx, depth + 1, neg); return; }
      facts.other = true;
    };
    for (const ret of F.returns) classify(ret.expr, ret.pos, ret.ctx);
    if (facts.inverted) r.fail("Svaret är omvänt: metoden svarar true när ingen rad finns.", WHY.exists);
    else if (counted && facts.badCmp) r.fail("Jämförelsen med talet från COUNT(*) ger fel svar: den ska ge false när talet är 0 och true när det är 1 eller mer, som count > 0.", WHY.exists);
    else if (counted && (facts.next || facts.trueInIf) && !facts.cmp) r.fail("Med COUNT(*) är resultSet.next() alltid true, så metoden svarar true också när ingen rad finns. Jämför talet med 0.", WHY.existsCount);
    else if (!counted && !facts.next && !facts.trueInIf) r.fail("Svaret ska bero på om frågan gav en rad: return resultSet.next(), eller true i if (resultSet.next()) och annars false.", WHY.exists);
    else if (counted && !facts.cmp) r.fail("Talet från COUNT(*) ska jämföras med 0: return count > 0.", WHY.exists);
    else if (!counted && facts.trueOutside && !facts.negFalse) {
      const rs = [...C.rsNames][0] ?? "resultSet";
      r.fail(`true sätts utan att frågan har gett en rad, så metoden svarar true också när ingen rad finns. Sätt true i if (${rs}.next()), eller returnera ${rs}.next().`, WHY.exists);
    }
  }

  if (nonVoid && completes(C.body)) r.fail("Metoden kan nå slutet utan return.", WHY.missingReturn);
  if (res.kind !== "list") {
    const boxed = { int: "Integer", double: "Double", boolean: "Boolean", long: "Long" };
    // Mot uppgiftens returtyp: en felskriven returtyp i signaturen underkänns i regel 1.
    const wantText = check.method?.returns ?? m.returnType;
    const want = normType(wantText);
    for (const ret of F.returns) {
      if (ret.expr?.k !== "name" || R.isParam(ret.expr.name, ret.pos)) continue;
      if (!isDeclared(C, ret.expr.name, ret.pos)) { r.fail(...undeclaredAt(C, ret.expr.name, ret)); continue; }
      const decl = R.declBefore(ret.expr.name, ret.pos);
      if (!decl) continue;
      const bad = wrongDeclType(decl, want, boxed[want] ?? want);
      if (bad) r.fail(`${decl.name} har typen ${bad}, men metoden returnerar ${wantText}.`, WHY.returnType);
    }
  }
  if (r.empty) {
    r.ok({
      list: "Listan skapas före loopen och returneras, tom om inga rader finns — aldrig null.",
      single: `Metoden returnerar ${res.model}-objektet när raden finns och annars null.`,
      scalar: "Metoden returnerar talet ur raden.",
      exists: "Metoden returnerar true när en rad finns och annars false.",
    }[res.kind] ?? "Returvärdet stämmer.");
  }
  return r.build();
}

// ---------- Regel 10: undantag ----------

function ruleExceptions(C) {
  const r = ruleBuilder(JAVA_RULES[9], WHY.exceptions);
  const all = [C, ...C.helpers].flatMap((x) => x.F.catches.map((c) => ({ ...c, F: x.F })));
  for (const c of all) {
    const types = c.clause.types.map(simple);
    const caught = types.find((t) => ["SQLException", "Exception", "Throwable"].includes(t));
    if (!caught) continue;
    const rethrows = c.F.throwStmts.some((t) => t.ctx.some((fr) => fr.clause === c.clause));
    const head = `catch (${c.clause.types.join(" | ")} ${c.clause.name})`;
    if (!rethrows) {
      const prints = c.F.calls.some((x) => x.ctx.some((fr) => fr.clause === c.clause) && /^(printStackTrace|println|print|printf)$/.test(x.node.name));
      r.fail(`${head} på rad ${c.clause.line} fångar felet utan att kasta det vidare${prints ? " — det skrivs bara ut" : ""}.`, WHY.exceptions);
    } else {
      r.note(`${head} på rad ${c.clause.line} kastar felet vidare.`, WHY.rethrow);
    }
  }
  if (r.empty) r.ok("SQLException fångas inte i metoden; felet når anroparen, som signaturen säger.");
  return r.build();
}
