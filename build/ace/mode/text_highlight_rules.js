define(function(a, h) {
  a = function() {
    this.$rules = {start:[{token:"text", regex:".+"}]}
  };
  (function() {
    this.addRules = function(g, b) {
      for(var c in g) {
        for(var d = g[c], e = 0;e < d.length;e++) {
          var f = d[e];
          f.next = f.next ? b + f.next : b + c
        }this.$rules[b + c] = d
      }
    };
    this.getRules = function() {
      return this.$rules
    }
  }).call(a.prototype);
  h.TextHighlightRules = a
});