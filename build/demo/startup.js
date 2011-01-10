define("pilot/useragent", ["require", "exports", "module"], function(require, exports) {
  var os = (navigator.platform.match(/mac|win|linux/i) || ["other"])[0].toLowerCase();
  var ua = navigator.userAgent;
  exports.isWin = os == "win";
  exports.isMac = os == "mac";
  exports.isLinux = os == "linux";
  exports.isIE = !+"\u000b1";
  exports.isGecko = exports.isMozilla = window.controllers && window.navigator.product === "Gecko";
  exports.isOpera = window.opera && Object.prototype.toString.call(window.opera) == "[object Opera]";
  exports.isWebKit = parseFloat(ua.split("WebKit/")[1]) || undefined;
  exports.isAIR = ua.indexOf("AdobeAIR") >= 0;
  exports.OS = {LINUX:"LINUX", MAC:"MAC", WINDOWS:"WINDOWS"};
  exports.getOS = function() {
    return exports.isMac ? exports.OS["MAC"] : exports.isLinux ? exports.OS["LINUX"] : exports.OS["WINDOWS"]
  }
});
define("pilot/event", ["require", "exports", "module", "pilot/useragent"], function(require$$1, exports$$1) {
  var useragent = require$$1("pilot/useragent");
  exports$$1.addListener = function(elem, type, callback) {
    if(elem.addEventListener) {
      return elem.addEventListener(type, callback, false)
    }if(elem.attachEvent) {
      var wrapper = function() {
        callback(window.event)
      };
      callback._wrapper = wrapper;
      elem.attachEvent("on" + type, wrapper)
    }
  };
  exports$$1.removeListener = function(elem$$1, type$$1, callback$$1) {
    if(elem$$1.removeEventListener) {
      return elem$$1.removeEventListener(type$$1, callback$$1, false)
    }if(elem$$1.detachEvent) {
      elem$$1.detachEvent("on" + type$$1, callback$$1._wrapper || callback$$1)
    }
  };
  exports$$1.stopEvent = function(e) {
    exports$$1.stopPropagation(e);
    exports$$1.preventDefault(e);
    return false
  };
  exports$$1.stopPropagation = function(e$$1) {
    if(e$$1.stopPropagation) {
      e$$1.stopPropagation()
    }else {
      e$$1.cancelBubble = true
    }
  };
  exports$$1.preventDefault = function(e$$2) {
    if(e$$2.preventDefault) {
      e$$2.preventDefault()
    }else {
      e$$2.returnValue = false
    }
  };
  exports$$1.getDocumentX = function(e$$3) {
    if(e$$3.clientX) {
      var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
      return e$$3.clientX + scrollLeft
    }else {
      return e$$3.pageX
    }
  };
  exports$$1.getDocumentY = function(e$$4) {
    if(e$$4.clientY) {
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      return e$$4.clientY + scrollTop
    }else {
      return e$$4.pageX
    }
  };
  exports$$1.getButton = function(e$$5) {
    return e$$5.preventDefault ? e$$5.button : Math.max(e$$5.button - 1, 2)
  };
  exports$$1.capture = document.documentElement.setCapture ? function(el, eventHandler, releaseCaptureHandler) {
    function onReleaseCapture(e$$7) {
      eventHandler && eventHandler(e$$7);
      releaseCaptureHandler && releaseCaptureHandler();
      exports$$1.removeListener(el, "mousemove", eventHandler);
      exports$$1.removeListener(el, "mouseup", onReleaseCapture);
      exports$$1.removeListener(el, "losecapture", onReleaseCapture);
      el.releaseCapture()
    }
    exports$$1.addListener(el, "mousemove", eventHandler);
    exports$$1.addListener(el, "mouseup", onReleaseCapture);
    exports$$1.addListener(el, "losecapture", onReleaseCapture);
    el.setCapture()
  } : function(el$$1, eventHandler$$1, releaseCaptureHandler$$1) {
    function onMouseMove$$1(e$$8) {
      eventHandler$$1(e$$8);
      e$$8.stopPropagation()
    }
    function onMouseUp(e$$9) {
      eventHandler$$1 && eventHandler$$1(e$$9);
      releaseCaptureHandler$$1 && releaseCaptureHandler$$1();
      document.removeEventListener("mousemove", onMouseMove$$1, true);
      document.removeEventListener("mouseup", onMouseUp, true);
      e$$9.stopPropagation()
    }
    document.addEventListener("mousemove", onMouseMove$$1, true);
    document.addEventListener("mouseup", onMouseUp, true)
  };
  exports$$1.addMouseWheelListener = function(el$$2, callback$$2) {
    var listener = function(e$$10) {
      if(e$$10.wheelDelta !== undefined) {
        if(e$$10.wheelDeltaX !== undefined) {
          e$$10.wheelX = -e$$10.wheelDeltaX / 8;
          e$$10.wheelY = -e$$10.wheelDeltaY / 8
        }else {
          e$$10.wheelX = 0;
          e$$10.wheelY = -e$$10.wheelDelta / 8
        }
      }else {
        if(e$$10.axis && e$$10.axis == e$$10.HORIZONTAL_AXIS) {
          e$$10.wheelX = (e$$10.detail || 0) * 5;
          e$$10.wheelY = 0
        }else {
          e$$10.wheelX = 0;
          e$$10.wheelY = (e$$10.detail || 0) * 5
        }
      }callback$$2(e$$10)
    };
    exports$$1.addListener(el$$2, "DOMMouseScroll", listener);
    exports$$1.addListener(el$$2, "mousewheel", listener)
  };
  exports$$1.addMultiMouseDownListener = function(el$$3, button, count, timeout, callback$$3) {
    var clicks = 0;
    var startX;
    var startY;
    var listener$$1 = function(e$$11) {
      clicks += 1;
      if(clicks == 1) {
        startX = e$$11.clientX;
        startY = e$$11.clientY;
        setTimeout(function() {
          clicks = 0
        }, timeout || 600)
      }if(exports$$1.getButton(e$$11) != button || Math.abs(e$$11.clientX - startX) > 5 || Math.abs(e$$11.clientY - startY) > 5) {
        clicks = 0
      }if(clicks == count) {
        clicks = 0;
        callback$$3(e$$11)
      }return exports$$1.preventDefault(e$$11)
    };
    exports$$1.addListener(el$$3, "mousedown", listener$$1);
    useragent.isIE && exports$$1.addListener(el$$3, "dblclick", listener$$1)
  };
  exports$$1.addKeyListener = function(el$$4, callback$$4) {
    var lastDown = null;
    exports$$1.addListener(el$$4, "keydown", function(e$$12) {
      lastDown = e$$12.keyIdentifier || e$$12.keyCode;
      return callback$$4(e$$12)
    });
    if(useragent.isMac && (useragent.isGecko || useragent.isOpera)) {
      exports$$1.addListener(el$$4, "keypress", function(e$$13) {
        var keyId = e$$13.keyIdentifier || e$$13.keyCode;
        if(lastDown !== keyId) {
          return callback$$4(e$$13)
        }else {
          lastDown = null
        }
      })
    }
  }
});
define("pilot/oop", ["require", "exports", "module"], function(require$$2, exports$$2) {
  exports$$2.inherits = function(ctor, superCtor) {
    var tempCtor = function() {
    };
    tempCtor.prototype = superCtor.prototype;
    ctor.super_ = superCtor.prototype;
    ctor.prototype = new tempCtor;
    ctor.prototype.constructor = ctor
  };
  exports$$2.mixin = function(obj, mixin) {
    for(var key in mixin) {
      obj[key] = mixin[key]
    }
  };
  exports$$2.implement = function(proto, mixin$$1) {
    exports$$2.mixin(proto, mixin$$1)
  }
});
define("pilot/lang", ["require", "exports", "module"], function(require$$3, exports$$3) {
  exports$$3.stringReverse = function(string) {
    return string.split("").reverse().join("")
  };
  exports$$3.stringRepeat = function(string$$1, count$$1) {
    return(new Array(count$$1 + 1)).join(string$$1)
  };
  exports$$3.copyObject = function(obj$$1) {
    var copy = {};
    for(var key$$1 in obj$$1) {
      copy[key$$1] = obj$$1[key$$1]
    }return copy
  };
  exports$$3.arrayToMap = function(arr) {
    var map = {};
    var i = 0;
    for(;i < arr.length;i++) {
      map[arr[i]] = 1
    }return map
  };
  exports$$3.arrayRemove = function(array, value) {
    var i$$1 = 0;
    for(;i$$1 <= array.length;i$$1++) {
      value === array[i$$1] && array.splice(i$$1, 1)
    }
  };
  exports$$3.escapeRegExp = function(str) {
    return str.replace(/([.*+?^${}()|[\]\/\\])/g, "\\$1")
  };
  exports$$3.deferredCall = function(fcn) {
    var timer = null;
    var callback$$5 = function() {
      timer = null;
      fcn()
    };
    return{schedule:function() {
      timer || (timer = setTimeout(callback$$5, 0))
    }, call:function() {
      this.cancel();
      fcn()
    }, cancel:function() {
      clearTimeout(timer);
      timer = null
    }}
  }
});
define("ace/textinput", ["require", "exports", "module", "pilot/event"], function(require$$4, exports$$4) {
  var event = require$$4("pilot/event");
  var TextInput = function(parentNode, host) {
    function sendText() {
      if(!copied) {
        var value$$1 = text.value;
        if(value$$1) {
          if(value$$1.charCodeAt(value$$1.length - 1) == PLACEHOLDER.charCodeAt(0)) {
            value$$1 = value$$1.slice(0, -1);
            value$$1 && host.onTextInput(value$$1)
          }else {
            host.onTextInput(value$$1)
          }
        }
      }copied = false;
      text.value = PLACEHOLDER;
      text.select()
    }
    var text = document.createElement("textarea");
    var style = text.style;
    style.position = "absolute";
    style.left = "-10000px";
    style.top = "-10000px";
    parentNode.appendChild(text);
    var PLACEHOLDER = String.fromCharCode(0);
    sendText();
    var inCompostion = false;
    var copied = false;
    var onTextInput = function() {
      setTimeout(function() {
        inCompostion || sendText()
      }, 0)
    };
    var onCompositionStart = function() {
      inCompostion = true;
      sendText();
      text.value = "";
      host.onCompositionStart();
      setTimeout(onCompositionUpdate, 0)
    };
    var onCompositionUpdate = function() {
      host.onCompositionUpdate(text.value)
    };
    var onCompositionEnd = function() {
      inCompostion = false;
      host.onCompositionEnd();
      onTextInput()
    };
    var onCopy = function() {
      copied = true;
      text.value = host.getCopyText();
      text.select();
      copied = true;
      setTimeout(sendText, 0)
    };
    var onCut = function() {
      copied = true;
      text.value = host.getCopyText();
      host.onCut();
      text.select();
      setTimeout(sendText, 0)
    };
    event.addListener(text, "keypress", onTextInput);
    event.addListener(text, "textInput", onTextInput);
    event.addListener(text, "paste", onTextInput);
    event.addListener(text, "propertychange", onTextInput);
    event.addListener(text, "copy", onCopy);
    event.addListener(text, "cut", onCut);
    event.addListener(text, "compositionstart", onCompositionStart);
    event.addListener(text, "compositionupdate", onCompositionUpdate);
    event.addListener(text, "compositionend", onCompositionEnd);
    event.addListener(text, "blur", function() {
      host.onBlur()
    });
    event.addListener(text, "focus", function() {
      host.onFocus();
      text.select()
    });
    this.focus = function() {
      host.onFocus();
      text.select();
      text.focus()
    };
    this.blur = function() {
      text.blur()
    }
  };
  exports$$4.TextInput = TextInput
});
define("ace/conf/keybindings/default_mac", ["require", "exports", "module"], function(require$$5, exports$$5) {
  exports$$5.bindings = {selectall:"Command-A", removeline:"Command-D", gotoline:"Command-L", togglecomment:"Command-7", findnext:"Command-K", findprevious:"Command-Shift-K", find:"Command-F", replace:"Command-R", undo:"Command-Z", redo:"Command-Shift-Z|Command-Y", overwrite:"Insert", copylinesup:"Command-Option-Up", movelinesup:"Option-Up", selecttostart:"Command-Shift-Up", gotostart:"Command-Home|Command-Up", selectup:"Shift-Up", golineup:"Up", copylinesdown:"Command-Option-Down", movelinesdown:"Option-Down", 
  selecttoend:"Command-Shift-Down", gotoend:"Command-End|Command-Down", selectdown:"Shift-Down", godown:"Down", selectwordleft:"Option-Shift-Left", gotowordleft:"Option-Left", selecttolinestart:"Command-Shift-Left", gotolinestart:"Command-Left|Home", selectleft:"Shift-Left", gotoleft:"Left", selectwordright:"Option-Shift-Right", gotowordright:"Option-Right", selecttolineend:"Command-Shift-Right", gotolineend:"Command-Right|End", selectright:"Shift-Right", gotoright:"Right", selectpagedown:"Shift-PageDown", 
  pagedown:"PageDown", selectpageup:"Shift-PageUp", pageup:"PageUp", selectlinestart:"Shift-Home", selectlineend:"Shift-End", del:"Delete", backspace:"Ctrl-Backspace|Command-Backspace|Option-Backspace|Backspace", outdent:"Shift-Tab", indent:"Tab"}
});
define("ace/conf/keybindings/default_win", ["require", "exports", "module"], function(require$$6, exports$$6) {
  exports$$6.bindings = {selectall:"Ctrl-A", removeline:"Ctrl-D", gotoline:"Ctrl-L", togglecomment:"Ctrl-7", findnext:"Ctrl-K", findprevious:"Ctrl-Shift-K", find:"Ctrl-F", replace:"Ctrl-R", undo:"Ctrl-Z", redo:"Ctrl-Shift-Z|Ctrl-Y", overwrite:"Insert", copylinesup:"Ctrl-Alt-Up", movelinesup:"Alt-Up", selecttostart:"Alt-Shift-Up", gotostart:"Ctrl-Home|Ctrl-Up", selectup:"Shift-Up", golineup:"Up", copylinesdown:"Ctrl-Alt-Down", movelinesdown:"Alt-Down", selecttoend:"Alt-Shift-Down", gotoend:"Ctrl-End|Ctrl-Down", 
  selectdown:"Shift-Down", godown:"Down", selectwordleft:"Ctrl-Shift-Left", gotowordleft:"Ctrl-Left", selecttolinestart:"Alt-Shift-Left", gotolinestart:"Alt-Left|Home", selectleft:"Shift-Left", gotoleft:"Left", selectwordright:"Ctrl-Shift-Right", gotowordright:"Ctrl-Right", selecttolineend:"Alt-Shift-Right", gotolineend:"Alt-Right|End", selectright:"Shift-Right", gotoright:"Right", selectpagedown:"Shift-PageDown", pagedown:"PageDown", selectpageup:"Shift-PageUp", pageup:"PageUp", selectlinestart:"Shift-Home", 
  selectlineend:"Shift-End", del:"Delete", backspace:"Backspace", outdent:"Shift-Tab", indent:"Tab"}
});
define("pilot/console", ["require", "exports", "module"], function(require$$7, exports$$7) {
  var noop = function() {
  };
  var NAMES = ["assert", "count", "debug", "dir", "dirxml", "error", "group", "groupEnd", "info", "log", "profile", "profileEnd", "time", "timeEnd", "trace", "warn"];
  typeof window === "undefined" ? NAMES.forEach(function(name) {
    exports$$7[name] = function() {
      var args = Array.prototype.slice.call(arguments);
      var msg = {op:"log", method:name, args:args};
      postMessage(JSON.stringify(msg))
    }
  }) : NAMES.forEach(function(name$$1) {
    exports$$7[name$$1] = window.console && window.console[name$$1] ? Function.prototype.bind.call(window.console[name$$1], window.console) : noop
  })
});
define("pilot/stacktrace", ["require", "exports", "module", "pilot/useragent", "pilot/console"], function(require$$8, exports$$8) {
  function stringifyArguments(args$$1) {
    var i$$2 = 0;
    for(;i$$2 < args$$1.length;++i$$2) {
      var argument = args$$1[i$$2];
      if(typeof argument == "object") {
        args$$1[i$$2] = "#object"
      }else {
        if(typeof argument == "function") {
          args$$1[i$$2] = "#function"
        }else {
          if(typeof argument == "string") {
            args$$1[i$$2] = '"' + argument + '"'
          }
        }
      }
    }return args$$1.join(",")
  }
  function NameGuesser() {
  }
  var ua$$1 = require$$8("pilot/useragent");
  var console = require$$8("pilot/console");
  var mode = function() {
    return ua$$1.isGecko ? "firefox" : ua$$1.isOpera ? "opera" : "other"
  }();
  var decoders = {chrome:function(e$$17) {
    var stack = e$$17.stack;
    if(!stack) {
      console.log(e$$17);
      return[]
    }return stack.replace(/^.*?\n/, "").replace(/^.*?\n/, "").replace(/^.*?\n/, "").replace(/^[^\(]+?[\n$]/gm, "").replace(/^\s+at\s+/gm, "").replace(/^Object.<anonymous>\s*\(/gm, "{anonymous}()@").split("\n")
  }, firefox:function(e$$18) {
    var stack$$1 = e$$18.stack;
    if(!stack$$1) {
      console.log(e$$18);
      return[]
    }stack$$1 = stack$$1.replace(/(?:\n@:0)?\s+$/m, "");
    stack$$1 = stack$$1.replace(/^\(/gm, "{anonymous}(");
    return stack$$1.split("\n")
  }, opera:function(e$$19) {
    var lines = e$$19.message.split("\n");
    var ANON = "{anonymous}";
    var lineRE = /Line\s+(\d+).*?script\s+(http\S+)(?:.*?in\s+function\s+(\S+))?/i;
    var i$$3;
    var j;
    var len;
    i$$3 = 4;
    j = 0;
    len = lines.length;
    for(;i$$3 < len;i$$3 += 2) {
      if(lineRE.test(lines[i$$3])) {
        lines[j++] = (RegExp.$3 ? RegExp.$3 + "()@" + RegExp.$2 + RegExp.$1 : ANON + "()@" + RegExp.$2 + ":" + RegExp.$1) + " -- " + lines[i$$3 + 1].replace(/^\s+/, "")
      }
    }lines.splice(j, lines.length - j);
    return lines
  }, other:function(curr) {
    var ANON$$1 = "{anonymous}";
    var fnRE = /function\s*([\w\-$]+)?\s*\(/i;
    var stack$$2 = [];
    var j$$1 = 0;
    var fn;
    var args$$2;
    var maxStackSize = 10;
    for(;curr && stack$$2.length < maxStackSize;) {
      fn = fnRE.test(curr.toString()) ? RegExp.$1 || ANON$$1 : ANON$$1;
      args$$2 = Array.prototype.slice.call(curr["arguments"]);
      stack$$2[j$$1++] = fn + "(" + stringifyArguments(args$$2) + ")";
      if(curr === curr.caller && window.opera) {
        break
      }curr = curr.caller
    }return stack$$2
  }};
  NameGuesser.prototype = {sourceCache:{}, ajax:function(url) {
    var req = this.createXMLHTTPObject();
    if(!req) {
      return
    }req.open("GET", url, false);
    req.setRequestHeader("User-Agent", "XMLHTTP/1.0");
    req.send("");
    return req.responseText
  }, createXMLHTTPObject:function() {
    var xmlhttp;
    var XMLHttpFactories = [function() {
      return new XMLHttpRequest
    }, function() {
      return new ActiveXObject("Msxml2.XMLHTTP")
    }, function() {
      return new ActiveXObject("Msxml3.XMLHTTP")
    }, function() {
      return new ActiveXObject("Microsoft.XMLHTTP")
    }];
    var i$$4 = 0;
    for(;i$$4 < XMLHttpFactories.length;i$$4++) {
      try {
        xmlhttp = XMLHttpFactories[i$$4]();
        this.createXMLHTTPObject = XMLHttpFactories[i$$4];
        return xmlhttp
      }catch(e$$20) {
      }
    }
  }, getSource:function(url$$1) {
    url$$1 in this.sourceCache || (this.sourceCache[url$$1] = this.ajax(url$$1).split("\n"));
    return this.sourceCache[url$$1]
  }, guessFunctions:function(stack$$3) {
    var i$$5 = 0;
    for(;i$$5 < stack$$3.length;++i$$5) {
      var reStack = /{anonymous}\(.*\)@(\w+:\/\/([-\w\.]+)+(:\d+)?[^:]+):(\d+):?(\d+)?/;
      var frame = stack$$3[i$$5];
      var m = reStack.exec(frame);
      if(m) {
        var file = m[1];
        var lineno = m[4];
        if(file && lineno) {
          var functionName = this.guessFunctionName(file, lineno);
          stack$$3[i$$5] = frame.replace("{anonymous}", functionName)
        }
      }
    }return stack$$3
  }, guessFunctionName:function(url$$2, lineNo) {
    try {
      return this.guessFunctionNameFromLines(lineNo, this.getSource(url$$2))
    }catch(e$$21) {
      return"getSource failed with url: " + url$$2 + ", exception: " + e$$21.toString()
    }
  }, guessFunctionNameFromLines:function(lineNo$$1, source) {
    var reFunctionArgNames = /function ([^(]*)\(([^)]*)\)/;
    var reGuessFunction = /['"]?([0-9A-Za-z_]+)['"]?\s*[:=]\s*(function|eval|new Function)/;
    var line = "";
    var maxLines = 10;
    var i$$6 = 0;
    for(;i$$6 < maxLines;++i$$6) {
      line = source[lineNo$$1 - i$$6] + line;
      if(line !== undefined) {
        var m$$1 = reGuessFunction.exec(line);
        if(m$$1) {
          return m$$1[1]
        }else {
          m$$1 = reFunctionArgNames.exec(line)
        }if(m$$1 && m$$1[1]) {
          return m$$1[1]
        }
      }
    }return"(?)"
  }};
  var guesser = new NameGuesser;
  var frameIgnorePatterns = [/http:\/\/localhost:4020\/sproutcore.js:/];
  exports$$8.ignoreFramesMatching = function(regex) {
    frameIgnorePatterns.push(regex)
  };
  exports$$8.Trace = function(ex, guess) {
    this._ex = ex;
    this._stack = decoders[mode](ex);
    if(guess) {
      this._stack = guesser.guessFunctions(this._stack)
    }
  };
  exports$$8.Trace.prototype.log = function(lines$$1) {
    if(lines$$1 <= 0) {
      lines$$1 = 999999999
    }var printed = 0;
    var i$$7 = 0;
    for(;i$$7 < this._stack.length && printed < lines$$1;i$$7++) {
      var frame$$1 = this._stack[i$$7];
      var display = true;
      frameIgnorePatterns.forEach(function(regex$$1) {
        if(regex$$1.test(frame$$1)) {
          display = false
        }
      });
      if(display) {
        console.debug(frame$$1);
        printed++
      }
    }
  }
});
define("pilot/event_emitter", ["require", "exports", "module"], function(require$$9, exports$$9) {
  var EventEmitter = {};
  EventEmitter._dispatchEvent = function(eventName, e$$22) {
    this._eventRegistry = this._eventRegistry || {};
    var listeners = this._eventRegistry[eventName];
    if(!listeners || !listeners.length) {
      return
    }e$$22 = e$$22 || {};
    e$$22.type = eventName;
    var i$$8 = 0;
    for(;i$$8 < listeners.length;i$$8++) {
      listeners[i$$8](e$$22)
    }
  };
  EventEmitter.on = EventEmitter.addEventListener = function(eventName$$1, callback$$6) {
    this._eventRegistry = this._eventRegistry || {};
    var listeners$$1 = this._eventRegistry[eventName$$1];
    listeners$$1 || (listeners$$1 = this._eventRegistry[eventName$$1] = []);
    listeners$$1.indexOf(callback$$6) == -1 && listeners$$1.push(callback$$6)
  };
  EventEmitter.removeEventListener = function(eventName$$2, callback$$7) {
    this._eventRegistry = this._eventRegistry || {};
    var listeners$$2 = this._eventRegistry[eventName$$2];
    if(!listeners$$2) {
      return
    }var index = listeners$$2.indexOf(callback$$7);
    index !== -1 && listeners$$2.splice(index, 1)
  };
  exports$$9.EventEmitter = EventEmitter
});
define("pilot/catalog", ["require", "exports", "module"], function(require$$10, exports$$10) {
  var extensionSpecs = {};
  exports$$10.addExtensionSpec = function(extensionSpec) {
    extensionSpecs[extensionSpec.name] = extensionSpec
  };
  exports$$10.removeExtensionSpec = function(extensionSpec$$1) {
    if(typeof extensionSpec$$1 === "string") {
      delete extensionSpecs[extensionSpec$$1]
    }else {
      delete extensionSpecs[extensionSpec$$1.name]
    }
  };
  exports$$10.getExtensionSpec = function(name$$2) {
    return extensionSpecs[name$$2]
  };
  exports$$10.getExtensionSpecs = function() {
    return Object.keys(extensionSpecs)
  }
});
define("pilot/types", ["require", "exports", "module"], function(require$$11, exports$$11) {
  function Conversion(value$$2, status, message, predictions) {
    this.value = value$$2;
    this.status = status || Status.VALID;
    this.message = message;
    this.predictions = predictions || []
  }
  function Type() {
  }
  function reconstituteType(name$$3, typeSpec) {
    var type$$2 = types[name$$3];
    if(typeof type$$2 === "function") {
      type$$2 = new type$$2(typeSpec)
    }return type$$2
  }
  var Status = {VALID:{toString:function() {
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
    var combined = Status.VALID;
    var i$$9 = 0;
    for(;i$$9 < arguments;i$$9++) {
      if(arguments[i$$9] > combined) {
        combined = arguments[i$$9]
      }
    }return combined
  }};
  exports$$11.Status = Status;
  exports$$11.Conversion = Conversion;
  Type.prototype = {stringify:function() {
    throw new Error("not implemented");
  }, parse:function() {
    throw new Error("not implemented");
  }, name:undefined, increment:function() {
    return
  }, decrement:function() {
    return
  }};
  exports$$11.Type = Type;
  var types = {};
  exports$$11.registerType = function(type$$3) {
    if(typeof type$$3 === "object") {
      if(type$$3 instanceof Type) {
        if(!type$$3.name) {
          throw new Error("All registered types must have a name");
        }types[type$$3.name] = type$$3
      }else {
        throw new Error("Can't registerType using: " + type$$3);
      }
    }else {
      if(typeof type$$3 === "function") {
        if(!type$$3.prototype.name) {
          throw new Error("All registered types must have a name");
        }types[type$$3.prototype.name] = type$$3
      }else {
        throw new Error("Unknown type: " + type$$3);
      }
    }
  };
  exports$$11.deregisterType = function(type$$4) {
    delete types[type$$4.name]
  };
  exports$$11.getType = function(typeSpec$$1) {
    if(typeof typeSpec$$1 === "string") {
      return reconstituteType(typeSpec$$1, typeSpec$$1)
    }if(typeof typeSpec$$1 == "object") {
      if(!typeSpec$$1.name) {
        throw new Error("Missing 'name' member to typeSpec");
      }return reconstituteType(typeSpec$$1.name, typeSpec$$1)
    }throw new Error("Can't extract type from " + typeSpec$$1);
  }
});
define("pilot/canon", ["require", "exports", "module", "pilot/console", "pilot/stacktrace", "pilot/oop", "pilot/event_emitter", "pilot/catalog", "pilot/types", "pilot/types", "pilot/lang"], function(require$$12, exports$$12) {
  function addCommand(command) {
    if(!command.name) {
      throw new Error("All registered commands must have a name");
    }if(command.params == null) {
      command.params = []
    }if(!Array.isArray(command.params)) {
      throw new Error("command.params must be an array in " + command.name);
    }command.params.forEach(function(param) {
      if(!param.name) {
        throw new Error("In " + command.name + ": all params must have a name");
      }upgradeType(command.name, param)
    }, this);
    commands[command.name] = command;
    commandNames.push(command.name);
    commandNames.sort()
  }
  function upgradeType(name$$4, param$$1) {
    var lookup = param$$1.type;
    param$$1.type = types$$1.getType(lookup);
    if(param$$1.type == null) {
      throw new Error("In " + name$$4 + "/" + param$$1.name + ": can't find type for: " + JSON.stringify(lookup));
    }
  }
  function removeCommand(command$$1) {
    var name$$5 = typeof command$$1 === "string" ? command$$1 : command$$1.name;
    delete commands[name$$5];
    lang.arrayRemove(commandNames, name$$5)
  }
  function getCommand(name$$6) {
    return commands[name$$6]
  }
  function getCommandNames() {
    return commandNames
  }
  function exec(command$$2, env, args$$3, typed) {
    if(typeof command$$2 === "string") {
      command$$2 = commands[command$$2]
    }if(!command$$2) {
      return false
    }var request = new Request({command:command$$2, args:args$$3, typed:typed});
    command$$2.exec(env, args$$3 || {}, request);
    return true
  }
  function Request(options) {
    options = options || {};
    this.command = options.command;
    this.args = options.args;
    this.typed = options.typed;
    this._begunOutput = false;
    this.start = new Date;
    this.end = null;
    this.completed = false;
    this.error = false
  }
  require$$12("pilot/console");
  require$$12("pilot/stacktrace").Trace;
  var oop = require$$12("pilot/oop");
  var EventEmitter$$1 = require$$12("pilot/event_emitter").EventEmitter;
  var catalog = require$$12("pilot/catalog");
  require$$12("pilot/types").Status;
  var types$$1 = require$$12("pilot/types");
  var lang = require$$12("pilot/lang");
  var commandExtensionSpec = {name:"command", description:"A command is a bit of functionality with optional typed arguments which can do something small like moving the cursor around the screen, or large like cloning a project from VCS.", indexOn:"name"};
  exports$$12.startup = function() {
    catalog.addExtensionSpec(commandExtensionSpec)
  };
  exports$$12.shutdown = function() {
    catalog.removeExtensionSpec(commandExtensionSpec)
  };
  var commands = {};
  var commandNames = [];
  exports$$12.removeCommand = removeCommand;
  exports$$12.addCommand = addCommand;
  exports$$12.getCommand = getCommand;
  exports$$12.getCommandNames = getCommandNames;
  exports$$12.exec = exec;
  exports$$12.upgradeType = upgradeType;
  oop.implement(exports$$12, EventEmitter$$1);
  var requests = [];
  var maxRequestLength = 100;
  oop.implement(Request.prototype, EventEmitter$$1);
  Request.prototype._beginOutput = function() {
    this._begunOutput = true;
    this.outputs = [];
    requests.push(this);
    for(;requests.length > maxRequestLength;) {
      requests.shiftObject()
    }exports$$12._dispatchEvent("output", {requests:requests, request:this})
  };
  Request.prototype.doneWithError = function(content) {
    this.error = true;
    this.done(content)
  };
  Request.prototype.async = function() {
    this._begunOutput || this._beginOutput()
  };
  Request.prototype.output = function(content$$1) {
    this._begunOutput || this._beginOutput();
    if(typeof content$$1 !== "string" && !(content$$1 instanceof Node)) {
      content$$1 = content$$1.toString()
    }this.outputs.push(content$$1);
    this._dispatchEvent("output", {});
    return this
  };
  Request.prototype.done = function(content$$2) {
    this.completed = true;
    this.end = new Date;
    this.duration = this.end.getTime() - this.start.getTime();
    content$$2 && this.output(content$$2);
    this._dispatchEvent("output", {})
  };
  exports$$12.Request = Request
});
define("ace/commands/default_commands", ["require", "exports", "module", "pilot/canon"], function(require$$13) {
  var canon = require$$13("pilot/canon");
  canon.addCommand({name:"selectall", exec:function(env$$2) {
    env$$2.editor.getSelection().selectAll()
  }});
  canon.addCommand({name:"removeline", exec:function(env$$3) {
    env$$3.editor.removeLines()
  }});
  canon.addCommand({name:"gotoline", exec:function(env$$4) {
    var line$$1 = parseInt(prompt("Enter line number:"));
    isNaN(line$$1) || env$$4.editor.gotoLine(line$$1)
  }});
  canon.addCommand({name:"togglecomment", exec:function(env$$5) {
    env$$5.editor.toggleCommentLines()
  }});
  canon.addCommand({name:"findnext", exec:function(env$$6) {
    env$$6.editor.findNext()
  }});
  canon.addCommand({name:"findprevious", exec:function(env$$7) {
    env$$7.editor.findPrevious()
  }});
  canon.addCommand({name:"find", exec:function(env$$8) {
    var needle = prompt("Find:");
    env$$8.editor.find(needle)
  }});
  canon.addCommand({name:"undo", exec:function(env$$9) {
    env$$9.editor.undo()
  }});
  canon.addCommand({name:"redo", exec:function(env$$10) {
    env$$10.editor.redo()
  }});
  canon.addCommand({name:"redo", exec:function(env$$11) {
    env$$11.editor.redo()
  }});
  canon.addCommand({name:"overwrite", exec:function(env$$12) {
    env$$12.editor.toggleOverwrite()
  }});
  canon.addCommand({name:"copylinesup", exec:function(env$$13) {
    env$$13.editor.copyLinesUp()
  }});
  canon.addCommand({name:"movelinesup", exec:function(env$$14) {
    env$$14.editor.moveLinesUp()
  }});
  canon.addCommand({name:"selecttostart", exec:function(env$$15) {
    env$$15.editor.getSelection().selectFileStart()
  }});
  canon.addCommand({name:"gotostart", exec:function(env$$16) {
    env$$16.editor.navigateFileStart()
  }});
  canon.addCommand({name:"selectup", exec:function(env$$17) {
    env$$17.editor.getSelection().selectUp()
  }});
  canon.addCommand({name:"golineup", exec:function(env$$18) {
    env$$18.editor.navigateUp()
  }});
  canon.addCommand({name:"copylinesdown", exec:function(env$$19) {
    env$$19.editor.copyLinesDown()
  }});
  canon.addCommand({name:"movelinesdown", exec:function(env$$20) {
    env$$20.editor.moveLinesDown()
  }});
  canon.addCommand({name:"selecttoend", exec:function(env$$21) {
    env$$21.editor.getSelection().selectFileEnd()
  }});
  canon.addCommand({name:"gotoend", exec:function(env$$22) {
    env$$22.editor.navigateFileEnd()
  }});
  canon.addCommand({name:"selectdown", exec:function(env$$23) {
    env$$23.editor.getSelection().selectDown()
  }});
  canon.addCommand({name:"godown", exec:function(env$$24) {
    env$$24.editor.navigateDown()
  }});
  canon.addCommand({name:"selectwordleft", exec:function(env$$25) {
    env$$25.editor.getSelection().selectWordLeft()
  }});
  canon.addCommand({name:"gotowordleft", exec:function(env$$26) {
    env$$26.editor.navigateWordLeft()
  }});
  canon.addCommand({name:"selecttolinestart", exec:function(env$$27) {
    env$$27.editor.getSelection().selectLineStart()
  }});
  canon.addCommand({name:"gotolinestart", exec:function(env$$28) {
    env$$28.editor.navigateLineStart()
  }});
  canon.addCommand({name:"selectleft", exec:function(env$$29) {
    env$$29.editor.getSelection().selectLeft()
  }});
  canon.addCommand({name:"gotoleft", exec:function(env$$30) {
    env$$30.editor.navigateLeft()
  }});
  canon.addCommand({name:"selectwordright", exec:function(env$$31) {
    env$$31.editor.getSelection().selectWordRight()
  }});
  canon.addCommand({name:"gotowordright", exec:function(env$$32) {
    env$$32.editor.navigateWordRight()
  }});
  canon.addCommand({name:"selecttolineend", exec:function(env$$33) {
    env$$33.editor.getSelection().selectLineEnd()
  }});
  canon.addCommand({name:"gotolineend", exec:function(env$$34) {
    env$$34.editor.navigateLineEnd()
  }});
  canon.addCommand({name:"selectright", exec:function(env$$35) {
    env$$35.editor.getSelection().selectRight()
  }});
  canon.addCommand({name:"gotoright", exec:function(env$$36) {
    env$$36.editor.navigateRight()
  }});
  canon.addCommand({name:"selectpagedown", exec:function(env$$37) {
    env$$37.editor.selectPageDown()
  }});
  canon.addCommand({name:"pagedown", exec:function(env$$38) {
    env$$38.editor.scrollPageDown()
  }});
  canon.addCommand({name:"gotopagedown", exec:function(env$$39) {
    env$$39.editor.gotoPageDown()
  }});
  canon.addCommand({name:"selectpageup", exec:function(env$$40) {
    env$$40.editor.selectPageUp()
  }});
  canon.addCommand({name:"pageup", exec:function(env$$41) {
    env$$41.editor.scrollPageUp()
  }});
  canon.addCommand({name:"gotopageup", exec:function(env$$42) {
    env$$42.editor.gotoPageUp()
  }});
  canon.addCommand({name:"selectlinestart", exec:function(env$$43) {
    env$$43.editor.getSelection().selectLineStart()
  }});
  canon.addCommand({name:"gotolinestart", exec:function(env$$44) {
    env$$44.editor.navigateLineStart()
  }});
  canon.addCommand({name:"selectlineend", exec:function(env$$45) {
    env$$45.editor.getSelection().selectLineEnd()
  }});
  canon.addCommand({name:"gotolineend", exec:function(env$$46) {
    env$$46.editor.navigateLineEnd()
  }});
  canon.addCommand({name:"del", exec:function(env$$47) {
    env$$47.editor.removeRight()
  }});
  canon.addCommand({name:"backspace", exec:function(env$$48) {
    env$$48.editor.removeLeft()
  }});
  canon.addCommand({name:"outdent", exec:function(env$$49) {
    env$$49.editor.blockOutdent()
  }});
  canon.addCommand({name:"indent", exec:function(env$$50) {
    env$$50.editor.indent()
  }})
});
define("ace/keybinding", ["require", "exports", "module", "pilot/useragent", "pilot/event", "ace/conf/keybindings/default_mac", "ace/conf/keybindings/default_win", "pilot/canon", "ace/commands/default_commands"], function(require$$14, exports$$14) {
  var useragent$$1 = require$$14("pilot/useragent");
  var event$$1 = require$$14("pilot/event");
  var default_mac = require$$14("ace/conf/keybindings/default_mac").bindings;
  var default_win = require$$14("ace/conf/keybindings/default_win").bindings;
  var canon$$1 = require$$14("pilot/canon");
  require$$14("ace/commands/default_commands");
  var KeyBinding = function(element, editor, config) {
    this.setConfig(config);
    var _self = this;
    event$$1.addKeyListener(element, function(e$$23) {
      var hashId = useragent$$1.isOpera && useragent$$1.isMac ? 0 | (e$$23.metaKey ? 1 : 0) | (e$$23.altKey ? 2 : 0) | (e$$23.shiftKey ? 4 : 0) | (e$$23.ctrlKey ? 8 : 0) : 0 | (e$$23.ctrlKey ? 1 : 0) | (e$$23.altKey ? 2 : 0) | (e$$23.shiftKey ? 4 : 0) | (e$$23.metaKey ? 8 : 0);
      var key$$2 = _self.keyNames[e$$23.keyCode];
      var commandName = (_self.config.reverse[hashId] || {})[(key$$2 || String.fromCharCode(e$$23.keyCode)).toLowerCase()];
      var success = canon$$1.exec(commandName, {editor:editor});
      if(success) {
        return event$$1.stopEvent(e$$23)
      }
    })
  };
  (function() {
    function splitSafe(s, separator, limit, bLowerCase) {
      return(bLowerCase && s.toLowerCase() || s).replace(/(?:^\s+|\n|\s+$)/g, "").split(new RegExp("[\\s ]*" + separator + "[\\s ]*", "g"), limit || 999)
    }
    function parseKeys(keys, val, ret) {
      var key$$3;
      var hashId$$1 = 0;
      var parts = splitSafe(keys, "\\-", null, true);
      var i$$10 = 0;
      var l = parts.length;
      for(;i$$10 < l;++i$$10) {
        if(this.keyMods[parts[i$$10]]) {
          hashId$$1 |= this.keyMods[parts[i$$10]]
        }else {
          key$$3 = parts[i$$10] || "-"
        }
      }(ret[hashId$$1] || (ret[hashId$$1] = {}))[key$$3] = val;
      return ret
    }
    function objectReverse(obj$$2, keySplit) {
      var i$$11;
      var j$$2;
      var l$$1;
      var key$$4;
      var ret$$1 = {};
      for(i$$11 in obj$$2) {
        key$$4 = obj$$2[i$$11];
        if(keySplit && typeof key$$4 == "string") {
          key$$4 = key$$4.split(keySplit);
          j$$2 = 0;
          l$$1 = key$$4.length;
          for(;j$$2 < l$$1;++j$$2) {
            parseKeys.call(this, key$$4[j$$2], i$$11, ret$$1)
          }
        }else {
          parseKeys.call(this, key$$4, i$$11, ret$$1)
        }
      }return ret$$1
    }
    this.keyMods = {ctrl:1, alt:2, option:2, shift:4, meta:8, command:8};
    this.keyNames = {"8":"Backspace", "9":"Tab", "13":"Enter", "27":"Esc", "32":"Space", "33":"PageUp", "34":"PageDown", "35":"End", "36":"Home", "37":"Left", "38":"Up", "39":"Right", "40":"Down", "45":"Insert", "46":"Delete", "107":"+", "112":"F1", "113":"F2", "114":"F3", "115":"F4", "116":"F5", "117":"F6", "118":"F7", "119":"F8", "120":"F9", "121":"F10", "122":"F11", "123":"F12"};
    this.setConfig = function(config$$1) {
      this.config = config$$1 || (useragent$$1.isMac ? default_mac : default_win);
      if(typeof this.config.reverse == "undefined") {
        this.config.reverse = objectReverse.call(this, this.config, "|")
      }
    }
  }).call(KeyBinding.prototype);
  exports$$14.KeyBinding = KeyBinding
});
define("ace/range", ["require", "exports", "module"], function(require$$15, exports$$15) {
  var Range = function(startRow, startColumn, endRow, endColumn) {
    this.start = {row:startRow, column:startColumn};
    this.end = {row:endRow, column:endColumn}
  };
  (function() {
    this.toString = function() {
      return"Range: [" + this.start.row + "/" + this.start.column + "] -> [" + this.end.row + "/" + this.end.column + "]"
    };
    this.contains = function(row, column) {
      return this.compare(row, column) == 0
    };
    this.compare = function(row$$1, column$$1) {
      if(!this.isMultiLine()) {
        if(row$$1 === this.start.row) {
          return column$$1 < this.start.column ? -1 : column$$1 > this.end.column ? 1 : 0
        }
      }if(row$$1 < this.start.row) {
        return-1
      }if(row$$1 > this.end.row) {
        return 1
      }if(this.start.row === row$$1) {
        return column$$1 >= this.start.column ? 0 : -1
      }if(this.end.row === row$$1) {
        return column$$1 <= this.end.column ? 0 : 1
      }return 0
    };
    this.clipRows = function(firstRow, lastRow) {
      if(this.end.row > lastRow) {
        var end = {row:lastRow + 1, column:0}
      }if(this.start.row > lastRow) {
        var start = {row:lastRow + 1, column:0}
      }if(this.start.row < firstRow) {
        start = {row:firstRow, column:0}
      }if(this.end.row < firstRow) {
        end = {row:firstRow, column:0}
      }return Range.fromPoints(start || this.start, end || this.end)
    };
    this.extend = function(row$$2, column$$2) {
      var cmp = this.compare(row$$2, column$$2);
      if(cmp == 0) {
        return this
      }else {
        if(cmp == -1) {
          var start$$1 = {row:row$$2, column:column$$2}
        }else {
          var end$$1 = {row:row$$2, column:column$$2}
        }
      }return Range.fromPoints(start$$1 || this.start, end$$1 || this.end)
    };
    this.isEmpty = function() {
      return this.start.row == this.end.row && this.start.column == this.end.column
    };
    this.isMultiLine = function() {
      return this.start.row !== this.end.row
    };
    this.clone = function() {
      return Range.fromPoints(this.start, this.end)
    };
    this.collapseRows = function() {
      return this.end.column == 0 ? new Range(this.start.row, 0, Math.max(this.start.row, this.end.row - 1), 0) : new Range(this.start.row, 0, this.end.row, 0)
    };
    this.toScreenRange = function(doc) {
      return new Range(this.start.row, doc.documentToScreenColumn(this.start.row, this.start.column), this.end.row, doc.documentToScreenColumn(this.end.row, this.end.column))
    }
  }).call(Range.prototype);
  Range.fromPoints = function(start$$2, end$$2) {
    return new Range(start$$2.row, start$$2.column, end$$2.row, end$$2.column)
  };
  exports$$15.Range = Range
});
define("ace/selection", ["require", "exports", "module", "pilot/oop", "pilot/lang", "pilot/event_emitter", "ace/range"], function(require$$16, exports$$16) {
  var oop$$1 = require$$16("pilot/oop");
  var lang$$1 = require$$16("pilot/lang");
  var EventEmitter$$2 = require$$16("pilot/event_emitter").EventEmitter;
  var Range$$1 = require$$16("ace/range").Range;
  var Selection = function(doc$$1) {
    this.doc = doc$$1;
    this.clearSelection();
    this.selectionLead = {row:0, column:0}
  };
  (function() {
    oop$$1.implement(this, EventEmitter$$2);
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
    this.setSelectionAnchor = function(row$$3, column$$3) {
      var anchor = this.$clipPositionToDocument(row$$3, column$$3);
      if(this.selectionAnchor) {
        if(this.selectionAnchor.row !== anchor.row || this.selectionAnchor.column !== anchor.column) {
          this.selectionAnchor = anchor;
          this._dispatchEvent("changeSelection", {})
        }
      }else {
        this.selectionAnchor = anchor;
        this._dispatchEvent("changeSelection", {})
      }
    };
    this.getSelectionAnchor = function() {
      return this.selectionAnchor ? this.$clone(this.selectionAnchor) : this.$clone(this.selectionLead)
    };
    this.getSelectionLead = function() {
      return this.$clone(this.selectionLead)
    };
    this.shiftSelection = function(columns) {
      if(this.isEmpty()) {
        this.moveCursorTo(this.selectionLead.row, this.selectionLead.column + columns);
        return
      }var anchor$$1 = this.getSelectionAnchor();
      var lead = this.getSelectionLead();
      var isBackwards = this.isBackwards();
      if(!isBackwards || anchor$$1.column !== 0) {
        this.setSelectionAnchor(anchor$$1.row, anchor$$1.column + columns)
      }if(isBackwards || lead.column !== 0) {
        this.$moveSelection(function() {
          this.moveCursorTo(lead.row, lead.column + columns)
        })
      }
    };
    this.isBackwards = function() {
      var anchor$$2 = this.selectionAnchor || this.selectionLead;
      var lead$$1 = this.selectionLead;
      return anchor$$2.row > lead$$1.row || anchor$$2.row == lead$$1.row && anchor$$2.column > lead$$1.column
    };
    this.getRange = function() {
      var anchor$$3 = this.selectionAnchor || this.selectionLead;
      var lead$$2 = this.selectionLead;
      return this.isBackwards() ? Range$$1.fromPoints(lead$$2, anchor$$3) : Range$$1.fromPoints(anchor$$3, lead$$2)
    };
    this.clearSelection = function() {
      if(this.selectionAnchor) {
        this.selectionAnchor = null;
        this._dispatchEvent("changeSelection", {})
      }
    };
    this.selectAll = function() {
      var lastRow$$1 = this.doc.getLength() - 1;
      this.setSelectionAnchor(lastRow$$1, this.doc.getLine(lastRow$$1).length);
      if(!this.selectionAnchor) {
        this.selectionAnchor = this.$clone(this.selectionLead)
      }var cursor = {row:0, column:0};
      if(cursor.row !== this.selectionLead.row || cursor.column !== this.selectionLead.column) {
        this.selectionLead = cursor;
        this._dispatchEvent("changeSelection", {blockScrolling:true})
      }
    };
    this.setSelectionRange = function(range, reverse) {
      if(reverse) {
        this.setSelectionAnchor(range.end.row, range.end.column);
        this.selectTo(range.start.row, range.start.column)
      }else {
        this.setSelectionAnchor(range.start.row, range.start.column);
        this.selectTo(range.end.row, range.end.column)
      }
    };
    this.$moveSelection = function(mover) {
      var changed = false;
      if(!this.selectionAnchor) {
        changed = true;
        this.selectionAnchor = this.$clone(this.selectionLead)
      }var cursor$$1 = this.$clone(this.selectionLead);
      mover.call(this);
      if(cursor$$1.row !== this.selectionLead.row || cursor$$1.column !== this.selectionLead.column) {
        changed = true
      }changed && this._dispatchEvent("changeSelection", {})
    };
    this.selectTo = function(row$$4, column$$4) {
      this.$moveSelection(function() {
        this.moveCursorTo(row$$4, column$$4)
      })
    };
    this.selectToPosition = function(pos) {
      this.$moveSelection(function() {
        this.moveCursorToPosition(pos)
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
      var cursor$$2 = this.selectionLead;
      var column$$5 = cursor$$2.column;
      var range$$1 = this.doc.getWordRange(cursor$$2.row, column$$5);
      this.setSelectionRange(range$$1)
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
        var doc$$2 = this.doc;
        var tabSize = doc$$2.getTabSize();
        var cursor$$3 = this.selectionLead;
        doc$$2.isTabStop(cursor$$3) && doc$$2.getLine(cursor$$3.row).slice(cursor$$3.column - tabSize, cursor$$3.column).split(" ").length - 1 == tabSize ? this.moveCursorBy(0, -tabSize) : this.moveCursorBy(0, -1)
      }
    };
    this.moveCursorRight = function() {
      if(this.selectionLead.column == this.doc.getLine(this.selectionLead.row).length) {
        this.selectionLead.row < this.doc.getLength() - 1 && this.moveCursorTo(this.selectionLead.row + 1, 0)
      }else {
        var doc$$3 = this.doc;
        var tabSize$$1 = doc$$3.getTabSize();
        var cursor$$4 = this.selectionLead;
        doc$$3.isTabStop(cursor$$4) && doc$$3.getLine(cursor$$4.row).slice(cursor$$4.column, cursor$$4.column + tabSize$$1).split(" ").length - 1 == tabSize$$1 ? this.moveCursorBy(0, tabSize$$1) : this.moveCursorBy(0, 1)
      }
    };
    this.moveCursorLineStart = function() {
      var row$$5 = this.selectionLead.row;
      var column$$6 = this.selectionLead.column;
      var beforeCursor = this.doc.getLine(row$$5).slice(0, column$$6);
      var leadingSpace = beforeCursor.match(/^\s*/);
      if(leadingSpace[0].length == 0) {
        this.moveCursorTo(row$$5, this.doc.getLine(row$$5).match(/^\s*/)[0].length)
      }else {
        leadingSpace[0].length >= column$$6 ? this.moveCursorTo(row$$5, 0) : this.moveCursorTo(row$$5, leadingSpace[0].length)
      }
    };
    this.moveCursorLineEnd = function() {
      this.moveCursorTo(this.selectionLead.row, this.doc.getLine(this.selectionLead.row).length)
    };
    this.moveCursorFileEnd = function() {
      var row$$6 = this.doc.getLength() - 1;
      var column$$7 = this.doc.getLine(row$$6).length;
      this.moveCursorTo(row$$6, column$$7)
    };
    this.moveCursorFileStart = function() {
      this.moveCursorTo(0, 0)
    };
    this.moveCursorWordRight = function() {
      var row$$7 = this.selectionLead.row;
      var column$$8 = this.selectionLead.column;
      var line$$2 = this.doc.getLine(row$$7);
      var rightOfCursor = line$$2.substring(column$$8);
      var match;
      this.doc.nonTokenRe.lastIndex = 0;
      this.doc.tokenRe.lastIndex = 0;
      if(column$$8 == line$$2.length) {
        this.moveCursorRight();
        return
      }else {
        if(match = this.doc.nonTokenRe.exec(rightOfCursor)) {
          column$$8 += this.doc.nonTokenRe.lastIndex;
          this.doc.nonTokenRe.lastIndex = 0
        }else {
          if(match = this.doc.tokenRe.exec(rightOfCursor)) {
            column$$8 += this.doc.tokenRe.lastIndex;
            this.doc.tokenRe.lastIndex = 0
          }
        }
      }this.moveCursorTo(row$$7, column$$8)
    };
    this.moveCursorWordLeft = function() {
      var row$$8 = this.selectionLead.row;
      var column$$9 = this.selectionLead.column;
      var line$$3 = this.doc.getLine(row$$8);
      var leftOfCursor = lang$$1.stringReverse(line$$3.substring(0, column$$9));
      var match$$1;
      this.doc.nonTokenRe.lastIndex = 0;
      this.doc.tokenRe.lastIndex = 0;
      if(column$$9 == 0) {
        this.moveCursorLeft();
        return
      }else {
        if(match$$1 = this.doc.nonTokenRe.exec(leftOfCursor)) {
          column$$9 -= this.doc.nonTokenRe.lastIndex;
          this.doc.nonTokenRe.lastIndex = 0
        }else {
          if(match$$1 = this.doc.tokenRe.exec(leftOfCursor)) {
            column$$9 -= this.doc.tokenRe.lastIndex;
            this.doc.tokenRe.lastIndex = 0
          }
        }
      }this.moveCursorTo(row$$8, column$$9)
    };
    this.moveCursorBy = function(rows, chars) {
      this.moveCursorTo(this.selectionLead.row + rows, this.selectionLead.column + chars)
    };
    this.moveCursorToPosition = function(position) {
      this.moveCursorTo(position.row, position.column)
    };
    this.moveCursorTo = function(row$$9, column$$10) {
      var cursor$$5 = this.$clipPositionToDocument(row$$9, column$$10);
      if(cursor$$5.row !== this.selectionLead.row || cursor$$5.column !== this.selectionLead.column) {
        this.selectionLead = cursor$$5;
        this._dispatchEvent("changeCursor", {data:this.getCursor()})
      }
    };
    this.moveCursorUp = function() {
      this.moveCursorBy(-1, 0)
    };
    this.$clipPositionToDocument = function(row$$10, column$$11) {
      var pos$$1 = {};
      if(row$$10 >= this.doc.getLength()) {
        pos$$1.row = Math.max(0, this.doc.getLength() - 1);
        pos$$1.column = this.doc.getLine(pos$$1.row).length
      }else {
        if(row$$10 < 0) {
          pos$$1.row = 0;
          pos$$1.column = 0
        }else {
          pos$$1.row = row$$10;
          pos$$1.column = Math.min(this.doc.getLine(pos$$1.row).length, Math.max(0, column$$11))
        }
      }return pos$$1
    };
    this.$clone = function(pos$$2) {
      return{row:pos$$2.row, column:pos$$2.column}
    }
  }).call(Selection.prototype);
  exports$$16.Selection = Selection
});
define("ace/tokenizer", ["require", "exports", "module"], function(require$$17, exports$$17) {
  var Tokenizer = function(rules) {
    this.rules = rules;
    this.regExps = {};
    for(var key$$5 in this.rules) {
      var state = this.rules[key$$5];
      var ruleRegExps = [];
      var i$$12 = 0;
      for(;i$$12 < state.length;i$$12++) {
        ruleRegExps.push(state[i$$12].regex)
      }this.regExps[key$$5] = new RegExp("(?:(" + ruleRegExps.join(")|(") + ")|(.))", "g")
    }
  };
  (function() {
    this.getLineTokens = function(line$$4, startState) {
      var currentState = startState;
      var state$$1 = this.rules[currentState];
      var re = this.regExps[currentState];
      re.lastIndex = 0;
      var match$$2;
      var tokens = [];
      var lastIndex = 0;
      var token = {type:null, value:""};
      for(;match$$2 = re.exec(line$$4);) {
        var type$$5 = "text";
        var value$$6 = match$$2[0];
        if(re.lastIndex == lastIndex) {
          throw new Error("tokenizer error");
        }lastIndex = re.lastIndex;
        var i$$13 = 0;
        for(;i$$13 < state$$1.length;i$$13++) {
          if(match$$2[i$$13 + 1]) {
            type$$5 = typeof state$$1[i$$13].token == "function" ? state$$1[i$$13].token(match$$2[0]) : state$$1[i$$13].token;
            if(state$$1[i$$13].next && state$$1[i$$13].next !== currentState) {
              currentState = state$$1[i$$13].next;
              state$$1 = this.rules[currentState];
              lastIndex = re.lastIndex;
              re = this.regExps[currentState];
              re.lastIndex = lastIndex
            }break
          }
        }if(token.type !== type$$5) {
          token.type && tokens.push(token);
          token = {type:type$$5, value:value$$6}
        }else {
          token.value += value$$6
        }
      }token.type && tokens.push(token);
      return{tokens:tokens, state:currentState}
    }
  }).call(Tokenizer.prototype);
  exports$$17.Tokenizer = Tokenizer
});
define("ace/mode/text_highlight_rules", ["require", "exports", "module"], function(require$$18, exports$$18) {
  var TextHighlightRules = function() {
    this.$rules = {start:[{token:"text", regex:".+"}]}
  };
  (function() {
    this.addRules = function(rules$$1, prefix) {
      for(var key$$6 in rules$$1) {
        var state$$2 = rules$$1[key$$6];
        var i$$14 = 0;
        for(;i$$14 < state$$2.length;i$$14++) {
          var rule = state$$2[i$$14];
          rule.next = rule.next ? prefix + rule.next : prefix + key$$6
        }this.$rules[prefix + key$$6] = state$$2
      }
    };
    this.getRules = function() {
      return this.$rules
    }
  }).call(TextHighlightRules.prototype);
  exports$$18.TextHighlightRules = TextHighlightRules
});
define("ace/mode/text", ["require", "exports", "module", "ace/tokenizer", "ace/mode/text_highlight_rules"], function(require$$19, exports$$19) {
  var Tokenizer$$1 = require$$19("ace/tokenizer").Tokenizer;
  var TextHighlightRules$$1 = require$$19("ace/mode/text_highlight_rules").TextHighlightRules;
  var Mode = function() {
    this.$tokenizer = new Tokenizer$$1((new TextHighlightRules$$1).getRules())
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
    this.$getIndent = function(line$$7) {
      var match$$3 = line$$7.match(/^(\s+)/);
      if(match$$3) {
        return match$$3[1]
      }return""
    }
  }).call(Mode.prototype);
  exports$$19.Mode = Mode
});
define("ace/document", ["require", "exports", "module", "pilot/oop", "pilot/lang", "pilot/event_emitter", "ace/selection", "ace/mode/text", "ace/range"], function(require$$20, exports$$20) {
  var oop$$2 = require$$20("pilot/oop");
  var lang$$2 = require$$20("pilot/lang");
  var EventEmitter$$3 = require$$20("pilot/event_emitter").EventEmitter;
  var Selection$$1 = require$$20("ace/selection").Selection;
  var TextMode = require$$20("ace/mode/text").Mode;
  var Range$$2 = require$$20("ace/range").Range;
  var Document = function(text$$1, mode$$1) {
    this.modified = true;
    this.lines = [];
    this.selection = new Selection$$1(this);
    this.$breakpoints = [];
    this.listeners = [];
    mode$$1 && this.setMode(mode$$1);
    Array.isArray(text$$1) ? this.$insertLines(0, text$$1) : this.$insert({row:0, column:0}, text$$1)
  };
  (function() {
    oop$$2.implement(this, EventEmitter$$3);
    this.$undoManager = null;
    this.$split = function(text$$2) {
      return text$$2.split(/\r\n|\r|\n/)
    };
    this.setValue = function(text$$3) {
      var args$$54 = [0, this.lines.length];
      args$$54.push.apply(args$$54, this.$split(text$$3));
      this.lines.splice.apply(this.lines, args$$54);
      this.modified = true;
      this.fireChangeEvent(0)
    };
    this.toString = function() {
      return this.lines.join(this.$getNewLineCharacter())
    };
    this.getSelection = function() {
      return this.selection
    };
    this.fireChangeEvent = function(firstRow$$1, lastRow$$2) {
      var data$$2 = {firstRow:firstRow$$1, lastRow:lastRow$$2};
      this._dispatchEvent("change", {data:data$$2})
    };
    this.setUndoManager = function(undoManager) {
      this.$undoManager = undoManager;
      this.$deltas = [];
      this.$informUndoManager && this.$informUndoManager.cancel();
      if(undoManager) {
        var self = this;
        this.$informUndoManager = lang$$2.deferredCall(function() {
          self.$deltas.length > 0 && undoManager.execute({action:"aceupdate", args:[self.$deltas, self]});
          self.$deltas = []
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
      return this.getUseSoftTabs() ? lang$$2.stringRepeat(" ", this.getTabSize()) : "\t"
    };
    this.$useSoftTabs = true;
    this.setUseSoftTabs = function(useSoftTabs) {
      if(this.$useSoftTabs === useSoftTabs) {
        return
      }this.$useSoftTabs = useSoftTabs
    };
    this.getUseSoftTabs = function() {
      return this.$useSoftTabs
    };
    this.$tabSize = 4;
    this.setTabSize = function(tabSize$$2) {
      if(isNaN(tabSize$$2) || this.$tabSize === tabSize$$2) {
        return
      }this.modified = true;
      this.$tabSize = tabSize$$2;
      this._dispatchEvent("changeTabSize")
    };
    this.getTabSize = function() {
      return this.$tabSize
    };
    this.isTabStop = function(position$$1) {
      return this.$useSoftTabs && position$$1.column % this.$tabSize == 0
    };
    this.getBreakpoints = function() {
      return this.$breakpoints
    };
    this.setBreakpoints = function(rows$$1) {
      this.$breakpoints = [];
      var i$$15 = 0;
      for(;i$$15 < rows$$1.length;i$$15++) {
        this.$breakpoints[rows$$1[i$$15]] = true
      }this._dispatchEvent("changeBreakpoint", {})
    };
    this.clearBreakpoints = function() {
      this.$breakpoints = [];
      this._dispatchEvent("changeBreakpoint", {})
    };
    this.setBreakpoint = function(row$$12) {
      this.$breakpoints[row$$12] = true;
      this._dispatchEvent("changeBreakpoint", {})
    };
    this.clearBreakpoint = function(row$$13) {
      delete this.$breakpoints[row$$13];
      this._dispatchEvent("changeBreakpoint", {})
    };
    this.$detectNewLine = function(text$$4) {
      var match$$4 = text$$4.match(/^.*?(\r?\n)/m);
      this.$autoNewLine = match$$4 ? match$$4[1] : "\n"
    };
    this.tokenRe = /^[\w\d]+/g;
    this.nonTokenRe = /^[^\w\d]+/g;
    this.getWordRange = function(row$$14, column$$12) {
      var line$$8 = this.getLine(row$$14);
      var inToken = false;
      if(column$$12 > 0) {
        inToken = !!line$$8.charAt(column$$12 - 1).match(this.tokenRe)
      }inToken || (inToken = !!line$$8.charAt(column$$12).match(this.tokenRe));
      var re$$1 = inToken ? this.tokenRe : this.nonTokenRe;
      var start$$3 = column$$12;
      if(start$$3 > 0) {
        do {
          start$$3--
        }while(start$$3 >= 0 && line$$8.charAt(start$$3).match(re$$1));
        start$$3++
      }var end$$3 = column$$12;
      for(;end$$3 < line$$8.length && line$$8.charAt(end$$3).match(re$$1);) {
        end$$3++
      }return new Range$$2(row$$14, start$$3, row$$14, end$$3)
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
    this.setNewLineMode = function(newLineMode) {
      if(this.$newLineMode === newLineMode) {
        return
      }this.$newLineMode = newLineMode
    };
    this.getNewLineMode = function() {
      return this.$newLineMode
    };
    this.$mode = null;
    this.setMode = function(mode$$2) {
      if(this.$mode === mode$$2) {
        return
      }this.$mode = mode$$2;
      this._dispatchEvent("changeMode")
    };
    this.getMode = function() {
      if(!this.$mode) {
        this.$mode = new TextMode
      }return this.$mode
    };
    this.$scrollTop = 0;
    this.setScrollTopRow = function(scrollTopRow) {
      if(this.$scrollTop === scrollTopRow) {
        return
      }this.$scrollTop = scrollTopRow;
      this._dispatchEvent("changeScrollTop")
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
        var lines$$2 = this.lines;
        var longestLine = 0;
        var longestScreenLine = 0;
        var tabSize$$3 = this.getTabSize();
        var i$$16 = 0;
        for(;i$$16 < lines$$2.length;i$$16++) {
          var len$$1 = lines$$2[i$$16].length;
          longestLine = Math.max(longestLine, len$$1);
          lines$$2[i$$16].replace("\t", function(m$$2) {
            len$$1 += tabSize$$3 - 1;
            return m$$2
          });
          longestScreenLine = Math.max(longestScreenLine, len$$1)
        }this.width = longestLine;
        this.screenWidth = longestScreenLine
      }
    };
    this.getLine = function(row$$15) {
      return this.lines[row$$15] || ""
    };
    this.getDisplayLine = function(row$$16) {
      var tab$$1 = (new Array(this.getTabSize() + 1)).join(" ");
      return this.lines[row$$16].replace(/\t/g, tab$$1)
    };
    this.getLines = function(firstRow$$2, lastRow$$3) {
      return this.lines.slice(firstRow$$2, lastRow$$3 + 1)
    };
    this.getLength = function() {
      return this.lines.length
    };
    this.getTextRange = function(range$$2) {
      if(range$$2.start.row == range$$2.end.row) {
        return this.lines[range$$2.start.row].substring(range$$2.start.column, range$$2.end.column)
      }else {
        var lines$$3 = [];
        lines$$3.push(this.lines[range$$2.start.row].substring(range$$2.start.column));
        lines$$3.push.apply(lines$$3, this.getLines(range$$2.start.row + 1, range$$2.end.row - 1));
        lines$$3.push(this.lines[range$$2.end.row].substring(0, range$$2.end.column));
        return lines$$3.join(this.$getNewLineCharacter())
      }
    };
    this.findMatchingBracket = function(position$$2) {
      if(position$$2.column == 0) {
        return null
      }var charBeforeCursor = this.getLine(position$$2.row).charAt(position$$2.column - 1);
      if(charBeforeCursor == "") {
        return null
      }var match$$5 = charBeforeCursor.match(/([\(\[\{])|([\)\]\}])/);
      if(!match$$5) {
        return null
      }return match$$5[1] ? this.$findClosingBracket(match$$5[1], position$$2) : this.$findOpeningBracket(match$$5[2], position$$2)
    };
    this.$brackets = {")":"(", "(":")", "]":"[", "[":"]", "{":"}", "}":"{"};
    this.$findOpeningBracket = function(bracket, position$$3) {
      var openBracket = this.$brackets[bracket];
      var column$$13 = position$$3.column - 2;
      var row$$17 = position$$3.row;
      var depth = 1;
      var line$$9 = this.getLine(row$$17);
      for(;;) {
        for(;column$$13 >= 0;) {
          var ch = line$$9.charAt(column$$13);
          if(ch == openBracket) {
            depth -= 1;
            if(depth == 0) {
              return{row:row$$17, column:column$$13}
            }
          }else {
            if(ch == bracket) {
              depth += 1
            }
          }column$$13 -= 1
        }row$$17 -= 1;
        if(row$$17 < 0) {
          break
        }line$$9 = this.getLine(row$$17);
        column$$13 = line$$9.length - 1
      }return null
    };
    this.$findClosingBracket = function(bracket$$1, position$$4) {
      var closingBracket = this.$brackets[bracket$$1];
      var column$$14 = position$$4.column;
      var row$$18 = position$$4.row;
      var depth$$1 = 1;
      var line$$10 = this.getLine(row$$18);
      var lineCount = this.getLength();
      for(;;) {
        for(;column$$14 < line$$10.length;) {
          var ch$$1 = line$$10.charAt(column$$14);
          if(ch$$1 == closingBracket) {
            depth$$1 -= 1;
            if(depth$$1 == 0) {
              return{row:row$$18, column:column$$14}
            }
          }else {
            if(ch$$1 == bracket$$1) {
              depth$$1 += 1
            }
          }column$$14 += 1
        }row$$18 += 1;
        if(row$$18 >= lineCount) {
          break
        }line$$10 = this.getLine(row$$18);
        column$$14 = 0
      }return null
    };
    this.insert = function(position$$5, text$$5, fromUndo) {
      var end$$4 = this.$insert(position$$5, text$$5, fromUndo);
      this.fireChangeEvent(position$$5.row, position$$5.row == end$$4.row ? position$$5.row : undefined);
      return end$$4
    };
    this.multiRowInsert = function(rows$$2, column$$15, text$$6) {
      var lines$$4 = this.lines;
      var i$$17 = rows$$2.length - 1;
      for(;i$$17 >= 0;i$$17--) {
        var row$$19 = rows$$2[i$$17];
        if(row$$19 >= lines$$4.length) {
          continue
        }var diff = column$$15 - lines$$4[row$$19].length;
        if(diff > 0) {
          var padded = lang$$2.stringRepeat(" ", diff) + text$$6;
          var offset = -diff
        }else {
          padded = text$$6;
          offset = 0
        }var end$$5 = this.$insert({row:row$$19, column:column$$15 + offset}, padded, false)
      }if(end$$5) {
        this.fireChangeEvent(rows$$2[0], rows$$2[rows$$2.length - 1] + end$$5.row - rows$$2[0]);
        return{rows:end$$5.row - rows$$2[0], columns:end$$5.column - column$$15}
      }else {
        return{rows:0, columns:0}
      }
    };
    this.$insertLines = function(row$$20, lines$$5, fromUndo$$1) {
      if(lines$$5.length == 0) {
        return
      }var args$$55 = [row$$20, 0];
      args$$55.push.apply(args$$55, lines$$5);
      this.lines.splice.apply(this.lines, args$$55);
      if(!fromUndo$$1 && this.$undoManager) {
        var nl = this.$getNewLineCharacter();
        this.$deltas.push({action:"insertText", range:new Range$$2(row$$20, 0, row$$20 + lines$$5.length, 0), text:lines$$5.join(nl) + nl});
        this.$informUndoManager.schedule()
      }
    };
    this.$insert = function(position$$6, text$$7, fromUndo$$2) {
      if(text$$7.length == 0) {
        return position$$6
      }this.modified = true;
      this.lines.length <= 1 && this.$detectNewLine(text$$7);
      var newLines = this.$split(text$$7);
      if(this.$isNewLine(text$$7)) {
        var line$$11 = this.lines[position$$6.row] || "";
        this.lines[position$$6.row] = line$$11.substring(0, position$$6.column);
        this.lines.splice(position$$6.row + 1, 0, line$$11.substring(position$$6.column));
        var end$$6 = {row:position$$6.row + 1, column:0}
      }else {
        if(newLines.length == 1) {
          line$$11 = this.lines[position$$6.row] || "";
          this.lines[position$$6.row] = line$$11.substring(0, position$$6.column) + text$$7 + line$$11.substring(position$$6.column);
          end$$6 = {row:position$$6.row, column:position$$6.column + text$$7.length}
        }else {
          line$$11 = this.lines[position$$6.row] || "";
          var firstLine = line$$11.substring(0, position$$6.column) + newLines[0];
          var lastLine = newLines[newLines.length - 1] + line$$11.substring(position$$6.column);
          this.lines[position$$6.row] = firstLine;
          this.$insertLines(position$$6.row + 1, [lastLine], true);
          newLines.length > 2 && this.$insertLines(position$$6.row + 1, newLines.slice(1, -1), true);
          end$$6 = {row:position$$6.row + newLines.length - 1, column:newLines[newLines.length - 1].length}
        }
      }if(!fromUndo$$2 && this.$undoManager) {
        this.$deltas.push({action:"insertText", range:Range$$2.fromPoints(position$$6, end$$6), text:text$$7});
        this.$informUndoManager.schedule()
      }return end$$6
    };
    this.$isNewLine = function(text$$8) {
      return text$$8 == "\r\n" || text$$8 == "\r" || text$$8 == "\n"
    };
    this.remove = function(range$$3, fromUndo$$3) {
      if(range$$3.isEmpty()) {
        return range$$3.start
      }this.$remove(range$$3, fromUndo$$3);
      this.fireChangeEvent(range$$3.start.row, range$$3.isMultiLine() ? undefined : range$$3.start.row);
      return range$$3.start
    };
    this.multiRowRemove = function(rows$$3, range$$4) {
      if(range$$4.start.row !== rows$$3[0]) {
        throw new TypeError("range must start in the first row!");
      }var height = range$$4.end.row - rows$$3[0];
      var i$$18 = rows$$3.length - 1;
      for(;i$$18 >= 0;i$$18--) {
        var row$$21 = rows$$3[i$$18];
        if(row$$21 >= this.lines.length) {
          continue
        }var end$$7 = this.$remove(new Range$$2(row$$21, range$$4.start.column, row$$21 + height, range$$4.end.column), false)
      }if(end$$7) {
        height < 0 ? this.fireChangeEvent(rows$$3[0] + height, undefined) : this.fireChangeEvent(rows$$3[0], height == 0 ? rows$$3[rows$$3.length - 1] : undefined)
      }
    };
    this.$remove = function(range$$5, fromUndo$$4) {
      if(range$$5.isEmpty()) {
        return
      }if(!fromUndo$$4 && this.$undoManager) {
        this.$getNewLineCharacter();
        this.$deltas.push({action:"removeText", range:range$$5.clone(), text:this.getTextRange(range$$5)});
        this.$informUndoManager.schedule()
      }this.modified = true;
      var firstRow$$3 = range$$5.start.row;
      var lastRow$$4 = range$$5.end.row;
      var row$$22 = this.getLine(firstRow$$3).substring(0, range$$5.start.column) + this.getLine(lastRow$$4).substring(range$$5.end.column);
      row$$22 != "" ? this.lines.splice(firstRow$$3, lastRow$$4 - firstRow$$3 + 1, row$$22) : this.lines.splice(firstRow$$3, lastRow$$4 - firstRow$$3 + 1, "");
      return range$$5.start
    };
    this.undoChanges = function(deltas) {
      this.selection.clearSelection();
      var i$$19 = deltas.length - 1;
      for(;i$$19 >= 0;i$$19--) {
        var delta = deltas[i$$19];
        if(delta.action == "insertText") {
          this.remove(delta.range, true);
          this.selection.moveCursorToPosition(delta.range.start)
        }else {
          this.insert(delta.range.start, delta.text, true);
          this.selection.clearSelection()
        }
      }
    };
    this.redoChanges = function(deltas$$1) {
      this.selection.clearSelection();
      var i$$20 = 0;
      for(;i$$20 < deltas$$1.length;i$$20++) {
        var delta$$1 = deltas$$1[i$$20];
        if(delta$$1.action == "insertText") {
          this.insert(delta$$1.range.start, delta$$1.text, true);
          this.selection.setSelectionRange(delta$$1.range)
        }else {
          this.remove(delta$$1.range, true);
          this.selection.moveCursorToPosition(delta$$1.range.start)
        }
      }
    };
    this.replace = function(range$$6, text$$9) {
      this.$remove(range$$6);
      var end$$8 = text$$9 ? this.$insert(range$$6.start, text$$9) : range$$6.start;
      var lastRemoved = range$$6.end.column == 0 ? range$$6.end.column - 1 : range$$6.end.column;
      this.fireChangeEvent(range$$6.start.row, lastRemoved == end$$8.row ? lastRemoved : undefined);
      return end$$8
    };
    this.indentRows = function(startRow$$2, endRow$$2, indentString) {
      indentString = indentString.replace("\t", this.getTabString());
      var row$$23 = startRow$$2;
      for(;row$$23 <= endRow$$2;row$$23++) {
        this.$insert({row:row$$23, column:0}, indentString)
      }this.fireChangeEvent(startRow$$2, endRow$$2);
      return indentString.length
    };
    this.outdentRows = function(range$$7) {
      var rowRange = range$$7.collapseRows();
      var deleteRange = new Range$$2(0, 0, 0, 0);
      var size = this.getTabSize();
      var i$$21 = rowRange.start.row;
      for(;i$$21 <= rowRange.end.row;++i$$21) {
        var line$$12 = this.getLine(i$$21);
        deleteRange.start.row = i$$21;
        deleteRange.end.row = i$$21;
        var j$$3 = 0;
        for(;j$$3 < size;++j$$3) {
          if(line$$12.charAt(j$$3) != " ") {
            break
          }
        }if(j$$3 < size && line$$12.charAt(j$$3) == "\t") {
          deleteRange.start.column = j$$3;
          deleteRange.end.column = j$$3 + 1
        }else {
          deleteRange.start.column = 0;
          deleteRange.end.column = j$$3
        }if(i$$21 == range$$7.start.row) {
          range$$7.start.column -= deleteRange.end.column - deleteRange.start.column
        }if(i$$21 == range$$7.end.row) {
          range$$7.end.column -= deleteRange.end.column - deleteRange.start.column
        }this.$remove(deleteRange)
      }this.fireChangeEvent(range$$7.start.row, range$$7.end.row);
      return range$$7
    };
    this.moveLinesUp = function(firstRow$$4, lastRow$$5) {
      if(firstRow$$4 <= 0) {
        return 0
      }var removed = this.lines.slice(firstRow$$4, lastRow$$5 + 1);
      this.$remove(new Range$$2(firstRow$$4 - 1, this.lines[firstRow$$4 - 1].length, lastRow$$5, this.lines[lastRow$$5].length));
      this.$insertLines(firstRow$$4 - 1, removed);
      this.fireChangeEvent(firstRow$$4 - 1, lastRow$$5);
      return-1
    };
    this.moveLinesDown = function(firstRow$$5, lastRow$$6) {
      if(lastRow$$6 >= this.lines.length - 1) {
        return 0
      }var removed$$1 = this.lines.slice(firstRow$$5, lastRow$$6 + 1);
      this.$remove(new Range$$2(firstRow$$5, 0, lastRow$$6 + 1, 0));
      this.$insertLines(firstRow$$5 + 1, removed$$1);
      this.fireChangeEvent(firstRow$$5, lastRow$$6 + 1);
      return 1
    };
    this.duplicateLines = function(firstRow$$6, lastRow$$7) {
      firstRow$$6 = this.$clipRowToDocument(firstRow$$6);
      lastRow$$7 = this.$clipRowToDocument(lastRow$$7);
      var lines$$6 = this.getLines(firstRow$$6, lastRow$$7);
      this.$insertLines(firstRow$$6, lines$$6);
      var addedRows = lastRow$$7 - firstRow$$6 + 1;
      this.fireChangeEvent(firstRow$$6);
      return addedRows
    };
    this.$clipRowToDocument = function(row$$24) {
      return Math.max(0, Math.min(row$$24, this.lines.length - 1))
    };
    this.documentToScreenColumn = function(row$$25, docColumn) {
      var tabSize$$4 = this.getTabSize();
      var screenColumn = 0;
      var remaining = docColumn;
      var line$$13 = this.getLine(row$$25).split("\t");
      var i$$22 = 0;
      for(;i$$22 < line$$13.length;i$$22++) {
        var len$$2 = line$$13[i$$22].length;
        if(remaining > len$$2) {
          remaining -= len$$2 + 1;
          screenColumn += len$$2 + tabSize$$4
        }else {
          screenColumn += remaining;
          break
        }
      }return screenColumn
    };
    this.screenToDocumentColumn = function(row$$26, screenColumn$$1) {
      var tabSize$$5 = this.getTabSize();
      var docColumn$$1 = 0;
      var remaining$$1 = screenColumn$$1;
      var line$$14 = this.getLine(row$$26).split("\t");
      var i$$23 = 0;
      for(;i$$23 < line$$14.length;i$$23++) {
        var len$$3 = line$$14[i$$23].length;
        if(remaining$$1 >= len$$3 + tabSize$$5) {
          remaining$$1 -= len$$3 + tabSize$$5;
          docColumn$$1 += len$$3 + 1
        }else {
          docColumn$$1 += remaining$$1 > len$$3 ? len$$3 : remaining$$1;
          break
        }
      }return docColumn$$1
    }
  }).call(Document.prototype);
  exports$$20.Document = Document
});
define("ace/search", ["require", "exports", "module", "pilot/lang", "pilot/oop", "ace/range"], function(require$$21, exports$$21) {
  var lang$$3 = require$$21("pilot/lang");
  var oop$$3 = require$$21("pilot/oop");
  var Range$$3 = require$$21("ace/range").Range;
  var Search = function() {
    this.$options = {needle:"", backwards:false, wrap:false, caseSensitive:false, wholeWord:false, scope:Search.ALL, regExp:false}
  };
  Search.ALL = 1;
  Search.SELECTION = 2;
  (function() {
    this.set = function(options$$1) {
      oop$$3.mixin(this.$options, options$$1);
      return this
    };
    this.getOptions = function() {
      return lang$$3.copyObject(this.$options)
    };
    this.find = function(doc$$6) {
      if(!this.$options.needle) {
        return null
      }var iterator = this.$options.backwards ? this.$backwardMatchIterator(doc$$6) : this.$forwardMatchIterator(doc$$6);
      var firstRange = null;
      iterator.forEach(function(range$$8) {
        firstRange = range$$8;
        return true
      });
      return firstRange
    };
    this.findAll = function(doc$$7) {
      if(!this.$options.needle) {
        return[]
      }var iterator$$1 = this.$options.backwards ? this.$backwardMatchIterator(doc$$7) : this.$forwardMatchIterator(doc$$7);
      var ranges = [];
      iterator$$1.forEach(function(range$$9) {
        ranges.push(range$$9)
      });
      return ranges
    };
    this.replace = function(input$$1, replacement) {
      var re$$2 = this.$assembleRegExp();
      var match$$6 = re$$2.exec(input$$1);
      return match$$6 && match$$6[0].length == input$$1.length ? this.$options.regExp ? input$$1.replace(re$$2, replacement) : replacement : null
    };
    this.$forwardMatchIterator = function(doc$$8) {
      var re$$3 = this.$assembleRegExp();
      var self$$1 = this;
      return{forEach:function(callback$$8) {
        self$$1.$forwardLineIterator(doc$$8).forEach(function(line$$15, startIndex, row$$27) {
          if(startIndex) {
            line$$15 = line$$15.substring(startIndex)
          }var matches = [];
          line$$15.replace(re$$3, function(str$$2) {
            var offset$$1 = arguments[arguments.length - 2];
            matches.push({str:str$$2, offset:startIndex + offset$$1});
            return str$$2
          });
          var i$$24 = 0;
          for(;i$$24 < matches.length;i$$24++) {
            var match$$7 = matches[i$$24];
            var range$$10 = self$$1.$rangeFromMatch(row$$27, match$$7.offset, match$$7.str.length);
            if(callback$$8(range$$10)) {
              return true
            }
          }
        })
      }}
    };
    this.$backwardMatchIterator = function(doc$$9) {
      var re$$4 = this.$assembleRegExp();
      var self$$2 = this;
      return{forEach:function(callback$$9) {
        self$$2.$backwardLineIterator(doc$$9).forEach(function(line$$16, startIndex$$1, row$$28) {
          if(startIndex$$1) {
            line$$16 = line$$16.substring(startIndex$$1)
          }var matches$$1 = [];
          line$$16.replace(re$$4, function(str$$3, offset$$2) {
            matches$$1.push({str:str$$3, offset:startIndex$$1 + offset$$2});
            return str$$3
          });
          var i$$25 = matches$$1.length - 1;
          for(;i$$25 >= 0;i$$25--) {
            var match$$8 = matches$$1[i$$25];
            var range$$11 = self$$2.$rangeFromMatch(row$$28, match$$8.offset, match$$8.str.length);
            if(callback$$9(range$$11)) {
              return true
            }
          }
        })
      }}
    };
    this.$rangeFromMatch = function(row$$29, column$$16, length) {
      return new Range$$3(row$$29, column$$16, row$$29, column$$16 + length)
    };
    this.$assembleRegExp = function() {
      var needle$$1 = this.$options.regExp ? this.$options.needle : lang$$3.escapeRegExp(this.$options.needle);
      if(this.$options.wholeWord) {
        needle$$1 = "\\b" + needle$$1 + "\\b"
      }var modifier = "g";
      this.$options.caseSensitive || (modifier += "i");
      var re$$5 = new RegExp(needle$$1, modifier);
      return re$$5
    };
    this.$forwardLineIterator = function(doc$$10) {
      function getLine(row$$30) {
        var line$$17 = doc$$10.getLine(row$$30);
        if(searchSelection && row$$30 == range$$12.end.row) {
          line$$17 = line$$17.substring(0, range$$12.end.column)
        }return line$$17
      }
      var searchSelection = this.$options.scope == Search.SELECTION;
      var range$$12 = doc$$10.getSelection().getRange();
      var start$$4 = doc$$10.getSelection().getCursor();
      var firstRow$$7 = searchSelection ? range$$12.start.row : 0;
      var firstColumn = searchSelection ? range$$12.start.column : 0;
      var lastRow$$8 = searchSelection ? range$$12.end.row : doc$$10.getLength() - 1;
      var wrap = this.$options.wrap;
      return{forEach:function(callback$$10) {
        var row$$31 = start$$4.row;
        var line$$18 = getLine(row$$31);
        var startIndex$$2 = start$$4.column;
        var stop = false;
        for(;!callback$$10(line$$18, startIndex$$2, row$$31);) {
          if(stop) {
            return
          }row$$31++;
          startIndex$$2 = 0;
          if(row$$31 > lastRow$$8) {
            if(wrap) {
              row$$31 = firstRow$$7;
              startIndex$$2 = firstColumn
            }else {
              return
            }
          }if(row$$31 == start$$4.row) {
            stop = true
          }line$$18 = getLine(row$$31)
        }
      }}
    };
    this.$backwardLineIterator = function(doc$$11) {
      var searchSelection$$1 = this.$options.scope == Search.SELECTION;
      var range$$13 = doc$$11.getSelection().getRange();
      var start$$5 = searchSelection$$1 ? range$$13.end : range$$13.start;
      var firstRow$$8 = searchSelection$$1 ? range$$13.start.row : 0;
      var firstColumn$$1 = searchSelection$$1 ? range$$13.start.column : 0;
      var lastRow$$9 = searchSelection$$1 ? range$$13.end.row : doc$$11.getLength() - 1;
      var wrap$$1 = this.$options.wrap;
      return{forEach:function(callback$$11) {
        var row$$32 = start$$5.row;
        var line$$19 = doc$$11.getLine(row$$32).substring(0, start$$5.column);
        var startIndex$$3 = 0;
        var stop$$1 = false;
        for(;!callback$$11(line$$19, startIndex$$3, row$$32);) {
          if(stop$$1) {
            return
          }row$$32--;
          startIndex$$3 = 0;
          if(row$$32 < firstRow$$8) {
            if(wrap$$1) {
              row$$32 = lastRow$$9
            }else {
              return
            }
          }if(row$$32 == start$$5.row) {
            stop$$1 = true
          }line$$19 = doc$$11.getLine(row$$32);
          if(searchSelection$$1) {
            if(row$$32 == firstRow$$8) {
              startIndex$$3 = firstColumn$$1
            }else {
              if(row$$32 == lastRow$$9) {
                line$$19 = line$$19.substring(0, range$$13.end.column)
              }
            }
          }
        }
      }}
    }
  }).call(Search.prototype);
  exports$$21.Search = Search
});
define("ace/background_tokenizer", ["require", "exports", "module", "pilot/oop", "pilot/event_emitter"], function(require$$22, exports$$22) {
  var oop$$4 = require$$22("pilot/oop");
  var EventEmitter$$4 = require$$22("pilot/event_emitter").EventEmitter;
  var BackgroundTokenizer = function(tokenizer, editor$$1) {
    this.running = false;
    this.textLines = [];
    this.lines = [];
    this.currentLine = 0;
    this.tokenizer = tokenizer;
    var self$$3 = this;
    this.$worker = function() {
      if(!self$$3.running) {
        return
      }var workerStart = new Date;
      var startLine = self$$3.currentLine;
      var textLines = self$$3.textLines;
      var processedLines = 0;
      var lastVisibleRow = editor$$1.getLastVisibleRow();
      for(;self$$3.currentLine < textLines.length;) {
        self$$3.lines[self$$3.currentLine] = self$$3.$tokenizeRows(self$$3.currentLine, self$$3.currentLine)[0];
        self$$3.currentLine++;
        processedLines += 1;
        if(processedLines % 5 == 0 && new Date - workerStart > 20) {
          self$$3.fireUpdateEvent(startLine, self$$3.currentLine - 1);
          var timeout$$1 = self$$3.currentLine < lastVisibleRow ? 20 : 100;
          self$$3.running = setTimeout(self$$3.$worker, timeout$$1);
          return
        }
      }self$$3.running = false;
      self$$3.fireUpdateEvent(startLine, textLines.length - 1)
    }
  };
  (function() {
    oop$$4.implement(this, EventEmitter$$4);
    this.setTokenizer = function(tokenizer$$1) {
      this.tokenizer = tokenizer$$1;
      this.lines = [];
      this.start(0)
    };
    this.setLines = function(textLines$$1) {
      this.textLines = textLines$$1;
      this.lines = [];
      this.stop()
    };
    this.fireUpdateEvent = function(firstRow$$9, lastRow$$10) {
      var data$$3 = {first:firstRow$$9, last:lastRow$$10};
      this._dispatchEvent("update", {data:data$$3})
    };
    this.start = function(startRow$$3) {
      this.currentLine = Math.min(startRow$$3 || 0, this.currentLine, this.textLines.length);
      this.lines.splice(this.currentLine, this.lines.length);
      this.stop();
      this.running = setTimeout(this.$worker, 700)
    };
    this.stop = function() {
      this.running && clearTimeout(this.running);
      this.running = false
    };
    this.getTokens = function(firstRow$$10, lastRow$$11, callback$$12) {
      callback$$12(this.$tokenizeRows(firstRow$$10, lastRow$$11))
    };
    this.getState = function(row$$33, callback$$13) {
      callback$$13(this.$tokenizeRows(row$$33, row$$33)[0].state)
    };
    this.$tokenizeRows = function(firstRow$$11, lastRow$$12) {
      var rows$$4 = [];
      var state$$7 = "start";
      var doCache = false;
      if(firstRow$$11 > 0 && this.lines[firstRow$$11 - 1]) {
        state$$7 = this.lines[firstRow$$11 - 1].state;
        doCache = true
      }var row$$34 = firstRow$$11;
      for(;row$$34 <= lastRow$$12;row$$34++) {
        if(this.lines[row$$34]) {
          tokens$$1 = this.lines[row$$34];
          state$$7 = tokens$$1.state;
          rows$$4.push(tokens$$1)
        }else {
          var tokens$$1 = this.tokenizer.getLineTokens(this.textLines[row$$34] || "", state$$7);
          state$$7 = tokens$$1.state;
          rows$$4.push(tokens$$1);
          if(doCache) {
            this.lines[row$$34] = tokens$$1
          }
        }
      }return rows$$4
    }
  }).call(BackgroundTokenizer.prototype);
  exports$$22.BackgroundTokenizer = BackgroundTokenizer
});
define("ace/editor", ["require", "exports", "module", "pilot/oop", "pilot/event", "pilot/lang", "ace/textinput", "ace/keybinding", "ace/document", "ace/search", "ace/background_tokenizer", "ace/range", "pilot/event_emitter"], function(require$$23, exports$$23) {
  var oop$$5 = require$$23("pilot/oop");
  var event$$2 = require$$23("pilot/event");
  var lang$$4 = require$$23("pilot/lang");
  var TextInput$$1 = require$$23("ace/textinput").TextInput;
  var KeyBinding$$1 = require$$23("ace/keybinding").KeyBinding;
  var Document$$1 = require$$23("ace/document").Document;
  var Search$$1 = require$$23("ace/search").Search;
  var BackgroundTokenizer$$1 = require$$23("ace/background_tokenizer").BackgroundTokenizer;
  var Range$$4 = require$$23("ace/range").Range;
  var EventEmitter$$5 = require$$23("pilot/event_emitter").EventEmitter;
  var Editor = function(renderer, doc$$12) {
    var container = renderer.getContainerElement();
    this.container = container;
    this.renderer = renderer;
    this.textInput = new TextInput$$1(container, this);
    this.keyBinding = new KeyBinding$$1(container, this);
    var self$$4 = this;
    event$$2.addListener(container, "mousedown", function(e$$24) {
      setTimeout(function() {
        self$$4.focus()
      });
      return event$$2.preventDefault(e$$24)
    });
    event$$2.addListener(container, "selectstart", function(e$$25) {
      return event$$2.preventDefault(e$$25)
    });
    var mouseTarget = renderer.getMouseEventTarget();
    event$$2.addListener(mouseTarget, "mousedown", this.onMouseDown.bind(this));
    event$$2.addMultiMouseDownListener(mouseTarget, 0, 2, 500, this.onMouseDoubleClick.bind(this));
    event$$2.addMultiMouseDownListener(mouseTarget, 0, 3, 600, this.onMouseTripleClick.bind(this));
    event$$2.addMouseWheelListener(mouseTarget, this.onMouseWheel.bind(this));
    this.$selectionMarker = null;
    this.$highlightLineMarker = null;
    this.$blockScrolling = false;
    this.$search = (new Search$$1).set({wrap:true});
    this.setDocument(doc$$12 || new Document$$1(""));
    this.focus()
  };
  (function() {
    oop$$5.implement(this, EventEmitter$$5);
    this.$forwardEvents = {gutterclick:1, gutterdblclick:1};
    this.$originalAddEventListener = this.addEventListener;
    this.$originalRemoveEventListener = this.removeEventListener;
    this.addEventListener = function(eventName$$3, callback$$14) {
      return this.$forwardEvents[eventName$$3] ? this.renderer.addEventListener(eventName$$3, callback$$14) : this.$originalAddEventListener(eventName$$3, callback$$14)
    };
    this.removeEventListener = function(eventName$$4, callback$$15) {
      return this.$forwardEvents[eventName$$4] ? this.renderer.removeEventListener(eventName$$4, callback$$15) : this.$originalRemoveEventListener(eventName$$4, callback$$15)
    };
    this.setDocument = function(doc$$13) {
      if(this.doc == doc$$13) {
        return
      }if(this.doc) {
        this.doc.removeEventListener("change", this.$onDocumentChange);
        this.doc.removeEventListener("changeMode", this.$onDocumentModeChange);
        this.doc.removeEventListener("changeTabSize", this.$onDocumentChangeTabSize);
        this.doc.removeEventListener("changeBreakpoint", this.$onDocumentChangeBreakpoint);
        var selection = this.doc.getSelection();
        selection.removeEventListener("changeCursor", this.$onCursorChange);
        selection.removeEventListener("changeSelection", this.$onSelectionChange);
        this.doc.setScrollTopRow(this.renderer.getScrollTopRow())
      }this.doc = doc$$13;
      this.$onDocumentChange = this.onDocumentChange.bind(this);
      doc$$13.addEventListener("change", this.$onDocumentChange);
      this.renderer.setDocument(doc$$13);
      this.$onDocumentModeChange = this.onDocumentModeChange.bind(this);
      doc$$13.addEventListener("changeMode", this.$onDocumentModeChange);
      this.$onDocumentChangeTabSize = this.renderer.updateText.bind(this.renderer);
      doc$$13.addEventListener("changeTabSize", this.$onDocumentChangeTabSize);
      this.$onDocumentChangeBreakpoint = this.onDocumentChangeBreakpoint.bind(this);
      this.doc.addEventListener("changeBreakpoint", this.$onDocumentChangeBreakpoint);
      this.selection = doc$$13.getSelection();
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
      this.renderer.scrollToRow(doc$$13.getScrollTopRow());
      this.renderer.updateFull()
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
    this.setTheme = function(theme) {
      this.renderer.setTheme(theme)
    };
    this.$highlightBrackets = function() {
      if(this.$bracketHighlight) {
        this.renderer.removeMarker(this.$bracketHighlight);
        this.$bracketHighlight = null
      }if(this.$highlightPending) {
        return
      }var self$$5 = this;
      this.$highlightPending = true;
      setTimeout(function() {
        self$$5.$highlightPending = false;
        var pos$$3 = self$$5.doc.findMatchingBracket(self$$5.getCursorPosition());
        if(pos$$3) {
          var range$$14 = new Range$$4(pos$$3.row, pos$$3.column, pos$$3.row, pos$$3.column + 1);
          self$$5.$bracketHighlight = self$$5.renderer.addMarker(range$$14, "ace_bracket")
        }
      }, 10)
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
    this.onDocumentChange = function(e$$26) {
      var data$$4 = e$$26.data;
      this.bgTokenizer.start(data$$4.firstRow);
      this.renderer.updateLines(data$$4.firstRow, data$$4.lastRow);
      this.renderer.updateCursor(this.getCursorPosition(), this.$overwrite)
    };
    this.onTokenizerUpdate = function(e$$27) {
      var rows$$5 = e$$27.data;
      this.renderer.updateLines(rows$$5.first, rows$$5.last)
    };
    this.onCursorChange = function(e$$28) {
      this.$highlightBrackets();
      this.renderer.updateCursor(this.getCursorPosition(), this.$overwrite);
      if(!this.$blockScrolling && (!e$$28 || !e$$28.blockScrolling)) {
        this.renderer.scrollCursorIntoView()
      }this.$updateHighlightActiveLine()
    };
    this.$updateHighlightActiveLine = function() {
      this.$highlightLineMarker && this.renderer.removeMarker(this.$highlightLineMarker);
      this.$highlightLineMarker = null;
      if(this.getHighlightActiveLine() && (this.getSelectionStyle() != "line" || !this.selection.isMultiLine())) {
        var cursor$$6 = this.getCursorPosition();
        var range$$15 = new Range$$4(cursor$$6.row, 0, cursor$$6.row + 1, 0);
        this.$highlightLineMarker = this.renderer.addMarker(range$$15, "ace_active_line", "line")
      }
    };
    this.onSelectionChange = function(e$$29) {
      this.$selectionMarker && this.renderer.removeMarker(this.$selectionMarker);
      this.$selectionMarker = null;
      if(!this.selection.isEmpty()) {
        var range$$16 = this.selection.getRange();
        var style$$1 = this.getSelectionStyle();
        this.$selectionMarker = this.renderer.addMarker(range$$16, "ace_selection", style$$1)
      }this.onCursorChange(e$$29)
    };
    this.onDocumentChangeBreakpoint = function() {
      this.renderer.setBreakpoints(this.doc.getBreakpoints())
    };
    this.onDocumentModeChange = function() {
      var mode$$3 = this.doc.getMode();
      if(this.mode == mode$$3) {
        return
      }this.mode = mode$$3;
      var tokenizer$$2 = mode$$3.getTokenizer();
      if(this.bgTokenizer) {
        this.bgTokenizer.setTokenizer(tokenizer$$2)
      }else {
        var onUpdate = this.onTokenizerUpdate.bind(this);
        this.bgTokenizer = new BackgroundTokenizer$$1(tokenizer$$2, this);
        this.bgTokenizer.addEventListener("update", onUpdate)
      }this.renderer.setTokenizer(this.bgTokenizer)
    };
    this.onMouseDown = function(e$$30) {
      var pageX = event$$2.getDocumentX(e$$30);
      var pageY = event$$2.getDocumentY(e$$30);
      var pos$$4 = this.renderer.screenToTextCoordinates(pageX, pageY);
      pos$$4.row = Math.max(0, Math.min(pos$$4.row, this.doc.getLength() - 1));
      if(event$$2.getButton(e$$30) != 0) {
        this.selection.isEmpty() && this.moveCursorToPosition(pos$$4);
        return
      }if(e$$30.shiftKey) {
        this.selection.selectToPosition(pos$$4)
      }else {
        this.moveCursorToPosition(pos$$4);
        this.$clickSelection || this.selection.clearSelection(pos$$4.row, pos$$4.column)
      }this.renderer.scrollCursorIntoView();
      var self$$6 = this;
      var mousePageX;
      var mousePageY;
      var onMouseSelection = function(e$$31) {
        mousePageX = event$$2.getDocumentX(e$$31);
        mousePageY = event$$2.getDocumentY(e$$31)
      };
      var onMouseSelectionEnd = function() {
        clearInterval(timerId);
        self$$6.$clickSelection = null
      };
      var onSelectionInterval = function() {
        if(mousePageX === undefined || mousePageY === undefined) {
          return
        }var cursor$$7 = self$$6.renderer.screenToTextCoordinates(mousePageX, mousePageY);
        cursor$$7.row = Math.max(0, Math.min(cursor$$7.row, self$$6.doc.getLength() - 1));
        if(self$$6.$clickSelection) {
          if(self$$6.$clickSelection.contains(cursor$$7.row, cursor$$7.column)) {
            self$$6.selection.setSelectionRange(self$$6.$clickSelection)
          }else {
            var anchor$$4 = self$$6.$clickSelection.compare(cursor$$7.row, cursor$$7.column) == -1 ? self$$6.$clickSelection.end : self$$6.$clickSelection.start;
            self$$6.selection.setSelectionAnchor(anchor$$4.row, anchor$$4.column);
            self$$6.selection.selectToPosition(cursor$$7)
          }
        }else {
          self$$6.selection.selectToPosition(cursor$$7)
        }self$$6.renderer.scrollCursorIntoView()
      };
      event$$2.capture(this.container, onMouseSelection, onMouseSelectionEnd);
      var timerId = setInterval(onSelectionInterval, 20);
      return event$$2.preventDefault(e$$30)
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
    this.onMouseWheel = function(e$$34) {
      var speed = this.$scrollSpeed * 2;
      this.renderer.scrollBy(e$$34.wheelX * speed, e$$34.wheelY * speed);
      return event$$2.preventDefault(e$$34)
    };
    this.getCopyText = function() {
      if(this.selection.isEmpty()) {
        return""
      }else {
        return this.doc.getTextRange(this.getSelectionRange())
      }
    };
    this.onCut = function() {
      if(this.$readOnly) {
        return
      }if(!this.selection.isEmpty()) {
        this.moveCursorToPosition(this.doc.remove(this.getSelectionRange()));
        this.clearSelection()
      }
    };
    this.onTextInput = function(text$$10) {
      if(this.$readOnly) {
        return
      }var cursor$$8 = this.getCursorPosition();
      text$$10 = text$$10.replace("\t", this.doc.getTabString());
      if(this.selection.isEmpty()) {
        if(this.$overwrite) {
          var range$$17 = new Range$$4.fromPoints(cursor$$8, cursor$$8);
          range$$17.end.column += text$$10.length;
          this.doc.remove(range$$17)
        }
      }else {
        cursor$$8 = this.doc.remove(this.getSelectionRange());
        this.clearSelection()
      }this.clearSelection();
      var _self$$1 = this;
      this.bgTokenizer.getState(cursor$$8.row, function(lineState) {
        var shouldOutdent = _self$$1.mode.checkOutdent(lineState, _self$$1.doc.getLine(cursor$$8.row), text$$10);
        var line$$20 = _self$$1.doc.getLine(cursor$$8.row);
        var lineIndent = _self$$1.mode.getNextLineIndent(lineState, line$$20.slice(0, cursor$$8.column), _self$$1.doc.getTabString());
        var end$$9 = _self$$1.doc.insert(cursor$$8, text$$10);
        _self$$1.bgTokenizer.getState(cursor$$8.row, function(lineState$$1) {
          if(cursor$$8.row !== end$$9.row) {
            var size$$1 = _self$$1.doc.getTabSize();
            var minIndent = Number.MAX_VALUE;
            var row$$35 = cursor$$8.row + 1;
            for(;row$$35 <= end$$9.row;++row$$35) {
              var indent = 0;
              line$$20 = _self$$1.doc.getLine(row$$35);
              var i$$26 = 0;
              for(;i$$26 < line$$20.length;++i$$26) {
                if(line$$20.charAt(i$$26) == "\t") {
                  indent += size$$1
                }else {
                  if(line$$20.charAt(i$$26) == " ") {
                    indent += 1
                  }else {
                    break
                  }
                }
              }if(/[^\s]/.test(line$$20)) {
                minIndent = Math.min(indent, minIndent)
              }
            }row$$35 = cursor$$8.row + 1;
            for(;row$$35 <= end$$9.row;++row$$35) {
              var outdent = minIndent;
              line$$20 = _self$$1.doc.getLine(row$$35);
              i$$26 = 0;
              for(;i$$26 < line$$20.length && outdent > 0;++i$$26) {
                if(line$$20.charAt(i$$26) == "\t") {
                  outdent -= size$$1
                }else {
                  if(line$$20.charAt(i$$26) == " ") {
                    outdent -= 1
                  }
                }
              }_self$$1.doc.replace(new Range$$4(row$$35, 0, row$$35, line$$20.length), line$$20.substr(i$$26))
            }end$$9.column += _self$$1.doc.indentRows(cursor$$8.row + 1, end$$9.row, lineIndent)
          }else {
            if(shouldOutdent) {
              end$$9.column += _self$$1.mode.autoOutdent(lineState$$1, _self$$1.doc, cursor$$8.row)
            }
          }_self$$1.moveCursorToPosition(end$$9);
          _self$$1.renderer.scrollCursorIntoView()
        })
      })
    };
    this.$overwrite = false;
    this.setOverwrite = function(overwrite) {
      if(this.$overwrite == overwrite) {
        return
      }this.$overwrite = overwrite;
      this.$blockScrolling = true;
      this.onCursorChange();
      this.$blockScrolling = false;
      this._dispatchEvent("changeOverwrite", {data:overwrite})
    };
    this.getOverwrite = function() {
      return this.$overwrite
    };
    this.toggleOverwrite = function() {
      this.setOverwrite(!this.$overwrite)
    };
    this.$scrollSpeed = 1;
    this.setScrollSpeed = function(speed$$1) {
      this.$scrollSpeed = speed$$1
    };
    this.getScrollSpeed = function() {
      return this.$scrollSpeed
    };
    this.$selectionStyle = "line";
    this.setSelectionStyle = function(style$$2) {
      if(this.$selectionStyle == style$$2) {
        return
      }this.$selectionStyle = style$$2;
      this.onSelectionChange();
      this._dispatchEvent("changeSelectionStyle", {data:style$$2})
    };
    this.getSelectionStyle = function() {
      return this.$selectionStyle
    };
    this.$highlightActiveLine = true;
    this.setHighlightActiveLine = function(shouldHighlight) {
      if(this.$highlightActiveLine == shouldHighlight) {
        return
      }this.$highlightActiveLine = shouldHighlight;
      this.$updateHighlightActiveLine()
    };
    this.getHighlightActiveLine = function() {
      return this.$highlightActiveLine
    };
    this.setShowInvisibles = function(showInvisibles) {
      if(this.getShowInvisibles() == showInvisibles) {
        return
      }this.renderer.setShowInvisibles(showInvisibles)
    };
    this.getShowInvisibles = function() {
      return this.renderer.getShowInvisibles()
    };
    this.setShowPrintMargin = function(showPrintMargin) {
      this.renderer.setShowPrintMargin(showPrintMargin)
    };
    this.getShowPrintMargin = function() {
      return this.renderer.getShowPrintMargin()
    };
    this.setPrintMarginColumn = function(showPrintMargin$$1) {
      this.renderer.setPrintMarginColumn(showPrintMargin$$1)
    };
    this.getPrintMarginColumn = function() {
      return this.renderer.getPrintMarginColumn()
    };
    this.$readOnly = false;
    this.setReadOnly = function(readOnly) {
      this.$readOnly = readOnly
    };
    this.getReadOnly = function() {
      return this.$readOnly
    };
    this.removeRight = function() {
      if(this.$readOnly) {
        return
      }this.selection.isEmpty() && this.selection.selectRight();
      this.moveCursorToPosition(this.doc.remove(this.getSelectionRange()));
      this.clearSelection()
    };
    this.removeLeft = function() {
      if(this.$readOnly) {
        return
      }this.selection.isEmpty() && this.selection.selectLeft();
      this.moveCursorToPosition(this.doc.remove(this.getSelectionRange()));
      this.clearSelection()
    };
    this.indent = function() {
      if(this.$readOnly) {
        return
      }var doc$$14 = this.doc;
      var range$$18 = this.getSelectionRange();
      if(range$$18.start.row < range$$18.end.row || range$$18.start.column < range$$18.end.column) {
        var rows$$6 = this.$getSelectedRows();
        var count$$2 = doc$$14.indentRows(rows$$6.first, rows$$6.last, "\t");
        this.selection.shiftSelection(count$$2)
      }else {
        var indentString$$1;
        if(this.doc.getUseSoftTabs()) {
          var size$$2 = doc$$14.getTabSize();
          var position$$7 = this.getCursorPosition();
          var column$$17 = doc$$14.documentToScreenColumn(position$$7.row, position$$7.column);
          count$$2 = size$$2 - column$$17 % size$$2;
          indentString$$1 = lang$$4.stringRepeat(" ", count$$2)
        }else {
          indentString$$1 = "\t"
        }return this.onTextInput(indentString$$1)
      }
    };
    this.blockOutdent = function() {
      if(this.$readOnly) {
        return
      }var selection$$1 = this.doc.getSelection();
      var range$$19 = this.doc.outdentRows(selection$$1.getRange());
      selection$$1.setSelectionRange(range$$19, selection$$1.isBackwards());
      this.$updateDesiredColumn()
    };
    this.toggleCommentLines = function() {
      if(this.$readOnly) {
        return
      }var _self$$2 = this;
      this.bgTokenizer.getState(this.getCursorPosition().row, function(state$$8) {
        var rows$$7 = _self$$2.$getSelectedRows();
        var addedColumns = _self$$2.mode.toggleCommentLines(state$$8, _self$$2.doc, rows$$7.first, rows$$7.last);
        _self$$2.selection.shiftSelection(addedColumns)
      })
    };
    this.removeLines = function() {
      if(this.$readOnly) {
        return
      }var rows$$8 = this.$getSelectedRows();
      this.selection.setSelectionAnchor(rows$$8.last + 1, 0);
      this.selection.selectTo(rows$$8.first, 0);
      this.doc.remove(this.getSelectionRange());
      this.clearSelection()
    };
    this.moveLinesDown = function() {
      if(this.$readOnly) {
        return
      }this.$moveLines(function(firstRow$$12, lastRow$$13) {
        return this.doc.moveLinesDown(firstRow$$12, lastRow$$13)
      })
    };
    this.moveLinesUp = function() {
      if(this.$readOnly) {
        return
      }this.$moveLines(function(firstRow$$13, lastRow$$14) {
        return this.doc.moveLinesUp(firstRow$$13, lastRow$$14)
      })
    };
    this.copyLinesUp = function() {
      if(this.$readOnly) {
        return
      }this.$moveLines(function(firstRow$$14, lastRow$$15) {
        this.doc.duplicateLines(firstRow$$14, lastRow$$15);
        return 0
      })
    };
    this.copyLinesDown = function() {
      if(this.$readOnly) {
        return
      }this.$moveLines(function(firstRow$$15, lastRow$$16) {
        return this.doc.duplicateLines(firstRow$$15, lastRow$$16)
      })
    };
    this.$moveLines = function(mover$$1) {
      var rows$$9 = this.$getSelectedRows();
      var linesMoved = mover$$1.call(this, rows$$9.first, rows$$9.last);
      var selection$$2 = this.selection;
      selection$$2.setSelectionAnchor(rows$$9.last + linesMoved + 1, 0);
      selection$$2.$moveSelection(function() {
        selection$$2.moveCursorTo(rows$$9.first + linesMoved, 0)
      })
    };
    this.$getSelectedRows = function() {
      var range$$20 = this.getSelectionRange().collapseRows();
      return{first:range$$20.start.row, last:range$$20.end.row}
    };
    this.onCompositionStart = function() {
      this.renderer.showComposition(this.getCursorPosition())
    };
    this.onCompositionUpdate = function(text$$12) {
      this.renderer.setCompositionText(text$$12)
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
    this.isRowVisible = function(row$$36) {
      return row$$36 >= this.getFirstVisibleRow() && row$$36 <= this.getLastVisibleRow()
    };
    this.getVisibleRowCount = function() {
      return this.getLastVisibleRow() - this.getFirstVisibleRow() + 1
    };
    this.getPageDownRow = function() {
      return this.renderer.getLastVisibleRow() - 1
    };
    this.getPageUpRow = function() {
      var firstRow$$16 = this.renderer.getFirstVisibleRow();
      var lastRow$$17 = this.renderer.getLastVisibleRow();
      return firstRow$$16 - (lastRow$$17 - firstRow$$16) + 1
    };
    this.selectPageDown = function() {
      var row$$37 = this.getPageDownRow() + Math.floor(this.getVisibleRowCount() / 2);
      this.scrollPageDown();
      var selection$$3 = this.getSelection();
      selection$$3.$moveSelection(function() {
        selection$$3.moveCursorTo(row$$37, selection$$3.getSelectionLead().column)
      })
    };
    this.selectPageUp = function() {
      var visibleRows = this.getLastVisibleRow() - this.getFirstVisibleRow();
      var row$$38 = this.getPageUpRow() + Math.round(visibleRows / 2);
      this.scrollPageUp();
      var selection$$4 = this.getSelection();
      selection$$4.$moveSelection(function() {
        selection$$4.moveCursorTo(row$$38, selection$$4.getSelectionLead().column)
      })
    };
    this.gotoPageDown = function() {
      var row$$39 = this.getPageDownRow();
      var column$$18 = Math.min(this.getCursorPosition().column, this.doc.getLine(row$$39).length);
      this.scrollToRow(row$$39);
      this.getSelection().moveCursorTo(row$$39, column$$18)
    };
    this.gotoPageUp = function() {
      var row$$40 = this.getPageUpRow();
      var column$$19 = Math.min(this.getCursorPosition().column, this.doc.getLine(row$$40).length);
      this.scrollToRow(row$$40);
      this.getSelection().moveCursorTo(row$$40, column$$19)
    };
    this.scrollPageDown = function() {
      this.scrollToRow(this.getPageDownRow())
    };
    this.scrollPageUp = function() {
      this.renderer.scrollToRow(this.getPageUpRow())
    };
    this.scrollToRow = function(row$$41) {
      this.renderer.scrollToRow(row$$41)
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
    this.moveCursorTo = function(row$$42, column$$20) {
      this.selection.moveCursorTo(row$$42, column$$20);
      this.$updateDesiredColumn()
    };
    this.moveCursorToPosition = function(pos$$5) {
      this.selection.moveCursorToPosition(pos$$5);
      this.$updateDesiredColumn()
    };
    this.gotoLine = function(lineNumber, row$$43) {
      this.selection.clearSelection();
      this.$blockScrolling = true;
      this.moveCursorTo(lineNumber - 1, row$$43 || 0);
      this.$blockScrolling = false;
      this.isRowVisible(this.getCursorPosition().row) || this.scrollToRow(lineNumber - 1 - Math.floor(this.getVisibleRowCount() / 2))
    };
    this.navigateTo = function(row$$44, column$$21) {
      this.clearSelection();
      this.moveCursorTo(row$$44, column$$21);
      this.$updateDesiredColumn(column$$21)
    };
    this.navigateUp = function() {
      this.selection.clearSelection();
      this.selection.moveCursorBy(-1, 0);
      if(this.$desiredColumn) {
        var cursor$$9 = this.getCursorPosition();
        var column$$22 = this.doc.screenToDocumentColumn(cursor$$9.row, this.$desiredColumn);
        this.selection.moveCursorTo(cursor$$9.row, column$$22)
      }
    };
    this.navigateDown = function() {
      this.selection.clearSelection();
      this.selection.moveCursorBy(1, 0);
      if(this.$desiredColumn) {
        var cursor$$10 = this.getCursorPosition();
        var column$$23 = this.doc.screenToDocumentColumn(cursor$$10.row, this.$desiredColumn);
        this.selection.moveCursorTo(cursor$$10.row, column$$23)
      }
    };
    this.$updateDesiredColumn = function() {
      var cursor$$11 = this.getCursorPosition();
      this.$desiredColumn = this.doc.documentToScreenColumn(cursor$$11.row, cursor$$11.column)
    };
    this.navigateLeft = function() {
      if(this.selection.isEmpty()) {
        this.selection.moveCursorLeft()
      }else {
        var selectionStart = this.getSelectionRange().start;
        this.moveCursorToPosition(selectionStart)
      }this.clearSelection()
    };
    this.navigateRight = function() {
      if(this.selection.isEmpty()) {
        this.selection.moveCursorRight()
      }else {
        var selectionEnd = this.getSelectionRange().end;
        this.moveCursorToPosition(selectionEnd)
      }this.clearSelection()
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
    this.replace = function(replacement$$1, options$$2) {
      options$$2 && this.$search.set(options$$2);
      var range$$21 = this.$search.find(this.doc);
      this.$tryReplace(range$$21, replacement$$1);
      range$$21 !== null && this.selection.setSelectionRange(range$$21);
      this.$updateDesiredColumn()
    };
    this.replaceAll = function(replacement$$2, options$$3) {
      options$$3 && this.$search.set(options$$3);
      var ranges$$1 = this.$search.findAll(this.doc);
      if(!ranges$$1.length) {
        return
      }this.clearSelection();
      this.selection.moveCursorTo(0, 0);
      var i$$27 = ranges$$1.length - 1;
      for(;i$$27 >= 0;--i$$27) {
        this.$tryReplace(ranges$$1[i$$27], replacement$$2)
      }ranges$$1[0] !== null && this.selection.setSelectionRange(ranges$$1[0]);
      this.$updateDesiredColumn()
    };
    this.$tryReplace = function(range$$22, replacement$$3) {
      var input$$2 = this.doc.getTextRange(range$$22);
      replacement$$3 = this.$search.replace(input$$2, replacement$$3);
      if(replacement$$3 !== null) {
        range$$22.end = this.doc.replace(range$$22, replacement$$3);
        return range$$22
      }else {
        return null
      }
    };
    this.getLastSearchOptions = function() {
      return this.$search.getOptions()
    };
    this.find = function(needle$$2, options$$4) {
      this.clearSelection();
      options$$4 = options$$4 || {};
      options$$4.needle = needle$$2;
      this.$search.set(options$$4);
      this.$find()
    };
    this.findNext = function(options$$5) {
      options$$5 = options$$5 || {};
      if(typeof options$$5.backwards == "undefined") {
        options$$5.backwards = false
      }this.$search.set(options$$5);
      this.$find()
    };
    this.findPrevious = function(options$$6) {
      options$$6 = options$$6 || {};
      if(typeof options$$6.backwards == "undefined") {
        options$$6.backwards = true
      }this.$search.set(options$$6);
      this.$find()
    };
    this.$find = function(backwards) {
      this.selection.isEmpty() || this.$search.set({needle:this.doc.getTextRange(this.getSelectionRange())});
      typeof backwards != "undefined" && this.$search.set({backwards:backwards});
      var range$$23 = this.$search.find(this.doc);
      if(range$$23) {
        this.gotoLine(range$$23.end.row + 1, range$$23.end.column);
        this.$updateDesiredColumn();
        this.selection.setSelectionRange(range$$23)
      }
    };
    this.undo = function() {
      this.doc.getUndoManager().undo()
    };
    this.redo = function() {
      this.doc.getUndoManager().redo()
    }
  }).call(Editor.prototype);
  exports$$23.Editor = Editor
});
define("pilot/dom", ["require", "exports", "module"], function(require$$24, exports$$24) {
  exports$$24.setText = function(elem$$2, text$$13) {
    if(elem$$2.innerText !== undefined) {
      elem$$2.innerText = text$$13
    }if(elem$$2.textContent !== undefined) {
      elem$$2.textContent = text$$13
    }
  };
  exports$$24.hasCssClass = function(el$$5, name$$7) {
    var classes = el$$5.className.split(/\s+/g);
    return classes.indexOf(name$$7) !== -1
  };
  exports$$24.addCssClass = function(el$$6, name$$8) {
    exports$$24.hasCssClass(el$$6, name$$8) || (el$$6.className += " " + name$$8)
  };
  exports$$24.setCssClass = function(node, className, include) {
    include ? exports$$24.addCssClass(node, className) : exports$$24.removeCssClass(node, className)
  };
  exports$$24.removeCssClass = function(el$$7, name$$9) {
    var classes$$1 = el$$7.className.split(/\s+/g);
    for(;;) {
      var index$$1 = classes$$1.indexOf(name$$9);
      if(index$$1 == -1) {
        break
      }classes$$1.splice(index$$1, 1)
    }el$$7.className = classes$$1.join(" ")
  };
  exports$$24.importCssString = function(cssText, doc$$15) {
    doc$$15 = doc$$15 || document;
    if(doc$$15.createStyleSheet) {
      var sheet = doc$$15.createStyleSheet();
      sheet.cssText = cssText
    }else {
      var style$$3 = doc$$15.createElement("style");
      style$$3.appendChild(doc$$15.createTextNode(cssText));
      doc$$15.getElementsByTagName("head")[0].appendChild(style$$3)
    }
  };
  exports$$24.getInnerWidth = function(element$$1) {
    return parseInt(exports$$24.computedStyle(element$$1, "paddingLeft")) + parseInt(exports$$24.computedStyle(element$$1, "paddingRight")) + element$$1.clientWidth
  };
  exports$$24.getInnerHeight = function(element$$2) {
    return parseInt(exports$$24.computedStyle(element$$2, "paddingTop")) + parseInt(exports$$24.computedStyle(element$$2, "paddingBottom")) + element$$2.clientHeight
  };
  exports$$24.computedStyle = function(element$$3, style$$4) {
    return window.getComputedStyle ? (window.getComputedStyle(element$$3, "") || {})[style$$4] || "" : element$$3.currentStyle[style$$4]
  };
  exports$$24.scrollbarWidth = function() {
    var inner = document.createElement("p");
    inner.style.width = "100%";
    inner.style.height = "200px";
    var outer = document.createElement("div");
    var style$$5 = outer.style;
    style$$5.position = "absolute";
    style$$5.left = "-10000px";
    style$$5.overflow = "hidden";
    style$$5.width = "200px";
    style$$5.height = "150px";
    outer.appendChild(inner);
    document.body.appendChild(outer);
    var noScrollbar = inner.offsetWidth;
    style$$5.overflow = "scroll";
    var withScrollbar = inner.offsetWidth;
    if(noScrollbar == withScrollbar) {
      withScrollbar = outer.clientWidth
    }document.body.removeChild(outer);
    return noScrollbar - withScrollbar
  };
  exports$$24.setInnerHtml = function(el$$8, innerHtml) {
    var element$$4 = el$$8.cloneNode(false);
    element$$4.innerHTML = innerHtml;
    el$$8.parentNode.replaceChild(element$$4, el$$8);
    return element$$4
  };
  exports$$24.getParentWindow = function(document$$1) {
    return document$$1.defaultView || document$$1.parentWindow
  }
});
define("ace/layer/gutter", ["require", "exports", "module", "pilot/dom"], function(require$$25, exports$$25) {
  var dom = require$$25("pilot/dom");
  var Gutter = function(parentEl) {
    this.element = document.createElement("div");
    this.element.className = "ace_layer ace_gutter-layer";
    parentEl.appendChild(this.element);
    this.$breakpoints = [];
    this.$decorations = []
  };
  (function() {
    this.addGutterDecoration = function(row$$45, className$$1) {
      this.$decorations[row$$45] || (this.$decorations[row$$45] = "");
      this.$decorations[row$$45] += " ace_" + className$$1
    };
    this.removeGutterDecoration = function(row$$46, className$$2) {
      this.$decorations[row$$46] = this.$decorations[row$$46].replace(" ace_" + className$$2, "")
    };
    this.setBreakpoints = function(rows$$10) {
      this.$breakpoints = rows$$10.concat()
    };
    this.update = function(config$$2) {
      this.$config = config$$2;
      var html = [];
      var i$$28 = config$$2.firstRow;
      for(;i$$28 <= config$$2.lastRow;i$$28++) {
        html.push("<div class='ace_gutter-cell", this.$decorations[i$$28] || "", this.$breakpoints[i$$28] ? " ace_breakpoint" : "", "' style='height:", config$$2.lineHeight, "px;'>", i$$28 + 1, "</div>");
        html.push("</div>")
      }this.element = dom.setInnerHtml(this.element, html.join(""));
      this.element.style.height = config$$2.minHeight + "px"
    }
  }).call(Gutter.prototype);
  exports$$25.Gutter = Gutter
});
define("ace/layer/marker", ["require", "exports", "module", "ace/range", "pilot/dom"], function(require$$26, exports$$26) {
  var Range$$5 = require$$26("ace/range").Range;
  var dom$$1 = require$$26("pilot/dom");
  var Marker = function(parentEl$$1) {
    this.element = document.createElement("div");
    this.element.className = "ace_layer ace_marker-layer";
    parentEl$$1.appendChild(this.element);
    this.markers = {};
    this.$markerId = 1
  };
  (function() {
    this.setDocument = function(doc$$16) {
      this.doc = doc$$16
    };
    this.addMarker = function(range$$24, clazz, type$$6) {
      var id = this.$markerId++;
      this.markers[id] = {range:range$$24, type:type$$6 || "line", clazz:clazz};
      return id
    };
    this.removeMarker = function(markerId) {
      var marker = this.markers[markerId];
      marker && delete this.markers[markerId]
    };
    this.update = function(config$$3) {
      config$$3 = config$$3 || this.config;
      if(!config$$3) {
        return
      }this.config = config$$3;
      var html$$1 = [];
      for(var key$$7 in this.markers) {
        var marker$$1 = this.markers[key$$7];
        var range$$25 = marker$$1.range.clipRows(config$$3.firstRow, config$$3.lastRow);
        if(range$$25.isEmpty()) {
          continue
        }if(range$$25.isMultiLine()) {
          marker$$1.type == "text" ? this.drawTextMarker(html$$1, range$$25, marker$$1.clazz, config$$3) : this.drawMultiLineMarker(html$$1, range$$25, marker$$1.clazz, config$$3)
        }else {
          this.drawSingleLineMarker(html$$1, range$$25, marker$$1.clazz, config$$3)
        }
      }this.element = dom$$1.setInnerHtml(this.element, html$$1.join(""))
    };
    this.drawTextMarker = function(stringBuilder, range$$26, clazz$$1, layerConfig) {
      var row$$47 = range$$26.start.row;
      var lineRange = new Range$$5(row$$47, range$$26.start.column, row$$47, this.doc.getLine(row$$47).length);
      this.drawSingleLineMarker(stringBuilder, lineRange, clazz$$1, layerConfig, 1);
      row$$47 = range$$26.end.row;
      lineRange = new Range$$5(row$$47, 0, row$$47, range$$26.end.column);
      this.drawSingleLineMarker(stringBuilder, lineRange, clazz$$1, layerConfig);
      row$$47 = range$$26.start.row + 1;
      for(;row$$47 < range$$26.end.row;row$$47++) {
        lineRange.start.row = row$$47;
        lineRange.end.row = row$$47;
        lineRange.end.column = this.doc.getLine(row$$47).length;
        this.drawSingleLineMarker(stringBuilder, lineRange, clazz$$1, layerConfig, 1)
      }
    };
    this.drawMultiLineMarker = function(stringBuilder$$1, range$$27, clazz$$2, layerConfig$$1) {
      range$$27 = range$$27.toScreenRange(this.doc);
      var height$$1 = layerConfig$$1.lineHeight;
      var width = Math.round(layerConfig$$1.width - range$$27.start.column * layerConfig$$1.characterWidth);
      var top = (range$$27.start.row - layerConfig$$1.firstRow) * layerConfig$$1.lineHeight;
      var left = Math.round(range$$27.start.column * layerConfig$$1.characterWidth);
      stringBuilder$$1.push("<div class='", clazz$$2, "' style='", "height:", height$$1, "px;", "width:", width, "px;", "top:", top, "px;", "left:", left, "px;'></div>");
      top = (range$$27.end.row - layerConfig$$1.firstRow) * layerConfig$$1.lineHeight;
      width = Math.round(range$$27.end.column * layerConfig$$1.characterWidth);
      stringBuilder$$1.push("<div class='", clazz$$2, "' style='", "height:", height$$1, "px;", "top:", top, "px;", "width:", width, "px;'></div>");
      height$$1 = (range$$27.end.row - range$$27.start.row - 1) * layerConfig$$1.lineHeight;
      if(height$$1 < 0) {
        return
      }top = (range$$27.start.row + 1 - layerConfig$$1.firstRow) * layerConfig$$1.lineHeight;
      stringBuilder$$1.push("<div class='", clazz$$2, "' style='", "height:", height$$1, "px;", "width:", layerConfig$$1.width, "px;", "top:", top, "px;'></div>")
    };
    this.drawSingleLineMarker = function(stringBuilder$$2, range$$28, clazz$$3, layerConfig$$2, extraLength) {
      range$$28 = range$$28.toScreenRange(this.doc);
      var height$$2 = layerConfig$$2.lineHeight;
      var width$$1 = Math.round((range$$28.end.column + (extraLength || 0) - range$$28.start.column) * layerConfig$$2.characterWidth);
      var top$$1 = (range$$28.start.row - layerConfig$$2.firstRow) * layerConfig$$2.lineHeight;
      var left$$1 = Math.round(range$$28.start.column * layerConfig$$2.characterWidth);
      stringBuilder$$2.push("<div class='", clazz$$3, "' style='", "height:", height$$2, "px;", "width:", width$$1, "px;", "top:", top$$1, "px;", "left:", left$$1, "px;'></div>")
    }
  }).call(Marker.prototype);
  exports$$26.Marker = Marker
});
define("ace/layer/text", ["require", "exports", "module", "pilot/oop", "pilot/dom", "pilot/lang", "pilot/event_emitter"], function(require$$27, exports$$27) {
  var oop$$6 = require$$27("pilot/oop");
  var dom$$2 = require$$27("pilot/dom");
  var lang$$5 = require$$27("pilot/lang");
  var EventEmitter$$6 = require$$27("pilot/event_emitter").EventEmitter;
  var Text = function(parentEl$$2) {
    this.element = document.createElement("div");
    this.element.className = "ace_layer ace_text-layer";
    parentEl$$2.appendChild(this.element);
    this.$characterSize = this.$measureSizes();
    this.$pollSizeChanges()
  };
  (function() {
    oop$$6.implement(this, EventEmitter$$6);
    this.EOF_CHAR = "&para;";
    this.EOL_CHAR = "&not;";
    this.TAB_CHAR = "&rarr;";
    this.SPACE_CHAR = "&middot;";
    this.setTokenizer = function(tokenizer$$3) {
      this.tokenizer = tokenizer$$3
    };
    this.getLineHeight = function() {
      return this.$characterSize.height || 1
    };
    this.getCharacterWidth = function() {
      return this.$characterSize.width || 1
    };
    this.$pollSizeChanges = function() {
      var self$$7 = this;
      setInterval(function() {
        var size$$3 = self$$7.$measureSizes();
        if(self$$7.$characterSize.width !== size$$3.width || self$$7.$characterSize.height !== size$$3.height) {
          self$$7.$characterSize = size$$3;
          self$$7._dispatchEvent("changeCharaterSize", {data:size$$3})
        }
      }, 500)
    };
    this.$fontStyles = {fontFamily:1, fontSize:1, fontWeight:1, fontStyle:1, lineHeight:1};
    this.$measureSizes = function() {
      var n = 1E3;
      if(!this.$measureNode) {
        var measureNode = this.$measureNode = document.createElement("div");
        var style$$6 = measureNode.style;
        style$$6.width = style$$6.height = "auto";
        style$$6.left = style$$6.top = "-1000px";
        style$$6.visibility = "hidden";
        style$$6.position = "absolute";
        style$$6.overflow = "visible";
        style$$6.whiteSpace = "nowrap";
        measureNode.innerHTML = lang$$5.stringRepeat("Xy", n);
        document.body.insertBefore(measureNode, document.body.firstChild)
      }style$$6 = this.$measureNode.style;
      for(var prop in this.$fontStyles) {
        var value$$7 = dom$$2.computedStyle(this.element, prop);
        style$$6[prop] = value$$7
      }var size$$4 = {height:this.$measureNode.offsetHeight, width:this.$measureNode.offsetWidth / (n * 2)};
      return size$$4
    };
    this.setDocument = function(doc$$17) {
      this.doc = doc$$17
    };
    this.showInvisibles = false;
    this.setShowInvisibles = function(showInvisibles$$1) {
      if(this.showInvisibles == showInvisibles$$1) {
        return false
      }this.showInvisibles = showInvisibles$$1;
      return true
    };
    this.$computeTabString = function() {
      var tabSize$$6 = this.doc.getTabSize();
      if(this.showInvisibles) {
        var halfTab = tabSize$$6 / 2;
        this.$tabString = "<span class='ace_invisible'>" + (new Array(Math.floor(halfTab))).join("&nbsp;") + this.TAB_CHAR + (new Array(Math.ceil(halfTab) + 1)).join("&nbsp;") + "</span>"
      }else {
        this.$tabString = (new Array(tabSize$$6 + 1)).join("&nbsp;")
      }
    };
    this.updateLines = function(layerConfig$$3, firstRow$$17, lastRow$$18) {
      this.$computeTabString();
      this.config = layerConfig$$3;
      var first = Math.max(firstRow$$17, layerConfig$$3.firstRow);
      var last = Math.min(lastRow$$18, layerConfig$$3.lastRow);
      var lineElements = this.element.childNodes;
      var _self$$3 = this;
      this.tokenizer.getTokens(first, last, function(tokens$$2) {
        var i$$29 = first;
        for(;i$$29 <= last;i$$29++) {
          var lineElement = lineElements[i$$29 - layerConfig$$3.firstRow];
          if(!lineElement) {
            continue
          }var html$$2 = [];
          _self$$3.$renderLine(html$$2, i$$29, tokens$$2[i$$29 - first].tokens);
          dom$$2.setInnerHtml(lineElement, html$$2.join)
        }
      })
    };
    this.scrollLines = function(config$$4) {
      function appendTop(callback$$16) {
        config$$4.firstRow < oldConfig.firstRow ? _self$$4.$renderLinesFragment(config$$4, config$$4.firstRow, oldConfig.firstRow - 1, function(fragment) {
          el$$9.firstChild ? el$$9.insertBefore(fragment, el$$9.firstChild) : el$$9.appendChild(fragment);
          callback$$16()
        }) : callback$$16()
      }
      function appendBottom() {
        config$$4.lastRow > oldConfig.lastRow && _self$$4.$renderLinesFragment(config$$4, oldConfig.lastRow + 1, config$$4.lastRow, function(fragment$$1) {
          el$$9.appendChild(fragment$$1)
        })
      }
      var _self$$4 = this;
      this.$computeTabString();
      var oldConfig = this.config;
      this.config = config$$4;
      if(!oldConfig || oldConfig.lastRow < config$$4.firstRow) {
        return this.update(config$$4)
      }if(config$$4.lastRow < oldConfig.firstRow) {
        return this.update(config$$4)
      }var el$$9 = this.element;
      if(oldConfig.firstRow < config$$4.firstRow) {
        var row$$48 = oldConfig.firstRow;
        for(;row$$48 < config$$4.firstRow;row$$48++) {
          el$$9.removeChild(el$$9.firstChild)
        }
      }if(oldConfig.lastRow > config$$4.lastRow) {
        row$$48 = config$$4.lastRow + 1;
        for(;row$$48 <= oldConfig.lastRow;row$$48++) {
          el$$9.removeChild(el$$9.lastChild)
        }
      }appendTop(appendBottom)
    };
    this.$renderLinesFragment = function(config$$5, firstRow$$18, lastRow$$19, callback$$17) {
      var fragment$$2 = document.createDocumentFragment();
      var _self$$5 = this;
      this.tokenizer.getTokens(firstRow$$18, lastRow$$19, function(tokens$$3) {
        var row$$49 = firstRow$$18;
        for(;row$$49 <= lastRow$$19;row$$49++) {
          var lineEl = document.createElement("div");
          lineEl.className = "ace_line";
          var style$$7 = lineEl.style;
          style$$7.height = _self$$5.$characterSize.height + "px";
          style$$7.width = config$$5.width + "px";
          var html$$3 = [];
          _self$$5.$renderLine(html$$3, row$$49, tokens$$3[row$$49 - firstRow$$18].tokens);
          lineEl.innerHTML = html$$3.join("");
          fragment$$2.appendChild(lineEl)
        }callback$$17(fragment$$2)
      })
    };
    this.update = function(config$$6) {
      this.$computeTabString();
      this.config = config$$6;
      var html$$4 = [];
      var _self$$6 = this;
      this.tokenizer.getTokens(config$$6.firstRow, config$$6.lastRow, function(tokens$$4) {
        var i$$30 = config$$6.firstRow;
        for(;i$$30 <= config$$6.lastRow;i$$30++) {
          html$$4.push("<div class='ace_line' style='height:" + _self$$6.$characterSize.height + "px;", "width:", config$$6.width, "px'>");
          _self$$6.$renderLine(html$$4, i$$30, tokens$$4[i$$30 - config$$6.firstRow].tokens);
          html$$4.push("</div>")
        }_self$$6.element = dom$$2.setInnerHtml(_self$$6.element, html$$4.join(""))
      })
    };
    this.$textToken = {text:true, rparen:true, lparen:true};
    this.$renderLine = function(stringBuilder$$3, row$$50, tokens$$5) {
      var spaceRe = /[\v\f \u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000]/g;
      var spaceReplace = "&nbsp;";
      var i$$31 = 0;
      for(;i$$31 < tokens$$5.length;i$$31++) {
        var token$$1 = tokens$$5[i$$31];
        var output = token$$1.value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(spaceRe, spaceReplace).replace(/\t/g, this.$tabString);
        if(this.$textToken[token$$1.type]) {
          stringBuilder$$3.push(output)
        }else {
          var classes$$2 = "ace_" + token$$1.type.replace(/\./g, " ace_");
          stringBuilder$$3.push("<span class='", classes$$2, "'>", output, "</span>")
        }
      }if(this.showInvisibles) {
        row$$50 !== this.doc.getLength() - 1 ? stringBuilder$$3.push("<span class='ace_invisible'>" + this.EOL_CHAR + "</span>") : stringBuilder$$3.push("<span class='ace_invisible'>" + this.EOF_CHAR + "</span>")
      }
    }
  }).call(Text.prototype);
  exports$$27.Text = Text
});
define("ace/layer/cursor", ["require", "exports", "module", "pilot/dom"], function(require$$28, exports$$28) {
  var dom$$3 = require$$28("pilot/dom");
  var Cursor = function(parentEl$$3) {
    this.element = document.createElement("div");
    this.element.className = "ace_layer ace_cursor-layer";
    parentEl$$3.appendChild(this.element);
    this.cursor = document.createElement("div");
    this.cursor.className = "ace_cursor";
    this.isVisible = false
  };
  (function() {
    this.setDocument = function(doc$$18) {
      this.doc = doc$$18
    };
    this.setCursor = function(position$$8, overwrite$$1) {
      this.position = {row:position$$8.row, column:this.doc.documentToScreenColumn(position$$8.row, position$$8.column)};
      overwrite$$1 ? dom$$3.addCssClass(this.cursor, "ace_overwrite") : dom$$3.removeCssClass(this.cursor, "ace_overwrite")
    };
    this.hideCursor = function() {
      this.isVisible = false;
      this.cursor.parentNode && this.cursor.parentNode.removeChild(this.cursor);
      clearInterval(this.blinkId)
    };
    this.showCursor = function() {
      this.isVisible = true;
      this.element.appendChild(this.cursor);
      var cursor$$12 = this.cursor;
      cursor$$12.style.visibility = "visible";
      this.restartTimer()
    };
    this.restartTimer = function() {
      clearInterval(this.blinkId);
      if(!this.isVisible) {
        return
      }var cursor$$13 = this.cursor;
      this.blinkId = setInterval(function() {
        cursor$$13.style.visibility = "hidden";
        setTimeout(function() {
          cursor$$13.style.visibility = "visible"
        }, 400)
      }, 1E3)
    };
    this.getPixelPosition = function() {
      if(!this.config || !this.position) {
        return{left:0, top:0}
      }var cursorLeft = Math.round(this.position.column * this.config.characterWidth);
      var cursorTop = this.position.row * this.config.lineHeight;
      return{left:cursorLeft, top:cursorTop}
    };
    this.update = function(config$$7) {
      if(!this.position) {
        return
      }this.config = config$$7;
      var cursorLeft$$1 = Math.round(this.position.column * config$$7.characterWidth);
      var cursorTop$$1 = this.position.row * config$$7.lineHeight;
      this.pixelPos = {left:cursorLeft$$1, top:cursorTop$$1};
      this.cursor.style.left = cursorLeft$$1 + "px";
      this.cursor.style.top = cursorTop$$1 - config$$7.firstRow * config$$7.lineHeight + "px";
      this.cursor.style.width = config$$7.characterWidth + "px";
      this.cursor.style.height = config$$7.lineHeight + "px";
      this.isVisible && this.element.appendChild(this.cursor);
      this.restartTimer()
    }
  }).call(Cursor.prototype);
  exports$$28.Cursor = Cursor
});
define("ace/scrollbar", ["require", "exports", "module", "pilot/oop", "pilot/dom", "pilot/event", "pilot/event_emitter"], function(require$$29, exports$$29) {
  var oop$$7 = require$$29("pilot/oop");
  var dom$$4 = require$$29("pilot/dom");
  var event$$3 = require$$29("pilot/event");
  var EventEmitter$$7 = require$$29("pilot/event_emitter").EventEmitter;
  var ScrollBar = function(parent) {
    this.element = document.createElement("div");
    this.element.className = "ace_sb";
    this.inner = document.createElement("div");
    this.element.appendChild(this.inner);
    parent.appendChild(this.element);
    this.width = dom$$4.scrollbarWidth();
    this.element.style.width = this.width;
    event$$3.addListener(this.element, "scroll", this.onScroll.bind(this))
  };
  (function() {
    oop$$7.implement(this, EventEmitter$$7);
    this.onScroll = function() {
      this._dispatchEvent("scroll", {data:this.element.scrollTop})
    };
    this.getWidth = function() {
      return this.width
    };
    this.setHeight = function(height$$3) {
      this.element.style.height = Math.max(0, height$$3 - this.width) + "px"
    };
    this.setInnerHeight = function(height$$4) {
      this.inner.style.height = height$$4 + "px"
    };
    this.setScrollTop = function(scrollTop$$1) {
      this.element.scrollTop = scrollTop$$1
    }
  }).call(ScrollBar.prototype);
  exports$$29.ScrollBar = ScrollBar
});
define("ace/renderloop", ["require", "exports", "module", "pilot/event"], function(require$$30, exports$$30) {
  var event$$4 = require$$30("pilot/event");
  var RenderLoop = function(onRender) {
    this.onRender = onRender;
    this.pending = false;
    this.changes = 0
  };
  (function() {
    this.schedule = function(change) {
      this.changes |= change;
      if(!this.pending) {
        this.pending = true;
        var _self$$7 = this;
        this.setTimeoutZero(function() {
          _self$$7.pending = false;
          var changes = _self$$7.changes;
          _self$$7.changes = 0;
          _self$$7.onRender(changes)
        })
      }
    };
    if(window.postMessage) {
      this.messageName = "zero-timeout-message";
      this.setTimeoutZero = function(callback$$18) {
        if(!this.attached) {
          var _self$$8 = this;
          event$$4.addListener(window, "message", function(e$$35) {
            if(e$$35.source == window && _self$$8.callback && e$$35.data == _self$$8.messageName) {
              event$$4.stopPropagation(e$$35);
              _self$$8.callback()
            }
          });
          this.attached = true
        }this.callback = callback$$18;
        window.postMessage(this.messageName, "*")
      }
    }else {
      this.setTimeoutZero = function(callback$$19) {
        setTimeout(callback$$19, 0)
      }
    }
  }).call(RenderLoop.prototype);
  exports$$30.RenderLoop = RenderLoop
});
define("ace/virtual_renderer", ["require", "exports", "module", "pilot/oop", "pilot/dom", "pilot/event", "ace/layer/gutter", "ace/layer/marker", "ace/layer/text", "ace/layer/cursor", "ace/scrollbar", "ace/renderloop", "pilot/event_emitter", 'text!ace/css/editor.css!.ace_editor {\n  position: absolute;\n  overflow: hidden;\n\n  font-family: "Menlo", "Monaco", "Courier New", monospace;\n  font-size: 12px;  \n}\n\n.ace_scroller {\n  position: absolute;\n  overflow-x: scroll;\n  overflow-y: hidden;     \n}\n\n.ace_gutter {\n  position: absolute;\n  overflow-x: hidden;\n  overflow-y: hidden;\n  height: 100%;\n}\n\n.ace_editor .ace_sb {\n  position: absolute;\n  overflow-x: hidden;\n  overflow-y: scroll;\n  right: 0;\n}\n\n.ace_editor .ace_sb div {\n  position: absolute;\n  width: 1px;\n  left: 0px;\n}\n\n.ace_editor .ace_printMargin {\n  position: absolute;\n  height: 100%;\n}\n\n.ace_layer {\n  z-index: 0;\n  position: absolute;\n  overflow: hidden;  \n  white-space: nowrap;\n  height: 100%;\n}\n\n.ace_text-layer {\n  font-family: Monaco, "Courier New", monospace;\n  color: black;\n}\n\n.ace_cursor-layer {\n  cursor: text;\n}\n\n.ace_cursor {\n  z-index: 3;\n  position: absolute;\n}\n\n.ace_line {\n  white-space: nowrap;\n}\n\n.ace_marker-layer {\n}\n\n.ace_marker-layer .ace_step {\n  position: absolute;\n  z-index: 2;\n}\n\n.ace_marker-layer .ace_selection {\n  position: absolute;\n  z-index: 3;\n}\n\n.ace_marker-layer .ace_bracket {\n  position: absolute;\n  z-index: 4;\n}\n\n.ace_marker-layer .ace_active_line {\n  position: absolute;\n  z-index: 1;\n}'], 
function(require$$31, exports$$31) {
  var oop$$8 = require$$31("pilot/oop");
  var dom$$5 = require$$31("pilot/dom");
  var event$$5 = require$$31("pilot/event");
  var GutterLayer = require$$31("ace/layer/gutter").Gutter;
  var MarkerLayer = require$$31("ace/layer/marker").Marker;
  var TextLayer = require$$31("ace/layer/text").Text;
  var CursorLayer = require$$31("ace/layer/cursor").Cursor;
  var ScrollBar$$1 = require$$31("ace/scrollbar").ScrollBar;
  var RenderLoop$$1 = require$$31("ace/renderloop").RenderLoop;
  var EventEmitter$$8 = require$$31("pilot/event_emitter").EventEmitter;
  var editorCss = require$$31('text!ace/css/editor.css!.ace_editor {\n  position: absolute;\n  overflow: hidden;\n\n  font-family: "Menlo", "Monaco", "Courier New", monospace;\n  font-size: 12px;  \n}\n\n.ace_scroller {\n  position: absolute;\n  overflow-x: scroll;\n  overflow-y: hidden;     \n}\n\n.ace_gutter {\n  position: absolute;\n  overflow-x: hidden;\n  overflow-y: hidden;\n  height: 100%;\n}\n\n.ace_editor .ace_sb {\n  position: absolute;\n  overflow-x: hidden;\n  overflow-y: scroll;\n  right: 0;\n}\n\n.ace_editor .ace_sb div {\n  position: absolute;\n  width: 1px;\n  left: 0px;\n}\n\n.ace_editor .ace_printMargin {\n  position: absolute;\n  height: 100%;\n}\n\n.ace_layer {\n  z-index: 0;\n  position: absolute;\n  overflow: hidden;  \n  white-space: nowrap;\n  height: 100%;\n}\n\n.ace_text-layer {\n  font-family: Monaco, "Courier New", monospace;\n  color: black;\n}\n\n.ace_cursor-layer {\n  cursor: text;\n}\n\n.ace_cursor {\n  z-index: 3;\n  position: absolute;\n}\n\n.ace_line {\n  white-space: nowrap;\n}\n\n.ace_marker-layer {\n}\n\n.ace_marker-layer .ace_step {\n  position: absolute;\n  z-index: 2;\n}\n\n.ace_marker-layer .ace_selection {\n  position: absolute;\n  z-index: 3;\n}\n\n.ace_marker-layer .ace_bracket {\n  position: absolute;\n  z-index: 4;\n}\n\n.ace_marker-layer .ace_active_line {\n  position: absolute;\n  z-index: 1;\n}');
  dom$$5.importCssString(editorCss);
  var VirtualRenderer = function(container$$1, theme$$1) {
    this.container = container$$1;
    dom$$5.addCssClass(this.container, "ace_editor");
    this.setTheme(theme$$1);
    this.$gutter = document.createElement("div");
    this.$gutter.className = "ace_gutter";
    this.container.appendChild(this.$gutter);
    this.scroller = document.createElement("div");
    this.scroller.className = "ace_scroller";
    this.container.appendChild(this.scroller);
    this.content = document.createElement("div");
    this.content.style.position = "absolute";
    this.scroller.appendChild(this.content);
    this.$gutterLayer = new GutterLayer(this.$gutter);
    this.$markerLayer = new MarkerLayer(this.content);
    var textLayer = this.$textLayer = new TextLayer(this.content);
    this.canvas = textLayer.element;
    this.characterWidth = textLayer.getCharacterWidth();
    this.lineHeight = textLayer.getLineHeight();
    this.$cursorLayer = new CursorLayer(this.content);
    this.layers = [this.$markerLayer, textLayer, this.$cursorLayer];
    this.scrollBar = new ScrollBar$$1(container$$1);
    this.scrollBar.addEventListener("scroll", this.onScroll.bind(this));
    this.scrollTop = 0;
    this.cursorPos = {row:0, column:0};
    var self$$8 = this;
    this.$textLayer.addEventListener("changeCharaterSize", function() {
      self$$8.characterWidth = textLayer.getCharacterWidth();
      self$$8.lineHeight = textLayer.getLineHeight();
      self$$8.$loop.schedule(self$$8.CHANGE_FULL)
    });
    event$$5.addListener(this.$gutter, "click", this.$onGutterClick.bind(this));
    event$$5.addListener(this.$gutter, "dblclick", this.$onGutterClick.bind(this));
    this.$size = {width:0, height:0, scrollerHeight:0, scrollerWidth:0};
    this.$loop = new RenderLoop$$1(this.$renderChanges.bind(this));
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
    oop$$8.implement(this, EventEmitter$$8);
    this.setDocument = function(doc$$19) {
      this.lines = doc$$19.lines;
      this.doc = doc$$19;
      this.$cursorLayer.setDocument(doc$$19);
      this.$markerLayer.setDocument(doc$$19);
      this.$textLayer.setDocument(doc$$19);
      this.$loop.schedule(this.CHANGE_FULL)
    };
    this.updateLines = function(firstRow$$19, lastRow$$20) {
      if(lastRow$$20 === undefined) {
        lastRow$$20 = Infinity
      }if(this.$changedLines) {
        if(this.$changedLines.firstRow > firstRow$$19) {
          this.$changedLines.firstRow = firstRow$$19
        }if(this.$changedLines.lastRow < lastRow$$20) {
          this.$changedLines.lastRow = lastRow$$20
        }
      }else {
        this.$changedLines = {firstRow:firstRow$$19, lastRow:lastRow$$20}
      }this.$loop.schedule(this.CHANGE_LINES)
    };
    this.updateText = function() {
      this.$loop.schedule(this.CHANGE_TEXT)
    };
    this.updateFull = function() {
      this.$loop.schedule(this.CHANGE_FULL)
    };
    this.onResize = function() {
      var changes$$1 = this.CHANGE_SIZE;
      var height$$5 = dom$$5.getInnerHeight(this.container);
      if(this.$size.height != height$$5) {
        this.$size.height = height$$5;
        this.scroller.style.height = height$$5 + "px";
        this.scrollBar.setHeight(height$$5);
        if(this.doc) {
          this.scrollToY(this.getScrollTop());
          changes$$1 |= this.CHANGE_FULL
        }
      }var width$$2 = dom$$5.getInnerWidth(this.container);
      if(this.$size.width != width$$2) {
        this.$size.width = width$$2;
        var gutterWidth = this.showGutter ? this.$gutter.offsetWidth : 0;
        this.scroller.style.left = gutterWidth + "px";
        this.scroller.style.width = Math.max(0, width$$2 - gutterWidth - this.scrollBar.getWidth()) + "px"
      }this.$size.scrollerWidth = this.scroller.clientWidth;
      this.$size.scrollerHeight = this.scroller.clientHeight;
      this.$loop.schedule(changes$$1)
    };
    this.setTokenizer = function(tokenizer$$4) {
      this.$tokenizer = tokenizer$$4;
      this.$textLayer.setTokenizer(tokenizer$$4);
      this.$loop.schedule(this.CHANGE_TEXT)
    };
    this.$onGutterClick = function(e$$36) {
      var pageX$$1 = event$$5.getDocumentX(e$$36);
      var pageY$$1 = event$$5.getDocumentY(e$$36);
      this._dispatchEvent("gutter" + e$$36.type, {row:this.screenToTextCoordinates(pageX$$1, pageY$$1).row, htmlEvent:e$$36})
    };
    this.setShowInvisibles = function(showInvisibles$$2) {
      this.$textLayer.setShowInvisibles(showInvisibles$$2) && this.$loop.schedule(this.CHANGE_TEXT)
    };
    this.getShowInvisibles = function() {
      return this.$textLayer.showInvisibles
    };
    this.$showPrintMargin = true;
    this.setShowPrintMargin = function(showPrintMargin$$2) {
      this.$showPrintMargin = showPrintMargin$$2;
      this.$updatePrintMargin()
    };
    this.getShowPrintMargin = function() {
      return this.$showPrintMargin
    };
    this.$printMarginColumn = 80;
    this.setPrintMarginColumn = function(showPrintMargin$$3) {
      this.$printMarginColumn = showPrintMargin$$3;
      this.$updatePrintMargin()
    };
    this.getPrintMarginColumn = function() {
      return this.$printMarginColumn
    };
    this.setShowGutter = function(show) {
      this.$gutter.style.display = show ? "block" : "none";
      this.showGutter = show;
      this.onResize()
    };
    this.$updatePrintMargin = function() {
      if(!this.$showPrintMargin && !this.$printMarginEl) {
        return
      }if(!this.$printMarginEl) {
        this.$printMarginEl = document.createElement("div");
        this.$printMarginEl.className = "ace_printMargin";
        this.content.insertBefore(this.$printMarginEl, this.$textLayer.element)
      }var style$$8 = this.$printMarginEl.style;
      style$$8.left = this.characterWidth * this.$printMarginColumn + "px";
      style$$8.visibility = this.$showPrintMargin ? "visible" : "hidden"
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
      }var flint = Math.floor((this.layerConfig.height + this.layerConfig.offset) / this.layerConfig.lineHeight);
      return this.layerConfig.firstRow - 1 + flint
    };
    this.getLastVisibleRow = function() {
      return(this.layerConfig || {}).lastRow || 0
    };
    this.$padding = null;
    this.setPadding = function(padding) {
      this.$padding = padding;
      this.content.style.padding = "0 " + padding + "px";
      this.$loop.schedule(this.CHANGE_FULL)
    };
    this.onScroll = function(e$$37) {
      this.scrollToY(e$$37.data)
    };
    this.$updateScrollBar = function() {
      this.scrollBar.setInnerHeight(this.doc.getLength() * this.lineHeight);
      this.scrollBar.setScrollTop(this.scrollTop)
    };
    this.$renderChanges = function(changes$$2) {
      if(!changes$$2 || !this.doc || !this.$tokenizer) {
        return
      }if(!this.layerConfig || changes$$2 & this.CHANGE_FULL || changes$$2 & this.CHANGE_SIZE || changes$$2 & this.CHANGE_TEXT || changes$$2 & this.CHANGE_LINES || changes$$2 & this.CHANGE_SCROLL) {
        this.$computeLayerConfig()
      }if(changes$$2 & this.CHANGE_FULL) {
        this.$textLayer.update(this.layerConfig);
        this.showGutter && this.$gutterLayer.update(this.layerConfig);
        this.$markerLayer.update(this.layerConfig);
        this.$cursorLayer.update(this.layerConfig);
        this.$updateScrollBar();
        return
      }if(changes$$2 & this.CHANGE_SCROLL) {
        changes$$2 & this.CHANGE_TEXT || changes$$2 & this.CHANGE_LINES ? this.$textLayer.update(this.layerConfig) : this.$textLayer.scrollLines(this.layerConfig);
        this.showGutter && this.$gutterLayer.update(this.layerConfig);
        this.$markerLayer.update(this.layerConfig);
        this.$cursorLayer.update(this.layerConfig);
        this.$updateScrollBar();
        return
      }if(changes$$2 & this.CHANGE_TEXT) {
        this.$textLayer.update(this.layerConfig);
        this.showGutter && this.$gutterLayer.update(this.layerConfig)
      }else {
        if(changes$$2 & this.CHANGE_LINES) {
          this.$updateLines();
          this.$updateScrollBar();
          this.showGutter && this.$gutterLayer.update(this.layerConfig)
        }else {
          changes$$2 & this.CHANGE_GUTTER && this.showGutter && this.$gutterLayer.update(this.layerConfig)
        }
      }changes$$2 & this.CHANGE_CURSOR && this.$cursorLayer.update(this.layerConfig);
      changes$$2 & this.CHANGE_MARKER && this.$markerLayer.update(this.layerConfig);
      changes$$2 & this.CHANGE_SIZE && this.$updateScrollBar()
    };
    this.$computeLayerConfig = function() {
      var offset$$3 = this.scrollTop % this.lineHeight;
      var minHeight = this.$size.scrollerHeight + this.lineHeight;
      var longestLine$$1 = this.$getLongestLine();
      var widthChanged = !this.layerConfig ? true : this.layerConfig.width != longestLine$$1;
      var lineCount$$1 = Math.ceil(minHeight / this.lineHeight);
      var firstRow$$20 = Math.max(0, Math.round((this.scrollTop - offset$$3) / this.lineHeight));
      var lastRow$$21 = Math.max(0, Math.min(this.lines.length, firstRow$$20 + lineCount$$1) - 1);
      this.layerConfig = {width:longestLine$$1, padding:this.$padding, firstRow:firstRow$$20, lastRow:lastRow$$21, lineHeight:this.lineHeight, characterWidth:this.characterWidth, minHeight:minHeight, offset:offset$$3, height:this.$size.scrollerHeight};
      var i$$32 = 0;
      for(;i$$32 < this.layers.length;i$$32++) {
        var layer = this.layers[i$$32];
        if(widthChanged) {
          var style$$9 = layer.element.style;
          style$$9.width = longestLine$$1 + "px"
        }
      }this.$gutterLayer.element.style.marginTop = -offset$$3 + "px";
      this.content.style.marginTop = -offset$$3 + "px";
      this.content.style.width = longestLine$$1 + "px";
      this.content.style.height = minHeight + "px"
    };
    this.$updateLines = function() {
      var firstRow$$21 = this.$changedLines.firstRow;
      var lastRow$$22 = this.$changedLines.lastRow;
      this.$changedLines = null;
      var layerConfig$$5 = this.layerConfig;
      if(layerConfig$$5.width != this.$getLongestLine()) {
        return this.$textLayer.update(layerConfig$$5)
      }if(firstRow$$21 > layerConfig$$5.lastRow + 1) {
        return
      }if(lastRow$$22 < layerConfig$$5.firstRow) {
        return
      }if(lastRow$$22 === Infinity) {
        this.showGutter && this.$gutterLayer.update(layerConfig$$5);
        this.$textLayer.update(layerConfig$$5);
        return
      }this.$textLayer.updateLines(layerConfig$$5, firstRow$$21, lastRow$$22)
    };
    this.$getLongestLine = function() {
      var charCount = this.doc.getScreenWidth();
      if(this.$textLayer.showInvisibles) {
        charCount += 1
      }return Math.max(this.$size.scrollerWidth - this.$padding * 2, Math.round(charCount * this.characterWidth))
    };
    this.addMarker = function(range$$29, clazz$$4, type$$7) {
      var id$$1 = this.$markerLayer.addMarker(range$$29, clazz$$4, type$$7);
      this.$loop.schedule(this.CHANGE_MARKER);
      return id$$1
    };
    this.removeMarker = function(markerId$$1) {
      this.$markerLayer.removeMarker(markerId$$1);
      this.$loop.schedule(this.CHANGE_MARKER)
    };
    this.addGutterDecoration = function(row$$51, className$$3) {
      this.$gutterLayer.addGutterDecoration(row$$51, className$$3);
      this.$loop.schedule(this.CHANGE_GUTTER)
    };
    this.removeGutterDecoration = function(row$$52, className$$4) {
      this.$gutterLayer.removeGutterDecoration(row$$52, className$$4);
      this.$loop.schedule(this.CHANGE_GUTTER)
    };
    this.setBreakpoints = function(rows$$11) {
      this.$gutterLayer.setBreakpoints(rows$$11);
      this.$loop.schedule(this.CHANGE_GUTTER)
    };
    this.updateCursor = function(position$$9, overwrite$$2) {
      this.$cursorLayer.setCursor(position$$9, overwrite$$2);
      this.$loop.schedule(this.CHANGE_CURSOR)
    };
    this.hideCursor = function() {
      this.$cursorLayer.hideCursor()
    };
    this.showCursor = function() {
      this.$cursorLayer.showCursor()
    };
    this.scrollCursorIntoView = function() {
      var pos$$6 = this.$cursorLayer.getPixelPosition();
      var left$$2 = pos$$6.left + this.$padding;
      var top$$2 = pos$$6.top;
      this.getScrollTop() > top$$2 && this.scrollToY(top$$2);
      this.getScrollTop() + this.$size.scrollerHeight < top$$2 + this.lineHeight && this.scrollToY(top$$2 + this.lineHeight - this.$size.scrollerHeight);
      this.scroller.scrollLeft > left$$2 && this.scrollToX(left$$2);
      this.scroller.scrollLeft + this.$size.scrollerWidth < left$$2 + this.characterWidth && this.scrollToX(Math.round(left$$2 + this.characterWidth - this.$size.scrollerWidth))
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
    this.scrollToRow = function(row$$53) {
      this.scrollToY(row$$53 * this.lineHeight)
    };
    this.scrollToY = function(scrollTop$$2) {
      var maxHeight = this.lines.length * this.lineHeight - this.$size.scrollerHeight;
      scrollTop$$2 = Math.max(0, Math.min(maxHeight, scrollTop$$2));
      if(this.scrollTop !== scrollTop$$2) {
        this.scrollTop = scrollTop$$2;
        this.$loop.schedule(this.CHANGE_SCROLL)
      }
    };
    this.scrollToX = function(scrollLeft$$1) {
      if(scrollLeft$$1 <= this.$padding) {
        scrollLeft$$1 = 0
      }this.scroller.scrollLeft = scrollLeft$$1
    };
    this.scrollBy = function(deltaX, deltaY) {
      deltaY && this.scrollToY(this.scrollTop + deltaY);
      deltaX && this.scrollToX(this.scroller.scrollLeft + deltaX)
    };
    this.screenToTextCoordinates = function(pageX$$2, pageY$$2) {
      var canvasPos = this.scroller.getBoundingClientRect();
      var col = Math.round((pageX$$2 + this.scroller.scrollLeft - canvasPos.left - this.$padding) / this.characterWidth);
      var row$$54 = Math.floor((pageY$$2 + this.scrollTop - canvasPos.top) / this.lineHeight);
      return{row:row$$54, column:this.doc.screenToDocumentColumn(Math.max(0, Math.min(row$$54, this.doc.getLength() - 1)), col)}
    };
    this.textToScreenCoordinates = function(row$$55, column$$24) {
      var canvasPos$$1 = this.scroller.getBoundingClientRect();
      var x = this.$padding + Math.round(this.doc.documentToScreenColumn(row$$55, column$$24) * this.characterWidth);
      var y = row$$55 * this.lineHeight;
      return{pageX:canvasPos$$1.left + x - this.getScrollLeft(), pageY:canvasPos$$1.top + y - this.getScrollTop()}
    };
    this.visualizeFocus = function() {
      dom$$5.addCssClass(this.container, "ace_focus")
    };
    this.visualizeBlur = function() {
      dom$$5.removeCssClass(this.container, "ace_focus")
    };
    this.showComposition = function() {
    };
    this.setCompositionText = function() {
    };
    this.hideComposition = function() {
    };
    this.setTheme = function(theme$$2) {
      function afterLoad(theme$$3) {
        _self$$9.$theme && dom$$5.removeCssClass(_self$$9.container, _self$$9.$theme);
        _self$$9.$theme = theme$$3 ? theme$$3.cssClass : null;
        _self$$9.$theme && dom$$5.addCssClass(_self$$9.container, _self$$9.$theme);
        if(_self$$9.$size) {
          _self$$9.$size.width = 0;
          _self$$9.onResize()
        }
      }
      var _self$$9 = this;
      if(!theme$$2 || typeof theme$$2 == "string") {
        theme$$2 = theme$$2 || "ace/theme/textmate";
        require$$31([theme$$2], function(theme$$4) {
          afterLoad(theme$$4)
        })
      }else {
        afterLoad(theme$$2)
      }_self$$9 = this
    }
  }).call(VirtualRenderer.prototype);
  exports$$31.VirtualRenderer = VirtualRenderer
});
define("ace/theme/textmate", ["require", "exports", "module", "pilot/dom", "text!ace/theme/tm.css!.ace-tm .ace_editor {\n  border: 2px solid rgb(159, 159, 159);\n}\n\n.ace-tm .ace_editor.ace_focus {\n  border: 2px solid #327fbd;\n}\n\n.ace-tm .ace_gutter {\n  width: 50px;\n  background: #e8e8e8;\n  color: #333;\n  overflow : hidden;\n}\n\n.ace-tm .ace_gutter-layer {\n  width: 100%;\n  text-align: right;\n}\n\n.ace-tm .ace_gutter-layer .ace_gutter-cell {\n  padding-right: 6px;\n}\n\n.ace-tm .ace_editor .ace_printMargin {\n  width: 1px;\n  background: #e8e8e8;\n}\n\n.ace-tm .ace_text-layer {\n  cursor: text;\n}\n\n.ace-tm .ace_cursor {\n  border-left: 2px solid black;\n}\n\n.ace-tm .ace_cursor.ace_overwrite {\n  border-left: 0px;\n  border-bottom: 1px solid black;\n}\n        \n.ace-tm .ace_line .ace_invisible {\n  color: rgb(191, 191, 191);\n}\n\n.ace-tm .ace_line .ace_keyword {\n  color: blue;\n}\n\n.ace-tm .ace_line .ace_constant.ace_buildin {\n  color: rgb(88, 72, 246);\n}\n\n.ace-tm .ace_line .ace_constant.ace_language {\n  color: rgb(88, 92, 246);\n}\n\n.ace-tm .ace_line .ace_constant.ace_library {\n  color: rgb(6, 150, 14);\n}\n\n.ace-tm .ace_line .ace_invalid {\n  background-color: rgb(153, 0, 0);\n  color: white;\n}\n\n.ace-tm .ace_line .ace_support.ace_function {\n  color: rgb(60, 76, 114);\n}\n\n.ace-tm .ace_line .ace_support.ace_constant {\n  color: rgb(6, 150, 14);\n}\n\n.ace-tm .ace_line .ace_support.ace_type,\n.ace-tm .ace_line .ace_support.ace_class {\n  color: rgb(109, 121, 222);\n}\n\n.ace-tm .ace_line .ace_keyword.ace_operator {\n  color: rgb(104, 118, 135);\n}\n\n.ace-tm .ace_line .ace_string {\n  color: rgb(3, 106, 7);\n}\n\n.ace-tm .ace_line .ace_comment {\n  color: rgb(76, 136, 107);\n}\n\n.ace-tm .ace_line .ace_comment.ace_doc {\n  color: rgb(0, 102, 255);\n}\n\n.ace-tm .ace_line .ace_comment.ace_doc.ace_tag {\n  color: rgb(128, 159, 191);\n}\n\n.ace-tm .ace_line .ace_constant.ace_numeric {\n  color: rgb(0, 0, 205);\n}\n\n.ace-tm .ace_line .ace_variable {\n  color: rgb(49, 132, 149);\n}\n\n.ace-tm .ace_line .ace_xml_pe {\n  color: rgb(104, 104, 91);\n}\n\n.ace-tm .ace_marker-layer .ace_selection {\n  background: rgb(181, 213, 255);\n}\n\n.ace-tm .ace_marker-layer .ace_step {\n  background: rgb(252, 255, 0);\n}\n\n.ace-tm .ace_marker-layer .ace_stack {\n  background: rgb(164, 229, 101);\n}\n\n.ace-tm .ace_marker-layer .ace_bracket {\n  margin: -1px 0 0 -1px;\n  border: 1px solid rgb(192, 192, 192);\n}\n\n.ace-tm .ace_marker-layer .ace_active_line {\n  background: rgb(232, 242, 254);\n}\n\n.ace-tm .ace_string.ace_regex {\n  color: rgb(255, 0, 0)   \n}"], 
function(require$$32, exports$$32) {
  var dom$$6 = require$$32("pilot/dom");
  var cssText$$1 = require$$32("text!ace/theme/tm.css!.ace-tm .ace_editor {\n  border: 2px solid rgb(159, 159, 159);\n}\n\n.ace-tm .ace_editor.ace_focus {\n  border: 2px solid #327fbd;\n}\n\n.ace-tm .ace_gutter {\n  width: 50px;\n  background: #e8e8e8;\n  color: #333;\n  overflow : hidden;\n}\n\n.ace-tm .ace_gutter-layer {\n  width: 100%;\n  text-align: right;\n}\n\n.ace-tm .ace_gutter-layer .ace_gutter-cell {\n  padding-right: 6px;\n}\n\n.ace-tm .ace_editor .ace_printMargin {\n  width: 1px;\n  background: #e8e8e8;\n}\n\n.ace-tm .ace_text-layer {\n  cursor: text;\n}\n\n.ace-tm .ace_cursor {\n  border-left: 2px solid black;\n}\n\n.ace-tm .ace_cursor.ace_overwrite {\n  border-left: 0px;\n  border-bottom: 1px solid black;\n}\n        \n.ace-tm .ace_line .ace_invisible {\n  color: rgb(191, 191, 191);\n}\n\n.ace-tm .ace_line .ace_keyword {\n  color: blue;\n}\n\n.ace-tm .ace_line .ace_constant.ace_buildin {\n  color: rgb(88, 72, 246);\n}\n\n.ace-tm .ace_line .ace_constant.ace_language {\n  color: rgb(88, 92, 246);\n}\n\n.ace-tm .ace_line .ace_constant.ace_library {\n  color: rgb(6, 150, 14);\n}\n\n.ace-tm .ace_line .ace_invalid {\n  background-color: rgb(153, 0, 0);\n  color: white;\n}\n\n.ace-tm .ace_line .ace_support.ace_function {\n  color: rgb(60, 76, 114);\n}\n\n.ace-tm .ace_line .ace_support.ace_constant {\n  color: rgb(6, 150, 14);\n}\n\n.ace-tm .ace_line .ace_support.ace_type,\n.ace-tm .ace_line .ace_support.ace_class {\n  color: rgb(109, 121, 222);\n}\n\n.ace-tm .ace_line .ace_keyword.ace_operator {\n  color: rgb(104, 118, 135);\n}\n\n.ace-tm .ace_line .ace_string {\n  color: rgb(3, 106, 7);\n}\n\n.ace-tm .ace_line .ace_comment {\n  color: rgb(76, 136, 107);\n}\n\n.ace-tm .ace_line .ace_comment.ace_doc {\n  color: rgb(0, 102, 255);\n}\n\n.ace-tm .ace_line .ace_comment.ace_doc.ace_tag {\n  color: rgb(128, 159, 191);\n}\n\n.ace-tm .ace_line .ace_constant.ace_numeric {\n  color: rgb(0, 0, 205);\n}\n\n.ace-tm .ace_line .ace_variable {\n  color: rgb(49, 132, 149);\n}\n\n.ace-tm .ace_line .ace_xml_pe {\n  color: rgb(104, 104, 91);\n}\n\n.ace-tm .ace_marker-layer .ace_selection {\n  background: rgb(181, 213, 255);\n}\n\n.ace-tm .ace_marker-layer .ace_step {\n  background: rgb(252, 255, 0);\n}\n\n.ace-tm .ace_marker-layer .ace_stack {\n  background: rgb(164, 229, 101);\n}\n\n.ace-tm .ace_marker-layer .ace_bracket {\n  margin: -1px 0 0 -1px;\n  border: 1px solid rgb(192, 192, 192);\n}\n\n.ace-tm .ace_marker-layer .ace_active_line {\n  background: rgb(232, 242, 254);\n}\n\n.ace-tm .ace_string.ace_regex {\n  color: rgb(255, 0, 0)   \n}");
  dom$$6.importCssString(cssText$$1);
  exports$$32.cssClass = "ace-tm"
});
define("ace/mode/doc_comment_highlight_rules", ["require", "exports", "module", "pilot/oop", "ace/mode/text_highlight_rules"], function(require$$33, exports$$33) {
  var oop$$9 = require$$33("pilot/oop");
  var TextHighlightRules$$2 = require$$33("ace/mode/text_highlight_rules").TextHighlightRules;
  var DocCommentHighlightRules = function() {
    this.$rules = {start:[{token:"comment.doc", regex:"\\*\\/", next:"start"}, {token:"comment.doc.tag", regex:"@[\\w\\d_]+"}, {token:"comment.doc", regex:"s+"}, {token:"comment.doc", regex:"TODO"}, {token:"comment.doc", regex:"[^@\\*]+"}, {token:"comment.doc", regex:"."}]}
  };
  oop$$9.inherits(DocCommentHighlightRules, TextHighlightRules$$2);
  (function() {
    this.getStartRule = function(start$$6) {
      return{token:"comment.doc", regex:"\\/\\*(?=\\*)", next:start$$6}
    }
  }).call(DocCommentHighlightRules.prototype);
  exports$$33.DocCommentHighlightRules = DocCommentHighlightRules
});
define("ace/mode/javascript_highlight_rules", ["require", "exports", "module", "pilot/oop", "pilot/lang", "ace/mode/doc_comment_highlight_rules", "ace/mode/text_highlight_rules"], function(require$$34, exports$$34) {
  var oop$$10 = require$$34("pilot/oop");
  var lang$$6 = require$$34("pilot/lang");
  var DocCommentHighlightRules$$1 = require$$34("ace/mode/doc_comment_highlight_rules").DocCommentHighlightRules;
  var TextHighlightRules$$3 = require$$34("ace/mode/text_highlight_rules").TextHighlightRules;
  JavaScriptHighlightRules = function() {
    var docComment = new DocCommentHighlightRules$$1;
    var keywords = lang$$6.arrayToMap("break|case|catch|continue|default|delete|do|else|finally|for|function|if|in|instanceof|new|return|switch|throw|try|typeof|var|while|with".split("|"));
    var buildinConstants = lang$$6.arrayToMap("null|Infinity|NaN|undefined".split("|"));
    var futureReserved = lang$$6.arrayToMap("class|enum|extends|super|const|export|import|implements|let|private|public|yield|interface|package|protected|static".split("|"));
    this.$rules = {start:[{token:"comment", regex:"\\/\\/.*$"}, docComment.getStartRule("doc-start"), {token:"comment", regex:"\\/\\*", next:"comment"}, {token:"string.regexp", regex:"[/](?:(?:\\[(?:\\\\]|[^\\]])+\\])|(?:\\\\/|[^\\]/]))*[/][gimy]*\\s*(?=[).,;]|$)"}, {token:"string", regex:'["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'}, {token:"string", regex:'["].*\\\\$', next:"qqstring"}, {token:"string", regex:"['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"}, {token:"string", regex:"['].*\\\\$", next:"qstring"}, {token:"constant.numeric", 
    regex:"0[xX][0-9a-fA-F]+\\b"}, {token:"constant.numeric", regex:"[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"}, {token:"constant.language.boolean", regex:"(?:true|false)\\b"}, {token:function(value$$8) {
      return value$$8 == "this" ? "variable.language" : keywords[value$$8] ? "keyword" : buildinConstants[value$$8] ? "constant.language" : futureReserved[value$$8] ? "invalid.illegal" : value$$8 == "debugger" ? "invalid.deprecated" : "identifier"
    }, regex:"[a-zA-Z_$][a-zA-Z0-9_$]*\\b"}, {token:"keyword.operator", regex:"!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|\\b(?:in|instanceof|new|delete|typeof|void)"}, {token:"lparen", regex:"[[({]"}, {token:"rparen", regex:"[\\])}]"}, {token:"text", regex:"\\s+"}], comment:[{token:"comment", regex:".*?\\*\\/", next:"start"}, {token:"comment", regex:".+"}], qqstring:[{token:"string", regex:'(?:(?:\\\\.)|(?:[^"\\\\]))*?"', 
    next:"start"}, {token:"string", regex:".+"}], qstring:[{token:"string", regex:"(?:(?:\\\\.)|(?:[^'\\\\]))*?'", next:"start"}, {token:"string", regex:".+"}]};
    this.addRules(docComment.getRules(), "doc-");
    this.$rules["doc-start"][0].next = "start"
  };
  oop$$10.inherits(JavaScriptHighlightRules, TextHighlightRules$$3);
  exports$$34.JavaScriptHighlightRules = JavaScriptHighlightRules
});
define("ace/mode/matching_brace_outdent", ["require", "exports", "module", "ace/range"], function(require$$35, exports$$35) {
  var Range$$6 = require$$35("ace/range").Range;
  var MatchingBraceOutdent = function() {
  };
  (function() {
    this.checkOutdent = function(line$$21, input$$3) {
      if(!/^\s+$/.test(line$$21)) {
        return false
      }return/^\s*\}/.test(input$$3)
    };
    this.autoOutdent = function(doc$$20, row$$56) {
      var line$$22 = doc$$20.getLine(row$$56);
      var match$$9 = line$$22.match(/^(\s*\})/);
      if(!match$$9) {
        return 0
      }var column$$25 = match$$9[1].length;
      var openBracePos = doc$$20.findMatchingBracket({row:row$$56, column:column$$25});
      if(!openBracePos || openBracePos.row == row$$56) {
        return 0
      }var indent$$1 = this.$getIndent(doc$$20.getLine(openBracePos.row));
      doc$$20.replace(new Range$$6(row$$56, 0, row$$56, column$$25 - 1), indent$$1);
      return indent$$1.length - (column$$25 - 1)
    };
    this.$getIndent = function(line$$23) {
      var match$$10 = line$$23.match(/^(\s+)/);
      if(match$$10) {
        return match$$10[1]
      }return""
    }
  }).call(MatchingBraceOutdent.prototype);
  exports$$35.MatchingBraceOutdent = MatchingBraceOutdent
});
define("ace/mode/javascript", ["require", "exports", "module", "pilot/oop", "ace/mode/text", "ace/tokenizer", "ace/mode/javascript_highlight_rules", "ace/mode/matching_brace_outdent", "ace/range"], function(require$$36, exports$$36) {
  var oop$$11 = require$$36("pilot/oop");
  var TextMode$$1 = require$$36("ace/mode/text").Mode;
  var Tokenizer$$2 = require$$36("ace/tokenizer").Tokenizer;
  var JavaScriptHighlightRules$$1 = require$$36("ace/mode/javascript_highlight_rules").JavaScriptHighlightRules;
  var MatchingBraceOutdent$$1 = require$$36("ace/mode/matching_brace_outdent").MatchingBraceOutdent;
  var Range$$7 = require$$36("ace/range").Range;
  var Mode$$1 = function() {
    this.$tokenizer = new Tokenizer$$2((new JavaScriptHighlightRules$$1).getRules());
    this.$outdent = new MatchingBraceOutdent$$1
  };
  oop$$11.inherits(Mode$$1, TextMode$$1);
  (function() {
    this.toggleCommentLines = function(state$$9, doc$$21, startRow$$4, endRow$$3) {
      var outdent$$1 = true;
      var re$$6 = /^(\s*)\/\//;
      var i$$33 = startRow$$4;
      for(;i$$33 <= endRow$$3;i$$33++) {
        if(!re$$6.test(doc$$21.getLine(i$$33))) {
          outdent$$1 = false;
          break
        }
      }if(outdent$$1) {
        var deleteRange$$1 = new Range$$7(0, 0, 0, 0);
        i$$33 = startRow$$4;
        for(;i$$33 <= endRow$$3;i$$33++) {
          var line$$24 = doc$$21.getLine(i$$33).replace(re$$6, "$1");
          deleteRange$$1.start.row = i$$33;
          deleteRange$$1.end.row = i$$33;
          deleteRange$$1.end.column = line$$24.length + 2;
          doc$$21.replace(deleteRange$$1, line$$24)
        }return-2
      }else {
        return doc$$21.indentRows(startRow$$4, endRow$$3, "//")
      }
    };
    this.getNextLineIndent = function(state$$10, line$$25, tab$$2) {
      var indent$$2 = this.$getIndent(line$$25);
      var tokenizedLine = this.$tokenizer.getLineTokens(line$$25, state$$10);
      var tokens$$6 = tokenizedLine.tokens;
      var endState = tokenizedLine.state;
      if(tokens$$6.length && tokens$$6[tokens$$6.length - 1].type == "comment") {
        return indent$$2
      }if(state$$10 == "start") {
        var match$$11 = line$$25.match(/^.*[\{\(\[]\s*$/);
        if(match$$11) {
          indent$$2 += tab$$2
        }
      }else {
        if(state$$10 == "doc-start") {
          if(endState == "start") {
            return""
          }match$$11 = line$$25.match(/^\s*(\/?)\*/);
          if(match$$11) {
            if(match$$11[1]) {
              indent$$2 += " "
            }indent$$2 += "* "
          }
        }
      }return indent$$2
    };
    this.checkOutdent = function(state$$11, line$$26, input$$4) {
      return this.$outdent.checkOutdent(line$$26, input$$4)
    };
    this.autoOutdent = function(state$$12, doc$$22, row$$57) {
      return this.$outdent.autoOutdent(doc$$22, row$$57)
    }
  }).call(Mode$$1.prototype);
  exports$$36.Mode = Mode$$1
});
define("ace/mode/css_highlight_rules", ["require", "exports", "module", "pilot/oop", "pilot/lang", "ace/mode/text_highlight_rules"], function(require$$37, exports$$37) {
  var oop$$12 = require$$37("pilot/oop");
  var lang$$7 = require$$37("pilot/lang");
  var TextHighlightRules$$4 = require$$37("ace/mode/text_highlight_rules").TextHighlightRules;
  var CssHighlightRules = function() {
    function ic(str$$4) {
      var re$$7 = [];
      var chars$$1 = str$$4.split("");
      var i$$34 = 0;
      for(;i$$34 < chars$$1.length;i$$34++) {
        re$$7.push("[", chars$$1[i$$34].toLowerCase(), chars$$1[i$$34].toUpperCase(), "]")
      }return re$$7.join("")
    }
    var properties = lang$$7.arrayToMap("azimuth|background-attachment|background-color|background-image|background-position|background-repeat|background|border-bottom-color|border-bottom-style|border-bottom-width|border-bottom|border-collapse|border-color|border-left-color|border-left-style|border-left-width|border-left|border-right-color|border-right-style|border-right-width|border-right|border-spacing|border-style|border-top-color|border-top-style|border-top-width|border-top|border-width|border|bottom|caption-side|clear|clip|color|content|counter-increment|counter-reset|cue-after|cue-before|cue|cursor|direction|display|elevation|empty-cells|float|font-family|font-size-adjust|font-size|font-stretch|font-style|font-variant|font-weight|font|height|left|letter-spacing|line-height|list-style-image|list-style-position|list-style-type|list-style|margin-bottom|margin-left|margin-right|margin-top|marker-offset|margin|marks|max-height|max-width|min-height|min-width|-moz-border-radius|opacity|orphans|outline-color|outline-style|outline-width|outline|overflow|overflow-x|overflow-y|padding-bottom|padding-left|padding-right|padding-top|padding|page-break-after|page-break-before|page-break-inside|page|pause-after|pause-before|pause|pitch-range|pitch|play-during|position|quotes|richness|right|size|speak-header|speak-numeral|speak-punctuation|speech-rate|speak|stress|table-layout|text-align|text-decoration|text-indent|text-shadow|text-transform|top|unicode-bidi|vertical-align|visibility|voice-family|volume|white-space|widows|width|word-spacing|z-index".split("|"));
    var functions = lang$$7.arrayToMap("rgb|rgba|url|attr|counter|counters".split("|"));
    var constants = lang$$7.arrayToMap("absolute|all-scroll|always|armenian|auto|baseline|below|bidi-override|block|bold|bolder|both|bottom|break-all|break-word|capitalize|center|char|circle|cjk-ideographic|col-resize|collapse|crosshair|dashed|decimal-leading-zero|decimal|default|disabled|disc|distribute-all-lines|distribute-letter|distribute-space|distribute|dotted|double|e-resize|ellipsis|fixed|georgian|groove|hand|hebrew|help|hidden|hiragana-iroha|hiragana|horizontal|ideograph-alpha|ideograph-numeric|ideograph-parenthesis|ideograph-space|inactive|inherit|inline-block|inline|inset|inside|inter-ideograph|inter-word|italic|justify|katakana-iroha|katakana|keep-all|left|lighter|line-edge|line-through|line|list-item|loose|lower-alpha|lower-greek|lower-latin|lower-roman|lowercase|lr-tb|ltr|medium|middle|move|n-resize|ne-resize|newspaper|no-drop|no-repeat|nw-resize|none|normal|not-allowed|nowrap|oblique|outset|outside|overline|pointer|progress|relative|repeat-x|repeat-y|repeat|right|ridge|row-resize|rtl|s-resize|scroll|se-resize|separate|small-caps|solid|square|static|strict|super|sw-resize|table-footer-group|table-header-group|tb-rl|text-bottom|text-top|text|thick|thin|top|transparent|underline|upper-alpha|upper-latin|upper-roman|uppercase|vertical-ideographic|vertical-text|visible|w-resize|wait|whitespace|zero".split("|"));
    var colors = lang$$7.arrayToMap("aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow".split("|"));
    var numRe = "\\-?(?:(?:[0-9]+)|(?:[0-9]*\\.[0-9]+))";
    this.$rules = {start:[{token:"comment", regex:"\\/\\*", next:"comment"}, {token:"string", regex:'["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'}, {token:"string", regex:"['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"}, {token:"constant.numeric", regex:numRe + ic("em")}, {token:"constant.numeric", regex:numRe + ic("ex")}, {token:"constant.numeric", regex:numRe + ic("px")}, {token:"constant.numeric", regex:numRe + ic("cm")}, {token:"constant.numeric", regex:numRe + ic("mm")}, {token:"constant.numeric", regex:numRe + 
    ic("in")}, {token:"constant.numeric", regex:numRe + ic("pt")}, {token:"constant.numeric", regex:numRe + ic("pc")}, {token:"constant.numeric", regex:numRe + ic("deg")}, {token:"constant.numeric", regex:numRe + ic("rad")}, {token:"constant.numeric", regex:numRe + ic("grad")}, {token:"constant.numeric", regex:numRe + ic("ms")}, {token:"constant.numeric", regex:numRe + ic("s")}, {token:"constant.numeric", regex:numRe + ic("hz")}, {token:"constant.numeric", regex:numRe + ic("khz")}, {token:"constant.numeric", 
    regex:numRe + "%"}, {token:"constant.numeric", regex:numRe}, {token:"constant.numeric", regex:"#[a-fA-F0-9]{6}"}, {token:"constant.numeric", regex:"#[a-fA-F0-9]{3}"}, {token:"lparen", regex:"{"}, {token:"rparen", regex:"}"}, {token:function(value$$9) {
      return properties[value$$9.toLowerCase()] ? "support.type" : functions[value$$9.toLowerCase()] ? "support.function" : constants[value$$9.toLowerCase()] ? "support.constant" : colors[value$$9.toLowerCase()] ? "support.constant.color" : "text"
    }, regex:"\\-?[a-zA-Z_][a-zA-Z0-9_\\-]*"}], comment:[{token:"comment", regex:".*?\\*\\/", next:"start"}, {token:"comment", regex:".+"}]}
  };
  oop$$12.inherits(CssHighlightRules, TextHighlightRules$$4);
  exports$$37.CssHighlightRules = CssHighlightRules
});
define("ace/mode/css", ["require", "exports", "module", "pilot/oop", "ace/mode/text", "ace/tokenizer", "ace/mode/css_highlight_rules", "ace/mode/matching_brace_outdent"], function(require$$38, exports$$38) {
  var oop$$13 = require$$38("pilot/oop");
  var TextMode$$2 = require$$38("ace/mode/text").Mode;
  var Tokenizer$$3 = require$$38("ace/tokenizer").Tokenizer;
  var CssHighlightRules$$1 = require$$38("ace/mode/css_highlight_rules").CssHighlightRules;
  var MatchingBraceOutdent$$2 = require$$38("ace/mode/matching_brace_outdent").MatchingBraceOutdent;
  var Mode$$2 = function() {
    this.$tokenizer = new Tokenizer$$3((new CssHighlightRules$$1).getRules());
    this.$outdent = new MatchingBraceOutdent$$2
  };
  oop$$13.inherits(Mode$$2, TextMode$$2);
  (function() {
    this.getNextLineIndent = function(state$$13, line$$27, tab$$3) {
      var indent$$3 = this.$getIndent(line$$27);
      var tokens$$7 = this.$tokenizer.getLineTokens(line$$27, state$$13).tokens;
      if(tokens$$7.length && tokens$$7[tokens$$7.length - 1].type == "comment") {
        return indent$$3
      }var match$$12 = line$$27.match(/^.*\{\s*$/);
      if(match$$12) {
        indent$$3 += tab$$3
      }return indent$$3
    };
    this.checkOutdent = function(state$$14, line$$28, input$$5) {
      return this.$outdent.checkOutdent(line$$28, input$$5)
    };
    this.autoOutdent = function(state$$15, doc$$23, row$$58) {
      return this.$outdent.autoOutdent(doc$$23, row$$58)
    }
  }).call(Mode$$2.prototype);
  exports$$38.Mode = Mode$$2
});
define("ace/mode/html_highlight_rules", ["require", "exports", "module", "pilot/oop", "ace/mode/css_highlight_rules", "ace/mode/javascript_highlight_rules", "ace/mode/text_highlight_rules"], function(require$$39, exports$$39) {
  var oop$$14 = require$$39("pilot/oop");
  var CssHighlightRules$$2 = require$$39("ace/mode/css_highlight_rules").CssHighlightRules;
  var JavaScriptHighlightRules$$2 = require$$39("ace/mode/javascript_highlight_rules").JavaScriptHighlightRules;
  var TextHighlightRules$$5 = require$$39("ace/mode/text_highlight_rules").TextHighlightRules;
  var HtmlHighlightRules = function() {
    this.$rules = {start:[{token:"text", regex:"<\\!\\[CDATA\\[", next:"cdata"}, {token:"xml_pe", regex:"<\\?.*?\\?>"}, {token:"comment", regex:"<\\!--", next:"comment"}, {token:"text", regex:"<(?=s*script)", next:"script"}, {token:"text", regex:"<(?=s*style)", next:"css"}, {token:"text", regex:"<\\/?", next:"tag"}, {token:"text", regex:"\\s+"}, {token:"text", regex:"[^<]+"}], script:[{token:"text", regex:">", next:"js-start"}, {token:"keyword", regex:"[-_a-zA-Z0-9:]+"}, {token:"text", regex:"\\s+"}, 
    {token:"string", regex:'".*?"'}, {token:"string", regex:"'.*?'"}], css:[{token:"text", regex:">", next:"css-start"}, {token:"keyword", regex:"[-_a-zA-Z0-9:]+"}, {token:"text", regex:"\\s+"}, {token:"string", regex:'".*?"'}, {token:"string", regex:"'.*?'"}], tag:[{token:"text", regex:">", next:"start"}, {token:"keyword", regex:"[-_a-zA-Z0-9:]+"}, {token:"text", regex:"\\s+"}, {token:"string", regex:'".*?"'}, {token:"string", regex:"'.*?'"}], cdata:[{token:"text", regex:"\\]\\]>", next:"start"}, 
    {token:"text", regex:"\\s+"}, {token:"text", regex:".+"}], comment:[{token:"comment", regex:".*?--\>", next:"start"}, {token:"comment", regex:".+"}]};
    var jsRules = (new JavaScriptHighlightRules$$2).getRules();
    this.addRules(jsRules, "js-");
    this.$rules["js-start"].unshift({token:"comment", regex:"\\/\\/.*(?=<\\/script>)", next:"tag"}, {token:"text", regex:"<\\/(?=script)", next:"tag"});
    var cssRules = (new CssHighlightRules$$2).getRules();
    this.addRules(cssRules, "css-");
    this.$rules["css-start"].unshift({token:"text", regex:"<\\/(?=style)", next:"tag"})
  };
  oop$$14.inherits(HtmlHighlightRules, TextHighlightRules$$5);
  exports$$39.HtmlHighlightRules = HtmlHighlightRules
});
define("ace/mode/html", ["require", "exports", "module", "pilot/oop", "ace/mode/text", "ace/mode/javascript", "ace/mode/css", "ace/tokenizer", "ace/mode/html_highlight_rules"], function(require$$40, exports$$40) {
  var oop$$15 = require$$40("pilot/oop");
  var TextMode$$3 = require$$40("ace/mode/text").Mode;
  var JavaScriptMode = require$$40("ace/mode/javascript").Mode;
  var CssMode = require$$40("ace/mode/css").Mode;
  var Tokenizer$$4 = require$$40("ace/tokenizer").Tokenizer;
  var HtmlHighlightRules$$1 = require$$40("ace/mode/html_highlight_rules").HtmlHighlightRules;
  var Mode$$3 = function() {
    this.$tokenizer = new Tokenizer$$4((new HtmlHighlightRules$$1).getRules());
    this.$js = new JavaScriptMode;
    this.$css = new CssMode
  };
  oop$$15.inherits(Mode$$3, TextMode$$3);
  (function() {
    this.toggleCommentLines = function() {
      return this.$delegate("toggleCommentLines", arguments, function() {
        return 0
      })
    };
    this.getNextLineIndent = function(state$$17, line$$29) {
      var self$$9 = this;
      return this.$delegate("getNextLineIndent", arguments, function() {
        return self$$9.$getIndent(line$$29)
      })
    };
    this.checkOutdent = function() {
      return this.$delegate("checkOutdent", arguments, function() {
        return false
      })
    };
    this.autoOutdent = function() {
      return this.$delegate("autoOutdent", arguments)
    };
    this.$delegate = function(method, args$$56, defaultHandler) {
      var state$$20 = args$$56[0];
      var split = state$$20.split("js-");
      if(!split[0] && split[1]) {
        args$$56[0] = split[1];
        return this.$js[method].apply(this.$js, args$$56)
      }split = state$$20.split("css-");
      if(!split[0] && split[1]) {
        args$$56[0] = split[1];
        return this.$css[method].apply(this.$css, args$$56)
      }return defaultHandler ? defaultHandler() : undefined
    }
  }).call(Mode$$3.prototype);
  exports$$40.Mode = Mode$$3
});
define("ace/mode/xml_highlight_rules", ["require", "exports", "module", "pilot/oop", "ace/mode/text_highlight_rules"], function(require$$41, exports$$41) {
  var oop$$16 = require$$41("pilot/oop");
  var TextHighlightRules$$6 = require$$41("ace/mode/text_highlight_rules").TextHighlightRules;
  var XmlHighlightRules = function() {
    this.$rules = {start:[{token:"text", regex:"<\\!\\[CDATA\\[", next:"cdata"}, {token:"xml_pe", regex:"<\\?.*?\\?>"}, {token:"comment", regex:"<\\!--", next:"comment"}, {token:"text", regex:"<\\/?", next:"tag"}, {token:"text", regex:"\\s+"}, {token:"text", regex:"[^<]+"}], tag:[{token:"text", regex:">", next:"start"}, {token:"keyword", regex:"[-_a-zA-Z0-9:]+"}, {token:"text", regex:"\\s+"}, {token:"string", regex:'".*?"'}, {token:"string", regex:"'.*?'"}], cdata:[{token:"text", regex:"\\]\\]>", 
    next:"start"}, {token:"text", regex:"\\s+"}, {token:"text", regex:"(?:[^\\]]|\\](?!\\]>))+"}], comment:[{token:"comment", regex:".*?--\>", next:"start"}, {token:"comment", regex:".+"}]}
  };
  oop$$16.inherits(XmlHighlightRules, TextHighlightRules$$6);
  exports$$41.XmlHighlightRules = XmlHighlightRules
});
define("ace/mode/xml", ["require", "exports", "module", "pilot/oop", "ace/mode/text", "ace/tokenizer", "ace/mode/xml_highlight_rules"], function(require$$42, exports$$42) {
  var oop$$17 = require$$42("pilot/oop");
  var TextMode$$4 = require$$42("ace/mode/text").Mode;
  var Tokenizer$$5 = require$$42("ace/tokenizer").Tokenizer;
  var XmlHighlightRules$$1 = require$$42("ace/mode/xml_highlight_rules").XmlHighlightRules;
  var Mode$$4 = function() {
    this.$tokenizer = new Tokenizer$$5((new XmlHighlightRules$$1).getRules())
  };
  oop$$17.inherits(Mode$$4, TextMode$$4);
  (function() {
    this.getNextLineIndent = function(state$$21, line$$31) {
      return this.$getIndent(line$$31)
    }
  }).call(Mode$$4.prototype);
  exports$$42.Mode = Mode$$4
});
define("ace/mode/python_highlight_rules", ["require", "exports", "module", "pilot/oop", "pilot/lang", "./text_highlight_rules"], function(require$$43, exports$$43) {
  var oop$$18 = require$$43("pilot/oop");
  var lang$$8 = require$$43("pilot/lang");
  var TextHighlightRules$$7 = require$$43("./text_highlight_rules").TextHighlightRules;
  PythonHighlightRules = function() {
    var keywords$$1 = lang$$8.arrayToMap("and|as|assert|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|not|or|pass|print|raise|return|try|while|with|yield".split("|"));
    var builtinConstants = lang$$8.arrayToMap("True|False|None|NotImplemented|Ellipsis|__debug__".split("|"));
    var builtinFunctions = lang$$8.arrayToMap("abs|divmod|input|open|staticmethod|all|enumerate|int|ord|str|any|eval|isinstance|pow|sum|basestring|execfile|issubclass|print|super|binfile|iter|property|tuple|bool|filter|len|range|type|bytearray|float|list|raw_input|unichr|callable|format|locals|reduce|unicode|chr|frozenset|long|reload|vars|classmethod|getattr|map|repr|xrange|cmp|globals|max|reversed|zip|compile|hasattr|memoryview|round|__import__|complex|hash|min|set|apply|delattr|help|next|setattr|buffer|dict|hex|object|slice|coerce|dir|id|oct|sorted|intern".split("|"));
    var futureReserved$$1 = lang$$8.arrayToMap("".split("|"));
    var strPre = "(?:(?:[rubRUB])|(?:[ubUB][rR]))?";
    var decimalInteger = "(?:(?:[1-9]\\d*)|(?:0))";
    var octInteger = "(?:0[oO]?[0-7]+)";
    var hexInteger = "(?:0[xX][\\dA-Fa-f]+)";
    var binInteger = "(?:0[bB][01]+)";
    var integer = "(?:" + decimalInteger + "|" + octInteger + "|" + hexInteger + "|" + binInteger + ")";
    var exponent = "(?:[eE][+-]?\\d+)";
    var fraction = "(?:\\.\\d+)";
    var intPart = "(?:\\d+)";
    var pointFloat = "(?:(?:" + intPart + "?" + fraction + ")|(?:" + intPart + "\\.))";
    var exponentFloat = "(?:(?:" + pointFloat + "|" + intPart + ")" + exponent + ")";
    var floatNumber = "(?:" + exponentFloat + "|" + pointFloat + ")";
    this.$rules = {start:[{token:"comment", regex:"#.*$"}, {token:"string", regex:strPre + '"{3}(?:(?:.)|(?:^"{3}))*?"{3}'}, {token:"string", regex:strPre + '"{3}.*$', next:"qqstring"}, {token:"string", regex:strPre + '"(?:(?:\\\\.)|(?:[^"\\\\]))*?"'}, {token:"string", regex:strPre + "'{3}(?:(?:.)|(?:^'{3}))*?'{3}"}, {token:"string", regex:strPre + "'{3}.*$", next:"qstring"}, {token:"string", regex:strPre + "'(?:(?:\\\\.)|(?:[^'\\\\]))*?'"}, {token:"constant.numeric", regex:"(?:" + floatNumber + 
    "|\\d+)[jJ]\\b"}, {token:"constant.numeric", regex:floatNumber}, {token:"constant.numeric", regex:integer + "[lL]\\b"}, {token:"constant.numeric", regex:integer + "\\b"}, {token:function(value$$10) {
      return keywords$$1[value$$10] ? "keyword" : builtinConstants[value$$10] ? "constant.language" : futureReserved$$1[value$$10] ? "invalid.illegal" : builtinFunctions[value$$10] ? "support.function" : value$$10 == "debugger" ? "invalid.deprecated" : "identifier"
    }, regex:"[a-zA-Z_$][a-zA-Z0-9_$]*\\b"}, {token:"keyword.operator", regex:"\\+|\\-|\\*|\\*\\*|\\/|\\/\\/|%|<<|>>|&|\\||\\^|~|<|>|<=|=>|==|!=|<>|="}, {token:"lparen", regex:"[\\[\\(\\{]"}, {token:"rparen", regex:"[\\]\\)\\}]"}, {token:"text", regex:"\\s+"}], qqstring:[{token:"string", regex:'(?:^"{3})*?"{3}', next:"start"}, {token:"string", regex:".+"}], qstring:[{token:"string", regex:"(?:^'{3})*?'{3}", next:"start"}, {token:"string", regex:".+"}]}
  };
  oop$$18.inherits(PythonHighlightRules, TextHighlightRules$$7);
  exports$$43.PythonHighlightRules = PythonHighlightRules
});
define("ace/mode/python", ["require", "exports", "module", "pilot/oop", "./text", "../tokenizer", "./python_highlight_rules", "./matching_brace_outdent", "../range"], function(require$$44, exports$$44) {
  var oop$$19 = require$$44("pilot/oop");
  var TextMode$$5 = require$$44("./text").Mode;
  var Tokenizer$$6 = require$$44("../tokenizer").Tokenizer;
  var PythonHighlightRules$$1 = require$$44("./python_highlight_rules").PythonHighlightRules;
  var MatchingBraceOutdent$$3 = require$$44("./matching_brace_outdent").MatchingBraceOutdent;
  var Range$$8 = require$$44("../range").Range;
  var Mode$$5 = function() {
    this.$tokenizer = new Tokenizer$$6((new PythonHighlightRules$$1).getRules());
    this.$outdent = new MatchingBraceOutdent$$3
  };
  oop$$19.inherits(Mode$$5, TextMode$$5);
  (function() {
    this.toggleCommentLines = function(state$$22, doc$$26, startRow$$6, endRow$$5) {
      var outdent$$2 = true;
      var re$$8 = /^(\s*)#/;
      var i$$35 = startRow$$6;
      for(;i$$35 <= endRow$$5;i$$35++) {
        if(!re$$8.test(doc$$26.getLine(i$$35))) {
          outdent$$2 = false;
          break
        }
      }if(outdent$$2) {
        var deleteRange$$2 = new Range$$8(0, 0, 0, 0);
        i$$35 = startRow$$6;
        for(;i$$35 <= endRow$$5;i$$35++) {
          var line$$32 = doc$$26.getLine(i$$35).replace(re$$8, "$1");
          deleteRange$$2.start.row = i$$35;
          deleteRange$$2.end.row = i$$35;
          deleteRange$$2.end.column = line$$32.length + 2;
          doc$$26.replace(deleteRange$$2, line$$32)
        }return-2
      }else {
        return doc$$26.indentRows(startRow$$6, endRow$$5, "#")
      }
    };
    this.getNextLineIndent = function(state$$23, line$$33, tab$$6) {
      var indent$$4 = this.$getIndent(line$$33);
      var tokenizedLine$$1 = this.$tokenizer.getLineTokens(line$$33, state$$23);
      var tokens$$8 = tokenizedLine$$1.tokens;
      if(tokens$$8.length && tokens$$8[tokens$$8.length - 1].type == "comment") {
        return indent$$4
      }if(state$$23 == "start") {
        var match$$13 = line$$33.match(/^.*[\{\(\[\:]\s*$/);
        if(match$$13) {
          indent$$4 += tab$$6
        }
      }return indent$$4
    };
    this.checkOutdent = function(state$$24, line$$34, input$$7) {
      return this.$outdent.checkOutdent(line$$34, input$$7)
    };
    this.autoOutdent = function(state$$25, doc$$27, row$$60) {
      return this.$outdent.autoOutdent(doc$$27, row$$60)
    }
  }).call(Mode$$5.prototype);
  exports$$44.Mode = Mode$$5
});
define("ace/mode/php_highlight_rules", ["require", "exports", "module", "pilot/oop", "pilot/lang", "ace/mode/doc_comment_highlight_rules", "ace/mode/text_highlight_rules"], function(require$$45, exports$$45) {
  var oop$$20 = require$$45("pilot/oop");
  var lang$$9 = require$$45("pilot/lang");
  var DocCommentHighlightRules$$2 = require$$45("ace/mode/doc_comment_highlight_rules").DocCommentHighlightRules;
  var TextHighlightRules$$8 = require$$45("ace/mode/text_highlight_rules").TextHighlightRules;
  PhpHighlightRules = function() {
    var docComment$$1 = new DocCommentHighlightRules$$2;
    var builtinFunctions$$1 = lang$$9.arrayToMap("abs|acos|acosh|addcslashes|addslashes|aggregate|aggregate_info|aggregate_methods|aggregate_methods_by_list|aggregate_methods_by_regexp|aggregate_properties|aggregate_properties_by_list|aggregate_properties_by_regexp|aggregation_info|apache_child_terminate|apache_get_modules|apache_get_version|apache_getenv|apache_lookup_uri|apache_note|apache_request_headers|apache_response_headers|apache_setenv|array|array_change_key_case|array_chunk|array_combine|array_count_values|array_diff|array_diff_assoc|array_diff_uassoc|array_fill|array_filter|array_flip|array_intersect|array_intersect_assoc|array_key_exists|array_keys|array_map|array_merge|array_merge_recursive|array_multisort|array_pad|array_pop|array_push|array_rand|array_reduce|array_reverse|array_search|array_shift|array_slice|array_splice|array_sum|array_udiff|array_udiff_assoc|array_udiff_uassoc|array_unique|array_unshift|array_values|array_walk|arsort|ascii2ebcdic|asin|asinh|asort|aspell_check|aspell_check_raw|aspell_new|aspell_suggest|assert|assert_options|atan|atan2|atanh|base64_decode|base64_encode|base_convert|basename|bcadd|bccomp|bcdiv|bcmod|bcmul|bcpow|bcpowmod|bcscale|bcsqrt|bcsub|bin2hex|bind_textdomain_codeset|bindec|bindtextdomain|bzclose|bzcompress|bzdecompress|bzerrno|bzerror|bzerrstr|bzflush|bzopen|bzread|bzwrite|cal_days_in_month|cal_from_jd|cal_info|cal_to_jd|call_user_func|call_user_func_array|call_user_method|call_user_method_array|ccvs_add|ccvs_auth|ccvs_command|ccvs_count|ccvs_delete|ccvs_done|ccvs_init|ccvs_lookup|ccvs_new|ccvs_report|ccvs_return|ccvs_reverse|ccvs_sale|ccvs_status|ccvs_textvalue|ccvs_void|ceil|chdir|checkdate|checkdnsrr|chgrp|chmod|chop|chown|chr|chroot|chunk_split|class_exists|clearstatcache|closedir|closelog|com|com_addref|com_get|com_invoke|com_isenum|com_load|com_load_typelib|com_propget|com_propput|com_propset|com_release|com_set|compact|connection_aborted|connection_status|connection_timeout|constant|convert_cyr_string|copy|cos|cosh|count|count_chars|cpdf_add_annotation|cpdf_add_outline|cpdf_arc|cpdf_begin_text|cpdf_circle|cpdf_clip|cpdf_close|cpdf_closepath|cpdf_closepath_fill_stroke|cpdf_closepath_stroke|cpdf_continue_text|cpdf_curveto|cpdf_end_text|cpdf_fill|cpdf_fill_stroke|cpdf_finalize|cpdf_finalize_page|cpdf_global_set_document_limits|cpdf_import_jpeg|cpdf_lineto|cpdf_moveto|cpdf_newpath|cpdf_open|cpdf_output_buffer|cpdf_page_init|cpdf_place_inline_image|cpdf_rect|cpdf_restore|cpdf_rlineto|cpdf_rmoveto|cpdf_rotate|cpdf_rotate_text|cpdf_save|cpdf_save_to_file|cpdf_scale|cpdf_set_action_url|cpdf_set_char_spacing|cpdf_set_creator|cpdf_set_current_page|cpdf_set_font|cpdf_set_font_directories|cpdf_set_font_map_file|cpdf_set_horiz_scaling|cpdf_set_keywords|cpdf_set_leading|cpdf_set_page_animation|cpdf_set_subject|cpdf_set_text_matrix|cpdf_set_text_pos|cpdf_set_text_rendering|cpdf_set_text_rise|cpdf_set_title|cpdf_set_viewer_preferences|cpdf_set_word_spacing|cpdf_setdash|cpdf_setflat|cpdf_setgray|cpdf_setgray_fill|cpdf_setgray_stroke|cpdf_setlinecap|cpdf_setlinejoin|cpdf_setlinewidth|cpdf_setmiterlimit|cpdf_setrgbcolor|cpdf_setrgbcolor_fill|cpdf_setrgbcolor_stroke|cpdf_show|cpdf_show_xy|cpdf_stringwidth|cpdf_stroke|cpdf_text|cpdf_translate|crack_check|crack_closedict|crack_getlastmessage|crack_opendict|crc32|create_function|crypt|ctype_alnum|ctype_alpha|ctype_cntrl|ctype_digit|ctype_graph|ctype_lower|ctype_print|ctype_punct|ctype_space|ctype_upper|ctype_xdigit|curl_close|curl_errno|curl_error|curl_exec|curl_getinfo|curl_init|curl_multi_add_handle|curl_multi_close|curl_multi_exec|curl_multi_getcontent|curl_multi_info_read|curl_multi_init|curl_multi_remove_handle|curl_multi_select|curl_setopt|curl_version|current|cybercash_base64_decode|cybercash_base64_encode|cybercash_decr|cybercash_encr|cyrus_authenticate|cyrus_bind|cyrus_close|cyrus_connect|cyrus_query|cyrus_unbind|date|dba_close|dba_delete|dba_exists|dba_fetch|dba_firstkey|dba_handlers|dba_insert|dba_key_split|dba_list|dba_nextkey|dba_open|dba_optimize|dba_popen|dba_replace|dba_sync|dbase_add_record|dbase_close|dbase_create|dbase_delete_record|dbase_get_header_info|dbase_get_record|dbase_get_record_with_names|dbase_numfields|dbase_numrecords|dbase_open|dbase_pack|dbase_replace_record|dblist|dbmclose|dbmdelete|dbmexists|dbmfetch|dbmfirstkey|dbminsert|dbmnextkey|dbmopen|dbmreplace|dbplus_add|dbplus_aql|dbplus_chdir|dbplus_close|dbplus_curr|dbplus_errcode|dbplus_errno|dbplus_find|dbplus_first|dbplus_flush|dbplus_freealllocks|dbplus_freelock|dbplus_freerlocks|dbplus_getlock|dbplus_getunique|dbplus_info|dbplus_last|dbplus_lockrel|dbplus_next|dbplus_open|dbplus_prev|dbplus_rchperm|dbplus_rcreate|dbplus_rcrtexact|dbplus_rcrtlike|dbplus_resolve|dbplus_restorepos|dbplus_rkeys|dbplus_ropen|dbplus_rquery|dbplus_rrename|dbplus_rsecindex|dbplus_runlink|dbplus_rzap|dbplus_savepos|dbplus_setindex|dbplus_setindexbynumber|dbplus_sql|dbplus_tcl|dbplus_tremove|dbplus_undo|dbplus_undoprepare|dbplus_unlockrel|dbplus_unselect|dbplus_update|dbplus_xlockrel|dbplus_xunlockrel|dbx_close|dbx_compare|dbx_connect|dbx_error|dbx_escape_string|dbx_fetch_row|dbx_query|dbx_sort|dcgettext|dcngettext|deaggregate|debug_backtrace|debug_print_backtrace|debugger_off|debugger_on|decbin|dechex|decoct|define|define_syslog_variables|defined|deg2rad|delete|dgettext|die|dio_close|dio_fcntl|dio_open|dio_read|dio_seek|dio_stat|dio_tcsetattr|dio_truncate|dio_write|dir|dirname|disk_free_space|disk_total_space|diskfreespace|dl|dngettext|dns_check_record|dns_get_mx|dns_get_record|domxml_new_doc|domxml_open_file|domxml_open_mem|domxml_version|domxml_xmltree|domxml_xslt_stylesheet|domxml_xslt_stylesheet_doc|domxml_xslt_stylesheet_file|dotnet_load|doubleval|each|easter_date|easter_days|ebcdic2ascii|echo|empty|end|ereg|ereg_replace|eregi|eregi_replace|error_log|error_reporting|escapeshellarg|escapeshellcmd|eval|exec|exif_imagetype|exif_read_data|exif_thumbnail|exit|exp|explode|expm1|extension_loaded|extract|ezmlm_hash|fam_cancel_monitor|fam_close|fam_monitor_collection|fam_monitor_directory|fam_monitor_file|fam_next_event|fam_open|fam_pending|fam_resume_monitor|fam_suspend_monitor|fbsql_affected_rows|fbsql_autocommit|fbsql_blob_size|fbsql_change_user|fbsql_clob_size|fbsql_close|fbsql_commit|fbsql_connect|fbsql_create_blob|fbsql_create_clob|fbsql_create_db|fbsql_data_seek|fbsql_database|fbsql_database_password|fbsql_db_query|fbsql_db_status|fbsql_drop_db|fbsql_errno|fbsql_error|fbsql_fetch_array|fbsql_fetch_assoc|fbsql_fetch_field|fbsql_fetch_lengths|fbsql_fetch_object|fbsql_fetch_row|fbsql_field_flags|fbsql_field_len|fbsql_field_name|fbsql_field_seek|fbsql_field_table|fbsql_field_type|fbsql_free_result|fbsql_get_autostart_info|fbsql_hostname|fbsql_insert_id|fbsql_list_dbs|fbsql_list_fields|fbsql_list_tables|fbsql_next_result|fbsql_num_fields|fbsql_num_rows|fbsql_password|fbsql_pconnect|fbsql_query|fbsql_read_blob|fbsql_read_clob|fbsql_result|fbsql_rollback|fbsql_select_db|fbsql_set_lob_mode|fbsql_set_password|fbsql_set_transaction|fbsql_start_db|fbsql_stop_db|fbsql_tablename|fbsql_username|fbsql_warnings|fclose|fdf_add_doc_javascript|fdf_add_template|fdf_close|fdf_create|fdf_enum_values|fdf_errno|fdf_error|fdf_get_ap|fdf_get_attachment|fdf_get_encoding|fdf_get_file|fdf_get_flags|fdf_get_opt|fdf_get_status|fdf_get_value|fdf_get_version|fdf_header|fdf_next_field_name|fdf_open|fdf_open_string|fdf_remove_item|fdf_save|fdf_save_string|fdf_set_ap|fdf_set_encoding|fdf_set_file|fdf_set_flags|fdf_set_javascript_action|fdf_set_opt|fdf_set_status|fdf_set_submit_form_action|fdf_set_target_frame|fdf_set_value|fdf_set_version|feof|fflush|fgetc|fgetcsv|fgets|fgetss|file|file_exists|file_get_contents|file_put_contents|fileatime|filectime|filegroup|fileinode|filemtime|fileowner|fileperms|filepro|filepro_fieldcount|filepro_fieldname|filepro_fieldtype|filepro_fieldwidth|filepro_retrieve|filepro_rowcount|filesize|filetype|floatval|flock|floor|flush|fmod|fnmatch|fopen|fpassthru|fprintf|fputs|fread|frenchtojd|fribidi_log2vis|fscanf|fseek|fsockopen|fstat|ftell|ftok|ftp_alloc|ftp_cdup|ftp_chdir|ftp_chmod|ftp_close|ftp_connect|ftp_delete|ftp_exec|ftp_fget|ftp_fput|ftp_get|ftp_get_option|ftp_login|ftp_mdtm|ftp_mkdir|ftp_nb_continue|ftp_nb_fget|ftp_nb_fput|ftp_nb_get|ftp_nb_put|ftp_nlist|ftp_pasv|ftp_put|ftp_pwd|ftp_quit|ftp_raw|ftp_rawlist|ftp_rename|ftp_rmdir|ftp_set_option|ftp_site|ftp_size|ftp_ssl_connect|ftp_systype|ftruncate|func_get_arg|func_get_args|func_num_args|function_exists|fwrite|gd_info|get_browser|get_cfg_var|get_class|get_class_methods|get_class_vars|get_current_user|get_declared_classes|get_declared_interfaces|get_defined_constants|get_defined_functions|get_defined_vars|get_extension_funcs|get_headers|get_html_translation_table|get_include_path|get_included_files|get_loaded_extensions|get_magic_quotes_gpc|get_magic_quotes_runtime|get_meta_tags|get_object_vars|get_parent_class|get_required_files|get_resource_type|getallheaders|getcwd|getdate|getenv|gethostbyaddr|gethostbyname|gethostbynamel|getimagesize|getlastmod|getmxrr|getmygid|getmyinode|getmypid|getmyuid|getopt|getprotobyname|getprotobynumber|getrandmax|getrusage|getservbyname|getservbyport|gettext|gettimeofday|gettype|glob|gmdate|gmmktime|gmp_abs|gmp_add|gmp_and|gmp_clrbit|gmp_cmp|gmp_com|gmp_div|gmp_div_q|gmp_div_qr|gmp_div_r|gmp_divexact|gmp_fact|gmp_gcd|gmp_gcdext|gmp_hamdist|gmp_init|gmp_intval|gmp_invert|gmp_jacobi|gmp_legendre|gmp_mod|gmp_mul|gmp_neg|gmp_or|gmp_perfect_square|gmp_popcount|gmp_pow|gmp_powm|gmp_prob_prime|gmp_random|gmp_scan0|gmp_scan1|gmp_setbit|gmp_sign|gmp_sqrt|gmp_sqrtrem|gmp_strval|gmp_sub|gmp_xor|gmstrftime|gregoriantojd|gzclose|gzcompress|gzdeflate|gzencode|gzeof|gzfile|gzgetc|gzgets|gzgetss|gzinflate|gzopen|gzpassthru|gzputs|gzread|gzrewind|gzseek|gztell|gzuncompress|gzwrite|header|headers_list|headers_sent|hebrev|hebrevc|hexdec|highlight_file|highlight_string|html_entity_decode|htmlentities|htmlspecialchars|http_build_query|hw_api_attribute|hw_api_content|hw_api_object|hw_array2objrec|hw_changeobject|hw_children|hw_childrenobj|hw_close|hw_connect|hw_connection_info|hw_cp|hw_deleteobject|hw_docbyanchor|hw_docbyanchorobj|hw_document_attributes|hw_document_bodytag|hw_document_content|hw_document_setcontent|hw_document_size|hw_dummy|hw_edittext|hw_error|hw_errormsg|hw_free_document|hw_getanchors|hw_getanchorsobj|hw_getandlock|hw_getchildcoll|hw_getchildcollobj|hw_getchilddoccoll|hw_getchilddoccollobj|hw_getobject|hw_getobjectbyquery|hw_getobjectbyquerycoll|hw_getobjectbyquerycollobj|hw_getobjectbyqueryobj|hw_getparents|hw_getparentsobj|hw_getrellink|hw_getremote|hw_getremotechildren|hw_getsrcbydestobj|hw_gettext|hw_getusername|hw_identify|hw_incollections|hw_info|hw_inscoll|hw_insdoc|hw_insertanchors|hw_insertdocument|hw_insertobject|hw_mapid|hw_modifyobject|hw_mv|hw_new_document|hw_objrec2array|hw_output_document|hw_pconnect|hw_pipedocument|hw_root|hw_setlinkroot|hw_stat|hw_unlock|hw_who|hwapi_hgcsp|hypot|ibase_add_user|ibase_affected_rows|ibase_backup|ibase_blob_add|ibase_blob_cancel|ibase_blob_close|ibase_blob_create|ibase_blob_echo|ibase_blob_get|ibase_blob_import|ibase_blob_info|ibase_blob_open|ibase_close|ibase_commit|ibase_commit_ret|ibase_connect|ibase_db_info|ibase_delete_user|ibase_drop_db|ibase_errcode|ibase_errmsg|ibase_execute|ibase_fetch_assoc|ibase_fetch_object|ibase_fetch_row|ibase_field_info|ibase_free_event_handler|ibase_free_query|ibase_free_result|ibase_gen_id|ibase_maintain_db|ibase_modify_user|ibase_name_result|ibase_num_fields|ibase_num_params|ibase_param_info|ibase_pconnect|ibase_prepare|ibase_query|ibase_restore|ibase_rollback|ibase_rollback_ret|ibase_server_info|ibase_service_attach|ibase_service_detach|ibase_set_event_handler|ibase_timefmt|ibase_trans|ibase_wait_event|iconv|iconv_get_encoding|iconv_mime_decode|iconv_mime_decode_headers|iconv_mime_encode|iconv_set_encoding|iconv_strlen|iconv_strpos|iconv_strrpos|iconv_substr|idate|ifx_affected_rows|ifx_blobinfile_mode|ifx_byteasvarchar|ifx_close|ifx_connect|ifx_copy_blob|ifx_create_blob|ifx_create_char|ifx_do|ifx_error|ifx_errormsg|ifx_fetch_row|ifx_fieldproperties|ifx_fieldtypes|ifx_free_blob|ifx_free_char|ifx_free_result|ifx_get_blob|ifx_get_char|ifx_getsqlca|ifx_htmltbl_result|ifx_nullformat|ifx_num_fields|ifx_num_rows|ifx_pconnect|ifx_prepare|ifx_query|ifx_textasvarchar|ifx_update_blob|ifx_update_char|ifxus_close_slob|ifxus_create_slob|ifxus_free_slob|ifxus_open_slob|ifxus_read_slob|ifxus_seek_slob|ifxus_tell_slob|ifxus_write_slob|ignore_user_abort|image2wbmp|image_type_to_mime_type|imagealphablending|imageantialias|imagearc|imagechar|imagecharup|imagecolorallocate|imagecolorallocatealpha|imagecolorat|imagecolorclosest|imagecolorclosestalpha|imagecolorclosesthwb|imagecolordeallocate|imagecolorexact|imagecolorexactalpha|imagecolormatch|imagecolorresolve|imagecolorresolvealpha|imagecolorset|imagecolorsforindex|imagecolorstotal|imagecolortransparent|imagecopy|imagecopymerge|imagecopymergegray|imagecopyresampled|imagecopyresized|imagecreate|imagecreatefromgd|imagecreatefromgd2|imagecreatefromgd2part|imagecreatefromgif|imagecreatefromjpeg|imagecreatefrompng|imagecreatefromstring|imagecreatefromwbmp|imagecreatefromxbm|imagecreatefromxpm|imagecreatetruecolor|imagedashedline|imagedestroy|imageellipse|imagefill|imagefilledarc|imagefilledellipse|imagefilledpolygon|imagefilledrectangle|imagefilltoborder|imagefilter|imagefontheight|imagefontwidth|imageftbbox|imagefttext|imagegammacorrect|imagegd|imagegd2|imagegif|imageinterlace|imageistruecolor|imagejpeg|imagelayereffect|imageline|imageloadfont|imagepalettecopy|imagepng|imagepolygon|imagepsbbox|imagepscopyfont|imagepsencodefont|imagepsextendfont|imagepsfreefont|imagepsloadfont|imagepsslantfont|imagepstext|imagerectangle|imagerotate|imagesavealpha|imagesetbrush|imagesetpixel|imagesetstyle|imagesetthickness|imagesettile|imagestring|imagestringup|imagesx|imagesy|imagetruecolortopalette|imagettfbbox|imagettftext|imagetypes|imagewbmp|imagexbm|imap_8bit|imap_alerts|imap_append|imap_base64|imap_binary|imap_body|imap_bodystruct|imap_check|imap_clearflag_full|imap_close|imap_createmailbox|imap_delete|imap_deletemailbox|imap_errors|imap_expunge|imap_fetch_overview|imap_fetchbody|imap_fetchheader|imap_fetchstructure|imap_get_quota|imap_get_quotaroot|imap_getacl|imap_getmailboxes|imap_getsubscribed|imap_header|imap_headerinfo|imap_headers|imap_last_error|imap_list|imap_listmailbox|imap_listscan|imap_listsubscribed|imap_lsub|imap_mail|imap_mail_compose|imap_mail_copy|imap_mail_move|imap_mailboxmsginfo|imap_mime_header_decode|imap_msgno|imap_num_msg|imap_num_recent|imap_open|imap_ping|imap_qprint|imap_renamemailbox|imap_reopen|imap_rfc822_parse_adrlist|imap_rfc822_parse_headers|imap_rfc822_write_address|imap_scanmailbox|imap_search|imap_set_quota|imap_setacl|imap_setflag_full|imap_sort|imap_status|imap_subscribe|imap_thread|imap_timeout|imap_uid|imap_undelete|imap_unsubscribe|imap_utf7_decode|imap_utf7_encode|imap_utf8|implode|import_request_variables|in_array|ingres_autocommit|ingres_close|ingres_commit|ingres_connect|ingres_fetch_array|ingres_fetch_object|ingres_fetch_row|ingres_field_length|ingres_field_name|ingres_field_nullable|ingres_field_precision|ingres_field_scale|ingres_field_type|ingres_num_fields|ingres_num_rows|ingres_pconnect|ingres_query|ingres_rollback|ini_alter|ini_get|ini_get_all|ini_restore|ini_set|intval|ip2long|iptcembed|iptcparse|ircg_channel_mode|ircg_disconnect|ircg_fetch_error_msg|ircg_get_username|ircg_html_encode|ircg_ignore_add|ircg_ignore_del|ircg_invite|ircg_is_conn_alive|ircg_join|ircg_kick|ircg_list|ircg_lookup_format_messages|ircg_lusers|ircg_msg|ircg_nick|ircg_nickname_escape|ircg_nickname_unescape|ircg_notice|ircg_oper|ircg_part|ircg_pconnect|ircg_register_format_messages|ircg_set_current|ircg_set_file|ircg_set_on_die|ircg_topic|ircg_who|ircg_whois|is_a|is_array|is_bool|is_callable|is_dir|is_double|is_executable|is_file|is_finite|is_float|is_infinite|is_int|is_integer|is_link|is_long|is_nan|is_null|is_numeric|is_object|is_readable|is_real|is_resource|is_scalar|is_soap_fault|is_string|is_subclass_of|is_uploaded_file|is_writable|is_writeable|isset|java_last_exception_clear|java_last_exception_get|jddayofweek|jdmonthname|jdtofrench|jdtogregorian|jdtojewish|jdtojulian|jdtounix|jewishtojd|join|jpeg2wbmp|juliantojd|key|krsort|ksort|lcg_value|ldap_8859_to_t61|ldap_add|ldap_bind|ldap_close|ldap_compare|ldap_connect|ldap_count_entries|ldap_delete|ldap_dn2ufn|ldap_err2str|ldap_errno|ldap_error|ldap_explode_dn|ldap_first_attribute|ldap_first_entry|ldap_first_reference|ldap_free_result|ldap_get_attributes|ldap_get_dn|ldap_get_entries|ldap_get_option|ldap_get_values|ldap_get_values_len|ldap_list|ldap_mod_add|ldap_mod_del|ldap_mod_replace|ldap_modify|ldap_next_attribute|ldap_next_entry|ldap_next_reference|ldap_parse_reference|ldap_parse_result|ldap_read|ldap_rename|ldap_search|ldap_set_option|ldap_set_rebind_proc|ldap_sort|ldap_start_tls|ldap_t61_to_8859|ldap_unbind|levenshtein|link|linkinfo|list|localeconv|localtime|log|log10|log1p|long2ip|lstat|ltrim|lzf_compress|lzf_decompress|lzf_optimized_for|mail|mailparse_determine_best_xfer_encoding|mailparse_msg_create|mailparse_msg_extract_part|mailparse_msg_extract_part_file|mailparse_msg_free|mailparse_msg_get_part|mailparse_msg_get_part_data|mailparse_msg_get_structure|mailparse_msg_parse|mailparse_msg_parse_file|mailparse_rfc822_parse_addresses|mailparse_stream_encode|mailparse_uudecode_all|main|max|mb_convert_case|mb_convert_encoding|mb_convert_kana|mb_convert_variables|mb_decode_mimeheader|mb_decode_numericentity|mb_detect_encoding|mb_detect_order|mb_encode_mimeheader|mb_encode_numericentity|mb_ereg|mb_ereg_match|mb_ereg_replace|mb_ereg_search|mb_ereg_search_getpos|mb_ereg_search_getregs|mb_ereg_search_init|mb_ereg_search_pos|mb_ereg_search_regs|mb_ereg_search_setpos|mb_eregi|mb_eregi_replace|mb_get_info|mb_http_input|mb_http_output|mb_internal_encoding|mb_language|mb_output_handler|mb_parse_str|mb_preferred_mime_name|mb_regex_encoding|mb_regex_set_options|mb_send_mail|mb_split|mb_strcut|mb_strimwidth|mb_strlen|mb_strpos|mb_strrpos|mb_strtolower|mb_strtoupper|mb_strwidth|mb_substitute_character|mb_substr|mb_substr_count|mcal_append_event|mcal_close|mcal_create_calendar|mcal_date_compare|mcal_date_valid|mcal_day_of_week|mcal_day_of_year|mcal_days_in_month|mcal_delete_calendar|mcal_delete_event|mcal_event_add_attribute|mcal_event_init|mcal_event_set_alarm|mcal_event_set_category|mcal_event_set_class|mcal_event_set_description|mcal_event_set_end|mcal_event_set_recur_daily|mcal_event_set_recur_monthly_mday|mcal_event_set_recur_monthly_wday|mcal_event_set_recur_none|mcal_event_set_recur_weekly|mcal_event_set_recur_yearly|mcal_event_set_start|mcal_event_set_title|mcal_expunge|mcal_fetch_current_stream_event|mcal_fetch_event|mcal_is_leap_year|mcal_list_alarms|mcal_list_events|mcal_next_recurrence|mcal_open|mcal_popen|mcal_rename_calendar|mcal_reopen|mcal_snooze|mcal_store_event|mcal_time_valid|mcal_week_of_year|mcrypt_cbc|mcrypt_cfb|mcrypt_create_iv|mcrypt_decrypt|mcrypt_ecb|mcrypt_enc_get_algorithms_name|mcrypt_enc_get_block_size|mcrypt_enc_get_iv_size|mcrypt_enc_get_key_size|mcrypt_enc_get_modes_name|mcrypt_enc_get_supported_key_sizes|mcrypt_enc_is_block_algorithm|mcrypt_enc_is_block_algorithm_mode|mcrypt_enc_is_block_mode|mcrypt_enc_self_test|mcrypt_encrypt|mcrypt_generic|mcrypt_generic_deinit|mcrypt_generic_end|mcrypt_generic_init|mcrypt_get_block_size|mcrypt_get_cipher_name|mcrypt_get_iv_size|mcrypt_get_key_size|mcrypt_list_algorithms|mcrypt_list_modes|mcrypt_module_close|mcrypt_module_get_algo_block_size|mcrypt_module_get_algo_key_size|mcrypt_module_get_supported_key_sizes|mcrypt_module_is_block_algorithm|mcrypt_module_is_block_algorithm_mode|mcrypt_module_is_block_mode|mcrypt_module_open|mcrypt_module_self_test|mcrypt_ofb|mcve_adduser|mcve_adduserarg|mcve_bt|mcve_checkstatus|mcve_chkpwd|mcve_chngpwd|mcve_completeauthorizations|mcve_connect|mcve_connectionerror|mcve_deleteresponse|mcve_deletetrans|mcve_deleteusersetup|mcve_deluser|mcve_destroyconn|mcve_destroyengine|mcve_disableuser|mcve_edituser|mcve_enableuser|mcve_force|mcve_getcell|mcve_getcellbynum|mcve_getcommadelimited|mcve_getheader|mcve_getuserarg|mcve_getuserparam|mcve_gft|mcve_gl|mcve_gut|mcve_initconn|mcve_initengine|mcve_initusersetup|mcve_iscommadelimited|mcve_liststats|mcve_listusers|mcve_maxconntimeout|mcve_monitor|mcve_numcolumns|mcve_numrows|mcve_override|mcve_parsecommadelimited|mcve_ping|mcve_preauth|mcve_preauthcompletion|mcve_qc|mcve_responseparam|mcve_return|mcve_returncode|mcve_returnstatus|mcve_sale|mcve_setblocking|mcve_setdropfile|mcve_setip|mcve_setssl|mcve_setssl_files|mcve_settimeout|mcve_settle|mcve_text_avs|mcve_text_code|mcve_text_cv|mcve_transactionauth|mcve_transactionavs|mcve_transactionbatch|mcve_transactioncv|mcve_transactionid|mcve_transactionitem|mcve_transactionssent|mcve_transactiontext|mcve_transinqueue|mcve_transnew|mcve_transparam|mcve_transsend|mcve_ub|mcve_uwait|mcve_verifyconnection|mcve_verifysslcert|mcve_void|md5|md5_file|mdecrypt_generic|memory_get_usage|metaphone|method_exists|mhash|mhash_count|mhash_get_block_size|mhash_get_hash_name|mhash_keygen_s2k|microtime|mime_content_type|min|ming_setcubicthreshold|ming_setscale|ming_useswfversion|mkdir|mktime|money_format|move_uploaded_file|msession_connect|msession_count|msession_create|msession_destroy|msession_disconnect|msession_find|msession_get|msession_get_array|msession_getdata|msession_inc|msession_list|msession_listvar|msession_lock|msession_plugin|msession_randstr|msession_set|msession_set_array|msession_setdata|msession_timeout|msession_uniq|msession_unlock|msg_get_queue|msg_receive|msg_remove_queue|msg_send|msg_set_queue|msg_stat_queue|msql|msql|msql_affected_rows|msql_close|msql_connect|msql_create_db|msql_createdb|msql_data_seek|msql_dbname|msql_drop_db|msql_error|msql_fetch_array|msql_fetch_field|msql_fetch_object|msql_fetch_row|msql_field_flags|msql_field_len|msql_field_name|msql_field_seek|msql_field_table|msql_field_type|msql_fieldflags|msql_fieldlen|msql_fieldname|msql_fieldtable|msql_fieldtype|msql_free_result|msql_list_dbs|msql_list_fields|msql_list_tables|msql_num_fields|msql_num_rows|msql_numfields|msql_numrows|msql_pconnect|msql_query|msql_regcase|msql_result|msql_select_db|msql_tablename|mssql_bind|mssql_close|mssql_connect|mssql_data_seek|mssql_execute|mssql_fetch_array|mssql_fetch_assoc|mssql_fetch_batch|mssql_fetch_field|mssql_fetch_object|mssql_fetch_row|mssql_field_length|mssql_field_name|mssql_field_seek|mssql_field_type|mssql_free_result|mssql_free_statement|mssql_get_last_message|mssql_guid_string|mssql_init|mssql_min_error_severity|mssql_min_message_severity|mssql_next_result|mssql_num_fields|mssql_num_rows|mssql_pconnect|mssql_query|mssql_result|mssql_rows_affected|mssql_select_db|mt_getrandmax|mt_rand|mt_srand|muscat_close|muscat_get|muscat_give|muscat_setup|muscat_setup_net|mysql_affected_rows|mysql_change_user|mysql_client_encoding|mysql_close|mysql_connect|mysql_create_db|mysql_data_seek|mysql_db_name|mysql_db_query|mysql_drop_db|mysql_errno|mysql_error|mysql_escape_string|mysql_fetch_array|mysql_fetch_assoc|mysql_fetch_field|mysql_fetch_lengths|mysql_fetch_object|mysql_fetch_row|mysql_field_flags|mysql_field_len|mysql_field_name|mysql_field_seek|mysql_field_table|mysql_field_type|mysql_free_result|mysql_get_client_info|mysql_get_host_info|mysql_get_proto_info|mysql_get_server_info|mysql_info|mysql_insert_id|mysql_list_dbs|mysql_list_fields|mysql_list_processes|mysql_list_tables|mysql_num_fields|mysql_num_rows|mysql_pconnect|mysql_ping|mysql_query|mysql_real_escape_string|mysql_result|mysql_select_db|mysql_stat|mysql_tablename|mysql_thread_id|mysql_unbuffered_query|mysqli_affected_rows|mysqli_autocommit|mysqli_bind_param|mysqli_bind_result|mysqli_change_user|mysqli_character_set_name|mysqli_client_encoding|mysqli_close|mysqli_commit|mysqli_connect|mysqli_connect_errno|mysqli_connect_error|mysqli_data_seek|mysqli_debug|mysqli_disable_reads_from_master|mysqli_disable_rpl_parse|mysqli_dump_debug_info|mysqli_embedded_connect|mysqli_enable_reads_from_master|mysqli_enable_rpl_parse|mysqli_errno|mysqli_error|mysqli_escape_string|mysqli_execute|mysqli_fetch|mysqli_fetch_array|mysqli_fetch_assoc|mysqli_fetch_field|mysqli_fetch_field_direct|mysqli_fetch_fields|mysqli_fetch_lengths|mysqli_fetch_object|mysqli_fetch_row|mysqli_field_count|mysqli_field_seek|mysqli_field_tell|mysqli_free_result|mysqli_get_client_info|mysqli_get_client_version|mysqli_get_host_info|mysqli_get_metadata|mysqli_get_proto_info|mysqli_get_server_info|mysqli_get_server_version|mysqli_info|mysqli_init|mysqli_insert_id|mysqli_kill|mysqli_master_query|mysqli_more_results|mysqli_multi_query|mysqli_next_result|mysqli_num_fields|mysqli_num_rows|mysqli_options|mysqli_param_count|mysqli_ping|mysqli_prepare|mysqli_query|mysqli_real_connect|mysqli_real_escape_string|mysqli_real_query|mysqli_report|mysqli_rollback|mysqli_rpl_parse_enabled|mysqli_rpl_probe|mysqli_rpl_query_type|mysqli_select_db|mysqli_send_long_data|mysqli_send_query|mysqli_server_end|mysqli_server_init|mysqli_set_opt|mysqli_sqlstate|mysqli_ssl_set|mysqli_stat|mysqli_stmt_init|mysqli_stmt_affected_rows|mysqli_stmt_bind_param|mysqli_stmt_bind_result|mysqli_stmt_close|mysqli_stmt_data_seek|mysqli_stmt_errno|mysqli_stmt_error|mysqli_stmt_execute|mysqli_stmt_fetch|mysqli_stmt_free_result|mysqli_stmt_num_rows|mysqli_stmt_param_count|mysqli_stmt_prepare|mysqli_stmt_result_metadata|mysqli_stmt_send_long_data|mysqli_stmt_sqlstate|mysqli_stmt_store_result|mysqli_store_result|mysqli_thread_id|mysqli_thread_safe|mysqli_use_result|mysqli_warning_count|natcasesort|natsort|ncurses_addch|ncurses_addchnstr|ncurses_addchstr|ncurses_addnstr|ncurses_addstr|ncurses_assume_default_colors|ncurses_attroff|ncurses_attron|ncurses_attrset|ncurses_baudrate|ncurses_beep|ncurses_bkgd|ncurses_bkgdset|ncurses_border|ncurses_bottom_panel|ncurses_can_change_color|ncurses_cbreak|ncurses_clear|ncurses_clrtobot|ncurses_clrtoeol|ncurses_color_content|ncurses_color_set|ncurses_curs_set|ncurses_def_prog_mode|ncurses_def_shell_mode|ncurses_define_key|ncurses_del_panel|ncurses_delay_output|ncurses_delch|ncurses_deleteln|ncurses_delwin|ncurses_doupdate|ncurses_echo|ncurses_echochar|ncurses_end|ncurses_erase|ncurses_erasechar|ncurses_filter|ncurses_flash|ncurses_flushinp|ncurses_getch|ncurses_getmaxyx|ncurses_getmouse|ncurses_getyx|ncurses_halfdelay|ncurses_has_colors|ncurses_has_ic|ncurses_has_il|ncurses_has_key|ncurses_hide_panel|ncurses_hline|ncurses_inch|ncurses_init|ncurses_init_color|ncurses_init_pair|ncurses_insch|ncurses_insdelln|ncurses_insertln|ncurses_insstr|ncurses_instr|ncurses_isendwin|ncurses_keyok|ncurses_keypad|ncurses_killchar|ncurses_longname|ncurses_meta|ncurses_mouse_trafo|ncurses_mouseinterval|ncurses_mousemask|ncurses_move|ncurses_move_panel|ncurses_mvaddch|ncurses_mvaddchnstr|ncurses_mvaddchstr|ncurses_mvaddnstr|ncurses_mvaddstr|ncurses_mvcur|ncurses_mvdelch|ncurses_mvgetch|ncurses_mvhline|ncurses_mvinch|ncurses_mvvline|ncurses_mvwaddstr|ncurses_napms|ncurses_new_panel|ncurses_newpad|ncurses_newwin|ncurses_nl|ncurses_nocbreak|ncurses_noecho|ncurses_nonl|ncurses_noqiflush|ncurses_noraw|ncurses_pair_content|ncurses_panel_above|ncurses_panel_below|ncurses_panel_window|ncurses_pnoutrefresh|ncurses_prefresh|ncurses_putp|ncurses_qiflush|ncurses_raw|ncurses_refresh|ncurses_replace_panel|ncurses_reset_prog_mode|ncurses_reset_shell_mode|ncurses_resetty|ncurses_savetty|ncurses_scr_dump|ncurses_scr_init|ncurses_scr_restore|ncurses_scr_set|ncurses_scrl|ncurses_show_panel|ncurses_slk_attr|ncurses_slk_attroff|ncurses_slk_attron|ncurses_slk_attrset|ncurses_slk_clear|ncurses_slk_color|ncurses_slk_init|ncurses_slk_noutrefresh|ncurses_slk_refresh|ncurses_slk_restore|ncurses_slk_set|ncurses_slk_touch|ncurses_standend|ncurses_standout|ncurses_start_color|ncurses_termattrs|ncurses_termname|ncurses_timeout|ncurses_top_panel|ncurses_typeahead|ncurses_ungetch|ncurses_ungetmouse|ncurses_update_panels|ncurses_use_default_colors|ncurses_use_env|ncurses_use_extended_names|ncurses_vidattr|ncurses_vline|ncurses_waddch|ncurses_waddstr|ncurses_wattroff|ncurses_wattron|ncurses_wattrset|ncurses_wborder|ncurses_wclear|ncurses_wcolor_set|ncurses_werase|ncurses_wgetch|ncurses_whline|ncurses_wmouse_trafo|ncurses_wmove|ncurses_wnoutrefresh|ncurses_wrefresh|ncurses_wstandend|ncurses_wstandout|ncurses_wvline|next|ngettext|nl2br|nl_langinfo|notes_body|notes_copy_db|notes_create_db|notes_create_note|notes_drop_db|notes_find_note|notes_header_info|notes_list_msgs|notes_mark_read|notes_mark_unread|notes_nav_create|notes_search|notes_unread|notes_version|nsapi_request_headers|nsapi_response_headers|nsapi_virtual|number_format|ob_clean|ob_end_clean|ob_end_flush|ob_flush|ob_get_clean|ob_get_contents|ob_get_flush|ob_get_length|ob_get_level|ob_get_status|ob_gzhandler|ob_iconv_handler|ob_implicit_flush|ob_list_handlers|ob_start|ob_tidyhandler|oci_bind_by_name|oci_cancel|oci_close|oci_commit|oci_connect|oci_define_by_name|oci_error|oci_execute|oci_fetch|oci_fetch_all|oci_fetch_array|oci_fetch_assoc|oci_fetch_object|oci_fetch_row|oci_field_is_null|oci_field_name|oci_field_precision|oci_field_scale|oci_field_size|oci_field_type|oci_field_type_raw|oci_free_statement|oci_internal_debug|oci_lob_copy|oci_lob_is_equal|oci_new_collection|oci_new_connect|oci_new_cursor|oci_new_descriptor|oci_num_fields|oci_num_rows|oci_parse|oci_password_change|oci_pconnect|oci_result|oci_rollback|oci_server_version|oci_set_prefetch|oci_statement_type|ocibindbyname|ocicancel|ocicloselob|ocicollappend|ocicollassign|ocicollassignelem|ocicollgetelem|ocicollmax|ocicollsize|ocicolltrim|ocicolumnisnull|ocicolumnname|ocicolumnprecision|ocicolumnscale|ocicolumnsize|ocicolumntype|ocicolumntyperaw|ocicommit|ocidefinebyname|ocierror|ociexecute|ocifetch|ocifetchinto|ocifetchstatement|ocifreecollection|ocifreecursor|ocifreedesc|ocifreestatement|ociinternaldebug|ociloadlob|ocilogoff|ocilogon|ocinewcollection|ocinewcursor|ocinewdescriptor|ocinlogon|ocinumcols|ociparse|ociplogon|ociresult|ocirollback|ocirowcount|ocisavelob|ocisavelobfile|ociserverversion|ocisetprefetch|ocistatementtype|ociwritelobtofile|ociwritetemporarylob|octdec|odbc_autocommit|odbc_binmode|odbc_close|odbc_close_all|odbc_columnprivileges|odbc_columns|odbc_commit|odbc_connect|odbc_cursor|odbc_data_source|odbc_do|odbc_error|odbc_errormsg|odbc_exec|odbc_execute|odbc_fetch_array|odbc_fetch_into|odbc_fetch_object|odbc_fetch_row|odbc_field_len|odbc_field_name|odbc_field_num|odbc_field_precision|odbc_field_scale|odbc_field_type|odbc_foreignkeys|odbc_free_result|odbc_gettypeinfo|odbc_longreadlen|odbc_next_result|odbc_num_fields|odbc_num_rows|odbc_pconnect|odbc_prepare|odbc_primarykeys|odbc_procedurecolumns|odbc_procedures|odbc_result|odbc_result_all|odbc_rollback|odbc_setoption|odbc_specialcolumns|odbc_statistics|odbc_tableprivileges|odbc_tables|opendir|openlog|openssl_csr_export|openssl_csr_export_to_file|openssl_csr_new|openssl_csr_sign|openssl_error_string|openssl_free_key|openssl_get_privatekey|openssl_get_publickey|openssl_open|openssl_pkcs7_decrypt|openssl_pkcs7_encrypt|openssl_pkcs7_sign|openssl_pkcs7_verify|openssl_pkey_export|openssl_pkey_export_to_file|openssl_pkey_get_private|openssl_pkey_get_public|openssl_pkey_new|openssl_private_decrypt|openssl_private_encrypt|openssl_public_decrypt|openssl_public_encrypt|openssl_seal|openssl_sign|openssl_verify|openssl_x509_check_private_key|openssl_x509_checkpurpose|openssl_x509_export|openssl_x509_export_to_file|openssl_x509_free|openssl_x509_parse|openssl_x509_read|ora_bind|ora_close|ora_columnname|ora_columnsize|ora_columntype|ora_commit|ora_commitoff|ora_commiton|ora_do|ora_error|ora_errorcode|ora_exec|ora_fetch|ora_fetch_into|ora_getcolumn|ora_logoff|ora_logon|ora_numcols|ora_numrows|ora_open|ora_parse|ora_plogon|ora_rollback|ord|output_add_rewrite_var|output_reset_rewrite_vars|overload|ovrimos_close|ovrimos_commit|ovrimos_connect|ovrimos_cursor|ovrimos_exec|ovrimos_execute|ovrimos_fetch_into|ovrimos_fetch_row|ovrimos_field_len|ovrimos_field_name|ovrimos_field_num|ovrimos_field_type|ovrimos_free_result|ovrimos_longreadlen|ovrimos_num_fields|ovrimos_num_rows|ovrimos_prepare|ovrimos_result|ovrimos_result_all|ovrimos_rollback|pack|parse_ini_file|parse_str|parse_url|passthru|pathinfo|pclose|pcntl_alarm|pcntl_exec|pcntl_fork|pcntl_getpriority|pcntl_setpriority|pcntl_signal|pcntl_wait|pcntl_waitpid|pcntl_wexitstatus|pcntl_wifexited|pcntl_wifsignaled|pcntl_wifstopped|pcntl_wstopsig|pcntl_wtermsig|pdf_add_annotation|pdf_add_bookmark|pdf_add_launchlink|pdf_add_locallink|pdf_add_note|pdf_add_outline|pdf_add_pdflink|pdf_add_thumbnail|pdf_add_weblink|pdf_arc|pdf_arcn|pdf_attach_file|pdf_begin_page|pdf_begin_pattern|pdf_begin_template|pdf_circle|pdf_clip|pdf_close|pdf_close_image|pdf_close_pdi|pdf_close_pdi_page|pdf_closepath|pdf_closepath_fill_stroke|pdf_closepath_stroke|pdf_concat|pdf_continue_text|pdf_curveto|pdf_delete|pdf_end_page|pdf_end_pattern|pdf_end_template|pdf_endpath|pdf_fill|pdf_fill_stroke|pdf_findfont|pdf_get_buffer|pdf_get_font|pdf_get_fontname|pdf_get_fontsize|pdf_get_image_height|pdf_get_image_width|pdf_get_majorversion|pdf_get_minorversion|pdf_get_parameter|pdf_get_pdi_parameter|pdf_get_pdi_value|pdf_get_value|pdf_initgraphics|pdf_lineto|pdf_makespotcolor|pdf_moveto|pdf_new|pdf_open|pdf_open_ccitt|pdf_open_file|pdf_open_gif|pdf_open_image|pdf_open_image_file|pdf_open_jpeg|pdf_open_memory_image|pdf_open_pdi|pdf_open_pdi_page|pdf_open_png|pdf_open_tiff|pdf_place_image|pdf_place_pdi_page|pdf_rect|pdf_restore|pdf_rotate|pdf_save|pdf_scale|pdf_set_border_color|pdf_set_border_dash|pdf_set_border_style|pdf_set_char_spacing|pdf_set_duration|pdf_set_font|pdf_set_horiz_scaling|pdf_set_info|pdf_set_info_author|pdf_set_info_creator|pdf_set_info_keywords|pdf_set_info_subject|pdf_set_info_title|pdf_set_leading|pdf_set_parameter|pdf_set_text_matrix|pdf_set_text_pos|pdf_set_text_rendering|pdf_set_text_rise|pdf_set_value|pdf_set_word_spacing|pdf_setcolor|pdf_setdash|pdf_setflat|pdf_setfont|pdf_setgray|pdf_setgray_fill|pdf_setgray_stroke|pdf_setlinecap|pdf_setlinejoin|pdf_setlinewidth|pdf_setmatrix|pdf_setmiterlimit|pdf_setpolydash|pdf_setrgbcolor|pdf_setrgbcolor_fill|pdf_setrgbcolor_stroke|pdf_show|pdf_show_boxed|pdf_show_xy|pdf_skew|pdf_stringwidth|pdf_stroke|pdf_translate|pfpro_cleanup|pfpro_init|pfpro_process|pfpro_process_raw|pfpro_version|pfsockopen|pg_affected_rows|pg_cancel_query|pg_client_encoding|pg_close|pg_connect|pg_connection_busy|pg_connection_reset|pg_connection_status|pg_convert|pg_copy_from|pg_copy_to|pg_dbname|pg_delete|pg_end_copy|pg_escape_bytea|pg_escape_string|pg_fetch_all|pg_fetch_array|pg_fetch_assoc|pg_fetch_object|pg_fetch_result|pg_fetch_row|pg_field_is_null|pg_field_name|pg_field_num|pg_field_prtlen|pg_field_size|pg_field_type|pg_free_result|pg_get_notify|pg_get_pid|pg_get_result|pg_host|pg_insert|pg_last_error|pg_last_notice|pg_last_oid|pg_lo_close|pg_lo_create|pg_lo_export|pg_lo_import|pg_lo_open|pg_lo_read|pg_lo_read_all|pg_lo_seek|pg_lo_tell|pg_lo_unlink|pg_lo_write|pg_meta_data|pg_num_fields|pg_num_rows|pg_options|pg_pconnect|pg_ping|pg_port|pg_put_line|pg_query|pg_result_error|pg_result_seek|pg_result_status|pg_select|pg_send_query|pg_set_client_encoding|pg_trace|pg_tty|pg_unescape_bytea|pg_untrace|pg_update|php_ini_scanned_files|php_logo_guid|php_sapi_name|php_uname|phpcredits|phpinfo|phpversion|pi|png2wbmp|popen|pos|posix_ctermid|posix_get_last_error|posix_getcwd|posix_getegid|posix_geteuid|posix_getgid|posix_getgrgid|posix_getgrnam|posix_getgroups|posix_getlogin|posix_getpgid|posix_getpgrp|posix_getpid|posix_getppid|posix_getpwnam|posix_getpwuid|posix_getrlimit|posix_getsid|posix_getuid|posix_isatty|posix_kill|posix_mkfifo|posix_setegid|posix_seteuid|posix_setgid|posix_setpgid|posix_setsid|posix_setuid|posix_strerror|posix_times|posix_ttyname|posix_uname|pow|preg_grep|preg_match|preg_match_all|preg_quote|preg_replace|preg_replace_callback|preg_split|prev|print|print_r|printer_abort|printer_close|printer_create_brush|printer_create_dc|printer_create_font|printer_create_pen|printer_delete_brush|printer_delete_dc|printer_delete_font|printer_delete_pen|printer_draw_bmp|printer_draw_chord|printer_draw_elipse|printer_draw_line|printer_draw_pie|printer_draw_rectangle|printer_draw_roundrect|printer_draw_text|printer_end_doc|printer_end_page|printer_get_option|printer_list|printer_logical_fontheight|printer_open|printer_select_brush|printer_select_font|printer_select_pen|printer_set_option|printer_start_doc|printer_start_page|printer_write|printf|proc_close|proc_get_status|proc_nice|proc_open|proc_terminate|pspell_add_to_personal|pspell_add_to_session|pspell_check|pspell_clear_session|pspell_config_create|pspell_config_ignore|pspell_config_mode|pspell_config_personal|pspell_config_repl|pspell_config_runtogether|pspell_config_save_repl|pspell_new|pspell_new_config|pspell_new_personal|pspell_save_wordlist|pspell_store_replacement|pspell_suggest|putenv|qdom_error|qdom_tree|quoted_printable_decode|quotemeta|rad2deg|rand|range|rawurldecode|rawurlencode|read_exif_data|readdir|readfile|readgzfile|readline|readline_add_history|readline_clear_history|readline_completion_function|readline_info|readline_list_history|readline_read_history|readline_write_history|readlink|realpath|recode|recode_file|recode_string|register_shutdown_function|register_tick_function|rename|reset|restore_error_handler|restore_include_path|rewind|rewinddir|rmdir|round|rsort|rtrim|scandir|sem_acquire|sem_get|sem_release|sem_remove|serialize|sesam_affected_rows|sesam_commit|sesam_connect|sesam_diagnostic|sesam_disconnect|sesam_errormsg|sesam_execimm|sesam_fetch_array|sesam_fetch_result|sesam_fetch_row|sesam_field_array|sesam_field_name|sesam_free_result|sesam_num_fields|sesam_query|sesam_rollback|sesam_seek_row|sesam_settransaction|session_cache_expire|session_cache_limiter|session_commit|session_decode|session_destroy|session_encode|session_get_cookie_params|session_id|session_is_registered|session_module_name|session_name|session_regenerate_id|session_register|session_save_path|session_set_cookie_params|session_set_save_handler|session_start|session_unregister|session_unset|session_write_close|set_error_handler|set_file_buffer|set_include_path|set_magic_quotes_runtime|set_time_limit|setcookie|setlocale|setrawcookie|settype|sha1|sha1_file|shell_exec|shm_attach|shm_detach|shm_get_var|shm_put_var|shm_remove|shm_remove_var|shmop_close|shmop_delete|shmop_open|shmop_read|shmop_size|shmop_write|show_source|shuffle|similar_text|simplexml_import_dom|simplexml_load_file|simplexml_load_string|sin|sinh|sizeof|sleep|snmp_get_quick_print|snmp_set_quick_print|snmpget|snmprealwalk|snmpset|snmpwalk|snmpwalkoid|socket_accept|socket_bind|socket_clear_error|socket_close|socket_connect|socket_create|socket_create_listen|socket_create_pair|socket_get_option|socket_get_status|socket_getpeername|socket_getsockname|socket_iovec_add|socket_iovec_alloc|socket_iovec_delete|socket_iovec_fetch|socket_iovec_free|socket_iovec_set|socket_last_error|socket_listen|socket_read|socket_readv|socket_recv|socket_recvfrom|socket_recvmsg|socket_select|socket_send|socket_sendmsg|socket_sendto|socket_set_block|socket_set_blocking|socket_set_nonblock|socket_set_option|socket_set_timeout|socket_shutdown|socket_strerror|socket_write|socket_writev|sort|soundex|split|spliti|sprintf|sql_regcase|sqlite_array_query|sqlite_busy_timeout|sqlite_changes|sqlite_close|sqlite_column|sqlite_create_aggregate|sqlite_create_function|sqlite_current|sqlite_error_string|sqlite_escape_string|sqlite_fetch_array|sqlite_fetch_single|sqlite_fetch_string|sqlite_field_name|sqlite_has_more|sqlite_last_error|sqlite_last_insert_rowid|sqlite_libencoding|sqlite_libversion|sqlite_next|sqlite_num_fields|sqlite_num_rows|sqlite_open|sqlite_popen|sqlite_query|sqlite_rewind|sqlite_seek|sqlite_udf_decode_binary|sqlite_udf_encode_binary|sqlite_unbuffered_query|sqrt|srand|sscanf|stat|str_ireplace|str_pad|str_repeat|str_replace|str_rot13|str_shuffle|str_split|str_word_count|strcasecmp|strchr|strcmp|strcoll|strcspn|stream_context_create|stream_context_get_options|stream_context_set_option|stream_context_set_params|stream_copy_to_stream|stream_filter_append|stream_filter_prepend|stream_filter_register|stream_get_contents|stream_get_filters|stream_get_line|stream_get_meta_data|stream_get_transports|stream_get_wrappers|stream_register_wrapper|stream_select|stream_set_blocking|stream_set_timeout|stream_set_write_buffer|stream_socket_accept|stream_socket_client|stream_socket_get_name|stream_socket_recvfrom|stream_socket_sendto|stream_socket_server|stream_wrapper_register|strftime|strip_tags|stripcslashes|stripos|stripslashes|stristr|strlen|strnatcasecmp|strnatcmp|strncasecmp|strncmp|strpos|strrchr|strrev|strripos|strrpos|strspn|strstr|strtok|strtolower|strtotime|strtoupper|strtr|strval|substr|substr_compare|substr_count|substr_replace|swf_actiongeturl|swf_actiongotoframe|swf_actiongotolabel|swf_actionnextframe|swf_actionplay|swf_actionprevframe|swf_actionsettarget|swf_actionstop|swf_actiontogglequality|swf_actionwaitforframe|swf_addbuttonrecord|swf_addcolor|swf_closefile|swf_definebitmap|swf_definefont|swf_defineline|swf_definepoly|swf_definerect|swf_definetext|swf_endbutton|swf_enddoaction|swf_endshape|swf_endsymbol|swf_fontsize|swf_fontslant|swf_fonttracking|swf_getbitmapinfo|swf_getfontinfo|swf_getframe|swf_labelframe|swf_lookat|swf_modifyobject|swf_mulcolor|swf_nextid|swf_oncondition|swf_openfile|swf_ortho|swf_ortho2|swf_perspective|swf_placeobject|swf_polarview|swf_popmatrix|swf_posround|swf_pushmatrix|swf_removeobject|swf_rotate|swf_scale|swf_setfont|swf_setframe|swf_shapearc|swf_shapecurveto|swf_shapecurveto3|swf_shapefillbitmapclip|swf_shapefillbitmaptile|swf_shapefilloff|swf_shapefillsolid|swf_shapelinesolid|swf_shapelineto|swf_shapemoveto|swf_showframe|swf_startbutton|swf_startdoaction|swf_startshape|swf_startsymbol|swf_textwidth|swf_translate|swf_viewport|swfaction|swfbitmap|swfbutton|swfbutton_keypress|swfdisplayitem|swffill|swffont|swfgradient|swfmorph|swfmovie|swfshape|swfsprite|swftext|swftextfield|sybase_affected_rows|sybase_close|sybase_connect|sybase_data_seek|sybase_deadlock_retry_count|sybase_fetch_array|sybase_fetch_assoc|sybase_fetch_field|sybase_fetch_object|sybase_fetch_row|sybase_field_seek|sybase_free_result|sybase_get_last_message|sybase_min_client_severity|sybase_min_error_severity|sybase_min_message_severity|sybase_min_server_severity|sybase_num_fields|sybase_num_rows|sybase_pconnect|sybase_query|sybase_result|sybase_select_db|sybase_set_message_handler|sybase_unbuffered_query|symlink|syslog|system|tan|tanh|tcpwrap_check|tempnam|textdomain|tidy_access_count|tidy_clean_repair|tidy_config_count|tidy_diagnose|tidy_error_count|tidy_get_body|tidy_get_config|tidy_get_error_buffer|tidy_get_head|tidy_get_html|tidy_get_html_ver|tidy_get_output|tidy_get_release|tidy_get_root|tidy_get_status|tidy_getopt|tidy_is_xhtml|tidy_is_xml|tidy_load_config|tidy_parse_file|tidy_parse_string|tidy_repair_file|tidy_repair_string|tidy_reset_config|tidy_save_config|tidy_set_encoding|tidy_setopt|tidy_warning_count|time|tmpfile|token_get_all|token_name|touch|trigger_error|trim|uasort|ucfirst|ucwords|udm_add_search_limit|udm_alloc_agent|udm_alloc_agent_array|udm_api_version|udm_cat_list|udm_cat_path|udm_check_charset|udm_check_stored|udm_clear_search_limits|udm_close_stored|udm_crc32|udm_errno|udm_error|udm_find|udm_free_agent|udm_free_ispell_data|udm_free_res|udm_get_doc_count|udm_get_res_field|udm_get_res_param|udm_hash32|udm_load_ispell_data|udm_open_stored|udm_set_agent_param|uksort|umask|uniqid|unixtojd|unlink|unpack|unregister_tick_function|unserialize|unset|urldecode|urlencode|user_error|usleep|usort|utf8_decode|utf8_encode|var_dump|var_export|variant|version_compare|virtual|vpopmail_add_alias_domain|vpopmail_add_alias_domain_ex|vpopmail_add_domain|vpopmail_add_domain_ex|vpopmail_add_user|vpopmail_alias_add|vpopmail_alias_del|vpopmail_alias_del_domain|vpopmail_alias_get|vpopmail_alias_get_all|vpopmail_auth_user|vpopmail_del_domain|vpopmail_del_domain_ex|vpopmail_del_user|vpopmail_error|vpopmail_passwd|vpopmail_set_user_quota|vprintf|vsprintf|w32api_deftype|w32api_init_dtype|w32api_invoke_function|w32api_register_function|w32api_set_call_method|wddx_add_vars|wddx_deserialize|wddx_packet_end|wddx_packet_start|wddx_serialize_value|wddx_serialize_vars|wordwrap|xdiff_file_diff|xdiff_file_diff_binary|xdiff_file_merge3|xdiff_file_patch|xdiff_file_patch_binary|xdiff_string_diff|xdiff_string_diff_binary|xdiff_string_merge3|xdiff_string_patch|xdiff_string_patch_binary|xml_error_string|xml_get_current_byte_index|xml_get_current_column_number|xml_get_current_line_number|xml_get_error_code|xml_parse|xml_parse_into_struct|xml_parser_create|xml_parser_create_ns|xml_parser_free|xml_parser_get_option|xml_parser_set_option|xml_set_character_data_handler|xml_set_default_handler|xml_set_element_handler|xml_set_end_namespace_decl_handler|xml_set_external_entity_ref_handler|xml_set_notation_decl_handler|xml_set_object|xml_set_processing_instruction_handler|xml_set_start_namespace_decl_handler|xml_set_unparsed_entity_decl_handler|xmlrpc_decode|xmlrpc_decode_request|xmlrpc_encode|xmlrpc_encode_request|xmlrpc_get_type|xmlrpc_parse_method_descriptions|xmlrpc_server_add_introspection_data|xmlrpc_server_call_method|xmlrpc_server_create|xmlrpc_server_destroy|xmlrpc_server_register_introspection_callback|xmlrpc_server_register_method|xmlrpc_set_type|xpath_eval|xpath_eval_expression|xpath_new_context|xptr_eval|xptr_new_context|xsl_xsltprocessor_get_parameter|xsl_xsltprocessor_has_exslt_support|xsl_xsltprocessor_import_stylesheet|xsl_xsltprocessor_register_php_functions|xsl_xsltprocessor_remove_parameter|xsl_xsltprocessor_set_parameter|xsl_xsltprocessor_transform_to_doc|xsl_xsltprocessor_transform_to_uri|xsl_xsltprocessor_transform_to_xml|xslt_create|xslt_errno|xslt_error|xslt_free|xslt_process|xslt_set_base|xslt_set_encoding|xslt_set_error_handler|xslt_set_log|xslt_set_sax_handler|xslt_set_sax_handlers|xslt_set_scheme_handler|xslt_set_scheme_handlers|yaz_addinfo|yaz_ccl_conf|yaz_ccl_parse|yaz_close|yaz_connect|yaz_database|yaz_element|yaz_errno|yaz_error|yaz_es_result|yaz_get_option|yaz_hits|yaz_itemorder|yaz_present|yaz_range|yaz_record|yaz_scan|yaz_scan_result|yaz_schema|yaz_search|yaz_set_option|yaz_sort|yaz_syntax|yaz_wait|yp_all|yp_cat|yp_err_string|yp_errno|yp_first|yp_get_default_domain|yp_master|yp_match|yp_next|yp_order|zend_logo_guid|zend_version|zip_close|zip_entry_close|zip_entry_compressedsize|zip_entry_compressionmethod|zip_entry_filesize|zip_entry_name|zip_entry_open|zip_entry_read|zip_open|zip_read|zlib_get_coding_type".split("|"));
    var keywords$$2 = lang$$9.arrayToMap("abstract|and|array|as|break|case|catch|cfunction|class|clone|const|continue|declare|default|die|do|else|elseif|enddeclare|endfor|endforeach|endif|endswitch|endwhile|extends|final|for|foreach|function|include|include_once|global|goto|if|implements|interface|instanceof|namespace|new|old_function|or|private|protected|public|return|require|require_once|static|switch|throw|try|use|var|while|xor".split("|"));
    var builtinConstants$$1 = lang$$9.arrayToMap("true|false|null|__FILE__|__LINE__|__METHOD__|__FUNCTION__|__CLASS__".split("|"));
    var builtinVariables = lang$$9.arrayToMap("$_GLOBALS|$_SERVER|$_GET|$_POST|$_FILES|$_REQUEST|$_SESSION|$_ENV|$_COOKIE|$php_errormsg|$HTTP_RAW_POST_DATA|$http_response_header|$argc|$argv".split("|"));
    var futureReserved$$2 = lang$$9.arrayToMap([]);
    this.$rules = {start:[{token:"support", regex:"<\\?(?:php|\\=)"}, {token:"support", regex:"\\?>"}, {token:"comment", regex:"\\/\\/.*$"}, docComment$$1.getStartRule("doc-start"), {token:"comment", regex:"\\/\\*", next:"comment"}, {token:"string.regexp", regex:"[/](?:(?:\\[(?:\\\\]|[^\\]])+\\])|(?:\\\\/|[^\\]/]))*[/][gimy]*\\s*(?=[).,;]|$)"}, {token:"string", regex:'["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'}, {token:"string", regex:'["].*\\\\$', next:"qqstring"}, {token:"string", regex:"['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"}, 
    {token:"string", regex:"['].*\\\\$", next:"qstring"}, {token:"constant.numeric", regex:"0[xX][0-9a-fA-F]+\\b"}, {token:"constant.numeric", regex:"[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"}, {token:"constant.language", regex:"\\b(?:DEFAULT_INCLUDE_PATH|E_(?:ALL|CO(?:MPILE_(?:ERROR|WARNING)|RE_(?:ERROR|WARNING))|ERROR|NOTICE|PARSE|STRICT|USER_(?:ERROR|NOTICE|WARNING)|WARNING)|P(?:EAR_(?:EXTENSION_DIR|INSTALL_DIR)|HP_(?:BINDIR|CONFIG_FILE_(?:PATH|SCAN_DIR)|DATADIR|E(?:OL|XTENSION_DIR)|INT_(?:MAX|SIZE)|L(?:IBDIR|OCALSTATEDIR)|O(?:S|UTPUT_HANDLER_(?:CONT|END|START))|PREFIX|S(?:API|HLIB_SUFFIX|YSCONFDIR)|VERSION))|__COMPILER_HALT_OFFSET__)\\b"}, 
    {token:"constant.language", regex:"\\b(?:A(?:B(?:DAY_(?:1|2|3|4|5|6|7)|MON_(?:1(?:0|1|2|)|2|3|4|5|6|7|8|9))|LT_DIGITS|M_STR|SSERT_(?:ACTIVE|BAIL|CALLBACK|QUIET_EVAL|WARNING))|C(?:ASE_(?:LOWER|UPPER)|HAR_MAX|O(?:DESET|NNECTION_(?:ABORTED|NORMAL|TIMEOUT)|UNT_(?:NORMAL|RECURSIVE))|R(?:EDITS_(?:ALL|DOCS|FULLPAGE|G(?:ENERAL|ROUP)|MODULES|QA|SAPI)|NCYSTR|YPT_(?:BLOWFISH|EXT_DES|MD5|S(?:ALT_LENGTH|TD_DES)))|URRENCY_SYMBOL)|D(?:AY_(?:1|2|3|4|5|6|7)|ECIMAL_POINT|IRECTORY_SEPARATOR|_(?:FMT|T_FMT))|E(?:NT_(?:COMPAT|NOQUOTES|QUOTES)|RA(?:_(?:D_(?:FMT|T_FMT)|T_FMT|YEAR)|)|XTR_(?:IF_EXISTS|OVERWRITE|PREFIX_(?:ALL|I(?:F_EXISTS|NVALID)|SAME)|SKIP))|FRAC_DIGITS|GROUPING|HTML_(?:ENTITIES|SPECIALCHARS)|IN(?:FO_(?:ALL|C(?:ONFIGURATION|REDITS)|ENVIRONMENT|GENERAL|LICENSE|MODULES|VARIABLES)|I_(?:ALL|PERDIR|SYSTEM|USER)|T_(?:CURR_SYMBOL|FRAC_DIGITS))|L(?:C_(?:ALL|C(?:OLLATE|TYPE)|M(?:ESSAGES|ONETARY)|NUMERIC|TIME)|O(?:CK_(?:EX|NB|SH|UN)|G_(?:A(?:LERT|UTH(?:PRIV|))|C(?:ONS|R(?:IT|ON))|D(?:AEMON|EBUG)|E(?:MERG|RR)|INFO|KERN|L(?:OCAL(?:0|1|2|3|4|5|6|7)|PR)|MAIL|N(?:DELAY|EWS|O(?:TICE|WAIT))|ODELAY|P(?:ERROR|ID)|SYSLOG|U(?:SER|UCP)|WARNING)))|M(?:ON_(?:1(?:0|1|2|)|2|3|4|5|6|7|8|9|DECIMAL_POINT|GROUPING|THOUSANDS_SEP)|_(?:1_PI|2_(?:PI|SQRTPI)|E|L(?:N(?:10|2)|OG(?:10E|2E))|PI(?:_(?:2|4)|)|SQRT(?:1_2|2)))|N(?:EGATIVE_SIGN|O(?:EXPR|STR)|_(?:CS_PRECEDES|S(?:EP_BY_SPACE|IGN_POSN)))|P(?:ATH(?:INFO_(?:BASENAME|DIRNAME|EXTENSION)|_SEPARATOR)|M_STR|OSITIVE_SIGN|_(?:CS_PRECEDES|S(?:EP_BY_SPACE|IGN_POSN)))|RADIXCHAR|S(?:EEK_(?:CUR|END|SET)|ORT_(?:ASC|DESC|NUMERIC|REGULAR|STRING)|TR_PAD_(?:BOTH|LEFT|RIGHT))|T(?:HOUS(?:ANDS_SEP|EP)|_FMT(?:_AMPM|))|YES(?:EXPR|STR)|STD(?:IN|OUT|ERR))\\b"}, 
    {token:function(value$$11) {
      if(keywords$$2[value$$11]) {
        return"keyword"
      }else {
        if(builtinConstants$$1[value$$11]) {
          return"constant.language"
        }else {
          if(builtinVariables[value$$11]) {
            return"variable.language"
          }else {
            if(futureReserved$$2[value$$11]) {
              return"invalid.illegal"
            }else {
              if(builtinFunctions$$1[value$$11]) {
                return"support.function"
              }else {
                if(value$$11 == "debugger") {
                  return"invalid.deprecated"
                }else {
                  if(value$$11.match(/^(\$[a-zA-Z][a-zA-Z0-9_]*|self|parent)$/)) {
                    return"variable"
                  }
                }
              }
            }
          }
        }
      }return"identifier"
    }, regex:"[a-zA-Z_$][a-zA-Z0-9_$]*\\b"}, {token:"keyword.operator", regex:"!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|\\b(?:in|instanceof|new|delete|typeof|void)"}, {token:"lparen", regex:"[[({]"}, {token:"rparen", regex:"[\\])}]"}, {token:"text", regex:"\\s+"}], comment:[{token:"comment", regex:".*?\\*\\/", next:"start"}, {token:"comment", regex:".+"}], qqstring:[{token:"string", regex:'(?:(?:\\\\.)|(?:[^"\\\\]))*?"', 
    next:"start"}, {token:"string", regex:".+"}], qstring:[{token:"string", regex:"(?:(?:\\\\.)|(?:[^'\\\\]))*?'", next:"start"}, {token:"string", regex:".+"}]};
    this.addRules(docComment$$1.getRules(), "doc-");
    this.$rules["doc-start"][0].next = "start"
  };
  oop$$20.inherits(PhpHighlightRules, TextHighlightRules$$8);
  exports$$45.PhpHighlightRules = PhpHighlightRules
});
define("ace/mode/php", ["require", "exports", "module", "pilot/oop", "./text", "../tokenizer", "./php_highlight_rules", "./matching_brace_outdent", "../range"], function(require$$46, exports$$46) {
  var oop$$21 = require$$46("pilot/oop");
  var TextMode$$6 = require$$46("./text").Mode;
  var Tokenizer$$7 = require$$46("../tokenizer").Tokenizer;
  var PhpHighlightRules$$1 = require$$46("./php_highlight_rules").PhpHighlightRules;
  var MatchingBraceOutdent$$4 = require$$46("./matching_brace_outdent").MatchingBraceOutdent;
  var Range$$9 = require$$46("../range").Range;
  var Mode$$6 = function() {
    this.$tokenizer = new Tokenizer$$7((new PhpHighlightRules$$1).getRules());
    this.$outdent = new MatchingBraceOutdent$$4
  };
  oop$$21.inherits(Mode$$6, TextMode$$6);
  (function() {
    this.toggleCommentLines = function(state$$26, doc$$28, startRow$$7, endRow$$6) {
      var outdent$$3 = true;
      var re$$9 = /^(\s*)#/;
      var i$$36 = startRow$$7;
      for(;i$$36 <= endRow$$6;i$$36++) {
        if(!re$$9.test(doc$$28.getLine(i$$36))) {
          outdent$$3 = false;
          break
        }
      }if(outdent$$3) {
        var deleteRange$$3 = new Range$$9(0, 0, 0, 0);
        i$$36 = startRow$$7;
        for(;i$$36 <= endRow$$6;i$$36++) {
          var line$$35 = doc$$28.getLine(i$$36).replace(re$$9, "$1");
          deleteRange$$3.start.row = i$$36;
          deleteRange$$3.end.row = i$$36;
          deleteRange$$3.end.column = line$$35.length + 2;
          doc$$28.replace(deleteRange$$3, line$$35)
        }return-2
      }else {
        return doc$$28.indentRows(startRow$$7, endRow$$6, "#")
      }
    };
    this.getNextLineIndent = function(state$$27, line$$36, tab$$7) {
      var indent$$5 = this.$getIndent(line$$36);
      var tokenizedLine$$2 = this.$tokenizer.getLineTokens(line$$36, state$$27);
      var tokens$$9 = tokenizedLine$$2.tokens;
      if(tokens$$9.length && tokens$$9[tokens$$9.length - 1].type == "comment") {
        return indent$$5
      }if(state$$27 == "start") {
        var match$$14 = line$$36.match(/^.*[\{\(\[\:]\s*$/);
        if(match$$14) {
          indent$$5 += tab$$7
        }
      }return indent$$5
    };
    this.checkOutdent = function(state$$28, line$$37, input$$8) {
      return this.$outdent.checkOutdent(line$$37, input$$8)
    };
    this.autoOutdent = function(state$$29, doc$$29, row$$61) {
      return this.$outdent.autoOutdent(doc$$29, row$$61)
    }
  }).call(Mode$$6.prototype);
  exports$$46.Mode = Mode$$6
});
define("ace/undomanager", ["require", "exports", "module"], function(require$$47, exports$$47) {
  var UndoManager = function() {
    this.$undoStack = [];
    this.$redoStack = []
  };
  (function() {
    this.execute = function(options$$7) {
      var deltas$$2 = options$$7.args[0];
      this.$doc = options$$7.args[1];
      this.$undoStack.push(deltas$$2)
    };
    this.undo = function() {
      var deltas$$3 = this.$undoStack.pop();
      if(deltas$$3) {
        this.$doc.undoChanges(deltas$$3);
        this.$redoStack.push(deltas$$3)
      }
    };
    this.redo = function() {
      var deltas$$4 = this.$redoStack.pop();
      if(deltas$$4) {
        this.$doc.redoChanges(deltas$$4);
        this.$undoStack.push(deltas$$4)
      }
    }
  }).call(UndoManager.prototype);
  exports$$47.UndoManager = UndoManager
});
define("demo/startup", ["require", "exports", "module", "pilot/event", "ace/editor", "ace/virtual_renderer", "ace/theme/textmate", "ace/document", "ace/mode/javascript", "ace/mode/css", "ace/mode/html", "ace/mode/xml", "ace/mode/python", "ace/mode/php", "ace/mode/text", "ace/undomanager"], function(require$$48, exports$$48) {
  exports$$48.launch = function(env$$51) {
    function setMode() {
      env$$51.editor.getDocument().setMode(modes[modeEl.value] || modes.text)
    }
    function onDocChange() {
      var doc$$30 = docs[docEl.value];
      env$$51.editor.setDocument(doc$$30);
      var mode$$4 = doc$$30.getMode();
      modeEl.value = mode$$4 instanceof JavaScriptMode$$1 ? "javascript" : mode$$4 instanceof CssMode$$1 ? "css" : mode$$4 instanceof HtmlMode ? "html" : mode$$4 instanceof XmlMode ? "xml" : mode$$4 instanceof PythonMode ? "python" : mode$$4 instanceof PhpMode ? "php" : "text";
      env$$51.editor.focus()
    }
    function setTheme() {
      env$$51.editor.setTheme(themeEl.value)
    }
    function setSelectionStyle() {
      selectEl.checked ? env$$51.editor.setSelectionStyle("line") : env$$51.editor.setSelectionStyle("text")
    }
    function setHighlightActiveLine() {
      env$$51.editor.setHighlightActiveLine(!!activeEl.checked)
    }
    function setShowInvisibles() {
      env$$51.editor.setShowInvisibles(!!showHiddenEl.checked)
    }
    function onResize() {
      container$$2.style.width = document.documentElement.clientWidth - 4 + "px";
      container$$2.style.height = document.documentElement.clientHeight - 55 - 4 - 23 + "px";
      env$$51.editor.resize()
    }
    var event$$6 = require$$48("pilot/event");
    var Editor$$1 = require$$48("ace/editor").Editor;
    var Renderer = require$$48("ace/virtual_renderer").VirtualRenderer;
    var theme$$5 = require$$48("ace/theme/textmate");
    var Document$$2 = require$$48("ace/document").Document;
    var JavaScriptMode$$1 = require$$48("ace/mode/javascript").Mode;
    var CssMode$$1 = require$$48("ace/mode/css").Mode;
    var HtmlMode = require$$48("ace/mode/html").Mode;
    var XmlMode = require$$48("ace/mode/xml").Mode;
    var PythonMode = require$$48("ace/mode/python").Mode;
    var PhpMode = require$$48("ace/mode/php").Mode;
    var TextMode$$7 = require$$48("ace/mode/text").Mode;
    var UndoManager$$1 = require$$48("ace/undomanager").UndoManager;
    var docs = {};
    docs.js = new Document$$2(document.getElementById("jstext").innerHTML);
    docs.js.setMode(new JavaScriptMode$$1);
    docs.js.setUndoManager(new UndoManager$$1);
    docs.css = new Document$$2(document.getElementById("csstext").innerHTML);
    docs.css.setMode(new CssMode$$1);
    docs.css.setUndoManager(new UndoManager$$1);
    docs.html = new Document$$2(document.getElementById("htmltext").innerHTML);
    docs.html.setMode(new HtmlMode);
    docs.html.setUndoManager(new UndoManager$$1);
    docs.python = new Document$$2(document.getElementById("pythontext").innerHTML);
    docs.python.setMode(new PythonMode);
    docs.python.setUndoManager(new UndoManager$$1);
    docs.php = new Document$$2(document.getElementById("phptext").innerHTML);
    docs.php.setMode(new PhpMode);
    docs.php.setUndoManager(new UndoManager$$1);
    var container$$2 = document.getElementById("editor");
    env$$51.editor = new Editor$$1(new Renderer(container$$2, theme$$5));
    var modes = {text:new TextMode$$7, xml:new XmlMode, html:new HtmlMode, css:new CssMode$$1, javascript:new JavaScriptMode$$1, python:new PythonMode, php:new PhpMode};
    var modeEl = document.getElementById("mode");
    modeEl.onchange = setMode;
    setMode();
    var docEl = document.getElementById("doc");
    docEl.onchange = onDocChange;
    onDocChange();
    var themeEl = document.getElementById("theme");
    themeEl.onchange = setTheme;
    setTheme();
    var selectEl = document.getElementById("select_style");
    selectEl.onchange = setSelectionStyle;
    setSelectionStyle();
    var activeEl = document.getElementById("highlight_active");
    activeEl.onchange = setHighlightActiveLine;
    setHighlightActiveLine();
    var showHiddenEl = document.getElementById("show_hidden");
    showHiddenEl.onchange = setShowInvisibles;
    setShowInvisibles();
    window.jump = function() {
      var jump = document.getElementById("jump");
      var cursor$$14 = env$$51.editor.getCursorPosition();
      var pos$$7 = env$$51.editor.renderer.textToScreenCoordinates(cursor$$14.row, cursor$$14.column);
      jump.style.left = pos$$7.pageX + "px";
      jump.style.top = pos$$7.pageY + "px";
      jump.style.display = "block"
    };
    window.onresize = onResize;
    onResize();
    event$$6.addListener(container$$2, "dragover", function(e$$38) {
      return event$$6.preventDefault(e$$38)
    });
    event$$6.addListener(container$$2, "drop", function(e$$39) {
      try {
        var file$$1 = e$$39.dataTransfer.files[0]
      }catch(e$$40) {
        return event$$6.stopEvent()
      }if(window.FileReader) {
        var reader = new FileReader;
        reader.onload = function() {
          env$$51.editor.getSelection().selectAll();
          var mode$$5 = "text";
          if(/^.*\.js$/i.test(file$$1.name)) {
            mode$$5 = "javascript"
          }else {
            if(/^.*\.xml$/i.test(file$$1.name)) {
              mode$$5 = "xml"
            }else {
              if(/^.*\.html$/i.test(file$$1.name)) {
                mode$$5 = "html"
              }else {
                if(/^.*\.css$/i.test(file$$1.name)) {
                  mode$$5 = "css"
                }else {
                  if(/^.*\.py$/i.test(file$$1.name)) {
                    mode$$5 = "python"
                  }else {
                    if(/^.*\.php$/i.test(file$$1.name)) {
                      mode$$5 = "php"
                    }
                  }
                }
              }
            }
          }env$$51.editor.onTextInput(reader.result);
          modeEl.value = mode$$5;
          env$$51.editor.getDocument().setMode(modes[mode$$5])
        };
        reader.readAsText(file$$1)
      }return event$$6.preventDefault(e$$39)
    })
  }
});
define("pilot/fixoldbrowsers", ["require", "exports", "module"], function(require$$49, exports$$49) {
  if(!Array.isArray) {
    Array.isArray = function(data$$5) {
      return data$$5 && Object.prototype.toString.call(data$$5) === "[object Array]"
    }
  }if(!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement) {
      if(this === void 0 || this === null) {
        throw new TypeError;
      }var t = Object(this);
      var len$$4 = t.length >>> 0;
      if(len$$4 === 0) {
        return-1
      }var n$$1 = 0;
      if(arguments.length > 0) {
        n$$1 = Number(arguments[1]);
        if(n$$1 !== n$$1) {
          n$$1 = 0
        }else {
          if(n$$1 !== 0 && n$$1 !== 1 / 0 && n$$1 !== -(1 / 0)) {
            n$$1 = (n$$1 > 0 || -1) * Math.floor(Math.abs(n$$1))
          }
        }
      }if(n$$1 >= len$$4) {
        return-1
      }var k = n$$1 >= 0 ? n$$1 : Math.max(len$$4 - Math.abs(n$$1), 0);
      for(;k < len$$4;k++) {
        if(k in t && t[k] === searchElement) {
          return k
        }
      }return-1
    }
  }if(!Array.prototype.map) {
    Array.prototype.map = function(fun, JSCompiler_OptimizeArgumentsArray_p0) {
      if(this === void 0 || this === null) {
        throw new TypeError;
      }var t$$1 = Object(this);
      var len$$5 = t$$1.length >>> 0;
      if(typeof fun !== "function") {
        throw new TypeError;
      }res = new Array(len$$5);
      var thisp = JSCompiler_OptimizeArgumentsArray_p0;
      var i$$37 = 0;
      for(;i$$37 < len$$5;i$$37++) {
        if(i$$37 in t$$1) {
          res[i$$37] = fun.call(thisp, t$$1[i$$37], i$$37, t$$1)
        }
      }return res
    }
  }if(!Array.prototype.forEach) {
    Array.prototype.forEach = function(fun$$1, JSCompiler_OptimizeArgumentsArray_p1) {
      if(this === void 0 || this === null) {
        throw new TypeError;
      }var t$$2 = Object(this);
      var len$$6 = t$$2.length >>> 0;
      if(typeof fun$$1 !== "function") {
        throw new TypeError;
      }var thisp$$1 = JSCompiler_OptimizeArgumentsArray_p1;
      var i$$38 = 0;
      for(;i$$38 < len$$6;i$$38++) {
        i$$38 in t$$2 && fun$$1.call(thisp$$1, t$$2[i$$38], i$$38, t$$2)
      }
    }
  }if(!Object.keys) {
    Object.keys = function(obj$$3) {
      var k$$1;
      var ret$$2 = [];
      for(k$$1 in obj$$3) {
        obj$$3.hasOwnProperty(k$$1) && ret$$2.push(k$$1)
      }return ret$$2
    }
  }if(!Function.prototype.bind) {
    Function.prototype.bind = function(obj$$4) {
      var slice = [].slice;
      var args$$57 = slice.call(arguments, 1);
      var self$$10 = this;
      var nop = function() {
      };
      var bound = arguments.length == 1 ? function() {
        return self$$10.apply(this instanceof nop ? this : obj$$4, arguments)
      } : function() {
        return self$$10.apply(this instanceof nop ? this : obj$$4 || {}, args$$57.concat(slice.call(arguments)))
      };
      nop.prototype = self$$10.prototype;
      bound.prototype = new nop;
      bound.name = this.name;
      bound.displayName = this.displayName;
      bound.length = this.length;
      bound.unbound = self$$10;
      return bound
    }
  }if(!String.prototype.trim) {
    String.prototype.trim = function() {
      return this.replace(/^\s+/, "").replace(/\s+$/, "")
    }
  }exports$$49.globalsLoaded = true
});