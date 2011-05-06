/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Ajax.org Code Editor (ACE).
 *
 * The Initial Developer of the Original Code is
 * Ajax.org B.V.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Fabian Jakobs <fabian AT ajax DOT org>
 *      Julian Viereck <julian DOT viereck AT gmail DOT com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

if (typeof process !== "undefined") {
    require("../../support/paths");
    require("ace/test/mockdom");
}

define(function(require, exports, module) {

var lang = require("pilot/lang");
var EditSession = require("ace/edit_session").EditSession;
var Editor = require("ace/editor").Editor;
var UndoManager = require("ace/undomanager").UndoManager;
var MockRenderer = require("ace/test/mockrenderer");
var Range = require("ace/range").Range;
var assert = require("ace/test/assertions");

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

module.exports = {

   "test: find matching opening bracket" : function() {
        var session = new EditSession(["(()(", "())))"]);

        assert.position(session.findMatchingBracket({row: 0, column: 3}), 0, 1);
        assert.position(session.findMatchingBracket({row: 1, column: 2}), 1, 0);
        assert.position(session.findMatchingBracket({row: 1, column: 3}), 0, 3);
        assert.position(session.findMatchingBracket({row: 1, column: 4}), 0, 0);
        assert.equal(session.findMatchingBracket({row: 1, column: 5}), null);
    },

    "test: find matching closing bracket" : function() {
        var session = new EditSession(["(()(", "())))"]);

        assert.position(session.findMatchingBracket({row: 1, column: 1}), 1, 1);
        assert.position(session.findMatchingBracket({row: 1, column: 1}), 1, 1);
        assert.position(session.findMatchingBracket({row: 0, column: 4}), 1, 2);
        assert.position(session.findMatchingBracket({row: 0, column: 2}), 0, 2);
        assert.position(session.findMatchingBracket({row: 0, column: 1}), 1, 3);
        assert.equal(session.findMatchingBracket({row: 0, column: 0}), null);
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

    "test: documentToScreen with soft wrap and multibyte characters": function() {
        var tabSize = 4;
        var wrapLimit = 12;
        var session = new EditSession(["foo bar foo bar"]);
        session.setUseWrapMode(true);
        session.setWrapLimitRange(12, 12);
        session.adjustWrapLimit(80);

        assert.position(session.documentToScreenPosition(0, 11), 0, 11);
        assert.position(session.documentToScreenPosition(0, 12), 1, 0);

        session = new EditSession(["ぁぁa"]);
        session.setUseWrapMode(true);
        session.setWrapLimitRange(2, 2);
        session.adjustWrapLimit(80);

        assert.position(session.documentToScreenPosition(0, 1), 1, 0);
        assert.position(session.documentToScreenPosition(0, 2), 2, 0);
        assert.position(session.documentToScreenPosition(0, 4), 2, 1);
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

    "test: screenToDocument with soft wrap and multi byte characters": function() {
        var tabSize = 4;
        var wrapLimit = 12;
        var session = new EditSession(["foo bar foo bar"]);
        session.setUseWrapMode(true);
        session.setWrapLimitRange(12, 12);
        session.adjustWrapLimit(80);

        assert.position(session.screenToDocumentPosition(1, 0), 0, 12);
        assert.position(session.screenToDocumentPosition(0, 11), 0, 11);
        // Check if the position is clamped the right way.
        assert.position(session.screenToDocumentPosition(0, 12), 0, 11);
        assert.position(session.screenToDocumentPosition(0, 20), 0, 11);

        session = new EditSession(["ぁ a"]);
        session.setUseWrapMode(true);
        session.adjustWrapLimit(80);

        assert.position(session.screenToDocumentPosition(0, 1), 0, 0);
        assert.position(session.screenToDocumentPosition(0, 2), 0, 1);
        assert.position(session.screenToDocumentPosition(0, 3), 0, 2);
        assert.position(session.screenToDocumentPosition(0, 4), 0, 3);
        assert.position(session.screenToDocumentPosition(0, 5), 0, 3);
    },

    "test: wrapLine split function" : function() {
        var splits;
        var c = 0;

        function computeAndAssert(line, assertEqual, wrapLimit, tabSize) {
            wrapLimit = wrapLimit || 12;
            tabSize = tabSize || 4;
            line = lang.stringTrimRight(line);
            var tokens = EditSession.prototype.$getDisplayTokens(line);
            var splits = EditSession.prototype.$computeWrapSplits(tokens, wrapLimit, tabSize);
            // console.log("String:", line, "Result:", splits, "Expected:", assertEqual);
            assert.ok(splits.length == assertEqual.length);
            for (var i = 0; i < splits.length; i++) {
                assert.ok(splits[i] == assertEqual[i]);
            }
        }

        // Basic splitting.
        computeAndAssert("foo bar foo bar", [ 12 ]);
        computeAndAssert("foo bar f   bar", [ 12 ]);
        computeAndAssert("foo bar f     r", [ 14 ]);
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
        computeAndAssert("foo \t \t   \t \t bar", [ 14 ]);

        // Test wrapping for asian characters.
        computeAndAssert("ぁぁ", [1], 2);
        computeAndAssert(" ぁぁ", [1, 2], 2);
        computeAndAssert(" ぁ\tぁ", [1, 3], 2);
        computeAndAssert(" ぁぁ\tぁ", [1, 4], 4);
    },

    "test get longest line" : function() {
        var session = new EditSession(["12"]);
        session.setTabSize(4);
        assert.equal(session.getWidth(), 2);
        assert.equal(session.getScreenWidth(), 2);

        session.doc.insertNewLine(0);
        session.doc.insertLines(1, ["123"]);
        assert.equal(session.getWidth(), 3);
        assert.equal(session.getScreenWidth(), 3);

        session.doc.insertNewLine(0);
        session.doc.insertLines(1, ["\t\t"]);

        assert.equal(session.getWidth(), 3);
        assert.equal(session.getScreenWidth(), 8);

        session.setTabSize(2);
        assert.equal(session.getWidth(), 3);
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

        document.insertLines(0, ["a", "b"]);
        document.insertLines(2, ["c", "d"]);
        document.removeLines(1, 2);
    },

    "test wrapMode init has to create wrapData array": function() {
        var session = new EditSession("foo bar\nfoo bar");
        var editor = new Editor(new MockRenderer(), session);
        var document = session.getDocument();

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

    "test fold getFoldDisplayLine": function() {
        var session = createFoldTestSession();
        function assertDisplayLine(foldLine, str) {
            var line = session.getLine(foldLine.end.row);
            var displayLine =
                session.getFoldDisplayLine(foldLine, foldLine.end.row, line.length);
            assert.equal(displayLine, str);
        }

        assertDisplayLine(session.$foldData[0], "function foo(args...) {")
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
        var session = createFoldTestSession(),
            foldLines = session.$foldData;
            folds = foldLines[0].folds.concat(foldLines[1].folds);

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

        var foldLines = session.$foldData, foldLine, fold, folds;

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
        function assertArray(a, b) {
            assert.ok(a.length == b.length);
            for (var i = 0; i < a.length; i++) {
                assert.equal(a[i], b[i]);
            }
        }

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
        session.addFold("woot", 0, 4, 0, 15);
        assertWrap([4], [8], [8]);

        // Remove the fold again which should reset the wrapData.
        removeFoldAssertWrap(0, 4, [8], [8], [8]);

        session.addFold("woot", 0, 6, 0, 9);
        assertWrap([6, 13], [8], [8]);
        removeFoldAssertWrap(0, 6, [8], [8], [8]);

        // The fold fits into the wrap limit - no split expected.
        session.addFold("woot", 0, 3, 0, 15);
        assertWrap([], [8], [8]);
        removeFoldAssertWrap(0, 4, [8], [8], [8]);

        // Fold after split position should be all fine.
        session.addFold("woot", 0, 8, 0, 15);
        assertWrap([8], [8], [8]);
        removeFoldAssertWrap(0, 8, [8], [8], [8]);

        // Fold's placeholder is far too long for wrapSplit.
        session.addFold("woot0123456789", 0, 8, 0, 15);
        assertWrap([8], [8], [8]);
        removeFoldAssertWrap(0, 8, [8], [8], [8]);

        // Fold's placeholder is far too long for wrapSplit
        // + content at the end of the line
        session.addFold("woot0123456789", 0, 6, 0, 8);
        assertWrap([6, 20], [8], [8]);
        removeFoldAssertWrap(0, 8, [8], [8], [8]);

        session.addFold("woot0123456789", 0, 6, 0, 8);
        session.addFold("woot0123456789", 0, 8, 0, 10);
        assertWrap([6, 20, 34], [8], [8]);
        session.removeFold(session.getFoldAt(0, 7));
        removeFoldAssertWrap(0, 8, [8], [8], [8]);

        session.addFold("woot0123456789", 0, 7, 0, 9);
        session.addFold("woot0123456789", 0, 13, 0, 15);
        assertWrap([7, 21, 25], [8], [8]);
        session.removeFold(session.getFoldAt(0, 7));
        removeFoldAssertWrap(0, 14, [8], [8], [8]);

        // --- Do some multiline folding ---

        // Add a fold over two lines. Note, that the wrapData[1] stays the
        // same. This is an implementation detail and expected behavior.
        session.addFold("woot", 0, 8, 1, 15);
        assertWrap([8], [8 /* See comments */], [8]);
        removeFoldAssertWrap(0, 8, [8], [8], [8]);

        session.addFold("woot", 0, 9, 1, 11);
        assertWrap([8, 14], [8 /* See comments */], [8]);
        removeFoldAssertWrap(0, 9, [8], [8], [8]);

        session.addFold("woot", 0, 9, 1, 15);
        assertWrap([8], [8 /* See comments */], [8]);
        removeFoldAssertWrap(0, 9, [8], [8], [8]);

        return session;
    },

    "test add fold": function() {
        var session = createFoldTestSession();
        var fold;

        function tryAddFold(
            placeholder,
            startRow, startColumn, endRow, endColumn, shouldFail)
        {
            var fail = false;
            try {
                fold = session.addFold(placeholder,
                    startRow, startColumn, endRow, endColumn);
            } catch (e) {
                fail = true;
            }
            if (fail != shouldFail) {
                throw "Expected to get an exception";
            }
        }

        tryAddFold("foo", 0, 13, 0, 17, true);
        tryAddFold("foo", 0, 14, 0, 18, true);
        tryAddFold("foo", 0, 13, 0, 18, false);
        assert.equal(session.$foldData[0].folds.length, 1);

        tryAddFold("f", 0, 13, 0, 18, true);
        tryAddFold("foo", 0, 18, 0, 21, false);
        assert.equal(session.$foldData[0].folds.length, 2);
        session.removeFold(fold);

        tryAddFold("foo", 0, 18, 0, 22, true);
        tryAddFold("foo", 0, 18, 0, 19, true);
        tryAddFold("foo", 0, 22, 1, 10, true);
    },

    "test add subfolds": function() {
        var session = createFoldTestSession();
        var fold, oldFold;
        var foldData = session.$foldData;

        oldFold = foldData[0].folds[0];

        fold = session.addFold("fold0", 0, 10, 0, 21);
        assert.equal(foldData[0].folds.length, 1);
        assert.equal(fold.subFolds.length, 1);
        assert.equal(fold.subFolds[0], oldFold);

        session.expandFold(fold);
        assert.equal(foldData[0].folds.length, 1);
        assert.equal(foldData[0].folds[0], oldFold);
        assert.equal(fold.subFolds.length, 0);

        fold = session.addFold("fold0", 0, 13, 2, 10);
        assert.equal(foldData.length, 1);
        assert.equal(fold.subFolds.length, 2);
        assert.equal(fold.subFolds[0], oldFold);

        session.expandFold(fold);
        assert.equal(foldData.length, 2);
        assert.equal(foldData[0].folds.length, 1);
        assert.equal(foldData[0].folds[0], oldFold);
        assert.equal(fold.subFolds.length, 0);
    }
};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs/test").testcase(module.exports).exec()
}