var NavigationTest = TestCase("NavigationTest", {
    
    createTextDocument : function(rows, cols) {
        var line = new Array(cols+1).join("a");
        var text = new Array(rows).join(line + "\n") + line;
        return new ace.TextDocument(text);
    },

    "test: navigate to end of file should place the cursor on last row and column" : function() {
        var editor = new ace.Editor(this.createTextDocument(200, 10),
                new MockRenderer());

        editor.navigateFileEnd();
        
        var cursor = editor.getCursorPosition();
        assertEquals(199, cursor.row);
        assertEquals(10, cursor.column);
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
        
        var cursor = editor.getCursorPosition();
        assertEquals(0, cursor.row);
        assertEquals(0, cursor.column);
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
        
        assertEquals(100, selection.start.row);        
        assertEquals(5, selection.start.column); 
        
        assertEquals(199, selection.end.row);        
        assertEquals(10, selection.end.column);        
    },
    
    "test: move selection lead to start of file" : function() {
        var editor = new ace.Editor(this.createTextDocument(200, 10),
                                    new MockRenderer());
        
        editor.moveCursorTo(100, 5);
        editor.selectFileStart();
        
        var selection = editor.getSelectionRange();
                
        assertEquals(0, selection.start.row);        
        assertEquals(0, selection.start.column);        

        assertEquals(100, selection.end.row);        
        assertEquals(5, selection.end.column); 
    }    
});
