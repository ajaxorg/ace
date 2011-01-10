define(function(a, b, e) {
  var f = a("ace/document").Document, g = a("ace/mode/text").Mode, c = a("../assertions");
  b = {setUp:function() {
    this.mode = new g
  }, "test: toggle comment lines should not do anything":function() {
    var d = new f(["  abc", "cde", "fg"]);
    this.mode.toggleCommentLines("start", d, 0, 1);
    c.equal("  abc\ncde\nfg", d.toString())
  }, "text: lines should not be indented":function() {
    c.equal("", this.mode.getNextLineIndent("start", "   abc", "  "))
  }};
  e.exports = a("async/test").testcase(b)
});
if(module === require.main) {
  require("../../../support/paths");
  exports.exec()
};