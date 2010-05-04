var CssTest = new TestCase("mode.CssTest", {

    setUp : function() {
        this.mode = new ace.mode.Css();
    },

    "test: toggle comment lines should not do anything" : function() {
        var doc = new ace.Document(["  abc", "cde", "fg"].join("\n"));

        var range = new ace.Range(0, 3, 1, 1);
        var comment = this.mode.toggleCommentLines("start", doc, range);
        assertEquals(["  abc", "cde", "fg"].join("\n"), doc.toString());
    },


    "test: lines should keep indentation" : function() {
        assertEquals("   ", this.mode.getNextLineIndent("start", "   abc", "  "));
        assertEquals("\t", this.mode.getNextLineIndent("start", "\tabc", "  "));
    },

    "test: new line after { should increase indent" : function() {
        assertEquals("     ", this.mode.getNextLineIndent("start", "   abc{", "  "));
        assertEquals("\t  ", this.mode.getNextLineIndent("start", "\tabc  { ", "  "));
    },

    "test: no indent increase after { in a comment" : function() {
        assertEquals("   ", this.mode.getNextLineIndent("start", "   /*{", "  "));
        assertEquals("   ", this.mode.getNextLineIndent("start", "   /*{  ", "  "));
    }
});