var JavaScriptTokenizerTest = new TestCase("mode.JavaScriptTokenizerTest", {

    setUp : function() {
        this.tokenizer = new ace.mode.JavaScript().getTokenizer();
    },

    "test: tokenize1" : function() {
        var line = "foo = function";

        var tokens = this.tokenizer.getLineTokens(line, "start").tokens;

        assertEquals(5, tokens.length);
        assertEquals("identifier", tokens[0].type);
        assertEquals("text", tokens[1].type);
        assertEquals("text", tokens[2].type);
        assertEquals("text", tokens[3].type);
        assertEquals("keyword", tokens[4].type);
    }

});