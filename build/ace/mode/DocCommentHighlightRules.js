/*
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
*/
require.def("ace/mode/DocCommentHighlightRules", ["ace/lib/oop", "ace/mode/TextHighlightRules"], function(b, c) {
  var a = function() {
    this.$rules = {start:[{token:"comment.doc", regex:"\\*\\/", next:"start"}, {token:"comment.doc.tag", regex:"@[\\w\\d_]+"}, {token:"comment.doc", regex:"s+"}, {token:"comment.doc", regex:"[^@\\*]+"}, {token:"comment.doc", regex:"."}]}
  };
  b.inherits(a, c);
  (function() {
    this.getStartRule = function(d) {
      return{token:"comment.doc", regex:"\\/\\*(?=\\*)", next:d}
    }
  }).call(a.prototype);
  return a
});