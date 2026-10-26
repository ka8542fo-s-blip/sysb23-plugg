import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

// Följer varje JDBC-resurs som lösningen öppnar (Connection, Statement,
// PreparedStatement, ResultSet) genom java.lang.reflect.Proxy och noterar om
// close() anropas. Kan också lägga in ett SQLException på en vald plats
// ("execute" = executeQuery/executeUpdate, "next" = ResultSet.next()) för att
// visa att undantaget går vidare och att allt ändå stängs. För varje ResultSet
// noteras också dess kolumner och hur många rader lösningen läste (next()
// som gav true), så att testfallen kan kräva att frågan hämtar just vissa
// kolumner eller att antalet räknas i databasen.
public final class Tracker {
    private static final class Resource {
        final String kind;
        final AutoCloseable real;
        boolean closed;
        List<String> columns;
        int rows;

        Resource(String kind, AutoCloseable real) {
            this.kind = kind;
            this.real = real;
        }
    }

    private static final List<Resource> resources = new ArrayList<>();
    private static final List<String> sql = new ArrayList<>();
    private static final List<String> calls = new ArrayList<>();
    private static String fault = "";
    private static boolean armed;
    private static boolean triggered;
    private static SQLException injected;

    private Tracker() {
    }

    static void reset(String faultKind) {
        resources.clear();
        sql.clear();
        calls.clear();
        fault = faultKind == null ? "" : faultKind;
        armed = true;
        triggered = false;
        injected = null;
    }

    static void disarm() {
        armed = false;
    }

    static boolean triggered() {
        return triggered;
    }

    static boolean isInjected(Throwable thrown) {
        for (Throwable t = thrown; t != null; t = t.getCause()) {
            if (t == injected) {
                return true;
            }
        }
        return false;
    }

    public static Connection track(Connection real) {
        return (Connection) wrap(Connection.class, "Connection", real);
    }

    private static Object wrap(Class<?> type, String kind, AutoCloseable real) {
        return wrap(type, new Resource(kind, real));
    }

    private static Object wrap(Class<?> type, Resource resource) {
        resources.add(resource);
        return Proxy.newProxyInstance(
                Tracker.class.getClassLoader(),
                new Class<?>[] { type },
                (proxy, method, args) -> handle(type, resource, method, args));
    }

    private static Object handle(Class<?> type, Resource resource, Method method, Object[] args)
            throws Throwable {
        String name = method.getName();
        int argc = args == null ? 0 : args.length;

        if (name.equals("close") && argc == 0) {
            resource.closed = true;
        }
        if (type == Connection.class
                && (name.equals("prepareStatement") || name.equals("prepareCall"))
                && argc >= 1 && args[0] instanceof String text) {
            sql.add(text);
            calls.add(name);
        }
        if (type == Connection.class && name.equals("createStatement")) {
            calls.add(name);
        }
        boolean isStatement = Statement.class.isAssignableFrom(type);
        if (isStatement && name.startsWith("set") && argc == 2 && args[0] instanceof Integer index) {
            calls.add(name + "(" + index + ", " + show(args[1]) + ")");
        }
        if (isStatement && name.startsWith("execute")) {
            if (argc >= 1 && args[0] instanceof String text) {
                sql.add(text);
            }
            calls.add(name);
            if (armed && !triggered && fault.equals("execute")) {
                triggered = true;
                injected = new SQLException("Injicerat fel från harnessen i " + name + "()");
                throw injected;
            }
        }
        if (type == ResultSet.class && name.equals("next")) {
            if (armed && !triggered && fault.equals("next")) {
                calls.add(name);
                triggered = true;
                injected = new SQLException("Injicerat fel från harnessen i next()");
                throw injected;
            }
        }

        Object out;
        try {
            out = method.invoke(resource.real, args);
        } catch (InvocationTargetException e) {
            throw e.getCause();
        }

        if (type == ResultSet.class && name.equals("next") && Boolean.TRUE.equals(out)) {
            resource.rows++;
        }
        if (out == null || Proxy.isProxyClass(out.getClass())) {
            return out;
        }
        if (out instanceof ResultSet rs) {
            Resource rsResource = new Resource("ResultSet", rs);
            rsResource.columns = columnLabels(rs);
            return wrap(ResultSet.class, rsResource);
        }
        if (type == Connection.class && out instanceof Statement statement) {
            if (name.equals("prepareCall")) {
                return wrap(CallableStatement.class, "CallableStatement", statement);
            }
            if (name.equals("prepareStatement")) {
                return wrap(PreparedStatement.class, "PreparedStatement", statement);
            }
            return wrap(Statement.class, "Statement", statement);
        }
        return out;
    }

    // Kolumnerna i ett ResultSet, ur den riktiga drivrutinens metadata (anropet
    // går förbi proxyn och syns inte bland lösningens anrop).
    private static List<String> columnLabels(ResultSet rs) {
        List<String> labels = new ArrayList<>();
        try {
            ResultSetMetaData md = rs.getMetaData();
            for (int i = 1; i <= md.getColumnCount(); i++) {
                labels.add(md.getColumnLabel(i));
            }
        } catch (SQLException e) {
            return null;
        }
        return labels;
    }

    private static String show(Object value) {
        if (value instanceof String s) {
            return "\"" + s + "\"";
        }
        return String.valueOf(value);
    }

    // {"Connection":{"opened":1,"closed":1}, …} i den ordning de öppnades.
    static String resourcesJson() {
        Map<String, int[]> counts = new LinkedHashMap<>();
        for (Resource r : resources) {
            int[] c = counts.computeIfAbsent(r.kind, k -> new int[2]);
            c[0]++;
            if (r.closed) {
                c[1]++;
            }
        }
        StringBuilder sb = new StringBuilder("{");
        for (Map.Entry<String, int[]> e : counts.entrySet()) {
            if (sb.length() > 1) {
                sb.append(',');
            }
            sb.append(Harness.Json.str(e.getKey()))
                    .append(":{\"opened\":").append(e.getValue()[0])
                    .append(",\"closed\":").append(e.getValue()[1]).append('}');
        }
        return sb.append('}').toString();
    }

    // [{"columns":["Kolumn",…],"rows":n}, …]: varje ResultSet i den ordning
    // de öppnades, med antalet rader som lösningen läste (next() gav true).
    static String resultSetsJson() {
        StringBuilder sb = new StringBuilder("[");
        for (Resource r : resources) {
            if (!r.kind.equals("ResultSet")) {
                continue;
            }
            if (sb.length() > 1) {
                sb.append(',');
            }
            sb.append("{\"columns\":").append(Harness.Json.of(r.columns))
                    .append(",\"rows\":").append(r.rows).append('}');
        }
        return sb.append(']').toString();
    }

    static String sqlJson() {
        return Harness.Json.of(sql);
    }

    static String callsJson() {
        return Harness.Json.of(calls);
    }

    // Stänger det lösningen lämnade öppet, så att nästa fall börjar rent.
    static void cleanup() {
        for (int i = resources.size() - 1; i >= 0; i--) {
            Resource r = resources.get(i);
            if (!r.closed) {
                try {
                    r.real.close();
                } catch (Exception ignored) {
                    // redan stängd via sin Connection
                }
            }
        }
    }
}
