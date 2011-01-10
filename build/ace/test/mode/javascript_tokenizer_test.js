define(function(c, d, e) {
  var f = c("ace/mode/javascript").Mode, b = c("../assertions");
  d = {setUp:function() {
    this.tokenizer = (new f).getTokenizer()
  }, "test: tokenize1":function() {
    var a = this.tokenizer.getLineTokens("foo = function", "start").tokens;
    b.equal(5, a.length);
    b.equal("identifier", a[0].type);
    b.equal("text", a[1].type);
    b.equal("keyword.operator", a[2].type);
    b.equal("text", a[3].type);
    b.equal("keyword", a[4].type)
  }, "test: tokenize doc comment":function() {
    var a = this.tokenizer.getLineTokens("abc /** de */ fg", "start").tokens;
    b.equal(5, a.length);
    b.equal("identifier", a[0].type);
    b.equal("text", a[1].type);
    b.equal("comment.doc", a[2].type);
    b.equal("text", a[3].type);
    b.equal("identifier", a[4].type)
  }, "test: tokenize doc comment with tag":function() {
    var a = this.tokenizer.getLineTokens("/** @param {} */", "start").tokens;
    b.equal(3, a.length);
    b.equal("comment.doc", a[0].type);
    b.equal("comment.doc.tag", a[1].type);
    b.equal("comment.doc", a[2].type)
  }, "test: tokenize parens":function() {
    var a = this.tokenizer.getLineTokens("[{( )}]", "start").tokens;
    b.equal(3, a.length);
    b.equal("lparen", a[0].type);
    b.equal("text", a[1].type);
    b.equal("rparen", a[2].type)
  }, "test for last rule in ruleset to catch capturing group bugs":function() {
    var a = this.tokenizer.getLineTokens("}", "start").tokens;
    b.equal(1, a.length);
    b.equal("rparen", a[0].type)
  }};
  e.exports = c("async/test").testcase(d)
});
if(module === require.main) {
  require("../../../support/paths");
  exports.exec()
};