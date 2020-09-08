if (typeof process !== "undefined") {
    require("amd-loader");
}

define(function(require, exports, module) {
"use strict";

var assert = require("assert");
var EditSession = require("../edit_session").EditSession;
var beautify = require("./beautify");
var PHPMode = require("../mode/php").Mode;
var CSSMode = require("../mode/css").Mode;

// Execution ORDER: test.setUpSuite, setUp, testFn, tearDown, test.tearDownSuite
module.exports = {
    timeout: 10000,

    "test beautify first line empty": function() {
        var s = new EditSession([
            "",
            "hello world"
        ], new PHPMode());
        s.setUseSoftTabs(false);

        beautify.beautify(s);
        assert.equal(s.getValue(), "hello world");
    },

    "test beautify block tag indentation": function() {
        var s = new EditSession([
            "<div>",
            "<h1>hello</h1>",
            "world</div>"
        ], new PHPMode());
        s.setUseSoftTabs(false);

        beautify.beautify(s);
        assert.equal(s.getValue(), "<div>\n"
            + "\t<h1>hello</h1>\n"
            + "\tworld\n"
            + "</div>");
    },

    "test beautify block tag line breaks and indentation": function() {
        var s = new EditSession([
            "<html><body><div></div></body></html>"
        ], new PHPMode());
        s.setUseSoftTabs(false);

        beautify.beautify(s);
        assert.equal(s.getValue(), "<html>\n"
            + "<body>\n"
            + "\t<div></div>\n"
            + "</body>\n"
            + "</html>");
    },

    "test beautify empty block tag": function() {
        var s = new EditSession([
            "\t<div></div>"
        ], new PHPMode());
        s.setUseSoftTabs(false);

        beautify.beautify(s);
        assert.equal(s.getValue(), "<div></div>");
    },

    "test beautify inline tag indentation": function() {
        var s = new EditSession([
            "<div>",
            "<span>hello world</span>",
            "</div>"
        ], new PHPMode());
        s.setUseSoftTabs(false);

        beautify.beautify(s);
        assert.equal(s.getValue(), "<div>\n"
            + "\t<span>hello world</span>\n"
            + "</div>");
    },

    "test beautify multiline inline tag indentation": function() {
        var s = new EditSession([
            "<div>",
            "<span>",
            "hello world",
            "</span>",
            "</div>"
        ], new PHPMode());
        s.setUseSoftTabs(false);

        beautify.beautify(s);
        assert.equal(s.getValue(), "<div>\n"
            + "\t<span>\n"
            + "\t\thello world\n"
            + "\t</span>\n"
            + "</div>");
    },

    "test beautify singleton tag indentation": function() {
        var s = new EditSession([
            "<div>",
            "hello<br>",
            "world",
            "</div>"
        ], new PHPMode());
        s.setUseSoftTabs(false);

        beautify.beautify(s);
        assert.equal(s.getValue(), "<div>\n"
            + "\thello<br>\n"
            + "\tworld\n"
            + "</div>");
    },

    "test beautify unknown singleton indentation": function() {
        var s = new EditSession([
            "<div>",
            "hello<single />",
            "world",
            "</div>"
        ], new PHPMode());
        s.setUseSoftTabs(false);

        beautify.beautify(s);
        assert.equal(s.getValue(), "<div>\n"
            + "\thello<single />\n"
            + "\tworld\n"
            + "</div>");
    },

    "test beautify curly indentation": function() {
        var s = new EditSession([
            "<?php",
            "if ($foo===array()) {",
            "$i++;",
            "}",
            "if (($foo ||",
            "$bar)) {",
            "true;",
            "}"
        ], new PHPMode());
        s.setUseSoftTabs(false);

        beautify.beautify(s);
        assert.equal(s.getValue(), "<?php\n"
            + "if ($foo === array()) {\n"
            + "\t$i++;\n"
            + "}\n"
            + "if (($foo ||\n"
            + "\t$bar)) {\n"
            + "\ttrue;\n"
            + "}");
    },

    "test beautify adding bracket whitespace": function() {
        var s = new EditSession([
            "<?php",
            "if(true){",
            "\t$i++;",
            "}"
        ], new PHPMode());
        s.setUseSoftTabs(false);

        beautify.beautify(s);
        assert.equal(s.getValue(), "<?php\n"
            + "if (true) {\n"
            + "\t$i++;\n"
            + "}");
    },

    "test beautify removing bracket whitespace": function() {
        var s = new EditSession([
            "<?php",
            "if ( true ) {",
            "\t$i++;",
            "}"
        ], new PHPMode());
        s.setUseSoftTabs(false);

        beautify.beautify(s);
        assert.equal(s.getValue(), "<?php\n"
            + "if (true) {\n"
            + "\t$i++;\n"
            + "}");
    },

    "test beautify adding keyword whitespace": function() {
        var s = new EditSession([
            "<?php",
            "if ($foo===true) {",
            "\t$i++;",
            "}"
        ], new PHPMode());
        s.setUseSoftTabs(false);

        beautify.beautify(s);
        assert.equal(s.getValue(), "<?php\n"
            + "if ($foo === true) {\n"
            + "\t$i++;\n"
            + "}");
    },

    "test beautify if without paren": function() {
        var s = new EditSession([
            "<?php",
            "if ($foo)",
            "$i++;",
            "if ($foo) $j++",
            "print $i"
        ], new PHPMode());
        s.setUseSoftTabs(false);

        beautify.beautify(s);
        assert.equal(s.getValue(), "<?php\n"
            + "if ($foo)\n"
            + "\t$i++;\n"
            + "if ($foo) $j++\n"
            + "print $i");
    },

    "test beautify switch indentation": function() {
        var s = new EditSession([
            "<?php",
            "switch ($i) {",
            "case 1;",
            "case 2;",
            "print $foo;",
            "break;",
            "case 2;",
            "print $bar;",
            "}"
        ], new PHPMode());
        s.setUseSoftTabs(false);

        beautify.beautify(s);
        assert.equal(s.getValue(), "<?php\n"
            + "switch ($i) {\n"
            + "\tcase 1;\n"
            + "\tcase 2;\n"
            + "\t\tprint $foo;\n"
            + "\t\tbreak;\n"
            + "\tcase 2;\n"
            + "\t\tprint $bar;\n"
            + "}");
    },

    "test beautify multiline string": function() {
        var s = new EditSession([
            "<?php",
            "\tprint 'hello",
            "\t\tworld'"
        ], new PHPMode());
        s.setUseSoftTabs(false);

        beautify.beautify(s);
        assert.equal(s.getValue(), "<?php\n"
            + "print 'hello\n"
            + "\t\tworld'");
    },

    "test beautify remove spaces before semicolons": function() {
        var s = new EditSession([
            "<?php echo \"hello world\";?>",
            "<?php",
            "$foo = \"hello \" ;$bar = \"world\";",
            "print $foo.$bar;"
        ], new PHPMode());
        s.setUseSoftTabs(false);

        beautify.beautify(s);
        assert.equal(s.getValue(), "<?php echo \"hello world\"; ?>\n"
            + "<?php\n"
            + "$foo = \"hello \"; $bar = \"world\";\n"
            + "print $foo.$bar;");
    },

    "test beautify tag whitepace": function() {
        var s = new EditSession([
            "<form   id=\"\"   action = \"\"   method=\"get\"  >",
            "\t<br   />",
            "</form  >"
        ], new PHPMode());
        s.setUseSoftTabs(false);

        beautify.beautify(s);
        assert.equal(s.getValue(), "<form id=\"\" action=\"\" method=\"get\">\n"
            + "\t<br />\n"
            + "</form>");
    },

    "test beautify css in php": function() {
        var s = new EditSession([
            "<style>h1{font-size: 20px;}p{font-size:14px; padding:10px;}</style>"
        ], new PHPMode());
        s.setUseSoftTabs(false);

        beautify.beautify(s);
        assert.equal(s.getValue(), "<style>\n"
            + "\th1 {\n"
            + "\t\tfont-size: 20px;\n"
            + "\t}\n"
            + "\n"
            + "\tp {\n"
            + "\t\tfont-size: 14px;\n"
            + "\t\tpadding: 10px;\n"
            + "\t}\n"
            + "</style>");
    },
    
    "test beautify css": function() {
        var s = new EditSession("", new CSSMode());
        s.setUseSoftTabs(true);
        s.setValue(".x    y:h{    animation: appear 1.5s ease-in-out     ease-in-out;     border:  solid    red;}");
        
        beautify.beautify(s);
        assert.equal(s.getValue(), ".x y:h {\n"
            + "    animation: appear 1.5s ease-in-out ease-in-out;\n"
            + "    border: solid red;\n"
            + "}");
    },

    "test beautify comments": function() {
        var s = new EditSession([
            "<?php\n",
            "if(true) //break me\n",
            "{}\n",
            "?>\n",
            "<!--\n",
            "\thello\n",
            "\t\tworld\n",
            "-->"
        ], new PHPMode());
        s.setUseSoftTabs(false);

        beautify.beautify(s);
        assert.equal(s.getValue(), "<?php\n"
            + "if (true) //break me\n"
            + "{}\n"
            + "?>\n"
            + "<!--\n"
            + "\thello\n"
            + "\t\tworld\n"
            + "-->");
    },

    "test beautify js array of objects": function() {
        var s = new EditSession([
            "<script>\n",
            "var foo = [",
            "\t{ \n",
            "\t\tbar: \"hello\", \n",
            "\t\tbar2: {}\n",
            "\t},{\n",
            "\t\t\"bar\": true\n",
            "\t}\n",
            "];\n",
            "</script>"
        ], new PHPMode());
        s.setUseSoftTabs(false);

        beautify.beautify(s);
        assert.equal(s.getValue(), "<script>\n"
            + "\tvar foo = [{\n"
            + "\t\tbar: \"hello\",\n"
            + "\t\tbar2: {}\n"
            + "\t}, {\n"
            + "\t\t\"bar\": true\n"
            + "\t}];\n"
            + "</script>");
    },

    "test beautify js object": function() {
        var s = new EditSession([
            '<script>{"a": "1", "b": "2"}</script>'
        ], new PHPMode());
        s.setUseSoftTabs(false);

        beautify.beautify(s);
        assert.equal(s.getValue(), "<script>\n"
            + "\t{\n"
            + "\t\t\"a\": \"1\",\n"
            + "\t\t\"b\": \"2\"\n"
            + "\t}\n"
            + "</script>");
    }
};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
