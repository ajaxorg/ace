/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */

require.def([
     "ace/Document",
     "ace/Range",
     "ace/mode/Html"
 ], function(
     Document,
     Range,
     HtmlMode
 ) {

var HtmlTest = new TestCase("mode.HtmlTest", {

    setUp : function() {
        this.mode = new HtmlMode();
    },

    "test: toggle comment lines should not do anything" : function() {
        var doc = new Document(["  abc", "cde", "fg"]);

        var range = new Range(0, 3, 1, 1);
        var comment = this.mode.toggleCommentLines("start", doc, range);
        assertEquals(["  abc", "cde", "fg"].join("\n"), doc.toString());
    },

    "test: next line indent should be the same as the current line indent" : function() {
        assertEquals("     ", this.mode.getNextLineIndent("start", "     abc"));
        assertEquals("", this.mode.getNextLineIndent("start", "abc"));
        assertEquals("\t", this.mode.getNextLineIndent("start", "\tabc"));
    }
});

});