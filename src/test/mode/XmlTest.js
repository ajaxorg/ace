var XmlTest = new TestCase("mode.XmlTest", {

    setUp : function() {
        this.mode = new ace.mode.Xml();
    },

    "test: getTokenizer() (smoke test)" : function() {
        var tokenizer = this.mode.getTokenizer();

        assertTrue(tokenizer instanceof ace.Tokenizer);

        var tokens = tokenizer.getLineTokens("<juhu>", "start").tokens;
        assertEquals("keyword", tokens[1].type);
    },

    "test: toggle comment lines should not do anything" : function() {
        var doc = new ace.Document(["  abc", "cde", "fg"].join("\n"));

        var range =  {
            start: {row: 0, column: 3},
            end: {row: 1, column: 1}
        };

        var comment = this.mode.toggleCommentLines(doc, range, "start");
        assertEquals(["  abc", "cde", "fg"].join("\n"), doc.toString());
    }
});