var console = {
    log: function(msg) {
        postMessage({type: "log", data: msg});
    }
};
var window = {
    console: console
};

var require = function(id) {
    var module = require.modules[id];
    if (module) {
        if (!module.initialized) {
            module.exports = module.factory().exports;
            module.initialized = true;
        }
        return module.exports;
    }
    
    var chunks = id.split("/");
    chunks[0] = require.tlns[chunks[0]] || chunks[0];
    path = chunks.join("/") + ".js";
    
    require.id = id;
//    console.log("require " +  path + " " + id)
    importScripts(path);
    return require(id);    
};

require.modules = {};
require.tlns = {};

var define = function(id, deps, factory) {
    if (arguments.length == 2) {
        factory = deps;
    } else if (arguments.length == 1) {
        factory = id;
        id = require.id;
    }
    
    if (id.indexOf("text!") === 0) 
        return;
    
    require.modules[id] = {
        factory: function() {
            var module = {
                exports: {}
            };
            var returnExports = factory(require, module.exports, module);
            if (returnExports)
                module.exports = exports;
            return module;
        }
    };
};

function initBaseUrls(topLevelNamespaces) {
    require.tlns = topLevelNamespaces;
}

function initSender() {

    var EventEmitter = require("pilot/event_emitter").EventEmitter;
    var oop = require("pilot/oop");
    
    var Sender = function() {};
    
    (function() {
        
        oop.implement(this, EventEmitter);
                
        this.callback = function(data, callbackId) {
            postMessage({
                type: "call",
                id: callbackId,
                data: data
            });
        };
    
        this.emit = function(name, data) {
            postMessage({
                type: "event",
                name: name,
                data: data
            });
        };
        
    }).call(Sender.prototype);
    
    return new Sender();
}

var main;
var sender;

onmessage = function(e) {
    var msg = e.data;
    if (msg.command) {
        main[msg.command].apply(main, msg.args);
    }
    else if (msg.init) {        
        initBaseUrls(msg.tlns);
        require("pilot/fixoldbrowsers");
        sender = initSender();
        var clazz = require(msg.module)[msg.classname];
        main = new clazz(sender);
    } 
    else if (msg.event) {
        sender._dispatchEvent(msg.event, msg.data);
    }
};/* vim:ts=4:sts=4:sw=4:
 * ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Mozilla Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Kevin Dangoor (kdangoor@mozilla.com)
 *      Irakli Gozalishvili <rfobic@gmail.com> (http://jeditoolkit.com)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define('pilot/fixoldbrowsers', ['require', 'exports', 'module' ], function(require, exports, module) {

// Should be the first thing, as we want to use that in this module.
if (!Function.prototype.bind) {
    // from MDC
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
    Function.prototype.bind = function (obj) {
        var slice = [].slice;
        var args = slice.call(arguments, 1);
        var self = this;
        var nop = function () {};

        // optimize common case
        if (arguments.length == 1) {
          var bound = function() {
              var useThis = self.prototype === undefined ?
                                this instanceof arguments.callee :
                                this instanceof nop;
              return self.apply(useThis ? this : obj, arguments);
          };
        }
        else {
          var bound = function () {
              var useThis = self.prototype === undefined ?
                                this instanceof arguments.callee :
                                this instanceof nop;
              return self.apply(
                  useThis ? this : ( obj || {} ),
                  args.concat( slice.call(arguments) )
              );
          };
        }

        nop.prototype = self.prototype;
        bound.prototype = new nop();

        // From Narwhal
        bound.name = this.name;
        bound.displayName = this.displayName;
        bound.length = this.length;
        bound.unbound = self;

        return bound;
    };
}


var F = function() {}
var call = Function.prototype.call;
// Shortcut for `Object.prototype.hasOwnProperty.call`.
var owns = call.bind(Object.prototype.hasOwnProperty);

// Shortcuts for getter / setter utilities if supported by JS engine.
var getGetter, getSetter, setGetter, setSetter
getGetter = getSetter = setGetter = setSetter = F;

if (Object.prototype.__lookupGetter__)
    getGetter = call.bind(Object.prototype.__lookupGetter__);
if (Object.prototype.__lookupSetter__)
    getSetter = call.bind(Object.prototype.__lookupSetter__);
if (Object.prototype.__defineGetter__)
    setGetter = call.bind(Object.prototype.__defineGetter__);
if (Object.prototype.__defineSetter__)
    setSetter = call.bind(Object.prototype.__defineSetter__);

/**
 * Array detector.
 * Firefox 3.5 and Safari 4 have this already. Chrome 4 however ...
 * Note to Dojo - your isArray is still broken: instanceof doesn't work with
 * Arrays taken from a different frame/window.
 */
// ES5 15.4.3.2
if (!Array.isArray) {
    Array.isArray = function(data) {
        return data && Object.prototype.toString.call(data) === "[object Array]";
    };
}

// from MDC
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(searchElement /*, fromIndex */)
  {
    if (this === void 0 || this === null)
        throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (len === 0)
        return -1;

    var n = 0, zero = n;
    if (arguments.length > 0) {
        n = Number(arguments[1]);
        if (n !== n)
            n = 0;
        else if (n !== 0 && n !== (1 / zero) && n !== -(1 / zero))
            n = (n > 0 || -1) * Math.floor(Math.abs(n));
    }

    if (n >= len)
        return -1;

    var k = n >= 0
        ? n
        : Math.max(len - Math.abs(n), 0);

    for (; k < len; k++) {
      if (k in t && t[k] === searchElement)
          return k;
    }
    return -1;
  };
}

// from MDC
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf
if (!Array.prototype.lastIndexOf)
{
  Array.prototype.lastIndexOf = function(searchElement /*, fromIndex*/)
  {
    "use strict";

    if (this === void 0 || this === null)
      throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (len === 0)
      return -1;

    var n = len, zero = false | 0;
    if (arguments.length > 0)
    {
      n = Number(arguments[1]);
      if (n !== n)
        n = 0;
      else if (n !== 0 && n !== (1 / zero) && n !== -(1 / zero))
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
    }

    var k = n >= 0
          ? Math.min(n, len - 1)
          : len - Math.abs(n);

    while (k >= 0)
    {
      if (k in t && t[k] === searchElement)
        return k;
    }
    return -1;
  };
}

// from MDC
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/map
// ES5 15.4.4.19
if (!Array.prototype.map) {
    Array.prototype.map = function(fun /*, thisp */) {
    if (this === void 0 || this === null)
        throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function")
        throw new TypeError();

      res = new Array(len);
    var thisp = arguments[1];
    for (var i = 0; i < len; i++) {
      if (i in t)
          res[i] = fun.call(thisp, t[i], i, t);
    }

      return res;
  };
}

// from MDC
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
// ES5 15.4.4.18
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(fun /*, thisp */) {
    if (this === void 0 || this === null)
        throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function")
        throw new TypeError();

    var thisp = arguments[1];
    for (var i = 0; i < len; i++) {
      if (i in t)
          fun.call(thisp, t[i], i, t);
    }
  };
}

// ES5 15.4.4.20
if (!Array.prototype.filter) {
    Array.prototype.filter = function filter(callback, scope) {
        var values = [], i, ii;
        for (i = 0, ii = this.length; i < ii; i++) {
            if (callback.call(scope, this[i])) values.push(this[i]);
        }
        return values;
    };
}

// ES5 15.4.4.16
if (!Array.prototype.every) {
    Array.prototype.every = function every(callback, scope) {
        var i, ii;
        for (i = 0, ii = this.length; i < ii; i++) {
            if (!callback.call(scope, this[i])) return false;
        }
        return true;
    };
}

// ES5 15.4.4.17
if (!Array.prototype.some) {
    Array.prototype.some = function (callback, scope) {
        var i, ii;
        for (i = 0, ii = this.length; i < ii; i++) {
            if (callback.call(scope, this[i])) return true;
        }
        return false;
    };
}

// ES5 15.4.4.21
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce
if (!Array.prototype.reduce) {
    Array.prototype.reduce = function(fun /*, initial*/) {
        var len = this.length >>> 0;
        if (typeof fun != "function")
            throw new TypeError();

        // no value to return if no initial value and an empty array
        if (len == 0 && arguments.length == 1)
            throw new TypeError();

        var i = 0;
        if (arguments.length >= 2) {
            var rv = arguments[1];
        } else {
            do {
                if (i in this) {
                    rv = this[i++];
                    break;
                }

                // if array contains no values, no initial value to return
                if (++i >= len)
                    throw new TypeError();
            } while (true);
        }

        for (; i < len; i++) {
            if (i in this)
                rv = fun.call(null, rv, this[i], i, this);
        }

        return rv;
    };
}

// ES5 15.4.4.22
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduceRight
if (!Array.prototype.reduceRight) {
    Array.prototype.reduceRight = function(fun /*, initial*/) {
        var len = this.length >>> 0;
        if (typeof fun != "function")
            throw new TypeError();

        // no value to return if no initial value, empty array
        if (len == 0 && arguments.length == 1)
            throw new TypeError();

        var i = len - 1;
        if (arguments.length >= 2) {
            var rv = arguments[1];
        } else {
            do {
                if (i in this) {
                    rv = this[i--];
                    break;
                }

                // if array contains no values, no initial value to return
                if (--i < 0)
                    throw new TypeError();
            } while (true);
        }

        for (; i >= 0; i--) {
            if (i in this)
                rv = fun.call(null, rv, this[i], i, this);
        }

        return rv;
    };
}


/**
 * Retrieves the list of keys on an object.
 */
if (!Object.keys) {
    Object.keys = function keys(object) {
        var name, names = [];
        for (name in object)
            if (owns(object, name)) names.push(name);

        return names;
    };
}

// Can not be implemented so we default to the Object.keys
// ES5 15.2.3.4
if (!Object.getOwnPropertyNames) {
    Object.getOwnPropertyNames = Object.keys;
}

// ES5 15.2.3.3
var ERR_NON_OBJECT = "Object.getOwnPropertyDescriptor called on a non-object"
if (!Object.getOwnPropertyDescriptor) {
    Object.getOwnPropertyDescriptor =
        function getOwnPropertyDescriptor(object, name) {
            var descriptor, getter, setter;

            if (typeof object !== "object" && typeof object !== "function"
                || object === null) throw new TypeError(ERR_NON_OBJECT);

            if (owns(object, name)) {
                descriptor = { configurable: true, enumerable: true };
                getter = descriptor.get = getGetter(object, name);
                setter = descriptor.set = getSetter(object, name);
                // If nor getter nor setter is not defined we default to
                // normal value. This can mean that either it's data
                // property or js engine does not supports getters / setters.
                if (!getter && !setter) {
                    descriptor.writeable = true;
                    descriptor.value = object[name]
                }
            }
            return descriptor
        }
}

// Returning `__proto__` of an object or `object.constructor.prototype` for IE.
if (!Object.getPrototypeOf) {
    Object.getPrototypeOf = function getPrototypeOf(object) {
        return object.__proto__ || object.constructor.prototype;
    }
}

// ES5 15.2.3.5
if (!Object.create) {
    Object.create = function create(prototype, properties) {
        var object;

        if (prototype === null) {
            object = { __proto__: null };
        } else if (typeof prototype !== "object") {
            throw new TypeError(prototype + " is not an object or null");
        } else {
            F.prototype = prototype;
            object = new F();
        }

        if (typeof properties !== "undefined")
            Object.defineProperties(object, properties);

        return object;
    };
}

// ES5 15.2.3.6
if (!Object.defineProperty) {
    Object.defineProperty = function defineProperty(object, name, descriptor) {
        var proto, setter, getter;

        if ("object" !== typeof object && "function" !== typeof object)
            throw new TypeError(object + "is not an object");
        if (descriptor && 'object' !== typeof descriptor)
            throw new TypeError('Property descriptor map must be an object');
        if ('value' in descriptor) { // if it's a data property
            if ('get' in descriptor || 'set' in descriptor) {
                throw new TypeError('Invalid property. "value" present on '
                    + 'property with getter or setter.');
            }

            // Swapping __proto__ with default one to avoid calling inherited
            // getters / setters with this `name`.
            if (proto = object.__proto__) object.__proto__ = Object.prototype;
            // Delete property cause it may be a setter.
            delete object[name];
            object[name] = descriptor.value;
            // Return __proto__ back.
            if (proto) object.__proto__ = proto;
        } else {
            if (getter = descriptor.get) setGetter(object, getter);
            if (setter = descriptor.set) setSetter(object, setter);
        }
        return object;
    };
}

// ES5 15.2.3.7
if (!Object.defineProperties) {
    Object.defineProperties = function defineProperties(object, properties) {
        Object.getOwnPropertyNames(properties).forEach(function (name) {
            Object.defineProperty(object, name, properties[name]);
        });
        return object;
    };
}

var passThrough = function(object) { return object };
// ES5 15.2.3.8
if (!Object.seal) Object.seal = passThrough;

// ES5 15.2.3.9
if (!Object.freeze) Object.freeze = passThrough;

// ES5 15.2.3.10
if (!Object.preventExtensions) Object.preventExtension = passThrough;

var no = function() { return false };
var yes = function() { return true };

// ES5 15.2.3.11
if (!Object.isSealed) Object.isSealed = no;
// ES5 15.2.3.12
if (!Object.isFrozen) Object.isFrozen = no;
// ES5 15.2.3.13
if (!Object.isExtensible) Object.isExtensible = yes;

if (!String.prototype.trim) {
    String.prototype.trim = function() {
        return this.trimLeft().trimRight();
    }
}

if (!String.prototype.trimRight) {
    String.prototype.trimRight = function() {
        return this.replace(/[\t\v\f\s\u00a0\ufeff]+$/, "");
    }
}

if (!String.prototype.trimLeft) {
    String.prototype.trimLeft = function() {
        return this.replace(/^[\t\v\f\s\u00a0\ufeff]+/, "");
    }
}

exports.globalsLoaded = true;

});
/* vim:ts=4:sts=4:sw=4:
 * ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Ajax.org Code Editor (ACE).
 *
 * The Initial Developer of the Original Code is
 * Ajax.org B.V.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Fabian Jakobs <fabian AT ajax DOT org>
 *      Irakli Gozalishvili <rfobic@gmail.com> (http://jeditoolkit.com)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define('pilot/event_emitter', ['require', 'exports', 'module' ], function(require, exports, module) {

var EventEmitter = {};

EventEmitter._emit =
EventEmitter._dispatchEvent = function(eventName, e) {
    this._eventRegistry = this._eventRegistry || {};

    var listeners = this._eventRegistry[eventName];
    if (!listeners || !listeners.length) return;

    var e = e || {};
    e.type = eventName;

    for (var i=0; i<listeners.length; i++) {
        listeners[i](e);
    }
};

EventEmitter.on =
EventEmitter.addEventListener = function(eventName, callback) {
    this._eventRegistry = this._eventRegistry || {};

    var listeners = this._eventRegistry[eventName];
    if (!listeners) {
      var listeners = this._eventRegistry[eventName] = [];
    }
    if (listeners.indexOf(callback) == -1) {
        listeners.push(callback);
    }
};

EventEmitter.removeListener =
EventEmitter.removeEventListener = function(eventName, callback) {
    this._eventRegistry = this._eventRegistry || {};

    var listeners = this._eventRegistry[eventName];
    if (!listeners) {
      return;
    }
    var index = listeners.indexOf(callback);
    if (index !== -1) {
        listeners.splice(index, 1);
    }
};

EventEmitter.removeAllListeners = function(eventName) {
    if (this._eventRegistry) this._eventRegistry[eventName] = [];
}

exports.EventEmitter = EventEmitter;

});
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Ajax.org Code Editor (ACE).
 *
 * The Initial Developer of the Original Code is
 * Ajax.org B.V.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Fabian Jakobs <fabian AT ajax DOT org>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define('pilot/oop', ['require', 'exports', 'module' ], function(require, exports, module) {

exports.inherits = (function() {
    var tempCtor = function() {};
    return function(ctor, superCtor) {
        tempCtor.prototype = superCtor.prototype;
        ctor.super_ = superCtor.prototype;
        ctor.prototype = new tempCtor();
        ctor.prototype.constructor = ctor;
    }
}());

exports.mixin = function(obj, mixin) {
    for (var key in mixin) {
        obj[key] = mixin[key];
    }
};

exports.implement = function(proto, mixin) {
    exports.mixin(proto, mixin);
};

});

define('ace/mode/javascript_worker', ['require', 'exports', 'module' , 'pilot/oop', 'ace/worker/mirror', 'ace/worker/jshint', 'ace/narcissus/jsparse'], function(require, exports, module) {
    
var oop = require("pilot/oop");
var Mirror = require("ace/worker/mirror").Mirror;
//var lint = require("ace/worker/jslint").JSLINT;
var lint = require("ace/worker/jshint").JSHINT;
    
var JavaScriptWorker = exports.JavaScriptWorker = function(sender) {
    Mirror.call(this, sender);
    this.setTimeout(500);
};

oop.inherits(JavaScriptWorker, Mirror);

(function() {
    
    this.onUpdate = function() {
        var value = this.doc.getValue();
        value = value.replace(/^#!.*\n/, "\n");
        
//        var start = new Date();
        var parser = require("ace/narcissus/jsparse");
        try {
            parser.parse(value);
        } catch(e) {
//            console.log("narcissus")
//            console.log(e);
            sender.emit("narcissus", {
                row: e.lineno-1,
                column: null, // TODO convert e.cursor
                text: e.message,
                type: "error"
            });
            return;
        } finally {
//            console.log("parse time: " + (new Date() - start));
        }
        
//        var start = new Date();
//        console.log("jslint")
        lint(value, {undef: false, onevar: false, passfail: false});
        this.sender.emit("jslint", lint.errors);        
//        console.log("lint time: " + (new Date() - start));
    }
    
}).call(JavaScriptWorker.prototype);

});
define('ace/worker/mirror', ['require', 'exports', 'module' , 'ace/document', 'pilot/lang'], function(require, exports, module) {
    
var Document = require("ace/document").Document;
var lang = require("pilot/lang");
    
var Mirror = exports.Mirror = function(sender) {
    this.sender = sender;
    var doc = this.doc = new Document("");
    
    var deferredUpdate = this.deferredUpdate = lang.deferredCall(this.onUpdate.bind(this));
    
    var _self = this;
    sender.on("change", function(e) {
        doc.applyDeltas([e.data]);        
        deferredUpdate.schedule(_self.$timeout);
    });
};

(function() {
    
    this.$timeout = 500;
    
    this.setTimeout = function(timeout) {
        this.$timeout = timeout;
    };
    
    this.setValue = function(value) {
        this.doc.setValue(value);
        this.deferredUpdate.schedule(this.$timeout);
    };
    
    this.getValue = function(callbackId) {
        this.sender.callback(this.doc.getValue(), callbackId);
    };
    
    this.onUpdate = function() {
        // abstract method
    };
    
}).call(Mirror.prototype);

});/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Ajax.org Code Editor (ACE).
 *
 * The Initial Developer of the Original Code is
 * Ajax.org B.V.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Fabian Jakobs <fabian AT ajax DOT org>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define('ace/document', ['require', 'exports', 'module' , 'pilot/oop', 'pilot/event_emitter', 'ace/range', 'ace/anchor'], function(require, exports, module) {

var oop = require("pilot/oop");
var EventEmitter = require("pilot/event_emitter").EventEmitter;
var Range = require("ace/range").Range;
var Anchor = require("ace/anchor").Anchor;

var Document = function(text) {
    this.$lines = [];

    if (Array.isArray(text)) {
        this.insertLines(0, text);
    }
    // There has to be one line at least in the document. If you pass an empty
    // string to the insert function, nothing will happen. Workaround.
    else if (text.length == 0) {
        this.$lines = [""];
    } else {
        this.insert({row: 0, column:0}, text);
    }
};

(function() {

    oop.implement(this, EventEmitter);

    this.setValue = function(text) {
        var len = this.getLength();
        this.remove(new Range(0, 0, len, this.getLine(len-1).length));
        this.insert({row: 0, column:0}, text);
    };
  	
    this.getValue = function() {
        return this.getAllLines().join(this.getNewLineCharacter());
    };
    
    this.createAnchor = function(row, column) {
        return new Anchor(this, row, column);
    };

    // check for IE split bug
    if ("aaa".split(/a/).length == 0)
        this.$split = function(text) {
            return text.replace(/\r\n|\r/g, "\n").split("\n");
        }
    else
        this.$split = function(text) {
            return text.split(/\r\n|\r|\n/);
        };


    this.$detectNewLine = function(text) {
        var match = text.match(/^.*?(\r?\n)/m);
        if (match) {
            this.$autoNewLine = match[1];
        } else {
            this.$autoNewLine = "\n";
        }
    };

    this.getNewLineCharacter = function() {
      switch (this.$newLineMode) {
          case "windows":
              return "\r\n";

          case "unix":
              return "\n";

          case "auto":
              return this.$autoNewLine;
      }
    },

    this.$autoNewLine = "\n";
    this.$newLineMode = "auto";
    this.setNewLineMode = function(newLineMode) {
        if (this.$newLineMode === newLineMode) return;

        this.$newLineMode = newLineMode;
    };

    this.getNewLineMode = function() {
        return this.$newLineMode;
    };

    this.isNewLine = function(text) {
        return (text == "\r\n" || text == "\r" || text == "\n");
    };

    /**
     * Get a verbatim copy of the given line as it is in the document
     */
    this.getLine = function(row) {
        return this.getLines(row, row + 1)[0] || "";
    };

    this.getLines = function(firstRow, lastRow) {
        return this.$lines.slice(firstRow, lastRow + 1);
    };

    /**
     * Returns all lines in the document as string array. Warning: The caller
     * should not modify this array!
     */
    this.getAllLines = function() {
        return this.getLines(0, this.getLength());
    };

    this.getLength = function() {
        return this.$lines.length;
    };

    this.getTextRange = function(range) {
        if (range.start.row == range.end.row) {
            return this.$lines[range.start.row].substring(range.start.column,
                                                         range.end.column);
        }
        else {
            var lines = [];
            lines.push(this.$lines[range.start.row].substring(range.start.column));
            lines.push.apply(lines, this.getLines(range.start.row+1, range.end.row-1));
            lines.push(this.$lines[range.end.row].substring(0, range.end.column));
            return lines.join(this.getNewLineCharacter());
        }
    };

    this.$clipPosition = function(position) {
        var length = this.getLength();
        if (position.row >= length) {
            position.row = Math.max(0, length - 1);
            position.column = this.getLine(length-1).length;
        }
        return position;
    }

    this.insert = function(position, text) {
        if (text.length == 0)
            return position;

        position = this.$clipPosition(position);

        if (this.getLength() <= 1)
            this.$detectNewLine(text);

        var lines = this.$split(text);
        var firstLine = lines.splice(0, 1)[0];
        var lastLine = lines.length == 0 ? null : lines.splice(lines.length - 1, 1)[0];

        position = this.insertInLine(position, firstLine);
        if (lastLine !== null) {
            position = this.insertNewLine(position); // terminate first line
            position = this.insertLines(position.row, lines);
            position = this.insertInLine(position, lastLine || "");
        }
        return position;
    };

    this.insertLines = function(row, lines) {
        if (lines.length == 0)
            return {row: row, column: 0};

        var args = [row, 0];
        args.push.apply(args, lines);
        this.$lines.splice.apply(this.$lines, args);

        var range = new Range(row, 0, row + lines.length, 0);
        var delta = {
            action: "insertLines",
            range: range,
            lines: lines
        };
        this._dispatchEvent("change", { data: delta });
        return range.end;
    },

    this.insertNewLine = function(position) {
        position = this.$clipPosition(position);
        var line = this.$lines[position.row] || "";
        this.$lines[position.row] = line.substring(0, position.column);
        this.$lines.splice(position.row + 1, 0, line.substring(position.column, line.length));

        var end = {
            row : position.row + 1,
            column : 0
        };

        var delta = {
            action: "insertText",
            range: Range.fromPoints(position, end),
            text: this.getNewLineCharacter()
        };
        this._dispatchEvent("change", { data: delta });

        return end;
    };

    this.insertInLine = function(position, text) {
        if (text.length == 0)
            return position;

        var line = this.$lines[position.row] || "";
        this.$lines[position.row] = line.substring(0, position.column) + text
                + line.substring(position.column);

        var end = {
            row : position.row,
            column : position.column + text.length
        };

        var delta = {
            action: "insertText",
            range: Range.fromPoints(position, end),
            text: text
        };
        this._dispatchEvent("change", { data: delta });

        return end;
    };

    this.remove = function(range) {
        // clip to document
        range.start = this.$clipPosition(range.start);
        range.end = this.$clipPosition(range.end);

        if (range.isEmpty())
            return range.start;

        var firstRow = range.start.row;
        var lastRow = range.end.row;

        if (range.isMultiLine()) {
            var firstFullRow = range.start.column == 0 ? firstRow : firstRow + 1;
            var lastFullRow = lastRow - 1;

            if (range.end.column > 0)
                this.removeInLine(lastRow, 0, range.end.column);

            if (lastFullRow >= firstFullRow)
                this.removeLines(firstFullRow, lastFullRow);

            if (firstFullRow != firstRow) {
                this.removeInLine(firstRow, range.start.column, this.getLine(firstRow).length);
                this.removeNewLine(range.start.row);
            }
        }
        else {
            this.removeInLine(firstRow, range.start.column, range.end.column);
        }
        return range.start;
    };

    this.removeInLine = function(row, startColumn, endColumn) {
        if (startColumn == endColumn)
            return;

        var range = new Range(row, startColumn, row, endColumn);
        var line = this.getLine(row);
        var removed = line.substring(startColumn, endColumn);
        var newLine = line.substring(0, startColumn) + line.substring(endColumn, line.length);
        this.$lines.splice(row, 1, newLine);

        var delta = {
            action: "removeText",
            range: range,
            text: removed
        };
        this._dispatchEvent("change", { data: delta });
        return range.start;
    };

    /**
     * Removes a range of full lines
     *
     * @param firstRow {Integer} The first row to be removed
     * @param lastRow {Integer} The last row to be removed
     * @return {String[]} The removed lines
     */
    this.removeLines = function(firstRow, lastRow) {
        var range = new Range(firstRow, 0, lastRow + 1, 0);
        var removed = this.$lines.splice(firstRow, lastRow - firstRow + 1);

        var delta = {
            action: "removeLines",
            range: range,
            nl: this.getNewLineCharacter(),
            lines: removed
        };
        this._dispatchEvent("change", { data: delta });
        return removed;
    };

    this.removeNewLine = function(row) {
        var firstLine = this.getLine(row);
        var secondLine = this.getLine(row+1);

        var range = new Range(row, firstLine.length, row+1, 0);
        var line = firstLine + secondLine;

        this.$lines.splice(row, 2, line);

        var delta = {
            action: "removeText",
            range: range,
            text: this.getNewLineCharacter()
        };
        this._dispatchEvent("change", { data: delta });
    };

    this.replace = function(range, text) {
        if (text.length == 0 && range.isEmpty())
            return range.start;

        // Shortcut: If the text we want to insert is the same as it is already
        // in the document, we don't have to replace anything.
        if (text == this.getTextRange(range))
            return range.end;

        this.remove(range);
        if (text) {
            var end = this.insert(range.start, text);
        }
        else {
            end = range.start;
        }

        return end;
    };

    this.applyDeltas = function(deltas) {
        for (var i=0; i<deltas.length; i++) {
            var delta = deltas[i];
            var range = Range.fromPoints(delta.range.start, delta.range.end);

            if (delta.action == "insertLines")
                this.insertLines(range.start.row, delta.lines)
            else if (delta.action == "insertText")
                this.insert(range.start, delta.text)
            else if (delta.action == "removeLines")
                this.removeLines(range.start.row, range.end.row - 1)
            else if (delta.action == "removeText")
                this.remove(range)
        }
    };

    this.revertDeltas = function(deltas) {
        for (var i=deltas.length-1; i>=0; i--) {
            var delta = deltas[i];
            var range = Range.fromPoints(delta.range.start, delta.range.end);

            if (delta.action == "insertLines")
                this.removeLines(range.start.row, range.end.row - 1)
            else if (delta.action == "insertText")
                this.remove(range)
            else if (delta.action == "removeLines")
                this.insertLines(range.start.row, delta.lines)
            else if (delta.action == "removeText")
                this.insert(range.start, delta.text)
        }
    };

}).call(Document.prototype);

exports.Document = Document;
});
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Ajax.org Code Editor (ACE).
 *
 * The Initial Developer of the Original Code is
 * Ajax.org B.V.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Fabian Jakobs <fabian AT ajax DOT org>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define('ace/range', ['require', 'exports', 'module' ], function(require, exports, module) {

var Range = function(startRow, startColumn, endRow, endColumn) {
    this.start = {
        row: startRow,
        column: startColumn
    };

    this.end = {
        row: endRow,
        column: endColumn
    };
};

(function() {

    this.toString = function() {
        return ("Range: [" + this.start.row + "/" + this.start.column +
            "] -> [" + this.end.row + "/" + this.end.column + "]");
    };

    this.contains = function(row, column) {
        return this.compare(row, column) == 0;
    };

    this.compare = function(row, column) {
        if (!this.isMultiLine()) {
            if (row === this.start.row) {
                return column < this.start.column ? -1 : (column > this.end.column ? 1 : 0);
            };
        }

        if (row < this.start.row)
            return -1;

        if (row > this.end.row)
            return 1;

        if (this.start.row === row)
            return column >= this.start.column ? 0 : -1;

        if (this.end.row === row)
            return column <= this.end.column ? 0 : 1;

        return 0;
    };

    this.clipRows = function(firstRow, lastRow) {
        if (this.end.row > lastRow) {
            var end = {
                row: lastRow+1,
                column: 0
            };
        }

        if (this.start.row > lastRow) {
            var start = {
                row: lastRow+1,
                column: 0
            };
        }

        if (this.start.row < firstRow) {
            var start = {
                row: firstRow,
                column: 0
            };
        }

        if (this.end.row < firstRow) {
            var end = {
                row: firstRow,
                column: 0
            };
        }
        return Range.fromPoints(start || this.start, end || this.end);
    };

    this.extend = function(row, column) {
        var cmp = this.compare(row, column);

        if (cmp == 0)
            return this;
        else if (cmp == -1)
            var start = {row: row, column: column};
        else
            var end = {row: row, column: column};

        return Range.fromPoints(start || this.start, end || this.end);
    };

    this.isEmpty = function() {
        return (this.start.row == this.end.row && this.start.column == this.end.column);
    };

    this.isMultiLine = function() {
        return (this.start.row !== this.end.row);
    };

    this.clone = function() {
        return Range.fromPoints(this.start, this.end);
    };

    this.collapseRows = function() {
        if (this.end.column == 0)
            return new Range(this.start.row, 0, Math.max(this.start.row, this.end.row-1), 0)
        else
            return new Range(this.start.row, 0, this.end.row, 0)
    };

    this.toScreenRange = function(session) {
        var screenPosStart =
            session.documentToScreenPosition(this.start);
        var screenPosEnd =
            session.documentToScreenPosition(this.end);
        return new Range(
            screenPosStart.row, screenPosStart.column,
            screenPosEnd.row, screenPosEnd.column
        );
    };

}).call(Range.prototype);


Range.fromPoints = function(start, end) {
    return new Range(start.row, start.column, end.row, end.column);
};

exports.Range = Range;
});
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Ajax.org Code Editor (ACE).
 *
 * The Initial Developer of the Original Code is
 * Ajax.org B.V.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Fabian Jakobs <fabian AT ajax DOT org>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define('ace/anchor', ['require', 'exports', 'module' , 'pilot/oop', 'pilot/event_emitter'], function(require, exports, module) {

var oop = require("pilot/oop");
var EventEmitter = require("pilot/event_emitter").EventEmitter;

/**
 * An Anchor is a floating pointer in the document. Whenever text is inserted or
 * deleted before the cursor, the position of the cursor is updated
 */
var Anchor = exports.Anchor = function(doc, row, column) {
    this.document = doc;
    
    if (typeof column == "undefined")
        this.setPosition(row.row, row.column);
    else
        this.setPosition(row, column);

    this.$onChange = this.onChange.bind(this);
    doc.on("change", this.$onChange);
};

(function() {

    oop.implement(this, EventEmitter);
    
    this.getPosition = function() {
        return this.$clipPositionToDocument(this.row, this.column);
    };
    
    this.getDocument = function() {
        return this.document;
    };
    
    this.onChange = function(e) {
        var delta = e.data;
        var range = delta.range;
            
        if (range.start.row == range.end.row && range.start.row != this.row)
            return;
            
        if (range.start.row > this.row)
            return;
            
        if (range.start.row == this.row && range.start.column > this.column)
            return;
    
        var row = this.row;
        var column = this.column;
        
        if (delta.action === "insertText") {
            if (range.start.row === row && range.start.column <= column) {
                if (range.start.row === range.end.row) {
                    column += range.end.column - range.start.column;
                }
                else {
                    column -= range.start.column;
                    row += range.end.row - range.start.row;
                }
            }
            else if (range.start.row !== range.end.row && range.start.row < row) {
                row += range.end.row - range.start.row;
            }
        } else if (delta.action === "insertLines") {
            if (range.start.row <= row) {
                row += range.end.row - range.start.row;
            }
        }
        else if (delta.action == "removeText") {
            if (range.start.row == row && range.start.column < column) {
                if (range.end.column >= column)
                    column = range.start.column;
                else
                    column = Math.max(0, column - (range.end.column - range.start.column));
                
            } else if (range.start.row !== range.end.row && range.start.row < row) {
                if (range.end.row == row) {
                    column = Math.max(0, column - range.end.column) + range.start.column;
                }
                row -= (range.end.row - range.start.row);
            }
            else if (range.end.row == row) {
                row -= range.end.row - range.start.row;
                column = Math.max(0, column - range.end.column) + range.start.column;
            }
        } else if (delta.action == "removeLines") {
            if (range.start.row <= row) {
                if (range.end.row <= row)
                    row -= range.end.row - range.start.row;
                else {
                    row = range.start.row;
                    column = 0;
                }
            }
        }

        this.setPosition(row, column, true);
    };

    this.setPosition = function(row, column, noClip) {
        if (noClip) {
            pos = {
                row: row,
                column: column
            };
        }
        else {
            pos = this.$clipPositionToDocument(row, column);
        }
        
        if (this.row == pos.row && this.column == pos.column)
            return;
            
        var old = {
            row: this.row,
            column: this.column
        };
        
        this.row = pos.row;
        this.column = pos.column;
        this._dispatchEvent("change", {
            old: old,
            value: pos
        });
    };
    
    this.detach = function() {
        this.document.removeEventListener("change", this.$onChange);
    };
    
    this.$clipPositionToDocument = function(row, column) {
        var pos = {};
    
        if (row >= this.document.getLength()) {
            pos.row = Math.max(0, this.document.getLength() - 1);
            pos.column = this.document.getLine(pos.row).length;
        }
        else if (row < 0) {
            pos.row = 0;
            pos.column = 0;
        }
        else {
            pos.row = row;
            pos.column = Math.min(this.document.getLine(pos.row).length, Math.max(0, column));
        }
        
        if (column < 0)
            pos.column = 0;
            
        return pos;
    };
    
}).call(Anchor.prototype);

});
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Ajax.org Code Editor (ACE).
 *
 * The Initial Developer of the Original Code is
 * Ajax.org B.V.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Fabian Jakobs <fabian AT ajax DOT org>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define('pilot/lang', ['require', 'exports', 'module' ], function(require, exports, module) {

exports.stringReverse = function(string) {
    return string.split("").reverse().join("");
};

exports.stringRepeat = function (string, count) {
     return new Array(count + 1).join(string);
};

exports.copyObject = function(obj) {
    var copy = {};
    for (var key in obj) {
        copy[key] = obj[key];
    }
    return copy;
};

exports.arrayToMap = function(arr) {
    var map = {};
    for (var i=0; i<arr.length; i++) {
        map[arr[i]] = 1;
    }
    return map;

};

/**
 * splice out of 'array' anything that === 'value'
 */
exports.arrayRemove = function(array, value) {
  for (var i = 0; i <= array.length; i++) {
    if (value === array[i]) {
      array.splice(i, 1);
    }
  }
};

exports.escapeRegExp = function(str) {
    return str.replace(/([.*+?^${}()|[\]\/\\])/g, '\\$1');
};

exports.deferredCall = function(fcn) {

    var timer = null;
    var callback = function() {
        timer = null;
        fcn();
    };

    return {
        schedule: function(timeout) {
            if (!timer) {
                timer = setTimeout(callback, timeout || 0);
            }
            return this;
        },

        call: function() {
            this.cancel();
            fcn();
            return this;
        },

        cancel: function() {
            clearTimeout(timer);
            timer = null;
            return this;
        }
    };
};

});
/*
 * JSHint, by JSHint Community.
 *
 * Licensed under the same slightly modified MIT license that JSLint is.
 * It stops evil-doers everywhere.
 *
 * JSHint is a derivative work of JSLint:
 *
 *   Copyright (c) 2002 Douglas Crockford  (www.JSLint.com)
 *
 *   Permission is hereby granted, free of charge, to any person obtaining
 *   a copy of this software and associated documentation files (the "Software"),
 *   to deal in the Software without restriction, including without limitation
 *   the rights to use, copy, modify, merge, publish, distribute, sublicense,
 *   and/or sell copies of the Software, and to permit persons to whom
 *   the Software is furnished to do so, subject to the following conditions:
 *
 *   The above copyright notice and this permission notice shall be included
 *   in all copies or substantial portions of the Software.
 *
 *   The Software shall be used for Good, not Evil.
 *
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *   FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 *   DEALINGS IN THE SOFTWARE.
 *
 * JSHint was forked from 2010-12-16 edition of JSLint.
 *
 */

define('ace/worker/jshint', ['require', 'exports', 'module' ], function(require, exports, module) {

/*
 JSHINT is a global function. It takes two parameters.

     var myResult = JSHINT(source, option);

 The first parameter is either a string or an array of strings. If it is a
 string, it will be split on '\n' or '\r'. If it is an array of strings, it
 is assumed that each string represents one line. The source can be a
 JavaScript text, or HTML text, or a JSON text, or a CSS text.

 The second parameter is an optional object of options which control the
 operation of JSHINT. Most of the options are booleans: They are all
 optional and have a default value of false. One of the options, predef,
 can be an array of names, which will be used to declare global variables,
 or an object whose keys are used as global names, with a boolean value
 that determines if they are assignable.

 If it checks out, JSHINT returns true. Otherwise, it returns false.

 If false, you can inspect JSHINT.errors to find out the problems.
 JSHINT.errors is an array of objects containing these members:

 {
     line      : The line (relative to 0) at which the lint was found
     character : The character (relative to 0) at which the lint was found
     reason    : The problem
     evidence  : The text line in which the problem occurred
     raw       : The raw message before the details were inserted
     a         : The first detail
     b         : The second detail
     c         : The third detail
     d         : The fourth detail
 }

 If a fatal error was found, a null will be the last element of the
 JSHINT.errors array.

 You can request a Function Report, which shows all of the functions
 and the parameters and vars that they use. This can be used to find
 implied global variables and other problems. The report is in HTML and
 can be inserted in an HTML <body>.

     var myReport = JSHINT.report(limited);

 If limited is true, then the report will be limited to only errors.

 You can request a data structure which contains JSHint's results.

     var myData = JSHINT.data();

 It returns a structure with this form:

 {
     errors: [
         {
             line: NUMBER,
             character: NUMBER,
             reason: STRING,
             evidence: STRING
         }
     ],
     functions: [
         name: STRING,
         line: NUMBER,
         last: NUMBER,
         param: [
             STRING
         ],
         closure: [
             STRING
         ],
         var: [
             STRING
         ],
         exception: [
             STRING
         ],
         outer: [
             STRING
         ],
         unused: [
             STRING
         ],
         global: [
             STRING
         ],
         label: [
             STRING
         ]
     ],
     globals: [
         STRING
     ],
     member: {
         STRING: NUMBER
     },
     unuseds: [
         {
             name: STRING,
             line: NUMBER
         }
     ],
     implieds: [
         {
             name: STRING,
             line: NUMBER
         }
     ],
     urls: [
         STRING
     ],
     json: BOOLEAN
 }

 Empty arrays will not be included.

*/

/*jshint
 evil: true, nomen: false, onevar: false, regexp: false, strict: true, boss: true
*/

/*members "\b", "\t", "\n", "\f", "\r", "!=", "!==", "\"", "%",
 "(begin)", "(breakage)", "(context)", "(error)", "(global)",
 "(identifier)", "(last)", "(line)", "(loopage)", "(name)", "(onevar)",
 "(params)", "(scope)", "(statement)", "(verb)", "*", "+", "++", "-",
 "--", "\/", "<", "<=", "==", "===", ">", ">=", ADSAFE, __filename, __dirname,
 ActiveXObject, Array, Boolean, Buffer, COM, CScript, Canvas, CustomAnimation,
 Date, Debug, E, Enumerator, Error, EvalError, FadeAnimation, Flash,
 FormField, Frame, Function, HotKey, Image, JSON, LN10, LN2, LOG10E,
 LOG2E, MAX_VALUE, MIN_VALUE, Math, MenuItem, MoveAnimation,
 NEGATIVE_INFINITY, Number, Object, Option, PI, POSITIVE_INFINITY, Point,
 RangeError, Rectangle, ReferenceError, RegExp, ResizeAnimation,
 RotateAnimation, SQRT1_2, SQRT2, ScrollBar, String, Style, SyntaxError,
 System, Text, TextArea, Timer, TypeError, URIError, URL, VBArray,
 WScript, Web, Window, XMLDOM, XMLHttpRequest, "\\", a, abbr, acronym,
 activeborder, activecaption, addEventListener, address, adsafe, alert,
 aliceblue, all, animator, antiquewhite, appleScript, applet, apply,
 approved, appworkspace, aqua, aquamarine, area, arguments, arity,
 article, aside, audio, autocomplete, azure, b, background,
 "background-attachment", "background-color", "background-image",
 "background-position", "background-repeat", base, bdo, beep, beige, big,
 bisque, bitwise, black, blanchedalmond, block, blockquote, blue,
 blueviolet, blur, body, border, "border-bottom", "border-bottom-color",
 "border-bottom-style", "border-bottom-width", "border-collapse",
 "border-color", "border-left", "border-left-color", "border-left-style",
 "border-left-width", "border-right", "border-right-color",
 "border-right-style", "border-right-width", "border-spacing",
 "border-style", "border-top", "border-top-color", "border-top-style",
 "border-top-width", "border-width", bottom, boss, br, braille, brown, browser,
 burlywood, button, buttonface, buttonhighlight, buttonshadow,
 buttontext, bytesToUIString, c, cadetblue, call, callee, caller, canvas,
 cap, caption, "caption-side", captiontext, cases, center, charAt,
 charCodeAt, character, chartreuse, chocolate, chooseColor, chooseFile,
 chooseFolder, cite, clear, clearInterval, clearTimeout, clip, close,
 closeWidget, closed, closure, cm, code, col, colgroup, color, command,
 comment, condition, confirm, console, constructor, content,
 convertPathToHFS, convertPathToPlatform, coral, cornflowerblue,
 cornsilk, "counter-increment", "counter-reset", create, crimson, css, curly,
 cursor, cyan, d, darkblue, darkcyan, darkgoldenrod, darkgray, darkgreen,
 darkkhaki, darkmagenta, darkolivegreen, darkorange, darkorchid, darkred,
 darksalmon, darkseagreen, darkslateblue, darkslategray, darkturquoise,
 darkviolet, data, datalist, dd, debug, decodeURI, decodeURIComponent,
 deeppink, deepskyblue, defaultStatus, defineClass, del, deserialize,
 details, devel, dfn, dialog, dimgray, dir, direction, display, div, dl,
 document, dodgerblue, dt, edition, else, em, embed, embossed, empty,
 "empty-cells", encodeURI, encodeURIComponent, entityify, eqeqeq, errors,
 es5, escape, eval, event, evidence, evil, ex, exception, exec, exps, exports,
 fieldset, figure, filesystem, firebrick, first, float, floor,
 floralwhite, focus, focusWidget, font, "font-family", "font-size",
 "font-size-adjust", "font-stretch", "font-style", "font-variant",
 "font-weight", footer, forestgreen, forin, form, fragment, frame,
 frames, frameset, from, fromCharCode, fuchsia, fud, funct, function,
 functions, g, gainsboro, gc, getComputedStyle, ghostwhite, GLOBAL, global,
 globals, gold, goldenrod, gray, graytext, green, greenyellow, h1, h2,
 h3, h4, h5, h6, handheld, hasOwnProperty, head, header, height, help,
 hgroup, highlight, highlighttext, history, honeydew, hotpink, hr,
 "hta:application", html, i, iTunes, id, identifier, iframe, img, immed,
 implieds, in, inactiveborder, inactivecaption, inactivecaptiontext,
 include, indent, indexOf, indianred, indigo, infobackground, infotext,
 init, input, ins, isAlpha, isApplicationRunning, isArray, isDigit,
 isFinite, isNaN, ivory, join, jshint, JSHINT, json, kbd, keygen, keys, khaki,
 konfabulatorVersion, label, labelled, lang, last, lavender,
 lavenderblush, lawngreen, laxbreak, lbp, led, left, legend,
 lemonchiffon, length, "letter-spacing", li, lib, lightblue, lightcoral,
 lightcyan, lightgoldenrodyellow, lightgreen, lightpink, lightsalmon,
 lightseagreen, lightskyblue, lightslategray, lightsteelblue,
 lightyellow, lime, limegreen, line, "line-height", linen, link,
 "list-style", "list-style-image", "list-style-position",
 "list-style-type", load, loadClass, location, log, m, magenta, map,
 margin, "margin-bottom", "margin-left", "margin-right", "margin-top",
 mark, "marker-offset", maroon, match, "max-height", "max-width", maxerr,
 maxlen, md5, mediumaquamarine, mediumblue, mediumorchid, mediumpurple,
 mediumseagreen, mediumslateblue, mediumspringgreen, mediumturquoise,
 mediumvioletred, member, menu, menutext, message, meta, meter,
 midnightblue, "min-height", "min-width", mintcream, mistyrose, mm,
 moccasin, module, moveBy, moveTo, name, nav, navajowhite, navigator, navy, new,
 newcap, noarg, node, noempty, noframes, nomen, nonew, noscript, nud, object, ol,
 oldlace, olive, olivedrab, on, onbeforeunload, onblur, onerror, onevar,
 onfocus, onload, onresize, onunload, opacity, open, openURL, opener, opera,
 optgroup, option, orange, orangered, orchid, outer, outline, "outline-color",
 "outline-style", "outline-width", output, overflow, "overflow-x",
 "overflow-y", p, padding, "padding-bottom", "padding-left",
 "padding-right", "padding-top", "page-break-after", "page-break-before",
 palegoldenrod, palegreen, paleturquoise, palevioletred, papayawhip,
 param, parent, parseFloat, parseInt, passfail, pc, peachpuff, peru,
 pink, play, plum, plusplus, pop, popupMenu, position, powderblue, pre,
 predef, preferenceGroups, preferences, print, process, progress, projection,
 prompt, prototype, pt, purple, push, px, q, quit, quotes, random, range,
 raw, reach, readFile, readUrl, reason, red, regexp, reloadWidget,
 removeEventListener, replace, report, require, reserved, resizeBy, resizeTo,
 resolvePath, resumeUpdates, rhino, right, rosybrown, royalblue, rp, rt,
 ruby, runCommand, runCommandInBg, saddlebrown, safe, salmon, samp,
 sandybrown, saveAs, savePreferences, screen, script, scroll, scrollBy,
 scrollTo, scrollbar, seagreen, seal, search, seashell, section, select,
 serialize, setInterval, setTimeout, shift, showWidgetPreferences,
 sienna, silver, skyblue, slateblue, slategray, sleep, slice, small,
 snow, sort, source, span, spawn, speak, speech, split, springgreen, src,
 stack, status, steelblue, strict, strong, style, styleproperty, sub,
 substr, sup, supplant, suppressUpdates, sync, system, table,
 "table-layout", tan, tbody, td, teal, tellWidget, test, "text-align",
 "text-decoration", "text-indent", "text-shadow", "text-transform",
 textarea, tfoot, th, thead, thistle, threeddarkshadow, threedface,
 threedhighlight, threedlightshadow, threedshadow, time, title,
 toLowerCase, toString, toUpperCase, toint32, token, tomato, top, tr, tt,
 tty, turquoise, tv, type, u, ul, undef, unescape, "unicode-bidi",
 unused, unwatch, updateNow, urls, value, valueOf, var, version,
 "vertical-align", video, violet, visibility, watch, wheat, white,
 "white-space", whitesmoke, widget, width, window, windowframe, windows,
 windowtext, "word-spacing", "word-wrap", yahooCheckLogin, yahooLogin,
 yahooLogout, yellow, yellowgreen, "z-index"
*/

/*global exports: false */

// We build the application inside a function so that we produce only a single
// global variable. That function will be invoked immediately, and its return
// value is the JSHINT function itself.

var JSHINT = (function () {
    "use strict";

    var adsafe_id,      // The widget's ADsafe id.
        adsafe_may,     // The widget may load approved scripts.
        adsafe_went,    // ADSAFE.go has been called.
        anonname,       // The guessed name for anonymous functions.
        approved,       // ADsafe approved urls.

// These are operators that should not be used with the ! operator.

        bang = {
            '<'  : true,
            '<=' : true,
            '==' : true,
            '===': true,
            '!==': true,
            '!=' : true,
            '>'  : true,
            '>=' : true,
            '+'  : true,
            '-'  : true,
            '*'  : true,
            '/'  : true,
            '%'  : true
        },

// These are property names that should not be permitted in the safe subset.

        banned = { // the member names that ADsafe prohibits.
            'arguments'     : true,
            callee          : true,
            caller          : true,
            constructor     : true,
            'eval'          : true,
            prototype       : true,
            stack           : true,
            unwatch         : true,
            valueOf         : true,
            watch           : true
        },


// These are the JSHint boolean options.

        boolOptions = {
            adsafe     : true, // if ADsafe should be enforced
            bitwise    : true, // if bitwise operators should not be allowed
            boss       : true, // if assignments inside if/for/while/do should be allowed
            browser    : true, // if the standard browser globals should be predefined
            cap        : true, // if upper case HTML should be allowed
            css        : true, // if CSS workarounds should be tolerated
            curly      : true, // if curly braces around blocks should be required (even in if/for/while)
            debug      : true, // if debugger statements should be allowed
            devel      : true, // if logging should be allowed (console, alert, etc.)
            eqeqeq     : true, // if === should be required
            es5        : true, // if ES5 syntax should be allowed
            evil       : true, // if eval should be allowed
            forin      : true, // if for in statements must filter
            fragment   : true, // if HTML fragments should be allowed
            immed      : true, // if immediate invocations must be wrapped in parens
            laxbreak   : true, // if line breaks should not be checked
            newcap     : true, // if constructor names must be capitalized
            noarg      : true, // if arguments.caller and arguments.callee should be disallowed
            node       : true, // if the Node.js environment globals should be predefined
            noempty    : true, // if empty blocks should be disallowed
            nonew      : true, // if using `new` for side-effects should be disallowed
            nomen      : true, // if names should be checked
            on         : true, // if HTML event handlers should be allowed
            onevar     : true, // if only one var statement per function should be allowed
            passfail   : true, // if the scan should stop on first error
            plusplus   : true, // if increment/decrement should not be allowed
            regexp     : true, // if the . should not be allowed in regexp literals
            rhino      : true, // if the Rhino environment globals should be predefined
            undef      : true, // if variables should be declared before used
            safe       : true, // if use of some browser features should be restricted
            windows    : true, // if MS Windows-specigic globals should be predefined
            strict     : true, // require the "use strict"; pragma
            sub        : true, // if all forms of subscript notation are tolerated
            white      : true, // if strict whitespace rules apply
            widget     : true  // if the Yahoo Widgets globals should be predefined
        },

// browser contains a set of global names which are commonly provided by a
// web browser environment.

        browser = {
            addEventListener: false,
            blur            : false,
            clearInterval   : false,
            clearTimeout    : false,
            close           : false,
            closed          : false,
            defaultStatus   : false,
            document        : false,
            event           : false,
            focus           : false,
            frames          : false,
            getComputedStyle: false,
            history         : false,
            Image           : false,
            length          : false,
            location        : false,
            moveBy          : false,
            moveTo          : false,
            name            : false,
            navigator       : false,
            onbeforeunload  : true,
            onblur          : true,
            onerror         : true,
            onfocus         : true,
            onload          : true,
            onresize        : true,
            onunload        : true,
            open            : false,
            opener          : false,
            Option          : false,
            parent          : false,
            print           : false,
            removeEventListener: false,
            resizeBy        : false,
            resizeTo        : false,
            screen          : false,
            scroll          : false,
            scrollBy        : false,
            scrollTo        : false,
            setInterval     : false,
            setTimeout      : false,
            status          : false,
            top             : false,
            window          : false,
            XMLHttpRequest  : false
        },

        cssAttributeData,
        cssAny,

        cssColorData = {
            "aliceblue"             : true,
            "antiquewhite"          : true,
            "aqua"                  : true,
            "aquamarine"            : true,
            "azure"                 : true,
            "beige"                 : true,
            "bisque"                : true,
            "black"                 : true,
            "blanchedalmond"        : true,
            "blue"                  : true,
            "blueviolet"            : true,
            "brown"                 : true,
            "burlywood"             : true,
            "cadetblue"             : true,
            "chartreuse"            : true,
            "chocolate"             : true,
            "coral"                 : true,
            "cornflowerblue"        : true,
            "cornsilk"              : true,
            "crimson"               : true,
            "cyan"                  : true,
            "darkblue"              : true,
            "darkcyan"              : true,
            "darkgoldenrod"         : true,
            "darkgray"              : true,
            "darkgreen"             : true,
            "darkkhaki"             : true,
            "darkmagenta"           : true,
            "darkolivegreen"        : true,
            "darkorange"            : true,
            "darkorchid"            : true,
            "darkred"               : true,
            "darksalmon"            : true,
            "darkseagreen"          : true,
            "darkslateblue"         : true,
            "darkslategray"         : true,
            "darkturquoise"         : true,
            "darkviolet"            : true,
            "deeppink"              : true,
            "deepskyblue"           : true,
            "dimgray"               : true,
            "dodgerblue"            : true,
            "firebrick"             : true,
            "floralwhite"           : true,
            "forestgreen"           : true,
            "fuchsia"               : true,
            "gainsboro"             : true,
            "ghostwhite"            : true,
            "gold"                  : true,
            "goldenrod"             : true,
            "gray"                  : true,
            "green"                 : true,
            "greenyellow"           : true,
            "honeydew"              : true,
            "hotpink"               : true,
            "indianred"             : true,
            "indigo"                : true,
            "ivory"                 : true,
            "khaki"                 : true,
            "lavender"              : true,
            "lavenderblush"         : true,
            "lawngreen"             : true,
            "lemonchiffon"          : true,
            "lightblue"             : true,
            "lightcoral"            : true,
            "lightcyan"             : true,
            "lightgoldenrodyellow"  : true,
            "lightgreen"            : true,
            "lightpink"             : true,
            "lightsalmon"           : true,
            "lightseagreen"         : true,
            "lightskyblue"          : true,
            "lightslategray"        : true,
            "lightsteelblue"        : true,
            "lightyellow"           : true,
            "lime"                  : true,
            "limegreen"             : true,
            "linen"                 : true,
            "magenta"               : true,
            "maroon"                : true,
            "mediumaquamarine"      : true,
            "mediumblue"            : true,
            "mediumorchid"          : true,
            "mediumpurple"          : true,
            "mediumseagreen"        : true,
            "mediumslateblue"       : true,
            "mediumspringgreen"     : true,
            "mediumturquoise"       : true,
            "mediumvioletred"       : true,
            "midnightblue"          : true,
            "mintcream"             : true,
            "mistyrose"             : true,
            "moccasin"              : true,
            "navajowhite"           : true,
            "navy"                  : true,
            "oldlace"               : true,
            "olive"                 : true,
            "olivedrab"             : true,
            "orange"                : true,
            "orangered"             : true,
            "orchid"                : true,
            "palegoldenrod"         : true,
            "palegreen"             : true,
            "paleturquoise"         : true,
            "palevioletred"         : true,
            "papayawhip"            : true,
            "peachpuff"             : true,
            "peru"                  : true,
            "pink"                  : true,
            "plum"                  : true,
            "powderblue"            : true,
            "purple"                : true,
            "red"                   : true,
            "rosybrown"             : true,
            "royalblue"             : true,
            "saddlebrown"           : true,
            "salmon"                : true,
            "sandybrown"            : true,
            "seagreen"              : true,
            "seashell"              : true,
            "sienna"                : true,
            "silver"                : true,
            "skyblue"               : true,
            "slateblue"             : true,
            "slategray"             : true,
            "snow"                  : true,
            "springgreen"           : true,
            "steelblue"             : true,
            "tan"                   : true,
            "teal"                  : true,
            "thistle"               : true,
            "tomato"                : true,
            "turquoise"             : true,
            "violet"                : true,
            "wheat"                 : true,
            "white"                 : true,
            "whitesmoke"            : true,
            "yellow"                : true,
            "yellowgreen"           : true,

            "activeborder"          : true,
            "activecaption"         : true,
            "appworkspace"          : true,
            "background"            : true,
            "buttonface"            : true,
            "buttonhighlight"       : true,
            "buttonshadow"          : true,
            "buttontext"            : true,
            "captiontext"           : true,
            "graytext"              : true,
            "highlight"             : true,
            "highlighttext"         : true,
            "inactiveborder"        : true,
            "inactivecaption"       : true,
            "inactivecaptiontext"   : true,
            "infobackground"        : true,
            "infotext"              : true,
            "menu"                  : true,
            "menutext"              : true,
            "scrollbar"             : true,
            "threeddarkshadow"      : true,
            "threedface"            : true,
            "threedhighlight"       : true,
            "threedlightshadow"     : true,
            "threedshadow"          : true,
            "window"                : true,
            "windowframe"           : true,
            "windowtext"            : true
        },

        cssBorderStyle,
        cssBreak,

        cssLengthData = {
            '%': true,
            'cm': true,
            'em': true,
            'ex': true,
            'in': true,
            'mm': true,
            'pc': true,
            'pt': true,
            'px': true
        },

        cssMedia,
        cssOverflow,

        devel = {
            alert           : false,
            confirm         : false,
            console         : false,
            Debug           : false,
            opera           : false,
            prompt          : false
        },

        escapes = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '/' : '\\/',
            '\\': '\\\\'
        },

        funct,          // The current function

        functionicity = [
            'closure', 'exception', 'global', 'label',
            'outer', 'unused', 'var'
        ],

        functions,      // All of the functions

        global,         // The global scope
        htmltag = {
            a:        {},
            abbr:     {},
            acronym:  {},
            address:  {},
            applet:   {},
            area:     {empty: true, parent: ' map '},
            article:  {},
            aside:    {},
            audio:    {},
            b:        {},
            base:     {empty: true, parent: ' head '},
            bdo:      {},
            big:      {},
            blockquote: {},
            body:     {parent: ' html noframes '},
            br:       {empty: true},
            button:   {},
            canvas:   {parent: ' body p div th td '},
            caption:  {parent: ' table '},
            center:   {},
            cite:     {},
            code:     {},
            col:      {empty: true, parent: ' table colgroup '},
            colgroup: {parent: ' table '},
            command:  {parent: ' menu '},
            datalist: {},
            dd:       {parent: ' dl '},
            del:      {},
            details:  {},
            dialog:   {},
            dfn:      {},
            dir:      {},
            div:      {},
            dl:       {},
            dt:       {parent: ' dl '},
            em:       {},
            embed:    {},
            fieldset: {},
            figure:   {},
            font:     {},
            footer:   {},
            form:     {},
            frame:    {empty: true, parent: ' frameset '},
            frameset: {parent: ' html frameset '},
            h1:       {},
            h2:       {},
            h3:       {},
            h4:       {},
            h5:       {},
            h6:       {},
            head:     {parent: ' html '},
            header:   {},
            hgroup:   {},
            hr:       {empty: true},
            'hta:application':
                      {empty: true, parent: ' head '},
            html:     {parent: '*'},
            i:        {},
            iframe:   {},
            img:      {empty: true},
            input:    {empty: true},
            ins:      {},
            kbd:      {},
            keygen:   {},
            label:    {},
            legend:   {parent: ' details fieldset figure '},
            li:       {parent: ' dir menu ol ul '},
            link:     {empty: true, parent: ' head '},
            map:      {},
            mark:     {},
            menu:     {},
            meta:     {empty: true, parent: ' head noframes noscript '},
            meter:    {},
            nav:      {},
            noframes: {parent: ' html body '},
            noscript: {parent: ' body head noframes '},
            object:   {},
            ol:       {},
            optgroup: {parent: ' select '},
            option:   {parent: ' optgroup select '},
            output:   {},
            p:        {},
            param:    {empty: true, parent: ' applet object '},
            pre:      {},
            progress: {},
            q:        {},
            rp:       {},
            rt:       {},
            ruby:     {},
            samp:     {},
            script:   {empty: true, parent: ' body div frame head iframe p pre span '},
            section:  {},
            select:   {},
            small:    {},
            span:     {},
            source:   {},
            strong:   {},
            style:    {parent: ' head ', empty: true},
            sub:      {},
            sup:      {},
            table:    {},
            tbody:    {parent: ' table '},
            td:       {parent: ' tr '},
            textarea: {},
            tfoot:    {parent: ' table '},
            th:       {parent: ' tr '},
            thead:    {parent: ' table '},
            time:     {},
            title:    {parent: ' head '},
            tr:       {parent: ' table tbody thead tfoot '},
            tt:       {},
            u:        {},
            ul:       {},
            'var':    {},
            video:    {}
        },

        ids,            // HTML ids
        implied,        // Implied globals
        inblock,
        indent,
        jsonmode,
        lines,
        lookahead,
        member,
        membersOnly,
        nexttoken,

        node = {
            __filename  : false,
            __dirname   : false,
            Buffer      : false,
            GLOBAL      : false,
            global      : false,
            module      : false,
            process     : false,
            require     : false
        },

        noreach,
        option,
        predefined,     // Global variables defined by option
        prereg,
        prevtoken,

        rhino = {
            defineClass : false,
            deserialize : false,
            gc          : false,
            help        : false,
            load        : false,
            loadClass   : false,
            print       : false,
            quit        : false,
            readFile    : false,
            readUrl     : false,
            runCommand  : false,
            seal        : false,
            serialize   : false,
            spawn       : false,
            sync        : false,
            toint32     : false,
            version     : false
        },

        scope,      // The current scope
        src,
        stack,

// standard contains the global names that are provided by the
// ECMAScript standard.

        standard = {
            Array               : false,
            Boolean             : false,
            Date                : false,
            decodeURI           : false,
            decodeURIComponent  : false,
            encodeURI           : false,
            encodeURIComponent  : false,
            Error               : false,
            'eval'              : false,
            EvalError           : false,
            Function            : false,
            hasOwnProperty      : false,
            isFinite            : false,
            isNaN               : false,
            JSON                : false,
            Math                : false,
            Number              : false,
            Object              : false,
            parseInt            : false,
            parseFloat          : false,
            RangeError          : false,
            ReferenceError      : false,
            RegExp              : false,
            String              : false,
            SyntaxError         : false,
            TypeError           : false,
            URIError            : false
        },

        standard_member = {
            E                   : true,
            LN2                 : true,
            LN10                : true,
            LOG2E               : true,
            LOG10E              : true,
            MAX_VALUE           : true,
            MIN_VALUE           : true,
            NEGATIVE_INFINITY   : true,
            PI                  : true,
            POSITIVE_INFINITY   : true,
            SQRT1_2             : true,
            SQRT2               : true
        },

        strict_mode,
        syntax = {},
        tab,
        token,
        urls,
        warnings,

// widget contains the global names which are provided to a Yahoo
// (fna Konfabulator) widget.

        widget = {
            alert                   : true,
            animator                : true,
            appleScript             : true,
            beep                    : true,
            bytesToUIString         : true,
            Canvas                  : true,
            chooseColor             : true,
            chooseFile              : true,
            chooseFolder            : true,
            closeWidget             : true,
            COM                     : true,
            convertPathToHFS        : true,
            convertPathToPlatform   : true,
            CustomAnimation         : true,
            escape                  : true,
            FadeAnimation           : true,
            filesystem              : true,
            Flash                   : true,
            focusWidget             : true,
            form                    : true,
            FormField               : true,
            Frame                   : true,
            HotKey                  : true,
            Image                   : true,
            include                 : true,
            isApplicationRunning    : true,
            iTunes                  : true,
            konfabulatorVersion     : true,
            log                     : true,
            md5                     : true,
            MenuItem                : true,
            MoveAnimation           : true,
            openURL                 : true,
            play                    : true,
            Point                   : true,
            popupMenu               : true,
            preferenceGroups        : true,
            preferences             : true,
            print                   : true,
            prompt                  : true,
            random                  : true,
            Rectangle               : true,
            reloadWidget            : true,
            ResizeAnimation         : true,
            resolvePath             : true,
            resumeUpdates           : true,
            RotateAnimation         : true,
            runCommand              : true,
            runCommandInBg          : true,
            saveAs                  : true,
            savePreferences         : true,
            screen                  : true,
            ScrollBar               : true,
            showWidgetPreferences   : true,
            sleep                   : true,
            speak                   : true,
            Style                   : true,
            suppressUpdates         : true,
            system                  : true,
            tellWidget              : true,
            Text                    : true,
            TextArea                : true,
            Timer                   : true,
            unescape                : true,
            updateNow               : true,
            URL                     : true,
            Web                     : true,
            widget                  : true,
            Window                  : true,
            XMLDOM                  : true,
            XMLHttpRequest          : true,
            yahooCheckLogin         : true,
            yahooLogin              : true,
            yahooLogout             : true
        },

        windows = {
            ActiveXObject: false,
            CScript      : false,
            Debug        : false,
            Enumerator   : false,
            System       : false,
            VBArray      : false,
            WScript      : false
        },

//  xmode is used to adapt to the exceptions in html parsing.
//  It can have these states:
//      false   .js script file
//      html
//      outer
//      script
//      style
//      scriptstring
//      styleproperty

        xmode,
        xquote,

// Regular expressions. Some of these are stupidly long.

// unsafe comment or string
        ax = /@cc|<\/?|script|\]\s*\]|<\s*!|&lt/i,
// unsafe characters that are silently deleted by one or more browsers
        cx = /[\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/,
// token
        tx = /^\s*([(){}\[.,:;'"~\?\]#@]|==?=?|\/(\*(jshint|members?|global)?|=|\/)?|\*[\/=]?|\+(?:=|\++)?|-(?:=|-+)?|%=?|&[&=]?|\|[|=]?|>>?>?=?|<([\/=!]|\!(\[|--)?|<=?)?|\^=?|\!=?=?|[a-zA-Z_$][a-zA-Z0-9_$]*|[0-9]+([xX][0-9a-fA-F]+|\.[0-9]*)?([eE][+\-]?[0-9]+)?)/,
// html token
        hx = /^\s*(['"=>\/&#]|<(?:\/|\!(?:--)?)?|[a-zA-Z][a-zA-Z0-9_\-:]*|[0-9]+|--)/,
// characters in strings that need escapement
        nx = /[\u0000-\u001f&<"\/\\\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/,
        nxg = /[\u0000-\u001f&<"\/\\\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
// outer html token
        ox = /[>&]|<[\/!]?|--/,
// star slash
        lx = /\*\/|\/\*/,
// identifier
        ix = /^([a-zA-Z_$][a-zA-Z0-9_$]*)$/,
// javascript url
        jx = /^(?:javascript|jscript|ecmascript|vbscript|mocha|livescript)\s*:/i,
// url badness
        ux = /&|\+|\u00AD|\.\.|\/\*|%[^;]|base64|url|expression|data|mailto/i,
// style
        sx = /^\s*([{:#%.=,>+\[\]@()"';]|\*=?|\$=|\|=|\^=|~=|[a-zA-Z_][a-zA-Z0-9_\-]*|[0-9]+|<\/|\/\*)/,
        ssx = /^\s*([@#!"'};:\-%.=,+\[\]()*_]|[a-zA-Z][a-zA-Z0-9._\-]*|\/\*?|\d+(?:\.\d+)?|<\/)/,
// attributes characters
        qx = /[^a-zA-Z0-9+\-_\/ ]/,
// query characters for ids
        dx = /[\[\]\/\\"'*<>.&:(){}+=#]/,

        rx = {
            outer: hx,
            html: hx,
            style: sx,
            styleproperty: ssx
        };


    function F() {}     // Used by Object.create

    function is_own(object, name) {

// The object.hasOwnProperty method fails when the property under consideration
// is named 'hasOwnProperty'. So we have to use this more convoluted form.

        return Object.prototype.hasOwnProperty.call(object, name);
    }

// Provide critical ES5 functions to ES3.

    if (typeof Array.isArray !== 'function') {
        Array.isArray = function (o) {
            return Object.prototype.toString.apply(o) === '[object Array]';
        };
    }

    if (typeof Object.create !== 'function') {
        Object.create = function (o) {
            F.prototype = o;
            return new F();
        };
    }

    if (typeof Object.keys !== 'function') {
        Object.keys = function (o) {
            var a = [], k;
            for (k in o) {
                if (is_own(o, k)) {
                    a.push(k);
                }
            }
            return a;
        };
    }

// Non standard methods

    if (typeof String.prototype.entityify !== 'function') {
        String.prototype.entityify = function () {
            return this
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
        };
    }

    if (typeof String.prototype.isAlpha !== 'function') {
        String.prototype.isAlpha = function () {
            return (this >= 'a' && this <= 'z\uffff') ||
                (this >= 'A' && this <= 'Z\uffff');
        };
    }

    if (typeof String.prototype.isDigit !== 'function') {
        String.prototype.isDigit = function () {
            return (this >= '0' && this <= '9');
        };
    }

    if (typeof String.prototype.supplant !== 'function') {
        String.prototype.supplant = function (o) {
            return this.replace(/\{([^{}]*)\}/g, function (a, b) {
                var r = o[b];
                return typeof r === 'string' || typeof r === 'number' ? r : a;
            });
        };
    }

    if (typeof String.prototype.name !== 'function') {
        String.prototype.name = function () {

// If the string looks like an identifier, then we can return it as is.
// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can simply slap some quotes around it.
// Otherwise we must also replace the offending characters with safe
// sequences.

            if (ix.test(this)) {
                return this;
            }
            if (nx.test(this)) {
                return '"' + this.replace(nxg, function (a) {
                    var c = escapes[a];
                    if (c) {
                        return c;
                    }
                    return '\\u' + ('0000' + a.charCodeAt().toString(16)).slice(-4);
                }) + '"';
            }
            return '"' + this + '"';
        };
    }


    function combine(t, o) {
        var n;
        for (n in o) {
            if (is_own(o, n)) {
                t[n] = o[n];
            }
        }
    }

    function assume() {
        if (!option.safe) {
            if (option.rhino) {
                combine(predefined, rhino);
            }
            if (option.node) {
                combine(predefined, node);
            }
            if (option.devel) {
                combine(predefined, devel);
            }
            if (option.browser) {
                combine(predefined, browser);
            }
            if (option.windows) {
                combine(predefined, windows);
            }
            if (option.widget) {
                combine(predefined, widget);
            }
        }
    }


// Produce an error warning.

    function quit(m, l, ch) {
        throw {
            name: 'JSHintError',
            line: l,
            character: ch,
            message: m + " (" + Math.floor((l / lines.length) * 100) +
                    "% scanned)."
        };
    }

    function warning(m, t, a, b, c, d) {
        var ch, l, w;
        t = t || nexttoken;
        if (t.id === '(end)') {  // `~
            t = token;
        }
        l = t.line || 0;
        ch = t.from || 0;
        w = {
            id: '(error)',
            raw: m,
            evidence: lines[l - 1] || '',
            line: l,
            character: ch,
            a: a,
            b: b,
            c: c,
            d: d
        };
        w.reason = m.supplant(w);
        JSHINT.errors.push(w);
        if (option.passfail) {
            quit('Stopping. ', l, ch);
        }
        warnings += 1;
        if (warnings >= option.maxerr) {
            quit("Too many errors.", l, ch);
        }
        return w;
    }

    function warningAt(m, l, ch, a, b, c, d) {
        return warning(m, {
            line: l,
            from: ch
        }, a, b, c, d);
    }

    function error(m, t, a, b, c, d) {
        var w = warning(m, t, a, b, c, d);
        quit("Stopping, unable to continue.", w.line, w.character);
    }

    function errorAt(m, l, ch, a, b, c, d) {
        return error(m, {
            line: l,
            from: ch
        }, a, b, c, d);
    }



// lexical analysis and token construction

    var lex = (function lex() {
        var character, from, line, s;

// Private lex methods

        function nextLine() {
            var at;
            if (line >= lines.length) {
                return false;
            }
            character = 1;
            s = lines[line];
            line += 1;
            at = s.search(/ \t/);
            if (at >= 0) {
                warningAt("Mixed spaces and tabs.", line, at + 1);
            }
            s = s.replace(/\t/g, tab);
            at = s.search(cx);
            if (at >= 0) {
                warningAt("Unsafe character.", line, at);
            }
            if (option.maxlen && option.maxlen < s.length) {
                warningAt("Line too long.", line, s.length);
            }
            return true;
        }

// Produce a token object.  The token inherits from a syntax symbol.

        function it(type, value) {
            var i, t;
            if (type === '(color)' || type === '(range)') {
                t = {type: type};
            } else if (type === '(punctuator)' ||
                    (type === '(identifier)' && is_own(syntax, value))) {
                t = syntax[value] || syntax['(error)'];
            } else {
                t = syntax[type];
            }
            t = Object.create(t);
            if (type === '(string)' || type === '(range)') {
                if (jx.test(value)) {
                    warningAt("Script URL.", line, from);
                }
            }
            if (type === '(identifier)') {
                t.identifier = true;
                if (value === '__iterator__' || value === '__proto__') {
                    errorAt("Reserved name '{a}'.",
                        line, from, value);
                } else if (option.nomen &&
                        (value.charAt(0) === '_' ||
                         value.charAt(value.length - 1) === '_')) {
                    warningAt("Unexpected {a} in '{b}'.", line, from,
                        "dangling '_'", value);
                }
            }
            t.value = value;
            t.line = line;
            t.character = character;
            t.from = from;
            i = t.id;
            if (i !== '(endline)') {
                prereg = i &&
                    (('(,=:[!&|?{};'.indexOf(i.charAt(i.length - 1)) >= 0) ||
                    i === 'return');
            }
            return t;
        }

// Public lex methods

        return {
            init: function (source) {
                if (typeof source === 'string') {
                    lines = source
                        .replace(/\r\n/g, '\n')
                        .replace(/\r/g, '\n')
                        .split('\n');
                } else {
                    lines = source;
                }
                line = 0;
                nextLine();
                from = 1;
            },

            range: function (begin, end) {
                var c, value = '';
                from = character;
                if (s.charAt(0) !== begin) {
                    errorAt("Expected '{a}' and instead saw '{b}'.",
                            line, character, begin, s.charAt(0));
                }
                for (;;) {
                    s = s.slice(1);
                    character += 1;
                    c = s.charAt(0);
                    switch (c) {
                    case '':
                        errorAt("Missing '{a}'.", line, character, c);
                        break;
                    case end:
                        s = s.slice(1);
                        character += 1;
                        return it('(range)', value);
                    case xquote:
                    case '\\':
                        warningAt("Unexpected '{a}'.", line, character, c);
                    }
                    value += c;
                }

            },

// token -- this is called by advance to get the next token.

            token: function () {
                var b, c, captures, d, depth, high, i, l, low, q, t;

                function match(x) {
                    var r = x.exec(s), r1;
                    if (r) {
                        l = r[0].length;
                        r1 = r[1];
                        c = r1.charAt(0);
                        s = s.substr(l);
                        from = character + l - r1.length;
                        character += l;
                        return r1;
                    }
                }

                function string(x) {
                    var c, j, r = '';

                    if (jsonmode && x !== '"') {
                        warningAt("Strings must use doublequote.",
                                line, character);
                    }

                    if (xquote === x || (xmode === 'scriptstring' && !xquote)) {
                        return it('(punctuator)', x);
                    }

                    function esc(n) {
                        var i = parseInt(s.substr(j + 1, n), 16);
                        j += n;
                        if (i >= 32 && i <= 126 &&
                                i !== 34 && i !== 92 && i !== 39) {
                            warningAt("Unnecessary escapement.", line, character);
                        }
                        character += n;
                        c = String.fromCharCode(i);
                    }
                    j = 0;
                    for (;;) {
                        while (j >= s.length) {
                            j = 0;
                            if (xmode !== 'html' || !nextLine()) {
                                errorAt("Unclosed string.", line, from);
                            }
                        }
                        c = s.charAt(j);
                        if (c === x) {
                            character += 1;
                            s = s.substr(j + 1);
                            return it('(string)', r, x);
                        }
                        if (c < ' ') {
                            if (c === '\n' || c === '\r') {
                                break;
                            }
                            warningAt("Control character in string: {a}.",
                                    line, character + j, s.slice(0, j));
                        } else if (c === xquote) {
                            warningAt("Bad HTML string", line, character + j);
                        } else if (c === '<') {
                            if (option.safe && xmode === 'html') {
                                warningAt("ADsafe string violation.",
                                        line, character + j);
                            } else if (s.charAt(j + 1) === '/' && (xmode || option.safe)) {
                                warningAt("Expected '<\\/' and instead saw '</'.", line, character);
                            } else if (s.charAt(j + 1) === '!' && (xmode || option.safe)) {
                                warningAt("Unexpected '<!' in a string.", line, character);
                            }
                        } else if (c === '\\') {
                            if (xmode === 'html') {
                                if (option.safe) {
                                    warningAt("ADsafe string violation.",
                                            line, character + j);
                                }
                            } else if (xmode === 'styleproperty') {
                                j += 1;
                                character += 1;
                                c = s.charAt(j);
                                if (c !== x) {
                                    warningAt("Escapement in style string.",
                                            line, character + j);
                                }
                            } else {
                                j += 1;
                                character += 1;
                                c = s.charAt(j);
                                switch (c) {
                                case xquote:
                                    warningAt("Bad HTML string", line,
                                        character + j);
                                    break;
                                case '\\':
                                case '"':
                                case '/':
                                    break;
                                case '\'':
                                    if (jsonmode) {
                                        warningAt("Avoid \\'.", line, character);
                                    }
                                    break;
                                case 'b':
                                    c = '\b';
                                    break;
                                case 'f':
                                    c = '\f';
                                    break;
                                case 'n':
                                    c = '\n';
                                    break;
                                case 'r':
                                    c = '\r';
                                    break;
                                case 't':
                                    c = '\t';
                                    break;
                                case 'u':
                                    esc(4);
                                    break;
                                case 'v':
                                    if (jsonmode) {
                                        warningAt("Avoid \\v.", line, character);
                                    }
                                    c = '\v';
                                    break;
                                case 'x':
                                    if (jsonmode) {
                                        warningAt("Avoid \\x-.", line, character);
                                    }
                                    esc(2);
                                    break;
                                default:
                                    warningAt("Bad escapement.", line, character);
                                }
                            }
                        }
                        r += c;
                        character += 1;
                        j += 1;
                    }
                }

                for (;;) {
                    if (!s) {
                        return it(nextLine() ? '(endline)' : '(end)', '');
                    }
                    while (xmode === 'outer') {
                        i = s.search(ox);
                        if (i === 0) {
                            break;
                        } else if (i > 0) {
                            character += 1;
                            s = s.slice(i);
                            break;
                        } else {
                            if (!nextLine()) {
                                return it('(end)', '');
                            }
                        }
                    }
                    t = match(rx[xmode] || tx);
                    if (!t) {
                        t = '';
                        c = '';
                        while (s && s < '!') {
                            s = s.substr(1);
                        }
                        if (s) {
                            if (xmode === 'html') {
                                return it('(error)', s.charAt(0));
                            } else {
                                errorAt("Unexpected '{a}'.",
                                        line, character, s.substr(0, 1));
                            }
                        }
                    } else {

    //      identifier

                        if (c.isAlpha() || c === '_' || c === '$') {
                            return it('(identifier)', t);
                        }

    //      number

                        if (c.isDigit()) {
                            if (xmode !== 'style' && !isFinite(Number(t))) {
                                warningAt("Bad number '{a}'.",
                                    line, character, t);
                            }
                            if (xmode !== 'style' &&
                                     xmode !== 'styleproperty' &&
                                     s.substr(0, 1).isAlpha()) {
                                warningAt("Missing space after '{a}'.",
                                        line, character, t);
                            }
                            if (c === '0') {
                                d = t.substr(1, 1);
                                if (d.isDigit()) {
                                    if (token.id !== '.' && xmode !== 'styleproperty') {
                                        warningAt("Don't use extra leading zeros '{a}'.",
                                            line, character, t);
                                    }
                                } else if (jsonmode && (d === 'x' || d === 'X')) {
                                    warningAt("Avoid 0x-. '{a}'.",
                                            line, character, t);
                                }
                            }
                            if (t.substr(t.length - 1) === '.') {
                                warningAt(
"A trailing decimal point can be confused with a dot '{a}'.", line, character, t);
                            }
                            return it('(number)', t);
                        }
                        switch (t) {

    //      string

                        case '"':
                        case "'":
                            return string(t);

    //      // comment

                        case '//':
                            if (src || (xmode && xmode !== 'script')) {
                                warningAt("Unexpected comment.", line, character);
                            } else if (xmode === 'script' && /<\s*\//i.test(s)) {
                                warningAt("Unexpected <\/ in comment.", line, character);
                            } else if ((option.safe || xmode === 'script') && ax.test(s)) {
                                warningAt("Dangerous comment.", line, character);
                            }
                            s = '';
                            token.comment = true;
                            break;

    //      /* comment

                        case '/*':
                            if (src || (xmode && xmode !== 'script' && xmode !== 'style' && xmode !== 'styleproperty')) {
                                warningAt("Unexpected comment.", line, character);
                            }
                            if (option.safe && ax.test(s)) {
                                warningAt("ADsafe comment violation.", line, character);
                            }
                            for (;;) {
                                i = s.search(lx);
                                if (i >= 0) {
                                    break;
                                }
                                if (!nextLine()) {
                                    errorAt("Unclosed comment.", line, character);
                                } else {
                                    if (option.safe && ax.test(s)) {
                                        warningAt("ADsafe comment violation.",
                                                line, character);
                                    }
                                }
                            }
                            character += i + 2;
                            if (s.substr(i, 1) === '/') {
                                errorAt("Nested comment.", line, character);
                            }
                            s = s.substr(i + 2);
                            token.comment = true;
                            break;

    //      /*members /*jshint /*global

                        case '/*members':
                        case '/*member':
                        case '/*jshint':
                        case '/*global':
                        case '*/':
                            return {
                                value: t,
                                type: 'special',
                                line: line,
                                character: character,
                                from: from
                            };

                        case '':
                            break;
    //      /
                        case '/':
                            if (token.id === '/=') {
                                errorAt(
"A regular expression literal can be confused with '/='.", line, from);
                            }
                            if (prereg) {
                                depth = 0;
                                captures = 0;
                                l = 0;
                                for (;;) {
                                    b = true;
                                    c = s.charAt(l);
                                    l += 1;
                                    switch (c) {
                                    case '':
                                        errorAt("Unclosed regular expression.",
                                                line, from);
                                        return;
                                    case '/':
                                        if (depth > 0) {
                                            warningAt("Unescaped '{a}'.",
                                                    line, from + l, '/');
                                        }
                                        c = s.substr(0, l - 1);
                                        q = {
                                            g: true,
                                            i: true,
                                            m: true
                                        };
                                        while (q[s.charAt(l)] === true) {
                                            q[s.charAt(l)] = false;
                                            l += 1;
                                        }
                                        character += l;
                                        s = s.substr(l);
                                        q = s.charAt(0);
                                        if (q === '/' || q === '*') {
                                            errorAt("Confusing regular expression.",
                                                    line, from);
                                        }
                                        return it('(regexp)', c);
                                    case '\\':
                                        c = s.charAt(l);
                                        if (c < ' ') {
                                            warningAt(
"Unexpected control character in regular expression.", line, from + l);
                                        } else if (c === '<') {
                                            warningAt(
"Unexpected escaped character '{a}' in regular expression.", line, from + l, c);
                                        }
                                        l += 1;
                                        break;
                                    case '(':
                                        depth += 1;
                                        b = false;
                                        if (s.charAt(l) === '?') {
                                            l += 1;
                                            switch (s.charAt(l)) {
                                            case ':':
                                            case '=':
                                            case '!':
                                                l += 1;
                                                break;
                                            default:
                                                warningAt(
"Expected '{a}' and instead saw '{b}'.", line, from + l, ':', s.charAt(l));
                                            }
                                        } else {
                                            captures += 1;
                                        }
                                        break;
                                    case '|':
                                        b = false;
                                        break;
                                    case ')':
                                        if (depth === 0) {
                                            warningAt("Unescaped '{a}'.",
                                                    line, from + l, ')');
                                        } else {
                                            depth -= 1;
                                        }
                                        break;
                                    case ' ':
                                        q = 1;
                                        while (s.charAt(l) === ' ') {
                                            l += 1;
                                            q += 1;
                                        }
                                        if (q > 1) {
                                            warningAt(
"Spaces are hard to count. Use {{a}}.", line, from + l, q);
                                        }
                                        break;
                                    case '[':
                                        c = s.charAt(l);
                                        if (c === '^') {
                                            l += 1;
                                            if (option.regexp) {
                                                warningAt("Insecure '{a}'.",
                                                        line, from + l, c);
                                            } else if (s.charAt(l) === ']') {
                                                errorAt("Unescaped '{a}'.",
                                                    line, from + l, '^');
                                            }
                                        }
                                        q = false;
                                        if (c === ']') {
                                            warningAt("Empty class.", line,
                                                    from + l - 1);
                                            q = true;
                                        }
klass:                                  do {
                                            c = s.charAt(l);
                                            l += 1;
                                            switch (c) {
                                            case '[':
                                            case '^':
                                                warningAt("Unescaped '{a}'.",
                                                        line, from + l, c);
                                                q = true;
                                                break;
                                            case '-':
                                                if (q) {
                                                    q = false;
                                                } else {
                                                    warningAt("Unescaped '{a}'.",
                                                            line, from + l, '-');
                                                    q = true;
                                                }
                                                break;
                                            case ']':
                                                if (!q) {
                                                    warningAt("Unescaped '{a}'.",
                                                            line, from + l - 1, '-');
                                                }
                                                break klass;
                                            case '\\':
                                                c = s.charAt(l);
                                                if (c < ' ') {
                                                    warningAt(
"Unexpected control character in regular expression.", line, from + l);
                                                } else if (c === '<') {
                                                    warningAt(
"Unexpected escaped character '{a}' in regular expression.", line, from + l, c);
                                                }
                                                l += 1;
                                                q = true;
                                                break;
                                            case '/':
                                                warningAt("Unescaped '{a}'.",
                                                        line, from + l - 1, '/');
                                                q = true;
                                                break;
                                            case '<':
                                                if (xmode === 'script') {
                                                    c = s.charAt(l);
                                                    if (c === '!' || c === '/') {
                                                        warningAt(
"HTML confusion in regular expression '<{a}'.", line, from + l, c);
                                                    }
                                                }
                                                q = true;
                                                break;
                                            default:
                                                q = true;
                                            }
                                        } while (c);
                                        break;
                                    case '.':
                                        if (option.regexp) {
                                            warningAt("Insecure '{a}'.", line,
                                                    from + l, c);
                                        }
                                        break;
                                    case ']':
                                    case '?':
                                    case '{':
                                    case '}':
                                    case '+':
                                    case '*':
                                        warningAt("Unescaped '{a}'.", line,
                                                from + l, c);
                                        break;
                                    case '<':
                                        if (xmode === 'script') {
                                            c = s.charAt(l);
                                            if (c === '!' || c === '/') {
                                                warningAt(
"HTML confusion in regular expression '<{a}'.", line, from + l, c);
                                            }
                                        }
                                    }
                                    if (b) {
                                        switch (s.charAt(l)) {
                                        case '?':
                                        case '+':
                                        case '*':
                                            l += 1;
                                            if (s.charAt(l) === '?') {
                                                l += 1;
                                            }
                                            break;
                                        case '{':
                                            l += 1;
                                            c = s.charAt(l);
                                            if (c < '0' || c > '9') {
                                                warningAt(
"Expected a number and instead saw '{a}'.", line, from + l, c);
                                            }
                                            l += 1;
                                            low = +c;
                                            for (;;) {
                                                c = s.charAt(l);
                                                if (c < '0' || c > '9') {
                                                    break;
                                                }
                                                l += 1;
                                                low = +c + (low * 10);
                                            }
                                            high = low;
                                            if (c === ',') {
                                                l += 1;
                                                high = Infinity;
                                                c = s.charAt(l);
                                                if (c >= '0' && c <= '9') {
                                                    l += 1;
                                                    high = +c;
                                                    for (;;) {
                                                        c = s.charAt(l);
                                                        if (c < '0' || c > '9') {
                                                            break;
                                                        }
                                                        l += 1;
                                                        high = +c + (high * 10);
                                                    }
                                                }
                                            }
                                            if (s.charAt(l) !== '}') {
                                                warningAt(
"Expected '{a}' and instead saw '{b}'.", line, from + l, '}', c);
                                            } else {
                                                l += 1;
                                            }
                                            if (s.charAt(l) === '?') {
                                                l += 1;
                                            }
                                            if (low > high) {
                                                warningAt(
"'{a}' should not be greater than '{b}'.", line, from + l, low, high);
                                            }
                                        }
                                    }
                                }
                                c = s.substr(0, l - 1);
                                character += l;
                                s = s.substr(l);
                                return it('(regexp)', c);
                            }
                            return it('(punctuator)', t);

    //      punctuator

                        case '<!--':
                            l = line;
                            c = character;
                            for (;;) {
                                i = s.indexOf('--');
                                if (i >= 0) {
                                    break;
                                }
                                i = s.indexOf('<!');
                                if (i >= 0) {
                                    errorAt("Nested HTML comment.",
                                        line, character + i);
                                }
                                if (!nextLine()) {
                                    errorAt("Unclosed HTML comment.", l, c);
                                }
                            }
                            l = s.indexOf('<!');
                            if (l >= 0 && l < i) {
                                errorAt("Nested HTML comment.",
                                    line, character + l);
                            }
                            character += i;
                            if (s.charAt(i + 2) !== '>') {
                                errorAt("Expected -->.", line, character);
                            }
                            character += 3;
                            s = s.slice(i + 3);
                            break;
                        case '#':
                            if (xmode === 'html' || xmode === 'styleproperty') {
                                for (;;) {
                                    c = s.charAt(0);
                                    if ((c < '0' || c > '9') &&
                                            (c < 'a' || c > 'f') &&
                                            (c < 'A' || c > 'F')) {
                                        break;
                                    }
                                    character += 1;
                                    s = s.substr(1);
                                    t += c;
                                }
                                if (t.length !== 4 && t.length !== 7) {
                                    warningAt("Bad hex color '{a}'.", line,
                                        from + l, t);
                                }
                                return it('(color)', t);
                            }
                            return it('(punctuator)', t);
                        default:
                            if (xmode === 'outer' && c === '&') {
                                character += 1;
                                s = s.substr(1);
                                for (;;) {
                                    c = s.charAt(0);
                                    character += 1;
                                    s = s.substr(1);
                                    if (c === ';') {
                                        break;
                                    }
                                    if (!((c >= '0' && c <= '9') ||
                                            (c >= 'a' && c <= 'z') ||
                                            c === '#')) {
                                        errorAt("Bad entity", line, from + l,
                                        character);
                                    }
                                }
                                break;
                            }
                            return it('(punctuator)', t);
                        }
                    }
                }
            }
        };
    }());


    function addlabel(t, type) {

        if (option.safe && funct['(global)'] &&
                typeof predefined[t] !== 'boolean') {
            warning('ADsafe global: ' + t + '.', token);
        } else if (t === 'hasOwnProperty') {
            warning("'hasOwnProperty' is a really bad name.");
        }

// Define t in the current function in the current scope.

        if (is_own(funct, t) && !funct['(global)']) {
            warning(funct[t] === true ?
                "'{a}' was used before it was defined." :
                "'{a}' is already defined.",
                nexttoken, t);
        }
        funct[t] = type;
        if (funct['(global)']) {
            global[t] = funct;
            if (is_own(implied, t)) {
                warning("'{a}' was used before it was defined.", nexttoken, t);
                delete implied[t];
            }
        } else {
            scope[t] = funct;
        }
    }


    function doOption() {
        var b, obj, filter, o = nexttoken.value, t, v;
        switch (o) {
        case '*/':
            error("Unbegun comment.");
            break;
        case '/*members':
        case '/*member':
            o = '/*members';
            if (!membersOnly) {
                membersOnly = {};
            }
            obj = membersOnly;
            break;
        case '/*jshint':
            if (option.safe) {
                warning("ADsafe restriction.");
            }
            obj = option;
            filter = boolOptions;
            break;
        case '/*global':
            if (option.safe) {
                warning("ADsafe restriction.");
            }
            obj = predefined;
            break;
        default:
            error("What?");
        }
        t = lex.token();
loop:   for (;;) {
            for (;;) {
                if (t.type === 'special' && t.value === '*/') {
                    break loop;
                }
                if (t.id !== '(endline)' && t.id !== ',') {
                    break;
                }
                t = lex.token();
            }
            if (t.type !== '(string)' && t.type !== '(identifier)' &&
                    o !== '/*members') {
                error("Bad option.", t);
            }
            v = lex.token();
            if (v.id === ':') {
                v = lex.token();
                if (obj === membersOnly) {
                    error("Expected '{a}' and instead saw '{b}'.",
                            t, '*/', ':');
                }
                if (t.value === 'indent' && o === '/*jshint') {
                    b = +v.value;
                    if (typeof b !== 'number' || !isFinite(b) || b <= 0 ||
                            Math.floor(b) !== b) {
                        error("Expected a small integer and instead saw '{a}'.",
                                v, v.value);
                    }
                    obj.white = true;
                    obj.indent = b;
                } else if (t.value === 'maxerr' && o === '/*jshint') {
                    b = +v.value;
                    if (typeof b !== 'number' || !isFinite(b) || b <= 0 ||
                            Math.floor(b) !== b) {
                        error("Expected a small integer and instead saw '{a}'.",
                                v, v.value);
                    }
                    obj.maxerr = b;
                } else if (t.value === 'maxlen' && o === '/*jshint') {
                    b = +v.value;
                    if (typeof b !== 'number' || !isFinite(b) || b <= 0 ||
                            Math.floor(b) !== b) {
                        error("Expected a small integer and instead saw '{a}'.",
                                v, v.value);
                    }
                    obj.maxlen = b;
                } else if (v.value === 'true') {
                    obj[t.value] = true;
                } else if (v.value === 'false') {
                    obj[t.value] = false;
                } else {
                    error("Bad option value.", v);
                }
                t = lex.token();
            } else {
                if (o === '/*jshint') {
                    error("Missing option value.", t);
                }
                obj[t.value] = false;
                t = v;
            }
        }
        if (filter) {
            assume();
        }
    }


// We need a peek function. If it has an argument, it peeks that much farther
// ahead. It is used to distinguish
//     for ( var i in ...
// from
//     for ( var i = ...

    function peek(p) {
        var i = p || 0, j = 0, t;

        while (j <= i) {
            t = lookahead[j];
            if (!t) {
                t = lookahead[j] = lex.token();
            }
            j += 1;
        }
        return t;
    }



// Produce the next token. It looks for programming errors.

    function advance(id, t) {
        switch (token.id) {
        case '(number)':
            if (nexttoken.id === '.') {
                warning(
"A dot following a number can be confused with a decimal point.", token);
            }
            break;
        case '-':
            if (nexttoken.id === '-' || nexttoken.id === '--') {
                warning("Confusing minusses.");
            }
            break;
        case '+':
            if (nexttoken.id === '+' || nexttoken.id === '++') {
                warning("Confusing plusses.");
            }
            break;
        }
        if (token.type === '(string)' || token.identifier) {
            anonname = token.value;
        }

        if (id && nexttoken.id !== id) {
            if (t) {
                if (nexttoken.id === '(end)') {
                    warning("Unmatched '{a}'.", t, t.id);
                } else {
                    warning(
"Expected '{a}' to match '{b}' from line {c} and instead saw '{d}'.",
                            nexttoken, id, t.id, t.line, nexttoken.value);
                }
            } else if (nexttoken.type !== '(identifier)' ||
                            nexttoken.value !== id) {
                warning("Expected '{a}' and instead saw '{b}'.",
                        nexttoken, id, nexttoken.value);
            }
        }
        prevtoken = token;
        token = nexttoken;
        for (;;) {
            nexttoken = lookahead.shift() || lex.token();
            if (nexttoken.id === '(end)' || nexttoken.id === '(error)') {
                return;
            }
            if (nexttoken.type === 'special') {
                doOption();
            } else {
                if (nexttoken.id !== '(endline)') {
                    break;
                }
            }
        }
    }


// This is the heart of JSHINT, the Pratt parser. In addition to parsing, it
// is looking for ad hoc lint patterns. We add .fud to Pratt's model, which is
// like .nud except that it is only used on the first token of a statement.
// Having .fud makes it much easier to define statement-oriented languages like
// JavaScript. I retained Pratt's nomenclature.

// .nud     Null denotation
// .fud     First null denotation
// .led     Left denotation
//  lbp     Left binding power
//  rbp     Right binding power

// They are elements of the parsing method called Top Down Operator Precedence.

    function expression(rbp, initial) {
        var left;
        if (nexttoken.id === '(end)') {
            error("Unexpected early end of program.", token);
        }
        advance();
        if (option.safe && typeof predefined[token.value] === 'boolean' &&
                (nexttoken.id !== '(' && nexttoken.id !== '.')) {
            warning('ADsafe violation.', token);
        }
        if (initial) {
            anonname = 'anonymous';
            funct['(verb)'] = token.value;
        }
        if (initial === true && token.fud) {
            left = token.fud();
        } else {
            if (token.nud) {
                left = token.nud();
            } else {
                if (nexttoken.type === '(number)' && token.id === '.') {
                    warning(
"A leading decimal point can be confused with a dot: '.{a}'.",
                            token, nexttoken.value);
                    advance();
                    return token;
                } else {
                    error("Expected an identifier and instead saw '{a}'.",
                            token, token.id);
                }
            }
            while (rbp < nexttoken.lbp) {
                advance();
                if (token.led) {
                    left = token.led(left);
                } else {
                    error("Expected an operator and instead saw '{a}'.",
                        token, token.id);
                }
            }
        }
        return left;
    }


// Functions for conformance of style.

    function adjacent(left, right) {
        left = left || token;
        right = right || nexttoken;
        if (option.white || xmode === 'styleproperty' || xmode === 'style') {
            if (left.character !== right.from && left.line === right.line) {
                warning("Unexpected space after '{a}'.", right, left.value);
            }
        }
    }

    function nobreak(left, right) {
        left = left || token;
        right = right || nexttoken;
        if (option.white && (left.character !== right.from || left.line !== right.line)) {
            warning("Unexpected space before '{a}'.", right, right.value);
        }
    }

    function nospace(left, right) {
        left = left || token;
        right = right || nexttoken;
        if (option.white && !left.comment) {
            if (left.line === right.line) {
                adjacent(left, right);
            }
        }
    }

    function nonadjacent(left, right) {
        if (option.white) {
            left = left || token;
            right = right || nexttoken;
            if (left.line === right.line && left.character === right.from) {
                warning("Missing space after '{a}'.",
                        nexttoken, left.value);
            }
        }
    }

    function nobreaknonadjacent(left, right) {
        left = left || token;
        right = right || nexttoken;
        if (!option.laxbreak && left.line !== right.line) {
            warning("Bad line breaking before '{a}'.", right, right.id);
        } else if (option.white) {
            left = left || token;
            right = right || nexttoken;
            if (left.character === right.from) {
                warning("Missing space after '{a}'.",
                        nexttoken, left.value);
            }
        }
    }

    function indentation(bias) {
        var i;
        if (option.white && nexttoken.id !== '(end)') {
            i = indent + (bias || 0);
            if (nexttoken.from !== i) {
                warning(
"Expected '{a}' to have an indentation at {b} instead at {c}.",
                        nexttoken, nexttoken.value, i, nexttoken.from);
            }
        }
    }

    function nolinebreak(t) {
        t = t || token;
        if (t.line !== nexttoken.line) {
            warning("Line breaking error '{a}'.", t, t.value);
        }
    }


    function comma() {
        if (token.line !== nexttoken.line) {
            if (!option.laxbreak) {
                warning("Bad line breaking before '{a}'.", token, nexttoken.id);
            }
        } else if (token.character !== nexttoken.from && option.white) {
            warning("Unexpected space after '{a}'.", nexttoken, token.value);
        }
        advance(',');
        nonadjacent(token, nexttoken);
    }


// Functional constructors for making the symbols that will be inherited by
// tokens.

    function symbol(s, p) {
        var x = syntax[s];
        if (!x || typeof x !== 'object') {
            syntax[s] = x = {
                id: s,
                lbp: p,
                value: s
            };
        }
        return x;
    }


    function delim(s) {
        return symbol(s, 0);
    }


    function stmt(s, f) {
        var x = delim(s);
        x.identifier = x.reserved = true;
        x.fud = f;
        return x;
    }


    function blockstmt(s, f) {
        var x = stmt(s, f);
        x.block = true;
        return x;
    }


    function reserveName(x) {
        var c = x.id.charAt(0);
        if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')) {
            x.identifier = x.reserved = true;
        }
        return x;
    }


    function prefix(s, f) {
        var x = symbol(s, 150);
        reserveName(x);
        x.nud = (typeof f === 'function') ? f : function () {
            this.right = expression(150);
            this.arity = 'unary';
            if (this.id === '++' || this.id === '--') {
                if (option.plusplus) {
                    warning("Unexpected use of '{a}'.", this, this.id);
                } else if ((!this.right.identifier || this.right.reserved) &&
                        this.right.id !== '.' && this.right.id !== '[') {
                    warning("Bad operand.", this);
                }
            }
            return this;
        };
        return x;
    }


    function type(s, f) {
        var x = delim(s);
        x.type = s;
        x.nud = f;
        return x;
    }


    function reserve(s, f) {
        var x = type(s, f);
        x.identifier = x.reserved = true;
        return x;
    }


    function reservevar(s, v) {
        return reserve(s, function () {
            if (typeof v === 'function') {
                v(this);
            }
            return this;
        });
    }


    function infix(s, f, p, w) {
        var x = symbol(s, p);
        reserveName(x);
        x.led = function (left) {
            if (!w) {
                nobreaknonadjacent(prevtoken, token);
                nonadjacent(token, nexttoken);
            }
            if (typeof f === 'function') {
                return f(left, this);
            } else {
                this.left = left;
                this.right = expression(p);
                return this;
            }
        };
        return x;
    }


    function relation(s, f) {
        var x = symbol(s, 100);
        x.led = function (left) {
            nobreaknonadjacent(prevtoken, token);
            nonadjacent(token, nexttoken);
            var right = expression(100);
            if ((left && left.id === 'NaN') || (right && right.id === 'NaN')) {
                warning("Use the isNaN function to compare with NaN.", this);
            } else if (f) {
                f.apply(this, [left, right]);
            }
            if (left.id === '!') {
                warning("Confusing use of '{a}'.", left, '!');
            }
            if (right.id === '!') {
                warning("Confusing use of '{a}'.", left, '!');
            }
            this.left = left;
            this.right = right;
            return this;
        };
        return x;
    }


    function isPoorRelation(node) {
        return node &&
              ((node.type === '(number)' && +node.value === 0) ||
               (node.type === '(string)' && node.value === '') ||
                node.type === 'true' ||
                node.type === 'false' ||
                node.type === 'undefined' ||
                node.type === 'null');
    }


    function assignop(s, f) {
        symbol(s, 20).exps = true;
        return infix(s, function (left, that) {
            var l;
            that.left = left;
            if (predefined[left.value] === false &&
                    scope[left.value]['(global)'] === true) {
                warning("Read only.", left);
            } else if (left['function']) {
                warning("'{a}' is a function.", left, left.value);
            }
            if (option.safe) {
                l = left;
                do {
                    if (typeof predefined[l.value] === 'boolean') {
                        warning('ADsafe violation.', l);
                    }
                    l = l.left;
                } while (l);
            }
            if (left) {
                if (left.id === '.' || left.id === '[') {
                    if (!left.left || left.left.value === 'arguments') {
                        warning('Bad assignment.', that);
                    }
                    that.right = expression(19);
                    return that;
                } else if (left.identifier && !left.reserved) {
                    if (funct[left.value] === 'exception') {
                        warning("Do not assign to the exception parameter.", left);
                    }
                    that.right = expression(19);
                    return that;
                }
                if (left === syntax['function']) {
                    warning(
"Expected an identifier in an assignment and instead saw a function invocation.",
                                token);
                }
            }
            error("Bad assignment.", that);
        }, 20);
    }


    function bitwise(s, f, p) {
        var x = symbol(s, p);
        reserveName(x);
        x.led = (typeof f === 'function') ? f : function (left) {
            if (option.bitwise) {
                warning("Unexpected use of '{a}'.", this, this.id);
            }
            this.left = left;
            this.right = expression(p);
            return this;
        };
        return x;
    }


    function bitwiseassignop(s) {
        symbol(s, 20).exps = true;
        return infix(s, function (left, that) {
            if (option.bitwise) {
                warning("Unexpected use of '{a}'.", that, that.id);
            }
            nonadjacent(prevtoken, token);
            nonadjacent(token, nexttoken);
            if (left) {
                if (left.id === '.' || left.id === '[' ||
                        (left.identifier && !left.reserved)) {
                    expression(19);
                    return that;
                }
                if (left === syntax['function']) {
                    warning(
"Expected an identifier in an assignment, and instead saw a function invocation.",
                                token);
                }
                return that;
            }
            error("Bad assignment.", that);
        }, 20);
    }


    function suffix(s, f) {
        var x = symbol(s, 150);
        x.led = function (left) {
            if (option.plusplus) {
                warning("Unexpected use of '{a}'.", this, this.id);
            } else if ((!left.identifier || left.reserved) &&
                    left.id !== '.' && left.id !== '[') {
                warning("Bad operand.", this);
            }
            this.left = left;
            return this;
        };
        return x;
    }


    function optionalidentifier() {
        if (nexttoken.identifier) {
            advance();
            if (option.safe && banned[token.value]) {
                warning("ADsafe violation: '{a}'.", token, token.value);
            } else if (token.reserved && !option.es5) {
                warning("Expected an identifier and instead saw '{a}' (a reserved word).",
                        token, token.id);
            }
            return token.value;
        }
    }


    function identifier() {
        var i = optionalidentifier();
        if (i) {
            return i;
        }
        if (token.id === 'function' && nexttoken.id === '(') {
            warning("Missing name in function statement.");
        } else {
            error("Expected an identifier and instead saw '{a}'.",
                    nexttoken, nexttoken.value);
        }
    }


    function reachable(s) {
        var i = 0, t;
        if (nexttoken.id !== ';' || noreach) {
            return;
        }
        for (;;) {
            t = peek(i);
            if (t.reach) {
                return;
            }
            if (t.id !== '(endline)') {
                if (t.id === 'function') {
                    warning(
"Inner functions should be listed at the top of the outer function.", t);
                    break;
                }
                warning("Unreachable '{a}' after '{b}'.", t, t.value, s);
                break;
            }
            i += 1;
        }
    }


    function statement(noindent) {
        var i = indent, r, s = scope, t = nexttoken;

// We don't like the empty statement.

        if (t.id === ';') {
            warning("Unnecessary semicolon.", t);
            advance(';');
            return;
        }

// Is this a labelled statement?

        if (t.identifier && !t.reserved && peek().id === ':') {
            advance();
            advance(':');
            scope = Object.create(s);
            addlabel(t.value, 'label');
            if (!nexttoken.labelled) {
                warning("Label '{a}' on {b} statement.",
                        nexttoken, t.value, nexttoken.value);
            }
            if (jx.test(t.value + ':')) {
                warning("Label '{a}' looks like a javascript url.",
                        t, t.value);
            }
            nexttoken.label = t.value;
            t = nexttoken;
        }

// Parse the statement.

        if (!noindent) {
            indentation();
        }
        r = expression(0, true);

// Look for the final semicolon.

        if (!t.block) {
            if (!r || !r.exps) {
                warning("Expected an assignment or function call and instead saw an expression.", token);
            } else if (option.nonew && r.id === '(' && r.left.id === 'new') {
                warning("Do not use 'new' for side effects.");
            }
            if (nexttoken.id !== ';') {
                warningAt("Missing semicolon.", token.line, token.from + token.value.length);
            } else {
                adjacent(token, nexttoken);
                advance(';');
                nonadjacent(token, nexttoken);
            }
        }

// Restore the indentation.

        indent = i;
        scope = s;
        return r;
    }


    function use_strict() {
        if (nexttoken.value === 'use strict') {
            if (strict_mode) {
                warning("Unnecessary \"use strict\".");
            }
            advance();
            advance(';');
            strict_mode = true;
            option.newcap = true;
            option.undef = true;
            return true;
        } else {
            return false;
        }
    }


    function statements(begin) {
        var a = [], f, p;
        if (option.adsafe) {
            switch (begin) {
            case 'script':

// JSHint is also the static analizer for ADsafe. See www.ADsafe.org.

                if (!adsafe_may) {
                    if (nexttoken.value !== 'ADSAFE' ||
                            peek(0).id !== '.' ||
                            (peek(1).value !== 'id' &&
                            peek(1).value !== 'go')) {
                        error('ADsafe violation: Missing ADSAFE.id or ADSAFE.go.',
                            nexttoken);
                    }
                }
                if (nexttoken.value === 'ADSAFE' &&
                        peek(0).id === '.' &&
                        peek(1).value === 'id') {
                    if (adsafe_may) {
                        error('ADsafe violation.', nexttoken);
                    }
                    advance('ADSAFE');
                    advance('.');
                    advance('id');
                    advance('(');
                    if (nexttoken.value !== adsafe_id) {
                        error('ADsafe violation: id does not match.', nexttoken);
                    }
                    advance('(string)');
                    advance(')');
                    advance(';');
                    adsafe_may = true;
                }
                break;
            case 'lib':
                if (nexttoken.value === 'ADSAFE') {
                    advance('ADSAFE');
                    advance('.');
                    advance('lib');
                    advance('(');
                    advance('(string)');
                    comma();
                    f = expression(0);
                    if (f.id !== 'function') {
                        error('The second argument to lib must be a function.', f);
                    }
                    p = f.funct['(params)'];
                    p = p && p.join(', ');
                    if (p && p !== 'lib') {
                        error("Expected '{a}' and instead saw '{b}'.",
                            f, '(lib)', '(' + p + ')');
                    }
                    advance(')');
                    advance(';');
                    return a;
                } else {
                    error("ADsafe lib violation.");
                }
            }
        }
        while (!nexttoken.reach && nexttoken.id !== '(end)') {
            if (nexttoken.id === ';') {
                warning("Unnecessary semicolon.");
                advance(';');
            } else {
                a.push(statement());
            }
        }
        return a;
    }


    /*
     * Parses a single block. A block is a sequence of statements wrapped in
     * braces.
     * 
     * ordinary - true for everything but function bodies and try blocks. 
     * stmt     - true if block can be a single statement (e.g. in if/for/while).     
     */ 
    function block(ordinary, stmt) {
        var a,
            b = inblock,
            old_indent = indent,
            m = strict_mode,
            s = scope,
            t;

        inblock = ordinary;
        scope = Object.create(scope);
        nonadjacent(token, nexttoken);
        t = nexttoken;

        if (nexttoken.id === '{') {
            advance('{');
            if (nexttoken.id !== '}' || token.line !== nexttoken.line) {
                indent += option.indent;
                while (!ordinary && nexttoken.from > indent) {
                    indent += option.indent;
                }
                if (!ordinary && !use_strict() && !m && option.strict &&
                        funct['(context)']['(global)']) {
                    warning("Missing \"use strict\" statement.");
                }
                a = statements();
                strict_mode = m;
                indent -= option.indent;
                indentation();
            }
            advance('}', t);
            indent = old_indent;
        } else if (!ordinary) {
            error("Expected '{a}' and instead saw '{b}'.",
                  nexttoken, '{', nexttoken.value);
        } else {
            if (!stmt || option.curly)
                warning("Expected '{a}' and instead saw '{b}'.",
                        nexttoken, '{', nexttoken.value);

            noreach = true;
            a = [statement()];
            noreach = false;
        }
        funct['(verb)'] = null;
        scope = s;
        inblock = b;
        if (ordinary && option.noempty && (!a || a.length === 0)) {
            warning("Empty block.");
        }
        return a;
    }


    function countMember(m) {
        if (membersOnly && typeof membersOnly[m] !== 'boolean') {
            warning("Unexpected /*member '{a}'.", token, m);
        }
        if (typeof member[m] === 'number') {
            member[m] += 1;
        } else {
            member[m] = 1;
        }
    }


    function note_implied(token) {
        var name = token.value, line = token.line, a = implied[name];
        if (typeof a === 'function') {
            a = false;
        }
        if (!a) {
            a = [line];
            implied[name] = a;
        } else if (a[a.length - 1] !== line) {
            a.push(line);
        }
    }


// CSS parsing.

    function cssName() {
        if (nexttoken.identifier) {
            advance();
            return true;
        }
    }


    function cssNumber() {
        if (nexttoken.id === '-') {
            advance('-');
            adjacent();
            nolinebreak();
        }
        if (nexttoken.type === '(number)') {
            advance('(number)');
            return true;
        }
    }


    function cssString() {
        if (nexttoken.type === '(string)') {
            advance();
            return true;
        }
    }


    function cssColor() {
        var i, number, value;
        if (nexttoken.identifier) {
            value = nexttoken.value;
            if (value === 'rgb' || value === 'rgba') {
                advance();
                advance('(');
                for (i = 0; i < 3; i += 1) {
                    if (i) {
                        advance(',');
                    }
                    number = nexttoken.value;
                    if (nexttoken.type !== '(number)' || number < 0) {
                        warning("Expected a positive number and instead saw '{a}'",
                            nexttoken, number);
                        advance();
                    } else {
                        advance();
                        if (nexttoken.id === '%') {
                            advance('%');
                            if (number > 100) {
                                warning("Expected a percentage and instead saw '{a}'",
                                    token, number);
                            }
                        } else {
                            if (number > 255) {
                                warning("Expected a small number and instead saw '{a}'",
                                    token, number);
                            }
                        }
                    }
                }
                if (value === 'rgba') {
                    advance(',');
                    number = +nexttoken.value;
                    if (nexttoken.type !== '(number)' || number < 0 || number > 1) {
                        warning("Expected a number between 0 and 1 and instead saw '{a}'",
                            nexttoken, number);
                    }
                    advance();
                    if (nexttoken.id === '%') {
                        warning("Unexpected '%'.");
                        advance('%');
                    }
                }
                advance(')');
                return true;
            } else if (cssColorData[nexttoken.value] === true) {
                advance();
                return true;
            }
        } else if (nexttoken.type === '(color)') {
            advance();
            return true;
        }
        return false;
    }


    function cssLength() {
        if (nexttoken.id === '-') {
            advance('-');
            adjacent();
            nolinebreak();
        }
        if (nexttoken.type === '(number)') {
            advance();
            if (nexttoken.type !== '(string)' &&
                    cssLengthData[nexttoken.value] === true) {
                adjacent();
                advance();
            } else if (+token.value !== 0) {
                warning("Expected a linear unit and instead saw '{a}'.",
                    nexttoken, nexttoken.value);
            }
            return true;
        }
        return false;
    }


    function cssLineHeight() {
        if (nexttoken.id === '-') {
            advance('-');
            adjacent();
        }
        if (nexttoken.type === '(number)') {
            advance();
            if (nexttoken.type !== '(string)' &&
                    cssLengthData[nexttoken.value] === true) {
                adjacent();
                advance();
            }
            return true;
        }
        return false;
    }


    function cssWidth() {
        if (nexttoken.identifier) {
            switch (nexttoken.value) {
            case 'thin':
            case 'medium':
            case 'thick':
                advance();
                return true;
            }
        } else {
            return cssLength();
        }
    }


    function cssMargin() {
        if (nexttoken.identifier) {
            if (nexttoken.value === 'auto') {
                advance();
                return true;
            }
        } else {
            return cssLength();
        }
    }

    function cssAttr() {
        if (nexttoken.identifier && nexttoken.value === 'attr') {
            advance();
            advance('(');
            if (!nexttoken.identifier) {
                warning("Expected a name and instead saw '{a}'.",
                        nexttoken, nexttoken.value);
            }
            advance();
            advance(')');
            return true;
        }
        return false;
    }


    function cssCommaList() {
        while (nexttoken.id !== ';') {
            if (!cssName() && !cssString()) {
                warning("Expected a name and instead saw '{a}'.",
                        nexttoken, nexttoken.value);
            }
            if (nexttoken.id !== ',') {
                return true;
            }
            comma();
        }
    }


    function cssCounter() {
        if (nexttoken.identifier && nexttoken.value === 'counter') {
            advance();
            advance('(');
            advance();
            if (nexttoken.id === ',') {
                comma();
                if (nexttoken.type !== '(string)') {
                    warning("Expected a string and instead saw '{a}'.",
                        nexttoken, nexttoken.value);
                }
                advance();
            }
            advance(')');
            return true;
        }
        if (nexttoken.identifier && nexttoken.value === 'counters') {
            advance();
            advance('(');
            if (!nexttoken.identifier) {
                warning("Expected a name and instead saw '{a}'.",
                        nexttoken, nexttoken.value);
            }
            advance();
            if (nexttoken.id === ',') {
                comma();
                if (nexttoken.type !== '(string)') {
                    warning("Expected a string and instead saw '{a}'.",
                        nexttoken, nexttoken.value);
                }
                advance();
            }
            if (nexttoken.id === ',') {
                comma();
                if (nexttoken.type !== '(string)') {
                    warning("Expected a string and instead saw '{a}'.",
                        nexttoken, nexttoken.value);
                }
                advance();
            }
            advance(')');
            return true;
        }
        return false;
    }


    function cssShape() {
        var i;
        if (nexttoken.identifier && nexttoken.value === 'rect') {
            advance();
            advance('(');
            for (i = 0; i < 4; i += 1) {
                if (!cssLength()) {
                    warning("Expected a number and instead saw '{a}'.",
                        nexttoken, nexttoken.value);
                    break;
                }
            }
            advance(')');
            return true;
        }
        return false;
    }


    function cssUrl() {
        var c, url;
        if (nexttoken.identifier && nexttoken.value === 'url') {
            nexttoken = lex.range('(', ')');
            url = nexttoken.value;
            c = url.charAt(0);
            if (c === '"' || c === '\'') {
                if (url.slice(-1) !== c) {
                    warning("Bad url string.");
                } else {
                    url = url.slice(1, -1);
                    if (url.indexOf(c) >= 0) {
                        warning("Bad url string.");
                    }
                }
            }
            if (!url) {
                warning("Missing url.");
            }
            advance();
            if (option.safe && ux.test(url)) {
                error("ADsafe URL violation.");
            }
            urls.push(url);
            return true;
        }
        return false;
    }


    cssAny = [cssUrl, function () {
        for (;;) {
            if (nexttoken.identifier) {
                switch (nexttoken.value.toLowerCase()) {
                case 'url':
                    cssUrl();
                    break;
                case 'expression':
                    warning("Unexpected expression '{a}'.",
                        nexttoken, nexttoken.value);
                    advance();
                    break;
                default:
                    advance();
                }
            } else {
                if (nexttoken.id === ';' || nexttoken.id === '!'  ||
                        nexttoken.id === '(end)' || nexttoken.id === '}') {
                    return true;
                }
                advance();
            }
        }
    }];


    cssBorderStyle = [
        'none', 'dashed', 'dotted', 'double', 'groove',
        'hidden', 'inset', 'outset', 'ridge', 'solid'
    ];

    cssBreak = [
        'auto', 'always', 'avoid', 'left', 'right'
    ];

    cssMedia = {
        'all': true,
        'braille': true,
        'embossed': true,
        'handheld': true,
        'print': true,
        'projection': true,
        'screen': true,
        'speech': true,
        'tty': true,
        'tv': true
    };

    cssOverflow = [
        'auto', 'hidden', 'scroll', 'visible'
    ];

    cssAttributeData = {
        background: [
            true, 'background-attachment', 'background-color',
            'background-image', 'background-position', 'background-repeat'
        ],
        'background-attachment': ['scroll', 'fixed'],
        'background-color': ['transparent', cssColor],
        'background-image': ['none', cssUrl],
        'background-position': [
            2, [cssLength, 'top', 'bottom', 'left', 'right', 'center']
        ],
        'background-repeat': [
            'repeat', 'repeat-x', 'repeat-y', 'no-repeat'
        ],
        'border': [true, 'border-color', 'border-style', 'border-width'],
        'border-bottom': [
            true, 'border-bottom-color', 'border-bottom-style',
            'border-bottom-width'
        ],
        'border-bottom-color': cssColor,
        'border-bottom-style': cssBorderStyle,
        'border-bottom-width': cssWidth,
        'border-collapse': ['collapse', 'separate'],
        'border-color': ['transparent', 4, cssColor],
        'border-left': [
            true, 'border-left-color', 'border-left-style', 'border-left-width'
        ],
        'border-left-color': cssColor,
        'border-left-style': cssBorderStyle,
        'border-left-width': cssWidth,
        'border-right': [
            true, 'border-right-color', 'border-right-style',
            'border-right-width'
        ],
        'border-right-color': cssColor,
        'border-right-style': cssBorderStyle,
        'border-right-width': cssWidth,
        'border-spacing': [2, cssLength],
        'border-style': [4, cssBorderStyle],
        'border-top': [
            true, 'border-top-color', 'border-top-style', 'border-top-width'
        ],
        'border-top-color': cssColor,
        'border-top-style': cssBorderStyle,
        'border-top-width': cssWidth,
        'border-width': [4, cssWidth],
        bottom: [cssLength, 'auto'],
        'caption-side' : ['bottom', 'left', 'right', 'top'],
        clear: ['both', 'left', 'none', 'right'],
        clip: [cssShape, 'auto'],
        color: cssColor,
        content: [
            'open-quote', 'close-quote', 'no-open-quote', 'no-close-quote',
            cssString, cssUrl, cssCounter, cssAttr
        ],
        'counter-increment': [
            cssName, 'none'
        ],
        'counter-reset': [
            cssName, 'none'
        ],
        cursor: [
            cssUrl, 'auto', 'crosshair', 'default', 'e-resize', 'help', 'move',
            'n-resize', 'ne-resize', 'nw-resize', 'pointer', 's-resize',
            'se-resize', 'sw-resize', 'w-resize', 'text', 'wait'
        ],
        direction: ['ltr', 'rtl'],
        display: [
            'block', 'compact', 'inline', 'inline-block', 'inline-table',
            'list-item', 'marker', 'none', 'run-in', 'table', 'table-caption',
            'table-cell', 'table-column', 'table-column-group',
            'table-footer-group', 'table-header-group', 'table-row',
            'table-row-group'
        ],
        'empty-cells': ['show', 'hide'],
        'float': ['left', 'none', 'right'],
        font: [
            'caption', 'icon', 'menu', 'message-box', 'small-caption',
            'status-bar', true, 'font-size', 'font-style', 'font-weight',
            'font-family'
        ],
        'font-family': cssCommaList,
        'font-size': [
            'xx-small', 'x-small', 'small', 'medium', 'large', 'x-large',
            'xx-large', 'larger', 'smaller', cssLength
        ],
        'font-size-adjust': ['none', cssNumber],
        'font-stretch': [
            'normal', 'wider', 'narrower', 'ultra-condensed',
            'extra-condensed', 'condensed', 'semi-condensed',
            'semi-expanded', 'expanded', 'extra-expanded'
        ],
        'font-style': [
            'normal', 'italic', 'oblique'
        ],
        'font-variant': [
            'normal', 'small-caps'
        ],
        'font-weight': [
            'normal', 'bold', 'bolder', 'lighter', cssNumber
        ],
        height: [cssLength, 'auto'],
        left: [cssLength, 'auto'],
        'letter-spacing': ['normal', cssLength],
        'line-height': ['normal', cssLineHeight],
        'list-style': [
            true, 'list-style-image', 'list-style-position', 'list-style-type'
        ],
        'list-style-image': ['none', cssUrl],
        'list-style-position': ['inside', 'outside'],
        'list-style-type': [
            'circle', 'disc', 'square', 'decimal', 'decimal-leading-zero',
            'lower-roman', 'upper-roman', 'lower-greek', 'lower-alpha',
            'lower-latin', 'upper-alpha', 'upper-latin', 'hebrew', 'katakana',
            'hiragana-iroha', 'katakana-oroha', 'none'
        ],
        margin: [4, cssMargin],
        'margin-bottom': cssMargin,
        'margin-left': cssMargin,
        'margin-right': cssMargin,
        'margin-top': cssMargin,
        'marker-offset': [cssLength, 'auto'],
        'max-height': [cssLength, 'none'],
        'max-width': [cssLength, 'none'],
        'min-height': cssLength,
        'min-width': cssLength,
        opacity: cssNumber,
        outline: [true, 'outline-color', 'outline-style', 'outline-width'],
        'outline-color': ['invert', cssColor],
        'outline-style': [
            'dashed', 'dotted', 'double', 'groove', 'inset', 'none',
            'outset', 'ridge', 'solid'
        ],
        'outline-width': cssWidth,
        overflow: cssOverflow,
        'overflow-x': cssOverflow,
        'overflow-y': cssOverflow,
        padding: [4, cssLength],
        'padding-bottom': cssLength,
        'padding-left': cssLength,
        'padding-right': cssLength,
        'padding-top': cssLength,
        'page-break-after': cssBreak,
        'page-break-before': cssBreak,
        position: ['absolute', 'fixed', 'relative', 'static'],
        quotes: [8, cssString],
        right: [cssLength, 'auto'],
        'table-layout': ['auto', 'fixed'],
        'text-align': ['center', 'justify', 'left', 'right'],
        'text-decoration': [
            'none', 'underline', 'overline', 'line-through', 'blink'
        ],
        'text-indent': cssLength,
        'text-shadow': ['none', 4, [cssColor, cssLength]],
        'text-transform': ['capitalize', 'uppercase', 'lowercase', 'none'],
        top: [cssLength, 'auto'],
        'unicode-bidi': ['normal', 'embed', 'bidi-override'],
        'vertical-align': [
            'baseline', 'bottom', 'sub', 'super', 'top', 'text-top', 'middle',
            'text-bottom', cssLength
        ],
        visibility: ['visible', 'hidden', 'collapse'],
        'white-space': [
            'normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap', 'inherit'
        ],
        width: [cssLength, 'auto'],
        'word-spacing': ['normal', cssLength],
        'word-wrap': ['break-word', 'normal'],
        'z-index': ['auto', cssNumber]
    };

    function styleAttribute() {
        var v;
        while (nexttoken.id === '*' || nexttoken.id === '#' ||
                nexttoken.value === '_') {
            if (!option.css) {
                warning("Unexpected '{a}'.", nexttoken, nexttoken.value);
            }
            advance();
        }
        if (nexttoken.id === '-') {
            if (!option.css) {
                warning("Unexpected '{a}'.", nexttoken, nexttoken.value);
            }
            advance('-');
            if (!nexttoken.identifier) {
                warning(
"Expected a non-standard style attribute and instead saw '{a}'.",
                    nexttoken, nexttoken.value);
            }
            advance();
            return cssAny;
        } else {
            if (!nexttoken.identifier) {
                warning("Excepted a style attribute, and instead saw '{a}'.",
                    nexttoken, nexttoken.value);
            } else {
                if (is_own(cssAttributeData, nexttoken.value)) {
                    v = cssAttributeData[nexttoken.value];
                } else {
                    v = cssAny;
                    if (!option.css) {
                        warning("Unrecognized style attribute '{a}'.",
                                nexttoken, nexttoken.value);
                    }
                }
            }
            advance();
            return v;
        }
    }


    function styleValue(v) {
        var i = 0,
            n,
            once,
            match,
            round,
            start = 0,
            vi;
        switch (typeof v) {
        case 'function':
            return v();
        case 'string':
            if (nexttoken.identifier && nexttoken.value === v) {
                advance();
                return true;
            }
            return false;
        }
        for (;;) {
            if (i >= v.length) {
                return false;
            }
            vi = v[i];
            i += 1;
            if (vi === true) {
                break;
            } else if (typeof vi === 'number') {
                n = vi;
                vi = v[i];
                i += 1;
            } else {
                n = 1;
            }
            match = false;
            while (n > 0) {
                if (styleValue(vi)) {
                    match = true;
                    n -= 1;
                } else {
                    break;
                }
            }
            if (match) {
                return true;
            }
        }
        start = i;
        once = [];
        for (;;) {
            round = false;
            for (i = start; i < v.length; i += 1) {
                if (!once[i]) {
                    if (styleValue(cssAttributeData[v[i]])) {
                        match = true;
                        round = true;
                        once[i] = true;
                        break;
                    }
                }
            }
            if (!round) {
                return match;
            }
        }
    }

    function styleChild() {
        if (nexttoken.id === '(number)') {
            advance();
            if (nexttoken.value === 'n' && nexttoken.identifier) {
                adjacent();
                advance();
                if (nexttoken.id === '+') {
                    adjacent();
                    advance('+');
                    adjacent();
                    advance('(number)');
                }
            }
            return;
        } else {
            switch (nexttoken.value) {
            case 'odd':
            case 'even':
                if (nexttoken.identifier) {
                    advance();
                    return;
                }
            }
        }
        warning("Unexpected token '{a}'.", nexttoken, nexttoken.value);
    }

    function substyle() {
        var v;
        for (;;) {
            if (nexttoken.id === '}' || nexttoken.id === '(end)' ||
                    xquote && nexttoken.id === xquote) {
                return;
            }
            while (nexttoken.id === ';') {
                warning("Misplaced ';'.");
                advance(';');
            }
            v = styleAttribute();
            advance(':');
            if (nexttoken.identifier && nexttoken.value === 'inherit') {
                advance();
            } else {
                if (!styleValue(v)) {
                    warning("Unexpected token '{a}'.", nexttoken,
                        nexttoken.value);
                    advance();
                }
            }
            if (nexttoken.id === '!') {
                advance('!');
                adjacent();
                if (nexttoken.identifier && nexttoken.value === 'important') {
                    advance();
                } else {
                    warning("Expected '{a}' and instead saw '{b}'.",
                        nexttoken, 'important', nexttoken.value);
                }
            }
            if (nexttoken.id === '}' || nexttoken.id === xquote) {
                warning("Missing '{a}'.", nexttoken, ';');
            } else {
                advance(';');
            }
        }
    }

    function styleSelector() {
        if (nexttoken.identifier) {
            if (!is_own(htmltag, option.cap ?
                    nexttoken.value.toLowerCase() : nexttoken.value)) {
                warning("Expected a tagName, and instead saw {a}.",
                    nexttoken, nexttoken.value);
            }
            advance();
        } else {
            switch (nexttoken.id) {
            case '>':
            case '+':
                advance();
                styleSelector();
                break;
            case ':':
                advance(':');
                switch (nexttoken.value) {
                case 'active':
                case 'after':
                case 'before':
                case 'checked':
                case 'disabled':
                case 'empty':
                case 'enabled':
                case 'first-child':
                case 'first-letter':
                case 'first-line':
                case 'first-of-type':
                case 'focus':
                case 'hover':
                case 'last-child':
                case 'last-of-type':
                case 'link':
                case 'only-of-type':
                case 'root':
                case 'target':
                case 'visited':
                    advance();
                    break;
                case 'lang':
                    advance();
                    advance('(');
                    if (!nexttoken.identifier) {
                        warning("Expected a lang code, and instead saw :{a}.",
                            nexttoken, nexttoken.value);
                    }
                    advance(')');
                    break;
                case 'nth-child':
                case 'nth-last-child':
                case 'nth-last-of-type':
                case 'nth-of-type':
                    advance();
                    advance('(');
                    styleChild();
                    advance(')');
                    break;
                case 'not':
                    advance();
                    advance('(');
                    if (nexttoken.id === ':' && peek(0).value === 'not') {
                        warning("Nested not.");
                    }
                    styleSelector();
                    advance(')');
                    break;
                default:
                    warning("Expected a pseudo, and instead saw :{a}.",
                        nexttoken, nexttoken.value);
                }
                break;
            case '#':
                advance('#');
                if (!nexttoken.identifier) {
                    warning("Expected an id, and instead saw #{a}.",
                        nexttoken, nexttoken.value);
                }
                advance();
                break;
            case '*':
                advance('*');
                break;
            case '.':
                advance('.');
                if (!nexttoken.identifier) {
                    warning("Expected a class, and instead saw #.{a}.",
                        nexttoken, nexttoken.value);
                }
                advance();
                break;
            case '[':
                advance('[');
                if (!nexttoken.identifier) {
                    warning("Expected an attribute, and instead saw [{a}].",
                        nexttoken, nexttoken.value);
                }
                advance();
                if (nexttoken.id === '=' || nexttoken.value === '~=' ||
                        nexttoken.value === '$=' ||
                        nexttoken.value === '|=' ||
                        nexttoken.id === '*=' ||
                        nexttoken.id === '^=') {
                    advance();
                    if (nexttoken.type !== '(string)') {
                        warning("Expected a string, and instead saw {a}.",
                            nexttoken, nexttoken.value);
                    }
                    advance();
                }
                advance(']');
                break;
            default:
                error("Expected a CSS selector, and instead saw {a}.",
                    nexttoken, nexttoken.value);
            }
        }
    }

    function stylePattern() {
        if (nexttoken.id === '{') {
            warning("Expected a style pattern, and instead saw '{a}'.", nexttoken,
                nexttoken.id);
        }
        for (;;) {
            styleSelector();
            if (nexttoken.id === '</' || nexttoken.id === '{' ||
                    nexttoken.id === '(end)') {
                return '';
            }
            if (nexttoken.id === ',') {
                comma();
            }
        }
    }

    function stylelist() {
        while (nexttoken.id !== '</' && nexttoken.id !== '(end)') {
            stylePattern();
            xmode = 'styleproperty';
            if (nexttoken.id === ';') {
                advance(';');
            } else {
                advance('{');
                substyle();
                xmode = 'style';
                advance('}');
            }
        }
    }

    function styles() {
        var i;
        while (nexttoken.id === '@') {
            i = peek();
            advance('@');
            if (nexttoken.identifier) {
                switch (nexttoken.value) {
                case 'import':
                    advance();
                    if (!cssUrl()) {
                        warning("Expected '{a}' and instead saw '{b}'.",
                            nexttoken, 'url', nexttoken.value);
                        advance();
                    }
                    advance(';');
                    break;
                case 'media':
                    advance();
                    for (;;) {
                        if (!nexttoken.identifier || cssMedia[nexttoken.value] === true) {
                            error("Expected a CSS media type, and instead saw '{a}'.", nexttoken, nexttoken.id);
                        }
                        advance();
                        if (nexttoken.id !== ',') {
                            break;
                        }
                        advance(',');
                    }
                    advance('{');
                    stylelist();
                    advance('}');
                    break;
                default:
                    warning("Expected an at-rule, and instead saw @{a}.",
                        nexttoken, nexttoken.value);
                }
            } else {
                warning("Expected an at-rule, and instead saw '{a}'.",
                    nexttoken, nexttoken.value);
            }
        }
        stylelist();
    }


// HTML parsing.

    function doBegin(n) {
        if (n !== 'html' && !option.fragment) {
            if (n === 'div' && option.adsafe) {
                error("ADSAFE: Use the fragment option.");
            } else {
                error("Expected '{a}' and instead saw '{b}'.",
                    token, 'html', n);
            }
        }
        if (option.adsafe) {
            if (n === 'html') {
                error(
"Currently, ADsafe does not operate on whole HTML documents. It operates on <div> fragments and .js files.", token);
            }
            if (option.fragment) {
                if (n !== 'div') {
                    error("ADsafe violation: Wrap the widget in a div.", token);
                }
            } else {
                error("Use the fragment option.", token);
            }
        }
        option.browser = true;
        assume();
    }

    function doAttribute(n, a, v) {
        var u, x;
        if (a === 'id') {
            u = typeof v === 'string' ? v.toUpperCase() : '';
            if (ids[u] === true) {
                warning("Duplicate id='{a}'.", nexttoken, v);
            }
            if (!/^[A-Za-z][A-Za-z0-9._:\-]*$/.test(v)) {
                warning("Bad id: '{a}'.", nexttoken, v);
            } else if (option.adsafe) {
                if (adsafe_id) {
                    if (v.slice(0, adsafe_id.length) !== adsafe_id) {
                        warning("ADsafe violation: An id must have a '{a}' prefix",
                                nexttoken, adsafe_id);
                    } else if (!/^[A-Z]+_[A-Z]+$/.test(v)) {
                        warning("ADSAFE violation: bad id.");
                    }
                } else {
                    adsafe_id = v;
                    if (!/^[A-Z]+_$/.test(v)) {
                        warning("ADSAFE violation: bad id.");
                    }
                }
            }
            x = v.search(dx);
            if (x >= 0) {
                warning("Unexpected character '{a}' in {b}.", token, v.charAt(x), a);
            }
            ids[u] = true;
        } else if (a === 'class' || a === 'type' || a === 'name') {
            x = v.search(qx);
            if (x >= 0) {
                warning("Unexpected character '{a}' in {b}.", token, v.charAt(x), a);
            }
            ids[u] = true;
        } else if (a === 'href' || a === 'background' ||
                a === 'content' || a === 'data' ||
                a.indexOf('src') >= 0 || a.indexOf('url') >= 0) {
            if (option.safe && ux.test(v)) {
                error("ADsafe URL violation.");
            }
            urls.push(v);
        } else if (a === 'for') {
            if (option.adsafe) {
                if (adsafe_id) {
                    if (v.slice(0, adsafe_id.length) !== adsafe_id) {
                        warning("ADsafe violation: An id must have a '{a}' prefix",
                                nexttoken, adsafe_id);
                    } else if (!/^[A-Z]+_[A-Z]+$/.test(v)) {
                        warning("ADSAFE violation: bad id.");
                    }
                } else {
                    warning("ADSAFE violation: bad id.");
                }
            }
        } else if (a === 'name') {
            if (option.adsafe && v.indexOf('_') >= 0) {
                warning("ADsafe name violation.");
            }
        }
    }

    function doTag(n, a) {
        var i, t = htmltag[n], x;
        src = false;
        if (!t) {
            error("Unrecognized tag '<{a}>'.",
                    nexttoken,
                    n === n.toLowerCase() ? n :
                        n + ' (capitalization error)');
        }
        if (stack.length > 0) {
            if (n === 'html') {
                error("Too many <html> tags.", token);
            }
            x = t.parent;
            if (x) {
                if (x.indexOf(' ' + stack[stack.length - 1].name + ' ') < 0) {
                    error("A '<{a}>' must be within '<{b}>'.",
                            token, n, x);
                }
            } else if (!option.adsafe && !option.fragment) {
                i = stack.length;
                do {
                    if (i <= 0) {
                        error("A '<{a}>' must be within '<{b}>'.",
                                token, n, 'body');
                    }
                    i -= 1;
                } while (stack[i].name !== 'body');
            }
        }
        switch (n) {
        case 'div':
            if (option.adsafe && stack.length === 1 && !adsafe_id) {
                warning("ADSAFE violation: missing ID_.");
            }
            break;
        case 'script':
            xmode = 'script';
            advance('>');
            indent = nexttoken.from;
            if (a.lang) {
                warning("lang is deprecated.", token);
            }
            if (option.adsafe && stack.length !== 1) {
                warning("ADsafe script placement violation.", token);
            }
            if (a.src) {
                if (option.adsafe && (!adsafe_may || !approved[a.src])) {
                    warning("ADsafe unapproved script source.", token);
                }
                if (a.type) {
                    warning("type is unnecessary.", token);
                }
            } else {
                if (adsafe_went) {
                    error("ADsafe script violation.", token);
                }
                use_strict();
                statements('script');
            }
            xmode = 'html';
            advance('</');
            if (!nexttoken.identifier && nexttoken.value !== 'script') {
                warning("Expected '{a}' and instead saw '{b}'.",
                        nexttoken, 'script', nexttoken.value);
            }
            advance();
            xmode = 'outer';
            break;
        case 'style':
            xmode = 'style';
            advance('>');
            styles();
            xmode = 'html';
            advance('</');
            if (!nexttoken.identifier && nexttoken.value !== 'style') {
                warning("Expected '{a}' and instead saw '{b}'.",
                        nexttoken, 'style', nexttoken.value);
            }
            advance();
            xmode = 'outer';
            break;
        case 'input':
            switch (a.type) {
            case 'radio':
            case 'checkbox':
            case 'button':
            case 'reset':
            case 'submit':
                break;
            case 'text':
            case 'file':
            case 'password':
            case 'file':
            case 'hidden':
            case 'image':
                if (option.adsafe && a.autocomplete !== 'off') {
                    warning("ADsafe autocomplete violation.");
                }
                break;
            default:
                warning("Bad input type.");
            }
            break;
        case 'applet':
        case 'body':
        case 'embed':
        case 'frame':
        case 'frameset':
        case 'head':
        case 'iframe':
        case 'noembed':
        case 'noframes':
        case 'object':
        case 'param':
            if (option.adsafe) {
                warning("ADsafe violation: Disallowed tag: " + n);
            }
            break;
        }
    }


    function closetag(n) {
        return '</' + n + '>';
    }

    function html() {
        var a, attributes, e, n, q, t, v, w = option.white, wmode;
        xmode = 'html';
        xquote = '';
        stack = null;
        for (;;) {
            switch (nexttoken.value) {
            case '<':
                xmode = 'html';
                advance('<');
                attributes = {};
                t = nexttoken;
                if (!t.identifier) {
                    warning("Bad identifier {a}.", t, t.value);
                }
                n = t.value;
                if (option.cap) {
                    n = n.toLowerCase();
                }
                t.name = n;
                advance();
                if (!stack) {
                    stack = [];
                    doBegin(n);
                }
                v = htmltag[n];
                if (typeof v !== 'object') {
                    error("Unrecognized tag '<{a}>'.", t, n);
                }
                e = v.empty;
                t.type = n;
                for (;;) {
                    if (nexttoken.id === '/') {
                        advance('/');
                        if (nexttoken.id !== '>') {
                            warning("Expected '{a}' and instead saw '{b}'.",
                                    nexttoken, '>', nexttoken.value);
                        }
                        break;
                    }
                    if (nexttoken.id && nexttoken.id.substr(0, 1) === '>') {
                        break;
                    }
                    if (!nexttoken.identifier) {
                        if (nexttoken.id === '(end)' || nexttoken.id === '(error)') {
                            error("Missing '>'.", nexttoken);
                        }
                        warning("Bad identifier.");
                    }
                    option.white = true;
                    nonadjacent(token, nexttoken);
                    a = nexttoken.value;
                    option.white = w;
                    advance();
                    if (!option.cap && a !== a.toLowerCase()) {
                        warning("Attribute '{a}' not all lower case.", nexttoken, a);
                    }
                    a = a.toLowerCase();
                    xquote = '';
                    if (is_own(attributes, a)) {
                        warning("Attribute '{a}' repeated.", nexttoken, a);
                    }
                    if (a.slice(0, 2) === 'on') {
                        if (!option.on) {
                            warning("Avoid HTML event handlers.");
                        }
                        xmode = 'scriptstring';
                        advance('=');
                        q = nexttoken.id;
                        if (q !== '"' && q !== "'") {
                            error("Missing quote.");
                        }
                        xquote = q;
                        wmode = option.white;
                        option.white = false;
                        advance(q);
                        use_strict();
                        statements('on');
                        option.white = wmode;
                        if (nexttoken.id !== q) {
                            error("Missing close quote on script attribute.");
                        }
                        xmode = 'html';
                        xquote = '';
                        advance(q);
                        v = false;
                    } else if (a === 'style') {
                        xmode = 'scriptstring';
                        advance('=');
                        q = nexttoken.id;
                        if (q !== '"' && q !== "'") {
                            error("Missing quote.");
                        }
                        xmode = 'styleproperty';
                        xquote = q;
                        advance(q);
                        substyle();
                        xmode = 'html';
                        xquote = '';
                        advance(q);
                        v = false;
                    } else {
                        if (nexttoken.id === '=') {
                            advance('=');
                            v = nexttoken.value;
                            if (!nexttoken.identifier &&
                                    nexttoken.id !== '"' &&
                                    nexttoken.id !== '\'' &&
                                    nexttoken.type !== '(string)' &&
                                    nexttoken.type !== '(number)' &&
                                    nexttoken.type !== '(color)') {
                                warning("Expected an attribute value and instead saw '{a}'.", token, a);
                            }
                            advance();
                        } else {
                            v = true;
                        }
                    }
                    attributes[a] = v;
                    doAttribute(n, a, v);
                }
                doTag(n, attributes);
                if (!e) {
                    stack.push(t);
                }
                xmode = 'outer';
                advance('>');
                break;
            case '</':
                xmode = 'html';
                advance('</');
                if (!nexttoken.identifier) {
                    warning("Bad identifier.");
                }
                n = nexttoken.value;
                if (option.cap) {
                    n = n.toLowerCase();
                }
                advance();
                if (!stack) {
                    error("Unexpected '{a}'.", nexttoken, closetag(n));
                }
                t = stack.pop();
                if (!t) {
                    error("Unexpected '{a}'.", nexttoken, closetag(n));
                }
                if (t.name !== n) {
                    error("Expected '{a}' and instead saw '{b}'.",
                            nexttoken, closetag(t.name), closetag(n));
                }
                if (nexttoken.id !== '>') {
                    error("Missing '{a}'.", nexttoken, '>');
                }
                xmode = 'outer';
                advance('>');
                break;
            case '<!':
                if (option.safe) {
                    warning("ADsafe HTML violation.");
                }
                xmode = 'html';
                for (;;) {
                    advance();
                    if (nexttoken.id === '>' || nexttoken.id === '(end)') {
                        break;
                    }
                    if (nexttoken.value.indexOf('--') >= 0) {
                        error("Unexpected --.");
                    }
                    if (nexttoken.value.indexOf('<') >= 0) {
                        error("Unexpected <.");
                    }
                    if (nexttoken.value.indexOf('>') >= 0) {
                        error("Unexpected >.");
                    }
                }
                xmode = 'outer';
                advance('>');
                break;
            case '(end)':
                return;
            default:
                if (nexttoken.id === '(end)') {
                    error("Missing '{a}'.", nexttoken,
                            '</' + stack[stack.length - 1].value + '>');
                } else {
                    advance();
                }
            }
            if (stack && stack.length === 0 && (option.adsafe ||
                    !option.fragment || nexttoken.id === '(end)')) {
                break;
            }
        }
        if (nexttoken.id !== '(end)') {
            error("Unexpected material after the end.");
        }
    }


// Build the syntax table by declaring the syntactic elements of the language.

    type('(number)', function () {
        return this;
    });
    type('(string)', function () {
        return this;
    });

    syntax['(identifier)'] = {
        type: '(identifier)',
        lbp: 0,
        identifier: true,
        nud: function () {
            var v = this.value,
                s = scope[v],
                f;
            if (typeof s === 'function') {

// Protection against accidental inheritance.

                s = undefined;
            } else if (typeof s === 'boolean') {
                f = funct;
                funct = functions[0];
                addlabel(v, 'var');
                s = funct;
                funct = f;
            }

// The name is in scope and defined in the current function.

            if (funct === s) {

//      Change 'unused' to 'var', and reject labels.

                switch (funct[v]) {
                case 'unused':
                    funct[v] = 'var';
                    break;
                case 'unction':
                    funct[v] = 'function';
                    this['function'] = true;
                    break;
                case 'function':
                    this['function'] = true;
                    break;
                case 'label':
                    warning("'{a}' is a statement label.", token, v);
                    break;
                }

// The name is not defined in the function.  If we are in the global scope,
// then we have an undefined variable.

            } else if (funct['(global)']) {
                if (option.undef && typeof predefined[v] !== 'boolean') {
                    warning("'{a}' is not defined.", token, v);
                }
                note_implied(token);

// If the name is already defined in the current
// function, but not as outer, then there is a scope error.

            } else {
                switch (funct[v]) {
                case 'closure':
                case 'function':
                case 'var':
                case 'unused':
                    warning("'{a}' used out of scope.", token, v);
                    break;
                case 'label':
                    warning("'{a}' is a statement label.", token, v);
                    break;
                case 'outer':
                case 'global':
                    break;
                default:

// If the name is defined in an outer function, make an outer entry, and if
// it was unused, make it var.

                    if (s === true) {
                        funct[v] = true;
                    } else if (s === null) {
                        warning("'{a}' is not allowed.", token, v);
                        note_implied(token);
                    } else if (typeof s !== 'object') {
                        if (option.undef) {
                            warning("'{a}' is not defined.", token, v);
                        } else {
                            funct[v] = true;
                        }
                        note_implied(token);
                    } else {
                        switch (s[v]) {
                        case 'function':
                        case 'unction':
                            this['function'] = true;
                            s[v] = 'closure';
                            funct[v] = s['(global)'] ? 'global' : 'outer';
                            break;
                        case 'var':
                        case 'unused':
                            s[v] = 'closure';
                            funct[v] = s['(global)'] ? 'global' : 'outer';
                            break;
                        case 'closure':
                        case 'parameter':
                            funct[v] = s['(global)'] ? 'global' : 'outer';
                            break;
                        case 'label':
                            warning("'{a}' is a statement label.", token, v);
                        }
                    }
                }
            }
            return this;
        },
        led: function () {
            error("Expected an operator and instead saw '{a}'.",
                nexttoken, nexttoken.value);
        }
    };

    type('(regexp)', function () {
        return this;
    });


// ECMAScript parser

    delim('(endline)');
    delim('(begin)');
    delim('(end)').reach = true;
    delim('</').reach = true;
    delim('<!');
    delim('<!--');
    delim('-->');
    delim('(error)').reach = true;
    delim('}').reach = true;
    delim(')');
    delim(']');
    delim('"').reach = true;
    delim("'").reach = true;
    delim(';');
    delim(':').reach = true;
    delim(',');
    delim('#');
    delim('@');
    reserve('else');
    reserve('case').reach = true;
    reserve('catch');
    reserve('default').reach = true;
    reserve('finally');
    reservevar('arguments', function (x) {
        if (strict_mode && funct['(global)']) {
            warning("Strict violation.", x);
        } else if (option.safe) {
            warning("ADsafe violation.", x);
        }
    });
    reservevar('eval', function (x) {
        if (option.safe) {
            warning("ADsafe violation.", x);
        }
    });
    reservevar('false');
    reservevar('Infinity');
    reservevar('NaN');
    reservevar('null');
    reservevar('this', function (x) {
        if (strict_mode && ((funct['(statement)'] &&
                funct['(name)'].charAt(0) > 'Z') || funct['(global)'])) {
            warning("Strict violation.", x);
        } else if (option.safe) {
            warning("ADsafe violation.", x);
        }
    });
    reservevar('true');
    reservevar('undefined');
    assignop('=', 'assign', 20);
    assignop('+=', 'assignadd', 20);
    assignop('-=', 'assignsub', 20);
    assignop('*=', 'assignmult', 20);
    assignop('/=', 'assigndiv', 20).nud = function () {
        error("A regular expression literal can be confused with '/='.");
    };
    assignop('%=', 'assignmod', 20);
    bitwiseassignop('&=', 'assignbitand', 20);
    bitwiseassignop('|=', 'assignbitor', 20);
    bitwiseassignop('^=', 'assignbitxor', 20);
    bitwiseassignop('<<=', 'assignshiftleft', 20);
    bitwiseassignop('>>=', 'assignshiftright', 20);
    bitwiseassignop('>>>=', 'assignshiftrightunsigned', 20);
    infix('?', function (left, that) {
        that.left = left;
        that.right = expression(10);
        advance(':');
        that['else'] = expression(10);
        return that;
    }, 30);

    infix('||', 'or', 40);
    infix('&&', 'and', 50);
    bitwise('|', 'bitor', 70);
    bitwise('^', 'bitxor', 80);
    bitwise('&', 'bitand', 90);
    relation('==', function (left, right) {
        if (option.eqeqeq) {
            warning("Expected '{a}' and instead saw '{b}'.",
                    this, '===', '==');
        } else if (isPoorRelation(left)) {
            warning("Use '{a}' to compare with '{b}'.",
                this, '===', left.value);
        } else if (isPoorRelation(right)) {
            warning("Use '{a}' to compare with '{b}'.",
                this, '===', right.value);
        }
        return this;
    });
    relation('===');
    relation('!=', function (left, right) {
        if (option.eqeqeq) {
            warning("Expected '{a}' and instead saw '{b}'.",
                    this, '!==', '!=');
        } else if (isPoorRelation(left)) {
            warning("Use '{a}' to compare with '{b}'.",
                    this, '!==', left.value);
        } else if (isPoorRelation(right)) {
            warning("Use '{a}' to compare with '{b}'.",
                    this, '!==', right.value);
        }
        return this;
    });
    relation('!==');
    relation('<');
    relation('>');
    relation('<=');
    relation('>=');
    bitwise('<<', 'shiftleft', 120);
    bitwise('>>', 'shiftright', 120);
    bitwise('>>>', 'shiftrightunsigned', 120);
    infix('in', 'in', 120);
    infix('instanceof', 'instanceof', 120);
    infix('+', function (left, that) {
        var right = expression(130);
        if (left && right && left.id === '(string)' && right.id === '(string)') {
            left.value += right.value;
            left.character = right.character;
            if (jx.test(left.value)) {
                warning("JavaScript URL.", left);
            }
            return left;
        }
        that.left = left;
        that.right = right;
        return that;
    }, 130);
    prefix('+', 'num');
    prefix('+++', function () {
        warning("Confusing pluses.");
        this.right = expression(150);
        this.arity = 'unary';
        return this;
    });
    infix('+++', function (left) {
        warning("Confusing pluses.");
        this.left = left;
        this.right = expression(130);
        return this;
    }, 130);
    infix('-', 'sub', 130);
    prefix('-', 'neg');
    prefix('---', function () {
        warning("Confusing minuses.");
        this.right = expression(150);
        this.arity = 'unary';
        return this;
    });
    infix('---', function (left) {
        warning("Confusing minuses.");
        this.left = left;
        this.right = expression(130);
        return this;
    }, 130);
    infix('*', 'mult', 140);
    infix('/', 'div', 140);
    infix('%', 'mod', 140);

    suffix('++', 'postinc');
    prefix('++', 'preinc');
    syntax['++'].exps = true;

    suffix('--', 'postdec');
    prefix('--', 'predec');
    syntax['--'].exps = true;
    prefix('delete', function () {
        var p = expression(0);
        if (!p || (p.id !== '.' && p.id !== '[')) {
            warning("Variables should not be deleted.");
        }
        this.first = p;
        return this;
    }).exps = true;


    prefix('~', function () {
        if (option.bitwise) {
            warning("Unexpected '{a}'.", this, '~');
        }
        expression(150);
        return this;
    });
    prefix('!', function () {
        this.right = expression(150);
        this.arity = 'unary';
        if (bang[this.right.id] === true) {
            warning("Confusing use of '{a}'.", this, '!');
        }
        return this;
    });
    prefix('typeof', 'typeof');
    prefix('new', function () {
        var c = expression(155), i;
        if (c && c.id !== 'function') {
            if (c.identifier) {
                c['new'] = true;
                switch (c.value) {
                case 'Object':
                    warning("Use the object literal notation {}.", token);
                    break;
                case 'Array':
                    if (nexttoken.id !== '(') {
                        warning("Use the array literal notation [].", token);
                    } else {
                        advance('(');
                        if (nexttoken.id === ')') {
                            warning("Use the array literal notation [].", token);
                        }
                        advance(')');
                    }
                    this.first = c;
                    return this;
                case 'Number':
                case 'String':
                case 'Boolean':
                case 'Math':
                case 'JSON':
                    warning("Do not use {a} as a constructor.", token, c.value);
                    break;
                case 'Function':
                    if (!option.evil) {
                        warning("The Function constructor is eval.");
                    }
                    break;
                case 'Date':
                case 'RegExp':
                    break;
                default:
                    if (c.id !== 'function') {
                        i = c.value.substr(0, 1);
                        if (option.newcap && (i < 'A' || i > 'Z')) {
                            warning(
                    "A constructor name should start with an uppercase letter.",
                                token);
                        }
                    }
                }
            } else {
                if (c.id !== '.' && c.id !== '[' && c.id !== '(') {
                    warning("Bad constructor.", token);
                }
            }
        } else {
            warning("Weird construction. Delete 'new'.", this);
        }
        adjacent(token, nexttoken);
        if (nexttoken.id !== '(') {
            warning("Missing '()' invoking a constructor.");
        }
        this.first = c;
        return this;
    });
    syntax['new'].exps = true;

    infix('.', function (left, that) {
        adjacent(prevtoken, token);
        nobreak();
        var m = identifier();
        if (typeof m === 'string') {
            countMember(m);
        }
        that.left = left;
        that.right = m;
        if (option.noarg && left && left.value === 'arguments' &&
                (m === 'callee' || m === 'caller')) {
            warning("Avoid arguments.{a}.", left, m);
        } else if (!option.evil && left && left.value === 'document' &&
                (m === 'write' || m === 'writeln')) {
            warning("document.write can be a form of eval.", left);
        } else if (option.adsafe) {
            if (left && left.value === 'ADSAFE') {
                if (m === 'id' || m === 'lib') {
                    warning("ADsafe violation.", that);
                } else if (m === 'go') {
                    if (xmode !== 'script') {
                        warning("ADsafe violation.", that);
                    } else if (adsafe_went || nexttoken.id !== '(' ||
                            peek(0).id !== '(string)' ||
                            peek(0).value !== adsafe_id ||
                            peek(1).id !== ',') {
                        error("ADsafe violation: go.", that);
                    }
                    adsafe_went = true;
                    adsafe_may = false;
                }
            }
        }
        if (!option.evil && (m === 'eval' || m === 'execScript')) {
            warning('eval is evil.');
        } else if (option.safe) {
            for (;;) {
                if (banned[m] === true) {
                    warning("ADsafe restricted word '{a}'.", token, m);
                }
                if (typeof predefined[left.value] !== 'boolean' ||
                        nexttoken.id === '(') {
                    break;
                }
                if (standard_member[m] === true) {
                    if (nexttoken.id === '.') {
                        warning("ADsafe violation.", that);
                    }
                    break;
                }
                if (nexttoken.id !== '.') {
                    warning("ADsafe violation.", that);
                    break;
                }
                advance('.');
                token.left = that;
                token.right = m;
                that = token;
                m = identifier();
                if (typeof m === 'string') {
                    countMember(m);
                }
            }
        }
        return that;
    }, 160, true);

    infix('(', function (left, that) {
        if (prevtoken.id !== '}' && prevtoken.id !== ')') {
            nobreak(prevtoken, token);
        }
        nospace();
        if (option.immed && !left.immed && left.id === 'function') {
            warning("Wrap an immediate function invocation in parentheses " +
                "to assist the reader in understanding that the expression " +
                "is the result of a function, and not the function itself.");
        }
        var n = 0,
            p = [];
        if (left) {
            if (left.type === '(identifier)') {
                if (left.value.match(/^[A-Z]([A-Z0-9_$]*[a-z][A-Za-z0-9_$]*)?$/)) {
                    if (left.value !== 'Number' && left.value !== 'String' &&
                            left.value !== 'Boolean' &&
                            left.value !== 'Date') {
                        if (left.value === 'Math') {
                            warning("Math is not a function.", left);
                        } else if (option.newcap) {
                            warning(
"Missing 'new' prefix when invoking a constructor.", left);
                        }
                    }
                }
            } else if (left.id === '.') {
                if (option.safe && left.left.value === 'Math' &&
                        left.right === 'random') {
                    warning("ADsafe violation.", left);
                }
            }
        }
        if (nexttoken.id !== ')') {
            for (;;) {
                p[p.length] = expression(10);
                n += 1;
                if (nexttoken.id !== ',') {
                    break;
                }
                comma();
            }
        }
        advance(')');
        nospace(prevtoken, token);
        if (typeof left === 'object') {
            if (left.value === 'parseInt' && n === 1) {
                warning("Missing radix parameter.", left);
            }
            if (!option.evil) {
                if (left.value === 'eval' || left.value === 'Function' ||
                        left.value === 'execScript') {
                    warning("eval is evil.", left);
                } else if (p[0] && p[0].id === '(string)' &&
                       (left.value === 'setTimeout' ||
                        left.value === 'setInterval')) {
                    warning(
    "Implied eval is evil. Pass a function instead of a string.", left);
                }
            }
            if (!left.identifier && left.id !== '.' && left.id !== '[' &&
                    left.id !== '(' && left.id !== '&&' && left.id !== '||' &&
                    left.id !== '?') {
                warning("Bad invocation.", left);
            }
        }
        that.left = left;
        return that;
    }, 155, true).exps = true;

    prefix('(', function () {
        nospace();
        if (nexttoken.id === 'function') {
            nexttoken.immed = true;
        }
        var v = expression(0);
        advance(')', this);
        nospace(prevtoken, token);
        if (option.immed && v.id === 'function') {
            if (nexttoken.id === '(') {
                warning(
"Move the invocation into the parens that contain the function.", nexttoken);
            } else {
                warning(
"Do not wrap function literals in parens unless they are to be immediately invoked.",
                        this);
            }
        }
        return v;
    });

    infix('[', function (left, that) {
        nobreak(prevtoken, token);
        nospace();
        var e = expression(0), s;
        if (e && e.type === '(string)') {
            if (option.safe && banned[e.value] === true) {
                warning("ADsafe restricted word '{a}'.", that, e.value);
            } else if (!option.evil &&
                    (e.value === 'eval' || e.value === 'execScript')) {
                warning("eval is evil.", that);
            } else if (option.safe &&
                    (e.value.charAt(0) === '_' || e.value.charAt(0) === '-')) {
                warning("ADsafe restricted subscript '{a}'.", that, e.value);
            }
            countMember(e.value);
            if (!option.sub && ix.test(e.value)) {
                s = syntax[e.value];
                if (!s || !s.reserved) {
                    warning("['{a}'] is better written in dot notation.",
                            e, e.value);
                }
            }
        } else if (!e || e.type !== '(number)' || e.value < 0) {
            if (option.safe) {
                warning('ADsafe subscripting.');
            }
        }
        advance(']', that);
        nospace(prevtoken, token);
        that.left = left;
        that.right = e;
        return that;
    }, 160, true);

    prefix('[', function () {
        var b = token.line !== nexttoken.line;
        this.first = [];
        if (b) {
            indent += option.indent;
            if (nexttoken.from === indent + option.indent) {
                indent += option.indent;
            }
        }
        while (nexttoken.id !== '(end)') {
            while (nexttoken.id === ',') {
                warning("Extra comma.");
                advance(',');
            }
            if (nexttoken.id === ']') {
                break;
            }
            if (b && token.line !== nexttoken.line) {
                indentation();
            }
            this.first.push(expression(10));
            if (nexttoken.id === ',') {
                comma();
                if (nexttoken.id === ']' && !option.es5) {
                    warning("Extra comma.", token);
                    break;
                }
            } else {
                break;
            }
        }
        if (b) {
            indent -= option.indent;
            indentation();
        }
        advance(']', this);
        return this;
    }, 160);


    function property_name() {
        var id = optionalidentifier(true);
        if (!id) {
            if (nexttoken.id === '(string)') {
                id = nexttoken.value;
                if (option.adsafe &&
                        (id.charAt(0) === '_' ||
                         id.charAt(id.length - 1) === '_')) {
                    warning("Unexpected {a} in '{b}'.", token,
                        "dangling '_'", id);
                }
                advance();
            } else if (nexttoken.id === '(number)') {
                id = nexttoken.value.toString();
                advance();
            }
        }
        return id;
    }


    function functionparams() {
        var i, t = nexttoken, p = [];
        advance('(');
        nospace();
        if (nexttoken.id === ')') {
            advance(')');
            nospace(prevtoken, token);
            return;
        }
        for (;;) {
            i = identifier();
            p.push(i);
            addlabel(i, 'parameter');
            if (nexttoken.id === ',') {
                comma();
            } else {
                advance(')', t);
                nospace(prevtoken, token);
                return p;
            }
        }
    }


    function doFunction(i, statement) {
        var f, s = scope;
        scope = Object.create(s);
        funct = {
            '(name)'     : i || '"' + anonname + '"',
            '(line)'     : nexttoken.line,
            '(context)'  : funct,
            '(breakage)' : 0,
            '(loopage)'  : 0,
            '(scope)'    : scope,
            '(statement)': statement
        };
        f = funct;
        token.funct = funct;
        functions.push(funct);
        if (i) {
            addlabel(i, 'function');
        }
        funct['(params)'] = functionparams();

        block(false);
        scope = s;
        funct['(last)'] = token.line;
        funct = funct['(context)'];
        return f;
    }


    (function (x) {
        x.nud = function () {
            var b, f, i, j, p, seen = {}, t;
            b = token.line !== nexttoken.line;
            if (b) {
                indent += option.indent;
                if (nexttoken.from === indent + option.indent) {
                    indent += option.indent;
                }
            }
            for (;;) {
                if (nexttoken.id === '}') {
                    break;
                }
                if (b) {
                    indentation();
                }
                if (nexttoken.value === 'get' && peek().id !== ':') {
                    advance('get');
                    if (!option.es5) {
                        error("get/set are ES5 features.");
                    }
                    i = property_name();
                    if (!i) {
                        error("Missing property name.");
                    }
                    t = nexttoken;
                    adjacent(token, nexttoken);
                    f = doFunction(i);
                    if (funct['(loopage)']) {
                        warning("Don't make functions within a loop.", t);
                    }
                    p = f['(params)'];
                    if (p) {
                        warning("Unexpected parameter '{a}' in get {b} function.", t, p[0], i);
                    }
                    adjacent(token, nexttoken);
                    advance(',');
                    indentation();
                    advance('set');
                    j = property_name();
                    if (i !== j) {
                        error("Expected {a} and instead saw {b}.", token, i, j);
                    }
                    t = nexttoken;
                    adjacent(token, nexttoken);
                    f = doFunction(i);
                    p = f['(params)'];
                    if (!p || p.length !== 1 || p[0] !== 'value') {
                        warning("Expected (value) in set {a} function.", t, i);
                    }
                } else {
                    i = property_name();
                    if (typeof i !== 'string') {
                        break;
                    }
                    advance(':');
                    nonadjacent(token, nexttoken);
                    expression(10);
                }
                if (seen[i] === true) {
                    warning("Duplicate member '{a}'.", nexttoken, i);
                }
                seen[i] = true;
                countMember(i);
                if (nexttoken.id === ',') {
                    comma();
                    if (nexttoken.id === ',') {
                        warning("Extra comma.", token);
                    } else if (nexttoken.id === '}' && !option.es5) {
                        warning("Extra comma.", token);
                    }
                } else {
                    break;
                }
            }
            if (b) {
                indent -= option.indent;
                indentation();
            }
            advance('}', this);
            return this;
        };
        x.fud = function () {
            error("Expected to see a statement and instead saw a block.", token);
        };
    }(delim('{')));


    var varstatement = function varstatement(prefix) {

// JavaScript does not have block scope. It only has function scope. So,
// declaring a variable in a block can have unexpected consequences.

        var id, name, value;

        if (funct['(onevar)'] && option.onevar) {
            warning("Too many var statements.");
        } else if (!funct['(global)']) {
            funct['(onevar)'] = true;
        }
        this.first = [];
        for (;;) {
            nonadjacent(token, nexttoken);
            id = identifier();
            if (funct['(global)'] && predefined[id] === false) {
                warning("Redefinition of '{a}'.", token, id);
            }
            addlabel(id, 'unused');
            if (prefix) {
                break;
            }
            name = token;
            this.first.push(token);
            if (nexttoken.id === '=') {
                nonadjacent(token, nexttoken);
                advance('=');
                nonadjacent(token, nexttoken);
                if (nexttoken.id === 'undefined') {
                    warning("It is not necessary to initialize '{a}' to 'undefined'.", token, id);
                }
                if (peek(0).id === '=' && nexttoken.identifier) {
                    error("Variable {a} was not declared correctly.",
                            nexttoken, nexttoken.value);
                }
                value = expression(0);
                name.first = value;
            }
            if (nexttoken.id !== ',') {
                break;
            }
            comma();
        }
        return this;
    };


    stmt('var', varstatement).exps = true;


    blockstmt('function', function () {
        if (inblock) {
            warning(
"Function statements should not be placed in blocks. Use a function expression or move the statement to the top of the outer function.", token);

        }
        var i = identifier();
        adjacent(token, nexttoken);
        addlabel(i, 'unction');
        doFunction(i, true);
        if (nexttoken.id === '(' && nexttoken.line === token.line) {
            error(
"Function statements are not invocable. Wrap the whole function invocation in parens.");
        }
        return this;
    });

    prefix('function', function () {
        var i = optionalidentifier();
        if (i) {
            adjacent(token, nexttoken);
        } else {
            nonadjacent(token, nexttoken);
        }
        doFunction(i);
        if (funct['(loopage)']) {
            warning("Don't make functions within a loop.");
        }
        return this;
    });

    blockstmt('if', function () {
        var t = nexttoken;
        advance('(');
        nonadjacent(this, t);
        nospace();
        expression(20);
        if (nexttoken.id === '=') {
            if (!option.boss)
                warning("Expected a conditional expression and instead saw an assignment.");
            advance('=');
            expression(20);
        }
        advance(')', t);
        nospace(prevtoken, token);
        block(true, true);
        if (nexttoken.id === 'else') {
            nonadjacent(token, nexttoken);
            advance('else');
            if (nexttoken.id === 'if' || nexttoken.id === 'switch') {
                statement(true);
            } else {
                block(true, true);
            }
        }
        return this;
    });

    blockstmt('try', function () {
        var b, e, s;
        if (option.adsafe) {
            warning("ADsafe try violation.", this);
        }
        block(false);
        if (nexttoken.id === 'catch') {
            advance('catch');
            nonadjacent(token, nexttoken);
            advance('(');
            s = scope;
            scope = Object.create(s);
            e = nexttoken.value;
            if (nexttoken.type !== '(identifier)') {
                warning("Expected an identifier and instead saw '{a}'.",
                    nexttoken, e);
            } else {
                addlabel(e, 'exception');
            }
            advance();
            advance(')');
            block(false);
            b = true;
            scope = s;
        }
        if (nexttoken.id === 'finally') {
            advance('finally');
            block(false);
            return;
        } else if (!b) {
            error("Expected '{a}' and instead saw '{b}'.",
                    nexttoken, 'catch', nexttoken.value);
        }
        return this;
    });

    blockstmt('while', function () {
        var t = nexttoken;
        funct['(breakage)'] += 1;
        funct['(loopage)'] += 1;
        advance('(');
        nonadjacent(this, t);
        nospace();
        expression(20);
        if (nexttoken.id === '=') {
            if (!option.boss)
                warning("Expected a conditional expression and instead saw an assignment.");
            advance('=');
            expression(20);
        }
        advance(')', t);
        nospace(prevtoken, token);
        block(true, true);
        funct['(breakage)'] -= 1;
        funct['(loopage)'] -= 1;
        return this;
    }).labelled = true;

    reserve('with');

    blockstmt('switch', function () {
        var t = nexttoken,
            g = false;
        funct['(breakage)'] += 1;
        advance('(');
        nonadjacent(this, t);
        nospace();
        this.condition = expression(20);
        advance(')', t);
        nospace(prevtoken, token);
        nonadjacent(token, nexttoken);
        t = nexttoken;
        advance('{');
        nonadjacent(token, nexttoken);
        indent += option.indent;
        this.cases = [];
        for (;;) {
            switch (nexttoken.id) {
            case 'case':
                switch (funct['(verb)']) {
                case 'break':
                case 'case':
                case 'continue':
                case 'return':
                case 'switch':
                case 'throw':
                    break;
                default:
                    warning(
                        "Expected a 'break' statement before 'case'.",
                        token);
                }
                indentation(-option.indent);
                advance('case');
                this.cases.push(expression(20));
                g = true;
                advance(':');
                funct['(verb)'] = 'case';
                break;
            case 'default':
                switch (funct['(verb)']) {
                case 'break':
                case 'continue':
                case 'return':
                case 'throw':
                    break;
                default:
                    warning(
                        "Expected a 'break' statement before 'default'.",
                        token);
                }
                indentation(-option.indent);
                advance('default');
                g = true;
                advance(':');
                break;
            case '}':
                indent -= option.indent;
                indentation();
                advance('}', t);
                if (this.cases.length === 1 || this.condition.id === 'true' ||
                        this.condition.id === 'false') {
                    warning("This 'switch' should be an 'if'.", this);
                }
                funct['(breakage)'] -= 1;
                funct['(verb)'] = undefined;
                return;
            case '(end)':
                error("Missing '{a}'.", nexttoken, '}');
                return;
            default:
                if (g) {
                    switch (token.id) {
                    case ',':
                        error("Each value should have its own case label.");
                        return;
                    case ':':
                        statements();
                        break;
                    default:
                        error("Missing ':' on a case clause.", token);
                    }
                } else {
                    error("Expected '{a}' and instead saw '{b}'.",
                        nexttoken, 'case', nexttoken.value);
                }
            }
        }
    }).labelled = true;

    stmt('debugger', function () {
        if (!option.debug) {
            warning("All 'debugger' statements should be removed.");
        }
        return this;
    }).exps = true;

    (function () {
        var x = stmt('do', function () {
            funct['(breakage)'] += 1;
            funct['(loopage)'] += 1;
            this.first = block(true);
            advance('while');
            var t = nexttoken;
            nonadjacent(token, t);
            advance('(');
            nospace();
            expression(20);
            if (nexttoken.id === '=') {
                if (!option.boss)
                    warning("Expected a conditional expression and instead saw an assignment.");
                advance('=');
                expression(20);
            }
            advance(')', t);
            nospace(prevtoken, token);
            funct['(breakage)'] -= 1;
            funct['(loopage)'] -= 1;
            return this;
        });
        x.labelled = true;
        x.exps = true;
    }());

    blockstmt('for', function () {
        var f = option.forin, s, t = nexttoken;
        funct['(breakage)'] += 1;
        funct['(loopage)'] += 1;
        advance('(');
        nonadjacent(this, t);
        nospace();
        if (peek(nexttoken.id === 'var' ? 1 : 0).id === 'in') {
            if (nexttoken.id === 'var') {
                advance('var');
                varstatement(true);
            } else {
                switch (funct[nexttoken.value]) {
                case 'unused':
                    funct[nexttoken.value] = 'var';
                    break;
                case 'var':
                    break;
                default:
                    warning("Bad for in variable '{a}'.",
                            nexttoken, nexttoken.value);
                }
                advance();
            }
            advance('in');
            expression(20);
            advance(')', t);
            s = block(true, true);
            if (!f && (s.length > 1 || typeof s[0] !== 'object' ||
                    s[0].value !== 'if')) {
                warning("The body of a for in should be wrapped in an if statement to filter unwanted properties from the prototype.", this);
            }
            funct['(breakage)'] -= 1;
            funct['(loopage)'] -= 1;
            return this;
        } else {
            if (nexttoken.id !== ';') {
                if (nexttoken.id === 'var') {
                    advance('var');
                    varstatement();
                } else {
                    for (;;) {
                        expression(0, 'for');
                        if (nexttoken.id !== ',') {
                            break;
                        }
                        comma();
                    }
                }
            }
            nolinebreak(token);
            advance(';');
            if (nexttoken.id !== ';') {
                expression(20);
                if (nexttoken.id === '=') {
                    if (!option.boss)
                        warning("Expected a conditional expression and instead saw an assignment.");
                    advance('=');
                    expression(20);
                }
            }
            nolinebreak(token);
            advance(';');
            if (nexttoken.id === ';') {
                error("Expected '{a}' and instead saw '{b}'.",
                        nexttoken, ')', ';');
            }
            if (nexttoken.id !== ')') {
                for (;;) {
                    expression(0, 'for');
                    if (nexttoken.id !== ',') {
                        break;
                    }
                    comma();
                }
            }
            advance(')', t);
            nospace(prevtoken, token);
            block(true, true);
            funct['(breakage)'] -= 1;
            funct['(loopage)'] -= 1;
            return this;
        }
    }).labelled = true;


    stmt('break', function () {
        var v = nexttoken.value;
        if (funct['(breakage)'] === 0) {
            warning("Unexpected '{a}'.", nexttoken, this.value);
        }
        nolinebreak(this);
        if (nexttoken.id !== ';') {
            if (token.line === nexttoken.line) {
                if (funct[v] !== 'label') {
                    warning("'{a}' is not a statement label.", nexttoken, v);
                } else if (scope[v] !== funct) {
                    warning("'{a}' is out of scope.", nexttoken, v);
                }
                this.first = nexttoken;
                advance();
            }
        }
        reachable('break');
        return this;
    }).exps = true;


    stmt('continue', function () {
        var v = nexttoken.value;
        if (funct['(breakage)'] === 0) {
            warning("Unexpected '{a}'.", nexttoken, this.value);
        }
        nolinebreak(this);
        if (nexttoken.id !== ';') {
            if (token.line === nexttoken.line) {
                if (funct[v] !== 'label') {
                    warning("'{a}' is not a statement label.", nexttoken, v);
                } else if (scope[v] !== funct) {
                    warning("'{a}' is out of scope.", nexttoken, v);
                }
                this.first = nexttoken;
                advance();
            }
        } else if (!funct['(loopage)']) {
            warning("Unexpected '{a}'.", nexttoken, this.value);
        }
        reachable('continue');
        return this;
    }).exps = true;


    stmt('return', function () {
        nolinebreak(this);
        if (nexttoken.id === '(regexp)') {
            warning("Wrap the /regexp/ literal in parens to disambiguate the slash operator.");
        }
        if (nexttoken.id !== ';' && !nexttoken.reach) {
            nonadjacent(token, nexttoken);
            this.first = expression(20);
        }
        reachable('return');
        return this;
    }).exps = true;


    stmt('throw', function () {
        nolinebreak(this);
        nonadjacent(token, nexttoken);
        this.first = expression(20);
        reachable('throw');
        return this;
    }).exps = true;

    reserve('void');

//  Superfluous reserved words

    reserve('class');
    reserve('const');
    reserve('enum');
    reserve('export');
    reserve('extends');
    reserve('import');
    reserve('super');

    reserve('let');
    reserve('yield');
    reserve('implements');
    reserve('interface');
    reserve('package');
    reserve('private');
    reserve('protected');
    reserve('public');
    reserve('static');


// Parse JSON

    function jsonValue() {

        function jsonObject() {
            var o = {}, t = nexttoken;
            advance('{');
            if (nexttoken.id !== '}') {
                for (;;) {
                    if (nexttoken.id === '(end)') {
                        error("Missing '}' to match '{' from line {a}.",
                                nexttoken, t.line);
                    } else if (nexttoken.id === '}') {
                        warning("Unexpected comma.", token);
                        break;
                    } else if (nexttoken.id === ',') {
                        error("Unexpected comma.", nexttoken);
                    } else if (nexttoken.id !== '(string)') {
                        warning("Expected a string and instead saw {a}.",
                                nexttoken, nexttoken.value);
                    }
                    if (o[nexttoken.value] === true) {
                        warning("Duplicate key '{a}'.",
                                nexttoken, nexttoken.value);
                    } else if (nexttoken.value === '__proto__') {
                        warning("Stupid key '{a}'.",
                                nexttoken, nexttoken.value);
                    } else {
                        o[nexttoken.value] = true;
                    }
                    advance();
                    advance(':');
                    jsonValue();
                    if (nexttoken.id !== ',') {
                        break;
                    }
                    advance(',');
                }
            }
            advance('}');
        }

        function jsonArray() {
            var t = nexttoken;
            advance('[');
            if (nexttoken.id !== ']') {
                for (;;) {
                    if (nexttoken.id === '(end)') {
                        error("Missing ']' to match '[' from line {a}.",
                                nexttoken, t.line);
                    } else if (nexttoken.id === ']') {
                        warning("Unexpected comma.", token);
                        break;
                    } else if (nexttoken.id === ',') {
                        error("Unexpected comma.", nexttoken);
                    }
                    jsonValue();
                    if (nexttoken.id !== ',') {
                        break;
                    }
                    advance(',');
                }
            }
            advance(']');
        }

        switch (nexttoken.id) {
        case '{':
            jsonObject();
            break;
        case '[':
            jsonArray();
            break;
        case 'true':
        case 'false':
        case 'null':
        case '(number)':
        case '(string)':
            advance();
            break;
        case '-':
            advance('-');
            if (token.character !== nexttoken.from) {
                warning("Unexpected space after '-'.", token);
            }
            adjacent(token, nexttoken);
            advance('(number)');
            break;
        default:
            error("Expected a JSON value.", nexttoken);
        }
    }


// The actual JSHINT function itself.

    var itself = function (s, o) {
        var a, i, k;
        JSHINT.errors = [];
        predefined = Object.create(standard);
        if (o) {
            a = o.predef;
            if (a) {
                if (Array.isArray(a)) {
                    for (i = 0; i < a.length; i += 1) {
                        predefined[a[i]] = true;
                    }
                } else if (typeof a === 'object') {
                    k = Object.keys(a);
                    for (i = 0; i < k.length; i += 1) {
                        predefined[k[i]] = !!a[k];
                    }
                }
            }
            if (o.adsafe) {
                o.safe = true;
            }
            if (o.safe) {
                o.browser =
                o.css     =
                o.debug   =
                o.devel   =
                o.evil    =
                o.forin   =
                o.on      =
                o.rhino   =
                o.windows =
                o.sub     =
                o.widget  = false;

                o.eqeqeq  =
                o.nomen   =
                o.safe    =
                o.undef   = true;

                predefined.Date =
                predefined['eval'] =
                predefined.Function =
                predefined.Object = null;

                predefined.ADSAFE =
                predefined.lib = false;
            }
            option = o;
        } else {
            option = {};
        }
        option.indent = option.indent || 4;
        option.maxerr = option.maxerr || 50;
        adsafe_id = '';
        adsafe_may = false;
        adsafe_went = false;
        approved = {};
        if (option.approved) {
            for (i = 0; i < option.approved.length; i += 1) {
                approved[option.approved[i]] = option.approved[i];
            }
        } else {
            approved.test = 'test';
        }
        tab = '';
        for (i = 0; i < option.indent; i += 1) {
            tab += ' ';
        }
        indent = 1;
        global = Object.create(predefined);
        scope = global;
        funct = {
            '(global)': true,
            '(name)': '(global)',
            '(scope)': scope,
            '(breakage)': 0,
            '(loopage)': 0
        };
        functions = [funct];
        ids = {};
        urls = [];
        src = false;
        xmode = false;
        stack = null;
        member = {};
        membersOnly = null;
        implied = {};
        inblock = false;
        lookahead = [];
        jsonmode = false;
        warnings = 0;
        lex.init(s);
        prereg = true;
        strict_mode = false;

        prevtoken = token = nexttoken = syntax['(begin)'];
        assume();

        try {
            advance();
            if (nexttoken.value.charAt(0) === '<') {
                html();
                if (option.adsafe && !adsafe_went) {
                    warning("ADsafe violation: Missing ADSAFE.go.", this);
                }
            } else {
                switch (nexttoken.id) {
                case '{':
                case '[':
                    option.laxbreak = true;
                    jsonmode = true;
                    jsonValue();
                    break;
                case '@':
                case '*':
                case '#':
                case '.':
                case ':':
                    xmode = 'style';
                    advance();
                    if (token.id !== '@' || !nexttoken.identifier ||
                            nexttoken.value !== 'charset' || token.line !== 1 ||
                            token.from !== 1) {
                        error("A css file should begin with @charset 'UTF-8';");
                    }
                    advance();
                    if (nexttoken.type !== '(string)' &&
                            nexttoken.value !== 'UTF-8') {
                        error("A css file should begin with @charset 'UTF-8';");
                    }
                    advance();
                    advance(';');
                    styles();
                    break;

                default:
                    if (option.adsafe && option.fragment) {
                        error("Expected '{a}' and instead saw '{b}'.",
                            nexttoken, '<div>', nexttoken.value);
                    }
                    if (nexttoken.value === 'use strict') {
                        warning("Use the function form of \"use strict\".");
                        use_strict();
                    }
                    statements('lib');
                }
            }
            advance('(end)');
        } catch (e) {
            if (e) {
                JSHINT.errors.push({
                    reason    : e.message,
                    line      : e.line || nexttoken.line,
                    character : e.character || nexttoken.from
                }, null);
            }
        }
        return JSHINT.errors.length === 0;
    };


// Data summary.

    itself.data = function () {

        var data = {functions: []}, fu, globals, implieds = [], f, i, j,
            members = [], n, unused = [], v;
        if (itself.errors.length) {
            data.errors = itself.errors;
        }

        if (jsonmode) {
            data.json = true;
        }

        for (n in implied) {
            if (is_own(implied, n)) {
                implieds.push({
                    name: n,
                    line: implied[n]
                });
            }
        }
        if (implieds.length > 0) {
            data.implieds = implieds;
        }

        if (urls.length > 0) {
            data.urls = urls;
        }

        globals = Object.keys(scope);
        if (globals.length > 0) {
            data.globals = globals;
        }

        for (i = 1; i < functions.length; i += 1) {
            f = functions[i];
            fu = {};
            for (j = 0; j < functionicity.length; j += 1) {
                fu[functionicity[j]] = [];
            }
            for (n in f) {
                if (is_own(f, n) && n.charAt(0) !== '(') {
                    v = f[n];
                    if (v === 'unction') {
                        v = 'unused';
                    }
                    if (Array.isArray(fu[v])) {
                        fu[v].push(n);
                        if (v === 'unused') {
                            unused.push({
                                name: n,
                                line: f['(line)'],
                                'function': f['(name)']
                            });
                        }
                    }
                }
            }
            for (j = 0; j < functionicity.length; j += 1) {
                if (fu[functionicity[j]].length === 0) {
                    delete fu[functionicity[j]];
                }
            }
            fu.name = f['(name)'];
            fu.param = f['(params)'];
            fu.line = f['(line)'];
            fu.last = f['(last)'];
            data.functions.push(fu);
        }

        if (unused.length > 0) {
            data.unused = unused;
        }

        members = [];
        for (n in member) {
            if (typeof member[n] === 'number') {
                data.member = member;
                break;
            }
        }

        return data;
    };

    itself.report = function (option) {
        var data = itself.data();

        var a = [], c, e, err, f, i, k, l, m = '', n, o = [], s;

        function detail(h, array) {
            var b, i, singularity;
            if (array) {
                o.push('<div><i>' + h + '</i> ');
                array = array.sort();
                for (i = 0; i < array.length; i += 1) {
                    if (array[i] !== singularity) {
                        singularity = array[i];
                        o.push((b ? ', ' : '') + singularity);
                        b = true;
                    }
                }
                o.push('</div>');
            }
        }


        if (data.errors || data.implieds || data.unused) {
            err = true;
            o.push('<div id=errors><i>Error:</i>');
            if (data.errors) {
                for (i = 0; i < data.errors.length; i += 1) {
                    c = data.errors[i];
                    if (c) {
                        e = c.evidence || '';
                        o.push('<p>Problem' + (isFinite(c.line) ? ' at line ' +
                                c.line + ' character ' + c.character : '') +
                                ': ' + c.reason.entityify() +
                                '</p><p class=evidence>' +
                                (e && (e.length > 80 ? e.slice(0, 77) + '...' :
                                e).entityify()) + '</p>');
                    }
                }
            }

            if (data.implieds) {
                s = [];
                for (i = 0; i < data.implieds.length; i += 1) {
                    s[i] = '<code>' + data.implieds[i].name + '</code>&nbsp;<i>' +
                        data.implieds[i].line + '</i>';
                }
                o.push('<p><i>Implied global:</i> ' + s.join(', ') + '</p>');
            }

            if (data.unused) {
                s = [];
                for (i = 0; i < data.unused.length; i += 1) {
                    s[i] = '<code><u>' + data.unused[i].name + '</u></code>&nbsp;<i>' +
                        data.unused[i].line + '</i> <code>' +
                        data.unused[i]['function'] + '</code>';
                }
                o.push('<p><i>Unused variable:</i> ' + s.join(', ') + '</p>');
            }
            if (data.json) {
                o.push('<p>JSON: bad.</p>');
            }
            o.push('</div>');
        }

        if (!option) {

            o.push('<br><div id=functions>');

            if (data.urls) {
                detail("URLs<br>", data.urls, '<br>');
            }

            if (xmode === 'style') {
                o.push('<p>CSS.</p>');
            } else if (data.json && !err) {
                o.push('<p>JSON: good.</p>');
            } else if (data.globals) {
                o.push('<div><i>Global</i> ' +
                        data.globals.sort().join(', ') + '</div>');
            } else {
                o.push('<div><i>No new global variables introduced.</i></div>');
            }

            for (i = 0; i < data.functions.length; i += 1) {
                f = data.functions[i];

                o.push('<br><div class=function><i>' + f.line + '-' +
                        f.last + '</i> ' + (f.name || '') + '(' +
                        (f.param ? f.param.join(', ') : '') + ')</div>');
                detail('<big><b>Unused</b></big>', f.unused);
                detail('Closure', f.closure);
                detail('Variable', f['var']);
                detail('Exception', f.exception);
                detail('Outer', f.outer);
                detail('Global', f.global);
                detail('Label', f.label);
            }

            if (data.member) {
                a = Object.keys(data.member);
                if (a.length) {
                    a = a.sort();
                    m = '<br><pre id=members>/*members ';
                    l = 10;
                    for (i = 0; i < a.length; i += 1) {
                        k = a[i];
                        n = k.name();
                        if (l + n.length > 72) {
                            o.push(m + '<br>');
                            m = '    ';
                            l = 1;
                        }
                        l += n.length + 2;
                        if (data.member[k] === 1) {
                            n = '<i>' + n + '</i>';
                        }
                        if (i < a.length - 1) {
                            n += ', ';
                        }
                        m += n;
                    }
                    o.push(m + '<br>*/</pre>');
                }
                o.push('</div>');
            }
        }
        return o.join('');
    };
    itself.jshint = itself;

    return itself;

}());

// Make JSHINT a Node module, if possible.
if (typeof exports == 'object' && exports)
    exports.JSHINT = JSHINT;
    
});/* -*- Mode: JS; tab-width: 4; indent-tabs-mode: nil; -*-
 * vim: set sw=4 ts=4 et tw=78:
 * ***** BEGIN LICENSE BLOCK *****
 *
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is the Narcissus JavaScript engine.
 *
 * The Initial Developer of the Original Code is
 * Brendan Eich <brendan@mozilla.org>.
 * Portions created by the Initial Developer are Copyright (C) 2004
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Tom Austin <taustin@ucsc.edu>
 *   Brendan Eich <brendan@mozilla.org>
 *   Shu-Yu Guo <shu@rfrn.org>
 *   Dave Herman <dherman@mozilla.com>
 *   Dimitris Vardoulakis <dimvar@ccs.neu.edu>
 *   Patrick Walton <pcwalton@mozilla.com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

/*
 * Narcissus - JS implemented in JS.
 *
 * Parser.
 */

define('ace/narcissus/jsparse', ['require', 'exports', 'module' , 'ace/narcissus/jslex', 'ace/narcissus/jsdefs'], function(require, exports, module) {

var lexer = require("ace/narcissus/jslex");
var definitions = require("ace/narcissus/jsdefs");

const StringMap = definitions.StringMap;
const Stack = definitions.Stack;

// Set constants in the local scope.
eval(definitions.consts);

/*
 * pushDestructuringVarDecls :: (node, hoisting node) -> void
 *
 * Recursively add all destructured declarations to varDecls.
 */
function pushDestructuringVarDecls(n, s) {
    for (var i in n) {
        var sub = n[i];
        if (sub.type === IDENTIFIER) {
            s.varDecls.push(sub);
        } else {
            pushDestructuringVarDecls(sub, s);
        }
    }
}

// NESTING_TOP: top-level
// NESTING_SHALLOW: nested within static forms such as { ... } or labeled statement
// NESTING_DEEP: nested within dynamic forms such as if, loops, etc.
const NESTING_TOP = 0, NESTING_SHALLOW = 1, NESTING_DEEP = 2;

function StaticContext(parentScript, parentBlock, inFunction, inForLoopInit, nesting) {
    this.parentScript = parentScript;
    this.parentBlock = parentBlock;
    this.inFunction = inFunction;
    this.inForLoopInit = inForLoopInit;
    this.nesting = nesting;
    this.allLabels = new Stack();
    this.currentLabels = new Stack();
    this.labeledTargets = new Stack();
    this.defaultTarget = null;
    definitions.options.ecma3OnlyMode && (this.ecma3OnlyMode = true);
    definitions.options.parenFreeMode && (this.parenFreeMode = true);
}

StaticContext.prototype = {
    ecma3OnlyMode: false,
    parenFreeMode: false,
    // non-destructive update via prototype extension
    update: function(ext) {
        var desc = {};
        for (var key in ext) {
            desc[key] = {
                value: ext[key],
                writable: true,
                enumerable: true,
                configurable: true
            }
        }
        return Object.create(this, desc);
    },
    pushLabel: function(label) {
        return this.update({ currentLabels: this.currentLabels.push(label),
                             allLabels: this.allLabels.push(label) });
    },
    pushTarget: function(target) {
        var isDefaultTarget = target.isLoop || target.type === SWITCH;

        if (this.currentLabels.isEmpty()) {
            return isDefaultTarget
                 ? this.update({ defaultTarget: target })
                 : this;
        }

        target.labels = new StringMap();
        this.currentLabels.forEach(function(label) {
            target.labels.set(label, true);
        });
        return this.update({ currentLabels: new Stack(),
                             labeledTargets: this.labeledTargets.push(target),
                             defaultTarget: isDefaultTarget
                                            ? target
                                            : this.defaultTarget });
    },
    nest: function(atLeast) {
        var nesting = Math.max(this.nesting, atLeast);
        return (nesting !== this.nesting)
             ? this.update({ nesting: nesting })
             : this;
    }
};

/*
 * Script :: (tokenizer, boolean) -> node
 *
 * Parses the toplevel and function bodies.
 */
function Script(t, inFunction) {
    var n = new Node(t, scriptInit());
    var x = new StaticContext(n, n, inFunction, false, NESTING_TOP);
    Statements(t, x, n);
    return n;
}

// We extend Array slightly with a top-of-stack method.
definitions.defineProperty(Array.prototype, "top",
                           function() {
                               return this.length && this[this.length-1];
                           }, false, false, true);

/*
 * Node :: (tokenizer, optional init object) -> node
 */
function Node(t, init) {
    var token = t.token;
    if (token) {
        // If init.type exists it will override token.type.
        this.type = token.type;
        this.value = token.value;
        this.lineno = token.lineno;

        // Start and end are file positions for error handling.
        this.start = token.start;
        this.end = token.end;
    } else {
        this.lineno = t.lineno;
    }

    // Node uses a tokenizer for debugging (getSource, filename getter).
    this.tokenizer = t;
    this.children = [];

    for (var prop in init)
        this[prop] = init[prop];
}

var Np = Node.prototype = {};
Np.constructor = Node;
Np.toSource = Object.prototype.toSource;

// Always use push to add operands to an expression, to update start and end.
Np.push = function (kid) {
    // kid can be null e.g. [1, , 2].
    if (kid !== null) {
        if (kid.start < this.start)
            this.start = kid.start;
        if (this.end < kid.end)
            this.end = kid.end;
    }
    return this.children.push(kid);
}

Node.indentLevel = 0;

function tokenString(tt) {
    var t = definitions.tokens[tt];
    return /^\W/.test(t) ? definitions.opTypeNames[t] : t.toUpperCase();
}

Np.toString = function () {
    var a = [];
    for (var i in this) {
        if (this.hasOwnProperty(i) && i !== 'type' && i !== 'target')
            a.push({id: i, value: this[i]});
    }
    a.sort(function (a,b) { return (a.id < b.id) ? -1 : 1; });
    const INDENTATION = "    ";
    var n = ++Node.indentLevel;
    var s = "{\n" + INDENTATION.repeat(n) + "type: " + tokenString(this.type);
    for (i = 0; i < a.length; i++)
        s += ",\n" + INDENTATION.repeat(n) + a[i].id + ": " + a[i].value;
    n = --Node.indentLevel;
    s += "\n" + INDENTATION.repeat(n) + "}";
    return s;
}

Np.getSource = function () {
    return this.tokenizer.source.slice(this.start, this.end);
};

/*
 * Helper init objects for common nodes.
 */

const LOOP_INIT = { isLoop: true };

function blockInit() {
    return { type: BLOCK, varDecls: [] };
}

function scriptInit() {
    return { type: SCRIPT,
             funDecls: [],
             varDecls: [],
             modDecls: [],
             impDecls: [],
             expDecls: [],
             loadDeps: [],
             hasEmptyReturn: false,
             hasReturnWithValue: false,
             isGenerator: false };
}

definitions.defineGetter(Np, "filename",
                         function() {
                             return this.tokenizer.filename;
                         });

definitions.defineProperty(String.prototype, "repeat",
                           function(n) {
                               var s = "", t = this + s;
                               while (--n >= 0)
                                   s += t;
                               return s;
                           }, false, false, true);

function MaybeLeftParen(t, x) {
    if (x.parenFreeMode)
        return t.match(LEFT_PAREN) ? LEFT_PAREN : END;
    return t.mustMatch(LEFT_PAREN).type;
}

function MaybeRightParen(t, p) {
    if (p === LEFT_PAREN)
        t.mustMatch(RIGHT_PAREN);
}

/*
 * Statements :: (tokenizer, compiler context, node) -> void
 *
 * Parses a sequence of Statements.
 */
function Statements(t, x, n) {
    try {
        while (!t.done && t.peek(true) !== RIGHT_CURLY)
            n.push(Statement(t, x));
    } catch (e) {
        if (t.done)
            t.unexpectedEOF = true;
        throw e;
    }
}

function Block(t, x) {
    t.mustMatch(LEFT_CURLY);
    var n = new Node(t, blockInit());
    Statements(t, x.update({ parentBlock: n }).pushTarget(n), n);
    t.mustMatch(RIGHT_CURLY);
    return n;
}

const DECLARED_FORM = 0, EXPRESSED_FORM = 1, STATEMENT_FORM = 2;

/*
 * Statement :: (tokenizer, compiler context) -> node
 *
 * Parses a Statement.
 */
function Statement(t, x) {
    var i, label, n, n2, p, c, ss, tt = t.get(true), tt2, x2, x3;

    // Cases for statements ending in a right curly return early, avoiding the
    // common semicolon insertion magic after this switch.
    switch (tt) {
      case FUNCTION:
        // DECLARED_FORM extends funDecls of x, STATEMENT_FORM doesn't.
        return FunctionDefinition(t, x, true,
                                  (x.nesting !== NESTING_TOP)
                                  ? STATEMENT_FORM
                                  : DECLARED_FORM);

      case LEFT_CURLY:
        n = new Node(t, blockInit());
        Statements(t, x.update({ parentBlock: n }).pushTarget(n).nest(NESTING_SHALLOW), n);
        t.mustMatch(RIGHT_CURLY);
        return n;

      case IF:
        n = new Node(t);
        n.condition = HeadExpression(t, x);
        x2 = x.pushTarget(n).nest(NESTING_DEEP);
        n.thenPart = Statement(t, x2);
        n.elsePart = t.match(ELSE) ? Statement(t, x2) : null;
        return n;

      case SWITCH:
        // This allows CASEs after a DEFAULT, which is in the standard.
        n = new Node(t, { cases: [], defaultIndex: -1 });
        n.discriminant = HeadExpression(t, x);
        x2 = x.pushTarget(n).nest(NESTING_DEEP);
        t.mustMatch(LEFT_CURLY);
        while ((tt = t.get()) !== RIGHT_CURLY) {
            switch (tt) {
              case DEFAULT:
                if (n.defaultIndex >= 0)
                    throw t.newSyntaxError("More than one switch default");
                // FALL THROUGH
              case CASE:
                n2 = new Node(t);
                if (tt === DEFAULT)
                    n.defaultIndex = n.cases.length;
                else
                    n2.caseLabel = Expression(t, x2, COLON);
                break;

              default:
                throw t.newSyntaxError("Invalid switch case");
            }
            t.mustMatch(COLON);
            n2.statements = new Node(t, blockInit());
            while ((tt=t.peek(true)) !== CASE && tt !== DEFAULT &&
                    tt !== RIGHT_CURLY)
                n2.statements.push(Statement(t, x2));
            n.cases.push(n2);
        }
        return n;

      case FOR:
        n = new Node(t, LOOP_INIT);
        if (t.match(IDENTIFIER)) {
            if (t.token.value === "each")
                n.isEach = true;
            else
                t.unget();
        }
        if (!x.parenFreeMode)
            t.mustMatch(LEFT_PAREN);
        x2 = x.pushTarget(n).nest(NESTING_DEEP);
        x3 = x.update({ inForLoopInit: true });
        if ((tt = t.peek()) !== SEMICOLON) {
            if (tt === VAR || tt === CONST) {
                t.get();
                n2 = Variables(t, x3);
            } else if (tt === LET) {
                t.get();
                if (t.peek() === LEFT_PAREN) {
                    n2 = LetBlock(t, x3, false);
                } else {
                    // Let in for head, we need to add an implicit block
                    // around the rest of the for.
                    x3.parentBlock = n;
                    n.varDecls = [];
                    n2 = Variables(t, x3);
                }
            } else {
                n2 = Expression(t, x3);
            }
        }
        if (n2 && t.match(IN)) {
            n.type = FOR_IN;
            n.object = Expression(t, x3);
            if (n2.type === VAR || n2.type === LET) {
                c = n2.children;

                // Destructuring turns one decl into multiples, so either
                // there must be only one destructuring or only one
                // decl.
                if (c.length !== 1 && n2.destructurings.length !== 1) {
                    throw new SyntaxError("Invalid for..in left-hand side",
                                          t.filename, n2.lineno);
                }
                if (n2.destructurings.length > 0) {
                    n.iterator = n2.destructurings[0];
                } else {
                    n.iterator = c[0];
                }
                n.varDecl = n2;
            } else {
                if (n2.type === ARRAY_INIT || n2.type === OBJECT_INIT) {
                    n2.destructuredNames = checkDestructuring(t, x3, n2);
                }
                n.iterator = n2;
            }
        } else {
            n.setup = n2;
            t.mustMatch(SEMICOLON);
            if (n.isEach)
                throw t.newSyntaxError("Invalid for each..in loop");
            n.condition = (t.peek() === SEMICOLON)
                          ? null
                          : Expression(t, x3);
            t.mustMatch(SEMICOLON);
            tt2 = t.peek();
            n.update = (x.parenFreeMode
                        ? tt2 === LEFT_CURLY || definitions.isStatementStartCode[tt2]
                        : tt2 === RIGHT_PAREN)
                       ? null
                       : Expression(t, x3);
        }
        if (!x.parenFreeMode)
            t.mustMatch(RIGHT_PAREN);
        n.body = Statement(t, x2);
        return n;

      case WHILE:
        n = new Node(t, { isLoop: true });
        n.condition = HeadExpression(t, x);
        n.body = Statement(t, x.pushTarget(n).nest(NESTING_DEEP));
        return n;

      case DO:
        n = new Node(t, { isLoop: true });
        n.body = Statement(t, x.pushTarget(n).nest(NESTING_DEEP));
        t.mustMatch(WHILE);
        n.condition = HeadExpression(t, x);
        if (!x.ecmaStrictMode) {
            // <script language="JavaScript"> (without version hints) may need
            // automatic semicolon insertion without a newline after do-while.
            // See http://bugzilla.mozilla.org/show_bug.cgi?id=238945.
            t.match(SEMICOLON);
            return n;
        }
        break;

      case BREAK:
      case CONTINUE:
        n = new Node(t);

        // handle the |foo: break foo;| corner case
        x2 = x.pushTarget(n);

        if (t.peekOnSameLine() === IDENTIFIER) {
            t.get();
            n.label = t.token.value;
        }

        n.target = n.label
                 ? x2.labeledTargets.find(function(target) { return target.labels.has(n.label) })
                 : x2.defaultTarget;

        if (!n.target)
            throw t.newSyntaxError("Invalid " + ((tt === BREAK) ? "break" : "continue"));
        if (!n.target.isLoop && tt === CONTINUE)
            throw t.newSyntaxError("Invalid continue");

        break;

      case TRY:
        n = new Node(t, { catchClauses: [] });
        n.tryBlock = Block(t, x);
        while (t.match(CATCH)) {
            n2 = new Node(t);
            p = MaybeLeftParen(t, x);
            switch (t.get()) {
              case LEFT_BRACKET:
              case LEFT_CURLY:
                // Destructured catch identifiers.
                t.unget();
                n2.varName = DestructuringExpression(t, x, true);
                break;
              case IDENTIFIER:
                n2.varName = t.token.value;
                break;
              default:
                throw t.newSyntaxError("missing identifier in catch");
                break;
            }
            if (t.match(IF)) {
                if (x.ecma3OnlyMode)
                    throw t.newSyntaxError("Illegal catch guard");
                if (n.catchClauses.length && !n.catchClauses.top().guard)
                    throw t.newSyntaxError("Guarded catch after unguarded");
                n2.guard = Expression(t, x);
            }
            MaybeRightParen(t, p);
            n2.block = Block(t, x);
            n.catchClauses.push(n2);
        }
        if (t.match(FINALLY))
            n.finallyBlock = Block(t, x);
        if (!n.catchClauses.length && !n.finallyBlock)
            throw t.newSyntaxError("Invalid try statement");
        return n;

      case CATCH:
      case FINALLY:
        throw t.newSyntaxError(definitions.tokens[tt] + " without preceding try");

      case THROW:
        n = new Node(t);
        n.exception = Expression(t, x);
        break;

      case RETURN:
        n = ReturnOrYield(t, x);
        break;

      case WITH:
        n = new Node(t);
        n.object = HeadExpression(t, x);
        n.body = Statement(t, x.pushTarget(n).nest(NESTING_DEEP));
        return n;

      case VAR:
      case CONST:
        n = Variables(t, x);
        break;

      case LET:
        if (t.peek() === LEFT_PAREN)
            n = LetBlock(t, x, true);
        else
            n = Variables(t, x);
        break;

      case DEBUGGER:
        n = new Node(t);
        break;

      case NEWLINE:
      case SEMICOLON:
        n = new Node(t, { type: SEMICOLON });
        n.expression = null;
        return n;

      default:
        if (tt === IDENTIFIER) {
            tt = t.peek();
            // Labeled statement.
            if (tt === COLON) {
                label = t.token.value;
                if (x.allLabels.has(label))
                    throw t.newSyntaxError("Duplicate label");
                t.get();
                n = new Node(t, { type: LABEL, label: label });
                n.statement = Statement(t, x.pushLabel(label).nest(NESTING_SHALLOW));
                n.target = (n.statement.type === LABEL) ? n.statement.target : n.statement;
                return n;
            }
        }

        // Expression statement.
        // We unget the current token to parse the expression as a whole.
        n = new Node(t, { type: SEMICOLON });
        t.unget();
        n.expression = Expression(t, x);
        n.end = n.expression.end;
        break;
    }

    MagicalSemicolon(t);
    return n;
}

function MagicalSemicolon(t) {
    var tt;
    if (t.lineno === t.token.lineno) {
        tt = t.peekOnSameLine();
        if (tt !== END && tt !== NEWLINE && tt !== SEMICOLON && tt !== RIGHT_CURLY)
            throw t.newSyntaxError("missing ; before statement");
    }
    t.match(SEMICOLON);
}

function ReturnOrYield(t, x) {
    var n, b, tt = t.token.type, tt2;

    var parentScript = x.parentScript;

    if (tt === RETURN) {
        if (!x.inFunction)
            throw t.newSyntaxError("Return not in function");
    } else /* if (tt === YIELD) */ {
        if (!x.inFunction)
            throw t.newSyntaxError("Yield not in function");
        parentScript.isGenerator = true;
    }
    n = new Node(t, { value: undefined });

    tt2 = t.peek(true);
    if (tt2 !== END && tt2 !== NEWLINE &&
        tt2 !== SEMICOLON && tt2 !== RIGHT_CURLY
        && (tt !== YIELD ||
            (tt2 !== tt && tt2 !== RIGHT_BRACKET && tt2 !== RIGHT_PAREN &&
             tt2 !== COLON && tt2 !== COMMA))) {
        if (tt === RETURN) {
            n.value = Expression(t, x);
            parentScript.hasReturnWithValue = true;
        } else {
            n.value = AssignExpression(t, x);
        }
    } else if (tt === RETURN) {
        parentScript.hasEmptyReturn = true;
    }

    // Disallow return v; in generator.
    if (parentScript.hasReturnWithValue && parentScript.isGenerator)
        throw t.newSyntaxError("Generator returns a value");

    return n;
}

/*
 * FunctionDefinition :: (tokenizer, compiler context, boolean,
 *                        DECLARED_FORM or EXPRESSED_FORM or STATEMENT_FORM)
 *                    -> node
 */
function FunctionDefinition(t, x, requireName, functionForm) {
    var tt;
    var f = new Node(t, { params: [] });
    if (f.type !== FUNCTION)
        f.type = (f.value === "get") ? GETTER : SETTER;
    if (t.match(IDENTIFIER))
        f.name = t.token.value;
    else if (requireName)
        throw t.newSyntaxError("missing function identifier");

    var x2 = new StaticContext(null, null, true, false, NESTING_TOP);

    t.mustMatch(LEFT_PAREN);
    if (!t.match(RIGHT_PAREN)) {
        do {
            switch (t.get()) {
              case LEFT_BRACKET:
              case LEFT_CURLY:
                // Destructured formal parameters.
                t.unget();
                f.params.push(DestructuringExpression(t, x2));
                break;
              case IDENTIFIER:
                f.params.push(t.token.value);
                break;
              default:
                throw t.newSyntaxError("missing formal parameter");
                break;
            }
        } while (t.match(COMMA));
        t.mustMatch(RIGHT_PAREN);
    }

    // Do we have an expression closure or a normal body?
    tt = t.get();
    if (tt !== LEFT_CURLY)
        t.unget();

    if (tt !== LEFT_CURLY) {
        f.body = AssignExpression(t, x2);
        if (f.body.isGenerator)
            throw t.newSyntaxError("Generator returns a value");
    } else {
        f.body = Script(t, true);
    }

    if (tt === LEFT_CURLY)
        t.mustMatch(RIGHT_CURLY);

    f.end = t.token.end;
    f.functionForm = functionForm;
    if (functionForm === DECLARED_FORM)
        x.parentScript.funDecls.push(f);
    return f;
}

/*
 * Variables :: (tokenizer, compiler context) -> node
 *
 * Parses a comma-separated list of var declarations (and maybe
 * initializations).
 */
function Variables(t, x, letBlock) {
    var n, n2, ss, i, s, tt;

    tt = t.token.type;
    switch (tt) {
      case VAR:
      case CONST:
        s = x.parentScript;
        break;
      case LET:
        s = x.parentBlock;
        break;
      case LEFT_PAREN:
        tt = LET;
        s = letBlock;
        break;
    }

    n = new Node(t, { type: tt, destructurings: [] });

    do {
        tt = t.get();
        if (tt === LEFT_BRACKET || tt === LEFT_CURLY) {
            // Need to unget to parse the full destructured expression.
            t.unget();

            var dexp = DestructuringExpression(t, x, true);

            n2 = new Node(t, { type: IDENTIFIER,
                               name: dexp,
                               readOnly: n.type === CONST });
            n.push(n2);
            pushDestructuringVarDecls(n2.name.destructuredNames, s);
            n.destructurings.push({ exp: dexp, decl: n2 });

            if (x.inForLoopInit && t.peek() === IN) {
                continue;
            }

            t.mustMatch(ASSIGN);
            if (t.token.assignOp)
                throw t.newSyntaxError("Invalid variable initialization");

            n2.initializer = AssignExpression(t, x);

            continue;
        }

        if (tt !== IDENTIFIER)
            throw t.newSyntaxError("missing variable name");

        n2 = new Node(t, { type: IDENTIFIER,
                           name: t.token.value,
                           readOnly: n.type === CONST });
        n.push(n2);
        s.varDecls.push(n2);

        if (t.match(ASSIGN)) {
            if (t.token.assignOp)
                throw t.newSyntaxError("Invalid variable initialization");

            n2.initializer = AssignExpression(t, x);
        }
    } while (t.match(COMMA));

    return n;
}

/*
 * LetBlock :: (tokenizer, compiler context, boolean) -> node
 *
 * Does not handle let inside of for loop init.
 */
function LetBlock(t, x, isStatement) {
    var n, n2;

    // t.token.type must be LET
    n = new Node(t, { type: LET_BLOCK, varDecls: [] });
    t.mustMatch(LEFT_PAREN);
    n.variables = Variables(t, x, n);
    t.mustMatch(RIGHT_PAREN);

    if (isStatement && t.peek() !== LEFT_CURLY) {
        /*
         * If this is really an expression in let statement guise, then we
         * need to wrap the LET_BLOCK node in a SEMICOLON node so that we pop
         * the return value of the expression.
         */
        n2 = new Node(t, { type: SEMICOLON,
                           expression: n });
        isStatement = false;
    }

    if (isStatement)
        n.block = Block(t, x);
    else
        n.expression = AssignExpression(t, x);

    return n;
}

function checkDestructuring(t, x, n, simpleNamesOnly) {
    if (n.type === ARRAY_COMP)
        throw t.newSyntaxError("Invalid array comprehension left-hand side");
    if (n.type !== ARRAY_INIT && n.type !== OBJECT_INIT)
        return;

    var lhss = {};
    var nn, n2, idx, sub, cc, c = n.children;
    for (var i = 0, j = c.length; i < j; i++) {
        if (!(nn = c[i]))
            continue;
        if (nn.type === PROPERTY_INIT) {
            cc = nn.children;
            sub = cc[1];
            idx = cc[0].value;
        } else if (n.type === OBJECT_INIT) {
            // Do we have destructuring shorthand {foo, bar}?
            sub = nn;
            idx = nn.value;
        } else {
            sub = nn;
            idx = i;
        }

        if (sub.type === ARRAY_INIT || sub.type === OBJECT_INIT) {
            lhss[idx] = checkDestructuring(t, x, sub, simpleNamesOnly);
        } else {
            if (simpleNamesOnly && sub.type !== IDENTIFIER) {
                // In declarations, lhs must be simple names
                throw t.newSyntaxError("missing name in pattern");
            }

            lhss[idx] = sub;
        }
    }

    return lhss;
}

function DestructuringExpression(t, x, simpleNamesOnly) {
    var n = PrimaryExpression(t, x);
    // Keep the list of lefthand sides for varDecls
    n.destructuredNames = checkDestructuring(t, x, n, simpleNamesOnly);
    return n;
}

function GeneratorExpression(t, x, e) {
    return new Node(t, { type: GENERATOR,
                         expression: e,
                         tail: ComprehensionTail(t, x) });
}

function ComprehensionTail(t, x) {
    var body, n, n2, n3, p;

    // t.token.type must be FOR
    body = new Node(t, { type: COMP_TAIL });

    do {
        // Comprehension tails are always for..in loops.
        n = new Node(t, { type: FOR_IN, isLoop: true });
        if (t.match(IDENTIFIER)) {
            // But sometimes they're for each..in.
            if (t.token.value === "each")
                n.isEach = true;
            else
                t.unget();
        }
        p = MaybeLeftParen(t, x);
        switch(t.get()) {
          case LEFT_BRACKET:
          case LEFT_CURLY:
            t.unget();
            // Destructured left side of for in comprehension tails.
            n.iterator = DestructuringExpression(t, x);
            break;

          case IDENTIFIER:
            n.iterator = n3 = new Node(t, { type: IDENTIFIER });
            n3.name = n3.value;
            n.varDecl = n2 = new Node(t, { type: VAR });
            n2.push(n3);
            x.parentScript.varDecls.push(n3);
            // Don't add to varDecls since the semantics of comprehensions is
            // such that the variables are in their own function when
            // desugared.
            break;

          default:
            throw t.newSyntaxError("missing identifier");
        }
        t.mustMatch(IN);
        n.object = Expression(t, x);
        MaybeRightParen(t, p);
        body.push(n);
    } while (t.match(FOR));

    // Optional guard.
    if (t.match(IF))
        body.guard = HeadExpression(t, x);

    return body;
}

function HeadExpression(t, x) {
    var p = MaybeLeftParen(t, x);
    var n = ParenExpression(t, x);
    MaybeRightParen(t, p);
    if (p === END && !n.parenthesized) {
        var tt = t.peek();
        if (tt !== LEFT_CURLY && !definitions.isStatementStartCode[tt])
            throw t.newSyntaxError("Unparenthesized head followed by unbraced body");
    }
    return n;
}

function ParenExpression(t, x) {
    // Always accept the 'in' operator in a parenthesized expression,
    // where it's unambiguous, even if we might be parsing the init of a
    // for statement.
    var n = Expression(t, x.update({ inForLoopInit: x.inForLoopInit &&
                                                    (t.token.type === LEFT_PAREN) }));

    if (t.match(FOR)) {
        if (n.type === YIELD && !n.parenthesized)
            throw t.newSyntaxError("Yield expression must be parenthesized");
        if (n.type === COMMA && !n.parenthesized)
            throw t.newSyntaxError("Generator expression must be parenthesized");
        n = GeneratorExpression(t, x, n);
    }

    return n;
}

/*
 * Expression :: (tokenizer, compiler context) -> node
 *
 * Top-down expression parser matched against SpiderMonkey.
 */
function Expression(t, x) {
    var n, n2;

    n = AssignExpression(t, x);
    if (t.match(COMMA)) {
        n2 = new Node(t, { type: COMMA });
        n2.push(n);
        n = n2;
        do {
            n2 = n.children[n.children.length-1];
            if (n2.type === YIELD && !n2.parenthesized)
                throw t.newSyntaxError("Yield expression must be parenthesized");
            n.push(AssignExpression(t, x));
        } while (t.match(COMMA));
    }

    return n;
}

function AssignExpression(t, x) {
    var n, lhs;

    // Have to treat yield like an operand because it could be the leftmost
    // operand of the expression.
    if (t.match(YIELD, true))
        return ReturnOrYield(t, x);

    n = new Node(t, { type: ASSIGN });
    lhs = ConditionalExpression(t, x);

    if (!t.match(ASSIGN)) {
        return lhs;
    }

    switch (lhs.type) {
      case OBJECT_INIT:
      case ARRAY_INIT:
        lhs.destructuredNames = checkDestructuring(t, x, lhs);
        // FALL THROUGH
      case IDENTIFIER: case DOT: case INDEX: case CALL:
        break;
      default:
        throw t.newSyntaxError("Bad left-hand side of assignment");
        break;
    }

    n.assignOp = t.token.assignOp;
    n.push(lhs);
    n.push(AssignExpression(t, x));

    return n;
}

function ConditionalExpression(t, x) {
    var n, n2;

    n = OrExpression(t, x);
    if (t.match(HOOK)) {
        n2 = n;
        n = new Node(t, { type: HOOK });
        n.push(n2);
        /*
         * Always accept the 'in' operator in the middle clause of a ternary,
         * where it's unambiguous, even if we might be parsing the init of a
         * for statement.
         */
        n.push(AssignExpression(t, x.update({ inForLoopInit: false })));
        if (!t.match(COLON))
            throw t.newSyntaxError("missing : after ?");
        n.push(AssignExpression(t, x));
    }

    return n;
}

function OrExpression(t, x) {
    var n, n2;

    n = AndExpression(t, x);
    while (t.match(OR)) {
        n2 = new Node(t);
        n2.push(n);
        n2.push(AndExpression(t, x));
        n = n2;
    }

    return n;
}

function AndExpression(t, x) {
    var n, n2;

    n = BitwiseOrExpression(t, x);
    while (t.match(AND)) {
        n2 = new Node(t);
        n2.push(n);
        n2.push(BitwiseOrExpression(t, x));
        n = n2;
    }

    return n;
}

function BitwiseOrExpression(t, x) {
    var n, n2;

    n = BitwiseXorExpression(t, x);
    while (t.match(BITWISE_OR)) {
        n2 = new Node(t);
        n2.push(n);
        n2.push(BitwiseXorExpression(t, x));
        n = n2;
    }

    return n;
}

function BitwiseXorExpression(t, x) {
    var n, n2;

    n = BitwiseAndExpression(t, x);
    while (t.match(BITWISE_XOR)) {
        n2 = new Node(t);
        n2.push(n);
        n2.push(BitwiseAndExpression(t, x));
        n = n2;
    }

    return n;
}

function BitwiseAndExpression(t, x) {
    var n, n2;

    n = EqualityExpression(t, x);
    while (t.match(BITWISE_AND)) {
        n2 = new Node(t);
        n2.push(n);
        n2.push(EqualityExpression(t, x));
        n = n2;
    }

    return n;
}

function EqualityExpression(t, x) {
    var n, n2;

    n = RelationalExpression(t, x);
    while (t.match(EQ) || t.match(NE) ||
           t.match(STRICT_EQ) || t.match(STRICT_NE)) {
        n2 = new Node(t);
        n2.push(n);
        n2.push(RelationalExpression(t, x));
        n = n2;
    }

    return n;
}

function RelationalExpression(t, x) {
    var n, n2;

    /*
     * Uses of the in operator in shiftExprs are always unambiguous,
     * so unset the flag that prohibits recognizing it.
     */
    var x2 = x.update({ inForLoopInit: false });
    n = ShiftExpression(t, x2);
    while ((t.match(LT) || t.match(LE) || t.match(GE) || t.match(GT) ||
           (!x.inForLoopInit && t.match(IN)) ||
           t.match(INSTANCEOF))) {
        n2 = new Node(t);
        n2.push(n);
        n2.push(ShiftExpression(t, x2));
        n = n2;
    }

    return n;
}

function ShiftExpression(t, x) {
    var n, n2;

    n = AddExpression(t, x);
    while (t.match(LSH) || t.match(RSH) || t.match(URSH)) {
        n2 = new Node(t);
        n2.push(n);
        n2.push(AddExpression(t, x));
        n = n2;
    }

    return n;
}

function AddExpression(t, x) {
    var n, n2;

    n = MultiplyExpression(t, x);
    while (t.match(PLUS) || t.match(MINUS)) {
        n2 = new Node(t);
        n2.push(n);
        n2.push(MultiplyExpression(t, x));
        n = n2;
    }

    return n;
}

function MultiplyExpression(t, x) {
    var n, n2;

    n = UnaryExpression(t, x);
    while (t.match(MUL) || t.match(DIV) || t.match(MOD)) {
        n2 = new Node(t);
        n2.push(n);
        n2.push(UnaryExpression(t, x));
        n = n2;
    }

    return n;
}

function UnaryExpression(t, x) {
    var n, n2, tt;

    switch (tt = t.get(true)) {
      case DELETE: case VOID: case TYPEOF:
      case NOT: case BITWISE_NOT: case PLUS: case MINUS:
        if (tt === PLUS)
            n = new Node(t, { type: UNARY_PLUS });
        else if (tt === MINUS)
            n = new Node(t, { type: UNARY_MINUS });
        else
            n = new Node(t);
        n.push(UnaryExpression(t, x));
        break;

      case INCREMENT:
      case DECREMENT:
        // Prefix increment/decrement.
        n = new Node(t);
        n.push(MemberExpression(t, x, true));
        break;

      default:
        t.unget();
        n = MemberExpression(t, x, true);

        // Don't look across a newline boundary for a postfix {in,de}crement.
        if (t.tokens[(t.tokenIndex + t.lookahead - 1) & 3].lineno ===
            t.lineno) {
            if (t.match(INCREMENT) || t.match(DECREMENT)) {
                n2 = new Node(t, { postfix: true });
                n2.push(n);
                n = n2;
            }
        }
        break;
    }

    return n;
}

function MemberExpression(t, x, allowCallSyntax) {
    var n, n2, name, tt;

    if (t.match(NEW)) {
        n = new Node(t);
        n.push(MemberExpression(t, x, false));
        if (t.match(LEFT_PAREN)) {
            n.type = NEW_WITH_ARGS;
            n.push(ArgumentList(t, x));
        }
    } else {
        n = PrimaryExpression(t, x);
    }

    while ((tt = t.get()) !== END) {
        switch (tt) {
          case DOT:
            n2 = new Node(t);
            n2.push(n);
            t.mustMatch(IDENTIFIER);
            n2.push(new Node(t));
            break;

          case LEFT_BRACKET:
            n2 = new Node(t, { type: INDEX });
            n2.push(n);
            n2.push(Expression(t, x));
            t.mustMatch(RIGHT_BRACKET);
            break;

          case LEFT_PAREN:
            if (allowCallSyntax) {
                n2 = new Node(t, { type: CALL });
                n2.push(n);
                n2.push(ArgumentList(t, x));
                break;
            }

            // FALL THROUGH
          default:
            t.unget();
            return n;
        }

        n = n2;
    }

    return n;
}

function ArgumentList(t, x) {
    var n, n2;

    n = new Node(t, { type: LIST });
    if (t.match(RIGHT_PAREN, true))
        return n;
    do {
        n2 = AssignExpression(t, x);
        if (n2.type === YIELD && !n2.parenthesized && t.peek() === COMMA)
            throw t.newSyntaxError("Yield expression must be parenthesized");
        if (t.match(FOR)) {
            n2 = GeneratorExpression(t, x, n2);
            if (n.children.length > 1 || t.peek(true) === COMMA)
                throw t.newSyntaxError("Generator expression must be parenthesized");
        }
        n.push(n2);
    } while (t.match(COMMA));
    t.mustMatch(RIGHT_PAREN);

    return n;
}

function PrimaryExpression(t, x) {
    var n, n2, tt = t.get(true);

    switch (tt) {
      case FUNCTION:
        n = FunctionDefinition(t, x, false, EXPRESSED_FORM);
        break;

      case LEFT_BRACKET:
        n = new Node(t, { type: ARRAY_INIT });
        while ((tt = t.peek(true)) !== RIGHT_BRACKET) {
            if (tt === COMMA) {
                t.get();
                n.push(null);
                continue;
            }
            n.push(AssignExpression(t, x));
            if (tt !== COMMA && !t.match(COMMA))
                break;
        }

        // If we matched exactly one element and got a FOR, we have an
        // array comprehension.
        if (n.children.length === 1 && t.match(FOR)) {
            n2 = new Node(t, { type: ARRAY_COMP,
                               expression: n.children[0],
                               tail: ComprehensionTail(t, x) });
            n = n2;
        }
        t.mustMatch(RIGHT_BRACKET);
        break;

      case LEFT_CURLY:
        var id, fd;
        n = new Node(t, { type: OBJECT_INIT });

      object_init:
        if (!t.match(RIGHT_CURLY)) {
            do {
                tt = t.get();
                if ((t.token.value === "get" || t.token.value === "set") &&
                    t.peek() === IDENTIFIER) {
                    if (x.ecma3OnlyMode)
                        throw t.newSyntaxError("Illegal property accessor");
                    n.push(FunctionDefinition(t, x, true, EXPRESSED_FORM));
                } else {
                    switch (tt) {
                      case IDENTIFIER: case NUMBER: case STRING:
                        id = new Node(t, { type: IDENTIFIER });
                        break;
                      case RIGHT_CURLY:
                        if (x.ecma3OnlyMode)
                            throw t.newSyntaxError("Illegal trailing ,");
                        break object_init;
                      default:
                        if (t.token.value in definitions.keywords) {
                            id = new Node(t, { type: IDENTIFIER });
                            break;
                        }
                        throw t.newSyntaxError("Invalid property name");
                    }
                    if (t.match(COLON)) {
                        n2 = new Node(t, { type: PROPERTY_INIT });
                        n2.push(id);
                        n2.push(AssignExpression(t, x));
                        n.push(n2);
                    } else {
                        // Support, e.g., |var {x, y} = o| as destructuring shorthand
                        // for |var {x: x, y: y} = o|, per proposed JS2/ES4 for JS1.8.
                        if (t.peek() !== COMMA && t.peek() !== RIGHT_CURLY)
                            throw t.newSyntaxError("missing : after property");
                        n.push(id);
                    }
                }
            } while (t.match(COMMA));
            t.mustMatch(RIGHT_CURLY);
        }
        break;

      case LEFT_PAREN:
        n = ParenExpression(t, x);
        t.mustMatch(RIGHT_PAREN);
        n.parenthesized = true;
        break;

      case LET:
        n = LetBlock(t, x, false);
        break;

      case NULL: case THIS: case TRUE: case FALSE:
      case IDENTIFIER: case NUMBER: case STRING: case REGEXP:
        n = new Node(t);
        break;

      default:
        throw t.newSyntaxError("missing operand");
        break;
    }

    return n;
}

/*
 * parse :: (source, filename, line number) -> node
 */
function parse(s, f, l) {
    var t = new lexer.Tokenizer(s, f, l);
    var n = Script(t, false);
    if (!t.done)
        throw t.newSyntaxError("Syntax error");

    return n;
}

/*
 * parseStdin :: (source, {line number}) -> node
 */
function parseStdin(s, ln) {
    for (;;) {
        try {
            var t = new lexer.Tokenizer(s, "stdin", ln.value);
            var n = Script(t, false);
            ln.value = t.lineno;
            return n;
        } catch (e) {
            if (!t.unexpectedEOF)
                throw e;
            var more = readline();
            if (!more)
                throw e;
            s += "\n" + more;
        }
    }
}

exports.parse = parse;
exports.parseStdin = parseStdin;
exports.Node = Node;
exports.DECLARED_FORM = DECLARED_FORM;
exports.EXPRESSED_FORM = EXPRESSED_FORM;
exports.STATEMENT_FORM = STATEMENT_FORM;
exports.Tokenizer = lexer.Tokenizer;
exports.FunctionDefinition = FunctionDefinition;

});/* vim: set sw=4 ts=4 et tw=78: */
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is the Narcissus JavaScript engine.
 *
 * The Initial Developer of the Original Code is
 * Brendan Eich <brendan@mozilla.org>.
 * Portions created by the Initial Developer are Copyright (C) 2004
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Tom Austin <taustin@ucsc.edu>
 *   Brendan Eich <brendan@mozilla.org>
 *   Shu-Yu Guo <shu@rfrn.org>
 *   Dave Herman <dherman@mozilla.com>
 *   Dimitris Vardoulakis <dimvar@ccs.neu.edu>
 *   Patrick Walton <pcwalton@mozilla.com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

/*
 * Narcissus - JS implemented in JS.
 *
 * Lexical scanner.
 */

define('ace/narcissus/jslex', ['require', 'exports', 'module' , 'ace/narcissus/jsdefs'], function(require, exports, module) {

var definitions = require("ace/narcissus/jsdefs");

// Set constants in the local scope.
eval(definitions.consts);

// Build up a trie of operator tokens.
var opTokens = {};
for (var op in definitions.opTypeNames) {
    if (op === '\n' || op === '.')
        continue;

    var node = opTokens;
    for (var i = 0; i < op.length; i++) {
        var ch = op[i];
        if (!(ch in node))
            node[ch] = {};
        node = node[ch];
        node.op = op;
    }
}

/*
 * Tokenizer :: (source, filename, line number) -> Tokenizer
 */
function Tokenizer(s, f, l) {
    this.cursor = 0;
    this.source = String(s);
    this.tokens = [];
    this.tokenIndex = 0;
    this.lookahead = 0;
    this.scanNewlines = false;
    this.unexpectedEOF = false;
    this.filename = f || "";
    this.lineno = l || 1;
}

Tokenizer.prototype = {
    get done() {
        // We need to set scanOperand to true here because the first thing
        // might be a regexp.
        return this.peek(true) === END;
    },

    get token() {
        return this.tokens[this.tokenIndex];
    },

    match: function (tt, scanOperand) {
        return this.get(scanOperand) === tt || this.unget();
    },

    mustMatch: function (tt) {
        if (!this.match(tt)) {
            throw this.newSyntaxError("Missing " +
                                      definitions.tokens[tt].toLowerCase());
        }
        return this.token;
    },

    peek: function (scanOperand) {
        var tt, next;
        if (this.lookahead) {
            next = this.tokens[(this.tokenIndex + this.lookahead) & 3];
            tt = (this.scanNewlines && next.lineno !== this.lineno)
                 ? NEWLINE
                 : next.type;
        } else {
            tt = this.get(scanOperand);
            this.unget();
        }
        return tt;
    },

    peekOnSameLine: function (scanOperand) {
        this.scanNewlines = true;
        var tt = this.peek(scanOperand);
        this.scanNewlines = false;
        return tt;
    },

    // Eat comments and whitespace.
    skip: function () {
        var input = this.source;
        for (;;) {
            var ch = input[this.cursor++];
            var next = input[this.cursor];
            if (ch === '\n' && !this.scanNewlines) {
                this.lineno++;
            } else if (ch === '/' && next === '*') {
                this.cursor++;
                for (;;) {
                    ch = input[this.cursor++];
                    if (ch === undefined)
                        throw this.newSyntaxError("Unterminated comment");

                    if (ch === '*') {
                        next = input[this.cursor];
                        if (next === '/') {
                            this.cursor++;
                            break;
                        }
                    } else if (ch === '\n') {
                        this.lineno++;
                    }
                }
            } else if (ch === '/' && next === '/') {
                this.cursor++;
                for (;;) {
                    ch = input[this.cursor++];
                    if (ch === undefined)
                        return;

                    if (ch === '\n') {
                        this.lineno++;
                        break;
                    }
                }
            } else if (ch !== ' ' && ch !== '\t') {
                this.cursor--;
                return;
            }
        }
    },

    // Lex the exponential part of a number, if present. Return true iff an
    // exponential part was found.
    lexExponent: function() {
        var input = this.source;
        var next = input[this.cursor];
        if (next === 'e' || next === 'E') {
            this.cursor++;
            ch = input[this.cursor++];
            if (ch === '+' || ch === '-')
                ch = input[this.cursor++];

            if (ch < '0' || ch > '9')
                throw this.newSyntaxError("Missing exponent");

            do {
                ch = input[this.cursor++];
            } while (ch >= '0' && ch <= '9');
            this.cursor--;

            return true;
        }

        return false;
    },

    lexZeroNumber: function (ch) {
        var token = this.token, input = this.source;
        token.type = NUMBER;

        ch = input[this.cursor++];
        if (ch === '.') {
            do {
                ch = input[this.cursor++];
            } while (ch >= '0' && ch <= '9');
            this.cursor--;

            this.lexExponent();
            token.value = parseFloat(token.start, this.cursor);
        } else if (ch === 'x' || ch === 'X') {
            do {
                ch = input[this.cursor++];
            } while ((ch >= '0' && ch <= '9') || (ch >= 'a' && ch <= 'f') ||
                     (ch >= 'A' && ch <= 'F'));
            this.cursor--;

            token.value = parseInt(input.substring(token.start, this.cursor));
        } else if (ch >= '0' && ch <= '7') {
            do {
                ch = input[this.cursor++];
            } while (ch >= '0' && ch <= '7');
            this.cursor--;

            token.value = parseInt(input.substring(token.start, this.cursor));
        } else {
            this.cursor--;
            this.lexExponent();     // 0E1, &c.
            token.value = 0;
        }
    },

    lexNumber: function (ch) {
        var token = this.token, input = this.source;
        token.type = NUMBER;

        var floating = false;
        do {
            ch = input[this.cursor++];
            if (ch === '.' && !floating) {
                floating = true;
                ch = input[this.cursor++];
            }
        } while (ch >= '0' && ch <= '9');

        this.cursor--;

        var exponent = this.lexExponent();
        floating = floating || exponent;

        var str = input.substring(token.start, this.cursor);
        token.value = floating ? parseFloat(str) : parseInt(str);
    },

    lexDot: function (ch) {
        var token = this.token, input = this.source;
        var next = input[this.cursor];
        if (next >= '0' && next <= '9') {
            do {
                ch = input[this.cursor++];
            } while (ch >= '0' && ch <= '9');
            this.cursor--;

            this.lexExponent();

            token.type = NUMBER;
            token.value = parseFloat(token.start, this.cursor);
        } else {
            token.type = DOT;
            token.assignOp = null;
            token.value = '.';
        }
    },

    lexString: function (ch) {
        var token = this.token, input = this.source;
        token.type = STRING;

        var hasEscapes = false;
        var delim = ch;
        while ((ch = input[this.cursor++]) !== delim) {
            if (this.cursor == input.length)
                throw this.newSyntaxError("Unterminated string literal");
            if (ch === '\\') {
                hasEscapes = true;
                if (++this.cursor == input.length)
                    throw this.newSyntaxError("Unterminated string literal");
            }
        }

        token.value = hasEscapes
                      ? eval(input.substring(token.start, this.cursor))
                      : input.substring(token.start + 1, this.cursor - 1);
    },

    lexRegExp: function (ch) {
        var token = this.token, input = this.source;
        token.type = REGEXP;

        do {
            ch = input[this.cursor++];
            if (ch === '\\') {
                this.cursor++;
            } else if (ch === '[') {
                do {
                    if (ch === undefined)
                        throw this.newSyntaxError("Unterminated character class");

                    if (ch === '\\')
                        this.cursor++;

                    ch = input[this.cursor++];
                } while (ch !== ']');
            } else if (ch === undefined) {
                throw this.newSyntaxError("Unterminated regex");
            }
        } while (ch !== '/');

        do {
            ch = input[this.cursor++];
        } while (ch >= 'a' && ch <= 'z');

        this.cursor--;

        token.value = eval(input.substring(token.start, this.cursor));
    },

    lexOp: function (ch) {
        var token = this.token, input = this.source;

        // A bit ugly, but it seems wasteful to write a trie lookup routine
        // for only 3 characters...
        var node = opTokens[ch];
        var next = input[this.cursor];
        if (next in node) {
            node = node[next];
            this.cursor++;
            next = input[this.cursor];
            if (next in node) {
                node = node[next];
                this.cursor++;
                next = input[this.cursor];
            }
        }

        var op = node.op;
        if (definitions.assignOps[op] && input[this.cursor] === '=') {
            this.cursor++;
            token.type = ASSIGN;
            token.assignOp = definitions.tokenIds[definitions.opTypeNames[op]];
            op += '=';
        } else {
            token.type = definitions.tokenIds[definitions.opTypeNames[op]];
            token.assignOp = null;
        }

        token.value = op;
    },

    // FIXME: Unicode escape sequences
    // FIXME: Unicode identifiers
    lexIdent: function (ch) {
        var token = this.token, input = this.source;

        do {
            ch = input[this.cursor++];
        } while ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') ||
                 (ch >= '0' && ch <= '9') || ch === '$' || ch === '_');

        this.cursor--;  // Put the non-word character back.

        var id = input.substring(token.start, this.cursor);
        token.type = definitions.keywords[id] || IDENTIFIER;
        token.value = id;
    },

    /*
     * Tokenizer.get :: void -> token type
     *
     * Consume input *only* if there is no lookahead.
     * Dispatch to the appropriate lexing function depending on the input.
     */
    get: function (scanOperand) {
        var token;
        while (this.lookahead) {
            --this.lookahead;
            this.tokenIndex = (this.tokenIndex + 1) & 3;
            token = this.tokens[this.tokenIndex];
            if (token.type !== NEWLINE || this.scanNewlines)
                return token.type;
        }

        this.skip();

        this.tokenIndex = (this.tokenIndex + 1) & 3;
        token = this.tokens[this.tokenIndex];
        if (!token)
            this.tokens[this.tokenIndex] = token = {};

        var input = this.source;
        if (this.cursor === input.length)
            return token.type = END;

        token.start = this.cursor;
        token.lineno = this.lineno;

        var ch = input[this.cursor++];
        if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || ch === '$' || ch === '_') {
            this.lexIdent(ch);
        } else if (scanOperand && ch === '/') {
            this.lexRegExp(ch);
        } else if (ch in opTokens) {
            this.lexOp(ch);
        } else if (ch === '.') {
            this.lexDot(ch);
        } else if (ch >= '1' && ch <= '9') {
            this.lexNumber(ch);
        } else if (ch === '0') {
            this.lexZeroNumber(ch);
        } else if (ch === '"' || ch === "'") {
            this.lexString(ch);
        } else if (this.scanNewlines && ch === '\n') {
            token.type = NEWLINE;
            token.value = '\n';
            this.lineno++;
        } else {
            throw this.newSyntaxError("Illegal token");
        }

        token.end = this.cursor;
        return token.type;
    },

    /*
     * Tokenizer.unget :: void -> undefined
     *
     * Match depends on unget returning undefined.
     */
    unget: function () {
        if (++this.lookahead === 4) throw "PANIC: too much lookahead!";
        this.tokenIndex = (this.tokenIndex - 1) & 3;
    },

    newSyntaxError: function (m) {
        var e = new SyntaxError(m, this.filename, this.lineno);
        e.source = this.source;
        e.lineno = this.lineno;
        e.cursor = this.lookahead
                   ? this.tokens[(this.tokenIndex + this.lookahead) & 3].start
                   : this.cursor;
        return e;
    },
};

exports.Tokenizer = Tokenizer;

});/* vim: set sw=4 ts=4 et tw=78: */
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is the Narcissus JavaScript engine.
 *
 * The Initial Developer of the Original Code is
 * Brendan Eich <brendan@mozilla.org>.
 * Portions created by the Initial Developer are Copyright (C) 2004
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Tom Austin <taustin@ucsc.edu>
 *   Brendan Eich <brendan@mozilla.org>
 *   Shu-Yu Guo <shu@rfrn.org>
 *   Dave Herman <dherman@mozilla.com>
 *   Dimitris Vardoulakis <dimvar@ccs.neu.edu>
 *   Patrick Walton <pcwalton@mozilla.com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

/*
 * Narcissus - JS implemented in JS.
 *
 * Well-known constants and lookup tables.  Many consts are generated from the
 * tokens table via eval to minimize redundancy, so consumers must be compiled
 * separately to take advantage of the simple switch-case constant propagation
 * done by SpiderMonkey.
 */

define('ace/narcissus/jsdefs', ['require', 'exports', 'module' ], function(require, exports, module) {

exports.options =  {
    version: 185,
};

(function() {
    exports.hostGlobal = this
})();

var tokens = [
    // End of source.
    "END",

    // Operators and punctuators.  Some pair-wise order matters, e.g. (+, -)
    // and (UNARY_PLUS, UNARY_MINUS).
    "\n", ";",
    ",",
    "=",
    "?", ":", "CONDITIONAL",
    "||",
    "&&",
    "|",
    "^",
    "&",
    "==", "!=", "===", "!==",
    "<", "<=", ">=", ">",
    "<<", ">>", ">>>",
    "+", "-",
    "*", "/", "%",
    "!", "~", "UNARY_PLUS", "UNARY_MINUS",
    "++", "--",
    ".",
    "[", "]",
    "{", "}",
    "(", ")",

    // Nonterminal tree node type codes.
    "SCRIPT", "BLOCK", "LABEL", "FOR_IN", "CALL", "NEW_WITH_ARGS", "INDEX",
    "ARRAY_INIT", "OBJECT_INIT", "PROPERTY_INIT", "GETTER", "SETTER",
    "GROUP", "LIST", "LET_BLOCK", "ARRAY_COMP", "GENERATOR", "COMP_TAIL",

    // Terminals.
    "IDENTIFIER", "NUMBER", "STRING", "REGEXP",

    // Keywords.
    "break",
    "case", "catch", "const", "continue",
    "debugger", "default", "delete", "do",
    "else",
    "false", "finally", "for", "function",
    "if", "in", "instanceof",
    "let",
    "new", "null",
    "return",
    "switch",
    "this", "throw", "true", "try", "typeof",
    "var", "void",
    "yield",
    "while", "with",
];

var statementStartTokens = [
    "break",
    "const", "continue",
    "debugger", "do",
    "for",
    "if",
    "return",
    "switch",
    "throw", "try",
    "var",
    "yield",
    "while", "with",
];

// Operator and punctuator mapping from token to tree node type name.
// NB: because the lexer doesn't backtrack, all token prefixes must themselves
// be valid tokens (e.g. !== is acceptable because its prefixes are the valid
// tokens != and !).
var opTypeNames = {
    '\n':   "NEWLINE",
    ';':    "SEMICOLON",
    ',':    "COMMA",
    '?':    "HOOK",
    ':':    "COLON",
    '||':   "OR",
    '&&':   "AND",
    '|':    "BITWISE_OR",
    '^':    "BITWISE_XOR",
    '&':    "BITWISE_AND",
    '===':  "STRICT_EQ",
    '==':   "EQ",
    '=':    "ASSIGN",
    '!==':  "STRICT_NE",
    '!=':   "NE",
    '<<':   "LSH",
    '<=':   "LE",
    '<':    "LT",
    '>>>':  "URSH",
    '>>':   "RSH",
    '>=':   "GE",
    '>':    "GT",
    '++':   "INCREMENT",
    '--':   "DECREMENT",
    '+':    "PLUS",
    '-':    "MINUS",
    '*':    "MUL",
    '/':    "DIV",
    '%':    "MOD",
    '!':    "NOT",
    '~':    "BITWISE_NOT",
    '.':    "DOT",
    '[':    "LEFT_BRACKET",
    ']':    "RIGHT_BRACKET",
    '{':    "LEFT_CURLY",
    '}':    "RIGHT_CURLY",
    '(':    "LEFT_PAREN",
    ')':    "RIGHT_PAREN"
};

// Hash of keyword identifier to tokens index.  NB: we must null __proto__ to
// avoid toString, etc. namespace pollution.
var keywords = {__proto__: null};

// Define const END, etc., based on the token names.  Also map name to index.
var tokenIds = {};

// Building up a string to be eval'd in different contexts.
var consts = "const ";
for (var i = 0, j = tokens.length; i < j; i++) {
    if (i > 0)
        consts += ", ";
    var t = tokens[i];
    var name;
    if (/^[a-z]/.test(t)) {
        name = t.toUpperCase();
        keywords[t] = i;
    } else {
        name = (/^\W/.test(t) ? opTypeNames[t] : t);
    }
    consts += name + " = " + i;
    tokenIds[name] = i;
    tokens[t] = i;
}
consts += ";";

var isStatementStartCode = {__proto__: null};
for (i = 0, j = statementStartTokens.length; i < j; i++)
    isStatementStartCode[keywords[statementStartTokens[i]]] = true;

// Map assignment operators to their indexes in the tokens array.
var assignOps = ['|', '^', '&', '<<', '>>', '>>>', '+', '-', '*', '/', '%'];

for (i = 0, j = assignOps.length; i < j; i++) {
    t = assignOps[i];
    assignOps[t] = tokens[t];
}

function defineGetter(obj, prop, fn, dontDelete, dontEnum) {
    Object.defineProperty(obj, prop,
                          { get: fn, configurable: !dontDelete, enumerable: !dontEnum });
}

function defineProperty(obj, prop, val, dontDelete, readOnly, dontEnum) {
    Object.defineProperty(obj, prop,
                          { value: val, writable: !readOnly, configurable: !dontDelete,
                            enumerable: !dontEnum });
}

// Returns true if fn is a native function.  (Note: SpiderMonkey specific.)
function isNativeCode(fn) {
    // Relies on the toString method to identify native code.
    return ((typeof fn) === "function") && fn.toString().match(/\[native code\]/);
}

function getPropertyDescriptor(obj, name) {
    while (obj) {
        if (({}).hasOwnProperty.call(obj, name))
            return Object.getOwnPropertyDescriptor(obj, name);
        obj = Object.getPrototypeOf(obj);
    }
}

function getOwnProperties(obj) {
    var map = {};
    for (var name in Object.getOwnPropertyNames(obj))
        map[name] = Object.getOwnPropertyDescriptor(obj, name);
    return map;
}

function makePassthruHandler(obj) {
    // Handler copied from
    // http://wiki.ecmascript.org/doku.php?id=harmony:proxies&s=proxy%20object#examplea_no-op_forwarding_proxy
    return {
        getOwnPropertyDescriptor: function(name) {
            var desc = Object.getOwnPropertyDescriptor(obj, name);

            // a trapping proxy's properties must always be configurable
            desc.configurable = true;
            return desc;
        },
        getPropertyDescriptor: function(name) {
            var desc = getPropertyDescriptor(obj, name);

            // a trapping proxy's properties must always be configurable
            desc.configurable = true;
            return desc;
        },
        getOwnPropertyNames: function() {
            return Object.getOwnPropertyNames(obj);
        },
        defineProperty: function(name, desc) {
            Object.defineProperty(obj, name, desc);
        },
        "delete": function(name) { return delete obj[name]; },
        fix: function() {
            if (Object.isFrozen(obj)) {
                return getOwnProperties(obj);
            }

            // As long as obj is not frozen, the proxy won't allow itself to be fixed.
            return undefined; // will cause a TypeError to be thrown
        },

        has: function(name) { return name in obj; },
        hasOwn: function(name) { return ({}).hasOwnProperty.call(obj, name); },
        get: function(receiver, name) { return obj[name]; },

        // bad behavior when set fails in non-strict mode
        set: function(receiver, name, val) { obj[name] = val; return true; },
        enumerate: function() {
            var result = [];
            for (name in obj) { result.push(name); };
            return result;
        },
        keys: function() { return Object.keys(obj); }
    };
}

// default function used when looking for a property in the global object
function noPropFound() { return undefined; }

var hasOwnProperty = ({}).hasOwnProperty;

function StringMap() {
    this.table = Object.create(null, {});
    this.size = 0;
}

StringMap.prototype = {
    has: function(x) { return hasOwnProperty.call(this.table, x); },
    set: function(x, v) {
        if (!hasOwnProperty.call(this.table, x))
            this.size++;
        this.table[x] = v;
    },
    get: function(x) { return this.table[x]; },
    getDef: function(x, thunk) {
        if (!hasOwnProperty.call(this.table, x)) {
            this.size++;
            this.table[x] = thunk();
        }
        return this.table[x];
    },
    forEach: function(f) {
        var table = this.table;
        for (var key in table)
            f.call(this, key, table[key]);
    },
    toString: function() { return "[object StringMap]" }
};

// non-destructive stack
function Stack(elts) {
    this.elts = elts || null;
}

Stack.prototype = {
    push: function(x) {
        return new Stack({ top: x, rest: this.elts });
    },
    top: function() {
        if (!this.elts)
            throw new Error("empty stack");
        return this.elts.top;
    },
    isEmpty: function() {
        return this.top === null;
    },
    find: function(test) {
        for (var elts = this.elts; elts; elts = elts.rest) {
            if (test(elts.top))
                return elts.top;
        }
        return null;
    },
    has: function(x) {
        return Boolean(this.find(function(elt) { return elt === x }));
    },
    forEach: function(f) {
        for (var elts = this.elts; elts; elts = elts.rest) {
            f(elts.top);
        }
    }
};

exports.tokens = tokens;
exports.opTypeNames = opTypeNames;
exports.keywords = keywords;
exports.isStatementStartCode = isStatementStartCode;
exports.tokenIds = tokenIds;
exports.consts = consts;
exports.assignOps = assignOps;
exports.defineGetter = defineGetter;
exports.defineProperty = defineProperty;
exports.isNativeCode = isNativeCode;
exports.makePassthruHandler = makePassthruHandler;
exports.noPropFound = noPropFound;
exports.StringMap = StringMap;
exports.Stack = Stack;

});