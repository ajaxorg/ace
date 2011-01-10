define(function(k, c) {
  function h(a, b, i, j) {
    this.value = a;
    this.status = b || e.VALID;
    this.message = i;
    this.predictions = j || []
  }
  function f() {
  }
  function g(a, b) {
    a = d[a];
    if(typeof a === "function") {
      a = new a(b)
    }return a
  }
  var e = {VALID:{toString:function() {
    return"VALID"
  }, valueOf:function() {
    return 0
  }}, INCOMPLETE:{toString:function() {
    return"INCOMPLETE"
  }, valueOf:function() {
    return 1
  }}, INVALID:{toString:function() {
    return"INVALID"
  }, valueOf:function() {
    return 2
  }}, combine:function() {
    for(var a = e.VALID, b = 0;b < arguments;b++) {
      if(arguments[b] > a) {
        a = arguments[b]
      }
    }return a
  }};
  c.Status = e;
  c.Conversion = h;
  f.prototype = {stringify:function() {
    throw new Error("not implemented");
  }, parse:function() {
    throw new Error("not implemented");
  }, name:undefined, increment:function() {
  }, decrement:function() {
  }};
  c.Type = f;
  var d = {};
  c.registerType = function(a) {
    if(typeof a === "object") {
      if(a instanceof f) {
        if(!a.name) {
          throw new Error("All registered types must have a name");
        }d[a.name] = a
      }else {
        throw new Error("Can't registerType using: " + a);
      }
    }else {
      if(typeof a === "function") {
        if(!a.prototype.name) {
          throw new Error("All registered types must have a name");
        }d[a.prototype.name] = a
      }else {
        throw new Error("Unknown type: " + a);
      }
    }
  };
  c.deregisterType = function(a) {
    delete d[a.name]
  };
  c.getType = function(a) {
    if(typeof a === "string") {
      return g(a, a)
    }if(typeof a == "object") {
      if(!a.name) {
        throw new Error("Missing 'name' member to typeSpec");
      }return g(a.name, a)
    }throw new Error("Can't extract type from " + a);
  }
});