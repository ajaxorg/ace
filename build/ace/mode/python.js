define("ace/mode/python_highlight_rules", ["require", "exports", "module", "../lib/oop", "../lib/lang", "./text_highlight_rules"], function(a) {
  var k = a("../lib/oop"), b = a("../lib/lang");
  a = a("./text_highlight_rules");
  PythonHighlightRules = function() {
    var f = b.arrayToMap("and|as|assert|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|not|or|pass|print|raise|return|try|while|with|yield".split("|")), i = b.arrayToMap("True|False|None|NotImplemented|Ellipsis|__debug__".split("|")), j = b.arrayToMap("abs|divmod|input|open|staticmethod|all|enumerate|int|ord|str|any|eval|isinstance|pow|sum|basestring|execfile|issubclass|print|super|binfile|iter|property|tuple|bool|filter|len|range|type|bytearray|float|list|raw_input|unichr|callable|format|locals|reduce|unicode|chr|frozenset|long|reload|vars|classmethod|getattr|map|repr|xrange|cmp|globals|max|reversed|zip|compile|hasattr|memoryview|round|__import__|complex|hash|min|set|apply|delattr|help|next|setattr|buffer|dict|hex|object|slice|coerce|dir|id|oct|sorted|intern".split("|")), 
    l = b.arrayToMap("".split("|"));
    this.$rules = {start:[{token:"comment", regex:"#.*$"}, {token:"string", regex:'(?:(?:[rubRUB])|(?:[ubUB][rR]))?"{3}(?:(?:.)|(?:^"{3}))*?"{3}'}, {token:"string", regex:'(?:(?:[rubRUB])|(?:[ubUB][rR]))?"{3}.*$', next:"qqstring"}, {token:"string", regex:'(?:(?:[rubRUB])|(?:[ubUB][rR]))?"(?:(?:\\\\.)|(?:[^"\\\\]))*?"'}, {token:"string", regex:"(?:(?:[rubRUB])|(?:[ubUB][rR]))?'{3}(?:(?:.)|(?:^'{3}))*?'{3}"}, {token:"string", regex:"(?:(?:[rubRUB])|(?:[ubUB][rR]))?'{3}.*$", next:"qstring"}, {token:"string", 
    regex:"(?:(?:[rubRUB])|(?:[ubUB][rR]))?'(?:(?:\\\\.)|(?:[^'\\\\]))*?'"}, {token:"constant.numeric", regex:"(?:(?:(?:(?:(?:(?:(?:\\d+)?(?:\\.\\d+))|(?:(?:\\d+)\\.))|(?:\\d+))(?:[eE][+-]?\\d+))|(?:(?:(?:\\d+)?(?:\\.\\d+))|(?:(?:\\d+)\\.)))|\\d+)[jJ]\\b"}, {token:"constant.numeric", regex:"(?:(?:(?:(?:(?:(?:\\d+)?(?:\\.\\d+))|(?:(?:\\d+)\\.))|(?:\\d+))(?:[eE][+-]?\\d+))|(?:(?:(?:\\d+)?(?:\\.\\d+))|(?:(?:\\d+)\\.)))"}, {token:"constant.numeric", regex:"(?:(?:(?:[1-9]\\d*)|(?:0))|(?:0[oO]?[0-7]+)|(?:0[xX][\\dA-Fa-f]+)|(?:0[bB][01]+))[lL]\\b"}, 
    {token:"constant.numeric", regex:"(?:(?:(?:[1-9]\\d*)|(?:0))|(?:0[oO]?[0-7]+)|(?:0[xX][\\dA-Fa-f]+)|(?:0[bB][01]+))\\b"}, {token:function(c) {
      return f[c] ? "keyword" : i[c] ? "constant.language" : l[c] ? "invalid.illegal" : j[c] ? "support.function" : c == "debugger" ? "invalid.deprecated" : "identifier"
    }, regex:"[a-zA-Z_$][a-zA-Z0-9_$]*\\b"}, {token:"keyword.operator", regex:"\\+|\\-|\\*|\\*\\*|\\/|\\/\\/|%|<<|>>|&|\\||\\^|~|<|>|<=|=>|==|!=|<>|="}, {token:"lparen", regex:"[\\[\\(\\{]"}, {token:"rparen", regex:"[\\]\\)\\}]"}, {token:"text", regex:"\\s+"}], qqstring:[{token:"string", regex:'(?:^"{3})*?"{3}', next:"start"}, {token:"string", regex:".+"}], qstring:[{token:"string", regex:"(?:^'{3})*?'{3}", next:"start"}, {token:"string", regex:".+"}]}
  };
  k.inherits(PythonHighlightRules, a);
  return PythonHighlightRules
});
define("ace/mode/matching_brace_outdent", ["require", "exports", "module", "../range"], function(a) {
  var k = a("../range");
  a = function() {
  };
  (function() {
    this.checkOutdent = function(b, f) {
      if(!/^\s+$/.test(b)) {
        return false
      }return/^\s*\}/.test(f)
    };
    this.autoOutdent = function(b, f) {
      var i = b.getLine(f).match(/^(\s*\})/);
      if(!i) {
        return 0
      }i = i[1].length;
      var j = b.findMatchingBracket({row:f, column:i});
      if(!j || j.row == f) {
        return 0
      }j = this.$getIndent(b.getLine(j.row));
      b.replace(new k(f, 0, f, i - 1), j);
      return j.length - (i - 1)
    };
    this.$getIndent = function(b) {
      if(b = b.match(/^(\s+)/)) {
        return b[1]
      }return""
    }
  }).call(a.prototype);
  return a
});
define("ace/mode/python", ["require", "exports", "module", "../lib/oop", "./text", "../tokenizer", "./python_highlight_rules", "./matching_brace_outdent", "../range"], function(a) {
  var k = a("../lib/oop"), b = a("./text"), f = a("../tokenizer"), i = a("./python_highlight_rules"), j = a("./matching_brace_outdent"), l = a("../range");
  a = function() {
    this.$tokenizer = new f((new i).getRules());
    this.$outdent = new j
  };
  k.inherits(a, b);
  (function() {
    this.toggleCommentLines = function(c, e, g) {
      var h = true;
      c = /^(\s*)#/;
      for(var d = g.start.row;d <= g.end.row;d++) {
        if(!c.test(e.getLine(d))) {
          h = false;
          break
        }
      }if(h) {
        h = new l(0, 0, 0, 0);
        for(d = g.start.row;d <= g.end.row;d++) {
          var m = e.getLine(d).replace(c, "$1");
          h.start.row = d;
          h.end.row = d;
          h.end.column = m.length + 2;
          e.replace(h, m)
        }return-2
      }else {
        return e.indentRows(g, "#")
      }
    };
    this.getNextLineIndent = function(c, e, g) {
      var h = this.$getIndent(e), d = this.$tokenizer.getLineTokens(e, c).tokens;
      if(d.length && d[d.length - 1].type == "comment") {
        return h
      }if(c == "start") {
        if(e.match(/^.*[\{\(\[\:]\s*$/)) {
          h += g
        }
      }return h
    };
    this.checkOutdent = function(c, e, g) {
      return this.$outdent.checkOutdent(e, g)
    };
    this.autoOutdent = function(c, e, g) {
      return this.$outdent.autoOutdent(e, g)
    }
  }).call(a.prototype);
  return a
});