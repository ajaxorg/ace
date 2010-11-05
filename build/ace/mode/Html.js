/*
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
*/
require.def("ace/mode/HtmlHighlightRules", ["ace/lib/oop", "ace/mode/CssHighlightRules", "ace/mode/JavaScriptHighlightRules", "ace/mode/TextHighlightRules"], function(e, f, g, h) {
  var c = function() {
    this.$rules = {start:[{token:"text", regex:"<\\!\\[CDATA\\[", next:"cdata"}, {token:"xml_pe", regex:"<\\?.*?\\?>"}, {token:"comment", regex:"<\\!--", next:"comment"}, {token:"text", regex:"<(?=s*script)", next:"script"}, {token:"text", regex:"<(?=s*style)", next:"css"}, {token:"text", regex:"<\\/?", next:"tag"}, {token:"text", regex:"\\s+"}, {token:"text", regex:"[^<]+"}], script:[{token:"text", regex:">", next:"js-start"}, {token:"keyword", regex:"[-_a-zA-Z0-9:]+"}, {token:"text", regex:"\\s+"}, 
    {token:"string", regex:'".*?"'}, {token:"string", regex:"'.*?'"}], css:[{token:"text", regex:">", next:"css-start"}, {token:"keyword", regex:"[-_a-zA-Z0-9:]+"}, {token:"text", regex:"\\s+"}, {token:"string", regex:'".*?"'}, {token:"string", regex:"'.*?'"}], tag:[{token:"text", regex:">", next:"start"}, {token:"keyword", regex:"[-_a-zA-Z0-9:]+"}, {token:"text", regex:"\\s+"}, {token:"string", regex:'".*?"'}, {token:"string", regex:"'.*?'"}], cdata:[{token:"text", regex:"\\]\\]>", next:"start"}, 
    {token:"text", regex:"\\s+"}, {token:"text", regex:".+"}], comment:[{token:"comment", regex:".*?--\>", next:"start"}, {token:"comment", regex:".+"}]};
    this.addRules((new g).getRules(), "js-");
    this.$rules["js-start"].unshift({token:"comment", regex:"\\/\\/.*(?=<\\/script>)", next:"tag"}, {token:"text", regex:"<\\/(?=script)", next:"tag"});
    this.addRules((new f).getRules(), "css-");
    this.$rules["css-start"].unshift({token:"text", regex:"<\\/(?=style)", next:"tag"})
  };
  e.inherits(c, h);
  return c
});
require.def("ace/mode/Html", ["ace/lib/oop", "ace/mode/Text", "ace/mode/JavaScript", "ace/mode/Css", "ace/Tokenizer", "ace/mode/HtmlHighlightRules"], function(e, f, g, h, c, l) {
  var i = function() {
    this.$tokenizer = new c((new l).getRules());
    this.$js = new g;
    this.$css = new h
  };
  e.inherits(i, f);
  (function() {
    this.toggleCommentLines = function() {
      return this.$delegate("toggleCommentLines", arguments, function() {
        return 0
      })
    };
    this.getNextLineIndent = function(j, a) {
      var d = this;
      return this.$delegate("getNextLineIndent", arguments, function() {
        return d.$getIndent(a)
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
    this.$delegate = function(j, a, d) {
      var k = a[0], b = k.split("js-");
      if(!b[0] && b[1]) {
        a[0] = b[1];
        return this.$js[j].apply(this.$js, a)
      }b = k.split("css-");
      if(!b[0] && b[1]) {
        a[0] = b[1];
        return this.$css[j].apply(this.$css, a)
      }return d ? d() : undefined
    }
  }).call(i.prototype);
  return i
});