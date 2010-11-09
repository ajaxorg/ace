/*
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
*/
require.def(["ace/Document", "ace/Range", "ace/Tokenizer", "ace/mode/JavaScript"], function(c, d, e, f) {
  new TestCase("mode.JavaScriptTest", {setUp:function() {
    this.mode = new f
  }, "test: getTokenizer() (smoke test)":function() {
    var a = this.mode.getTokenizer();
    assertTrue(a instanceof e);
    a = a.getLineTokens("'juhu'", "start").tokens;
    assertEquals("string", a[0].type)
  }, "test: toggle comment lines should prepend '//' to each line":function() {
    var a = new c(["  abc", "cde", "fg"]), b = new d(0, 3, 1, 1);
    this.mode.toggleCommentLines("start", a, b);
    assertEquals("//  abc\n//cde\nfg", a.toString())
  }, "test: toggle comment on commented lines should remove leading '//' chars":function() {
    var a = new c(["//  abc", "//cde", "fg"]), b = new d(0, 3, 1, 1);
    this.mode.toggleCommentLines("start", a, b);
    assertEquals("  abc\ncde\nfg", a.toString())
  }, "test: toggle comment on multiple lines with one commented line prepend '//' to each line":function() {
    var a = new c(["//  abc", "//cde", "fg"]), b = new d(0, 3, 2, 1);
    this.mode.toggleCommentLines("start", a, b);
    assertEquals("////  abc\n////cde\n//fg", a.toString())
  }, "test: toggle comment on a comment line with leading white space":function() {
    var a = new c(["//cde", "  //fg"]), b = new d(0, 3, 1, 1);
    this.mode.toggleCommentLines("start", a, b);
    assertEquals("cde\n  fg", a.toString())
  }, "test: auto indent after opening brace":function() {
    assertEquals("  ", this.mode.getNextLineIndent("start", "if () {", "  "))
  }, "test: no auto indent after opening brace in multi line comment":function() {
    assertEquals("", this.mode.getNextLineIndent("start", "/*if () {", "  "));
    assertEquals("  ", this.mode.getNextLineIndent("comment", "  abcd", "  "))
  }, "test: no auto indent after opening brace in single line comment":function() {
    assertEquals("", this.mode.getNextLineIndent("start", "//if () {", "  "));
    assertEquals("  ", this.mode.getNextLineIndent("start", "  //if () {", "  "))
  }, "test: no auto indent should add to existing indent":function() {
    assertEquals("      ", this.mode.getNextLineIndent("start", "    if () {", "  "));
    assertEquals("    ", this.mode.getNextLineIndent("start", "    cde", "  "))
  }, "test: special indent in doc comments":function() {
    assertEquals(" * ", this.mode.getNextLineIndent("doc-start", "/**", " "));
    assertEquals("   * ", this.mode.getNextLineIndent("doc-start", "  /**", " "));
    assertEquals(" * ", this.mode.getNextLineIndent("doc-start", " *", " "));
    assertEquals("    * ", this.mode.getNextLineIndent("doc-start", "    *", " "));
    assertEquals("  ", this.mode.getNextLineIndent("doc-start", "  abc", " "))
  }, "test: no indent after doc comments":function() {
    assertEquals("", this.mode.getNextLineIndent("doc-start", "   */", "  "))
  }, "test: trigger outdent if line is space and new text starts with closing brace":function() {
    assertTrue(this.mode.checkOutdent("start", "   ", " }"));
    assertFalse(this.mode.checkOutdent("start", " a  ", " }"));
    assertFalse(this.mode.checkOutdent("start", "", "}"));
    assertFalse(this.mode.checkOutdent("start", "   ", "a }"));
    assertFalse(this.mode.checkOutdent("start", "   }", "}"))
  }, "test: auto outdent should indent the line with the same indent as the line with the matching opening brace":function() {
    var a = new c(["  function foo() {", "    bla", "    }"]);
    this.mode.autoOutdent("start", a, 2);
    assertEquals("  }", a.getLine(2))
  }, "test: no auto outdent if no matching brace is found":function() {
    var a = new c(["  function foo()", "    bla", "    }"]);
    this.mode.autoOutdent("start", a, 2);
    assertEquals("    }", a.getLine(2))
  }})
});