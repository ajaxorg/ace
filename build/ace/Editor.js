/*
 RequireJS text Copyright (c) 2010, The Dojo Foundation All Rights Reserved.
 Available via the MIT or new BSD license.
 see: http://github.com/jrburke/requirejs for details
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
*/
(function() {
  var k = ["Msxml2.XMLHTTP", "Microsoft.XMLHTTP", "Msxml2.XMLHTTP.4.0"], f = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im, a = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im;
  if(!require.textStrip) {
    require.textStrip = function(h) {
      if(h) {
        h = h.replace(f, "");
        var i = h.match(a);
        if(i) {
          h = i[1]
        }
      }else {
        h = ""
      }return h
    }
  }if(!require.getXhr) {
    require.getXhr = function() {
      var h, i, e;
      if(typeof XMLHttpRequest !== "undefined") {
        return new XMLHttpRequest
      }else {
        for(i = 0;i < 3;i++) {
          e = k[i];
          try {
            h = new ActiveXObject(e)
          }catch(j) {
          }if(h) {
            k = [e];
            break
          }
        }
      }if(!h) {
        throw new Error("require.getXhr(): XMLHttpRequest not available");
      }return h
    }
  }if(!require.fetchText) {
    require.fetchText = function(h, i) {
      var e = require.getXhr();
      e.open("GET", h, true);
      e.onreadystatechange = function() {
        e.readyState === 4 && i(e.responseText)
      };
      e.send(null)
    }
  }require.plugin({prefix:"text", require:function() {
  }, newContext:function(h) {
    require.mixin(h, {text:{}, textWaiting:[]})
  }, load:function(h, i) {
    var e = false, j = null, c, g = h.indexOf("."), l = h.substring(0, g), m = h.substring(g + 1, h.length), b = require.s.contexts[i], d = b.textWaiting;
    g = m.indexOf("!");
    if(g !== -1) {
      e = m.substring(g + 1, m.length);
      m = m.substring(0, g);
      g = e.indexOf("!");
      if(g !== -1 && e.substring(0, g) === "strip") {
        j = e.substring(g + 1, e.length);
        e = "strip"
      }else {
        if(e !== "strip") {
          j = e;
          e = null
        }
      }
    }c = l + "!" + m;
    g = e ? c + "!" + e : c;
    if(j !== null && !b.text[c]) {
      b.defined[h] = b.text[c] = j
    }else {
      if(!b.text[c] && !b.textWaiting[c] && !b.textWaiting[g]) {
        d[g] || (d[g] = d[d.push({name:h, key:c, fullKey:g, strip:!!e}) - 1]);
        i = require.nameToUrl(l, "." + m, i);
        b.loaded[h] = false;
        require.fetchText(i, function(n) {
          b.text[c] = n;
          b.loaded[h] = true
        })
      }
    }
  }, checkDeps:function() {
  }, isWaiting:function(h) {
    return!!h.textWaiting.length
  }, orderDeps:function(h) {
    var i, e, j, c = h.textWaiting;
    h.textWaiting = [];
    for(i = 0;e = c[i];i++) {
      j = h.text[e.key];
      h.defined[e.name] = e.strip ? require.textStrip(j) : j
    }
  }})
})();
if(!require.def) {
  require.def = require("requireJS-node")(module, require)
}require.def("ace/lib/oop", function() {
  var k = {};
  k.inherits = function(f, a) {
    var h = function() {
    };
    h.prototype = a.prototype;
    f.super_ = a.prototype;
    f.prototype = new h;
    f.prototype.constructor = f
  };
  k.mixin = function(f, a) {
    for(var h in a) {
      f[h] = a[h]
    }
  };
  k.implement = function(f, a) {
    k.mixin(f, a)
  };
  return k
});
if(!require.def) {
  require.def = require("requireJS-node")(module, require)
}require.def("ace/lib/core", function() {
  var k = {}, f = (navigator.platform.match(/mac|win|linux/i) || ["other"])[0].toLowerCase();
  k.isWin = f == "win";
  k.isMac = f == "mac";
  k.isLinux = f == "linux";
  k.isIE = !+"\u000b1";
  k.isGecko = window.controllers && window.navigator.product === "Gecko";
  k.provide = function(a) {
    a = a.split(".");
    for(var h = window, i = 0;i < a.length;i++) {
      var e = a[i];
      h[e] || (h[e] = {});
      h = h[e]
    }
  };
  return k
});
if(!require.def) {
  require.def = require("requireJS-node")(module, require)
}require.def("ace/lib/event", ["ace/lib/core"], function(k) {
  var f = {};
  f.addListener = function(a, h, i) {
    if(a.addEventListener) {
      return a.addEventListener(h, i, false)
    }if(a.attachEvent) {
      var e = function() {
        i(window.event)
      };
      i.$$wrapper = e;
      a.attachEvent("on" + h, e)
    }
  };
  f.removeListener = function(a, h, i) {
    if(a.removeEventListener) {
      return a.removeEventListener(h, i, false)
    }if(a.detachEvent) {
      a.detachEvent("on" + h, i.$$wrapper || i)
    }
  };
  f.stopEvent = function(a) {
    f.stopPropagation(a);
    f.preventDefault(a);
    return false
  };
  f.stopPropagation = function(a) {
    if(a.stopPropagation) {
      a.stopPropagation()
    }else {
      a.cancelBubble = true
    }
  };
  f.preventDefault = function(a) {
    if(a.preventDefault) {
      a.preventDefault()
    }else {
      a.returnValue = false
    }
  };
  f.getDocumentX = function(a) {
    return a.clientX ? a.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft) : a.pageX
  };
  f.getDocumentY = function(a) {
    return a.clientY ? a.clientY + (document.documentElement.scrollTop || document.body.scrollTop) : a.pageX
  };
  f.getButton = function(a) {
    return a.preventDefault ? a.button : Math.max(a.button - 1, 2)
  };
  f.capture = document.documentElement.setCapture ? function(a, h, i) {
    function e(j) {
      h && h(j);
      i && i();
      f.removeListener(a, "mousemove", h);
      f.removeListener(a, "mouseup", e);
      f.removeListener(a, "losecapture", e);
      a.releaseCapture()
    }
    f.addListener(a, "mousemove", h);
    f.addListener(a, "mouseup", e);
    f.addListener(a, "losecapture", e);
    a.setCapture()
  } : function(a, h, i) {
    function e(c) {
      h(c);
      c.stopPropagation()
    }
    function j(c) {
      h && h(c);
      i && i();
      document.removeEventListener("mousemove", e, true);
      document.removeEventListener("mouseup", j, true);
      c.stopPropagation()
    }
    document.addEventListener("mousemove", e, true);
    document.addEventListener("mouseup", j, true)
  };
  f.addMouseWheelListener = function(a, h) {
    var i = function(e) {
      if(e.wheelDelta !== undefined) {
        if(e.wheelDeltaX !== undefined) {
          e.wheelX = -e.wheelDeltaX / 8;
          e.wheelY = -e.wheelDeltaY / 8
        }else {
          e.wheelX = 0;
          e.wheelY = -e.wheelDelta / 8
        }
      }else {
        if(e.axis && e.axis == e.HORIZONTAL_AXIS) {
          e.wheelX = (e.detail || 0) * 5;
          e.wheelY = 0
        }else {
          e.wheelX = 0;
          e.wheelY = (e.detail || 0) * 5
        }
      }h(e)
    };
    f.addListener(a, "DOMMouseScroll", i);
    f.addListener(a, "mousewheel", i)
  };
  f.addMultiMouseDownListener = function(a, h, i, e, j) {
    var c = 0, g, l, m = function(b) {
      c += 1;
      if(c == 1) {
        g = b.clientX;
        l = b.clientY;
        setTimeout(function() {
          c = 0
        }, e || 600)
      }if(f.getButton(b) != h || Math.abs(b.clientX - g) > 5 || Math.abs(b.clientY - l) > 5) {
        c = 0
      }if(c == i) {
        c = 0;
        j(b)
      }return f.preventDefault(b)
    };
    f.addListener(a, "mousedown", m);
    k.isIE && f.addListener(a, "dblclick", m)
  };
  f.addKeyListener = function(a, h) {
    var i = null;
    f.addListener(a, "keydown", function(e) {
      i = e.keyIdentifier || e.keyCode;
      return h(e)
    });
    k.isMac && k.isGecko && f.addListener(a, "keypress", function(e) {
      if(i !== (e.keyIdentifier || e.keyCode)) {
        return h(e)
      }else {
        i = null
      }
    })
  };
  return f
});
if(!require.def) {
  require.def = require("requireJS-node")(module, require)
}require.def("ace/lib/lang", function() {
  var k = {};
  k.stringReverse = function(f) {
    return f.split("").reverse().join("")
  };
  k.stringRepeat = function(f, a) {
    return(new Array(a + 1)).join(f)
  };
  k.arrayIndexOf = Array.prototype.indexOf ? function(f, a) {
    return f.indexOf(a)
  } : function(f, a) {
    for(var h = 0;h < f.length;h++) {
      if(f[h] == a) {
        return h
      }
    }return-1
  };
  k.isArray = function(f) {
    return Object.prototype.toString.call(f) == "[object Array]"
  };
  k.copyObject = function(f) {
    var a = {};
    for(var h in f) {
      a[h] = f[h]
    }return a
  };
  k.arrayToMap = function(f) {
    for(var a = {}, h = 0;h < f.length;h++) {
      a[f[h]] = 1
    }return a
  };
  k.escapeRegExp = function(f) {
    return f.replace(/([.*+?^${}()|[\]\/\\])/g, "\\$1")
  };
  k.bind = function(f, a) {
    return function() {
      return f.apply(a, arguments)
    }
  };
  k.deferredCall = function(f) {
    var a = null, h = function() {
      a = null;
      f()
    };
    return{schedule:function() {
      a || (a = setTimeout(h, 0))
    }, call:function() {
      k.cancel();
      f()
    }, cancel:function() {
      clearTimeout(a);
      a = null
    }}
  };
  return k
});
require.def("ace/TextInput", ["ace/lib/event"], function(k) {
  return function(f, a) {
    function h() {
      if(!g) {
        var b = i.value;
        if(b) {
          if(b.charCodeAt(b.length - 1) == j.charCodeAt(0)) {
            (b = b.slice(0, -1)) && a.onTextInput(b)
          }else {
            a.onTextInput(b)
          }
        }
      }g = false;
      i.value = j;
      i.select()
    }
    var i = document.createElement("textarea"), e = i.style;
    e.position = "absolute";
    e.left = "-10000px";
    e.top = "-10000px";
    f.appendChild(i);
    var j = String.fromCharCode(0);
    h();
    var c = false, g = false, l = function() {
      setTimeout(function() {
        c || h()
      }, 0)
    }, m = function() {
      a.onCompositionUpdate(i.value)
    };
    k.addListener(i, "keypress", l);
    k.addListener(i, "textInput", l);
    k.addListener(i, "paste", l);
    k.addListener(i, "propertychange", l);
    k.addListener(i, "copy", function() {
      g = true;
      i.value = a.getCopyText();
      i.select();
      g = true;
      setTimeout(h, 0)
    });
    k.addListener(i, "cut", function() {
      g = true;
      i.value = a.getCopyText();
      a.onCut();
      i.select();
      setTimeout(h, 0)
    });
    k.addListener(i, "compositionstart", function() {
      c = true;
      h();
      i.value = "";
      a.onCompositionStart();
      setTimeout(m, 0)
    });
    k.addListener(i, "compositionupdate", m);
    k.addListener(i, "compositionend", function() {
      c = false;
      a.onCompositionEnd();
      l()
    });
    k.addListener(i, "blur", function() {
      a.onBlur()
    });
    k.addListener(i, "focus", function() {
      a.onFocus();
      i.select()
    });
    this.focus = function() {
      a.onFocus();
      i.select();
      i.focus()
    };
    this.blur = function() {
      i.blur()
    }
  }
});
require.def("ace/conf/keybindings/default_mac", function() {
  return{selectall:"Command-A", removeline:"Command-D", gotoline:"Command-L", togglecomment:"Command-7", findnext:"Command-K", findprevious:"Command-Shift-K", find:"Command-F", replace:"Command-R", undo:"Command-Z", redo:"Command-Shift-Z|Command-Y", overwrite:"Insert", copylinesup:"Command-Option-Up", movelinesup:"Option-Up", selecttostart:"Command-Shift-Up", gotostart:"Command-Home|Command-Up", selectup:"Shift-Up", golineup:"Up", copylinesdown:"Command-Option-Down", movelinesdown:"Option-Down", 
  selecttoend:"Command-Shift-Down", gotoend:"Command-End|Command-Down", selectdown:"Shift-Down", godown:"Down", selectwordleft:"Option-Shift-Left", gotowordleft:"Option-Left", selecttolinestart:"Command-Shift-Left", gotolinestart:"Command-Left|Home", selectleft:"Shift-Left", gotoleft:"Left", selectwordright:"Option-Shift-Right", gotowordright:"Option-Right", selecttolineend:"Command-Shift-Right", gotolineend:"Command-Right|End", selectright:"Shift-Right", gotoright:"Right", selectpagedown:"Shift-PageDown", 
  pagedown:"PageDown", selectpageup:"Shift-PageUp", pageup:"PageUp", selectlinestart:"Shift-Home", selectlineend:"Shift-End", del:"Delete", backspace:"Backspace", outdent:"Shift-Tab", indent:"Tab"}
});
require.def("ace/conf/keybindings/default_win", function() {
  return{selectall:"Ctrl-A", removeline:"Ctrl-D", gotoline:"Ctrl-L", togglecomment:"Ctrl-7", findnext:"Ctrl-K", findprevious:"Ctrl-Shift-K", find:"Ctrl-F", replace:"Ctrl-R", undo:"Ctrl-Z", redo:"Ctrl-Shift-Z|Ctrl-Y", overwrite:"Insert", copylinesup:"Ctrl-Alt-Up", movelinesup:"Alt-Up", selecttostart:"Ctrl-Shift-Up", gotostart:"Ctrl-Home|Ctrl-Up", selectup:"Shift-Up", golineup:"Up", copylinesdown:"Ctrl-Alt-Down", movelinesdown:"Alt-Down", selecttoend:"Ctrl-Shift-Down", gotoend:"Ctrl-End|Ctrl-Down", 
  selectdown:"Shift-Down", godown:"Down", selectwordleft:"Alt-Shift-Left", gotowordleft:"Alt-Left", selecttolinestart:"Ctrl-Shift-Left", gotolinestart:"Ctrl-Left|Home", selectleft:"Shift-Left", gotoleft:"Left", selectwordright:"Alt-Shift-Right", gotowordright:"Alt-Right", selecttolineend:"Ctrl-Shift-Right", gotolineend:"Ctrl-Right|End", selectright:"Shift-Right", gotoright:"Right", selectpagedown:"Shift-PageDown", pagedown:"PageDown", selectpageup:"Shift-PageUp", pageup:"PageUp", selectlinestart:"Shift-Home", 
  selectlineend:"Shift-End", del:"Delete", backspace:"Backspace", outdent:"Shift-Tab", indent:"Tab"}
});
require.def("ace/PluginManager", [], function() {
  return{commands:{}, registerCommand:function(k, f) {
    this.commands[k] = f
  }}
});
require.def("ace/commands/DefaultCommands", ["ace/PluginManager"], function(k) {
  k.registerCommand("selectall", function(f, a) {
    a.selectAll()
  });
  k.registerCommand("removeline", function(f) {
    f.removeLines()
  });
  k.registerCommand("gotoline", function(f) {
    var a = parseInt(prompt("Enter line number:"));
    isNaN(a) || f.gotoLine(a)
  });
  k.registerCommand("togglecomment", function(f) {
    f.toggleCommentLines()
  });
  k.registerCommand("findnext", function(f) {
    f.findNext()
  });
  k.registerCommand("findprevious", function(f) {
    f.findPrevious()
  });
  k.registerCommand("find", function(f) {
    var a = prompt("Find:");
    f.find(a)
  });
  k.registerCommand("undo", function(f) {
    f.undo()
  });
  k.registerCommand("redo", function(f) {
    f.redo()
  });
  k.registerCommand("redo", function(f) {
    f.redo()
  });
  k.registerCommand("overwrite", function(f) {
    f.toggleOverwrite()
  });
  k.registerCommand("copylinesup", function(f) {
    f.copyLinesUp()
  });
  k.registerCommand("movelinesup", function(f) {
    f.moveLinesUp()
  });
  k.registerCommand("selecttostart", function(f, a) {
    a.selectFileStart()
  });
  k.registerCommand("gotostart", function(f) {
    f.navigateFileStart()
  });
  k.registerCommand("selectup", function(f, a) {
    a.selectUp()
  });
  k.registerCommand("golineup", function(f) {
    f.navigateUp()
  });
  k.registerCommand("copylinesdown", function(f) {
    f.copyLinesDown()
  });
  k.registerCommand("movelinesdown", function(f) {
    f.moveLinesDown()
  });
  k.registerCommand("selecttoend", function(f, a) {
    a.selectFileEnd()
  });
  k.registerCommand("gotoend", function(f) {
    f.navigateFileEnd()
  });
  k.registerCommand("selectdown", function(f, a) {
    a.selectDown()
  });
  k.registerCommand("godown", function(f) {
    f.navigateDown()
  });
  k.registerCommand("selectwordleft", function(f, a) {
    a.selectWordLeft()
  });
  k.registerCommand("gotowordleft", function(f) {
    f.navigateWordLeft()
  });
  k.registerCommand("selecttolinestart", function(f, a) {
    a.selectLineStart()
  });
  k.registerCommand("gotolinestart", function(f) {
    f.navigateLineStart()
  });
  k.registerCommand("selectleft", function(f, a) {
    a.selectLeft()
  });
  k.registerCommand("gotoleft", function(f) {
    f.navigateLeft()
  });
  k.registerCommand("selectwordright", function(f, a) {
    a.selectWordRight()
  });
  k.registerCommand("gotowordright", function(f) {
    f.navigateWordRight()
  });
  k.registerCommand("selecttolineend", function(f, a) {
    a.selectLineEnd()
  });
  k.registerCommand("gotolineend", function(f) {
    f.navigateLineEnd()
  });
  k.registerCommand("selectright", function(f, a) {
    a.selectRight()
  });
  k.registerCommand("gotoright", function(f) {
    f.navigateRight()
  });
  k.registerCommand("selectpagedown", function(f) {
    f.selectPageDown()
  });
  k.registerCommand("pagedown", function(f) {
    f.scrollPageDown()
  });
  k.registerCommand("gotopagedown", function(f) {
    f.gotoPageDown()
  });
  k.registerCommand("selectpageup", function(f) {
    f.selectPageUp()
  });
  k.registerCommand("pageup", function(f) {
    f.scrollPageUp()
  });
  k.registerCommand("gotopageup", function(f) {
    f.gotoPageUp()
  });
  k.registerCommand("selectlinestart", function(f, a) {
    a.selectLineStart()
  });
  k.registerCommand("gotolinestart", function(f) {
    f.navigateLineStart()
  });
  k.registerCommand("selectlineend", function(f, a) {
    a.selectLineEnd()
  });
  k.registerCommand("gotolineend", function(f) {
    f.navigateLineEnd()
  });
  k.registerCommand("del", function(f) {
    f.removeRight()
  });
  k.registerCommand("backspace", function(f) {
    f.removeLeft()
  });
  k.registerCommand("outdent", function(f) {
    f.blockOutdent()
  });
  k.registerCommand("indent", function(f) {
    f.indent()
  })
});
require.def("ace/KeyBinding", ["ace/lib/core", "ace/lib/event", "ace/conf/keybindings/default_mac", "ace/conf/keybindings/default_win", "ace/PluginManager", "ace/commands/DefaultCommands"], function(k, f, a, h, i) {
  var e = function(j, c, g) {
    this.setConfig(g);
    var l = this;
    f.addKeyListener(j, function(m) {
      var b = (l.config.reverse[0 | (m.ctrlKey ? 1 : 0) | (m.altKey ? 2 : 0) | (m.shiftKey ? 4 : 0) | (m.metaKey ? 8 : 0)] || {})[(l.keyNames[m.keyCode] || String.fromCharCode(m.keyCode)).toLowerCase()];
      if(b = i.commands[b]) {
        b(c, c.getSelection());
        return f.stopEvent(m)
      }
    })
  };
  (function() {
    function j(l, m, b, d) {
      return(d && l.toLowerCase() || l).replace(/(?:^\s+|\n|\s+$)/g, "").split(new RegExp("[\\s ]*" + m + "[\\s ]*", "g"), b || 999)
    }
    function c(l, m, b) {
      var d, n = 0;
      l = j(l, "\\-", null, true);
      for(var o = 0, p = l.length;o < p;++o) {
        if(this.keyMods[l[o]]) {
          n |= this.keyMods[l[o]]
        }else {
          d = l[o] || "-"
        }
      }(b[n] || (b[n] = {}))[d] = m;
      return b
    }
    function g(l, m) {
      var b, d, n, o, p = {};
      for(b in l) {
        o = l[b];
        if(m && typeof o == "string") {
          o = o.split(m);
          d = 0;
          for(n = o.length;d < n;++d) {
            c.call(this, o[d], b, p)
          }
        }else {
          c.call(this, o, b, p)
        }
      }return p
    }
    this.keyMods = {ctrl:1, alt:2, option:2, shift:4, meta:8, command:8};
    this.keyNames = {"8":"Backspace", "9":"Tab", "13":"Enter", "27":"Esc", "32":"Space", "33":"PageUp", "34":"PageDown", "35":"End", "36":"Home", "37":"Left", "38":"Up", "39":"Right", "40":"Down", "45":"Insert", "46":"Delete", "107":"+", "112":"F1", "113":"F2", "114":"F3", "115":"F4", "116":"F5", "117":"F6", "118":"F7", "119":"F8", "120":"F9", "121":"F10", "122":"F11", "123":"F12"};
    this.setConfig = function(l) {
      this.config = l || (k.isMac ? a : h);
      if(typeof this.config.reverse == "undefined") {
        this.config.reverse = g.call(this, this.config, "|")
      }
    }
  }).call(e.prototype);
  return e
});
if(!require.def) {
  require.def = require("requireJS-node")(module, require)
}require.def("ace/MEventEmitter", ["ace/lib/lang"], function(k) {
  var f = {};
  f.$dispatchEvent = function(a, h) {
    this.$eventRegistry = this.$eventRegistry || {};
    var i = this.$eventRegistry[a];
    if(i && i.length) {
      h = h || {};
      h.type = a;
      for(a = 0;a < i.length;a++) {
        i[a](h)
      }
    }
  };
  f.on = f.addEventListener = function(a, h) {
    this.$eventRegistry = this.$eventRegistry || {};
    var i = this.$eventRegistry[a];
    i || (i = this.$eventRegistry[a] = []);
    k.arrayIndexOf(i, h) == -1 && i.push(h)
  };
  f.removeEventListener = function(a, h) {
    this.$eventRegistry = this.$eventRegistry || {};
    if(a = this.$eventRegistry[a]) {
      h = k.arrayIndexOf(a, h);
      h !== -1 && a.splice(h, 1)
    }
  };
  return f
});
require.def("ace/Range", function() {
  var k = function(f, a, h, i) {
    this.start = {row:f, column:a};
    this.end = {row:h, column:i}
  };
  (function() {
    this.toString = function() {
      return"Range: [" + this.start.row + "/" + this.start.column + "] -> [" + this.end.row + "/" + this.end.column + "]"
    };
    this.contains = function(f, a) {
      return this.compare(f, a) == 0
    };
    this.compare = function(f, a) {
      if(!this.isMultiLine()) {
        if(f === this.start.row) {
          return a < this.start.column ? -1 : a > this.end.column ? 1 : 0
        }
      }if(f < this.start.row) {
        return-1
      }if(f > this.end.row) {
        return 1
      }if(this.start.row === f) {
        return a >= this.start.column ? 0 : -1
      }if(this.end.row === f) {
        return a <= this.end.column ? 0 : 1
      }return 0
    };
    this.clipRows = function(f, a) {
      if(this.end.row > a) {
        var h = {row:a + 1, column:0}
      }if(this.start.row > a) {
        var i = {row:a + 1, column:0}
      }if(this.start.row < f) {
        i = {row:f, column:0}
      }if(this.end.row < f) {
        h = {row:f, column:0}
      }return k.fromPoints(i || this.start, h || this.end)
    };
    this.extend = function(f, a) {
      var h = this.compare(f, a);
      if(h == 0) {
        return this
      }else {
        if(h == -1) {
          var i = {row:f, column:a}
        }else {
          var e = {row:f, column:a}
        }
      }return k.fromPoints(i || this.start, e || this.end)
    };
    this.isEmpty = function() {
      return this.start.row == this.end.row && this.start.column == this.end.column
    };
    this.isMultiLine = function() {
      return this.start.row !== this.end.row
    };
    this.clone = function() {
      return k.fromPoints(this.start, this.end)
    };
    this.toScreenRange = function(f) {
      return new k(this.start.row, f.documentToScreenColumn(this.start.row, this.start.column), this.end.row, f.documentToScreenColumn(this.end.row, this.end.column))
    }
  }).call(k.prototype);
  k.fromPoints = function(f, a) {
    return new k(f.row, f.column, a.row, a.column)
  };
  return k
});
require.def("ace/Selection", ["ace/lib/oop", "ace/lib/lang", "ace/MEventEmitter", "ace/Range"], function(k, f, a, h) {
  var i = function(e) {
    this.doc = e;
    this.clearSelection();
    this.selectionLead = {row:0, column:0}
  };
  (function() {
    k.implement(this, a);
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
    this.setSelectionAnchor = function(e, j) {
      e = this.$clipPositionToDocument(e, j);
      if(this.selectionAnchor) {
        if(this.selectionAnchor.row !== e.row || this.selectionAnchor.column !== e.column) {
          this.selectionAnchor = e;
          this.$dispatchEvent("changeSelection", {})
        }
      }else {
        this.selectionAnchor = e;
        this.$dispatchEvent("changeSelection", {})
      }
    };
    this.getSelectionAnchor = function() {
      return this.selectionAnchor ? this.$clone(this.selectionAnchor) : this.$clone(this.selectionLead)
    };
    this.getSelectionLead = function() {
      return this.$clone(this.selectionLead)
    };
    this.shiftSelection = function(e) {
      if(this.isEmpty()) {
        this.moveCursorTo(this.selectionLead.row, this.selectionLead.column + e)
      }else {
        var j = this.getSelectionAnchor(), c = this.getSelectionLead(), g = this.isBackwards();
        if(!g || j.column !== 0) {
          this.setSelectionAnchor(j.row, j.column + e)
        }if(g || c.column !== 0) {
          this.$moveSelection(function() {
            this.moveCursorTo(c.row, c.column + e)
          })
        }
      }
    };
    this.isBackwards = function() {
      var e = this.selectionAnchor || this.selectionLead, j = this.selectionLead;
      return e.row > j.row || e.row == j.row && e.column > j.column
    };
    this.getRange = function() {
      var e = this.selectionAnchor || this.selectionLead, j = this.selectionLead;
      return this.isBackwards() ? h.fromPoints(j, e) : h.fromPoints(e, j)
    };
    this.clearSelection = function() {
      if(this.selectionAnchor) {
        this.selectionAnchor = null;
        this.$dispatchEvent("changeSelection", {})
      }
    };
    this.selectAll = function() {
      var e = this.doc.getLength() - 1;
      this.setSelectionAnchor(e, this.doc.getLine(e).length);
      this.$moveSelection(function() {
        this.moveCursorTo(0, 0)
      })
    };
    this.setSelectionRange = function(e, j) {
      if(j) {
        this.setSelectionAnchor(e.end.row, e.end.column);
        this.selectTo(e.start.row, e.start.column)
      }else {
        this.setSelectionAnchor(e.start.row, e.start.column);
        this.selectTo(e.end.row, e.end.column)
      }
    };
    this.$moveSelection = function(e) {
      var j = false;
      if(!this.selectionAnchor) {
        j = true;
        this.selectionAnchor = this.$clone(this.selectionLead)
      }var c = this.$clone(this.selectionLead);
      e.call(this);
      if(c.row !== this.selectionLead.row || c.column !== this.selectionLead.column) {
        j = true
      }j && this.$dispatchEvent("changeSelection", {})
    };
    this.selectTo = function(e, j) {
      this.$moveSelection(function() {
        this.moveCursorTo(e, j)
      })
    };
    this.selectToPosition = function(e) {
      this.$moveSelection(function() {
        this.moveCursorToPosition(e)
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
      var e = this.selectionLead;
      this.setSelectionRange(this.doc.getWordRange(e.row, e.column))
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
      var e = this.selectionLead.row, j = this.selectionLead.column, c = this.doc.getLine(e).slice(0, j).match(/^\s*/);
      if(c[0].length == 0) {
        this.moveCursorTo(e, this.doc.getLine(e).match(/^\s*/)[0].length)
      }else {
        c[0].length >= j ? this.moveCursorTo(e, 0) : this.moveCursorTo(e, c[0].length)
      }
    };
    this.moveCursorLineEnd = function() {
      this.moveCursorTo(this.selectionLead.row, this.doc.getLine(this.selectionLead.row).length)
    };
    this.moveCursorFileEnd = function() {
      var e = this.doc.getLength() - 1, j = this.doc.getLine(e).length;
      this.moveCursorTo(e, j)
    };
    this.moveCursorFileStart = function() {
      this.moveCursorTo(0, 0)
    };
    this.moveCursorWordRight = function() {
      var e = this.selectionLead.row, j = this.selectionLead.column, c = this.doc.getLine(e), g = c.substring(j);
      this.doc.nonTokenRe.lastIndex = 0;
      this.doc.tokenRe.lastIndex = 0;
      if(j == c.length) {
        this.moveCursorRight()
      }else {
        if(this.doc.nonTokenRe.exec(g)) {
          j += this.doc.nonTokenRe.lastIndex;
          this.doc.nonTokenRe.lastIndex = 0
        }else {
          if(this.doc.tokenRe.exec(g)) {
            j += this.doc.tokenRe.lastIndex;
            this.doc.tokenRe.lastIndex = 0
          }
        }this.moveCursorTo(e, j)
      }
    };
    this.moveCursorWordLeft = function() {
      var e = this.selectionLead.row, j = this.selectionLead.column, c = this.doc.getLine(e);
      c = f.stringReverse(c.substring(0, j));
      this.doc.nonTokenRe.lastIndex = 0;
      this.doc.tokenRe.lastIndex = 0;
      if(j == 0) {
        this.moveCursorLeft()
      }else {
        if(this.doc.nonTokenRe.exec(c)) {
          j -= this.doc.nonTokenRe.lastIndex;
          this.doc.nonTokenRe.lastIndex = 0
        }else {
          if(this.doc.tokenRe.exec(c)) {
            j -= this.doc.tokenRe.lastIndex;
            this.doc.tokenRe.lastIndex = 0
          }
        }this.moveCursorTo(e, j)
      }
    };
    this.moveCursorBy = function(e, j) {
      this.moveCursorTo(this.selectionLead.row + e, this.selectionLead.column + j)
    };
    this.moveCursorToPosition = function(e) {
      this.moveCursorTo(e.row, e.column)
    };
    this.moveCursorTo = function(e, j) {
      e = this.$clipPositionToDocument(e, j);
      if(e.row !== this.selectionLead.row || e.column !== this.selectionLead.column) {
        this.selectionLead = e;
        this.$dispatchEvent("changeCursor", {data:this.getCursor()})
      }
    };
    this.moveCursorUp = function() {
      this.moveCursorBy(-1, 0)
    };
    this.$clipPositionToDocument = function(e, j) {
      var c = {};
      if(e >= this.doc.getLength()) {
        c.row = Math.max(0, this.doc.getLength() - 1);
        c.column = this.doc.getLine(c.row).length
      }else {
        if(e < 0) {
          c.row = 0;
          c.column = 0
        }else {
          c.row = e;
          c.column = Math.min(this.doc.getLine(c.row).length, Math.max(0, j))
        }
      }return c
    };
    this.$clone = function(e) {
      return{row:e.row, column:e.column}
    }
  }).call(i.prototype);
  return i
});
require.def("ace/Tokenizer", [], function() {
  var k = function(f) {
    this.rules = f;
    this.regExps = {};
    for(var a in this.rules) {
      f = this.rules[a];
      for(var h = [], i = 0;i < f.length;i++) {
        h.push(f[i].regex)
      }this.regExps[a] = new RegExp("(?:(" + h.join(")|(") + ")|(.))", "g")
    }
  };
  (function() {
    this.getLineTokens = function(f, a) {
      a = a;
      var h = this.rules[a], i = this.regExps[a];
      i.lastIndex = 0;
      for(var e, j = [], c = 0, g = {type:null, value:""};e = i.exec(f);) {
        var l = "text", m = e[0];
        if(i.lastIndex == c) {
          throw new Error("tokenizer error");
        }c = i.lastIndex;
        window.LOG && console.log(a, e);
        for(var b = 0;b < h.length;b++) {
          if(e[b + 1]) {
            l = typeof h[b].token == "function" ? h[b].token(e[0]) : h[b].token;
            if(h[b].next && h[b].next !== a) {
              a = h[b].next;
              h = this.rules[a];
              c = i.lastIndex;
              i = this.regExps[a];
              i.lastIndex = c
            }break
          }
        }if(g.type !== l) {
          g.type && j.push(g);
          g = {type:l, value:m}
        }else {
          g.value += m
        }
      }g.type && j.push(g);
      window.LOG && console.log(j, a);
      return{tokens:j, state:a}
    }
  }).call(k.prototype);
  return k
});
require.def("ace/mode/TextHighlightRules", [], function() {
  var k = function() {
    this.$rules = {start:[{token:"text", regex:".+"}]}
  };
  (function() {
    this.addRules = function(f, a) {
      for(var h in f) {
        for(var i = f[h], e = 0;e < i.length;e++) {
          var j = i[e];
          j.next = j.next ? a + j.next : a + h
        }this.$rules[a + h] = i
      }
    };
    this.getRules = function() {
      return this.$rules
    }
  }).call(k.prototype);
  return k
});
require.def("ace/mode/Text", ["ace/Tokenizer", "ace/mode/TextHighlightRules"], function(k, f) {
  var a = function() {
    this.$tokenizer = new k((new f).getRules())
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
    this.$getIndent = function(h) {
      if(h = h.match(/^(\s+)/)) {
        return h[1]
      }return""
    }
  }).call(a.prototype);
  return a
});
require.def("ace/Document", ["ace/lib/oop", "ace/lib/lang", "ace/MEventEmitter", "ace/Selection", "ace/mode/Text", "ace/Range"], function(k, f, a, h, i, e) {
  var j = function(c, g) {
    this.modified = true;
    this.lines = [];
    this.selection = new h(this);
    this.$breakpoints = [];
    this.listeners = [];
    g && this.setMode(g);
    f.isArray(c) ? this.$insertLines(0, c) : this.$insert({row:0, column:0}, c)
  };
  (function() {
    k.implement(this, a);
    this.$undoManager = null;
    this.$split = function(c) {
      return c.split(/\r\n|\r|\n/)
    };
    this.setValue = function(c) {
      var g = [0, this.lines.length];
      g.push.apply(g, this.$split(c));
      this.lines.splice.apply(this.lines, g);
      this.modified = true;
      this.fireChangeEvent(0)
    };
    this.toString = function() {
      return this.lines.join(this.$getNewLineCharacter())
    };
    this.getSelection = function() {
      return this.selection
    };
    this.fireChangeEvent = function(c, g) {
      this.$dispatchEvent("change", {data:{firstRow:c, lastRow:g}})
    };
    this.setUndoManager = function(c) {
      this.$undoManager = c;
      this.$deltas = [];
      this.$informUndoManager && this.$informUndoManager.cancel();
      if(c) {
        var g = this;
        this.$informUndoManager = f.deferredCall(function() {
          g.$deltas.length > 0 && c.execute({action:"aceupdate", args:[g.$deltas, g]});
          g.$deltas = []
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
      return this.getUseSoftTabs() ? f.stringRepeat(" ", this.getTabSize()) : "\t"
    };
    this.$useSoftTabs = true;
    this.setUseSoftTabs = function(c) {
      if(this.$useSoftTabs !== c) {
        this.$useSoftTabs = c
      }
    };
    this.getUseSoftTabs = function() {
      return this.$useSoftTabs
    };
    this.$tabSize = 4;
    this.setTabSize = function(c) {
      if(!(isNaN(c) || this.$tabSize === c)) {
        this.modified = true;
        this.$tabSize = c;
        this.$dispatchEvent("changeTabSize")
      }
    };
    this.getTabSize = function() {
      return this.$tabSize
    };
    this.getBreakpoints = function() {
      return this.$breakpoints
    };
    this.setBreakpoints = function(c) {
      this.$breakpoints = [];
      for(var g = 0;g < c.length;g++) {
        this.$breakpoints[c[g]] = true
      }this.$dispatchEvent("changeBreakpoint", {})
    };
    this.clearBreakpoints = function() {
      this.$breakpoints = [];
      this.$dispatchEvent("changeBreakpoint", {})
    };
    this.setBreakpoint = function(c) {
      this.$breakpoints[c] = true;
      this.$dispatchEvent("changeBreakpoint", {})
    };
    this.clearBreakpoint = function(c) {
      delete this.$breakpoints[c];
      this.$dispatchEvent("changeBreakpoint", {})
    };
    this.$detectNewLine = function(c) {
      this.$autoNewLine = (c = c.match(/^.*?(\r?\n)/m)) ? c[1] : "\n"
    };
    this.tokenRe = /^[\w\d]+/g;
    this.nonTokenRe = /^[^\w\d]+/g;
    this.getWordRange = function(c, g) {
      var l = this.getLine(c), m = false;
      if(g > 0) {
        m = !!l.charAt(g - 1).match(this.tokenRe)
      }m || (m = !!l.charAt(g).match(this.tokenRe));
      m = m ? this.tokenRe : this.nonTokenRe;
      var b = g;
      if(b > 0) {
        do {
          b--
        }while(b >= 0 && l.charAt(b).match(m));
        b++
      }for(g = g;g < l.length && l.charAt(g).match(m);) {
        g++
      }return new e(c, b, c, g)
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
    this.setNewLineMode = function(c) {
      if(this.$newLineMode !== c) {
        this.$newLineMode = c
      }
    };
    this.getNewLineMode = function() {
      return this.$newLineMode
    };
    this.$mode = null;
    this.setMode = function(c) {
      if(this.$mode !== c) {
        this.$mode = c;
        this.$dispatchEvent("changeMode")
      }
    };
    this.getMode = function() {
      if(!this.$mode) {
        this.$mode = new i
      }return this.$mode
    };
    this.$scrollTop = 0;
    this.setScrollTopRow = function(c) {
      if(this.$scrollTop !== c) {
        this.$scrollTop = c;
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
        for(var c = this.lines, g = 0, l = 0, m = this.getTabSize(), b = 0;b < c.length;b++) {
          var d = c[b].length;
          g = Math.max(g, d);
          c[b].replace("\t", function(n) {
            d += m - 1;
            return n
          });
          l = Math.max(l, d)
        }this.width = g;
        this.screenWith = l
      }
    };
    this.getLine = function(c) {
      return this.lines[c] || ""
    };
    this.getDisplayLine = function(c) {
      var g = (new Array(this.getTabSize() + 1)).join(" ");
      return this.lines[c].replace(/\t/g, g)
    };
    this.getLines = function(c, g) {
      return this.lines.slice(c, g + 1)
    };
    this.getLength = function() {
      return this.lines.length
    };
    this.getTextRange = function(c) {
      if(c.start.row == c.end.row) {
        return this.lines[c.start.row].substring(c.start.column, c.end.column)
      }else {
        var g = [];
        g.push(this.lines[c.start.row].substring(c.start.column));
        g.push.apply(g, this.getLines(c.start.row + 1, c.end.row - 1));
        g.push(this.lines[c.end.row].substring(0, c.end.column));
        return g.join(this.$getNewLineCharacter())
      }
    };
    this.findMatchingBracket = function(c) {
      if(c.column == 0) {
        return null
      }var g = this.getLine(c.row).charAt(c.column - 1);
      if(g == "") {
        return null
      }g = g.match(/([\(\[\{])|([\)\]\}])/);
      if(!g) {
        return null
      }return g[1] ? this.$findClosingBracket(g[1], c) : this.$findOpeningBracket(g[2], c)
    };
    this.$brackets = {")":"(", "(":")", "]":"[", "[":"]", "{":"}", "}":"{"};
    this.$findOpeningBracket = function(c, g) {
      var l = this.$brackets[c], m = g.column - 2;
      g = g.row;
      for(var b = 1, d = this.getLine(g);;) {
        for(;m >= 0;) {
          var n = d.charAt(m);
          if(n == l) {
            b -= 1;
            if(b == 0) {
              return{row:g, column:m}
            }
          }else {
            if(n == c) {
              b += 1
            }
          }m -= 1
        }g -= 1;
        if(g < 0) {
          break
        }d = this.getLine(g);
        m = d.length - 1
      }return null
    };
    this.$findClosingBracket = function(c, g) {
      var l = this.$brackets[c], m = g.column;
      g = g.row;
      for(var b = 1, d = this.getLine(g), n = this.getLength();;) {
        for(;m < d.length;) {
          var o = d.charAt(m);
          if(o == l) {
            b -= 1;
            if(b == 0) {
              return{row:g, column:m}
            }
          }else {
            if(o == c) {
              b += 1
            }
          }m += 1
        }g += 1;
        if(g >= n) {
          break
        }d = this.getLine(g);
        m = 0
      }return null
    };
    this.insert = function(c, g, l) {
      g = this.$insert(c, g, l);
      this.fireChangeEvent(c.row, c.row == g.row ? c.row : undefined);
      return g
    };
    this.$insertLines = function(c, g, l) {
      if(g.length != 0) {
        var m = [c, 0];
        m.push.apply(m, g);
        this.lines.splice.apply(this.lines, m);
        if(!l && this.$undoManager) {
          l = this.$getNewLineCharacter();
          this.$deltas.push({action:"insertText", range:new e(c, 0, c + g.length, 0), text:g.join(l) + l});
          this.$informUndoManager.schedule()
        }
      }
    };
    this.$insert = function(c, g, l) {
      if(g.length == 0) {
        return c
      }this.modified = true;
      this.lines.length <= 1 && this.$detectNewLine(g);
      var m = this.$split(g);
      if(this.$isNewLine(g)) {
        var b = this.lines[c.row] || "";
        this.lines[c.row] = b.substring(0, c.column);
        this.lines.splice(c.row + 1, 0, b.substring(c.column));
        m = {row:c.row + 1, column:0}
      }else {
        if(m.length == 1) {
          b = this.lines[c.row] || "";
          this.lines[c.row] = b.substring(0, c.column) + g + b.substring(c.column);
          m = {row:c.row, column:c.column + g.length}
        }else {
          b = this.lines[c.row] || "";
          var d = b.substring(0, c.column) + m[0];
          b = m[m.length - 1] + b.substring(c.column);
          this.lines[c.row] = d;
          this.$insertLines(c.row + 1, [b], true);
          m.length > 2 && this.$insertLines(c.row + 1, m.slice(1, -1), true);
          m = {row:c.row + m.length - 1, column:m[m.length - 1].length}
        }
      }if(!l && this.$undoManager) {
        this.$deltas.push({action:"insertText", range:e.fromPoints(c, m), text:g});
        this.$informUndoManager.schedule()
      }return m
    };
    this.$isNewLine = function(c) {
      return c == "\r\n" || c == "\r" || c == "\n"
    };
    this.remove = function(c, g) {
      if(c.isEmpty()) {
        return c.start
      }this.$remove(c, g);
      this.fireChangeEvent(c.start.row, c.isMultiLine() ? undefined : c.start.row);
      return c.start
    };
    this.$remove = function(c, g) {
      if(!c.isEmpty()) {
        if(!g && this.$undoManager) {
          this.$getNewLineCharacter();
          this.$deltas.push({action:"removeText", range:c.clone(), text:this.getTextRange(c)});
          this.$informUndoManager.schedule()
        }this.modified = true;
        g = c.start.row;
        var l = c.end.row, m = this.getLine(g).substring(0, c.start.column) + this.getLine(l).substring(c.end.column);
        this.lines.splice(g, l - g + 1, m);
        return c.start
      }
    };
    this.undoChanges = function(c) {
      this.selection.clearSelection();
      for(var g = c.length - 1;g >= 0;g--) {
        var l = c[g];
        if(l.action == "insertText") {
          this.remove(l.range, true);
          this.selection.moveCursorToPosition(l.range.start)
        }else {
          this.insert(l.range.start, l.text, true);
          this.selection.clearSelection()
        }
      }
    };
    this.redoChanges = function(c) {
      this.selection.clearSelection();
      for(var g = 0;g < c.length;g++) {
        var l = c[g];
        if(l.action == "insertText") {
          this.insert(l.range.start, l.text, true);
          this.selection.setSelectionRange(l.range)
        }else {
          this.remove(l.range, true);
          this.selection.moveCursorToPosition(l.range.start)
        }
      }
    };
    this.replace = function(c, g) {
      this.$remove(c);
      g = g ? this.$insert(c.start, g) : c.start;
      var l = c.end.column == 0 ? c.end.column - 1 : c.end.column;
      this.fireChangeEvent(c.start.row, l == g.row ? l : undefined);
      return g
    };
    this.indentRows = function(c, g) {
      g.replace("\t", this.getTabString());
      for(var l = c.start.row;l <= c.end.row;l++) {
        this.$insert({row:l, column:0}, g)
      }this.fireChangeEvent(c.start.row, c.end.row);
      return g.length
    };
    this.outdentRows = function(c) {
      for(var g = new e(0, 0, 0, 0), l = this.getTabSize(), m = c.start.row;m <= c.end.row;++m) {
        var b = this.getLine(m);
        g.start.row = m;
        g.end.row = m;
        for(var d = 0;d < l;++d) {
          if(b.charAt(d) != " ") {
            break
          }
        }if(d < l && b.charAt(d) == "\t") {
          g.start.column = d;
          g.end.column = d + 1
        }else {
          g.start.column = 0;
          g.end.column = d
        }if(m == c.start.row) {
          c.start.column -= g.end.column - g.start.column
        }if(m == c.end.row) {
          c.end.column -= g.end.column - g.start.column
        }this.$remove(g)
      }this.fireChangeEvent(c.start.row, c.end.row);
      return c
    };
    this.moveLinesUp = function(c, g) {
      if(c <= 0) {
        return 0
      }var l = this.lines.slice(c, g + 1);
      this.$remove(new e(c, 0, g + 1, 0));
      this.$insertLines(c - 1, l);
      this.fireChangeEvent(c - 1, g);
      return-1
    };
    this.moveLinesDown = function(c, g) {
      if(g >= this.lines.length - 1) {
        return 0
      }var l = this.lines.slice(c, g + 1);
      this.$remove(new e(c, 0, g + 1, 0));
      this.$insertLines(c + 1, l);
      this.fireChangeEvent(c, g + 1);
      return 1
    };
    this.duplicateLines = function(c, g) {
      c = this.$clipRowToDocument(c);
      g = this.$clipRowToDocument(g);
      var l = this.getLines(c, g);
      this.$insertLines(c, l);
      g = g - c + 1;
      this.fireChangeEvent(c);
      return g
    };
    this.$clipRowToDocument = function(c) {
      return Math.max(0, Math.min(c, this.lines.length - 1))
    };
    this.documentToScreenColumn = function(c, g) {
      var l = this.getTabSize(), m = 0;
      g = g;
      c = this.getLine(c).split("\t");
      for(var b = 0;b < c.length;b++) {
        var d = c[b].length;
        if(g > d) {
          g -= d + 1;
          m += d + l
        }else {
          m += g;
          break
        }
      }return m
    };
    this.screenToDocumentColumn = function(c, g) {
      var l = this.getTabSize(), m = 0;
      g = g;
      c = this.getLine(c).split("\t");
      for(var b = 0;b < c.length;b++) {
        var d = c[b].length;
        if(g >= d + l) {
          g -= d + l;
          m += d + 1
        }else {
          m += g > d ? d : g;
          break
        }
      }return m
    }
  }).call(j.prototype);
  return j
});
require.def("ace/Search", ["ace/lib/lang", "ace/lib/oop", "ace/Range"], function(k, f, a) {
  var h = function() {
    this.$options = {needle:"", backwards:false, wrap:false, caseSensitive:false, wholeWord:false, scope:h.ALL, regExp:false}
  };
  h.ALL = 1;
  h.SELECTION = 2;
  (function() {
    this.set = function(i) {
      f.mixin(this.$options, i);
      return this
    };
    this.getOptions = function() {
      return k.copyObject(this.$options)
    };
    this.find = function(i) {
      if(!this.$options.needle) {
        return null
      }var e = null;
      (this.$options.backwards ? this.$backwardMatchIterator(i) : this.$forwardMatchIterator(i)).forEach(function(j) {
        e = j;
        return true
      });
      return e
    };
    this.findAll = function(i) {
      if(!this.$options.needle) {
        return[]
      }var e = [];
      (this.$options.backwards ? this.$backwardMatchIterator(i) : this.$forwardMatchIterator(i)).forEach(function(j) {
        e.push(j)
      });
      return e
    };
    this.replace = function(i, e) {
      var j = this.$assembleRegExp(), c = j.exec(i);
      return c && c[0].length == i.length ? this.$options.regExp ? i.replace(j, e) : e : null
    };
    this.$forwardMatchIterator = function(i) {
      var e = this.$assembleRegExp(), j = this;
      return{forEach:function(c) {
        j.$forwardLineIterator(i).forEach(function(g, l, m) {
          if(l) {
            g = g.substring(l)
          }var b = [];
          g.replace(e, function(n) {
            b.push({str:n, offset:l + arguments[arguments.length - 2]});
            return n
          });
          for(g = 0;g < b.length;g++) {
            var d = b[g];
            d = j.$rangeFromMatch(m, d.offset, d.str.length);
            if(c(d)) {
              return true
            }
          }
        })
      }}
    };
    this.$backwardMatchIterator = function(i) {
      var e = this.$assembleRegExp(), j = this;
      return{forEach:function(c) {
        j.$backwardLineIterator(i).forEach(function(g, l, m) {
          if(l) {
            g = g.substring(l)
          }var b = [];
          g.replace(e, function(n, o) {
            b.push({str:n, offset:l + o});
            return n
          });
          for(g = b.length - 1;g >= 0;g--) {
            var d = b[g];
            d = j.$rangeFromMatch(m, d.offset, d.str.length);
            if(c(d)) {
              return true
            }
          }
        })
      }}
    };
    this.$rangeFromMatch = function(i, e, j) {
      return new a(i, e, i, e + j)
    };
    this.$assembleRegExp = function() {
      var i = this.$options.regExp ? this.$options.needle : k.escapeRegExp(this.$options.needle);
      if(this.$options.wholeWord) {
        i = "\\b" + i + "\\b"
      }var e = "g";
      this.$options.caseSensitive || (e += "i");
      return new RegExp(i, e)
    };
    this.$forwardLineIterator = function(i) {
      function e(n) {
        var o = i.getLine(n);
        if(j && n == c.end.row) {
          o = o.substring(0, c.end.column)
        }return o
      }
      var j = this.$options.scope == h.SELECTION, c = i.getSelection().getRange(), g = i.getSelection().getCursor(), l = j ? c.start.row : 0, m = j ? c.start.column : 0, b = j ? c.end.row : i.getLength() - 1, d = this.$options.wrap;
      return{forEach:function(n) {
        for(var o = g.row, p = e(o), r = g.column, q = false;!n(p, r, o);) {
          if(q) {
            return
          }o++;
          r = 0;
          if(o > b) {
            if(d) {
              o = l;
              r = m
            }else {
              return
            }
          }if(o == g.row) {
            q = true
          }p = e(o)
        }
      }}
    };
    this.$backwardLineIterator = function(i) {
      var e = this.$options.scope == h.SELECTION, j = i.getSelection().getRange(), c = e ? j.end : j.start, g = e ? j.start.row : 0, l = e ? j.start.column : 0, m = e ? j.end.row : i.getLength() - 1, b = this.$options.wrap;
      return{forEach:function(d) {
        for(var n = c.row, o = i.getLine(n).substring(0, c.column), p = 0, r = false;!d(o, p, n);) {
          if(r) {
            return
          }n--;
          p = 0;
          if(n < g) {
            if(b) {
              n = m
            }else {
              return
            }
          }if(n == c.row) {
            r = true
          }o = i.getLine(n);
          if(e) {
            if(n == g) {
              p = l
            }else {
              if(n == m) {
                o = o.substring(0, j.end.column)
              }
            }
          }
        }
      }}
    }
  }).call(h.prototype);
  return h
});
require.def("ace/BackgroundTokenizer", ["ace/lib/oop", "ace/MEventEmitter"], function(k, f) {
  var a = function(h, i) {
    this.running = false;
    this.textLines = [];
    this.lines = [];
    this.currentLine = 0;
    this.tokenizer = h;
    var e = this;
    this.$worker = function() {
      if(e.running) {
        for(var j = new Date, c = e.currentLine, g = e.textLines, l = 0, m = i.getLastVisibleRow();e.currentLine < g.length;) {
          e.lines[e.currentLine] = e.$tokenizeRows(e.currentLine, e.currentLine)[0];
          e.currentLine++;
          l += 1;
          if(l % 5 == 0 && new Date - j > 20) {
            e.fireUpdateEvent(c, e.currentLine - 1);
            e.running = setTimeout(e.$worker, e.currentLine < m ? 20 : 100);
            return
          }
        }e.running = false;
        e.fireUpdateEvent(c, g.length - 1)
      }
    }
  };
  (function() {
    k.implement(this, f);
    this.setTokenizer = function(h) {
      this.tokenizer = h;
      this.lines = [];
      this.start(0)
    };
    this.setLines = function(h) {
      this.textLines = h;
      this.lines = [];
      this.stop()
    };
    this.fireUpdateEvent = function(h, i) {
      this.$dispatchEvent("update", {data:{first:h, last:i}})
    };
    this.start = function(h) {
      this.currentLine = Math.min(h || 0, this.currentLine, this.textLines.length);
      this.lines.splice(this.currentLine, this.lines.length);
      this.stop();
      this.running = setTimeout(this.$worker, 700)
    };
    this.stop = function() {
      this.running && clearTimeout(this.running);
      this.running = false
    };
    this.getTokens = function(h, i, e) {
      e(this.$tokenizeRows(h, i))
    };
    this.getState = function(h, i) {
      i(this.$tokenizeRows(h, h)[0].state)
    };
    this.$tokenizeRows = function(h, i) {
      var e = [], j = "start", c = false;
      if(h > 0 && this.lines[h - 1]) {
        j = this.lines[h - 1].state;
        c = true
      }for(h = h;h <= i;h++) {
        if(this.lines[h]) {
          g = this.lines[h];
          j = g.state;
          e.push(g)
        }else {
          var g = this.tokenizer.getLineTokens(this.textLines[h] || "", j);
          j = g.state;
          e.push(g);
          if(c) {
            this.lines[h] = g
          }
        }
      }return e
    }
  }).call(a.prototype);
  return a
});
require.def("ace/Editor", ["ace/lib/oop", "ace/lib/event", "ace/lib/lang", "ace/TextInput", "ace/KeyBinding", "ace/Document", "ace/Search", "ace/BackgroundTokenizer", "ace/Range", "ace/MEventEmitter"], function(k, f, a, h, i, e, j, c, g, l) {
  var m = function(b, d) {
    var n = b.getContainerElement();
    this.container = n;
    this.renderer = b;
    this.textInput = new h(n, this);
    this.keyBinding = new i(n, this);
    var o = this;
    f.addListener(n, "mousedown", function(p) {
      setTimeout(function() {
        o.focus()
      });
      return f.preventDefault(p)
    });
    f.addListener(n, "selectstart", function(p) {
      return f.preventDefault(p)
    });
    b = b.getMouseEventTarget();
    f.addListener(b, "mousedown", a.bind(this.onMouseDown, this));
    f.addMultiMouseDownListener(b, 0, 2, 500, a.bind(this.onMouseDoubleClick, this));
    f.addMultiMouseDownListener(b, 0, 3, 600, a.bind(this.onMouseTripleClick, this));
    f.addMouseWheelListener(b, a.bind(this.onMouseWheel, this));
    this.$highlightLineMarker = this.$selectionMarker = null;
    this.$blockScrolling = false;
    this.$search = (new j).set({wrap:true});
    this.setDocument(d || new e(""));
    this.focus()
  };
  (function() {
    k.implement(this, l);
    this.$forwardEvents = {gutterclick:1, gutterdblclick:1};
    this.$originalAddEventListener = this.addEventListener;
    this.$originalRemoveEventListener = this.removeEventListener;
    this.addEventListener = function(b, d) {
      return this.$forwardEvents[b] ? this.renderer.addEventListener(b, d) : this.$originalAddEventListener(b, d)
    };
    this.removeEventListener = function(b, d) {
      return this.$forwardEvents[b] ? this.renderer.removeEventListener(b, d) : this.$originalRemoveEventListener(b, d)
    };
    this.setDocument = function(b) {
      if(this.doc != b) {
        if(this.doc) {
          this.doc.removeEventListener("change", this.$onDocumentChange);
          this.doc.removeEventListener("changeMode", this.$onDocumentModeChange);
          this.doc.removeEventListener("changeTabSize", this.$onDocumentChangeTabSize);
          this.doc.removeEventListener("changeBreakpoint", this.$onDocumentChangeBreakpoint);
          var d = this.doc.getSelection();
          d.removeEventListener("changeCursor", this.$onCursorChange);
          d.removeEventListener("changeSelection", this.$onSelectionChange);
          this.doc.setScrollTopRow(this.renderer.getScrollTopRow())
        }this.doc = b;
        this.$onDocumentChange = a.bind(this.onDocumentChange, this);
        b.addEventListener("change", this.$onDocumentChange);
        this.renderer.setDocument(b);
        this.$onDocumentModeChange = a.bind(this.onDocumentModeChange, this);
        b.addEventListener("changeMode", this.$onDocumentModeChange);
        this.$onDocumentChangeTabSize = a.bind(this.renderer.updateText, this.renderer);
        b.addEventListener("changeTabSize", this.$onDocumentChangeTabSize);
        this.$onDocumentChangeBreakpoint = a.bind(this.onDocumentChangeBreakpoint, this);
        this.doc.addEventListener("changeBreakpoint", this.$onDocumentChangeBreakpoint);
        this.selection = b.getSelection();
        this.$desiredColumn = 0;
        this.$onCursorChange = a.bind(this.onCursorChange, this);
        this.selection.addEventListener("changeCursor", this.$onCursorChange);
        this.$onSelectionChange = a.bind(this.onSelectionChange, this);
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
          var d = b.doc.findMatchingBracket(b.getCursorPosition());
          if(d) {
            d = new g(d.row, d.column, d.row, d.column + 1);
            b.$bracketHighlight = b.renderer.addMarker(d, "ace_bracket")
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
        this.$highlightLineMarker = this.renderer.addMarker(new g(b.row, 0, b.row + 1, 0), "ace_active_line", "line")
      }
    };
    this.onSelectionChange = function() {
      this.$selectionMarker && this.renderer.removeMarker(this.$selectionMarker);
      this.$selectionMarker = null;
      if(!this.selection.isEmpty()) {
        var b = this.selection.getRange(), d = this.getSelectionStyle();
        this.$selectionMarker = this.renderer.addMarker(b, "ace_selection", d)
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
          var d = a.bind(this.onTokenizerUpdate, this);
          this.bgTokenizer = new c(b, this);
          this.bgTokenizer.addEventListener("update", d)
        }this.renderer.setTokenizer(this.bgTokenizer)
      }
    };
    this.onMouseDown = function(b) {
      var d = f.getDocumentX(b), n = f.getDocumentY(b);
      d = this.renderer.screenToTextCoordinates(d, n);
      d.row = Math.max(0, Math.min(d.row, this.doc.getLength() - 1));
      if(f.getButton(b) != 0) {
        this.selection.isEmpty() && this.moveCursorToPosition(d)
      }else {
        if(b.shiftKey) {
          this.selection.selectToPosition(d)
        }else {
          this.moveCursorToPosition(d);
          this.$clickSelection || this.selection.clearSelection(d.row, d.column)
        }this.renderer.scrollCursorIntoView();
        var o = this, p, r;
        f.capture(this.container, function(s) {
          p = f.getDocumentX(s);
          r = f.getDocumentY(s)
        }, function() {
          clearInterval(q);
          o.$clickSelection = null
        });
        var q = setInterval(function() {
          if(!(p === undefined || r === undefined)) {
            var s = o.renderer.screenToTextCoordinates(p, r);
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
        return f.preventDefault(b)
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
      var d = this.$scrollSpeed * 2;
      this.renderer.scrollBy(b.wheelX * d, b.wheelY * d);
      return f.preventDefault(b)
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
        var d = this.getCursorPosition();
        b = b.replace("\t", this.doc.getTabString());
        if(this.selection.isEmpty()) {
          if(this.$overwrite) {
            var n = new g.fromPoints(d, d);
            n.end.column += b.length;
            this.doc.remove(n)
          }
        }else {
          d = this.doc.remove(this.getSelectionRange());
          this.clearSelection()
        }this.clearSelection();
        var o = this;
        this.bgTokenizer.getState(d.row, function(p) {
          var r = o.mode.checkOutdent(p, o.doc.getLine(d.row), b), q = o.doc.getLine(d.row), s = o.mode.getNextLineIndent(p, q, o.doc.getTabString()), t = o.doc.insert(d, b);
          o.bgTokenizer.getState(d.row, function(x) {
            if(d.row !== t.row) {
              x = o.doc.getTabSize();
              for(var y = Number.MAX_VALUE, v = d.row + 1;v <= t.row;++v) {
                var w = 0;
                q = o.doc.getLine(v);
                for(var u = 0;u < q.length;++u) {
                  if(q.charAt(u) == "\t") {
                    w += x
                  }else {
                    if(q.charAt(u) == " ") {
                      w += 1
                    }else {
                      break
                    }
                  }
                }if(/[^\s]$/.test(q)) {
                  y = Math.min(w, y)
                }
              }for(v = d.row + 1;v <= t.row;++v) {
                w = y;
                q = o.doc.getLine(v);
                for(u = 0;u < q.length && w > 0;++u) {
                  if(q.charAt(u) == "\t") {
                    w -= x
                  }else {
                    if(q.charAt(u) == " ") {
                      w -= 1
                    }
                  }
                }o.doc.replace(new g(v, 0, v, q.length), q.substr(u))
              }t.column += o.doc.indentRows(new g(d.row + 1, 0, t.row, t.column), s)
            }else {
              if(r) {
                t.column += o.mode.autoOutdent(x, o.doc, d.row)
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
            b = a.stringRepeat(" ", b)
          }else {
            b = "\t"
          }return this.onTextInput(b)
        }
      }
    };
    this.blockOutdent = function() {
      if(!this.$readOnly) {
        var b = this.doc.getSelection(), d = this.doc.outdentRows(b.getRange());
        b.setSelectionRange(d, b.isBackwards());
        this.$updateDesiredColumn()
      }
    };
    this.toggleCommentLines = function() {
      if(!this.$readOnly) {
        var b = this.$getSelectedRows(), d = new g(b.first, 0, b.last, 0), n = this;
        this.bgTokenizer.getState(this.getCursorPosition().row, function(o) {
          o = n.mode.toggleCommentLines(o, n.doc, d);
          n.selection.shiftSelection(o)
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
      this.$readOnly || this.$moveLines(function(b, d) {
        return this.doc.moveLinesDown(b, d)
      })
    };
    this.moveLinesUp = function() {
      this.$readOnly || this.$moveLines(function(b, d) {
        return this.doc.moveLinesUp(b, d)
      })
    };
    this.copyLinesUp = function() {
      this.$readOnly || this.$moveLines(function(b, d) {
        this.doc.duplicateLines(b, d);
        return 0
      })
    };
    this.copyLinesDown = function() {
      this.$readOnly || this.$moveLines(function(b, d) {
        return this.doc.duplicateLines(b, d)
      })
    };
    this.$moveLines = function(b) {
      var d = this.$getSelectedRows(), n = b.call(this, d.first, d.last), o = this.selection;
      o.setSelectionAnchor(d.last + n + 1, 0);
      o.$moveSelection(function() {
        o.moveCursorTo(d.first + n, 0)
      })
    };
    this.$getSelectedRows = function() {
      var b = this.getSelectionRange(), d = b.start.row, n = b.end.row;
      if(b.end.column == 0 && b.start.row !== b.end.row) {
        n -= 1
      }return{first:d, last:n}
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
      var b = this.renderer.getFirstVisibleRow(), d = this.renderer.getLastVisibleRow();
      return b - (d - b) + 1
    };
    this.selectPageDown = function() {
      var b = this.getPageDownRow() + Math.floor(this.getVisibleRowCount() / 2);
      this.scrollPageDown();
      var d = this.getSelection();
      d.$moveSelection(function() {
        d.moveCursorTo(b, d.getSelectionLead().column)
      })
    };
    this.selectPageUp = function() {
      var b = this.getLastVisibleRow() - this.getFirstVisibleRow(), d = this.getPageUpRow() + Math.round(b / 2);
      this.scrollPageUp();
      var n = this.getSelection();
      n.$moveSelection(function() {
        n.moveCursorTo(d, n.getSelectionLead().column)
      })
    };
    this.gotoPageDown = function() {
      var b = this.getPageDownRow(), d = Math.min(this.getCursorPosition().column, this.doc.getLine(b).length);
      this.scrollToRow(b);
      this.getSelection().moveCursorTo(b, d)
    };
    this.gotoPageUp = function() {
      var b = this.getPageUpRow(), d = Math.min(this.getCursorPosition().column, this.doc.getLine(b).length);
      this.scrollToRow(b);
      this.getSelection().moveCursorTo(b, d)
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
    this.moveCursorTo = function(b, d) {
      this.selection.moveCursorTo(b, d);
      this.$updateDesiredColumn()
    };
    this.moveCursorToPosition = function(b) {
      this.selection.moveCursorToPosition(b);
      this.$updateDesiredColumn()
    };
    this.gotoLine = function(b, d) {
      this.selection.clearSelection();
      this.$blockScrolling = true;
      this.moveCursorTo(b - 1, d || 0);
      this.$blockScrolling = false;
      this.isRowVisible(this.getCursorPosition().row) || this.scrollToRow(b - 1 - Math.floor(this.getVisibleRowCount() / 2))
    };
    this.navigateTo = function(b, d) {
      this.clearSelection();
      this.moveCursorTo(b, d);
      this.$updateDesiredColumn(d)
    };
    this.navigateUp = function() {
      this.selection.clearSelection();
      this.selection.moveCursorBy(-1, 0);
      if(this.$desiredColumn) {
        var b = this.getCursorPosition(), d = this.doc.screenToDocumentColumn(b.row, this.$desiredColumn);
        this.selection.moveCursorTo(b.row, d)
      }
    };
    this.navigateDown = function() {
      this.selection.clearSelection();
      this.selection.moveCursorBy(1, 0);
      if(this.$desiredColumn) {
        var b = this.getCursorPosition(), d = this.doc.screenToDocumentColumn(b.row, this.$desiredColumn);
        this.selection.moveCursorTo(b.row, d)
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
    this.replace = function(b, d) {
      d && this.$search.set(d);
      d = this.$search.find(this.doc);
      this.$tryReplace(d, b);
      d !== null && this.selection.setSelectionRange(d);
      this.$updateDesiredColumn()
    };
    this.replaceAll = function(b, d) {
      d && this.$search.set(d);
      this.clearSelection();
      this.selection.moveCursorTo(0, 0);
      d = this.$search.findAll(this.doc);
      if(d.length) {
        for(var n = d.length - 1;n >= 0;--n) {
          this.$tryReplace(d[n], b)
        }d[0] !== null && this.selection.setSelectionRange(d[0]);
        this.$updateDesiredColumn()
      }
    };
    this.$tryReplace = function(b, d) {
      d = this.$search.replace(this.doc.getTextRange(b), d);
      if(d !== null) {
        b.end = this.doc.replace(b, d);
        return b
      }else {
        return null
      }
    };
    this.getLastSearchOptions = function() {
      return this.$search.getOptions()
    };
    this.find = function(b, d) {
      this.clearSelection();
      d = d || {};
      d.needle = b;
      this.$search.set(d);
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
  }).call(m.prototype);
  return m
});
require.def("ace/UndoManager", function() {
  var k = function() {
    this.$undoStack = [];
    this.$redoStack = []
  };
  (function() {
    this.execute = function(f) {
      var a = f.args[0];
      this.$doc = f.args[1];
      this.$undoStack.push(a)
    };
    this.undo = function() {
      var f = this.$undoStack.pop();
      if(f) {
        this.$doc.undoChanges(f);
        this.$redoStack.push(f)
      }
    };
    this.redo = function() {
      var f = this.$redoStack.pop();
      if(f) {
        this.$doc.redoChanges(f);
        this.$undoStack.push(f)
      }
    }
  }).call(k.prototype);
  return k
});
if(!require.def) {
  require.def = require("requireJS-node")(module, require)
}require.def("ace/lib/dom", ["ace/lib/lang"], function(k) {
  var f = {};
  f.setText = function(a, h) {
    if(a.innerText !== undefined) {
      a.innerText = h
    }if(a.textContent !== undefined) {
      a.textContent = h
    }
  };
  f.hasCssClass = function(a, h) {
    a = a.className.split(/\s+/g);
    return k.arrayIndexOf(a, h) !== -1
  };
  f.addCssClass = function(a, h) {
    f.hasCssClass(a, h) || (a.className += " " + h)
  };
  f.removeCssClass = function(a, h) {
    for(var i = a.className.split(/\s+/g);;) {
      var e = k.arrayIndexOf(i, h);
      if(e == -1) {
        break
      }i.splice(e, 1)
    }a.className = i.join(" ")
  };
  f.importCssString = function(a, h) {
    h = h || document;
    if(h.createStyleSheet) {
      h.createStyleSheet().cssText = a
    }else {
      var i = h.createElement("style");
      i.appendChild(h.createTextNode(a));
      h.getElementsByTagName("head")[0].appendChild(i)
    }
  };
  f.getInnerWidth = function(a) {
    return parseInt(f.computedStyle(a, "paddingLeft")) + parseInt(f.computedStyle(a, "paddingRight")) + a.clientWidth
  };
  f.getInnerHeight = function(a) {
    return parseInt(f.computedStyle(a, "paddingTop")) + parseInt(f.computedStyle(a, "paddingBottom")) + a.clientHeight
  };
  f.computedStyle = function(a, h) {
    return window.getComputedStyle ? (window.getComputedStyle(a, "") || {})[h] || "" : a.currentStyle[h]
  };
  f.scrollbarWidth = function() {
    var a = document.createElement("p");
    a.style.width = "100%";
    a.style.height = "200px";
    var h = document.createElement("div"), i = h.style;
    i.position = "absolute";
    i.left = "-10000px";
    i.overflow = "hidden";
    i.width = "200px";
    i.height = "150px";
    h.appendChild(a);
    document.body.appendChild(h);
    var e = a.offsetWidth;
    i.overflow = "scroll";
    a = a.offsetWidth;
    if(e == a) {
      a = h.clientWidth
    }document.body.removeChild(h);
    return e - a
  };
  return f
});
require.def("ace/layer/Gutter", [], function() {
  var k = function(f) {
    this.element = document.createElement("div");
    this.element.className = "ace_layer ace_gutter-layer";
    f.appendChild(this.element);
    this.$breakpoints = [];
    this.$decorations = []
  };
  (function() {
    this.addGutterDecoration = function(f, a) {
      this.$decorations[f] || (this.$decorations[f] = "");
      this.$decorations[f] += " ace_" + a
    };
    this.removeGutterDecoration = function(f, a) {
      this.$decorations[f] = this.$decorations[f].replace(" ace_" + a, "")
    };
    this.setBreakpoints = function(f) {
      this.$breakpoints = f.concat()
    };
    this.update = function(f) {
      this.$config = f;
      for(var a = [], h = f.firstRow;h <= f.lastRow;h++) {
        a.push("<div class='ace_gutter-cell", this.$decorations[h] || "", this.$breakpoints[h] ? " ace_breakpoint" : "", "' style='height:", f.lineHeight, "px;'>", h + 1, "</div>");
        a.push("</div>")
      }this.element.innerHTML = a.join("");
      this.element.style.height = f.minHeight + "px"
    }
  }).call(k.prototype);
  return k
});
require.def("ace/layer/Marker", ["ace/Range"], function(k) {
  var f = function(a) {
    this.element = document.createElement("div");
    this.element.className = "ace_layer ace_marker-layer";
    a.appendChild(this.element);
    this.markers = {};
    this.$markerId = 1
  };
  (function() {
    this.setDocument = function(a) {
      this.doc = a
    };
    this.addMarker = function(a, h, i) {
      var e = this.$markerId++;
      this.markers[e] = {range:a, type:i || "line", clazz:h};
      return e
    };
    this.removeMarker = function(a) {
      this.markers[a] && delete this.markers[a]
    };
    this.update = function(a) {
      if(a = a || this.config) {
        this.config = a;
        var h = [];
        for(var i in this.markers) {
          var e = this.markers[i], j = e.range.clipRows(a.firstRow, a.lastRow);
          if(!j.isEmpty()) {
            if(j.isMultiLine()) {
              e.type == "text" ? this.drawTextMarker(h, j, e.clazz, a) : this.drawMultiLineMarker(h, j, e.clazz, a)
            }else {
              this.drawSingleLineMarker(h, j, e.clazz, a)
            }
          }
        }this.element.innerHTML = h.join("")
      }
    };
    this.drawTextMarker = function(a, h, i, e) {
      var j = h.start.row, c = new k(j, h.start.column, j, this.doc.getLine(j).length);
      this.drawSingleLineMarker(a, c, i, e);
      j = h.end.row;
      c = new k(j, 0, j, h.end.column);
      this.drawSingleLineMarker(a, c, i, e);
      for(j = h.start.row + 1;j < h.end.row;j++) {
        c.start.row = j;
        c.end.row = j;
        c.end.column = this.doc.getLine(j).length;
        this.drawSingleLineMarker(a, c, i, e)
      }
    };
    this.drawMultiLineMarker = function(a, h, i, e) {
      h = h.toScreenRange(this.doc);
      var j = e.lineHeight, c = Math.round(e.width - h.start.column * e.characterWidth), g = (h.start.row - e.firstRow) * e.lineHeight, l = Math.round(h.start.column * e.characterWidth);
      a.push("<div class='", i, "' style='", "height:", j, "px;", "width:", c, "px;", "top:", g, "px;", "left:", l, "px;'></div>");
      g = (h.end.row - e.firstRow) * e.lineHeight;
      c = Math.round(h.end.column * e.characterWidth);
      a.push("<div class='", i, "' style='", "height:", j, "px;", "top:", g, "px;", "width:", c, "px;'></div>");
      j = (h.end.row - h.start.row - 1) * e.lineHeight;
      if(!(j < 0)) {
        g = (h.start.row + 1 - e.firstRow) * e.lineHeight;
        a.push("<div class='", i, "' style='", "height:", j, "px;", "width:", e.width, "px;", "top:", g, "px;'></div>")
      }
    };
    this.drawSingleLineMarker = function(a, h, i, e) {
      h = h.toScreenRange(this.doc);
      var j = e.lineHeight, c = Math.round((h.end.column - h.start.column) * e.characterWidth), g = (h.start.row - e.firstRow) * e.lineHeight;
      h = Math.round(h.start.column * e.characterWidth);
      a.push("<div class='", i, "' style='", "height:", j, "px;", "width:", c, "px;", "top:", g, "px;", "left:", h, "px;'></div>")
    }
  }).call(f.prototype);
  return f
});
require.def("ace/layer/Text", ["ace/lib/oop", "ace/lib/dom", "ace/MEventEmitter"], function(k, f, a) {
  var h = function(i) {
    this.element = document.createElement("div");
    this.element.className = "ace_layer ace_text-layer";
    i.appendChild(this.element);
    this.$characterSize = this.$measureSizes();
    this.$pollSizeChanges()
  };
  (function() {
    k.implement(this, a);
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
        var e = i.$measureSizes();
        if(i.$characterSize.width !== e.width || i.$characterSize.height !== e.height) {
          i.$characterSize = e;
          i.$dispatchEvent("changeCharaterSize", {data:e})
        }
      }, 500)
    };
    this.$fontStyles = {fontFamily:1, fontSize:1, fontWeight:1, fontStyle:1, lineHeight:1};
    this.$measureSizes = function() {
      var i = document.createElement("div"), e = i.style;
      e.width = e.height = "auto";
      e.left = e.top = "-1000px";
      e.visibility = "hidden";
      e.position = "absolute";
      e.overflow = "visible";
      for(var j in this.$fontStyles) {
        var c = f.computedStyle(this.element, j);
        e[j] = c
      }i.innerHTML = (new Array(1E3)).join("Xy");
      document.body.insertBefore(i, document.body.firstChild);
      e = {height:i.offsetHeight, width:i.offsetWidth / 2E3};
      document.body.removeChild(i);
      return e
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
    this.updateLines = function(i, e, j) {
      this.$computeTabString();
      var c = Math.max(e, i.firstRow), g = Math.min(j, i.lastRow), l = this.element.childNodes, m = this;
      this.tokenizer.getTokens(c, g, function(b) {
        for(var d = c;d <= g;d++) {
          var n = l[d - i.firstRow];
          if(n) {
            var o = [];
            m.$renderLine(o, d, b[d - c].tokens);
            n.innerHTML = o.join("")
          }
        }
      })
    };
    this.scrollLines = function(i) {
      function e(b) {
        i.firstRow < g.firstRow ? c.$renderLinesFragment(i, i.firstRow, g.firstRow - 1, function(d) {
          l.firstChild ? l.insertBefore(d, l.firstChild) : l.appendChild(d);
          b()
        }) : b()
      }
      function j() {
        i.lastRow > g.lastRow && c.$renderLinesFragment(i, g.lastRow + 1, i.lastRow, function(b) {
          l.appendChild(b)
        })
      }
      var c = this;
      this.$computeTabString();
      var g = this.config;
      this.config = i;
      if(!g || g.lastRow < i.firstRow) {
        return this.update(i)
      }if(i.lastRow < g.firstRow) {
        return this.update(i)
      }var l = this.element;
      if(g.firstRow < i.firstRow) {
        for(var m = g.firstRow;m < i.firstRow;m++) {
          l.removeChild(l.firstChild)
        }
      }if(g.lastRow > i.lastRow) {
        for(m = i.lastRow + 1;m <= g.lastRow;m++) {
          l.removeChild(l.lastChild)
        }
      }e(j)
    };
    this.$renderLinesFragment = function(i, e, j, c) {
      var g = document.createDocumentFragment(), l = this;
      this.tokenizer.getTokens(e, j, function(m) {
        for(var b = e;b <= j;b++) {
          var d = document.createElement("div");
          d.className = "ace_line";
          var n = d.style;
          n.height = l.$characterSize.height + "px";
          n.width = i.width + "px";
          n = [];
          l.$renderLine(n, b, m[b - e].tokens);
          d.innerHTML = n.join("");
          g.appendChild(d)
        }c(g)
      })
    };
    this.update = function(i) {
      this.$computeTabString();
      var e = [], j = this;
      this.tokenizer.getTokens(i.firstRow, i.lastRow, function(c) {
        for(var g = i.firstRow;g <= i.lastRow;g++) {
          e.push("<div class='ace_line' style='height:" + j.$characterSize.height + "px;", "width:", i.width, "px'>");
          j.$renderLine(e, g, c[g - i.firstRow].tokens);
          e.push("</div>")
        }j.element.innerHTML = e.join("")
      })
    };
    this.$textToken = {text:true, rparen:true, lparen:true};
    this.$renderLine = function(i, e, j) {
      for(var c = /[\v\f \u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000]/g, g = 0;g < j.length;g++) {
        var l = j[g], m = l.value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(c, "&nbsp;").replace(/\t/g, this.$tabString);
        if(this.$textToken[l.type]) {
          i.push(m)
        }else {
          l = "ace_" + l.type.replace(/\./g, " ace_");
          i.push("<span class='", l, "'>", m, "</span>")
        }
      }if(this.$showInvisibles) {
        e !== this.doc.getLength() - 1 ? i.push("<span class='ace_invisible'>" + this.EOL_CHAR + "</span>") : i.push("<span class='ace_invisible'>" + this.EOF_CHAR + "</span>")
      }
    }
  }).call(h.prototype);
  return h
});
require.def("ace/layer/Cursor", ["ace/lib/dom"], function(k) {
  var f = function(a) {
    this.element = document.createElement("div");
    this.element.className = "ace_layer ace_cursor-layer";
    a.appendChild(this.element);
    this.cursor = document.createElement("div");
    this.cursor.className = "ace_cursor";
    this.isVisible = false
  };
  (function() {
    this.setDocument = function(a) {
      this.doc = a
    };
    this.setCursor = function(a, h) {
      this.position = {row:a.row, column:this.doc.documentToScreenColumn(a.row, a.column)};
      h ? k.addCssClass(this.cursor, "ace_overwrite") : k.removeCssClass(this.cursor, "ace_overwrite")
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
        var a = this.cursor;
        this.blinkId = setInterval(function() {
          a.style.visibility = "hidden";
          setTimeout(function() {
            a.style.visibility = "visible"
          }, 400)
        }, 1E3)
      }
    };
    this.getPixelPosition = function() {
      if(!this.config || !this.position) {
        return{left:0, top:0}
      }var a = this.position.row * this.config.lineHeight;
      return{left:Math.round(this.position.column * this.config.characterWidth), top:a}
    };
    this.update = function(a) {
      if(this.position) {
        this.config = a;
        var h = Math.round(this.position.column * a.characterWidth), i = this.position.row * a.lineHeight;
        this.pixelPos = {left:h, top:i};
        this.cursor.style.left = h + "px";
        this.cursor.style.top = i - a.firstRow * a.lineHeight + "px";
        this.cursor.style.width = a.characterWidth + "px";
        this.cursor.style.height = a.lineHeight + "px";
        this.isVisible && this.element.appendChild(this.cursor);
        this.restartTimer()
      }
    }
  }).call(f.prototype);
  return f
});
require.def("ace/ScrollBar", ["ace/lib/oop", "ace/lib/lang", "ace/lib/dom", "ace/lib/event", "ace/MEventEmitter"], function(k, f, a, h, i) {
  var e = function(j) {
    this.element = document.createElement("div");
    this.element.className = "ace_sb";
    this.inner = document.createElement("div");
    this.element.appendChild(this.inner);
    j.appendChild(this.element);
    this.width = a.scrollbarWidth();
    this.element.style.width = this.width;
    h.addListener(this.element, "scroll", f.bind(this.onScroll, this))
  };
  (function() {
    k.implement(this, i);
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
  }).call(e.prototype);
  return e
});
require.def("ace/RenderLoop", function() {
  var k = function(f) {
    this.onRender = f;
    this.pending = false;
    this.changes = 0
  };
  (function() {
    this.schedule = function(f) {
      this.changes |= f;
      if(!this.pending) {
        this.pending = true;
        var a = this;
        this.setTimeoutZero(function() {
          a.pending = false;
          a.onRender(a.changes);
          a.changes = 0
        })
      }
    };
    if(window.postMessage) {
      this.messageName = "zero-timeout-message";
      this.setTimeoutZero = function(f) {
        if(!this.attached) {
          var a = this;
          window.addEventListener("message", function(h) {
            if(h.source == window && a.callback && h.data == a.messageName) {
              h.stopPropagation();
              a.callback()
            }
          }, false);
          this.attached = true
        }this.callback = f;
        window.postMessage(this.messageName, "*")
      }
    }else {
      this.setTimeoutZero = function(f) {
        setTimeout(f, 0)
      }
    }
  }).call(k.prototype);
  return k
});
require.def("ace/VirtualRenderer", ["ace/lib/oop", "ace/lib/lang", "ace/lib/dom", "ace/lib/event", "ace/layer/Gutter", "ace/layer/Marker", "ace/layer/Text", "ace/layer/Cursor", "ace/ScrollBar", "ace/RenderLoop", "ace/MEventEmitter", 'text!ace/css/editor.css!.ace_editor {\n  position: absolute;\n  overflow: hidden;\n\n  font-family: "Menlo", "Monaco", "Courier New", monospace;\n  font-size: 12px;  \n}\n\n.ace_scroller {\n  position: absolute;\n  overflow-x: scroll;\n  overflow-y: hidden;     \n}\n\n.ace_gutter {\n  position: absolute;\n  overflow-x: hidden;\n  overflow-y: hidden;\n  height: 100%;\n}\n\n.ace_editor .ace_sb {\n  position: absolute;\n  overflow-x: hidden;\n  overflow-y: scroll;\n  right: 0;\n}\n\n.ace_editor .ace_sb div {\n  position: absolute;\n  width: 1px;\n  left: 0px;\n}\n\n.ace_editor .ace_printMargin {\n  position: absolute;\n  height: 100%;\n}\n\n.ace_layer {\n  z-index: 0;\n  position: absolute;\n  overflow: hidden;  \n  white-space: nowrap;\n  height: 100%;\n}\n\n.ace_text-layer {\n  font-family: Monaco, "Courier New", monospace;\n  color: black;\n}\n\n.ace_cursor-layer {\n  cursor: text;\n}\n\n.ace_cursor {\n  z-index: 3;\n  position: absolute;\n}\n\n.ace_line {\n  white-space: nowrap;\n}\n\n.ace_marker-layer {\n}\n\n.ace_marker-layer .ace_step {\n  position: absolute;\n  z-index: 2;\n}\n\n.ace_marker-layer .ace_selection {\n  position: absolute;\n  z-index: 3;\n}\n\n.ace_marker-layer .ace_bracket {\n  position: absolute;\n  z-index: 4;\n}\n\n.ace_marker-layer .ace_active_line {\n  position: absolute;\n  z-index: 1;\n}'], 
function(k, f, a, h, i, e, j, c, g, l, m, b) {
  a.importCssString(b);
  b = function(d, n) {
    this.container = d;
    a.addCssClass(this.container, "ace_editor");
    this.setTheme(n);
    this.scroller = document.createElement("div");
    this.scroller.className = "ace_scroller";
    this.container.appendChild(this.scroller);
    this.$gutter = document.createElement("div");
    this.$gutter.className = "ace_gutter";
    this.container.appendChild(this.$gutter);
    this.content = document.createElement("div");
    this.content.style.position = "absolute";
    this.scroller.appendChild(this.content);
    this.$gutterLayer = new i(this.$gutter);
    this.$markerLayer = new e(this.content);
    var o = this.$textLayer = new j(this.content);
    this.canvas = o.element;
    this.characterWidth = o.getCharacterWidth();
    this.lineHeight = o.getLineHeight();
    this.$cursorLayer = new c(this.content);
    this.layers = [this.$markerLayer, o, this.$cursorLayer];
    this.scrollBar = new g(d);
    this.scrollBar.addEventListener("scroll", f.bind(this.onScroll, this));
    this.scrollTop = 0;
    this.cursorPos = {row:0, column:0};
    var p = this;
    this.$textLayer.addEventListener("changeCharaterSize", function() {
      p.characterWidth = o.getCharacterWidth();
      p.lineHeight = o.getLineHeight();
      p.$loop.schedule(p.CHANGE_FULL)
    });
    h.addListener(this.$gutter, "click", f.bind(this.$onGutterClick, this));
    h.addListener(this.$gutter, "dblclick", f.bind(this.$onGutterClick, this));
    this.$size = {width:0, height:0, scrollerHeight:0, scrollerWidth:0};
    this.$loop = new l(f.bind(this.$renderChanges, this));
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
    k.implement(this, m);
    this.setDocument = function(d) {
      this.lines = d.lines;
      this.doc = d;
      this.$cursorLayer.setDocument(d);
      this.$markerLayer.setDocument(d);
      this.$textLayer.setDocument(d);
      this.$loop.schedule(this.CHANGE_FULL)
    };
    this.updateLines = function(d, n) {
      if(n === undefined) {
        n = Infinity
      }if(this.$changedLines) {
        if(this.$changedLines.firstRow > d) {
          this.$changedLines.firstRow = d
        }if(this.$changedLines.lastRow < n) {
          this.$changedLines.lastRow = n
        }
      }else {
        this.$changedLines = {firstRow:d, lastRow:n}
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
      var d = a.getInnerHeight(this.container);
      if(this.$size.height != d) {
        this.$size.height = d;
        this.scroller.style.height = d + "px";
        this.scrollBar.setHeight(d);
        if(this.doc) {
          this.scrollToY(this.getScrollTop());
          this.$loop.schedule(this.CHANGE_FULL)
        }
      }d = a.getInnerWidth(this.container);
      if(this.$size.width != d) {
        this.$size.width = d;
        var n = this.showGutter ? this.$gutter.offsetWidth : 0;
        this.scroller.style.left = n + "px";
        this.scroller.style.width = Math.max(0, d - n - this.scrollBar.getWidth()) + "px"
      }this.$size.scrollerWidth = this.scroller.clientWidth;
      this.$size.scrollerHeight = this.scroller.clientHeight
    };
    this.setTokenizer = function(d) {
      this.$tokenizer = d;
      this.$textLayer.setTokenizer(d);
      this.$loop.schedule(this.CHANGE_TEXT)
    };
    this.$onGutterClick = function(d) {
      var n = h.getDocumentX(d), o = h.getDocumentY(d);
      this.$dispatchEvent("gutter" + d.type, {row:this.screenToTextCoordinates(n, o).row, htmlEvent:d})
    };
    this.$showInvisibles = true;
    this.setShowInvisibles = function(d) {
      this.$showInvisibles = d;
      this.$textLayer.setShowInvisibles(d);
      this.$loop.schedule(this.CHANGE_TEXT)
    };
    this.getShowInvisibles = function() {
      return this.$showInvisibles
    };
    this.$showPrintMargin = true;
    this.setShowPrintMargin = function(d) {
      this.$showPrintMargin = d;
      this.$updatePrintMargin()
    };
    this.getShowPrintMargin = function() {
      return this.$showPrintMargin
    };
    this.$printMarginColumn = 80;
    this.setPrintMarginColumn = function(d) {
      this.$printMarginColumn = d;
      this.$updatePrintMargin()
    };
    this.getPrintMarginColumn = function() {
      return this.$printMarginColumn
    };
    this.setShowGutter = function(d) {
      this.$gutter.style.display = d ? "block" : "none";
      this.showGutter = d;
      this.onResize()
    };
    this.$updatePrintMargin = function() {
      if(this.$showPrintMargin || this.$printMarginEl) {
        if(!this.$printMarginEl) {
          this.$printMarginEl = document.createElement("div");
          this.$printMarginEl.className = "ace_printMargin";
          this.content.insertBefore(this.$printMarginEl, this.$textLayer.element)
        }var d = this.$printMarginEl.style;
        d.left = this.characterWidth * this.$printMarginColumn + "px";
        d.visibility = this.$showPrintMargin ? "visible" : "hidden"
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
    this.setPadding = function(d) {
      this.$padding = d;
      this.content.style.padding = "0 " + d + "px";
      this.$loop.schedule(this.CHANGE_FULL)
    };
    this.onScroll = function(d) {
      this.scrollToY(d.data)
    };
    this.$updateScrollBar = function() {
      this.scrollBar.setInnerHeight(this.doc.getLength() * this.lineHeight);
      this.scrollBar.setScrollTop(this.scrollTop)
    };
    this.$renderChanges = function(d) {
      if(!(!d || !this.doc || !this.$tokenizer)) {
        if(!this.layerConfig || d & this.CHANGE_FULL || d & this.CHANGE_SIZE || d & this.CHANGE_TEXT || d & this.CHANGE_LINES || d & this.CHANGE_SCROLL) {
          this.$computeLayerConfig()
        }if(d & this.CHANGE_FULL) {
          this.$textLayer.update(this.layerConfig);
          this.showGutter && this.$gutterLayer.update(this.layerConfig);
          this.$markerLayer.update(this.layerConfig);
          this.$cursorLayer.update(this.layerConfig);
          this.$updateScrollBar()
        }else {
          if(d & this.CHANGE_SCROLL) {
            d & this.CHANGE_TEXT || d & this.CHANGE_LINES ? this.$textLayer.scrollLines(this.layerConfig) : this.$textLayer.update(this.layerConfig);
            this.showGutter && this.$gutterLayer.update(this.layerConfig);
            this.$markerLayer.update(this.layerConfig);
            this.$cursorLayer.update(this.layerConfig);
            this.$updateScrollBar()
          }else {
            if(d & this.CHANGE_TEXT) {
              this.$textLayer.update(this.layerConfig);
              this.showGutter && this.$gutterLayer.update(this.layerConfig)
            }else {
              if(d & this.CHANGE_LINES) {
                this.$updateLines();
                this.$updateScrollBar()
              }else {
                if(d & this.CHANGE_SCROLL) {
                  this.$textLayer.scrollLines(this.layerConfig);
                  this.showGutter && this.$gutterLayer.update(this.layerConfig)
                }
              }
            }d & this.CHANGE_GUTTER && this.showGutter && this.$gutterLayer.update(this.layerConfig);
            d & this.CHANGE_CURSOR && this.$cursorLayer.update(this.layerConfig);
            d & this.CHANGE_MARKER && this.$markerLayer.update(this.layerConfig);
            d & this.CHANGE_SIZE && this.$updateScrollBar()
          }
        }
      }
    };
    this.$computeLayerConfig = function() {
      var d = this.scrollTop % this.lineHeight, n = this.$size.scrollerHeight + this.lineHeight, o = this.$getLongestLine(), p = !this.layerConfig ? true : this.layerConfig.width != o, r = Math.ceil(n / this.lineHeight), q = Math.max(0, Math.round((this.scrollTop - d) / this.lineHeight));
      r = Math.min(this.lines.length, q + r) - 1;
      this.layerConfig = {width:o, padding:this.$padding, firstRow:q, lastRow:r, lineHeight:this.lineHeight, characterWidth:this.characterWidth, minHeight:n, offset:d, height:this.$size.scrollerHeight};
      for(q = 0;q < this.layers.length;q++) {
        r = this.layers[q];
        if(p) {
          r.element.style.width = o + "px"
        }
      }this.$gutterLayer.element.style.marginTop = -d + "px";
      this.content.style.marginTop = -d + "px";
      this.content.style.width = o + "px";
      this.content.style.height = n + "px"
    };
    this.$updateLines = function() {
      var d = this.$changedLines.firstRow, n = this.$changedLines.lastRow;
      this.$changedLines = null;
      var o = this.layerConfig;
      if(o.width != this.$getLongestLine()) {
        return this.$textLayer.update(o)
      }if(!(d > o.lastRow + 1)) {
        if(!(n < o.firstRow)) {
          if(n === Infinity) {
            this.showGutter && this.$gutterLayer.update(o);
            this.$textLayer.update(o)
          }else {
            this.$textLayer.updateLines(o, d, n)
          }
        }
      }
    };
    this.$getLongestLine = function() {
      var d = this.doc.getScreenWidth();
      if(this.$showInvisibles) {
        d += 1
      }return Math.max(this.$size.scrollerWidth - this.$padding * 2, Math.round(d * this.characterWidth))
    };
    this.addMarker = function(d, n, o) {
      d = this.$markerLayer.addMarker(d, n, o);
      this.$loop.schedule(this.CHANGE_MARKER);
      return d
    };
    this.removeMarker = function(d) {
      this.$markerLayer.removeMarker(d);
      this.$loop.schedule(this.CHANGE_MARKER)
    };
    this.addGutterDecoration = function(d, n) {
      this.$gutterLayer.addGutterDecoration(d, n);
      this.$loop.schedule(this.CHANGE_GUTTER)
    };
    this.removeGutterDecoration = function(d, n) {
      this.$gutterLayer.removeGutterDecoration(d, n);
      this.$loop.schedule(this.CHANGE_GUTTER)
    };
    this.setBreakpoints = function(d) {
      this.$gutterLayer.setBreakpoints(d);
      this.$loop.schedule(this.CHANGE_GUTTER)
    };
    this.updateCursor = function(d, n) {
      this.$cursorLayer.setCursor(d, n);
      this.$loop.schedule(this.CHANGE_CURSOR)
    };
    this.hideCursor = function() {
      this.$cursorLayer.hideCursor()
    };
    this.showCursor = function() {
      this.$cursorLayer.showCursor()
    };
    this.scrollCursorIntoView = function() {
      var d = this.$cursorLayer.getPixelPosition(), n = d.left + this.$padding;
      d = d.top;
      this.getScrollTop() > d && this.scrollToY(d);
      this.getScrollTop() + this.$size.scrollerHeight < d + this.lineHeight && this.scrollToY(d + this.lineHeight - this.$size.scrollerHeight);
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
    this.scrollToRow = function(d) {
      this.scrollToY(d * this.lineHeight)
    };
    this.scrollToY = function(d) {
      d = Math.max(0, Math.min(this.lines.length * this.lineHeight - this.$size.scrollerHeight, d));
      if(this.scrollTop !== d) {
        this.scrollTop = d;
        this.$loop.schedule(this.CHANGE_SCROLL)
      }
    };
    this.scrollToX = function(d) {
      if(d <= this.$padding) {
        d = 0
      }this.scroller.scrollLeft = d
    };
    this.scrollBy = function(d, n) {
      n && this.scrollToY(this.scrollTop + n);
      d && this.scrollToX(this.scroller.scrollLeft + d)
    };
    this.screenToTextCoordinates = function(d, n) {
      var o = this.scroller.getBoundingClientRect();
      d = Math.round((d + this.scroller.scrollLeft - o.left - this.$padding) / this.characterWidth);
      n = Math.floor((n + this.scrollTop - o.top) / this.lineHeight);
      return{row:n, column:this.doc.screenToDocumentColumn(Math.max(0, Math.min(n, this.doc.getLength() - 1)), d)}
    };
    this.textToScreenCoordinates = function(d, n) {
      var o = this.scroller.getBoundingClientRect();
      n = this.padding + Math.round(this.doc.documentToScreenColumn(d, n) * this.characterWidth);
      d = d * this.lineHeight;
      return{pageX:o.left + n - this.getScrollLeft(), pageY:o.top + d - this.getScrollTop()}
    };
    this.visualizeFocus = function() {
      a.addCssClass(this.container, "ace_focus")
    };
    this.visualizeBlur = function() {
      a.removeCssClass(this.container, "ace_focus")
    };
    this.showComposition = function() {
    };
    this.setCompositionText = function() {
    };
    this.hideComposition = function() {
    };
    this.setTheme = function(d) {
      function n(p) {
        o.$theme && a.removeCssClass(o.container, o.$theme);
        o.$theme = p ? p.cssClass : null;
        o.$theme && a.addCssClass(o.container, o.$theme);
        if(o.$size) {
          o.$size.width = 0;
          o.onResize()
        }
      }
      var o = this;
      if(!d || typeof d == "string") {
        d = d || "ace/theme/TextMate";
        require([d], function(p) {
          n(p)
        })
      }else {
        n(d)
      }o = this
    }
  }).call(b.prototype);
  return b
});
require.def("ace/mode/DocCommentHighlightRules", ["ace/lib/oop", "ace/mode/TextHighlightRules"], function(k, f) {
  var a = function() {
    this.$rules = {start:[{token:"comment.doc", regex:"\\*\\/", next:"start"}, {token:"comment.doc.tag", regex:"@[\\w\\d_]+"}, {token:"comment.doc", regex:"s+"}, {token:"comment.doc", regex:"[^@\\*]+"}, {token:"comment.doc", regex:"."}]}
  };
  k.inherits(a, f);
  (function() {
    this.getStartRule = function(h) {
      return{token:"comment.doc", regex:"\\/\\*(?=\\*)", next:h}
    }
  }).call(a.prototype);
  return a
});
require.def("ace/mode/JavaScriptHighlightRules", ["ace/lib/oop", "ace/lib/lang", "ace/mode/DocCommentHighlightRules", "ace/mode/TextHighlightRules"], function(k, f, a, h) {
  JavaScriptHighlightRules = function() {
    var i = new a, e = f.arrayToMap("break|case|catch|continue|default|delete|do|else|finally|for|function|if|in|instanceof|new|return|switch|throw|try|typeof|var|while|with".split("|")), j = f.arrayToMap("true|false|null|undefined|Infinity|NaN|undefined".split("|")), c = f.arrayToMap("abstract|boolean|byte|char|class|const|enum|export|extends|final|float|goto|implements|int|interface|long|native|package|private|protected|short|static|super|synchronized|throws|transient|volatiledouble|import|public".split("|"));
    this.$rules = {start:[{token:"comment", regex:"\\/\\/.*$"}, i.getStartRule("doc-start"), {token:"comment", regex:"\\/\\*", next:"comment"}, {token:"string.regexp", regex:"[/](?:(?:\\[(?:\\\\]|[^\\]])+\\])|(?:\\\\/|[^\\]/]))*[/][gimy]*\\s*(?=[).,;]|$)"}, {token:"string", regex:'["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'}, {token:"string", regex:'["].*\\\\$', next:"qqstring"}, {token:"string", regex:"['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"}, {token:"string", regex:"['].*\\\\$", next:"qstring"}, {token:"constant.numeric", 
    regex:"0[xX][0-9a-fA-F]+\\b"}, {token:"constant.numeric", regex:"[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"}, {token:function(g) {
      return g == "this" ? "variable.language" : e[g] ? "keyword" : j[g] ? "constant.language" : c[g] ? "invalid.illegal" : g == "debugger" ? "invalid.deprecated" : "identifier"
    }, regex:"[a-zA-Z_$][a-zA-Z0-9_$]*\\b"}, {token:"keyword.operator", regex:"!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|\\b(in|instanceof|new|delete|typeof|void)"}, {token:"lparen", regex:"[\\[\\(\\{]"}, {token:"rparen", regex:"[\\]\\)\\}]"}, {token:"text", regex:"\\s+"}], comment:[{token:"comment", regex:".*?\\*\\/", next:"start"}, {token:"comment", regex:".+"}], qqstring:[{token:"string", regex:'(?:(?:\\\\.)|(?:[^"\\\\]))*?"', 
    next:"start"}, {token:"string", regex:".+"}], qstring:[{token:"string", regex:"(?:(?:\\\\.)|(?:[^'\\\\]))*?'", next:"start"}, {token:"string", regex:".+"}]};
    this.addRules(i.getRules(), "doc-");
    this.$rules["doc-start"][0].next = "start"
  };
  k.inherits(JavaScriptHighlightRules, h);
  return JavaScriptHighlightRules
});
require.def("ace/mode/MatchingBraceOutdent", ["ace/Range"], function(k) {
  var f = function() {
  };
  (function() {
    this.checkOutdent = function(a, h) {
      if(!/^\s+$/.test(a)) {
        return false
      }return/^\s*\}/.test(h)
    };
    this.autoOutdent = function(a, h) {
      var i = a.getLine(h).match(/^(\s*\})/);
      if(!i) {
        return 0
      }i = i[1].length;
      var e = a.findMatchingBracket({row:h, column:i});
      if(!e || e.row == h) {
        return 0
      }e = this.$getIndent(a.getLine(e.row));
      a.replace(new k(h, 0, h, i - 1), e);
      return e.length - (i - 1)
    };
    this.$getIndent = function(a) {
      if(a = a.match(/^(\s+)/)) {
        return a[1]
      }return""
    }
  }).call(f.prototype);
  return f
});
require.def("ace/mode/JavaScript", ["ace/lib/oop", "ace/mode/Text", "ace/Tokenizer", "ace/mode/JavaScriptHighlightRules", "ace/mode/MatchingBraceOutdent", "ace/Range"], function(k, f, a, h, i, e) {
  var j = function() {
    this.$tokenizer = new a((new h).getRules());
    this.$outdent = new i
  };
  k.inherits(j, f);
  (function() {
    this.toggleCommentLines = function(c, g, l) {
      var m = true;
      c = /^(\s*)\/\//;
      for(var b = l.start.row;b <= l.end.row;b++) {
        if(!c.test(g.getLine(b))) {
          m = false;
          break
        }
      }if(m) {
        m = new e(0, 0, 0, 0);
        for(b = l.start.row;b <= l.end.row;b++) {
          var d = g.getLine(b).replace(c, "$1");
          m.start.row = b;
          m.end.row = b;
          m.end.column = d.length + 2;
          g.replace(m, d)
        }return-2
      }else {
        return g.indentRows(l, "//")
      }
    };
    this.getNextLineIndent = function(c, g, l) {
      var m = this.$getIndent(g), b = this.$tokenizer.getLineTokens(g, c), d = b.tokens;
      b = b.state;
      if(d.length && d[d.length - 1].type == "comment") {
        return m
      }if(c == "start") {
        if(c = g.match(/^.*[\{\(\[]\s*$/)) {
          m += l
        }
      }else {
        if(c == "doc-start") {
          if(b == "start") {
            return""
          }if(c = g.match(/^\s*(\/?)\*/)) {
            if(c[1]) {
              m += " "
            }m += "* "
          }
        }
      }return m
    };
    this.checkOutdent = function(c, g, l) {
      return this.$outdent.checkOutdent(g, l)
    };
    this.autoOutdent = function(c, g, l) {
      return this.$outdent.autoOutdent(g, l)
    }
  }).call(j.prototype);
  return j
});
require.def("ace/theme/TextMate", ["ace/lib/dom", "text!ace/theme/tm.css!.ace-tm .ace_editor {\n  border: 2px solid rgb(159, 159, 159);\n}\n\n.ace-tm .ace_editor.ace_focus {\n  border: 2px solid #327fbd;\n}\n\n.ace-tm .ace_gutter {\n  width: 50px;\n  background: #e8e8e8;\n  color: #333;\n  overflow : hidden;\n}\n\n.ace-tm .ace_gutter-layer {\n  width: 100%;\n  text-align: right;\n}\n\n.ace-tm .ace_gutter-layer .ace_gutter-cell {\n  padding-right: 6px;\n}\n\n.ace-tm .ace_editor .ace_printMargin {\n  width: 1px;\n  background: #e8e8e8;\n}\n\n.ace-tm .ace_text-layer {\n  cursor: text;\n}\n\n.ace-tm .ace_cursor {\n  border-left: 2px solid black;\n}\n\n.ace-tm .ace_cursor.ace_overwrite {\n  border-left: 0px;\n  border-bottom: 1px solid black;\n}\n        \n.ace-tm .ace_line .ace_invisible {\n  color: rgb(191, 191, 191);\n}\n\n.ace-tm .ace_line .ace_keyword {\n  color: blue;\n}\n\n.ace-tm .ace_line .ace_constant.ace_buildin {\n  color: rgb(88, 72, 246);\n}\n\n.ace-tm .ace_line .ace_constant.ace_library {\n  color: rgb(6, 150, 14);\n}\n\n.ace-tm .ace_line .ace_invalid {\n  background-color: rgb(153, 0, 0);\n  color: white;\n}\n\n.ace-tm .ace_line .ace_support.ace_function {\n  color: rgb(60, 76, 114);\n}\n\n.ace-tm .ace_line .ace_keyword.ace_operator {\n  color: rgb(104, 118, 135);\n}\n\n.ace-tm .ace_line .ace_string {\n  color: rgb(3, 106, 7);\n}\n\n.ace-tm .ace_line .ace_comment {\n  color: rgb(76, 136, 107);\n}\n\n.ace-tm .ace_line .ace_comment.ace_doc {\n  color: rgb(0, 102, 255);\n}\n\n.ace-tm .ace_line .ace_comment.ace_doc.ace_tag {\n  color: rgb(128, 159, 191);\n}\n\n.ace-tm .ace_line .ace_constant.ace_numeric {\n  color: rgb(0, 0, 205);\n}\n\n.ace-tm .ace_line .ace_variable {\n  color: rgb(49, 132, 149);\n}\n\n.ace-tm .ace_line .ace_xml_pe {\n  color: rgb(104, 104, 91);\n}\n\n.ace-tm .ace_marker-layer .ace_selection {\n  background: rgb(181, 213, 255);\n}\n\n.ace-tm .ace_marker-layer .ace_step {\n  background: rgb(252, 255, 0);\n}\n\n.ace-tm .ace_marker-layer .ace_stack {\n  background: rgb(164, 229, 101);\n}\n\n.ace-tm .ace_marker-layer .ace_bracket {\n  margin: -1px 0 0 -1px;\n  border: 1px solid rgb(192, 192, 192);\n}\n\n.ace-tm .ace_marker-layer .ace_active_line {\n  background: rgb(232, 242, 254);\n}\n\n.ace-tm .ace_string.ace_regex {\n  color: rgb(255, 0, 0)   \n}"], 
function(k, f) {
  k.importCssString(f);
  return{cssClass:"ace-tm"}
});