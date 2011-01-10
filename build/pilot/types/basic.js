define(function(g, j) {
  function d(a) {
    if(!Array.isArray(a.data) && typeof a.data !== "function") {
      throw new Error("instances of SelectionType need typeSpec.data to be an array or function that returns an array:" + JSON.stringify(a));
    }Object.keys(a).forEach(function(b) {
      this[b] = a[b]
    }, this)
  }
  function e(a) {
    if(typeof a.defer !== "function") {
      throw new Error("Instances of DeferredType need typeSpec.defer to be a function that returns a type");
    }Object.keys(a).forEach(function(b) {
      this[b] = a[b]
    }, this)
  }
  var c = g("pilot/types");
  g = c.Type;
  var h = c.Conversion, k = c.Status, i = new g;
  i.stringify = function(a) {
    return a
  };
  i.parse = function(a) {
    if(typeof a != "string") {
      throw new Error("non-string passed to text.parse()");
    }return new h(a)
  };
  i.name = "text";
  var f = new g;
  f.stringify = function(a) {
    if(!a) {
      return null
    }return"" + a
  };
  f.parse = function(a) {
    if(typeof a != "string") {
      throw new Error("non-string passed to number.parse()");
    }if(a.replace(/\s/g, "").length === 0) {
      return new h(null, k.INCOMPLETE, "")
    }var b = new h(parseInt(a, 10));
    if(isNaN(b.value)) {
      b.status = k.INVALID;
      b.message = "Can't convert \"" + a + '" to a number.'
    }return b
  };
  f.decrement = function(a) {
    return a - 1
  };
  f.increment = function(a) {
    return a + 1
  };
  f.name = "number";
  d.prototype = new g;
  d.prototype.stringify = function(a) {
    return a
  };
  d.prototype.parse = function(a) {
    if(typeof a != "string") {
      throw new Error("non-string passed to parse()");
    }if(!this.data) {
      throw new Error("Missing data on selection type extension.");
    }var b = false, o, l = [];
    (typeof this.data === "function" ? this.data() : this.data).forEach(function(m) {
      if(a == m) {
        o = this.fromString(m);
        b = true
      }else {
        m.indexOf(a) === 0 && l.push(this.fromString(m))
      }
    }, this);
    if(b) {
      return new h(o)
    }else {
      this.noMatch && this.noMatch();
      if(l.length > 0) {
        var n = "Possibilities" + (a.length === 0 ? "" : " for '" + a + "'");
        return new h(null, k.INCOMPLETE, n, l)
      }else {
        n = "Can't use '" + a + "'.";
        return new h(null, k.INVALID, n, l)
      }
    }
  };
  d.prototype.fromString = function(a) {
    return a
  };
  d.prototype.decrement = function(a) {
    var b = typeof this.data === "function" ? this.data() : this.data;
    if(a == null) {
      a = b.length - 1
    }else {
      a = this.stringify(a);
      a = b.indexOf(a);
      a = a === 0 ? b.length - 1 : a - 1
    }return this.fromString(b[a])
  };
  d.prototype.increment = function(a) {
    var b = typeof this.data === "function" ? this.data() : this.data;
    if(a == null) {
      a = 0
    }else {
      a = this.stringify(a);
      a = b.indexOf(a);
      a = a === b.length - 1 ? 0 : a + 1
    }return this.fromString(b[a])
  };
  d.prototype.name = "selection";
  j.SelectionType = d;
  var p = new d({name:"bool", data:["true", "false"], stringify:function(a) {
    return"" + a
  }, fromString:function(a) {
    return a === "true" ? true : false
  }});
  e.prototype = new g;
  e.prototype.stringify = function(a) {
    return this.defer().stringify(a)
  };
  e.prototype.parse = function(a) {
    return this.defer().parse(a)
  };
  e.prototype.decrement = function(a) {
    var b = this.defer();
    return b.decrement ? b.decrement(a) : undefined
  };
  e.prototype.increment = function(a) {
    var b = this.defer();
    return b.increment ? b.increment(a) : undefined
  };
  e.prototype.name = "deferred";
  j.DeferredType = e;
  j.startup = function() {
    c.registerType(i);
    c.registerType(f);
    c.registerType(p);
    c.registerType(d);
    c.registerType(e)
  };
  j.shutdown = function() {
    c.unregisterType(i);
    c.unregisterType(f);
    c.unregisterType(p);
    c.unregisterType(d);
    c.unregisterType(e)
  }
});