/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */

require.def([
     "ace/mode/Xml"
 ], function(
     XmlMode
 ) {

var XmlTest = new TestCase("mode.XmlTest", {

    setUp : function() {
        this.tokenizer = new XmlMode().getTokenizer();
    },

    "test: tokenize1" : function() {

        var line = "<Juhu>//Juhu Kinners</Kinners>";
        var tokens = this.tokenizer.getLineTokens(line, "start").tokens;

        assertEquals(5, tokens.length);
        assertEquals("text", tokens[0].type);
        assertEquals("keyword", tokens[1].type);
        assertEquals("text", tokens[2].type);
        assertEquals("keyword", tokens[3].type);
        assertEquals("text", tokens[4].type);
    }
});

});