define(function(f) {
  var h = f("../lib/oop"), i = f("./text"), j = f("../tokenizer"), k = f("./javascript_highlight_rules"), l = f("./matching_brace_outdent"), m = f("../range");
  f = function() {
    this.$tokenizer = new j((new k).getRules());
    this.$outdent = new l
  };
  h.inherits(f, i);
  (function() {
    this.toggleCommentLines = function(c, d, e) {
      var a = true;
      c = /^(\s*)\/\//;
      for(var b = e.start.row;b <= e.end.row;b++) {
        if(!c.test(d.getLine(b))) {
          a = false;
          break
        }
      }if(a) {
        a = new m(0, 0, 0, 0);
        for(b = e.start.row;b <= e.end.row;b++) {
          var g = d.getLine(b).replace(c, "$1");
          a.start.row = b;
          a.end.row = b;
          a.end.column = g.length + 2;
          d.replace(a, g)
        }return-2
      }else {
        return d.indentRows(e, "//")
      }
    };
    this.getNextLineIndent = function(c, d, e) {
      var a = this.$getIndent(d), b = this.$tokenizer.getLineTokens(d, c), g = b.tokens;
      b = b.state;
      if(g.length && g[g.length - 1].type == "comment") {
        return a
      }if(c == "start") {
        if(c = d.match(/^.*[\{\(\[]\s*$/)) {
          a += e
        }
      }else {
        if(c == "doc-start") {
          if(b == "start") {
            return""
          }if(c = d.match(/^\s*(\/?)\*/)) {
            if(c[1]) {
              a += " "
            }a += "* "
          }if(c[1]) {
            a += " "
          }a += "* "
        }
      }return a
    };
    this.checkOutdent = function(c, d, e) {
      return this.$outdent.checkOutdent(d, e)
    };
    this.autoOutdent = function(c, d, e) {
      return this.$outdent.autoOutdent(d, e)
    }
  }).call(f.prototype);
  return f
});