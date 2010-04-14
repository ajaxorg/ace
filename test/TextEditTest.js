var TextEditTest = TestCase("TextEditTest",
{
    "test: delete line from the middle" : function() {
        var doc = new ace.TextDocument(["a", "b", "c", "d"].join("\n"));
        var editor = new ace.Editor(new MockRenderer(), doc);

        editor.moveCursorTo(1, 1);
        editor.removeLine();

        assertEquals("a\nc\nd", doc.toString());
        assertPosition(1, 0, editor.getCursorPosition());
    },

    "test: delete first line" : function() {
        var doc = new ace.TextDocument(["a", "b", "c"].join("\n"));
        var editor = new ace.Editor(new MockRenderer(), doc);

        editor.removeLine();

        assertEquals("b\nc", doc.toString());
        assertPosition(0, 0, editor.getCursorPosition());
    },

    "test: delete last" : function() {
        var doc = new ace.TextDocument(["a", "b", "c"].join("\n"));
        var editor = new ace.Editor(new MockRenderer(), doc);

        editor.moveCursorTo(2, 1);
        editor.removeLine();

        assertEquals("a\nb", doc.toString());
        assertPosition(1, 0, editor.getCursorPosition());
    },

    "test: indent block" : function() {
        var doc = new ace.TextDocument(["a12345", "b12345", "c12345"].join("\n"));
        var editor = new ace.Editor(new MockRenderer(), doc);

        editor.moveCursorTo(1, 3);
        editor.selectDown();

        editor.blockIndent("    ");

        assertEquals(["a12345", "    b12345", "    c12345"].join("\n"),
                     doc.toString());

        var selection = editor.getSelectionRange();
        assertPosition(1, 7, selection.start);
        assertPosition(2, 7, selection.end);
    },

    "test: outdent block" : function() {
        var doc = new ace.TextDocument(["    a12345", "  b12345", "    c12345"].join("\n"));
        var editor = new ace.Editor(new MockRenderer(), doc);

        editor.moveCursorTo(0, 3);
        editor.selectDown();
        editor.selectDown();

        editor.blockOutdent("  ");
        assertEquals(["  a12345", "b12345", "  c12345"].join("\n"),
                     doc.toString());

        var selection = editor.getSelectionRange();
        assertPosition(0, 1, selection.start);
        assertPosition(2, 1, selection.end);


        editor.blockOutdent("  ");
        assertEquals(["  a12345", "b12345", "  c12345"].join("\n"),
                doc.toString());

        var selection = editor.getSelectionRange();
        assertPosition(0, 1, selection.start);
        assertPosition(2, 1, selection.end);
    },

    "test: comment lines should perserve selection" : function() {
        var doc = new ace.TextDocument(["  abc", "cde"].join("\n"));
        var editor = new ace.Editor(new MockRenderer(), doc, new ace.mode.JavaScript());

        editor.moveCursorTo(0, 2);
        editor.selectDown();

        editor.toggleCommentLines();

        assertEquals(["//  abc", "//cde"].join("\n"), doc.toString());

        var selection = editor.getSelectionRange();
        assertPosition(0, 4, selection.start);
        assertPosition(1, 4, selection.end);
    },

    "test: uncomment lines should perserve selection" : function() {
        var doc = new ace.TextDocument(["//  abc", "//cde"].join("\n"));
        var editor = new ace.Editor(new MockRenderer(), doc, new ace.mode.JavaScript());

        editor.moveCursorTo(0, 1);
        editor.selectDown();
        editor.selectRight();
        editor.selectRight();

        editor.toggleCommentLines();

        assertEquals(["  abc", "cde"].join("\n"), doc.toString());

        var selection = editor.getSelectionRange();
        assertPosition(0, 0, selection.start);
        assertPosition(1, 1, selection.end);
    },

    "test: move lines down should select moved lines" : function() {
        var doc = new ace.TextDocument(["11", "22", "33", "44"].join("\n"));
        var editor = new ace.Editor(new MockRenderer(), doc);

        editor.moveCursorTo(0, 1);
        editor.selectDown();

        editor.moveLinesDown();
        assertEquals(["33", "11", "22", "44"].join("\n"), doc.toString());
        assertPosition(1, 0, editor.getCursorPosition());
        assertPosition(3, 0, editor.getSelectionAnchor());
        assertPosition(1, 0, editor.getSelectionLead());

        editor.moveLinesDown();
        assertEquals(["33", "44", "11", "22"].join("\n"), doc.toString());
        assertPosition(2, 0, editor.getCursorPosition());
        assertPosition(3, 2, editor.getSelectionAnchor());
        assertPosition(2, 0, editor.getSelectionLead());

        // moving again should have no effect
        editor.moveLinesDown();
        assertEquals(["33", "44", "11", "22"].join("\n"), doc.toString());
        assertPosition(2, 0, editor.getCursorPosition());
        assertPosition(3, 2, editor.getSelectionAnchor());
        assertPosition(2, 0, editor.getSelectionLead());
    },

    "test: move lines up should select moved lines" : function() {
        var doc = new ace.TextDocument(["11", "22", "33", "44"].join("\n"));
        var editor = new ace.Editor(new MockRenderer(), doc);

        editor.moveCursorTo(2, 1);
        editor.selectDown();

        editor.moveLinesUp();
        assertEquals(["11", "33", "44", "22"].join("\n"), doc.toString());
        assertPosition(1, 0, editor.getCursorPosition());
        assertPosition(3, 0, editor.getSelectionAnchor());
        assertPosition(1, 0, editor.getSelectionLead());

        editor.moveLinesUp();
        assertEquals(["33", "44", "11", "22"].join("\n"), doc.toString());
        assertPosition(0, 0, editor.getCursorPosition());
        assertPosition(2, 0, editor.getSelectionAnchor());
        assertPosition(0, 0, editor.getSelectionLead());
    },

    "test: move line without active selection should move cursor to start of the moved line" : function()
    {
        var doc = new ace.TextDocument(["11", "22", "33", "44"].join("\n"));
        var editor = new ace.Editor(new MockRenderer(), doc);

        editor.moveCursorTo(1, 1);
        editor.clearSelection();

        editor.moveLinesDown();
        assertEquals(["11", "33", "22", "44"].join("\n"), doc.toString());
        assertPosition(2, 0, editor.getCursorPosition());

        editor.clearSelection();

        editor.moveLinesUp();
        assertEquals(["11", "22", "33", "44"].join("\n"), doc.toString());
        assertPosition(1, 0, editor.getCursorPosition());
    }
});