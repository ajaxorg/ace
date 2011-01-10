define(function(b, c) {
  var d = function() {
  };
  b = ["assert", "count", "debug", "dir", "dirxml", "error", "group", "groupEnd", "info", "log", "profile", "profileEnd", "time", "timeEnd", "trace", "warn"];
  typeof window === "undefined" ? b.forEach(function(a) {
    c[a] = function() {
      var e = Array.prototype.slice.call(arguments);
      postMessage(JSON.stringify({op:"log", method:a, args:e}))
    }
  }) : b.forEach(function(a) {
    c[a] = window.console && window.console[a] ? Function.prototype.bind.call(window.console[a], window.console) : d
  })
});