define(function(a, c, e) {
  var f = a("ace/document").Document, g = a("ace/range").Range, h = a("ace/mode/html").Mode, b = a("../assertions");
  c = {setUp:function() {
    this.mode = new h
  }, "test: toggle comment lines should not do anything":function() {
    var d = new f(["  abc", "cde", "fg"]);
    new g(0, 3, 1, 1);
    this.mode.toggleCommentLines("start", d, 0, 1);
    b.equal("  abc\ncde\nfg", d.toString())
  }, "test: next line indent should be the same as the current line indent":function() {
    b.equal("     ", this.mode.getNextLineIndent("start", "     abc"));
    b.equal("", this.mode.getNextLineIndent("start", "abc"));
    b.equal("\t", this.mode.getNextLineIndent("start", "\tabc"))
  }};
  e.exports = a("async/test").testcase(c)
});
if(module === require.main) {
  require("../../../support/paths");
  exports.exec()
};