define(function(f) {
  var h = f("../lib/oop"), i = f("./text"), j = f("../tokenizer"), k = f("./javascript_highlight_rules"), l = f("./matching_brace_outdent"), m = f("../range");
  f = function() {
    this.$tokenizer = new j((new k).getRules());
    this.$outdent = new l
  };
  h.inherits(f, i);
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
          var g = b.getLine(a).replace(d, "$1");
          c.start.row = a;
          c.end.row = a;
          c.end.column = g.length + 2;
          b.replace(c, g)
        }return-2
      }else {
        return b.indentRows(e, "//")
      }
    };
    this.getNextLineIndent = function(d, b, e) {
      var c = this.$getIndent(b), a = this.$tokenizer.getLineTokens(b, d), g = a.tokens;
      a = a.state;
      if(g.length && g[g.length - 1].type == "comment") {
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
  }).call(f.prototype);
  return f
});