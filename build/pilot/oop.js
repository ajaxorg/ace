define(function(e, d) {
  d.inherits = function(a, b) {
    var c = function() {
    };
    c.prototype = b.prototype;
    a.super_ = b.prototype;
    a.prototype = new c;
    a.prototype.constructor = a
  };
  d.mixin = function(a, b) {
    for(var c in b) {
      a[c] = b[c]
    }
  };
  d.implement = function(a, b) {
    d.mixin(a, b)
  }
});