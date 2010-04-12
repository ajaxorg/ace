var NavigationTest = TestCase("NavigationTest",
{
    createTextDocument : function(rows, cols) {
        var line = new Array(cols + 1).join("a");
        var text = new Array(rows).join(line + "\n") + line;
        return new ace.TextDocument(text);
    },

    "test: navigate to end of file should place the cursor on last row and column" : function() {
        var editor = new ace.Editor(this.createTextDocument(200, 10),
                new MockRenderer());

        editor.navigateFileEnd();
        assertPosition(199, 10, editor.getCursorPosition());
    },

    "test: navigate to end of file should scroll the last line into view" : function() {
        var editor = new ace.Editor(this.createTextDocument(200, 10),
                new MockRenderer());

        editor.navigateFileEnd();
        var cursor = editor.getCursorPosition();

        assertTrue(editor.getFirstVisibleRow() <= cursor.row);
        assertTrue(editor.getLastVisibleRow() >= cursor.row);
    },

    "test: navigate to start of file should place the cursor on the first row and column" : function() {
        var editor = new ace.Editor(this.createTextDocument(200, 10),
                new MockRenderer());

        editor.navigateFileStart();
        assertPosition(0, 0, editor.getCursorPosition());
    },

    "test: navigate to start of file should scroll the first row into view" : function() {
        var editor = new ace.Editor(this.createTextDocument(200, 10),
                new MockRenderer());

        editor.scrollToRow(editor.getLastVisibleRow() + 20);
        editor.navigateFileStart();

        assertEquals(0, editor.getFirstVisibleRow());
    },

    "test: move selection lead to end of file" : function() {
        var editor = new ace.Editor(this.createTextDocument(200, 10),
                new MockRenderer());

        editor.moveCursorTo(100, 5);
        editor.selectFileEnd();

        var selection = editor.getSelectionRange();

        assertPosition(100, 5, selection.start);
        assertPosition(199, 10, selection.end);
    },

    "test: move selection lead to start of file" : function() {
        var editor = new ace.Editor(this.createTextDocument(200, 10),
                new MockRenderer());

        editor.moveCursorTo(100, 5);
        editor.selectFileStart();

        var selection = editor.getSelectionRange();

        assertPosition(0, 0, selection.start);
        assertPosition(100, 5, selection.end);
    },

    "test: navigate word right" : function() {
        var doc = new ace.TextDocument( ["ab",
                " Juhu Kinners (abc, 12)", " cde"].join("\n"));
        var editor = new ace.Editor(doc, new MockRenderer());

        editor.navigateDown();
        assertPosition(1, 0, editor.getCursorPosition());

        editor.navigateWordRight();
        assertPosition(1, 1, editor.getCursorPosition());

        editor.navigateWordRight();
        assertPosition(1, 5, editor.getCursorPosition());

        editor.navigateWordRight();
        assertPosition(1, 6, editor.getCursorPosition());

        editor.navigateWordRight();
        assertPosition(1, 13, editor.getCursorPosition());

        editor.navigateWordRight();
        assertPosition(1, 15, editor.getCursorPosition());

        editor.navigateWordRight();
        assertPosition(1, 18, editor.getCursorPosition());

        editor.navigateWordRight();
        assertPosition(1, 20, editor.getCursorPosition());

        editor.navigateWordRight();
        assertPosition(1, 22, editor.getCursorPosition());

        editor.navigateWordRight();
        assertPosition(1, 23, editor.getCursorPosition());

        // wrap line
        editor.navigateWordRight();
        assertPosition(2, 0, editor.getCursorPosition());
    },

    "test: select word right if cursor in word" : function() {
        var doc = new ace.TextDocument("Juhu Kinners");
        var editor = new ace.Editor(doc, new MockRenderer());

        editor.moveCursorTo(0, 2);

        editor.navigateWordRight();
        assertPosition(0, 4, editor.getCursorPosition());
    },

    "test: navigate word left" : function() {
        var doc = new ace.TextDocument( ["ab",
                                         " Juhu Kinners (abc, 12)", " cde"].join("\n"));
        var editor = new ace.Editor(doc, new MockRenderer());

        editor.navigateDown();
        editor.navigateLineEnd();
        assertPosition(1, 23, editor.getCursorPosition());

        editor.navigateWordLeft();
        assertPosition(1, 22, editor.getCursorPosition());

        editor.navigateWordLeft();
        assertPosition(1, 20, editor.getCursorPosition());

        editor.navigateWordLeft();
        assertPosition(1, 18, editor.getCursorPosition());

        editor.navigateWordLeft();
        assertPosition(1, 15, editor.getCursorPosition());

        editor.navigateWordLeft();
        assertPosition(1, 13, editor.getCursorPosition());

        editor.navigateWordLeft();
        assertPosition(1, 6, editor.getCursorPosition());

        editor.navigateWordLeft();
        assertPosition(1, 5, editor.getCursorPosition());

        editor.navigateWordLeft();
        assertPosition(1, 1, editor.getCursorPosition());

        editor.navigateWordLeft();
        assertPosition(1, 0, editor.getCursorPosition());

        // wrap line
        editor.navigateWordLeft();
        assertPosition(0, 2, editor.getCursorPosition());
    },

    "test: select word left if cursor in word" : function() {
        var doc = new ace.TextDocument("Juhu Kinners");
        var editor = new ace.Editor(doc, new MockRenderer());

        editor.moveCursorTo(0, 8);

        editor.navigateWordLeft();
        assertPosition(0, 5, editor.getCursorPosition());
    },

    "test: select word right and select" : function() {
        var doc = new ace.TextDocument("Juhu Kinners");
        var editor = new ace.Editor(doc, new MockRenderer());

        editor.moveCursorTo(0, 0);
        editor.selectWordRight();

        var selection = editor.getSelectionRange();

        assertPosition(0, 0, selection.start);
        assertPosition(0, 4, selection.end);
    },

    "test: select word left and select" : function() {
        var doc = new ace.TextDocument("Juhu Kinners");
        var editor = new ace.Editor(doc, new MockRenderer());

        editor.moveCursorTo(0, 3);
        editor.selectWordLeft();

        var selection = editor.getSelectionRange();

        assertPosition(0, 0, selection.start);
        assertPosition(0, 3, selection.end);
    }
});
