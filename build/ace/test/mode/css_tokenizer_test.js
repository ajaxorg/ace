define(function(c, d, e) {
  var f = c("ace/mode/css").Mode, b = c("../assertions");
  d = {setUp:function() {
    this.tokenizer = (new f).getTokenizer()
  }, "test: tokenize pixel number":function() {
    var a = this.tokenizer.getLineTokens("-12px", "start").tokens;
    b.equal(1, a.length);
    b.equal("constant.numeric", a[0].type)
  }, "test: tokenize hex3 color":function() {
    var a = this.tokenizer.getLineTokens("#abc", "start").tokens;
    b.equal(1, a.length);
    b.equal("constant.numeric", a[0].type)
  }, "test: tokenize hex6 color":function() {
    var a = this.tokenizer.getLineTokens("#abc012", "start").tokens;
    b.equal(1, a.length);
    b.equal("constant.numeric", a[0].type)
  }, "test: tokenize parens":function() {
    var a = this.tokenizer.getLineTokens("{()}", "start").tokens;
    b.equal(3, a.length);
    b.equal("lparen", a[0].type);
    b.equal("text", a[1].type);
    b.equal("rparen", a[2].type)
  }, "test for last rule in ruleset to catch capturing group bugs":function() {
    var a = this.tokenizer.getLineTokens("top", "start").tokens;
    b.equal(1, a.length);
    b.equal("support.type", a[0].type)
  }};
  e.exports = c("async/test").testcase(d, "css tokenizer")
});
if(module === require.main) {
  require("../../../support/paths");
  exports.exec()
};