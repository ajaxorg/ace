/*
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
*/
require.def(["ace/Document", "ace/Range", "ace/mode/Html"], function(b, c, d) {
  new TestCase("mode.HtmlTest", {setUp:function() {
    this.mode = new d
  }, "test: toggle comment lines should not do anything":function() {
    var a = new b(["  abc", "cde", "fg"]), e = new c(0, 3, 1, 1);
    this.mode.toggleCommentLines("start", a, e);
    assertEquals("  abc\ncde\nfg", a.toString())
  }, "test: next line indent should be the same as the current line indent":function() {
    assertEquals("     ", this.mode.getNextLineIndent("start", "     abc"));
    assertEquals("", this.mode.getNextLineIndent("start", "abc"));
    assertEquals("\t", this.mode.getNextLineIndent("start", "\tabc"))
  }})
});