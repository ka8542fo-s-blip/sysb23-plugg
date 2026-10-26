import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

// Harnessens ConnectionHandler. På tentan är klassen given och skrivs inte i
// svaret; här ger getConnection() en NY anslutning till en delad H2-databas i
// minnet (MSSQLServer-läge), inslagen i Tracker så att harnessen ser om varje
// Connection, Statement och ResultSet stängs.
public class ConnectionHandler {
    public Connection getConnection() throws SQLException {
        return Tracker.track(DriverManager.getConnection(Harness.URL));
    }
}
