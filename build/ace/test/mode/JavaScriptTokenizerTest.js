/*
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
*/
require.def(["ace/mode/JavaScript"], function(b) {
  new TestCase("mode.JavaScriptTokenizerTest", {setUp:function() {
    this.tokenizer = (new b).getTokenizer()
  }, "test: tokenize1":function() {
    var a = this.tokenizer.getLineTokens("foo = function", "start").tokens;
    assertEquals(3, a.length);
    assertEquals("identifier", a[0].type);
    assertEquals("text", a[1].type);
    assertEquals("keyword", a[2].type)
  }, "test: tokenize doc comment":function() {
    var a = this.tokenizer.getLineTokens("abc /** de */ fg", "start").tokens;
    assertEquals(5, a.length);
    assertEquals("identifier", a[0].type);
    assertEquals("text", a[1].type);
    assertEquals("doc-comment", a[2].type);
    assertEquals("text", a[3].type);
    assertEquals("identifier", a[4].type)
  }, "test: tokenize doc comment with tag":function() {
    var a = this.tokenizer.getLineTokens("/** @param {} */", "start").tokens;
    assertEquals(3, a.length);
    assertEquals("doc-comment", a[0].type);
    assertEquals("doc-comment-tag", a[1].type);
    assertEquals("doc-comment", a[2].type)
  }, "test: tokenize parens":function() {
    var a = this.tokenizer.getLineTokens("[{( )}]", "start").tokens;
    assertEquals(3, a.length);
    assertEquals("lparen", a[0].type);
    assertEquals("text", a[1].type);
    assertEquals("rparen", a[2].type)
  }})
});