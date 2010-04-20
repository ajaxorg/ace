var CssTest = new TestCase("mode.CssTest", {

    setUp : function() {
        this.mode = new ace.mode.Css();
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


    "test: lines should keep indentation" : function() {
        assertEquals("   ", this.mode.getNextLineIndent("   abc", "start", "  "));
        assertEquals("\t", this.mode.getNextLineIndent("\tabc", "start", "  "));
    },

    "test: new line after { should increase indent" : function() {
        assertEquals("     ", this.mode.getNextLineIndent("   abc{", "start", "  "));
        assertEquals("\t  ", this.mode.getNextLineIndent("\tabc  { ", "start", "  "));
    },

    "test: no indent increase after { in a comment" : function() {
        assertEquals("   ", this.mode.getNextLineIndent("   /*{", "start", "  "));
    }
});