/*
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
*/
require.def(["ace/mode/Xml"], function(b) {
  new TestCase("mode.XmlTest", {setUp:function() {
    this.tokenizer = (new b).getTokenizer()
  }, "test: tokenize1":function() {
    var a = this.tokenizer.getLineTokens("<Juhu>//Juhu Kinners</Kinners>", "start").tokens;
    assertEquals(5, a.length);
    assertEquals("text", a[0].type);
    assertEquals("keyword", a[1].type);
    assertEquals("text", a[2].type);
    assertEquals("keyword", a[3].type);
    assertEquals("text", a[4].type)
  }})
});