<%-- initial comment --%>
<%@ page import="java.util.Date" %>
<%--@ page isELIgnored="true" //Now EL will be ignored   --%>
<html>
    <jsp:declaration>
        int day = 3;
    </jsp:declaration>
    <%@ include file="relative url" %>
    <jsp:directive.include file="relative url" />
    <head>
        <title>Day <%= day %></title>
    </head> 
    <body>
        <script>
            var x = "abc";
                function y {
            }
        </script>
    <style>
        .class {
            background: #124356;
        }
    </style>

    <p>
        Today's date: <%= (new java.util.Date()).toLocaleString()%>
    </p>
    <%! int day = 3; %> 
    
    <jsp:directive.page attribute="value" />
    
    
    <%-- This comment will not be visible in the page source --%>
    <!-- html comment -->
    <body>
        <p>
           Today's date: <%= (new java.util.Date()).toLocaleString()%>
        </p>
        
<%! int i = 0; %>
    <jsp:declaration>
       int j = 10;
    </jsp:declaration>

    <%-- This is JSP comment --%>
    <%@ directive attribute="value" %>

    <h2>Select Languages:</h2>

    <form ACTION="jspCheckBox.jsp">
        <input type="checkbox" name="id" value="Java"> Java<BR>
        <input type="checkbox" name="id" value=".NET"> .NET<BR>
        <input type="checkbox" name="id" value="PHP"> PHP<BR>
        <input type="checkbox" name="id" value="C/C++"> C/C++<BR>
        <input type="checkbox" name="id" value="PERL"> PERL <BR>
        <input type="submit" value="Submit">
    </form>

    <%
    String select[] = request.getParameterValues("id"); 
    if (select != null && select.length != 0) {
        out.println("You have selected: ");
        for (int i = 0; i < select.length; i++) {
           out.println(select[i]); 
        }
    }
    %>


        <% 
            switch(day) {
            case 0:
                   out.println("It\'s Sunday.");
                   break;
            case 1:
                   out.println("It\'s Monday.");
                   break;
            case 2:
                   out.println("It\'s Tuesday.");
                   break;
            case 3:
                   out.println("It\'s Wednesday.");
                   break;
            case 4:
                   out.println("It\'s Thursday.");
                   break;
            case 5:
                   out.println("It\'s Friday.");
                   break;
            //hello
            default:
                   out.println("It's Saturday.");
            }
        %>
        <p>
            <jsp:scriptlet>
                out.println("Your IP address is " + request.getRemoteAddr());
            </jsp:scriptlet>
        </p>
    </body>
</html>
