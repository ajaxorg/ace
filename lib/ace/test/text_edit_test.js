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

define(function(require, exports, module) {
require("./mockdom");

var Document        = require("../document").Document,
    Editor          = require("../editor").Editor,
    JavaScriptMode  = require("../mode/javascript").Mode,
    UndoManager     = require("../undomanager").UndoManager,
    MockRenderer    = require("./mockrenderer"),
    assert          = require("./assertions");

var Test = {
    "test: delete line from the middle" : function() {
        var doc = new Document(["a", "b", "c", "d"].join("\n"));
        var editor = new Editor(new MockRenderer(), doc);

        editor.moveCursorTo(1, 1);
        editor.removeLines();

        assert.equal(doc.toString(), "a\nc\nd");
        assert.position(editor.getCursorPosition(), 1, 0);

        editor.removeLines();

        assert.equal(doc.toString(), "a\nd");
        assert.position(editor.getCursorPosition(), 1, 0);

        editor.removeLines();

        assert.equal(doc.toString(), "a\n");
        assert.position(editor.getCursorPosition(), 1, 0);

        editor.removeLines();

        assert.equal(doc.toString(), "a\n");
        assert.position(editor.getCursorPosition(), 1, 0);
    },

    "test: delete multiple selected lines" : function() {
        var doc = new Document(["a", "b", "c", "d"].join("\n"));
        var editor = new Editor(new MockRenderer(), doc);

        editor.moveCursorTo(1, 1);
        editor.getSelection().selectDown();

        editor.removeLines();
        assert.equal(doc.toString(), "a\nd");
        assert.position(editor.getCursorPosition(), 1, 0);
    },

    "test: delete first line" : function() {
        var doc = new Document(["a", "b", "c"].join("\n"));
        var editor = new Editor(new MockRenderer(), doc);

        editor.removeLines();

        assert.equal(doc.toString(), "b\nc");
        assert.position(editor.getCursorPosition(), 0, 0);
    },

    "test: delete last" : function() {
        var doc = new Document(["a", "b", "c"].join("\n"));
        var editor = new Editor(new MockRenderer(), doc);

        editor.moveCursorTo(2, 1);
        editor.removeLines();

        assert.equal(doc.toString(), "a\nb\n");
        assert.position(editor.getCursorPosition(), 2, 0);
    },

    "test: indent block" : function() {
        var doc = new Document(["a12345", "b12345", "c12345"].join("\n"));
        var editor = new Editor(new MockRenderer(), doc);

        editor.moveCursorTo(1, 3);
        editor.getSelection().selectDown();

        editor.indent();

        assert.equal(["a12345", "    b12345", "    c12345"].join("\n"), doc.toString());

        assert.position(editor.getCursorPosition(), 2, 7);

        var range = editor.getSelectionRange();
        assert.position(range.start, 1, 7);
        assert.position(range.end, 2, 7);
    },

    "test: indent selected lines" : function() {
	    var doc = new Document(["a12345", "b12345", "c12345"].join("\n"));
	    var editor = new Editor(new MockRenderer(), doc);
	
	    editor.moveCursorTo(1, 0);
	    editor.getSelection().selectDown();
	
	    editor.indent();
	    assert.equal(["a12345", "    b12345", "c12345"].join("\n"), doc.toString());
	},
    
    "test: no auto indent if cursor is before the {" : function() {
        var doc = new Document("{", new JavaScriptMode());
        var editor = new Editor(new MockRenderer(), doc);
        
        editor.moveCursorTo(0, 0);        
        editor.onTextInput("\n");
        assert.equal(["", "{"].join("\n"), doc.toString());
    },
	
    "test: outdent block" : function() {
        var doc = new Document(["        a12345", "    b12345", "        c12345"].join("\n"));
        var editor = new Editor(new MockRenderer(), doc);

        editor.moveCursorTo(0, 5);
        editor.getSelection().selectDown();
        editor.getSelection().selectDown();        

        editor.blockOutdent();
        assert.equal(doc.toString(), ["    a12345", "b12345", "    c12345"].join("\n"));

        assert.position(editor.getCursorPosition(), 2, 1);

        var range = editor.getSelectionRange();
        assert.position(range.start, 0, 1);
        assert.position(range.end, 2, 1);

        editor.blockOutdent();
        assert.equal(doc.toString(), ["a12345", "b12345", "c12345"].join("\n"));

        var range = editor.getSelectionRange();
        assert.position(range.start, 0, 0);
        assert.position(range.end, 2, 0);
    },

    "test: outent without a selection should update cursor" : function() {
        var doc = new Document("        12");
        var editor = new Editor(new MockRenderer(), doc);

        editor.moveCursorTo(0, 3);
        editor.blockOutdent("  ");

        assert.equal(doc.toString(), "    12");
        assert.position(editor.getCursorPosition(), 0, 0);
    },

    "test: comment lines should perserve selection" : function() {
        var doc = new Document(["  abc", "cde"].join("\n"), new JavaScriptMode());
        var editor = new Editor(new MockRenderer(), doc);

        editor.moveCursorTo(0, 2);
        editor.getSelection().selectDown();
        editor.toggleCommentLines();

        assert.equal(["//  abc", "//cde"].join("\n"), doc.toString());

        var selection = editor.getSelectionRange();
        assert.position(selection.start, 0, 4);
        assert.position(selection.end, 1, 4);
    },

    "test: uncomment lines should perserve selection" : function() {
        var doc = new Document(["//  abc", "//cde"].join("\n"), new JavaScriptMode());
        var editor = new Editor(new MockRenderer(), doc);

        editor.moveCursorTo(0, 1);
        editor.getSelection().selectDown();
        editor.getSelection().selectRight();
        editor.getSelection().selectRight();

        editor.toggleCommentLines();

        assert.equal(["  abc", "cde"].join("\n"), doc.toString());
        assert.range(editor.getSelectionRange(), 0, 0, 1, 1);
    },
    
    "test: toggle comment lines twice should return the original text" : function() {
        var doc = new Document(["  abc", "cde", "fg"], new JavaScriptMode());
        var editor = new Editor(new MockRenderer(), doc);
    
        editor.moveCursorTo(0, 0);
        editor.getSelection().selectDown();
        editor.getSelection().selectDown();
        
        editor.toggleCommentLines();
        editor.toggleCommentLines();
        
        assert.equal(["  abc", "cde", "fg"].join("\n"), doc.toString());
    },
    

    "test: comment lines - if the selection end is at the line start it should stay there": function() {
        //select down
        var doc = new Document(["abc", "cde"].join("\n"), new JavaScriptMode());
        var editor = new Editor(new MockRenderer(), doc);

        editor.moveCursorTo(0, 0);
        editor.getSelection().selectDown();

        editor.toggleCommentLines();
        assert.range(editor.getSelectionRange(), 0, 2, 1, 0);

        // select up
        var doc = new Document(["abc", "cde"].join("\n"), new JavaScriptMode());
        var editor = new Editor(new MockRenderer(), doc);

        editor.moveCursorTo(1, 0);
        editor.getSelection().selectUp();

        editor.toggleCommentLines();
        assert.range(editor.getSelectionRange(), 0, 2, 1, 0);
    },

    "test: move lines down should select moved lines" : function() {
        var doc = new Document(["11", "22", "33", "44"].join("\n"));
        var editor = new Editor(new MockRenderer(), doc);

        editor.moveCursorTo(0, 1);
        editor.getSelection().selectDown();

        editor.moveLinesDown();
        assert.equal(["33", "11", "22", "44"].join("\n"), doc.toString());
        assert.position(editor.getCursorPosition(), 1, 0);
        assert.position(editor.getSelection().getSelectionAnchor(), 3, 0);
        assert.position(editor.getSelection().getSelectionLead(), 1, 0);

        editor.moveLinesDown();
        assert.equal(["33", "44", "11", "22"].join("\n"), doc.toString());
        assert.position(editor.getCursorPosition(), 2, 0);
        assert.position(editor.getSelection().getSelectionAnchor(), 3, 2);
        assert.position(editor.getSelection().getSelectionLead(), 2, 0);

        // moving again should have no effect
        editor.moveLinesDown();
        assert.equal(["33", "44", "11", "22"].join("\n"), doc.toString());
        assert.position(editor.getCursorPosition(), 2, 0);
        assert.position(editor.getSelection().getSelectionAnchor(), 3, 2);
        assert.position(editor.getSelection().getSelectionLead(), 2, 0);
    },

    "test: move lines up should select moved lines" : function() {
        var doc = new Document(["11", "22", "33", "44"].join("\n"));
        var editor = new Editor(new MockRenderer(), doc);

        editor.moveCursorTo(2, 1);
        editor.getSelection().selectDown();

        editor.moveLinesUp();
        assert.equal(doc.toString(), ["11", "33", "44", "22"].join("\n"));
        assert.position(editor.getCursorPosition(), 1, 0);
        assert.position(editor.getSelection().getSelectionAnchor(), 3, 0);
        assert.position(editor.getSelection().getSelectionLead(), 1, 0);

        editor.moveLinesUp();
        assert.equal(doc.toString(), ["33", "44", "11", "22"].join("\n"));
        assert.position(editor.getCursorPosition(), 0, 0);
        assert.position(editor.getSelection().getSelectionAnchor(), 2, 0);
        assert.position(editor.getSelection().getSelectionLead(), 0, 0);
    },

    "test: move line without active selection should move cursor to start of the moved line" : function()
    {
        var doc = new Document(["11", "22", "33", "44"].join("\n"));
        var editor = new Editor(new MockRenderer(), doc);

        editor.moveCursorTo(1, 1);
        editor.clearSelection();

        editor.moveLinesDown();
        assert.equal(["11", "33", "22", "44"].join("\n"), doc.toString());
        assert.position(editor.getCursorPosition(), 2, 0);

        editor.clearSelection();

        editor.moveLinesUp();
        assert.equal(["11", "22", "33", "44"].join("\n"), doc.toString());
        assert.position(editor.getCursorPosition(), 1, 0);
    },

    "test: copy lines down should select lines and place cursor at the selection start" : function() {
        var doc = new Document(["11", "22", "33", "44"].join("\n"));
        var editor = new Editor(new MockRenderer(), doc);

        editor.moveCursorTo(1, 1);
        editor.getSelection().selectDown();

        editor.copyLinesDown();
        assert.equal(["11", "22", "33", "22", "33", "44"].join("\n"), doc.toString());

        assert.position(editor.getCursorPosition(), 3, 0);
        assert.position(editor.getSelection().getSelectionAnchor(), 5, 0);
        assert.position(editor.getSelection().getSelectionLead(), 3, 0);
    },

    "test: copy lines up should select lines and place cursor at the selection start" : function() {
        var doc = new Document(["11", "22", "33", "44"].join("\n"));
        var editor = new Editor(new MockRenderer(), doc);

        editor.moveCursorTo(1, 1);
        editor.getSelection().selectDown();

        editor.copyLinesUp();
        assert.equal(["11", "22", "33", "22", "33", "44"].join("\n"), doc.toString());

        assert.position(editor.getCursorPosition(), 1, 0);
        assert.position(editor.getSelection().getSelectionAnchor(), 3, 0);
        assert.position(editor.getSelection().getSelectionLead(), 1, 0);
    },

    "test: input a tab with soft tab should convert it to spaces" : function() {
        var doc = new Document("");
        var editor = new Editor(new MockRenderer(), doc);

        doc.setTabSize(2);
        doc.setUseSoftTabs(true);

        editor.onTextInput("\t");
        assert.equal(doc.toString(), "  ");

        doc.setTabSize(5);
        editor.onTextInput("\t");
        assert.equal(doc.toString(), "       ");
    },

    "test: input tab without soft tabs should keep the tab character" : function() {
        var doc = new Document("");
        var editor = new Editor(new MockRenderer(), doc);

        doc.setUseSoftTabs(false);

        editor.onTextInput("\t");
        assert.equal(doc.toString(), "\t");
    },
    
    "test: undo/redo for delete line" : function() {
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
    
    "test: remove left should remove character left of the cursor" : function() {
        var doc = new Document(["123", "456"]);
        
        var editor = new Editor(new MockRenderer(), doc);
        editor.moveCursorTo(1, 1);
        editor.removeLeft();
        assert.equal(doc.toString(), "123\n56");
    },
    
    "test: remove left should remove line break if cursor is at line start" : function() {
        var doc = new Document(["123", "456"]);
        
        var editor = new Editor(new MockRenderer(), doc);
        editor.moveCursorTo(1, 0);
        editor.removeLeft();
        assert.equal(doc.toString(), "123456");
    },
    
    "test: remove left should remove tabsize spaces if cursor is on a tab stop and preceeded by spaces" : function() {
        var doc = new Document(["123", "        456"]);
        doc.setUseSoftTabs(true);
        doc.setTabSize(4);
    
        var editor = new Editor(new MockRenderer(), doc);
        editor.moveCursorTo(1, 8);
        editor.removeLeft();
        assert.equal(doc.toString(), "123\n    456");
    },

};

module.exports = require("async/test").testcase(Test);
});

if (module === require.main) {
    require("../../../support/paths");
    exports.exec()
}
