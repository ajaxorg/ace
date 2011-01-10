define(function(j, h) {
  function n(a) {
    for(var b = 0;b < a.length;++b) {
      var c = a[b];
      if(typeof c == "object") {
        a[b] = "#object"
      }else {
        if(typeof c == "function") {
          a[b] = "#function"
        }else {
          if(typeof c == "string") {
            a[b] = '"' + c + '"'
          }
        }
      }
    }return a.join(",")
  }
  function k() {
  }
  var l = j("pilot/useragent"), i = j("pilot/console"), o = function() {
    return l.isGecko ? "firefox" : l.isOpera ? "opera" : "other"
  }(), p = {chrome:function(a) {
    var b = a.stack;
    if(!b) {
      i.log(a);
      return[]
    }return b.replace(/^.*?\n/, "").replace(/^.*?\n/, "").replace(/^.*?\n/, "").replace(/^[^\(]+?[\n$]/gm, "").replace(/^\s+at\s+/gm, "").replace(/^Object.<anonymous>\s*\(/gm, "{anonymous}()@").split("\n")
  }, firefox:function(a) {
    var b = a.stack;
    if(!b) {
      i.log(a);
      return[]
    }b = b.replace(/(?:\n@:0)?\s+$/m, "");
    b = b.replace(/^\(/gm, "{anonymous}(");
    return b.split("\n")
  }, opera:function(a) {
    a = a.message.split("\n");
    var b = /Line\s+(\d+).*?script\s+(http\S+)(?:.*?in\s+function\s+(\S+))?/i, c, d, e;
    c = 4;
    d = 0;
    for(e = a.length;c < e;c += 2) {
      if(b.test(a[c])) {
        a[d++] = (RegExp.$3 ? RegExp.$3 + "()@" + RegExp.$2 + RegExp.$1 : "{anonymous}()@" + RegExp.$2 + ":" + RegExp.$1) + " -- " + a[c + 1].replace(/^\s+/, "")
      }
    }a.splice(d, a.length - d);
    return a
  }, other:function(a) {
    for(var b = /function\s*([\w\-$]+)?\s*\(/i, c = [], d = 0, e, f;a && c.length < 10;) {
      e = b.test(a.toString()) ? RegExp.$1 || "{anonymous}" : "{anonymous}";
      f = Array.prototype.slice.call(a.arguments);
      c[d++] = e + "(" + n(f) + ")";
      if(a === a.caller && window.opera) {
        break
      }a = a.caller
    }return c
  }};
  k.prototype = {sourceCache:{}, ajax:function(a) {
    var b = this.createXMLHTTPObject();
    if(b) {
      b.open("GET", a, false);
      b.setRequestHeader("User-Agent", "XMLHTTP/1.0");
      b.send("");
      return b.responseText
    }
  }, createXMLHTTPObject:function() {
    for(var a, b = [function() {
      return new XMLHttpRequest
    }, function() {
      return new ActiveXObject("Msxml2.XMLHTTP")
    }, function() {
      return new ActiveXObject("Msxml3.XMLHTTP")
    }, function() {
      return new ActiveXObject("Microsoft.XMLHTTP")
    }], c = 0;c < b.length;c++) {
      try {
        a = b[c]();
        this.createXMLHTTPObject = b[c];
        return a
      }catch(d) {
      }
    }
  }, getSource:function(a) {
    a in this.sourceCache || (this.sourceCache[a] = this.ajax(a).split("\n"));
    return this.sourceCache[a]
  }, guessFunctions:function(a) {
    for(var b = 0;b < a.length;++b) {
      var c = a[b], d = /{anonymous}\(.*\)@(\w+:\/\/([-\w\.]+)+(:\d+)?[^:]+):(\d+):?(\d+)?/.exec(c);
      if(d) {
        var e = d[1];
        d = d[4];
        if(e && d) {
          e = this.guessFunctionName(e, d);
          a[b] = c.replace("{anonymous}", e)
        }
      }
    }return a
  }, guessFunctionName:function(a, b) {
    try {
      return this.guessFunctionNameFromLines(b, this.getSource(a))
    }catch(c) {
      return"getSource failed with url: " + a + ", exception: " + c.toString()
    }
  }, guessFunctionNameFromLines:function(a, b) {
    for(var c = /function ([^(]*)\(([^)]*)\)/, d = /['"]?([0-9A-Za-z_]+)['"]?\s*[:=]\s*(function|eval|new Function)/, e = "", f = 0;f < 10;++f) {
      e = b[a - f] + e;
      if(e !== undefined) {
        var g = d.exec(e);
        if(g) {
          return g[1]
        }else {
          g = c.exec(e)
        }if(g && g[1]) {
          return g[1]
        }
      }
    }return"(?)"
  }};
  var q = new k, m = [/http:\/\/localhost:4020\/sproutcore.js:/];
  h.ignoreFramesMatching = function(a) {
    m.push(a)
  };
  h.Trace = function(a, b) {
    this._ex = a;
    this._stack = p[o](a);
    if(b) {
      this._stack = q.guessFunctions(this._stack)
    }
  };
  h.Trace.prototype.log = function(a) {
    if(a <= 0) {
      a = 999999999
    }for(var b = 0, c = 0;c < this._stack.length && b < a;c++) {
      var d = this._stack[c], e = true;
      m.forEach(function(f) {
        if(f.test(d)) {
          e = false
        }
      });
      if(e) {
        i.debug(d);
        b++
      }
    }
  }
});