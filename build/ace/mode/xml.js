define("ace/mode/xml_highlight_rules", ["require", "exports", "module", "pilot/oop", "ace/mode/text_highlight_rules"], function(a, c) {
  var d = a("pilot/oop");
  a = a("ace/mode/text_highlight_rules").TextHighlightRules;
  var b = function() {
    this.$rules = {start:[{token:"text", regex:"<\\!\\[CDATA\\[", next:"cdata"}, {token:"xml_pe", regex:"<\\?.*?\\?>"}, {token:"comment", regex:"<\\!--", next:"comment"}, {token:"text", regex:"<\\/?", next:"tag"}, {token:"text", regex:"\\s+"}, {token:"text", regex:"[^<]+"}], tag:[{token:"text", regex:">", next:"start"}, {token:"keyword", regex:"[-_a-zA-Z0-9:]+"}, {token:"text", regex:"\\s+"}, {token:"string", regex:'".*?"'}, {token:"string", regex:"'.*?'"}], cdata:[{token:"text", regex:"\\]\\]>", 
    next:"start"}, {token:"text", regex:"\\s+"}, {token:"text", regex:"(?:[^\\]]|\\](?!\\]>))+"}], comment:[{token:"comment", regex:".*?--\>", next:"start"}, {token:"comment", regex:".+"}]}
  };
  d.inherits(b, a);
  c.XmlHighlightRules = b
});
define("ace/mode/xml", ["require", "exports", "module", "pilot/oop", "ace/mode/text", "ace/tokenizer", "ace/mode/xml_highlight_rules"], function(a, c) {
  var d = a("pilot/oop"), b = a("ace/mode/text").Mode, e = a("ace/tokenizer").Tokenizer, f = a("ace/mode/xml_highlight_rules").XmlHighlightRules;
  a = function() {
    this.$tokenizer = new e((new f).getRules())
  };
  d.inherits(a, b);
  (function() {
    this.getNextLineIndent = function(h, g) {
      return this.$getIndent(g)
    }
  }).call(a.prototype);
  c.Mode = a
});