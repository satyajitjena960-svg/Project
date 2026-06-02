package controller;
import jakarta.servlet.*;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
@WebServlet("/register")
public class BookController extends HttpServlet {
    @Override
    protected void  doPost(HttpServletRequest req, HttpServletResponse resp)throws ServletException,IOException{
        String name=req.getParameter("name");
        String email=req.getParameter("email");
        String password=req.getParameter("pas");
        System.out.println(name +"" +email+""+password);
        resp.getWriter().println("thank u for regester \n ur details are\n" +
                ""+name+""+email+""+password);
        resp.sendRedirect("index.jsp");

    }
}
