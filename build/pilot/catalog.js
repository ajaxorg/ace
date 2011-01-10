define(function(d, c) {
  var b = {};
  c.addExtensionSpec = function(a) {
    b[a.name] = a
  };
  c.removeExtensionSpec = function(a) {
    if(typeof a === "string") {
      delete b[a]
    }else {
      delete b[a.name]
    }
  };
  c.getExtensionSpec = function(a) {
    return b[a]
  };
  c.getExtensionSpecs = function() {
    return Object.keys(b)
  }
});