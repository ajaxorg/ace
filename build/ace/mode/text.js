define(function(a, c) {
  var d = a("ace/tokenizer").Tokenizer, e = a("ace/mode/text_highlight_rules").TextHighlightRules;
  a = function() {
    this.$tokenizer = new d((new e).getRules())
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
  c.Mode = a
});