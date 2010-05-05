var TextTest = new TestCase("mode.TextTest", {

    setUp : function() {
        this.mode = new ace.mode.Text();
    },

    "test: toggle comment lines should not do anything" : function() {
        var doc = new ace.Document(["  abc", "cde", "fg"]);

        var range = new ace.Range(0, 3, 1, 1);
        var comment = this.mode.toggleCommentLines("start", doc, range);
        assertEquals(["  abc", "cde", "fg"].join("\n"), doc.toString());
    },


    "text: lines should not be indented" : function() {
        assertEquals("", this.mode.getNextLineIndent("start", "   abc", "  "));
    }
});