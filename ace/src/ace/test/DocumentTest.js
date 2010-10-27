/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */

require.def([
     "ace/Document",
     "ace/UndoManager",
     "ace/Editor",
     "ace/test/MockRenderer"
 ], function(
     Document,
     UndoManager,
     Editor,
     MockRenderer
 ) {

var TextDocumentTest = new TestCase("TextDocumentTest", {

   "test: find matching opening bracket" : function() {
        var doc = new Document(["(()(", "())))"]);

        assertPosition(0, 1, doc.findMatchingBracket({row: 0, column: 3}));
        assertPosition(1, 0, doc.findMatchingBracket({row: 1, column: 2}));
        assertPosition(0, 3, doc.findMatchingBracket({row: 1, column: 3}));
        assertPosition(0, 0, doc.findMatchingBracket({row: 1, column: 4}));
        assertEquals(null, doc.findMatchingBracket({row: 1, column: 5}));
    },

    "test: find matching closing bracket" : function() {
        var doc = new Document(["(()(", "())))"]);

        assertPosition(1, 1, doc.findMatchingBracket({row: 1, column: 1}));
        assertPosition(1, 1, doc.findMatchingBracket({row: 1, column: 1}));
        assertPosition(1, 2, doc.findMatchingBracket({row: 0, column: 4}));
        assertPosition(0, 2, doc.findMatchingBracket({row: 0, column: 2}));
        assertPosition(1, 3, doc.findMatchingBracket({row: 0, column: 1}));
        assertEquals(null, doc.findMatchingBracket({row: 0, column: 0}));
    },

    "test: match different bracket types" : function() {
        var doc = new Document(["({[", ")]}"]);

        assertPosition(1, 0, doc.findMatchingBracket({row: 0, column: 1}));
        assertPosition(1, 2, doc.findMatchingBracket({row: 0, column: 2}));
        assertPosition(1, 1, doc.findMatchingBracket({row: 0, column: 3}));

        assertPosition(0, 0, doc.findMatchingBracket({row: 1, column: 1}));
        assertPosition(0, 2, doc.findMatchingBracket({row: 1, column: 2}));
        assertPosition(0, 1, doc.findMatchingBracket({row: 1, column: 3}));
    },

    "test: move lines down" : function() {
        var doc = new Document(["1", "2", "3", "4"]);

        doc.moveLinesDown(0, 1);
        assertEquals(["3", "1", "2", "4"].join("\n"), doc.toString());

        doc.moveLinesDown(1, 2);
        assertEquals(["3", "4", "1", "2"].join("\n"), doc.toString());

        doc.moveLinesDown(2, 3);
        assertEquals(["3", "4", "1", "2"].join("\n"), doc.toString());

        doc.moveLinesDown(2, 2);
        assertEquals(["3", "4", "2", "1"].join("\n"), doc.toString());
    },

    "test: move lines up" : function() {
        var doc = new Document(["1", "2", "3", "4"]);

        doc.moveLinesUp(2, 3);
        assertEquals(["1", "3", "4", "2"].join("\n"), doc.toString());

        doc.moveLinesUp(1, 2);
        assertEquals(["3", "4", "1", "2"].join("\n"), doc.toString());

        doc.moveLinesUp(0, 1);
        assertEquals(["3", "4", "1", "2"].join("\n"), doc.toString());

        doc.moveLinesUp(2, 2);
        assertEquals(["3", "1", "4", "2"].join("\n"), doc.toString());
    },

    "test: duplicate lines" : function() {
        var doc = new Document(["1", "2", "3", "4"]);

        doc.duplicateLines(1, 2);
        assertEquals(["1", "2", "3", "2", "3", "4"].join("\n"), doc.toString());
    },

    "test: duplicate last line" : function() {
        var doc = new Document(["1", "2", "3"]);

        doc.duplicateLines(2, 2);
        assertEquals(["1", "2", "3", "3"].join("\n"), doc.toString());
    },

    "test: duplicate first line" : function() {
        var doc = new Document(["1", "2", "3"]);

        doc.duplicateLines(0, 0);
        assertEquals(["1", "1", "2", "3"].join("\n"), doc.toString());
    },

    "test: should handle unix style new lines" : function() {
        var doc = new Document(["1", "2", "3"]);
        assertEquals(["1", "2", "3"].join("\n"), doc.toString());
    },

    "test: should handle windows style new lines" : function() {
        var doc = new Document(["1", "2", "3"].join("\r\n"));
        doc.setNewLineMode("unix");
        assertEquals(["1", "2", "3"].join("\n"), doc.toString());
    },

    "test: set new line mode to 'windows' should use '\r\n' as new lines": function() {
        var doc = new Document(["1", "2", "3"].join("\n"));
        doc.setNewLineMode("windows");
        assertEquals(["1", "2", "3"].join("\r\n"), doc.toString());
    },

    "test: set new line mode to 'unix' should use '\n' as new lines": function() {
        var doc = new Document(["1", "2", "3"].join("\r\n"));
        doc.setNewLineMode("unix");
        assertEquals(["1", "2", "3"].join("\n"), doc.toString());
    },

    "test: set new line mode to 'auto' should use detect the incoming nl type": function() {
        var doc = new Document(["1", "2", "3"].join("\n"));
        doc.setNewLineMode("auto");
        assertEquals(["1", "2", "3"].join("\n"), doc.toString());

        var doc = new Document(["1", "2", "3"].join("\r\n"));
        doc.setNewLineMode("auto");
        assertEquals(["1", "2", "3"].join("\r\n"), doc.toString());

        doc.replace(new Range(0, 0, 2, 1), ["4", "5", "6"].join("\n"));
        assertEquals(["4", "5", "6"].join("\n"), doc.toString());
    },

    "test: undo/redo for delete line" : function() {
        var doc = new Document(["111", "222", "333"]);
        var undoManager = new UndoManager();
        doc.setUndoManager(undoManager);

        var initialText = doc.toString();

        var editor = new Editor(new MockRenderer(), doc);

        editor.removeLines();
        var step1 = doc.toString();
        assertEquals("222\n333", step1);
        doc.$informUndoManager.call();

        editor.removeLines();
        var step2 = doc.toString();
        assertEquals("333", step2);
        doc.$informUndoManager.call();

        editor.removeLines();
        var step3 = doc.toString();
        assertEquals("", step3);
        doc.$informUndoManager.call();


        undoManager.undo();
        doc.$informUndoManager.call();
        assertEquals(step2, doc.toString());

        undoManager.undo();
        doc.$informUndoManager.call();
        assertEquals(step1, doc.toString());

        undoManager.undo();
        doc.$informUndoManager.call();
        assertEquals(initialText, doc.toString());

        undoManager.undo();
        doc.$informUndoManager.call();
        assertEquals(initialText, doc.toString());
    },

    "test: convert document to screen coordinates" : function() {
        var doc = new Document("01234\t567890\t1234");
        doc.setTabSize(4);

        assertEquals(0, doc.documentToScreenColumn(0, 0));
        assertEquals(4, doc.documentToScreenColumn(0, 4));
        assertEquals(5, doc.documentToScreenColumn(0, 5));
        assertEquals(9, doc.documentToScreenColumn(0, 6));
        assertEquals(15, doc.documentToScreenColumn(0, 12));
        assertEquals(19, doc.documentToScreenColumn(0, 13));

        doc.setTabSize(2);

        assertEquals(0, doc.documentToScreenColumn(0, 0));
        assertEquals(4, doc.documentToScreenColumn(0, 4));
        assertEquals(5, doc.documentToScreenColumn(0, 5));
        assertEquals(7, doc.documentToScreenColumn(0, 6));
        assertEquals(13, doc.documentToScreenColumn(0, 12));
        assertEquals(15, doc.documentToScreenColumn(0, 13));
    },

    "test: convert document to scrren coordinates with leading tabs": function() {
        var doc = new Document("\t\t123");
        doc.setTabSize(4);

        assertEquals(0, doc.documentToScreenColumn(0, 0));
        assertEquals(4, doc.documentToScreenColumn(0, 1));
        assertEquals(8, doc.documentToScreenColumn(0, 2));
        assertEquals(9, doc.documentToScreenColumn(0, 3));
    },

    "test: convert screen to document coordinates" : function() {
        var doc = new Document("01234\t567890\t1234");
        doc.setTabSize(4);

        assertEquals(0, doc.screenToDocumentColumn(0, 0));
        assertEquals(4, doc.screenToDocumentColumn(0, 4));
        assertEquals(5, doc.screenToDocumentColumn(0, 5));
        assertEquals(5, doc.screenToDocumentColumn(0, 6));
        assertEquals(5, doc.screenToDocumentColumn(0, 7));
        assertEquals(5, doc.screenToDocumentColumn(0, 8));
        assertEquals(6, doc.screenToDocumentColumn(0, 9));
        assertEquals(12, doc.screenToDocumentColumn(0, 15));
        assertEquals(13, doc.screenToDocumentColumn(0, 19));
    }
});

});