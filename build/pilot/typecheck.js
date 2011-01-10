define(function(d, b) {
  var c = Object.prototype.toString;
  b.isString = function(a) {
    return a && c.call(a) === "[object String]"
  };
  b.isBoolean = function(a) {
    return a && c.call(a) === "[object Boolean]"
  };
  b.isNumber = function(a) {
    return a && c.call(a) === "[object Number]" && isFinite(a)
  };
  b.isObject = function(a) {
    return a !== undefined && (a === null || typeof a == "object" || Array.isArray(a) || b.isFunction(a))
  };
  b.isFunction = function(a) {
    return a && c.call(a) === "[object Function]"
  }
});