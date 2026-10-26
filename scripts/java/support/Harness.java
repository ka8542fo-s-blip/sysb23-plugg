import java.lang.reflect.Array;
import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

// Harnessens databas och utskrift. Det genererade VerifyDriver anropar
// begin() före varje fall (tabellerna skapas på nytt ur uppgiftens DDL och
// fylls), anropar lösningens metod och sedan end(), som skriver en rad
// "@@CASE {json}" med returvärde, undantag, tabellerna före och efter, vilka
// resurser som öppnades och stängdes och varje ResultSets kolumner och lästa
// rader. Node-skriptet jämför.
public final class Harness {
    public static final String URL = "jdbc:h2:mem:verify;MODE=MSSQLServer;DATABASE_TO_UPPER=FALSE;"
            + "CASE_INSENSITIVE_IDENTIFIERS=TRUE;IGNORECASE=TRUE;DB_CLOSE_DELAY=-1";

    // Returvärdet från en void-metod.
    public static final Object VOID = new Object();

    private static Connection raw;
    private static String[] ddl;
    private static String[] tables;
    private static int index;
    private static String fault;
    private static String before;

    private Harness() {
    }

    public static void setup(String[] ddlBlocks, String[] tableNames) {
        ddl = ddlBlocks;
        tables = tableNames;
        try {
            raw = DriverManager.getConnection(URL);
        } catch (SQLException e) {
            System.out.println("@@FATAL " + Json.str(e.getMessage()));
            System.exit(3);
        }
    }

    public static boolean begin(int caseIndex, String[] seed, String faultKind) {
        index = caseIndex;
        fault = faultKind;
        String step = "DROP ALL OBJECTS";
        try (Statement s = raw.createStatement()) {
            s.execute(step);
            for (String d : ddl) {
                step = d;
                s.execute(d);
            }
            for (String row : seed) {
                step = row;
                s.execute(row);
            }
            step = "identitetskolumnerna";
            restartIdentities(s);
            before = snapshot();
            if (fault.equals("drop-table")) {
                step = "DROP ALL OBJECTS";
                s.execute(step);
            }
        } catch (SQLException e) {
            System.out.println("@@CASE {\"index\":" + index + ",\"setupError\":"
                    + Json.str(firstLine(e.getMessage()) + " [" + step.replaceAll("\\s+", " ") + "]") + "}");
            return false;
        }
        Tracker.reset(fault);
        return true;
    }

    public static void end(Object result, Throwable thrown) {
        Tracker.disarm();
        StringBuilder sb = new StringBuilder("@@CASE {\"index\":").append(index);
        if (thrown == null) {
            sb.append(",\"returned\":").append(Json.of(result));
        } else {
            sb.append(",\"threw\":{\"class\":").append(Json.str(thrown.getClass().getName()))
                    .append(",\"message\":").append(Json.str(firstLine(String.valueOf(thrown.getMessage()))))
                    .append(",\"sqlException\":").append(thrown instanceof SQLException)
                    .append(",\"injected\":").append(Tracker.isInjected(thrown)).append('}');
        }
        sb.append(",\"fault\":{\"kind\":").append(Json.str(fault))
                .append(",\"triggered\":").append(fault.equals("drop-table") || Tracker.triggered()).append('}');
        sb.append(",\"resources\":").append(Tracker.resourcesJson());
        sb.append(",\"resultSets\":").append(Tracker.resultSetsJson());
        sb.append(",\"sql\":").append(Tracker.sqlJson());
        sb.append(",\"calls\":").append(Tracker.callsJson());
        sb.append(",\"before\":").append(before);
        sb.append(",\"after\":").append(snapshot());
        sb.append('}');
        Tracker.cleanup();
        System.out.println(sb);
    }

    public static void finish() {
        try {
            raw.close();
        } catch (SQLException ignored) {
            // databasen försvinner ändå med processen
        }
        System.out.println("@@DONE");
    }

    // Som i SQL Server efter en insättning med egna värden i en
    // IDENTITY-kolumn: räknaren fortsätter efter det högsta värdet.
    private static void restartIdentities(Statement s) throws SQLException {
        List<String[]> identity = new ArrayList<>();
        try (ResultSet rs = s.executeQuery("SELECT TABLE_NAME, COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS "
                + "WHERE IS_IDENTITY = 'YES' AND TABLE_SCHEMA <> 'INFORMATION_SCHEMA'")) {
            while (rs.next()) {
                identity.add(new String[] { rs.getString(1), rs.getString(2) });
            }
        }
        for (String[] tc : identity) {
            Object max;
            try (ResultSet rs = s.executeQuery("SELECT MAX(\"" + tc[1] + "\") FROM \"" + tc[0] + "\"")) {
                rs.next();
                max = rs.getObject(1);
            }
            if (max != null) {
                s.execute("ALTER TABLE \"" + tc[0] + "\" ALTER COLUMN \"" + tc[1] + "\" RESTART WITH "
                        + (((Number) max).longValue() + 1));
            }
        }
    }

    // {"Tabell":[{"Kolumn":värde,…},…],…}; null för en tabell som inte finns.
    private static String snapshot() {
        StringBuilder sb = new StringBuilder("{");
        for (String table : tables) {
            if (sb.length() > 1) {
                sb.append(',');
            }
            sb.append(Json.str(table)).append(':');
            try (Statement s = raw.createStatement();
                 ResultSet rs = s.executeQuery("SELECT * FROM " + table + " ORDER BY 1")) {
                ResultSetMetaData md = rs.getMetaData();
                StringBuilder rows = new StringBuilder("[");
                while (rs.next()) {
                    if (rows.length() > 1) {
                        rows.append(',');
                    }
                    rows.append('{');
                    for (int i = 1; i <= md.getColumnCount(); i++) {
                        if (i > 1) {
                            rows.append(',');
                        }
                        rows.append(Json.str(md.getColumnLabel(i))).append(':').append(Json.of(rs.getObject(i)));
                    }
                    rows.append('}');
                }
                sb.append(rows).append(']');
            } catch (SQLException e) {
                sb.append("null");
            }
        }
        return sb.append('}').toString();
    }

    private static String firstLine(String s) {
        int nl = s.indexOf('\n');
        return nl < 0 ? s : s.substring(0, nl);
    }

    // Ett objekt till en objektparameter (t.ex. save(Employee employee)):
    // instansvariablerna sätts direkt, så att testet inte beror på vilka
    // konstruktorer klassen har.
    public static <T> T make(Class<T> type, Object... fieldsAndValues) {
        T obj = instantiate(type);
        for (int i = 0; i + 1 < fieldsAndValues.length; i += 2) {
            String name = (String) fieldsAndValues[i];
            Field field = findField(type, name);
            try {
                field.setAccessible(true);
                field.set(obj, coerce(fieldsAndValues[i + 1], field.getType()));
            } catch (IllegalAccessException e) {
                throw new IllegalStateException(e);
            }
        }
        return obj;
    }

    private static <T> T instantiate(Class<T> type) {
        try {
            Constructor<T> none = type.getDeclaredConstructor();
            none.setAccessible(true);
            return none.newInstance();
        } catch (NoSuchMethodException e) {
            Constructor<?> any = type.getDeclaredConstructors()[0];
            Class<?>[] params = any.getParameterTypes();
            Object[] args = new Object[params.length];
            for (int i = 0; i < params.length; i++) {
                args[i] = params[i].isPrimitive() ? coerce(0, params[i]) : null;
            }
            try {
                any.setAccessible(true);
                return type.cast(any.newInstance(args));
            } catch (ReflectiveOperationException inner) {
                throw new IllegalStateException(inner);
            }
        } catch (ReflectiveOperationException e) {
            throw new IllegalStateException(e);
        }
    }

    private static Field findField(Class<?> type, String name) {
        for (Class<?> c = type; c != null && c != Object.class; c = c.getSuperclass()) {
            for (Field f : c.getDeclaredFields()) {
                if (f.getName().equals(name)) {
                    return f;
                }
            }
        }
        throw new IllegalArgumentException(type.getSimpleName() + " saknar instansvariabeln " + name);
    }

    private static Object coerce(Object v, Class<?> t) {
        if (v == null) {
            if (t.isPrimitive()) {
                throw new IllegalArgumentException("null till " + t);
            }
            return null;
        }
        if (v instanceof Number n) {
            if (t == int.class || t == Integer.class) return n.intValue();
            if (t == long.class || t == Long.class) return n.longValue();
            if (t == double.class || t == Double.class) return n.doubleValue();
            if (t == float.class || t == Float.class) return n.floatValue();
            if (t == short.class || t == Short.class) return n.shortValue();
            if (t == byte.class || t == Byte.class) return n.byteValue();
            if (t == BigDecimal.class) return new BigDecimal(n.toString());
            if (t == boolean.class || t == Boolean.class) return n.intValue() != 0;
        }
        if (v instanceof String s) {
            if (t == LocalDate.class) return LocalDate.parse(s);
            if (t == LocalDateTime.class) return LocalDateTime.parse(s);
            if (t == java.sql.Date.class) return java.sql.Date.valueOf(s);
            if (t == java.sql.Timestamp.class) return java.sql.Timestamp.valueOf(s);
            if (t == char.class || t == Character.class) return s.charAt(0);
            if (t == BigDecimal.class) return new BigDecimal(s);
        }
        return v;
    }

    // Liten JSON-skrivare. Allt utanför ASCII skrivs som JSON-escape (u + fyra
    // hexsiffror), så att utskriften inte beror på terminalens teckenkodning.
    public static final class Json {
        private Json() {
        }

        public static String str(String s) {
            if (s == null) {
                return "null";
            }
            StringBuilder sb = new StringBuilder("\"");
            for (char c : s.toCharArray()) {
                if (c == '"' || c == '\\') {
                    sb.append('\\').append(c);
                } else if (c < 0x20 || c > 0x7e) {
                    sb.append(String.format("\\u%04x", (int) c));
                } else {
                    sb.append(c);
                }
            }
            return sb.append('"').toString();
        }

        public static String of(Object v) {
            return of(v, 0);
        }

        private static String of(Object v, int depth) {
            if (v == null) return "null";
            if (v == VOID) return "{\"$void\":true}";
            if (depth > 6) return "\"...\"";
            if (v instanceof String s) return str(s);
            if (v instanceof Character c) return str(String.valueOf(c));
            if (v instanceof Boolean b) return b.toString();
            if (v instanceof BigDecimal d) return d.toPlainString();
            if (v instanceof Double d) return d.isNaN() || d.isInfinite() ? str(d.toString()) : d.toString();
            if (v instanceof Float f) return f.isNaN() || f.isInfinite() ? str(f.toString()) : f.toString();
            if (v instanceof Number n) return n.toString();
            if (v instanceof java.util.Date || v instanceof java.time.temporal.Temporal) return str(v.toString());
            if (v instanceof Collection<?> c) {
                StringBuilder sb = new StringBuilder("[");
                for (Object o : c) {
                    if (sb.length() > 1) sb.append(',');
                    sb.append(of(o, depth + 1));
                }
                return sb.append(']').toString();
            }
            if (v.getClass().isArray()) {
                StringBuilder sb = new StringBuilder("[");
                for (int i = 0; i < Array.getLength(v); i++) {
                    if (i > 0) sb.append(',');
                    sb.append(of(Array.get(v, i), depth + 1));
                }
                return sb.append(']').toString();
            }
            if (v instanceof Map<?, ?> m) {
                StringBuilder sb = new StringBuilder("{");
                for (Map.Entry<?, ?> e : m.entrySet()) {
                    if (sb.length() > 1) sb.append(',');
                    sb.append(str(String.valueOf(e.getKey()))).append(':').append(of(e.getValue(), depth + 1));
                }
                return sb.append('}').toString();
            }
            // En modellklass: {"$class":"Product","id":…,…} med samtliga instansvariabler.
            StringBuilder sb = new StringBuilder("{\"$class\":").append(str(v.getClass().getSimpleName()));
            List<Class<?>> chain = new ArrayList<>();
            for (Class<?> c = v.getClass(); c != null && c != Object.class; c = c.getSuperclass()) {
                chain.add(0, c);
            }
            for (Class<?> c : chain) {
                for (Field f : c.getDeclaredFields()) {
                    if (Modifier.isStatic(f.getModifiers()) || f.isSynthetic()) continue;
                    try {
                        f.setAccessible(true);
                        sb.append(',').append(str(f.getName())).append(':').append(of(f.get(v), depth + 1));
                    } catch (IllegalAccessException | RuntimeException e) {
                        sb.append(',').append(str(f.getName())).append(":\"?\"");
                    }
                }
            }
            return sb.append('}').toString();
        }
    }
}
