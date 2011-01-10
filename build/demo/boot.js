define("pilot/fixoldbrowsers", ["require", "exports", "module"], function(require$$1, exports) {
  if(!Array.isArray) {
    Array.isArray = function(data) {
      return data && Object.prototype.toString.call(data) === "[object Array]"
    }
  }if(!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement) {
      if(this === void 0 || this === null) {
        throw new TypeError;
      }var t = Object(this);
      var len = t.length >>> 0;
      if(len === 0) {
        return-1
      }var n = 0;
      if(arguments.length > 0) {
        n = Number(arguments[1]);
        if(n !== n) {
          n = 0
        }else {
          if(n !== 0 && n !== 1 / 0 && n !== -(1 / 0)) {
            n = (n > 0 || -1) * Math.floor(Math.abs(n))
          }
        }
      }if(n >= len) {
        return-1
      }var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
      for(;k < len;k++) {
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
      var len$$1 = t$$1.length >>> 0;
      if(typeof fun !== "function") {
        throw new TypeError;
      }res = new Array(len$$1);
      var thisp = JSCompiler_OptimizeArgumentsArray_p0;
      var i = 0;
      for(;i < len$$1;i++) {
        if(i in t$$1) {
          res[i] = fun.call(thisp, t$$1[i], i, t$$1)
        }
      }return res
    }
  }if(!Array.prototype.forEach) {
    Array.prototype.forEach = function(fun$$1, JSCompiler_OptimizeArgumentsArray_p1) {
      if(this === void 0 || this === null) {
        throw new TypeError;
      }var t$$2 = Object(this);
      var len$$2 = t$$2.length >>> 0;
      if(typeof fun$$1 !== "function") {
        throw new TypeError;
      }var thisp$$1 = JSCompiler_OptimizeArgumentsArray_p1;
      var i$$1 = 0;
      for(;i$$1 < len$$2;i$$1++) {
        i$$1 in t$$2 && fun$$1.call(thisp$$1, t$$2[i$$1], i$$1, t$$2)
      }
    }
  }if(!Object.keys) {
    Object.keys = function(obj) {
      var k$$1;
      var ret = [];
      for(k$$1 in obj) {
        obj.hasOwnProperty(k$$1) && ret.push(k$$1)
      }return ret
    }
  }if(!Function.prototype.bind) {
    Function.prototype.bind = function(obj$$1) {
      var slice = [].slice;
      var args = slice.call(arguments, 1);
      var self = this;
      var nop = function() {
      };
      var bound = arguments.length == 1 ? function() {
        return self.apply(this instanceof nop ? this : obj$$1, arguments)
      } : function() {
        return self.apply(this instanceof nop ? this : obj$$1 || {}, args.concat(slice.call(arguments)))
      };
      nop.prototype = self.prototype;
      bound.prototype = new nop;
      bound.name = this.name;
      bound.displayName = this.displayName;
      bound.length = this.length;
      bound.unbound = self;
      return bound
    }
  }if(!String.prototype.trim) {
    String.prototype.trim = function() {
      return this.replace(/^\s+/, "").replace(/\s+$/, "")
    }
  }exports.globalsLoaded = true
});
define("pilot/console", ["require", "exports", "module"], function(require$$2, exports$$1) {
  var noop = function() {
  };
  var NAMES = ["assert", "count", "debug", "dir", "dirxml", "error", "group", "groupEnd", "info", "log", "profile", "profileEnd", "time", "timeEnd", "trace", "warn"];
  typeof window === "undefined" ? NAMES.forEach(function(name) {
    exports$$1[name] = function() {
      var args$$1 = Array.prototype.slice.call(arguments);
      var msg = {op:"log", method:name, args:args$$1};
      postMessage(JSON.stringify(msg))
    }
  }) : NAMES.forEach(function(name$$1) {
    exports$$1[name$$1] = window.console && window.console[name$$1] ? Function.prototype.bind.call(window.console[name$$1], window.console) : noop
  })
});
define("pilot/useragent", ["require", "exports", "module"], function(require$$3, exports$$2) {
  var os = (navigator.platform.match(/mac|win|linux/i) || ["other"])[0].toLowerCase();
  var ua = navigator.userAgent;
  exports$$2.isWin = os == "win";
  exports$$2.isMac = os == "mac";
  exports$$2.isLinux = os == "linux";
  exports$$2.isIE = !+"\u000b1";
  exports$$2.isGecko = exports$$2.isMozilla = window.controllers && window.navigator.product === "Gecko";
  exports$$2.isOpera = window.opera && Object.prototype.toString.call(window.opera) == "[object Opera]";
  exports$$2.isWebKit = parseFloat(ua.split("WebKit/")[1]) || undefined;
  exports$$2.isAIR = ua.indexOf("AdobeAIR") >= 0;
  exports$$2.OS = {LINUX:"LINUX", MAC:"MAC", WINDOWS:"WINDOWS"};
  exports$$2.getOS = function() {
    return exports$$2.isMac ? exports$$2.OS["MAC"] : exports$$2.isLinux ? exports$$2.OS["LINUX"] : exports$$2.OS["WINDOWS"]
  }
});
define("pilot/stacktrace", ["require", "exports", "module", "pilot/useragent", "pilot/console"], function(require$$4, exports$$3) {
  function stringifyArguments(args$$2) {
    var i$$2 = 0;
    for(;i$$2 < args$$2.length;++i$$2) {
      var argument = args$$2[i$$2];
      if(typeof argument == "object") {
        args$$2[i$$2] = "#object"
      }else {
        if(typeof argument == "function") {
          args$$2[i$$2] = "#function"
        }else {
          if(typeof argument == "string") {
            args$$2[i$$2] = '"' + argument + '"'
          }
        }
      }
    }return args$$2.join(",")
  }
  function NameGuesser() {
  }
  var ua$$1 = require$$4("pilot/useragent");
  var console$$1 = require$$4("pilot/console");
  var mode = function() {
    return ua$$1.isGecko ? "firefox" : ua$$1.isOpera ? "opera" : "other"
  }();
  var decoders = {chrome:function(e$$1) {
    var stack = e$$1.stack;
    if(!stack) {
      console$$1.log(e$$1);
      return[]
    }return stack.replace(/^.*?\n/, "").replace(/^.*?\n/, "").replace(/^.*?\n/, "").replace(/^[^\(]+?[\n$]/gm, "").replace(/^\s+at\s+/gm, "").replace(/^Object.<anonymous>\s*\(/gm, "{anonymous}()@").split("\n")
  }, firefox:function(e$$2) {
    var stack$$1 = e$$2.stack;
    if(!stack$$1) {
      console$$1.log(e$$2);
      return[]
    }stack$$1 = stack$$1.replace(/(?:\n@:0)?\s+$/m, "");
    stack$$1 = stack$$1.replace(/^\(/gm, "{anonymous}(");
    return stack$$1.split("\n")
  }, opera:function(e$$3) {
    var lines = e$$3.message.split("\n");
    var ANON = "{anonymous}";
    var lineRE = /Line\s+(\d+).*?script\s+(http\S+)(?:.*?in\s+function\s+(\S+))?/i;
    var i$$3;
    var j;
    var len$$3;
    i$$3 = 4;
    j = 0;
    len$$3 = lines.length;
    for(;i$$3 < len$$3;i$$3 += 2) {
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
    var args$$3;
    var maxStackSize = 10;
    for(;curr && stack$$2.length < maxStackSize;) {
      fn = fnRE.test(curr.toString()) ? RegExp.$1 || ANON$$1 : ANON$$1;
      args$$3 = Array.prototype.slice.call(curr["arguments"]);
      stack$$2[j$$1++] = fn + "(" + stringifyArguments(args$$3) + ")";
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
      }catch(e$$4) {
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
    }catch(e$$5) {
      return"getSource failed with url: " + url$$2 + ", exception: " + e$$5.toString()
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
  exports$$3.ignoreFramesMatching = function(regex) {
    frameIgnorePatterns.push(regex)
  };
  exports$$3.Trace = function(ex, guess) {
    this._ex = ex;
    this._stack = decoders[mode](ex);
    if(guess) {
      this._stack = guesser.guessFunctions(this._stack)
    }
  };
  exports$$3.Trace.prototype.log = function(lines$$1) {
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
        console$$1.debug(frame$$1);
        printed++
      }
    }
  }
});
define("pilot/promise", ["require", "exports", "module", "pilot/console", "pilot/stacktrace"], function(require$$5, exports$$4) {
  var console$$2 = require$$5("pilot/console");
  var Trace$$1 = require$$5("pilot/stacktrace").Trace;
  var ERROR = -1;
  var PENDING = 0;
  var SUCCESS = 1;
  var _nextId = 0;
  var _traceCompletion = false;
  var _outstanding = [];
  var _recent = [];
  Promise = function() {
    this._status = PENDING;
    this._value = undefined;
    this._onSuccessHandlers = [];
    this._onErrorHandlers = [];
    this._id = _nextId++;
    _outstanding[this._id] = this
  };
  Promise.prototype.isPromise = true;
  Promise.prototype.isComplete = function() {
    return this._status != PENDING
  };
  Promise.prototype.isResolved = function() {
    return this._status == SUCCESS
  };
  Promise.prototype.isRejected = function() {
    return this._status == ERROR
  };
  Promise.prototype.then = function(onSuccess, onError) {
    if(typeof onSuccess === "function") {
      if(this._status === SUCCESS) {
        onSuccess.call(null, this._value)
      }else {
        this._status === PENDING && this._onSuccessHandlers.push(onSuccess)
      }
    }if(typeof onError === "function") {
      if(this._status === ERROR) {
        onError.call(null, this._value)
      }else {
        this._status === PENDING && this._onErrorHandlers.push(onError)
      }
    }return this
  };
  Promise.prototype.chainPromise = function(onSuccess$$1) {
    var chain = new Promise;
    chain._chainedFrom = this;
    this.then(function(data$$1) {
      try {
        chain.resolve(onSuccess$$1(data$$1))
      }catch(ex$$1) {
        chain.reject(ex$$1)
      }
    }, function(ex$$2) {
      chain.reject(ex$$2)
    });
    return chain
  };
  Promise.prototype.resolve = function(data$$2) {
    return this._complete(this._onSuccessHandlers, SUCCESS, data$$2, "resolve")
  };
  Promise.prototype.reject = function(data$$3) {
    return this._complete(this._onErrorHandlers, ERROR, data$$3, "reject")
  };
  Promise.prototype._complete = function(list, status, data$$4, name$$2) {
    if(this._status != PENDING) {
      console$$2.group("Promise already closed");
      console$$2.error("Attempted " + name$$2 + "() with ", data$$4);
      console$$2.error("Previous status = ", this._status, ", previous value = ", this._value);
      console$$2.trace();
      if(this._completeTrace) {
        console$$2.error("Trace of previous completion:");
        this._completeTrace.log(5)
      }console$$2.groupEnd();
      return this
    }if(_traceCompletion) {
      this._completeTrace = new Trace$$1(new Error)
    }this._status = status;
    this._value = data$$4;
    list.forEach(function(handler) {
      handler.call(null, this._value)
    }, this);
    this._onSuccessHandlers.length = 0;
    this._onErrorHandlers.length = 0;
    delete _outstanding[this._id];
    _recent.push(this);
    for(;_recent.length > 20;) {
      _recent.shift()
    }return this
  };
  Promise.group = function(promiseList) {
    promiseList instanceof Array || (promiseList = Array.prototype.slice.call(arguments));
    if(promiseList.length === 0) {
      return(new Promise).resolve([])
    }var groupPromise = new Promise;
    var results = [];
    var fulfilled = 0;
    var onSuccessFactory = function(index) {
      return function(data$$5) {
        results[index] = data$$5;
        fulfilled++;
        groupPromise._status !== ERROR && fulfilled === promiseList.length && groupPromise.resolve(results)
      }
    };
    promiseList.forEach(function(promise, index$$1) {
      var onSuccess$$2 = onSuccessFactory(index$$1);
      var onError$$1 = groupPromise.reject.bind(groupPromise);
      promise.then(onSuccess$$2, onError$$1)
    });
    return groupPromise
  };
  exports$$4.Promise = Promise;
  exports$$4._outstanding = _outstanding;
  exports$$4._recent = _recent
});
define("pilot/plugin_manager", ["require", "exports", "module", "pilot/promise"], function(require$$6, exports$$5) {
  var Promise$$1 = require$$6("pilot/promise").Promise;
  exports$$5.REASONS = {APP_STARTUP:1, APP_SHUTDOWN:2, PLUGIN_ENABLE:3, PLUGIN_DISABLE:4, PLUGIN_INSTALL:5, PLUGIN_UNINSTALL:6, PLUGIN_UPGRADE:7, PLUGIN_DOWNGRADE:8};
  exports$$5.Plugin = function(name$$3) {
    this.name = name$$3;
    this.status = this.INSTALLED
  };
  exports$$5.Plugin.prototype = {NEW:0, INSTALLED:1, REGISTERED:2, STARTED:3, UNREGISTERED:4, SHUTDOWN:5, install:function(data$$6, reason) {
    var pr = new Promise$$1;
    if(this.status > this.NEW) {
      pr.resolve(this);
      return pr
    }require$$6([this.name], function(pluginModule$$1) {
      pluginModule$$1.install && pluginModule$$1.install(data$$6, reason);
      this.status = this.INSTALLED;
      pr.resolve(this)
    }.bind(this));
    return pr
  }, register:function(data$$7, reason$$1) {
    var pr$$1 = new Promise$$1;
    if(this.status != this.INSTALLED) {
      pr$$1.resolve(this);
      return pr$$1
    }require$$6([this.name], function(pluginModule$$2) {
      pluginModule$$2.register && pluginModule$$2.register(data$$7, reason$$1);
      this.status = this.REGISTERED;
      pr$$1.resolve(this)
    }.bind(this));
    return pr$$1
  }, startup:function(data$$8, reason$$2) {
    var pr$$2 = new Promise$$1;
    if(this.status != this.REGISTERED) {
      pr$$2.resolve(this);
      return pr$$2
    }require$$6([this.name], function(pluginModule$$3) {
      pluginModule$$3.startup && pluginModule$$3.startup(data$$8, reason$$2);
      this.status = this.STARTED;
      pr$$2.resolve(this)
    }.bind(this));
    return pr$$2
  }, shutdown:function(data$$9, reason$$3) {
    if(this.status != this.STARTED) {
      return
    }pluginModule = require$$6(this.name);
    pluginModule.shutdown && pluginModule.shutdown(data$$9, reason$$3)
  }};
  exports$$5.PluginCatalog = function() {
    this.plugins = {}
  };
  exports$$5.PluginCatalog.prototype = {registerPlugins:function(pluginList, data$$10, reason$$4) {
    var registrationPromises = [];
    pluginList.forEach(function(pluginName) {
      var plugin = this.plugins[pluginName];
      if(plugin === undefined) {
        plugin = new exports$$5.Plugin(pluginName);
        this.plugins[pluginName] = plugin;
        registrationPromises.push(plugin.register(data$$10, reason$$4))
      }
    }.bind(this));
    return Promise$$1.group(registrationPromises)
  }, startupPlugins:function(data$$11, reason$$5) {
    var startupPromises = [];
    for(var pluginName$$1 in this.plugins) {
      var plugin$$1 = this.plugins[pluginName$$1];
      startupPromises.push(plugin$$1.startup(data$$11, reason$$5))
    }return Promise$$1.group(startupPromises)
  }};
  exports$$5.catalog = new exports$$5.PluginCatalog
});
define("pilot/oop", ["require", "exports", "module"], function(require$$7, exports$$6) {
  exports$$6.inherits = function(ctor, superCtor) {
    var tempCtor = function() {
    };
    tempCtor.prototype = superCtor.prototype;
    ctor.super_ = superCtor.prototype;
    ctor.prototype = new tempCtor;
    ctor.prototype.constructor = ctor
  };
  exports$$6.mixin = function(obj$$2, mixin) {
    for(var key in mixin) {
      obj$$2[key] = mixin[key]
    }
  };
  exports$$6.implement = function(proto, mixin$$1) {
    exports$$6.mixin(proto, mixin$$1)
  }
});
define("pilot/types", ["require", "exports", "module"], function(require$$8, exports$$7) {
  function Conversion(value, status$$1, message, predictions) {
    this.value = value;
    this.status = status$$1 || Status.VALID;
    this.message = message;
    this.predictions = predictions || []
  }
  function Type() {
  }
  function reconstituteType(name$$4, typeSpec) {
    var type = types[name$$4];
    if(typeof type === "function") {
      type = new type(typeSpec)
    }return type
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
    var i$$8 = 0;
    for(;i$$8 < arguments;i$$8++) {
      if(arguments[i$$8] > combined) {
        combined = arguments[i$$8]
      }
    }return combined
  }};
  exports$$7.Status = Status;
  exports$$7.Conversion = Conversion;
  Type.prototype = {stringify:function() {
    throw new Error("not implemented");
  }, parse:function() {
    throw new Error("not implemented");
  }, name:undefined, increment:function() {
    return
  }, decrement:function() {
    return
  }};
  exports$$7.Type = Type;
  var types = {};
  exports$$7.registerType = function(type$$1) {
    if(typeof type$$1 === "object") {
      if(type$$1 instanceof Type) {
        if(!type$$1.name) {
          throw new Error("All registered types must have a name");
        }types[type$$1.name] = type$$1
      }else {
        throw new Error("Can't registerType using: " + type$$1);
      }
    }else {
      if(typeof type$$1 === "function") {
        if(!type$$1.prototype.name) {
          throw new Error("All registered types must have a name");
        }types[type$$1.prototype.name] = type$$1
      }else {
        throw new Error("Unknown type: " + type$$1);
      }
    }
  };
  exports$$7.deregisterType = function(type$$2) {
    delete types[type$$2.name]
  };
  exports$$7.getType = function(typeSpec$$1) {
    if(typeof typeSpec$$1 === "string") {
      return reconstituteType(typeSpec$$1, typeSpec$$1)
    }if(typeof typeSpec$$1 == "object") {
      if(!typeSpec$$1.name) {
        throw new Error("Missing 'name' member to typeSpec");
      }return reconstituteType(typeSpec$$1.name, typeSpec$$1)
    }throw new Error("Can't extract type from " + typeSpec$$1);
  }
});
define("pilot/event_emitter", ["require", "exports", "module"], function(require$$9, exports$$8) {
  var EventEmitter = {};
  EventEmitter._dispatchEvent = function(eventName, e$$6) {
    this._eventRegistry = this._eventRegistry || {};
    var listeners = this._eventRegistry[eventName];
    if(!listeners || !listeners.length) {
      return
    }e$$6 = e$$6 || {};
    e$$6.type = eventName;
    var i$$9 = 0;
    for(;i$$9 < listeners.length;i$$9++) {
      listeners[i$$9](e$$6)
    }
  };
  EventEmitter.on = EventEmitter.addEventListener = function(eventName$$1, callback) {
    this._eventRegistry = this._eventRegistry || {};
    var listeners$$1 = this._eventRegistry[eventName$$1];
    listeners$$1 || (listeners$$1 = this._eventRegistry[eventName$$1] = []);
    listeners$$1.indexOf(callback) == -1 && listeners$$1.push(callback)
  };
  EventEmitter.removeEventListener = function(eventName$$2, callback$$1) {
    this._eventRegistry = this._eventRegistry || {};
    var listeners$$2 = this._eventRegistry[eventName$$2];
    if(!listeners$$2) {
      return
    }var index$$2 = listeners$$2.indexOf(callback$$1);
    index$$2 !== -1 && listeners$$2.splice(index$$2, 1)
  };
  exports$$8.EventEmitter = EventEmitter
});
define("pilot/catalog", ["require", "exports", "module"], function(require$$10, exports$$9) {
  var extensionSpecs = {};
  exports$$9.addExtensionSpec = function(extensionSpec) {
    extensionSpecs[extensionSpec.name] = extensionSpec
  };
  exports$$9.removeExtensionSpec = function(extensionSpec$$1) {
    if(typeof extensionSpec$$1 === "string") {
      delete extensionSpecs[extensionSpec$$1]
    }else {
      delete extensionSpecs[extensionSpec$$1.name]
    }
  };
  exports$$9.getExtensionSpec = function(name$$5) {
    return extensionSpecs[name$$5]
  };
  exports$$9.getExtensionSpecs = function() {
    return Object.keys(extensionSpecs)
  }
});
define("pilot/settings", ["require", "exports", "module", "pilot/console", "pilot/oop", "pilot/types", "pilot/event_emitter", "pilot/catalog"], function(require$$11, exports$$10) {
  function Setting(settingSpec, settings) {
    this._settings = settings;
    Object.keys(settingSpec).forEach(function(key$$1) {
      this[key$$1] = settingSpec[key$$1]
    }, this);
    this.type = types$$1.getType(this.type);
    if(this.type == null) {
      throw new Error("In " + this.name + ": can't find type for: " + JSON.stringify(settingSpec.type));
    }if(!this.name) {
      throw new Error("Setting.name == undefined. Ignoring.", this);
    }if(!this.defaultValue === undefined) {
      throw new Error("Setting.defaultValue == undefined", this);
    }this.value = this.defaultValue
  }
  function Settings(persister) {
    this._deactivated = {};
    this._settings = {};
    this._settingNames = [];
    persister && this.setPersister(persister)
  }
  function CookiePersister() {
  }
  var console$$3 = require$$11("pilot/console");
  var oop = require$$11("pilot/oop");
  var types$$1 = require$$11("pilot/types");
  var EventEmitter$$1 = require$$11("pilot/event_emitter").EventEmitter;
  var catalog = require$$11("pilot/catalog");
  var settingExtensionSpec = {name:"setting", description:"A setting is something that the application offers as a way to customize how it works", register:"env.settings.addSetting", indexOn:"name"};
  exports$$10.startup = function() {
    catalog.addExtensionSpec(settingExtensionSpec)
  };
  exports$$10.shutdown = function() {
    catalog.removeExtensionSpec(settingExtensionSpec)
  };
  Setting.prototype = {get:function() {
    return this.value
  }, set:function(value$$4) {
    if(this.value === value$$4) {
      return
    }this.value = value$$4;
    this._settings.persister && this._settings.persister.persistValue(this._settings, this.name, value$$4);
    this._dispatchEvent("change", {setting:this, value:value$$4})
  }, resetValue:function() {
    this.set(this.defaultValue)
  }};
  oop.implement(Setting.prototype, EventEmitter$$1);
  Settings.prototype = {addSetting:function(settingSpec$$1) {
    var setting$$1 = new Setting(settingSpec$$1, this);
    this._settings[setting$$1.name] = setting$$1;
    this._settingNames.push(setting$$1.name);
    this._settingNames.sort()
  }, removeSetting:function(setting$$2) {
    var name$$6 = typeof setting$$2 === "string" ? setting$$2 : setting$$2.name;
    delete this._settings[name$$6];
    util.arrayRemove(this._settingNames, name$$6)
  }, getSettingNames:function() {
    return this._settingNames
  }, getSetting:function(name$$7) {
    return this._settings[name$$7]
  }, setPersister:function(persister$$1) {
    this._persister = persister$$1;
    persister$$1 && persister$$1.loadInitialValues(this)
  }, resetAll:function() {
    this.getSettingNames().forEach(function(key$$2) {
      this.resetValue(key$$2)
    }, this)
  }, _list:function() {
    var reply = [];
    this.getSettingNames().forEach(function(setting$$3) {
      reply.push({key:setting$$3, value:this.getSetting(setting$$3).get()})
    }, this);
    return reply
  }, _loadDefaultValues:function() {
    this._loadFromObject(this._getDefaultValues())
  }, _loadFromObject:function(data$$14) {
    for(var key$$3 in data$$14) {
      if(data$$14.hasOwnProperty(key$$3)) {
        var setting$$4 = this._settings[key$$3];
        if(setting$$4) {
          var value$$5 = setting$$4.type.parse(data$$14[key$$3]);
          this.set(key$$3, value$$5)
        }else {
          this.set(key$$3, data$$14[key$$3])
        }
      }
    }
  }, _saveToObject:function() {
    return this.getSettingNames().map(function(key$$4) {
      return this._settings[key$$4].type.stringify(this.get(key$$4))
    }.bind(this))
  }, _getDefaultValues:function() {
    return this.getSettingNames().map(function(key$$5) {
      return this._settings[key$$5].spec.defaultValue
    }.bind(this))
  }};
  exports$$10.settings = new Settings;
  CookiePersister.prototype = {loadInitialValues:function(settings$$1) {
    settings$$1._loadDefaultValues();
    var data$$15 = cookie.get("settings");
    settings$$1._loadFromObject(JSON.parse(data$$15))
  }, persistValue:function(settings$$2) {
    try {
      var stringData = JSON.stringify(settings$$2._saveToObject());
      cookie.set("settings", stringData)
    }catch(ex$$3) {
      console$$3.error("Unable to JSONify the settings! " + ex$$3);
      return
    }
  }};
  exports$$10.CookiePersister = CookiePersister
});
define("pilot/environment", ["require", "exports", "module", "pilot/settings"], function(require$$12, exports$$11) {
  function create() {
    return{settings:settings$$3}
  }
  var settings$$3 = require$$12("pilot/settings").settings;
  exports$$11.create = create
});
define("pilot/types/basic", ["require", "exports", "module", "pilot/types"], function(require$$13, exports$$12) {
  function SelectionType(typeSpec$$2) {
    if(!Array.isArray(typeSpec$$2.data) && typeof typeSpec$$2.data !== "function") {
      throw new Error("instances of SelectionType need typeSpec.data to be an array or function that returns an array:" + JSON.stringify(typeSpec$$2));
    }Object.keys(typeSpec$$2).forEach(function(key$$7) {
      this[key$$7] = typeSpec$$2[key$$7]
    }, this)
  }
  function DeferredType(typeSpec$$3) {
    if(typeof typeSpec$$3.defer !== "function") {
      throw new Error("Instances of DeferredType need typeSpec.defer to be a function that returns a type");
    }Object.keys(typeSpec$$3).forEach(function(key$$8) {
      this[key$$8] = typeSpec$$3[key$$8]
    }, this)
  }
  var types$$2 = require$$13("pilot/types");
  var Type$$1 = types$$2.Type;
  var Conversion$$1 = types$$2.Conversion;
  var Status$$1 = types$$2.Status;
  var text = new Type$$1;
  text.stringify = function(value$$7) {
    return value$$7
  };
  text.parse = function(value$$8) {
    if(typeof value$$8 != "string") {
      throw new Error("non-string passed to text.parse()");
    }return new Conversion$$1(value$$8)
  };
  text.name = "text";
  var number = new Type$$1;
  number.stringify = function(value$$9) {
    if(!value$$9) {
      return null
    }return"" + value$$9
  };
  number.parse = function(value$$10) {
    if(typeof value$$10 != "string") {
      throw new Error("non-string passed to number.parse()");
    }if(value$$10.replace(/\s/g, "").length === 0) {
      return new Conversion$$1(null, Status$$1.INCOMPLETE, "")
    }var reply$$1 = new Conversion$$1(parseInt(value$$10, 10));
    if(isNaN(reply$$1.value)) {
      reply$$1.status = Status$$1.INVALID;
      reply$$1.message = "Can't convert \"" + value$$10 + '" to a number.'
    }return reply$$1
  };
  number.decrement = function(value$$11) {
    return value$$11 - 1
  };
  number.increment = function(value$$12) {
    return value$$12 + 1
  };
  number.name = "number";
  SelectionType.prototype = new Type$$1;
  SelectionType.prototype.stringify = function(value$$13) {
    return value$$13
  };
  SelectionType.prototype.parse = function(str$$1) {
    if(typeof str$$1 != "string") {
      throw new Error("non-string passed to parse()");
    }if(!this.data) {
      throw new Error("Missing data on selection type extension.");
    }var data$$16 = typeof this.data === "function" ? this.data() : this.data;
    var hasMatched = false;
    var matchedValue;
    var completions = [];
    data$$16.forEach(function(option) {
      if(str$$1 == option) {
        matchedValue = this.fromString(option);
        hasMatched = true
      }else {
        option.indexOf(str$$1) === 0 && completions.push(this.fromString(option))
      }
    }, this);
    if(hasMatched) {
      return new Conversion$$1(matchedValue)
    }else {
      this.noMatch && this.noMatch();
      if(completions.length > 0) {
        var msg$$1 = "Possibilities" + (str$$1.length === 0 ? "" : " for '" + str$$1 + "'");
        return new Conversion$$1(null, Status$$1.INCOMPLETE, msg$$1, completions)
      }else {
        msg$$1 = "Can't use '" + str$$1 + "'.";
        return new Conversion$$1(null, Status$$1.INVALID, msg$$1, completions)
      }
    }
  };
  SelectionType.prototype.fromString = function(str$$2) {
    return str$$2
  };
  SelectionType.prototype.decrement = function(value$$14) {
    var data$$17 = typeof this.data === "function" ? this.data() : this.data;
    var index$$3;
    if(value$$14 == null) {
      index$$3 = data$$17.length - 1
    }else {
      var name$$8 = this.stringify(value$$14);
      index$$3 = data$$17.indexOf(name$$8);
      index$$3 = index$$3 === 0 ? data$$17.length - 1 : index$$3 - 1
    }return this.fromString(data$$17[index$$3])
  };
  SelectionType.prototype.increment = function(value$$15) {
    var data$$18 = typeof this.data === "function" ? this.data() : this.data;
    var index$$4;
    if(value$$15 == null) {
      index$$4 = 0
    }else {
      var name$$9 = this.stringify(value$$15);
      index$$4 = data$$18.indexOf(name$$9);
      index$$4 = index$$4 === data$$18.length - 1 ? 0 : index$$4 + 1
    }return this.fromString(data$$18[index$$4])
  };
  SelectionType.prototype.name = "selection";
  exports$$12.SelectionType = SelectionType;
  var bool = new SelectionType({name:"bool", data:["true", "false"], stringify:function(value$$16) {
    return"" + value$$16
  }, fromString:function(str$$3) {
    return str$$3 === "true" ? true : false
  }});
  DeferredType.prototype = new Type$$1;
  DeferredType.prototype.stringify = function(value$$17) {
    return this.defer().stringify(value$$17)
  };
  DeferredType.prototype.parse = function(value$$18) {
    return this.defer().parse(value$$18)
  };
  DeferredType.prototype.decrement = function(value$$19) {
    var deferred = this.defer();
    return deferred.decrement ? deferred.decrement(value$$19) : undefined
  };
  DeferredType.prototype.increment = function(value$$20) {
    var deferred$$1 = this.defer();
    return deferred$$1.increment ? deferred$$1.increment(value$$20) : undefined
  };
  DeferredType.prototype.name = "deferred";
  exports$$12.DeferredType = DeferredType;
  exports$$12.startup = function() {
    types$$2.registerType(text);
    types$$2.registerType(number);
    types$$2.registerType(bool);
    types$$2.registerType(SelectionType);
    types$$2.registerType(DeferredType)
  };
  exports$$12.shutdown = function() {
    types$$2.unregisterType(text);
    types$$2.unregisterType(number);
    types$$2.unregisterType(bool);
    types$$2.unregisterType(SelectionType);
    types$$2.unregisterType(DeferredType)
  }
});
define("pilot/lang", ["require", "exports", "module"], function(require$$14, exports$$13) {
  exports$$13.stringReverse = function(string) {
    return string.split("").reverse().join("")
  };
  exports$$13.stringRepeat = function(string$$1, count) {
    return(new Array(count + 1)).join(string$$1)
  };
  exports$$13.copyObject = function(obj$$3) {
    var copy = {};
    for(var key$$9 in obj$$3) {
      copy[key$$9] = obj$$3[key$$9]
    }return copy
  };
  exports$$13.arrayToMap = function(arr) {
    var map = {};
    var i$$10 = 0;
    for(;i$$10 < arr.length;i$$10++) {
      map[arr[i$$10]] = 1
    }return map
  };
  exports$$13.arrayRemove = function(array, value$$21) {
    var i$$11 = 0;
    for(;i$$11 <= array.length;i$$11++) {
      value$$21 === array[i$$11] && array.splice(i$$11, 1)
    }
  };
  exports$$13.escapeRegExp = function(str$$4) {
    return str$$4.replace(/([.*+?^${}()|[\]\/\\])/g, "\\$1")
  };
  exports$$13.deferredCall = function(fcn) {
    var timer = null;
    var callback$$2 = function() {
      timer = null;
      fcn()
    };
    return{schedule:function() {
      timer || (timer = setTimeout(callback$$2, 0))
    }, call:function() {
      this.cancel();
      fcn()
    }, cancel:function() {
      clearTimeout(timer);
      timer = null
    }}
  }
});
define("pilot/canon", ["require", "exports", "module", "pilot/console", "pilot/stacktrace", "pilot/oop", "pilot/event_emitter", "pilot/catalog", "pilot/types", "pilot/types", "pilot/lang"], function(require$$15, exports$$14) {
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
  function upgradeType(name$$10, param$$1) {
    var lookup = param$$1.type;
    param$$1.type = types$$3.getType(lookup);
    if(param$$1.type == null) {
      throw new Error("In " + name$$10 + "/" + param$$1.name + ": can't find type for: " + JSON.stringify(lookup));
    }
  }
  function removeCommand(command$$1) {
    var name$$11 = typeof command$$1 === "string" ? command$$1 : command$$1.name;
    delete commands[name$$11];
    lang.arrayRemove(commandNames, name$$11)
  }
  function getCommand(name$$12) {
    return commands[name$$12]
  }
  function getCommandNames() {
    return commandNames
  }
  function exec(command$$2, env, args$$4, typed) {
    if(typeof command$$2 === "string") {
      command$$2 = commands[command$$2]
    }if(!command$$2) {
      return false
    }var request = new Request({command:command$$2, args:args$$4, typed:typed});
    command$$2.exec(env, args$$4 || {}, request);
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
  require$$15("pilot/console");
  require$$15("pilot/stacktrace").Trace;
  var oop$$1 = require$$15("pilot/oop");
  var EventEmitter$$2 = require$$15("pilot/event_emitter").EventEmitter;
  var catalog$$1 = require$$15("pilot/catalog");
  require$$15("pilot/types").Status;
  var types$$3 = require$$15("pilot/types");
  var lang = require$$15("pilot/lang");
  var commandExtensionSpec = {name:"command", description:"A command is a bit of functionality with optional typed arguments which can do something small like moving the cursor around the screen, or large like cloning a project from VCS.", indexOn:"name"};
  exports$$14.startup = function() {
    catalog$$1.addExtensionSpec(commandExtensionSpec)
  };
  exports$$14.shutdown = function() {
    catalog$$1.removeExtensionSpec(commandExtensionSpec)
  };
  var commands = {};
  var commandNames = [];
  exports$$14.removeCommand = removeCommand;
  exports$$14.addCommand = addCommand;
  exports$$14.getCommand = getCommand;
  exports$$14.getCommandNames = getCommandNames;
  exports$$14.exec = exec;
  exports$$14.upgradeType = upgradeType;
  oop$$1.implement(exports$$14, EventEmitter$$2);
  var requests = [];
  var maxRequestLength = 100;
  oop$$1.implement(Request.prototype, EventEmitter$$2);
  Request.prototype._beginOutput = function() {
    this._begunOutput = true;
    this.outputs = [];
    requests.push(this);
    for(;requests.length > maxRequestLength;) {
      requests.shiftObject()
    }exports$$14._dispatchEvent("output", {requests:requests, request:this})
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
  exports$$14.Request = Request
});
define("pilot/types/command", ["require", "exports", "module", "pilot/canon", "pilot/types/basic", "pilot/types"], function(require$$16, exports$$15) {
  var canon = require$$16("pilot/canon");
  var SelectionType$$1 = require$$16("pilot/types/basic").SelectionType;
  var types$$4 = require$$16("pilot/types");
  var command$$3 = new SelectionType$$1({name:"command", data:function() {
    return canon.getCommandNames()
  }, stringify:function(command$$4) {
    return command$$4.name
  }, fromString:function(str$$5) {
    return canon.getCommand(str$$5)
  }});
  exports$$15.startup = function() {
    types$$4.registerType(command$$3)
  };
  exports$$15.shutdown = function() {
    types$$4.unregisterType(command$$3)
  }
});
define("pilot/types/settings", ["require", "exports", "module", "pilot/types/basic", "pilot/types/basic", "pilot/types", "pilot/settings"], function(require$$17, exports$$16) {
  var SelectionType$$2 = require$$17("pilot/types/basic").SelectionType;
  var DeferredType$$1 = require$$17("pilot/types/basic").DeferredType;
  var types$$5 = require$$17("pilot/types");
  var settings$$4 = require$$17("pilot/settings").settings;
  var lastSetting;
  var setting$$5 = new SelectionType$$2({name:"setting", data:function() {
    return env$$2.settings.getSettingNames()
  }, stringify:function(setting$$6) {
    lastSetting = setting$$6;
    return setting$$6.name
  }, fromString:function(str$$6) {
    lastSetting = settings$$4.getSetting(str$$6);
    return lastSetting
  }, noMatch:function() {
    lastSetting = null
  }});
  var settingValue = new DeferredType$$1({name:"settingValue", defer:function() {
    return lastSetting ? lastSetting.type : types$$5.getType("text")
  }});
  var env$$2;
  exports$$16.startup = function(data$$21) {
    env$$2 = data$$21.env;
    types$$5.registerType(setting$$5);
    types$$5.registerType(settingValue)
  };
  exports$$16.shutdown = function() {
    types$$5.unregisterType(setting$$5);
    types$$5.unregisterType(settingValue)
  }
});
define("pilot/commands/settings", ["require", "exports", "module", "pilot/canon"], function(require$$18, exports$$17) {
  var setCommandSpec = {name:"set", params:[{name:"setting", type:"setting", description:"The name of the setting to display or alter", defaultValue:null}, {name:"value", type:"settingValue", description:"The new value for the chosen setting", defaultValue:null}], description:"define and show settings", exec:function(env$$3, args$$6, request$$2) {
    var html;
    if(args$$6.setting) {
      if(args$$6.value === undefined) {
        html = "<strong>" + setting.name + "</strong> = " + setting.get()
      }else {
        args$$6.setting.set(args$$6.value);
        html = "Setting: <strong>" + args$$6.setting.name + "</strong> = " + args$$6.setting.get()
      }
    }else {
      var names = env$$3.settings.getSettingNames();
      html = "";
      names.sort(function(name1, name2) {
        return name1.localeCompare(name2)
      });
      names.forEach(function(name$$13) {
        var setting$$7 = env$$3.settings.getSetting(name$$13);
        var url$$3 = "https://wiki.mozilla.org/Labs/Skywriter/Settings#" + setting$$7.name;
        html += '<a class="setting" href="' + url$$3 + '" title="View external documentation on setting: ' + setting$$7.name + '" target="_blank">' + setting$$7.name + "</a> = " + setting$$7.value + "<br/>"
      })
    }request$$2.done(html)
  }};
  var unsetCommandSpec = {name:"unset", params:[{name:"setting", type:"setting", description:"The name of the setting to return to defaults"}], description:"unset a setting entirely", exec:function(env$$4, args$$7, request$$3) {
    var setting$$8 = env$$4.settings.get(args$$7.setting);
    if(!setting$$8) {
      request$$3.doneWithError("No setting with the name <strong>" + args$$7.setting + "</strong>.");
      return
    }setting$$8.reset();
    request$$3.done("Reset " + setting$$8.name + " to default: " + env$$4.settings.get(args$$7.setting))
  }};
  var canon$$1 = require$$18("pilot/canon");
  exports$$17.startup = function() {
    canon$$1.addCommand(setCommandSpec);
    canon$$1.addCommand(unsetCommandSpec)
  };
  exports$$17.shutdown = function() {
    canon$$1.removeCommand(setCommandSpec);
    canon$$1.removeCommand(unsetCommandSpec)
  }
});
define("pilot/typecheck", ["require", "exports", "module"], function(require$$19, exports$$18) {
  var objectToString = Object.prototype.toString;
  exports$$18.isString = function(it) {
    return it && objectToString.call(it) === "[object String]"
  };
  exports$$18.isBoolean = function(it$$1) {
    return it$$1 && objectToString.call(it$$1) === "[object Boolean]"
  };
  exports$$18.isNumber = function(it$$2) {
    return it$$2 && objectToString.call(it$$2) === "[object Number]" && isFinite(it$$2)
  };
  exports$$18.isObject = function(it$$3) {
    return it$$3 !== undefined && (it$$3 === null || typeof it$$3 == "object" || Array.isArray(it$$3) || exports$$18.isFunction(it$$3))
  };
  exports$$18.isFunction = function(it$$4) {
    return it$$4 && objectToString.call(it$$4) === "[object Function]"
  }
});
define("pilot/commands/basic", ["require", "exports", "module", "pilot/typecheck", "pilot/canon", "pilot/canon"], function(require$$20, exports$$19) {
  var checks = require$$20("pilot/typecheck");
  var canon$$2 = require$$20("pilot/canon");
  var helpMessages = {plainPrefix:'<h2>Welcome to Skywriter - Code in the Cloud</h2><ul><li><a href="http://labs.mozilla.com/projects/skywriter" target="_blank">Home Page</a></li><li><a href="https://wiki.mozilla.org/Labs/Skywriter" target="_blank">Wiki</a></li><li><a href="https://wiki.mozilla.org/Labs/Skywriter/UserGuide" target="_blank">User Guide</a></li><li><a href="https://wiki.mozilla.org/Labs/Skywriter/Tips" target="_blank">Tips and Tricks</a></li><li><a href="https://wiki.mozilla.org/Labs/Skywriter/FAQ" target="_blank">FAQ</a></li><li><a href="https://wiki.mozilla.org/Labs/Skywriter/DeveloperGuide" target="_blank">Developers Guide</a></li></ul>', 
  plainSuffix:'For more information, see the <a href="https://wiki.mozilla.org/Labs/Skywriter">Skywriter Wiki</a>.'};
  var helpCommandSpec = {name:"help", params:[{name:"search", type:"text", description:"Search string to narrow the output.", defaultValue:null}], description:"Get help on the available commands.", exec:function(env$$5, args$$8, request$$4) {
    var output = [];
    var command$$5 = canon$$2.getCommand(args$$8.search);
    if(command$$5 && command$$5.exec) {
      output.push(command$$5.description ? command$$5.description : "No description for " + args$$8.search)
    }else {
      var showHidden = false;
      !args$$8.search && helpMessages.plainPrefix && output.push(helpMessages.plainPrefix);
      if(command$$5) {
        output.push("<h2>Sub-Commands of " + command$$5.name + "</h2>");
        output.push("<p>" + command$$5.description + "</p>")
      }else {
        if(args$$8.search) {
          if(args$$8.search == "hidden") {
            args$$8.search = "";
            showHidden = true
          }output.push("<h2>Commands starting with '" + args$$8.search + "':</h2>")
        }else {
          output.push("<h2>Available Commands:</h2>")
        }
      }var commandNames$$1 = canon$$2.getCommandNames();
      commandNames$$1.sort();
      output.push("<table>");
      var i$$12 = 0;
      for(;i$$12 < commandNames$$1.length;i$$12++) {
        command$$5 = canon$$2.getCommand(commandNames$$1[i$$12]);
        if(!showHidden && command$$5.hidden) {
          continue
        }if(command$$5.description === undefined) {
          continue
        }if(args$$8.search && command$$5.name.indexOf(args$$8.search) !== 0) {
          continue
        }if(!args$$8.search && command$$5.name.indexOf(" ") != -1) {
          continue
        }if(command$$5 && command$$5.name == args$$8.search) {
          continue
        }output.push("<tr>");
        output.push('<th class="right">' + command$$5.name + "</th>");
        output.push("<td>" + command$$5.description + "</td>");
        output.push("</tr>")
      }output.push("</table>");
      !args$$8.search && helpMessages.plainSuffix && output.push(helpMessages.plainSuffix)
    }request$$4.done(output.join(""))
  }};
  var evalCommandSpec = {name:"eval", params:[{name:"javascript", type:"text", description:"The JavaScript to evaluate"}], description:"evals given js code and show the result", hidden:true, exec:function(env$$6, args$$9, request$$5) {
    var result;
    var javascript = args$$9.javascript;
    try {
      result = eval(javascript)
    }catch(e$$7) {
      result = "<b>Error: " + e$$7.message + "</b>"
    }var msg$$2 = "";
    var type$$3 = "";
    var x;
    if(checks.isFunction(result)) {
      msg$$2 = (result + "").replace(/\n/g, "<br>").replace(/ /g, "&#160");
      type$$3 = "function"
    }else {
      if(checks.isObject(result)) {
        type$$3 = Array.isArray(result) ? "array" : "object";
        var items = [];
        var value$$22;
        for(x in result) {
          if(result.hasOwnProperty(x)) {
            value$$22 = checks.isFunction(result[x]) ? "[function]" : checks.isObject(result[x]) ? "[object]" : result[x];
            items.push({name:x, value:value$$22})
          }
        }items.sort(function(a, b) {
          return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
        });
        x = 0;
        for(;x < items.length;x++) {
          msg$$2 += "<b>" + items[x].name + "</b>: " + items[x].value + "<br>"
        }
      }else {
        msg$$2 = result;
        type$$3 = typeof result
      }
    }request$$5.done("Result for eval <b>'" + javascript + "'</b> (type: " + type$$3 + "): <br><br>" + msg$$2)
  }};
  var skywriterCommandSpec = {name:"skywriter", hidden:true, exec:function(env$$8, args$$11, request$$7) {
    var index$$5 = Math.floor(Math.random() * messages.length);
    request$$7.done("Skywriter " + messages[index$$5])
  }};
  var messages = ["really wants you to trick it out in some way.", "is your Web editor.", "would love to be like Emacs on the Web.", "is written on the Web platform, so you can tweak it."];
  canon$$2 = require$$20("pilot/canon");
  exports$$19.startup = function() {
    canon$$2.addCommand(helpCommandSpec);
    canon$$2.addCommand(evalCommandSpec);
    canon$$2.addCommand(skywriterCommandSpec)
  };
  exports$$19.shutdown = function() {
    canon$$2.removeCommand(helpCommandSpec);
    canon$$2.removeCommand(evalCommandSpec);
    canon$$2.removeCommand(skywriterCommandSpec)
  }
});
define("pilot/settings/canon", ["require", "exports", "module"], function(require$$21, exports$$20) {
  var historyLengthSetting = {name:"historyLength", description:"How many typed commands do we recall for reference?", type:"number", defaultValue:50};
  exports$$20.startup = function(data$$27) {
    data$$27.env.settings.addSetting(historyLengthSetting)
  };
  exports$$20.shutdown = function(data$$28) {
    data$$28.env.settings.removeSetting(historyLengthSetting)
  }
});
define("pilot/index", ["require", "exports", "module", "pilot/fixoldbrowsers", "pilot/types/basic", "pilot/types/command", "pilot/types/settings", "pilot/commands/settings", "pilot/commands/basic", "pilot/settings/canon", "pilot/canon"], function(require$$22, exports$$21) {
  var deps = [require$$22("pilot/fixoldbrowsers"), require$$22("pilot/types/basic"), require$$22("pilot/types/command"), require$$22("pilot/types/settings"), require$$22("pilot/commands/settings"), require$$22("pilot/commands/basic"), require$$22("pilot/settings/canon"), require$$22("pilot/canon")];
  exports$$21.startup = function(data$$29, reason$$18) {
    deps.forEach(function(module$$22) {
      typeof module$$22.startup === "function" && module$$22.startup(data$$29, reason$$18)
    })
  }
});
define("cockpit/cli", ["require", "exports", "module", "pilot/console", "pilot/lang", "pilot/oop", "pilot/event_emitter", "pilot/types", "pilot/types", "pilot/types", "pilot/canon"], function(require$$23, exports$$22) {
  function Hint(status$$2, message$$1, start, end, predictions$$1) {
    this.status = status$$2;
    this.message = message$$1;
    if(typeof start === "number") {
      this.start = start;
      this.end = end;
      this.predictions = predictions$$1
    }else {
      var arg = start;
      this.start = arg.start;
      this.end = arg.end;
      this.predictions = arg.predictions
    }
  }
  function ConversionHint(conversion, arg$$1) {
    this.status = conversion.status;
    this.message = conversion.message;
    if(arg$$1) {
      this.start = arg$$1.start;
      this.end = arg$$1.end
    }else {
      this.start = 0;
      this.end = 0
    }this.predictions = conversion.predictions
  }
  function Argument(emitter, text$$1, start$$1, end$$1, priorSpace) {
    this.emitter = emitter;
    this.setText(text$$1);
    this.start = start$$1;
    this.end = end$$1;
    this.priorSpace = priorSpace
  }
  function Assignment(param$$2, requisition) {
    this.param = param$$2;
    this.requisition = requisition;
    this.setValue(param$$2.defaultValue)
  }
  function Requisition(env$$9) {
    this.env = env$$9;
    this.commandAssignment = new Assignment(commandParam, this)
  }
  function CliRequisition(env$$10, options$$1) {
    Requisition.call(this, env$$10);
    if(options$$1 && options$$1.flags) {
      this.flags = options$$1.flags
    }
  }
  require$$23("pilot/console");
  var lang$$1 = require$$23("pilot/lang");
  var oop$$2 = require$$23("pilot/oop");
  var EventEmitter$$3 = require$$23("pilot/event_emitter").EventEmitter;
  require$$23("pilot/types");
  var Status$$3 = require$$23("pilot/types").Status;
  require$$23("pilot/types").Conversion;
  var canon$$3 = require$$23("pilot/canon");
  exports$$22.startup = function() {
    canon$$3.upgradeType("command", commandParam)
  };
  Hint.prototype = {};
  Hint.sort = function(hints, cursor) {
    cursor !== undefined && hints.forEach(function(hint) {
      hint.distance = hint.start === Argument.AT_CURSOR ? 0 : cursor < hint.start ? hint.start - cursor : cursor > hint.end ? cursor - hint.end : 0
    }, this);
    hints.sort(function(hint1, hint2) {
      if(cursor !== undefined) {
        var diff = hint1.distance - hint2.distance;
        if(diff != 0) {
          return diff
        }
      }return hint2.status - hint1.status
    });
    cursor !== undefined && hints.forEach(function(hint$$1) {
      delete hint$$1.distance
    }, this);
    return hints
  };
  exports$$22.Hint = Hint;
  oop$$2.inherits(ConversionHint, Hint);
  Argument.prototype = {merge:function(following) {
    if(following.emitter != this.emitter) {
      throw new Error("Can't merge Arguments from different EventEmitters");
    }return new Argument(this.emitter, this.text + following.priorSpace + following.text, this.start, following.end, this.priorSpace)
  }, setText:function(text$$2) {
    if(text$$2 == null) {
      throw new Error("Illegal text for Argument: " + text$$2);
    }var ev = {argument:this, oldText:this.text, text:text$$2};
    this.text = text$$2;
    this.emitter._dispatchEvent("argumentChange", ev)
  }, toString:function() {
    return this.priorSpace + this.text
  }};
  Argument.merge = function(argArray, start$$2, end$$2) {
    start$$2 = start$$2 === undefined ? 0 : start$$2;
    end$$2 = end$$2 === undefined ? argArray.length : end$$2;
    var joined;
    var i$$13 = start$$2;
    for(;i$$13 < end$$2;i$$13++) {
      var arg$$2 = argArray[i$$13];
      if(joined) {
        joined = joined.merge(arg$$2)
      }else {
        joined = arg$$2
      }
    }return joined
  };
  Argument.AT_CURSOR = -1;
  Assignment.prototype = {param:undefined, conversion:undefined, value:undefined, arg:undefined, value:undefined, setValue:function(value$$23) {
    if(this.value === value$$23) {
      return
    }if(value$$23 === undefined) {
      value$$23 = this.param.defaultValue;
      this.arg = undefined
    }this.value = value$$23;
    var text$$3 = value$$23 == null ? "" : this.param.type.stringify(value$$23);
    this.arg && this.arg.setText(text$$3);
    this.conversion = undefined;
    this.requisition._assignmentChanged(this)
  }, arg:undefined, setArgument:function(arg$$3) {
    if(this.arg === arg$$3) {
      return
    }this.arg = arg$$3;
    this.conversion = this.param.type.parse(arg$$3.text);
    this.conversion.arg = arg$$3;
    this.value = this.conversion.value;
    this.requisition._assignmentChanged(this)
  }, getHint:function() {
    if(this.param.getCustomHint && this.value && this.arg) {
      var hint$$2 = this.param.getCustomHint(this.value, this.arg);
      if(hint$$2) {
        return hint$$2
      }
    }var message$$2 = "<strong>" + this.param.name + "</strong>: ";
    if(this.param.description) {
      message$$2 += this.param.description.trim();
      if(message$$2.charAt(message$$2.length - 1) !== ".") {
        message$$2 += "."
      }if(message$$2.charAt(message$$2.length - 1) !== " ") {
        message$$2 += " "
      }
    }var status$$3 = Status$$3.VALID;
    var start$$3 = this.arg ? this.arg.start : Argument.AT_CURSOR;
    var end$$3 = this.arg ? this.arg.end : Argument.AT_CURSOR;
    var predictions$$2;
    if(this.conversion) {
      status$$3 = this.conversion.status;
      if(this.conversion.message) {
        message$$2 += this.conversion.message
      }predictions$$2 = this.conversion.predictions
    }var argProvided = this.arg && this.arg.text !== "";
    var dataProvided = this.value !== undefined || argProvided;
    if(this.param.defaultValue === undefined && !dataProvided) {
      status$$3 = Status$$3.INVALID;
      message$$2 += "<strong>Required<strong>"
    }return new Hint(status$$3, message$$2, start$$3, end$$3, predictions$$2)
  }, complete:function() {
    this.conversion && this.conversion.predictions && this.conversion.predictions.length > 0 && this.setValue(this.conversion.predictions[0])
  }, decrement:function() {
    var replacement = this.param.type.decrement(this.value);
    replacement != null && this.setValue(replacement)
  }, increment:function() {
    var replacement$$1 = this.param.type.increment(this.value);
    replacement$$1 != null && this.setValue(replacement$$1)
  }, toString:function() {
    return this.arg ? this.arg.toString() : ""
  }};
  exports$$22.Assignment = Assignment;
  var commandParam = {name:"command", type:"command", description:"The command to execute", getCustomHint:function(command$$6, arg$$4) {
    var docs = [];
    docs.push("<strong><tt> &gt; ");
    docs.push(command$$6.name);
    command$$6.params && command$$6.params.length > 0 && command$$6.params.forEach(function(param$$3) {
      param$$3.defaultValue === undefined ? docs.push(" [" + param$$3.name + "]") : docs.push(" <em>[" + param$$3.name + "]</em>")
    }, this);
    docs.push("</tt></strong><br/>");
    docs.push(command$$6.description ? command$$6.description : "(No description)");
    docs.push("<br/>");
    if(command$$6.params && command$$6.params.length > 0) {
      docs.push("<ul>");
      command$$6.params.forEach(function(param$$4) {
        docs.push("<li>");
        docs.push("<strong><tt>" + param$$4.name + "</tt></strong>: ");
        docs.push(param$$4.description ? param$$4.description : "(No description)");
        if(param$$4.defaultValue === undefined) {
          docs.push(" <em>[Required]</em>")
        }else {
          param$$4.defaultValue === null ? docs.push(" <em>[Optional]</em>") : docs.push(" <em>[Default: " + param$$4.defaultValue + "]</em>")
        }docs.push("</li>")
      }, this);
      docs.push("</ul>")
    }return new Hint(Status$$3.VALID, docs.join(""), arg$$4)
  }};
  Requisition.prototype = {commandAssignment:undefined, assignmentCount:undefined, _assignments:undefined, _hints:undefined, _assignmentChanged:function(assignment) {
    if(assignment.param.name !== "command") {
      return
    }this._assignments = {};
    assignment.value && assignment.value.params.forEach(function(param$$5) {
      this._assignments[param$$5.name] = new Assignment(param$$5, this)
    }, this);
    this.assignmentCount = Object.keys(this._assignments).length;
    this._dispatchEvent("commandChange", {command:assignment.value})
  }, getAssignment:function(nameOrNumber) {
    var name$$14 = typeof nameOrNumber === "string" ? nameOrNumber : Object.keys(this._assignments)[nameOrNumber];
    return this._assignments[name$$14]
  }, getParameterNames:function() {
    return Object.keys(this._assignments)
  }, cloneAssignments:function() {
    return Object.keys(this._assignments).map(function(name$$15) {
      return this._assignments[name$$15]
    }, this)
  }, _updateHints:function() {
    this._hints.push(this.commandAssignment.getHint());
    Object.keys(this._assignments).map(function(name$$16) {
      var assignment$$1 = this._assignments[name$$16];
      assignment$$1.arg && this._hints.push(assignment$$1.getHint())
    }, this);
    Hint.sort(this._hints)
  }, getWorstHint:function() {
    return this._hints[0]
  }, getArgs:function() {
    var args$$12 = {};
    Object.keys(this._assignments).forEach(function(name$$17) {
      args$$12[name$$17] = this.getAssignment(name$$17).value
    }, this);
    return args$$12
  }, setDefaultValues:function() {
    Object.keys(this._assignments).forEach(function(name$$18) {
      this._assignments[name$$18].setValue(undefined)
    }, this)
  }, exec:function() {
    var command$$7 = this.commandAssignment.value;
    canon$$3.exec(command$$7, this.env, this.getArgs(), this.toCanonicalString())
  }, toCanonicalString:function() {
    var line$$1 = [];
    line$$1.push(this.commandAssignment.value.name);
    Object.keys(this._assignments).forEach(function(name$$19) {
      var assignment$$2 = this._assignments[name$$19];
      var type$$4 = assignment$$2.param.type;
      if(assignment$$2.value !== assignment$$2.param.defaultValue) {
        line$$1.push(" ");
        line$$1.push(type$$4.stringify(assignment$$2.value))
      }
    }, this);
    return line$$1.join("")
  }};
  oop$$2.implement(Requisition.prototype, EventEmitter$$3);
  exports$$22.Requisition = Requisition;
  oop$$2.inherits(CliRequisition, Requisition);
  (function() {
    CliRequisition.prototype.update = function(input) {
      this.input = input;
      this._hints = [];
      var args$$13 = this._tokenize(input.typed);
      this._split(args$$13);
      this.commandAssignment.value && this._assign(args$$13);
      this._updateHints()
    };
    CliRequisition.prototype.getInputStatusMarkup = function() {
      var scores = this.toString().split("").map(function() {
        return Status$$3.VALID
      });
      this._hints.forEach(function(hint$$3) {
        var i$$14 = hint$$3.start;
        for(;i$$14 <= hint$$3.end;i$$14++) {
          if(hint$$3.status > scores[i$$14]) {
            scores[i$$14] = hint$$3.status
          }
        }
      }, this);
      return scores
    };
    CliRequisition.prototype.toString = function() {
      var parts = Object.keys(this._assignments).map(function(name$$20) {
        return this._assignments[name$$20].toString()
      }, this);
      parts.unshift(this.commandAssignment.toString());
      return parts.join("")
    };
    var superUpdateHints = CliRequisition.prototype._updateHints;
    CliRequisition.prototype._updateHints = function() {
      superUpdateHints.call(this);
      var c = this.input.cursor;
      this._hints.forEach(function(hint$$4) {
        var startInHint = c.start >= hint$$4.start && c.start <= hint$$4.end;
        var endInHint = c.end >= hint$$4.start && c.end <= hint$$4.end;
        var inHint = startInHint || endInHint;
        if(!inHint && hint$$4.status === Status$$3.INCOMPLETE) {
          hint$$4.status = Status$$3.INVALID
        }
      }, this);
      Hint.sort(this._hints)
    };
    CliRequisition.prototype.getHints = function() {
      return this._hints
    };
    CliRequisition.prototype.getAssignmentAt = function(position) {
      var arg$$5 = this.commandAssignment.arg;
      if(arg$$5 && position <= arg$$5.end) {
        return this.commandAssignment
      }var names$$1 = Object.keys(this._assignments);
      var i$$15 = 0;
      for(;i$$15 < names$$1.length;i$$15++) {
        var assignment$$3 = this._assignments[names$$1[i$$15]];
        if(assignment$$3.arg && position <= assignment$$3.arg.end) {
          return assignment$$3
        }
      }throw new Error("position (" + position + ") is off end of requisition (" + this.toString() + ")");
    };
    CliRequisition.prototype._tokenize = function(typed$$1) {
      function unescape(str$$8) {
        return str$$8.replace(/\uF000/g, " ").replace(/\uF001/g, "'").replace(/\uF002/g, '"')
      }
      if(typed$$1 == null || typed$$1.length === 0) {
        return[new Argument(this, "", 0, 0, "")]
      }var OUTSIDE = 1;
      var IN_SIMPLE = 2;
      var IN_SINGLE_Q = 3;
      var IN_DOUBLE_Q = 4;
      var mode$$1 = OUTSIDE;
      typed$$1 = typed$$1.replace(/\\\\/g, "\\").replace(/\\b/g, "\u0008").replace(/\\f/g, "\u000c").replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\t/g, "\t").replace(/\\v/g, "\u000b").replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\ /g, "\uf000").replace(/\\'/g, "\uf001").replace(/\\"/g, "\uf002");
      var i$$16 = 0;
      var start$$4 = 0;
      var priorSpace$$1 = "";
      var args$$14 = [];
      for(;;) {
        if(i$$16 >= typed$$1.length) {
          if(mode$$1 !== OUTSIDE) {
            var str$$7 = unescape(typed$$1.substring(start$$4, i$$16));
            args$$14.push(new Argument(this, str$$7, start$$4, i$$16, priorSpace$$1))
          }else {
            if(i$$16 !== start$$4) {
              priorSpace$$1 = typed$$1.substring(start$$4, i$$16);
              args$$14.push(new Argument(this, "", i$$16, i$$16, priorSpace$$1))
            }
          }break
        }var c$$1 = typed$$1[i$$16];
        switch(mode$$1) {
          case OUTSIDE:
            if(c$$1 === "'") {
              priorSpace$$1 = typed$$1.substring(start$$4, i$$16);
              mode$$1 = IN_SINGLE_Q;
              start$$4 = i$$16 + 1
            }else {
              if(c$$1 === '"') {
                priorSpace$$1 = typed$$1.substring(start$$4, i$$16);
                mode$$1 = IN_DOUBLE_Q;
                start$$4 = i$$16 + 1
              }else {
                if(!/ /.test(c$$1)) {
                  priorSpace$$1 = typed$$1.substring(start$$4, i$$16);
                  mode$$1 = IN_SIMPLE;
                  start$$4 = i$$16
                }
              }
            }break;
          case IN_SIMPLE:
            if(c$$1 === " ") {
              str$$7 = unescape(typed$$1.substring(start$$4, i$$16));
              args$$14.push(new Argument(this, str$$7, start$$4, i$$16, priorSpace$$1));
              mode$$1 = OUTSIDE;
              start$$4 = i$$16;
              priorSpace$$1 = ""
            }break;
          case IN_SINGLE_Q:
            if(c$$1 === "'") {
              str$$7 = unescape(typed$$1.substring(start$$4, i$$16));
              args$$14.push(new Argument(this, str$$7, start$$4, i$$16, priorSpace$$1));
              mode$$1 = OUTSIDE;
              start$$4 = i$$16 + 1;
              priorSpace$$1 = ""
            }break;
          case IN_DOUBLE_Q:
            if(c$$1 === '"') {
              str$$7 = unescape(typed$$1.substring(start$$4, i$$16));
              args$$14.push(new Argument(this, str$$7, start$$4, i$$16, priorSpace$$1));
              mode$$1 = OUTSIDE;
              start$$4 = i$$16 + 1;
              priorSpace$$1 = ""
            }break
        }
        i$$16++
      }return args$$14
    };
    CliRequisition.prototype._split = function(args$$15) {
      var argsUsed = 1;
      var arg$$6;
      for(;argsUsed <= args$$15.length;) {
        arg$$6 = Argument.merge(args$$15, 0, argsUsed);
        this.commandAssignment.setArgument(arg$$6);
        if(!this.commandAssignment.value) {
          break
        }if(this.commandAssignment.value.exec) {
          var i$$17 = 0;
          for(;i$$17 < argsUsed;i$$17++) {
            args$$15.shift()
          }break
        }argsUsed++
      }return
    };
    CliRequisition.prototype._assign = function(args$$16) {
      if(args$$16.length === 0) {
        this.setDefaultValues();
        return
      }if(this.assignmentCount === 0) {
        this._hints.push(new Hint(Status$$3.INVALID, this.commandAssignment.value.name + " does not take any parameters", Argument.merge(args$$16)));
        return
      }if(this.assignmentCount === 1) {
        var assignment$$4 = this.getAssignment(0);
        if(assignment$$4.param.type.name === "text") {
          assignment$$4.setArgument(Argument.merge(args$$16));
          return
        }
      }var assignments = this.cloneAssignments();
      var names$$2 = this.getParameterNames();
      assignments.forEach(function(assignment$$5) {
        var namedArgText = "--" + assignment$$5.name;
        var i$$18 = 0;
        for(;;) {
          var arg$$7 = args$$16[i$$18];
          if(namedArgText !== arg$$7.text) {
            i$$18++;
            if(i$$18 >= args$$16.length) {
              break
            }continue
          }if(assignment$$5.param.type.name === "boolean") {
            assignment$$5.setValue(true)
          }else {
            if(i$$18 + 1 < args$$16.length) {
              this._hints.push(new Hint(Status$$3.INCOMPLETE, "Missing value for: " + namedArgText, args$$16[i$$18]))
            }else {
              args$$16.splice(i$$18 + 1, 1);
              assignment$$5.setArgument(args$$16[i$$18 + 1])
            }
          }lang$$1.arrayRemove(names$$2, assignment$$5.name);
          args$$16.splice(i$$18, 1)
        }
      }, this);
      names$$2.forEach(function(name$$21) {
        var assignment$$6 = this.getAssignment(name$$21);
        if(args$$16.length === 0) {
          assignment$$6.setValue(undefined)
        }else {
          var arg$$8 = args$$16[0];
          args$$16.splice(0, 1);
          assignment$$6.setArgument(arg$$8)
        }
      }, this);
      if(args$$16.length > 0) {
        var remaining = Argument.merge(args$$16);
        this._hints.push(new Hint(Status$$3.INVALID, "Input '" + remaining.text + "' makes no sense.", remaining))
      }
    }
  })();
  exports$$22.CliRequisition = CliRequisition
});
define("cockpit/test/assert", ["require", "exports", "module"], function(require$$24, exports$$23) {
  var test = {success:function(message$$3) {
    console.log(message$$3)
  }, fail:function() {
    test._recordThrow("fail", arguments)
  }, assertTrue:function(value$$24) {
    value$$24 || test._recordThrow("assertTrue", arguments)
  }, verifyTrue:function(value$$25) {
    value$$25 || test._recordTrace("verifyTrue", arguments)
  }, assertFalse:function(value$$26) {
    value$$26 && test._recordThrow("assertFalse", arguments)
  }, verifyFalse:function(value$$27) {
    value$$27 && test._recordTrace("verifyFalse", arguments)
  }, assertNull:function(value$$28) {
    value$$28 !== null && test._recordThrow("assertNull", arguments)
  }, verifyNull:function(value$$29) {
    value$$29 !== null && test._recordTrace("verifyNull", arguments)
  }, assertNotNull:function(value$$30) {
    value$$30 === null && test._recordThrow("assertNotNull", arguments)
  }, verifyNotNull:function(value$$31) {
    value$$31 === null && test._recordTrace("verifyNotNull", arguments)
  }, assertUndefined:function(value$$32) {
    value$$32 !== undefined && test._recordThrow("assertUndefined", arguments)
  }, verifyUndefined:function(value$$33) {
    value$$33 !== undefined && test._recordTrace("verifyUndefined", arguments)
  }, assertNotUndefined:function(value$$34) {
    value$$34 === undefined && test._recordThrow("assertNotUndefined", arguments)
  }, verifyNotUndefined:function(value$$35) {
    value$$35 === undefined && test._recordTrace("verifyNotUndefined", arguments)
  }, assertNaN:function(value$$36) {
    isNaN(value$$36) || test._recordThrow("assertNaN", arguments)
  }, verifyNaN:function(value$$37) {
    isNaN(value$$37) || test._recordTrace("verifyNaN", arguments)
  }, assertNotNaN:function(value$$38) {
    isNaN(value$$38) && test._recordThrow("assertNotNaN", arguments)
  }, verifyNotNaN:function(value$$39) {
    isNaN(value$$39) && test._recordTrace("verifyNotNaN", arguments)
  }, assertEqual:function(expected, actual) {
    test._isEqual(expected, actual) || test._recordThrow("assertEqual", arguments)
  }, verifyEqual:function(expected$$1, actual$$1) {
    test._isEqual(expected$$1, actual$$1) || test._recordTrace("verifyEqual", arguments)
  }, assertNotEqual:function(expected$$2, actual$$2) {
    test._isEqual(expected$$2, actual$$2) && test._recordThrow("assertNotEqual", arguments)
  }, verifyNotEqual:function(expected$$3, actual$$3) {
    test._isEqual(expected$$3, actual$$3) && test._recordTrace("verifyNotEqual", arguments)
  }, assertSame:function(expected$$4, actual$$4) {
    expected$$4 !== actual$$4 && test._recordThrow("assertSame", arguments)
  }, verifySame:function(expected$$5, actual$$5) {
    expected$$5 !== actual$$5 && test._recordTrace("verifySame", arguments)
  }, assertNotSame:function(expected$$6, actual$$6) {
    expected$$6 !== actual$$6 && test._recordThrow("assertNotSame", arguments)
  }, verifyNotSame:function(expected$$7, actual$$7) {
    expected$$7 !== actual$$7 && test._recordTrace("verifyNotSame", arguments)
  }, _recordTrace:function() {
    test._record.apply(this, arguments);
    console.trace()
  }, _recordThrow:function() {
    test._record.apply(this, arguments);
    throw new Error;
  }, _record:function() {
    console.error(arguments);
    var message$$5 = arguments[0] + "(";
    var data$$31 = arguments[1];
    if(typeof data$$31 == "string") {
      message$$5 += data$$31
    }else {
      var i$$19 = 0;
      for(;i$$19 < data$$31.length;i$$19++) {
        if(i$$19 != 0) {
          message$$5 += ", "
        }message$$5 += data$$31[i$$19]
      }
    }message$$5 += ")";
    console.log(message$$5)
  }, _isEqual:function(expected$$8, actual$$8, depth) {
    depth || (depth = 0);
    if(depth > 10) {
      return true
    }if(expected$$8 == null) {
      if(actual$$8 != null) {
        console.log("expected: null, actual non-null: ", actual$$8);
        return false
      }return true
    }if(typeof expected$$8 == "number" && isNaN(expected$$8)) {
      if(!(typeof actual$$8 == "number" && isNaN(actual$$8))) {
        console.log("expected: NaN, actual non-NaN: ", actual$$8);
        return false
      }return true
    }if(actual$$8 == null) {
      if(expected$$8 != null) {
        console.log("actual: null, expected non-null: ", expected$$8);
        return false
      }return true
    }if(typeof expected$$8 == "object") {
      if(typeof actual$$8 != "object") {
        console.log("expected object, actual not an object");
        return false
      }var actualLength = 0;
      for(var prop in actual$$8) {
        if(typeof actual$$8[prop] != "function" || typeof expected$$8[prop] != "function") {
          var nest = test._isEqual(actual$$8[prop], expected$$8[prop], depth + 1);
          if(typeof nest != "boolean" || !nest) {
            console.log("element '" + prop + "' does not match: " + nest);
            return false
          }
        }actualLength++
      }var expectedLength = 0;
      for(prop in expected$$8) {
        expectedLength++
      }if(actualLength != expectedLength) {
        console.log("expected object size = " + expectedLength + ", actual object size = " + actualLength);
        return false
      }return true
    }if(actual$$8 != expected$$8) {
      console.log("expected = " + expected$$8 + " (type=" + typeof expected$$8 + "), actual = " + actual$$8 + " (type=" + typeof actual$$8 + ")");
      return false
    }if(expected$$8 instanceof Array) {
      if(!(actual$$8 instanceof Array)) {
        console.log("expected array, actual not an array");
        return false
      }if(actual$$8.length != expected$$8.length) {
        console.log("expected array length = " + expected$$8.length + ", actual array length = " + actual$$8.length);
        return false
      }var i$$20 = 0;
      for(;i$$20 < actual$$8.length;i$$20++) {
        var inner = test._isEqual(actual$$8[i$$20], expected$$8[i$$20], depth + 1);
        if(typeof inner != "boolean" || !inner) {
          console.log("element " + i$$20 + " does not match: " + inner);
          return false
        }
      }return true
    }return true
  }};
  exports$$23.test = test
});
define("cockpit/test/testCli", ["require", "exports", "module", "cockpit/test/assert", "pilot/types", "pilot/settings", "cockpit/cli", "cockpit/cli", "cockpit/cli"], function(require$$25, exports$$24) {
  var test$$1 = require$$25("cockpit/test/assert").test;
  var Status$$4 = require$$25("pilot/types").Status;
  var settings$$5 = require$$25("pilot/settings").settings;
  require$$25("cockpit/cli")._tokenize;
  require$$25("cockpit/cli")._split;
  var CliRequisition$$1 = require$$25("cockpit/cli").CliRequisition;
  exports$$24.testAll = function() {
    exports$$24.testTokenize();
    exports$$24.testSplit();
    exports$$24.testCli();
    return"testAll Completed"
  };
  exports$$24.testTokenize = function() {
    var args$$17;
    var cli = new CliRequisition$$1;
    args$$17 = cli._tokenize("");
    test$$1.verifyEqual(1, args$$17.length);
    test$$1.verifyEqual("", args$$17[0].text);
    test$$1.verifyEqual(0, args$$17[0].start);
    test$$1.verifyEqual(0, args$$17[0].end);
    test$$1.verifyEqual("", args$$17[0].priorSpace);
    args$$17 = cli._tokenize("s");
    test$$1.verifyEqual(1, args$$17.length);
    test$$1.verifyEqual("s", args$$17[0].text);
    test$$1.verifyEqual(0, args$$17[0].start);
    test$$1.verifyEqual(1, args$$17[0].end);
    test$$1.verifyEqual("", args$$17[0].priorSpace);
    args$$17 = cli._tokenize(" ");
    test$$1.verifyEqual(1, args$$17.length);
    test$$1.verifyEqual("", args$$17[0].text);
    test$$1.verifyEqual(1, args$$17[0].start);
    test$$1.verifyEqual(1, args$$17[0].end);
    test$$1.verifyEqual(" ", args$$17[0].priorSpace);
    args$$17 = cli._tokenize("s s");
    test$$1.verifyEqual(2, args$$17.length);
    test$$1.verifyEqual("s", args$$17[0].text);
    test$$1.verifyEqual(0, args$$17[0].start);
    test$$1.verifyEqual(1, args$$17[0].end);
    test$$1.verifyEqual("", args$$17[0].priorSpace);
    test$$1.verifyEqual("s", args$$17[1].text);
    test$$1.verifyEqual(2, args$$17[1].start);
    test$$1.verifyEqual(3, args$$17[1].end);
    test$$1.verifyEqual(" ", args$$17[1].priorSpace);
    args$$17 = cli._tokenize(" 1234  '12 34'");
    test$$1.verifyEqual(2, args$$17.length);
    test$$1.verifyEqual("1234", args$$17[0].text);
    test$$1.verifyEqual(1, args$$17[0].start);
    test$$1.verifyEqual(5, args$$17[0].end);
    test$$1.verifyEqual(" ", args$$17[0].priorSpace);
    test$$1.verifyEqual("12 34", args$$17[1].text);
    test$$1.verifyEqual(8, args$$17[1].start);
    test$$1.verifyEqual(13, args$$17[1].end);
    test$$1.verifyEqual("  ", args$$17[1].priorSpace);
    args$$17 = cli._tokenize('12\'34 "12 34" \\');
    test$$1.verifyEqual(3, args$$17.length);
    test$$1.verifyEqual("12'34", args$$17[0].text);
    test$$1.verifyEqual(0, args$$17[0].start);
    test$$1.verifyEqual(5, args$$17[0].end);
    test$$1.verifyEqual("", args$$17[0].priorSpace);
    test$$1.verifyEqual("12 34", args$$17[1].text);
    test$$1.verifyEqual(7, args$$17[1].start);
    test$$1.verifyEqual(12, args$$17[1].end);
    test$$1.verifyEqual(" ", args$$17[1].priorSpace);
    test$$1.verifyEqual("\\", args$$17[2].text);
    test$$1.verifyEqual(14, args$$17[2].start);
    test$$1.verifyEqual(15, args$$17[2].end);
    test$$1.verifyEqual(" ", args$$17[2].priorSpace);
    args$$17 = cli._tokenize("a\\ b \\t\\n\\r \\'x\\\" 'd");
    test$$1.verifyEqual(4, args$$17.length);
    test$$1.verifyEqual("a b", args$$17[0].text);
    test$$1.verifyEqual(0, args$$17[0].start);
    test$$1.verifyEqual(3, args$$17[0].end);
    test$$1.verifyEqual("", args$$17[0].priorSpace);
    test$$1.verifyEqual("\t\n\r", args$$17[1].text);
    test$$1.verifyEqual(4, args$$17[1].start);
    test$$1.verifyEqual(7, args$$17[1].end);
    test$$1.verifyEqual(" ", args$$17[1].priorSpace);
    test$$1.verifyEqual("'x\"", args$$17[2].text);
    test$$1.verifyEqual(8, args$$17[2].start);
    test$$1.verifyEqual(11, args$$17[2].end);
    test$$1.verifyEqual(" ", args$$17[2].priorSpace);
    test$$1.verifyEqual("d", args$$17[3].text);
    test$$1.verifyEqual(13, args$$17[3].start);
    test$$1.verifyEqual(14, args$$17[3].end);
    test$$1.verifyEqual(" ", args$$17[3].priorSpace);
    return"testTokenize Completed"
  };
  exports$$24.testSplit = function() {
    var args$$18;
    var cli$$1 = new CliRequisition$$1;
    args$$18 = cli$$1._tokenize("s");
    cli$$1._split(args$$18);
    test$$1.verifyEqual(1, args$$18.length);
    test$$1.verifyEqual("s", args$$18[0].text);
    test$$1.verifyNull(cli$$1.commandAssignment.value);
    args$$18 = cli$$1._tokenize("set");
    cli$$1._split(args$$18);
    test$$1.verifyEqual([], args$$18);
    test$$1.verifyEqual("set", cli$$1.commandAssignment.value.name);
    args$$18 = cli$$1._tokenize("set a b");
    cli$$1._split(args$$18);
    test$$1.verifyEqual("set", cli$$1.commandAssignment.value.name);
    test$$1.verifyEqual(2, args$$18.length);
    test$$1.verifyEqual("a", args$$18[0].text);
    test$$1.verifyEqual("b", args$$18[1].text);
    return"testSplit Completed"
  };
  exports$$24.testCli = function() {
    function update(input$$1) {
      cli$$2.update(input$$1);
      debug && console.log('####### TEST: typed="' + input$$1.typed + '" cur=' + input$$1.cursor.start + " cli=", cli$$2);
      worst = cli$$2.getWorstHint();
      display$$1 = cli$$2.getAssignmentAt(input$$1.cursor.start).getHint();
      statuses$$1 = cli$$2.getInputStatusMarkup().map(function(status$$4) {
        return status$$4.valueOf()
      }).join("");
      if(cli$$2.commandAssignment.value && cli$$2.commandAssignment.value.name === "set") {
        settingAssignment = cli$$2.getAssignment("setting");
        valueAssignment = cli$$2.getAssignment("value")
      }else {
        settingAssignment = undefined;
        valueAssignment = undefined
      }
    }
    function verifyPredictionsContains(name$$22, predictions$$3) {
      return predictions$$3.every(function(prediction) {
        return name$$22 === prediction || name$$22 === prediction.name
      }, this)
    }
    var settingAssignment;
    var valueAssignment;
    var cli$$2 = new CliRequisition$$1;
    var debug = true;
    var worst;
    var display$$1;
    var statuses$$1;
    var historyLengthSetting$$1 = settings$$5.getSetting("historyLength");
    update({typed:"", cursor:{start:0, end:0}});
    test$$1.verifyEqual("", statuses$$1);
    test$$1.verifyEqual(1, cli$$2._hints.length);
    test$$1.verifyEqual(Status$$4.INCOMPLETE, display$$1.status);
    test$$1.verifyEqual(0, display$$1.start);
    test$$1.verifyEqual(0, display$$1.end);
    test$$1.verifyEqual(display$$1, worst);
    test$$1.verifyNull(cli$$2.commandAssignment.value);
    update({typed:" ", cursor:{start:1, end:1}});
    test$$1.verifyEqual("0", statuses$$1);
    test$$1.verifyEqual(1, cli$$2._hints.length);
    test$$1.verifyEqual(Status$$4.INCOMPLETE, display$$1.status);
    test$$1.verifyEqual(1, display$$1.start);
    test$$1.verifyEqual(1, display$$1.end);
    test$$1.verifyEqual(display$$1, worst);
    test$$1.verifyNull(cli$$2.commandAssignment.value);
    update({typed:" ", cursor:{start:0, end:0}});
    test$$1.verifyEqual("0", statuses$$1);
    test$$1.verifyEqual(1, cli$$2._hints.length);
    test$$1.verifyEqual(Status$$4.INCOMPLETE, display$$1.status);
    test$$1.verifyEqual(1, display$$1.start);
    test$$1.verifyEqual(1, display$$1.end);
    test$$1.verifyEqual(display$$1, worst);
    test$$1.verifyNull(cli$$2.commandAssignment.value);
    update({typed:"s", cursor:{start:1, end:1}});
    test$$1.verifyEqual("1", statuses$$1);
    test$$1.verifyEqual(1, cli$$2._hints.length);
    test$$1.verifyEqual(Status$$4.INCOMPLETE, display$$1.status);
    test$$1.verifyEqual(0, display$$1.start);
    test$$1.verifyEqual(1, display$$1.end);
    test$$1.verifyEqual(display$$1, worst);
    test$$1.verifyTrue(display$$1.predictions.length > 0);
    test$$1.verifyTrue(display$$1.predictions.length < 20);
    verifyPredictionsContains("set", display$$1.predictions);
    test$$1.verifyNull(cli$$2.commandAssignment.value);
    update({typed:"set", cursor:{start:3, end:3}});
    test$$1.verifyEqual("000", statuses$$1);
    test$$1.verifyEqual(1, cli$$2._hints.length);
    test$$1.verifyEqual(Status$$4.VALID, display$$1.status);
    test$$1.verifyEqual(0, display$$1.start);
    test$$1.verifyEqual(3, display$$1.end);
    test$$1.verifyEqual("set", cli$$2.commandAssignment.value.name);
    update({typed:"set ", cursor:{start:4, end:4}});
    test$$1.verifyEqual("0000", statuses$$1);
    test$$1.verifyEqual(2, cli$$2._hints.length);
    test$$1.verifyEqual(Status$$4.VALID, display$$1.status);
    test$$1.verifyEqual(4, display$$1.start);
    test$$1.verifyEqual(4, display$$1.end);
    test$$1.verifyEqual(display$$1, worst);
    test$$1.verifyEqual("set", cli$$2.commandAssignment.value.name);
    update({typed:"set ", cursor:{start:2, end:2}});
    test$$1.verifyEqual("0000", statuses$$1);
    test$$1.verifyEqual(2, cli$$2._hints.length);
    test$$1.verifyEqual(Status$$4.VALID, display$$1.status);
    test$$1.verifyEqual(0, display$$1.start);
    test$$1.verifyEqual(3, display$$1.end);
    test$$1.verifyEqual("set", cli$$2.commandAssignment.value.name);
    update({typed:"set h", cursor:{start:5, end:5}});
    test$$1.verifyEqual("00001", statuses$$1);
    test$$1.verifyEqual(2, cli$$2._hints.length);
    test$$1.verifyEqual(Status$$4.INCOMPLETE, display$$1.status);
    test$$1.verifyEqual(4, display$$1.start);
    test$$1.verifyEqual(5, display$$1.end);
    test$$1.verifyTrue(display$$1.predictions.length > 0);
    verifyPredictionsContains("historyLength", display$$1.predictions);
    test$$1.verifyEqual("set", cli$$2.commandAssignment.value.name);
    test$$1.verifyEqual("h", settingAssignment.arg.text);
    test$$1.verifyEqual(undefined, settingAssignment.value);
    update({typed:"set historyLengt", cursor:{start:16, end:16}});
    test$$1.verifyEqual("0000111111111111", statuses$$1);
    test$$1.verifyEqual(2, cli$$2._hints.length);
    test$$1.verifyEqual(Status$$4.INCOMPLETE, display$$1.status);
    test$$1.verifyEqual(4, display$$1.start);
    test$$1.verifyEqual(16, display$$1.end);
    test$$1.verifyEqual(1, display$$1.predictions.length);
    verifyPredictionsContains("historyLength", display$$1.predictions);
    test$$1.verifyEqual("set", cli$$2.commandAssignment.value.name);
    test$$1.verifyEqual("historyLengt", settingAssignment.arg.text);
    test$$1.verifyEqual(undefined, settingAssignment.value);
    update({typed:"set historyLengt", cursor:{start:1, end:1}});
    test$$1.verifyEqual("0000222222222222", statuses$$1);
    test$$1.verifyEqual(2, cli$$2._hints.length);
    test$$1.verifyEqual(Status$$4.VALID, display$$1.status);
    test$$1.verifyEqual(0, display$$1.start);
    test$$1.verifyEqual(3, display$$1.end);
    test$$1.verifyEqual(Status$$4.INVALID, worst.status);
    test$$1.verifyEqual(4, worst.start);
    test$$1.verifyEqual(16, worst.end);
    test$$1.verifyEqual(1, worst.predictions.length);
    verifyPredictionsContains("historyLength", worst.predictions);
    test$$1.verifyEqual("set", cli$$2.commandAssignment.value.name);
    test$$1.verifyEqual("historyLengt", settingAssignment.arg.text);
    test$$1.verifyEqual(undefined, settingAssignment.value);
    update({typed:"set historyLengt ", cursor:{start:17, end:17}});
    test$$1.verifyEqual("00002222222222222", statuses$$1);
    test$$1.verifyEqual(3, cli$$2._hints.length);
    test$$1.verifyEqual(Status$$4.VALID, display$$1.status);
    test$$1.verifyEqual(17, display$$1.start);
    test$$1.verifyEqual(17, display$$1.end);
    test$$1.verifyEqual(Status$$4.INVALID, worst.status);
    test$$1.verifyEqual(4, worst.start);
    test$$1.verifyEqual(16, worst.end);
    test$$1.verifyEqual(1, worst.predictions.length);
    verifyPredictionsContains("historyLength", worst.predictions);
    test$$1.verifyEqual("set", cli$$2.commandAssignment.value.name);
    test$$1.verifyEqual("historyLengt", settingAssignment.arg.text);
    test$$1.verifyEqual(undefined, settingAssignment.value);
    update({typed:"set historyLength", cursor:{start:17, end:17}});
    test$$1.verifyEqual("00000000000000000", statuses$$1);
    test$$1.verifyEqual(2, cli$$2._hints.length);
    test$$1.verifyEqual("set", cli$$2.commandAssignment.value.name);
    test$$1.verifyEqual("historyLength", settingAssignment.arg.text);
    test$$1.verifyEqual(historyLengthSetting$$1, settingAssignment.value);
    update({typed:"set historyLength ", cursor:{start:18, end:18}});
    test$$1.verifyEqual("000000000000000000", statuses$$1);
    test$$1.verifyEqual(3, cli$$2._hints.length);
    test$$1.verifyEqual("set", cli$$2.commandAssignment.value.name);
    test$$1.verifyEqual("historyLength", settingAssignment.arg.text);
    test$$1.verifyEqual(historyLengthSetting$$1, settingAssignment.value);
    update({typed:"set historyLength 6", cursor:{start:19, end:19}});
    test$$1.verifyEqual("0000000000000000000", statuses$$1);
    test$$1.verifyEqual(3, cli$$2._hints.length);
    test$$1.verifyEqual("set", cli$$2.commandAssignment.value.name);
    test$$1.verifyEqual("historyLength", settingAssignment.arg.text);
    test$$1.verifyEqual(historyLengthSetting$$1, settingAssignment.value);
    test$$1.verifyEqual("6", valueAssignment.arg.text);
    test$$1.verifyEqual(6, valueAssignment.value);
    test$$1.verifyEqual("number", typeof valueAssignment.value);
    return"testCli Completed"
  }
});
define("cockpit/ui/settings", ["require", "exports", "module", "pilot/types", "pilot/types/basic"], function(require$$26, exports$$25) {
  var types$$7 = require$$26("pilot/types");
  var SelectionType$$3 = require$$26("pilot/types/basic").SelectionType;
  var direction = new SelectionType$$3({name:"direction", data:["above", "below"]});
  var hintDirectionSetting = {name:"hintDirection", description:"Are hints shown above or below the command line?", type:"direction", defaultValue:"above"};
  var outputDirectionSetting = {name:"outputDirection", description:"Is the output window shown above or below the command line?", type:"direction", defaultValue:"above"};
  var outputHeightSetting = {name:"outputHeight", description:"What height should the output panel be?", type:"number", defaultValue:300};
  exports$$25.startup = function(data$$32) {
    types$$7.registerType(direction);
    data$$32.env.settings.addSetting(hintDirectionSetting);
    data$$32.env.settings.addSetting(outputDirectionSetting);
    data$$32.env.settings.addSetting(outputHeightSetting)
  };
  exports$$25.shutdown = function(data$$33) {
    types$$7.unregisterType(direction);
    data$$33.env.settings.removeSetting(hintDirectionSetting);
    data$$33.env.settings.removeSetting(outputDirectionSetting);
    data$$33.env.settings.removeSetting(outputHeightSetting)
  }
});
define("pilot/event", ["require", "exports", "module", "pilot/useragent"], function(require$$27, exports$$26) {
  var useragent = require$$27("pilot/useragent");
  exports$$26.addListener = function(elem, type$$5, callback$$3) {
    if(elem.addEventListener) {
      return elem.addEventListener(type$$5, callback$$3, false)
    }if(elem.attachEvent) {
      var wrapper = function() {
        callback$$3(window.event)
      };
      callback$$3._wrapper = wrapper;
      elem.attachEvent("on" + type$$5, wrapper)
    }
  };
  exports$$26.removeListener = function(elem$$1, type$$6, callback$$4) {
    if(elem$$1.removeEventListener) {
      return elem$$1.removeEventListener(type$$6, callback$$4, false)
    }if(elem$$1.detachEvent) {
      elem$$1.detachEvent("on" + type$$6, callback$$4._wrapper || callback$$4)
    }
  };
  exports$$26.stopEvent = function(e$$8) {
    exports$$26.stopPropagation(e$$8);
    exports$$26.preventDefault(e$$8);
    return false
  };
  exports$$26.stopPropagation = function(e$$9) {
    if(e$$9.stopPropagation) {
      e$$9.stopPropagation()
    }else {
      e$$9.cancelBubble = true
    }
  };
  exports$$26.preventDefault = function(e$$10) {
    if(e$$10.preventDefault) {
      e$$10.preventDefault()
    }else {
      e$$10.returnValue = false
    }
  };
  exports$$26.getDocumentX = function(e$$11) {
    if(e$$11.clientX) {
      var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
      return e$$11.clientX + scrollLeft
    }else {
      return e$$11.pageX
    }
  };
  exports$$26.getDocumentY = function(e$$12) {
    if(e$$12.clientY) {
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      return e$$12.clientY + scrollTop
    }else {
      return e$$12.pageX
    }
  };
  exports$$26.getButton = function(e$$13) {
    return e$$13.preventDefault ? e$$13.button : Math.max(e$$13.button - 1, 2)
  };
  exports$$26.capture = document.documentElement.setCapture ? function(el, eventHandler, releaseCaptureHandler) {
    function onReleaseCapture(e$$15) {
      eventHandler && eventHandler(e$$15);
      releaseCaptureHandler && releaseCaptureHandler();
      exports$$26.removeListener(el, "mousemove", eventHandler);
      exports$$26.removeListener(el, "mouseup", onReleaseCapture);
      exports$$26.removeListener(el, "losecapture", onReleaseCapture);
      el.releaseCapture()
    }
    exports$$26.addListener(el, "mousemove", eventHandler);
    exports$$26.addListener(el, "mouseup", onReleaseCapture);
    exports$$26.addListener(el, "losecapture", onReleaseCapture);
    el.setCapture()
  } : function(el$$1, eventHandler$$1, releaseCaptureHandler$$1) {
    function onMouseMove$$1(e$$16) {
      eventHandler$$1(e$$16);
      e$$16.stopPropagation()
    }
    function onMouseUp(e$$17) {
      eventHandler$$1 && eventHandler$$1(e$$17);
      releaseCaptureHandler$$1 && releaseCaptureHandler$$1();
      document.removeEventListener("mousemove", onMouseMove$$1, true);
      document.removeEventListener("mouseup", onMouseUp, true);
      e$$17.stopPropagation()
    }
    document.addEventListener("mousemove", onMouseMove$$1, true);
    document.addEventListener("mouseup", onMouseUp, true)
  };
  exports$$26.addMouseWheelListener = function(el$$2, callback$$5) {
    var listener = function(e$$18) {
      if(e$$18.wheelDelta !== undefined) {
        if(e$$18.wheelDeltaX !== undefined) {
          e$$18.wheelX = -e$$18.wheelDeltaX / 8;
          e$$18.wheelY = -e$$18.wheelDeltaY / 8
        }else {
          e$$18.wheelX = 0;
          e$$18.wheelY = -e$$18.wheelDelta / 8
        }
      }else {
        if(e$$18.axis && e$$18.axis == e$$18.HORIZONTAL_AXIS) {
          e$$18.wheelX = (e$$18.detail || 0) * 5;
          e$$18.wheelY = 0
        }else {
          e$$18.wheelX = 0;
          e$$18.wheelY = (e$$18.detail || 0) * 5
        }
      }callback$$5(e$$18)
    };
    exports$$26.addListener(el$$2, "DOMMouseScroll", listener);
    exports$$26.addListener(el$$2, "mousewheel", listener)
  };
  exports$$26.addMultiMouseDownListener = function(el$$3, button, count$$1, timeout, callback$$6) {
    var clicks = 0;
    var startX;
    var startY;
    var listener$$1 = function(e$$19) {
      clicks += 1;
      if(clicks == 1) {
        startX = e$$19.clientX;
        startY = e$$19.clientY;
        setTimeout(function() {
          clicks = 0
        }, timeout || 600)
      }if(exports$$26.getButton(e$$19) != button || Math.abs(e$$19.clientX - startX) > 5 || Math.abs(e$$19.clientY - startY) > 5) {
        clicks = 0
      }if(clicks == count$$1) {
        clicks = 0;
        callback$$6(e$$19)
      }return exports$$26.preventDefault(e$$19)
    };
    exports$$26.addListener(el$$3, "mousedown", listener$$1);
    useragent.isIE && exports$$26.addListener(el$$3, "dblclick", listener$$1)
  };
  exports$$26.addKeyListener = function(el$$4, callback$$7) {
    var lastDown = null;
    exports$$26.addListener(el$$4, "keydown", function(e$$20) {
      lastDown = e$$20.keyIdentifier || e$$20.keyCode;
      return callback$$7(e$$20)
    });
    if(useragent.isMac && (useragent.isGecko || useragent.isOpera)) {
      exports$$26.addListener(el$$4, "keypress", function(e$$21) {
        var keyId = e$$21.keyIdentifier || e$$21.keyCode;
        if(lastDown !== keyId) {
          return callback$$7(e$$21)
        }else {
          lastDown = null
        }
      })
    }
  }
});
define("pilot/dom", ["require", "exports", "module"], function(require$$28, exports$$27) {
  exports$$27.setText = function(elem$$2, text$$4) {
    if(elem$$2.innerText !== undefined) {
      elem$$2.innerText = text$$4
    }if(elem$$2.textContent !== undefined) {
      elem$$2.textContent = text$$4
    }
  };
  exports$$27.hasCssClass = function(el$$5, name$$23) {
    var classes = el$$5.className.split(/\s+/g);
    return classes.indexOf(name$$23) !== -1
  };
  exports$$27.addCssClass = function(el$$6, name$$24) {
    exports$$27.hasCssClass(el$$6, name$$24) || (el$$6.className += " " + name$$24)
  };
  exports$$27.setCssClass = function(node, className, include) {
    include ? exports$$27.addCssClass(node, className) : exports$$27.removeCssClass(node, className)
  };
  exports$$27.removeCssClass = function(el$$7, name$$25) {
    var classes$$1 = el$$7.className.split(/\s+/g);
    for(;;) {
      var index$$6 = classes$$1.indexOf(name$$25);
      if(index$$6 == -1) {
        break
      }classes$$1.splice(index$$6, 1)
    }el$$7.className = classes$$1.join(" ")
  };
  exports$$27.importCssString = function(cssText, doc) {
    doc = doc || document;
    if(doc.createStyleSheet) {
      var sheet = doc.createStyleSheet();
      sheet.cssText = cssText
    }else {
      var style = doc.createElement("style");
      style.appendChild(doc.createTextNode(cssText));
      doc.getElementsByTagName("head")[0].appendChild(style)
    }
  };
  exports$$27.getInnerWidth = function(element) {
    return parseInt(exports$$27.computedStyle(element, "paddingLeft")) + parseInt(exports$$27.computedStyle(element, "paddingRight")) + element.clientWidth
  };
  exports$$27.getInnerHeight = function(element$$1) {
    return parseInt(exports$$27.computedStyle(element$$1, "paddingTop")) + parseInt(exports$$27.computedStyle(element$$1, "paddingBottom")) + element$$1.clientHeight
  };
  exports$$27.computedStyle = function(element$$2, style$$1) {
    return window.getComputedStyle ? (window.getComputedStyle(element$$2, "") || {})[style$$1] || "" : element$$2.currentStyle[style$$1]
  };
  exports$$27.scrollbarWidth = function() {
    var inner$$1 = document.createElement("p");
    inner$$1.style.width = "100%";
    inner$$1.style.height = "200px";
    var outer = document.createElement("div");
    var style$$2 = outer.style;
    style$$2.position = "absolute";
    style$$2.left = "-10000px";
    style$$2.overflow = "hidden";
    style$$2.width = "200px";
    style$$2.height = "150px";
    outer.appendChild(inner$$1);
    document.body.appendChild(outer);
    var noScrollbar = inner$$1.offsetWidth;
    style$$2.overflow = "scroll";
    var withScrollbar = inner$$1.offsetWidth;
    if(noScrollbar == withScrollbar) {
      withScrollbar = outer.clientWidth
    }document.body.removeChild(outer);
    return noScrollbar - withScrollbar
  };
  exports$$27.setInnerHtml = function(el$$8, innerHtml) {
    var element$$3 = el$$8.cloneNode(false);
    element$$3.innerHTML = innerHtml;
    el$$8.parentNode.replaceChild(element$$3, el$$8);
    return element$$3
  };
  exports$$27.getParentWindow = function(document$$1) {
    return document$$1.defaultView || document$$1.parentWindow
  }
});
define("pilot/keyboard/keyutil", ["require", "exports", "module", "pilot/event", "pilot/useragent"], function(require$$29, exports$$28) {
  var event = require$$29("pilot/event");
  var useragent$$1 = require$$29("pilot/useragent");
  exports$$28.KeyHelper = function() {
    var ret$$1 = {MODIFIER_KEYS:{16:"shift", 17:"ctrl", 18:"alt", 224:"meta"}, FUNCTION_KEYS:{8:"backspace", 9:"tab", 13:"return", 19:"pause", 27:"escape", 33:"pageup", 34:"pagedown", 35:"end", 36:"home", 37:"left", 38:"up", 39:"right", 40:"down", 44:"printscreen", 45:"insert", 46:"delete", 112:"f1", 113:"f2", 114:"f3", 115:"f4", 116:"f5", 117:"f7", 119:"f8", 120:"f9", 121:"f10", 122:"f11", 123:"f12", 144:"numlock", 145:"scrolllock"}, PRINTABLE_KEYS:{32:" ", 48:"0", 49:"1", 50:"2", 51:"3", 52:"4", 
    53:"5", 54:"6", 55:"7", 56:"8", 57:"9", 59:";", 61:"=", 65:"a", 66:"b", 67:"c", 68:"d", 69:"e", 70:"f", 71:"g", 72:"h", 73:"i", 74:"j", 75:"k", 76:"l", 77:"m", 78:"n", 79:"o", 80:"p", 81:"q", 82:"r", 83:"s", 84:"t", 85:"u", 86:"v", 87:"w", 88:"x", 89:"y", 90:"z", 107:"+", 109:"-", 110:".", 188:",", 190:".", 191:"/", 192:"`", 219:"[", 220:"\\", 221:"]", 222:'"'}, PRINTABLE_KEYS_CHARCODE:{}, KEY:{}};
    for(var i$$21 in ret$$1.PRINTABLE_KEYS) {
      var k$$2 = ret$$1.PRINTABLE_KEYS[i$$21];
      ret$$1.PRINTABLE_KEYS_CHARCODE[k$$2.charCodeAt(0)] = i$$21;
      if(k$$2.toUpperCase() != k$$2) {
        ret$$1.PRINTABLE_KEYS_CHARCODE[k$$2.toUpperCase().charCodeAt(0)] = i$$21
      }
    }for(i$$21 in ret$$1.FUNCTION_KEYS) {
      var name$$26 = ret$$1.FUNCTION_KEYS[i$$21].toUpperCase();
      ret$$1.KEY[name$$26] = parseInt(i$$21, 10)
    }return ret$$1
  }();
  var isFunctionOrNonPrintableKey = function(evt) {
    return!!(evt.altKey || evt.ctrlKey || evt.metaKey || evt.charCode !== evt.which && exports$$28.KeyHelper.FUNCTION_KEYS[evt.which])
  };
  exports$$28.commandCodes = function(evt$$1, dontIgnoreMeta) {
    var code = evt$$1._keyCode || evt$$1.keyCode;
    var charCode = evt$$1._charCode === undefined ? evt$$1.charCode : evt$$1._charCode;
    var ret$$2 = null;
    var key$$10 = null;
    var modifiers = "";
    var lowercase;
    var allowShift = true;
    if(code === 0 && evt$$1.which === 0) {
      return false
    }if(charCode !== 0) {
      return false
    }if(exports$$28.KeyHelper.MODIFIER_KEYS[charCode]) {
      return[exports$$28.KeyHelper.MODIFIER_KEYS[charCode], null]
    }if(code) {
      ret$$2 = exports$$28.KeyHelper.FUNCTION_KEYS[code];
      if(!ret$$2 && (evt$$1.altKey || evt$$1.ctrlKey || evt$$1.metaKey)) {
        ret$$2 = exports$$28.KeyHelper.PRINTABLE_KEYS[code];
        if(code > 47 && code < 58) {
          allowShift = evt$$1.altKey
        }
      }if(ret$$2) {
        if(evt$$1.altKey) {
          modifiers += "alt_"
        }if(evt$$1.ctrlKey) {
          modifiers += "ctrl_"
        }if(evt$$1.metaKey) {
          modifiers += "meta_"
        }
      }else {
        if(evt$$1.ctrlKey || evt$$1.metaKey) {
          return false
        }
      }
    }if(!ret$$2) {
      code = evt$$1.which;
      key$$10 = ret$$2 = String.fromCharCode(code);
      lowercase = ret$$2.toLowerCase();
      if(evt$$1.metaKey) {
        modifiers = "meta_";
        ret$$2 = lowercase
      }else {
        ret$$2 = null
      }
    }if(evt$$1.shiftKey && ret$$2 && allowShift) {
      modifiers += "shift_"
    }if(ret$$2) {
      ret$$2 = modifiers + ret$$2
    }if(!dontIgnoreMeta && ret$$2) {
      ret$$2 = ret$$2.replace(/ctrl_meta|meta/, "ctrl")
    }return[ret$$2, key$$10]
  };
  exports$$28.addKeyDownListener = function(element$$4, boundFunction) {
    var handleBoundFunction = function(ev$$1) {
      var handled = boundFunction(ev$$1);
      handled && event.stopEvent(ev$$1);
      return handled
    };
    event.addListener(element$$4, "keydown", function(ev$$2) {
      if(useragent$$1.isGecko) {
        if(exports$$28.KeyHelper.FUNCTION_KEYS[ev$$2.keyCode]) {
          return true
        }else {
          if((ev$$2.ctrlKey || ev$$2.metaKey) && exports$$28.KeyHelper.PRINTABLE_KEYS[ev$$2.keyCode]) {
            return true
          }
        }
      }if(isFunctionOrNonPrintableKey(ev$$2)) {
        return handleBoundFunction(ev$$2)
      }return true
    });
    event.addListener(element$$4, "keypress", function(ev$$3) {
      if(useragent$$1.isGecko) {
        if(exports$$28.KeyHelper.FUNCTION_KEYS[ev$$3.keyCode]) {
          return handleBoundFunction(ev$$3)
        }else {
          if((ev$$3.ctrlKey || ev$$3.metaKey) && exports$$28.KeyHelper.PRINTABLE_KEYS_CHARCODE[ev$$3.charCode]) {
            ev$$3._keyCode = exports$$28.KeyHelper.PRINTABLE_KEYS_CHARCODE[ev$$3.charCode];
            ev$$3._charCode = 0;
            return handleBoundFunction(ev$$3)
          }
        }
      }if(ev$$3.charCode !== undefined && ev$$3.charCode === 0) {
        return true
      }return handleBoundFunction(ev$$3)
    })
  }
});
define("pilot/domtemplate", ["require", "exports", "module"], function(require$$30, exports$$29) {
  function Templater() {
    this.scope = []
  }
  Templater.prototype.processNode = function(node$$1, data$$34) {
    if(typeof node$$1 === "string") {
      node$$1 = document.getElementById(node$$1)
    }if(data$$34 === null || data$$34 === undefined) {
      data$$34 = {}
    }this.scope.push(node$$1.nodeName + (node$$1.id ? "#" + node$$1.id : ""));
    try {
      if(node$$1.attributes && node$$1.attributes.length) {
        if(node$$1.hasAttribute("foreach")) {
          this.processForEach(node$$1, data$$34);
          return
        }if(node$$1.hasAttribute("if")) {
          if(!this.processIf(node$$1, data$$34)) {
            return
          }
        }data$$34.__element = node$$1;
        var attrs = Array.prototype.slice.call(node$$1.attributes);
        var i$$22 = 0;
        for(;i$$22 < attrs.length;i$$22++) {
          var value$$40 = attrs[i$$22].value;
          var name$$27 = attrs[i$$22].name;
          this.scope.push(name$$27);
          try {
            if(name$$27 === "save") {
              value$$40 = this.stripBraces(value$$40);
              this.property(value$$40, data$$34, node$$1);
              node$$1.removeAttribute("save")
            }else {
              if(name$$27.substring(0, 2) === "on") {
                value$$40 = this.stripBraces(value$$40);
                var func = this.property(value$$40, data$$34);
                typeof func !== "function" && this.handleError("Expected " + value$$40 + " to resolve to a function, but got " + typeof func);
                node$$1.removeAttribute(name$$27);
                var capture = node$$1.hasAttribute("capture" + name$$27.substring(2));
                node$$1.addEventListener(name$$27.substring(2), func, capture);
                capture && node$$1.removeAttribute("capture" + name$$27.substring(2))
              }else {
                var self$$1 = this;
                var newValue = value$$40.replace(/\$\{[^}]*\}/g, function(path) {
                  return self$$1.envEval(path.slice(2, -1), data$$34, value$$40)
                });
                if(name$$27.charAt(0) === "_") {
                  node$$1.removeAttribute(name$$27);
                  node$$1.setAttribute(name$$27.substring(1), newValue)
                }else {
                  if(value$$40 !== newValue) {
                    attrs[i$$22].value = newValue
                  }
                }
              }
            }
          }finally {
            this.scope.pop()
          }
        }
      }var childNodes = Array.prototype.slice.call(node$$1.childNodes);
      var j$$2 = 0;
      for(;j$$2 < childNodes.length;j$$2++) {
        this.processNode(childNodes[j$$2], data$$34)
      }node$$1.nodeType === Node.TEXT_NODE && this.processTextNode(node$$1, data$$34)
    }finally {
      this.scope.pop()
    }
  };
  Templater.prototype.processIf = function(node$$2, data$$35) {
    this.scope.push("if");
    try {
      var originalValue = node$$2.getAttribute("if");
      var value$$41 = this.stripBraces(originalValue);
      var recurse = true;
      try {
        var reply$$2 = this.envEval(value$$41, data$$35, originalValue);
        recurse = !!reply$$2
      }catch(ex$$4) {
        this.handleError("Error with '" + value$$41 + "'", ex$$4);
        recurse = false
      }recurse || node$$2.parentNode.removeChild(node$$2);
      node$$2.removeAttribute("if");
      return recurse
    }finally {
      this.scope.pop()
    }
  };
  Templater.prototype.processForEach = function(node$$3, data$$36) {
    this.scope.push("foreach");
    try {
      var originalValue$$1 = node$$3.getAttribute("foreach");
      var value$$42 = originalValue$$1;
      var paramName = "param";
      if(value$$42.charAt(0) === "$") {
        value$$42 = this.stripBraces(value$$42)
      }else {
        var nameArr = value$$42.split(" in ");
        paramName = nameArr[0].trim();
        value$$42 = this.stripBraces(nameArr[1].trim())
      }node$$3.removeAttribute("foreach");
      try {
        var self$$2 = this;
        var processSingle = function(member, clone, ref) {
          ref.parentNode.insertBefore(clone, ref);
          data$$36[paramName] = member;
          self$$2.processNode(clone, data$$36);
          delete data$$36[paramName]
        };
        var processAll = function(scope, member$$1) {
          self$$2.scope.push(scope);
          try {
            if(node$$3.nodeName === "LOOP") {
              var i$$23 = 0;
              for(;i$$23 < node$$3.childNodes.length;i$$23++) {
                var clone$$1 = node$$3.childNodes[i$$23].cloneNode(true);
                processSingle(member$$1, clone$$1, node$$3)
              }
            }else {
              clone$$1 = node$$3.cloneNode(true);
              clone$$1.removeAttribute("foreach");
              processSingle(member$$1, clone$$1, node$$3)
            }
          }finally {
            self$$2.scope.pop()
          }
        };
        var reply$$3 = this.envEval(value$$42, data$$36, originalValue$$1);
        if(Array.isArray(reply$$3)) {
          reply$$3.forEach(function(data$$37, i$$24) {
            processAll("" + i$$24, data$$37)
          }, this)
        }else {
          for(var param$$6 in reply$$3) {
            reply$$3.hasOwnProperty(param$$6) && processAll(param$$6, param$$6)
          }
        }node$$3.parentNode.removeChild(node$$3)
      }catch(ex$$5) {
        this.handleError("Error with '" + value$$42 + "'", ex$$5)
      }
    }finally {
      this.scope.pop()
    }
  };
  Templater.prototype.processTextNode = function(node$$4, data$$38) {
    var value$$43 = node$$4.data;
    value$$43 = value$$43.replace(/\$\{([^}]*)\}/g, "\uf001$$$1\uf002");
    var parts$$1 = value$$43.split(/\uF001|\uF002/);
    if(parts$$1.length > 1) {
      parts$$1.forEach(function(part) {
        if(part === null || part === undefined || part === "") {
          return
        }if(part.charAt(0) === "$") {
          part = this.envEval(part.slice(1), data$$38, node$$4.data)
        }if(part === null) {
          part = "null"
        }if(part === undefined) {
          part = "undefined"
        }if(typeof part.cloneNode !== "function") {
          part = node$$4.ownerDocument.createTextNode(part.toString())
        }node$$4.parentNode.insertBefore(part, node$$4)
      }, this);
      node$$4.parentNode.removeChild(node$$4)
    }
  };
  Templater.prototype.stripBraces = function(str$$9) {
    if(!str$$9.match(/\$\{.*\}/g)) {
      this.handleError("Expected " + str$$9 + " to match ${...}");
      return str$$9
    }return str$$9.slice(2, -1)
  };
  Templater.prototype.property = function(path$$1, data$$39, newValue$$1) {
    this.scope.push(path$$1);
    try {
      if(typeof path$$1 === "string") {
        path$$1 = path$$1.split(".")
      }var value$$44 = data$$39[path$$1[0]];
      if(path$$1.length === 1) {
        if(newValue$$1 !== undefined) {
          data$$39[path$$1[0]] = newValue$$1
        }if(typeof value$$44 === "function") {
          return function() {
            return value$$44.apply(data$$39, arguments)
          }
        }return value$$44
      }if(!value$$44) {
        this.handleError("Can't find path=" + path$$1);
        return null
      }return this.property(path$$1.slice(1), value$$44, newValue$$1)
    }finally {
      this.scope.pop()
    }
  };
  Templater.prototype.envEval = function(script, env$$11, context) {
    with(env$$11) {
      try {
        this.scope.push(context);
        return eval(script)
      }catch(ex$$6) {
        this.handleError("Template error evaluating '" + script + "'", ex$$6);
        return script
      }finally {
        this.scope.pop()
      }
    }
  };
  Templater.prototype.handleError = function(message$$6, ex$$7) {
    this.logError(message$$6);
    this.logError("In: " + this.scope.join(" > "));
    ex$$7 && this.logError(ex$$7)
  };
  Templater.prototype.logError = function(message$$7) {
    console.log(message$$7)
  };
  exports$$29.Templater = Templater
});
define("cockpit/ui/requestView", ["require", "exports", "module", "pilot/dom", "pilot/event", 'text!cockpit/ui/requestView.html!\n<div class=cptRow>\n  <!-- The div for the input (i.e. what was typed) --\>\n  <div class="cptRowIn" save="${rowin}"\n      onclick="${copyToInput}"\n      ondblclick="${executeRequest}">\n  \n    <!-- What the user actually typed --\>\n    <div class="cptGt">&gt; </div>\n    <div class="cptOutTyped">${request.typed}</div>\n\n    <!-- The extra details that appear on hover --\>\n    <div class=cptHover save="${duration}"></div>\n    <img class=cptHover onclick="${hideOutput}" save="${hide}"\n        alt="Hide command output" _src="${imagePath}/minus.png"/>\n    <img class="cptHover cptHidden" onclick="${showOutput}" save="${show}"\n        alt="Show command output" _src="${imagePath}/plus.png"/>\n    <img class=cptHover onclick="${remove}"\n        alt="Remove this command from the history" _src="${imagePath}/closer.png"/>\n  \n  </div>\n  \n  <!-- The div for the command output --\>\n  <div class="cptRowOut" save="${rowout}">\n    <div class="cptRowOutput" save="${output}"></div>\n    <img _src="${imagePath}/throbber.gif" save="${throb}"/>\n  </div>\n</div>\n', 
"pilot/domtemplate", "text!cockpit/ui/requestView.css!\n.cptRowIn {\n  display: box; display: -moz-box; display: -webkit-box;\n  box-orient: horizontal; -moz-box-orient: horizontal; -webkit-box-orient: horizontal;\n  box-align: center; -moz-box-align: center; -webkit-box-align: center;\n  color: #333;\n  background-color: #EEE;\n  width: 100%;\n  font-family: consolas, courier, monospace;\n}\n.cptRowIn > * { padding-left: 2px; padding-right: 2px; }\n.cptRowIn > img { cursor: pointer; }\n.cptHover { display: none; }\n.cptRowIn:hover > .cptHover { display: block; }\n.cptRowIn:hover > .cptHover.cptHidden { display: none; }\n.cptOutTyped {\n  box-flex: 1; -moz-box-flex: 1; -webkit-box-flex: 1;\n  font-weight: bold; color: #000; font-size: 120%;\n}\n.cptRowOutput { padding-left: 10px; line-height: 1.2em; }\n.cptRowOutput strong,\n.cptRowOutput b,\n.cptRowOutput th,\n.cptRowOutput h1,\n.cptRowOutput h2,\n.cptRowOutput h3 { color: #000; }\n.cptRowOutput a { font-weight: bold; color: #666; text-decoration: none; }\n.cptRowOutput a: hover { text-decoration: underline; cursor: pointer; }\n.cptRowOutput input[type=password],\n.cptRowOutput input[type=text],\n.cptRowOutput textarea {\n  color: #000; font-size: 120%;\n  background: transparent; padding: 3px;\n  border-radius: 5px; -moz-border-radius: 5px; -webkit-border-radius: 5px;\n}\n.cptRowOutput table,\n.cptRowOutput td,\n.cptRowOutput th { border: 0; padding: 0 2px; }\n.cptRowOutput .right { text-align: right; }\n"], 
function(require$$31, exports$$30, module$$31) {
  function RequestView(request$$8, cliView) {
    this.request = request$$8;
    this.cliView = cliView;
    this.imagePath = imagePath;
    this.rowin = null;
    this.rowout = null;
    this.output = null;
    this.hide = null;
    this.show = null;
    this.duration = null;
    this.throb = null;
    (new Templater$$1).processNode(row.cloneNode(true), this);
    this.cliView.output.appendChild(this.rowin);
    this.cliView.output.appendChild(this.rowout);
    this.request.addEventListener("output", this.onRequestChange.bind(this))
  }
  var dom = require$$31("pilot/dom");
  var event$$1 = require$$31("pilot/event");
  var requestViewHtml = require$$31('text!cockpit/ui/requestView.html!\n<div class=cptRow>\n  <!-- The div for the input (i.e. what was typed) --\>\n  <div class="cptRowIn" save="${rowin}"\n      onclick="${copyToInput}"\n      ondblclick="${executeRequest}">\n  \n    <!-- What the user actually typed --\>\n    <div class="cptGt">&gt; </div>\n    <div class="cptOutTyped">${request.typed}</div>\n\n    <!-- The extra details that appear on hover --\>\n    <div class=cptHover save="${duration}"></div>\n    <img class=cptHover onclick="${hideOutput}" save="${hide}"\n        alt="Hide command output" _src="${imagePath}/minus.png"/>\n    <img class="cptHover cptHidden" onclick="${showOutput}" save="${show}"\n        alt="Show command output" _src="${imagePath}/plus.png"/>\n    <img class=cptHover onclick="${remove}"\n        alt="Remove this command from the history" _src="${imagePath}/closer.png"/>\n  \n  </div>\n  \n  <!-- The div for the command output --\>\n  <div class="cptRowOut" save="${rowout}">\n    <div class="cptRowOutput" save="${output}"></div>\n    <img _src="${imagePath}/throbber.gif" save="${throb}"/>\n  </div>\n</div>\n');
  var Templater$$1 = require$$31("pilot/domtemplate").Templater;
  var requestViewCss = require$$31("text!cockpit/ui/requestView.css!\n.cptRowIn {\n  display: box; display: -moz-box; display: -webkit-box;\n  box-orient: horizontal; -moz-box-orient: horizontal; -webkit-box-orient: horizontal;\n  box-align: center; -moz-box-align: center; -webkit-box-align: center;\n  color: #333;\n  background-color: #EEE;\n  width: 100%;\n  font-family: consolas, courier, monospace;\n}\n.cptRowIn > * { padding-left: 2px; padding-right: 2px; }\n.cptRowIn > img { cursor: pointer; }\n.cptHover { display: none; }\n.cptRowIn:hover > .cptHover { display: block; }\n.cptRowIn:hover > .cptHover.cptHidden { display: none; }\n.cptOutTyped {\n  box-flex: 1; -moz-box-flex: 1; -webkit-box-flex: 1;\n  font-weight: bold; color: #000; font-size: 120%;\n}\n.cptRowOutput { padding-left: 10px; line-height: 1.2em; }\n.cptRowOutput strong,\n.cptRowOutput b,\n.cptRowOutput th,\n.cptRowOutput h1,\n.cptRowOutput h2,\n.cptRowOutput h3 { color: #000; }\n.cptRowOutput a { font-weight: bold; color: #666; text-decoration: none; }\n.cptRowOutput a: hover { text-decoration: underline; cursor: pointer; }\n.cptRowOutput input[type=password],\n.cptRowOutput input[type=text],\n.cptRowOutput textarea {\n  color: #000; font-size: 120%;\n  background: transparent; padding: 3px;\n  border-radius: 5px; -moz-border-radius: 5px; -webkit-border-radius: 5px;\n}\n.cptRowOutput table,\n.cptRowOutput td,\n.cptRowOutput th { border: 0; padding: 0 2px; }\n.cptRowOutput .right { text-align: right; }\n");
  dom.importCssString(requestViewCss);
  var templates = document.createElement("div");
  templates.innerHTML = requestViewHtml;
  var row = templates.querySelector(".cptRow");
  var filename = module$$31.id.split("/").pop() + ".js";
  var imagePath;
  if(module$$31.uri.substr(-filename.length) !== filename) {
    console.error("module.id", module$$31.id);
    console.error("module.uri", module$$31.uri);
    console.error("filename", filename);
    console.error("Can't work out path from module.uri/module/id");
    imagePath = "."
  }else {
    var end$$4 = module$$31.uri.length - filename.length;
    imagePath = module$$31.uri.substr(0, end$$4) + "images"
  }RequestView.prototype = {copyToInput:function() {
    this.cliView.element.value = this.request.typed
  }, executeRequest:function() {
    this.cliView.cli.update({typed:this.request.typed, cursor:{start:0, end:0}});
    this.cliView.cli.exec()
  }, hideOutput:function(ev$$5) {
    this.output.style.display = "none";
    dom.addCssClass(this.hide, "cmd_hidden");
    dom.removeCssClass(this.show, "cmd_hidden");
    event$$1.stopPropagation(ev$$5)
  }, showOutput:function(ev$$6) {
    this.output.style.display = "block";
    dom.removeCssClass(this.hide, "cmd_hidden");
    dom.addCssClass(this.show, "cmd_hidden");
    event$$1.stopPropagation(ev$$6)
  }, remove:function(ev$$7) {
    this.cliView.output.removeChild(this.rowin);
    this.cliView.output.removeChild(this.rowout);
    event$$1.stopPropagation(ev$$7)
  }, onRequestChange:function() {
    this.duration.innerHTML = this.request.duration ? "completed in " + this.request.duration / 1E3 + " sec " : "";
    this.output.innerHTML = "";
    this.request.outputs.forEach(function(output$$1) {
      var node$$5;
      if(typeof output$$1 == "string") {
        node$$5 = document.createElement("p");
        node$$5.innerHTML = output$$1
      }else {
        node$$5 = output$$1
      }this.output.appendChild(node$$5)
    }, this);
    this.cliView.scrollOutputToBottom();
    dom.setCssClass(this.output, "cmd_error", this.request.error);
    this.throb.style.display = this.request.completed ? "none" : "block"
  }};
  exports$$30.RequestView = RequestView
});
define("cockpit/ui/cliView", ["require", "exports", "module", "text!cockpit/ui/cliView.css!\n#cockpitInput { padding-left: 16px; }\n\n#cockpitOutput { overflow: auto; }\n#cockpitOutput.cptFocusPopup { position: absolute; z-index: 999; }\n\n.cptFocusPopup { display: none; }\n#cockpitInput:focus ~ .cptFocusPopup { display: block; }\n#cockpitInput:focus ~ .cptFocusPopup.cptNoPopup { display: none; }\n\n.cptCompletion { padding: 0; position: absolute; z-index: -1000; }\n.cptCompletion.VALID { background: #FFF; }\n.cptCompletion.INCOMPLETE { background: #DDD; }\n.cptCompletion.INVALID { background: #DDD; }\n.cptCompletion span { color: #FFF; }\n.cptCompletion span.INCOMPLETE { color: #DDD; border-bottom: 2px dotted #F80; }\n.cptCompletion span.INVALID { color: #DDD; border-bottom: 2px dotted #F00; }\nspan.cptPrompt { color: #66F; font-weight: bold; }\n\n\n.cptHints {\n  color: #000;\n  position: absolute;\n  border: 1px solid rgba(230, 230, 230, 0.8);\n  background: rgba(250, 250, 250, 0.8);\n  -moz-border-radius-topleft: 10px;\n  -moz-border-radius-topright: 10px;\n  border-top-left-radius: 10px; border-top-right-radius: 10px;\n  z-index: 1000;\n  padding: 8px;\n  display: none;\n}\n.cptHints ul { margin: 0; padding: 0 15px; }\n\n.cptGt { font-weight: bold; font-size: 120%; }\n", 
"pilot/event", "pilot/dom", "pilot/canon", "pilot/types", "pilot/keyboard/keyutil", "cockpit/cli", "cockpit/cli", "cockpit/ui/requestView"], function(require$$32, exports$$31) {
  function CliView(cli$$3, env$$12) {
    this.cli = cli$$3;
    this.doc = document;
    this.win = dom$$1.getParentWindow(this.doc);
    this.element = this.doc.getElementById("cockpitInput");
    if(!this.element) {
      console.log("No element with an id of cockpit. Bailing on cli");
      return
    }this.settings = env$$12.settings;
    this.hintDirection = this.settings.getSetting("hintDirection");
    this.outputDirection = this.settings.getSetting("outputDirection");
    this.outputHeight = this.settings.getSetting("outputHeight");
    this.isUpdating = false;
    this.createElements();
    this.update()
  }
  var editorCss = require$$32("text!cockpit/ui/cliView.css!\n#cockpitInput { padding-left: 16px; }\n\n#cockpitOutput { overflow: auto; }\n#cockpitOutput.cptFocusPopup { position: absolute; z-index: 999; }\n\n.cptFocusPopup { display: none; }\n#cockpitInput:focus ~ .cptFocusPopup { display: block; }\n#cockpitInput:focus ~ .cptFocusPopup.cptNoPopup { display: none; }\n\n.cptCompletion { padding: 0; position: absolute; z-index: -1000; }\n.cptCompletion.VALID { background: #FFF; }\n.cptCompletion.INCOMPLETE { background: #DDD; }\n.cptCompletion.INVALID { background: #DDD; }\n.cptCompletion span { color: #FFF; }\n.cptCompletion span.INCOMPLETE { color: #DDD; border-bottom: 2px dotted #F80; }\n.cptCompletion span.INVALID { color: #DDD; border-bottom: 2px dotted #F00; }\nspan.cptPrompt { color: #66F; font-weight: bold; }\n\n\n.cptHints {\n  color: #000;\n  position: absolute;\n  border: 1px solid rgba(230, 230, 230, 0.8);\n  background: rgba(250, 250, 250, 0.8);\n  -moz-border-radius-topleft: 10px;\n  -moz-border-radius-topright: 10px;\n  border-top-left-radius: 10px; border-top-right-radius: 10px;\n  z-index: 1000;\n  padding: 8px;\n  display: none;\n}\n.cptHints ul { margin: 0; padding: 0 15px; }\n\n.cptGt { font-weight: bold; font-size: 120%; }\n");
  var event$$2 = require$$32("pilot/event");
  var dom$$1 = require$$32("pilot/dom");
  dom$$1.importCssString(editorCss);
  var canon$$4 = require$$32("pilot/canon");
  var Status$$5 = require$$32("pilot/types").Status;
  var keyutil = require$$32("pilot/keyboard/keyutil");
  var CliRequisition$$2 = require$$32("cockpit/cli").CliRequisition;
  var Hint$$1 = require$$32("cockpit/cli").Hint;
  var RequestView$$1 = require$$32("cockpit/ui/requestView").RequestView;
  new Hint$$1(Status$$5.VALID, "", 0, 0);
  exports$$31.startup = function(data$$40) {
    var cli$$4 = new CliRequisition$$2(data$$40.env);
    new CliView(cli$$4, data$$40.env)
  };
  CliView.prototype = {createElements:function() {
    var input$$2 = this.element;
    this.output = this.doc.getElementById("cockpitOutput");
    this.popupOutput = this.output == null;
    if(!this.output) {
      this.output = this.doc.createElement("div");
      this.output.id = "cockpitOutput";
      this.output.className = "cptFocusPopup";
      input$$2.parentNode.insertBefore(this.output, input$$2.nextSibling);
      var setMaxOutputHeight = function() {
        this.output.style.maxHeight = this.outputHeight.get() + "px"
      }.bind(this);
      this.outputHeight.addEventListener("change", setMaxOutputHeight);
      setMaxOutputHeight()
    }this.completer = this.doc.createElement("div");
    this.completer.className = "cptCompletion VALID";
    this.completer.style.color = dom$$1.computedStyle(input$$2, "color");
    this.completer.style.fontSize = dom$$1.computedStyle(input$$2, "fontSize");
    this.completer.style.fontFamily = dom$$1.computedStyle(input$$2, "fontFamily");
    this.completer.style.fontWeight = dom$$1.computedStyle(input$$2, "fontWeight");
    this.completer.style.fontStyle = dom$$1.computedStyle(input$$2, "fontStyle");
    input$$2.parentNode.insertBefore(this.completer, input$$2.nextSibling);
    this.completer.style.backgroundColor = input$$2.style.backgroundColor;
    input$$2.style.backgroundColor = "transparent";
    this.hinter = this.doc.createElement("div");
    this.hinter.className = "cptHints cptFocusPopup";
    input$$2.parentNode.insertBefore(this.hinter, input$$2.nextSibling);
    var resizer = this.resizer.bind(this);
    event$$2.addListener(this.win, "resize", resizer);
    this.hintDirection.addEventListener("change", resizer);
    this.outputDirection.addEventListener("change", resizer);
    resizer();
    canon$$4.addEventListener("output", function(ev$$9) {
      new RequestView$$1(ev$$9.request, this)
    }.bind(this));
    keyutil.addKeyDownListener(input$$2, this.onKeyDown.bind(this));
    event$$2.addListener(input$$2, "keyup", this.onKeyUp.bind(this));
    event$$2.addListener(input$$2, "mouseup", function() {
      this.isUpdating = true;
      this.update();
      this.isUpdating = false
    }.bind(this));
    this.cli.addEventListener("argumentChange", this.onArgChange.bind(this))
  }, scrollOutputToBottom:function() {
    var scrollHeight = Math.max(this.output.scrollHeight, this.output.clientHeight);
    this.output.scrollTop = scrollHeight - this.output.clientHeight
  }, resizer:function() {
    var rect = this.element.getClientRects()[0];
    this.completer.style.top = rect.top + "px";
    var height = rect.bottom - rect.top;
    this.completer.style.height = height + "px";
    this.completer.style.lineHeight = height + "px";
    this.completer.style.left = rect.left + "px";
    var width = rect.right - rect.left;
    this.completer.style.width = width + "px";
    if(this.hintDirection.get() === "below") {
      this.hinter.style.top = rect.bottom + "px";
      this.hinter.style.bottom = "auto"
    }else {
      this.hinter.style.top = "auto";
      this.hinter.style.bottom = this.doc.documentElement.clientHeight - rect.top + "px"
    }this.hinter.style.left = rect.left + 30 + "px";
    this.hinter.style.maxWidth = width - 110 + "px";
    if(this.popupOutput) {
      if(this.outputDirection.get() === "below") {
        this.output.style.top = rect.bottom + "px";
        this.output.style.bottom = "auto"
      }else {
        this.output.style.top = "auto";
        this.output.style.bottom = this.doc.documentElement.clientHeight - rect.top + "px"
      }this.output.style.left = rect.left + "px";
      this.output.style.width = width - 80 + "px"
    }
  }, onKeyDown:function(ev$$11) {
    var handled$$1;
    if(ev$$11.keyCode === keyutil.KeyHelper.KEY.TAB || ev$$11.keyCode === keyutil.KeyHelper.KEY.UP || ev$$11.keyCode === keyutil.KeyHelper.KEY.DOWN) {
      return true
    }return handled$$1
  }, onKeyUp:function(ev$$12) {
    var handled$$2;
    if(ev$$12.keyCode === keyutil.KeyHelper.KEY.RETURN) {
      var worst$$1 = this.cli.getWorstHint();
      if(worst$$1.status === Status$$5.VALID) {
        this.cli.exec();
        this.element.value = ""
      }else {
        this.element.selectionStart = worst$$1.start;
        this.element.selectionEnd = worst$$1.end
      }
    }this.update();
    var current = this.cli.getAssignmentAt(this.element.selectionStart);
    if(current) {
      if(ev$$12.keyCode === keyutil.KeyHelper.KEY.TAB) {
        current.complete();
        this.update()
      }if(ev$$12.keyCode === keyutil.KeyHelper.KEY.UP) {
        current.increment();
        this.update()
      }if(ev$$12.keyCode === keyutil.KeyHelper.KEY.DOWN) {
        current.decrement();
        this.update()
      }
    }return handled$$2
  }, update:function() {
    this.isUpdating = true;
    var input$$3 = {typed:this.element.value, cursor:{start:this.element.selectionStart, end:this.element.selectionEnd}};
    this.cli.update(input$$3);
    var display$$2 = this.cli.getAssignmentAt(input$$3.cursor.start).getHint();
    dom$$1.removeCssClass(this.completer, Status$$5.VALID.toString());
    dom$$1.removeCssClass(this.completer, Status$$5.INCOMPLETE.toString());
    dom$$1.removeCssClass(this.completer, Status$$5.INVALID.toString());
    var completion = '<span class="cptPrompt">&gt;</span> ';
    if(this.element.value.length > 0) {
      var scores$$1 = this.cli.getInputStatusMarkup();
      completion += this.markupStatusScore(scores$$1)
    }if(this.element.value.length > 0 && display$$2.predictions && display$$2.predictions.length > 0) {
      var tab = display$$2.predictions[0];
      completion += " &nbsp;&#x21E5; " + (tab.name ? tab.name : tab)
    }this.completer.innerHTML = completion;
    dom$$1.addCssClass(this.completer, this.cli.getWorstHint().status.toString());
    var hint$$5 = "";
    if(this.element.value.length !== 0) {
      hint$$5 += display$$2.message;
      if(display$$2.predictions && display$$2.predictions.length > 0) {
        hint$$5 += ": [ ";
        display$$2.predictions.forEach(function(prediction$$1) {
          hint$$5 += prediction$$1.name ? prediction$$1.name : prediction$$1;
          hint$$5 += " | "
        }, this);
        hint$$5 = hint$$5.replace(/\| $/, "]")
      }
    }this.hinter.innerHTML = hint$$5;
    hint$$5.length === 0 ? dom$$1.addCssClass(this.hinter, "cptNoPopup") : dom$$1.removeCssClass(this.hinter, "cptNoPopup");
    this.isUpdating = false
  }, markupStatusScore:function(scores$$2) {
    var completion$$1 = "";
    var i$$25 = 0;
    var lastStatus = -1;
    for(;;) {
      if(lastStatus !== scores$$2[i$$25]) {
        completion$$1 += "<span class=" + scores$$2[i$$25].toString() + ">";
        lastStatus = scores$$2[i$$25]
      }completion$$1 += this.element.value[i$$25];
      i$$25++;
      if(i$$25 === this.element.value.length) {
        completion$$1 += "</span>";
        break
      }if(lastStatus !== scores$$2[i$$25]) {
        completion$$1 += "</span>"
      }
    }return completion$$1
  }, onArgChange:function(ev$$13) {
    if(this.isUpdating) {
      return
    }var prefix = this.element.value.substring(0, ev$$13.argument.start);
    var suffix = this.element.value.substring(ev$$13.argument.end);
    var insert = typeof ev$$13.text === "string" ? ev$$13.text : ev$$13.text.name;
    this.element.value = prefix + insert + suffix;
    var insertEnd = (prefix + insert).length;
    this.element.selectionStart = insertEnd;
    this.element.selectionEnd = insertEnd
  }};
  exports$$31.CliView = CliView
});
define("cockpit/index", ["require", "exports", "module", "pilot/index", "cockpit/cli", "cockpit/test/testCli", "cockpit/ui/settings", "cockpit/ui/cliView"], function(require$$33, exports$$32) {
  exports$$32.startup = function(data$$41, reason$$23) {
    require$$33("pilot/index");
    require$$33("cockpit/cli").startup(data$$41, reason$$23);
    window.testCli = require$$33("cockpit/test/testCli");
    require$$33("cockpit/ui/settings").startup(data$$41, reason$$23);
    require$$33("cockpit/ui/cliView").startup(data$$41, reason$$23)
  }
});
define("ace/textinput", ["require", "exports", "module", "pilot/event"], function(require$$34, exports$$33) {
  var event$$3 = require$$34("pilot/event");
  var TextInput = function(parentNode, host) {
    function sendText() {
      if(!copied) {
        var value$$45 = text$$5.value;
        if(value$$45) {
          if(value$$45.charCodeAt(value$$45.length - 1) == PLACEHOLDER.charCodeAt(0)) {
            value$$45 = value$$45.slice(0, -1);
            value$$45 && host.onTextInput(value$$45)
          }else {
            host.onTextInput(value$$45)
          }
        }
      }copied = false;
      text$$5.value = PLACEHOLDER;
      text$$5.select()
    }
    var text$$5 = document.createElement("textarea");
    var style$$3 = text$$5.style;
    style$$3.position = "absolute";
    style$$3.left = "-10000px";
    style$$3.top = "-10000px";
    parentNode.appendChild(text$$5);
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
      text$$5.value = "";
      host.onCompositionStart();
      setTimeout(onCompositionUpdate, 0)
    };
    var onCompositionUpdate = function() {
      host.onCompositionUpdate(text$$5.value)
    };
    var onCompositionEnd = function() {
      inCompostion = false;
      host.onCompositionEnd();
      onTextInput()
    };
    var onCopy = function() {
      copied = true;
      text$$5.value = host.getCopyText();
      text$$5.select();
      copied = true;
      setTimeout(sendText, 0)
    };
    var onCut = function() {
      copied = true;
      text$$5.value = host.getCopyText();
      host.onCut();
      text$$5.select();
      setTimeout(sendText, 0)
    };
    event$$3.addListener(text$$5, "keypress", onTextInput);
    event$$3.addListener(text$$5, "textInput", onTextInput);
    event$$3.addListener(text$$5, "paste", onTextInput);
    event$$3.addListener(text$$5, "propertychange", onTextInput);
    event$$3.addListener(text$$5, "copy", onCopy);
    event$$3.addListener(text$$5, "cut", onCut);
    event$$3.addListener(text$$5, "compositionstart", onCompositionStart);
    event$$3.addListener(text$$5, "compositionupdate", onCompositionUpdate);
    event$$3.addListener(text$$5, "compositionend", onCompositionEnd);
    event$$3.addListener(text$$5, "blur", function() {
      host.onBlur()
    });
    event$$3.addListener(text$$5, "focus", function() {
      host.onFocus();
      text$$5.select()
    });
    this.focus = function() {
      host.onFocus();
      text$$5.select();
      text$$5.focus()
    };
    this.blur = function() {
      text$$5.blur()
    }
  };
  exports$$33.TextInput = TextInput
});
define("ace/conf/keybindings/default_mac", ["require", "exports", "module"], function(require$$35, exports$$34) {
  exports$$34.bindings = {selectall:"Command-A", removeline:"Command-D", gotoline:"Command-L", togglecomment:"Command-7", findnext:"Command-K", findprevious:"Command-Shift-K", find:"Command-F", replace:"Command-R", undo:"Command-Z", redo:"Command-Shift-Z|Command-Y", overwrite:"Insert", copylinesup:"Command-Option-Up", movelinesup:"Option-Up", selecttostart:"Command-Shift-Up", gotostart:"Command-Home|Command-Up", selectup:"Shift-Up", golineup:"Up", copylinesdown:"Command-Option-Down", movelinesdown:"Option-Down", 
  selecttoend:"Command-Shift-Down", gotoend:"Command-End|Command-Down", selectdown:"Shift-Down", godown:"Down", selectwordleft:"Option-Shift-Left", gotowordleft:"Option-Left", selecttolinestart:"Command-Shift-Left", gotolinestart:"Command-Left|Home", selectleft:"Shift-Left", gotoleft:"Left", selectwordright:"Option-Shift-Right", gotowordright:"Option-Right", selecttolineend:"Command-Shift-Right", gotolineend:"Command-Right|End", selectright:"Shift-Right", gotoright:"Right", selectpagedown:"Shift-PageDown", 
  pagedown:"PageDown", selectpageup:"Shift-PageUp", pageup:"PageUp", selectlinestart:"Shift-Home", selectlineend:"Shift-End", del:"Delete", backspace:"Ctrl-Backspace|Command-Backspace|Option-Backspace|Backspace", outdent:"Shift-Tab", indent:"Tab"}
});
define("ace/conf/keybindings/default_win", ["require", "exports", "module"], function(require$$36, exports$$35) {
  exports$$35.bindings = {selectall:"Ctrl-A", removeline:"Ctrl-D", gotoline:"Ctrl-L", togglecomment:"Ctrl-7", findnext:"Ctrl-K", findprevious:"Ctrl-Shift-K", find:"Ctrl-F", replace:"Ctrl-R", undo:"Ctrl-Z", redo:"Ctrl-Shift-Z|Ctrl-Y", overwrite:"Insert", copylinesup:"Ctrl-Alt-Up", movelinesup:"Alt-Up", selecttostart:"Alt-Shift-Up", gotostart:"Ctrl-Home|Ctrl-Up", selectup:"Shift-Up", golineup:"Up", copylinesdown:"Ctrl-Alt-Down", movelinesdown:"Alt-Down", selecttoend:"Alt-Shift-Down", gotoend:"Ctrl-End|Ctrl-Down", 
  selectdown:"Shift-Down", godown:"Down", selectwordleft:"Ctrl-Shift-Left", gotowordleft:"Ctrl-Left", selecttolinestart:"Alt-Shift-Left", gotolinestart:"Alt-Left|Home", selectleft:"Shift-Left", gotoleft:"Left", selectwordright:"Ctrl-Shift-Right", gotowordright:"Ctrl-Right", selecttolineend:"Alt-Shift-Right", gotolineend:"Alt-Right|End", selectright:"Shift-Right", gotoright:"Right", selectpagedown:"Shift-PageDown", pagedown:"PageDown", selectpageup:"Shift-PageUp", pageup:"PageUp", selectlinestart:"Shift-Home", 
  selectlineend:"Shift-End", del:"Delete", backspace:"Backspace", outdent:"Shift-Tab", indent:"Tab"}
});
define("ace/commands/default_commands", ["require", "exports", "module", "pilot/canon"], function(require$$37) {
  var canon$$5 = require$$37("pilot/canon");
  canon$$5.addCommand({name:"selectall", exec:function(env$$13) {
    env$$13.editor.getSelection().selectAll()
  }});
  canon$$5.addCommand({name:"removeline", exec:function(env$$14) {
    env$$14.editor.removeLines()
  }});
  canon$$5.addCommand({name:"gotoline", exec:function(env$$15) {
    var line$$2 = parseInt(prompt("Enter line number:"));
    isNaN(line$$2) || env$$15.editor.gotoLine(line$$2)
  }});
  canon$$5.addCommand({name:"togglecomment", exec:function(env$$16) {
    env$$16.editor.toggleCommentLines()
  }});
  canon$$5.addCommand({name:"findnext", exec:function(env$$17) {
    env$$17.editor.findNext()
  }});
  canon$$5.addCommand({name:"findprevious", exec:function(env$$18) {
    env$$18.editor.findPrevious()
  }});
  canon$$5.addCommand({name:"find", exec:function(env$$19) {
    var needle = prompt("Find:");
    env$$19.editor.find(needle)
  }});
  canon$$5.addCommand({name:"undo", exec:function(env$$20) {
    env$$20.editor.undo()
  }});
  canon$$5.addCommand({name:"redo", exec:function(env$$21) {
    env$$21.editor.redo()
  }});
  canon$$5.addCommand({name:"redo", exec:function(env$$22) {
    env$$22.editor.redo()
  }});
  canon$$5.addCommand({name:"overwrite", exec:function(env$$23) {
    env$$23.editor.toggleOverwrite()
  }});
  canon$$5.addCommand({name:"copylinesup", exec:function(env$$24) {
    env$$24.editor.copyLinesUp()
  }});
  canon$$5.addCommand({name:"movelinesup", exec:function(env$$25) {
    env$$25.editor.moveLinesUp()
  }});
  canon$$5.addCommand({name:"selecttostart", exec:function(env$$26) {
    env$$26.editor.getSelection().selectFileStart()
  }});
  canon$$5.addCommand({name:"gotostart", exec:function(env$$27) {
    env$$27.editor.navigateFileStart()
  }});
  canon$$5.addCommand({name:"selectup", exec:function(env$$28) {
    env$$28.editor.getSelection().selectUp()
  }});
  canon$$5.addCommand({name:"golineup", exec:function(env$$29) {
    env$$29.editor.navigateUp()
  }});
  canon$$5.addCommand({name:"copylinesdown", exec:function(env$$30) {
    env$$30.editor.copyLinesDown()
  }});
  canon$$5.addCommand({name:"movelinesdown", exec:function(env$$31) {
    env$$31.editor.moveLinesDown()
  }});
  canon$$5.addCommand({name:"selecttoend", exec:function(env$$32) {
    env$$32.editor.getSelection().selectFileEnd()
  }});
  canon$$5.addCommand({name:"gotoend", exec:function(env$$33) {
    env$$33.editor.navigateFileEnd()
  }});
  canon$$5.addCommand({name:"selectdown", exec:function(env$$34) {
    env$$34.editor.getSelection().selectDown()
  }});
  canon$$5.addCommand({name:"godown", exec:function(env$$35) {
    env$$35.editor.navigateDown()
  }});
  canon$$5.addCommand({name:"selectwordleft", exec:function(env$$36) {
    env$$36.editor.getSelection().selectWordLeft()
  }});
  canon$$5.addCommand({name:"gotowordleft", exec:function(env$$37) {
    env$$37.editor.navigateWordLeft()
  }});
  canon$$5.addCommand({name:"selecttolinestart", exec:function(env$$38) {
    env$$38.editor.getSelection().selectLineStart()
  }});
  canon$$5.addCommand({name:"gotolinestart", exec:function(env$$39) {
    env$$39.editor.navigateLineStart()
  }});
  canon$$5.addCommand({name:"selectleft", exec:function(env$$40) {
    env$$40.editor.getSelection().selectLeft()
  }});
  canon$$5.addCommand({name:"gotoleft", exec:function(env$$41) {
    env$$41.editor.navigateLeft()
  }});
  canon$$5.addCommand({name:"selectwordright", exec:function(env$$42) {
    env$$42.editor.getSelection().selectWordRight()
  }});
  canon$$5.addCommand({name:"gotowordright", exec:function(env$$43) {
    env$$43.editor.navigateWordRight()
  }});
  canon$$5.addCommand({name:"selecttolineend", exec:function(env$$44) {
    env$$44.editor.getSelection().selectLineEnd()
  }});
  canon$$5.addCommand({name:"gotolineend", exec:function(env$$45) {
    env$$45.editor.navigateLineEnd()
  }});
  canon$$5.addCommand({name:"selectright", exec:function(env$$46) {
    env$$46.editor.getSelection().selectRight()
  }});
  canon$$5.addCommand({name:"gotoright", exec:function(env$$47) {
    env$$47.editor.navigateRight()
  }});
  canon$$5.addCommand({name:"selectpagedown", exec:function(env$$48) {
    env$$48.editor.selectPageDown()
  }});
  canon$$5.addCommand({name:"pagedown", exec:function(env$$49) {
    env$$49.editor.scrollPageDown()
  }});
  canon$$5.addCommand({name:"gotopagedown", exec:function(env$$50) {
    env$$50.editor.gotoPageDown()
  }});
  canon$$5.addCommand({name:"selectpageup", exec:function(env$$51) {
    env$$51.editor.selectPageUp()
  }});
  canon$$5.addCommand({name:"pageup", exec:function(env$$52) {
    env$$52.editor.scrollPageUp()
  }});
  canon$$5.addCommand({name:"gotopageup", exec:function(env$$53) {
    env$$53.editor.gotoPageUp()
  }});
  canon$$5.addCommand({name:"selectlinestart", exec:function(env$$54) {
    env$$54.editor.getSelection().selectLineStart()
  }});
  canon$$5.addCommand({name:"gotolinestart", exec:function(env$$55) {
    env$$55.editor.navigateLineStart()
  }});
  canon$$5.addCommand({name:"selectlineend", exec:function(env$$56) {
    env$$56.editor.getSelection().selectLineEnd()
  }});
  canon$$5.addCommand({name:"gotolineend", exec:function(env$$57) {
    env$$57.editor.navigateLineEnd()
  }});
  canon$$5.addCommand({name:"del", exec:function(env$$58) {
    env$$58.editor.removeRight()
  }});
  canon$$5.addCommand({name:"backspace", exec:function(env$$59) {
    env$$59.editor.removeLeft()
  }});
  canon$$5.addCommand({name:"outdent", exec:function(env$$60) {
    env$$60.editor.blockOutdent()
  }});
  canon$$5.addCommand({name:"indent", exec:function(env$$61) {
    env$$61.editor.indent()
  }})
});
define("ace/keybinding", ["require", "exports", "module", "pilot/useragent", "pilot/event", "ace/conf/keybindings/default_mac", "ace/conf/keybindings/default_win", "pilot/canon", "ace/commands/default_commands"], function(require$$38, exports$$37) {
  var useragent$$2 = require$$38("pilot/useragent");
  var event$$4 = require$$38("pilot/event");
  var default_mac = require$$38("ace/conf/keybindings/default_mac").bindings;
  var default_win = require$$38("ace/conf/keybindings/default_win").bindings;
  var canon$$6 = require$$38("pilot/canon");
  require$$38("ace/commands/default_commands");
  var KeyBinding = function(element$$5, editor, config$$1) {
    this.setConfig(config$$1);
    var _self = this;
    event$$4.addKeyListener(element$$5, function(e$$24) {
      var hashId = useragent$$2.isOpera && useragent$$2.isMac ? 0 | (e$$24.metaKey ? 1 : 0) | (e$$24.altKey ? 2 : 0) | (e$$24.shiftKey ? 4 : 0) | (e$$24.ctrlKey ? 8 : 0) : 0 | (e$$24.ctrlKey ? 1 : 0) | (e$$24.altKey ? 2 : 0) | (e$$24.shiftKey ? 4 : 0) | (e$$24.metaKey ? 8 : 0);
      var key$$11 = _self.keyNames[e$$24.keyCode];
      var commandName = (_self.config.reverse[hashId] || {})[(key$$11 || String.fromCharCode(e$$24.keyCode)).toLowerCase()];
      var success = canon$$6.exec(commandName, {editor:editor});
      if(success) {
        return event$$4.stopEvent(e$$24)
      }
    })
  };
  (function() {
    function splitSafe(s, separator, limit, bLowerCase) {
      return(bLowerCase && s.toLowerCase() || s).replace(/(?:^\s+|\n|\s+$)/g, "").split(new RegExp("[\\s ]*" + separator + "[\\s ]*", "g"), limit || 999)
    }
    function parseKeys(keys, val, ret$$3) {
      var key$$12;
      var hashId$$1 = 0;
      var parts$$2 = splitSafe(keys, "\\-", null, true);
      var i$$26 = 0;
      var l = parts$$2.length;
      for(;i$$26 < l;++i$$26) {
        if(this.keyMods[parts$$2[i$$26]]) {
          hashId$$1 |= this.keyMods[parts$$2[i$$26]]
        }else {
          key$$12 = parts$$2[i$$26] || "-"
        }
      }(ret$$3[hashId$$1] || (ret$$3[hashId$$1] = {}))[key$$12] = val;
      return ret$$3
    }
    function objectReverse(obj$$4, keySplit) {
      var i$$27;
      var j$$3;
      var l$$1;
      var key$$13;
      var ret$$4 = {};
      for(i$$27 in obj$$4) {
        key$$13 = obj$$4[i$$27];
        if(keySplit && typeof key$$13 == "string") {
          key$$13 = key$$13.split(keySplit);
          j$$3 = 0;
          l$$1 = key$$13.length;
          for(;j$$3 < l$$1;++j$$3) {
            parseKeys.call(this, key$$13[j$$3], i$$27, ret$$4)
          }
        }else {
          parseKeys.call(this, key$$13, i$$27, ret$$4)
        }
      }return ret$$4
    }
    this.keyMods = {ctrl:1, alt:2, option:2, shift:4, meta:8, command:8};
    this.keyNames = {"8":"Backspace", "9":"Tab", "13":"Enter", "27":"Esc", "32":"Space", "33":"PageUp", "34":"PageDown", "35":"End", "36":"Home", "37":"Left", "38":"Up", "39":"Right", "40":"Down", "45":"Insert", "46":"Delete", "107":"+", "112":"F1", "113":"F2", "114":"F3", "115":"F4", "116":"F5", "117":"F6", "118":"F7", "119":"F8", "120":"F9", "121":"F10", "122":"F11", "123":"F12"};
    this.setConfig = function(config$$2) {
      this.config = config$$2 || (useragent$$2.isMac ? default_mac : default_win);
      if(typeof this.config.reverse == "undefined") {
        this.config.reverse = objectReverse.call(this, this.config, "|")
      }
    }
  }).call(KeyBinding.prototype);
  exports$$37.KeyBinding = KeyBinding
});
define("ace/range", ["require", "exports", "module"], function(require$$39, exports$$38) {
  var Range = function(startRow, startColumn, endRow, endColumn) {
    this.start = {row:startRow, column:startColumn};
    this.end = {row:endRow, column:endColumn}
  };
  (function() {
    this.toString = function() {
      return"Range: [" + this.start.row + "/" + this.start.column + "] -> [" + this.end.row + "/" + this.end.column + "]"
    };
    this.contains = function(row$$1, column) {
      return this.compare(row$$1, column) == 0
    };
    this.compare = function(row$$2, column$$1) {
      if(!this.isMultiLine()) {
        if(row$$2 === this.start.row) {
          return column$$1 < this.start.column ? -1 : column$$1 > this.end.column ? 1 : 0
        }
      }if(row$$2 < this.start.row) {
        return-1
      }if(row$$2 > this.end.row) {
        return 1
      }if(this.start.row === row$$2) {
        return column$$1 >= this.start.column ? 0 : -1
      }if(this.end.row === row$$2) {
        return column$$1 <= this.end.column ? 0 : 1
      }return 0
    };
    this.clipRows = function(firstRow, lastRow) {
      if(this.end.row > lastRow) {
        var end$$5 = {row:lastRow + 1, column:0}
      }if(this.start.row > lastRow) {
        var start$$5 = {row:lastRow + 1, column:0}
      }if(this.start.row < firstRow) {
        start$$5 = {row:firstRow, column:0}
      }if(this.end.row < firstRow) {
        end$$5 = {row:firstRow, column:0}
      }return Range.fromPoints(start$$5 || this.start, end$$5 || this.end)
    };
    this.extend = function(row$$3, column$$2) {
      var cmp = this.compare(row$$3, column$$2);
      if(cmp == 0) {
        return this
      }else {
        if(cmp == -1) {
          var start$$6 = {row:row$$3, column:column$$2}
        }else {
          var end$$6 = {row:row$$3, column:column$$2}
        }
      }return Range.fromPoints(start$$6 || this.start, end$$6 || this.end)
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
    this.toScreenRange = function(doc$$1) {
      return new Range(this.start.row, doc$$1.documentToScreenColumn(this.start.row, this.start.column), this.end.row, doc$$1.documentToScreenColumn(this.end.row, this.end.column))
    }
  }).call(Range.prototype);
  Range.fromPoints = function(start$$7, end$$7) {
    return new Range(start$$7.row, start$$7.column, end$$7.row, end$$7.column)
  };
  exports$$38.Range = Range
});
define("ace/selection", ["require", "exports", "module", "pilot/oop", "pilot/lang", "pilot/event_emitter", "ace/range"], function(require$$40, exports$$39) {
  var oop$$3 = require$$40("pilot/oop");
  var lang$$2 = require$$40("pilot/lang");
  var EventEmitter$$4 = require$$40("pilot/event_emitter").EventEmitter;
  var Range$$1 = require$$40("ace/range").Range;
  var Selection = function(doc$$2) {
    this.doc = doc$$2;
    this.clearSelection();
    this.selectionLead = {row:0, column:0}
  };
  (function() {
    oop$$3.implement(this, EventEmitter$$4);
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
    this.setSelectionAnchor = function(row$$4, column$$3) {
      var anchor = this.$clipPositionToDocument(row$$4, column$$3);
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
      }var cursor$$1 = {row:0, column:0};
      if(cursor$$1.row !== this.selectionLead.row || cursor$$1.column !== this.selectionLead.column) {
        this.selectionLead = cursor$$1;
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
      }var cursor$$2 = this.$clone(this.selectionLead);
      mover.call(this);
      if(cursor$$2.row !== this.selectionLead.row || cursor$$2.column !== this.selectionLead.column) {
        changed = true
      }changed && this._dispatchEvent("changeSelection", {})
    };
    this.selectTo = function(row$$5, column$$4) {
      this.$moveSelection(function() {
        this.moveCursorTo(row$$5, column$$4)
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
      var cursor$$3 = this.selectionLead;
      var column$$5 = cursor$$3.column;
      var range$$1 = this.doc.getWordRange(cursor$$3.row, column$$5);
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
        var doc$$3 = this.doc;
        var tabSize = doc$$3.getTabSize();
        var cursor$$4 = this.selectionLead;
        doc$$3.isTabStop(cursor$$4) && doc$$3.getLine(cursor$$4.row).slice(cursor$$4.column - tabSize, cursor$$4.column).split(" ").length - 1 == tabSize ? this.moveCursorBy(0, -tabSize) : this.moveCursorBy(0, -1)
      }
    };
    this.moveCursorRight = function() {
      if(this.selectionLead.column == this.doc.getLine(this.selectionLead.row).length) {
        this.selectionLead.row < this.doc.getLength() - 1 && this.moveCursorTo(this.selectionLead.row + 1, 0)
      }else {
        var doc$$4 = this.doc;
        var tabSize$$1 = doc$$4.getTabSize();
        var cursor$$5 = this.selectionLead;
        doc$$4.isTabStop(cursor$$5) && doc$$4.getLine(cursor$$5.row).slice(cursor$$5.column, cursor$$5.column + tabSize$$1).split(" ").length - 1 == tabSize$$1 ? this.moveCursorBy(0, tabSize$$1) : this.moveCursorBy(0, 1)
      }
    };
    this.moveCursorLineStart = function() {
      var row$$6 = this.selectionLead.row;
      var column$$6 = this.selectionLead.column;
      var beforeCursor = this.doc.getLine(row$$6).slice(0, column$$6);
      var leadingSpace = beforeCursor.match(/^\s*/);
      if(leadingSpace[0].length == 0) {
        this.moveCursorTo(row$$6, this.doc.getLine(row$$6).match(/^\s*/)[0].length)
      }else {
        leadingSpace[0].length >= column$$6 ? this.moveCursorTo(row$$6, 0) : this.moveCursorTo(row$$6, leadingSpace[0].length)
      }
    };
    this.moveCursorLineEnd = function() {
      this.moveCursorTo(this.selectionLead.row, this.doc.getLine(this.selectionLead.row).length)
    };
    this.moveCursorFileEnd = function() {
      var row$$7 = this.doc.getLength() - 1;
      var column$$7 = this.doc.getLine(row$$7).length;
      this.moveCursorTo(row$$7, column$$7)
    };
    this.moveCursorFileStart = function() {
      this.moveCursorTo(0, 0)
    };
    this.moveCursorWordRight = function() {
      var row$$8 = this.selectionLead.row;
      var column$$8 = this.selectionLead.column;
      var line$$3 = this.doc.getLine(row$$8);
      var rightOfCursor = line$$3.substring(column$$8);
      var match;
      this.doc.nonTokenRe.lastIndex = 0;
      this.doc.tokenRe.lastIndex = 0;
      if(column$$8 == line$$3.length) {
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
      }this.moveCursorTo(row$$8, column$$8)
    };
    this.moveCursorWordLeft = function() {
      var row$$9 = this.selectionLead.row;
      var column$$9 = this.selectionLead.column;
      var line$$4 = this.doc.getLine(row$$9);
      var leftOfCursor = lang$$2.stringReverse(line$$4.substring(0, column$$9));
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
      }this.moveCursorTo(row$$9, column$$9)
    };
    this.moveCursorBy = function(rows, chars) {
      this.moveCursorTo(this.selectionLead.row + rows, this.selectionLead.column + chars)
    };
    this.moveCursorToPosition = function(position$$1) {
      this.moveCursorTo(position$$1.row, position$$1.column)
    };
    this.moveCursorTo = function(row$$10, column$$10) {
      var cursor$$6 = this.$clipPositionToDocument(row$$10, column$$10);
      if(cursor$$6.row !== this.selectionLead.row || cursor$$6.column !== this.selectionLead.column) {
        this.selectionLead = cursor$$6;
        this._dispatchEvent("changeCursor", {data:this.getCursor()})
      }
    };
    this.moveCursorUp = function() {
      this.moveCursorBy(-1, 0)
    };
    this.$clipPositionToDocument = function(row$$11, column$$11) {
      var pos$$1 = {};
      if(row$$11 >= this.doc.getLength()) {
        pos$$1.row = Math.max(0, this.doc.getLength() - 1);
        pos$$1.column = this.doc.getLine(pos$$1.row).length
      }else {
        if(row$$11 < 0) {
          pos$$1.row = 0;
          pos$$1.column = 0
        }else {
          pos$$1.row = row$$11;
          pos$$1.column = Math.min(this.doc.getLine(pos$$1.row).length, Math.max(0, column$$11))
        }
      }return pos$$1
    };
    this.$clone = function(pos$$2) {
      return{row:pos$$2.row, column:pos$$2.column}
    }
  }).call(Selection.prototype);
  exports$$39.Selection = Selection
});
define("ace/tokenizer", ["require", "exports", "module"], function(require$$41, exports$$40) {
  var Tokenizer = function(rules) {
    this.rules = rules;
    this.regExps = {};
    for(var key$$14 in this.rules) {
      var state = this.rules[key$$14];
      var ruleRegExps = [];
      var i$$28 = 0;
      for(;i$$28 < state.length;i$$28++) {
        ruleRegExps.push(state[i$$28].regex)
      }this.regExps[key$$14] = new RegExp("(?:(" + ruleRegExps.join(")|(") + ")|(.))", "g")
    }
  };
  (function() {
    this.getLineTokens = function(line$$5, startState) {
      var currentState = startState;
      var state$$1 = this.rules[currentState];
      var re = this.regExps[currentState];
      re.lastIndex = 0;
      var match$$2;
      var tokens = [];
      var lastIndex = 0;
      var token = {type:null, value:""};
      for(;match$$2 = re.exec(line$$5);) {
        var type$$7 = "text";
        var value$$46 = match$$2[0];
        if(re.lastIndex == lastIndex) {
          throw new Error("tokenizer error");
        }lastIndex = re.lastIndex;
        var i$$29 = 0;
        for(;i$$29 < state$$1.length;i$$29++) {
          if(match$$2[i$$29 + 1]) {
            type$$7 = typeof state$$1[i$$29].token == "function" ? state$$1[i$$29].token(match$$2[0]) : state$$1[i$$29].token;
            if(state$$1[i$$29].next && state$$1[i$$29].next !== currentState) {
              currentState = state$$1[i$$29].next;
              state$$1 = this.rules[currentState];
              lastIndex = re.lastIndex;
              re = this.regExps[currentState];
              re.lastIndex = lastIndex
            }break
          }
        }if(token.type !== type$$7) {
          token.type && tokens.push(token);
          token = {type:type$$7, value:value$$46}
        }else {
          token.value += value$$46
        }
      }token.type && tokens.push(token);
      return{tokens:tokens, state:currentState}
    }
  }).call(Tokenizer.prototype);
  exports$$40.Tokenizer = Tokenizer
});
define("ace/mode/text_highlight_rules", ["require", "exports", "module"], function(require$$42, exports$$41) {
  var TextHighlightRules = function() {
    this.$rules = {start:[{token:"text", regex:".+"}]}
  };
  (function() {
    this.addRules = function(rules$$1, prefix$$1) {
      for(var key$$15 in rules$$1) {
        var state$$2 = rules$$1[key$$15];
        var i$$30 = 0;
        for(;i$$30 < state$$2.length;i$$30++) {
          var rule = state$$2[i$$30];
          rule.next = rule.next ? prefix$$1 + rule.next : prefix$$1 + key$$15
        }this.$rules[prefix$$1 + key$$15] = state$$2
      }
    };
    this.getRules = function() {
      return this.$rules
    }
  }).call(TextHighlightRules.prototype);
  exports$$41.TextHighlightRules = TextHighlightRules
});
define("ace/mode/text", ["require", "exports", "module", "ace/tokenizer", "ace/mode/text_highlight_rules"], function(require$$43, exports$$42) {
  var Tokenizer$$1 = require$$43("ace/tokenizer").Tokenizer;
  var TextHighlightRules$$1 = require$$43("ace/mode/text_highlight_rules").TextHighlightRules;
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
    this.$getIndent = function(line$$8) {
      var match$$3 = line$$8.match(/^(\s+)/);
      if(match$$3) {
        return match$$3[1]
      }return""
    }
  }).call(Mode.prototype);
  exports$$42.Mode = Mode
});
define("ace/document", ["require", "exports", "module", "pilot/oop", "pilot/lang", "pilot/event_emitter", "ace/selection", "ace/mode/text", "ace/range"], function(require$$44, exports$$43) {
  var oop$$4 = require$$44("pilot/oop");
  var lang$$3 = require$$44("pilot/lang");
  var EventEmitter$$5 = require$$44("pilot/event_emitter").EventEmitter;
  var Selection$$1 = require$$44("ace/selection").Selection;
  var TextMode = require$$44("ace/mode/text").Mode;
  var Range$$2 = require$$44("ace/range").Range;
  var Document = function(text$$6, mode$$2) {
    this.modified = true;
    this.lines = [];
    this.selection = new Selection$$1(this);
    this.$breakpoints = [];
    this.listeners = [];
    mode$$2 && this.setMode(mode$$2);
    Array.isArray(text$$6) ? this.$insertLines(0, text$$6) : this.$insert({row:0, column:0}, text$$6)
  };
  (function() {
    oop$$4.implement(this, EventEmitter$$5);
    this.$undoManager = null;
    this.$split = function(text$$7) {
      return text$$7.split(/\r\n|\r|\n/)
    };
    this.setValue = function(text$$8) {
      var args$$68 = [0, this.lines.length];
      args$$68.push.apply(args$$68, this.$split(text$$8));
      this.lines.splice.apply(this.lines, args$$68);
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
      var data$$42 = {firstRow:firstRow$$1, lastRow:lastRow$$2};
      this._dispatchEvent("change", {data:data$$42})
    };
    this.setUndoManager = function(undoManager) {
      this.$undoManager = undoManager;
      this.$deltas = [];
      this.$informUndoManager && this.$informUndoManager.cancel();
      if(undoManager) {
        var self$$3 = this;
        this.$informUndoManager = lang$$3.deferredCall(function() {
          self$$3.$deltas.length > 0 && undoManager.execute({action:"aceupdate", args:[self$$3.$deltas, self$$3]});
          self$$3.$deltas = []
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
      return this.getUseSoftTabs() ? lang$$3.stringRepeat(" ", this.getTabSize()) : "\t"
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
    this.isTabStop = function(position$$2) {
      return this.$useSoftTabs && position$$2.column % this.$tabSize == 0
    };
    this.getBreakpoints = function() {
      return this.$breakpoints
    };
    this.setBreakpoints = function(rows$$1) {
      this.$breakpoints = [];
      var i$$31 = 0;
      for(;i$$31 < rows$$1.length;i$$31++) {
        this.$breakpoints[rows$$1[i$$31]] = true
      }this._dispatchEvent("changeBreakpoint", {})
    };
    this.clearBreakpoints = function() {
      this.$breakpoints = [];
      this._dispatchEvent("changeBreakpoint", {})
    };
    this.setBreakpoint = function(row$$13) {
      this.$breakpoints[row$$13] = true;
      this._dispatchEvent("changeBreakpoint", {})
    };
    this.clearBreakpoint = function(row$$14) {
      delete this.$breakpoints[row$$14];
      this._dispatchEvent("changeBreakpoint", {})
    };
    this.$detectNewLine = function(text$$9) {
      var match$$4 = text$$9.match(/^.*?(\r?\n)/m);
      this.$autoNewLine = match$$4 ? match$$4[1] : "\n"
    };
    this.tokenRe = /^[\w\d]+/g;
    this.nonTokenRe = /^[^\w\d]+/g;
    this.getWordRange = function(row$$15, column$$12) {
      var line$$9 = this.getLine(row$$15);
      var inToken = false;
      if(column$$12 > 0) {
        inToken = !!line$$9.charAt(column$$12 - 1).match(this.tokenRe)
      }inToken || (inToken = !!line$$9.charAt(column$$12).match(this.tokenRe));
      var re$$1 = inToken ? this.tokenRe : this.nonTokenRe;
      var start$$8 = column$$12;
      if(start$$8 > 0) {
        do {
          start$$8--
        }while(start$$8 >= 0 && line$$9.charAt(start$$8).match(re$$1));
        start$$8++
      }var end$$8 = column$$12;
      for(;end$$8 < line$$9.length && line$$9.charAt(end$$8).match(re$$1);) {
        end$$8++
      }return new Range$$2(row$$15, start$$8, row$$15, end$$8)
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
    this.setMode = function(mode$$3) {
      if(this.$mode === mode$$3) {
        return
      }this.$mode = mode$$3;
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
        var i$$32 = 0;
        for(;i$$32 < lines$$2.length;i$$32++) {
          var len$$4 = lines$$2[i$$32].length;
          longestLine = Math.max(longestLine, len$$4);
          lines$$2[i$$32].replace("\t", function(m$$2) {
            len$$4 += tabSize$$3 - 1;
            return m$$2
          });
          longestScreenLine = Math.max(longestScreenLine, len$$4)
        }this.width = longestLine;
        this.screenWidth = longestScreenLine
      }
    };
    this.getLine = function(row$$16) {
      return this.lines[row$$16] || ""
    };
    this.getDisplayLine = function(row$$17) {
      var tab$$2 = (new Array(this.getTabSize() + 1)).join(" ");
      return this.lines[row$$17].replace(/\t/g, tab$$2)
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
    this.findMatchingBracket = function(position$$3) {
      if(position$$3.column == 0) {
        return null
      }var charBeforeCursor = this.getLine(position$$3.row).charAt(position$$3.column - 1);
      if(charBeforeCursor == "") {
        return null
      }var match$$5 = charBeforeCursor.match(/([\(\[\{])|([\)\]\}])/);
      if(!match$$5) {
        return null
      }return match$$5[1] ? this.$findClosingBracket(match$$5[1], position$$3) : this.$findOpeningBracket(match$$5[2], position$$3)
    };
    this.$brackets = {")":"(", "(":")", "]":"[", "[":"]", "{":"}", "}":"{"};
    this.$findOpeningBracket = function(bracket, position$$4) {
      var openBracket = this.$brackets[bracket];
      var column$$13 = position$$4.column - 2;
      var row$$18 = position$$4.row;
      var depth$$1 = 1;
      var line$$10 = this.getLine(row$$18);
      for(;;) {
        for(;column$$13 >= 0;) {
          var ch$$1 = line$$10.charAt(column$$13);
          if(ch$$1 == openBracket) {
            depth$$1 -= 1;
            if(depth$$1 == 0) {
              return{row:row$$18, column:column$$13}
            }
          }else {
            if(ch$$1 == bracket) {
              depth$$1 += 1
            }
          }column$$13 -= 1
        }row$$18 -= 1;
        if(row$$18 < 0) {
          break
        }line$$10 = this.getLine(row$$18);
        column$$13 = line$$10.length - 1
      }return null
    };
    this.$findClosingBracket = function(bracket$$1, position$$5) {
      var closingBracket = this.$brackets[bracket$$1];
      var column$$14 = position$$5.column;
      var row$$19 = position$$5.row;
      var depth$$2 = 1;
      var line$$11 = this.getLine(row$$19);
      var lineCount = this.getLength();
      for(;;) {
        for(;column$$14 < line$$11.length;) {
          var ch$$2 = line$$11.charAt(column$$14);
          if(ch$$2 == closingBracket) {
            depth$$2 -= 1;
            if(depth$$2 == 0) {
              return{row:row$$19, column:column$$14}
            }
          }else {
            if(ch$$2 == bracket$$1) {
              depth$$2 += 1
            }
          }column$$14 += 1
        }row$$19 += 1;
        if(row$$19 >= lineCount) {
          break
        }line$$11 = this.getLine(row$$19);
        column$$14 = 0
      }return null
    };
    this.insert = function(position$$6, text$$10, fromUndo) {
      var end$$9 = this.$insert(position$$6, text$$10, fromUndo);
      this.fireChangeEvent(position$$6.row, position$$6.row == end$$9.row ? position$$6.row : undefined);
      return end$$9
    };
    this.multiRowInsert = function(rows$$2, column$$15, text$$11) {
      var lines$$4 = this.lines;
      var i$$33 = rows$$2.length - 1;
      for(;i$$33 >= 0;i$$33--) {
        var row$$20 = rows$$2[i$$33];
        if(row$$20 >= lines$$4.length) {
          continue
        }var diff$$1 = column$$15 - lines$$4[row$$20].length;
        if(diff$$1 > 0) {
          var padded = lang$$3.stringRepeat(" ", diff$$1) + text$$11;
          var offset = -diff$$1
        }else {
          padded = text$$11;
          offset = 0
        }var end$$10 = this.$insert({row:row$$20, column:column$$15 + offset}, padded, false)
      }if(end$$10) {
        this.fireChangeEvent(rows$$2[0], rows$$2[rows$$2.length - 1] + end$$10.row - rows$$2[0]);
        return{rows:end$$10.row - rows$$2[0], columns:end$$10.column - column$$15}
      }else {
        return{rows:0, columns:0}
      }
    };
    this.$insertLines = function(row$$21, lines$$5, fromUndo$$1) {
      if(lines$$5.length == 0) {
        return
      }var args$$69 = [row$$21, 0];
      args$$69.push.apply(args$$69, lines$$5);
      this.lines.splice.apply(this.lines, args$$69);
      if(!fromUndo$$1 && this.$undoManager) {
        var nl = this.$getNewLineCharacter();
        this.$deltas.push({action:"insertText", range:new Range$$2(row$$21, 0, row$$21 + lines$$5.length, 0), text:lines$$5.join(nl) + nl});
        this.$informUndoManager.schedule()
      }
    };
    this.$insert = function(position$$7, text$$12, fromUndo$$2) {
      if(text$$12.length == 0) {
        return position$$7
      }this.modified = true;
      this.lines.length <= 1 && this.$detectNewLine(text$$12);
      var newLines = this.$split(text$$12);
      if(this.$isNewLine(text$$12)) {
        var line$$12 = this.lines[position$$7.row] || "";
        this.lines[position$$7.row] = line$$12.substring(0, position$$7.column);
        this.lines.splice(position$$7.row + 1, 0, line$$12.substring(position$$7.column));
        var end$$11 = {row:position$$7.row + 1, column:0}
      }else {
        if(newLines.length == 1) {
          line$$12 = this.lines[position$$7.row] || "";
          this.lines[position$$7.row] = line$$12.substring(0, position$$7.column) + text$$12 + line$$12.substring(position$$7.column);
          end$$11 = {row:position$$7.row, column:position$$7.column + text$$12.length}
        }else {
          line$$12 = this.lines[position$$7.row] || "";
          var firstLine = line$$12.substring(0, position$$7.column) + newLines[0];
          var lastLine = newLines[newLines.length - 1] + line$$12.substring(position$$7.column);
          this.lines[position$$7.row] = firstLine;
          this.$insertLines(position$$7.row + 1, [lastLine], true);
          newLines.length > 2 && this.$insertLines(position$$7.row + 1, newLines.slice(1, -1), true);
          end$$11 = {row:position$$7.row + newLines.length - 1, column:newLines[newLines.length - 1].length}
        }
      }if(!fromUndo$$2 && this.$undoManager) {
        this.$deltas.push({action:"insertText", range:Range$$2.fromPoints(position$$7, end$$11), text:text$$12});
        this.$informUndoManager.schedule()
      }return end$$11
    };
    this.$isNewLine = function(text$$13) {
      return text$$13 == "\r\n" || text$$13 == "\r" || text$$13 == "\n"
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
      }var height$$1 = range$$4.end.row - rows$$3[0];
      var i$$34 = rows$$3.length - 1;
      for(;i$$34 >= 0;i$$34--) {
        var row$$22 = rows$$3[i$$34];
        if(row$$22 >= this.lines.length) {
          continue
        }var end$$12 = this.$remove(new Range$$2(row$$22, range$$4.start.column, row$$22 + height$$1, range$$4.end.column), false)
      }if(end$$12) {
        height$$1 < 0 ? this.fireChangeEvent(rows$$3[0] + height$$1, undefined) : this.fireChangeEvent(rows$$3[0], height$$1 == 0 ? rows$$3[rows$$3.length - 1] : undefined)
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
      var row$$23 = this.getLine(firstRow$$3).substring(0, range$$5.start.column) + this.getLine(lastRow$$4).substring(range$$5.end.column);
      row$$23 != "" ? this.lines.splice(firstRow$$3, lastRow$$4 - firstRow$$3 + 1, row$$23) : this.lines.splice(firstRow$$3, lastRow$$4 - firstRow$$3 + 1, "");
      return range$$5.start
    };
    this.undoChanges = function(deltas) {
      this.selection.clearSelection();
      var i$$35 = deltas.length - 1;
      for(;i$$35 >= 0;i$$35--) {
        var delta = deltas[i$$35];
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
      var i$$36 = 0;
      for(;i$$36 < deltas$$1.length;i$$36++) {
        var delta$$1 = deltas$$1[i$$36];
        if(delta$$1.action == "insertText") {
          this.insert(delta$$1.range.start, delta$$1.text, true);
          this.selection.setSelectionRange(delta$$1.range)
        }else {
          this.remove(delta$$1.range, true);
          this.selection.moveCursorToPosition(delta$$1.range.start)
        }
      }
    };
    this.replace = function(range$$6, text$$14) {
      this.$remove(range$$6);
      var end$$13 = text$$14 ? this.$insert(range$$6.start, text$$14) : range$$6.start;
      var lastRemoved = range$$6.end.column == 0 ? range$$6.end.column - 1 : range$$6.end.column;
      this.fireChangeEvent(range$$6.start.row, lastRemoved == end$$13.row ? lastRemoved : undefined);
      return end$$13
    };
    this.indentRows = function(startRow$$2, endRow$$2, indentString) {
      indentString = indentString.replace("\t", this.getTabString());
      var row$$24 = startRow$$2;
      for(;row$$24 <= endRow$$2;row$$24++) {
        this.$insert({row:row$$24, column:0}, indentString)
      }this.fireChangeEvent(startRow$$2, endRow$$2);
      return indentString.length
    };
    this.outdentRows = function(range$$7) {
      var rowRange = range$$7.collapseRows();
      var deleteRange = new Range$$2(0, 0, 0, 0);
      var size = this.getTabSize();
      var i$$37 = rowRange.start.row;
      for(;i$$37 <= rowRange.end.row;++i$$37) {
        var line$$13 = this.getLine(i$$37);
        deleteRange.start.row = i$$37;
        deleteRange.end.row = i$$37;
        var j$$4 = 0;
        for(;j$$4 < size;++j$$4) {
          if(line$$13.charAt(j$$4) != " ") {
            break
          }
        }if(j$$4 < size && line$$13.charAt(j$$4) == "\t") {
          deleteRange.start.column = j$$4;
          deleteRange.end.column = j$$4 + 1
        }else {
          deleteRange.start.column = 0;
          deleteRange.end.column = j$$4
        }if(i$$37 == range$$7.start.row) {
          range$$7.start.column -= deleteRange.end.column - deleteRange.start.column
        }if(i$$37 == range$$7.end.row) {
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
    this.$clipRowToDocument = function(row$$25) {
      return Math.max(0, Math.min(row$$25, this.lines.length - 1))
    };
    this.documentToScreenColumn = function(row$$26, docColumn) {
      var tabSize$$4 = this.getTabSize();
      var screenColumn = 0;
      var remaining$$1 = docColumn;
      var line$$14 = this.getLine(row$$26).split("\t");
      var i$$38 = 0;
      for(;i$$38 < line$$14.length;i$$38++) {
        var len$$5 = line$$14[i$$38].length;
        if(remaining$$1 > len$$5) {
          remaining$$1 -= len$$5 + 1;
          screenColumn += len$$5 + tabSize$$4
        }else {
          screenColumn += remaining$$1;
          break
        }
      }return screenColumn
    };
    this.screenToDocumentColumn = function(row$$27, screenColumn$$1) {
      var tabSize$$5 = this.getTabSize();
      var docColumn$$1 = 0;
      var remaining$$2 = screenColumn$$1;
      var line$$15 = this.getLine(row$$27).split("\t");
      var i$$39 = 0;
      for(;i$$39 < line$$15.length;i$$39++) {
        var len$$6 = line$$15[i$$39].length;
        if(remaining$$2 >= len$$6 + tabSize$$5) {
          remaining$$2 -= len$$6 + tabSize$$5;
          docColumn$$1 += len$$6 + 1
        }else {
          docColumn$$1 += remaining$$2 > len$$6 ? len$$6 : remaining$$2;
          break
        }
      }return docColumn$$1
    }
  }).call(Document.prototype);
  exports$$43.Document = Document
});
define("ace/search", ["require", "exports", "module", "pilot/lang", "pilot/oop", "ace/range"], function(require$$45, exports$$44) {
  var lang$$4 = require$$45("pilot/lang");
  var oop$$5 = require$$45("pilot/oop");
  var Range$$3 = require$$45("ace/range").Range;
  var Search = function() {
    this.$options = {needle:"", backwards:false, wrap:false, caseSensitive:false, wholeWord:false, scope:Search.ALL, regExp:false}
  };
  Search.ALL = 1;
  Search.SELECTION = 2;
  (function() {
    this.set = function(options$$2) {
      oop$$5.mixin(this.$options, options$$2);
      return this
    };
    this.getOptions = function() {
      return lang$$4.copyObject(this.$options)
    };
    this.find = function(doc$$7) {
      if(!this.$options.needle) {
        return null
      }var iterator = this.$options.backwards ? this.$backwardMatchIterator(doc$$7) : this.$forwardMatchIterator(doc$$7);
      var firstRange = null;
      iterator.forEach(function(range$$8) {
        firstRange = range$$8;
        return true
      });
      return firstRange
    };
    this.findAll = function(doc$$8) {
      if(!this.$options.needle) {
        return[]
      }var iterator$$1 = this.$options.backwards ? this.$backwardMatchIterator(doc$$8) : this.$forwardMatchIterator(doc$$8);
      var ranges = [];
      iterator$$1.forEach(function(range$$9) {
        ranges.push(range$$9)
      });
      return ranges
    };
    this.replace = function(input$$5, replacement$$2) {
      var re$$2 = this.$assembleRegExp();
      var match$$6 = re$$2.exec(input$$5);
      return match$$6 && match$$6[0].length == input$$5.length ? this.$options.regExp ? input$$5.replace(re$$2, replacement$$2) : replacement$$2 : null
    };
    this.$forwardMatchIterator = function(doc$$9) {
      var re$$3 = this.$assembleRegExp();
      var self$$4 = this;
      return{forEach:function(callback$$8) {
        self$$4.$forwardLineIterator(doc$$9).forEach(function(line$$16, startIndex, row$$28) {
          if(startIndex) {
            line$$16 = line$$16.substring(startIndex)
          }var matches = [];
          line$$16.replace(re$$3, function(str$$10) {
            var offset$$1 = arguments[arguments.length - 2];
            matches.push({str:str$$10, offset:startIndex + offset$$1});
            return str$$10
          });
          var i$$40 = 0;
          for(;i$$40 < matches.length;i$$40++) {
            var match$$7 = matches[i$$40];
            var range$$10 = self$$4.$rangeFromMatch(row$$28, match$$7.offset, match$$7.str.length);
            if(callback$$8(range$$10)) {
              return true
            }
          }
        })
      }}
    };
    this.$backwardMatchIterator = function(doc$$10) {
      var re$$4 = this.$assembleRegExp();
      var self$$5 = this;
      return{forEach:function(callback$$9) {
        self$$5.$backwardLineIterator(doc$$10).forEach(function(line$$17, startIndex$$1, row$$29) {
          if(startIndex$$1) {
            line$$17 = line$$17.substring(startIndex$$1)
          }var matches$$1 = [];
          line$$17.replace(re$$4, function(str$$11, offset$$2) {
            matches$$1.push({str:str$$11, offset:startIndex$$1 + offset$$2});
            return str$$11
          });
          var i$$41 = matches$$1.length - 1;
          for(;i$$41 >= 0;i$$41--) {
            var match$$8 = matches$$1[i$$41];
            var range$$11 = self$$5.$rangeFromMatch(row$$29, match$$8.offset, match$$8.str.length);
            if(callback$$9(range$$11)) {
              return true
            }
          }
        })
      }}
    };
    this.$rangeFromMatch = function(row$$30, column$$16, length) {
      return new Range$$3(row$$30, column$$16, row$$30, column$$16 + length)
    };
    this.$assembleRegExp = function() {
      var needle$$1 = this.$options.regExp ? this.$options.needle : lang$$4.escapeRegExp(this.$options.needle);
      if(this.$options.wholeWord) {
        needle$$1 = "\\b" + needle$$1 + "\\b"
      }var modifier = "g";
      this.$options.caseSensitive || (modifier += "i");
      var re$$5 = new RegExp(needle$$1, modifier);
      return re$$5
    };
    this.$forwardLineIterator = function(doc$$11) {
      function getLine(row$$31) {
        var line$$18 = doc$$11.getLine(row$$31);
        if(searchSelection && row$$31 == range$$12.end.row) {
          line$$18 = line$$18.substring(0, range$$12.end.column)
        }return line$$18
      }
      var searchSelection = this.$options.scope == Search.SELECTION;
      var range$$12 = doc$$11.getSelection().getRange();
      var start$$9 = doc$$11.getSelection().getCursor();
      var firstRow$$7 = searchSelection ? range$$12.start.row : 0;
      var firstColumn = searchSelection ? range$$12.start.column : 0;
      var lastRow$$8 = searchSelection ? range$$12.end.row : doc$$11.getLength() - 1;
      var wrap = this.$options.wrap;
      return{forEach:function(callback$$10) {
        var row$$32 = start$$9.row;
        var line$$19 = getLine(row$$32);
        var startIndex$$2 = start$$9.column;
        var stop = false;
        for(;!callback$$10(line$$19, startIndex$$2, row$$32);) {
          if(stop) {
            return
          }row$$32++;
          startIndex$$2 = 0;
          if(row$$32 > lastRow$$8) {
            if(wrap) {
              row$$32 = firstRow$$7;
              startIndex$$2 = firstColumn
            }else {
              return
            }
          }if(row$$32 == start$$9.row) {
            stop = true
          }line$$19 = getLine(row$$32)
        }
      }}
    };
    this.$backwardLineIterator = function(doc$$12) {
      var searchSelection$$1 = this.$options.scope == Search.SELECTION;
      var range$$13 = doc$$12.getSelection().getRange();
      var start$$10 = searchSelection$$1 ? range$$13.end : range$$13.start;
      var firstRow$$8 = searchSelection$$1 ? range$$13.start.row : 0;
      var firstColumn$$1 = searchSelection$$1 ? range$$13.start.column : 0;
      var lastRow$$9 = searchSelection$$1 ? range$$13.end.row : doc$$12.getLength() - 1;
      var wrap$$1 = this.$options.wrap;
      return{forEach:function(callback$$11) {
        var row$$33 = start$$10.row;
        var line$$20 = doc$$12.getLine(row$$33).substring(0, start$$10.column);
        var startIndex$$3 = 0;
        var stop$$1 = false;
        for(;!callback$$11(line$$20, startIndex$$3, row$$33);) {
          if(stop$$1) {
            return
          }row$$33--;
          startIndex$$3 = 0;
          if(row$$33 < firstRow$$8) {
            if(wrap$$1) {
              row$$33 = lastRow$$9
            }else {
              return
            }
          }if(row$$33 == start$$10.row) {
            stop$$1 = true
          }line$$20 = doc$$12.getLine(row$$33);
          if(searchSelection$$1) {
            if(row$$33 == firstRow$$8) {
              startIndex$$3 = firstColumn$$1
            }else {
              if(row$$33 == lastRow$$9) {
                line$$20 = line$$20.substring(0, range$$13.end.column)
              }
            }
          }
        }
      }}
    }
  }).call(Search.prototype);
  exports$$44.Search = Search
});
define("ace/background_tokenizer", ["require", "exports", "module", "pilot/oop", "pilot/event_emitter"], function(require$$46, exports$$45) {
  var oop$$6 = require$$46("pilot/oop");
  var EventEmitter$$6 = require$$46("pilot/event_emitter").EventEmitter;
  var BackgroundTokenizer = function(tokenizer, editor$$1) {
    this.running = false;
    this.textLines = [];
    this.lines = [];
    this.currentLine = 0;
    this.tokenizer = tokenizer;
    var self$$6 = this;
    this.$worker = function() {
      if(!self$$6.running) {
        return
      }var workerStart = new Date;
      var startLine = self$$6.currentLine;
      var textLines = self$$6.textLines;
      var processedLines = 0;
      var lastVisibleRow = editor$$1.getLastVisibleRow();
      for(;self$$6.currentLine < textLines.length;) {
        self$$6.lines[self$$6.currentLine] = self$$6.$tokenizeRows(self$$6.currentLine, self$$6.currentLine)[0];
        self$$6.currentLine++;
        processedLines += 1;
        if(processedLines % 5 == 0 && new Date - workerStart > 20) {
          self$$6.fireUpdateEvent(startLine, self$$6.currentLine - 1);
          var timeout$$1 = self$$6.currentLine < lastVisibleRow ? 20 : 100;
          self$$6.running = setTimeout(self$$6.$worker, timeout$$1);
          return
        }
      }self$$6.running = false;
      self$$6.fireUpdateEvent(startLine, textLines.length - 1)
    }
  };
  (function() {
    oop$$6.implement(this, EventEmitter$$6);
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
      var data$$43 = {first:firstRow$$9, last:lastRow$$10};
      this._dispatchEvent("update", {data:data$$43})
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
    this.getState = function(row$$34, callback$$13) {
      callback$$13(this.$tokenizeRows(row$$34, row$$34)[0].state)
    };
    this.$tokenizeRows = function(firstRow$$11, lastRow$$12) {
      var rows$$4 = [];
      var state$$7 = "start";
      var doCache = false;
      if(firstRow$$11 > 0 && this.lines[firstRow$$11 - 1]) {
        state$$7 = this.lines[firstRow$$11 - 1].state;
        doCache = true
      }var row$$35 = firstRow$$11;
      for(;row$$35 <= lastRow$$12;row$$35++) {
        if(this.lines[row$$35]) {
          tokens$$1 = this.lines[row$$35];
          state$$7 = tokens$$1.state;
          rows$$4.push(tokens$$1)
        }else {
          var tokens$$1 = this.tokenizer.getLineTokens(this.textLines[row$$35] || "", state$$7);
          state$$7 = tokens$$1.state;
          rows$$4.push(tokens$$1);
          if(doCache) {
            this.lines[row$$35] = tokens$$1
          }
        }
      }return rows$$4
    }
  }).call(BackgroundTokenizer.prototype);
  exports$$45.BackgroundTokenizer = BackgroundTokenizer
});
define("ace/editor", ["require", "exports", "module", "pilot/oop", "pilot/event", "pilot/lang", "ace/textinput", "ace/keybinding", "ace/document", "ace/search", "ace/background_tokenizer", "ace/range", "pilot/event_emitter"], function(require$$47, exports$$46) {
  var oop$$7 = require$$47("pilot/oop");
  var event$$5 = require$$47("pilot/event");
  var lang$$5 = require$$47("pilot/lang");
  var TextInput$$1 = require$$47("ace/textinput").TextInput;
  var KeyBinding$$1 = require$$47("ace/keybinding").KeyBinding;
  var Document$$1 = require$$47("ace/document").Document;
  var Search$$1 = require$$47("ace/search").Search;
  var BackgroundTokenizer$$1 = require$$47("ace/background_tokenizer").BackgroundTokenizer;
  var Range$$4 = require$$47("ace/range").Range;
  var EventEmitter$$7 = require$$47("pilot/event_emitter").EventEmitter;
  var Editor = function(renderer, doc$$13) {
    var container = renderer.getContainerElement();
    this.container = container;
    this.renderer = renderer;
    this.textInput = new TextInput$$1(container, this);
    this.keyBinding = new KeyBinding$$1(container, this);
    var self$$7 = this;
    event$$5.addListener(container, "mousedown", function(e$$25) {
      setTimeout(function() {
        self$$7.focus()
      });
      return event$$5.preventDefault(e$$25)
    });
    event$$5.addListener(container, "selectstart", function(e$$26) {
      return event$$5.preventDefault(e$$26)
    });
    var mouseTarget = renderer.getMouseEventTarget();
    event$$5.addListener(mouseTarget, "mousedown", this.onMouseDown.bind(this));
    event$$5.addMultiMouseDownListener(mouseTarget, 0, 2, 500, this.onMouseDoubleClick.bind(this));
    event$$5.addMultiMouseDownListener(mouseTarget, 0, 3, 600, this.onMouseTripleClick.bind(this));
    event$$5.addMouseWheelListener(mouseTarget, this.onMouseWheel.bind(this));
    this.$selectionMarker = null;
    this.$highlightLineMarker = null;
    this.$blockScrolling = false;
    this.$search = (new Search$$1).set({wrap:true});
    this.setDocument(doc$$13 || new Document$$1(""));
    this.focus()
  };
  (function() {
    oop$$7.implement(this, EventEmitter$$7);
    this.$forwardEvents = {gutterclick:1, gutterdblclick:1};
    this.$originalAddEventListener = this.addEventListener;
    this.$originalRemoveEventListener = this.removeEventListener;
    this.addEventListener = function(eventName$$3, callback$$14) {
      return this.$forwardEvents[eventName$$3] ? this.renderer.addEventListener(eventName$$3, callback$$14) : this.$originalAddEventListener(eventName$$3, callback$$14)
    };
    this.removeEventListener = function(eventName$$4, callback$$15) {
      return this.$forwardEvents[eventName$$4] ? this.renderer.removeEventListener(eventName$$4, callback$$15) : this.$originalRemoveEventListener(eventName$$4, callback$$15)
    };
    this.setDocument = function(doc$$14) {
      if(this.doc == doc$$14) {
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
      }this.doc = doc$$14;
      this.$onDocumentChange = this.onDocumentChange.bind(this);
      doc$$14.addEventListener("change", this.$onDocumentChange);
      this.renderer.setDocument(doc$$14);
      this.$onDocumentModeChange = this.onDocumentModeChange.bind(this);
      doc$$14.addEventListener("changeMode", this.$onDocumentModeChange);
      this.$onDocumentChangeTabSize = this.renderer.updateText.bind(this.renderer);
      doc$$14.addEventListener("changeTabSize", this.$onDocumentChangeTabSize);
      this.$onDocumentChangeBreakpoint = this.onDocumentChangeBreakpoint.bind(this);
      this.doc.addEventListener("changeBreakpoint", this.$onDocumentChangeBreakpoint);
      this.selection = doc$$14.getSelection();
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
      this.renderer.scrollToRow(doc$$14.getScrollTopRow());
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
      }var self$$8 = this;
      this.$highlightPending = true;
      setTimeout(function() {
        self$$8.$highlightPending = false;
        var pos$$3 = self$$8.doc.findMatchingBracket(self$$8.getCursorPosition());
        if(pos$$3) {
          var range$$14 = new Range$$4(pos$$3.row, pos$$3.column, pos$$3.row, pos$$3.column + 1);
          self$$8.$bracketHighlight = self$$8.renderer.addMarker(range$$14, "ace_bracket")
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
    this.onDocumentChange = function(e$$27) {
      var data$$44 = e$$27.data;
      this.bgTokenizer.start(data$$44.firstRow);
      this.renderer.updateLines(data$$44.firstRow, data$$44.lastRow);
      this.renderer.updateCursor(this.getCursorPosition(), this.$overwrite)
    };
    this.onTokenizerUpdate = function(e$$28) {
      var rows$$5 = e$$28.data;
      this.renderer.updateLines(rows$$5.first, rows$$5.last)
    };
    this.onCursorChange = function(e$$29) {
      this.$highlightBrackets();
      this.renderer.updateCursor(this.getCursorPosition(), this.$overwrite);
      if(!this.$blockScrolling && (!e$$29 || !e$$29.blockScrolling)) {
        this.renderer.scrollCursorIntoView()
      }this.$updateHighlightActiveLine()
    };
    this.$updateHighlightActiveLine = function() {
      this.$highlightLineMarker && this.renderer.removeMarker(this.$highlightLineMarker);
      this.$highlightLineMarker = null;
      if(this.getHighlightActiveLine() && (this.getSelectionStyle() != "line" || !this.selection.isMultiLine())) {
        var cursor$$7 = this.getCursorPosition();
        var range$$15 = new Range$$4(cursor$$7.row, 0, cursor$$7.row + 1, 0);
        this.$highlightLineMarker = this.renderer.addMarker(range$$15, "ace_active_line", "line")
      }
    };
    this.onSelectionChange = function(e$$30) {
      this.$selectionMarker && this.renderer.removeMarker(this.$selectionMarker);
      this.$selectionMarker = null;
      if(!this.selection.isEmpty()) {
        var range$$16 = this.selection.getRange();
        var style$$4 = this.getSelectionStyle();
        this.$selectionMarker = this.renderer.addMarker(range$$16, "ace_selection", style$$4)
      }this.onCursorChange(e$$30)
    };
    this.onDocumentChangeBreakpoint = function() {
      this.renderer.setBreakpoints(this.doc.getBreakpoints())
    };
    this.onDocumentModeChange = function() {
      var mode$$4 = this.doc.getMode();
      if(this.mode == mode$$4) {
        return
      }this.mode = mode$$4;
      var tokenizer$$2 = mode$$4.getTokenizer();
      if(this.bgTokenizer) {
        this.bgTokenizer.setTokenizer(tokenizer$$2)
      }else {
        var onUpdate = this.onTokenizerUpdate.bind(this);
        this.bgTokenizer = new BackgroundTokenizer$$1(tokenizer$$2, this);
        this.bgTokenizer.addEventListener("update", onUpdate)
      }this.renderer.setTokenizer(this.bgTokenizer)
    };
    this.onMouseDown = function(e$$31) {
      var pageX = event$$5.getDocumentX(e$$31);
      var pageY = event$$5.getDocumentY(e$$31);
      var pos$$4 = this.renderer.screenToTextCoordinates(pageX, pageY);
      pos$$4.row = Math.max(0, Math.min(pos$$4.row, this.doc.getLength() - 1));
      if(event$$5.getButton(e$$31) != 0) {
        this.selection.isEmpty() && this.moveCursorToPosition(pos$$4);
        return
      }if(e$$31.shiftKey) {
        this.selection.selectToPosition(pos$$4)
      }else {
        this.moveCursorToPosition(pos$$4);
        this.$clickSelection || this.selection.clearSelection(pos$$4.row, pos$$4.column)
      }this.renderer.scrollCursorIntoView();
      var self$$9 = this;
      var mousePageX;
      var mousePageY;
      var onMouseSelection = function(e$$32) {
        mousePageX = event$$5.getDocumentX(e$$32);
        mousePageY = event$$5.getDocumentY(e$$32)
      };
      var onMouseSelectionEnd = function() {
        clearInterval(timerId);
        self$$9.$clickSelection = null
      };
      var onSelectionInterval = function() {
        if(mousePageX === undefined || mousePageY === undefined) {
          return
        }var cursor$$8 = self$$9.renderer.screenToTextCoordinates(mousePageX, mousePageY);
        cursor$$8.row = Math.max(0, Math.min(cursor$$8.row, self$$9.doc.getLength() - 1));
        if(self$$9.$clickSelection) {
          if(self$$9.$clickSelection.contains(cursor$$8.row, cursor$$8.column)) {
            self$$9.selection.setSelectionRange(self$$9.$clickSelection)
          }else {
            var anchor$$4 = self$$9.$clickSelection.compare(cursor$$8.row, cursor$$8.column) == -1 ? self$$9.$clickSelection.end : self$$9.$clickSelection.start;
            self$$9.selection.setSelectionAnchor(anchor$$4.row, anchor$$4.column);
            self$$9.selection.selectToPosition(cursor$$8)
          }
        }else {
          self$$9.selection.selectToPosition(cursor$$8)
        }self$$9.renderer.scrollCursorIntoView()
      };
      event$$5.capture(this.container, onMouseSelection, onMouseSelectionEnd);
      var timerId = setInterval(onSelectionInterval, 20);
      return event$$5.preventDefault(e$$31)
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
    this.onMouseWheel = function(e$$35) {
      var speed = this.$scrollSpeed * 2;
      this.renderer.scrollBy(e$$35.wheelX * speed, e$$35.wheelY * speed);
      return event$$5.preventDefault(e$$35)
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
    this.onTextInput = function(text$$15) {
      if(this.$readOnly) {
        return
      }var cursor$$9 = this.getCursorPosition();
      text$$15 = text$$15.replace("\t", this.doc.getTabString());
      if(this.selection.isEmpty()) {
        if(this.$overwrite) {
          var range$$17 = new Range$$4.fromPoints(cursor$$9, cursor$$9);
          range$$17.end.column += text$$15.length;
          this.doc.remove(range$$17)
        }
      }else {
        cursor$$9 = this.doc.remove(this.getSelectionRange());
        this.clearSelection()
      }this.clearSelection();
      var _self$$1 = this;
      this.bgTokenizer.getState(cursor$$9.row, function(lineState) {
        var shouldOutdent = _self$$1.mode.checkOutdent(lineState, _self$$1.doc.getLine(cursor$$9.row), text$$15);
        var line$$21 = _self$$1.doc.getLine(cursor$$9.row);
        var lineIndent = _self$$1.mode.getNextLineIndent(lineState, line$$21.slice(0, cursor$$9.column), _self$$1.doc.getTabString());
        var end$$14 = _self$$1.doc.insert(cursor$$9, text$$15);
        _self$$1.bgTokenizer.getState(cursor$$9.row, function(lineState$$1) {
          if(cursor$$9.row !== end$$14.row) {
            var size$$1 = _self$$1.doc.getTabSize();
            var minIndent = Number.MAX_VALUE;
            var row$$36 = cursor$$9.row + 1;
            for(;row$$36 <= end$$14.row;++row$$36) {
              var indent = 0;
              line$$21 = _self$$1.doc.getLine(row$$36);
              var i$$42 = 0;
              for(;i$$42 < line$$21.length;++i$$42) {
                if(line$$21.charAt(i$$42) == "\t") {
                  indent += size$$1
                }else {
                  if(line$$21.charAt(i$$42) == " ") {
                    indent += 1
                  }else {
                    break
                  }
                }
              }if(/[^\s]/.test(line$$21)) {
                minIndent = Math.min(indent, minIndent)
              }
            }row$$36 = cursor$$9.row + 1;
            for(;row$$36 <= end$$14.row;++row$$36) {
              var outdent = minIndent;
              line$$21 = _self$$1.doc.getLine(row$$36);
              i$$42 = 0;
              for(;i$$42 < line$$21.length && outdent > 0;++i$$42) {
                if(line$$21.charAt(i$$42) == "\t") {
                  outdent -= size$$1
                }else {
                  if(line$$21.charAt(i$$42) == " ") {
                    outdent -= 1
                  }
                }
              }_self$$1.doc.replace(new Range$$4(row$$36, 0, row$$36, line$$21.length), line$$21.substr(i$$42))
            }end$$14.column += _self$$1.doc.indentRows(cursor$$9.row + 1, end$$14.row, lineIndent)
          }else {
            if(shouldOutdent) {
              end$$14.column += _self$$1.mode.autoOutdent(lineState$$1, _self$$1.doc, cursor$$9.row)
            }
          }_self$$1.moveCursorToPosition(end$$14);
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
    this.setSelectionStyle = function(style$$5) {
      if(this.$selectionStyle == style$$5) {
        return
      }this.$selectionStyle = style$$5;
      this.onSelectionChange();
      this._dispatchEvent("changeSelectionStyle", {data:style$$5})
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
      }var doc$$15 = this.doc;
      var range$$18 = this.getSelectionRange();
      if(range$$18.start.row < range$$18.end.row || range$$18.start.column < range$$18.end.column) {
        var rows$$6 = this.$getSelectedRows();
        var count$$2 = doc$$15.indentRows(rows$$6.first, rows$$6.last, "\t");
        this.selection.shiftSelection(count$$2)
      }else {
        var indentString$$1;
        if(this.doc.getUseSoftTabs()) {
          var size$$2 = doc$$15.getTabSize();
          var position$$8 = this.getCursorPosition();
          var column$$17 = doc$$15.documentToScreenColumn(position$$8.row, position$$8.column);
          count$$2 = size$$2 - column$$17 % size$$2;
          indentString$$1 = lang$$5.stringRepeat(" ", count$$2)
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
    this.onCompositionUpdate = function(text$$17) {
      this.renderer.setCompositionText(text$$17)
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
    this.isRowVisible = function(row$$37) {
      return row$$37 >= this.getFirstVisibleRow() && row$$37 <= this.getLastVisibleRow()
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
      var row$$38 = this.getPageDownRow() + Math.floor(this.getVisibleRowCount() / 2);
      this.scrollPageDown();
      var selection$$3 = this.getSelection();
      selection$$3.$moveSelection(function() {
        selection$$3.moveCursorTo(row$$38, selection$$3.getSelectionLead().column)
      })
    };
    this.selectPageUp = function() {
      var visibleRows = this.getLastVisibleRow() - this.getFirstVisibleRow();
      var row$$39 = this.getPageUpRow() + Math.round(visibleRows / 2);
      this.scrollPageUp();
      var selection$$4 = this.getSelection();
      selection$$4.$moveSelection(function() {
        selection$$4.moveCursorTo(row$$39, selection$$4.getSelectionLead().column)
      })
    };
    this.gotoPageDown = function() {
      var row$$40 = this.getPageDownRow();
      var column$$18 = Math.min(this.getCursorPosition().column, this.doc.getLine(row$$40).length);
      this.scrollToRow(row$$40);
      this.getSelection().moveCursorTo(row$$40, column$$18)
    };
    this.gotoPageUp = function() {
      var row$$41 = this.getPageUpRow();
      var column$$19 = Math.min(this.getCursorPosition().column, this.doc.getLine(row$$41).length);
      this.scrollToRow(row$$41);
      this.getSelection().moveCursorTo(row$$41, column$$19)
    };
    this.scrollPageDown = function() {
      this.scrollToRow(this.getPageDownRow())
    };
    this.scrollPageUp = function() {
      this.renderer.scrollToRow(this.getPageUpRow())
    };
    this.scrollToRow = function(row$$42) {
      this.renderer.scrollToRow(row$$42)
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
    this.moveCursorTo = function(row$$43, column$$20) {
      this.selection.moveCursorTo(row$$43, column$$20);
      this.$updateDesiredColumn()
    };
    this.moveCursorToPosition = function(pos$$5) {
      this.selection.moveCursorToPosition(pos$$5);
      this.$updateDesiredColumn()
    };
    this.gotoLine = function(lineNumber, row$$44) {
      this.selection.clearSelection();
      this.$blockScrolling = true;
      this.moveCursorTo(lineNumber - 1, row$$44 || 0);
      this.$blockScrolling = false;
      this.isRowVisible(this.getCursorPosition().row) || this.scrollToRow(lineNumber - 1 - Math.floor(this.getVisibleRowCount() / 2))
    };
    this.navigateTo = function(row$$45, column$$21) {
      this.clearSelection();
      this.moveCursorTo(row$$45, column$$21);
      this.$updateDesiredColumn(column$$21)
    };
    this.navigateUp = function() {
      this.selection.clearSelection();
      this.selection.moveCursorBy(-1, 0);
      if(this.$desiredColumn) {
        var cursor$$10 = this.getCursorPosition();
        var column$$22 = this.doc.screenToDocumentColumn(cursor$$10.row, this.$desiredColumn);
        this.selection.moveCursorTo(cursor$$10.row, column$$22)
      }
    };
    this.navigateDown = function() {
      this.selection.clearSelection();
      this.selection.moveCursorBy(1, 0);
      if(this.$desiredColumn) {
        var cursor$$11 = this.getCursorPosition();
        var column$$23 = this.doc.screenToDocumentColumn(cursor$$11.row, this.$desiredColumn);
        this.selection.moveCursorTo(cursor$$11.row, column$$23)
      }
    };
    this.$updateDesiredColumn = function() {
      var cursor$$12 = this.getCursorPosition();
      this.$desiredColumn = this.doc.documentToScreenColumn(cursor$$12.row, cursor$$12.column)
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
    this.replace = function(replacement$$3, options$$3) {
      options$$3 && this.$search.set(options$$3);
      var range$$21 = this.$search.find(this.doc);
      this.$tryReplace(range$$21, replacement$$3);
      range$$21 !== null && this.selection.setSelectionRange(range$$21);
      this.$updateDesiredColumn()
    };
    this.replaceAll = function(replacement$$4, options$$4) {
      options$$4 && this.$search.set(options$$4);
      var ranges$$1 = this.$search.findAll(this.doc);
      if(!ranges$$1.length) {
        return
      }this.clearSelection();
      this.selection.moveCursorTo(0, 0);
      var i$$43 = ranges$$1.length - 1;
      for(;i$$43 >= 0;--i$$43) {
        this.$tryReplace(ranges$$1[i$$43], replacement$$4)
      }ranges$$1[0] !== null && this.selection.setSelectionRange(ranges$$1[0]);
      this.$updateDesiredColumn()
    };
    this.$tryReplace = function(range$$22, replacement$$5) {
      var input$$6 = this.doc.getTextRange(range$$22);
      replacement$$5 = this.$search.replace(input$$6, replacement$$5);
      if(replacement$$5 !== null) {
        range$$22.end = this.doc.replace(range$$22, replacement$$5);
        return range$$22
      }else {
        return null
      }
    };
    this.getLastSearchOptions = function() {
      return this.$search.getOptions()
    };
    this.find = function(needle$$2, options$$5) {
      this.clearSelection();
      options$$5 = options$$5 || {};
      options$$5.needle = needle$$2;
      this.$search.set(options$$5);
      this.$find()
    };
    this.findNext = function(options$$6) {
      options$$6 = options$$6 || {};
      if(typeof options$$6.backwards == "undefined") {
        options$$6.backwards = false
      }this.$search.set(options$$6);
      this.$find()
    };
    this.findPrevious = function(options$$7) {
      options$$7 = options$$7 || {};
      if(typeof options$$7.backwards == "undefined") {
        options$$7.backwards = true
      }this.$search.set(options$$7);
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
  exports$$46.Editor = Editor
});
define("ace/layer/gutter", ["require", "exports", "module", "pilot/dom"], function(require$$48, exports$$47) {
  var dom$$2 = require$$48("pilot/dom");
  var Gutter = function(parentEl) {
    this.element = document.createElement("div");
    this.element.className = "ace_layer ace_gutter-layer";
    parentEl.appendChild(this.element);
    this.$breakpoints = [];
    this.$decorations = []
  };
  (function() {
    this.addGutterDecoration = function(row$$46, className$$1) {
      this.$decorations[row$$46] || (this.$decorations[row$$46] = "");
      this.$decorations[row$$46] += " ace_" + className$$1
    };
    this.removeGutterDecoration = function(row$$47, className$$2) {
      this.$decorations[row$$47] = this.$decorations[row$$47].replace(" ace_" + className$$2, "")
    };
    this.setBreakpoints = function(rows$$10) {
      this.$breakpoints = rows$$10.concat()
    };
    this.update = function(config$$3) {
      this.$config = config$$3;
      var html$$1 = [];
      var i$$44 = config$$3.firstRow;
      for(;i$$44 <= config$$3.lastRow;i$$44++) {
        html$$1.push("<div class='ace_gutter-cell", this.$decorations[i$$44] || "", this.$breakpoints[i$$44] ? " ace_breakpoint" : "", "' style='height:", config$$3.lineHeight, "px;'>", i$$44 + 1, "</div>");
        html$$1.push("</div>")
      }this.element = dom$$2.setInnerHtml(this.element, html$$1.join(""));
      this.element.style.height = config$$3.minHeight + "px"
    }
  }).call(Gutter.prototype);
  exports$$47.Gutter = Gutter
});
define("ace/layer/marker", ["require", "exports", "module", "ace/range", "pilot/dom"], function(require$$49, exports$$48) {
  var Range$$5 = require$$49("ace/range").Range;
  var dom$$3 = require$$49("pilot/dom");
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
    this.addMarker = function(range$$24, clazz, type$$8) {
      var id = this.$markerId++;
      this.markers[id] = {range:range$$24, type:type$$8 || "line", clazz:clazz};
      return id
    };
    this.removeMarker = function(markerId) {
      var marker = this.markers[markerId];
      marker && delete this.markers[markerId]
    };
    this.update = function(config$$4) {
      config$$4 = config$$4 || this.config;
      if(!config$$4) {
        return
      }this.config = config$$4;
      var html$$2 = [];
      for(var key$$16 in this.markers) {
        var marker$$1 = this.markers[key$$16];
        var range$$25 = marker$$1.range.clipRows(config$$4.firstRow, config$$4.lastRow);
        if(range$$25.isEmpty()) {
          continue
        }if(range$$25.isMultiLine()) {
          marker$$1.type == "text" ? this.drawTextMarker(html$$2, range$$25, marker$$1.clazz, config$$4) : this.drawMultiLineMarker(html$$2, range$$25, marker$$1.clazz, config$$4)
        }else {
          this.drawSingleLineMarker(html$$2, range$$25, marker$$1.clazz, config$$4)
        }
      }this.element = dom$$3.setInnerHtml(this.element, html$$2.join(""))
    };
    this.drawTextMarker = function(stringBuilder, range$$26, clazz$$1, layerConfig) {
      var row$$48 = range$$26.start.row;
      var lineRange = new Range$$5(row$$48, range$$26.start.column, row$$48, this.doc.getLine(row$$48).length);
      this.drawSingleLineMarker(stringBuilder, lineRange, clazz$$1, layerConfig, 1);
      row$$48 = range$$26.end.row;
      lineRange = new Range$$5(row$$48, 0, row$$48, range$$26.end.column);
      this.drawSingleLineMarker(stringBuilder, lineRange, clazz$$1, layerConfig);
      row$$48 = range$$26.start.row + 1;
      for(;row$$48 < range$$26.end.row;row$$48++) {
        lineRange.start.row = row$$48;
        lineRange.end.row = row$$48;
        lineRange.end.column = this.doc.getLine(row$$48).length;
        this.drawSingleLineMarker(stringBuilder, lineRange, clazz$$1, layerConfig, 1)
      }
    };
    this.drawMultiLineMarker = function(stringBuilder$$1, range$$27, clazz$$2, layerConfig$$1) {
      range$$27 = range$$27.toScreenRange(this.doc);
      var height$$2 = layerConfig$$1.lineHeight;
      var width$$1 = Math.round(layerConfig$$1.width - range$$27.start.column * layerConfig$$1.characterWidth);
      var top = (range$$27.start.row - layerConfig$$1.firstRow) * layerConfig$$1.lineHeight;
      var left = Math.round(range$$27.start.column * layerConfig$$1.characterWidth);
      stringBuilder$$1.push("<div class='", clazz$$2, "' style='", "height:", height$$2, "px;", "width:", width$$1, "px;", "top:", top, "px;", "left:", left, "px;'></div>");
      top = (range$$27.end.row - layerConfig$$1.firstRow) * layerConfig$$1.lineHeight;
      width$$1 = Math.round(range$$27.end.column * layerConfig$$1.characterWidth);
      stringBuilder$$1.push("<div class='", clazz$$2, "' style='", "height:", height$$2, "px;", "top:", top, "px;", "width:", width$$1, "px;'></div>");
      height$$2 = (range$$27.end.row - range$$27.start.row - 1) * layerConfig$$1.lineHeight;
      if(height$$2 < 0) {
        return
      }top = (range$$27.start.row + 1 - layerConfig$$1.firstRow) * layerConfig$$1.lineHeight;
      stringBuilder$$1.push("<div class='", clazz$$2, "' style='", "height:", height$$2, "px;", "width:", layerConfig$$1.width, "px;", "top:", top, "px;'></div>")
    };
    this.drawSingleLineMarker = function(stringBuilder$$2, range$$28, clazz$$3, layerConfig$$2, extraLength) {
      range$$28 = range$$28.toScreenRange(this.doc);
      var height$$3 = layerConfig$$2.lineHeight;
      var width$$2 = Math.round((range$$28.end.column + (extraLength || 0) - range$$28.start.column) * layerConfig$$2.characterWidth);
      var top$$1 = (range$$28.start.row - layerConfig$$2.firstRow) * layerConfig$$2.lineHeight;
      var left$$1 = Math.round(range$$28.start.column * layerConfig$$2.characterWidth);
      stringBuilder$$2.push("<div class='", clazz$$3, "' style='", "height:", height$$3, "px;", "width:", width$$2, "px;", "top:", top$$1, "px;", "left:", left$$1, "px;'></div>")
    }
  }).call(Marker.prototype);
  exports$$48.Marker = Marker
});
define("ace/layer/text", ["require", "exports", "module", "pilot/oop", "pilot/dom", "pilot/lang", "pilot/event_emitter"], function(require$$50, exports$$49) {
  var oop$$8 = require$$50("pilot/oop");
  var dom$$4 = require$$50("pilot/dom");
  var lang$$6 = require$$50("pilot/lang");
  var EventEmitter$$8 = require$$50("pilot/event_emitter").EventEmitter;
  var Text = function(parentEl$$2) {
    this.element = document.createElement("div");
    this.element.className = "ace_layer ace_text-layer";
    parentEl$$2.appendChild(this.element);
    this.$characterSize = this.$measureSizes();
    this.$pollSizeChanges()
  };
  (function() {
    oop$$8.implement(this, EventEmitter$$8);
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
      var self$$10 = this;
      setInterval(function() {
        var size$$3 = self$$10.$measureSizes();
        if(self$$10.$characterSize.width !== size$$3.width || self$$10.$characterSize.height !== size$$3.height) {
          self$$10.$characterSize = size$$3;
          self$$10._dispatchEvent("changeCharaterSize", {data:size$$3})
        }
      }, 500)
    };
    this.$fontStyles = {fontFamily:1, fontSize:1, fontWeight:1, fontStyle:1, lineHeight:1};
    this.$measureSizes = function() {
      var n$$1 = 1E3;
      if(!this.$measureNode) {
        var measureNode = this.$measureNode = document.createElement("div");
        var style$$6 = measureNode.style;
        style$$6.width = style$$6.height = "auto";
        style$$6.left = style$$6.top = "-1000px";
        style$$6.visibility = "hidden";
        style$$6.position = "absolute";
        style$$6.overflow = "visible";
        style$$6.whiteSpace = "nowrap";
        measureNode.innerHTML = lang$$6.stringRepeat("Xy", n$$1);
        document.body.insertBefore(measureNode, document.body.firstChild)
      }style$$6 = this.$measureNode.style;
      for(var prop$$1 in this.$fontStyles) {
        var value$$47 = dom$$4.computedStyle(this.element, prop$$1);
        style$$6[prop$$1] = value$$47
      }var size$$4 = {height:this.$measureNode.offsetHeight, width:this.$measureNode.offsetWidth / (n$$1 * 2)};
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
        var i$$45 = first;
        for(;i$$45 <= last;i$$45++) {
          var lineElement = lineElements[i$$45 - layerConfig$$3.firstRow];
          if(!lineElement) {
            continue
          }var html$$3 = [];
          _self$$3.$renderLine(html$$3, i$$45, tokens$$2[i$$45 - first].tokens);
          dom$$4.setInnerHtml(lineElement, html$$3.join(""))
        }
      })
    };
    this.scrollLines = function(config$$5) {
      function appendTop(callback$$16) {
        config$$5.firstRow < oldConfig.firstRow ? _self$$4.$renderLinesFragment(config$$5, config$$5.firstRow, oldConfig.firstRow - 1, function(fragment) {
          el$$9.firstChild ? el$$9.insertBefore(fragment, el$$9.firstChild) : el$$9.appendChild(fragment);
          callback$$16()
        }) : callback$$16()
      }
      function appendBottom() {
        config$$5.lastRow > oldConfig.lastRow && _self$$4.$renderLinesFragment(config$$5, oldConfig.lastRow + 1, config$$5.lastRow, function(fragment$$1) {
          el$$9.appendChild(fragment$$1)
        })
      }
      var _self$$4 = this;
      this.$computeTabString();
      var oldConfig = this.config;
      this.config = config$$5;
      if(!oldConfig || oldConfig.lastRow < config$$5.firstRow) {
        return this.update(config$$5)
      }if(config$$5.lastRow < oldConfig.firstRow) {
        return this.update(config$$5)
      }var el$$9 = this.element;
      if(oldConfig.firstRow < config$$5.firstRow) {
        var row$$49 = oldConfig.firstRow;
        for(;row$$49 < config$$5.firstRow;row$$49++) {
          el$$9.removeChild(el$$9.firstChild)
        }
      }if(oldConfig.lastRow > config$$5.lastRow) {
        row$$49 = config$$5.lastRow + 1;
        for(;row$$49 <= oldConfig.lastRow;row$$49++) {
          el$$9.removeChild(el$$9.lastChild)
        }
      }appendTop(appendBottom)
    };
    this.$renderLinesFragment = function(config$$6, firstRow$$18, lastRow$$19, callback$$17) {
      var fragment$$2 = document.createDocumentFragment();
      var _self$$5 = this;
      this.tokenizer.getTokens(firstRow$$18, lastRow$$19, function(tokens$$3) {
        var row$$50 = firstRow$$18;
        for(;row$$50 <= lastRow$$19;row$$50++) {
          var lineEl = document.createElement("div");
          lineEl.className = "ace_line";
          var style$$7 = lineEl.style;
          style$$7.height = _self$$5.$characterSize.height + "px";
          style$$7.width = config$$6.width + "px";
          var html$$4 = [];
          _self$$5.$renderLine(html$$4, row$$50, tokens$$3[row$$50 - firstRow$$18].tokens);
          lineEl.innerHTML = html$$4.join("");
          fragment$$2.appendChild(lineEl)
        }callback$$17(fragment$$2)
      })
    };
    this.update = function(config$$7) {
      this.$computeTabString();
      this.config = config$$7;
      var html$$5 = [];
      var _self$$6 = this;
      this.tokenizer.getTokens(config$$7.firstRow, config$$7.lastRow, function(tokens$$4) {
        var i$$46 = config$$7.firstRow;
        for(;i$$46 <= config$$7.lastRow;i$$46++) {
          html$$5.push("<div class='ace_line' style='height:" + _self$$6.$characterSize.height + "px;", "width:", config$$7.width, "px'>");
          _self$$6.$renderLine(html$$5, i$$46, tokens$$4[i$$46 - config$$7.firstRow].tokens);
          html$$5.push("</div>")
        }_self$$6.element = dom$$4.setInnerHtml(_self$$6.element, html$$5.join(""))
      })
    };
    this.$textToken = {text:true, rparen:true, lparen:true};
    this.$renderLine = function(stringBuilder$$3, row$$51, tokens$$5) {
      var spaceRe = /[\v\f \u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000]/g;
      var spaceReplace = "&nbsp;";
      var i$$47 = 0;
      for(;i$$47 < tokens$$5.length;i$$47++) {
        var token$$1 = tokens$$5[i$$47];
        var output$$2 = token$$1.value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(spaceRe, spaceReplace).replace(/\t/g, this.$tabString);
        if(this.$textToken[token$$1.type]) {
          stringBuilder$$3.push(output$$2)
        }else {
          var classes$$2 = "ace_" + token$$1.type.replace(/\./g, " ace_");
          stringBuilder$$3.push("<span class='", classes$$2, "'>", output$$2, "</span>")
        }
      }if(this.showInvisibles) {
        row$$51 !== this.doc.getLength() - 1 ? stringBuilder$$3.push("<span class='ace_invisible'>" + this.EOL_CHAR + "</span>") : stringBuilder$$3.push("<span class='ace_invisible'>" + this.EOF_CHAR + "</span>")
      }
    }
  }).call(Text.prototype);
  exports$$49.Text = Text
});
define("ace/layer/cursor", ["require", "exports", "module", "pilot/dom"], function(require$$51, exports$$50) {
  var dom$$5 = require$$51("pilot/dom");
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
    this.setCursor = function(position$$9, overwrite$$1) {
      this.position = {row:position$$9.row, column:this.doc.documentToScreenColumn(position$$9.row, position$$9.column)};
      overwrite$$1 ? dom$$5.addCssClass(this.cursor, "ace_overwrite") : dom$$5.removeCssClass(this.cursor, "ace_overwrite")
    };
    this.hideCursor = function() {
      this.isVisible = false;
      this.cursor.parentNode && this.cursor.parentNode.removeChild(this.cursor);
      clearInterval(this.blinkId)
    };
    this.showCursor = function() {
      this.isVisible = true;
      this.element.appendChild(this.cursor);
      var cursor$$13 = this.cursor;
      cursor$$13.style.visibility = "visible";
      this.restartTimer()
    };
    this.restartTimer = function() {
      clearInterval(this.blinkId);
      if(!this.isVisible) {
        return
      }var cursor$$14 = this.cursor;
      this.blinkId = setInterval(function() {
        cursor$$14.style.visibility = "hidden";
        setTimeout(function() {
          cursor$$14.style.visibility = "visible"
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
    this.update = function(config$$8) {
      if(!this.position) {
        return
      }this.config = config$$8;
      var cursorLeft$$1 = Math.round(this.position.column * config$$8.characterWidth);
      var cursorTop$$1 = this.position.row * config$$8.lineHeight;
      this.pixelPos = {left:cursorLeft$$1, top:cursorTop$$1};
      this.cursor.style.left = cursorLeft$$1 + "px";
      this.cursor.style.top = cursorTop$$1 - config$$8.firstRow * config$$8.lineHeight + "px";
      this.cursor.style.width = config$$8.characterWidth + "px";
      this.cursor.style.height = config$$8.lineHeight + "px";
      this.isVisible && this.element.appendChild(this.cursor);
      this.restartTimer()
    }
  }).call(Cursor.prototype);
  exports$$50.Cursor = Cursor
});
define("ace/scrollbar", ["require", "exports", "module", "pilot/oop", "pilot/dom", "pilot/event", "pilot/event_emitter"], function(require$$52, exports$$51) {
  var oop$$9 = require$$52("pilot/oop");
  var dom$$6 = require$$52("pilot/dom");
  var event$$6 = require$$52("pilot/event");
  var EventEmitter$$9 = require$$52("pilot/event_emitter").EventEmitter;
  var ScrollBar = function(parent) {
    this.element = document.createElement("div");
    this.element.className = "ace_sb";
    this.inner = document.createElement("div");
    this.element.appendChild(this.inner);
    parent.appendChild(this.element);
    this.width = dom$$6.scrollbarWidth();
    this.element.style.width = this.width;
    event$$6.addListener(this.element, "scroll", this.onScroll.bind(this))
  };
  (function() {
    oop$$9.implement(this, EventEmitter$$9);
    this.onScroll = function() {
      this._dispatchEvent("scroll", {data:this.element.scrollTop})
    };
    this.getWidth = function() {
      return this.width
    };
    this.setHeight = function(height$$4) {
      this.element.style.height = Math.max(0, height$$4 - this.width) + "px"
    };
    this.setInnerHeight = function(height$$5) {
      this.inner.style.height = height$$5 + "px"
    };
    this.setScrollTop = function(scrollTop$$1) {
      this.element.scrollTop = scrollTop$$1
    }
  }).call(ScrollBar.prototype);
  exports$$51.ScrollBar = ScrollBar
});
define("ace/renderloop", ["require", "exports", "module", "pilot/event"], function(require$$53, exports$$52) {
  var event$$7 = require$$53("pilot/event");
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
          event$$7.addListener(window, "message", function(e$$36) {
            if(e$$36.source == window && _self$$8.callback && e$$36.data == _self$$8.messageName) {
              event$$7.stopPropagation(e$$36);
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
  exports$$52.RenderLoop = RenderLoop
});
define("ace/virtual_renderer", ["require", "exports", "module", "pilot/oop", "pilot/dom", "pilot/event", "ace/layer/gutter", "ace/layer/marker", "ace/layer/text", "ace/layer/cursor", "ace/scrollbar", "ace/renderloop", "pilot/event_emitter", 'text!ace/css/editor.css!.ace_editor {\n  position: absolute;\n  overflow: hidden;\n\n  font-family: "Menlo", "Monaco", "Courier New", monospace;\n  font-size: 12px;  \n}\n\n.ace_scroller {\n  position: absolute;\n  overflow-x: scroll;\n  overflow-y: hidden;     \n}\n\n.ace_gutter {\n  position: absolute;\n  overflow-x: hidden;\n  overflow-y: hidden;\n  height: 100%;\n}\n\n.ace_editor .ace_sb {\n  position: absolute;\n  overflow-x: hidden;\n  overflow-y: scroll;\n  right: 0;\n}\n\n.ace_editor .ace_sb div {\n  position: absolute;\n  width: 1px;\n  left: 0px;\n}\n\n.ace_editor .ace_printMargin {\n  position: absolute;\n  height: 100%;\n}\n\n.ace_layer {\n  z-index: 0;\n  position: absolute;\n  overflow: hidden;  \n  white-space: nowrap;\n  height: 100%;\n}\n\n.ace_text-layer {\n  font-family: Monaco, "Courier New", monospace;\n  color: black;\n}\n\n.ace_cursor-layer {\n  cursor: text;\n}\n\n.ace_cursor {\n  z-index: 3;\n  position: absolute;\n}\n\n.ace_line {\n  white-space: nowrap;\n}\n\n.ace_marker-layer {\n}\n\n.ace_marker-layer .ace_step {\n  position: absolute;\n  z-index: 2;\n}\n\n.ace_marker-layer .ace_selection {\n  position: absolute;\n  z-index: 3;\n}\n\n.ace_marker-layer .ace_bracket {\n  position: absolute;\n  z-index: 4;\n}\n\n.ace_marker-layer .ace_active_line {\n  position: absolute;\n  z-index: 1;\n}'], 
function(require$$54, exports$$53) {
  var oop$$10 = require$$54("pilot/oop");
  var dom$$7 = require$$54("pilot/dom");
  var event$$8 = require$$54("pilot/event");
  var GutterLayer = require$$54("ace/layer/gutter").Gutter;
  var MarkerLayer = require$$54("ace/layer/marker").Marker;
  var TextLayer = require$$54("ace/layer/text").Text;
  var CursorLayer = require$$54("ace/layer/cursor").Cursor;
  var ScrollBar$$1 = require$$54("ace/scrollbar").ScrollBar;
  var RenderLoop$$1 = require$$54("ace/renderloop").RenderLoop;
  var EventEmitter$$10 = require$$54("pilot/event_emitter").EventEmitter;
  var editorCss$$1 = require$$54('text!ace/css/editor.css!.ace_editor {\n  position: absolute;\n  overflow: hidden;\n\n  font-family: "Menlo", "Monaco", "Courier New", monospace;\n  font-size: 12px;  \n}\n\n.ace_scroller {\n  position: absolute;\n  overflow-x: scroll;\n  overflow-y: hidden;     \n}\n\n.ace_gutter {\n  position: absolute;\n  overflow-x: hidden;\n  overflow-y: hidden;\n  height: 100%;\n}\n\n.ace_editor .ace_sb {\n  position: absolute;\n  overflow-x: hidden;\n  overflow-y: scroll;\n  right: 0;\n}\n\n.ace_editor .ace_sb div {\n  position: absolute;\n  width: 1px;\n  left: 0px;\n}\n\n.ace_editor .ace_printMargin {\n  position: absolute;\n  height: 100%;\n}\n\n.ace_layer {\n  z-index: 0;\n  position: absolute;\n  overflow: hidden;  \n  white-space: nowrap;\n  height: 100%;\n}\n\n.ace_text-layer {\n  font-family: Monaco, "Courier New", monospace;\n  color: black;\n}\n\n.ace_cursor-layer {\n  cursor: text;\n}\n\n.ace_cursor {\n  z-index: 3;\n  position: absolute;\n}\n\n.ace_line {\n  white-space: nowrap;\n}\n\n.ace_marker-layer {\n}\n\n.ace_marker-layer .ace_step {\n  position: absolute;\n  z-index: 2;\n}\n\n.ace_marker-layer .ace_selection {\n  position: absolute;\n  z-index: 3;\n}\n\n.ace_marker-layer .ace_bracket {\n  position: absolute;\n  z-index: 4;\n}\n\n.ace_marker-layer .ace_active_line {\n  position: absolute;\n  z-index: 1;\n}');
  dom$$7.importCssString(editorCss$$1);
  var VirtualRenderer = function(container$$1, theme$$1) {
    this.container = container$$1;
    dom$$7.addCssClass(this.container, "ace_editor");
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
    var self$$11 = this;
    this.$textLayer.addEventListener("changeCharaterSize", function() {
      self$$11.characterWidth = textLayer.getCharacterWidth();
      self$$11.lineHeight = textLayer.getLineHeight();
      self$$11.$loop.schedule(self$$11.CHANGE_FULL)
    });
    event$$8.addListener(this.$gutter, "click", this.$onGutterClick.bind(this));
    event$$8.addListener(this.$gutter, "dblclick", this.$onGutterClick.bind(this));
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
    oop$$10.implement(this, EventEmitter$$10);
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
      var height$$6 = dom$$7.getInnerHeight(this.container);
      if(this.$size.height != height$$6) {
        this.$size.height = height$$6;
        this.scroller.style.height = height$$6 + "px";
        this.scrollBar.setHeight(height$$6);
        if(this.doc) {
          this.scrollToY(this.getScrollTop());
          changes$$1 |= this.CHANGE_FULL
        }
      }var width$$3 = dom$$7.getInnerWidth(this.container);
      if(this.$size.width != width$$3) {
        this.$size.width = width$$3;
        var gutterWidth = this.showGutter ? this.$gutter.offsetWidth : 0;
        this.scroller.style.left = gutterWidth + "px";
        this.scroller.style.width = Math.max(0, width$$3 - gutterWidth - this.scrollBar.getWidth()) + "px"
      }this.$size.scrollerWidth = this.scroller.clientWidth;
      this.$size.scrollerHeight = this.scroller.clientHeight;
      this.$loop.schedule(changes$$1)
    };
    this.setTokenizer = function(tokenizer$$4) {
      this.$tokenizer = tokenizer$$4;
      this.$textLayer.setTokenizer(tokenizer$$4);
      this.$loop.schedule(this.CHANGE_TEXT)
    };
    this.$onGutterClick = function(e$$37) {
      var pageX$$1 = event$$8.getDocumentX(e$$37);
      var pageY$$1 = event$$8.getDocumentY(e$$37);
      this._dispatchEvent("gutter" + e$$37.type, {row:this.screenToTextCoordinates(pageX$$1, pageY$$1).row, htmlEvent:e$$37})
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
    this.onScroll = function(e$$38) {
      this.scrollToY(e$$38.data)
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
      var i$$48 = 0;
      for(;i$$48 < this.layers.length;i$$48++) {
        var layer = this.layers[i$$48];
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
    this.addMarker = function(range$$29, clazz$$4, type$$9) {
      var id$$1 = this.$markerLayer.addMarker(range$$29, clazz$$4, type$$9);
      this.$loop.schedule(this.CHANGE_MARKER);
      return id$$1
    };
    this.removeMarker = function(markerId$$1) {
      this.$markerLayer.removeMarker(markerId$$1);
      this.$loop.schedule(this.CHANGE_MARKER)
    };
    this.addGutterDecoration = function(row$$52, className$$3) {
      this.$gutterLayer.addGutterDecoration(row$$52, className$$3);
      this.$loop.schedule(this.CHANGE_GUTTER)
    };
    this.removeGutterDecoration = function(row$$53, className$$4) {
      this.$gutterLayer.removeGutterDecoration(row$$53, className$$4);
      this.$loop.schedule(this.CHANGE_GUTTER)
    };
    this.setBreakpoints = function(rows$$11) {
      this.$gutterLayer.setBreakpoints(rows$$11);
      this.$loop.schedule(this.CHANGE_GUTTER)
    };
    this.updateCursor = function(position$$10, overwrite$$2) {
      this.$cursorLayer.setCursor(position$$10, overwrite$$2);
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
    this.scrollToRow = function(row$$54) {
      this.scrollToY(row$$54 * this.lineHeight)
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
      var row$$55 = Math.floor((pageY$$2 + this.scrollTop - canvasPos.top) / this.lineHeight);
      return{row:row$$55, column:this.doc.screenToDocumentColumn(Math.max(0, Math.min(row$$55, this.doc.getLength() - 1)), col)}
    };
    this.textToScreenCoordinates = function(row$$56, column$$24) {
      var canvasPos$$1 = this.scroller.getBoundingClientRect();
      var x$$1 = this.$padding + Math.round(this.doc.documentToScreenColumn(row$$56, column$$24) * this.characterWidth);
      var y = row$$56 * this.lineHeight;
      return{pageX:canvasPos$$1.left + x$$1 - this.getScrollLeft(), pageY:canvasPos$$1.top + y - this.getScrollTop()}
    };
    this.visualizeFocus = function() {
      dom$$7.addCssClass(this.container, "ace_focus")
    };
    this.visualizeBlur = function() {
      dom$$7.removeCssClass(this.container, "ace_focus")
    };
    this.showComposition = function() {
    };
    this.setCompositionText = function() {
    };
    this.hideComposition = function() {
    };
    this.setTheme = function(theme$$2) {
      function afterLoad(theme$$3) {
        _self$$9.$theme && dom$$7.removeCssClass(_self$$9.container, _self$$9.$theme);
        _self$$9.$theme = theme$$3 ? theme$$3.cssClass : null;
        _self$$9.$theme && dom$$7.addCssClass(_self$$9.container, _self$$9.$theme);
        if(_self$$9.$size) {
          _self$$9.$size.width = 0;
          _self$$9.onResize()
        }
      }
      var _self$$9 = this;
      if(!theme$$2 || typeof theme$$2 == "string") {
        theme$$2 = theme$$2 || "ace/theme/textmate";
        require$$54([theme$$2], function(theme$$4) {
          afterLoad(theme$$4)
        })
      }else {
        afterLoad(theme$$2)
      }_self$$9 = this
    }
  }).call(VirtualRenderer.prototype);
  exports$$53.VirtualRenderer = VirtualRenderer
});
define("ace/theme/textmate", ["require", "exports", "module", "pilot/dom", "text!ace/theme/tm.css!.ace-tm .ace_editor {\n  border: 2px solid rgb(159, 159, 159);\n}\n\n.ace-tm .ace_editor.ace_focus {\n  border: 2px solid #327fbd;\n}\n\n.ace-tm .ace_gutter {\n  width: 50px;\n  background: #e8e8e8;\n  color: #333;\n  overflow : hidden;\n}\n\n.ace-tm .ace_gutter-layer {\n  width: 100%;\n  text-align: right;\n}\n\n.ace-tm .ace_gutter-layer .ace_gutter-cell {\n  padding-right: 6px;\n}\n\n.ace-tm .ace_editor .ace_printMargin {\n  width: 1px;\n  background: #e8e8e8;\n}\n\n.ace-tm .ace_text-layer {\n  cursor: text;\n}\n\n.ace-tm .ace_cursor {\n  border-left: 2px solid black;\n}\n\n.ace-tm .ace_cursor.ace_overwrite {\n  border-left: 0px;\n  border-bottom: 1px solid black;\n}\n        \n.ace-tm .ace_line .ace_invisible {\n  color: rgb(191, 191, 191);\n}\n\n.ace-tm .ace_line .ace_keyword {\n  color: blue;\n}\n\n.ace-tm .ace_line .ace_constant.ace_buildin {\n  color: rgb(88, 72, 246);\n}\n\n.ace-tm .ace_line .ace_constant.ace_language {\n  color: rgb(88, 92, 246);\n}\n\n.ace-tm .ace_line .ace_constant.ace_library {\n  color: rgb(6, 150, 14);\n}\n\n.ace-tm .ace_line .ace_invalid {\n  background-color: rgb(153, 0, 0);\n  color: white;\n}\n\n.ace-tm .ace_line .ace_support.ace_function {\n  color: rgb(60, 76, 114);\n}\n\n.ace-tm .ace_line .ace_support.ace_constant {\n  color: rgb(6, 150, 14);\n}\n\n.ace-tm .ace_line .ace_support.ace_type,\n.ace-tm .ace_line .ace_support.ace_class {\n  color: rgb(109, 121, 222);\n}\n\n.ace-tm .ace_line .ace_keyword.ace_operator {\n  color: rgb(104, 118, 135);\n}\n\n.ace-tm .ace_line .ace_string {\n  color: rgb(3, 106, 7);\n}\n\n.ace-tm .ace_line .ace_comment {\n  color: rgb(76, 136, 107);\n}\n\n.ace-tm .ace_line .ace_comment.ace_doc {\n  color: rgb(0, 102, 255);\n}\n\n.ace-tm .ace_line .ace_comment.ace_doc.ace_tag {\n  color: rgb(128, 159, 191);\n}\n\n.ace-tm .ace_line .ace_constant.ace_numeric {\n  color: rgb(0, 0, 205);\n}\n\n.ace-tm .ace_line .ace_variable {\n  color: rgb(49, 132, 149);\n}\n\n.ace-tm .ace_line .ace_xml_pe {\n  color: rgb(104, 104, 91);\n}\n\n.ace-tm .ace_marker-layer .ace_selection {\n  background: rgb(181, 213, 255);\n}\n\n.ace-tm .ace_marker-layer .ace_step {\n  background: rgb(252, 255, 0);\n}\n\n.ace-tm .ace_marker-layer .ace_stack {\n  background: rgb(164, 229, 101);\n}\n\n.ace-tm .ace_marker-layer .ace_bracket {\n  margin: -1px 0 0 -1px;\n  border: 1px solid rgb(192, 192, 192);\n}\n\n.ace-tm .ace_marker-layer .ace_active_line {\n  background: rgb(232, 242, 254);\n}\n\n.ace-tm .ace_string.ace_regex {\n  color: rgb(255, 0, 0)   \n}"], 
function(require$$55, exports$$54) {
  var dom$$8 = require$$55("pilot/dom");
  var cssText$$1 = require$$55("text!ace/theme/tm.css!.ace-tm .ace_editor {\n  border: 2px solid rgb(159, 159, 159);\n}\n\n.ace-tm .ace_editor.ace_focus {\n  border: 2px solid #327fbd;\n}\n\n.ace-tm .ace_gutter {\n  width: 50px;\n  background: #e8e8e8;\n  color: #333;\n  overflow : hidden;\n}\n\n.ace-tm .ace_gutter-layer {\n  width: 100%;\n  text-align: right;\n}\n\n.ace-tm .ace_gutter-layer .ace_gutter-cell {\n  padding-right: 6px;\n}\n\n.ace-tm .ace_editor .ace_printMargin {\n  width: 1px;\n  background: #e8e8e8;\n}\n\n.ace-tm .ace_text-layer {\n  cursor: text;\n}\n\n.ace-tm .ace_cursor {\n  border-left: 2px solid black;\n}\n\n.ace-tm .ace_cursor.ace_overwrite {\n  border-left: 0px;\n  border-bottom: 1px solid black;\n}\n        \n.ace-tm .ace_line .ace_invisible {\n  color: rgb(191, 191, 191);\n}\n\n.ace-tm .ace_line .ace_keyword {\n  color: blue;\n}\n\n.ace-tm .ace_line .ace_constant.ace_buildin {\n  color: rgb(88, 72, 246);\n}\n\n.ace-tm .ace_line .ace_constant.ace_language {\n  color: rgb(88, 92, 246);\n}\n\n.ace-tm .ace_line .ace_constant.ace_library {\n  color: rgb(6, 150, 14);\n}\n\n.ace-tm .ace_line .ace_invalid {\n  background-color: rgb(153, 0, 0);\n  color: white;\n}\n\n.ace-tm .ace_line .ace_support.ace_function {\n  color: rgb(60, 76, 114);\n}\n\n.ace-tm .ace_line .ace_support.ace_constant {\n  color: rgb(6, 150, 14);\n}\n\n.ace-tm .ace_line .ace_support.ace_type,\n.ace-tm .ace_line .ace_support.ace_class {\n  color: rgb(109, 121, 222);\n}\n\n.ace-tm .ace_line .ace_keyword.ace_operator {\n  color: rgb(104, 118, 135);\n}\n\n.ace-tm .ace_line .ace_string {\n  color: rgb(3, 106, 7);\n}\n\n.ace-tm .ace_line .ace_comment {\n  color: rgb(76, 136, 107);\n}\n\n.ace-tm .ace_line .ace_comment.ace_doc {\n  color: rgb(0, 102, 255);\n}\n\n.ace-tm .ace_line .ace_comment.ace_doc.ace_tag {\n  color: rgb(128, 159, 191);\n}\n\n.ace-tm .ace_line .ace_constant.ace_numeric {\n  color: rgb(0, 0, 205);\n}\n\n.ace-tm .ace_line .ace_variable {\n  color: rgb(49, 132, 149);\n}\n\n.ace-tm .ace_line .ace_xml_pe {\n  color: rgb(104, 104, 91);\n}\n\n.ace-tm .ace_marker-layer .ace_selection {\n  background: rgb(181, 213, 255);\n}\n\n.ace-tm .ace_marker-layer .ace_step {\n  background: rgb(252, 255, 0);\n}\n\n.ace-tm .ace_marker-layer .ace_stack {\n  background: rgb(164, 229, 101);\n}\n\n.ace-tm .ace_marker-layer .ace_bracket {\n  margin: -1px 0 0 -1px;\n  border: 1px solid rgb(192, 192, 192);\n}\n\n.ace-tm .ace_marker-layer .ace_active_line {\n  background: rgb(232, 242, 254);\n}\n\n.ace-tm .ace_string.ace_regex {\n  color: rgb(255, 0, 0)   \n}");
  dom$$8.importCssString(cssText$$1);
  exports$$54.cssClass = "ace-tm"
});
define("ace/mode/doc_comment_highlight_rules", ["require", "exports", "module", "pilot/oop", "ace/mode/text_highlight_rules"], function(require$$56, exports$$55) {
  var oop$$11 = require$$56("pilot/oop");
  var TextHighlightRules$$2 = require$$56("ace/mode/text_highlight_rules").TextHighlightRules;
  var DocCommentHighlightRules = function() {
    this.$rules = {start:[{token:"comment.doc", regex:"\\*\\/", next:"start"}, {token:"comment.doc.tag", regex:"@[\\w\\d_]+"}, {token:"comment.doc", regex:"s+"}, {token:"comment.doc", regex:"TODO"}, {token:"comment.doc", regex:"[^@\\*]+"}, {token:"comment.doc", regex:"."}]}
  };
  oop$$11.inherits(DocCommentHighlightRules, TextHighlightRules$$2);
  (function() {
    this.getStartRule = function(start$$11) {
      return{token:"comment.doc", regex:"\\/\\*(?=\\*)", next:start$$11}
    }
  }).call(DocCommentHighlightRules.prototype);
  exports$$55.DocCommentHighlightRules = DocCommentHighlightRules
});
define("ace/mode/javascript_highlight_rules", ["require", "exports", "module", "pilot/oop", "pilot/lang", "ace/mode/doc_comment_highlight_rules", "ace/mode/text_highlight_rules"], function(require$$57, exports$$56) {
  var oop$$12 = require$$57("pilot/oop");
  var lang$$7 = require$$57("pilot/lang");
  var DocCommentHighlightRules$$1 = require$$57("ace/mode/doc_comment_highlight_rules").DocCommentHighlightRules;
  var TextHighlightRules$$3 = require$$57("ace/mode/text_highlight_rules").TextHighlightRules;
  JavaScriptHighlightRules = function() {
    var docComment = new DocCommentHighlightRules$$1;
    var keywords = lang$$7.arrayToMap("break|case|catch|continue|default|delete|do|else|finally|for|function|if|in|instanceof|new|return|switch|throw|try|typeof|var|while|with".split("|"));
    var buildinConstants = lang$$7.arrayToMap("null|Infinity|NaN|undefined".split("|"));
    var futureReserved = lang$$7.arrayToMap("class|enum|extends|super|const|export|import|implements|let|private|public|yield|interface|package|protected|static".split("|"));
    this.$rules = {start:[{token:"comment", regex:"\\/\\/.*$"}, docComment.getStartRule("doc-start"), {token:"comment", regex:"\\/\\*", next:"comment"}, {token:"string.regexp", regex:"[/](?:(?:\\[(?:\\\\]|[^\\]])+\\])|(?:\\\\/|[^\\]/]))*[/][gimy]*\\s*(?=[).,;]|$)"}, {token:"string", regex:'["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'}, {token:"string", regex:'["].*\\\\$', next:"qqstring"}, {token:"string", regex:"['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"}, {token:"string", regex:"['].*\\\\$", next:"qstring"}, {token:"constant.numeric", 
    regex:"0[xX][0-9a-fA-F]+\\b"}, {token:"constant.numeric", regex:"[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"}, {token:"constant.language.boolean", regex:"(?:true|false)\\b"}, {token:function(value$$48) {
      return value$$48 == "this" ? "variable.language" : keywords[value$$48] ? "keyword" : buildinConstants[value$$48] ? "constant.language" : futureReserved[value$$48] ? "invalid.illegal" : value$$48 == "debugger" ? "invalid.deprecated" : "identifier"
    }, regex:"[a-zA-Z_$][a-zA-Z0-9_$]*\\b"}, {token:"keyword.operator", regex:"!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|\\b(?:in|instanceof|new|delete|typeof|void)"}, {token:"lparen", regex:"[[({]"}, {token:"rparen", regex:"[\\])}]"}, {token:"text", regex:"\\s+"}], comment:[{token:"comment", regex:".*?\\*\\/", next:"start"}, {token:"comment", regex:".+"}], qqstring:[{token:"string", regex:'(?:(?:\\\\.)|(?:[^"\\\\]))*?"', 
    next:"start"}, {token:"string", regex:".+"}], qstring:[{token:"string", regex:"(?:(?:\\\\.)|(?:[^'\\\\]))*?'", next:"start"}, {token:"string", regex:".+"}]};
    this.addRules(docComment.getRules(), "doc-");
    this.$rules["doc-start"][0].next = "start"
  };
  oop$$12.inherits(JavaScriptHighlightRules, TextHighlightRules$$3);
  exports$$56.JavaScriptHighlightRules = JavaScriptHighlightRules
});
define("ace/mode/matching_brace_outdent", ["require", "exports", "module", "ace/range"], function(require$$58, exports$$57) {
  var Range$$6 = require$$58("ace/range").Range;
  var MatchingBraceOutdent = function() {
  };
  (function() {
    this.checkOutdent = function(line$$22, input$$7) {
      if(!/^\s+$/.test(line$$22)) {
        return false
      }return/^\s*\}/.test(input$$7)
    };
    this.autoOutdent = function(doc$$20, row$$57) {
      var line$$23 = doc$$20.getLine(row$$57);
      var match$$9 = line$$23.match(/^(\s*\})/);
      if(!match$$9) {
        return 0
      }var column$$25 = match$$9[1].length;
      var openBracePos = doc$$20.findMatchingBracket({row:row$$57, column:column$$25});
      if(!openBracePos || openBracePos.row == row$$57) {
        return 0
      }var indent$$1 = this.$getIndent(doc$$20.getLine(openBracePos.row));
      doc$$20.replace(new Range$$6(row$$57, 0, row$$57, column$$25 - 1), indent$$1);
      return indent$$1.length - (column$$25 - 1)
    };
    this.$getIndent = function(line$$24) {
      var match$$10 = line$$24.match(/^(\s+)/);
      if(match$$10) {
        return match$$10[1]
      }return""
    }
  }).call(MatchingBraceOutdent.prototype);
  exports$$57.MatchingBraceOutdent = MatchingBraceOutdent
});
define("ace/mode/javascript", ["require", "exports", "module", "pilot/oop", "ace/mode/text", "ace/tokenizer", "ace/mode/javascript_highlight_rules", "ace/mode/matching_brace_outdent", "ace/range"], function(require$$59, exports$$58) {
  var oop$$13 = require$$59("pilot/oop");
  var TextMode$$1 = require$$59("ace/mode/text").Mode;
  var Tokenizer$$2 = require$$59("ace/tokenizer").Tokenizer;
  var JavaScriptHighlightRules$$1 = require$$59("ace/mode/javascript_highlight_rules").JavaScriptHighlightRules;
  var MatchingBraceOutdent$$1 = require$$59("ace/mode/matching_brace_outdent").MatchingBraceOutdent;
  var Range$$7 = require$$59("ace/range").Range;
  var Mode$$1 = function() {
    this.$tokenizer = new Tokenizer$$2((new JavaScriptHighlightRules$$1).getRules());
    this.$outdent = new MatchingBraceOutdent$$1
  };
  oop$$13.inherits(Mode$$1, TextMode$$1);
  (function() {
    this.toggleCommentLines = function(state$$9, doc$$21, startRow$$4, endRow$$3) {
      var outdent$$1 = true;
      var re$$6 = /^(\s*)\/\//;
      var i$$49 = startRow$$4;
      for(;i$$49 <= endRow$$3;i$$49++) {
        if(!re$$6.test(doc$$21.getLine(i$$49))) {
          outdent$$1 = false;
          break
        }
      }if(outdent$$1) {
        var deleteRange$$1 = new Range$$7(0, 0, 0, 0);
        i$$49 = startRow$$4;
        for(;i$$49 <= endRow$$3;i$$49++) {
          var line$$25 = doc$$21.getLine(i$$49).replace(re$$6, "$1");
          deleteRange$$1.start.row = i$$49;
          deleteRange$$1.end.row = i$$49;
          deleteRange$$1.end.column = line$$25.length + 2;
          doc$$21.replace(deleteRange$$1, line$$25)
        }return-2
      }else {
        return doc$$21.indentRows(startRow$$4, endRow$$3, "//")
      }
    };
    this.getNextLineIndent = function(state$$10, line$$26, tab$$3) {
      var indent$$2 = this.$getIndent(line$$26);
      var tokenizedLine = this.$tokenizer.getLineTokens(line$$26, state$$10);
      var tokens$$6 = tokenizedLine.tokens;
      var endState = tokenizedLine.state;
      if(tokens$$6.length && tokens$$6[tokens$$6.length - 1].type == "comment") {
        return indent$$2
      }if(state$$10 == "start") {
        var match$$11 = line$$26.match(/^.*[\{\(\[]\s*$/);
        if(match$$11) {
          indent$$2 += tab$$3
        }
      }else {
        if(state$$10 == "doc-start") {
          if(endState == "start") {
            return""
          }match$$11 = line$$26.match(/^\s*(\/?)\*/);
          if(match$$11) {
            if(match$$11[1]) {
              indent$$2 += " "
            }indent$$2 += "* "
          }
        }
      }return indent$$2
    };
    this.checkOutdent = function(state$$11, line$$27, input$$8) {
      return this.$outdent.checkOutdent(line$$27, input$$8)
    };
    this.autoOutdent = function(state$$12, doc$$22, row$$58) {
      return this.$outdent.autoOutdent(doc$$22, row$$58)
    }
  }).call(Mode$$1.prototype);
  exports$$58.Mode = Mode$$1
});
define("ace/mode/css_highlight_rules", ["require", "exports", "module", "pilot/oop", "pilot/lang", "ace/mode/text_highlight_rules"], function(require$$60, exports$$59) {
  var oop$$14 = require$$60("pilot/oop");
  var lang$$8 = require$$60("pilot/lang");
  var TextHighlightRules$$4 = require$$60("ace/mode/text_highlight_rules").TextHighlightRules;
  var CssHighlightRules = function() {
    function ic(str$$12) {
      var re$$7 = [];
      var chars$$1 = str$$12.split("");
      var i$$50 = 0;
      for(;i$$50 < chars$$1.length;i$$50++) {
        re$$7.push("[", chars$$1[i$$50].toLowerCase(), chars$$1[i$$50].toUpperCase(), "]")
      }return re$$7.join("")
    }
    var properties = lang$$8.arrayToMap("azimuth|background-attachment|background-color|background-image|background-position|background-repeat|background|border-bottom-color|border-bottom-style|border-bottom-width|border-bottom|border-collapse|border-color|border-left-color|border-left-style|border-left-width|border-left|border-right-color|border-right-style|border-right-width|border-right|border-spacing|border-style|border-top-color|border-top-style|border-top-width|border-top|border-width|border|bottom|caption-side|clear|clip|color|content|counter-increment|counter-reset|cue-after|cue-before|cue|cursor|direction|display|elevation|empty-cells|float|font-family|font-size-adjust|font-size|font-stretch|font-style|font-variant|font-weight|font|height|left|letter-spacing|line-height|list-style-image|list-style-position|list-style-type|list-style|margin-bottom|margin-left|margin-right|margin-top|marker-offset|margin|marks|max-height|max-width|min-height|min-width|-moz-border-radius|opacity|orphans|outline-color|outline-style|outline-width|outline|overflow|overflow-x|overflow-y|padding-bottom|padding-left|padding-right|padding-top|padding|page-break-after|page-break-before|page-break-inside|page|pause-after|pause-before|pause|pitch-range|pitch|play-during|position|quotes|richness|right|size|speak-header|speak-numeral|speak-punctuation|speech-rate|speak|stress|table-layout|text-align|text-decoration|text-indent|text-shadow|text-transform|top|unicode-bidi|vertical-align|visibility|voice-family|volume|white-space|widows|width|word-spacing|z-index".split("|"));
    var functions = lang$$8.arrayToMap("rgb|rgba|url|attr|counter|counters".split("|"));
    var constants = lang$$8.arrayToMap("absolute|all-scroll|always|armenian|auto|baseline|below|bidi-override|block|bold|bolder|both|bottom|break-all|break-word|capitalize|center|char|circle|cjk-ideographic|col-resize|collapse|crosshair|dashed|decimal-leading-zero|decimal|default|disabled|disc|distribute-all-lines|distribute-letter|distribute-space|distribute|dotted|double|e-resize|ellipsis|fixed|georgian|groove|hand|hebrew|help|hidden|hiragana-iroha|hiragana|horizontal|ideograph-alpha|ideograph-numeric|ideograph-parenthesis|ideograph-space|inactive|inherit|inline-block|inline|inset|inside|inter-ideograph|inter-word|italic|justify|katakana-iroha|katakana|keep-all|left|lighter|line-edge|line-through|line|list-item|loose|lower-alpha|lower-greek|lower-latin|lower-roman|lowercase|lr-tb|ltr|medium|middle|move|n-resize|ne-resize|newspaper|no-drop|no-repeat|nw-resize|none|normal|not-allowed|nowrap|oblique|outset|outside|overline|pointer|progress|relative|repeat-x|repeat-y|repeat|right|ridge|row-resize|rtl|s-resize|scroll|se-resize|separate|small-caps|solid|square|static|strict|super|sw-resize|table-footer-group|table-header-group|tb-rl|text-bottom|text-top|text|thick|thin|top|transparent|underline|upper-alpha|upper-latin|upper-roman|uppercase|vertical-ideographic|vertical-text|visible|w-resize|wait|whitespace|zero".split("|"));
    var colors = lang$$8.arrayToMap("aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow".split("|"));
    var numRe = "\\-?(?:(?:[0-9]+)|(?:[0-9]*\\.[0-9]+))";
    this.$rules = {start:[{token:"comment", regex:"\\/\\*", next:"comment"}, {token:"string", regex:'["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'}, {token:"string", regex:"['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"}, {token:"constant.numeric", regex:numRe + ic("em")}, {token:"constant.numeric", regex:numRe + ic("ex")}, {token:"constant.numeric", regex:numRe + ic("px")}, {token:"constant.numeric", regex:numRe + ic("cm")}, {token:"constant.numeric", regex:numRe + ic("mm")}, {token:"constant.numeric", regex:numRe + 
    ic("in")}, {token:"constant.numeric", regex:numRe + ic("pt")}, {token:"constant.numeric", regex:numRe + ic("pc")}, {token:"constant.numeric", regex:numRe + ic("deg")}, {token:"constant.numeric", regex:numRe + ic("rad")}, {token:"constant.numeric", regex:numRe + ic("grad")}, {token:"constant.numeric", regex:numRe + ic("ms")}, {token:"constant.numeric", regex:numRe + ic("s")}, {token:"constant.numeric", regex:numRe + ic("hz")}, {token:"constant.numeric", regex:numRe + ic("khz")}, {token:"constant.numeric", 
    regex:numRe + "%"}, {token:"constant.numeric", regex:numRe}, {token:"constant.numeric", regex:"#[a-fA-F0-9]{6}"}, {token:"constant.numeric", regex:"#[a-fA-F0-9]{3}"}, {token:"lparen", regex:"{"}, {token:"rparen", regex:"}"}, {token:function(value$$49) {
      return properties[value$$49.toLowerCase()] ? "support.type" : functions[value$$49.toLowerCase()] ? "support.function" : constants[value$$49.toLowerCase()] ? "support.constant" : colors[value$$49.toLowerCase()] ? "support.constant.color" : "text"
    }, regex:"\\-?[a-zA-Z_][a-zA-Z0-9_\\-]*"}], comment:[{token:"comment", regex:".*?\\*\\/", next:"start"}, {token:"comment", regex:".+"}]}
  };
  oop$$14.inherits(CssHighlightRules, TextHighlightRules$$4);
  exports$$59.CssHighlightRules = CssHighlightRules
});
define("ace/mode/css", ["require", "exports", "module", "pilot/oop", "ace/mode/text", "ace/tokenizer", "ace/mode/css_highlight_rules", "ace/mode/matching_brace_outdent"], function(require$$61, exports$$60) {
  var oop$$15 = require$$61("pilot/oop");
  var TextMode$$2 = require$$61("ace/mode/text").Mode;
  var Tokenizer$$3 = require$$61("ace/tokenizer").Tokenizer;
  var CssHighlightRules$$1 = require$$61("ace/mode/css_highlight_rules").CssHighlightRules;
  var MatchingBraceOutdent$$2 = require$$61("ace/mode/matching_brace_outdent").MatchingBraceOutdent;
  var Mode$$2 = function() {
    this.$tokenizer = new Tokenizer$$3((new CssHighlightRules$$1).getRules());
    this.$outdent = new MatchingBraceOutdent$$2
  };
  oop$$15.inherits(Mode$$2, TextMode$$2);
  (function() {
    this.getNextLineIndent = function(state$$13, line$$28, tab$$4) {
      var indent$$3 = this.$getIndent(line$$28);
      var tokens$$7 = this.$tokenizer.getLineTokens(line$$28, state$$13).tokens;
      if(tokens$$7.length && tokens$$7[tokens$$7.length - 1].type == "comment") {
        return indent$$3
      }var match$$12 = line$$28.match(/^.*\{\s*$/);
      if(match$$12) {
        indent$$3 += tab$$4
      }return indent$$3
    };
    this.checkOutdent = function(state$$14, line$$29, input$$9) {
      return this.$outdent.checkOutdent(line$$29, input$$9)
    };
    this.autoOutdent = function(state$$15, doc$$23, row$$59) {
      return this.$outdent.autoOutdent(doc$$23, row$$59)
    }
  }).call(Mode$$2.prototype);
  exports$$60.Mode = Mode$$2
});
define("ace/mode/html_highlight_rules", ["require", "exports", "module", "pilot/oop", "ace/mode/css_highlight_rules", "ace/mode/javascript_highlight_rules", "ace/mode/text_highlight_rules"], function(require$$62, exports$$61) {
  var oop$$16 = require$$62("pilot/oop");
  var CssHighlightRules$$2 = require$$62("ace/mode/css_highlight_rules").CssHighlightRules;
  var JavaScriptHighlightRules$$2 = require$$62("ace/mode/javascript_highlight_rules").JavaScriptHighlightRules;
  var TextHighlightRules$$5 = require$$62("ace/mode/text_highlight_rules").TextHighlightRules;
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
  oop$$16.inherits(HtmlHighlightRules, TextHighlightRules$$5);
  exports$$61.HtmlHighlightRules = HtmlHighlightRules
});
define("ace/mode/html", ["require", "exports", "module", "pilot/oop", "ace/mode/text", "ace/mode/javascript", "ace/mode/css", "ace/tokenizer", "ace/mode/html_highlight_rules"], function(require$$63, exports$$62) {
  var oop$$17 = require$$63("pilot/oop");
  var TextMode$$3 = require$$63("ace/mode/text").Mode;
  var JavaScriptMode = require$$63("ace/mode/javascript").Mode;
  var CssMode = require$$63("ace/mode/css").Mode;
  var Tokenizer$$4 = require$$63("ace/tokenizer").Tokenizer;
  var HtmlHighlightRules$$1 = require$$63("ace/mode/html_highlight_rules").HtmlHighlightRules;
  var Mode$$3 = function() {
    this.$tokenizer = new Tokenizer$$4((new HtmlHighlightRules$$1).getRules());
    this.$js = new JavaScriptMode;
    this.$css = new CssMode
  };
  oop$$17.inherits(Mode$$3, TextMode$$3);
  (function() {
    this.toggleCommentLines = function() {
      return this.$delegate("toggleCommentLines", arguments, function() {
        return 0
      })
    };
    this.getNextLineIndent = function(state$$17, line$$30) {
      var self$$12 = this;
      return this.$delegate("getNextLineIndent", arguments, function() {
        return self$$12.$getIndent(line$$30)
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
    this.$delegate = function(method, args$$70, defaultHandler) {
      var state$$20 = args$$70[0];
      var split$$1 = state$$20.split("js-");
      if(!split$$1[0] && split$$1[1]) {
        args$$70[0] = split$$1[1];
        return this.$js[method].apply(this.$js, args$$70)
      }split$$1 = state$$20.split("css-");
      if(!split$$1[0] && split$$1[1]) {
        args$$70[0] = split$$1[1];
        return this.$css[method].apply(this.$css, args$$70)
      }return defaultHandler ? defaultHandler() : undefined
    }
  }).call(Mode$$3.prototype);
  exports$$62.Mode = Mode$$3
});
define("ace/mode/xml_highlight_rules", ["require", "exports", "module", "pilot/oop", "ace/mode/text_highlight_rules"], function(require$$64, exports$$63) {
  var oop$$18 = require$$64("pilot/oop");
  var TextHighlightRules$$6 = require$$64("ace/mode/text_highlight_rules").TextHighlightRules;
  var XmlHighlightRules = function() {
    this.$rules = {start:[{token:"text", regex:"<\\!\\[CDATA\\[", next:"cdata"}, {token:"xml_pe", regex:"<\\?.*?\\?>"}, {token:"comment", regex:"<\\!--", next:"comment"}, {token:"text", regex:"<\\/?", next:"tag"}, {token:"text", regex:"\\s+"}, {token:"text", regex:"[^<]+"}], tag:[{token:"text", regex:">", next:"start"}, {token:"keyword", regex:"[-_a-zA-Z0-9:]+"}, {token:"text", regex:"\\s+"}, {token:"string", regex:'".*?"'}, {token:"string", regex:"'.*?'"}], cdata:[{token:"text", regex:"\\]\\]>", 
    next:"start"}, {token:"text", regex:"\\s+"}, {token:"text", regex:"(?:[^\\]]|\\](?!\\]>))+"}], comment:[{token:"comment", regex:".*?--\>", next:"start"}, {token:"comment", regex:".+"}]}
  };
  oop$$18.inherits(XmlHighlightRules, TextHighlightRules$$6);
  exports$$63.XmlHighlightRules = XmlHighlightRules
});
define("ace/mode/xml", ["require", "exports", "module", "pilot/oop", "ace/mode/text", "ace/tokenizer", "ace/mode/xml_highlight_rules"], function(require$$65, exports$$64) {
  var oop$$19 = require$$65("pilot/oop");
  var TextMode$$4 = require$$65("ace/mode/text").Mode;
  var Tokenizer$$5 = require$$65("ace/tokenizer").Tokenizer;
  var XmlHighlightRules$$1 = require$$65("ace/mode/xml_highlight_rules").XmlHighlightRules;
  var Mode$$4 = function() {
    this.$tokenizer = new Tokenizer$$5((new XmlHighlightRules$$1).getRules())
  };
  oop$$19.inherits(Mode$$4, TextMode$$4);
  (function() {
    this.getNextLineIndent = function(state$$21, line$$32) {
      return this.$getIndent(line$$32)
    }
  }).call(Mode$$4.prototype);
  exports$$64.Mode = Mode$$4
});
define("ace/mode/python_highlight_rules", ["require", "exports", "module", "pilot/oop", "pilot/lang", "./text_highlight_rules"], function(require$$66, exports$$65) {
  var oop$$20 = require$$66("pilot/oop");
  var lang$$9 = require$$66("pilot/lang");
  var TextHighlightRules$$7 = require$$66("./text_highlight_rules").TextHighlightRules;
  PythonHighlightRules = function() {
    var keywords$$1 = lang$$9.arrayToMap("and|as|assert|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|not|or|pass|print|raise|return|try|while|with|yield".split("|"));
    var builtinConstants = lang$$9.arrayToMap("True|False|None|NotImplemented|Ellipsis|__debug__".split("|"));
    var builtinFunctions = lang$$9.arrayToMap("abs|divmod|input|open|staticmethod|all|enumerate|int|ord|str|any|eval|isinstance|pow|sum|basestring|execfile|issubclass|print|super|binfile|iter|property|tuple|bool|filter|len|range|type|bytearray|float|list|raw_input|unichr|callable|format|locals|reduce|unicode|chr|frozenset|long|reload|vars|classmethod|getattr|map|repr|xrange|cmp|globals|max|reversed|zip|compile|hasattr|memoryview|round|__import__|complex|hash|min|set|apply|delattr|help|next|setattr|buffer|dict|hex|object|slice|coerce|dir|id|oct|sorted|intern".split("|"));
    var futureReserved$$1 = lang$$9.arrayToMap("".split("|"));
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
    "|\\d+)[jJ]\\b"}, {token:"constant.numeric", regex:floatNumber}, {token:"constant.numeric", regex:integer + "[lL]\\b"}, {token:"constant.numeric", regex:integer + "\\b"}, {token:function(value$$50) {
      return keywords$$1[value$$50] ? "keyword" : builtinConstants[value$$50] ? "constant.language" : futureReserved$$1[value$$50] ? "invalid.illegal" : builtinFunctions[value$$50] ? "support.function" : value$$50 == "debugger" ? "invalid.deprecated" : "identifier"
    }, regex:"[a-zA-Z_$][a-zA-Z0-9_$]*\\b"}, {token:"keyword.operator", regex:"\\+|\\-|\\*|\\*\\*|\\/|\\/\\/|%|<<|>>|&|\\||\\^|~|<|>|<=|=>|==|!=|<>|="}, {token:"lparen", regex:"[\\[\\(\\{]"}, {token:"rparen", regex:"[\\]\\)\\}]"}, {token:"text", regex:"\\s+"}], qqstring:[{token:"string", regex:'(?:^"{3})*?"{3}', next:"start"}, {token:"string", regex:".+"}], qstring:[{token:"string", regex:"(?:^'{3})*?'{3}", next:"start"}, {token:"string", regex:".+"}]}
  };
  oop$$20.inherits(PythonHighlightRules, TextHighlightRules$$7);
  exports$$65.PythonHighlightRules = PythonHighlightRules
});
define("ace/mode/python", ["require", "exports", "module", "pilot/oop", "./text", "../tokenizer", "./python_highlight_rules", "./matching_brace_outdent", "../range"], function(require$$67, exports$$66) {
  var oop$$21 = require$$67("pilot/oop");
  var TextMode$$5 = require$$67("./text").Mode;
  var Tokenizer$$6 = require$$67("../tokenizer").Tokenizer;
  var PythonHighlightRules$$1 = require$$67("./python_highlight_rules").PythonHighlightRules;
  var MatchingBraceOutdent$$3 = require$$67("./matching_brace_outdent").MatchingBraceOutdent;
  var Range$$8 = require$$67("../range").Range;
  var Mode$$5 = function() {
    this.$tokenizer = new Tokenizer$$6((new PythonHighlightRules$$1).getRules());
    this.$outdent = new MatchingBraceOutdent$$3
  };
  oop$$21.inherits(Mode$$5, TextMode$$5);
  (function() {
    this.toggleCommentLines = function(state$$22, doc$$26, startRow$$6, endRow$$5) {
      var outdent$$2 = true;
      var re$$8 = /^(\s*)#/;
      var i$$51 = startRow$$6;
      for(;i$$51 <= endRow$$5;i$$51++) {
        if(!re$$8.test(doc$$26.getLine(i$$51))) {
          outdent$$2 = false;
          break
        }
      }if(outdent$$2) {
        var deleteRange$$2 = new Range$$8(0, 0, 0, 0);
        i$$51 = startRow$$6;
        for(;i$$51 <= endRow$$5;i$$51++) {
          var line$$33 = doc$$26.getLine(i$$51).replace(re$$8, "$1");
          deleteRange$$2.start.row = i$$51;
          deleteRange$$2.end.row = i$$51;
          deleteRange$$2.end.column = line$$33.length + 2;
          doc$$26.replace(deleteRange$$2, line$$33)
        }return-2
      }else {
        return doc$$26.indentRows(startRow$$6, endRow$$5, "#")
      }
    };
    this.getNextLineIndent = function(state$$23, line$$34, tab$$7) {
      var indent$$4 = this.$getIndent(line$$34);
      var tokenizedLine$$1 = this.$tokenizer.getLineTokens(line$$34, state$$23);
      var tokens$$8 = tokenizedLine$$1.tokens;
      if(tokens$$8.length && tokens$$8[tokens$$8.length - 1].type == "comment") {
        return indent$$4
      }if(state$$23 == "start") {
        var match$$13 = line$$34.match(/^.*[\{\(\[\:]\s*$/);
        if(match$$13) {
          indent$$4 += tab$$7
        }
      }return indent$$4
    };
    this.checkOutdent = function(state$$24, line$$35, input$$11) {
      return this.$outdent.checkOutdent(line$$35, input$$11)
    };
    this.autoOutdent = function(state$$25, doc$$27, row$$61) {
      return this.$outdent.autoOutdent(doc$$27, row$$61)
    }
  }).call(Mode$$5.prototype);
  exports$$66.Mode = Mode$$5
});
define("ace/mode/php_highlight_rules", ["require", "exports", "module", "pilot/oop", "pilot/lang", "ace/mode/doc_comment_highlight_rules", "ace/mode/text_highlight_rules"], function(require$$68, exports$$67) {
  var oop$$22 = require$$68("pilot/oop");
  var lang$$10 = require$$68("pilot/lang");
  var DocCommentHighlightRules$$2 = require$$68("ace/mode/doc_comment_highlight_rules").DocCommentHighlightRules;
  var TextHighlightRules$$8 = require$$68("ace/mode/text_highlight_rules").TextHighlightRules;
  PhpHighlightRules = function() {
    var docComment$$1 = new DocCommentHighlightRules$$2;
    var builtinFunctions$$1 = lang$$10.arrayToMap("abs|acos|acosh|addcslashes|addslashes|aggregate|aggregate_info|aggregate_methods|aggregate_methods_by_list|aggregate_methods_by_regexp|aggregate_properties|aggregate_properties_by_list|aggregate_properties_by_regexp|aggregation_info|apache_child_terminate|apache_get_modules|apache_get_version|apache_getenv|apache_lookup_uri|apache_note|apache_request_headers|apache_response_headers|apache_setenv|array|array_change_key_case|array_chunk|array_combine|array_count_values|array_diff|array_diff_assoc|array_diff_uassoc|array_fill|array_filter|array_flip|array_intersect|array_intersect_assoc|array_key_exists|array_keys|array_map|array_merge|array_merge_recursive|array_multisort|array_pad|array_pop|array_push|array_rand|array_reduce|array_reverse|array_search|array_shift|array_slice|array_splice|array_sum|array_udiff|array_udiff_assoc|array_udiff_uassoc|array_unique|array_unshift|array_values|array_walk|arsort|ascii2ebcdic|asin|asinh|asort|aspell_check|aspell_check_raw|aspell_new|aspell_suggest|assert|assert_options|atan|atan2|atanh|base64_decode|base64_encode|base_convert|basename|bcadd|bccomp|bcdiv|bcmod|bcmul|bcpow|bcpowmod|bcscale|bcsqrt|bcsub|bin2hex|bind_textdomain_codeset|bindec|bindtextdomain|bzclose|bzcompress|bzdecompress|bzerrno|bzerror|bzerrstr|bzflush|bzopen|bzread|bzwrite|cal_days_in_month|cal_from_jd|cal_info|cal_to_jd|call_user_func|call_user_func_array|call_user_method|call_user_method_array|ccvs_add|ccvs_auth|ccvs_command|ccvs_count|ccvs_delete|ccvs_done|ccvs_init|ccvs_lookup|ccvs_new|ccvs_report|ccvs_return|ccvs_reverse|ccvs_sale|ccvs_status|ccvs_textvalue|ccvs_void|ceil|chdir|checkdate|checkdnsrr|chgrp|chmod|chop|chown|chr|chroot|chunk_split|class_exists|clearstatcache|closedir|closelog|com|com_addref|com_get|com_invoke|com_isenum|com_load|com_load_typelib|com_propget|com_propput|com_propset|com_release|com_set|compact|connection_aborted|connection_status|connection_timeout|constant|convert_cyr_string|copy|cos|cosh|count|count_chars|cpdf_add_annotation|cpdf_add_outline|cpdf_arc|cpdf_begin_text|cpdf_circle|cpdf_clip|cpdf_close|cpdf_closepath|cpdf_closepath_fill_stroke|cpdf_closepath_stroke|cpdf_continue_text|cpdf_curveto|cpdf_end_text|cpdf_fill|cpdf_fill_stroke|cpdf_finalize|cpdf_finalize_page|cpdf_global_set_document_limits|cpdf_import_jpeg|cpdf_lineto|cpdf_moveto|cpdf_newpath|cpdf_open|cpdf_output_buffer|cpdf_page_init|cpdf_place_inline_image|cpdf_rect|cpdf_restore|cpdf_rlineto|cpdf_rmoveto|cpdf_rotate|cpdf_rotate_text|cpdf_save|cpdf_save_to_file|cpdf_scale|cpdf_set_action_url|cpdf_set_char_spacing|cpdf_set_creator|cpdf_set_current_page|cpdf_set_font|cpdf_set_font_directories|cpdf_set_font_map_file|cpdf_set_horiz_scaling|cpdf_set_keywords|cpdf_set_leading|cpdf_set_page_animation|cpdf_set_subject|cpdf_set_text_matrix|cpdf_set_text_pos|cpdf_set_text_rendering|cpdf_set_text_rise|cpdf_set_title|cpdf_set_viewer_preferences|cpdf_set_word_spacing|cpdf_setdash|cpdf_setflat|cpdf_setgray|cpdf_setgray_fill|cpdf_setgray_stroke|cpdf_setlinecap|cpdf_setlinejoin|cpdf_setlinewidth|cpdf_setmiterlimit|cpdf_setrgbcolor|cpdf_setrgbcolor_fill|cpdf_setrgbcolor_stroke|cpdf_show|cpdf_show_xy|cpdf_stringwidth|cpdf_stroke|cpdf_text|cpdf_translate|crack_check|crack_closedict|crack_getlastmessage|crack_opendict|crc32|create_function|crypt|ctype_alnum|ctype_alpha|ctype_cntrl|ctype_digit|ctype_graph|ctype_lower|ctype_print|ctype_punct|ctype_space|ctype_upper|ctype_xdigit|curl_close|curl_errno|curl_error|curl_exec|curl_getinfo|curl_init|curl_multi_add_handle|curl_multi_close|curl_multi_exec|curl_multi_getcontent|curl_multi_info_read|curl_multi_init|curl_multi_remove_handle|curl_multi_select|curl_setopt|curl_version|current|cybercash_base64_decode|cybercash_base64_encode|cybercash_decr|cybercash_encr|cyrus_authenticate|cyrus_bind|cyrus_close|cyrus_connect|cyrus_query|cyrus_unbind|date|dba_close|dba_delete|dba_exists|dba_fetch|dba_firstkey|dba_handlers|dba_insert|dba_key_split|dba_list|dba_nextkey|dba_open|dba_optimize|dba_popen|dba_replace|dba_sync|dbase_add_record|dbase_close|dbase_create|dbase_delete_record|dbase_get_header_info|dbase_get_record|dbase_get_record_with_names|dbase_numfields|dbase_numrecords|dbase_open|dbase_pack|dbase_replace_record|dblist|dbmclose|dbmdelete|dbmexists|dbmfetch|dbmfirstkey|dbminsert|dbmnextkey|dbmopen|dbmreplace|dbplus_add|dbplus_aql|dbplus_chdir|dbplus_close|dbplus_curr|dbplus_errcode|dbplus_errno|dbplus_find|dbplus_first|dbplus_flush|dbplus_freealllocks|dbplus_freelock|dbplus_freerlocks|dbplus_getlock|dbplus_getunique|dbplus_info|dbplus_last|dbplus_lockrel|dbplus_next|dbplus_open|dbplus_prev|dbplus_rchperm|dbplus_rcreate|dbplus_rcrtexact|dbplus_rcrtlike|dbplus_resolve|dbplus_restorepos|dbplus_rkeys|dbplus_ropen|dbplus_rquery|dbplus_rrename|dbplus_rsecindex|dbplus_runlink|dbplus_rzap|dbplus_savepos|dbplus_setindex|dbplus_setindexbynumber|dbplus_sql|dbplus_tcl|dbplus_tremove|dbplus_undo|dbplus_undoprepare|dbplus_unlockrel|dbplus_unselect|dbplus_update|dbplus_xlockrel|dbplus_xunlockrel|dbx_close|dbx_compare|dbx_connect|dbx_error|dbx_escape_string|dbx_fetch_row|dbx_query|dbx_sort|dcgettext|dcngettext|deaggregate|debug_backtrace|debug_print_backtrace|debugger_off|debugger_on|decbin|dechex|decoct|define|define_syslog_variables|defined|deg2rad|delete|dgettext|die|dio_close|dio_fcntl|dio_open|dio_read|dio_seek|dio_stat|dio_tcsetattr|dio_truncate|dio_write|dir|dirname|disk_free_space|disk_total_space|diskfreespace|dl|dngettext|dns_check_record|dns_get_mx|dns_get_record|domxml_new_doc|domxml_open_file|domxml_open_mem|domxml_version|domxml_xmltree|domxml_xslt_stylesheet|domxml_xslt_stylesheet_doc|domxml_xslt_stylesheet_file|dotnet_load|doubleval|each|easter_date|easter_days|ebcdic2ascii|echo|empty|end|ereg|ereg_replace|eregi|eregi_replace|error_log|error_reporting|escapeshellarg|escapeshellcmd|eval|exec|exif_imagetype|exif_read_data|exif_thumbnail|exit|exp|explode|expm1|extension_loaded|extract|ezmlm_hash|fam_cancel_monitor|fam_close|fam_monitor_collection|fam_monitor_directory|fam_monitor_file|fam_next_event|fam_open|fam_pending|fam_resume_monitor|fam_suspend_monitor|fbsql_affected_rows|fbsql_autocommit|fbsql_blob_size|fbsql_change_user|fbsql_clob_size|fbsql_close|fbsql_commit|fbsql_connect|fbsql_create_blob|fbsql_create_clob|fbsql_create_db|fbsql_data_seek|fbsql_database|fbsql_database_password|fbsql_db_query|fbsql_db_status|fbsql_drop_db|fbsql_errno|fbsql_error|fbsql_fetch_array|fbsql_fetch_assoc|fbsql_fetch_field|fbsql_fetch_lengths|fbsql_fetch_object|fbsql_fetch_row|fbsql_field_flags|fbsql_field_len|fbsql_field_name|fbsql_field_seek|fbsql_field_table|fbsql_field_type|fbsql_free_result|fbsql_get_autostart_info|fbsql_hostname|fbsql_insert_id|fbsql_list_dbs|fbsql_list_fields|fbsql_list_tables|fbsql_next_result|fbsql_num_fields|fbsql_num_rows|fbsql_password|fbsql_pconnect|fbsql_query|fbsql_read_blob|fbsql_read_clob|fbsql_result|fbsql_rollback|fbsql_select_db|fbsql_set_lob_mode|fbsql_set_password|fbsql_set_transaction|fbsql_start_db|fbsql_stop_db|fbsql_tablename|fbsql_username|fbsql_warnings|fclose|fdf_add_doc_javascript|fdf_add_template|fdf_close|fdf_create|fdf_enum_values|fdf_errno|fdf_error|fdf_get_ap|fdf_get_attachment|fdf_get_encoding|fdf_get_file|fdf_get_flags|fdf_get_opt|fdf_get_status|fdf_get_value|fdf_get_version|fdf_header|fdf_next_field_name|fdf_open|fdf_open_string|fdf_remove_item|fdf_save|fdf_save_string|fdf_set_ap|fdf_set_encoding|fdf_set_file|fdf_set_flags|fdf_set_javascript_action|fdf_set_opt|fdf_set_status|fdf_set_submit_form_action|fdf_set_target_frame|fdf_set_value|fdf_set_version|feof|fflush|fgetc|fgetcsv|fgets|fgetss|file|file_exists|file_get_contents|file_put_contents|fileatime|filectime|filegroup|fileinode|filemtime|fileowner|fileperms|filepro|filepro_fieldcount|filepro_fieldname|filepro_fieldtype|filepro_fieldwidth|filepro_retrieve|filepro_rowcount|filesize|filetype|floatval|flock|floor|flush|fmod|fnmatch|fopen|fpassthru|fprintf|fputs|fread|frenchtojd|fribidi_log2vis|fscanf|fseek|fsockopen|fstat|ftell|ftok|ftp_alloc|ftp_cdup|ftp_chdir|ftp_chmod|ftp_close|ftp_connect|ftp_delete|ftp_exec|ftp_fget|ftp_fput|ftp_get|ftp_get_option|ftp_login|ftp_mdtm|ftp_mkdir|ftp_nb_continue|ftp_nb_fget|ftp_nb_fput|ftp_nb_get|ftp_nb_put|ftp_nlist|ftp_pasv|ftp_put|ftp_pwd|ftp_quit|ftp_raw|ftp_rawlist|ftp_rename|ftp_rmdir|ftp_set_option|ftp_site|ftp_size|ftp_ssl_connect|ftp_systype|ftruncate|func_get_arg|func_get_args|func_num_args|function_exists|fwrite|gd_info|get_browser|get_cfg_var|get_class|get_class_methods|get_class_vars|get_current_user|get_declared_classes|get_declared_interfaces|get_defined_constants|get_defined_functions|get_defined_vars|get_extension_funcs|get_headers|get_html_translation_table|get_include_path|get_included_files|get_loaded_extensions|get_magic_quotes_gpc|get_magic_quotes_runtime|get_meta_tags|get_object_vars|get_parent_class|get_required_files|get_resource_type|getallheaders|getcwd|getdate|getenv|gethostbyaddr|gethostbyname|gethostbynamel|getimagesize|getlastmod|getmxrr|getmygid|getmyinode|getmypid|getmyuid|getopt|getprotobyname|getprotobynumber|getrandmax|getrusage|getservbyname|getservbyport|gettext|gettimeofday|gettype|glob|gmdate|gmmktime|gmp_abs|gmp_add|gmp_and|gmp_clrbit|gmp_cmp|gmp_com|gmp_div|gmp_div_q|gmp_div_qr|gmp_div_r|gmp_divexact|gmp_fact|gmp_gcd|gmp_gcdext|gmp_hamdist|gmp_init|gmp_intval|gmp_invert|gmp_jacobi|gmp_legendre|gmp_mod|gmp_mul|gmp_neg|gmp_or|gmp_perfect_square|gmp_popcount|gmp_pow|gmp_powm|gmp_prob_prime|gmp_random|gmp_scan0|gmp_scan1|gmp_setbit|gmp_sign|gmp_sqrt|gmp_sqrtrem|gmp_strval|gmp_sub|gmp_xor|gmstrftime|gregoriantojd|gzclose|gzcompress|gzdeflate|gzencode|gzeof|gzfile|gzgetc|gzgets|gzgetss|gzinflate|gzopen|gzpassthru|gzputs|gzread|gzrewind|gzseek|gztell|gzuncompress|gzwrite|header|headers_list|headers_sent|hebrev|hebrevc|hexdec|highlight_file|highlight_string|html_entity_decode|htmlentities|htmlspecialchars|http_build_query|hw_api_attribute|hw_api_content|hw_api_object|hw_array2objrec|hw_changeobject|hw_children|hw_childrenobj|hw_close|hw_connect|hw_connection_info|hw_cp|hw_deleteobject|hw_docbyanchor|hw_docbyanchorobj|hw_document_attributes|hw_document_bodytag|hw_document_content|hw_document_setcontent|hw_document_size|hw_dummy|hw_edittext|hw_error|hw_errormsg|hw_free_document|hw_getanchors|hw_getanchorsobj|hw_getandlock|hw_getchildcoll|hw_getchildcollobj|hw_getchilddoccoll|hw_getchilddoccollobj|hw_getobject|hw_getobjectbyquery|hw_getobjectbyquerycoll|hw_getobjectbyquerycollobj|hw_getobjectbyqueryobj|hw_getparents|hw_getparentsobj|hw_getrellink|hw_getremote|hw_getremotechildren|hw_getsrcbydestobj|hw_gettext|hw_getusername|hw_identify|hw_incollections|hw_info|hw_inscoll|hw_insdoc|hw_insertanchors|hw_insertdocument|hw_insertobject|hw_mapid|hw_modifyobject|hw_mv|hw_new_document|hw_objrec2array|hw_output_document|hw_pconnect|hw_pipedocument|hw_root|hw_setlinkroot|hw_stat|hw_unlock|hw_who|hwapi_hgcsp|hypot|ibase_add_user|ibase_affected_rows|ibase_backup|ibase_blob_add|ibase_blob_cancel|ibase_blob_close|ibase_blob_create|ibase_blob_echo|ibase_blob_get|ibase_blob_import|ibase_blob_info|ibase_blob_open|ibase_close|ibase_commit|ibase_commit_ret|ibase_connect|ibase_db_info|ibase_delete_user|ibase_drop_db|ibase_errcode|ibase_errmsg|ibase_execute|ibase_fetch_assoc|ibase_fetch_object|ibase_fetch_row|ibase_field_info|ibase_free_event_handler|ibase_free_query|ibase_free_result|ibase_gen_id|ibase_maintain_db|ibase_modify_user|ibase_name_result|ibase_num_fields|ibase_num_params|ibase_param_info|ibase_pconnect|ibase_prepare|ibase_query|ibase_restore|ibase_rollback|ibase_rollback_ret|ibase_server_info|ibase_service_attach|ibase_service_detach|ibase_set_event_handler|ibase_timefmt|ibase_trans|ibase_wait_event|iconv|iconv_get_encoding|iconv_mime_decode|iconv_mime_decode_headers|iconv_mime_encode|iconv_set_encoding|iconv_strlen|iconv_strpos|iconv_strrpos|iconv_substr|idate|ifx_affected_rows|ifx_blobinfile_mode|ifx_byteasvarchar|ifx_close|ifx_connect|ifx_copy_blob|ifx_create_blob|ifx_create_char|ifx_do|ifx_error|ifx_errormsg|ifx_fetch_row|ifx_fieldproperties|ifx_fieldtypes|ifx_free_blob|ifx_free_char|ifx_free_result|ifx_get_blob|ifx_get_char|ifx_getsqlca|ifx_htmltbl_result|ifx_nullformat|ifx_num_fields|ifx_num_rows|ifx_pconnect|ifx_prepare|ifx_query|ifx_textasvarchar|ifx_update_blob|ifx_update_char|ifxus_close_slob|ifxus_create_slob|ifxus_free_slob|ifxus_open_slob|ifxus_read_slob|ifxus_seek_slob|ifxus_tell_slob|ifxus_write_slob|ignore_user_abort|image2wbmp|image_type_to_mime_type|imagealphablending|imageantialias|imagearc|imagechar|imagecharup|imagecolorallocate|imagecolorallocatealpha|imagecolorat|imagecolorclosest|imagecolorclosestalpha|imagecolorclosesthwb|imagecolordeallocate|imagecolorexact|imagecolorexactalpha|imagecolormatch|imagecolorresolve|imagecolorresolvealpha|imagecolorset|imagecolorsforindex|imagecolorstotal|imagecolortransparent|imagecopy|imagecopymerge|imagecopymergegray|imagecopyresampled|imagecopyresized|imagecreate|imagecreatefromgd|imagecreatefromgd2|imagecreatefromgd2part|imagecreatefromgif|imagecreatefromjpeg|imagecreatefrompng|imagecreatefromstring|imagecreatefromwbmp|imagecreatefromxbm|imagecreatefromxpm|imagecreatetruecolor|imagedashedline|imagedestroy|imageellipse|imagefill|imagefilledarc|imagefilledellipse|imagefilledpolygon|imagefilledrectangle|imagefilltoborder|imagefilter|imagefontheight|imagefontwidth|imageftbbox|imagefttext|imagegammacorrect|imagegd|imagegd2|imagegif|imageinterlace|imageistruecolor|imagejpeg|imagelayereffect|imageline|imageloadfont|imagepalettecopy|imagepng|imagepolygon|imagepsbbox|imagepscopyfont|imagepsencodefont|imagepsextendfont|imagepsfreefont|imagepsloadfont|imagepsslantfont|imagepstext|imagerectangle|imagerotate|imagesavealpha|imagesetbrush|imagesetpixel|imagesetstyle|imagesetthickness|imagesettile|imagestring|imagestringup|imagesx|imagesy|imagetruecolortopalette|imagettfbbox|imagettftext|imagetypes|imagewbmp|imagexbm|imap_8bit|imap_alerts|imap_append|imap_base64|imap_binary|imap_body|imap_bodystruct|imap_check|imap_clearflag_full|imap_close|imap_createmailbox|imap_delete|imap_deletemailbox|imap_errors|imap_expunge|imap_fetch_overview|imap_fetchbody|imap_fetchheader|imap_fetchstructure|imap_get_quota|imap_get_quotaroot|imap_getacl|imap_getmailboxes|imap_getsubscribed|imap_header|imap_headerinfo|imap_headers|imap_last_error|imap_list|imap_listmailbox|imap_listscan|imap_listsubscribed|imap_lsub|imap_mail|imap_mail_compose|imap_mail_copy|imap_mail_move|imap_mailboxmsginfo|imap_mime_header_decode|imap_msgno|imap_num_msg|imap_num_recent|imap_open|imap_ping|imap_qprint|imap_renamemailbox|imap_reopen|imap_rfc822_parse_adrlist|imap_rfc822_parse_headers|imap_rfc822_write_address|imap_scanmailbox|imap_search|imap_set_quota|imap_setacl|imap_setflag_full|imap_sort|imap_status|imap_subscribe|imap_thread|imap_timeout|imap_uid|imap_undelete|imap_unsubscribe|imap_utf7_decode|imap_utf7_encode|imap_utf8|implode|import_request_variables|in_array|ingres_autocommit|ingres_close|ingres_commit|ingres_connect|ingres_fetch_array|ingres_fetch_object|ingres_fetch_row|ingres_field_length|ingres_field_name|ingres_field_nullable|ingres_field_precision|ingres_field_scale|ingres_field_type|ingres_num_fields|ingres_num_rows|ingres_pconnect|ingres_query|ingres_rollback|ini_alter|ini_get|ini_get_all|ini_restore|ini_set|intval|ip2long|iptcembed|iptcparse|ircg_channel_mode|ircg_disconnect|ircg_fetch_error_msg|ircg_get_username|ircg_html_encode|ircg_ignore_add|ircg_ignore_del|ircg_invite|ircg_is_conn_alive|ircg_join|ircg_kick|ircg_list|ircg_lookup_format_messages|ircg_lusers|ircg_msg|ircg_nick|ircg_nickname_escape|ircg_nickname_unescape|ircg_notice|ircg_oper|ircg_part|ircg_pconnect|ircg_register_format_messages|ircg_set_current|ircg_set_file|ircg_set_on_die|ircg_topic|ircg_who|ircg_whois|is_a|is_array|is_bool|is_callable|is_dir|is_double|is_executable|is_file|is_finite|is_float|is_infinite|is_int|is_integer|is_link|is_long|is_nan|is_null|is_numeric|is_object|is_readable|is_real|is_resource|is_scalar|is_soap_fault|is_string|is_subclass_of|is_uploaded_file|is_writable|is_writeable|isset|java_last_exception_clear|java_last_exception_get|jddayofweek|jdmonthname|jdtofrench|jdtogregorian|jdtojewish|jdtojulian|jdtounix|jewishtojd|join|jpeg2wbmp|juliantojd|key|krsort|ksort|lcg_value|ldap_8859_to_t61|ldap_add|ldap_bind|ldap_close|ldap_compare|ldap_connect|ldap_count_entries|ldap_delete|ldap_dn2ufn|ldap_err2str|ldap_errno|ldap_error|ldap_explode_dn|ldap_first_attribute|ldap_first_entry|ldap_first_reference|ldap_free_result|ldap_get_attributes|ldap_get_dn|ldap_get_entries|ldap_get_option|ldap_get_values|ldap_get_values_len|ldap_list|ldap_mod_add|ldap_mod_del|ldap_mod_replace|ldap_modify|ldap_next_attribute|ldap_next_entry|ldap_next_reference|ldap_parse_reference|ldap_parse_result|ldap_read|ldap_rename|ldap_search|ldap_set_option|ldap_set_rebind_proc|ldap_sort|ldap_start_tls|ldap_t61_to_8859|ldap_unbind|levenshtein|link|linkinfo|list|localeconv|localtime|log|log10|log1p|long2ip|lstat|ltrim|lzf_compress|lzf_decompress|lzf_optimized_for|mail|mailparse_determine_best_xfer_encoding|mailparse_msg_create|mailparse_msg_extract_part|mailparse_msg_extract_part_file|mailparse_msg_free|mailparse_msg_get_part|mailparse_msg_get_part_data|mailparse_msg_get_structure|mailparse_msg_parse|mailparse_msg_parse_file|mailparse_rfc822_parse_addresses|mailparse_stream_encode|mailparse_uudecode_all|main|max|mb_convert_case|mb_convert_encoding|mb_convert_kana|mb_convert_variables|mb_decode_mimeheader|mb_decode_numericentity|mb_detect_encoding|mb_detect_order|mb_encode_mimeheader|mb_encode_numericentity|mb_ereg|mb_ereg_match|mb_ereg_replace|mb_ereg_search|mb_ereg_search_getpos|mb_ereg_search_getregs|mb_ereg_search_init|mb_ereg_search_pos|mb_ereg_search_regs|mb_ereg_search_setpos|mb_eregi|mb_eregi_replace|mb_get_info|mb_http_input|mb_http_output|mb_internal_encoding|mb_language|mb_output_handler|mb_parse_str|mb_preferred_mime_name|mb_regex_encoding|mb_regex_set_options|mb_send_mail|mb_split|mb_strcut|mb_strimwidth|mb_strlen|mb_strpos|mb_strrpos|mb_strtolower|mb_strtoupper|mb_strwidth|mb_substitute_character|mb_substr|mb_substr_count|mcal_append_event|mcal_close|mcal_create_calendar|mcal_date_compare|mcal_date_valid|mcal_day_of_week|mcal_day_of_year|mcal_days_in_month|mcal_delete_calendar|mcal_delete_event|mcal_event_add_attribute|mcal_event_init|mcal_event_set_alarm|mcal_event_set_category|mcal_event_set_class|mcal_event_set_description|mcal_event_set_end|mcal_event_set_recur_daily|mcal_event_set_recur_monthly_mday|mcal_event_set_recur_monthly_wday|mcal_event_set_recur_none|mcal_event_set_recur_weekly|mcal_event_set_recur_yearly|mcal_event_set_start|mcal_event_set_title|mcal_expunge|mcal_fetch_current_stream_event|mcal_fetch_event|mcal_is_leap_year|mcal_list_alarms|mcal_list_events|mcal_next_recurrence|mcal_open|mcal_popen|mcal_rename_calendar|mcal_reopen|mcal_snooze|mcal_store_event|mcal_time_valid|mcal_week_of_year|mcrypt_cbc|mcrypt_cfb|mcrypt_create_iv|mcrypt_decrypt|mcrypt_ecb|mcrypt_enc_get_algorithms_name|mcrypt_enc_get_block_size|mcrypt_enc_get_iv_size|mcrypt_enc_get_key_size|mcrypt_enc_get_modes_name|mcrypt_enc_get_supported_key_sizes|mcrypt_enc_is_block_algorithm|mcrypt_enc_is_block_algorithm_mode|mcrypt_enc_is_block_mode|mcrypt_enc_self_test|mcrypt_encrypt|mcrypt_generic|mcrypt_generic_deinit|mcrypt_generic_end|mcrypt_generic_init|mcrypt_get_block_size|mcrypt_get_cipher_name|mcrypt_get_iv_size|mcrypt_get_key_size|mcrypt_list_algorithms|mcrypt_list_modes|mcrypt_module_close|mcrypt_module_get_algo_block_size|mcrypt_module_get_algo_key_size|mcrypt_module_get_supported_key_sizes|mcrypt_module_is_block_algorithm|mcrypt_module_is_block_algorithm_mode|mcrypt_module_is_block_mode|mcrypt_module_open|mcrypt_module_self_test|mcrypt_ofb|mcve_adduser|mcve_adduserarg|mcve_bt|mcve_checkstatus|mcve_chkpwd|mcve_chngpwd|mcve_completeauthorizations|mcve_connect|mcve_connectionerror|mcve_deleteresponse|mcve_deletetrans|mcve_deleteusersetup|mcve_deluser|mcve_destroyconn|mcve_destroyengine|mcve_disableuser|mcve_edituser|mcve_enableuser|mcve_force|mcve_getcell|mcve_getcellbynum|mcve_getcommadelimited|mcve_getheader|mcve_getuserarg|mcve_getuserparam|mcve_gft|mcve_gl|mcve_gut|mcve_initconn|mcve_initengine|mcve_initusersetup|mcve_iscommadelimited|mcve_liststats|mcve_listusers|mcve_maxconntimeout|mcve_monitor|mcve_numcolumns|mcve_numrows|mcve_override|mcve_parsecommadelimited|mcve_ping|mcve_preauth|mcve_preauthcompletion|mcve_qc|mcve_responseparam|mcve_return|mcve_returncode|mcve_returnstatus|mcve_sale|mcve_setblocking|mcve_setdropfile|mcve_setip|mcve_setssl|mcve_setssl_files|mcve_settimeout|mcve_settle|mcve_text_avs|mcve_text_code|mcve_text_cv|mcve_transactionauth|mcve_transactionavs|mcve_transactionbatch|mcve_transactioncv|mcve_transactionid|mcve_transactionitem|mcve_transactionssent|mcve_transactiontext|mcve_transinqueue|mcve_transnew|mcve_transparam|mcve_transsend|mcve_ub|mcve_uwait|mcve_verifyconnection|mcve_verifysslcert|mcve_void|md5|md5_file|mdecrypt_generic|memory_get_usage|metaphone|method_exists|mhash|mhash_count|mhash_get_block_size|mhash_get_hash_name|mhash_keygen_s2k|microtime|mime_content_type|min|ming_setcubicthreshold|ming_setscale|ming_useswfversion|mkdir|mktime|money_format|move_uploaded_file|msession_connect|msession_count|msession_create|msession_destroy|msession_disconnect|msession_find|msession_get|msession_get_array|msession_getdata|msession_inc|msession_list|msession_listvar|msession_lock|msession_plugin|msession_randstr|msession_set|msession_set_array|msession_setdata|msession_timeout|msession_uniq|msession_unlock|msg_get_queue|msg_receive|msg_remove_queue|msg_send|msg_set_queue|msg_stat_queue|msql|msql|msql_affected_rows|msql_close|msql_connect|msql_create_db|msql_createdb|msql_data_seek|msql_dbname|msql_drop_db|msql_error|msql_fetch_array|msql_fetch_field|msql_fetch_object|msql_fetch_row|msql_field_flags|msql_field_len|msql_field_name|msql_field_seek|msql_field_table|msql_field_type|msql_fieldflags|msql_fieldlen|msql_fieldname|msql_fieldtable|msql_fieldtype|msql_free_result|msql_list_dbs|msql_list_fields|msql_list_tables|msql_num_fields|msql_num_rows|msql_numfields|msql_numrows|msql_pconnect|msql_query|msql_regcase|msql_result|msql_select_db|msql_tablename|mssql_bind|mssql_close|mssql_connect|mssql_data_seek|mssql_execute|mssql_fetch_array|mssql_fetch_assoc|mssql_fetch_batch|mssql_fetch_field|mssql_fetch_object|mssql_fetch_row|mssql_field_length|mssql_field_name|mssql_field_seek|mssql_field_type|mssql_free_result|mssql_free_statement|mssql_get_last_message|mssql_guid_string|mssql_init|mssql_min_error_severity|mssql_min_message_severity|mssql_next_result|mssql_num_fields|mssql_num_rows|mssql_pconnect|mssql_query|mssql_result|mssql_rows_affected|mssql_select_db|mt_getrandmax|mt_rand|mt_srand|muscat_close|muscat_get|muscat_give|muscat_setup|muscat_setup_net|mysql_affected_rows|mysql_change_user|mysql_client_encoding|mysql_close|mysql_connect|mysql_create_db|mysql_data_seek|mysql_db_name|mysql_db_query|mysql_drop_db|mysql_errno|mysql_error|mysql_escape_string|mysql_fetch_array|mysql_fetch_assoc|mysql_fetch_field|mysql_fetch_lengths|mysql_fetch_object|mysql_fetch_row|mysql_field_flags|mysql_field_len|mysql_field_name|mysql_field_seek|mysql_field_table|mysql_field_type|mysql_free_result|mysql_get_client_info|mysql_get_host_info|mysql_get_proto_info|mysql_get_server_info|mysql_info|mysql_insert_id|mysql_list_dbs|mysql_list_fields|mysql_list_processes|mysql_list_tables|mysql_num_fields|mysql_num_rows|mysql_pconnect|mysql_ping|mysql_query|mysql_real_escape_string|mysql_result|mysql_select_db|mysql_stat|mysql_tablename|mysql_thread_id|mysql_unbuffered_query|mysqli_affected_rows|mysqli_autocommit|mysqli_bind_param|mysqli_bind_result|mysqli_change_user|mysqli_character_set_name|mysqli_client_encoding|mysqli_close|mysqli_commit|mysqli_connect|mysqli_connect_errno|mysqli_connect_error|mysqli_data_seek|mysqli_debug|mysqli_disable_reads_from_master|mysqli_disable_rpl_parse|mysqli_dump_debug_info|mysqli_embedded_connect|mysqli_enable_reads_from_master|mysqli_enable_rpl_parse|mysqli_errno|mysqli_error|mysqli_escape_string|mysqli_execute|mysqli_fetch|mysqli_fetch_array|mysqli_fetch_assoc|mysqli_fetch_field|mysqli_fetch_field_direct|mysqli_fetch_fields|mysqli_fetch_lengths|mysqli_fetch_object|mysqli_fetch_row|mysqli_field_count|mysqli_field_seek|mysqli_field_tell|mysqli_free_result|mysqli_get_client_info|mysqli_get_client_version|mysqli_get_host_info|mysqli_get_metadata|mysqli_get_proto_info|mysqli_get_server_info|mysqli_get_server_version|mysqli_info|mysqli_init|mysqli_insert_id|mysqli_kill|mysqli_master_query|mysqli_more_results|mysqli_multi_query|mysqli_next_result|mysqli_num_fields|mysqli_num_rows|mysqli_options|mysqli_param_count|mysqli_ping|mysqli_prepare|mysqli_query|mysqli_real_connect|mysqli_real_escape_string|mysqli_real_query|mysqli_report|mysqli_rollback|mysqli_rpl_parse_enabled|mysqli_rpl_probe|mysqli_rpl_query_type|mysqli_select_db|mysqli_send_long_data|mysqli_send_query|mysqli_server_end|mysqli_server_init|mysqli_set_opt|mysqli_sqlstate|mysqli_ssl_set|mysqli_stat|mysqli_stmt_init|mysqli_stmt_affected_rows|mysqli_stmt_bind_param|mysqli_stmt_bind_result|mysqli_stmt_close|mysqli_stmt_data_seek|mysqli_stmt_errno|mysqli_stmt_error|mysqli_stmt_execute|mysqli_stmt_fetch|mysqli_stmt_free_result|mysqli_stmt_num_rows|mysqli_stmt_param_count|mysqli_stmt_prepare|mysqli_stmt_result_metadata|mysqli_stmt_send_long_data|mysqli_stmt_sqlstate|mysqli_stmt_store_result|mysqli_store_result|mysqli_thread_id|mysqli_thread_safe|mysqli_use_result|mysqli_warning_count|natcasesort|natsort|ncurses_addch|ncurses_addchnstr|ncurses_addchstr|ncurses_addnstr|ncurses_addstr|ncurses_assume_default_colors|ncurses_attroff|ncurses_attron|ncurses_attrset|ncurses_baudrate|ncurses_beep|ncurses_bkgd|ncurses_bkgdset|ncurses_border|ncurses_bottom_panel|ncurses_can_change_color|ncurses_cbreak|ncurses_clear|ncurses_clrtobot|ncurses_clrtoeol|ncurses_color_content|ncurses_color_set|ncurses_curs_set|ncurses_def_prog_mode|ncurses_def_shell_mode|ncurses_define_key|ncurses_del_panel|ncurses_delay_output|ncurses_delch|ncurses_deleteln|ncurses_delwin|ncurses_doupdate|ncurses_echo|ncurses_echochar|ncurses_end|ncurses_erase|ncurses_erasechar|ncurses_filter|ncurses_flash|ncurses_flushinp|ncurses_getch|ncurses_getmaxyx|ncurses_getmouse|ncurses_getyx|ncurses_halfdelay|ncurses_has_colors|ncurses_has_ic|ncurses_has_il|ncurses_has_key|ncurses_hide_panel|ncurses_hline|ncurses_inch|ncurses_init|ncurses_init_color|ncurses_init_pair|ncurses_insch|ncurses_insdelln|ncurses_insertln|ncurses_insstr|ncurses_instr|ncurses_isendwin|ncurses_keyok|ncurses_keypad|ncurses_killchar|ncurses_longname|ncurses_meta|ncurses_mouse_trafo|ncurses_mouseinterval|ncurses_mousemask|ncurses_move|ncurses_move_panel|ncurses_mvaddch|ncurses_mvaddchnstr|ncurses_mvaddchstr|ncurses_mvaddnstr|ncurses_mvaddstr|ncurses_mvcur|ncurses_mvdelch|ncurses_mvgetch|ncurses_mvhline|ncurses_mvinch|ncurses_mvvline|ncurses_mvwaddstr|ncurses_napms|ncurses_new_panel|ncurses_newpad|ncurses_newwin|ncurses_nl|ncurses_nocbreak|ncurses_noecho|ncurses_nonl|ncurses_noqiflush|ncurses_noraw|ncurses_pair_content|ncurses_panel_above|ncurses_panel_below|ncurses_panel_window|ncurses_pnoutrefresh|ncurses_prefresh|ncurses_putp|ncurses_qiflush|ncurses_raw|ncurses_refresh|ncurses_replace_panel|ncurses_reset_prog_mode|ncurses_reset_shell_mode|ncurses_resetty|ncurses_savetty|ncurses_scr_dump|ncurses_scr_init|ncurses_scr_restore|ncurses_scr_set|ncurses_scrl|ncurses_show_panel|ncurses_slk_attr|ncurses_slk_attroff|ncurses_slk_attron|ncurses_slk_attrset|ncurses_slk_clear|ncurses_slk_color|ncurses_slk_init|ncurses_slk_noutrefresh|ncurses_slk_refresh|ncurses_slk_restore|ncurses_slk_set|ncurses_slk_touch|ncurses_standend|ncurses_standout|ncurses_start_color|ncurses_termattrs|ncurses_termname|ncurses_timeout|ncurses_top_panel|ncurses_typeahead|ncurses_ungetch|ncurses_ungetmouse|ncurses_update_panels|ncurses_use_default_colors|ncurses_use_env|ncurses_use_extended_names|ncurses_vidattr|ncurses_vline|ncurses_waddch|ncurses_waddstr|ncurses_wattroff|ncurses_wattron|ncurses_wattrset|ncurses_wborder|ncurses_wclear|ncurses_wcolor_set|ncurses_werase|ncurses_wgetch|ncurses_whline|ncurses_wmouse_trafo|ncurses_wmove|ncurses_wnoutrefresh|ncurses_wrefresh|ncurses_wstandend|ncurses_wstandout|ncurses_wvline|next|ngettext|nl2br|nl_langinfo|notes_body|notes_copy_db|notes_create_db|notes_create_note|notes_drop_db|notes_find_note|notes_header_info|notes_list_msgs|notes_mark_read|notes_mark_unread|notes_nav_create|notes_search|notes_unread|notes_version|nsapi_request_headers|nsapi_response_headers|nsapi_virtual|number_format|ob_clean|ob_end_clean|ob_end_flush|ob_flush|ob_get_clean|ob_get_contents|ob_get_flush|ob_get_length|ob_get_level|ob_get_status|ob_gzhandler|ob_iconv_handler|ob_implicit_flush|ob_list_handlers|ob_start|ob_tidyhandler|oci_bind_by_name|oci_cancel|oci_close|oci_commit|oci_connect|oci_define_by_name|oci_error|oci_execute|oci_fetch|oci_fetch_all|oci_fetch_array|oci_fetch_assoc|oci_fetch_object|oci_fetch_row|oci_field_is_null|oci_field_name|oci_field_precision|oci_field_scale|oci_field_size|oci_field_type|oci_field_type_raw|oci_free_statement|oci_internal_debug|oci_lob_copy|oci_lob_is_equal|oci_new_collection|oci_new_connect|oci_new_cursor|oci_new_descriptor|oci_num_fields|oci_num_rows|oci_parse|oci_password_change|oci_pconnect|oci_result|oci_rollback|oci_server_version|oci_set_prefetch|oci_statement_type|ocibindbyname|ocicancel|ocicloselob|ocicollappend|ocicollassign|ocicollassignelem|ocicollgetelem|ocicollmax|ocicollsize|ocicolltrim|ocicolumnisnull|ocicolumnname|ocicolumnprecision|ocicolumnscale|ocicolumnsize|ocicolumntype|ocicolumntyperaw|ocicommit|ocidefinebyname|ocierror|ociexecute|ocifetch|ocifetchinto|ocifetchstatement|ocifreecollection|ocifreecursor|ocifreedesc|ocifreestatement|ociinternaldebug|ociloadlob|ocilogoff|ocilogon|ocinewcollection|ocinewcursor|ocinewdescriptor|ocinlogon|ocinumcols|ociparse|ociplogon|ociresult|ocirollback|ocirowcount|ocisavelob|ocisavelobfile|ociserverversion|ocisetprefetch|ocistatementtype|ociwritelobtofile|ociwritetemporarylob|octdec|odbc_autocommit|odbc_binmode|odbc_close|odbc_close_all|odbc_columnprivileges|odbc_columns|odbc_commit|odbc_connect|odbc_cursor|odbc_data_source|odbc_do|odbc_error|odbc_errormsg|odbc_exec|odbc_execute|odbc_fetch_array|odbc_fetch_into|odbc_fetch_object|odbc_fetch_row|odbc_field_len|odbc_field_name|odbc_field_num|odbc_field_precision|odbc_field_scale|odbc_field_type|odbc_foreignkeys|odbc_free_result|odbc_gettypeinfo|odbc_longreadlen|odbc_next_result|odbc_num_fields|odbc_num_rows|odbc_pconnect|odbc_prepare|odbc_primarykeys|odbc_procedurecolumns|odbc_procedures|odbc_result|odbc_result_all|odbc_rollback|odbc_setoption|odbc_specialcolumns|odbc_statistics|odbc_tableprivileges|odbc_tables|opendir|openlog|openssl_csr_export|openssl_csr_export_to_file|openssl_csr_new|openssl_csr_sign|openssl_error_string|openssl_free_key|openssl_get_privatekey|openssl_get_publickey|openssl_open|openssl_pkcs7_decrypt|openssl_pkcs7_encrypt|openssl_pkcs7_sign|openssl_pkcs7_verify|openssl_pkey_export|openssl_pkey_export_to_file|openssl_pkey_get_private|openssl_pkey_get_public|openssl_pkey_new|openssl_private_decrypt|openssl_private_encrypt|openssl_public_decrypt|openssl_public_encrypt|openssl_seal|openssl_sign|openssl_verify|openssl_x509_check_private_key|openssl_x509_checkpurpose|openssl_x509_export|openssl_x509_export_to_file|openssl_x509_free|openssl_x509_parse|openssl_x509_read|ora_bind|ora_close|ora_columnname|ora_columnsize|ora_columntype|ora_commit|ora_commitoff|ora_commiton|ora_do|ora_error|ora_errorcode|ora_exec|ora_fetch|ora_fetch_into|ora_getcolumn|ora_logoff|ora_logon|ora_numcols|ora_numrows|ora_open|ora_parse|ora_plogon|ora_rollback|ord|output_add_rewrite_var|output_reset_rewrite_vars|overload|ovrimos_close|ovrimos_commit|ovrimos_connect|ovrimos_cursor|ovrimos_exec|ovrimos_execute|ovrimos_fetch_into|ovrimos_fetch_row|ovrimos_field_len|ovrimos_field_name|ovrimos_field_num|ovrimos_field_type|ovrimos_free_result|ovrimos_longreadlen|ovrimos_num_fields|ovrimos_num_rows|ovrimos_prepare|ovrimos_result|ovrimos_result_all|ovrimos_rollback|pack|parse_ini_file|parse_str|parse_url|passthru|pathinfo|pclose|pcntl_alarm|pcntl_exec|pcntl_fork|pcntl_getpriority|pcntl_setpriority|pcntl_signal|pcntl_wait|pcntl_waitpid|pcntl_wexitstatus|pcntl_wifexited|pcntl_wifsignaled|pcntl_wifstopped|pcntl_wstopsig|pcntl_wtermsig|pdf_add_annotation|pdf_add_bookmark|pdf_add_launchlink|pdf_add_locallink|pdf_add_note|pdf_add_outline|pdf_add_pdflink|pdf_add_thumbnail|pdf_add_weblink|pdf_arc|pdf_arcn|pdf_attach_file|pdf_begin_page|pdf_begin_pattern|pdf_begin_template|pdf_circle|pdf_clip|pdf_close|pdf_close_image|pdf_close_pdi|pdf_close_pdi_page|pdf_closepath|pdf_closepath_fill_stroke|pdf_closepath_stroke|pdf_concat|pdf_continue_text|pdf_curveto|pdf_delete|pdf_end_page|pdf_end_pattern|pdf_end_template|pdf_endpath|pdf_fill|pdf_fill_stroke|pdf_findfont|pdf_get_buffer|pdf_get_font|pdf_get_fontname|pdf_get_fontsize|pdf_get_image_height|pdf_get_image_width|pdf_get_majorversion|pdf_get_minorversion|pdf_get_parameter|pdf_get_pdi_parameter|pdf_get_pdi_value|pdf_get_value|pdf_initgraphics|pdf_lineto|pdf_makespotcolor|pdf_moveto|pdf_new|pdf_open|pdf_open_ccitt|pdf_open_file|pdf_open_gif|pdf_open_image|pdf_open_image_file|pdf_open_jpeg|pdf_open_memory_image|pdf_open_pdi|pdf_open_pdi_page|pdf_open_png|pdf_open_tiff|pdf_place_image|pdf_place_pdi_page|pdf_rect|pdf_restore|pdf_rotate|pdf_save|pdf_scale|pdf_set_border_color|pdf_set_border_dash|pdf_set_border_style|pdf_set_char_spacing|pdf_set_duration|pdf_set_font|pdf_set_horiz_scaling|pdf_set_info|pdf_set_info_author|pdf_set_info_creator|pdf_set_info_keywords|pdf_set_info_subject|pdf_set_info_title|pdf_set_leading|pdf_set_parameter|pdf_set_text_matrix|pdf_set_text_pos|pdf_set_text_rendering|pdf_set_text_rise|pdf_set_value|pdf_set_word_spacing|pdf_setcolor|pdf_setdash|pdf_setflat|pdf_setfont|pdf_setgray|pdf_setgray_fill|pdf_setgray_stroke|pdf_setlinecap|pdf_setlinejoin|pdf_setlinewidth|pdf_setmatrix|pdf_setmiterlimit|pdf_setpolydash|pdf_setrgbcolor|pdf_setrgbcolor_fill|pdf_setrgbcolor_stroke|pdf_show|pdf_show_boxed|pdf_show_xy|pdf_skew|pdf_stringwidth|pdf_stroke|pdf_translate|pfpro_cleanup|pfpro_init|pfpro_process|pfpro_process_raw|pfpro_version|pfsockopen|pg_affected_rows|pg_cancel_query|pg_client_encoding|pg_close|pg_connect|pg_connection_busy|pg_connection_reset|pg_connection_status|pg_convert|pg_copy_from|pg_copy_to|pg_dbname|pg_delete|pg_end_copy|pg_escape_bytea|pg_escape_string|pg_fetch_all|pg_fetch_array|pg_fetch_assoc|pg_fetch_object|pg_fetch_result|pg_fetch_row|pg_field_is_null|pg_field_name|pg_field_num|pg_field_prtlen|pg_field_size|pg_field_type|pg_free_result|pg_get_notify|pg_get_pid|pg_get_result|pg_host|pg_insert|pg_last_error|pg_last_notice|pg_last_oid|pg_lo_close|pg_lo_create|pg_lo_export|pg_lo_import|pg_lo_open|pg_lo_read|pg_lo_read_all|pg_lo_seek|pg_lo_tell|pg_lo_unlink|pg_lo_write|pg_meta_data|pg_num_fields|pg_num_rows|pg_options|pg_pconnect|pg_ping|pg_port|pg_put_line|pg_query|pg_result_error|pg_result_seek|pg_result_status|pg_select|pg_send_query|pg_set_client_encoding|pg_trace|pg_tty|pg_unescape_bytea|pg_untrace|pg_update|php_ini_scanned_files|php_logo_guid|php_sapi_name|php_uname|phpcredits|phpinfo|phpversion|pi|png2wbmp|popen|pos|posix_ctermid|posix_get_last_error|posix_getcwd|posix_getegid|posix_geteuid|posix_getgid|posix_getgrgid|posix_getgrnam|posix_getgroups|posix_getlogin|posix_getpgid|posix_getpgrp|posix_getpid|posix_getppid|posix_getpwnam|posix_getpwuid|posix_getrlimit|posix_getsid|posix_getuid|posix_isatty|posix_kill|posix_mkfifo|posix_setegid|posix_seteuid|posix_setgid|posix_setpgid|posix_setsid|posix_setuid|posix_strerror|posix_times|posix_ttyname|posix_uname|pow|preg_grep|preg_match|preg_match_all|preg_quote|preg_replace|preg_replace_callback|preg_split|prev|print|print_r|printer_abort|printer_close|printer_create_brush|printer_create_dc|printer_create_font|printer_create_pen|printer_delete_brush|printer_delete_dc|printer_delete_font|printer_delete_pen|printer_draw_bmp|printer_draw_chord|printer_draw_elipse|printer_draw_line|printer_draw_pie|printer_draw_rectangle|printer_draw_roundrect|printer_draw_text|printer_end_doc|printer_end_page|printer_get_option|printer_list|printer_logical_fontheight|printer_open|printer_select_brush|printer_select_font|printer_select_pen|printer_set_option|printer_start_doc|printer_start_page|printer_write|printf|proc_close|proc_get_status|proc_nice|proc_open|proc_terminate|pspell_add_to_personal|pspell_add_to_session|pspell_check|pspell_clear_session|pspell_config_create|pspell_config_ignore|pspell_config_mode|pspell_config_personal|pspell_config_repl|pspell_config_runtogether|pspell_config_save_repl|pspell_new|pspell_new_config|pspell_new_personal|pspell_save_wordlist|pspell_store_replacement|pspell_suggest|putenv|qdom_error|qdom_tree|quoted_printable_decode|quotemeta|rad2deg|rand|range|rawurldecode|rawurlencode|read_exif_data|readdir|readfile|readgzfile|readline|readline_add_history|readline_clear_history|readline_completion_function|readline_info|readline_list_history|readline_read_history|readline_write_history|readlink|realpath|recode|recode_file|recode_string|register_shutdown_function|register_tick_function|rename|reset|restore_error_handler|restore_include_path|rewind|rewinddir|rmdir|round|rsort|rtrim|scandir|sem_acquire|sem_get|sem_release|sem_remove|serialize|sesam_affected_rows|sesam_commit|sesam_connect|sesam_diagnostic|sesam_disconnect|sesam_errormsg|sesam_execimm|sesam_fetch_array|sesam_fetch_result|sesam_fetch_row|sesam_field_array|sesam_field_name|sesam_free_result|sesam_num_fields|sesam_query|sesam_rollback|sesam_seek_row|sesam_settransaction|session_cache_expire|session_cache_limiter|session_commit|session_decode|session_destroy|session_encode|session_get_cookie_params|session_id|session_is_registered|session_module_name|session_name|session_regenerate_id|session_register|session_save_path|session_set_cookie_params|session_set_save_handler|session_start|session_unregister|session_unset|session_write_close|set_error_handler|set_file_buffer|set_include_path|set_magic_quotes_runtime|set_time_limit|setcookie|setlocale|setrawcookie|settype|sha1|sha1_file|shell_exec|shm_attach|shm_detach|shm_get_var|shm_put_var|shm_remove|shm_remove_var|shmop_close|shmop_delete|shmop_open|shmop_read|shmop_size|shmop_write|show_source|shuffle|similar_text|simplexml_import_dom|simplexml_load_file|simplexml_load_string|sin|sinh|sizeof|sleep|snmp_get_quick_print|snmp_set_quick_print|snmpget|snmprealwalk|snmpset|snmpwalk|snmpwalkoid|socket_accept|socket_bind|socket_clear_error|socket_close|socket_connect|socket_create|socket_create_listen|socket_create_pair|socket_get_option|socket_get_status|socket_getpeername|socket_getsockname|socket_iovec_add|socket_iovec_alloc|socket_iovec_delete|socket_iovec_fetch|socket_iovec_free|socket_iovec_set|socket_last_error|socket_listen|socket_read|socket_readv|socket_recv|socket_recvfrom|socket_recvmsg|socket_select|socket_send|socket_sendmsg|socket_sendto|socket_set_block|socket_set_blocking|socket_set_nonblock|socket_set_option|socket_set_timeout|socket_shutdown|socket_strerror|socket_write|socket_writev|sort|soundex|split|spliti|sprintf|sql_regcase|sqlite_array_query|sqlite_busy_timeout|sqlite_changes|sqlite_close|sqlite_column|sqlite_create_aggregate|sqlite_create_function|sqlite_current|sqlite_error_string|sqlite_escape_string|sqlite_fetch_array|sqlite_fetch_single|sqlite_fetch_string|sqlite_field_name|sqlite_has_more|sqlite_last_error|sqlite_last_insert_rowid|sqlite_libencoding|sqlite_libversion|sqlite_next|sqlite_num_fields|sqlite_num_rows|sqlite_open|sqlite_popen|sqlite_query|sqlite_rewind|sqlite_seek|sqlite_udf_decode_binary|sqlite_udf_encode_binary|sqlite_unbuffered_query|sqrt|srand|sscanf|stat|str_ireplace|str_pad|str_repeat|str_replace|str_rot13|str_shuffle|str_split|str_word_count|strcasecmp|strchr|strcmp|strcoll|strcspn|stream_context_create|stream_context_get_options|stream_context_set_option|stream_context_set_params|stream_copy_to_stream|stream_filter_append|stream_filter_prepend|stream_filter_register|stream_get_contents|stream_get_filters|stream_get_line|stream_get_meta_data|stream_get_transports|stream_get_wrappers|stream_register_wrapper|stream_select|stream_set_blocking|stream_set_timeout|stream_set_write_buffer|stream_socket_accept|stream_socket_client|stream_socket_get_name|stream_socket_recvfrom|stream_socket_sendto|stream_socket_server|stream_wrapper_register|strftime|strip_tags|stripcslashes|stripos|stripslashes|stristr|strlen|strnatcasecmp|strnatcmp|strncasecmp|strncmp|strpos|strrchr|strrev|strripos|strrpos|strspn|strstr|strtok|strtolower|strtotime|strtoupper|strtr|strval|substr|substr_compare|substr_count|substr_replace|swf_actiongeturl|swf_actiongotoframe|swf_actiongotolabel|swf_actionnextframe|swf_actionplay|swf_actionprevframe|swf_actionsettarget|swf_actionstop|swf_actiontogglequality|swf_actionwaitforframe|swf_addbuttonrecord|swf_addcolor|swf_closefile|swf_definebitmap|swf_definefont|swf_defineline|swf_definepoly|swf_definerect|swf_definetext|swf_endbutton|swf_enddoaction|swf_endshape|swf_endsymbol|swf_fontsize|swf_fontslant|swf_fonttracking|swf_getbitmapinfo|swf_getfontinfo|swf_getframe|swf_labelframe|swf_lookat|swf_modifyobject|swf_mulcolor|swf_nextid|swf_oncondition|swf_openfile|swf_ortho|swf_ortho2|swf_perspective|swf_placeobject|swf_polarview|swf_popmatrix|swf_posround|swf_pushmatrix|swf_removeobject|swf_rotate|swf_scale|swf_setfont|swf_setframe|swf_shapearc|swf_shapecurveto|swf_shapecurveto3|swf_shapefillbitmapclip|swf_shapefillbitmaptile|swf_shapefilloff|swf_shapefillsolid|swf_shapelinesolid|swf_shapelineto|swf_shapemoveto|swf_showframe|swf_startbutton|swf_startdoaction|swf_startshape|swf_startsymbol|swf_textwidth|swf_translate|swf_viewport|swfaction|swfbitmap|swfbutton|swfbutton_keypress|swfdisplayitem|swffill|swffont|swfgradient|swfmorph|swfmovie|swfshape|swfsprite|swftext|swftextfield|sybase_affected_rows|sybase_close|sybase_connect|sybase_data_seek|sybase_deadlock_retry_count|sybase_fetch_array|sybase_fetch_assoc|sybase_fetch_field|sybase_fetch_object|sybase_fetch_row|sybase_field_seek|sybase_free_result|sybase_get_last_message|sybase_min_client_severity|sybase_min_error_severity|sybase_min_message_severity|sybase_min_server_severity|sybase_num_fields|sybase_num_rows|sybase_pconnect|sybase_query|sybase_result|sybase_select_db|sybase_set_message_handler|sybase_unbuffered_query|symlink|syslog|system|tan|tanh|tcpwrap_check|tempnam|textdomain|tidy_access_count|tidy_clean_repair|tidy_config_count|tidy_diagnose|tidy_error_count|tidy_get_body|tidy_get_config|tidy_get_error_buffer|tidy_get_head|tidy_get_html|tidy_get_html_ver|tidy_get_output|tidy_get_release|tidy_get_root|tidy_get_status|tidy_getopt|tidy_is_xhtml|tidy_is_xml|tidy_load_config|tidy_parse_file|tidy_parse_string|tidy_repair_file|tidy_repair_string|tidy_reset_config|tidy_save_config|tidy_set_encoding|tidy_setopt|tidy_warning_count|time|tmpfile|token_get_all|token_name|touch|trigger_error|trim|uasort|ucfirst|ucwords|udm_add_search_limit|udm_alloc_agent|udm_alloc_agent_array|udm_api_version|udm_cat_list|udm_cat_path|udm_check_charset|udm_check_stored|udm_clear_search_limits|udm_close_stored|udm_crc32|udm_errno|udm_error|udm_find|udm_free_agent|udm_free_ispell_data|udm_free_res|udm_get_doc_count|udm_get_res_field|udm_get_res_param|udm_hash32|udm_load_ispell_data|udm_open_stored|udm_set_agent_param|uksort|umask|uniqid|unixtojd|unlink|unpack|unregister_tick_function|unserialize|unset|urldecode|urlencode|user_error|usleep|usort|utf8_decode|utf8_encode|var_dump|var_export|variant|version_compare|virtual|vpopmail_add_alias_domain|vpopmail_add_alias_domain_ex|vpopmail_add_domain|vpopmail_add_domain_ex|vpopmail_add_user|vpopmail_alias_add|vpopmail_alias_del|vpopmail_alias_del_domain|vpopmail_alias_get|vpopmail_alias_get_all|vpopmail_auth_user|vpopmail_del_domain|vpopmail_del_domain_ex|vpopmail_del_user|vpopmail_error|vpopmail_passwd|vpopmail_set_user_quota|vprintf|vsprintf|w32api_deftype|w32api_init_dtype|w32api_invoke_function|w32api_register_function|w32api_set_call_method|wddx_add_vars|wddx_deserialize|wddx_packet_end|wddx_packet_start|wddx_serialize_value|wddx_serialize_vars|wordwrap|xdiff_file_diff|xdiff_file_diff_binary|xdiff_file_merge3|xdiff_file_patch|xdiff_file_patch_binary|xdiff_string_diff|xdiff_string_diff_binary|xdiff_string_merge3|xdiff_string_patch|xdiff_string_patch_binary|xml_error_string|xml_get_current_byte_index|xml_get_current_column_number|xml_get_current_line_number|xml_get_error_code|xml_parse|xml_parse_into_struct|xml_parser_create|xml_parser_create_ns|xml_parser_free|xml_parser_get_option|xml_parser_set_option|xml_set_character_data_handler|xml_set_default_handler|xml_set_element_handler|xml_set_end_namespace_decl_handler|xml_set_external_entity_ref_handler|xml_set_notation_decl_handler|xml_set_object|xml_set_processing_instruction_handler|xml_set_start_namespace_decl_handler|xml_set_unparsed_entity_decl_handler|xmlrpc_decode|xmlrpc_decode_request|xmlrpc_encode|xmlrpc_encode_request|xmlrpc_get_type|xmlrpc_parse_method_descriptions|xmlrpc_server_add_introspection_data|xmlrpc_server_call_method|xmlrpc_server_create|xmlrpc_server_destroy|xmlrpc_server_register_introspection_callback|xmlrpc_server_register_method|xmlrpc_set_type|xpath_eval|xpath_eval_expression|xpath_new_context|xptr_eval|xptr_new_context|xsl_xsltprocessor_get_parameter|xsl_xsltprocessor_has_exslt_support|xsl_xsltprocessor_import_stylesheet|xsl_xsltprocessor_register_php_functions|xsl_xsltprocessor_remove_parameter|xsl_xsltprocessor_set_parameter|xsl_xsltprocessor_transform_to_doc|xsl_xsltprocessor_transform_to_uri|xsl_xsltprocessor_transform_to_xml|xslt_create|xslt_errno|xslt_error|xslt_free|xslt_process|xslt_set_base|xslt_set_encoding|xslt_set_error_handler|xslt_set_log|xslt_set_sax_handler|xslt_set_sax_handlers|xslt_set_scheme_handler|xslt_set_scheme_handlers|yaz_addinfo|yaz_ccl_conf|yaz_ccl_parse|yaz_close|yaz_connect|yaz_database|yaz_element|yaz_errno|yaz_error|yaz_es_result|yaz_get_option|yaz_hits|yaz_itemorder|yaz_present|yaz_range|yaz_record|yaz_scan|yaz_scan_result|yaz_schema|yaz_search|yaz_set_option|yaz_sort|yaz_syntax|yaz_wait|yp_all|yp_cat|yp_err_string|yp_errno|yp_first|yp_get_default_domain|yp_master|yp_match|yp_next|yp_order|zend_logo_guid|zend_version|zip_close|zip_entry_close|zip_entry_compressedsize|zip_entry_compressionmethod|zip_entry_filesize|zip_entry_name|zip_entry_open|zip_entry_read|zip_open|zip_read|zlib_get_coding_type".split("|"));
    var keywords$$2 = lang$$10.arrayToMap("abstract|and|array|as|break|case|catch|cfunction|class|clone|const|continue|declare|default|die|do|else|elseif|enddeclare|endfor|endforeach|endif|endswitch|endwhile|extends|final|for|foreach|function|include|include_once|global|goto|if|implements|interface|instanceof|namespace|new|old_function|or|private|protected|public|return|require|require_once|static|switch|throw|try|use|var|while|xor".split("|"));
    var builtinConstants$$1 = lang$$10.arrayToMap("true|false|null|__FILE__|__LINE__|__METHOD__|__FUNCTION__|__CLASS__".split("|"));
    var builtinVariables = lang$$10.arrayToMap("$_GLOBALS|$_SERVER|$_GET|$_POST|$_FILES|$_REQUEST|$_SESSION|$_ENV|$_COOKIE|$php_errormsg|$HTTP_RAW_POST_DATA|$http_response_header|$argc|$argv".split("|"));
    var futureReserved$$2 = lang$$10.arrayToMap([]);
    this.$rules = {start:[{token:"support", regex:"<\\?(?:php|\\=)"}, {token:"support", regex:"\\?>"}, {token:"comment", regex:"\\/\\/.*$"}, docComment$$1.getStartRule("doc-start"), {token:"comment", regex:"\\/\\*", next:"comment"}, {token:"string.regexp", regex:"[/](?:(?:\\[(?:\\\\]|[^\\]])+\\])|(?:\\\\/|[^\\]/]))*[/][gimy]*\\s*(?=[).,;]|$)"}, {token:"string", regex:'["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'}, {token:"string", regex:'["].*\\\\$', next:"qqstring"}, {token:"string", regex:"['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"}, 
    {token:"string", regex:"['].*\\\\$", next:"qstring"}, {token:"constant.numeric", regex:"0[xX][0-9a-fA-F]+\\b"}, {token:"constant.numeric", regex:"[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"}, {token:"constant.language", regex:"\\b(?:DEFAULT_INCLUDE_PATH|E_(?:ALL|CO(?:MPILE_(?:ERROR|WARNING)|RE_(?:ERROR|WARNING))|ERROR|NOTICE|PARSE|STRICT|USER_(?:ERROR|NOTICE|WARNING)|WARNING)|P(?:EAR_(?:EXTENSION_DIR|INSTALL_DIR)|HP_(?:BINDIR|CONFIG_FILE_(?:PATH|SCAN_DIR)|DATADIR|E(?:OL|XTENSION_DIR)|INT_(?:MAX|SIZE)|L(?:IBDIR|OCALSTATEDIR)|O(?:S|UTPUT_HANDLER_(?:CONT|END|START))|PREFIX|S(?:API|HLIB_SUFFIX|YSCONFDIR)|VERSION))|__COMPILER_HALT_OFFSET__)\\b"}, 
    {token:"constant.language", regex:"\\b(?:A(?:B(?:DAY_(?:1|2|3|4|5|6|7)|MON_(?:1(?:0|1|2|)|2|3|4|5|6|7|8|9))|LT_DIGITS|M_STR|SSERT_(?:ACTIVE|BAIL|CALLBACK|QUIET_EVAL|WARNING))|C(?:ASE_(?:LOWER|UPPER)|HAR_MAX|O(?:DESET|NNECTION_(?:ABORTED|NORMAL|TIMEOUT)|UNT_(?:NORMAL|RECURSIVE))|R(?:EDITS_(?:ALL|DOCS|FULLPAGE|G(?:ENERAL|ROUP)|MODULES|QA|SAPI)|NCYSTR|YPT_(?:BLOWFISH|EXT_DES|MD5|S(?:ALT_LENGTH|TD_DES)))|URRENCY_SYMBOL)|D(?:AY_(?:1|2|3|4|5|6|7)|ECIMAL_POINT|IRECTORY_SEPARATOR|_(?:FMT|T_FMT))|E(?:NT_(?:COMPAT|NOQUOTES|QUOTES)|RA(?:_(?:D_(?:FMT|T_FMT)|T_FMT|YEAR)|)|XTR_(?:IF_EXISTS|OVERWRITE|PREFIX_(?:ALL|I(?:F_EXISTS|NVALID)|SAME)|SKIP))|FRAC_DIGITS|GROUPING|HTML_(?:ENTITIES|SPECIALCHARS)|IN(?:FO_(?:ALL|C(?:ONFIGURATION|REDITS)|ENVIRONMENT|GENERAL|LICENSE|MODULES|VARIABLES)|I_(?:ALL|PERDIR|SYSTEM|USER)|T_(?:CURR_SYMBOL|FRAC_DIGITS))|L(?:C_(?:ALL|C(?:OLLATE|TYPE)|M(?:ESSAGES|ONETARY)|NUMERIC|TIME)|O(?:CK_(?:EX|NB|SH|UN)|G_(?:A(?:LERT|UTH(?:PRIV|))|C(?:ONS|R(?:IT|ON))|D(?:AEMON|EBUG)|E(?:MERG|RR)|INFO|KERN|L(?:OCAL(?:0|1|2|3|4|5|6|7)|PR)|MAIL|N(?:DELAY|EWS|O(?:TICE|WAIT))|ODELAY|P(?:ERROR|ID)|SYSLOG|U(?:SER|UCP)|WARNING)))|M(?:ON_(?:1(?:0|1|2|)|2|3|4|5|6|7|8|9|DECIMAL_POINT|GROUPING|THOUSANDS_SEP)|_(?:1_PI|2_(?:PI|SQRTPI)|E|L(?:N(?:10|2)|OG(?:10E|2E))|PI(?:_(?:2|4)|)|SQRT(?:1_2|2)))|N(?:EGATIVE_SIGN|O(?:EXPR|STR)|_(?:CS_PRECEDES|S(?:EP_BY_SPACE|IGN_POSN)))|P(?:ATH(?:INFO_(?:BASENAME|DIRNAME|EXTENSION)|_SEPARATOR)|M_STR|OSITIVE_SIGN|_(?:CS_PRECEDES|S(?:EP_BY_SPACE|IGN_POSN)))|RADIXCHAR|S(?:EEK_(?:CUR|END|SET)|ORT_(?:ASC|DESC|NUMERIC|REGULAR|STRING)|TR_PAD_(?:BOTH|LEFT|RIGHT))|T(?:HOUS(?:ANDS_SEP|EP)|_FMT(?:_AMPM|))|YES(?:EXPR|STR)|STD(?:IN|OUT|ERR))\\b"}, 
    {token:function(value$$51) {
      if(keywords$$2[value$$51]) {
        return"keyword"
      }else {
        if(builtinConstants$$1[value$$51]) {
          return"constant.language"
        }else {
          if(builtinVariables[value$$51]) {
            return"variable.language"
          }else {
            if(futureReserved$$2[value$$51]) {
              return"invalid.illegal"
            }else {
              if(builtinFunctions$$1[value$$51]) {
                return"support.function"
              }else {
                if(value$$51 == "debugger") {
                  return"invalid.deprecated"
                }else {
                  if(value$$51.match(/^(\$[a-zA-Z][a-zA-Z0-9_]*|self|parent)$/)) {
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
  oop$$22.inherits(PhpHighlightRules, TextHighlightRules$$8);
  exports$$67.PhpHighlightRules = PhpHighlightRules
});
define("ace/mode/php", ["require", "exports", "module", "pilot/oop", "./text", "../tokenizer", "./php_highlight_rules", "./matching_brace_outdent", "../range"], function(require$$69, exports$$68) {
  var oop$$23 = require$$69("pilot/oop");
  var TextMode$$6 = require$$69("./text").Mode;
  var Tokenizer$$7 = require$$69("../tokenizer").Tokenizer;
  var PhpHighlightRules$$1 = require$$69("./php_highlight_rules").PhpHighlightRules;
  var MatchingBraceOutdent$$4 = require$$69("./matching_brace_outdent").MatchingBraceOutdent;
  var Range$$9 = require$$69("../range").Range;
  var Mode$$6 = function() {
    this.$tokenizer = new Tokenizer$$7((new PhpHighlightRules$$1).getRules());
    this.$outdent = new MatchingBraceOutdent$$4
  };
  oop$$23.inherits(Mode$$6, TextMode$$6);
  (function() {
    this.toggleCommentLines = function(state$$26, doc$$28, startRow$$7, endRow$$6) {
      var outdent$$3 = true;
      var re$$9 = /^(\s*)#/;
      var i$$52 = startRow$$7;
      for(;i$$52 <= endRow$$6;i$$52++) {
        if(!re$$9.test(doc$$28.getLine(i$$52))) {
          outdent$$3 = false;
          break
        }
      }if(outdent$$3) {
        var deleteRange$$3 = new Range$$9(0, 0, 0, 0);
        i$$52 = startRow$$7;
        for(;i$$52 <= endRow$$6;i$$52++) {
          var line$$36 = doc$$28.getLine(i$$52).replace(re$$9, "$1");
          deleteRange$$3.start.row = i$$52;
          deleteRange$$3.end.row = i$$52;
          deleteRange$$3.end.column = line$$36.length + 2;
          doc$$28.replace(deleteRange$$3, line$$36)
        }return-2
      }else {
        return doc$$28.indentRows(startRow$$7, endRow$$6, "#")
      }
    };
    this.getNextLineIndent = function(state$$27, line$$37, tab$$8) {
      var indent$$5 = this.$getIndent(line$$37);
      var tokenizedLine$$2 = this.$tokenizer.getLineTokens(line$$37, state$$27);
      var tokens$$9 = tokenizedLine$$2.tokens;
      if(tokens$$9.length && tokens$$9[tokens$$9.length - 1].type == "comment") {
        return indent$$5
      }if(state$$27 == "start") {
        var match$$14 = line$$37.match(/^.*[\{\(\[\:]\s*$/);
        if(match$$14) {
          indent$$5 += tab$$8
        }
      }return indent$$5
    };
    this.checkOutdent = function(state$$28, line$$38, input$$12) {
      return this.$outdent.checkOutdent(line$$38, input$$12)
    };
    this.autoOutdent = function(state$$29, doc$$29, row$$62) {
      return this.$outdent.autoOutdent(doc$$29, row$$62)
    }
  }).call(Mode$$6.prototype);
  exports$$68.Mode = Mode$$6
});
define("ace/undomanager", ["require", "exports", "module"], function(require$$70, exports$$69) {
  var UndoManager = function() {
    this.$undoStack = [];
    this.$redoStack = []
  };
  (function() {
    this.execute = function(options$$8) {
      var deltas$$2 = options$$8.args[0];
      this.$doc = options$$8.args[1];
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
  exports$$69.UndoManager = UndoManager
});
define("demo/startup", ["require", "exports", "module", "pilot/event", "ace/editor", "ace/virtual_renderer", "ace/theme/textmate", "ace/document", "ace/mode/javascript", "ace/mode/css", "ace/mode/html", "ace/mode/xml", "ace/mode/python", "ace/mode/php", "ace/mode/text", "ace/undomanager"], function(require$$71, exports$$70) {
  exports$$70.launch = function(env$$62) {
    function setMode() {
      env$$62.editor.getDocument().setMode(modes[modeEl.value] || modes.text)
    }
    function onDocChange() {
      var doc$$30 = docs$$1[docEl.value];
      env$$62.editor.setDocument(doc$$30);
      var mode$$5 = doc$$30.getMode();
      modeEl.value = mode$$5 instanceof JavaScriptMode$$1 ? "javascript" : mode$$5 instanceof CssMode$$1 ? "css" : mode$$5 instanceof HtmlMode ? "html" : mode$$5 instanceof XmlMode ? "xml" : mode$$5 instanceof PythonMode ? "python" : mode$$5 instanceof PhpMode ? "php" : "text";
      env$$62.editor.focus()
    }
    function setTheme() {
      env$$62.editor.setTheme(themeEl.value)
    }
    function setSelectionStyle() {
      selectEl.checked ? env$$62.editor.setSelectionStyle("line") : env$$62.editor.setSelectionStyle("text")
    }
    function setHighlightActiveLine() {
      env$$62.editor.setHighlightActiveLine(!!activeEl.checked)
    }
    function setShowInvisibles() {
      env$$62.editor.setShowInvisibles(!!showHiddenEl.checked)
    }
    function onResize() {
      container$$2.style.width = document.documentElement.clientWidth - 4 + "px";
      container$$2.style.height = document.documentElement.clientHeight - 55 - 4 - 23 + "px";
      env$$62.editor.resize()
    }
    var event$$9 = require$$71("pilot/event");
    var Editor$$1 = require$$71("ace/editor").Editor;
    var Renderer = require$$71("ace/virtual_renderer").VirtualRenderer;
    var theme$$5 = require$$71("ace/theme/textmate");
    var Document$$2 = require$$71("ace/document").Document;
    var JavaScriptMode$$1 = require$$71("ace/mode/javascript").Mode;
    var CssMode$$1 = require$$71("ace/mode/css").Mode;
    var HtmlMode = require$$71("ace/mode/html").Mode;
    var XmlMode = require$$71("ace/mode/xml").Mode;
    var PythonMode = require$$71("ace/mode/python").Mode;
    var PhpMode = require$$71("ace/mode/php").Mode;
    var TextMode$$7 = require$$71("ace/mode/text").Mode;
    var UndoManager$$1 = require$$71("ace/undomanager").UndoManager;
    var docs$$1 = {};
    docs$$1.js = new Document$$2(document.getElementById("jstext").innerHTML);
    docs$$1.js.setMode(new JavaScriptMode$$1);
    docs$$1.js.setUndoManager(new UndoManager$$1);
    docs$$1.css = new Document$$2(document.getElementById("csstext").innerHTML);
    docs$$1.css.setMode(new CssMode$$1);
    docs$$1.css.setUndoManager(new UndoManager$$1);
    docs$$1.html = new Document$$2(document.getElementById("htmltext").innerHTML);
    docs$$1.html.setMode(new HtmlMode);
    docs$$1.html.setUndoManager(new UndoManager$$1);
    docs$$1.python = new Document$$2(document.getElementById("pythontext").innerHTML);
    docs$$1.python.setMode(new PythonMode);
    docs$$1.python.setUndoManager(new UndoManager$$1);
    docs$$1.php = new Document$$2(document.getElementById("phptext").innerHTML);
    docs$$1.php.setMode(new PhpMode);
    docs$$1.php.setUndoManager(new UndoManager$$1);
    var container$$2 = document.getElementById("editor");
    env$$62.editor = new Editor$$1(new Renderer(container$$2, theme$$5));
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
      var cursor$$15 = env$$62.editor.getCursorPosition();
      var pos$$7 = env$$62.editor.renderer.textToScreenCoordinates(cursor$$15.row, cursor$$15.column);
      jump.style.left = pos$$7.pageX + "px";
      jump.style.top = pos$$7.pageY + "px";
      jump.style.display = "block"
    };
    window.onresize = onResize;
    onResize();
    event$$9.addListener(container$$2, "dragover", function(e$$39) {
      return event$$9.preventDefault(e$$39)
    });
    event$$9.addListener(container$$2, "drop", function(e$$40) {
      try {
        var file$$1 = e$$40.dataTransfer.files[0]
      }catch(e$$41) {
        return event$$9.stopEvent()
      }if(window.FileReader) {
        var reader = new FileReader;
        reader.onload = function() {
          env$$62.editor.getSelection().selectAll();
          var mode$$6 = "text";
          if(/^.*\.js$/i.test(file$$1.name)) {
            mode$$6 = "javascript"
          }else {
            if(/^.*\.xml$/i.test(file$$1.name)) {
              mode$$6 = "xml"
            }else {
              if(/^.*\.html$/i.test(file$$1.name)) {
                mode$$6 = "html"
              }else {
                if(/^.*\.css$/i.test(file$$1.name)) {
                  mode$$6 = "css"
                }else {
                  if(/^.*\.py$/i.test(file$$1.name)) {
                    mode$$6 = "python"
                  }else {
                    if(/^.*\.php$/i.test(file$$1.name)) {
                      mode$$6 = "php"
                    }
                  }
                }
              }
            }
          }env$$62.editor.onTextInput(reader.result);
          modeEl.value = mode$$6;
          env$$62.editor.getDocument().setMode(modes[mode$$6])
        };
        reader.readAsText(file$$1)
      }return event$$9.preventDefault(e$$40)
    })
  }
});
var config = {paths:{demo:"../demo", ace:"../lib/ace", cockpit:"../support/cockpit/lib/cockpit", pilot:"../support/cockpit/support/pilot/lib/pilot"}};
require(config, ["pilot/fixoldbrowsers", "pilot/plugin_manager", "pilot/settings", "pilot/environment", "demo/startup"], function() {
  var catalog$$2 = require("pilot/plugin_manager").catalog;
  catalog$$2.registerPlugins(["pilot/index", "cockpit/index"]).then(function() {
    var env$$63 = require("pilot/environment").create();
    catalog$$2.startupPlugins({env:env$$63}).then(function() {
      require("demo/startup").launch(env$$63)
    })
  })
});
define("demo/boot", function() {
});