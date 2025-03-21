import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;

public class FingerServer {
    private ServerSocket serverSocket;

    public void start(int port) {
        try {
            serverSocket = new ServerSocket(port);
            System.out.println("Start Server, port：" + port);

            while (true) {
                try (Socket clientSocket = serverSocket.accept();
                     PrintWriter out = new PrintWriter(clientSocket.getOutputStream(), true);
                     BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()))) {

                    System.out.println("New Client：" + clientSocket.getInetAddress());

                    String greeting = in.readLine();
                    System.out.println("Client said: " + greeting);
                    if ("hello server".equals(greeting)) {
                        out.println("hello client");
                    } else {
                        out.println("unrecognised greeting");
                    }
                } catch (IOException e) {
                    System.err.println("Client Error：" + e.getMessage());
                }
            }
        } catch (IOException e) {
            System.err.println("Server Error" + e.getMessage());
        }
    }

    public void stop() {
        try {
            if (serverSocket != null) {
                serverSocket.close();
                System.out.println("Server Close...");
            }
        } catch (IOException e) {
            System.err.println("Closing Error" + e.getMessage());
        }
    }

    public static void main(String[] args) {
        FingerServer server = new FingerServer();
        server.start(8000);
    }
}
