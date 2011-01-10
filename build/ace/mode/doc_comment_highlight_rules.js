define(function(a, c) {
  var d = a("pilot/oop");
  a = a("ace/mode/text_highlight_rules").TextHighlightRules;
  var b = function() {
    this.$rules = {start:[{token:"comment.doc", regex:"\\*\\/", next:"start"}, {token:"comment.doc.tag", regex:"@[\\w\\d_]+"}, {token:"comment.doc", regex:"s+"}, {token:"comment.doc", regex:"TODO"}, {token:"comment.doc", regex:"[^@\\*]+"}, {token:"comment.doc", regex:"."}]}
  };
  d.inherits(b, a);
  (function() {
    this.getStartRule = function(e) {
      return{token:"comment.doc", regex:"\\/\\*(?=\\*)", next:e}
    }
  }).call(b.prototype);
  c.DocCommentHighlightRules = b
});