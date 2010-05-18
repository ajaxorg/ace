var HtmlTest = new TestCase("mode.HtmlTest", {

    setUp : function() {
        this.mode = new ace.mode.Html();
    },

    "test: toggle comment lines should not do anything" : function() {
        var doc = new ace.Document(["  abc", "cde", "fg"]);

        var range = new ace.Range(0, 3, 1, 1);
        var comment = this.mode.toggleCommentLines("start", doc, range);
        assertEquals(["  abc", "cde", "fg"].join("\n"), doc.toString());
    },

    "test: next line indent should be the same as the current line indent" : function() {
        assertEquals("     ", this.mode.getNextLineIndent("start", "     abc"));
        assertEquals("", this.mode.getNextLineIndent("start", "abc"));
        assertEquals("\t", this.mode.getNextLineIndent("start", "\tabc"));
    }
});