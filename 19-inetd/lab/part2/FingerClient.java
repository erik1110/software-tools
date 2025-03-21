import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

public class FingerClient {
    public static void main(String[] args) {
        String server = "localhost"; // Finger Server
        String query = "hello server";   // Query
        int port = 8000;              // Default Port

        try (Socket socket = new Socket(server, port);
             PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
             BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()))) {
            
            System.out.println("Connected to " + server + " on port " + port);
            out.println(query);
            String response;
            while ((response = in.readLine()) != null) {
                System.out.println(response);
            }
            
        } catch (IOException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}
