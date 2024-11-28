if (typeof process !== "undefined") {
    require("amd-loader");
    require("./test/mockdom");
}

"use strict";

var lang = require("./lib/lang");
var EditSession = require("./edit_session").EditSession;
var Editor = require("./editor").Editor;
var UndoManager = require("./undomanager").UndoManager;
var MockRenderer = require("./test/mockrenderer").MockRenderer;
var Range = require("./range").Range;
var assert = require("./test/assertions");
var JavaScriptMode = require("./mode/javascript").Mode;

require("./multi_select");

function createFoldTestSession() {
    var lines = [
        "function foo(items) {",
        "    for (var i=0; i<items.length; i++) {",
        "        alert(items[i] + \"juhu\");",
        "    }    // Real Tab.",
        "}"
    ];
    var session = new EditSession(lines.join("\n"));
    session.setUndoManager(new UndoManager());
    session.addFold("args...", new Range(0, 13, 0, 18));
    session.addFold("foo...", new Range(1, 10, 2, 10));
    session.addFold("bar...", new Range(2, 20, 2, 25));
    return session;
}

function assertArray(a, b) {
    assert.equal(a+"", b+"");
    assert.ok(a.length == b.length);
    for (var i = 0; i < a.length; i++) {
        assert.equal(a[i], b[i]);
    }
}

module.exports = {

   "test: find matching opening bracket in Text mode" : function() {
        var session = new EditSession(["(()(", "())))"]);

        assert.position(session.findMatchingBracket({row: 0, column: 3}), 0, 1);
        assert.position(session.findMatchingBracket({row: 1, column: 2}), 1, 0);
        assert.position(session.findMatchingBracket({row: 1, column: 3}), 0, 3);
        assert.position(session.findMatchingBracket({row: 1, column: 4}), 0, 0);
        assert.equal(session.findMatchingBracket({row: 1, column: 5}), null);
    },

    "test: find matching closing bracket in Text mode" : function() {
        var session = new EditSession(["(()(", "())))"]);

        assert.position(session.findMatchingBracket({row: 1, column: 1}), 1, 1);
        assert.position(session.findMatchingBracket({row: 1, column: 1}), 1, 1);
        assert.position(session.findMatchingBracket({row: 0, column: 4}), 1, 2);
        assert.position(session.findMatchingBracket({row: 0, column: 2}), 0, 2);
        assert.position(session.findMatchingBracket({row: 0, column: 1}), 1, 3);
        assert.equal(session.findMatchingBracket({row: 0, column: 0}), null);
    },

    "test: find matching opening bracket in JavaScript mode" : function() {
        var lines = [
            "function foo() {",
            "    var str = \"{ foo()\";",
            "    if (debug) {",
            "        // write str (a string) to the console",
            "        console.log(str);",
            "    }",
            "    str += \" bar() }\";",
            "}"
        ];
        var session = new EditSession(lines.join("\n"), new JavaScriptMode());

        assert.position(session.findMatchingBracket({row: 0, column: 14}), 0, 12);
        assert.position(session.findMatchingBracket({row: 7, column: 1}), 0, 15);
        assert.position(session.findMatchingBracket({row: 6, column: 20}), 1, 15);
        assert.position(session.findMatchingBracket({row: 1, column: 22}), 1, 20);
        assert.position(session.findMatchingBracket({row: 3, column: 31}), 3, 21);
        assert.position(session.findMatchingBracket({row: 4, column: 24}), 4, 19);
        assert.equal(session.findMatchingBracket({row: 0, column: 1}), null);
    },

    "test: find matching closing bracket in JavaScript mode" : function() {
        var lines = [
            "function foo() {",
            "    var str = \"{ foo()\";",
            "    if (debug) {",
            "        // write str (a string) to the console",
            "        console.log(str);",
            "    }",
            "    str += \" bar() }\";",
            "}"
        ];
        var session = new EditSession(lines.join("\n"), new JavaScriptMode());

        assert.position(session.findMatchingBracket({row: 0, column: 13}), 0, 13);
        assert.position(session.findMatchingBracket({row: 0, column: 16}), 7, 0);
        assert.position(session.findMatchingBracket({row: 1, column: 16}), 6, 19);
        assert.position(session.findMatchingBracket({row: 1, column: 21}), 1, 21);
        assert.position(session.findMatchingBracket({row: 3, column: 22}), 3, 30);
        assert.position(session.findMatchingBracket({row: 4, column: 20}), 4, 23);
    },

    "test: handle unbalanced brackets in JavaScript mode" : function() {
        var lines = [
            "function foo() {",
            "    var str = \"{ foo()\";",
            "    if (debug) {",
            "        // write str a string) to the console",
            "        console.log(str);",
            "    ",
            "    str += \" bar() \";",
            "}"
        ];
        var session = new EditSession(lines.join("\n"), new JavaScriptMode());

        assert.equal(session.findMatchingBracket({row: 0, column: 16}), null);
        assert.equal(session.findMatchingBracket({row: 3, column: 30}), null);
        assert.equal(session.findMatchingBracket({row: 1, column: 16}), null);
    },

    "test: match different bracket types" : function() {
        var session = new EditSession(["({[", ")]}"]);

        assert.position(session.findMatchingBracket({row: 0, column: 1}), 1, 0);
        assert.position(session.findMatchingBracket({row: 0, column: 2}), 1, 2);
        assert.position(session.findMatchingBracket({row: 0, column: 3}), 1, 1);

        assert.position(session.findMatchingBracket({row: 1, column: 1}), 0, 0);
        assert.position(session.findMatchingBracket({row: 1, column: 2}), 0, 2);
        assert.position(session.findMatchingBracket({row: 1, column: 3}), 0, 1);
    },

    "test: move lines down" : function() {
        var session = new EditSession(["a1", "a2", "a3", "a4"]);

        session.moveLinesDown(0, 1);
        assert.equal(session.getValue(), ["a3", "a1", "a2", "a4"].join("\n"));

        session.moveLinesDown(1, 2);
        assert.equal(session.getValue(), ["a3", "a4", "a1", "a2"].join("\n"));

        session.moveLinesDown(2, 3);
        assert.equal(session.getValue(), ["a3", "a4", "a1", "a2"].join("\n"));

        session.moveLinesDown(2, 2);
        assert.equal(session.getValue(), ["a3", "a4", "a2", "a1"].join("\n"));
    },

    "test: move lines up" : function() {
        var session = new EditSession(["a1", "a2", "a3", "a4"]);

        session.moveLinesUp(2, 3);
        assert.equal(session.getValue(), ["a1", "a3", "a4", "a2"].join("\n"));

        session.moveLinesUp(1, 2);
        assert.equal(session.getValue(), ["a3", "a4", "a1", "a2"].join("\n"));

        session.moveLinesUp(0, 1);
        assert.equal(session.getValue(), ["a3", "a4", "a1", "a2"].join("\n"));

        session.moveLinesUp(2, 2);
        assert.equal(session.getValue(), ["a3", "a1", "a4", "a2"].join("\n"));
    },

    "test: duplicate lines" : function() {
        var session = new EditSession(["1", "2", "3", "4"]);

        session.duplicateLines(1, 2);
        assert.equal(session.getValue(), ["1", "2", "3", "2", "3", "4"].join("\n"));
    },

    "test: duplicate last line" : function() {
        var session = new EditSession(["1", "2", "3"]);

        session.duplicateLines(2, 2);
        assert.equal(session.getValue(), ["1", "2", "3", "3"].join("\n"));
    },

    "test: duplicate first line" : function() {
        var session = new EditSession(["1", "2", "3"]);

        session.duplicateLines(0, 0);
        assert.equal(session.getValue(), ["1", "1", "2", "3"].join("\n"));
    },

    "test: getScreenLastRowColumn": function() {
        var session = new EditSession([
            "juhu",
            "12\t\t34",
            "ぁぁa"
        ]);

        assert.equal(session.getScreenLastRowColumn(0), 4);
        assert.equal(session.getScreenLastRowColumn(1), 10);
        assert.equal(session.getScreenLastRowColumn(2), 5);
    },

    "test: convert document to screen coordinates" : function() {
        var session = new EditSession("01234\t567890\t1234");
        session.setTabSize(4);

        assert.equal(session.documentToScreenColumn(0, 0), 0);
        assert.equal(session.documentToScreenColumn(0, 4), 4);
        assert.equal(session.documentToScreenColumn(0, 5), 5);
        assert.equal(session.documentToScreenColumn(0, 6), 8);
        assert.equal(session.documentToScreenColumn(0, 12), 14);
        assert.equal(session.documentToScreenColumn(0, 13), 16);

        session.setTabSize(2);

        assert.equal(session.documentToScreenColumn(0, 0), 0);
        assert.equal(session.documentToScreenColumn(0, 4), 4);
        assert.equal(session.documentToScreenColumn(0, 5), 5);
        assert.equal(session.documentToScreenColumn(0, 6), 6);
        assert.equal(session.documentToScreenColumn(0, 7), 7);
        assert.equal(session.documentToScreenColumn(0, 12), 12);
        assert.equal(session.documentToScreenColumn(0, 13), 14);
    },

    "test: convert document to screen coordinates with leading tabs": function() {
        var session = new EditSession("\t\t123");
        session.setTabSize(4);

        assert.equal(session.documentToScreenColumn(0, 0), 0);
        assert.equal(session.documentToScreenColumn(0, 1), 4);
        assert.equal(session.documentToScreenColumn(0, 2), 8);
        assert.equal(session.documentToScreenColumn(0, 3), 9);
    },

    "test: documentToScreen without soft wrap": function() {
        var session = new EditSession([
            "juhu",
            "12\t\t34",
            "ぁぁa"
        ]);

        assert.position(session.documentToScreenPosition(0, 3), 0, 3);
        assert.position(session.documentToScreenPosition(1, 3), 1, 4);
        assert.position(session.documentToScreenPosition(1, 4), 1, 8);
        assert.position(session.documentToScreenPosition(2, 2), 2, 4);
    },

    "test: documentToScreen with soft wrap": function() {
        var session = new EditSession(["foo bar foo bar"]);
        session.setUseWrapMode(true);
        session.setWrapLimitRange(12, 12);
        session.adjustWrapLimit(80);
        session.setOption("wrapMethod", "text");
        assert.position(session.documentToScreenPosition(0, 11), 0, 11);
        assert.position(session.documentToScreenPosition(0, 12), 1, 0);
    },

    "test: documentToScreen with soft wrap and multibyte characters": function() {
        var session = new EditSession(["ぁぁa"]);
        session.setUseWrapMode(true);
        session.setWrapLimitRange(2, 2);
        session.adjustWrapLimit(80);

        assert.position(session.documentToScreenPosition(0, 1), 1, 0);
        assert.position(session.documentToScreenPosition(0, 2), 2, 0);
        assert.position(session.documentToScreenPosition(0, 4), 2, 1);
    },

    "test: documentToScreen should clip position to the document boundaries": function() {
        var session = new EditSession("foo bar\njuhu kinners");

        assert.position(session.documentToScreenPosition(-1, 4), 0, 0);
        assert.position(session.documentToScreenPosition(3, 0), 1, 12);
    },

    "test: convert screen to document coordinates" : function() {
        var session = new EditSession("01234\t567890\t1234");
        session.setTabSize(4);

        assert.equal(session.screenToDocumentColumn(0, 0), 0);
        assert.equal(session.screenToDocumentColumn(0, 4), 4);
        assert.equal(session.screenToDocumentColumn(0, 5), 5);
        assert.equal(session.screenToDocumentColumn(0, 6), 5);
        assert.equal(session.screenToDocumentColumn(0, 7), 5);
        assert.equal(session.screenToDocumentColumn(0, 8), 6);
        assert.equal(session.screenToDocumentColumn(0, 9), 7);
        assert.equal(session.screenToDocumentColumn(0, 15), 12);
        assert.equal(session.screenToDocumentColumn(0, 19), 16);

        session.setTabSize(2);

        assert.equal(session.screenToDocumentColumn(0, 0), 0);
        assert.equal(session.screenToDocumentColumn(0, 4), 4);
        assert.equal(session.screenToDocumentColumn(0, 5), 5);
        assert.equal(session.screenToDocumentColumn(0, 6), 6);
        assert.equal(session.screenToDocumentColumn(0, 12), 12);
        assert.equal(session.screenToDocumentColumn(0, 13), 12);
        assert.equal(session.screenToDocumentColumn(0, 14), 13);
    },

    "test: screenToDocument with soft wrap": function() {
        var session = new EditSession(["foo bar foo bar"]);
        session.setUseWrapMode(true);
        session.setWrapLimitRange(12, 12);
        session.adjustWrapLimit(80);

        assert.position(session.screenToDocumentPosition(1, 0), 0, 12);
        assert.position(session.screenToDocumentPosition(0, 11), 0, 11);
        // Check if the position is clamped the right way.
        assert.position(session.screenToDocumentPosition(0, 12), 0, 11);
        assert.position(session.screenToDocumentPosition(0, 20), 0, 11);
    },

    "test: screenToDocument with soft wrap and multi byte characters": function() {
        var session = new EditSession(["ぁ a"]);
        session.setUseWrapMode(true);
        session.adjustWrapLimit(80);

        assert.position(session.screenToDocumentPosition(0, 1), 0, 0);
        assert.position(session.screenToDocumentPosition(0, 2), 0, 1);
        assert.position(session.screenToDocumentPosition(0, 3), 0, 2);
        assert.position(session.screenToDocumentPosition(0, 4), 0, 3);
        assert.position(session.screenToDocumentPosition(0, 5), 0, 3);
    },

    "test: screenToDocument should clip position to the document boundaries": function() {
        var session = new EditSession("foo bar\njuhu kinners");

        assert.position(session.screenToDocumentPosition(-1, 4), 0, 0);
        assert.position(session.screenToDocumentPosition(0, -1), 0, 0);
        assert.position(session.screenToDocumentPosition(0, 30), 0, 7);
        assert.position(session.screenToDocumentPosition(2, 4), 1, 12);
        assert.position(session.screenToDocumentPosition(1, 30), 1, 12);
        assert.position(session.screenToDocumentPosition(20, 50), 1, 12);
        assert.position(session.screenToDocumentPosition(20, 5), 1, 12);

        // and the same for folded rows
        session.addFold("...", new Range(0,1,1,3));
        assert.position(session.screenToDocumentPosition(1, 2), 1, 12);
        // for wrapped rows
        session.setUseWrapMode(true);
        session.setWrapLimitRange(5,5);
        assert.position(session.screenToDocumentPosition(4, 1), 1, 12);
    },

    "test: wrapLine split function" : function() {
        function computeAndAssert(line, assertEqual, wrapLimit, tabSize) {
            wrapLimit = wrapLimit || 12;
            tabSize = tabSize || 4;
            line = lang.stringTrimRight(line);
            var tokens = EditSession.prototype.$getDisplayTokens(line);
            var splits = EditSession.prototype.$computeWrapSplits(tokens, wrapLimit, tabSize);

            assert.ok(splits.length == assertEqual.length);
            for (var i = 0; i < splits.length; i++) {
                assert.ok(splits[i] == assertEqual[i]);
            }
        }
        
        EditSession.prototype.$wrapAsCode = true;
        EditSession.prototype.$indentedSoftWrap = false;
        // Basic splitting.
        computeAndAssert("foo bar foo bar", [ 12 ]);
        computeAndAssert("foo bar f   bar", [ 12 ]);
        computeAndAssert("foo bar f     r", [ 12 ]); // 14 if we enable 
        computeAndAssert("foo bar foo bar foo bara foo", [12, 25]);

        // Don't split if there is only whitespaces/tabs at the end of the line.
        computeAndAssert("foo foo foo \t \t", [ ]);

        // If there is no space to split, force split.
        computeAndAssert("foooooooooooooo", [ 12 ]);
        computeAndAssert("fooooooooooooooooooooooooooo", [12, 24]);
        computeAndAssert("foo bar fooooooooooobooooooo", [8,  20]);

        // Basic splitting + tabs.
        computeAndAssert("foo \t\tbar", [ 6 ]);
        computeAndAssert("foo \t \tbar", [ 7 ]);

        // Ignore spaces/tabs at beginning of split.
        computeAndAssert("foo \t \t   \t \t bar", [ 7 ]); // 14

        // Test wrapping for asian characters.
        computeAndAssert("ぁぁ", [1], 2);
        computeAndAssert(" ぁぁ", [1, 2], 2);
        computeAndAssert(" ぁ\tぁ", [1, 3], 2);
        computeAndAssert(" ぁぁ\tぁ", [2, 4], 4);
        computeAndAssert("ぁぁ ぁぁ\tぁ", [3, 6], 6);

        // Test wrapping for punctuation.
        computeAndAssert(" ab.c;ef++", [2, 4, 6, 8], 2);
        computeAndAssert(" ab.c;ef++", [3, 5, 8], 3);
        computeAndAssert(" a.b", [1, 2, 3], 1);
        computeAndAssert("#>>", [1, 2], 1);
        
        // Test wrapping for punctuation in
        EditSession.prototype.$wrapAsCode = false;
        computeAndAssert("ab cde, Juhu kinners", [3, 8, 13, 19], 6);

        // test indented wrapping
        EditSession.prototype.$indentedSoftWrap = true;
        computeAndAssert("foo bar foo bar foo bara foo", [12, 25]);
        computeAndAssert("fooooooooooooooooooooooooooo", [12, 24]);
        computeAndAssert("\t\tfoo bar fooooooooooobooooooo", [6, 10, 16, 22, 28]);
        computeAndAssert("\t\t\tfoo bar fooooooooooobooooooo", [3, 7, 11, 17, 23, 29]);
        computeAndAssert("\tfoo \t \t   \t \t bar", [6, 12]); // 14
    },

    "test get longest line" : function() {
        var session = new EditSession(["12"]);
        session.setTabSize(4);
        assert.equal(session.getScreenWidth(), 2);

        session.doc.insertMergedLines({row: 0, column: Infinity}, ['', '']);
        session.doc.insertFullLines(1, ["123"]);
        assert.equal(session.getScreenWidth(), 3);

        session.doc.insertMergedLines({row: 0, column: Infinity}, ['', '']);
        session.doc.insertFullLines(1, ["\t\t"]);

        assert.equal(session.getScreenWidth(), 8);

        session.setTabSize(2);
        assert.equal(session.getScreenWidth(), 4);
    },

    "test getDisplayString": function() {
        var session = new EditSession(["12"]);
        session.setTabSize(4);

        assert.equal(session.$getDisplayTokens("\t").length, 4);
        assert.equal(session.$getDisplayTokens("abc").length, 3);
        assert.equal(session.$getDisplayTokens("abc\t").length, 4);
    },

    "test issue 83": function() {
        var session = new EditSession("");
        var editor = new Editor(new MockRenderer(), session);
        var document = session.getDocument();

        session.setUseWrapMode(true);

        document.insertFullLines(0, ["a", "b"]);
        document.insertFullLines(2, ["c", "d"]);
        document.removeFullLines(1, 2);
    },

    "test wrapMode init has to create wrapData array": function() {
        var session = new EditSession("foo bar\nfoo bar");
        var editor = new Editor(new MockRenderer(), session);

        session.setUseWrapMode(true);
        session.setWrapLimitRange(3, 3);
        session.adjustWrapLimit(80);

        // Test if wrapData is there and was computed.
        assert.equal(session.$wrapData.length, 2);
        assert.equal(session.$wrapData[0].length, 1);
        assert.equal(session.$wrapData[1].length, 1);
    },

    "test first line blank with wrap": function() {
        var session = new EditSession("\nfoo");
        session.setUseWrapMode(true);
        assert.equal(session.doc.getValue(), ["", "foo"].join("\n"));
    },

    "test first line blank with wrap 2" : function() {
        var session = new EditSession("");
        session.setUseWrapMode(true);
        session.setValue("\nfoo");

        assert.equal(session.doc.getValue(), ["", "foo"].join("\n"));
    },
    
    "test foldAll": function() {
        var session = createFoldTestSession();
        var editor = new Editor(new MockRenderer(), session);
        var value = "  /*\n*comment\n*/\n" + editor.getValue() + "\n";
        editor.setValue(value + value, 1);
        editor.setOption("mode", new JavaScriptMode());

        editor.execCommand("foldToLevel1");
        assert.equal(session.$foldData.length, 2);
        editor.execCommand("foldAllComments");
        assert.equal(session.$foldData.length, 4);
        editor.execCommand("foldall");
        assert.equal(session.$foldData.length, 4);
        assert.equal(session.$foldData[1].range.start.row, 3);
        assert.equal(session.$foldData[3].range.start.row, 11);
        editor.execCommand("golineup");
        editor.execCommand("gotolineend");
        editor.execCommand("unfold");
        assert.equal(session.$foldData.length, 4);
        assert.equal(session.$foldData[3].range.start.row, 12);
        editor.execCommand("unfoldall");
        assert.equal(session.$foldData.length, 0);
    },

    "test setting undefined value": function() {
        var session = createFoldTestSession();
        var editor = new Editor(new MockRenderer(), session);
        editor.setOption("mode", new JavaScriptMode());

        editor.setValue("test");
        assert.equal(session.getValue(), "test");

        editor.setValue(undefined);
        assert.equal(session.getValue(), "");

        editor.setValue("test");
        assert.equal(session.getValue(), "test");
    },

    "test foldOther": function() {
        var session = new EditSession("{\n\t1{\n\t\t\n\t\t1.1 {\n\t\t}\n\t}\n\t2 {\n\t\t2.1 {\n\t\t\t2.2 {\n\t\t\t}\n\t\t\t2.3 {\n\t\t\t}\n\t\t}\n\t}\n}\n\n{\n}");
        var editor = new Editor(new MockRenderer(), session);
        editor.setOption("mode", new JavaScriptMode());

        editor.gotoLine(3, 2);
        editor.execCommand("foldOther");
        assert.equal(foldRows(), "3,6,16");

        editor.find("2.2");
        assert.equal(foldRows(), "3,8,10,16");

        var removedFolds = session.unfold();
        assert.equal(removedFolds.length, 4);
        assert.equal(foldRows(), "");

        editor.session.addFold("xxx", new Range(1, 0, 7, 0));
        assert.equal(foldRows(), "1");
        editor.session.foldAll();
        assert.equal(foldRows(), "0,16");
        removedFolds = editor.session.unfold(editor.selection.getAllRanges());
        assert.equal(removedFolds.length, 1);
        assert.equal(foldRows(), "1,8,10,16");

        function foldRows() {
            return session.$foldData.map(function(x) {return x.start.row;}).join(",");
        }
    },

    "test fold getFoldDisplayLine": function() {
        var session = createFoldTestSession();
        function assertDisplayLine(foldLine, str) {
            var line = session.getLine(foldLine.end.row);
            var displayLine =
                session.getFoldDisplayLine(foldLine, foldLine.end.row, line.length);
            assert.equal(displayLine, str);
        }

        assertDisplayLine(session.$foldData[0], "function foo(args...) {");
        assertDisplayLine(session.$foldData[1], "    for (vfoo...ert(items[bar...\"juhu\");");
    },

    "test foldLine idxToPosition": function() {
        var session = createFoldTestSession();

        function assertIdx2Pos(foldLineIdx, idx, row, column) {
            var foldLine = session.$foldData[foldLineIdx];
            assert.position(foldLine.idxToPosition(idx), row, column);
        }

//        "function foo(items) {",
//        "    for (var i=0; i<items.length; i++) {",
//        "        alert(items[i] + \"juhu\");",
//        "    }    // Real Tab.",
//        "}"

        assertIdx2Pos(0, 12, 0, 12);
        assertIdx2Pos(0, 13, 0, 13);
        assertIdx2Pos(0, 14, 0, 13);
        assertIdx2Pos(0, 19, 0, 13);
        assertIdx2Pos(0, 20, 0, 18);

        assertIdx2Pos(1, 10, 1, 10);
        assertIdx2Pos(1, 11, 1, 10);
        assertIdx2Pos(1, 15, 1, 10);
        assertIdx2Pos(1, 16, 2, 10);
        assertIdx2Pos(1, 26, 2, 20);
        assertIdx2Pos(1, 27, 2, 20);
        assertIdx2Pos(1, 32, 2, 25);
    },

    "test fold documentToScreen": function() {
        var session = createFoldTestSession();
        function assertDoc2Screen(docRow, docCol, screenRow, screenCol) {
            assert.position(
                session.documentToScreenPosition(docRow, docCol),
                screenRow, screenCol
            );
        }

        // One fold ending in the same row.
        assertDoc2Screen(0,  0, 0, 0);
        assertDoc2Screen(0, 13, 0, 13);
        assertDoc2Screen(0, 14, 0, 13);
        assertDoc2Screen(0, 17, 0, 13);
        assertDoc2Screen(0, 18, 0, 20);

        // Fold ending on some other row.
        assertDoc2Screen(1,  0, 1, 0);
        assertDoc2Screen(1, 10, 1, 10);
        assertDoc2Screen(1, 11, 1, 10);
        assertDoc2Screen(1, 99, 1, 10);

        assertDoc2Screen(2,  0, 1, 10);
        assertDoc2Screen(2,  9, 1, 10);
        assertDoc2Screen(2, 10, 1, 16);
        assertDoc2Screen(2, 11, 1, 17);

        // Fold in the same row with fold over more then one row in the same row.
        assertDoc2Screen(2, 19, 1, 25);
        assertDoc2Screen(2, 20, 1, 26);
        assertDoc2Screen(2, 21, 1, 26);

        assertDoc2Screen(2, 24, 1, 26);
        assertDoc2Screen(2, 25, 1, 32);
        assertDoc2Screen(2, 26, 1, 33);
        assertDoc2Screen(2, 99, 1, 40);

        // Test one position after the folds. Should be all like normal.
        assertDoc2Screen(3,  0, 2,  0);
    },

    "test fold screenToDocument": function() {
        var session = createFoldTestSession();
        function assertScreen2Doc(docRow, docCol, screenRow, screenCol) {
            assert.position(
                session.screenToDocumentPosition(screenRow, screenCol),
                docRow, docCol
            );
        }

        // One fold ending in the same row.
        assertScreen2Doc(0,  0, 0, 0);
        assertScreen2Doc(0, 13, 0, 13);
        assertScreen2Doc(0, 13, 0, 14);
        assertScreen2Doc(0, 18, 0, 20);
        assertScreen2Doc(0, 19, 0, 21);

        // Fold ending on some other row.
        assertScreen2Doc(1,  0, 1, 0);
        assertScreen2Doc(1, 10, 1, 10);
        assertScreen2Doc(1, 10, 1, 11);

        assertScreen2Doc(1, 10, 1, 15);
        assertScreen2Doc(2, 10, 1, 16);
        assertScreen2Doc(2, 11, 1, 17);

        // Fold in the same row with fold over more then one row in the same row.
        assertScreen2Doc(2, 19, 1, 25);
        assertScreen2Doc(2, 20, 1, 26);
        assertScreen2Doc(2, 20, 1, 27);

        assertScreen2Doc(2, 20, 1, 31);
        assertScreen2Doc(2, 25, 1, 32);
        assertScreen2Doc(2, 26, 1, 33);
        assertScreen2Doc(2, 33, 1, 99);

        // Test one position after the folds. Should be all like normal.
        assertScreen2Doc(3,  0, 2,  0);
    },

    "test getFoldsInRange()": function() {
        var session = createFoldTestSession();
        var foldLines = session.$foldData;
        var folds = foldLines[0].folds.concat(foldLines[1].folds);

        function test(startRow, startColumn, endColumn, endRow, folds) {
            var r = new Range(startRow, startColumn, endColumn, endRow);
            var retFolds = session.getFoldsInRange(r);

            assert.ok(retFolds.length == folds.length);
            for (var i = 0; i < retFolds.length; i++) {
                assert.equal(retFolds[i].range + "", folds[i].range + "");
            }
        }

        test(0, 0, 0, 13,  [ ]);
        test(0, 0, 0, 14,  [ folds[0] ]);
        test(0, 0, 0, 18,  [ folds[0] ]);
        test(0, 0, 1, 10,  [ folds[0] ]);
        test(0, 0, 1, 11,  [ folds[0], folds[1] ]);
        test(0, 18, 1, 11, [ folds[1] ]);
        test(2, 0,  2, 13, [ folds[1] ]);
        test(2, 10, 2, 20, [ ]);
        test(2, 10, 2, 11, [ ]);
        test(2, 19, 2, 20, [ ]);
    },

    "test fold one-line text insert": function() {
        // These are mostly test for the FoldLine.addRemoveChars function.
        var session = createFoldTestSession();
        var undoManager = session.getUndoManager();
        var foldLines = session.$foldData;

        function insert(row, column, text) {
            session.insert({row: row, column: column}, text);

            // Force the session to store all changes made to the document NOW
            // on the undoManager's queue. Otherwise we can't undo in separate
            // steps later.
            session.$syncInformUndoManager();
        }

        var foldLine, fold, folds;
        // First line.
        foldLine = session.$foldData[0];
        fold = foldLine.folds[0];

        insert(0, 0, "0");
        assert.range(foldLine.range, 0, 14, 0, 19);
        assert.range(fold.range,     0, 14, 0, 19);
        insert(0, 14, "1");
        assert.range(foldLine.range, 0, 15, 0, 20);
        assert.range(fold.range,     0, 15, 0, 20);
        insert(0, 20, "2");
        assert.range(foldLine.range, 0, 15, 0, 20);
        assert.range(fold.range,     0, 15, 0, 20);

        // Second line.
        foldLine = session.$foldData[1];
        folds = foldLine.folds;

        insert(1, 0, "3");
        assert.range(foldLine.range, 1, 11, 2, 25);
        assert.range(folds[0].range, 1, 11, 2, 10);
        assert.range(folds[1].range, 2, 20, 2, 25);

        insert(1, 11, "4");
        assert.range(foldLine.range, 1, 12, 2, 25);
        assert.range(folds[0].range, 1, 12, 2, 10);
        assert.range(folds[1].range, 2, 20, 2, 25);

        insert(2, 10, "5");
        assert.range(foldLine.range, 1, 12, 2, 26);
        assert.range(folds[0].range, 1, 12, 2, 10);
        assert.range(folds[1].range, 2, 21, 2, 26);

        insert(2, 21, "6");
        assert.range(foldLine.range, 1, 12, 2, 27);
        assert.range(folds[0].range, 1, 12, 2, 10);
        assert.range(folds[1].range, 2, 22, 2, 27);

        insert(2, 27, "7");
        assert.range(foldLine.range, 1, 12, 2, 27);
        assert.range(folds[0].range, 1, 12, 2, 10);
        assert.range(folds[1].range, 2, 22, 2, 27);

        // UNDO = REMOVE
        undoManager.undo(); // 6
        assert.range(foldLine.range, 1, 12, 2, 27);
        assert.range(folds[0].range, 1, 12, 2, 10);
        assert.range(folds[1].range, 2, 22, 2, 27);

        undoManager.undo(); // 5
        assert.range(foldLine.range, 1, 12, 2, 26);
        assert.range(folds[0].range, 1, 12, 2, 10);
        assert.range(folds[1].range, 2, 21, 2, 26);

        undoManager.undo(); // 4
        assert.range(foldLine.range, 1, 12, 2, 25);
        assert.range(folds[0].range, 1, 12, 2, 10);
        assert.range(folds[1].range, 2, 20, 2, 25);

        undoManager.undo(); // 3
        assert.range(foldLine.range, 1, 11, 2, 25);
        assert.range(folds[0].range, 1, 11, 2, 10);
        assert.range(folds[1].range, 2, 20, 2, 25);

        undoManager.undo(); // Beginning first line.
        assert.equal(foldLines.length, 2);
        assert.range(foldLines[0].range, 0, 15, 0, 20);
        assert.range(foldLines[1].range, 1, 10, 2, 25);

        foldLine = session.$foldData[0];
        fold = foldLine.folds[0];

        undoManager.undo(); // 2
        assert.range(foldLine.range, 0, 15, 0, 20);
        assert.range(fold.range,     0, 15, 0, 20);

        undoManager.undo(); // 1
        assert.range(foldLine.range, 0, 14, 0, 19);
        assert.range(fold.range,     0, 14, 0, 19);

        undoManager.undo(); // 0
        assert.range(foldLine.range, 0, 13, 0, 18);
        assert.range(fold.range,     0, 13, 0, 18);
    },

    "test fold multi-line insert/remove": function() {
        var session = createFoldTestSession(),
            undoManager = session.getUndoManager(),
            foldLines = session.$foldData;
        function insert(row, column, text) {
            session.insert({row: row, column: column}, text);
            // Force the session to store all changes made to the document NOW
            // on the undoManager's queue. Otherwise we can't undo in separate
            // steps later.
            session.$syncInformUndoManager();
        }

        var foldLines = session.$foldData;

        insert(0, 0, "\nfo0");
        assert.equal(foldLines.length, 2);
        assert.range(foldLines[0].range, 1, 16, 1, 21);
        assert.range(foldLines[1].range, 2, 10, 3, 25);

        insert(2, 0, "\nba1");
        assert.equal(foldLines.length, 2);
        assert.range(foldLines[0].range, 1, 16, 1, 21);
        assert.range(foldLines[1].range, 3, 13, 4, 25);

        insert(3, 10, "\nfo2");
        assert.equal(foldLines.length, 2);
        assert.range(foldLines[0].range, 1, 16, 1, 21);
        assert.range(foldLines[1].range, 4,  6, 5, 25);

        insert(5, 10, "\nba3");
        assert.equal(foldLines.length, 3);
        assert.range(foldLines[0].range, 1, 16, 1, 21);
        assert.range(foldLines[1].range, 4,  6, 5, 10);
        assert.range(foldLines[2].range, 6, 13, 6, 18);

        insert(6, 18, "\nfo4");
        assert.equal(foldLines.length, 3);
        assert.range(foldLines[0].range, 1, 16, 1, 21);
        assert.range(foldLines[1].range, 4,  6, 5, 10);
        assert.range(foldLines[2].range, 6, 13, 6, 18);

        undoManager.undo(); // 3
        assert.equal(foldLines.length, 3);
        assert.range(foldLines[0].range, 1, 16, 1, 21);
        assert.range(foldLines[1].range, 4,  6, 5, 10);
        assert.range(foldLines[2].range, 6, 13, 6, 18);

        undoManager.undo(); // 2
        assert.equal(foldLines.length, 2);
        assert.range(foldLines[0].range, 1, 16, 1, 21);
        assert.range(foldLines[1].range, 4,  6, 5, 25);

        undoManager.undo(); // 1
        assert.equal(foldLines.length, 2);
        assert.range(foldLines[0].range, 1, 16, 1, 21);
        assert.range(foldLines[1].range, 3, 13, 4, 25);

        undoManager.undo(); // 0
        assert.equal(foldLines.length, 2);
        assert.range(foldLines[0].range, 1, 16, 1, 21);
        assert.range(foldLines[1].range, 2, 10, 3, 25);

        undoManager.undo(); // Beginning
        assert.equal(foldLines.length, 2);
        assert.range(foldLines[0].range, 0, 13, 0, 18);
        assert.range(foldLines[1].range, 1, 10, 2, 25);
        // TODO: Add test for inseration inside of folds.
    },

    "test fold wrap data compution": function() {
        function assertWrap(line0, line1, line2) {
            line0 && assertArray(wrapData[0], line0);
            line1 && assertArray(wrapData[1], line1);
            line2 && assertArray(wrapData[2], line2);
        }

        function removeFoldAssertWrap(docRow, docColumn, line0, line1, line2) {
            session.removeFold(session.getFoldAt(docRow, docColumn));
            assertWrap(line0, line1, line2);
        }

        var lines = [
            "foo bar foo bar",
            "foo bar foo bar",
            "foo bar foo bar"
        ];

        var session = new EditSession(lines.join("\n"));
        session.setUseWrapMode(true);
        session.$wrapLimit = 7;
        session.$updateWrapData(0, 2);
        var wrapData = session.$wrapData;

        // Do a simple assertion without folds to check basic functionallity.
        assertWrap([8], [8], [8]);

        // --- Do in line folding ---

        // Adding a fold. The split position is inside of the fold. As placeholder
        // are not splitable, the split should be before the split.
        session.addFold("woot", new Range(0, 4, 0, 15));
        assertWrap([4], [8], [8]);

        // Remove the fold again which should reset the wrapData.
        removeFoldAssertWrap(0, 4, [8], [8], [8]);

        session.addFold("woot", new Range(0, 6, 0, 9));
        assertWrap([6, 13], [8], [8]);
        removeFoldAssertWrap(0, 6, [8], [8], [8]);

        // The fold fits into the wrap limit - no split expected.
        session.addFold("woot", new Range(0, 3, 0, 15));
        assertWrap([], [8], [8]);
        removeFoldAssertWrap(0, 4, [8], [8], [8]);

        // Fold after split position should be all fine.
        session.addFold("woot", new Range(0, 8, 0, 15));
        assertWrap([8], [8], [8]);
        removeFoldAssertWrap(0, 8, [8], [8], [8]);

        // Fold's placeholder is far too long for wrapSplit.
        session.addFold("woot0123456789", new Range(0, 8, 0, 15));
        assertWrap([8], [8], [8]);
        removeFoldAssertWrap(0, 8, [8], [8], [8]);

        // Fold's placeholder is far too long for wrapSplit
        // + content at the end of the line
        session.addFold("woot0123456789", new Range(0, 6, 0, 8));
        assertWrap([6, 20], [8], [8]);
        removeFoldAssertWrap(0, 8, [8], [8], [8]);

        session.addFold("woot0123456789", new Range(0, 6, 0, 8));
        session.addFold("woot0123456789", new Range(0, 8, 0, 10));
        assertWrap([6, 20, 34], [8], [8]);
        session.removeFold(session.getFoldAt(0, 7));
        removeFoldAssertWrap(0, 8, [8], [8], [8]);

        session.addFold("woot0123456789", new Range(0, 7, 0, 9));
        session.addFold("woot0123456789", new Range(0, 13, 0, 15));
        assertWrap([7, 21, 25], [8], [8]);
        session.removeFold(session.getFoldAt(0, 7));
        removeFoldAssertWrap(0, 14, [8], [8], [8]);

        // --- Do some multiline folding ---

        // Add a fold over two lines. Note, that the wrapData[1] stays the
        // same. This is an implementation detail and expected behavior.
        session.addFold("woot", new Range(0, 8, 1, 15));
        assertWrap([8], [8 /* See comments */], [8]);
        removeFoldAssertWrap(0, 8, [8], [8], [8]);

        session.addFold("woot", new Range(0, 9, 1, 11));
        assertWrap([8, 14], [8 /* See comments */], [8]);
        removeFoldAssertWrap(0, 9, [8], [8], [8]);

        session.addFold("woot", new Range(0, 9, 1, 15));
        assertWrap([8], [8 /* See comments */], [8]);
        removeFoldAssertWrap(0, 9, [8], [8], [8]);

        return session;
    },
    
    "test delete fold with wrap enabled": function() {
        var session = new EditSession("");
        session.setValue([
            "This is some placeholder text that will be folded inline.",
            "This is some placeholder text that will be folded inline.",
            "More text.",
            "<p>The cursor in this paragraph text will be offset by 1 row.<p>",
            "<p>Everything after this will be offset as well due to the folds in the row before too.</p>"
        ].join("\n"));
        session.addFold('...', new Range(0, 8, 0, 42));
        session.addFold('...', new Range(1, 8, 1, 42));
        session.addFold('...', new Range(3, 7, 3, 51));
        session.setOption("wrap", 40);
        session.remove(new Range(0,0, 2, 5));
        // needed because adjustWrapLimit is called async from renderer
        session.adjustWrapLimit(80);
        
        assert.equal(session.$wrapData + "", [[], [], [40, 76]] + "");
    },
        
    "test add fold": function() {
        var session = createFoldTestSession();
        var fold;

        function addFold(placeholder, range) {
            fold = session.addFold(placeholder, range);
        }

        addFold("foo", new Range(0, 13, 0, 17));
        addFold("foo", new Range(0, 14, 0, 18));
        addFold("foo", new Range(0, 13, 0, 18));
        assert.equal(session.$foldData[0].folds.length, 1);

        addFold("f", new Range(0, 13, 0, 18));
        addFold("foo", new Range(0, 18, 0, 21));
        assert.equal(session.$foldData[0].folds.length, 2);
        session.removeFold(fold);

        addFold("foo", new Range(0, 18, 0, 22));
        addFold("foo", new Range(0, 18, 0, 19));
        addFold("foo", new Range(0, 22, 1, 10));
        
        session.unfold();
        addFold("x", new Range(1, 9, 3, 15));
        addFold("x", new Range(2, 9, 2, 15));
        addFold("x", new Range(2, 10, 2, 18));
        addFold("x", new Range(2, 10, 2, 18));
        addFold("x", new Range(2, 25, 2, 27));
        addFold("x", new Range(2, 28, 2, 30));
        addFold("x", new Range(2, 7, 2, 29));
        var folds = session.getFoldsInRange(new Range(0,0,100,100));
        assert.equal(folds.length, 1);
        session.expandFolds(folds);
        folds = session.getFoldsInRange(new Range(0,0,100,100));
        assert.equal(folds.length, 1);
        session.expandFolds(folds);
        folds = session.getFoldsInRange(new Range(0,0,100,100));
        assert.equal(folds.length, 2);
        session.expandFolds(folds);
        folds = session.getFoldsInRange(new Range(0,0,100,100));
        assert.equal(folds.length, 0);
    },

    "test add subfolds": function() {
        var session = createFoldTestSession();
        var fold, oldFold;
        var foldData = session.$foldData;

        oldFold = foldData[0].folds[0];

        fold = session.addFold("fold0", new Range(0, 10, 0, 21));
        assert.equal(foldData[0].folds.length, 1);
        assert.equal(fold.subFolds.length, 1);
        assert.equal(fold.subFolds[0], oldFold);

        session.expandFold(fold);
        assert.equal(foldData[0].folds.length, 1);
        assert.equal(foldData[0].folds[0], oldFold);
        assert.equal(fold.subFolds.length, 0);

        fold = session.addFold("fold0", new Range(0, 13, 2, 10));
        assert.equal(foldData.length, 1);
        assert.equal(fold.subFolds.length, 2);
        assert.equal(fold.subFolds[0], oldFold);

        session.expandFold(fold);
        assert.equal(foldData.length, 2);
        assert.equal(foldData[0].folds.length, 1);
        assert.equal(foldData[0].folds[0], oldFold);
        assert.equal(fold.subFolds.length, 0);

        session.unfold(null, true);
        fold = session.addFold("fold0", new Range(0, 0, 0, 21));
        session.addFold("fold0", new Range(0, 1, 0, 5));
        session.addFold("fold0", new Range(0, 6, 0, 8));
        assert.equal(fold.subFolds.length, 2);
    },

    "test row cache": function() {
        var session = createFoldTestSession();

        session.screenToDocumentPosition(2,3);
        assertArray(session.$docRowCache, [1,3]);
        assertArray(session.$screenRowCache, [1,2]);

        session.screenToDocumentPosition(5,3);
        assertArray(session.$docRowCache, [1,3,4]);
        assertArray(session.$screenRowCache, [1,2,3]);

        session.screenToDocumentPosition(0,3);
        assertArray(session.$docRowCache, [1,3,4]);
        assertArray(session.$screenRowCache, [1,2,3]);

        var pos = session.screenToDocumentPosition(0,0);
        assert.equal(pos.row, 0);
        assertArray(session.$docRowCache, [1,3,4]);
        assertArray(session.$screenRowCache, [1,2,3]);
        
        session.screenToDocumentPosition(1,0);
        assertArray(session.$docRowCache, [1,3,4]);
        assertArray(session.$screenRowCache, [1,2,3]);

        session.$resetRowCache();
        assertArray(session.$docRowCache, []);
        assertArray(session.$screenRowCache, []);
        
        session.screenToDocumentPosition(1,3);
        assertArray(session.$docRowCache, [1]);
        assertArray(session.$screenRowCache, [1]);
       
        session.screenToDocumentPosition(5,3);
        assertArray(session.$docRowCache, [1,3,4]);
        assertArray(session.$screenRowCache, [1,2,3]);
        
        session = new EditSession(new Array(30).join("\n"));
        session.documentToScreenPosition(2,0);
        session.documentToScreenPosition(2,0);
        assertArray(session.$docRowCache, [1,2]);
        assertArray(session.$screenRowCache, [1,2]);
    },

    "test annotations": function() {
        var session = new EditSession([]),
            annotation = {row: 0, type: 'info', text: "This is a test."};

        session.clearAnnotations();
        assertArray(session.getAnnotations(), []);
        session.setAnnotations([annotation]);
        assertArray(session.getAnnotations(), [annotation]);
    },
    
    "test: mode loading" : function(next) {
        delete EditSession.prototype.$modes["ace/mode/javascript"];
        delete EditSession.prototype.$modes["ace/mode/css"];
        delete EditSession.prototype.$modes["ace/mode/sh"];
        require("./config").setLoader(function(name, onLoad) {
            if (name == "ace/mode/javascript") {
                return onLoad(null, require("./mode/javascript"));
            }
            if (name == "ace/mode/sh") {
                return setTimeout(function() {
                    return onLoad(null, require("./mode/sh"));
                });
            }
            if (name == "ace/mode/css") {
                return setTimeout(function() {
                    return onLoad(null, require("./mode/css"));
                });
            }
        });
        var session = new EditSession([]);
        session.setMode("ace/mode/javascript");
        assert.equal(session.$modeId, "ace/mode/javascript");

        var modeChangeCallbacks = 0;
        session.once("changeMode", function() {
            assert.equal(session.$modeId, "ace/mode/sh");
            modeChangeCallbacks++;
        });
        session.setMode("ace/mode/sh", function() {
            assert.equal(session.$mode.$id, "ace/mode/sh");
            modeChangeCallbacks++;
        });
        assert.equal(session.$modeId, "ace/mode/sh");
        assert.equal(session.$mode.$id, "ace/mode/javascript");
        setTimeout(function() {
            assert.equal(modeChangeCallbacks, 2);
            session.setMode("ace/mode/javascript");
            assert.equal(session.$mode.$id, "ace/mode/javascript");
            session.setMode("ace/mode/sh");
            assert.equal(session.$mode.$id, "ace/mode/sh");
            session.setMode("ace/mode/css");
            assert.equal(session.$mode.$id, "ace/mode/sh");
            // TODO this should not error
            // session.destroy();
            setTimeout(function() {
                next();
            });
        }, 0);
    },

    "test: sets destroyed flag when destroy called and tokenizer is never null": function() {
        var session = new EditSession(["foo bar foo bar"]);
        assert.notEqual(session.bgTokenizer, null);
        assert.equal(session.destroyed, false);

        session.destroy();
        assert.equal(session.destroyed, true);
        assert.notEqual(session.bgTokenizer, null);
    },

    "test: JSON serialization": function() {
        var session = new EditSession(["Hello world!"]);
        session.setAnnotations([{row: 0, column: 0, text: "error test", type: "error"}]);
        session.setMode("ace/mode/javascript");
        session = EditSession.fromJSON(JSON.stringify(session));
        
        assert.equal(session.getAnnotations().length, 1);
        assert.equal(session.getMode().$id, "ace/mode/javascript");
        assert.equal(session.getScrollLeft(), 0);
        assert.equal(session.getScrollTop(), 0);
        assert.equal(session.getValue(), "Hello world!");
    },

    "test: operation handling : when session it not attached to an editor": function(done) {
        const session = new EditSession("Hello world!");
        const beforeEndOperationSpy = [];
        session.on("beforeEndOperation", () => {
            beforeEndOperationSpy.push(session.curOp);
        });

        // When both start and end operation are invoked by the consumer
        session.startOperation({command: {name: "inserting-both"}});
        session.insert({row: 0, column : 0}, "both");
        session.endOperation();
        assert.equal(beforeEndOperationSpy.length, 1);
        assert.equal(beforeEndOperationSpy[0].command.name, "inserting-both");
        assert.equal(beforeEndOperationSpy[0].docChanged, true);
        assert.equal(beforeEndOperationSpy[0].selectionChanged, true);

        // When only start operation is invoked
        session.startOperation({command: {name: "inserting-start"}});
        session.insert({row: 0, column : 0}, "start");
        setTimeout(() => {
            assert.equal(beforeEndOperationSpy.length, 2);
            assert.equal(beforeEndOperationSpy[1].command.name, "inserting-start");
            assert.equal(beforeEndOperationSpy[1].docChanged, true);
            assert.equal(beforeEndOperationSpy[1].selectionChanged, true);
            
            // When only end operation is invoked
            session.insert({row: 0, column : 0}, "end");
            session.endOperation();
            assert.equal(beforeEndOperationSpy.length, 3);
            assert.deepEqual(beforeEndOperationSpy[2].command, {});
            assert.equal(beforeEndOperationSpy[2].docChanged, true);
            assert.equal(beforeEndOperationSpy[2].selectionChanged, true);

            // When nothing is invoked
            session.insert({row: 0, column : 0}, "none");
            setTimeout(() => {
                assert.equal(beforeEndOperationSpy.length, 4);
                assert.deepEqual(beforeEndOperationSpy[3].command, {});
                assert.equal(beforeEndOperationSpy[3].docChanged, true);
                assert.equal(beforeEndOperationSpy[3].selectionChanged, true);
                
                done();
            }, 10);
        }, 10);
    },

    "test: operation handling : when session is attached to an editor": function(done) {
        const session = new EditSession("Hello world!");
        const editor = new Editor(new MockRenderer(), session);
        const beforeEndOperationSpySession = [];
        session.on("beforeEndOperation", () => {
            beforeEndOperationSpySession.push(session.curOp);
        });
        const beforeEndOperationSpyEditor = [];
        editor.on("beforeEndOperation", () => {
            beforeEndOperationSpyEditor.push(editor.curOp);
        });

        // Imperative update from editor
        editor.startOperation({command: {name: "imperative-update"}});
        editor.insert("update");
        editor.endOperation();
        for (const beforeEndOperationSpy of [beforeEndOperationSpySession, beforeEndOperationSpyEditor ]) {
            assert.equal(beforeEndOperationSpy.length, 1);
            assert.equal(beforeEndOperationSpy[0].command.name, "imperative-update");
            assert.equal(beforeEndOperationSpy[0].docChanged, true);
            assert.equal(beforeEndOperationSpy[0].selectionChanged, true);
            assert.equal(!!beforeEndOperationSpy[0].selectionBefore, true);
        }

        // Imperative update from session
        session.startOperation({command: {name: "session-update"}});
        session.insert({row: 0, column : 0},"update");
        session.endOperation();
        for (const beforeEndOperationSpy of [beforeEndOperationSpySession, beforeEndOperationSpyEditor ]) {
            assert.equal(beforeEndOperationSpy.length, 2);
            assert.equal(beforeEndOperationSpy[1].command.name, "session-update");
            assert.equal(beforeEndOperationSpy[1].docChanged, true);
            assert.equal(beforeEndOperationSpy[1].selectionChanged, true);
            assert.equal(!!beforeEndOperationSpy[1].selectionBefore, true);
        }

        // Command update
        editor.execCommand(editor.commands.byName.indent);
        for (const beforeEndOperationSpy of [beforeEndOperationSpySession, beforeEndOperationSpyEditor ]) {
            assert.equal(beforeEndOperationSpy.length, 3);
            assert.equal(beforeEndOperationSpy[2].command.name, "indent");
            assert.equal(beforeEndOperationSpy[2].docChanged, true);
            assert.equal(beforeEndOperationSpy[2].selectionChanged, true);
            assert.equal(!!beforeEndOperationSpy[2].selectionBefore, true);
        }

        // Session cleanup logic
        const newSession = new EditSession("Hello again!");
        editor.setSession(newSession);
        const beforeEndOperationSpyNewSession = [];
        newSession.on("beforeEndOperation", () => {
            beforeEndOperationSpyNewSession.push(newSession.curOp);
        });
        editor.execCommand(editor.commands.byName.indent);
        assert.equal(beforeEndOperationSpyEditor.length, 4);
        assert.equal(beforeEndOperationSpyNewSession.length, 1);
        assert.equal(beforeEndOperationSpySession.length, 3);

        // Imperative implicit update from editor
        editor.insert("update");
        setTimeout(() => {
            assert.equal(beforeEndOperationSpyEditor.length, 5);
            assert.equal(beforeEndOperationSpyNewSession.length, 2);
            done();
        }, 10);
    }
};

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
