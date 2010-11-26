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
 * Ajax.org Services B.V.
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

require("../../../support/paths");

var Document        = require("../document"),
    UndoManager     = require("../undomanager"),
    //Editor        = require("../editor"),
    MockRenderer    = require("./mockrenderer"),
    Range           = require("../range"),
    assert          = require("./assertions"),
    async           = require("async");
        
var Test = {

   "test: find matching opening bracket" : function() {
        var doc = new Document(["(()(", "())))"]);

        assert.position(doc.findMatchingBracket({row: 0, column: 3}), 0, 1);
        assert.position(doc.findMatchingBracket({row: 1, column: 2}), 1, 0);
        assert.position(doc.findMatchingBracket({row: 1, column: 3}), 0, 3);
        assert.position(doc.findMatchingBracket({row: 1, column: 4}), 0, 0);
        assert.equal(doc.findMatchingBracket({row: 1, column: 5}), null);
    },

    "test: find matching closing bracket" : function() {
        var doc = new Document(["(()(", "())))"]);

        assert.position(doc.findMatchingBracket({row: 1, column: 1}), 1, 1);
        assert.position(doc.findMatchingBracket({row: 1, column: 1}), 1, 1);
        assert.position(doc.findMatchingBracket({row: 0, column: 4}), 1, 2);
        assert.position(doc.findMatchingBracket({row: 0, column: 2}), 0, 2);
        assert.position(doc.findMatchingBracket({row: 0, column: 1}), 1, 3);
        assert.equal(doc.findMatchingBracket({row: 0, column: 0}), null);
    },

    "test: match different bracket types" : function() {
        var doc = new Document(["({[", ")]}"]);

        assert.position(doc.findMatchingBracket({row: 0, column: 1}), 1, 0);
        assert.position(doc.findMatchingBracket({row: 0, column: 2}), 1, 2);
        assert.position(doc.findMatchingBracket({row: 0, column: 3}), 1, 1);

        assert.position(doc.findMatchingBracket({row: 1, column: 1}), 0, 0);
        assert.position(doc.findMatchingBracket({row: 1, column: 2}), 0, 2);
        assert.position(doc.findMatchingBracket({row: 1, column: 3}), 0, 1);
    },

    "test: move lines down" : function() {
        var doc = new Document(["1", "2", "3", "4"]);
        
        console.log(doc.toString().replace(/\n/g, "\\n"));
        doc.moveLinesDown(0, 1);
        console.log(doc.toString().replace(/\n/g, "\\n"));
        assert.equal(doc.toString(), ["3", "1", "2", "4"].join("\n"));
        
        doc.moveLinesDown(1, 2);
        assert.equal(doc.toString(), ["3", "4", "1", "2"].join("\n"));
        
        doc.moveLinesDown(2, 3);
        assert.equal(doc.toString(), ["3", "4", "1", "2"].join("\n"));
        
        doc.moveLinesDown(2, 2);
        assert.equal(doc.toString(), ["3", "4", "2", "1"].join("\n"));
    },

    "__test: move lines up" : function() {
        var doc = new Document(["1", "2", "3", "4"]);

        console.log(doc.toString().replace(/\n/g, "\\n"));
        doc.moveLinesUp(2, 3);
        console.log(doc.toString().replace(/\n/g, "\\n"));
        assert.equal(doc.toString(), ["1", "3", "4", "2"].join("\n"));
        
        doc.moveLinesUp(1, 2);
        assert.equal(doc.toString(), ["3", "4", "1", "2"].join("\n"));
        
        doc.moveLinesUp(0, 1);
        assert.equal(doc.toString(), ["3", "4", "1", "2"].join("\n"));
        
        doc.moveLinesUp(2, 2);
        assert.equal(doc.toString(), ["3", "1", "4", "2"].join("\n"));
    },

    "test: duplicate lines" : function() {
        var doc = new Document(["1", "2", "3", "4"]);

        doc.duplicateLines(1, 2);
        assert.equal(doc.toString(), ["1", "2", "3", "2", "3", "4"].join("\n"));
    },

    "test: duplicate last line" : function() {
        var doc = new Document(["1", "2", "3"]);

        doc.duplicateLines(2, 2);
        assert.equal(doc.toString(), ["1", "2", "3", "3"].join("\n"));
    },

    "test: duplicate first line" : function() {
        var doc = new Document(["1", "2", "3"]);

        doc.duplicateLines(0, 0);
        assert.equal(doc.toString(), ["1", "1", "2", "3"].join("\n"));
    },

    "test: should handle unix style new lines" : function() {
        var doc = new Document(["1", "2", "3"]);
        
        assert.equal(doc.toString(), ["1", "2", "3"].join("\n"));
    },

    "test: should handle windows style new lines" : function() {
        var doc = new Document(["1", "2", "3"].join("\r\n"));
        
        doc.setNewLineMode("unix");
        assert.equal(doc.toString(), ["1", "2", "3"].join("\n"));
    },

    "test: set new line mode to 'windows' should use '\r\n' as new lines": function() {
        var doc = new Document(["1", "2", "3"].join("\n"));
        doc.setNewLineMode("windows");
        assert.equal(doc.toString(), ["1", "2", "3"].join("\r\n"));
    },

    "test: set new line mode to 'unix' should use '\n' as new lines": function() {
        var doc = new Document(["1", "2", "3"].join("\r\n"));
        
        doc.setNewLineMode("unix");
        assert.equal(doc.toString(), ["1", "2", "3"].join("\n"));
    },

    "test: set new line mode to 'auto' should detect the incoming nl type": function() {
        var doc = new Document(["1", "2", "3"].join("\n"));
        
        doc.setNewLineMode("auto");
        assert.equal(doc.toString(), ["1", "2", "3"].join("\n"));

        var doc = new Document(["1", "2", "3"].join("\r\n"));
        
        doc.setNewLineMode("auto");
        assert.equal(doc.toString(), ["1", "2", "3"].join("\r\n"));

        doc.replace(new Range(0, 0, 2, 1), ["4", "5", "6"].join("\n"));
        assert.equal(["4", "5", "6"].join("\n"), doc.toString());
    },

    "__test: undo/redo for delete line" : function() {
        var doc = new Document(["111", "222", "333"]);
        var undoManager = new UndoManager();
        doc.setUndoManager(undoManager);

        var initialText = doc.toString();

         
        var editor = new Editor(new MockRenderer(), doc);

        editor.removeLines();
        var step1 = doc.toString();
        assert.equal(step1, "222\n333");
        doc.$informUndoManager.call();

        editor.removeLines();
        var step2 = doc.toString();
        assert.equal(step2, "333");
        doc.$informUndoManager.call();

        editor.removeLines();
        var step3 = doc.toString();
        assert.equal(step3, "");
        doc.$informUndoManager.call();


        undoManager.undo();
        doc.$informUndoManager.call();
        assert.equal(doc.toString(), step2);

        undoManager.undo();
        doc.$informUndoManager.call();
        assert.equal(doc.toString(), step1);

        undoManager.undo();
        doc.$informUndoManager.call();
        assert.equal(doc.toString(), initialText);

        undoManager.undo();
        doc.$informUndoManager.call();
        assert.equal(doc.toString(), initialText);
    },

    "test: convert document to screen coordinates" : function() {
        var doc = new Document("01234\t567890\t1234");
        doc.setTabSize(4);

        assert.equal(doc.documentToScreenColumn(0, 0), 0);
        assert.equal(doc.documentToScreenColumn(0, 4), 4);
        assert.equal(doc.documentToScreenColumn(0, 5), 5);
        assert.equal(doc.documentToScreenColumn(0, 6), 9);
        assert.equal(doc.documentToScreenColumn(0, 12), 15);
        assert.equal(doc.documentToScreenColumn(0, 13), 19);

        doc.setTabSize(2);

        assert.equal(doc.documentToScreenColumn(0, 0), 0);
        assert.equal(doc.documentToScreenColumn(0, 4), 4);
        assert.equal(doc.documentToScreenColumn(0, 5), 5);
        assert.equal(doc.documentToScreenColumn(0, 6), 7);
        assert.equal(doc.documentToScreenColumn(0, 12), 13);
        assert.equal(doc.documentToScreenColumn(0, 13), 15);
    },

    "test: convert document to scrren coordinates with leading tabs": function() {
        var doc = new Document("\t\t123");
        doc.setTabSize(4);

        assert.equal(doc.documentToScreenColumn(0, 0), 0);
        assert.equal(doc.documentToScreenColumn(0, 1), 4);
        assert.equal(doc.documentToScreenColumn(0, 2), 8);
        assert.equal(doc.documentToScreenColumn(0, 3), 9);
    },

    "test: convert screen to document coordinates" : function() {
        var doc = new Document("01234\t567890\t1234");
        doc.setTabSize(4);

        assert.equal(doc.screenToDocumentColumn(0, 0), 0);
        assert.equal(doc.screenToDocumentColumn(0, 4), 4);
        assert.equal(doc.screenToDocumentColumn(0, 5), 5);
        assert.equal(doc.screenToDocumentColumn(0, 6), 5);
        assert.equal(doc.screenToDocumentColumn(0, 7), 5);
        assert.equal(doc.screenToDocumentColumn(0, 8), 5);
        assert.equal(doc.screenToDocumentColumn(0, 9), 6);
        assert.equal(doc.screenToDocumentColumn(0, 15), 12);
        assert.equal(doc.screenToDocumentColumn(0, 19), 13);
    }
};

module.exports = require("async/test").testcase(Test)

if (module === require.main)
    module.exports.exec()
