/*
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
*/
require.def(["ace/Document", "ace/Range", "ace/mode/Css"], function(b, c, d) {
  new TestCase("mode.CssTest", {setUp:function() {
    this.mode = new d
  }, "test: toggle comment lines should not do anything":function() {
    var a = new b("  abc\ncde\nfg"), e = new c(0, 3, 1, 1);
    this.mode.toggleCommentLines("start", a, e);
    assertEquals("  abc\ncde\nfg", a.toString())
  }, "test: lines should keep indentation":function() {
    assertEquals("   ", this.mode.getNextLineIndent("start", "   abc", "  "));
    assertEquals("\t", this.mode.getNextLineIndent("start", "\tabc", "  "))
  }, "test: new line after { should increase indent":function() {
    assertEquals("     ", this.mode.getNextLineIndent("start", "   abc{", "  "));
    assertEquals("\t  ", this.mode.getNextLineIndent("start", "\tabc  { ", "  "))
  }, "test: no indent increase after { in a comment":function() {
    assertEquals("   ", this.mode.getNextLineIndent("start", "   /*{", "  "));
    assertEquals("   ", this.mode.getNextLineIndent("start", "   /*{  ", "  "))
  }})
});