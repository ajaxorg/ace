/*
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
*/
require.def(["ace/mode/Html"], function(b) {
  new TestCase("mode.HtmlTest", {setUp:function() {
    this.tokenizer = (new b).getTokenizer()
  }, "test: tokenize embedded script":function() {
    var a = this.tokenizer.getLineTokens("<script a='a'>var<\/script>'123'", "start").tokens;
    assertEquals("text", a[0].type);
    assertEquals("keyword", a[1].type);
    assertEquals("text", a[2].type);
    assertEquals("keyword", a[3].type);
    assertEquals("text", a[4].type);
    assertEquals("string", a[5].type);
    assertEquals("text", a[6].type);
    assertEquals("keyword", a[7].type);
    assertEquals("text", a[8].type);
    assertEquals("keyword", a[9].type);
    assertEquals("text", a[10].type)
  }})
});