define(function(d, h) {
  var i = d("pilot/oop"), j = d("./text").Mode, k = d("../tokenizer").Tokenizer, l = d("./php_highlight_rules").PhpHighlightRules, m = d("./matching_brace_outdent").MatchingBraceOutdent, n = d("../range").Range;
  d = function() {
    this.$tokenizer = new k((new l).getRules());
    this.$outdent = new m
  };
  i.inherits(d, j);
  (function() {
    this.toggleCommentLines = function(f, a, b, g) {
      var c = true;
      f = /^(\s*)#/;
      for(var e = b;e <= g;e++) {
        if(!f.test(a.getLine(e))) {
          c = false;
          break
        }
      }if(c) {
        c = new n(0, 0, 0, 0);
        for(e = b;e <= g;e++) {
          b = a.getLine(e).replace(f, "$1");
          c.start.row = e;
          c.end.row = e;
          c.end.column = b.length + 2;
          a.replace(c, b)
        }return-2
      }else {
        return a.indentRows(b, g, "#")
      }
    };
    this.getNextLineIndent = function(f, a, b) {
      var g = this.$getIndent(a), c = this.$tokenizer.getLineTokens(a, f).tokens;
      if(c.length && c[c.length - 1].type == "comment") {
        return g
      }if(f == "start") {
        if(a.match(/^.*[\{\(\[\:]\s*$/)) {
          g += b
        }
      }return g
    };
    this.checkOutdent = function(f, a, b) {
      return this.$outdent.checkOutdent(a, b)
    };
    this.autoOutdent = function(f, a, b) {
      return this.$outdent.autoOutdent(a, b)
    }
  }).call(d.prototype);
  h.Mode = d
});