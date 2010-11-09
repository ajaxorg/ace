define(function(d) {
  var e = d("./lib/lang");
  d = {};
  d.$dispatchEvent = function(a, b) {
    this.$eventRegistry = this.$eventRegistry || {};
    var c = this.$eventRegistry[a];
    if(c && c.length) {
      b = b || {};
      b.type = a;
      for(a = 0;a < c.length;a++) {
        c[a](b)
      }
    }
  };
  d.on = d.addEventListener = function(a, b) {
    this.$eventRegistry = this.$eventRegistry || {};
    var c = this.$eventRegistry[a];
    c || (c = this.$eventRegistry[a] = []);
    e.arrayIndexOf(c, b) == -1 && c.push(b)
  };
  d.removeEventListener = function(a, b) {
    this.$eventRegistry = this.$eventRegistry || {};
    if(a = this.$eventRegistry[a]) {
      b = e.arrayIndexOf(a, b);
      b !== -1 && a.splice(b, 1)
    }
  };
  return d
});