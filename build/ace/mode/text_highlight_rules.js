define(function() {
  var f = function() {
    this.$rules = {start:[{token:"text", regex:".+"}]}
  };
  (function() {
    this.addRules = function(g, a) {
      for(var b in g) {
        for(var c = g[b], d = 0;d < c.length;d++) {
          var e = c[d];
          e.next = e.next ? a + e.next : a + b
        }this.$rules[a + b] = c
      }
    };
    this.getRules = function() {
      return this.$rules
    }
  }).call(f.prototype);
  return f
});