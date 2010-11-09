define("ace/mode/html_highlight_rules", ["require", "exports", "module", "../lib/oop", "./css_highlight_rules", "./javascript_highlight_rules", "./text_highlight_rules"], function(a) {
  var f = a("../lib/oop"), g = a("./css_highlight_rules"), h = a("./javascript_highlight_rules");
  a = a("./text_highlight_rules");
  var d = function() {
    this.$rules = {start:[{token:"text", regex:"<\\!\\[CDATA\\[", next:"cdata"}, {token:"xml_pe", regex:"<\\?.*?\\?>"}, {token:"comment", regex:"<\\!--", next:"comment"}, {token:"text", regex:"<(?=s*script)", next:"script"}, {token:"text", regex:"<(?=s*style)", next:"css"}, {token:"text", regex:"<\\/?", next:"tag"}, {token:"text", regex:"\\s+"}, {token:"text", regex:"[^<]+"}], script:[{token:"text", regex:">", next:"js-start"}, {token:"keyword", regex:"[-_a-zA-Z0-9:]+"}, {token:"text", regex:"\\s+"}, 
    {token:"string", regex:'".*?"'}, {token:"string", regex:"'.*?'"}], css:[{token:"text", regex:">", next:"css-start"}, {token:"keyword", regex:"[-_a-zA-Z0-9:]+"}, {token:"text", regex:"\\s+"}, {token:"string", regex:'".*?"'}, {token:"string", regex:"'.*?'"}], tag:[{token:"text", regex:">", next:"start"}, {token:"keyword", regex:"[-_a-zA-Z0-9:]+"}, {token:"text", regex:"\\s+"}, {token:"string", regex:'".*?"'}, {token:"string", regex:"'.*?'"}], cdata:[{token:"text", regex:"\\]\\]>", next:"start"}, 
    {token:"text", regex:"\\s+"}, {token:"text", regex:".+"}], comment:[{token:"comment", regex:".*?--\>", next:"start"}, {token:"comment", regex:".+"}]};
    this.addRules((new h).getRules(), "js-");
    this.$rules["js-start"].unshift({token:"comment", regex:"\\/\\/.*(?=<\\/script>)", next:"tag"}, {token:"text", regex:"<\\/(?=script)", next:"tag"});
    this.addRules((new g).getRules(), "css-");
    this.$rules["css-start"].unshift({token:"text", regex:"<\\/(?=style)", next:"tag"})
  };
  f.inherits(d, a);
  return d
});
define("ace/mode/html", ["require", "exports", "module", "../lib/oop", "./text", "./javascript", "./css", "../tokenizer", "./html_highlight_rules"], function(a) {
  var f = a("../lib/oop"), g = a("./text"), h = a("./javascript"), d = a("./css"), k = a("../tokenizer"), l = a("./html_highlight_rules");
  a = function() {
    this.$tokenizer = new k((new l).getRules());
    this.$js = new h;
    this.$css = new d
  };
  f.inherits(a, g);
  (function() {
    this.toggleCommentLines = function() {
      return this.$delegate("toggleCommentLines", arguments, function() {
        return 0
      })
    };
    this.getNextLineIndent = function(i, b) {
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
    this.$delegate = function(i, b, e) {
      var j = b[0], c = j.split("js-");
      if(!c[0] && c[1]) {
        b[0] = c[1];
        return this.$js[i].apply(this.$js, b)
      }c = j.split("css-");
      if(!c[0] && c[1]) {
        b[0] = c[1];
        return this.$css[i].apply(this.$css, b)
      }return e ? e() : undefined
    }
  }).call(a.prototype);
  return a
});