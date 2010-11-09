define("ace/mode/css_highlight_rules", ["require", "exports", "module", "../lib/oop", "../lib/lang", "./text_highlight_rules"], function(b) {
  var j = b("../lib/oop"), c = b("../lib/lang");
  b = b("./text_highlight_rules");
  var e = function() {
    function a(d) {
      var l = [];
      d = d.split("");
      for(var k = 0;k < d.length;k++) {
        l.push("[", d[k].toLowerCase(), d[k].toUpperCase(), "]")
      }return l.join("")
    }
    var f = c.arrayToMap("azimuth|background-attachment|background-color|background-image|background-position|background-repeat|background|border-bottom-color|border-bottom-style|border-bottom-width|border-bottom|border-collapse|border-color|border-left-color|border-left-style|border-left-width|border-left|border-right-color|border-right-style|border-right-width|border-right|border-spacing|border-style|border-top-color|border-top-style|border-top-width|border-top|border-width|border|bottom|caption-side|clear|clip|color|content|counter-increment|counter-reset|cue-after|cue-before|cue|cursor|direction|display|elevation|empty-cells|float|font-family|font-size-adjust|font-size|font-stretch|font-style|font-variant|font-weight|font|height|left|letter-spacing|line-height|list-style-image|list-style-position|list-style-type|list-style|margin-bottom|margin-left|margin-right|margin-top|marker-offset|margin|marks|max-height|max-width|min-height|min-width|-moz-border-radius|opacity|orphans|outline-color|outline-style|outline-width|outline|overflow|overflow-x|overflow-y|padding-bottom|padding-left|padding-right|padding-top|padding|page-break-after|page-break-before|page-break-inside|page|pause-after|pause-before|pause|pitch-range|pitch|play-during|position|quotes|richness|right|size|speak-header|speak-numeral|speak-punctuation|speech-rate|speak|stress|table-layout|text-align|text-decoration|text-indent|text-shadow|text-transform|top|unicode-bidi|vertical-align|visibility|voice-family|volume|white-space|widows|width|word-spacing|z-index".split("|")), 
    g = c.arrayToMap("rgb|rgba|url|attr|counter|counters".split("|")), h = c.arrayToMap("absolute|all-scroll|always|armenian|auto|baseline|below|bidi-override|block|bold|bolder|both|bottom|break-all|break-word|capitalize|center|char|circle|cjk-ideographic|col-resize|collapse|crosshair|dashed|decimal-leading-zero|decimal|default|disabled|disc|distribute-all-lines|distribute-letter|distribute-space|distribute|dotted|double|e-resize|ellipsis|fixed|georgian|groove|hand|hebrew|help|hidden|hiragana-iroha|hiragana|horizontal|ideograph-alpha|ideograph-numeric|ideograph-parenthesis|ideograph-space|inactive|inherit|inline-block|inline|inset|inside|inter-ideograph|inter-word|italic|justify|katakana-iroha|katakana|keep-all|left|lighter|line-edge|line-through|line|list-item|loose|lower-alpha|lower-greek|lower-latin|lower-roman|lowercase|lr-tb|ltr|medium|middle|move|n-resize|ne-resize|newspaper|no-drop|no-repeat|nw-resize|none|normal|not-allowed|nowrap|oblique|outset|outside|overline|pointer|progress|relative|repeat-x|repeat-y|repeat|right|ridge|row-resize|rtl|s-resize|scroll|se-resize|separate|small-caps|solid|square|static|strict|super|sw-resize|table-footer-group|table-header-group|tb-rl|text-bottom|text-top|text|thick|thin|top|transparent|underline|upper-alpha|upper-latin|upper-roman|uppercase|vertical-ideographic|vertical-text|visible|w-resize|wait|whitespace|zero".split("|")), 
    i = c.arrayToMap("aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow".split("|"));
    this.$rules = {start:[{token:"comment", regex:"\\/\\*", next:"comment"}, {token:"string", regex:'["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'}, {token:"string", regex:"['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"}, {token:"constant.numeric", regex:"\\-?(?:(?:[0-9]+)|(?:[0-9]*\\.[0-9]+))" + a("em")}, {token:"constant.numeric", regex:"\\-?(?:(?:[0-9]+)|(?:[0-9]*\\.[0-9]+))" + a("ex")}, {token:"constant.numeric", regex:"\\-?(?:(?:[0-9]+)|(?:[0-9]*\\.[0-9]+))" + a("px")}, {token:"constant.numeric", regex:"\\-?(?:(?:[0-9]+)|(?:[0-9]*\\.[0-9]+))" + 
    a("cm")}, {token:"constant.numeric", regex:"\\-?(?:(?:[0-9]+)|(?:[0-9]*\\.[0-9]+))" + a("mm")}, {token:"constant.numeric", regex:"\\-?(?:(?:[0-9]+)|(?:[0-9]*\\.[0-9]+))" + a("in")}, {token:"constant.numeric", regex:"\\-?(?:(?:[0-9]+)|(?:[0-9]*\\.[0-9]+))" + a("pt")}, {token:"constant.numeric", regex:"\\-?(?:(?:[0-9]+)|(?:[0-9]*\\.[0-9]+))" + a("pc")}, {token:"constant.numeric", regex:"\\-?(?:(?:[0-9]+)|(?:[0-9]*\\.[0-9]+))" + a("deg")}, {token:"constant.numeric", regex:"\\-?(?:(?:[0-9]+)|(?:[0-9]*\\.[0-9]+))" + 
    a("rad")}, {token:"constant.numeric", regex:"\\-?(?:(?:[0-9]+)|(?:[0-9]*\\.[0-9]+))" + a("grad")}, {token:"constant.numeric", regex:"\\-?(?:(?:[0-9]+)|(?:[0-9]*\\.[0-9]+))" + a("ms")}, {token:"constant.numeric", regex:"\\-?(?:(?:[0-9]+)|(?:[0-9]*\\.[0-9]+))" + a("s")}, {token:"constant.numeric", regex:"\\-?(?:(?:[0-9]+)|(?:[0-9]*\\.[0-9]+))" + a("hz")}, {token:"constant.numeric", regex:"\\-?(?:(?:[0-9]+)|(?:[0-9]*\\.[0-9]+))" + a("khz")}, {token:"constant.numeric", regex:"\\-?(?:(?:[0-9]+)|(?:[0-9]*\\.[0-9]+))%"}, 
    {token:"constant.numeric", regex:"\\-?(?:(?:[0-9]+)|(?:[0-9]*\\.[0-9]+))"}, {token:"constant.numeric", regex:"#[a-fA-F0-9]{6}"}, {token:"constant.numeric", regex:"#[a-fA-F0-9]{3}"}, {token:"lparen", regex:"{"}, {token:"rparen", regex:"}"}, {token:function(d) {
      return f[d.toLowerCase()] ? "support.type" : g[d.toLowerCase()] ? "support.function" : h[d.toLowerCase()] ? "support.constant" : i[d.toLowerCase()] ? "support.constant.color" : "text"
    }, regex:"\\-?[a-zA-Z_][a-zA-Z0-9_\\-]*"}], comment:[{token:"comment", regex:".*?\\*\\/", next:"start"}, {token:"comment", regex:".+"}]}
  };
  j.inherits(e, b);
  return e
});
define("ace/mode/matching_brace_outdent", ["require", "exports", "module", "../range"], function(b) {
  var j = b("../range");
  b = function() {
  };
  (function() {
    this.checkOutdent = function(c, e) {
      if(!/^\s+$/.test(c)) {
        return false
      }return/^\s*\}/.test(e)
    };
    this.autoOutdent = function(c, e) {
      var a = c.getLine(e).match(/^(\s*\})/);
      if(!a) {
        return 0
      }a = a[1].length;
      var f = c.findMatchingBracket({row:e, column:a});
      if(!f || f.row == e) {
        return 0
      }f = this.$getIndent(c.getLine(f.row));
      c.replace(new j(e, 0, e, a - 1), f);
      return f.length - (a - 1)
    };
    this.$getIndent = function(c) {
      if(c = c.match(/^(\s+)/)) {
        return c[1]
      }return""
    }
  }).call(b.prototype);
  return b
});
define("ace/mode/css", ["require", "exports", "module", "../lib/oop", "./text", "../tokenizer", "./css_highlight_rules", "./matching_brace_outdent"], function(b) {
  var j = b("../lib/oop"), c = b("./text"), e = b("../tokenizer"), a = b("./css_highlight_rules"), f = b("./matching_brace_outdent");
  b = function() {
    this.$tokenizer = new e((new a).getRules());
    this.$outdent = new f
  };
  j.inherits(b, c);
  (function() {
    this.getNextLineIndent = function(g, h, i) {
      var d = this.$getIndent(h);
      g = this.$tokenizer.getLineTokens(h, g).tokens;
      if(g.length && g[g.length - 1].type == "comment") {
        return d
      }if(h.match(/^.*\{\s*$/)) {
        d += i
      }return d
    };
    this.checkOutdent = function(g, h, i) {
      return this.$outdent.checkOutdent(h, i)
    };
    this.autoOutdent = function(g, h, i) {
      return this.$outdent.autoOutdent(h, i)
    }
  }).call(b.prototype);
  return b
});