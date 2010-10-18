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
     "ace/Tokenizer",
     "ace/mode/Xml"
 ], function(
     Document,
     Range,
     Tokenizer,
     XmlMode
 ) {

var XmlTest = new TestCase("mode.XmlTest", {

    setUp : function() {
        this.mode = new XmlMode();
    },

    "test: getTokenizer() (smoke test)" : function() {
        var tokenizer = this.mode.getTokenizer();

        assertTrue(tokenizer instanceof Tokenizer);

        var tokens = tokenizer.getLineTokens("<juhu>", "start").tokens;
        assertEquals("keyword", tokens[1].type);
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