/*
 RequireJS text Copyright (c) 2010, The Dojo Foundation All Rights Reserved.
 Available via the MIT or new BSD license.
 see: http://github.com/jrburke/requirejs for details
*/
(function() {
  var h = ["Msxml2.XMLHTTP", "Microsoft.XMLHTTP", "Msxml2.XMLHTTP.4.0"], g = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im, e = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im;
  if(!require.textStrip) {
    require.textStrip = function(c) {
      if(c) {
        c = c.replace(g, "");
        var i = c.match(e);
        if(i) {
          c = i[1]
        }
      }else {
        c = ""
      }return c
    }
  }if(!require.getXhr) {
    require.getXhr = function() {
      var c, i, b;
      if(typeof XMLHttpRequest !== "undefined") {
        return new XMLHttpRequest
      }else {
        for(i = 0;i < 3;i++) {
          b = h[i];
          try {
            c = new ActiveXObject(b)
          }catch(j) {
          }if(c) {
            h = [b];
            break
          }
        }
      }if(!c) {
        throw new Error("require.getXhr(): XMLHttpRequest not available");
      }return c
    }
  }if(!require.fetchText) {
    require.fetchText = function(c, i) {
      var b = require.getXhr();
      b.open("GET", c, true);
      b.onreadystatechange = function() {
        b.readyState === 4 && i(b.responseText)
      };
      b.send(null)
    }
  }require.plugin({prefix:"text", require:function() {
  }, newContext:function(c) {
    require.mixin(c, {text:{}, textWaiting:[]})
  }, load:function(c, i) {
    var b = false, j = null, a, f = c.indexOf("."), l = c.substring(0, f), n = c.substring(f + 1, c.length), d = require.s.contexts[i], k = d.textWaiting;
    f = n.indexOf("!");
    if(f !== -1) {
      b = n.substring(f + 1, n.length);
      n = n.substring(0, f);
      f = b.indexOf("!");
      if(f !== -1 && b.substring(0, f) === "strip") {
        j = b.substring(f + 1, b.length);
        b = "strip"
      }else {
        if(b !== "strip") {
          j = b;
          b = null
        }
      }
    }a = l + "!" + n;
    f = b ? a + "!" + b : a;
    if(j !== null && !d.text[a]) {
      d.defined[c] = d.text[a] = j
    }else {
      if(!d.text[a] && !d.textWaiting[a] && !d.textWaiting[f]) {
        k[f] || (k[f] = k[k.push({name:c, key:a, fullKey:f, strip:!!b}) - 1]);
        i = require.nameToUrl(l, "." + n, i);
        d.loaded[c] = false;
        require.fetchText(i, function(p) {
          d.text[a] = p;
          d.loaded[c] = true
        })
      }
    }
  }, checkDeps:function() {
  }, isWaiting:function(c) {
    return!!c.textWaiting.length
  }, orderDeps:function(c) {
    var i, b, j, a = c.textWaiting;
    c.textWaiting = [];
    for(i = 0;b = a[i];i++) {
      j = c.text[b.key];
      c.defined[b.name] = b.strip ? require.textStrip(j) : j
    }
  }})
})();
define("ace/lib/oop", ["require", "exports", "module"], function() {
  var h = {};
  h.inherits = function(g, e) {
    var c = function() {
    };
    c.prototype = e.prototype;
    g.super_ = e.prototype;
    g.prototype = new c;
    g.prototype.constructor = g
  };
  h.mixin = function(g, e) {
    for(var c in e) {
      g[c] = e[c]
    }
  };
  h.implement = function(g, e) {
    h.mixin(g, e)
  };
  return h
});
define("ace/lib/core", ["require", "exports", "module"], function() {
  var h = {}, g = (navigator.platform.match(/mac|win|linux/i) || ["other"])[0].toLowerCase();
  h.isWin = g == "win";
  h.isMac = g == "mac";
  h.isLinux = g == "linux";
  h.isIE = !+"\u000b1";
  h.isGecko = window.controllers && window.navigator.product === "Gecko";
  h.provide = function(e) {
    e = e.split(".");
    for(var c = window, i = 0;i < e.length;i++) {
      var b = e[i];
      c[b] || (c[b] = {});
      c = c[b]
    }
  };
  return h
});
define("ace/lib/event", ["require", "exports", "module", "./core"], function(h) {
  var g = h("./core"), e = {};
  e.addListener = function(c, i, b) {
    if(c.addEventListener) {
      return c.addEventListener(i, b, false)
    }if(c.attachEvent) {
      var j = function() {
        b(window.event)
      };
      b.$$wrapper = j;
      c.attachEvent("on" + i, j)
    }
  };
  e.removeListener = function(c, i, b) {
    if(c.removeEventListener) {
      return c.removeEventListener(i, b, false)
    }if(c.detachEvent) {
      c.detachEvent("on" + i, b.$$wrapper || b)
    }
  };
  e.stopEvent = function(c) {
    e.stopPropagation(c);
    e.preventDefault(c);
    return false
  };
  e.stopPropagation = function(c) {
    if(c.stopPropagation) {
      c.stopPropagation()
    }else {
      c.cancelBubble = true
    }
  };
  e.preventDefault = function(c) {
    if(c.preventDefault) {
      c.preventDefault()
    }else {
      c.returnValue = false
    }
  };
  e.getDocumentX = function(c) {
    return c.clientX ? c.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft) : c.pageX
  };
  e.getDocumentY = function(c) {
    return c.clientY ? c.clientY + (document.documentElement.scrollTop || document.body.scrollTop) : c.pageX
  };
  e.getButton = function(c) {
    return c.preventDefault ? c.button : Math.max(c.button - 1, 2)
  };
  e.capture = document.documentElement.setCapture ? function(c, i, b) {
    function j(a) {
      i && i(a);
      b && b();
      e.removeListener(c, "mousemove", i);
      e.removeListener(c, "mouseup", j);
      e.removeListener(c, "losecapture", j);
      c.releaseCapture()
    }
    e.addListener(c, "mousemove", i);
    e.addListener(c, "mouseup", j);
    e.addListener(c, "losecapture", j);
    c.setCapture()
  } : function(c, i, b) {
    function j(f) {
      i(f);
      f.stopPropagation()
    }
    function a(f) {
      i && i(f);
      b && b();
      document.removeEventListener("mousemove", j, true);
      document.removeEventListener("mouseup", a, true);
      f.stopPropagation()
    }
    document.addEventListener("mousemove", j, true);
    document.addEventListener("mouseup", a, true)
  };
  e.addMouseWheelListener = function(c, i) {
    var b = function(j) {
      if(j.wheelDelta !== undefined) {
        if(j.wheelDeltaX !== undefined) {
          j.wheelX = -j.wheelDeltaX / 8;
          j.wheelY = -j.wheelDeltaY / 8
        }else {
          j.wheelX = 0;
          j.wheelY = -j.wheelDelta / 8
        }
      }else {
        if(j.axis && j.axis == j.HORIZONTAL_AXIS) {
          j.wheelX = (j.detail || 0) * 5;
          j.wheelY = 0
        }else {
          j.wheelX = 0;
          j.wheelY = (j.detail || 0) * 5
        }
      }i(j)
    };
    e.addListener(c, "DOMMouseScroll", b);
    e.addListener(c, "mousewheel", b)
  };
  e.addMultiMouseDownListener = function(c, i, b, j, a) {
    var f = 0, l, n, d = function(k) {
      f += 1;
      if(f == 1) {
        l = k.clientX;
        n = k.clientY;
        setTimeout(function() {
          f = 0
        }, j || 600)
      }if(e.getButton(k) != i || Math.abs(k.clientX - l) > 5 || Math.abs(k.clientY - n) > 5) {
        f = 0
      }if(f == b) {
        f = 0;
        a(k)
      }return e.preventDefault(k)
    };
    e.addListener(c, "mousedown", d);
    g.isIE && e.addListener(c, "dblclick", d)
  };
  e.addKeyListener = function(c, i) {
    var b = null;
    e.addListener(c, "keydown", function(j) {
      b = j.keyIdentifier || j.keyCode;
      return i(j)
    });
    g.isMac && g.isGecko && e.addListener(c, "keypress", function(j) {
      if(b !== (j.keyIdentifier || j.keyCode)) {
        return i(j)
      }else {
        b = null
      }
    })
  };
  return e
});
define("ace/lib/lang", ["require", "exports", "module"], function() {
  var h = {};
  h.stringReverse = function(g) {
    return g.split("").reverse().join("")
  };
  h.stringRepeat = function(g, e) {
    return(new Array(e + 1)).join(g)
  };
  h.arrayIndexOf = Array.prototype.indexOf ? function(g, e) {
    return g.indexOf(e)
  } : function(g, e) {
    for(var c = 0;c < g.length;c++) {
      if(g[c] == e) {
        return c
      }
    }return-1
  };
  h.isArray = function(g) {
    return Object.prototype.toString.call(g) == "[object Array]"
  };
  h.copyObject = function(g) {
    var e = {};
    for(var c in g) {
      e[c] = g[c]
    }return e
  };
  h.arrayToMap = function(g) {
    for(var e = {}, c = 0;c < g.length;c++) {
      e[g[c]] = 1
    }return e
  };
  h.escapeRegExp = function(g) {
    return g.replace(/([.*+?^${}()|[\]\/\\])/g, "\\$1")
  };
  h.bind = function(g, e) {
    return function() {
      return g.apply(e, arguments)
    }
  };
  h.deferredCall = function(g) {
    var e = null, c = function() {
      e = null;
      g()
    };
    return{schedule:function() {
      e || (e = setTimeout(c, 0))
    }, call:function() {
      h.cancel();
      g()
    }, cancel:function() {
      clearTimeout(e);
      e = null
    }}
  };
  return h
});
define("ace/textinput", ["require", "exports", "module", "./lib/event"], function(h) {
  var g = h("./lib/event");
  return function(e, c) {
    function i() {
      if(!l) {
        var k = b.value;
        if(k) {
          if(k.charCodeAt(k.length - 1) == a.charCodeAt(0)) {
            (k = k.slice(0, -1)) && c.onTextInput(k)
          }else {
            c.onTextInput(k)
          }
        }
      }l = false;
      b.value = a;
      b.select()
    }
    var b = document.createElement("textarea"), j = b.style;
    j.position = "absolute";
    j.left = "-10000px";
    j.top = "-10000px";
    e.appendChild(b);
    var a = String.fromCharCode(0);
    i();
    var f = false, l = false, n = function() {
      setTimeout(function() {
        f || i()
      }, 0)
    }, d = function() {
      c.onCompositionUpdate(b.value)
    };
    g.addListener(b, "keypress", n);
    g.addListener(b, "textInput", n);
    g.addListener(b, "paste", n);
    g.addListener(b, "propertychange", n);
    g.addListener(b, "copy", function() {
      l = true;
      b.value = c.getCopyText();
      b.select();
      l = true;
      setTimeout(i, 0)
    });
    g.addListener(b, "cut", function() {
      l = true;
      b.value = c.getCopyText();
      c.onCut();
      b.select();
      setTimeout(i, 0)
    });
    g.addListener(b, "compositionstart", function() {
      f = true;
      i();
      b.value = "";
      c.onCompositionStart();
      setTimeout(d, 0)
    });
    g.addListener(b, "compositionupdate", d);
    g.addListener(b, "compositionend", function() {
      f = false;
      c.onCompositionEnd();
      n()
    });
    g.addListener(b, "blur", function() {
      c.onBlur()
    });
    g.addListener(b, "focus", function() {
      c.onFocus();
      b.select()
    });
    this.focus = function() {
      c.onFocus();
      b.select();
      b.focus()
    };
    this.blur = function() {
      b.blur()
    }
  }
});
define("ace/conf/keybindings/default_mac", ["require", "exports", "module"], function() {
  return{selectall:"Command-A", removeline:"Command-D", gotoline:"Command-L", togglecomment:"Command-7", findnext:"Command-K", findprevious:"Command-Shift-K", find:"Command-F", replace:"Command-R", undo:"Command-Z", redo:"Command-Shift-Z|Command-Y", overwrite:"Insert", copylinesup:"Command-Option-Up", movelinesup:"Option-Up", selecttostart:"Command-Shift-Up", gotostart:"Command-Home|Command-Up", selectup:"Shift-Up", golineup:"Up", copylinesdown:"Command-Option-Down", movelinesdown:"Option-Down", 
  selecttoend:"Command-Shift-Down", gotoend:"Command-End|Command-Down", selectdown:"Shift-Down", godown:"Down", selectwordleft:"Option-Shift-Left", gotowordleft:"Option-Left", selecttolinestart:"Command-Shift-Left", gotolinestart:"Command-Left|Home", selectleft:"Shift-Left", gotoleft:"Left", selectwordright:"Option-Shift-Right", gotowordright:"Option-Right", selecttolineend:"Command-Shift-Right", gotolineend:"Command-Right|End", selectright:"Shift-Right", gotoright:"Right", selectpagedown:"Shift-PageDown", 
  pagedown:"PageDown", selectpageup:"Shift-PageUp", pageup:"PageUp", selectlinestart:"Shift-Home", selectlineend:"Shift-End", del:"Delete", backspace:"Ctrl-Backspace|Command-Backspace|Option-Backspace|Backspace", outdent:"Shift-Tab", indent:"Tab"}
});
define("ace/conf/keybindings/default_win", ["require", "exports", "module"], function() {
  return{selectall:"Ctrl-A", removeline:"Ctrl-D", gotoline:"Ctrl-L", togglecomment:"Ctrl-7", findnext:"Ctrl-K", findprevious:"Ctrl-Shift-K", find:"Ctrl-F", replace:"Ctrl-R", undo:"Ctrl-Z", redo:"Ctrl-Shift-Z|Ctrl-Y", overwrite:"Insert", copylinesup:"Ctrl-Alt-Up", movelinesup:"Alt-Up", selecttostart:"Alt-Shift-Up", gotostart:"Ctrl-Home|Ctrl-Up", selectup:"Shift-Up", golineup:"Up", copylinesdown:"Ctrl-Alt-Down", movelinesdown:"Alt-Down", selecttoend:"Alt-Shift-Down", gotoend:"Ctrl-End|Ctrl-Down", selectdown:"Shift-Down", 
  godown:"Down", selectwordleft:"Ctrl-Shift-Left", gotowordleft:"Ctrl-Left", selecttolinestart:"Alt-Shift-Left", gotolinestart:"Alt-Left|Home", selectleft:"Shift-Left", gotoleft:"Left", selectwordright:"Ctrl-Shift-Right", gotowordright:"Ctrl-Right", selecttolineend:"Alt-Shift-Right", gotolineend:"Alt-Right|End", selectright:"Shift-Right", gotoright:"Right", selectpagedown:"Shift-PageDown", pagedown:"PageDown", selectpageup:"Shift-PageUp", pageup:"PageUp", selectlinestart:"Shift-Home", selectlineend:"Shift-End", 
  del:"Delete", backspace:"Backspace", outdent:"Shift-Tab", indent:"Tab"}
});
define("ace/plugin_manager", ["require", "exports", "module"], function() {
  return{commands:{}, registerCommand:function(h, g) {
    this.commands[h] = g
  }}
});
define("ace/commands/default_commands", ["require", "exports", "module", "../plugin_manager"], function(h) {
  h = h("../plugin_manager");
  h.registerCommand("selectall", function(g, e) {
    e.selectAll()
  });
  h.registerCommand("removeline", function(g) {
    g.removeLines()
  });
  h.registerCommand("gotoline", function(g) {
    var e = parseInt(prompt("Enter line number:"));
    isNaN(e) || g.gotoLine(e)
  });
  h.registerCommand("togglecomment", function(g) {
    g.toggleCommentLines()
  });
  h.registerCommand("findnext", function(g) {
    g.findNext()
  });
  h.registerCommand("findprevious", function(g) {
    g.findPrevious()
  });
  h.registerCommand("find", function(g) {
    var e = prompt("Find:");
    g.find(e)
  });
  h.registerCommand("undo", function(g) {
    g.undo()
  });
  h.registerCommand("redo", function(g) {
    g.redo()
  });
  h.registerCommand("redo", function(g) {
    g.redo()
  });
  h.registerCommand("overwrite", function(g) {
    g.toggleOverwrite()
  });
  h.registerCommand("copylinesup", function(g) {
    g.copyLinesUp()
  });
  h.registerCommand("movelinesup", function(g) {
    g.moveLinesUp()
  });
  h.registerCommand("selecttostart", function(g, e) {
    e.selectFileStart()
  });
  h.registerCommand("gotostart", function(g) {
    g.navigateFileStart()
  });
  h.registerCommand("selectup", function(g, e) {
    e.selectUp()
  });
  h.registerCommand("golineup", function(g) {
    g.navigateUp()
  });
  h.registerCommand("copylinesdown", function(g) {
    g.copyLinesDown()
  });
  h.registerCommand("movelinesdown", function(g) {
    g.moveLinesDown()
  });
  h.registerCommand("selecttoend", function(g, e) {
    e.selectFileEnd()
  });
  h.registerCommand("gotoend", function(g) {
    g.navigateFileEnd()
  });
  h.registerCommand("selectdown", function(g, e) {
    e.selectDown()
  });
  h.registerCommand("godown", function(g) {
    g.navigateDown()
  });
  h.registerCommand("selectwordleft", function(g, e) {
    e.selectWordLeft()
  });
  h.registerCommand("gotowordleft", function(g) {
    g.navigateWordLeft()
  });
  h.registerCommand("selecttolinestart", function(g, e) {
    e.selectLineStart()
  });
  h.registerCommand("gotolinestart", function(g) {
    g.navigateLineStart()
  });
  h.registerCommand("selectleft", function(g, e) {
    e.selectLeft()
  });
  h.registerCommand("gotoleft", function(g) {
    g.navigateLeft()
  });
  h.registerCommand("selectwordright", function(g, e) {
    e.selectWordRight()
  });
  h.registerCommand("gotowordright", function(g) {
    g.navigateWordRight()
  });
  h.registerCommand("selecttolineend", function(g, e) {
    e.selectLineEnd()
  });
  h.registerCommand("gotolineend", function(g) {
    g.navigateLineEnd()
  });
  h.registerCommand("selectright", function(g, e) {
    e.selectRight()
  });
  h.registerCommand("gotoright", function(g) {
    g.navigateRight()
  });
  h.registerCommand("selectpagedown", function(g) {
    g.selectPageDown()
  });
  h.registerCommand("pagedown", function(g) {
    g.scrollPageDown()
  });
  h.registerCommand("gotopagedown", function(g) {
    g.gotoPageDown()
  });
  h.registerCommand("selectpageup", function(g) {
    g.selectPageUp()
  });
  h.registerCommand("pageup", function(g) {
    g.scrollPageUp()
  });
  h.registerCommand("gotopageup", function(g) {
    g.gotoPageUp()
  });
  h.registerCommand("selectlinestart", function(g, e) {
    e.selectLineStart()
  });
  h.registerCommand("gotolinestart", function(g) {
    g.navigateLineStart()
  });
  h.registerCommand("selectlineend", function(g, e) {
    e.selectLineEnd()
  });
  h.registerCommand("gotolineend", function(g) {
    g.navigateLineEnd()
  });
  h.registerCommand("del", function(g) {
    g.removeRight()
  });
  h.registerCommand("backspace", function(g) {
    g.removeLeft()
  });
  h.registerCommand("outdent", function(g) {
    g.blockOutdent()
  });
  h.registerCommand("indent", function(g) {
    g.indent()
  })
});
define("ace/keybinding", ["require", "exports", "module", "./lib/core", "./lib/event", "./conf/keybindings/default_mac", "./conf/keybindings/default_win", "./plugin_manager", "./commands/default_commands"], function(h) {
  var g = h("./lib/core"), e = h("./lib/event"), c = h("./conf/keybindings/default_mac"), i = h("./conf/keybindings/default_win"), b = h("./plugin_manager");
  h("./commands/default_commands");
  h = function(j, a, f) {
    this.setConfig(f);
    var l = this;
    e.addKeyListener(j, function(n) {
      var d = (l.config.reverse[0 | (n.ctrlKey ? 1 : 0) | (n.altKey ? 2 : 0) | (n.shiftKey ? 4 : 0) | (n.metaKey ? 8 : 0)] || {})[(l.keyNames[n.keyCode] || String.fromCharCode(n.keyCode)).toLowerCase()];
      if(d = b.commands[d]) {
        d(a, a.getSelection());
        return e.stopEvent(n)
      }
    })
  };
  (function() {
    function j(l, n, d, k) {
      return(k && l.toLowerCase() || l).replace(/(?:^\s+|\n|\s+$)/g, "").split(new RegExp("[\\s ]*" + n + "[\\s ]*", "g"), d || 999)
    }
    function a(l, n, d) {
      var k, p = 0;
      l = j(l, "\\-", null, true);
      for(var o = 0, m = l.length;o < m;++o) {
        if(this.keyMods[l[o]]) {
          p |= this.keyMods[l[o]]
        }else {
          k = l[o] || "-"
        }
      }(d[p] || (d[p] = {}))[k] = n;
      return d
    }
    function f(l, n) {
      var d, k, p, o, m = {};
      for(d in l) {
        o = l[d];
        if(n && typeof o == "string") {
          o = o.split(n);
          k = 0;
          for(p = o.length;k < p;++k) {
            a.call(this, o[k], d, m)
          }
        }else {
          a.call(this, o, d, m)
        }
      }return m
    }
    this.keyMods = {ctrl:1, alt:2, option:2, shift:4, meta:8, command:8};
    this.keyNames = {"8":"Backspace", "9":"Tab", "13":"Enter", "27":"Esc", "32":"Space", "33":"PageUp", "34":"PageDown", "35":"End", "36":"Home", "37":"Left", "38":"Up", "39":"Right", "40":"Down", "45":"Insert", "46":"Delete", "107":"+", "112":"F1", "113":"F2", "114":"F3", "115":"F4", "116":"F5", "117":"F6", "118":"F7", "119":"F8", "120":"F9", "121":"F10", "122":"F11", "123":"F12"};
    this.setConfig = function(l) {
      this.config = l || (g.isMac ? c : i);
      if(typeof this.config.reverse == "undefined") {
        this.config.reverse = f.call(this, this.config, "|")
      }
    }
  }).call(h.prototype);
  return h
});
define("ace/event_emitter", ["require", "exports", "module", "./lib/lang"], function(h) {
  var g = h("./lib/lang");
  h = {};
  h.$dispatchEvent = function(e, c) {
    this.$eventRegistry = this.$eventRegistry || {};
    var i = this.$eventRegistry[e];
    if(i && i.length) {
      c = c || {};
      c.type = e;
      for(e = 0;e < i.length;e++) {
        i[e](c)
      }
    }
  };
  h.on = h.addEventListener = function(e, c) {
    this.$eventRegistry = this.$eventRegistry || {};
    var i = this.$eventRegistry[e];
    i || (i = this.$eventRegistry[e] = []);
    g.arrayIndexOf(i, c) == -1 && i.push(c)
  };
  h.removeEventListener = function(e, c) {
    this.$eventRegistry = this.$eventRegistry || {};
    if(e = this.$eventRegistry[e]) {
      c = g.arrayIndexOf(e, c);
      c !== -1 && e.splice(c, 1)
    }
  };
  return h
});
define("ace/range", ["require", "exports", "module"], function() {
  var h = function(g, e, c, i) {
    this.start = {row:g, column:e};
    this.end = {row:c, column:i}
  };
  (function() {
    this.toString = function() {
      return"Range: [" + this.start.row + "/" + this.start.column + "] -> [" + this.end.row + "/" + this.end.column + "]"
    };
    this.contains = function(g, e) {
      return this.compare(g, e) == 0
    };
    this.compare = function(g, e) {
      if(!this.isMultiLine()) {
        if(g === this.start.row) {
          return e < this.start.column ? -1 : e > this.end.column ? 1 : 0
        }
      }if(g < this.start.row) {
        return-1
      }if(g > this.end.row) {
        return 1
      }if(this.start.row === g) {
        return e >= this.start.column ? 0 : -1
      }if(this.end.row === g) {
        return e <= this.end.column ? 0 : 1
      }return 0
    };
    this.clipRows = function(g, e) {
      if(this.end.row > e) {
        var c = {row:e + 1, column:0}
      }if(this.start.row > e) {
        var i = {row:e + 1, column:0}
      }if(this.start.row < g) {
        i = {row:g, column:0}
      }if(this.end.row < g) {
        c = {row:g, column:0}
      }return h.fromPoints(i || this.start, c || this.end)
    };
    this.extend = function(g, e) {
      var c = this.compare(g, e);
      if(c == 0) {
        return this
      }else {
        if(c == -1) {
          var i = {row:g, column:e}
        }else {
          var b = {row:g, column:e}
        }
      }return h.fromPoints(i || this.start, b || this.end)
    };
    this.isEmpty = function() {
      return this.start.row == this.end.row && this.start.column == this.end.column
    };
    this.isMultiLine = function() {
      return this.start.row !== this.end.row
    };
    this.clone = function() {
      return h.fromPoints(this.start, this.end)
    };
    this.toScreenRange = function(g) {
      return new h(this.start.row, g.documentToScreenColumn(this.start.row, this.start.column), this.end.row, g.documentToScreenColumn(this.end.row, this.end.column))
    }
  }).call(h.prototype);
  h.fromPoints = function(g, e) {
    return new h(g.row, g.column, e.row, e.column)
  };
  return h
});
define("ace/selection", ["require", "exports", "module", "./lib/oop", "./lib/lang", "./event_emitter", "./range"], function(h) {
  var g = h("./lib/oop"), e = h("./lib/lang"), c = h("./event_emitter"), i = h("./range");
  h = function(b) {
    this.doc = b;
    this.clearSelection();
    this.selectionLead = {row:0, column:0}
  };
  (function() {
    g.implement(this, c);
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
    this.setSelectionAnchor = function(b, j) {
      b = this.$clipPositionToDocument(b, j);
      if(this.selectionAnchor) {
        if(this.selectionAnchor.row !== b.row || this.selectionAnchor.column !== b.column) {
          this.selectionAnchor = b;
          this.$dispatchEvent("changeSelection", {})
        }
      }else {
        this.selectionAnchor = b;
        this.$dispatchEvent("changeSelection", {})
      }
    };
    this.getSelectionAnchor = function() {
      return this.selectionAnchor ? this.$clone(this.selectionAnchor) : this.$clone(this.selectionLead)
    };
    this.getSelectionLead = function() {
      return this.$clone(this.selectionLead)
    };
    this.shiftSelection = function(b) {
      if(this.isEmpty()) {
        this.moveCursorTo(this.selectionLead.row, this.selectionLead.column + b)
      }else {
        var j = this.getSelectionAnchor(), a = this.getSelectionLead(), f = this.isBackwards();
        if(!f || j.column !== 0) {
          this.setSelectionAnchor(j.row, j.column + b)
        }if(f || a.column !== 0) {
          this.$moveSelection(function() {
            this.moveCursorTo(a.row, a.column + b)
          })
        }
      }
    };
    this.isBackwards = function() {
      var b = this.selectionAnchor || this.selectionLead, j = this.selectionLead;
      return b.row > j.row || b.row == j.row && b.column > j.column
    };
    this.getRange = function() {
      var b = this.selectionAnchor || this.selectionLead, j = this.selectionLead;
      return this.isBackwards() ? i.fromPoints(j, b) : i.fromPoints(b, j)
    };
    this.clearSelection = function() {
      if(this.selectionAnchor) {
        this.selectionAnchor = null;
        this.$dispatchEvent("changeSelection", {})
      }
    };
    this.selectAll = function() {
      var b = this.doc.getLength() - 1;
      this.setSelectionAnchor(b, this.doc.getLine(b).length);
      this.$moveSelection(function() {
        this.moveCursorTo(0, 0)
      })
    };
    this.setSelectionRange = function(b, j) {
      if(j) {
        this.setSelectionAnchor(b.end.row, b.end.column);
        this.selectTo(b.start.row, b.start.column)
      }else {
        this.setSelectionAnchor(b.start.row, b.start.column);
        this.selectTo(b.end.row, b.end.column)
      }
    };
    this.$moveSelection = function(b) {
      var j = false;
      if(!this.selectionAnchor) {
        j = true;
        this.selectionAnchor = this.$clone(this.selectionLead)
      }var a = this.$clone(this.selectionLead);
      b.call(this);
      if(a.row !== this.selectionLead.row || a.column !== this.selectionLead.column) {
        j = true
      }j && this.$dispatchEvent("changeSelection", {})
    };
    this.selectTo = function(b, j) {
      this.$moveSelection(function() {
        this.moveCursorTo(b, j)
      })
    };
    this.selectToPosition = function(b) {
      this.$moveSelection(function() {
        this.moveCursorToPosition(b)
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
      var b = this.selectionLead;
      this.setSelectionRange(this.doc.getWordRange(b.row, b.column))
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
        this.moveCursorBy(0, -1)
      }
    };
    this.moveCursorRight = function() {
      if(this.selectionLead.column == this.doc.getLine(this.selectionLead.row).length) {
        this.selectionLead.row < this.doc.getLength() - 1 && this.moveCursorTo(this.selectionLead.row + 1, 0)
      }else {
        this.moveCursorBy(0, 1)
      }
    };
    this.moveCursorLineStart = function() {
      var b = this.selectionLead.row, j = this.selectionLead.column, a = this.doc.getLine(b).slice(0, j).match(/^\s*/);
      if(a[0].length == 0) {
        this.moveCursorTo(b, this.doc.getLine(b).match(/^\s*/)[0].length)
      }else {
        a[0].length >= j ? this.moveCursorTo(b, 0) : this.moveCursorTo(b, a[0].length)
      }
    };
    this.moveCursorLineEnd = function() {
      this.moveCursorTo(this.selectionLead.row, this.doc.getLine(this.selectionLead.row).length)
    };
    this.moveCursorFileEnd = function() {
      var b = this.doc.getLength() - 1, j = this.doc.getLine(b).length;
      this.moveCursorTo(b, j)
    };
    this.moveCursorFileStart = function() {
      this.moveCursorTo(0, 0)
    };
    this.moveCursorWordRight = function() {
      var b = this.selectionLead.row, j = this.selectionLead.column, a = this.doc.getLine(b), f = a.substring(j);
      this.doc.nonTokenRe.lastIndex = 0;
      this.doc.tokenRe.lastIndex = 0;
      if(j == a.length) {
        this.moveCursorRight()
      }else {
        if(this.doc.nonTokenRe.exec(f)) {
          j += this.doc.nonTokenRe.lastIndex;
          this.doc.nonTokenRe.lastIndex = 0
        }else {
          if(this.doc.tokenRe.exec(f)) {
            j += this.doc.tokenRe.lastIndex;
            this.doc.tokenRe.lastIndex = 0
          }
        }this.moveCursorTo(b, j)
      }
    };
    this.moveCursorWordLeft = function() {
      var b = this.selectionLead.row, j = this.selectionLead.column, a = this.doc.getLine(b);
      a = e.stringReverse(a.substring(0, j));
      this.doc.nonTokenRe.lastIndex = 0;
      this.doc.tokenRe.lastIndex = 0;
      if(j == 0) {
        this.moveCursorLeft()
      }else {
        if(this.doc.nonTokenRe.exec(a)) {
          j -= this.doc.nonTokenRe.lastIndex;
          this.doc.nonTokenRe.lastIndex = 0
        }else {
          if(this.doc.tokenRe.exec(a)) {
            j -= this.doc.tokenRe.lastIndex;
            this.doc.tokenRe.lastIndex = 0
          }
        }this.moveCursorTo(b, j)
      }
    };
    this.moveCursorBy = function(b, j) {
      this.moveCursorTo(this.selectionLead.row + b, this.selectionLead.column + j)
    };
    this.moveCursorToPosition = function(b) {
      this.moveCursorTo(b.row, b.column)
    };
    this.moveCursorTo = function(b, j) {
      b = this.$clipPositionToDocument(b, j);
      if(b.row !== this.selectionLead.row || b.column !== this.selectionLead.column) {
        this.selectionLead = b;
        this.$dispatchEvent("changeCursor", {data:this.getCursor()})
      }
    };
    this.moveCursorUp = function() {
      this.moveCursorBy(-1, 0)
    };
    this.$clipPositionToDocument = function(b, j) {
      var a = {};
      if(b >= this.doc.getLength()) {
        a.row = Math.max(0, this.doc.getLength() - 1);
        a.column = this.doc.getLine(a.row).length
      }else {
        if(b < 0) {
          a.row = 0;
          a.column = 0
        }else {
          a.row = b;
          a.column = Math.min(this.doc.getLine(a.row).length, Math.max(0, j))
        }
      }return a
    };
    this.$clone = function(b) {
      return{row:b.row, column:b.column}
    }
  }).call(h.prototype);
  return h
});
define("ace/tokenizer", ["require", "exports", "module"], function() {
  var h = function(g) {
    this.rules = g;
    this.regExps = {};
    for(var e in this.rules) {
      g = this.rules[e];
      for(var c = [], i = 0;i < g.length;i++) {
        c.push(g[i].regex)
      }this.regExps[e] = new RegExp("(?:(" + c.join(")|(") + ")|(.))", "g")
    }
  };
  (function() {
    this.getLineTokens = function(g, e) {
      e = e;
      var c = this.rules[e], i = this.regExps[e];
      i.lastIndex = 0;
      for(var b, j = [], a = 0, f = {type:null, value:""};b = i.exec(g);) {
        var l = "text", n = b[0];
        if(i.lastIndex == a) {
          throw new Error("tokenizer error");
        }a = i.lastIndex;
        window.LOG && console.log(e, b);
        for(var d = 0;d < c.length;d++) {
          if(b[d + 1]) {
            l = typeof c[d].token == "function" ? c[d].token(b[0]) : c[d].token;
            if(c[d].next && c[d].next !== e) {
              e = c[d].next;
              c = this.rules[e];
              a = i.lastIndex;
              i = this.regExps[e];
              i.lastIndex = a
            }break
          }
        }if(f.type !== l) {
          f.type && j.push(f);
          f = {type:l, value:n}
        }else {
          f.value += n
        }
      }f.type && j.push(f);
      window.LOG && console.log(j, e);
      return{tokens:j, state:e}
    }
  }).call(h.prototype);
  return h
});
define("ace/mode/text_highlight_rules", ["require", "exports", "module"], function() {
  var h = function() {
    this.$rules = {start:[{token:"text", regex:".+"}]}
  };
  (function() {
    this.addRules = function(g, e) {
      for(var c in g) {
        for(var i = g[c], b = 0;b < i.length;b++) {
          var j = i[b];
          j.next = j.next ? e + j.next : e + c
        }this.$rules[e + c] = i
      }
    };
    this.getRules = function() {
      return this.$rules
    }
  }).call(h.prototype);
  return h
});
define("ace/mode/text", ["require", "exports", "module", "../tokenizer", "./text_highlight_rules"], function(h) {
  var g = h("../tokenizer"), e = h("./text_highlight_rules");
  h = function() {
    this.$tokenizer = new g((new e).getRules())
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
    this.$getIndent = function(c) {
      if(c = c.match(/^(\s+)/)) {
        return c[1]
      }return""
    }
  }).call(h.prototype);
  return h
});
define("ace/document", ["require", "exports", "module", "./lib/oop", "./lib/lang", "./event_emitter", "./selection", "./mode/text", "./range"], function(h) {
  var g = h("./lib/oop"), e = h("./lib/lang"), c = h("./event_emitter"), i = h("./selection"), b = h("./mode/text"), j = h("./range");
  h = function(a, f) {
    this.modified = true;
    this.lines = [];
    this.selection = new i(this);
    this.$breakpoints = [];
    this.listeners = [];
    f && this.setMode(f);
    e.isArray(a) ? this.$insertLines(0, a) : this.$insert({row:0, column:0}, a)
  };
  (function() {
    g.implement(this, c);
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
      this.$dispatchEvent("change", {data:{firstRow:a, lastRow:f}})
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
        this.$dispatchEvent("changeTabSize")
      }
    };
    this.getTabSize = function() {
      return this.$tabSize
    };
    this.getBreakpoints = function() {
      return this.$breakpoints
    };
    this.setBreakpoints = function(a) {
      this.$breakpoints = [];
      for(var f = 0;f < a.length;f++) {
        this.$breakpoints[a[f]] = true
      }this.$dispatchEvent("changeBreakpoint", {})
    };
    this.clearBreakpoints = function() {
      this.$breakpoints = [];
      this.$dispatchEvent("changeBreakpoint", {})
    };
    this.setBreakpoint = function(a) {
      this.$breakpoints[a] = true;
      this.$dispatchEvent("changeBreakpoint", {})
    };
    this.clearBreakpoint = function(a) {
      delete this.$breakpoints[a];
      this.$dispatchEvent("changeBreakpoint", {})
    };
    this.$detectNewLine = function(a) {
      this.$autoNewLine = (a = a.match(/^.*?(\r?\n)/m)) ? a[1] : "\n"
    };
    this.tokenRe = /^[\w\d]+/g;
    this.nonTokenRe = /^[^\w\d]+/g;
    this.getWordRange = function(a, f) {
      var l = this.getLine(a), n = false;
      if(f > 0) {
        n = !!l.charAt(f - 1).match(this.tokenRe)
      }n || (n = !!l.charAt(f).match(this.tokenRe));
      n = n ? this.tokenRe : this.nonTokenRe;
      var d = f;
      if(d > 0) {
        do {
          d--
        }while(d >= 0 && l.charAt(d).match(n));
        d++
      }for(f = f;f < l.length && l.charAt(f).match(n);) {
        f++
      }return new j(a, d, a, f)
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
        this.$dispatchEvent("changeMode")
      }
    };
    this.getMode = function() {
      if(!this.$mode) {
        this.$mode = new b
      }return this.$mode
    };
    this.$scrollTop = 0;
    this.setScrollTopRow = function(a) {
      if(this.$scrollTop !== a) {
        this.$scrollTop = a;
        this.$dispatchEvent("changeScrollTop")
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
      return this.screenWith
    };
    this.$computeWidth = function() {
      if(this.modified) {
        this.modified = false;
        for(var a = this.lines, f = 0, l = 0, n = this.getTabSize(), d = 0;d < a.length;d++) {
          var k = a[d].length;
          f = Math.max(f, k);
          a[d].replace("\t", function(p) {
            k += n - 1;
            return p
          });
          l = Math.max(l, k)
        }this.width = f;
        this.screenWith = l
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
      var l = this.$brackets[a], n = f.column - 2;
      f = f.row;
      for(var d = 1, k = this.getLine(f);;) {
        for(;n >= 0;) {
          var p = k.charAt(n);
          if(p == l) {
            d -= 1;
            if(d == 0) {
              return{row:f, column:n}
            }
          }else {
            if(p == a) {
              d += 1
            }
          }n -= 1
        }f -= 1;
        if(f < 0) {
          break
        }k = this.getLine(f);
        n = k.length - 1
      }return null
    };
    this.$findClosingBracket = function(a, f) {
      var l = this.$brackets[a], n = f.column;
      f = f.row;
      for(var d = 1, k = this.getLine(f), p = this.getLength();;) {
        for(;n < k.length;) {
          var o = k.charAt(n);
          if(o == l) {
            d -= 1;
            if(d == 0) {
              return{row:f, column:n}
            }
          }else {
            if(o == a) {
              d += 1
            }
          }n += 1
        }f += 1;
        if(f >= p) {
          break
        }k = this.getLine(f);
        n = 0
      }return null
    };
    this.insert = function(a, f, l) {
      f = this.$insert(a, f, l);
      this.fireChangeEvent(a.row, a.row == f.row ? a.row : undefined);
      return f
    };
    this.$insertLines = function(a, f, l) {
      if(f.length != 0) {
        var n = [a, 0];
        n.push.apply(n, f);
        this.lines.splice.apply(this.lines, n);
        if(!l && this.$undoManager) {
          l = this.$getNewLineCharacter();
          this.$deltas.push({action:"insertText", range:new j(a, 0, a + f.length, 0), text:f.join(l) + l});
          this.$informUndoManager.schedule()
        }
      }
    };
    this.$insert = function(a, f, l) {
      if(f.length == 0) {
        return a
      }this.modified = true;
      this.lines.length <= 1 && this.$detectNewLine(f);
      var n = this.$split(f);
      if(this.$isNewLine(f)) {
        var d = this.lines[a.row] || "";
        this.lines[a.row] = d.substring(0, a.column);
        this.lines.splice(a.row + 1, 0, d.substring(a.column));
        n = {row:a.row + 1, column:0}
      }else {
        if(n.length == 1) {
          d = this.lines[a.row] || "";
          this.lines[a.row] = d.substring(0, a.column) + f + d.substring(a.column);
          n = {row:a.row, column:a.column + f.length}
        }else {
          d = this.lines[a.row] || "";
          var k = d.substring(0, a.column) + n[0];
          d = n[n.length - 1] + d.substring(a.column);
          this.lines[a.row] = k;
          this.$insertLines(a.row + 1, [d], true);
          n.length > 2 && this.$insertLines(a.row + 1, n.slice(1, -1), true);
          n = {row:a.row + n.length - 1, column:n[n.length - 1].length}
        }
      }if(!l && this.$undoManager) {
        this.$deltas.push({action:"insertText", range:j.fromPoints(a, n), text:f});
        this.$informUndoManager.schedule()
      }return n
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
    this.$remove = function(a, f) {
      if(!a.isEmpty()) {
        if(!f && this.$undoManager) {
          this.$getNewLineCharacter();
          this.$deltas.push({action:"removeText", range:a.clone(), text:this.getTextRange(a)});
          this.$informUndoManager.schedule()
        }this.modified = true;
        f = a.start.row;
        var l = a.end.row, n = this.getLine(f).substring(0, a.start.column) + this.getLine(l).substring(a.end.column);
        n != "" ? this.lines.splice(f, l - f + 1, n) : this.lines.splice(f, l - f + 1, "");
        return a.start
      }
    };
    this.undoChanges = function(a) {
      this.selection.clearSelection();
      for(var f = a.length - 1;f >= 0;f--) {
        var l = a[f];
        if(l.action == "insertText") {
          this.remove(l.range, true);
          this.selection.moveCursorToPosition(l.range.start)
        }else {
          this.insert(l.range.start, l.text, true);
          this.selection.clearSelection()
        }
      }
    };
    this.redoChanges = function(a) {
      this.selection.clearSelection();
      for(var f = 0;f < a.length;f++) {
        var l = a[f];
        if(l.action == "insertText") {
          this.insert(l.range.start, l.text, true);
          this.selection.setSelectionRange(l.range)
        }else {
          this.remove(l.range, true);
          this.selection.moveCursorToPosition(l.range.start)
        }
      }
    };
    this.replace = function(a, f) {
      this.$remove(a);
      f = f ? this.$insert(a.start, f) : a.start;
      var l = a.end.column == 0 ? a.end.column - 1 : a.end.column;
      this.fireChangeEvent(a.start.row, l == f.row ? l : undefined);
      return f
    };
    this.indentRows = function(a, f) {
      f.replace("\t", this.getTabString());
      for(var l = a.start.row;l <= a.end.row;l++) {
        this.$insert({row:l, column:0}, f)
      }this.fireChangeEvent(a.start.row, a.end.row);
      return f.length
    };
    this.outdentRows = function(a) {
      for(var f = new j(0, 0, 0, 0), l = this.getTabSize(), n = a.start.row;n <= a.end.row;++n) {
        var d = this.getLine(n);
        f.start.row = n;
        f.end.row = n;
        for(var k = 0;k < l;++k) {
          if(d.charAt(k) != " ") {
            break
          }
        }if(k < l && d.charAt(k) == "\t") {
          f.start.column = k;
          f.end.column = k + 1
        }else {
          f.start.column = 0;
          f.end.column = k
        }if(n == a.start.row) {
          a.start.column -= f.end.column - f.start.column
        }if(n == a.end.row) {
          a.end.column -= f.end.column - f.start.column
        }this.$remove(f)
      }this.fireChangeEvent(a.start.row, a.end.row);
      return a
    };
    this.moveLinesUp = function(a, f) {
      if(a <= 0) {
        return 0
      }var l = this.lines.slice(a, f + 1);
      this.$remove(new j(a, 0, f + 1, 0));
      this.$insertLines(a - 1, l);
      this.fireChangeEvent(a - 1, f);
      return-1
    };
    this.moveLinesDown = function(a, f) {
      if(f >= this.lines.length - 1) {
        return 0
      }var l = this.lines.slice(a, f + 1);
      this.$remove(new j(a, 0, f + 1, 0));
      this.$insertLines(a + 1, l);
      this.fireChangeEvent(a, f + 1);
      return 1
    };
    this.duplicateLines = function(a, f) {
      a = this.$clipRowToDocument(a);
      f = this.$clipRowToDocument(f);
      var l = this.getLines(a, f);
      this.$insertLines(a, l);
      f = f - a + 1;
      this.fireChangeEvent(a);
      return f
    };
    this.$clipRowToDocument = function(a) {
      return Math.max(0, Math.min(a, this.lines.length - 1))
    };
    this.documentToScreenColumn = function(a, f) {
      var l = this.getTabSize(), n = 0;
      f = f;
      a = this.getLine(a).split("\t");
      for(var d = 0;d < a.length;d++) {
        var k = a[d].length;
        if(f > k) {
          f -= k + 1;
          n += k + l
        }else {
          n += f;
          break
        }
      }return n
    };
    this.screenToDocumentColumn = function(a, f) {
      var l = this.getTabSize(), n = 0;
      f = f;
      a = this.getLine(a).split("\t");
      for(var d = 0;d < a.length;d++) {
        var k = a[d].length;
        if(f >= k + l) {
          f -= k + l;
          n += k + 1
        }else {
          n += f > k ? k : f;
          break
        }
      }return n
    }
  }).call(h.prototype);
  return h
});
define("ace/search", ["require", "exports", "module", "./lib/lang", "./lib/oop", "./range"], function(h) {
  var g = h("./lib/lang"), e = h("./lib/oop"), c = h("./range"), i = function() {
    this.$options = {needle:"", backwards:false, wrap:false, caseSensitive:false, wholeWord:false, scope:i.ALL, regExp:false}
  };
  i.ALL = 1;
  i.SELECTION = 2;
  (function() {
    this.set = function(b) {
      e.mixin(this.$options, b);
      return this
    };
    this.getOptions = function() {
      return g.copyObject(this.$options)
    };
    this.find = function(b) {
      if(!this.$options.needle) {
        return null
      }var j = null;
      (this.$options.backwards ? this.$backwardMatchIterator(b) : this.$forwardMatchIterator(b)).forEach(function(a) {
        j = a;
        return true
      });
      return j
    };
    this.findAll = function(b) {
      if(!this.$options.needle) {
        return[]
      }var j = [];
      (this.$options.backwards ? this.$backwardMatchIterator(b) : this.$forwardMatchIterator(b)).forEach(function(a) {
        j.push(a)
      });
      return j
    };
    this.replace = function(b, j) {
      var a = this.$assembleRegExp(), f = a.exec(b);
      return f && f[0].length == b.length ? this.$options.regExp ? b.replace(a, j) : j : null
    };
    this.$forwardMatchIterator = function(b) {
      var j = this.$assembleRegExp(), a = this;
      return{forEach:function(f) {
        a.$forwardLineIterator(b).forEach(function(l, n, d) {
          if(n) {
            l = l.substring(n)
          }var k = [];
          l.replace(j, function(o) {
            k.push({str:o, offset:n + arguments[arguments.length - 2]});
            return o
          });
          for(l = 0;l < k.length;l++) {
            var p = k[l];
            p = a.$rangeFromMatch(d, p.offset, p.str.length);
            if(f(p)) {
              return true
            }
          }
        })
      }}
    };
    this.$backwardMatchIterator = function(b) {
      var j = this.$assembleRegExp(), a = this;
      return{forEach:function(f) {
        a.$backwardLineIterator(b).forEach(function(l, n, d) {
          if(n) {
            l = l.substring(n)
          }var k = [];
          l.replace(j, function(o, m) {
            k.push({str:o, offset:n + m});
            return o
          });
          for(l = k.length - 1;l >= 0;l--) {
            var p = k[l];
            p = a.$rangeFromMatch(d, p.offset, p.str.length);
            if(f(p)) {
              return true
            }
          }
        })
      }}
    };
    this.$rangeFromMatch = function(b, j, a) {
      return new c(b, j, b, j + a)
    };
    this.$assembleRegExp = function() {
      var b = this.$options.regExp ? this.$options.needle : g.escapeRegExp(this.$options.needle);
      if(this.$options.wholeWord) {
        b = "\\b" + b + "\\b"
      }var j = "g";
      this.$options.caseSensitive || (j += "i");
      return new RegExp(b, j)
    };
    this.$forwardLineIterator = function(b) {
      function j(o) {
        var m = b.getLine(o);
        if(a && o == f.end.row) {
          m = m.substring(0, f.end.column)
        }return m
      }
      var a = this.$options.scope == i.SELECTION, f = b.getSelection().getRange(), l = b.getSelection().getCursor(), n = a ? f.start.row : 0, d = a ? f.start.column : 0, k = a ? f.end.row : b.getLength() - 1, p = this.$options.wrap;
      return{forEach:function(o) {
        for(var m = l.row, r = j(m), q = l.column, s = false;!o(r, q, m);) {
          if(s) {
            return
          }m++;
          q = 0;
          if(m > k) {
            if(p) {
              m = n;
              q = d
            }else {
              return
            }
          }if(m == l.row) {
            s = true
          }r = j(m)
        }
      }}
    };
    this.$backwardLineIterator = function(b) {
      var j = this.$options.scope == i.SELECTION, a = b.getSelection().getRange(), f = j ? a.end : a.start, l = j ? a.start.row : 0, n = j ? a.start.column : 0, d = j ? a.end.row : b.getLength() - 1, k = this.$options.wrap;
      return{forEach:function(p) {
        for(var o = f.row, m = b.getLine(o).substring(0, f.column), r = 0, q = false;!p(m, r, o);) {
          if(q) {
            return
          }o--;
          r = 0;
          if(o < l) {
            if(k) {
              o = d
            }else {
              return
            }
          }if(o == f.row) {
            q = true
          }m = b.getLine(o);
          if(j) {
            if(o == l) {
              r = n
            }else {
              if(o == d) {
                m = m.substring(0, a.end.column)
              }
            }
          }
        }
      }}
    }
  }).call(i.prototype);
  return i
});
define("ace/background_tokenizer", ["require", "exports", "module", "./lib/oop", "./event_emitter"], function(h) {
  var g = h("./lib/oop"), e = h("./event_emitter");
  h = function(c, i) {
    this.running = false;
    this.textLines = [];
    this.lines = [];
    this.currentLine = 0;
    this.tokenizer = c;
    var b = this;
    this.$worker = function() {
      if(b.running) {
        for(var j = new Date, a = b.currentLine, f = b.textLines, l = 0, n = i.getLastVisibleRow();b.currentLine < f.length;) {
          b.lines[b.currentLine] = b.$tokenizeRows(b.currentLine, b.currentLine)[0];
          b.currentLine++;
          l += 1;
          if(l % 5 == 0 && new Date - j > 20) {
            b.fireUpdateEvent(a, b.currentLine - 1);
            b.running = setTimeout(b.$worker, b.currentLine < n ? 20 : 100);
            return
          }
        }b.running = false;
        b.fireUpdateEvent(a, f.length - 1)
      }
    }
  };
  (function() {
    g.implement(this, e);
    this.setTokenizer = function(c) {
      this.tokenizer = c;
      this.lines = [];
      this.start(0)
    };
    this.setLines = function(c) {
      this.textLines = c;
      this.lines = [];
      this.stop()
    };
    this.fireUpdateEvent = function(c, i) {
      this.$dispatchEvent("update", {data:{first:c, last:i}})
    };
    this.start = function(c) {
      this.currentLine = Math.min(c || 0, this.currentLine, this.textLines.length);
      this.lines.splice(this.currentLine, this.lines.length);
      this.stop();
      this.running = setTimeout(this.$worker, 700)
    };
    this.stop = function() {
      this.running && clearTimeout(this.running);
      this.running = false
    };
    this.getTokens = function(c, i, b) {
      b(this.$tokenizeRows(c, i))
    };
    this.getState = function(c, i) {
      i(this.$tokenizeRows(c, c)[0].state)
    };
    this.$tokenizeRows = function(c, i) {
      var b = [], j = "start", a = false;
      if(c > 0 && this.lines[c - 1]) {
        j = this.lines[c - 1].state;
        a = true
      }for(c = c;c <= i;c++) {
        if(this.lines[c]) {
          f = this.lines[c];
          j = f.state;
          b.push(f)
        }else {
          var f = this.tokenizer.getLineTokens(this.textLines[c] || "", j);
          j = f.state;
          b.push(f);
          if(a) {
            this.lines[c] = f
          }
        }
      }return b
    }
  }).call(h.prototype);
  return h
});
define("ace/editor", ["require", "exports", "module", "./lib/oop", "./lib/event", "./lib/lang", "./textinput", "./keybinding", "./document", "./search", "./background_tokenizer", "./range", "./event_emitter"], function(h) {
  var g = h("./lib/oop"), e = h("./lib/event"), c = h("./lib/lang"), i = h("./textinput"), b = h("./keybinding"), j = h("./document"), a = h("./search"), f = h("./background_tokenizer"), l = h("./range"), n = h("./event_emitter");
  h = function(d, k) {
    var p = d.getContainerElement();
    this.container = p;
    this.renderer = d;
    this.textInput = new i(p, this);
    this.keyBinding = new b(p, this);
    var o = this;
    e.addListener(p, "mousedown", function(m) {
      setTimeout(function() {
        o.focus()
      });
      return e.preventDefault(m)
    });
    e.addListener(p, "selectstart", function(m) {
      return e.preventDefault(m)
    });
    d = d.getMouseEventTarget();
    e.addListener(d, "mousedown", c.bind(this.onMouseDown, this));
    e.addMultiMouseDownListener(d, 0, 2, 500, c.bind(this.onMouseDoubleClick, this));
    e.addMultiMouseDownListener(d, 0, 3, 600, c.bind(this.onMouseTripleClick, this));
    e.addMouseWheelListener(d, c.bind(this.onMouseWheel, this));
    this.$highlightLineMarker = this.$selectionMarker = null;
    this.$blockScrolling = false;
    this.$search = (new a).set({wrap:true});
    this.setDocument(k || new j(""));
    this.focus()
  };
  (function() {
    g.implement(this, n);
    this.$forwardEvents = {gutterclick:1, gutterdblclick:1};
    this.$originalAddEventListener = this.addEventListener;
    this.$originalRemoveEventListener = this.removeEventListener;
    this.addEventListener = function(d, k) {
      return this.$forwardEvents[d] ? this.renderer.addEventListener(d, k) : this.$originalAddEventListener(d, k)
    };
    this.removeEventListener = function(d, k) {
      return this.$forwardEvents[d] ? this.renderer.removeEventListener(d, k) : this.$originalRemoveEventListener(d, k)
    };
    this.setDocument = function(d) {
      if(this.doc != d) {
        if(this.doc) {
          this.doc.removeEventListener("change", this.$onDocumentChange);
          this.doc.removeEventListener("changeMode", this.$onDocumentModeChange);
          this.doc.removeEventListener("changeTabSize", this.$onDocumentChangeTabSize);
          this.doc.removeEventListener("changeBreakpoint", this.$onDocumentChangeBreakpoint);
          var k = this.doc.getSelection();
          k.removeEventListener("changeCursor", this.$onCursorChange);
          k.removeEventListener("changeSelection", this.$onSelectionChange);
          this.doc.setScrollTopRow(this.renderer.getScrollTopRow())
        }this.doc = d;
        this.$onDocumentChange = c.bind(this.onDocumentChange, this);
        d.addEventListener("change", this.$onDocumentChange);
        this.renderer.setDocument(d);
        this.$onDocumentModeChange = c.bind(this.onDocumentModeChange, this);
        d.addEventListener("changeMode", this.$onDocumentModeChange);
        this.$onDocumentChangeTabSize = c.bind(this.renderer.updateText, this.renderer);
        d.addEventListener("changeTabSize", this.$onDocumentChangeTabSize);
        this.$onDocumentChangeBreakpoint = c.bind(this.onDocumentChangeBreakpoint, this);
        this.doc.addEventListener("changeBreakpoint", this.$onDocumentChangeBreakpoint);
        this.selection = d.getSelection();
        this.$desiredColumn = 0;
        this.$onCursorChange = c.bind(this.onCursorChange, this);
        this.selection.addEventListener("changeCursor", this.$onCursorChange);
        this.$onSelectionChange = c.bind(this.onSelectionChange, this);
        this.selection.addEventListener("changeSelection", this.$onSelectionChange);
        this.onDocumentModeChange();
        this.bgTokenizer.setLines(this.doc.lines);
        this.bgTokenizer.start(0);
        this.onCursorChange();
        this.onSelectionChange();
        this.onDocumentChangeBreakpoint();
        this.renderer.scrollToRow(d.getScrollTopRow());
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
    this.setTheme = function(d) {
      this.renderer.setTheme(d)
    };
    this.$highlightBrackets = function() {
      if(this.$bracketHighlight) {
        this.renderer.removeMarker(this.$bracketHighlight);
        this.$bracketHighlight = null
      }if(!this.$highlightPending) {
        var d = this;
        this.$highlightPending = true;
        setTimeout(function() {
          d.$highlightPending = false;
          var k = d.doc.findMatchingBracket(d.getCursorPosition());
          if(k) {
            k = new l(k.row, k.column, k.row, k.column + 1);
            d.$bracketHighlight = d.renderer.addMarker(k, "ace_bracket")
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
    this.onDocumentChange = function(d) {
      d = d.data;
      this.bgTokenizer.start(d.firstRow);
      this.renderer.updateLines(d.firstRow, d.lastRow);
      this.renderer.updateCursor(this.getCursorPosition(), this.$overwrite)
    };
    this.onTokenizerUpdate = function(d) {
      d = d.data;
      this.renderer.updateLines(d.first, d.last)
    };
    this.onCursorChange = function() {
      this.$highlightBrackets();
      this.renderer.updateCursor(this.getCursorPosition(), this.$overwrite);
      this.$blockScrolling || this.renderer.scrollCursorIntoView();
      this.$updateHighlightActiveLine()
    };
    this.$updateHighlightActiveLine = function() {
      this.$highlightLineMarker && this.renderer.removeMarker(this.$highlightLineMarker);
      this.$highlightLineMarker = null;
      if(this.getHighlightActiveLine() && (this.getSelectionStyle() != "line" || !this.selection.isMultiLine())) {
        var d = this.getCursorPosition();
        this.$highlightLineMarker = this.renderer.addMarker(new l(d.row, 0, d.row + 1, 0), "ace_active_line", "line")
      }
    };
    this.onSelectionChange = function() {
      this.$selectionMarker && this.renderer.removeMarker(this.$selectionMarker);
      this.$selectionMarker = null;
      if(!this.selection.isEmpty()) {
        var d = this.selection.getRange(), k = this.getSelectionStyle();
        this.$selectionMarker = this.renderer.addMarker(d, "ace_selection", k)
      }this.onCursorChange()
    };
    this.onDocumentChangeBreakpoint = function() {
      this.renderer.setBreakpoints(this.doc.getBreakpoints())
    };
    this.onDocumentModeChange = function() {
      var d = this.doc.getMode();
      if(this.mode != d) {
        this.mode = d;
        d = d.getTokenizer();
        if(this.bgTokenizer) {
          this.bgTokenizer.setTokenizer(d)
        }else {
          var k = c.bind(this.onTokenizerUpdate, this);
          this.bgTokenizer = new f(d, this);
          this.bgTokenizer.addEventListener("update", k)
        }this.renderer.setTokenizer(this.bgTokenizer)
      }
    };
    this.onMouseDown = function(d) {
      var k = e.getDocumentX(d), p = e.getDocumentY(d);
      k = this.renderer.screenToTextCoordinates(k, p);
      k.row = Math.max(0, Math.min(k.row, this.doc.getLength() - 1));
      if(e.getButton(d) != 0) {
        this.selection.isEmpty() && this.moveCursorToPosition(k)
      }else {
        if(d.shiftKey) {
          this.selection.selectToPosition(k)
        }else {
          this.moveCursorToPosition(k);
          this.$clickSelection || this.selection.clearSelection(k.row, k.column)
        }this.renderer.scrollCursorIntoView();
        var o = this, m, r;
        e.capture(this.container, function(s) {
          m = e.getDocumentX(s);
          r = e.getDocumentY(s)
        }, function() {
          clearInterval(q);
          o.$clickSelection = null
        });
        var q = setInterval(function() {
          if(!(m === undefined || r === undefined)) {
            var s = o.renderer.screenToTextCoordinates(m, r);
            s.row = Math.max(0, Math.min(s.row, o.doc.getLength() - 1));
            if(o.$clickSelection) {
              if(o.$clickSelection.contains(s.row, s.column)) {
                o.selection.setSelectionRange(o.$clickSelection)
              }else {
                var t = o.$clickSelection.compare(s.row, s.column) == -1 ? o.$clickSelection.end : o.$clickSelection.start;
                o.selection.setSelectionAnchor(t.row, t.column);
                o.selection.selectToPosition(s)
              }
            }else {
              o.selection.selectToPosition(s)
            }o.renderer.scrollCursorIntoView()
          }
        }, 20);
        return e.preventDefault(d)
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
    this.onMouseWheel = function(d) {
      var k = this.$scrollSpeed * 2;
      this.renderer.scrollBy(d.wheelX * k, d.wheelY * k);
      return e.preventDefault(d)
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
    this.onTextInput = function(d) {
      if(!this.$readOnly) {
        var k = this.getCursorPosition();
        d = d.replace("\t", this.doc.getTabString());
        if(this.selection.isEmpty()) {
          if(this.$overwrite) {
            var p = new l.fromPoints(k, k);
            p.end.column += d.length;
            this.doc.remove(p)
          }
        }else {
          k = this.doc.remove(this.getSelectionRange());
          this.clearSelection()
        }this.clearSelection();
        var o = this;
        this.bgTokenizer.getState(k.row, function(m) {
          var r = o.mode.checkOutdent(m, o.doc.getLine(k.row), d), q = o.doc.getLine(k.row), s = o.mode.getNextLineIndent(m, q, o.doc.getTabString()), t = o.doc.insert(k, d);
          o.bgTokenizer.getState(k.row, function(u) {
            if(k.row !== t.row) {
              u = o.doc.getTabSize();
              for(var y = Number.MAX_VALUE, w = k.row + 1;w <= t.row;++w) {
                var x = 0;
                q = o.doc.getLine(w);
                for(var v = 0;v < q.length;++v) {
                  if(q.charAt(v) == "\t") {
                    x += u
                  }else {
                    if(q.charAt(v) == " ") {
                      x += 1
                    }else {
                      break
                    }
                  }
                }if(/[^\s]/.test(q)) {
                  y = Math.min(x, y)
                }
              }for(w = k.row + 1;w <= t.row;++w) {
                x = y;
                q = o.doc.getLine(w);
                for(v = 0;v < q.length && x > 0;++v) {
                  if(q.charAt(v) == "\t") {
                    x -= u
                  }else {
                    if(q.charAt(v) == " ") {
                      x -= 1
                    }
                  }
                }o.doc.replace(new l(w, 0, w, q.length), q.substr(v))
              }t.column += o.doc.indentRows(new l(k.row + 1, 0, t.row, t.column), s)
            }else {
              if(r) {
                t.column += o.mode.autoOutdent(u, o.doc, k.row)
              }
            }o.moveCursorToPosition(t);
            o.renderer.scrollCursorIntoView()
          })
        })
      }
    };
    this.$overwrite = false;
    this.setOverwrite = function(d) {
      if(this.$overwrite != d) {
        this.$overwrite = d;
        this.$blockScrolling = true;
        this.onCursorChange();
        this.$blockScrolling = false;
        this.$dispatchEvent("changeOverwrite", {data:d})
      }
    };
    this.getOverwrite = function() {
      return this.$overwrite
    };
    this.toggleOverwrite = function() {
      this.setOverwrite(!this.$overwrite)
    };
    this.$scrollSpeed = 1;
    this.setScrollSpeed = function(d) {
      this.$scrollSpeed = d
    };
    this.getScrollSpeed = function() {
      return this.$scrollSpeed
    };
    this.$selectionStyle = "line";
    this.setSelectionStyle = function(d) {
      if(this.$selectionStyle != d) {
        this.$selectionStyle = d;
        this.onSelectionChange();
        this.$dispatchEvent("changeSelectionStyle", {data:d})
      }
    };
    this.getSelectionStyle = function() {
      return this.$selectionStyle
    };
    this.$highlightActiveLine = true;
    this.setHighlightActiveLine = function(d) {
      if(this.$highlightActiveLine != d) {
        this.$highlightActiveLine = d;
        this.$updateHighlightActiveLine()
      }
    };
    this.getHighlightActiveLine = function() {
      return this.$highlightActiveLine
    };
    this.setShowInvisibles = function(d) {
      this.getShowInvisibles() != d && this.renderer.setShowInvisibles(d)
    };
    this.getShowInvisibles = function() {
      return this.renderer.getShowInvisibles()
    };
    this.setShowPrintMargin = function(d) {
      this.renderer.setShowPrintMargin(d)
    };
    this.getShowPrintMargin = function() {
      return this.renderer.getShowPrintMargin()
    };
    this.setPrintMarginColumn = function(d) {
      this.renderer.setPrintMarginColumn(d)
    };
    this.getPrintMarginColumn = function() {
      return this.renderer.getPrintMarginColumn()
    };
    this.$readOnly = false;
    this.setReadOnly = function(d) {
      this.$readOnly = d
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
        var d = this.doc, k = this.getSelectionRange();
        if(k.start.row < k.end.row || k.start.column < k.end.column) {
          d = d.indentRows(this.getSelectionRange(), "\t");
          this.selection.shiftSelection(d)
        }else {
          if(this.doc.getUseSoftTabs()) {
            k = d.getTabSize();
            var p = this.getCursorPosition();
            d = d.documentToScreenColumn(p.row, p.column);
            d = k - d % k;
            d = c.stringRepeat(" ", d)
          }else {
            d = "\t"
          }return this.onTextInput(d)
        }
      }
    };
    this.blockOutdent = function() {
      if(!this.$readOnly) {
        var d = this.doc.getSelection(), k = this.doc.outdentRows(d.getRange());
        d.setSelectionRange(k, d.isBackwards());
        this.$updateDesiredColumn()
      }
    };
    this.toggleCommentLines = function() {
      if(!this.$readOnly) {
        var d = this.$getSelectedRows(), k = new l(d.first, 0, d.last, 0), p = this;
        this.bgTokenizer.getState(this.getCursorPosition().row, function(o) {
          o = p.mode.toggleCommentLines(o, p.doc, k);
          p.selection.shiftSelection(o)
        })
      }
    };
    this.removeLines = function() {
      if(!this.$readOnly) {
        var d = this.$getSelectedRows();
        this.selection.setSelectionAnchor(d.last + 1, 0);
        this.selection.selectTo(d.first, 0);
        this.doc.remove(this.getSelectionRange());
        this.clearSelection()
      }
    };
    this.moveLinesDown = function() {
      this.$readOnly || this.$moveLines(function(d, k) {
        return this.doc.moveLinesDown(d, k)
      })
    };
    this.moveLinesUp = function() {
      this.$readOnly || this.$moveLines(function(d, k) {
        return this.doc.moveLinesUp(d, k)
      })
    };
    this.copyLinesUp = function() {
      this.$readOnly || this.$moveLines(function(d, k) {
        this.doc.duplicateLines(d, k);
        return 0
      })
    };
    this.copyLinesDown = function() {
      this.$readOnly || this.$moveLines(function(d, k) {
        return this.doc.duplicateLines(d, k)
      })
    };
    this.$moveLines = function(d) {
      var k = this.$getSelectedRows(), p = d.call(this, k.first, k.last), o = this.selection;
      o.setSelectionAnchor(k.last + p + 1, 0);
      o.$moveSelection(function() {
        o.moveCursorTo(k.first + p, 0)
      })
    };
    this.$getSelectedRows = function() {
      var d = this.getSelectionRange(), k = d.start.row, p = d.end.row;
      if(d.end.column == 0 && d.start.row !== d.end.row) {
        p -= 1
      }return{first:k, last:p}
    };
    this.onCompositionStart = function() {
      this.renderer.showComposition(this.getCursorPosition())
    };
    this.onCompositionUpdate = function(d) {
      this.renderer.setCompositionText(d)
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
    this.isRowVisible = function(d) {
      return d >= this.getFirstVisibleRow() && d <= this.getLastVisibleRow()
    };
    this.getVisibleRowCount = function() {
      return this.getLastVisibleRow() - this.getFirstVisibleRow() + 1
    };
    this.getPageDownRow = function() {
      return this.renderer.getLastVisibleRow() - 1
    };
    this.getPageUpRow = function() {
      var d = this.renderer.getFirstVisibleRow(), k = this.renderer.getLastVisibleRow();
      return d - (k - d) + 1
    };
    this.selectPageDown = function() {
      var d = this.getPageDownRow() + Math.floor(this.getVisibleRowCount() / 2);
      this.scrollPageDown();
      var k = this.getSelection();
      k.$moveSelection(function() {
        k.moveCursorTo(d, k.getSelectionLead().column)
      })
    };
    this.selectPageUp = function() {
      var d = this.getLastVisibleRow() - this.getFirstVisibleRow(), k = this.getPageUpRow() + Math.round(d / 2);
      this.scrollPageUp();
      var p = this.getSelection();
      p.$moveSelection(function() {
        p.moveCursorTo(k, p.getSelectionLead().column)
      })
    };
    this.gotoPageDown = function() {
      var d = this.getPageDownRow(), k = Math.min(this.getCursorPosition().column, this.doc.getLine(d).length);
      this.scrollToRow(d);
      this.getSelection().moveCursorTo(d, k)
    };
    this.gotoPageUp = function() {
      var d = this.getPageUpRow(), k = Math.min(this.getCursorPosition().column, this.doc.getLine(d).length);
      this.scrollToRow(d);
      this.getSelection().moveCursorTo(d, k)
    };
    this.scrollPageDown = function() {
      this.scrollToRow(this.getPageDownRow())
    };
    this.scrollPageUp = function() {
      this.renderer.scrollToRow(this.getPageUpRow())
    };
    this.scrollToRow = function(d) {
      this.renderer.scrollToRow(d)
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
    this.moveCursorTo = function(d, k) {
      this.selection.moveCursorTo(d, k);
      this.$updateDesiredColumn()
    };
    this.moveCursorToPosition = function(d) {
      this.selection.moveCursorToPosition(d);
      this.$updateDesiredColumn()
    };
    this.gotoLine = function(d, k) {
      this.selection.clearSelection();
      this.$blockScrolling = true;
      this.moveCursorTo(d - 1, k || 0);
      this.$blockScrolling = false;
      this.isRowVisible(this.getCursorPosition().row) || this.scrollToRow(d - 1 - Math.floor(this.getVisibleRowCount() / 2))
    };
    this.navigateTo = function(d, k) {
      this.clearSelection();
      this.moveCursorTo(d, k);
      this.$updateDesiredColumn(k)
    };
    this.navigateUp = function() {
      this.selection.clearSelection();
      this.selection.moveCursorBy(-1, 0);
      if(this.$desiredColumn) {
        var d = this.getCursorPosition(), k = this.doc.screenToDocumentColumn(d.row, this.$desiredColumn);
        this.selection.moveCursorTo(d.row, k)
      }
    };
    this.navigateDown = function() {
      this.selection.clearSelection();
      this.selection.moveCursorBy(1, 0);
      if(this.$desiredColumn) {
        var d = this.getCursorPosition(), k = this.doc.screenToDocumentColumn(d.row, this.$desiredColumn);
        this.selection.moveCursorTo(d.row, k)
      }
    };
    this.$updateDesiredColumn = function() {
      var d = this.getCursorPosition();
      this.$desiredColumn = this.doc.documentToScreenColumn(d.row, d.column)
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
    this.replace = function(d, k) {
      k && this.$search.set(k);
      k = this.$search.find(this.doc);
      this.$tryReplace(k, d);
      k !== null && this.selection.setSelectionRange(k);
      this.$updateDesiredColumn()
    };
    this.replaceAll = function(d, k) {
      k && this.$search.set(k);
      k = this.$search.findAll(this.doc);
      if(k.length) {
        this.clearSelection();
        this.selection.moveCursorTo(0, 0);
        for(var p = k.length - 1;p >= 0;--p) {
          this.$tryReplace(k[p], d)
        }k[0] !== null && this.selection.setSelectionRange(k[0]);
        this.$updateDesiredColumn()
      }
    };
    this.$tryReplace = function(d, k) {
      k = this.$search.replace(this.doc.getTextRange(d), k);
      if(k !== null) {
        d.end = this.doc.replace(d, k);
        return d
      }else {
        return null
      }
    };
    this.getLastSearchOptions = function() {
      return this.$search.getOptions()
    };
    this.find = function(d, k) {
      this.clearSelection();
      k = k || {};
      k.needle = d;
      this.$search.set(k);
      this.$find()
    };
    this.findNext = function(d) {
      d = d || {};
      if(typeof d.backwards == "undefined") {
        d.backwards = false
      }this.$search.set(d);
      this.$find()
    };
    this.findPrevious = function(d) {
      d = d || {};
      if(typeof d.backwards == "undefined") {
        d.backwards = true
      }this.$search.set(d);
      this.$find()
    };
    this.$find = function(d) {
      this.selection.isEmpty() || this.$search.set({needle:this.doc.getTextRange(this.getSelectionRange())});
      typeof d != "undefined" && this.$search.set({backwards:d});
      if(d = this.$search.find(this.doc)) {
        this.gotoLine(d.end.row + 1, d.end.column);
        this.$updateDesiredColumn();
        this.selection.setSelectionRange(d)
      }
    };
    this.undo = function() {
      this.doc.getUndoManager().undo()
    };
    this.redo = function() {
      this.doc.getUndoManager().redo()
    }
  }).call(h.prototype);
  return h
});
define("ace/undomanager", ["require", "exports", "module"], function() {
  var h = function() {
    this.$undoStack = [];
    this.$redoStack = []
  };
  (function() {
    this.execute = function(g) {
      var e = g.args[0];
      this.$doc = g.args[1];
      this.$undoStack.push(e)
    };
    this.undo = function() {
      var g = this.$undoStack.pop();
      if(g) {
        this.$doc.undoChanges(g);
        this.$redoStack.push(g)
      }
    };
    this.redo = function() {
      var g = this.$redoStack.pop();
      if(g) {
        this.$doc.redoChanges(g);
        this.$undoStack.push(g)
      }
    }
  }).call(h.prototype);
  return h
});
define("ace/layer/gutter", ["require", "exports", "module"], function() {
  var h = function(g) {
    this.element = document.createElement("div");
    this.element.className = "ace_layer ace_gutter-layer";
    g.appendChild(this.element);
    this.$breakpoints = [];
    this.$decorations = []
  };
  (function() {
    this.addGutterDecoration = function(g, e) {
      this.$decorations[g] || (this.$decorations[g] = "");
      this.$decorations[g] += " ace_" + e
    };
    this.removeGutterDecoration = function(g, e) {
      this.$decorations[g] = this.$decorations[g].replace(" ace_" + e, "")
    };
    this.setBreakpoints = function(g) {
      this.$breakpoints = g.concat()
    };
    this.update = function(g) {
      this.$config = g;
      for(var e = [], c = g.firstRow;c <= g.lastRow;c++) {
        e.push("<div class='ace_gutter-cell", this.$decorations[c] || "", this.$breakpoints[c] ? " ace_breakpoint" : "", "' style='height:", g.lineHeight, "px;'>", c + 1, "</div>");
        e.push("</div>")
      }this.element.innerHTML = e.join("");
      this.element.style.height = g.minHeight + "px"
    }
  }).call(h.prototype);
  return h
});
define("ace/layer/marker", ["require", "exports", "module", "../range"], function(h) {
  var g = h("../range");
  h = function(e) {
    this.element = document.createElement("div");
    this.element.className = "ace_layer ace_marker-layer";
    e.appendChild(this.element);
    this.markers = {};
    this.$markerId = 1
  };
  (function() {
    this.setDocument = function(e) {
      this.doc = e
    };
    this.addMarker = function(e, c, i) {
      var b = this.$markerId++;
      this.markers[b] = {range:e, type:i || "line", clazz:c};
      return b
    };
    this.removeMarker = function(e) {
      this.markers[e] && delete this.markers[e]
    };
    this.update = function(e) {
      if(e = e || this.config) {
        this.config = e;
        var c = [];
        for(var i in this.markers) {
          var b = this.markers[i], j = b.range.clipRows(e.firstRow, e.lastRow);
          if(!j.isEmpty()) {
            if(j.isMultiLine()) {
              b.type == "text" ? this.drawTextMarker(c, j, b.clazz, e) : this.drawMultiLineMarker(c, j, b.clazz, e)
            }else {
              this.drawSingleLineMarker(c, j, b.clazz, e)
            }
          }
        }this.element.innerHTML = c.join("")
      }
    };
    this.drawTextMarker = function(e, c, i, b) {
      var j = c.start.row, a = new g(j, c.start.column, j, this.doc.getLine(j).length);
      this.drawSingleLineMarker(e, a, i, b);
      j = c.end.row;
      a = new g(j, 0, j, c.end.column);
      this.drawSingleLineMarker(e, a, i, b);
      for(j = c.start.row + 1;j < c.end.row;j++) {
        a.start.row = j;
        a.end.row = j;
        a.end.column = this.doc.getLine(j).length;
        this.drawSingleLineMarker(e, a, i, b)
      }
    };
    this.drawMultiLineMarker = function(e, c, i, b) {
      c = c.toScreenRange(this.doc);
      var j = b.lineHeight, a = Math.round(b.width - c.start.column * b.characterWidth), f = (c.start.row - b.firstRow) * b.lineHeight, l = Math.round(c.start.column * b.characterWidth);
      e.push("<div class='", i, "' style='", "height:", j, "px;", "width:", a, "px;", "top:", f, "px;", "left:", l, "px;'></div>");
      f = (c.end.row - b.firstRow) * b.lineHeight;
      a = Math.round(c.end.column * b.characterWidth);
      e.push("<div class='", i, "' style='", "height:", j, "px;", "top:", f, "px;", "width:", a, "px;'></div>");
      j = (c.end.row - c.start.row - 1) * b.lineHeight;
      if(!(j < 0)) {
        f = (c.start.row + 1 - b.firstRow) * b.lineHeight;
        e.push("<div class='", i, "' style='", "height:", j, "px;", "width:", b.width, "px;", "top:", f, "px;'></div>")
      }
    };
    this.drawSingleLineMarker = function(e, c, i, b) {
      c = c.toScreenRange(this.doc);
      var j = b.lineHeight, a = Math.round((c.end.column - c.start.column) * b.characterWidth), f = (c.start.row - b.firstRow) * b.lineHeight;
      c = Math.round(c.start.column * b.characterWidth);
      e.push("<div class='", i, "' style='", "height:", j, "px;", "width:", a, "px;", "top:", f, "px;", "left:", c, "px;'></div>")
    }
  }).call(h.prototype);
  return h
});
define("ace/lib/dom", ["require", "exports", "module", "./lang"], function(h) {
  var g = h("./lang"), e = {};
  e.setText = function(c, i) {
    if(c.innerText !== undefined) {
      c.innerText = i
    }if(c.textContent !== undefined) {
      c.textContent = i
    }
  };
  e.hasCssClass = function(c, i) {
    c = c.className.split(/\s+/g);
    return g.arrayIndexOf(c, i) !== -1
  };
  e.addCssClass = function(c, i) {
    e.hasCssClass(c, i) || (c.className += " " + i)
  };
  e.removeCssClass = function(c, i) {
    for(var b = c.className.split(/\s+/g);;) {
      var j = g.arrayIndexOf(b, i);
      if(j == -1) {
        break
      }b.splice(j, 1)
    }c.className = b.join(" ")
  };
  e.importCssString = function(c, i) {
    i = i || document;
    if(i.createStyleSheet) {
      i.createStyleSheet().cssText = c
    }else {
      var b = i.createElement("style");
      b.appendChild(i.createTextNode(c));
      i.getElementsByTagName("head")[0].appendChild(b)
    }
  };
  e.getInnerWidth = function(c) {
    return parseInt(e.computedStyle(c, "paddingLeft")) + parseInt(e.computedStyle(c, "paddingRight")) + c.clientWidth
  };
  e.getInnerHeight = function(c) {
    return parseInt(e.computedStyle(c, "paddingTop")) + parseInt(e.computedStyle(c, "paddingBottom")) + c.clientHeight
  };
  e.computedStyle = function(c, i) {
    return window.getComputedStyle ? (window.getComputedStyle(c, "") || {})[i] || "" : c.currentStyle[i]
  };
  e.scrollbarWidth = function() {
    var c = document.createElement("p");
    c.style.width = "100%";
    c.style.height = "200px";
    var i = document.createElement("div"), b = i.style;
    b.position = "absolute";
    b.left = "-10000px";
    b.overflow = "hidden";
    b.width = "200px";
    b.height = "150px";
    i.appendChild(c);
    document.body.appendChild(i);
    var j = c.offsetWidth;
    b.overflow = "scroll";
    c = c.offsetWidth;
    if(j == c) {
      c = i.clientWidth
    }document.body.removeChild(i);
    return j - c
  };
  return e
});
define("ace/layer/text", ["require", "exports", "module", "../lib/oop", "../lib/dom", "../event_emitter"], function(h) {
  var g = h("../lib/oop"), e = h("../lib/dom"), c = h("../event_emitter");
  h = function(i) {
    this.element = document.createElement("div");
    this.element.className = "ace_layer ace_text-layer";
    i.appendChild(this.element);
    this.$characterSize = this.$measureSizes();
    this.$pollSizeChanges()
  };
  (function() {
    g.implement(this, c);
    this.EOF_CHAR = "&para;";
    this.EOL_CHAR = "&not;";
    this.TAB_CHAR = "&rarr;";
    this.SPACE_CHAR = "&middot;";
    this.setTokenizer = function(i) {
      this.tokenizer = i
    };
    this.getLineHeight = function() {
      return this.$characterSize.height || 1
    };
    this.getCharacterWidth = function() {
      return this.$characterSize.width || 1
    };
    this.$pollSizeChanges = function() {
      var i = this;
      setInterval(function() {
        var b = i.$measureSizes();
        if(i.$characterSize.width !== b.width || i.$characterSize.height !== b.height) {
          i.$characterSize = b;
          i.$dispatchEvent("changeCharaterSize", {data:b})
        }
      }, 500)
    };
    this.$fontStyles = {fontFamily:1, fontSize:1, fontWeight:1, fontStyle:1, lineHeight:1};
    this.$measureSizes = function() {
      var i = document.createElement("div"), b = i.style;
      b.width = b.height = "auto";
      b.left = b.top = "-1000px";
      b.visibility = "hidden";
      b.position = "absolute";
      b.overflow = "visible";
      for(var j in this.$fontStyles) {
        var a = e.computedStyle(this.element, j);
        b[j] = a
      }i.innerHTML = (new Array(1E3)).join("Xy");
      document.body.insertBefore(i, document.body.firstChild);
      b = {height:i.offsetHeight, width:i.offsetWidth / 2E3};
      document.body.removeChild(i);
      return b
    };
    this.setDocument = function(i) {
      this.doc = i
    };
    this.$showInvisibles = false;
    this.setShowInvisibles = function(i) {
      this.$showInvisibles = i
    };
    this.$computeTabString = function() {
      var i = this.doc.getTabSize();
      if(this.$showInvisibles) {
        i = i / 2;
        this.$tabString = "<span class='ace_invisible'>" + (new Array(Math.floor(i))).join("&nbsp;") + this.TAB_CHAR + (new Array(Math.ceil(i) + 1)).join("&nbsp;") + "</span>"
      }else {
        this.$tabString = (new Array(i + 1)).join("&nbsp;")
      }
    };
    this.updateLines = function(i, b, j) {
      this.$computeTabString();
      this.config = i;
      var a = Math.max(b, i.firstRow), f = Math.min(j, i.lastRow), l = this.element.childNodes, n = this;
      this.tokenizer.getTokens(a, f, function(d) {
        for(var k = a;k <= f;k++) {
          var p = l[k - i.firstRow];
          if(p) {
            var o = [];
            n.$renderLine(o, k, d[k - a].tokens);
            p.innerHTML = o.join("")
          }
        }
      })
    };
    this.scrollLines = function(i) {
      function b(d) {
        i.firstRow < f.firstRow ? a.$renderLinesFragment(i, i.firstRow, f.firstRow - 1, function(k) {
          l.firstChild ? l.insertBefore(k, l.firstChild) : l.appendChild(k);
          d()
        }) : d()
      }
      function j() {
        i.lastRow > f.lastRow && a.$renderLinesFragment(i, f.lastRow + 1, i.lastRow, function(d) {
          l.appendChild(d)
        })
      }
      var a = this;
      this.$computeTabString();
      var f = this.config;
      this.config = i;
      if(!f || f.lastRow < i.firstRow) {
        return this.update(i)
      }if(i.lastRow < f.firstRow) {
        return this.update(i)
      }var l = this.element;
      if(f.firstRow < i.firstRow) {
        for(var n = f.firstRow;n < i.firstRow;n++) {
          l.removeChild(l.firstChild)
        }
      }if(f.lastRow > i.lastRow) {
        for(n = i.lastRow + 1;n <= f.lastRow;n++) {
          l.removeChild(l.lastChild)
        }
      }b(j)
    };
    this.$renderLinesFragment = function(i, b, j, a) {
      var f = document.createDocumentFragment(), l = this;
      this.tokenizer.getTokens(b, j, function(n) {
        for(var d = b;d <= j;d++) {
          var k = document.createElement("div");
          k.className = "ace_line";
          var p = k.style;
          p.height = l.$characterSize.height + "px";
          p.width = i.width + "px";
          p = [];
          l.$renderLine(p, d, n[d - b].tokens);
          k.innerHTML = p.join("");
          f.appendChild(k)
        }a(f)
      })
    };
    this.update = function(i) {
      this.$computeTabString();
      this.config = i;
      var b = [], j = this;
      this.tokenizer.getTokens(i.firstRow, i.lastRow, function(a) {
        for(var f = i.firstRow;f <= i.lastRow;f++) {
          b.push("<div class='ace_line' style='height:" + j.$characterSize.height + "px;", "width:", i.width, "px'>");
          j.$renderLine(b, f, a[f - i.firstRow].tokens);
          b.push("</div>")
        }j.element.innerHTML = b.join("")
      })
    };
    this.$textToken = {text:true, rparen:true, lparen:true};
    this.$renderLine = function(i, b, j) {
      for(var a = /[\v\f \u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000]/g, f = 0;f < j.length;f++) {
        var l = j[f], n = l.value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(a, "&nbsp;").replace(/\t/g, this.$tabString);
        if(this.$textToken[l.type]) {
          i.push(n)
        }else {
          l = "ace_" + l.type.replace(/\./g, " ace_");
          i.push("<span class='", l, "'>", n, "</span>")
        }
      }if(this.$showInvisibles) {
        b !== this.doc.getLength() - 1 ? i.push("<span class='ace_invisible'>" + this.EOL_CHAR + "</span>") : i.push("<span class='ace_invisible'>" + this.EOF_CHAR + "</span>")
      }
    }
  }).call(h.prototype);
  return h
});
define("ace/layer/cursor", ["require", "exports", "module", "../lib/dom"], function(h) {
  var g = h("../lib/dom");
  h = function(e) {
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
    this.setCursor = function(e, c) {
      this.position = {row:e.row, column:this.doc.documentToScreenColumn(e.row, e.column)};
      c ? g.addCssClass(this.cursor, "ace_overwrite") : g.removeCssClass(this.cursor, "ace_overwrite")
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
        var c = Math.round(this.position.column * e.characterWidth), i = this.position.row * e.lineHeight;
        this.pixelPos = {left:c, top:i};
        this.cursor.style.left = c + "px";
        this.cursor.style.top = i - e.firstRow * e.lineHeight + "px";
        this.cursor.style.width = e.characterWidth + "px";
        this.cursor.style.height = e.lineHeight + "px";
        this.isVisible && this.element.appendChild(this.cursor);
        this.restartTimer()
      }
    }
  }).call(h.prototype);
  return h
});
define("ace/scrollbar", ["require", "exports", "module", "./lib/oop", "./lib/lang", "./lib/dom", "./lib/event", "./event_emitter"], function(h) {
  var g = h("./lib/oop"), e = h("./lib/lang"), c = h("./lib/dom"), i = h("./lib/event"), b = h("./event_emitter");
  h = function(j) {
    this.element = document.createElement("div");
    this.element.className = "ace_sb";
    this.inner = document.createElement("div");
    this.element.appendChild(this.inner);
    j.appendChild(this.element);
    this.width = c.scrollbarWidth();
    this.element.style.width = this.width;
    i.addListener(this.element, "scroll", e.bind(this.onScroll, this))
  };
  (function() {
    g.implement(this, b);
    this.onScroll = function() {
      this.$dispatchEvent("scroll", {data:this.element.scrollTop})
    };
    this.getWidth = function() {
      return this.width
    };
    this.setHeight = function(j) {
      this.element.style.height = Math.max(0, j - this.width) + "px"
    };
    this.setInnerHeight = function(j) {
      this.inner.style.height = j + "px"
    };
    this.setScrollTop = function(j) {
      this.element.scrollTop = j
    }
  }).call(h.prototype);
  return h
});
define("ace/renderloop", ["require", "exports", "module", "./lib/event"], function(h) {
  var g = h("./lib/event");
  h = function(e) {
    this.onRender = e;
    this.pending = false;
    this.changes = 0
  };
  (function() {
    this.schedule = function(e) {
      this.changes |= e;
      if(!this.pending) {
        this.pending = true;
        var c = this;
        this.setTimeoutZero(function() {
          c.pending = false;
          var i = c.changes;
          c.changes = 0;
          c.onRender(i)
        })
      }
    };
    if(window.postMessage) {
      this.messageName = "zero-timeout-message";
      this.setTimeoutZero = function(e) {
        if(!this.attached) {
          var c = this;
          g.addListener(window, "message", function(i) {
            if(i.source == window && c.callback && i.data == c.messageName) {
              g.stopPropagation(i);
              c.callback()
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
  }).call(h.prototype);
  return h
});
define("ace/virtual_renderer", ["require", "exports", "module", 'text!ace/css/editor.css!.ace_editor {\n  position: absolute;\n  overflow: hidden;\n\n  font-family: "Menlo", "Monaco", "Courier New", monospace;\n  font-size: 12px;  \n}\n\n.ace_scroller {\n  position: absolute;\n  overflow-x: scroll;\n  overflow-y: hidden;     \n}\n\n.ace_gutter {\n  position: absolute;\n  overflow-x: hidden;\n  overflow-y: hidden;\n  height: 100%;\n}\n\n.ace_editor .ace_sb {\n  position: absolute;\n  overflow-x: hidden;\n  overflow-y: scroll;\n  right: 0;\n}\n\n.ace_editor .ace_sb div {\n  position: absolute;\n  width: 1px;\n  left: 0px;\n}\n\n.ace_editor .ace_printMargin {\n  position: absolute;\n  height: 100%;\n}\n\n.ace_layer {\n  z-index: 0;\n  position: absolute;\n  overflow: hidden;  \n  white-space: nowrap;\n  height: 100%;\n}\n\n.ace_text-layer {\n  font-family: Monaco, "Courier New", monospace;\n  color: black;\n}\n\n.ace_cursor-layer {\n  cursor: text;\n}\n\n.ace_cursor {\n  z-index: 3;\n  position: absolute;\n}\n\n.ace_line {\n  white-space: nowrap;\n}\n\n.ace_marker-layer {\n}\n\n.ace_marker-layer .ace_step {\n  position: absolute;\n  z-index: 2;\n}\n\n.ace_marker-layer .ace_selection {\n  position: absolute;\n  z-index: 3;\n}\n\n.ace_marker-layer .ace_bracket {\n  position: absolute;\n  z-index: 4;\n}\n\n.ace_marker-layer .ace_active_line {\n  position: absolute;\n  z-index: 1;\n}', 
"./lib/oop", "./lib/oop", "./lib/event", "./layer/gutter", "./layer/marker", "./layer/text", "./layer/cursor", "./scrollbar", "./renderloop", "./event_emitter"], function(h, g, e, c) {
  var i = h("./lib/oop"), b = h("./lib/lang"), j = h("./lib/dom"), a = h("./lib/event"), f = h("./layer/gutter"), l = h("./layer/marker"), n = h("./layer/text"), d = h("./layer/cursor"), k = h("./scrollbar"), p = h("./renderloop"), o = h("./event_emitter");
  j.importCssString(c);
  g = function(m, r) {
    this.container = m;
    j.addCssClass(this.container, "ace_editor");
    this.setTheme(r);
    this.$gutter = document.createElement("div");
    this.$gutter.className = "ace_gutter";
    this.container.appendChild(this.$gutter);
    this.scroller = document.createElement("div");
    this.scroller.className = "ace_scroller";
    this.container.appendChild(this.scroller);
    this.content = document.createElement("div");
    this.content.style.position = "absolute";
    this.scroller.appendChild(this.content);
    this.$gutterLayer = new f(this.$gutter);
    this.$markerLayer = new l(this.content);
    var q = this.$textLayer = new n(this.content);
    this.canvas = q.element;
    this.characterWidth = q.getCharacterWidth();
    this.lineHeight = q.getLineHeight();
    this.$cursorLayer = new d(this.content);
    this.layers = [this.$markerLayer, q, this.$cursorLayer];
    this.scrollBar = new k(m);
    this.scrollBar.addEventListener("scroll", b.bind(this.onScroll, this));
    this.scrollTop = 0;
    this.cursorPos = {row:0, column:0};
    var s = this;
    this.$textLayer.addEventListener("changeCharaterSize", function() {
      s.characterWidth = q.getCharacterWidth();
      s.lineHeight = q.getLineHeight();
      s.$loop.schedule(s.CHANGE_FULL)
    });
    a.addListener(this.$gutter, "click", b.bind(this.$onGutterClick, this));
    a.addListener(this.$gutter, "dblclick", b.bind(this.$onGutterClick, this));
    this.$size = {width:0, height:0, scrollerHeight:0, scrollerWidth:0};
    this.$loop = new p(b.bind(this.$renderChanges, this));
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
    i.implement(this, o);
    this.setDocument = function(m) {
      this.lines = m.lines;
      this.doc = m;
      this.$cursorLayer.setDocument(m);
      this.$markerLayer.setDocument(m);
      this.$textLayer.setDocument(m);
      this.$loop.schedule(this.CHANGE_FULL)
    };
    this.updateLines = function(m, r) {
      if(r === undefined) {
        r = Infinity
      }if(this.$changedLines) {
        if(this.$changedLines.firstRow > m) {
          this.$changedLines.firstRow = m
        }if(this.$changedLines.lastRow < r) {
          this.$changedLines.lastRow = r
        }
      }else {
        this.$changedLines = {firstRow:m, lastRow:r}
      }this.$loop.schedule(this.CHANGE_LINES)
    };
    this.updateText = function() {
      this.$loop.schedule(this.CHANGE_TEXT)
    };
    this.updateFull = function() {
      this.$loop.schedule(this.CHANGE_FULL)
    };
    this.onResize = function() {
      this.$loop.schedule(this.CHANGE_SIZE);
      var m = j.getInnerHeight(this.container);
      if(this.$size.height != m) {
        this.$size.height = m;
        this.scroller.style.height = m + "px";
        this.scrollBar.setHeight(m);
        if(this.doc) {
          this.scrollToY(this.getScrollTop());
          this.$loop.schedule(this.CHANGE_FULL)
        }
      }m = j.getInnerWidth(this.container);
      if(this.$size.width != m) {
        this.$size.width = m;
        var r = this.showGutter ? this.$gutter.offsetWidth : 0;
        this.scroller.style.left = r + "px";
        this.scroller.style.width = Math.max(0, m - r - this.scrollBar.getWidth()) + "px"
      }this.$size.scrollerWidth = this.scroller.clientWidth;
      this.$size.scrollerHeight = this.scroller.clientHeight
    };
    this.setTokenizer = function(m) {
      this.$tokenizer = m;
      this.$textLayer.setTokenizer(m);
      this.$loop.schedule(this.CHANGE_TEXT)
    };
    this.$onGutterClick = function(m) {
      var r = a.getDocumentX(m), q = a.getDocumentY(m);
      this.$dispatchEvent("gutter" + m.type, {row:this.screenToTextCoordinates(r, q).row, htmlEvent:m})
    };
    this.$showInvisibles = true;
    this.setShowInvisibles = function(m) {
      this.$showInvisibles = m;
      this.$textLayer.setShowInvisibles(m);
      this.$loop.schedule(this.CHANGE_TEXT)
    };
    this.getShowInvisibles = function() {
      return this.$showInvisibles
    };
    this.$showPrintMargin = true;
    this.setShowPrintMargin = function(m) {
      this.$showPrintMargin = m;
      this.$updatePrintMargin()
    };
    this.getShowPrintMargin = function() {
      return this.$showPrintMargin
    };
    this.$printMarginColumn = 80;
    this.setPrintMarginColumn = function(m) {
      this.$printMarginColumn = m;
      this.$updatePrintMargin()
    };
    this.getPrintMarginColumn = function() {
      return this.$printMarginColumn
    };
    this.setShowGutter = function(m) {
      this.$gutter.style.display = m ? "block" : "none";
      this.showGutter = m;
      this.onResize()
    };
    this.$updatePrintMargin = function() {
      if(this.$showPrintMargin || this.$printMarginEl) {
        if(!this.$printMarginEl) {
          this.$printMarginEl = document.createElement("div");
          this.$printMarginEl.className = "ace_printMargin";
          this.content.insertBefore(this.$printMarginEl, this.$textLayer.element)
        }var m = this.$printMarginEl.style;
        m.left = this.characterWidth * this.$printMarginColumn + "px";
        m.visibility = this.$showPrintMargin ? "visible" : "hidden"
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
    this.setPadding = function(m) {
      this.$padding = m;
      this.content.style.padding = "0 " + m + "px";
      this.$loop.schedule(this.CHANGE_FULL)
    };
    this.onScroll = function(m) {
      this.scrollToY(m.data)
    };
    this.$updateScrollBar = function() {
      this.scrollBar.setInnerHeight(this.doc.getLength() * this.lineHeight);
      this.scrollBar.setScrollTop(this.scrollTop)
    };
    this.$renderChanges = function(m) {
      if(!(!m || !this.doc || !this.$tokenizer)) {
        if(!this.layerConfig || m & this.CHANGE_FULL || m & this.CHANGE_SIZE || m & this.CHANGE_TEXT || m & this.CHANGE_LINES || m & this.CHANGE_SCROLL) {
          this.$computeLayerConfig()
        }if(m & this.CHANGE_FULL) {
          this.$textLayer.update(this.layerConfig);
          this.showGutter && this.$gutterLayer.update(this.layerConfig);
          this.$markerLayer.update(this.layerConfig);
          this.$cursorLayer.update(this.layerConfig);
          this.$updateScrollBar()
        }else {
          if(m & this.CHANGE_SCROLL) {
            m & this.CHANGE_TEXT || m & this.CHANGE_LINES ? this.$textLayer.update(this.layerConfig) : this.$textLayer.scrollLines(this.layerConfig);
            this.showGutter && this.$gutterLayer.update(this.layerConfig);
            this.$markerLayer.update(this.layerConfig);
            this.$cursorLayer.update(this.layerConfig);
            this.$updateScrollBar()
          }else {
            if(m & this.CHANGE_TEXT) {
              this.$textLayer.update(this.layerConfig);
              this.showGutter && this.$gutterLayer.update(this.layerConfig)
            }else {
              if(m & this.CHANGE_LINES) {
                this.$updateLines();
                this.$updateScrollBar()
              }
            }m & this.CHANGE_GUTTER && this.showGutter && this.$gutterLayer.update(this.layerConfig);
            m & this.CHANGE_CURSOR && this.$cursorLayer.update(this.layerConfig);
            m & this.CHANGE_MARKER && this.$markerLayer.update(this.layerConfig);
            m & this.CHANGE_SIZE && this.$updateScrollBar()
          }
        }
      }
    };
    this.$computeLayerConfig = function() {
      var m = this.scrollTop % this.lineHeight, r = this.$size.scrollerHeight + this.lineHeight, q = this.$getLongestLine(), s = !this.layerConfig ? true : this.layerConfig.width != q, t = Math.ceil(r / this.lineHeight), u = Math.max(0, Math.round((this.scrollTop - m) / this.lineHeight));
      t = Math.min(this.lines.length, u + t) - 1;
      this.layerConfig = {width:q, padding:this.$padding, firstRow:u, lastRow:t, lineHeight:this.lineHeight, characterWidth:this.characterWidth, minHeight:r, offset:m, height:this.$size.scrollerHeight};
      for(u = 0;u < this.layers.length;u++) {
        t = this.layers[u];
        if(s) {
          t.element.style.width = q + "px"
        }
      }this.$gutterLayer.element.style.marginTop = -m + "px";
      this.content.style.marginTop = -m + "px";
      this.content.style.width = q + "px";
      this.content.style.height = r + "px"
    };
    this.$updateLines = function() {
      var m = this.$changedLines.firstRow, r = this.$changedLines.lastRow;
      this.$changedLines = null;
      var q = this.layerConfig;
      if(q.width != this.$getLongestLine()) {
        return this.$textLayer.update(q)
      }if(!(m > q.lastRow + 1)) {
        if(!(r < q.firstRow)) {
          if(r === Infinity) {
            this.showGutter && this.$gutterLayer.update(q);
            this.$textLayer.update(q)
          }else {
            this.$textLayer.updateLines(q, m, r)
          }
        }
      }
    };
    this.$getLongestLine = function() {
      var m = this.doc.getScreenWidth();
      if(this.$showInvisibles) {
        m += 1
      }return Math.max(this.$size.scrollerWidth - this.$padding * 2, Math.round(m * this.characterWidth))
    };
    this.addMarker = function(m, r, q) {
      m = this.$markerLayer.addMarker(m, r, q);
      this.$loop.schedule(this.CHANGE_MARKER);
      return m
    };
    this.removeMarker = function(m) {
      this.$markerLayer.removeMarker(m);
      this.$loop.schedule(this.CHANGE_MARKER)
    };
    this.addGutterDecoration = function(m, r) {
      this.$gutterLayer.addGutterDecoration(m, r);
      this.$loop.schedule(this.CHANGE_GUTTER)
    };
    this.removeGutterDecoration = function(m, r) {
      this.$gutterLayer.removeGutterDecoration(m, r);
      this.$loop.schedule(this.CHANGE_GUTTER)
    };
    this.setBreakpoints = function(m) {
      this.$gutterLayer.setBreakpoints(m);
      this.$loop.schedule(this.CHANGE_GUTTER)
    };
    this.updateCursor = function(m, r) {
      this.$cursorLayer.setCursor(m, r);
      this.$loop.schedule(this.CHANGE_CURSOR)
    };
    this.hideCursor = function() {
      this.$cursorLayer.hideCursor()
    };
    this.showCursor = function() {
      this.$cursorLayer.showCursor()
    };
    this.scrollCursorIntoView = function() {
      var m = this.$cursorLayer.getPixelPosition(), r = m.left + this.$padding;
      m = m.top;
      this.getScrollTop() > m && this.scrollToY(m);
      this.getScrollTop() + this.$size.scrollerHeight < m + this.lineHeight && this.scrollToY(m + this.lineHeight - this.$size.scrollerHeight);
      this.scroller.scrollLeft > r && this.scrollToX(r);
      this.scroller.scrollLeft + this.$size.scrollerWidth < r + this.characterWidth && this.scrollToX(Math.round(r + this.characterWidth - this.$size.scrollerWidth))
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
    this.scrollToRow = function(m) {
      this.scrollToY(m * this.lineHeight)
    };
    this.scrollToY = function(m) {
      m = Math.max(0, Math.min(this.lines.length * this.lineHeight - this.$size.scrollerHeight, m));
      if(this.scrollTop !== m) {
        this.scrollTop = m;
        this.$loop.schedule(this.CHANGE_SCROLL)
      }
    };
    this.scrollToX = function(m) {
      if(m <= this.$padding) {
        m = 0
      }this.scroller.scrollLeft = m
    };
    this.scrollBy = function(m, r) {
      r && this.scrollToY(this.scrollTop + r);
      m && this.scrollToX(this.scroller.scrollLeft + m)
    };
    this.screenToTextCoordinates = function(m, r) {
      var q = this.scroller.getBoundingClientRect();
      m = Math.round((m + this.scroller.scrollLeft - q.left - this.$padding) / this.characterWidth);
      r = Math.floor((r + this.scrollTop - q.top) / this.lineHeight);
      return{row:r, column:this.doc.screenToDocumentColumn(Math.max(0, Math.min(r, this.doc.getLength() - 1)), m)}
    };
    this.textToScreenCoordinates = function(m, r) {
      var q = this.scroller.getBoundingClientRect();
      r = this.padding + Math.round(this.doc.documentToScreenColumn(m, r) * this.characterWidth);
      m = m * this.lineHeight;
      return{pageX:q.left + r - this.getScrollLeft(), pageY:q.top + m - this.getScrollTop()}
    };
    this.visualizeFocus = function() {
      j.addCssClass(this.container, "ace_focus")
    };
    this.visualizeBlur = function() {
      j.removeCssClass(this.container, "ace_focus")
    };
    this.showComposition = function() {
    };
    this.setCompositionText = function() {
    };
    this.hideComposition = function() {
    };
    this.setTheme = function(m) {
      function r(s) {
        q.$theme && j.removeCssClass(q.container, q.$theme);
        q.$theme = s ? s.cssClass : null;
        q.$theme && j.addCssClass(q.container, q.$theme);
        if(q.$size) {
          q.$size.width = 0;
          q.onResize()
        }
      }
      var q = this;
      if(!m || typeof m == "string") {
        m = m || "ace/theme/textmate";
        h([m], function(s) {
          r(s)
        })
      }else {
        r(m)
      }q = this
    }
  }).call(g.prototype);
  return g
});
define("ace/mode/doc_comment_highlight_rules", ["require", "exports", "module", "../lib/oop", "./text_highlight_rules"], function(h) {
  var g = h("../lib/oop");
  h = h("./text_highlight_rules");
  var e = function() {
    this.$rules = {start:[{token:"comment.doc", regex:"\\*\\/", next:"start"}, {token:"comment.doc.tag", regex:"@[\\w\\d_]+"}, {token:"comment.doc", regex:"s+"}, {token:"comment.doc", regex:"[^@\\*]+"}, {token:"comment.doc", regex:"."}]}
  };
  g.inherits(e, h);
  (function() {
    this.getStartRule = function(c) {
      return{token:"comment.doc", regex:"\\/\\*(?=\\*)", next:c}
    }
  }).call(e.prototype);
  return e
});
define("ace/mode/javascript_highlight_rules", ["require", "exports", "module", "../lib/oop", "../lib/lang", "./doc_comment_highlight_rules", "./text_highlight_rules"], function(h) {
  var g = h("../lib/oop"), e = h("../lib/lang"), c = h("./doc_comment_highlight_rules");
  h = h("./text_highlight_rules");
  JavaScriptHighlightRules = function() {
    var i = new c, b = e.arrayToMap("break|case|catch|continue|default|delete|do|else|finally|for|function|if|in|instanceof|new|return|switch|throw|try|typeof|var|while|with".split("|")), j = e.arrayToMap("true|false|null|undefined|Infinity|NaN|undefined".split("|")), a = e.arrayToMap("class|enum|extends|super|const|export|import|implements|let|private|public|yield|interface|package|protected|static".split("|"));
    this.$rules = {start:[{token:"comment", regex:"\\/\\/.*$"}, i.getStartRule("doc-start"), {token:"comment", regex:"\\/\\*", next:"comment"}, {token:"string.regexp", regex:"[/](?:(?:\\[(?:\\\\]|[^\\]])+\\])|(?:\\\\/|[^\\]/]))*[/][gimy]*\\s*(?=[).,;]|$)"}, {token:"string", regex:'["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'}, {token:"string", regex:'["].*\\\\$', next:"qqstring"}, {token:"string", regex:"['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"}, {token:"string", regex:"['].*\\\\$", next:"qstring"}, {token:"constant.numeric", 
    regex:"0[xX][0-9a-fA-F]+\\b"}, {token:"constant.numeric", regex:"[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"}, {token:function(f) {
      return f == "this" ? "variable.language" : b[f] ? "keyword" : j[f] ? "constant.language" : a[f] ? "invalid.illegal" : f == "debugger" ? "invalid.deprecated" : "identifier"
    }, regex:"[a-zA-Z_$][a-zA-Z0-9_$]*\\b"}, {token:"keyword.operator", regex:"!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|\\b(in|instanceof|new|delete|typeof|void)"}, {token:"lparen", regex:"[\\[\\(\\{]"}, {token:"rparen", regex:"[\\]\\)\\}]"}, {token:"text", regex:"\\s+"}], comment:[{token:"comment", regex:".*?\\*\\/", next:"start"}, {token:"comment", regex:".+"}], qqstring:[{token:"string", regex:'(?:(?:\\\\.)|(?:[^"\\\\]))*?"', 
    next:"start"}, {token:"string", regex:".+"}], qstring:[{token:"string", regex:"(?:(?:\\\\.)|(?:[^'\\\\]))*?'", next:"start"}, {token:"string", regex:".+"}]};
    this.addRules(i.getRules(), "doc-");
    this.$rules["doc-start"][0].next = "start"
  };
  g.inherits(JavaScriptHighlightRules, h);
  return JavaScriptHighlightRules
});
define("ace/mode/matching_brace_outdent", ["require", "exports", "module", "../range"], function(h) {
  var g = h("../range");
  h = function() {
  };
  (function() {
    this.checkOutdent = function(e, c) {
      if(!/^\s+$/.test(e)) {
        return false
      }return/^\s*\}/.test(c)
    };
    this.autoOutdent = function(e, c) {
      var i = e.getLine(c).match(/^(\s*\})/);
      if(!i) {
        return 0
      }i = i[1].length;
      var b = e.findMatchingBracket({row:c, column:i});
      if(!b || b.row == c) {
        return 0
      }b = this.$getIndent(e.getLine(b.row));
      e.replace(new g(c, 0, c, i - 1), b);
      return b.length - (i - 1)
    };
    this.$getIndent = function(e) {
      if(e = e.match(/^(\s+)/)) {
        return e[1]
      }return""
    }
  }).call(h.prototype);
  return h
});
define("ace/mode/javascript", ["require", "exports", "module", "../lib/oop", "./text", "../tokenizer", "./javascript_highlight_rules", "./matching_brace_outdent", "../range"], function(h) {
  var g = h("../lib/oop"), e = h("./text"), c = h("../tokenizer"), i = h("./javascript_highlight_rules"), b = h("./matching_brace_outdent"), j = h("../range");
  h = function() {
    this.$tokenizer = new c((new i).getRules());
    this.$outdent = new b
  };
  g.inherits(h, e);
  (function() {
    this.toggleCommentLines = function(a, f, l) {
      var n = true;
      a = /^(\s*)\/\//;
      for(var d = l.start.row;d <= l.end.row;d++) {
        if(!a.test(f.getLine(d))) {
          n = false;
          break
        }
      }if(n) {
        n = new j(0, 0, 0, 0);
        for(d = l.start.row;d <= l.end.row;d++) {
          var k = f.getLine(d).replace(a, "$1");
          n.start.row = d;
          n.end.row = d;
          n.end.column = k.length + 2;
          f.replace(n, k)
        }return-2
      }else {
        return f.indentRows(l, "//")
      }
    };
    this.getNextLineIndent = function(a, f, l) {
      var n = this.$getIndent(f), d = this.$tokenizer.getLineTokens(f, a), k = d.tokens;
      d = d.state;
      if(k.length && k[k.length - 1].type == "comment") {
        return n
      }if(a == "start") {
        if(a = f.match(/^.*[\{\(\[]\s*$/)) {
          n += l
        }
      }else {
        if(a == "doc-start") {
          if(d == "start") {
            return""
          }if(a = f.match(/^\s*(\/?)\*/)) {
            if(a[1]) {
              n += " "
            }n += "* "
          }if(a[1]) {
            n += " "
          }n += "* "
        }
      }return n
    };
    this.checkOutdent = function(a, f, l) {
      return this.$outdent.checkOutdent(f, l)
    };
    this.autoOutdent = function(a, f, l) {
      return this.$outdent.autoOutdent(f, l)
    }
  }).call(h.prototype);
  return h
});
define("ace/theme/textmate", ["require", "exports", "module", "text!ace/theme/tm.css!.ace-tm .ace_editor {\n  border: 2px solid rgb(159, 159, 159);\n}\n\n.ace-tm .ace_editor.ace_focus {\n  border: 2px solid #327fbd;\n}\n\n.ace-tm .ace_gutter {\n  width: 50px;\n  background: #e8e8e8;\n  color: #333;\n  overflow : hidden;\n}\n\n.ace-tm .ace_gutter-layer {\n  width: 100%;\n  text-align: right;\n}\n\n.ace-tm .ace_gutter-layer .ace_gutter-cell {\n  padding-right: 6px;\n}\n\n.ace-tm .ace_editor .ace_printMargin {\n  width: 1px;\n  background: #e8e8e8;\n}\n\n.ace-tm .ace_text-layer {\n  cursor: text;\n}\n\n.ace-tm .ace_cursor {\n  border-left: 2px solid black;\n}\n\n.ace-tm .ace_cursor.ace_overwrite {\n  border-left: 0px;\n  border-bottom: 1px solid black;\n}\n        \n.ace-tm .ace_line .ace_invisible {\n  color: rgb(191, 191, 191);\n}\n\n.ace-tm .ace_line .ace_keyword {\n  color: blue;\n}\n\n.ace-tm .ace_line .ace_constant.ace_buildin {\n  color: rgb(88, 72, 246);\n}\n\n.ace-tm .ace_line .ace_constant.ace_library {\n  color: rgb(6, 150, 14);\n}\n\n.ace-tm .ace_line .ace_invalid {\n  background-color: rgb(153, 0, 0);\n  color: white;\n}\n\n.ace-tm .ace_line .ace_support.ace_function {\n  color: rgb(60, 76, 114);\n}\n\n.ace-tm .ace_line .ace_keyword.ace_operator {\n  color: rgb(104, 118, 135);\n}\n\n.ace-tm .ace_line .ace_string {\n  color: rgb(3, 106, 7);\n}\n\n.ace-tm .ace_line .ace_comment {\n  color: rgb(76, 136, 107);\n}\n\n.ace-tm .ace_line .ace_comment.ace_doc {\n  color: rgb(0, 102, 255);\n}\n\n.ace-tm .ace_line .ace_comment.ace_doc.ace_tag {\n  color: rgb(128, 159, 191);\n}\n\n.ace-tm .ace_line .ace_constant.ace_numeric {\n  color: rgb(0, 0, 205);\n}\n\n.ace-tm .ace_line .ace_variable {\n  color: rgb(49, 132, 149);\n}\n\n.ace-tm .ace_line .ace_xml_pe {\n  color: rgb(104, 104, 91);\n}\n\n.ace-tm .ace_marker-layer .ace_selection {\n  background: rgb(181, 213, 255);\n}\n\n.ace-tm .ace_marker-layer .ace_step {\n  background: rgb(252, 255, 0);\n}\n\n.ace-tm .ace_marker-layer .ace_stack {\n  background: rgb(164, 229, 101);\n}\n\n.ace-tm .ace_marker-layer .ace_bracket {\n  margin: -1px 0 0 -1px;\n  border: 1px solid rgb(192, 192, 192);\n}\n\n.ace-tm .ace_marker-layer .ace_active_line {\n  background: rgb(232, 242, 254);\n}\n\n.ace-tm .ace_string.ace_regex {\n  color: rgb(255, 0, 0)   \n}", 
"../lib/dom"], function(h, g, e, c) {
  h("../lib/dom").importCssString(c);
  return{cssClass:"ace-tm"}
});