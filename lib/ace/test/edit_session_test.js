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

define(function(require, exports, module) {

var EditSession     = require("ace/edit_session").EditSession,
    UndoManager     = require("ace/undomanager").UndoManager,
    MockRenderer    = require("./mockrenderer"),
    Range           = require("ace/range").Range,
    assert          = require("./assertions"),
    async           = require("asyncjs");

var Test = {

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
        assert.equal(session.documentToScreenColumn(0, 6), 9);
        assert.equal(session.documentToScreenColumn(0, 12), 15);
        assert.equal(session.documentToScreenColumn(0, 13), 19);

        session.setTabSize(2);

        assert.equal(session.documentToScreenColumn(0, 0), 0);
        assert.equal(session.documentToScreenColumn(0, 4), 4);
        assert.equal(session.documentToScreenColumn(0, 5), 5);
        assert.equal(session.documentToScreenColumn(0, 6), 7);
        assert.equal(session.documentToScreenColumn(0, 12), 13);
        assert.equal(session.documentToScreenColumn(0, 13), 15);
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
        session.setWrapLimit(12);
    
        assert.position(session.documentToScreenPosition(0, 11), 0, 11);
        assert.position(session.documentToScreenPosition(0, 12), 1, 0);
    
        session = new EditSession(["ぁぁa"]);
        session.setUseWrapMode(true);
        session.setWrapLimit(2);
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
        assert.equal(session.screenToDocumentColumn(0, 8), 5);
        assert.equal(session.screenToDocumentColumn(0, 9), 6);
        assert.equal(session.screenToDocumentColumn(0, 15), 12);
        assert.equal(session.screenToDocumentColumn(0, 19), 13);
    },
    
    "test: screenToDocument with soft wrap and multi byte characters": function() {
        var tabSize = 4;
        var wrapLimit = 12;
        var session = new EditSession(["foo bar foo bar"]);
        session.setUseWrapMode(true);
        session.setWrapLimit(12);
    
        assert.position(session.screenToDocumentPosition(1, 0), 0, 12);
        assert.position(session.screenToDocumentPosition(0, 11), 0, 11);
        // Check if the position is clamped the right way.
        assert.position(session.screenToDocumentPosition(0, 12), 0, 11);
        assert.position(session.screenToDocumentPosition(0, 20), 0, 11);
    
        session = new EditSession(["ぁ a"]);
        session.setUseWrapMode(true);
        assert.position(session.screenToDocumentPosition(0, 1), 0, 0);
        assert.position(session.screenToDocumentPosition(0, 2), 0, 1);
        assert.position(session.screenToDocumentPosition(0, 3), 0, 2);
        assert.position(session.screenToDocumentPosition(0, 4), 0, 3);
        assert.position(session.screenToDocumentPosition(0, 5), 0, 3);
    },
    
    "test: wrapLine split function" : function() {
        var splits;
        var computeWrapSplits = EditSession.prototype.$computeWrapSplits;
        var c = 0;
    
        function computeAndAssert(line, assertEqual, wrapLimit, tabSize) {
            wrapLimit = wrapLimit || 12;
            tabSize = tabSize || 4;
            splits = computeWrapSplits.call(EditSession.prototype, line, wrapLimit, tabSize);
            console.log("String:", line, "Result:", splits, "Expected:", assertEqual);
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

    "test: insert text in multiple rows": function() {
        var session = new EditSession(["12", "", "abcd"]);

        var inserted = session.multiRowInsert([0, 1, 2], 2, "juhu 1");
        assert.equal(inserted.rows, 0);
        assert.equal(inserted.columns, 6);

        assert.equal(session.getValue(), ["12juhu 1", "  juhu 1", "abjuhu 1cd"].join("\n"));
    },

    "test: undo insert text in multiple rows": function() {
        var session = new EditSession(["12", "", "abcd"]);

        var undoManager = new UndoManager();
        session.setUndoManager(undoManager);

        session.multiRowInsert([0, 1, 2], 2, "juhu 1");
        session.$informUndoManager.call();
        assert.equal(session.getValue(), ["12juhu 1", "  juhu 1", "abjuhu 1cd"].join("\n"));

        undoManager.undo();
        assert.equal(session.getValue(), ["12", "", "abcd"].join("\n"));

        undoManager.redo();
        assert.equal(session.getValue(), ["12juhu 1", "  juhu 1", "abjuhu 1cd"].join("\n"));
    },

    "test: insert new line in multiple rows": function() {
        var session = new EditSession(["12", "", "abcd"]);

        var inserted = session.multiRowInsert([0, 1, 2], 2, "\n");
        assert.equal(inserted.rows, 1);
        assert.equal(session.getValue(), ["12\n", "  \n", "ab\ncd"].join("\n"));
    },

    "test: insert multi line text in multiple rows": function() {
        var session = new EditSession(["12", "", "abcd"]);

        var inserted = session.multiRowInsert([0, 1, 2], 2, "juhu\n12");
        assert.equal(inserted.rows, 1);
        assert.equal(session.getValue(), ["12juhu\n12", "  juhu\n12", "abjuhu\n12cd"].join("\n"));
    },

    "test: remove right in multiple rows" : function() {
        var session = new EditSession(["12", "", "abcd"]);

        session.multiRowRemove([0, 1, 2], new Range(0, 2, 0, 3));
        assert.equal(session.getValue(), ["12", "", "abd"].join("\n"));
    },

    "test: undo remove right in multiple rows" : function() {
        var session = new EditSession(["12", "", "abcd"]);
        var undoManager = new UndoManager();
        session.setUndoManager(undoManager);

        session.multiRowRemove([0, 1, 2], new Range(0, 1, 0, 3));
        session.$informUndoManager.call();
        assert.equal(session.getValue(), ["1", "", "ad"].join("\n"));

        undoManager.undo();
        assert.equal(session.getValue(), ["12", "", "abcd"].join("\n"));

        undoManager.redo();
        assert.equal(session.getValue(), ["1", "", "ad"].join("\n"));
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
        assert.equal(session.$getDisplayTokens("abc\t").length, 7);
    }
};

module.exports = require("asyncjs/test").testcase(Test);
});

if (module === require.main) {
    require("../../../support/paths");
    exports.exec()
}