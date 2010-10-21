/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */

require.def([
     "ace/mode/Html"
 ], function(
     HtmlMode
 ) {

var HtmlTest = new TestCase("mode.HtmlTest", {

    setUp : function() {
        this.tokenizer = new HtmlMode().getTokenizer();
    },

    "test: tokenize embedded script" : function() {

        var line = "<script a='a'>var</script>'123'";
        var tokens = this.tokenizer.getLineTokens(line, "start").tokens;

        //assertEquals(10, tokens.length);
        assertEquals("text", tokens[0].type);
        assertEquals("keyword", tokens[1].type);
        assertEquals("text", tokens[2].type);
        assertEquals("keyword", tokens[3].type);
        assertEquals("text", tokens[4].type);
        assertEquals("string", tokens[5].type);
        assertEquals("text", tokens[6].type);
        assertEquals("keyword", tokens[7].type);
        assertEquals("text", tokens[8].type);
        assertEquals("keyword", tokens[9].type);
        assertEquals("text", tokens[10].type);
    }
});

});