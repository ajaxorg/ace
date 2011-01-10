define(function(d, e, f) {
  var c = d("ace/document").Document, g = d("ace/tokenizer").Tokenizer, h = d("ace/mode/javascript").Mode, a = d("../assertions");
  e = {setUp:function() {
    this.mode = new h
  }, "test: getTokenizer() (smoke test)":function() {
    var b = this.mode.getTokenizer();
    a.ok(b instanceof g);
    b = b.getLineTokens("'juhu'", "start").tokens;
    a.equal("string", b[0].type)
  }, "test: toggle comment lines should prepend '//' to each line":function() {
    var b = new c(["  abc", "cde", "fg"]);
    this.mode.toggleCommentLines("start", b, 0, 1);
    a.equal("//  abc\n//cde\nfg", b.toString())
  }, "test: toggle comment on commented lines should remove leading '//' chars":function() {
    var b = new c(["//  abc", "//cde", "fg"]);
    this.mode.toggleCommentLines("start", b, 0, 1);
    a.equal("  abc\ncde\nfg", b.toString())
  }, "test: toggle comment lines twice should return the original text":function() {
    var b = new c(["  abc", "cde", "fg"]);
    this.mode.toggleCommentLines("start", b, 0, 2);
    this.mode.toggleCommentLines("start", b, 0, 2);
    a.equal("  abc\ncde\nfg", b.toString())
  }, "test: toggle comment on multiple lines with one commented line prepend '//' to each line":function() {
    var b = new c(["//  abc", "//cde", "fg"]);
    this.mode.toggleCommentLines("start", b, 0, 2);
    a.equal("////  abc\n////cde\n//fg", b.toString())
  }, "test: toggle comment on a comment line with leading white space":function() {
    var b = new c(["//cde", "  //fg"]);
    this.mode.toggleCommentLines("start", b, 0, 1);
    a.equal("cde\n  fg", b.toString())
  }, "test: auto indent after opening brace":function() {
    a.equal("  ", this.mode.getNextLineIndent("start", "if () {", "  "))
  }, "test: no auto indent after opening brace in multi line comment":function() {
    a.equal("", this.mode.getNextLineIndent("start", "/*if () {", "  "));
    a.equal("  ", this.mode.getNextLineIndent("comment", "  abcd", "  "))
  }, "test: no auto indent after opening brace in single line comment":function() {
    a.equal("", this.mode.getNextLineIndent("start", "//if () {", "  "));
    a.equal("  ", this.mode.getNextLineIndent("start", "  //if () {", "  "))
  }, "test: no auto indent should add to existing indent":function() {
    a.equal("      ", this.mode.getNextLineIndent("start", "    if () {", "  "));
    a.equal("    ", this.mode.getNextLineIndent("start", "    cde", "  "))
  }, "test: special indent in doc comments":function() {
    a.equal(" * ", this.mode.getNextLineIndent("doc-start", "/**", " "));
    a.equal("   * ", this.mode.getNextLineIndent("doc-start", "  /**", " "));
    a.equal(" * ", this.mode.getNextLineIndent("doc-start", " *", " "));
    a.equal("    * ", this.mode.getNextLineIndent("doc-start", "    *", " "));
    a.equal("  ", this.mode.getNextLineIndent("doc-start", "  abc", " "))
  }, "test: no indent after doc comments":function() {
    a.equal("", this.mode.getNextLineIndent("doc-start", "   */", "  "))
  }, "test: trigger outdent if line is space and new text starts with closing brace":function() {
    a.ok(this.mode.checkOutdent("start", "   ", " }"));
    a.ok(!this.mode.checkOutdent("start", " a  ", " }"));
    a.ok(!this.mode.checkOutdent("start", "", "}"));
    a.ok(!this.mode.checkOutdent("start", "   ", "a }"));
    a.ok(!this.mode.checkOutdent("start", "   }", "}"))
  }, "test: auto outdent should indent the line with the same indent as the line with the matching opening brace":function() {
    var b = new c(["  function foo() {", "    bla", "    }"]);
    this.mode.autoOutdent("start", b, 2);
    a.equal("  }", b.getLine(2))
  }, "test: no auto outdent if no matching brace is found":function() {
    var b = new c(["  function foo()", "    bla", "    }"]);
    this.mode.autoOutdent("start", b, 2);
    a.equal("    }", b.getLine(2))
  }};
  f.exports = d("async/test").testcase(e)
});
if(module === require.main) {
  require("../../../support/paths");
  exports.exec()
};