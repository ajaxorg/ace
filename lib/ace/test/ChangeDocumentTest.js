/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */

require.def([
     "ace/Document",
     "ace/Editor",
     "ace/mode/Text",
     "ace/mode/JavaScript",
     "ace/test/MockRenderer"
 ], function(
     Document,
     Editor,
     TextMode,
     JavaScriptMode,
     MockRenderer
 ) {

var ChangeDocumentTest = new TestCase("ChangeDocumentTest", {
    setUp : function() {
        this.doc1 = new Document(["abc", "def"].join("\n"));
        this.doc2 = new Document(["ghi", "jkl"].join("\n"));
        this.editor = new Editor(new MockRenderer());
    },

    "test: change document" : function() {
        this.editor.setDocument(this.doc1);
        assertEquals(this.doc1, this.editor.getDocument());

        this.editor.setDocument(this.doc2);
        assertEquals(this.doc2, this.editor.getDocument());
    },

    "test: only changes to the new document should have effect" : function() {
        var called = false;
        this.editor.onDocumentChange = function() {
            called = true;
        };

        this.editor.setDocument(this.doc1);
        this.editor.setDocument(this.doc2);

        this.doc1.duplicateLines(0, 0);
        assertFalse(called);

        this.doc2.duplicateLines(0, 0);
        assertTrue(called);
    },

    "test: should use cursor of new document" : function() {
        this.doc1.getSelection().moveCursorTo(0, 1);
        this.doc2.getSelection().moveCursorTo(1, 0);

        this.editor.setDocument(this.doc1);
        assertPosition(0, 1, this.editor.getCursorPosition());

        this.editor.setDocument(this.doc2);
        assertPosition(1, 0, this.editor.getCursorPosition());
    },

    "test: only changing the cursor of the new doc should not have an effect" : function() {
        this.editor.onCursorChange = function() {
            called = true;
        };

        this.editor.setDocument(this.doc1);
        this.editor.setDocument(this.doc2);
        assertPosition(0, 0, this.editor.getCursorPosition());

        var called = false;
        this.doc1.getSelection().moveCursorTo(0, 1);
        assertPosition(0, 0, this.editor.getCursorPosition());
        assertFalse(called);

        this.doc2.getSelection().moveCursorTo(1, 1);
        assertPosition(1, 1, this.editor.getCursorPosition());
        assertTrue(called);
    },

    "test: should use selection of new document" : function() {
        this.doc1.getSelection().selectTo(0, 1);
        this.doc2.getSelection().selectTo(1, 0);

        this.editor.setDocument(this.doc1);
        assertPosition(0, 1, this.editor.getSelection().getSelectionLead());

        this.editor.setDocument(this.doc2);
        assertPosition(1, 0, this.editor.getSelection().getSelectionLead());
    },

    "test: only changing the selection of the new doc should not have an effect" : function() {
        this.editor.onSelectionChange = function() {
            called = true;
        };

        this.editor.setDocument(this.doc1);
        this.editor.setDocument(this.doc2);
        assertPosition(0, 0, this.editor.getSelection().getSelectionLead());

        var called = false;
        this.doc1.getSelection().selectTo(0, 1);
        assertPosition(0, 0, this.editor.getSelection().getSelectionLead());
        assertFalse(called);

        this.doc2.getSelection().selectTo(1, 1);
        assertPosition(1, 1, this.editor.getSelection().getSelectionLead());
        assertTrue(called);
    },

    "test: should use mode of new document" : function() {
        this.editor.onDocumentModeChange = function() {
            called = true;
        };
        this.editor.setDocument(this.doc1);
        this.editor.setDocument(this.doc2);

        var called = false;
        this.doc1.setMode(new Text());
        assertFalse(called);

        this.doc2.setMode(new JavaScriptMode());
        assertTrue(called);
    }
});

});