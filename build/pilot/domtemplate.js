define(function(r, q) {
  function g() {
    this.scope = []
  }
  g.prototype.processNode = function(a, c) {
    if(typeof a === "string") {
      a = document.getElementById(a)
    }if(c === null || c === undefined) {
      c = {}
    }this.scope.push(a.nodeName + (a.id ? "#" + a.id : ""));
    try {
      if(a.attributes && a.attributes.length) {
        if(a.hasAttribute("foreach")) {
          this.processForEach(a, c);
          return
        }if(a.hasAttribute("if")) {
          if(!this.processIf(a, c)) {
            return
          }
        }c.__element = a;
        for(var d = Array.prototype.slice.call(a.attributes), b = 0;b < d.length;b++) {
          var e = d[b].value, f = d[b].name;
          this.scope.push(f);
          try {
            if(f === "save") {
              e = this.stripBraces(e);
              this.property(e, c, a);
              a.removeAttribute("save")
            }else {
              if(f.substring(0, 2) === "on") {
                e = this.stripBraces(e);
                var j = this.property(e, c);
                typeof j !== "function" && this.handleError("Expected " + e + " to resolve to a function, but got " + typeof j);
                a.removeAttribute(f);
                var n = a.hasAttribute("capture" + f.substring(2));
                a.addEventListener(f.substring(2), j, n);
                n && a.removeAttribute("capture" + f.substring(2))
              }else {
                var o = this, i = e.replace(/\$\{[^}]*\}/g, function(p) {
                  return o.envEval(p.slice(2, -1), c, e)
                });
                if(f.charAt(0) === "_") {
                  a.removeAttribute(f);
                  a.setAttribute(f.substring(1), i)
                }else {
                  if(e !== i) {
                    d[b].value = i
                  }
                }
              }
            }
          }finally {
            this.scope.pop()
          }
        }
      }var m = Array.prototype.slice.call(a.childNodes);
      for(d = 0;d < m.length;d++) {
        this.processNode(m[d], c)
      }a.nodeType === Node.TEXT_NODE && this.processTextNode(a, c)
    }finally {
      this.scope.pop()
    }
  };
  g.prototype.processIf = function(a, c) {
    this.scope.push("if");
    try {
      var d = a.getAttribute("if"), b = this.stripBraces(d), e = true;
      try {
        e = !!this.envEval(b, c, d)
      }catch(f) {
        this.handleError("Error with '" + b + "'", f);
        e = false
      }e || a.parentNode.removeChild(a);
      a.removeAttribute("if");
      return e
    }finally {
      this.scope.pop()
    }
  };
  g.prototype.processForEach = function(a, c) {
    this.scope.push("foreach");
    try {
      var d = a.getAttribute("foreach"), b = d, e = "param";
      if(b.charAt(0) === "$") {
        b = this.stripBraces(b)
      }else {
        var f = b.split(" in ");
        e = f[0].trim();
        b = this.stripBraces(f[1].trim())
      }a.removeAttribute("foreach");
      try {
        var j = this, n = function(h, k, l) {
          l.parentNode.insertBefore(k, l);
          c[e] = h;
          j.processNode(k, c);
          delete c[e]
        }, o = function(h, k) {
          j.scope.push(h);
          try {
            if(a.nodeName === "LOOP") {
              for(h = 0;h < a.childNodes.length;h++) {
                var l = a.childNodes[h].cloneNode(true);
                n(k, l, a)
              }
            }else {
              l = a.cloneNode(true);
              l.removeAttribute("foreach");
              n(k, l, a)
            }
          }finally {
            j.scope.pop()
          }
        }, i = this.envEval(b, c, d);
        if(Array.isArray(i)) {
          i.forEach(function(h, k) {
            o("" + k, h)
          }, this)
        }else {
          for(var m in i) {
            i.hasOwnProperty(m) && o(m, m)
          }
        }a.parentNode.removeChild(a)
      }catch(p) {
        this.handleError("Error with '" + b + "'", p)
      }
    }finally {
      this.scope.pop()
    }
  };
  g.prototype.processTextNode = function(a, c) {
    var d = a.data;
    d = d.replace(/\$\{([^}]*)\}/g, "\uf001$$$1\uf002");
    d = d.split(/\uF001|\uF002/);
    if(d.length > 1) {
      d.forEach(function(b) {
        if(!(b === null || b === undefined || b === "")) {
          if(b.charAt(0) === "$") {
            b = this.envEval(b.slice(1), c, a.data)
          }if(b === null) {
            b = "null"
          }if(b === undefined) {
            b = "undefined"
          }if(typeof b.cloneNode !== "function") {
            b = a.ownerDocument.createTextNode(b.toString())
          }a.parentNode.insertBefore(b, a)
        }
      }, this);
      a.parentNode.removeChild(a)
    }
  };
  g.prototype.stripBraces = function(a) {
    if(!a.match(/\$\{.*\}/g)) {
      this.handleError("Expected " + a + " to match ${...}");
      return a
    }return a.slice(2, -1)
  };
  g.prototype.property = function(a, c, d) {
    this.scope.push(a);
    try {
      if(typeof a === "string") {
        a = a.split(".")
      }var b = c[a[0]];
      if(a.length === 1) {
        if(d !== undefined) {
          c[a[0]] = d
        }if(typeof b === "function") {
          return function() {
            return b.apply(c, arguments)
          }
        }return b
      }if(!b) {
        this.handleError("Can't find path=" + a);
        return null
      }return this.property(a.slice(1), b, d)
    }finally {
      this.scope.pop()
    }
  };
  g.prototype.envEval = function(a, c, d) {
    with(c) {
      try {
        this.scope.push(d);
        return eval(a)
      }catch(b) {
        this.handleError("Template error evaluating '" + a + "'", b);
        return a
      }finally {
        this.scope.pop()
      }
    }
  };
  g.prototype.handleError = function(a, c) {
    this.logError(a);
    this.logError("In: " + this.scope.join(" > "));
    c && this.logError(c)
  };
  g.prototype.logError = function(a) {
    console.log(a)
  };
  q.Templater = g
});