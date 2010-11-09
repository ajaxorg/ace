define(function(a) {
  var c = a("../lib/oop"), d = a("./css_highlight_rules"), e = a("./javascript_highlight_rules");
  a = a("./text_highlight_rules");
  var b = function() {
    this.$rules = {start:[{token:"text", regex:"<\\!\\[CDATA\\[", next:"cdata"}, {token:"xml_pe", regex:"<\\?.*?\\?>"}, {token:"comment", regex:"<\\!--", next:"comment"}, {token:"text", regex:"<(?=s*script)", next:"script"}, {token:"text", regex:"<(?=s*style)", next:"css"}, {token:"text", regex:"<\\/?", next:"tag"}, {token:"text", regex:"\\s+"}, {token:"text", regex:"[^<]+"}], script:[{token:"text", regex:">", next:"js-start"}, {token:"keyword", regex:"[-_a-zA-Z0-9:]+"}, {token:"text", regex:"\\s+"}, 
    {token:"string", regex:'".*?"'}, {token:"string", regex:"'.*?'"}], css:[{token:"text", regex:">", next:"css-start"}, {token:"keyword", regex:"[-_a-zA-Z0-9:]+"}, {token:"text", regex:"\\s+"}, {token:"string", regex:'".*?"'}, {token:"string", regex:"'.*?'"}], tag:[{token:"text", regex:">", next:"start"}, {token:"keyword", regex:"[-_a-zA-Z0-9:]+"}, {token:"text", regex:"\\s+"}, {token:"string", regex:'".*?"'}, {token:"string", regex:"'.*?'"}], cdata:[{token:"text", regex:"\\]\\]>", next:"start"}, 
    {token:"text", regex:"\\s+"}, {token:"text", regex:".+"}], comment:[{token:"comment", regex:".*?--\>", next:"start"}, {token:"comment", regex:".+"}]};
    this.addRules((new e).getRules(), "js-");
    this.$rules["js-start"].unshift({token:"comment", regex:"\\/\\/.*(?=<\\/script>)", next:"tag"}, {token:"text", regex:"<\\/(?=script)", next:"tag"});
    this.addRules((new d).getRules(), "css-");
    this.$rules["css-start"].unshift({token:"text", regex:"<\\/(?=style)", next:"tag"})
  };
  c.inherits(b, a);
  return b
});