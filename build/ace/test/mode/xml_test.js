define(function(c, d, e) {
  var f = c("ace/document").Document, g = c("ace/tokenizer").Tokenizer, h = c("ace/mode/xml").Mode, b = c("../assertions");
  d = {setUp:function() {
    this.mode = new h
  }, "test: getTokenizer() (smoke test)":function() {
    var a = this.mode.getTokenizer();
    b.ok(a instanceof g);
    a = a.getLineTokens("<juhu>", "start").tokens;
    b.equal("keyword", a[1].type)
  }, "test: toggle comment lines should not do anything":function() {
    var a = new f(["  abc", "cde", "fg"]);
    this.mode.toggleCommentLines("start", a, 0, 1);
    b.equal("  abc\ncde\nfg", a.toString())
  }, "test: next line indent should be the same as the current line indent":function() {
    b.equal("     ", this.mode.getNextLineIndent("start", "     abc"));
    b.equal("", this.mode.getNextLineIndent("start", "abc"));
    b.equal("\t", this.mode.getNextLineIndent("start", "\tabc"))
  }};
  e.exports = c("async/test").testcase(d)
});
if(module === require.main) {
  require("../../../support/paths");
  exports.exec()
};