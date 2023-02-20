if (typeof process !== "undefined") {
    require("amd-loader");
    require("../../test/mockdom");
}

"use strict";

require("../../multi_select");
var assert = require("../../test/assertions");
var Range = require("../../range").Range;
var Editor = require("../../editor").Editor;
var UndoManager = require("../../undomanager").UndoManager;
var EditSession = require("../../edit_session").EditSession;
var MockRenderer = require("../../test/mockrenderer").MockRenderer;
var JavaScriptMode = require("../javascript").Mode;
var RustMode = require("../rust").Mode;
var XMLMode = require("../xml").Mode;
var HTMLMode = require("../html").Mode;
var CSSMode = require("../css").Mode;
var MarkdownMode = require("../markdown").Mode;
var PythonMode = require("../python").Mode;
var editor;
var exec = function(name, times, args) {
    do {
        editor.commands.exec(name, editor, args);
    } while(times --> 1);
};
var testRanges = function(str) {
    assert.equal(editor.selection.getAllRanges() + "", str + "");
};

module.exports = {
    "test: cstyle": function() {
        function testValue(line) {
            assert.equal(editor.getValue(), Array(4).join(line + "\n"));
        }
        function testSelection(line, col, inc) {
            editor.selection.rangeList.ranges.forEach(function(r) {
                assert.range(r, line, col, line, col);
                line += (inc || 1);
            });
        }
        var doc = new EditSession([
            "",
            "",
            "",
            ""
        ], new JavaScriptMode());
        editor = new Editor(new MockRenderer(), doc);
        editor.setOption("behavioursEnabled", true);

        editor.navigateFileStart();
        exec("addCursorBelow", 2);

        exec("insertstring", 1, "if ");

        // pairing (
        exec("insertstring", 1, "(");
        testValue("if ()");
        testSelection(0, 4);
        exec("insertstring", 1, ")");
        testValue("if ()");
        testSelection(0, 5);

        // pairing [
        exec("gotoleft", 1);
        exec("insertstring", 1, "[");
        testValue("if ([])");
        testSelection(0, 5);

        exec("insertstring", 1, "]");
        testValue("if ([])");
        testSelection(0, 6);

        // test deletion
        exec("gotoleft", 1);
        exec("backspace", 1);
        testValue("if ()");
        testSelection(0, 4);

        exec("gotolineend", 1);
        exec("insertstring", 1, "{");
        testValue("if (){}");
        testSelection(0, 6);

        exec("insertstring", 1, "}");
        testValue("if (){}");
        testSelection(0, 7);

        exec("gotolinestart", 1);
        exec("insertstring", 1, "(");
        testValue("(if (){}");
        exec("backspace", 1);

        editor.setValue("");
        exec("insertstring", 1, "{");
        assert.equal(editor.getValue(), "{");
        exec("insertstring", 1, "\n");
        assert.equal(editor.getValue(), "{\n    \n}");

        editor.setValue("");
        exec("insertstring", 1, "(");
        exec("insertstring", 1, '"');
        exec("insertstring", 1, '"');
        assert.equal(editor.getValue(), '("")');
        exec("backspace", 1);
        exec("insertstring", 1, '"');
        assert.equal(editor.getValue(), '("")');

        editor.setValue("('foo')", 1);
        exec("gotoleft", 1);
        exec("selectleft", 1);
        exec("selectMoreBefore", 1);
        exec("insertstring", 1, "'");
        assert.equal(editor.getValue(), "('foo')");
        exec("selectleft", 1);
        exec("insertstring", 1, '"');
        assert.equal(editor.getValue(), '("foo")');
        exec("selectleft", 1);
        exec("insertstring", 1, '"');
        assert.equal(editor.getValue(), '("foo")');

        editor.setValue("", 1);
        exec("selectleft", 1);
        exec("insertstring", 1, '"');
        assert.equal(editor.getValue(), '""');
        exec("insertstring", 1, '\\');
        exec("insertstring", 1, 'n');
        exec("insertstring", 1, '"');
        assert.equal(editor.getValue(), '"\\n"');

        editor.setValue("");
        exec("insertstring", 1, '`');
        assert.equal(editor.getValue(), '``');
        exec("insertstring", 1, 'n');
        assert.equal(editor.getValue(), '`n`');
        exec("backspace", 2);
        assert.equal(editor.getValue(), '');

        // multiline string interpolation test case
        editor.setValue("");
        exec("insertstring", 1, "var x=");
        exec("insertstring", 1, "`");
        assert.equal(editor.getValue(), "var x=``");
        exec("insertstring", 1, "$");
        exec("insertstring", 1, "{");
        assert.equal(editor.getValue(), "var x=`${}`");
        // Testing for the auto-pairing of curly braces inside a JSX element attribute
        editor.setValue("");
        exec("insertstring", 1, "var x=<a href=");
        exec("insertstring", 1, "{");
        assert.equal(editor.getValue(), "var x=<a href={}");
        // Testing of excluded token types auto-pairing
        editor.setValue("");
        exec("insertstring", 1, "var x=<div>");
        exec("gotoleft", 1);
        exec("insertstring", 1, "{");
        assert.equal(editor.getValue(), "var x=<div{>");
        // Testing for the auto-pairing of curly braces inside a JSX element 
        editor.setValue("");
        exec("insertstring", 1, "var x=<div>\\n    ");
        exec("insertstring", 1, "{");
        assert.equal(editor.getValue(), "var x=<div>\\n    {}");
    },
    "test: xml": function() {
        editor = new Editor(new MockRenderer());
        editor.session.setUndoManager(new UndoManager());
        editor.setValue(["<OuterTag>",
            "    <SelfClosingTag />"
        ].join("\n"));
        editor.session.setMode(new XMLMode);
        exec("golinedown", 1);
        exec("gotolineend", 1);
        exec("insertstring", 1, '\n');
        assert.equal(editor.session.getLine(2), "    ");
        exec("gotolineup", 1);
        exec("gotolineend", 1);
        exec("insertstring", 1, '\n');
        assert.equal(editor.session.getLine(2), "    ");
        editor.session.setValue(["<OuterTag",
            "    <xyzrt"
        ].join("\n"));
        exec("golinedown", 1);
        exec("gotolineend", 1);
        exec("selectleft", 3);
        exec("insertstring", 1, '>');
        assert.equal(editor.session.getLine(1), "    <xy></xy>");

        editor.setValue(["<a x='11'",
            "<b a='",
            "   ",
            "'     >"
        ].join("\n"));
        editor.selection.moveTo(0, 100);
        exec("insertstring", 1, '>');
        editor.selection.moveTo(1, 100);
        exec("insertstring", 1, '>');
        editor.selection.moveTo(2, 1);
        exec("insertstring", 1, '>');
        editor.selection.moveTo(3, 1);
        exec("insertstring", 1, '>');
        assert.equal(editor.getValue(), [
            "<a x='11'></a>",
            "<b a='>",
            " >  ",
            "'>     >"
        ].join("\n"));

        editor.setValue("");
        "<div x='1'>".split("").forEach(function(ch) {
            exec("insertstring", 1, ch);
        });
        assert.equal(editor.getValue(), "<div x='1'></div>");
        exec("insertstring", 1, ">");
        assert.equal(editor.getValue(), "<div x='1'>></div>");

        editor.setValue("<div '", 1);
        exec("selectleft", 1);
        exec("insertstring", 1, '"');
        assert.equal(editor.getValue(), "<div \"");

        exec("selectleft", 1);
        exec("insertstring", 1, "'");
        assert.equal(editor.getValue(), "<div '");

        exec("selectleft", 1);
        exec("insertstring", 1, "a");
        exec("selectleft", 1);
        exec("insertstring", 1, "'");
        assert.equal(editor.getValue(), "<div 'a'");
    },
    "test: html": function() {
        editor.session.setMode(new HTMLMode);
        editor.setWrapBehavioursEnabled(false);
        editor.setValue("<div a", 1);
        exec("selectleft", 1);
        exec("insertstring", 1, "'");
        assert.equal(editor.getValue(), "<div '");

        editor.setWrapBehavioursEnabled(true);
        editor.setValue("<div a", 1);
        exec("selectleft", 1);
        exec("insertstring", 1, "'");
        assert.equal(editor.getValue(), "<div 'a'");

        editor.setValue("<div a=></div>", 1);
        exec("gotoleft", 7);
        exec("insertstring", 1, '"');
        assert.equal(editor.getValue(), "<div a=\"\"></div>");
        exec("insertstring", 1, '"');
        exec("gotoright", 1);
        exec("insertstring", 1, "\n");
        assert.equal(editor.getValue(), "<div a=\"\">\n    \n</div>");

        exec("undo", 1);
        assert.equal(editor.getValue(), "<div a=\"\"></div>");
        exec("gotoleft", 1);
        exec("backspace", 1);
        assert.equal(editor.getValue(), "<div a=\"></div>");
        exec("undo", 1);
        exec("gotoleft", 1);
        exec("backspace", 1);
        assert.equal(editor.getValue(), "<div a=></div>");
        exec("backspace", 1);
        assert.equal(editor.getValue(), "<div a></div>");

        editor.setValue("    <div><div>", 1);
        editor.selection.moveTo(0, 9);
        exec("insertstring", 1, "\n");
        assert.equal(editor.getValue(), "    <div>\n        <div>");

        editor.setValue("  <div></div>", 1);
        exec("insertstring", 1, "\n");
        assert.equal(editor.getValue(), "  <div></div>\n  ");

        editor.setValue("    <br><br>", 1);
        editor.selection.moveTo(0, 8);
        exec("insertstring", 1, "\n");
        assert.equal(editor.getValue(), "    <br>\n    <br>");

        editor.setValue("<div a='x", 1);
        exec("gotoleft", 1);
        exec("insertstring", 1, ">");
        assert.equal(editor.getValue(), "<div a='>x");

        editor.setValue("");
        "<!DOCTYPE html></div><link><a>".split("").forEach(function(ch) {
            exec("insertstring", 1, ch);
        });
        assert.equal(editor.getValue(), "<!DOCTYPE html></div><link><a></a>");
    },
    "test: quotes": function() {
        editor = new Editor(new MockRenderer());
        editor.session.setMode(new RustMode);
        editor.setValue("");
        exec("insertstring", 1, '"');
        exec("insertstring", 1, 'a');
        assert.equal(editor.getValue(), '"a"');
        exec("backspace", 2);
        exec("insertstring", 1, "'");
        assert.equal(editor.getValue(), "'");

        editor.session.setMode(new JavaScriptMode);
        editor.setValue("");
        exec("insertstring", 1, '"');
        exec("insertstring", 1, 'a');
        assert.equal(editor.getValue(), '"a"');
        exec("backspace", 2);
        exec("insertstring", 1, "'");
        assert.equal(editor.getValue(), "''");
        exec("backspace", 1);
        exec("insertstring", 1, '`');
        exec("insertstring", 1, 'b');
        assert.equal(editor.getValue(), "`b`");

        editor.setValue("");
        exec("insertstring", 1, 'a');
        exec("insertstring", 1, "'");
        assert.equal(editor.getValue(), "a'");

        editor.setValue("");
        exec("insertstring", 1, 'b');
        exec("insertstring", 1, "`");
        assert.equal(editor.getValue(), "b``");
    },
    "test: css": function() {
        editor.session.setMode(new CSSMode());
        editor.setWrapBehavioursEnabled(true);
        editor.setValue("a {padding", 1);
        exec("insertstring", 1, ":");
        assert.equal(editor.getValue(), "a {padding:;");

        editor.setValue("a {padding:", 1);
        exec("gotoleft", 1);
        exec("insertstring", 1, ":");
        assert.equal(editor.getValue(), "a {padding:");

        editor.setValue("a {padding   ", 1);
        exec("insertstring", 1, ":");
        assert.equal(editor.getValue(), "a {padding   :;");

        editor.setValue("a", 1);
        exec("insertstring", 1, ":");
        assert.equal(editor.getValue(), "a:");

        editor.setValue("a {padding", 1);
        exec("insertstring", 1, ":");
        exec("backspace", 1);
        assert.equal(editor.getValue(), "a {padding");
        exec("backspace", 2);
        exec("insertstring", 1, ":;");
        exec("gotoleft", 1);
        exec("backspace", 1);
        assert.equal(editor.getValue(), "a {paddi;");

        editor.setValue("a {padding    :", 1);
        exec("backspace", 1);
        assert.equal(editor.getValue(), "a {padding    ");


        editor.setValue("a {padding:", 1);
        exec("insertstring", 1, ";");
        assert.equal(editor.getValue(), "a {padding:;");

        editor.setValue(";", 1);
        exec("gotoleft", 1);
        exec("insertstring", 1, "a {padding");
        exec("insertstring", 1, ":");
        assert.equal(editor.getValue(), "a {padding:;");

        editor.setValue(";", 1);
        exec("selectleft", 1);
        exec("insertstring", 1, ";");
        assert.equal(editor.getValue(), ";");

        editor.setValue("a {padding:;", 1);
        exec("gotoleft", 1);
        exec("insertstring", 1, ";");
        assert.equal(editor.getValue(), "a {padding:;");

        editor.setValue("a {padding:10px", 1);
        exec("insertstring", 1, "!");
        assert.equal(editor.getValue(), "a {padding:10px!important");
        exec("removewordleft", 2);
        exec("insertstring", 1, "}");
        exec("gotoleft", 1);
        exec("insertstring", 1, "!");
        assert.equal(editor.getValue(), "a {padding:10px!important}");
        exec("removewordleft", 2);
        exec("insertstring", 1, ";");
        exec("gotoleft", 1);
        exec("insertstring", 1, "!");
        assert.equal(editor.getValue(), "a {padding:10px!important;}");
        editor.selection.moveTo(0, 3);
        exec("insertstring", 1, "!");
        assert.equal(editor.getValue(), "a {!padding:10px!important;}");
    },
    "test: markdown": function() {
        editor.session.setMode(new MarkdownMode());
        editor.setValue("```html", 1);
        exec("insertstring", 1, "\n");
        assert.equal(editor.getValue(), "```html\n");
        editor.setValue("", 1);
        exec("insertstring", 1, "`");
        assert.equal(editor.getValue(), "``");
        exec("insertstring", 1, "x");
        exec("insertstring", 1, "`");
        assert.equal(editor.getValue(), "`x`");
        editor.setValue("", 1);
        exec("insertstring", 1, "`");
        exec("insertstring", 1, "`");
        exec("insertstring", 1, "`");
        exec("insertstring", 1, "x");
        exec("insertstring", 1, "`");
        exec("insertstring", 1, "`");
        exec("insertstring", 1, "`");
        assert.equal(editor.getValue(), "```x```");
        editor.setValue("", 1);
        exec("insertstring", 1, "`");
        exec("insertstring", 1, "`");
        exec("insertstring", 1, "x");
        exec("insertstring", 1, "`");
        exec("insertstring", 1, "`");
        assert.equal(editor.getValue(), "``x``");
        editor.setValue("", 1);
        exec("insertstring", 1, "`");
        exec("insertstring", 1, "`");
        exec("insertstring", 1, "-");
        exec("insertstring", 1, "`");
        exec("insertstring", 1, "`");
        assert.equal(editor.getValue(), "``-``");
        editor.session.setValue("+ List item\n+ List item 2", 1);
        editor.selection.moveTo(1, 2);
        editor.resize(true);
        exec("insertstring", 1, "    ");
        assert.equal(editor.getValue(), "+ List item\n    + List item 2");

    },
    "test: python": function() {
        editor.session.setMode(new PythonMode());
        editor.setValue("f", 1);
        exec("insertstring", 1, '"');
        assert.equal(editor.getValue(), 'f""');

        // there is no such prefix for python
        editor.setValue("p", 1);
        exec("insertstring", 1, '"');
        assert.equal(editor.getValue(), 'p"');
    },
    "test: doc comment auto-closing": function() {
        editor.session.setMode(new JavaScriptMode());
        editor.setWrapBehavioursEnabled(true);

        // Test case 1: Starting a new doc comment
        editor.setValue("/**", 1);
        exec("insertstring", 1, "\n");
        assert.equal(editor.getValue(), "/**\n * \n */");

        // Test case 2: Continuing an existing doc comment with asterisk on a new line
        editor.setValue("/**\n * Test", 1);
        editor.gotoLine(1, 5);
        exec("insertstring", 1, "\n");
        assert.equal(editor.getValue(), "/**\n * \n * Test");
        
        // Test case 3: Starting a new doc comment with 4-space indentation
        editor.setValue("    /**", 1);
        exec("insertstring", 1, "\n");
        assert.equal(editor.getValue(), "    /**\n     * \n     */");
    },
    "test: fragment auto-closing": function () {
        editor.setWrapBehavioursEnabled(true);
        editor.session.setMode(new JavaScriptMode());
        editor.setValue("");
        exec("insertstring", 1, '<');
        exec("insertstring", 1, '>');
        assert.equal(editor.getValue(), '<></>');
    }
};


if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
