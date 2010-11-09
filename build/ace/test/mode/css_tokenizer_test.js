/*
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
*/
require.def(["ace/mode/Css"], function(b) {
  new TestCase("mode.CssTest", {setUp:function() {
    this.tokenizer = (new b).getTokenizer()
  }, "test: tokenize pixel number":function() {
    var a = this.tokenizer.getLineTokens("-12px", "start").tokens;
    assertEquals(1, a.length);
    assertEquals("number", a[0].type)
  }, "test: tokenize hex3 color":function() {
    var a = this.tokenizer.getLineTokens("#abc", "start").tokens;
    assertEquals(1, a.length);
    assertEquals("number", a[0].type)
  }, "test: tokenize hex6 color":function() {
    var a = this.tokenizer.getLineTokens("#abc012", "start").tokens;
    assertEquals(1, a.length);
    assertEquals("number", a[0].type)
  }, "test: tokenize parens":function() {
    var a = this.tokenizer.getLineTokens("{()}", "start").tokens;
    assertEquals(3, a.length);
    assertEquals("lparen", a[0].type);
    assertEquals("text", a[1].type);
    assertEquals("rparen", a[2].type)
  }})
});