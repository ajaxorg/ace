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

var EditSession = require("ace/edit_session").EditSession;
var Editor = require("ace/editor").Editor;
var UndoManager = require("ace/undomanager").UndoManager;
var MockRenderer = require("ace/test/mockrenderer");
var Range = require("ace/range").Range;
var assert = require("ace/test/assertions");

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
            var splits = EditSession.prototype.$computeWrapSplits(line, wrapLimit, tabSize);
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
    }
};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs/test").testcase(module.exports).exec()
}