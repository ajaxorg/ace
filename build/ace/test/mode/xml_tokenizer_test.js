define(function(c, d, e) {
  var f = c("ace/mode/xml").Mode, a = c("../assertions");
  d = {setUp:function() {
    this.tokenizer = (new f).getTokenizer()
  }, "test: tokenize1":function() {
    var b = this.tokenizer.getLineTokens("<Juhu>//Juhu Kinners</Kinners>", "start").tokens;
    a.equal(5, b.length);
    a.equal("text", b[0].type);
    a.equal("keyword", b[1].type);
    a.equal("text", b[2].type);
    a.equal("keyword", b[3].type);
    a.equal("text", b[4].type)
  }};
  e.exports = c("async/test").testcase(d)
});
if(module === require.main) {
  require("../../../support/paths");
  exports.exec()
};