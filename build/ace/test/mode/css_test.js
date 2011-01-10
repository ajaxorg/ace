define(function(b, c, e) {
  var f = b("ace/document").Document, g = b("ace/mode/css").Mode, a = b("../assertions");
  c = {setUp:function() {
    this.mode = new g
  }, "test: toggle comment lines should not do anything":function() {
    var d = new f("  abc\ncde\nfg");
    this.mode.toggleCommentLines("start", d, 0, 1);
    a.equal("  abc\ncde\nfg", d.toString())
  }, "test: lines should keep indentation":function() {
    a.equal("   ", this.mode.getNextLineIndent("start", "   abc", "  "));
    a.equal("\t", this.mode.getNextLineIndent("start", "\tabc", "  "))
  }, "test: new line after { should increase indent":function() {
    a.equal("     ", this.mode.getNextLineIndent("start", "   abc{", "  "));
    a.equal("\t  ", this.mode.getNextLineIndent("start", "\tabc  { ", "  "))
  }, "test: no indent increase after { in a comment":function() {
    a.equal("   ", this.mode.getNextLineIndent("start", "   /*{", "  "));
    a.equal("   ", this.mode.getNextLineIndent("start", "   /*{  ", "  "))
  }};
  e.exports = b("async/test").testcase(c)
});
if(module === require.main) {
  require("../../../support/paths");
  exports.exec()
};