var CssTest = new TestCase("mode.CssTest", {

    setUp : function() {
        this.tokenizer = new ace.mode.Css().getTokenizer();
    },

    "test: tokenize pixel number" : function() {
        var line = "-12px";
        var tokens = this.tokenizer.getLineTokens(line, "start").tokens;

        assertEquals(1, tokens.length);
        assertEquals("number", tokens[0].type);
    },

    "test: tokenize hex3 color" : function() {
        var tokens = this.tokenizer.getLineTokens("#abc", "start").tokens;

        assertEquals(1, tokens.length);
        assertEquals("number", tokens[0].type);
    },

    "test: tokenize hex6 color" : function() {
        var tokens = this.tokenizer.getLineTokens("#abc012", "start").tokens;

        assertEquals(1, tokens.length);
        assertEquals("number", tokens[0].type);
    }
});