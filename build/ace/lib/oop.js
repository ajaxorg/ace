define(function() {
  var c = {};
  c.inherits = function(a, b) {
    var d = function() {
    };
    d.prototype = b.prototype;
    a.super_ = b.prototype;
    a.prototype = new d;
    a.prototype.constructor = a
  };
  c.mixin = function(a, b) {
    for(var d in b) {
      a[d] = b[d]
    }
  };
  c.implement = function(a, b) {
    c.mixin(a, b)
  };
  return c
});