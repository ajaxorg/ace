if (typeof process !== "undefined") {
    require("amd-loader");
}

define(function(require, exports, module) {
"use strict";

var assert = require("assert");
var EditSession = require("../edit_session").EditSession;
var beautify = require("./beautify");
var PHPMode = require("../mode/php").Mode;

// Execution ORDER: test.setUpSuite, setUp, testFn, tearDown, test.tearDownSuite
module.exports = {
    timeout: 10000,

    "test beautify first line empty": function(next) {
        var s = new EditSession([
            "",
            "hello world"
        ], new PHPMode());
        s.setUseSoftTabs(false);

        beautify.beautify(s);
        assert.equal(s.getValue(), "hello world");

        next();
    },

    "test beautify block tag indentation": function(next) {
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

        next();
    },

    "test beautify block tag line breaks and indentation": function(next) {
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

        next();
    },

    "test beautify empty block tag": function(next) {
        var s = new EditSession([
            "\t<div></div>"
        ], new PHPMode());
        s.setUseSoftTabs(false);

        beautify.beautify(s);
        assert.equal(s.getValue(), "<div></div>");

        next();
    },

    "test beautify inline tag indentation": function(next) {
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

        next();
    },

    "test beautify multiline inline tag indentation": function(next) {
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

        next();
    },

    "test beautify singleton tag indentation": function(next) {
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

        next();
    },

    "test beautify unknown singleton indentation": function(next) {
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

        next();
    },

    "test beautify curly indentation": function(next) {
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

        next();
    },

    "test beautify adding bracket whitespace": function(next) {
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

        next();
    },

    "test beautify removing bracket whitespace": function(next) {
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

        next();
    },

    "test beautify adding keyword whitespace": function(next) {
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

        next();
    },

    "test beautify if without paren": function(next) {
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

        next();
    },

    "test beautify switch indentation": function(next) {
        var s = new EditSession([
            "<?php",
            "switch ($i) {",
            "case 1;",
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
            + "\t\tprint $foo;\n"
            + "\t\tbreak;\n"
            + "\tcase 2;\n"
            + "\t\tprint $bar;\n"
            + "}");

        next();
    },

    "test beautify multiline string": function(next) {
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

        next();
    },

    "test beautify remove spaces before semicolons": function(next) {
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

        next();
    },

    "test beautify tag whitepace": function(next) {
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

        next();
    },

    "test beautify css": function(next) {
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

        next();
    },

    "test beautify comments": function(next) {
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

        next();
    },

    "test beautify js array of objects": function(next) {
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

        next();
    },

    "test beautify js object": function(next) {
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

        next();
    }
};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
