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

/**
 * Define a module along with a payload
 * @param module a name for the payload
 * @param payload a function to call with (require, exports, module) params
 */
 
(function() {
    
var _define = function(module, payload) {
    if (typeof module !== 'string') {
        if (_define.original)
            _define.original.apply(window, arguments);
        else {
            console.error('dropping module because define wasn\'t a string.');
            console.trace();
        }
        return;
    }

    if (!define.modules)
        define.modules = {};
        
    define.modules[module] = payload;
};
if (window.define)
    _define.original = window.define;
    
window.define = _define;


/**
 * Get at functionality define()ed using the function above
 */
var _require = function(module, callback) {
    if (Object.prototype.toString.call(module) === "[object Array]") {
        var params = [];
        for (var i = 0, l = module.length; i < l; ++i) {
            var dep = lookup(module[i]);
            if (!dep && _require.original)
                return _require.original.apply(window, arguments);
            params.push(dep);
        };
        if (callback) {
            callback.apply(null, params);
        }
    }

    if (typeof module === 'string') {
        var payload = lookup(module);
        if (!payload && _require.original)
            return _require.original.apply(window, arguments);
        
        if (callback) {
            callback();
        }
    
        return payload;
    };
}

if (window.require)
    _require.original = window.require;
    
window.require = _require;
require.packaged = true;

/**
 * Internal function to lookup moduleNames and resolve them by calling the
 * definition function if needed.
 */
var lookup = function(moduleName) {
    var module = define.modules[moduleName];
    if (module == null) {
        console.error('Missing module: ' + moduleName);
        return null;
    }

    if (typeof module === 'function') {
        var exports = {};
        module(require, exports, { id: moduleName, uri: '' });
        // cache the resulting module object for next time
        define.modules[moduleName] = exports;
        return exports;
    }

    return module;
};

})();/* vim:ts=4:sts=4:sw=4:
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

define('pilot/fixoldbrowsers', function(require, exports, module) {

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
              return self.apply(this instanceof nop ? this : obj, arguments);
          };
        }
        else {
          var bound = function () {
              return self.apply(
                  this instanceof nop ? this : ( obj || {} ),
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
        return this.replace(/^\s+/, "").replace(/\s+$/, "");
    }
}

if (!String.prototype.trimRight) {
    String.prototype.trimRight = function() {
        return this.replace(/\s+$/, "");
    }
}

if (!String.prototype.trimLeft) {
    String.prototype.trimRight = function() {
        return this.replace(/^\s+/, "");
    }
}

exports.globalsLoaded = true;

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
 * The Original Code is Mozilla Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Kevin Dangoor (kdangoor@mozilla.com)
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

define('pilot/index', function(require, exports, module) {

exports.startup = function(data, reason) {
    require('pilot/fixoldbrowsers');

    require('pilot/types/basic').startup(data, reason);
    require('pilot/types/command').startup(data, reason);
    require('pilot/types/settings').startup(data, reason);
    require('pilot/commands/settings').startup(data, reason);
    require('pilot/commands/basic').startup(data, reason);
    // require('pilot/commands/history').startup(data, reason);
    require('pilot/settings/canon').startup(data, reason);
    require('pilot/canon').startup(data, reason);
};

exports.shutdown = function(data, reason) {
    require('pilot/types/basic').shutdown(data, reason);
    require('pilot/types/command').shutdown(data, reason);
    require('pilot/types/settings').shutdown(data, reason);
    require('pilot/commands/settings').shutdown(data, reason);
    require('pilot/commands/basic').shutdown(data, reason);
    // require('pilot/commands/history').shutdown(data, reason);
    require('pilot/settings/canon').shutdown(data, reason);
    require('pilot/canon').shutdown(data, reason);
};


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
 * The Original Code is Mozilla Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Joe Walker (jwalker@mozilla.com)
 *      Kevin Dangoor (kdangoor@mozilla.com)
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

define('pilot/types/basic', function(require, exports, module) {

var types = require("pilot/types");
var Type = types.Type;
var Conversion = types.Conversion;
var Status = types.Status;

/**
 * These are the basic types that we accept. They are vaguely based on the
 * Jetpack settings system (https://wiki.mozilla.org/Labs/Jetpack/JEP/24)
 * although clearly more restricted.
 *
 * <p>In addition to these types, Jetpack also accepts range, member, password
 * that we are thinking of adding.
 *
 * <p>This module probably should not be accessed directly, but instead used
 * through types.js
 */

/**
 * 'text' is the default if no type is given.
 */
var text = new Type();

text.stringify = function(value) {
    return value;
};

text.parse = function(value) {
    if (typeof value != 'string') {
        throw new Error('non-string passed to text.parse()');
    }
    return new Conversion(value);
};

text.name = 'text';

/**
 * We don't currently plan to distinguish between integers and floats
 */
var number = new Type();

number.stringify = function(value) {
    if (!value) {
        return null;
    }
    return '' + value;
};

number.parse = function(value) {
    if (typeof value != 'string') {
        throw new Error('non-string passed to number.parse()');
    }

    if (value.replace(/\s/g, '').length === 0) {
        return new Conversion(null, Status.INCOMPLETE, '');
    }

    var reply = new Conversion(parseInt(value, 10));
    if (isNaN(reply.value)) {
        reply.status = Status.INVALID;
        reply.message = 'Can\'t convert "' + value + '" to a number.';
    }

    return reply;
};

number.decrement = function(value) {
    return value - 1;
};

number.increment = function(value) {
    return value + 1;
};

number.name = 'number';

/**
 * One of a known set of options
 */
function SelectionType(typeSpec) {
    if (!Array.isArray(typeSpec.data) && typeof typeSpec.data !== 'function') {
        throw new Error('instances of SelectionType need typeSpec.data to be an array or function that returns an array:' + JSON.stringify(typeSpec));
    }
    Object.keys(typeSpec).forEach(function(key) {
        this[key] = typeSpec[key];
    }, this);
};

SelectionType.prototype = new Type();

SelectionType.prototype.stringify = function(value) {
    return value;
};

SelectionType.prototype.parse = function(str) {
    if (typeof str != 'string') {
        throw new Error('non-string passed to parse()');
    }
    if (!this.data) {
        throw new Error('Missing data on selection type extension.');
    }
    var data = (typeof(this.data) === 'function') ? this.data() : this.data;

    // The matchedValue could be the boolean value false
    var hasMatched = false;
    var matchedValue;
    var completions = [];
    data.forEach(function(option) {
        if (str == option) {
            matchedValue = this.fromString(option);
            hasMatched = true;
        }
        else if (option.indexOf(str) === 0) {
            completions.push(this.fromString(option));
        }
    }, this);

    if (hasMatched) {
        return new Conversion(matchedValue);
    }
    else {
        // This is something of a hack it basically allows us to tell the
        // setting type to forget its last setting hack.
        if (this.noMatch) {
            this.noMatch();
        }

        if (completions.length > 0) {
            var msg = 'Possibilities' +
                (str.length === 0 ? '' : ' for \'' + str + '\'');
            return new Conversion(null, Status.INCOMPLETE, msg, completions);
        }
        else {
            var msg = 'Can\'t use \'' + str + '\'.';
            return new Conversion(null, Status.INVALID, msg, completions);
        }
    }
};

SelectionType.prototype.fromString = function(str) {
    return str;
};

SelectionType.prototype.decrement = function(value) {
    var data = (typeof this.data === 'function') ? this.data() : this.data;
    var index;
    if (value == null) {
        index = data.length - 1;
    }
    else {
        var name = this.stringify(value);
        var index = data.indexOf(name);
        index = (index === 0 ? data.length - 1 : index - 1);
    }
    return this.fromString(data[index]);
};

SelectionType.prototype.increment = function(value) {
    var data = (typeof this.data === 'function') ? this.data() : this.data;
    var index;
    if (value == null) {
        index = 0;
    }
    else {
        var name = this.stringify(value);
        var index = data.indexOf(name);
        index = (index === data.length - 1 ? 0 : index + 1);
    }
    return this.fromString(data[index]);
};

SelectionType.prototype.name = 'selection';

/**
 * SelectionType is a base class for other types
 */
exports.SelectionType = SelectionType;

/**
 * true/false values
 */
var bool = new SelectionType({
    name: 'bool',
    data: [ 'true', 'false' ],
    stringify: function(value) {
        return '' + value;
    },
    fromString: function(str) {
        return str === 'true' ? true : false;
    }
});


/**
 * A we don't know right now, but hope to soon.
 */
function DeferredType(typeSpec) {
    if (typeof typeSpec.defer !== 'function') {
        throw new Error('Instances of DeferredType need typeSpec.defer to be a function that returns a type');
    }
    Object.keys(typeSpec).forEach(function(key) {
        this[key] = typeSpec[key];
    }, this);
};

DeferredType.prototype = new Type();

DeferredType.prototype.stringify = function(value) {
    return this.defer().stringify(value);
};

DeferredType.prototype.parse = function(value) {
    return this.defer().parse(value);
};

DeferredType.prototype.decrement = function(value) {
    var deferred = this.defer();
    return (deferred.decrement ? deferred.decrement(value) : undefined);
};

DeferredType.prototype.increment = function(value) {
    var deferred = this.defer();
    return (deferred.increment ? deferred.increment(value) : undefined);
};

DeferredType.prototype.name = 'deferred';

/**
 * DeferredType is a base class for other types
 */
exports.DeferredType = DeferredType;


/**
 * A set of objects of the same type
 */
function ArrayType(typeSpec) {
    if (typeSpec instanceof Type) {
        this.subtype = typeSpec;
    }
    else if (typeof typeSpec === 'string') {
        this.subtype = types.getType(typeSpec);
        if (this.subtype == null) {
            throw new Error('Unknown array subtype: ' + typeSpec);
        }
    }
    else {
        throw new Error('Can\' handle array subtype');
    }
};

ArrayType.prototype = new Type();

ArrayType.prototype.stringify = function(values) {
    // TODO: Check for strings with spaces and add quotes
    return values.join(' ');
};

ArrayType.prototype.parse = function(value) {
    return this.defer().parse(value);
};

ArrayType.prototype.name = 'array';

/**
 * Registration and de-registration.
 */
exports.startup = function() {
    types.registerType(text);
    types.registerType(number);
    types.registerType(bool);
    types.registerType(SelectionType);
    types.registerType(DeferredType);
    types.registerType(ArrayType);
};

exports.shutdown = function() {
    types.unregisterType(text);
    types.unregisterType(number);
    types.unregisterType(bool);
    types.unregisterType(SelectionType);
    types.unregisterType(DeferredType);
    types.unregisterType(ArrayType);
};


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
 * The Original Code is Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Joe Walker (jwalker@mozilla.com)
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

define('pilot/types', function(require, exports, module) {

/**
 * Some types can detect validity, that is to say they can distinguish between
 * valid and invalid values.
 * TODO: Change these constants to be numbers for more performance?
 */
var Status = {
    /**
     * The conversion process worked without any problem, and the value is
     * valid. There are a number of failure states, so the best way to check
     * for failure is (x !== Status.VALID)
     */
    VALID: {
        toString: function() { return 'VALID'; },
        valueOf: function() { return 0; }
    },

    /**
     * A conversion process failed, however it was noted that the string
     * provided to 'parse()' could be VALID by the addition of more characters,
     * so the typing may not be actually incorrect yet, just unfinished.
     * @see Status.INVALID
     */
    INCOMPLETE: {
        toString: function() { return 'INCOMPLETE'; },
        valueOf: function() { return 1; }
    },

    /**
     * The conversion process did not work, the value should be null and a
     * reason for failure should have been provided. In addition some completion
     * values may be available.
     * @see Status.INCOMPLETE
     */
    INVALID: {
        toString: function() { return 'INVALID'; },
        valueOf: function() { return 2; }
    },

    /**
     * A combined status is the worser of the provided statuses
     */
    combine: function(statuses) {
        var combined = Status.VALID;
        for (var i = 0; i < arguments; i++) {
            if (arguments[i] > combined) {
                combined = arguments[i];
            }
        }
        return combined;
    }
};
exports.Status = Status;

/**
 * The type.parse() method returns a Conversion to inform the user about not
 * only the result of a Conversion but also about what went wrong.
 * We could use an exception, and throw if the conversion failed, but that
 * seems to violate the idea that exceptions should be exceptional. Typos are
 * not. Also in order to store both a status and a message we'd still need
 * some sort of exception type...
 */
function Conversion(value, status, message, predictions) {
    /**
     * The result of the conversion process. Will be null if status != VALID
     */
    this.value = value;

    /**
     * The status of the conversion.
     * @see Status
     */
    this.status = status || Status.VALID;

    /**
     * A message to go with the conversion. This could be present for any status
     * including VALID in the case where we want to note a warning for example.
     * I18N: On the one hand this nasty and un-internationalized, however with
     * a command line it is hard to know where to start.
     */
    this.message = message;

    /**
     * A array of strings which are the systems best guess at better inputs than
     * the one presented.
     * We generally expect there to be about 7 predictions (to match human list
     * comprehension ability) however it is valid to provide up to about 20,
     * or less. It is the job of the predictor to decide a smart cut-off.
     * For example if there are 4 very good matches and 4 very poor ones,
     * probably only the 4 very good matches should be presented.
     */
    this.predictions = predictions || [];
}
exports.Conversion = Conversion;

/**
 * Most of our types are 'static' e.g. there is only one type of 'text', however
 * some types like 'selection' and 'deferred' are customizable. The basic
 * Type type isn't useful, but does provide documentation about what types do.
 */
function Type() {
};
Type.prototype = {
    /**
     * Convert the given <tt>value</tt> to a string representation.
     * Where possible, there should be round-tripping between values and their
     * string representations.
     */
    stringify: function(value) { throw new Error("not implemented"); },

    /**
     * Convert the given <tt>str</tt> to an instance of this type.
     * Where possible, there should be round-tripping between values and their
     * string representations.
     * @return Conversion
     */
    parse: function(str) { throw new Error("not implemented"); },

    /**
     * The plug-in system, and other things need to know what this type is
     * called. The name alone is not enough to fully specify a type. Types like
     * 'selection' and 'deferred' need extra data, however this function returns
     * only the name, not the extra data.
     * <p>In old bespin, equality was based on the name. This may turn out to be
     * important in Ace too.
     */
    name: undefined,

    /**
     * If there is some concept of a higher value, return it,
     * otherwise return undefined.
     */
    increment: function(value) {
        return undefined;
    },

    /**
     * If there is some concept of a lower value, return it,
     * otherwise return undefined.
     */
    decrement: function(value) {
        return undefined;
    },

    /**
     * There is interesting information (like predictions) in a conversion of
     * nothing, the output of this can sometimes be customized.
     * @return Conversion
     */
    getDefault: function() {
        return this.parse('');
    }
};
exports.Type = Type;

/**
 * Private registry of types
 * Invariant: types[name] = type.name
 */
var types = {};

/**
 * Add a new type to the list available to the system.
 * You can pass 2 things to this function - either an instance of Type, in
 * which case we return this instance when #getType() is called with a 'name'
 * that matches type.name.
 * Also you can pass in a constructor (i.e. function) in which case when
 * #getType() is called with a 'name' that matches Type.prototype.name we will
 * pass the typeSpec into this constructor. See #reconstituteType().
 */
exports.registerType = function(type) {
    if (typeof type === 'object') {
        if (type instanceof Type) {
            if (!type.name) {
                throw new Error('All registered types must have a name');
            }
            types[type.name] = type;
        }
        else {
            throw new Error('Can\'t registerType using: ' + type);
        }
    }
    else if (typeof type === 'function') {
        if (!type.prototype.name) {
            throw new Error('All registered types must have a name');
        }
        types[type.prototype.name] = type;
    }
    else {
        throw new Error('Unknown type: ' + type);
    }
};

exports.registerTypes = function registerTypes(types) {
    Object.keys(types).forEach(function (name) {
        var type = types[name];
        type.name = name;
        exports.registerType(type);
    });
};

/**
 * Remove a type from the list available to the system
 */
exports.deregisterType = function(type) {
    delete types[type.name];
};

/**
 * See description of #exports.registerType()
 */
function reconstituteType(name, typeSpec) {
    if (name.substr(-2) === '[]') { // i.e. endsWith('[]')
        var subtypeName = name.slice(0, -2);
        return new types['array'](subtypeName);
    }

    var type = types[name];
    if (typeof type === 'function') {
        type = new type(typeSpec);
    }
    return type;
}

/**
 * Find a type, previously registered using #registerType()
 */
exports.getType = function(typeSpec) {
    if (typeof typeSpec === 'string') {
        return reconstituteType(typeSpec);
    }

    if (typeof typeSpec === 'object') {
        if (!typeSpec.name) {
            throw new Error('Missing \'name\' member to typeSpec');
        }
        return reconstituteType(typeSpec.name, typeSpec);
    }

    throw new Error('Can\'t extract type from ' + typeSpec);
};


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
 * The Original Code is Mozilla Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Joe Walker (jwalker@mozilla.com)
 *      Kevin Dangoor (kdangoor@mozilla.com)
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

define('pilot/types/command', function(require, exports, module) {

var canon = require("pilot/canon");
var SelectionType = require("pilot/types/basic").SelectionType;
var types = require("pilot/types");


/**
 * Select from the available commands
 */
var command = new SelectionType({
    name: 'command',
    data: function() {
        return canon.getCommandNames();
    },
    stringify: function(command) {
        return command.name;
    },
    fromString: function(str) {
        return canon.getCommand(str);
    }
});


/**
 * Registration and de-registration.
 */
exports.startup = function() {
    types.registerType(command);
};

exports.shutdown = function() {
    types.unregisterType(command);
};


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
 * The Original Code is Mozilla Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Joe Walker (jwalker@mozilla.com)
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

define('pilot/canon', function(require, exports, module) {

var console = require('pilot/console');
var Trace = require('pilot/stacktrace').Trace;
var oop = require('pilot/oop');
var EventEmitter = require('pilot/event_emitter').EventEmitter;
var catalog = require('pilot/catalog');
var Status = require('pilot/types').Status;
var types = require('pilot/types');
var lang = require('pilot/lang');

/*
// TODO: this doesn't belong here - or maybe anywhere?
var dimensionsChangedExtensionSpec = {
    name: 'dimensionsChanged',
    description: 'A dimensionsChanged is a way to be notified of ' +
            'changes to the dimension of Skywriter'
};
exports.startup = function(data, reason) {
    catalog.addExtensionSpec(commandExtensionSpec);
};
exports.shutdown = function(data, reason) {
    catalog.removeExtensionSpec(commandExtensionSpec);
};
*/

var commandExtensionSpec = {
    name: 'command',
    description: 'A command is a bit of functionality with optional ' +
            'typed arguments which can do something small like moving ' +
            'the cursor around the screen, or large like cloning a ' +
            'project from VCS.',
    indexOn: 'name'
};

exports.startup = function(data, reason) {
    // TODO: this is probably all kinds of evil, but we need something working
    catalog.addExtensionSpec(commandExtensionSpec);
};

exports.shutdown = function(data, reason) {
    catalog.removeExtensionSpec(commandExtensionSpec);
};

/**
 * Manage a list of commands in the current canon
 */

/**
 * A Command is a discrete action optionally with a set of ways to customize
 * how it happens. This is here for documentation purposes.
 * TODO: Document better
 */
var thingCommand = {
    name: 'thing',
    description: 'thing is an example command',
    params: [{
        name: 'param1',
        description: 'an example parameter',
        type: 'text',
        defaultValue: null
    }],
    exec: function(env, args, request) {
        thing();
    }
};

/**
 * A lookup hash of our registered commands
 */
var commands = {};

/**
 * A sorted list of command names, we regularly want them in order, so pre-sort
 */
var commandNames = [];

/**
 * This registration method isn't like other Ace registration methods because
 * it doesn't return a decorated command because there is no functional
 * decoration to be done.
 * TODO: Are we sure that in the future there will be no such decoration?
 */
function addCommand(command) {
    if (!command.name) {
        throw new Error('All registered commands must have a name');
    }
    if (command.params == null) {
        command.params = [];
    }
    if (!Array.isArray(command.params)) {
        throw new Error('command.params must be an array in ' + command.name);
    }
    // Replace the type
    command.params.forEach(function(param) {
        if (!param.name) {
            throw new Error('In ' + command.name + ': all params must have a name');
        }
        upgradeType(command.name, param);
    }, this);
    commands[command.name] = command;

    commandNames.push(command.name);
    commandNames.sort();
};

function upgradeType(name, param) {
    var lookup = param.type;
    param.type = types.getType(lookup);
    if (param.type == null) {
        throw new Error('In ' + name + '/' + param.name +
            ': can\'t find type for: ' + JSON.stringify(lookup));
    }
}

function removeCommand(command) {
    var name = (typeof command === 'string' ? command : command.name);
    delete commands[name];
    lang.arrayRemove(commandNames, name);
};

function getCommand(name) {
    return commands[name];
};

function getCommandNames() {
    return commandNames;
};

/**
 * Entry point for keyboard accelerators or anything else that knows
 * everything it needs to about the command params
 * @param command Either a command, or the name of one
 */
function exec(command, env, args, typed) {
    if (typeof command === 'string') {
        command = commands[command];
    }
    if (!command) {
        // TODO: Should we complain more than returning false?
        return false;
    }

    var request = new Request({
        command: command,
        args: args,
        typed: typed
    });
    command.exec(env, args || {}, request);
    return true;
};

exports.removeCommand = removeCommand;
exports.addCommand = addCommand;
exports.getCommand = getCommand;
exports.getCommandNames = getCommandNames;
exports.exec = exec;
exports.upgradeType = upgradeType;


/**
 * We publish a 'output' event whenever new command begins output
 * TODO: make this more obvious
 */
oop.implement(exports, EventEmitter);


/**
 * Current requirements are around displaying the command line, and provision
 * of a 'history' command and cursor up|down navigation of history.
 * <p>Future requirements could include:
 * <ul>
 * <li>Multiple command lines
 * <li>The ability to recall key presses (i.e. requests with no output) which
 * will likely be needed for macro recording or similar
 * <li>The ability to store the command history either on the server or in the
 * browser local storage.
 * </ul>
 * <p>The execute() command doesn't really live here, except as part of that
 * last future requirement, and because it doesn't really have anywhere else to
 * live.
 */

/**
 * The array of requests that wish to announce their presence
 */
var requests = [];

/**
 * How many requests do we store?
 */
var maxRequestLength = 100;

/**
 * To create an invocation, you need to do something like this (all the ctor
 * args are optional):
 * <pre>
 * var request = new Request({
 *     command: command,
 *     args: args,
 *     typed: typed
 * });
 * </pre>
 * @constructor
 */
function Request(options) {
    options = options || {};

    // Will be used in the keyboard case and the cli case
    this.command = options.command;

    // Will be used only in the cli case
    this.args = options.args;
    this.typed = options.typed;

    // Have we been initialized?
    this._begunOutput = false;

    this.start = new Date();
    this.end = null;
    this.completed = false;
    this.error = false;
};

oop.implement(Request.prototype, EventEmitter);

/**
 * Lazy init to register with the history should only be done on output.
 * init() is expensive, and won't be used in the majority of cases
 */
Request.prototype._beginOutput = function() {
    this._begunOutput = true;
    this.outputs = [];

    requests.push(this);
    // This could probably be optimized with some maths, but 99.99% of the
    // time we will only be off by one, and I'm feeling lazy.
    while (requests.length > maxRequestLength) {
        requests.shiftObject();
    }

    exports._dispatchEvent('output', { requests: requests, request: this });
};

/**
 * Sugar for:
 * <pre>request.error = true; request.done(output);</pre>
 */
Request.prototype.doneWithError = function(content) {
    this.error = true;
    this.done(content);
};

/**
 * Declares that this function will not be automatically done when
 * the command exits
 */
Request.prototype.async = function() {
    if (!this._begunOutput) {
        this._beginOutput();
    }
};

/**
 * Complete the currently executing command with successful output.
 * @param output Either DOM node, an SproutCore element or something that
 * can be used in the content of a DIV to create a DOM node.
 */
Request.prototype.output = function(content) {
    if (!this._begunOutput) {
        this._beginOutput();
    }

    if (typeof content !== 'string' && !(content instanceof Node)) {
        content = content.toString();
    }

    this.outputs.push(content);
    this._dispatchEvent('output', {});

    return this;
};

/**
 * All commands that do output must call this to indicate that the command
 * has finished execution.
 */
Request.prototype.done = function(content) {
    this.completed = true;
    this.end = new Date();
    this.duration = this.end.getTime() - this.start.getTime();

    if (content) {
        this.output(content);
    }

    this._dispatchEvent('output', {});
};
exports.Request = Request;


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
 * The Original Code is Mozilla Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Joe Walker (jwalker@mozilla.com)
 *   Patrick Walton (pwalton@mozilla.com)
 *   Julian Viereck (jviereck@mozilla.com)
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
define('pilot/console', function(require, exports, module) {
    
/**
 * This object represents a "safe console" object that forwards debugging
 * messages appropriately without creating a dependency on Firebug in Firefox.
 */

var noop = function() {};

// These are the functions that are available in Chrome 4/5, Safari 4
// and Firefox 3.6. Don't add to this list without checking browser support
var NAMES = [
    "assert", "count", "debug", "dir", "dirxml", "error", "group", "groupEnd",
    "info", "log", "profile", "profileEnd", "time", "timeEnd", "trace", "warn"
];

if (typeof(window) === 'undefined') {
    // We're in a web worker. Forward to the main thread so the messages
    // will show up.
    NAMES.forEach(function(name) {
        exports[name] = function() {
            var args = Array.prototype.slice.call(arguments);
            var msg = { op: 'log', method: name, args: args };
            postMessage(JSON.stringify(msg));
        };
    });
} else {
    // For each of the console functions, copy them if they exist, stub if not
    NAMES.forEach(function(name) {
        if (window.console && window.console[name]) {
            exports[name] = Function.prototype.bind.call(window.console[name], window.console);
        } else {
            exports[name] = noop;
        }
    });
}

});
define('pilot/stacktrace', function(require, exports, module) {
    
var ua = require("pilot/useragent");
var console = require('pilot/console');

// Changed to suit the specific needs of running within Skywriter

// Domain Public by Eric Wendelin http://eriwen.com/ (2008)
//                  Luke Smith http://lucassmith.name/ (2008)
//                  Loic Dachary <loic@dachary.org> (2008)
//                  Johan Euphrosine <proppy@aminche.com> (2008)
//                  Øyvind Sean Kinsey http://kinsey.no/blog
//
// Information and discussions
// http://jspoker.pokersource.info/skin/test-printstacktrace.html
// http://eriwen.com/javascript/js-stack-trace/
// http://eriwen.com/javascript/stacktrace-update/
// http://pastie.org/253058
// http://browsershots.org/http://jspoker.pokersource.info/skin/test-printstacktrace.html
//

//
// guessFunctionNameFromLines comes from firebug
//
// Software License Agreement (BSD License)
//
// Copyright (c) 2007, Parakey Inc.
// All rights reserved.
//
// Redistribution and use of this software in source and binary forms, with or without modification,
// are permitted provided that the following conditions are met:
//
// * Redistributions of source code must retain the above
//   copyright notice, this list of conditions and the
//   following disclaimer.
//
// * Redistributions in binary form must reproduce the above
//   copyright notice, this list of conditions and the
//   following disclaimer in the documentation and/or other
//   materials provided with the distribution.
//
// * Neither the name of Parakey Inc. nor the names of its
//   contributors may be used to endorse or promote products
//   derived from this software without specific prior
//   written permission of Parakey Inc.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR
// IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
// FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
// CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
// DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
// IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT
// OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.



/**
 * Different browsers create stack traces in different ways.
 * <strike>Feature</strike> Browser detection baby ;).
 */
var mode = (function() {

    // We use SC's browser detection here to avoid the "break on error"
    // functionality provided by Firebug. Firebug tries to do the right
    // thing here and break, but it happens every time you load the page.
    // bug 554105
    if (ua.isGecko) {
        return 'firefox';
    } else if (ua.isOpera) {
        return 'opera';
    } else {
        return 'other';
    }

    // SC doesn't do any detection of Chrome at this time.

    // this is the original feature detection code that is used as a
    // fallback.
    try {
        (0)();
    } catch (e) {
        if (e.arguments) {
            return 'chrome';
        }
        if (e.stack) {
            return 'firefox';
        }
        if (window.opera && !('stacktrace' in e)) { //Opera 9-
            return 'opera';
        }
    }
    return 'other';
})();

/**
 *
 */
function stringifyArguments(args) {
    for (var i = 0; i < args.length; ++i) {
        var argument = args[i];
        if (typeof argument == 'object') {
            args[i] = '#object';
        } else if (typeof argument == 'function') {
            args[i] = '#function';
        } else if (typeof argument == 'string') {
            args[i] = '"' + argument + '"';
        }
    }
    return args.join(',');
}

/**
 * Extract a stack trace from the format emitted by each browser.
 */
var decoders = {
    chrome: function(e) {
        var stack = e.stack;
        if (!stack) {
            console.log(e);
            return [];
        }
        return stack.replace(/^.*?\n/, '').
                replace(/^.*?\n/, '').
                replace(/^.*?\n/, '').
                replace(/^[^\(]+?[\n$]/gm, '').
                replace(/^\s+at\s+/gm, '').
                replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@').
                split('\n');
    },

    firefox: function(e) {
        var stack = e.stack;
        if (!stack) {
            console.log(e);
            return [];
        }
        // stack = stack.replace(/^.*?\n/, '');
        stack = stack.replace(/(?:\n@:0)?\s+$/m, '');
        stack = stack.replace(/^\(/gm, '{anonymous}(');
        return stack.split('\n');
    },

    // Opera 7.x and 8.x only!
    opera: function(e) {
        var lines = e.message.split('\n'), ANON = '{anonymous}',
            lineRE = /Line\s+(\d+).*?script\s+(http\S+)(?:.*?in\s+function\s+(\S+))?/i, i, j, len;

        for (i = 4, j = 0, len = lines.length; i < len; i += 2) {
            if (lineRE.test(lines[i])) {
                lines[j++] = (RegExp.$3 ? RegExp.$3 + '()@' + RegExp.$2 + RegExp.$1 : ANON + '()@' + RegExp.$2 + ':' + RegExp.$1) +
                ' -- ' +
                lines[i + 1].replace(/^\s+/, '');
            }
        }

        lines.splice(j, lines.length - j);
        return lines;
    },

    // Safari, Opera 9+, IE, and others
    other: function(curr) {
        var ANON = '{anonymous}', fnRE = /function\s*([\w\-$]+)?\s*\(/i, stack = [], j = 0, fn, args;

        var maxStackSize = 10;
        while (curr && stack.length < maxStackSize) {
            fn = fnRE.test(curr.toString()) ? RegExp.$1 || ANON : ANON;
            args = Array.prototype.slice.call(curr['arguments']);
            stack[j++] = fn + '(' + stringifyArguments(args) + ')';

            //Opera bug: if curr.caller does not exist, Opera returns curr (WTF)
            if (curr === curr.caller && window.opera) {
                //TODO: check for same arguments if possible
                break;
            }
            curr = curr.caller;
        }
        return stack;
    }
};

/**
 *
 */
function NameGuesser() {
}

NameGuesser.prototype = {

    sourceCache: {},

    ajax: function(url) {
        var req = this.createXMLHTTPObject();
        if (!req) {
            return;
        }
        req.open('GET', url, false);
        req.setRequestHeader('User-Agent', 'XMLHTTP/1.0');
        req.send('');
        return req.responseText;
    },

    createXMLHTTPObject: function() {
	    // Try XHR methods in order and store XHR factory
        var xmlhttp, XMLHttpFactories = [
            function() {
                return new XMLHttpRequest();
            }, function() {
                return new ActiveXObject('Msxml2.XMLHTTP');
            }, function() {
                return new ActiveXObject('Msxml3.XMLHTTP');
            }, function() {
                return new ActiveXObject('Microsoft.XMLHTTP');
            }
        ];
        for (var i = 0; i < XMLHttpFactories.length; i++) {
            try {
                xmlhttp = XMLHttpFactories[i]();
                // Use memoization to cache the factory
                this.createXMLHTTPObject = XMLHttpFactories[i];
                return xmlhttp;
            } catch (e) {}
        }
    },

    getSource: function(url) {
        if (!(url in this.sourceCache)) {
            this.sourceCache[url] = this.ajax(url).split('\n');
        }
        return this.sourceCache[url];
    },

    guessFunctions: function(stack) {
        for (var i = 0; i < stack.length; ++i) {
            var reStack = /{anonymous}\(.*\)@(\w+:\/\/([-\w\.]+)+(:\d+)?[^:]+):(\d+):?(\d+)?/;
            var frame = stack[i], m = reStack.exec(frame);
            if (m) {
                var file = m[1], lineno = m[4]; //m[7] is character position in Chrome
                if (file && lineno) {
                    var functionName = this.guessFunctionName(file, lineno);
                    stack[i] = frame.replace('{anonymous}', functionName);
                }
            }
        }
        return stack;
    },

    guessFunctionName: function(url, lineNo) {
        try {
            return this.guessFunctionNameFromLines(lineNo, this.getSource(url));
        } catch (e) {
            return 'getSource failed with url: ' + url + ', exception: ' + e.toString();
        }
    },

    guessFunctionNameFromLines: function(lineNo, source) {
        var reFunctionArgNames = /function ([^(]*)\(([^)]*)\)/;
        var reGuessFunction = /['"]?([0-9A-Za-z_]+)['"]?\s*[:=]\s*(function|eval|new Function)/;
        // Walk backwards from the first line in the function until we find the line which
        // matches the pattern above, which is the function definition
        var line = '', maxLines = 10;
        for (var i = 0; i < maxLines; ++i) {
            line = source[lineNo - i] + line;
            if (line !== undefined) {
                var m = reGuessFunction.exec(line);
                if (m) {
                    return m[1];
                }
                else {
                    m = reFunctionArgNames.exec(line);
                }
                if (m && m[1]) {
                    return m[1];
                }
            }
        }
        return '(?)';
    }
};

var guesser = new NameGuesser();

var frameIgnorePatterns = [
    /http:\/\/localhost:4020\/sproutcore.js:/
];

exports.ignoreFramesMatching = function(regex) {
    frameIgnorePatterns.push(regex);
};

/**
 * Create a stack trace from an exception
 * @param ex {Error} The error to create a stacktrace from (optional)
 * @param guess {Boolean} If we should try to resolve the names of anonymous functions
 */
exports.Trace = function Trace(ex, guess) {
    this._ex = ex;
    this._stack = decoders[mode](ex);

    if (guess) {
        this._stack = guesser.guessFunctions(this._stack);
    }
};

/**
 * Log to the console a number of lines (default all of them)
 * @param lines {number} Maximum number of lines to wrote to console
 */
exports.Trace.prototype.log = function(lines) {
    if (lines <= 0) {
        // You aren't going to have more lines in your stack trace than this
        // and it still fits in a 32bit integer
        lines = 999999999;
    }

    var printed = 0;
    for (var i = 0; i < this._stack.length && printed < lines; i++) {
        var frame = this._stack[i];
        var display = true;
        frameIgnorePatterns.forEach(function(regex) {
            if (regex.test(frame)) {
                display = false;
            }
        });
        if (display) {
            console.debug(frame);
            printed++;
        }
    }
};

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

define('pilot/useragent', function(require, exports, module) {

var os = (navigator.platform.match(/mac|win|linux/i) || ["other"])[0].toLowerCase();
var ua = navigator.userAgent;
var av = navigator.appVersion;

/** Is the user using a browser that identifies itself as Windows */
exports.isWin = (os == "win");

/** Is the user using a browser that identifies itself as Mac OS */
exports.isMac = (os == "mac");

/** Is the user using a browser that identifies itself as Linux */
exports.isLinux = (os == "linux");

exports.isIE = ! + "\v1";

/** Is this Firefox or related? */
exports.isGecko = exports.isMozilla = window.controllers && window.navigator.product === "Gecko";

/** oldGecko == rev < 2.0 **/
exports.isOldGecko = exports.isGecko && /rv\:1/.test(navigator.userAgent);

/** Is this Opera */
exports.isOpera = window.opera && Object.prototype.toString.call(window.opera) == "[object Opera]";

/** Is the user using a browser that identifies itself as WebKit */
exports.isWebKit = parseFloat(ua.split("WebKit/")[1]) || undefined;

exports.isAIR = ua.indexOf("AdobeAIR") >= 0;

exports.isIPad = ua.indexOf("iPad") >= 0;

/**
 * I hate doing this, but we need some way to determine if the user is on a Mac
 * The reason is that users have different expectations of their key combinations.
 *
 * Take copy as an example, Mac people expect to use CMD or APPLE + C
 * Windows folks expect to use CTRL + C
 */
exports.OS = {
    LINUX: 'LINUX',
    MAC: 'MAC',
    WINDOWS: 'WINDOWS'
};

/**
 * Return an exports.OS constant
 */
exports.getOS = function() {
    if (exports.isMac) {
        return exports.OS['MAC'];
    } else if (exports.isLinux) {
        return exports.OS['LINUX'];
    } else {
        return exports.OS['WINDOWS'];
    }
};

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

define('pilot/oop', function(require, exports, module) {

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

define('pilot/event_emitter', function(require, exports, module) {

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
 * The Original Code is Mozilla Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Julian Viereck (jviereck@mozilla.com)
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

define('pilot/catalog', function(require, exports, module) {


var extensionSpecs = {};

exports.addExtensionSpec = function(extensionSpec) {
    extensionSpecs[extensionSpec.name] = extensionSpec;
};

exports.removeExtensionSpec = function(extensionSpec) {
    if (typeof extensionSpec === "string") {
        delete extensionSpecs[extensionSpec];
    }
    else {
        delete extensionSpecs[extensionSpec.name];
    }
};

exports.getExtensionSpec = function(name) {
    return extensionSpecs[name];
};

exports.getExtensionSpecs = function() {
    return Object.keys(extensionSpecs);
};


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

define('pilot/lang', function(require, exports, module) {

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
 * The Original Code is Mozilla Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Joe Walker (jwalker@mozilla.com)
 *      Kevin Dangoor (kdangoor@mozilla.com)
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

define('pilot/types/settings', function(require, exports, module) {

var SelectionType = require('pilot/types/basic').SelectionType;
var DeferredType = require('pilot/types/basic').DeferredType;
var types = require('pilot/types');
var settings = require('pilot/settings').settings;


/**
 * EVIL: This relies on us using settingValue in the same event as setting
 * The alternative is to have some central place where we store the current
 * command line, but this might be a lesser evil for now.
 */
var lastSetting;

/**
 * Select from the available settings
 */
var setting = new SelectionType({
    name: 'setting',
    data: function() {
        return env.settings.getSettingNames();
    },
    stringify: function(setting) {
        lastSetting = setting;
        return setting.name;
    },
    fromString: function(str) {
        lastSetting = settings.getSetting(str);
        return lastSetting;
    },
    noMatch: function() {
        lastSetting = null;
    }
});

/**
 * Something of a hack to allow the set command to give a clearer definition
 * of the type to the command line.
 */
var settingValue = new DeferredType({
    name: 'settingValue',
    defer: function() {
        if (lastSetting) {
            return lastSetting.type;
        }
        else {
            return types.getType('text');
        }
    },
    /**
     * Promote the current value in any list of predictions, and add it if
     * there are none.
     */
    getDefault: function() {
        var conversion = this.parse('');
        if (lastSetting) {
            var current = lastSetting.get();
            if (conversion.predictions.length === 0) {
                conversion.predictions.push(current);
            }
            else {
                // Remove current from predictions
                var removed = false;
                while (true) {
                    var index = conversion.predictions.indexOf(current);
                    if (index === -1) {
                        break;
                    }
                    conversion.predictions.splice(index, 1);
                    removed = true;
                }
                // If the current value wasn't something we would predict, leave it
                if (removed) {
                    conversion.predictions.push(current);
                }
            }
        }
        return conversion;
    }
});

var env;

/**
 * Registration and de-registration.
 */
exports.startup = function(data, reason) {
    // TODO: this is probably all kinds of evil, but we need something working
    env = data.env;
    types.registerType(setting);
    types.registerType(settingValue);
};

exports.shutdown = function(data, reason) {
    types.unregisterType(setting);
    types.unregisterType(settingValue);
};


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
 * The Original Code is Mozilla Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Joe Walker (jwalker@mozilla.com)
 *   Julian Viereck (jviereck@mozilla.com)
 *   Kevin Dangoor (kdangoor@mozilla.com)
 *   Irakli Gozalishvili <rfobic@gmail.com> (http://jeditoolkit.com)
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

define('pilot/settings', function(require, exports, module) {

/**
 * This plug-in manages settings.
 */

var console = require('pilot/console');
var oop = require('pilot/oop');
var types = require('pilot/types');
var EventEmitter = require('pilot/event_emitter').EventEmitter;
var catalog = require('pilot/catalog');

var settingExtensionSpec = {
    name: 'setting',
    description: 'A setting is something that the application offers as a ' +
            'way to customize how it works',
    register: 'env.settings.addSetting',
    indexOn: 'name'
};

exports.startup = function(data, reason) {
    catalog.addExtensionSpec(settingExtensionSpec);
};

exports.shutdown = function(data, reason) {
    catalog.removeExtensionSpec(settingExtensionSpec);
};


/**
 * Create a new setting.
 * @param settingSpec An object literal that looks like this:
 * {
 *   name: 'thing',
 *   description: 'Thing is an example setting',
 *   type: 'string',
 *   defaultValue: 'something'
 * }
 */
function Setting(settingSpec, settings) {
    this._settings = settings;

    Object.keys(settingSpec).forEach(function(key) {
        this[key] = settingSpec[key];
    }, this);

    this.type = types.getType(this.type);
    if (this.type == null) {
        throw new Error('In ' + this.name +
            ': can\'t find type for: ' + JSON.stringify(settingSpec.type));
    }

    if (!this.name) {
        throw new Error('Setting.name == undefined. Ignoring.', this);
    }

    if (!this.defaultValue === undefined) {
        throw new Error('Setting.defaultValue == undefined', this);
    }

    if (this.onChange) {
        this.on('change', this.onChange.bind(this))
    }

    this.set(this.defaultValue);
}
Setting.prototype = {
    get: function() {
        return this.value;
    },

    set: function(value) {
        if (this.value === value) {
            return;
        }

        this.value = value;
        if (this._settings.persister) {
            this._settings.persister.persistValue(this._settings, this.name, value);
        }

        this._dispatchEvent('change', { setting: this, value: value });
    },

    /**
     * Reset the value of the <code>key</code> setting to it's default
     */
    resetValue: function() {
        this.set(this.defaultValue);
    }
};
oop.implement(Setting.prototype, EventEmitter);


/**
 * A base class for all the various methods of storing settings.
 * <p>Usage:
 * <pre>
 * // Create manually, or require 'settings' from the container.
 * // This is the manual version:
 * var settings = plugins.catalog.getObject('settings');
 * // Add a new setting
 * settings.addSetting({ name:'foo', ... });
 * // Display the default value
 * alert(settings.get('foo'));
 * // Alter the value, which also publishes the change etc.
 * settings.set('foo', 'bar');
 * // Reset the value to the default
 * settings.resetValue('foo');
 * </pre>
 * @constructor
 */
function Settings(persister) {
    // Storage for deactivated values
    this._deactivated = {};

    // Storage for the active settings
    this._settings = {};
    // We often want sorted setting names. Cache
    this._settingNames = [];

    if (persister) {
        this.setPersister(persister);
    }
};

Settings.prototype = {
    /**
     * Function to add to the list of available settings.
     * <p>Example usage:
     * <pre>
     * var settings = plugins.catalog.getObject('settings');
     * settings.addSetting({
     *     name: 'tabsize', // For use in settings.get('X')
     *     type: 'number',  // To allow value checking.
     *     defaultValue: 4  // Default value for use when none is directly set
     * });
     * </pre>
     * @param {object} settingSpec Object containing name/type/defaultValue members.
     */
    addSetting: function(settingSpec) {
        var setting = new Setting(settingSpec, this);
        this._settings[setting.name] = setting;
        this._settingNames.push(setting.name);
        this._settingNames.sort();
    },

    addSettings: function addSettings(settings) {
        Object.keys(settings).forEach(function (name) {
            var setting = settings[name];
            if (!('name' in setting)) setting.name = name;
            this.addSetting(setting);
        }, this);
    },

    removeSetting: function(setting) {
        var name = (typeof setting === 'string' ? setting : setting.name);
        setting = this._settings[name];
        delete this._settings[name];
        util.arrayRemove(this._settingNames, name);
        settings.removeAllListeners('change');
    },

    removeSettings: function removeSettings(settings) {
        Object.keys(settings).forEach(function(name) {
            var setting = settings[name];
            if (!('name' in setting)) setting.name = name;
            this.removeSettings(setting);
        }, this);
    },

    getSettingNames: function() {
        return this._settingNames;
    },

    getSetting: function(name) {
        return this._settings[name];
    },

    /**
     * A Persister is able to store settings. It is an object that defines
     * two functions:
     * loadInitialValues(settings) and persistValue(settings, key, value).
     */
    setPersister: function(persister) {
        this._persister = persister;
        if (persister) {
            persister.loadInitialValues(this);
        }
    },

    resetAll: function() {
        this.getSettingNames().forEach(function(key) {
            this.resetValue(key);
        }, this);
    },

    /**
     * Retrieve a list of the known settings and their values
     */
    _list: function() {
        var reply = [];
        this.getSettingNames().forEach(function(setting) {
            reply.push({
                'key': setting,
                'value': this.getSetting(setting).get()
            });
        }, this);
        return reply;
    },

    /**
     * Prime the local cache with the defaults.
     */
    _loadDefaultValues: function() {
        this._loadFromObject(this._getDefaultValues());
    },

    /**
     * Utility to load settings from an object
     */
    _loadFromObject: function(data) {
        // We iterate over data rather than keys so we don't forget values
        // which don't have a setting yet.
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var setting = this._settings[key];
                if (setting) {
                    var value = setting.type.parse(data[key]);
                    this.set(key, value);
                } else {
                    this.set(key, data[key]);
                }
            }
        }
    },

    /**
     * Utility to grab all the settings and export them into an object
     */
    _saveToObject: function() {
        return this.getSettingNames().map(function(key) {
            return this._settings[key].type.stringify(this.get(key));
        }.bind(this));
    },

    /**
     * The default initial settings
     */
    _getDefaultValues: function() {
        return this.getSettingNames().map(function(key) {
            return this._settings[key].spec.defaultValue;
        }.bind(this));
    }
};
exports.settings = new Settings();

/**
 * Save the settings in a cookie
 * This code has not been tested since reboot
 * @constructor
 */
function CookiePersister() {
};

CookiePersister.prototype = {
    loadInitialValues: function(settings) {
        settings._loadDefaultValues();
        var data = cookie.get('settings');
        settings._loadFromObject(JSON.parse(data));
    },

    persistValue: function(settings, key, value) {
        try {
            var stringData = JSON.stringify(settings._saveToObject());
            cookie.set('settings', stringData);
        } catch (ex) {
            console.error('Unable to JSONify the settings! ' + ex);
            return;
        }
    }
};

exports.CookiePersister = CookiePersister;

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
 * The Original Code is Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Skywriter Team (skywriter@mozilla.com)
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

define('pilot/commands/settings', function(require, exports, module) {


var setCommandSpec = {
    name: 'set',
    params: [
        {
            name: 'setting',
            type: 'setting',
            description: 'The name of the setting to display or alter',
            defaultValue: null
        },
        {
            name: 'value',
            type: 'settingValue',
            description: 'The new value for the chosen setting',
            defaultValue: null
        }
    ],
    description: 'define and show settings',
    exec: function(env, args, request) {
        var html;
        if (!args.setting) {
            // 'set' by itself lists all the settings
            var names = env.settings.getSettingNames();
            html = '';
            // first sort the settingsList based on the name
            names.sort(function(name1, name2) {
                return name1.localeCompare(name2);
            });

            names.forEach(function(name) {
                var setting = env.settings.getSetting(name);
                var url = 'https://wiki.mozilla.org/Labs/Skywriter/Settings#' +
                        setting.name;
                html += '<a class="setting" href="' + url +
                        '" title="View external documentation on setting: ' +
                        setting.name +
                        '" target="_blank">' +
                        setting.name +
                        '</a> = ' +
                        setting.value +
                        '<br/>';
            });
        } else {
            // set with only a setting, shows the value for that setting
            if (args.value === undefined) {
                html = '<strong>' + setting.name + '</strong> = ' +
                        setting.get();
            } else {
                // Actually change the setting
                args.setting.set(args.value);
                html = 'Setting: <strong>' + args.setting.name + '</strong> = ' +
                        args.setting.get();
            }
        }
        request.done(html);
    }
};

var unsetCommandSpec = {
    name: 'unset',
    params: [
        {
            name: 'setting',
            type: 'setting',
            description: 'The name of the setting to return to defaults'
        }
    ],
    description: 'unset a setting entirely',
    exec: function(env, args, request) {
        var setting = env.settings.get(args.setting);
        if (!setting) {
            request.doneWithError('No setting with the name <strong>' +
                args.setting + '</strong>.');
            return;
        }

        setting.reset();
        request.done('Reset ' + setting.name + ' to default: ' +
                env.settings.get(args.setting));
    }
};

var canon = require('pilot/canon');

exports.startup = function(data, reason) {
    canon.addCommand(setCommandSpec);
    canon.addCommand(unsetCommandSpec);
};

exports.shutdown = function(data, reason) {
    canon.removeCommand(setCommandSpec);
    canon.removeCommand(unsetCommandSpec);
};


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
 * The Original Code is Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Skywriter Team (skywriter@mozilla.com)
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

define('pilot/commands/basic', function(require, exports, module) {


var checks = require("pilot/typecheck");
var canon = require('pilot/canon');

/**
 * 
 */
var helpMessages = {
    plainPrefix:
        '<h2>Welcome to Skywriter - Code in the Cloud</h2><ul>' +
        '<li><a href="http://labs.mozilla.com/projects/skywriter" target="_blank">Home Page</a></li>' +
        '<li><a href="https://wiki.mozilla.org/Labs/Skywriter" target="_blank">Wiki</a></li>' +
        '<li><a href="https://wiki.mozilla.org/Labs/Skywriter/UserGuide" target="_blank">User Guide</a></li>' +
        '<li><a href="https://wiki.mozilla.org/Labs/Skywriter/Tips" target="_blank">Tips and Tricks</a></li>' +
        '<li><a href="https://wiki.mozilla.org/Labs/Skywriter/FAQ" target="_blank">FAQ</a></li>' +
        '<li><a href="https://wiki.mozilla.org/Labs/Skywriter/DeveloperGuide" target="_blank">Developers Guide</a></li>' +
        '</ul>',
    plainSuffix:
        'For more information, see the <a href="https://wiki.mozilla.org/Labs/Skywriter">Skywriter Wiki</a>.'
};

/**
 * 'help' command
 */
var helpCommandSpec = {
    name: 'help',
    params: [
        {
            name: 'search',
            type: 'text',
            description: 'Search string to narrow the output.',
            defaultValue: null
        }
    ],
    description: 'Get help on the available commands.',
    exec: function(env, args, request) {
        var output = [];

        var command = canon.getCommand(args.search);
        if (command && command.exec) {
            // caught a real command
            output.push(command.description ?
                    command.description :
                    'No description for ' + args.search);
        } else {
            var showHidden = false;

            if (!args.search && helpMessages.plainPrefix) {
                output.push(helpMessages.plainPrefix);
            }

            if (command) {
                // We must be looking at sub-commands
                output.push('<h2>Sub-Commands of ' + command.name + '</h2>');
                output.push('<p>' + command.description + '</p>');
            }
            else if (args.search) {
                if (args.search == 'hidden') { // sneaky, sneaky.
                    args.search = '';
                    showHidden = true;
                }
                output.push('<h2>Commands starting with \'' + args.search + '\':</h2>');
            }
            else {
                output.push('<h2>Available Commands:</h2>');
            }

            var commandNames = canon.getCommandNames();
            commandNames.sort();

            output.push('<table>');
            for (var i = 0; i < commandNames.length; i++) {
                command = canon.getCommand(commandNames[i]);
                if (!showHidden && command.hidden) {
                    continue;
                }
                if (command.description === undefined) {
                    // Ignore editor actions
                    continue;
                }
                if (args.search && command.name.indexOf(args.search) !== 0) {
                    // Filtered out by the user
                    continue;
                }
                if (!args.search && command.name.indexOf(' ') != -1) {
                    // sub command
                    continue;
                }
                if (command && command.name == args.search) {
                    // sub command, and we've already given that help
                    continue;
                }

                // todo add back a column with parameter information, perhaps?

                output.push('<tr>');
                output.push('<th class="right">' + command.name + '</th>');
                output.push('<td>' + command.description + '</td>');
                output.push('</tr>');
            }
            output.push('</table>');

            if (!args.search && helpMessages.plainSuffix) {
                output.push(helpMessages.plainSuffix);
            }
        }

        request.done(output.join(''));
    }
};

/**
 * 'eval' command
 */
var evalCommandSpec = {
    name: 'eval',
    params: [
        {
            name: 'javascript',
            type: 'text',
            description: 'The JavaScript to evaluate'
        }
    ],
    description: 'evals given js code and show the result',
    hidden: true,
    exec: function(env, args, request) {
        var result;
        var javascript = args.javascript;
        try {
            result = eval(javascript);
        } catch (e) {
            result = '<b>Error: ' + e.message + '</b>';
        }

        var msg = '';
        var type = '';
        var x;

        if (checks.isFunction(result)) {
            // converts the function to a well formated string
            msg = (result + '').replace(/\n/g, '<br>').replace(/ /g, '&#160');
            type = 'function';
        } else if (checks.isObject(result)) {
            if (Array.isArray(result)) {
                type = 'array';
            } else {
                type = 'object';
            }

            var items = [];
            var value;

            for (x in result) {
                if (result.hasOwnProperty(x)) {
                    if (checks.isFunction(result[x])) {
                        value = '[function]';
                    } else if (checks.isObject(result[x])) {
                        value = '[object]';
                    } else {
                        value = result[x];
                    }

                    items.push({name: x, value: value});
                }
            }

            items.sort(function(a,b) {
                return (a.name.toLowerCase() < b.name.toLowerCase()) ? -1 : 1;
            });

            for (x = 0; x < items.length; x++) {
                msg += '<b>' + items[x].name + '</b>: ' + items[x].value + '<br>';
            }

        } else {
            msg = result;
            type = typeof result;
        }

        request.done('Result for eval <b>\'' + javascript + '\'</b>' +
                ' (type: '+ type+'): <br><br>'+ msg);
    }
};

/**
 * 'version' command
 */
var versionCommandSpec = {
    name: 'version',
    description: 'show the Skywriter version',
    hidden: true,
    exec: function(env, args, request) {
        var version = 'Skywriter ' + skywriter.versionNumber + ' (' +
                skywriter.versionCodename + ')';
        request.done(version);
    }
};

/**
 * 'skywriter' command
 */
var skywriterCommandSpec = {
    name: 'skywriter',
    hidden: true,
    exec: function(env, args, request) {
        var index = Math.floor(Math.random() * messages.length);
        request.done('Skywriter ' + messages[index]);
    }
};
var messages = [
    'really wants you to trick it out in some way.',
    'is your Web editor.',
    'would love to be like Emacs on the Web.',
    'is written on the Web platform, so you can tweak it.'
];


var canon = require('pilot/canon');

exports.startup = function(data, reason) {
    canon.addCommand(helpCommandSpec);
    canon.addCommand(evalCommandSpec);
    // canon.addCommand(versionCommandSpec);
    canon.addCommand(skywriterCommandSpec);
};

exports.shutdown = function(data, reason) {
    canon.removeCommand(helpCommandSpec);
    canon.removeCommand(evalCommandSpec);
    // canon.removeCommand(versionCommandSpec);
    canon.removeCommand(skywriterCommandSpec);
};


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
 * The Original Code is Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Joe Walker (jwalker@mozilla.com)
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

define('pilot/typecheck', function(require, exports, module) {

var objectToString = Object.prototype.toString;

/**
 * Return true if it is a String
 */
exports.isString = function(it) {
    return it && objectToString.call(it) === "[object String]";
};

/**
 * Returns true if it is a Boolean.
 */
exports.isBoolean = function(it) {
    return it && objectToString.call(it) === "[object Boolean]";
};

/**
 * Returns true if it is a Number.
 */
exports.isNumber = function(it) {
    return it && objectToString.call(it) === "[object Number]" && isFinite(it);
};

/**
 * Hack copied from dojo.
 */
exports.isObject = function(it) {
    return it !== undefined &&
        (it === null || typeof it == "object" ||
        Array.isArray(it) || exports.isFunction(it));
};

/**
 * Is the passed object a function?
 * From dojo.isFunction()
 */
exports.isFunction = function(it) {
    return it && objectToString.call(it) === "[object Function]";
};

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
 * The Original Code is Mozilla Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Joe Walker (jwalker@mozilla.com)
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

define('pilot/settings/canon', function(require, exports, module) {


var historyLengthSetting = {
    name: "historyLength",
    description: "How many typed commands do we recall for reference?",
    type: "number",
    defaultValue: 50
};

exports.startup = function(data, reason) {
    data.env.settings.addSetting(historyLengthSetting);
};

exports.shutdown = function(data, reason) {
    data.env.settings.removeSetting(historyLengthSetting);
};


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
 * The Original Code is Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Kevin Dangoor (kdangoor@mozilla.com)
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

define('pilot/plugin_manager', function(require, exports, module) {

var Promise = require("pilot/promise").Promise;

exports.REASONS = {
    APP_STARTUP: 1,
    APP_SHUTDOWN: 2,
    PLUGIN_ENABLE: 3,
    PLUGIN_DISABLE: 4,
    PLUGIN_INSTALL: 5,
    PLUGIN_UNINSTALL: 6,
    PLUGIN_UPGRADE: 7,
    PLUGIN_DOWNGRADE: 8
};

exports.Plugin = function(name) {
    this.name = name;
    this.status = this.INSTALLED;
};

exports.Plugin.prototype = {
    /**
     * constants for the state
     */
    NEW: 0,
    INSTALLED: 1,
    REGISTERED: 2,
    STARTED: 3,
    UNREGISTERED: 4,
    SHUTDOWN: 5,

    install: function(data, reason) {
        var pr = new Promise();
        if (this.status > this.NEW) {
            pr.resolve(this);
            return pr;
        }
        require([this.name], function(pluginModule) {
            if (pluginModule.install) {
                pluginModule.install(data, reason);
            }
            this.status = this.INSTALLED;
            pr.resolve(this);
        }.bind(this));
        return pr;
    },

    register: function(data, reason) {
        var pr = new Promise();
        if (this.status != this.INSTALLED) {
            pr.resolve(this);
            return pr;
        }
        require([this.name], function(pluginModule) {
            if (pluginModule.register) {
                pluginModule.register(data, reason);
            }
            this.status = this.REGISTERED;
            pr.resolve(this);
        }.bind(this));
        return pr;
    },

    startup: function(data, reason) {
        reason = reason || exports.REASONS.APP_STARTUP;
        var pr = new Promise();
        if (this.status != this.REGISTERED) {
            pr.resolve(this);
            return pr;
        }
        require([this.name], function(pluginModule) {
            if (pluginModule.startup) {
                pluginModule.startup(data, reason);
            }
            this.status = this.STARTED;
            pr.resolve(this);
        }.bind(this));
        return pr;
    },

    shutdown: function(data, reason) {
        if (this.status != this.STARTED) {
            return;
        }
        pluginModule = require(this.name);
        if (pluginModule.shutdown) {
            pluginModule.shutdown(data, reason);
        }
    }
};

exports.PluginCatalog = function() {
    this.plugins = {};
};

exports.PluginCatalog.prototype = {
    registerPlugins: function(pluginList, data, reason) {
        var registrationPromises = [];
        pluginList.forEach(function(pluginName) {
            var plugin = this.plugins[pluginName];
            if (plugin === undefined) {
                plugin = new exports.Plugin(pluginName);
                this.plugins[pluginName] = plugin;
                registrationPromises.push(plugin.register(data, reason));
            }
        }.bind(this));
        return Promise.group(registrationPromises);
    },

    startupPlugins: function(data, reason) {
        var startupPromises = [];
        for (var pluginName in this.plugins) {
            var plugin = this.plugins[pluginName];
            startupPromises.push(plugin.startup(data, reason));
        }
        return Promise.group(startupPromises);
    }
};

exports.catalog = new exports.PluginCatalog();

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
 * The Original Code is Mozilla Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Joe Walker (jwalker@mozilla.com)
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

define('pilot/promise', function(require, exports, module) {

var console = require("pilot/console");
var Trace = require('pilot/stacktrace').Trace;

/**
 * A promise can be in one of 2 states.
 * The ERROR and SUCCESS states are terminal, the PENDING state is the only
 * start state.
 */
var ERROR = -1;
var PENDING = 0;
var SUCCESS = 1;

/**
 * We give promises and ID so we can track which are outstanding
 */
var _nextId = 0;

/**
 * Debugging help if 2 things try to complete the same promise.
 * This can be slow (especially on chrome due to the stack trace unwinding) so
 * we should leave this turned off in normal use.
 */
var _traceCompletion = false;

/**
 * Outstanding promises. Handy list for debugging only.
 */
var _outstanding = [];

/**
 * Recently resolved promises. Also for debugging only.
 */
var _recent = [];

/**
 * Create an unfulfilled promise
 */
Promise = function () {
    this._status = PENDING;
    this._value = undefined;
    this._onSuccessHandlers = [];
    this._onErrorHandlers = [];

    // Debugging help
    this._id = _nextId++;
    //this._createTrace = new Trace(new Error());
    _outstanding[this._id] = this;
};

/**
 * Yeay for RTTI.
 */
Promise.prototype.isPromise = true;

/**
 * Have we either been resolve()ed or reject()ed?
 */
Promise.prototype.isComplete = function() {
    return this._status != PENDING;
};

/**
 * Have we resolve()ed?
 */
Promise.prototype.isResolved = function() {
    return this._status == SUCCESS;
};

/**
 * Have we reject()ed?
 */
Promise.prototype.isRejected = function() {
    return this._status == ERROR;
};

/**
 * Take the specified action of fulfillment of a promise, and (optionally)
 * a different action on promise rejection.
 */
Promise.prototype.then = function(onSuccess, onError) {
    if (typeof onSuccess === 'function') {
        if (this._status === SUCCESS) {
            onSuccess.call(null, this._value);
        } else if (this._status === PENDING) {
            this._onSuccessHandlers.push(onSuccess);
        }
    }

    if (typeof onError === 'function') {
        if (this._status === ERROR) {
            onError.call(null, this._value);
        } else if (this._status === PENDING) {
            this._onErrorHandlers.push(onError);
        }
    }

    return this;
};

/**
 * Like then() except that rather than returning <tt>this</tt> we return
 * a promise which
 */
Promise.prototype.chainPromise = function(onSuccess) {
    var chain = new Promise();
    chain._chainedFrom = this;
    this.then(function(data) {
        try {
            chain.resolve(onSuccess(data));
        } catch (ex) {
            chain.reject(ex);
        }
    }, function(ex) {
        chain.reject(ex);
    });
    return chain;
};

/**
 * Supply the fulfillment of a promise
 */
Promise.prototype.resolve = function(data) {
    return this._complete(this._onSuccessHandlers, SUCCESS, data, 'resolve');
};

/**
 * Renege on a promise
 */
Promise.prototype.reject = function(data) {
    return this._complete(this._onErrorHandlers, ERROR, data, 'reject');
};

/**
 * Internal method to be called on resolve() or reject().
 * @private
 */
Promise.prototype._complete = function(list, status, data, name) {
    // Complain if we've already been completed
    if (this._status != PENDING) {
        console.group('Promise already closed');
        console.error('Attempted ' + name + '() with ', data);
        console.error('Previous status = ', this._status,
                ', previous value = ', this._value);
        console.trace();

        if (this._completeTrace) {
            console.error('Trace of previous completion:');
            this._completeTrace.log(5);
        }
        console.groupEnd();
        return this;
    }

    if (_traceCompletion) {
        this._completeTrace = new Trace(new Error());
    }

    this._status = status;
    this._value = data;

    // Call all the handlers, and then delete them
    list.forEach(function(handler) {
        handler.call(null, this._value);
    }, this);
    this._onSuccessHandlers.length = 0;
    this._onErrorHandlers.length = 0;

    // Remove the given {promise} from the _outstanding list, and add it to the
    // _recent list, pruning more than 20 recent promises from that list.
    delete _outstanding[this._id];
    _recent.push(this);
    while (_recent.length > 20) {
        _recent.shift();
    }

    return this;
};

/**
 * Takes an array of promises and returns a promise that that is fulfilled once
 * all the promises in the array are fulfilled
 * @param group The array of promises
 * @return the promise that is fulfilled when all the array is fulfilled
 */
Promise.group = function(promiseList) {
    if (!(promiseList instanceof Array)) {
        promiseList = Array.prototype.slice.call(arguments);
    }

    // If the original array has nothing in it, return now to avoid waiting
    if (promiseList.length === 0) {
        return new Promise().resolve([]);
    }

    var groupPromise = new Promise();
    var results = [];
    var fulfilled = 0;

    var onSuccessFactory = function(index) {
        return function(data) {
            results[index] = data;
            fulfilled++;
            // If the group has already failed, silently drop extra results
            if (groupPromise._status !== ERROR) {
                if (fulfilled === promiseList.length) {
                    groupPromise.resolve(results);
                }
            }
        };
    };

    promiseList.forEach(function(promise, index) {
        var onSuccess = onSuccessFactory(index);
        var onError = groupPromise.reject.bind(groupPromise);
        promise.then(onSuccess, onError);
    });

    return groupPromise;
};

exports.Promise = Promise;
exports._outstanding = _outstanding;
exports._recent = _recent;

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
 * The Original Code is DomTemplate.
 *
 * The Initial Developer of the Original Code is Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Joe Walker (jwalker@mozilla.com) (original author)
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

define('pilot/environment', function(require, exports, module) {


var settings = require("pilot/settings").settings;

/**
 * Create an environment object
 */
function create() {
    return {
        settings: settings
    };
};

exports.create = create;


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
 *      Julian Viereck <julian.viereck@gmail.com>
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

define('ace/editor', function(require, exports, module) {

require("pilot/fixoldbrowsers");

var oop = require("pilot/oop");
var event = require("pilot/event");
var lang = require("pilot/lang");
var useragent = require("pilot/useragent");
var TextInput = require("ace/keyboard/textinput").TextInput;
var MouseHandler = require("ace/mouse_handler").MouseHandler;
//var TouchHandler = require("ace/touch_handler").TouchHandler;
var KeyBinding = require("ace/keyboard/keybinding").KeyBinding;
var EditSession = require("ace/edit_session").EditSession;
var Search = require("ace/search").Search;
var BackgroundTokenizer = require("ace/background_tokenizer").BackgroundTokenizer;
var Range = require("ace/range").Range;
var EventEmitter = require("pilot/event_emitter").EventEmitter;

var Editor =function(renderer, session) {
    var container = renderer.getContainerElement();
    this.container = container;
    this.renderer = renderer;

    this.textInput  = new TextInput(renderer.getTextAreaContainer(), this);
    this.keyBinding = new KeyBinding(this);
    
    // TODO detect touch event support
    if (useragent.isIPad) {
        //this.$mouseHandler = new TouchHandler(this);
    } else {
        this.$mouseHandler = new MouseHandler(this);
    }

    this.$selectionMarker = null;
    this.$highlightLineMarker = null;
    this.$blockScrolling = false;

    this.$search = new Search().set({
        wrap: true
    });

    this.setSession(session || new EditSession(""));
};

(function(){

    oop.implement(this, EventEmitter);

    this.$forwardEvents = {
        gutterclick: 1,
        gutterdblclick: 1
    };

    this.$originalAddEventListener = this.addEventListener;
    this.$originalRemoveEventListener = this.removeEventListener;

    this.addEventListener = function(eventName, callback) {
        if (this.$forwardEvents[eventName]) {
            return this.renderer.addEventListener(eventName, callback);
        } else {
            return this.$originalAddEventListener(eventName, callback);
        }
    };

    this.removeEventListener = function(eventName, callback) {
        if (this.$forwardEvents[eventName]) {
            return this.renderer.removeEventListener(eventName, callback);
        } else {
            return this.$originalRemoveEventListener(eventName, callback);
        }
    };

    this.setKeyboardHandler = function(keyboardHandler) {
        this.keyBinding.setKeyboardHandler(keyboardHandler);
    };

    this.getKeyboardHandler = function() {
        return this.keyBinding.getKeyboardHandler();
    }

    this.setSession = function(session) {
        if (this.session == session) return;

        if (this.session) {
            var oldSession = this.session;
            this.session.removeEventListener("change", this.$onDocumentChange);
            this.session.removeEventListener("changeMode", this.$onDocumentModeChange);
            this.session.removeEventListener("changeTabSize", this.$onDocumentChangeTabSize);
            this.session.removeEventListener("changeWrapMode", this.$onDocumentChangeWrapMode);
            this.session.removeEventListener("changeBreakpoint", this.$onDocumentChangeBreakpoint);
            this.session.removeEventListener("changeAnnotation", this.$onDocumentChangeAnnotation);

            var selection = this.session.getSelection();
            selection.removeEventListener("changeCursor", this.$onCursorChange);
            selection.removeEventListener("changeSelection", this.$onSelectionChange);

            this.session.setScrollTopRow(this.renderer.getScrollTopRow());
        }

        this.session = session;

        this.$onDocumentChange = this.onDocumentChange.bind(this);
        session.addEventListener("change", this.$onDocumentChange);
        this.renderer.setSession(session);

        this.$onDocumentModeChange = this.onDocumentModeChange.bind(this);
        session.addEventListener("changeMode", this.$onDocumentModeChange);

        this.$onDocumentChangeTabSize = this.renderer.updateText.bind(this.renderer);
        session.addEventListener("changeTabSize", this.$onDocumentChangeTabSize);

        this.$onDocumentChangeWrapMode = this.renderer.updateFull.bind(this.renderer);
        session.addEventListener("changeWrapMode", this.$onDocumentChangeWrapMode);

        this.$onDocumentChangeBreakpoint = this.onDocumentChangeBreakpoint.bind(this);
        this.session.addEventListener("changeBreakpoint", this.$onDocumentChangeBreakpoint);

        this.$onDocumentChangeAnnotation = this.onDocumentChangeAnnotation.bind(this);
        this.session.addEventListener("changeAnnotation", this.$onDocumentChangeAnnotation);

        this.selection = session.getSelection();

        this.$onCursorChange = this.onCursorChange.bind(this);
        this.selection.addEventListener("changeCursor", this.$onCursorChange);

        this.$onSelectionChange = this.onSelectionChange.bind(this);
        this.selection.addEventListener("changeSelection", this.$onSelectionChange);

        this.onDocumentModeChange();
        this.bgTokenizer.setDocument(session.getDocument());
        this.bgTokenizer.start(0);

        this.onCursorChange();
        this.onSelectionChange();
        this.onDocumentChangeBreakpoint();
        this.onDocumentChangeAnnotation();
        this.renderer.scrollToRow(session.getScrollTopRow());
        this.renderer.updateFull();

        this._dispatchEvent("changeSession", {
            session: session,
            oldSession: oldSession
        });
    };

    this.getSession = function() {
        return this.session;
    };

    this.getSelection = function() {
        return this.selection;
    };

    this.resize = function() {
        this.renderer.onResize();
    };

    this.setTheme = function(theme) {
        this.renderer.setTheme(theme);
    };

    this.setStyle = function(style) {
        this.renderer.setStyle(style)
    };

    this.unsetStyle = function(style) {
        this.renderer.unsetStyle(style)
    }

    this.$highlightBrackets = function() {
        if (this.$bracketHighlight) {
            this.renderer.removeMarker(this.$bracketHighlight);
            this.$bracketHighlight = null;
        }

        if (this.$highlightPending) {
            return;
        }

        // perform highlight async to not block the browser during navigation
        var self = this;
        this.$highlightPending = true;
        setTimeout(function() {
            self.$highlightPending = false;

            var pos = self.session.findMatchingBracket(self.getCursorPosition());
            if (pos) {
                var range = new Range(pos.row, pos.column, pos.row, pos.column+1);
                self.$bracketHighlight = self.renderer.addMarker(range, "ace_bracket");
            }
        }, 10);
    };

    this.focus = function() {
        // Safari need the timeout
        // iOS and Firefox need it called immediately
        // to be on the save side we do both
        var _self = this;
        setTimeout(function() {
            _self.textInput.focus();
        });
        this.textInput.focus();
    };

    this.blur = function() {
        this.textInput.blur();
    };

    this.onFocus = function() {
        this.renderer.showCursor();
        this.renderer.visualizeFocus();
        this._dispatchEvent("focus");
    };

    this.onBlur = function() {
        this.renderer.hideCursor();
        this.renderer.visualizeBlur();
        this._dispatchEvent("blur");
    };

    this.onDocumentChange = function(e) {
        var delta = e.data;
        var range = delta.range;

        this.bgTokenizer.start(range.start.row);
        if (range.start.row == range.end.row && delta.action != "insertLines" && delta.action != "removeLines")
            var lastRow = range.end.row;
        else
            lastRow = Infinity;
        this.renderer.updateLines(range.start.row, lastRow);

        // update cursor because tab characters can influence the cursor position
        this.renderer.updateCursor(this.getCursorPosition(), this.$overwrite);
    };

    this.onTokenizerUpdate = function(e) {
        var rows = e.data;
        this.renderer.updateLines(rows.first, rows.last);
    };

    this.onCursorChange = function(e) {
        this.renderer.updateCursor(this.getCursorPosition(), this.$overwrite);

        if (!this.$blockScrolling && (!e || !e.blockScrolling)) {
            this.renderer.scrollCursorIntoView();
        }

        // move text input over the cursor
        // this is required for iOS and IME
        this.renderer.moveTextAreaToCursor(this.textInput.getElement());

        this.$highlightBrackets();
        this.$updateHighlightActiveLine();
    };

    this.$updateHighlightActiveLine = function() {
        if (this.$highlightLineMarker) {
            this.renderer.removeMarker(this.$highlightLineMarker);
        }
        this.$highlightLineMarker = null;

        if (this.getHighlightActiveLine() && (this.getSelectionStyle() != "line" || !this.selection.isMultiLine())) {
            var cursor = this.getCursorPosition();
            var range = new Range(cursor.row, 0, cursor.row+1, 0);
            this.$highlightLineMarker = this.renderer.addMarker(range, "ace_active_line", "line");
        }
    };

    this.onSelectionChange = function(e) {
        if (this.$selectionMarker) {
            this.renderer.removeMarker(this.$selectionMarker);
        }
        this.$selectionMarker = null;

        if (!this.selection.isEmpty()) {
            var range = this.selection.getRange();
            var style = this.getSelectionStyle();
            this.$selectionMarker = this.renderer.addMarker(range, "ace_selection", style);
        }

        this.onCursorChange(e);
    };

    this.onDocumentChangeBreakpoint = function() {
        this.renderer.setBreakpoints(this.session.getBreakpoints());
    };

    this.onDocumentChangeAnnotation = function() {
        this.renderer.setAnnotations(this.session.getAnnotations());
    };

    this.onDocumentModeChange = function() {
        var mode = this.session.getMode();
        if (this.mode == mode)
            return;

        this.mode = mode;
        var tokenizer = mode.getTokenizer();

        if (!this.bgTokenizer) {
            var onUpdate = this.onTokenizerUpdate.bind(this);
            this.bgTokenizer = new BackgroundTokenizer(tokenizer, this);
            this.bgTokenizer.addEventListener("update", onUpdate);
        } else {
            this.bgTokenizer.setTokenizer(tokenizer);
        }

        this.renderer.setTokenizer(this.bgTokenizer);
    };

    this.getCopyText = function() {
        if (!this.selection.isEmpty()) {
            return this.session.getTextRange(this.getSelectionRange());
        }
        else {
            return "";
        }
    };

    this.onCut = function() {
        if (this.$readOnly)
            return;

        if (!this.selection.isEmpty()) {
            this.moveCursorToPosition(this.session.remove(this.getSelectionRange()));
            this.clearSelection();
        }
    };

    this.insert = function(text) {
        if (this.$readOnly)
            return;

        var cursor = this.getCursorPosition();
        text = text.replace("\t", this.session.getTabString());

        // remove selected text
        if (!this.selection.isEmpty()) {
            var cursor = this.session.remove(this.getSelectionRange());
            this.clearSelection();
        } else if (this.$overwrite){
            var range = new Range.fromPoints(cursor, cursor);
            range.end.column += text.length;
            this.session.remove(range);
        }

        this.clearSelection();

        var lineState     = this.bgTokenizer.getState(cursor.row);
        var shouldOutdent = this.mode.checkOutdent(lineState, this.session.getLine(cursor.row), text);
        var line          = this.session.getLine(cursor.row);
        var lineIndent    = this.mode.getNextLineIndent(lineState, line.slice(0, cursor.column), this.session.getTabString());
        var end           = this.session.insert(cursor, text);

        /* TODO: This shortcut is somehow broken
        if (!shouldOutdent && line != this.session.getLine(row) && text != "\n") {
            this.moveCursorToPosition(end);
            this.renderer.scrollCursorIntoView();
            return;
        }
        */

        var lineState = this.bgTokenizer.getState(cursor.row);
        // multi line insert
        if (cursor.row !== end.row) {
            var size        = this.session.getTabSize(),
                minIndent   = Number.MAX_VALUE;

            for (var row = cursor.row + 1; row <= end.row; ++row) {
                var indent = 0;

                line = this.session.getLine(row);
                for (var i = 0; i < line.length; ++i)
                    if (line.charAt(i) == '\t')
                        indent += size;
                    else if (line.charAt(i) == ' ')
                        indent += 1;
                    else
                        break;
                if (/[^\s]/.test(line))
                    minIndent = Math.min(indent, minIndent);
            }

            for (var row = cursor.row + 1; row <= end.row; ++row) {
                var outdent = minIndent;

                line = this.session.getLine(row);
                for (var i = 0; i < line.length && outdent > 0; ++i)
                    if (line.charAt(i) == '\t')
                        outdent -= size;
                    else if (line.charAt(i) == ' ')
                        outdent -= 1;
                this.session.replace(new Range(row, 0, row, line.length), line.substr(i));
            }
            end.column += this.session.indentRows(cursor.row + 1, end.row, lineIndent);
        } else {
            if (shouldOutdent) {
                end.column += this.mode.autoOutdent(lineState, this.session, cursor.row);
            }
        }

        this.moveCursorToPosition(end);
        this.renderer.scrollCursorIntoView();
    }

    this.onTextInput = function(text) {
        this.keyBinding.onTextInput(text);
    };

    this.onCommandKey = function(e, hashId, keyCode) {
        this.keyBinding.onCommandKey(e, hashId, keyCode);
    };

    this.$overwrite = false;
    this.setOverwrite = function(overwrite) {
        if (this.$overwrite == overwrite) return;

        this.$overwrite = overwrite;

        this.$blockScrolling = true;
        this.onCursorChange();
        this.$blockScrolling = false;

        this._dispatchEvent("changeOverwrite", {data: overwrite});
    };

    this.getOverwrite = function() {
        return this.$overwrite;
    };

    this.toggleOverwrite = function() {
        this.setOverwrite(!this.$overwrite);
    };

    this.setScrollSpeed = function(speed) {
        this.$mouseHandler.setScrollSpeed(speed);
    };

    this.getScrollSpeed = function() {
        return this.$mouseHandler.getScrollSpeed()
    };

    this.$selectionStyle = "line";
    this.setSelectionStyle = function(style) {
        if (this.$selectionStyle == style) return;

        this.$selectionStyle = style;
        this.onSelectionChange();
        this._dispatchEvent("changeSelectionStyle", {data: style});
    };

    this.getSelectionStyle = function() {
        return this.$selectionStyle;
    };

    this.$highlightActiveLine = true;
    this.setHighlightActiveLine = function(shouldHighlight) {
        if (this.$highlightActiveLine == shouldHighlight) return;

        this.$highlightActiveLine = shouldHighlight;
        this.$updateHighlightActiveLine();
    };

    this.getHighlightActiveLine = function() {
        return this.$highlightActiveLine;
    };

    this.setShowInvisibles = function(showInvisibles) {
        if (this.getShowInvisibles() == showInvisibles)
            return;

        this.renderer.setShowInvisibles(showInvisibles);
    };

    this.getShowInvisibles = function() {
        return this.renderer.getShowInvisibles();
    };

    this.setShowPrintMargin = function(showPrintMargin) {
        this.renderer.setShowPrintMargin(showPrintMargin);
    };

    this.getShowPrintMargin = function() {
        return this.renderer.getShowPrintMargin();
    };

    this.setPrintMarginColumn = function(showPrintMargin) {
        this.renderer.setPrintMarginColumn(showPrintMargin);
    };

    this.getPrintMarginColumn = function() {
        return this.renderer.getPrintMarginColumn();
    };

    this.$readOnly = false;
    this.setReadOnly = function(readOnly) {
        this.$readOnly = readOnly;
    };

    this.getReadOnly = function() {
        return this.$readOnly;
    };

    this.removeRight = function() {
        if (this.$readOnly)
            return;

        if (this.selection.isEmpty()) {
            this.selection.selectRight();
        }
        this.moveCursorToPosition(this.session.remove(this.getSelectionRange()));
        this.clearSelection();
    };

    this.removeLeft = function() {
        if (this.$readOnly)
            return;

        if (this.selection.isEmpty())
            this.selection.selectLeft();

        this.moveCursorToPosition(this.session.remove(this.getSelectionRange()));
        this.clearSelection();
    };

    this.indent = function() {
        if (this.$readOnly)
            return;

        var session = this.session;
        var range = this.getSelectionRange();

        if (range.start.row < range.end.row || range.start.column < range.end.column) {
            var rows = this.$getSelectedRows();
            var count = session.indentRows(rows.first, rows.last, "\t");

            this.selection.shiftSelection(count);
        } else {
            var indentString;

            if (this.session.getUseSoftTabs()) {
                var size        = session.getTabSize(),
                    position    = this.getCursorPosition(),
                    column      = session.documentToScreenColumn(position.row, position.column),
                    count       = (size - column % size);

                indentString = lang.stringRepeat(" ", count);
            } else
                indentString = "\t";
            return this.onTextInput(indentString);
        }
    };

    this.blockOutdent = function() {
        if (this.$readOnly)
            return;

        var selection = this.session.getSelection();
        var range = this.session.outdentRows(selection.getRange());

        selection.setSelectionRange(range, selection.isBackwards());
    };

    this.toggleCommentLines = function() {
        if (this.$readOnly)
            return;

        var state = this.bgTokenizer.getState(this.getCursorPosition().row);
        var rows = this.$getSelectedRows()
        var addedColumns = this.mode.toggleCommentLines(state, this.session, rows.first, rows.last);
        this.selection.shiftSelection(addedColumns);
    };

    this.removeLines = function() {
        if (this.$readOnly)
            return;

        var rows = this.$getSelectedRows();
        this.selection.setSelectionAnchor(rows.last+1, 0);
        this.selection.selectTo(rows.first, 0);

        this.session.remove(this.getSelectionRange());
        this.clearSelection();
    };

    this.moveLinesDown = function() {
        if (this.$readOnly)
            return;

        this.$moveLines(function(firstRow, lastRow) {
            return this.session.moveLinesDown(firstRow, lastRow);
        });
    };

    this.moveLinesUp = function() {
        if (this.$readOnly)
            return;

        this.$moveLines(function(firstRow, lastRow) {
            return this.session.moveLinesUp(firstRow, lastRow);
        });
    };

    this.copyLinesUp = function() {
        if (this.$readOnly)
            return;

        this.$moveLines(function(firstRow, lastRow) {
            this.session.duplicateLines(firstRow, lastRow);
            return 0;
        });
    };

    this.copyLinesDown = function() {
        if (this.$readOnly)
            return;

        this.$moveLines(function(firstRow, lastRow) {
            return this.session.duplicateLines(firstRow, lastRow);
        });
    };


    this.$moveLines = function(mover) {
        var rows = this.$getSelectedRows();

        var linesMoved = mover.call(this, rows.first, rows.last);

        var selection = this.selection;
        selection.setSelectionAnchor(rows.last+linesMoved+1, 0);
        selection.$moveSelection(function() {
            selection.moveCursorTo(rows.first+linesMoved, 0);
        });
    };

    this.$getSelectedRows = function() {
        var range = this.getSelectionRange().collapseRows();

        return {
            first: range.start.row,
            last: range.end.row
        };
    };

    this.onCompositionStart = function(text) {
        this.renderer.showComposition(this.getCursorPosition());
        //this.onTextInput(text);
    };

    this.onCompositionUpdate = function(text) {
        this.renderer.setCompositionText(text);
    };

    this.onCompositionEnd = function() {
        this.renderer.hideComposition();
        //this.removeLeft();
    };


    this.getFirstVisibleRow = function() {
        return this.renderer.getFirstVisibleRow();
    };

    this.getLastVisibleRow = function() {
        return this.renderer.getLastVisibleRow();
    };

    this.isRowVisible = function(row) {
        return (row >= this.getFirstVisibleRow() && row <= this.getLastVisibleRow());
    };

    this.getVisibleRowCount = function() {
        return this.getLastVisibleRow() - this.getFirstVisibleRow() + 1;
    };

    this.getPageDownRow = function() {
        return this.renderer.getLastVisibleRow() - 1;
    };

    this.getPageUpRow = function() {
        var firstRow = this.renderer.getFirstVisibleRow();
        var lastRow = this.renderer.getLastVisibleRow();

        return firstRow - (lastRow - firstRow) + 1;
    };

    this.selectPageDown = function() {
        var row = this.getPageDownRow() + Math.floor(this.getVisibleRowCount() / 2);

        this.scrollPageDown();

        var selection = this.getSelection();
        selection.$moveSelection(function() {
            selection.moveCursorTo(row, selection.getSelectionLead().column);
        });
    };

    this.selectPageUp = function() {
        var visibleRows = this.getLastVisibleRow() - this.getFirstVisibleRow();
        var row = this.getPageUpRow() + Math.round(visibleRows / 2);

        this.scrollPageUp();

        var selection = this.getSelection();
        selection.$moveSelection(function() {
            selection.moveCursorTo(row, selection.getSelectionLead().column);
        });
    };

    this.gotoPageDown = function() {
        var row     = this.getPageDownRow(),
            column  = Math.min(this.getCursorPosition().column,
                               this.session.getLine(row).length);

        this.scrollToRow(row);
        this.getSelection().moveCursorTo(row, column);
    };

    this.gotoPageUp = function() {
       var  row     = this.getPageUpRow(),
            column  = Math.min(this.getCursorPosition().column,
                               this.session.getLine(row).length);

       this.scrollToRow(row);
       this.getSelection().moveCursorTo(row, column);
    };

    this.scrollPageDown = function() {
        this.scrollToRow(this.getPageDownRow());
    };

    this.scrollPageUp = function() {
        this.renderer.scrollToRow(this.getPageUpRow());
    };

    this.scrollToRow = function(row) {
        this.renderer.scrollToRow(row);
    };


    this.getCursorPosition = function() {
        return this.selection.getCursor();
    };

    this.getSelectionRange = function() {
        return this.selection.getRange();
    };

    this.clearSelection = function() {
        this.selection.clearSelection();
    };

    this.moveCursorTo = function(row, column) {
        this.selection.moveCursorTo(row, column);
    };

    this.moveCursorToPosition = function(pos) {
        this.selection.moveCursorToPosition(pos);
    };


    this.gotoLine = function(lineNumber, row) {
        this.selection.clearSelection();

        this.$blockScrolling = true;
        this.moveCursorTo(lineNumber-1, row || 0);
        this.$blockScrolling = false;

        if (!this.isRowVisible(this.getCursorPosition().row)) {
            this.scrollToRow(lineNumber - 1 - Math.floor(this.getVisibleRowCount() / 2));
        }
    },

    this.navigateTo = function(row, column) {
        this.clearSelection();
        this.moveCursorTo(row, column);
    };

    this.navigateUp = function(times) {
        this.selection.clearSelection();
        this.selection.moveCursorBy(-1, 0);
    };

    this.navigateDown = function(times) {
        this.selection.clearSelection();
        this.selection.moveCursorBy(1, 0);
    };

    this.navigateLeft = function(times) {
        if (!this.selection.isEmpty()) {
            var selectionStart = this.getSelectionRange().start;
            this.moveCursorToPosition(selectionStart);
        }
        else {
            times = times || 1;
            while (times--) {
                this.selection.moveCursorLeft();
            }
        }
        this.clearSelection();
    };

    this.navigateRight = function(times) {
        if (!this.selection.isEmpty()) {
            var selectionEnd = this.getSelectionRange().end;
            this.moveCursorToPosition(selectionEnd);
        }
        else {
            times = times || 1;
            while (times--) {
                this.selection.moveCursorRight();
            }
        }
        this.clearSelection();
    };

    this.navigateLineStart = function() {
        this.selection.moveCursorLineStart();
        this.clearSelection();
    };

    this.navigateLineEnd = function() {
        this.selection.moveCursorLineEnd();
        this.clearSelection();
    };

    this.navigateFileEnd = function() {
        this.selection.moveCursorFileEnd();
        this.clearSelection();
    };

    this.navigateFileStart = function() {
        this.selection.moveCursorFileStart();
        this.clearSelection();
    };

    this.navigateWordRight = function() {
        this.selection.moveCursorWordRight();
        this.clearSelection();
    };

    this.navigateWordLeft = function() {
        this.selection.moveCursorWordLeft();
        this.clearSelection();
    };

    this.replace = function(replacement, options) {
        if (options)
            this.$search.set(options);

        var range = this.$search.find(this.session);
        this.$tryReplace(range, replacement);
        if (range !== null)
            this.selection.setSelectionRange(range);
    },

    this.replaceAll = function(replacement, options) {
        if (options) {
            this.$search.set(options);
        }

        var ranges = this.$search.findAll(this.session);
        if (!ranges.length)
            return;

        this.clearSelection();
        this.selection.moveCursorTo(0, 0);

        for (var i = ranges.length - 1; i >= 0; --i)
            this.$tryReplace(ranges[i], replacement);
        if (ranges[0] !== null)
            this.selection.setSelectionRange(ranges[0]);
    },

    this.$tryReplace = function(range, replacement) {
        var input = this.session.getTextRange(range);
        var replacement = this.$search.replace(input, replacement);
        if (replacement !== null) {
            range.end = this.session.replace(range, replacement);
            return range;
        } else {
            return null;
        }
    };

    this.getLastSearchOptions = function() {
        return this.$search.getOptions();
    };

    this.find = function(needle, options) {
        this.clearSelection();
        options = options || {};
        options.needle = needle;
        this.$search.set(options);
        this.$find();
    },

    this.findNext = function(options) {
        options = options || {};
        if (typeof options.backwards == "undefined")
            options.backwards = false;
        this.$search.set(options);
        this.$find();
    };

    this.findPrevious = function(options) {
        options = options || {};
        if (typeof options.backwards == "undefined")
            options.backwards = true;
        this.$search.set(options);
        this.$find();
    };

    this.$find = function(backwards) {
        if (!this.selection.isEmpty()) {
            this.$search.set({needle: this.session.getTextRange(this.getSelectionRange())});
        }

        if (typeof backwards != "undefined")
            this.$search.set({backwards: backwards});

        var range = this.$search.find(this.session);
        if (range) {
            this.gotoLine(range.end.row+1, range.end.column);
            this.selection.setSelectionRange(range);
        }
    };

    this.undo = function() {
        this.session.getUndoManager().undo();
    };

    this.redo = function() {
        this.session.getUndoManager().redo();
    };

}).call(Editor.prototype);


exports.Editor = Editor;
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

define('pilot/event', function(require, exports, module) {

var keys = require("pilot/keys");
var useragent = require("pilot/useragent");

exports.addListener = function(elem, type, callback) {
    if (elem.addEventListener) {
        return elem.addEventListener(type, callback, false);
    }
    if (elem.attachEvent) {
        var wrapper = function() {
            callback(window.event);
        };
        callback._wrapper = wrapper;
        elem.attachEvent("on" + type, wrapper);
    }
};

exports.removeListener = function(elem, type, callback) {
    if (elem.removeEventListener) {
        return elem.removeEventListener(type, callback, false);
    }
    if (elem.detachEvent) {
        elem.detachEvent("on" + type, callback._wrapper || callback);
    }
};

/**
* Prevents propagation and clobbers the default action of the passed event
*/
exports.stopEvent = function(e) {
    exports.stopPropagation(e);
    exports.preventDefault(e);
    return false;
};

exports.stopPropagation = function(e) {
    if (e.stopPropagation)
        e.stopPropagation();
    else
        e.cancelBubble = true;
};

exports.preventDefault = function(e) {
    if (e.preventDefault)
        e.preventDefault();
    else
        e.returnValue = false;
};

exports.getDocumentX = function(e) {
    if (e.clientX) {
        var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
        return e.clientX + scrollLeft;
    } else {
        return e.pageX;
    }
};

exports.getDocumentY = function(e) {
    if (e.clientY) {
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        return e.clientY + scrollTop;
    } else {
        return e.pageY;
    }
};

/**
 * @return {Number} 0 for left button, 1 for middle button, 2 for right button
 */
exports.getButton = function(e) {
    if (e.type == "dblclick")
        return 0;
    else if (e.type == "contextmenu")
        return 2;
        
    // DOM Event
    if (e.preventDefault) {
        return e.button;
    }
    // old IE
    else {
        return {1:0, 2:2, 4:1}[e.button];
    }
};

if (document.documentElement.setCapture) {
    exports.capture = function(el, eventHandler, releaseCaptureHandler) {
        function onMouseMove(e) {
            eventHandler(e);
            return exports.stopPropagation(e);
        }

        function onReleaseCapture(e) {
            eventHandler && eventHandler(e);
            releaseCaptureHandler && releaseCaptureHandler();

            exports.removeListener(el, "mousemove", eventHandler);
            exports.removeListener(el, "mouseup", onReleaseCapture);
            exports.removeListener(el, "losecapture", onReleaseCapture);

            el.releaseCapture();
        }

        exports.addListener(el, "mousemove", eventHandler);
        exports.addListener(el, "mouseup", onReleaseCapture);
        exports.addListener(el, "losecapture", onReleaseCapture);
        el.setCapture();
    };
}
else {
    exports.capture = function(el, eventHandler, releaseCaptureHandler) {
        function onMouseMove(e) {
            eventHandler(e);
            e.stopPropagation();
        }

        function onMouseUp(e) {
            eventHandler && eventHandler(e);
            releaseCaptureHandler && releaseCaptureHandler();

            document.removeEventListener("mousemove", onMouseMove, true);
            document.removeEventListener("mouseup", onMouseUp, true);

            e.stopPropagation();
        }

        document.addEventListener("mousemove", onMouseMove, true);
        document.addEventListener("mouseup", onMouseUp, true);
    };
}

exports.addMouseWheelListener = function(el, callback) {
    var listener = function(e) {
        if (e.wheelDelta !== undefined) {
            if (e.wheelDeltaX !== undefined) {
                e.wheelX = -e.wheelDeltaX / 8;
                e.wheelY = -e.wheelDeltaY / 8;
            } else {
                e.wheelX = 0;
                e.wheelY = -e.wheelDelta / 8;
            }
        }
        else {
            if (e.axis && e.axis == e.HORIZONTAL_AXIS) {
                e.wheelX = (e.detail || 0) * 5;
                e.wheelY = 0;
            } else {
                e.wheelX = 0;
                e.wheelY = (e.detail || 0) * 5;
            }
        }
        callback(e);
    };
    exports.addListener(el, "DOMMouseScroll", listener);
    exports.addListener(el, "mousewheel", listener);
};

exports.addMultiMouseDownListener = function(el, button, count, timeout, callback) {
    var clicks = 0;
    var startX, startY;

    var listener = function(e) {
        clicks += 1;
        if (clicks == 1) {
            startX = e.clientX;
            startY = e.clientY;

            setTimeout(function() {
                clicks = 0;
            }, timeout || 600);
        }

        if (exports.getButton(e) != button
          || Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5)
            clicks = 0;

        if (clicks == count) {
            clicks = 0;
            callback(e);
        }
        return exports.preventDefault(e);
    };

    exports.addListener(el, "mousedown", listener);
    useragent.isIE && exports.addListener(el, "dblclick", listener);
};

function normalizeCommandKeys(callback, e, keyCode) {
    var hashId = 0;
    if (useragent.isOpera && useragent.isMac) {
        hashId = 0 | (e.metaKey ? 1 : 0) | (e.altKey ? 2 : 0)
            | (e.shiftKey ? 4 : 0) | (e.ctrlKey ? 8 : 0);
    } else {
        hashId = 0 | (e.ctrlKey ? 1 : 0) | (e.altKey ? 2 : 0)
            | (e.shiftKey ? 4 : 0) | (e.metaKey ? 8 : 0);
    }

    if (keyCode in keys.MODIFIER_KEYS) {
        switch (keys.MODIFIER_KEYS[keyCode]) {
            case "Alt":
                hashId = 2;
                break;
            case "Shift":
                hashId = 4;
                break
            case "Ctrl":
                hashId = 1;
                break;
            default:
                hashId = 8;
                break;
        }
        keyCode = 0;
    }

    if (hashId & 8 && (keyCode == 91 || keyCode == 93)) {
        keyCode = 0;
    }

    // If there is no hashID and the keyCode is not a function key, then
    // we don't call the callback as we don't handle a command key here
    // (it's a normal key/character input).
    if (hashId == 0 && !(keyCode in keys.FUNCTION_KEYS)) {
        return false;
    }

    return callback(e, hashId, keyCode);
}

exports.addCommandKeyListener = function(el, callback) {
    var addListener = exports.addListener;
    if (useragent.isOldGecko) {
        // Old versions of Gecko aka. Firefox < 4.0 didn't repeat the keydown
        // event if the user pressed the key for a longer time. Instead, the
        // keydown event was fired once and later on only the keypress event.
        // To emulate the 'right' keydown behavior, the keyCode of the initial
        // keyDown event is stored and in the following keypress events the
        // stores keyCode is used to emulate a keyDown event.
        var lastKeyDownKeyCode = null;
        addListener(el, "keydown", function(e) {
            lastKeyDownKeyCode = e.keyCode;
        });
        addListener(el, "keypress", function(e) {
            return normalizeCommandKeys(callback, e, lastKeyDownKeyCode);
        });
    } else {
        var lastDown = null;

        addListener(el, "keydown", function(e) {
            lastDown = e.keyIdentifier || e.keyCode;
            return normalizeCommandKeys(callback, e, e.keyCode);
        });

        // repeated keys are fired as keypress and not keydown events
        if (useragent.isMac && useragent.isOpera) {
            addListener(el, "keypress", function(e) {
                var keyId = e.keyIdentifier || e.keyCode;
                if (lastDown !== keyId) {
                    return normalizeCommandKeys(callback, e, e.keyCode);
                } else {
                    lastDown = null;
                }
            });
        }
    }
};

});
/*! @license
==========================================================================
SproutCore -- JavaScript Application Framework
copyright 2006-2009, Sprout Systems Inc., Apple Inc. and contributors.

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.

SproutCore and the SproutCore logo are trademarks of Sprout Systems, Inc.

For more information about SproutCore, visit http://www.sproutcore.com


==========================================================================
@license */

// Most of the following code is taken from SproutCore with a few changes.

define('pilot/keys', function(require, exports, module) {

var oop = require("pilot/oop");

/**
 * Helper functions and hashes for key handling.
 */
var Keys = (function() {
    var ret = {
        MODIFIER_KEYS: {
            16: 'Shift', 17: 'Ctrl', 18: 'Alt', 224: 'Meta'
        },

        KEY_MODS: {
            "ctrl": 1, "alt": 2, "option" : 2,
            "shift": 4, "meta": 8, "command": 8
        },

        FUNCTION_KEYS : {
            8  : "Backspace",
            9  : "Tab",
            13 : "Return",
            19 : "Pause",
            27 : "Esc",
            32 : "Space",
            33 : "PageUp",
            34 : "PageDown",
            35 : "End",
            36 : "Home",
            37 : "Left",
            38 : "Up",
            39 : "Right",
            40 : "Down",
            44 : "Print",
            45 : "Insert",
            46 : "Delete",
            112: "F1",
            113: "F2",
            114: "F3",
            115: "F4",
            116: "F5",
            117: "F6",
            118: "F7",
            119: "F8",
            120: "F9",
            121: "F10",
            122: "F11",
            123: "F12",
            144: "Numlock",
            145: "Scrolllock"
        },

        PRINTABLE_KEYS: {
           32: ' ',  48: '0',  49: '1',  50: '2',  51: '3',  52: '4', 53:  '5',
           54: '6',  55: '7',  56: '8',  57: '9',  59: ';',  61: '=', 65:  'a',
           66: 'b',  67: 'c',  68: 'd',  69: 'e',  70: 'f',  71: 'g', 72:  'h',
           73: 'i',  74: 'j',  75: 'k',  76: 'l',  77: 'm',  78: 'n', 79:  'o',
           80: 'p',  81: 'q',  82: 'r',  83: 's',  84: 't',  85: 'u', 86:  'v',
           87: 'w',  88: 'x',  89: 'y',  90: 'z', 107: '+', 109: '-', 110: '.',
          188: ',', 190: '.', 191: '/', 192: '`', 219: '[', 220: '\\',
          221: ']', 222: '\"'
        }
    };

    // A reverse map of FUNCTION_KEYS
    for (i in ret.FUNCTION_KEYS) {
        var name = ret.FUNCTION_KEYS[i].toUpperCase();
        ret[name] = parseInt(i, 10);
    }

    // Add the MODIFIER_KEYS, FUNCTION_KEYS and PRINTABLE_KEYS to the KEY
    // variables as well.
    oop.mixin(ret, ret.MODIFIER_KEYS);
    oop.mixin(ret, ret.PRINTABLE_KEYS);
    oop.mixin(ret, ret.FUNCTION_KEYS);

    return ret;
})();
oop.mixin(exports, Keys);

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

define('ace/keyboard/textinput', function(require, exports, module) {

var event = require("pilot/event");
var useragent = require("pilot/useragent");

var TextInput = function(parentNode, host) {

    var text = document.createElement("textarea");
    text.style.left = "-10000px";
    parentNode.appendChild(text);

    var PLACEHOLDER = String.fromCharCode(0);
    sendText();

    var inCompostion = false;
    var copied = false;
    var tempStyle = '';

    function sendText(valueToSend) {
        if (!copied) {
            var value = valueToSend || text.value;
            if (value) {
                if (value.charCodeAt(value.length-1) == PLACEHOLDER.charCodeAt(0)) {
                    value = value.slice(0, -1);
                    if (value)
                        host.onTextInput(value);
                } else
                    host.onTextInput(value);
            }
        }
        copied = false;

        // Safari doesn't fire copy events if no text is selected
        text.value = PLACEHOLDER;
        text.select();
    }

    var onTextInput = function(e) {
        if (useragent.isIE && text.value.charCodeAt(0) > 128) return;
        setTimeout(function() {
            if (!inCompostion)
                sendText();
        }, 0);
    };

    var onCompositionStart = function(e) {
        inCompostion = true;
        if (!useragent.isIE) {
            sendText();
            text.value = "";
        };
        host.onCompositionStart();
        if (!useragent.isGecko) setTimeout(onCompositionUpdate, 0);
    };

    var onCompositionUpdate = function() {
        if (!inCompostion) return;
        host.onCompositionUpdate(text.value);
    };

    var onCompositionEnd = function() {
        inCompostion = false;
        host.onCompositionEnd();
        setTimeout(function () {
            sendText();
        }, 0);
    };

    var onCopy = function(e) {
        copied = true;
        var copyText = host.getCopyText();
        if(copyText)
            text.value = copyText;
        else
            e.preventDefault();
        text.select();
        setTimeout(function () {
            sendText();
        }, 0);
        
    };

    var onCut = function(e) {
        copied = true;
        var copyText = host.getCopyText();
        if(copyText) {
            text.value = copyText;
            host.onCut();
        } else
            e.preventDefault();
        text.select();
        setTimeout(function () {
            sendText();
        }, 0);
        
    };

    event.addCommandKeyListener(text, host.onCommandKey.bind(host));
    event.addListener(text, "keypress", onTextInput);
    if (useragent.isIE) {
        var keytable = { 13:1, 27:1 };
        event.addListener(text, "keyup", function (e) {
            if (inCompostion && (!text.value || keytable[e.keyCode]))
                setTimeout(onCompositionEnd, 0);
            if ((text.value.charCodeAt(0)|0) < 129) {
                return;
            };
            inCompostion ? onCompositionUpdate() : onCompositionStart();
        });
    };
    event.addListener(text, "textInput", onTextInput);
    event.addListener(text, "paste", function(e) {
        // Some browsers support the event.clipboardData API. Use this to get
        // the pasted content which increases speed if pasting a lot of lines.
        if (e.clipboardData && e.clipboardData.getData) {
            sendText(e.clipboardData.getData("text/plain"));
            e.preventDefault();
        } else
        // If a browser doesn't support any of the things above, use the regular
        // method to detect the pasted input.
        {
            onTextInput();
        }
    });
    if (!useragent.isIE) {
        event.addListener(text, "propertychange", onTextInput);
    };

    event.addListener(text, "copy", onCopy);
    event.addListener(text, "cut", onCut);

    event.addListener(text, "compositionstart", onCompositionStart);
    if (useragent.isGecko) {
        event.addListener(text, "text", onCompositionUpdate);
    };
    if (useragent.isWebKit) {
        event.addListener(text, "keyup", onCompositionUpdate);
    };
    event.addListener(text, "compositionend", onCompositionEnd);

    event.addListener(text, "blur", function() {
        host.onBlur();
    });

    event.addListener(text, "focus", function() {
        host.onFocus();
        text.select();
    });

    this.focus = function() {
        host.onFocus();
        text.select();
        text.focus();
    };

    this.blur = function() {
        text.blur();
    };

    this.getElement = function() {
        return text;
    };

    this.onContextMenu = function(mousePos, isEmpty){
        if (mousePos) {
            if(!tempStyle)
                tempStyle = text.style.cssText;
            text.style.cssText = 'position:fixed; z-index:1000;' +
                    'left:' + (mousePos.x - 2) + 'px; top:' + (mousePos.y - 2) + 'px;'

        }
        if (isEmpty)
            text.value='';
    }

    this.onContextMenuClose = function(){
        setTimeout(function () {
            if (tempStyle) {
                text.style.cssText = tempStyle;
                tempStyle = '';
            }
            sendText();
        }, 0);
    }
};

exports.TextInput = TextInput;
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

define('ace/mouse_handler', function(require, exports, module) {

var event = require("pilot/event");

var MouseHandler = function(editor) {
    this.editor = editor;
    event.addListener(editor.container, "mousedown", function(e) {
        editor.focus();
        return event.preventDefault(e);
    });
    event.addListener(editor.container, "selectstart", function(e) {
        return event.preventDefault(e);
    });
    
    var mouseTarget = editor.renderer.getMouseEventTarget();
    event.addListener(mouseTarget, "mousedown", this.onMouseDown.bind(this));
    event.addMultiMouseDownListener(mouseTarget, 0, 2, 500, this.onMouseDoubleClick.bind(this));
    event.addMultiMouseDownListener(mouseTarget, 0, 3, 600, this.onMouseTripleClick.bind(this));
    event.addMouseWheelListener(mouseTarget, this.onMouseWheel.bind(this));
};

(function() {

    this.$scrollSpeed = 1;
    this.setScrollSpeed = function(speed) {
        this.$scrollSpeed = speed;
    };
    
    this.getScrollSpeed = function() {
        return this.$scrollSpeed;
    };
    
    this.onMouseDown = function(e) {
        var pageX = event.getDocumentX(e);
        var pageY = event.getDocumentY(e);
        var editor = this.editor;
    
        var pos = editor.renderer.screenToTextCoordinates(pageX, pageY);
        pos.row = Math.max(0, Math.min(pos.row, editor.session.getLength()-1));
    
        var button = event.getButton(e)
        if (button != 0) {
            var isEmpty = editor.selection.isEmpty()
            if (isEmpty) {
                editor.moveCursorToPosition(pos);
            }
            if(button == 2) {
                editor.textInput.onContextMenu({x: pageX, y: pageY}, isEmpty);
                event.capture(editor.container, function(){}, editor.textInput.onContextMenuClose);
            }
            return;
        }
    
        if (e.shiftKey)
            editor.selection.selectToPosition(pos)
        else {
            editor.moveCursorToPosition(pos);
            if (!editor.$clickSelection)
                editor.selection.clearSelection(pos.row, pos.column);
        }
    
        editor.renderer.scrollCursorIntoView();
    
        var self = this;
        var mousePageX, mousePageY;
    
        var onMouseSelection = function(e) {
            mousePageX = event.getDocumentX(e);
            mousePageY = event.getDocumentY(e);
        };
    
        var onMouseSelectionEnd = function() {
            clearInterval(timerId);
            self.$clickSelection = null;
        };
    
        var onSelectionInterval = function() {
            if (mousePageX === undefined || mousePageY === undefined)
                return;
    
            var cursor = editor.renderer.screenToTextCoordinates(mousePageX, mousePageY);
            cursor.row = Math.max(0, Math.min(cursor.row, editor.session.getLength()-1));
    
            if (self.$clickSelection) {
                if (self.$clickSelection.contains(cursor.row, cursor.column)) {
                    self.selection.setSelectionRange(self.$clickSelection);
                } else {
                    if (self.$clickSelection.compare(cursor.row, cursor.column) == -1) {
                        var anchor = self.$clickSelection.end;
                    } else {
                        var anchor = self.$clickSelection.start;
                    }
                    editor.selection.setSelectionAnchor(anchor.row, anchor.column);
                    editor.selection.selectToPosition(cursor);
                }
            }
            else {
                editor.selection.selectToPosition(cursor);
            }
    
            editor.renderer.scrollCursorIntoView();
        };
    
        event.capture(editor.container, onMouseSelection, onMouseSelectionEnd);
        var timerId = setInterval(onSelectionInterval, 20);
    
        return event.preventDefault(e);
    };
    
    this.onMouseDoubleClick = function(e) {
        this.editor.selection.selectWord();
        this.$clickSelection = this.editor.getSelectionRange();
    };
    
    this.onMouseTripleClick = function(e) {
        this.editor.selection.selectLine();
        this.$clickSelection = this.editor.getSelectionRange();
    };
    
    this.onMouseWheel = function(e) {
        var speed = this.$scrollSpeed * 2;
    
        this.editor.renderer.scrollBy(e.wheelX * speed, e.wheelY * speed);
        return event.preventDefault(e);
    };


}).call(MouseHandler.prototype);

exports.MouseHandler = MouseHandler;
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
 *      Julian Viereck <julian.viereck@gmail.com>
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

define('ace/keyboard/keybinding', function(require, exports, module) {

var useragent = require("pilot/useragent");
var keyUtil  = require("pilot/keys");
var event = require("pilot/event");
var settings  = require("pilot/settings").settings;
var HashHandler = require("ace/keyboard/hash_handler").HashHandler;
var default_mac = require("ace/keyboard/keybinding/default_mac").bindings;
var default_win = require("ace/keyboard/keybinding/default_win").bindings;
var canon = require("pilot/canon");
require("ace/commands/default_commands");

var KeyBinding = function(editor, config) {
    this.$editor = editor;
    this.$data = { };
    this.$keyboardHandler = null;
    this.$defaulKeyboardHandler = new HashHandler(config || (useragent.isMac
        ? default_mac
        : default_win));
};

(function() {
    this.setKeyboardHandler = function(keyboardHandler) {
        if (this.$keyboardHandler != keyboardHandler) {
            this.$data = { };
            this.$keyboardHandler = keyboardHandler;
        }
    };

    this.getKeyboardHandler = function() {
        return this.$keyboardHandler;
    };

    this.$callKeyboardHandler = function (e, hashId, keyOrText, keyCode) {
        var toExecute;
        if (this.$keyboardHandler) {
            toExecute =
                this.$keyboardHandler.handleKeyboard(this.$data, hashId, keyOrText, keyCode, e);
        }

        // If there is nothing to execute yet, then use the default keymapping.
        if (!toExecute || !toExecute.command) {
            toExecute = this.$defaulKeyboardHandler.
                handleKeyboard(this.$data, hashId, keyOrText, keyCode, e);
        }

        if (toExecute) {
            var success = canon.exec(toExecute.command,
                                        {editor: this.$editor}, toExecute.args);
            if (success) {
                return event.stopEvent(e);
            }
        }
    };

    this.onCommandKey = function(e, hashId, keyCode) {
        key = (keyUtil[keyCode] ||
                String.fromCharCode(keyCode)).toLowerCase();

        this.$callKeyboardHandler(e, hashId, key, keyCode);
    };

    this.onTextInput = function(text) {
        this.$callKeyboardHandler({}, 0, text, 0);
    }

}).call(KeyBinding.prototype);

exports.KeyBinding = KeyBinding;
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
 * The Original Code is Mozilla Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Fabian Jakobs <fabian AT ajax DOT org>
 *   Julian Viereck (julian.viereck@gmail.com)
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

define('ace/keyboard/hash_handler', function(require, exports, module) {

var keyUtil  = require("pilot/keys");

function HashHandler(config) {
    this.setConfig(config);
}

(function() {
    function splitSafe(s, separator, limit, bLowerCase) {
        return (bLowerCase && s.toLowerCase() || s)
            .replace(/(?:^\s+|\n|\s+$)/g, "")
            .split(new RegExp("[\\s ]*" + separator + "[\\s ]*", "g"), limit || 999);
    }

    function parseKeys(keys, val, ret) {
        var key,
            hashId = 0,
            parts  = splitSafe(keys, "\\-", null, true),
            i      = 0,
            l      = parts.length;

        for (; i < l; ++i) {
            if (keyUtil.KEY_MODS[parts[i]])
                hashId = hashId | keyUtil.KEY_MODS[parts[i]];
            else
                key = parts[i] || "-"; //when empty, the splitSafe removed a '-'
        }

        (ret[hashId] || (ret[hashId] = {}))[key] = val;
        return ret;
    }

    function objectReverse(obj, keySplit) {
        var i, j, l, key,
            ret = {};
        for (i in obj) {
            key = obj[i];
            if (keySplit && typeof key == "string") {
                key = key.split(keySplit);
                for (j = 0, l = key.length; j < l; ++j)
                    parseKeys.call(this, key[j], i, ret);
            }
            else {
                parseKeys.call(this, key, i, ret);
            }
        }
        return ret;
    }

    this.setConfig = function(config) {
        this.$config = config;
        if (typeof this.$config.reverse == "undefined")
            this.$config.reverse = objectReverse.call(this, this.$config, "|");
    };

    /**
     * This function is called by keyBinding.
     */
    this.handleKeyboard = function(data, hashId, textOrKey, keyCode) {
        // Figure out if a commandKey was pressed or just some text was insert.
        if (hashId != 0 || keyCode != 0) {
            return {
                command: (this.$config.reverse[hashId] || {})[textOrKey]
            }
        } else {
            return {
                command: "inserttext",
                args: {
                    text: textOrKey
                }
            }
        }
    }
}).call(HashHandler.prototype)

exports.HashHandler = HashHandler;
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

define('ace/keyboard/keybinding/default_mac', function(require, exports, module) {

exports.bindings = {
    "selectall": "Command-A",
    "removeline": "Command-D",
    "gotoline": "Command-L",
    "togglecomment": "Command-7",
    "findnext": "Command-K",
    "findprevious": "Command-Shift-K",
    "find": "Command-F",
    "replace": "Command-R",
    "undo": "Command-Z",
    "redo": "Command-Shift-Z|Command-Y",
    "overwrite": "Insert",
    "copylinesup": "Command-Option-Up",
    "movelinesup": "Option-Up",
    "selecttostart": "Command-Shift-Up",
    "gotostart": "Command-Home|Command-Up",
    "selectup": "Shift-Up",
    "golineup": "Up",
    "copylinesdown": "Command-Option-Down",
    "movelinesdown": "Option-Down",
    "selecttoend": "Command-Shift-Down",
    "gotoend": "Command-End|Command-Down",
    "selectdown": "Shift-Down",
    "golinedown": "Down",
    "selectwordleft": "Option-Shift-Left",
    "gotowordleft": "Option-Left",
    "selecttolinestart": "Command-Shift-Left",
    "gotolinestart": "Command-Left|Home",
    "selectleft": "Shift-Left",
    "gotoleft": "Left",
    "selectwordright": "Option-Shift-Right",
    "gotowordright": "Option-Right",
    "selecttolineend": "Command-Shift-Right",
    "gotolineend": "Command-Right|End",
    "selectright": "Shift-Right",
    "gotoright": "Right",
    "selectpagedown": "Shift-PageDown",
    "pagedown": "PageDown",
    "selectpageup": "Shift-PageUp",
    "pageup": "PageUp",
    "selectlinestart": "Shift-Home",
    "selectlineend": "Shift-End",
    "del": "Delete",
    "backspace": "Ctrl-Backspace|Command-Backspace|Option-Backspace|Backspace",
    "outdent": "Shift-Tab",
    "indent": "Tab"
};

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

define('ace/keyboard/keybinding/default_win', function(require, exports, module) {

exports.bindings = {
    "selectall": "Ctrl-A",
    "removeline": "Ctrl-D",
    "gotoline": "Ctrl-L",
    "togglecomment": "Ctrl-7",
    "findnext": "Ctrl-K",
    "findprevious": "Ctrl-Shift-K",
    "find": "Ctrl-F",
    "replace": "Ctrl-R",
    "undo": "Ctrl-Z",
    "redo": "Ctrl-Shift-Z|Ctrl-Y",
    "overwrite": "Insert",
    "copylinesup": "Ctrl-Alt-Up",
    "movelinesup": "Alt-Up",
    "selecttostart": "Alt-Shift-Up",
    "gotostart": "Ctrl-Home|Ctrl-Up",
    "selectup": "Shift-Up",
    "golineup": "Up",
    "copylinesdown": "Ctrl-Alt-Down",
    "movelinesdown": "Alt-Down",
    "selecttoend": "Alt-Shift-Down",
    "gotoend": "Ctrl-End|Ctrl-Down",
    "selectdown": "Shift-Down",
    "golinedown": "Down",
    "selectwordleft": "Ctrl-Shift-Left",
    "gotowordleft": "Ctrl-Left",
    "selecttolinestart": "Alt-Shift-Left",
    "gotolinestart": "Alt-Left|Home",
    "selectleft": "Shift-Left",
    "gotoleft": "Left",
    "selectwordright": "Ctrl-Shift-Right",
    "gotowordright": "Ctrl-Right",
    "selecttolineend": "Alt-Shift-Right",
    "gotolineend": "Alt-Right|End",
    "selectright": "Shift-Right",
    "gotoright": "Right",
    "selectpagedown": "Shift-PageDown",
    "pagedown": "PageDown",
    "selectpageup": "Shift-PageUp",
    "pageup": "PageUp",
    "selectlinestart": "Shift-Home",
    "selectlineend": "Shift-End",
    "del": "Delete",
    "backspace": "Backspace",
    "outdent": "Shift-Tab",
    "indent": "Tab"
};

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
 *      Julian Viereck <julian.viereck@gmail.com>
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

define('ace/commands/default_commands', function(require, exports, module) {

var lang = require("pilot/lang");
var canon = require("pilot/canon");

canon.addCommand({
    name: "null",
    exec: function(env, args, request) {  }
});

canon.addCommand({
    name: "selectall",
    exec: function(env, args, request) { env.editor.getSelection().selectAll(); }
});
canon.addCommand({
    name: "removeline",
    exec: function(env, args, request) { env.editor.removeLines(); }
});
canon.addCommand({
    name: "gotoline",
    exec: function(env, args, request) {
        var line = parseInt(prompt("Enter line number:"));
        if (!isNaN(line)) {
            env.editor.gotoLine(line);
        }
    }
});
canon.addCommand({
    name: "togglecomment",
    exec: function(env, args, request) { env.editor.toggleCommentLines(); }
});
canon.addCommand({
    name: "findnext",
    exec: function(env, args, request) { env.editor.findNext(); }
});
canon.addCommand({
    name: "findprevious",
    exec: function(env, args, request) { env.editor.findPrevious(); }
});
canon.addCommand({
    name: "find",
    exec: function(env, args, request) {
        var needle = prompt("Find:");
        env.editor.find(needle);
    }
});
canon.addCommand({
    name: "undo",
    exec: function(env, args, request) { env.editor.undo(); }
});
canon.addCommand({
    name: "redo",
    exec: function(env, args, request) { env.editor.redo(); }
});
canon.addCommand({
    name: "redo",
    exec: function(env, args, request) { env.editor.redo(); }
});
canon.addCommand({
    name: "overwrite",
    exec: function(env, args, request) { env.editor.toggleOverwrite(); }
});
canon.addCommand({
    name: "copylinesup",
    exec: function(env, args, request) { env.editor.copyLinesUp(); }
});
canon.addCommand({
    name: "movelinesup",
    exec: function(env, args, request) { env.editor.moveLinesUp(); }
});
canon.addCommand({
    name: "selecttostart",
    exec: function(env, args, request) { env.editor.getSelection().selectFileStart(); }
});
canon.addCommand({
    name: "gotostart",
    exec: function(env, args, request) { env.editor.navigateFileStart(); }
});
canon.addCommand({
    name: "selectup",
    exec: function(env, args, request) { env.editor.getSelection().selectUp(); }
});
canon.addCommand({
    name: "golineup",
    exec: function(env, args, request) { env.editor.navigateUp(args.times); }
});
canon.addCommand({
    name: "copylinesdown",
    exec: function(env, args, request) { env.editor.copyLinesDown(); }
});
canon.addCommand({
    name: "movelinesdown",
    exec: function(env, args, request) { env.editor.moveLinesDown(); }
});
canon.addCommand({
    name: "selecttoend",
    exec: function(env, args, request) { env.editor.getSelection().selectFileEnd(); }
});
canon.addCommand({
    name: "gotoend",
    exec: function(env, args, request) { env.editor.navigateFileEnd(); }
});
canon.addCommand({
    name: "selectdown",
    exec: function(env, args, request) { env.editor.getSelection().selectDown(); }
});
canon.addCommand({
    name: "golinedown",
    exec: function(env, args, request) { env.editor.navigateDown(args.times); }
});
canon.addCommand({
    name: "selectwordleft",
    exec: function(env, args, request) { env.editor.getSelection().selectWordLeft(); }
});
canon.addCommand({
    name: "gotowordleft",
    exec: function(env, args, request) { env.editor.navigateWordLeft(); }
});
canon.addCommand({
    name: "selecttolinestart",
    exec: function(env, args, request) { env.editor.getSelection().selectLineStart(); }
});
canon.addCommand({
    name: "gotolinestart",
    exec: function(env, args, request) { env.editor.navigateLineStart(); }
});
canon.addCommand({
    name: "selectleft",
    exec: function(env, args, request) { env.editor.getSelection().selectLeft(); }
});
canon.addCommand({
    name: "gotoleft",
    exec: function(env, args, request) { env.editor.navigateLeft(args.times); }
});
canon.addCommand({
    name: "selectwordright",
    exec: function(env, args, request) { env.editor.getSelection().selectWordRight(); }
});
canon.addCommand({
    name: "gotowordright",
    exec: function(env, args, request) { env.editor.navigateWordRight(); }
});
canon.addCommand({
    name: "selecttolineend",
    exec: function(env, args, request) { env.editor.getSelection().selectLineEnd(); }
});
canon.addCommand({
    name: "gotolineend",
    exec: function(env, args, request) { env.editor.navigateLineEnd(); }
});
canon.addCommand({
    name: "selectright",
    exec: function(env, args, request) { env.editor.getSelection().selectRight(); }
});
canon.addCommand({
    name: "gotoright",
    exec: function(env, args, request) { env.editor.navigateRight(args.times); }
});
canon.addCommand({
    name: "selectpagedown",
    exec: function(env, args, request) { env.editor.selectPageDown(); }
});
canon.addCommand({
    name: "pagedown",
    exec: function(env, args, request) { env.editor.scrollPageDown(); }
});
canon.addCommand({
    name: "gotopagedown",
    exec: function(env, args, request) { env.editor.gotoPageDown(); }
});
canon.addCommand({
    name: "selectpageup",
    exec: function(env, args, request) { env.editor.selectPageUp(); }
});
canon.addCommand({
    name: "pageup",
    exec: function(env, args, request) { env.editor.scrollPageUp(); }
});
canon.addCommand({
    name: "gotopageup",
    exec: function(env, args, request) { env.editor.gotoPageUp(); }
});
canon.addCommand({
    name: "selectlinestart",
    exec: function(env, args, request) { env.editor.getSelection().selectLineStart(); }
});
canon.addCommand({
    name: "gotolinestart",
    exec: function(env, args, request) { env.editor.navigateLineStart(); }
});
canon.addCommand({
    name: "selectlineend",
    exec: function(env, args, request) { env.editor.getSelection().selectLineEnd(); }
});
canon.addCommand({
    name: "gotolineend",
    exec: function(env, args, request) { env.editor.navigateLineEnd(); }
});
canon.addCommand({
    name: "del",
    exec: function(env, args, request) { env.editor.removeRight(); }
});
canon.addCommand({
    name: "backspace",
    exec: function(env, args, request) { env.editor.removeLeft(); }
});
canon.addCommand({
    name: "outdent",
    exec: function(env, args, request) { env.editor.blockOutdent(); }
});
canon.addCommand({
    name: "indent",
    exec: function(env, args, request) { env.editor.indent(); }
});
canon.addCommand({
    name: "inserttext",
    exec: function(env, args, request) {
        env.editor.insert(lang.stringRepeat(args.text  || "",
                                            args.times || 1));
    }
});

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

define('ace/edit_session', function(require, exports, module) {

var oop = require("pilot/oop");
var lang = require("pilot/lang");
var EventEmitter = require("pilot/event_emitter").EventEmitter;
var Selection = require("ace/selection").Selection;
var TextMode = require("ace/mode/text").Mode;
var Range = require("ace/range").Range;
var Document = require("ace/document").Document;

var NO_CHANGE_DELTAS = {};

var EditSession = function(text, mode) {
    this.$modified = true;
    this.selection = new Selection(this);
    this.$breakpoints = [];
    this.$wrapData = [];
    this.listeners = [];

    if (text instanceof Document) {
        this.setDocument(text);
    } else {
        this.setDocument(new Document(text));
    }

    if (mode)
        this.setMode(mode);
};


(function() {

    oop.implement(this, EventEmitter);

    this.setDocument = function(doc) {
        if (this.doc)
            throw new Error("Document is already set");

        this.doc = doc;
        doc.on("change", this.onChange.bind(this));
    };

    this.getDocument = function() {
        return this.doc;
    };

    this.onChange = function(e) {
        var delta = e.data;
        this.$modified = true;
        if (!this.$fromUndo && this.$undoManager) {
            this.$deltas.push(delta);
            this.$informUndoManager.schedule();
        }

        this.$updateWrapDataOnChange(e);
        this._dispatchEvent("change", e);
    };

    this.setValue = function(text) {
      this.doc.setValue(text);
      this.$deltas = [];
    };

    this.getValue =
    this.toString = function() {
        return this.doc.getValue();
    };

    this.getSelection = function() {
        return this.selection;
    };

    this.setUndoManager = function(undoManager) {
        this.$undoManager = undoManager;
        this.$deltas = [];

        if (this.$informUndoManager) {
            this.$informUndoManager.cancel();
        }

        if (undoManager) {
            var self = this;
            this.$informUndoManager = lang.deferredCall(function() {
                if (self.$deltas.length > 0)
                    undoManager.execute({
                        action : "aceupdate",
                        args   : [self.$deltas, self]
                    });
                self.$deltas = [];
            });
        }
    };

    this.$defaultUndoManager = {
        undo: function() {},
        redo: function() {}
    };

    this.getUndoManager = function() {
        return this.$undoManager || this.$defaultUndoManager;
    },

    this.getTabString = function() {
        if (this.getUseSoftTabs()) {
            return lang.stringRepeat(" ", this.getTabSize());
        } else {
            return "\t";
        }
    };

    this.$useSoftTabs = true;
    this.setUseSoftTabs = function(useSoftTabs) {
        if (this.$useSoftTabs === useSoftTabs) return;

        this.$useSoftTabs = useSoftTabs;
    };

    this.getUseSoftTabs = function() {
        return this.$useSoftTabs;
    };

    this.$tabSize = 4;
    this.setTabSize = function(tabSize) {
        if (isNaN(tabSize) || this.$tabSize === tabSize) return;

        this.$modified = true;
        this.$tabSize = tabSize;
        this._dispatchEvent("changeTabSize");
    };

    this.getTabSize = function() {
        return this.$tabSize;
    };

    this.isTabStop = function(position) {
        return this.$useSoftTabs && (position.column % this.$tabSize == 0);
    };

    this.getBreakpoints = function() {
        return this.$breakpoints;
    };

    this.setBreakpoints = function(rows) {
        this.$breakpoints = [];
        for (var i=0; i<rows.length; i++) {
            this.$breakpoints[rows[i]] = true;
        }
        this._dispatchEvent("changeBreakpoint", {});
    };

    this.clearBreakpoints = function() {
        this.$breakpoints = [];
        this._dispatchEvent("changeBreakpoint", {});
    };

    this.setBreakpoint = function(row) {
        this.$breakpoints[row] = true;
        this._dispatchEvent("changeBreakpoint", {});
    };

    this.clearBreakpoint = function(row) {
        delete this.$breakpoints[row];
        this._dispatchEvent("changeBreakpoint", {});
    };

    this.getBreakpoints = function() {
        return this.$breakpoints;
    };

    /**
     * Error:
     *  {
     *    row: 12,
     *    column: 2, //can be undefined
     *    text: "Missing argument",
     *    type: "error" // or "warning" or "info"
     *  }
     */
    this.setAnnotations = function(annotations) {
        this.$annotations = {};
        for (var i=0; i<annotations.length; i++) {
            var annotation = annotations[i];
            var row = annotation.row;
            if (this.$annotations[row])
                this.$annotations[row].push(annotation);
            else
                this.$annotations[row] = [annotation];
        }
        this._dispatchEvent("changeAnnotation", {});
    };

    this.getAnnotations = function() {
        return this.$annotations;
    };

    this.clearAnnotations = function() {
        this.$annotations = {};
        this._dispatchEvent("changeAnnotation", {});
    };

    this.$detectNewLine = function(text) {
        var match = text.match(/^.*?(\r?\n)/m);
        if (match) {
            this.$autoNewLine = match[1];
        } else {
            this.$autoNewLine = "\n";
        }
    };

    this.tokenRe = /^[\w\d]+/g;
    this.nonTokenRe = /^(?:[^\w\d|[\u3040-\u309F]|[\u30A0-\u30FF]|[\u4E00-\u9FFF\uF900-\uFAFF\u3400-\u4DBF])+/g;

    this.getWordRange = function(row, column) {
        var line = this.getLine(row);

        var inToken = false;
        if (column > 0) {
            inToken = !!line.charAt(column - 1).match(this.tokenRe);
        }

        if (!inToken) {
            inToken = !!line.charAt(column).match(this.tokenRe);
        }

        var re = inToken ? this.tokenRe : this.nonTokenRe;

        var start = column;
        if (start > 0) {
            do {
                start--;
            }
            while (start >= 0 && line.charAt(start).match(re));
            start++;
        }

        var end = column;
        while (end < line.length && line.charAt(end).match(re)) {
            end++;
        }

        return new Range(row, start, row, end);
    };

    this.setNewLineMode = function(newLineMode) {
        this.doc.setNewLineMode(newLineMode);
    };

    this.getNewLineMode = function() {
        return this.doc.getNewLineMode();
    };

    this.$mode = null;
    this.setMode = function(mode) {
        if (this.$mode === mode) return;

        if (this.$worker)
            this.$worker.terminate();

        if (window.Worker)
            this.$worker = mode.createWorker(this);
        else 
            this.$worker = null;

        this.$mode = mode;
        this._dispatchEvent("changeMode");
    };

    this.getMode = function() {
        if (!this.$mode) {
            this.$mode = new TextMode();
        }
        return this.$mode;
    };

    this.$scrollTop = 0;
    this.setScrollTopRow = function(scrollTopRow) {
        if (this.$scrollTop === scrollTopRow) return;

        this.$scrollTop = scrollTopRow;
        this._dispatchEvent("changeScrollTop");
    };

    this.getScrollTopRow = function() {
        return this.$scrollTop;
    };

    this.getWidth = function() {
        this.$computeWidth();
        return this.width;
    };

    this.getScreenWidth = function() {
        this.$computeWidth();
        return this.screenWidth;
    };

    this.$computeWidth = function(force) {
        if (this.$modified || force) {
            this.$modified = false;

            var lines = this.doc.getAllLines();
            var longestLine = 0;
            var longestScreenLine = 0;
            var tabSize = this.getTabSize();

            for ( var i = 0; i < lines.length; i++) {
                var len = lines[i].length;
                longestLine = Math.max(longestLine, len);

                lines[i].replace(/\t/g, function(m) {
                    len += tabSize-1;
                    return m;
                });
                longestScreenLine = Math.max(longestScreenLine, len);
            }
            this.width = longestLine;

            if (this.$useWrapMode) {
                this.screenWidth = this.$wrapLimit;
            } else {
                this.screenWidth = longestScreenLine;
            }
        }
    };

    /**
     * Get a verbatim copy of the given line as it is in the document
     */
    this.getLine = function(row) {
        return this.doc.getLine(row);
    };

    /**
     * Get a line as it is displayed on screen. Tabs are replaced by spaces.
     */
    this.getDisplayLine = function(row) {
        var tab = new Array(this.getTabSize()+1).join(" ");
        return this.doc.getLine(row).replace(/\t/g, tab);
    };

    this.getLines = function(firstRow, lastRow) {
        return this.doc.getLines(firstRow, lastRow);
    };

    this.getLength = function() {
        return this.doc.getLength();
    };

    this.getTextRange = function(range) {
        return this.doc.getTextRange(range);
    };

    this.findMatchingBracket = function(position) {
        if (position.column == 0) return null;

        var charBeforeCursor = this.getLine(position.row).charAt(position.column-1);
        if (charBeforeCursor == "") return null;

        var match = charBeforeCursor.match(/([\(\[\{])|([\)\]\}])/);
        if (!match) {
            return null;
        }

        if (match[1]) {
            return this.$findClosingBracket(match[1], position);
        } else {
            return this.$findOpeningBracket(match[2], position);
        }
    };

    this.$brackets = {
        ")": "(",
        "(": ")",
        "]": "[",
        "[": "]",
        "{": "}",
        "}": "{"
    };

    this.$findOpeningBracket = function(bracket, position) {
        var openBracket = this.$brackets[bracket];

        var column = position.column - 2;
        var row = position.row;
        var depth = 1;

        var line = this.getLine(row);

        while (true) {
            while(column >= 0) {
                var ch = line.charAt(column);
                if (ch == openBracket) {
                    depth -= 1;
                    if (depth == 0) {
                        return {row: row, column: column};
                    }
                }
                else if (ch == bracket) {
                    depth +=1;
                }
                column -= 1;
            }
            row -=1;
            if (row < 0) break;

            var line = this.getLine(row);
            var column = line.length-1;
        }
        return null;
    };

    this.$findClosingBracket = function(bracket, position) {
        var closingBracket = this.$brackets[bracket];

        var column = position.column;
        var row = position.row;
        var depth = 1;

        var line = this.getLine(row);
        var lineCount = this.getLength();

        while (true) {
            while(column < line.length) {
                var ch = line.charAt(column);
                if (ch == closingBracket) {
                    depth -= 1;
                    if (depth == 0) {
                        return {row: row, column: column};
                    }
                }
                else if (ch == bracket) {
                    depth +=1;
                }
                column += 1;
            }
            row +=1;
            if (row >= lineCount) break;

            var line = this.getLine(row);
            var column = 0;
        }
        return null;
    };

    this.insert = function(position, text) {
        return this.doc.insert(position, text);
    };

    /**
     * @param rows Array[Integer] sorted list of rows
     */
    this.multiRowInsert = function(rows, column, text) {
        for (var i=rows.length-1; i>=0; i--) {
            var row = rows[i];
            if (row >= this.doc.getLength())
                continue;

            var diff = column - this.doc.getLine(row).length;
            if ( diff > 0) {
                var padded = lang.stringRepeat(" ", diff) + text;
                var offset = -diff;
            }
            else {
                padded = text;
                offset = 0;
            }

            var end = this.insert({row: row, column: column+offset}, padded);
        }

        return {
            rows: end ? end.row - rows[0] : 0,
            columns: end ? end.column - column : 0
        };
    };

    this.remove = function(range) {
        return this.doc.remove(range);
    };

    this.multiRowRemove = function(rows, range) {
        if (range.start.row !== rows[0])
            throw new TypeError("range must start in the first row!");

        var height = range.end.row - rows[0];
        for (var i=rows.length-1; i>=0; i--) {
            var row = rows[i];
            if (row >= this.doc.getLength())
                continue;

            var end = this.remove(new Range(row, range.start.column, row+height, range.end.column));
        }
    };

    this.undoChanges = function(deltas) {
        if (!deltas.length)
            return;

        this.$fromUndo = true;
        this.doc.revertDeltas(deltas);
        this.$fromUndo = false;

        // update the selection
        var firstDelta = deltas[0];
        var lastDelta = deltas[deltas.length-1];

        this.selection.clearSelection();
        if (firstDelta.action == "insertText" || firstDelta.action == "insertLines")
            this.selection.moveCursorToPosition(firstDelta.range.start);
        if (firstDelta.action == "removeText" || firstDelta.action == "removeLines")
            this.selection.setSelectionRange(Range.fromPoints(lastDelta.range.start, firstDelta.range.end));
    },

    this.redoChanges = function(deltas) {
        if (!deltas.length)
            return;

        this.$fromUndo = true;
        this.doc.applyDeltas(deltas);
        this.$fromUndo = false;

        // update the selection
        var firstDelta = deltas[0];
        var lastDelta = deltas[deltas.length-1];

        this.selection.clearSelection();
        if (firstDelta.action == "insertText" || firstDelta.action == "insertLines")
            this.selection.setSelectionRange(Range.fromPoints(firstDelta.range.start, lastDelta.range.end));
        if (firstDelta.action == "removeText" || firstDelta.action == "removeLines")
            this.selection.moveCursorToPosition(lastDelta.range.start);
    },

    this.replace = function(range, text) {
        return this.doc.replace(range, text);
    };

    this.indentRows = function(startRow, endRow, indentString) {
        indentString = indentString.replace(/\t/g, this.getTabString());
        for (var row=startRow; row<=endRow; row++) {
            this.insert({row: row, column:0}, indentString);
        }
        return indentString.length;
    };

    this.outdentRows = function (range) {
        var rowRange = range.collapseRows();
        var deleteRange = new Range(0, 0, 0, 0);
        var size = this.getTabSize();

        for (var i = rowRange.start.row; i <= rowRange.end.row; ++i) {
            var line = this.getLine(i);

            deleteRange.start.row = i;
            deleteRange.end.row = i;
            for (var j = 0; j < size; ++j)
                if (line.charAt(j) != ' ')
                    break;
            if (j < size && line.charAt(j) == '\t') {
                deleteRange.start.column = j;
                deleteRange.end.column = j + 1;
            } else {
                deleteRange.start.column = 0;
                deleteRange.end.column = j;
            }
            if (i == range.start.row)
                range.start.column -= deleteRange.end.column - deleteRange.start.column;
            if (i == range.end.row)
                range.end.column -= deleteRange.end.column - deleteRange.start.column;
            this.remove(deleteRange);
        }
        return range;
    };

    this.moveLinesUp = function(firstRow, lastRow) {
        if (firstRow <= 0) return 0;

        var removed = this.doc.removeLines(firstRow, lastRow);
        this.doc.insertLines(firstRow - 1, removed);
        return -1;
    };

    this.moveLinesDown = function(firstRow, lastRow) {
        if (lastRow >= this.doc.getLength()-1) return 0;

        var removed = this.doc.removeLines(firstRow, lastRow);
        this.doc.insertLines(firstRow+1, removed);
        return 1;
    };

    this.duplicateLines = function(firstRow, lastRow) {
        var firstRow = this.$clipRowToDocument(firstRow);
        var lastRow = this.$clipRowToDocument(lastRow);

        var lines = this.getLines(firstRow, lastRow);
        this.doc.insertLines(firstRow, lines);

        var addedRows = lastRow - firstRow + 1;
        return addedRows;
    };

    this.$clipRowToDocument = function(row) {
        return Math.max(0, Math.min(row, this.doc.getLength()-1));
    };

    // WRAPMODE
    this.$wrapLimit = 80;
    this.$useWrapMode = false;

    this.setUseWrapMode = function(useWrapMode) {
        if (useWrapMode != this.$useWrapMode) {
            this.$useWrapMode = useWrapMode;
            this.$updateWrapData(0, this.getLength() - 1);
            this.$modified = true;
            this._dispatchEvent("changeWrapMode");
        }
    };

    this.getUseWrapMode = function() {
        return this.$useWrapMode;
    };

    this.setWrapLimit = function(wrapLimit) {
        if (wrapLimit != this.$wrapLimit) {
            this.$wrapLimit = wrapLimit;
            this.$updateWrapData(0, this.getLength() - 1);
            this._dispatchEvent("changeWrapMode");
        }
    };

    this.getWrapLimit = function() {
        return this.$wrapLimit;
    };

    this.$updateWrapDataOnChange = function(e) {
        if (!this.$useWrapMode) {
            return;
        }

        var action = e.data.action;
        var firstRow = e.data.range.start.row,
            lastRow = e.data.range.end.row;

        if (action.indexOf("Lines") != -1) {
            if (action == "insertLines") {
                lastRow = firstRow + e.data.lines.length;
            } else {
                firstRow = lastRow - e.data.lines.length;
            }
        }

        if (firstRow != lastRow) {
            var len = lastRow - firstRow;
            if (action.indexOf("remove") != -1) {
                this.$wrapData.splice(firstRow, len);
                lastRow = firstRow;
            } else {
                var args = [firstRow, 0];
                for (var i = 0; i < len; i++) args.push([]);
                this.$wrapData.splice.apply(this.$wrapData, args);
            }
        }

        this.$updateWrapData(firstRow, lastRow);
    };

    this.$updateWrapData = function(firstRow, lastRow) {
        var lines = this.doc.getAllLines();
        var tabSize = this.getTabSize();
        var wrapData = this.$wrapData;
        var wrapLimit = this.$wrapLimit;

        // Remove lines that are no longer there.
        wrapData.splice(lines.length, wrapData.length - lines.length);

        for (var row = firstRow; row <= lastRow; row++) {
            wrapData[row] =
                this.$computeWrapSplits(lines[row], wrapLimit, tabSize);
        }
    };

    // "Tokens"
    var CHAR = 1,
        CHAR_EXT = 2,
        SPACE = 3,
        TAB = 4,
        TAB_SPACE = 5;

    this.$computeWrapSplits = function(textLine, wrapLimit, tabSize) {
        textLine = textLine.trimRight();
        if (textLine.length == 0) {
            return [];
        }

        var tabSize = this.getTabSize();
        var splits = [];
        var tokens = this.$getDisplayTokens(textLine);
        var displayLength = tokens.length;
        var lastSplit = 0, lastDocSplit = 0;

        function addSplit(screenPos) {
            var displayed = tokens.slice(lastSplit, screenPos);

            // The document size is the current size - the extra width for tabs
            // and multipleWidth characters.
            var len = displayed.length;
            displayed.join("").
                // Get all the tabs.
                replace(/4/g, function(m) {
                    len -= tabSize - 1;
                }).
                // Get all the multipleWidth characters.
                replace(/2/g, function(m) {
                    len -= 1;
                });

            lastDocSplit += len;
            splits.push(lastDocSplit);
            lastSplit = screenPos;
        }

        while (displayLength - lastSplit > wrapLimit) {
            // This is, where the split should be.
            var split = lastSplit + wrapLimit;

            // If there is a space or tab at this split position.
            if (tokens[split] >= SPACE) {
                // Include all following spaces + tabs in this split as well.
                while (tokens[split] >= SPACE)  {
                    split ++;
                }
                addSplit(split);
            } else {
                // Search for the first non space/tab token.
                for (split; split != lastSplit - 1; split--) {
                    if (tokens[split] >= SPACE) {
                        split++;
                        break;
                    }
                }
                // If we found one, then add the split.
                if (split > lastSplit) {
                    addSplit(split);
                }
                // No space or tab around? Well, force a split then.
                else {
                    addSplit(lastSplit + wrapLimit);
                }
            }
        }
        return splits;
    }

    this.$getDisplayTokens = function(str) {
        var arr = [];
        var tabSize = this.getTabSize();

        for (var i = 0; i < str.length; i++) {
			var c = str.charCodeAt(i);
			// Tab
			if (c == 9) {
			    arr.push(TAB);
			    for (var n = 1; n < tabSize; n++) {
			        arr.push(TAB_SPACE);
			    }
			}
			// Space
			else if(c == 32) {
			    arr.push(SPACE);
			}
    		// CJK characters
            else if (
                c >= 0x3040 && c <= 0x309F || // Hiragana
                c >= 0x30A0 && c <= 0x30FF || // Katakana
                c >= 0x4E00 && c <= 0x9FFF || // Single CJK ideographs
                c >= 0xF900 && c <= 0xFAFF ||
                c >= 0x3400 && c <= 0x4DBF
            ) {
                arr.push(CHAR, CHAR_EXT);
            } else {
                arr.push(CHAR);
            }
        }
        return arr;
    }

    /**
     * Calculates the width of the a string on the screen while assuming that
     * the string starts at the first column on the screen.
     *
     * @param string str String to calculate the screen width of
     * @return int number of columns for str on screen.
     */
    this.$getStringScreenWidth = function(str) {
        var screenColumn = 0;
        var tabSize = this.getTabSize();
		
		for (var i=0; i<str.length; i++) {
			var c = str.charCodeAt(i);
			// tab
			if (c == 9) {
				screenColumn += tabSize;
			}
    		// CJK characters
            else if (
                c >= 0x3040 && c <= 0x309F || // Hiragana
                c >= 0x30A0 && c <= 0x30FF || // Katakana
                c >= 0x4E00 && c <= 0x9FFF || // Single CJK ideographs
                c >= 0xF900 && c <= 0xFAFF ||
                c >= 0x3400 && c <= 0x4DBF
            ) {
            	screenColumn += 2;
			} else {
				screenColumn += 1;
			}
		}
		
		return screenColumn;
    }

    this.getRowHeight = function(config, row) {
        var rows;
        if (!this.$useWrapMode || !this.$wrapData[row]) {
            rows = 1;
        } else {
            rows = this.$wrapData[row].length + 1;
        }

        return rows * config.lineHeight;
    }

    this.getScreenLastRowColumn = function(screenRow, returnDocPosition) {
        if (!this.$useWrapMode) {
            return this.$getStringScreenWidth(this.getLine(screenRow));
        }

        var rowData = this.$screenToDocumentRow(screenRow);
        var docRow = rowData[0],
            row = rowData[1];

        var start, end;
        if (this.$wrapData[docRow][row]) {
            start = (this.$wrapData[docRow][row - 1] || 0);
            end = this.$wrapData[docRow][row];
            returnDocPosition && end--;
        } else {
            end = this.getLine(docRow).length;
            start = (this.$wrapData[docRow][row - 1] || 0);
        }
        if (!returnDocPosition) {
            return this.$getStringScreenWidth(this.getLine(docRow).substring(start, end));
        } else {
            return end;
        }
    };

    this.getDocumentLastRowColumn = function(docRow, docColumn) {
        if (!this.$useWrapMode) {
            return this.getLine(docRow).length;
        }

        var screenRow = this.documentToScreenRow(docRow, docColumn);
        return this.getScreenLastRowColumn(screenRow, true);
    }

    this.getScreenFirstRowColumn = function(screenRow) {
        if (!this.$useWrapMode) {
            return 0;
        }

        var rowData = this.$screenToDocumentRow(screenRow);
        var docRow = rowData[0],
            row = rowData[1];

        return this.$wrapData[docRow][row - 1] || 0;
    };

    this.getRowSplitData = function(row) {
        if (!this.$useWrapMode) {
            return undefined;
        } else {
            return this.$wrapData[row];
        }
    };

    /**
     *
     * @returns array
     * - array[0]: The documentRow equivalent.
     * - array[1]: The screenRowOffset to the first documentRow on the screen.
     */
    this.$screenToDocumentRow = function(row) {
        if (!this.$useWrapMode) {
            return [row, 0];
        }

        var wrapData = this.$wrapData, linesCount = this.getLength();
        var docRow = 0;
        while (docRow < linesCount && row >= wrapData[docRow].length + 1) {
            row -= wrapData[docRow].length + 1;
            docRow ++;
        }

        return [docRow, row];
    };

    this.screenToDocumentRow = function(screenRow) {
        return this.$screenToDocumentRow(screenRow)[0];
    };

    this.screenToDocumentColumn = function(screenRow, screenColumn) {
        return this.screenToDocumentPosition(screenRow, screenColumn).column;
    };

    this.screenToDocumentPosition = function(row, column) {
        var line;
        var docRow;
        var docColumn;
        var remaining = column;
        var linesCount = this.getLength();
        if (!this.$useWrapMode) {
            docRow = row >= linesCount? linesCount-1 : (row < 0 ? 0 : row);
            row = 0;
            docColumn = 0;
            line = this.getLine(docRow);
        } else {
            var wrapData = this.$wrapData;

			var docRow = 0;
			while (docRow < linesCount && row >= wrapData[docRow].length + 1) {
				row -= wrapData[docRow].length + 1;
				docRow ++;
			}

            if (docRow >= linesCount) {
                docRow = linesCount-1
				row = wrapData[docRow].length;
            }
            docColumn = wrapData[docRow][row - 1] || 0;
            line = this.getLine(docRow).substring(docColumn);
        }

        var tabSize = this.getTabSize();
        for(var i = 0; i < line.length; i++) {
            var c = line.charCodeAt(i);

            if (remaining > 0) {
                docColumn += 1;
                // tab
                if (c == 9) {
                    if (remaining >= tabSize) {
                        remaining -= tabSize;
                    } else {
                        remaining = 0;
                        docColumn -= 1;
                    }
                }
                // CJK characters
                else if (
                    c >= 0x3040 && c <= 0x309F || // Hiragana
                    c >= 0x30A0 && c <= 0x30FF || // Katakana
                    c >= 0x4E00 && c <= 0x9FFF || // Single CJK ideographs
                    c >= 0xF900 && c <= 0xFAFF ||
                    c >= 0x3400 && c <= 0x4DBF
                ) {
                    if (remaining >= 2) {
                        remaining -= 2;
                    } else {
                        remaining = 0;
                        docColumn -= 1;
                    }
                } else {
                    remaining -= 1;
                }
            } else {
                break;
            }
        }

        // Clamp docColumn.
        if (this.$useWrapMode) {
            column = wrapData[docRow][row]
			if (docColumn >= column) {
                // We remove one character at the end such that the docColumn
                // position returned is not associated to the next row on the
                // screen.
                docColumn = column - 1;
            }
        } else if (line) {
             docColumn = Math.min(docColumn, line.length);
        }

        return {
            row: docRow,
            column: docColumn
        };
    };

    this.documentToScreenColumn = function(row, docColumn) {
        return this.documentToScreenPosition(row, docColumn).column;
    };

    /**
     *
     * @return array[2]
     * - array[0]: The number of the row on the screen (aka screenRow)
     * - array[1]: The number of rows from the first docRow on the screen
     *              (aka screenRowOffset);
     */
    this.$documentToScreenRow = function(docRow, docColumn) {
        if (!this.$useWrapMode) {
            return [docRow, 0];
        }

        var wrapData = this.$wrapData;
        var screenRow = 0;

        // Handle special case where the row is outside of the range of lines.
        if (docRow > wrapData.length - 1) {
            return [
                this.getScreenLength(),
                wrapData[wrapData.length - 1].length - 1
            ];
        }

        for (var i = 0; i < docRow; i++) {
            screenRow += wrapData[i].length + 1;
        }

        var screenRowOffset = 0;
        while (docColumn >= wrapData[docRow][screenRowOffset]) {
            screenRow ++;
            screenRowOffset++;
        }

        return [screenRow, screenRowOffset];
    }

    this.documentToScreenRow = function(docRow, docColumn) {
        return this.$documentToScreenRow(docRow, docColumn)[0];
    }

    this.documentToScreenPosition = function(pos, column) {
        var str;
        var tabSize = this.getTabSize();

        // Normalize the passed in arguments.
        var row;
        if (column != null) {
            row = pos;
        } else {
            row = pos.row;
            column = pos.column;
        }

        if (!this.$useWrapMode) {
            str = this.getLine(row).substring(0, column);
            column = this.$getStringScreenWidth(str);
            return {
                row: row,
                column: column
            };
        }
        if (row >= this.getLength()) {
            return {
                row: screenRow,
                column: 0
            };
        }

        var split;
        var wrapRowData = this.$wrapData[row];
        var screenRow, screenRowOffset;
        var screenColumn;
        var rowData = this.$documentToScreenRow(row, column);
        screenRow = rowData[0];
        screenRowOffset = rowData[1];

        str = this.getLine(row).substring(
                wrapRowData[screenRowOffset - 1] || 0,  column);
        screenColumn = this.$getStringScreenWidth(str);

        return {
            row: screenRow,
            column: screenColumn
        };
    };

    this.getScreenLength = function() {
        if (!this.$useWrapMode) {
            return this.getLength();
        }

        var screenRows = 0;
        for (var row = 0; row < this.$wrapData.length; row++) {
            screenRows += this.$wrapData[row].length + 1;
        }
        return screenRows;
    }

}).call(EditSession.prototype);

exports.EditSession = EditSession;
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
 *      Julian Viereck <julian.viereck@gmail.com>
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

define('ace/selection', function(require, exports, module) {

var oop = require("pilot/oop");
var lang = require("pilot/lang");
var EventEmitter = require("pilot/event_emitter").EventEmitter;
var Range = require("ace/range").Range;

var Selection = function(doc) {
    this.doc = doc;

    this.clearSelection();
    this.selectionLead = {
        row: 0,
        column: 0
    };
};

(function() {

    oop.implement(this, EventEmitter);

    this.isEmpty = function() {
        return (!this.selectionAnchor ||
            (this.selectionAnchor.row == this.selectionLead.row &&
             this.selectionAnchor.column == this.selectionLead.column));
    };

    this.isMultiLine = function() {
        if (this.isEmpty()) {
            return false;
        }

        return this.getRange().isMultiLine();
    };

    this.getCursor = function() {
        return this.selectionLead;
    };

    this.setSelectionAnchor = function(row, column) {
        var anchor = this.$clipPositionToDocument(row, column);

        if (!this.selectionAnchor) {
            this.selectionAnchor = anchor;
            this._dispatchEvent("changeSelection", {});
        }
        else if (this.selectionAnchor.row !== anchor.row || this.selectionAnchor.column !== anchor.column) {
            this.selectionAnchor = anchor;
            this._dispatchEvent("changeSelection", {});
        }

    };

    this.getSelectionAnchor = function() {
        if (this.selectionAnchor) {
            return this.$clone(this.selectionAnchor);
        } else {
            return this.$clone(this.selectionLead);
        }
    };

    this.getSelectionLead = function() {
        return this.$clone(this.selectionLead);
    };

    this.shiftSelection = function(columns) {
        if (this.isEmpty()) {
            this.moveCursorTo(this.selectionLead.row, this.selectionLead.column + columns);
            return;
        };

        var anchor = this.getSelectionAnchor();
        var lead = this.getSelectionLead();

        var isBackwards = this.isBackwards();

        if (!isBackwards || anchor.column !== 0)
            this.setSelectionAnchor(anchor.row, anchor.column + columns);

        if (isBackwards || lead.column !== 0) {
            this.$moveSelection(function() {
                this.moveCursorTo(lead.row, lead.column + columns);
            });
        }
    };

    this.isBackwards = function() {
        var anchor = this.selectionAnchor || this.selectionLead;
        var lead = this.selectionLead;
        return (anchor.row > lead.row || (anchor.row == lead.row && anchor.column > lead.column));
    };

    this.getRange = function() {
        var anchor = this.selectionAnchor || this.selectionLead;
        var lead = this.selectionLead;

        if (this.isBackwards()) {
            return Range.fromPoints(lead, anchor);
        }
        else {
            return Range.fromPoints(anchor, lead);
        }
    };

    this.clearSelection = function() {
        if (this.selectionAnchor) {
            this.selectionAnchor = null;
            this._dispatchEvent("changeSelection", {});
        }
    };

    this.selectAll = function() {
        var lastRow = this.doc.getLength() - 1;
        this.setSelectionAnchor(lastRow, this.doc.getLine(lastRow).length);

        if (!this.selectionAnchor) {
            this.selectionAnchor = this.$clone(this.selectionLead);
        }

        var cursor = {row:0, column:0};
        // only dispatch change if the cursor actually changed
        if (cursor.row !== this.selectionLead.row || cursor.column !== this.selectionLead.column) {
            this.selectionLead = cursor;
            this._dispatchEvent("changeSelection", {blockScrolling: true});
        }
    };

    this.setSelectionRange = function(range, reverse) {
        if (reverse) {
            this.setSelectionAnchor(range.end.row, range.end.column);
            this.selectTo(range.start.row, range.start.column);
        } else {
            this.setSelectionAnchor(range.start.row, range.start.column);
            this.selectTo(range.end.row, range.end.column);
        }
        this.$updateDesiredColumn();
    };

    this.$updateDesiredColumn = function() {
        var cursor = this.getCursor();
        if (cursor) {
            this.$desiredColumn = this.doc.documentToScreenColumn(cursor.row, cursor.column);
        }
    };

    this.$moveSelection = function(mover) {
        var changed = false;

        if (!this.selectionAnchor) {
            changed = true;
            this.selectionAnchor = this.$clone(this.selectionLead);
        }

        var cursor = this.$clone(this.selectionLead);
        mover.call(this);

        if (cursor.row !== this.selectionLead.row || cursor.column !== this.selectionLead.column) {
            changed = true;
        }

        if (changed)
            this._dispatchEvent("changeSelection", {});
    };

    this.selectTo = function(row, column) {
        this.$moveSelection(function() {
            this.moveCursorTo(row, column);
        });
    };

    this.selectToPosition = function(pos) {
        this.$moveSelection(function() {
            this.moveCursorToPosition(pos);
        });
    };

    this.selectUp = function() {
        this.$moveSelection(this.moveCursorUp);
    };

    this.selectDown = function() {
        this.$moveSelection(this.moveCursorDown);
    };

    this.selectRight = function() {
        this.$moveSelection(this.moveCursorRight);
    };

    this.selectLeft = function() {
        this.$moveSelection(this.moveCursorLeft);
    };

    this.selectLineStart = function() {
        this.$moveSelection(this.moveCursorLineStart);
    };

    this.selectLineEnd = function() {
        this.$moveSelection(this.moveCursorLineEnd);
    };

    this.selectFileEnd = function() {
        this.$moveSelection(this.moveCursorFileEnd);
    };

    this.selectFileStart = function() {
        this.$moveSelection(this.moveCursorFileStart);
    };

    this.selectWordRight = function() {
        this.$moveSelection(this.moveCursorWordRight);
    };

    this.selectWordLeft = function() {
        this.$moveSelection(this.moveCursorWordLeft);
    };

    this.selectWord = function() {
        var cursor = this.selectionLead;
        var column = cursor.column;
        var range  = this.doc.getWordRange(cursor.row, column);
        this.setSelectionRange(range);

        /*this.setSelectionAnchor(cursor.row, start);
        this.$moveSelection(function() {
            this.moveCursorTo(cursor.row, end);
        });*/
    };

    this.selectLine = function() {
        this.setSelectionAnchor(this.selectionLead.row, 0);
        this.$moveSelection(function() {
            this.moveCursorTo(this.selectionLead.row + 1, 0);
        });
    };

    this.moveCursorUp = function() {
        this.moveCursorBy(-1, 0);
    };

    this.moveCursorDown = function() {
        this.moveCursorBy(1, 0);
    };

    this.moveCursorLeft = function() {
        if (this.selectionLead.column == 0) {
            // cursor is a line (start
            if (this.selectionLead.row > 0) {
                this.moveCursorTo(this.selectionLead.row - 1, this.doc
                        .getLine(this.selectionLead.row - 1).length);
            }
        }
        else {
            var doc = this.doc;
            var tabSize = doc.getTabSize();
            var cursor = this.selectionLead;
            if (doc.isTabStop(cursor) && doc.getLine(cursor.row).slice(cursor.column-tabSize, cursor.column).split(" ").length-1 == tabSize)
                this.moveCursorBy(0, -tabSize);
            else
                this.moveCursorBy(0, -1);
        }
    };

    this.moveCursorRight = function() {
        if (this.selectionLead.column == this.doc.getLine(this.selectionLead.row).length) {
            if (this.selectionLead.row < this.doc.getLength() - 1) {
                this.moveCursorTo(this.selectionLead.row + 1, 0);
            }
        }
        else {
            var doc = this.doc;
            var tabSize = doc.getTabSize();
            var cursor = this.selectionLead;
            if (doc.isTabStop(cursor) && doc.getLine(cursor.row).slice(cursor.column, cursor.column+tabSize).split(" ").length-1 == tabSize)
                this.moveCursorBy(0, tabSize);
            else
                this.moveCursorBy(0, 1);
        }
    };

    this.moveCursorLineStart = function() {
        var row = this.selectionLead.row;
        var column = this.selectionLead.column;
        var screenRow = this.doc.documentToScreenRow(row, column);
        var firstRowColumn = this.doc.getScreenFirstRowColumn(screenRow);
        var beforeCursor = this.doc.getLine(row).slice(firstRowColumn, column);
        var leadingSpace = beforeCursor.match(/^\s*/);
        if (leadingSpace[0].length == 0) {
            var lastRowColumn = this.doc.getDocumentLastRowColumn(row, column);
            leadingSpace = this.doc.getLine(row).
                                substring(firstRowColumn, lastRowColumn).
                                match(/^\s*/);
            this.moveCursorTo(row, firstRowColumn + leadingSpace[0].length);
        } else if (leadingSpace[0].length >= column) {
            this.moveCursorTo(row, firstRowColumn);
        } else {
            this.moveCursorTo(row, firstRowColumn + leadingSpace[0].length);
        }
    };

    this.moveCursorLineEnd = function() {
        var selLead = this.selectionLead;
        this.moveCursorTo(selLead.row,
              this.doc.getDocumentLastRowColumn(selLead.row, selLead.column));
    };

    this.moveCursorFileEnd = function() {
        var row = this.doc.getLength() - 1;
        var column = this.doc.getLine(row).length;
        this.moveCursorTo(row, column);
    };

    this.moveCursorFileStart = function() {
        this.moveCursorTo(0, 0);
    };

    this.moveCursorWordRight = function() {
        var row = this.selectionLead.row;
        var column = this.selectionLead.column;
        var line = this.doc.getLine(row);
        var rightOfCursor = line.substring(column);

        var match;
        this.doc.nonTokenRe.lastIndex = 0;
        this.doc.tokenRe.lastIndex = 0;

        if (column == line.length) {
            this.moveCursorRight();
            return;
        }
        else if (match = this.doc.nonTokenRe.exec(rightOfCursor)) {
            column += this.doc.nonTokenRe.lastIndex;
            this.doc.nonTokenRe.lastIndex = 0;
        }
        else if (match = this.doc.tokenRe.exec(rightOfCursor)) {
            column += this.doc.tokenRe.lastIndex;
            this.doc.tokenRe.lastIndex = 0;
        }

        this.moveCursorTo(row, column);
    };

    this.moveCursorWordLeft = function() {
        var row = this.selectionLead.row;
        var column = this.selectionLead.column;
        var line = this.doc.getLine(row);
        var leftOfCursor = lang.stringReverse(line.substring(0, column));

        var match;
        this.doc.nonTokenRe.lastIndex = 0;
        this.doc.tokenRe.lastIndex = 0;

        if (column == 0) {
            this.moveCursorLeft();
            return;
        }
        else if (match = this.doc.nonTokenRe.exec(leftOfCursor)) {
            column -= this.doc.nonTokenRe.lastIndex;
            this.doc.nonTokenRe.lastIndex = 0;
        }
        else if (match = this.doc.tokenRe.exec(leftOfCursor)) {
            column -= this.doc.tokenRe.lastIndex;
            this.doc.tokenRe.lastIndex = 0;
        }

        this.moveCursorTo(row, column);
    };

    this.moveCursorBy = function(rows, chars) {
        if (this.doc.getUseWrapMode()) {
            var screenPos = this.doc.documentToScreenPosition(
                        this.selectionLead.row, this.selectionLead.column);
            var screenCol =
                (chars == 0 && this.$desiredColumn) || screenPos.column;

            var docPos = this.doc.screenToDocumentPosition(
                        screenPos.row + rows, screenCol);
            this.moveCursorTo(docPos.row, docPos.column + chars, chars == 0);
        } else {
            var docColumn =
                (chars == 0 && this.$desiredColumn) || this.selectionLead.column;
            this.moveCursorTo(
                this.selectionLead.row + rows, docColumn + chars, chars == 0);
        }
    };


    this.moveCursorToPosition = function(position) {
        this.moveCursorTo(position.row, position.column);
    };

    this.moveCursorTo = function(row, column, preventUpdateDesiredColumn) {
        var cursor = this.$clipPositionToDocument(row, column);

        // only dispatch change if the cursor actually changed
        if (cursor.row !== this.selectionLead.row || cursor.column !== this.selectionLead.column) {
            this.selectionLead = cursor;
            !preventUpdateDesiredColumn && this.$updateDesiredColumn(column);
            this._dispatchEvent("changeCursor", { data: this.getCursor() });
        }
    };

    this.$clipPositionToDocument = function(row, column) {
        var pos = {};

        if (row >= this.doc.getLength()) {
            pos.row = Math.max(0, this.doc.getLength() - 1);
            pos.column = this.doc.getLine(pos.row).length;
        }
        else if (row < 0) {
            pos.row = 0;
            pos.column = 0;
        }
        else {
            pos.row = row;
            pos.column = Math.min(this.doc.getLine(pos.row).length,
                    Math.max(0, column));
        }
        return pos;
    };

    this.$clone = function(pos) {
        return {
            row: pos.row,
            column: pos.column
        };
    };

}).call(Selection.prototype);

exports.Selection = Selection;
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

define('ace/range', function(require, exports, module) {

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

define('ace/mode/text', function(require, exports, module) {

var Tokenizer = require("ace/tokenizer").Tokenizer;
var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

var Mode = function() {
    this.$tokenizer = new Tokenizer(new TextHighlightRules().getRules());
};

(function() {

    this.getTokenizer = function() {
        return this.$tokenizer;
    };

    this.toggleCommentLines = function(state, doc, startRow, endRow) {
        return 0;
    };

    this.getNextLineIndent = function(state, line, tab) {
        return "";
    };

    this.checkOutdent = function(state, line, input) {
        return false;
    };

    this.autoOutdent = function(state, doc, row) {
    };

    this.$getIndent = function(line) {
        var match = line.match(/^(\s+)/);
        if (match) {
            return match[1];
        }

        return "";
    };
    
    this.createWorker = function(session) {
        return null;
    };

}).call(Mode.prototype);

exports.Mode = Mode;
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

define('ace/tokenizer', function(require, exports, module) {

var Tokenizer = function(rules) {
    this.rules = rules;

    this.regExps = {};
    for ( var key in this.rules) {
        var state = this.rules[key];
        var ruleRegExps = [];

        for ( var i = 0; i < state.length; i++) {
            ruleRegExps.push(state[i].regex);
        };

        this.regExps[key] = new RegExp("(?:(" + ruleRegExps.join(")|(") + ")|(.))", "g");
    }
};

(function() {

    this.getLineTokens = function(line, startState) {
        var currentState = startState;
        var state = this.rules[currentState];
        var re = this.regExps[currentState];
        re.lastIndex = 0;

        var match, tokens = [];

        var lastIndex = 0;

        var token = {
            type: null,
            value: ""
        };

        while (match = re.exec(line)) {
            var type = "text";
            var value = match[0];

            if (re.lastIndex == lastIndex) { throw new Error("tokenizer error"); }
            lastIndex = re.lastIndex;

            for ( var i = 0; i < state.length; i++) {
                if (match[i + 1]) {
                    if (typeof state[i].token == "function") {
                        type = state[i].token(match[0]);
                    }
                    else {
                        type = state[i].token;
                    }

                    if (state[i].next && state[i].next !== currentState) {
                        currentState = state[i].next;
                        var state = this.rules[currentState];
                        var lastIndex = re.lastIndex;

                        var re = this.regExps[currentState];
                        re.lastIndex = lastIndex;
                    }
                    break;
                }
            };
            
                  
            if (token.type !== type) {
                if (token.type) {
                    tokens.push(token);
                }
                token = {
                    type: type,
                    value: value
                };
            } else {
                token.value += value;
            }
        };

        if (token.type) {
            tokens.push(token);
        }

        return {
            tokens : tokens,
            state : currentState
        };
    };

}).call(Tokenizer.prototype);

exports.Tokenizer = Tokenizer;
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

define('ace/mode/text_highlight_rules', function(require, exports, module) {

var TextHighlightRules = function() {

    // regexp must not have capturing parentheses
    // regexps are ordered -> the first match is used

    this.$rules = {
        "start" : [ {
            token : "text",
            regex : ".+"
        } ]
    };
};

(function() {

    this.addRules = function(rules, prefix) {
        for (var key in rules) {
            var state = rules[key];
            for (var i=0; i<state.length; i++) {
                var rule = state[i];
                if (rule.next) {
                    rule.next = prefix + rule.next;
                } else {
                    rule.next = prefix + key;
                }
            }
            this.$rules[prefix + key] = state;
        }
    };

    this.getRules = function() {
        return this.$rules;
    };

}).call(TextHighlightRules.prototype);

exports.TextHighlightRules = TextHighlightRules;
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

define('ace/document', function(require, exports, module) {

var oop = require("pilot/oop");
var EventEmitter = require("pilot/event_emitter").EventEmitter;
var Range = require("ace/range").Range;

var Document = function(text) {
    this.$lines = [];

    if (Array.isArray(text)) {
        this.insertLines(0, text);
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
        return this.$lines.join(this.getNewLineCharacter());
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
        return this.$lines[row] || "";
    };

    this.getLines = function(firstRow, lastRow) {
        return this.$lines.slice(firstRow, lastRow+1);
    };

    /**
     * Returns all lines in the document as string array. Warning: The caller
     * should not modify this array!
     */
    this.getAllLines = function() {
        return this.$lines;
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

        var newLines = this.$split(text);

        if (this.isNewLine(text)) {
            var end = this.insertNewLine(position);
        }
        else if (newLines.length == 1) {
            var end = this.insertInLine(position, text);
        }
        else {
            var end = this.insertInLine(position, newLines[0]);
            this.insertNewLine(end);
            if (newLines.length > 2)
                this.insertLines(position.row+1, newLines.slice(1, newLines.length-1));

            var end = this.insertInLine({row: position.row + newLines.length - 1, column: 0}, newLines[newLines.length-1]);
        }

        return end;
    };

    this.insertLines = function(row, lines) {
        if (lines.length == 0)
            return {row: row, column: 0};

        var args = [row, 0];
        args.push.apply(args, lines);
        this.$lines.splice.apply(this.$lines, args);

        var range = new Range(row, 0, row + lines.length - 1, 0);
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
                this.removeInLine(firstRow, range.start.column, this.$lines[firstRow].length);
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
        var range = new Range(firstRow, 0, lastRow, this.$lines[lastRow].length);
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
                this.removeLines(range.start.row, range.end.row)
            else if (delta.action == "removeText")
                this.remove(range)
        }
    };

    this.revertDeltas = function(deltas) {
        for (var i=deltas.length-1; i>=0; i--) {
            var delta = deltas[i];
            var range = Range.fromPoints(delta.range.start, delta.range.end);

            if (delta.action == "insertLines")
                this.removeLines(range.start.row, range.end.row)
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

define('ace/search', function(require, exports, module) {

var lang = require("pilot/lang");
var oop = require("pilot/oop");
var Range = require("ace/range").Range;

var Search = function() {
    this.$options = {
        needle: "",
        backwards: false,
        wrap: false,
        caseSensitive: false,
        wholeWord: false,
        scope: Search.ALL,
        regExp: false
    };
};

Search.ALL = 1;
Search.SELECTION = 2;

(function() {

    this.set = function(options) {
        oop.mixin(this.$options, options);
        return this;
    };
    
    this.getOptions = function() {
        return lang.copyObject(this.$options);
    };

    this.find = function(session) {
        if (!this.$options.needle)
            return null;

        if (this.$options.backwards) {
            var iterator = this.$backwardMatchIterator(session);
        } else {
            iterator = this.$forwardMatchIterator(session);
        }

        var firstRange = null;
        iterator.forEach(function(range) {
            firstRange = range;
            return true;
        });

        return firstRange;
    };

    this.findAll = function(session) {
        if (!this.$options.needle)
            return [];

        if (this.$options.backwards) {
            var iterator = this.$backwardMatchIterator(session);
        } else {
            iterator = this.$forwardMatchIterator(session);
        }

        var ranges = [];
        iterator.forEach(function(range) {
            ranges.push(range);
        });

        return ranges;
    };

    this.replace = function(input, replacement) {
        var re = this.$assembleRegExp();
        var match = re.exec(input);
        if (match && match[0].length == input.length) {
            if (this.$options.regExp) {
                return input.replace(re, replacement);
            } else {
                return replacement;
            }
        } else {
            return null;
        }
    };

    this.$forwardMatchIterator = function(session) {
        var re = this.$assembleRegExp();
        var self = this;

        return {
            forEach: function(callback) {
                self.$forwardLineIterator(session).forEach(function(line, startIndex, row) {
                    if (startIndex) {
                        line = line.substring(startIndex);
                    }

                    var matches = [];

                    line.replace(re, function(str) {
                        var offset = arguments[arguments.length-2];
                        matches.push({
                            str: str,
                            offset: startIndex + offset
                        });
                        return str;
                    });

                    for (var i=0; i<matches.length; i++) {
                        var match = matches[i];
                        var range = self.$rangeFromMatch(row, match.offset, match.str.length);
                        if (callback(range))
                            return true;
                    }

                });
            }
        };
    };

    this.$backwardMatchIterator = function(session) {
        var re = this.$assembleRegExp();
        var self = this;

        return {
            forEach: function(callback) {
                self.$backwardLineIterator(session).forEach(function(line, startIndex, row) {
                    if (startIndex) {
                        line = line.substring(startIndex);
                    }

                    var matches = [];

                    line.replace(re, function(str, offset) {
                        matches.push({
                            str: str,
                            offset: startIndex + offset
                        });
                        return str;
                    });

                    for (var i=matches.length-1; i>= 0; i--) {
                        var match = matches[i];
                        var range = self.$rangeFromMatch(row, match.offset, match.str.length);
                        if (callback(range))
                            return true;
                    }
                });
            }
        };
    };

    this.$rangeFromMatch = function(row, column, length) {
        return new Range(row, column, row, column+length);
    };

    this.$assembleRegExp = function() {
        if (this.$options.regExp) {
            var needle = this.$options.needle;
        } else {
            needle = lang.escapeRegExp(this.$options.needle);
        }

        if (this.$options.wholeWord) {
            needle = "\\b" + needle + "\\b";
        }

        var modifier = "g";
        if (!this.$options.caseSensitive) {
            modifier += "i";
        }

        var re = new RegExp(needle, modifier);
        return re;
    };

    this.$forwardLineIterator = function(session) {
        var searchSelection = this.$options.scope == Search.SELECTION;

        var range = session.getSelection().getRange();
        var start = session.getSelection().getCursor();

        var firstRow = searchSelection ? range.start.row : 0;
        var firstColumn = searchSelection ? range.start.column : 0;
        var lastRow = searchSelection ? range.end.row : session.getLength() - 1;

        var wrap = this.$options.wrap;

        function getLine(row) {
            var line = session.getLine(row);
            if (searchSelection && row == range.end.row) {
                line = line.substring(0, range.end.column);
            }
            return line;
        }

        return {
            forEach: function(callback) {
                var row = start.row;

                var line = getLine(row);
                var startIndex = start.column;

                var stop = false;

                while (!callback(line, startIndex, row)) {

                    if (stop) {
                        return;
                    }

                    row++;
                    startIndex = 0;

                    if (row > lastRow) {
                        if (wrap) {
                            row = firstRow;
                            startIndex = firstColumn;
                        } else {
                            return;
                        }
                    }

                    if (row == start.row)
                        stop = true;

                    line = getLine(row);
                }
            }
        };
    };

    this.$backwardLineIterator = function(session) {
        var searchSelection = this.$options.scope == Search.SELECTION;

        var range = session.getSelection().getRange();
        var start = searchSelection ? range.end : range.start;

        var firstRow = searchSelection ? range.start.row : 0;
        var firstColumn = searchSelection ? range.start.column : 0;
        var lastRow = searchSelection ? range.end.row : session.getLength() - 1;

        var wrap = this.$options.wrap;

        return {
            forEach : function(callback) {
                var row = start.row;

                var line = session.getLine(row).substring(0, start.column);
                var startIndex = 0;
                var stop = false;

                while (!callback(line, startIndex, row)) {

                    if (stop)
                        return;

                    row--;
                    startIndex = 0;

                    if (row < firstRow) {
                        if (wrap) {
                            row = lastRow;
                        } else {
                            return;
                        }
                    }

                    if (row == start.row)
                        stop = true;

                    line = session.getLine(row);
                    if (searchSelection) {
                        if (row == firstRow)
                            startIndex = firstColumn;
                        else if (row == lastRow)
                            line = line.substring(0, range.end.column);
                    }
                }
            }
        };
    };

}).call(Search.prototype);

exports.Search = Search;
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

define('ace/background_tokenizer', function(require, exports, module) {

var oop = require("pilot/oop");
var EventEmitter = require("pilot/event_emitter").EventEmitter;

var BackgroundTokenizer = function(tokenizer, editor) {
    this.running = false;    
    this.lines = [];
    this.currentLine = 0;
    this.tokenizer = tokenizer;

    var self = this;

    this.$worker = function() {
        if (!self.running) { return; }

        var workerStart = new Date();
        var startLine = self.currentLine;
        var doc = self.doc;

        var processedLines = 0;
        var lastVisibleRow = editor.getLastVisibleRow();

        var len = doc.getLength();
        while (self.currentLine < len) {
            self.lines[self.currentLine] = self.$tokenizeRows(self.currentLine, self.currentLine)[0];
            self.currentLine++;

            // only check every 5 lines
            processedLines += 1;
            if ((processedLines % 5 == 0) && (new Date() - workerStart) > 20) {
                self.fireUpdateEvent(startLine, self.currentLine-1);

                var timeout = self.currentLine < lastVisibleRow ? 20 : 100;
                self.running = setTimeout(self.$worker, timeout);
                return;
            }
        }

        self.running = false;

        self.fireUpdateEvent(startLine, len - 1);
    };
};

(function(){

    oop.implement(this, EventEmitter);

    this.setTokenizer = function(tokenizer) {
        this.tokenizer = tokenizer;
        this.lines = [];

        this.start(0);
    };

    this.setDocument = function(doc) {
        this.doc = doc;
        this.lines = [];

        this.stop();
    };

    this.fireUpdateEvent = function(firstRow, lastRow) {
        var data = {
            first: firstRow,
            last: lastRow
        };
        this._dispatchEvent("update", {data: data});
    };

    this.start = function(startRow) {
        this.currentLine = Math.min(startRow || 0, this.currentLine,
                                    this.doc.getLength());

        // remove all cached items below this line
        this.lines.splice(this.currentLine, this.lines.length);

        this.stop();
        // pretty long delay to prevent the tokenizer from interfering with the user
        this.running = setTimeout(this.$worker, 700);
    };

    this.stop = function() {
        if (this.running)
            clearTimeout(this.running);
        this.running = false;
    };

    this.getTokens = function(firstRow, lastRow) {
        return this.$tokenizeRows(firstRow, lastRow);
    };

    this.getState = function(row) {
        return this.$tokenizeRows(row, row)[0].state;
    };

    this.$tokenizeRows = function(firstRow, lastRow) {
        if (!this.doc)
            return [];
            
        var rows = [];

        // determine start state
        var state = "start";
        var doCache = false;
        if (firstRow > 0 && this.lines[firstRow - 1]) {
            state = this.lines[firstRow - 1].state;
            doCache = true;
        }

        var lines = this.doc.getLines(firstRow, lastRow);
        for (var row=firstRow; row<=lastRow; row++) {
            if (!this.lines[row]) {
                var tokens = this.tokenizer.getLineTokens(lines[row-firstRow] || "", state);
                var state = tokens.state;
                rows.push(tokens);

                if (doCache) {
                    this.lines[row] = tokens;
                }
            }
            else {
                var tokens = this.lines[row];
                state = tokens.state;
                rows.push(tokens);
            }
        }
        return rows;
    };

}).call(BackgroundTokenizer.prototype);

exports.BackgroundTokenizer = BackgroundTokenizer;
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

define('ace/undomanager', function(require, exports, module) {

var UndoManager = function() {
    this.$undoStack = [];
    this.$redoStack = [];
};

(function() {

    this.execute = function(options) {
        var deltas = options.args[0];
        this.$doc  = options.args[1];
        this.$undoStack.push(deltas);
    };

    this.undo = function() {
        var deltas = this.$undoStack.pop();
        if (deltas) {
            this.$doc.undoChanges(deltas);
            this.$redoStack.push(deltas);
        }
    };

    this.redo = function() {
        var deltas = this.$redoStack.pop();
        if (deltas) {
            this.$doc.redoChanges(deltas);
            this.$undoStack.push(deltas);
        }
    };

}).call(UndoManager.prototype);

exports.UndoManager = UndoManager;
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

define('ace/theme/textmate', function(require, exports, module) {

    var dom = require("pilot/dom");
    var cssText = require("text!ace/theme/tm.css");

    // import CSS once
    dom.importCssString(cssText);

    exports.cssClass = "ace-tm";
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

define('pilot/dom', function(require, exports, module) {

exports.setText = function(elem, text) {
    if (elem.innerText !== undefined) {
        elem.innerText = text;
    }
    if (elem.textContent !== undefined) {
        elem.textContent = text;
    }
};

exports.hasCssClass = function(el, name) {
    var classes = el.className.split(/\s+/g);
    return classes.indexOf(name) !== -1;
};

/**
* Add a CSS class to the list of classes on the given node
*/
exports.addCssClass = function(el, name) {
    if (!exports.hasCssClass(el, name)) {
        el.className += " " + name;
    }
};

/**
 * Add or remove a CSS class from the list of classes on the given node
 * depending on the value of <tt>include</tt>
 */
exports.setCssClass = function(node, className, include) {
    if (include) {
        exports.addCssClass(node, className);
    } else {
        exports.removeCssClass(node, className);
    }
};

/**
* Remove a CSS class from the list of classes on the given node
*/
exports.removeCssClass = function(el, name) {
    var classes = el.className.split(/\s+/g);
    while (true) {
        var index = classes.indexOf(name);
        if (index == -1) {
            break;
        }
        classes.splice(index, 1);
    }
    el.className = classes.join(" ");
};

exports.importCssString = function(cssText, doc){
    doc = doc || document;        

    if (doc.createStyleSheet) {
        var sheet = doc.createStyleSheet();
        sheet.cssText = cssText;
    }
    else {
        var style = doc.createElement("style");
        style.appendChild(doc.createTextNode(cssText));
        doc.getElementsByTagName("head")[0].appendChild(style);
    }            
};

exports.getInnerWidth = function(element) {
    return (parseInt(exports.computedStyle(element, "paddingLeft"))
            + parseInt(exports.computedStyle(element, "paddingRight")) + element.clientWidth);
};

exports.getInnerHeight = function(element) {
    return (parseInt(exports.computedStyle(element, "paddingTop"))
            + parseInt(exports.computedStyle(element, "paddingBottom")) + element.clientHeight);
};

exports.computedStyle = function(element, style) {
    if (window.getComputedStyle) {
        return (window.getComputedStyle(element, "") || {})[style] || "";
    }
    else {
        return element.currentStyle[style];
    }
};

exports.scrollbarWidth = function() {

    var inner = document.createElement('p');
    inner.style.width = "100%";
    inner.style.height = "200px";

    var outer = document.createElement("div");
    var style = outer.style;

    style.position = "absolute";
    style.left = "-10000px";
    style.overflow = "hidden";
    style.width = "200px";
    style.height = "150px";

    outer.appendChild(inner);
    document.body.appendChild(outer);
    var noScrollbar = inner.offsetWidth;

    style.overflow = "scroll";
    var withScrollbar = inner.offsetWidth;

    if (noScrollbar == withScrollbar) {
        withScrollbar = outer.clientWidth;
    }

    document.body.removeChild(outer);

    return noScrollbar-withScrollbar;
};

/**
 * Optimized set innerHTML. This is faster than plain innerHTML if the element
 * already contains a lot of child elements.
 * 
 * See http://blog.stevenlevithan.com/archives/faster-than-innerhtml for details
 */
exports.setInnerHtml = function(el, innerHtml) {
	var element = el.cloneNode(false);//document.createElement("div");
    element.innerHTML = innerHtml;
    el.parentNode.replaceChild(element, el);
    return element;
};

exports.setInnerText = function(el, innerText) {
    if ("textContent" in document.body)
        el.textContent = innerText;
    else 
        el.innerText = innerText;
        
};

exports.getInnerText = function(el) {
    if ("textContent" in document.body)
        return el.textContent;
    else 
         return el.innerText;
};

exports.getParentWindow = function(document) {
    return document.defaultView || document.parentWindow;
};

exports.getSelectionStart = function(textarea) {
    // TODO IE
    var start;
    try {
        start = textarea.selectionStart || 0;
    } catch (e) {
        start = 0;
    }
    return start;
};

exports.setSelectionStart = function(textarea, start) {
    // TODO IE
    return textarea.selectionStart = start;
};

exports.getSelectionEnd = function(textarea) {
    // TODO IE
    var end;
    try {
        end = textarea.selectionEnd || 0;
    } catch (e) {
        end = 0;
    }
    return end;
};

exports.setSelectionEnd = function(textarea, end) {
    // TODO IE
    return textarea.selectionEnd = end;
};

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

define('ace/mode/matching_brace_outdent', function(require, exports, module) {

var Range = require("ace/range").Range;

var MatchingBraceOutdent = function() {};

(function() {

    this.checkOutdent = function(line, input) {
        if (! /^\s+$/.test(line))
            return false;

        return /^\s*\}/.test(input);
    };

    this.autoOutdent = function(doc, row) {
        var line = doc.getLine(row);
        var match = line.match(/^(\s*\})/);

        if (!match) return 0;

        var column = match[1].length;
        var openBracePos = doc.findMatchingBracket({row: row, column: column});

        if (!openBracePos || openBracePos.row == row) return 0;

        var indent = this.$getIndent(doc.getLine(openBracePos.row));
        doc.replace(new Range(row, 0, row, column-1), indent);

        return indent.length - (column-1);
    };

    this.$getIndent = function(line) {
        var match = line.match(/^(\s+)/);
        if (match) {
            return match[1];
        }

        return "";
    };

}).call(MatchingBraceOutdent.prototype);

exports.MatchingBraceOutdent = MatchingBraceOutdent;
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
 *      Fabian Jakobs <fabian@ajax.org>
 *      Irakli Gozalishvili <rfobic@gmail.com> (http://jeditoolkit.com)
 *      Julian Viereck <julian.viereck@gmail.com>
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

define('ace/virtual_renderer', function(require, exports, module) {

var oop = require("pilot/oop");
var dom = require("pilot/dom");
var event = require("pilot/event");
var useragent = require("pilot/useragent");
var GutterLayer = require("ace/layer/gutter").Gutter;
var MarkerLayer = require("ace/layer/marker").Marker;
var TextLayer = require("ace/layer/text").Text;
var CursorLayer = require("ace/layer/cursor").Cursor;
var ScrollBar = require("ace/scrollbar").ScrollBar;
var RenderLoop = require("ace/renderloop").RenderLoop;
var EventEmitter = require("pilot/event_emitter").EventEmitter;
var editorCss = require("text!ace/css/editor.css");

// import CSS once
dom.importCssString(editorCss);

var VirtualRenderer = function(container, theme) {
    this.container = container;
    dom.addCssClass(this.container, "ace_editor");

    this.setTheme(theme);

    this.$gutter = document.createElement("div");
    this.$gutter.className = "ace_gutter";
    this.container.appendChild(this.$gutter);

    this.scroller = document.createElement("div");
    this.scroller.className = "ace_scroller";
    this.container.appendChild(this.scroller);

    this.content = document.createElement("div");
    this.content.className = "ace_content";
    this.scroller.appendChild(this.content);

    this.$gutterLayer = new GutterLayer(this.$gutter);
    this.$markerLayer = new MarkerLayer(this.content);

    var textLayer = this.$textLayer = new TextLayer(this.content);
    this.canvas = textLayer.element;

    this.characterWidth = textLayer.getCharacterWidth();
    this.lineHeight = textLayer.getLineHeight();

    this.$cursorLayer = new CursorLayer(this.content);

    this.layers = [ this.$markerLayer, textLayer, this.$cursorLayer ];

    this.scrollBar = new ScrollBar(container);
    this.scrollBar.addEventListener("scroll", this.onScroll.bind(this));

    this.scrollTop = 0;

    this.cursorPos = {
        row : 0,
        column : 0
    };

    var _self = this;
    this.$textLayer.addEventListener("changeCharaterSize", function() {
        _self.characterWidth = textLayer.getCharacterWidth();
        _self.lineHeight = textLayer.getLineHeight();
        _self.$updatePrintMargin();

        _self.$loop.schedule(_self.CHANGE_FULL);
    });
    event.addListener(this.$gutter, "click", this.$onGutterClick.bind(this));
    event.addListener(this.$gutter, "dblclick", this.$onGutterClick.bind(this));

    this.$size = {
        width: 0,
        height: 0,
        scrollerHeight: 0,
        scrollerWidth: 0
    };

    this.$loop = new RenderLoop(this.$renderChanges.bind(this));
    this.$loop.schedule(this.CHANGE_FULL);

    this.setPadding(4);
    this.$updatePrintMargin();
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

    oop.implement(this, EventEmitter);

    this.setSession = function(session) {
        this.session = session;
        this.$cursorLayer.setSession(session);
        this.$markerLayer.setSession(session);
        this.$gutterLayer.setSession(session);
        this.$textLayer.setSession(session);
        this.$loop.schedule(this.CHANGE_FULL);
    };

    /**
     * Triggers partial update of the text layer
     */
    this.updateLines = function(firstRow, lastRow) {
        if (lastRow === undefined)
            lastRow = Infinity;

        if (!this.$changedLines) {
            this.$changedLines = {
                firstRow: firstRow,
                lastRow: lastRow
            };
        }
        else {
            if (this.$changedLines.firstRow > firstRow)
                this.$changedLines.firstRow = firstRow;

            if (this.$changedLines.lastRow < lastRow)
                this.$changedLines.lastRow = lastRow;
        }

        this.$loop.schedule(this.CHANGE_LINES);
    };

    /**
     * Triggers full update of the text layer
     */
    this.updateText = function() {
        this.$loop.schedule(this.CHANGE_TEXT);
    };

    /**
     * Triggers a full update of all layers
     */
    this.updateFull = function() {
        this.$loop.schedule(this.CHANGE_FULL);
    };

    /**
     * Triggers resize of the editor
     */
    this.onResize = function(force) {
        var changes = this.CHANGE_SIZE;

        var height = dom.getInnerHeight(this.container);
        if (force || this.$size.height != height) {
            this.$size.height = height;

            this.scroller.style.height = height + "px";
            this.scrollBar.setHeight(height);

            if (this.session) {
                this.scrollToY(this.getScrollTop());
                changes = changes | this.CHANGE_FULL;
            }
        }

        var width = dom.getInnerWidth(this.container);
        if (force || this.$size.width != width) {
            this.$size.width = width;

            var gutterWidth = this.showGutter ? this.$gutter.offsetWidth : 0;
            this.scroller.style.left = gutterWidth + "px";
            this.scroller.style.width = Math.max(0, width - gutterWidth - this.scrollBar.getWidth()) + "px";
        }

        this.$size.scrollerWidth = this.scroller.clientWidth;
        this.$size.scrollerHeight = this.scroller.clientHeight;
        this.$loop.schedule(changes);
    };

    this.setTokenizer = function(tokenizer) {
        this.$tokenizer = tokenizer;
        this.$textLayer.setTokenizer(tokenizer);
        this.$loop.schedule(this.CHANGE_TEXT);
    };

    this.$onGutterClick = function(e) {
        var pageX = event.getDocumentX(e);
        var pageY = event.getDocumentY(e);

        this._dispatchEvent("gutter" + e.type, {
            row: this.screenToTextCoordinates(pageX, pageY).row,
            htmlEvent: e
        });
    };

    this.setShowInvisibles = function(showInvisibles) {
        if (this.$textLayer.setShowInvisibles(showInvisibles))
            this.$loop.schedule(this.CHANGE_TEXT);
    };

    this.getShowInvisibles = function() {
        return this.$textLayer.showInvisibles;
    };

    this.$showPrintMargin = true;
    this.setShowPrintMargin = function(showPrintMargin) {
        this.$showPrintMargin = showPrintMargin;
        this.$updatePrintMargin();
    };

    this.getShowPrintMargin = function() {
        return this.$showPrintMargin;
    };

    this.$printMarginColumn = 80;
    this.setPrintMarginColumn = function(showPrintMargin) {
        this.$printMarginColumn = showPrintMargin;
        this.$updatePrintMargin();
    };

    this.getPrintMarginColumn = function() {
        return this.$printMarginColumn;
    };

    this.setShowGutter = function(show){
        if(this.showGutter === show)
            return;
        this.$gutter.style.display = show ? "block" : "none";
        this.showGutter = show;
        this.onResize(true);
    }

    this.$updatePrintMargin = function() {
        var containerEl

        if (!this.$showPrintMargin && !this.$printMarginEl)
            return;
            
        if (!this.$printMarginEl) {
            containerEl = document.createElement("div");
            containerEl.className = "ace_print_margin_layer";
            this.$printMarginEl = document.createElement("div")
            this.$printMarginEl.className = "ace_print_margin";
            containerEl.appendChild(this.$printMarginEl);
            this.content.insertBefore(containerEl, this.$textLayer.element);
        }

        var style = this.$printMarginEl.style;
        style.left = ((this.characterWidth * this.$printMarginColumn) + this.$padding * 2) + "px";
        style.visibility = this.$showPrintMargin ? "visible" : "hidden";
    };

    this.getContainerElement = function() {
        return this.container;
    };

    this.getMouseEventTarget = function() {
        return this.content;
    };

    this.getTextAreaContainer = function() {
        return this.container;
    };

    this.moveTextAreaToCursor = function(textarea) {        
        // in IE the native cursor always shines through
        if (useragent.isIE)
            return;
            
        var pos = this.$cursorLayer.getPixelPosition();
        if (!pos)
            return;

        var bounds = this.content.getBoundingClientRect();
        var offset = (this.layerConfig && this.layerConfig.offset) || 0;
        
        textarea.style.left = (bounds.left + pos.left + this.$padding) + "px";
        textarea.style.top = (bounds.top + pos.top - this.scrollTop + offset) + "px";
    };

    this.getFirstVisibleRow = function() {
        return (this.layerConfig || {}).firstRow || 0;
    };

    this.getFirstFullyVisibleRow = function(){
        if (!this.layerConfig)
            return 0;

        return this.layerConfig.firstRow + (this.layerConfig.offset == 0 ? 0 : 1);
    }

    this.getLastFullyVisibleRow = function() {
        if (!this.layerConfig)
            return 0;

        var flint = Math.floor((this.layerConfig.height + this.layerConfig.offset) / this.layerConfig.lineHeight);
        return this.layerConfig.firstRow - 1 + flint;
    }

    this.getLastVisibleRow = function() {
        return (this.layerConfig || {}).lastRow || 0;
    };

    this.$padding = null;
    this.setPadding = function(padding) {
        this.$padding = padding;
        this.content.style.padding = "0 " + padding + "px";
        this.$loop.schedule(this.CHANGE_FULL);
        this.$updatePrintMargin();
    };

    this.onScroll = function(e) {
        this.scrollToY(e.data);
    };

    this.$updateScrollBar = function() {
        this.scrollBar.setInnerHeight(this.session.getScreenLength() * this.lineHeight);
        this.scrollBar.setScrollTop(this.scrollTop);
    };

    this.$renderChanges = function(changes) {
        if (!changes || !this.session || !this.$tokenizer)
            return;

        // text, scrolling and resize changes can cause the view port size to change
        if (!this.layerConfig ||
            changes & this.CHANGE_FULL ||
            changes & this.CHANGE_SIZE ||
            changes & this.CHANGE_TEXT ||
            changes & this.CHANGE_LINES ||
            changes & this.CHANGE_SCROLL
        )
            this.$computeLayerConfig();

        // full
        if (changes & this.CHANGE_FULL) {
            this.$textLayer.update(this.layerConfig);
            this.showGutter && this.$gutterLayer.update(this.layerConfig);
            this.$markerLayer.update(this.layerConfig);
            this.$cursorLayer.update(this.layerConfig);
            this.$updateScrollBar();
            this.scrollCursorIntoView();
            return;
        }

        // scrolling
        if (changes & this.CHANGE_SCROLL) {
            if (changes & this.CHANGE_TEXT || changes & this.CHANGE_LINES)
                this.$textLayer.update(this.layerConfig);
            else
                this.$textLayer.scrollLines(this.layerConfig);
            this.showGutter && this.$gutterLayer.update(this.layerConfig);
            this.$markerLayer.update(this.layerConfig);
            this.$cursorLayer.update(this.layerConfig);
            this.$updateScrollBar();
            return;
        }

        if (changes & this.CHANGE_TEXT) {
            this.$textLayer.update(this.layerConfig);
            this.showGutter && this.$gutterLayer.update(this.layerConfig);
        }
        else if (changes & this.CHANGE_LINES) {
            this.$updateLines();
            this.$updateScrollBar();
            this.showGutter && this.$gutterLayer.update(this.layerConfig);
        } else if (changes & this.CHANGE_GUTTER) {
            this.showGutter && this.$gutterLayer.update(this.layerConfig);
        }

        if (changes & this.CHANGE_CURSOR)
            this.$cursorLayer.update(this.layerConfig);

        if (changes & this.CHANGE_MARKER) {
            this.$markerLayer.update(this.layerConfig);
        }

        if (changes & this.CHANGE_SIZE)
            this.$updateScrollBar();
    };

    this.$computeLayerConfig = function() {
        var session = this.session;

        var offset = this.scrollTop % this.lineHeight;
        var minHeight = this.$size.scrollerHeight + this.lineHeight;

        var longestLine = this.$getLongestLine();
        var widthChanged = !this.layerConfig ? true : (this.layerConfig.width != longestLine);

        var lineCount = Math.ceil(minHeight / this.lineHeight) - 1;
        var firstRow = Math.max(0, Math.round((this.scrollTop - offset) / this.lineHeight));
        var lastRow = firstRow + lineCount;

        // Map lines on the screen to lines in the document.
        var firstRowScreen, firstRowHeight;
        var lineHeight = { lineHeight: this.lineHeight };
        firstRow = session.screenToDocumentRow(firstRow);
        firstRowScreen = session.documentToScreenRow(firstRow);
        firstRowHeight = session.getRowHeight(lineHeight, firstRow);

        lastRow = Math.min(session.screenToDocumentRow(lastRow), session.getLength() - 1);
        minHeight = this.$size.scrollerHeight + session.getRowHeight(lineHeight, lastRow)+
                                                firstRowHeight;

        offset = this.scrollTop - firstRowScreen * this.lineHeight;

        var layerConfig = this.layerConfig = {
            width : longestLine,
            padding : this.$padding,
            firstRow : firstRow,
            firstRowScreen: firstRowScreen,
            lastRow : lastRow,
            lineHeight : this.lineHeight,
            characterWidth : this.characterWidth,
            minHeight : minHeight,
            offset : offset,
            height : this.$size.scrollerHeight
        };

        this.$gutterLayer.element.style.marginTop = (-offset) + "px";
        this.content.style.marginTop = (-offset) + "px";
        this.content.style.width = longestLine + "px";
        this.content.style.height = minHeight + "px";
    };

    this.$updateLines = function() {
        var firstRow = this.$changedLines.firstRow;
        var lastRow = this.$changedLines.lastRow;
        this.$changedLines = null;

        var layerConfig = this.layerConfig;

        // if the update changes the width of the document do a full redraw
        if (layerConfig.width != this.$getLongestLine())
            return this.$textLayer.update(layerConfig);

        if (firstRow > layerConfig.lastRow + 1) { return; }
        if (lastRow < layerConfig.firstRow) { return; }

        // if the last row is unknown -> redraw everything
        if (lastRow === Infinity) {
            this.showGutter && this.$gutterLayer.update(layerConfig);
            this.$textLayer.update(layerConfig);
            return;
        }

        // else update only the changed rows
        this.$textLayer.updateLines(layerConfig, firstRow, lastRow);
    };

    this.$getLongestLine = function() {
        var charCount = this.session.getScreenWidth();
        if (this.$textLayer.showInvisibles)
            charCount += 1;

        return Math.max(this.$size.scrollerWidth - this.$padding * 2, Math.round(charCount * this.characterWidth));
    };

    this.addMarker = function(range, clazz, type) {
        var id = this.$markerLayer.addMarker(range, clazz, type);
        this.$loop.schedule(this.CHANGE_MARKER);
        return id;
    };

    this.removeMarker = function(markerId) {
        this.$markerLayer.removeMarker(markerId);
        this.$loop.schedule(this.CHANGE_MARKER);
    };

    this.addGutterDecoration = function(row, className){
        this.$gutterLayer.addGutterDecoration(row, className);
        this.$loop.schedule(this.CHANGE_GUTTER);
    }

    this.removeGutterDecoration = function(row, className){
        this.$gutterLayer.removeGutterDecoration(row, className);
        this.$loop.schedule(this.CHANGE_GUTTER);
    }

    this.setBreakpoints = function(rows) {
        this.$gutterLayer.setBreakpoints(rows);
        this.$loop.schedule(this.CHANGE_GUTTER);
    };

    this.setAnnotations = function(annotations) {
        this.$gutterLayer.setAnnotations(annotations);
        this.$loop.schedule(this.CHANGE_GUTTER);
    };

    this.updateCursor = function(position, overwrite) {
        this.$cursorLayer.setCursor(position, overwrite);
        this.$loop.schedule(this.CHANGE_CURSOR);
    };

    this.hideCursor = function() {
        this.$cursorLayer.hideCursor();
    };

    this.showCursor = function() {
        this.$cursorLayer.showCursor();
    };

    this.scrollCursorIntoView = function() {
        var pos = this.$cursorLayer.getPixelPosition();

        var left = pos.left + this.$padding;
        var top = pos.top;

        if (this.getScrollTop() > top) {
            this.scrollToY(top);
        }

        if (this.getScrollTop() + this.$size.scrollerHeight < top
                + this.lineHeight) {
            this.scrollToY(top + this.lineHeight - this.$size.scrollerHeight);
        }

        if (this.scroller.scrollLeft > left) {
            this.scrollToX(left);
        }

        if (this.scroller.scrollLeft + this.$size.scrollerWidth < left
                + this.characterWidth) {
            this.scrollToX(Math.round(left + this.characterWidth
                    - this.$size.scrollerWidth));
        }
    },

    this.getScrollTop = function() {
        return this.scrollTop;
    };

    this.getScrollLeft = function() {
        return this.scroller.scrollLeft;
    };

    this.getScrollTopRow = function() {
        return this.scrollTop / this.lineHeight;
    };

    this.scrollToRow = function(row) {
        this.scrollToY(row * this.lineHeight);
    };

    this.scrollToY = function(scrollTop) {
        var maxHeight = this.session.getScreenLength() * this.lineHeight - this.$size.scrollerHeight;
        var scrollTop = Math.max(0, Math.min(maxHeight, scrollTop));

        if (this.scrollTop !== scrollTop) {
            this.scrollTop = scrollTop;
            this.$loop.schedule(this.CHANGE_SCROLL);
        }
    };

    this.scrollToX = function(scrollLeft) {
        if (scrollLeft <= this.$padding)
            scrollLeft = 0;

        this.scroller.scrollLeft = scrollLeft;
    };

    this.scrollBy = function(deltaX, deltaY) {
        deltaY && this.scrollToY(this.scrollTop + deltaY);
        deltaX && this.scrollToX(this.scroller.scrollLeft + deltaX);
    };

    this.screenToTextCoordinates = function(pageX, pageY) {
        var canvasPos = this.scroller.getBoundingClientRect();

        var col = Math.round((pageX + this.scroller.scrollLeft - canvasPos.left - this.$padding)
                / this.characterWidth);
        var row = Math.floor((pageY + this.scrollTop - canvasPos.top)
                / this.lineHeight);

        return this.session.screenToDocumentPosition(row, Math.max(col, 0));
    };

    this.textToScreenCoordinates = function(row, column) {
        var canvasPos = this.scroller.getBoundingClientRect();
        var pos = this.session.documentToScreenPosition(row, column);

        var x = this.$padding + Math.round(pos.column * this.characterWidth);
        var y = pos.row * this.lineHeight;

        return {
            pageX: canvasPos.left + x - this.getScrollLeft(),
            pageY: canvasPos.top + y - this.getScrollTop()
        }
    };

    this.visualizeFocus = function() {
        dom.addCssClass(this.container, "ace_focus");
    };

    this.visualizeBlur = function() {
        dom.removeCssClass(this.container, "ace_focus");
    };

    this.showComposition = function(position) {
		if (!this.$composition) {
    	    this.$composition = document.createElement("div");
            this.$composition.className = "ace_composition";
            this.content.appendChild(this.$composition);
		}
    	
        this.$composition.innerHTML = "&nbsp;";

        var pos = this.$cursorLayer.getPixelPosition();
    	var style = this.$composition.style;
		style.top = pos.top + "px";
		style.left = (pos.left + this.$padding) + "px";
    	style.height = this.lineHeight + "px";
    	
		this.hideCursor();
    };

    this.setCompositionText = function(text) {
        dom.setInnerText(this.$composition, text);
    };

    this.hideComposition = function() {
		this.showCursor();

        if (!this.$composition)
            return;

    	var style = this.$composition.style;
		style.top = "-10000px";
		style.left = "-10000px";
    };

    this.setTheme = function(theme) {
        var _self = this;
        if (!theme || typeof theme == "string") {
            theme = theme || "ace/theme/textmate";
            require([theme], function(theme) {
                afterLoad(theme);
            });
        } else {
            afterLoad(theme);
        }

        var _self = this;
        function afterLoad(theme) {
            if (_self.$theme)
                dom.removeCssClass(_self.container, _self.$theme);

            _self.$theme = theme ? theme.cssClass : null;

            if (_self.$theme)
                dom.addCssClass(_self.container, _self.$theme);

            // force re-measure of the gutter width
            if (_self.$size) {
                _self.$size.width = 0;
                _self.onResize();
            }
        }
    };

    // Methods allows to add / remove CSS classnames to the editor element.
    // This feature can be used by plug-ins to provide a visual indication of
    // a certain mode that editor is in.

    this.setStyle = function setStyle(style) {
      dom.addCssClass(this.container, style)
    };

    this.unsetStyle = function unsetStyle(style) {
      dom.removeCssClass(this.container, style)
    };

}).call(VirtualRenderer.prototype);

exports.VirtualRenderer = VirtualRenderer;
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
 *      Julian Viereck <julian.viereck@gmail.com>
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

define('ace/layer/gutter', function(require, exports, module) {

var dom = require("pilot/dom");

var Gutter = function(parentEl) {
    this.element = document.createElement("div");
    this.element.className = "ace_layer ace_gutter-layer";
    parentEl.appendChild(this.element);

    this.$breakpoints = [];
    this.$annotations = [];
    this.$decorations = [];
};

(function() {

    this.setSession = function(session) {
        this.session = session;
    };

    this.addGutterDecoration = function(row, className){
        if (!this.$decorations[row])
            this.$decorations[row] = "";
        this.$decorations[row] += " ace_" + className;
    }

    this.removeGutterDecoration = function(row, className){
        this.$decorations[row] = this.$decorations[row].replace(" ace_" + className, "");
    };

    this.setBreakpoints = function(rows) {
        this.$breakpoints = rows.concat();
    };

    this.setAnnotations = function(annotations) {
        // iterate over sparse array
        this.$annotations = [];        
        for (var row in annotations) {
            var rowAnnotations = annotations[row];
            if (!rowAnnotations)
                continue;
                
            var rowInfo = this.$annotations[row] = {
                text: []
            };
            for (var i=0; i<rowAnnotations.length; i++) {
                var annotation = rowAnnotations[i];
                rowInfo.text.push(annotation.text.replace(/"/g, "&quot;").replace(/'/g, "&rsquo;").replace(/</, "&lt;"));
                var type = annotation.type;
                if (type == "error")
                    rowInfo.className = "ace_error";
                else if (type == "warning" && rowInfo.className != "ace_error")
                    rowInfo.className = "ace_warning";
                else if (type == "info" && (!rowInfo.className))
                    rowInfo.className = "ace_info";
            }
        }
    };

    this.update = function(config) {
        this.$config = config;

        var html = [];
        for ( var i = config.firstRow; i <= config.lastRow; i++) {
            var annotation = this.$annotations[i] || {
                className: "",
                text: []
            };
            html.push("<div class='ace_gutter-cell",
                this.$decorations[i] || "",
                this.$breakpoints[i] ? " ace_breakpoint " : " ",
                annotation.className,
                "' title='", annotation.text.join("\n"),
                "' style='height:", this.session.getRowHeight(config, i), "px;'>", (i+1), "</div>");
            html.push("</div>");
        }
		this.element = dom.setInnerHtml(this.element, html.join(""));
        this.element.style.height = config.minHeight + "px";
    };

}).call(Gutter.prototype);

exports.Gutter = Gutter;

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
 *      Julian Viereck <julian.viereck@gmail.com>
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

define('ace/layer/marker', function(require, exports, module) {

var Range = require("ace/range").Range;
var dom = require("pilot/dom");

var Marker = function(parentEl) {
    this.element = document.createElement("div");
    this.element.className = "ace_layer ace_marker-layer";
    parentEl.appendChild(this.element);

    this.markers = {};
    this.$markerId = 1;
};

(function() {

    this.setSession = function(session) {
        this.session = session;
    };

    this.addMarker = function(range, clazz, type) {
        var id = this.$markerId++;
        this.markers[id] = {
            range : range,
            type : type || "line",
            clazz : clazz
        };

        return id;
    };

    this.removeMarker = function(markerId) {
        var marker = this.markers[markerId];
        if (marker) {
            delete (this.markers[markerId]);
        }
    };

    this.update = function(config) {
        var config = config || this.config;
        if (!config)
            return;

        this.config = config;

        var html = [];
        for ( var key in this.markers) {
            var marker = this.markers[key];

            var range = marker.range.clipRows(config.firstRow, config.lastRow);
            if (range.isEmpty()) continue;

            range = range.toScreenRange(this.session);

            if (range.isMultiLine()) {
                if (marker.type == "text") {
                    this.drawTextMarker(html, range, marker.clazz, config);
                } else {
                    this.drawMultiLineMarker(html, range, marker.clazz, config);
                }
            }
            else {
                this.drawSingleLineMarker(html, range, marker.clazz, config);
            }
        }
        this.element = dom.setInnerHtml(this.element, html.join(""));
    };

    this.$getTop = function(row, layerConfig) {
        return (row - layerConfig.firstRowScreen) * layerConfig.lineHeight;
    };

    this.drawTextMarker = function(stringBuilder, range, clazz, layerConfig) {
        // selection start
        var row = range.start.row;

        var lineRange = new Range(row, range.start.column,
                                  row, this.session.getScreenLastRowColumn(row));
        this.drawSingleLineMarker(stringBuilder, lineRange, clazz, layerConfig, 1);

        // selection end
        var row = range.end.row;
        var lineRange = new Range(row, 0, row, range.end.column);
        this.drawSingleLineMarker(stringBuilder, lineRange, clazz, layerConfig);

        for (var row = range.start.row + 1; row < range.end.row; row++) {
            lineRange.start.row = row;
            lineRange.end.row = row;
            lineRange.end.column = this.session.getScreenLastRowColumn(row);
            this.drawSingleLineMarker(stringBuilder, lineRange, clazz, layerConfig, 1);
        }
    };

    this.drawMultiLineMarker = function(stringBuilder, range, clazz, layerConfig) {
        // from selection start to the end of the line
        var height = layerConfig.lineHeight;
        var width = Math.round(layerConfig.width - (range.start.column * layerConfig.characterWidth));
        var top = this.$getTop(range.start.row, layerConfig);
        var left = Math.round(range.start.column * layerConfig.characterWidth);

        stringBuilder.push(
            "<div class='", clazz, "' style='",
            "height:", height, "px;",
            "width:", width, "px;",
            "top:", top, "px;",
            "left:", left, "px;'></div>"
        );

        // from start of the last line to the selection end
        var top = this.$getTop(range.end.row, layerConfig);
        var width = Math.round(range.end.column * layerConfig.characterWidth);

        stringBuilder.push(
            "<div class='", clazz, "' style='",
            "height:", height, "px;",
            "top:", top, "px;",
            "width:", width, "px;'></div>"
        );

        // all the complete lines
        var height = (range.end.row - range.start.row - 1) * layerConfig.lineHeight;
        if (height < 0)
            return;
        var top = this.$getTop(range.start.row + 1, layerConfig);

        stringBuilder.push(
            "<div class='", clazz, "' style='",
            "height:", height, "px;",
            "width:", layerConfig.width, "px;",
            "top:", top, "px;'></div>"
        );
    };

    this.drawSingleLineMarker = function(stringBuilder, range, clazz, layerConfig, extraLength) {
        var height = layerConfig.lineHeight;
        var width = Math.round((range.end.column + (extraLength || 0) - range.start.column) * layerConfig.characterWidth);
        var top = this.$getTop(range.start.row, layerConfig);
        var left = Math.round(range.start.column * layerConfig.characterWidth);

        stringBuilder.push(
            "<div class='", clazz, "' style='",
            "height:", height, "px;",
            "width:", width, "px;",
            "top:", top, "px;",
            "left:", left,"px;'></div>"
        );
    };

}).call(Marker.prototype);

exports.Marker = Marker;

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
 *      Julian Viereck <julian.viereck@gmail.com>
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

define('ace/layer/text', function(require, exports, module) {

var oop = require("pilot/oop");
var dom = require("pilot/dom");
var lang = require("pilot/lang");
var EventEmitter = require("pilot/event_emitter").EventEmitter;

var Text = function(parentEl) {
    this.element = document.createElement("div");
    this.element.className = "ace_layer ace_text-layer";
    parentEl.appendChild(this.element);

    this.$characterSize = this.$measureSizes();
    this.$pollSizeChanges();
};

(function() {

    oop.implement(this, EventEmitter);

    this.EOF_CHAR = "&para;";
    this.EOL_CHAR = "&not;";
    this.TAB_CHAR = "&rarr;";
    this.SPACE_CHAR = "&middot;";

    this.setTokenizer = function(tokenizer) {
        this.tokenizer = tokenizer;
    };

    this.getLineHeight = function() {
        return this.$characterSize.height || 1;
    };

    this.getCharacterWidth = function() {
        return this.$characterSize.width || 1;
    };

    this.$pollSizeChanges = function() {
        var self = this;
        setInterval(function() {
            var size = self.$measureSizes();
            if (self.$characterSize.width !== size.width || self.$characterSize.height !== size.height) {
                self.$characterSize = size;
                self._dispatchEvent("changeCharaterSize", {data: size});
            }
        }, 500);
    };

    this.$fontStyles = {
        fontFamily : 1,
        fontSize : 1,
        fontWeight : 1,
        fontStyle : 1,
        lineHeight : 1
    },

    this.$measureSizes = function() {
        var n = 1000;
        if (!this.$measureNode) {
	        var measureNode = this.$measureNode = document.createElement("div");
	        var style = measureNode.style;

	        style.width = style.height = "auto";
	        style.left = style.top = "-1000px";

	        style.visibility = "hidden";
	        style.position = "absolute";
	        style.overflow = "visible";
	        style.whiteSpace = "nowrap";

	        // in FF 3.6 monospace fonts can have a fixed sub pixel width.
	        // that's why we have to measure many characters
	        // Note: characterWidth can be a float!
	        measureNode.innerHTML = lang.stringRepeat("Xy", n);
	        document.body.insertBefore(measureNode, document.body.firstChild);
        }

        var style = this.$measureNode.style;
        for (var prop in this.$fontStyles) {
            var value = dom.computedStyle(this.element, prop);
            style[prop] = value;
        }

        var size = {
            height: this.$measureNode.offsetHeight,
            width: this.$measureNode.offsetWidth / (n * 2)
        };
        return size;
    };

    this.setSession = function(session) {
        this.session = session;
    };

    this.showInvisibles = false;
    this.setShowInvisibles = function(showInvisibles) {
        if (this.showInvisibles == showInvisibles)
            return false;

        this.showInvisibles = showInvisibles;
        return true;
    };

    this.$computeTabString = function() {
        var tabSize = this.session.getTabSize();
        if (this.showInvisibles) {
            var halfTab = (tabSize) / 2;
            this.$tabString = "<span class='ace_invisible'>"
                + new Array(Math.floor(halfTab)).join("&nbsp;")
                + this.TAB_CHAR
                + new Array(Math.ceil(halfTab)+1).join("&nbsp;")
                + "</span>";
        } else {
            this.$tabString = new Array(tabSize+1).join("&nbsp;");
        }
    };

    this.updateLines = function(config, firstRow, lastRow) {
        this.$computeTabString();
        // Due to wrap line changes there can be new lines if e.g.
        // the line to updated wrapped in the meantime.
        if (this.config.lastRow != config.lastRow ||
            this.config.firstRow != config.firstRow) {
            this.scrollLines(config);
        }
        this.config = config;

        var first = Math.max(firstRow, config.firstRow);
        var last = Math.min(lastRow, config.lastRow);

        var lineElements = this.element.childNodes;
        var tokens = this.tokenizer.getTokens(first, last);
        for (var i=first; i<=last; i++) {
            var lineElement = lineElements[i - config.firstRow];
            if (!lineElement)
                continue;

            var html = [];
            this.$renderLine(html, i, tokens[i-first].tokens);
            lineElement = dom.setInnerHtml(lineElement, html.join(""));
            lineElement.style.height =
                    this.session.getRowHeight(config, i) + "px";
        }
    };

    this.scrollLines = function(config) {
        this.$computeTabString();
        var oldConfig = this.config;
        this.config = config;

        if (!oldConfig || oldConfig.lastRow < config.firstRow)
            return this.update(config);

        if (config.lastRow < oldConfig.firstRow)
            return this.update(config);

        var el = this.element;

        if (oldConfig.firstRow < config.firstRow)
            for (var row=oldConfig.firstRow; row<config.firstRow; row++)
                el.removeChild(el.firstChild);

        if (oldConfig.lastRow > config.lastRow)
            for (var row=config.lastRow+1; row<=oldConfig.lastRow; row++)
                el.removeChild(el.lastChild);

        if (config.firstRow < oldConfig.firstRow) {
            var fragment = this.$renderLinesFragment(config, config.firstRow, oldConfig.firstRow - 1);
            if (el.firstChild)
                el.insertBefore(fragment, el.firstChild);
            else
                el.appendChild(fragment);
        }

        if (config.lastRow > oldConfig.lastRow) {
            var fragment = this.$renderLinesFragment(config, oldConfig.lastRow + 1, config.lastRow);
            el.appendChild(fragment);
        }
    };

    this.$renderLinesFragment = function(config, firstRow, lastRow) {
        var fragment = document.createDocumentFragment();
        var tokens = this.tokenizer.getTokens(firstRow, lastRow);
        for (var row=firstRow; row<=lastRow; row++) {
            var lineEl = document.createElement("div");
            lineEl.className = "ace_line";
            var style = lineEl.style;
            style.height = this.session.getRowHeight(config, row) + "px";
            style.width = config.width + "px";

            var html = [];
            this.$renderLine(html, row, tokens[row-firstRow].tokens);
            // don't use setInnerHtml since we are working with an empty DIV
            lineEl.innerHTML = html.join("");
            fragment.appendChild(lineEl);
        }
        return fragment;
    };

    this.update = function(config) {
        this.$computeTabString();
        this.config = config;

        var html = [];
        var tokens = this.tokenizer.getTokens(config.firstRow, config.lastRow)
        var fragment = this.$renderLinesFragment(config, config.firstRow, config.lastRow);

        // Clear the current content of the element and add the rendered fragment.
        this.element.innerHTML =  "";
        this.element.appendChild(fragment);
    };

    this.$textToken = {
        "text": true,
        "rparen": true,
        "lparen": true
    };

    this.$renderLine = function(stringBuilder, row, tokens) {
        if (this.showInvisibles) {
            var self = this;
            var spaceRe = /( +)|([\v\f \u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000])/g;
            var spaceReplace = function(space) {
                if (space.charCodeAt(0) == 32)
                    return new Array(space.length+1).join("&nbsp;");
                else {
                    var space = new Array(space.length+1).join(self.SPACE_CHAR);
                    return "<span class='ace_invisible'>" + space + "</span>";
                }

            };
        }
        else {
            var spaceRe = /[\v\f \u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000]/g;
            var spaceReplace = "&nbsp;";
        }

        var _self = this;
        var characterWidth = this.config.characterWidth;
        function addToken(token, value) {
            var output = value
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(spaceRe, spaceReplace)
                .replace(/\t/g, _self.$tabString)
                .replace(/[\u3040-\u309F]|[\u30A0-\u30FF]|[\u4E00-\u9FFF\uF900-\uFAFF\u3400-\u4DBF]/g, function(c) {
                    return "<span class='ace_cjk' style='width:" + (characterWidth * 2) + "px'>" + c + "</span>"
                });

            if (!_self.$textToken[token.type]) {
                var classes = "ace_" + token.type.replace(/\./g, " ace_");
                stringBuilder.push("<span class='", classes, "'>", output, "</span>");
            }
            else {
                stringBuilder.push(output);
            }
        }

        var splits = this.session.getRowSplitData(row);
        var chars = 0, split = 0, splitChars;

        if (!splits || splits.length == 0) {
            splitChars = Number.MAX_VALUE;
        } else {
            splitChars = splits[0];
        }

        stringBuilder.push("<div style='height:",
            this.config.lineHeight, "px",
            "'>");
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            var value = token.value;

            if (chars + value.length < splitChars) {
                addToken(token, value);
                chars += value.length;
            } else {
                while (chars + value.length >= splitChars) {
                    addToken(token, value.substring(0, splitChars - chars));
                    value = value.substring(splitChars - chars);
                    chars = splitChars;
                    stringBuilder.push("</div>",
                        "<div style='height:",
                        this.config.lineHeight, "px",
                        "'>");
                    split ++;
                    splitChars = splits[split] || Number.MAX_VALUE;
                }
                if (value.length != 0) {
                    chars += value.length;
                    addToken(token, value);
                }
            }
        };

        if (this.showInvisibles) {
            if (row !== this.session.getLength() - 1) {
                stringBuilder.push("<span class='ace_invisible'>" + this.EOL_CHAR + "</span>");
            } else {
                stringBuilder.push("<span class='ace_invisible'>" + this.EOF_CHAR + "</span>");
            }
        }
        stringBuilder.push("</div>");
    };

}).call(Text.prototype);

exports.Text = Text;

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
 *      Julian Viereck <julian.viereck@gmail.com>
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

define('ace/layer/cursor', function(require, exports, module) {

var dom = require("pilot/dom");

var Cursor = function(parentEl) {
    this.element = document.createElement("div");
    this.element.className = "ace_layer ace_cursor-layer";
    parentEl.appendChild(this.element);

    this.cursor = document.createElement("div");
    this.cursor.className = "ace_cursor";

    this.isVisible = false;
};

(function() {

    this.setSession = function(session) {
        this.session = session;
    };

    this.setCursor = function(position, overwrite) {
        this.position =
            this.session.documentToScreenPosition(position);

        if (overwrite) {
            dom.addCssClass(this.cursor, "ace_overwrite");
        } else {
            dom.removeCssClass(this.cursor, "ace_overwrite");
        }
    };

    this.hideCursor = function() {
        this.isVisible = false;
        if (this.cursor.parentNode) {
            this.cursor.parentNode.removeChild(this.cursor);
        }
        clearInterval(this.blinkId);
    };

    this.showCursor = function() {
        this.isVisible = true;
        this.element.appendChild(this.cursor);

        var cursor = this.cursor;
        cursor.style.visibility = "visible";
        this.restartTimer();
    };

    this.restartTimer = function() {
        clearInterval(this.blinkId);
        if (!this.isVisible) {
            return;
        }

        var cursor = this.cursor;
        this.blinkId = setInterval(function() {
            cursor.style.visibility = "hidden";
            setTimeout(function() {
                cursor.style.visibility = "visible";
            }, 400);
        }, 1000);
    };

    this.getPixelPosition = function(onScreen) {
        if (!this.config || !this.position) {
            return {
                left : 0,
                top : 0
            };
        }

        var pos = this.position;
        var cursorLeft = Math.round(pos.column * this.config.characterWidth);
        var cursorTop = (pos.row - (onScreen ? this.config.firstRowScreen : 0)) *
            this.config.lineHeight;

        return {
            left : cursorLeft,
            top : cursorTop
        };
    };

    this.update = function(config) {
        if (!this.position)
            return;

        this.config = config;

        this.pixelPos = this.getPixelPosition(true);

        this.cursor.style.left = this.pixelPos.left + "px";
        this.cursor.style.top =  this.pixelPos.top + "px";
        this.cursor.style.width = config.characterWidth + "px";
        this.cursor.style.height = config.lineHeight + "px";

        if (this.isVisible) {
            this.element.appendChild(this.cursor);
        }
        this.restartTimer();
    };

}).call(Cursor.prototype);

exports.Cursor = Cursor;

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

define('ace/scrollbar', function(require, exports, module) {

var oop = require("pilot/oop");
var dom = require("pilot/dom");
var event = require("pilot/event");
var EventEmitter = require("pilot/event_emitter").EventEmitter;

var ScrollBar = function(parent) {
    this.element = document.createElement("div");
    this.element.className = "ace_sb";

    this.inner = document.createElement("div");
    this.element.appendChild(this.inner);

    parent.appendChild(this.element);

    this.width = dom.scrollbarWidth();
    this.element.style.width = this.width;

    event.addListener(this.element, "scroll", this.onScroll.bind(this));
};

(function() {
    oop.implement(this, EventEmitter);

    this.onScroll = function() {
        this._dispatchEvent("scroll", {data: this.element.scrollTop});
    };

    this.getWidth = function() {
        return this.width;
    };

    this.setHeight = function(height) {
        this.element.style.height = Math.max(0, height - this.width) + "px";
    };

    this.setInnerHeight = function(height) {
        this.inner.style.height = height + "px";
    };

    this.setScrollTop = function(scrollTop) {
        this.element.scrollTop = scrollTop;
    };

}).call(ScrollBar.prototype);

exports.ScrollBar = ScrollBar;
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

define('ace/renderloop', function(require, exports, module) {

var event = require("pilot/event");

var RenderLoop = function(onRender) {
    this.onRender = onRender;
    this.pending = false;
    this.changes = 0;
};

(function() {

    this.schedule = function(change) {
        //this.onRender(change);
        //return;
        this.changes = this.changes | change;
        if (!this.pending) {
            this.pending = true;
            var _self = this;
            this.setTimeoutZero(function() {
                _self.pending = false;
                var changes = _self.changes;
                _self.changes = 0;
                _self.onRender(changes);
            })
        }
    };

    if (window.postMessage) {

        this.messageName = "zero-timeout-message";

        this.setTimeoutZero = function(callback) {
            if (!this.attached) {
                var _self = this;
                event.addListener(window, "message", function(e) {
                    if (_self.callback && e.data == _self.messageName) {
                        event.stopPropagation(e);
                        _self.callback();
                    }
                });
                this.attached = true;
            }
            this.callback = callback;
            window.postMessage(this.messageName, "*");
        }

    } else {

        this.setTimeoutZero = function(callback) {
            setTimeout(callback, 0);
        }
    }

}).call(RenderLoop.prototype);

exports.RenderLoop = RenderLoop;
});
define("text!ace/css/editor.css", ".ace_editor {" +
  "    position: absolute;" +
  "    overflow: hidden;" +
  "" +
  "    font-family: \"Menlo\", \"Monaco\", \"Courier New\", monospace;" +
  "    font-size: 12px;  " +
  "}" +
  "" +
  ".ace_scroller {" +
  "    position: absolute;" +
  "    overflow-x: scroll;" +
  "    overflow-y: hidden;     " +
  "}" +
  "" +
  ".ace_content {" +
  "    position: absolute;" +
  "    box-sizing: border-box;" +
  "    -moz-box-sizing: border-box;" +
  "    -webkit-box-sizing: border-box;" +
  "}" +
  "" +
  ".ace_composition {" +
  "    position: absolute;" +
  "    background: #555;" +
  "    color: #DDD;" +
  "    z-index: 4;" +
  "}" +
  "" +
  ".ace_gutter {" +
  "    position: absolute;" +
  "    overflow-x: hidden;" +
  "    overflow-y: hidden;" +
  "    height: 100%;" +
  "}" +
  "" +
  ".ace_gutter-cell.ace_error {" +
  "    background-image: url(\"data:image/gif,GIF89a%10%00%10%00%D5%00%00%F5or%F5%87%88%F5nr%F4ns%EBmq%F5z%7F%DDJT%DEKS%DFOW%F1Yc%F2ah%CE(7%CE)8%D18E%DD%40M%F2KZ%EBU%60%F4%60m%DCir%C8%16(%C8%19*%CE%255%F1%3FR%F1%3FS%E6%AB%B5%CA%5DI%CEn%5E%F7%A2%9A%C9G%3E%E0a%5B%F7%89%85%F5yy%F6%82%80%ED%82%80%FF%BF%BF%E3%C4%C4%FF%FF%FF%FF%FF%FF%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00!%F9%04%01%00%00%25%00%2C%00%00%00%00%10%00%10%00%00%06p%C0%92pH%2C%1A%8F%C8%D2H%93%E1d4%23%E4%88%D3%09mB%1DN%B48%F5%90%40%60%92G%5B%94%20%3E%22%D2%87%24%FA%20%24%C5%06A%00%20%B1%07%02B%A38%89X.v%17%82%11%13q%10%0Fi%24%0F%8B%10%7BD%12%0Ei%09%92%09%0EpD%18%15%24%0A%9Ci%05%0C%18F%18%0B%07%04%01%04%06%A0H%18%12%0D%14%0D%12%A1I%B3%B4%B5IA%00%3B\");" +
  "    background-repeat: no-repeat;" +
  "    background-position: 4px center;" +
  "}" +
  "" +
  ".ace_gutter-cell.ace_warning {" +
  "    background-image: url(\"data:image/gif,GIF89a%10%00%10%00%D5%00%00%FF%DBr%FF%DE%81%FF%E2%8D%FF%E2%8F%FF%E4%96%FF%E3%97%FF%E5%9D%FF%E6%9E%FF%EE%C1%FF%C8Z%FF%CDk%FF%D0s%FF%D4%81%FF%D5%82%FF%D5%83%FF%DC%97%FF%DE%9D%FF%E7%B8%FF%CCl%7BQ%13%80U%15%82W%16%81U%16%89%5B%18%87%5B%18%8C%5E%1A%94d%1D%C5%83-%C9%87%2F%C6%84.%C6%85.%CD%8B2%C9%871%CB%8A3%CD%8B5%DC%98%3F%DF%9BB%E0%9CC%E1%A5U%CB%871%CF%8B5%D1%8D6%DB%97%40%DF%9AB%DD%99B%E3%B0p%E7%CC%AE%FF%FF%FF%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00!%F9%04%01%00%00%2F%00%2C%00%00%00%00%10%00%10%00%00%06a%C0%97pH%2C%1A%8FH%A1%ABTr%25%87%2B%04%82%F4%7C%B9X%91%08%CB%99%1C!%26%13%84*iJ9(%15G%CA%84%14%01%1A%97%0C%03%80%3A%9A%3E%81%84%3E%11%08%B1%8B%20%02%12%0F%18%1A%0F%0A%03'F%1C%04%0B%10%16%18%10%0B%05%1CF%1D-%06%07%9A%9A-%1EG%1B%A0%A1%A0U%A4%A5%A6BA%00%3B\");" +
  "    background-repeat: no-repeat;" +
  "    background-position: 4px center;" +
  "}" +
  "" +
  ".ace_editor .ace_sb {" +
  "    position: absolute;" +
  "    overflow-x: hidden;" +
  "    overflow-y: scroll;" +
  "    right: 0;" +
  "}" +
  "" +
  ".ace_editor .ace_sb div {" +
  "    position: absolute;" +
  "    width: 1px;" +
  "    left: 0;" +
  "}" +
  "" +
  ".ace_editor .ace_print_margin_layer {" +
  "    z-index: 0;" +
  "    position: absolute;" +
  "    overflow: hidden;" +
  "    margin: 0;" +
  "    left: 0;" +
  "    height: 100%;" +
  "    width: 100%;" +
  "}" +
  "" +
  ".ace_editor .ace_print_margin {" +
  "    position: absolute;" +
  "    height: 100%;" +
  "}" +
  "" +
  ".ace_editor textarea {" +
  "    position: fixed;" +
  "    z-index: -1;" +
  "    width: 10px;" +
  "    height: 30px;" +
  "    opacity: 0;" +
  "    background: transparent;" +
  "    appearance: none;" +
  "    border: none;" +
  "    resize: none;" +
  "    outline: none;" +
  "    overflow: hidden;" +
  "}" +
  "" +
  ".ace_layer {" +
  "    z-index: 1;" +
  "    position: absolute;" +
  "    overflow: hidden;  " +
  "    white-space: nowrap;" +
  "    height: 100%;" +
  "    width: 100%;" +
  "}" +
  "" +
  ".ace_text-layer {" +
  "    font-family: Monaco, \"Courier New\", monospace;" +
  "    color: black;" +
  "}" +
  "" +
  ".ace_cjk {" +
  "    display: inline-block;" +
  "    text-align: center;" +
  "}" +
  "" +
  ".ace_cursor-layer {" +
  "    z-index: 4;" +
  "    cursor: text;" +
  "    pointer-events: none;" +
  "}" +
  "" +
  ".ace_cursor {" +
  "    z-index: 4;" +
  "    position: absolute;" +
  "}" +
  "" +
  ".ace_line {" +
  "    white-space: nowrap;" +
  "}" +
  "" +
  ".ace_marker-layer {" +
  "}" +
  "" +
  ".ace_marker-layer .ace_step {" +
  "    position: absolute;" +
  "    z-index: 3;" +
  "}" +
  "" +
  ".ace_marker-layer .ace_selection {" +
  "    position: absolute;" +
  "    z-index: 4;" +
  "}" +
  "" +
  ".ace_marker-layer .ace_bracket {" +
  "    position: absolute;" +
  "    z-index: 5;" +
  "}" +
  "" +
  ".ace_marker-layer .ace_active_line {" +
  "    position: absolute;" +
  "    z-index: 2;" +
  "}" +
  "");

define("text!ace/theme/eclipse.css", ".ace-eclipse .ace_editor {" +
  "  border: 2px solid rgb(159, 159, 159);" +
  "}" +
  "" +
  ".ace-eclipse .ace_editor.ace_focus {" +
  "  border: 2px solid #327fbd;" +
  "}" +
  "" +
  ".ace-eclipse .ace_gutter {" +
  "  width: 40px;" +
  "  background: rgb(227, 227, 227);" +
  "  border-right: 1px solid rgb(159, 159, 159);	 " +
  "  color: rgb(136, 136, 136);" +
  "}" +
  "" +
  ".ace-eclipse .ace_gutter-layer {" +
  "  right: 10px;" +
  "  text-align: right;" +
  "}" +
  "" +
  ".ace-eclipse .ace_text-layer {" +
  "  cursor: text;" +
  "}" +
  "" +
  ".ace-eclipse .ace_cursor {" +
  "  border-left: 1px solid black;" +
  "}" +
  "" +
  ".ace-eclipse .ace_line .ace_keyword, .ace-eclipse .ace_line .ace_variable {" +
  "  color: rgb(127, 0, 85);" +
  "}" +
  "" +
  ".ace-eclipse .ace_line .ace_constant.ace_buildin {" +
  "  color: rgb(88, 72, 246);" +
  "}" +
  "" +
  ".ace-eclipse .ace_line .ace_constant.ace_library {" +
  "  color: rgb(6, 150, 14);" +
  "}" +
  "" +
  ".ace-eclipse .ace_line .ace_function {" +
  "  color: rgb(60, 76, 114);" +
  "}" +
  "" +
  ".ace-eclipse .ace_line .ace_string {" +
  "  color: rgb(42, 0, 255);" +
  "}" +
  "" +
  ".ace-eclipse .ace_line .ace_comment {" +
  "  color: rgb(63, 127, 95);" +
  "}" +
  "" +
  ".ace-eclipse .ace_line .ace_comment.ace_doc {" +
  "  color: rgb(63, 95, 191);" +
  "}" +
  "" +
  ".ace-eclipse .ace_line .ace_comment.ace_doc.ace_tag {" +
  "  color: rgb(127, 159, 191);" +
  "}" +
  "" +
  ".ace-eclipse .ace_line .ace_constant.ace_numeric {" +
  "}" +
  "" +
  ".ace-eclipse .ace_line .ace_tag {" +
  "	color: rgb(63, 127, 127);" +
  "}" +
  "" +
  ".ace-eclipse .ace_line .ace_xml_pe {" +
  "  color: rgb(104, 104, 91);" +
  "}" +
  "" +
  ".ace-eclipse .ace_marker-layer .ace_selection {" +
  "  background: rgb(181, 213, 255);" +
  "}" +
  "" +
  ".ace-eclipse .ace_marker-layer .ace_bracket {" +
  "  margin: -1px 0 0 -1px;" +
  "  border: 1px solid rgb(192, 192, 192);" +
  "}" +
  "" +
  ".ace-eclipse .ace_marker-layer .ace_active_line {" +
  "  background: rgb(232, 242, 254);" +
  "}");

define("text!ace/theme/tm.css", ".ace-tm .ace_editor {" +
  "  border: 2px solid rgb(159, 159, 159);" +
  "}" +
  "" +
  ".ace-tm .ace_editor.ace_focus {" +
  "  border: 2px solid #327fbd;" +
  "}" +
  "" +
  ".ace-tm .ace_gutter {" +
  "  width: 50px;" +
  "  background: #e8e8e8;" +
  "  color: #333;" +
  "  overflow : hidden;" +
  "}" +
  "" +
  ".ace-tm .ace_gutter-layer {" +
  "  width: 100%;" +
  "  text-align: right;" +
  "}" +
  "" +
  ".ace-tm .ace_gutter-layer .ace_gutter-cell {" +
  "  padding-right: 6px;" +
  "}" +
  "" +
  ".ace-tm .ace_print_margin {" +
  "  width: 1px;" +
  "  background: #e8e8e8;" +
  "}" +
  "" +
  ".ace-tm .ace_text-layer {" +
  "  cursor: text;" +
  "}" +
  "" +
  ".ace-tm .ace_cursor {" +
  "  border-left: 2px solid black;" +
  "}" +
  "" +
  ".ace-tm .ace_cursor.ace_overwrite {" +
  "  border-left: 0px;" +
  "  border-bottom: 1px solid black;" +
  "}" +
  "        " +
  ".ace-tm .ace_line .ace_invisible {" +
  "  color: rgb(191, 191, 191);" +
  "}" +
  "" +
  ".ace-tm .ace_line .ace_keyword {" +
  "  color: blue;" +
  "}" +
  "" +
  ".ace-tm .ace_line .ace_constant.ace_buildin {" +
  "  color: rgb(88, 72, 246);" +
  "}" +
  "" +
  ".ace-tm .ace_line .ace_constant.ace_language {" +
  "  color: rgb(88, 92, 246);" +
  "}" +
  "" +
  ".ace-tm .ace_line .ace_constant.ace_library {" +
  "  color: rgb(6, 150, 14);" +
  "}" +
  "" +
  ".ace-tm .ace_line .ace_invalid {" +
  "  background-color: rgb(153, 0, 0);" +
  "  color: white;" +
  "}" +
  "" +
  ".ace-tm .ace_line .ace_support.ace_function {" +
  "  color: rgb(60, 76, 114);" +
  "}" +
  "" +
  ".ace-tm .ace_line .ace_support.ace_constant {" +
  "  color: rgb(6, 150, 14);" +
  "}" +
  "" +
  ".ace-tm .ace_line .ace_support.ace_type," +
  ".ace-tm .ace_line .ace_support.ace_class {" +
  "  color: rgb(109, 121, 222);" +
  "}" +
  "" +
  ".ace-tm .ace_line .ace_keyword.ace_operator {" +
  "  color: rgb(104, 118, 135);" +
  "}" +
  "" +
  ".ace-tm .ace_line .ace_string {" +
  "  color: rgb(3, 106, 7);" +
  "}" +
  "" +
  ".ace-tm .ace_line .ace_comment {" +
  "  color: rgb(76, 136, 107);" +
  "}" +
  "" +
  ".ace-tm .ace_line .ace_comment.ace_doc {" +
  "  color: rgb(0, 102, 255);" +
  "}" +
  "" +
  ".ace-tm .ace_line .ace_comment.ace_doc.ace_tag {" +
  "  color: rgb(128, 159, 191);" +
  "}" +
  "" +
  ".ace-tm .ace_line .ace_constant.ace_numeric {" +
  "  color: rgb(0, 0, 205);" +
  "}" +
  "" +
  ".ace-tm .ace_line .ace_variable {" +
  "  color: rgb(49, 132, 149);" +
  "}" +
  "" +
  ".ace-tm .ace_line .ace_xml_pe {" +
  "  color: rgb(104, 104, 91);" +
  "}" +
  "" +
  ".ace-tm .ace_marker-layer .ace_selection {" +
  "  background: rgb(181, 213, 255);" +
  "}" +
  "" +
  ".ace-tm .ace_marker-layer .ace_step {" +
  "  background: rgb(252, 255, 0);" +
  "}" +
  "" +
  ".ace-tm .ace_marker-layer .ace_stack {" +
  "  background: rgb(164, 229, 101);" +
  "}" +
  "" +
  ".ace-tm .ace_marker-layer .ace_bracket {" +
  "  margin: -1px 0 0 -1px;" +
  "  border: 1px solid rgb(192, 192, 192);" +
  "}" +
  "" +
  ".ace-tm .ace_marker-layer .ace_active_line {" +
  "  background: rgb(232, 242, 254);" +
  "}" +
  "" +
  ".ace-tm .ace_string.ace_regex {" +
  "  color: rgb(255, 0, 0)   " +
  "}");

define("text!icons/epl.html", "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">" +
  "<!-- saved from url=(0049)http://www.eclipse.org/org/documents/epl-v10.html -->" +
  "<html xmlns=\"http://www.w3.org/1999/xhtml\"><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=ISO-8859-1\">" +
  "" +
  "<title>Eclipse Public License - Version 1.0</title>" +
  "<style type=\"text/css\">" +
  "  body {" +
  "    size: 8.5in 11.0in;" +
  "    margin: 0.25in 0.5in 0.25in 0.5in;" +
  "    tab-interval: 0.5in;" +
  "    }" +
  "  p {  	" +
  "    margin-left: auto;" +
  "    margin-top:  0.5em;" +
  "    margin-bottom: 0.5em;" +
  "    }" +
  "  p.list {" +
  "  	margin-left: 0.5in;" +
  "    margin-top:  0.05em;" +
  "    margin-bottom: 0.05em;" +
  "    }" +
  "  </style>" +
  "" +
  "<script src=\"chrome-extension://jgghnecdoiloelcogfmgjgcacadpaejf/inject.js\"></script></head>" +
  "" +
  "<body lang=\"EN-US\">" +
  "" +
  "<h2>Eclipse Public License - v 1.0</h2>" +
  "" +
  "<p>THE ACCOMPANYING PROGRAM IS PROVIDED UNDER THE TERMS OF THIS ECLIPSE" +
  "PUBLIC LICENSE (\"AGREEMENT\"). ANY USE, REPRODUCTION OR" +
  "DISTRIBUTION OF THE PROGRAM CONSTITUTES RECIPIENT'S ACCEPTANCE OF THIS" +
  "AGREEMENT.</p>" +
  "" +
  "<p><b>1. DEFINITIONS</b></p>" +
  "" +
  "<p>\"Contribution\" means:</p>" +
  "" +
  "<p class=\"list\">a) in the case of the initial Contributor, the initial" +
  "code and documentation distributed under this Agreement, and</p>" +
  "<p class=\"list\">b) in the case of each subsequent Contributor:</p>" +
  "<p class=\"list\">i) changes to the Program, and</p>" +
  "<p class=\"list\">ii) additions to the Program;</p>" +
  "<p class=\"list\">where such changes and/or additions to the Program" +
  "originate from and are distributed by that particular Contributor. A" +
  "Contribution 'originates' from a Contributor if it was added to the" +
  "Program by such Contributor itself or anyone acting on such" +
  "Contributor's behalf. Contributions do not include additions to the" +
  "Program which: (i) are separate modules of software distributed in" +
  "conjunction with the Program under their own license agreement, and (ii)" +
  "are not derivative works of the Program.</p>" +
  "" +
  "<p>\"Contributor\" means any person or entity that distributes" +
  "the Program.</p>" +
  "" +
  "<p>\"Licensed Patents\" mean patent claims licensable by a" +
  "Contributor which are necessarily infringed by the use or sale of its" +
  "Contribution alone or when combined with the Program.</p>" +
  "" +
  "<p>\"Program\" means the Contributions distributed in accordance" +
  "with this Agreement.</p>" +
  "" +
  "<p>\"Recipient\" means anyone who receives the Program under" +
  "this Agreement, including all Contributors.</p>" +
  "" +
  "<p><b>2. GRANT OF RIGHTS</b></p>" +
  "" +
  "<p class=\"list\">a) Subject to the terms of this Agreement, each" +
  "Contributor hereby grants Recipient a non-exclusive, worldwide," +
  "royalty-free copyright license to reproduce, prepare derivative works" +
  "of, publicly display, publicly perform, distribute and sublicense the" +
  "Contribution of such Contributor, if any, and such derivative works, in" +
  "source code and object code form.</p>" +
  "" +
  "<p class=\"list\">b) Subject to the terms of this Agreement, each" +
  "Contributor hereby grants Recipient a non-exclusive, worldwide," +
  "royalty-free patent license under Licensed Patents to make, use, sell," +
  "offer to sell, import and otherwise transfer the Contribution of such" +
  "Contributor, if any, in source code and object code form. This patent" +
  "license shall apply to the combination of the Contribution and the" +
  "Program if, at the time the Contribution is added by the Contributor," +
  "such addition of the Contribution causes such combination to be covered" +
  "by the Licensed Patents. The patent license shall not apply to any other" +
  "combinations which include the Contribution. No hardware per se is" +
  "licensed hereunder.</p>" +
  "" +
  "<p class=\"list\">c) Recipient understands that although each Contributor" +
  "grants the licenses to its Contributions set forth herein, no assurances" +
  "are provided by any Contributor that the Program does not infringe the" +
  "patent or other intellectual property rights of any other entity. Each" +
  "Contributor disclaims any liability to Recipient for claims brought by" +
  "any other entity based on infringement of intellectual property rights" +
  "or otherwise. As a condition to exercising the rights and licenses" +
  "granted hereunder, each Recipient hereby assumes sole responsibility to" +
  "secure any other intellectual property rights needed, if any. For" +
  "example, if a third party patent license is required to allow Recipient" +
  "to distribute the Program, it is Recipient's responsibility to acquire" +
  "that license before distributing the Program.</p>" +
  "" +
  "<p class=\"list\">d) Each Contributor represents that to its knowledge it" +
  "has sufficient copyright rights in its Contribution, if any, to grant" +
  "the copyright license set forth in this Agreement.</p>" +
  "" +
  "<p><b>3. REQUIREMENTS</b></p>" +
  "" +
  "<p>A Contributor may choose to distribute the Program in object code" +
  "form under its own license agreement, provided that:</p>" +
  "" +
  "<p class=\"list\">a) it complies with the terms and conditions of this" +
  "Agreement; and</p>" +
  "" +
  "<p class=\"list\">b) its license agreement:</p>" +
  "" +
  "<p class=\"list\">i) effectively disclaims on behalf of all Contributors" +
  "all warranties and conditions, express and implied, including warranties" +
  "or conditions of title and non-infringement, and implied warranties or" +
  "conditions of merchantability and fitness for a particular purpose;</p>" +
  "" +
  "<p class=\"list\">ii) effectively excludes on behalf of all Contributors" +
  "all liability for damages, including direct, indirect, special," +
  "incidental and consequential damages, such as lost profits;</p>" +
  "" +
  "<p class=\"list\">iii) states that any provisions which differ from this" +
  "Agreement are offered by that Contributor alone and not by any other" +
  "party; and</p>" +
  "" +
  "<p class=\"list\">iv) states that source code for the Program is available" +
  "from such Contributor, and informs licensees how to obtain it in a" +
  "reasonable manner on or through a medium customarily used for software" +
  "exchange.</p>" +
  "" +
  "<p>When the Program is made available in source code form:</p>" +
  "" +
  "<p class=\"list\">a) it must be made available under this Agreement; and</p>" +
  "" +
  "<p class=\"list\">b) a copy of this Agreement must be included with each" +
  "copy of the Program.</p>" +
  "" +
  "<p>Contributors may not remove or alter any copyright notices contained" +
  "within the Program.</p>" +
  "" +
  "<p>Each Contributor must identify itself as the originator of its" +
  "Contribution, if any, in a manner that reasonably allows subsequent" +
  "Recipients to identify the originator of the Contribution.</p>" +
  "" +
  "<p><b>4. COMMERCIAL DISTRIBUTION</b></p>" +
  "" +
  "<p>Commercial distributors of software may accept certain" +
  "responsibilities with respect to end users, business partners and the" +
  "like. While this license is intended to facilitate the commercial use of" +
  "the Program, the Contributor who includes the Program in a commercial" +
  "product offering should do so in a manner which does not create" +
  "potential liability for other Contributors. Therefore, if a Contributor" +
  "includes the Program in a commercial product offering, such Contributor" +
  "(\"Commercial Contributor\") hereby agrees to defend and" +
  "indemnify every other Contributor (\"Indemnified Contributor\")" +
  "against any losses, damages and costs (collectively \"Losses\")" +
  "arising from claims, lawsuits and other legal actions brought by a third" +
  "party against the Indemnified Contributor to the extent caused by the" +
  "acts or omissions of such Commercial Contributor in connection with its" +
  "distribution of the Program in a commercial product offering. The" +
  "obligations in this section do not apply to any claims or Losses" +
  "relating to any actual or alleged intellectual property infringement. In" +
  "order to qualify, an Indemnified Contributor must: a) promptly notify" +
  "the Commercial Contributor in writing of such claim, and b) allow the" +
  "Commercial Contributor to control, and cooperate with the Commercial" +
  "Contributor in, the defense and any related settlement negotiations. The" +
  "Indemnified Contributor may participate in any such claim at its own" +
  "expense.</p>" +
  "" +
  "<p>For example, a Contributor might include the Program in a commercial" +
  "product offering, Product X. That Contributor is then a Commercial" +
  "Contributor. If that Commercial Contributor then makes performance" +
  "claims, or offers warranties related to Product X, those performance" +
  "claims and warranties are such Commercial Contributor's responsibility" +
  "alone. Under this section, the Commercial Contributor would have to" +
  "defend claims against the other Contributors related to those" +
  "performance claims and warranties, and if a court requires any other" +
  "Contributor to pay any damages as a result, the Commercial Contributor" +
  "must pay those damages.</p>" +
  "" +
  "<p><b>5. NO WARRANTY</b></p>" +
  "" +
  "<p>EXCEPT AS EXPRESSLY SET FORTH IN THIS AGREEMENT, THE PROGRAM IS" +
  "PROVIDED ON AN \"AS IS\" BASIS, WITHOUT WARRANTIES OR CONDITIONS" +
  "OF ANY KIND, EITHER EXPRESS OR IMPLIED INCLUDING, WITHOUT LIMITATION," +
  "ANY WARRANTIES OR CONDITIONS OF TITLE, NON-INFRINGEMENT, MERCHANTABILITY" +
  "OR FITNESS FOR A PARTICULAR PURPOSE. Each Recipient is solely" +
  "responsible for determining the appropriateness of using and" +
  "distributing the Program and assumes all risks associated with its" +
  "exercise of rights under this Agreement , including but not limited to" +
  "the risks and costs of program errors, compliance with applicable laws," +
  "damage to or loss of data, programs or equipment, and unavailability or" +
  "interruption of operations.</p>" +
  "" +
  "<p><b>6. DISCLAIMER OF LIABILITY</b></p>" +
  "" +
  "<p>EXCEPT AS EXPRESSLY SET FORTH IN THIS AGREEMENT, NEITHER RECIPIENT" +
  "NOR ANY CONTRIBUTORS SHALL HAVE ANY LIABILITY FOR ANY DIRECT, INDIRECT," +
  "INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING" +
  "WITHOUT LIMITATION LOST PROFITS), HOWEVER CAUSED AND ON ANY THEORY OF" +
  "LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING" +
  "NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OR" +
  "DISTRIBUTION OF THE PROGRAM OR THE EXERCISE OF ANY RIGHTS GRANTED" +
  "HEREUNDER, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>" +
  "" +
  "<p><b>7. GENERAL</b></p>" +
  "" +
  "<p>If any provision of this Agreement is invalid or unenforceable under" +
  "applicable law, it shall not affect the validity or enforceability of" +
  "the remainder of the terms of this Agreement, and without further action" +
  "by the parties hereto, such provision shall be reformed to the minimum" +
  "extent necessary to make such provision valid and enforceable.</p>" +
  "" +
  "<p>If Recipient institutes patent litigation against any entity" +
  "(including a cross-claim or counterclaim in a lawsuit) alleging that the" +
  "Program itself (excluding combinations of the Program with other" +
  "software or hardware) infringes such Recipient's patent(s), then such" +
  "Recipient's rights granted under Section 2(b) shall terminate as of the" +
  "date such litigation is filed.</p>" +
  "" +
  "<p>All Recipient's rights under this Agreement shall terminate if it" +
  "fails to comply with any of the material terms or conditions of this" +
  "Agreement and does not cure such failure in a reasonable period of time" +
  "after becoming aware of such noncompliance. If all Recipient's rights" +
  "under this Agreement terminate, Recipient agrees to cease use and" +
  "distribution of the Program as soon as reasonably practicable. However," +
  "Recipient's obligations under this Agreement and any licenses granted by" +
  "Recipient relating to the Program shall continue and survive.</p>" +
  "" +
  "<p>Everyone is permitted to copy and distribute copies of this" +
  "Agreement, but in order to avoid inconsistency the Agreement is" +
  "copyrighted and may only be modified in the following manner. The" +
  "Agreement Steward reserves the right to publish new versions (including" +
  "revisions) of this Agreement from time to time. No one other than the" +
  "Agreement Steward has the right to modify this Agreement. The Eclipse" +
  "Foundation is the initial Agreement Steward. The Eclipse Foundation may" +
  "assign the responsibility to serve as the Agreement Steward to a" +
  "suitable separate entity. Each new version of the Agreement will be" +
  "given a distinguishing version number. The Program (including" +
  "Contributions) may always be distributed subject to the version of the" +
  "Agreement under which it was received. In addition, after a new version" +
  "of the Agreement is published, Contributor may elect to distribute the" +
  "Program (including its Contributions) under the new version. Except as" +
  "expressly stated in Sections 2(a) and 2(b) above, Recipient receives no" +
  "rights or licenses to the intellectual property of any Contributor under" +
  "this Agreement, whether expressly, by implication, estoppel or" +
  "otherwise. All rights in the Program not expressly granted under this" +
  "Agreement are reserved.</p>" +
  "" +
  "<p>This Agreement is governed by the laws of the State of New York and" +
  "the intellectual property laws of the United States of America. No party" +
  "to this Agreement will bring a legal action under this Agreement more" +
  "than one year after the cause of action arose. Each party waives its" +
  "rights to a jury trial in any resulting litigation.</p>" +
  "" +
  "" +
  "" +
  "" +
  "</body></html>");

define("text!styles.css", "html {" +
  "    height: 100%;" +
  "    overflow: hidden;" +
  "}" +
  "" +
  "body {" +
  "    overflow: hidden;" +
  "    margin: 0;" +
  "    padding: 0;" +
  "    height: 100%;" +
  "    width: 100%;" +
  "    font-family: Arial, Helvetica, sans-serif, Tahoma, Verdana, sans-serif;" +
  "    font-size: 12px;" +
  "    background: rgb(14, 98, 165);" +
  "    color: white;" +
  "}" +
  "" +
  "#editor {" +
  "    position: absolute;" +
  "    top: 60px;" +
  "    left: 0px;" +
  "    background: white;" +
  "}" +
  "" +
  "#controls {" +
  "    width: 100%;" +
  "}" +
  "" +
  "#cockpitInput {" +
  "    position: absolute;" +
  "    width: 100%;" +
  "    bottom: 0;" +
  "" +
  "    border: none; outline: none;" +
  "    font-family: consolas, courier, monospace;" +
  "    font-size: 120%;" +
  "}" +
  "" +
  "#cockpitOutput {" +
  "    padding: 10px;" +
  "    margin: 0 15px;" +
  "    border: 1px solid #AAA;" +
  "    -moz-border-radius-topleft: 10px;" +
  "    -moz-border-radius-topright: 10px;" +
  "    border-top-left-radius: 4px; border-top-right-radius: 4px;" +
  "    background: #DDD; color: #000;" +
  "}");

define("text!icons/error_obj.gif", "data:image/gif;base64,R0lGODlhEAAQANUAAPVvcvWHiPVucvRuc+ttcfV6f91KVN5LU99PV/FZY/JhaM4oN84pONE4Rd1ATfJLWutVYPRgbdxpcsgWKMgZKs4lNfE/UvE/U+artcpdSc5uXveimslHPuBhW/eJhfV5efaCgO2CgP+/v+PExP///////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAACUALAAAAAAQABAAAAZwwJJwSCwaj8jSSJPhZDQj5IjTCW1CHU60OPWQQGCSR1uUID4i0ock+iAkxQZBACCxBwJCoziJWC52F4IRE3EQD2kkD4sQe0QSDmkJkgkOcEQYFSQKnGkFDBhGGAsHBAEEBqBIGBINFA0SoUmztLVJQQA7");

define("text!icons/warning_obj.gif", "data:image/gif;base64,R0lGODlhEAAQANUAAP/bcv/egf/ijf/ij//klv/jl//lnf/mnv/uwf/IWv/Na//Qc//Ugf/Vgv/Vg//cl//enf/nuP/MbHtRE4BVFYJXFoFVFolbGIdbGIxeGpRkHcWDLcmHL8aELsaFLs2LMsmHMcuKM82LNdyYP9+bQuCcQ+GlVcuHMc+LNdGNNtuXQN+aQt2ZQuOwcOfMrv///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAC8ALAAAAAAQABAAAAZhwJdwSCwaj0ihq1RyJYcrBIL0fLlYkQjLmRwhJhOEKmlKOSgVR8qEFAEalwwDgDqaPoGEPhEIsYsgAhIPGBoPCgMnRhwECxAWGBALBRxGHS0GB5qaLR5HG6ChoFWkpaZCQQA7");

define("text!logo.png", "data:image/png;base64,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");

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
 * The Original Code is Mozilla Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Kevin Dangoor (kdangoor@mozilla.com)
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

var deps = [
    "pilot/fixoldbrowsers",
    "pilot/index",
    "pilot/plugin_manager",
    "pilot/environment",
    "ace/editor",
    "ace/edit_session",
    "ace/virtual_renderer",
    "ace/undomanager",
    "ace/theme/textmate"
];

require(deps, function() {
    var catalog = require("pilot/plugin_manager").catalog;
    catalog.registerPlugins([ "pilot/index" ]);
    
    var Dom = require("pilot/dom");
    var Event = require("pilot/event");
    
    var Editor = require("ace/editor").Editor;
    var EditSession = require("ace/edit_session").EditSession;
    var UndoManager = require("ace/undomanager").UndoManager;
    var Renderer = require("ace/virtual_renderer").VirtualRenderer;
    
    window.ace = {
        edit: function(el) {
            if (typeof(el) == "string") {
                el = document.getElementById(el);
            }
            
            var doc = new EditSession(Dom.getInnerText(el));
            doc.setUndoManager(new UndoManager());
            el.innerHTML = '';

            var editor = new Editor(new Renderer(el, "ace/theme/textmate"));
            editor.setSession(doc);
            
            var env = require("pilot/environment").create();
            catalog.startupPlugins({ env: env }).then(function() {
                env.document = doc;
                env.editor = env;
                editor.resize();
                Event.addListener(window, "resize", function() {
                    editor.resize();
                });
                el.env = env;
            });
            return editor;
        }
    };
});
