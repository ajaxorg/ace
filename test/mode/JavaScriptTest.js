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
        var doc = new ace.Document(["  abc", "cde", "fg"].join("\n"));

        var range =  {
            start: {row: 0, column: 3},
            end: {row: 1, column: 1}
        };

        var comment = this.mode.toggleCommentLines(doc, range, "start");
        assertEquals(["//  abc", "//cde", "fg"].join("\n"), doc.toString());
    },

    "test: toggle comment on commented lines should remove leading '//' chars" : function() {
        var doc = new ace.Document(["//  abc", "//cde", "fg"].join("\n"));

        var range =  {
            start: {row: 0, column: 3},
            end: {row: 1, column: 1}
        };

        var comment = this.mode.toggleCommentLines(doc, range, "start");
        assertEquals(["  abc", "cde", "fg"].join("\n"), doc.toString());
    },

    "test: toggle comment on multiple lines with one commented line prepend '//' to each line" : function() {
        var doc = new ace.Document(["//  abc", "//cde", "fg"].join("\n"));

        var range =  {
            start: {row: 0, column: 3},
            end: {row: 2, column: 1}
        };

        var comment = this.mode.toggleCommentLines(doc, range, "start");
        assertEquals(["////  abc", "////cde", "//fg"].join("\n"), doc.toString());
    },

    "test: auto indent after opening brace" : function() {
        assertEquals("  ", this.mode.getNextLineIndent("if () {", "start", "  "));
    },

    "test: no auto indent after opening brace in multi line comment" : function() {
        assertEquals("", this.mode.getNextLineIndent("/*if () {", "  "));
    },

    "test: no auto indent should add to existing indent" : function() {
        assertEquals("      ", this.mode.getNextLineIndent("    if () {", "start", "  "));
        assertEquals("    ", this.mode.getNextLineIndent("    cde", "start", "  "));
    },

    "test: special indent in doc comments" : function() {
        assertEquals(" * ", this.mode.getNextLineIndent("/**", "doc-comment", " "));
        assertEquals("   * ", this.mode.getNextLineIndent("  /**", "doc-comment", " "));
        assertEquals(" * ", this.mode.getNextLineIndent(" *", "doc-comment", " "));
        assertEquals("    * ", this.mode.getNextLineIndent("    *", "doc-comment", " "));
        assertEquals("  ", this.mode.getNextLineIndent("  abc", "doc-comment", " "));
    }
});