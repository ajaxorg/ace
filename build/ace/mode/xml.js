define("ace/mode/xml_highlight_rules", ["require", "exports", "module", "../lib/oop", "./text_highlight_rules"], function(a) {
  var c = a("../lib/oop");
  a = a("./text_highlight_rules");
  var b = function() {
    this.$rules = {start:[{token:"text", regex:"<\\!\\[CDATA\\[", next:"cdata"}, {token:"xml_pe", regex:"<\\?.*?\\?>"}, {token:"comment", regex:"<\\!--", next:"comment"}, {token:"text", regex:"<\\/?", next:"tag"}, {token:"text", regex:"\\s+"}, {token:"text", regex:"[^<]+"}], tag:[{token:"text", regex:">", next:"start"}, {token:"keyword", regex:"[-_a-zA-Z0-9:]+"}, {token:"text", regex:"\\s+"}, {token:"string", regex:'".*?"'}, {token:"string", regex:"'.*?'"}], cdata:[{token:"text", regex:"\\]\\]>", 
    next:"start"}, {token:"text", regex:"\\s+"}, {token:"text", regex:"(?:[^\\]]|\\](?!\\]>))+"}], comment:[{token:"comment", regex:".*?--\>", next:"start"}, {token:"comment", regex:".+"}]}
  };
  c.inherits(b, a);
  return b
});
define("ace/mode/xml", ["require", "exports", "module", "../lib/oop", "./text", "../tokenizer", "./xml_highlight_rules"], function(a) {
  var c = a("../lib/oop"), b = a("./text"), d = a("../tokenizer"), e = a("./xml_highlight_rules");
  a = function() {
    this.$tokenizer = new d((new e).getRules())
  };
  c.inherits(a, b);
  (function() {
    this.getNextLineIndent = function(g, f) {
      return this.$getIndent(f)
    }
  }).call(a.prototype);
  return a
});