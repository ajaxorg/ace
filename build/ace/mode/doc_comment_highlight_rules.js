define(function(a) {
  var c = a("../lib/oop");
  a = a("./text_highlight_rules");
  var b = function() {
    this.$rules = {start:[{token:"comment.doc", regex:"\\*\\/", next:"start"}, {token:"comment.doc.tag", regex:"@[\\w\\d_]+"}, {token:"comment.doc", regex:"s+"}, {token:"comment.doc", regex:"[^@\\*]+"}, {token:"comment.doc", regex:"."}]}
  };
  c.inherits(b, a);
  (function() {
    this.getStartRule = function(d) {
      return{token:"comment.doc", regex:"\\/\\*(?=\\*)", next:d}
    }
  }).call(b.prototype);
  return b
});