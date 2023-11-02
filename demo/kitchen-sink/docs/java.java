import java.util.ArrayList;
import java.util.Vector;

public class InfiniteLoop {

    /*
     * This will cause the program to hang...
     *
     * Taken from:
     * http://www.exploringbinary.com/java-hangs-when-converting-2-2250738585072012e-308/
     */
    @Override
    public static void main(String[] args) {
        double d = Double.parseDouble("2.2250738585072012e-308");

        // unreachable code
        System.out.println("Value: " + d);
    }
}

String name = "Joan"; String info = STR."My name is \{name}";

STR."Today's weather is \{ getFeelsLike() }, with a temperature of \{ getTemperature()++ } degrees \{ getUnit() }"

String nestedMultilineTemplates() {
    return STR."""
        {
            "outerKey1": "outerValue1",
            "nestedTemplate": "\{
                STR."""
                {
                    "innerKey": "\{innerValue.get()}"
                }
                """
            }",
            "outerKey2": "outerValue2"
        }
        """;
}
