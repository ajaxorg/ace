var JavaScriptTest = new TestCase("mode.JavaScriptTest", {

    setUp : function() {
        this.mode = new ace.mode.JavaScript();
    },

    "test: getTokenizer() (smoke test)" : function() {
        var tokenizer = this.mode.getTokenizer();

        assertTrue(tokenizer instanceof ace.Tokenizer);

        var tokens = tokenizer.getLineTokens("'juhu'", "start").tokens;
        assertEquals("string", tokens[0].type);
    },

    "test: toggle comment lines should prepend '//' to each line" : function() {
        var doc = new ace.TextDocument(["  abc", "cde", "fg"].join("\n"));

        var range =  {
            start: {row: 0, column: 3},
            end: {row: 1, column: 1}
        };

        var comment = this.mode.toggleCommentLines(doc, range);
        assertEquals(["//  abc", "//cde", "fg"].join("\n"), doc.toString());
    },

    "test: toggle comment on commented lines should remove leading '//' chars" : function() {
        var doc = new ace.TextDocument(["//  abc", "//cde", "fg"].join("\n"));

        var range =  {
            start: {row: 0, column: 3},
            end: {row: 1, column: 1}
        };

        var comment = this.mode.toggleCommentLines(doc, range);
        assertEquals(["  abc", "cde", "fg"].join("\n"), doc.toString());
    },

    "test: toggle comment on multiple lines with one commented line prepend '//' to each line" : function() {
        var doc = new ace.TextDocument(["//  abc", "//cde", "fg"].join("\n"));

        var range =  {
            start: {row: 0, column: 3},
            end: {row: 2, column: 1}
        };

        var comment = this.mode.toggleCommentLines(doc, range);
        assertEquals(["////  abc", "////cde", "//fg"].join("\n"), doc.toString());
    },

    "test: auto indent after opening brace" : function() {
        var doc = new ace.TextDocument(["if () {"].join("\n"));
        var editor = new ace.Editor(new MockRenderer(), doc, this.mode);

        editor.navigateLineEnd();
        editor.onTextInput("\n");

        assertEquals(["if () {", doc.getTabString()].join("\n"), doc.toString());
    },

    "test: no auto indent after opening brace in multi line comment" : function() {
        var doc = new ace.TextDocument(["/*if () {"].join("\n"));
        var editor = new ace.Editor(new MockRenderer(), doc, this.mode);

        editor.navigateLineEnd();
        editor.onTextInput("\n");

        assertEquals(["/*if () {", ""].join("\n"), doc.toString());
    },

    "test: no auto indent should add to existing indent" : function() {
        var doc = new ace.TextDocument(["    if () {"].join("\n"));
        var editor = new ace.Editor(new MockRenderer(), doc, this.mode);

        editor.navigateLineEnd();
        editor.onTextInput("\n");

        assertEquals(["    if () {", "    " + doc.getTabString()].join("\n"), doc.toString());
    }
});