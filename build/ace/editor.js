define("pilot/oop", ["require", "exports", "module"], function(i, g) {
  g.inherits = function(l, e) {
    var j = function() {
    };
    j.prototype = e.prototype;
    l.super_ = e.prototype;
    l.prototype = new j;
    l.prototype.constructor = l
  };
  g.mixin = function(l, e) {
    for(var j in e) {
      l[j] = e[j]
    }
  };
  g.implement = function(l, e) {
    g.mixin(l, e)
  }
});
define("pilot/useragent", ["require", "exports", "module"], function(i, g) {
  i = (navigator.platform.match(/mac|win|linux/i) || ["other"])[0].toLowerCase();
  var l = navigator.userAgent;
  g.isWin = i == "win";
  g.isMac = i == "mac";
  g.isLinux = i == "linux";
  g.isIE = !+"\u000b1";
  g.isGecko = g.isMozilla = window.controllers && window.navigator.product === "Gecko";
  g.isOpera = window.opera && Object.prototype.toString.call(window.opera) == "[object Opera]";
  g.isWebKit = parseFloat(l.split("WebKit/")[1]) || undefined;
  g.isAIR = l.indexOf("AdobeAIR") >= 0;
  g.OS = {LINUX:"LINUX", MAC:"MAC", WINDOWS:"WINDOWS"};
  g.getOS = function() {
    return g.isMac ? g.OS.MAC : g.isLinux ? g.OS.LINUX : g.OS.WINDOWS
  }
});
define("pilot/event", ["require", "exports", "module", "pilot/useragent"], function(i, g) {
  var l = i("pilot/useragent");
  g.addListener = function(e, j, o) {
    if(e.addEventListener) {
      return e.addEventListener(j, o, false)
    }if(e.attachEvent) {
      var d = function() {
        o(window.event)
      };
      o._wrapper = d;
      e.attachEvent("on" + j, d)
    }
  };
  g.removeListener = function(e, j, o) {
    if(e.removeEventListener) {
      return e.removeEventListener(j, o, false)
    }if(e.detachEvent) {
      e.detachEvent("on" + j, o._wrapper || o)
    }
  };
  g.stopEvent = function(e) {
    g.stopPropagation(e);
    g.preventDefault(e);
    return false
  };
  g.stopPropagation = function(e) {
    if(e.stopPropagation) {
      e.stopPropagation()
    }else {
      e.cancelBubble = true
    }
  };
  g.preventDefault = function(e) {
    if(e.preventDefault) {
      e.preventDefault()
    }else {
      e.returnValue = false
    }
  };
  g.getDocumentX = function(e) {
    return e.clientX ? e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft) : e.pageX
  };
  g.getDocumentY = function(e) {
    return e.clientY ? e.clientY + (document.documentElement.scrollTop || document.body.scrollTop) : e.pageX
  };
  g.getButton = function(e) {
    return e.preventDefault ? e.button : Math.max(e.button - 1, 2)
  };
  g.capture = document.documentElement.setCapture ? function(e, j, o) {
    function d(k) {
      j && j(k);
      o && o();
      g.removeListener(e, "mousemove", j);
      g.removeListener(e, "mouseup", d);
      g.removeListener(e, "losecapture", d);
      e.releaseCapture()
    }
    g.addListener(e, "mousemove", j);
    g.addListener(e, "mouseup", d);
    g.addListener(e, "losecapture", d);
    e.setCapture()
  } : function(e, j, o) {
    function d(a) {
      j(a);
      a.stopPropagation()
    }
    function k(a) {
      j && j(a);
      o && o();
      document.removeEventListener("mousemove", d, true);
      document.removeEventListener("mouseup", k, true);
      a.stopPropagation()
    }
    document.addEventListener("mousemove", d, true);
    document.addEventListener("mouseup", k, true)
  };
  g.addMouseWheelListener = function(e, j) {
    var o = function(d) {
      if(d.wheelDelta !== undefined) {
        if(d.wheelDeltaX !== undefined) {
          d.wheelX = -d.wheelDeltaX / 8;
          d.wheelY = -d.wheelDeltaY / 8
        }else {
          d.wheelX = 0;
          d.wheelY = -d.wheelDelta / 8
        }
      }else {
        if(d.axis && d.axis == d.HORIZONTAL_AXIS) {
          d.wheelX = (d.detail || 0) * 5;
          d.wheelY = 0
        }else {
          d.wheelX = 0;
          d.wheelY = (d.detail || 0) * 5
        }
      }j(d)
    };
    g.addListener(e, "DOMMouseScroll", o);
    g.addListener(e, "mousewheel", o)
  };
  g.addMultiMouseDownListener = function(e, j, o, d, k) {
    var a = 0, f, h, m = function(b) {
      a += 1;
      if(a == 1) {
        f = b.clientX;
        h = b.clientY;
        setTimeout(function() {
          a = 0
        }, d || 600)
      }if(g.getButton(b) != j || Math.abs(b.clientX - f) > 5 || Math.abs(b.clientY - h) > 5) {
        a = 0
      }if(a == o) {
        a = 0;
        k(b)
      }return g.preventDefault(b)
    };
    g.addListener(e, "mousedown", m);
    l.isIE && g.addListener(e, "dblclick", m)
  };
  g.addKeyListener = function(e, j) {
    var o = null;
    g.addListener(e, "keydown", function(d) {
      o = d.keyIdentifier || d.keyCode;
      return j(d)
    });
    if(l.isMac && (l.isGecko || l.isOpera)) {
      g.addListener(e, "keypress", function(d) {
        if(o !== (d.keyIdentifier || d.keyCode)) {
          return j(d)
        }else {
          o = null
        }
      })
    }
  }
});
define("pilot/lang", ["require", "exports", "module"], function(i, g) {
  g.stringReverse = function(l) {
    return l.split("").reverse().join("")
  };
  g.stringRepeat = function(l, e) {
    return(new Array(e + 1)).join(l)
  };
  g.copyObject = function(l) {
    var e = {};
    for(var j in l) {
      e[j] = l[j]
    }return e
  };
  g.arrayToMap = function(l) {
    for(var e = {}, j = 0;j < l.length;j++) {
      e[l[j]] = 1
    }return e
  };
  g.arrayRemove = function(l, e) {
    for(var j = 0;j <= l.length;j++) {
      e === l[j] && l.splice(j, 1)
    }
  };
  g.escapeRegExp = function(l) {
    return l.replace(/([.*+?^${}()|[\]\/\\])/g, "\\$1")
  };
  g.deferredCall = function(l) {
    var e = null, j = function() {
      e = null;
      l()
    };
    return{schedule:function() {
      e || (e = setTimeout(j, 0))
    }, call:function() {
      this.cancel();
      l()
    }, cancel:function() {
      clearTimeout(e);
      e = null
    }}
  }
});
define("ace/textinput", ["require", "exports", "module", "pilot/event"], function(i, g) {
  var l = i("pilot/event");
  g.TextInput = function(e, j) {
    function o() {
      if(!h) {
        var c = d.value;
        if(c) {
          if(c.charCodeAt(c.length - 1) == a.charCodeAt(0)) {
            (c = c.slice(0, -1)) && j.onTextInput(c)
          }else {
            j.onTextInput(c)
          }
        }
      }h = false;
      d.value = a;
      d.select()
    }
    var d = document.createElement("textarea"), k = d.style;
    k.position = "absolute";
    k.left = "-10000px";
    k.top = "-10000px";
    e.appendChild(d);
    var a = String.fromCharCode(0);
    o();
    var f = false, h = false, m = function() {
      setTimeout(function() {
        f || o()
      }, 0)
    }, b = function() {
      j.onCompositionUpdate(d.value)
    };
    l.addListener(d, "keypress", m);
    l.addListener(d, "textInput", m);
    l.addListener(d, "paste", m);
    l.addListener(d, "propertychange", m);
    l.addListener(d, "copy", function() {
      h = true;
      d.value = j.getCopyText();
      d.select();
      h = true;
      setTimeout(o, 0)
    });
    l.addListener(d, "cut", function() {
      h = true;
      d.value = j.getCopyText();
      j.onCut();
      d.select();
      setTimeout(o, 0)
    });
    l.addListener(d, "compositionstart", function() {
      f = true;
      o();
      d.value = "";
      j.onCompositionStart();
      setTimeout(b, 0)
    });
    l.addListener(d, "compositionupdate", b);
    l.addListener(d, "compositionend", function() {
      f = false;
      j.onCompositionEnd();
      m()
    });
    l.addListener(d, "blur", function() {
      j.onBlur()
    });
    l.addListener(d, "focus", function() {
      j.onFocus();
      d.select()
    });
    this.focus = function() {
      j.onFocus();
      d.select();
      d.focus()
    };
    this.blur = function() {
      d.blur()
    }
  }
});
define("ace/conf/keybindings/default_mac", ["require", "exports", "module"], function(i, g) {
  g.bindings = {selectall:"Command-A", removeline:"Command-D", gotoline:"Command-L", togglecomment:"Command-7", findnext:"Command-K", findprevious:"Command-Shift-K", find:"Command-F", replace:"Command-R", undo:"Command-Z", redo:"Command-Shift-Z|Command-Y", overwrite:"Insert", copylinesup:"Command-Option-Up", movelinesup:"Option-Up", selecttostart:"Command-Shift-Up", gotostart:"Command-Home|Command-Up", selectup:"Shift-Up", golineup:"Up", copylinesdown:"Command-Option-Down", movelinesdown:"Option-Down", 
  selecttoend:"Command-Shift-Down", gotoend:"Command-End|Command-Down", selectdown:"Shift-Down", godown:"Down", selectwordleft:"Option-Shift-Left", gotowordleft:"Option-Left", selecttolinestart:"Command-Shift-Left", gotolinestart:"Command-Left|Home", selectleft:"Shift-Left", gotoleft:"Left", selectwordright:"Option-Shift-Right", gotowordright:"Option-Right", selecttolineend:"Command-Shift-Right", gotolineend:"Command-Right|End", selectright:"Shift-Right", gotoright:"Right", selectpagedown:"Shift-PageDown", 
  pagedown:"PageDown", selectpageup:"Shift-PageUp", pageup:"PageUp", selectlinestart:"Shift-Home", selectlineend:"Shift-End", del:"Delete", backspace:"Ctrl-Backspace|Command-Backspace|Option-Backspace|Backspace", outdent:"Shift-Tab", indent:"Tab"}
});
define("ace/conf/keybindings/default_win", ["require", "exports", "module"], function(i, g) {
  g.bindings = {selectall:"Ctrl-A", removeline:"Ctrl-D", gotoline:"Ctrl-L", togglecomment:"Ctrl-7", findnext:"Ctrl-K", findprevious:"Ctrl-Shift-K", find:"Ctrl-F", replace:"Ctrl-R", undo:"Ctrl-Z", redo:"Ctrl-Shift-Z|Ctrl-Y", overwrite:"Insert", copylinesup:"Ctrl-Alt-Up", movelinesup:"Alt-Up", selecttostart:"Alt-Shift-Up", gotostart:"Ctrl-Home|Ctrl-Up", selectup:"Shift-Up", golineup:"Up", copylinesdown:"Ctrl-Alt-Down", movelinesdown:"Alt-Down", selecttoend:"Alt-Shift-Down", gotoend:"Ctrl-End|Ctrl-Down", 
  selectdown:"Shift-Down", godown:"Down", selectwordleft:"Ctrl-Shift-Left", gotowordleft:"Ctrl-Left", selecttolinestart:"Alt-Shift-Left", gotolinestart:"Alt-Left|Home", selectleft:"Shift-Left", gotoleft:"Left", selectwordright:"Ctrl-Shift-Right", gotowordright:"Ctrl-Right", selecttolineend:"Alt-Shift-Right", gotolineend:"Alt-Right|End", selectright:"Shift-Right", gotoright:"Right", selectpagedown:"Shift-PageDown", pagedown:"PageDown", selectpageup:"Shift-PageUp", pageup:"PageUp", selectlinestart:"Shift-Home", 
  selectlineend:"Shift-End", del:"Delete", backspace:"Backspace", outdent:"Shift-Tab", indent:"Tab"}
});
define("pilot/console", ["require", "exports", "module"], function(i, g) {
  var l = function() {
  };
  i = ["assert", "count", "debug", "dir", "dirxml", "error", "group", "groupEnd", "info", "log", "profile", "profileEnd", "time", "timeEnd", "trace", "warn"];
  typeof window === "undefined" ? i.forEach(function(e) {
    g[e] = function() {
      var j = Array.prototype.slice.call(arguments);
      postMessage(JSON.stringify({op:"log", method:e, args:j}))
    }
  }) : i.forEach(function(e) {
    g[e] = window.console && window.console[e] ? Function.prototype.bind.call(window.console[e], window.console) : l
  })
});
define("pilot/stacktrace", ["require", "exports", "module", "pilot/useragent", "pilot/console"], function(i, g) {
  function l(h) {
    for(var m = 0;m < h.length;++m) {
      var b = h[m];
      if(typeof b == "object") {
        h[m] = "#object"
      }else {
        if(typeof b == "function") {
          h[m] = "#function"
        }else {
          if(typeof b == "string") {
            h[m] = '"' + b + '"'
          }
        }
      }
    }return h.join(",")
  }
  function e() {
  }
  var j = i("pilot/useragent"), o = i("pilot/console"), d = function() {
    return j.isGecko ? "firefox" : j.isOpera ? "opera" : "other"
  }(), k = {chrome:function(h) {
    var m = h.stack;
    if(!m) {
      o.log(h);
      return[]
    }return m.replace(/^.*?\n/, "").replace(/^.*?\n/, "").replace(/^.*?\n/, "").replace(/^[^\(]+?[\n$]/gm, "").replace(/^\s+at\s+/gm, "").replace(/^Object.<anonymous>\s*\(/gm, "{anonymous}()@").split("\n")
  }, firefox:function(h) {
    var m = h.stack;
    if(!m) {
      o.log(h);
      return[]
    }m = m.replace(/(?:\n@:0)?\s+$/m, "");
    m = m.replace(/^\(/gm, "{anonymous}(");
    return m.split("\n")
  }, opera:function(h) {
    h = h.message.split("\n");
    var m = /Line\s+(\d+).*?script\s+(http\S+)(?:.*?in\s+function\s+(\S+))?/i, b, c, n;
    b = 4;
    c = 0;
    for(n = h.length;b < n;b += 2) {
      if(m.test(h[b])) {
        h[c++] = (RegExp.$3 ? RegExp.$3 + "()@" + RegExp.$2 + RegExp.$1 : "{anonymous}()@" + RegExp.$2 + ":" + RegExp.$1) + " -- " + h[b + 1].replace(/^\s+/, "")
      }
    }h.splice(c, h.length - c);
    return h
  }, other:function(h) {
    for(var m = /function\s*([\w\-$]+)?\s*\(/i, b = [], c = 0, n, p;h && b.length < 10;) {
      n = m.test(h.toString()) ? RegExp.$1 || "{anonymous}" : "{anonymous}";
      p = Array.prototype.slice.call(h.arguments);
      b[c++] = n + "(" + l(p) + ")";
      if(h === h.caller && window.opera) {
        break
      }h = h.caller
    }return b
  }};
  e.prototype = {sourceCache:{}, ajax:function(h) {
    var m = this.createXMLHTTPObject();
    if(m) {
      m.open("GET", h, false);
      m.setRequestHeader("User-Agent", "XMLHTTP/1.0");
      m.send("");
      return m.responseText
    }
  }, createXMLHTTPObject:function() {
    for(var h, m = [function() {
      return new XMLHttpRequest
    }, function() {
      return new ActiveXObject("Msxml2.XMLHTTP")
    }, function() {
      return new ActiveXObject("Msxml3.XMLHTTP")
    }, function() {
      return new ActiveXObject("Microsoft.XMLHTTP")
    }], b = 0;b < m.length;b++) {
      try {
        h = m[b]();
        this.createXMLHTTPObject = m[b];
        return h
      }catch(c) {
      }
    }
  }, getSource:function(h) {
    h in this.sourceCache || (this.sourceCache[h] = this.ajax(h).split("\n"));
    return this.sourceCache[h]
  }, guessFunctions:function(h) {
    for(var m = 0;m < h.length;++m) {
      var b = h[m], c = /{anonymous}\(.*\)@(\w+:\/\/([-\w\.]+)+(:\d+)?[^:]+):(\d+):?(\d+)?/.exec(b);
      if(c) {
        var n = c[1];
        c = c[4];
        if(n && c) {
          n = this.guessFunctionName(n, c);
          h[m] = b.replace("{anonymous}", n)
        }
      }
    }return h
  }, guessFunctionName:function(h, m) {
    try {
      return this.guessFunctionNameFromLines(m, this.getSource(h))
    }catch(b) {
      return"getSource failed with url: " + h + ", exception: " + b.toString()
    }
  }, guessFunctionNameFromLines:function(h, m) {
    for(var b = /function ([^(]*)\(([^)]*)\)/, c = /['"]?([0-9A-Za-z_]+)['"]?\s*[:=]\s*(function|eval|new Function)/, n = "", p = 0;p < 10;++p) {
      n = m[h - p] + n;
      if(n !== undefined) {
        var r = c.exec(n);
        if(r) {
          return r[1]
        }else {
          r = b.exec(n)
        }if(r && r[1]) {
          return r[1]
        }
      }
    }return"(?)"
  }};
  var a = new e, f = [/http:\/\/localhost:4020\/sproutcore.js:/];
  g.ignoreFramesMatching = function(h) {
    f.push(h)
  };
  g.Trace = function(h, m) {
    this._ex = h;
    this._stack = k[d](h);
    if(m) {
      this._stack = a.guessFunctions(this._stack)
    }
  };
  g.Trace.prototype.log = function(h) {
    if(h <= 0) {
      h = 999999999
    }for(var m = 0, b = 0;b < this._stack.length && m < h;b++) {
      var c = this._stack[b], n = true;
      f.forEach(function(p) {
        if(p.test(c)) {
          n = false
        }
      });
      if(n) {
        o.debug(c);
        m++
      }
    }
  }
});
define("pilot/event_emitter", ["require", "exports", "module"], function(i, g) {
  i = {};
  i._dispatchEvent = function(l, e) {
    this._eventRegistry = this._eventRegistry || {};
    var j = this._eventRegistry[l];
    if(j && j.length) {
      e = e || {};
      e.type = l;
      for(l = 0;l < j.length;l++) {
        j[l](e)
      }
    }
  };
  i.on = i.addEventListener = function(l, e) {
    this._eventRegistry = this._eventRegistry || {};
    var j = this._eventRegistry[l];
    j || (j = this._eventRegistry[l] = []);
    j.indexOf(e) == -1 && j.push(e)
  };
  i.removeEventListener = function(l, e) {
    this._eventRegistry = this._eventRegistry || {};
    if(l = this._eventRegistry[l]) {
      e = l.indexOf(e);
      e !== -1 && l.splice(e, 1)
    }
  };
  g.EventEmitter = i
});
define("pilot/catalog", ["require", "exports", "module"], function(i, g) {
  var l = {};
  g.addExtensionSpec = function(e) {
    l[e.name] = e
  };
  g.removeExtensionSpec = function(e) {
    if(typeof e === "string") {
      delete l[e]
    }else {
      delete l[e.name]
    }
  };
  g.getExtensionSpec = function(e) {
    return l[e]
  };
  g.getExtensionSpecs = function() {
    return Object.keys(l)
  }
});
define("pilot/types", ["require", "exports", "module"], function(i, g) {
  function l(k, a, f, h) {
    this.value = k;
    this.status = a || o.VALID;
    this.message = f;
    this.predictions = h || []
  }
  function e() {
  }
  function j(k, a) {
    k = d[k];
    if(typeof k === "function") {
      k = new k(a)
    }return k
  }
  var o = {VALID:{toString:function() {
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
    for(var k = o.VALID, a = 0;a < arguments;a++) {
      if(arguments[a] > k) {
        k = arguments[a]
      }
    }return k
  }};
  g.Status = o;
  g.Conversion = l;
  e.prototype = {stringify:function() {
    throw new Error("not implemented");
  }, parse:function() {
    throw new Error("not implemented");
  }, name:undefined, increment:function() {
  }, decrement:function() {
  }};
  g.Type = e;
  var d = {};
  g.registerType = function(k) {
    if(typeof k === "object") {
      if(k instanceof e) {
        if(!k.name) {
          throw new Error("All registered types must have a name");
        }d[k.name] = k
      }else {
        throw new Error("Can't registerType using: " + k);
      }
    }else {
      if(typeof k === "function") {
        if(!k.prototype.name) {
          throw new Error("All registered types must have a name");
        }d[k.prototype.name] = k
      }else {
        throw new Error("Unknown type: " + k);
      }
    }
  };
  g.deregisterType = function(k) {
    delete d[k.name]
  };
  g.getType = function(k) {
    if(typeof k === "string") {
      return j(k, k)
    }if(typeof k == "object") {
      if(!k.name) {
        throw new Error("Missing 'name' member to typeSpec");
      }return j(k.name, k)
    }throw new Error("Can't extract type from " + k);
  }
});
define("pilot/canon", ["require", "exports", "module", "pilot/console", "pilot/stacktrace", "pilot/oop", "pilot/event_emitter", "pilot/catalog", "pilot/types", "pilot/types", "pilot/lang"], function(i, g) {
  function l(q) {
    if(!q.name) {
      throw new Error("All registered commands must have a name");
    }if(q.params == null) {
      q.params = []
    }if(!Array.isArray(q.params)) {
      throw new Error("command.params must be an array in " + q.name);
    }q.params.forEach(function(s) {
      if(!s.name) {
        throw new Error("In " + q.name + ": all params must have a name");
      }e(q.name, s)
    }, this);
    p[q.name] = q;
    r.push(q.name);
    r.sort()
  }
  function e(q, s) {
    var u = s.type;
    s.type = b.getType(u);
    if(s.type == null) {
      throw new Error("In " + q + "/" + s.name + ": can't find type for: " + JSON.stringify(u));
    }
  }
  function j(q) {
    q = typeof q === "string" ? q : q.name;
    delete p[q];
    c.arrayRemove(r, q)
  }
  function o(q) {
    return p[q]
  }
  function d() {
    return r
  }
  function k(q, s, u, x) {
    if(typeof q === "string") {
      q = p[q]
    }if(!q) {
      return false
    }x = new a({command:q, args:u, typed:x});
    q.exec(s, u || {}, x);
    return true
  }
  function a(q) {
    q = q || {};
    this.command = q.command;
    this.args = q.args;
    this.typed = q.typed;
    this._begunOutput = false;
    this.start = new Date;
    this.end = null;
    this.error = this.completed = false
  }
  i("pilot/console");
  i("pilot/stacktrace");
  var f = i("pilot/oop"), h = i("pilot/event_emitter").EventEmitter, m = i("pilot/catalog");
  i("pilot/types");
  var b = i("pilot/types"), c = i("pilot/lang"), n = {name:"command", description:"A command is a bit of functionality with optional typed arguments which can do something small like moving the cursor around the screen, or large like cloning a project from VCS.", indexOn:"name"};
  g.startup = function() {
    m.addExtensionSpec(n)
  };
  g.shutdown = function() {
    m.removeExtensionSpec(n)
  };
  var p = {}, r = [];
  g.removeCommand = j;
  g.addCommand = l;
  g.getCommand = o;
  g.getCommandNames = d;
  g.exec = k;
  g.upgradeType = e;
  f.implement(g, h);
  var t = [];
  f.implement(a.prototype, h);
  a.prototype._beginOutput = function() {
    this._begunOutput = true;
    this.outputs = [];
    for(t.push(this);t.length > 100;) {
      t.shiftObject()
    }g._dispatchEvent("output", {requests:t, request:this})
  };
  a.prototype.doneWithError = function(q) {
    this.error = true;
    this.done(q)
  };
  a.prototype.async = function() {
    this._begunOutput || this._beginOutput()
  };
  a.prototype.output = function(q) {
    this._begunOutput || this._beginOutput();
    if(typeof q !== "string" && !(q instanceof Node)) {
      q = q.toString()
    }this.outputs.push(q);
    this._dispatchEvent("output", {});
    return this
  };
  a.prototype.done = function(q) {
    this.completed = true;
    this.end = new Date;
    this.duration = this.end.getTime() - this.start.getTime();
    q && this.output(q);
    this._dispatchEvent("output", {})
  };
  g.Request = a
});
define("ace/commands/default_commands", ["require", "exports", "module", "pilot/canon"], function(i) {
  i = i("pilot/canon");
  i.addCommand({name:"selectall", exec:function(g) {
    g.editor.getSelection().selectAll()
  }});
  i.addCommand({name:"removeline", exec:function(g) {
    g.editor.removeLines()
  }});
  i.addCommand({name:"gotoline", exec:function(g) {
    var l = parseInt(prompt("Enter line number:"));
    isNaN(l) || g.editor.gotoLine(l)
  }});
  i.addCommand({name:"togglecomment", exec:function(g) {
    g.editor.toggleCommentLines()
  }});
  i.addCommand({name:"findnext", exec:function(g) {
    g.editor.findNext()
  }});
  i.addCommand({name:"findprevious", exec:function(g) {
    g.editor.findPrevious()
  }});
  i.addCommand({name:"find", exec:function(g) {
    var l = prompt("Find:");
    g.editor.find(l)
  }});
  i.addCommand({name:"undo", exec:function(g) {
    g.editor.undo()
  }});
  i.addCommand({name:"redo", exec:function(g) {
    g.editor.redo()
  }});
  i.addCommand({name:"redo", exec:function(g) {
    g.editor.redo()
  }});
  i.addCommand({name:"overwrite", exec:function(g) {
    g.editor.toggleOverwrite()
  }});
  i.addCommand({name:"copylinesup", exec:function(g) {
    g.editor.copyLinesUp()
  }});
  i.addCommand({name:"movelinesup", exec:function(g) {
    g.editor.moveLinesUp()
  }});
  i.addCommand({name:"selecttostart", exec:function(g) {
    g.editor.getSelection().selectFileStart()
  }});
  i.addCommand({name:"gotostart", exec:function(g) {
    g.editor.navigateFileStart()
  }});
  i.addCommand({name:"selectup", exec:function(g) {
    g.editor.getSelection().selectUp()
  }});
  i.addCommand({name:"golineup", exec:function(g) {
    g.editor.navigateUp()
  }});
  i.addCommand({name:"copylinesdown", exec:function(g) {
    g.editor.copyLinesDown()
  }});
  i.addCommand({name:"movelinesdown", exec:function(g) {
    g.editor.moveLinesDown()
  }});
  i.addCommand({name:"selecttoend", exec:function(g) {
    g.editor.getSelection().selectFileEnd()
  }});
  i.addCommand({name:"gotoend", exec:function(g) {
    g.editor.navigateFileEnd()
  }});
  i.addCommand({name:"selectdown", exec:function(g) {
    g.editor.getSelection().selectDown()
  }});
  i.addCommand({name:"godown", exec:function(g) {
    g.editor.navigateDown()
  }});
  i.addCommand({name:"selectwordleft", exec:function(g) {
    g.editor.getSelection().selectWordLeft()
  }});
  i.addCommand({name:"gotowordleft", exec:function(g) {
    g.editor.navigateWordLeft()
  }});
  i.addCommand({name:"selecttolinestart", exec:function(g) {
    g.editor.getSelection().selectLineStart()
  }});
  i.addCommand({name:"gotolinestart", exec:function(g) {
    g.editor.navigateLineStart()
  }});
  i.addCommand({name:"selectleft", exec:function(g) {
    g.editor.getSelection().selectLeft()
  }});
  i.addCommand({name:"gotoleft", exec:function(g) {
    g.editor.navigateLeft()
  }});
  i.addCommand({name:"selectwordright", exec:function(g) {
    g.editor.getSelection().selectWordRight()
  }});
  i.addCommand({name:"gotowordright", exec:function(g) {
    g.editor.navigateWordRight()
  }});
  i.addCommand({name:"selecttolineend", exec:function(g) {
    g.editor.getSelection().selectLineEnd()
  }});
  i.addCommand({name:"gotolineend", exec:function(g) {
    g.editor.navigateLineEnd()
  }});
  i.addCommand({name:"selectright", exec:function(g) {
    g.editor.getSelection().selectRight()
  }});
  i.addCommand({name:"gotoright", exec:function(g) {
    g.editor.navigateRight()
  }});
  i.addCommand({name:"selectpagedown", exec:function(g) {
    g.editor.selectPageDown()
  }});
  i.addCommand({name:"pagedown", exec:function(g) {
    g.editor.scrollPageDown()
  }});
  i.addCommand({name:"gotopagedown", exec:function(g) {
    g.editor.gotoPageDown()
  }});
  i.addCommand({name:"selectpageup", exec:function(g) {
    g.editor.selectPageUp()
  }});
  i.addCommand({name:"pageup", exec:function(g) {
    g.editor.scrollPageUp()
  }});
  i.addCommand({name:"gotopageup", exec:function(g) {
    g.editor.gotoPageUp()
  }});
  i.addCommand({name:"selectlinestart", exec:function(g) {
    g.editor.getSelection().selectLineStart()
  }});
  i.addCommand({name:"gotolinestart", exec:function(g) {
    g.editor.navigateLineStart()
  }});
  i.addCommand({name:"selectlineend", exec:function(g) {
    g.editor.getSelection().selectLineEnd()
  }});
  i.addCommand({name:"gotolineend", exec:function(g) {
    g.editor.navigateLineEnd()
  }});
  i.addCommand({name:"del", exec:function(g) {
    g.editor.removeRight()
  }});
  i.addCommand({name:"backspace", exec:function(g) {
    g.editor.removeLeft()
  }});
  i.addCommand({name:"outdent", exec:function(g) {
    g.editor.blockOutdent()
  }});
  i.addCommand({name:"indent", exec:function(g) {
    g.editor.indent()
  }})
});
define("ace/keybinding", ["require", "exports", "module", "pilot/useragent", "pilot/event", "ace/conf/keybindings/default_mac", "ace/conf/keybindings/default_win", "pilot/canon", "ace/commands/default_commands"], function(i, g) {
  var l = i("pilot/useragent"), e = i("pilot/event"), j = i("ace/conf/keybindings/default_mac").bindings, o = i("ace/conf/keybindings/default_win").bindings, d = i("pilot/canon");
  i("ace/commands/default_commands");
  i = function(k, a, f) {
    this.setConfig(f);
    var h = this;
    e.addKeyListener(k, function(m) {
      var b = (h.config.reverse[l.isOpera && l.isMac ? 0 | (m.metaKey ? 1 : 0) | (m.altKey ? 2 : 0) | (m.shiftKey ? 4 : 0) | (m.ctrlKey ? 8 : 0) : 0 | (m.ctrlKey ? 1 : 0) | (m.altKey ? 2 : 0) | (m.shiftKey ? 4 : 0) | (m.metaKey ? 8 : 0)] || {})[(h.keyNames[m.keyCode] || String.fromCharCode(m.keyCode)).toLowerCase()];
      if(d.exec(b, {editor:a})) {
        return e.stopEvent(m)
      }
    })
  };
  (function() {
    function k(h, m, b, c) {
      return(c && h.toLowerCase() || h).replace(/(?:^\s+|\n|\s+$)/g, "").split(new RegExp("[\\s ]*" + m + "[\\s ]*", "g"), b || 999)
    }
    function a(h, m, b) {
      var c, n = 0;
      h = k(h, "\\-", null, true);
      for(var p = 0, r = h.length;p < r;++p) {
        if(this.keyMods[h[p]]) {
          n |= this.keyMods[h[p]]
        }else {
          c = h[p] || "-"
        }
      }(b[n] || (b[n] = {}))[c] = m;
      return b
    }
    function f(h, m) {
      var b, c, n, p, r = {};
      for(b in h) {
        p = h[b];
        if(m && typeof p == "string") {
          p = p.split(m);
          c = 0;
          for(n = p.length;c < n;++c) {
            a.call(this, p[c], b, r)
          }
        }else {
          a.call(this, p, b, r)
        }
      }return r
    }
    this.keyMods = {ctrl:1, alt:2, option:2, shift:4, meta:8, command:8};
    this.keyNames = {"8":"Backspace", "9":"Tab", "13":"Enter", "27":"Esc", "32":"Space", "33":"PageUp", "34":"PageDown", "35":"End", "36":"Home", "37":"Left", "38":"Up", "39":"Right", "40":"Down", "45":"Insert", "46":"Delete", "107":"+", "112":"F1", "113":"F2", "114":"F3", "115":"F4", "116":"F5", "117":"F6", "118":"F7", "119":"F8", "120":"F9", "121":"F10", "122":"F11", "123":"F12"};
    this.setConfig = function(h) {
      this.config = h || (l.isMac ? j : o);
      if(typeof this.config.reverse == "undefined") {
        this.config.reverse = f.call(this, this.config, "|")
      }
    }
  }).call(i.prototype);
  g.KeyBinding = i
});
define("ace/range", ["require", "exports", "module"], function(i, g) {
  var l = function(e, j, o, d) {
    this.start = {row:e, column:j};
    this.end = {row:o, column:d}
  };
  (function() {
    this.toString = function() {
      return"Range: [" + this.start.row + "/" + this.start.column + "] -> [" + this.end.row + "/" + this.end.column + "]"
    };
    this.contains = function(e, j) {
      return this.compare(e, j) == 0
    };
    this.compare = function(e, j) {
      if(!this.isMultiLine()) {
        if(e === this.start.row) {
          return j < this.start.column ? -1 : j > this.end.column ? 1 : 0
        }
      }if(e < this.start.row) {
        return-1
      }if(e > this.end.row) {
        return 1
      }if(this.start.row === e) {
        return j >= this.start.column ? 0 : -1
      }if(this.end.row === e) {
        return j <= this.end.column ? 0 : 1
      }return 0
    };
    this.clipRows = function(e, j) {
      if(this.end.row > j) {
        var o = {row:j + 1, column:0}
      }if(this.start.row > j) {
        var d = {row:j + 1, column:0}
      }if(this.start.row < e) {
        d = {row:e, column:0}
      }if(this.end.row < e) {
        o = {row:e, column:0}
      }return l.fromPoints(d || this.start, o || this.end)
    };
    this.extend = function(e, j) {
      var o = this.compare(e, j);
      if(o == 0) {
        return this
      }else {
        if(o == -1) {
          var d = {row:e, column:j}
        }else {
          var k = {row:e, column:j}
        }
      }return l.fromPoints(d || this.start, k || this.end)
    };
    this.isEmpty = function() {
      return this.start.row == this.end.row && this.start.column == this.end.column
    };
    this.isMultiLine = function() {
      return this.start.row !== this.end.row
    };
    this.clone = function() {
      return l.fromPoints(this.start, this.end)
    };
    this.collapseRows = function() {
      return this.end.column == 0 ? new l(this.start.row, 0, Math.max(this.start.row, this.end.row - 1), 0) : new l(this.start.row, 0, this.end.row, 0)
    };
    this.toScreenRange = function(e) {
      return new l(this.start.row, e.documentToScreenColumn(this.start.row, this.start.column), this.end.row, e.documentToScreenColumn(this.end.row, this.end.column))
    }
  }).call(l.prototype);
  l.fromPoints = function(e, j) {
    return new l(e.row, e.column, j.row, j.column)
  };
  g.Range = l
});
define("ace/selection", ["require", "exports", "module", "pilot/oop", "pilot/lang", "pilot/event_emitter", "ace/range"], function(i, g) {
  var l = i("pilot/oop"), e = i("pilot/lang"), j = i("pilot/event_emitter").EventEmitter, o = i("ace/range").Range;
  i = function(d) {
    this.doc = d;
    this.clearSelection();
    this.selectionLead = {row:0, column:0}
  };
  (function() {
    l.implement(this, j);
    this.isEmpty = function() {
      return!this.selectionAnchor || this.selectionAnchor.row == this.selectionLead.row && this.selectionAnchor.column == this.selectionLead.column
    };
    this.isMultiLine = function() {
      if(this.isEmpty()) {
        return false
      }return this.getRange().isMultiLine()
    };
    this.getCursor = function() {
      return this.selectionLead
    };
    this.setSelectionAnchor = function(d, k) {
      d = this.$clipPositionToDocument(d, k);
      if(this.selectionAnchor) {
        if(this.selectionAnchor.row !== d.row || this.selectionAnchor.column !== d.column) {
          this.selectionAnchor = d;
          this._dispatchEvent("changeSelection", {})
        }
      }else {
        this.selectionAnchor = d;
        this._dispatchEvent("changeSelection", {})
      }
    };
    this.getSelectionAnchor = function() {
      return this.selectionAnchor ? this.$clone(this.selectionAnchor) : this.$clone(this.selectionLead)
    };
    this.getSelectionLead = function() {
      return this.$clone(this.selectionLead)
    };
    this.shiftSelection = function(d) {
      if(this.isEmpty()) {
        this.moveCursorTo(this.selectionLead.row, this.selectionLead.column + d)
      }else {
        var k = this.getSelectionAnchor(), a = this.getSelectionLead(), f = this.isBackwards();
        if(!f || k.column !== 0) {
          this.setSelectionAnchor(k.row, k.column + d)
        }if(f || a.column !== 0) {
          this.$moveSelection(function() {
            this.moveCursorTo(a.row, a.column + d)
          })
        }
      }
    };
    this.isBackwards = function() {
      var d = this.selectionAnchor || this.selectionLead, k = this.selectionLead;
      return d.row > k.row || d.row == k.row && d.column > k.column
    };
    this.getRange = function() {
      var d = this.selectionAnchor || this.selectionLead, k = this.selectionLead;
      return this.isBackwards() ? o.fromPoints(k, d) : o.fromPoints(d, k)
    };
    this.clearSelection = function() {
      if(this.selectionAnchor) {
        this.selectionAnchor = null;
        this._dispatchEvent("changeSelection", {})
      }
    };
    this.selectAll = function() {
      var d = this.doc.getLength() - 1;
      this.setSelectionAnchor(d, this.doc.getLine(d).length);
      if(!this.selectionAnchor) {
        this.selectionAnchor = this.$clone(this.selectionLead)
      }d = {row:0, column:0};
      if(d.row !== this.selectionLead.row || d.column !== this.selectionLead.column) {
        this.selectionLead = d;
        this._dispatchEvent("changeSelection", {blockScrolling:true})
      }
    };
    this.setSelectionRange = function(d, k) {
      if(k) {
        this.setSelectionAnchor(d.end.row, d.end.column);
        this.selectTo(d.start.row, d.start.column)
      }else {
        this.setSelectionAnchor(d.start.row, d.start.column);
        this.selectTo(d.end.row, d.end.column)
      }
    };
    this.$moveSelection = function(d) {
      var k = false;
      if(!this.selectionAnchor) {
        k = true;
        this.selectionAnchor = this.$clone(this.selectionLead)
      }var a = this.$clone(this.selectionLead);
      d.call(this);
      if(a.row !== this.selectionLead.row || a.column !== this.selectionLead.column) {
        k = true
      }k && this._dispatchEvent("changeSelection", {})
    };
    this.selectTo = function(d, k) {
      this.$moveSelection(function() {
        this.moveCursorTo(d, k)
      })
    };
    this.selectToPosition = function(d) {
      this.$moveSelection(function() {
        this.moveCursorToPosition(d)
      })
    };
    this.selectUp = function() {
      this.$moveSelection(this.moveCursorUp)
    };
    this.selectDown = function() {
      this.$moveSelection(this.moveCursorDown)
    };
    this.selectRight = function() {
      this.$moveSelection(this.moveCursorRight)
    };
    this.selectLeft = function() {
      this.$moveSelection(this.moveCursorLeft)
    };
    this.selectLineStart = function() {
      this.$moveSelection(this.moveCursorLineStart)
    };
    this.selectLineEnd = function() {
      this.$moveSelection(this.moveCursorLineEnd)
    };
    this.selectFileEnd = function() {
      this.$moveSelection(this.moveCursorFileEnd)
    };
    this.selectFileStart = function() {
      this.$moveSelection(this.moveCursorFileStart)
    };
    this.selectWordRight = function() {
      this.$moveSelection(this.moveCursorWordRight)
    };
    this.selectWordLeft = function() {
      this.$moveSelection(this.moveCursorWordLeft)
    };
    this.selectWord = function() {
      var d = this.selectionLead;
      this.setSelectionRange(this.doc.getWordRange(d.row, d.column))
    };
    this.selectLine = function() {
      this.setSelectionAnchor(this.selectionLead.row, 0);
      this.$moveSelection(function() {
        this.moveCursorTo(this.selectionLead.row + 1, 0)
      })
    };
    this.moveCursorUp = function() {
      this.moveCursorBy(-1, 0)
    };
    this.moveCursorDown = function() {
      this.moveCursorBy(1, 0)
    };
    this.moveCursorLeft = function() {
      if(this.selectionLead.column == 0) {
        this.selectionLead.row > 0 && this.moveCursorTo(this.selectionLead.row - 1, this.doc.getLine(this.selectionLead.row - 1).length)
      }else {
        var d = this.doc, k = d.getTabSize(), a = this.selectionLead;
        d.isTabStop(a) && d.getLine(a.row).slice(a.column - k, a.column).split(" ").length - 1 == k ? this.moveCursorBy(0, -k) : this.moveCursorBy(0, -1)
      }
    };
    this.moveCursorRight = function() {
      if(this.selectionLead.column == this.doc.getLine(this.selectionLead.row).length) {
        this.selectionLead.row < this.doc.getLength() - 1 && this.moveCursorTo(this.selectionLead.row + 1, 0)
      }else {
        var d = this.doc, k = d.getTabSize(), a = this.selectionLead;
        d.isTabStop(a) && d.getLine(a.row).slice(a.column, a.column + k).split(" ").length - 1 == k ? this.moveCursorBy(0, k) : this.moveCursorBy(0, 1)
      }
    };
    this.moveCursorLineStart = function() {
      var d = this.selectionLead.row, k = this.selectionLead.column, a = this.doc.getLine(d).slice(0, k).match(/^\s*/);
      if(a[0].length == 0) {
        this.moveCursorTo(d, this.doc.getLine(d).match(/^\s*/)[0].length)
      }else {
        a[0].length >= k ? this.moveCursorTo(d, 0) : this.moveCursorTo(d, a[0].length)
      }
    };
    this.moveCursorLineEnd = function() {
      this.moveCursorTo(this.selectionLead.row, this.doc.getLine(this.selectionLead.row).length)
    };
    this.moveCursorFileEnd = function() {
      var d = this.doc.getLength() - 1, k = this.doc.getLine(d).length;
      this.moveCursorTo(d, k)
    };
    this.moveCursorFileStart = function() {
      this.moveCursorTo(0, 0)
    };
    this.moveCursorWordRight = function() {
      var d = this.selectionLead.row, k = this.selectionLead.column, a = this.doc.getLine(d), f = a.substring(k);
      this.doc.nonTokenRe.lastIndex = 0;
      this.doc.tokenRe.lastIndex = 0;
      if(k == a.length) {
        this.moveCursorRight()
      }else {
        if(this.doc.nonTokenRe.exec(f)) {
          k += this.doc.nonTokenRe.lastIndex;
          this.doc.nonTokenRe.lastIndex = 0
        }else {
          if(this.doc.tokenRe.exec(f)) {
            k += this.doc.tokenRe.lastIndex;
            this.doc.tokenRe.lastIndex = 0
          }
        }this.moveCursorTo(d, k)
      }
    };
    this.moveCursorWordLeft = function() {
      var d = this.selectionLead.row, k = this.selectionLead.column, a = this.doc.getLine(d);
      a = e.stringReverse(a.substring(0, k));
      this.doc.nonTokenRe.lastIndex = 0;
      this.doc.tokenRe.lastIndex = 0;
      if(k == 0) {
        this.moveCursorLeft()
      }else {
        if(this.doc.nonTokenRe.exec(a)) {
          k -= this.doc.nonTokenRe.lastIndex;
          this.doc.nonTokenRe.lastIndex = 0
        }else {
          if(this.doc.tokenRe.exec(a)) {
            k -= this.doc.tokenRe.lastIndex;
            this.doc.tokenRe.lastIndex = 0
          }
        }this.moveCursorTo(d, k)
      }
    };
    this.moveCursorBy = function(d, k) {
      this.moveCursorTo(this.selectionLead.row + d, this.selectionLead.column + k)
    };
    this.moveCursorToPosition = function(d) {
      this.moveCursorTo(d.row, d.column)
    };
    this.moveCursorTo = function(d, k) {
      d = this.$clipPositionToDocument(d, k);
      if(d.row !== this.selectionLead.row || d.column !== this.selectionLead.column) {
        this.selectionLead = d;
        this._dispatchEvent("changeCursor", {data:this.getCursor()})
      }
    };
    this.moveCursorUp = function() {
      this.moveCursorBy(-1, 0)
    };
    this.$clipPositionToDocument = function(d, k) {
      var a = {};
      if(d >= this.doc.getLength()) {
        a.row = Math.max(0, this.doc.getLength() - 1);
        a.column = this.doc.getLine(a.row).length
      }else {
        if(d < 0) {
          a.row = 0;
          a.column = 0
        }else {
          a.row = d;
          a.column = Math.min(this.doc.getLine(a.row).length, Math.max(0, k))
        }
      }return a
    };
    this.$clone = function(d) {
      return{row:d.row, column:d.column}
    }
  }).call(i.prototype);
  g.Selection = i
});
define("ace/tokenizer", ["require", "exports", "module"], function(i, g) {
  i = function(l) {
    this.rules = l;
    this.regExps = {};
    for(var e in this.rules) {
      l = this.rules[e];
      for(var j = [], o = 0;o < l.length;o++) {
        j.push(l[o].regex)
      }this.regExps[e] = new RegExp("(?:(" + j.join(")|(") + ")|(.))", "g")
    }
  };
  (function() {
    this.getLineTokens = function(l, e) {
      e = e;
      var j = this.rules[e], o = this.regExps[e];
      o.lastIndex = 0;
      for(var d, k = [], a = 0, f = {type:null, value:""};d = o.exec(l);) {
        var h = "text", m = d[0];
        if(o.lastIndex == a) {
          throw new Error("tokenizer error");
        }a = o.lastIndex;
        for(var b = 0;b < j.length;b++) {
          if(d[b + 1]) {
            h = typeof j[b].token == "function" ? j[b].token(d[0]) : j[b].token;
            if(j[b].next && j[b].next !== e) {
              e = j[b].next;
              j = this.rules[e];
              a = o.lastIndex;
              o = this.regExps[e];
              o.lastIndex = a
            }break
          }
        }if(f.type !== h) {
          f.type && k.push(f);
          f = {type:h, value:m}
        }else {
          f.value += m
        }
      }f.type && k.push(f);
      return{tokens:k, state:e}
    }
  }).call(i.prototype);
  g.Tokenizer = i
});
define("ace/mode/text_highlight_rules", ["require", "exports", "module"], function(i, g) {
  i = function() {
    this.$rules = {start:[{token:"text", regex:".+"}]}
  };
  (function() {
    this.addRules = function(l, e) {
      for(var j in l) {
        for(var o = l[j], d = 0;d < o.length;d++) {
          var k = o[d];
          k.next = k.next ? e + k.next : e + j
        }this.$rules[e + j] = o
      }
    };
    this.getRules = function() {
      return this.$rules
    }
  }).call(i.prototype);
  g.TextHighlightRules = i
});
define("ace/mode/text", ["require", "exports", "module", "ace/tokenizer", "ace/mode/text_highlight_rules"], function(i, g) {
  var l = i("ace/tokenizer").Tokenizer, e = i("ace/mode/text_highlight_rules").TextHighlightRules;
  i = function() {
    this.$tokenizer = new l((new e).getRules())
  };
  (function() {
    this.getTokenizer = function() {
      return this.$tokenizer
    };
    this.toggleCommentLines = function() {
      return 0
    };
    this.getNextLineIndent = function() {
      return""
    };
    this.checkOutdent = function() {
      return false
    };
    this.autoOutdent = function() {
    };
    this.$getIndent = function(j) {
      if(j = j.match(/^(\s+)/)) {
        return j[1]
      }return""
    }
  }).call(i.prototype);
  g.Mode = i
});
define("ace/document", ["require", "exports", "module", "pilot/oop", "pilot/lang", "pilot/event_emitter", "ace/selection", "ace/mode/text", "ace/range"], function(i, g) {
  var l = i("pilot/oop"), e = i("pilot/lang"), j = i("pilot/event_emitter").EventEmitter, o = i("ace/selection").Selection, d = i("ace/mode/text").Mode, k = i("ace/range").Range;
  i = function(a, f) {
    this.modified = true;
    this.lines = [];
    this.selection = new o(this);
    this.$breakpoints = [];
    this.listeners = [];
    f && this.setMode(f);
    Array.isArray(a) ? this.$insertLines(0, a) : this.$insert({row:0, column:0}, a)
  };
  (function() {
    l.implement(this, j);
    this.$undoManager = null;
    this.$split = function(a) {
      return a.split(/\r\n|\r|\n/)
    };
    this.setValue = function(a) {
      var f = [0, this.lines.length];
      f.push.apply(f, this.$split(a));
      this.lines.splice.apply(this.lines, f);
      this.modified = true;
      this.fireChangeEvent(0)
    };
    this.toString = function() {
      return this.lines.join(this.$getNewLineCharacter())
    };
    this.getSelection = function() {
      return this.selection
    };
    this.fireChangeEvent = function(a, f) {
      this._dispatchEvent("change", {data:{firstRow:a, lastRow:f}})
    };
    this.setUndoManager = function(a) {
      this.$undoManager = a;
      this.$deltas = [];
      this.$informUndoManager && this.$informUndoManager.cancel();
      if(a) {
        var f = this;
        this.$informUndoManager = e.deferredCall(function() {
          f.$deltas.length > 0 && a.execute({action:"aceupdate", args:[f.$deltas, f]});
          f.$deltas = []
        })
      }
    };
    this.$defaultUndoManager = {undo:function() {
    }, redo:function() {
    }};
    this.getUndoManager = function() {
      return this.$undoManager || this.$defaultUndoManager
    };
    this.getTabString = function() {
      return this.getUseSoftTabs() ? e.stringRepeat(" ", this.getTabSize()) : "\t"
    };
    this.$useSoftTabs = true;
    this.setUseSoftTabs = function(a) {
      if(this.$useSoftTabs !== a) {
        this.$useSoftTabs = a
      }
    };
    this.getUseSoftTabs = function() {
      return this.$useSoftTabs
    };
    this.$tabSize = 4;
    this.setTabSize = function(a) {
      if(!(isNaN(a) || this.$tabSize === a)) {
        this.modified = true;
        this.$tabSize = a;
        this._dispatchEvent("changeTabSize")
      }
    };
    this.getTabSize = function() {
      return this.$tabSize
    };
    this.isTabStop = function(a) {
      return this.$useSoftTabs && a.column % this.$tabSize == 0
    };
    this.getBreakpoints = function() {
      return this.$breakpoints
    };
    this.setBreakpoints = function(a) {
      this.$breakpoints = [];
      for(var f = 0;f < a.length;f++) {
        this.$breakpoints[a[f]] = true
      }this._dispatchEvent("changeBreakpoint", {})
    };
    this.clearBreakpoints = function() {
      this.$breakpoints = [];
      this._dispatchEvent("changeBreakpoint", {})
    };
    this.setBreakpoint = function(a) {
      this.$breakpoints[a] = true;
      this._dispatchEvent("changeBreakpoint", {})
    };
    this.clearBreakpoint = function(a) {
      delete this.$breakpoints[a];
      this._dispatchEvent("changeBreakpoint", {})
    };
    this.$detectNewLine = function(a) {
      this.$autoNewLine = (a = a.match(/^.*?(\r?\n)/m)) ? a[1] : "\n"
    };
    this.tokenRe = /^[\w\d]+/g;
    this.nonTokenRe = /^[^\w\d]+/g;
    this.getWordRange = function(a, f) {
      var h = this.getLine(a), m = false;
      if(f > 0) {
        m = !!h.charAt(f - 1).match(this.tokenRe)
      }m || (m = !!h.charAt(f).match(this.tokenRe));
      m = m ? this.tokenRe : this.nonTokenRe;
      var b = f;
      if(b > 0) {
        do {
          b--
        }while(b >= 0 && h.charAt(b).match(m));
        b++
      }for(f = f;f < h.length && h.charAt(f).match(m);) {
        f++
      }return new k(a, b, a, f)
    };
    this.$getNewLineCharacter = function() {
      switch(this.$newLineMode) {
        case "windows":
          return"\r\n";
        case "unix":
          return"\n";
        case "auto":
          return this.$autoNewLine
      }
    };
    this.$autoNewLine = "\n";
    this.$newLineMode = "auto";
    this.setNewLineMode = function(a) {
      if(this.$newLineMode !== a) {
        this.$newLineMode = a
      }
    };
    this.getNewLineMode = function() {
      return this.$newLineMode
    };
    this.$mode = null;
    this.setMode = function(a) {
      if(this.$mode !== a) {
        this.$mode = a;
        this._dispatchEvent("changeMode")
      }
    };
    this.getMode = function() {
      if(!this.$mode) {
        this.$mode = new d
      }return this.$mode
    };
    this.$scrollTop = 0;
    this.setScrollTopRow = function(a) {
      if(this.$scrollTop !== a) {
        this.$scrollTop = a;
        this._dispatchEvent("changeScrollTop")
      }
    };
    this.getScrollTopRow = function() {
      return this.$scrollTop
    };
    this.getWidth = function() {
      this.$computeWidth();
      return this.width
    };
    this.getScreenWidth = function() {
      this.$computeWidth();
      return this.screenWidth
    };
    this.$computeWidth = function() {
      if(this.modified) {
        this.modified = false;
        for(var a = this.lines, f = 0, h = 0, m = this.getTabSize(), b = 0;b < a.length;b++) {
          var c = a[b].length;
          f = Math.max(f, c);
          a[b].replace("\t", function(n) {
            c += m - 1;
            return n
          });
          h = Math.max(h, c)
        }this.width = f;
        this.screenWidth = h
      }
    };
    this.getLine = function(a) {
      return this.lines[a] || ""
    };
    this.getDisplayLine = function(a) {
      var f = (new Array(this.getTabSize() + 1)).join(" ");
      return this.lines[a].replace(/\t/g, f)
    };
    this.getLines = function(a, f) {
      return this.lines.slice(a, f + 1)
    };
    this.getLength = function() {
      return this.lines.length
    };
    this.getTextRange = function(a) {
      if(a.start.row == a.end.row) {
        return this.lines[a.start.row].substring(a.start.column, a.end.column)
      }else {
        var f = [];
        f.push(this.lines[a.start.row].substring(a.start.column));
        f.push.apply(f, this.getLines(a.start.row + 1, a.end.row - 1));
        f.push(this.lines[a.end.row].substring(0, a.end.column));
        return f.join(this.$getNewLineCharacter())
      }
    };
    this.findMatchingBracket = function(a) {
      if(a.column == 0) {
        return null
      }var f = this.getLine(a.row).charAt(a.column - 1);
      if(f == "") {
        return null
      }f = f.match(/([\(\[\{])|([\)\]\}])/);
      if(!f) {
        return null
      }return f[1] ? this.$findClosingBracket(f[1], a) : this.$findOpeningBracket(f[2], a)
    };
    this.$brackets = {")":"(", "(":")", "]":"[", "[":"]", "{":"}", "}":"{"};
    this.$findOpeningBracket = function(a, f) {
      var h = this.$brackets[a], m = f.column - 2;
      f = f.row;
      for(var b = 1, c = this.getLine(f);;) {
        for(;m >= 0;) {
          var n = c.charAt(m);
          if(n == h) {
            b -= 1;
            if(b == 0) {
              return{row:f, column:m}
            }
          }else {
            if(n == a) {
              b += 1
            }
          }m -= 1
        }f -= 1;
        if(f < 0) {
          break
        }c = this.getLine(f);
        m = c.length - 1
      }return null
    };
    this.$findClosingBracket = function(a, f) {
      var h = this.$brackets[a], m = f.column;
      f = f.row;
      for(var b = 1, c = this.getLine(f), n = this.getLength();;) {
        for(;m < c.length;) {
          var p = c.charAt(m);
          if(p == h) {
            b -= 1;
            if(b == 0) {
              return{row:f, column:m}
            }
          }else {
            if(p == a) {
              b += 1
            }
          }m += 1
        }f += 1;
        if(f >= n) {
          break
        }c = this.getLine(f);
        m = 0
      }return null
    };
    this.insert = function(a, f, h) {
      f = this.$insert(a, f, h);
      this.fireChangeEvent(a.row, a.row == f.row ? a.row : undefined);
      return f
    };
    this.multiRowInsert = function(a, f, h) {
      for(var m = this.lines, b = a.length - 1;b >= 0;b--) {
        var c = a[b];
        if(!(c >= m.length)) {
          var n = f - m[c].length;
          if(n > 0) {
            var p = e.stringRepeat(" ", n) + h;
            n = -n
          }else {
            p = h;
            n = 0
          }p = this.$insert({row:c, column:f + n}, p, false)
        }
      }if(p) {
        this.fireChangeEvent(a[0], a[a.length - 1] + p.row - a[0]);
        return{rows:p.row - a[0], columns:p.column - f}
      }else {
        return{rows:0, columns:0}
      }
    };
    this.$insertLines = function(a, f, h) {
      if(f.length != 0) {
        var m = [a, 0];
        m.push.apply(m, f);
        this.lines.splice.apply(this.lines, m);
        if(!h && this.$undoManager) {
          h = this.$getNewLineCharacter();
          this.$deltas.push({action:"insertText", range:new k(a, 0, a + f.length, 0), text:f.join(h) + h});
          this.$informUndoManager.schedule()
        }
      }
    };
    this.$insert = function(a, f, h) {
      if(f.length == 0) {
        return a
      }this.modified = true;
      this.lines.length <= 1 && this.$detectNewLine(f);
      var m = this.$split(f);
      if(this.$isNewLine(f)) {
        var b = this.lines[a.row] || "";
        this.lines[a.row] = b.substring(0, a.column);
        this.lines.splice(a.row + 1, 0, b.substring(a.column));
        m = {row:a.row + 1, column:0}
      }else {
        if(m.length == 1) {
          b = this.lines[a.row] || "";
          this.lines[a.row] = b.substring(0, a.column) + f + b.substring(a.column);
          m = {row:a.row, column:a.column + f.length}
        }else {
          b = this.lines[a.row] || "";
          var c = b.substring(0, a.column) + m[0];
          b = m[m.length - 1] + b.substring(a.column);
          this.lines[a.row] = c;
          this.$insertLines(a.row + 1, [b], true);
          m.length > 2 && this.$insertLines(a.row + 1, m.slice(1, -1), true);
          m = {row:a.row + m.length - 1, column:m[m.length - 1].length}
        }
      }if(!h && this.$undoManager) {
        this.$deltas.push({action:"insertText", range:k.fromPoints(a, m), text:f});
        this.$informUndoManager.schedule()
      }return m
    };
    this.$isNewLine = function(a) {
      return a == "\r\n" || a == "\r" || a == "\n"
    };
    this.remove = function(a, f) {
      if(a.isEmpty()) {
        return a.start
      }this.$remove(a, f);
      this.fireChangeEvent(a.start.row, a.isMultiLine() ? undefined : a.start.row);
      return a.start
    };
    this.multiRowRemove = function(a, f) {
      if(f.start.row !== a[0]) {
        throw new TypeError("range must start in the first row!");
      }for(var h = f.end.row - a[0], m = a.length - 1;m >= 0;m--) {
        var b = a[m];
        if(!(b >= this.lines.length)) {
          var c = this.$remove(new k(b, f.start.column, b + h, f.end.column), false)
        }
      }if(c) {
        h < 0 ? this.fireChangeEvent(a[0] + h, undefined) : this.fireChangeEvent(a[0], h == 0 ? a[a.length - 1] : undefined)
      }
    };
    this.$remove = function(a, f) {
      if(!a.isEmpty()) {
        if(!f && this.$undoManager) {
          this.$getNewLineCharacter();
          this.$deltas.push({action:"removeText", range:a.clone(), text:this.getTextRange(a)});
          this.$informUndoManager.schedule()
        }this.modified = true;
        f = a.start.row;
        var h = a.end.row, m = this.getLine(f).substring(0, a.start.column) + this.getLine(h).substring(a.end.column);
        m != "" ? this.lines.splice(f, h - f + 1, m) : this.lines.splice(f, h - f + 1, "");
        return a.start
      }
    };
    this.undoChanges = function(a) {
      this.selection.clearSelection();
      for(var f = a.length - 1;f >= 0;f--) {
        var h = a[f];
        if(h.action == "insertText") {
          this.remove(h.range, true);
          this.selection.moveCursorToPosition(h.range.start)
        }else {
          this.insert(h.range.start, h.text, true);
          this.selection.clearSelection()
        }
      }
    };
    this.redoChanges = function(a) {
      this.selection.clearSelection();
      for(var f = 0;f < a.length;f++) {
        var h = a[f];
        if(h.action == "insertText") {
          this.insert(h.range.start, h.text, true);
          this.selection.setSelectionRange(h.range)
        }else {
          this.remove(h.range, true);
          this.selection.moveCursorToPosition(h.range.start)
        }
      }
    };
    this.replace = function(a, f) {
      this.$remove(a);
      f = f ? this.$insert(a.start, f) : a.start;
      var h = a.end.column == 0 ? a.end.column - 1 : a.end.column;
      this.fireChangeEvent(a.start.row, h == f.row ? h : undefined);
      return f
    };
    this.indentRows = function(a, f, h) {
      h = h.replace("\t", this.getTabString());
      for(var m = a;m <= f;m++) {
        this.$insert({row:m, column:0}, h)
      }this.fireChangeEvent(a, f);
      return h.length
    };
    this.outdentRows = function(a) {
      for(var f = a.collapseRows(), h = new k(0, 0, 0, 0), m = this.getTabSize(), b = f.start.row;b <= f.end.row;++b) {
        var c = this.getLine(b);
        h.start.row = b;
        h.end.row = b;
        for(var n = 0;n < m;++n) {
          if(c.charAt(n) != " ") {
            break
          }
        }if(n < m && c.charAt(n) == "\t") {
          h.start.column = n;
          h.end.column = n + 1
        }else {
          h.start.column = 0;
          h.end.column = n
        }if(b == a.start.row) {
          a.start.column -= h.end.column - h.start.column
        }if(b == a.end.row) {
          a.end.column -= h.end.column - h.start.column
        }this.$remove(h)
      }this.fireChangeEvent(a.start.row, a.end.row);
      return a
    };
    this.moveLinesUp = function(a, f) {
      if(a <= 0) {
        return 0
      }var h = this.lines.slice(a, f + 1);
      this.$remove(new k(a - 1, this.lines[a - 1].length, f, this.lines[f].length));
      this.$insertLines(a - 1, h);
      this.fireChangeEvent(a - 1, f);
      return-1
    };
    this.moveLinesDown = function(a, f) {
      if(f >= this.lines.length - 1) {
        return 0
      }var h = this.lines.slice(a, f + 1);
      this.$remove(new k(a, 0, f + 1, 0));
      this.$insertLines(a + 1, h);
      this.fireChangeEvent(a, f + 1);
      return 1
    };
    this.duplicateLines = function(a, f) {
      a = this.$clipRowToDocument(a);
      f = this.$clipRowToDocument(f);
      var h = this.getLines(a, f);
      this.$insertLines(a, h);
      f = f - a + 1;
      this.fireChangeEvent(a);
      return f
    };
    this.$clipRowToDocument = function(a) {
      return Math.max(0, Math.min(a, this.lines.length - 1))
    };
    this.documentToScreenColumn = function(a, f) {
      var h = this.getTabSize(), m = 0;
      f = f;
      a = this.getLine(a).split("\t");
      for(var b = 0;b < a.length;b++) {
        var c = a[b].length;
        if(f > c) {
          f -= c + 1;
          m += c + h
        }else {
          m += f;
          break
        }
      }return m
    };
    this.screenToDocumentColumn = function(a, f) {
      var h = this.getTabSize(), m = 0;
      f = f;
      a = this.getLine(a).split("\t");
      for(var b = 0;b < a.length;b++) {
        var c = a[b].length;
        if(f >= c + h) {
          f -= c + h;
          m += c + 1
        }else {
          m += f > c ? c : f;
          break
        }
      }return m
    }
  }).call(i.prototype);
  g.Document = i
});
define("ace/search", ["require", "exports", "module", "pilot/lang", "pilot/oop", "ace/range"], function(i, g) {
  var l = i("pilot/lang"), e = i("pilot/oop"), j = i("ace/range").Range, o = function() {
    this.$options = {needle:"", backwards:false, wrap:false, caseSensitive:false, wholeWord:false, scope:o.ALL, regExp:false}
  };
  o.ALL = 1;
  o.SELECTION = 2;
  (function() {
    this.set = function(d) {
      e.mixin(this.$options, d);
      return this
    };
    this.getOptions = function() {
      return l.copyObject(this.$options)
    };
    this.find = function(d) {
      if(!this.$options.needle) {
        return null
      }var k = null;
      (this.$options.backwards ? this.$backwardMatchIterator(d) : this.$forwardMatchIterator(d)).forEach(function(a) {
        k = a;
        return true
      });
      return k
    };
    this.findAll = function(d) {
      if(!this.$options.needle) {
        return[]
      }var k = [];
      (this.$options.backwards ? this.$backwardMatchIterator(d) : this.$forwardMatchIterator(d)).forEach(function(a) {
        k.push(a)
      });
      return k
    };
    this.replace = function(d, k) {
      var a = this.$assembleRegExp(), f = a.exec(d);
      return f && f[0].length == d.length ? this.$options.regExp ? d.replace(a, k) : k : null
    };
    this.$forwardMatchIterator = function(d) {
      var k = this.$assembleRegExp(), a = this;
      return{forEach:function(f) {
        a.$forwardLineIterator(d).forEach(function(h, m, b) {
          if(m) {
            h = h.substring(m)
          }var c = [];
          h.replace(k, function(p) {
            c.push({str:p, offset:m + arguments[arguments.length - 2]});
            return p
          });
          for(h = 0;h < c.length;h++) {
            var n = c[h];
            n = a.$rangeFromMatch(b, n.offset, n.str.length);
            if(f(n)) {
              return true
            }
          }
        })
      }}
    };
    this.$backwardMatchIterator = function(d) {
      var k = this.$assembleRegExp(), a = this;
      return{forEach:function(f) {
        a.$backwardLineIterator(d).forEach(function(h, m, b) {
          if(m) {
            h = h.substring(m)
          }var c = [];
          h.replace(k, function(p, r) {
            c.push({str:p, offset:m + r});
            return p
          });
          for(h = c.length - 1;h >= 0;h--) {
            var n = c[h];
            n = a.$rangeFromMatch(b, n.offset, n.str.length);
            if(f(n)) {
              return true
            }
          }
        })
      }}
    };
    this.$rangeFromMatch = function(d, k, a) {
      return new j(d, k, d, k + a)
    };
    this.$assembleRegExp = function() {
      var d = this.$options.regExp ? this.$options.needle : l.escapeRegExp(this.$options.needle);
      if(this.$options.wholeWord) {
        d = "\\b" + d + "\\b"
      }var k = "g";
      this.$options.caseSensitive || (k += "i");
      return new RegExp(d, k)
    };
    this.$forwardLineIterator = function(d) {
      function k(p) {
        var r = d.getLine(p);
        if(a && p == f.end.row) {
          r = r.substring(0, f.end.column)
        }return r
      }
      var a = this.$options.scope == o.SELECTION, f = d.getSelection().getRange(), h = d.getSelection().getCursor(), m = a ? f.start.row : 0, b = a ? f.start.column : 0, c = a ? f.end.row : d.getLength() - 1, n = this.$options.wrap;
      return{forEach:function(p) {
        for(var r = h.row, t = k(r), q = h.column, s = false;!p(t, q, r);) {
          if(s) {
            return
          }r++;
          q = 0;
          if(r > c) {
            if(n) {
              r = m;
              q = b
            }else {
              return
            }
          }if(r == h.row) {
            s = true
          }t = k(r)
        }
      }}
    };
    this.$backwardLineIterator = function(d) {
      var k = this.$options.scope == o.SELECTION, a = d.getSelection().getRange(), f = k ? a.end : a.start, h = k ? a.start.row : 0, m = k ? a.start.column : 0, b = k ? a.end.row : d.getLength() - 1, c = this.$options.wrap;
      return{forEach:function(n) {
        for(var p = f.row, r = d.getLine(p).substring(0, f.column), t = 0, q = false;!n(r, t, p);) {
          if(q) {
            return
          }p--;
          t = 0;
          if(p < h) {
            if(c) {
              p = b
            }else {
              return
            }
          }if(p == f.row) {
            q = true
          }r = d.getLine(p);
          if(k) {
            if(p == h) {
              t = m
            }else {
              if(p == b) {
                r = r.substring(0, a.end.column)
              }
            }
          }
        }
      }}
    }
  }).call(o.prototype);
  g.Search = o
});
define("ace/background_tokenizer", ["require", "exports", "module", "pilot/oop", "pilot/event_emitter"], function(i, g) {
  var l = i("pilot/oop"), e = i("pilot/event_emitter").EventEmitter;
  i = function(j, o) {
    this.running = false;
    this.textLines = [];
    this.lines = [];
    this.currentLine = 0;
    this.tokenizer = j;
    var d = this;
    this.$worker = function() {
      if(d.running) {
        for(var k = new Date, a = d.currentLine, f = d.textLines, h = 0, m = o.getLastVisibleRow();d.currentLine < f.length;) {
          d.lines[d.currentLine] = d.$tokenizeRows(d.currentLine, d.currentLine)[0];
          d.currentLine++;
          h += 1;
          if(h % 5 == 0 && new Date - k > 20) {
            d.fireUpdateEvent(a, d.currentLine - 1);
            d.running = setTimeout(d.$worker, d.currentLine < m ? 20 : 100);
            return
          }
        }d.running = false;
        d.fireUpdateEvent(a, f.length - 1)
      }
    }
  };
  (function() {
    l.implement(this, e);
    this.setTokenizer = function(j) {
      this.tokenizer = j;
      this.lines = [];
      this.start(0)
    };
    this.setLines = function(j) {
      this.textLines = j;
      this.lines = [];
      this.stop()
    };
    this.fireUpdateEvent = function(j, o) {
      this._dispatchEvent("update", {data:{first:j, last:o}})
    };
    this.start = function(j) {
      this.currentLine = Math.min(j || 0, this.currentLine, this.textLines.length);
      this.lines.splice(this.currentLine, this.lines.length);
      this.stop();
      this.running = setTimeout(this.$worker, 700)
    };
    this.stop = function() {
      this.running && clearTimeout(this.running);
      this.running = false
    };
    this.getTokens = function(j, o, d) {
      d(this.$tokenizeRows(j, o))
    };
    this.getState = function(j, o) {
      o(this.$tokenizeRows(j, j)[0].state)
    };
    this.$tokenizeRows = function(j, o) {
      var d = [], k = "start", a = false;
      if(j > 0 && this.lines[j - 1]) {
        k = this.lines[j - 1].state;
        a = true
      }for(j = j;j <= o;j++) {
        if(this.lines[j]) {
          f = this.lines[j];
          k = f.state;
          d.push(f)
        }else {
          var f = this.tokenizer.getLineTokens(this.textLines[j] || "", k);
          k = f.state;
          d.push(f);
          if(a) {
            this.lines[j] = f
          }
        }
      }return d
    }
  }).call(i.prototype);
  g.BackgroundTokenizer = i
});
define("ace/editor", ["require", "exports", "module", "pilot/oop", "pilot/event", "pilot/lang", "ace/textinput", "ace/keybinding", "ace/document", "ace/search", "ace/background_tokenizer", "ace/range", "pilot/event_emitter"], function(i, g) {
  var l = i("pilot/oop"), e = i("pilot/event"), j = i("pilot/lang"), o = i("ace/textinput").TextInput, d = i("ace/keybinding").KeyBinding, k = i("ace/document").Document, a = i("ace/search").Search, f = i("ace/background_tokenizer").BackgroundTokenizer, h = i("ace/range").Range, m = i("pilot/event_emitter").EventEmitter;
  i = function(b, c) {
    var n = b.getContainerElement();
    this.container = n;
    this.renderer = b;
    this.textInput = new o(n, this);
    this.keyBinding = new d(n, this);
    var p = this;
    e.addListener(n, "mousedown", function(r) {
      setTimeout(function() {
        p.focus()
      });
      return e.preventDefault(r)
    });
    e.addListener(n, "selectstart", function(r) {
      return e.preventDefault(r)
    });
    b = b.getMouseEventTarget();
    e.addListener(b, "mousedown", this.onMouseDown.bind(this));
    e.addMultiMouseDownListener(b, 0, 2, 500, this.onMouseDoubleClick.bind(this));
    e.addMultiMouseDownListener(b, 0, 3, 600, this.onMouseTripleClick.bind(this));
    e.addMouseWheelListener(b, this.onMouseWheel.bind(this));
    this.$highlightLineMarker = this.$selectionMarker = null;
    this.$blockScrolling = false;
    this.$search = (new a).set({wrap:true});
    this.setDocument(c || new k(""));
    this.focus()
  };
  (function() {
    l.implement(this, m);
    this.$forwardEvents = {gutterclick:1, gutterdblclick:1};
    this.$originalAddEventListener = this.addEventListener;
    this.$originalRemoveEventListener = this.removeEventListener;
    this.addEventListener = function(b, c) {
      return this.$forwardEvents[b] ? this.renderer.addEventListener(b, c) : this.$originalAddEventListener(b, c)
    };
    this.removeEventListener = function(b, c) {
      return this.$forwardEvents[b] ? this.renderer.removeEventListener(b, c) : this.$originalRemoveEventListener(b, c)
    };
    this.setDocument = function(b) {
      if(this.doc != b) {
        if(this.doc) {
          this.doc.removeEventListener("change", this.$onDocumentChange);
          this.doc.removeEventListener("changeMode", this.$onDocumentModeChange);
          this.doc.removeEventListener("changeTabSize", this.$onDocumentChangeTabSize);
          this.doc.removeEventListener("changeBreakpoint", this.$onDocumentChangeBreakpoint);
          var c = this.doc.getSelection();
          c.removeEventListener("changeCursor", this.$onCursorChange);
          c.removeEventListener("changeSelection", this.$onSelectionChange);
          this.doc.setScrollTopRow(this.renderer.getScrollTopRow())
        }this.doc = b;
        this.$onDocumentChange = this.onDocumentChange.bind(this);
        b.addEventListener("change", this.$onDocumentChange);
        this.renderer.setDocument(b);
        this.$onDocumentModeChange = this.onDocumentModeChange.bind(this);
        b.addEventListener("changeMode", this.$onDocumentModeChange);
        this.$onDocumentChangeTabSize = this.renderer.updateText.bind(this.renderer);
        b.addEventListener("changeTabSize", this.$onDocumentChangeTabSize);
        this.$onDocumentChangeBreakpoint = this.onDocumentChangeBreakpoint.bind(this);
        this.doc.addEventListener("changeBreakpoint", this.$onDocumentChangeBreakpoint);
        this.selection = b.getSelection();
        this.$desiredColumn = 0;
        this.$onCursorChange = this.onCursorChange.bind(this);
        this.selection.addEventListener("changeCursor", this.$onCursorChange);
        this.$onSelectionChange = this.onSelectionChange.bind(this);
        this.selection.addEventListener("changeSelection", this.$onSelectionChange);
        this.onDocumentModeChange();
        this.bgTokenizer.setLines(this.doc.lines);
        this.bgTokenizer.start(0);
        this.onCursorChange();
        this.onSelectionChange();
        this.onDocumentChangeBreakpoint();
        this.renderer.scrollToRow(b.getScrollTopRow());
        this.renderer.updateFull()
      }
    };
    this.getDocument = function() {
      return this.doc
    };
    this.getSelection = function() {
      return this.selection
    };
    this.resize = function() {
      this.renderer.onResize()
    };
    this.setTheme = function(b) {
      this.renderer.setTheme(b)
    };
    this.$highlightBrackets = function() {
      if(this.$bracketHighlight) {
        this.renderer.removeMarker(this.$bracketHighlight);
        this.$bracketHighlight = null
      }if(!this.$highlightPending) {
        var b = this;
        this.$highlightPending = true;
        setTimeout(function() {
          b.$highlightPending = false;
          var c = b.doc.findMatchingBracket(b.getCursorPosition());
          if(c) {
            c = new h(c.row, c.column, c.row, c.column + 1);
            b.$bracketHighlight = b.renderer.addMarker(c, "ace_bracket")
          }
        }, 10)
      }
    };
    this.focus = function() {
      this.textInput.focus()
    };
    this.blur = function() {
      this.textInput.blur()
    };
    this.onFocus = function() {
      this.renderer.showCursor();
      this.renderer.visualizeFocus()
    };
    this.onBlur = function() {
      this.renderer.hideCursor();
      this.renderer.visualizeBlur()
    };
    this.onDocumentChange = function(b) {
      b = b.data;
      this.bgTokenizer.start(b.firstRow);
      this.renderer.updateLines(b.firstRow, b.lastRow);
      this.renderer.updateCursor(this.getCursorPosition(), this.$overwrite)
    };
    this.onTokenizerUpdate = function(b) {
      b = b.data;
      this.renderer.updateLines(b.first, b.last)
    };
    this.onCursorChange = function(b) {
      this.$highlightBrackets();
      this.renderer.updateCursor(this.getCursorPosition(), this.$overwrite);
      if(!this.$blockScrolling && (!b || !b.blockScrolling)) {
        this.renderer.scrollCursorIntoView()
      }this.$updateHighlightActiveLine()
    };
    this.$updateHighlightActiveLine = function() {
      this.$highlightLineMarker && this.renderer.removeMarker(this.$highlightLineMarker);
      this.$highlightLineMarker = null;
      if(this.getHighlightActiveLine() && (this.getSelectionStyle() != "line" || !this.selection.isMultiLine())) {
        var b = this.getCursorPosition();
        this.$highlightLineMarker = this.renderer.addMarker(new h(b.row, 0, b.row + 1, 0), "ace_active_line", "line")
      }
    };
    this.onSelectionChange = function(b) {
      this.$selectionMarker && this.renderer.removeMarker(this.$selectionMarker);
      this.$selectionMarker = null;
      if(!this.selection.isEmpty()) {
        var c = this.selection.getRange(), n = this.getSelectionStyle();
        this.$selectionMarker = this.renderer.addMarker(c, "ace_selection", n)
      }this.onCursorChange(b)
    };
    this.onDocumentChangeBreakpoint = function() {
      this.renderer.setBreakpoints(this.doc.getBreakpoints())
    };
    this.onDocumentModeChange = function() {
      var b = this.doc.getMode();
      if(this.mode != b) {
        this.mode = b;
        b = b.getTokenizer();
        if(this.bgTokenizer) {
          this.bgTokenizer.setTokenizer(b)
        }else {
          var c = this.onTokenizerUpdate.bind(this);
          this.bgTokenizer = new f(b, this);
          this.bgTokenizer.addEventListener("update", c)
        }this.renderer.setTokenizer(this.bgTokenizer)
      }
    };
    this.onMouseDown = function(b) {
      var c = e.getDocumentX(b), n = e.getDocumentY(b);
      c = this.renderer.screenToTextCoordinates(c, n);
      c.row = Math.max(0, Math.min(c.row, this.doc.getLength() - 1));
      if(e.getButton(b) != 0) {
        this.selection.isEmpty() && this.moveCursorToPosition(c)
      }else {
        if(b.shiftKey) {
          this.selection.selectToPosition(c)
        }else {
          this.moveCursorToPosition(c);
          this.$clickSelection || this.selection.clearSelection(c.row, c.column)
        }this.renderer.scrollCursorIntoView();
        var p = this, r, t;
        e.capture(this.container, function(s) {
          r = e.getDocumentX(s);
          t = e.getDocumentY(s)
        }, function() {
          clearInterval(q);
          p.$clickSelection = null
        });
        var q = setInterval(function() {
          if(!(r === undefined || t === undefined)) {
            var s = p.renderer.screenToTextCoordinates(r, t);
            s.row = Math.max(0, Math.min(s.row, p.doc.getLength() - 1));
            if(p.$clickSelection) {
              if(p.$clickSelection.contains(s.row, s.column)) {
                p.selection.setSelectionRange(p.$clickSelection)
              }else {
                var u = p.$clickSelection.compare(s.row, s.column) == -1 ? p.$clickSelection.end : p.$clickSelection.start;
                p.selection.setSelectionAnchor(u.row, u.column);
                p.selection.selectToPosition(s)
              }
            }else {
              p.selection.selectToPosition(s)
            }p.renderer.scrollCursorIntoView()
          }
        }, 20);
        return e.preventDefault(b)
      }
    };
    this.onMouseDoubleClick = function() {
      this.selection.selectWord();
      this.$clickSelection = this.getSelectionRange();
      this.$updateDesiredColumn()
    };
    this.onMouseTripleClick = function() {
      this.selection.selectLine();
      this.$clickSelection = this.getSelectionRange();
      this.$updateDesiredColumn()
    };
    this.onMouseWheel = function(b) {
      var c = this.$scrollSpeed * 2;
      this.renderer.scrollBy(b.wheelX * c, b.wheelY * c);
      return e.preventDefault(b)
    };
    this.getCopyText = function() {
      return this.selection.isEmpty() ? "" : this.doc.getTextRange(this.getSelectionRange())
    };
    this.onCut = function() {
      if(!this.$readOnly) {
        if(!this.selection.isEmpty()) {
          this.moveCursorToPosition(this.doc.remove(this.getSelectionRange()));
          this.clearSelection()
        }
      }
    };
    this.onTextInput = function(b) {
      if(!this.$readOnly) {
        var c = this.getCursorPosition();
        b = b.replace("\t", this.doc.getTabString());
        if(this.selection.isEmpty()) {
          if(this.$overwrite) {
            var n = new h.fromPoints(c, c);
            n.end.column += b.length;
            this.doc.remove(n)
          }
        }else {
          c = this.doc.remove(this.getSelectionRange());
          this.clearSelection()
        }this.clearSelection();
        var p = this;
        this.bgTokenizer.getState(c.row, function(r) {
          var t = p.mode.checkOutdent(r, p.doc.getLine(c.row), b), q = p.doc.getLine(c.row), s = p.mode.getNextLineIndent(r, q.slice(0, c.column), p.doc.getTabString()), u = p.doc.insert(c, b);
          p.bgTokenizer.getState(c.row, function(x) {
            if(c.row !== u.row) {
              x = p.doc.getTabSize();
              for(var z = Number.MAX_VALUE, w = c.row + 1;w <= u.row;++w) {
                var y = 0;
                q = p.doc.getLine(w);
                for(var v = 0;v < q.length;++v) {
                  if(q.charAt(v) == "\t") {
                    y += x
                  }else {
                    if(q.charAt(v) == " ") {
                      y += 1
                    }else {
                      break
                    }
                  }
                }if(/[^\s]/.test(q)) {
                  z = Math.min(y, z)
                }
              }for(w = c.row + 1;w <= u.row;++w) {
                y = z;
                q = p.doc.getLine(w);
                for(v = 0;v < q.length && y > 0;++v) {
                  if(q.charAt(v) == "\t") {
                    y -= x
                  }else {
                    if(q.charAt(v) == " ") {
                      y -= 1
                    }
                  }
                }p.doc.replace(new h(w, 0, w, q.length), q.substr(v))
              }u.column += p.doc.indentRows(c.row + 1, u.row, s)
            }else {
              if(t) {
                u.column += p.mode.autoOutdent(x, p.doc, c.row)
              }
            }p.moveCursorToPosition(u);
            p.renderer.scrollCursorIntoView()
          })
        })
      }
    };
    this.$overwrite = false;
    this.setOverwrite = function(b) {
      if(this.$overwrite != b) {
        this.$overwrite = b;
        this.$blockScrolling = true;
        this.onCursorChange();
        this.$blockScrolling = false;
        this._dispatchEvent("changeOverwrite", {data:b})
      }
    };
    this.getOverwrite = function() {
      return this.$overwrite
    };
    this.toggleOverwrite = function() {
      this.setOverwrite(!this.$overwrite)
    };
    this.$scrollSpeed = 1;
    this.setScrollSpeed = function(b) {
      this.$scrollSpeed = b
    };
    this.getScrollSpeed = function() {
      return this.$scrollSpeed
    };
    this.$selectionStyle = "line";
    this.setSelectionStyle = function(b) {
      if(this.$selectionStyle != b) {
        this.$selectionStyle = b;
        this.onSelectionChange();
        this._dispatchEvent("changeSelectionStyle", {data:b})
      }
    };
    this.getSelectionStyle = function() {
      return this.$selectionStyle
    };
    this.$highlightActiveLine = true;
    this.setHighlightActiveLine = function(b) {
      if(this.$highlightActiveLine != b) {
        this.$highlightActiveLine = b;
        this.$updateHighlightActiveLine()
      }
    };
    this.getHighlightActiveLine = function() {
      return this.$highlightActiveLine
    };
    this.setShowInvisibles = function(b) {
      this.getShowInvisibles() != b && this.renderer.setShowInvisibles(b)
    };
    this.getShowInvisibles = function() {
      return this.renderer.getShowInvisibles()
    };
    this.setShowPrintMargin = function(b) {
      this.renderer.setShowPrintMargin(b)
    };
    this.getShowPrintMargin = function() {
      return this.renderer.getShowPrintMargin()
    };
    this.setPrintMarginColumn = function(b) {
      this.renderer.setPrintMarginColumn(b)
    };
    this.getPrintMarginColumn = function() {
      return this.renderer.getPrintMarginColumn()
    };
    this.$readOnly = false;
    this.setReadOnly = function(b) {
      this.$readOnly = b
    };
    this.getReadOnly = function() {
      return this.$readOnly
    };
    this.removeRight = function() {
      if(!this.$readOnly) {
        this.selection.isEmpty() && this.selection.selectRight();
        this.moveCursorToPosition(this.doc.remove(this.getSelectionRange()));
        this.clearSelection()
      }
    };
    this.removeLeft = function() {
      if(!this.$readOnly) {
        this.selection.isEmpty() && this.selection.selectLeft();
        this.moveCursorToPosition(this.doc.remove(this.getSelectionRange()));
        this.clearSelection()
      }
    };
    this.indent = function() {
      if(!this.$readOnly) {
        var b = this.doc, c = this.getSelectionRange();
        if(c.start.row < c.end.row || c.start.column < c.end.column) {
          c = this.$getSelectedRows();
          b = b.indentRows(c.first, c.last, "\t");
          this.selection.shiftSelection(b)
        }else {
          if(this.doc.getUseSoftTabs()) {
            c = b.getTabSize();
            var n = this.getCursorPosition();
            b = b.documentToScreenColumn(n.row, n.column);
            b = c - b % c;
            b = j.stringRepeat(" ", b)
          }else {
            b = "\t"
          }return this.onTextInput(b)
        }
      }
    };
    this.blockOutdent = function() {
      if(!this.$readOnly) {
        var b = this.doc.getSelection(), c = this.doc.outdentRows(b.getRange());
        b.setSelectionRange(c, b.isBackwards());
        this.$updateDesiredColumn()
      }
    };
    this.toggleCommentLines = function() {
      if(!this.$readOnly) {
        var b = this;
        this.bgTokenizer.getState(this.getCursorPosition().row, function(c) {
          var n = b.$getSelectedRows();
          c = b.mode.toggleCommentLines(c, b.doc, n.first, n.last);
          b.selection.shiftSelection(c)
        })
      }
    };
    this.removeLines = function() {
      if(!this.$readOnly) {
        var b = this.$getSelectedRows();
        this.selection.setSelectionAnchor(b.last + 1, 0);
        this.selection.selectTo(b.first, 0);
        this.doc.remove(this.getSelectionRange());
        this.clearSelection()
      }
    };
    this.moveLinesDown = function() {
      this.$readOnly || this.$moveLines(function(b, c) {
        return this.doc.moveLinesDown(b, c)
      })
    };
    this.moveLinesUp = function() {
      this.$readOnly || this.$moveLines(function(b, c) {
        return this.doc.moveLinesUp(b, c)
      })
    };
    this.copyLinesUp = function() {
      this.$readOnly || this.$moveLines(function(b, c) {
        this.doc.duplicateLines(b, c);
        return 0
      })
    };
    this.copyLinesDown = function() {
      this.$readOnly || this.$moveLines(function(b, c) {
        return this.doc.duplicateLines(b, c)
      })
    };
    this.$moveLines = function(b) {
      var c = this.$getSelectedRows(), n = b.call(this, c.first, c.last), p = this.selection;
      p.setSelectionAnchor(c.last + n + 1, 0);
      p.$moveSelection(function() {
        p.moveCursorTo(c.first + n, 0)
      })
    };
    this.$getSelectedRows = function() {
      var b = this.getSelectionRange().collapseRows();
      return{first:b.start.row, last:b.end.row}
    };
    this.onCompositionStart = function() {
      this.renderer.showComposition(this.getCursorPosition())
    };
    this.onCompositionUpdate = function(b) {
      this.renderer.setCompositionText(b)
    };
    this.onCompositionEnd = function() {
      this.renderer.hideComposition()
    };
    this.getFirstVisibleRow = function() {
      return this.renderer.getFirstVisibleRow()
    };
    this.getLastVisibleRow = function() {
      return this.renderer.getLastVisibleRow()
    };
    this.isRowVisible = function(b) {
      return b >= this.getFirstVisibleRow() && b <= this.getLastVisibleRow()
    };
    this.getVisibleRowCount = function() {
      return this.getLastVisibleRow() - this.getFirstVisibleRow() + 1
    };
    this.getPageDownRow = function() {
      return this.renderer.getLastVisibleRow() - 1
    };
    this.getPageUpRow = function() {
      var b = this.renderer.getFirstVisibleRow(), c = this.renderer.getLastVisibleRow();
      return b - (c - b) + 1
    };
    this.selectPageDown = function() {
      var b = this.getPageDownRow() + Math.floor(this.getVisibleRowCount() / 2);
      this.scrollPageDown();
      var c = this.getSelection();
      c.$moveSelection(function() {
        c.moveCursorTo(b, c.getSelectionLead().column)
      })
    };
    this.selectPageUp = function() {
      var b = this.getLastVisibleRow() - this.getFirstVisibleRow(), c = this.getPageUpRow() + Math.round(b / 2);
      this.scrollPageUp();
      var n = this.getSelection();
      n.$moveSelection(function() {
        n.moveCursorTo(c, n.getSelectionLead().column)
      })
    };
    this.gotoPageDown = function() {
      var b = this.getPageDownRow(), c = Math.min(this.getCursorPosition().column, this.doc.getLine(b).length);
      this.scrollToRow(b);
      this.getSelection().moveCursorTo(b, c)
    };
    this.gotoPageUp = function() {
      var b = this.getPageUpRow(), c = Math.min(this.getCursorPosition().column, this.doc.getLine(b).length);
      this.scrollToRow(b);
      this.getSelection().moveCursorTo(b, c)
    };
    this.scrollPageDown = function() {
      this.scrollToRow(this.getPageDownRow())
    };
    this.scrollPageUp = function() {
      this.renderer.scrollToRow(this.getPageUpRow())
    };
    this.scrollToRow = function(b) {
      this.renderer.scrollToRow(b)
    };
    this.getCursorPosition = function() {
      return this.selection.getCursor()
    };
    this.getSelectionRange = function() {
      return this.selection.getRange()
    };
    this.clearSelection = function() {
      this.selection.clearSelection();
      this.$updateDesiredColumn()
    };
    this.moveCursorTo = function(b, c) {
      this.selection.moveCursorTo(b, c);
      this.$updateDesiredColumn()
    };
    this.moveCursorToPosition = function(b) {
      this.selection.moveCursorToPosition(b);
      this.$updateDesiredColumn()
    };
    this.gotoLine = function(b, c) {
      this.selection.clearSelection();
      this.$blockScrolling = true;
      this.moveCursorTo(b - 1, c || 0);
      this.$blockScrolling = false;
      this.isRowVisible(this.getCursorPosition().row) || this.scrollToRow(b - 1 - Math.floor(this.getVisibleRowCount() / 2))
    };
    this.navigateTo = function(b, c) {
      this.clearSelection();
      this.moveCursorTo(b, c);
      this.$updateDesiredColumn(c)
    };
    this.navigateUp = function() {
      this.selection.clearSelection();
      this.selection.moveCursorBy(-1, 0);
      if(this.$desiredColumn) {
        var b = this.getCursorPosition(), c = this.doc.screenToDocumentColumn(b.row, this.$desiredColumn);
        this.selection.moveCursorTo(b.row, c)
      }
    };
    this.navigateDown = function() {
      this.selection.clearSelection();
      this.selection.moveCursorBy(1, 0);
      if(this.$desiredColumn) {
        var b = this.getCursorPosition(), c = this.doc.screenToDocumentColumn(b.row, this.$desiredColumn);
        this.selection.moveCursorTo(b.row, c)
      }
    };
    this.$updateDesiredColumn = function() {
      var b = this.getCursorPosition();
      this.$desiredColumn = this.doc.documentToScreenColumn(b.row, b.column)
    };
    this.navigateLeft = function() {
      this.selection.isEmpty() ? this.selection.moveCursorLeft() : this.moveCursorToPosition(this.getSelectionRange().start);
      this.clearSelection()
    };
    this.navigateRight = function() {
      this.selection.isEmpty() ? this.selection.moveCursorRight() : this.moveCursorToPosition(this.getSelectionRange().end);
      this.clearSelection()
    };
    this.navigateLineStart = function() {
      this.selection.moveCursorLineStart();
      this.clearSelection()
    };
    this.navigateLineEnd = function() {
      this.selection.moveCursorLineEnd();
      this.clearSelection()
    };
    this.navigateFileEnd = function() {
      this.selection.moveCursorFileEnd();
      this.clearSelection()
    };
    this.navigateFileStart = function() {
      this.selection.moveCursorFileStart();
      this.clearSelection()
    };
    this.navigateWordRight = function() {
      this.selection.moveCursorWordRight();
      this.clearSelection()
    };
    this.navigateWordLeft = function() {
      this.selection.moveCursorWordLeft();
      this.clearSelection()
    };
    this.replace = function(b, c) {
      c && this.$search.set(c);
      c = this.$search.find(this.doc);
      this.$tryReplace(c, b);
      c !== null && this.selection.setSelectionRange(c);
      this.$updateDesiredColumn()
    };
    this.replaceAll = function(b, c) {
      c && this.$search.set(c);
      c = this.$search.findAll(this.doc);
      if(c.length) {
        this.clearSelection();
        this.selection.moveCursorTo(0, 0);
        for(var n = c.length - 1;n >= 0;--n) {
          this.$tryReplace(c[n], b)
        }c[0] !== null && this.selection.setSelectionRange(c[0]);
        this.$updateDesiredColumn()
      }
    };
    this.$tryReplace = function(b, c) {
      c = this.$search.replace(this.doc.getTextRange(b), c);
      if(c !== null) {
        b.end = this.doc.replace(b, c);
        return b
      }else {
        return null
      }
    };
    this.getLastSearchOptions = function() {
      return this.$search.getOptions()
    };
    this.find = function(b, c) {
      this.clearSelection();
      c = c || {};
      c.needle = b;
      this.$search.set(c);
      this.$find()
    };
    this.findNext = function(b) {
      b = b || {};
      if(typeof b.backwards == "undefined") {
        b.backwards = false
      }this.$search.set(b);
      this.$find()
    };
    this.findPrevious = function(b) {
      b = b || {};
      if(typeof b.backwards == "undefined") {
        b.backwards = true
      }this.$search.set(b);
      this.$find()
    };
    this.$find = function(b) {
      this.selection.isEmpty() || this.$search.set({needle:this.doc.getTextRange(this.getSelectionRange())});
      typeof b != "undefined" && this.$search.set({backwards:b});
      if(b = this.$search.find(this.doc)) {
        this.gotoLine(b.end.row + 1, b.end.column);
        this.$updateDesiredColumn();
        this.selection.setSelectionRange(b)
      }
    };
    this.undo = function() {
      this.doc.getUndoManager().undo()
    };
    this.redo = function() {
      this.doc.getUndoManager().redo()
    }
  }).call(i.prototype);
  g.Editor = i
});
define("ace/undomanager", ["require", "exports", "module"], function(i, g) {
  i = function() {
    this.$undoStack = [];
    this.$redoStack = []
  };
  (function() {
    this.execute = function(l) {
      var e = l.args[0];
      this.$doc = l.args[1];
      this.$undoStack.push(e)
    };
    this.undo = function() {
      var l = this.$undoStack.pop();
      if(l) {
        this.$doc.undoChanges(l);
        this.$redoStack.push(l)
      }
    };
    this.redo = function() {
      var l = this.$redoStack.pop();
      if(l) {
        this.$doc.redoChanges(l);
        this.$undoStack.push(l)
      }
    }
  }).call(i.prototype);
  g.UndoManager = i
});
define("pilot/dom", ["require", "exports", "module"], function(i, g) {
  g.setText = function(l, e) {
    if(l.innerText !== undefined) {
      l.innerText = e
    }if(l.textContent !== undefined) {
      l.textContent = e
    }
  };
  g.hasCssClass = function(l, e) {
    return l.className.split(/\s+/g).indexOf(e) !== -1
  };
  g.addCssClass = function(l, e) {
    g.hasCssClass(l, e) || (l.className += " " + e)
  };
  g.setCssClass = function(l, e, j) {
    j ? g.addCssClass(l, e) : g.removeCssClass(l, e)
  };
  g.removeCssClass = function(l, e) {
    for(var j = l.className.split(/\s+/g);;) {
      var o = j.indexOf(e);
      if(o == -1) {
        break
      }j.splice(o, 1)
    }l.className = j.join(" ")
  };
  g.importCssString = function(l, e) {
    e = e || document;
    if(e.createStyleSheet) {
      e.createStyleSheet().cssText = l
    }else {
      var j = e.createElement("style");
      j.appendChild(e.createTextNode(l));
      e.getElementsByTagName("head")[0].appendChild(j)
    }
  };
  g.getInnerWidth = function(l) {
    return parseInt(g.computedStyle(l, "paddingLeft")) + parseInt(g.computedStyle(l, "paddingRight")) + l.clientWidth
  };
  g.getInnerHeight = function(l) {
    return parseInt(g.computedStyle(l, "paddingTop")) + parseInt(g.computedStyle(l, "paddingBottom")) + l.clientHeight
  };
  g.computedStyle = function(l, e) {
    return window.getComputedStyle ? (window.getComputedStyle(l, "") || {})[e] || "" : l.currentStyle[e]
  };
  g.scrollbarWidth = function() {
    var l = document.createElement("p");
    l.style.width = "100%";
    l.style.height = "200px";
    var e = document.createElement("div"), j = e.style;
    j.position = "absolute";
    j.left = "-10000px";
    j.overflow = "hidden";
    j.width = "200px";
    j.height = "150px";
    e.appendChild(l);
    document.body.appendChild(e);
    var o = l.offsetWidth;
    j.overflow = "scroll";
    l = l.offsetWidth;
    if(o == l) {
      l = e.clientWidth
    }document.body.removeChild(e);
    return o - l
  };
  g.setInnerHtml = function(l, e) {
    var j = l.cloneNode(false);
    j.innerHTML = e;
    l.parentNode.replaceChild(j, l);
    return j
  };
  g.getParentWindow = function(l) {
    return l.defaultView || l.parentWindow
  }
});
define("ace/layer/gutter", ["require", "exports", "module", "pilot/dom"], function(i, g) {
  var l = i("pilot/dom");
  i = function(e) {
    this.element = document.createElement("div");
    this.element.className = "ace_layer ace_gutter-layer";
    e.appendChild(this.element);
    this.$breakpoints = [];
    this.$decorations = []
  };
  (function() {
    this.addGutterDecoration = function(e, j) {
      this.$decorations[e] || (this.$decorations[e] = "");
      this.$decorations[e] += " ace_" + j
    };
    this.removeGutterDecoration = function(e, j) {
      this.$decorations[e] = this.$decorations[e].replace(" ace_" + j, "")
    };
    this.setBreakpoints = function(e) {
      this.$breakpoints = e.concat()
    };
    this.update = function(e) {
      this.$config = e;
      for(var j = [], o = e.firstRow;o <= e.lastRow;o++) {
        j.push("<div class='ace_gutter-cell", this.$decorations[o] || "", this.$breakpoints[o] ? " ace_breakpoint" : "", "' style='height:", e.lineHeight, "px;'>", o + 1, "</div>");
        j.push("</div>")
      }this.element = l.setInnerHtml(this.element, j.join(""));
      this.element.style.height = e.minHeight + "px"
    }
  }).call(i.prototype);
  g.Gutter = i
});
define("ace/layer/marker", ["require", "exports", "module", "ace/range", "pilot/dom"], function(i, g) {
  var l = i("ace/range").Range, e = i("pilot/dom");
  i = function(j) {
    this.element = document.createElement("div");
    this.element.className = "ace_layer ace_marker-layer";
    j.appendChild(this.element);
    this.markers = {};
    this.$markerId = 1
  };
  (function() {
    this.setDocument = function(j) {
      this.doc = j
    };
    this.addMarker = function(j, o, d) {
      var k = this.$markerId++;
      this.markers[k] = {range:j, type:d || "line", clazz:o};
      return k
    };
    this.removeMarker = function(j) {
      this.markers[j] && delete this.markers[j]
    };
    this.update = function(j) {
      if(j = j || this.config) {
        this.config = j;
        var o = [];
        for(var d in this.markers) {
          var k = this.markers[d], a = k.range.clipRows(j.firstRow, j.lastRow);
          if(!a.isEmpty()) {
            if(a.isMultiLine()) {
              k.type == "text" ? this.drawTextMarker(o, a, k.clazz, j) : this.drawMultiLineMarker(o, a, k.clazz, j)
            }else {
              this.drawSingleLineMarker(o, a, k.clazz, j)
            }
          }
        }this.element = e.setInnerHtml(this.element, o.join(""))
      }
    };
    this.drawTextMarker = function(j, o, d, k) {
      var a = o.start.row, f = new l(a, o.start.column, a, this.doc.getLine(a).length);
      this.drawSingleLineMarker(j, f, d, k, 1);
      a = o.end.row;
      f = new l(a, 0, a, o.end.column);
      this.drawSingleLineMarker(j, f, d, k);
      for(a = o.start.row + 1;a < o.end.row;a++) {
        f.start.row = a;
        f.end.row = a;
        f.end.column = this.doc.getLine(a).length;
        this.drawSingleLineMarker(j, f, d, k, 1)
      }
    };
    this.drawMultiLineMarker = function(j, o, d, k) {
      o = o.toScreenRange(this.doc);
      var a = k.lineHeight, f = Math.round(k.width - o.start.column * k.characterWidth), h = (o.start.row - k.firstRow) * k.lineHeight, m = Math.round(o.start.column * k.characterWidth);
      j.push("<div class='", d, "' style='", "height:", a, "px;", "width:", f, "px;", "top:", h, "px;", "left:", m, "px;'></div>");
      h = (o.end.row - k.firstRow) * k.lineHeight;
      f = Math.round(o.end.column * k.characterWidth);
      j.push("<div class='", d, "' style='", "height:", a, "px;", "top:", h, "px;", "width:", f, "px;'></div>");
      a = (o.end.row - o.start.row - 1) * k.lineHeight;
      if(!(a < 0)) {
        h = (o.start.row + 1 - k.firstRow) * k.lineHeight;
        j.push("<div class='", d, "' style='", "height:", a, "px;", "width:", k.width, "px;", "top:", h, "px;'></div>")
      }
    };
    this.drawSingleLineMarker = function(j, o, d, k, a) {
      o = o.toScreenRange(this.doc);
      var f = k.lineHeight;
      a = Math.round((o.end.column + (a || 0) - o.start.column) * k.characterWidth);
      var h = (o.start.row - k.firstRow) * k.lineHeight;
      o = Math.round(o.start.column * k.characterWidth);
      j.push("<div class='", d, "' style='", "height:", f, "px;", "width:", a, "px;", "top:", h, "px;", "left:", o, "px;'></div>")
    }
  }).call(i.prototype);
  g.Marker = i
});
define("ace/layer/text", ["require", "exports", "module", "pilot/oop", "pilot/dom", "pilot/lang", "pilot/event_emitter"], function(i, g) {
  var l = i("pilot/oop"), e = i("pilot/dom"), j = i("pilot/lang"), o = i("pilot/event_emitter").EventEmitter;
  i = function(d) {
    this.element = document.createElement("div");
    this.element.className = "ace_layer ace_text-layer";
    d.appendChild(this.element);
    this.$characterSize = this.$measureSizes();
    this.$pollSizeChanges()
  };
  (function() {
    l.implement(this, o);
    this.EOF_CHAR = "&para;";
    this.EOL_CHAR = "&not;";
    this.TAB_CHAR = "&rarr;";
    this.SPACE_CHAR = "&middot;";
    this.setTokenizer = function(d) {
      this.tokenizer = d
    };
    this.getLineHeight = function() {
      return this.$characterSize.height || 1
    };
    this.getCharacterWidth = function() {
      return this.$characterSize.width || 1
    };
    this.$pollSizeChanges = function() {
      var d = this;
      setInterval(function() {
        var k = d.$measureSizes();
        if(d.$characterSize.width !== k.width || d.$characterSize.height !== k.height) {
          d.$characterSize = k;
          d._dispatchEvent("changeCharaterSize", {data:k})
        }
      }, 500)
    };
    this.$fontStyles = {fontFamily:1, fontSize:1, fontWeight:1, fontStyle:1, lineHeight:1};
    this.$measureSizes = function() {
      if(!this.$measureNode) {
        var d = this.$measureNode = document.createElement("div"), k = d.style;
        k.width = k.height = "auto";
        k.left = k.top = "-1000px";
        k.visibility = "hidden";
        k.position = "absolute";
        k.overflow = "visible";
        k.whiteSpace = "nowrap";
        d.innerHTML = j.stringRepeat("Xy", 1E3);
        document.body.insertBefore(d, document.body.firstChild)
      }k = this.$measureNode.style;
      for(var a in this.$fontStyles) {
        d = e.computedStyle(this.element, a);
        k[a] = d
      }return{height:this.$measureNode.offsetHeight, width:this.$measureNode.offsetWidth / 2E3}
    };
    this.setDocument = function(d) {
      this.doc = d
    };
    this.showInvisibles = false;
    this.setShowInvisibles = function(d) {
      if(this.showInvisibles == d) {
        return false
      }this.showInvisibles = d;
      return true
    };
    this.$computeTabString = function() {
      var d = this.doc.getTabSize();
      if(this.showInvisibles) {
        d = d / 2;
        this.$tabString = "<span class='ace_invisible'>" + (new Array(Math.floor(d))).join("&nbsp;") + this.TAB_CHAR + (new Array(Math.ceil(d) + 1)).join("&nbsp;") + "</span>"
      }else {
        this.$tabString = (new Array(d + 1)).join("&nbsp;")
      }
    };
    this.updateLines = function(d, k, a) {
      this.$computeTabString();
      this.config = d;
      var f = Math.max(k, d.firstRow), h = Math.min(a, d.lastRow), m = this.element.childNodes, b = this;
      this.tokenizer.getTokens(f, h, function(c) {
        for(var n = f;n <= h;n++) {
          var p = m[n - d.firstRow];
          if(p) {
            var r = [];
            b.$renderLine(r, n, c[n - f].tokens);
            e.setInnerHtml(p, r.join)
          }
        }
      })
    };
    this.scrollLines = function(d) {
      function k(c) {
        d.firstRow < h.firstRow ? f.$renderLinesFragment(d, d.firstRow, h.firstRow - 1, function(n) {
          m.firstChild ? m.insertBefore(n, m.firstChild) : m.appendChild(n);
          c()
        }) : c()
      }
      function a() {
        d.lastRow > h.lastRow && f.$renderLinesFragment(d, h.lastRow + 1, d.lastRow, function(c) {
          m.appendChild(c)
        })
      }
      var f = this;
      this.$computeTabString();
      var h = this.config;
      this.config = d;
      if(!h || h.lastRow < d.firstRow) {
        return this.update(d)
      }if(d.lastRow < h.firstRow) {
        return this.update(d)
      }var m = this.element;
      if(h.firstRow < d.firstRow) {
        for(var b = h.firstRow;b < d.firstRow;b++) {
          m.removeChild(m.firstChild)
        }
      }if(h.lastRow > d.lastRow) {
        for(b = d.lastRow + 1;b <= h.lastRow;b++) {
          m.removeChild(m.lastChild)
        }
      }k(a)
    };
    this.$renderLinesFragment = function(d, k, a, f) {
      var h = document.createDocumentFragment(), m = this;
      this.tokenizer.getTokens(k, a, function(b) {
        for(var c = k;c <= a;c++) {
          var n = document.createElement("div");
          n.className = "ace_line";
          var p = n.style;
          p.height = m.$characterSize.height + "px";
          p.width = d.width + "px";
          p = [];
          m.$renderLine(p, c, b[c - k].tokens);
          n.innerHTML = p.join("");
          h.appendChild(n)
        }f(h)
      })
    };
    this.update = function(d) {
      this.$computeTabString();
      this.config = d;
      var k = [], a = this;
      this.tokenizer.getTokens(d.firstRow, d.lastRow, function(f) {
        for(var h = d.firstRow;h <= d.lastRow;h++) {
          k.push("<div class='ace_line' style='height:" + a.$characterSize.height + "px;", "width:", d.width, "px'>");
          a.$renderLine(k, h, f[h - d.firstRow].tokens);
          k.push("</div>")
        }a.element = e.setInnerHtml(a.element, k.join(""))
      })
    };
    this.$textToken = {text:true, rparen:true, lparen:true};
    this.$renderLine = function(d, k, a) {
      for(var f = /[\v\f \u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000]/g, h = 0;h < a.length;h++) {
        var m = a[h], b = m.value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(f, "&nbsp;").replace(/\t/g, this.$tabString);
        if(this.$textToken[m.type]) {
          d.push(b)
        }else {
          m = "ace_" + m.type.replace(/\./g, " ace_");
          d.push("<span class='", m, "'>", b, "</span>")
        }
      }if(this.showInvisibles) {
        k !== this.doc.getLength() - 1 ? d.push("<span class='ace_invisible'>" + this.EOL_CHAR + "</span>") : d.push("<span class='ace_invisible'>" + this.EOF_CHAR + "</span>")
      }
    }
  }).call(i.prototype);
  g.Text = i
});
define("ace/layer/cursor", ["require", "exports", "module", "pilot/dom"], function(i, g) {
  var l = i("pilot/dom");
  i = function(e) {
    this.element = document.createElement("div");
    this.element.className = "ace_layer ace_cursor-layer";
    e.appendChild(this.element);
    this.cursor = document.createElement("div");
    this.cursor.className = "ace_cursor";
    this.isVisible = false
  };
  (function() {
    this.setDocument = function(e) {
      this.doc = e
    };
    this.setCursor = function(e, j) {
      this.position = {row:e.row, column:this.doc.documentToScreenColumn(e.row, e.column)};
      j ? l.addCssClass(this.cursor, "ace_overwrite") : l.removeCssClass(this.cursor, "ace_overwrite")
    };
    this.hideCursor = function() {
      this.isVisible = false;
      this.cursor.parentNode && this.cursor.parentNode.removeChild(this.cursor);
      clearInterval(this.blinkId)
    };
    this.showCursor = function() {
      this.isVisible = true;
      this.element.appendChild(this.cursor);
      this.cursor.style.visibility = "visible";
      this.restartTimer()
    };
    this.restartTimer = function() {
      clearInterval(this.blinkId);
      if(this.isVisible) {
        var e = this.cursor;
        this.blinkId = setInterval(function() {
          e.style.visibility = "hidden";
          setTimeout(function() {
            e.style.visibility = "visible"
          }, 400)
        }, 1E3)
      }
    };
    this.getPixelPosition = function() {
      if(!this.config || !this.position) {
        return{left:0, top:0}
      }var e = this.position.row * this.config.lineHeight;
      return{left:Math.round(this.position.column * this.config.characterWidth), top:e}
    };
    this.update = function(e) {
      if(this.position) {
        this.config = e;
        var j = Math.round(this.position.column * e.characterWidth), o = this.position.row * e.lineHeight;
        this.pixelPos = {left:j, top:o};
        this.cursor.style.left = j + "px";
        this.cursor.style.top = o - e.firstRow * e.lineHeight + "px";
        this.cursor.style.width = e.characterWidth + "px";
        this.cursor.style.height = e.lineHeight + "px";
        this.isVisible && this.element.appendChild(this.cursor);
        this.restartTimer()
      }
    }
  }).call(i.prototype);
  g.Cursor = i
});
define("ace/scrollbar", ["require", "exports", "module", "pilot/oop", "pilot/dom", "pilot/event", "pilot/event_emitter"], function(i, g) {
  var l = i("pilot/oop"), e = i("pilot/dom"), j = i("pilot/event"), o = i("pilot/event_emitter").EventEmitter;
  i = function(d) {
    this.element = document.createElement("div");
    this.element.className = "ace_sb";
    this.inner = document.createElement("div");
    this.element.appendChild(this.inner);
    d.appendChild(this.element);
    this.width = e.scrollbarWidth();
    this.element.style.width = this.width;
    j.addListener(this.element, "scroll", this.onScroll.bind(this))
  };
  (function() {
    l.implement(this, o);
    this.onScroll = function() {
      this._dispatchEvent("scroll", {data:this.element.scrollTop})
    };
    this.getWidth = function() {
      return this.width
    };
    this.setHeight = function(d) {
      this.element.style.height = Math.max(0, d - this.width) + "px"
    };
    this.setInnerHeight = function(d) {
      this.inner.style.height = d + "px"
    };
    this.setScrollTop = function(d) {
      this.element.scrollTop = d
    }
  }).call(i.prototype);
  g.ScrollBar = i
});
define("ace/renderloop", ["require", "exports", "module", "pilot/event"], function(i, g) {
  var l = i("pilot/event");
  i = function(e) {
    this.onRender = e;
    this.pending = false;
    this.changes = 0
  };
  (function() {
    this.schedule = function(e) {
      this.changes |= e;
      if(!this.pending) {
        this.pending = true;
        var j = this;
        this.setTimeoutZero(function() {
          j.pending = false;
          var o = j.changes;
          j.changes = 0;
          j.onRender(o)
        })
      }
    };
    if(window.postMessage) {
      this.messageName = "zero-timeout-message";
      this.setTimeoutZero = function(e) {
        if(!this.attached) {
          var j = this;
          l.addListener(window, "message", function(o) {
            if(o.source == window && j.callback && o.data == j.messageName) {
              l.stopPropagation(o);
              j.callback()
            }
          });
          this.attached = true
        }this.callback = e;
        window.postMessage(this.messageName, "*")
      }
    }else {
      this.setTimeoutZero = function(e) {
        setTimeout(e, 0)
      }
    }
  }).call(i.prototype);
  g.RenderLoop = i
});
define("ace/virtual_renderer", ["require", "exports", "module", "pilot/oop", "pilot/dom", "pilot/event", "ace/layer/gutter", "ace/layer/marker", "ace/layer/text", "ace/layer/cursor", "ace/scrollbar", "ace/renderloop", "pilot/event_emitter", 'text!ace/css/editor.css!.ace_editor {\n  position: absolute;\n  overflow: hidden;\n\n  font-family: "Menlo", "Monaco", "Courier New", monospace;\n  font-size: 12px;  \n}\n\n.ace_scroller {\n  position: absolute;\n  overflow-x: scroll;\n  overflow-y: hidden;     \n}\n\n.ace_gutter {\n  position: absolute;\n  overflow-x: hidden;\n  overflow-y: hidden;\n  height: 100%;\n}\n\n.ace_editor .ace_sb {\n  position: absolute;\n  overflow-x: hidden;\n  overflow-y: scroll;\n  right: 0;\n}\n\n.ace_editor .ace_sb div {\n  position: absolute;\n  width: 1px;\n  left: 0px;\n}\n\n.ace_editor .ace_printMargin {\n  position: absolute;\n  height: 100%;\n}\n\n.ace_layer {\n  z-index: 0;\n  position: absolute;\n  overflow: hidden;  \n  white-space: nowrap;\n  height: 100%;\n}\n\n.ace_text-layer {\n  font-family: Monaco, "Courier New", monospace;\n  color: black;\n}\n\n.ace_cursor-layer {\n  cursor: text;\n}\n\n.ace_cursor {\n  z-index: 3;\n  position: absolute;\n}\n\n.ace_line {\n  white-space: nowrap;\n}\n\n.ace_marker-layer {\n}\n\n.ace_marker-layer .ace_step {\n  position: absolute;\n  z-index: 2;\n}\n\n.ace_marker-layer .ace_selection {\n  position: absolute;\n  z-index: 3;\n}\n\n.ace_marker-layer .ace_bracket {\n  position: absolute;\n  z-index: 4;\n}\n\n.ace_marker-layer .ace_active_line {\n  position: absolute;\n  z-index: 1;\n}'], 
function(i, g) {
  var l = i("pilot/oop"), e = i("pilot/dom"), j = i("pilot/event"), o = i("ace/layer/gutter").Gutter, d = i("ace/layer/marker").Marker, k = i("ace/layer/text").Text, a = i("ace/layer/cursor").Cursor, f = i("ace/scrollbar").ScrollBar, h = i("ace/renderloop").RenderLoop, m = i("pilot/event_emitter").EventEmitter, b = i('text!ace/css/editor.css!.ace_editor {\n  position: absolute;\n  overflow: hidden;\n\n  font-family: "Menlo", "Monaco", "Courier New", monospace;\n  font-size: 12px;  \n}\n\n.ace_scroller {\n  position: absolute;\n  overflow-x: scroll;\n  overflow-y: hidden;     \n}\n\n.ace_gutter {\n  position: absolute;\n  overflow-x: hidden;\n  overflow-y: hidden;\n  height: 100%;\n}\n\n.ace_editor .ace_sb {\n  position: absolute;\n  overflow-x: hidden;\n  overflow-y: scroll;\n  right: 0;\n}\n\n.ace_editor .ace_sb div {\n  position: absolute;\n  width: 1px;\n  left: 0px;\n}\n\n.ace_editor .ace_printMargin {\n  position: absolute;\n  height: 100%;\n}\n\n.ace_layer {\n  z-index: 0;\n  position: absolute;\n  overflow: hidden;  \n  white-space: nowrap;\n  height: 100%;\n}\n\n.ace_text-layer {\n  font-family: Monaco, "Courier New", monospace;\n  color: black;\n}\n\n.ace_cursor-layer {\n  cursor: text;\n}\n\n.ace_cursor {\n  z-index: 3;\n  position: absolute;\n}\n\n.ace_line {\n  white-space: nowrap;\n}\n\n.ace_marker-layer {\n}\n\n.ace_marker-layer .ace_step {\n  position: absolute;\n  z-index: 2;\n}\n\n.ace_marker-layer .ace_selection {\n  position: absolute;\n  z-index: 3;\n}\n\n.ace_marker-layer .ace_bracket {\n  position: absolute;\n  z-index: 4;\n}\n\n.ace_marker-layer .ace_active_line {\n  position: absolute;\n  z-index: 1;\n}');
  e.importCssString(b);
  b = function(c, n) {
    this.container = c;
    e.addCssClass(this.container, "ace_editor");
    this.setTheme(n);
    this.$gutter = document.createElement("div");
    this.$gutter.className = "ace_gutter";
    this.container.appendChild(this.$gutter);
    this.scroller = document.createElement("div");
    this.scroller.className = "ace_scroller";
    this.container.appendChild(this.scroller);
    this.content = document.createElement("div");
    this.content.style.position = "absolute";
    this.scroller.appendChild(this.content);
    this.$gutterLayer = new o(this.$gutter);
    this.$markerLayer = new d(this.content);
    var p = this.$textLayer = new k(this.content);
    this.canvas = p.element;
    this.characterWidth = p.getCharacterWidth();
    this.lineHeight = p.getLineHeight();
    this.$cursorLayer = new a(this.content);
    this.layers = [this.$markerLayer, p, this.$cursorLayer];
    this.scrollBar = new f(c);
    this.scrollBar.addEventListener("scroll", this.onScroll.bind(this));
    this.scrollTop = 0;
    this.cursorPos = {row:0, column:0};
    var r = this;
    this.$textLayer.addEventListener("changeCharaterSize", function() {
      r.characterWidth = p.getCharacterWidth();
      r.lineHeight = p.getLineHeight();
      r.$loop.schedule(r.CHANGE_FULL)
    });
    j.addListener(this.$gutter, "click", this.$onGutterClick.bind(this));
    j.addListener(this.$gutter, "dblclick", this.$onGutterClick.bind(this));
    this.$size = {width:0, height:0, scrollerHeight:0, scrollerWidth:0};
    this.$loop = new h(this.$renderChanges.bind(this));
    this.$loop.schedule(this.CHANGE_FULL);
    this.$updatePrintMargin();
    this.setPadding(4)
  };
  (function() {
    this.showGutter = true;
    this.CHANGE_CURSOR = 1;
    this.CHANGE_MARKER = 2;
    this.CHANGE_GUTTER = 4;
    this.CHANGE_SCROLL = 8;
    this.CHANGE_LINES = 16;
    this.CHANGE_TEXT = 32;
    this.CHANGE_SIZE = 64;
    this.CHANGE_FULL = 128;
    l.implement(this, m);
    this.setDocument = function(c) {
      this.lines = c.lines;
      this.doc = c;
      this.$cursorLayer.setDocument(c);
      this.$markerLayer.setDocument(c);
      this.$textLayer.setDocument(c);
      this.$loop.schedule(this.CHANGE_FULL)
    };
    this.updateLines = function(c, n) {
      if(n === undefined) {
        n = Infinity
      }if(this.$changedLines) {
        if(this.$changedLines.firstRow > c) {
          this.$changedLines.firstRow = c
        }if(this.$changedLines.lastRow < n) {
          this.$changedLines.lastRow = n
        }
      }else {
        this.$changedLines = {firstRow:c, lastRow:n}
      }this.$loop.schedule(this.CHANGE_LINES)
    };
    this.updateText = function() {
      this.$loop.schedule(this.CHANGE_TEXT)
    };
    this.updateFull = function() {
      this.$loop.schedule(this.CHANGE_FULL)
    };
    this.onResize = function() {
      var c = this.CHANGE_SIZE, n = e.getInnerHeight(this.container);
      if(this.$size.height != n) {
        this.$size.height = n;
        this.scroller.style.height = n + "px";
        this.scrollBar.setHeight(n);
        if(this.doc) {
          this.scrollToY(this.getScrollTop());
          c |= this.CHANGE_FULL
        }
      }n = e.getInnerWidth(this.container);
      if(this.$size.width != n) {
        this.$size.width = n;
        var p = this.showGutter ? this.$gutter.offsetWidth : 0;
        this.scroller.style.left = p + "px";
        this.scroller.style.width = Math.max(0, n - p - this.scrollBar.getWidth()) + "px"
      }this.$size.scrollerWidth = this.scroller.clientWidth;
      this.$size.scrollerHeight = this.scroller.clientHeight;
      this.$loop.schedule(c)
    };
    this.setTokenizer = function(c) {
      this.$tokenizer = c;
      this.$textLayer.setTokenizer(c);
      this.$loop.schedule(this.CHANGE_TEXT)
    };
    this.$onGutterClick = function(c) {
      var n = j.getDocumentX(c), p = j.getDocumentY(c);
      this._dispatchEvent("gutter" + c.type, {row:this.screenToTextCoordinates(n, p).row, htmlEvent:c})
    };
    this.setShowInvisibles = function(c) {
      this.$textLayer.setShowInvisibles(c) && this.$loop.schedule(this.CHANGE_TEXT)
    };
    this.getShowInvisibles = function() {
      return this.$textLayer.showInvisibles
    };
    this.$showPrintMargin = true;
    this.setShowPrintMargin = function(c) {
      this.$showPrintMargin = c;
      this.$updatePrintMargin()
    };
    this.getShowPrintMargin = function() {
      return this.$showPrintMargin
    };
    this.$printMarginColumn = 80;
    this.setPrintMarginColumn = function(c) {
      this.$printMarginColumn = c;
      this.$updatePrintMargin()
    };
    this.getPrintMarginColumn = function() {
      return this.$printMarginColumn
    };
    this.setShowGutter = function(c) {
      this.$gutter.style.display = c ? "block" : "none";
      this.showGutter = c;
      this.onResize()
    };
    this.$updatePrintMargin = function() {
      if(this.$showPrintMargin || this.$printMarginEl) {
        if(!this.$printMarginEl) {
          this.$printMarginEl = document.createElement("div");
          this.$printMarginEl.className = "ace_printMargin";
          this.content.insertBefore(this.$printMarginEl, this.$textLayer.element)
        }var c = this.$printMarginEl.style;
        c.left = this.characterWidth * this.$printMarginColumn + "px";
        c.visibility = this.$showPrintMargin ? "visible" : "hidden"
      }
    };
    this.getContainerElement = function() {
      return this.container
    };
    this.getMouseEventTarget = function() {
      return this.content
    };
    this.getFirstVisibleRow = function() {
      return(this.layerConfig || {}).firstRow || 0
    };
    this.getFirstFullyVisibleRow = function() {
      if(!this.layerConfig) {
        return 0
      }return this.layerConfig.firstRow + (this.layerConfig.offset == 0 ? 0 : 1)
    };
    this.getLastFullyVisibleRow = function() {
      if(!this.layerConfig) {
        return 0
      }return this.layerConfig.firstRow - 1 + Math.floor((this.layerConfig.height + this.layerConfig.offset) / this.layerConfig.lineHeight)
    };
    this.getLastVisibleRow = function() {
      return(this.layerConfig || {}).lastRow || 0
    };
    this.$padding = null;
    this.setPadding = function(c) {
      this.$padding = c;
      this.content.style.padding = "0 " + c + "px";
      this.$loop.schedule(this.CHANGE_FULL)
    };
    this.onScroll = function(c) {
      this.scrollToY(c.data)
    };
    this.$updateScrollBar = function() {
      this.scrollBar.setInnerHeight(this.doc.getLength() * this.lineHeight);
      this.scrollBar.setScrollTop(this.scrollTop)
    };
    this.$renderChanges = function(c) {
      if(!(!c || !this.doc || !this.$tokenizer)) {
        if(!this.layerConfig || c & this.CHANGE_FULL || c & this.CHANGE_SIZE || c & this.CHANGE_TEXT || c & this.CHANGE_LINES || c & this.CHANGE_SCROLL) {
          this.$computeLayerConfig()
        }if(c & this.CHANGE_FULL) {
          this.$textLayer.update(this.layerConfig);
          this.showGutter && this.$gutterLayer.update(this.layerConfig);
          this.$markerLayer.update(this.layerConfig);
          this.$cursorLayer.update(this.layerConfig);
          this.$updateScrollBar()
        }else {
          if(c & this.CHANGE_SCROLL) {
            c & this.CHANGE_TEXT || c & this.CHANGE_LINES ? this.$textLayer.update(this.layerConfig) : this.$textLayer.scrollLines(this.layerConfig);
            this.showGutter && this.$gutterLayer.update(this.layerConfig);
            this.$markerLayer.update(this.layerConfig);
            this.$cursorLayer.update(this.layerConfig);
            this.$updateScrollBar()
          }else {
            if(c & this.CHANGE_TEXT) {
              this.$textLayer.update(this.layerConfig);
              this.showGutter && this.$gutterLayer.update(this.layerConfig)
            }else {
              if(c & this.CHANGE_LINES) {
                this.$updateLines();
                this.$updateScrollBar();
                this.showGutter && this.$gutterLayer.update(this.layerConfig)
              }else {
                c & this.CHANGE_GUTTER && this.showGutter && this.$gutterLayer.update(this.layerConfig)
              }
            }c & this.CHANGE_CURSOR && this.$cursorLayer.update(this.layerConfig);
            c & this.CHANGE_MARKER && this.$markerLayer.update(this.layerConfig);
            c & this.CHANGE_SIZE && this.$updateScrollBar()
          }
        }
      }
    };
    this.$computeLayerConfig = function() {
      var c = this.scrollTop % this.lineHeight, n = this.$size.scrollerHeight + this.lineHeight, p = this.$getLongestLine(), r = !this.layerConfig ? true : this.layerConfig.width != p, t = Math.ceil(n / this.lineHeight), q = Math.max(0, Math.round((this.scrollTop - c) / this.lineHeight));
      t = Math.max(0, Math.min(this.lines.length, q + t) - 1);
      this.layerConfig = {width:p, padding:this.$padding, firstRow:q, lastRow:t, lineHeight:this.lineHeight, characterWidth:this.characterWidth, minHeight:n, offset:c, height:this.$size.scrollerHeight};
      for(q = 0;q < this.layers.length;q++) {
        t = this.layers[q];
        if(r) {
          t.element.style.width = p + "px"
        }
      }this.$gutterLayer.element.style.marginTop = -c + "px";
      this.content.style.marginTop = -c + "px";
      this.content.style.width = p + "px";
      this.content.style.height = n + "px"
    };
    this.$updateLines = function() {
      var c = this.$changedLines.firstRow, n = this.$changedLines.lastRow;
      this.$changedLines = null;
      var p = this.layerConfig;
      if(p.width != this.$getLongestLine()) {
        return this.$textLayer.update(p)
      }if(!(c > p.lastRow + 1)) {
        if(!(n < p.firstRow)) {
          if(n === Infinity) {
            this.showGutter && this.$gutterLayer.update(p);
            this.$textLayer.update(p)
          }else {
            this.$textLayer.updateLines(p, c, n)
          }
        }
      }
    };
    this.$getLongestLine = function() {
      var c = this.doc.getScreenWidth();
      if(this.$textLayer.showInvisibles) {
        c += 1
      }return Math.max(this.$size.scrollerWidth - this.$padding * 2, Math.round(c * this.characterWidth))
    };
    this.addMarker = function(c, n, p) {
      c = this.$markerLayer.addMarker(c, n, p);
      this.$loop.schedule(this.CHANGE_MARKER);
      return c
    };
    this.removeMarker = function(c) {
      this.$markerLayer.removeMarker(c);
      this.$loop.schedule(this.CHANGE_MARKER)
    };
    this.addGutterDecoration = function(c, n) {
      this.$gutterLayer.addGutterDecoration(c, n);
      this.$loop.schedule(this.CHANGE_GUTTER)
    };
    this.removeGutterDecoration = function(c, n) {
      this.$gutterLayer.removeGutterDecoration(c, n);
      this.$loop.schedule(this.CHANGE_GUTTER)
    };
    this.setBreakpoints = function(c) {
      this.$gutterLayer.setBreakpoints(c);
      this.$loop.schedule(this.CHANGE_GUTTER)
    };
    this.updateCursor = function(c, n) {
      this.$cursorLayer.setCursor(c, n);
      this.$loop.schedule(this.CHANGE_CURSOR)
    };
    this.hideCursor = function() {
      this.$cursorLayer.hideCursor()
    };
    this.showCursor = function() {
      this.$cursorLayer.showCursor()
    };
    this.scrollCursorIntoView = function() {
      var c = this.$cursorLayer.getPixelPosition(), n = c.left + this.$padding;
      c = c.top;
      this.getScrollTop() > c && this.scrollToY(c);
      this.getScrollTop() + this.$size.scrollerHeight < c + this.lineHeight && this.scrollToY(c + this.lineHeight - this.$size.scrollerHeight);
      this.scroller.scrollLeft > n && this.scrollToX(n);
      this.scroller.scrollLeft + this.$size.scrollerWidth < n + this.characterWidth && this.scrollToX(Math.round(n + this.characterWidth - this.$size.scrollerWidth))
    };
    this.getScrollTop = function() {
      return this.scrollTop
    };
    this.getScrollLeft = function() {
      return this.scroller.scrollLeft
    };
    this.getScrollTopRow = function() {
      return this.scrollTop / this.lineHeight
    };
    this.scrollToRow = function(c) {
      this.scrollToY(c * this.lineHeight)
    };
    this.scrollToY = function(c) {
      c = Math.max(0, Math.min(this.lines.length * this.lineHeight - this.$size.scrollerHeight, c));
      if(this.scrollTop !== c) {
        this.scrollTop = c;
        this.$loop.schedule(this.CHANGE_SCROLL)
      }
    };
    this.scrollToX = function(c) {
      if(c <= this.$padding) {
        c = 0
      }this.scroller.scrollLeft = c
    };
    this.scrollBy = function(c, n) {
      n && this.scrollToY(this.scrollTop + n);
      c && this.scrollToX(this.scroller.scrollLeft + c)
    };
    this.screenToTextCoordinates = function(c, n) {
      var p = this.scroller.getBoundingClientRect();
      c = Math.round((c + this.scroller.scrollLeft - p.left - this.$padding) / this.characterWidth);
      n = Math.floor((n + this.scrollTop - p.top) / this.lineHeight);
      return{row:n, column:this.doc.screenToDocumentColumn(Math.max(0, Math.min(n, this.doc.getLength() - 1)), c)}
    };
    this.textToScreenCoordinates = function(c, n) {
      var p = this.scroller.getBoundingClientRect();
      n = this.$padding + Math.round(this.doc.documentToScreenColumn(c, n) * this.characterWidth);
      c = c * this.lineHeight;
      return{pageX:p.left + n - this.getScrollLeft(), pageY:p.top + c - this.getScrollTop()}
    };
    this.visualizeFocus = function() {
      e.addCssClass(this.container, "ace_focus")
    };
    this.visualizeBlur = function() {
      e.removeCssClass(this.container, "ace_focus")
    };
    this.showComposition = function() {
    };
    this.setCompositionText = function() {
    };
    this.hideComposition = function() {
    };
    this.setTheme = function(c) {
      function n(r) {
        p.$theme && e.removeCssClass(p.container, p.$theme);
        p.$theme = r ? r.cssClass : null;
        p.$theme && e.addCssClass(p.container, p.$theme);
        if(p.$size) {
          p.$size.width = 0;
          p.onResize()
        }
      }
      var p = this;
      if(!c || typeof c == "string") {
        c = c || "ace/theme/textmate";
        i([c], function(r) {
          n(r)
        })
      }else {
        n(c)
      }p = this
    }
  }).call(b.prototype);
  g.VirtualRenderer = b
});
define("ace/mode/doc_comment_highlight_rules", ["require", "exports", "module", "pilot/oop", "ace/mode/text_highlight_rules"], function(i, g) {
  var l = i("pilot/oop");
  i = i("ace/mode/text_highlight_rules").TextHighlightRules;
  var e = function() {
    this.$rules = {start:[{token:"comment.doc", regex:"\\*\\/", next:"start"}, {token:"comment.doc.tag", regex:"@[\\w\\d_]+"}, {token:"comment.doc", regex:"s+"}, {token:"comment.doc", regex:"TODO"}, {token:"comment.doc", regex:"[^@\\*]+"}, {token:"comment.doc", regex:"."}]}
  };
  l.inherits(e, i);
  (function() {
    this.getStartRule = function(j) {
      return{token:"comment.doc", regex:"\\/\\*(?=\\*)", next:j}
    }
  }).call(e.prototype);
  g.DocCommentHighlightRules = e
});
define("ace/mode/javascript_highlight_rules", ["require", "exports", "module", "pilot/oop", "pilot/lang", "ace/mode/doc_comment_highlight_rules", "ace/mode/text_highlight_rules"], function(i, g) {
  var l = i("pilot/oop"), e = i("pilot/lang"), j = i("ace/mode/doc_comment_highlight_rules").DocCommentHighlightRules;
  i = i("ace/mode/text_highlight_rules").TextHighlightRules;
  JavaScriptHighlightRules = function() {
    var o = new j, d = e.arrayToMap("break|case|catch|continue|default|delete|do|else|finally|for|function|if|in|instanceof|new|return|switch|throw|try|typeof|var|while|with".split("|")), k = e.arrayToMap("null|Infinity|NaN|undefined".split("|")), a = e.arrayToMap("class|enum|extends|super|const|export|import|implements|let|private|public|yield|interface|package|protected|static".split("|"));
    this.$rules = {start:[{token:"comment", regex:"\\/\\/.*$"}, o.getStartRule("doc-start"), {token:"comment", regex:"\\/\\*", next:"comment"}, {token:"string.regexp", regex:"[/](?:(?:\\[(?:\\\\]|[^\\]])+\\])|(?:\\\\/|[^\\]/]))*[/][gimy]*\\s*(?=[).,;]|$)"}, {token:"string", regex:'["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'}, {token:"string", regex:'["].*\\\\$', next:"qqstring"}, {token:"string", regex:"['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"}, {token:"string", regex:"['].*\\\\$", next:"qstring"}, {token:"constant.numeric", 
    regex:"0[xX][0-9a-fA-F]+\\b"}, {token:"constant.numeric", regex:"[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"}, {token:"constant.language.boolean", regex:"(?:true|false)\\b"}, {token:function(f) {
      return f == "this" ? "variable.language" : d[f] ? "keyword" : k[f] ? "constant.language" : a[f] ? "invalid.illegal" : f == "debugger" ? "invalid.deprecated" : "identifier"
    }, regex:"[a-zA-Z_$][a-zA-Z0-9_$]*\\b"}, {token:"keyword.operator", regex:"!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|\\b(?:in|instanceof|new|delete|typeof|void)"}, {token:"lparen", regex:"[[({]"}, {token:"rparen", regex:"[\\])}]"}, {token:"text", regex:"\\s+"}], comment:[{token:"comment", regex:".*?\\*\\/", next:"start"}, {token:"comment", regex:".+"}], qqstring:[{token:"string", regex:'(?:(?:\\\\.)|(?:[^"\\\\]))*?"', 
    next:"start"}, {token:"string", regex:".+"}], qstring:[{token:"string", regex:"(?:(?:\\\\.)|(?:[^'\\\\]))*?'", next:"start"}, {token:"string", regex:".+"}]};
    this.addRules(o.getRules(), "doc-");
    this.$rules["doc-start"][0].next = "start"
  };
  l.inherits(JavaScriptHighlightRules, i);
  g.JavaScriptHighlightRules = JavaScriptHighlightRules
});
define("ace/mode/matching_brace_outdent", ["require", "exports", "module", "ace/range"], function(i, g) {
  var l = i("ace/range").Range;
  i = function() {
  };
  (function() {
    this.checkOutdent = function(e, j) {
      if(!/^\s+$/.test(e)) {
        return false
      }return/^\s*\}/.test(j)
    };
    this.autoOutdent = function(e, j) {
      var o = e.getLine(j).match(/^(\s*\})/);
      if(!o) {
        return 0
      }o = o[1].length;
      var d = e.findMatchingBracket({row:j, column:o});
      if(!d || d.row == j) {
        return 0
      }d = this.$getIndent(e.getLine(d.row));
      e.replace(new l(j, 0, j, o - 1), d);
      return d.length - (o - 1)
    };
    this.$getIndent = function(e) {
      if(e = e.match(/^(\s+)/)) {
        return e[1]
      }return""
    }
  }).call(i.prototype);
  g.MatchingBraceOutdent = i
});
define("ace/mode/javascript", ["require", "exports", "module", "pilot/oop", "ace/mode/text", "ace/tokenizer", "ace/mode/javascript_highlight_rules", "ace/mode/matching_brace_outdent", "ace/range"], function(i, g) {
  var l = i("pilot/oop"), e = i("ace/mode/text").Mode, j = i("ace/tokenizer").Tokenizer, o = i("ace/mode/javascript_highlight_rules").JavaScriptHighlightRules, d = i("ace/mode/matching_brace_outdent").MatchingBraceOutdent, k = i("ace/range").Range;
  i = function() {
    this.$tokenizer = new j((new o).getRules());
    this.$outdent = new d
  };
  l.inherits(i, e);
  (function() {
    this.toggleCommentLines = function(a, f, h, m) {
      var b = true;
      a = /^(\s*)\/\//;
      for(var c = h;c <= m;c++) {
        if(!a.test(f.getLine(c))) {
          b = false;
          break
        }
      }if(b) {
        b = new k(0, 0, 0, 0);
        for(c = h;c <= m;c++) {
          h = f.getLine(c).replace(a, "$1");
          b.start.row = c;
          b.end.row = c;
          b.end.column = h.length + 2;
          f.replace(b, h)
        }return-2
      }else {
        return f.indentRows(h, m, "//")
      }
    };
    this.getNextLineIndent = function(a, f, h) {
      var m = this.$getIndent(f), b = this.$tokenizer.getLineTokens(f, a), c = b.tokens;
      b = b.state;
      if(c.length && c[c.length - 1].type == "comment") {
        return m
      }if(a == "start") {
        if(a = f.match(/^.*[\{\(\[]\s*$/)) {
          m += h
        }
      }else {
        if(a == "doc-start") {
          if(b == "start") {
            return""
          }if(a = f.match(/^\s*(\/?)\*/)) {
            if(a[1]) {
              m += " "
            }m += "* "
          }
        }
      }return m
    };
    this.checkOutdent = function(a, f, h) {
      return this.$outdent.checkOutdent(f, h)
    };
    this.autoOutdent = function(a, f, h) {
      return this.$outdent.autoOutdent(f, h)
    }
  }).call(i.prototype);
  g.Mode = i
});
define("ace/theme/textmate", ["require", "exports", "module", "pilot/dom", "text!ace/theme/tm.css!.ace-tm .ace_editor {\n  border: 2px solid rgb(159, 159, 159);\n}\n\n.ace-tm .ace_editor.ace_focus {\n  border: 2px solid #327fbd;\n}\n\n.ace-tm .ace_gutter {\n  width: 50px;\n  background: #e8e8e8;\n  color: #333;\n  overflow : hidden;\n}\n\n.ace-tm .ace_gutter-layer {\n  width: 100%;\n  text-align: right;\n}\n\n.ace-tm .ace_gutter-layer .ace_gutter-cell {\n  padding-right: 6px;\n}\n\n.ace-tm .ace_editor .ace_printMargin {\n  width: 1px;\n  background: #e8e8e8;\n}\n\n.ace-tm .ace_text-layer {\n  cursor: text;\n}\n\n.ace-tm .ace_cursor {\n  border-left: 2px solid black;\n}\n\n.ace-tm .ace_cursor.ace_overwrite {\n  border-left: 0px;\n  border-bottom: 1px solid black;\n}\n        \n.ace-tm .ace_line .ace_invisible {\n  color: rgb(191, 191, 191);\n}\n\n.ace-tm .ace_line .ace_keyword {\n  color: blue;\n}\n\n.ace-tm .ace_line .ace_constant.ace_buildin {\n  color: rgb(88, 72, 246);\n}\n\n.ace-tm .ace_line .ace_constant.ace_language {\n  color: rgb(88, 92, 246);\n}\n\n.ace-tm .ace_line .ace_constant.ace_library {\n  color: rgb(6, 150, 14);\n}\n\n.ace-tm .ace_line .ace_invalid {\n  background-color: rgb(153, 0, 0);\n  color: white;\n}\n\n.ace-tm .ace_line .ace_support.ace_function {\n  color: rgb(60, 76, 114);\n}\n\n.ace-tm .ace_line .ace_support.ace_constant {\n  color: rgb(6, 150, 14);\n}\n\n.ace-tm .ace_line .ace_support.ace_type,\n.ace-tm .ace_line .ace_support.ace_class {\n  color: rgb(109, 121, 222);\n}\n\n.ace-tm .ace_line .ace_keyword.ace_operator {\n  color: rgb(104, 118, 135);\n}\n\n.ace-tm .ace_line .ace_string {\n  color: rgb(3, 106, 7);\n}\n\n.ace-tm .ace_line .ace_comment {\n  color: rgb(76, 136, 107);\n}\n\n.ace-tm .ace_line .ace_comment.ace_doc {\n  color: rgb(0, 102, 255);\n}\n\n.ace-tm .ace_line .ace_comment.ace_doc.ace_tag {\n  color: rgb(128, 159, 191);\n}\n\n.ace-tm .ace_line .ace_constant.ace_numeric {\n  color: rgb(0, 0, 205);\n}\n\n.ace-tm .ace_line .ace_variable {\n  color: rgb(49, 132, 149);\n}\n\n.ace-tm .ace_line .ace_xml_pe {\n  color: rgb(104, 104, 91);\n}\n\n.ace-tm .ace_marker-layer .ace_selection {\n  background: rgb(181, 213, 255);\n}\n\n.ace-tm .ace_marker-layer .ace_step {\n  background: rgb(252, 255, 0);\n}\n\n.ace-tm .ace_marker-layer .ace_stack {\n  background: rgb(164, 229, 101);\n}\n\n.ace-tm .ace_marker-layer .ace_bracket {\n  margin: -1px 0 0 -1px;\n  border: 1px solid rgb(192, 192, 192);\n}\n\n.ace-tm .ace_marker-layer .ace_active_line {\n  background: rgb(232, 242, 254);\n}\n\n.ace-tm .ace_string.ace_regex {\n  color: rgb(255, 0, 0)   \n}"], 
function(i, g) {
  var l = i("pilot/dom");
  i = i("text!ace/theme/tm.css!.ace-tm .ace_editor {\n  border: 2px solid rgb(159, 159, 159);\n}\n\n.ace-tm .ace_editor.ace_focus {\n  border: 2px solid #327fbd;\n}\n\n.ace-tm .ace_gutter {\n  width: 50px;\n  background: #e8e8e8;\n  color: #333;\n  overflow : hidden;\n}\n\n.ace-tm .ace_gutter-layer {\n  width: 100%;\n  text-align: right;\n}\n\n.ace-tm .ace_gutter-layer .ace_gutter-cell {\n  padding-right: 6px;\n}\n\n.ace-tm .ace_editor .ace_printMargin {\n  width: 1px;\n  background: #e8e8e8;\n}\n\n.ace-tm .ace_text-layer {\n  cursor: text;\n}\n\n.ace-tm .ace_cursor {\n  border-left: 2px solid black;\n}\n\n.ace-tm .ace_cursor.ace_overwrite {\n  border-left: 0px;\n  border-bottom: 1px solid black;\n}\n        \n.ace-tm .ace_line .ace_invisible {\n  color: rgb(191, 191, 191);\n}\n\n.ace-tm .ace_line .ace_keyword {\n  color: blue;\n}\n\n.ace-tm .ace_line .ace_constant.ace_buildin {\n  color: rgb(88, 72, 246);\n}\n\n.ace-tm .ace_line .ace_constant.ace_language {\n  color: rgb(88, 92, 246);\n}\n\n.ace-tm .ace_line .ace_constant.ace_library {\n  color: rgb(6, 150, 14);\n}\n\n.ace-tm .ace_line .ace_invalid {\n  background-color: rgb(153, 0, 0);\n  color: white;\n}\n\n.ace-tm .ace_line .ace_support.ace_function {\n  color: rgb(60, 76, 114);\n}\n\n.ace-tm .ace_line .ace_support.ace_constant {\n  color: rgb(6, 150, 14);\n}\n\n.ace-tm .ace_line .ace_support.ace_type,\n.ace-tm .ace_line .ace_support.ace_class {\n  color: rgb(109, 121, 222);\n}\n\n.ace-tm .ace_line .ace_keyword.ace_operator {\n  color: rgb(104, 118, 135);\n}\n\n.ace-tm .ace_line .ace_string {\n  color: rgb(3, 106, 7);\n}\n\n.ace-tm .ace_line .ace_comment {\n  color: rgb(76, 136, 107);\n}\n\n.ace-tm .ace_line .ace_comment.ace_doc {\n  color: rgb(0, 102, 255);\n}\n\n.ace-tm .ace_line .ace_comment.ace_doc.ace_tag {\n  color: rgb(128, 159, 191);\n}\n\n.ace-tm .ace_line .ace_constant.ace_numeric {\n  color: rgb(0, 0, 205);\n}\n\n.ace-tm .ace_line .ace_variable {\n  color: rgb(49, 132, 149);\n}\n\n.ace-tm .ace_line .ace_xml_pe {\n  color: rgb(104, 104, 91);\n}\n\n.ace-tm .ace_marker-layer .ace_selection {\n  background: rgb(181, 213, 255);\n}\n\n.ace-tm .ace_marker-layer .ace_step {\n  background: rgb(252, 255, 0);\n}\n\n.ace-tm .ace_marker-layer .ace_stack {\n  background: rgb(164, 229, 101);\n}\n\n.ace-tm .ace_marker-layer .ace_bracket {\n  margin: -1px 0 0 -1px;\n  border: 1px solid rgb(192, 192, 192);\n}\n\n.ace-tm .ace_marker-layer .ace_active_line {\n  background: rgb(232, 242, 254);\n}\n\n.ace-tm .ace_string.ace_regex {\n  color: rgb(255, 0, 0)   \n}");
  l.importCssString(i);
  g.cssClass = "ace-tm"
});