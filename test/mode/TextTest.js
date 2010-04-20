var TextTest = new TestCase("mode.TextTest", {

    setUp : function() {
        this.mode = new ace.mode.Text();
    },

    "test: toggle comment lines should not do anything" : function() {
        var doc = new ace.Document(["  abc", "cde", "fg"].join("\n"));

        var range =  {
            start: {row: 0, column: 3},
            end: {row: 1, column: 1}
        };

        var comment = this.mode.toggleCommentLines(doc, range, "start");
        assertEquals(["  abc", "cde", "fg"].join("\n"), doc.toString());
    },


    "text: lines should not be indented" : function() {
        assertEquals("", this.mode.getNextLineIndent("   abc", "  "));
    }
});