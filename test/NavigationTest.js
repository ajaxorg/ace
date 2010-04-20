var NavigationTest = TestCase("NavigationTest",
{
    createTextDocument : function(rows, cols) {
        var line = new Array(cols + 1).join("a");
        var text = new Array(rows).join(line + "\n") + line;
        return new ace.TextDocument(text);
    },

    "test: navigate to end of file should scroll the last line into view" : function() {
        var doc = this.createTextDocument(200, 10);
        var editor = new ace.Editor(new MockRenderer(), doc);

        editor.navigateFileEnd();
        var cursor = editor.getSelection().getCursor();

        assertTrue(editor.getFirstVisibleRow() <= cursor.row);
        assertTrue(editor.getLastVisibleRow() >= cursor.row);
    },

    "test: navigate to start of file should scroll the first row into view" : function() {
        var doc = this.createTextDocument(200, 10);
        var editor = new ace.Editor(new MockRenderer(), doc);

        editor.scrollToRow(editor.getLastVisibleRow() + 20);
        editor.navigateFileStart();

        assertEquals(0, editor.getFirstVisibleRow());
    },

    "test: goto hidden line should scroll the line into the middle of the viewport" : function() {
        var editor = new ace.Editor(new MockRenderer(), this.createTextDocument(200, 5));

        editor.navigateTo(0, 0);
        editor.gotoLine(101);
        assertPosition(100, 0, editor.getSelection().getCursor());
        assertEquals(90, editor.getFirstVisibleRow());

        editor.navigateTo(100, 0);
        editor.gotoLine(11);
        assertPosition(10, 0, editor.getSelection().getCursor());
        assertEquals(0, editor.getFirstVisibleRow());

        editor.navigateTo(100, 0);
        editor.gotoLine(6);
        assertPosition(5, 0, editor.getSelection().getCursor());
        assertEquals(0, editor.getFirstVisibleRow());

        editor.navigateTo(100, 0);
        editor.gotoLine(1);
        assertPosition(0, 0, editor.getSelection().getCursor());
        assertEquals(0, editor.getFirstVisibleRow());

        editor.navigateTo(0, 0);
        editor.gotoLine(191);
        assertPosition(190, 0, editor.getSelection().getCursor());
        assertEquals(180, editor.getFirstVisibleRow());

        editor.navigateTo(0, 0);
        editor.gotoLine(196);
        assertPosition(195, 0, editor.getSelection().getCursor());
        assertEquals(180, editor.getFirstVisibleRow());
    },

    "test: goto visible line should only move the cursor and not scroll": function() {
        var editor = new ace.Editor(new MockRenderer(), this.createTextDocument(200, 5));

        editor.navigateTo(0, 0);
        editor.gotoLine(12);
        assertPosition(11, 0, editor.getSelection().getCursor());
        assertEquals(0, editor.getFirstVisibleRow());

        editor.navigateTo(30, 0);
        editor.gotoLine(33);
        assertPosition(32, 0, editor.getSelection().getCursor());
        assertEquals(30, editor.getFirstVisibleRow());
    }
});