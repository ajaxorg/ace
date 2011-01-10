define("ace/mode/python_highlight_rules", ["require", "exports", "module", "pilot/oop", "pilot/lang", "./text_highlight_rules"], function(a, l) {
  var m = a("pilot/oop"), b = a("pilot/lang");
  a = a("./text_highlight_rules").TextHighlightRules;
  PythonHighlightRules = function() {
    var f = b.arrayToMap("and|as|assert|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|not|or|pass|print|raise|return|try|while|with|yield".split("|")), h = b.arrayToMap("True|False|None|NotImplemented|Ellipsis|__debug__".split("|")), i = b.arrayToMap("abs|divmod|input|open|staticmethod|all|enumerate|int|ord|str|any|eval|isinstance|pow|sum|basestring|execfile|issubclass|print|super|binfile|iter|property|tuple|bool|filter|len|range|type|bytearray|float|list|raw_input|unichr|callable|format|locals|reduce|unicode|chr|frozenset|long|reload|vars|classmethod|getattr|map|repr|xrange|cmp|globals|max|reversed|zip|compile|hasattr|memoryview|round|__import__|complex|hash|min|set|apply|delattr|help|next|setattr|buffer|dict|hex|object|slice|coerce|dir|id|oct|sorted|intern".split("|")), 
    n = b.arrayToMap("".split("|"));
    this.$rules = {start:[{token:"comment", regex:"#.*$"}, {token:"string", regex:'(?:(?:[rubRUB])|(?:[ubUB][rR]))?"{3}(?:(?:.)|(?:^"{3}))*?"{3}'}, {token:"string", regex:'(?:(?:[rubRUB])|(?:[ubUB][rR]))?"{3}.*$', next:"qqstring"}, {token:"string", regex:'(?:(?:[rubRUB])|(?:[ubUB][rR]))?"(?:(?:\\\\.)|(?:[^"\\\\]))*?"'}, {token:"string", regex:"(?:(?:[rubRUB])|(?:[ubUB][rR]))?'{3}(?:(?:.)|(?:^'{3}))*?'{3}"}, {token:"string", regex:"(?:(?:[rubRUB])|(?:[ubUB][rR]))?'{3}.*$", next:"qstring"}, {token:"string", 
    regex:"(?:(?:[rubRUB])|(?:[ubUB][rR]))?'(?:(?:\\\\.)|(?:[^'\\\\]))*?'"}, {token:"constant.numeric", regex:"(?:(?:(?:(?:(?:(?:(?:\\d+)?(?:\\.\\d+))|(?:(?:\\d+)\\.))|(?:\\d+))(?:[eE][+-]?\\d+))|(?:(?:(?:\\d+)?(?:\\.\\d+))|(?:(?:\\d+)\\.)))|\\d+)[jJ]\\b"}, {token:"constant.numeric", regex:"(?:(?:(?:(?:(?:(?:\\d+)?(?:\\.\\d+))|(?:(?:\\d+)\\.))|(?:\\d+))(?:[eE][+-]?\\d+))|(?:(?:(?:\\d+)?(?:\\.\\d+))|(?:(?:\\d+)\\.)))"}, {token:"constant.numeric", regex:"(?:(?:(?:[1-9]\\d*)|(?:0))|(?:0[oO]?[0-7]+)|(?:0[xX][\\dA-Fa-f]+)|(?:0[bB][01]+))[lL]\\b"}, 
    {token:"constant.numeric", regex:"(?:(?:(?:[1-9]\\d*)|(?:0))|(?:0[oO]?[0-7]+)|(?:0[xX][\\dA-Fa-f]+)|(?:0[bB][01]+))\\b"}, {token:function(c) {
      return f[c] ? "keyword" : h[c] ? "constant.language" : n[c] ? "invalid.illegal" : i[c] ? "support.function" : c == "debugger" ? "invalid.deprecated" : "identifier"
    }, regex:"[a-zA-Z_$][a-zA-Z0-9_$]*\\b"}, {token:"keyword.operator", regex:"\\+|\\-|\\*|\\*\\*|\\/|\\/\\/|%|<<|>>|&|\\||\\^|~|<|>|<=|=>|==|!=|<>|="}, {token:"lparen", regex:"[\\[\\(\\{]"}, {token:"rparen", regex:"[\\]\\)\\}]"}, {token:"text", regex:"\\s+"}], qqstring:[{token:"string", regex:'(?:^"{3})*?"{3}', next:"start"}, {token:"string", regex:".+"}], qstring:[{token:"string", regex:"(?:^'{3})*?'{3}", next:"start"}, {token:"string", regex:".+"}]}
  };
  m.inherits(PythonHighlightRules, a);
  l.PythonHighlightRules = PythonHighlightRules
});
define("ace/mode/matching_brace_outdent", ["require", "exports", "module", "ace/range"], function(a, l) {
  var m = a("ace/range").Range;
  a = function() {
  };
  (function() {
    this.checkOutdent = function(b, f) {
      if(!/^\s+$/.test(b)) {
        return false
      }return/^\s*\}/.test(f)
    };
    this.autoOutdent = function(b, f) {
      var h = b.getLine(f).match(/^(\s*\})/);
      if(!h) {
        return 0
      }h = h[1].length;
      var i = b.findMatchingBracket({row:f, column:h});
      if(!i || i.row == f) {
        return 0
      }i = this.$getIndent(b.getLine(i.row));
      b.replace(new m(f, 0, f, h - 1), i);
      return i.length - (h - 1)
    };
    this.$getIndent = function(b) {
      if(b = b.match(/^(\s+)/)) {
        return b[1]
      }return""
    }
  }).call(a.prototype);
  l.MatchingBraceOutdent = a
});
define("ace/mode/python", ["require", "exports", "module", "pilot/oop", "./text", "../tokenizer", "./python_highlight_rules", "./matching_brace_outdent", "../range"], function(a, l) {
  var m = a("pilot/oop"), b = a("./text").Mode, f = a("../tokenizer").Tokenizer, h = a("./python_highlight_rules").PythonHighlightRules, i = a("./matching_brace_outdent").MatchingBraceOutdent, n = a("../range").Range;
  a = function() {
    this.$tokenizer = new f((new h).getRules());
    this.$outdent = new i
  };
  m.inherits(a, b);
  (function() {
    this.toggleCommentLines = function(c, d, e, k) {
      var g = true;
      c = /^(\s*)#/;
      for(var j = e;j <= k;j++) {
        if(!c.test(d.getLine(j))) {
          g = false;
          break
        }
      }if(g) {
        g = new n(0, 0, 0, 0);
        for(j = e;j <= k;j++) {
          e = d.getLine(j).replace(c, "$1");
          g.start.row = j;
          g.end.row = j;
          g.end.column = e.length + 2;
          d.replace(g, e)
        }return-2
      }else {
        return d.indentRows(e, k, "#")
      }
    };
    this.getNextLineIndent = function(c, d, e) {
      var k = this.$getIndent(d), g = this.$tokenizer.getLineTokens(d, c).tokens;
      if(g.length && g[g.length - 1].type == "comment") {
        return k
      }if(c == "start") {
        if(d.match(/^.*[\{\(\[\:]\s*$/)) {
          k += e
        }
      }return k
    };
    this.checkOutdent = function(c, d, e) {
      return this.$outdent.checkOutdent(d, e)
    };
    this.autoOutdent = function(c, d, e) {
      return this.$outdent.autoOutdent(d, e)
    }
  }).call(a.prototype);
  l.Mode = a
});