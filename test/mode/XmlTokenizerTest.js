var XmlTest = new TestCase("mode.XmlTest", {

    setUp : function() {
        this.tokenizer = new ace.mode.Xml().getTokenizer();
    },

    "test: tokenize1" : function() {

        var line = "<Juhu>//Juhu Kinners</Kinners>";
        var tokens = this.tokenizer.getLineTokens(line, "start").tokens;

        assertEquals(7, tokens.length);
        assertEquals("text", tokens[0].type);
        assertEquals("keyword", tokens[1].type);
        assertEquals("text", tokens[2].type);
        assertEquals("text", tokens[3].type);
        assertEquals("text", tokens[4].type);
        assertEquals("keyword", tokens[5].type);
        assertEquals("text", tokens[6].type);
    }
});