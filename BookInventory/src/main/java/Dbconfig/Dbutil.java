package Dbconfig;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Dbutil {
    private static final String URL = "jdbc:postgresql://localhost:5432/Company";
    private static final String user="postgres";
    private static final String pass="Cutm@059";
    private static Connection connection=null;
    public  void connect(){
        try {
            connection= DriverManager.getConnection(URL,user,pass);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

}
