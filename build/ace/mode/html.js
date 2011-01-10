define("ace/mode/html_highlight_rules", ["require", "exports", "module", "pilot/oop", "ace/mode/css_highlight_rules", "ace/mode/javascript_highlight_rules", "ace/mode/text_highlight_rules"], function(a, f) {
  var g = a("pilot/oop"), h = a("ace/mode/css_highlight_rules").CssHighlightRules, i = a("ace/mode/javascript_highlight_rules").JavaScriptHighlightRules;
  a = a("ace/mode/text_highlight_rules").TextHighlightRules;
  var d = function() {
    this.$rules = {start:[{token:"text", regex:"<\\!\\[CDATA\\[", next:"cdata"}, {token:"xml_pe", regex:"<\\?.*?\\?>"}, {token:"comment", regex:"<\\!--", next:"comment"}, {token:"text", regex:"<(?=s*script)", next:"script"}, {token:"text", regex:"<(?=s*style)", next:"css"}, {token:"text", regex:"<\\/?", next:"tag"}, {token:"text", regex:"\\s+"}, {token:"text", regex:"[^<]+"}], script:[{token:"text", regex:">", next:"js-start"}, {token:"keyword", regex:"[-_a-zA-Z0-9:]+"}, {token:"text", regex:"\\s+"}, 
    {token:"string", regex:'".*?"'}, {token:"string", regex:"'.*?'"}], css:[{token:"text", regex:">", next:"css-start"}, {token:"keyword", regex:"[-_a-zA-Z0-9:]+"}, {token:"text", regex:"\\s+"}, {token:"string", regex:'".*?"'}, {token:"string", regex:"'.*?'"}], tag:[{token:"text", regex:">", next:"start"}, {token:"keyword", regex:"[-_a-zA-Z0-9:]+"}, {token:"text", regex:"\\s+"}, {token:"string", regex:'".*?"'}, {token:"string", regex:"'.*?'"}], cdata:[{token:"text", regex:"\\]\\]>", next:"start"}, 
    {token:"text", regex:"\\s+"}, {token:"text", regex:".+"}], comment:[{token:"comment", regex:".*?--\>", next:"start"}, {token:"comment", regex:".+"}]};
    this.addRules((new i).getRules(), "js-");
    this.$rules["js-start"].unshift({token:"comment", regex:"\\/\\/.*(?=<\\/script>)", next:"tag"}, {token:"text", regex:"<\\/(?=script)", next:"tag"});
    this.addRules((new h).getRules(), "css-");
    this.$rules["css-start"].unshift({token:"text", regex:"<\\/(?=style)", next:"tag"})
  };
  g.inherits(d, a);
  f.HtmlHighlightRules = d
});
define("ace/mode/html", ["require", "exports", "module", "pilot/oop", "ace/mode/text", "ace/mode/javascript", "ace/mode/css", "ace/tokenizer", "ace/mode/html_highlight_rules"], function(a, f) {
  var g = a("pilot/oop"), h = a("ace/mode/text").Mode, i = a("ace/mode/javascript").Mode, d = a("ace/mode/css").Mode, l = a("ace/tokenizer").Tokenizer, m = a("ace/mode/html_highlight_rules").HtmlHighlightRules;
  a = function() {
    this.$tokenizer = new l((new m).getRules());
    this.$js = new i;
    this.$css = new d
  };
  g.inherits(a, h);
  (function() {
    this.toggleCommentLines = function() {
      return this.$delegate("toggleCommentLines", arguments, function() {
        return 0
      })
    };
    this.getNextLineIndent = function(j, b) {
      var e = this;
      return this.$delegate("getNextLineIndent", arguments, function() {
        return e.$getIndent(b)
      })
    };
    this.checkOutdent = function() {
      return this.$delegate("checkOutdent", arguments, function() {
        return false
      })
    };
    this.autoOutdent = function() {
      return this.$delegate("autoOutdent", arguments)
    };
    this.$delegate = function(j, b, e) {
      var k = b[0], c = k.split("js-");
      if(!c[0] && c[1]) {
        b[0] = c[1];
        return this.$js[j].apply(this.$js, b)
      }c = k.split("css-");
      if(!c[0] && c[1]) {
        b[0] = c[1];
        return this.$css[j].apply(this.$css, b)
      }return e ? e() : undefined
    }
  }).call(a.prototype);
  f.Mode = a
});