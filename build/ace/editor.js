/*
 RequireJS text Copyright (c) 2010, The Dojo Foundation All Rights Reserved.
 Available via the MIT or new BSD license.
 see: http://github.com/jrburke/requirejs for details
*/
(function() {
  var h = ["Msxml2.XMLHTTP", "Microsoft.XMLHTTP", "Msxml2.XMLHTTP.4.0"], g = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im, e = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im;
  if(!require.textStrip) {
    require.textStrip = function(d) {
      if(d) {
        d = d.replace(g, "");
        var i = d.match(e);
        if(i) {
          d = i[1]
        }
      }else {
        d = ""
      }return d
    }
  }if(!require.getXhr) {
    require.getXhr = function() {
      var d, i, c;
      if(typeof XMLHttpRequest !== "undefined") {
        return new XMLHttpRequest
      }else {
        for(i = 0;i < 3;i++) {
          c = h[i];
          try {
            d = new ActiveXObject(c)
          }catch(j) {
          }if(d) {
            h = [c];
            break
          }
        }
      }if(!d) {
        throw new Error("require.getXhr(): XMLHttpRequest not available");
      }return d
    }
  }if(!require.fetchText) {
    require.fetchText = function(d, i) {
      var c = require.getXhr();
      c.open("GET", d, true);
      c.onreadystatechange = function() {
        c.readyState === 4 && i(c.responseText)
      };
      c.send(null)
    }
  }require.plugin({prefix:"text", require:function() {
  }, newContext:function(d) {
    require.mixin(d, {text:{}, textWaiting:[]})
  }, load:function(d, i) {
    var c = false, j = null, a, f = d.indexOf("."), m = d.substring(0, f), n = d.substring(f + 1, d.length), b = require.s.contexts[i], k = b.textWaiting;
    f = n.indexOf("!");
    if(f !== -1) {
      c = n.substring(f + 1, n.length);
      n = n.substring(0, f);
      f = c.indexOf("!");
      if(f !== -1 && c.substring(0, f) === "strip") {
        j = c.substring(f + 1, c.length);
        c = "strip"
      }else {
        if(c !== "strip") {
          j = c;
          c = null
        }
      }
    }a = m + "!" + n;
    f = c ? a + "!" + c : a;
    if(j !== null && !b.text[a]) {
      b.defined[d] = b.text[a] = j
    }else {
      if(!b.text[a] && !b.textWaiting[a] && !b.textWaiting[f]) {
        k[f] || (k[f] = k[k.push({name:d, key:a, fullKey:f, strip:!!c}) - 1]);
        i = require.nameToUrl(m, "." + n, i);
        b.loaded[d] = false;
        require.fetchText(i, function(p) {
          b.text[a] = p;
          b.loaded[d] = true
        })
      }
    }
  }, checkDeps:function() {
  }, isWaiting:function(d) {
    return!!d.textWaiting.length
  }, orderDeps:function(d) {
    var i, c, j, a = d.textWaiting;
    d.textWaiting = [];
    for(i = 0;c = a[i];i++) {
      j = d.text[c.key];
      d.defined[c.name] = c.strip ? require.textStrip(j) : j
    }
  }})
})();
define("ace/lib/oop", ["require", "exports", "module"], function() {
  var h = {};
  h.inherits = function(g, e) {
    var d = function() {
    };
    d.prototype = e.prototype;
    g.super_ = e.prototype;
    g.prototype = new d;
    g.prototype.constructor = g
  };
  h.mixin = function(g, e) {
    for(var d in e) {
      g[d] = e[d]
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
    for(var d = window, i = 0;i < e.length;i++) {
      var c = e[i];
      d[c] || (d[c] = {});
      d = d[c]
    }
  };
  return h
});
define("ace/lib/event", ["require", "exports", "module", "./core"], function(h) {
  var g = h("./core"), e = {};
  e.addListener = function(d, i, c) {
    if(d.addEventListener) {
      return d.addEventListener(i, c, false)
    }if(d.attachEvent) {
      var j = function() {
        c(window.event)
      };
      c.$$wrapper = j;
      d.attachEvent("on" + i, j)
    }
  };
  e.removeListener = function(d, i, c) {
    if(d.removeEventListener) {
      return d.removeEventListener(i, c, false)
    }if(d.detachEvent) {
      d.detachEvent("on" + i, c.$$wrapper || c)
    }
  };
  e.stopEvent = function(d) {
    e.stopPropagation(d);
    e.preventDefault(d);
    return false
  };
  e.stopPropagation = function(d) {
    if(d.stopPropagation) {
      d.stopPropagation()
    }else {
      d.cancelBubble = true
    }
  };
  e.preventDefault = function(d) {
    if(d.preventDefault) {
      d.preventDefault()
    }else {
      d.returnValue = false
    }
  };
  e.getDocumentX = function(d) {
    return d.clientX ? d.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft) : d.pageX
  };
  e.getDocumentY = function(d) {
    return d.clientY ? d.clientY + (document.documentElement.scrollTop || document.body.scrollTop) : d.pageX
  };
  e.getButton = function(d) {
    return d.preventDefault ? d.button : Math.max(d.button - 1, 2)
  };
  e.capture = document.documentElement.setCapture ? function(d, i, c) {
    function j(a) {
      i && i(a);
      c && c();
      e.removeListener(d, "mousemove", i);
      e.removeListener(d, "mouseup", j);
      e.removeListener(d, "losecapture", j);
      d.releaseCapture()
    }
    e.addListener(d, "mousemove", i);
    e.addListener(d, "mouseup", j);
    e.addListener(d, "losecapture", j);
    d.setCapture()
  } : function(d, i, c) {
    function j(f) {
      i(f);
      f.stopPropagation()
    }
    function a(f) {
      i && i(f);
      c && c();
      document.removeEventListener("mousemove", j, true);
      document.removeEventListener("mouseup", a, true);
      f.stopPropagation()
    }
    document.addEventListener("mousemove", j, true);
    document.addEventListener("mouseup", a, true)
  };
  e.addMouseWheelListener = function(d, i) {
    var c = function(j) {
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
    e.addListener(d, "DOMMouseScroll", c);
    e.addListener(d, "mousewheel", c)
  };
  e.addMultiMouseDownListener = function(d, i, c, j, a) {
    var f = 0, m, n, b = function(k) {
      f += 1;
      if(f == 1) {
        m = k.clientX;
        n = k.clientY;
        setTimeout(function() {
          f = 0
        }, j || 600)
      }if(e.getButton(k) != i || Math.abs(k.clientX - m) > 5 || Math.abs(k.clientY - n) > 5) {
        f = 0
      }if(f == c) {
        f = 0;
        a(k)
      }return e.preventDefault(k)
    };
    e.addListener(d, "mousedown", b);
    g.isIE && e.addListener(d, "dblclick", b)
  };
  e.addKeyListener = function(d, i) {
    var c = null;
    e.addListener(d, "keydown", function(j) {
      c = j.keyIdentifier || j.keyCode;
      return i(j)
    });
    g.isMac && g.isGecko && e.addListener(d, "keypress", function(j) {
      if(c !== (j.keyIdentifier || j.keyCode)) {
        return i(j)
      }else {
        c = null
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
    for(var d = 0;d < g.length;d++) {
      if(g[d] == e) {
        return d
      }
    }return-1
  };
  h.isArray = function(g) {
    return Object.prototype.toString.call(g) == "[object Array]"
  };
  h.copyObject = function(g) {
    var e = {};
    for(var d in g) {
      e[d] = g[d]
    }return e
  };
  h.arrayToMap = function(g) {
    for(var e = {}, d = 0;d < g.length;d++) {
      e[g[d]] = 1
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
    var e = null, d = function() {
      e = null;
      g()
    };
    return{schedule:function() {
      e || (e = setTimeout(d, 0))
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
  return function(e, d) {
    function i() {
      if(!m) {
        var k = c.value;
        if(k) {
          if(k.charCodeAt(k.length - 1) == a.charCodeAt(0)) {
            (k = k.slice(0, -1)) && d.onTextInput(k)
          }else {
            d.onTextInput(k)
          }
        }
      }m = false;
      c.value = a;
      c.select()
    }
    var c = document.createElement("textarea"), j = c.style;
    j.position = "absolute";
    j.left = "-10000px";
    j.top = "-10000px";
    e.appendChild(c);
    var a = String.fromCharCode(0);
    i();
    var f = false, m = false, n = function() {
      setTimeout(function() {
        f || i()
      }, 0)
    }, b = function() {
      d.onCompositionUpdate(c.value)
    };
    g.addListener(c, "keypress", n);
    g.addListener(c, "textInput", n);
    g.addListener(c, "paste", n);
    g.addListener(c, "propertychange", n);
    g.addListener(c, "copy", function() {
      m = true;
      c.value = d.getCopyText();
      c.select();
      m = true;
      setTimeout(i, 0)
    });
    g.addListener(c, "cut", function() {
      m = true;
      c.value = d.getCopyText();
      d.onCut();
      c.select();
      setTimeout(i, 0)
    });
    g.addListener(c, "compositionstart", function() {
      f = true;
      i();
      c.value = "";
      d.onCompositionStart();
      setTimeout(b, 0)
    });
    g.addListener(c, "compositionupdate", b);
    g.addListener(c, "compositionend", function() {
      f = false;
      d.onCompositionEnd();
      n()
    });
    g.addListener(c, "blur", function() {
      d.onBlur()
    });
    g.addListener(c, "focus", function() {
      d.onFocus();
      c.select()
    });
    this.focus = function() {
      d.onFocus();
      c.select();
      c.focus()
    };
    this.blur = function() {
      c.blur()
    }
  }
});
define("ace/conf/keybindings/default_mac", ["require", "exports", "module"], function() {
  return{selectall:"Command-A", removeline:"Command-D", gotoline:"Command-L", togglecomment:"Command-7", findnext:"Command-K", findprevious:"Command-Shift-K", find:"Command-F", replace:"Command-R", undo:"Command-Z", redo:"Command-Shift-Z|Command-Y", overwrite:"Insert", copylinesup:"Command-Option-Up", movelinesup:"Option-Up", selecttostart:"Command-Shift-Up", gotostart:"Command-Home|Command-Up", selectup:"Shift-Up", golineup:"Up", copylinesdown:"Command-Option-Down", movelinesdown:"Option-Down", 
  selecttoend:"Command-Shift-Down", gotoend:"Command-End|Command-Down", selectdown:"Shift-Down", godown:"Down", selectwordleft:"Option-Shift-Left", gotowordleft:"Option-Left", selecttolinestart:"Command-Shift-Left", gotolinestart:"Command-Left|Home", selectleft:"Shift-Left", gotoleft:"Left", selectwordright:"Option-Shift-Right", gotowordright:"Option-Right", selecttolineend:"Command-Shift-Right", gotolineend:"Command-Right|End", selectright:"Shift-Right", gotoright:"Right", selectpagedown:"Shift-PageDown", 
  pagedown:"PageDown", selectpageup:"Shift-PageUp", pageup:"PageUp", selectlinestart:"Shift-Home", selectlineend:"Shift-End", del:"Delete", backspace:"Backspace", outdent:"Shift-Tab", indent:"Tab"}
});
define("ace/conf/keybindings/default_win", ["require", "exports", "module"], function() {
  return{selectall:"Ctrl-A", removeline:"Ctrl-D", gotoline:"Ctrl-L", togglecomment:"Ctrl-7", findnext:"Ctrl-K", findprevious:"Ctrl-Shift-K", find:"Ctrl-F", replace:"Ctrl-R", undo:"Ctrl-Z", redo:"Ctrl-Shift-Z|Ctrl-Y", overwrite:"Insert", copylinesup:"Ctrl-Alt-Up", movelinesup:"Alt-Up", selecttostart:"Alt-Shift-Up", gotostart:"Ctrl-Home|Ctrl-Up", selectup:"Shift-Up", golineup:"Up", copylinesdown:"Ctrl-Alt-Down", movelinesdown:"Alt-Down", selecttoend:"Alt-Shift-Down", gotoend:"Ctrl-End|Ctrl-Down", selectdown:"Shift-Down", 
  godown:"Down", selectwordleft:"Ctrl-Shift-Left", gotowordleft:"Ctrl-Left", selecttolinestart:"Ctrl-Shift-Left", gotolinestart:"Alt-Left|Home", selectleft:"Shift-Left", gotoleft:"Left", selectwordright:"Ctrl-Shift-Right", gotowordright:"Ctrl-Right", selecttolineend:"Ctrl-Shift-Right", gotolineend:"Alt-Right|End", selectright:"Shift-Right", gotoright:"Right", selectpagedown:"Shift-PageDown", pagedown:"PageDown", selectpageup:"Shift-PageUp", pageup:"PageUp", selectlinestart:"Shift-Home", selectlineend:"Shift-End", 
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
  var g = h("./lib/core"), e = h("./lib/event"), d = h("./conf/keybindings/default_mac"), i = h("./conf/keybindings/default_win"), c = h("./plugin_manager");
  h("./commands/default_commands");
  h = function(j, a, f) {
    this.setConfig(f);
    var m = this;
    e.addKeyListener(j, function(n) {
      var b = (m.config.reverse[0 | (n.ctrlKey ? 1 : 0) | (n.altKey ? 2 : 0) | (n.shiftKey ? 4 : 0) | (n.metaKey ? 8 : 0)] || {})[(m.keyNames[n.keyCode] || String.fromCharCode(n.keyCode)).toLowerCase()];
      if(b = c.commands[b]) {
        b(a, a.getSelection());
        return e.stopEvent(n)
      }
    })
  };
  (function() {
    function j(m, n, b, k) {
      return(k && m.toLowerCase() || m).replace(/(?:^\s+|\n|\s+$)/g, "").split(new RegExp("[\\s ]*" + n + "[\\s ]*", "g"), b || 999)
    }
    function a(m, n, b) {
      var k, p = 0;
      m = j(m, "\\-", null, true);
      for(var o = 0, l = m.length;o < l;++o) {
        if(this.keyMods[m[o]]) {
          p |= this.keyMods[m[o]]
        }else {
          k = m[o] || "-"
        }
      }(b[p] || (b[p] = {}))[k] = n;
      return b
    }
    function f(m, n) {
      var b, k, p, o, l = {};
      for(b in m) {
        o = m[b];
        if(n && typeof o == "string") {
          o = o.split(n);
          k = 0;
          for(p = o.length;k < p;++k) {
            a.call(this, o[k], b, l)
          }
        }else {
          a.call(this, o, b, l)
        }
      }return l
    }
    this.keyMods = {ctrl:1, alt:2, option:2, shift:4, meta:8, command:8};
    this.keyNames = {"8":"Backspace", "9":"Tab", "13":"Enter", "27":"Esc", "32":"Space", "33":"PageUp", "34":"PageDown", "35":"End", "36":"Home", "37":"Left", "38":"Up", "39":"Right", "40":"Down", "45":"Insert", "46":"Delete", "107":"+", "112":"F1", "113":"F2", "114":"F3", "115":"F4", "116":"F5", "117":"F6", "118":"F7", "119":"F8", "120":"F9", "121":"F10", "122":"F11", "123":"F12"};
    this.setConfig = function(m) {
      this.config = m || (g.isMac ? d : i);
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
  h.$dispatchEvent = function(e, d) {
    this.$eventRegistry = this.$eventRegistry || {};
    var i = this.$eventRegistry[e];
    if(i && i.length) {
      d = d || {};
      d.type = e;
      for(e = 0;e < i.length;e++) {
        i[e](d)
      }
    }
  };
  h.on = h.addEventListener = function(e, d) {
    this.$eventRegistry = this.$eventRegistry || {};
    var i = this.$eventRegistry[e];
    i || (i = this.$eventRegistry[e] = []);
    g.arrayIndexOf(i, d) == -1 && i.push(d)
  };
  h.removeEventListener = function(e, d) {
    this.$eventRegistry = this.$eventRegistry || {};
    if(e = this.$eventRegistry[e]) {
      d = g.arrayIndexOf(e, d);
      d !== -1 && e.splice(d, 1)
    }
  };
  return h
});
define("ace/range", ["require", "exports", "module"], function() {
  var h = function(g, e, d, i) {
    this.start = {row:g, column:e};
    this.end = {row:d, column:i}
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
        var d = {row:e + 1, column:0}
      }if(this.start.row > e) {
        var i = {row:e + 1, column:0}
      }if(this.start.row < g) {
        i = {row:g, column:0}
      }if(this.end.row < g) {
        d = {row:g, column:0}
      }return h.fromPoints(i || this.start, d || this.end)
    };
    this.extend = function(g, e) {
      var d = this.compare(g, e);
      if(d == 0) {
        return this
      }else {
        if(d == -1) {
          var i = {row:g, column:e}
        }else {
          var c = {row:g, column:e}
        }
      }return h.fromPoints(i || this.start, c || this.end)
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
  var g = h("./lib/oop"), e = h("./lib/lang"), d = h("./event_emitter"), i = h("./range");
  h = function(c) {
    this.doc = c;
    this.clearSelection();
    this.selectionLead = {row:0, column:0}
  };
  (function() {
    g.implement(this, d);
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
    this.setSelectionAnchor = function(c, j) {
      c = this.$clipPositionToDocument(c, j);
      if(this.selectionAnchor) {
        if(this.selectionAnchor.row !== c.row || this.selectionAnchor.column !== c.column) {
          this.selectionAnchor = c;
          this.$dispatchEvent("changeSelection", {})
        }
      }else {
        this.selectionAnchor = c;
        this.$dispatchEvent("changeSelection", {})
      }
    };
    this.getSelectionAnchor = function() {
      return this.selectionAnchor ? this.$clone(this.selectionAnchor) : this.$clone(this.selectionLead)
    };
    this.getSelectionLead = function() {
      return this.$clone(this.selectionLead)
    };
    this.shiftSelection = function(c) {
      if(this.isEmpty()) {
        this.moveCursorTo(this.selectionLead.row, this.selectionLead.column + c)
      }else {
        var j = this.getSelectionAnchor(), a = this.getSelectionLead(), f = this.isBackwards();
        if(!f || j.column !== 0) {
          this.setSelectionAnchor(j.row, j.column + c)
        }if(f || a.column !== 0) {
          this.$moveSelection(function() {
            this.moveCursorTo(a.row, a.column + c)
          })
        }
      }
    };
    this.isBackwards = function() {
      var c = this.selectionAnchor || this.selectionLead, j = this.selectionLead;
      return c.row > j.row || c.row == j.row && c.column > j.column
    };
    this.getRange = function() {
      var c = this.selectionAnchor || this.selectionLead, j = this.selectionLead;
      return this.isBackwards() ? i.fromPoints(j, c) : i.fromPoints(c, j)
    };
    this.clearSelection = function() {
      if(this.selectionAnchor) {
        this.selectionAnchor = null;
        this.$dispatchEvent("changeSelection", {})
      }
    };
    this.selectAll = function() {
      var c = this.doc.getLength() - 1;
      this.setSelectionAnchor(c, this.doc.getLine(c).length);
      this.$moveSelection(function() {
        this.moveCursorTo(0, 0)
      })
    };
    this.setSelectionRange = function(c, j) {
      if(j) {
        this.setSelectionAnchor(c.end.row, c.end.column);
        this.selectTo(c.start.row, c.start.column)
      }else {
        this.setSelectionAnchor(c.start.row, c.start.column);
        this.selectTo(c.end.row, c.end.column)
      }
    };
    this.$moveSelection = function(c) {
      var j = false;
      if(!this.selectionAnchor) {
        j = true;
        this.selectionAnchor = this.$clone(this.selectionLead)
      }var a = this.$clone(this.selectionLead);
      c.call(this);
      if(a.row !== this.selectionLead.row || a.column !== this.selectionLead.column) {
        j = true
      }j && this.$dispatchEvent("changeSelection", {})
    };
    this.selectTo = function(c, j) {
      this.$moveSelection(function() {
        this.moveCursorTo(c, j)
      })
    };
    this.selectToPosition = function(c) {
      this.$moveSelection(function() {
        this.moveCursorToPosition(c)
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
      var c = this.selectionLead;
      this.setSelectionRange(this.doc.getWordRange(c.row, c.column))
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
      var c = this.selectionLead.row, j = this.selectionLead.column, a = this.doc.getLine(c).slice(0, j).match(/^\s*/);
      if(a[0].length == 0) {
        this.moveCursorTo(c, this.doc.getLine(c).match(/^\s*/)[0].length)
      }else {
        a[0].length >= j ? this.moveCursorTo(c, 0) : this.moveCursorTo(c, a[0].length)
      }
    };
    this.moveCursorLineEnd = function() {
      this.moveCursorTo(this.selectionLead.row, this.doc.getLine(this.selectionLead.row).length)
    };
    this.moveCursorFileEnd = function() {
      var c = this.doc.getLength() - 1, j = this.doc.getLine(c).length;
      this.moveCursorTo(c, j)
    };
    this.moveCursorFileStart = function() {
      this.moveCursorTo(0, 0)
    };
    this.moveCursorWordRight = function() {
      var c = this.selectionLead.row, j = this.selectionLead.column, a = this.doc.getLine(c), f = a.substring(j);
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
        }this.moveCursorTo(c, j)
      }
    };
    this.moveCursorWordLeft = function() {
      var c = this.selectionLead.row, j = this.selectionLead.column, a = this.doc.getLine(c);
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
        }this.moveCursorTo(c, j)
      }
    };
    this.moveCursorBy = function(c, j) {
      this.moveCursorTo(this.selectionLead.row + c, this.selectionLead.column + j)
    };
    this.moveCursorToPosition = function(c) {
      this.moveCursorTo(c.row, c.column)
    };
    this.moveCursorTo = function(c, j) {
      c = this.$clipPositionToDocument(c, j);
      if(c.row !== this.selectionLead.row || c.column !== this.selectionLead.column) {
        this.selectionLead = c;
        this.$dispatchEvent("changeCursor", {data:this.getCursor()})
      }
    };
    this.moveCursorUp = function() {
      this.moveCursorBy(-1, 0)
    };
    this.$clipPositionToDocument = function(c, j) {
      var a = {};
      if(c >= this.doc.getLength()) {
        a.row = Math.max(0, this.doc.getLength() - 1);
        a.column = this.doc.getLine(a.row).length
      }else {
        if(c < 0) {
          a.row = 0;
          a.column = 0
        }else {
          a.row = c;
          a.column = Math.min(this.doc.getLine(a.row).length, Math.max(0, j))
        }
      }return a
    };
    this.$clone = function(c) {
      return{row:c.row, column:c.column}
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
      for(var d = [], i = 0;i < g.length;i++) {
        d.push(g[i].regex)
      }this.regExps[e] = new RegExp("(?:(" + d.join(")|(") + ")|(.))", "g")
    }
  };
  (function() {
    this.getLineTokens = function(g, e) {
      e = e;
      var d = this.rules[e], i = this.regExps[e];
      i.lastIndex = 0;
      for(var c, j = [], a = 0, f = {type:null, value:""};c = i.exec(g);) {
        var m = "text", n = c[0];
        if(i.lastIndex == a) {
          throw new Error("tokenizer error");
        }a = i.lastIndex;
        window.LOG && console.log(e, c);
        for(var b = 0;b < d.length;b++) {
          if(c[b + 1]) {
            m = typeof d[b].token == "function" ? d[b].token(c[0]) : d[b].token;
            if(d[b].next && d[b].next !== e) {
              e = d[b].next;
              d = this.rules[e];
              a = i.lastIndex;
              i = this.regExps[e];
              i.lastIndex = a
            }break
          }
        }if(f.type !== m) {
          f.type && j.push(f);
          f = {type:m, value:n}
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
      for(var d in g) {
        for(var i = g[d], c = 0;c < i.length;c++) {
          var j = i[c];
          j.next = j.next ? e + j.next : e + d
        }this.$rules[e + d] = i
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
    this.$getIndent = function(d) {
      if(d = d.match(/^(\s+)/)) {
        return d[1]
      }return""
    }
  }).call(h.prototype);
  return h
});
define("ace/document", ["require", "exports", "module", "./lib/oop", "./lib/lang", "./event_emitter", "./selection", "./mode/text", "./range"], function(h) {
  var g = h("./lib/oop"), e = h("./lib/lang"), d = h("./event_emitter"), i = h("./selection"), c = h("./mode/text"), j = h("./range");
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
    g.implement(this, d);
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
      var m = this.getLine(a), n = false;
      if(f > 0) {
        n = !!m.charAt(f - 1).match(this.tokenRe)
      }n || (n = !!m.charAt(f).match(this.tokenRe));
      n = n ? this.tokenRe : this.nonTokenRe;
      var b = f;
      if(b > 0) {
        do {
          b--
        }while(b >= 0 && m.charAt(b).match(n));
        b++
      }for(f = f;f < m.length && m.charAt(f).match(n);) {
        f++
      }return new j(a, b, a, f)
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
        this.$mode = new c
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
        for(var a = this.lines, f = 0, m = 0, n = this.getTabSize(), b = 0;b < a.length;b++) {
          var k = a[b].length;
          f = Math.max(f, k);
          a[b].replace("\t", function(p) {
            k += n - 1;
            return p
          });
          m = Math.max(m, k)
        }this.width = f;
        this.screenWith = m
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
      var m = this.$brackets[a], n = f.column - 2;
      f = f.row;
      for(var b = 1, k = this.getLine(f);;) {
        for(;n >= 0;) {
          var p = k.charAt(n);
          if(p == m) {
            b -= 1;
            if(b == 0) {
              return{row:f, column:n}
            }
          }else {
            if(p == a) {
              b += 1
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
      var m = this.$brackets[a], n = f.column;
      f = f.row;
      for(var b = 1, k = this.getLine(f), p = this.getLength();;) {
        for(;n < k.length;) {
          var o = k.charAt(n);
          if(o == m) {
            b -= 1;
            if(b == 0) {
              return{row:f, column:n}
            }
          }else {
            if(o == a) {
              b += 1
            }
          }n += 1
        }f += 1;
        if(f >= p) {
          break
        }k = this.getLine(f);
        n = 0
      }return null
    };
    this.insert = function(a, f, m) {
      f = this.$insert(a, f, m);
      this.fireChangeEvent(a.row, a.row == f.row ? a.row : undefined);
      return f
    };
    this.$insertLines = function(a, f, m) {
      if(f.length != 0) {
        var n = [a, 0];
        n.push.apply(n, f);
        this.lines.splice.apply(this.lines, n);
        if(!m && this.$undoManager) {
          m = this.$getNewLineCharacter();
          this.$deltas.push({action:"insertText", range:new j(a, 0, a + f.length, 0), text:f.join(m) + m});
          this.$informUndoManager.schedule()
        }
      }
    };
    this.$insert = function(a, f, m) {
      if(f.length == 0) {
        return a
      }this.modified = true;
      this.lines.length <= 1 && this.$detectNewLine(f);
      var n = this.$split(f);
      if(this.$isNewLine(f)) {
        var b = this.lines[a.row] || "";
        this.lines[a.row] = b.substring(0, a.column);
        this.lines.splice(a.row + 1, 0, b.substring(a.column));
        n = {row:a.row + 1, column:0}
      }else {
        if(n.length == 1) {
          b = this.lines[a.row] || "";
          this.lines[a.row] = b.substring(0, a.column) + f + b.substring(a.column);
          n = {row:a.row, column:a.column + f.length}
        }else {
          b = this.lines[a.row] || "";
          var k = b.substring(0, a.column) + n[0];
          b = n[n.length - 1] + b.substring(a.column);
          this.lines[a.row] = k;
          this.$insertLines(a.row + 1, [b], true);
          n.length > 2 && this.$insertLines(a.row + 1, n.slice(1, -1), true);
          n = {row:a.row + n.length - 1, column:n[n.length - 1].length}
        }
      }if(!m && this.$undoManager) {
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
        var m = a.end.row, n = this.getLine(f).substring(0, a.start.column) + this.getLine(m).substring(a.end.column);
        this.lines.splice(f, m - f + 1, n);
        return a.start
      }
    };
    this.undoChanges = function(a) {
      this.selection.clearSelection();
      for(var f = a.length - 1;f >= 0;f--) {
        var m = a[f];
        if(m.action == "insertText") {
          this.remove(m.range, true);
          this.selection.moveCursorToPosition(m.range.start)
        }else {
          this.insert(m.range.start, m.text, true);
          this.selection.clearSelection()
        }
      }
    };
    this.redoChanges = function(a) {
      this.selection.clearSelection();
      for(var f = 0;f < a.length;f++) {
        var m = a[f];
        if(m.action == "insertText") {
          this.insert(m.range.start, m.text, true);
          this.selection.setSelectionRange(m.range)
        }else {
          this.remove(m.range, true);
          this.selection.moveCursorToPosition(m.range.start)
        }
      }
    };
    this.replace = function(a, f) {
      this.$remove(a);
      f = f ? this.$insert(a.start, f) : a.start;
      var m = a.end.column == 0 ? a.end.column - 1 : a.end.column;
      this.fireChangeEvent(a.start.row, m == f.row ? m : undefined);
      return f
    };
    this.indentRows = function(a, f) {
      f.replace("\t", this.getTabString());
      for(var m = a.start.row;m <= a.end.row;m++) {
        this.$insert({row:m, column:0}, f)
      }this.fireChangeEvent(a.start.row, a.end.row);
      return f.length
    };
    this.outdentRows = function(a) {
      for(var f = new j(0, 0, 0, 0), m = this.getTabSize(), n = a.start.row;n <= a.end.row;++n) {
        var b = this.getLine(n);
        f.start.row = n;
        f.end.row = n;
        for(var k = 0;k < m;++k) {
          if(b.charAt(k) != " ") {
            break
          }
        }if(k < m && b.charAt(k) == "\t") {
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
      }var m = this.lines.slice(a, f + 1);
      this.$remove(new j(a, 0, f + 1, 0));
      this.$insertLines(a - 1, m);
      this.fireChangeEvent(a - 1, f);
      return-1
    };
    this.moveLinesDown = function(a, f) {
      if(f >= this.lines.length - 1) {
        return 0
      }var m = this.lines.slice(a, f + 1);
      this.$remove(new j(a, 0, f + 1, 0));
      this.$insertLines(a + 1, m);
      this.fireChangeEvent(a, f + 1);
      return 1
    };
    this.duplicateLines = function(a, f) {
      a = this.$clipRowToDocument(a);
      f = this.$clipRowToDocument(f);
      var m = this.getLines(a, f);
      this.$insertLines(a, m);
      f = f - a + 1;
      this.fireChangeEvent(a);
      return f
    };
    this.$clipRowToDocument = function(a) {
      return Math.max(0, Math.min(a, this.lines.length - 1))
    };
    this.documentToScreenColumn = function(a, f) {
      var m = this.getTabSize(), n = 0;
      f = f;
      a = this.getLine(a).split("\t");
      for(var b = 0;b < a.length;b++) {
        var k = a[b].length;
        if(f > k) {
          f -= k + 1;
          n += k + m
        }else {
          n += f;
          break
        }
      }return n
    };
    this.screenToDocumentColumn = function(a, f) {
      var m = this.getTabSize(), n = 0;
      f = f;
      a = this.getLine(a).split("\t");
      for(var b = 0;b < a.length;b++) {
        var k = a[b].length;
        if(f >= k + m) {
          f -= k + m;
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
  var g = h("./lib/lang"), e = h("./lib/oop"), d = h("./range"), i = function() {
    this.$options = {needle:"", backwards:false, wrap:false, caseSensitive:false, wholeWord:false, scope:i.ALL, regExp:false}
  };
  i.ALL = 1;
  i.SELECTION = 2;
  (function() {
    this.set = function(c) {
      e.mixin(this.$options, c);
      return this
    };
    this.getOptions = function() {
      return g.copyObject(this.$options)
    };
    this.find = function(c) {
      if(!this.$options.needle) {
        return null
      }var j = null;
      (this.$options.backwards ? this.$backwardMatchIterator(c) : this.$forwardMatchIterator(c)).forEach(function(a) {
        j = a;
        return true
      });
      return j
    };
    this.findAll = function(c) {
      if(!this.$options.needle) {
        return[]
      }var j = [];
      (this.$options.backwards ? this.$backwardMatchIterator(c) : this.$forwardMatchIterator(c)).forEach(function(a) {
        j.push(a)
      });
      return j
    };
    this.replace = function(c, j) {
      var a = this.$assembleRegExp(), f = a.exec(c);
      return f && f[0].length == c.length ? this.$options.regExp ? c.replace(a, j) : j : null
    };
    this.$forwardMatchIterator = function(c) {
      var j = this.$assembleRegExp(), a = this;
      return{forEach:function(f) {
        a.$forwardLineIterator(c).forEach(function(m, n, b) {
          if(n) {
            m = m.substring(n)
          }var k = [];
          m.replace(j, function(o) {
            k.push({str:o, offset:n + arguments[arguments.length - 2]});
            return o
          });
          for(m = 0;m < k.length;m++) {
            var p = k[m];
            p = a.$rangeFromMatch(b, p.offset, p.str.length);
            if(f(p)) {
              return true
            }
          }
        })
      }}
    };
    this.$backwardMatchIterator = function(c) {
      var j = this.$assembleRegExp(), a = this;
      return{forEach:function(f) {
        a.$backwardLineIterator(c).forEach(function(m, n, b) {
          if(n) {
            m = m.substring(n)
          }var k = [];
          m.replace(j, function(o, l) {
            k.push({str:o, offset:n + l});
            return o
          });
          for(m = k.length - 1;m >= 0;m--) {
            var p = k[m];
            p = a.$rangeFromMatch(b, p.offset, p.str.length);
            if(f(p)) {
              return true
            }
          }
        })
      }}
    };
    this.$rangeFromMatch = function(c, j, a) {
      return new d(c, j, c, j + a)
    };
    this.$assembleRegExp = function() {
      var c = this.$options.regExp ? this.$options.needle : g.escapeRegExp(this.$options.needle);
      if(this.$options.wholeWord) {
        c = "\\b" + c + "\\b"
      }var j = "g";
      this.$options.caseSensitive || (j += "i");
      return new RegExp(c, j)
    };
    this.$forwardLineIterator = function(c) {
      function j(o) {
        var l = c.getLine(o);
        if(a && o == f.end.row) {
          l = l.substring(0, f.end.column)
        }return l
      }
      var a = this.$options.scope == i.SELECTION, f = c.getSelection().getRange(), m = c.getSelection().getCursor(), n = a ? f.start.row : 0, b = a ? f.start.column : 0, k = a ? f.end.row : c.getLength() - 1, p = this.$options.wrap;
      return{forEach:function(o) {
        for(var l = m.row, r = j(l), q = m.column, s = false;!o(r, q, l);) {
          if(s) {
            return
          }l++;
          q = 0;
          if(l > k) {
            if(p) {
              l = n;
              q = b
            }else {
              return
            }
          }if(l == m.row) {
            s = true
          }r = j(l)
        }
      }}
    };
    this.$backwardLineIterator = function(c) {
      var j = this.$options.scope == i.SELECTION, a = c.getSelection().getRange(), f = j ? a.end : a.start, m = j ? a.start.row : 0, n = j ? a.start.column : 0, b = j ? a.end.row : c.getLength() - 1, k = this.$options.wrap;
      return{forEach:function(p) {
        for(var o = f.row, l = c.getLine(o).substring(0, f.column), r = 0, q = false;!p(l, r, o);) {
          if(q) {
            return
          }o--;
          r = 0;
          if(o < m) {
            if(k) {
              o = b
            }else {
              return
            }
          }if(o == f.row) {
            q = true
          }l = c.getLine(o);
          if(j) {
            if(o == m) {
              r = n
            }else {
              if(o == b) {
                l = l.substring(0, a.end.column)
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
  h = function(d, i) {
    this.running = false;
    this.textLines = [];
    this.lines = [];
    this.currentLine = 0;
    this.tokenizer = d;
    var c = this;
    this.$worker = function() {
      if(c.running) {
        for(var j = new Date, a = c.currentLine, f = c.textLines, m = 0, n = i.getLastVisibleRow();c.currentLine < f.length;) {
          c.lines[c.currentLine] = c.$tokenizeRows(c.currentLine, c.currentLine)[0];
          c.currentLine++;
          m += 1;
          if(m % 5 == 0 && new Date - j > 20) {
            c.fireUpdateEvent(a, c.currentLine - 1);
            c.running = setTimeout(c.$worker, c.currentLine < n ? 20 : 100);
            return
          }
        }c.running = false;
        c.fireUpdateEvent(a, f.length - 1)
      }
    }
  };
  (function() {
    g.implement(this, e);
    this.setTokenizer = function(d) {
      this.tokenizer = d;
      this.lines = [];
      this.start(0)
    };
    this.setLines = function(d) {
      this.textLines = d;
      this.lines = [];
      this.stop()
    };
    this.fireUpdateEvent = function(d, i) {
      this.$dispatchEvent("update", {data:{first:d, last:i}})
    };
    this.start = function(d) {
      this.currentLine = Math.min(d || 0, this.currentLine, this.textLines.length);
      this.lines.splice(this.currentLine, this.lines.length);
      this.stop();
      this.running = setTimeout(this.$worker, 700)
    };
    this.stop = function() {
      this.running && clearTimeout(this.running);
      this.running = false
    };
    this.getTokens = function(d, i, c) {
      c(this.$tokenizeRows(d, i))
    };
    this.getState = function(d, i) {
      i(this.$tokenizeRows(d, d)[0].state)
    };
    this.$tokenizeRows = function(d, i) {
      var c = [], j = "start", a = false;
      if(d > 0 && this.lines[d - 1]) {
        j = this.lines[d - 1].state;
        a = true
      }for(d = d;d <= i;d++) {
        if(this.lines[d]) {
          f = this.lines[d];
          j = f.state;
          c.push(f)
        }else {
          var f = this.tokenizer.getLineTokens(this.textLines[d] || "", j);
          j = f.state;
          c.push(f);
          if(a) {
            this.lines[d] = f
          }
        }
      }return c
    }
  }).call(h.prototype);
  return h
});
define("ace/editor", ["require", "exports", "module", "./lib/oop", "./lib/event", "./lib/lang", "./textinput", "./keybinding", "./document", "./search", "./background_tokenizer", "./range", "./event_emitter"], function(h) {
  var g = h("./lib/oop"), e = h("./lib/event"), d = h("./lib/lang"), i = h("./textinput"), c = h("./keybinding"), j = h("./document"), a = h("./search"), f = h("./background_tokenizer"), m = h("./range"), n = h("./event_emitter");
  h = function(b, k) {
    var p = b.getContainerElement();
    this.container = p;
    this.renderer = b;
    this.textInput = new i(p, this);
    this.keyBinding = new c(p, this);
    var o = this;
    e.addListener(p, "mousedown", function(l) {
      setTimeout(function() {
        o.focus()
      });
      return e.preventDefault(l)
    });
    e.addListener(p, "selectstart", function(l) {
      return e.preventDefault(l)
    });
    b = b.getMouseEventTarget();
    e.addListener(b, "mousedown", d.bind(this.onMouseDown, this));
    e.addMultiMouseDownListener(b, 0, 2, 500, d.bind(this.onMouseDoubleClick, this));
    e.addMultiMouseDownListener(b, 0, 3, 600, d.bind(this.onMouseTripleClick, this));
    e.addMouseWheelListener(b, d.bind(this.onMouseWheel, this));
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
    this.addEventListener = function(b, k) {
      return this.$forwardEvents[b] ? this.renderer.addEventListener(b, k) : this.$originalAddEventListener(b, k)
    };
    this.removeEventListener = function(b, k) {
      return this.$forwardEvents[b] ? this.renderer.removeEventListener(b, k) : this.$originalRemoveEventListener(b, k)
    };
    this.setDocument = function(b) {
      if(this.doc != b) {
        if(this.doc) {
          this.doc.removeEventListener("change", this.$onDocumentChange);
          this.doc.removeEventListener("changeMode", this.$onDocumentModeChange);
          this.doc.removeEventListener("changeTabSize", this.$onDocumentChangeTabSize);
          this.doc.removeEventListener("changeBreakpoint", this.$onDocumentChangeBreakpoint);
          var k = this.doc.getSelection();
          k.removeEventListener("changeCursor", this.$onCursorChange);
          k.removeEventListener("changeSelection", this.$onSelectionChange);
          this.doc.setScrollTopRow(this.renderer.getScrollTopRow())
        }this.doc = b;
        this.$onDocumentChange = d.bind(this.onDocumentChange, this);
        b.addEventListener("change", this.$onDocumentChange);
        this.renderer.setDocument(b);
        this.$onDocumentModeChange = d.bind(this.onDocumentModeChange, this);
        b.addEventListener("changeMode", this.$onDocumentModeChange);
        this.$onDocumentChangeTabSize = d.bind(this.renderer.updateText, this.renderer);
        b.addEventListener("changeTabSize", this.$onDocumentChangeTabSize);
        this.$onDocumentChangeBreakpoint = d.bind(this.onDocumentChangeBreakpoint, this);
        this.doc.addEventListener("changeBreakpoint", this.$onDocumentChangeBreakpoint);
        this.selection = b.getSelection();
        this.$desiredColumn = 0;
        this.$onCursorChange = d.bind(this.onCursorChange, this);
        this.selection.addEventListener("changeCursor", this.$onCursorChange);
        this.$onSelectionChange = d.bind(this.onSelectionChange, this);
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
          var k = b.doc.findMatchingBracket(b.getCursorPosition());
          if(k) {
            k = new m(k.row, k.column, k.row, k.column + 1);
            b.$bracketHighlight = b.renderer.addMarker(k, "ace_bracket")
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
        var b = this.getCursorPosition();
        this.$highlightLineMarker = this.renderer.addMarker(new m(b.row, 0, b.row + 1, 0), "ace_active_line", "line")
      }
    };
    this.onSelectionChange = function() {
      this.$selectionMarker && this.renderer.removeMarker(this.$selectionMarker);
      this.$selectionMarker = null;
      if(!this.selection.isEmpty()) {
        var b = this.selection.getRange(), k = this.getSelectionStyle();
        this.$selectionMarker = this.renderer.addMarker(b, "ace_selection", k)
      }this.onCursorChange()
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
          var k = d.bind(this.onTokenizerUpdate, this);
          this.bgTokenizer = new f(b, this);
          this.bgTokenizer.addEventListener("update", k)
        }this.renderer.setTokenizer(this.bgTokenizer)
      }
    };
    this.onMouseDown = function(b) {
      var k = e.getDocumentX(b), p = e.getDocumentY(b);
      k = this.renderer.screenToTextCoordinates(k, p);
      k.row = Math.max(0, Math.min(k.row, this.doc.getLength() - 1));
      if(e.getButton(b) != 0) {
        this.selection.isEmpty() && this.moveCursorToPosition(k)
      }else {
        if(b.shiftKey) {
          this.selection.selectToPosition(k)
        }else {
          this.moveCursorToPosition(k);
          this.$clickSelection || this.selection.clearSelection(k.row, k.column)
        }this.renderer.scrollCursorIntoView();
        var o = this, l, r;
        e.capture(this.container, function(s) {
          l = e.getDocumentX(s);
          r = e.getDocumentY(s)
        }, function() {
          clearInterval(q);
          o.$clickSelection = null
        });
        var q = setInterval(function() {
          if(!(l === undefined || r === undefined)) {
            var s = o.renderer.screenToTextCoordinates(l, r);
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
      var k = this.$scrollSpeed * 2;
      this.renderer.scrollBy(b.wheelX * k, b.wheelY * k);
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
        var k = this.getCursorPosition();
        b = b.replace("\t", this.doc.getTabString());
        if(this.selection.isEmpty()) {
          if(this.$overwrite) {
            var p = new m.fromPoints(k, k);
            p.end.column += b.length;
            this.doc.remove(p)
          }
        }else {
          k = this.doc.remove(this.getSelectionRange());
          this.clearSelection()
        }this.clearSelection();
        var o = this;
        this.bgTokenizer.getState(k.row, function(l) {
          var r = o.mode.checkOutdent(l, o.doc.getLine(k.row), b), q = o.doc.getLine(k.row), s = o.mode.getNextLineIndent(l, q, o.doc.getTabString()), t = o.doc.insert(k, b);
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
                }if(/[^\s]$/.test(q)) {
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
                }o.doc.replace(new m(w, 0, w, q.length), q.substr(v))
              }t.column += o.doc.indentRows(new m(k.row + 1, 0, t.row, t.column), s)
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
    this.setOverwrite = function(b) {
      if(this.$overwrite != b) {
        this.$overwrite = b;
        this.$blockScrolling = true;
        this.onCursorChange();
        this.$blockScrolling = false;
        this.$dispatchEvent("changeOverwrite", {data:b})
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
        this.$dispatchEvent("changeSelectionStyle", {data:b})
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
        var b = this.getSelectionRange();
        if(b.start.row < b.end.row || b.start.column < b.end.column) {
          b = this.doc.indentRows(this.getSelectionRange(), "\t");
          this.selection.shiftSelection(b)
        }else {
          if(this.doc.getUseSoftTabs()) {
            b = this.doc.getTabSize();
            b = b - this.getCursorPosition().column % b;
            b = d.stringRepeat(" ", b)
          }else {
            b = "\t"
          }return this.onTextInput(b)
        }
      }
    };
    this.blockOutdent = function() {
      if(!this.$readOnly) {
        var b = this.doc.getSelection(), k = this.doc.outdentRows(b.getRange());
        b.setSelectionRange(k, b.isBackwards());
        this.$updateDesiredColumn()
      }
    };
    this.toggleCommentLines = function() {
      if(!this.$readOnly) {
        var b = this.$getSelectedRows(), k = new m(b.first, 0, b.last, 0), p = this;
        this.bgTokenizer.getState(this.getCursorPosition().row, function(o) {
          o = p.mode.toggleCommentLines(o, p.doc, k);
          p.selection.shiftSelection(o)
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
      this.$readOnly || this.$moveLines(function(b, k) {
        return this.doc.moveLinesDown(b, k)
      })
    };
    this.moveLinesUp = function() {
      this.$readOnly || this.$moveLines(function(b, k) {
        return this.doc.moveLinesUp(b, k)
      })
    };
    this.copyLinesUp = function() {
      this.$readOnly || this.$moveLines(function(b, k) {
        this.doc.duplicateLines(b, k);
        return 0
      })
    };
    this.copyLinesDown = function() {
      this.$readOnly || this.$moveLines(function(b, k) {
        return this.doc.duplicateLines(b, k)
      })
    };
    this.$moveLines = function(b) {
      var k = this.$getSelectedRows(), p = b.call(this, k.first, k.last), o = this.selection;
      o.setSelectionAnchor(k.last + p + 1, 0);
      o.$moveSelection(function() {
        o.moveCursorTo(k.first + p, 0)
      })
    };
    this.$getSelectedRows = function() {
      var b = this.getSelectionRange(), k = b.start.row, p = b.end.row;
      if(b.end.column == 0 && b.start.row !== b.end.row) {
        p -= 1
      }return{first:k, last:p}
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
      var b = this.renderer.getFirstVisibleRow(), k = this.renderer.getLastVisibleRow();
      return b - (k - b) + 1
    };
    this.selectPageDown = function() {
      var b = this.getPageDownRow() + Math.floor(this.getVisibleRowCount() / 2);
      this.scrollPageDown();
      var k = this.getSelection();
      k.$moveSelection(function() {
        k.moveCursorTo(b, k.getSelectionLead().column)
      })
    };
    this.selectPageUp = function() {
      var b = this.getLastVisibleRow() - this.getFirstVisibleRow(), k = this.getPageUpRow() + Math.round(b / 2);
      this.scrollPageUp();
      var p = this.getSelection();
      p.$moveSelection(function() {
        p.moveCursorTo(k, p.getSelectionLead().column)
      })
    };
    this.gotoPageDown = function() {
      var b = this.getPageDownRow(), k = Math.min(this.getCursorPosition().column, this.doc.getLine(b).length);
      this.scrollToRow(b);
      this.getSelection().moveCursorTo(b, k)
    };
    this.gotoPageUp = function() {
      var b = this.getPageUpRow(), k = Math.min(this.getCursorPosition().column, this.doc.getLine(b).length);
      this.scrollToRow(b);
      this.getSelection().moveCursorTo(b, k)
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
    this.moveCursorTo = function(b, k) {
      this.selection.moveCursorTo(b, k);
      this.$updateDesiredColumn()
    };
    this.moveCursorToPosition = function(b) {
      this.selection.moveCursorToPosition(b);
      this.$updateDesiredColumn()
    };
    this.gotoLine = function(b, k) {
      this.selection.clearSelection();
      this.$blockScrolling = true;
      this.moveCursorTo(b - 1, k || 0);
      this.$blockScrolling = false;
      this.isRowVisible(this.getCursorPosition().row) || this.scrollToRow(b - 1 - Math.floor(this.getVisibleRowCount() / 2))
    };
    this.navigateTo = function(b, k) {
      this.clearSelection();
      this.moveCursorTo(b, k);
      this.$updateDesiredColumn(k)
    };
    this.navigateUp = function() {
      this.selection.clearSelection();
      this.selection.moveCursorBy(-1, 0);
      if(this.$desiredColumn) {
        var b = this.getCursorPosition(), k = this.doc.screenToDocumentColumn(b.row, this.$desiredColumn);
        this.selection.moveCursorTo(b.row, k)
      }
    };
    this.navigateDown = function() {
      this.selection.clearSelection();
      this.selection.moveCursorBy(1, 0);
      if(this.$desiredColumn) {
        var b = this.getCursorPosition(), k = this.doc.screenToDocumentColumn(b.row, this.$desiredColumn);
        this.selection.moveCursorTo(b.row, k)
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
    this.replace = function(b, k) {
      k && this.$search.set(k);
      k = this.$search.find(this.doc);
      this.$tryReplace(k, b);
      k !== null && this.selection.setSelectionRange(k);
      this.$updateDesiredColumn()
    };
    this.replaceAll = function(b, k) {
      k && this.$search.set(k);
      this.clearSelection();
      this.selection.moveCursorTo(0, 0);
      k = this.$search.findAll(this.doc);
      if(k.length) {
        for(var p = k.length - 1;p >= 0;--p) {
          this.$tryReplace(k[p], b)
        }k[0] !== null && this.selection.setSelectionRange(k[0]);
        this.$updateDesiredColumn()
      }
    };
    this.$tryReplace = function(b, k) {
      k = this.$search.replace(this.doc.getTextRange(b), k);
      if(k !== null) {
        b.end = this.doc.replace(b, k);
        return b
      }else {
        return null
      }
    };
    this.getLastSearchOptions = function() {
      return this.$search.getOptions()
    };
    this.find = function(b, k) {
      this.clearSelection();
      k = k || {};
      k.needle = b;
      this.$search.set(k);
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
      for(var e = [], d = g.firstRow;d <= g.lastRow;d++) {
        e.push("<div class='ace_gutter-cell", this.$decorations[d] || "", this.$breakpoints[d] ? " ace_breakpoint" : "", "' style='height:", g.lineHeight, "px;'>", d + 1, "</div>");
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
    this.addMarker = function(e, d, i) {
      var c = this.$markerId++;
      this.markers[c] = {range:e, type:i || "line", clazz:d};
      return c
    };
    this.removeMarker = function(e) {
      this.markers[e] && delete this.markers[e]
    };
    this.update = function(e) {
      if(e = e || this.config) {
        this.config = e;
        var d = [];
        for(var i in this.markers) {
          var c = this.markers[i], j = c.range.clipRows(e.firstRow, e.lastRow);
          if(!j.isEmpty()) {
            if(j.isMultiLine()) {
              c.type == "text" ? this.drawTextMarker(d, j, c.clazz, e) : this.drawMultiLineMarker(d, j, c.clazz, e)
            }else {
              this.drawSingleLineMarker(d, j, c.clazz, e)
            }
          }
        }this.element.innerHTML = d.join("")
      }
    };
    this.drawTextMarker = function(e, d, i, c) {
      var j = d.start.row, a = new g(j, d.start.column, j, this.doc.getLine(j).length);
      this.drawSingleLineMarker(e, a, i, c);
      j = d.end.row;
      a = new g(j, 0, j, d.end.column);
      this.drawSingleLineMarker(e, a, i, c);
      for(j = d.start.row + 1;j < d.end.row;j++) {
        a.start.row = j;
        a.end.row = j;
        a.end.column = this.doc.getLine(j).length;
        this.drawSingleLineMarker(e, a, i, c)
      }
    };
    this.drawMultiLineMarker = function(e, d, i, c) {
      d = d.toScreenRange(this.doc);
      var j = c.lineHeight, a = Math.round(c.width - d.start.column * c.characterWidth), f = (d.start.row - c.firstRow) * c.lineHeight, m = Math.round(d.start.column * c.characterWidth);
      e.push("<div class='", i, "' style='", "height:", j, "px;", "width:", a, "px;", "top:", f, "px;", "left:", m, "px;'></div>");
      f = (d.end.row - c.firstRow) * c.lineHeight;
      a = Math.round(d.end.column * c.characterWidth);
      e.push("<div class='", i, "' style='", "height:", j, "px;", "top:", f, "px;", "width:", a, "px;'></div>");
      j = (d.end.row - d.start.row - 1) * c.lineHeight;
      if(!(j < 0)) {
        f = (d.start.row + 1 - c.firstRow) * c.lineHeight;
        e.push("<div class='", i, "' style='", "height:", j, "px;", "width:", c.width, "px;", "top:", f, "px;'></div>")
      }
    };
    this.drawSingleLineMarker = function(e, d, i, c) {
      d = d.toScreenRange(this.doc);
      var j = c.lineHeight, a = Math.round((d.end.column - d.start.column) * c.characterWidth), f = (d.start.row - c.firstRow) * c.lineHeight;
      d = Math.round(d.start.column * c.characterWidth);
      e.push("<div class='", i, "' style='", "height:", j, "px;", "width:", a, "px;", "top:", f, "px;", "left:", d, "px;'></div>")
    }
  }).call(h.prototype);
  return h
});
define("ace/lib/dom", ["require", "exports", "module", "./lang"], function(h) {
  var g = h("./lang"), e = {};
  e.setText = function(d, i) {
    if(d.innerText !== undefined) {
      d.innerText = i
    }if(d.textContent !== undefined) {
      d.textContent = i
    }
  };
  e.hasCssClass = function(d, i) {
    d = d.className.split(/\s+/g);
    return g.arrayIndexOf(d, i) !== -1
  };
  e.addCssClass = function(d, i) {
    e.hasCssClass(d, i) || (d.className += " " + i)
  };
  e.removeCssClass = function(d, i) {
    for(var c = d.className.split(/\s+/g);;) {
      var j = g.arrayIndexOf(c, i);
      if(j == -1) {
        break
      }c.splice(j, 1)
    }d.className = c.join(" ")
  };
  e.importCssString = function(d, i) {
    i = i || document;
    if(i.createStyleSheet) {
      i.createStyleSheet().cssText = d
    }else {
      var c = i.createElement("style");
      c.appendChild(i.createTextNode(d));
      i.getElementsByTagName("head")[0].appendChild(c)
    }
  };
  e.getInnerWidth = function(d) {
    return parseInt(e.computedStyle(d, "paddingLeft")) + parseInt(e.computedStyle(d, "paddingRight")) + d.clientWidth
  };
  e.getInnerHeight = function(d) {
    return parseInt(e.computedStyle(d, "paddingTop")) + parseInt(e.computedStyle(d, "paddingBottom")) + d.clientHeight
  };
  e.computedStyle = function(d, i) {
    return window.getComputedStyle ? (window.getComputedStyle(d, "") || {})[i] || "" : d.currentStyle[i]
  };
  e.scrollbarWidth = function() {
    var d = document.createElement("p");
    d.style.width = "100%";
    d.style.height = "200px";
    var i = document.createElement("div"), c = i.style;
    c.position = "absolute";
    c.left = "-10000px";
    c.overflow = "hidden";
    c.width = "200px";
    c.height = "150px";
    i.appendChild(d);
    document.body.appendChild(i);
    var j = d.offsetWidth;
    c.overflow = "scroll";
    d = d.offsetWidth;
    if(j == d) {
      d = i.clientWidth
    }document.body.removeChild(i);
    return j - d
  };
  return e
});
define("ace/layer/text", ["require", "exports", "module", "../lib/oop", "../lib/dom", "../event_emitter"], function(h) {
  var g = h("../lib/oop"), e = h("../lib/dom"), d = h("../event_emitter");
  h = function(i) {
    this.element = document.createElement("div");
    this.element.className = "ace_layer ace_text-layer";
    i.appendChild(this.element);
    this.$characterSize = this.$measureSizes();
    this.$pollSizeChanges()
  };
  (function() {
    g.implement(this, d);
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
        var c = i.$measureSizes();
        if(i.$characterSize.width !== c.width || i.$characterSize.height !== c.height) {
          i.$characterSize = c;
          i.$dispatchEvent("changeCharaterSize", {data:c})
        }
      }, 500)
    };
    this.$fontStyles = {fontFamily:1, fontSize:1, fontWeight:1, fontStyle:1, lineHeight:1};
    this.$measureSizes = function() {
      var i = document.createElement("div"), c = i.style;
      c.width = c.height = "auto";
      c.left = c.top = "-1000px";
      c.visibility = "hidden";
      c.position = "absolute";
      c.overflow = "visible";
      for(var j in this.$fontStyles) {
        var a = e.computedStyle(this.element, j);
        c[j] = a
      }i.innerHTML = (new Array(1E3)).join("Xy");
      document.body.insertBefore(i, document.body.firstChild);
      c = {height:i.offsetHeight, width:i.offsetWidth / 2E3};
      document.body.removeChild(i);
      return c
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
    this.updateLines = function(i, c, j) {
      this.$computeTabString();
      var a = Math.max(c, i.firstRow), f = Math.min(j, i.lastRow), m = this.element.childNodes, n = this;
      this.tokenizer.getTokens(a, f, function(b) {
        for(var k = a;k <= f;k++) {
          var p = m[k - i.firstRow];
          if(p) {
            var o = [];
            n.$renderLine(o, k, b[k - a].tokens);
            p.innerHTML = o.join("")
          }
        }
      })
    };
    this.scrollLines = function(i) {
      function c(b) {
        i.firstRow < f.firstRow ? a.$renderLinesFragment(i, i.firstRow, f.firstRow - 1, function(k) {
          m.firstChild ? m.insertBefore(k, m.firstChild) : m.appendChild(k);
          b()
        }) : b()
      }
      function j() {
        i.lastRow > f.lastRow && a.$renderLinesFragment(i, f.lastRow + 1, i.lastRow, function(b) {
          m.appendChild(b)
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
      }var m = this.element;
      if(f.firstRow < i.firstRow) {
        for(var n = f.firstRow;n < i.firstRow;n++) {
          m.removeChild(m.firstChild)
        }
      }if(f.lastRow > i.lastRow) {
        for(n = i.lastRow + 1;n <= f.lastRow;n++) {
          m.removeChild(m.lastChild)
        }
      }c(j)
    };
    this.$renderLinesFragment = function(i, c, j, a) {
      var f = document.createDocumentFragment(), m = this;
      this.tokenizer.getTokens(c, j, function(n) {
        for(var b = c;b <= j;b++) {
          var k = document.createElement("div");
          k.className = "ace_line";
          var p = k.style;
          p.height = m.$characterSize.height + "px";
          p.width = i.width + "px";
          p = [];
          m.$renderLine(p, b, n[b - c].tokens);
          k.innerHTML = p.join("");
          f.appendChild(k)
        }a(f)
      })
    };
    this.update = function(i) {
      this.$computeTabString();
      var c = [], j = this;
      this.tokenizer.getTokens(i.firstRow, i.lastRow, function(a) {
        for(var f = i.firstRow;f <= i.lastRow;f++) {
          c.push("<div class='ace_line' style='height:" + j.$characterSize.height + "px;", "width:", i.width, "px'>");
          j.$renderLine(c, f, a[f - i.firstRow].tokens);
          c.push("</div>")
        }j.element.innerHTML = c.join("")
      })
    };
    this.$textToken = {text:true, rparen:true, lparen:true};
    this.$renderLine = function(i, c, j) {
      for(var a = /[\v\f \u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000]/g, f = 0;f < j.length;f++) {
        var m = j[f], n = m.value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(a, "&nbsp;").replace(/\t/g, this.$tabString);
        if(this.$textToken[m.type]) {
          i.push(n)
        }else {
          m = "ace_" + m.type.replace(/\./g, " ace_");
          i.push("<span class='", m, "'>", n, "</span>")
        }
      }if(this.$showInvisibles) {
        c !== this.doc.getLength() - 1 ? i.push("<span class='ace_invisible'>" + this.EOL_CHAR + "</span>") : i.push("<span class='ace_invisible'>" + this.EOF_CHAR + "</span>")
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
    this.setCursor = function(e, d) {
      this.position = {row:e.row, column:this.doc.documentToScreenColumn(e.row, e.column)};
      d ? g.addCssClass(this.cursor, "ace_overwrite") : g.removeCssClass(this.cursor, "ace_overwrite")
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
        var d = Math.round(this.position.column * e.characterWidth), i = this.position.row * e.lineHeight;
        this.pixelPos = {left:d, top:i};
        this.cursor.style.left = d + "px";
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
  var g = h("./lib/oop"), e = h("./lib/lang"), d = h("./lib/dom"), i = h("./lib/event"), c = h("./event_emitter");
  h = function(j) {
    this.element = document.createElement("div");
    this.element.className = "ace_sb";
    this.inner = document.createElement("div");
    this.element.appendChild(this.inner);
    j.appendChild(this.element);
    this.width = d.scrollbarWidth();
    this.element.style.width = this.width;
    i.addListener(this.element, "scroll", e.bind(this.onScroll, this))
  };
  (function() {
    g.implement(this, c);
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
        var d = this;
        this.setTimeoutZero(function() {
          d.pending = false;
          d.onRender(d.changes);
          d.changes = 0
        })
      }
    };
    if(window.postMessage) {
      this.messageName = "zero-timeout-message";
      this.setTimeoutZero = function(e) {
        if(!this.attached) {
          var d = this;
          g.addListener(window, "message", function(i) {
            if(i.source == window && d.callback && i.data == d.messageName) {
              g.stopPropagation(i);
              d.callback()
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
"./lib/oop", "./lib/oop", "./lib/event", "./layer/gutter", "./layer/marker", "./layer/text", "./layer/cursor", "./scrollbar", "./renderloop", "./event_emitter"], function(h, g, e, d) {
  var i = h("./lib/oop"), c = h("./lib/lang"), j = h("./lib/dom"), a = h("./lib/event"), f = h("./layer/gutter"), m = h("./layer/marker"), n = h("./layer/text"), b = h("./layer/cursor"), k = h("./scrollbar"), p = h("./renderloop"), o = h("./event_emitter");
  j.importCssString(d);
  g = function(l, r) {
    this.container = l;
    j.addCssClass(this.container, "ace_editor");
    this.setTheme(r);
    this.scroller = document.createElement("div");
    this.scroller.className = "ace_scroller";
    this.container.appendChild(this.scroller);
    this.$gutter = document.createElement("div");
    this.$gutter.className = "ace_gutter";
    this.container.appendChild(this.$gutter);
    this.content = document.createElement("div");
    this.content.style.position = "absolute";
    this.scroller.appendChild(this.content);
    this.$gutterLayer = new f(this.$gutter);
    this.$markerLayer = new m(this.content);
    var q = this.$textLayer = new n(this.content);
    this.canvas = q.element;
    this.characterWidth = q.getCharacterWidth();
    this.lineHeight = q.getLineHeight();
    this.$cursorLayer = new b(this.content);
    this.layers = [this.$markerLayer, q, this.$cursorLayer];
    this.scrollBar = new k(l);
    this.scrollBar.addEventListener("scroll", c.bind(this.onScroll, this));
    this.scrollTop = 0;
    this.cursorPos = {row:0, column:0};
    var s = this;
    this.$textLayer.addEventListener("changeCharaterSize", function() {
      s.characterWidth = q.getCharacterWidth();
      s.lineHeight = q.getLineHeight();
      s.$loop.schedule(s.CHANGE_FULL)
    });
    a.addListener(this.$gutter, "click", c.bind(this.$onGutterClick, this));
    a.addListener(this.$gutter, "dblclick", c.bind(this.$onGutterClick, this));
    this.$size = {width:0, height:0, scrollerHeight:0, scrollerWidth:0};
    this.$loop = new p(c.bind(this.$renderChanges, this));
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
    this.setDocument = function(l) {
      this.lines = l.lines;
      this.doc = l;
      this.$cursorLayer.setDocument(l);
      this.$markerLayer.setDocument(l);
      this.$textLayer.setDocument(l);
      this.$loop.schedule(this.CHANGE_FULL)
    };
    this.updateLines = function(l, r) {
      if(r === undefined) {
        r = Infinity
      }if(this.$changedLines) {
        if(this.$changedLines.firstRow > l) {
          this.$changedLines.firstRow = l
        }if(this.$changedLines.lastRow < r) {
          this.$changedLines.lastRow = r
        }
      }else {
        this.$changedLines = {firstRow:l, lastRow:r}
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
      var l = j.getInnerHeight(this.container);
      if(this.$size.height != l) {
        this.$size.height = l;
        this.scroller.style.height = l + "px";
        this.scrollBar.setHeight(l);
        if(this.doc) {
          this.scrollToY(this.getScrollTop());
          this.$loop.schedule(this.CHANGE_FULL)
        }
      }l = j.getInnerWidth(this.container);
      if(this.$size.width != l) {
        this.$size.width = l;
        var r = this.showGutter ? this.$gutter.offsetWidth : 0;
        this.scroller.style.left = r + "px";
        this.scroller.style.width = Math.max(0, l - r - this.scrollBar.getWidth()) + "px"
      }this.$size.scrollerWidth = this.scroller.clientWidth;
      this.$size.scrollerHeight = this.scroller.clientHeight
    };
    this.setTokenizer = function(l) {
      this.$tokenizer = l;
      this.$textLayer.setTokenizer(l);
      this.$loop.schedule(this.CHANGE_TEXT)
    };
    this.$onGutterClick = function(l) {
      var r = a.getDocumentX(l), q = a.getDocumentY(l);
      this.$dispatchEvent("gutter" + l.type, {row:this.screenToTextCoordinates(r, q).row, htmlEvent:l})
    };
    this.$showInvisibles = true;
    this.setShowInvisibles = function(l) {
      this.$showInvisibles = l;
      this.$textLayer.setShowInvisibles(l);
      this.$loop.schedule(this.CHANGE_TEXT)
    };
    this.getShowInvisibles = function() {
      return this.$showInvisibles
    };
    this.$showPrintMargin = true;
    this.setShowPrintMargin = function(l) {
      this.$showPrintMargin = l;
      this.$updatePrintMargin()
    };
    this.getShowPrintMargin = function() {
      return this.$showPrintMargin
    };
    this.$printMarginColumn = 80;
    this.setPrintMarginColumn = function(l) {
      this.$printMarginColumn = l;
      this.$updatePrintMargin()
    };
    this.getPrintMarginColumn = function() {
      return this.$printMarginColumn
    };
    this.setShowGutter = function(l) {
      this.$gutter.style.display = l ? "block" : "none";
      this.showGutter = l;
      this.onResize()
    };
    this.$updatePrintMargin = function() {
      if(this.$showPrintMargin || this.$printMarginEl) {
        if(!this.$printMarginEl) {
          this.$printMarginEl = document.createElement("div");
          this.$printMarginEl.className = "ace_printMargin";
          this.content.insertBefore(this.$printMarginEl, this.$textLayer.element)
        }var l = this.$printMarginEl.style;
        l.left = this.characterWidth * this.$printMarginColumn + "px";
        l.visibility = this.$showPrintMargin ? "visible" : "hidden"
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
    this.setPadding = function(l) {
      this.$padding = l;
      this.content.style.padding = "0 " + l + "px";
      this.$loop.schedule(this.CHANGE_FULL)
    };
    this.onScroll = function(l) {
      this.scrollToY(l.data)
    };
    this.$updateScrollBar = function() {
      this.scrollBar.setInnerHeight(this.doc.getLength() * this.lineHeight);
      this.scrollBar.setScrollTop(this.scrollTop)
    };
    this.$renderChanges = function(l) {
      if(!(!l || !this.doc || !this.$tokenizer)) {
        if(!this.layerConfig || l & this.CHANGE_FULL || l & this.CHANGE_SIZE || l & this.CHANGE_TEXT || l & this.CHANGE_LINES || l & this.CHANGE_SCROLL) {
          this.$computeLayerConfig()
        }if(l & this.CHANGE_FULL) {
          this.$textLayer.update(this.layerConfig);
          this.showGutter && this.$gutterLayer.update(this.layerConfig);
          this.$markerLayer.update(this.layerConfig);
          this.$cursorLayer.update(this.layerConfig);
          this.$updateScrollBar()
        }else {
          if(l & this.CHANGE_SCROLL) {
            l & this.CHANGE_TEXT || l & this.CHANGE_LINES ? this.$textLayer.scrollLines(this.layerConfig) : this.$textLayer.update(this.layerConfig);
            this.showGutter && this.$gutterLayer.update(this.layerConfig);
            this.$markerLayer.update(this.layerConfig);
            this.$cursorLayer.update(this.layerConfig);
            this.$updateScrollBar()
          }else {
            if(l & this.CHANGE_TEXT) {
              this.$textLayer.update(this.layerConfig);
              this.showGutter && this.$gutterLayer.update(this.layerConfig)
            }else {
              if(l & this.CHANGE_LINES) {
                this.$updateLines();
                this.$updateScrollBar()
              }else {
                if(l & this.CHANGE_SCROLL) {
                  this.$textLayer.scrollLines(this.layerConfig);
                  this.showGutter && this.$gutterLayer.update(this.layerConfig)
                }
              }
            }l & this.CHANGE_GUTTER && this.showGutter && this.$gutterLayer.update(this.layerConfig);
            l & this.CHANGE_CURSOR && this.$cursorLayer.update(this.layerConfig);
            l & this.CHANGE_MARKER && this.$markerLayer.update(this.layerConfig);
            l & this.CHANGE_SIZE && this.$updateScrollBar()
          }
        }
      }
    };
    this.$computeLayerConfig = function() {
      var l = this.scrollTop % this.lineHeight, r = this.$size.scrollerHeight + this.lineHeight, q = this.$getLongestLine(), s = !this.layerConfig ? true : this.layerConfig.width != q, t = Math.ceil(r / this.lineHeight), u = Math.max(0, Math.round((this.scrollTop - l) / this.lineHeight));
      t = Math.min(this.lines.length, u + t) - 1;
      this.layerConfig = {width:q, padding:this.$padding, firstRow:u, lastRow:t, lineHeight:this.lineHeight, characterWidth:this.characterWidth, minHeight:r, offset:l, height:this.$size.scrollerHeight};
      for(u = 0;u < this.layers.length;u++) {
        t = this.layers[u];
        if(s) {
          t.element.style.width = q + "px"
        }
      }this.$gutterLayer.element.style.marginTop = -l + "px";
      this.content.style.marginTop = -l + "px";
      this.content.style.width = q + "px";
      this.content.style.height = r + "px"
    };
    this.$updateLines = function() {
      var l = this.$changedLines.firstRow, r = this.$changedLines.lastRow;
      this.$changedLines = null;
      var q = this.layerConfig;
      if(q.width != this.$getLongestLine()) {
        return this.$textLayer.update(q)
      }if(!(l > q.lastRow + 1)) {
        if(!(r < q.firstRow)) {
          if(r === Infinity) {
            this.showGutter && this.$gutterLayer.update(q);
            this.$textLayer.update(q)
          }else {
            this.$textLayer.updateLines(q, l, r)
          }
        }
      }
    };
    this.$getLongestLine = function() {
      var l = this.doc.getScreenWidth();
      if(this.$showInvisibles) {
        l += 1
      }return Math.max(this.$size.scrollerWidth - this.$padding * 2, Math.round(l * this.characterWidth))
    };
    this.addMarker = function(l, r, q) {
      l = this.$markerLayer.addMarker(l, r, q);
      this.$loop.schedule(this.CHANGE_MARKER);
      return l
    };
    this.removeMarker = function(l) {
      this.$markerLayer.removeMarker(l);
      this.$loop.schedule(this.CHANGE_MARKER)
    };
    this.addGutterDecoration = function(l, r) {
      this.$gutterLayer.addGutterDecoration(l, r);
      this.$loop.schedule(this.CHANGE_GUTTER)
    };
    this.removeGutterDecoration = function(l, r) {
      this.$gutterLayer.removeGutterDecoration(l, r);
      this.$loop.schedule(this.CHANGE_GUTTER)
    };
    this.setBreakpoints = function(l) {
      this.$gutterLayer.setBreakpoints(l);
      this.$loop.schedule(this.CHANGE_GUTTER)
    };
    this.updateCursor = function(l, r) {
      this.$cursorLayer.setCursor(l, r);
      this.$loop.schedule(this.CHANGE_CURSOR)
    };
    this.hideCursor = function() {
      this.$cursorLayer.hideCursor()
    };
    this.showCursor = function() {
      this.$cursorLayer.showCursor()
    };
    this.scrollCursorIntoView = function() {
      var l = this.$cursorLayer.getPixelPosition(), r = l.left + this.$padding;
      l = l.top;
      this.getScrollTop() > l && this.scrollToY(l);
      this.getScrollTop() + this.$size.scrollerHeight < l + this.lineHeight && this.scrollToY(l + this.lineHeight - this.$size.scrollerHeight);
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
    this.scrollToRow = function(l) {
      this.scrollToY(l * this.lineHeight)
    };
    this.scrollToY = function(l) {
      l = Math.max(0, Math.min(this.lines.length * this.lineHeight - this.$size.scrollerHeight, l));
      if(this.scrollTop !== l) {
        this.scrollTop = l;
        this.$loop.schedule(this.CHANGE_SCROLL)
      }
    };
    this.scrollToX = function(l) {
      if(l <= this.$padding) {
        l = 0
      }this.scroller.scrollLeft = l
    };
    this.scrollBy = function(l, r) {
      r && this.scrollToY(this.scrollTop + r);
      l && this.scrollToX(this.scroller.scrollLeft + l)
    };
    this.screenToTextCoordinates = function(l, r) {
      var q = this.scroller.getBoundingClientRect();
      l = Math.round((l + this.scroller.scrollLeft - q.left - this.$padding) / this.characterWidth);
      r = Math.floor((r + this.scrollTop - q.top) / this.lineHeight);
      return{row:r, column:this.doc.screenToDocumentColumn(Math.max(0, Math.min(r, this.doc.getLength() - 1)), l)}
    };
    this.textToScreenCoordinates = function(l, r) {
      var q = this.scroller.getBoundingClientRect();
      r = this.padding + Math.round(this.doc.documentToScreenColumn(l, r) * this.characterWidth);
      l = l * this.lineHeight;
      return{pageX:q.left + r - this.getScrollLeft(), pageY:q.top + l - this.getScrollTop()}
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
    this.setTheme = function(l) {
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
      if(!l || typeof l == "string") {
        l = l || "ace/theme/TextMate";
        h([l], function(s) {
          r(s)
        })
      }else {
        r(l)
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
    this.getStartRule = function(d) {
      return{token:"comment.doc", regex:"\\/\\*(?=\\*)", next:d}
    }
  }).call(e.prototype);
  return e
});
define("ace/mode/javascript_highlight_rules", ["require", "exports", "module", "../lib/oop", "../lib/lang", "./doc_comment_highlight_rules", "./text_highlight_rules"], function(h) {
  var g = h("../lib/oop"), e = h("../lib/lang"), d = h("./doc_comment_highlight_rules");
  h = h("./text_highlight_rules");
  JavaScriptHighlightRules = function() {
    var i = new d, c = e.arrayToMap("break|case|catch|continue|default|delete|do|else|finally|for|function|if|in|instanceof|new|return|switch|throw|try|typeof|var|while|with".split("|")), j = e.arrayToMap("true|false|null|undefined|Infinity|NaN|undefined".split("|")), a = e.arrayToMap("class|enum|extends|super|const|export|import|implements|let|private|public|yield|interface|package|protected|static".split("|"));
    this.$rules = {start:[{token:"comment", regex:"\\/\\/.*$"}, i.getStartRule("doc-start"), {token:"comment", regex:"\\/\\*", next:"comment"}, {token:"string.regexp", regex:"[/](?:(?:\\[(?:\\\\]|[^\\]])+\\])|(?:\\\\/|[^\\]/]))*[/][gimy]*\\s*(?=[).,;]|$)"}, {token:"string", regex:'["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'}, {token:"string", regex:'["].*\\\\$', next:"qqstring"}, {token:"string", regex:"['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"}, {token:"string", regex:"['].*\\\\$", next:"qstring"}, {token:"constant.numeric", 
    regex:"0[xX][0-9a-fA-F]+\\b"}, {token:"constant.numeric", regex:"[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"}, {token:function(f) {
      return f == "this" ? "variable.language" : c[f] ? "keyword" : j[f] ? "constant.language" : a[f] ? "invalid.illegal" : f == "debugger" ? "invalid.deprecated" : "identifier"
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
    this.checkOutdent = function(e, d) {
      if(!/^\s+$/.test(e)) {
        return false
      }return/^\s*\}/.test(d)
    };
    this.autoOutdent = function(e, d) {
      var i = e.getLine(d).match(/^(\s*\})/);
      if(!i) {
        return 0
      }i = i[1].length;
      var c = e.findMatchingBracket({row:d, column:i});
      if(!c || c.row == d) {
        return 0
      }c = this.$getIndent(e.getLine(c.row));
      e.replace(new g(d, 0, d, i - 1), c);
      return c.length - (i - 1)
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
  var g = h("../lib/oop"), e = h("./text"), d = h("../tokenizer"), i = h("./javascript_highlight_rules"), c = h("./matching_brace_outdent"), j = h("../range");
  h = function() {
    this.$tokenizer = new d((new i).getRules());
    this.$outdent = new c
  };
  g.inherits(h, e);
  (function() {
    this.toggleCommentLines = function(a, f, m) {
      var n = true;
      a = /^(\s*)\/\//;
      for(var b = m.start.row;b <= m.end.row;b++) {
        if(!a.test(f.getLine(b))) {
          n = false;
          break
        }
      }if(n) {
        n = new j(0, 0, 0, 0);
        for(b = m.start.row;b <= m.end.row;b++) {
          var k = f.getLine(b).replace(a, "$1");
          n.start.row = b;
          n.end.row = b;
          n.end.column = k.length + 2;
          f.replace(n, k)
        }return-2
      }else {
        return f.indentRows(m, "//")
      }
    };
    this.getNextLineIndent = function(a, f, m) {
      var n = this.$getIndent(f), b = this.$tokenizer.getLineTokens(f, a), k = b.tokens;
      b = b.state;
      if(k.length && k[k.length - 1].type == "comment") {
        return n
      }if(a == "start") {
        if(a = f.match(/^.*[\{\(\[]\s*$/)) {
          n += m
        }
      }else {
        if(a == "doc-start") {
          if(b == "start") {
            return""
          }if(a = f.match(/^\s*(\/?)\*/)) {
            if(a[1]) {
              n += " "
            }n += "* "
          }
        }
      }return n
    };
    this.checkOutdent = function(a, f, m) {
      return this.$outdent.checkOutdent(f, m)
    };
    this.autoOutdent = function(a, f, m) {
      return this.$outdent.autoOutdent(f, m)
    }
  }).call(h.prototype);
  return h
});
define("ace/theme/textmate", ["require", "exports", "module", "text!ace/theme/tm.css!.ace-tm .ace_editor {\n  border: 2px solid rgb(159, 159, 159);\n}\n\n.ace-tm .ace_editor.ace_focus {\n  border: 2px solid #327fbd;\n}\n\n.ace-tm .ace_gutter {\n  width: 50px;\n  background: #e8e8e8;\n  color: #333;\n  overflow : hidden;\n}\n\n.ace-tm .ace_gutter-layer {\n  width: 100%;\n  text-align: right;\n}\n\n.ace-tm .ace_gutter-layer .ace_gutter-cell {\n  padding-right: 6px;\n}\n\n.ace-tm .ace_editor .ace_printMargin {\n  width: 1px;\n  background: #e8e8e8;\n}\n\n.ace-tm .ace_text-layer {\n  cursor: text;\n}\n\n.ace-tm .ace_cursor {\n  border-left: 2px solid black;\n}\n\n.ace-tm .ace_cursor.ace_overwrite {\n  border-left: 0px;\n  border-bottom: 1px solid black;\n}\n        \n.ace-tm .ace_line .ace_invisible {\n  color: rgb(191, 191, 191);\n}\n\n.ace-tm .ace_line .ace_keyword {\n  color: blue;\n}\n\n.ace-tm .ace_line .ace_constant.ace_buildin {\n  color: rgb(88, 72, 246);\n}\n\n.ace-tm .ace_line .ace_constant.ace_library {\n  color: rgb(6, 150, 14);\n}\n\n.ace-tm .ace_line .ace_invalid {\n  background-color: rgb(153, 0, 0);\n  color: white;\n}\n\n.ace-tm .ace_line .ace_support.ace_function {\n  color: rgb(60, 76, 114);\n}\n\n.ace-tm .ace_line .ace_keyword.ace_operator {\n  color: rgb(104, 118, 135);\n}\n\n.ace-tm .ace_line .ace_string {\n  color: rgb(3, 106, 7);\n}\n\n.ace-tm .ace_line .ace_comment {\n  color: rgb(76, 136, 107);\n}\n\n.ace-tm .ace_line .ace_comment.ace_doc {\n  color: rgb(0, 102, 255);\n}\n\n.ace-tm .ace_line .ace_comment.ace_doc.ace_tag {\n  color: rgb(128, 159, 191);\n}\n\n.ace-tm .ace_line .ace_constant.ace_numeric {\n  color: rgb(0, 0, 205);\n}\n\n.ace-tm .ace_line .ace_variable {\n  color: rgb(49, 132, 149);\n}\n\n.ace-tm .ace_line .ace_xml_pe {\n  color: rgb(104, 104, 91);\n}\n\n.ace-tm .ace_marker-layer .ace_selection {\n  background: rgb(181, 213, 255);\n}\n\n.ace-tm .ace_marker-layer .ace_step {\n  background: rgb(252, 255, 0);\n}\n\n.ace-tm .ace_marker-layer .ace_stack {\n  background: rgb(164, 229, 101);\n}\n\n.ace-tm .ace_marker-layer .ace_bracket {\n  margin: -1px 0 0 -1px;\n  border: 1px solid rgb(192, 192, 192);\n}\n\n.ace-tm .ace_marker-layer .ace_active_line {\n  background: rgb(232, 242, 254);\n}\n\n.ace-tm .ace_string.ace_regex {\n  color: rgb(255, 0, 0)   \n}", 
"../lib/dom"], function(h, g, e, d) {
  h("../lib/dom").importCssString(d);
  return{cssClass:"ace-tm"}
});