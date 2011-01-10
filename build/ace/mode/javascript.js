define(function(f, h) {
  var i = f("pilot/oop"), j = f("ace/mode/text").Mode, k = f("ace/tokenizer").Tokenizer, l = f("ace/mode/javascript_highlight_rules").JavaScriptHighlightRules, m = f("ace/mode/matching_brace_outdent").MatchingBraceOutdent, n = f("ace/range").Range;
  f = function() {
    this.$tokenizer = new k((new l).getRules());
    this.$outdent = new m
  };
  i.inherits(f, j);
  (function() {
    this.toggleCommentLines = function(c, a, d, g) {
      var e = true;
      c = /^(\s*)\/\//;
      for(var b = d;b <= g;b++) {
        if(!c.test(a.getLine(b))) {
          e = false;
          break
        }
      }if(e) {
        e = new n(0, 0, 0, 0);
        for(b = d;b <= g;b++) {
          d = a.getLine(b).replace(c, "$1");
          e.start.row = b;
          e.end.row = b;
          e.end.column = d.length + 2;
          a.replace(e, d)
        }return-2
      }else {
        return a.indentRows(d, g, "//")
      }
    };
    this.getNextLineIndent = function(c, a, d) {
      var g = this.$getIndent(a), e = this.$tokenizer.getLineTokens(a, c), b = e.tokens;
      e = e.state;
      if(b.length && b[b.length - 1].type == "comment") {
        return g
      }if(c == "start") {
        if(c = a.match(/^.*[\{\(\[]\s*$/)) {
          g += d
        }
      }else {
        if(c == "doc-start") {
          if(e == "start") {
            return""
          }if(c = a.match(/^\s*(\/?)\*/)) {
            if(c[1]) {
              g += " "
            }g += "* "
          }
        }
      }return g
    };
    this.checkOutdent = function(c, a, d) {
      return this.$outdent.checkOutdent(a, d)
    };
    this.autoOutdent = function(c, a, d) {
      return this.$outdent.autoOutdent(a, d)
    }
  }).call(f.prototype);
  h.Mode = f
});