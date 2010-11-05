/*
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
*/
require.def(["ace/Document", "ace/Range", "ace/mode/Text"], function(b, c, d) {
  new TestCase("mode.TextTest", {setUp:function() {
    this.mode = new d
  }, "test: toggle comment lines should not do anything":function() {
    var a = new b(["  abc", "cde", "fg"]), e = new c(0, 3, 1, 1);
    this.mode.toggleCommentLines("start", a, e);
    assertEquals("  abc\ncde\nfg", a.toString())
  }, "text: lines should not be indented":function() {
    assertEquals("", this.mode.getNextLineIndent("start", "   abc", "  "))
  }})
});