/*
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
*/
require.def(["ace/Document", "ace/Range", "ace/Tokenizer", "ace/mode/Xml"], function(b, c, d, e) {
  new TestCase("mode.XmlTest", {setUp:function() {
    this.mode = new e
  }, "test: getTokenizer() (smoke test)":function() {
    var a = this.mode.getTokenizer();
    assertTrue(a instanceof d);
    a = a.getLineTokens("<juhu>", "start").tokens;
    assertEquals("keyword", a[1].type)
  }, "test: toggle comment lines should not do anything":function() {
    var a = new b(["  abc", "cde", "fg"]), f = new c(0, 3, 1, 1);
    this.mode.toggleCommentLines("start", a, f);
    assertEquals("  abc\ncde\nfg", a.toString())
  }, "test: next line indent should be the same as the current line indent":function() {
    assertEquals("     ", this.mode.getNextLineIndent("start", "     abc"));
    assertEquals("", this.mode.getNextLineIndent("start", "abc"));
    assertEquals("\t", this.mode.getNextLineIndent("start", "\tabc"))
  }})
});