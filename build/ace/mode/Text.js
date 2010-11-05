/*
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
*/
require.def("ace/mode/Text", ["ace/Tokenizer", "ace/mode/TextHighlightRules"], function(c, d) {
  var b = function() {
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
    this.$getIndent = function(a) {
      if(a = a.match(/^(\s+)/)) {
        return a[1]
      }return""
    }
  }).call(b.prototype);
  return b
});