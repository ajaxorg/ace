define(function(e, f) {
  var g = e("ace/range").Range;
  e = function() {
  };
  (function() {
    this.checkOutdent = function(a, b) {
      if(!/^\s+$/.test(a)) {
        return false
      }return/^\s*\}/.test(b)
    };
    this.autoOutdent = function(a, b) {
      var c = a.getLine(b).match(/^(\s*\})/);
      if(!c) {
        return 0
      }c = c[1].length;
      var d = a.findMatchingBracket({row:b, column:c});
      if(!d || d.row == b) {
        return 0
      }d = this.$getIndent(a.getLine(d.row));
      a.replace(new g(b, 0, b, c - 1), d);
      return d.length - (c - 1)
    };
    this.$getIndent = function(a) {
      if(a = a.match(/^(\s+)/)) {
        return a[1]
      }return""
    }
  }).call(e.prototype);
  f.MatchingBraceOutdent = e
});