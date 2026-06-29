import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

// This maps the URL path 'process-request' to this specific servlet execution block
@WebServlet(name = "processServlet", value = "/process-request")
public class ProcessServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Retrieve form input text by matching the 'name' attribute from the JSP input field
        String inputName = request.getParameter("studentName");

        // Set the response type to modern HTML output
        response.setContentType("text/html;charset=UTF-8");

        // Write the HTML response output stream back to the browser
        try (PrintWriter out = response.getWriter()) {
            out.println("<!DOCTYPE html>");
            out.println("<html>");
            out.println("<head><title>Server Response</title></head>");
            out.println("<body style='font-family: Arial, sans-serif; margin: 40px;'>");
            out.println("<h2 style='color: green;'>Request Processed Successfully!</h2>");
            out.println("<p>Hello, <strong>" + inputName + "</strong>! The backend server received your request using the <code>javax</code> configuration.</p>");
            out.println("<br><a href='index.jsp'>Go Back to Form</a>");
            out.println("</body>");
            out.println("</html>");
        }
    }
}