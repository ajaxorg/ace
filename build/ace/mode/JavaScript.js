/*
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
*/
require.def("ace/mode/JavaScript", ["ace/lib/oop", "ace/mode/Text", "ace/Tokenizer", "ace/mode/JavaScriptHighlightRules", "ace/mode/MatchingBraceOutdent", "ace/Range"], function(h, i, j, k, l, m) {
  var g = function() {
    this.$tokenizer = new j((new k).getRules());
    this.$outdent = new l
  };
  h.inherits(g, i);
  (function() {
    this.toggleCommentLines = function(d, b, e) {
      var c = true;
      d = /^(\s*)\/\//;
      for(var a = e.start.row;a <= e.end.row;a++) {
        if(!d.test(b.getLine(a))) {
          c = false;
          break
        }
      }if(c) {
        c = new m(0, 0, 0, 0);
        for(a = e.start.row;a <= e.end.row;a++) {
          var f = b.getLine(a).replace(d, "$1");
          c.start.row = a;
          c.end.row = a;
          c.end.column = f.length + 2;
          b.replace(c, f)
        }return-2
      }else {
        return b.indentRows(e, "//")
      }
    };
    this.getNextLineIndent = function(d, b, e) {
      var c = this.$getIndent(b), a = this.$tokenizer.getLineTokens(b, d), f = a.tokens;
      a = a.state;
      if(f.length && f[f.length - 1].type == "comment") {
        return c
      }if(d == "start") {
        if(d = b.match(/^.*[\{\(\[]\s*$/)) {
          c += e
        }
      }else {
        if(d == "doc-start") {
          if(a == "start") {
            return""
          }if(d = b.match(/^\s*(\/?)\*/)) {
            if(d[1]) {
              c += " "
            }c += "* "
          }
        }
      }return c
    };
    this.checkOutdent = function(d, b, e) {
      return this.$outdent.checkOutdent(b, e)
    };
    this.autoOutdent = function(d, b, e) {
      return this.$outdent.autoOutdent(b, e)
    }
  }).call(g.prototype);
  return g
});