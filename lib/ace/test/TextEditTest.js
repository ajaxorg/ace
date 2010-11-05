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
     "ace/mode/JavaScript",
     "ace/test/MockRenderer"
 ], function(
     Document,
     Editor,
     JavaScriptMode,
     MockRenderer
 ) {

var TextEditTest = TestCase("TextEditTest",
{
    "test: delete line from the middle" : function() {
        var doc = new Document(["a", "b", "c", "d"].join("\n"));
        var editor = new Editor(new MockRenderer(), doc);

        editor.moveCursorTo(1, 1);
        editor.removeLines();

        assertEquals("a\nc\nd", doc.toString());
        assertPosition(1, 0, editor.getCursorPosition());

        editor.removeLines();

        assertEquals("a\nd", doc.toString());
        assertPosition(1, 0, editor.getCursorPosition());

        editor.removeLines();

        assertEquals("a\n", doc.toString());
        assertPosition(1, 0, editor.getCursorPosition());

        editor.removeLines();

        assertEquals("a\n", doc.toString());
        assertPosition(1, 0, editor.getCursorPosition());
    },

    "test: delete multiple selected lines" : function() {
        var doc = new Document(["a", "b", "c", "d"].join("\n"));
        var editor = new Editor(new MockRenderer(), doc);

        editor.moveCursorTo(1, 1);
        editor.getSelection().selectDown();

        editor.removeLines();
        assertEquals("a\nd", doc.toString());
        assertPosition(1, 0, editor.getCursorPosition());
    },

    "test: delete first line" : function() {
        var doc = new Document(["a", "b", "c"].join("\n"));
        var editor = new Editor(new MockRenderer(), doc);

        editor.removeLines();

        assertEquals("b\nc", doc.toString());
        assertPosition(0, 0, editor.getCursorPosition());
    },

    "test: delete last" : function() {
        var doc = new Document(["a", "b", "c"].join("\n"));
        var editor = new Editor(new MockRenderer(), doc);

        editor.moveCursorTo(2, 1);
        editor.removeLines();

        assertEquals("a\nb\n", doc.toString());
        assertPosition(2, 0, editor.getCursorPosition());
    },

    "test: indent block" : function() {
        var doc = new Document(["a12345", "b12345", "c12345"].join("\n"));
        var editor = new Editor(new MockRenderer(), doc);

        editor.moveCursorTo(1, 3);
        editor.getSelection().selectDown();

        editor.blockIndent("    ");

        assertEquals(["a12345", "    b12345", "    c12345"].join("\n"),
                     doc.toString());

        assertPosition(2, 7, editor.getCursorPosition());

        var range = editor.getSelectionRange();
        assertPosition(1, 7, range.start);
        assertPosition(2, 7, range.end);
    },

    "test: outdent block" : function() {
        var doc = new Document(["    a12345", "  b12345", "    c12345"].join("\n"));
        var editor = new Editor(new MockRenderer(), doc);

        editor.moveCursorTo(0, 3);
        editor.getSelection().selectDown();
        editor.getSelection().selectDown();

        editor.blockOutdent("  ");
        assertEquals(["  a12345", "b12345", "  c12345"].join("\n"),
                     doc.toString());

        assertPosition(2, 1, editor.getCursorPosition());

        var range = editor.getSelectionRange();
        assertPosition(0, 1, range.start);
        assertPosition(2, 1, range.end);


        editor.blockOutdent("  ");
        assertEquals(["  a12345", "b12345", "  c12345"].join("\n"),
                doc.toString());

        var range = editor.getSelectionRange();
        assertPosition(0, 1, range.start);
        assertPosition(2, 1, range.end);
    },

    "test: outent without a selection should update cursor" : function() {
        var doc = new Document("        12");
        var editor = new Editor(new MockRenderer(), doc);

        editor.moveCursorTo(0, 3);
        editor.blockOutdent("  ");

        assertEquals("      12", doc.toString());
        assertPosition(0, 1, editor.getCursorPosition());
    },

    "test: comment lines should perserve selection" : function() {
        var doc = new Document(["  abc", "cde"].join("\n"), new JavaScriptMode());
        var editor = new Editor(new MockRenderer(), doc);

        editor.moveCursorTo(0, 2);
        editor.getSelection().selectDown();

        editor.toggleCommentLines();

        assertEquals(["//  abc", "//cde"].join("\n"), doc.toString());

        var selection = editor.getSelectionRange();
        assertPosition(0, 4, selection.start);
        assertPosition(1, 4, selection.end);
    },

    "test: uncomment lines should perserve selection" : function() {
        var doc = new Document(["//  abc", "//cde"].join("\n"), new JavaScriptMode());
        var editor = new Editor(new MockRenderer(), doc);

        editor.moveCursorTo(0, 1);
        editor.getSelection().selectDown();
        editor.getSelection().selectRight();
        editor.getSelection().selectRight();

        editor.toggleCommentLines();

        assertEquals(["  abc", "cde"].join("\n"), doc.toString());
        assertRange(0, 0, 1, 1, editor.getSelectionRange());
    },

    "test: comment lines - if the selection end is at the line start it should stay there": function() {
        //select down
        var doc = new Document(["abc", "cde"].join("\n"), new JavaScriptMode());
        var editor = new Editor(new MockRenderer(), doc);

        editor.moveCursorTo(0, 0);
        editor.getSelection().selectDown();

        editor.toggleCommentLines();
        assertRange(0, 2, 1, 0, editor.getSelectionRange());

        // select up
        var doc = new Document(["abc", "cde"].join("\n"), new JavaScriptMode());
        var editor = new Editor(new MockRenderer(), doc);

        editor.moveCursorTo(1, 0);
        editor.getSelection().selectUp();

        editor.toggleCommentLines();
        assertRange(0, 2, 1, 0, editor.getSelectionRange());
    },

    "test: move lines down should select moved lines" : function() {
        var doc = new Document(["11", "22", "33", "44"].join("\n"));
        var editor = new Editor(new MockRenderer(), doc);

        editor.moveCursorTo(0, 1);
        editor.getSelection().selectDown();

        editor.moveLinesDown();
        assertEquals(["33", "11", "22", "44"].join("\n"), doc.toString());
        assertPosition(1, 0, editor.getCursorPosition());
        assertPosition(3, 0, editor.getSelection().getSelectionAnchor());
        assertPosition(1, 0, editor.getSelection().getSelectionLead());

        editor.moveLinesDown();
        assertEquals(["33", "44", "11", "22"].join("\n"), doc.toString());
        assertPosition(2, 0, editor.getCursorPosition());
        assertPosition(3, 2, editor.getSelection().getSelectionAnchor());
        assertPosition(2, 0, editor.getSelection().getSelectionLead());

        // moving again should have no effect
        editor.moveLinesDown();
        assertEquals(["33", "44", "11", "22"].join("\n"), doc.toString());
        assertPosition(2, 0, editor.getCursorPosition());
        assertPosition(3, 2, editor.getSelection().getSelectionAnchor());
        assertPosition(2, 0, editor.getSelection().getSelectionLead());
    },

    "test: move lines up should select moved lines" : function() {
        var doc = new Document(["11", "22", "33", "44"].join("\n"));
        var editor = new Editor(new MockRenderer(), doc);

        editor.moveCursorTo(2, 1);
        editor.getSelection().selectDown();

        editor.moveLinesUp();
        assertEquals(["11", "33", "44", "22"].join("\n"), doc.toString());
        assertPosition(1, 0, editor.getCursorPosition());
        assertPosition(3, 0, editor.getSelection().getSelectionAnchor());
        assertPosition(1, 0, editor.getSelection().getSelectionLead());

        editor.moveLinesUp();
        assertEquals(["33", "44", "11", "22"].join("\n"), doc.toString());
        assertPosition(0, 0, editor.getCursorPosition());
        assertPosition(2, 0, editor.getSelection().getSelectionAnchor());
        assertPosition(0, 0, editor.getSelection().getSelectionLead());
    },

    "test: move line without active selection should move cursor to start of the moved line" : function()
    {
        var doc = new Document(["11", "22", "33", "44"].join("\n"));
        var editor = new Editor(new MockRenderer(), doc);

        editor.moveCursorTo(1, 1);
        editor.clearSelection();

        editor.moveLinesDown();
        assertEquals(["11", "33", "22", "44"].join("\n"), doc.toString());
        assertPosition(2, 0, editor.getCursorPosition());

        editor.clearSelection();

        editor.moveLinesUp();
        assertEquals(["11", "22", "33", "44"].join("\n"), doc.toString());
        assertPosition(1, 0, editor.getCursorPosition());
    },

    "test: copy lines down should select lines and place cursor at the selection start" : function() {
        var doc = new Document(["11", "22", "33", "44"].join("\n"));
        var editor = new Editor(new MockRenderer(), doc);

        editor.moveCursorTo(1, 1);
        editor.getSelection().selectDown();

        editor.copyLinesDown();
        assertEquals(["11", "22", "33", "22", "33", "44"].join("\n"), doc.toString());

        assertPosition(3, 0, editor.getCursorPosition());
        assertPosition(5, 0, editor.getSelection().getSelectionAnchor());
        assertPosition(3, 0, editor.getSelection().getSelectionLead());
    },

    "test: copy lines up should select lines and place cursor at the selection start" : function() {
        var doc = new Document(["11", "22", "33", "44"].join("\n"));
        var editor = new Editor(new MockRenderer(), doc);

        editor.moveCursorTo(1, 1);
        editor.getSelection().selectDown();

        editor.copyLinesUp();
        assertEquals(["11", "22", "33", "22", "33", "44"].join("\n"), doc.toString());

        assertPosition(1, 0, editor.getCursorPosition());
        assertPosition(3, 0, editor.getSelection().getSelectionAnchor());
        assertPosition(1, 0, editor.getSelection().getSelectionLead());
    },

    "test: input a tab with soft tab should convert it to spaces" : function() {
        var doc = new Document("");
        var editor = new Editor(new MockRenderer(), doc);

        doc.setTabSize(2);
        doc.setUseSoftTabs(true);

        editor.onTextInput("\t");
        assertEquals("  ", doc.toString());

        doc.setTabSize(5);
        editor.onTextInput("\t");
        assertEquals("       ", doc.toString());
    },

    "test: input tab without soft tabs should keep the tab character" : function() {
        var doc = new Document("");
        var editor = new Editor(new MockRenderer(), doc);

        doc.setUseSoftTabs(false);

        editor.onTextInput("\t");
        assertEquals("\t", doc.toString());
    }
});

});