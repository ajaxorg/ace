define(function(c, d, e) {
  var f = c("ace/mode/html").Mode, a = c("../assertions");
  d = {setUp:function() {
    this.tokenizer = (new f).getTokenizer()
  }, "test: tokenize embedded script":function() {
    var b = this.tokenizer.getLineTokens("<script a='a'>var<\/script>'123'", "start").tokens;
    a.equal("text", b[0].type);
    a.equal("keyword", b[1].type);
    a.equal("text", b[2].type);
    a.equal("keyword", b[3].type);
    a.equal("text", b[4].type);
    a.equal("string", b[5].type);
    a.equal("text", b[6].type);
    a.equal("keyword", b[7].type);
    a.equal("text", b[8].type);
    a.equal("keyword", b[9].type);
    a.equal("text", b[10].type)
  }};
  e.exports = c("async/test").testcase(d)
});
if(module === require.main) {
  require("../../../support/paths");
  exports.exec()
};