var TextEditTest = TestCase("TextEditTest",
{
    "test: delete line from the middle" : function() {
        var doc = new ace.TextDocument(["a", "b", "c", "d"].join("\n"));
        var editor = new ace.Editor(doc, new MockRenderer());

        editor.moveCursorTo(1, 1);
        editor.removeLine();

        assertEquals("a\nc\nd", doc.toString());
        assertPosition(1, 0, editor.getCursorPosition());
    },

    "test: delete first line" : function() {
        var doc = new ace.TextDocument(["a", "b", "c"].join("\n"));
        var editor = new ace.Editor(doc, new MockRenderer());

        editor.removeLine();

        assertEquals("b\nc", doc.toString());
        assertPosition(0, 0, editor.getCursorPosition());
    },

    "test: delete last" : function() {
        var doc = new ace.TextDocument(["a", "b", "c"].join("\n"));
        var editor = new ace.Editor(doc, new MockRenderer());

        editor.moveCursorTo(2, 1);
        editor.removeLine();

        assertEquals("a\nb", doc.toString());
        assertPosition(1, 0, editor.getCursorPosition());
    }
});