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
    }
});