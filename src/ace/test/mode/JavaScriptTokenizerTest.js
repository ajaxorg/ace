/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */

require.def([
     "ace/mode/JavaScript"
 ], function(
     JavaScriptMode
 ) {

var JavaScriptTokenizerTest = new TestCase("mode.JavaScriptTokenizerTest", {

    setUp : function() {
        this.tokenizer = new JavaScriptMode().getTokenizer();
    },

    "test: tokenize1" : function() {
        var line = "foo = function";

        var tokens = this.tokenizer.getLineTokens(line, "start").tokens;

        assertEquals(3, tokens.length);
        assertEquals("identifier", tokens[0].type);
        assertEquals("text", tokens[1].type);
        assertEquals("keyword", tokens[2].type);
    },

    "test: tokenize doc comment" : function() {
        var line = "abc /** de */ fg";

        var tokens = this.tokenizer.getLineTokens(line, "start").tokens;

        assertEquals(5, tokens.length);
        assertEquals("identifier", tokens[0].type);
        assertEquals("text", tokens[1].type);
        assertEquals("doc-comment", tokens[2].type);
        assertEquals("text", tokens[3].type);
        assertEquals("identifier", tokens[4].type);
    },

    "test: tokenize doc comment with tag" : function() {
        var line = "/** @param {} */";

        var tokens = this.tokenizer.getLineTokens(line, "start").tokens;

        assertEquals(3, tokens.length);
        assertEquals("doc-comment", tokens[0].type);
        assertEquals("doc-comment-tag", tokens[1].type);
        assertEquals("doc-comment", tokens[2].type);
    },

    "test: tokenize parens" : function() {
        var line = "[{( )}]";

        var tokens = this.tokenizer.getLineTokens(line, "start").tokens;

        assertEquals(3, tokens.length);
        assertEquals("lparen", tokens[0].type);
        assertEquals("text", tokens[1].type);
        assertEquals("rparen", tokens[2].type);
    }
});

});