define(function(a) {
  var c = a("../tokenizer"), d = a("./text_highlight_rules");
  a = function() {
    this.$tokenizer = new c((new d).getRules())
  };
  (function() {
    this.getTokenizer = function() {
      return this.$tokenizer
    };
    this.toggleCommentLines = function() {
      return 0
    };
    this.getNextLineIndent = function() {
      return""
    };
    this.checkOutdent = function() {
      return false
    };
    this.autoOutdent = function() {
    };
    this.$getIndent = function(b) {
      if(b = b.match(/^(\s+)/)) {
        return b[1]
      }return""
    }
  }).call(a.prototype);
  return a
});